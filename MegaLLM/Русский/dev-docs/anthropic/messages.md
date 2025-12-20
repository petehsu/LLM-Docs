# Сообщения

> Messages API - это основной интерфейс для взаимодействия с моделями Claude. Отправляйте сообщения и получайте AI-сгенерированные ответы с поддержкой разговоров, использования инструментов и работы с изображениями.

## Базовое использование

<CodeGroup>
  ```python Python theme={null}
  from anthropic import Anthropic

  client = Anthropic(
      base_url="https://ai.megallm.io",
      api_key="your-api-key"
  )

  message = client.messages.create(
      model="claude-3.5-sonnet",
      max_tokens=100,
      messages=[
          {
              "role": "user",
              "content": "What are the primary colors?"
          }
      ]
  )

  print(message.content[0].text)
  ```

  ```javascript JavaScript theme={null}
  import Anthropic from '@anthropic-ai/sdk';

  const anthropic = new Anthropic({
    baseURL: 'https://ai.megallm.io',
    apiKey: process.env.MEGALLM_API_KEY,
  });

  const message = await anthropic.messages.create({
    model: 'claude-3-sonnet-20240229',
    max_tokens: 100,
    messages: [
      {
        role: 'user',
        content: 'What are the primary colors?'
      }
    ]
  });

  console.log(message.content[0].text);
  ```

  ```bash cURL theme={null}
  curl https://ai.megallm.io/v1/messages \
    -H "x-api-key: $MEGALLM_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "content-type: application/json" \
    -d '{
      "model": "claude-3-sonnet-20240229",
      "max_tokens": 100,
      "messages": [
        {
          "role": "user",
          "content": "What are the primary colors?"
        }
      ]
    }'
  ```

  ```ruby Ruby theme={null}
  require 'anthropic'

  client = Anthropic::Client.new(
    base_url: 'https://ai.megallm.io',
    api_key: ENV['MEGALLM_API_KEY']
  )

  message = client.messages.create(
    model: 'claude-3-sonnet-20240229',
    max_tokens: 100,
    messages: [
      {
        role: 'user',
        content: 'What are the primary colors?'
      }
    ]
  )

  puts message.content.first.text
  ```
</CodeGroup>

## Структура сообщений

### Типы контента

Сообщения могут содержать различные типы контента:

```python  theme={null}
# Простое текстовое сообщение
message = {
    "role": "user",
    "content": "Hello, Claude!"
}

# Многочастное сообщение с текстом и изображением
message = {
    "role": "user",
    "content": [
        {
            "type": "text",
            "text": "What's in this image?"
        },
        {
            "type": "image",
            "source": {
                "type": "base64",
                "media_type": "image/jpeg",
                "data": "base64_encoded_image_data"
            }
        }
    ]
}
```

### Системные сообщения

Системные сообщения устанавливают поведение ассистента:

```python  theme={null}
message = client.messages.create(
    model="claude-3.5-sonnet",
    max_tokens=200,
    system="""You are a helpful coding assistant.
    Always provide code examples when explaining concepts.
    Use Python unless specified otherwise.""",
    messages=[
        {
            "role": "user",
            "content": "Explain list comprehensions"
        }
    ]
)
```

## Расширенные возможности

### Многоходовые разговоры

Создавайте контекстно-зависимые разговоры:

```python  theme={null}
class Conversation:
    def __init__(self, client, model="claude-3-sonnet-20240229"):
        self.client = client
        self.model = model
        self.messages = []
        self.system = "You are a helpful assistant."

    def add_user_message(self, content):
        self.messages.append({"role": "user", "content": content})

    def get_response(self, max_tokens=200):
        response = self.client.messages.create(
            model=self.model,
            max_tokens=max_tokens,
            system=self.system,
            messages=self.messages
        )

        assistant_content = response.content[0].text
        self.messages.append({"role": "assistant", "content": assistant_content})

        return assistant_content

# Использование
conv = Conversation(client)
conv.system = "You are a math tutor."

print(conv.get_response("What is calculus?"))
print(conv.get_response("Can you give me an example?"))
print(conv.get_response("How is it different from algebra?"))
```

### Предзаполненные ответы

Направляйте формат ответа ассистента:

```python  theme={null}
messages = [
    {"role": "user", "content": "Write a haiku about programming"},
    {"role": "assistant", "content": "Here's a haiku about programming:\n\n"}  # Предзаполнение
]

response = client.messages.create(
    model="claude-3.5-sonnet",
    max_tokens=50,
    messages=messages
)

# Ответ продолжится с предзаполненного контента
```

### Подсчет токенов

Оцените использование токенов перед отправкой:

```python  theme={null}
def estimate_tokens(messages):
    """Приблизительная оценка количества токенов"""
    total = 0
    for message in messages:
        if isinstance(message["content"], str):
            # Приблизительная оценка: 1 токен ≈ 4 символа
            total += len(message["content"]) // 4
        elif isinstance(message["content"], list):
            for part in message["content"]:
                if part["type"] == "text":
                    total += len(part["text"]) // 4
    return total

# Проверка перед отправкой
token_estimate = estimate_tokens(messages)
if token_estimate > 180000:  # Оставляем место для ответа
    print("Warning: Approaching context limit")
```

## Обработка ответов

### Парсинг содержимого ответа

```python  theme={null}
response = client.messages.create(...)

# Обработка различных типов контента
for content_block in response.content:
    if content_block.type == "text":
        print(f"Text: {content_block.text}")
    elif content_block.type == "tool_use":
        print(f"Tool call: {content_block.name}")
        print(f"Arguments: {content_block.input}")
```

### Обработка ошибок

```python  theme={null}
from anthropic import APIError, RateLimitError, APIConnectionError

def safe_message_create(client, **kwargs):
    max_retries = 3
    retry_delay = 1

    for attempt in range(max_retries):
        try:
            return client.messages.create(**kwargs)

        except RateLimitError as e:
            if attempt < max_retries - 1:
                time.sleep(retry_delay * (2 ** attempt))
                continue
            raise e

        except APIConnectionError as e:
            print(f"Connection error: {e}")
            if attempt < max_retries - 1:
                time.sleep(retry_delay)
                continue
            raise e

        except APIError as e:
            print(f"API error: {e}")
            raise e
```

## Распространенные паттерны

### Извлечение структурированных данных

```python  theme={null}
def extract_information(text):
    response = client.messages.create(
        model="claude-3.5-sonnet",
        max_tokens=300,
        system="Extract information and return as JSON.",
        messages=[
            {
                "role": "user",
                "content": f"""Extract the following from this text:
                - Names (list)
                - Dates (list)
                - Locations (list)
                - Key facts (list)

                Return as JSON.

                Text: {text}"""
            }
        ],
        temperature=0  # Согласованное форматирование
    )

    import json
    return json.loads(response.content[0].text)
```

### Перевод

```python  theme={null}
def translate(text, target_language="Spanish"):
    response = client.messages.create(
        model="claude-3.5-sonnet",  # Быстрая модель для перевода
        max_tokens=500,
        messages=[
            {
                "role": "user",
                "content": f"Translate to {target_language}:\n\n{text}"
            }
        ],
        temperature=0.3
    )
    return response.content[0].text
```

### Суммаризация

```python  theme={null}
def summarize(text, style="bullet_points"):
    styles = {
        "bullet_points": "Create a bullet-point summary",
        "paragraph": "Write a concise paragraph summary",
        "executive": "Write an executive summary",
        "eli5": "Explain like I'm 5"
    }

    response = client.messages.create(
        model="claude-3.5-sonnet",
        max_tokens=300,
        system="You are a professional summarizer.",
        messages=[
            {
                "role": "user",
                "content": f"{styles.get(style, styles['bullet_points'])}:\n\n{text}"
            }
        ],
        temperature=0.3
    )
    return response.content[0].text
```

## Лучшие практики

<Tip>
  **Эффективность токенов**: Модели Claude имеют большие контекстные окна, но лаконичность в промптах экономит токены и улучшает время отклика.
</Tip>

### 1. Четкие инструкции

````python  theme={null}
# Хорошо - Четко и конкретно
messages = [{
    "role": "user",
    "content": """Analyze this Python code:
    1. Identify any bugs
    2. Suggest performance improvements
    3. Rate code quality (1-10)

    Code:
    ```python
    def fibonacci(n):
        if n <= 1:
            return n
        return fibonacci(n-1) + fibonacci(n-2)
    ```"""
}]

# Менее эффективно - Расплывчато
messages = [{
    "role": "user",
    "content": "Look at this fibonacci function and tell me about it"
}]
````

### 2. Настройки температуры

```python  theme={null}
# Фактические/аналитические задачи
response = client.messages.create(
    model="claude-3.5-sonnet",
    max_tokens=200,
    temperature=0,  # Детерминированный
    messages=messages
)

# Креативные задачи
response = client.messages.create(
    model="claude-3.5-sonnet",
    max_tokens=200,
    temperature=0.8,  # Более креативный
    messages=messages
)
```

### 3. Выбор модели

| Применение     | Рекомендуемая модель | Почему                              |
| -------------- | -------------------- | ----------------------------------- |
| Сложный анализ | claude-3-opus        | Лучшие рассуждения                  |
| Общие задачи   | claude-3-sonnet      | Сбалансированная производительность |
| Большие объемы | claude-3-haiku       | Быстрая и эффективная               |
| Генерация кода | claude-3-sonnet      | Хороший баланс                      |

## Ограничение скорости

Реализуйте правильное ограничение скорости:

```python  theme={null}
from threading import Lock
from collections import deque
import time

class RateLimiter:
    def __init__(self, max_requests=50, window=60):
        self.max_requests = max_requests
        self.window = window
        self.requests = deque()
        self.lock = Lock()

    def wait_if_needed(self):
        with self.lock:
            now = time.time()
            # Удаление старых запросов
            while self.requests and self.requests[0] < now - self.window:
                self.requests.popleft()

            if len(self.requests) >= self.max_requests:
                sleep_time = self.window - (now - self.requests[0])
                if sleep_time > 0:
                    time.sleep(sleep_time)
                    return self.wait_if_needed()

            self.requests.append(now)

# Использование
rate_limiter = RateLimiter(max_requests=50, window=60)

def create_message(**kwargs):
    rate_limiter.wait_if_needed()
    return client.messages.create(**kwargs)
```

## Следующие шаги

* Узнайте об [использовании инструментов](/ru/anthropic/tool-use) для вызова функций
* Изучите возможности [работы с изображениями](/ru/anthropic/vision)
* Реализуйте [потоковую передачу](/ru/anthropic/streaming) для ответов в реальном времени


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt