# 定价

了解 Anthropic 的模型和功能定价结构

---

本页面提供了 Anthropic 模型和功能的详细定价信息。所有价格均以美元计价。

如需最新定价信息，请访问 [claude.com/pricing](https://claude.com/pricing)。

## 模型定价

下表显示了所有 Claude 模型在不同使用层级的定价：

| Model             | Base Input Tokens | 5m Cache Writes | 1h Cache Writes | Cache Hits & Refreshes | Output Tokens |
|-------------------|-------------------|-----------------|-----------------|----------------------|---------------|
| Claude Opus 4.5   | $5 / MTok         | $6.25 / MTok    | $10 / MTok      | $0.50 / MTok | $25 / MTok    |
| Claude Opus 4.1   | $15 / MTok        | $18.75 / MTok   | $30 / MTok      | $1.50 / MTok | $75 / MTok    |
| Claude Opus 4     | $15 / MTok        | $18.75 / MTok   | $30 / MTok      | $1.50 / MTok | $75 / MTok    |
| Claude Sonnet 4.5   | $3 / MTok         | $3.75 / MTok    | $6 / MTok       | $0.30 / MTok | $15 / MTok    |
| Claude Sonnet 4   | $3 / MTok         | $3.75 / MTok    | $6 / MTok       | $0.30 / MTok | $15 / MTok    |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations)) | $3 / MTok         | $3.75 / MTok    | $6 / MTok       | $0.30 / MTok | $15 / MTok    |
| Claude Haiku 4.5  | $1 / MTok         | $1.25 / MTok    | $2 / MTok       | $0.10 / MTok | $5 / MTok     |
| Claude Haiku 3.5  | $0.80 / MTok      | $1 / MTok       | $1.6 / MTok     | $0.08 / MTok | $4 / MTok     |
| Claude Opus 3 ([deprecated](/docs/en/about-claude/model-deprecations))    | $15 / MTok        | $18.75 / MTok   | $30 / MTok      | $1.50 / MTok | $75 / MTok    |
| Claude Haiku 3    | $0.25 / MTok      | $0.30 / MTok    | $0.50 / MTok    | $0.03 / MTok | $1.25 / MTok  |

<Note>
MTok = 百万个令牌。"Base Input Tokens"（基础输入令牌）列显示标准输入定价，"Cache Writes"（缓存写入）和"Cache Hits"（缓存命中）特定于[提示缓存](/docs/zh-CN/build-with-claude/prompt-caching)，"Output Tokens"（输出令牌）显示输出定价。提示缓存提供 5 分钟（默认）和 1 小时缓存持续时间，以优化不同用例的成本。

上表反映了以下提示缓存定价倍数：
- 5 分钟缓存写入令牌是基础输入令牌价格的 1.25 倍
- 1 小时缓存写入令牌是基础输入令牌价格的 2 倍
- 缓存读取令牌是基础输入令牌价格的 0.1 倍
</Note>

## 第三方平台定价

Claude 模型可在 [AWS Bedrock](/docs/zh-CN/build-with-claude/claude-on-amazon-bedrock)、[Google Vertex AI](/docs/zh-CN/build-with-claude/claude-on-vertex-ai) 和 [Microsoft Foundry](/docs/zh-CN/build-with-claude/claude-in-microsoft-foundry) 上使用。如需官方定价，请访问：
- [AWS Bedrock 定价](https://aws.amazon.com/bedrock/pricing/)
- [Google Vertex AI 定价](https://cloud.google.com/vertex-ai/generative-ai/pricing)
- [Microsoft Foundry 定价](https://azure.microsoft.com/en-us/pricing/details/ai-foundry/#pricing)

<Note>
**Claude 4.5 模型及更新版本的区域端点定价**

从 Claude Sonnet 4.5 和 Haiku 4.5 开始，AWS Bedrock 和 Google Vertex AI 提供两种端点类型：
- **全球端点**：跨区域动态路由以实现最大可用性
- **区域端点**：数据路由保证在特定地理区域内

区域端点包括相对于全球端点的 10% 溢价。**Claude API (1P) 默认为全球端点，不受此更改影响。** Claude API 仅为全球端点（相当于其他提供商的全球端点产品和定价）。

**范围**：此定价结构适用于 Claude Sonnet 4.5、Haiku 4.5 和所有未来模型。早期模型（Claude Sonnet 4、Opus 4 及更早版本）保留其现有定价。

有关实现详情和代码示例：
- [AWS Bedrock 全球端点与区域端点](/docs/zh-CN/build-with-claude/claude-on-amazon-bedrock#global-vs-regional-endpoints)
- [Google Vertex AI 全球端点与区域端点](/docs/zh-CN/build-with-claude/claude-on-vertex-ai#global-vs-regional-endpoints)
</Note>

## 功能特定定价

### 批处理

Batch API 允许异步处理大量请求，输入和输出令牌均享受 50% 折扣。

| Model             | Batch input      | Batch output    |
|-------------------|------------------|-----------------|
| Claude Opus 4.5     | $2.50 / MTok     | $12.50 / MTok   |
| Claude Opus 4.1     | $7.50 / MTok     | $37.50 / MTok   |
| Claude Opus 4     | $7.50 / MTok     | $37.50 / MTok   |
| Claude Sonnet 4.5   | $1.50 / MTok     | $7.50 / MTok    |
| Claude Sonnet 4   | $1.50 / MTok     | $7.50 / MTok    |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations)) | $1.50 / MTok     | $7.50 / MTok    |
| Claude Haiku 4.5  | $0.50 / MTok     | $2.50 / MTok    |
| Claude Haiku 3.5  | $0.40 / MTok     | $2 / MTok       |
| Claude Opus 3 ([deprecated](/docs/en/about-claude/model-deprecations))  | $7.50 / MTok     | $37.50 / MTok   |
| Claude Haiku 3    | $0.125 / MTok    | $0.625 / MTok   |

有关批处理的更多信息，请参阅我们的[批处理文档](/docs/zh-CN/build-with-claude/batch-processing)。

### 长上下文定价

使用 Claude Sonnet 4 或 Sonnet 4.5 并[启用 1M 令牌上下文窗口](/docs/zh-CN/build-with-claude/context-windows#1m-token-context-window)时，超过 200K 输入令牌的请求将自动按高级长上下文费率计费：

<Note>
1M 令牌上下文窗口目前处于测试阶段，适用于[使用层级](/docs/zh-CN/api/rate-limits) 4 中的组织和具有自定义速率限制的组织。1M 令牌上下文窗口仅适用于 Claude Sonnet 4 和 Sonnet 4.5。
</Note>

| ≤ 200K 输入令牌 | > 200K 输入令牌 |
|-----------------------------------|-------------------------------------|
| 输入：$3 / MTok | 输入：$6 / MTok |
| 输出：$15 / MTok | 输出：$22.50 / MTok |

长上下文定价与其他定价修饰符叠加：
- [Batch API 50% 折扣](#batch-processing)适用于长上下文定价
- [提示缓存倍数](#model-pricing)适用于长上下文定价之上

<Note>
即使启用了测试标志，少于 200K 输入令牌的请求也按标准费率计费。如果您的请求超过 200K 输入令牌，所有令牌将按高级定价计费。

200K 阈值仅基于输入令牌（包括缓存读取/写入）。输出令牌计数不影响定价层级选择，但当输入阈值超过时，输出令牌按更高费率计费。
</Note>

要检查您的 API 请求是否按 1M 上下文窗口费率计费，请检查 API 响应中的 `usage` 对象：

```json
{
  "usage": {
    "input_tokens": 250000,
    "cache_creation_input_tokens": 0,
    "cache_read_input_tokens": 0,
    "output_tokens": 500
  }
}
```

通过求和计算总输入令牌：
- `input_tokens`
- `cache_creation_input_tokens`（如果使用提示缓存）
- `cache_read_input_tokens`（如果使用提示缓存）

如果总数超过 200,000 个令牌，整个请求将按 1M 上下文费率计费。

有关 `usage` 对象的更多信息，请参阅 [API 响应文档](/docs/zh-CN/api/messages#response-usage)。

### 工具使用定价

Tool use requests are priced based on:
1. The total number of input tokens sent to the model (including in the `tools` parameter)
2. The number of output tokens generated
3. For server-side tools, additional usage-based pricing (e.g., web search charges per search performed)

Client-side tools are priced the same as any other Claude API request, while server-side tools may incur additional charges based on their specific usage.

The additional tokens from tool use come from:

- The `tools` parameter in API requests (tool names, descriptions, and schemas)
- `tool_use` content blocks in API requests and responses
- `tool_result` content blocks in API requests

When you use `tools`, we also automatically include a special system prompt for the model which enables tool use. The number of tool use tokens required for each model are listed below (excluding the additional tokens listed above). Note that the table assumes at least 1 tool is provided. If no `tools` are provided, then a tool choice of `none` uses 0 additional system prompt tokens.

| Model                    | Tool choice                                          | Tool use system prompt token count          |
|--------------------------|------------------------------------------------------|---------------------------------------------|
| Claude Opus 4.5            | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Opus 4.1            | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Opus 4            | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Sonnet 4.5          | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Sonnet 4          | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations))        | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Haiku 4.5         | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Haiku 3.5         | `auto`, `none`<hr />`any`, `tool`   | 264 tokens<hr />340 tokens |
| Claude Opus 3 ([deprecated](/docs/en/about-claude/model-deprecations))            | `auto`, `none`<hr />`any`, `tool`   | 530 tokens<hr />281 tokens |
| Claude Sonnet 3          | `auto`, `none`<hr />`any`, `tool`   | 159 tokens<hr />235 tokens |
| Claude Haiku 3           | `auto`, `none`<hr />`any`, `tool`   | 264 tokens<hr />340 tokens |

These token counts are added to your normal input and output tokens to calculate the total cost of a request.

如需当前的每个模型价格，请参阅上面的[模型定价](#model-pricing)部分。

有关工具使用实现和最佳实践的更多信息，请参阅我们的[工具使用文档](/docs/zh-CN/agents-and-tools/tool-use/overview)。

### 特定工具定价

#### Bash 工具

The bash tool adds **245 input tokens** to your API calls.

Additional tokens are consumed by:
- Command outputs (stdout/stderr)
- Error messages
- Large file contents

有关完整定价详情，请参阅[工具使用定价](#tool-use-pricing)。

#### 代码执行工具

Code execution tool usage is tracked separately from token usage. Execution time has a minimum of 5 minutes.
If files are included in the request, execution time is billed even if the tool is not used due to files being preloaded onto the container.

Each organization receives 50 free hours of usage with the code execution tool per day. Additional usage beyond the first 50 hours is billed at $0.05 per hour, per container.

#### 文本编辑器工具

The text editor tool uses the same pricing structure as other tools used with Claude. It follows the standard input and output token pricing based on the Claude model you're using.

In addition to the base tokens, the following additional input tokens are needed for the text editor tool:

| Tool | Additional input tokens |
| ----------------------------------------- | --------------------------------------- |
| `text_editor_20250429` (Claude 4.x) | 700 tokens |
| `text_editor_20250124` (Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations))) | 700 tokens |

有关完整定价详情，请参阅[工具使用定价](#tool-use-pricing)。

#### 网络搜索工具

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

#### 网络获取工具

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

#### 计算机使用工具

Computer use follows the standard [tool use pricing](/docs/en/agents-and-tools/tool-use/overview#pricing). When using the computer use tool:

**System prompt overhead**: The computer use beta adds 466-499 tokens to the system prompt

**Computer use tool token usage**:
| Model | Input tokens per tool definition |
| ----- | -------------------------------- |
| Claude 4.x models | 735 tokens |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations)) | 735 tokens |

**Additional token consumption**:
- Screenshot images (see [Vision pricing](/docs/en/build-with-claude/vision))
- Tool execution results returned to Claude

<Note>
If you're also using bash or text editor tools alongside computer use, those tools have their own token costs as documented in their respective pages.
</Note>

## 代理用例定价示例

在使用 Claude 构建时，理解代理应用的定价至关重要。这些真实示例可以帮助您估计不同代理模式的成本。

### 客户支持代理示例

构建客户支持代理时，成本可能如下分解：

<Note>
  处理 10,000 个支持工单的示例计算：
  - 每次对话平均约 3,700 个令牌
  - 使用 Claude Sonnet 4.5，输入 $3/MTok，输出 $15/MTok
  - 总成本：每 10,000 个工单约 $22.20
</Note>

有关此计算的详细演练，请参阅我们的[客户支持代理指南](/docs/zh-CN/about-claude/use-case-guides/customer-support-chat)。

### 通用代理工作流定价

对于具有多个步骤的更复杂代理架构：

1. **初始请求处理**
   - 典型输入：500-1,000 个令牌
   - 处理成本：每个请求约 $0.003

2. **内存和上下文检索**
   - 检索的上下文：2,000-5,000 个令牌
   - 每次检索成本：每次操作约 $0.015

3. **操作规划和执行**
   - 规划令牌：1,000-2,000
   - 执行反馈：500-1,000
   - 合并成本：每个操作约 $0.045

有关代理定价模式的综合指南，请参阅我们的[代理用例指南](/docs/zh-CN/about-claude/use-case-guides)。

### 成本优化策略

使用 Claude 构建代理时：

1. **使用适当的模型**：为简单任务选择 Haiku，为复杂推理选择 Sonnet
2. **实现提示缓存**：减少重复上下文的成本
3. **批量操作**：对非时间敏感的任务使用 Batch API
4. **监控使用模式**：跟踪令牌消耗以识别优化机会

<Tip>
  对于大容量代理应用，请考虑联系我们的[企业销售团队](https://claude.com/contact-sales)以获取自定义定价安排。
</Tip>

## 其他定价考虑

### 速率限制

速率限制因使用层级而异，影响您可以发出的请求数量：

- **第 1 层**：入门级使用，基本限制
- **第 2 层**：为增长中的应用增加限制
- **第 3 层**：为已建立的应用提供更高限制
- **第 4 层**：最大标准限制
- **企业**：可用自定义限制

有关详细的速率限制信息，请参阅我们的[速率限制文档](/docs/zh-CN/api/rate-limits)。

如需更高的速率限制或自定义定价安排，请[联系我们的销售团队](https://claude.com/contact-sales)。

### 批量折扣

大容量用户可能获得批量折扣。这些折扣按个案协商。

- 标准层级使用上述定价
- 企业客户可以[联系销售](mailto:sales@anthropic.com)获取自定义定价
- 学术和研究折扣可能可用

### 企业定价

对于具有特定需求的企业客户：

- 自定义速率限制
- 批量折扣
- 专属支持
- 自定义条款

通过 [sales@anthropic.com](mailto:sales@anthropic.com) 或 [Claude Console](/settings/limits) 联系我们的销售团队，讨论企业定价选项。

## 计费和付款

- 计费按月根据实际使用情况计算
- 付款以美元处理
- 提供信用卡和发票选项
- 使用情况跟踪可在 [Claude Console](/) 中获得

## 常见问题

**令牌使用如何计算？**

令牌是模型处理的文本片段。粗略估计，1 个令牌约等于英文中的 4 个字符或 0.75 个单词。确切计数因语言和内容类型而异。

**是否有免费层级或试用？**

新用户获得少量免费积分来测试 API。[联系销售](mailto:sales@anthropic.com)了解有关企业评估的扩展试用信息。

**折扣如何叠加？**

Batch API 和提示缓存折扣可以组合。例如，同时使用两个功能相比标准 API 调用可提供显著的成本节省。

**接受哪些付款方式？**

我们为标准账户接受主要信用卡。企业客户可以安排发票和其他付款方式。

如有关于定价的其他问题，请联系 [support@anthropic.com](mailto:support@anthropic.com)。