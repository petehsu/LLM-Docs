# 流式传输

> 实时流式传输聊天补全,提供更具交互性的用户体验。非常适合聊天机器人、实时助手和响应式应用程序。

<Info>
  **服务器发送事件 (SSE)**: 流式传输使用 SSE 格式,内容类型为 `text/event-stream`。
</Info>

## 流式传输工作原理

<Steps>
  <Step title="启用流式传输">
    在您的请求中设置 `stream: true` 以接收增量响应。
  </Step>

  <Step title="接收数据块">
    在生成响应令牌时获取它们,无需等待完成。
  </Step>

  <Step title="处理事件">
    处理包含 JSON 数据块的 `data:` 事件,直到收到 `[DONE]` 信号。
  </Step>
</Steps>

## 实现示例

<Tabs>
  <Tab title="Python">
    ```python  theme={null}
    from openai import OpenAI

    client = OpenAI(
        base_url="https://ai.megallm.io/v1",
        api_key="your-api-key"
    )

    # 创建流式补全
    stream = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "user", "content": "Write a haiku about programming"}
        ],
        stream=True
    )

    # 处理流
    for chunk in stream:
        if chunk.choices[0].delta.content is not None:
            print(chunk.choices[0].delta.content, end="")
    ```

    ### 使用异步支持

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
      apiKey: process.env.GITHUB_TOKEN,
    });

    async function streamChat() {
      const stream = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: 'Write a haiku about programming' }],
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        process.stdout.write(content);
      }
    }

    streamChat();
    ```

    ### 浏览器实现

    ```javascript  theme={null}
    async function streamChatInBrowser() {
      const response = await fetch('https://ai.megallm.io/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [{ role: 'user', content: 'Hello!' }],
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
              document.getElementById('output').innerHTML += content;
            } catch (e) {
              console.error('Error parsing JSON:', e);
            }
          }
        }
      }
    }
    ```
  </Tab>

  <Tab title="React">
    ```jsx  theme={null}
    import { useState, useCallback } from 'react';

    function StreamingChat() {
      const [messages, setMessages] = useState([]);
      const [streaming, setStreaming] = useState(false);
      const [currentResponse, setCurrentResponse] = useState('');

      const sendMessage = useCallback(async (content) => {
        setStreaming(true);
        setCurrentResponse('');

        const response = await fetch('https://ai.megallm.io/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_GITHUB_TOKEN}`,
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
                // 处理解析错误
              }
            }
          }
        }
      }, [messages]);

      return (
        <div>
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.role}`}>
              {msg.content}
            </div>
          ))}
          {streaming && (
            <div className="message assistant">
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
    # 使用 curl 进行流式传输并逐行处理
    curl -N https://ai.megallm.io/v1/chat/completions \
      -H "Authorization: Bearer $GITHUB_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "model": "gpt-4",
        "messages": [{"role": "user", "content": "Tell me a joke"}],
        "stream": true
      }' | while read -r line; do
        if [[ $line == data:* ]]; then
          # 从数据行中提取 JSON
          json="${line:6}"
          if [[ $json != "[DONE]" ]]; then
            # 解析并显示内容 (需要 jq)
            echo -n $(echo "$json" | jq -r '.choices[0].delta.content // ""')
          fi
        fi
      done
    ```
  </Tab>
</Tabs>

## 流事件格式

### Delta 事件

每个流式数据块遵循以下格式:

```json  theme={null}
data: {
  "id": "chatcmpl-abc123",
  "object": "chat.completion.chunk",
  "created": 1677858242,
  "model": "gpt-4",
  "choices": [
    {
      "index": 0,
      "delta": {
        "content": "Hello"
      },
      "finish_reason": null
    }
  ]
}
```

### 流生命周期

1. **初始数据块** - 包含角色但没有内容:

```json  theme={null}
data: {"choices": [{"delta": {"role": "assistant"}}]}
```

2. **内容数据块** - 增量文本:

```json  theme={null}
data: {"choices": [{"delta": {"content": "Hello, "}}]}
data: {"choices": [{"delta": {"content": "how "}}]}
data: {"choices": [{"delta": {"content": "are "}}]}
data: {"choices": [{"delta": {"content": "you?"}}]}
```

3. **最终数据块** - 包含 finish\_reason:

```json  theme={null}
data: {"choices": [{"delta": {}, "finish_reason": "stop"}]}
```

4. **流结束信号**:

```
data: [DONE]
```

## 高级流式传输功能

### 流式函数调用

在生成时流式传输函数调用:

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
        print(delta.content, end="")
```

### 进度跟踪

```python  theme={null}
class StreamProgress:
    def __init__(self):
        self.tokens = 0
        self.chunks = 0
        self.start_time = time.time()

    def update(self, chunk):
        self.chunks += 1
        if chunk.choices[0].delta.content:
            # 近似令牌计数
            self.tokens += len(chunk.choices[0].delta.content.split())

    def get_stats(self):
        elapsed = time.time() - self.start_time
        return {
            "chunks": self.chunks,
            "tokens": self.tokens,
            "time": elapsed,
            "tokens_per_second": self.tokens / elapsed if elapsed > 0 else 0
        }

# 使用方法
progress = StreamProgress()

for chunk in stream:
    progress.update(chunk)
    # 处理数据块...

print(progress.get_stats())
```

## 流中的错误处理

<Warning>
  流连接可能在中途失败。始终实现适当的错误处理。
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

            return  # 成功

        except Exception as e:
            if attempt < max_retries - 1:
                wait_time = 2 ** attempt  # 指数退避
                print(f"流中断,将在 {wait_time}s 后重试...")
                time.sleep(wait_time)
                # 附加部分响应以继续
                messages.append({"role": "assistant", "content": full_response})
                messages.append({"role": "user", "content": "continue"})
            else:
                raise e
```

## 性能优化

### 缓冲策略

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

// 使用方法
const buffer = new StreamBuffer((text) => {
  document.getElementById('output').innerHTML += text;
});

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content || '';
  buffer.add(content);
}
buffer.flush(); // 最终刷新
```

## 使用场景

### 实时聊天界面

```python  theme={null}
def chat_interface():
    print("聊天已开始。输入 'exit' 退出。")

    while True:
        user_input = input("\n您: ")
        if user_input.lower() == 'exit':
            break

        print("助手: ", end="")
        stream = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": user_input}],
            stream=True
        )

        for chunk in stream:
            if chunk.choices[0].delta.content:
                print(chunk.choices[0].delta.content, end="", flush=True)
        print()  # 响应后换行
```

### 实时翻译

```python  theme={null}
def streaming_translator(text, target_language="Spanish"):
    stream = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": f"Translate to {target_language}. Output only the translation."},
            {"role": "user", "content": text}
        ],
        stream=True,
        temperature=0.3
    )

    translation = ""
    for chunk in stream:
        if chunk.choices[0].delta.content:
            translation += chunk.choices[0].delta.content
            yield chunk.choices[0].delta.content

    return translation
```

## 最佳实践

1. **处理连接中断** - 实现带有指数退避的重试逻辑
2. **为 UI 更新设置缓冲** - 不要为每个数据块更新 DOM 以避免性能问题
3. **显示加载指示器** - 显示输入指示器或进度条
4. **实现超时** - 为流连接设置合理的超时
5. **清理资源** - 始终正确关闭流以避免内存泄漏

## 下一步

* 结合流式传输实现[函数调用](/cn/dev-docs/openai/function-calling)
* 了解[结构化输出](/cn/dev-docs/openai/structured-output)以获得验证响应
* 探索[嵌入](/cn/dev-docs/openai/embeddings)进行语义搜索


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt