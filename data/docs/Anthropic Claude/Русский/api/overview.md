# Обзор API

Обзор Claude API, включая аутентификацию, доступные API, клиентские SDK и примеры запросов.

---

Claude API — это RESTful API по адресу `https://api.anthropic.com`, который обеспечивает программный доступ к моделям Claude. Основной API — это Messages API (`POST /v1/messages`) для диалоговых взаимодействий.

<Note>
**Новичок в Claude?** Начните с [Начало работы](/docs/ru/get-started) для предварительных требований и вашего первого вызова API, или см. [Работа с сообщениями](/docs/ru/build-with-claude/working-with-messages) для шаблонов запросов/ответов и примеров.
</Note>

## Предварительные требования

Для использования Claude API вам потребуется:

- Учетная запись [Anthropic Console](https://console.anthropic.com)
- [API ключ](/settings/keys)

Пошаговые инструкции по настройке см. в разделе [Начало работы](/docs/ru/get-started).

## Доступные API

Claude API включает следующие API:

**Общая доступность:**
- **[Messages API](/docs/ru/api/messages)**: Отправляйте сообщения Claude для диалоговых взаимодействий (`POST /v1/messages`)
- **[Message Batches API](/docs/ru/api/creating-message-batches)**: Обрабатывайте большие объемы запросов Messages асинхронно с 50% снижением стоимости (`POST /v1/messages/batches`)
- **[Token Counting API](/docs/ru/api/messages-count-tokens)**: Подсчитывайте токены в сообщении перед отправкой для управления затратами и ограничениями скорости (`POST /v1/messages/count_tokens`)
- **[Models API](/docs/ru/api/models-list)**: Список доступных моделей Claude и их деталей (`GET /v1/models`)

**Бета:**
- **[Files API](/docs/ru/api/files-create)**: Загружайте и управляйте файлами для использования в нескольких вызовах API (`POST /v1/files`, `GET /v1/files`)
- **[Skills API](/docs/ru/api/skills/create-skill)**: Создавайте и управляйте пользовательскими навыками агента (`POST /v1/skills`, `GET /v1/skills`)

Для полного справочника API со всеми конечными точками, параметрами и схемами ответов изучите страницы справочника API, указанные в навигации. Для доступа к бета-функциям см. [Бета-заголовки](/docs/ru/api/beta-headers).

## Аутентификация

Все запросы к Claude API должны включать эти заголовки:

| Заголовок | Значение | Обязательно |
|--------|-------|----------|
| `x-api-key` | Ваш API ключ из Console | Да |
| `anthropic-version` | Версия API (например, `2023-06-01`) | Да |
| `content-type` | `application/json` | Да |

Если вы используете [Client SDKs](#client-sdks), SDK будет отправлять эти заголовки автоматически. Для деталей версионирования API см. [Версии API](/docs/ru/api/versioning).

### Получение API ключей

API доступен через веб-[Console](https://console.anthropic.com/). Вы можете использовать [Workbench](https://console.anthropic.com/workbench) для тестирования API в браузере, а затем создать API ключи в [Параметрах учетной записи](https://console.anthropic.com/settings/keys). Используйте [рабочие пространства](https://console.anthropic.com/settings/workspaces) для разделения ваших API ключей и [контроля расходов](/docs/ru/api/rate-limits) по вариантам использования.

## Client SDKs

Anthropic предоставляет официальные SDK, которые упрощают интеграцию API, обрабатывая аутентификацию, форматирование запросов, обработку ошибок и многое другое.

**Преимущества**:
- Автоматическое управление заголовками (x-api-key, anthropic-version, content-type)
- Безопасная обработка запросов и ответов по типам
- Встроенная логика повторных попыток и обработка ошибок
- Поддержка потоковой передачи
- Тайм-ауты запросов и управление подключениями

**Пример** (Python):
```python
from anthropic import Anthropic

client = Anthropic()  # Reads ANTHROPIC_API_KEY from environment
message = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello, Claude"}]
)
```

Для списка клиентских SDK и их соответствующих инструкций по установке см. [Client SDKs](/docs/ru/api/client-sdks).

## Claude API против платформ третьих сторон

Claude доступен через прямой API Anthropic и через партнерские платформы. Выбирайте на основе вашей инфраструктуры, требований соответствия и предпочтений по цене.

### Claude API

- **Прямой доступ** к последним моделям и функциям в первую очередь
- **Выставление счетов и поддержка Anthropic**
- **Лучше всего для**: Новые интеграции, полный доступ к функциям, прямые отношения с Anthropic

### API платформ третьих сторон

Доступ к Claude через AWS, Google Cloud или Microsoft Azure:
- **Интегрировано** с выставлением счетов и IAM поставщика облачных услуг
- **Может быть задержка функций** или различия от прямого API
- **Лучше всего для**: Существующие обязательства облачных услуг, специфические требования соответствия, консолидированное выставление счетов облачных услуг

| Платформа | Поставщик | Документация |
|----------|----------|---------------|
| Amazon Bedrock | AWS | [Claude на Amazon Bedrock](/docs/ru/build-with-claude/claude-on-amazon-bedrock) |
| Vertex AI | Google Cloud | [Claude на Vertex AI](/docs/ru/build-with-claude/claude-on-vertex-ai) |
| Azure AI | Microsoft Azure | [Claude на Azure AI](/docs/ru/build-with-claude/claude-in-microsoft-foundry) |

<Note>
Для доступности функций на разных платформах см. [Обзор функций](/docs/ru/build-with-claude/overview).
</Note>

## Формат запроса и ответа

### Ограничения размера запроса

API имеет различные максимальные размеры запросов в зависимости от конечной точки:

| Конечная точка | Максимальный размер |
|----------|--------------|
| Стандартные конечные точки (Messages, Token Counting) | 32 МБ |
| [Batch API](/docs/ru/build-with-claude/batch-processing) | 256 МБ |
| [Files API](/docs/ru/build-with-claude/files) | 500 МБ |

Если вы превысите эти ограничения, вы получите ошибку 413 `request_too_large`.

### Заголовки ответа

Claude API включает следующие заголовки в каждый ответ:

- `request-id`: Глобально уникальный идентификатор для запроса
- `anthropic-organization-id`: ID организации, связанный с API ключом, используемым в запросе

## Ограничения скорости и доступность

### Ограничения скорости

API применяет ограничения скорости и ограничения расходов для предотвращения злоупотреблений и управления емкостью. Ограничения организованы в уровни использования, которые автоматически увеличиваются по мере использования API. Каждый уровень имеет:

- **Ограничения расходов**: Максимальная ежемесячная стоимость использования API
- **Ограничения скорости**: Максимальное количество запросов в минуту (RPM) и токенов в минуту (TPM)

Вы можете просмотреть текущие ограничения вашей организации в [Console](/settings/limits). Для более высоких ограничений или Priority Tier (улучшенные уровни обслуживания с обязательными расходами) свяжитесь с отделом продаж через Console.

Для подробной информации об ограничениях, уровнях и алгоритме ведра токенов, используемом для ограничения скорости, см. [Ограничения скорости](/docs/ru/api/rate-limits).

### Доступность

Claude API доступен во [многих странах и регионах](/docs/ru/api/supported-regions) по всему миру. Проверьте страницу поддерживаемых регионов, чтобы подтвердить доступность в вашем местоположении.

## Базовый пример

Вот минимальный запрос с использованием Messages API:

```bash
curl https://api.anthropic.com/v1/messages \
  --header "x-api-key: $ANTHROPIC_API_KEY" \
  --header "anthropic-version: 2023-06-01" \
  --header "content-type: application/json" \
  --data '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "Hello, Claude"}
    ]
  }'
```

**Ответ:**
```json
{
  "id": "msg_01XFDUDYJgAACzvnptvVoYEL",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "Hello! How can I assist you today?"
    }
  ],
  "model": "claude-sonnet-4-5",
  "stop_reason": "end_turn",
  "usage": {
    "input_tokens": 12,
    "output_tokens": 8
  }
}
```

Для полных примеров и учебников см. [Начало работы](/docs/ru/get-started) и [Работа с сообщениями](/docs/ru/build-with-claude/working-with-messages).

## Следующие шаги

<CardGroup cols={3}>
  <Card title="Начало работы" icon="rocket" href="/docs/ru/get-started">
    Предварительные требования, пошаговое руководство и примеры на нескольких языках
  </Card>
  <Card title="Работа с сообщениями" icon="message" href="/docs/ru/build-with-claude/working-with-messages">
    Шаблоны запросов/ответов, многооборотные диалоги и лучшие практики
  </Card>
  <Card title="Справочник Messages API" icon="book" href="/docs/ru/api/messages">
    Полная спецификация API: параметры, ответы и коды ошибок
  </Card>
  <Card title="Client SDKs" icon="code" href="/docs/ru/api/client-sdks">
    Руководства по установке для Python, TypeScript, Java, Go, C#, Ruby и PHP
  </Card>
  <Card title="Обзор функций" icon="grid" href="/docs/ru/build-with-claude/overview">
    Изучите возможности: кэширование, зрение, использование инструментов, потоковая передача и многое другое
  </Card>
  <Card title="Ограничения скорости" icon="gauge" href="/docs/ru/api/rate-limits">
    Уровни использования, ограничения расходов и ограничение скорости с алгоритмом ведра токенов
  </Card>
</CardGroup>