# 功能概览

探索 Claude 的高级功能和能力。

---

## 核心功能

这些功能增强了 Claude 在各种格式和用例中处理、分析和生成内容的基本能力。

| 功能 | 描述 | 可用性 |
|---------|-------------|--------------|
| [100 万 token 上下文窗口](/docs/zh-CN/build-with-claude/context-windows#1m-token-context-window) | 扩展的上下文窗口，允许您处理更大的文档、维持更长的对话，并使用更广泛的代码库。 | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [Agent Skills](/docs/zh-CN/agents-and-tools/agent-skills/overview) | 使用 Skills 扩展 Claude 的功能。使用预构建的 Skills（PowerPoint、Excel、Word、PDF）或使用说明和脚本创建自定义 Skills。Skills 使用渐进式披露来有效管理上下文。 | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [批处理](/docs/zh-CN/build-with-claude/batch-processing) | 异步处理大量请求以节省成本。发送包含大量查询的批次。批处理 API 调用的成本比标准 API 调用低 50%。 | <PlatformAvailability claudeApi bedrock vertexAi /> |
| [引用](/docs/zh-CN/build-with-claude/citations) | 在源文档中基于 Claude 的响应。使用引用，Claude 可以提供对它用来生成响应的确切句子和段落的详细参考，从而产生更可验证、更值得信赖的输出。 | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [上下文编辑](/docs/zh-CN/build-with-claude/context-editing) | 使用可配置的策略自动管理对话上下文。支持在接近 token 限制时清除工具结果，以及在扩展思考对话中管理思考块。 | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [工作量](/docs/zh-CN/build-with-claude/effort) | 使用工作量参数控制 Claude 在响应时使用多少 token，在响应彻底性和 token 效率之间进行权衡。 | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [扩展思考](/docs/zh-CN/build-with-claude/extended-thinking) | 针对复杂任务的增强推理能力，在提供最终答案之前提供对 Claude 逐步思考过程的透明度。 | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Files API](/docs/zh-CN/build-with-claude/files) | 上传和管理文件以与 Claude 一起使用，无需在每个请求中重新上传内容。支持 PDF、图像和文本文件。 | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [PDF 支持](/docs/zh-CN/build-with-claude/pdf-support) | 处理和分析 PDF 文档中的文本和视觉内容。 | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [提示缓存 (5 分钟)](/docs/zh-CN/build-with-claude/prompt-caching) | 为 Claude 提供更多背景知识和示例输出，以降低成本和延迟。 | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [提示缓存 (1 小时)](/docs/zh-CN/build-with-claude/prompt-caching#1-hour-cache-duration) | 扩展的 1 小时缓存持续时间，用于不经常访问但重要的上下文，补充标准的 5 分钟缓存。 | <PlatformAvailability claudeApi azureAi /> |
| [搜索结果](/docs/zh-CN/build-with-claude/search-results) | 通过提供具有适当源属性的搜索结果，为 RAG 应用程序启用自然引用。为自定义知识库和工具实现网络搜索质量的引用。 | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [结构化输出](/docs/zh-CN/build-with-claude/structured-outputs) | 通过两种方法保证模式一致性：用于结构化数据响应的 JSON 输出，以及用于验证工具输入的严格工具使用。在 Sonnet 4.5、Opus 4.1、Opus 4.5 和 Haiku 4.5 上可用。 | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [Token 计数](/docs/zh-CN/api/messages-count-tokens) | Token 计数使您能够在将消息发送给 Claude 之前确定消息中的 token 数量，帮助您对提示和使用做出明智的决定。 | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [工具使用](/docs/zh-CN/agents-and-tools/tool-use/overview) | 使 Claude 能够与外部工具和 API 交互，以执行更广泛的任务。有关支持的工具列表，请参阅[工具表](#tools)。 | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |

## 工具

这些功能使 Claude 能够通过各种工具接口与外部系统交互、执行代码和执行自动化任务。

| 功能 | 描述 | 可用性 |
|---------|-------------|--------------|
| [Bash](/docs/zh-CN/agents-and-tools/tool-use/bash-tool) | 执行 bash 命令和脚本以与系统 shell 交互并执行命令行操作。 | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [代码执行](/docs/zh-CN/agents-and-tools/tool-use/code-execution-tool) | 在沙箱环境中运行 Python 代码以进行高级数据分析。 | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [程序化工具调用](/docs/zh-CN/agents-and-tools/tool-use/programmatic-tool-calling) | 使 Claude 能够从代码执行容器中以编程方式调用您的工具，减少多工具工作流的延迟和 token 消耗。 | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [计算机使用](/docs/zh-CN/agents-and-tools/tool-use/computer-use-tool) | 通过截图和发出鼠标和键盘命令来控制计算机界面。 | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [细粒度工具流](/docs/zh-CN/agents-and-tools/tool-use/fine-grained-tool-streaming) | 流式传输工具使用参数而不进行缓冲/JSON 验证，减少接收大型参数的延迟。 | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [MCP 连接器](/docs/zh-CN/agents-and-tools/mcp-connector) | 直接从 Messages API 连接到远程 [MCP](/docs/zh-CN/mcp) 服务器，无需单独的 MCP 客户端。 | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [内存](/docs/zh-CN/agents-and-tools/tool-use/memory-tool) | 使 Claude 能够跨对话存储和检索信息。随着时间的推移构建知识库、维持项目上下文并从过去的交互中学习。 | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [文本编辑器](/docs/zh-CN/agents-and-tools/tool-use/text-editor-tool) | 使用内置文本编辑器界面创建和编辑文本文件以执行文件操作任务。 | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [工具搜索](/docs/zh-CN/agents-and-tools/tool-use/tool-search-tool) | 通过使用基于正则表达式的搜索动态发现和按需加载工具，扩展到数千个工具，优化上下文使用并改进工具选择准确性。 | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [网页获取](/docs/zh-CN/agents-and-tools/tool-use/web-fetch-tool) | 从指定的网页和 PDF 文档中检索完整内容以进行深入分析。 | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [网络搜索](/docs/zh-CN/agents-and-tools/tool-use/web-search-tool) | 使用来自网络各地的当前、真实世界的数据增强 Claude 的全面知识。 | <PlatformAvailability claudeApi vertexAi azureAi /> |