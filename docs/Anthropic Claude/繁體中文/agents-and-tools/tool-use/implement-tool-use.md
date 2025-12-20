# 如何實現工具使用

學習如何在 Claude API 中定義和使用工具，包括工具定義、最佳實踐和工具執行器的實現。

---

## 選擇模型

我們建議對複雜工具和模糊查詢使用最新的 Claude Sonnet (4.5) 或 Claude Opus (4.1) 模型；它們能更好地處理多個工具並在需要時尋求澄清。

對於直接的工具使用 Claude Haiku 模型，但請注意它們可能會推斷缺失的參數。

<Tip>
如果使用 Claude 進行工具使用和擴展思考，請參考我們的指南 [此處](/docs/zh-TW/build-with-claude/extended-thinking) 以獲取更多信息。
</Tip>

## 指定客戶端工具

客戶端工具（包括 Anthropic 定義的和用戶定義的）在 API 請求的 `tools` 頂級參數中指定。每個工具定義包括：

| Parameter      | Description                                                                                         |
| :------------- | :-------------------------------------------------------------------------------------------------- |
| `name`         | 工具的名稱。必須符合正則表達式 `^[a-zA-Z0-9_-]{1,64}$`。                                 |
| `description`  | 工具功能、何時應使用以及其行為方式的詳細純文本描述。 |
| `input_schema` | 定義工具預期參數的 [JSON Schema](https://json-schema.org/) 對象。     |
| `input_examples` | （可選，測試版）示例輸入對象的數組，幫助 Claude 理解如何使用工具。請參閱 [提供工具使用示例](#providing-tool-use-examples)。 |

<section title="簡單工具定義示例">

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

此工具名為 `get_weather`，期望一個輸入對象，其中包含必需的 `location` 字符串和可選的 `unit` 字符串，該字符串必須是 "celsius" 或 "fahrenheit"。

</section>

### 工具使用系統提示

當您使用 `tools` 參數調用 Claude API 時，我們從工具定義、工具配置和任何用戶指定的系統提示構建一個特殊的系統提示。構建的提示旨在指示模型使用指定的工具並為工具的正常運行提供必要的上下文：

```
In this environment you have access to a set of tools you can use to answer the user's question.
{{ FORMATTING INSTRUCTIONS }}
String and scalar parameters should be specified as is, while lists and objects should use JSON format. Note that spaces for string values are not stripped. The output is not expected to be valid XML and is parsed with regular expressions.
Here are the functions available in JSONSchema format:
{{ TOOL DEFINITIONS IN JSON SCHEMA }}
{{ USER SYSTEM PROMPT }}
{{ TOOL CONFIGURATION }}
```

### 工具定義的最佳實踐

為了從使用工具的 Claude 中獲得最佳性能，請遵循以下指南：

- **提供極其詳細的描述。** 這是迄今為止影響工具性能的最重要因素。您的描述應解釋有關工具的每個細節，包括：
  - 工具的功能
  - 何時應使用它（以及何時不應使用）
  - 每個參數的含義以及它如何影響工具的行為
  - 任何重要的注意事項或限制，例如工具不返回的信息（如果工具名稱不清楚）。您能為 Claude 提供的關於工具的上下文越多，它在決定何時以及如何使用它們時就會越好。每個工具描述至少應有 3-4 句話，如果工具複雜則更多。
- **優先考慮描述，但對於複雜工具可考慮使用 `input_examples`。** 清晰的描述最重要，但對於具有複雜輸入、嵌套對象或格式敏感參數的工具，您可以使用 `input_examples` 字段（測試版）提供經過模式驗證的示例。有關詳細信息，請參閱 [提供工具使用示例](#providing-tool-use-examples)。

<section title="良好工具描述示例">

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

<section title="工具描述不佳示例">

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

良好的描述清楚地解釋了工具的功能、何時使用、返回的數據以及 `ticker` 參數的含義。不佳的描述過於簡潔，讓 Claude 對工具的行為和使用方式有許多疑問。

## 提供工具使用示例

您可以提供具體的有效工具輸入示例，幫助 Claude 更有效地理解如何使用您的工具。這對於具有嵌套對象、可選參數或格式敏感輸入的複雜工具特別有用。

<Info>
工具使用示例是一項測試版功能。為您的提供商包含適當的 [測試版標頭](/docs/zh-TW/api/beta-headers)：

| Provider | Beta header | Supported models |
|----------|-------------|------------------|
| Claude API,<br/>Microsoft Foundry | `advanced-tool-use-2025-11-20` | All models |
| Vertex AI,<br/>Amazon Bedrock | `tool-examples-2025-10-29` | Claude Opus 4.5 only |
</Info>

### 基本用法

將可選的 `input_examples` 字段添加到您的工具定義中，其中包含示例輸入對象的數組。每個示例必須根據工具的 `input_schema` 有效：

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

示例包含在提示中，與您的工具模式一起，向 Claude 展示格式良好的工具調用的具體模式。這幫助 Claude 理解何時包含可選參數、使用什麼格式以及如何構建複雜輸入。

### 要求和限制

- **模式驗證** - 每個示例必須根據工具的 `input_schema` 有效。無效示例返回 400 錯誤
- **不支持服務器端工具** - 只有用戶定義的工具可以有輸入示例
- **令牌成本** - 示例增加提示令牌：簡單示例約 20-50 個令牌，複雜嵌套對象約 100-200 個令牌

## 工具執行器（測試版）

工具執行器為使用 Claude 執行工具提供了開箱即用的解決方案。工具執行器不是手動處理工具調用、工具結果和對話管理，而是自動：

- 在 Claude 調用工具時執行工具
- 處理請求/響應週期
- 管理對話狀態
- 提供類型安全和驗證

我們建議您對大多數工具使用實現使用工具執行器。

<Note>
工具執行器目前處於測試版，可在 [Python](https://github.com/anthropics/anthropic-sdk-python/blob/main/tools.md)、[TypeScript](https://github.com/anthropics/anthropic-sdk-typescript/blob/main/helpers.md#tool-helpers) 和 [Ruby](https://github.com/anthropics/anthropic-sdk-ruby/blob/main/helpers.md#3-auto-looping-tool-runner-beta) SDK 中使用。
</Note>

<Tip>
**使用壓縮的自動上下文管理**

工具執行器支持自動 [壓縮](/docs/zh-TW/build-with-claude/context-editing#client-side-compaction-sdk)，當令牌使用超過閾值時生成摘要。這允許長時間運行的代理任務超越上下文窗口限制。
</Tip>

<Tabs>
<Tab title="Python">

### 基本用法

使用 `@beta_tool` 裝飾器定義工具，使用 `client.beta.messages.tool_runner()` 執行它們。

<Note>
如果您使用異步客戶端，請將 `@beta_tool` 替換為 `@beta_async_tool` 並使用 `async def` 定義函數。
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

被裝飾的函數必須返回內容塊或內容塊數組，包括文本、圖像或文檔塊。這允許工具返回豐富的多模態響應。返回的字符串將被轉換為文本內容塊。
如果您想向 Claude 返回結構化的 JSON 對象，請在返回前將其編碼為 JSON 字符串。數字、布爾值或其他非字符串原始類型也必須轉換為字符串。

`@beta_tool` 裝飾器將檢查函數參數和文檔字符串，以提取給定函數的 json 模式表示。在上面的示例中，`calculate_sum` 將被轉換為：

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

### 遍歷工具執行器

由 `tool_runner()` 返回的工具執行器是可迭代的，您可以使用 `for` 循環進行迭代。這通常稱為"工具調用循環"。
每個循環迭代都產生由 Claude 返回的消息。

在您的代碼有機會在循環內處理當前消息後，工具執行器將檢查消息以查看 Claude 是否請求了工具使用。如果是，它將調用工具並自動將工具結果發送回 Claude，然後產生來自 Claude 的下一條消息以開始循環的下一次迭代。

您可以在任何迭代處使用簡單的 `break` 語句結束循環。工具執行器將循環直到 Claude 返回不包含工具使用的消息。

如果您不關心中間消息，您可以調用 `until_done()` 方法而不是使用循環，該方法將返回來自 Claude 的最終消息：

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

### 高級用法

在循環內，您可以完全自定義工具執行器對消息 API 的下一個請求。
方法 `runner.generate_tool_call_response()` 將調用工具（如果 Claude 觸發了工具使用）並讓您訪問將發送回消息 API 的工具結果。
方法 `runner.set_messages_params()` 和 `runner.append_messages()` 允許您修改下一個消息 API 請求的參數。

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

### 流式傳輸

啟用 `stream=True` 流式傳輸時，工具執行器發出的每個值都是從 `anthropic.messages.stream()` 返回的 `BetaMessageStream`。`BetaMessageStream` 本身是一個可迭代的，產生來自消息 API 的流式事件。

您可以使用 `message_stream.get_final_message()` 讓 SDK 為您完成流式事件到最終消息的累積。

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

使用 `betaZodTool()` 進行類型安全的工具定義，具有 Zod 驗證（需要 Zod 3.25.0 或更高版本）。

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

`run` 函數必須返回內容塊或內容塊數組，包括文本、圖像或文檔塊。這允許工具返回豐富的多模態響應。返回的字符串將被轉換為文本內容塊。
如果您想向 Claude 返回結構化的 JSON 對象，請在返回前將其字符串化為 JSON 字符串。數字、布爾值或其他非字符串原始類型也必須轉換為字符串。

### 遍歷工具執行器

由 `toolRunner()` 返回的工具執行器是異步可迭代的，您可以使用 `for await ... of` 循環進行迭代。這通常稱為"工具調用循環"。
每個循環迭代都產生由 Claude 返回的消息。

在您的代碼有機會在循環內處理當前消息後，工具執行器將檢查消息以查看 Claude 是否請求了工具使用。如果是，它將調用工具並自動將工具結果發送回 Claude，然後產生來自 Claude 的下一條消息以開始循環的下一次迭代。

您可以在任何迭代處使用簡單的 `break` 語句結束循環。工具執行器將循環直到 Claude 返回不包含工具使用的消息。

如果您不關心中間消息，您可以簡單地 `await` 工具執行器，它將返回來自 Claude 的最終消息。

### 高級用法

在循環內，您可以完全自定義工具執行器對消息 API 的下一個請求。
方法 `runner.generateToolResponse()` 將調用工具（如果 Claude 觸發了工具使用）並讓您訪問將發送回消息 API 的工具結果。
方法 `runner.setMessagesParams()` 和 `runner.pushMessages()` 允許您修改下一個消息 API 請求的參數。當前參數可在 `runner.params` 下獲得。

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

### 流式傳輸

啟用 `stream: true` 流式傳輸時，工具執行器發出的每個值都是從 `anthropic.messages.stream()` 返回的 `MessageStream`。`MessageStream` 本身是一個異步可迭代的，產生來自消息 API 的流式事件。

您可以使用 `messageStream.finalMessage()` 讓 SDK 為您完成流式事件到最終消息的累積。

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

使用 `betaTool()` 進行基於 JSON 模式的類型安全工具定義。TypeScript 和您的編輯器將意識到 `input` 參數的類型以進行自動完成。

<Note>
Claude 生成的輸入在運行時不會被驗證。如果需要，請在 `run` 函數內執行驗證。
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

`run` 函數必須返回任何內容塊或內容塊數組，包括文本、圖像或文檔塊。這允許工具返回豐富的多模態響應。返回的字符串將被轉換為文本內容塊。
如果您想向 Claude 返回結構化的 JSON 對象，請在返回前將其編碼為 JSON 字符串。數字、布爾值或其他非字符串原始類型也必須轉換為字符串。

### 遍歷工具執行器

由 `toolRunner()` 返回的工具執行器是異步可迭代的，您可以使用 `for await ... of` 循環進行迭代。這通常稱為"工具調用循環"。
每個循環迭代都產生由 Claude 返回的消息。

在您的代碼有機會在循環內處理當前消息後，工具執行器將檢查消息以查看 Claude 是否請求了工具使用。如果是，它將調用工具並自動將工具結果發送回 Claude，然後產生來自 Claude 的下一條消息以開始循環的下一次迭代。

您可以在任何迭代處使用簡單的 `break` 語句結束循環。工具執行器將循環直到 Claude 返回不包含工具使用的消息。

如果您不關心中間消息，您可以簡單地 `await` 工具執行器，它將返回來自 Claude 的最終消息。

### 高級用法

在循環內，您可以完全自定義工具執行器對消息 API 的下一個請求。
方法 `runner.generateToolResponse()` 將調用工具（如果 Claude 觸發了工具使用）並讓您訪問將發送回消息 API 的工具結果。
方法 `runner.setMessagesParams()` 和 `runner.pushMessages()` 允許您修改下一個消息 API 請求的參數。當前參數可在 `runner.params` 下獲得。

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

### 流式傳輸

啟用 `stream: true` 流式傳輸時，工具執行器發出的每個值都是從 `anthropic.messages.stream()` 返回的 `MessageStream`。`MessageStream` 本身是一個異步可迭代的，產生來自消息 API 的流式事件。

您可以使用 `messageStream.finalMessage()` 讓 SDK 為您完成流式事件到最終消息的累積。

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

使用 `Anthropic::BaseTool` 和輸入模式定義工具，然後使用 `client.beta.messages.tool_runner` 執行它們。

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

`call` 方法必須返回字符串或內容塊數組。如果您想向 Claude 返回結構化的 JSON 對象，請在返回前將其編碼為 JSON 字符串。

`Anthropic::BaseTool` 類使用 `doc` 方法作為工具描述，使用 `input_schema` 定義預期參數。SDK 將自動將其轉換為適當的 JSON 模式格式。

### 遍歷工具執行器

工具執行器提供了一個 `each_message` 方法，在對話進行時產生每條消息。這通常稱為"工具調用循環"。

在您的代碼有機會處理當前消息後，工具執行器將檢查 Claude 是否請求了工具使用。如果是，它將調用工具並自動將工具結果發送回 Claude，然後產生下一條消息。

如果您不關心中間消息，您可以使用 `run_until_finished` 方法一次性獲取所有消息：

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

### 高級用法

工具執行器提供了多種方法來自定義行為：

- `#next_message` - 手動逐個步進對話
- `#feed_messages` - 在對話中途注入額外消息
- `#params` - 訪問或修改當前請求參數

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

### 流式傳輸

使用流式傳輸時，使用 `each_streaming` 進行迭代以接收實時事件：

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
SDK 工具執行器處於測試版。本文檔的其餘部分涵蓋手動工具實現。
</Note>

## 控制 Claude 的輸出

### 強制工具使用

在某些情況下，您可能希望 Claude 使用特定工具來回答用戶的問題，即使 Claude 認為它可以在不使用工具的情況下提供答案。您可以通過在 `tool_choice` 字段中指定工具來執行此操作，如下所示：

```
tool_choice = {"type": "tool", "name": "get_weather"}
```

使用 tool_choice 參數時，我們有四個可能的選項：

- `auto` 允許 Claude 決定是否調用任何提供的工具。這是提供 `tools` 時的默認值。
- `any` 告訴 Claude 它必須使用提供的工具之一，但不強制特定工具。
- `tool` 允許我們強制 Claude 始終使用特定工具。
- `none` 防止 Claude 使用任何工具。這是未提供 `tools` 時的默認值。

<Note>
使用 [提示緩存](/docs/zh-TW/build-with-claude/prompt-caching#what-invalidates-the-cache) 時，對 `tool_choice` 參數的更改將使緩存的消息塊失效。工具定義和系統提示保持緩存，但消息內容必須重新處理。
</Note>

此圖表說明了每個選項的工作方式：

<Frame>
  ![Image](/docs/images/tool_choice.png)
</Frame>

請注意，當您有 `tool_choice` 為 `any` 或 `tool` 時，我們將預填充助手消息以強制使用工具。這意味著模型不會在 `tool_use` 內容塊之前發出自然語言響應或解釋，即使被明確要求這樣做。

<Note>
使用 [擴展思考](/docs/zh-TW/build-with-claude/extended-thinking) 和工具使用時，不支持 `tool_choice: {"type": "any"}` 和 `tool_choice: {"type": "tool", "name": "..."}` 並將導致錯誤。只有 `tool_choice: {"type": "auto"}` （默認）和 `tool_choice: {"type": "none"}` 與擴展思考兼容。
</Note>

我們的測試表明這不應該降低性能。如果您希望模型在仍然請求模型使用特定工具的同時提供自然語言上下文或解釋，您可以對 `tool_choice` 使用 `{"type": "auto"}` （默認）並在 `user` 消息中添加明確的說明。例如：`What's the weather like in London? Use the get_weather tool in your response.`

<Tip>
**使用嚴格工具保證工具調用**

將 `tool_choice: {"type": "any"}` 與 [嚴格工具使用](/docs/zh-TW/build-with-claude/structured-outputs) 結合，以保證您的工具之一將被調用 AND 工具輸入嚴格遵循您的模式。在您的工具定義上設置 `strict: true` 以啟用模式驗證。
</Tip>

### JSON 輸出

工具不一定需要是客戶端函數 — 您可以在任何時候想要模型返回遵循提供的模式的 JSON 輸出時使用工具。例如，您可能使用具有特定模式的 `record_summary` 工具。有關完整的工作示例，請參閱 [使用 Claude 的工具使用](/docs/zh-TW/agents-and-tools/tool-use/overview)。

### 使用工具的模型回應

使用工具時，Claude 通常會在調用工具之前評論它正在做什麼或自然地回應用戶。

例如，給定提示「舊金山現在的天氣如何，那裡現在幾點？」，Claude 可能會回應：

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

這種自然的回應風格幫助用戶理解 Claude 正在做什麼，並創造更具對話性的互動。您可以通過系統提示和在提示中提供 `<examples>` 來指導這些回應的風格和內容。

重要的是要注意，Claude 在解釋其操作時可能會使用各種措辭和方法。您的代碼應該像對待任何其他助手生成的文本一樣對待這些回應，而不是依賴特定的格式約定。

### 並行工具使用

默認情況下，Claude 可能會使用多個工具來回答用戶查詢。您可以通過以下方式禁用此行為：

- 當 tool_choice 類型為 `auto` 時設置 `disable_parallel_tool_use=true`，這確保 Claude 最多使用**一個**工具
- 當 tool_choice 類型為 `any` 或 `tool` 時設置 `disable_parallel_tool_use=true`，這確保 Claude 恰好使用**一個**工具

<section title="完整的並行工具使用示例">

<Note>
**使用工具運行器更簡單**：下面的示例展示了手動並行工具處理。對於大多數用例，[工具運行器](#tool-runner-beta)會自動處理並行工具執行，代碼少得多。
</Note>

以下是一個完整示例，展示如何在消息歷史中正確格式化並行工具調用：

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

具有並行工具調用的助手消息如下所示：

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
<section title="並行工具的完整測試腳本">

以下是一個完整的、可運行的腳本，用於測試和驗證並行工具調用是否正常工作：

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

此腳本演示了：
- 如何正確格式化並行工具調用和結果
- 如何驗證正在進行並行調用
- 鼓勵未來並行工具使用的正確消息結構
- 要避免的常見錯誤（例如工具結果前的文本）

運行此腳本以測試您的實現，並確保 Claude 正在有效地進行並行工具調用。

</section>

#### 最大化並行工具使用

雖然 Claude 4 模型默認具有出色的並行工具使用功能，但您可以通過有針對性的提示在所有模型中增加並行工具執行的可能性：

<section title="並行工具使用的系統提示">

對於 Claude 4 模型（Opus 4 和 Sonnet 4），將此添加到您的系統提示：
```text
For maximum efficiency, whenever you need to perform multiple independent operations, invoke all relevant tools simultaneously rather than sequentially.
```

為了獲得更強的並行工具使用（如果默認值不夠，建議使用），請使用：
```text
<use_parallel_tool_calls>
For maximum efficiency, whenever you perform multiple independent operations, invoke all relevant tools simultaneously rather than sequentially. Prioritize calling tools in parallel whenever possible. For example, when reading 3 files, run 3 tool calls in parallel to read all 3 files into context at the same time. When running multiple read-only commands like `ls` or `list_dir`, always run all of the commands in parallel. Err on the side of maximizing parallel tool calls rather than running too many tools sequentially.
</use_parallel_tool_calls>
```

</section>
<section title="用戶消息提示">

您也可以在特定用戶消息中鼓勵並行工具使用：

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
**Claude Sonnet 3.7 的並行工具使用**

Claude Sonnet 3.7 可能不太可能在響應中進行並行工具調用，即使您未設置 `disable_parallel_tool_use`。我們建議[升級到 Claude 4 模型](/docs/zh-TW/about-claude/models/migrating-to-claude-4)，它們具有內置的令牌高效工具使用和改進的並行工具調用。

如果您仍在使用 Claude Sonnet 3.7，您可以啟用 `token-efficient-tools-2025-02-19` [beta 標頭](/docs/zh-TW/api/beta-headers)，這有助於鼓勵 Claude 使用並行工具。您也可以引入一個「批量工具」，它可以充當元工具來同時包裝對其他工具的調用。

有關如何使用此解決方法的信息，請參閱我們食譜中的[此示例](https://github.com/anthropics/anthropic-cookbook/blob/main/tool_use/parallel_tools_claude_3_7_sonnet.ipynb)。

</Warning>

## 處理工具使用和工具結果內容塊

<Note>
**使用工具運行器更簡單**：本部分中描述的手動工具處理由[工具運行器](#tool-runner-beta)自動管理。當您需要對工具執行進行自定義控制時，請使用本部分。
</Note>

Claude 的響應根據它使用的是客戶端工具還是服務器工具而有所不同。

### 處理來自客戶端工具的結果

響應將具有 `tool_use` 的 `stop_reason` 和一個或多個 `tool_use` 內容塊，其中包括：

- `id`：此特定工具使用塊的唯一標識符。這將用於稍後匹配工具結果。
- `name`：正在使用的工具的名稱。
- `input`：包含傳遞給工具的輸入的對象，符合工具的 `input_schema`。

<section title="帶有 `tool_use` 內容塊的示例 API 響應">

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

當您收到客戶端工具的工具使用響應時，您應該：

1. 從 `tool_use` 塊中提取 `name`、`id` 和 `input`。
2. 運行代碼庫中與該工具名稱對應的實際工具，傳入工具 `input`。
3. 通過發送一條新消息來繼續對話，其 `role` 為 `user`，`content` 塊包含 `tool_result` 類型和以下信息：
   - `tool_use_id`：這是結果所針對的工具使用請求的 `id`。
   - `content`：工具的結果，作為字符串（例如 `"content": "15 degrees"`）、嵌套內容塊的列表（例如 `"content": [{"type": "text", "text": "15 degrees"}]`）或文檔塊的列表（例如 `"content": ["type": "document", "source": {"type": "text", "media_type": "text/plain", "data": "15 degrees"}]`）。這些內容塊可以使用 `text`、`image` 或 `document` 類型。
   - `is_error`（可選）：如果工具執行導致錯誤，設置為 `true`。

<Note>
**重要的格式要求**：
- 工具結果塊必須緊跟在消息歷史中對應的工具使用塊之後。您不能在助手的工具使用消息和用戶的工具結果消息之間包含任何消息。
- 在包含工具結果的用戶消息中，tool_result 塊必須首先出現在內容數組中。任何文本必須在所有工具結果之後。

例如，這將導致 400 錯誤：
```json
{"role": "user", "content": [
  {"type": "text", "text": "Here are the results:"},  // ❌ Text before tool_result
  {"type": "tool_result", "tool_use_id": "toolu_01", ...}
]}
```

這是正確的：
```json
{"role": "user", "content": [
  {"type": "tool_result", "tool_use_id": "toolu_01", ...},
  {"type": "text", "text": "What should I do next?"}  // ✅ Text after tool_result
]}
```

如果您收到類似「tool_use ids were found without tool_result blocks immediately after」的錯誤，請檢查您的工具結果格式是否正確。
</Note>

<section title="成功的工具結果示例">

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

<section title="帶有圖像的工具結果示例">

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
<section title="空工具結果示例">

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

<section title="帶有文檔的工具結果示例">

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

收到工具結果後，Claude 將使用該信息繼續生成對原始用戶提示的響應。

### 處理來自服務器工具的結果

Claude 在內部執行工具並將結果直接合併到其響應中，無需額外的用戶交互。

<Tip>
  **與其他 API 的區別**

與分離工具使用或使用特殊角色（如 `tool` 或 `function`）的 API 不同，Claude API 將工具直接集成到 `user` 和 `assistant` 消息結構中。

消息包含 `text`、`image`、`tool_use` 和 `tool_result` 塊的數組。`user` 消息包括客戶端內容和 `tool_result`，而 `assistant` 消息包含 AI 生成的內容和 `tool_use`。

</Tip>

### 處理 `max_tokens` 停止原因

如果 Claude 的[響應因達到 `max_tokens` 限制而被截斷](/docs/zh-TW/build-with-claude/handling-stop-reasons#max-tokens)，並且截斷的響應包含不完整的工具使用塊，您需要使用更高的 `max_tokens` 值重試請求以獲得完整的工具使用。

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

#### 處理 `pause_turn` 停止原因

使用服務器工具（如網絡搜索）時，API 可能會返回 `pause_turn` 停止原因，表示 API 已暫停長時間運行的回合。

以下是如何處理 `pause_turn` 停止原因：

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

處理 `pause_turn` 時：
- **繼續對話**：將暫停的響應按原樣傳遞到後續請求中，讓 Claude 繼續其回合
- **根據需要修改**：如果您想中斷或重定向對話，您可以選擇在繼續之前修改內容
- **保留工具狀態**：在繼續請求中包含相同的工具以維持功能

## 故障排除錯誤

<Note>
**內置錯誤處理**：[工具運行器](#tool-runner-beta)為大多數常見場景提供自動錯誤處理。本部分涵蓋高級用例的手動錯誤處理。
</Note>

使用 Claude 的工具時可能會發生幾種不同類型的錯誤：

<section title="工具執行錯誤">

如果工具本身在執行期間拋出錯誤（例如，獲取天氣數據時的網絡錯誤），您可以在 `content` 中返回錯誤消息以及 `"is_error": true`：

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

Claude 隨後會將此錯誤合併到其對用戶的響應中，例如「抱歉，我無法檢索當前天氣，因為天氣服務 API 不可用。請稍後再試。」

</section>
<section title="無效的工具名稱">

如果 Claude 嘗試使用的工具無效（例如缺少必需參數），通常意味著 Claude 沒有足夠的信息來正確使用該工具。在開發期間，最好的辦法是使用工具定義中更詳細的 `description` 值重試請求。

但是，您也可以使用指示錯誤的 `tool_result` 繼續對話，Claude 將嘗試使用該工具，並填入缺失的信息：

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

如果工具請求無效或缺少參數，Claude 將在向用戶道歉之前重試 2-3 次進行更正。

<Tip>
要完全消除無效的工具調用，請在工具定義上使用 [strict tool use](/docs/zh-TW/build-with-claude/structured-outputs)，其中 `strict: true`。這保證工具輸入將始終完全匹配您的架構，防止缺少參數和類型不匹配。
</Tip>

</section>
<section title="\<search_quality_reflection> 標籤">

要防止 Claude 使用 \<search_quality_reflection> 標籤反思搜索質量，請在您的提示中添加「Do not reflect on the quality of the returned search results in your response」。

</section>
<section title="服務器工具錯誤">

當服務器工具遇到錯誤時（例如，Web 搜索的網絡問題），Claude 將透明地處理這些錯誤並嘗試向用戶提供替代響應或解釋。與客戶端工具不同，您不需要為服務器工具處理 `is_error` 結果。

對於網絡搜索，可能的錯誤代碼包括：
- `too_many_requests`：超過速率限制
- `invalid_input`：無效的搜索查詢參數
- `max_uses_exceeded`：超過最大網絡搜索工具使用次數
- `query_too_long`：查詢超過最大長度
- `unavailable`：發生內部錯誤

</section>
<section title="並行工具調用不起作用">

如果 Claude 在預期時沒有進行並行工具調用，請檢查這些常見問題：

**1. 不正確的工具結果格式**

最常見的問題是在對話歷史中不正確地格式化工具結果。這會「教導」Claude 避免並行調用。

特別是對於並行工具使用：
- ❌ **錯誤**：為每個工具結果發送單獨的用戶消息
- ✅ **正確**：所有工具結果必須在單個用戶消息中

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

有關其他格式規則，請參閱上面的[一般格式要求](#handling-tool-use-and-tool-result-content-blocks)。

**2. 弱提示**

默認提示可能不夠。使用更強的語言：

```text
<use_parallel_tool_calls>
For maximum efficiency, whenever you perform multiple independent operations,
invoke all relevant tools simultaneously rather than sequentially.
Prioritize calling tools in parallel whenever possible.
</use_parallel_tool_calls>
```

**3. 測量並行工具使用**

要驗證並行工具調用是否正常工作：

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

**4. 模型特定行為**

- Claude Opus 4.5、Opus 4.1 和 Sonnet 4：在最少提示的情況下擅長並行工具使用
- Claude Sonnet 3.7：可能需要更強的提示或 `token-efficient-tools-2025-02-19` [beta 標頭](/docs/zh-TW/api/beta-headers)。考慮[升級到 Claude 4](/docs/zh-TW/about-claude/models/migrating-to-claude-4)。
- Claude Haiku：在沒有明確提示的情況下不太可能使用並行工具

</section>