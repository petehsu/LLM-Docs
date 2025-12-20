# MCP коннектор

Подключайтесь к удалённым MCP серверам непосредственно из Messages API без отдельного MCP клиента

---

Функция коннектора Model Context Protocol (MCP) Claude позволяет подключаться к удалённым MCP серверам непосредственно из Messages API без отдельного MCP клиента.

<Note>
  **Текущая версия**: Эта функция требует бета-заголовок: `"anthropic-beta": "mcp-client-2025-11-20"`

  Предыдущая версия (`mcp-client-2025-04-04`) устарела. См. [документацию устаревшей версии](#deprecated-version-mcp-client-2025-04-04) ниже.
</Note>

## Ключевые возможности

- **Прямая интеграция API**: Подключайтесь к MCP серверам без реализации MCP клиента
- **Поддержка вызовов инструментов**: Получайте доступ к инструментам MCP через Messages API
- **Гибкая конфигурация инструментов**: Включайте все инструменты, добавляйте в список разрешённых определённые инструменты или добавляйте в чёрный список нежелательные инструменты
- **Конфигурация для каждого инструмента**: Настраивайте отдельные инструменты с пользовательскими параметрами
- **Аутентификация OAuth**: Поддержка токенов OAuth Bearer для аутентифицированных серверов
- **Несколько серверов**: Подключайтесь к нескольким MCP серверам в одном запросе

## Ограничения

- Из набора функций [спецификации MCP](https://modelcontextprotocol.io/introduction#explore-mcp) в настоящее время поддерживаются только [вызовы инструментов](https://modelcontextprotocol.io/docs/concepts/tools).
- Сервер должен быть открыт через HTTP (поддерживает как транспорты Streamable HTTP, так и SSE). Локальные STDIO серверы не могут быть подключены напрямую.
- Коннектор MCP в настоящее время не поддерживается на Amazon Bedrock и Google Vertex.

## Использование MCP коннектора в Messages API

Коннектор MCP использует два компонента:

1. **Определение MCP сервера** (массив `mcp_servers`): Определяет детали подключения сервера (URL, аутентификация)
2. **Набор инструментов MCP** (массив `tools`): Настраивает, какие инструменты включить и как их настроить

### Базовый пример

Этот пример включает все инструменты с MCP сервера с конфигурацией по умолчанию:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: mcp-client-2025-11-20" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1000,
    "messages": [{"role": "user", "content": "What tools do you have available?"}],
    "mcp_servers": [
      {
        "type": "url",
        "url": "https://example-server.modelcontextprotocol.io/sse",
        "name": "example-mcp",
        "authorization_token": "YOUR_TOKEN"
      }
    ],
    "tools": [
      {
        "type": "mcp_toolset",
        "mcp_server_name": "example-mcp"
      }
    ]
  }'
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1000,
  messages: [
    {
      role: "user",
      content: "What tools do you have available?",
    },
  ],
  mcp_servers: [
    {
      type: "url",
      url: "https://example-server.modelcontextprotocol.io/sse",
      name: "example-mcp",
      authorization_token: "YOUR_TOKEN",
    },
  ],
  tools: [
    {
      type: "mcp_toolset",
      mcp_server_name: "example-mcp",
    },
  ],
  betas: ["mcp-client-2025-11-20"],
});
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1000,
    messages=[{
        "role": "user",
        "content": "What tools do you have available?"
    }],
    mcp_servers=[{
        "type": "url",
        "url": "https://mcp.example.com/sse",
        "name": "example-mcp",
        "authorization_token": "YOUR_TOKEN"
    }],
    tools=[{
        "type": "mcp_toolset",
        "mcp_server_name": "example-mcp"
    }],
    betas=["mcp-client-2025-11-20"]
)
```
</CodeGroup>

## Конфигурация MCP сервера

Каждый MCP сервер в массиве `mcp_servers` определяет детали подключения:

```json
{
  "type": "url",
  "url": "https://example-server.modelcontextprotocol.io/sse",
  "name": "example-mcp",
  "authorization_token": "YOUR_TOKEN"
}
```

### Описание полей

| Свойство | Тип | Обязательно | Описание |
|----------|------|----------|-------------|
| `type` | string | Да | В настоящее время поддерживается только "url" |
| `url` | string | Да | URL MCP сервера. Должен начинаться с https:// |
| `name` | string | Да | Уникальный идентификатор для этого MCP сервера. Должен быть указан ровно одним MCPToolset в массиве `tools`. |
| `authorization_token` | string | Нет | OAuth токен авторизации, если требуется MCP сервером. См. [спецификацию MCP](https://modelcontextprotocol.io/specification/2025-03-26/basic/authorization). |

## Конфигурация набора инструментов MCP

MCPToolset находится в массиве `tools` и настраивает, какие инструменты с MCP сервера включены и как они должны быть настроены.

### Базовая структура

```json
{
  "type": "mcp_toolset",
  "mcp_server_name": "example-mcp",
  "default_config": {
    "enabled": true,
    "defer_loading": false
  },
  "configs": {
    "specific_tool_name": {
      "enabled": true,
      "defer_loading": true
    }
  }
}
```

### Описание полей

| Свойство | Тип | Обязательно | Описание |
|----------|------|----------|-------------|
| `type` | string | Да | Должно быть "mcp_toolset" |
| `mcp_server_name` | string | Да | Должно совпадать с именем сервера, определённым в массиве `mcp_servers` |
| `default_config` | object | Нет | Конфигурация по умолчанию, применяемая ко всем инструментам в этом наборе. Отдельные конфигурации инструментов в `configs` переопределят эти значения по умолчанию. |
| `configs` | object | Нет | Переопределения конфигурации для каждого инструмента. Ключи — имена инструментов, значения — объекты конфигурации. |
| `cache_control` | object | Нет | Конфигурация точки разрыва кэша для этого набора инструментов |

### Параметры конфигурации инструмента

Каждый инструмент (настроенный ли в `default_config` или в `configs`) поддерживает следующие поля:

| Свойство | Тип | По умолчанию | Описание |
|----------|------|---------|-------------|
| `enabled` | boolean | `true` | Включен ли этот инструмент |
| `defer_loading` | boolean | `false` | Если true, описание инструмента не отправляется модели изначально. Используется с [инструментом поиска инструментов](/agents-and-tools/tool-search-tool). |

### Слияние конфигурации

Значения конфигурации объединяются с этим приоритетом (от высшего к низшему):

1. Параметры для конкретного инструмента в `configs`
2. `default_config` уровня набора
3. Системные значения по умолчанию

Пример:

```json
{
  "type": "mcp_toolset",
  "mcp_server_name": "google-calendar-mcp",
  "default_config": {
    "defer_loading": true
  },
  "configs": {
    "search_events": {
      "enabled": false
    }
  }
}
```

Результаты:
- `search_events`: `enabled: false` (из configs), `defer_loading: true` (из default_config)
- Все остальные инструменты: `enabled: true` (системное значение по умолчанию), `defer_loading: true` (из default_config)

## Общие шаблоны конфигурации

### Включить все инструменты с конфигурацией по умолчанию

Самый простой шаблон — включить все инструменты с сервера:

```json
{
  "type": "mcp_toolset",
  "mcp_server_name": "google-calendar-mcp",
}
```

### Список разрешённых — Включить только определённые инструменты

Установите `enabled: false` по умолчанию, затем явно включите определённые инструменты:

```json
{
  "type": "mcp_toolset",
  "mcp_server_name": "google-calendar-mcp",
  "default_config": {
    "enabled": false
  },
  "configs": {
    "search_events": {
      "enabled": true
    },
    "create_event": {
      "enabled": true
    }
  }
}
```

### Чёрный список — Отключить определённые инструменты

Включите все инструменты по умолчанию, затем явно отключите нежелательные инструменты:

```json
{
  "type": "mcp_toolset",
  "mcp_server_name": "google-calendar-mcp",
  "configs": {
    "delete_all_events": {
      "enabled": false
    },
    "share_calendar_publicly": {
      "enabled": false
    }
  }
}
```

### Смешанный — Список разрешённых с конфигурацией для каждого инструмента

Объедините список разрешённых с пользовательской конфигурацией для каждого инструмента:

```json
{
  "type": "mcp_toolset",
  "mcp_server_name": "google-calendar-mcp",
  "default_config": {
    "enabled": false,
    "defer_loading": true
  },
  "configs": {
    "search_events": {
      "enabled": true,
      "defer_loading": false
    },
    "list_events": {
      "enabled": true
    }
  }
}
```

В этом примере:
- `search_events` включен с `defer_loading: false`
- `list_events` включен с `defer_loading: true` (унаследовано из default_config)
- Все остальные инструменты отключены

## Правила валидации

API применяет эти правила валидации:

- **Сервер должен существовать**: `mcp_server_name` в MCPToolset должен совпадать с сервером, определённым в массиве `mcp_servers`
- **Сервер должен быть использован**: Каждый MCP сервер, определённый в `mcp_servers`, должен быть указан ровно одним MCPToolset
- **Уникальный набор инструментов на сервер**: Каждый MCP сервер может быть указан только одним MCPToolset
- **Неизвестные имена инструментов**: Если имя инструмента в `configs` не существует на MCP сервере, предупреждение регистрируется в бэкенде, но ошибка не возвращается (MCP серверы могут иметь динамическую доступность инструментов)

## Типы содержимого ответа

Когда Claude использует инструменты MCP, ответ будет включать два новых типа блоков содержимого:

### Блок использования инструмента MCP

```json
{
  "type": "mcp_tool_use",
  "id": "mcptoolu_014Q35RayjACSWkSj4X2yov1",
  "name": "echo",
  "server_name": "example-mcp",
  "input": { "param1": "value1", "param2": "value2" }
}
```

### Блок результата инструмента MCP

```json
{
  "type": "mcp_tool_result",
  "tool_use_id": "mcptoolu_014Q35RayjACSWkSj4X2yov1",
  "is_error": false,
  "content": [
    {
      "type": "text",
      "text": "Hello"
    }
  ]
}
```

## Несколько MCP серверов

Вы можете подключиться к нескольким MCP серверам, включив несколько определений серверов в `mcp_servers` и соответствующий MCPToolset для каждого в массиве `tools`:

```json
{
  "model": "claude-sonnet-4-5",
  "max_tokens": 1000,
  "messages": [
    {
      "role": "user",
      "content": "Use tools from both mcp-server-1 and mcp-server-2 to complete this task"
    }
  ],
  "mcp_servers": [
    {
      "type": "url",
      "url": "https://mcp.example1.com/sse",
      "name": "mcp-server-1",
      "authorization_token": "TOKEN1"
    },
    {
      "type": "url",
      "url": "https://mcp.example2.com/sse",
      "name": "mcp-server-2",
      "authorization_token": "TOKEN2"
    }
  ],
  "tools": [
    {
      "type": "mcp_toolset",
      "mcp_server_name": "mcp-server-1"
    },
    {
      "type": "mcp_toolset",
      "mcp_server_name": "mcp-server-2",
      "default_config": {
        "defer_loading": true
      }
    }
  ]
}
```

## Аутентификация

Для MCP серверов, требующих аутентификацию OAuth, вам нужно получить токен доступа. Бета-версия коннектора MCP поддерживает передачу параметра `authorization_token` в определении MCP сервера.
Потребители API должны обрабатывать поток OAuth и получить токен доступа перед выполнением вызова API, а также обновлять токен по мере необходимости.

### Получение токена доступа для тестирования

Инспектор MCP может помочь вам в процессе получения токена доступа для целей тестирования.

1. Запустите инспектор с помощью следующей команды. На вашей машине должен быть установлен Node.js.

   ```bash
   npx @modelcontextprotocol/inspector
   ```

2. На боковой панели слева для "Transport type" выберите либо "SSE", либо "Streamable HTTP".
3. Введите URL MCP сервера.
4. В правой области нажмите кнопку "Open Auth Settings" после "Need to configure authentication?".
5. Нажмите "Quick OAuth Flow" и авторизуйтесь на экране OAuth.
6. Следуйте шагам в разделе "OAuth Flow Progress" инспектора и нажимайте "Continue" до достижения "Authentication complete".
7. Скопируйте значение `access_token`.
8. Вставьте его в поле `authorization_token` в конфигурацию вашего MCP сервера.

### Использование токена доступа

После получения токена доступа, используя любой из потоков OAuth выше, вы можете использовать его в конфигурации вашего MCP сервера:

```json
{
  "mcp_servers": [
    {
      "type": "url",
      "url": "https://example-server.modelcontextprotocol.io/sse",
      "name": "authenticated-server",
      "authorization_token": "YOUR_ACCESS_TOKEN_HERE"
    }
  ]
}
```

Для подробных объяснений потока OAuth обратитесь к [разделу Authorization](https://modelcontextprotocol.io/docs/concepts/authentication) в спецификации MCP.

## Руководство по миграции

Если вы используете устаревший бета-заголовок `mcp-client-2025-04-04`, следуйте этому руководству для миграции на новую версию.

### Ключевые изменения

1. **Новый бета-заголовок**: Измените с `mcp-client-2025-04-04` на `mcp-client-2025-11-20`
2. **Конфигурация инструментов перемещена**: Конфигурация инструментов теперь находится в массиве `tools` как объекты MCPToolset, а не в определении MCP сервера
3. **Более гибкая конфигурация**: Новый шаблон поддерживает списки разрешённых, чёрные списки и конфигурацию для каждого инструмента

### Шаги миграции

**До (устарело):**

```json
{
  "model": "claude-sonnet-4-5",
  "max_tokens": 1000,
  "messages": [...],
  "mcp_servers": [
    {
      "type": "url",
      "url": "https://mcp.example.com/sse",
      "name": "example-mcp",
      "authorization_token": "YOUR_TOKEN",
      "tool_configuration": {
        "enabled": true,
        "allowed_tools": ["tool1", "tool2"]
      }
    }
  ]
}
```

**После (текущее):**

```json
{
  "model": "claude-sonnet-4-5",
  "max_tokens": 1000,
  "messages": [...],
  "mcp_servers": [
    {
      "type": "url",
      "url": "https://mcp.example.com/sse",
      "name": "example-mcp",
      "authorization_token": "YOUR_TOKEN"
    }
  ],
  "tools": [
    {
      "type": "mcp_toolset",
      "mcp_server_name": "example-mcp",
      "default_config": {
        "enabled": false
      },
      "configs": {
        "tool1": {
          "enabled": true
        },
        "tool2": {
          "enabled": true
        }
      }
    }
  ]
}
```

### Общие шаблоны миграции

| Старый шаблон | Новый шаблон |
|-------------|-------------|
| Нет `tool_configuration` (все инструменты включены) | MCPToolset без `default_config` или `configs` |
| `tool_configuration.enabled: false` | MCPToolset с `default_config.enabled: false` |
| `tool_configuration.allowed_tools: [...]` | MCPToolset с `default_config.enabled: false` и определёнными инструментами, включёнными в `configs` |

## Устаревшая версия: mcp-client-2025-04-04

<Note type="warning">
  Эта версия устарела. Пожалуйста, выполните миграцию на `mcp-client-2025-11-20`, используя [руководство по миграции](#migration-guide) выше.
</Note>

Предыдущая версия коннектора MCP включала конфигурацию инструментов непосредственно в определение MCP сервера:

```json
{
  "mcp_servers": [
    {
      "type": "url",
      "url": "https://example-server.modelcontextprotocol.io/sse",
      "name": "example-mcp",
      "authorization_token": "YOUR_TOKEN",
      "tool_configuration": {
        "enabled": true,
        "allowed_tools": ["example_tool_1", "example_tool_2"]
      }
    }
  ]
}
```

### Описание устаревших полей

| Свойство | Тип | Описание |
|----------|------|-------------|
| `tool_configuration` | object | **Устарело**: Используйте MCPToolset в массиве `tools` вместо этого |
| `tool_configuration.enabled` | boolean | **Устарело**: Используйте `default_config.enabled` в MCPToolset |
| `tool_configuration.allowed_tools` | array | **Устарело**: Используйте шаблон списка разрешённых с `configs` в MCPToolset |