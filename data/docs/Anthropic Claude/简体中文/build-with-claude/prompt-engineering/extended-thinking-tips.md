# 扩展思考技巧

获得Claude扩展思考功能最佳效果的高级策略和技术指南。

---

本指南提供了充分利用Claude扩展思考功能的高级策略和技术。扩展思考允许Claude逐步解决复杂问题，提高在困难任务上的表现。

请参阅[扩展思考模型](/docs/zh-CN/about-claude/models/extended-thinking-models)以获得何时使用扩展思考的指导。

## 开始之前

本指南假设您已经决定使用扩展思考模式，并已查看了我们关于[如何开始使用扩展思考模型](/docs/zh-CN/about-claude/models/extended-thinking-models#getting-started-with-extended-thinking-models)的基本步骤以及我们的[扩展思考实施指南](/docs/zh-CN/build-with-claude/extended-thinking)。

### 扩展思考的技术考虑

- 思考令牌的最小预算为1024个令牌。我们建议您从最小思考预算开始，然后根据您的需求和任务复杂性逐步增加调整。
- 对于最佳思考预算超过32K的工作负载，我们建议您使用[批处理](/docs/zh-CN/build-with-claude/batch-processing)以避免网络问题。推动模型思考超过32K令牌的请求会导致长时间运行的请求，可能会遇到系统超时和开放连接限制。
- 扩展思考在英语中表现最佳，尽管最终输出可以是[Claude支持的任何语言](/docs/zh-CN/build-with-claude/multilingual-support)。
- 如果您需要低于最小预算的思考，我们建议使用标准模式，关闭思考，使用带有XML标签（如`<thinking>`）的传统思维链提示。请参阅[思维链提示](/docs/zh-CN/build-with-claude/prompt-engineering/chain-of-thought)。

## 扩展思考的提示技术

### 首先使用一般指令，然后用更多分步指令进行故障排除

Claude通常在高级指令下表现更好，只需深入思考任务，而不是分步的规定性指导。模型在解决问题方面的创造力可能超过人类规定最佳思考过程的能力。

例如，不要这样：

<CodeGroup>
```text User
逐步思考这个数学问题：
1. 首先，识别变量
2. 然后，建立方程
3. 接下来，求解x
...
```
</CodeGroup>

考虑这样：

<CodeGroup>
```text User
请彻底且详细地思考这个数学问题。
考虑多种方法并展示您的完整推理。
如果您的第一种方法不起作用，请尝试不同的方法。
```
/>
</CodeGroup>

<TryInConsoleButton
  userPrompt={
    `请彻底且详细地思考这个数学问题。
考虑多种方法并展示您的完整推理。
如果您的第一种方法不起作用，请尝试不同的方法。`
  }
  thinkingBudgetTokens={16000}
>
  在控制台中试用
</TryInConsoleButton>

话虽如此，Claude在需要时仍然可以有效地遵循复杂的结构化执行步骤。该模型可以处理比以前版本更长的列表和更复杂的指令。我们建议您从更通用的指令开始，然后阅读Claude的思考输出并迭代以提供更具体的指令来引导其思考。

### 扩展思考的多样本提示

[多样本提示](/docs/zh-CN/build-with-claude/prompt-engineering/multishot-prompting)与扩展思考配合良好。当您为Claude提供如何思考问题的示例时，它将在其扩展思考块中遵循类似的推理模式。

您可以在扩展思考场景中通过使用XML标签（如`<thinking>`或`<scratchpad>`）在提示中包含少样本示例，以指示这些示例中扩展思考的规范模式。

Claude将把模式推广到正式的扩展思考过程。但是，通过让Claude自由地以它认为最好的方式思考，您可能会获得更好的结果。

示例：

<CodeGroup>
```text User
我将向您展示如何解决数学问题，然后我希望您解决一个类似的问题。

问题1：80的15%是多少？

<thinking>
要找到80的15%：
1. 将15%转换为小数：15% = 0.15
2. 相乘：0.15 × 80 = 12
</thinking>

答案是12。

现在解决这个：
问题2：240的35%是多少？
```
/>
</CodeGroup>

<TryInConsoleButton
  userPrompt={
    `我将向您展示如何解决数学问题，然后我希望您解决一个类似的问题。

问题1：80的15%是多少？

<thinking>
要找到80的15%：
1. 将15%转换为小数：15% = 0.15
2. 相乘：0.15 × 80 = 12
</thinking>

答案是12。

现在解决这个：
问题2：240的35%是多少？`
  }
  thinkingBudgetTokens={16000} 
>
  在控制台中试用
</TryInConsoleButton>

### 通过扩展思考最大化指令遵循
当启用扩展思考时，Claude显示出显著改善的指令遵循能力。模型通常：
1. 在扩展思考块内推理指令
2. 在响应中执行这些指令

要最大化指令遵循：
- 对您想要的内容要清晰具体
- 对于复杂指令，考虑将它们分解为Claude应该有条不紊地执行的编号步骤
- 允许Claude有足够的预算在其扩展思考中充分处理指令

### 使用扩展思考调试和引导Claude的行为
您可以使用Claude的思考输出来调试Claude的逻辑，尽管这种方法并不总是完全可靠。

为了最好地利用这种方法，我们建议以下技巧：
- 我们不建议在用户文本块中传回Claude的扩展思考，因为这不会提高性能，实际上可能会降低结果。
- 明确不允许预填充扩展思考，手动更改模型在其思考块之后的输出文本可能会由于模型混乱而降低结果。

当扩展思考关闭时，标准的`assistant`响应文本[预填充](/docs/zh-CN/build-with-claude/prompt-engineering/prefill-claudes-response)仍然是允许的。

<Note>
有时Claude可能会在助手输出文本中重复其扩展思考。如果您想要一个干净的响应，请指示Claude不要重复其扩展思考，只输出答案。
</Note>

### 充分利用长输出和长形式思考

对于数据集生成用例，尝试诸如"请创建一个极其详细的...表格"之类的提示来生成综合数据集。

对于详细内容生成等用例，您可能希望生成更长的扩展思考块和更详细的响应，请尝试这些技巧：
- 增加最大扩展思考长度并明确要求更长的输出
- 对于非常长的输出（20,000+字），请求一个详细的大纲，包含到段落级别的字数统计。然后要求Claude将其段落索引到大纲并保持指定的字数

<Warning>
我们不建议您为了输出令牌而推动Claude输出更多令牌。相反，我们鼓励您从小的思考预算开始，根据需要增加以找到您用例的最佳设置。
</Warning>

以下是Claude由于更长的扩展思考而表现出色的示例用例：

  <section title="复杂STEM问题">

    复杂的STEM问题需要Claude构建心理模型、应用专业知识并通过顺序逻辑步骤工作——这些过程受益于更长的推理时间。
    
    <Tabs>
      <Tab title="标准提示">
        <CodeGroup>
        ```text User
        为正方形内的弹跳黄球编写python脚本，
        确保正确处理碰撞检测。
        让正方形缓慢旋转。
        ```
        />
        </CodeGroup>
        
        <TryInConsoleButton
          userPrompt={
            `为正方形内的弹跳黄球编写python脚本，
确保正确处理碰撞检测。
让正方形缓慢旋转。`
          }
          thinkingBudgetTokens={16000}
        >
          在控制台中试用
        </TryInConsoleButton>
        <Note>
        这个较简单的任务通常只需要大约几秒钟的思考时间。
        </Note>
      </Tab>
      <Tab title="增强提示">
        <CodeGroup>
        ```text User
        为超立方体内的弹跳黄球编写Python脚本，
        确保正确处理碰撞检测。
        让超立方体缓慢旋转。
        确保球保持在超立方体内。
        ```
        />
        </CodeGroup>
        
        <TryInConsoleButton
          userPrompt={
            `为超立方体内的弹跳黄球编写Python脚本，
确保正确处理碰撞检测。
让超立方体缓慢旋转。
确保球保持在超立方体内。`
          }
          thinkingBudgetTokens={16000}
        >
          在控制台中试用
        </TryInConsoleButton>
        <Note>
        这个复杂的4D可视化挑战最好地利用了长扩展思考时间，因为Claude需要处理数学和编程复杂性。
        </Note>
      </Tab>
    </Tabs>
  
</section>
  
  <section title="约束优化问题">

    约束优化挑战Claude同时满足多个竞争要求，当允许长扩展思考时间以便模型可以有条不紊地解决每个约束时，这最好完成。
    
    <Tabs>
      <Tab title="标准提示">
        <CodeGroup>
        ```text User
        计划一周的日本假期。
        ```
        />
        </CodeGroup>
        
        <TryInConsoleButton
          userPrompt="计划一周的日本假期。"
          thinkingBudgetTokens={16000}
        >
          在控制台中试用
        </TryInConsoleButton>
        <Note>
        这个开放式请求通常只需要大约几秒钟的思考时间。
        </Note>
      </Tab>
      <Tab title="增强提示">
        <CodeGroup>
        ```text User
        计划一个7天的日本旅行，具有以下约束：
        - 预算2,500美元
        - 必须包括东京和京都
        - 需要适应素食饮食
        - 偏好文化体验而非购物
        - 必须包括一天的徒步旅行
        - 每天地点间旅行时间不超过2小时
        - 每天下午需要空闲时间打电话回家
        - 必须尽可能避开人群
        ```
        />
        </CodeGroup>
        
        <TryInConsoleButton
          userPrompt={
            `计划一个7天的日本旅行，具有以下约束：
- 预算2,500美元
- 必须包括东京和京都
- 需要适应素食饮食
- 偏好文化体验而非购物
- 必须包括一天的徒步旅行
- 每天地点间旅行时间不超过2小时
- 每天下午需要空闲时间打电话回家
- 必须尽可能避开人群`
          }
          thinkingBudgetTokens={16000}
        >
          在控制台中试用
        </TryInConsoleButton>
        <Note>
        有多个约束需要平衡时，Claude在给予更多思考空间来考虑如何最优地满足所有要求时自然会表现最佳。
        </Note>
      </Tab>
    </Tabs>
  
</section>
  
  <section title="思考框架">

    结构化思考框架为Claude提供了明确的方法论，当Claude被给予长扩展思考空间来遵循每个步骤时，这可能效果最好。
    
    <Tabs>
      <Tab title="标准提示">
        <CodeGroup>
        ```text User
        为Microsoft在2027年前进入个性化医疗市场
        制定综合战略。
        ```
        />
        </CodeGroup>
        
        <TryInConsoleButton
          userPrompt={
            `为Microsoft在2027年前进入个性化医疗市场
制定综合战略。`
          }
          thinkingBudgetTokens={16000}
        >
          在控制台中试用
        </TryInConsoleButton>
        <Note>
        这个广泛的战略问题通常只需要大约几秒钟的思考时间。
        </Note>
      </Tab>
      <Tab title="增强提示">
        <CodeGroup>
        ```text User
        为Microsoft在2027年前进入个性化医疗市场
        制定综合战略。
        
        开始于：
        1. 蓝海战略画布
        2. 应用波特五力模型识别竞争压力
        
        接下来，基于监管和技术变量进行四种
        不同未来的情景规划练习。
        
        对于每种情景：
        - 使用安索夫矩阵制定战略响应
        
        最后，应用三地平线框架：
        - 绘制转型路径
        - 识别每个阶段的潜在颠覆性创新
        ```
        />
        </CodeGroup>
        
        <TryInConsoleButton
          userPrompt={
            `为Microsoft在2027年前进入个性化医疗市场
制定综合战略。

开始于：
1. 蓝海战略画布
2. 应用波特五力模型识别竞争压力

接下来，基于监管和技术变量进行四种
不同未来的情景规划练习。

对于每种情景：
- 使用安索夫矩阵制定战略响应

最后，应用三地平线框架：
- 绘制转型路径
- 识别每个阶段的潜在颠覆性创新`
          }
          thinkingBudgetTokens={16000}
        >
          在控制台中试用
        </TryInConsoleButton>
        <Note>
        通过指定必须按顺序应用的多个分析框架，思考时间自然增加，因为Claude有条不紊地处理每个框架。
        </Note>
      </Tab>
    </Tabs>
  
</section>

### 让Claude反思并检查其工作以提高一致性和错误处理
您可以使用简单的自然语言提示来提高一致性并减少错误：
1. 要求Claude在宣布任务完成之前用简单测试验证其工作
2. 指示模型分析其前一步是否达到了预期结果
3. 对于编码任务，要求Claude在其扩展思考中运行测试用例

示例：

<CodeGroup>
```text User
编写一个计算数字阶乘的函数。
在您完成之前，请用以下测试用例验证您的解决方案：
- n=0
- n=1
- n=5
- n=10
并修复您发现的任何问题。
```
/>
</CodeGroup>

<TryInConsoleButton
  userPrompt={
    `编写一个计算数字阶乘的函数。
在您完成之前，请用以下测试用例验证您的解决方案：
- n=0
- n=1
- n=5
- n=10
并修复您发现的任何问题。`
  }
  thinkingBudgetTokens={16000}
>
  在控制台中试用
</TryInConsoleButton>

## 下一步

<CardGroup>
  <Card title="扩展思考食谱" icon="book" href="https://github.com/anthropics/anthropic-cookbook/tree/main/extended_thinking">
    在我们的食谱中探索扩展思考的实际示例。
  </Card>
  <Card title="扩展思考指南" icon="code" href="/docs/zh-CN/build-with-claude/extended-thinking">
    查看实施扩展思考的完整技术文档。
  </Card>
</CardGroup>