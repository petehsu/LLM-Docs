# 搜尋結果

透過提供具有來源歸屬的搜尋結果，為 RAG 應用程式啟用自然引用

---

搜尋結果內容區塊可啟用具有適當來源歸屬的自然引用，為您的自訂應用程式帶來網路搜尋品質的引用。此功能對於 RAG（檢索增強生成）應用程式特別強大，您需要 Claude 準確引用來源。

搜尋結果功能在以下模型上可用：

- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)
- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Sonnet 3.7 ([已棄用](/docs/zh-TW/about-claude/model-deprecations)) (`claude-3-7-sonnet-20250219`)
- Claude 3.5 Haiku (`claude-3-5-haiku-20241022`)

## 主要優勢

- **自然引用** - 為任何內容實現與網路搜尋相同的引用品質
- **靈活整合** - 在工具返回中用於動態 RAG，或作為頂層內容用於預先取得的資料
- **適當的來源歸屬** - 每個結果都包含來源和標題資訊，以便清楚歸屬
- **無需文件解決方案** - 消除了基於文件的解決方案的需要
- **一致的引用格式** - 符合 Claude 網路搜尋功能的引用品質和格式

## 運作方式

搜尋結果可以透過兩種方式提供：

1. **來自工具呼叫** - 您的自訂工具返回搜尋結果，啟用動態 RAG 應用程式
2. **作為頂層內容** - 您直接在使用者訊息中提供搜尋結果，用於預先取得或快取的內容

在兩種情況下，Claude 都可以自動引用搜尋結果中的資訊，並提供適當的來源歸屬。

### 搜尋結果架構

搜尋結果使用以下結構：

```json
{
  "type": "search_result",
  "source": "https://example.com/article",  // 必需：來源 URL 或識別碼
  "title": "Article Title",                  // 必需：結果的標題
  "content": [                               // 必需：文字區塊陣列
    {
      "type": "text",
      "text": "The actual content of the search result..."
    }
  ],
  "citations": {                             // 選用：引用配置
    "enabled": true                          // 啟用/停用此結果的引用
  }
}
```

### 必需欄位

| 欄位 | 類型 | 說明 |
|-------|------|-------------|
| `type` | string | 必須為 `"search_result"` |
| `source` | string | 內容的來源 URL 或識別碼 |
| `title` | string | 搜尋結果的描述性標題 |
| `content` | array | 包含實際內容的文字區塊陣列 |

### 選用欄位

| 欄位 | 類型 | 說明 |
|-------|------|-------------|
| `citations` | object | 具有 `enabled` 布林欄位的引用配置 |
| `cache_control` | object | 快取控制設定（例如 `{"type": "ephemeral"}`) |

`content` 陣列中的每個項目必須是具有以下內容的文字區塊：
- `type`：必須為 `"text"`
- `text`：實際文字內容（非空字串）

## 方法 1：來自工具呼叫的搜尋結果

最強大的使用案例是從您的自訂工具返回搜尋結果。這啟用了動態 RAG 應用程式，其中工具取得並返回具有自動引用的相關內容。

### 範例：知識庫工具

<CodeGroup>
```python Python
from anthropic import Anthropic
from anthropic.types import (
    MessageParam,
    TextBlockParam,
    SearchResultBlockParam,
    ToolResultBlockParam
)

client = Anthropic()

# 定義知識庫搜尋工具
knowledge_base_tool = {
    "name": "search_knowledge_base",
    "description": "Search the company knowledge base for information",
    "input_schema": {
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "The search query"
            }
        },
        "required": ["query"]
    }
}

# 處理工具呼叫的函式
def search_knowledge_base(query):
    # 您的搜尋邏輯在此
    # 返回正確格式的搜尋結果
    return [
        SearchResultBlockParam(
            type="search_result",
            source="https://docs.company.com/product-guide",
            title="Product Configuration Guide",
            content=[
                TextBlockParam(
                    type="text",
                    text="To configure the product, navigate to Settings > Configuration. The default timeout is 30 seconds, but can be adjusted between 10-120 seconds based on your needs."
                )
            ],
            citations={"enabled": True}
        ),
        SearchResultBlockParam(
            type="search_result",
            source="https://docs.company.com/troubleshooting",
            title="Troubleshooting Guide",
            content=[
                TextBlockParam(
                    type="text",
                    text="If you encounter timeout errors, first check the configuration settings. Common causes include network latency and incorrect timeout values."
                )
            ],
            citations={"enabled": True}
        )
    ]

# 使用工具建立訊息
response = client.messages.create(
    model="claude-sonnet-4-5",  # 適用於所有支援的模型
    max_tokens=1024,
    tools=[knowledge_base_tool],
    messages=[
        MessageParam(
            role="user",
            content="How do I configure the timeout settings?"
        )
    ]
)

# 當 Claude 呼叫工具時，提供搜尋結果
if response.content[0].type == "tool_use":
    tool_result = search_knowledge_base(response.content[0].input["query"])
    
    # 將工具結果傳送回去
    final_response = client.messages.create(
        model="claude-sonnet-4-5",  # 適用於所有支援的模型
        max_tokens=1024,
        messages=[
            MessageParam(role="user", content="How do I configure the timeout settings?"),
            MessageParam(role="assistant", content=response.content),
            MessageParam(
                role="user",
                content=[
                    ToolResultBlockParam(
                        type="tool_result",
                        tool_use_id=response.content[0].id,
                        content=tool_result  # 搜尋結果在此
                    )
                ]
            )
        ]
    )
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

// 定義知識庫搜尋工具
const knowledgeBaseTool = {
  name: "search_knowledge_base",
  description: "Search the company knowledge base for information",
  input_schema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "The search query"
      }
    },
    required: ["query"]
  }
};

// 處理工具呼叫的函式
function searchKnowledgeBase(query: string) {
  // 您的搜尋邏輯在此
  // 返回正確格式的搜尋結果
  return [
    {
      type: "search_result" as const,
      source: "https://docs.company.com/product-guide",
      title: "Product Configuration Guide",
      content: [
        {
          type: "text" as const,
          text: "To configure the product, navigate to Settings > Configuration. The default timeout is 30 seconds, but can be adjusted between 10-120 seconds based on your needs."
        }
      ],
      citations: { enabled: true }
    },
    {
      type: "search_result" as const,
      source: "https://docs.company.com/troubleshooting",
      title: "Troubleshooting Guide",
      content: [
        {
          type: "text" as const,
          text: "If you encounter timeout errors, first check the configuration settings. Common causes include network latency and incorrect timeout values."
        }
      ],
      citations: { enabled: true }
    }
  ];
}

// 使用工具建立訊息
const response = await anthropic.messages.create({
  model: "claude-sonnet-4-5", // 適用於所有支援的模型
  max_tokens: 1024,
  tools: [knowledgeBaseTool],
  messages: [
    {
      role: "user",
      content: "How do I configure the timeout settings?"
    }
  ]
});

// 處理工具使用並提供結果
if (response.content[0].type === "tool_use") {
  const toolResult = searchKnowledgeBase(response.content[0].input.query);
  
  const finalResponse = await anthropic.messages.create({
    model: "claude-sonnet-4-5", // 適用於所有支援的模型
    max_tokens: 1024,
      messages: [
      { role: "user", content: "How do I configure the timeout settings?" },
      { role: "assistant", content: response.content },
      {
        role: "user",
        content: [
          {
            type: "tool_result" as const,
            tool_use_id: response.content[0].id,
            content: toolResult  // 搜尋結果在此
          }
        ]
      }
    ]
  });
}
```
</CodeGroup>

## 方法 2：搜尋結果作為頂層內容

您也可以直接在使用者訊息中提供搜尋結果。這對以下情況很有用：
- 來自您搜尋基礎設施的預先取得內容
- 來自先前查詢的快取搜尋結果
- 來自外部搜尋服務的內容
- 測試和開發

### 範例：直接搜尋結果

<CodeGroup>
```python Python
from anthropic import Anthropic
from anthropic.types import (
    MessageParam,
    TextBlockParam,
    SearchResultBlockParam
)

client = Anthropic()

# 直接在使用者訊息中提供搜尋結果
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        MessageParam(
            role="user",
            content=[
                SearchResultBlockParam(
                    type="search_result",
                    source="https://docs.company.com/api-reference",
                    title="API Reference - Authentication",
                    content=[
                        TextBlockParam(
                            type="text",
                            text="All API requests must include an API key in the Authorization header. Keys can be generated from the dashboard. Rate limits: 1000 requests per hour for standard tier, 10000 for premium."
                        )
                    ],
                    citations={"enabled": True}
                ),
                SearchResultBlockParam(
                    type="search_result",
                    source="https://docs.company.com/quickstart",
                    title="Getting Started Guide",
                    content=[
                        TextBlockParam(
                            type="text",
                            text="To get started: 1) Sign up for an account, 2) Generate an API key from the dashboard, 3) Install our SDK using pip install company-sdk, 4) Initialize the client with your API key."
                        )
                    ],
                    citations={"enabled": True}
                ),
                TextBlockParam(
                    type="text",
                    text="Based on these search results, how do I authenticate API requests and what are the rate limits?"
                )
            ]
        )
    ]
)

print(response.model_dump_json(indent=2))
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

// 直接在使用者訊息中提供搜尋結果
const response = await anthropic.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: [
        {
          type: "search_result" as const,
          source: "https://docs.company.com/api-reference",
          title: "API Reference - Authentication",
          content: [
            {
              type: "text" as const,
              text: "All API requests must include an API key in the Authorization header. Keys can be generated from the dashboard. Rate limits: 1000 requests per hour for standard tier, 10000 for premium."
            }
          ],
          citations: { enabled: true }
        },
        {
          type: "search_result" as const,
          source: "https://docs.company.com/quickstart",
          title: "Getting Started Guide",
          content: [
            {
              type: "text" as const,
              text: "To get started: 1) Sign up for an account, 2) Generate an API key from the dashboard, 3) Install our SDK using pip install company-sdk, 4) Initialize the client with your API key."
            }
          ],
          citations: { enabled: true }
        },
        {
          type: "text" as const,
          text: "Based on these search results, how do I authenticate API requests and what are the rate limits?"
        }
      ]
    }
  ]
});

console.log(response);
```

```bash Shell
#!/bin/sh
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "search_result",
                    "source": "https://docs.company.com/api-reference",
                    "title": "API Reference - Authentication",
                    "content": [
                        {
                            "type": "text",
                            "text": "All API requests must include an API key in the Authorization header. Keys can be generated from the dashboard. Rate limits: 1000 requests per hour for standard tier, 10000 for premium."
                        }
                    ],
                    "citations": {
                        "enabled": true
                    }
                },
                {
                    "type": "search_result",
                    "source": "https://docs.company.com/quickstart",
                    "title": "Getting Started Guide",
                    "content": [
                        {
                            "type": "text",
                            "text": "To get started: 1) Sign up for an account, 2) Generate an API key from the dashboard, 3) Install our SDK using pip install company-sdk, 4) Initialize the client with your API key."
                        }
                    ],
                    "citations": {
                        "enabled": true
                    }
                },
                {
                    "type": "text",
                    "text": "Based on these search results, how do I authenticate API requests and what are the rate limits?"
                }
            ]
        }
    ]
}'
```
</CodeGroup>

## Claude 的回應與引用

無論如何提供搜尋結果，Claude 在使用搜尋結果中的資訊時都會自動包含引用：

```json
{
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "To authenticate API requests, you need to include an API key in the Authorization header",
      "citations": [
        {
          "type": "search_result_location",
          "source": "https://docs.company.com/api-reference",
          "title": "API Reference - Authentication",
          "cited_text": "All API requests must include an API key in the Authorization header",
          "search_result_index": 0,
          "start_block_index": 0,
          "end_block_index": 0
        }
      ]
    },
    {
      "type": "text",
      "text": ". You can generate API keys from your dashboard",
      "citations": [
        {
          "type": "search_result_location",
          "source": "https://docs.company.com/api-reference",
          "title": "API Reference - Authentication",
          "cited_text": "Keys can be generated from the dashboard",
          "search_result_index": 0,
          "start_block_index": 0,
          "end_block_index": 0
        }
      ]
    },
    {
      "type": "text",
      "text": ". The rate limits are 1,000 requests per hour for the standard tier and 10,000 requests per hour for the premium tier.",
      "citations": [
        {
          "type": "search_result_location",
          "source": "https://docs.company.com/api-reference",
          "title": "API Reference - Authentication",
          "cited_text": "Rate limits: 1000 requests per hour for standard tier, 10000 for premium",
          "search_result_index": 0,
          "start_block_index": 0,
          "end_block_index": 0
        }
      ]
    }
  ]
}
```

### 引用欄位

每個引用包含：

| 欄位 | 類型 | 說明 |
|-------|------|-------------|
| `type` | string | 搜尋結果引用始終為 `"search_result_location"` |
| `source` | string | 原始搜尋結果中的來源 |
| `title` | string or null | 原始搜尋結果中的標題 |
| `cited_text` | string | 被引用的確切文字 |
| `search_result_index` | integer | 搜尋結果的索引（以 0 開始） |
| `start_block_index` | integer | 內容陣列中的起始位置 |
| `end_block_index` | integer | 內容陣列中的結束位置 |

注意：`search_result_index` 指的是搜尋結果內容區塊的索引（以 0 開始），無論搜尋結果如何提供（工具呼叫或頂層內容）。

## 多個內容區塊

搜尋結果可以在 `content` 陣列中包含多個文字區塊：

```json
{
  "type": "search_result",
  "source": "https://docs.company.com/api-guide",
  "title": "API Documentation",
  "content": [
    {
      "type": "text",
      "text": "Authentication: All API requests require an API key."
    },
    {
      "type": "text",
      "text": "Rate Limits: The API allows 1000 requests per hour per key."
    },
    {
      "type": "text",
      "text": "Error Handling: The API returns standard HTTP status codes."
    }
  ]
}
```

Claude 可以使用 `start_block_index` 和 `end_block_index` 欄位引用特定區塊。

## 進階用法

### 結合兩種方法

您可以在同一對話中同時使用基於工具和頂層搜尋結果：

```python
# 第一條訊息，包含頂層搜尋結果
messages = [
    MessageParam(
        role="user",
        content=[
            SearchResultBlockParam(
                type="search_result",
                source="https://docs.company.com/overview",
                title="Product Overview",
                content=[
                    TextBlockParam(type="text", text="Our product helps teams collaborate...")
                ],
                citations={"enabled": True}
            ),
            TextBlockParam(
                type="text",
                text="Tell me about this product and search for pricing information"
            )
        ]
    )
]

# Claude 可能會回應並呼叫工具來搜尋定價
# 然後您提供包含更多搜尋結果的工具結果
```

### 與其他內容類型結合

兩種方法都支援將搜尋結果與其他內容混合：

```python
# 在工具結果中
tool_result = [
    SearchResultBlockParam(
        type="search_result",
        source="https://docs.company.com/guide",
        title="User Guide",
        content=[TextBlockParam(type="text", text="Configuration details...")],
        citations={"enabled": True}
    ),
    TextBlockParam(
        type="text",
        text="Additional context: This applies to version 2.0 and later."
    )
]

# 在頂層內容中
user_content = [
    SearchResultBlockParam(
        type="search_result",
        source="https://research.com/paper",
        title="Research Paper",
        content=[TextBlockParam(type="text", text="Key findings...")],
        citations={"enabled": True}
    ),
    {
        "type": "image",
        "source": {"type": "url", "url": "https://example.com/chart.png"}
    },
    TextBlockParam(
        type="text",
        text="How does the chart relate to the research findings?"
    )
]
```

### 快取控制

新增快取控制以獲得更好的效能：

```json
{
  "type": "search_result",
  "source": "https://docs.company.com/guide",
  "title": "User Guide",
  "content": [{"type": "text", "text": "..."}],
  "cache_control": {
    "type": "ephemeral"
  }
}
```

### 引用控制

預設情況下，搜尋結果的引用已停用。您可以透過明確設定 `citations` 配置來啟用引用：

```json
{
  "type": "search_result",
  "source": "https://docs.company.com/guide",
  "title": "User Guide",
  "content": [{"type": "text", "text": "Important documentation..."}],
  "citations": {
    "enabled": true  // 為此結果啟用引用
  }
}
```

當 `citations.enabled` 設定為 `true` 時，Claude 在使用搜尋結果中的資訊時會包含引用參考。這啟用了：
- 為您的自訂 RAG 應用程式提供自然引用
- 與專有知識庫互動時的來源歸屬
- 為任何返回搜尋結果的自訂工具提供網路搜尋品質的引用

如果省略 `citations` 欄位，預設情況下引用已停用。

<Warning>
引用是全有或全無的：請求中的所有搜尋結果要麼都必須啟用引用，要麼都必須停用引用。混合具有不同引用設定的搜尋結果將導致錯誤。如果您需要為某些來源停用引用，必須為該請求中的所有搜尋結果停用引用。
</Warning>

## 最佳實踐

### 針對基於工具的搜尋（方法 1）

- **動態內容**：用於即時搜尋和動態 RAG 應用程式
- **錯誤處理**：搜尋失敗時返回適當的訊息
- **結果限制**：僅返回最相關的結果以避免上下文溢出

### 針對頂層搜尋（方法 2）

- **預先取得的內容**：當您已經有搜尋結果時使用
- **批次處理**：適合一次處理多個搜尋結果
- **測試**：非常適合使用已知內容測試引用行為

### 一般最佳實踐

1. **有效地結構化結果**
   - 使用清晰、永久的來源 URL
   - 提供描述性標題
   - 將長內容分解為邏輯文字區塊

2. **保持一致性**
   - 在您的應用程式中使用一致的來源格式
   - 確保標題準確反映內容
   - 保持格式一致

3. **優雅地處理錯誤**
   ```python
   def search_with_fallback(query):
       try:
           results = perform_search(query)
           if not results:
               return {"type": "text", "text": "No results found."}
           return format_as_search_results(results)
       except Exception as e:
           return {"type": "text", "text": f"Search error: {str(e)}"}
   ```

## 限制

- 搜尋結果內容區塊在 Claude API、Amazon Bedrock 和 Google Cloud 的 Vertex AI 上可用
- 搜尋結果中僅支援文字內容（無圖像或其他媒體）
- `content` 陣列必須至少包含一個文字區塊