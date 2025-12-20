# OpenAI API

> MegaLLM 提供与 OpenAI API 格式的完全兼容性,允许您无缝使用现有的 OpenAI SDK 和工具。

<Info>
  **基础 URL**: `https://ai.megallm.io/v1` 用于所有与 OpenAI 兼容的端点
</Info>

## 可用端点

<CardGroup cols={2}>
  <Card title="Chat Completions" icon="messages" href="/cn/dev-docs/openai/chat-completions">
    使用 GPT 模型生成对话响应
  </Card>

  <Card title="流式传输" icon="stream" href="/cn/dev-docs/openai/streaming">
    使用服务器发送事件实现实时流式响应
  </Card>

  <Card title="函数调用" icon="function" href="/cn/dev-docs/openai/function-calling">
    执行函数和工具,支持并行调用
  </Card>

  <Card title="模型" icon="list" href="/cn/home/models">
    浏览可用的模型和功能
  </Card>
</CardGroup>

## 快速示例

```python  theme={null}
from openai import OpenAI

# 初始化客户端
client = OpenAI(
    base_url="https://ai.megallm.io/v1",
    api_key="your-api-key"
)

# 简单的聊天补全
response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Explain quantum computing in simple terms."}
    ],
    temperature=0.7,
    max_tokens=150
)

print(response.choices[0].message.content)
```

## 支持的模型

| 模型              | 上下文窗口          | 使用场景       |
| --------------- | -------------- | ---------- |
| `gpt-4`         | 8,192 tokens   | 复杂推理、分析    |
| `gpt-4-32k`     | 32,768 tokens  | 长文档、大量上下文  |
| `gpt-4-turbo`   | 128,000 tokens | 大规模处理      |
| `gpt-3.5-turbo` | 16,385 tokens  | 快速、经济高效的响应 |

## 功能特性

### 完全兼容

OpenAI API 的直接替代品 - 无需更改即可使用您现有的代码。

### 高性能

通过优化的基础设施实现快速响应时间。

### 使用跟踪

监控您的 API 使用情况和成本。

## SDK 支持

MegaLLM 兼容所有 OpenAI 兼容的 SDK:

* **Python**: `openai` 官方 SDK
* **Node.js**: `openai` 官方 SDK
* **Go**: `go-openai`
* **Rust**: `async-openai`
* **Java**: `openai-java`
* **C#**: `OpenAI-DotNet`

## 速率限制

| 层级 | 请求/分钟 | 令牌/分钟   |
| -- | ----- | ------- |
| 基础 | 60    | 90,000  |
| 专业 | 300   | 450,000 |
| 企业 | 自定义   | 自定义     |

## 迁移指南

从 OpenAI 迁移到 MegaLLM 很简单:

```python  theme={null}
# 之前 (OpenAI)
client = OpenAI(api_key="sk-...")

# 之后 (MegaLLM)
client = OpenAI(
    base_url="https://ai.megallm.io/v1",
    api_key="your-api-key"
)
```

就是这样!您所有现有的代码都可以继续工作。

## 错误处理

MegaLLM 返回与 OpenAI 兼容的错误响应:

```json  theme={null}
{
  "error": {
    "message": "Invalid request parameter",
    "type": "invalid_request_error",
    "param": "temperature",
    "code": null
  }
}
```

<Tip>
  **专业提示**: 在开发期间使用 `X-Debug: true` 标头启用调试模式以获取详细的错误信息。
</Tip>

## 下一步

* 探索 [Chat Completions](/cn/dev-docs/openai/chat-completions) 了解对话式 AI
* 了解 [函数调用](/cn/dev-docs/openai/function-calling) 以进行工具集成
* 实现 [流式传输](/cn/dev-docs/openai/streaming) 以获得实时响应


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt