# OpenAI API

> MegaLLM обеспечивает полную совместимость с форматом API OpenAI, позволяя вам использовать существующие SDK и инструменты OpenAI без изменений.

<Info>
  **Базовый URL**: `https://ai.megallm.io/v1` для всех OpenAI-совместимых эндпоинтов
</Info>

## Доступные эндпоинты

<CardGroup cols={2}>
  <Card title="Chat Completions" icon="messages" href="/ru/dev-docs/openai/chat-completions">
    Генерируйте разговорные ответы с моделями GPT
  </Card>

  <Card title="Потоковая передача" icon="stream" href="/ru/dev-docs/openai/streaming">
    Потоковые ответы в реальном времени с Server-Sent Events
  </Card>

  <Card title="Вызов функций" icon="function" href="/ru/dev-docs/openai/function-calling">
    Выполняйте функции и инструменты с параллельной поддержкой
  </Card>

  <Card title="Модели" icon="list" href="/ru/home/models">
    Просмотрите доступные модели и возможности
  </Card>
</CardGroup>

## Быстрый пример

```python  theme={null}
from openai import OpenAI

# Инициализация клиента
client = OpenAI(
    base_url="https://ai.megallm.io/v1",
    api_key="your-api-key"
)

# Простое завершение чата
response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Explain quantum computing in simple terms."}
    ],
    temperature=0.7,
    max_tokens=150
)

print(response.choices[0].message.content)
```

## Поддерживаемые модели

| Модель          | Контекстное окно | Применение                           |
| --------------- | ---------------- | ------------------------------------ |
| `gpt-4`         | 8,192 токенов    | Сложные рассуждения, анализ          |
| `gpt-4-32k`     | 32,768 токенов   | Длинные документы, обширный контекст |
| `gpt-4-turbo`   | 128,000 токенов  | Масштабная обработка                 |
| `gpt-3.5-turbo` | 16,385 токенов   | Быстрые, экономичные ответы          |

## Возможности

### Полная совместимость

Замена OpenAI API без изменений - используйте ваш существующий код без изменений.

### Высокая производительность

Быстрое время отклика с оптимизированной инфраструктурой.

### Отслеживание использования

Отслеживайте использование API и затраты.

## Поддержка SDK

MegaLLM работает со всеми OpenAI-совместимыми SDK:

* **Python**: официальный SDK `openai`
* **Node.js**: официальный SDK `openai`
* **Go**: `go-openai`
* **Rust**: `async-openai`
* **Java**: `openai-java`
* **C#**: `OpenAI-DotNet`

## Ограничения скорости

| Уровень    | Запросов/мин | Токенов/мин  |
| ---------- | ------------ | ------------ |
| Basic      | 60           | 90,000       |
| Pro        | 300          | 450,000      |
| Enterprise | Настраиваемо | Настраиваемо |

## Руководство по миграции

Миграция с OpenAI на MegaLLM проста:

```python  theme={null}
# До (OpenAI)
client = OpenAI(api_key="sk-...")

# После (MegaLLM)
client = OpenAI(
    base_url="https://ai.megallm.io/v1",
    api_key="your-api-key"
)
```

Вот и все! Весь ваш существующий код продолжает работать.

## Обработка ошибок

MegaLLM возвращает OpenAI-совместимые ответы об ошибках:

```json  theme={null}
{
  "error": {
    "message": "Invalid request parameter",
    "type": "invalid_request_error",
    "param": "temperature",
    "code": null
  }
}
```

<Tip>
  **Совет профессионала**: Включите режим отладки с заголовком `X-Debug: true` для получения подробной информации об ошибках во время разработки.
</Tip>

## Следующие шаги

* Изучите [Chat Completions](/ru/dev-docs/openai/chat-completions) для разговорного ИИ
* Узнайте о [вызове функций](/ru/dev-docs/openai/function-calling) для интеграции инструментов
* Реализуйте [потоковую передачу](/ru/dev-docs/openai/streaming) для ответов в реальном времени


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt