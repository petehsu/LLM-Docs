# 预填充 Claude 的响应以获得更好的输出控制

通过预填充 Assistant 消息来指导 Claude 的响应，跳过前言，强制特定格式，并在角色扮演场景中保持角色一致性。

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

<Note>
预填充仅适用于非扩展思考模式。目前不支持扩展思考。
</Note>

使用 Claude 时，您拥有通过预填充 `Assistant` 消息来指导其响应的独特能力。这种强大的技术允许您指导 Claude 的操作、跳过前言、强制特定格式（如 JSON 或 XML），甚至帮助 Claude 在角色扮演场景中保持角色一致性。

在某些 Claude 表现不如预期的情况下，几句预填充的句子可以大大改进 Claude 的性能。一点点预填充就能产生很大的效果！

## 如何预填充 Claude 的响应

要进行预填充，请在 `Assistant` 消息中包含所需的初始文本（Claude 的响应将从 `Assistant` 消息结束的地方继续）：

```python
import anthropic

client = anthropic.Anthropic()
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "What is your favorite color?"},
        {"role": "assistant", "content": "As an AI assistant, I don't have a favorite color, But if I had to pick, it would be green because"}  # Prefill here
    ]
)
```

<Warning>
  预填充内容不能以尾随空格结尾。像 `"As an AI assistant, I "` 这样的预填充（末尾有空格）会导致错误。
</Warning>

### 示例

#### 示例 1：控制输出格式并跳过前言

<Tip>**高级用户提示**：预填充 `{` 会强制 Claude 跳过前言并直接输出 JSON 对象。这更简洁、更简明，程序更容易解析，无需额外处理。
为了保证输出符合特定架构的 JSON，请考虑使用 [Structured Outputs](/docs/zh-CN/build-with-claude/structured-outputs) 而不是预填充。结构化输出确保 Claude 的响应始终与您定义的 JSON 架构相匹配，非常适合需要严格格式合规性的生产应用程序。</Tip>

    <section title="示例：不使用预填充的结构化数据提取">

    | 角色 | 内容 |
    | ---- | ------- |
    | 用户 | 从此产品描述中提取名称、大小、价格和颜色作为 JSON 对象：<br/><br/>\<description><br/>SmartHome Mini 是一款紧凑型智能家居助手，有黑色或白色可选，仅售 \$49.99。宽度仅为 5 英寸，它让您可以通过语音或应用程序控制灯、恒温器和其他连接设备——无论您将其放在家中的任何位置。这个经济实惠的小枢纽为您的智能设备带来了便捷的免提控制。<br/>\</description> |
    | 助手 | 以下是 JSON 格式的提取信息：<br/><br/>\`\`\`json<br/>\{<br/>  "name": "SmartHome Mini",<br/>  "size": "5 inches wide",<br/>  "price": "\$49.99",<br/>  "colors": ["black", "white"]<br/>\}<br/>\`\`\`<br/><br/>我从产品描述中提取了以下详细信息：<br/>- **名称**：SmartHome Mini<br/>- **大小**：宽 5 英寸<br/>- **价格**：\$49.99<br/>- **颜色**：有黑色和白色可选<br/><br/>JSON 对象提供了一种结构化格式，程序易于解析和使用。如果您需要任何修改或有任何其他问题，请告诉我！ |
    
</section>

    <section title="示例：使用预填充的结构化数据提取">

    | 角色 | 内容 |
    | ---- | ------- |
    | 用户 | 从此产品描述中提取名称、大小、价格和颜色作为 JSON 对象：<br/><br/>\<description><br/>SmartHome Mini 是一款紧凑型智能家居助手，有黑色或白色可选，仅售 \$49.99。宽度仅为 5 英寸，它让您可以通过语音或应用程序控制灯、恒温器和其他连接设备——无论您将其放在家中的任何位置。这个经济实惠的小枢纽为您的智能设备带来了便捷的免提控制。<br/>\</description> |
    | 助手（预填充） | \{ |
    | 助手（Claude 的响应） | "name": "SmartHome Mini",<br/>"size": "5 inches wide",<br/>"price": "\$49.99",<br/>"colors": [<br/>  "black",<br/>  "white"<br/>]<br/>\} |
    
</section>

#### 示例 2：在角色扮演场景中保持角色

<Tip>**角色扮演提示**：预填充括号中的 `[ROLE_NAME]` 可以提醒 Claude 保持角色，即使在更长和更复杂的对话中也是如此。当与 `system` 参数中的角色提示相结合时，这特别强大。</Tip>

    <section title="示例：不使用角色提示保持角色">

    | 角色 | 内容 |
    | ---- | ------- |
    | 用户（与"Sherlock Holmes" Claude 进行了 50 轮对话） | 您对这只鞋的主人推断出什么？\<image>muddy_shoe.jpg\</image> |
    | 助手 | 作为一个 AI 助手，我很乐意分析您提供的泥泞鞋子的图像。以下是我的推断... |
    
</section>

    <section title="示例：使用角色提示保持角色">

    | 角色 | 内容 |
    | ---- | ------- |
    | 用户（与"Sherlock Holmes" Claude 进行了 50 轮对话） | 您对这只鞋的主人推断出什么？<br/>\<image>muddy_shoe.jpg\</image> |
    | 助手（预填充） | [Sherlock Holmes] |
    | 助手（Claude 的响应） | 啊，这是什么？一个最奇特的标本，华生！让我们用敏锐的眼光审视这只鞋。你看，这泥土不是普通的伦敦粘土，而是仅在汉普斯特德荒野周围发现的富含铁质的独特红色土壤。然而，鞋底的磨损表明一种步态更适合于怀特教堂的鹅卵石街道，而不是荒野的温和斜坡。<br/><br/>现在，观察这些鞋带！它们用医疗专业人士青睐的特殊结打结——无疑是多年系手术衣养成的习惯。但鞋头上的擦伤痕迹讲述了另一个故事：它们与人们在武术中可能采用的踢动动作一致，特别是巴里茨。<br/><br/>因此，我们可以得出结论，我们缺席的鞋主人是一位医生，可能是外科医生，住在怀特教堂，但经常去汉普斯特德荒野——也许是为了进行秘密的巴里茨练习，远离窥探的目光。一个最有趣的案件，华生！我们必须赶快；游戏开始了！ |
    
</section>

---

<CardGroup cols={3}>
  <Card title="使用消息" icon="messages" href="/docs/zh-CN/build-with-claude/working-with-messages">
    查看更多预填充和其他 Messages API 模式的示例。
  </Card>
  <Card title="提示库" icon="link" href="/docs/zh-CN/resources/prompt-library/library">
    从为各种任务和用例精选的提示中获得灵感。
  </Card>
  <Card title="GitHub 提示教程" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    一个充满示例的教程，涵盖我们文档中的提示工程概念。
  </Card>
  <Card title="Google Sheets 提示教程" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    通过交互式电子表格提供的我们提示工程教程的轻量级版本。
  </Card>
</CardGroup>