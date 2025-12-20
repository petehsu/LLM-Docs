# 使用扩展思考进行构建

扩展思考为 Claude 提供了增强的推理能力，用于处理复杂任务，同时在提供最终答案之前提供不同级别的透明度来了解其逐步思考过程。

---

扩展思考为 Claude 提供了增强的推理能力，用于处理复杂任务，同时在提供最终答案之前提供不同级别的透明度来了解其逐步思考过程。

## 支持的模型

扩展思考在以下模型中受支持：

- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Sonnet 3.7 (`claude-3-7-sonnet-20250219`) ([已弃用](/docs/zh-CN/about-claude/model-deprecations))
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)
- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)

<Note>
API 行为在 Claude Sonnet 3.7 和 Claude 4 模型之间有所不同，但 API 形状保持完全相同。

有关更多信息，请参阅[不同模型版本中思考的差异](#differences-in-thinking-across-model-versions)。
</Note>

## 扩展思考的工作原理

启用扩展思考后，Claude 会创建 `thinking` 内容块，其中输出其内部推理。Claude 在制作最终响应之前会整合来自此推理的见解。

API 响应将包括 `thinking` 内容块，后跟 `text` 内容块。

以下是默认响应格式的示例：

```json
{
  "content": [
    {
      "type": "thinking",
      "thinking": "让我逐步分析这个...",
      "signature": "WaUjzkypQ2mUEVM36O2TxuC06KN8xyfbJwyem2dw3URve/op91XWHOEBLLqIOMfFG/UvLEczmEsUjavL...."
    },
    {
      "type": "text",
      "text": "根据我的分析..."
    }
  ]
}
```

有关扩展思考响应格式的更多信息，请参阅 [Messages API 参考](/docs/zh-CN/api/messages)。

## 如何使用扩展思考

以下是在 Messages API 中使用扩展思考的示例：

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 16000,
    "thinking": {
        "type": "enabled",
        "budget_tokens": 10000
    },
    "messages": [
        {
            "role": "user",
            "content": "是否存在无限多个质数使得 n mod 4 == 3？"
        }
    ]
}'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    messages=[{
        "role": "user",
        "content": "是否存在无限多个质数使得 n mod 4 == 3？"
    }]
)

# 响应将包含总结的思考块和文本块
for block in response.content:
    if block.type == "thinking":
        print(f"\n思考总结：{block.thinking}")
    elif block.type == "text":
        print(f"\n响应：{block.text}")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 16000,
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  messages: [{
    role: "user",
    content: "是否存在无限多个质数使得 n mod 4 == 3？"
  }]
});

// 响应将包含总结的思考块和文本块
for (const block of response.content) {
  if (block.type === "thinking") {
    console.log(`\n思考总结：${block.thinking}`);
  } else if (block.type === "text") {
    console.log(`\n响应：${block.text}`);
  }
}
```

```java Java
import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.beta.messages.*;
import com.anthropic.models.beta.messages.MessageCreateParams;
import com.anthropic.models.messages.*;

public class SimpleThinkingExample {
    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        BetaMessage response = client.beta().messages().create(
                MessageCreateParams.builder()
                        .model(Model.CLAUDE_OPUS_4_0)
                        .maxTokens(16000)
                        .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(10000).build())
                        .addUserMessage("是否存在无限多个质数使得 n mod 4 == 3？")
                        .build()
        );

        System.out.println(response);
    }
}
```

</CodeGroup>

要启用扩展思考，请添加一个 `thinking` 对象，将 `type` 参数设置为 `enabled`，并将 `budget_tokens` 设置为扩展思考的指定令牌预算。

`budget_tokens` 参数确定 Claude 允许用于其内部推理过程的最大令牌数。在 Claude 4 模型中，此限制适用于完整思考令牌，而不是[总结输出](#summarized-thinking)。较大的预算可以通过为复杂问题启用更彻底的分析来改进响应质量，尽管 Claude 可能不会使用整个分配的预算，特别是在 32k 以上的范围内。

`budget_tokens` 必须设置为小于 `max_tokens` 的值。但是，当使用[交错思考与工具](#interleaved-thinking)时，您可以超过此限制，因为令牌限制变成您的整个上下文窗口（200k 令牌）。

### 总结的思考

启用扩展思考后，Claude 4 模型的 Messages API 返回 Claude 完整思考过程的摘要。总结的思考提供了扩展思考的全部智能优势，同时防止了滥用。

以下是总结思考的一些重要考虑事项：

- 您需要为原始请求生成的完整思考令牌付费，而不是摘要令牌。
- 计费的输出令牌计数将**不匹配**您在响应中看到的令牌计数。
- 思考输出的前几行更详细，提供了详细的推理，这对提示工程目的特别有帮助。
- 随着 Anthropic 寻求改进扩展思考功能，总结行为可能会发生变化。
- 总结保留了 Claude 思考过程的关键思想，增加的延迟最少，实现了可流式传输的用户体验，并便于从 Claude Sonnet 3.7 迁移到 Claude 4 模型。
- 总结由与您在请求中指定的模型不同的模型处理。思考模型看不到总结的输出。

<Note>
Claude Sonnet 3.7 继续返回完整的思考输出。

在罕见情况下，如果您需要访问 Claude 4 模型的完整思考输出，请[联系我们的销售团队](mailto:sales@anthropic.com)。
</Note>

### 流式传输思考

您可以使用[服务器发送事件 (SSE)](https://developer.mozilla.org/en-US/Web/API/Server-sent%5Fevents/Using%5Fserver-sent%5Fevents) 流式传输扩展思考响应。

启用扩展思考的流式传输后，您会通过 `thinking_delta` 事件接收思考内容。

有关通过 Messages API 进行流式传输的更多文档，请参阅[流式传输消息](/docs/zh-CN/build-with-claude/streaming)。

以下是如何处理思考流式传输的方法：

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 16000,
    "stream": true,
    "thinking": {
        "type": "enabled",
        "budget_tokens": 10000
    },
    "messages": [
        {
            "role": "user",
            "content": "27 * 453 是多少？"
        }
    ]
}'
```

```python Python
import anthropic

client = anthropic.Anthropic()

with client.messages.stream(
    model="claude-sonnet-4-5",
    max_tokens=16000,
    thinking={"type": "enabled", "budget_tokens": 10000},
    messages=[{"role": "user", "content": "27 * 453 是多少？"}],
) as stream:
    thinking_started = False
    response_started = False

    for event in stream:
        if event.type == "content_block_start":
            print(f"\n开始 {event.content_block.type} 块...")
            # 为每个新块重置标志
            thinking_started = False
            response_started = False
        elif event.type == "content_block_delta":
            if event.delta.type == "thinking_delta":
                if not thinking_started:
                    print("思考：", end="", flush=True)
                    thinking_started = True
                print(event.delta.thinking, end="", flush=True)
            elif event.delta.type == "text_delta":
                if not response_started:
                    print("响应：", end="", flush=True)
                    response_started = True
                print(event.delta.text, end="", flush=True)
        elif event.type == "content_block_stop":
            print("\n块完成。")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const stream = await client.messages.stream({
  model: "claude-sonnet-4-5",
  max_tokens: 16000,
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  messages: [{
    role: "user",
    content: "27 * 453 是多少？"
  }]
});

let thinkingStarted = false;
let responseStarted = false;

for await (const event of stream) {
  if (event.type === 'content_block_start') {
    console.log(`\n开始 ${event.content_block.type} 块...`);
    // 为每个新块重置标志
    thinkingStarted = false;
    responseStarted = false;
  } else if (event.type === 'content_block_delta') {
    if (event.delta.type === 'thinking_delta') {
      if (!thinkingStarted) {
        process.stdout.write('思考：');
        thinkingStarted = true;
      }
      process.stdout.write(event.delta.thinking);
    } else if (event.delta.type === 'text_delta') {
      if (!responseStarted) {
        process.stdout.write('响应：');
        responseStarted = true;
      }
      process.stdout.write(event.delta.text);
    }
  } else if (event.type === 'content_block_stop') {
    console.log('\n块完成。');
  }
}
```

```java Java
import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.http.StreamResponse;
import com.anthropic.models.beta.messages.MessageCreateParams;
import com.anthropic.models.beta.messages.BetaRawMessageStreamEvent;
import com.anthropic.models.beta.messages.BetaThinkingConfigEnabled;
import com.anthropic.models.messages.Model;

public class SimpleThinkingStreamingExample {
    private static boolean thinkingStarted = false;
    private static boolean responseStarted = false;
    
    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        MessageCreateParams createParams = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_0)
                .maxTokens(16000)
                .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(10000).build())
                .addUserMessage("27 * 453 是多少？")
                .build();

        try (StreamResponse<BetaRawMessageStreamEvent> streamResponse =
                     client.beta().messages().createStreaming(createParams)) {
            streamResponse.stream()
                    .forEach(event -> {
                        if (event.isContentBlockStart()) {
                            System.out.printf("\n开始 %s 块...%n",
                                    event.asContentBlockStart()._type());
                            // 为每个新块重置标志
                            thinkingStarted = false;
                            responseStarted = false;
                        } else if (event.isContentBlockDelta()) {
                            var delta = event.asContentBlockDelta().delta();
                            if (delta.isBetaThinking()) {
                                if (!thinkingStarted) {
                                    System.out.print("思考：");
                                    thinkingStarted = true;
                                }
                                System.out.print(delta.asBetaThinking().thinking());
                                System.out.flush();
                            } else if (delta.isBetaText()) {
                                if (!responseStarted) {
                                    System.out.print("响应：");
                                    responseStarted = true;
                                }
                                System.out.print(delta.asBetaText().text());
                                System.out.flush();
                            }
                        } else if (event.isContentBlockStop()) {
                            System.out.println("\n块完成。");
                        }
                    });
        }
    }
}
```

</CodeGroup>

<TryInConsoleButton userPrompt="27 * 453 是多少？" thinkingBudgetTokens={16000}>
  在控制台中尝试
</TryInConsoleButton>

示例流式传输输出：
```json
event: message_start
data: {"type": "message_start", "message": {"id": "msg_01...", "type": "message", "role": "assistant", "content": [], "model": "claude-sonnet-4-5", "stop_reason": null, "stop_sequence": null}}

event: content_block_start
data: {"type": "content_block_start", "index": 0, "content_block": {"type": "thinking", "thinking": ""}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "让我逐步解决这个问题：\n\n1. 首先分解 27 * 453"}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "\n2. 453 = 400 + 50 + 3"}}

// 其他思考增量...

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "signature_delta", "signature": "EqQBCgIYAhIM1gbcDa9GJwZA2b3hGgxBdjrkzLoky3dl1pkiMOYds..."}}

event: content_block_stop
data: {"type": "content_block_stop", "index": 0}

event: content_block_start
data: {"type": "content_block_start", "index": 1, "content_block": {"type": "text", "text": ""}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 1, "delta": {"type": "text_delta", "text": "27 * 453 = 12,231"}}

// 其他文本增量...

event: content_block_stop
data: {"type": "content_block_stop", "index": 1}

event: message_delta
data: {"type": "message_delta", "delta": {"stop_reason": "end_turn", "stop_sequence": null}}

event: message_stop
data: {"type": "message_stop"}
```

<Note>
使用启用思考的流式传输时，您可能会注意到文本有时以较大的块到达，交替出现较小的逐令牌传递。这是预期的行为，特别是对于思考内容。

流式传输系统需要分批处理内容以获得最佳性能，这可能导致这种"分块"传递模式，流式传输事件之间可能出现延迟。我们正在不断努力改进这种体验，未来的更新将专注于使思考内容流式传输更顺畅。
</Note>

## 扩展思考与工具使用

扩展思考可以与[工具使用](/docs/zh-CN/agents-and-tools/tool-use/overview)一起使用，允许 Claude 通过工具选择和结果处理进行推理。

使用扩展思考和工具使用时，请注意以下限制：

1. **工具选择限制**：带有思考的工具使用仅支持 `tool_choice: {"type": "auto"}` (默认) 或 `tool_choice: {"type": "none"}`。使用 `tool_choice: {"type": "any"}` 或 `tool_choice: {"type": "tool", "name": "..."}` 将导致错误，因为这些选项强制工具使用，这与扩展思考不兼容。

2. **保留思考块**：在工具使用期间，您必须将 `thinking` 块传回 API 以获取最后的助手消息。将完整的未修改块传回 API 以维持推理连续性。

### 在对话中切换思考模式

您不能在助手轮次中间切换思考，包括在工具使用循环期间。整个助手轮次必须在单一思考模式下运行：

- **如果启用了思考**，最后的助手轮次必须以思考块开始。
- **如果禁用了思考**，最后的助手轮次不能包含任何思考块

从模型的角度来看，**工具使用循环是助手轮次的一部分**。助手轮次直到 Claude 完成其完整响应（可能包括多个工具调用和结果）才完成。

例如，这个序列都是**单个助手轮次**的一部分：
```
用户："巴黎的天气如何？"
助手：[思考] + [工具使用：get_weather]
用户：[工具结果："20°C，晴天"]
助手：[文本："巴黎的天气是 20°C 和晴天"]
```

尽管有多个 API 消息，但工具使用循环在概念上是一个连续助手响应的一部分。

#### 常见错误场景

您可能会遇到此错误：
```
预期 `thinking` 或 `redacted_thinking`，但找到 `tool_use`。
启用 `thinking` 时，最后的 `assistant` 消息必须以思考块开始
（在最后一组 `tool_use` 和 `tool_result` 块之前）。
```

这通常发生在以下情况：
1. 您在工具使用序列期间**禁用了**思考
2. 您想再次启用思考
3. 您的最后一条助手消息包含工具使用块但没有思考块

#### 实际指导

**✗ 无效：在工具使用后立即切换思考**
```
用户："天气如何？"
助手：[工具使用]（思考已禁用）
用户：[工具结果]
// 无法在此处启用思考 - 仍在同一助手轮次中
```

**✓ 有效：首先完成助手轮次**
```
用户："天气如何？"
助手：[工具使用]（思考已禁用）
用户：[工具结果]
助手：[文本："晴天"]
用户："明天呢？"（思考已禁用）
助手：[思考] + [文本："..."]（思考已启用 - 新轮次）
```

**最佳实践**：在每个轮次开始时规划您的思考策略，而不是尝试在轮次中间切换。

<Note>
切换思考模式也会使提示缓存对消息历史记录无效。有关更多详情，请参阅[扩展思考与提示缓存](#extended-thinking-with-prompt-caching)部分。
</Note>

<section title="示例：使用工具结果传递思考块">

以下是一个实际示例，展示了在提供工具结果时如何保留思考块：

<CodeGroup>
```python Python
weather_tool = {
    "name": "get_weather",
    "description": "获取位置的当前天气",
    "input_schema": {
        "type": "object",
        "properties": {
            "location": {"type": "string"}
        },
        "required": ["location"]
    }
}

# 第一个请求 - Claude 使用思考和工具请求进行响应
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    tools=[weather_tool],
    messages=[
        {"role": "user", "content": "巴黎的天气如何？"}
    ]
)
```

```typescript TypeScript
const weatherTool = {
  name: "get_weather",
  description: "获取位置的当前天气",
  input_schema: {
    type: "object",
    properties: {
      location: { type: "string" }
    },
    required: ["location"]
  }
};

// 第一个请求 - Claude 使用思考和工具请求进行响应
const response = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 16000,
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  tools: [weatherTool],
  messages: [
    { role: "user", content: "巴黎的天气如何？" }
  ]
});
```

```java Java
import java.util.List;
import java.util.Map;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.JsonValue;
import com.anthropic.models.beta.messages.BetaMessage;
import com.anthropic.models.beta.messages.MessageCreateParams;
import com.anthropic.models.beta.messages.BetaThinkingConfigEnabled;
import com.anthropic.models.beta.messages.BetaTool;
import com.anthropic.models.beta.messages.BetaTool.InputSchema;
import com.anthropic.models.messages.Model;

public class ThinkingWithToolsExample {
    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        InputSchema schema = InputSchema.builder()
                .properties(JsonValue.from(Map.of(
                        "location", Map.of("type", "string")
                )))
                .putAdditionalProperty("required", JsonValue.from(List.of("location")))
                .build();

        BetaTool weatherTool = BetaTool.builder()
                .name("get_weather")
                .description("获取位置的当前天气")
                .inputSchema(schema)
                .build();

        BetaMessage response = client.beta().messages().create(
                MessageCreateParams.builder()
                        .model(Model.CLAUDE_OPUS_4_0)
                        .maxTokens(16000)
                        .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(10000).build())
                        .addTool(weatherTool)
                        .addUserMessage("巴黎的天气如何？")
                        .build()
        );

        System.out.println(response);
    }
}
```
</CodeGroup>

API 响应将包括思考、文本和 tool_use 块：

```json
{
    "content": [
        {
            "type": "thinking",
            "thinking": "用户想知道巴黎的当前天气。我可以访问函数 `get_weather`...",
            "signature": "BDaL4VrbR2Oj0hO4XpJxT28J5TILnCrrUXoKiiNBZW9P+nr8XSj1zuZzAl4egiCCpQNvfyUuFFJP5CncdYZEQPPmLxYsNrcs...."
        },
        {
            "type": "text",
            "text": "我可以帮您获取巴黎的当前天气信息。让我为您检查一下"
        },
        {
            "type": "tool_use",
            "id": "toolu_01CswdEQBMshySk6Y9DFKrfq",
            "name": "get_weather",
            "input": {
                "location": "Paris"
            }
        }
    ]
}
```

现在让我们继续对话并使用该工具

<CodeGroup>
```python Python
# 提取思考块和工具使用块
thinking_block = next((block for block in response.content
                      if block.type == 'thinking'), None)
tool_use_block = next((block for block in response.content
                      if block.type == 'tool_use'), None)

# 调用您的实际天气 API，这是您的实际 API 调用的地方
# 让我们假设这是我们得到的回复
weather_data = {"temperature": 88}

# 第二个请求 - 包括思考块和工具结果
# 响应中不会生成新的思考块
continuation = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    tools=[weather_tool],
    messages=[
        {"role": "user", "content": "巴黎的天气如何？"},
        # 注意思考块和工具使用块都被传入
        # 如果不传入，会引发错误
        {"role": "assistant", "content": [thinking_block, tool_use_block]},
        {"role": "user", "content": [{
            "type": "tool_result",
            "tool_use_id": tool_use_block.id,
            "content": f"当前温度：{weather_data['temperature']}°F"
        }]}
    ]
)
```

```typescript TypeScript
// 提取思考块和工具使用块
const thinkingBlock = response.content.find(block =>
  block.type === 'thinking');
const toolUseBlock = response.content.find(block =>
  block.type === 'tool_use');

// 调用您的实际天气 API，这是您的实际 API 调用的地方
// 让我们假设这是我们得到的回复
const weatherData = { temperature: 88 };

// 第二个请求 - 包括思考块和工具结果
// 响应中不会生成新的思考块
const continuation = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 16000,
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  tools: [weatherTool],
  messages: [
    { role: "user", content: "巴黎的天气如何？" },
    // 注意思考块和工具使用块都被传入
    // 如果不传入，会引发错误
    { role: "assistant", content: [thinkingBlock, toolUseBlock] },
    { role: "user", content: [{
      type: "tool_result",
      tool_use_id: toolUseBlock.id,
      content: `当前温度：${weatherData.temperature}°F`
    }]}
  ]
});
```

```java Java
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.JsonValue;
import com.anthropic.models.beta.messages.*;
import com.anthropic.models.beta.messages.BetaTool.InputSchema;
import com.anthropic.models.messages.Model;

public class ThinkingToolsResultExample {
    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        InputSchema schema = InputSchema.builder()
                .properties(JsonValue.from(Map.of(
                        "location", Map.of("type", "string")
                )))
                .putAdditionalProperty("required", JsonValue.from(List.of("location")))
                .build();

        BetaTool weatherTool = BetaTool.builder()
                .name("get_weather")
                .description("获取位置的当前天气")
                .inputSchema(schema)
                .build();

        BetaMessage response = client.beta().messages().create(
                MessageCreateParams.builder()
                        .model(Model.CLAUDE_OPUS_4_0)
                        .maxTokens(16000)
                        .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(10000).build())
                        .addTool(weatherTool)
                        .addUserMessage("巴黎的天气如何？")
                        .build()
        );

        // 提取思考块和工具使用块
        Optional<BetaThinkingBlock> thinkingBlockOpt = response.content().stream()
                .filter(BetaContentBlock::isThinking)
                .map(BetaContentBlock::asThinking)
                .findFirst();

        Optional<BetaToolUseBlock> toolUseBlockOpt = response.content().stream()
                .filter(BetaContentBlock::isToolUse)
                .map(BetaContentBlock::asToolUse)
                .findFirst();

        if (thinkingBlockOpt.isPresent() && toolUseBlockOpt.isPresent()) {
            BetaThinkingBlock thinkingBlock = thinkingBlockOpt.get();
            BetaToolUseBlock toolUseBlock = toolUseBlockOpt.get();

            // 调用您的实际天气 API，这是您的实际 API 调用的地方
            // 让我们假设这是我们得到的回复
            Map<String, Object> weatherData = Map.of("temperature", 88);

            // 第二个请求 - 包括思考块和工具结果
            // 响应中不会生成新的思考块
            BetaMessage continuation = client.beta().messages().create(
                    MessageCreateParams.builder()
                            .model(Model.CLAUDE_OPUS_4_0)
                            .maxTokens(16000)
                            .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(10000).build())
                            .addTool(weatherTool)
                            .addUserMessage("巴黎的天气如何？")
                            .addAssistantMessageOfBetaContentBlockParams(
                                    // 注意思考块和工具使用块都被传入
                                    // 如果不传入，会引发错误
                                    List.of(
                                            BetaContentBlockParam.ofThinking(thinkingBlock.toParam()),
                                            BetaContentBlockParam.ofToolUse(toolUseBlock.toParam())
                                    )
                            )
                            .addUserMessageOfBetaContentBlockParams(List.of(
                                    BetaContentBlockParam.ofToolResult(
                                            BetaToolResultBlockParam.builder()
                                                    .toolUseId(toolUseBlock.id())
                                                    .content(String.format("当前温度：%d°F", (Integer)weatherData.get("temperature")))
                                                    .build()
                                    )
                            ))
                            .build()
            );

            System.out.println(continuation);
        }
    }
}
```
</CodeGroup>

API 响应现在将**仅**包括文本

```json
{
    "content": [
        {
            "type": "text",
            "text": "目前巴黎的温度是 88°F (31°C)"
        }
    ]
}
```

</section>

### 保留思考块

在工具使用期间，您必须将 `thinking` 块传回 API，并且必须将完整的未修改块传回 API。这对于维持模型的推理流和对话完整性至关重要。

<Tip>
虽然您可以从之前的 `assistant` 角色轮次中省略 `thinking` 块，但我们建议始终将所有思考块传回 API 以进行任何多轮对话。API 将：
- 自动过滤提供的思考块
- 使用必要的相关思考块来保留模型的推理
- 仅对显示给 Claude 的块的输入令牌进行计费
</Tip>

<Note>
在对话中切换思考模式时，请记住整个助手轮次（包括工具使用循环）必须在单一思考模式下运行。有关更多详情，请参阅[在对话中切换思考模式](#toggling-thinking-modes-in-conversations)。
</Note>

当 Claude 调用工具时，它暂停了响应的构建以等待外部信息。返回工具结果后，Claude 将继续构建该现有响应。这需要在工具使用期间保留思考块，原因有两个：

1. **推理连续性**：思考块捕获了导致工具请求的 Claude 逐步推理。当您发布工具结果时，包括原始思考可确保 Claude 能够从中断的地方继续推理。

2. **上下文维护**：虽然工具结果在 API 结构中显示为用户消息，但它们是连续推理流的一部分。保留思考块在多个 API 调用中维持这个概念流。有关上下文管理的更多信息，请参阅我们的[上下文窗口指南](/docs/zh-CN/build-with-claude/context-windows)。

**重要**：提供 `thinking` 块时，连续 `thinking` 块的整个序列必须与模型在原始请求期间生成的输出相匹配；您不能重新排列或修改这些块的序列。

### 交错思考

Claude 4 模型中的扩展思考与工具使用支持交错思考，这使 Claude 能够在工具调用之间进行思考，并在收到工具结果后进行更复杂的推理。

通过交错思考，Claude 可以：
- 在决定下一步操作之前，对工具调用的结果进行推理
- 在推理步骤之间链接多个工具调用
- 根据中间结果做出更细致的决策

要启用交错思考，请在 API 请求中添加 [beta 标头](/docs/zh-CN/api/beta-headers) `interleaved-thinking-2025-05-14`。

以下是交错思考的一些重要注意事项：
- 使用交错思考时，`budget_tokens` 可以超过 `max_tokens` 参数，因为它代表一个助手轮次内所有思考块的总预算。
- 交错思考仅支持 [通过 Messages API 使用的工具](/docs/zh-CN/agents-and-tools/tool-use/overview)。
- 交错思考仅支持 Claude 4 模型，需要使用 beta 标头 `interleaved-thinking-2025-05-14`。
- 直接调用 Claude API 允许您在对任何模型的请求中传递 `interleaved-thinking-2025-05-14`，但不会产生任何效果。
- 在第三方平台上（例如 [Amazon Bedrock](/docs/zh-CN/build-with-claude/claude-on-amazon-bedrock) 和 [Vertex AI](/docs/zh-CN/build-with-claude/claude-on-vertex-ai)），如果您将 `interleaved-thinking-2025-05-14` 传递给除 Claude Opus 4.5、Claude Opus 4.1、Opus 4 或 Sonnet 4 之外的任何模型，您的请求将失败。

<section title="不使用交错思考的工具使用">

不使用交错思考时，Claude 在助手轮次开始时思考一次。工具结果后的后续响应继续进行，不会产生新的思考块。

```
User: "What's the total revenue if we sold 150 units at $50 each,
       and how does this compare to our average monthly revenue?"

Turn 1: [thinking] "I need to calculate 150 * $50, then check the database..."
        [tool_use: calculator] { "expression": "150 * 50" }
  ↓ tool result: "7500"

Turn 2: [tool_use: database_query] { "query": "SELECT AVG(revenue)..." }
        ↑ no thinking block
  ↓ tool result: "5200"

Turn 3: [text] "The total revenue is $7,500, which is 44% above your
        average monthly revenue of $5,200."
        ↑ no thinking block
```

</section>

<section title="使用交错思考的工具使用">

启用交错思考后，Claude 可以在收到每个工具结果后进行思考，允许它在继续之前对中间结果进行推理。

```
User: "What's the total revenue if we sold 150 units at $50 each,
       and how does this compare to our average monthly revenue?"

Turn 1: [thinking] "I need to calculate 150 * $50 first..."
        [tool_use: calculator] { "expression": "150 * 50" }
  ↓ tool result: "7500"

Turn 2: [thinking] "Got $7,500. Now I should query the database to compare..."
        [tool_use: database_query] { "query": "SELECT AVG(revenue)..." }
        ↑ thinking after receiving calculator result
  ↓ tool result: "5200"

Turn 3: [thinking] "$7,500 vs $5,200 average - that's a 44% increase..."
        [text] "The total revenue is $7,500, which is 44% above your
        average monthly revenue of $5,200."
        ↑ thinking before final answer
```

</section>

## 扩展思考与提示缓存

[提示缓存](/docs/zh-CN/build-with-claude/prompt-caching) 与思考有几个重要的注意事项：

<Tip>
扩展思考任务通常需要超过 5 分钟才能完成。考虑使用 [1 小时缓存持续时间](/docs/zh-CN/build-with-claude/prompt-caching#1-hour-cache-duration) 来维护跨越较长思考会话和多步工作流的缓存命中。
</Tip>

**思考块上下文移除**
- 来自先前轮次的思考块从上下文中移除，这可能会影响缓存断点
- 继续使用工具的对话时，思考块被缓存并在从缓存读取时计为输入令牌
- 这造成了一个权衡：虽然思考块在视觉上不消耗上下文窗口空间，但在缓存时仍然计入您的输入令牌使用量
- 如果思考被禁用，如果您在当前工具使用轮次中传递思考内容，请求将失败。在其他情况下，传递给 API 的思考内容将被忽略

**缓存失效模式**
- 思考参数的更改（启用/禁用或预算分配）会使消息缓存断点失效
- [交错思考](#interleaved-thinking) 放大了缓存失效，因为思考块可以在多个 [工具调用](#extended-thinking-with-tool-use) 之间发生
- 系统提示和工具尽管思考参数更改或块移除，仍保持缓存

<Note>
虽然思考块被移除用于缓存和上下文计算，但在继续使用 [工具使用](#extended-thinking-with-tool-use) 的对话时，特别是使用 [交错思考](#interleaved-thinking) 时，必须保留它们。
</Note>

### 理解思考块缓存行为

使用扩展思考与工具使用时，思考块表现出特定的缓存行为，这会影响令牌计数：

**工作原理：**

1. 仅当您发出包含工具结果的后续请求时，才会发生缓存
2. 发出后续请求时，先前的对话历史记录（包括思考块）可以被缓存
3. 这些缓存的思考块在从缓存读取时计为您的使用指标中的输入令牌
4. 当包含非工具结果用户块时，所有先前的思考块都被忽略并从上下文中剥离

**详细示例流程：**

**请求 1：**
```
User: "What's the weather in Paris?"
```
**响应 1：**
```
[thinking_block_1] + [tool_use block 1]
```

**请求 2：**
```
User: ["What's the weather in Paris?"], 
Assistant: [thinking_block_1] + [tool_use block 1], 
User: [tool_result_1, cache=True]
```
**响应 2：**
```
[thinking_block_2] + [text block 2]
```
请求 2 写入请求内容的缓存（不是响应）。缓存包括原始用户消息、第一个思考块、工具使用块和工具结果。

**请求 3：**
```
User: ["What's the weather in Paris?"],
Assistant: [thinking_block_1] + [tool_use block 1],
User: [tool_result_1, cache=True],
Assistant: [thinking_block_2] + [text block 2],
User: [Text response, cache=True]
```
对于 Claude Opus 4.5 及更高版本，默认情况下保留所有先前的思考块。对于较旧的模型，因为包含了非工具结果用户块，所有先前的思考块都被忽略。此请求将按以下方式处理：
```
User: ["What's the weather in Paris?"],
Assistant: [tool_use block 1],
User: [tool_result_1, cache=True],
Assistant: [text block 2],
User: [Text response, cache=True]
```

**关键点：**
- 这种缓存行为会自动发生，即使没有显式的 `cache_control` 标记
- 无论使用常规思考还是交错思考，这种行为都是一致的

<section title="系统提示缓存（思考更改时保留）">

<CodeGroup>
```python Python
from anthropic import Anthropic
import requests
from bs4 import BeautifulSoup

client = Anthropic()

def fetch_article_content(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')

    # Remove script and style elements
    for script in soup(["script", "style"]):
        script.decompose()

    # Get text
    text = soup.get_text()

    # Break into lines and remove leading and trailing space on each
    lines = (line.strip() for line in text.splitlines())
    # Break multi-headlines into a line each
    chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
    # Drop blank lines
    text = '\n'.join(chunk for chunk in chunks if chunk)

    return text

# Fetch the content of the article
book_url = "https://www.gutenberg.org/cache/epub/1342/pg1342.txt"
book_content = fetch_article_content(book_url)
# Use just enough text for caching (first few chapters)
LARGE_TEXT = book_content[:5000]

SYSTEM_PROMPT=[
    {
        "type": "text",
        "text": "You are an AI assistant that is tasked with literary analysis. Analyze the following text carefully.",
    },
    {
        "type": "text",
        "text": LARGE_TEXT,
        "cache_control": {"type": "ephemeral"}
    }
]

MESSAGES = [
    {
        "role": "user",
        "content": "Analyze the tone of this passage."
    }
]

# First request - establish cache
print("First request - establishing cache")
response1 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=20000,
    thinking={
        "type": "enabled",
        "budget_tokens": 4000
    },
    system=SYSTEM_PROMPT,
    messages=MESSAGES
)

print(f"First response usage: {response1.usage}")

MESSAGES.append({
    "role": "assistant",
    "content": response1.content
})
MESSAGES.append({
    "role": "user",
    "content": "Analyze the characters in this passage."
})
# Second request - same thinking parameters (cache hit expected)
print("\nSecond request - same thinking parameters (cache hit expected)")
response2 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=20000,
    thinking={
        "type": "enabled",
        "budget_tokens": 4000
    },
    system=SYSTEM_PROMPT,
    messages=MESSAGES
)

print(f"Second response usage: {response2.usage}")

# Third request - different thinking parameters (cache miss for messages)
print("\nThird request - different thinking parameters (cache miss for messages)")
response3 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=20000,
    thinking={
        "type": "enabled",
        "budget_tokens": 8000  # Changed thinking budget
    },
    system=SYSTEM_PROMPT,  # System prompt remains cached
    messages=MESSAGES  # Messages cache is invalidated
)

print(f"Third response usage: {response3.usage}")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';
import axios from 'axios';
import * as cheerio from 'cheerio';

const client = new Anthropic();

async function fetchArticleContent(url: string): Promise<string> {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  
  // Remove script and style elements
  $('script, style').remove();
  
  // Get text
  let text = $.text();
  
  // Break into lines and remove leading and trailing space on each
  const lines = text.split('\n').map(line => line.trim());
  // Drop blank lines
  text = lines.filter(line => line.length > 0).join('\n');
  
  return text;
}

// Fetch the content of the article
const bookUrl = "https://www.gutenberg.org/cache/epub/1342/pg1342.txt";
const bookContent = await fetchArticleContent(bookUrl);
// Use just enough text for caching (first few chapters)
const LARGE_TEXT = bookContent.slice(0, 5000);

const SYSTEM_PROMPT = [
  {
    type: "text",
    text: "You are an AI assistant that is tasked with literary analysis. Analyze the following text carefully.",
  },
  {
    type: "text",
    text: LARGE_TEXT,
    cache_control: { type: "ephemeral" }
  }
];

const MESSAGES = [
  {
    role: "user",
    content: "Analyze the tone of this passage."
  }
];

// First request - establish cache
console.log("First request - establishing cache");
const response1 = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 20000,
  thinking: {
    type: "enabled",
    budget_tokens: 4000
  },
  system: SYSTEM_PROMPT,
  messages: MESSAGES
});

console.log(`First response usage: ${response1.usage}`);

MESSAGES.push({
  role: "assistant",
  content: response1.content
});
MESSAGES.push({
  role: "user",
  content: "Analyze the characters in this passage."
});

// Second request - same thinking parameters (cache hit expected)
console.log("\nSecond request - same thinking parameters (cache hit expected)");
const response2 = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 20000,
  thinking: {
    type: "enabled",
    budget_tokens: 4000
  },
  system: SYSTEM_PROMPT,
  messages: MESSAGES
});

console.log(`Second response usage: ${response2.usage}`);

// Third request - different thinking parameters (cache miss for messages)
console.log("\nThird request - different thinking parameters (cache miss for messages)");
const response3 = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 20000,
  thinking: {
    type: "enabled",
    budget_tokens: 8000  // Changed thinking budget
  },
  system: SYSTEM_PROMPT,  // System prompt remains cached
  messages: MESSAGES  // Messages cache is invalidated
});

console.log(`Third response usage: ${response3.usage}`);
```
</CodeGroup>

</section>
<section title="消息缓存（思考更改时失效）">

<CodeGroup>
```python Python
from anthropic import Anthropic
import requests
from bs4 import BeautifulSoup

client = Anthropic()

def fetch_article_content(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')

    # Remove script and style elements
    for script in soup(["script", "style"]):
        script.decompose()

    # Get text
    text = soup.get_text()

    # Break into lines and remove leading and trailing space on each
    lines = (line.strip() for line in text.splitlines())
    # Break multi-headlines into a line each
    chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
    # Drop blank lines
    text = '\n'.join(chunk for chunk in chunks if chunk)

    return text

# Fetch the content of the article
book_url = "https://www.gutenberg.org/cache/epub/1342/pg1342.txt"
book_content = fetch_article_content(book_url)
# Use just enough text for caching (first few chapters)
LARGE_TEXT = book_content[:5000]

# No system prompt - caching in messages instead
MESSAGES = [
    {
        "role": "user",
        "content": [
            {
                "type": "text",
                "text": LARGE_TEXT,
                "cache_control": {"type": "ephemeral"},
            },
            {
                "type": "text",
                "text": "Analyze the tone of this passage."
            }
        ]
    }
]

# First request - establish cache
print("First request - establishing cache")
response1 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=20000,
    thinking={
        "type": "enabled",
        "budget_tokens": 4000
    },
    messages=MESSAGES
)

print(f"First response usage: {response1.usage}")

MESSAGES.append({
    "role": "assistant",
    "content": response1.content
})
MESSAGES.append({
    "role": "user",
    "content": "Analyze the characters in this passage."
})
# Second request - same thinking parameters (cache hit expected)
print("\nSecond request - same thinking parameters (cache hit expected)")
response2 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=20000,
    thinking={
        "type": "enabled",
        "budget_tokens": 4000  # Same thinking budget
    },
    messages=MESSAGES
)

print(f"Second response usage: {response2.usage}")

MESSAGES.append({
    "role": "assistant",
    "content": response2.content
})
MESSAGES.append({
    "role": "user",
    "content": "Analyze the setting in this passage."
})

# Third request - different thinking budget (cache miss expected)
print("\nThird request - different thinking budget (cache miss expected)")
response3 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=20000,
    thinking={
        "type": "enabled",
        "budget_tokens": 8000  # Different thinking budget breaks cache
    },
    messages=MESSAGES
)

print(f"Third response usage: {response3.usage}")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';
import axios from 'axios';
import * as cheerio from 'cheerio';

const client = new Anthropic();

async function fetchArticleContent(url: string): Promise<string> {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  // Remove script and style elements
  $('script, style').remove();

  // Get text
  let text = $.text();

  // Clean up text (break into lines, remove whitespace)
  const lines = text.split('\n').map(line => line.trim());
  const chunks = lines.flatMap(line => line.split('  ').map(phrase => phrase.trim()));
  text = chunks.filter(chunk => chunk).join('\n');

  return text;
}

async function main() {
  // Fetch the content of the article
  const bookUrl = "https://www.gutenberg.org/cache/epub/1342/pg1342.txt";
  const bookContent = await fetchArticleContent(bookUrl);
  // Use just enough text for caching (first few chapters)
  const LARGE_TEXT = bookContent.substring(0, 5000);

  // No system prompt - caching in messages instead
  let MESSAGES = [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: LARGE_TEXT,
          cache_control: {type: "ephemeral"},
        },
        {
          type: "text",
          text: "Analyze the tone of this passage."
        }
      ]
    }
  ];

  // First request - establish cache
  console.log("First request - establishing cache");
  const response1 = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 20000,
    thinking: {
      type: "enabled",
      budget_tokens: 4000
    },
    messages: MESSAGES
  });

  console.log(`First response usage: `, response1.usage);

  MESSAGES = [
    ...MESSAGES,
    {
      role: "assistant",
      content: response1.content
    },
    {
      role: "user",
      content: "Analyze the characters in this passage."
    }
  ];

  // Second request - same thinking parameters (cache hit expected)
  console.log("\nSecond request - same thinking parameters (cache hit expected)");
  const response2 = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 20000,
    thinking: {
      type: "enabled",
      budget_tokens: 4000  // Same thinking budget
    },
    messages: MESSAGES
  });

  console.log(`Second response usage: `, response2.usage);

  MESSAGES = [
    ...MESSAGES,
    {
      role: "assistant",
      content: response2.content
    },
    {
      role: "user",
      content: "Analyze the setting in this passage."
    }
  ];

  // Third request - different thinking budget (cache miss expected)
  console.log("\nThird request - different thinking budget (cache miss expected)");
  const response3 = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 20000,
    thinking: {
      type: "enabled",
      budget_tokens: 8000  // Different thinking budget breaks cache
    },
    messages: MESSAGES
  });

  console.log(`Third response usage: `, response3.usage);
}

main().catch(console.error);
```

```java Java
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.Arrays;
import java.util.regex.Pattern;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.beta.messages.*;
import com.anthropic.models.beta.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;

import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toList;

public class ThinkingCacheExample {
    public static void main(String[] args) throws IOException {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Fetch the content of the article
        String bookUrl = "https://www.gutenberg.org/cache/epub/1342/pg1342.txt";
        String bookContent = fetchArticleContent(bookUrl);
        // Use just enough text for caching (first few chapters)
        String largeText = bookContent.substring(0, 5000);

        List<BetaTextBlockParam> systemPrompt = List.of(
                BetaTextBlockParam.builder()
                        .text("You are an AI assistant that is tasked with literary analysis. Analyze the following text carefully.")
                        .build(),
                BetaTextBlockParam.builder()
                        .text(largeText)
                        .cacheControl(BetaCacheControlEphemeral.builder().build())
                        .build()
        );

        List<BetaMessageParam> messages = new ArrayList<>();
        messages.add(BetaMessageParam.builder()
                .role(BetaMessageParam.Role.USER)
                .content("Analyze the tone of this passage.")
                .build());

        // First request - establish cache
        System.out.println("First request - establishing cache");
        BetaMessage response1 = client.beta().messages().create(
                MessageCreateParams.builder()
                        .model(Model.CLAUDE_OPUS_4_0)
                        .maxTokens(20000)
                        .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(4000).build())
                        .systemOfBetaTextBlockParams(systemPrompt)
                        .messages(messages)
                        .build()
        );

        System.out.println("First response usage: " + response1.usage());

        // Second request - same thinking parameters (cache hit expected)
        System.out.println("\nSecond request - same thinking parameters (cache hit expected)");
        BetaMessage response2 = client.beta().messages().create(
                MessageCreateParams.builder()
                        .model(Model.CLAUDE_OPUS_4_0)
                        .maxTokens(20000)
                        .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(4000).build())
                        .systemOfBetaTextBlockParams(systemPrompt)
                        .addMessage(response1)
                        .addUserMessage("Analyze the characters in this passage.")
                        .messages(messages)
                        .build()
        );

        System.out.println("Second response usage: " + response2.usage());

        // Third request - different thinking budget (cache hit expected because system prompt caching)
        System.out.println("\nThird request - different thinking budget (cache hit expected)");
        BetaMessage response3 = client.beta().messages().create(
                MessageCreateParams.builder()
                        .model(Model.CLAUDE_OPUS_4_0)
                        .maxTokens(20000)
                        .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(8000).build())
                        .systemOfBetaTextBlockParams(systemPrompt)
                        .addMessage(response1)
                        .addUserMessage("Analyze the characters in this passage.")
                        .addMessage(response2)
                        .addUserMessage("Analyze the setting in this passage.")
                        .build()
        );

        System.out.println("Third response usage: " + response3.usage());
    }

    private static String fetchArticleContent(String url) throws IOException {
        // Fetch HTML content
        String htmlContent = fetchHtml(url);

        // Remove script and style elements
        String noScriptStyle = removeElements(htmlContent, "script", "style");

        // Extract text (simple approach - remove HTML tags)
        String text = removeHtmlTags(noScriptStyle);

        // Clean up text (break into lines, remove whitespace)
        List<String> lines = Arrays.asList(text.split("\n"));
        List<String> trimmedLines = lines.stream()
                .map(String::trim)
                .collect(toList());

        // Split on double spaces and flatten
        List<String> chunks = trimmedLines.stream()
                .flatMap(line -> Arrays.stream(line.split("  "))
                        .map(String::trim))
                .collect(toList());

        // Filter empty chunks and join with newlines
        return chunks.stream()
                .filter(chunk -> !chunk.isEmpty())
                .collect(joining("\n"));
    }

    /**
     * Fetches HTML content from a URL
     */
    private static String fetchHtml(String urlString) throws IOException {
        try (InputStream inputStream = new URL(urlString).openStream()) {
            StringBuilder content = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(inputStream))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    content.append(line).append("\n");
                }
            }
            return content.toString();
        }
    }

    /**
     * Removes specified HTML elements and their content
     */
    private static String removeElements(String html, String... elementNames) {
        String result = html;
        for (String element : elementNames) {
            // Pattern to match <element>...</element> and self-closing tags
            String pattern = "<" + element + "\\s*[^>]*>.*?</" + element + ">|<" + element + "\\s*[^>]*/?>";
            result = Pattern.compile(pattern, Pattern.DOTALL).matcher(result).replaceAll("");
        }
        return result;
    }

    /**
     * Removes all HTML tags from content
     */
    private static String removeHtmlTags(String html) {
        // Replace <br> and <p> tags with newlines for better text formatting
        String withLineBreaks = html.replaceAll("<br\\s*/?\\s*>|</?p\\s*[^>]*>", "\n");

        // Remove remaining HTML tags
        String noTags = withLineBreaks.replaceAll("<[^>]*>", "");

        // Decode HTML entities (simplified for common entities)
        return decodeHtmlEntities(noTags);
    }

    /**
     * Simple HTML entity decoder for common entities
     */
    private static String decodeHtmlEntities(String text) {
        return text
                .replaceAll("&nbsp;", " ")
                .replaceAll("&amp;", "&")
                .replaceAll("&lt;", "<")
                .replaceAll("&gt;", ">")
                .replaceAll("&quot;", "\"")
                .replaceAll("&#39;", "'")
                .replaceAll("&hellip;", "...")
                .replaceAll("&mdash;", "—");
    }

}
```
</CodeGroup>

以下是脚本的输出（您可能会看到略有不同的数字）

```
First request - establishing cache
First response usage: { cache_creation_input_tokens: 1370, cache_read_input_tokens: 0, input_tokens: 17, output_tokens: 700 }

Second request - same thinking parameters (cache hit expected)

Second response usage: { cache_creation_input_tokens: 0, cache_read_input_tokens: 1370, input_tokens: 303, output_tokens: 874 }

Third request - different thinking budget (cache miss expected)
Third response usage: { cache_creation_input_tokens: 1370, cache_read_input_tokens: 0, input_tokens: 747, output_tokens: 619 }
```

此示例演示了当缓存设置在消息数组中时，更改思考参数（budget_tokens 从 4000 增加到 8000）**使缓存失效**。第三个请求显示没有缓存命中，`cache_creation_input_tokens=1370` 和 `cache_read_input_tokens=0`，证明当思考参数更改时，基于消息的缓存会失效。

</section>

## 扩展思考中的最大令牌和上下文窗口大小

在较旧的 Claude 模型中（Claude Sonnet 3.7 之前），如果提示令牌和 `max_tokens` 的总和超过模型的上下文窗口，系统会自动调整 `max_tokens` 以适应上下文限制。这意味着您可以设置一个大的 `max_tokens` 值，系统会根据需要静默减少它。

使用 Claude 3.7 和 4 模型，`max_tokens`（启用思考时包括您的思考预算）被强制执行为严格限制。如果提示令牌 + `max_tokens` 超过上下文窗口大小，系统现在将返回验证错误。

<Note>
您可以阅读我们的 [上下文窗口指南](/docs/zh-CN/build-with-claude/context-windows) 以获得更深入的了解。
</Note>

### 扩展思考中的上下文窗口

使用启用思考的扩展思考计算上下文窗口使用时，需要注意一些事项：

- 来自先前轮次的思考块被剥离，不计入您的上下文窗口
- 当前轮次思考计入该轮次的 `max_tokens` 限制

下图演示了启用扩展思考时的专门令牌管理：

![扩展思考的上下文窗口图](/docs/images/context-window-thinking.svg)

有效的上下文窗口计算为：

```
context window =
  (current input tokens - previous thinking tokens) +
  (thinking tokens + encrypted thinking tokens + text output tokens)
```

我们建议使用 [令牌计数 API](/docs/zh-CN/build-with-claude/token-counting) 为您的特定用例获取准确的令牌计数，特别是在处理包含思考的多轮对话时。

### 扩展思考和工具使用中的上下文窗口

使用扩展思考与工具使用时，思考块必须显式保留并与工具结果一起返回。

扩展思考与工具使用的有效上下文窗口计算变为：

```
context window =
  (current input tokens + previous thinking tokens + tool use tokens) +
  (thinking tokens + encrypted thinking tokens + text output tokens)
```

下图说明了扩展思考与工具使用的令牌管理：

![扩展思考和工具使用的上下文窗口图](/docs/images/context-window-thinking-tools.svg)

### 使用扩展思考管理令牌

鉴于 Claude 3.7 和 4 模型的上下文窗口和 `max_tokens` 行为与扩展思考，您可能需要：

- 更积极地监控和管理您的令牌使用
- 随着提示长度的变化调整 `max_tokens` 值
- 可能更频繁地使用 [令牌计数端点](/docs/zh-CN/build-with-claude/token-counting)
- 意识到先前的思考块不会在您的上下文窗口中累积

进行此更改是为了提供更可预测和透明的行为，特别是因为最大令牌限制已显著增加。

## 思考加密

完整的思考内容被加密并在 `signature` 字段中返回。此字段用于验证思考块是由 Claude 生成的，当传递回 API 时。

<Note>
仅当使用 [带有扩展思考的工具](#extended-thinking-with-tool-use) 时，严格来说才需要发送回思考块。否则，您可以从先前的轮次中省略思考块，或让 API 为您剥离它们（如果您传递它们回去）。

如果发送回思考块，我们建议按照您收到的方式传递所有内容以保持一致性并避免潜在问题。
</Note>

以下是关于思考加密的一些重要注意事项：
- 当 [流式传输响应](#streaming-thinking) 时，签名通过 `content_block_delta` 事件中的 `signature_delta` 添加，就在 `content_block_stop` 事件之前。
- `signature` 值在 Claude 4 模型中的长度明显长于以前的模型。
- `signature` 字段是一个不透明字段，不应被解释或解析 - 它仅用于验证目的。
- `signature` 值在平台之间兼容（Claude API、[Amazon Bedrock](/docs/zh-CN/build-with-claude/claude-on-amazon-bedrock) 和 [Vertex AI](/docs/zh-CN/build-with-claude/claude-on-vertex-ai)）。在一个平台上生成的值将与另一个平台兼容。

### 思维过程编辑

偶尔，Claude 的内部推理会被我们的安全系统标记。当这种情况发生时，我们会加密 `thinking` 块的部分或全部内容，并将其作为 `redacted_thinking` 块返回给您。`redacted_thinking` 块在传回 API 时会被解密，允许 Claude 继续其响应而不会丢失上下文。

在构建使用扩展思维的面向客户的应用程序时：

- 请注意，编辑后的思维块包含不可读的加密内容
- 考虑提供简单的解释，例如："Claude 的某些内部推理已自动加密以确保安全。这不会影响响应的质量。"
- 如果向用户显示思维块，您可以过滤掉编辑后的块，同时保留正常的思维块
- 要透明地说明使用扩展思维功能可能偶尔会导致某些推理被加密
- 实施适当的错误处理，以优雅地管理编辑后的思维，而不会破坏您的 UI

以下是显示正常和编辑后思维块的示例：

```json
{
  "content": [
    {
      "type": "thinking",
      "thinking": "Let me analyze this step by step...",
      "signature": "WaUjzkypQ2mUEVM36O2TxuC06KN8xyfbJwyem2dw3URve/op91XWHOEBLLqIOMfFG/UvLEczmEsUjavL...."
    },
    {
      "type": "redacted_thinking",
      "data": "EmwKAhgBEgy3va3pzix/LafPsn4aDFIT2Xlxh0L5L8rLVyIwxtE3rAFBa8cr3qpPkNRj2YfWXGmKDxH4mPnZ5sQ7vB9URj2pLmN3kF8/dW5hR7xJ0aP1oLs9yTcMnKVf2wRpEGjH9XZaBt4UvDcPrQ..."
    },
    {
      "type": "text",
      "text": "Based on my analysis..."
    }
  ]
}
```

<Note>
在输出中看到编辑后的思维块是预期的行为。该模型仍然可以使用这个编辑后的推理来为其响应提供信息，同时保持安全防护栏。

如果您需要在应用程序中测试编辑后思维处理，可以使用此特殊测试字符串作为提示：`ANTHROPIC_MAGIC_STRING_TRIGGER_REDACTED_THINKING_46C9A13E193C177646C7398A98432ECCCE4C1253D5E2D82641AC0E52CC2876CB`
</Note>

在多轮对话中将 `thinking` 和 `redacted_thinking` 块传回 API 时，您必须将最后一个助手转向的完整未修改块传回 API。这对于维护模型的推理流程至关重要。我们建议始终将所有思维块传回 API。有关更多详情，请参阅上面的[保留思维块](#preserving-thinking-blocks)部分。

<section title="示例：使用编辑后的思维块">

此示例演示了当 Claude 的内部推理包含被安全系统标记的内容时，如何处理可能出现在响应中的 `redacted_thinking` 块：

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# 使用特殊提示触发编辑后的思维（仅用于演示目的）
response = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    messages=[{
        "role": "user",
        "content": "ANTHROPIC_MAGIC_STRING_TRIGGER_REDACTED_THINKING_46C9A13E193C177646C7398A98432ECCCE4C1253D5E2D82641AC0E52CC2876CB"
    }]
)

# 识别编辑后的思维块
has_redacted_thinking = any(
    block.type == "redacted_thinking" for block in response.content
)

if has_redacted_thinking:
    print("Response contains redacted thinking blocks")
    # 这些块在后续请求中仍然可用

    # 提取所有块（编辑后的和非编辑后的）
    all_thinking_blocks = [
        block for block in response.content
        if block.type in ["thinking", "redacted_thinking"]
    ]

    # 传递到后续请求时，包括所有块而不进行修改
    # 这保留了 Claude 推理的完整性

    print(f"Found {len(all_thinking_blocks)} thinking blocks total")
    print(f"These blocks are still billable as output tokens")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

// 使用特殊提示触发编辑后的思维（仅用于演示目的）
const response = await client.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 16000,
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  messages: [{
    role: "user",
    content: "ANTHROPIC_MAGIC_STRING_TRIGGER_REDACTED_THINKING_46C9A13E193C177646C7398A98432ECCCE4C1253D5E2D82641AC0E52CC2876CB"
  }]
});

// 识别编辑后的思维块
const hasRedactedThinking = response.content.some(
  block => block.type === "redacted_thinking"
);

if (hasRedactedThinking) {
  console.log("Response contains redacted thinking blocks");
  // 这些块在后续请求中仍然可用

  // 提取所有块（编辑后的和非编辑后的）
  const allThinkingBlocks = response.content.filter(
    block => block.type === "thinking" || block.type === "redacted_thinking"
  );

  // 传递到后续请求时，包括所有块而不进行修改
  // 这保留了 Claude 推理的完整性

  console.log(`Found ${allThinkingBlocks.length} thinking blocks total`);
  console.log(`These blocks are still billable as output tokens`);
}
```

```java Java
import java.util.List;

import static java.util.stream.Collectors.toList;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.beta.messages.BetaContentBlock;
import com.anthropic.models.beta.messages.BetaMessage;
import com.anthropic.models.beta.messages.MessageCreateParams;
import com.anthropic.models.beta.messages.BetaThinkingConfigEnabled;
import com.anthropic.models.messages.Model;

public class RedactedThinkingExample {
    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // 使用特殊提示触发编辑后的思维（仅用于演示目的）
        BetaMessage response = client.beta().messages().create(
                MessageCreateParams.builder()
                        .model(Model.CLAUDE_SONNET_4_5)
                        .maxTokens(16000)
                        .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(10000).build())
                        .addUserMessage("ANTHROPIC_MAGIC_STRING_TRIGGER_REDACTED_THINKING_46C9A13E193C177646C7398A98432ECCCE4C1253D5E2D82641AC0E52CC2876CB")
                        .build()
        );

        // 识别编辑后的思维块
        boolean hasRedactedThinking = response.content().stream()
                .anyMatch(BetaContentBlock::isRedactedThinking);

        if (hasRedactedThinking) {
            System.out.println("Response contains redacted thinking blocks");
            // 这些块在后续请求中仍然可用
            // 提取所有块（编辑后的和非编辑后的）
            List<BetaContentBlock> allThinkingBlocks = response.content().stream()
                    .filter(block -> block.isThinking() ||
                            block.isRedactedThinking())
                    .collect(toList());

            // 传递到后续请求时，包括所有块而不进行修改
            // 这保留了 Claude 推理的完整性
            System.out.println("Found " + allThinkingBlocks.size() + " thinking blocks total");
            System.out.println("These blocks are still billable as output tokens");
        }
    }
}
```

</CodeGroup>

<TryInConsoleButton
  userPrompt="ANTHROPIC_MAGIC_STRING_TRIGGER_REDACTED_THINKING_46C9A13E193C177646C7398A98432ECCCE4C1253D5E2D82641AC0E52CC2876CB"
  thinkingBudgetTokens={16000}
>
  在控制台中尝试
</TryInConsoleButton>

</section>

## 不同模型版本中的思维差异

Messages API 在 Claude Sonnet 3.7 和 Claude 4 模型中处理思维的方式不同，主要在编辑和总结行为方面。

请参阅下表了解简明对比：

| 功能 | Claude Sonnet 3.7 | Claude 4 模型（Opus 4.5 之前） | Claude Opus 4.5 及更高版本 |
|---------|------------------|-------------------------------|--------------------------|
| **思维输出** | 返回完整思维输出 | 返回总结的思维 | 返回总结的思维 |
| **交错思维** | 不支持 | 支持 `interleaved-thinking-2025-05-14` 测试版标头 | 支持 `interleaved-thinking-2025-05-14` 测试版标头 |
| **思维块保留** | 不在转向间保留 | 不在转向间保留 | **默认保留**（启用缓存优化、节省令牌） |

### Claude Opus 4.5 中的思维块保留

Claude Opus 4.5 引入了一个新的默认行为：**默认情况下，来自先前助手转向的思维块在模型上下文中被保留**。这与早期模型不同，早期模型会从先前的转向中删除思维块。

**思维块保留的好处：**

- **缓存优化**：使用工具使用时，保留的思维块可以启用缓存命中，因为它们与工具结果一起传回并在助手转向中增量缓存，从而在多步工作流中节省令牌
- **无智能影响**：保留思维块对模型性能没有负面影响

**重要注意事项：**

- **上下文使用**：长对话将消耗更多上下文空间，因为思维块保留在上下文中
- **自动行为**：这是 Claude Opus 4.5 的默认行为——不需要代码更改或测试版标头
- **向后兼容性**：要利用此功能，继续将完整的、未修改的思维块传回 API，就像您对工具使用所做的那样

<Note>
对于早期模型（Claude Sonnet 4.5、Opus 4.1 等），来自先前转向的思维块继续从上下文中被删除。[使用提示缓存的扩展思维](#extended-thinking-with-prompt-caching)部分中描述的现有行为适用于这些模型。
</Note>

## 定价

有关完整的定价信息，包括基本费率、缓存写入、缓存命中和输出令牌，请参阅[定价页面](/docs/zh-CN/about-claude/pricing)。

思维过程产生的费用包括：
- 思维期间使用的令牌（输出令牌）
- 后续请求中包含的最后一个助手转向的思维块（输入令牌）
- 标准文本输出令牌

<Note>
启用扩展思维时，会自动包含专门的系统提示来支持此功能。
</Note>

使用总结的思维时：
- **输入令牌**：原始请求中的令牌（不包括先前转向的思维令牌）
- **输出令牌（计费）**：Claude 内部生成的原始思维令牌
- **输出令牌（可见）**：您在响应中看到的总结思维令牌
- **无费用**：用于生成摘要的令牌

<Warning>
计费的输出令牌计数将**不**与响应中的可见令牌计数匹配。您需要为完整的思维过程付费，而不是您看到的摘要。
</Warning>

## 扩展思维的最佳实践和注意事项

### 使用思维预算

- **预算优化**：最小预算为 1,024 个令牌。我们建议从最小值开始，逐步增加思维预算以找到您用例的最优范围。更高的令牌计数可以实现更全面的推理，但根据任务的不同会有递减的回报。增加预算可以改善响应质量，但代价是增加延迟。对于关键任务，测试不同的设置以找到最优平衡。请注意，思维预算是一个目标而不是严格限制——实际令牌使用可能因任务而异。
- **起点**：对于复杂任务，从较大的思维预算（16k+ 令牌）开始，然后根据您的需求进行调整。
- **大预算**：对于超过 32k 的思维预算，我们建议使用[批处理](/docs/zh-CN/build-with-claude/batch-processing)以避免网络问题。推动模型思维超过 32k 令牌的请求会导致长时间运行的请求，可能会遇到系统超时和开放连接限制。
- **令牌使用跟踪**：监控思维令牌使用情况以优化成本和性能。

### 性能考虑

- **响应时间**：为推理过程所需的额外处理可能导致的更长响应时间做好准备。考虑生成思维块可能会增加总体响应时间。
- **流式传输要求**：当 `max_tokens` 大于 21,333 时，需要流式传输。流式传输时，准备好处理思维和文本内容块的到达。

### 功能兼容性

- 思维与 `temperature` 或 `top_k` 修改以及[强制工具使用](/docs/zh-CN/agents-and-tools/tool-use/implement-tool-use#forcing-tool-use)不兼容。
- 启用思维时，您可以将 `top_p` 设置为 1 到 0.95 之间的值。
- 启用思维时，您无法预填充响应。
- 对思维预算的更改会使包含消息的缓存提示前缀失效。但是，当思维参数更改时，缓存的系统提示和工具定义将继续工作。

### 使用指南

- **任务选择**：对于特别复杂的任务使用扩展思维，这些任务受益于逐步推理，如数学、编码和分析。
- **上下文处理**：您不需要自己删除先前的思维块。Claude API 会自动忽略先前转向的思维块，它们在计算上下文使用时不包括在内。
- **提示工程**：如果您想最大化 Claude 的思维能力，请查看我们的[扩展思维提示技巧](/docs/zh-CN/build-with-claude/prompt-engineering/extended-thinking-tips)。

## 后续步骤

<CardGroup>
  <Card title="尝试扩展思维食谱" icon="book" href="https://github.com/anthropics/anthropic-cookbook/tree/main/extended_thinking">
    在我们的食谱中探索思维的实际示例。
  </Card>
  <Card title="扩展思维提示技巧" icon="code" href="/docs/zh-CN/build-with-claude/prompt-engineering/extended-thinking-tips">
    学习扩展思维的提示工程最佳实践。
  </Card>
</CardGroup>