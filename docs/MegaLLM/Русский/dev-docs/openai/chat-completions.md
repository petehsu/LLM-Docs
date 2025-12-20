# Chat Completions

> Chat Completions API позволяет вам создавать разговорные приложения с использованием моделей GPT. Отправляйте список сообщений и получайте AI-сгенерированный ответ.

<APIPage operations={[{path: "/chat/completions", method: "post"}]} />

## Базовое использование

<Tabs>
  <Tab title="Python">
    ```python  theme={null}
    from openai import OpenAI

    client = OpenAI(
        base_url="https://ai.megallm.io/v1",
        api_key="your-api-key"
    )

    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "What's the weather like?"}
        ],
        temperature=0.7,
        max_tokens=150
    )

    print(response.choices[0].message.content)
    ```
  </Tab>

  <Tab title="JavaScript">
    ```javascript  theme={null}
    import OpenAI from 'openai';

    const openai = new OpenAI({
      baseURL: 'https://ai.megallm.io/v1',
      apiKey: process.env.MEGALLM_API_KEY,
    });

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: "What's the weather like?" }
      ],
      temperature: 0.7,
      max_tokens: 150
    });

    console.log(response.choices[0].message.content);
    ```
  </Tab>

  <Tab title="cURL">
    ```bash  theme={null}
    curl https://ai.megallm.io/v1/chat/completions \
      -H "Authorization: Bearer $MEGALLM_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "model": "gpt-4",
        "messages": [
          {"role": "system", "content": "You are a helpful assistant."},
          {"role": "user", "content": "What'\''s the weather like?"}
        ],
        "temperature": 0.7,
        "max_tokens": 150
      }'
    ```
  </Tab>

  <Tab title="Go">
    ```go  theme={null}
    package main

    import (
        "context"
        openai "github.com/sashabaranov/go-openai"
    )

    func main() {
        config := openai.DefaultConfig("your-api-key")
        config.BaseURL = "https://ai.megallm.io/v1"
        client := openai.NewClientWithConfig(config)

        resp, err := client.CreateChatCompletion(
            context.Background(),
            openai.ChatCompletionRequest{
                Model: "gpt-4",
                Messages: []openai.ChatCompletionMessage{
                    {
                        Role:    "system",
                        Content: "You are a helpful assistant.",
                    },
                    {
                        Role:    "user",
                        Content: "What's the weather like?",
                    },
                },
                Temperature: 0.7,
                MaxTokens:   150,
            },
        )

        if err != nil {
            panic(err)
        }

        println(resp.Choices[0].Message.Content)
    }
    ```
  </Tab>
</Tabs>

## Расширенные возможности

### Роли сообщений

API поддерживает различные роли сообщений для контекста разговора:

| Роль        | Описание                           | Пример                           |
| ----------- | ---------------------------------- | -------------------------------- |
| `system`    | Устанавливает поведение и контекст | "You are a helpful assistant"    |
| `user`      | Ввод пользователя/вопросы          | "What's the capital of France?"  |
| `assistant` | Ответы AI                          | "The capital of France is Paris" |
| `tool`      | Результаты инструментов/функций    | Function execution results       |

### Контроль температуры

Настройте креативность ответов с помощью параметра temperature:

```python  theme={null}
# Более детерминированный (0.0 - 0.3)
response = client.chat.completions.create(
    model="gpt-4",
    messages=[...],
    temperature=0.2  # Более сфокусированные, последовательные ответы
)

# Сбалансированный (0.4 - 0.7)
response = client.chat.completions.create(
    model="gpt-4",
    messages=[...],
    temperature=0.5  # Сбалансированная креативность и связность
)

# Более креативный (0.8 - 1.0)
response = client.chat.completions.create(
    model="gpt-4",
    messages=[...],
    temperature=0.9  # Более разнообразные, креативные ответы
)
```

### Многоходовые разговоры

Поддержание контекста через несколько обменов:

```python  theme={null}
messages = [
    {"role": "system", "content": "You are a math tutor."},
    {"role": "user", "content": "What is 15 * 12?"},
    {"role": "assistant", "content": "15 * 12 = 180"},
    {"role": "user", "content": "Now divide that by 6"}
]

response = client.chat.completions.create(
    model="gpt-4",
    messages=messages
)
# Ответ понимает, что "that" относится к 180
```

### Поддержка изображений

Обработка изображений вместе с текстом (требуются модели с поддержкой vision):

```python  theme={null}
response = client.chat.completions.create(
    model="gpt-4-vision",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "What's in this image?"},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": "https://example.com/image.jpg",
                        "detail": "high"  # "low", "high", или "auto"
                    }
                }
            ]
        }
    ],
    max_tokens=300
)
```

## Формат ответа

### Стандартный ответ

```json  theme={null}
{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "created": 1677858242,
  "model": "gpt-4",
  "usage": {
    "prompt_tokens": 13,
    "completion_tokens": 17,
    "total_tokens": 30
  },
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "The capital of France is Paris."
      },
      "finish_reason": "stop",
      "index": 0
    }
  ]
}
```

### Причины завершения

| Причина          | Описание                     |
| ---------------- | ---------------------------- |
| `stop`           | Естественное завершение      |
| `length`         | Достигнут лимит max\_tokens  |
| `tool_calls`     | Модель хочет вызвать функцию |
| `content_filter` | Контент был отфильтрован     |

## Лучшие практики

<Tip>
  **Системные сообщения**: Всегда включайте четкое системное сообщение для установки поведения и контекста AI.
</Tip>

### Оптимизация токенов

```python  theme={null}
# Подсчет токенов перед отправкой
import tiktoken

encoding = tiktoken.encoding_for_model("gpt-4")
tokens = encoding.encode("Your message here")
print(f"Token count: {len(tokens)}")

# Усечение при необходимости
if len(tokens) > 1000:
    truncated = encoding.decode(tokens[:1000])
```

### Обработка ошибок

```python  theme={null}
try:
    response = client.chat.completions.create(...)
except openai.APIError as e:
    print(f"API error: {e}")
except openai.RateLimitError as e:
    print(f"Rate limit hit: {e}")
    # Реализуйте экспоненциальную задержку
except openai.APIConnectionError as e:
    print(f"Connection error: {e}")
    # Повторите попытку с задержкой
```

## Распространенные паттерны

### Суммаризация

```python  theme={null}
response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": "You are a summarization expert."},
        {"role": "user", "content": f"Summarize this text in 3 bullet points: {long_text}"}
    ],
    temperature=0.3,
    max_tokens=150
)
```

### Классификация

```python  theme={null}
response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": "Classify the sentiment as positive, negative, or neutral."},
        {"role": "user", "content": "I love this product! It works great."}
    ],
    temperature=0.0,
    max_tokens=10
)
```

### Генерация кода

```python  theme={null}
response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": "You are a Python expert."},
        {"role": "user", "content": "Write a function to calculate fibonacci numbers"}
    ],
    temperature=0.2,
    max_tokens=500
)
```

## Ограничение скорости

Реализуйте правильное ограничение скорости для избежания ошибок:

```python  theme={null}
import time
from typing import Optional

class RateLimiter:
    def __init__(self, requests_per_minute: int = 60):
        self.requests_per_minute = requests_per_minute
        self.request_times = []

    def wait_if_needed(self):
        now = time.time()
        # Удалить запросы старше 1 минуты
        self.request_times = [t for t in self.request_times if now - t < 60]

        if len(self.request_times) >= self.requests_per_minute:
            sleep_time = 60 - (now - self.request_times[0])
            if sleep_time > 0:
                time.sleep(sleep_time)

        self.request_times.append(now)

# Использование
limiter = RateLimiter(60)

for prompt in prompts:
    limiter.wait_if_needed()
    response = client.chat.completions.create(...)
```

## Следующие шаги

* Узнайте о [потоковой передаче](/ru/dev-docs/openai/streaming) для ответов в реальном времени
* Изучите [вызов функций](/ru/dev-docs/openai/function-calling) для интеграции инструментов
* Реализуйте [структурированный вывод](/ru/openai/structured-output) для валидированных JSON-ответов


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt