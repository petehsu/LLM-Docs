# Anthropic API

> MegaLLM 提供与 Anthropic 的 Claude API 格式的完全兼容性,使您能够通过我们的基础设施使用 Claude 模型。

<Info>
  **基础 URL**: `https://ai.megallm.io` 用于所有与 Anthropic 兼容的端点
</Info>

## 可用端点

<CardGroup cols={2}>
  <Card title="Messages" icon="message" href="/cn/dev-docs/anthropic/messages">
    使用 Claude 模型创建对话消息
  </Card>

  <Card title="函数调用" icon="wrench" href="/cn/api-reference/endpoint/function-calling">
    使 Claude 能够与外部工具和函数进行交互
  </Card>
</CardGroup>

## 快速示例

```python  theme={null}
from anthropic import Anthropic

# 初始化客户端
client = Anthropic(
    base_url="https://ai.megallm.io",
    api_key="your-api-key"
)

# 创建消息
message = client.messages.create(
    model="claude-3.5-sonnet",
    max_tokens=100,
    messages=[
        {
            "role": "user",
            "content": "Explain the theory of relativity in simple terms"
        }
    ]
)

print(message.content[0].text)
```

## 支持的模型

| 模型 ID                      | 上下文窗口       | 使用场景     |
| -------------------------- | ----------- | -------- |
| `claude-opus-4-1-20250805` | 200K tokens | 复杂分析、研究  |
| `claude-3.5-sonnet`        | 200K tokens | 平衡性能     |
| `claude-3.7-sonnet`        | 200K tokens | 快速、高效的响应 |
| `claude-sonnet-4`          | 200K tokens | 高级生成     |

## 功能特性

### 高级推理

Claude 为复杂任务提供的高级推理能力。

### 大上下文窗口

处理多达 200K 令牌以进行广泛的文档分析。

### 工具使用

对函数调用和工具集成的原生支持。

### 视觉能力

分析图像和视觉内容以及文本。

## SDK 支持

MegaLLM 支持与 Anthropic 兼容的 SDK:

* **Python**: `anthropic` 官方 SDK
* **TypeScript/JavaScript**: `@anthropic-ai/sdk`
* **Go**: 社区 SDK
* **Ruby**: `anthropic-rb`

## 与 OpenAI 的主要区别

### 消息格式

Anthropic 使用略有不同的消息格式:

```python  theme={null}
# Anthropic 格式
messages = [
    {
        "role": "user",
        "content": "Hello, Claude!"
    }
]

# 系统消息是独立的
system = "You are a helpful assistant"

message = client.messages.create(
    model="claude-3.5-sonnet",
    max_tokens=100,
    system=system,  # 系统提示是独立的
    messages=messages
)
```

### 响应格式

```python  theme={null}
# Anthropic 响应结构
response = {
    "id": "msg_123",
    "type": "message",
    "role": "assistant",
    "content": [
        {
            "type": "text",
            "text": "Hello! How can I help you today?"
        }
    ],
    "model": "claude-3.5-sonnet",
    "usage": {
        "input_tokens": 10,
        "output_tokens": 25
    }
}
```

### 工具使用格式

```python  theme={null}
tools = [
    {
        "name": "get_weather",
        "description": "获取某个位置的天气",
        "input_schema": {  # 注意: input_schema,而不是 parameters
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "城市名称"
                }
            },
            "required": ["location"]
        }
    }
]
```

## 迁移指南

从 Anthropic 迁移到 MegaLLM:

```python  theme={null}
# 之前 (Anthropic Cloud)
client = Anthropic(api_key="sk-ant-...")

# 之后 (MegaLLM)
client = Anthropic(
    base_url="https://ai.megallm.io",
    api_key="your-api-key"
)
```

您所有现有的 Anthropic 代码都可以继续工作!

## 身份验证

使用 `x-api-key` 标头进行 Anthropic 格式的身份验证:

```bash  theme={null}
curl https://ai.megallm.io/v1/messages \
  -H "x-api-key: $MEGALLM_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-3.5-sonnet",
    "max_tokens": 100,
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'
```

## 速率限制

| 层级 | 请求/分钟 | 令牌/分钟   | 并发  |
| -- | ----- | ------- | --- |
| 基础 | 50    | 100,000 | 10  |
| 专业 | 200   | 400,000 | 40  |
| 企业 | 自定义   | 自定义     | 自定义 |

## 错误处理

MegaLLM 返回与 Anthropic 兼容的错误响应:

```json  theme={null}
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "max_tokens is required"
  }
}
```

## 高级功能

### 对话历史

在多轮对话中保持上下文:

```python  theme={null}
conversation = []

def chat(user_input):
    conversation.append({"role": "user", "content": user_input})

    response = client.messages.create(
        model="claude-3.5-sonnet",
        max_tokens=150,
        messages=conversation
    )

    assistant_message = response.content[0].text
    conversation.append({"role": "assistant", "content": assistant_message})

    return assistant_message

# 使用示例
print(chat("What's the capital of France?"))
print(chat("What's its population?"))  # 知道 "its" 指的是巴黎
```

### 温度和采样

控制响应的创造性:

```python  theme={null}
# 更确定性
response = client.messages.create(
    model="claude-3.5-sonnet",
    max_tokens=100,
    temperature=0.0,  # 非常一致
    messages=messages
)

# 更有创造性
response = client.messages.create(
    model="claude-3.5-sonnet",
    max_tokens=100,
    temperature=1.0,  # 更多样化
    top_p=0.95,       # 核采样
    messages=messages
)
```

## 使用场景

### 文档分析

```python  theme={null}
def analyze_document(document_text):
    response = client.messages.create(
        model="claude-3-opus-20240229",
        max_tokens=500,
        system="您是一位文档分析专家。",
        messages=[
            {
                "role": "user",
                "content": f"""分析这份文档并提供:
                1. 主要主题
                2. 关键见解
                3. 摘要

                文档: {document_text}"""
            }
        ]
    )
    return response.content[0].text
```

### 代码审查

````python  theme={null}
def review_code(code):
    response = client.messages.create(
        model="claude-3.5-sonnet",
        max_tokens=800,
        system="您是一位专业的代码审查员。",
        messages=[
            {
                "role": "user",
                "content": f"""审查这段代码的:
                - 错误
                - 性能问题
                - 最佳实践
                - 安全问题

                代码:
                ```python
                {code}
                ```"""
            }
        ]
    )
    return response.content[0].text
````

<Tip>
  **专业提示**: Claude 擅长需要仔细推理、长上下文理解和细致响应的任务。
</Tip>

## 最佳实践

1. **使用系统提示**: Claude 对清晰的系统指令反应良好
2. **利用上下文窗口**: 利用 200K 令牌上下文处理大型文档
3. **结构化提示**: 对复杂请求使用清晰的格式和编号列表
4. **温度设置**: 对事实性任务使用较低的温度 (0-0.3)
5. **模型选择**: 选择 Opus 进行复杂推理、Sonnet 实现平衡、Haiku 提高速度

## 下一步

* 探索 [Messages API](/cn/dev-docs/anthropic/messages) 以进行对话式 AI
* 了解[函数调用](/cn/api-reference/endpoint/function-calling)以使用工具
* 实现[流式传输](/cn/api-reference/endpoint/streaming)以获得实时响应


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt