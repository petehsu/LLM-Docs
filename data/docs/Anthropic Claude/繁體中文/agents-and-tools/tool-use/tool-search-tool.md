# 工具搜尋工具

工具搜尋工具使 Claude 能夠通過動態發現和按需加載來使用數百或數千個工具。

---

工具搜尋工具使 Claude 能夠通過動態發現和按需加載來使用數百或數千個工具。與其將所有工具定義預先加載到上下文窗口中，Claude 會搜尋您的工具目錄（包括工具名稱、描述、參數名稱和參數描述），並僅加載它需要的工具。

隨著工具庫的擴展，這種方法解決了兩個關鍵挑戰：

- **上下文效率**：工具定義可能會消耗您上下文窗口的大部分（50 個工具 ≈ 10-20K 個令牌），留下更少的空間用於實際工作
- **工具選擇準確性**：Claude 在超過 30-50 個常規可用工具時，正確選擇工具的能力會顯著下降

雖然這是作為伺服器端工具提供的，但您也可以實現自己的客戶端工具搜尋功能。有關詳細信息，請參閱[自訂工具搜尋實現](#custom-tool-search-implementation)。

<Note>
工具搜尋工具目前處於公開測試版。為您的提供商包含適當的[測試版標頭](/docs/zh-TW/api/beta-headers)：

| 提供商                 | 測試版標頭                    | 支援的模型                       |
| ------------------------ | ------------------------------ | -------------------------------------- |
| Claude API<br/>Microsoft Foundry  | `advanced-tool-use-2025-11-20` | Claude Opus 4.5<br />Claude Sonnet 4.5 |
| Google Cloud 的 Vertex AI | `tool-search-tool-2025-10-19`  | Claude Opus 4.5<br />Claude Sonnet 4.5 |
| Amazon Bedrock           | `tool-search-tool-2025-10-19`  | Claude Opus 4.5                        |
</Note>

<Warning>
  在 Amazon Bedrock 上，伺服器端工具搜尋僅可通過[調用 API](https://docs.aws.amazon.com/bedrock/latest/userguide/bedrock-runtime_example_bedrock-runtime_InvokeModel_AnthropicClaude_section.html) 獲得，不支援反向 API。
</Warning>

您也可以通過從您自己的搜尋實現返回 `tool_reference` 塊來實現[客戶端工具搜尋](#custom-tool-search-implementation)。

## 工具搜尋的工作原理

有兩種工具搜尋變體：

- **正則表達式** (`tool_search_tool_regex_20251119`)：Claude 構造正則表達式模式來搜尋工具
- **BM25** (`tool_search_tool_bm25_20251119`)：Claude 使用自然語言查詢來搜尋工具

當您啟用工具搜尋工具時：

1. 您在工具列表中包含一個工具搜尋工具（例如 `tool_search_tool_regex_20251119` 或 `tool_search_tool_bm25_20251119`）
2. 您為不應立即加載的工具提供所有工具定義，並設置 `defer_loading: true`
3. Claude 最初只看到工具搜尋工具和任何非延遲工具
4. 當 Claude 需要其他工具時，它使用工具搜尋工具進行搜尋
5. API 返回 3-5 個最相關的 `tool_reference` 塊
6. 這些引用會自動擴展為完整的工具定義
7. Claude 從發現的工具中選擇並調用它們

這樣可以保持您的上下文窗口高效，同時保持高工具選擇準確性。

## 快速開始

以下是一個帶有延遲工具的簡單示例：

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: advanced-tool-use-2025-11-20" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5-20250929",
        "max_tokens": 2048,
        "messages": [
            {
                "role": "user",
                "content": "What is the weather in San Francisco?"
            }
        ],
        "tools": [
            {
                "type": "tool_search_tool_regex_20251119",
                "name": "tool_search_tool_regex"
            },
            {
                "name": "get_weather",
                "description": "Get the weather at a specific location",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "location": {"type": "string"},
                        "unit": {
                            "type": "string",
                            "enum": ["celsius", "fahrenheit"]
                        }
                    },
                    "required": ["location"]
                },
                "defer_loading": true
            },
            {
                "name": "search_files",
                "description": "Search through files in the workspace",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "query": {"type": "string"},
                        "file_types": {
                            "type": "array",
                            "items": {"type": "string"}
                        }
                    },
                    "required": ["query"]
                },
                "defer_loading": true
            }
        ]
    }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=2048,
    messages=[
        {
            "role": "user",
            "content": "What is the weather in San Francisco?"
        }
    ],
    tools=[
        {
            "type": "tool_search_tool_regex_20251119",
            "name": "tool_search_tool_regex"
        },
        {
            "name": "get_weather",
            "description": "Get the weather at a specific location",
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {"type": "string"},
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"]
                    }
                },
                "required": ["location"]
            },
            "defer_loading": True
        },
        {
            "name": "search_files",
            "description": "Search through files in the workspace",
            "input_schema": {
                "type": "object",
                "properties": {
                    "query": {"type": "string"},
                    "file_types": {
                        "type": "array",
                        "items": {"type": "string"}
                    }
                },
                "required": ["query"]
            },
            "defer_loading": True
        }
    ]
)

print(response)
```

```typescript TypeScript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

async function main() {
  const response = await client.beta.messages.create({
    model: "claude-sonnet-4-5-20250929",
    betas: ["advanced-tool-use-2025-11-20"],
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: "What is the weather in San Francisco?",
      },
    ],
    tools: [
      {
        type: "tool_search_tool_regex_20251119",
        name: "tool_search_tool_regex",
      },
      {
        name: "get_weather",
        description: "Get the weather at a specific location",
        input_schema: {
          type: "object",
          properties: {
            location: { type: "string" },
            unit: {
              type: "string",
              enum: ["celsius", "fahrenheit"],
            },
          },
          required: ["location"],
        },
        defer_loading: true,
      },
      {
        name: "search_files",
        description: "Search through files in the workspace",
        input_schema: {
          type: "object",
          properties: {
            query: { type: "string" },
            file_types: {
              type: "array",
              items: { type: "string" },
            },
          },
          required: ["query"],
        },
        defer_loading: true,
      },
    ],
  });

  console.log(JSON.stringify(response, null, 2));
}

main();
```

</CodeGroup>

## 工具定義

工具搜尋工具有兩種變體：

```json JSON
{
  "type": "tool_search_tool_regex_20251119",
  "name": "tool_search_tool_regex"
}
```

```json JSON
{
  "type": "tool_search_tool_bm25_20251119",
  "name": "tool_search_tool_bm25"
}
```

<Warning>
**正則表達式變體查詢格式：Python 正則表達式，不是自然語言**

使用 `tool_search_tool_regex_20251119` 時，Claude 使用 Python 的 `re.search()` 語法構造正則表達式模式，而不是自然語言查詢。常見模式：

- `"weather"` - 匹配包含「weather」的工具名稱/描述
- `"get_.*_data"` - 匹配 `get_user_data`、`get_weather_data` 等工具
- `"database.*query|query.*database"` - 或模式以提高靈活性
- `"(?i)slack"` - 不區分大小寫的搜尋

最大查詢長度：200 個字符

</Warning>

<Note>
**BM25 變體查詢格式：自然語言**

使用 `tool_search_tool_bm25_20251119` 時，Claude 使用自然語言查詢來搜尋工具。

</Note>

### 延遲工具加載

通過添加 `defer_loading: true` 標記工具以按需加載：

```json JSON
{
  "name": "get_weather",
  "description": "Get current weather for a location",
  "input_schema": {
    "type": "object",
    "properties": {
      "location": { "type": "string" },
      "unit": { "type": "string", "enum": ["celsius", "fahrenheit"] }
    },
    "required": ["location"]
  },
  "defer_loading": true
}
```

**關鍵要點：**

- 沒有 `defer_loading` 的工具會立即加載到上下文中
- 具有 `defer_loading: true` 的工具僅在 Claude 通過搜尋發現它們時才加載
- 工具搜尋工具本身**不應該**具有 `defer_loading: true`
- 將您最常用的 3-5 個工具保持為非延遲以獲得最佳性能

兩種工具搜尋變體（`regex` 和 `bm25`）都搜尋工具名稱、描述、參數名稱和參數描述。

## 回應格式

當 Claude 使用工具搜尋工具時，回應包括新的塊類型：

```json JSON
{
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "I'll search for tools to help with the weather information."
    },
    {
      "type": "server_tool_use",
      "id": "srvtoolu_01ABC123",
      "name": "tool_search_tool_regex",
      "input": {
        "query": "weather"
      }
    },
    {
      "type": "tool_search_tool_result",
      "tool_use_id": "srvtoolu_01ABC123",
      "content": {
        "type": "tool_search_tool_search_result",
        "tool_references": [{ "type": "tool_reference", "tool_name": "get_weather" }]
      }
    },
    {
      "type": "text",
      "text": "I found a weather tool. Let me get the weather for San Francisco."
    },
    {
      "type": "tool_use",
      "id": "toolu_01XYZ789",
      "name": "get_weather",
      "input": { "location": "San Francisco", "unit": "fahrenheit" }
    }
  ],
  "stop_reason": "tool_use"
}
```

### 理解回應

- **`server_tool_use`**：表示 Claude 正在調用工具搜尋工具
- **`tool_search_tool_result`**：包含搜尋結果，其中包含嵌套的 `tool_search_tool_search_result` 對象
- **`tool_references`**：指向發現的工具的 `tool_reference` 對象陣列
- **`tool_use`**：Claude 調用發現的工具

`tool_reference` 塊會自動擴展為完整的工具定義，然後顯示給 Claude。您無需自己處理此擴展。只要您在 `tools` 參數中提供所有匹配的工具定義，它就會在 API 中自動進行。

## MCP 整合

工具搜尋工具與 [MCP 伺服器](/docs/zh-TW/agents-and-tools/mcp-connector) 配合使用。將 `"mcp-client-2025-11-20"` [測試版標頭](/docs/zh-TW/api/beta-headers) 添加到您的 API 請求中，然後使用 `mcp_toolset` 和 `default_config` 來延遲加載 MCP 工具：

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
  --header "x-api-key: $ANTHROPIC_API_KEY" \
  --header "anthropic-version: 2023-06-01" \
  --header "anthropic-beta: advanced-tool-use-2025-11-20,mcp-client-2025-11-20" \
  --header "content-type: application/json" \
  --data '{
    "model": "claude-sonnet-4-5-20250929",
    "max_tokens": 2048,
    "mcp_servers": [
      {
        "type": "url",
        "name": "database-server",
        "url": "https://mcp-db.example.com"
      }
    ],
    "tools": [
      {
        "type": "tool_search_tool_regex_20251119",
        "name": "tool_search_tool_regex"
      },
      {
        "type": "mcp_toolset",
        "mcp_server_name": "database-server",
        "default_config": {
          "defer_loading": true
        },
        "configs": {
          "search_events": {
            "defer_loading": false
          }
        }
      }
    ],
    "messages": [
      {
        "role": "user",
        "content": "What events are in my database?"
      }
    ]
  }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    betas=["advanced-tool-use-2025-11-20", "mcp-client-2025-11-20"],
    max_tokens=2048,
    mcp_servers=[
        {
            "type": "url",
            "name": "database-server",
            "url": "https://mcp-db.example.com"
        }
    ],
    tools=[
        {
            "type": "tool_search_tool_regex_20251119",
            "name": "tool_search_tool_regex"
        },
        {
            "type": "mcp_toolset",
            "mcp_server_name": "database-server",
            "default_config": {
                "defer_loading": True
            },
            "configs": {
                "search_events": {
                    "defer_loading": False
                }
            }
        }
    ],
    messages=[
        {
            "role": "user",
            "content": "What events are in my database?"
        }
    ]
)

print(response)
```

```typescript TypeScript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

async function main() {
  const response = await client.beta.messages.create({
    model: "claude-sonnet-4-5-20250929",
    betas: ["advanced-tool-use-2025-11-20", "mcp-client-2025-11-20"],
    max_tokens: 2048,
    mcp_servers: [
      {
        type: "url",
        name: "database-server",
        url: "https://mcp-db.example.com",
      },
    ],
    tools: [
      {
        type: "tool_search_tool_regex_20251119",
        name: "tool_search_tool_regex",
      },
      {
        type: "mcp_toolset",
        mcp_server_name: "database-server",
        default_config: {
          defer_loading: true,
        },
        configs: {
          search_events: {
            defer_loading: false,
          },
        },
      },
    ],
    messages: [
      {
        role: "user",
        content: "What events are in my database?",
      },
    ],
  });

  console.log(JSON.stringify(response, null, 2));
}

main();
```

</CodeGroup>

**MCP 配置選項：**

- `default_config.defer_loading`：為來自 MCP 伺服器的所有工具設置預設值
- `configs`：按名稱覆蓋特定工具的預設值
- 將多個 MCP 伺服器與工具搜尋結合以獲得大規模工具庫

## 自訂工具搜尋實現

您可以通過從自訂工具返回 `tool_reference` 塊來實現您自己的工具搜尋邏輯（例如，使用嵌入或語義搜尋）：

```json JSON
{
  "type": "tool_search_tool_result",
  "tool_use_id": "toolu_custom_search",
  "content": {
    "type": "tool_search_tool_search_result",
    "tool_references": [{ "type": "tool_reference", "tool_name": "discovered_tool_name" }]
  }
}
```

每個引用的工具必須在頂級 `tools` 參數中有相應的工具定義，並設置 `defer_loading: true`。這種方法讓您可以使用更複雜的搜尋算法，同時保持與工具搜尋系統的相容性。

有關使用嵌入的完整示例，請參閱我們的[帶有嵌入的工具搜尋食譜](https://github.com/anthropics/anthropic-cookbook)。

## 錯誤處理

<Note>
  工具搜尋工具與[工具使用示例](/docs/zh-TW/agents-and-tools/tool-use/implement-tool-use#providing-tool-use-examples)不相容。
  如果您需要提供工具使用示例，請使用不帶工具搜尋的標準工具調用。
</Note>

### HTTP 錯誤（400 狀態）

這些錯誤會阻止請求被處理：

**所有工具都延遲：**

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "All tools have defer_loading set. At least one tool must be non-deferred."
  }
}
```

**缺少工具定義：**

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "Tool reference 'unknown_tool' has no corresponding tool definition"
  }
}
```

### 工具結果錯誤（200 狀態）

工具執行期間的錯誤返回 200 回應，錯誤信息在正文中：

```json JSON
{
  "type": "tool_result",
  "tool_use_id": "srvtoolu_01ABC123",
  "content": {
    "type": "tool_search_tool_result_error",
    "error_code": "invalid_pattern"
  }
}
```

**錯誤代碼：**

- `too_many_requests`：超過工具搜尋操作的速率限制
- `invalid_pattern`：格式不正確的正則表達式模式
- `pattern_too_long`：模式超過 200 字符限制
- `unavailable`：工具搜尋服務暫時不可用

### 常見錯誤

<section title="400 錯誤：所有工具都延遲">

**原因**：您在所有工具上設置了 `defer_loading: true`，包括搜尋工具

**修復**：從工具搜尋工具中移除 `defer_loading`：

```json
{
  "type": "tool_search_tool_regex_20251119", // 此處沒有 defer_loading
  "name": "tool_search_tool_regex"
}
```

</section>

<section title="400 錯誤：缺少工具定義">

**原因**：`tool_reference` 指向不在您的 `tools` 陣列中的工具

**修復**：確保每個可能被發現的工具都有完整的定義：

```json
{
  "name": "my_tool",
  "description": "Full description here",
  "input_schema": {
    /* complete schema */
  },
  "defer_loading": true
}
```

</section>

<section title="Claude 找不到預期的工具">

**原因**：工具名稱或描述與正則表達式模式不匹配

**調試步驟：**

1. 檢查工具名稱和描述—Claude 搜尋兩個欄位
2. 測試您的模式：`import re; re.search(r"your_pattern", "tool_name")`
3. 記住搜尋預設區分大小寫（使用 `(?i)` 進行不區分大小寫）
4. Claude 使用寬泛的模式，如 `".*weather.*"` 而不是精確匹配

**提示**：將常見關鍵字添加到工具描述中以改進可發現性

</section>

## 提示快取

工具搜尋與[提示快取](/docs/zh-TW/build-with-claude/prompt-caching)配合使用。添加 `cache_control` 斷點以優化多輪對話：

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# 帶有工具搜尋的第一個請求
messages = [
    {
        "role": "user",
        "content": "What's the weather in Seattle?"
    }
]

response1 = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=2048,
    messages=messages,
    tools=[
        {
            "type": "tool_search_tool_regex_20251119",
            "name": "tool_search_tool_regex"
        },
        {
            "name": "get_weather",
            "description": "Get weather for a location",
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {"type": "string"}
                },
                "required": ["location"]
            },
            "defer_loading": True
        }
    ]
)

# 將 Claude 的回應添加到對話中
messages.append({
    "role": "assistant",
    "content": response1.content
})

# 帶有快取斷點的第二個請求
messages.append({
    "role": "user",
    "content": "What about New York?",
    "cache_control": {"type": "ephemeral"}
})

response2 = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=2048,
    messages=messages,
    tools=[
        {
            "type": "tool_search_tool_regex_20251119",
            "name": "tool_search_tool_regex"
        },
        {
            "name": "get_weather",
            "description": "Get weather for a location",
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {"type": "string"}
                },
                "required": ["location"]
            },
            "defer_loading": True
        }
    ]
)

print(f"Cache read tokens: {response2.usage.get('cache_read_input_tokens', 0)}")
```
</CodeGroup>

系統會自動擴展整個對話歷史記錄中的 tool_reference 塊，因此 Claude 可以在後續輪次中重複使用發現的工具，而無需重新搜尋。

## 串流

啟用串流後，您將收到工具搜尋事件作為串流的一部分：

```javascript
event: content_block_start
data: {"type": "content_block_start", "index": 1, "content_block": {"type": "server_tool_use", "id": "srvtoolu_xyz789", "name": "tool_search_tool_regex"}}

// 搜尋查詢已串流
event: content_block_delta
data: {"type": "content_block_delta", "index": 1, "delta": {"type": "input_json_delta", "partial_json": "{\"query\":\"weather\"}"}}

// 在搜尋執行時暫停

// 搜尋結果已串流
event: content_block_start
data: {"type": "content_block_start", "index": 2, "content_block": {"type": "tool_search_tool_result", "tool_use_id": "srvtoolu_xyz789", "content": {"type": "tool_search_tool_search_result", "tool_references": [{"type": "tool_reference", "tool_name": "get_weather"}]}}}

// Claude 繼續使用發現的工具
```

## 批次請求

您可以在[訊息批次 API](/docs/zh-TW/build-with-claude/batch-processing) 中包含工具搜尋工具。通過訊息批次 API 進行的工具搜尋操作的定價與常規訊息 API 請求中的定價相同。

## 限制和最佳實踐

### 限制

- **最大工具數**：您的目錄中最多 10,000 個工具
- **搜尋結果**：每次搜尋返回 3-5 個最相關的工具
- **模式長度**：正則表達式模式的最大 200 個字符
- **模型支援**：僅 Sonnet 4.0+、Opus 4.0+（不支援 Haiku）

### 何時使用工具搜尋

**良好的使用案例：**

- 您的系統中有 10+ 個工具可用
- 工具定義消耗 >10K 個令牌
- 在大型工具集中遇到工具選擇準確性問題
- 構建具有多個伺服器的 MCP 驅動系統（200+ 個工具）
- 工具庫隨時間增長

**傳統工具調用可能更好的情況：**

- 總共少於 10 個工具
- 所有工具在每個請求中都經常使用
- 非常小的工具定義（\<100 個令牌總計）

### 優化提示

- 將最常用的 3-5 個工具保持為非延遲
- 編寫清晰、描述性的工具名稱和描述
- 在描述中使用與用戶描述任務方式相匹配的語義關鍵字
- 添加系統提示部分，描述可用的工具類別：「您可以搜尋工具來與 Slack、GitHub 和 Jira 互動」
- 監控 Claude 發現的工具以改進描述

## 使用情況

工具搜尋工具的使用情況在回應使用對象中進行追蹤：

```json JSON
{
  "usage": {
    "input_tokens": 1024,
    "output_tokens": 256,
    "server_tool_use": {
      "tool_search_requests": 2
    }
  }
}
```