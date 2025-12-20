# 도구 사용을 구현하는 방법

Claude와 함께 도구 사용을 구현하기 위한 가이드

---

## 모델 선택

복잡한 도구와 모호한 쿼리의 경우 최신 Claude Sonnet (4.5) 또는 Claude Opus (4.1) 모델을 사용하는 것을 권장합니다. 이들은 여러 도구를 더 잘 처리하고 필요할 때 명확히 해달라고 요청합니다.

간단한 도구의 경우 Claude Haiku 모델을 사용하되, 누락된 매개변수를 추론할 수 있다는 점에 유의하세요.

<Tip>
Claude를 도구 사용 및 확장된 사고와 함께 사용하는 경우, 자세한 내용은 [여기](/docs/ko/build-with-claude/extended-thinking)의 가이드를 참조하세요.
</Tip>

## 클라이언트 도구 지정

클라이언트 도구(Anthropic 정의 도구 및 사용자 정의 도구 모두)는 API 요청의 `tools` 최상위 매개변수에서 지정됩니다. 각 도구 정의에는 다음이 포함됩니다:

| 매개변수      | 설명                                                                                         |
| :------------- | :-------------------------------------------------------------------------------------------------- |
| `name`         | 도구의 이름입니다. 정규식 `^[a-zA-Z0-9_-]{1,64}$`와 일치해야 합니다.                                 |
| `description`  | 도구가 무엇을 하는지, 언제 사용해야 하는지, 어떻게 작동하는지에 대한 자세한 일반 텍스트 설명입니다. |
| `input_schema` | 도구의 예상 매개변수를 정의하는 [JSON Schema](https://json-schema.org/) 객체입니다.     |
| `input_examples` | (선택사항, 베타) Claude가 도구를 사용하는 방법을 이해하도록 돕기 위한 예제 입력 객체의 배열입니다. [도구 사용 예제 제공](#providing-tool-use-examples)을 참조하세요. |

<section title="간단한 도구 정의 예제">

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

이 도구는 `get_weather`라는 이름으로, 필수 `location` 문자열과 "celsius" 또는 "fahrenheit" 중 하나여야 하는 선택적 `unit` 문자열을 포함하는 입력 객체를 예상합니다.

</section>

### 도구 사용 시스템 프롬프트

`tools` 매개변수를 사용하여 Claude API를 호출하면, 도구 정의, 도구 구성 및 사용자가 지정한 시스템 프롬프트에서 특수 시스템 프롬프트를 구성합니다. 구성된 프롬프트는 모델에 지정된 도구를 사용하도록 지시하고 도구가 제대로 작동하기 위한 필요한 컨텍스트를 제공하도록 설계되었습니다:

```
In this environment you have access to a set of tools you can use to answer the user's question.
{{ FORMATTING INSTRUCTIONS }}
String and scalar parameters should be specified as is, while lists and objects should use JSON format. Note that spaces for string values are not stripped. The output is not expected to be valid XML and is parsed with regular expressions.
Here are the functions available in JSONSchema format:
{{ TOOL DEFINITIONS IN JSON SCHEMA }}
{{ USER SYSTEM PROMPT }}
{{ TOOL CONFIGURATION }}
```

### 도구 정의의 모범 사례

Claude를 도구와 함께 사용할 때 최고의 성능을 얻으려면 다음 지침을 따르세요:

- **매우 자세한 설명을 제공하세요.** 이것이 도구 성능에 가장 중요한 요소입니다. 설명에는 다음을 포함하여 도구에 대한 모든 세부 사항을 설명해야 합니다:
  - 도구가 무엇을 하는지
  - 언제 사용해야 하는지(그리고 언제 사용하면 안 되는지)
  - 각 매개변수가 무엇을 의미하는지 및 도구의 동작에 어떻게 영향을 미치는지
  - 도구 이름이 불명확한 경우 도구가 반환하지 않는 정보와 같은 중요한 주의사항 또는 제한사항입니다. Claude에게 도구에 대해 제공할 수 있는 컨텍스트가 많을수록 도구를 언제 어떻게 사용할지 결정하는 데 더 잘할 것입니다. 도구 설명당 최소 3-4문장을 목표로 하고, 도구가 복잡한 경우 더 많이 작성하세요.
- **설명을 우선시하되, 복잡한 도구의 경우 `input_examples` 사용을 고려하세요.** 명확한 설명이 가장 중요하지만, 복잡한 입력, 중첩된 객체 또는 형식에 민감한 매개변수가 있는 도구의 경우, `input_examples` 필드(베타)를 사용하여 스키마 검증된 예제를 제공할 수 있습니다. 자세한 내용은 [도구 사용 예제 제공](#providing-tool-use-examples)을 참조하세요.

<section title="좋은 도구 설명의 예">

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

<section title="좋지 않은 도구 설명의 예">

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

좋은 설명은 도구가 무엇을 하는지, 언제 사용하는지, 어떤 데이터를 반환하는지, `ticker` 매개변수가 무엇을 의미하는지 명확하게 설명합니다. 좋지 않은 설명은 너무 간단하고 Claude에게 도구의 동작과 사용법에 대해 많은 미해결 질문을 남깁니다.

## 도구 사용 예제 제공

Claude가 도구를 더 효과적으로 사용하는 방법을 이해하도록 돕기 위해 유효한 도구 입력의 구체적인 예제를 제공할 수 있습니다. 이는 중첩된 객체, 선택적 매개변수 또는 형식에 민감한 입력이 있는 복잡한 도구에 특히 유용합니다.

<Info>
도구 사용 예제는 베타 기능입니다. 제공자에 대한 적절한 [베타 헤더](/docs/ko/api/beta-headers)를 포함하세요:

| 제공자 | 베타 헤더 | 지원되는 모델 |
|----------|-------------|------------------|
| Claude API,<br/>Microsoft Foundry | `advanced-tool-use-2025-11-20` | 모든 모델 |
| Vertex AI,<br/>Amazon Bedrock | `tool-examples-2025-10-29` | Claude Opus 4.5만 |
</Info>

### 기본 사용법

도구 정의에 선택적 `input_examples` 필드를 추가하고 예제 입력 객체의 배열을 포함합니다. 각 예제는 도구의 `input_schema`에 따라 유효해야 합니다:

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

예제는 도구 스키마와 함께 프롬프트에 포함되어 Claude에게 잘 형성된 도구 호출의 구체적인 패턴을 보여줍니다. 이는 Claude가 선택적 매개변수를 포함할 시기, 어떤 형식을 사용할지, 복잡한 입력을 어떻게 구조화할지 이해하는 데 도움이 됩니다.

### 요구사항 및 제한사항

- **스키마 검증** - 각 예제는 도구의 `input_schema`에 따라 유효해야 합니다. 유효하지 않은 예제는 400 오류를 반환합니다
- **서버 측 도구에 대해 지원되지 않음** - 사용자 정의 도구만 입력 예제를 가질 수 있습니다
- **토큰 비용** - 예제는 프롬프트 토큰에 추가됩니다: 간단한 예제의 경우 약 20-50 토큰, 복잡한 중첩 객체의 경우 약 100-200 토큰

## 도구 실행기(베타)

도구 실행기는 Claude를 사용하여 도구를 실행하기 위한 기본 솔루션을 제공합니다. 도구 호출, 도구 결과 및 대화 관리를 수동으로 처리하는 대신, 도구 실행기는 자동으로:

- Claude가 호출할 때 도구를 실행합니다
- 요청/응답 주기를 처리합니다
- 대화 상태를 관리합니다
- 타입 안전성 및 검증을 제공합니다

대부분의 도구 사용 구현에 도구 실행기를 사용하는 것을 권장합니다.

<Note>
도구 실행기는 현재 베타 상태이며 [Python](https://github.com/anthropics/anthropic-sdk-python/blob/main/tools.md), [TypeScript](https://github.com/anthropics/anthropic-sdk-typescript/blob/main/helpers.md#tool-helpers) 및 [Ruby](https://github.com/anthropics/anthropic-sdk-ruby/blob/main/helpers.md#3-auto-looping-tool-runner-beta) SDK에서 사용 가능합니다.
</Note>

<Tip>
**압축을 통한 자동 컨텍스트 관리**

도구 실행기는 자동 [압축](/docs/ko/build-with-claude/context-editing#client-side-compaction-sdk)을 지원하며, 토큰 사용량이 임계값을 초과할 때 요약을 생성합니다. 이를 통해 장기 실행 에이전트 작업이 컨텍스트 윈도우 제한을 초과하여 계속될 수 있습니다.
</Tip>

<Tabs>
<Tab title="Python">

### 기본 사용법

`@beta_tool` 데코레이터를 사용하여 도구를 정의하고 `client.beta.messages.tool_runner()`를 사용하여 실행합니다.

<Note>
비동기 클라이언트를 사용하는 경우, `@beta_tool`을 `@beta_async_tool`로 바꾸고 함수를 `async def`로 정의하세요.
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

데코레이트된 함수는 텍스트, 이미지 또는 문서 블록을 포함한 콘텐츠 블록 또는 콘텐츠 블록 배열을 반환해야 합니다. 이를 통해 도구는 풍부한 다중 모달 응답을 반환할 수 있습니다. 반환된 문자열은 텍스트 콘텐츠 블록으로 변환됩니다.
Claude에 구조화된 JSON 객체를 반환하려면 반환하기 전에 JSON 문자열로 인코딩하세요. 숫자, 부울 또는 기타 비문자열 기본 요소도 문자열로 변환해야 합니다.

`@beta_tool` 데코레이터는 함수 인수와 docstring을 검사하여 주어진 함수의 json 스키마 표현을 추출합니다. 위의 예제에서 `calculate_sum`은 다음으로 변환됩니다:

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

### 도구 실행기 반복

`tool_runner()`에서 반환된 도구 실행기는 반복 가능하며, `for` 루프로 반복할 수 있습니다. 이를 종종 "도구 호출 루프"라고 합니다.
각 루프 반복은 Claude에서 반환된 메시지를 생성합니다.

코드가 루프 내의 현재 메시지를 처리할 기회를 가진 후, 도구 실행기는 메시지를 확인하여 Claude가 도구 사용을 요청했는지 확인합니다. 그렇다면 도구를 호출하고 도구 결과를 Claude에 자동으로 다시 보낸 다음, 다음 루프 반복을 시작하기 위해 Claude의 다음 메시지를 생성합니다.

간단한 `break` 문으로 모든 반복에서 루프를 종료할 수 있습니다. 도구 실행기는 Claude가 도구 사용 없이 메시지를 반환할 때까지 루프합니다.

중간 메시지에 관심이 없다면, 루프를 사용하는 대신 `until_done()` 메서드를 호출하여 Claude의 최종 메시지를 반환할 수 있습니다:

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

### 고급 사용법

루프 내에서 도구 실행기의 다음 요청을 Messages API에 완전히 사용자 정의할 수 있습니다.
`runner.generate_tool_call_response()` 메서드는 도구를 호출하고(Claude가 도구 사용을 트리거한 경우) Messages API로 다시 보낼 도구 결과에 대한 액세스를 제공합니다.
`runner.set_messages_params()` 및 `runner.append_messages()` 메서드를 사용하면 다음 Messages API 요청의 매개변수를 수정할 수 있습니다.

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

### 스트리밍

`stream=True`로 스트리밍을 활성화하면, 도구 실행기에서 내보낸 각 값은 `anthropic.messages.stream()`에서 반환된 `BetaMessageStream`입니다. `BetaMessageStream`은 Messages API의 스트리밍 이벤트를 생성하는 반복 가능합니다.

`message_stream.get_final_message()`를 사용하여 SDK가 스트리밍 이벤트를 최종 메시지로 누적하도록 할 수 있습니다.

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

### 기본 사용법

Zod 검증을 사용하여 타입 안전 도구 정의를 위해 `betaZodTool()`을 사용합니다(Zod 3.25.0 이상 필요).

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

`run` 함수는 텍스트, 이미지 또는 문서 블록을 포함한 콘텐츠 블록 또는 콘텐츠 블록 배열을 반환해야 합니다. 이를 통해 도구는 풍부한 다중 모달 응답을 반환할 수 있습니다. 반환된 문자열은 텍스트 콘텐츠 블록으로 변환됩니다.
Claude에 구조화된 JSON 객체를 반환하려면 JSON 문자열로 문자열화하세요. 숫자, 부울 또는 기타 비문자열 기본 요소도 문자열로 변환해야 합니다.

### 도구 실행기 반복

`toolRunner()`에서 반환된 도구 실행기는 비동기 반복 가능하며, `for await ... of` 루프로 반복할 수 있습니다. 이를 종종 "도구 호출 루프"라고 합니다.
각 루프 반복은 Claude에서 반환된 메시지를 생성합니다.

코드가 루프 내의 현재 메시지를 처리할 기회를 가진 후, 도구 실행기는 메시지를 확인하여 Claude가 도구 사용을 요청했는지 확인합니다. 그렇다면 도구를 호출하고 도구 결과를 Claude에 자동으로 다시 보낸 다음, 다음 루프 반복을 시작하기 위해 Claude의 다음 메시지를 생성합니다.

간단한 `break` 문으로 모든 반복에서 루프를 종료할 수 있습니다. 도구 실행기는 Claude가 도구 사용 없이 메시지를 반환할 때까지 루프합니다.

중간 메시지에 관심이 없다면, 루프를 사용하는 대신 도구 실행기를 `await`하여 Claude의 최종 메시지를 반환할 수 있습니다.

### 고급 사용법

루프 내에서 도구 실행기의 다음 요청을 Messages API에 완전히 사용자 정의할 수 있습니다.
`runner.generateToolResponse()` 메서드는 도구를 호출하고(Claude가 도구 사용을 트리거한 경우) Messages API로 다시 보낼 도구 결과에 대한 액세스를 제공합니다.
`runner.setMessagesParams()` 및 `runner.pushMessages()` 메서드를 사용하면 다음 Messages API 요청의 매개변수를 수정할 수 있습니다. 현재 매개변수는 `runner.params`에서 사용 가능합니다.

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

### 스트리밍

`stream: true`로 스트리밍을 활성화하면, 도구 실행기에서 내보낸 각 값은 `anthropic.messages.stream()`에서 반환된 `MessageStream`입니다. `MessageStream`은 Messages API의 스트리밍 이벤트를 생성하는 비동기 반복 가능합니다.

`messageStream.finalMessage()`를 사용하여 SDK가 스트리밍 이벤트를 최종 메시지로 누적하도록 할 수 있습니다.

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

### 기본 사용법

JSON 스키마 기반 타입 안전 도구 정의를 위해 `betaTool()`을 사용합니다. TypeScript와 편집기는 자동 완성을 위해 `input` 매개변수의 타입을 인식합니다.

<Note>
Claude에서 생성된 입력은 런타임에 검증되지 않습니다. 필요한 경우 `run` 함수 내에서 검증을 수행하세요.
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

`run` 함수는 텍스트, 이미지 또는 문서 블록을 포함한 모든 콘텐츠 블록 또는 콘텐츠 블록 배열을 반환해야 합니다. 이를 통해 도구는 풍부한 다중 모달 응답을 반환할 수 있습니다. 반환된 문자열은 텍스트 콘텐츠 블록으로 변환됩니다.
Claude에 구조화된 JSON 객체를 반환하려면 JSON 문자열로 인코딩하세요. 숫자, 부울 또는 기타 비문자열 기본 요소도 문자열로 변환해야 합니다.

### 도구 실행기 반복

`toolRunner()`에서 반환된 도구 실행기는 비동기 반복 가능하며, `for await ... of` 루프로 반복할 수 있습니다. 이를 종종 "도구 호출 루프"라고 합니다.
각 루프 반복은 Claude에서 반환된 메시지를 생성합니다.

코드가 루프 내의 현재 메시지를 처리할 기회를 가진 후, 도구 실행기는 메시지를 확인하여 Claude가 도구 사용을 요청했는지 확인합니다. 그렇다면 도구를 호출하고 도구 결과를 Claude에 자동으로 다시 보낸 다음, 다음 루프 반복을 시작하기 위해 Claude의 다음 메시지를 생성합니다.

간단한 `break` 문으로 모든 반복에서 루프를 종료할 수 있습니다. 도구 실행기는 Claude가 도구 사용 없이 메시지를 반환할 때까지 루프합니다.

중간 메시지에 관심이 없다면, 루프를 사용하는 대신 도구 실행기를 `await`하여 Claude의 최종 메시지를 반환할 수 있습니다.

### 고급 사용법

루프 내에서 도구 실행기의 다음 요청을 Messages API에 완전히 사용자 정의할 수 있습니다.
`runner.generateToolResponse()` 메서드는 도구를 호출하고(Claude가 도구 사용을 트리거한 경우) Messages API로 다시 보낼 도구 결과에 대한 액세스를 제공합니다.
`runner.setMessagesParams()` 및 `runner.pushMessages()` 메서드를 사용하면 다음 Messages API 요청의 매개변수를 수정할 수 있습니다. 현재 매개변수는 `runner.params`에서 사용 가능합니다.

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

### 스트리밍

`stream: true`로 스트리밍을 활성화하면, 도구 실행기에서 내보낸 각 값은 `anthropic.messages.stream()`에서 반환된 `MessageStream`입니다. `MessageStream`은 Messages API의 스트리밍 이벤트를 생성하는 비동기 반복 가능합니다.

`messageStream.finalMessage()`를 사용하여 SDK가 스트리밍 이벤트를 최종 메시지로 누적하도록 할 수 있습니다.

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

### 기본 사용법

`Anthropic::BaseTool`을 사용하여 입력 스키마로 도구를 정의한 다음, `client.beta.messages.tool_runner`을 사용하여 실행합니다.

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

`call` 메서드는 문자열 또는 콘텐츠 블록 배열을 반환해야 합니다. Claude에 구조화된 JSON 객체를 반환하려면 반환하기 전에 JSON 문자열로 인코딩하세요.

`Anthropic::BaseTool` 클래스는 도구 설명을 위해 `doc` 메서드를 사용하고 `input_schema`를 사용하여 예상 매개변수를 정의합니다. SDK는 이를 자동으로 적절한 JSON 스키마 형식으로 변환합니다.

### 도구 실행기 반복

도구 실행기는 대화가 진행되면서 각 메시지를 생성하는 `each_message` 메서드를 제공합니다. 이를 종종 "도구 호출 루프"라고 합니다.

코드가 현재 메시지를 처리할 기회를 가진 후, 도구 실행기는 Claude가 도구 사용을 요청했는지 확인합니다. 그렇다면 도구를 호출하고 도구 결과를 Claude에 자동으로 다시 보낸 다음, 다음 메시지를 생성합니다.

중간 메시지에 관심이 없다면, `run_until_finished` 메서드를 사용하여 모든 메시지를 한 번에 가져올 수 있습니다:

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

### 고급 사용법

도구 실행기는 동작을 사용자 정의하기 위한 여러 메서드를 제공합니다:

- `#next_message` - 대화를 한 번에 한 메시지씩 수동으로 진행합니다
- `#feed_messages` - 대화 중간에 추가 메시지를 주입합니다
- `#params` - 현재 요청 매개변수에 액세스하거나 수정합니다

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

### 스트리밍

스트리밍을 사용할 때, `each_streaming`으로 반복하여 실시간 이벤트를 수신합니다:

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
SDK 도구 실행기는 베타 상태입니다. 이 문서의 나머지 부분은 수동 도구 구현을 다룹니다.
</Note>

## Claude의 출력 제어

### 도구 사용 강제

경우에 따라 Claude가 도구를 사용하지 않고 답변을 제공할 수 있다고 생각하더라도 사용자의 질문에 답하기 위해 특정 도구를 사용하도록 Claude를 강제하고 싶을 수 있습니다. 다음과 같이 `tool_choice` 필드에서 도구를 지정하여 이를 수행할 수 있습니다:

```
tool_choice = {"type": "tool", "name": "get_weather"}
```

`tool_choice` 매개변수를 사용할 때, 네 가지 가능한 옵션이 있습니다:

- `auto`는 Claude가 제공된 도구를 호출할지 여부를 결정하도록 합니다. 이는 `tools`가 제공될 때의 기본값입니다.
- `any`는 Claude가 제공된 도구 중 하나를 사용해야 하지만 특정 도구를 강제하지 않도록 합니다.
- `tool`은 Claude가 항상 특정 도구를 사용하도록 강제합니다.
- `none`은 Claude가 도구를 사용하지 못하도록 합니다. 이는 `tools`가 제공되지 않을 때의 기본값입니다.

<Note>
[프롬프트 캐싱](/docs/ko/build-with-claude/prompt-caching#what-invalidates-the-cache)을 사용할 때, `tool_choice` 매개변수의 변경은 캐시된 메시지 블록을 무효화합니다. 도구 정의 및 시스템 프롬프트는 캐시된 상태로 유지되지만 메시지 콘텐츠는 다시 처리되어야 합니다.
</Note>

이 다이어그램은 각 옵션이 어떻게 작동하는지 보여줍니다:

<Frame>
  ![Image](/docs/images/tool_choice.png)
</Frame>

`tool_choice`가 `any` 또는 `tool`일 때, 도구를 강제로 사용하도록 어시스턴트 메시지를 미리 채웁니다. 이는 명시적으로 요청하더라도 모델이 `tool_use` 콘텐츠 블록 이전에 자연어 응답이나 설명을 내보내지 않음을 의미합니다.

<Note>
도구 사용과 함께 [확장된 사고](/docs/ko/build-with-claude/extended-thinking)를 사용할 때, `tool_choice: {"type": "any"}` 및 `tool_choice: {"type": "tool", "name": "..."}` 는 지원되지 않으며 오류가 발생합니다. `tool_choice: {"type": "auto"}` (기본값) 및 `tool_choice: {"type": "none"}` 만 확장된 사고와 호환됩니다.
</Note>

우리의 테스트에 따르면 이것이 성능을 감소시키지 않아야 합니다. 모델이 특정 도구를 사용하도록 요청하면서도 자연어 컨텍스트나 설명을 제공하기를 원한다면, `tool_choice`에 `{"type": "auto"}` (기본값)를 사용하고 `user` 메시지에 명시적 지침을 추가할 수 있습니다. 예를 들어: `What's the weather like in London? Use the get_weather tool in your response.`

<Tip>
**엄격한 도구를 사용한 보장된 도구 호출**

`tool_choice: {"type": "any"}`를 [엄격한 도구 사용](/docs/ko/build-with-claude/structured-outputs)과 결합하여 도구 중 하나가 호출될 것을 보장하고 도구 입력이 스키마를 엄격하게 따르도록 합니다. 도구 정의에서 `strict: true`를 설정하여 스키마 검증을 활성화합니다.
</Tip>

### JSON 출력

도구가 반드시 클라이언트 함수일 필요는 없습니다. 모델이 제공된 스키마를 따르는 JSON 출력을 반환하기를 원할 때마다 도구를 사용할 수 있습니다. 예를 들어, 특정 스키마를 가진 `record_summary` 도구를 사용할 수 있습니다. 완전한 작동 예제는 [Claude와 함께 도구 사용](/docs/ko/agents-and-tools/tool-use/overview)을 참조하세요.

### 도구를 사용한 모델 응답

도구를 사용할 때, Claude는 종종 자신이 하고 있는 일에 대해 설명하거나 도구를 호출하기 전에 사용자에게 자연스럽게 응답합니다.

예를 들어, "지금 샌프란시스코의 날씨는 어떻고 거기 시간은 몇 시인가?"라는 프롬프트가 주어지면, Claude는 다음과 같이 응답할 수 있습니다:

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

이러한 자연스러운 응답 스타일은 사용자가 Claude가 무엇을 하고 있는지 이해하도록 도와주고 더 대화체의 상호작용을 만듭니다. 시스템 프롬프트와 프롬프트에 `<examples>`를 제공하여 이러한 응답의 스타일과 내용을 안내할 수 있습니다.

Claude가 자신의 행동을 설명할 때 다양한 표현과 접근 방식을 사용할 수 있다는 점을 주목하는 것이 중요합니다. 코드는 이러한 응답을 다른 어시스턴트 생성 텍스트처럼 취급해야 하며, 특정 형식 규칙에 의존해서는 안 됩니다.

### 병렬 도구 사용

기본적으로 Claude는 사용자 쿼리에 답하기 위해 여러 도구를 사용할 수 있습니다. 다음을 통해 이 동작을 비활성화할 수 있습니다:

- tool_choice 유형이 `auto`일 때 `disable_parallel_tool_use=true`를 설정하면, Claude가 **최대 하나의** 도구를 사용하도록 보장합니다
- tool_choice 유형이 `any` 또는 `tool`일 때 `disable_parallel_tool_use=true`를 설정하면, Claude가 **정확히 하나의** 도구를 사용하도록 보장합니다

<section title="완전한 병렬 도구 사용 예제">

<Note>
**Tool runner로 더 간단하게**: 아래 예제는 수동 병렬 도구 처리를 보여줍니다. 대부분의 사용 사례에서 [tool runner](#tool-runner-beta)는 훨씬 적은 코드로 병렬 도구 실행을 자동으로 처리합니다.
</Note>

메시지 히스토리에서 병렬 도구 호출을 올바르게 포맷하는 방법을 보여주는 완전한 예제입니다:

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

병렬 도구 호출이 있는 어시스턴트 메시지는 다음과 같이 보입니다:

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
<section title="병렬 도구에 대한 완전한 테스트 스크립트">

병렬 도구 호출이 올바르게 작동하는지 테스트하고 확인하기 위한 완전하고 실행 가능한 스크립트입니다:

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

이 스크립트는 다음을 보여줍니다:
- 병렬 도구 호출과 결과를 올바르게 포맷하는 방법
- 병렬 호출이 이루어지고 있는지 확인하는 방법
- 향후 병렬 도구 사용을 장려하는 올바른 메시지 구조
- 피해야 할 일반적인 실수 (도구 결과 전의 텍스트 등)

이 스크립트를 실행하여 구현을 테스트하고 Claude가 병렬 도구 호출을 효과적으로 수행하고 있는지 확인하세요.

</section>

#### 병렬 도구 사용 최대화

Claude 4 모델은 기본적으로 우수한 병렬 도구 사용 기능을 가지고 있지만, 대상 프롬프팅을 통해 모든 모델에서 병렬 도구 실행의 가능성을 높일 수 있습니다:

<section title="병렬 도구 사용을 위한 시스템 프롬프트">

Claude 4 모델 (Opus 4, Sonnet 4)의 경우 시스템 프롬프트에 다음을 추가하세요:
```text
For maximum efficiency, whenever you need to perform multiple independent operations, invoke all relevant tools simultaneously rather than sequentially.
```

더욱 강력한 병렬 도구 사용을 위해 (기본값이 충분하지 않은 경우 권장):
```text
<use_parallel_tool_calls>
For maximum efficiency, whenever you perform multiple independent operations, invoke all relevant tools simultaneously rather than sequentially. Prioritize calling tools in parallel whenever possible. For example, when reading 3 files, run 3 tool calls in parallel to read all 3 files into context at the same time. When running multiple read-only commands like `ls` or `list_dir`, always run all of the commands in parallel. Err on the side of maximizing parallel tool calls rather than running too many tools sequentially.
</use_parallel_tool_calls>
```

</section>
<section title="사용자 메시지 프롬프팅">

특정 사용자 메시지 내에서 병렬 도구 사용을 장려할 수도 있습니다:

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
**Claude Sonnet 3.7과의 병렬 도구 사용**

Claude Sonnet 3.7은 `disable_parallel_tool_use`를 설정하지 않았더라도 응답에서 병렬 도구 호출을 할 가능성이 낮을 수 있습니다. [Claude 4 모델로 업그레이드](/docs/ko/about-claude/models/migrating-to-claude-4)하는 것을 권장합니다. Claude 4 모델은 기본 제공 토큰 효율적 도구 사용과 개선된 병렬 도구 호출을 가지고 있습니다.

여전히 Claude Sonnet 3.7을 사용 중이라면, Claude가 병렬 도구를 사용하도록 장려하는 데 도움이 되는 `token-efficient-tools-2025-02-19` [베타 헤더](/docs/ko/api/beta-headers)를 활성화할 수 있습니다. 다른 도구에 대한 호출을 동시에 래핑할 수 있는 메타 도구로 작동할 수 있는 "배치 도구"를 도입할 수도 있습니다.

이 해결 방법을 사용하는 방법에 대해서는 우리 쿡북의 [이 예제](https://github.com/anthropics/anthropic-cookbook/blob/main/tool_use/parallel_tools_claude_3_7_sonnet.ipynb)를 참조하세요.

</Warning>

## 도구 사용 및 도구 결과 콘텐츠 블록 처리

<Note>
**Tool runner로 더 간단하게**: 이 섹션에서 설명하는 수동 도구 처리는 [tool runner](#tool-runner-beta)에 의해 자동으로 관리됩니다. 도구 실행에 대한 사용자 정의 제어가 필요할 때 이 섹션을 사용하세요.
</Note>

Claude의 응답은 클라이언트 도구를 사용하는지 서버 도구를 사용하는지에 따라 다릅니다.

### 클라이언트 도구의 결과 처리

응답은 `tool_use`의 `stop_reason`과 다음을 포함하는 하나 이상의 `tool_use` 콘텐츠 블록을 가집니다:

- `id`: 이 특정 도구 사용 블록의 고유 식별자입니다. 나중에 도구 결과와 일치시키는 데 사용됩니다.
- `name`: 사용 중인 도구의 이름입니다.
- `input`: 도구에 전달되는 입력을 포함하는 객체로, 도구의 `input_schema`를 준수합니다.

<section title="`tool_use` 콘텐츠 블록이 있는 예제 API 응답">

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

클라이언트 도구에 대한 도구 사용 응답을 받으면 다음을 수행해야 합니다:

1. `tool_use` 블록에서 `name`, `id`, `input`을 추출합니다.
2. 해당 도구 이름에 해당하는 코드베이스의 실제 도구를 실행하여 도구 `input`을 전달합니다.
3. `role`이 `user`인 새 메시지를 보내고 `tool_result` 유형을 포함하는 `content` 블록과 다음 정보를 포함하여 대화를 계속합니다:
   - `tool_use_id`: 이것이 결과인 도구 사용 요청의 `id`입니다.
   - `content`: 도구의 결과로, 문자열 (예: `"content": "15 degrees"`), 중첩된 콘텐츠 블록의 목록 (예: `"content": [{"type": "text", "text": "15 degrees"}]`), 또는 문서 블록의 목록 (예: `"content": ["type": "document", "source": {"type": "text", "media_type": "text/plain", "data": "15 degrees"}]`)입니다. 이러한 콘텐츠 블록은 `text`, `image`, 또는 `document` 유형을 사용할 수 있습니다.
   - `is_error` (선택 사항): 도구 실행으로 인해 오류가 발생한 경우 `true`로 설정합니다.

<Note>
**중요한 형식 요구 사항**:
- 도구 결과 블록은 메시지 히스토리에서 해당 도구 사용 블록 바로 뒤에 와야 합니다. 어시스턴트의 도구 사용 메시지와 사용자의 도구 결과 메시지 사이에 메시지를 포함할 수 없습니다.
- 도구 결과를 포함하는 사용자 메시지에서 tool_result 블록은 콘텐츠 배열의 FIRST에 와야 합니다. 모든 텍스트는 모든 도구 결과 AFTER에 와야 합니다.

예를 들어, 이것은 400 오류를 발생시킵니다:
```json
{"role": "user", "content": [
  {"type": "text", "text": "Here are the results:"},  // ❌ Text before tool_result
  {"type": "tool_result", "tool_use_id": "toolu_01", ...}
]}
```

이것이 올바릅니다:
```json
{"role": "user", "content": [
  {"type": "tool_result", "tool_use_id": "toolu_01", ...},
  {"type": "text", "text": "What should I do next?"}  // ✅ Text after tool_result
]}
```

"tool_use ids were found without tool_result blocks immediately after"와 같은 오류를 받으면 도구 결과가 올바르게 포맷되었는지 확인하세요.
</Note>

<section title="성공적인 도구 결과의 예">

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

<section title="이미지가 있는 도구 결과의 예">

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
<section title="빈 도구 결과의 예">

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

<section title="문서가 있는 도구 결과의 예">

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

도구 결과를 받은 후, Claude는 해당 정보를 사용하여 원래 사용자 프롬프트에 대한 응답 생성을 계속합니다.

### 서버 도구의 결과 처리

Claude는 도구를 내부적으로 실행하고 추가 사용자 상호작용을 요구하지 않고 결과를 응답에 직접 통합합니다.

<Tip>
  **다른 API와의 차이점**

도구 사용을 분리하거나 `tool` 또는 `function`과 같은 특수 역할을 사용하는 API와 달리, Claude API는 도구를 `user` 및 `assistant` 메시지 구조에 직접 통합합니다.

메시지는 `text`, `image`, `tool_use`, `tool_result` 블록의 배열을 포함합니다. `user` 메시지는 클라이언트 콘텐츠와 `tool_result`를 포함하고, `assistant` 메시지는 AI 생성 콘텐츠와 `tool_use`를 포함합니다.

</Tip>

### `max_tokens` 중지 이유 처리

Claude의 [응답이 `max_tokens` 제한에 도달하여 잘린 경우](/docs/ko/build-with-claude/handling-stop-reasons#max-tokens), 잘린 응답에 불완전한 도구 사용 블록이 포함되어 있으면 더 높은 `max_tokens` 값으로 요청을 다시 시도하여 전체 도구 사용을 얻어야 합니다.

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

#### `pause_turn` 중지 이유 처리

웹 검색과 같은 서버 도구를 사용할 때, API는 `pause_turn` 중지 이유를 반환할 수 있으며, 이는 API가 장시간 실행되는 턴을 일시 중지했음을 나타냅니다.

`pause_turn` 중지 이유를 처리하는 방법은 다음과 같습니다:

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

`pause_turn`을 처리할 때:
- **대화 계속**: 일시 중지된 응답을 후속 요청에서 그대로 전달하여 Claude가 턴을 계속하도록 합니다
- **필요한 경우 수정**: 대화를 중단하거나 리디렉션하려는 경우 계속하기 전에 선택적으로 콘텐츠를 수정할 수 있습니다
- **도구 상태 유지**: 기능을 유지하기 위해 계속 요청에 동일한 도구를 포함합니다

## 오류 문제 해결

<Note>
**기본 제공 오류 처리**: [Tool runner](#tool-runner-beta)는 대부분의 일반적인 시나리오에 대한 자동 오류 처리를 제공합니다. 이 섹션은 고급 사용 사례에 대한 수동 오류 처리를 다룹니다.
</Note>

Claude와 함께 도구를 사용할 때 발생할 수 있는 몇 가지 다른 유형의 오류가 있습니다:

<section title="도구 실행 오류">

도구 자체가 실행 중에 오류를 발생시키는 경우 (예: 날씨 데이터를 가져올 때 네트워크 오류), `content`와 함께 `"is_error": true`에서 오류 메시지를 반환할 수 있습니다:

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

Claude는 이 오류를 사용자에 대한 응답에 통합합니다. 예를 들어, "죄송하지만 날씨 서비스 API를 사용할 수 없어서 현재 날씨를 검색할 수 없습니다. 나중에 다시 시도해주세요."

</section>
<section title="잘못된 도구 이름">

Claude의 도구 사용 시도가 유효하지 않은 경우 (예: 필수 매개변수 누락), 이는 Claude가 도구를 올바르게 사용하기에 충분한 정보가 없었음을 의미합니다. 개발 중에 가장 좋은 방법은 도구 정의에서 더 자세한 `description` 값으로 요청을 다시 시도하는 것입니다.

그러나 오류를 나타내는 `tool_result`로 대화를 계속 진행할 수도 있으며, Claude는 누락된 정보가 채워진 도구를 다시 사용하려고 시도합니다:

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

도구 요청이 유효하지 않거나 매개변수가 누락된 경우, Claude는 수정 사항으로 2-3번 재시도한 후 사용자에게 사과합니다.

<Tip>
잘못된 도구 호출을 완전히 제거하려면, 도구 정의에서 `strict: true`를 사용하여 [엄격한 도구 사용](/docs/ko/build-with-claude/structured-outputs)을 사용하세요. 이는 도구 입력이 항상 스키마와 정확히 일치하도록 보장하여 누락된 매개변수와 유형 불일치를 방지합니다.
</Tip>

</section>
<section title="\<search_quality_reflection> 태그">

Claude가 \<search_quality_reflection> 태그로 검색 품질을 반영하는 것을 방지하려면 프롬프트에 "Do not reflect on the quality of the returned search results in your response"를 추가하세요.

</section>
<section title="서버 도구 오류">

서버 도구가 오류를 만날 때 (예: 웹 검색의 네트워크 문제), Claude는 이러한 오류를 투명하게 처리하고 사용자에게 대체 응답이나 설명을 제공하려고 시도합니다. 클라이언트 도구와 달리 서버 도구에 대해 `is_error` 결과를 처리할 필요가 없습니다.

웹 검색의 경우, 가능한 오류 코드는 다음을 포함합니다:
- `too_many_requests`: 속도 제한 초과
- `invalid_input`: 잘못된 검색 쿼리 매개변수
- `max_uses_exceeded`: 최대 웹 검색 도구 사용 초과
- `query_too_long`: 쿼리가 최대 길이를 초과합니다
- `unavailable`: 내부 오류가 발생했습니다

</section>
<section title="병렬 도구 호출이 작동하지 않음">

Claude가 예상대로 병렬 도구 호출을 하지 않는 경우 다음 일반적인 문제를 확인하세요:

**1. 잘못된 도구 결과 형식**

가장 일반적인 문제는 대화 히스토리에서 도구 결과를 잘못 포맷하는 것입니다. 이것은 Claude가 병렬 호출을 피하도록 "가르칩니다".

특히 병렬 도구 사용의 경우:
- ❌ **잘못됨**: 각 도구 결과에 대해 별도의 사용자 메시지 전송
- ✅ **올바름**: 모든 도구 결과는 단일 사용자 메시지에 있어야 합니다

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

다른 형식 규칙은 위의 [일반 형식 요구 사항](#handling-tool-use-and-tool-result-content-blocks)을 참조하세요.

**2. 약한 프롬프팅**

기본 프롬프팅은 충분하지 않을 수 있습니다. 더 강력한 언어를 사용하세요:

```text
<use_parallel_tool_calls>
For maximum efficiency, whenever you perform multiple independent operations,
invoke all relevant tools simultaneously rather than sequentially.
Prioritize calling tools in parallel whenever possible.
</use_parallel_tool_calls>
```

**3. 병렬 도구 사용 측정**

병렬 도구 호출이 작동하는지 확인하려면:

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

**4. 모델별 동작**

- Claude Opus 4.5, Opus 4.1, Sonnet 4: 최소한의 프롬프팅으로 병렬 도구 사용에 탁월합니다
- Claude Sonnet 3.7: 더 강력한 프롬프팅이나 `token-efficient-tools-2025-02-19` [베타 헤더](/docs/ko/api/beta-headers)가 필요할 수 있습니다. [Claude 4로 업그레이드](/docs/ko/about-claude/models/migrating-to-claude-4)를 고려하세요.
- Claude Haiku: 명시적 프롬프팅 없이는 병렬 도구를 사용할 가능성이 낮습니다

</section>