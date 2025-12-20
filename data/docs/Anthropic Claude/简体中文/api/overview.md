# API 概览

Claude API 是一个 RESTful API，提供对 Claude 模型的编程访问。了解可用的 API、身份验证、速率限制和入门步骤。

---

Claude API 是位于 `https://api.anthropic.com` 的 RESTful API，提供对 Claude 模型的编程访问。主要 API 是 Messages API (`POST /v1/messages`)，用于对话交互。

<Note>
**初次使用 Claude？** 从 [入门](/docs/zh-CN/get-started) 开始了解先决条件和您的第一个 API 调用，或查看 [使用 Messages](/docs/zh-CN/build-with-claude/working-with-messages) 了解请求/响应模式和示例。
</Note>

## 先决条件

要使用 Claude API，您需要：

- 一个 [Anthropic Console 账户](https://console.anthropic.com)
- 一个 [API 密钥](/settings/keys)

有关分步设置说明，请参阅 [入门](/docs/zh-CN/get-started)。

## 可用的 API

Claude API 包括以下 API：

**正式版：**
- **[Messages API](/docs/zh-CN/api/messages)**：向 Claude 发送消息进行对话交互 (`POST /v1/messages`)
- **[Message Batches API](/docs/zh-CN/api/creating-message-batches)**：异步处理大量 Messages 请求，成本降低 50% (`POST /v1/messages/batches`)
- **[Token Counting API](/docs/zh-CN/api/messages-count-tokens)**：在发送前计算消息中的令牌数以管理成本和速率限制 (`POST /v1/messages/count_tokens`)
- **[Models API](/docs/zh-CN/api/models-list)**：列出可用的 Claude 模型及其详细信息 (`GET /v1/models`)

**测试版：**
- **[Files API](/docs/zh-CN/api/files-create)**：上传和管理文件以供多个 API 调用使用 (`POST /v1/files`, `GET /v1/files`)
- **[Skills API](/docs/zh-CN/api/skills/create-skill)**：创建和管理自定义代理技能 (`POST /v1/skills`, `GET /v1/skills`)

有关包含所有端点、参数和响应架构的完整 API 参考，请查看导航中列出的 API 参考页面。要访问测试版功能，请参阅 [Beta 头](/docs/zh-CN/api/beta-headers)。

## 身份验证

对 Claude API 的所有请求必须包含以下标头：

| 标头 | 值 | 必需 |
|--------|-------|----------|
| `x-api-key` | 您从 Console 获得的 API 密钥 | 是 |
| `anthropic-version` | API 版本（例如，`2023-06-01`） | 是 |
| `content-type` | `application/json` | 是 |

如果您使用 [Client SDKs](#client-sdks)，SDK 将自动发送这些标头。有关 API 版本控制的详细信息，请参阅 [API 版本](/docs/zh-CN/api/versioning)。

### 获取 API 密钥

API 通过网络 [Console](https://console.anthropic.com/) 提供。您可以使用 [Workbench](https://console.anthropic.com/workbench) 在浏览器中尝试 API，然后在 [Account Settings](https://console.anthropic.com/settings/keys) 中生成 API 密钥。使用 [workspaces](https://console.anthropic.com/settings/workspaces) 来分段您的 API 密钥并 [控制支出](/docs/zh-CN/api/rate-limits) 按用例。

## Client SDKs

Anthropic 提供官方 SDK，通过处理身份验证、请求格式化、错误处理等来简化 API 集成。

**优势**：
- 自动标头管理（x-api-key、anthropic-version、content-type）
- 类型安全的请求和响应处理
- 内置重试逻辑和错误处理
- 流式传输支持
- 请求超时和连接管理

**示例**（Python）：
```python
from anthropic import Anthropic

client = Anthropic()  # 从环境读取 ANTHROPIC_API_KEY
message = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello, Claude"}]
)
```

有关客户端 SDK 列表及其各自的安装说明，请参阅 [Client SDKs](/docs/zh-CN/api/client-sdks)。

## Claude API 与第三方平台

Claude 可通过 Anthropic 的直接 API 和合作伙伴平台获得。根据您的基础设施、合规要求和定价偏好进行选择。

### Claude API

- **直接访问**最新模型和功能
- **Anthropic 计费和支持**
- **最适合**：新集成、完整功能访问、与 Anthropic 的直接关系

### 第三方平台 API

通过 AWS、Google Cloud 或 Microsoft Azure 访问 Claude：
- **与云提供商计费和 IAM 集成**
- **可能存在功能延迟**或与直接 API 的差异
- **最适合**：现有云承诺、特定合规要求、统一的云计费

| 平台 | 提供商 | 文档 |
|----------|----------|---------------|
| Amazon Bedrock | AWS | [Claude on Amazon Bedrock](/docs/zh-CN/build-with-claude/claude-on-amazon-bedrock) |
| Vertex AI | Google Cloud | [Claude on Vertex AI](/docs/zh-CN/build-with-claude/claude-on-vertex-ai) |
| Azure AI | Microsoft Azure | [Claude on Azure AI](/docs/zh-CN/build-with-claude/claude-in-microsoft-foundry) |

<Note>
有关跨平台的功能可用性，请参阅 [功能概览](/docs/zh-CN/build-with-claude/overview)。
</Note>

## 请求和响应格式

### 请求大小限制

API 根据端点有不同的最大请求大小：

| 端点 | 最大大小 |
|----------|--------------|
| 标准端点（Messages、Token Counting） | 32 MB |
| [Batch API](/docs/zh-CN/build-with-claude/batch-processing) | 256 MB |
| [Files API](/docs/zh-CN/build-with-claude/files) | 500 MB |

如果超过这些限制，您将收到 413 `request_too_large` 错误。

### 响应标头

Claude API 在每个响应中包含以下标头：

- `request-id`：请求的全局唯一标识符
- `anthropic-organization-id`：与请求中使用的 API 密钥关联的组织 ID

## 速率限制和可用性

### 速率限制

API 强制执行速率限制和支出限制以防止滥用并管理容量。限制被组织成使用层，随着您使用 API 而自动增加。每个层都有：

- **支出限制**：API 使用的最大月度成本
- **速率限制**：每分钟最大请求数 (RPM) 和每分钟最大令牌数 (TPM)

您可以在 [Console](/settings/limits) 中查看您的组织的当前限制。有关更高的限制或优先级层（具有承诺支出的增强服务级别），请通过 Console 联系销售。

有关限制、层和用于速率限制的令牌桶算法的详细信息，请参阅 [速率限制](/docs/zh-CN/api/rate-limits)。

### 可用性

Claude API 在全球 [许多国家和地区](/docs/zh-CN/api/supported-regions) 可用。检查支持的地区页面以确认您所在位置的可用性。

## 基本示例

以下是使用 Messages API 的最小请求：

```bash
curl https://api.anthropic.com/v1/messages \
  --header "x-api-key: $ANTHROPIC_API_KEY" \
  --header "anthropic-version: 2023-06-01" \
  --header "content-type: application/json" \
  --data '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "Hello, Claude"}
    ]
  }'
```

**响应：**
```json
{
  "id": "msg_01XFDUDYJgAACzvnptvVoYEL",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "Hello! How can I assist you today?"
    }
  ],
  "model": "claude-sonnet-4-5",
  "stop_reason": "end_turn",
  "usage": {
    "input_tokens": 12,
    "output_tokens": 8
  }
}
```

有关完整的示例和教程，请参阅 [入门](/docs/zh-CN/get-started) 和 [使用 Messages](/docs/zh-CN/build-with-claude/working-with-messages)。

## 后续步骤

<CardGroup cols={3}>
  <Card title="入门" icon="rocket" href="/docs/zh-CN/get-started">
    先决条件、分步教程和多种语言的示例
  </Card>
  <Card title="使用 Messages" icon="message" href="/docs/zh-CN/build-with-claude/working-with-messages">
    请求/响应模式、多轮对话和最佳实践
  </Card>
  <Card title="Messages API 参考" icon="book" href="/docs/zh-CN/api/messages">
    完整的 API 规范：参数、响应和错误代码
  </Card>
  <Card title="Client SDKs" icon="code" href="/docs/zh-CN/api/client-sdks">
    Python、TypeScript、Java、Go、C#、Ruby 和 PHP 的安装指南
  </Card>
  <Card title="功能概览" icon="grid" href="/docs/zh-CN/build-with-claude/overview">
    探索功能：缓存、视觉、工具使用、流式传输等
  </Card>
  <Card title="速率限制" icon="gauge" href="/docs/zh-CN/api/rate-limits">
    使用层、支出限制和使用令牌桶算法的速率限制
  </Card>
</CardGroup>