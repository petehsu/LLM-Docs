# Руководство по настройке

> Полное руководство по настройке MegaLLM для вашей среды разработки.

## Настройка окружения

### 1. Безопасно сохраните ваш API-ключ

<Tabs>
  <Tab title="Linux/macOS">
    Добавьте в файл конфигурации вашей оболочки:

    ```bash  theme={null}
    # ~/.bashrc или ~/.zshrc
    export MEGALLM_API_KEY="your-api-key-here"
    ```

    Затем перезагрузите:

    ```bash  theme={null}
    source ~/.bashrc
    # или
    source ~/.zshrc
    ```

    Или используйте файл `.env`:

    ```bash  theme={null}
    echo "MEGALLM_API_KEY=your-api-key-here" >> .env
    ```
  </Tab>

  <Tab title="Windows">
    **PowerShell:**

    ```powershell  theme={null}
    [System.Environment]::SetEnvironmentVariable("MEGALLM_API_KEY", "your-api-key-here", "User")
    ```

    **Командная строка:**

    ```cmd  theme={null}
    setx MEGALLM_API_KEY "your-api-key-here"
    ```
  </Tab>

  <Tab title="Файл .env">
    Создайте файл `.env` в корне вашего проекта:

    ```bash  theme={null}
    MEGALLM_API_KEY=your-api-key-here
    ```

    **Python:**

    ```python  theme={null}
    from dotenv import load_dotenv
    load_dotenv()
    ```

    **JavaScript:**

    ```javascript  theme={null}
    require('dotenv').config();
    ```

    <Warning>
      Добавьте `.env` в ваш `.gitignore`, чтобы не коммитить секреты!
    </Warning>
  </Tab>
</Tabs>

### 2. Установите SDK

<Tabs>
  <Tab title="Python">
    ```bash  theme={null}
    # OpenAI SDK (рекомендуется)
    pip install openai

    # Или Anthropic SDK
    pip install anthropic

    # Для переменных окружения
    pip install python-dotenv
    ```
  </Tab>

  <Tab title="JavaScript/TypeScript">
    ```bash  theme={null}
    # OpenAI SDK (рекомендуется)
    npm install openai

    # Или Anthropic SDK
    npm install @anthropic-ai/sdk

    # Для переменных окружения
    npm install dotenv
    ```
  </Tab>

  <Tab title="Go">
    ```bash  theme={null}
    go get github.com/sashabaranov/go-openai
    ```
  </Tab>

  <Tab title="Другие языки">
    MegaLLM работает с любым HTTP-клиентом. См. [Справочник API](/ru/api-reference/introduction) для подробностей.
  </Tab>
</Tabs>

### 3. Настройте свой клиент

<Tabs>
  <Tab title="Python - формат OpenAI">
    ```python  theme={null}
    import os
    from openai import OpenAI

    client = OpenAI(
        base_url="https://ai.megallm.io/v1",
        api_key=os.getenv("MEGALLM_API_KEY")
    )

    # Проверьте соединение
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": "Hello!"}]
    )
    print(response.choices[0].message.content)
    ```
  </Tab>

  <Tab title="Python - формат Anthropic">
    ```python  theme={null}
    import os
    from anthropic import Anthropic

    client = Anthropic(
        base_url="https://ai.megallm.io",
        api_key=os.getenv("MEGALLM_API_KEY")
    )

    # Проверьте соединение
    message = client.messages.create(
        model="claude-3.5-sonnet",
        max_tokens=100,
        messages=[{"role": "user", "content": "Hello!"}]
    )
    print(message.content[0].text)
    ```
  </Tab>

  <Tab title="JavaScript - формат OpenAI">
    ```javascript  theme={null}
    import OpenAI from 'openai';

    const client = new OpenAI({
      baseURL: 'https://ai.megallm.io/v1',
      apiKey: process.env.MEGALLM_API_KEY
    });

    // Проверьте соединение
    const response = await client.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: 'Hello!' }]
    });
    console.log(response.choices[0].message.content);
    ```
  </Tab>

  <Tab title="JavaScript - формат Anthropic">
    ```javascript  theme={null}
    import Anthropic from '@anthropic-ai/sdk';

    const client = new Anthropic({
      baseURL: 'https://ai.megallm.io',
      apiKey: process.env.MEGALLM_API_KEY
    });

    // Проверьте соединение
    const message = await client.messages.create({
      model: 'claude-3.5-sonnet',
      max_tokens: 100,
      messages: [{ role: 'user', content: 'Hello!' }]
    });
    console.log(message.content[0].text);
    ```
  </Tab>
</Tabs>

## Настройка проекта

### Для новых проектов

1. **Создайте каталог проекта:**
   ```bash  theme={null}
   mkdir my-ai-project
   cd my-ai-project
   ```

2. **Инициализируйте проект:**
   ```bash  theme={null}
   # Python
   python -m venv venv
   source venv/bin/activate
   pip install openai python-dotenv

   # JavaScript
   npm init -y
   npm install openai dotenv
   ```

3. **Создайте файл .env:**
   ```bash  theme={null}
   echo "MEGALLM_API_KEY=your-key-here" > .env
   echo ".env" >> .gitignore
   ```

4. **Создайте первый скрипт:**
   См. [Руководство по первому запросу](/ru/home/getting-started/first-request)

### Для существующих проектов

Если вы уже используете OpenAI или Anthropic:

1. **Обновите базовый URL:**
   ```python  theme={null}
   # До
   client = OpenAI(api_key="sk-...")

   # После
   client = OpenAI(
       base_url="https://ai.megallm.io/v1",
       api_key="your-megallm-key"
   )
   ```

2. **Вот и всё!** Весь ваш существующий код работает.

## Настройка IDE

### VS Code

Установите рекомендуемые расширения:

* Python extension (для Python)
* ESLint (для JavaScript)
* REST Client (для тестирования API)

### PyCharm / IntelliJ

Настройте переменные окружения в Run Configurations.

### AI-ассистенты для кодирования

MegaLLM предоставляет CLI для настройки инструментов AI-кодирования:

```bash  theme={null}
npx megallm@latest
```

Это настраивает:

* Claude Code
* Codex/Windsurf
* OpenCode

См. [Документация CLI](/ru/cli/overview) для подробностей.

## Проверка настройки

Проверьте вашу конфигурацию:

<Tabs>
  <Tab title="Python">
    ```python  theme={null}
    import os
    from openai import OpenAI

    # Проверьте API-ключ
    api_key = os.getenv("MEGALLM_API_KEY")
    if not api_key:
        print("❌ API-ключ не установлен!")
        exit(1)
    print("✅ API-ключ найден")

    # Проверьте соединение
    client = OpenAI(
        base_url="https://ai.megallm.io/v1",
        api_key=api_key
    )

    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": "Say 'Setup successful!'"}],
            max_tokens=10
        )
        print("✅ Соединение успешно!")
        print(f"Ответ: {response.choices[0].message.content}")
    except Exception as e:
        print(f"❌ Ошибка: {e}")
    ```
  </Tab>

  <Tab title="JavaScript">
    ```javascript  theme={null}
    import OpenAI from 'openai';

    // Проверьте API-ключ
    const apiKey = process.env.MEGALLM_API_KEY;
    if (!apiKey) {
      console.log('❌ API-ключ не установлен!');
      process.exit(1);
    }
    console.log('✅ API-ключ найден');

    // Проверьте соединение
    const client = new OpenAI({
      baseURL: 'https://ai.megallm.io/v1',
      apiKey: apiKey
    });

    try {
      const response = await client.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: "Say 'Setup successful!'" }],
        max_tokens: 10
      });
      console.log('✅ Соединение успешно!');
      console.log(`Ответ: ${response.choices[0].message.content}`);
    } catch (error) {
      console.log(`❌ Ошибка: ${error.message}`);
    }
    ```
  </Tab>

  <Tab title="cURL">
    ```bash  theme={null}
    curl https://ai.megallm.io/v1/chat/completions \
      -H "Authorization: Bearer $MEGALLM_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "model": "gpt-4",
        "messages": [{"role": "user", "content": "Say setup successful!"}],
        "max_tokens": 10
      }'
    ```
  </Tab>
</Tabs>

## Устранение неполадок

<AccordionGroup>
  <Accordion title="API-ключ не найден">
    **Проблема:** Переменная окружения не установлена

    **Решение:**

    * Проверьте имя переменной: `MEGALLM_API_KEY`
    * Перезагрузите оболочку: `source ~/.bashrc`
    * Проверьте: `echo $MEGALLM_API_KEY`
  </Accordion>

  <Accordion title="Ошибка аутентификации (401)">
    **Проблема:** Недействительный API-ключ

    **Решение:**

    * Убедитесь, что ключ начинается с `sk-mega-`
    * Проверьте на наличие лишних пробелов
    * Сгенерируйте новый ключ на [панели управления](https://megallm.io/dashboard/overview)
  </Accordion>

  <Accordion title="Таймаут соединения">
    **Проблема:** Проблемы с сетью или брандмауэром

    **Решение:**

    * Проверьте интернет-соединение
    * Проверьте настройки брандмауэра
    * Попробуйте без VPN
  </Accordion>

  <Accordion title="Модуль не найден">
    **Проблема:** SDK не установлен

    **Решение:**

    ```bash  theme={null}
    pip install openai  # Python
    npm install openai  # JavaScript
    ```
  </Accordion>
</AccordionGroup>

## Следующие шаги

<CardGroup cols={2}>
  <Card title="Первый запрос" icon="code" href="/ru/home/getting-started/first-request">
    Создайте своё первое AI-приложение
  </Card>

  <Card title="Просмотр моделей" icon="layer-group" href="/ru/home/models">
    Изучите более 70 доступных моделей
  </Card>

  <Card title="Справочник API" icon="file-code" href="/ru/api-reference/introduction">
    Полная документация API
  </Card>

  <Card title="Лучшие практики" icon="star" href="/ru/home/faq">
    Советы и часто задаваемые вопросы
  </Card>
</CardGroup>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt