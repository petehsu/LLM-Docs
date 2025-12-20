# Аутентификация

> MegaLLM использует API-ключи для аутентификации. Это руководство охватывает все методы аутентификации и лучшие практики.

## Методы аутентификации

### Bearer Token

Наиболее распространенный метод аутентификации - использование Bearer токена в заголовке Authorization:

```http  theme={null}
Authorization: Bearer YOUR_API_KEY
```

### Заголовок API-ключа (формат Anthropic)

Для Anthropic-совместимых эндпоинтов вы также можете использовать заголовок `x-api-key`:

```http  theme={null}
x-api-key: YOUR_API_KEY
```

## Получение вашего API-ключа

<Steps>
  <Step title="Метод через панель управления">
    Рекомендуемый метод получения API-ключа - через панель управления MegaLLM:

    1. Посетите [megallm.io/dashboard](https://megallm.io/dashboard/overview)
    2. Перейдите в раздел API Keys
    3. Нажмите "Create New API Key"
    4. Скопируйте ключ (начинается с `sk-mega-`) и сохраните его безопасно
  </Step>

  <Step title="CLI-инструмент">
    Если у вас установлен MegaLLM CLI:

    ```bash  theme={null}
    npx megallm@latest
    ```

    Следуйте интерактивным подсказкам для настройки вашего API-ключа.
  </Step>
</Steps>

## Лучшие практики безопасности

<Warning>
  **Никогда не раскрывайте ваши токены**: Всегда храните токены в переменных окружения или защищенных хранилищах, никогда в коде.
</Warning>

### Переменные окружения

<Tabs>
  <Tab title="Linux/Mac">
    ```bash  theme={null}
    # Добавьте в ~/.bashrc или ~/.zshrc
    export MEGALLM_API_KEY="your_api_key_here"

    # Или используйте .env файл
    echo "MEGALLM_API_KEY=your_api_key_here" >> .env
    ```
  </Tab>

  <Tab title="Windows">
    ```powershell  theme={null}
    # Установите переменную окружения
    [System.Environment]::SetEnvironmentVariable("MEGALLM_API_KEY", "your_api_key_here", "User")

    # Или используйте командную строку
    setx MEGALLM_API_KEY "your_api_key_here"
    ```
  </Tab>

  <Tab title="Docker">
    ```dockerfile  theme={null}
    # В Dockerfile
    ENV MEGALLM_API_KEY=${MEGALLM_API_KEY}

    # Или в docker-compose.yml
    environment:
      - MEGALLM_API_KEY=${MEGALLM_API_KEY}
    ```
  </Tab>
</Tabs>

## Использование SDK

### OpenAI SDK

```python  theme={null}
from openai import OpenAI

client = OpenAI(
    base_url="https://ai.megallm.io/v1",
    api_key=os.getenv("MEGALLM_API_KEY")
)

response = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "Hello!"}]
)
```

### Anthropic SDK

```python  theme={null}
from anthropic import Anthropic

client = Anthropic(
    base_url="https://ai.megallm.io",
    api_key=os.getenv("MEGALLM_API_KEY")
)

message = client.messages.create(
    model="claude-3.5-sonnet",
    max_tokens=100,
    messages=[{"role": "user", "content": "Hello!"}]
)
```

### Интеграция LangChain

```python  theme={null}
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(
    base_url="https://ai.megallm.io/v1",
    api_key=os.getenv("MEGALLM_API_KEY"),
    model="gpt-4"
)

response = llm.invoke("Hello!")
```

## Устранение неполадок

### Распространенные ошибки аутентификации

| Код ошибки | Сообщение    | Решение                                                                 |
| ---------- | ------------ | ----------------------------------------------------------------------- |
| 401        | Unauthorized | Проверьте, действителен ли ваш API-ключ и не истек ли срок его действия |
| 403        | Forbidden    | Убедитесь, что API-ключ имеет необходимый доступ                        |
| 429        | Rate Limited | Подождите и повторите попытку или свяжитесь со службой поддержки        |

### Отладка аутентификации

Включите режим отладки для просмотра подробной информации об аутентификации:

```bash  theme={null}
curl https://ai.megallm.io/v1/chat/completions \
  -H "Authorization: Bearer $MEGALLM_API_KEY" \
  -H "X-Debug-Auth: true" \
  -d '{"model": "gpt-4", "messages": [...]}'
```

<Info>
  **Нужна помощь?** Проверьте наш [FAQ](/ru/faq#authentication) или свяжитесь со службой поддержки, если у вас возникли проблемы с аутентификацией.
</Info>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt