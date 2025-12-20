# Web fetch 工具

Web fetch 工具允许 Claude 从指定的网页和 PDF 文档中检索完整内容。

---

Web fetch 工具允许 Claude 从指定的网页和 PDF 文档中检索完整内容。

<Note>
Web fetch 工具目前处于测试阶段。要启用它，请在 API 请求中使用测试版标头 `web-fetch-2025-09-10`。

请使用[此表单](https://forms.gle/NhWcgmkcvPCMmPE86)提供有关模型响应质量、API 本身或文档质量的反馈。
</Note>

<Warning>
在 Claude 处理不受信任的输入与敏感数据的环境中启用 web fetch 工具会带来数据泄露风险。我们建议仅在受信任的环境中或处理非敏感数据时使用此工具。

为了最小化泄露风险，Claude 不允许动态构造 URL。Claude 只能获取用户明确提供的 URL 或来自之前的网络搜索或 web fetch 结果的 URL。但是，使用此工具时仍然存在应仔细考虑的残余风险。

如果数据泄露是一个问题，请考虑：
- 完全禁用 web fetch 工具
- 使用 `max_uses` 参数限制请求数量
- 使用 `allowed_domains` 参数限制为已知的安全域名
</Warning>

## 支持的模型

Web fetch 可用于：

- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Sonnet 3.7 ([已弃用](/docs/zh-CN/about-claude/model-deprecations)) (`claude-3-7-sonnet-20250219`)
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)
- Claude Haiku 3.5 (`claude-3-5-haiku-latest`)
- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)

## Web fetch 如何工作

当您在 API 请求中添加 web fetch 工具时：

1. Claude 根据提示和可用的 URL 决定何时获取内容。
2. API 从指定的 URL 检索完整的文本内容。
3. 对于 PDF，执行自动文本提取。
4. Claude 分析获取的内容并提供可选引用的响应。

<Note>
Web fetch 工具目前不支持通过 Javascript 动态呈现的网站。
</Note>

## 如何使用 web fetch

在 API 请求中提供 web fetch 工具：

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

### 工具定义

Web fetch 工具支持以下参数：

```json JSON
{
  "type": "web_fetch_20250910",
  "name": "web_fetch",

  // 可选：限制每个请求的获取次数
  "max_uses": 10,

  // 可选：仅从这些域名获取
  "allowed_domains": ["example.com", "docs.example.com"],

  // 可选：永远不从这些域名获取
  "blocked_domains": ["private.example.com"],

  // 可选：为获取的内容启用引用
  "citations": {
    "enabled": true
  },

  // 可选：最大内容长度（以令牌计）
  "max_content_tokens": 100000
}
```

#### 最大使用次数

`max_uses` 参数限制执行的网络获取次数。如果 Claude 尝试的获取次数超过允许的次数，`web_fetch_tool_result` 将是一个错误，错误代码为 `max_uses_exceeded`。目前没有默认限制。

#### 域名过滤

使用域名过滤时：

- 域名不应包含 HTTP/HTTPS 方案（使用 `example.com` 而不是 `https://example.com`）
- 子域名会自动包含（`example.com` 包含 `docs.example.com`）
- 支持子路径（`example.com/blog`）
- 您可以使用 `allowed_domains` 或 `blocked_domains`，但不能在同一请求中同时使用两者。

<Warning>
请注意，域名中的 Unicode 字符可能会通过同形字攻击造成安全漏洞，其中来自不同脚本的视觉上相似的字符可能会绕过域名过滤。例如，`аmazon.com`（使用西里尔字母"а"）可能看起来与 `amazon.com` 相同，但代表不同的域名。

配置域名允许/阻止列表时：
- 尽可能使用仅 ASCII 的域名
- 考虑 URL 解析器可能以不同方式处理 Unicode 规范化
- 使用潜在的同形字变体测试您的域名过滤
- 定期审计您的域名配置以查找可疑的 Unicode 字符
</Warning>

#### 内容限制

`max_content_tokens` 参数限制将包含在上下文中的内容量。如果获取的内容超过此限制，将被截断。这有助于在获取大型文档时控制令牌使用。

<Note>
`max_content_tokens` 参数限制是近似的。实际使用的输入令牌数量可能会有少量变化。
</Note>

#### 引用

与网络搜索不同（引用始终启用），web fetch 的引用是可选的。设置 `"citations": {"enabled": true}` 以启用 Claude 引用从获取的文档中的特定段落。

<Note>
在直接向最终用户显示 API 输出时，必须包含对原始来源的引用。如果您在显示给最终用户之前对 API 输出进行修改，包括重新处理和/或将其与您自己的材料结合，请根据与您的法律团队的协商适当显示引用。
</Note>

### 响应

以下是一个示例响应结构：

```json
{
  "role": "assistant",
  "content": [
    // 1. Claude 的获取决定
    {
      "type": "text",
      "text": "I'll fetch the content from the article to analyze it."
    },
    // 2. 获取请求
    {
      "type": "server_tool_use",
      "id": "srvtoolu_01234567890abcdef",
      "name": "web_fetch",
      "input": {
        "url": "https://example.com/article"
      }
    },
    // 3. 获取结果
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
    // 4. Claude 的分析（如果启用了引用）
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

#### 获取结果

获取结果包括：

- `url`：被获取的 URL
- `content`：包含获取内容的文档块
- `retrieved_at`：检索内容的时间戳

<Note>
Web fetch 工具缓存结果以提高性能并减少冗余请求。这意味着返回的内容可能不总是 URL 上可用的最新版本。缓存行为是自动管理的，可能会随着时间的推移而改变，以针对不同的内容类型和使用模式进行优化。
</Note>

对于 PDF 文档，内容将作为 base64 编码的数据返回：

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

#### 错误

当 web fetch 工具遇到错误时，Claude API 返回 200（成功）响应，错误在响应体中表示：

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

这些是可能的错误代码：

- `invalid_input`：无效的 URL 格式
- `url_too_long`：URL 超过最大长度（250 个字符）
- `url_not_allowed`：URL 被域名过滤规则和模型限制阻止
- `url_not_accessible`：获取内容失败（HTTP 错误）
- `too_many_requests`：超过速率限制
- `unsupported_content_type`：不支持的内容类型（仅限文本和 PDF）
- `max_uses_exceeded`：超过最大 web fetch 工具使用次数
- `unavailable`：发生内部错误

## URL 验证

出于安全原因，web fetch 工具只能获取之前在对话上下文中出现过的 URL。这包括：

- 用户消息中的 URL
- 客户端工具结果中的 URL
- 来自之前的网络搜索或 web fetch 结果的 URL

该工具无法获取 Claude 生成的任意 URL 或来自基于容器的服务器工具（代码执行、Bash 等）的 URL。

## 组合搜索和获取

Web fetch 与网络搜索无缝协作，用于全面的信息收集：

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

在此工作流中，Claude 将：
1. 使用网络搜索查找相关文章
2. 选择最有前景的结果
3. 使用 web fetch 检索完整内容
4. 提供带有引用的详细分析

## 提示缓存

Web fetch 与[提示缓存](/docs/zh-CN/build-with-claude/prompt-caching)配合使用。要启用提示缓存，请在请求中添加 `cache_control` 断点。缓存的获取结果可以在对话轮次中重复使用。

```python
import anthropic

client = anthropic.Anthropic()

# 第一个请求，带有 web fetch
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

# 将 Claude 的响应添加到对话
messages.append({
    "role": "assistant",
    "content": response1.content
})

# 第二个请求，带有缓存断点
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

# 第二个响应受益于缓存的获取结果
print(f"Cache read tokens: {response2.usage.get('cache_read_input_tokens', 0)}")
```

## 流式传输

启用流式传输后，获取事件是流的一部分，在内容检索期间暂停：

```javascript
event: message_start
data: {"type": "message_start", "message": {"id": "msg_abc123", "type": "message"}}

event: content_block_start
data: {"type": "content_block_start", "index": 0, "content_block": {"type": "text", "text": ""}}

// Claude 的获取决定

event: content_block_start
data: {"type": "content_block_start", "index": 1, "content_block": {"type": "server_tool_use", "id": "srvtoolu_xyz789", "name": "web_fetch"}}

// 获取 URL 流式传输
event: content_block_delta
data: {"type": "content_block_delta", "index": 1, "delta": {"type": "input_json_delta", "partial_json": "{\"url\":\"https://example.com/article\"}"}}

// 在获取执行时暂停

// 获取结果流式传输
event: content_block_start
data: {"type": "content_block_start", "index": 2, "content_block": {"type": "web_fetch_tool_result", "tool_use_id": "srvtoolu_xyz789", "content": {"type": "web_fetch_result", "url": "https://example.com/article", "content": {"type": "document", "source": {"type": "text", "media_type": "text/plain", "data": "Article content..."}}}}}

// Claude 的响应继续...
```

## 批处理请求

您可以在[消息批处理 API](/docs/zh-CN/build-with-claude/batch-processing)中包含 web fetch 工具。通过消息批处理 API 的 web fetch 工具调用的定价与常规消息 API 请求中的相同。

## 使用和定价

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