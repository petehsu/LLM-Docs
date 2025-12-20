# 網頁擷取工具

網頁擷取工具允許 Claude 從指定的網頁和 PDF 文件中檢索完整內容。

---

網頁擷取工具允許 Claude 從指定的網頁和 PDF 文件中檢索完整內容。

<Note>
網頁擷取工具目前處於測試版。若要啟用它，請在 API 請求中使用測試版標頭 `web-fetch-2025-09-10`。

請使用[此表單](https://forms.gle/NhWcgmkcvPCMmPE86)提供有關模型回應品質、API 本身或文件品質的反饋。
</Note>

<Warning>
在 Claude 處理不受信任的輸入以及敏感資料的環境中啟用網頁擷取工具會帶來資料外洩風險。我們建議僅在受信任的環境中或處理非敏感資料時使用此工具。

為了最小化外洩風險，Claude 不允許動態構造 URL。Claude 只能擷取使用者明確提供的 URL，或來自先前網頁搜尋或網頁擷取結果的 URL。但是，仍然存在使用此工具時應仔細考慮的殘留風險。

如果資料外洩是一個問題，請考慮：
- 完全停用網頁擷取工具
- 使用 `max_uses` 參數限制請求數量
- 使用 `allowed_domains` 參數限制為已知的安全網域
</Warning>

## 支援的模型

網頁擷取可用於：

- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Sonnet 3.7 ([已棄用](/docs/zh-TW/about-claude/model-deprecations)) (`claude-3-7-sonnet-20250219`)
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)
- Claude Haiku 3.5 (`claude-3-5-haiku-latest`)
- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)

## 網頁擷取如何運作

當您在 API 請求中新增網頁擷取工具時：

1. Claude 根據提示和可用的 URL 決定何時擷取內容。
2. API 從指定的 URL 檢索完整文字內容。
3. 對於 PDF，會執行自動文字提取。
4. Claude 分析擷取的內容並提供包含可選引用的回應。

<Note>
網頁擷取工具目前不支援透過 Javascript 動態呈現的網站。
</Note>

## 如何使用網頁擷取

在 API 請求中提供網頁擷取工具：

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: web-fetch-2025-09-10" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 1024,
        "messages": [
            {
                "role": "user",
                "content": "Please analyze the content at https://example.com/article"
            }
        ],
        "tools": [{
            "type": "web_fetch_20250910",
            "name": "web_fetch",
            "max_uses": 5
        }]
    }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": "Please analyze the content at https://example.com/article"
        }
    ],
    tools=[{
        "type": "web_fetch_20250910",
        "name": "web_fetch",
        "max_uses": 5
    }],
    extra_headers={
        "anthropic-beta": "web-fetch-2025-09-10"
    }
)
print(response)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

async function main() {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: "Please analyze the content at https://example.com/article"
      }
    ],
    tools: [{
      type: "web_fetch_20250910",
      name: "web_fetch",
      max_uses: 5
    }],
    headers: {
      "anthropic-beta": "web-fetch-2025-09-10"
    }
  });

  console.log(response);
}

main().catch(console.error);
```
</CodeGroup>

### 工具定義

網頁擷取工具支援以下參數：

```json JSON
{
  "type": "web_fetch_20250910",
  "name": "web_fetch",

  // 可選：限制每個請求的擷取次數
  "max_uses": 10,

  // 可選：僅從這些網域擷取
  "allowed_domains": ["example.com", "docs.example.com"],

  // 可選：永遠不從這些網域擷取
  "blocked_domains": ["private.example.com"],

  // 可選：為擷取的內容啟用引用
  "citations": {
    "enabled": true
  },

  // 可選：最大內容長度（以 token 為單位）
  "max_content_tokens": 100000
}
```

#### 最大使用次數

`max_uses` 參數限制執行的網頁擷取次數。如果 Claude 嘗試的擷取次數超過允許的次數，`web_fetch_tool_result` 將是一個錯誤，錯誤代碼為 `max_uses_exceeded`。目前沒有預設限制。

#### 網域篩選

使用網域篩選時：

- 網域不應包含 HTTP/HTTPS 方案（使用 `example.com` 而不是 `https://example.com`）
- 子網域會自動包含（`example.com` 涵蓋 `docs.example.com`）
- 支援子路徑（`example.com/blog`）
- 您可以使用 `allowed_domains` 或 `blocked_domains`，但不能在同一個請求中同時使用兩者。

<Warning>
請注意，網域名稱中的 Unicode 字元可能會透過同形異義字攻擊造成安全漏洞，其中來自不同文字的視覺相似字元可能會繞過網域篩選。例如，`аmazon.com`（使用西里爾字母「а」）可能看起來與 `amazon.com` 相同，但代表不同的網域。

配置網域允許/封鎖清單時：
- 盡可能使用僅 ASCII 的網域名稱
- 考慮 URL 解析器可能以不同方式處理 Unicode 正規化
- 使用潛在的同形異義字變體測試您的網域篩選
- 定期審計您的網域配置以查找可疑的 Unicode 字元
</Warning>

#### 內容限制

`max_content_tokens` 參數限制將包含在上下文中的內容量。如果擷取的內容超過此限制，將被截斷。這有助於在擷取大型文件時控制 token 使用。

<Note>
`max_content_tokens` 參數限制是近似的。實際使用的輸入 token 數量可能會有小幅變化。
</Note>

#### 引用

與網頁搜尋不同（引用始終啟用），網頁擷取的引用是可選的。設定 `"citations": {"enabled": true}` 以啟用 Claude 引用擷取文件中的特定段落。

<Note>
在直接向最終使用者顯示 API 輸出時，必須包含對原始來源的引用。如果您在顯示給最終使用者之前對 API 輸出進行修改，包括重新處理和/或將其與您自己的材料結合，請根據與您的法律團隊的諮詢適當地顯示引用。
</Note>

### 回應

以下是一個範例回應結構：

```json
{
  "role": "assistant",
  "content": [
    // 1. Claude 的擷取決定
    {
      "type": "text",
      "text": "I'll fetch the content from the article to analyze it."
    },
    // 2. 擷取請求
    {
      "type": "server_tool_use",
      "id": "srvtoolu_01234567890abcdef",
      "name": "web_fetch",
      "input": {
        "url": "https://example.com/article"
      }
    },
    // 3. 擷取結果
    {
      "type": "web_fetch_tool_result",
      "tool_use_id": "srvtoolu_01234567890abcdef",
      "content": {
        "type": "web_fetch_result",
        "url": "https://example.com/article",
        "content": {
          "type": "document",
          "source": {
            "type": "text",
            "media_type": "text/plain",
            "data": "Full text content of the article..."
          },
          "title": "Article Title",
          "citations": {"enabled": true}
        },
        "retrieved_at": "2025-08-25T10:30:00Z"
      }
    },
    // 4. Claude 的分析（如果啟用引用）
    {
      "text": "Based on the article, ",
      "type": "text"
    },
    {
      "text": "the main argument presented is that artificial intelligence will transform healthcare",
      "type": "text",
      "citations": [
        {
          "type": "char_location",
          "document_index": 0,
          "document_title": "Article Title",
          "start_char_index": 1234,
          "end_char_index": 1456,
          "cited_text": "Artificial intelligence is poised to revolutionize healthcare delivery..."
        }
      ]
    }
  ],
  "id": "msg_a930390d3a",
  "usage": {
    "input_tokens": 25039,
    "output_tokens": 931,
    "server_tool_use": {
      "web_fetch_requests": 1
    }
  },
  "stop_reason": "end_turn"
}
```

#### 擷取結果

擷取結果包括：

- `url`：擷取的 URL
- `content`：包含擷取內容的文件區塊
- `retrieved_at`：擷取內容的時間戳記

<Note>
網頁擷取工具會快取結果以改善效能並減少冗餘請求。這意味著返回的內容可能不總是 URL 上可用的最新版本。快取行為會自動管理，並可能隨著時間推移而改變，以針對不同的內容類型和使用模式進行最佳化。
</Note>

對於 PDF 文件，內容將以 base64 編碼資料的形式返回：

```json
{
  "type": "web_fetch_tool_result",
  "tool_use_id": "srvtoolu_02",
  "content": {
    "type": "web_fetch_result",
    "url": "https://example.com/paper.pdf",
    "content": {
      "type": "document",
      "source": {
        "type": "base64",
        "media_type": "application/pdf",
        "data": "JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmo..."
      },
      "citations": {"enabled": true}
    },
    "retrieved_at": "2025-08-25T10:30:02Z"
  }
}
```

#### 錯誤

當網頁擷取工具遇到錯誤時，Claude API 會返回 200（成功）回應，錯誤在回應本文中表示：

```json
{
  "type": "web_fetch_tool_result",
  "tool_use_id": "srvtoolu_a93jad",
  "content": {
    "type": "web_fetch_tool_error",
    "error_code": "url_not_accessible"
  }
}
```

這些是可能的錯誤代碼：

- `invalid_input`：無效的 URL 格式
- `url_too_long`：URL 超過最大長度（250 個字元）
- `url_not_allowed`：URL 被網域篩選規則和模型限制封鎖
- `url_not_accessible`：無法擷取內容（HTTP 錯誤）
- `too_many_requests`：超過速率限制
- `unsupported_content_type`：不支援的內容類型（僅限文字和 PDF）
- `max_uses_exceeded`：超過最大網頁擷取工具使用次數
- `unavailable`：發生內部錯誤

## URL 驗證

出於安全原因，網頁擷取工具只能擷取先前在對話上下文中出現過的 URL。這包括：

- 使用者訊息中的 URL
- 用戶端工具結果中的 URL
- 來自先前網頁搜尋或網頁擷取結果的 URL

該工具無法擷取 Claude 生成的任意 URL 或來自容器型伺服器工具（程式碼執行、Bash 等）的 URL。

## 結合搜尋和擷取

網頁擷取與網頁搜尋無縫協作，以進行全面的資訊蒐集：

```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Find recent articles about quantum computing and analyze the most relevant one in detail"
        }
    ],
    tools=[
        {
            "type": "web_search_20250305",
            "name": "web_search",
            "max_uses": 3
        },
        {
            "type": "web_fetch_20250910",
            "name": "web_fetch",
            "max_uses": 5,
            "citations": {"enabled": True}
        }
    ],
    extra_headers={
        "anthropic-beta": "web-fetch-2025-09-10"
    }
)
```

在此工作流程中，Claude 將：
1. 使用網頁搜尋尋找相關文章
2. 選擇最有前景的結果
3. 使用網頁擷取檢索完整內容
4. 提供帶有引用的詳細分析

## 提示快取

網頁擷取適用於[提示快取](/docs/zh-TW/build-with-claude/prompt-caching)。若要啟用提示快取，請在您的請求中新增 `cache_control` 中斷點。快取的擷取結果可以在對話輪次中重複使用。

```python
import anthropic

client = anthropic.Anthropic()

# 首次請求，使用網頁擷取
messages = [
    {
        "role": "user",
        "content": "Analyze this research paper: https://arxiv.org/abs/2024.12345"
    }
]

response1 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=messages,
    tools=[{
        "type": "web_fetch_20250910",
        "name": "web_fetch"
    }],
    extra_headers={
        "anthropic-beta": "web-fetch-2025-09-10"
    }
)

# 將 Claude 的回應新增到對話
messages.append({
    "role": "assistant",
    "content": response1.content
})

# 第二個請求，帶有快取中斷點
messages.append({
    "role": "user",
    "content": "What methodology does the paper use?",
    "cache_control": {"type": "ephemeral"}
})

response2 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=messages,
    tools=[{
        "type": "web_fetch_20250910",
        "name": "web_fetch"
    }],
    extra_headers={
        "anthropic-beta": "web-fetch-2025-09-10"
    }
)

# 第二個回應受益於快取的擷取結果
print(f"Cache read tokens: {response2.usage.get('cache_read_input_tokens', 0)}")
```

## 串流

啟用串流後，擷取事件是串流的一部分，在內容檢索期間會暫停：

```javascript
event: message_start
data: {"type": "message_start", "message": {"id": "msg_abc123", "type": "message"}}

event: content_block_start
data: {"type": "content_block_start", "index": 0, "content_block": {"type": "text", "text": ""}}

// Claude 的擷取決定

event: content_block_start
data: {"type": "content_block_start", "index": 1, "content_block": {"type": "server_tool_use", "id": "srvtoolu_xyz789", "name": "web_fetch"}}

// 擷取 URL 串流
event: content_block_delta
data: {"type": "content_block_delta", "index": 1, "delta": {"type": "input_json_delta", "partial_json": "{\"url\":\"https://example.com/article\"}"}}

// 在擷取執行時暫停

// 擷取結果串流
event: content_block_start
data: {"type": "content_block_start", "index": 2, "content_block": {"type": "web_fetch_tool_result", "tool_use_id": "srvtoolu_xyz789", "content": {"type": "web_fetch_result", "url": "https://example.com/article", "content": {"type": "document", "source": {"type": "text", "media_type": "text/plain", "data": "Article content..."}}}}}

// Claude 的回應繼續...
```

## 批次請求

您可以在[訊息批次 API](/docs/zh-TW/build-with-claude/batch-processing) 中包含網頁擷取工具。透過訊息批次 API 的網頁擷取工具呼叫的定價與常規訊息 API 請求中的相同。

## 使用和定價

Web fetch usage has **no additional charges** beyond standard token costs:

```json
"usage": {
  "input_tokens": 25039,
  "output_tokens": 931,
  "cache_read_input_tokens": 0,
  "cache_creation_input_tokens": 0,
  "server_tool_use": {
    "web_fetch_requests": 1
  }
}
```

The web fetch tool is available on the Claude API at **no additional cost**. You only pay standard token costs for the fetched content that becomes part of your conversation context.

To protect against inadvertently fetching large content that would consume excessive tokens, use the `max_content_tokens` parameter to set appropriate limits based on your use case and budget considerations.

Example token usage for typical content:
- Average web page (10KB): ~2,500 tokens
- Large documentation page (100KB): ~25,000 tokens  
- Research paper PDF (500KB): ~125,000 tokens