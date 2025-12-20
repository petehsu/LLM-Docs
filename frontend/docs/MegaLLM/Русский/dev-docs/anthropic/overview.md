# Anthropic API

> MegaLLM обеспечивает полную совместимость с форматом Claude API от Anthropic, позволяя вам использовать модели Claude через нашу инфраструктуру.

<Info>
  **Базовый URL**: `https://ai.megallm.io` для всех Anthropic-совместимых эндпоинтов
</Info>

## Доступные эндпоинты

<CardGroup cols={2}>
  <Card title="Сообщения" icon="message" href="/ru/dev-docs/anthropic/messages">
    Создавайте разговорные сообщения с моделями Claude
  </Card>

  <Card title="Вызов функций" icon="wrench" href="/ru/api-reference/endpoint/function-calling">
    Позвольте Claude взаимодействовать с внешними инструментами и функциями
  </Card>
</CardGroup>

## Быстрый пример

```python  theme={null}
from anthropic import Anthropic

# Инициализация клиента
client = Anthropic(
    base_url="https://ai.megallm.io",
    api_key="your-api-key"
)

# Создание сообщения
message = client.messages.create(
    model="claude-3.5-sonnet",
    max_tokens=100,
    messages=[
        {
            "role": "user",
            "content": "Explain the theory of relativity in simple terms"
        }
    ]
)

print(message.content[0].text)
```

## Поддерживаемые модели

| ID модели                  | Контекстное окно | Применение                          |
| -------------------------- | ---------------- | ----------------------------------- |
| `claude-opus-4-1-20250805` | 200K токенов     | Сложный анализ, исследования        |
| `claude-3.5-sonnet`        | 200K токенов     | Сбалансированная производительность |
| `claude-3.7-sonnet`        | 200K токенов     | Быстрые, эффективные ответы         |
| `claude-sonnet-4`          | 200K токенов     | Продвинутая генерация               |

## Возможности

### Продвинутые рассуждения

Сложные возможности рассуждений Claude для сложных задач.

### Большое контекстное окно

Обработка до 200K токенов для обширного анализа документов.

### Использование инструментов

Встроенная поддержка вызова функций и интеграции инструментов.

### Возможности работы с изображениями

Анализ изображений и визуального контента наряду с текстом.

## Поддержка SDK

MegaLLM работает с Anthropic-совместимыми SDK:

* **Python**: официальный SDK `anthropic`
* **TypeScript/JavaScript**: `@anthropic-ai/sdk`
* **Go**: Сообщество SDK
* **Ruby**: `anthropic-rb`

## Ключевые отличия от OpenAI

### Формат сообщений

Anthropic использует немного другой формат сообщений:

```python  theme={null}
# Формат Anthropic
messages = [
    {
        "role": "user",
        "content": "Hello, Claude!"
    }
]

# Системные сообщения отдельно
system = "You are a helpful assistant"

message = client.messages.create(
    model="claude-3.5-sonnet",
    max_tokens=100,
    system=system,  # Системный промпт отдельно
    messages=messages
)
```

### Формат ответа

```python  theme={null}
# Структура ответа Anthropic
response = {
    "id": "msg_123",
    "type": "message",
    "role": "assistant",
    "content": [
        {
            "type": "text",
            "text": "Hello! How can I help you today?"
        }
    ],
    "model": "claude-3.5-sonnet",
    "usage": {
        "input_tokens": 10,
        "output_tokens": 25
    }
}
```

### Формат использования инструментов

```python  theme={null}
tools = [
    {
        "name": "get_weather",
        "description": "Get weather for a location",
        "input_schema": {  # Примечание: input_schema, а не parameters
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "City name"
                }
            },
            "required": ["location"]
        }
    }
]
```

## Руководство по миграции

Миграция с Anthropic на MegaLLM:

```python  theme={null}
# До (Anthropic Cloud)
client = Anthropic(api_key="sk-ant-...")

# После (MegaLLM)
client = Anthropic(
    base_url="https://ai.megallm.io",
    api_key="your-api-key"
)
```

Весь ваш существующий код Anthropic продолжает работать!

## Аутентификация

Используйте заголовок `x-api-key` для формата Anthropic:

```bash  theme={null}
curl https://ai.megallm.io/v1/messages \
  -H "x-api-key: $MEGALLM_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-3.5-sonnet",
    "max_tokens": 100,
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'
```

## Ограничения скорости

| Уровень    | Запросов/мин | Токенов/мин  | Одновременно |
| ---------- | ------------ | ------------ | ------------ |
| Basic      | 50           | 100,000      | 10           |
| Pro        | 200          | 400,000      | 40           |
| Enterprise | Настраиваемо | Настраиваемо | Настраиваемо |

## Обработка ошибок

MegaLLM возвращает Anthropic-совместимые ответы об ошибках:

```json  theme={null}
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "max_tokens is required"
  }
}
```

## Расширенные возможности

### История разговора

Поддержание контекста через несколько реплик:

```python  theme={null}
conversation = []

def chat(user_input):
    conversation.append({"role": "user", "content": user_input})

    response = client.messages.create(
        model="claude-3.5-sonnet",
        max_tokens=150,
        messages=conversation
    )

    assistant_message = response.content[0].text
    conversation.append({"role": "assistant", "content": assistant_message})

    return assistant_message

# Использование
print(chat("What's the capital of France?"))
print(chat("What's its population?"))  # Знает, что "его" относится к Парижу
```

### Температура и выборка

Управление креативностью ответов:

```python  theme={null}
# Более детерминированный
response = client.messages.create(
    model="claude-3.5-sonnet",
    max_tokens=100,
    temperature=0.0,  # Очень последовательный
    messages=messages
)

# Более креативный
response = client.messages.create(
    model="claude-3.5-sonnet",
    max_tokens=100,
    temperature=1.0,  # Более разнообразный
    top_p=0.95,       # Nucleus sampling
    messages=messages
)
```

## Сценарии использования

### Анализ документов

```python  theme={null}
def analyze_document(document_text):
    response = client.messages.create(
        model="claude-3-opus-20240229",
        max_tokens=500,
        system="You are a document analysis expert.",
        messages=[
            {
                "role": "user",
                "content": f"""Analyze this document and provide:
                1. Main topics
                2. Key insights
                3. Summary

                Document: {document_text}"""
            }
        ]
    )
    return response.content[0].text
```

### Обзор кода

````python  theme={null}
def review_code(code):
    response = client.messages.create(
        model="claude-3.5-sonnet",
        max_tokens=800,
        system="You are an expert code reviewer.",
        messages=[
            {
                "role": "user",
                "content": f"""Review this code for:
                - Bugs
                - Performance issues
                - Best practices
                - Security concerns

                Code:
                ```python
                {code}
                ```"""
            }
        ]
    )
    return response.content[0].text
````

<Tip>
  **Совет профессионала**: Claude превосходно справляется с задачами, требующими тщательных рассуждений, понимания длинного контекста и нюансированных ответов.
</Tip>

## Лучшие практики

1. **Используйте системные промпты**: Claude хорошо реагирует на четкие системные инструкции
2. **Используйте контекстное окно**: Воспользуйтесь преимуществом контекста в 200K токенов для больших документов
3. **Структурированные промпты**: Используйте четкое форматирование и нумерованные списки для сложных запросов
4. **Настройки температуры**: Используйте более низкие температуры (0-0.3) для фактических задач
5. **Выбор модели**: Выбирайте Opus для сложных рассуждений, Sonnet для баланса, Haiku для скорости

## Следующие шаги

* Изучите [Messages API](/ru/dev-docs/anthropic/messages) для разговорного ИИ
* Узнайте о [вызове функций](/ru/api-reference/endpoint/function-calling) для использования инструментов
* Реализуйте [потоковую передачу](/ru/api-reference/endpoint/streaming) для ответов в реальном времени


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt