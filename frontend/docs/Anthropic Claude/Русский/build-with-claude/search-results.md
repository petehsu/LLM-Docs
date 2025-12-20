# Результаты поиска

Включите естественные цитирования для приложений RAG, предоставляя результаты поиска с указанием источников

---

Блоки содержимого результатов поиска обеспечивают естественное цитирование с надлежащим указанием источников, привнося цитирования качества веб-поиска в ваши пользовательские приложения. Эта функция особенно мощна для приложений RAG (Retrieval-Augmented Generation), где вам нужно, чтобы Claude точно указывал источники.

Функция результатов поиска доступна на следующих моделях:

- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)
- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Sonnet 3.7 ([устарела](/docs/ru/about-claude/model-deprecations)) (`claude-3-7-sonnet-20250219`)
- Claude 3.5 Haiku (`claude-3-5-haiku-20241022`)

## Ключевые преимущества

- **Естественное цитирование** - Достигните того же качества цитирования, что и веб-поиск, для любого содержимого
- **Гибкая интеграция** - Используйте в возвращаемых значениях инструментов для динамического RAG или как содержимое верхнего уровня для предварительно загруженных данных
- **Надлежащее указание источников** - Каждый результат включает информацию об источнике и названии для четкого указания источников
- **Не требуются обходные решения на основе документов** - Исключает необходимость в обходных решениях на основе документов
- **Согласованный формат цитирования** - Соответствует качеству и формату цитирования функции веб-поиска Claude

## Как это работает

Результаты поиска можно предоставить двумя способами:

1. **Из вызовов инструментов** - Ваши пользовательские инструменты возвращают результаты поиска, обеспечивая динамические приложения RAG
2. **Как содержимое верхнего уровня** - Вы предоставляете результаты поиска непосредственно в сообщениях пользователя для предварительно загруженного или кэшированного содержимого

В обоих случаях Claude может автоматически цитировать информацию из результатов поиска с надлежащим указанием источников.

### Схема результата поиска

Результаты поиска используют следующую структуру:

```json
{
  "type": "search_result",
  "source": "https://example.com/article",  // Обязательно: URL источника или идентификатор
  "title": "Article Title",                  // Обязательно: Название результата
  "content": [                               // Обязательно: Массив текстовых блоков
    {
      "type": "text",
      "text": "The actual content of the search result..."
    }
  ],
  "citations": {                             // Опционально: Конфигурация цитирования
    "enabled": true                          // Включить/отключить цитирования для этого результата
  }
}
```

### Обязательные поля

| Поле | Тип | Описание |
|-------|------|-------------|
| `type` | string | Должно быть `"search_result"` |
| `source` | string | URL источника или идентификатор содержимого |
| `title` | string | Описательное название для результата поиска |
| `content` | array | Массив текстовых блоков, содержащих фактическое содержимое |

### Опциональные поля

| Поле | Тип | Описание |
|-------|------|-------------|
| `citations` | object | Конфигурация цитирования с логическим полем `enabled` |
| `cache_control` | object | Параметры управления кэшем (например, `{"type": "ephemeral"}`) |

Каждый элемент в массиве `content` должен быть текстовым блоком с:
- `type`: Должно быть `"text"`
- `text`: Фактическое текстовое содержимое (непустая строка)

## Метод 1: Результаты поиска из вызовов инструментов

Наиболее мощный вариант использования - возврат результатов поиска из ваших пользовательских инструментов. Это обеспечивает динамические приложения RAG, где инструменты получают и возвращают релевантное содержимое с автоматическим цитированием.

### Пример: Инструмент базы знаний

<CodeGroup>
```python Python
from anthropic import Anthropic
from anthropic.types import (
    MessageParam,
    TextBlockParam,
    SearchResultBlockParam,
    ToolResultBlockParam
)

client = Anthropic()

# Define a knowledge base search tool
knowledge_base_tool = {
    "name": "search_knowledge_base",
    "description": "Search the company knowledge base for information",
    "input_schema": {
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "The search query"
            }
        },
        "required": ["query"]
    }
}

# Function to handle the tool call
def search_knowledge_base(query):
    # Your search logic here
    # Returns search results in the correct format
    return [
        SearchResultBlockParam(
            type="search_result",
            source="https://docs.company.com/product-guide",
            title="Product Configuration Guide",
            content=[
                TextBlockParam(
                    type="text",
                    text="To configure the product, navigate to Settings > Configuration. The default timeout is 30 seconds, but can be adjusted between 10-120 seconds based on your needs."
                )
            ],
            citations={"enabled": True}
        ),
        SearchResultBlockParam(
            type="search_result",
            source="https://docs.company.com/troubleshooting",
            title="Troubleshooting Guide",
            content=[
                TextBlockParam(
                    type="text",
                    text="If you encounter timeout errors, first check the configuration settings. Common causes include network latency and incorrect timeout values."
                )
            ],
            citations={"enabled": True}
        )
    ]

# Create a message with the tool
response = client.messages.create(
    model="claude-sonnet-4-5",  # Works with all supported models
    max_tokens=1024,
    tools=[knowledge_base_tool],
    messages=[
        MessageParam(
            role="user",
            content="How do I configure the timeout settings?"
        )
    ]
)

# When Claude calls the tool, provide the search results
if response.content[0].type == "tool_use":
    tool_result = search_knowledge_base(response.content[0].input["query"])
    
    # Send the tool result back
    final_response = client.messages.create(
        model="claude-sonnet-4-5",  # Works with all supported models
        max_tokens=1024,
        messages=[
            MessageParam(role="user", content="How do I configure the timeout settings?"),
            MessageParam(role="assistant", content=response.content),
            MessageParam(
                role="user",
                content=[
                    ToolResultBlockParam(
                        type="tool_result",
                        tool_use_id=response.content[0].id,
                        content=tool_result  # Search results go here
                    )
                ]
            )
        ]
    )
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

// Define a knowledge base search tool
const knowledgeBaseTool = {
  name: "search_knowledge_base",
  description: "Search the company knowledge base for information",
  input_schema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "The search query"
      }
    },
    required: ["query"]
  }
};

// Function to handle the tool call
function searchKnowledgeBase(query: string) {
  // Your search logic here
  // Returns search results in the correct format
  return [
    {
      type: "search_result" as const,
      source: "https://docs.company.com/product-guide",
      title: "Product Configuration Guide",
      content: [
        {
          type: "text" as const,
          text: "To configure the product, navigate to Settings > Configuration. The default timeout is 30 seconds, but can be adjusted between 10-120 seconds based on your needs."
        }
      ],
      citations: { enabled: true }
    },
    {
      type: "search_result" as const,
      source: "https://docs.company.com/troubleshooting",
      title: "Troubleshooting Guide",
      content: [
        {
          type: "text" as const,
          text: "If you encounter timeout errors, first check the configuration settings. Common causes include network latency and incorrect timeout values."
        }
      ],
      citations: { enabled: true }
    }
  ];
}

// Create a message with the tool
const response = await anthropic.messages.create({
  model: "claude-sonnet-4-5", // Works with all supported models
  max_tokens: 1024,
  tools: [knowledgeBaseTool],
  messages: [
    {
      role: "user",
      content: "How do I configure the timeout settings?"
    }
  ]
});

// Handle tool use and provide results
if (response.content[0].type === "tool_use") {
  const toolResult = searchKnowledgeBase(response.content[0].input.query);
  
  const finalResponse = await anthropic.messages.create({
    model: "claude-sonnet-4-5", // Works with all supported models
    max_tokens: 1024,
      messages: [
      { role: "user", content: "How do I configure the timeout settings?" },
      { role: "assistant", content: response.content },
      {
        role: "user",
        content: [
          {
            type: "tool_result" as const,
            tool_use_id: response.content[0].id,
            content: toolResult  // Search results go here
          }
        ]
      }
    ]
  });
}
```
</CodeGroup>

## Метод 2: Результаты поиска как содержимое верхнего уровня

Вы также можете предоставить результаты поиска непосредственно в сообщениях пользователя. Это полезно для:
- Предварительно загруженного содержимого из вашей инфраструктуры поиска
- Кэшированных результатов поиска из предыдущих запросов
- Содержимого из внешних служб поиска
- Тестирования и разработки

### Пример: Прямые результаты поиска

<CodeGroup>
```python Python
from anthropic import Anthropic
from anthropic.types import (
    MessageParam,
    TextBlockParam,
    SearchResultBlockParam
)

client = Anthropic()

# Provide search results directly in the user message
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        MessageParam(
            role="user",
            content=[
                SearchResultBlockParam(
                    type="search_result",
                    source="https://docs.company.com/api-reference",
                    title="API Reference - Authentication",
                    content=[
                        TextBlockParam(
                            type="text",
                            text="All API requests must include an API key in the Authorization header. Keys can be generated from the dashboard. Rate limits: 1000 requests per hour for standard tier, 10000 for premium."
                        )
                    ],
                    citations={"enabled": True}
                ),
                SearchResultBlockParam(
                    type="search_result",
                    source="https://docs.company.com/quickstart",
                    title="Getting Started Guide",
                    content=[
                        TextBlockParam(
                            type="text",
                            text="To get started: 1) Sign up for an account, 2) Generate an API key from the dashboard, 3) Install our SDK using pip install company-sdk, 4) Initialize the client with your API key."
                        )
                    ],
                    citations={"enabled": True}
                ),
                TextBlockParam(
                    type="text",
                    text="Based on these search results, how do I authenticate API requests and what are the rate limits?"
                )
            ]
        )
    ]
)

print(response.model_dump_json(indent=2))
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

// Provide search results directly in the user message
const response = await anthropic.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: [
        {
          type: "search_result" as const,
          source: "https://docs.company.com/api-reference",
          title: "API Reference - Authentication",
          content: [
            {
              type: "text" as const,
              text: "All API requests must include an API key in the Authorization header. Keys can be generated from the dashboard. Rate limits: 1000 requests per hour for standard tier, 10000 for premium."
            }
          ],
          citations: { enabled: true }
        },
        {
          type: "search_result" as const,
          source: "https://docs.company.com/quickstart",
          title: "Getting Started Guide",
          content: [
            {
              type: "text" as const,
              text: "To get started: 1) Sign up for an account, 2) Generate an API key from the dashboard, 3) Install our SDK using pip install company-sdk, 4) Initialize the client with your API key."
            }
          ],
          citations: { enabled: true }
        },
        {
          type: "text" as const,
          text: "Based on these search results, how do I authenticate API requests and what are the rate limits?"
        }
      ]
    }
  ]
});

console.log(response);
```

```bash Shell
#!/bin/sh
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "search_result",
                    "source": "https://docs.company.com/api-reference",
                    "title": "API Reference - Authentication",
                    "content": [
                        {
                            "type": "text",
                            "text": "All API requests must include an API key in the Authorization header. Keys can be generated from the dashboard. Rate limits: 1000 requests per hour for standard tier, 10000 for premium."
                        }
                    ],
                    "citations": {
                        "enabled": true
                    }
                },
                {
                    "type": "search_result",
                    "source": "https://docs.company.com/quickstart",
                    "title": "Getting Started Guide",
                    "content": [
                        {
                            "type": "text",
                            "text": "To get started: 1) Sign up for an account, 2) Generate an API key from the dashboard, 3) Install our SDK using pip install company-sdk, 4) Initialize the client with your API key."
                        }
                    ],
                    "citations": {
                        "enabled": true
                    }
                },
                {
                    "type": "text",
                    "text": "Based on these search results, how do I authenticate API requests and what are the rate limits?"
                }
            ]
        }
    ]
}'
```
</CodeGroup>

## Ответ Claude с цитированиями

Независимо от того, как предоставляются результаты поиска, Claude автоматически включает цитирования при использовании информации из них:

```json
{
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "To authenticate API requests, you need to include an API key in the Authorization header",
      "citations": [
        {
          "type": "search_result_location",
          "source": "https://docs.company.com/api-reference",
          "title": "API Reference - Authentication",
          "cited_text": "All API requests must include an API key in the Authorization header",
          "search_result_index": 0,
          "start_block_index": 0,
          "end_block_index": 0
        }
      ]
    },
    {
      "type": "text",
      "text": ". You can generate API keys from your dashboard",
      "citations": [
        {
          "type": "search_result_location",
          "source": "https://docs.company.com/api-reference",
          "title": "API Reference - Authentication",
          "cited_text": "Keys can be generated from the dashboard",
          "search_result_index": 0,
          "start_block_index": 0,
          "end_block_index": 0
        }
      ]
    },
    {
      "type": "text",
      "text": ". The rate limits are 1,000 requests per hour for the standard tier and 10,000 requests per hour for the premium tier.",
      "citations": [
        {
          "type": "search_result_location",
          "source": "https://docs.company.com/api-reference",
          "title": "API Reference - Authentication",
          "cited_text": "Rate limits: 1000 requests per hour for standard tier, 10000 for premium",
          "search_result_index": 0,
          "start_block_index": 0,
          "end_block_index": 0
        }
      ]
    }
  ]
}
```

### Поля цитирования

Каждое цитирование включает:

| Поле | Тип | Описание |
|-------|------|-------------|
| `type` | string | Всегда `"search_result_location"` для цитирований результатов поиска |
| `source` | string | Источник из исходного результата поиска |
| `title` | string или null | Название из исходного результата поиска |
| `cited_text` | string | Точный цитируемый текст |
| `search_result_index` | integer | Индекс результата поиска (начиная с 0) |
| `start_block_index` | integer | Начальная позиция в массиве содержимого |
| `end_block_index` | integer | Конечная позиция в массиве содержимого |

Примечание: `search_result_index` относится к индексу блока содержимого результата поиска (начиная с 0), независимо от того, как были предоставлены результаты поиска (вызов инструмента или содержимое верхнего уровня).

## Несколько блоков содержимого

Результаты поиска могут содержать несколько текстовых блоков в массиве `content`:

```json
{
  "type": "search_result",
  "source": "https://docs.company.com/api-guide",
  "title": "API Documentation",
  "content": [
    {
      "type": "text",
      "text": "Authentication: All API requests require an API key."
    },
    {
      "type": "text",
      "text": "Rate Limits: The API allows 1000 requests per hour per key."
    },
    {
      "type": "text",
      "text": "Error Handling: The API returns standard HTTP status codes."
    }
  ]
}
```

Claude может цитировать конкретные блоки, используя поля `start_block_index` и `end_block_index`.

## Продвинутое использование

### Комбинирование обоих методов

Вы можете использовать результаты поиска на основе инструментов и содержимое верхнего уровня в одном разговоре:

```python
# First message with top-level search results
messages = [
    MessageParam(
        role="user",
        content=[
            SearchResultBlockParam(
                type="search_result",
                source="https://docs.company.com/overview",
                title="Product Overview",
                content=[
                    TextBlockParam(type="text", text="Our product helps teams collaborate...")
                ],
                citations={"enabled": True}
            ),
            TextBlockParam(
                type="text",
                text="Tell me about this product and search for pricing information"
            )
        ]
    )
]

# Claude might respond and call a tool to search for pricing
# Then you provide tool results with more search results
```

### Комбинирование с другими типами содержимого

Оба метода поддерживают смешивание результатов поиска с другим содержимым:

```python
# In tool results
tool_result = [
    SearchResultBlockParam(
        type="search_result",
        source="https://docs.company.com/guide",
        title="User Guide",
        content=[TextBlockParam(type="text", text="Configuration details...")],
        citations={"enabled": True}
    ),
    TextBlockParam(
        type="text",
        text="Additional context: This applies to version 2.0 and later."
    )
]

# In top-level content
user_content = [
    SearchResultBlockParam(
        type="search_result",
        source="https://research.com/paper",
        title="Research Paper",
        content=[TextBlockParam(type="text", text="Key findings...")],
        citations={"enabled": True}
    ),
    {
        "type": "image",
        "source": {"type": "url", "url": "https://example.com/chart.png"}
    },
    TextBlockParam(
        type="text",
        text="How does the chart relate to the research findings?"
    )
]
```

### Управление кэшем

Добавьте управление кэшем для лучшей производительности:

```json
{
  "type": "search_result",
  "source": "https://docs.company.com/guide",
  "title": "User Guide",
  "content": [{"type": "text", "text": "..."}],
  "cache_control": {
    "type": "ephemeral"
  }
}
```

### Управление цитированием

По умолчанию цитирования отключены для результатов поиска. Вы можете включить цитирования, явно установив конфигурацию `citations`:

```json
{
  "type": "search_result",
  "source": "https://docs.company.com/guide",
  "title": "User Guide",
  "content": [{"type": "text", "text": "Important documentation..."}],
  "citations": {
    "enabled": true  // Enable citations for this result
  }
}
```

Когда `citations.enabled` установлено на `true`, Claude будет включать ссылки на цитирования при использовании информации из результата поиска. Это обеспечивает:
- Естественное цитирование для ваших пользовательских приложений RAG
- Указание источников при взаимодействии с собственными базами знаний
- Цитирования качества веб-поиска для любого пользовательского инструмента, который возвращает результаты поиска

Если поле `citations` опущено, цитирования отключены по умолчанию.

<Warning>
Цитирования - это все или ничего: либо все результаты поиска в запросе должны иметь включенные цитирования, либо все должны иметь их отключенными. Смешивание результатов поиска с разными параметрами цитирования приведет к ошибке. Если вам нужно отключить цитирования для некоторых источников, вы должны отключить их для всех результатов поиска в этом запросе.
</Warning>

## Лучшие практики

### Для поиска на основе инструментов (Метод 1)

- **Динамическое содержимое**: Используйте для поиска в реальном времени и динамических приложений RAG
- **Обработка ошибок**: Возвращайте соответствующие сообщения при сбое поиска
- **Ограничения результатов**: Возвращайте только наиболее релевантные результаты, чтобы избежать переполнения контекста

### Для поиска верхнего уровня (Метод 2)

- **Предварительно загруженное содержимое**: Используйте, когда у вас уже есть результаты поиска
- **Пакетная обработка**: Идеально для обработки нескольких результатов поиска одновременно
- **Тестирование**: Отлично подходит для тестирования поведения цитирования с известным содержимым

### Общие лучшие практики

1. **Эффективно структурируйте результаты**
   - Используйте четкие, постоянные URL-адреса источников
   - Предоставляйте описательные названия
   - Разбивайте длинное содержимое на логические текстовые блоки

2. **Поддерживайте согласованность**
   - Используйте согласованные форматы источников в вашем приложении
   - Убедитесь, что названия точно отражают содержимое
   - Сохраняйте форматирование согласованным

3. **Обрабатывайте ошибки корректно**
   ```python
   def search_with_fallback(query):
       try:
           results = perform_search(query)
           if not results:
               return {"type": "text", "text": "No results found."}
           return format_as_search_results(results)
       except Exception as e:
           return {"type": "text", "text": f"Search error: {str(e)}"}
   ```

## Ограничения

- Блоки содержимого результатов поиска доступны на Claude API, Amazon Bedrock и Google Cloud's Vertex AI
- Внутри результатов поиска поддерживается только текстовое содержимое (без изображений или других медиа)
- Массив `content` должен содержать по крайней мере один текстовый блок