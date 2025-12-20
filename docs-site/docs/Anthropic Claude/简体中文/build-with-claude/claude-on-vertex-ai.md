# Vertex AI 上的 Claude

Anthropic 的 Claude 模型现已通过 [Vertex AI](https://cloud.google.com/vertex-ai) 正式推出。

---

通过 Vertex API 访问 Claude 几乎与 [Messages API](/docs/zh-CN/api/messages) 相同，支持所有相同的选项，但有两个关键区别：

* 在 Vertex 中，`model` 不在请求体中传递。相反，它在 Google Cloud 端点 URL 中指定。
* 在 Vertex 中，`anthropic_version` 在请求体中传递（而不是作为标头），必须设置为值 `vertex-2023-10-16`。

Vertex 也受 Anthropic 官方 [客户端 SDK](/docs/zh-CN/api/client-sdks) 支持。本指南将引导您完成在 Python 或 TypeScript 中向 Vertex AI 上的 Claude 发出请求的过程。

请注意，本指南假设您已经拥有能够使用 Vertex AI 的 GCP 项目。有关所需的设置以及完整的演练，请参阅 [使用 Anthropic 的 Claude 3 模型](https://cloud.google.com/vertex-ai/generative-ai/docs/partner-models/use-claude)。

## 安装用于访问 Vertex AI 的 SDK

首先，为您选择的语言安装 Anthropic 的 [客户端 SDK](/docs/zh-CN/api/client-sdks)。

<CodeGroup>
  ```python Python
  pip install -U google-cloud-aiplatform "anthropic[vertex]"
  ```

  ```typescript TypeScript
  npm install @anthropic-ai/vertex-sdk
  ```
</CodeGroup>

## 访问 Vertex AI

### 模型可用性

请注意，Anthropic 模型的可用性因地区而异。在 [Vertex AI 模型库](https://cloud.google.com/model-garden) 中搜索"Claude"或访问 [使用 Claude 3](https://cloud.google.com/vertex-ai/generative-ai/docs/partner-models/use-claude) 以获取最新信息。

#### API 模型 ID

| 模型                          | Vertex AI API 模型 ID |
| ------------------------------ | ------------------------ |
| Claude Sonnet 4.5              | claude-sonnet-4-5@20250929 |
| Claude Sonnet 4                | claude-sonnet-4@20250514 |
| Claude Sonnet 3.7 <Tooltip tooltipContent="自 2025 年 10 月 28 日起已弃用。">⚠️</Tooltip> | claude-3-7-sonnet@20250219 |
| Claude Opus 4.5                | claude-opus-4-5@20251101 |
| Claude Opus 4.1                | claude-opus-4-1@20250805 |
| Claude Opus 4                  | claude-opus-4@20250514   |
| Claude Opus 3 <Tooltip tooltipContent="自 2025 年 6 月 30 日起已弃用。">⚠️</Tooltip> | claude-3-opus@20240229   |
| Claude Haiku 4.5               | claude-haiku-4-5@20251001 |
| Claude Haiku 3.5               | claude-3-5-haiku@20241022 |
| Claude Haiku 3                 | claude-3-haiku@20240307  |

### 发出请求

在运行请求之前，您可能需要运行 `gcloud auth application-default login` 以使用 GCP 进行身份验证。

以下示例展示了如何从 Vertex AI 上的 Claude 生成文本：
<CodeGroup>

  ```python Python
  from anthropic import AnthropicVertex

  project_id = "MY_PROJECT_ID"
  region = "global"

  client = AnthropicVertex(project_id=project_id, region=region)

  message = client.messages.create(
      model="claude-sonnet-4-5@20250929",
      max_tokens=100,
      messages=[
          {
              "role": "user",
              "content": "Hey Claude!",
          }
      ],
  )
  print(message)
  ```

  ```typescript TypeScript
  import { AnthropicVertex } from '@anthropic-ai/vertex-sdk';

  const projectId = 'MY_PROJECT_ID';
  const region = 'global';

  // Goes through the standard `google-auth-library` flow.
  const client = new AnthropicVertex({
    projectId,
    region,
  });

  async function main() {
    const result = await client.messages.create({
      model: 'claude-sonnet-4-5@20250929',
      max_tokens: 100,
      messages: [
        {
          role: 'user',
          content: 'Hey Claude!',
        },
      ],
    });
    console.log(JSON.stringify(result, null, 2));
  }

  main();
  ```

  ```bash Shell
  MODEL_ID=claude-sonnet-4-5@20250929
  LOCATION=global
  PROJECT_ID=MY_PROJECT_ID

  curl \
  -X POST \
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  -H "Content-Type: application/json" \
  https://$LOCATION-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/anthropic/models/${MODEL_ID}:streamRawPredict -d \
  '{
    "anthropic_version": "vertex-2023-10-16",
    "messages": [{
      "role": "user",
      "content": "Hey Claude!"
    }],
    "max_tokens": 100,
  }'
  ```
</CodeGroup>

有关更多详情，请参阅我们的 [客户端 SDK](/docs/zh-CN/api/client-sdks) 和官方 [Vertex AI 文档](https://cloud.google.com/vertex-ai/docs)。

## 活动日志

Vertex 提供了一个 [请求-响应日志服务](https://cloud.google.com/vertex-ai/generative-ai/docs/multimodal/request-response-logging)，允许客户记录与您的使用相关的提示和完成。

Anthropic 建议您至少在 30 天滚动基础上记录您的活动，以便了解您的活动并调查任何潜在的滥用。

<Note>
启用此服务不会给 Google 或 Anthropic 任何访问您内容的权限。
</Note>

## 功能支持
您可以在 [此处](/docs/zh-CN/api/overview) 找到 Vertex 上当前支持的所有功能。

## 全局端点与区域端点

从 **Claude Sonnet 4.5 和所有未来模型** 开始，Google Vertex AI 提供两种端点类型：

- **全局端点**：动态路由以获得最大可用性
- **区域端点**：通过特定地理区域保证数据路由

区域端点的价格比全局端点高 10%。

<Note>
这仅适用于 Claude Sonnet 4.5 和未来的模型。较旧的模型（Claude Sonnet 4、Opus 4 及更早版本）保持其现有的定价结构。
</Note>

### 何时使用每个选项

**全局端点（推荐）：**
- 提供最大可用性和正常运行时间
- 动态将请求路由到具有可用容量的区域
- 无价格溢价
- 最适合数据驻留灵活的应用程序
- 仅支持按使用量付费流量（预配吞吐量需要区域端点）

**区域端点：**
- 通过特定地理区域路由流量
- 数据驻留和合规性要求所需
- 支持按使用量付费和预配吞吐量
- 10% 的价格溢价反映了专用区域容量的基础设施成本

### 实现

**使用全局端点（推荐）：**

初始化客户端时将 `region` 参数设置为 `"global"`：

<CodeGroup>
```python Python
from anthropic import AnthropicVertex

project_id = "MY_PROJECT_ID"
region = "global"

client = AnthropicVertex(project_id=project_id, region=region)

message = client.messages.create(
    model="claude-sonnet-4-5@20250929",
    max_tokens=100,
    messages=[
        {
            "role": "user",
            "content": "Hey Claude!",
        }
    ],
)
print(message)
```

```typescript TypeScript
import { AnthropicVertex } from '@anthropic-ai/vertex-sdk';

const projectId = 'MY_PROJECT_ID';
const region = 'global';

const client = new AnthropicVertex({
  projectId,
  region,
});

const result = await client.messages.create({
  model: 'claude-sonnet-4-5@20250929',
  max_tokens: 100,
  messages: [
    {
      role: 'user',
      content: 'Hey Claude!',
    },
  ],
});
```
</CodeGroup>

**使用区域端点：**

指定特定区域，如 `"us-east1"` 或 `"europe-west1"`：

<CodeGroup>
```python Python
from anthropic import AnthropicVertex

project_id = "MY_PROJECT_ID"
region = "us-east1"  # Specify a specific region

client = AnthropicVertex(project_id=project_id, region=region)

message = client.messages.create(
    model="claude-sonnet-4-5@20250929",
    max_tokens=100,
    messages=[
        {
            "role": "user",
            "content": "Hey Claude!",
        }
    ],
)
print(message)
```

```typescript TypeScript
import { AnthropicVertex } from '@anthropic-ai/vertex-sdk';

const projectId = 'MY_PROJECT_ID';
const region = 'us-east1';  // Specify a specific region

const client = new AnthropicVertex({
  projectId,
  region,
});

const result = await client.messages.create({
  model: 'claude-sonnet-4-5@20250929',
  max_tokens: 100,
  messages: [
    {
      role: 'user',
      content: 'Hey Claude!',
    },
  ],
});
```
</CodeGroup>

### 其他资源

- **Google Vertex AI 定价：** [cloud.google.com/vertex-ai/generative-ai/pricing](https://cloud.google.com/vertex-ai/generative-ai/pricing)
- **Claude 模型文档：** [Vertex AI 上的 Claude](https://cloud.google.com/vertex-ai/generative-ai/docs/partner-models/claude)
- **Google 博客文章：** [Claude 模型的全局端点](https://cloud.google.com/blog/products/ai-machine-learning/global-endpoint-for-claude-models-generally-available-on-vertex-ai)
- **Anthropic 定价详情：** [定价文档](/docs/zh-CN/about-claude/pricing#third-party-platform-pricing)