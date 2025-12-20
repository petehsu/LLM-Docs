# Инструмент веб-поиска

Инструмент веб-поиска дает Claude прямой доступ к содержимому веб-сайтов в реальном времени, позволяя ему отвечать на вопросы с актуальной информацией, выходящей за пределы его знаний. Claude автоматически цитирует источники из результатов поиска как часть своего ответа.

---

Инструмент веб-поиска дает Claude прямой доступ к содержимому веб-сайтов в реальном времени, позволяя ему отвечать на вопросы с актуальной информацией, выходящей за пределы его знаний. Claude автоматически цитирует источники из результатов поиска как часть своего ответа.

<Note>
Пожалуйста, свяжитесь с нами через нашу [форму обратной связи](https://forms.gle/sWjBtsrNEY2oKGuE8), чтобы поделиться своим опытом использования инструмента веб-поиска.
</Note>

## Поддерживаемые модели

Веб-поиск доступен на:

- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Sonnet 3.7 ([устарела](/docs/ru/about-claude/model-deprecations)) (`claude-3-7-sonnet-20250219`)
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)
- Claude Haiku 3.5 (`claude-3-5-haiku-latest`)
- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)

## Как работает веб-поиск

Когда вы добавляете инструмент веб-поиска в ваш запрос API:

1. Claude решает, когда выполнять поиск, на основе подсказки.
2. API выполняет поиск и предоставляет Claude результаты. Этот процесс может повторяться несколько раз в течение одного запроса.
3. В конце своего хода Claude предоставляет окончательный ответ с цитируемыми источниками.

## Как использовать веб-поиск

<Note>
Администратор вашей организации должен включить веб-поиск в [Console](/settings/privacy).
</Note>

Предоставьте инструмент веб-поиска в вашем запросе API:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 1024,
        "messages": [
            {
                "role": "user",
                "content": "What is the weather in NYC?"
            }
        ],
        "tools": [{
            "type": "web_search_20250305",
            "name": "web_search",
            "max_uses": 5
        }]
    }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": "What's the weather in NYC?"
        }
    ],
    tools=[{
        "type": "web_search_20250305",
        "name": "web_search",
        "max_uses": 5
    }]
)
print(response)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

async function main() {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: "What's the weather in NYC?"
      }
    ],
    tools: [{
      type: "web_search_20250305",
      name: "web_search",
      max_uses: 5
    }]
  });

  console.log(response);
}

main().catch(console.error);
```
</CodeGroup>

### Определение инструмента

Инструмент веб-поиска поддерживает следующие параметры:

```json JSON
{
  "type": "web_search_20250305",
  "name": "web_search",

  // Опционально: ограничить количество поисков на запрос
  "max_uses": 5,

  // Опционально: включить результаты только с этих доменов
  "allowed_domains": ["example.com", "trusteddomain.org"],

  // Опционально: никогда не включать результаты с этих доменов
  "blocked_domains": ["untrustedsource.com"],

  // Опционально: локализовать результаты поиска
  "user_location": {
    "type": "approximate",
    "city": "San Francisco",
    "region": "California",
    "country": "US",
    "timezone": "America/Los_Angeles"
  }
}
```

#### Max uses

Параметр `max_uses` ограничивает количество выполняемых поисков. Если Claude попытается выполнить больше поисков, чем разрешено, `web_search_tool_result` будет ошибкой с кодом ошибки `max_uses_exceeded`.

#### Фильтрация доменов

При использовании фильтров доменов:

- Домены не должны включать схему HTTP/HTTPS (используйте `example.com` вместо `https://example.com`)
- Поддомены автоматически включаются (`example.com` охватывает `docs.example.com`)
- Конкретные поддомены ограничивают результаты только этим поддоменом (`docs.example.com` возвращает результаты только с этого поддомена, а не с `example.com` или `api.example.com`)
- Поддерживаются подпути и совпадают с чем-либо после пути (`example.com/blog` совпадает с `example.com/blog/post-1`)
- Вы можете использовать либо `allowed_domains`, либо `blocked_domains`, но не оба в одном запросе.

**Поддержка подстановочных символов:**

- Только один подстановочный символ (`*`) разрешен на запись домена, и он должен появляться после части домена (в пути)
- Допустимо: `example.com/*`, `example.com/*/articles`
- Недопустимо: `*.example.com`, `ex*.com`, `example.com/*/news/*`

Недопустимые форматы доменов вернут ошибку инструмента `invalid_tool_input`.

<Note>
Ограничения доменов на уровне запроса должны быть совместимы с ограничениями доменов на уровне организации, настроенными в Console. Домены на уровне запроса могут только дополнительно ограничивать домены, а не переопределять или расширять список на уровне организации. Если ваш запрос включает домены, которые конфликтуют с параметрами организации, API вернет ошибку валидации.
</Note>

#### Локализация

Параметр `user_location` позволяет вам локализовать результаты поиска на основе местоположения пользователя.

- `type`: Тип местоположения (должен быть `approximate`)
- `city`: Название города
- `region`: Регион или штат
- `country`: Страна
- `timezone`: [IANA ID часового пояса](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).

### Ответ

Вот пример структуры ответа:

```json
{
  "role": "assistant",
  "content": [
    // 1. Решение Claude выполнить поиск
    {
      "type": "text",
      "text": "I'll search for when Claude Shannon was born."
    },
    // 2. Использованный поисковый запрос
    {
      "type": "server_tool_use",
      "id": "srvtoolu_01WYG3ziw53XMcoyKL4XcZmE",
      "name": "web_search",
      "input": {
        "query": "claude shannon birth date"
      }
    },
    // 3. Результаты поиска
    {
      "type": "web_search_tool_result",
      "tool_use_id": "srvtoolu_01WYG3ziw53XMcoyKL4XcZmE",
      "content": [
        {
          "type": "web_search_result",
          "url": "https://en.wikipedia.org/wiki/Claude_Shannon",
          "title": "Claude Shannon - Wikipedia",
          "encrypted_content": "EqgfCioIARgBIiQ3YTAwMjY1Mi1mZjM5LTQ1NGUtODgxNC1kNjNjNTk1ZWI3Y...",
          "page_age": "April 30, 2025"
        }
      ]
    },
    {
      "text": "Based on the search results, ",
      "type": "text"
    },
    // 4. Ответ Claude с цитатами
    {
      "text": "Claude Shannon was born on April 30, 1916, in Petoskey, Michigan",
      "type": "text",
      "citations": [
        {
          "type": "web_search_result_location",
          "url": "https://en.wikipedia.org/wiki/Claude_Shannon",
          "title": "Claude Shannon - Wikipedia",
          "encrypted_index": "Eo8BCioIAhgBIiQyYjQ0OWJmZi1lNm..",
          "cited_text": "Claude Elwood Shannon (April 30, 1916 – February 24, 2001) was an American mathematician, electrical engineer, computer scientist, cryptographer and i..."
        }
      ]
    }
  ],
  "id": "msg_a930390d3a",
  "usage": {
    "input_tokens": 6039,
    "output_tokens": 931,
    "server_tool_use": {
      "web_search_requests": 1
    }
  },
  "stop_reason": "end_turn"
}
```

#### Результаты поиска

Результаты поиска включают:

- `url`: URL исходной страницы
- `title`: Название исходной страницы
- `page_age`: Когда сайт был последний раз обновлен
- `encrypted_content`: Зашифрованное содержимое, которое должно быть передано обратно в многооборотных разговорах для цитирования

#### Цитаты

Цитаты всегда включены для веб-поиска, и каждый `web_search_result_location` включает:

- `url`: URL цитируемого источника
- `title`: Название цитируемого источника
- `encrypted_index`: Ссылка, которая должна быть передана обратно для многооборотных разговоров.
- `cited_text`: До 150 символов цитируемого содержимого

Поля цитирования веб-поиска `cited_text`, `title` и `url` не учитываются в использовании входных или выходных токенов.

<Note>
  При отображении выходных данных API непосредственно конечным пользователям цитаты должны быть включены в исходный источник. Если вы вносите изменения в выходные данные API, включая переработку и/или объединение их с вашим собственным материалом перед отображением конечным пользователям, отображайте цитаты надлежащим образом на основе консультации с вашей юридической командой.
</Note>

#### Ошибки

Когда инструмент веб-поиска встречает ошибку (например, превышение лимита скорости), Claude API все еще возвращает ответ 200 (успех). Ошибка представлена в теле ответа, используя следующую структуру:

```json
{
  "type": "web_search_tool_result",
  "tool_use_id": "servertoolu_a93jad",
  "content": {
    "type": "web_search_tool_result_error",
    "error_code": "max_uses_exceeded"
  }
}
```

Это возможные коды ошибок:

- `too_many_requests`: Превышен лимит скорости
- `invalid_input`: Недопустимый параметр поискового запроса
- `max_uses_exceeded`: Превышено максимальное количество использований инструмента веб-поиска
- `query_too_long`: Запрос превышает максимальную длину
- `unavailable`: Произошла внутренняя ошибка

#### Причина остановки `pause_turn`

Ответ может включать причину остановки `pause_turn`, которая указывает, что API приостановил долгоживущий ход. Вы можете предоставить ответ как есть в последующем запросе, чтобы позволить Claude продолжить свой ход, или изменить содержимое, если вы хотите прервать разговор.

## Кэширование подсказок

Веб-поиск работает с [кэшированием подсказок](/docs/ru/build-with-claude/prompt-caching). Чтобы включить кэширование подсказок, добавьте по крайней мере одну точку разрыва `cache_control` в ваш запрос. Система автоматически кэширует до последнего блока `web_search_tool_result` при выполнении инструмента.

Для многооборотных разговоров установите точку разрыва `cache_control` на или после последнего блока `web_search_tool_result`, чтобы повторно использовать кэшированное содержимое.

Например, чтобы использовать кэширование подсказок с веб-поиском для многооборотного разговора:

<CodeGroup>
```python
import anthropic

client = anthropic.Anthropic()

# Первый запрос с веб-поиском и точкой разрыва кэша
messages = [
    {
        "role": "user",
        "content": "What's the current weather in San Francisco today?"
    }
]

response1 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=messages,
    tools=[{
        "type": "web_search_20250305",
        "name": "web_search",
        "user_location": {
            "type": "approximate",
            "city": "San Francisco",
            "region": "California",
            "country": "US",
            "timezone": "America/Los_Angeles"
        }
    }]
)

# Добавьте ответ Claude в разговор
messages.append({
    "role": "assistant",
    "content": response1.content
})

# Второй запрос с точкой разрыва кэша после результатов поиска
messages.append({
    "role": "user",
    "content": "Should I expect rain later this week?",
    "cache_control": {"type": "ephemeral"}  # Кэшировать до этой точки
})

response2 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=messages,
    tools=[{
        "type": "web_search_20250305",
        "name": "web_search",
        "user_location": {
            "type": "approximate",
            "city": "San Francisco",
            "region": "California",
            "country": "US",
            "timezone": "America/Los_Angeles"
        }
    }]
)
# Второй ответ будет использовать кэшированные результаты поиска
# при этом все еще имея возможность выполнять новые поиски при необходимости
print(f"Cache read tokens: {response2.usage.get('cache_read_input_tokens', 0)}")
```

</CodeGroup>

## Потоковая передача

При включенной потоковой передаче вы будете получать события поиска как часть потока. Будет пауза во время выполнения поиска:

```javascript
event: message_start
data: {"type": "message_start", "message": {"id": "msg_abc123", "type": "message"}}

event: content_block_start
data: {"type": "content_block_start", "index": 0, "content_block": {"type": "text", "text": ""}}

// Решение Claude выполнить поиск

event: content_block_start
data: {"type": "content_block_start", "index": 1, "content_block": {"type": "server_tool_use", "id": "srvtoolu_xyz789", "name": "web_search"}}

// Поисковый запрос передается потоком
event: content_block_delta
data: {"type": "content_block_delta", "index": 1, "delta": {"type": "input_json_delta", "partial_json": "{\"query\":\"latest quantum computing breakthroughs 2025\"}"}}

// Пауза во время выполнения поиска

// Результаты поиска передаются потоком
event: content_block_start
data: {"type": "content_block_start", "index": 2, "content_block": {"type": "web_search_tool_result", "tool_use_id": "srvtoolu_xyz789", "content": [{"type": "web_search_result", "title": "Quantum Computing Breakthroughs in 2025", "url": "https://example.com"}]}}

// Ответ Claude с цитатами (опущен в этом примере)
```

## Пакетные запросы

Вы можете включить инструмент веб-поиска в [Messages Batches API](/docs/ru/build-with-claude/batch-processing). Вызовы инструмента веб-поиска через Messages Batches API оцениваются так же, как и в обычных запросах Messages API.

## Использование и цены

Web search usage is charged in addition to token usage:

```json
"usage": {
  "input_tokens": 105,
  "output_tokens": 6039,
  "cache_read_input_tokens": 7123,
  "cache_creation_input_tokens": 7345,
  "server_tool_use": {
    "web_search_requests": 1
  }
}
```

Web search is available on the Claude API for **$10 per 1,000 searches**, plus standard token costs for search-generated content. Web search results retrieved throughout a conversation are counted as input tokens, in search iterations executed during a single turn and in subsequent conversation turns.

Each web search counts as one use, regardless of the number of results returned. If an error occurs during web search, the web search will not be billed.