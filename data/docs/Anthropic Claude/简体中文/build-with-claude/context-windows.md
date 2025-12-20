# 上下文窗口

了解Claude的上下文窗口如何工作，包括扩展思考、工具使用和1M令牌上下文窗口的信息。

---

## 理解上下文窗口

"上下文窗口"是指语言模型在生成新文本时可以回顾和参考的全部文本量，加上它生成的新文本。这与语言模型训练所用的大型数据语料库不同，而是代表模型的"工作记忆"。较大的上下文窗口允许模型理解和响应更复杂和冗长的提示，而较小的上下文窗口可能会限制模型处理较长提示或在扩展对话中保持连贯性的能力。

下面的图表说明了API请求的标准上下文窗口行为<sup>1</sup>：

![上下文窗口图表](/docs/images/context-window.svg)

_<sup>1</sup>对于聊天界面，例如[claude.ai](https://claude.ai/)，上下文窗口也可以设置为滚动"先进先出"系统。_

* **渐进式令牌累积：** 随着对话在轮次中推进，每条用户消息和助手响应都在上下文窗口内累积。之前的轮次完全保留。
* **线性增长模式：** 上下文使用随着每一轮线性增长，之前的轮次完全保留。
* **200K令牌容量：** 总可用上下文窗口（200,000个令牌）代表存储对话历史和从Claude生成新输出的最大容量。
* **输入-输出流：** 每一轮包括：
  - **输入阶段：** 包含所有之前的对话历史加上当前用户消息
  - **输出阶段：** 生成成为未来输入一部分的文本响应

## 具有扩展思考的上下文窗口

使用[扩展思考](/docs/zh-CN/build-with-claude/extended-thinking)时，所有输入和输出令牌，包括用于思考的令牌，都计入上下文窗口限制，在多轮情况下有一些细微差别。

思考预算令牌是您的`max_tokens`参数的子集，作为输出令牌计费，并计入速率限制。

但是，之前的思考块由Claude API自动从上下文窗口计算中删除，不是模型在后续轮次中"看到"的对话历史的一部分，为实际对话内容保留令牌容量。

下面的图表演示了启用扩展思考时的专门令牌管理：

![具有扩展思考的上下文窗口图表](/docs/images/context-window-thinking.svg)

* **删除扩展思考：** 扩展思考块（以深灰色显示）在每一轮的输出阶段生成，**但不作为后续轮次的输入令牌进行转发**。您不需要自己删除思考块。Claude API会自动为您执行此操作，如果您将其传回。
* **技术实现细节：**
  - 当您将思考块作为对话历史的一部分传回时，API会自动从之前的轮次中排除思考块。
  - 扩展思考令牌仅在生成期间作为输出令牌计费一次。
  - 有效的上下文窗口计算变为：`context_window = (input_tokens - previous_thinking_tokens) + current_turn_tokens`。
  - 思考令牌包括`thinking`块和`redacted_thinking`块。

这种架构在令牌方面是高效的，允许进行广泛的推理而不浪费令牌，因为思考块的长度可能很大。

<Note>
您可以在我们的[扩展思考指南](/docs/zh-CN/build-with-claude/extended-thinking)中阅读更多关于上下文窗口和扩展思考的内容。
</Note>

## 具有扩展思考和工具使用的上下文窗口

下面的图表说明了结合扩展思考和工具使用时的上下文窗口令牌管理：

![具有扩展思考和工具使用的上下文窗口图表](/docs/images/context-window-thinking-tools.svg)

<Steps>
  <Step title="第一轮架构">
    - **输入组件：** 工具配置和用户消息
    - **输出组件：** 扩展思考+文本响应+工具使用请求
    - **令牌计算：** 所有输入和输出组件都计入上下文窗口，所有输出组件都作为输出令牌计费。
  </Step>
  <Step title="工具结果处理（第2轮）">
    - **输入组件：** 第一轮中的每个块以及`tool_result`。扩展思考块**必须**与相应的工具结果一起返回。这是您**必须**返回思考块的唯一情况。
    - **输出组件：** 工具结果传回Claude后，Claude将仅以文本响应（在下一个`user`消息之前没有额外的扩展思考）。
    - **令牌计算：** 所有输入和输出组件都计入上下文窗口，所有输出组件都作为输出令牌计费。
  </Step>
  <Step title="第三步">
    - **输入组件：** 所有输入和前一轮的输出都被转发，除了思考块，现在Claude已完成整个工具使用周期，可以删除该块。如果您传回API，API将自动为您删除思考块，或者您可以在此阶段自由删除它。这也是您添加下一个`User`轮次的地方。
    - **输出组件：** 由于在工具使用周期之外有新的`User`轮次，Claude将生成新的扩展思考块并从那里继续。
    - **令牌计算：** 之前的思考令牌自动从上下文窗口计算中删除。所有其他之前的块仍然计为令牌窗口的一部分，当前`Assistant`轮次中的思考块计为上下文窗口的一部分。
  </Step>
</Steps>

* **工具使用与扩展思考的注意事项：**
  - 发布工具结果时，必须包含伴随该特定工具请求的整个未修改的思考块（包括签名/编辑部分）。
  - 扩展思考与工具使用的有效上下文窗口计算变为：`context_window = input_tokens + current_turn_tokens`。
  - 系统使用加密签名来验证思考块的真实性。在工具使用期间未能保留思考块可能会破坏Claude的推理连续性。因此，如果您修改思考块，API将返回错误。

<Note>
Claude 4模型支持[交错思考](/docs/zh-CN/build-with-claude/extended-thinking#interleaved-thinking)，这使Claude能够在工具调用之间进行思考，并在接收工具结果后进行更复杂的推理。

Claude Sonnet 3.7不支持交错思考，因此在没有非`tool_result`用户轮次的情况下，扩展思考和工具调用之间没有交错。

有关使用工具与扩展思考的更多信息，请参阅我们的[扩展思考指南](/docs/zh-CN/build-with-claude/extended-thinking#extended-thinking-with-tool-use)。
</Note>

## 1M令牌上下文窗口

Claude Sonnet 4和4.5支持100万令牌的上下文窗口。这个扩展的上下文窗口允许您处理更大的文档、维护更长的对话，并使用更广泛的代码库。

<Note>
1M令牌上下文窗口目前对[使用层级](/docs/zh-CN/api/rate-limits)为4的组织和具有自定义速率限制的组织处于测试阶段。1M令牌上下文窗口仅适用于Claude Sonnet 4和Sonnet 4.5。
</Note>

要使用1M令牌上下文窗口，请在您的API请求中包含`context-1m-2025-08-07`[测试版标头](/docs/zh-CN/api/beta-headers)：

<CodeGroup>

```python Python
from anthropic import Anthropic

client = Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Process this large document..."}
    ],
    betas=["context-1m-2025-08-07"]
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const msg = await anthropic.beta.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 1024,
  messages: [
    { role: 'user', content: 'Process this large document...' }
  ],
  betas: ['context-1m-2025-08-07']
});
```

```bash cURL
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: context-1m-2025-08-07" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "Process this large document..."}
    ]
  }'
```

</CodeGroup>

**重要注意事项：**
- **测试版状态**：这是一个可能会改变的测试版功能。功能和定价可能会在未来版本中修改或删除。
- **使用层级要求**：1M令牌上下文窗口可供[使用层级](/docs/zh-CN/api/rate-limits)为4的组织和具有自定义速率限制的组织使用。较低层级的组织必须升级到使用层级4才能访问此功能。
- **可用性**：1M令牌上下文窗口目前在Claude API、[Microsoft Foundry](/docs/zh-CN/build-with-claude/claude-in-microsoft-foundry)、[Amazon Bedrock](/docs/zh-CN/build-with-claude/claude-on-amazon-bedrock)和[Google Cloud的Vertex AI](/docs/zh-CN/build-with-claude/claude-on-vertex-ai)上可用。
- **定价**：超过200K令牌的请求自动按高级费率计费（输入2倍，输出1.5倍定价）。有关详细信息，请参阅[定价文档](/docs/zh-CN/about-claude/pricing#long-context-pricing)。
- **速率限制**：长上下文请求有专用的速率限制。有关详细信息，请参阅[速率限制文档](/docs/zh-CN/api/rate-limits#long-context-rate-limits)。
- **多模态注意事项**：处理大量图像或PDF时，请注意文件的令牌使用可能会有所不同。将大型提示与大量图像配对时，您可能会达到[请求大小限制](/docs/zh-CN/api/overview#request-size-limits)。

## Claude Sonnet 4.5和Haiku 4.5中的上下文感知

Claude Sonnet 4.5和Claude Haiku 4.5具有**上下文感知**功能，使这些模型能够在整个对话中跟踪其剩余的上下文窗口（即"令牌预算"）。这使Claude能够通过理解它有多少工作空间来更有效地执行任务和管理上下文。Claude本身经过训练，可以精确使用此上下文来坚持任务直到最后，而不必猜测剩余有多少令牌。对于模型来说，缺乏上下文感知就像在没有时钟的烹饪节目中竞争。Claude 4.5模型通过明确告知模型其剩余上下文来改变这一点，以便它可以最大限度地利用可用令牌。

**工作原理：**

在对话开始时，Claude收到有关其总上下文窗口的信息：

```
<budget:token_budget>200000</budget:token_budget>
```

预算设置为200K令牌（标准）、500K令牌（Claude.ai企业版）或100万令牌（测试版，适用于符合条件的组织）。

每次工具调用后，Claude收到剩余容量的更新：

```
<system_warning>Token usage: 35000/200000; 165000 remaining</system_warning>
```

这种感知帮助Claude确定剩余多少容量用于工作，并在长时间运行的任务上实现更有效的执行。图像令牌包含在这些预算中。

**优势：**

上下文感知对以下方面特别有价值：
- 需要持续关注的长时间运行的代理会话
- 状态转换重要的多上下文窗口工作流
- 需要仔细令牌管理的复杂任务

有关利用上下文感知的提示指导，请参阅我们的[Claude 4最佳实践指南](/docs/zh-CN/build-with-claude/prompt-engineering/claude-4-best-practices#context-awareness-and-multi-window-workflows)。

## 使用较新Claude模型的上下文窗口管理

在较新的Claude模型中（从Claude Sonnet 3.7开始），如果提示令牌和输出令牌的总和超过模型的上下文窗口，系统将返回验证错误，而不是静默截断上下文。这种改变提供了更可预测的行为，但需要更仔细的令牌管理。

要规划您的令牌使用并确保您保持在上下文窗口限制内，您可以使用[令牌计数API](/docs/zh-CN/build-with-claude/token-counting)来估计您的消息在发送给Claude之前将使用多少令牌。

有关按模型的上下文窗口大小列表，请参阅我们的[模型比较](/docs/zh-CN/about-claude/models/overview#model-comparison-table)表。

# 后续步骤
<CardGroup cols={2}>
  <Card title="模型比较表" icon="scales" href="/docs/zh-CN/about-claude/models/overview#model-comparison-table">
    查看我们的模型比较表，了解按模型的上下文窗口大小和输入/输出令牌定价列表。
  </Card>
  <Card title="扩展思考概述" icon="settings" href="/docs/zh-CN/build-with-claude/extended-thinking">
    了解更多关于扩展思考如何工作以及如何将其与工具使用和提示缓存等其他功能一起实现。
  </Card>
</CardGroup>