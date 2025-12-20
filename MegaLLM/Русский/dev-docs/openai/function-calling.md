# Вызов функций

> Позвольте вашему AI-ассистенту взаимодействовать с внешними инструментами, API и функциями. Идеально для создания агентов, которые могут выполнять действия, получать данные в реальном времени и интегрироваться с вашими существующими системами.

<Info>
  **Параллельный вызов функций**: MegaLLM поддерживает параллельное выполнение функций для улучшенной производительности.
</Info>

## Как это работает

<Steps>
  <Step title="Определение доступных инструментов">
    Укажите функции, которые AI может использовать, с описаниями JSON Schema.
  </Step>

  <Step title="AI решает, когда вызывать">
    Модель определяет, когда и как использовать инструменты на основе контекста.
  </Step>

  <Step title="Выполнение и возврат результатов">
    Ваше приложение выполняет функцию и возвращает результаты AI.
  </Step>

  <Step title="AI обрабатывает результаты">
    AI включает результаты функции в свой финальный ответ.
  </Step>
</Steps>

## Базовый пример

<Tabs>
  <Tab title="Python">
    ```python  theme={null}
    from openai import OpenAI
    import json

    client = OpenAI(
        base_url="https://ai.megallm.io/v1",
        api_key="your-api-key"
    )

    # Определение ваших функций
    def get_weather(location: str, unit: str = "celsius"):
        """Получить текущую погоду для локации"""
        # Имитация API-вызова
        return {
            "location": location,
            "temperature": 22,
            "unit": unit,
            "condition": "sunny"
        }

    # Определение инструментов для AI
    tools = [
        {
            "type": "function",
            "function": {
                "name": "get_weather",
                "description": "Get the current weather in a given location",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "location": {
                            "type": "string",
                            "description": "The city and state, e.g. San Francisco, CA"
                        },
                        "unit": {
                            "type": "string",
                            "enum": ["celsius", "fahrenheit"],
                            "description": "Temperature unit"
                        }
                    },
                    "required": ["location"]
                }
            }
        }
    ]

    # Отправка сообщения с инструментами
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "user", "content": "What's the weather in London?"}
        ],
        tools=tools,
        tool_choice="auto"  # Позволить модели решать
    )

    # Проверка, хочет ли модель вызвать функцию
    message = response.choices[0].message

    if message.tool_calls:
        # Выполнение функции
        for tool_call in message.tool_calls:
            function_name = tool_call.function.name
            function_args = json.loads(tool_call.function.arguments)

            if function_name == "get_weather":
                result = get_weather(**function_args)

                # Отправка результата обратно в модель
                follow_up = client.chat.completions.create(
                    model="gpt-4",
                    messages=[
                        {"role": "user", "content": "What's the weather in London?"},
                        message,  # Включить вызов инструмента ассистентом
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
      apiKey: process.env.GITHUB_TOKEN,
    });

    // Определение вашей функции
    function getWeather(location, unit = 'celsius') {
      // Имитация API-вызова
      return {
        location,
        temperature: 22,
        unit,
        condition: 'sunny'
      };
    }

    // Определение инструментов
    const tools = [
      {
        type: 'function',
        function: {
          name: 'get_weather',
          description: 'Get the current weather in a given location',
          parameters: {
            type: 'object',
            properties: {
              location: {
                type: 'string',
                description: 'The city and state, e.g. San Francisco, CA'
              },
              unit: {
                type: 'string',
                enum: ['celsius', 'fahrenheit'],
                description: 'Temperature unit'
              }
            },
            required: ['location']
          }
        }
      }
    ];

    // Отправка сообщения с инструментами
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'user', content: "What's the weather in London?" }
      ],
      tools,
      tool_choice: 'auto'
    });

    const message = response.choices[0].message;

    if (message.tool_calls) {
      const messages = [
        { role: 'user', content: "What's the weather in London?" },
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
      apiKey: process.env.GITHUB_TOKEN!,
    });

    // Типобезопасная реализация функции
    async function getWeather({ location, unit = 'celsius' }: WeatherParams): Promise<WeatherResult> {
      // Реальная реализация вызовет API
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

    // Определения инструментов с правильной типизацией
    const tools: OpenAI.Chat.ChatCompletionTool[] = [
      {
        type: 'function',
        function: {
          name: 'get_weather',
          description: 'Get the current weather in a given location',
          parameters: {
            type: 'object',
            properties: {
              location: {
                type: 'string',
                description: 'The city and state, e.g. San Francisco, CA'
              },
              unit: {
                type: 'string',
                enum: ['celsius', 'fahrenheit'],
                description: 'Temperature unit'
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
          if (!fn) throw new Error(`Unknown function: ${toolCall.function.name}`);

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
    async function askAboutWeather() {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: "What's the weather in London and Paris?" }],
        tools,
        tool_choice: 'auto'
      });

      const toolResults = await handleToolCalls(response.choices[0].message);

      if (toolResults) {
        const followUp = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            { role: 'user', content: "What's the weather in London and Paris?" },
            response.choices[0].message,
            ...toolResults
          ]
        });

        return followUp.choices[0].message.content;
      }

      return response.choices[0].message.content;
    }
    ```
  </Tab>
</Tabs>

## Параллельный вызов функций

MegaLLM поддерживает вызов нескольких функций параллельно для лучшей производительности:

```python  theme={null}
# AI может вызывать несколько функций одновременно
response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "user", "content": "Compare the weather in London, Paris, and Tokyo"}
    ],
    tools=tools
)

# Обработка нескольких вызовов инструментов параллельно
if response.choices[0].message.tool_calls:
    import asyncio

    async def execute_tool(tool_call):
        function_name = tool_call.function.name
        function_args = json.loads(tool_call.function.arguments)

        # Асинхронное выполнение функции
        result = await async_function_registry[function_name](**function_args)

        return {
            "role": "tool",
            "tool_call_id": tool_call.id,
            "content": json.dumps(result)
        }

    # Выполнение всех функций параллельно
    tool_results = await asyncio.gather(
        *[execute_tool(tc) for tc in response.choices[0].message.tool_calls]
    )
```

## Продвинутые паттерны

### Цепочка функций

Создание сложных рабочих процессов путем объединения вызовов функций:

```python  theme={null}
tools = [
    {
        "type": "function",
        "function": {
            "name": "search_products",
            "description": "Search for products",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {"type": "string"},
                    "category": {"type": "string"}
                },
                "required": ["query"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "check_inventory",
            "description": "Check product inventory",
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
            "description": "Place an order for a product",
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

# AI будет объединять эти функции для выполнения сложных задач
messages = [
    {"role": "user", "content": "Find and order 2 blue t-shirts if they're in stock"}
]

# AI может:
# 1. Вызвать search_products(query="blue t-shirt")
# 2. Вызвать check_inventory(product_id="...")
# 3. Вызвать place_order(product_id="...", quantity=2)
```

### Контроль выбора инструментов

Управление тем, когда и как AI использует инструменты:

```python  theme={null}
# Принудительно вызвать конкретную функцию
response = client.chat.completions.create(
    model="gpt-4",
    messages=messages,
    tools=tools,
    tool_choice={
        "type": "function",
        "function": {"name": "get_weather"}
    }
)

# Позволить AI решать (по умолчанию)
response = client.chat.completions.create(
    model="gpt-4",
    messages=messages,
    tools=tools,
    tool_choice="auto"
)

# Запретить вызов функций
response = client.chat.completions.create(
    model="gpt-4",
    messages=messages,
    tools=tools,
    tool_choice="none"
)

# Принудительно вызвать какую-либо функцию (любую)
response = client.chat.completions.create(
    model="gpt-4",
    messages=messages,
    tools=tools,
    tool_choice="required"
)
```

### Обработка ошибок

Правильная обработка ошибок выполнения функций:

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

# В ответе вашего инструмента
for tool_call in message.tool_calls:
    function_name = tool_call.function.name
    function_args = json.loads(tool_call.function.arguments)

    result = safe_function_call(function_name, function_args)

    messages.append({
        "role": "tool",
        "tool_call_id": tool_call.id,
        "content": json.dumps(result)
    })

# AI обработает ошибку изящно
```

## Реальные примеры

### Ассистент для запросов к базе данных

```python  theme={null}
tools = [
    {
        "type": "function",
        "function": {
            "name": "execute_sql",
            "description": "Execute a SQL query on the database",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "SQL query to execute"
                    },
                    "database": {
                        "type": "string",
                        "enum": ["users", "products", "orders"],
                        "description": "Target database"
                    }
                },
                "required": ["query", "database"]
            }
        }
    }
]

# Пользователь: "How many orders were placed last month?"
# AI генерирует: execute_sql(
#   query="SELECT COUNT(*) FROM orders WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)",
#   database="orders"
# )
```

### Агент интеграции API

```python  theme={null}
tools = [
    {
        "type": "function",
        "function": {
            "name": "call_api",
            "description": "Make an HTTP API call",
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
]

# AI теперь может взаимодействовать с любым API
```

### Операции с файловой системой

```python  theme={null}
tools = [
    {
        "type": "function",
        "function": {
            "name": "read_file",
            "description": "Read contents of a file",
            "parameters": {
                "type": "object",
                "properties": {
                    "path": {"type": "string"}
                },
                "required": ["path"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "write_file",
            "description": "Write content to a file",
            "parameters": {
                "type": "object",
                "properties": {
                    "path": {"type": "string"},
                    "content": {"type": "string"},
                    "append": {"type": "boolean", "default": false}
                },
                "required": ["path", "content"]
            }
        }
    }
]
```

## Лучшие практики

<Tip>
  **Валидация**: Всегда проверяйте аргументы функций перед выполнением, чтобы предотвратить ошибки.
</Tip>

### 1. Четкие описания функций

```python  theme={null}
# Хорошо
"description": "Get current weather data including temperature, humidity, and conditions for a specific location"

# Плохо
"description": "Weather function"
```

### 2. Типобезопасность

```typescript  theme={null}
// Определите типы для всех параметров функций
interface FunctionParams {
  [key: string]: unknown;
}

// Валидация перед выполнением
function validateParams<T extends FunctionParams>(
  params: unknown,
  schema: JSONSchema
): params is T {
  // Реализация валидации JSON Schema
  return ajv.validate(schema, params);
}
```

### 3. Ограничение скорости

```python  theme={null}
from functools import wraps
import time

def rate_limit(calls_per_second=1):
    min_interval = 1.0 / calls_per_second
    last_called = [0.0]

    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            elapsed = time.time() - last_called[0]
            left_to_wait = min_interval - elapsed
            if left_to_wait > 0:
                time.sleep(left_to_wait)
            ret = func(*args, **kwargs)
            last_called[0] = time.time()
            return ret
        return wrapper
    return decorator

@rate_limit(calls_per_second=10)
def call_external_api():
    # Ваш API-вызов
    pass
```

## Потоковая передача с функциями

Комбинирование потоковой передачи с вызовом функций:

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

    # Проверка вызовов инструментов в потоке
    if delta.tool_calls:
        if function_call is None:
            function_call = {
                "id": "",
                "name": "",
                "arguments": ""
            }

        tool_call = delta.tool_calls[0]
        if tool_call.id:
            function_call["id"] = tool_call.id
        if tool_call.function.name:
            function_call["name"] = tool_call.function.name
        if tool_call.function.arguments:
            function_call["arguments"] += tool_call.function.arguments

    # Когда вызов функции завершен
    if function_call and chunk.choices[0].finish_reason == "tool_calls":
        # Выполнить функцию
        result = execute_function(function_call)
        # Продолжить разговор с результатом
```

## Следующие шаги

* Реализуйте [структурированный вывод](/ru/openai/structured-output) для валидированных ответов
* Изучите [эмбеддинги](/ru/openai/embeddings) для семантического поиска
* Узнайте о [моделях](/ru/openai/models), доступных для различных случаев использования


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt