# Как реализовать использование инструментов

Узнайте, как реализовать использование инструментов с Claude, включая определение инструментов, примеры использования и управление выводом модели.

---

## Выбор модели

Мы рекомендуем использовать последнюю модель Claude Sonnet (4.5) или Claude Opus (4.1) для сложных инструментов и неоднозначных запросов; они лучше справляются с несколькими инструментами и запрашивают уточнения при необходимости.

Используйте модели Claude Haiku для простых инструментов, но имейте в виду, что они могут выводить отсутствующие параметры.

<Tip>
Если вы используете Claude с использованием инструментов и расширенным мышлением, обратитесь к нашему руководству [здесь](/docs/ru/build-with-claude/extended-thinking) для получения дополнительной информации.
</Tip>

## Указание клиентских инструментов

Клиентские инструменты (как определённые Anthropic, так и определённые пользователем) указываются в параметре `tools` верхнего уровня запроса API. Каждое определение инструмента включает:

| Параметр      | Описание                                                                                         |
| :------------- | :-------------------------------------------------------------------------------------------------- |
| `name`         | Имя инструмента. Должно соответствовать регулярному выражению `^[a-zA-Z0-9_-]{1,64}$`.                                 |
| `description`  | Подробное описание на простом языке того, что делает инструмент, когда его следует использовать и как он себя ведёт. |
| `input_schema` | Объект [JSON Schema](https://json-schema.org/), определяющий ожидаемые параметры для инструмента.     |
| `input_examples` | (Опционально, бета) Массив примеров входных объектов, чтобы помочь Claude понять, как использовать инструмент. См. [Предоставление примеров использования инструментов](#providing-tool-use-examples). |

<section title="Пример простого определения инструмента">

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

Этот инструмент с именем `get_weather` ожидает входной объект с обязательной строкой `location` и опциональной строкой `unit`, которая должна быть либо "celsius", либо "fahrenheit".

</section>

### Системный запрос для использования инструментов

Когда вы вызываете API Claude с параметром `tools`, мы создаём специальный системный запрос из определений инструментов, конфигурации инструментов и любого указанного пользователем системного запроса. Созданный запрос предназначен для инструктирования модели использовать указанный инструмент (инструменты) и предоставить необходимый контекст для правильной работы инструмента:

```
In this environment you have access to a set of tools you can use to answer the user's question.
{{ FORMATTING INSTRUCTIONS }}
String and scalar parameters should be specified as is, while lists and objects should use JSON format. Note that spaces for string values are not stripped. The output is not expected to be valid XML and is parsed with regular expressions.
Here are the functions available in JSONSchema format:
{{ TOOL DEFINITIONS IN JSON SCHEMA }}
{{ USER SYSTEM PROMPT }}
{{ TOOL CONFIGURATION }}
```

### Лучшие практики для определений инструментов

Чтобы получить лучшую производительность от Claude при использовании инструментов, следуйте этим рекомендациям:

- **Предоставляйте чрезвычайно подробные описания.** Это, безусловно, наиболее важный фактор в производительности инструмента. Ваши описания должны объяснять каждую деталь инструмента, включая:
  - Что делает инструмент
  - Когда его следует использовать (и когда не следует)
  - Что означает каждый параметр и как он влияет на поведение инструмента
  - Любые важные предостережения или ограничения, такие как какую информацию инструмент не возвращает, если имя инструмента неясно. Чем больше контекста вы можете дать Claude о ваших инструментах, тем лучше он сможет решить, когда и как их использовать. Стремитесь к минимум 3-4 предложениям на описание инструмента, больше, если инструмент сложный.
- **Приоритизируйте описания, но рассмотрите использование `input_examples` для сложных инструментов.** Чёткие описания наиболее важны, но для инструментов со сложными входными данными, вложенными объектами или параметрами, чувствительными к формату, вы можете использовать поле `input_examples` (бета) для предоставления примеров, проверенных по схеме. См. [Предоставление примеров использования инструментов](#providing-tool-use-examples) для получения подробной информации.

<section title="Пример хорошего описания инструмента">

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

<section title="Пример плохого описания инструмента">

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

Хорошее описание ясно объясняет, что делает инструмент, когда его использовать, какие данные он возвращает и что означает параметр `ticker`. Плохое описание слишком краткое и оставляет Claude с множеством открытых вопросов о поведении и использовании инструмента.

## Предоставление примеров использования инструментов

Вы можете предоставить конкретные примеры допустимых входных данных инструмента, чтобы помочь Claude более эффективно понять, как использовать ваши инструменты. Это особенно полезно для сложных инструментов с вложенными объектами, опциональными параметрами или входными данными, чувствительными к формату.

<Info>
Примеры использования инструментов — это функция бета. Включите соответствующий [бета-заголовок](/docs/ru/api/beta-headers) для вашего провайдера:

| Провайдер | Бета-заголовок | Поддерживаемые модели |
|----------|-------------|------------------|
| Claude API,<br/>Microsoft Foundry | `advanced-tool-use-2025-11-20` | Все модели |
| Vertex AI,<br/>Amazon Bedrock | `tool-examples-2025-10-29` | Claude Opus 4.5 только |
</Info>

### Базовое использование

Добавьте опциональное поле `input_examples` к определению вашего инструмента с массивом примеров входных объектов. Каждый пример должен быть действительным в соответствии с `input_schema` инструмента:

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

Примеры включены в запрос вместе со схемой вашего инструмента, показывая Claude конкретные шаблоны для хорошо сформированных вызовов инструментов. Это помогает Claude понять, когда включать опциональные параметры, какие форматы использовать и как структурировать сложные входные данные.

### Требования и ограничения

- **Проверка схемы** - Каждый пример должен быть действительным в соответствии с `input_schema` инструмента. Недействительные примеры возвращают ошибку 400
- **Не поддерживается для серверных инструментов** - Только определённые пользователем инструменты могут иметь примеры входных данных
- **Стоимость токенов** - Примеры добавляют к токенам запроса: ~20-50 токенов для простых примеров, ~100-200 токенов для сложных вложенных объектов

## Средство запуска инструментов (бета)

Средство запуска инструментов предоставляет готовое решение для выполнения инструментов с Claude. Вместо ручной обработки вызовов инструментов, результатов инструментов и управления разговором, средство запуска инструментов автоматически:

- Выполняет инструменты, когда Claude их вызывает
- Обрабатывает цикл запроса/ответа
- Управляет состоянием разговора
- Обеспечивает безопасность типов и валидацию

Мы рекомендуем использовать средство запуска инструментов для большинства реализаций использования инструментов.

<Note>
Средство запуска инструментов в настоящее время находится в бета-версии и доступно в SDK для [Python](https://github.com/anthropics/anthropic-sdk-python/blob/main/tools.md), [TypeScript](https://github.com/anthropics/anthropic-sdk-typescript/blob/main/helpers.md#tool-helpers) и [Ruby](https://github.com/anthropics/anthropic-sdk-ruby/blob/main/helpers.md#3-auto-looping-tool-runner-beta).
</Note>

<Tip>
**Автоматическое управление контекстом с компактностью**

Средство запуска инструментов поддерживает автоматическую [компактность](/docs/ru/build-with-claude/context-editing#client-side-compaction-sdk), которая генерирует резюме, когда использование токенов превышает пороговое значение. Это позволяет долгосрочным агентским задачам продолжаться за пределами лимитов контекстного окна.
</Tip>

<Tabs>
<Tab title="Python">

### Базовое использование

Используйте декоратор `@beta_tool` для определения инструментов и `client.beta.messages.tool_runner()` для их выполнения.

<Note>
Если вы используете асинхронный клиент, замените `@beta_tool` на `@beta_async_tool` и определите функцию с `async def`.
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

Декорированная функция должна возвращать блок содержимого или массив блоков содержимого, включая текст, изображения или блоки документов. Это позволяет инструментам возвращать богатые, мультимодальные ответы. Возвращённые строки будут преобразованы в блок текстового содержимого.
Если вы хотите вернуть структурированный объект JSON в Claude, закодируйте его в строку JSON перед возвратом. Числа, логические значения или другие примитивы, не являющиеся строками, также должны быть преобразованы в строки.

Декоратор `@beta_tool` будет проверять аргументы функции и строку документации, чтобы извлечь представление json-схемы данной функции. В приведённом выше примере `calculate_sum` будет преобразован в:

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

### Итерация по средству запуска инструментов

Средство запуска инструментов, возвращаемое `tool_runner()`, является итерируемым, которое вы можете перебирать с помощью цикла `for`. Это часто называют "циклом вызова инструмента".
Каждая итерация цикла выдаёт сообщение, которое было возвращено Claude.

После того как ваш код получит возможность обработать текущее сообщение внутри цикла, средство запуска инструментов проверит сообщение, чтобы увидеть, запросил ли Claude использование инструмента. Если да, оно вызовет инструмент и автоматически отправит результат инструмента обратно в Claude, затем выдаст следующее сообщение от Claude, чтобы начать следующую итерацию вашего цикла.

Вы можете завершить цикл на любой итерации с помощью простого оператора `break`. Средство запуска инструментов будет циклически повторяться до тех пор, пока Claude не вернёт сообщение без использования инструмента.

Если вам не важны промежуточные сообщения, вместо использования цикла вы можете вызвать метод `until_done()`, который вернёт финальное сообщение от Claude:

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

### Продвинутое использование

В цикле у вас есть возможность полностью настроить следующий запрос средства запуска инструментов к API Messages.
Метод `runner.generate_tool_call_response()` вызовет инструмент (если Claude запустил использование инструмента) и даст вам доступ к результату инструмента, который будет отправлен обратно в API Messages.
Методы `runner.set_messages_params()` и `runner.append_messages()` позволяют вам изменять параметры для следующего запроса API Messages.

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

### Потоковая передача

При включении потоковой передачи с `stream=True` каждое значение, выданное средством запуска инструментов, является `BetaMessageStream`, как возвращается из `anthropic.messages.stream()`. `BetaMessageStream` сам по себе является итерируемым, который выдаёт события потоковой передачи из API Messages.

Вы можете использовать `message_stream.get_final_message()`, чтобы позволить SDK выполнить накопление событий потоковой передачи в финальное сообщение для вас.

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

### Базовое использование

Используйте `betaZodTool()` для определений инструментов, безопасных по типам, с валидацией Zod (требуется Zod 3.25.0 или выше).

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

Функция `run` должна возвращать блок содержимого или массив блоков содержимого, включая текст, изображения или блоки документов. Это позволяет инструментам возвращать богатые, мультимодальные ответы. Возвращённые строки будут преобразованы в блок текстового содержимого.
Если вы хотите вернуть структурированный объект JSON в Claude, преобразуйте его в строку JSON перед возвратом. Числа, логические значения или другие примитивы, не являющиеся строками, также должны быть преобразованы в строки.

### Итерация по средству запуска инструментов

Средство запуска инструментов, возвращаемое `toolRunner()`, является асинхронным итерируемым, которое вы можете перебирать с помощью цикла `for await ... of`. Это часто называют "циклом вызова инструмента".
Каждая итерация цикла выдаёт сообщение, которое было возвращено Claude.

После того как ваш код получит возможность обработать текущее сообщение внутри цикла, средство запуска инструментов проверит сообщение, чтобы увидеть, запросил ли Claude использование инструмента. Если да, оно вызовет инструмент и автоматически отправит результат инструмента обратно в Claude, затем выдаст следующее сообщение от Claude, чтобы начать следующую итерацию вашего цикла.

Вы можете завершить цикл на любой итерации с помощью простого оператора `break`. Средство запуска инструментов будет циклически повторяться до тех пор, пока Claude не вернёт сообщение без использования инструмента.

Если вам не важны промежуточные сообщения, вместо использования цикла вы можете просто `await` средство запуска инструментов, которое вернёт финальное сообщение от Claude.

### Продвинутое использование

В цикле у вас есть возможность полностью настроить следующий запрос средства запуска инструментов к API Messages.
Метод `runner.generateToolResponse()` вызовет инструмент (если Claude запустил использование инструмента) и даст вам доступ к результату инструмента, который будет отправлен обратно в API Messages.
Методы `runner.setMessagesParams()` и `runner.pushMessages()` позволяют вам изменять параметры для следующего запроса API Messages. Текущие параметры доступны под `runner.params`.

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

### Потоковая передача

При включении потоковой передачи с `stream: true` каждое значение, выданное средством запуска инструментов, является `MessageStream`, как возвращается из `anthropic.messages.stream()`. `MessageStream` сам по себе является асинхронным итерируемым, который выдаёт события потоковой передачи из API Messages.

Вы можете использовать `messageStream.finalMessage()`, чтобы позволить SDK выполнить накопление событий потоковой передачи в финальное сообщение для вас.

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

### Базовое использование

Используйте `betaTool()` для определений инструментов, безопасных по типам, на основе JSON-схем. TypeScript и ваш редактор будут знать о типе параметра `input` для автодополнения.

<Note>
Входные данные, сгенерированные Claude, не будут проверяться во время выполнения. Выполните валидацию внутри функции `run`, если необходимо.
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

Функция `run` должна возвращать любой блок содержимого или массив блоков содержимого, включая текст, изображение или блоки документов. Это позволяет инструментам возвращать богатые, мультимодальные ответы. Возвращённые строки будут преобразованы в блок текстового содержимого.
Если вы хотите вернуть структурированный объект JSON в Claude, закодируйте его в строку JSON перед возвратом. Числа, логические значения или другие примитивы, не являющиеся строками, также должны быть преобразованы в строки.

### Итерация по средству запуска инструментов

Средство запуска инструментов, возвращаемое `toolRunner()`, является асинхронным итерируемым, которое вы можете перебирать с помощью цикла `for await ... of`. Это часто называют "циклом вызова инструмента".
Каждая итерация цикла выдаёт сообщение, которое было возвращено Claude.

После того как ваш код получит возможность обработать текущее сообщение внутри цикла, средство запуска инструментов проверит сообщение, чтобы увидеть, запросил ли Claude использование инструмента. Если да, оно вызовет инструмент и автоматически отправит результат инструмента обратно в Claude, затем выдаст следующее сообщение от Claude, чтобы начать следующую итерацию вашего цикла.

Вы можете завершить цикл на любой итерации с помощью простого оператора `break`. Средство запуска инструментов будет циклически повторяться до тех пор, пока Claude не вернёт сообщение без использования инструмента.

Если вам не важны промежуточные сообщения, вместо использования цикла вы можете просто `await` средство запуска инструментов, которое вернёт финальное сообщение от Claude.

### Продвинутое использование

В цикле у вас есть возможность полностью настроить следующий запрос средства запуска инструментов к API Messages.
Метод `runner.generateToolResponse()` вызовет инструмент (если Claude запустил использование инструмента) и даст вам доступ к результату инструмента, который будет отправлен обратно в API Messages.
Методы `runner.setMessagesParams()` и `runner.pushMessages()` позволяют вам изменять параметры для следующего запроса API Messages. Текущие параметры доступны под `runner.params`.

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

### Потоковая передача

При включении потоковой передачи с `stream: true` каждое значение, выданное средством запуска инструментов, является `MessageStream`, как возвращается из `anthropic.messages.stream()`. `MessageStream` сам по себе является асинхронным итерируемым, который выдаёт события потоковой передачи из API Messages.

Вы можете использовать `messageStream.finalMessage()`, чтобы позволить SDK выполнить накопление событий потоковой передачи в финальное сообщение для вас.

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

### Базовое использование

Определите инструменты, используя `Anthropic::BaseTool` с входной схемой, затем используйте `client.beta.messages.tool_runner` для их выполнения.

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

Метод `call` должен возвращать строку или массив блоков содержимого. Если вы хотите вернуть структурированный объект JSON в Claude, закодируйте его в строку JSON перед возвратом.

Класс `Anthropic::BaseTool` использует метод `doc` для описания инструмента и `input_schema` для определения ожидаемых параметров. SDK автоматически преобразует это в соответствующий формат JSON-схемы.

### Итерация по средству запуска инструментов

Средство запуска инструментов предоставляет метод `each_message`, который выдаёт каждое сообщение по мере развития разговора. Это часто называют "циклом вызова инструмента".

После того как ваш код получит возможность обработать текущее сообщение, средство запуска инструментов проверит, запросил ли Claude использование инструмента. Если да, оно вызовет инструмент и автоматически отправит результат инструмента обратно в Claude, затем выдаст следующее сообщение.

Если вам не важны промежуточные сообщения, вы можете использовать метод `run_until_finished` для получения всех сообщений сразу:

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

### Продвинутое использование

Средство запуска инструментов предоставляет несколько методов для настройки поведения:

- `#next_message` - Вручную пройти через разговор одно сообщение за раз
- `#feed_messages` - Внедрить дополнительные сообщения в середину разговора
- `#params` - Получить доступ или изменить текущие параметры запроса

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

### Потоковая передача

При использовании потоковой передачи выполняйте итерацию с `each_streaming` для получения событий в реальном времени:

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
Средство запуска инструментов SDK находится в бета-версии. Остальная часть этого документа охватывает ручную реализацию инструментов.
</Note>

## Управление выводом Claude

### Принудительное использование инструментов

В некоторых случаях вы можете захотеть, чтобы Claude использовал конкретный инструмент для ответа на вопрос пользователя, даже если Claude думает, что может предоставить ответ без использования инструмента. Вы можете сделать это, указав инструмент в поле `tool_choice` следующим образом:

```
tool_choice = {"type": "tool", "name": "get_weather"}
```

При работе с параметром tool_choice у нас есть четыре возможных варианта:

- `auto` позволяет Claude решить, вызывать ли какие-либо предоставленные инструменты или нет. Это значение по умолчанию, когда предоставлены `tools`.
- `any` говорит Claude, что он должен использовать один из предоставленных инструментов, но не принуждает к использованию конкретного инструмента.
- `tool` позволяет нам принудить Claude всегда использовать конкретный инструмент.
- `none` предотвращает использование Claude любых инструментов. Это значение по умолчанию, когда `tools` не предоставлены.

<Note>
При использовании [кэширования запросов](/docs/ru/build-with-claude/prompt-caching#what-invalidates-the-cache) изменения параметра `tool_choice` будут инвалидировать кэшированные блоки сообщений. Определения инструментов и системные запросы остаются кэшированными, но содержимое сообщения должно быть переобработано.
</Note>

Эта диаграмма иллюстрирует, как работает каждый вариант:

<Frame>
  ![Image](/docs/images/tool_choice.png)
</Frame>

Обратите внимание, что когда у вас есть `tool_choice` как `any` или `tool`, мы предварительно заполним сообщение помощника, чтобы принудить использование инструмента. Это означает, что модели не будут выдавать естественный языковой ответ или объяснение перед блоками содержимого `tool_use`, даже если об этом явно попросить.

<Note>
При использовании [расширенного мышления](/docs/ru/build-with-claude/extended-thinking) с использованием инструментов `tool_choice: {"type": "any"}` и `tool_choice: {"type": "tool", "name": "..."}` не поддерживаются и приведут к ошибке. Совместимы только `tool_choice: {"type": "auto"}` (по умолчанию) и `tool_choice: {"type": "none"}`.
</Note>

Наше тестирование показало, что это не должно снижать производительность. Если вы хотите, чтобы модель предоставила естественный языковой контекст или объяснения, одновременно запрашивая использование конкретного инструмента, вы можете использовать `{"type": "auto"}` для `tool_choice` (по умолчанию) и добавить явные инструкции в сообщение `user`. Например: `What's the weather like in London? Use the get_weather tool in your response.`

<Tip>
**Гарантированные вызовы инструментов со строгими инструментами**

Объедините `tool_choice: {"type": "any"}` с [строгим использованием инструментов](/docs/ru/build-with-claude/structured-outputs) для гарантии как того, что один из ваших инструментов будет вызван, ТАК И того, что входные данные инструмента строго следуют вашей схеме. Установите `strict: true` в определениях ваших инструментов, чтобы включить валидацию схемы.
</Tip>

### Вывод JSON

Инструменты не обязательно должны быть клиентскими функциями — вы можете использовать инструменты в любое время, когда хотите, чтобы модель возвращала вывод JSON, который следует предоставленной схеме. Например, вы можете использовать инструмент `record_summary` с определённой схемой. См. [Использование инструментов с Claude](/docs/ru/agents-and-tools/tool-use/overview) для полного рабочего примера.

### Ответы модели с инструментами

При использовании инструментов Claude часто комментирует свои действия или естественно отвечает пользователю перед вызовом инструментов.

Например, при запросе "Какая погода в Сан-Франциско прямо сейчас и какое там время?", Claude может ответить:

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

Этот естественный стиль ответа помогает пользователям понять, что делает Claude, и создает более разговорное взаимодействие. Вы можете направлять стиль и содержание этих ответов через системные подсказки и предоставляя `<examples>` в ваших подсказках.

Важно отметить, что Claude может использовать различные формулировки и подходы при объяснении своих действий. Ваш код должен рассматривать эти ответы как любой другой текст, сгенерированный ассистентом, и не полагаться на определенные соглашения форматирования.

### Параллельное использование инструментов

По умолчанию Claude может использовать несколько инструментов для ответа на запрос пользователя. Вы можете отключить это поведение:

- Установив `disable_parallel_tool_use=true` когда тип tool_choice равен `auto`, что гарантирует, что Claude использует **максимум один** инструмент
- Установив `disable_parallel_tool_use=true` когда тип tool_choice равен `any` или `tool`, что гарантирует, что Claude использует **ровно один** инструмент

<section title="Полный пример параллельного использования инструментов">

<Note>
**Проще с Tool runner**: Пример ниже показывает ручную обработку параллельных инструментов. Для большинства случаев использования [tool runner](#tool-runner-beta) автоматически обрабатывает параллельное выполнение инструментов с гораздо меньшим количеством кода.
</Note>

Вот полный пример, показывающий, как правильно форматировать параллельные вызовы инструментов в истории сообщений:

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

Сообщение ассистента с параллельными вызовами инструментов будет выглядеть так:

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
<section title="Полный тестовый скрипт для параллельных инструментов">

Вот полный, готовый к запуску скрипт для тестирования и проверки работы параллельных вызовов инструментов:

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

Этот скрипт демонстрирует:
- Как правильно форматировать параллельные вызовы инструментов и результаты
- Как проверить, что параллельные вызовы выполняются
- Правильную структуру сообщений, которая способствует будущему параллельному использованию инструментов
- Распространенные ошибки, которых следует избегать (например, текст перед результатами инструментов)

Запустите этот скрипт, чтобы протестировать вашу реализацию и убедиться, что Claude эффективно выполняет параллельные вызовы инструментов.

</section>

#### Максимизация параллельного использования инструментов

Хотя модели Claude 4 имеют отличные возможности параллельного использования инструментов по умолчанию, вы можете увеличить вероятность параллельного выполнения инструментов во всех моделях с помощью целевых подсказок:

<section title="Системные подсказки для параллельного использования инструментов">

Для моделей Claude 4 (Opus 4 и Sonnet 4) добавьте это в вашу системную подсказку:
```text
For maximum efficiency, whenever you need to perform multiple independent operations, invoke all relevant tools simultaneously rather than sequentially.
```

Для еще более сильного параллельного использования инструментов (рекомендуется, если по умолчанию недостаточно), используйте:
```text
<use_parallel_tool_calls>
For maximum efficiency, whenever you perform multiple independent operations, invoke all relevant tools simultaneously rather than sequentially. Prioritize calling tools in parallel whenever possible. For example, when reading 3 files, run 3 tool calls in parallel to read all 3 files into context at the same time. When running multiple read-only commands like `ls` or `list_dir`, always run all of the commands in parallel. Err on the side of maximizing parallel tool calls rather than running too many tools sequentially.
</use_parallel_tool_calls>
```

</section>
<section title="Подсказки в сообщениях пользователя">

Вы также можете поощрять параллельное использование инструментов в конкретных сообщениях пользователя:

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
**Параллельное использование инструментов с Claude Sonnet 3.7**

Claude Sonnet 3.7 может быть менее склонен к параллельным вызовам инструментов в ответе, даже если вы не установили `disable_parallel_tool_use`. Мы рекомендуем [обновиться до моделей Claude 4](/docs/ru/about-claude/models/migrating-to-claude-4), которые имеют встроенное эффективное использование инструментов по токенам и улучшенный параллельный вызов инструментов.

Если вы все еще используете Claude Sonnet 3.7, вы можете включить [бета-заголовок](/docs/ru/api/beta-headers) `token-efficient-tools-2025-02-19`, который помогает поощрять Claude использовать параллельные инструменты. Вы также можете представить "пакетный инструмент", который может действовать как мета-инструмент для обертывания вызовов других инструментов одновременно.

Смотрите [этот пример](https://github.com/anthropics/anthropic-cookbook/blob/main/tool_use/parallel_tools_claude_3_7_sonnet.ipynb) в нашей кулинарной книге, чтобы узнать, как использовать это решение.

</Warning>

## Обработка блоков содержимого tool use и tool result

<Note>
**Проще с Tool runner**: Ручная обработка инструментов, описанная в этом разделе, автоматически управляется [tool runner](#tool-runner-beta). Используйте этот раздел, когда вам нужен пользовательский контроль над выполнением инструментов.
</Note>

Ответ Claude отличается в зависимости от того, использует ли он клиентский или серверный инструмент.

### Обработка результатов от клиентских инструментов

Ответ будет иметь `stop_reason` равный `tool_use` и один или несколько блоков содержимого `tool_use`, которые включают:

- `id`: Уникальный идентификатор для этого конкретного блока tool use. Это будет использоваться для сопоставления результатов инструментов позже.
- `name`: Имя используемого инструмента.
- `input`: Объект, содержащий входные данные, передаваемые инструменту, соответствующие `input_schema` инструмента.

<section title="Пример ответа API с блоком содержимого `tool_use`">

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

Когда вы получаете ответ tool use для клиентского инструмента, вы должны:

1. Извлечь `name`, `id` и `input` из блока `tool_use`.
2. Запустить фактический инструмент в вашей кодовой базе, соответствующий этому имени инструмента, передав входные данные инструмента.
3. Продолжить разговор, отправив новое сообщение с `role` равным `user` и блоком `content`, содержащим тип `tool_result` и следующую информацию:
   - `tool_use_id`: `id` запроса tool use, для которого это результат.
   - `content`: Результат инструмента в виде строки (например, `"content": "15 degrees"`), списка вложенных блоков содержимого (например, `"content": [{"type": "text", "text": "15 degrees"}]`) или списка блоков документов (например, `"content": ["type": "document", "source": {"type": "text", "media_type": "text/plain", "data": "15 degrees"}]`). Эти блоки содержимого могут использовать типы `text`, `image` или `document`.
   - `is_error` (опционально): Установите значение `true`, если выполнение инструмента привело к ошибке.

<Note>
**Важные требования к форматированию**:
- Блоки tool result должны немедленно следовать за соответствующими блоками tool use в истории сообщений. Вы не можете включать никакие сообщения между сообщением tool use ассистента и сообщением tool result пользователя.
- В сообщении пользователя, содержащем результаты инструментов, блоки tool_result должны быть ПЕРВЫМИ в массиве содержимого. Любой текст должен идти ПОСЛЕ всех результатов инструментов.

Например, это вызовет ошибку 400:
```json
{"role": "user", "content": [
  {"type": "text", "text": "Here are the results:"},  // ❌ Text before tool_result
  {"type": "tool_result", "tool_use_id": "toolu_01", ...}
]}
```

Это правильно:
```json
{"role": "user", "content": [
  {"type": "tool_result", "tool_use_id": "toolu_01", ...},
  {"type": "text", "text": "What should I do next?"}  // ✅ Text after tool_result
]}
```

Если вы получите ошибку типа "tool_use ids were found without tool_result blocks immediately after", проверьте, что результаты инструментов отформатированы правильно.
</Note>

<section title="Пример успешного результата инструмента">

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

<section title="Пример результата инструмента с изображениями">

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
<section title="Пример пустого результата инструмента">

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

<section title="Пример результата инструмента с документами">

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

После получения результата инструмента Claude будет использовать эту информацию для продолжения генерирования ответа на исходный запрос пользователя.

### Обработка результатов от серверных инструментов

Claude выполняет инструмент внутри и включает результаты непосредственно в свой ответ без необходимости дополнительного взаимодействия с пользователем.

<Tip>
  **Различия от других API**

В отличие от API, которые разделяют использование инструментов или используют специальные роли, такие как `tool` или `function`, API Claude интегрирует инструменты непосредственно в структуру сообщений `user` и `assistant`.

Сообщения содержат массивы блоков `text`, `image`, `tool_use` и `tool_result`. Сообщения `user` включают содержимое клиента и `tool_result`, а сообщения `assistant` содержат содержимое, сгенерированное ИИ, и `tool_use`.

</Tip>

### Обработка причины остановки `max_tokens`

Если [ответ Claude обрезан из-за достижения лимита `max_tokens`](/docs/ru/build-with-claude/handling-stop-reasons#max-tokens), и обрезанный ответ содержит неполный блок tool use, вам нужно будет повторить запрос с более высоким значением `max_tokens`, чтобы получить полный tool use.

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

#### Обработка причины остановки `pause_turn`

При использовании серверных инструментов, таких как веб-поиск, API может вернуть причину остановки `pause_turn`, указывающую, что API приостановил длительный ход.

Вот как обработать причину остановки `pause_turn`:

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

При обработке `pause_turn`:
- **Продолжите разговор**: Передайте приостановленный ответ как есть в последующем запросе, чтобы позволить Claude продолжить свой ход
- **Измените при необходимости**: Вы можете опционально изменить содержимое перед продолжением, если хотите прервать или перенаправить разговор
- **Сохраните состояние инструмента**: Включите те же инструменты в запрос продолжения, чтобы сохранить функциональность

## Устранение неполадок ошибок

<Note>
**Встроенная обработка ошибок**: [Tool runner](#tool-runner-beta) обеспечивает автоматическую обработку ошибок для большинства распространенных сценариев. Этот раздел охватывает ручную обработку ошибок для продвинутых случаев использования.
</Note>

Существует несколько различных типов ошибок, которые могут возникнуть при использовании инструментов с Claude:

<section title="Ошибка выполнения инструмента">

Если сам инструмент выбрасывает ошибку во время выполнения (например, ошибка сети при получении данных о погоде), вы можете вернуть сообщение об ошибке в `content` вместе с `"is_error": true`:

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

Claude затем включит эту ошибку в свой ответ пользователю, например: "Извините, я не смог получить текущую погоду, потому что API сервиса погоды недоступен. Пожалуйста, попробуйте позже."

</section>
<section title="Неверное имя инструмента">

Если попытка Claude использовать инструмент недействительна (например, отсутствуют обязательные параметры), это обычно означает, что было недостаточно информации для Claude, чтобы правильно использовать инструмент. Лучший вариант во время разработки - повторить запрос с более подробными значениями `description` в определениях инструментов.

Однако вы также можете продолжить разговор с `tool_result`, который указывает на ошибку, и Claude попытается использовать инструмент снова с заполненной отсутствующей информацией:

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

Если запрос инструмента недействителен или отсутствуют параметры, Claude повторит попытку 2-3 раза с исправлениями перед извинением перед пользователем.

<Tip>
Чтобы полностью исключить неверные вызовы инструментов, используйте [строгое использование инструментов](/docs/ru/build-with-claude/structured-outputs) с `strict: true` в определениях инструментов. Это гарантирует, что входные данные инструмента всегда будут точно соответствовать вашей схеме, предотвращая отсутствующие параметры и несоответствия типов.
</Tip>

</section>
<section title="Теги \<search_quality_reflection>">

Чтобы предотвратить отражение Claude о качестве возвращаемых результатов поиска с помощью тегов \<search_quality_reflection>, добавьте "Do not reflect on the quality of the returned search results in your response" в вашу подсказку.

</section>
<section title="Ошибки серверных инструментов">

Когда серверные инструменты встречают ошибки (например, проблемы с сетью при веб-поиске), Claude прозрачно обрабатывает эти ошибки и пытается предоставить альтернативный ответ или объяснение пользователю. В отличие от клиентских инструментов, вам не нужно обрабатывать результаты `is_error` для серверных инструментов.

Для веб-поиска в частности, возможные коды ошибок включают:
- `too_many_requests`: Превышен лимит частоты запросов
- `invalid_input`: Неверный параметр поискового запроса
- `max_uses_exceeded`: Превышено максимальное количество использований инструмента веб-поиска
- `query_too_long`: Запрос превышает максимальную длину
- `unavailable`: Произошла внутренняя ошибка

</section>
<section title="Параллельные вызовы инструментов не работают">

Если Claude не выполняет параллельные вызовы инструментов, когда ожидается, проверьте эти распространенные проблемы:

**1. Неправильное форматирование результатов инструментов**

Наиболее распространенная проблема - неправильное форматирование результатов инструментов в истории разговора. Это "учит" Claude избегать параллельных вызовов.

В частности, для параллельного использования инструментов:
- ❌ **Неправильно**: Отправка отдельных сообщений пользователя для каждого результата инструмента
- ✅ **Правильно**: Все результаты инструментов должны быть в одном сообщении пользователя

```json
// ❌ Это снижает параллельное использование инструментов
[
  {"role": "assistant", "content": [tool_use_1, tool_use_2]},
  {"role": "user", "content": [tool_result_1]},
  {"role": "user", "content": [tool_result_2]}  // Separate message
]

// ✅ Это сохраняет параллельное использование инструментов
[
  {"role": "assistant", "content": [tool_use_1, tool_use_2]},
  {"role": "user", "content": [tool_result_1, tool_result_2]}  // Single message
]
```

Смотрите [общие требования к форматированию выше](#handling-tool-use-and-tool-result-content-blocks) для других правил форматирования.

**2. Слабые подсказки**

Подсказки по умолчанию могут быть недостаточными. Используйте более сильный язык:

```text
<use_parallel_tool_calls>
For maximum efficiency, whenever you perform multiple independent operations,
invoke all relevant tools simultaneously rather than sequentially.
Prioritize calling tools in parallel whenever possible.
</use_parallel_tool_calls>
```

**3. Измерение использования параллельных инструментов**

Чтобы проверить, работают ли параллельные вызовы инструментов:

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

**4. Поведение, специфичное для модели**

- Claude Opus 4.5, Opus 4.1 и Sonnet 4: Отлично справляются с параллельным использованием инструментов с минимальными подсказками
- Claude Sonnet 3.7: Может потребоваться более сильная подсказка или [бета-заголовок](/docs/ru/api/beta-headers) `token-efficient-tools-2025-02-19`. Рассмотрите [обновление до Claude 4](/docs/ru/about-claude/models/migrating-to-claude-4).
- Claude Haiku: Менее вероятно использовать параллельные инструменты без явных подсказок

</section>