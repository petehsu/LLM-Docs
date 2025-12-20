# API 概覽

Claude API 是一個 RESTful API，提供對 Claude 模型的程式化存取。了解可用的 API、身份驗證、速率限制和入門步驟。

---

Claude API 是位於 `https://api.anthropic.com` 的 RESTful API，提供對 Claude 模型的程式化存取。主要 API 是 Messages API (`POST /v1/messages`)，用於對話互動。

<Note>
**初次使用 Claude？** 從 [開始使用](/docs/zh-TW/get-started) 了解先決條件和您的第一個 API 呼叫，或查看 [使用 Messages](/docs/zh-TW/build-with-claude/working-with-messages) 了解請求/回應模式和範例。
</Note>

## 先決條件

要使用 Claude API，您需要：

- 一個 [Anthropic Console 帳戶](https://console.anthropic.com)
- 一個 [API 金鑰](/settings/keys)

如需逐步設定說明，請參閱 [開始使用](/docs/zh-TW/get-started)。

## 可用的 API

Claude API 包括以下 API：

**正式版本：**
- **[Messages API](/docs/zh-TW/api/messages)**：向 Claude 傳送訊息以進行對話互動 (`POST /v1/messages`)
- **[Message Batches API](/docs/zh-TW/api/creating-message-batches)**：以非同步方式處理大量 Messages 請求，成本降低 50% (`POST /v1/messages/batches`)
- **[Token Counting API](/docs/zh-TW/api/messages-count-tokens)**：在傳送前計算訊息中的令牌數，以管理成本和速率限制 (`POST /v1/messages/count_tokens`)
- **[Models API](/docs/zh-TW/api/models-list)**：列出可用的 Claude 模型及其詳細資訊 (`GET /v1/models`)

**測試版：**
- **[Files API](/docs/zh-TW/api/files-create)**：上傳和管理檔案以供多個 API 呼叫使用 (`POST /v1/files`, `GET /v1/files`)
- **[Skills API](/docs/zh-TW/api/skills/create-skill)**：建立和管理自訂代理技能 (`POST /v1/skills`, `GET /v1/skills`)

如需完整的 API 參考（包含所有端點、參數和回應架構），請探索導覽中列出的 API 參考頁面。若要存取測試版功能，請參閱 [Beta 標頭](/docs/zh-TW/api/beta-headers)。

## 身份驗證

對 Claude API 的所有請求必須包含這些標頭：

| 標頭 | 值 | 必需 |
|--------|-------|----------|
| `x-api-key` | 您從 Console 取得的 API 金鑰 | 是 |
| `anthropic-version` | API 版本（例如 `2023-06-01`） | 是 |
| `content-type` | `application/json` | 是 |

如果您使用 [Client SDKs](#client-sdks)，SDK 將自動傳送這些標頭。如需 API 版本控制詳細資訊，請參閱 [API 版本](/docs/zh-TW/api/versioning)。

### 取得 API 金鑰

API 透過網路 [Console](https://console.anthropic.com/) 提供。您可以使用 [Workbench](https://console.anthropic.com/workbench) 在瀏覽器中試用 API，然後在 [帳戶設定](https://console.anthropic.com/settings/keys) 中產生 API 金鑰。使用 [工作區](https://console.anthropic.com/settings/workspaces) 來分段您的 API 金鑰並 [控制支出](/docs/zh-TW/api/rate-limits) 按使用案例。

## Client SDKs

Anthropic 提供官方 SDK，透過處理身份驗證、請求格式化、錯誤處理等，簡化 API 整合。

**優點**：
- 自動標頭管理 (x-api-key, anthropic-version, content-type)
- 型別安全的請求和回應處理
- 內建重試邏輯和錯誤處理
- 串流支援
- 請求逾時和連線管理

**範例** (Python)：
```python
from anthropic import Anthropic

client = Anthropic()  # Reads ANTHROPIC_API_KEY from environment
message = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello, Claude"}]
)
```

如需 Client SDK 清單及其各自的安裝說明，請參閱 [Client SDKs](/docs/zh-TW/api/client-sdks)。

## Claude API 與第三方平台

Claude 可透過 Anthropic 的直接 API 和合作夥伴平台取得。根據您的基礎設施、合規要求和定價偏好進行選擇。

### Claude API

- **直接存取**最新模型和功能
- **Anthropic 計費和支援**
- **最適合**：新整合、完整功能存取、與 Anthropic 的直接關係

### 第三方平台 API

透過 AWS、Google Cloud 或 Microsoft Azure 存取 Claude：
- **與雲端提供商計費和 IAM 整合**
- **可能有功能延遲**或與直接 API 不同
- **最適合**：現有雲端承諾、特定合規要求、統一的雲端計費

| 平台 | 提供商 | 文件 |
|----------|----------|---------------|
| Amazon Bedrock | AWS | [Claude on Amazon Bedrock](/docs/zh-TW/build-with-claude/claude-on-amazon-bedrock) |
| Vertex AI | Google Cloud | [Claude on Vertex AI](/docs/zh-TW/build-with-claude/claude-on-vertex-ai) |
| Azure AI | Microsoft Azure | [Claude on Azure AI](/docs/zh-TW/build-with-claude/claude-in-microsoft-foundry) |

<Note>
如需跨平台的功能可用性，請參閱 [功能概覽](/docs/zh-TW/build-with-claude/overview)。
</Note>

## 請求和回應格式

### 請求大小限制

API 根據端點有不同的最大請求大小：

| 端點 | 最大大小 |
|----------|--------------|
| 標準端點 (Messages、Token Counting) | 32 MB |
| [Batch API](/docs/zh-TW/build-with-claude/batch-processing) | 256 MB |
| [Files API](/docs/zh-TW/build-with-claude/files) | 500 MB |

如果您超過這些限制，您將收到 413 `request_too_large` 錯誤。

### 回應標頭

Claude API 在每個回應中包含以下標頭：

- `request-id`：請求的全域唯一識別碼
- `anthropic-organization-id`：與請求中使用的 API 金鑰相關聯的組織 ID

## 速率限制和可用性

### 速率限制

API 強制執行速率限制和支出限制，以防止濫用和管理容量。限制組織成使用層級，隨著您使用 API 而自動增加。每個層級都有：

- **支出限制**：API 使用的最大月度成本
- **速率限制**：每分鐘最大請求數 (RPM) 和每分鐘令牌數 (TPM)

您可以在 [Console](/settings/limits) 中檢視您的組織目前的限制。如需更高的限制或優先級層級（具有承諾支出的增強服務級別），請透過 Console 聯絡銷售。

如需有關限制、層級和用於速率限制的令牌桶演算法的詳細資訊，請參閱 [速率限制](/docs/zh-TW/api/rate-limits)。

### 可用性

Claude API 在全球 [許多國家和地區](/docs/zh-TW/api/supported-regions) 提供。檢查支援的地區頁面以確認您所在位置的可用性。

## 基本範例

以下是使用 Messages API 的最小請求：

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

**回應：**
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

如需完整的範例和教學課程，請參閱 [開始使用](/docs/zh-TW/get-started) 和 [使用 Messages](/docs/zh-TW/build-with-claude/working-with-messages)。

## 後續步驟

<CardGroup cols={3}>
  <Card title="開始使用" icon="rocket" href="/docs/zh-TW/get-started">
    先決條件、逐步教學課程和多種語言的範例
  </Card>
  <Card title="使用 Messages" icon="message" href="/docs/zh-TW/build-with-claude/working-with-messages">
    請求/回應模式、多輪對話和最佳實踐
  </Card>
  <Card title="Messages API 參考" icon="book" href="/docs/zh-TW/api/messages">
    完整 API 規格：參數、回應和錯誤代碼
  </Card>
  <Card title="Client SDKs" icon="code" href="/docs/zh-TW/api/client-sdks">
    Python、TypeScript、Java、Go、C#、Ruby 和 PHP 的安裝指南
  </Card>
  <Card title="功能概覽" icon="grid" href="/docs/zh-TW/build-with-claude/overview">
    探索功能：快取、視覺、工具使用、串流等
  </Card>
  <Card title="速率限制" icon="gauge" href="/docs/zh-TW/api/rate-limits">
    使用層級、支出限制和使用令牌桶演算法的速率限制
  </Card>
</CardGroup>