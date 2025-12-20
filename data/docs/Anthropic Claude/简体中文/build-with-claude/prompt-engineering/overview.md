# 提示词工程概述

学习如何优化和改进您的提示词以获得更好的 Claude 模型性能。

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

## 提示词工程之前

本指南假设您已经：
1. 为您的用例明确定义了成功标准
2. 有一些方法可以根据这些标准进行实证测试
3. 有一个您想要改进的初稿提示词

如果没有，我们强烈建议您花时间先建立这些基础。请查看[定义您的成功标准](/docs/zh-CN/test-and-evaluate/define-success)和[创建强有力的实证评估](/docs/zh-CN/test-and-evaluate/develop-tests)以获取提示和指导。

<Card title="提示词生成器" icon="link" href="/dashboard">
  没有初稿提示词？试试 Claude 控制台中的提示词生成器！
</Card>

***

## 何时进行提示词工程

  本指南重点关注可通过提示词工程控制的成功标准。
  并非每个成功标准或失败的评估都最好通过提示词工程来解决。例如，延迟和成本有时可以通过选择不同的模型更容易地改进。

<section title="提示词工程 vs. 微调">

  提示词工程比其他模型行为控制方法（如微调）快得多，通常可以在更短的时间内产生性能的飞跃。以下是考虑使用提示词工程而不是微调的一些原因：<br/>
  - **资源效率**：微调需要高端 GPU 和大量内存，而提示词工程只需要文本输入，因此资源友好得多。
  - **成本效益**：对于基于云的 AI 服务，微调会产生显著成本。提示词工程使用基础模型，通常更便宜。
  - **维护模型更新**：当提供商更新模型时，微调版本可能需要重新训练。提示词通常可以跨版本工作而无需更改。
  - **节省时间**：微调可能需要数小时甚至数天。相比之下，提示词工程提供近乎即时的结果，允许快速解决问题。
  - **最少数据需求**：微调需要大量特定任务的标记数据，这可能很稀缺或昂贵。提示词工程适用于少样本甚至零样本学习。
  - **灵活性和快速迭代**：快速尝试各种方法，调整提示词，并立即看到结果。这种快速实验对于微调来说很困难。
  - **域适应**：通过在提示词中提供特定领域的上下文，轻松将模型适应新领域，无需重新训练。
  - **理解力改进**：提示词工程在帮助模型更好地理解和利用外部内容（如检索到的文档）方面远比微调有效。
  - **保留通用知识**：微调存在灾难性遗忘的风险，模型可能会失去通用知识。提示词工程保持模型的广泛能力。
  - **透明度**：提示词是人类可读的，显示模型接收的确切信息。这种透明度有助于理解和调试。

</section>

***

## 如何进行提示词工程

本部分中的提示词工程页面已按从最广泛有效的技术到更专业化的技术进行组织。在排查性能问题时，我们建议您按顺序尝试这些技术，尽管每种技术的实际影响将取决于您的用例。
1. [提示词生成器](/docs/zh-CN/build-with-claude/prompt-engineering/prompt-generator)
2. [清晰直接](/docs/zh-CN/build-with-claude/prompt-engineering/be-clear-and-direct)
3. [使用示例（多样本）](/docs/zh-CN/build-with-claude/prompt-engineering/multishot-prompting)
4. [让 Claude 思考（思维链）](/docs/zh-CN/build-with-claude/prompt-engineering/chain-of-thought)
5. [使用 XML 标签](/docs/zh-CN/build-with-claude/prompt-engineering/use-xml-tags)
6. [给 Claude 一个角色（系统提示词）](/docs/zh-CN/build-with-claude/prompt-engineering/system-prompts)
7. [预填充 Claude 的响应](/docs/zh-CN/build-with-claude/prompt-engineering/prefill-claudes-response)
8. [链接复杂提示词](/docs/zh-CN/build-with-claude/prompt-engineering/chain-prompts)
9. [长上下文提示](/docs/zh-CN/build-with-claude/prompt-engineering/long-context-tips)

***

## 提示词工程教程

如果您是交互式学习者，您可以改为深入我们的交互式教程！

<CardGroup cols={2}>
  <Card title="GitHub 提示词工程教程" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    一个充满示例的教程，涵盖了我们文档中的提示词工程概念。
  </Card>
  <Card title="Google Sheets 提示词工程教程" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    通过交互式电子表格提供的更轻量级版本的提示词工程教程。
  </Card>
</CardGroup>