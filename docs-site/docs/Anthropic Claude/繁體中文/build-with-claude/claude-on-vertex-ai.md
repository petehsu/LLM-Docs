# Vertex AI 上的 Claude

Anthropic 的 Claude 模型現已通過 [Vertex AI](https://cloud.google.com/vertex-ai) 正式推出。

---

用於存取 Claude 的 Vertex API 幾乎與 [Messages API](/docs/zh-TW/api/messages) 相同，並支援所有相同的選項，但有兩個主要差異：

* 在 Vertex 中，`model` 不在請求正文中傳遞。相反，它在 Google Cloud 端點 URL 中指定。
* 在 Vertex 中，`anthropic_version` 在請求正文中傳遞（而不是作為標頭），並且必須設定為值 `vertex-2023-10-16`。

Vertex 也受到 Anthropic 官方 [client SDKs](/docs/zh-TW/api/client-sdks) 的支援。本指南將引導您完成在 Python 或 TypeScript 中向 Vertex AI 上的 Claude 發出請求的過程。

請注意，本指南假設您已經擁有能夠使用 Vertex AI 的 GCP 專案。有關所需的設定以及完整的逐步說明，請參閱 [使用 Anthropic 的 Claude 3 模型](https://cloud.google.com/vertex-ai/generative-ai/docs/partner-models/use-claude)。

## 安裝用於存取 Vertex AI 的 SDK

首先，為您選擇的語言安裝 Anthropic 的 [client SDK](/docs/zh-TW/api/client-sdks)。

<CodeGroup>
  ```python Python
  pip install -U google-cloud-aiplatform "anthropic[vertex]"
  ```

  ```typescript TypeScript
  npm install @anthropic-ai/vertex-sdk
  ```
</CodeGroup>

## 存取 Vertex AI

### 模型可用性

請注意，Anthropic 模型的可用性因地區而異。在 [Vertex AI Model Garden](https://cloud.google.com/model-garden) 中搜尋「Claude」或前往 [使用 Claude 3](https://cloud.google.com/vertex-ai/generative-ai/docs/partner-models/use-claude) 以取得最新資訊。

#### API 模型 ID

| 模型                          | Vertex AI API 模型 ID |
| ------------------------------ | ------------------------ |
| Claude Sonnet 4.5              | claude-sonnet-4-5@20250929 |
| Claude Sonnet 4                | claude-sonnet-4@20250514 |
| Claude Sonnet 3.7 <Tooltip tooltipContent="自 2025 年 10 月 28 日起已棄用。">⚠️</Tooltip> | claude-3-7-sonnet@20250219 |
| Claude Opus 4.5                | claude-opus-4-5@20251101 |
| Claude Opus 4.1                | claude-opus-4-1@20250805 |
| Claude Opus 4                  | claude-opus-4@20250514   |
| Claude Opus 3 <Tooltip tooltipContent="自 2025 年 6 月 30 日起已棄用。">⚠️</Tooltip> | claude-3-opus@20240229   |
| Claude Haiku 4.5               | claude-haiku-4-5@20251001 |
| Claude Haiku 3.5               | claude-3-5-haiku@20241022 |
| Claude Haiku 3                 | claude-3-haiku@20240307  |

### 發出請求

在執行請求之前，您可能需要執行 `gcloud auth application-default login` 以使用 GCP 進行驗證。

以下範例顯示如何從 Vertex AI 上的 Claude 產生文字：
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

如需更多詳細資訊，請參閱我們的 [client SDKs](/docs/zh-TW/api/client-sdks) 和官方 [Vertex AI 文件](https://cloud.google.com/vertex-ai/docs)。

## 活動記錄

Vertex 提供 [請求-回應記錄服務](https://cloud.google.com/vertex-ai/generative-ai/docs/multimodal/request-response-logging)，允許客戶記錄與您的使用相關聯的提示和完成。

Anthropic 建議您至少在 30 天滾動基礎上記錄您的活動，以便了解您的活動並調查任何潛在的濫用。

<Note>
啟用此服務不會給 Google 或 Anthropic 任何存取您內容的權限。
</Note>

## 功能支援
您可以在 [此處](/docs/zh-TW/api/overview) 找到 Vertex 上目前支援的所有功能。

## 全域端點與區域端點

從 **Claude Sonnet 4.5 和所有未來模型** 開始，Google Vertex AI 提供兩種端點類型：

- **全域端點**：動態路由以獲得最大可用性
- **區域端點**：保證透過特定地理區域的資料路由

區域端點的定價比全域端點高 10%。

<Note>
這僅適用於 Claude Sonnet 4.5 和未來的模型。較舊的模型（Claude Sonnet 4、Opus 4 及更早版本）保持其現有的定價結構。
</Note>

### 何時使用各選項

**全域端點（建議）：**
- 提供最大可用性和正常運行時間
- 動態將請求路由到具有可用容量的區域
- 無定價溢價
- 最適合資料駐留靈活的應用程式
- 僅支援按使用量付費流量（佈建的輸送量需要區域端點）

**區域端點：**
- 透過特定地理區域路由流量
- 資料駐留和合規要求所需
- 支援按使用量付費和佈建的輸送量
- 10% 的定價溢價反映了專用區域容量的基礎設施成本

### 實施

**使用全域端點（建議）：**

初始化用戶端時，將 `region` 參數設定為 `"global"`：

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

**使用區域端點：**

指定特定區域，例如 `"us-east1"` 或 `"europe-west1"`：

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

### 其他資源

- **Google Vertex AI 定價：** [cloud.google.com/vertex-ai/generative-ai/pricing](https://cloud.google.com/vertex-ai/generative-ai/pricing)
- **Claude 模型文件：** [Vertex AI 上的 Claude](https://cloud.google.com/vertex-ai/generative-ai/docs/partner-models/claude)
- **Google 部落格文章：** [Claude 模型的全域端點](https://cloud.google.com/blog/products/ai-machine-learning/global-endpoint-for-claude-models-generally-available-on-vertex-ai)
- **Anthropic 定價詳細資訊：** [定價文件](/docs/zh-TW/about-claude/pricing#third-party-platform-pricing)