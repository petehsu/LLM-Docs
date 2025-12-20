# Ценообразование

Узнайте о структуре ценообразования Anthropic для моделей и функций

---

На этой странице представлена подробная информация о ценообразовании моделей и функций Anthropic. Все цены указаны в USD.

Для получения наиболее актуальной информации о ценах посетите [claude.com/pricing](https://claude.com/pricing).

## Ценообразование моделей

В следующей таблице показаны цены для всех моделей Claude в различных ценовых уровнях:

| Model             | Base Input Tokens | 5m Cache Writes | 1h Cache Writes | Cache Hits & Refreshes | Output Tokens |
|-------------------|-------------------|-----------------|-----------------|----------------------|---------------|
| Claude Opus 4.5   | $5 / MTok         | $6.25 / MTok    | $10 / MTok      | $0.50 / MTok | $25 / MTok    |
| Claude Opus 4.1   | $15 / MTok        | $18.75 / MTok   | $30 / MTok      | $1.50 / MTok | $75 / MTok    |
| Claude Opus 4     | $15 / MTok        | $18.75 / MTok   | $30 / MTok      | $1.50 / MTok | $75 / MTok    |
| Claude Sonnet 4.5   | $3 / MTok         | $3.75 / MTok    | $6 / MTok       | $0.30 / MTok | $15 / MTok    |
| Claude Sonnet 4   | $3 / MTok         | $3.75 / MTok    | $6 / MTok       | $0.30 / MTok | $15 / MTok    |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations)) | $3 / MTok         | $3.75 / MTok    | $6 / MTok       | $0.30 / MTok | $15 / MTok    |
| Claude Haiku 4.5  | $1 / MTok         | $1.25 / MTok    | $2 / MTok       | $0.10 / MTok | $5 / MTok     |
| Claude Haiku 3.5  | $0.80 / MTok      | $1 / MTok       | $1.6 / MTok     | $0.08 / MTok | $4 / MTok     |
| Claude Opus 3 ([deprecated](/docs/en/about-claude/model-deprecations))    | $15 / MTok        | $18.75 / MTok   | $30 / MTok      | $1.50 / MTok | $75 / MTok    |
| Claude Haiku 3    | $0.25 / MTok      | $0.30 / MTok    | $0.50 / MTok    | $0.03 / MTok | $1.25 / MTok  |

<Note>
MTok = миллион токенов. Столбец "Base Input Tokens" показывает стандартное ценообразование входных данных, "Cache Writes" и "Cache Hits" относятся к [кэшированию подсказок](/docs/ru/build-with-claude/prompt-caching), а "Output Tokens" показывает ценообразование выходных данных. Кэширование подсказок предлагает как 5-минутное (по умолчанию), так и 1-часовое кэширование для оптимизации затрат в различных сценариях использования.

Таблица выше отражает следующие множители ценообразования для кэширования подсказок:
- Токены записи в 5-минутный кэш в 1,25 раза дороже базовой цены входных токенов
- Токены записи в 1-часовой кэш в 2 раза дороже базовой цены входных токенов
- Токены чтения из кэша стоят 0,1 от базовой цены входных токенов
</Note>

## Ценообразование на платформах третьих сторон

Модели Claude доступны на [AWS Bedrock](/docs/ru/build-with-claude/claude-on-amazon-bedrock), [Google Vertex AI](/docs/ru/build-with-claude/claude-on-vertex-ai) и [Microsoft Foundry](/docs/ru/build-with-claude/claude-in-microsoft-foundry). Для получения официальной информации о ценах посетите:
- [Ценообразование AWS Bedrock](https://aws.amazon.com/bedrock/pricing/)
- [Ценообразование Google Vertex AI](https://cloud.google.com/vertex-ai/generative-ai/pricing)
- [Ценообразование Microsoft Foundry](https://azure.microsoft.com/en-us/pricing/details/ai-foundry/#pricing)

<Note>
**Ценообразование региональных конечных точек для моделей Claude 4.5 и более новых**

Начиная с Claude Sonnet 4.5 и Haiku 4.5, AWS Bedrock и Google Vertex AI предлагают два типа конечных точек:
- **Глобальные конечные точки**: динамическая маршрутизация между регионами для максимальной доступности
- **Региональные конечные точки**: маршрутизация данных гарантирована в пределах определённых географических регионов

Региональные конечные точки включают 10% надбавку к глобальным конечным точкам. **Claude API (1P) по умолчанию является глобальным и не затронут этим изменением.** Claude API является глобальным (эквивалентно предложению глобальной конечной точки и ценообразованию от других поставщиков).

**Область применения**: эта структура ценообразования применяется к Claude Sonnet 4.5, Haiku 4.5 и всем будущим моделям. Более ранние модели (Claude Sonnet 4, Opus 4 и более ранние выпуски) сохраняют своё существующее ценообразование.

Для деталей реализации и примеров кода:
- [AWS Bedrock глобальные и региональные конечные точки](/docs/ru/build-with-claude/claude-on-amazon-bedrock#global-vs-regional-endpoints)
- [Google Vertex AI глобальные и региональные конечные точки](/docs/ru/build-with-claude/claude-on-vertex-ai#global-vs-regional-endpoints)
</Note>

## Ценообразование функций

### Пакетная обработка

Batch API позволяет асинхронно обрабатывать большие объёмы запросов со скидкой 50% на входные и выходные токены.

| Model             | Batch input      | Batch output    |
|-------------------|------------------|-----------------|
| Claude Opus 4.5     | $2.50 / MTok     | $12.50 / MTok   |
| Claude Opus 4.1     | $7.50 / MTok     | $37.50 / MTok   |
| Claude Opus 4     | $7.50 / MTok     | $37.50 / MTok   |
| Claude Sonnet 4.5   | $1.50 / MTok     | $7.50 / MTok    |
| Claude Sonnet 4   | $1.50 / MTok     | $7.50 / MTok    |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations)) | $1.50 / MTok     | $7.50 / MTok    |
| Claude Haiku 4.5  | $0.50 / MTok     | $2.50 / MTok    |
| Claude Haiku 3.5  | $0.40 / MTok     | $2 / MTok       |
| Claude Opus 3 ([deprecated](/docs/en/about-claude/model-deprecations))  | $7.50 / MTok     | $37.50 / MTok   |
| Claude Haiku 3    | $0.125 / MTok    | $0.625 / MTok   |

Для получения дополнительной информации о пакетной обработке см. нашу [документацию по пакетной обработке](/docs/ru/build-with-claude/batch-processing).

### Ценообразование для больших контекстов

При использовании Claude Sonnet 4 или Sonnet 4.5 с [включённым окном контекста в 1M токенов](/docs/ru/build-with-claude/context-windows#1m-token-context-window) запросы, превышающие 200K входных токенов, автоматически взимаются по премиум-ставкам для больших контекстов:

<Note>
Окно контекста в 1M токенов в настоящее время находится в бета-версии для организаций на [уровне использования](/docs/ru/api/rate-limits) 4 и организаций с пользовательскими ограничениями скорости. Окно контекста в 1M токенов доступно только для Claude Sonnet 4 и Sonnet 4.5.
</Note>

| ≤ 200K входных токенов | > 200K входных токенов |
|-----------------------------------|-------------------------------------|
| Входные: $3 / MTok | Входные: $6 / MTok |
| Выходные: $15 / MTok | Выходные: $22.50 / MTok |

Ценообразование для больших контекстов складывается с другими модификаторами ценообразования:
- [Скидка 50% Batch API](#batch-processing) применяется к ценообразованию больших контекстов
- [Множители кэширования подсказок](#model-pricing) применяются поверх ценообразования больших контекстов

<Note>
Даже с включённым флагом бета-версии запросы с менее чем 200K входных токенов взимаются по стандартным ставкам. Если ваш запрос превышает 200K входных токенов, все токены взимаются по премиум-ставкам.

Порог 200K основан исключительно на входных токенах (включая чтение/запись кэша). Количество выходных токенов не влияет на выбор ценового уровня, но выходные токены взимаются по более высокой ставке, когда превышен порог входных данных.
</Note>

Чтобы проверить, был ли ваш запрос API взимается по ставкам окна контекста 1M, изучите объект `usage` в ответе API:

```json
{
  "usage": {
    "input_tokens": 250000,
    "cache_creation_input_tokens": 0,
    "cache_read_input_tokens": 0,
    "output_tokens": 500
  }
}
```

Рассчитайте общее количество входных токенов путём суммирования:
- `input_tokens`
- `cache_creation_input_tokens` (если используется кэширование подсказок)
- `cache_read_input_tokens` (если используется кэширование подсказок)

Если общее количество превышает 200 000 токенов, весь запрос был выставлен по ставкам контекста 1M.

Для получения дополнительной информации об объекте `usage` см. [документацию ответа API](/docs/ru/api/messages#response-usage).

### Ценообразование использования инструментов

Tool use requests are priced based on:
1. The total number of input tokens sent to the model (including in the `tools` parameter)
2. The number of output tokens generated
3. For server-side tools, additional usage-based pricing (e.g., web search charges per search performed)

Client-side tools are priced the same as any other Claude API request, while server-side tools may incur additional charges based on their specific usage.

The additional tokens from tool use come from:

- The `tools` parameter in API requests (tool names, descriptions, and schemas)
- `tool_use` content blocks in API requests and responses
- `tool_result` content blocks in API requests

When you use `tools`, we also automatically include a special system prompt for the model which enables tool use. The number of tool use tokens required for each model are listed below (excluding the additional tokens listed above). Note that the table assumes at least 1 tool is provided. If no `tools` are provided, then a tool choice of `none` uses 0 additional system prompt tokens.

| Model                    | Tool choice                                          | Tool use system prompt token count          |
|--------------------------|------------------------------------------------------|---------------------------------------------|
| Claude Opus 4.5            | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Opus 4.1            | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Opus 4            | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Sonnet 4.5          | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Sonnet 4          | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations))        | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Haiku 4.5         | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Haiku 3.5         | `auto`, `none`<hr />`any`, `tool`   | 264 tokens<hr />340 tokens |
| Claude Opus 3 ([deprecated](/docs/en/about-claude/model-deprecations))            | `auto`, `none`<hr />`any`, `tool`   | 530 tokens<hr />281 tokens |
| Claude Sonnet 3          | `auto`, `none`<hr />`any`, `tool`   | 159 tokens<hr />235 tokens |
| Claude Haiku 3           | `auto`, `none`<hr />`any`, `tool`   | 264 tokens<hr />340 tokens |

These token counts are added to your normal input and output tokens to calculate the total cost of a request.

Для текущих цен по моделям обратитесь к разделу [ценообразование моделей](#model-pricing) выше.

Для получения дополнительной информации о реализации использования инструментов и лучших практиках см. нашу [документацию по использованию инструментов](/docs/ru/agents-and-tools/tool-use/overview).

### Ценообразование конкретных инструментов

#### Инструмент Bash

The bash tool adds **245 input tokens** to your API calls.

Additional tokens are consumed by:
- Command outputs (stdout/stderr)
- Error messages
- Large file contents

См. [ценообразование использования инструментов](#tool-use-pricing) для получения полной информации о ценах.

#### Инструмент выполнения кода

Code execution tool usage is tracked separately from token usage. Execution time has a minimum of 5 minutes.
If files are included in the request, execution time is billed even if the tool is not used due to files being preloaded onto the container.

Each organization receives 50 free hours of usage with the code execution tool per day. Additional usage beyond the first 50 hours is billed at $0.05 per hour, per container.

#### Инструмент текстового редактора

The text editor tool uses the same pricing structure as other tools used with Claude. It follows the standard input and output token pricing based on the Claude model you're using.

In addition to the base tokens, the following additional input tokens are needed for the text editor tool:

| Tool | Additional input tokens |
| ----------------------------------------- | --------------------------------------- |
| `text_editor_20250429` (Claude 4.x) | 700 tokens |
| `text_editor_20250124` (Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations))) | 700 tokens |

См. [ценообразование использования инструментов](#tool-use-pricing) для получения полной информации о ценах.

#### Инструмент веб-поиска

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

#### Инструмент веб-выборки

Web fetch usage has **no additional charges** beyond standard token costs:

```json
"usage": {
  "input_tokens": 25039,
  "output_tokens": 931,
  "cache_read_input_tokens": 0,
  "cache_creation_input_tokens": 0,
  "server_tool_use": {
    "web_fetch_requests": 1
  }
}
```

The web fetch tool is available on the Claude API at **no additional cost**. You only pay standard token costs for the fetched content that becomes part of your conversation context.

To protect against inadvertently fetching large content that would consume excessive tokens, use the `max_content_tokens` parameter to set appropriate limits based on your use case and budget considerations.

Example token usage for typical content:
- Average web page (10KB): ~2,500 tokens
- Large documentation page (100KB): ~25,000 tokens  
- Research paper PDF (500KB): ~125,000 tokens

#### Инструмент компьютерного использования

Computer use follows the standard [tool use pricing](/docs/en/agents-and-tools/tool-use/overview#pricing). When using the computer use tool:

**System prompt overhead**: The computer use beta adds 466-499 tokens to the system prompt

**Computer use tool token usage**:
| Model | Input tokens per tool definition |
| ----- | -------------------------------- |
| Claude 4.x models | 735 tokens |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations)) | 735 tokens |

**Additional token consumption**:
- Screenshot images (see [Vision pricing](/docs/en/build-with-claude/vision))
- Tool execution results returned to Claude

<Note>
If you're also using bash or text editor tools alongside computer use, those tools have their own token costs as documented in their respective pages.
</Note>

## Примеры ценообразования для случаев использования агентов

Понимание ценообразования для приложений агентов имеет решающее значение при разработке с Claude. Эти примеры из реальной жизни могут помочь вам оценить затраты для различных паттернов агентов.

### Пример агента поддержки клиентов

При разработке агента поддержки клиентов вот как могут распределиться затраты:

<Note>
  Пример расчёта для обработки 10 000 билетов поддержки:
  - В среднем ~3 700 токенов на разговор
  - Использование Claude Sonnet 4.5 по цене $3/MTok входные, $15/MTok выходные
  - Общая стоимость: ~$22.20 на 10 000 билетов
</Note>

Для подробного пошагового руководства этого расчёта см. наше [руководство по агенту поддержки клиентов](/docs/ru/about-claude/use-case-guides/customer-support-chat).

### Ценообразование общего рабочего процесса агента

Для более сложных архитектур агентов с несколькими шагами:

1. **Обработка начального запроса**
   - Типичный входной сигнал: 500-1 000 токенов
   - Стоимость обработки: ~$0.003 за запрос

2. **Извлечение памяти и контекста**
   - Извлечённый контекст: 2 000-5 000 токенов
   - Стоимость за извлечение: ~$0.015 за операцию

3. **Планирование и выполнение действий**
   - Токены планирования: 1 000-2 000
   - Обратная связь выполнения: 500-1 000
   - Комбинированная стоимость: ~$0.045 за действие

Для получения подробного руководства по паттернам ценообразования агентов см. наше [руководство по случаям использования агентов](/docs/ru/about-claude/use-case-guides).

### Стратегии оптимизации затрат

При разработке агентов с Claude:

1. **Используйте подходящие модели**: выбирайте Haiku для простых задач, Sonnet для сложного рассуждения
2. **Реализуйте кэширование подсказок**: снизьте затраты для повторяющегося контекста
3. **Пакетные операции**: используйте Batch API для не требующих срочности задач
4. **Мониторьте паттерны использования**: отслеживайте потребление токенов для выявления возможностей оптимизации

<Tip>
  Для приложений агентов с высоким объёмом рассмотрите возможность обращения к нашей [команде корпоративных продаж](https://claude.com/contact-sales) для согласования пользовательского ценообразования.
</Tip>

## Дополнительные соображения по ценообразованию

### Ограничения скорости

Ограничения скорости варьируются в зависимости от уровня использования и влияют на количество запросов, которые вы можете сделать:

- **Уровень 1**: начальное использование с базовыми ограничениями
- **Уровень 2**: увеличенные ограничения для растущих приложений
- **Уровень 3**: более высокие ограничения для установленных приложений
- **Уровень 4**: максимальные стандартные ограничения
- **Enterprise**: доступны пользовательские ограничения

Для получения подробной информации об ограничениях скорости см. нашу [документацию по ограничениям скорости](/docs/ru/api/rate-limits).

Для более высоких ограничений скорости или пользовательских соглашений о ценообразовании [свяжитесь с нашей командой продаж](https://claude.com/contact-sales).

### Скидки за объём

Скидки за объём могут быть доступны для пользователей с высоким объёмом. Они согласовываются в индивидуальном порядке.

- Стандартные уровни используют ценообразование, показанное выше
- Корпоративные клиенты могут [связаться с отделом продаж](mailto:sales@anthropic.com) для получения пользовательского ценообразования
- Скидки для академических и исследовательских целей могут быть доступны

### Корпоративное ценообразование

Для корпоративных клиентов со специфическими потребностями:

- Пользовательские ограничения скорости
- Скидки за объём
- Выделенная поддержка
- Пользовательские условия

Свяжитесь с нашей командой продаж по адресу [sales@anthropic.com](mailto:sales@anthropic.com) или через [Claude Console](/settings/limits) для обсуждения вариантов корпоративного ценообразования.

## Выставление счётов и платежи

- Выставление счётов рассчитывается ежемесячно на основе фактического использования
- Платежи обрабатываются в USD
- Доступны варианты кредитной карты и выставления счётов
- Отслеживание использования доступно в [Claude Console](/)

## Часто задаваемые вопросы

**Как рассчитывается использование токенов?**

Токены — это части текста, которые обрабатывают модели. Как приблизительная оценка, 1 токен составляет примерно 4 символа или 0,75 слова на английском языке. Точное количество варьируется в зависимости от языка и типа контента.

**Есть ли бесплатные уровни или пробные версии?**

Новые пользователи получают небольшое количество бесплатных кредитов для тестирования API. [Свяжитесь с отделом продаж](mailto:sales@anthropic.com) для получения информации о расширенных пробных версиях для корпоративной оценки.

**Как складываются скидки?**

Скидки Batch API и кэширования подсказок можно комбинировать. Например, использование обеих функций вместе обеспечивает значительную экономию затрат по сравнению со стандартными вызовами API.

**Какие методы оплаты принимаются?**

Мы принимаем основные кредитные карты для стандартных учётных записей. Корпоративные клиенты могут организовать выставление счётов и другие методы оплаты.

Для получения дополнительных вопросов о ценообразовании свяжитесь с [support@anthropic.com](mailto:support@anthropic.com).