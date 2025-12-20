# 程式化工具呼叫

允許 Claude 在程式碼執行容器中以程式化方式呼叫工具，減少延遲並降低代幣消耗

---

程式化工具呼叫允許 Claude 在[程式碼執行](/docs/zh-TW/agents-and-tools/tool-use/code-execution-tool)容器中編寫程式碼以程式化方式呼叫您的工具，而不是為每個工具呼叫都需要透過模型進行往返。這減少了多工具工作流程的延遲，並透過允許 Claude 在資料到達模型的上下文視窗之前進行篩選或處理資料，降低了代幣消耗。

<Note>
程式化工具呼叫目前處於公開測試版。

若要使用此功能，請將 `"advanced-tool-use-2025-11-20"` [測試版標頭](/docs/zh-TW/api/beta-headers)新增至您的 API 請求。

此功能需要啟用程式碼執行工具。
</Note>

## 模型相容性

程式化工具呼叫適用於以下模型：

| 模型 | 工具版本 |
|-------|--------------|
| Claude Opus 4.5 (`claude-opus-4-5-20251101`) | `code_execution_20250825` |
| Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`) | `code_execution_20250825` |

<Warning>
程式化工具呼叫可透過 Claude API 和 Microsoft Foundry 使用。
</Warning>

## 快速開始

以下是一個簡單的範例，其中 Claude 以程式化方式多次查詢資料庫並彙總結果：

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: advanced-tool-use-2025-11-20" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": "Query sales data for the West, East, and Central regions, then tell me which region had the highest revenue"
            }
        ],
        "tools": [
            {
                "type": "code_execution_20250825",
                "name": "code_execution"
            },
            {
                "name": "query_database",
                "description": "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "sql": {
                            "type": "string",
                            "description": "SQL query to execute"
                        }
                    },
                    "required": ["sql"]
                },
                "allowed_callers": ["code_execution_20250825"]
            }
        ]
    }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Query sales data for the West, East, and Central regions, then tell me which region had the highest revenue"
    }],
    tools=[
        {
            "type": "code_execution_20250825",
            "name": "code_execution"
        },
        {
            "name": "query_database",
            "description": "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
            "input_schema": {
                "type": "object",
                "properties": {
                    "sql": {
                        "type": "string",
                        "description": "SQL query to execute"
                    }
                },
                "required": ["sql"]
            },
            "allowed_callers": ["code_execution_20250825"]
        }
    ]
)

print(response)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

async function main() {
  const response = await anthropic.beta.messages.create({
    model: "claude-sonnet-4-5",
    betas: ["advanced-tool-use-2025-11-20"],
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: "Query sales data for the West, East, and Central regions, then tell me which region had the highest revenue"
      }
    ],
    tools: [
      {
        type: "code_execution_20250825",
        name: "code_execution"
      },
      {
        name: "query_database",
        description: "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
        input_schema: {
          type: "object",
          properties: {
            sql: {
              type: "string",
              description: "SQL query to execute"
            }
          },
          required: ["sql"]
        },
        allowed_callers: ["code_execution_20250825"]
      }
    ]
  });

  console.log(response);
}

main().catch(console.error);
```
</CodeGroup>

## 程式化工具呼叫如何運作

當您設定工具可從程式碼執行呼叫，且 Claude 決定使用該工具時：

1. Claude 編寫 Python 程式碼來呼叫工具作為函數，可能包括多個工具呼叫和前置/後置處理邏輯
2. Claude 透過程式碼執行在沙箱容器中執行此程式碼
3. 當呼叫工具函數時，程式碼執行暫停，API 傳回 `tool_use` 區塊
4. 您提供工具結果，程式碼執行繼續（中間結果不會載入到 Claude 的上下文視窗中）
5. 一旦所有程式碼執行完成，Claude 接收最終輸出並繼續執行任務

此方法特別適用於：
- **大型資料處理**：在資料到達 Claude 的上下文之前篩選或彙總工具結果
- **多步驟工作流程**：透過在工具呼叫之間不進行 Claude 取樣而序列或迴圈呼叫工具，節省代幣和延遲
- **條件邏輯**：根據中間工具結果做出決策

<Note>
自訂工具被轉換為非同步 Python 函數以支援平行工具呼叫。當 Claude 編寫呼叫您的工具的程式碼時，它使用 `await`（例如，`result = await query_database("<sql>")`）並自動包含適當的非同步包裝函數。

為了清楚起見，本文件中的程式碼範例省略了非同步包裝。
</Note>

## 核心概念

### `allowed_callers` 欄位

`allowed_callers` 欄位指定哪些上下文可以呼叫工具：

```json
{
  "name": "query_database",
  "description": "Execute a SQL query against the database",
  "input_schema": {...},
  "allowed_callers": ["code_execution_20250825"]
}
```

**可能的值：**
- `["direct"]` - 只有 Claude 可以直接呼叫此工具（如果省略則為預設值）
- `["code_execution_20250825"]` - 只能從程式碼執行內呼叫
- `["direct", "code_execution_20250825"]` - 可以直接呼叫和從程式碼執行呼叫

<Tip>
我們建議為每個工具選擇 `["direct"]` 或 `["code_execution_20250825"]`，而不是同時啟用兩者，因為這為 Claude 提供了更清晰的指導，說明如何最好地使用工具。
</Tip>

### 回應中的 `caller` 欄位

每個工具使用區塊都包含一個 `caller` 欄位，指示它是如何被呼叫的：

**直接呼叫（傳統工具使用）：**
```json
{
  "type": "tool_use",
  "id": "toolu_abc123",
  "name": "query_database",
  "input": {"sql": "<sql>"},
  "caller": {"type": "direct"}
}
```

**程式化呼叫：**
```json
{
  "type": "tool_use",
  "id": "toolu_xyz789",
  "name": "query_database",
  "input": {"sql": "<sql>"},
  "caller": {
    "type": "code_execution_20250825",
    "tool_id": "srvtoolu_abc123"
  }
}
```

`tool_id` 參考進行程式化呼叫的程式碼執行工具。

### 容器生命週期

程式化工具呼叫使用與程式碼執行相同的容器：

- **容器建立**：除非您重複使用現有容器，否則為每個工作階段建立新容器
- **過期**：容器在約 4.5 分鐘的不活動後過期（可能會變更）
- **容器 ID**：透過 `container` 欄位在回應中傳回
- **重複使用**：傳遞容器 ID 以在請求之間維持狀態

<Warning>
當工具以程式化方式呼叫且容器正在等待您的工具結果時，您必須在容器過期之前回應。監視 `expires_at` 欄位。如果容器過期，Claude 可能會將工具呼叫視為逾時並重試。
</Warning>

## 範例工作流程

以下是完整的程式化工具呼叫流程的運作方式：

### 步驟 1：初始請求

傳送包含程式碼執行和允許程式化呼叫的工具的請求。若要啟用程式化呼叫，請將 `allowed_callers` 欄位新增至您的工具定義。

<Note>
在工具描述中提供工具輸出格式的詳細描述。如果您指定工具傳回 JSON，Claude 將嘗試在程式碼中反序列化和處理結果。您提供的關於輸出架構的詳細資訊越多，Claude 就能更好地以程式化方式處理回應。
</Note>

<CodeGroup>
```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Query customer purchase history from the last quarter and identify our top 5 customers by revenue"
    }],
    tools=[
        {
            "type": "code_execution_20250825",
            "name": "code_execution"
        },
        {
            "name": "query_database",
            "description": "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
            "input_schema": {...},
            "allowed_callers": ["code_execution_20250825"]
        }
    ]
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  betas: ["advanced-tool-use-2025-11-20"],
  max_tokens: 4096,
  messages: [{
    role: "user",
    content: "Query customer purchase history from the last quarter and identify our top 5 customers by revenue"
  }],
  tools: [
    {
      type: "code_execution_20250825",
      name: "code_execution"
    },
    {
      name: "query_database",
      description: "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
      input_schema: {...},
      allowed_callers: ["code_execution_20250825"]
    }
  ]
});
```
</CodeGroup>

### 步驟 2：API 回應與工具呼叫

Claude 編寫呼叫您的工具的程式碼。API 暫停並傳回：

```json
{
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "I'll query the purchase history and analyze the results."
    },
    {
      "type": "server_tool_use",
      "id": "srvtoolu_abc123",
      "name": "code_execution",
      "input": {
        "code": "results = await query_database('<sql>')\ntop_customers = sorted(results, key=lambda x: x['revenue'], reverse=True)[:5]\nprint(f'Top 5 customers: {top_customers}')"
      }
    },
    {
      "type": "tool_use",
      "id": "toolu_def456",
      "name": "query_database",
      "input": {"sql": "<sql>"},
      "caller": {
        "type": "code_execution_20250825",
        "tool_id": "srvtoolu_abc123"
      }
    }
  ],
  "container": {
    "id": "container_xyz789",
    "expires_at": "2025-01-15T14:30:00Z"
  },
  "stop_reason": "tool_use"
}
```

### 步驟 3：提供工具結果

包含完整的對話歷史記錄加上您的工具結果：

<CodeGroup>
```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=4096,
    container="container_xyz789",  # Reuse the container
    messages=[
        {"role": "user", "content": "Query customer purchase history from the last quarter and identify our top 5 customers by revenue"},
        {
            "role": "assistant",
            "content": [
                {"type": "text", "text": "I'll query the purchase history and analyze the results."},
                {
                    "type": "server_tool_use",
                    "id": "srvtoolu_abc123",
                    "name": "code_execution",
                    "input": {"code": "..."}
                },
                {
                    "type": "tool_use",
                    "id": "toolu_def456",
                    "name": "query_database",
                    "input": {"sql": "<sql>"},
                    "caller": {
                        "type": "code_execution_20250825",
                        "tool_id": "srvtoolu_abc123"
                    }
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "tool_result",
                    "tool_use_id": "toolu_def456",
                    "content": "[{\"customer_id\": \"C1\", \"revenue\": 45000}, {\"customer_id\": \"C2\", \"revenue\": 38000}, ...]"
                }
            ]
        }
    ],
    tools=[...]
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  betas: ["advanced-tool-use-2025-11-20"],
  max_tokens: 4096,
  container: "container_xyz789",  // Reuse the container
  messages: [
    { role: "user", content: "Query customer purchase history from the last quarter and identify our top 5 customers by revenue" },
    {
      role: "assistant",
      content: [
        { type: "text", text: "I'll query the purchase history and analyze the results." },
        {
          type: "server_tool_use",
          id: "srvtoolu_abc123",
          name: "code_execution",
          input: { code: "..." }
        },
        {
          type: "tool_use",
          id: "toolu_def456",
          name: "query_database",
          input: { sql: "<sql>" },
          caller: {
            type: "code_execution_20250825",
            tool_id: "srvtoolu_abc123"
          }
        }
      ]
    },
    {
      role: "user",
      content: [
        {
          type: "tool_result",
          tool_use_id: "toolu_def456",
          content: "[{\"customer_id\": \"C1\", \"revenue\": 45000}, {\"customer_id\": \"C2\", \"revenue\": 38000}, ...]"
        }
      ]
    }
  ],
  tools: [...]
});
```
</CodeGroup>

### 步驟 4：下一個工具呼叫或完成

程式碼執行繼續並處理結果。如果需要額外的工具呼叫，重複步驟 3，直到所有工具呼叫都得到滿足。

### 步驟 5：最終回應

一旦程式碼執行完成，Claude 提供最終回應：

```json
{
  "content": [
    {
      "type": "code_execution_tool_result",
      "tool_use_id": "srvtoolu_abc123",
      "content": {
        "type": "code_execution_result",
        "stdout": "Top 5 customers by revenue:\n1. Customer C1: $45,000\n2. Customer C2: $38,000\n3. Customer C5: $32,000\n4. Customer C8: $28,500\n5. Customer C3: $24,000",
        "stderr": "",
        "return_code": 0,
        "content": []
      }
    },
    {
      "type": "text",
      "text": "I've analyzed the purchase history from last quarter. Your top 5 customers generated $167,500 in total revenue, with Customer C1 leading at $45,000."
    }
  ],
  "stop_reason": "end_turn"
}
```

## 進階模式

### 使用迴圈進行批次處理

Claude 可以編寫程式碼來有效地處理多個項目：

```python
# async wrapper omitted for clarity
regions = ["West", "East", "Central", "North", "South"]
results = {}
for region in regions:
    data = await query_database(f"<sql for {region}>")
    results[region] = sum(row["revenue"] for row in data)

# Process results programmatically
top_region = max(results.items(), key=lambda x: x[1])
print(f"Top region: {top_region[0]} with ${top_region[1]:,} in revenue")
```

此模式：
- 將模型往返次數從 N（每個區域一次）減少到 1
- 在返回 Claude 之前以程式化方式處理大型結果集
- 透過只傳回彙總結論而不是原始資料來節省代幣

### 提前終止

Claude 可以在滿足成功條件後立即停止處理：

```python
# async wrapper omitted for clarity
endpoints = ["us-east", "eu-west", "apac"]
for endpoint in endpoints:
    status = await check_health(endpoint)
    if status == "healthy":
        print(f"Found healthy endpoint: {endpoint}")
        break  # Stop early, don't check remaining
```

### 條件工具選擇

```python
# async wrapper omitted for clarity
file_info = await get_file_info(path)
if file_info["size"] < 10000:
    content = await read_full_file(path)
else:
    content = await read_file_summary(path)
print(content)
```

### 資料篩選

```python
# async wrapper omitted for clarity
logs = await fetch_logs(server_id)
errors = [log for log in logs if "ERROR" in log]
print(f"Found {len(errors)} errors")
for error in errors[-10:]:  # Only return last 10 errors
    print(error)
```

## 回應格式

### 程式化工具呼叫

當程式碼執行呼叫工具時：

```json
{
  "type": "tool_use",
  "id": "toolu_abc123",
  "name": "query_database",
  "input": {"sql": "<sql>"},
  "caller": {
    "type": "code_execution_20250825",
    "tool_id": "srvtoolu_xyz789"
  }
}
```

### 工具結果處理

您的工具結果被傳回到執行中的程式碼：

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_abc123",
      "content": "[{\"customer_id\": \"C1\", \"revenue\": 45000, \"orders\": 23}, {\"customer_id\": \"C2\", \"revenue\": 38000, \"orders\": 18}, ...]"
    }
  ]
}
```

### 程式碼執行完成

當所有工具呼叫都得到滿足且程式碼完成時：

```json
{
  "type": "code_execution_tool_result",
  "tool_use_id": "srvtoolu_xyz789",
  "content": {
    "type": "code_execution_result",
    "stdout": "Analysis complete. Top 5 customers identified from 847 total records.",
    "stderr": "",
    "return_code": 0,
    "content": []
  }
}
```

## 錯誤處理

### 常見錯誤

| 錯誤 | 描述 | 解決方案 |
|-------|-------------|----------|
| `invalid_tool_input` | 工具輸入與架構不符 | 驗證您的工具的 input_schema |
| `tool_not_allowed` | 工具不允許請求的呼叫者類型 | 檢查 `allowed_callers` 是否包含正確的上下文 |
| `missing_beta_header` | 未提供 PTC 測試版標頭 | 將兩個測試版標頭新增至您的請求 |

### 工具呼叫期間的容器過期

如果您的工具花費太長時間回應，程式碼執行將收到 `TimeoutError`。Claude 在 stderr 中看到這個錯誤，通常會重試：

```json
{
  "type": "code_execution_tool_result",
  "tool_use_id": "srvtoolu_abc123",
  "content": {
    "type": "code_execution_result",
    "stdout": "",
    "stderr": "TimeoutError: Calling tool ['query_database'] timed out.",
    "return_code": 0,
    "content": []
  }
}
```

為了防止逾時：
- 監視回應中的 `expires_at` 欄位
- 為您的工具執行實施逾時
- 考慮將長操作分解為較小的塊

### 工具執行錯誤

如果您的工具傳回錯誤：

```python
# Provide error information in the tool result
{
    "type": "tool_result",
    "tool_use_id": "toolu_abc123",
    "content": "Error: Query timeout - table lock exceeded 30 seconds"
}
```

Claude 的程式碼將收到此錯誤並可以適當地處理它。

## 約束和限制

### 功能不相容性

- **結構化輸出**：具有 `strict: true` 的工具不支援程式化呼叫
- **工具選擇**：您無法透過 `tool_choice` 強制進行特定工具的程式化呼叫
- **平行工具使用**：`disable_parallel_tool_use: true` 不支援程式化呼叫

### 工具限制

以下工具目前無法以程式化方式呼叫，但未來版本可能會新增支援：

- 網路搜尋
- 網路擷取
- 由 [MCP 連接器](/docs/zh-TW/agents-and-tools/mcp-connector)提供的工具

### 訊息格式限制

在回應程式化工具呼叫時，有嚴格的格式要求：

**僅工具結果回應**：如果有待處理的程式化工具呼叫等待結果，您的回應訊息必須**僅**包含 `tool_result` 區塊。您不能包含任何文字內容，即使在工具結果之後也不行。

```json
// ❌ 無效 - 回應程式化工具呼叫時無法包含文字
{
  "role": "user",
  "content": [
    {"type": "tool_result", "tool_use_id": "toolu_01", "content": "[{\"customer_id\": \"C1\", \"revenue\": 45000}]"},
    {"type": "text", "text": "What should I do next?"}  // This will cause an error
  ]
}

// ✅ 有效 - 回應程式化工具呼叫時僅工具結果
{
  "role": "user",
  "content": [
    {"type": "tool_result", "tool_use_id": "toolu_01", "content": "[{\"customer_id\": \"C1\", \"revenue\": 45000}]"}
  ]
}
```

此限制僅適用於回應程式化（程式碼執行）工具呼叫。對於常規用戶端工具呼叫，您可以在工具結果之後包含文字內容。

### 速率限制

程式化工具呼叫受到與常規工具呼叫相同的速率限制。來自程式碼執行的每個工具呼叫都計為單獨的呼叫。

### 在使用前驗證工具結果

實施將以程式化方式呼叫的自訂工具時：

- **工具結果作為字串傳回**：它們可以包含任何內容，包括程式碼片段或可執行命令，這些可能由執行環境處理。
- **驗證外部工具結果**：如果您的工具傳回來自外部來源的資料或接受使用者輸入，請注意如果輸出將被解釋或執行為程式碼，可能存在程式碼注入風險。

## 代幣效率

程式化工具呼叫可以顯著降低代幣消耗：

- **來自程式化呼叫的工具結果不會新增到 Claude 的上下文中** - 只有最終程式碼輸出
- **中間處理在程式碼中進行** - 篩選、彙總等不消耗模型代幣
- **一個程式碼執行中的多個工具呼叫** - 與單獨的模型轉換相比減少開銷

例如，直接呼叫 10 個工具使用的代幣約為以程式化方式呼叫它們並傳回摘要的 10 倍。

## 使用和定價

程式化工具呼叫使用與程式碼執行相同的定價。有關詳細資訊，請參閱[程式碼執行定價](/docs/zh-TW/agents-and-tools/tool-use/code-execution-tool#usage-and-pricing)。

<Note>
程式化工具呼叫的代幣計數：來自程式化呼叫的工具結果不計入您的輸入/輸出代幣使用量。只有最終程式碼執行結果和 Claude 的回應計數。
</Note>

## 最佳實踐

### 工具設計

- **提供詳細的輸出描述**：由於 Claude 在程式碼中反序列化工具結果，請清楚地記錄格式（JSON 結構、欄位類型等）
- **傳回結構化資料**：JSON 或其他易於解析的格式最適合程式化處理
- **保持回應簡潔**：只傳回必要的資料以最小化處理開銷

### 何時使用程式化呼叫

**良好的使用案例：**
- 處理大型資料集，其中您只需要彙總或摘要
- 具有 3 個或更多相依工具呼叫的多步驟工作流程
- 需要篩選、排序或轉換工具結果的操作
- 中間資料不應影響 Claude 推理的任務
- 跨許多項目的平行操作（例如，檢查 50 個端點）

**不太理想的使用案例：**
- 具有簡單回應的單個工具呼叫
- 需要立即使用者回饋的工具
- 程式碼執行開銷會超過好處的非常快速的操作

### 效能最佳化

- **重複使用容器**，在進行多個相關請求時維持狀態
- **在單個程式碼執行中批次類似操作**，如果可能的話

## 疑難排解

### 常見問題

**「工具不允許」錯誤**
- 驗證您的工具定義包含 `"allowed_callers": ["code_execution_20250825"]`
- 檢查您是否使用正確的測試版標頭

**容器過期**
- 確保您在容器的生命週期內（約 4.5 分鐘）回應工具呼叫
- 監視回應中的 `expires_at` 欄位
- 考慮實施更快的工具執行

**測試版標頭問題**
- 您需要標頭：`"advanced-tool-use-2025-11-20"`

**工具結果未正確解析**
- 確保您的工具傳回 Claude 可以反序列化的字串資料
- 在您的工具描述中提供清晰的輸出格式文件

### 除錯提示

1. **記錄所有工具呼叫和結果**以追蹤流程
2. **檢查 `caller` 欄位**以確認程式化呼叫
3. **監視容器 ID** 以確保正確重複使用
4. **獨立測試工具**，然後啟用程式化呼叫

## 為什麼程式化工具呼叫有效

Claude 的訓練包括對程式碼的廣泛接觸，使其在推理和鏈接函數呼叫方面有效。當工具在程式碼執行環境中呈現為可呼叫函數時，Claude 可以利用這一優勢來：

- **自然地推理工具組合**：鏈接操作並像編寫任何 Python 程式碼一樣自然地處理依賴關係
- **有效地處理大型結果**：篩選大型工具輸出、僅提取相關資料或將中間結果寫入檔案，然後再將摘要傳回上下文視窗
- **顯著降低延遲**：消除在多步驟工作流程中每個工具呼叫之間重新取樣 Claude 的開銷

此方法啟用了傳統工具使用不切實際的工作流程，例如處理超過 1M 代幣的檔案，透過允許 Claude 以程式化方式處理資料，而不是將所有內容載入到對話上下文中。

## 替代實現

程式化工具呼叫是一個可以在 Anthropic 的託管程式碼執行之外實現的可概括模式。以下是方法的概述：

### 用戶端直接執行

為 Claude 提供程式碼執行工具，並描述該環境中可用的函數。當 Claude 使用程式碼呼叫工具時，您的應用程式在定義這些函數的本地執行它。

**優點：**
- 簡單實現，最少重新架構
- 完全控制環境和指令

**缺點：**
- 在沙箱外執行不受信任的程式碼
- 工具呼叫可能是程式碼注入的向量

**使用時機**：您的應用程式可以安全地執行任意程式碼、您想要簡單的解決方案，以及 Anthropic 的託管產品不符合您的需求。

### 自我管理的沙箱執行

從 Claude 的角度來看相同的方法，但程式碼在具有安全限制的沙箱容器中執行（例如，無網路出口）。如果您的工具需要外部資源，您將需要一個協議來在沙箱外執行工具呼叫。

**優點：**
- 在您自己的基礎設施上進行安全的程式化工具呼叫
- 完全控制執行環境

**缺點：**
- 複雜的構建和維護
- 需要管理基礎設施和進程間通訊

**使用時機**：安全至關重要，Anthropic 的託管解決方案不符合您的要求。

### Anthropic 託管執行

Anthropic 的程式化工具呼叫是沙箱執行的託管版本，具有針對 Claude 調整的自以為是的 Python 環境。Anthropic 處理容器管理、程式碼執行和安全工具呼叫通訊。

**優點：**
- 預設情況下安全且安全
- 最少配置即可輕鬆啟用
- 針對 Claude 最佳化的環境和指令

如果您使用 Claude API，我們建議使用 Anthropic 的託管解決方案。

## 相關功能

<CardGroup cols={2}>
  <Card title="程式碼執行工具" icon="code" href="/docs/zh-TW/agents-and-tools/tool-use/code-execution-tool">
    了解支援程式化工具呼叫的基礎程式碼執行功能。
  </Card>
  <Card title="工具使用概述" icon="wrench" href="/docs/zh-TW/agents-and-tools/tool-use/overview">
    了解使用 Claude 進行工具使用的基礎知識。
  </Card>
  <Card title="實施工具使用" icon="hammer" href="/docs/zh-TW/agents-and-tools/tool-use/implement-tool-use">
    實施工具的逐步指南。
  </Card>
</CardGroup>