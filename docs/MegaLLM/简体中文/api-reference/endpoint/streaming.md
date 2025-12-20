# 流式传输

> 使用服务器发送事件（SSE）实时流式传输 AI 响应，改善交互式应用程序的用户体验。

## 概述

流式传输允许您在生成响应 token 时接收它们，而不是等待完整响应。这非常适合：

* **聊天机器人** - 在键入时显示响应
* **实时助手** - 实时显示进度
* **长响应** - 立即开始显示内容
* **更好的用户体验** - 减少感知延迟

## 工作原理

<Steps>
  <Step title="启用流式传输">
    在请求中设置 `stream: true`
  </Step>

  <Step title="接收数据块">
    通过 SSE 逐步获取响应 token
  </Step>

  <Step title="处理事件">
    解析包含 JSON 数据块的 `data:` 事件
  </Step>

  <Step title="处理完成">
    监听 `[DONE]` 信号以了解何时完成
  </Step>
</Steps>

## 端点

流式传输适用于两种 API 格式：

```
POST https://ai.megallm.io/v1/chat/completions
POST https://ai.megallm.io/v1/messages
```

两个端点都支持 `stream: true` 参数。

## 请求格式

### OpenAI 格式

```json  theme={null}
{
  "model": "gpt-4",
  "messages": [
    {"role": "user", "content": "Tell me a story"}
  ],
  "stream": true
}
```

### Anthropic 格式

```json  theme={null}
{
  "model": "claude-3.5-sonnet",
  "max_tokens": 500,
  "messages": [
    {"role": "user", "content": "Tell me a story"}
  ],
  "stream": true
}
```

## 响应格式

### 事件流结构

响应以服务器发送事件的形式发送：

```
data: {"id":"chatcmpl-abc","object":"chat.completion.chunk","created":1677858242,"model":"gpt-4","choices":[{"index":0,"delta":{"role":"assistant"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc","object":"chat.completion.chunk","created":1677858242,"model":"gpt-4","choices":[{"index":0,"delta":{"content":"Once"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc","object":"chat.completion.chunk","created":1677858242,"model":"gpt-4","choices":[{"index":0,"delta":{"content":" upon"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc","object":"chat.completion.chunk","created":1677858242,"model":"gpt-4","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

data: [DONE]
```

### 流生命周期

1. **初始数据块** - 包含角色：

```json  theme={null}
{"choices": [{"delta": {"role": "assistant"}}]}
```

2. **内容数据块** - 增量文本：

```json  theme={null}
{"choices": [{"delta": {"content": "Hello"}}]}
{"choices": [{"delta": {"content": " world"}}]}
```

3. **最终数据块** - 包含 finish\_reason：

```json  theme={null}
{"choices": [{"delta": {}, "finish_reason": "stop"}]}
```

4. **流结束**：

```
data: [DONE]
```

## 实现示例

<Tabs>
  <Tab title="Python">
    ```python  theme={null}
    from openai import OpenAI

    client = OpenAI(
        base_url="https://ai.megallm.io/v1",
        api_key="your-api-key"
    )

    # Create streaming completion
    stream = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "user", "content": "Tell me a story"}
        ],
        stream=True
    )

    # Process the stream
    for chunk in stream:
        if chunk.choices[0].delta.content is not None:
            print(chunk.choices[0].delta.content, end="", flush=True)
    ```

    ### Async Python

    ```python  theme={null}
    import asyncio
    from openai import AsyncOpenAI

    client = AsyncOpenAI(
        base_url="https://ai.megallm.io/v1",
        api_key="your-api-key"
    )

    async def stream_chat():
        stream = await client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": "Tell me a story"}],
            stream=True
        )

        async for chunk in stream:
            if chunk.choices[0].delta.content:
                print(chunk.choices[0].delta.content, end="", flush=True)

    asyncio.run(stream_chat())
    ```
  </Tab>

  <Tab title="JavaScript">
    ```javascript  theme={null}
    import OpenAI from 'openai';

    const openai = new OpenAI({
      baseURL: 'https://ai.megallm.io/v1',
      apiKey: process.env.MEGALLM_API_KEY,
    });

    async function streamChat() {
      const stream = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: 'Tell me a story' }],
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        process.stdout.write(content);
      }
    }

    streamChat();
    ```
  </Tab>

  <Tab title="Browser">
    ```javascript  theme={null}
    async function streamChatInBrowser() {
      const response = await fetch('https://ai.megallm.io/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [{ role: 'user', content: 'Tell me a story' }],
          stream: true,
        }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') return;

            try {
              const json = JSON.parse(data);
              const content = json.choices[0]?.delta?.content || '';
              // Display content to user
              document.getElementById('output').innerHTML += content;
            } catch (e) {
              console.error('Parse error:', e);
            }
          }
        }
      }
    }
    ```
  </Tab>

  <Tab title="React">
    ```jsx  theme={null}
    import { useState } from 'react';

    function StreamingChat() {
      const [messages, setMessages] = useState([]);
      const [streaming, setStreaming] = useState(false);
      const [currentResponse, setCurrentResponse] = useState('');

      const sendMessage = async (content) => {
        setStreaming(true);
        setCurrentResponse('');

        const response = await fetch('https://ai.megallm.io/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [...messages, { role: 'user', content }],
            stream: true,
          }),
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                setMessages(prev => [...prev,
                  { role: 'user', content },
                  { role: 'assistant', content: accumulated }
                ]);
                setStreaming(false);
                return;
              }

              try {
                const json = JSON.parse(data);
                const content = json.choices[0]?.delta?.content || '';
                accumulated += content;
                setCurrentResponse(accumulated);
              } catch (e) {
                // Handle parse errors
              }
            }
          }
        }
      };

      return (
        <div>
          {messages.map((msg, i) => (
            <div key={i} className={msg.role}>
              {msg.content}
            </div>
          ))}
          {streaming && (
            <div className="assistant">
              {currentResponse}
              <span className="cursor">▊</span>
            </div>
          )}
        </div>
      );
    }
    ```
  </Tab>

  <Tab title="cURL">
    ```bash  theme={null}
    curl -N https://ai.megallm.io/v1/chat/completions \
      -H "Authorization: Bearer $MEGALLM_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "model": "gpt-4",
        "messages": [{"role": "user", "content": "Tell me a story"}],
        "stream": true
      }'
    ```

    使用 jq 处理：

    ```bash  theme={null}
    curl -N https://ai.megallm.io/v1/chat/completions \
      -H "Authorization: Bearer $MEGALLM_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "model": "gpt-4",
        "messages": [{"role": "user", "content": "Tell me a joke"}],
        "stream": true
      }' | while read -r line; do
        if [[ $line == data:* ]]; then
          json="${line:6}"
          if [[ $json != "[DONE]" ]]; then
            echo -n $(echo "$json" | jq -r '.choices[0].delta.content // ""')
          fi
        fi
      done
    ```
  </Tab>
</Tabs>

## 高级功能

### 流式传输中的函数调用

```python  theme={null}
stream = client.chat.completions.create(
    model="gpt-4",
    messages=messages,
    tools=tools,
    stream=True
)

function_call = {"name": "", "arguments": ""}

for chunk in stream:
    delta = chunk.choices[0].delta

    if delta.tool_calls:
        tool_call = delta.tool_calls[0]
        if tool_call.function.name:
            function_call["name"] = tool_call.function.name
        if tool_call.function.arguments:
            function_call["arguments"] += tool_call.function.arguments

    elif delta.content:
        print(delta.content, end="", flush=True)

# Execute function when complete
if function_call["name"]:
    result = execute_function(function_call)
```

### 进度跟踪

```python  theme={null}
import time

class StreamProgress:
    def __init__(self):
        self.tokens = 0
        self.chunks = 0
        self.start_time = time.time()

    def update(self, chunk):
        self.chunks += 1
        if chunk.choices[0].delta.content:
            # Approximate token count
            self.tokens += len(chunk.choices[0].delta.content.split())

    def get_stats(self):
        elapsed = time.time() - self.start_time
        return {
            "chunks": self.chunks,
            "tokens": self.tokens,
            "time": elapsed,
            "tokens_per_second": self.tokens / elapsed if elapsed > 0 else 0
        }

progress = StreamProgress()

for chunk in stream:
    progress.update(chunk)
    # Process chunk...

print(f"\nStats: {progress.get_stats()}")
```

### 性能缓冲

```javascript  theme={null}
class StreamBuffer {
  constructor(onFlush, bufferSize = 10, flushInterval = 100) {
    this.buffer = [];
    this.onFlush = onFlush;
    this.bufferSize = bufferSize;
    this.flushInterval = flushInterval;
    this.timer = null;
  }

  add(chunk) {
    this.buffer.push(chunk);

    if (this.buffer.length >= this.bufferSize) {
      this.flush();
    } else if (!this.timer) {
      this.timer = setTimeout(() => this.flush(), this.flushInterval);
    }
  }

  flush() {
    if (this.buffer.length > 0) {
      this.onFlush(this.buffer.join(''));
      this.buffer = [];
    }
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}

// Usage
const buffer = new StreamBuffer((text) => {
  document.getElementById('output').innerHTML += text;
});

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content || '';
  buffer.add(content);
}
buffer.flush(); // Final flush
```

## 错误处理

<Warning>
  流式连接可能在中途失败。始终实现重试逻辑。
</Warning>

```python  theme={null}
import time

def stream_with_retry(client, messages, max_retries=3):
    for attempt in range(max_retries):
        try:
            stream = client.chat.completions.create(
                model="gpt-4",
                messages=messages,
                stream=True
            )

            full_response = ""
            for chunk in stream:
                if chunk.choices[0].delta.content:
                    content = chunk.choices[0].delta.content
                    full_response += content
                    yield content

            return  # Success

        except Exception as e:
            if attempt < max_retries - 1:
                wait_time = 2 ** attempt  # Exponential backoff
                print(f"Stream interrupted, retrying in {wait_time}s...")
                time.sleep(wait_time)
                # Continue from partial response
                messages.append({"role": "assistant", "content": full_response})
                messages.append({"role": "user", "content": "continue"})
            else:
                raise e
```

## 最佳实践

1. **缓冲 UI 更新** - 不要为每个数据块更新 DOM（批处理可提高性能）
2. **显示加载指示器** - 在流式传输期间显示输入指示器
3. **实现超时** - 为连接设置合理的超时
4. **处理中断** - 使用指数退避的重试逻辑
5. **清理资源** - 始终正确关闭流
6. **测试错误场景** - 确保您的应用程序优雅地处理网络故障

## 性能提示

<Tip>
  在更新 UI 之前将小数据块缓冲在一起，以避免过多的 DOM 更新。
</Tip>

* 在 Python 的 print 中使用 `flush=True` 以立即输出
* 为频繁的 UI 更新实现防抖
* 考虑对长响应进行虚拟化
* 在浏览器中使用 Web Workers 进行解析
* 监控长流的内存使用情况

## 相关内容

* [Chat Completions API](/cn/api-reference/post-chat-completions) - 兼容 OpenAI 的流式 API
* [Messages API](/cn/api-reference/post-v1-messages) - 兼容 Anthropic 的流式 API
* [函数调用](/cn/api-reference/endpoint/function-calling) - 在流式传输中使用函数
* [身份验证](/cn/dev-docs/getting-started/authentication) - API 身份验证方法


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt