# 網路搜尋工具

Claude 網路搜尋工具可讓 Claude 直接存取即時網路內容，並自動引用搜尋結果中的來源。

---

網路搜尋工具讓 Claude 直接存取即時網路內容，使其能夠以超越知識截止日期的最新資訊回答問題。Claude 會自動引用搜尋結果中的來源作為其答案的一部分。

<Note>
請透過我們的[意見回饋表單](https://forms.gle/sWjBtsrNEY2oKGuE8)分享您對網路搜尋工具的使用體驗。
</Note>

## 支援的模型

網路搜尋可用於：

- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Sonnet 3.7 ([已棄用](/docs/zh-TW/about-claude/model-deprecations)) (`claude-3-7-sonnet-20250219`)
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)
- Claude Haiku 3.5 (`claude-3-5-haiku-latest`)
- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)

## 網路搜尋的運作方式

當您在 API 請求中新增網路搜尋工具時：

1. Claude 根據提示決定何時進行搜尋。
2. API 執行搜尋並向 Claude 提供結果。此過程可能在單一請求中重複多次。
3. 在其回合結束時，Claude 提供帶有引用來源的最終回應。

## 如何使用網路搜尋

<Note>
您的組織管理員必須在[主控台](/settings/privacy)中啟用網路搜尋。
</Note>

在您的 API 請求中提供網路搜尋工具：

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 1024,
        "messages": [
            {
                "role": "user",
                "content": "What is the weather in NYC?"
            }
        ],
        "tools": [{
            "type": "web_search_20250305",
            "name": "web_search",
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
            "content": "What's the weather in NYC?"
        }
    ],
    tools=[{
        "type": "web_search_20250305",
        "name": "web_search",
        "max_uses": 5
    }]
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
        content: "What's the weather in NYC?"
      }
    ],
    tools: [{
      type: "web_search_20250305",
      name: "web_search",
      max_uses: 5
    }]
  });

  console.log(response);
}

main().catch(console.error);
```
</CodeGroup>

### 工具定義

網路搜尋工具支援以下參數：

```json JSON
{
  "type": "web_search_20250305",
  "name": "web_search",

  // 選用：限制每個請求的搜尋次數
  "max_uses": 5,

  // 選用：僅包含來自這些網域的結果
  "allowed_domains": ["example.com", "trusteddomain.org"],

  // 選用：永遠不包含來自這些網域的結果
  "blocked_domains": ["untrustedsource.com"],

  // 選用：本地化搜尋結果
  "user_location": {
    "type": "approximate",
    "city": "San Francisco",
    "region": "California",
    "country": "US",
    "timezone": "America/Los_Angeles"
  }
}
```

#### 最大使用次數

`max_uses` 參數限制執行的搜尋次數。如果 Claude 嘗試的搜尋次數超過允許的次數，`web_search_tool_result` 將是一個錯誤，錯誤代碼為 `max_uses_exceeded`。

#### 網域篩選

使用網域篩選時：

- 網域不應包含 HTTP/HTTPS 方案（使用 `example.com` 而不是 `https://example.com`）
- 子網域會自動包含（`example.com` 涵蓋 `docs.example.com`）
- 特定子網域將結果限制為僅該子網域（`docs.example.com` 僅返回該子網域的結果，不返回 `example.com` 或 `api.example.com` 的結果）
- 支援子路徑並匹配路徑後的任何內容（`example.com/blog` 匹配 `example.com/blog/post-1`）
- 您可以使用 `allowed_domains` 或 `blocked_domains`，但不能在同一請求中同時使用兩者。

**萬用字元支援：**

- 每個網域項目只允許一個萬用字元 (`*`)，且必須出現在網域部分之後（在路徑中）
- 有效：`example.com/*`、`example.com/*/articles`
- 無效：`*.example.com`、`ex*.com`、`example.com/*/news/*`

無效的網域格式將返回 `invalid_tool_input` 工具錯誤。

<Note>
請求層級的網域限制必須與主控台中設定的組織層級網域限制相容。請求層級的網域只能進一步限制網域，不能覆蓋或超出組織層級清單。如果您的請求包含與組織設定衝突的網域，API 將返回驗證錯誤。
</Note>

#### 本地化

`user_location` 參數允許您根據使用者的位置本地化搜尋結果。

- `type`：位置類型（必須為 `approximate`）
- `city`：城市名稱
- `region`：地區或州
- `country`：國家
- `timezone`：[IANA 時區 ID](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)。

### 回應

以下是回應結構的範例：

```json
{
  "role": "assistant",
  "content": [
    // 1. Claude 的搜尋決定
    {
      "type": "text",
      "text": "I'll search for when Claude Shannon was born."
    },
    // 2. 使用的搜尋查詢
    {
      "type": "server_tool_use",
      "id": "srvtoolu_01WYG3ziw53XMcoyKL4XcZmE",
      "name": "web_search",
      "input": {
        "query": "claude shannon birth date"
      }
    },
    // 3. 搜尋結果
    {
      "type": "web_search_tool_result",
      "tool_use_id": "srvtoolu_01WYG3ziw53XMcoyKL4XcZmE",
      "content": [
        {
          "type": "web_search_result",
          "url": "https://en.wikipedia.org/wiki/Claude_Shannon",
          "title": "Claude Shannon - Wikipedia",
          "encrypted_content": "EqgfCioIARgBIiQ3YTAwMjY1Mi1mZjM5LTQ1NGUtODgxNC1kNjNjNTk1ZWI3Y...",
          "page_age": "April 30, 2025"
        }
      ]
    },
    {
      "text": "Based on the search results, ",
      "type": "text"
    },
    // 4. Claude 的帶有引用的回應
    {
      "text": "Claude Shannon was born on April 30, 1916, in Petoskey, Michigan",
      "type": "text",
      "citations": [
        {
          "type": "web_search_result_location",
          "url": "https://en.wikipedia.org/wiki/Claude_Shannon",
          "title": "Claude Shannon - Wikipedia",
          "encrypted_index": "Eo8BCioIAhgBIiQyYjQ0OWJmZi1lNm..",
          "cited_text": "Claude Elwood Shannon (April 30, 1916 – February 24, 2001) was an American mathematician, electrical engineer, computer scientist, cryptographer and i..."
        }
      ]
    }
  ],
  "id": "msg_a930390d3a",
  "usage": {
    "input_tokens": 6039,
    "output_tokens": 931,
    "server_tool_use": {
      "web_search_requests": 1
    }
  },
  "stop_reason": "end_turn"
}
```

#### 搜尋結果

搜尋結果包括：

- `url`：來源頁面的 URL
- `title`：來源頁面的標題
- `page_age`：網站上次更新的時間
- `encrypted_content`：加密內容，必須在多回合對話中傳回以用於引用

#### 引用

引用始終為網路搜尋啟用，每個 `web_search_result_location` 包括：

- `url`：引用來源的 URL
- `title`：引用來源的標題
- `encrypted_index`：必須為多回合對話傳回的參考。
- `cited_text`：最多 150 個字元的引用內容

網路搜尋引用欄位 `cited_text`、`title` 和 `url` 不計入輸入或輸出令牌使用量。

<Note>
  直接向終端使用者顯示 API 輸出時，必須包含對原始來源的引用。如果您在向終端使用者顯示之前對 API 輸出進行修改，包括重新處理和/或將其與您自己的材料結合，請根據與您的法律團隊的諮詢適當顯示引用。
</Note>

#### 錯誤

當網路搜尋工具遇到錯誤（例如達到速率限制）時，Claude API 仍會返回 200（成功）回應。錯誤在回應正文中使用以下結構表示：

```json
{
  "type": "web_search_tool_result",
  "tool_use_id": "servertoolu_a93jad",
  "content": {
    "type": "web_search_tool_result_error",
    "error_code": "max_uses_exceeded"
  }
}
```

這些是可能的錯誤代碼：

- `too_many_requests`：超過速率限制
- `invalid_input`：無效的搜尋查詢參數
- `max_uses_exceeded`：超過最大網路搜尋工具使用次數
- `query_too_long`：查詢超過最大長度
- `unavailable`：發生內部錯誤

#### `pause_turn` 停止原因

回應可能包括 `pause_turn` 停止原因，表示 API 暫停了長時間執行的回合。您可以在後續請求中原樣提供回應以讓 Claude 繼續其回合，或修改內容以中斷對話。

## 提示快取

網路搜尋適用於[提示快取](/docs/zh-TW/build-with-claude/prompt-caching)。若要啟用提示快取，請在您的請求中新增至少一個 `cache_control` 中斷點。執行工具時，系統會自動快取到最後一個 `web_search_tool_result` 區塊。

對於多回合對話，在最後一個 `web_search_tool_result` 區塊上或之後設定 `cache_control` 中斷點以重複使用快取內容。

例如，若要在多回合對話中使用提示快取與網路搜尋：

<CodeGroup>
```python
import anthropic

client = anthropic.Anthropic()

# 第一個請求，包含網路搜尋和快取中斷點
messages = [
    {
        "role": "user",
        "content": "What's the current weather in San Francisco today?"
    }
]

response1 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=messages,
    tools=[{
        "type": "web_search_20250305",
        "name": "web_search",
        "user_location": {
            "type": "approximate",
            "city": "San Francisco",
            "region": "California",
            "country": "US",
            "timezone": "America/Los_Angeles"
        }
    }]
)

# 將 Claude 的回應新增到對話中
messages.append({
    "role": "assistant",
    "content": response1.content
})

# 第二個請求，在搜尋結果後設定快取中斷點
messages.append({
    "role": "user",
    "content": "Should I expect rain later this week?",
    "cache_control": {"type": "ephemeral"}  # 快取到此點
})

response2 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=messages,
    tools=[{
        "type": "web_search_20250305",
        "name": "web_search",
        "user_location": {
            "type": "approximate",
            "city": "San Francisco",
            "region": "California",
            "country": "US",
            "timezone": "America/Los_Angeles"
        }
    }]
)
# 第二個回應將受益於快取的搜尋結果
# 同時仍能在需要時執行新搜尋
print(f"Cache read tokens: {response2.usage.get('cache_read_input_tokens', 0)}")
```

</CodeGroup>

## 串流

啟用串流後，您將在串流中接收搜尋事件。搜尋執行時會有暫停：

```javascript
event: message_start
data: {"type": "message_start", "message": {"id": "msg_abc123", "type": "message"}}

event: content_block_start
data: {"type": "content_block_start", "index": 0, "content_block": {"type": "text", "text": ""}}

// Claude 的搜尋決定

event: content_block_start
data: {"type": "content_block_start", "index": 1, "content_block": {"type": "server_tool_use", "id": "srvtoolu_xyz789", "name": "web_search"}}

// 搜尋查詢已串流
event: content_block_delta
data: {"type": "content_block_delta", "index": 1, "delta": {"type": "input_json_delta", "partial_json": "{\"query\":\"latest quantum computing breakthroughs 2025\"}"}}

// 搜尋執行時暫停

// 搜尋結果已串流
event: content_block_start
data: {"type": "content_block_start", "index": 2, "content_block": {"type": "web_search_tool_result", "tool_use_id": "srvtoolu_xyz789", "content": [{"type": "web_search_result", "title": "Quantum Computing Breakthroughs in 2025", "url": "https://example.com"}]}}

// Claude 的帶有引用的回應（此範例中省略）
```

## 批次請求

您可以在[訊息批次 API](/docs/zh-TW/build-with-claude/batch-processing) 中包含網路搜尋工具。透過訊息批次 API 的網路搜尋工具呼叫的定價與常規訊息 API 請求中的相同。

## 使用量和定價

Web search usage is charged in addition to token usage:

```json
"usage": {
  "input_tokens": 105,
  "output_tokens": 6039,
  "cache_read_input_tokens": 7123,
  "cache_creation_input_tokens": 7345,
  "server_tool_use": {
    "web_search_requests": 1
  }
}
```

Web search is available on the Claude API for **$10 per 1,000 searches**, plus standard token costs for search-generated content. Web search results retrieved throughout a conversation are counted as input tokens, in search iterations executed during a single turn and in subsequent conversation turns.

Each web search counts as one use, regardless of the number of results returned. If an error occurs during web search, the web search will not be billed.