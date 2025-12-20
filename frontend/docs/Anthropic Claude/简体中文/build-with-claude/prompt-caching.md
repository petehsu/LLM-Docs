# 提示词缓存

提示词缓存是一项强大的功能，通过允许从提示词中的特定前缀恢复来优化您的 API 使用。这种方法可以显著减少重复任务或具有一致元素的提示词的处理时间和成本。

---

提示词缓存是一项强大的功能，通过允许从提示词中的特定前缀恢复来优化您的 API 使用。这种方法可以显著减少重复任务或具有一致元素的提示词的处理时间和成本。

以下是如何使用 `cache_control` 块通过 Messages API 实现提示词缓存的示例：

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "system": [
      {
        "type": "text",
        "text": "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n"
      },
      {
        "type": "text",
        "text": "<the entire contents of Pride and Prejudice>",
        "cache_control": {"type": "ephemeral"}
      }
    ],
    "messages": [
      {
        "role": "user",
        "content": "Analyze the major themes in Pride and Prejudice."
      }
    ]
  }'

# Call the model again with the same inputs up to the cache checkpoint
curl https://api.anthropic.com/v1/messages # rest of input
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    system=[
      {
        "type": "text",
        "text": "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n",
      },
      {
        "type": "text",
        "text": "<the entire contents of 'Pride and Prejudice'>",
        "cache_control": {"type": "ephemeral"}
      }
    ],
    messages=[{"role": "user", "content": "Analyze the major themes in 'Pride and Prejudice'."}],
)
print(response.usage.model_dump_json())

# Call the model again with the same inputs up to the cache checkpoint
response = client.messages.create(.....)
print(response.usage.model_dump_json())
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  system: [
    {
      type: "text",
      text: "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n",
    },
    {
      type: "text",
      text: "<the entire contents of 'Pride and Prejudice'>",
      cache_control: { type: "ephemeral" }
    }
  ],
  messages: [
    {
      role: "user",
      content: "Analyze the major themes in 'Pride and Prejudice'."
    }
  ]
});
console.log(response.usage);

// Call the model again with the same inputs up to the cache checkpoint
const new_response = await client.messages.create(...)
console.log(new_response.usage);
```

```java Java
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;

public class PromptCachingExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                .systemOfTextBlockParams(List.of(
                        TextBlockParam.builder()
                                .text("You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n")
                                .build(),
                        TextBlockParam.builder()
                                .text("<the entire contents of 'Pride and Prejudice'>")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build()
                ))
                .addUserMessage("Analyze the major themes in 'Pride and Prejudice'.")
                .build();

        Message message = client.messages().create(params);
        System.out.println(message.usage());
    }
}
```
</CodeGroup>

```json JSON
{"cache_creation_input_tokens":188086,"cache_read_input_tokens":0,"input_tokens":21,"output_tokens":393}
{"cache_creation_input_tokens":0,"cache_read_input_tokens":188086,"input_tokens":21,"output_tokens":393}
```

在此示例中，整个《傲慢与偏见》的文本使用 `cache_control` 参数进行缓存。这使得可以在多个 API 调用中重复使用这个大型文本，而无需每次都重新处理。仅更改用户消息允许您提出有关该书的各种问题，同时利用缓存的内容，从而实现更快的响应和提高的效率。

---

## 提示词缓存如何工作

当您发送启用了提示词缓存的请求时：

1. 系统检查提示词前缀（直到指定的缓存断点）是否已从最近的查询中缓存。
2. 如果找到，它使用缓存版本，减少处理时间和成本。
3. 否则，它处理完整提示词，并在响应开始后缓存前缀。

这对以下情况特别有用：
- 包含许多示例的提示词
- 大量上下文或背景信息
- 具有一致指令的重复任务
- 长多轮对话

默认情况下，缓存的生命周期为 5 分钟。每次使用缓存的内容时，缓存都会以无额外成本的方式刷新。

<Note>
如果您发现 5 分钟太短，Anthropic 还提供 1 小时的缓存持续时间[需额外付费](#pricing)。

有关更多信息，请参阅 [1 小时缓存持续时间](#1-hour-cache-duration)。
</Note>

<Tip>
  **提示词缓存缓存完整前缀**

提示词缓存引用整个提示词 - `tools`、`system` 和 `messages`（按该顺序）直到并包括用 `cache_control` 指定的块。

</Tip>

---
## 定价

提示词缓存引入了新的定价结构。下表显示了每个支持的模型的每百万个令牌的价格：

| Model             | Base Input Tokens | 5m Cache Writes | 1h Cache Writes | Cache Hits & Refreshes | Output Tokens |
|-------------------|-------------------|-----------------|-----------------|----------------------|---------------|
| Claude Opus 4.5   | $5 / MTok         | $6.25 / MTok    | $10 / MTok      | $0.50 / MTok | $25 / MTok    |
| Claude Opus 4.1   | $15 / MTok        | $18.75 / MTok   | $30 / MTok      | $1.50 / MTok | $75 / MTok    |
| Claude Opus 4     | $15 / MTok        | $18.75 / MTok   | $30 / MTok      | $1.50 / MTok | $75 / MTok    |
| Claude Sonnet 4.5   | $3 / MTok         | $3.75 / MTok    | $6 / MTok       | $0.30 / MTok | $15 / MTok    |
| Claude Sonnet 4   | $3 / MTok         | $3.75 / MTok    | $6 / MTok       | $0.30 / MTok | $15 / MTok    |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations)) | $3 / MTok         | $3.75 / MTok    | $6 / MTok       | $0.30 / MTok | $15 / MTok    |
| Claude Haiku 4.5  | $1 / MTok         | $1.25 / MTok    | $2 / MTok       | $0.10 / MTok | $5 / MTok     |
| Claude Haiku 3.5  | $0.80 / MTok      | $1 / MTok       | $1.6 / MTok     | $0.08 / MTok | $4 / MTok     |
| Claude Opus 3 ([deprecated](/docs/en/about-claude/model-deprecations))    | $15 / MTok        | $18.75 / MTok   | $30 / MTok      | $1.50 / MTok | $75 / MTok    |
| Claude Haiku 3    | $0.25 / MTok      | $0.30 / MTok    | $0.50 / MTok    | $0.03 / MTok | $1.25 / MTok  |

<Note>
上表反映了提示词缓存的以下定价倍数：
- 5 分钟缓存写入令牌是基础输入令牌价格的 1.25 倍
- 1 小时缓存写入令牌是基础输入令牌价格的 2 倍
- 缓存读取令牌是基础输入令牌价格的 0.1 倍
</Note>

---
## 如何实现提示词缓存

### 支持的模型

提示词缓存目前支持：
- Claude Opus 4.5
- Claude Opus 4.1
- Claude Opus 4
- Claude Sonnet 4.5
- Claude Sonnet 4
- Claude Sonnet 3.7 ([已弃用](/docs/zh-CN/about-claude/model-deprecations))
- Claude Haiku 4.5
- Claude Haiku 3.5
- Claude Haiku 3
- Claude Opus 3 ([已弃用](/docs/zh-CN/about-claude/model-deprecations))

### 构建您的提示词

将静态内容（工具定义、系统指令、上下文、示例）放在提示词的开头。使用 `cache_control` 参数标记可重用内容的结尾以进行缓存。

缓存前缀按以下顺序创建：`tools`、`system`，然后 `messages`。此顺序形成一个层次结构，其中每个级别都建立在前一个级别之上。

#### 自动前缀检查如何工作

您可以在静态内容的末尾使用单个缓存断点，系统将自动找到最长的匹配缓存块序列。理解这如何工作有助于您优化缓存策略。

**三个核心原则：**

1. **缓存键是累积的**：当您使用 `cache_control` 显式缓存块时，缓存哈希键是通过按顺序哈希对话中所有先前的块生成的。这意味着每个块的缓存取决于它之前的所有内容。

2. **向后顺序检查**：系统通过从您的显式断点向后工作，按相反顺序检查每个先前的块来检查缓存命中。这确保您获得最长的可能缓存命中。

3. **20 块回溯窗口**：系统仅检查每个显式 `cache_control` 断点之前的最多 20 个块。在检查 20 个块而未找到匹配后，它停止检查并移动到下一个显式断点（如果有）。

**示例：理解回溯窗口**

考虑一个有 30 个内容块的对话，其中您仅在块 30 上设置 `cache_control`：

- **如果您发送块 31 且不更改先前的块**：系统检查块 30（匹配！）。您在块 30 处获得缓存命中，仅需要处理块 31。

- **如果您修改块 25 并发送块 31**：系统从块 30 向后检查 → 29 → 28... → 25（不匹配）→ 24（匹配！）。由于块 24 未更改，您在块 24 处获得缓存命中，仅需要重新处理块 25-30。

- **如果您修改块 5 并发送块 31**：系统从块 30 向后检查 → 29 → 28... → 11（检查 #20）。在 20 次检查后未找到匹配，它停止查找。由于块 5 超出 20 块窗口，不会发生缓存命中，所有块都需要重新处理。但是，如果您在块 5 上设置了显式 `cache_control` 断点，系统将继续从该断点检查：块 5（不匹配）→ 块 4（匹配！）。这允许在块 4 处进行缓存命中，说明为什么您应该在可编辑内容之前放置断点。

**关键要点**：始终在对话末尾设置显式缓存断点以最大化缓存命中的机会。此外，在可能可编辑的内容块之前设置断点，以确保这些部分可以独立缓存。

#### 何时使用多个断点

如果您想要以下情况，可以定义最多 4 个缓存断点：
- 缓存以不同频率变化的不同部分（例如，工具很少变化，但上下文每天更新）
- 对缓存的内容有更多控制
- 确保缓存最后一个断点之前超过 20 个块的内容
- 在可编辑内容之前放置断点，以保证即使在 20 块窗口之外发生更改时也能获得缓存命中

<Note>
**重要限制**：如果您的提示词在缓存断点之前有超过 20 个内容块，并且您修改了那 20 个块之前的内容，除非您添加更接近该内容的额外显式断点，否则您将不会获得缓存命中。
</Note>

### 缓存限制
最小可缓存提示词长度为：
- Claude Opus 4.5 的 4096 个令牌
- Claude Opus 4.1、Claude Opus 4、Claude Sonnet 4.5、Claude Sonnet 4、Claude Sonnet 3.7 ([已弃用](/docs/zh-CN/about-claude/model-deprecations)) 和 Claude Opus 3 ([已弃用](/docs/zh-CN/about-claude/model-deprecations)) 的 1024 个令牌
- Claude Haiku 4.5 的 4096 个令牌
- Claude Haiku 3.5 和 Claude Haiku 3 的 2048 个令牌

较短的提示词无法缓存，即使用 `cache_control` 标记也是如此。任何缓存少于此令牌数的请求都将在没有缓存的情况下处理。要查看提示词是否被缓存，请参阅响应使用[字段](/docs/zh-CN/build-with-claude/prompt-caching#tracking-cache-performance)。

对于并发请求，请注意缓存条目仅在第一个响应开始后才可用。如果您需要并行请求的缓存命中，请在发送后续请求之前等待第一个响应。

目前，"ephemeral"是唯一支持的缓存类型，默认生命周期为 5 分钟。

### 理解缓存断点成本

**缓存断点本身不会增加任何成本。** 您仅需为以下内容付费：
- **缓存写入**：当新内容写入缓存时（比基础输入令牌多 25%，用于 5 分钟 TTL）
- **缓存读取**：当使用缓存内容时（基础输入令牌价格的 10%）
- **常规输入令牌**：对于任何未缓存的内容

添加更多 `cache_control` 断点不会增加您的成本 - 您仍然根据实际缓存和读取的内容支付相同的金额。断点只是让您控制哪些部分可以独立缓存。

### 可以缓存的内容
请求中的大多数块都可以用 `cache_control` 指定为缓存。这包括：

- 工具：`tools` 数组中的工具定义
- 系统消息：`system` 数组中的内容块
- 文本消息：`messages.content` 数组中的内容块，用于用户和助手轮次
- 图像和文档：`messages.content` 数组中的内容块，在用户轮次中
- 工具使用和工具结果：`messages.content` 数组中的内容块，在用户和助手轮次中

这些元素中的每一个都可以用 `cache_control` 标记以启用该部分请求的缓存。

### 无法缓存的内容
虽然大多数请求块可以缓存，但有一些例外：

- 思考块无法直接用 `cache_control` 缓存。但是，当思考块出现在先前的助手轮次中时，它们可以与其他内容一起缓存。以这种方式缓存时，它们在从缓存读取时确实计为输入令牌。
- 子内容块（如[引用](/docs/zh-CN/build-with-claude/citations)）本身无法直接缓存。相反，缓存顶级块。

    在引用的情况下，作为引用源材料的顶级文档内容块可以缓存。这允许您通过缓存引用将引用的文档来有效地使用提示词缓存。
- 空文本块无法缓存。

### 什么使缓存失效

对缓存内容的修改可能会使部分或全部缓存失效。

如[构建您的提示词](#structuring-your-prompt)中所述，缓存遵循层次结构：`tools` → `system` → `messages`。每个级别的更改会使该级别及所有后续级别失效。

下表显示了不同类型的更改会使缓存的哪些部分失效。✘ 表示缓存失效，✓ 表示缓存保持有效。

| 什么改变 | 工具缓存 | 系统缓存 | 消息缓存 | 影响 |
|------------|------------------|---------------|----------------|-------------|
| **工具定义** | ✘ | ✘ | ✘ | 修改工具定义（名称、描述、参数）会使整个缓存失效 |
| **网络搜索切换** | ✓ | ✘ | ✘ | 启用/禁用网络搜索会修改系统提示词 |
| **引用切换** | ✓ | ✘ | ✘ | 启用/禁用引用会修改系统提示词 |
| **工具选择** | ✓ | ✓ | ✘ | 对 `tool_choice` 参数的更改仅影响消息块 |
| **图像** | ✓ | ✓ | ✘ | 在提示词中的任何位置添加/删除图像会影响消息块 |
| **思考参数** | ✓ | ✓ | ✘ | 对扩展思考设置（启用/禁用、预算）的更改会影响消息块 |
| **传递给扩展思考请求的非工具结果** | ✓ | ✓ | ✘ | 当在启用扩展思考的请求中传递非工具结果时，所有先前缓存的思考块都会从上下文中删除，任何在这些思考块之后的上下文中的消息都会从缓存中删除。有关更多详细信息，请参阅[使用思考块进行缓存](#caching-with-thinking-blocks)。 |

### 跟踪缓存性能

使用这些 API 响应字段监控缓存性能，在响应中的 `usage` 内（或如果[流式传输](/docs/zh-CN/build-with-claude/streaming)则为 `message_start` 事件）：

- `cache_creation_input_tokens`：创建新条目时写入缓存的令牌数。
- `cache_read_input_tokens`：为此请求从缓存检索的令牌数。
- `input_tokens`：未从缓存读取或用于创建缓存的输入令牌数（即最后一个缓存断点之后的令牌）。

<Note>
**理解令牌分解**

`input_tokens` 字段仅表示请求中**最后一个缓存断点之后**的令牌 - 不是您发送的所有输入令牌。

要计算总输入令牌：
```
total_input_tokens = cache_read_input_tokens + cache_creation_input_tokens + input_tokens
```

**空间解释：**
- `cache_read_input_tokens` = 断点之前已缓存的令牌（读取）
- `cache_creation_input_tokens` = 断点之前现在被缓存的令牌（写入）
- `input_tokens` = 最后一个断点之后的令牌（不符合缓存条件）

**示例：** 如果您有一个请求，其中有 100,000 个令牌的缓存内容（从缓存读取），0 个令牌的新内容被缓存，以及 50 个令牌在您的用户消息中（在缓存断点之后）：
- `cache_read_input_tokens`：100,000
- `cache_creation_input_tokens`：0
- `input_tokens`：50
- **处理的总输入令牌**：100,050 个令牌

这对于理解成本和速率限制很重要，因为在有效使用缓存时，`input_tokens` 通常会比您的总输入小得多。
</Note>

### 有效缓存的最佳实践

要优化提示词缓存性能：

- 缓存稳定、可重用的内容，如系统指令、背景信息、大型上下文或频繁的工具定义。
- 将缓存内容放在提示词的开头以获得最佳性能。
- 战略性地使用缓存断点来分离不同的可缓存前缀部分。
- 在对话末尾和可编辑内容之前设置缓存断点以最大化缓存命中率，特别是在处理超过 20 个内容块的提示词时。
- 定期分析缓存命中率并根据需要调整您的策略。

### 针对不同用例进行优化

根据您的场景定制您的提示词缓存策略：

- 对话代理：降低扩展对话的成本和延迟，特别是那些具有长指令或上传文档的对话。
- 编码助手：通过在提示词中保留相关部分或代码库的摘要版本来改进自动完成和代码库问答。
- 大型文档处理：将完整的长篇材料（包括图像）合并到您的提示词中，而不会增加响应延迟。
- 详细指令集：共享广泛的指令、程序和示例列表以微调 Claude 的响应。开发人员通常在提示词中包含一两个示例，但使用提示词缓存，您可以通过包含 20 多个高质量答案的多样化示例来获得更好的性能。
- 代理工具使用：增强涉及多个工具调用和迭代代码更改的场景的性能，其中每个步骤通常需要新的 API 调用。
- 与书籍、论文、文档、播客转录和其他长篇内容交流：通过将整个文档嵌入提示词中并让用户提出问题来激活任何知识库。

### 排除常见问题

如果遇到意外行为：

- 确保缓存部分相同，并在调用中的相同位置用 cache_control 标记
- 检查调用是否在缓存生命周期内进行（默认 5 分钟）
- 验证 `tool_choice` 和图像使用在调用之间保持一致
- 验证您正在缓存至少最少数量的令牌
- 系统自动检查先前内容块边界处的缓存命中（在您的断点之前约 20 个块）。对于超过 20 个内容块的提示词，您可能需要在提示词中较早的位置添加额外的 `cache_control` 参数以确保所有内容都可以缓存
- 验证 `tool_use` 内容块中的键具有稳定的顺序，因为某些语言（例如 Swift、Go）在 JSON 转换期间随机化键顺序，破坏缓存

<Note>
对 `tool_choice` 的更改或提示词中任何位置的图像的存在/不存在将使缓存失效，需要创建新的缓存条目。有关缓存失效的更多详细信息，请参阅[什么使缓存失效](#what-invalidates-the-cache)。
</Note>

### 使用思考块进行缓存

当使用[扩展思考](/docs/zh-CN/build-with-claude/extended-thinking)与提示词缓存时，思考块具有特殊行为：

**与其他内容自动缓存**：虽然思考块无法用 `cache_control` 显式标记，但当您使用工具结果进行后续 API 调用时，它们会作为请求内容的一部分被缓存。这通常在工具使用期间发生，当您将思考块传回以继续对话时。

**输入令牌计数**：当思考块从缓存读取时，它们在您的使用指标中计为输入令牌。这对于成本计算和令牌预算很重要。

**缓存失效模式**：
- 当仅提供工具结果作为用户消息时，缓存保持有效
- 当添加非工具结果用户内容时，缓存失效，导致所有先前的思考块被删除
- 即使没有显式 `cache_control` 标记，也会发生此缓存行为

有关缓存失效的更多详细信息，请参阅[什么使缓存失效](#what-invalidates-the-cache)。

**工具使用示例**：
```
请求 1：用户："巴黎的天气怎么样？"
响应：[thinking_block_1] + [tool_use 块 1]

请求 2：
用户：["巴黎的天气怎么样？"],
助手：[thinking_block_1] + [tool_use 块 1],
用户：[tool_result_1, cache=True]
响应：[thinking_block_2] + [文本块 2]
# 请求 2 缓存其请求内容（不是响应）
# 缓存包括：用户消息、thinking_block_1、tool_use 块 1 和 tool_result_1

请求 3：
用户：["巴黎的天气怎么样？"],
助手：[thinking_block_1] + [tool_use 块 1],
用户：[tool_result_1, cache=True],
助手：[thinking_block_2] + [文本块 2],
用户：[文本响应, cache=True]
# 非工具结果用户块指定新的助手循环，所有先前的思考块都被忽略
# 此请求的处理方式就像思考块从未存在过一样
```

当包含非工具结果用户块时，它指定新的助手循环，所有先前的思考块都从上下文中删除。

有关更多详细信息，请参阅[扩展思考文档](/docs/zh-CN/build-with-claude/extended-thinking#understanding-thinking-block-caching-behavior)。

---
## 缓存存储和共享

- **组织隔离**：缓存在组织之间隔离。不同的组织永远不会共享缓存，即使他们使用相同的提示词。

- **精确匹配**：缓存命中需要 100% 相同的提示词段，包括直到并包括用缓存控制标记的块的所有文本和图像。

- **输出令牌生成**：提示词缓存对输出令牌生成没有影响。您收到的响应将与不使用提示词缓存时收到的响应相同。

---
## 1 小时缓存持续时间

如果您发现 5 分钟太短，Anthropic 还提供 1 小时的缓存持续时间[需额外付费](#pricing)。

要使用扩展缓存，请在 `cache_control` 定义中包含 `ttl`，如下所示：
```json
"cache_control": {
    "type": "ephemeral",
    "ttl": "5m" | "1h"
}
```

响应将包含详细的缓存信息，如下所示：
```json
{
    "usage": {
        "input_tokens": ...,
        "cache_read_input_tokens": ...,
        "cache_creation_input_tokens": ...,
        "output_tokens": ...,

        "cache_creation": {
            "ephemeral_5m_input_tokens": 456,
            "ephemeral_1h_input_tokens": 100,
        }
    }
}
```

请注意，当前 `cache_creation_input_tokens` 字段等于 `cache_creation` 对象中值的总和。

### 何时使用 1 小时缓存

如果您有定期使用的提示词（即每 5 分钟以上使用一次的系统提示词），继续使用 5 分钟缓存，因为这将继续以无额外成本的方式刷新。

1 小时缓存最适合用于以下场景：
- 当您有可能每 5 分钟以上使用一次，但每小时以上使用一次的提示词时。例如，当代理端代理将花费超过 5 分钟时，或当存储与用户的长聊天对话时，您通常期望该用户可能在接下来的 5 分钟内不会响应。
- 当延迟很重要且您的后续提示词可能在 5 分钟后发送时。
- 当您想改进速率限制利用时，因为缓存命中不会从您的速率限制中扣除。

<Note>
5 分钟和 1 小时缓存在延迟方面的行为相同。对于长文档，您通常会看到改进的首令牌时间。
</Note>

### 混合不同的 TTL

您可以在同一请求中使用 1 小时和 5 分钟的缓存控制，但有一个重要的限制：较长 TTL 的缓存条目必须出现在较短 TTL 之前（即 1 小时缓存条目必须出现在任何 5 分钟缓存条目之前）。

混合 TTL 时，我们在您的提示词中确定三个计费位置：
1. 位置 `A`：最高缓存命中处的令牌计数（如果没有命中则为 0）。
2. 位置 `B`：`A` 之后最高 1 小时 `cache_control` 块处的令牌计数（如果不存在则等于 `A`）。
3. 位置 `C`：最后一个 `cache_control` 块处的令牌计数。

<Note>
如果 `B` 和/或 `C` 大于 `A`，它们必然是缓存未命中，因为 `A` 是最高缓存命中。
</Note>

您将被收费：
1. `A` 的缓存读取令牌。
2. `(B - A)` 的 1 小时缓存写入令牌。
3. `(C - B)` 的 5 分钟缓存写入令牌。

以下是 3 个示例。这描绘了 3 个请求的输入令牌，每个请求都有不同的缓存命中和缓存未命中。每个都有不同的计算定价，如彩色框所示。
![混合 TTL 图表](/docs/images/prompt-cache-mixed-ttl.svg)

---

## 提示词缓存示例

为了帮助您开始使用提示词缓存，我们准备了一个[提示词缓存食谱](https://github.com/anthropics/anthropic-cookbook/blob/main/misc/prompt_caching.ipynb)，其中包含详细的示例和最佳实践。

下面，我们包含了几个代码片段，展示了各种提示词缓存模式。这些示例演示了如何在不同场景中实现缓存，帮助您理解此功能的实际应用：

<section title="大型上下文缓存示例">

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "system": [
        {
            "type": "text",
            "text": "You are an AI assistant tasked with analyzing legal documents."
        },
        {
            "type": "text",
            "text": "Here is the full text of a complex legal agreement: [Insert full text of a 50-page legal agreement here]",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    "messages": [
        {
            "role": "user",
            "content": "What are the key terms and conditions in this agreement?"
        }
    ]
}'
```

```python Python
import anthropic
client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": "You are an AI assistant tasked with analyzing legal documents."
        },
        {
            "type": "text",
            "text": "Here is the full text of a complex legal agreement: [Insert full text of a 50-page legal agreement here]",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        {
            "role": "user",
            "content": "What are the key terms and conditions in this agreement?"
        }
    ]
)
print(response.model_dump_json())
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  system: [
    {
        "type": "text",
        "text": "You are an AI assistant tasked with analyzing legal documents."
    },
    {
        "type": "text",
        "text": "Here is the full text of a complex legal agreement: [Insert full text of a 50-page legal agreement here]",
        "cache_control": {"type": "ephemeral"}
    }
  ],
  messages: [
    {
        "role": "user",
        "content": "What are the key terms and conditions in this agreement?"
    }
  ]
});
console.log(response);
```

```java Java
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;

public class LegalDocumentAnalysisExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                .systemOfTextBlockParams(List.of(
                        TextBlockParam.builder()
                                .text("You are an AI assistant tasked with analyzing legal documents.")
                                .build(),
                        TextBlockParam.builder()
                                .text("Here is the full text of a complex legal agreement: [Insert full text of a 50-page legal agreement here]")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build()
                ))
                .addUserMessage("What are the key terms and conditions in this agreement?")
                .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>
此示例演示了基本的提示词缓存用法，将法律协议的完整文本缓存为前缀，同时保持用户指令未缓存。

对于第一个请求：
- `input_tokens`：仅用户消息中的令牌数
- `cache_creation_input_tokens`：整个系统消息中的令牌数，包括法律文档
- `cache_read_input_tokens`：0（第一个请求时没有缓存命中）

对于缓存生命周期内的后续请求：
- `input_tokens`：仅用户消息中的令牌数
- `cache_creation_input_tokens`：0（没有新的缓存创建）
- `cache_read_input_tokens`：整个缓存系统消息中的令牌数

</section>
<section title="缓存工具定义">

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "tools": [
        {
            "name": "get_weather",
            "description": "Get the current weather in a given location",
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "The city and state, e.g. San Francisco, CA"
                    },
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"],
                        "description": "The unit of temperature, either celsius or fahrenheit"
                    }
                },
                "required": ["location"]
            }
        },
        # many more tools
        {
            "name": "get_time",
            "description": "Get the current time in a given time zone",
            "input_schema": {
                "type": "object",
                "properties": {
                    "timezone": {
                        "type": "string",
                        "description": "The IANA time zone name, e.g. America/Los_Angeles"
                    }
                },
                "required": ["timezone"]
            },
            "cache_control": {"type": "ephemeral"}
        }
    ],
    "messages": [
        {
            "role": "user",
            "content": "What is the weather and time in New York?"
        }
    ]
}'
```

```python Python
import anthropic
client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[
        {
            "name": "get_weather",
            "description": "Get the current weather in a given location",
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "The city and state, e.g. San Francisco, CA"
                    },
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"],
                        "description": "The unit of temperature, either 'celsius' or 'fahrenheit'"
                    }
                },
                "required": ["location"]
            },
        },
        # many more tools
        {
            "name": "get_time",
            "description": "Get the current time in a given time zone",
            "input_schema": {
                "type": "object",
                "properties": {
                    "timezone": {
                        "type": "string",
                        "description": "The IANA time zone name, e.g. America/Los_Angeles"
                    }
                },
                "required": ["timezone"]
            },
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        {
            "role": "user",
            "content": "What's the weather and time in New York?"
        }
    ]
)
print(response.model_dump_json())
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    tools=[
        {
            "name": "get_weather",
            "description": "Get the current weather in a given location",
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "The city and state, e.g. San Francisco, CA"
                    },
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"],
                        "description": "The unit of temperature, either 'celsius' or 'fahrenheit'"
                    }
                },
                "required": ["location"]
            },
        },
        // many more tools
        {
            "name": "get_time",
            "description": "Get the current time in a given time zone",
            "input_schema": {
                "type": "object",
                "properties": {
                    "timezone": {
                        "type": "string",
                        "description": "The IANA time zone name, e.g. America/Los_Angeles"
                    }
                },
                "required": ["timezone"]
            },
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages: [
        {
            "role": "user",
            "content": "What's the weather and time in New York?"
        }
    ]
});
console.log(response);
```

```java Java
import java.util.List;
import java.util.Map;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.JsonValue;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.Tool;
import com.anthropic.models.messages.Tool.InputSchema;

public class ToolsWithCacheControlExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Weather tool schema
        InputSchema weatherSchema = InputSchema.builder()
                .properties(JsonValue.from(Map.of(
                        "location", Map.of(
                                "type", "string",
                                "description", "The city and state, e.g. San Francisco, CA"
                        ),
                        "unit", Map.of(
                                "type", "string",
                                "enum", List.of("celsius", "fahrenheit"),
                                "description", "The unit of temperature, either celsius or fahrenheit"
                        )
                )))
                .putAdditionalProperty("required", JsonValue.from(List.of("location")))
                .build();

        // Time tool schema
        InputSchema timeSchema = InputSchema.builder()
                .properties(JsonValue.from(Map.of(
                        "timezone", Map.of(
                                "type", "string",
                                "description", "The IANA time zone name, e.g. America/Los_Angeles"
                        )
                )))
                .putAdditionalProperty("required", JsonValue.from(List.of("timezone")))
                .build();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                .addTool(Tool.builder()
                        .name("get_weather")
                        .description("Get the current weather in a given location")
                        .inputSchema(weatherSchema)
                        .build())
                .addTool(Tool.builder()
                        .name("get_time")
                        .description("Get the current time in a given time zone")
                        .inputSchema(timeSchema)
                        .cacheControl(CacheControlEphemeral.builder().build())
                        .build())
                .addUserMessage("What is the weather and time in New York?")
                .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>

在此示例中，我们演示了缓存工具定义。

`cache_control` 参数放在最后一个工具（`get_time`）上，以将所有工具指定为静态前缀的一部分。

这意味着所有工具定义，包括 `get_weather` 和在 `get_time` 之前定义的任何其他工具，都将被缓存为单个前缀。

当您有一组一致的工具想要在多个请求中重复使用而无需每次都重新处理它们时，这种方法很有用。

对于第一个请求：
- `input_tokens`：用户消息中的令牌数
- `cache_creation_input_tokens`：所有工具定义和系统提示中的令牌数
- `cache_read_input_tokens`：0（第一个请求时没有缓存命中）

对于缓存生命周期内的后续请求：
- `input_tokens`：用户消息中的令牌数
- `cache_creation_input_tokens`：0（没有新的缓存创建）
- `cache_read_input_tokens`：所有缓存工具定义和系统提示中的令牌数

</section>

<section title="继续多轮对话">

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "system": [
        {
            "type": "text",
            "text": "...long system prompt",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Hello, can you tell me more about the solar system?",
                }
            ]
        },
        {
            "role": "assistant",
            "content": "Certainly! The solar system is the collection of celestial bodies that orbit our Sun. It consists of eight planets, numerous moons, asteroids, comets, and other objects. The planets, in order from closest to farthest from the Sun, are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet has its own unique characteristics and features. Is there a specific aspect of the solar system you would like to know more about?"
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Good to know."
                },
                {
                    "type": "text",
                    "text": "Tell me more about Mars.",
                    "cache_control": {"type": "ephemeral"}
                }
            ]
        }
    ]
}'
```

```python Python
import anthropic
client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": "...long system prompt",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        # ...long conversation so far
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Hello, can you tell me more about the solar system?",
                }
            ]
        },
        {
            "role": "assistant",
            "content": "Certainly! The solar system is the collection of celestial bodies that orbit our Sun. It consists of eight planets, numerous moons, asteroids, comets, and other objects. The planets, in order from closest to farthest from the Sun, are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet has its own unique characteristics and features. Is there a specific aspect of the solar system you'd like to know more about?"
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Good to know."
                },
                {
                    "type": "text",
                    "text": "Tell me more about Mars.",
                    "cache_control": {"type": "ephemeral"}
                }
            ]
        }
    ]
)
print(response.model_dump_json())
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    system=[
        {
            "type": "text",
            "text": "...long system prompt",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        // ...long conversation so far
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Hello, can you tell me more about the solar system?",
                }
            ]
        },
        {
            "role": "assistant",
            "content": "Certainly! The solar system is the collection of celestial bodies that orbit our Sun. It consists of eight planets, numerous moons, asteroids, comets, and other objects. The planets, in order from closest to farthest from the Sun, are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet has its own unique characteristics and features. Is there a specific aspect of the solar system you'd like to know more about?"
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Good to know."
                },
                {
                    "type": "text",
                    "text": "Tell me more about Mars.",
                    "cache_control": {"type": "ephemeral"}
                }
            ]
        }
    ]
});
console.log(response);
```

```java Java
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.ContentBlockParam;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;

public class ConversationWithCacheControlExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Create ephemeral system prompt
        TextBlockParam systemPrompt = TextBlockParam.builder()
                .text("...long system prompt")
                .cacheControl(CacheControlEphemeral.builder().build())
                .build();

        // Create message params
        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                .systemOfTextBlockParams(List.of(systemPrompt))
                // First user message (without cache control)
                .addUserMessage("Hello, can you tell me more about the solar system?")
                // Assistant response
                .addAssistantMessage("Certainly! The solar system is the collection of celestial bodies that orbit our Sun. It consists of eight planets, numerous moons, asteroids, comets, and other objects. The planets, in order from closest to farthest from the Sun, are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet has its own unique characteristics and features. Is there a specific aspect of the solar system you would like to know more about?")
                // Second user message (with cache control)
                .addUserMessageOfBlockParams(List.of(
                        ContentBlockParam.ofText(TextBlockParam.builder()
                                .text("Good to know.")
                                .build()),
                        ContentBlockParam.ofText(TextBlockParam.builder()
                                .text("Tell me more about Mars.")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build())
                ))
                .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>

在此示例中，我们演示了如何在多轮对话中使用提示词缓存。

在每个轮次中，我们用 `cache_control` 标记最后一条消息的最后一个块，以便对话可以逐步缓存。系统将自动查找并使用最长的先前缓存块序列用于后续消息。也就是说，之前用 `cache_control` 块标记的块稍后不会被标记，但如果它们在 5 分钟内被命中，它们仍然会被视为缓存命中（也是缓存刷新！）。

此外，请注意 `cache_control` 参数放在系统消息上。这是为了确保如果它从缓存中被逐出（在 5 分钟以上未使用后），它将在下一个请求中被添加回缓存。

这种方法对于在进行中的对话中维护上下文而无需重复处理相同信息很有用。

当正确设置时，您应该在每个请求的使用响应中看到以下内容：
- `input_tokens`：新用户消息中的令牌数（将很少）
- `cache_creation_input_tokens`：新的助手和用户轮次中的令牌数
- `cache_read_input_tokens`：对话中到上一个轮次为止的令牌数

</section>

<section title="综合示例：多个缓存断点">

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "tools": [
        {
            "name": "search_documents",
            "description": "Search through the knowledge base",
            "input_schema": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Search query"
                    }
                },
                "required": ["query"]
            }
        },
        {
            "name": "get_document",
            "description": "Retrieve a specific document by ID",
            "input_schema": {
                "type": "object",
                "properties": {
                    "doc_id": {
                        "type": "string",
                        "description": "Document ID"
                    }
                },
                "required": ["doc_id"]
            },
            "cache_control": {"type": "ephemeral"}
        }
    ],
    "system": [
        {
            "type": "text",
            "text": "You are a helpful research assistant with access to a document knowledge base.\n\n# Instructions\n- Always search for relevant documents before answering\n- Provide citations for your sources\n- Be objective and accurate in your responses\n- If multiple documents contain relevant information, synthesize them\n- Acknowledge when information is not available in the knowledge base",
            "cache_control": {"type": "ephemeral"}
        },
        {
            "type": "text",
            "text": "# Knowledge Base Context\n\nHere are the relevant documents for this conversation:\n\n## Document 1: Solar System Overview\nThe solar system consists of the Sun and all objects that orbit it...\n\n## Document 2: Planetary Characteristics\nEach planet has unique features. Mercury is the smallest planet...\n\n## Document 3: Mars Exploration\nMars has been a target of exploration for decades...\n\n[Additional documents...]",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    "messages": [
        {
            "role": "user",
            "content": "Can you search for information about Mars rovers?"
        },
        {
            "role": "assistant",
            "content": [
                {
                    "type": "tool_use",
                    "id": "tool_1",
                    "name": "search_documents",
                    "input": {"query": "Mars rovers"}
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "tool_result",
                    "tool_use_id": "tool_1",
                    "content": "Found 3 relevant documents: Document 3 (Mars Exploration), Document 7 (Rover Technology), Document 9 (Mission History)"
                }
            ]
        },
        {
            "role": "assistant",
            "content": [
                {
                    "type": "text",
                    "text": "I found 3 relevant documents about Mars rovers. Let me get more details from the Mars Exploration document."
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Yes, please tell me about the Perseverance rover specifically.",
                    "cache_control": {"type": "ephemeral"}
                }
            ]
        }
    ]
}'
```

```python Python
import anthropic
client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[
        {
            "name": "search_documents",
            "description": "Search through the knowledge base",
            "input_schema": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Search query"
                    }
                },
                "required": ["query"]
            }
        },
        {
            "name": "get_document",
            "description": "Retrieve a specific document by ID",
            "input_schema": {
                "type": "object",
                "properties": {
                    "doc_id": {
                        "type": "string",
                        "description": "Document ID"
                    }
                },
                "required": ["doc_id"]
            },
            "cache_control": {"type": "ephemeral"}
        }
    ],
    system=[
        {
            "type": "text",
            "text": "You are a helpful research assistant with access to a document knowledge base.\n\n# Instructions\n- Always search for relevant documents before answering\n- Provide citations for your sources\n- Be objective and accurate in your responses\n- If multiple documents contain relevant information, synthesize them\n- Acknowledge when information is not available in the knowledge base",
            "cache_control": {"type": "ephemeral"}
        },
        {
            "type": "text",
            "text": "# Knowledge Base Context\n\nHere are the relevant documents for this conversation:\n\n## Document 1: Solar System Overview\nThe solar system consists of the Sun and all objects that orbit it...\n\n## Document 2: Planetary Characteristics\nEach planet has unique features. Mercury is the smallest planet...\n\n## Document 3: Mars Exploration\nMars has been a target of exploration for decades...\n\n[Additional documents...]",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        {
            "role": "user",
            "content": "Can you search for information about Mars rovers?"
        },
        {
            "role": "assistant",
            "content": [
                {
                    "type": "tool_use",
                    "id": "tool_1",
                    "name": "search_documents",
                    "input": {"query": "Mars rovers"}
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "tool_result",
                    "tool_use_id": "tool_1",
                    "content": "Found 3 relevant documents: Document 3 (Mars Exploration), Document 7 (Rover Technology), Document 9 (Mission History)"
                }
            ]
        },
        {
            "role": "assistant",
            "content": [
                {
                    "type": "text",
                    "text": "I found 3 relevant documents about Mars rovers. Let me get more details from the Mars Exploration document."
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Yes, please tell me about the Perseverance rover specifically.",
                    "cache_control": {"type": "ephemeral"}
                }
            ]
        }
    ]
)
print(response.model_dump_json())
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    tools: [
        {
            name: "search_documents",
            description: "Search through the knowledge base",
            input_schema: {
                type: "object",
                properties: {
                    query: {
                        type: "string",
                        description: "Search query"
                    }
                },
                required: ["query"]
            }
        },
        {
            name: "get_document",
            description: "Retrieve a specific document by ID",
            input_schema: {
                type: "object",
                properties: {
                    doc_id: {
                        type: "string",
                        description: "Document ID"
                    }
                },
                required: ["doc_id"]
            },
            cache_control: { type: "ephemeral" }
        }
    ],
    system: [
        {
            type: "text",
            text: "You are a helpful research assistant with access to a document knowledge base.\n\n# Instructions\n- Always search for relevant documents before answering\n- Provide citations for your sources\n- Be objective and accurate in your responses\n- If multiple documents contain relevant information, synthesize them\n- Acknowledge when information is not available in the knowledge base",
            cache_control: { type: "ephemeral" }
        },
        {
            type: "text",
            text: "# Knowledge Base Context\n\nHere are the relevant documents for this conversation:\n\n## Document 1: Solar System Overview\nThe solar system consists of the Sun and all objects that orbit it...\n\n## Document 2: Planetary Characteristics\nEach planet has unique features. Mercury is the smallest planet...\n\n## Document 3: Mars Exploration\nMars has been a target of exploration for decades...\n\n[Additional documents...]",
            cache_control: { type: "ephemeral" }
        }
    ],
    messages: [
        {
            role: "user",
            content: "Can you search for information about Mars rovers?"
        },
        {
            role: "assistant",
            content: [
                {
                    type: "tool_use",
                    id: "tool_1",
                    name: "search_documents",
                    input: { query: "Mars rovers" }
                }
            ]
        },
        {
            role: "user",
            content: [
                {
                    type: "tool_result",
                    tool_use_id: "tool_1",
                    content: "Found 3 relevant documents: Document 3 (Mars Exploration), Document 7 (Rover Technology), Document 9 (Mission History)"
                }
            ]
        },
        {
            role: "assistant",
            content: [
                {
                    type: "text",
                    text: "I found 3 relevant documents about Mars rovers. Let me get more details from the Mars Exploration document."
                }
            ]
        },
        {
            role: "user",
            content: [
                {
                    type: "text",
                    text: "Yes, please tell me about the Perseverance rover specifically.",
                    cache_control: { type: "ephemeral" }
                }
            ]
        }
    ]
});
console.log(response);
```

```java Java
import java.util.List;
import java.util.Map;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.JsonValue;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.ContentBlockParam;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;
import com.anthropic.models.messages.Tool;
import com.anthropic.models.messages.Tool.InputSchema;
import com.anthropic.models.messages.ToolResultBlockParam;
import com.anthropic.models.messages.ToolUseBlockParam;

public class MultipleCacheBreakpointsExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Search tool schema
        InputSchema searchSchema = InputSchema.builder()
                .properties(JsonValue.from(Map.of(
                        "query", Map.of(
                                "type", "string",
                                "description", "Search query"
                        )
                )))
                .putAdditionalProperty("required", JsonValue.from(List.of("query")))
                .build();

        // Get document tool schema
        InputSchema getDocSchema = InputSchema.builder()
                .properties(JsonValue.from(Map.of(
                        "doc_id", Map.of(
                                "type", "string",
                                "description", "Document ID"
                        )
                )))
                .putAdditionalProperty("required", JsonValue.from(List.of("doc_id")))
                .build();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                // Tools with cache control on the last one
                .addTool(Tool.builder()
                        .name("search_documents")
                        .description("Search through the knowledge base")
                        .inputSchema(searchSchema)
                        .build())
                .addTool(Tool.builder()
                        .name("get_document")
                        .description("Retrieve a specific document by ID")
                        .inputSchema(getDocSchema)
                        .cacheControl(CacheControlEphemeral.builder().build())
                        .build())
                // System prompts with cache control on instructions and context separately
                .systemOfTextBlockParams(List.of(
                        TextBlockParam.builder()
                                .text("You are a helpful research assistant with access to a document knowledge base.\n\n# Instructions\n- Always search for relevant documents before answering\n- Provide citations for your sources\n- Be objective and accurate in your responses\n- If multiple documents contain relevant information, synthesize them\n- Acknowledge when information is not available in the knowledge base")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build(),
                        TextBlockParam.builder()
                                .text("# Knowledge Base Context\n\nHere are the relevant documents for this conversation:\n\n## Document 1: Solar System Overview\nThe solar system consists of the Sun and all objects that orbit it...\n\n## Document 2: Planetary Characteristics\nEach planet has unique features. Mercury is the smallest planet...\n\n## Document 3: Mars Exploration\nMars has been a target of exploration for decades...\n\n[Additional documents...]")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build()
                ))
                // Conversation history
                .addUserMessage("Can you search for information about Mars rovers?")
                .addAssistantMessageOfBlockParams(List.of(
                        ContentBlockParam.ofToolUse(ToolUseBlockParam.builder()
                                .id("tool_1")
                                .name("search_documents")
                                .input(JsonValue.from(Map.of("query", "Mars rovers")))
                                .build())
                ))
                .addUserMessageOfBlockParams(List.of(
                        ContentBlockParam.ofToolResult(ToolResultBlockParam.builder()
                                .toolUseId("tool_1")
                                .content("Found 3 relevant documents: Document 3 (Mars Exploration), Document 7 (Rover Technology), Document 9 (Mission History)")
                                .build())
                ))
                .addAssistantMessageOfBlockParams(List.of(
                        ContentBlockParam.ofText(TextBlockParam.builder()
                                .text("I found 3 relevant documents about Mars rovers. Let me get more details from the Mars Exploration document.")
                                .build())
                ))
                .addUserMessageOfBlockParams(List.of(
                        ContentBlockParam.ofText(TextBlockParam.builder()
                                .text("Yes, please tell me about the Perseverance rover specifically.")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build())
                ))
                .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>

这个综合示例演示了如何使用所有 4 个可用的缓存断点来优化提示词的不同部分：

1. **工具缓存**（缓存断点 1）：最后一个工具定义上的 `cache_control` 参数缓存所有工具定义。

2. **可重用指令缓存**（缓存断点 2）：系统提示中的静态指令被单独缓存。这些指令在请求之间很少改变。

3. **RAG 上下文缓存**（缓存断点 3）：知识库文档被独立缓存，允许您更新 RAG 文档而不会使工具或指令缓存失效。

4. **对话历史缓存**（缓存断点 4）：助手的响应用 `cache_control` 标记，以在对话进行时启用增量缓存。

这种方法提供了最大的灵活性：
- 如果您只更新最后的用户消息，所有四个缓存段都会被重用
- 如果您更新 RAG 文档但保持相同的工具和指令，前两个缓存段会被重用
- 如果您更改对话但保持相同的工具、指令和文档，前三个段会被重用
- 每个缓存断点可以根据应用程序中的更改内容独立失效

对于第一个请求：
- `input_tokens`：最后一条用户消息中的令牌数
- `cache_creation_input_tokens`：所有缓存段中的令牌数（工具 + 指令 + RAG 文档 + 对话历史）
- `cache_read_input_tokens`：0（没有缓存命中）

对于后续仅有新用户消息的请求：
- `input_tokens`：仅新用户消息中的令牌数
- `cache_creation_input_tokens`：添加到对话历史的任何新令牌
- `cache_read_input_tokens`：所有先前缓存的令牌（工具 + 指令 + RAG 文档 + 先前对话）

这种模式特别强大，适用于：
- 具有大型文档上下文的 RAG 应用程序
- 使用多个工具的代理系统
- 需要维护上下文的长期运行对话
- 需要独立优化提示词不同部分的应用程序

</section>

---
## 常见问题

  <section title="我需要多个缓存断点还是在末尾放一个就足够了？">

    **在大多数情况下，在静态内容末尾放一个缓存断点就足够了。** 系统会自动检查所有先前内容块边界处的缓存命中（缓存断点前最多 20 个块），并使用最长的匹配缓存块序列。

    您只需要多个断点，如果：
    - 您在所需缓存点之前有超过 20 个内容块
    - 您想独立缓存以不同频率更新的部分
    - 您需要显式控制为了成本优化而缓存的内容

    示例：如果您有系统指令（很少改变）和 RAG 上下文（每天改变），您可能会使用两个断点来单独缓存它们。
  
</section>

  <section title="缓存断点会增加额外成本吗？">

    不，缓存断点本身是免费的。您只需支付：
    - 将内容写入缓存（比基础输入令牌多 25%，用于 5 分钟 TTL）
    - 从缓存读取（基础输入令牌价格的 10%）
    - 未缓存内容的常规输入令牌

    断点的数量不会影响定价 - 只有缓存和读取的内容量才重要。
  
</section>

  <section title="我如何从使用字段计算总输入令牌？">

    使用响应包括三个单独的输入令牌字段，它们共同代表您的总输入：

    ```
    total_input_tokens = cache_read_input_tokens + cache_creation_input_tokens + input_tokens
    ```

    - `cache_read_input_tokens`：从缓存检索的令牌（缓存断点之前被缓存的所有内容）
    - `cache_creation_input_tokens`：被写入缓存的新令牌（在缓存断点处）
    - `input_tokens`：最后一个缓存断点之后未被缓存的令牌

    **重要：** `input_tokens` 不代表所有输入令牌 - 仅代表最后一个缓存断点之后的部分。如果您有缓存内容，`input_tokens` 通常会比总输入小得多。

    **示例：** 使用 200K 令牌文档缓存和 50 令牌用户问题：
    - `cache_read_input_tokens`：200,000
    - `cache_creation_input_tokens`：0
    - `input_tokens`：50
    - **总计**：200,050 令牌

    这个分解对于理解您的成本和速率限制使用至关重要。有关更多详细信息，请参阅[跟踪缓存性能](#tracking-cache-performance)。
  
</section>

  <section title="缓存生命周期是多少？">

    缓存的默认最小生命周期（TTL）是 5 分钟。每次使用缓存内容时，此生命周期都会刷新。

    如果您发现 5 分钟太短，Anthropic 还提供了[1 小时缓存 TTL](#1-hour-cache-duration)。
  
</section>

  <section title="我可以使用多少个缓存断点？">

    您可以在提示词中定义最多 4 个缓存断点（使用 `cache_control` 参数）。
  
</section>

  <section title="提示词缓存是否适用于所有模型？">

    不，提示词缓存目前仅适用于 Claude Opus 4.5、Claude Opus 4.1、Claude Opus 4、Claude Sonnet 4.5、Claude Sonnet 4、Claude Sonnet 3.7（[已弃用](/docs/zh-CN/about-claude/model-deprecations)）、Claude Haiku 4.5、Claude Haiku 3.5、Claude Haiku 3 和 Claude Opus 3（[已弃用](/docs/zh-CN/about-claude/model-deprecations)）。
  
</section>

  <section title="提示词缓存如何与扩展思考一起工作？">

    当思考参数改变时，缓存的系统提示和工具将被重用。但是，思考改变（启用/禁用或预算改变）将使具有消息内容的先前缓存提示前缀失效。

    有关缓存失效的更多详细信息，请参阅[什么使缓存失效](#what-invalidates-the-cache)。

    有关扩展思考的更多信息，包括其与工具使用和提示词缓存的交互，请参阅[扩展思考文档](/docs/zh-CN/build-with-claude/extended-thinking#extended-thinking-and-prompt-caching)。
  
</section>

  <section title="我如何启用提示词缓存？">

    要启用提示词缓存，请在 API 请求中包含至少一个 `cache_control` 断点。
  
</section>

  <section title="我可以将提示词缓存与其他 API 功能一起使用吗？">

    是的，提示词缓存可以与其他 API 功能（如工具使用和视觉功能）一起使用。但是，改变提示词中是否有图像或修改工具使用设置将破坏缓存。

    有关缓存失效的更多详细信息，请参阅[什么使缓存失效](#what-invalidates-the-cache)。
  
</section>

  <section title="提示词缓存如何影响定价？">

    提示词缓存引入了新的定价结构，其中缓存写入成本比基础输入令牌多 25%，而缓存命中仅成本基础输入令牌价格的 10%。
  
</section>

  <section title="我可以手动清除缓存吗？">

    目前，没有办法手动清除缓存。缓存前缀在最少 5 分钟不活动后自动过期。
  
</section>

  <section title="我如何跟踪缓存策略的有效性？">

    您可以使用 API 响应中的 `cache_creation_input_tokens` 和 `cache_read_input_tokens` 字段监控缓存性能。
  
</section>

  <section title="什么会破坏缓存？">

    有关缓存失效的更多详细信息，请参阅[什么使缓存失效](#what-invalidates-the-cache)，其中包括需要创建新缓存条目的更改列表。
  
</section>

  <section title="提示词缓存如何处理隐私和数据分离？">

提示词缓存采用强隐私和数据分离措施设计：

1. 缓存键使用提示词的加密哈希生成，直到缓存控制点。这意味着只有具有相同提示词的请求才能访问特定缓存。

2. 缓存是特定于组织的。同一组织内的用户如果使用相同的提示词可以访问相同的缓存，但缓存不会在不同组织之间共享，即使对于相同的提示词也是如此。

3. 缓存机制旨在维护每个唯一对话或上下文的完整性和隐私。

4. 在提示词中的任何地方使用 `cache_control` 是安全的。为了成本效率，最好将高度可变的部分（例如，用户的任意输入）排除在缓存之外。

这些措施确保提示词缓存在提供性能优势的同时维护数据隐私和安全。
  
</section>
  <section title="我可以将提示词缓存与批处理 API 一起使用吗？">

    是的，可以将提示词缓存与您的[批处理 API](/docs/zh-CN/build-with-claude/batch-processing) 请求一起使用。但是，由于异步批处理请求可以并发处理且顺序任意，缓存命中是尽力而为的基础。

    [1 小时缓存](#1-hour-cache-duration)可以帮助改进您的缓存命中。最具成本效益的使用方式如下：
    - 收集一组具有共享前缀的消息请求。
    - 发送仅包含此共享前缀和 1 小时缓存块的单个请求的批处理请求。这将被写入 1 小时缓存。
    - 完成后立即提交其余请求。您必须监控作业以了解何时完成。

    这通常比使用 5 分钟缓存更好，因为批处理请求通常需要 5 分钟到 1 小时才能完成。我们正在考虑改进这些缓存命中率并使此过程更加直接的方法。
  
</section>
  <section title="为什么我在 Python 中看到错误 `AttributeError: 'Beta' object has no attribute 'prompt_caching'`？">

  当您升级了 SDK 或使用过时的代码示例时，通常会出现此错误。提示词缓存现在已正式推出，因此您不再需要 beta 前缀。而不是：
    <CodeGroup>
      ```python Python
      python client.beta.prompt_caching.messages.create(...)
      ```
    </CodeGroup>
    只需使用：
    <CodeGroup>
      ```python Python
      python client.messages.create(...)
      ```
    </CodeGroup>
  
</section>
  <section title="为什么我看到 'TypeError: Cannot read properties of undefined (reading 'messages')'？">

  当您升级了 SDK 或使用过时的代码示例时，通常会出现此错误。提示词缓存现在已正式推出，因此您不再需要 beta 前缀。而不是：

      ```typescript TypeScript
      client.beta.promptCaching.messages.create(...)
      ```

      只需使用：

      ```typescript
      client.messages.create(...)
      ```
  
</section>