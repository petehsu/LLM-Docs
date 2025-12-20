# Структурированные выходные данные

Получайте проверенные результаты JSON из рабочих процессов агентов

---

Структурированные выходные данные ограничивают ответы Claude определённой схемой, обеспечивая корректный, анализируемый результат для последующей обработки. Доступны две дополняющие друг друга функции:

- **JSON выходные данные** (`output_format`): Получайте ответ Claude в определённом формате JSON
- **Строгое использование инструментов** (`strict: true`): Гарантируйте проверку схемы для имён инструментов и входных данных

Эти функции можно использовать независимо или вместе в одном запросе.

<Note>
Структурированные выходные данные в настоящее время доступны как функция общедоступной бета-версии в Claude API для Claude Sonnet 4.5, Claude Opus 4.1, Claude Opus 4.5 и Claude Haiku 4.5.

Чтобы использовать эту функцию, установите [заголовок бета-версии](/docs/ru/api/beta-headers) `structured-outputs-2025-11-13`.
</Note>

<Tip>
Поделитесь отзывом, используя эту [форму](https://forms.gle/BFnYc6iCkWoRzFgk7).
</Tip>

## Зачем использовать структурированные выходные данные

Без структурированных выходных данных Claude может генерировать неправильно сформированные ответы JSON или недействительные входные данные инструментов, которые нарушают работу ваших приложений. Даже при тщательном написании подсказок вы можете столкнуться с:
- Ошибками анализа из-за неправильного синтаксиса JSON
- Отсутствующими обязательными полями
- Несогласованными типами данных
- Нарушениями схемы, требующими обработки ошибок и повторных попыток

Структурированные выходные данные гарантируют ответы, соответствующие схеме, благодаря ограниченному декодированию:
- **Всегда корректно**: Больше нет ошибок `JSON.parse()`
- **Типобезопасно**: Гарантированные типы полей и обязательные поля
- **Надёжно**: Повторные попытки не требуются для нарушений схемы

## JSON выходные данные

JSON выходные данные управляют форматом ответа Claude, гарантируя, что Claude возвращает корректный JSON, соответствующий вашей схеме. Используйте JSON выходные данные, когда вам нужно:

- Управлять форматом ответа Claude
- Извлекать данные из изображений или текста
- Генерировать структурированные отчёты
- Форматировать ответы API

### Быстрый старт

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: structured-outputs-2025-11-13" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {
        "role": "user",
        "content": "Extract the key information from this email: John Smith (john@example.com) is interested in our Enterprise plan and wants to schedule a demo for next Tuesday at 2pm."
      }
    ],
    "output_format": {
      "type": "json_schema",
      "schema": {
        "type": "object",
        "properties": {
          "name": {"type": "string"},
          "email": {"type": "string"},
          "plan_interest": {"type": "string"},
          "demo_requested": {"type": "boolean"}
        },
        "required": ["name", "email", "plan_interest", "demo_requested"],
        "additionalProperties": false
      }
    }
  }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    betas=["structured-outputs-2025-11-13"],
    messages=[
        {
            "role": "user",
            "content": "Extract the key information from this email: John Smith (john@example.com) is interested in our Enterprise plan and wants to schedule a demo for next Tuesday at 2pm."
        }
    ],
    output_format={
        "type": "json_schema",
        "schema": {
            "type": "object",
            "properties": {
                "name": {"type": "string"},
                "email": {"type": "string"},
                "plan_interest": {"type": "string"},
                "demo_requested": {"type": "boolean"}
            },
            "required": ["name", "email", "plan_interest", "demo_requested"],
            "additionalProperties": False
        }
    }
)
print(response.content[0].text)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const response = await client.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  betas: ["structured-outputs-2025-11-13"],
  messages: [
    {
      role: "user",
      content: "Extract the key information from this email: John Smith (john@example.com) is interested in our Enterprise plan and wants to schedule a demo for next Tuesday at 2pm."
    }
  ],
  output_format: {
    type: "json_schema",
    schema: {
      type: "object",
      properties: {
        name: { type: "string" },
        email: { type: "string" },
        plan_interest: { type: "string" },
        demo_requested: { type: "boolean" }
      },
      required: ["name", "email", "plan_interest", "demo_requested"],
      additionalProperties: false
    }
  }
});
console.log(response.content[0].text);
```

</CodeGroup>

**Формат ответа:** Корректный JSON, соответствующий вашей схеме в `response.content[0].text`

```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "plan_interest": "Enterprise",
  "demo_requested": true
}
```

### Как это работает

<Steps>
  <Step title="Определите вашу JSON схему">
    Создайте JSON схему, которая описывает структуру, которой должен следовать Claude. Схема использует стандартный формат JSON Schema с некоторыми ограничениями (см. [ограничения JSON Schema](#json-schema-limitations)).
  </Step>
  <Step title="Добавьте параметр output_format">
    Включите параметр `output_format` в ваш запрос API с `type: "json_schema"` и определением вашей схемы.
  </Step>
  <Step title="Включите заголовок бета-версии">
    Добавьте заголовок `anthropic-beta: structured-outputs-2025-11-13` в ваш запрос.
  </Step>
  <Step title="Проанализируйте ответ">
    Ответ Claude будет корректным JSON, соответствующим вашей схеме, возвращённым в `response.content[0].text`.
  </Step>
</Steps>

### Работа с JSON выходными данными в SDK

Python и TypeScript SDK предоставляют вспомогательные функции, которые облегчают работу с JSON выходными данными, включая преобразование схемы, автоматическую проверку и интеграцию с популярными библиотеками схем.

#### Использование Pydantic и Zod

Для разработчиков Python и TypeScript вы можете использовать знакомые инструменты определения схемы, такие как Pydantic и Zod, вместо написания необработанных JSON схем.

<CodeGroup>

```python Python
from pydantic import BaseModel
from anthropic import Anthropic, transform_schema

class ContactInfo(BaseModel):
    name: str
    email: str
    plan_interest: str
    demo_requested: bool

client = Anthropic()

# With .create() - requires transform_schema()
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    betas=["structured-outputs-2025-11-13"],
    messages=[
        {
            "role": "user",
            "content": "Extract the key information from this email: John Smith (john@example.com) is interested in our Enterprise plan and wants to schedule a demo for next Tuesday at 2pm."
        }
    ],
    output_format={
        "type": "json_schema",
        "schema": transform_schema(ContactInfo),
    }
)

print(response.content[0].text)

# With .parse() - can pass Pydantic model directly
response = client.beta.messages.parse(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    betas=["structured-outputs-2025-11-13"],
    messages=[
        {
            "role": "user",
            "content": "Extract the key information from this email: John Smith (john@example.com) is interested in our Enterprise plan and wants to schedule a demo for next Tuesday at 2pm."
        }
    ],
    output_format=ContactInfo,
)

print(response.parsed_output)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod';

const ContactInfoSchema = z.object({
  name: z.string(),
  email: z.string(),
  plan_interest: z.string(),
  demo_requested: z.boolean(),
});

const client = new Anthropic();

const response = await client.beta.messages.parse({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  betas: ["structured-outputs-2025-11-13"],
  messages: [
    {
      role: "user",
      content: "Extract the key information from this email: John Smith (john@example.com) is interested in our Enterprise plan and wants to schedule a demo for next Tuesday at 2pm."
    }
  ],
  output_format: betaZodOutputFormat(ContactInfoSchema),
});

// Automatically parsed and validated
console.log(response.parsed_output);
```

</CodeGroup>

#### Методы, специфичные для SDK

**Python: `client.beta.messages.parse()` (Рекомендуется)**

Метод `parse()` автоматически преобразует вашу модель Pydantic, проверяет ответ и возвращает атрибут `parsed_output`.

<Note>
Метод `parse()` доступен на `client.beta.messages`, а не на `client.messages`.
</Note>

<section title="Пример использования">

```python
from pydantic import BaseModel
import anthropic

class ContactInfo(BaseModel):
    name: str
    email: str
    plan_interest: str

client = anthropic.Anthropic()

response = client.beta.messages.parse(
    model="claude-sonnet-4-5",
    betas=["structured-outputs-2025-11-13"],
    max_tokens=1024,
    messages=[{"role": "user", "content": "..."}],
    output_format=ContactInfo,
)

# Access the parsed output directly
contact = response.parsed_output
print(contact.name, contact.email)
```

</section>

**Python: вспомогательная функция `transform_schema()`**

Для случаев, когда вам нужно вручную преобразовать схемы перед отправкой, или когда вы хотите изменить схему, созданную Pydantic. В отличие от `client.beta.messages.parse()`, которая автоматически преобразует предоставленные схемы, это даёт вам преобразованную схему, чтобы вы могли дополнительно её настроить.

<section title="Пример использования">

```python
from anthropic import transform_schema
from pydantic import TypeAdapter

# First convert Pydantic model to JSON schema, then transform
schema = TypeAdapter(ContactInfo).json_schema()
schema = transform_schema(schema)
# Modify schema if needed
schema["properties"]["custom_field"] = {"type": "string"}

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["structured-outputs-2025-11-13"],
    max_tokens=1024,
    output_format=schema,
    messages=[{"role": "user", "content": "..."}],
)
```

</section>

#### Как работает преобразование SDK

Python и TypeScript SDK автоматически преобразуют схемы с неподдерживаемыми функциями:

1. **Удалите неподдерживаемые ограничения** (например, `minimum`, `maximum`, `minLength`, `maxLength`)
2. **Обновите описания** информацией об ограничениях (например, "Должно быть не менее 100"), когда ограничение не поддерживается напрямую структурированными выходными данными
3. **Добавьте `additionalProperties: false`** ко всем объектам
4. **Отфильтруйте форматы строк** только поддерживаемыми
5. **Проверьте ответы** против вашей исходной схемы (со всеми ограничениями)

Это означает, что Claude получает упрощённую схему, но ваш код по-прежнему применяет все ограничения через проверку.

**Пример:** Поле Pydantic с `minimum: 100` становится простым целым числом в отправляемой схеме, но описание обновляется на "Должно быть не менее 100", и SDK проверяет ответ против исходного ограничения.

### Типичные варианты использования

<section title="Извлечение данных">

Извлекайте структурированные данные из неструктурированного текста:

<CodeGroup>

```python Python
from pydantic import BaseModel
from typing import List

class Invoice(BaseModel):
    invoice_number: str
    date: str
    total_amount: float
    line_items: List[dict]
    customer_name: str

response = client.beta.messages.parse(
    model="claude-sonnet-4-5",
    betas=["structured-outputs-2025-11-13"],
    output_format=Invoice,
    messages=[{"role": "user", "content": f"Extract invoice data from: {invoice_text}"}]
)
```

```typescript TypeScript
import { z } from 'zod';

const InvoiceSchema = z.object({
  invoice_number: z.string(),
  date: z.string(),
  total_amount: z.number(),
  line_items: z.array(z.record(z.any())),
  customer_name: z.string(),
});

const response = await client.beta.messages.parse({
  model: "claude-sonnet-4-5",
  betas: ["structured-outputs-2025-11-13"],
  output_format: InvoiceSchema,
  messages: [{"role": "user", "content": `Extract invoice data from: ${invoiceText}`}]
});
```

</CodeGroup>

</section>

<section title="Классификация">

Классифицируйте контент со структурированными категориями:

<CodeGroup>

```python Python
from pydantic import BaseModel
from typing import List

class Classification(BaseModel):
    category: str
    confidence: float
    tags: List[str]
    sentiment: str

response = client.beta.messages.parse(
    model="claude-sonnet-4-5",
    betas=["structured-outputs-2025-11-13"],
    output_format=Classification,
    messages=[{"role": "user", "content": f"Classify this feedback: {feedback_text}"}]
)
```

```typescript TypeScript
import { z } from 'zod';

const ClassificationSchema = z.object({
  category: z.string(),
  confidence: z.number(),
  tags: z.array(z.string()),
  sentiment: z.string(),
});

const response = await client.beta.messages.parse({
  model: "claude-sonnet-4-5",
  betas: ["structured-outputs-2025-11-13"],
  output_format: ClassificationSchema,
  messages: [{"role": "user", "content": `Classify this feedback: ${feedbackText}`}]
});
```

</CodeGroup>

</section>

<section title="Форматирование ответа API">

Генерируйте готовые к API ответы:

<CodeGroup>

```python Python
from pydantic import BaseModel
from typing import List, Optional

class APIResponse(BaseModel):
    status: str
    data: dict
    errors: Optional[List[dict]]
    metadata: dict

response = client.beta.messages.parse(
    model="claude-sonnet-4-5",
    betas=["structured-outputs-2025-11-13"],
    output_format=APIResponse,
    messages=[{"role": "user", "content": "Process this request: ..."}]
)
```

```typescript TypeScript
import { z } from 'zod';

const APIResponseSchema = z.object({
  status: z.string(),
  data: z.record(z.any()),
  errors: z.array(z.record(z.any())).optional(),
  metadata: z.record(z.any()),
});

const response = await client.beta.messages.parse({
  model: "claude-sonnet-4-5",
  betas: ["structured-outputs-2025-11-13"],
  output_format: APIResponseSchema,
  messages: [{"role": "user", "content": "Process this request: ..."}]
});
```

</CodeGroup>

</section>

## Строгое использование инструментов

Строгое использование инструментов проверяет параметры инструментов, гарантируя, что Claude вызывает ваши функции с правильно типизированными аргументами. Используйте строгое использование инструментов, когда вам нужно:

- Проверять параметры инструментов
- Создавать рабочие процессы агентов
- Обеспечивать типобезопасные вызовы функций
- Обрабатывать сложные инструменты с вложенными свойствами

### Почему строгое использование инструментов важно для агентов

Создание надёжных систем на основе агентов требует гарантированного соответствия схеме. Без строгого режима Claude может вернуть несовместимые типы (`"2"` вместо `2`) или отсутствующие обязательные поля, нарушая ваши функции и вызывая ошибки во время выполнения.

Строгое использование инструментов гарантирует типобезопасные параметры:
- Функции получают правильно типизированные аргументы каждый раз
- Нет необходимости проверять и повторять вызовы инструментов
- Готовые к производству агенты, которые работают последовательно в масштабе

Например, предположим, что система бронирования нуждается в `passengers: int`. Без строгого режима Claude может предоставить `passengers: "two"` или `passengers: "2"`. С `strict: true` ответ всегда будет содержать `passengers: 2`.

### Быстрый старт

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: structured-outputs-2025-11-13" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "What is the weather in San Francisco?"}
    ],
    "tools": [{
      "name": "get_weather",
      "description": "Get the current weather in a given location",
      "strict": true,
      "input_schema": {
        "type": "object",
        "properties": {
          "location": {
            "type": "string",
            "description": "The city and state, e.g. San Francisco, CA"
          },
          "unit": {
            "type": "string",
            "enum": ["celsius", "fahrenheit"]
          }
        },
        "required": ["location"],
        "additionalProperties": false
      }
    }]
  }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    betas=["structured-outputs-2025-11-13"],
    messages=[
        {"role": "user", "content": "What's the weather like in San Francisco?"}
    ],
    tools=[
        {
            "name": "get_weather",
            "description": "Get the current weather in a given location",
            "strict": True,  # Enable strict mode
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "The city and state, e.g. San Francisco, CA"
                    },
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"],
                        "description": "The unit of temperature, either 'celsius' or 'fahrenheit'"
                    }
                },
                "required": ["location"],
                "additionalProperties": False
            }
        }
    ]
)
print(response.content)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const response = await client.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  betas: ["structured-outputs-2025-11-13"],
  messages: [
    {
      role: "user",
      content: "What's the weather like in San Francisco?"
    }
  ],
  tools: [{
    name: "get_weather",
    description: "Get the current weather in a given location",
    strict: true,  // Enable strict mode
    input_schema: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "The city and state, e.g. San Francisco, CA"
        },
        unit: {
          type: "string",
          enum: ["celsius", "fahrenheit"]
        }
      },
      required: ["location"],
      additionalProperties: false
    }
  }]
});
console.log(response.content);
```

</CodeGroup>

**Формат ответа:** Блоки использования инструментов с проверенными входными данными в `response.content[x].input`

```json
{
  "type": "tool_use",
  "name": "get_weather",
  "input": {
    "location": "San Francisco, CA"
  }
}
```

**Гарантии:**
- Входные данные инструмента `input` строго следуют `input_schema`
- Имя инструмента `name` всегда корректно (из предоставленных инструментов или серверных инструментов)

### Как это работает

<Steps>
  <Step title="Определите схему вашего инструмента">
    Создайте JSON схему для `input_schema` вашего инструмента. Схема использует стандартный формат JSON Schema с некоторыми ограничениями (см. [ограничения JSON Schema](#json-schema-limitations)).
  </Step>
  <Step title="Добавьте strict: true">
    Установите `"strict": true` как свойство верхнего уровня в определении вашего инструмента, рядом с `name`, `description` и `input_schema`.
  </Step>
  <Step title="Включите заголовок бета-версии">
    Добавьте заголовок `anthropic-beta: structured-outputs-2025-11-13` в ваш запрос.
  </Step>
  <Step title="Обработайте вызовы инструментов">
    Когда Claude использует инструмент, поле `input` в блоке tool_use будет строго следовать вашему `input_schema`, и `name` всегда будет корректным.
  </Step>
</Steps>

### Типичные варианты использования

<section title="Проверенные входные данные инструментов">

Убедитесь, что параметры инструментов точно соответствуют вашей схеме:

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["structured-outputs-2025-11-13"],
    messages=[{"role": "user", "content": "Search for flights to Tokyo"}],
    tools=[{
        "name": "search_flights",
        "strict": True,
        "input_schema": {
            "type": "object",
            "properties": {
                "destination": {"type": "string"},
                "departure_date": {"type": "string", "format": "date"},
                "passengers": {"type": "integer", "enum": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
            },
            "required": ["destination", "departure_date"],
            "additionalProperties": False
        }
    }]
)
```

```typescript TypeScript
const response = await client.beta.messages.create({
  model: "claude-sonnet-4-5",
  betas: ["structured-outputs-2025-11-13"],
  messages: [{"role": "user", "content": "Search for flights to Tokyo"}],
  tools: [{
    name: "search_flights",
    strict: true,
    input_schema: {
      type: "object",
      properties: {
        destination: {type: "string"},
        departure_date: {type: "string", format: "date"},
        passengers: {type: "integer", enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
      },
      required: ["destination", "departure_date"],
      additionalProperties: false
    }
  }]
});
```

</CodeGroup>

</section>

<section title="Рабочий процесс агента с несколькими проверенными инструментами">

Создавайте надёжные многошаговые агенты с гарантированными параметрами инструментов:

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["structured-outputs-2025-11-13"],
    messages=[{"role": "user", "content": "Help me plan a trip to Paris for 2 people"}],
    tools=[
        {
            "name": "search_flights",
            "strict": True,
            "input_schema": {
                "type": "object",
                "properties": {
                    "origin": {"type": "string"},
                    "destination": {"type": "string"},
                    "departure_date": {"type": "string", "format": "date"},
                    "travelers": {"type": "integer", "enum": [1, 2, 3, 4, 5, 6]}
                },
                "required": ["origin", "destination", "departure_date"],
                "additionalProperties": False
            }
        },
        {
            "name": "search_hotels",
            "strict": True,
            "input_schema": {
                "type": "object",
                "properties": {
                    "city": {"type": "string"},
                    "check_in": {"type": "string", "format": "date"},
                    "guests": {"type": "integer", "enum": [1, 2, 3, 4]}
                },
                "required": ["city", "check_in"],
                "additionalProperties": False
            }
        }
    ]
)
```

```typescript TypeScript
const response = await client.beta.messages.create({
  model: "claude-sonnet-4-5",
  betas: ["structured-outputs-2025-11-13"],
  messages: [{"role": "user", "content": "Help me plan a trip to Paris for 2 people"}],
  tools: [
    {
      name: "search_flights",
      strict: true,
      input_schema: {
        type: "object",
        properties: {
          origin: {type: "string"},
          destination: {type: "string"},
          departure_date: {type: "string", format: "date"},
          travelers: {type: "integer", enum: [1, 2, 3, 4, 5, 6]}
        },
        required: ["origin", "destination", "departure_date"],
        additionalProperties: false
      }
    },
    {
      name: "search_hotels",
      strict: true,
      input_schema: {
        type: "object",
        properties: {
          city: {type: "string"},
          check_in: {type: "string", format: "date"},
          guests: {type: "integer", enum: [1, 2, 3, 4]}
        },
        required: ["city", "check_in"],
        additionalProperties: false
      }
    }
  ]
});
```

</CodeGroup>

</section>

## Использование обеих функций вместе

JSON выходные данные и строгое использование инструментов решают разные проблемы и могут использоваться вместе:

- **JSON выходные данные** управляют форматом ответа Claude (что говорит Claude)
- **Строгое использование инструментов** проверяет параметры инструментов (как Claude вызывает ваши функции)

При объединении Claude может вызывать инструменты с гарантированно корректными параметрами И возвращать структурированные ответы JSON. Это полезно для рабочих процессов агентов, где вам нужны как надёжные вызовы инструментов, так и структурированные финальные выходные данные.

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["structured-outputs-2025-11-13"],
    max_tokens=1024,
    messages=[{"role": "user", "content": "Help me plan a trip to Paris for next month"}],
    # JSON outputs: structured response format
    output_format={
        "type": "json_schema",
        "schema": {
            "type": "object",
            "properties": {
                "summary": {"type": "string"},
                "next_steps": {"type": "array", "items": {"type": "string"}}
            },
            "required": ["summary", "next_steps"],
            "additionalProperties": False
        }
    },
    # Strict tool use: guaranteed tool parameters
    tools=[{
        "name": "search_flights",
        "strict": True,
        "input_schema": {
            "type": "object",
            "properties": {
                "destination": {"type": "string"},
                "date": {"type": "string", "format": "date"}
            },
            "required": ["destination", "date"],
            "additionalProperties": False
        }
    }]
)
```

```typescript TypeScript
const response = await client.beta.messages.create({
  model: "claude-sonnet-4-5",
  betas: ["structured-outputs-2025-11-13"],
  max_tokens: 1024,
  messages: [{ role: "user", content: "Help me plan a trip to Paris for next month" }],
  // JSON outputs: structured response format
  output_format: {
    type: "json_schema",
    schema: {
      type: "object",
      properties: {
        summary: { type: "string" },
        next_steps: { type: "array", items: { type: "string" } }
      },
      required: ["summary", "next_steps"],
      additionalProperties: false
    }
  },
  // Strict tool use: guaranteed tool parameters
  tools: [{
    name: "search_flights",
    strict: true,
    input_schema: {
      type: "object",
      properties: {
        destination: { type: "string" },
        date: { type: "string", format: "date" }
      },
      required: ["destination", "date"],
      additionalProperties: false
    }
  }]
});
```

</CodeGroup>

## Важные соображения

### Компиляция грамматики и кэширование

Структурированные выходные данные используют ограниченную выборку с скомпилированными артефактами грамматики. Это вводит некоторые характеристики производительности, о которых следует знать:

- **Задержка первого запроса**: При первом использовании определённой схемы будет дополнительная задержка во время компиляции грамматики
- **Автоматическое кэширование**: Скомпилированные грамматики кэшируются в течение 24 часов с момента последнего использования, что делает последующие запросы намного быстрее
- **Инвалидация кэша**: Кэш инвалидируется, если вы измените:
  - Структуру JSON схемы
  - Набор инструментов в вашем запросе (при использовании как структурированных выходных данных, так и использования инструментов)
  - Изменение только полей `name` или `description` не инвалидирует кэш

### Модификация подсказки и стоимость токенов

При использовании структурированных выходных данных Claude автоматически получает дополнительную системную подсказку, объясняющую ожидаемый формат выходных данных. Это означает:

- Количество входных токенов будет немного выше
- Внедрённая подсказка стоит вам токенов, как и любая другая системная подсказка
- Изменение параметра `output_format` инвалидирует любой [кэш подсказок](/docs/ru/build-with-claude/prompt-caching) для этого потока разговора

### Ограничения JSON Schema

Структурированные выходные данные поддерживают стандартный JSON Schema с некоторыми ограничениями. Как JSON выходные данные, так и строгое использование инструментов имеют эти ограничения.

<section title="Поддерживаемые функции">

- Все базовые типы: object, array, string, integer, number, boolean, null
- `enum` (только строки, числа, логические значения или нули - не сложные типы)
- `const`
- `anyOf` и `allOf` (с ограничениями - `allOf` с `$ref` не поддерживается)
- `$ref`, `$def` и `definitions` (внешний `$ref` не поддерживается)
- Свойство `default` для всех поддерживаемых типов
- `required` и `additionalProperties` (должно быть установлено на `false` для объектов)
- Форматы строк: `date-time`, `time`, `date`, `duration`, `email`, `hostname`, `uri`, `ipv4`, `ipv6`, `uuid`
- Массив `minItems` (поддерживаются только значения 0 и 1)

</section>

<section title="Не поддерживается">

- Рекурсивные схемы
- Сложные типы в перечислениях
- Внешний `$ref` (например, `'$ref': 'http://...'`)
- Числовые ограничения (`minimum`, `maximum`, `multipleOf` и т.д.)
- Ограничения строк (`minLength`, `maxLength`)
- Ограничения массива сверх `minItems` 0 или 1
- `additionalProperties` установлено на что-либо иное, чем `false`

Если вы используете неподдерживаемую функцию, вы получите ошибку 400 с деталями.

</section>

<section title="Поддержка шаблонов (regex)">

**Поддерживаемые функции regex:**
- Полное совпадение (`^...$`) и частичное совпадение
- Квантификаторы: `*`, `+`, `?`, простые случаи `{n,m}`
- Классы символов: `[]`, `.`, `\d`, `\w`, `\s`
- Группы: `(...)`

**НЕ поддерживается:**
- Обратные ссылки на группы (например, `\1`, `\2`)
- Утверждения lookahead/lookbehind (например, `(?=...)`, `(?!...)`)
- Границы слов: `\b`, `\B`
- Сложные квантификаторы `{n,m}` с большими диапазонами

Простые шаблоны regex работают хорошо. Сложные шаблоны могут привести к ошибкам 400.

</section>

<Tip>
Python и TypeScript SDK могут автоматически преобразовывать схемы с неподдерживаемыми функциями, удаляя их и добавляя ограничения к описаниям полей. Подробности см. в разделе [методы, специфичные для SDK](#sdk-specific-methods).
</Tip>

### Недействительные выходные данные

Хотя структурированные выходные данные гарантируют соответствие схеме в большинстве случаев, есть сценарии, когда выходные данные могут не соответствовать вашей схеме:

**Отказы** (`stop_reason: "refusal"`)

Claude сохраняет свои свойства безопасности и полезности даже при использовании структурированных выходных данных. Если Claude отказывает в запросе по причинам безопасности:

- Ответ будет иметь `stop_reason: "refusal"`
- Вы получите код состояния 200
- Вам будут выставлены счета за созданные токены
- Выходные данные могут не соответствовать вашей схеме, потому что сообщение об отказе имеет приоритет над ограничениями схемы

**Достигнут лимит токенов** (`stop_reason: "max_tokens"`)

Если ответ обрезан из-за достижения лимита `max_tokens`:

- Ответ будет иметь `stop_reason: "max_tokens"`
- Выходные данные могут быть неполными и не соответствовать вашей схеме
- Повторите попытку с более высоким значением `max_tokens`, чтобы получить полные структурированные выходные данные

### Ошибки проверки схемы

Если ваша схема использует неподдерживаемые функции или слишком сложна, вы получите ошибку 400:

**"Too many recursive definitions in schema"**
- Причина: Схема имеет чрезмерные или циклические рекурсивные определения
- Решение: Упростите структуру схемы, уменьшите глубину вложенности

**"Schema is too complex"**
- Причина: Схема превышает пределы сложности
- Решение: Разбейте на меньшие схемы, упростите структуру или уменьшите количество инструментов, отмеченных как `strict: true`

Для постоянных проблем с корректными схемами [свяжитесь с поддержкой](https://support.claude.com/en/articles/9015913-how-to-get-support) с определением вашей схемы.

## Совместимость функций

**Работает с:**
- **[Пакетная обработка](/docs/ru/build-with-claude/batch-processing)**: Обрабатывайте структурированные выходные данные в масштабе со скидкой 50%
- **[Подсчёт токенов](/docs/ru/build-with-claude/token-counting)**: Подсчитывайте токены без компиляции
- **[Потоковая передача](/docs/ru/build-with-claude/streaming)**: Потоковая передача структурированных выходных данных как обычных ответов
- **Комбинированное использование**: Используйте JSON выходные данные (`output_format`) и строгое использование инструментов (`strict: true`) вместе в одном запросе

**Несовместимо с:**
- **[Цитаты](/docs/ru/build-with-claude/citations)**: Цитаты требуют чередования блоков цитат с текстом, что конфликтует с ограничениями строгой JSON схемы. Возвращает ошибку 400, если цитаты включены с `output_format`.
- **[Предзаполнение сообщений](/docs/ru/build-with-claude/prompt-engineering/prefill-claudes-response)**: Несовместимо с JSON выходными данными

<Tip>
**Область действия грамматики**: Грамматики применяются только к прямому выходу Claude, а не к вызовам инструментов, результатам инструментов или тегам мышления (при использовании [Extended Thinking](/docs/ru/build-with-claude/extended-thinking)). Состояние грамматики сбрасывается между разделами, позволяя Claude свободно думать, при этом всё ещё производя структурированный выход в финальном ответе.
</Tip>