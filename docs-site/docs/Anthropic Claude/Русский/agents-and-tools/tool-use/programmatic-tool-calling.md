# Программный вызов инструментов

Позволяет Claude писать код, который вызывает ваши инструменты программно в контейнере выполнения кода, сокращая задержку и потребление токенов

---

Программный вызов инструментов позволяет Claude писать код, который вызывает ваши инструменты программно в контейнере [выполнения кода](/docs/ru/agents-and-tools/tool-use/code-execution-tool), вместо того чтобы требовать обратные проходы через модель для каждого вызова инструмента. Это снижает задержку для многоинструментальных рабочих процессов и уменьшает потребление токенов, позволяя Claude фильтровать или обрабатывать данные перед тем, как они попадут в контекстное окно модели.

<Note>
Программный вызов инструментов в настоящее время находится в открытой бета-версии.

Чтобы использовать эту функцию, добавьте [бета-заголовок](/docs/ru/api/beta-headers) `"advanced-tool-use-2025-11-20"` к вашим запросам API.

Эта функция требует включения инструмента выполнения кода.
</Note>

## Совместимость моделей

Программный вызов инструментов доступен на следующих моделях:

| Модель | Версия инструмента |
|-------|--------------|
| Claude Opus 4.5 (`claude-opus-4-5-20251101`) | `code_execution_20250825` |
| Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`) | `code_execution_20250825` |

<Warning>
Программный вызов инструментов доступен через Claude API и Microsoft Foundry.
</Warning>

## Быстрый старт

Вот простой пример, где Claude программно запрашивает базу данных несколько раз и агрегирует результаты:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: advanced-tool-use-2025-11-20" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": "Query sales data for the West, East, and Central regions, then tell me which region had the highest revenue"
            }
        ],
        "tools": [
            {
                "type": "code_execution_20250825",
                "name": "code_execution"
            },
            {
                "name": "query_database",
                "description": "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "sql": {
                            "type": "string",
                            "description": "SQL query to execute"
                        }
                    },
                    "required": ["sql"]
                },
                "allowed_callers": ["code_execution_20250825"]
            }
        ]
    }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Query sales data for the West, East, and Central regions, then tell me which region had the highest revenue"
    }],
    tools=[
        {
            "type": "code_execution_20250825",
            "name": "code_execution"
        },
        {
            "name": "query_database",
            "description": "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
            "input_schema": {
                "type": "object",
                "properties": {
                    "sql": {
                        "type": "string",
                        "description": "SQL query to execute"
                    }
                },
                "required": ["sql"]
            },
            "allowed_callers": ["code_execution_20250825"]
        }
    ]
)

print(response)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

async function main() {
  const response = await anthropic.beta.messages.create({
    model: "claude-sonnet-4-5",
    betas: ["advanced-tool-use-2025-11-20"],
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: "Query sales data for the West, East, and Central regions, then tell me which region had the highest revenue"
      }
    ],
    tools: [
      {
        type: "code_execution_20250825",
        name: "code_execution"
      },
      {
        name: "query_database",
        description: "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
        input_schema: {
          type: "object",
          properties: {
            sql: {
              type: "string",
              description: "SQL query to execute"
            }
          },
          required: ["sql"]
        },
        allowed_callers: ["code_execution_20250825"]
      }
    ]
  });

  console.log(response);
}

main().catch(console.error);
```
</CodeGroup>

## Как работает программный вызов инструментов

Когда вы настраиваете инструмент для вызова из выполнения кода и Claude решает использовать этот инструмент:

1. Claude пишет код на Python, который вызывает инструмент как функцию, потенциально включая несколько вызовов инструментов и логику предварительной/постобработки
2. Claude запускает этот код в изолированном контейнере через выполнение кода
3. Когда вызывается функция инструмента, выполнение кода приостанавливается и API возвращает блок `tool_use`
4. Вы предоставляете результат инструмента, и выполнение кода продолжается (промежуточные результаты не загружаются в контекстное окно Claude)
5. После завершения всего выполнения кода Claude получает окончательный результат и продолжает работу над задачей

Этот подход особенно полезен для:
- **Обработка больших данных**: Фильтруйте или агрегируйте результаты инструментов перед тем, как они попадут в контекст Claude
- **Многошаговые рабочие процессы**: Сэкономьте токены и задержку, вызывая инструменты последовательно или в цикле без выборки Claude между вызовами инструментов
- **Условная логика**: Принимайте решения на основе промежуточных результатов инструментов

<Note>
Пользовательские инструменты преобразуются в асинхронные функции Python для поддержки параллельного вызова инструментов. Когда Claude пишет код, который вызывает ваши инструменты, он использует `await` (например, `result = await query_database("<sql>")`) и автоматически включает соответствующую асинхронную функцию-обертку.

Асинхронная обертка опущена из примеров кода в этой документации для ясности.
</Note>

## Основные концепции

### Поле `allowed_callers`

Поле `allowed_callers` указывает, какие контексты могут вызывать инструмент:

```json
{
  "name": "query_database",
  "description": "Execute a SQL query against the database",
  "input_schema": {...},
  "allowed_callers": ["code_execution_20250825"]
}
```

**Возможные значения:**
- `["direct"]` - Только Claude может вызывать этот инструмент напрямую (по умолчанию, если опущено)
- `["code_execution_20250825"]` - Вызываемо только из выполнения кода
- `["direct", "code_execution_20250825"]` - Вызываемо как напрямую, так и из выполнения кода

<Tip>
Мы рекомендуем выбирать либо `["direct"]`, либо `["code_execution_20250825"]` для каждого инструмента, а не включать оба, так как это обеспечивает более четкое руководство Claude по использованию инструмента.
</Tip>

### Поле `caller` в ответах

Каждый блок использования инструмента включает поле `caller`, указывающее, как он был вызван:

**Прямой вызов (традиционное использование инструмента):**
```json
{
  "type": "tool_use",
  "id": "toolu_abc123",
  "name": "query_database",
  "input": {"sql": "\<sql\>"},
  "caller": {"type": "direct"}
}
```

**Программный вызов:**
```json
{
  "type": "tool_use",
  "id": "toolu_xyz789",
  "name": "query_database",
  "input": {"sql": "\<sql\>"},
  "caller": {
    "type": "code_execution_20250825",
    "tool_id": "srvtoolu_abc123"
  }
}
```

`tool_id` ссылается на инструмент выполнения кода, который сделал программный вызов.

### Жизненный цикл контейнера

Программный вызов инструментов использует те же контейнеры, что и выполнение кода:

- **Создание контейнера**: Новый контейнер создается для каждой сессии, если вы не повторно используете существующий
- **Истечение**: Контейнеры истекают примерно через 4,5 минуты неактивности (может измениться)
- **ID контейнера**: Возвращается в ответах через поле `container`
- **Повторное использование**: Передайте ID контейнера для сохранения состояния между запросами

<Warning>
Когда инструмент вызывается программно и контейнер ожидает результат вашего инструмента, вы должны ответить до истечения контейнера. Отслеживайте поле `expires_at`. Если контейнер истечет, Claude может рассматривать вызов инструмента как истекший по времени и повторить его.
</Warning>

## Пример рабочего процесса

Вот как работает полный поток программного вызова инструментов:

### Шаг 1: Начальный запрос

Отправьте запрос с выполнением кода и инструментом, который позволяет программный вызов. Чтобы включить программный вызов, добавьте поле `allowed_callers` к определению вашего инструмента.

<Note>
Предоставьте подробные описания формата вывода вашего инструмента в описании инструмента. Если вы указываете, что инструмент возвращает JSON, Claude попытается десериализовать и обработать результат в коде. Чем больше деталей вы предоставите о схеме вывода, тем лучше Claude сможет обработать ответ программно.
</Note>

<CodeGroup>
```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Query customer purchase history from the last quarter and identify our top 5 customers by revenue"
    }],
    tools=[
        {
            "type": "code_execution_20250825",
            "name": "code_execution"
        },
        {
            "name": "query_database",
            "description": "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
            "input_schema": {...},
            "allowed_callers": ["code_execution_20250825"]
        }
    ]
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  betas: ["advanced-tool-use-2025-11-20"],
  max_tokens: 4096,
  messages: [{
    role: "user",
    content: "Query customer purchase history from the last quarter and identify our top 5 customers by revenue"
  }],
  tools: [
    {
      type: "code_execution_20250825",
      name: "code_execution"
    },
    {
      name: "query_database",
      description: "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
      input_schema: {...},
      allowed_callers: ["code_execution_20250825"]
    }
  ]
});
```
</CodeGroup>

### Шаг 2: Ответ API с вызовом инструмента

Claude пишет код, который вызывает ваш инструмент. API приостанавливается и возвращает:

```json
{
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "I'll query the purchase history and analyze the results."
    },
    {
      "type": "server_tool_use",
      "id": "srvtoolu_abc123",
      "name": "code_execution",
      "input": {
        "code": "results = await query_database('<sql>')\ntop_customers = sorted(results, key=lambda x: x['revenue'], reverse=True)[:5]\nprint(f'Top 5 customers: {top_customers}')"
      }
    },
    {
      "type": "tool_use",
      "id": "toolu_def456",
      "name": "query_database",
      "input": {"sql": "\<sql\>"},
      "caller": {
        "type": "code_execution_20250825",
        "tool_id": "srvtoolu_abc123"
      }
    }
  ],
  "container": {
    "id": "container_xyz789",
    "expires_at": "2025-01-15T14:30:00Z"
  },
  "stop_reason": "tool_use"
}
```

### Шаг 3: Предоставление результата инструмента

Включите полную историю разговора плюс результат вашего инструмента:

<CodeGroup>
```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=4096,
    container="container_xyz789",  # Reuse the container
    messages=[
        {"role": "user", "content": "Query customer purchase history from the last quarter and identify our top 5 customers by revenue"},
        {
            "role": "assistant",
            "content": [
                {"type": "text", "text": "I'll query the purchase history and analyze the results."},
                {
                    "type": "server_tool_use",
                    "id": "srvtoolu_abc123",
                    "name": "code_execution",
                    "input": {"code": "..."}
                },
                {
                    "type": "tool_use",
                    "id": "toolu_def456",
                    "name": "query_database",
                    "input": {"sql": "\<sql\>"},
                    "caller": {
                        "type": "code_execution_20250825",
                        "tool_id": "srvtoolu_abc123"
                    }
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "tool_result",
                    "tool_use_id": "toolu_def456",
                    "content": "[{\"customer_id\": \"C1\", \"revenue\": 45000}, {\"customer_id\": \"C2\", \"revenue\": 38000}, ...]"
                }
            ]
        }
    ],
    tools=[...]
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  betas: ["advanced-tool-use-2025-11-20"],
  max_tokens: 4096,
  container: "container_xyz789",  // Reuse the container
  messages: [
    { role: "user", content: "Query customer purchase history from the last quarter and identify our top 5 customers by revenue" },
    {
      role: "assistant",
      content: [
        { type: "text", text: "I'll query the purchase history and analyze the results." },
        {
          type: "server_tool_use",
          id: "srvtoolu_abc123",
          name: "code_execution",
          input: { code: "..." }
        },
        {
          type: "tool_use",
          id: "toolu_def456",
          name: "query_database",
          input: { sql: "\<sql\>" },
          caller: {
            type: "code_execution_20250825",
            tool_id: "srvtoolu_abc123"
          }
        }
      ]
    },
    {
      role: "user",
      content: [
        {
          type: "tool_result",
          tool_use_id: "toolu_def456",
          content: "[{\"customer_id\": \"C1\", \"revenue\": 45000}, {\"customer_id\": \"C2\", \"revenue\": 38000}, ...]"
        }
      ]
    }
  ],
  tools: [...]
});
```
</CodeGroup>

### Шаг 4: Следующий вызов инструмента или завершение

Выполнение кода продолжается и обрабатывает результаты. Если требуются дополнительные вызовы инструментов, повторите Шаг 3 до тех пор, пока все вызовы инструментов не будут удовлетворены.

### Шаг 5: Окончательный ответ

После завершения выполнения кода Claude предоставляет окончательный ответ:

```json
{
  "content": [
    {
      "type": "code_execution_tool_result",
      "tool_use_id": "srvtoolu_abc123",
      "content": {
        "type": "code_execution_result",
        "stdout": "Top 5 customers by revenue:\n1. Customer C1: $45,000\n2. Customer C2: $38,000\n3. Customer C5: $32,000\n4. Customer C8: $28,500\n5. Customer C3: $24,000",
        "stderr": "",
        "return_code": 0,
        "content": []
      }
    },
    {
      "type": "text",
      "text": "I've analyzed the purchase history from last quarter. Your top 5 customers generated $167,500 in total revenue, with Customer C1 leading at $45,000."
    }
  ],
  "stop_reason": "end_turn"
}
```

## Продвинутые паттерны

### Пакетная обработка с циклами

Claude может писать код, который эффективно обрабатывает несколько элементов:

```python
# async wrapper omitted for clarity
regions = ["West", "East", "Central", "North", "South"]
results = {}
for region in regions:
    data = await query_database(f"<sql for {region}>")
    results[region] = sum(row["revenue"] for row in data)

# Process results programmatically
top_region = max(results.items(), key=lambda x: x[1])
print(f"Top region: {top_region[0]} with ${top_region[1]:,} in revenue")
```

Этот паттерн:
- Снижает обращения модели с N (по одному на регион) до 1
- Обрабатывает большие наборы результатов программно перед возвратом к Claude
- Экономит токены, возвращая только агрегированные выводы вместо необработанных данных

### Раннее завершение

Claude может остановить обработку, как только будут выполнены критерии успеха:

```python
# async wrapper omitted for clarity
endpoints = ["us-east", "eu-west", "apac"]
for endpoint in endpoints:
    status = await check_health(endpoint)
    if status == "healthy":
        print(f"Found healthy endpoint: {endpoint}")
        break  # Stop early, don't check remaining
```

### Условный выбор инструмента

```python
# async wrapper omitted for clarity
file_info = await get_file_info(path)
if file_info["size"] < 10000:
    content = await read_full_file(path)
else:
    content = await read_file_summary(path)
print(content)
```

### Фильтрация данных

```python
# async wrapper omitted for clarity
logs = await fetch_logs(server_id)
errors = [log for log in logs if "ERROR" in log]
print(f"Found {len(errors)} errors")
for error in errors[-10:]:  # Only return last 10 errors
    print(error)
```

## Формат ответа

### Программный вызов инструмента

Когда выполнение кода вызывает инструмент:

```json
{
  "type": "tool_use",
  "id": "toolu_abc123",
  "name": "query_database",
  "input": {"sql": "\<sql\>"},
  "caller": {
    "type": "code_execution_20250825",
    "tool_id": "srvtoolu_xyz789"
  }
}
```

### Обработка результата инструмента

Результат вашего инструмента передается обратно в выполняющийся код:

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_abc123",
      "content": "[{\"customer_id\": \"C1\", \"revenue\": 45000, \"orders\": 23}, {\"customer_id\": \"C2\", \"revenue\": 38000, \"orders\": 18}, ...]"
    }
  ]
}
```

### Завершение выполнения кода

Когда все вызовы инструментов удовлетворены и код завершается:

```json
{
  "type": "code_execution_tool_result",
  "tool_use_id": "srvtoolu_xyz789",
  "content": {
    "type": "code_execution_result",
    "stdout": "Analysis complete. Top 5 customers identified from 847 total records.",
    "stderr": "",
    "return_code": 0,
    "content": []
  }
}
```

## Обработка ошибок

### Распространенные ошибки

| Ошибка | Описание | Решение |
|-------|-------------|----------|
| `invalid_tool_input` | Входные данные инструмента не соответствуют схеме | Проверьте input_schema вашего инструмента |
| `tool_not_allowed` | Инструмент не позволяет запрашиваемый тип вызывающего | Проверьте, что `allowed_callers` включает правильные контексты |
| `missing_beta_header` | Бета-заголовок PTC не предоставлен | Добавьте оба бета-заголовка к вашему запросу |

### Истечение контейнера во время вызова инструмента

Если ваш инструмент слишком долго отвечает, выполнение кода получит `TimeoutError`. Claude видит это в stderr и обычно повторит попытку:

```json
{
  "type": "code_execution_tool_result",
  "tool_use_id": "srvtoolu_abc123",
  "content": {
    "type": "code_execution_result",
    "stdout": "",
    "stderr": "TimeoutError: Calling tool ['query_database'] timed out.",
    "return_code": 0,
    "content": []
  }
}
```

Чтобы предотвратить истечение времени:
- Отслеживайте поле `expires_at` в ответах
- Реализуйте тайм-ауты для выполнения вашего инструмента
- Рассмотрите возможность разбиения длительных операций на более мелкие части

### Ошибки выполнения инструмента

Если ваш инструмент возвращает ошибку:

```python
# Provide error information in the tool result
{
    "type": "tool_result",
    "tool_use_id": "toolu_abc123",
    "content": "Error: Query timeout - table lock exceeded 30 seconds"
}
```

Код Claude получит эту ошибку и сможет обработать ее соответствующим образом.

## Ограничения и ограничивающие факторы

### Несовместимость функций

- **Структурированные выходы**: Инструменты с `strict: true` не поддерживаются при программном вызове
- **Выбор инструмента**: Вы не можете принудительно вызвать программный вызов конкретного инструмента через `tool_choice`
- **Параллельное использование инструментов**: `disable_parallel_tool_use: true` не поддерживается при программном вызове

### Ограничения инструментов

Следующие инструменты в настоящее время не могут быть вызваны программно, но поддержка может быть добавлена в будущих версиях:

- Веб-поиск
- Веб-выборка
- Инструменты, предоставленные [коннектором MCP](/docs/ru/agents-and-tools/mcp-connector)

### Ограничения форматирования сообщений

При ответе на программные вызовы инструментов существуют строгие требования к форматированию:

**Ответы только с результатом инструмента**: Если есть ожидающие программные вызовы инструментов, ожидающие результатов, ваше сообщение ответа должно содержать **только** блоки `tool_result`. Вы не можете включать никакое текстовое содержимое, даже после результатов инструментов.

```json
// ❌ INVALID - Cannot include text when responding to programmatic tool calls
{
  "role": "user",
  "content": [
    {"type": "tool_result", "tool_use_id": "toolu_01", "content": "[{\"customer_id\": \"C1\", \"revenue\": 45000}]"},
    {"type": "text", "text": "What should I do next?"}  // This will cause an error
  ]
}

// ✅ VALID - Only tool results when responding to programmatic tool calls
{
  "role": "user",
  "content": [
    {"type": "tool_result", "tool_use_id": "toolu_01", "content": "[{\"customer_id\": \"C1\", \"revenue\": 45000}]"}
  ]
}
```

Это ограничение применяется только при ответе на программные (выполнение кода) вызовы инструментов. Для обычных клиентских вызовов инструментов вы можете включать текстовое содержимое после результатов инструментов.

### Ограничения скорости

Программные вызовы инструментов подлежат тем же ограничениям скорости, что и обычные вызовы инструментов. Каждый вызов инструмента из выполнения кода считается отдельным вызовом.

### Проверьте результаты инструментов перед использованием

При реализации пользовательских инструментов, которые будут вызваны программно:

- **Результаты инструментов возвращаются как строки**: Они могут содержать любое содержимое, включая фрагменты кода или исполняемые команды, которые могут быть обработаны средой выполнения.
- **Проверьте результаты внешних инструментов**: Если ваш инструмент возвращает данные из внешних источников или принимает пользовательский ввод, помните об рисках внедрения кода, если вывод будет интерпретирован или выполнен как код.

## Эффективность токенов

Программный вызов инструментов может значительно снизить потребление токенов:

- **Результаты инструментов из программных вызовов не добавляются в контекст Claude** - только окончательный вывод кода
- **Промежуточная обработка происходит в коде** - фильтрация, агрегация и т.д. не потребляют токены модели
- **Несколько вызовов инструментов в одном выполнении кода** - снижает накладные расходы по сравнению с отдельными обращениями к модели

Например, прямой вызов 10 инструментов использует примерно в 10 раз больше токенов, чем их программный вызов и возврат сводки.

## Использование и цены

Программный вызов инструментов использует те же цены, что и выполнение кода. Подробнее см. в разделе [цены выполнения кода](/docs/ru/agents-and-tools/tool-use/code-execution-tool#usage-and-pricing).

<Note>
Подсчет токенов для программных вызовов инструментов: Результаты инструментов из программных вызовов не учитываются в вашем использовании входных/выходных токенов. Учитываются только окончательный результат выполнения кода и ответ Claude.
</Note>

## Лучшие практики

### Дизайн инструмента

- **Предоставьте подробные описания вывода**: Поскольку Claude десериализует результаты инструментов в коде, четко документируйте формат (структура JSON, типы полей и т.д.)
- **Возвращайте структурированные данные**: JSON или другие легко анализируемые форматы лучше всего подходят для программной обработки
- **Держите ответы краткими**: Возвращайте только необходимые данные, чтобы минимизировать накладные расходы на обработку

### Когда использовать программный вызов

**Хорошие варианты использования:**
- Обработка больших наборов данных, где вам нужны только агрегаты или сводки
- Многошаговые рабочие процессы с 3+ зависимыми вызовами инструментов
- Операции, требующие фильтрации, сортировки или преобразования результатов инструментов
- Задачи, где промежуточные данные не должны влиять на рассуждения Claude
- Параллельные операции по многим элементам (например, проверка 50 конечных точек)

**Менее идеальные варианты использования:**
- Одиночные вызовы инструментов с простыми ответами
- Инструменты, которым требуется немедленная обратная связь от пользователя
- Очень быстрые операции, где накладные расходы выполнения кода перевешивают преимущество

### Оптимизация производительности

- **Повторно используйте контейнеры** при выполнении нескольких связанных запросов для сохранения состояния
- **Пакетируйте похожие операции** в одном выполнении кода, когда это возможно

## Устранение неполадок

### Распространенные проблемы

**Ошибка "Tool not allowed"**
- Убедитесь, что определение вашего инструмента включает `"allowed_callers": ["code_execution_20250825"]`
- Проверьте, что вы используете правильные бета-заголовки

**Истечение контейнера**
- Убедитесь, что вы отвечаете на вызовы инструментов в течение жизни контейнера (~4,5 минуты)
- Отслеживайте поле `expires_at` в ответах
- Рассмотрите возможность реализации более быстрого выполнения инструмента

**Проблемы с бета-заголовком**
- Вам нужен заголовок: `"advanced-tool-use-2025-11-20"`

**Результат инструмента не анализируется правильно**
- Убедитесь, что ваш инструмент возвращает строковые данные, которые Claude может десериализовать
- Предоставьте четкую документацию формата вывода в описании вашего инструмента

### Советы по отладке

1. **Логируйте все вызовы инструментов и результаты** для отслеживания потока
2. **Проверьте поле `caller`** для подтверждения программного вызова
3. **Отслеживайте ID контейнеров** для обеспечения правильного повторного использования
4. **Тестируйте инструменты независимо** перед включением программного вызова

## Почему работает программный вызов инструментов

Обучение Claude включает обширное воздействие кода, что делает его эффективным в рассуждении и цепочке вызовов функций. Когда инструменты представлены как вызываемые функции в среде выполнения кода, Claude может использовать эту силу для:

- **Естественного рассуждения о композиции инструментов**: Цепочка операций и обработка зависимостей так же естественно, как написание любого кода на Python
- **Эффективной обработки больших результатов**: Фильтруйте большие выходы инструментов, извлекайте только релевантные данные или записывайте промежуточные результаты в файлы перед возвратом сводок в контекстное окно
- **Значительного снижения задержки**: Исключите накладные расходы на повторную выборку Claude между каждым вызовом инструмента в многошаговых рабочих процессах

Этот подход позволяет использовать рабочие процессы, которые были бы непрактичны при традиционном использовании инструментов — такие как обработка файлов размером более 1M токенов — позволяя Claude работать с данными программно, а не загружать все в контекст разговора.

## Альтернативные реализации

Программный вызов инструментов — это обобщаемый паттерн, который можно реализовать вне управляемого выполнения кода Anthropic. Вот обзор подходов:

### Прямое выполнение на стороне клиента

Предоставьте Claude инструмент выполнения кода и опишите, какие функции доступны в этой среде. Когда Claude вызывает инструмент с кодом, ваше приложение выполняет его локально, где определены эти функции.

**Преимущества:**
- Просто реализовать с минимальной переархитектурой
- Полный контроль над окружением и инструкциями

**Недостатки:**
- Выполняет ненадежный код вне изолированной среды
- Вызовы инструментов могут быть векторами для внедрения кода

**Используйте когда:** Ваше приложение может безопасно выполнять произвольный код, вы хотите простое решение, и управляемое предложение Anthropic не подходит вашим потребностям.

### Самоуправляемое изолированное выполнение

Тот же подход с точки зрения Claude, но код работает в изолированном контейнере с ограничениями безопасности (например, без исходящего сетевого трафика). Если ваши инструменты требуют внешних ресурсов, вам потребуется протокол для выполнения вызовов инструментов вне изолированной среды.

**Преимущества:**
- Безопасный программный вызов инструментов на вашей собственной инфраструктуре
- Полный контроль над средой выполнения

**Недостатки:**
- Сложно строить и поддерживать
- Требует управления как инфраструктурой, так и межпроцессным взаимодействием

**Используйте когда:** Безопасность критична и управляемое решение Anthropic не подходит вашим требованиям.

### Управляемое выполнение Anthropic

Программный вызов инструментов Anthropic — это управляемая версия изолированного выполнения с предпочтительной средой Python, настроенной для Claude. Anthropic обрабатывает управление контейнерами, выполнение кода и безопасное взаимодействие вызова инструмента.

**Преимущества:**
- Безопасно и надежно по умолчанию
- Легко включить с минимальной конфигурацией
- Окружение и инструкции оптимизированы для Claude

Мы рекомендуем использовать управляемое решение Anthropic, если вы используете Claude API.

## Связанные функции

<CardGroup cols={2}>
  <Card title="Инструмент выполнения кода" icon="code" href="/docs/ru/agents-and-tools/tool-use/code-execution-tool">
    Узнайте об основной возможности выполнения кода, которая питает программный вызов инструментов.
  </Card>
  <Card title="Обзор использования инструментов" icon="wrench" href="/docs/ru/agents-and-tools/tool-use/overview">
    Поймите основы использования инструментов с Claude.
  </Card>
  <Card title="Реализация использования инструментов" icon="hammer" href="/docs/ru/agents-and-tools/tool-use/implement-tool-use">
    Пошаговое руководство по реализации инструментов.
  </Card>
</CardGroup>