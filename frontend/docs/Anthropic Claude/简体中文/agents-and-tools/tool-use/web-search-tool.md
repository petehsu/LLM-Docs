# 网络搜索工具

Claude 网络搜索工具提供实时网络内容访问，允许 Claude 使用超出其知识截断日期的最新信息回答问题。

---

网络搜索工具使 Claude 能够直接访问实时网络内容，允许它使用超出其知识截断日期的最新信息回答问题。Claude 会自动引用搜索结果中的来源作为其答案的一部分。

<Note>
请通过我们的[反馈表单](https://forms.gle/sWjBtsrNEY2oKGuE8)分享您对网络搜索工具的使用体验。
</Note>

## 支持的模型

网络搜索可用于：

- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Sonnet 3.7 ([已弃用](/docs/zh-CN/about-claude/model-deprecations)) (`claude-3-7-sonnet-20250219`)
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)
- Claude Haiku 3.5 (`claude-3-5-haiku-latest`)
- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)

## 网络搜索如何工作

当您在 API 请求中添加网络搜索工具时：

1. Claude 根据提示决定何时搜索。
2. API 执行搜索并向 Claude 提供结果。此过程可能在单个请求中重复多次。
3. 在其轮次结束时，Claude 提供带有引用来源的最终响应。

## 如何使用网络搜索

<Note>
您组织的管理员必须在[控制台](/settings/privacy)中启用网络搜索。
</Note>

在您的 API 请求中提供网络搜索工具：

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

### 工具定义

网络搜索工具支持以下参数：

```json JSON
{
  "type": "web_search_20250305",
  "name": "web_search",

  // 可选：限制每个请求的搜索次数
  "max_uses": 5,

  // 可选：仅包含来自这些域的结果
  "allowed_domains": ["example.com", "trusteddomain.org"],

  // 可选：永远不包含来自这些域的结果
  "blocked_domains": ["untrustedsource.com"],

  // 可选：本地化搜索结果
  "user_location": {
    "type": "approximate",
    "city": "San Francisco",
    "region": "California",
    "country": "US",
    "timezone": "America/Los_Angeles"
  }
}
```

#### 最大使用次数

`max_uses` 参数限制执行的搜索次数。如果 Claude 尝试的搜索次数超过允许的次数，`web_search_tool_result` 将是一个错误，错误代码为 `max_uses_exceeded`。

#### 域名过滤

使用域名过滤时：

- 域名不应包含 HTTP/HTTPS 方案（使用 `example.com` 而不是 `https://example.com`）
- 子域名会自动包含（`example.com` 包含 `docs.example.com`）
- 特定子域名将结果限制为仅该子域名（`docs.example.com` 仅返回该子域名的结果，不返回 `example.com` 或 `api.example.com` 的结果）
- 支持子路径并匹配路径后的任何内容（`example.com/blog` 匹配 `example.com/blog/post-1`）
- 您可以使用 `allowed_domains` 或 `blocked_domains`，但不能在同一请求中同时使用两者。

**通配符支持：**

- 每个域名条目只允许一个通配符 (`*`)，且它必须出现在域名部分之后（在路径中）
- 有效：`example.com/*`、`example.com/*/articles`
- 无效：`*.example.com`、`ex*.com`、`example.com/*/news/*`

无效的域名格式将返回 `invalid_tool_input` 工具错误。

<Note>
请求级别的域名限制必须与在控制台中配置的组织级别域名限制兼容。请求级别的域名只能进一步限制域名，不能覆盖或超出组织级别列表。如果您的请求包含与组织设置冲突的域名，API 将返回验证错误。
</Note>

#### 本地化

`user_location` 参数允许您根据用户的位置本地化搜索结果。

- `type`：位置类型（必须为 `approximate`）
- `city`：城市名称
- `region`：地区或州
- `country`：国家
- `timezone`：[IANA 时区 ID](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)。

### 响应

以下是一个示例响应结构：

```json
{
  "role": "assistant",
  "content": [
    // 1. Claude 的搜索决定
    {
      "type": "text",
      "text": "I'll search for when Claude Shannon was born."
    },
    // 2. 使用的搜索查询
    {
      "type": "server_tool_use",
      "id": "srvtoolu_01WYG3ziw53XMcoyKL4XcZmE",
      "name": "web_search",
      "input": {
        "query": "claude shannon birth date"
      }
    },
    // 3. 搜索结果
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
    // 4. Claude 的带有引用的响应
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

#### 搜索结果

搜索结果包括：

- `url`：源页面的 URL
- `title`：源页面的标题
- `page_age`：网站上次更新的时间
- `encrypted_content`：加密内容，必须在多轮对话中传回以用于引用

#### 引用

网络搜索始终启用引用，每个 `web_search_result_location` 包括：

- `url`：引用来源的 URL
- `title`：引用来源的标题
- `encrypted_index`：必须为多轮对话传回的引用
- `cited_text`：最多 150 个字符的引用内容

网络搜索引用字段 `cited_text`、`title` 和 `url` 不计入输入或输出令牌使用。

<Note>
  当直接向最终用户显示 API 输出时，必须包含对原始来源的引用。如果您对 API 输出进行修改，包括在显示给最终用户之前重新处理和/或将其与您自己的材料结合，请根据与您的法律团队的协商适当显示引用。
</Note>

#### 错误

当网络搜索工具遇到错误（例如达到速率限制）时，Claude API 仍会返回 200（成功）响应。错误在响应体中使用以下结构表示：

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

这些是可能的错误代码：

- `too_many_requests`：超过速率限制
- `invalid_input`：无效的搜索查询参数
- `max_uses_exceeded`：超过最大网络搜索工具使用次数
- `query_too_long`：查询超过最大长度
- `unavailable`：发生内部错误

#### `pause_turn` 停止原因

响应可能包括 `pause_turn` 停止原因，这表示 API 暂停了长时间运行的轮次。您可以在后续请求中按原样提供响应以让 Claude 继续其轮次，或者如果您希望中断对话，可以修改内容。

## 提示缓存

网络搜索与[提示缓存](/docs/zh-CN/build-with-claude/prompt-caching)配合使用。要启用提示缓存，请在您的请求中添加至少一个 `cache_control` 断点。系统将在执行工具时自动缓存到最后一个 `web_search_tool_result` 块。

对于多轮对话，在最后一个 `web_search_tool_result` 块上或之后设置 `cache_control` 断点以重用缓存内容。

例如，为多轮对话使用网络搜索的提示缓存：

<CodeGroup>
```python
import anthropic

client = anthropic.Anthropic()

# 第一个请求，带有网络搜索和缓存断点
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

# 将 Claude 的响应添加到对话中
messages.append({
    "role": "assistant",
    "content": response1.content
})

# 第二个请求，在搜索结果后有缓存断点
messages.append({
    "role": "user",
    "content": "Should I expect rain later this week?",
    "cache_control": {"type": "ephemeral"}  # 缓存到此点
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
# 第二个响应将受益于缓存的搜索结果
# 同时仍然能够在需要时执行新搜索
print(f"Cache read tokens: {response2.usage.get('cache_read_input_tokens', 0)}")
```

</CodeGroup>

## 流式传输

启用流式传输后，您将接收搜索事件作为流的一部分。搜索执行时会有一个暂停：

```javascript
event: message_start
data: {"type": "message_start", "message": {"id": "msg_abc123", "type": "message"}}

event: content_block_start
data: {"type": "content_block_start", "index": 0, "content_block": {"type": "text", "text": ""}}

// Claude 的搜索决定

event: content_block_start
data: {"type": "content_block_start", "index": 1, "content_block": {"type": "server_tool_use", "id": "srvtoolu_xyz789", "name": "web_search"}}

// 搜索查询流式传输
event: content_block_delta
data: {"type": "content_block_delta", "index": 1, "delta": {"type": "input_json_delta", "partial_json": "{\"query\":\"latest quantum computing breakthroughs 2025\"}"}}

// 搜索执行时暂停

// 搜索结果流式传输
event: content_block_start
data: {"type": "content_block_start", "index": 2, "content_block": {"type": "web_search_tool_result", "tool_use_id": "srvtoolu_xyz789", "content": [{"type": "web_search_result", "title": "Quantum Computing Breakthroughs in 2025", "url": "https://example.com"}]}}

// Claude 的带有引用的响应（本示例中省略）
```

## 批量请求

您可以在[消息批处理 API](/docs/zh-CN/build-with-claude/batch-processing)中包含网络搜索工具。通过消息批处理 API 的网络搜索工具调用的定价与常规消息 API 请求中的相同。

## 使用和定价

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