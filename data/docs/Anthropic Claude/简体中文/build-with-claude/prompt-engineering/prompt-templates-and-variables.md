# 使用提示模板和变量

学习如何在Claude中使用提示模板和变量来创建更高效、一致和可扩展的AI应用程序。

---

在使用Claude部署基于LLM的应用程序时，您的API调用通常包含两种类型的内容：
- **固定内容：** 在多次交互中保持不变的静态指令或上下文
- **变量内容：** 随每次请求或对话而变化的动态元素，例如：
    - 用户输入
    - 检索增强生成（RAG）的检索内容
    - 对话上下文，如用户账户历史
    - 系统生成的数据，如从其他独立Claude调用中输入的工具使用结果

**提示模板**将这些固定和变量部分结合起来，为动态内容使用占位符。在[Claude Console](/)中，这些占位符用**\{\{双括号\}\}**表示，使它们易于识别并允许快速测试不同的值。

---

# 何时使用提示模板和变量
当您期望提示的任何部分在另一次Claude调用中重复使用时，您应该始终使用提示模板和变量（仅通过API或[Claude Console](/)。[claude.ai](https://claude.ai/)目前不支持提示模板或变量）。

提示模板提供几个好处：
- **一致性：** 确保在多次交互中提示结构的一致性
- **效率：** 轻松替换变量内容而无需重写整个提示
- **可测试性：** 通过仅更改变量部分快速测试不同的输入和边缘情况
- **可扩展性：** 随着应用程序复杂性的增长简化提示管理
- **版本控制：** 通过仅跟踪提示的核心部分（与动态输入分离）轻松跟踪提示结构随时间的变化

[Claude Console](/)大量使用提示模板和变量，以支持上述所有功能和工具，例如：
- **[提示生成器](/docs/zh-CN/build-with-claude/prompt-engineering/prompt-generator)：** 决定您的提示需要什么变量并将它们包含在输出的模板中
- **[提示改进器](/docs/zh-CN/build-with-claude/prompt-engineering/prompt-improver)：** 采用您现有的模板，包括所有变量，并在输出的改进模板中维护它们
- **[评估工具](/docs/zh-CN/test-and-evaluate/eval-tool)：** 通过分离提示模板的变量和固定部分，允许您轻松测试、扩展和跟踪提示的版本

---

# 示例提示模板

让我们考虑一个将英文文本翻译成西班牙文的简单应用程序。翻译的文本将是变量，因为您期望此文本在用户之间或Claude调用之间发生变化。此翻译文本可以从数据库或用户输入中动态检索。

因此，对于您的翻译应用程序，您可能使用这个简单的提示模板：
```
将此文本从英语翻译成西班牙语：{{text}}
```

---

## 下一步

<CardGroup cols={2}>
  <Card title="生成提示" icon="link" href="/docs/zh-CN/build-with-claude/prompt-engineering/prompt-generator">
    了解Claude Console中的提示生成器，并尝试让Claude为您生成提示。
  </Card>
  <Card title="应用XML标签" icon="link" href="/docs/zh-CN/build-with-claude/prompt-engineering/use-xml-tags">
    如果您想提升提示变量技能，请将它们包装在XML标签中。
  </Card>
  <Card title="Claude Console" icon="link" href="/">
    查看Claude Console中提供的众多提示开发工具。
  </Card>
</CardGroup>