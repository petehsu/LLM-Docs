# 搜索结果

通过提供带有来源归属的搜索结果，为 RAG 应用程序启用自然引用

---

搜索结果内容块支持带有适当来源归属的自然引用，为您的自定义应用程序带来网络搜索质量的引用。此功能对于 RAG（检索增强生成）应用程序特别强大，您需要 Claude 准确引用来源。

搜索结果功能在以下模型上可用：

- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)
- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Sonnet 3.7 ([已弃用](/docs/zh-CN/about-claude/model-deprecations)) (`claude-3-7-sonnet-20250219`)
- Claude 3.5 Haiku (`claude-3-5-haiku-20241022`)

## 主要优势

- **自然引用** - 为任何内容实现与网络搜索相同的引用质量
- **灵活集成** - 在工具返回中用于动态 RAG，或作为顶级内容用于预取数据
- **适当的来源归属** - 每个结果都包含来源和标题信息，以便清晰归属
- **无需文档解决方案** - 消除了对基于文档的解决方案的需要
- **一致的引用格式** - 与 Claude 网络搜索功能的引用质量和格式相匹配

## 工作原理

搜索结果可以通过两种方式提供：

1. **来自工具调用** - 您的自定义工具返回搜索结果，启用动态 RAG 应用程序
2. **作为顶级内容** - 您直接在用户消息中提供搜索结果，用于预取或缓存内容

在这两种情况下，Claude 都可以自动引用搜索结果中的信息，并进行适当的来源归属。

### 搜索结果架构

搜索结果使用以下结构：

```json
{
  "type": "search_result",
  "source": "https://example.com/article",  // 必需：来源 URL 或标识符
  "title": "Article Title",                  // 必需：结果的标题
  "content": [                               // 必需：文本块数组
    {
      "type": "text",
      "text": "The actual content of the search result..."
    }
  ],
  "citations": {                             // 可选：引用配置
    "enabled": true                          // 启用/禁用此结果的引用
  }
}
```

### 必需字段

| 字段 | 类型 | 描述 |
|-------|------|-------------|
| `type` | string | 必须为 `"search_result"` |
| `source` | string | 内容的来源 URL 或标识符 |
| `title` | string | 搜索结果的描述性标题 |
| `content` | array | 包含实际内容的文本块数组 |

### 可选字段

| 字段 | 类型 | 描述 |
|-------|------|-------------|
| `citations` | object | 引用配置，包含 `enabled` 布尔字段 |
| `cache_control` | object | 缓存控制设置（例如 `{"type": "ephemeral"}`) |

`content` 数组中的每一项必须是一个文本块，包含：
- `type`：必须为 `"text"`
- `text`：实际文本内容（非空字符串）

## 方法 1：来自工具调用的搜索结果

最强大的用例是从您的自定义工具返回搜索结果。这启用了动态 RAG 应用程序，其中工具获取并返回相关内容，具有自动引用。

### 示例：知识库工具

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

# 定义知识库搜索工具
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

# 处理工具调用的函数
def search_knowledge_base(query):
    # 您的搜索逻辑在这里
    # 返回正确格式的搜索结果
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

# 使用工具创建消息
response = client.messages.create(
    model="claude-sonnet-4-5",  # Works with all supported models
    max_tokens=1024,
    tools=[knowledge_base_tool],
    messages=[
        MessageParam(
            role="user",
            content="How do I configure the timeout settings?"
        )
    ]
)

# 当 Claude 调用工具时，提供搜索结果
if response.content[0].type == "tool_use":
    tool_result = search_knowledge_base(response.content[0].input["query"])
    
    # 将工具结果发送回去
    final_response = client.messages.create(
        model="claude-sonnet-4-5",  # Works with all supported models
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
                        content=tool_result  # Search results go here
                    )
                ]
            )
        ]
    )
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

// 定义知识库搜索工具
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

// 处理工具调用的函数
function searchKnowledgeBase(query: string) {
  // 您的搜索逻辑在这里
  // 返回正确格式的搜索结果
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

// 使用工具创建消息
const response = await anthropic.messages.create({
  model: "claude-sonnet-4-5", // Works with all supported models
  max_tokens: 1024,
  tools: [knowledgeBaseTool],
  messages: [
    {
      role: "user",
      content: "How do I configure the timeout settings?"
    }
  ]
});

// 处理工具使用并提供结果
if (response.content[0].type === "tool_use") {
  const toolResult = searchKnowledgeBase(response.content[0].input.query);
  
  const finalResponse = await anthropic.messages.create({
    model: "claude-sonnet-4-5", // Works with all supported models
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
            content: toolResult  // Search results go here
          }
        ]
      }
    ]
  });
}
```
</CodeGroup>

## 方法 2：作为顶级内容的搜索结果

您也可以直接在用户消息中提供搜索结果。这对以下情况很有用：
- 从您的搜索基础设施预取的内容
- 来自以前查询的缓存搜索结果
- 来自外部搜索服务的内容
- 测试和开发

### 示例：直接搜索结果

<CodeGroup>
```python Python
from anthropic import Anthropic
from anthropic.types import (
    MessageParam,
    TextBlockParam,
    SearchResultBlockParam
)

client = Anthropic()

# 直接在用户消息中提供搜索结果
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

// 直接在用户消息中提供搜索结果
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

## Claude 的带引用的响应

无论如何提供搜索结果，Claude 在使用搜索结果中的信息时都会自动包含引用：

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

### 引用字段

每个引用包含：

| 字段 | 类型 | 描述 |
|-------|------|-------------|
| `type` | string | 对于搜索结果引用，始终为 `"search_result_location"` |
| `source` | string | 原始搜索结果中的来源 |
| `title` | string or null | 原始搜索结果中的标题 |
| `cited_text` | string | 被引用的确切文本 |
| `search_result_index` | integer | 搜索结果的索引（从 0 开始） |
| `start_block_index` | integer | 内容数组中的起始位置 |
| `end_block_index` | integer | 内容数组中的结束位置 |

注意：`search_result_index` 指的是搜索结果内容块的索引（从 0 开始），无论搜索结果如何提供（工具调用或顶级内容）。

## 多个内容块

搜索结果可以在 `content` 数组中包含多个文本块：

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

Claude 可以使用 `start_block_index` 和 `end_block_index` 字段引用特定块。

## 高级用法

### 结合两种方法

您可以在同一对话中同时使用基于工具和顶级搜索结果：

```python
# 第一条消息，包含顶级搜索结果
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

# Claude 可能会响应并调用工具来搜索定价信息
# 然后您提供包含更多搜索结果的工具结果
```

### 与其他内容类型结合

两种方法都支持将搜索结果与其他内容混合：

```python
# 在工具结果中
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

# 在顶级内容中
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

### 缓存控制

添加缓存控制以获得更好的性能：

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

默认情况下，搜索结果禁用引用。您可以通过显式设置 `citations` 配置来启用引用：

```json
{
  "type": "search_result",
  "source": "https://docs.company.com/guide",
  "title": "User Guide",
  "content": [{"type": "text", "text": "Important documentation..."}],
  "citations": {
    "enabled": true  // 为此结果启用引用
  }
}
```

当 `citations.enabled` 设置为 `true` 时，Claude 在使用搜索结果中的信息时会包含引用参考。这启用了：
- 为您的自定义 RAG 应用程序提供自然引用
- 与专有知识库交互时的来源归属
- 对任何返回搜索结果的自定义工具的网络搜索质量引用

如果省略 `citations` 字段，默认情况下引用被禁用。

<Warning>
引用是全有或全无的：请求中的所有搜索结果要么必须启用引用，要么必须禁用引用。混合具有不同引用设置的搜索结果将导致错误。如果您需要为某些来源禁用引用，必须为该请求中的所有搜索结果禁用引用。
</Warning>

## 最佳实践

### 对于基于工具的搜索（方法 1）

- **动态内容**：用于实时搜索和动态 RAG 应用程序
- **错误处理**：搜索失败时返回适当的消息
- **结果限制**：仅返回最相关的结果以避免上下文溢出

### 对于顶级搜索（方法 2）

- **预取内容**：当您已经有搜索结果时使用
- **批处理**：非常适合一次处理多个搜索结果
- **测试**：非常适合用已知内容测试引用行为

### 一般最佳实践

1. **有效地构建结果**
   - 使用清晰、永久的来源 URL
   - 提供描述性标题
   - 将长内容分解为逻辑文本块

2. **保持一致性**
   - 在整个应用程序中使用一致的来源格式
   - 确保标题准确反映内容
   - 保持格式一致

3. **优雅地处理错误**
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

- 搜索结果内容块在 Claude API、Amazon Bedrock 和 Google Cloud 的 Vertex AI 上可用
- 搜索结果中仅支持文本内容（无图像或其他媒体）
- `content` 数组必须至少包含一个文本块