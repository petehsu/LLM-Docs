# 聊天补全

> Chat Completions API 使您能够使用 GPT 模型构建对话体验。发送消息列表并接收 AI 生成的响应。

<APIPage operations={[{path: "/chat/completions", method: "post"}]} />

## 基础用法

<Tabs>
  <Tab title="Python">
    ```python  theme={null}
    from openai import OpenAI

    client = OpenAI(
        base_url="https://ai.megallm.io/v1",
        api_key="your-api-key"
    )

    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "What's the weather like?"}
        ],
        temperature=0.7,
        max_tokens=150
    )

    print(response.choices[0].message.content)
    ```
  </Tab>

  <Tab title="JavaScript">
    ```javascript  theme={null}
    import OpenAI from 'openai';

    const openai = new OpenAI({
      baseURL: 'https://ai.megallm.io/v1',
      apiKey: process.env.MEGALLM_API_KEY,
    });

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: "What's the weather like?" }
      ],
      temperature: 0.7,
      max_tokens: 150
    });

    console.log(response.choices[0].message.content);
    ```
  </Tab>

  <Tab title="cURL">
    ```bash  theme={null}
    curl https://ai.megallm.io/v1/chat/completions \
      -H "Authorization: Bearer $MEGALLM_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "model": "gpt-4",
        "messages": [
          {"role": "system", "content": "You are a helpful assistant."},
          {"role": "user", "content": "What'\''s the weather like?"}
        ],
        "temperature": 0.7,
        "max_tokens": 150
      }'
    ```
  </Tab>

  <Tab title="Go">
    ```go  theme={null}
    package main

    import (
        "context"
        openai "github.com/sashabaranov/go-openai"
    )

    func main() {
        config := openai.DefaultConfig("your-api-key")
        config.BaseURL = "https://ai.megallm.io/v1"
        client := openai.NewClientWithConfig(config)

        resp, err := client.CreateChatCompletion(
            context.Background(),
            openai.ChatCompletionRequest{
                Model: "gpt-4",
                Messages: []openai.ChatCompletionMessage{
                    {
                        Role:    "system",
                        Content: "You are a helpful assistant.",
                    },
                    {
                        Role:    "user",
                        Content: "What's the weather like?",
                    },
                },
                Temperature: 0.7,
                MaxTokens:   150,
            },
        )

        if err != nil {
            panic(err)
        }

        println(resp.Choices[0].Message.Content)
    }
    ```
  </Tab>
</Tabs>

## 高级功能

### 消息角色

API 支持不同的消息角色用于对话上下文：

| 角色          | 描述       | 示例           |
| ----------- | -------- | ------------ |
| `system`    | 设置行为和上下文 | "你是一个有帮助的助手" |
| `user`      | 用户输入/问题  | "法国的首都是什么？"  |
| `assistant` | AI 响应    | "法国的首都是巴黎"   |
| `tool`      | 工具/函数结果  | 函数执行结果       |

### 温度控制

使用温度参数调整响应的创造性：

```python  theme={null}
# 更确定性（0.0 - 0.3）
response = client.chat.completions.create(
    model="gpt-4",
    messages=[...],
    temperature=0.2  # 更专注、一致的响应
)

# 平衡（0.4 - 0.7）
response = client.chat.completions.create(
    model="gpt-4",
    messages=[...],
    temperature=0.5  # 平衡创造力和连贯性
)

# 更有创意（0.8 - 1.0）
response = client.chat.completions.create(
    model="gpt-4",
    messages=[...],
    temperature=0.9  # 更多样化、更有创意的响应
)
```

### 多轮对话

在多次交互中保持上下文：

```python  theme={null}
messages = [
    {"role": "system", "content": "你是一个数学导师。"},
    {"role": "user", "content": "15 * 12 是多少？"},
    {"role": "assistant", "content": "15 * 12 = 180"},
    {"role": "user", "content": "现在把它除以 6"}
]

response = client.chat.completions.create(
    model="gpt-4",
    messages=messages
)
# 响应理解"它"指的是 180
```

### 视觉支持

同时处理图像和文本（需要支持视觉的模型）：

```python  theme={null}
response = client.chat.completions.create(
    model="gpt-4-vision",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "这张图片里有什么？"},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": "https://example.com/image.jpg",
                        "detail": "high"  # "low", "high", 或 "auto"
                    }
                }
            ]
        }
    ],
    max_tokens=300
)
```

## 响应格式

### 标准响应

```json  theme={null}
{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "created": 1677858242,
  "model": "gpt-4",
  "usage": {
    "prompt_tokens": 13,
    "completion_tokens": 17,
    "total_tokens": 30
  },
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "法国的首都是巴黎。"
      },
      "finish_reason": "stop",
      "index": 0
    }
  ]
}
```

### 结束原因

| 原因               | 描述                |
| ---------------- | ----------------- |
| `stop`           | 自然完成              |
| `length`         | 达到 max\_tokens 限制 |
| `tool_calls`     | 模型想要调用函数          |
| `content_filter` | 内容被过滤             |

## 最佳实践

<Tip>
  **系统消息**：始终包含清晰的系统消息来设置 AI 的行为和上下文。
</Tip>

### Token 优化

```python  theme={null}
# 发送前计算 token
import tiktoken

encoding = tiktoken.encoding_for_model("gpt-4")
tokens = encoding.encode("您的消息在这里")
print(f"Token 计数：{len(tokens)}")

# 如有需要进行截断
if len(tokens) > 1000:
    truncated = encoding.decode(tokens[:1000])
```

### 错误处理

```python  theme={null}
try:
    response = client.chat.completions.create(...)
except openai.APIError as e:
    print(f"API 错误：{e}")
except openai.RateLimitError as e:
    print(f"达到速率限制：{e}")
    # 实现指数退避
except openai.APIConnectionError as e:
    print(f"连接错误：{e}")
    # 使用退避重试
```

## 常见模式

### 摘要生成

```python  theme={null}
response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": "你是一个摘要专家。"},
        {"role": "user", "content": f"用 3 个要点总结这段文字：{long_text}"}
    ],
    temperature=0.3,
    max_tokens=150
)
```

### 分类

```python  theme={null}
response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": "将情感分类为积极、消极或中性。"},
        {"role": "user", "content": "我喜欢这个产品！它运行得很好。"}
    ],
    temperature=0.0,
    max_tokens=10
)
```

### 代码生成

```python  theme={null}
response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": "你是一个 Python 专家。"},
        {"role": "user", "content": "编写一个计算斐波那契数的函数"}
    ],
    temperature=0.2,
    max_tokens=500
)
```

## 速率限制

实现适当的速率限制以避免错误：

```python  theme={null}
import time
from typing import Optional

class RateLimiter:
    def __init__(self, requests_per_minute: int = 60):
        self.requests_per_minute = requests_per_minute
        self.request_times = []

    def wait_if_needed(self):
        now = time.time()
        # 删除超过 1 分钟的请求
        self.request_times = [t for t in self.request_times if now - t < 60]

        if len(self.request_times) >= self.requests_per_minute:
            sleep_time = 60 - (now - self.request_times[0])
            if sleep_time > 0:
                time.sleep(sleep_time)

        self.request_times.append(now)

# 使用方法
limiter = RateLimiter(60)

for prompt in prompts:
    limiter.wait_if_needed()
    response = client.chat.completions.create(...)
```

## 下一步

* 了解[流式传输](/openai/streaming)以获得实时响应
* 探索[函数调用](/openai/function-calling)以进行工具集成
* 实现[结构化输出](/openai/structured-output)以获得验证的 JSON 响应


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt