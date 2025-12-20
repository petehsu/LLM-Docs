# Microsoft Foundry 中的 Claude

通过 Microsoft Foundry 使用 Azure 原生端点和身份验证访问 Claude 模型。

---

本指南将引导您完成在 Python、TypeScript 或使用直接 HTTP 请求中设置和调用 Claude in Foundry API 的过程。当您可以访问 Foundry 中的 Claude 时，您将通过 Microsoft Marketplace 使用您的 Azure 订阅为 Claude 使用付费，这样您可以访问 Claude 的最新功能，同时通过 Azure 订阅管理成本。

区域可用性：在推出时，Claude 在 Foundry 资源中作为全球标准部署类型可用，美国数据区即将推出。Microsoft Marketplace 中 Claude 的定价使用 Anthropic 的标准 API 定价。访问我们的[定价页面](https://claude.com/pricing#api)了解详情。

## 预览

在此预览平台集成中，Claude 模型在 Anthropic 的基础设施上运行。这是一个通过 Azure 进行计费和访问的商业集成。作为 Microsoft 的独立处理者，通过 Microsoft Foundry 使用 Claude 的客户受 Anthropic 的数据使用条款约束。Anthropic 继续提供其业界领先的安全和数据承诺，包括零数据保留可用性。

## 前置条件

在开始之前，请确保您拥有：

- 有效的 Azure 订阅
- 访问 [Foundry](https://ai.azure.com/) 的权限
- 已安装 [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)（可选，用于资源管理）

## 安装 SDK

Anthropic 的[客户端 SDK](/docs/zh-CN/api/client-sdks) 通过特定于平台的包支持 Foundry。

```bash
# Python
pip install -U "anthropic"

# Typescript
npm install @anthropic-ai/foundry-sdk
```

## 配置

Foundry 使用两级层次结构：**资源**包含您的安全和计费配置，而**部署**是您通过 API 调用的模型实例。您首先需要创建一个 Foundry 资源，然后在其中创建一个或多个 Claude 部署。

### 配置 Foundry 资源

创建一个 Foundry 资源，这是在 Azure 中使用和管理服务所必需的。您可以按照这些说明创建一个 [Foundry 资源](https://learn.microsoft.com/en-us/azure/ai-services/multi-service-resource?pivots=azportal#create-a-new-azure-ai-foundry-resource)。或者，您可以首先创建一个 [Foundry 项目](https://learn.microsoft.com/en-us/azure/ai-foundry/how-to/create-projects?tabs=ai-foundry)，这涉及创建一个 Foundry 资源。

要配置您的资源：

1. 导航到 [Foundry 门户](https://ai.azure.com/)
2. 创建新的 Foundry 资源或选择现有资源
3. 使用 Azure 颁发的 API 密钥或 Entra ID 配置访问管理以进行基于角色的访问控制
4. 可选地配置资源成为专用网络（Azure 虚拟网络）的一部分以增强安全性
5. 记下您的资源名称——您将在 API 端点中将其用作 `{resource}`（例如，`https://{resource}.services.ai.azure.com/anthropic/v1/*`）

### 创建 Foundry 部署

创建资源后，部署 Claude 模型以使其可用于 API 调用：

1. 在 Foundry 门户中，导航到您的资源
2. 转到**模型 + 端点**并选择**+ 部署模型** > **部署基础模型**
3. 搜索并选择 Claude 模型（例如，`claude-sonnet-4-5`）
4. 配置部署设置：
   - **部署名称**：默认为模型 ID，但您可以自定义它（例如，`my-claude-deployment`）。部署名称在创建后无法更改。
   - **部署类型**：选择全球标准（推荐用于 Claude）
5. 选择**部署**并等待配置完成
6. 部署后，您可以在**密钥和端点**下找到您的端点 URL 和密钥

<Note>
  您选择的部署名称成为您在 API 请求的 `model` 参数中传递的值。您可以创建同一模型的多个部署，使用不同的名称来管理单独的配置或速率限制。
</Note>

## 身份验证

Claude on Foundry 支持两种身份验证方法：API 密钥和 Entra ID 令牌。两种方法都使用格式为 `https://{resource}.services.ai.azure.com/anthropic/v1/*` 的 Azure 托管端点。

### API 密钥身份验证

配置 Foundry Claude 资源后，您可以从 Foundry 门户获取 API 密钥：

1. 在 Foundry 门户中导航到您的资源
2. 转到**密钥和端点**部分
3. 复制提供的 API 密钥之一
4. 在您的请求中使用 `api-key` 或 `x-api-key` 标头，或将其提供给 SDK

Python 和 TypeScript SDK 需要 API 密钥以及资源名称或基础 URL。如果定义了以下环境变量，SDK 将自动从其中读取：

- `ANTHROPIC_FOUNDRY_API_KEY` - 您的 API 密钥
- `ANTHROPIC_FOUNDRY_RESOURCE` - 您的资源名称（例如，`example-resource`）
- `ANTHROPIC_FOUNDRY_BASE_URL` - 资源名称的替代方案；完整的基础 URL（例如，`https://example-resource.services.ai.azure.com/anthropic/`）

<Note>
`resource` 和 `base_url` 参数是互斥的。提供资源名称（SDK 使用它将 URL 构造为 `https://{resource}.services.ai.azure.com/anthropic/`）或直接提供完整的基础 URL。
</Note>

**使用 API 密钥的示例：**

<CodeGroup>
```python Python
import os
from anthropic import AnthropicFoundry

client = AnthropicFoundry(
    api_key=os.environ.get("ANTHROPIC_FOUNDRY_API_KEY"),
    resource='example-resource', # your resource name
)

message = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello!"}]
)
print(message.content)
```

```typescript TypeScript
import AnthropicFoundry from "@anthropic-ai/foundry-sdk";

const client = new AnthropicFoundry({
  apiKey: process.env.ANTHROPIC_FOUNDRY_API_KEY,
  resource: 'example-resource', // your resource name
});

const message = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Hello!" }],
});
console.log(message.content);
```

```bash Shell
curl https://{resource}.services.ai.azure.com/anthropic/v1/messages \
  -H "content-type: application/json" \
  -H "api-key: YOUR_AZURE_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'
```
</CodeGroup>

<Warning>
保护您的 API 密钥安全。永远不要将其提交到版本控制或公开分享。任何有权访问您的 API 密钥的人都可以通过您的 Foundry 资源向 Claude 发出请求。
</Warning>

## Microsoft Entra 身份验证

为了增强安全性和集中式访问管理，您可以使用 Entra ID（以前称为 Azure Active Directory）令牌：

1. 为您的 Foundry 资源启用 Entra 身份验证
2. 从 Entra ID 获取访问令牌
3. 在 `Authorization: Bearer {TOKEN}` 标头中使用令牌

**使用 Entra ID 的示例：**

<CodeGroup>
```python Python
import os
from anthropic import AnthropicFoundry
from azure.identity import DefaultAzureCredential, get_bearer_token_provider

# Get Azure Entra ID token using token provider pattern
token_provider = get_bearer_token_provider(
    DefaultAzureCredential(),
    "https://cognitiveservices.azure.com/.default"
)

# Create client with Entra ID authentication
client = AnthropicFoundry(
    resource='example-resource', # your resource name
    azure_ad_token_provider=token_provider  # Use token provider for Entra ID auth
)

# Make request
message = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello!"}]
)
print(message.content)
```

```typescript TypeScript
import AnthropicFoundry from "@anthropic-ai/foundry-sdk";
import {
  DefaultAzureCredential,
  getBearerTokenProvider,
} from "@azure/identity";

// Get Entra ID token using token provider pattern
const credential = new DefaultAzureCredential();
const tokenProvider = getBearerTokenProvider(
  credential,
  "https://cognitiveservices.azure.com/.default"
);

// Create client with Entra ID authentication
const client = new AnthropicFoundry({
  resource: 'example-resource', // your resource name
  azureADTokenProvider: tokenProvider, // Use token provider for Entra ID auth
});

// Make request
const message = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Hello!" }],
});
console.log(message.content);
```

```bash Shell
# Get Azure Entra ID token
ACCESS_TOKEN=$(az account get-access-token --resource https://cognitiveservices.azure.com --query accessToken -o tsv)

# Make request with token. Replace {resource} with your resource name
curl https://{resource}.services.ai.azure.com/anthropic/v1/messages \
  -H "content-type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'
```
</CodeGroup>

<Note>
Azure Entra ID 身份验证允许您使用 Azure RBAC 管理访问，与您组织的身份管理集成，并避免手动管理 API 密钥。
</Note>

## 关联请求 ID

Foundry 在 HTTP 响应标头中包含请求标识符，用于调试和跟踪。联系支持时，请提供 `request-id` 和 `apim-request-id` 值，以帮助团队快速定位和调查您在 Anthropic 和 Azure 系统中的请求。

## 支持的功能

Claude on Foundry 支持 Claude 的大多数强大功能。您可以在[此处](/docs/zh-CN/build-with-claude/overview)找到当前支持的所有功能。

### 不支持的功能

- 管理 API（`/v1/organizations/*` 端点）
- 模型 API（`/v1/models`）
- 消息批处理 API（`/v1/messages/batches`）

## API 响应

来自 Claude on Foundry 的 API 响应遵循标准 [Anthropic API 响应格式](/docs/zh-CN/api/messages)。这包括响应体中的 `usage` 对象，它提供了有关您的请求的详细令牌消耗信息。`usage` 对象在所有平台上都是一致的（第一方 API、Foundry、Amazon Bedrock 和 Google Vertex AI）。

有关特定于 Foundry 的响应标头的详情，请参阅[关联请求 ID 部分](#correlation-request-ids)。

## API 模型 ID 和部署

以下 Claude 模型可通过 Foundry 获得。最新一代模型（Sonnet 4.5、Opus 4.1 和 Haiku 4.5）提供最先进的功能：

| 模型             | 默认部署名称     |
| :---------------- | :-------------------------- |
| Claude Opus 4.5   | `claude-opus-4-5`  |
| Claude Sonnet 4.5 | `claude-sonnet-4-5`         |
| Claude Opus 4.1   | `claude-opus-4-1`           |
| Claude Haiku 4.5  | `claude-haiku-4-5`          |

默认情况下，部署名称与上面显示的模型 ID 匹配。但是，您可以在 Foundry 门户中创建具有不同名称的自定义部署，以管理不同的配置、版本或速率限制。在您的 API 请求中使用部署名称（不一定是模型 ID）。

## 监控和日志记录

Azure 通过标准 Azure 模式为您的 Claude 使用提供全面的监控和日志记录功能：

- **Azure Monitor**：跟踪 API 使用情况、延迟和错误率
- **Azure Log Analytics**：查询和分析请求/响应日志
- **成本管理**：监控和预测与 Claude 使用相关的成本

Anthropic 建议至少在 30 天滚动基础上记录您的活动，以了解使用模式并调查任何潜在问题。

<Note>
Azure 的日志记录服务在您的 Azure 订阅中配置。启用日志记录不会向 Microsoft 或 Anthropic 提供对您内容的访问权限，超出计费和服务运营所需的范围。
</Note>

## 故障排除

### 身份验证错误

**错误**：`401 Unauthorized` 或 `Invalid API key`

- **解决方案**：验证您的 API 密钥是否正确。您可以从 Azure 门户中您的 Claude 资源的**密钥和端点**下获取新的 API 密钥。
- **解决方案**：如果使用 Azure Entra ID，请确保您的访问令牌有效且未过期。令牌通常在 1 小时后过期。

**错误**：`403 Forbidden`

- **解决方案**：您的 Azure 账户可能缺少必要的权限。确保您已分配适当的 Azure RBAC 角色（例如，"Cognitive Services OpenAI User"）。

### 速率限制

**错误**：`429 Too Many Requests`

- **解决方案**：您已超过速率限制。在您的应用程序中实现指数退避和重试逻辑。
- **解决方案**：考虑通过 Azure 门户或 Azure 支持请求增加速率限制。

#### 速率限制标头

Foundry 在响应中不包括 Anthropic 的标准速率限制标头（`anthropic-ratelimit-tokens-limit`、`anthropic-ratelimit-tokens-remaining`、`anthropic-ratelimit-tokens-reset`、`anthropic-ratelimit-input-tokens-limit`、`anthropic-ratelimit-input-tokens-remaining`、`anthropic-ratelimit-input-tokens-reset`、`anthropic-ratelimit-output-tokens-limit`、`anthropic-ratelimit-output-tokens-remaining` 和 `anthropic-ratelimit-output-tokens-reset`）。改为通过 Azure 的监控工具管理速率限制。

### 模型和部署错误

**错误**：`Model not found` 或 `Deployment not found`

- **解决方案**：验证您使用的是正确的部署名称。如果您还没有创建自定义部署，请使用默认模型 ID（例如，`claude-sonnet-4-5`）。
- **解决方案**：确保模型/部署在您的 Azure 区域中可用。

**错误**：`Invalid model parameter`

- **解决方案**：model 参数应包含您的部署名称，可以在 Foundry 门户中自定义。验证部署存在并正确配置。

## 其他资源

- **Foundry 文档**：[ai.azure.com/catalog](https://ai.azure.com/catalog/publishers/anthropic)
- **Azure 定价**：[azure.microsoft.com/en-us/pricing](https://azure.microsoft.com/en-us/pricing/)
- **Anthropic 定价详情**：[定价文档](/docs/zh-CN/about-claude/pricing#third-party-platform-pricing)
- **身份验证指南**：参阅上面的[身份验证部分](#authentication)
- **Azure 门户**：[portal.azure.com](https://portal.azure.com/)