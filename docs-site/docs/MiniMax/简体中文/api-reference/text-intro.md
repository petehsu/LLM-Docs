# 文本生成

> 文本生成接口使用 **MiniMax M2**，**MiniMax M2 Stable**根据输入的上下文，让模型生成对话内容、工具调用。

可通过 **HTTP** 请求、**Anthropic SDK**（推荐） 或 **OpenAI SDK** 接入。

## 支持模型

| 模型名称              | 输入输出总 token | 模型介绍              |
| :---------------- | :---------: | :---------------- |
| MiniMax-M2        |    204800   | 专为高效编码与Agent工作流而生 |
| MiniMax-M2-Stable |    204800   | 更高并发，商业使用         |

### 注意事项

如果在使用MiniMax模型过程中遇到任何问题：

* 通过邮箱 [Model@minimaxi.com](mailto:Model@minimaxi.com) 等官方渠道联系我们的技术支持团队
* 在我们的 [Github](https://github.com/MiniMax-AI/MiniMax-M2/issues) 仓库提交Issue

## 推荐阅读

<Columns cols={2}>
  <Card title="Anthropic API 兼容（推荐）" icon="book-open" href="/api-reference/text-anthropic-api" arrow="true" cta="点击查看">
    通过 Anthropic SDK 调用 MiniMax 模型
  </Card>

  <Card title="OpenAI API 兼容" icon="book-open" href="/api-reference/text-openai-api" arrow="true" cta="点击查看">
    通过 OpenAI SDK 调用 MiniMax 模型
  </Card>

  <Card title="在 AI 编程工具里使用 MiniMax-M2" icon="book-open" href="/guides/text-ai-coding-tools" arrow="true" cta="点击查看">
    具备代码理解能力，适用于代码助手等场景。
  </Card>

  <Card title="M2 工具使用 & Interleaved Thinking" icon="book-open" href="/guides/text-m2-function-call" arrow="true" cta="点击查看">
    工具使用让 AI 模型调用外部 API。
  </Card>
</Columns>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://platform.minimaxi.com/docs/llms.txt