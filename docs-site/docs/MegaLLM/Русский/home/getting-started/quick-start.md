# Быстрый старт

> Начните работу с MegaLLM всего за 2 минуты. Это руководство поможет вам сделать первый вызов API.

## 1. Получите свой API-ключ

<Steps>
  <Step title="Зарегистрируйтесь">
    Посетите [megallm.io/auth/signup](https://megallm.io/auth/signup) и создайте аккаунт
  </Step>

  <Step title="Перейдите в панель управления">
    Перейдите на [megallm.io/dashboard](https://megallm.io/dashboard/overview)
  </Step>

  <Step title="Сгенерируйте API-ключ">
    Нажмите "Create New API Key" в разделе API Keys
  </Step>

  <Step title="Скопируйте ключ">
    Скопируйте свой ключ (начинается с `sk-mega-`) и сохраните его в безопасном месте
  </Step>
</Steps>

<Warning>
  Держите свой API-ключ в секрете! Никогда не коммитьте его в систему контроля версий и не делитесь им публично.
</Warning>

## 2. Сделайте свой первый запрос

Выберите предпочитаемый метод:

<Tabs>
  <Tab title="Python">
    ```bash  theme={null}
    # Установите OpenAI SDK
    pip install openai
    ```

    ```python  theme={null}
    from openai import OpenAI

    # Инициализируйте клиент
    client = OpenAI(
        base_url="https://ai.megallm.io/v1",
        api_key="your-megallm-api-key"  # Замените на свой ключ
    )

    # Сделайте запрос
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "user", "content": "Say hello!"}
        ]
    )

    print(response.choices[0].message.content)
    ```
  </Tab>

  <Tab title="JavaScript">
    ```bash  theme={null}
    # Установите OpenAI SDK
    npm install openai
    ```

    ```javascript  theme={null}
    import OpenAI from 'openai';

    // Инициализируйте клиент
    const client = new OpenAI({
      baseURL: 'https://ai.megallm.io/v1',
      apiKey: 'your-megallm-api-key' // Замените на свой ключ
    });

    // Сделайте запрос
    const response = await client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'user', content: 'Say hello!' }
      ]
    });

    console.log(response.choices[0].message.content);
    ```
  </Tab>

  <Tab title="cURL">
    ```bash  theme={null}
    curl https://ai.megallm.io/v1/chat/completions \
      -H "Authorization: Bearer YOUR_MEGALLM_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "model": "gpt-4",
        "messages": [
          {"role": "user", "content": "Say hello!"}
        ]
      }'
    ```
  </Tab>

  <Tab title="CLI">
    ```bash  theme={null}
    # Установите MegaLLM CLI
    npx megallm@latest

    # Следуйте интерактивной настройке
    ```

    См. [Документация CLI](/ru/cli/overview) для подробностей.
  </Tab>
</Tabs>

## 3. Попробуйте разные модели

Одна из суперспособностей MegaLLM — мгновенное переключение моделей. Просто измените параметр `model`:

```python  theme={null}
# Попробуйте GPT-4
response = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "Explain quantum computing"}]
)

# Переключитесь на Claude
response = client.chat.completions.create(
    model="claude-opus-4-1-20250805",
    messages=[{"role": "user", "content": "Explain quantum computing"}]
)

# Попробуйте Gemini
response = client.chat.completions.create(
    model="gemini-2.5-pro",
    messages=[{"role": "user", "content": "Explain quantum computing"}]
)
```

<Info>
  Просмотрите все доступные модели в [каталоге моделей](/ru/home/models)
</Info>

## Что дальше?

<CardGroup cols={2}>
  <Card title="Полная настройка" icon="screwdriver-wrench" href="/ru/home/getting-started/setup">
    Переменные окружения и конфигурация
  </Card>

  <Card title="Учебник по первому запросу" icon="brackets-curly" href="/ru/home/getting-started/first-request">
    Подробное пошаговое руководство с примерами
  </Card>

  <Card title="Просмотр моделей" icon="grid-2-plus" href="/ru/home/models">
    Изучите все более 70 доступных моделей
  </Card>

  <Card title="Справочник API" icon="book-atlas" href="/ru/api-reference/introduction">
    Полная документация API
  </Card>
</CardGroup>

## Часто задаваемые вопросы

<AccordionGroup>
  <Accordion title="Какую модель мне использовать?">
    Начните с `gpt-4` для общего использования, `claude-3.5-sonnet` для длинного контекста или `gpt-3.5-turbo` для скорости и экономии.

    См. [каталог моделей](/ru/home/models) для подробного сравнения.
  </Accordion>

  <Accordion title="Сколько это стоит?">
    Вы платите только за то, что используете. Разные модели имеют разные цены. Большинство тестов можно провести менее чем за \$1.

    Проверьте текущие цены в вашей [панели управления](https://megallm.io/dashboard/overview).
  </Accordion>

  <Accordion title="Могу ли я использовать свой существующий код OpenAI/Anthropic?">
    Да! Просто измените базовый URL. Весь ваш существующий код работает без изменений.
  </Accordion>

  <Accordion title="Что делать, если модель не работает?">
    MegaLLM имеет автоматическое переключение. Если модель недоступна, вы можете быстро переключиться на альтернативу.
  </Accordion>
</AccordionGroup>

## Нужна помощь?

* **Полное руководство**: [Руководство по первому запросу](/ru/home/getting-started/first-request)
* **Документация**: [Документация для разработчиков](/ru/dev-docs/overview)
* **FAQ**: [Часто задаваемые вопросы](/ru/home/faq)
* **Поддержка**: [support@megallm.io](mailto:support@megallm.io)
* **Discord**: [Присоединиться к сообществу](https://discord.gg/devsindia)


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt