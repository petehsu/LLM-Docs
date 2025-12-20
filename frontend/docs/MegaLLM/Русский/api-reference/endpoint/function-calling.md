# Вызов функций

> Позволяет моделям ИИ взаимодействовать с внешними инструментами, API и функциями для создания интеллектуальных агентов и автоматизации рабочих процессов.

## Обзор

Вызов функций (также известный как использование инструментов) позволяет моделям ИИ:

* **Вызывать внешние API** - Получать данные в реальном времени
* **Выполнять функции** - Производить вычисления или операции
* **Обращаться к базам данных** - Запрашивать и извлекать информацию
* **Взаимодействовать с системами** - Управлять внешними сервисами
* **Связывать операции** - Создавать сложные многошаговые рабочие процессы

<Info>
  **Параллельный вызов функций**: MegaLLM поддерживает одновременное выполнение нескольких функций для улучшения производительности.
</Info>

## Как это работает

<Steps>
  <Step title="Определите инструменты">
    Укажите доступные функции с описаниями JSON Schema
  </Step>

  <Step title="ИИ принимает решение">
    Модель определяет когда и как использовать инструменты на основе контекста
  </Step>

  <Step title="Выполните функции">
    Ваше приложение выполняет запрошенные функции
  </Step>

  <Step title="Верните результаты">
    Отправьте результаты функций обратно в ИИ
  </Step>

  <Step title="ИИ отвечает">
    Модель включает результаты в финальный ответ
  </Step>
</Steps>

## Формат определения инструментов

### Формат OpenAI

```json  theme={null}
{
  "type": "function",
  "function": {
    "name": "get_weather",
    "description": "Получить текущую погоду в заданном месте",
    "parameters": {
      "type": "object",
      "properties": {
        "location": {
          "type": "string",
          "description": "Город и штат, например Сан-Франциско, Калифорния"
        },
        "unit": {
          "type": "string",
          "enum": ["celsius", "fahrenheit"],
          "description": "Единица температуры"
        }
      },
      "required": ["location"]
    }
  }
}
```

### Формат Anthropic

```json  theme={null}
{
  "name": "get_weather",
  "description": "Получить текущую погоду в заданном месте",
  "input_schema": {
    "type": "object",
    "properties": {
      "location": {
        "type": "string",
        "description": "Город и штат, например Сан-Франциско, Калифорния"
      }
    },
    "required": ["location"]
  }
}
```

## Параметры запроса

### Формат OpenAI

| Параметр      | Тип           | Описание                                                                                  |
| ------------- | ------------- | ----------------------------------------------------------------------------------------- |
| `tools`       | массив        | Массив определений инструментов                                                           |
| `tool_choice` | строка/объект | Управляет использованием инструментов: `auto`, `required`, `none`, или конкретная функция |

### Опции выбора инструментов

```python  theme={null}
# Пусть ИИ решает (по умолчанию)
tool_choice="auto"

# Заставить ИИ вызвать функцию
tool_choice="required"

# Запретить вызов функций
tool_choice="none"

# Заставить вызвать конкретную функцию
tool_choice={
    "type": "function",
    "function": {"name": "get_weather"}
}
```

## Примеры

<Tabs>
  <Tab title="Python">
    ```python  theme={null}
    from openai import OpenAI
    import json

    client = OpenAI(
        base_url="https://ai.megallm.io/v1",
        api_key="your-api-key"
    )

    # Определите вашу функцию
    def get_weather(location: str, unit: str = "celsius"):
        """Получить текущую погоду (симуляция)"""
        return {
            "location": location,
            "temperature": 22,
            "unit": unit,
            "condition": "sunny"
        }

    # Определите инструменты для ИИ
    tools = [
        {
            "type": "function",
            "function": {
                "name": "get_weather",
                "description": "Получить текущую погоду в месте",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "location": {
                            "type": "string",
                            "description": "Город и штат, например Сан-Франциско, Калифорния"
                        },
                        "unit": {
                            "type": "string",
                            "enum": ["celsius", "fahrenheit"]
                        }
                    },
                    "required": ["location"]
                }
            }
        }
    ]

    # Начальный запрос
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "user", "content": "Какая погода в Лондоне?"}
        ],
        tools=tools,
        tool_choice="auto"
    )

    message = response.choices[0].message

    # Проверьте, хочет ли ИИ вызвать функцию
    if message.tool_calls:
        # Выполните функцию
        for tool_call in message.tool_calls:
            function_name = tool_call.function.name
            function_args = json.loads(tool_call.function.arguments)

            if function_name == "get_weather":
                result = get_weather(**function_args)

                # Отправьте результат обратно в ИИ
                follow_up = client.chat.completions.create(
                    model="gpt-4",
                    messages=[
                        {"role": "user", "content": "Какая погода в Лондоне?"},
                        message,
                        {
                            "role": "tool",
                            "tool_call_id": tool_call.id,
                            "content": json.dumps(result)
                        }
                    ]
                )

                print(follow_up.choices[0].message.content)
    ```
  </Tab>

  <Tab title="JavaScript">
    ```javascript  theme={null}
    import OpenAI from 'openai';

    const openai = new OpenAI({
      baseURL: 'https://ai.megallm.io/v1',
      apiKey: process.env.MEGALLM_API_KEY,
    });

    // Определите функцию
    function getWeather(location, unit = 'celsius') {
      return {
        location,
        temperature: 22,
        unit,
        condition: 'sunny'
      };
    }

    // Определите инструменты
    const tools = [
      {
        type: 'function',
        function: {
          name: 'get_weather',
          description: 'Получить текущую погоду в месте',
          parameters: {
            type: 'object',
            properties: {
              location: {
                type: 'string',
                description: 'Город и штат, например Сан-Франциско, Калифорния'
              },
              unit: {
                type: 'string',
                enum: ['celsius', 'fahrenheit']
              }
            },
            required: ['location']
          }
        }
      }
    ];

    // Начальный запрос
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'user', content: "Какая погода в Лондоне?" }
      ],
      tools,
      tool_choice: 'auto'
    });

    const message = response.choices[0].message;

    if (message.tool_calls) {
      const messages = [
        { role: 'user', content: "Какая погода в Лондоне?" },
        message
      ];

      for (const toolCall of message.tool_calls) {
        const functionName = toolCall.function.name;
        const functionArgs = JSON.parse(toolCall.function.arguments);

        if (functionName === 'get_weather') {
          const result = getWeather(functionArgs.location, functionArgs.unit);

          messages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: JSON.stringify(result)
          });
        }
      }

      const followUp = await openai.chat.completions.create({
        model: 'gpt-4',
        messages
      });

      console.log(followUp.choices[0].message.content);
    }
    ```
  </Tab>

  <Tab title="TypeScript">
    ```typescript  theme={null}
    import OpenAI from 'openai';

    interface WeatherParams {
      location: string;
      unit?: 'celsius' | 'fahrenheit';
    }

    interface WeatherResult {
      location: string;
      temperature: number;
      unit: string;
      condition: string;
    }

    const openai = new OpenAI({
      baseURL: 'https://ai.megallm.io/v1',
      apiKey: process.env.MEGALLM_API_KEY!,
    });

    // Типобезопасная функция
    async function getWeather({ location, unit = 'celsius' }: WeatherParams): Promise<WeatherResult> {
      return {
        location,
        temperature: 22,
        unit,
        condition: 'sunny'
      };
    }

    // Реестр функций
    const functionRegistry = {
      get_weather: getWeather
    } as const;

    // Определения инструментов
    const tools: OpenAI.Chat.ChatCompletionTool[] = [
      {
        type: 'function',
        function: {
          name: 'get_weather',
          description: 'Получить текущую погоду в месте',
          parameters: {
            type: 'object',
            properties: {
              location: {
                type: 'string',
                description: 'Город и штат, например Сан-Франциско, Калифорния'
              },
              unit: {
                type: 'string',
                enum: ['celsius', 'fahrenheit']
              }
            },
            required: ['location']
          }
        }
      }
    ];

    async function handleToolCalls(message: OpenAI.Chat.ChatCompletionMessage) {
      if (!message.tool_calls) return null;

      const toolResults = await Promise.all(
        message.tool_calls.map(async (toolCall) => {
          const fn = functionRegistry[toolCall.function.name as keyof typeof functionRegistry];
          if (!fn) throw new Error(`Неизвестная функция: ${toolCall.function.name}`);

          const args = JSON.parse(toolCall.function.arguments);
          const result = await fn(args);

          return {
            role: 'tool' as const,
            tool_call_id: toolCall.id,
            content: JSON.stringify(result)
          };
        })
      );

      return toolResults;
    }

    // Использование
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: "Какая погода в Лондоне?" }],
      tools,
      tool_choice: 'auto'
    });

    const toolResults = await handleToolCalls(response.choices[0].message);

    if (toolResults) {
      const followUp = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'user', content: "Какая погода в Лондоне?" },
          response.choices[0].message,
          ...toolResults
        ]
      });

      console.log(followUp.choices[0].message.content);
    }
    ```
  </Tab>
</Tabs>

## Параллельный вызов функций

Выполняйте несколько функций одновременно:

```python  theme={null}
# ИИ может вызывать несколько функций одновременно
response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "user", "content": "Сравни погоду в Лондоне, Париже и Токио"}
    ],
    tools=tools
)

# Обработка нескольких вызовов инструментов параллельно
if response.choices[0].message.tool_calls:
    import asyncio

    async def execute_tool(tool_call):
        function_name = tool_call.function.name
        function_args = json.loads(tool_call.function.arguments)

        result = await async_function_registry[function_name](**function_args)

        return {
            "role": "tool",
            "tool_call_id": tool_call.id,
            "content": json.dumps(result)
        }

    # Выполните все функции параллельно
    tool_results = await asyncio.gather(
        *[execute_tool(tc) for tc in response.choices[0].message.tool_calls]
    )
```

## Продвинутые паттерны

### Связывание функций

Создавайте сложные рабочие процессы:

```python  theme={null}
tools = [
    {
        "type": "function",
        "function": {
            "name": "search_products",
            "description": "Поиск товаров",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {"type": "string"}
                },
                "required": ["query"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "check_inventory",
            "description": "Проверить наличие товара",
            "parameters": {
                "type": "object",
                "properties": {
                    "product_id": {"type": "string"}
                },
                "required": ["product_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "place_order",
            "description": "Оформить заказ",
            "parameters": {
                "type": "object",
                "properties": {
                    "product_id": {"type": "string"},
                    "quantity": {"type": "integer"}
                },
                "required": ["product_id", "quantity"]
            }
        }
    }
]

# ИИ свяжет функции для выполнения сложных задач
# Пример: "Найди синие футболки и закажи 2 штуки, если есть в наличии"
# 1. search_products(query="синяя футболка")
# 2. check_inventory(product_id="...")
# 3. place_order(product_id="...", quantity=2)
```

### Обработка ошибок

```python  theme={null}
def safe_function_call(function_name, arguments):
    try:
        result = function_registry[function_name](**arguments)
        return {"success": True, "result": result}
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "error_type": type(e).__name__
        }

# В ответе инструмента
for tool_call in message.tool_calls:
    function_name = tool_call.function.name
    function_args = json.loads(tool_call.function.arguments)

    result = safe_function_call(function_name, function_args)

    messages.append({
        "role": "tool",
        "tool_call_id": tool_call.id,
        "content": json.dumps(result)
    })
```

### Потоковая передача с функциями

```python  theme={null}
stream = client.chat.completions.create(
    model="gpt-4",
    messages=messages,
    tools=tools,
    stream=True
)

function_call = None

for chunk in stream:
    delta = chunk.choices[0].delta

    if delta.tool_calls:
        if function_call is None:
            function_call = {"id": "", "name": "", "arguments": ""}

        tool_call = delta.tool_calls[0]
        if tool_call.id:
            function_call["id"] = tool_call.id
        if tool_call.function.name:
            function_call["name"] = tool_call.function.name
        if tool_call.function.arguments:
            function_call["arguments"] += tool_call.function.arguments

    if chunk.choices[0].finish_reason == "tool_calls":
        # Выполните функцию
        result = execute_function(function_call)
```

## Реальные варианты использования

### Помощник по запросам к базе данных

```python  theme={null}
{
  "type": "function",
  "function": {
    "name": "execute_sql",
    "description": "Выполнить SQL-запрос",
    "parameters": {
      "type": "object",
      "properties": {
        "query": {"type": "string"},
        "database": {
          "type": "string",
          "enum": ["users", "products", "orders"]
        }
      },
      "required": ["query", "database"]
    }
  }
}
```

### Агент интеграции API

```python  theme={null}
{
  "type": "function",
  "function": {
    "name": "call_api",
    "description": "Выполнить HTTP API вызов",
    "parameters": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "enum": ["GET", "POST", "PUT", "DELETE"]
        },
        "url": {"type": "string"},
        "headers": {"type": "object"},
        "body": {"type": "object"}
      },
      "required": ["method", "url"]
    }
  }
}
```

### Операции с файловой системой

```python  theme={null}
{
  "type": "function",
  "function": {
    "name": "read_file",
    "description": "Прочитать содержимое файла",
    "parameters": {
      "type": "object",
      "properties": {
        "path": {"type": "string"}
      },
      "required": ["path"]
    }
  }
}
```

## Лучшие практики

<Tip>
  Пишите четкие, подробные описания функций. ИИ использует их для принятия решения когда и как вызывать функции.
</Tip>

1. **Четкие описания** - Будьте конкретны в описании того, что делает каждая функция
2. **Валидация входных данных** - Всегда проверяйте аргументы функций перед выполнением
3. **Корректная обработка ошибок** - Возвращайте информацию об ошибках в ИИ
4. **Используйте подсказки типов** - Используйте типы TypeScript/Python для безопасности
5. **Ограничение частоты** - Реализуйте ограничение частоты для вызовов внешних API
6. **Безопасность** - Валидируйте и очищайте все входные данные функций
7. **Асинхронное выполнение** - Используйте async/await для лучшей производительности

## Формат ответа

### Объект вызова инструмента (OpenAI)

```json  theme={null}
{
  "id": "call_abc123",
  "type": "function",
  "function": {
    "name": "get_weather",
    "arguments": "{\"location\": \"Лондон\", \"unit\": \"celsius\"}"
  }
}
```

### Формат ответа инструмента

```json  theme={null}
{
  "role": "tool",
  "tool_call_id": "call_abc123",
  "content": "{\"temperature\": 22, \"condition\": \"солнечно\"}"
}
```

## Поддержка моделей

Вызов функций поддерживается следующими моделями:

* **OpenAI**: gpt-4, gpt-4-turbo, gpt-3.5-turbo
* **Anthropic**: claude-3.5-sonnet, claude-opus-4, claude-sonnet-4
* **Другие**: Проверьте [страницу моделей](/ru/api-reference/get-models) для полного списка

## Связанное

* [API завершений чата](/ru/api-reference/post-chat-completions) - Вызов функций совместимый с OpenAI
* [API сообщений](/ru/api-reference/post-v1-messages) - Использование инструментов совместимое с Anthropic
* [Потоковая передача](/ru/api-reference/endpoint/streaming) - Вызов функций с потоковой передачей
* [Модели](/ru/api-reference/get-models) - Возможности и функции моделей


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt