# 努力程度

使用努力程度参数控制 Claude 在响应时使用多少令牌，在响应完整性和令牌效率之间进行权衡。

---

努力程度参数允许您控制 Claude 在响应请求时花费令牌的积极程度。这使您能够在响应完整性和令牌效率之间进行权衡，所有这一切都可以通过单个模型实现。

<Note>
  努力程度参数目前处于测试版，仅由 Claude Opus 4.5 支持。

  使用此功能时，您必须包含[测试版标头](/docs/zh-CN/api/beta-headers) `effort-2025-11-24`。
</Note>

## 努力程度的工作原理

默认情况下，Claude 使用最大努力程度——花费尽可能多的令牌以获得最佳可能的结果。通过降低努力程度，您可以指示 Claude 更保守地使用令牌，优化速度和成本，同时接受某些功能的降低。

<Tip>
将 `effort` 设置为 `"high"` 会产生与完全省略 `effort` 参数完全相同的行为。
</Tip>

努力程度参数影响响应中的**所有令牌**，包括：

- 文本响应和解释
- 工具调用和函数参数
- 扩展思考（启用时）

这种方法有两个主要优势：

1. 它不需要启用思考功能就能使用。
2. 它可以影响所有令牌支出，包括工具调用。例如，较低的努力程度意味着 Claude 会进行较少的工具调用。这提供了对效率的更大控制程度。

### 努力程度

| 级别    | 描述                                                                                                                      | 典型用例                                                                              |
| -------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `high`   | 最大功能。Claude 使用尽可能多的令牌以获得最佳可能的结果。等同于不设置该参数。  | 复杂推理、困难的编码问题、代理任务                           |
| `medium` | 平衡的方法，具有适度的令牌节省。 | 需要平衡速度、成本和性能的代理任务                                                         |
| `low`    | 最高效。显著的令牌节省，但功能有所降低。 | 需要最佳速度和最低成本的更简单任务，例如子代理                     |

## 基本用法

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-opus-4-5-20251101",
    betas=["effort-2025-11-24"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Analyze the trade-offs between microservices and monolithic architectures"
    }],
    output_config={
        "effort": "medium"
    }
)

print(response.content[0].text)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.beta.messages.create({
  model: "claude-opus-4-5-20251101",
  betas: ["effort-2025-11-24"],
  max_tokens: 4096,
  messages: [{
    role: "user",
    content: "Analyze the trade-offs between microservices and monolithic architectures"
  }],
  output_config: {
    effort: "medium"
  }
});

console.log(response.content[0].text);
```

```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: effort-2025-11-24" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-opus-4-5-20251101",
        "max_tokens": 4096,
        "messages": [{
            "role": "user",
            "content": "Analyze the trade-offs between microservices and monolithic architectures"
        }],
        "output_config": {
            "effort": "medium"
        }
    }'
```

</CodeGroup>

## 何时应该调整努力程度参数？

- 当您需要 Claude 的最佳工作时，使用**高努力程度**（默认值）——复杂推理、细致分析、困难的编码问题，或任何质量是首要优先事项的任务。
- 当您想要可靠的性能而不需要高努力程度的全部令牌支出时，使用**中等努力程度**作为平衡选项。
- 当您优化速度（因为 Claude 用更少的令牌回答）或成本时，使用**低努力程度**——例如，简单的分类任务、快速查询或高容量使用情况，其中边际质量改进不足以证明额外的延迟或支出。

## 努力程度与工具使用

使用工具时，努力程度参数会影响工具调用周围的解释和工具调用本身。较低的努力程度倾向于：

- 将多个操作合并为更少的工具调用
- 进行更少的工具调用
- 直接进行操作而不需要前言
- 完成后使用简洁的确认消息

较高的努力程度可能会：

- 进行更多的工具调用
- 在采取行动前解释计划
- 提供详细的更改摘要
- 包含更全面的代码注释

## 努力程度与扩展思考

当启用扩展思考时，努力程度参数与思考令牌预算一起工作。这两个控制服务于不同的目的：

- **努力程度参数**：控制 Claude 如何花费所有令牌——包括思考令牌、文本响应和工具调用
- **思考令牌预算**：专门为思考令牌设置最大限制

努力程度参数可以在启用或不启用扩展思考的情况下使用。当两者都配置时：

1. 首先确定适合您任务的努力程度
2. 然后根据任务复杂性设置思考令牌预算

为了在复杂推理任务上获得最佳性能，请使用高努力程度（默认值）和高思考令牌预算。这允许 Claude 充分思考并提供全面的响应。

## 最佳实践

1. **从高开始**：使用较低的努力程度来权衡性能以获得令牌效率。
2. **对速度敏感或简单任务使用低努力程度**：当延迟很重要或任务很简单时，低努力程度可以显著减少响应时间和成本。
3. **测试您的用例**：努力程度的影响因任务类型而异。在部署前评估您特定用例的性能。
4. **考虑动态努力程度**：根据任务复杂性调整努力程度。简单查询可能需要低努力程度，而代理编码和复杂推理受益于高努力程度。