# 模型概览

Claude 是由 Anthropic 开发的最先进的大型语言模型系列。本指南介绍了我们的模型并比较了它们的性能。

---

## 选择模型

如果您不确定使用哪个模型，我们建议从 **Claude Sonnet 4.5** 开始。它为大多数用例提供了最佳的智能、速度和成本平衡，在编码和代理任务中表现出色。

所有当前的 Claude 模型都支持文本和图像输入、文本输出、多语言功能和视觉能力。模型可通过 Anthropic API、AWS Bedrock 和 Google Vertex AI 获得。

选择模型后，[了解如何进行第一次 API 调用](/docs/zh-CN/get-started)。

### 最新模型比较

| 功能 | Claude Sonnet 4.5 | Claude Haiku 4.5 | Claude Opus 4.5 |
|:--------|:------------------|:-----------------|:----------------|
| **描述** | 我们用于复杂代理和编码的智能模型 | 我们具有接近前沿智能的最快模型 | 结合最大智能与实际性能的高级模型 |
| **Claude API ID** | claude-sonnet-4-5-20250929 | claude-haiku-4-5-20251001 | claude-opus-4-5-20251101 |
| **Claude API 别名**<sup>1</sup> | claude-sonnet-4-5 | claude-haiku-4-5 | claude-opus-4-5 |
| **AWS Bedrock ID** | anthropic.claude-sonnet-4-5-20250929-v1:0 | anthropic.claude-haiku-4-5-20251001-v1:0 | anthropic.claude-opus-4-5-20251101-v1:0 |
| **GCP Vertex AI ID** | claude-sonnet-4-5@20250929 | claude-haiku-4-5@20251001 | claude-opus-4-5@20251101 |
| **定价**<sup>2</sup> | \$3 / 输入 MTok<br/>\$15 / 输出 MTok | \$1 / 输入 MTok<br/>\$5 / 输出 MTok | \$5 / 输入 MTok<br/>\$25 / 输出 MTok |
| **[扩展思考](/docs/zh-CN/build-with-claude/extended-thinking)** | 是 | 是 | 是 |
| **[优先级层级](/docs/zh-CN/api/service-tiers)** | 是 | 是 | 是 |
| **相对延迟** | 快速 | 最快 | 中等 |
| **上下文窗口** | <Tooltip tooltipContent="~150K 单词 \ ~680K unicode 字符">200K tokens</Tooltip> / <br/> <Tooltip tooltipContent="~750K 单词 \ ~3.4M unicode 字符">1M tokens</Tooltip> (beta)<sup>3</sup> | <Tooltip tooltipContent="~150K 单词 \ ~680K unicode 字符">200K tokens</Tooltip> | <Tooltip tooltipContent="~150K 单词 \ ~680K unicode 字符">200K tokens</Tooltip> |
| **最大输出** | 64K tokens | 64K tokens | 64K tokens |
| **可靠知识截断日期** | 2025 年 1 月<sup>4</sup> | 2025 年 2 月 | 2025 年 5 月<sup>4</sup> |
| **训练数据截断日期** | 2025 年 7 月 | 2025 年 7 月 | 2025 年 8 月 |

_<sup>1 - 别名自动指向最新的模型快照。当我们发布新的模型快照时，我们会在新发布后的一周内将别名迁移到指向最新版本的模型。虽然别名对于实验很有用，但我们建议在生产应用中使用特定的模型版本（例如 `claude-sonnet-4-5-20250929`）以确保一致的行为。</sup>_

_<sup>2 - 请参阅我们的[定价页面](/docs/zh-CN/about-claude/pricing)了解完整的定价信息，包括批处理 API 折扣、提示缓存费率、扩展思考成本和视觉处理费用。</sup>_

_<sup>3 - Claude Sonnet 4.5 在使用 `context-1m-2025-08-07` beta 标头时支持 [1M token 上下文窗口](/docs/zh-CN/build-with-claude/context-windows#1m-token-context-window)。[长上下文定价](/docs/zh-CN/about-claude/pricing#long-context-pricing)适用于超过 200K tokens 的请求。</sup>_

_<sup>4 - **可靠知识截断日期**表示模型知识最广泛和最可靠的日期。**训练数据截断日期**是使用的训练数据的更广泛的日期范围。例如，Claude Sonnet 4.5 在 2025 年 7 月之前的公开可用信息上进行了训练，但其知识在 2025 年 1 月之前最广泛和最可靠。有关更多信息，请参阅 [Anthropic 的透明度中心](https://www.anthropic.com/transparency)。</sup>_

<Note>具有相同快照日期（例如 20240620）的模型在所有平台上都是相同的，不会改变。模型名称中的快照日期确保了一致性，并允许开发人员依赖跨不同环境的稳定性能。</Note>

<Note>从 **Claude Sonnet 4.5 和所有未来的模型**开始，AWS Bedrock 和 Google Vertex AI 提供两种端点类型：**全局端点**（用于最大可用性的动态路由）和**区域端点**（通过特定地理区域的保证数据路由）。有关更多信息，请参阅[第三方平台定价部分](/docs/zh-CN/about-claude/pricing#third-party-platform-pricing)。</Note>

<section title="旧版模型">

以下模型仍然可用，但我们建议迁移到当前模型以获得改进的性能：

| 功能 | Claude Opus 4.1 | Claude Sonnet 4 | Claude Sonnet 3.7 | Claude Opus 4 | Claude Haiku 3.5 | Claude Haiku 3 |
|:--------|:----------------|:----------------|:------------------|:--------------|:-----------------|:---------------|
| **Claude API ID** | claude-opus-4-1-20250805 | claude-sonnet-4-20250514 | claude-3-7-sonnet-20250219 | claude-opus-4-20250514 | claude-3-5-haiku-20241022 | claude-3-haiku-20240307 |
| **Claude API 别名** | claude-opus-4-1 | claude-sonnet-4-0 | claude-3-7-sonnet-latest | claude-opus-4-0 | claude-3-5-haiku-latest | — |
| **AWS Bedrock ID** | anthropic.claude-opus-4-1-20250805-v1:0 | anthropic.claude-sonnet-4-20250514-v1:0 | anthropic.claude-3-7-sonnet-20250219-v1:0 | anthropic.claude-opus-4-20250514-v1:0 | anthropic.claude-3-5-haiku-20241022-v1:0 | anthropic.claude-3-haiku-20240307-v1:0 |
| **GCP Vertex AI ID** | claude-opus-4-1@20250805 | claude-sonnet-4@20250514 | claude-3-7-sonnet@20250219 | claude-opus-4@20250514 | claude-3-5-haiku@20241022 | claude-3-haiku@20240307 |
| **定价** | \$15 / 输入 MTok<br/>\$75 / 输出 MTok | \$3 / 输入 MTok<br/>\$15 / 输出 MTok | \$3 / 输入 MTok<br/>\$15 / 输出 MTok | \$15 / 输入 MTok<br/>\$75 / 输出 MTok | \$0.80 / 输入 MTok<br/>\$4 / 输出 MTok | \$0.25 / 输入 MTok<br/>\$1.25 / 输出 MTok |
| **[扩展思考](/docs/zh-CN/build-with-claude/extended-thinking)** | 是 | 是 | 是 | 是 | 否 | 否 |
| **[优先级层级](/docs/zh-CN/api/service-tiers)** | 是 | 是 | 是 | 是 | 是 | 否 |
| **相对延迟** | 中等 | 快速 | 快速 | 中等 | 最快 | 快速 |
| **上下文窗口** | <Tooltip tooltipContent="~150K 单词 \ ~680K unicode 字符">200K tokens</Tooltip> | <Tooltip tooltipContent="~150K 单词 \ ~680K unicode 字符">200K tokens</Tooltip> / <br/> <Tooltip tooltipContent="~750K 单词 \ ~3.4M unicode 字符">1M tokens</Tooltip> (beta)<sup>1</sup> | <Tooltip tooltipContent="~150K 单词 \ ~680K unicode 字符">200K tokens</Tooltip> | <Tooltip tooltipContent="~150K 单词 \ ~680K unicode 字符">200K tokens</Tooltip> | <Tooltip tooltipContent="~150K 单词 \ ~215K unicode 字符">200K tokens</Tooltip> | <Tooltip tooltipContent="~150K 单词 \ ~680K unicode 字符">200K tokens</Tooltip> |
| **最大输出** | 32K tokens | 64K tokens | 64K tokens / 128K tokens (beta)<sup>4</sup> | 32K tokens | 8K tokens | 4K tokens |
| **可靠知识截断日期** | 2025 年 1 月<sup>2</sup> | 2025 年 1 月<sup>2</sup> | 2024 年 10 月<sup>2</sup> | 2025 年 1 月<sup>2</sup> | <sup>3</sup> | <sup>3</sup> |
| **训练数据截断日期** | 2025 年 3 月 | 2025 年 3 月 | 2024 年 11 月 | 2025 年 3 月 | 2024 年 7 月 | 2023 年 8 月 |

_<sup>1 - Claude Sonnet 4 在使用 `context-1m-2025-08-07` beta 标头时支持 [1M token 上下文窗口](/docs/zh-CN/build-with-claude/context-windows#1m-token-context-window)。[长上下文定价](/docs/zh-CN/about-claude/pricing#long-context-pricing)适用于超过 200K tokens 的请求。</sup>_

_<sup>2 - **可靠知识截断日期**表示模型知识最广泛和最可靠的日期。**训练数据截断日期**是使用的训练数据的更广泛的日期范围。</sup>_

_<sup>3 - 某些 Haiku 模型有单一的训练数据截断日期。</sup>_

_<sup>4 - 在您的 API 请求中包含 beta 标头 `output-128k-2025-02-19` 以将 Claude Sonnet 3.7 的最大输出 token 长度增加到 128K tokens。我们强烈建议在生成较长输出时使用我们的[流式 Messages API](/docs/zh-CN/build-with-claude/streaming) 以避免超时。有关更多详情，请参阅我们关于[长请求](/docs/zh-CN/api/errors#long-requests)的指导。</sup>_

</section>

## 提示和输出性能

Claude 4 模型在以下方面表现出色：
- **性能**：在推理、编码、多语言任务、长上下文处理、诚实性和图像处理方面取得顶级结果。有关更多信息，请参阅 [Claude 4 博客文章](http://www.anthropic.com/news/claude-4)。
- **引人入胜的响应**：Claude 模型非常适合需要丰富、类似人类交互的应用程序。

    - 如果您更喜欢更简洁的响应，您可以调整您的提示以引导模型朝向所需的输出长度。有关详情，请参阅我们的[提示工程指南](/docs/zh-CN/build-with-claude/prompt-engineering)。
    - 有关特定的 Claude 4 提示最佳实践，请参阅我们的 [Claude 4 最佳实践指南](/docs/zh-CN/build-with-claude/prompt-engineering/claude-4-best-practices)。
- **输出质量**：从之前的模型代次迁移到 Claude 4 时，您可能会注意到整体性能的更大改进。

## 迁移到 Claude 4.5

如果您目前正在使用 Claude 3 模型，我们建议迁移到 Claude 4.5 以利用改进的智能和增强的功能。有关详细的迁移说明，请参阅[迁移到 Claude 4.5](/docs/zh-CN/about-claude/models/migrating-to-claude-4)。

## 开始使用 Claude

如果您准备好开始探索 Claude 能为您做什么，让我们深入了解吧！无论您是想将 Claude 集成到应用程序中的开发人员，还是想亲身体验 AI 力量的用户，我们都能为您提供帮助。

<Note>想与 Claude 聊天？访问 [claude.ai](http://www.claude.ai)！</Note>

<CardGroup cols={3}>
  <Card title="Claude 简介" icon="check" href="/docs/zh-CN/intro">
    探索 Claude 的功能和开发流程。
  </Card>
  <Card title="快速开始" icon="lightning" href="/docs/zh-CN/get-started">
    了解如何在几分钟内进行第一次 API 调用。
  </Card>
  <Card title="Claude 控制台" icon="code" href="/">
    直接在您的浏览器中制作和测试强大的提示。
  </Card>
</CardGroup>

如果您有任何问题或需要帮助，请随时与我们的[支持团队](https://support.claude.com/)联系或查阅 [Discord 社区](https://www.anthropic.com/discord)。