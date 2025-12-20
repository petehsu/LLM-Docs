# 如何实现工具使用

学习如何在 Claude API 中实现和使用工具，包括工具定义、最佳实践和工具运行器。

---

## 选择模型

我们建议对复杂工具和模糊查询使用最新的 Claude Sonnet (4.5) 或 Claude Opus (4.1) 模型；它们能更好地处理多个工具并在需要时寻求澄清。

对于直接的工具使用 Claude Haiku 模型，但请注意它们可能会推断缺失的参数。

<Tip>
如果使用 Claude 进行工具使用和扩展思考，请参考我们的指南 [此处](/docs/zh-CN/build-with-claude/extended-thinking) 了解更多信息。
</Tip>

## 指定客户端工具

客户端工具（包括 Anthropic 定义的和用户定义的）在 API 请求的 `tools` 顶级参数中指定。每个工具定义包括：

| Parameter      | Description                                                                                         |
| :------------- | :-------------------------------------------------------------------------------------------------- |
| `name`         | 工具的名称。必须匹配正则表达式 `^[a-zA-Z0-9_-]{1,64}$`。                                 |
| `description`  | 工具功能、何时使用以及如何表现的详细纯文本描述。 |
| `input_schema` | 定义工具预期参数的 [JSON Schema](https://json-schema.org/) 对象。     |
| `input_examples` | （可选，测试版）示例输入对象数组，帮助 Claude 理解如何使用工具。参见 [提供工具使用示例](#providing-tool-use-examples)。 |

<section title="简单工具定义示例">

```json JSON
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
  }
}
```

这个名为 `get_weather` 的工具期望一个输入对象，包含必需的 `location` 字符串和可选的 `unit` 字符串，该字符串必须是"celsius"或"fahrenheit"之一。

</section>

### 工具使用系统提示

当你使用 `tools` 参数调用 Claude API 时，我们从工具定义、工具配置和任何用户指定的系统提示构造一个特殊的系统提示。构造的提示旨在指示模型使用指定的工具并为工具的正常运行提供必要的上下文：

```
In this environment you have access to a set of tools you can use to answer the user's question.
{{ FORMATTING INSTRUCTIONS }}
String and scalar parameters should be specified as is, while lists and objects should use JSON format. Note that spaces for string values are not stripped. The output is not expected to be valid XML and is parsed with regular expressions.
Here are the functions available in JSONSchema format:
{{ TOOL DEFINITIONS IN JSON SCHEMA }}
{{ USER SYSTEM PROMPT }}
{{ TOOL CONFIGURATION }}
```

### 工具定义的最佳实践

为了从使用工具的 Claude 中获得最佳性能，请遵循以下指南：

- **提供极其详细的描述。** 这是迄今为止影响工具性能的最重要因素。你的描述应该解释关于工具的每个细节，包括：
  - 工具的功能
  - 何时应该使用它（以及何时不应该）
  - 每个参数的含义以及它如何影响工具的行为
  - 任何重要的注意事项或限制，例如工具不返回的信息（如果工具名称不清楚）。你能为 Claude 提供关于工具的上下文越多，它在决定何时以及如何使用它们时就会越好。目标是每个工具描述至少 3-4 句话，如果工具很复杂则更多。
- **优先考虑描述，但对复杂工具考虑使用 `input_examples`。** 清晰的描述最重要，但对于具有复杂输入、嵌套对象或格式敏感参数的工具，你可以使用 `input_examples` 字段（测试版）来提供经过模式验证的示例。详见 [提供工具使用示例](#providing-tool-use-examples)。

<section title="好的工具描述示例">

```json JSON
{
  "name": "get_stock_price",
  "description": "Retrieves the current stock price for a given ticker symbol. The ticker symbol must be a valid symbol for a publicly traded company on a major US stock exchange like NYSE or NASDAQ. The tool will return the latest trade price in USD. It should be used when the user asks about the current or most recent price of a specific stock. It will not provide any other information about the stock or company.",
  "input_schema": {
    "type": "object",
    "properties": {
      "ticker": {
        "type": "string",
        "description": "The stock ticker symbol, e.g. AAPL for Apple Inc."
      }
    },
    "required": ["ticker"]
  }
}
```

</section>

<section title="工具描述不佳的示例">

```json JSON
{
  "name": "get_stock_price",
  "description": "Gets the stock price for a ticker.",
  "input_schema": {
    "type": "object",
    "properties": {
      "ticker": {
        "type": "string"
      }
    },
    "required": ["ticker"]
  }
}
```

</section>

好的描述清楚地解释了工具的功能、何时使用、返回的数据以及 `ticker` 参数的含义。不佳的描述太简洁，让 Claude 对工具的行为和使用方式有许多疑问。

## 提供工具使用示例

你可以提供具体的有效工具输入示例，帮助 Claude 更有效地理解如何使用你的工具。这对于具有嵌套对象、可选参数或格式敏感输入的复杂工具特别有用。

<Info>
工具使用示例是一个测试版功能。为你的提供商包含适当的 [测试版标头](/docs/zh-CN/api/beta-headers)：

| Provider | Beta header | Supported models |
|----------|-------------|------------------|
| Claude API,<br/>Microsoft Foundry | `advanced-tool-use-2025-11-20` | All models |
| Vertex AI,<br/>Amazon Bedrock | `tool-examples-2025-10-29` | Claude Opus 4.5 only |
</Info>

### 基本用法

向你的工具定义添加一个可选的 `input_examples` 字段，包含示例输入对象数组。每个示例必须根据工具的 `input_schema` 有效：

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    betas=["advanced-tool-use-2025-11-20"],
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
                        "description": "The unit of temperature"
                    }
                },
                "required": ["location"]
            },
            "input_examples": [
                {
                    "location": "San Francisco, CA",
                    "unit": "fahrenheit"
                },
                {
                    "location": "Tokyo, Japan",
                    "unit": "celsius"
                },
                {
                    "location": "New York, NY"  # 'unit' is optional
                }
            ]
        }
    ],
    messages=[
        {"role": "user", "content": "What's the weather like in San Francisco?"}
    ]
)
```

```typescript TypeScript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const response = await client.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  betas: ["advanced-tool-use-2025-11-20"],
  tools: [
    {
      name: "get_weather",
      description: "Get the current weather in a given location",
      input_schema: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "The city and state, e.g. San Francisco, CA",
          },
          unit: {
            type: "string",
            enum: ["celsius", "fahrenheit"],
            description: "The unit of temperature",
          },
        },
        required: ["location"],
      },
      input_examples: [
        {
          location: "San Francisco, CA",
          unit: "fahrenheit",
        },
        {
          location: "Tokyo, Japan",
          unit: "celsius",
        },
        {
          location: "New York, NY",
          // Demonstrates that 'unit' is optional
        },
      ],
    },
  ],
  messages: [{ role: "user", content: "What's the weather like in San Francisco?" }],
});
```
</CodeGroup>

示例包含在提示中，与你的工具模式一起，向 Claude 展示格式良好的工具调用的具体模式。这帮助 Claude 理解何时包含可选参数、使用什么格式以及如何构造复杂输入。

### 要求和限制

- **模式验证** - 每个示例必须根据工具的 `input_schema` 有效。无效的示例返回 400 错误
- **不支持服务器端工具** - 只有用户定义的工具可以有输入示例
- **令牌成本** - 示例增加提示令牌：简单示例约 20-50 个令牌，复杂嵌套对象约 100-200 个令牌

## 工具运行器（测试版）

工具运行器为使用 Claude 执行工具提供了开箱即用的解决方案。工具运行器不是手动处理工具调用、工具结果和对话管理，而是自动：

- 在 Claude 调用工具时执行工具
- 处理请求/响应周期
- 管理对话状态
- 提供类型安全和验证

我们建议你对大多数工具使用实现使用工具运行器。

<Note>
工具运行器目前处于测试版，可在 [Python](https://github.com/anthropics/anthropic-sdk-python/blob/main/tools.md)、[TypeScript](https://github.com/anthropics/anthropic-sdk-typescript/blob/main/helpers.md#tool-helpers) 和 [Ruby](https://github.com/anthropics/anthropic-sdk-ruby/blob/main/helpers.md#3-auto-looping-tool-runner-beta) SDK 中使用。
</Note>

<Tip>
**使用压缩的自动上下文管理**

工具运行器支持自动 [压缩](/docs/zh-CN/build-with-claude/context-editing#client-side-compaction-sdk)，当令牌使用超过阈值时生成摘要。这允许长时间运行的代理任务继续超过上下文窗口限制。
</Tip>

<Tabs>
<Tab title="Python">

### 基本用法

使用 `@beta_tool` 装饰器定义工具，使用 `client.beta.messages.tool_runner()` 执行它们。

<Note>
如果你使用异步客户端，将 `@beta_tool` 替换为 `@beta_async_tool` 并使用 `async def` 定义函数。
</Note>

```python
import anthropic
import json
from anthropic import beta_tool

# Initialize client
client = anthropic.Anthropic()

# Define tools using the decorator
@beta_tool
def get_weather(location: str, unit: str = "fahrenheit") -> str:
    """Get the current weather in a given location.

    Args:
        location: The city and state, e.g. San Francisco, CA
        unit: Temperature unit, either 'celsius' or 'fahrenheit'
    """
    # In a full implementation, you'd call a weather API here
    return json.dumps({"temperature": "20°C", "condition": "Sunny"})

@beta_tool
def calculate_sum(a: int, b: int) -> str:
    """Add two numbers together.

    Args:
        a: First number
        b: Second number
    """
    return str(a + b)

# Use the tool runner
runner = client.beta.messages.tool_runner(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[get_weather, calculate_sum],
    messages=[
        {"role": "user", "content": "What's the weather like in Paris? Also, what's 15 + 27?"}
    ]
)
for message in runner:
    print(message.content[0].text)
```

装饰的函数必须返回内容块或内容块数组，包括文本、图像或文档块。这允许工具返回丰富的多模态响应。返回的字符串将转换为文本内容块。
如果你想向 Claude 返回结构化的 JSON 对象，请在返回前将其编码为 JSON 字符串。数字、布尔值或其他非字符串原始类型也必须转换为字符串。

`@beta_tool` 装饰器将检查函数参数和文档字符串，以提取给定函数的 json 模式表示，在上面的示例中 `calculate_sum` 将转换为：

```json
{
  "name": "calculate_sum",
  "description": "Adds two integers together.",
  "input_schema": {
    "additionalProperties": false,
    "properties": {
      "left": {
        "description": "The first integer to add.",
        "title": "Left",
        "type": "integer"
      },
      "right": {
        "description": "The second integer to add.",
        "title": "Right",
        "type": "integer"
      }
    },
    "required": ["left", "right"],
    "type": "object"
  }
}
```

### 遍历工具运行器

由 `tool_runner()` 返回的工具运行器是可迭代的，你可以使用 `for` 循环遍历它。这通常被称为"工具调用循环"。
每个循环迭代产生由 Claude 返回的消息。

在你的代码有机会处理循环内的当前消息后，工具运行器将检查消息以查看 Claude 是否请求了工具使用。如果是，它将调用工具并自动将工具结果发送回 Claude，然后产生来自 Claude 的下一条消息以开始循环的下一次迭代。

你可以在任何迭代处使用简单的 `break` 语句结束循环。工具运行器将循环直到 Claude 返回没有工具使用的消息。

如果你不关心中间消息，你可以调用 `until_done()` 方法而不是使用循环，该方法将返回来自 Claude 的最终消息：

```python
runner = client.beta.messages.tool_runner(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[get_weather, calculate_sum],
    messages=[
        {"role": "user", "content": "What's the weather like in Paris? Also, what's 15 + 27?"}
    ]
)
final_message = runner.until_done()
print(final_message.content[0].text)
```

### 高级用法

在循环内，你可以完全自定义工具运行器对消息 API 的下一个请求。
方法 `runner.generate_tool_call_response()` 将调用工具（如果 Claude 触发了工具使用）并让你访问将发送回消息 API 的工具结果。
方法 `runner.set_messages_params()` 和 `runner.append_messages()` 允许你修改下一个消息 API 请求的参数。

```python
runner = client.beta.messages.tool_runner(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[get_weather],
    messages=[{"role": "user", "content": "What's the weather in San Francisco?"}]
)
for message in runner:
    # Get the tool response that will be sent
    tool_response = runner.generate_tool_call_response()

    # Customize the next request
    runner.set_messages_params(lambda params: {
        **params,
        "max_tokens": 2048  # Increase tokens for next request
    })

    # Or add additional messages
    runner.append_messages(
        {"role": "user", "content": "Please be concise in your response."}
    )
```

### 流式传输

启用 `stream=True` 流式传输时，工具运行器发出的每个值都是从 `anthropic.messages.stream()` 返回的 `BetaMessageStream`。`BetaMessageStream` 本身是一个可迭代的，产生来自消息 API 的流式事件。

你可以使用 `message_stream.get_final_message()` 让 SDK 为你完成流式事件到最终消息的累积。

```python
runner = client.beta.messages.tool_runner(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[calculate_sum],
    messages=[{"role": "user", "content": "What is 15 + 27?"}],
    stream=True
)

# When streaming, the runner returns BetaMessageStream
for message_stream in runner:
    for event in message_stream:
        print('event:', event)
    print('message:', message_stream.get_final_message())

print(runner.until_done())
```

</Tab>
<Tab title="TypeScript (Zod)">

### 基本用法

使用 `betaZodTool()` 进行类型安全的工具定义，具有 Zod 验证（需要 Zod 3.25.0 或更高版本）。

```typescript
import { Anthropic } from '@anthropic-ai/sdk';
import { betaZodTool, betaTool } from '@anthropic-ai/sdk/helpers/beta/zod';
import { z } from 'zod';

const anthropic = new Anthropic();

// Using betaZodTool (requires Zod 3.25.0+)
const getWeatherTool = betaZodTool({
  name: 'get_weather',
  description: 'Get the current weather in a given location',
  inputSchema: z.object({
    location: z.string().describe('The city and state, e.g. San Francisco, CA'),
    unit: z.enum(['celsius', 'fahrenheit']).default('fahrenheit')
      .describe('Temperature unit')
  }),
  run: async (input) => {
    // In a full implementation, you'd call a weather API here
    return JSON.stringify({temperature: '20°C', condition: 'Sunny'});
  }
});

// Use the tool runner
const runner = anthropic.beta.messages.toolRunner({
  model: 'claude-sonnet-4-5',
  max_tokens: 1024,
  tools: [getWeatherTool],
  messages: [
    {
      role: 'user',
      content: "What's the weather like in Paris?"
    }
  ]
});

// Process messages as they come in
for await (const message of runner) {
  console.log(message.content[0].text);
}
```

`run` 函数必须返回内容块或内容块数组，包括文本、图像或文档块。这允许工具返回丰富的多模态响应。返回的字符串将转换为文本内容块。
如果你想向 Claude 返回结构化的 JSON 对象，请在返回前将其字符串化为 JSON 字符串。数字、布尔值或其他非字符串原始类型也必须转换为字符串。

### 遍历工具运行器

由 `toolRunner()` 返回的工具运行器是异步可迭代的，你可以使用 `for await ... of` 循环遍历它。这通常被称为"工具调用循环"。
每个循环迭代产生由 Claude 返回的消息。

在你的代码有机会处理循环内的当前消息后，工具运行器将检查消息以查看 Claude 是否请求了工具使用。如果是，它将调用工具并自动将工具结果发送回 Claude，然后产生来自 Claude 的下一条消息以开始循环的下一次迭代。

你可以在任何迭代处使用简单的 `break` 语句结束循环。工具运行器将循环直到 Claude 返回没有工具使用的消息。

如果你不关心中间消息，你可以简单地 `await` 工具运行器，它将返回来自 Claude 的最终消息。

### 高级用法

在循环内，你可以完全自定义工具运行器对消息 API 的下一个请求。
方法 `runner.generateToolResponse()` 将调用工具（如果 Claude 触发了工具使用）并让你访问将发送回消息 API 的工具结果。
方法 `runner.setMessagesParams()` 和 `runner.pushMessages()` 允许你修改下一个消息 API 请求的参数。当前参数可在 `runner.params` 下获得。

```typescript
const runner = anthropic.beta.messages.toolRunner({
  model: 'claude-sonnet-4-5',
  max_tokens: 1024,
  tools: [getWeatherTool],
  messages: [
    { role: 'user', content: "What's the weather in San Francisco?" }
  ]
});

for await (const message of runner) {
  // Get the tool response that will be sent
  const toolResponse = await runner.generateToolResponse();

  // Customize the next request
  runner.setMessagesParams(params => ({
    ...params,
    max_tokens: 2048  // Increase tokens for next request
  }));

  // Or add additional messages
  runner.pushMessages(
    { role: 'user', content: 'Please be concise in your response.' }
  );
}
```

### 流式传输

启用 `stream: true` 流式传输时，工具运行器发出的每个值都是从 `anthropic.messages.stream()` 返回的 `MessageStream`。`MessageStream` 本身是一个异步可迭代的，产生来自消息 API 的流式事件。

你可以使用 `messageStream.finalMessage()` 让 SDK 为你完成流式事件到最终消息的累积。

```typescript
const runner = anthropic.beta.messages.toolRunner({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 1000,
  messages: [{ role: 'user', content: 'What is the weather in San Francisco?' }],
  tools: [calculatorTool],
  stream: true,
});

// When streaming, the runner returns BetaMessageStream
for await (const messageStream of runner) {
  for await (const event of messageStream) {
    console.log('event:', event);
  }
  console.log('message:', await messageStream.finalMessage());
}

console.log(await runner);
```

</Tab>
<Tab title="TypeScript (JSON Schema)">

### 基本用法

使用 `betaTool()` 进行基于 JSON 模式的类型安全工具定义。TypeScript 和你的编辑器将意识到 `input` 参数的类型以进行自动完成。

<Note>
Claude 生成的输入在运行时不会被验证。如果需要，在 `run` 函数内执行验证。
</Note>

```typescript
import { Anthropic } from '@anthropic-ai/sdk';
import { betaZodTool, betaTool } from '@anthropic-ai/sdk/helpers/beta/json-schema';
import { z } from 'zod';

const anthropic = new Anthropic();

// Using betaTool with JSON schema (no Zod required)
const calculateSumTool = betaTool({
  name: 'calculate_sum',
  description: 'Add two numbers together',
  inputSchema: {
    type: 'object',
    properties: {
      a: { type: 'number', description: 'First number' },
      b: { type: 'number', description: 'Second number' }
    },
    required: ['a', 'b']
  },
  run: async (input) => {
    return String(input.a + input.b);
  }
});

// Use the tool runner
const runner = anthropic.beta.messages.toolRunner({
  model: 'claude-sonnet-4-5',
  max_tokens: 1024,
  tools: [getWeatherTool, calculateSumTool],
  messages: [
    {
      role: 'user',
      content: "What's 15 + 27?"
    }
  ]
});

// Process messages as they come in
for await (const message of runner) {
  console.log(message.content[0].text);
}
```

`run` 函数必须返回任何内容块或内容块数组，包括文本、图像或文档块。这允许工具返回丰富的多模态响应。返回的字符串将转换为文本内容块。
如果你想向 Claude 返回结构化的 JSON 对象，请在返回前将其编码为 JSON 字符串。数字、布尔值或其他非字符串原始类型也必须转换为字符串。

### 遍历工具运行器

由 `toolRunner()` 返回的工具运行器是异步可迭代的，你可以使用 `for await ... of` 循环遍历它。这通常被称为"工具调用循环"。
每个循环迭代产生由 Claude 返回的消息。

在你的代码有机会处理循环内的当前消息后，工具运行器将检查消息以查看 Claude 是否请求了工具使用。如果是，它将调用工具并自动将工具结果发送回 Claude，然后产生来自 Claude 的下一条消息以开始循环的下一次迭代。

你可以在任何迭代处使用简单的 `break` 语句结束循环。工具运行器将循环直到 Claude 返回没有工具使用的消息。

如果你不关心中间消息，你可以简单地 `await` 工具运行器，它将返回来自 Claude 的最终消息。

### 高级用法

在循环内，你可以完全自定义工具运行器对消息 API 的下一个请求。
方法 `runner.generateToolResponse()` 将调用工具（如果 Claude 触发了工具使用）并让你访问将发送回消息 API 的工具结果。
方法 `runner.setMessagesParams()` 和 `runner.pushMessages()` 允许你修改下一个消息 API 请求的参数。当前参数可在 `runner.params` 下获得。

```typescript
const runner = anthropic.beta.messages.toolRunner({
  model: 'claude-sonnet-4-5',
  max_tokens: 1024,
  tools: [getWeatherTool],
  messages: [
    { role: 'user', content: "What's the weather in San Francisco?" }
  ]
});

for await (const message of runner) {
  // Get the tool response that will be sent
  const toolResponse = await runner.generateToolResponse();

  // Customize the next request
  runner.setMessagesParams(params => ({
    ...params,
    max_tokens: 2048  // Increase tokens for next request
  }));

  // Or add additional messages
  runner.pushMessages(
    { role: 'user', content: 'Please be concise in your response.' }
  );
}
```

### 流式传输

启用 `stream: true` 流式传输时，工具运行器发出的每个值都是从 `anthropic.messages.stream()` 返回的 `MessageStream`。`MessageStream` 本身是一个异步可迭代的，产生来自消息 API 的流式事件。

你可以使用 `messageStream.finalMessage()` 让 SDK 为你完成流式事件到最终消息的累积。

```typescript
const runner = anthropic.beta.messages.toolRunner({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 1000,
  messages: [{ role: 'user', content: 'What is the weather in San Francisco?' }],
  tools: [calculatorTool],
  stream: true,
});

// When streaming, the runner returns BetaMessageStream
for await (const messageStream of runner) {
  for await (const event of messageStream) {
    console.log('event:', event);
  }
  console.log('message:', await messageStream.finalMessage());
}

console.log(await runner);
```

</Tab>
<Tab title="Ruby">

### 基本用法

使用 `Anthropic::BaseTool` 和输入模式定义工具，然后使用 `client.beta.messages.tool_runner` 执行它们。

```ruby
require "anthropic"

# Initialize client
client = Anthropic::Client.new

# Define input schema
class GetWeatherInput < Anthropic::BaseModel
  required :location, String, doc: "The city and state, e.g. San Francisco, CA"
  optional :unit, Anthropic::InputSchema::EnumOf["celsius", "fahrenheit"],
           doc: "Temperature unit"
end

# Define tool
class GetWeather < Anthropic::BaseTool
  doc "Get the current weather in a given location"
  input_schema GetWeatherInput

  def call(input)
    # In a full implementation, you'd call a weather API here
    JSON.generate({temperature: "20°C", condition: "Sunny"})
  end
end

class CalculateSumInput < Anthropic::BaseModel
  required :a, Integer, doc: "First number"
  required :b, Integer, doc: "Second number"
end

class CalculateSum < Anthropic::BaseTool
  doc "Add two numbers together"
  input_schema CalculateSumInput

  def call(input)
    (input.a + input.b).to_s
  end
end

# Use the tool runner
runner = client.beta.messages.tool_runner(
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: [GetWeather.new, CalculateSum.new],
  messages: [
    {role: "user", content: "What's the weather like in Paris? Also, what's 15 + 27?"}
  ]
)

runner.each_message do |message|
  message.content.each do |block|
    puts block.text if block.respond_to?(:text)
  end
end
```

`call` 方法必须返回字符串或内容块数组。如果你想向 Claude 返回结构化的 JSON 对象，请在返回前将其编码为 JSON 字符串。

`Anthropic::BaseTool` 类使用 `doc` 方法作为工具描述，使用 `input_schema` 定义预期参数。SDK 将自动将其转换为适当的 JSON 模式格式。

### 遍历工具运行器

工具运行器提供 `each_message` 方法，在对话进行时产生每条消息。这通常被称为"工具调用循环"。

在你的代码有机会处理当前消息后，工具运行器将检查 Claude 是否请求了工具使用。如果是，它将调用工具并自动将工具结果发送回 Claude，然后产生下一条消息。

如果你不关心中间消息，你可以使用 `run_until_finished` 方法一次获得所有消息：

```ruby
runner = client.beta.messages.tool_runner(
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: [GetWeather.new, CalculateSum.new],
  messages: [
    {role: "user", content: "What's the weather like in Paris? Also, what's 15 + 27?"}
  ]
)

all_messages = runner.run_until_finished
all_messages.each { |msg| puts msg.content }
```

### 高级用法

工具运行器提供几种方法来自定义行为：

- `#next_message` - 手动逐个步进对话
- `#feed_messages` - 在对话中间注入额外消息
- `#params` - 访问或修改当前请求参数

```ruby
runner = client.beta.messages.tool_runner(
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: [GetWeather.new],
  messages: [{role: "user", content: "What's the weather in San Francisco?"}]
)

# Manual step-by-step control
message = runner.next_message
puts message.content

# Inject follow-up messages
runner.feed_messages([
  {role: "user", content: "Also check Boston"}
])

# Access current parameters
puts runner.params
```

### 流式传输

使用流式传输时，使用 `each_streaming` 迭代以接收实时事件：

```ruby
runner = client.beta.messages.tool_runner(
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: [CalculateSum.new],
  messages: [{role: "user", content: "What is 15 + 27?"}]
)

runner.each_streaming do |event|
  case event
  when Anthropic::Streaming::TextEvent
    print event.text
  when Anthropic::Streaming::ToolUseEvent
    puts "\nTool called: #{event.tool_name}"
  end
end
```

</Tab>
</Tabs>

<Note>
SDK 工具运行器处于测试版。本文档的其余部分涵盖手动工具实现。
</Note>

## 控制 Claude 的输出

### 强制工具使用

在某些情况下，你可能希望 Claude 使用特定工具来回答用户的问题，即使 Claude 认为它可以在不使用工具的情况下提供答案。你可以通过在 `tool_choice` 字段中指定工具来执行此操作，如下所示：

```
tool_choice = {"type": "tool", "name": "get_weather"}
```

使用 tool_choice 参数时，我们有四个可能的选项：

- `auto` 允许 Claude 决定是否调用任何提供的工具。这是提供 `tools` 时的默认值。
- `any` 告诉 Claude 它必须使用提供的工具之一，但不强制特定工具。
- `tool` 允许我们强制 Claude 始终使用特定工具。
- `none` 防止 Claude 使用任何工具。这是未提供 `tools` 时的默认值。

<Note>
使用 [提示缓存](/docs/zh-CN/build-with-claude/prompt-caching#what-invalidates-the-cache) 时，对 `tool_choice` 参数的更改将使缓存的消息块失效。工具定义和系统提示保持缓存，但消息内容必须重新处理。
</Note>

此图说明了每个选项的工作方式：

<Frame>
  ![Image](/docs/images/tool_choice.png)
</Frame>

请注意，当你有 `tool_choice` 为 `any` 或 `tool` 时，我们将预填充助手消息以强制使用工具。这意味着模型不会在 `tool_use` 内容块之前发出自然语言响应或解释，即使被明确要求这样做。

<Note>
使用 [扩展思考](/docs/zh-CN/build-with-claude/extended-thinking) 和工具使用时，不支持 `tool_choice: {"type": "any"}` 和 `tool_choice: {"type": "tool", "name": "..."}` 并将导致错误。只有 `tool_choice: {"type": "auto"}` （默认）和 `tool_choice: {"type": "none"}` 与扩展思考兼容。
</Note>

我们的测试表明这不应该降低性能。如果你希望模型在仍然请求模型使用特定工具的同时提供自然语言上下文或解释，你可以对 `tool_choice` 使用 `{"type": "auto"}` （默认）并在 `user` 消息中添加显式指令。例如：`What's the weather like in London? Use the get_weather tool in your response.`

<Tip>
**使用严格工具保证工具调用**

将 `tool_choice: {"type": "any"}` 与 [严格工具使用](/docs/zh-CN/build-with-claude/structured-outputs) 结合，以保证你的工具之一将被调用 AND 工具输入严格遵循你的模式。在你的工具定义上设置 `strict: true` 以启用模式验证。
</Tip>

### JSON 输出

工具不一定需要是客户端函数 — 你可以在任何时候想要模型返回遵循提供的模式的 JSON 输出时使用工具。例如，你可能使用具有特定模式的 `record_summary` 工具。参见 [Claude 的工具使用](/docs/zh-CN/agents-and-tools/tool-use/overview) 了解完整的工作示例。

### 使用工具的模型响应

使用工具时，Claude 通常会在调用工具之前评论它正在做什么或自然地响应用户。

例如，给定提示"旧金山现在的天气如何，那里现在几点？"，Claude 可能会这样响应：

```json JSON
{
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "I'll help you check the current weather and time in San Francisco."
    },
    {
      "type": "tool_use",
      "id": "toolu_01A09q90qw90lq917835lq9",
      "name": "get_weather",
      "input": {"location": "San Francisco, CA"}
    }
  ]
}
```

这种自然的响应风格帮助用户理解 Claude 正在做什么，并创建更具对话性的交互。您可以通过系统提示和在提示中提供 `<examples>` 来指导这些响应的风格和内容。

需要注意的是，Claude 在解释其操作时可能会使用各种措辞和方法。您的代码应该像对待任何其他助手生成的文本一样对待这些响应，而不是依赖特定的格式约定。

### 并行工具使用

默认情况下，Claude 可能会使用多个工具来回答用户查询。您可以通过以下方式禁用此行为：

- 当 tool_choice 类型为 `auto` 时设置 `disable_parallel_tool_use=true`，这确保 Claude 最多使用**一个**工具
- 当 tool_choice 类型为 `any` 或 `tool` 时设置 `disable_parallel_tool_use=true`，这确保 Claude 恰好使用**一个**工具

<section title="完整的并行工具使用示例">

<Note>
**使用工具运行器更简单**：下面的示例展示了手动并行工具处理。对于大多数用例，[工具运行器](#tool-runner-beta)会自动处理并行工具执行，代码少得多。
</Note>

以下是一个完整示例，展示如何在消息历史中正确格式化并行工具调用：

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# Define tools
tools = [
    {
        "name": "get_weather",
        "description": "Get the current weather in a given location",
        "input_schema": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "The city and state, e.g. San Francisco, CA"
                }
            },
            "required": ["location"]
        }
    },
    {
        "name": "get_time",
        "description": "Get the current time in a given timezone",
        "input_schema": {
            "type": "object",
            "properties": {
                "timezone": {
                    "type": "string",
                    "description": "The timezone, e.g. America/New_York"
                }
            },
            "required": ["timezone"]
        }
    }
]

# Initial request
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=tools,
    messages=[
        {
            "role": "user",
            "content": "What's the weather in SF and NYC, and what time is it there?"
        }
    ]
)

# Claude's response with parallel tool calls
print("Claude wants to use tools:", response.stop_reason == "tool_use")
print("Number of tool calls:", len([c for c in response.content if c.type == "tool_use"]))

# Build the conversation with tool results
messages = [
    {
        "role": "user",
        "content": "What's the weather in SF and NYC, and what time is it there?"
    },
    {
        "role": "assistant",
        "content": response.content  # Contains multiple tool_use blocks
    },
    {
        "role": "user",
        "content": [
            {
                "type": "tool_result",
                "tool_use_id": "toolu_01",  # Must match the ID from tool_use
                "content": "San Francisco: 68°F, partly cloudy"
            },
            {
                "type": "tool_result",
                "tool_use_id": "toolu_02",
                "content": "New York: 45°F, clear skies"
            },
            {
                "type": "tool_result",
                "tool_use_id": "toolu_03",
                "content": "San Francisco time: 2:30 PM PST"
            },
            {
                "type": "tool_result",
                "tool_use_id": "toolu_04",
                "content": "New York time: 5:30 PM EST"
            }
        ]
    }
]

# Get final response
final_response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=tools,
    messages=messages
)

print(final_response.content[0].text)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

// Define tools
const tools = [
  {
    name: "get_weather",
    description: "Get the current weather in a given location",
    input_schema: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "The city and state, e.g. San Francisco, CA"
        }
      },
      required: ["location"]
    }
  },
  {
    name: "get_time",
    description: "Get the current time in a given timezone",
    input_schema: {
      type: "object",
      properties: {
        timezone: {
          type: "string",
          description: "The timezone, e.g. America/New_York"
        }
      },
      required: ["timezone"]
    }
  }
];

// Initial request
const response = await anthropic.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: tools,
  messages: [
    {
      role: "user",
      content: "What's the weather in SF and NYC, and what time is it there?"
    }
  ]
});

// Build conversation with tool results
const messages = [
  {
    role: "user",
    content: "What's the weather in SF and NYC, and what time is it there?"
  },
  {
    role: "assistant",
    content: response.content  // Contains multiple tool_use blocks
  },
  {
    role: "user",
    content: [
      {
        type: "tool_result",
        tool_use_id: "toolu_01",  // Must match the ID from tool_use
        content: "San Francisco: 68°F, partly cloudy"
      },
      {
        type: "tool_result",
        tool_use_id: "toolu_02",
        content: "New York: 45°F, clear skies"
      },
      {
        type: "tool_result",
        tool_use_id: "toolu_03",
        content: "San Francisco time: 2:30 PM PST"
      },
      {
        type: "tool_result",
        tool_use_id: "toolu_04",
        content: "New York time: 5:30 PM EST"
      }
    ]
  }
];

// Get final response
const finalResponse = await anthropic.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: tools,
  messages: messages
});

console.log(finalResponse.content[0].text);
```
</CodeGroup>

带有并行工具调用的助手消息如下所示：

```json
{
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "I'll check the weather and time for both San Francisco and New York City."
    },
    {
      "type": "tool_use",
      "id": "toolu_01",
      "name": "get_weather",
      "input": {"location": "San Francisco, CA"}
    },
    {
      "type": "tool_use",
      "id": "toolu_02",
      "name": "get_weather",
      "input": {"location": "New York, NY"}
    },
    {
      "type": "tool_use",
      "id": "toolu_03",
      "name": "get_time",
      "input": {"timezone": "America/Los_Angeles"}
    },
    {
      "type": "tool_use",
      "id": "toolu_04",
      "name": "get_time",
      "input": {"timezone": "America/New_York"}
    }
  ]
}
```

</section>
<section title="并行工具的完整测试脚本">

以下是一个完整的、可运行的脚本，用于测试和验证并行工具调用是否正常工作：

<CodeGroup>
```python Python
#!/usr/bin/env python3
"""Test script to verify parallel tool calls with the Claude API"""

import os
from anthropic import Anthropic

# Initialize client
client = Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

# Define tools
tools = [
    {
        "name": "get_weather",
        "description": "Get the current weather in a given location",
        "input_schema": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "The city and state, e.g. San Francisco, CA"
                }
            },
            "required": ["location"]
        }
    },
    {
        "name": "get_time",
        "description": "Get the current time in a given timezone",
        "input_schema": {
            "type": "object",
            "properties": {
                "timezone": {
                    "type": "string",
                    "description": "The timezone, e.g. America/New_York"
                }
            },
            "required": ["timezone"]
        }
    }
]

# Test conversation with parallel tool calls
messages = [
    {
        "role": "user",
        "content": "What's the weather in SF and NYC, and what time is it there?"
    }
]

# Make initial request
print("Requesting parallel tool calls...")
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=messages,
    tools=tools
)

# Check for parallel tool calls
tool_uses = [block for block in response.content if block.type == "tool_use"]
print(f"\n✓ Claude made {len(tool_uses)} tool calls")

if len(tool_uses) > 1:
    print("✓ Parallel tool calls detected!")
    for tool in tool_uses:
        print(f"  - {tool.name}: {tool.input}")
else:
    print("✗ No parallel tool calls detected")

# Simulate tool execution and format results correctly
tool_results = []
for tool_use in tool_uses:
    if tool_use.name == "get_weather":
        if "San Francisco" in str(tool_use.input):
            result = "San Francisco: 68°F, partly cloudy"
        else:
            result = "New York: 45°F, clear skies"
    else:  # get_time
        if "Los_Angeles" in str(tool_use.input):
            result = "2:30 PM PST"
        else:
            result = "5:30 PM EST"

    tool_results.append({
        "type": "tool_result",
        "tool_use_id": tool_use.id,
        "content": result
    })

# Continue conversation with tool results
messages.extend([
    {"role": "assistant", "content": response.content},
    {"role": "user", "content": tool_results}  # All results in one message!
])

# Get final response
print("\nGetting final response...")
final_response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=messages,
    tools=tools
)

print(f"\nClaude's response:\n{final_response.content[0].text}")

# Verify formatting
print("\n--- Verification ---")
print(f"✓ Tool results sent in single user message: {len(tool_results)} results")
print("✓ No text before tool results in content array")
print("✓ Conversation formatted correctly for future parallel tool use")
```

```typescript TypeScript
#!/usr/bin/env node
// Test script to verify parallel tool calls with the Claude API

import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Define tools
const tools = [
  {
    name: "get_weather",
    description: "Get the current weather in a given location",
    input_schema: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "The city and state, e.g. San Francisco, CA"
        }
      },
      required: ["location"]
    }
  },
  {
    name: "get_time",
    description: "Get the current time in a given timezone",
    input_schema: {
      type: "object",
      properties: {
        timezone: {
          type: "string",
          description: "The timezone, e.g. America/New_York"
        }
      },
      required: ["timezone"]
    }
  }
];

async function testParallelTools() {
  // Make initial request
  console.log("Requesting parallel tool calls...");
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    messages: [{
      role: "user",
      content: "What's the weather in SF and NYC, and what time is it there?"
    }],
    tools: tools
  });

  // Check for parallel tool calls
  const toolUses = response.content.filter(block => block.type === "tool_use");
  console.log(`\n✓ Claude made ${toolUses.length} tool calls`);

  if (toolUses.length > 1) {
    console.log("✓ Parallel tool calls detected!");
    toolUses.forEach(tool => {
      console.log(`  - ${tool.name}: ${JSON.stringify(tool.input)}`);
    });
  } else {
    console.log("✗ No parallel tool calls detected");
  }

  // Simulate tool execution and format results correctly
  const toolResults = toolUses.map(toolUse => {
    let result;
    if (toolUse.name === "get_weather") {
      result = toolUse.input.location.includes("San Francisco")
        ? "San Francisco: 68°F, partly cloudy"
        : "New York: 45°F, clear skies";
    } else {
      result = toolUse.input.timezone.includes("Los_Angeles")
        ? "2:30 PM PST"
        : "5:30 PM EST";
    }

    return {
      type: "tool_result",
      tool_use_id: toolUse.id,
      content: result
    };
  });

  // Get final response with correct formatting
  console.log("\nGetting final response...");
  const finalResponse = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    messages: [
      { role: "user", content: "What's the weather in SF and NYC, and what time is it there?" },
      { role: "assistant", content: response.content },
      { role: "user", content: toolResults }  // All results in one message!
    ],
    tools: tools
  });

  console.log(`\nClaude's response:\n${finalResponse.content[0].text}`);

  // Verify formatting
  console.log("\n--- Verification ---");
  console.log(`✓ Tool results sent in single user message: ${toolResults.length} results`);
  console.log("✓ No text before tool results in content array");
  console.log("✓ Conversation formatted correctly for future parallel tool use");
}

testParallelTools().catch(console.error);
```
</CodeGroup>

此脚本演示了：
- 如何正确格式化并行工具调用和结果
- 如何验证正在进行并行调用
- 鼓励未来并行工具使用的正确消息结构
- 要避免的常见错误（如工具结果前的文本）

运行此脚本以测试您的实现，并确保 Claude 有效地进行并行工具调用。

</section>

#### 最大化并行工具使用

虽然 Claude 4 模型默认具有出色的并行工具使用功能，但您可以通过有针对性的提示在所有模型中增加并行工具执行的可能性：

<section title="并行工具使用的系统提示">

对于 Claude 4 模型（Opus 4 和 Sonnet 4），将以下内容添加到您的系统提示中：
```text
For maximum efficiency, whenever you need to perform multiple independent operations, invoke all relevant tools simultaneously rather than sequentially.
```

为了获得更强的并行工具使用（如果默认值不够，建议使用），请使用：
```text
<use_parallel_tool_calls>
For maximum efficiency, whenever you perform multiple independent operations, invoke all relevant tools simultaneously rather than sequentially. Prioritize calling tools in parallel whenever possible. For example, when reading 3 files, run 3 tool calls in parallel to read all 3 files into context at the same time. When running multiple read-only commands like `ls` or `list_dir`, always run all of the commands in parallel. Err on the side of maximizing parallel tool calls rather than running too many tools sequentially.
</use_parallel_tool_calls>
```

</section>
<section title="用户消息提示">

您也可以在特定用户消息中鼓励并行工具使用：

```python
# Instead of:
"What's the weather in Paris? Also check London."

# Use:
"Check the weather in Paris and London simultaneously."

# Or be explicit:
"Please use parallel tool calls to get the weather for Paris, London, and Tokyo at the same time."
```

</section>

<Warning>
**Claude Sonnet 3.7 的并行工具使用**

Claude Sonnet 3.7 可能不太可能在响应中进行并行工具调用，即使您未设置 `disable_parallel_tool_use`。我们建议[升级到 Claude 4 模型](/docs/zh-CN/about-claude/models/migrating-to-claude-4)，它们具有内置的令牌高效工具使用和改进的并行工具调用。

如果您仍在使用 Claude Sonnet 3.7，可以启用 `token-efficient-tools-2025-02-19` [beta 标头](/docs/zh-CN/api/beta-headers)，这有助于鼓励 Claude 使用并行工具。您也可以引入一个"批量工具"，可以充当元工具来同时包装对其他工具的调用。

有关如何使用此解决方法的信息，请参阅我们食谱中的[此示例](https://github.com/anthropics/anthropic-cookbook/blob/main/tool_use/parallel_tools_claude_3_7_sonnet.ipynb)。

</Warning>

## 处理工具使用和工具结果内容块

<Note>
**使用工具运行器更简单**：本部分中描述的手动工具处理由[工具运行器](#tool-runner-beta)自动管理。当您需要对工具执行进行自定义控制时，请使用本部分。
</Note>

Claude 的响应根据它使用的是客户端工具还是服务器工具而有所不同。

### 处理来自客户端工具的结果

响应将具有 `tool_use` 的 `stop_reason` 和一个或多个 `tool_use` 内容块，其中包括：

- `id`：此特定工具使用块的唯一标识符。这将用于稍后匹配工具结果。
- `name`：正在使用的工具的名称。
- `input`：包含传递给工具的输入的对象，符合工具的 `input_schema`。

<section title="带有 `tool_use` 内容块的示例 API 响应">

```json JSON
{
  "id": "msg_01Aq9w938a90dw8q",
  "model": "claude-sonnet-4-5",
  "stop_reason": "tool_use",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "I'll check the current weather in San Francisco for you."
    },
    {
      "type": "tool_use",
      "id": "toolu_01A09q90qw90lq917835lq9",
      "name": "get_weather",
      "input": {"location": "San Francisco, CA", "unit": "celsius"}
    }
  ]
}
```

</section>

当您收到客户端工具的工具使用响应时，您应该：

1. 从 `tool_use` 块中提取 `name`、`id` 和 `input`。
2. 运行代码库中与该工具名称对应的实际工具，传入工具 `input`。
3. 通过发送一条新消息来继续对话，其 `role` 为 `user`，`content` 块包含 `tool_result` 类型和以下信息：
   - `tool_use_id`：这是结果的工具使用请求的 `id`。
   - `content`：工具的结果，作为字符串（例如 `"content": "15 degrees"`）、嵌套内容块的列表（例如 `"content": [{"type": "text", "text": "15 degrees"}]`）或文档块的列表（例如 `"content": ["type": "document", "source": {"type": "text", "media_type": "text/plain", "data": "15 degrees"}]`）。这些内容块可以使用 `text`、`image` 或 `document` 类型。
   - `is_error`（可选）：如果工具执行导致错误，设置为 `true`。

<Note>
**重要的格式要求**：
- 工具结果块必须紧跟在消息历史中对应的工具使用块之后。您不能在助手的工具使用消息和用户的工具结果消息之间包含任何消息。
- 在包含工具结果的用户消息中，tool_result 块必须首先出现在内容数组中。任何文本必须在所有工具结果之后。

例如，这会导致 400 错误：
```json
{"role": "user", "content": [
  {"type": "text", "text": "Here are the results:"},  // ❌ Text before tool_result
  {"type": "tool_result", "tool_use_id": "toolu_01", ...}
]}
```

这是正确的：
```json
{"role": "user", "content": [
  {"type": "tool_result", "tool_use_id": "toolu_01", ...},
  {"type": "text", "text": "What should I do next?"}  // ✅ Text after tool_result
]}
```

如果您收到类似"tool_use ids were found without tool_result blocks immediately after"的错误，请检查您的工具结果是否格式正确。
</Note>

<section title="成功的工具结果示例">

```json JSON
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "15 degrees"
    }
  ]
}
```

</section>

<section title="带有图像的工具结果示例">

```json JSON
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": [
        {"type": "text", "text": "15 degrees"},
        {
          "type": "image",
          "source": {
            "type": "base64",
            "media_type": "image/jpeg",
            "data": "/9j/4AAQSkZJRg...",
          }
        }
      ]
    }
  ]
}
```

</section>
<section title="空工具结果示例">

```json JSON
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
    }
  ]
}
```

</section>

<section title="带有文档的工具结果示例">

```json JSON
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": [
        {"type": "text", "text": "The weather is"},
        {
          "type": "document",
          "source": {
            "type": "text",
            "media_type": "text/plain",
            "data": "15 degrees"
          }
        }
      ]
    }
  ]
}
```

</section>

收到工具结果后，Claude 将使用该信息继续生成对原始用户提示的响应。

### 处理来自服务器工具的结果

Claude 在内部执行工具并将结果直接合并到其响应中，无需额外的用户交互。

<Tip>
  **与其他 API 的差异**

与分离工具使用或使用特殊角色（如 `tool` 或 `function`）的 API 不同，Claude API 将工具直接集成到 `user` 和 `assistant` 消息结构中。

消息包含 `text`、`image`、`tool_use` 和 `tool_result` 块的数组。`user` 消息包括客户端内容和 `tool_result`，而 `assistant` 消息包含 AI 生成的内容和 `tool_use`。

</Tip>

### 处理 `max_tokens` 停止原因

如果 Claude 的[响应因达到 `max_tokens` 限制而被截断](/docs/zh-CN/build-with-claude/handling-stop-reasons#max-tokens)，并且截断的响应包含不完整的工具使用块，您需要使用更高的 `max_tokens` 值重试请求以获得完整的工具使用。

<CodeGroup>
```python Python
# Check if response was truncated during tool use
if response.stop_reason == "max_tokens":
    # Check if the last content block is an incomplete tool_use
    last_block = response.content[-1]
    if last_block.type == "tool_use":
        # Send the request with higher max_tokens
        response = client.messages.create(
            model="claude-sonnet-4-5",
            max_tokens=4096,  # Increased limit
            messages=messages,
            tools=tools
        )
```

```typescript TypeScript
// Check if response was truncated during tool use
if (response.stop_reason === "max_tokens") {
  // Check if the last content block is an incomplete tool_use
  const lastBlock = response.content[response.content.length - 1];
  if (lastBlock.type === "tool_use") {
    // Send the request with higher max_tokens
    response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 4096, // Increased limit
      messages: messages,
      tools: tools
    });
  }
}
```
</CodeGroup>

#### 处理 `pause_turn` 停止原因

使用 Web Search 等服务器工具时，API 可能会返回 `pause_turn` 停止原因，表示 API 已暂停长时间运行的轮次。

以下是如何处理 `pause_turn` 停止原因的方法：

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# Initial request with web search
response = client.messages.create(
    model="claude-3-7-sonnet-latest",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": "Search for comprehensive information about quantum computing breakthroughs in 2025"
        }
    ],
    tools=[{
        "type": "web_search_20250305",
        "name": "web_search",
        "max_uses": 10
    }]
)

# Check if the response has pause_turn stop reason
if response.stop_reason == "pause_turn":
    # Continue the conversation with the paused content
    messages = [
        {"role": "user", "content": "Search for comprehensive information about quantum computing breakthroughs in 2025"},
        {"role": "assistant", "content": response.content}
    ]

    # Send the continuation request
    continuation = client.messages.create(
        model="claude-3-7-sonnet-latest",
        max_tokens=1024,
        messages=messages,
        tools=[{
            "type": "web_search_20250305",
            "name": "web_search",
            "max_uses": 10
        }]
    )

    print(continuation)
else:
    print(response)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

// Initial request with web search
const response = await anthropic.messages.create({
  model: "claude-3-7-sonnet-latest",
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: "Search for comprehensive information about quantum computing breakthroughs in 2025"
    }
  ],
  tools: [{
    type: "web_search_20250305",
    name: "web_search",
    max_uses: 10
  }]
});

// Check if the response has pause_turn stop reason
if (response.stop_reason === "pause_turn") {
  // Continue the conversation with the paused content
  const messages = [
    { role: "user", content: "Search for comprehensive information about quantum computing breakthroughs in 2025" },
    { role: "assistant", content: response.content }
  ];

  // Send the continuation request
  const continuation = await anthropic.messages.create({
    model: "claude-3-7-sonnet-latest",
    max_tokens: 1024,
    messages: messages,
    tools: [{
      type: "web_search_20250305",
      name: "web_search",
      max_uses: 10
    }]
  });

  console.log(continuation);
} else {
  console.log(response);
}
```
</CodeGroup>

处理 `pause_turn` 时：
- **继续对话**：在后续请求中按原样传回暂停的响应，让 Claude 继续其轮次
- **根据需要修改**：如果您想中断或重定向对话，可以选择在继续之前修改内容
- **保留工具状态**：在继续请求中包含相同的工具以维持功能

## 故障排除错误

<Note>
**内置错误处理**：[工具运行器](#tool-runner-beta)为大多数常见场景提供自动错误处理。本部分涵盖高级用例的手动错误处理。
</Note>

使用 Claude 的工具时可能会发生几种不同类型的错误：

<section title="工具执行错误">

如果工具本身在执行期间抛出错误（例如获取天气数据时的网络错误），您可以在 `content` 中返回错误消息以及 `"is_error": true`：

```json JSON
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "ConnectionError: the weather service API is not available (HTTP 500)",
      "is_error": true
    }
  ]
}
```

Claude 随后会将此错误合并到其对用户的响应中，例如"抱歉，我无法检索当前天气，因为天气服务 API 不可用。请稍后重试。"

</section>
<section title="无效的工具名称">

如果 Claude 尝试使用的工具无效（例如缺少必需参数），通常意味着 Claude 没有足够的信息来正确使用该工具。在开发期间，最好的办法是使用更详细的工具定义中的 `description` 值再次尝试请求。

但是，您也可以继续使用 `tool_result` 来推进对话，该结果指示错误，Claude 将尝试使用填入缺失信息的工具再次使用：

```json JSON
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Error: Missing required 'location' parameter",
      "is_error": true
    }
  ]
}
```

如果工具请求无效或缺少参数，Claude 将在向用户道歉之前重试 2-3 次进行更正。

<Tip>
要完全消除无效的工具调用，请在工具定义上使用 `strict: true` 的[严格工具使用](/docs/zh-CN/build-with-claude/structured-outputs)。这保证工具输入将始终完全匹配您的架构，防止缺少参数和类型不匹配。
</Tip>

</section>
<section title="\<search_quality_reflection\> 标签">

要防止 Claude 使用 \<search_quality_reflection\> 标签反思搜索质量，请将"不要在您的响应中反思返回的搜索结果的质量"添加到您的提示中。

</section>
<section title="服务器工具错误">

当服务器工具遇到错误（例如 Web Search 的网络问题）时，Claude 将透明地处理这些错误并尝试向用户提供替代响应或解释。与客户端工具不同，您不需要为服务器工具处理 `is_error` 结果。

对于 Web Search，可能的错误代码包括：
- `too_many_requests`：超过速率限制
- `invalid_input`：无效的搜索查询参数
- `max_uses_exceeded`：超过最大 Web Search 工具使用次数
- `query_too_long`：查询超过最大长度
- `unavailable`：发生内部错误

</section>
<section title="并行工具调用不起作用">

如果 Claude 在预期时不进行并行工具调用，请检查这些常见问题：

**1. 不正确的工具结果格式**

最常见的问题是在对话历史中不正确地格式化工具结果。这会"教导" Claude 避免并行调用。

特别是对于并行工具使用：
- ❌ **错误**：为每个工具结果发送单独的用户消息
- ✅ **正确**：所有工具结果必须在单个用户消息中

```json
// ❌ This reduces parallel tool use
[
  {"role": "assistant", "content": [tool_use_1, tool_use_2]},
  {"role": "user", "content": [tool_result_1]},
  {"role": "user", "content": [tool_result_2]}  // Separate message
]

// ✅ This maintains parallel tool use
[
  {"role": "assistant", "content": [tool_use_1, tool_use_2]},
  {"role": "user", "content": [tool_result_1, tool_result_2]}  // Single message
]
```

有关其他格式规则，请参阅上面的[一般格式要求](#handling-tool-use-and-tool-result-content-blocks)。

**2. 弱提示**

默认提示可能不够。使用更强的语言：

```text
<use_parallel_tool_calls>
For maximum efficiency, whenever you perform multiple independent operations,
invoke all relevant tools simultaneously rather than sequentially.
Prioritize calling tools in parallel whenever possible.
</use_parallel_tool_calls>
```

**3. 测量并行工具使用**

要验证并行工具调用是否正常工作：

```python
# Calculate average tools per tool-calling message
tool_call_messages = [msg for msg in messages if any(
    block.type == "tool_use" for block in msg.content
)]
total_tool_calls = sum(
    len([b for b in msg.content if b.type == "tool_use"])
    for msg in tool_call_messages
)
avg_tools_per_message = total_tool_calls / len(tool_call_messages)
print(f"Average tools per message: {avg_tools_per_message}")
# Should be > 1.0 if parallel calls are working
```

**4. 特定于模型的行为**

- Claude Opus 4.5、Opus 4.1 和 Sonnet 4：在最少提示的情况下擅长并行工具使用
- Claude Sonnet 3.7：可能需要更强的提示或 `token-efficient-tools-2025-02-19` [beta 标头](/docs/zh-CN/api/beta-headers)。考虑[升级到 Claude 4](/docs/zh-CN/about-claude/models/migrating-to-claude-4)。
- Claude Haiku：在没有明确提示的情况下不太可能使用并行工具

</section>