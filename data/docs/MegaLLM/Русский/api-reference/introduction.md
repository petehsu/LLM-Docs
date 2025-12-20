# Справочник API

> Добро пожаловать в справочную документацию API MegaLLM. MegaLLM предоставляет единый доступ к более чем 70 моделям ИИ через REST API, совместимые с OpenAI и Anthropic.

## Базовые URL

MegaLLM поддерживает два формата API:

<CardGroup cols={2}>
  <Card title="Формат OpenAI" icon="robot">
    ```
    https://ai.megallm.io/v1
    ```

    Совместим с SDK и инструментами OpenAI
  </Card>

  <Card title="Формат Anthropic" icon="message-bot">
    ```
    https://ai.megallm.io
    ```

    Совместим с SDK Anthropic Claude
  </Card>
</CardGroup>

## Аутентификация

Все конечные точки API требуют аутентификации одним из этих методов:

### Bearer токен (рекомендуется)

```http  theme={null}
Authorization: Bearer YOUR_API_KEY
```

### Заголовок API-ключа (формат Anthropic)

```http  theme={null}
x-api-key: YOUR_API_KEY
anthropic-version: 2023-06-01
```

<Info>
  Получите свой API-ключ на [панели MegaLLM](https://megallm.io/dashboard/overview).
</Info>

## Основные конечные точки

<CardGroup cols={2}>
  <Card title="Chat Completions" icon="comments" href="/ru/api-reference/post-chat-completions">
    OpenAI-совместимый чат API с потоковой передачей, вызовом функций и поддержкой зрения
  </Card>

  <Card title="Messages" icon="message" href="/ru/api-reference/post-v1-messages">
    Anthropic-совместимый API с расширенным мышлением, инструментами и кешированием промптов
  </Card>

  <Card title="Models" icon="list" href="/ru/api-reference/get-models">
    Список всех 70+ моделей ИИ с возможностями, ценами и контекстными окнами
  </Card>
</CardGroup>

## Расширенные функции

<CardGroup cols={2}>
  <Card title="Потоковая передача" icon="stream" href="/ru/api-reference/endpoint/streaming">
    Потоковые ответы в реальном времени с Server-Sent Events
  </Card>

  <Card title="Вызов функций" icon="function" href="/ru/api-reference/endpoint/function-calling">
    Позвольте ИИ взаимодействовать с внешними инструментами и API
  </Card>

  <Card title="Руководство по аутентификации" icon="shield" href="/ru/dev-docs/getting-started/authentication">
    Комплексные методы аутентификации и лучшие практики безопасности
  </Card>
</CardGroup>

## Быстрый старт

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
        messages=[{"role": "user", "content": "Hello!"}]
    )
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
      messages: [{ role: 'user', content: 'Hello!' }]
    });
    ```
  </Tab>

  <Tab title="cURL">
    ```bash  theme={null}
    curl https://ai.megallm.io/v1/chat/completions \
      -H "Authorization: Bearer $MEGALLM_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "model": "gpt-4",
        "messages": [{"role": "user", "content": "Hello!"}]
      }'
    ```
  </Tab>
</Tabs>

## Ограничения скорости

Ограничения скорости различаются по уровням плана:

| Уровень    | Запросов/мин | Токенов/мин  | Одновременных |
| ---------- | ------------ | ------------ | ------------- |
| Basic      | 60           | 90K          | 10            |
| Pro        | 300          | 450K         | 40            |
| Enterprise | Настраиваемо | Настраиваемо | Настраиваемо  |

## Поддержка SDK

MegaLLM совместим с популярными SDK для ИИ:

* **Python**: `openai`, `anthropic`, `langchain`
* **JavaScript/TypeScript**: `openai`, `@anthropic-ai/sdk`
* **Go**: `go-openai`
* **Ruby**: `anthropic-rb`
* **Rust**: `async-openai`
* **Java**: `openai-java`
* **C#**: `OpenAI-DotNet`

## Нужна помощь?

<CardGroup cols={2}>
  <Card title="Документация для разработчиков" icon="file-lines" href="/ru/dev-docs/overview">
    Полные руководства и учебные материалы
  </Card>

  <Card title="Каталог моделей" icon="robot" href="/ru/home/models">
    Просмотреть все 70+ доступных моделей
  </Card>
</CardGroup>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt