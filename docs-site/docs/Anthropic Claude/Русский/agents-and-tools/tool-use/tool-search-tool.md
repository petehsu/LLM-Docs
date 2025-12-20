# Инструмент поиска инструментов

Инструмент поиска инструментов позволяет Claude работать с сотнями или тысячами инструментов, динамически обнаруживая и загружая их по требованию.

---

Инструмент поиска инструментов позволяет Claude работать с сотнями или тысячами инструментов, динамически обнаруживая и загружая их по требованию. Вместо загрузки всех определений инструментов в контекстное окно заранее, Claude ищет в вашем каталоге инструментов — включая названия инструментов, описания, названия аргументов и описания аргументов — и загружает только необходимые ему инструменты.

Этот подход решает две критические проблемы по мере масштабирования библиотек инструментов:

- **Эффективность контекста**: Определения инструментов могут занимать огромные части вашего контекстного окна (50 инструментов ≈ 10-20K токенов), оставляя меньше места для фактической работы
- **Точность выбора инструмента**: Способность Claude правильно выбирать инструменты значительно снижается при наличии более 30-50 обычно доступных инструментов

Хотя это предоставляется как серверный инструмент, вы также можете реализовать собственную функциональность поиска инструментов на стороне клиента. Подробности см. в разделе [Пользовательская реализация поиска инструментов](#custom-tool-search-implementation).

<Note>
Инструмент поиска инструментов в настоящее время находится в общественной бета-версии. Включите соответствующий [заголовок бета-версии](/docs/ru/api/beta-headers) для вашего поставщика:

| Поставщик                 | Заголовок бета-версии          | Поддерживаемые модели                  |
| ------------------------ | ------------------------------ | -------------------------------------- |
| Claude API<br/>Microsoft Foundry  | `advanced-tool-use-2025-11-20` | Claude Opus 4.5<br />Claude Sonnet 4.5 |
| Google Cloud's Vertex AI | `tool-search-tool-2025-10-19`  | Claude Opus 4.5<br />Claude Sonnet 4.5 |
| Amazon Bedrock           | `tool-search-tool-2025-10-19`  | Claude Opus 4.5                        |
</Note>

<Warning>
  На Amazon Bedrock поиск инструментов на стороне сервера доступен только через [API invoke](https://docs.aws.amazon.com/bedrock/latest/userguide/bedrock-runtime_example_bedrock-runtime_InvokeModel_AnthropicClaude_section.html),
  а не через API converse.
</Warning>

Вы также можете реализовать [поиск инструментов на стороне клиента](#custom-tool-search-implementation), возвращая блоки `tool_reference` из вашей собственной реализации поиска.

## Как работает поиск инструментов

Существует два варианта поиска инструментов:

- **Regex** (`tool_search_tool_regex_20251119`): Claude создает шаблоны regex для поиска инструментов
- **BM25** (`tool_search_tool_bm25_20251119`): Claude использует запросы на естественном языке для поиска инструментов

Когда вы включаете инструмент поиска инструментов:

1. Вы включаете инструмент поиска инструментов (например, `tool_search_tool_regex_20251119` или `tool_search_tool_bm25_20251119`) в список инструментов
2. Вы предоставляете все определения инструментов с `defer_loading: true` для инструментов, которые не должны загружаться немедленно
3. Claude изначально видит только инструмент поиска инструментов и любые неотложенные инструменты
4. Когда Claude нужны дополнительные инструменты, он выполняет поиск с помощью инструмента поиска инструментов
5. API возвращает 3-5 наиболее релевантных блоков `tool_reference`
6. Эти ссылки автоматически расширяются в полные определения инструментов
7. Claude выбирает из обнаруженных инструментов и вызывает их

Это сохраняет ваше контекстное окно эффективным, сохраняя при этом высокую точность выбора инструмента.

## Быстрый старт

Вот простой пример с отложенными инструментами:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: advanced-tool-use-2025-11-20" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5-20250929",
        "max_tokens": 2048,
        "messages": [
            {
                "role": "user",
                "content": "What is the weather in San Francisco?"
            }
        ],
        "tools": [
            {
                "type": "tool_search_tool_regex_20251119",
                "name": "tool_search_tool_regex"
            },
            {
                "name": "get_weather",
                "description": "Get the weather at a specific location",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "location": {"type": "string"},
                        "unit": {
                            "type": "string",
                            "enum": ["celsius", "fahrenheit"]
                        }
                    },
                    "required": ["location"]
                },
                "defer_loading": true
            },
            {
                "name": "search_files",
                "description": "Search through files in the workspace",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "query": {"type": "string"},
                        "file_types": {
                            "type": "array",
                            "items": {"type": "string"}
                        }
                    },
                    "required": ["query"]
                },
                "defer_loading": true
            }
        ]
    }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=2048,
    messages=[
        {
            "role": "user",
            "content": "What is the weather in San Francisco?"
        }
    ],
    tools=[
        {
            "type": "tool_search_tool_regex_20251119",
            "name": "tool_search_tool_regex"
        },
        {
            "name": "get_weather",
            "description": "Get the weather at a specific location",
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {"type": "string"},
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"]
                    }
                },
                "required": ["location"]
            },
            "defer_loading": True
        },
        {
            "name": "search_files",
            "description": "Search through files in the workspace",
            "input_schema": {
                "type": "object",
                "properties": {
                    "query": {"type": "string"},
                    "file_types": {
                        "type": "array",
                        "items": {"type": "string"}
                    }
                },
                "required": ["query"]
            },
            "defer_loading": True
        }
    ]
)

print(response)
```

```typescript TypeScript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

async function main() {
  const response = await client.beta.messages.create({
    model: "claude-sonnet-4-5-20250929",
    betas: ["advanced-tool-use-2025-11-20"],
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: "What is the weather in San Francisco?",
      },
    ],
    tools: [
      {
        type: "tool_search_tool_regex_20251119",
        name: "tool_search_tool_regex",
      },
      {
        name: "get_weather",
        description: "Get the weather at a specific location",
        input_schema: {
          type: "object",
          properties: {
            location: { type: "string" },
            unit: {
              type: "string",
              enum: ["celsius", "fahrenheit"],
            },
          },
          required: ["location"],
        },
        defer_loading: true,
      },
      {
        name: "search_files",
        description: "Search through files in the workspace",
        input_schema: {
          type: "object",
          properties: {
            query: { type: "string" },
            file_types: {
              type: "array",
              items: { type: "string" },
            },
          },
          required: ["query"],
        },
        defer_loading: true,
      },
    ],
  });

  console.log(JSON.stringify(response, null, 2));
}

main();
```

</CodeGroup>

## Определение инструмента

Инструмент поиска инструментов имеет два варианта:

```json JSON
{
  "type": "tool_search_tool_regex_20251119",
  "name": "tool_search_tool_regex"
}
```

```json JSON
{
  "type": "tool_search_tool_bm25_20251119",
  "name": "tool_search_tool_bm25"
}
```

<Warning>
**Формат запроса варианта Regex: Python regex, НЕ естественный язык**

При использовании `tool_search_tool_regex_20251119` Claude создает шаблоны regex, используя синтаксис `re.search()` Python, а не запросы на естественном языке. Общие шаблоны:

- `"weather"` - совпадает с названиями/описаниями инструментов, содержащими "weather"
- `"get_.*_data"` - совпадает с инструментами типа `get_user_data`, `get_weather_data`
- `"database.*query|query.*database"` - шаблоны ИЛИ для гибкости
- `"(?i)slack"` - поиск без учета регистра

Максимальная длина запроса: 200 символов

</Warning>

<Note>
**Формат запроса варианта BM25: Естественный язык**

При использовании `tool_search_tool_bm25_20251119` Claude использует запросы на естественном языке для поиска инструментов.

</Note>

### Отложенная загрузка инструментов

Отметьте инструменты для загрузки по требованию, добавив `defer_loading: true`:

```json JSON
{
  "name": "get_weather",
  "description": "Get current weather for a location",
  "input_schema": {
    "type": "object",
    "properties": {
      "location": { "type": "string" },
      "unit": { "type": "string", "enum": ["celsius", "fahrenheit"] }
    },
    "required": ["location"]
  },
  "defer_loading": true
}
```

**Ключевые моменты:**

- Инструменты без `defer_loading` загружаются в контекст немедленно
- Инструменты с `defer_loading: true` загружаются только когда Claude обнаруживает их через поиск
- Сам инструмент поиска инструментов **никогда** не должен иметь `defer_loading: true`
- Сохраняйте 3-5 наиболее часто используемых инструментов как неотложенные для оптимальной производительности

Оба варианта поиска инструментов (`regex` и `bm25`) ищут названия инструментов, описания, названия аргументов и описания аргументов.

## Формат ответа

Когда Claude использует инструмент поиска инструментов, ответ включает новые типы блоков:

```json JSON
{
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "I'll search for tools to help with the weather information."
    },
    {
      "type": "server_tool_use",
      "id": "srvtoolu_01ABC123",
      "name": "tool_search_tool_regex",
      "input": {
        "query": "weather"
      }
    },
    {
      "type": "tool_search_tool_result",
      "tool_use_id": "srvtoolu_01ABC123",
      "content": {
        "type": "tool_search_tool_search_result",
        "tool_references": [{ "type": "tool_reference", "tool_name": "get_weather" }]
      }
    },
    {
      "type": "text",
      "text": "I found a weather tool. Let me get the weather for San Francisco."
    },
    {
      "type": "tool_use",
      "id": "toolu_01XYZ789",
      "name": "get_weather",
      "input": { "location": "San Francisco", "unit": "fahrenheit" }
    }
  ],
  "stop_reason": "tool_use"
}
```

### Понимание ответа

- **`server_tool_use`**: Указывает, что Claude вызывает инструмент поиска инструментов
- **`tool_search_tool_result`**: Содержит результаты поиска с вложенным объектом `tool_search_tool_search_result`
- **`tool_references`**: Массив объектов `tool_reference`, указывающих на обнаруженные инструменты
- **`tool_use`**: Claude вызывает обнаруженный инструмент

Блоки `tool_reference` автоматически расширяются в полные определения инструментов перед отображением Claude. Вам не нужно самостоятельно обрабатывать это расширение. Это происходит автоматически в API, пока вы предоставляете все соответствующие определения инструментов в параметре `tools`.

## Интеграция MCP

Инструмент поиска инструментов работает с [серверами MCP](/docs/ru/agents-and-tools/mcp-connector). Добавьте [заголовок бета-версии](/docs/ru/api/beta-headers) `"mcp-client-2025-11-20"` в ваш запрос API, а затем используйте `mcp_toolset` с `default_config` для отложенной загрузки инструментов MCP:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
  --header "x-api-key: $ANTHROPIC_API_KEY" \
  --header "anthropic-version: 2023-06-01" \
  --header "anthropic-beta: advanced-tool-use-2025-11-20,mcp-client-2025-11-20" \
  --header "content-type: application/json" \
  --data '{
    "model": "claude-sonnet-4-5-20250929",
    "max_tokens": 2048,
    "mcp_servers": [
      {
        "type": "url",
        "name": "database-server",
        "url": "https://mcp-db.example.com"
      }
    ],
    "tools": [
      {
        "type": "tool_search_tool_regex_20251119",
        "name": "tool_search_tool_regex"
      },
      {
        "type": "mcp_toolset",
        "mcp_server_name": "database-server",
        "default_config": {
          "defer_loading": true
        },
        "configs": {
          "search_events": {
            "defer_loading": false
          }
        }
      }
    ],
    "messages": [
      {
        "role": "user",
        "content": "What events are in my database?"
      }
    ]
  }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    betas=["advanced-tool-use-2025-11-20", "mcp-client-2025-11-20"],
    max_tokens=2048,
    mcp_servers=[
        {
            "type": "url",
            "name": "database-server",
            "url": "https://mcp-db.example.com"
        }
    ],
    tools=[
        {
            "type": "tool_search_tool_regex_20251119",
            "name": "tool_search_tool_regex"
        },
        {
            "type": "mcp_toolset",
            "mcp_server_name": "database-server",
            "default_config": {
                "defer_loading": True
            },
            "configs": {
                "search_events": {
                    "defer_loading": False
                }
            }
        }
    ],
    messages=[
        {
            "role": "user",
            "content": "What events are in my database?"
        }
    ]
)

print(response)
```

```typescript TypeScript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

async function main() {
  const response = await client.beta.messages.create({
    model: "claude-sonnet-4-5-20250929",
    betas: ["advanced-tool-use-2025-11-20", "mcp-client-2025-11-20"],
    max_tokens: 2048,
    mcp_servers: [
      {
        type: "url",
        name: "database-server",
        url: "https://mcp-db.example.com",
      },
    ],
    tools: [
      {
        type: "tool_search_tool_regex_20251119",
        name: "tool_search_tool_regex",
      },
      {
        type: "mcp_toolset",
        mcp_server_name: "database-server",
        default_config: {
          defer_loading: true,
        },
        configs: {
          search_events: {
            defer_loading: false,
          },
        },
      },
    ],
    messages: [
      {
        role: "user",
        content: "What events are in my database?",
      },
    ],
  });

  console.log(JSON.stringify(response, null, 2));
}

main();
```

</CodeGroup>

**Опции конфигурации MCP:**

- `default_config.defer_loading`: Установить значение по умолчанию для всех инструментов с сервера MCP
- `configs`: Переопределить значения по умолчанию для конкретных инструментов по имени
- Объедините несколько серверов MCP с поиском инструментов для массивных библиотек инструментов

## Пользовательская реализация поиска инструментов

Вы можете реализовать собственную логику поиска инструментов (например, используя встраивания или семантический поиск), возвращая блоки `tool_reference` из пользовательского инструмента:

```json JSON
{
  "type": "tool_search_tool_result",
  "tool_use_id": "toolu_custom_search",
  "content": {
    "type": "tool_search_tool_search_result",
    "tool_references": [{ "type": "tool_reference", "tool_name": "discovered_tool_name" }]
  }
}
```

Каждый инструмент, на который есть ссылка, должен иметь соответствующее определение инструмента в параметре верхнего уровня `tools` с `defer_loading: true`. Этот подход позволяет вам использовать более сложные алгоритмы поиска, сохраняя совместимость с системой поиска инструментов.

Полный пример с использованием встраиваний см. в нашем [руководстве по поиску инструментов с встраиваниями](https://github.com/anthropics/anthropic-cookbook).

## Обработка ошибок

<Note>
  Инструмент поиска инструментов несовместим с [примерами использования инструментов](/docs/ru/agents-and-tools/tool-use/implement-tool-use#providing-tool-use-examples).
  Если вам нужно предоставить примеры использования инструментов, используйте стандартный вызов инструментов
  без поиска инструментов.
</Note>

### Ошибки HTTP (статус 400)

Эти ошибки предотвращают обработку запроса:

**Все инструменты отложены:**

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "All tools have defer_loading set. At least one tool must be non-deferred."
  }
}
```

**Отсутствует определение инструмента:**

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "Tool reference 'unknown_tool' has no corresponding tool definition"
  }
}
```

### Ошибки результата инструмента (статус 200)

Ошибки во время выполнения инструмента возвращают ответ 200 с информацией об ошибке в теле:

```json JSON
{
  "type": "tool_result",
  "tool_use_id": "srvtoolu_01ABC123",
  "content": {
    "type": "tool_search_tool_result_error",
    "error_code": "invalid_pattern"
  }
}
```

**Коды ошибок:**

- `too_many_requests`: Превышен лимит частоты запросов для операций поиска инструментов
- `invalid_pattern`: Неправильный шаблон regex
- `pattern_too_long`: Шаблон превышает лимит в 200 символов
- `unavailable`: Сервис поиска инструментов временно недоступен

### Распространенные ошибки

<section title="Ошибка 400: Все инструменты отложены">

**Причина**: Вы установили `defer_loading: true` на ВСЕ инструменты, включая инструмент поиска

**Исправление**: Удалите `defer_loading` из инструмента поиска инструментов:

```json
{
  "type": "tool_search_tool_regex_20251119", // Здесь нет defer_loading
  "name": "tool_search_tool_regex"
}
```

</section>

<section title="Ошибка 400: Отсутствует определение инструмента">

**Причина**: `tool_reference` указывает на инструмент, которого нет в вашем массиве `tools`

**Исправление**: Убедитесь, что каждый инструмент, который может быть обнаружен, имеет полное определение:

```json
{
  "name": "my_tool",
  "description": "Full description here",
  "input_schema": {
    /* complete schema */
  },
  "defer_loading": true
}
```

</section>

<section title="Claude не находит ожидаемые инструменты">

**Причина**: Названия или описания инструментов не совпадают с шаблоном regex

**Шаги отладки:**

1. Проверьте название и описание инструмента — Claude ищет в ОБОИХ полях
2. Протестируйте ваш шаблон: `import re; re.search(r"your_pattern", "tool_name")`
3. Помните, что поиск чувствителен к регистру по умолчанию (используйте `(?i)` для поиска без учета регистра)
4. Claude использует широкие шаблоны типа `".*weather.*"`, а не точные совпадения

**Совет**: Добавьте общие ключевые слова в описания инструментов для улучшения обнаруживаемости

</section>

## Кэширование подсказок

Поиск инструментов работает с [кэшированием подсказок](/docs/ru/build-with-claude/prompt-caching). Добавьте точки разрыва `cache_control` для оптимизации многооборотных разговоров:

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# First request with tool search
messages = [
    {
        "role": "user",
        "content": "What's the weather in Seattle?"
    }
]

response1 = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=2048,
    messages=messages,
    tools=[
        {
            "type": "tool_search_tool_regex_20251119",
            "name": "tool_search_tool_regex"
        },
        {
            "name": "get_weather",
            "description": "Get weather for a location",
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {"type": "string"}
                },
                "required": ["location"]
            },
            "defer_loading": True
        }
    ]
)

# Add Claude's response to conversation
messages.append({
    "role": "assistant",
    "content": response1.content
})

# Second request with cache breakpoint
messages.append({
    "role": "user",
    "content": "What about New York?",
    "cache_control": {"type": "ephemeral"}
})

response2 = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=2048,
    messages=messages,
    tools=[
        {
            "type": "tool_search_tool_regex_20251119",
            "name": "tool_search_tool_regex"
        },
        {
            "name": "get_weather",
            "description": "Get weather for a location",
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {"type": "string"}
                },
                "required": ["location"]
            },
            "defer_loading": True
        }
    ]
)

print(f"Cache read tokens: {response2.usage.get('cache_read_input_tokens', 0)}")
```
</CodeGroup>

Система автоматически расширяет блоки tool_reference на протяжении всей истории разговора, поэтому Claude может повторно использовать обнаруженные инструменты в последующих ходах без повторного поиска.

## Потоковая передача

При включенной потоковой передаче вы будете получать события поиска инструментов как часть потока:

```javascript
event: content_block_start
data: {"type": "content_block_start", "index": 1, "content_block": {"type": "server_tool_use", "id": "srvtoolu_xyz789", "name": "tool_search_tool_regex"}}

// Search query streamed
event: content_block_delta
data: {"type": "content_block_delta", "index": 1, "delta": {"type": "input_json_delta", "partial_json": "{\"query\":\"weather\"}"}}

// Pause while search executes

// Search results streamed
event: content_block_start
data: {"type": "content_block_start", "index": 2, "content_block": {"type": "tool_search_tool_result", "tool_use_id": "srvtoolu_xyz789", "content": {"type": "tool_search_tool_search_result", "tool_references": [{"type": "tool_reference", "tool_name": "get_weather"}]}}}

// Claude continues with discovered tools
```

## Пакетные запросы

Вы можете включить инструмент поиска инструментов в [API пакетных сообщений](/docs/ru/build-with-claude/batch-processing). Операции поиска инструментов через API пакетных сообщений оцениваются так же, как в обычных запросах API сообщений.

## Ограничения и лучшие практики

### Ограничения

- **Максимум инструментов**: 10 000 инструментов в вашем каталоге
- **Результаты поиска**: Возвращает 3-5 наиболее релевантных инструментов за поиск
- **Длина шаблона**: Максимум 200 символов для шаблонов regex
- **Поддержка модели**: Только Sonnet 4.0+, Opus 4.0+ (без Haiku)

### Когда использовать поиск инструментов

**Хорошие варианты использования:**

- 10+ инструментов доступны в вашей системе
- Определения инструментов потребляют >10K токенов
- Возникают проблемы с точностью выбора инструмента с большими наборами инструментов
- Создание систем на основе MCP с несколькими серверами (200+ инструментов)
- Библиотека инструментов растет со временем

**Когда традиционный вызов инструментов может быть лучше:**

- Менее 10 инструментов всего
- Все инструменты часто используются в каждом запросе
- Очень маленькие определения инструментов (\<100 токенов всего)

### Советы по оптимизации

- Сохраняйте 3-5 наиболее часто используемых инструментов как неотложенные
- Пишите четкие, описательные названия и описания инструментов
- Используйте семантические ключевые слова в описаниях, которые соответствуют тому, как пользователи описывают задачи
- Добавьте раздел системной подсказки, описывающий доступные категории инструментов: "Вы можете искать инструменты для взаимодействия со Slack, GitHub и Jira"
- Отслеживайте, какие инструменты Claude обнаруживает, чтобы уточнить описания

## Использование

Использование инструмента поиска инструментов отслеживается в объекте использования ответа:

```json JSON
{
  "usage": {
    "input_tokens": 1024,
    "output_tokens": 256,
    "server_tool_use": {
      "tool_search_requests": 2
    }
  }
}
```