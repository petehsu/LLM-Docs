# Первый запрос

> Давайте создадим простое AI-приложение шаг за шагом. Вы узнаете, как делать запросы, обрабатывать ответы и работать с различными моделями.

## Предварительные требования

* API-ключ MegaLLM ([Получите здесь](https://megallm.io/dashboard/overview))
* Python 3.7+ или Node.js 14+ установлены
* Базовые знания программирования

## Шаг 1: Создайте проект

<Tabs>
  <Tab title="Python">
    ```bash  theme={null}
    # Создайте директорию
    mkdir my-first-ai-app
    cd my-first-ai-app

    # Создайте виртуальное окружение
    python -m venv venv
    source venv/bin/activate  # На Windows: venv\Scripts\activate

    # Установите зависимости
    pip install openai python-dotenv
    ```
  </Tab>

  <Tab title="JavaScript">
    ```bash  theme={null}
    # Создайте директорию
    mkdir my-first-ai-app
    cd my-first-ai-app

    # Инициализируйте проект
    npm init -y

    # Установите зависимости
    npm install openai dotenv
    ```
  </Tab>
</Tabs>

## Шаг 2: Сохраните API-ключ

Создайте файл `.env`:

```bash  theme={null}
MEGALLM_API_KEY=your-api-key-here
```

<Warning>
  Добавьте `.env` в `.gitignore`, чтобы не коммитить ваш API-ключ!
</Warning>

## Шаг 3: Базовый запрос

<Tabs>
  <Tab title="Python">
    Создайте `app.py`:

    ```python  theme={null}
    import os
    from dotenv import load_dotenv
    from openai import OpenAI

    # Загрузите переменные окружения
    load_dotenv()

    # Инициализируйте клиент
    client = OpenAI(
        base_url="https://ai.megallm.io/v1",
        api_key=os.getenv("MEGALLM_API_KEY")
    )

    # Сделайте запрос
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "user", "content": "What is MegaLLM?"}
        ]
    )

    # Выведите ответ
    print(response.choices[0].message.content)
    ```

    Запустите:

    ```bash  theme={null}
    python app.py
    ```
  </Tab>

  <Tab title="JavaScript">
    Создайте `app.js`:

    ```javascript  theme={null}
    import OpenAI from 'openai';
    import dotenv from 'dotenv';

    // Загрузите переменные окружения
    dotenv.config();

    // Инициализируйте клиент
    const client = new OpenAI({
      baseURL: 'https://ai.megallm.io/v1',
      apiKey: process.env.MEGALLM_API_KEY
    });

    // Сделайте запрос
    const response = await client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'user', content: 'What is MegaLLM?' }
      ]
    });

    // Выведите ответ
    console.log(response.choices[0].message.content);
    ```

    Обновите `package.json`:

    ```json  theme={null}
    {
      "type": "module"
    }
    ```

    Запустите:

    ```bash  theme={null}
    node app.js
    ```
  </Tab>
</Tabs>

## Шаг 4: Добавьте контекст разговора

Давайте сделаем его разговорным:

<Tabs>
  <Tab title="Python">
    ```python  theme={null}
    import os
    from dotenv import load_dotenv
    from openai import OpenAI

    load_dotenv()

    client = OpenAI(
        base_url="https://ai.megallm.io/v1",
        api_key=os.getenv("MEGALLM_API_KEY")
    )

    # История разговора
    messages = [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "What is Python?"}
    ]

    # Первый ответ
    response = client.chat.completions.create(
        model="gpt-4",
        messages=messages
    )

    # Добавьте в историю
    assistant_message = response.choices[0].message.content
    messages.append({"role": "assistant", "content": assistant_message})
    print(f"Assistant: {assistant_message}\n")

    # Последующий вопрос
    messages.append({"role": "user", "content": "What are its key features?"})

    response = client.chat.completions.create(
        model="gpt-4",
        messages=messages
    )

    print(f"Assistant: {response.choices[0].message.content}")
    ```
  </Tab>

  <Tab title="JavaScript">
    ```javascript  theme={null}
    import OpenAI from 'openai';
    import dotenv from 'dotenv';

    dotenv.config();

    const client = new OpenAI({
      baseURL: 'https://ai.megallm.io/v1',
      apiKey: process.env.MEGALLM_API_KEY
    });

    // История разговора
    const messages = [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'What is JavaScript?' }
    ];

    // Первый ответ
    let response = await client.chat.completions.create({
      model: 'gpt-4',
      messages: messages
    });

    // Добавьте в историю
    const assistantMessage = response.choices[0].message.content;
    messages.push({ role: 'assistant', content: assistantMessage });
    console.log(`Assistant: ${assistantMessage}\n`);

    // Последующий вопрос
    messages.push({ role: 'user', content: 'What are its key features?' });

    response = await client.chat.completions.create({
      model: 'gpt-4',
      messages: messages
    });

    console.log(`Assistant: ${response.choices[0].message.content}`);
    ```
  </Tab>
</Tabs>

## Шаг 5: Попробуйте разные модели

Переключайте модели, изменяя параметр `model`:

<Tabs>
  <Tab title="Python">
    ```python  theme={null}
    models = ["gpt-4", "claude-3.5-sonnet", "gemini-2.5-pro"]

    for model in models:
        print(f"\n--- Using {model} ---")
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "user", "content": "Explain quantum computing in one sentence."}
            ]
        )
        print(response.choices[0].message.content)
    ```
  </Tab>

  <Tab title="JavaScript">
    ```javascript  theme={null}
    const models = ['gpt-4', 'claude-3.5-sonnet', 'gemini-2.5-pro'];

    for (const model of models) {
      console.log(`\n--- Using ${model} ---`);
      const response = await client.chat.completions.create({
        model: model,
        messages: [
          { role: 'user', content: 'Explain quantum computing in one sentence.' }
        ]
      });
      console.log(response.choices[0].message.content);
    }
    ```
  </Tab>
</Tabs>

## Шаг 6: Добавьте параметры

Настройте ответ с помощью параметров:

```python  theme={null}
response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "user", "content": "Write a short poem about AI"}
    ],
    temperature=0.9,      # Выше = более творческий
    max_tokens=100,       # Ограничение длины ответа
    top_p=0.95,          # Nucleus sampling
    frequency_penalty=0.5 # Уменьшение повторений
)
```

## Шаг 7: Обработка ошибок

Добавьте правильную обработку ошибок:

<Tabs>
  <Tab title="Python">
    ```python  theme={null}
    from openai import OpenAI, AuthenticationError, RateLimitError

    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": "Hello!"}]
        )
        print(response.choices[0].message.content)

    except AuthenticationError:
        print("Недействительный API-ключ")
    except RateLimitError:
        print("Превышен лимит запросов")
    except Exception as e:
        print(f"Ошибка: {e}")
    ```
  </Tab>

  <Tab title="JavaScript">
    ```javascript  theme={null}
    try {
      const response = await client.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: 'Hello!' }]
      });
      console.log(response.choices[0].message.content);

    } catch (error) {
      if (error.status === 401) {
        console.log('Недействительный API-ключ');
      } else if (error.status === 429) {
        console.log('Превышен лимит запросов');
      } else {
        console.log(`Ошибка: ${error.message}`);
      }
    }
    ```
  </Tab>
</Tabs>

## Шаг 8: Интерактивный чат

Создайте простого чат-бота:

<Tabs>
  <Tab title="Python">
    ```python  theme={null}
    import os
    from dotenv import load_dotenv
    from openai import OpenAI

    load_dotenv()

    client = OpenAI(
        base_url="https://ai.megallm.io/v1",
        api_key=os.getenv("MEGALLM_API_KEY")
    )

    messages = [
        {"role": "system", "content": "You are a helpful assistant."}
    ]

    print("Chat with AI (type 'quit' to exit)\n")

    while True:
        user_input = input("You: ")

        if user_input.lower() == 'quit':
            break

        messages.append({"role": "user", "content": user_input})

        response = client.chat.completions.create(
            model="gpt-4",
            messages=messages
        )

        assistant_message = response.choices[0].message.content
        messages.append({"role": "assistant", "content": assistant_message})

        print(f"AI: {assistant_message}\n")
    ```
  </Tab>

  <Tab title="JavaScript">
    ```javascript  theme={null}
    import OpenAI from 'openai';
    import dotenv from 'dotenv';
    import readline from 'readline';

    dotenv.config();

    const client = new OpenAI({
      baseURL: 'https://ai.megallm.io/v1',
      apiKey: process.env.MEGALLM_API_KEY
    });

    const messages = [
      { role: 'system', content: 'You are a helpful assistant.' }
    ];

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log("Chat with AI (type 'quit' to exit)\n");

    function chat() {
      rl.question('You: ', async (userInput) => {
        if (userInput.toLowerCase() === 'quit') {
          rl.close();
          return;
        }

        messages.push({ role: 'user', content: userInput });

        const response = await client.chat.completions.create({
          model: 'gpt-4',
          messages: messages
        });

        const assistantMessage = response.choices[0].message.content;
        messages.push({ role: 'assistant', content: assistantMessage });

        console.log(`AI: ${assistantMessage}\n`);
        chat();
      });
    }

    chat();
    ```
  </Tab>
</Tabs>

## Понимание ответа

API возвращает расширенный объект ответа:

```json  theme={null}
{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1677652288,
  "model": "gpt-4",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! How can I help you today?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 9,
    "completion_tokens": 12,
    "total_tokens": 21
  }
}
```

## Следующие шаги

<CardGroup cols={2}>
  <Card title="Потоковая передача" icon="stream" href="/ru/api-reference/endpoint/streaming">
    Ответы в реальном времени
  </Card>

  <Card title="Вызов функций" icon="function" href="/ru/api-reference/endpoint/function-calling">
    Позвольте AI использовать внешние инструменты
  </Card>

  <Card title="Просмотр моделей" icon="layer-group" href="/ru/home/models">
    Изучите все доступные модели
  </Card>

  <Card title="Лучшие практики" icon="star" href="/ru/home/getting-started/next-steps">
    Советы для production приложений
  </Card>
</CardGroup>

## Устранение неполадок

<AccordionGroup>
  <Accordion title="Ошибки импорта">
    Убедитесь, что вы установили SDK:

    ```bash  theme={null}
    pip install openai  # Python
    npm install openai  # JavaScript
    ```
  </Accordion>

  <Accordion title="Ошибка 401 Authentication">
    * Проверьте правильность вашего API-ключа
    * Убедитесь, что файл `.env` находится в той же директории
    * Убедитесь, что вы вызвали `load_dotenv()` (Python) или `dotenv.config()` (JS)
  </Accordion>

  <Accordion title="Ошибки лимита запросов">
    * Вы делаете слишком много запросов
    * Добавьте задержки между запросами
    * Рассмотрите возможность обновления вашего плана
  </Accordion>

  <Accordion title="Медленные ответы">
    * Попробуйте более быструю модель, например `gpt-3.5-turbo`
    * Уменьшите `max_tokens`
    * Используйте потоковую передачу для лучшего UX
  </Accordion>
</AccordionGroup>

## Нужна помощь?

* **FAQ**: [Часто задаваемые вопросы](/ru/home/faq)
* **Справочник API**: [Полная документация](/ru/api-reference/introduction)
* **Поддержка**: [support@megallm.io](mailto:support@megallm.io)
* **Discord**: [Присоединиться к сообществу](https://discord.gg/devsindia)


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt