# Claude in Microsoft Foundry

透過 Microsoft Foundry 使用 Azure 原生端點和驗證存取 Claude 模型。

---

本指南將引導您完成在 Python、TypeScript 或使用直接 HTTP 請求中設定和進行 Claude in Foundry API 呼叫的過程。當您可以存取 Claude in Foundry 時，您將透過 Microsoft Marketplace 使用您的 Azure 訂閱為 Claude 使用付費，讓您能夠存取 Claude 的最新功能，同時透過 Azure 訂閱管理成本。

區域可用性：在推出時，Claude 在 Foundry 資源中以全球標準部署類型提供，美國資料區域即將推出。Microsoft Marketplace 中 Claude 的定價使用 Anthropic 的標準 API 定價。請造訪我們的[定價頁面](https://claude.com/pricing#api)以取得詳細資訊。

## 預覽

在此預覽平台整合中，Claude 模型在 Anthropic 的基礎設施上執行。這是透過 Azure 進行計費和存取的商業整合。作為 Microsoft 的獨立處理者，透過 Microsoft Foundry 使用 Claude 的客戶受 Anthropic 的資料使用條款約束。Anthropic 繼續提供其業界領先的安全性和資料承諾，包括零資料保留可用性。

## 先決條件

在開始之前，請確保您具有：

- 有效的 Azure 訂閱
- 存取 [Foundry](https://ai.azure.com/)
- 已安裝 [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)（選用，用於資源管理）

## 安裝 SDK

Anthropic 的[用戶端 SDK](/docs/zh-TW/api/client-sdks)透過平台特定套件支援 Foundry。

```bash
# Python
pip install -U "anthropic"

# Typescript
npm install @anthropic-ai/foundry-sdk
```

## 佈建

Foundry 使用兩級階層：**資源**包含您的安全性和計費配置，而**部署**是您透過 API 呼叫的模型實例。您首先將建立 Foundry 資源，然後在其中建立一個或多個 Claude 部署。

### 佈建 Foundry 資源

建立 Foundry 資源，這是在 Azure 中使用和管理服務所必需的。您可以按照這些說明建立 [Foundry 資源](https://learn.microsoft.com/en-us/azure/ai-services/multi-service-resource?pivots=azportal#create-a-new-azure-ai-foundry-resource)。或者，您可以先建立 [Foundry 專案](https://learn.microsoft.com/en-us/azure/ai-foundry/how-to/create-projects?tabs=ai-foundry)，這涉及建立 Foundry 資源。

若要佈建您的資源：

1. 導覽至 [Foundry 入口網站](https://ai.azure.com/)
2. 建立新的 Foundry 資源或選擇現有的資源
3. 使用 Azure 發行的 API 金鑰或 Entra ID 設定存取管理以進行角色型存取控制
4. 選擇性地將資源設定為私人網路 (Azure 虛擬網路) 的一部分以增強安全性
5. 記下您的資源名稱—您將在 API 端點中使用此名稱作為 `{resource}`（例如 `https://{resource}.services.ai.azure.com/anthropic/v1/*`）

### 建立 Foundry 部署

建立資源後，部署 Claude 模型以使其可用於 API 呼叫：

1. 在 Foundry 入口網站中，導覽至您的資源
2. 前往**模型 + 端點**並選擇**+ 部署模型** > **部署基礎模型**
3. 搜尋並選擇 Claude 模型（例如 `claude-sonnet-4-5`）
4. 設定部署設定：
   - **部署名稱**：預設為模型 ID，但您可以自訂它（例如 `my-claude-deployment`）。部署名稱在建立後無法變更。
   - **部署類型**：選擇全球標準（建議用於 Claude）
5. 選擇**部署**並等待佈建完成
6. 部署後，您可以在**金鑰和端點**下找到您的端點 URL 和金鑰

<Note>
  您選擇的部署名稱會成為您在 API 請求的 `model` 參數中傳遞的值。您可以建立同一模型的多個部署，使用不同的名稱來管理不同的配置或速率限制。
</Note>

## 驗證

Claude on Foundry 支援兩種驗證方法：API 金鑰和 Entra ID 權杖。兩種方法都使用格式為 `https://{resource}.services.ai.azure.com/anthropic/v1/*` 的 Azure 託管端點。

### API 金鑰驗證

佈建 Foundry Claude 資源後，您可以從 Foundry 入口網站取得 API 金鑰：

1. 在 Foundry 入口網站中導覽至您的資源
2. 前往**金鑰和端點**部分
3. 複製提供的 API 金鑰之一
4. 在您的請求中使用 `api-key` 或 `x-api-key` 標頭，或將其提供給 SDK

Python 和 TypeScript SDK 需要 API 金鑰以及資源名稱或基礎 URL。如果定義了以下環境變數，SDK 將自動從中讀取：

- `ANTHROPIC_FOUNDRY_API_KEY` - 您的 API 金鑰
- `ANTHROPIC_FOUNDRY_RESOURCE` - 您的資源名稱（例如 `example-resource`）
- `ANTHROPIC_FOUNDRY_BASE_URL` - 資源名稱的替代方案；完整基礎 URL（例如 `https://example-resource.services.ai.azure.com/anthropic/`）

<Note>
`resource` 和 `base_url` 參數互斥。提供資源名稱（SDK 使用它將 URL 構造為 `https://{resource}.services.ai.azure.com/anthropic/`）或直接提供完整基礎 URL。
</Note>

**使用 API 金鑰的範例：**

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
保護您的 API 金鑰安全。永遠不要將它們提交到版本控制或公開分享。任何有權存取您的 API 金鑰的人都可以透過您的 Foundry 資源向 Claude 發出請求。
</Warning>

## Microsoft Entra 驗證

為了增強安全性和集中式存取管理，您可以使用 Entra ID（前身為 Azure Active Directory）權杖：

1. 為您的 Foundry 資源啟用 Entra 驗證
2. 從 Entra ID 取得存取權杖
3. 在 `Authorization: Bearer {TOKEN}` 標頭中使用權杖

**使用 Entra ID 的範例：**

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
Azure Entra ID 驗證允許您使用 Azure RBAC 管理存取、與您組織的身分識別管理整合，以及避免手動管理 API 金鑰。
</Note>

## 相關請求 ID

Foundry 在 HTTP 回應標頭中包含請求識別碼，用於偵錯和追蹤。聯絡支援時，請提供 `request-id` 和 `apim-request-id` 值，以幫助團隊快速在 Anthropic 和 Azure 系統中定位和調查您的請求。

## 支援的功能

Claude on Foundry 支援 Claude 的大多數強大功能。您可以在[此處](/docs/zh-TW/build-with-claude/overview)找到目前支援的所有功能。

### 不支援的功能

- 管理員 API（`/v1/organizations/*` 端點）
- 模型 API（`/v1/models`）
- 訊息批次 API（`/v1/messages/batches`）

## API 回應

來自 Claude on Foundry 的 API 回應遵循標準 [Anthropic API 回應格式](/docs/zh-TW/api/messages)。這包括回應主體中的 `usage` 物件，它提供您的請求的詳細權杖消耗資訊。`usage` 物件在所有平台上都是一致的（第一方 API、Foundry、Amazon Bedrock 和 Google Vertex AI）。

有關 Foundry 特定的回應標頭詳細資訊，請參閱[相關請求 ID 部分](#correlation-request-ids)。

## API 模型 ID 和部署

以下 Claude 模型可透過 Foundry 取得。最新一代模型（Sonnet 4.5、Opus 4.1 和 Haiku 4.5）提供最先進的功能：

| 模型             | 預設部署名稱     |
| :---------------- | :-------------------------- |
| Claude Opus 4.5   | `claude-opus-4-5`  |
| Claude Sonnet 4.5 | `claude-sonnet-4-5`         |
| Claude Opus 4.1   | `claude-opus-4-1`           |
| Claude Haiku 4.5  | `claude-haiku-4-5`          |

預設情況下，部署名稱與上面顯示的模型 ID 相符。但是，您可以在 Foundry 入口網站中建立具有不同名稱的自訂部署，以管理不同的配置、版本或速率限制。在您的 API 請求中使用部署名稱（不一定是模型 ID）。

## 監控和記錄

Azure 透過標準 Azure 模式為您的 Claude 使用提供全面的監控和記錄功能：

- **Azure Monitor**：追蹤 API 使用情況、延遲和錯誤率
- **Azure Log Analytics**：查詢和分析請求/回應日誌
- **成本管理**：監控和預測與 Claude 使用相關的成本

Anthropic 建議至少在 30 天滾動基礎上記錄您的活動，以了解使用模式並調查任何潛在問題。

<Note>
Azure 的記錄服務在您的 Azure 訂閱中配置。啟用記錄不會為 Microsoft 或 Anthropic 提供超出計費和服務運作所需的內容存取權。
</Note>

## 疑難排解

### 驗證錯誤

**錯誤**：`401 Unauthorized` 或 `Invalid API key`

- **解決方案**：驗證您的 API 金鑰是否正確。您可以從 Azure 入口網站中 Claude 資源的**金鑰和端點**下取得新的 API 金鑰。
- **解決方案**：如果使用 Azure Entra ID，請確保您的存取權杖有效且尚未過期。權杖通常在 1 小時後過期。

**錯誤**：`403 Forbidden`

- **解決方案**：您的 Azure 帳戶可能缺少必要的權限。確保您已分配適當的 Azure RBAC 角色（例如「認知服務 OpenAI 使用者」）。

### 速率限制

**錯誤**：`429 Too Many Requests`

- **解決方案**：您已超過速率限制。在您的應用程式中實施指數退避和重試邏輯。
- **解決方案**：考慮透過 Azure 入口網站或 Azure 支援請求增加速率限制。

#### 速率限制標頭

Foundry 在回應中不包括 Anthropic 的標準速率限制標頭（`anthropic-ratelimit-tokens-limit`、`anthropic-ratelimit-tokens-remaining`、`anthropic-ratelimit-tokens-reset`、`anthropic-ratelimit-input-tokens-limit`、`anthropic-ratelimit-input-tokens-remaining`、`anthropic-ratelimit-input-tokens-reset`、`anthropic-ratelimit-output-tokens-limit`、`anthropic-ratelimit-output-tokens-remaining` 和 `anthropic-ratelimit-output-tokens-reset`）。改為透過 Azure 的監控工具管理速率限制。

### 模型和部署錯誤

**錯誤**：`Model not found` 或 `Deployment not found`

- **解決方案**：驗證您使用的是正確的部署名稱。如果您尚未建立自訂部署，請使用預設模型 ID（例如 `claude-sonnet-4-5`）。
- **解決方案**：確保模型/部署在您的 Azure 區域中可用。

**錯誤**：`Invalid model parameter`

- **解決方案**：model 參數應包含您的部署名稱，可在 Foundry 入口網站中自訂。驗證部署是否存在且配置正確。

## 其他資源

- **Foundry 文件**：[ai.azure.com/catalog](https://ai.azure.com/catalog/publishers/anthropic)
- **Azure 定價**：[azure.microsoft.com/en-us/pricing](https://azure.microsoft.com/en-us/pricing/)
- **Anthropic 定價詳細資訊**：[定價文件](/docs/zh-TW/about-claude/pricing#third-party-platform-pricing)
- **驗證指南**：請參閱上面的[驗證部分](#authentication)
- **Azure 入口網站**：[portal.azure.com](https://portal.azure.com/)