# 工具搜索工具

工具搜索工具使 Claude 能够通过动态发现和按需加载来处理数百或数千个工具。

---

工具搜索工具使 Claude 能够通过动态发现和按需加载来处理数百或数千个工具。与其将所有工具定义预先加载到上下文窗口中，Claude 会搜索您的工具目录（包括工具名称、描述、参数名称和参数描述），并仅加载它需要的工具。

当工具库扩展时，这种方法解决了两个关键挑战：

- **上下文效率**：工具定义可能会消耗上下文窗口的大部分（50 个工具 ≈ 10-20K 个令牌），留下较少的实际工作空间
- **工具选择准确性**：当有超过 30-50 个常规可用工具时，Claude 正确选择工具的能力会显著下降

虽然这是作为服务器端工具提供的，但您也可以实现自己的客户端工具搜索功能。有关详细信息，请参阅[自定义工具搜索实现](#custom-tool-search-implementation)。

<Note>
工具搜索工具目前处于公开测试版。为您的提供商包含适当的[测试版标头](/docs/zh-CN/api/beta-headers)：

| 提供商                 | 测试版标头                    | 支持的模型                       |
| ------------------------ | ------------------------------ | -------------------------------------- |
| Claude API<br/>Microsoft Foundry  | `advanced-tool-use-2025-11-20` | Claude Opus 4.5<br />Claude Sonnet 4.5 |
| Google Cloud 的 Vertex AI | `tool-search-tool-2025-10-19`  | Claude Opus 4.5<br />Claude Sonnet 4.5 |
| Amazon Bedrock           | `tool-search-tool-2025-10-19`  | Claude Opus 4.5                        |
</Note>

<Warning>
  在 Amazon Bedrock 上，服务器端工具搜索仅通过[调用 API](https://docs.aws.amazon.com/bedrock/latest/userguide/bedrock-runtime_example_bedrock-runtime_InvokeModel_AnthropicClaude_section.html) 可用，不支持反向 API。
</Warning>

您也可以通过从自己的搜索实现返回 `tool_reference` 块来实现[客户端工具搜索](#custom-tool-search-implementation)。

## 工具搜索如何工作

有两种工具搜索变体：

- **正则表达式** (`tool_search_tool_regex_20251119`)：Claude 构造正则表达式模式来搜索工具
- **BM25** (`tool_search_tool_bm25_20251119`)：Claude 使用自然语言查询来搜索工具

启用工具搜索工具时：

1. 您在工具列表中包含工具搜索工具（例如 `tool_search_tool_regex_20251119` 或 `tool_search_tool_bm25_20251119`）
2. 您为不应立即加载的工具提供所有工具定义，并设置 `defer_loading: true`
3. Claude 最初只看到工具搜索工具和任何非延迟工具
4. 当 Claude 需要其他工具时，它使用工具搜索工具进行搜索
5. API 返回 3-5 个最相关的 `tool_reference` 块
6. 这些引用会自动扩展为完整的工具定义
7. Claude 从发现的工具中选择并调用它们

这样可以保持上下文窗口高效，同时维持高工具选择准确性。

## 快速开始

这是一个带有延迟工具的简单示例：

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

## 工具定义

工具搜索工具有两种变体：

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
**正则表达式变体查询格式：Python 正则表达式，不是自然语言**

使用 `tool_search_tool_regex_20251119` 时，Claude 使用 Python 的 `re.search()` 语法构造正则表达式模式，而不是自然语言查询。常见模式：

- `"weather"` - 匹配包含"weather"的工具名称/描述
- `"get_.*_data"` - 匹配 `get_user_data`、`get_weather_data` 等工具
- `"database.*query|query.*database"` - 用于灵活性的 OR 模式
- `"(?i)slack"` - 不区分大小写的搜索

最大查询长度：200 个字符

</Warning>

<Note>
**BM25 变体查询格式：自然语言**

使用 `tool_search_tool_bm25_20251119` 时，Claude 使用自然语言查询来搜索工具。

</Note>

### 延迟工具加载

通过添加 `defer_loading: true` 标记工具以按需加载：

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

**关键点：**

- 没有 `defer_loading` 的工具会立即加载到上下文中
- 具有 `defer_loading: true` 的工具仅在 Claude 通过搜索发现它们时加载
- 工具搜索工具本身**不应该**具有 `defer_loading: true`
- 将您最常用的 3-5 个工具保持为非延迟以获得最佳性能

两种工具搜索变体（`regex` 和 `bm25`）都搜索工具名称、描述、参数名称和参数描述。

## 响应格式

当 Claude 使用工具搜索工具时，响应包括新的块类型：

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

### 理解响应

- **`server_tool_use`**：表示 Claude 正在调用工具搜索工具
- **`tool_search_tool_result`**：包含搜索结果，其中包含嵌套的 `tool_search_tool_search_result` 对象
- **`tool_references`**：指向发现的工具的 `tool_reference` 对象数组
- **`tool_use`**：Claude 调用发现的工具

`tool_reference` 块会自动扩展为完整的工具定义，然后显示给 Claude。您不需要自己处理这个扩展。只要您在 `tools` 参数中提供所有匹配的工具定义，它就会在 API 中自动发生。

## MCP 集成

工具搜索工具与 [MCP 服务器](/docs/zh-CN/agents-and-tools/mcp-connector) 配合使用。将 `"mcp-client-2025-11-20"` [测试版标头](/docs/zh-CN/api/beta-headers) 添加到您的 API 请求中，然后使用带有 `default_config` 的 `mcp_toolset` 来延迟加载 MCP 工具：

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

**MCP 配置选项：**

- `default_config.defer_loading`：为来自 MCP 服务器的所有工具设置默认值
- `configs`：按名称覆盖特定工具的默认值
- 将多个 MCP 服务器与工具搜索结合以获得大规模工具库

## 自定义工具搜索实现

您可以通过从自定义工具返回 `tool_reference` 块来实现自己的工具搜索逻辑（例如，使用嵌入或语义搜索）：

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

每个引用的工具必须在顶级 `tools` 参数中有相应的工具定义，并设置 `defer_loading: true`。这种方法让您可以使用更复杂的搜索算法，同时保持与工具搜索系统的兼容性。

有关使用嵌入的完整示例，请参阅我们的[带嵌入的工具搜索 cookbook](https://github.com/anthropics/anthropic-cookbook)。

## 错误处理

<Note>
  工具搜索工具与[工具使用示例](/docs/zh-CN/agents-and-tools/tool-use/implement-tool-use#providing-tool-use-examples)不兼容。如果您需要提供工具使用示例，请使用不带工具搜索的标准工具调用。
</Note>

### HTTP 错误（400 状态）

这些错误会阻止请求被处理：

**所有工具都延迟：**

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "All tools have defer_loading set. At least one tool must be non-deferred."
  }
}
```

**缺少工具定义：**

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "Tool reference 'unknown_tool' has no corresponding tool definition"
  }
}
```

### 工具结果错误（200 状态）

工具执行期间的错误返回 200 响应，错误信息在正文中：

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

**错误代码：**

- `too_many_requests`：工具搜索操作超过速率限制
- `invalid_pattern`：格式错误的正则表达式模式
- `pattern_too_long`：模式超过 200 个字符限制
- `unavailable`：工具搜索服务暂时不可用

### 常见错误

<section title="400 错误：所有工具都延迟">

**原因**：您在所有工具（包括搜索工具）上设置了 `defer_loading: true`

**修复**：从工具搜索工具中删除 `defer_loading`：

```json
{
  "type": "tool_search_tool_regex_20251119", // 这里没有 defer_loading
  "name": "tool_search_tool_regex"
}
```

</section>

<section title="400 错误：缺少工具定义">

**原因**：`tool_reference` 指向不在您的 `tools` 数组中的工具

**修复**：确保每个可能被发现的工具都有完整的定义：

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

<section title="Claude 找不到预期的工具">

**原因**：工具名称或描述与正则表达式模式不匹配

**调试步骤：**

1. 检查工具名称和描述——Claude 搜索两个字段
2. 测试您的模式：`import re; re.search(r"your_pattern", "tool_name")`
3. 记住搜索默认区分大小写（使用 `(?i)` 进行不区分大小写）
4. Claude 使用宽泛的模式，如 `".*weather.*"` 而不是精确匹配

**提示**：向工具描述添加常见关键字以改进可发现性

</section>

## 提示缓存

工具搜索与[提示缓存](/docs/zh-CN/build-with-claude/prompt-caching)配合使用。添加 `cache_control` 断点以优化多轮对话：

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# 第一个带工具搜索的请求
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

# 将 Claude 的响应添加到对话中
messages.append({
    "role": "assistant",
    "content": response1.content
})

# 带缓存断点的第二个请求
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

系统会自动在整个对话历史中扩展 tool_reference 块，因此 Claude 可以在后续轮次中重用发现的工具，而无需重新搜索。

## 流式传输

启用流式传输后，您将接收工具搜索事件作为流的一部分：

```javascript
event: content_block_start
data: {"type": "content_block_start", "index": 1, "content_block": {"type": "server_tool_use", "id": "srvtoolu_xyz789", "name": "tool_search_tool_regex"}}

// 搜索查询流式传输
event: content_block_delta
data: {"type": "content_block_delta", "index": 1, "delta": {"type": "input_json_delta", "partial_json": "{\"query\":\"weather\"}"}}

// 搜索执行时暂停

// 搜索结果流式传输
event: content_block_start
data: {"type": "content_block_start", "index": 2, "content_block": {"type": "tool_search_tool_result", "tool_use_id": "srvtoolu_xyz789", "content": {"type": "tool_search_tool_search_result", "tool_references": [{"type": "tool_reference", "tool_name": "get_weather"}]}}}

// Claude 继续使用发现的工具
```

## 批量请求

您可以在[消息批处理 API](/docs/zh-CN/build-with-claude/batch-processing) 中包含工具搜索工具。通过消息批处理 API 的工具搜索操作的定价与常规消息 API 请求中的相同。

## 限制和最佳实践

### 限制

- **最大工具数**：目录中最多 10,000 个工具
- **搜索结果**：每次搜索返回 3-5 个最相关的工具
- **模式长度**：正则表达式模式最多 200 个字符
- **模型支持**：仅 Sonnet 4.0+、Opus 4.0+（不支持 Haiku）

### 何时使用工具搜索

**良好的用例：**

- 系统中有 10+ 个工具可用
- 工具定义消耗 >10K 个令牌
- 遇到大型工具集的工具选择准确性问题
- 构建具有多个服务器的 MCP 驱动系统（200+ 工具）
- 工具库随时间增长

**传统工具调用可能更好的情况：**

- 总共少于 10 个工具
- 所有工具在每个请求中都频繁使用
- 非常小的工具定义（总共 <100 个令牌）

### 优化提示

- 将最常用的 3-5 个工具保持为非延迟
- 编写清晰、描述性的工具名称和描述
- 在描述中使用与用户描述任务方式相匹配的语义关键字
- 添加系统提示部分，描述可用的工具类别："您可以搜索工具来与 Slack、GitHub 和 Jira 交互"
- 监控 Claude 发现的工具以改进描述

## 使用情况

工具搜索工具的使用情况在响应使用对象中跟踪：

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