# Редактирование контекста

Автоматически управляйте контекстом беседы по мере его роста с помощью редактирования контекста.

---

## Обзор

Редактирование контекста позволяет автоматически управлять контекстом беседы по мере его роста, помогая вам оптимизировать затраты и оставаться в пределах лимитов контекстного окна. Вы можете использовать серверные стратегии API, функции клиентского SDK или оба подхода вместе.

| Подход | Где запускается | Стратегии | Как это работает |
|----------|---------------|------------|--------------|
| **Серверная часть** | API | Очистка результатов инструментов (`clear_tool_uses_20250919`)<br/>Очистка блоков размышлений (`clear_thinking_20251015`) | Применяется до того, как запрос достигнет Claude. Очищает определённое содержимое из истории беседы. Каждая стратегия может быть настроена независимо. |
| **Клиентская часть** | SDK | Компактизация | Доступна в [Python и TypeScript SDKs](/docs/ru/api/client-sdks) при использовании [`tool_runner`](/docs/ru/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta). Генерирует сводку и заменяет полную историю беседы. См. [Компактизация](#client-side-compaction-sdk) ниже. |

## Серверные стратегии

<Note>
Редактирование контекста в настоящее время находится в бета-версии с поддержкой очистки результатов инструментов и очистки блоков размышлений. Чтобы включить его, используйте бета-заголовок `context-management-2025-06-27` в ваших запросах API.

Пожалуйста, свяжитесь с нами через нашу [форму обратной связи](https://forms.gle/YXC2EKGMhjN1c4L88), чтобы поделиться своим мнением об этой функции.
</Note>

### Очистка результатов инструментов

Стратегия `clear_tool_uses_20250919` очищает результаты инструментов, когда контекст беседы превышает установленный вами порог. При активации API автоматически очищает самые старые результаты инструментов в хронологическом порядке, заменяя их текстом-заполнителем, чтобы Claude знал, что результат инструмента был удалён. По умолчанию очищаются только результаты инструментов. Вы можете дополнительно очистить как результаты инструментов, так и вызовы инструментов (параметры использования инструмента), установив `clear_tool_inputs` в значение true.

### Очистка блоков размышлений

Стратегия `clear_thinking_20251015` управляет блоками `thinking` в беседах, когда включено расширенное размышление. Эта стратегия автоматически очищает более старые блоки размышлений из предыдущих ходов.

<Tip>
**Поведение по умолчанию**: Когда расширенное размышление включено без настройки стратегии `clear_thinking_20251015`, API автоматически сохраняет только блоки размышлений из последнего хода ассистента (эквивалентно `keep: {type: "thinking_turns", value: 1}`).

Чтобы максимизировать попадания в кэш, сохраняйте все блоки размышлений, установив `keep: "all"`.
</Tip>

<Note>
Ход беседы ассистента может включать несколько блоков содержимого (например, при использовании инструментов) и несколько блоков размышлений (например, с [чередующимся размышлением](/docs/ru/build-with-claude/extended-thinking#interleaved-thinking)).
</Note>

<Tip>
**Редактирование контекста происходит на серверной стороне**

Редактирование контекста применяется **на серверной стороне** до того, как запрос достигнет Claude. Ваше клиентское приложение сохраняет полную, неизменённую историю беседы — вам не нужно синхронизировать состояние вашего клиента с отредактированной версией. Продолжайте управлять полной историей беседы локально, как обычно.
</Tip>

<Tip>
**Редактирование контекста и кэширование запросов**

Взаимодействие редактирования контекста с [кэшированием запросов](/docs/ru/build-with-claude/prompt-caching) варьируется в зависимости от стратегии:

- **Очистка результатов инструментов**: Инвалидирует кэшированные префиксы запросов при очистке содержимого. Чтобы учесть это, мы рекомендуем очищать достаточно токенов, чтобы инвалидация кэша была целесообразной. Используйте параметр `clear_at_least`, чтобы гарантировать, что минимальное количество токенов очищается каждый раз. Вы будете нести расходы на запись в кэш каждый раз при очистке содержимого, но последующие запросы смогут повторно использовать новый кэшированный префикс.

- **Очистка блоков размышлений**: Когда блоки размышлений **сохраняются** в контексте (не очищаются), кэш запроса сохраняется, обеспечивая попадания в кэш и снижая затраты на входные токены. Когда блоки размышлений **очищаются**, кэш инвалидируется в точке, где происходит очистка. Настройте параметр `keep` в зависимости от того, хотите ли вы приоритизировать производительность кэша или доступность контекстного окна.
</Tip>

## Поддерживаемые модели

Редактирование контекста доступно на:

- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)
- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)

## Использование очистки результатов инструментов

Самый простой способ включить очистку результатов инструментов — указать только тип стратегии, так как все остальные [параметры конфигурации](#configuration-options-for-tool-result-clearing) будут использовать свои значения по умолчанию:

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": "Search for recent developments in AI"
            }
        ],
        "tools": [
            {
                "type": "web_search_20250305",
                "name": "web_search"
            }
        ],
        "context_management": {
            "edits": [
                {"type": "clear_tool_uses_20250919"}
            ]
        }
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Search for recent developments in AI"
        }
    ],
    tools=[
        {
            "type": "web_search_20250305",
            "name": "web_search"
        }
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {"type": "clear_tool_uses_20250919"}
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [
    {
      role: "user",
      content: "Search for recent developments in AI"
    }
  ],
  tools: [
    {
      type: "web_search_20250305",
      name: "web_search"
    }
  ],
  context_management: {
    edits: [
      { type: "clear_tool_uses_20250919" }
    ]
  },
  betas: ["context-management-2025-06-27"]
});
```

</CodeGroup>

### Расширенная конфигурация

Вы можете настроить поведение очистки результатов инструментов с помощью дополнительных параметров:

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": "Create a simple command line calculator app using Python"
            }
        ],
        "tools": [
            {
                "type": "text_editor_20250728",
                "name": "str_replace_based_edit_tool",
                "max_characters": 10000
            },
            {
                "type": "web_search_20250305",
                "name": "web_search",
                "max_uses": 3
            }
        ],
        "context_management": {
            "edits": [
                {
                    "type": "clear_tool_uses_20250919",
                    "trigger": {
                        "type": "input_tokens",
                        "value": 30000
                    },
                    "keep": {
                        "type": "tool_uses",
                        "value": 3
                    },
                    "clear_at_least": {
                        "type": "input_tokens",
                        "value": 5000
                    },
                    "exclude_tools": ["web_search"]
                }
            ]
        }
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Create a simple command line calculator app using Python"
        }
    ],
    tools=[
        {
            "type": "text_editor_20250728",
            "name": "str_replace_based_edit_tool",
            "max_characters": 10000
        },
        {
            "type": "web_search_20250305",
            "name": "web_search",
            "max_uses": 3
        }
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_tool_uses_20250919",
                # Trigger clearing when threshold is exceeded
                "trigger": {
                    "type": "input_tokens",
                    "value": 30000
                },
                # Number of tool uses to keep after clearing
                "keep": {
                    "type": "tool_uses",
                    "value": 3
                },
                # Optional: Clear at least this many tokens
                "clear_at_least": {
                    "type": "input_tokens",
                    "value": 5000
                },
                # Exclude these tools from being cleared
                "exclude_tools": ["web_search"]
            }
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [
    {
      role: "user",
      content: "Create a simple command line calculator app using Python"
    }
  ],
  tools: [
    {
      type: "text_editor_20250728",
      name: "str_replace_based_edit_tool",
      max_characters: 10000
    },
    {
      type: "web_search_20250305",
      name: "web_search",
      max_uses: 3
    }
  ],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_tool_uses_20250919",
        // Trigger clearing when threshold is exceeded
        trigger: {
          type: "input_tokens",
          value: 30000
        },
        // Number of tool uses to keep after clearing
        keep: {
          type: "tool_uses",
          value: 3
        },
        // Optional: Clear at least this many tokens
        clear_at_least: {
          type: "input_tokens",
          value: 5000
        },
        // Exclude these tools from being cleared
        exclude_tools: ["web_search"]
      }
    ]
  }
});
```

</CodeGroup>

## Обзор

Редактирование контекста позволяет автоматически управлять контекстом беседы по мере его роста, помогая вам оптимизировать затраты и оставаться в пределах лимита контекстного окна. Вы можете использовать стратегии API на стороне сервера, функции SDK на стороне клиента или оба подхода вместе.

| Подход | Где выполняется | Стратегии | Как это работает |
|----------|---------------|------------|--------------|
| **На стороне сервера** | API | Очистка результатов инструментов (`clear_tool_uses_20250919`)<br/>Очистка блоков размышлений (`clear_thinking_20251015`) | Применяется до того, как запрос достигнет Claude. Очищает определённое содержимое из истории беседы. Каждую стратегию можно настроить независимо. |
| **На стороне клиента** | SDK | Компактизация | Доступна в [Python и TypeScript SDK](/docs/ru/api/client-sdks) при использовании [`tool_runner`](/docs/ru/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta). Генерирует сводку и заменяет полную историю беседы. См. [Компактизация](#client-side-compaction-sdk) ниже. |

## Стратегии на стороне сервера

<Note>
Редактирование контекста в настоящее время находится в бета-версии с поддержкой очистки результатов инструментов и очистки блоков размышлений. Чтобы включить эту функцию, используйте бета-заголовок `context-management-2025-06-27` в ваших запросах API.

Пожалуйста, поделитесь своим отзывом об этой функции через нашу [форму обратной связи](https://forms.gle/YXC2EKGMhjN1c4L88).
</Note>

### Очистка результатов инструментов

Стратегия `clear_tool_uses_20250919` очищает результаты инструментов, когда контекст беседы растёт сверх установленного вами порога. При активации API автоматически очищает самые старые результаты инструментов в хронологическом порядке, заменяя их текстом-заполнителем, чтобы Claude знал, что результат инструмента был удалён. По умолчанию очищаются только результаты инструментов. Вы можете дополнительно очистить как результаты инструментов, так и вызовы инструментов (параметры использования инструмента), установив `clear_tool_inputs` в значение true.

### Очистка блоков размышлений

Стратегия `clear_thinking_20251015` управляет блоками `thinking` в беседах, когда включено расширенное размышление. Эта стратегия автоматически очищает старые блоки размышлений из предыдущих ходов.

<Tip>
**Поведение по умолчанию**: Когда расширенное размышление включено без настройки стратегии `clear_thinking_20251015`, API автоматически сохраняет только блоки размышлений из последнего хода ассистента (эквивалентно `keep: {type: "thinking_turns", value: 1}`).

Чтобы максимизировать попадания в кэш, сохраняйте все блоки размышлений, установив `keep: "all"`.
</Tip>

<Note>
Ход беседы ассистента может включать несколько блоков содержимого (например, при использовании инструментов) и несколько блоков размышлений (например, при [чередующихся размышлениях](/docs/ru/build-with-claude/extended-thinking#interleaved-thinking)).
</Note>

<Tip>
**Редактирование контекста происходит на стороне сервера**

Редактирование контекста применяется **на стороне сервера** до того, как запрос достигнет Claude. Ваше клиентское приложение сохраняет полную, неизменённую историю беседы — вам не нужно синхронизировать состояние клиента с отредактированной версией. Продолжайте управлять полной историей беседы локально, как обычно.
</Tip>

<Tip>
**Редактирование контекста и кэширование запросов**

Взаимодействие редактирования контекста с [кэшированием запросов](/docs/ru/build-with-claude/prompt-caching) варьируется в зависимости от стратегии:

- **Очистка результатов инструментов**: Инвалидирует кэшированные префиксы запросов при удалении содержимого. Чтобы учесть это, мы рекомендуем очищать достаточно токенов, чтобы инвалидация кэша была целесообразной. Используйте параметр `clear_at_least`, чтобы гарантировать минимальное количество очищаемых токенов каждый раз. Вы будете нести расходы на запись в кэш каждый раз при очистке содержимого, но последующие запросы смогут повторно использовать новый кэшированный префикс.

- **Очистка блоков размышлений**: Когда блоки размышлений **сохраняются** в контексте (не очищаются), кэш запроса сохраняется, обеспечивая попадания в кэш и снижая затраты на входные токены. Когда блоки размышлений **очищаются**, кэш инвалидируется в точке, где происходит очистка. Настройте параметр `keep` в зависимости от того, хотите ли вы приоритизировать производительность кэша или доступность контекстного окна.
</Tip>

## Поддерживаемые модели

Редактирование контекста доступно на:

- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)
- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)

## Использование очистки результатов инструментов

Самый простой способ включить очистку результатов инструментов — указать только тип стратегии, так как все остальные [параметры конфигурации](#configuration-options-for-tool-result-clearing) будут использовать значения по умолчанию:

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": "Search for recent developments in AI"
            }
        ],
        "tools": [
            {
                "type": "web_search_20250305",
                "name": "web_search"
            }
        ],
        "context_management": {
            "edits": [
                {"type": "clear_tool_uses_20250919"}
            ]
        }
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Search for recent developments in AI"
        }
    ],
    tools=[
        {
            "type": "web_search_20250305",
            "name": "web_search"
        }
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {"type": "clear_tool_uses_20250919"}
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [
    {
      role: "user",
      content: "Search for recent developments in AI"
    }
  ],
  tools: [
    {
      type: "web_search_20250305",
      name: "web_search"
    }
  ],
  context_management: {
    edits: [
      { type: "clear_tool_uses_20250919" }
    ]
  },
  betas: ["context-management-2025-06-27"]
});
```

</CodeGroup>

### Расширенная конфигурация

Вы можете настроить поведение очистки результатов инструментов с помощью дополнительных параметров:

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": "Create a simple command line calculator app using Python"
            }
        ],
        "tools": [
            {
                "type": "text_editor_20250728",
                "name": "str_replace_based_edit_tool",
                "max_characters": 10000
            },
            {
                "type": "web_search_20250305",
                "name": "web_search",
                "max_uses": 3
            }
        ],
        "context_management": {
            "edits": [
                {
                    "type": "clear_tool_uses_20250919",
                    "trigger": {
                        "type": "input_tokens",
                        "value": 30000
                    },
                    "keep": {
                        "type": "tool_uses",
                        "value": 3
                    },
                    "clear_at_least": {
                        "type": "input_tokens",
                        "value": 5000
                    },
                    "exclude_tools": ["web_search"]
                }
            ]
        }
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Create a simple command line calculator app using Python"
        }
    ],
    tools=[
        {
            "type": "text_editor_20250728",
            "name": "str_replace_based_edit_tool",
            "max_characters": 10000
        },
        {
            "type": "web_search_20250305",
            "name": "web_search",
            "max_uses": 3
        }
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_tool_uses_20250919",
                # Trigger clearing when threshold is exceeded
                "trigger": {
                    "type": "input_tokens",
                    "value": 30000
                },
                # Number of tool uses to keep after clearing
                "keep": {
                    "type": "tool_uses",
                    "value": 3
                },
                # Optional: Clear at least this many tokens
                "clear_at_least": {
                    "type": "input_tokens",
                    "value": 5000
                },
                # Exclude these tools from being cleared
                "exclude_tools": ["web_search"]
            }
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [
    {
      role: "user",
      content: "Create a simple command line calculator app using Python"
    }
  ],
  tools: [
    {
      type: "text_editor_20250728",
      name: "str_replace_based_edit_tool",
      max_characters: 10000
    },
    {
      type: "web_search_20250305",
      name: "web_search",
      max_uses: 3
    }
  ],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_tool_uses_20250919",
        // Trigger clearing when threshold is exceeded
        trigger: {
          type: "input_tokens",
          value: 30000
        },
        // Number of tool uses to keep after clearing
        keep: {
          type: "tool_uses",
          value: 3
        },
        // Optional: Clear at least this many tokens
        clear_at_least: {
          type: "input_tokens",
          value: 5000
        },
        // Exclude these tools from being cleared
        exclude_tools: ["web_search"]
      }
    ]
  }
});
```

</CodeGroup>

## Использование очистки блоков размышлений

Включите очистку блоков размышлений для эффективного управления контекстом и кэшированием запросов при включённом расширенном размышлении:

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5-20250929",
        "max_tokens": 1024,
        "messages": [...],
        "thinking": {
            "type": "enabled",
            "budget_tokens": 10000
        },
        "context_management": {
            "edits": [
                {
                    "type": "clear_thinking_20251015",
                    "keep": {
                        "type": "thinking_turns",
                        "value": 2
                    }
                }
            ]
        }
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[...],
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_thinking_20251015",
                "keep": {
                    "type": "thinking_turns",
                    "value": 2
                }
            }
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  messages: [...],
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_thinking_20251015",
        keep: {
          type: "thinking_turns",
          value: 2
        }
      }
    ]
  }
});
```

</CodeGroup>

### Параметры конфигурации для очистки блоков размышлений

Стратегия `clear_thinking_20251015` поддерживает следующую конфигурацию:

| Параметр конфигурации | По умолчанию | Описание |
|---------------------|---------|-------------|
| `keep` | `{type: "thinking_turns", value: 1}` | Определяет, сколько последних ходов ассистента с блоками размышлений сохранять. Используйте `{type: "thinking_turns", value: N}`, где N должно быть > 0 для сохранения последних N ходов, или `"all"` для сохранения всех блоков размышлений. |

**Примеры конфигураций:**

```json
// Keep thinking blocks from the last 3 assistant turns
{
  "type": "clear_thinking_20251015",
  "keep": {
    "type": "thinking_turns",
    "value": 3
  }
}

// Keep all thinking blocks (maximizes cache hits)
{
  "type": "clear_thinking_20251015",
  "keep": "all"
}
```

### Параметры конфигурации для очистки блоков размышлений

Стратегия `clear_thinking_20251015` поддерживает следующую конфигурацию:

| Параметр конфигурации | По умолчанию | Описание |
|---------------------|---------|-------------|
| `keep` | `{type: "thinking_turns", value: 1}` | Определяет, сколько последних ходов ассистента с блоками размышлений сохранять. Используйте `{type: "thinking_turns", value: N}`, где N должно быть > 0 для сохранения последних N ходов, или `"all"` для сохранения всех блоков размышлений. |

**Примеры конфигураций:**

```json
// Keep thinking blocks from the last 3 assistant turns
{
  "type": "clear_thinking_20251015",
  "keep": {
    "type": "thinking_turns",
    "value": 3
  }
}

// Keep all thinking blocks (maximizes cache hits)
{
  "type": "clear_thinking_20251015",
  "keep": "all"
}
```

### Комбинирование стратегий

Вы можете использовать очистку блоков размышлений и очистку результатов инструментов вместе:

<Note>
При использовании нескольких стратегий стратегия `clear_thinking_20251015` должна быть указана первой в массиве `edits`.
</Note>

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[...],
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    tools=[...],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_thinking_20251015",
                "keep": {
                    "type": "thinking_turns",
                    "value": 2
                }
            },
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {
                    "type": "input_tokens",
                    "value": 50000
                },
                "keep": {
                    "type": "tool_uses",
                    "value": 5
                }
            }
        ]
    }
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  messages: [...],
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  tools: [...],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_thinking_20251015",
        keep: {
          type: "thinking_turns",
          value: 2
        }
      },
      {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: 50000
        },
        keep: {
          type: "tool_uses",
          value: 5
        }
      }
    ]
  }
});
```

</CodeGroup>

### Параметры конфигурации для очистки блоков размышлений

Стратегия `clear_thinking_20251015` поддерживает следующую конфигурацию:

| Параметр конфигурации | По умолчанию | Описание |
|---------------------|---------|-------------|
| `keep` | `{type: "thinking_turns", value: 1}` | Определяет, сколько последних ходов ассистента с блоками размышлений сохранять. Используйте `{type: "thinking_turns", value: N}`, где N должно быть > 0 для сохранения последних N ходов, или `"all"` для сохранения всех блоков размышлений. |

**Примеры конфигураций:**

```json
// Keep thinking blocks from the last 3 assistant turns
{
  "type": "clear_thinking_20251015",
  "keep": {
    "type": "thinking_turns",
    "value": 3
  }
}

// Keep all thinking blocks (maximizes cache hits)
{
  "type": "clear_thinking_20251015",
  "keep": "all"
}
```

### Комбинирование стратегий

Вы можете использовать очистку блоков размышлений и очистку результатов инструментов вместе:

<Note>
При использовании нескольких стратегий стратегия `clear_thinking_20251015` должна быть указана первой в массиве `edits`.
</Note>

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[...],
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    tools=[...],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_thinking_20251015",
                "keep": {
                    "type": "thinking_turns",
                    "value": 2
                }
            },
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {
                    "type": "input_tokens",
                    "value": 50000
                },
                "keep": {
                    "type": "tool_uses",
                    "value": 5
                }
            }
        ]
    }
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  messages: [...],
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  tools: [...],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_thinking_20251015",
        keep: {
          type: "thinking_turns",
          value: 2
        }
      },
      {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: 50000
        },
        keep: {
          type: "tool_uses",
          value: 5
        }
      }
    ]
  }
});
```

</CodeGroup>

## Параметры конфигурации для очистки результатов инструментов

| Параметр конфигурации | По умолчанию | Описание |
|---------------------|---------|-------------|
| `trigger` | 100 000 входных токенов | Определяет, когда активируется стратегия редактирования контекста. Как только запрос превысит этот порог, начнётся очистка. Вы можете указать это значение либо в `input_tokens`, либо в `tool_uses`. |
| `keep` | 3 использования инструментов | Определяет, сколько последних пар использования/результата инструмента сохранять после очистки. API удаляет самые старые взаимодействия инструментов в первую очередь, сохраняя самые последние. |
| `clear_at_least` | Нет | Гарантирует минимальное количество токенов, которое очищается каждый раз при активации стратегии. Если API не может очистить по крайней мере указанное количество, стратегия не будет применена. Это помогает определить, стоит ли редактирование контекста нарушения кэша запроса. |
| `exclude_tools` | Нет | Список имён инструментов, использования и результаты которых никогда не должны очищаться. Полезно для сохранения важного контекста. |
| `clear_tool_inputs` | `false` | Контролирует, очищаются ли параметры вызова инструмента вместе с результатами инструмента. По умолчанию очищаются только результаты инструментов, а исходные вызовы инструментов Claude остаются видимыми. |

### Параметры конфигурации для очистки блоков размышлений

Стратегия `clear_thinking_20251015` поддерживает следующую конфигурацию:

| Параметр конфигурации | По умолчанию | Описание |
|---------------------|---------|-------------|
| `keep` | `{type: "thinking_turns", value: 1}` | Определяет, сколько последних ходов ассистента с блоками размышлений сохранять. Используйте `{type: "thinking_turns", value: N}`, где N должно быть > 0 для сохранения последних N ходов, или `"all"` для сохранения всех блоков размышлений. |

**Примеры конфигураций:**

```json
// Keep thinking blocks from the last 3 assistant turns
{
  "type": "clear_thinking_20251015",
  "keep": {
    "type": "thinking_turns",
    "value": 3
  }
}

// Keep all thinking blocks (maximizes cache hits)
{
  "type": "clear_thinking_20251015",
  "keep": "all"
}
```

### Комбинирование стратегий

Вы можете использовать очистку блоков размышлений и очистку результатов инструментов вместе:

<Note>
При использовании нескольких стратегий стратегия `clear_thinking_20251015` должна быть указана первой в массиве `edits`.
</Note>

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[...],
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    tools=[...],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_thinking_20251015",
                "keep": {
                    "type": "thinking_turns",
                    "value": 2
                }
            },
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {
                    "type": "input_tokens",
                    "value": 50000
                },
                "keep": {
                    "type": "tool_uses",
                    "value": 5
                }
            }
        ]
    }
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  messages: [...],
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  tools: [...],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_thinking_20251015",
        keep: {
          type: "thinking_turns",
          value: 2
        }
      },
      {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: 50000
        },
        keep: {
          type: "tool_uses",
          value: 5
        }
      }
    ]
  }
});
```

</CodeGroup>

## Параметры конфигурации для очистки результатов инструментов

| Параметр конфигурации | По умолчанию | Описание |
|---------------------|---------|-------------|
| `trigger` | 100 000 входных токенов | Определяет, когда активируется стратегия редактирования контекста. Как только запрос превысит этот порог, начнётся очистка. Вы можете указать это значение либо в `input_tokens`, либо в `tool_uses`. |
| `keep` | 3 использования инструментов | Определяет, сколько последних пар использования/результата инструмента сохранять после очистки. API удаляет самые старые взаимодействия инструментов в первую очередь, сохраняя самые последние. |
| `clear_at_least` | Нет | Гарантирует минимальное количество токенов, которое очищается каждый раз при активации стратегии. Если API не может очистить по крайней мере указанное количество, стратегия не будет применена. Это помогает определить, стоит ли редактирование контекста нарушения кэша запроса. |
| `exclude_tools` | Нет | Список имён инструментов, использования и результаты которых никогда не должны очищаться. Полезно для сохранения важного контекста. |
| `clear_tool_inputs` | `false` | Контролирует, очищаются ли параметры вызова инструмента вместе с результатами инструмента. По умолчанию очищаются только результаты инструментов, а исходные вызовы инструментов Claude остаются видимыми. |

## Ответ редактирования контекста

Вы можете увидеть, какие редактирования контекста были применены к вашему запросу, используя поле ответа `context_management`, а также полезную статистику об очищенном содержимом и входных токенах.

```json Response
{
    "id": "msg_013Zva2CMHLNnXjNJJKqJ2EF",
    "type": "message",
    "role": "assistant",
    "content": [...],
    "usage": {...},
    "context_management": {
        "applied_edits": [
            // When using `clear_thinking_20251015`
            {
                "type": "clear_thinking_20251015",
                "cleared_thinking_turns": 3,
                "cleared_input_tokens": 15000
            },
            // When using `clear_tool_uses_20250919`
            {
                "type": "clear_tool_uses_20250919",
                "cleared_tool_uses": 8,
                "cleared_input_tokens": 50000
            }
        ]
    }
}
```

Для потоковых ответов редактирования контекста будут включены в финальное событие `message_delta`:

```json Streaming Response
{
    "type": "message_delta",
    "delta": {
        "stop_reason": "end_turn",
        "stop_sequence": null
    },
    "usage": {
        "output_tokens": 1024
    },
    "context_management": {
        "applied_edits": [...]
    }
}
```

### Параметры конфигурации для очистки блоков мышления

Стратегия `clear_thinking_20251015` поддерживает следующую конфигурацию:

| Параметр конфигурации | По умолчанию | Описание |
|---------------------|---------|-------------|
| `keep` | `{type: "thinking_turns", value: 1}` | Определяет, сколько последних ходов ассистента с блоками мышления сохранять. Используйте `{type: "thinking_turns", value: N}`, где N должно быть > 0, чтобы сохранить последние N ходов, или `"all"`, чтобы сохранить все блоки мышления. |

**Примеры конфигураций:**

```json
// Сохранить блоки мышления из последних 3 ходов ассистента
{
  "type": "clear_thinking_20251015",
  "keep": {
    "type": "thinking_turns",
    "value": 3
  }
}

// Сохранить все блоки мышления (максимизирует попадания в кэш)
{
  "type": "clear_thinking_20251015",
  "keep": "all"
}
```

### Комбинирование стратегий

Вы можете использовать очистку блоков мышления и очистку результатов инструментов вместе:

<Note>
При использовании нескольких стратегий стратегия `clear_thinking_20251015` должна быть указана первой в массиве `edits`.
</Note>

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[...],
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    tools=[...],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_thinking_20251015",
                "keep": {
                    "type": "thinking_turns",
                    "value": 2
                }
            },
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {
                    "type": "input_tokens",
                    "value": 50000
                },
                "keep": {
                    "type": "tool_uses",
                    "value": 5
                }
            }
        ]
    }
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  messages: [...],
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  tools: [...],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_thinking_20251015",
        keep: {
          type: "thinking_turns",
          value: 2
        }
      },
      {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: 50000
        },
        keep: {
          type: "tool_uses",
          value: 5
        }
      }
    ]
  }
});
```

</CodeGroup>

## Параметры конфигурации для очистки результатов инструментов

| Параметр конфигурации | По умолчанию | Описание |
|---------------------|---------|-------------|
| `trigger` | 100 000 входных токенов | Определяет, когда активируется стратегия редактирования контекста. После превышения этого порога начнется очистка. Вы можете указать это значение в `input_tokens` или `tool_uses`. |
| `keep` | 3 использования инструментов | Определяет, сколько последних пар использования инструмента/результата сохранять после очистки. API удаляет самые старые взаимодействия с инструментами в первую очередь, сохраняя самые новые. |
| `clear_at_least` | Нет | Гарантирует минимальное количество токенов, которое будет очищено каждый раз при активации стратегии. Если API не может очистить по крайней мере указанное количество, стратегия не будет применена. Это помогает определить, стоит ли разрывать кэш подсказки для очистки контекста. |
| `exclude_tools` | Нет | Список имен инструментов, использования и результаты которых никогда не должны быть очищены. Полезно для сохранения важного контекста. |
| `clear_tool_inputs` | `false` | Контролирует, будут ли параметры вызова инструмента очищены вместе с результатами инструмента. По умолчанию очищаются только результаты инструмента, а исходные вызовы инструментов Claude остаются видимыми. |

## Ответ редактирования контекста

Вы можете увидеть, какие редактирования контекста были применены к вашему запросу, используя поле ответа `context_management`, а также полезную статистику об очищенном контенте и входных токенах.

```json Response
{
    "id": "msg_013Zva2CMHLNnXjNJJKqJ2EF",
    "type": "message",
    "role": "assistant",
    "content": [...],
    "usage": {...},
    "context_management": {
        "applied_edits": [
            // При использовании `clear_thinking_20251015`
            {
                "type": "clear_thinking_20251015",
                "cleared_thinking_turns": 3,
                "cleared_input_tokens": 15000
            },
            // При использовании `clear_tool_uses_20250919`
            {
                "type": "clear_tool_uses_20250919",
                "cleared_tool_uses": 8,
                "cleared_input_tokens": 50000
            }
        ]
    }
}
```

Для потоковых ответов редактирования контекста будут включены в финальное событие `message_delta`:

```json Streaming Response
{
    "type": "message_delta",
    "delta": {
        "stop_reason": "end_turn",
        "stop_sequence": null
    },
    "usage": {
        "output_tokens": 1024
    },
    "context_management": {
        "applied_edits": [...]
    }
}
```

## Подсчет токенов

Конечная точка [подсчета токенов](/docs/ru/build-with-claude/token-counting) поддерживает управление контекстом, позволяя вам предварительно просмотреть, сколько токенов будет использовать ваша подсказка после применения редактирования контекста.

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages/count_tokens \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "messages": [
            {
                "role": "user",
                "content": "Continue our conversation..."
            }
        ],
        "tools": [...],
        "context_management": {
            "edits": [
                {
                    "type": "clear_tool_uses_20250919",
                    "trigger": {
                        "type": "input_tokens",
                        "value": 30000
                    },
                    "keep": {
                        "type": "tool_uses",
                        "value": 5
                    }
                }
            ]
        }
    }'
```

```python Python
response = client.beta.messages.count_tokens(
    model="claude-sonnet-4-5",
    messages=[
        {
            "role": "user",
            "content": "Continue our conversation..."
        }
    ],
    tools=[...],  # Your tool definitions
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {
                    "type": "input_tokens",
                    "value": 30000
                },
                "keep": {
                    "type": "tool_uses",
                    "value": 5
                }
            }
        ]
    }
)

print(f"Original tokens: {response.context_management['original_input_tokens']}")
print(f"After clearing: {response.input_tokens}")
print(f"Savings: {response.context_management['original_input_tokens'] - response.input_tokens} tokens")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.countTokens({
  model: "claude-sonnet-4-5",
  messages: [
    {
      role: "user",
      content: "Continue our conversation..."
    }
  ],
  tools: [...],  // Your tool definitions
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: 30000
        },
        keep: {
          type: "tool_uses",
          value: 5
        }
      }
    ]
  }
});

console.log(`Original tokens: ${response.context_management?.original_input_tokens}`);
console.log(`After clearing: ${response.input_tokens}`);
console.log(`Savings: ${(response.context_management?.original_input_tokens || 0) - response.input_tokens} tokens`);
```
</CodeGroup>

```json Response
{
    "input_tokens": 25000,
    "context_management": {
        "original_input_tokens": 70000
    }
}
```

Ответ показывает как финальный подсчет токенов после применения управления контекстом (`input_tokens`), так и исходный подсчет токенов до любой очистки (`original_input_tokens`).

## Использование с инструментом памяти

Редактирование контекста можно комбинировать с [инструментом памяти](/docs/ru/agents-and-tools/tool-use/memory-tool). Когда контекст вашего разговора приближается к настроенному порогу очистки, Claude получает автоматическое предупреждение о сохранении важной информации. Это позволяет Claude сохранять результаты инструментов или контекст в файлы памяти перед их удалением из истории разговора.

Эта комбинация позволяет вам:

- **Сохранять важный контекст**: Claude может записывать важную информацию из результатов инструментов в файлы памяти перед очисткой этих результатов
- **Поддерживать долгосрочные рабочие процессы**: Включить агентские рабочие процессы, которые иначе превысили бы ограничения контекста, путем выгрузки информации в постоянное хранилище
- **Получать доступ к информации по требованию**: Claude может искать ранее очищенную информацию из файлов памяти при необходимости, вместо того чтобы хранить все в активном окне контекста

Например, в рабочем процессе редактирования файлов, где Claude выполняет много операций, Claude может суммировать завершенные изменения в файлы памяти по мере роста контекста. Когда результаты инструментов очищаются, Claude сохраняет доступ к этой информации через свою систему памяти и может продолжать работать эффективно.

Чтобы использовать обе функции вместе, включите их в ваш запрос API:

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[...],
    tools=[
        {
            "type": "memory_20250818",
            "name": "memory"
        },
        # Your other tools
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {"type": "clear_tool_uses_20250919"}
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [...],
  tools: [
    {
      type: "memory_20250818",
      name: "memory"
    },
    // Your other tools
  ],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      { type: "clear_tool_uses_20250919" }
    ]
  }
});
```

</CodeGroup>

## Сжатие на стороне клиента (SDK)

<Note>
Сжатие доступно в [Python и TypeScript SDK](/docs/ru/api/client-sdks) при использовании метода [`tool_runner`](/docs/ru/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta).
</Note>

Сжатие — это функция SDK, которая автоматически управляет контекстом разговора путем создания резюме, когда использование токенов становится слишком большим. В отличие от стратегий редактирования контекста на стороне сервера, которые очищают контент, сжатие инструктирует Claude суммировать историю разговора, а затем заменяет полную историю этим резюме. Это позволяет Claude продолжать работу над долгосрочными задачами, которые иначе превысили бы [окно контекста](/docs/ru/build-with-claude/context-windows).

### Как работает сжатие

Когда сжатие включено, SDK отслеживает использование токенов после каждого ответа модели:

1. **Проверка порога**: SDK вычисляет общее количество токенов как `input_tokens + cache_creation_input_tokens + cache_read_input_tokens + output_tokens`
2. **Создание резюме**: Когда порог превышен, запрос резюме вводится как ход пользователя, и Claude создает структурированное резюме, завернутое в теги `<summary></summary>`
3. **Замена контекста**: SDK извлекает резюме и заменяет всю историю сообщений на него
4. **Продолжение**: Разговор возобновляется с резюме, и Claude продолжает с того же места

### Использование сжатия

Добавьте `compaction_control` к вашему вызову `tool_runner`:

<CodeGroup>

```python Python
import anthropic

client = anthropic.Anthropic()

runner = client.beta.messages.tool_runner(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    tools=[...],
    messages=[
        {
            "role": "user",
            "content": "Analyze all the files in this directory and write a summary report."
        }
    ],
    compaction_control={
        "enabled": True,
        "context_token_threshold": 100000
    }
)

for message in runner:
    print(f"Tokens used: {message.usage.input_tokens}")

final = runner.until_done()
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const runner = client.beta.messages.toolRunner({
    model: 'claude-sonnet-4-5',
    max_tokens: 4096,
    tools: [...],
    messages: [
        {
            role: 'user',
            content: 'Analyze all the files in this directory and write a summary report.'
        }
    ],
    compactionControl: {
        enabled: true,
        contextTokenThreshold: 100000
    }
});

for await (const message of runner) {
    console.log('Tokens used:', message.usage.input_tokens);
}

const finalMessage = await runner.runUntilDone();
```

</CodeGroup>

#### Что происходит во время сжатия

По мере роста разговора накапливается история сообщений:

**Перед сжатием (приближение к 100k токенам):**
```json
[
  { "role": "user", "content": "Analyze all files and write a report..." },
  { "role": "assistant", "content": "I'll help. Let me start by reading..." },
  { "role": "user", "content": [{ "type": "tool_result", "tool_use_id": "...", "content": "..." }] },
  { "role": "assistant", "content": "Based on file1.txt, I see..." },
  { "role": "user", "content": [{ "type": "tool_result", "tool_use_id": "...", "content": "..." }] },
  { "role": "assistant", "content": "After analyzing file2.txt..." },
  // ... 50 more exchanges like this ...
]
```

Когда токены превышают порог, SDK вводит запрос резюме и Claude создает резюме. Вся история затем заменяется:

**После сжатия (возврат к ~2-3k токенам):**
```json
[
  {
    "role": "assistant",
    "content": "# Task Overview\nThe user requested analysis of directory files to produce a summary report...\n\n# Current State\nAnalyzed 52 files across 3 subdirectories. Key findings documented in report.md...\n\n# Important Discoveries\n- Configuration files use YAML format\n- Found 3 deprecated dependencies\n- Test coverage at 67%\n\n# Next Steps\n1. Analyze remaining files in /src/legacy\n2. Complete final report sections...\n\n# Context to Preserve\nUser prefers markdown format with executive summary first..."
  }
]
```

Claude продолжает работу с этого резюме, как если бы это была исходная история разговора.

### Параметры конфигурации

| Параметр | Тип | Обязательный | По умолчанию | Описание |
|-----------|------|----------|---------|-------------|
| `enabled` | boolean | Да | - | Включить ли автоматическое сжатие |
| `context_token_threshold` | number | Нет | 100 000 | Количество токенов, при котором срабатывает сжатие |
| `model` | string | Нет | Та же модель, что и основная | Модель для использования при создании резюме |
| `summary_prompt` | string | Нет | См. ниже | Пользовательский запрос для создания резюме |

#### Выбор порога токенов

Порог определяет, когда происходит сжатие. Более низкий порог означает более частые сжатия с меньшими окнами контекста. Более высокий порог позволяет больше контекста, но рискует достичь ограничений.

<CodeGroup>

```python Python
# More frequent compaction for memory-constrained scenarios
compaction_control={
    "enabled": True,
    "context_token_threshold": 50000
}

# Less frequent compaction when you need more context
compaction_control={
    "enabled": True,
    "context_token_threshold": 150000
}
```

```typescript TypeScript
// More frequent compaction for memory-constrained scenarios
compactionControl: {
    enabled: true,
    contextTokenThreshold: 50000
}

// Less frequent compaction when you need more context
compactionControl: {
    enabled: true,
    contextTokenThreshold: 150000
}
```

</CodeGroup>

#### Использование другой модели для резюме

Вы можете использовать более быструю или дешевую модель для создания резюме:

<CodeGroup>

```python Python
compaction_control={
    "enabled": True,
    "context_token_threshold": 100000,
    "model": "claude-haiku-4-5"
}
```

```typescript TypeScript
compactionControl: {
    enabled: true,
    contextTokenThreshold: 100000,
    model: 'claude-haiku-4-5'
}
```

</CodeGroup>

#### Пользовательские запросы резюме

Вы можете предоставить пользовательский запрос для специфичных для домена потребностей. Ваш запрос должен инструктировать Claude завернуть его резюме в теги `<summary></summary>`.

<CodeGroup>

```python Python
compaction_control={
    "enabled": True,
    "context_token_threshold": 100000,
    "summary_prompt": """Summarize the research conducted so far, including:
- Sources consulted and key findings
- Questions answered and remaining unknowns
- Recommended next steps

Wrap your summary in <summary></summary> tags."""
}
```

```typescript TypeScript
compactionControl: {
    enabled: true,
    contextTokenThreshold: 100000,
    summaryPrompt: `Summarize the research conducted so far, including:
- Sources consulted and key findings
- Questions answered and remaining unknowns
- Recommended next steps

Wrap your summary in <summary></summary> tags.`
}
```

</CodeGroup>

## Использование с инструментом памяти

Редактирование контекста можно комбинировать с [инструментом памяти](/docs/ru/agents-and-tools/tool-use/memory-tool). Когда контекст вашего разговора приближается к настроенному порогу очистки, Claude получает автоматическое предупреждение о сохранении важной информации. Это позволяет Claude сохранять результаты инструментов или контекст в файлы памяти перед их удалением из истории разговора.

Эта комбинация позволяет вам:

- **Сохранять важный контекст**: Claude может записывать важную информацию из результатов инструментов в файлы памяти перед тем, как эти результаты будут очищены
- **Поддерживать долгосрочные рабочие процессы**: Включить агентские рабочие процессы, которые в противном случае превысили бы ограничения контекста, путем выгрузки информации в постоянное хранилище
- **Получать доступ к информации по требованию**: Claude может искать ранее очищенную информацию из файлов памяти при необходимости, вместо того чтобы хранить всё в активном окне контекста

Например, в рабочем процессе редактирования файлов, где Claude выполняет много операций, Claude может суммировать завершённые изменения в файлы памяти по мере роста контекста. Когда результаты инструментов очищаются, Claude сохраняет доступ к этой информации через свою систему памяти и может продолжать работать эффективно.

Чтобы использовать обе функции вместе, включите их в запрос API:

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[...],
    tools=[
        {
            "type": "memory_20250818",
            "name": "memory"
        },
        # Your other tools
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {"type": "clear_tool_uses_20250919"}
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [...],
  tools: [
    {
      type: "memory_20250818",
      name: "memory"
    },
    // Your other tools
  ],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      { type: "clear_tool_uses_20250919" }
    ]
  }
});
```

</CodeGroup>

## Компактирование на стороне клиента (SDK)

<Note>
Компактирование доступно в [Python и TypeScript SDK](/docs/ru/api/client-sdks) при использовании [метода `tool_runner`](/docs/ru/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta).
</Note>

Компактирование — это функция SDK, которая автоматически управляет контекстом разговора путём создания резюме, когда использование токенов становится слишком большим. В отличие от стратегий редактирования контекста на стороне сервера, которые очищают содержимое, компактирование инструктирует Claude создать резюме истории разговора, а затем заменяет полную историю этим резюме. Это позволяет Claude продолжать работу над долгосрочными задачами, которые в противном случае превысили бы [окно контекста](/docs/ru/build-with-claude/context-windows).

### Как работает компактирование

Когда компактирование включено, SDK отслеживает использование токенов после каждого ответа модели:

1. **Проверка порога**: SDK вычисляет общее количество токенов как `input_tokens + cache_creation_input_tokens + cache_read_input_tokens + output_tokens`
2. **Создание резюме**: Когда порог превышен, подсказка резюме вводится как ход пользователя, и Claude создаёт структурированное резюме, завёрнутое в теги `<summary></summary>`
3. **Замена контекста**: SDK извлекает резюме и заменяет всю историю сообщений на него
4. **Продолжение**: Разговор возобновляется с резюме, и Claude продолжает с того места, где остановился

### Использование компактирования

Добавьте `compaction_control` в ваш вызов `tool_runner`:

<CodeGroup>

```python Python
import anthropic

client = anthropic.Anthropic()

runner = client.beta.messages.tool_runner(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    tools=[...],
    messages=[
        {
            "role": "user",
            "content": "Analyze all the files in this directory and write a summary report."
        }
    ],
    compaction_control={
        "enabled": True,
        "context_token_threshold": 100000
    }
)

for message in runner:
    print(f"Tokens used: {message.usage.input_tokens}")

final = runner.until_done()
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const runner = client.beta.messages.toolRunner({
    model: 'claude-sonnet-4-5',
    max_tokens: 4096,
    tools: [...],
    messages: [
        {
            role: 'user',
            content: 'Analyze all the files in this directory and write a summary report.'
        }
    ],
    compactionControl: {
        enabled: true,
        contextTokenThreshold: 100000
    }
});

for await (const message of runner) {
    console.log('Tokens used:', message.usage.input_tokens);
}

const finalMessage = await runner.runUntilDone();
```

</CodeGroup>

#### Что происходит во время компактирования

По мере роста разговора история сообщений накапливается:

**До компактирования (приближение к 100k токенам):**
```json
[
  { "role": "user", "content": "Analyze all files and write a report..." },
  { "role": "assistant", "content": "I'll help. Let me start by reading..." },
  { "role": "user", "content": [{ "type": "tool_result", "tool_use_id": "...", "content": "..." }] },
  { "role": "assistant", "content": "Based on file1.txt, I see..." },
  { "role": "user", "content": [{ "type": "tool_result", "tool_use_id": "...", "content": "..." }] },
  { "role": "assistant", "content": "After analyzing file2.txt..." },
  // ... 50 more exchanges like this ...
]
```

Когда токены превышают порог, SDK вводит запрос резюме и Claude создаёт резюме. Вся история затем заменяется:

**После компактирования (возврат к ~2-3k токенам):**
```json
[
  {
    "role": "assistant",
    "content": "# Task Overview\nThe user requested analysis of directory files to produce a summary report...\n\n# Current State\nAnalyzed 52 files across 3 subdirectories. Key findings documented in report.md...\n\n# Important Discoveries\n- Configuration files use YAML format\n- Found 3 deprecated dependencies\n- Test coverage at 67%\n\n# Next Steps\n1. Analyze remaining files in /src/legacy\n2. Complete final report sections...\n\n# Context to Preserve\nUser prefers markdown format with executive summary first..."
  }
]
```

Claude продолжает работу с этого резюме, как если бы это была исходная история разговора.

### Параметры конфигурации

| Параметр | Тип | Обязательный | По умолчанию | Описание |
|-----------|------|----------|---------|-------------|
| `enabled` | boolean | Да | - | Включить ли автоматическое компактирование |
| `context_token_threshold` | number | Нет | 100,000 | Количество токенов, при котором срабатывает компактирование |
| `model` | string | Нет | Такая же, как основная модель | Модель для использования при создании резюме |
| `summary_prompt` | string | Нет | См. ниже | Пользовательская подсказка для создания резюме |

#### Выбор порога токенов

Порог определяет, когда происходит компактирование. Более низкий порог означает более частое компактирование с меньшими окнами контекста. Более высокий порог позволяет больше контекста, но рискует достичь ограничений.

<CodeGroup>

```python Python
# More frequent compaction for memory-constrained scenarios
compaction_control={
    "enabled": True,
    "context_token_threshold": 50000
}

# Less frequent compaction when you need more context
compaction_control={
    "enabled": True,
    "context_token_threshold": 150000
}
```

```typescript TypeScript
// More frequent compaction for memory-constrained scenarios
compactionControl: {
    enabled: true,
    contextTokenThreshold: 50000
}

// Less frequent compaction when you need more context
compactionControl: {
    enabled: true,
    contextTokenThreshold: 150000
}
```

</CodeGroup>

#### Использование другой модели для резюме

Вы можете использовать более быструю или дешёвую модель для создания резюме:

<CodeGroup>

```python Python
compaction_control={
    "enabled": True,
    "context_token_threshold": 100000,
    "model": "claude-haiku-4-5"
}
```

```typescript TypeScript
compactionControl: {
    enabled: true,
    contextTokenThreshold: 100000,
    model: 'claude-haiku-4-5'
}
```

</CodeGroup>

#### Пользовательские подсказки резюме

Вы можете предоставить пользовательскую подсказку для специфических потребностей домена. Ваша подсказка должна инструктировать Claude завернуть своё резюме в теги `<summary></summary>`.

<CodeGroup>

```python Python
compaction_control={
    "enabled": True,
    "context_token_threshold": 100000,
    "summary_prompt": """Summarize the research conducted so far, including:
- Sources consulted and key findings
- Questions answered and remaining unknowns
- Recommended next steps

Wrap your summary in <summary></summary> tags."""
}
```

```typescript TypeScript
compactionControl: {
    enabled: true,
    contextTokenThreshold: 100000,
    summaryPrompt: `Summarize the research conducted so far, including:
- Sources consulted and key findings
- Questions answered and remaining unknowns
- Recommended next steps

Wrap your summary in <summary></summary> tags.`
}
```

</CodeGroup>

### Подсказка резюме по умолчанию

Встроенная подсказка резюме инструктирует Claude создать структурированное резюме продолжения, включающее:

1. **Обзор задачи**: Основной запрос пользователя, критерии успеха и ограничения
2. **Текущее состояние**: Что было завершено, какие файлы были изменены и какие артефакты были созданы
3. **Важные открытия**: Технические ограничения, принятые решения, разрешённые ошибки и неудачные подходы
4. **Следующие шаги**: Конкретные необходимые действия, блокировщики и порядок приоритета
5. **Контекст для сохранения**: Предпочтения пользователя, специфичные для домена детали и сделанные обещания

Эта структура позволяет Claude эффективно возобновить работу без потери важного контекста или повторения ошибок.

<section title="View full default prompt">

```
You have been working on the task described above but have not yet completed it. Write a continuation summary that will allow you (or another instance of yourself) to resume work efficiently in a future context window where the conversation history will be replaced with this summary. Your summary should be structured, concise, and actionable. Include:

1. Task Overview
The user's core request and success criteria
Any clarifications or constraints they specified

2. Current State
What has been completed so far
Files created, modified, or analyzed (with paths if relevant)
Key outputs or artifacts produced

3. Important Discoveries
Technical constraints or requirements uncovered
Decisions made and their rationale
Errors encountered and how they were resolved
What approaches were tried that didn't work (and why)

4. Next Steps
Specific actions needed to complete the task
Any blockers or open questions to resolve
Priority order if multiple steps remain

5. Context to Preserve
User preferences or style requirements
Domain-specific details that aren't obvious
Any promises made to the user

Be concise but complete—err on the side of including information that would prevent duplicate work or repeated mistakes. Write in a way that enables immediate resumption of the task.

Wrap your summary in <summary></summary> tags.
```

</section>

### Ограничения

#### Инструменты на стороне сервера

<Warning>
Компактирование требует особого внимания при использовании инструментов на стороне сервера, таких как [веб-поиск](/docs/ru/agents-and-tools/tool-use/web-search-tool) или [веб-выборка](/docs/ru/agents-and-tools/tool-use/web-fetch-tool).
</Warning>

При использовании инструментов на стороне сервера SDK может неправильно рассчитать использование токенов, вызывая срабатывание компактирования в неправильное время.

Например, после операции веб-поиска ответ API может показать:

```json
{
  "usage": {
    "input_tokens": 63000,
    "cache_read_input_tokens": 270000,
    "output_tokens": 1400
  }
}
```

SDK вычисляет общее использование как 63,000 + 270,000 = 333,000 токенов. Однако значение `cache_read_input_tokens` включает накопленные чтения из нескольких внутренних вызовов API, сделанных инструментом на стороне сервера, а не ваш фактический контекст разговора. Ваша реальная длина контекста может быть только 63,000 `input_tokens`, но SDK видит 333k и срабатывает компактирование преждевременно.

**Обходные решения:**

- Используйте конечную точку [подсчёта токенов](/docs/ru/build-with-claude/token-counting) для получения точной длины контекста
- Избегайте компактирования при интенсивном использовании инструментов на стороне сервера

#### Граничные случаи использования инструментов

Когда компактирование срабатывает во время ожидания ответа использования инструмента, SDK удаляет блок использования инструмента из истории сообщений перед созданием резюме. Claude повторно выдаст вызов инструмента после возобновления работы с резюме, если это всё ещё необходимо.

### Мониторинг компактирования

Включите логирование для отслеживания того, когда происходит компактирование:

<CodeGroup>

```python Python
import logging

logging.basicConfig(level=logging.INFO)
logging.getLogger("anthropic.lib.tools").setLevel(logging.INFO)

# Logs will show:
# INFO: Token usage 105000 has exceeded the threshold of 100000. Performing compaction.
# INFO: Compaction complete. New token usage: 2500
```

```typescript TypeScript
// The SDK logs compaction events to the console
// You'll see messages like:
// Token usage 105000 has exceeded the threshold of 100000. Performing compaction.
// Compaction complete. New token usage: 2500
```

</CodeGroup>

### Когда использовать компактирование

**Хорошие варианты использования:**

- Долгосрочные задачи агента, которые обрабатывают много файлов или источников данных
- Рабочие процессы исследования, которые накапливают большое количество информации
- Многошаговые задачи с чёткими, измеримыми прогрессом
- Задачи, которые создают артефакты (файлы, отчёты), которые сохраняются вне разговора

**Менее идеальные варианты использования:**

- Задачи, требующие точного воспоминания о деталях ранних разговоров
- Рабочие процессы, использующие инструменты на стороне сервера в большом объёме
- Задачи, которые должны поддерживать точное состояние во многих переменных