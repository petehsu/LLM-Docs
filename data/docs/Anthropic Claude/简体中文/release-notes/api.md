# Claude 开发者平台

Claude 开发者平台的更新，包括 Claude API、客户端 SDK 和 Claude 控制台。

---

<Tip>
有关 Claude Apps 的发布说明，请参阅 [Claude 帮助中心中的 Claude Apps 发布说明](https://support.claude.com/en/articles/12138966-release-notes)。

有关 Claude Code 的更新，请参阅 `claude-code` 存储库中的[完整 CHANGELOG.md](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)。
</Tip>

### 2025 年 12 月 4 日
- [结构化输出](/docs/zh-CN/build-with-claude/structured-outputs)现在支持 Claude Haiku 4.5。

### 2025 年 11 月 24 日
- 我们推出了 [Claude Opus 4.5](https://www.anthropic.com/news/claude-opus-4-5)，这是我们最智能的模型，结合了最大的能力和实用的性能。非常适合复杂的专业任务、专业软件工程和高级代理。在视觉、编码和计算机使用方面具有阶跃式改进，价格比之前的 Opus 模型更便宜。在我们的[模型和定价文档](/docs/zh-CN/about-claude/models)中了解更多信息。
- 我们推出了[程序化工具调用](/docs/zh-CN/agents-and-tools/tool-use/programmatic-tool-calling)的公开测试版，允许 Claude 从代码执行中调用工具，以减少多工具工作流中的延迟和令牌使用。
- 我们推出了[工具搜索工具](/docs/zh-CN/agents-and-tools/tool-use/tool-search-tool)的公开测试版，使 Claude 能够从大型工具目录中动态发现和按需加载工具。
- 我们为 Claude Opus 4.5 推出了[努力参数](/docs/zh-CN/build-with-claude/effort)的公开测试版，允许您通过在响应彻底性和效率之间进行权衡来控制令牌使用。
- 我们在 Python 和 TypeScript SDK 中添加了[客户端压缩](/docs/zh-CN/build-with-claude/context-editing#client-side-compaction-sdk)，在使用 `tool_runner` 时通过摘要自动管理对话上下文。

### 2025 年 11 月 21 日
- 搜索结果内容块现在在 Amazon Bedrock 上普遍可用。在我们的[搜索结果文档](/docs/zh-CN/build-with-claude/search-results)中了解更多信息。

### 2025 年 11 月 19 日
- 我们在 [platform.claude.com/docs](https://platform.claude.com/docs) 推出了**新的文档平台**。我们的文档现在与 Claude 控制台并排存在，提供统一的开发者体验。之前位于 docs.claude.com 的文档网站将重定向到新位置。

### 2025 年 11 月 18 日
- 我们推出了 **Claude in Microsoft Foundry**，为 Azure 客户提供 Claude 模型，支持 Azure 计费和 OAuth 身份验证。访问完整的 Messages API，包括扩展思考、提示缓存（5 分钟和 1 小时）、PDF 支持、Files API、Agent Skills 和工具使用。在我们的 [Microsoft Foundry 文档](/docs/zh-CN/build-with-claude/claude-in-microsoft-foundry)中了解更多信息。

### 2025 年 11 月 14 日
- 我们推出了[结构化输出](/docs/zh-CN/build-with-claude/structured-outputs)的公开测试版，为 Claude 的响应提供保证的模式一致性。使用 JSON 输出获得结构化数据响应，或使用严格工具使用获得验证的工具输入。适用于 Claude Sonnet 4.5 和 Claude Opus 4.1。要启用，请使用测试版标头 `structured-outputs-2025-11-13`。

### 2025 年 10 月 28 日
- 我们宣布了 Claude Sonnet 3.7 模型的弃用。在[我们的文档](/docs/zh-CN/about-claude/model-deprecations)中了解更多信息。
- 我们已停用 Claude Sonnet 3.5 模型。对这些模型的所有请求现在都将返回错误。
- 我们扩展了上下文编辑，添加了思考块清除（`clear_thinking_20251015`），实现了思考块的自动管理。在我们的[上下文编辑文档](/docs/zh-CN/build-with-claude/context-editing)中了解更多信息。

### 2025 年 10 月 16 日
- 我们推出了 [Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)（`skills-2025-10-02` 测试版），这是扩展 Claude 功能的新方式。Skills 是指令、脚本和资源的有组织的文件夹，Claude 动态加载这些文件夹以执行专业任务。初始版本包括：
  - **Anthropic 管理的 Skills**：用于处理 PowerPoint (.pptx)、Excel (.xlsx)、Word (.docx) 和 PDF 文件的预构建 Skills
  - **自定义 Skills**：通过 Skills API（`/v1/skills` 端点）上传您自己的 Skills，以打包域专业知识和组织工作流
  - Skills 需要启用[代码执行工具](/docs/zh-CN/agents-and-tools/tool-use/code-execution-tool)
  - 在我们的 [Agent Skills 文档](/docs/zh-CN/agents-and-tools/agent-skills/overview)和 [API 参考](/docs/zh-CN/api/skills/create-skill)中了解更多信息

### 2025 年 10 月 15 日
- 我们推出了 [Claude Haiku 4.5](https://www.anthropic.com/news/claude-haiku-4-5)，这是我们最快、最智能的 Haiku 模型，具有接近前沿的性能。非常适合实时应用、高容量处理和需要强大推理能力的成本敏感部署。在我们的[模型和定价文档](/docs/zh-CN/about-claude/models)中了解更多信息。

### 2025 年 9 月 29 日
- 我们推出了 [Claude Sonnet 4.5](https://www.anthropic.com/news/claude-sonnet-4-5)，这是我们最适合复杂代理和编码的模型，在大多数任务中具有最高的智能。在[Claude 4.5 中的新功能](/docs/zh-CN/about-claude/models/whats-new-claude-4-5)中了解更多信息。
- 我们为 AWS Bedrock 和 Google Vertex AI 引入了[全球端点定价](/docs/zh-CN/about-claude/pricing#third-party-platform-pricing)。Claude API (1P) 定价不受影响。
- 我们引入了一个新的停止原因 `model_context_window_exceeded`，允许您请求最大可能的令牌，而无需计算输入大小。在我们的[处理停止原因文档](/docs/zh-CN/build-with-claude/handling-stop-reasons)中了解更多信息。
- 我们推出了内存工具的测试版，使 Claude 能够在对话中存储和查阅信息。在我们的[内存工具文档](/docs/zh-CN/agents-and-tools/tool-use/memory-tool)中了解更多信息。
- 我们推出了上下文编辑的测试版，提供自动管理对话上下文的策略。初始版本支持在接近令牌限制时清除较旧的工具结果和调用。在我们的[上下文编辑文档](/docs/zh-CN/build-with-claude/context-editing)中了解更多信息。

### 2025 年 9 月 17 日
- 我们为 Python 和 TypeScript SDK 推出了工具助手的测试版，通过类型安全的输入验证和用于对话中自动化工具处理的工具运行器简化了工具创建和执行。有关详细信息，请参阅 [Python SDK](https://github.com/anthropics/anthropic-sdk-python/blob/main/tools.md) 和 [TypeScript SDK](https://github.com/anthropics/anthropic-sdk-typescript/blob/main/helpers.md#tool-helpers) 的文档。

### 2025 年 9 月 16 日
- 我们在 Claude 品牌下统一了我们的开发者产品。您应该在我们的平台和文档中看到更新的命名和 URL，但**我们的开发者界面将保持不变**。以下是一些值得注意的变化：
  - Anthropic 控制台 ([console.anthropic.com](https://console.anthropic.com)) → Claude 控制台 ([platform.claude.com](https://platform.claude.com))。控制台将在两个 URL 上可用，直到 2025 年 12 月 16 日。在该日期之后，[console.anthropic.com](https://console.anthropic.com) 将自动重定向到 [platform.claude.com](https://platform.claude.com)。
  - Anthropic 文档 ([docs.claude.com](https://docs.claude.com)) → Claude 文档 ([docs.claude.com](https://docs.claude.com))
  - Anthropic 帮助中心 ([support.claude.com](https://support.claude.com)) → Claude 帮助中心 ([support.claude.com](https://support.claude.com))
  - API 端点、标头、环境变量和 SDK 保持不变。您现有的集成将继续工作，无需任何更改。

### 2025 年 9 月 10 日
- 我们推出了网络获取工具的测试版，允许 Claude 从指定的网页和 PDF 文档中检索完整内容。在我们的[网络获取工具文档](/docs/zh-CN/agents-and-tools/tool-use/web-fetch-tool)中了解更多信息。
- 我们推出了 [Claude Code 分析 API](/docs/zh-CN/build-with-claude/claude-code-analytics-api)，使组织能够以编程方式访问 Claude Code 的每日聚合使用指标，包括生产力指标、工具使用统计和成本数据。

### 2025 年 9 月 8 日
- 我们推出了 [C# SDK](https://github.com/anthropics/anthropic-sdk-csharp) 的测试版。

### 2025 年 9 月 5 日
- 我们在控制台[使用情况](https://console.anthropic.com/settings/usage)页面推出了[速率限制图表](/docs/zh-CN/api/rate-limits#monitoring-your-rate-limits-in-the-console)，允许您监控 API 速率限制使用和缓存速率随时间的变化。

### 2025 年 9 月 3 日
- 我们推出了对客户端工具结果中可引用文档的支持。在我们的[工具使用文档](/docs/zh-CN/agents-and-tools/tool-use/implement-tool-use)中了解更多信息。

### 2025 年 9 月 2 日
- 我们推出了[代码执行工具](/docs/zh-CN/agents-and-tools/tool-use/code-execution-tool)的 v2 版本的公开测试版，用 Bash 命令执行和直接文件操作功能（包括用其他语言编写代码）替换了原始的仅 Python 工具。

### 2025 年 8 月 27 日
- 我们推出了 [PHP SDK](https://github.com/anthropics/anthropic-sdk-php) 的测试版。

### 2025 年 8 月 26 日
- 我们提高了 Claude API 上 Claude Sonnet 4 的[1M 令牌上下文窗口](/docs/zh-CN/build-with-claude/context-windows#1m-token-context-window)的速率限制。有关更多信息，请参阅[长上下文速率限制](/docs/zh-CN/api/rate-limits#long-context-rate-limits)。
- 1m 令牌上下文窗口现在在 Google Cloud 的 Vertex AI 上可用。有关更多信息，请参阅 [Claude on Vertex AI](/docs/zh-CN/build-with-claude/claude-on-vertex-ai)。

### 2025 年 8 月 19 日
- 请求 ID 现在直接包含在错误响应体中，与现有的 `request-id` 标头一起。在我们的[错误文档](/docs/zh-CN/api/errors#error-shapes)中了解更多信息。

### 2025 年 8 月 18 日
- 我们发布了[使用情况和成本 API](/docs/zh-CN/build-with-claude/usage-cost-api)，允许管理员以编程方式监控其组织的使用情况和成本数据。
- 我们向管理 API 添加了一个新端点，用于检索组织信息。有关详细信息，请参阅[组织信息管理 API 参考](/docs/zh-CN/api/admin-api/organization/get-me)。

### 2025 年 8 月 13 日
- 我们宣布了 Claude Sonnet 3.5 模型（`claude-3-5-sonnet-20240620` 和 `claude-3-5-sonnet-20241022`）的弃用。这些模型将在 2025 年 10 月 28 日停用。我们建议迁移到 Claude Sonnet 4.5（`claude-sonnet-4-5-20250929`）以获得改进的性能和功能。在[模型弃用文档](/docs/zh-CN/about-claude/model-deprecations)中了解更多信息。
- 提示缓存的 1 小时缓存持续时间现在普遍可用。您现在可以使用扩展缓存 TTL，无需测试版标头。在我们的[提示缓存文档](/docs/zh-CN/build-with-claude/prompt-caching#1-hour-cache-duration)中了解更多信息。

### 2025 年 8 月 12 日
- 我们在 Claude API 和 Amazon Bedrock 上的 Claude Sonnet 4 中推出了[1M 令牌上下文窗口](/docs/zh-CN/build-with-claude/context-windows#1m-token-context-window)的测试版支持。

### 2025 年 8 月 11 日
- 由于 API 使用量急剧增加导致加速限制，某些客户可能会遇到 429（`rate_limit_error`）[错误](/docs/zh-CN/api/errors)。以前，在类似情况下会发生 529（`overloaded_error`）错误。

### 2025 年 8 月 8 日
- 搜索结果内容块现在在 Claude API 和 Google Cloud 的 Vertex AI 上普遍可用。此功能为 RAG 应用程序启用了自然引用，具有适当的来源归属。不再需要测试版标头 `search-results-2025-06-09`。在我们的[搜索结果文档](/docs/zh-CN/build-with-claude/search-results)中了解更多信息。

### 2025 年 8 月 5 日
- 我们推出了 [Claude Opus 4.1](https://www.anthropic.com/news/claude-opus-4-1)，这是对 Claude Opus 4 的增量更新，具有增强的功能和性能改进。<sup>*</sup> 在我们的[模型和定价文档](/docs/zh-CN/about-claude/models)中了解更多信息。

_<sup>* - Opus 4.1 不允许同时指定 `temperature` 和 `top_p` 参数。请仅使用其中一个。 </sup>_

### 2025 年 7 月 28 日
- 我们发布了 `text_editor_20250728`，这是一个更新的文本编辑器工具，修复了之前版本的一些问题，并添加了一个可选的 `max_characters` 参数，允许您在查看大文件时控制截断长度。

### 2025 年 7 月 24 日
- 我们提高了 Claude API 上 Claude Opus 4 的[速率限制](/docs/zh-CN/api/rate-limits)，以便您有更多容量来构建和扩展 Claude。对于具有[使用层 1-4 速率限制](/docs/zh-CN/api/rate-limits#rate-limits)的客户，这些更改立即应用于您的帐户 - 无需采取任何行动。

### 2025 年 7 月 21 日
- 我们已停用 Claude 2.0、Claude 2.1 和 Claude Sonnet 3 模型。对这些模型的所有请求现在都将返回错误。在[我们的文档](/docs/zh-CN/about-claude/model-deprecations)中了解更多信息。

### 2025 年 7 月 17 日
- 我们提高了 Claude API 上 Claude Sonnet 4 的[速率限制](/docs/zh-CN/api/rate-limits)，以便您有更多容量来构建和扩展 Claude。对于具有[使用层 1-4 速率限制](/docs/zh-CN/api/rate-limits#rate-limits)的客户，这些更改立即应用于您的帐户 - 无需采取任何行动。

### 2025 年 7 月 3 日
- 我们推出了搜索结果内容块的测试版，为 RAG 应用程序启用自然引用。工具现在可以返回具有适当来源归属的搜索结果，Claude 将自动在其响应中引用这些来源 - 与网络搜索的引用质量相匹配。这消除了在自定义知识库应用程序中需要文档变通方法的需要。在我们的[搜索结果文档](/docs/zh-CN/build-with-claude/search-results)中了解更多信息。要启用此功能，请使用测试版标头 `search-results-2025-06-09`。

### 2025 年 6 月 30 日
- 我们宣布了 Claude Opus 3 模型的弃用。在[我们的文档](/docs/zh-CN/about-claude/model-deprecations)中了解更多信息。

### 2025 年 6 月 23 日
- 具有开发者角色的控制台用户现在可以访问[成本](https://console.anthropic.com/settings/cost)页面。以前，开发者角色允许访问[使用情况](https://console.anthropic.com/settings/usage)页面，但不允许访问成本页面。

### 2025 年 6 月 11 日
- 我们推出了[细粒度工具流](/docs/zh-CN/agents-and-tools/tool-use/fine-grained-tool-streaming)的公开测试版，这是一项使 Claude 能够流式传输工具使用参数而无需缓冲/JSON 验证的功能。要启用细粒度工具流，请使用[测试版标头](/docs/zh-CN/api/beta-headers) `fine-grained-tool-streaming-2025-05-14`。

### 2025 年 5 月 22 日
- 我们推出了 [Claude Opus 4 和 Claude Sonnet 4](http://www.anthropic.com/news/claude-4)，我们最新的具有扩展思考功能的模型。在我们的[模型和定价文档](/docs/zh-CN/about-claude/models)中了解更多信息。
- [Claude 4 模型中扩展思考](/docs/zh-CN/build-with-claude/extended-thinking)的默认行为返回 Claude 完整思考过程的摘要，完整思考被加密并在 `thinking` 块输出的 `signature` 字段中返回。
- 我们推出了[交错思考](/docs/zh-CN/build-with-claude/extended-thinking#interleaved-thinking)的公开测试版，这是一项使 Claude 能够在工具调用之间思考的功能。要启用交错思考，请使用[测试版标头](/docs/zh-CN/api/beta-headers) `interleaved-thinking-2025-05-14`。
- 我们推出了[Files API](/docs/zh-CN/build-with-claude/files)的公开测试版，使您能够上传文件并在 Messages API 和代码执行工具中引用它们。
- 我们推出了[代码执行工具](/docs/zh-CN/agents-and-tools/tool-use/code-execution-tool)的公开测试版，这是一个使 Claude 能够在安全的沙箱环境中执行 Python 代码的工具。
- 我们推出了 [MCP 连接器](/docs/zh-CN/agents-and-tools/mcp-connector)的公开测试版，这是一项允许您直接从 Messages API 连接到远程 MCP 服务器的功能。
- 为了提高答案质量并减少工具错误，我们将 Messages API 中 `top_p` [核采样](https://en.wikipedia.org/wiki/Top-p_sampling)参数的默认值从 0.999 更改为 0.99，适用于所有模型。要恢复此更改，请将 `top_p` 设置为 0.999。
    此外，启用扩展思考时，您现在可以将 `top_p` 设置为 0.95 到 1 之间的值。
- 我们将 [Go SDK](https://github.com/anthropics/anthropic-sdk-go) 从测试版移至 GA。
- 我们在控制台的[使用情况](https://console.anthropic.com/settings/usage)页面中添加了分钟和小时级别的粒度，以及使用情况页面上的 429 错误率。

### 2025 年 5 月 21 日
- 我们将 [Ruby SDK](https://github.com/anthropics/anthropic-sdk-ruby) 从测试版移至 GA。

### 2025 年 5 月 7 日
- 我们在 API 中推出了网络搜索工具，允许 Claude 从网络访问最新信息。在我们的[网络搜索工具文档](/docs/zh-CN/agents-and-tools/tool-use/web-search-tool)中了解更多信息。

### 2025 年 5 月 1 日
- 缓存控制现在必须直接在 `tool_result` 和 `document.source` 的父 `content` 块中指定。为了向后兼容，如果在 `tool_result.content` 或 `document.source.content` 中的最后一个块上检测到缓存控制，它将自动应用于父块。`tool_result.content` 和 `document.source.content` 中任何其他块上的缓存控制将导致验证错误。

### 2025 年 4 月 9 日
- 我们推出了 [Ruby SDK](https://github.com/anthropics/anthropic-sdk-ruby) 的测试版

### 2025 年 3 月 31 日
- 我们将 [Java SDK](https://github.com/anthropics/anthropic-sdk-java) 从测试版移至 GA。
- 我们将 [Go SDK](https://github.com/anthropics/anthropic-sdk-go) 从 alpha 版移至测试版。

### 2025 年 2 月 27 日
- 我们为 Messages API 中的图像和 PDF 添加了 URL 源块。您现在可以直接通过 URL 引用图像和 PDF，而不必对其进行 base64 编码。在我们的[视觉文档](/docs/zh-CN/build-with-claude/vision)和 [PDF 支持文档](/docs/zh-CN/build-with-claude/pdf-support)中了解更多信息。
- 我们为 Messages API 中的 `tool_choice` 参数添加了对 `none` 选项的支持，该选项防止 Claude 调用任何工具。此外，在包含 `tool_use` 和 `tool_result` 块时，您不再需要提供任何 `tools`。
- 我们推出了 OpenAI 兼容的 API 端点，允许您通过仅更改现有 OpenAI 集成中的 API 密钥、基础 URL 和模型名称来测试 Claude 模型。此兼容性层支持核心聊天完成功能。在我们的 [OpenAI SDK 兼容性文档](/docs/zh-CN/api/openai-sdk)中了解更多信息。

### 2025 年 2 月 24 日
- 我们推出了 [Claude Sonnet 3.7](http://www.anthropic.com/news/claude-3-7-sonnet)，这是我们迄今为止最智能的模型。Claude Sonnet 3.7 可以产生近乎即时的响应或逐步展示其扩展思考。一个模型，两种思考方式。在我们的[模型和定价文档](/docs/zh-CN/about-claude/models)中了解所有 Claude 模型的更多信息。
- 我们为 Claude Haiku 3.5 添加了视觉支持，使该模型能够分析和理解图像。
- 我们发布了令牌高效的工具使用实现，在使用 Claude 工具时改进了整体性能。在我们的[工具使用文档](/docs/zh-CN/agents-and-tools/tool-use/overview)中了解更多信息。
- 我们将[控制台](https://console.anthropic.com/workbench)中新提示的默认温度从 0 更改为 1，以与 API 中的默认温度保持一致。现有保存的提示保持不变。
- 我们发布了更新版本的工具，将文本编辑和 bash 工具与计算机使用系统提示分离：
  - `bash_20250124`：与之前版本相同的功能，但独立于计算机使用。不需要测试版标头。
  - `text_editor_20250124`：与之前版本相同的功能，但独立于计算机使用。不需要测试版标头。
  - `computer_20250124`：更新的计算机使用工具，包含新的命令选项，包括"hold_key"、"left_mouse_down"、"left_mouse_up"、"scroll"、"triple_click"和"wait"。此工具需要"computer-use-2025-01-24"anthropic-beta 标头。
  在我们的[工具使用文档](/docs/zh-CN/agents-and-tools/tool-use/overview)中了解更多信息。

### 2025 年 2 月 10 日
- 我们向所有 API 响应添加了 `anthropic-organization-id` 响应标头。此标头提供与请求中使用的 API 密钥关联的组织 ID。

### 2025 年 1 月 31 日

- 我们将 [Java SDK](https://github.com/anthropics/anthropic-sdk-java) 从 alpha 版移至测试版。

### 2025 年 1 月 23 日

- 我们在 API 中推出了引用功能，允许 Claude 为信息提供来源归属。在我们的[引用文档](/docs/zh-CN/build-with-claude/citations)中了解更多信息。
- 我们在 Messages API 中添加了对纯文本文档和自定义内容文档的支持。

### 2025 年 1 月 21 日

- 我们宣布了 Claude 2、Claude 2.1 和 Claude Sonnet 3 模型的弃用。在[我们的文档](/docs/zh-CN/about-claude/model-deprecations)中了解更多信息。

### 2025 年 1 月 15 日

- 我们更新了[提示缓存](/docs/zh-CN/build-with-claude/prompt-caching)以使其更易于使用。现在，当您设置缓存断点时，我们将自动从您最长的先前缓存前缀读取。
- 使用工具时，您现在可以把话放在 Claude 的嘴里。

### 2025 年 1 月 10 日

- 我们优化了[消息批处理 API 中的提示缓存](/docs/zh-CN/build-with-claude/batch-processing#using-prompt-caching-with-message-batches)支持，以改进缓存命中率。

### 2024 年 12 月 19 日

- 我们在消息批处理 API 中添加了对[删除端点](/docs/zh-CN/api/deleting-message-batches)的支持

### 2024 年 12 月 17 日
以下功能现在在 Claude API 中普遍可用：

- [模型 API](/docs/zh-CN/api/models-list)：查询可用模型、验证模型 ID 并将[模型别名](/docs/zh-CN/about-claude/models#model-names)解析为其规范模型 ID。
- [消息批处理 API](/docs/zh-CN/build-with-claude/batch-processing)：以标准 API 成本的 50% 异步处理大批量消息。
- [令牌计数 API](/docs/zh-CN/build-with-claude/token-counting)：在将消息发送到 Claude 之前计算消息的令牌计数。
- [提示缓存](/docs/zh-CN/build-with-claude/prompt-caching)：通过缓存和重用提示内容，将成本降低高达 90%，延迟降低高达 80%。
- [PDF 支持](/docs/zh-CN/build-with-claude/pdf-support)：处理 PDF 以分析文档中的文本和视觉内容。

我们还发布了新的官方 SDK：
- [Java SDK](https://github.com/anthropics/anthropic-sdk-java)（alpha）
- [Go SDK](https://github.com/anthropics/anthropic-sdk-go)（alpha）

### 2024 年 12 月 4 日

- 我们添加了按 API 密钥分组的功能到[开发者控制台](https://console.anthropic.com)的[使用情况](https://console.anthropic.com/settings/usage)和[成本](https://console.anthropic.com/settings/cost)页面
- 我们在[开发者控制台](https://console.anthropic.com)的 [API 密钥](https://console.anthropic.com/settings/keys)页面中添加了两个新的**最后使用时间**和**成本**列，以及按任何列排序的功能

### 2024 年 11 月 21 日

- 我们发布了[管理 API](/docs/zh-CN/build-with-claude/administration-api)，允许用户以编程方式管理其组织的资源。

### 2024 年 11 月 20 日

- 我们更新了 Messages API 的速率限制。我们用新的输入和输出令牌每分钟速率限制替换了每分钟令牌速率限制。在我们的[文档](/docs/zh-CN/api/rate-limits)中了解更多信息。
- 我们在[工作台](https://console.anthropic.com/workbench)中添加了对[工具使用](/docs/zh-CN/agents-and-tools/tool-use/overview)的支持。

### 2024 年 11 月 13 日

- 我们为所有 Claude Sonnet 3.5 模型添加了 PDF 支持。在我们的[文档](/docs/zh-CN/build-with-claude/pdf-support)中了解更多信息。

### 2024 年 11 月 6 日

- 我们已停用 Claude 1 和 Instant 模型。在[我们的文档](/docs/zh-CN/about-claude/model-deprecations)中了解更多信息。

### 2024 年 11 月 4 日

- [Claude Haiku 3.5](https://www.anthropic.com/claude/haiku) 现在在 Claude API 上作为仅文本模型可用。

### 2024 年 11 月 1 日

- 我们为新的 Claude Sonnet 3.5 添加了 PDF 支持。在我们的[文档](/docs/zh-CN/build-with-claude/pdf-support)中了解更多信息。
- 我们还添加了令牌计数，这允许您在将消息发送到 Claude 之前确定消息中的总令牌数。在我们的[文档](/docs/zh-CN/build-with-claude/token-counting)中了解更多信息。

### 2024 年 10 月 22 日

- 我们为 API 添加了 Anthropic 定义的计算机使用工具，以与新的 Claude Sonnet 3.5 一起使用。在我们的[文档](/docs/zh-CN/agents-and-tools/tool-use/computer-use-tool)中了解更多信息。
- Claude Sonnet 3.5，我们迄今为止最智能的模型，刚刚得到升级，现在在 Claude API 上可用。在[此处](https://www.anthropic.com/claude/sonnet)了解更多信息。

### 2024 年 10 月 8 日

- 消息批处理 API 现在以测试版形式提供。在 Claude API 中异步处理大批量查询，成本降低 50%。在我们的[文档](/docs/zh-CN/build-with-claude/batch-processing)中了解更多信息。
- 我们放宽了对 Messages API 中 `user`/`assistant` 轮流顺序的限制。连续的 `user`/`assistant` 消息将合并为单个消息，而不是出错，我们不再要求第一条输入消息是 `user` 消息。
- 我们弃用了 Build 和 Scale 计划，转而采用标准功能套件（以前称为 Build），以及通过销售提供的其他功能。在[此处](https://claude.com/platform/api)了解更多信息。

### 2024 年 10 月 3 日

- 我们添加了在 API 中禁用并行工具使用的功能。在 `tool_choice` 字段中设置 `disable_parallel_tool_use: true` 以确保 Claude 最多使用一个工具。在我们的[文档](/docs/zh-CN/agents-and-tools/tool-use/implement-tool-use#parallel-tool-use)中了解更多信息。

### 2024 年 9 月 10 日

- 我们在[开发者控制台](https://console.anthropic.com)中添加了工作区。工作区允许您设置自定义支出或速率限制、分组 API 密钥、按项目跟踪使用情况并通过用户角色控制访问。在我们的[博客文章](https://www.anthropic.com/news/workspaces)中了解更多信息。

### 2024 年 9 月 4 日

- 我们宣布了 Claude 1 模型的弃用。在[我们的文档](/docs/zh-CN/about-claude/model-deprecations)中了解更多信息。

### 2024 年 8 月 22 日

- 我们通过在 API 响应中返回 CORS 标头来添加对在浏览器中使用 SDK 的支持。在 SDK 实例化中设置 `dangerouslyAllowBrowser: true` 以启用此功能。

### 2024 年 8 月 19 日

- 我们将 Claude Sonnet 3.5 的 8,192 令牌输出从测试版移至普遍可用。

### 2024 年 8 月 14 日

- [提示缓存](/docs/zh-CN/build-with-claude/prompt-caching)现在在 Claude API 中作为测试版功能提供。缓存和重用提示，将延迟降低高达 80%，成本降低高达 90%。

### 2024 年 7 月 15 日

- 使用新的 `anthropic-beta: max-tokens-3-5-sonnet-2024-07-15` 标头从 Claude Sonnet 3.5 生成长度高达 8,192 令牌的输出。

### 2024 年 7 月 9 日

- 在[开发者控制台](https://console.anthropic.com)中使用 Claude 自动为您的提示生成测试用例。
- 在[开发者控制台](https://console.anthropic.com)中的新输出比较模式中并排比较不同提示的输出。

### 2024 年 6 月 27 日

- 在[开发者控制台](https://console.anthropic.com)中的新[使用情况](https://console.anthropic.com/settings/usage)和[成本](https://console.anthropic.com/settings/cost)选项卡中查看按美元金额、令牌计数和 API 密钥分解的 API 使用情况和计费。
- 在[开发者控制台](https://console.anthropic.com)中的新[速率限制](https://console.anthropic.com/settings/limits)选项卡中查看您当前的 API 速率限制。

### 2024 年 6 月 20 日

- [Claude Sonnet 3.5](http://anthropic.com/news/claude-3-5-sonnet)，我们迄今为止最智能的模型，现在在 Claude API、Amazon Bedrock 和 Google Vertex AI 上普遍可用。

### 2024 年 5 月 30 日

- [工具使用](/docs/zh-CN/agents-and-tools/tool-use/overview)现在在 Claude API、Amazon Bedrock 和 Google Vertex AI 上普遍可用。

### 2024 年 5 月 10 日

- 我们的提示生成器工具现在在[开发者控制台](https://console.anthropic.com)中可用。提示生成器使您可以轻松指导 Claude 生成针对您的特定任务定制的高质量提示。在我们的[博客文章](https://www.anthropic.com/news/prompt-generator)中了解更多信息。