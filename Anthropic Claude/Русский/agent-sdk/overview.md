# Обзор Agent SDK

Создавайте производственные AI-агентов с Claude Code как библиотеку

---

<Note>
Claude Code SDK был переименован в Claude Agent SDK. Если вы переходите со старого SDK, см. [Руководство по миграции](/docs/ru/agent-sdk/migration-guide).
</Note>

Создавайте AI-агентов, которые автономно читают файлы, выполняют команды, ищут в веб-сети, редактируют код и многое другое. Agent SDK дает вам те же инструменты, цикл агента и управление контекстом, которые питают Claude Code, программируемые на Python и TypeScript.

<CodeGroup>
```python Python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions

async def main():
    async for message in query(
        prompt="Find and fix the bug in auth.py",
        options=ClaudeAgentOptions(allowed_tools=["Read", "Edit", "Bash"])
    ):
        print(message)  # Claude reads the file, finds the bug, edits it

asyncio.run(main())
```

```typescript TypeScript
import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "Find and fix the bug in auth.py",
  options: { allowedTools: ["Read", "Edit", "Bash"] }
})) {
  console.log(message);  // Claude reads the file, finds the bug, edits it
}
```
</CodeGroup>

Agent SDK включает встроенные инструменты для чтения файлов, выполнения команд и редактирования кода, поэтому ваш агент может начать работу немедленно без необходимости реализации выполнения инструментов. Ознакомьтесь с быстрым стартом или изучите реальных агентов, созданных с помощью SDK:

<CardGroup cols={2}>
  <Card title="Быстрый старт" icon="play" href="/docs/ru/agent-sdk/quickstart">
    Создайте агента по исправлению ошибок за несколько минут
  </Card>
  <Card title="Примеры агентов" icon="star" href="https://github.com/anthropics/claude-agent-sdk-demos">
    Помощник по электронной почте, исследовательский агент и многое другое
  </Card>
</CardGroup>

## Возможности

Все, что делает Claude Code мощным, доступно в SDK:

<Tabs>
  <Tab title="Встроенные инструменты">
    Ваш агент может читать файлы, выполнять команды и искать в кодовых базах прямо из коробки. Ключевые инструменты включают:

    | Инструмент | Что он делает |
    |------|--------------|
    | **Read** | Читать любой файл в рабочем каталоге |
    | **Write** | Создавать новые файлы |
    | **Edit** | Вносить точные изменения в существующие файлы |
    | **Bash** | Выполнять команды терминала, скрипты, операции git |
    | **Glob** | Находить файлы по шаблону (`**/*.ts`, `src/**/*.py`) |
    | **Grep** | Искать содержимое файлов с помощью regex |
    | **WebSearch** | Искать в веб-сети текущую информацию |
    | **WebFetch** | Получать и анализировать содержимое веб-страниц |

    Этот пример создает агента, который ищет комментарии TODO в вашей кодовой базе:

    <CodeGroup>
    ```python Python
    import asyncio
    from claude_agent_sdk import query, ClaudeAgentOptions

    async def main():
        async for message in query(
            prompt="Find all TODO comments and create a summary",
            options=ClaudeAgentOptions(allowed_tools=["Read", "Glob", "Grep"])
        ):
            print(message)

    asyncio.run(main())
    ```

    ```typescript TypeScript
    import { query } from "@anthropic-ai/claude-agent-sdk";

    for await (const message of query({
      prompt: "Find all TODO comments and create a summary",
      options: { allowedTools: ["Read", "Glob", "Grep"] }
    })) {
      console.log(message);
    }
    ```
    </CodeGroup>

  </Tab>
  <Tab title="Hooks">
    Выполняйте пользовательский код в ключевых точках жизненного цикла агента. Hooks могут выполнять команды оболочки или пользовательские скрипты для проверки, логирования, блокирования или преобразования поведения агента.

    **Доступные hooks:** `PreToolUse`, `PostToolUse`, `Stop`, `SessionStart`, `SessionEnd`, `UserPromptSubmit` и другие.

    Этот пример логирует все изменения файлов в файл аудита:

    <CodeGroup>
    ```python Python
    import asyncio
    from claude_agent_sdk import query, ClaudeAgentOptions

    async def main():
        async for message in query(
            prompt="Suggest improvements to utils.py",
            options=ClaudeAgentOptions(
                permission_mode="acceptEdits",
                hooks={
                    "PostToolUse": [{
                        "matcher": "Edit|Write",
                        "hooks": [{"type": "command", "command": "echo \"$(date): file modified\" >> ./audit.log"}]
                    }]
                }
            )
        ):
            print(message)

    asyncio.run(main())
    ```

    ```typescript TypeScript
    import { query } from "@anthropic-ai/claude-agent-sdk";

    for await (const message of query({
      prompt: "Suggest improvements to utils.py",
      options: {
        permissionMode: "acceptEdits",
        hooks: {
          PostToolUse: [{
            matcher: "Edit|Write",
            hooks: [{ type: "command", command: "echo \"$(date): file modified\" >> ./audit.log" }]
          }]
        }
      }
    })) {
      console.log(message);
    }
    ```
    </CodeGroup>

    [Узнайте больше о hooks →](/docs/ru/agent-sdk/hooks)
  </Tab>
  <Tab title="Subagents">
    Создавайте специализированных агентов для обработки сосредоточенных подзадач. Ваш основной агент делегирует работу, а подагенты сообщают результаты.

    Включите инструмент `Task`, чтобы позволить Claude создавать подагентов, когда он решит, что задача достаточно сложна для делегирования. Claude автоматически определяет, когда использовать подагентов на основе сложности задачи.

    <CodeGroup>
    ```python Python
    import asyncio
    from claude_agent_sdk import query, ClaudeAgentOptions

    async def main():
        async for message in query(
            prompt="Analyze this codebase for security vulnerabilities",
            options=ClaudeAgentOptions(allowed_tools=["Read", "Glob", "Grep", "Task"])
        ):
            print(message)

    asyncio.run(main())
    ```

    ```typescript TypeScript
    import { query } from "@anthropic-ai/claude-agent-sdk";

    for await (const message of query({
      prompt: "Analyze this codebase for security vulnerabilities",
      options: {
        allowedTools: ["Read", "Glob", "Grep", "Task"]
      }
    })) {
      console.log(message);
    }
    ```
    </CodeGroup>

    Вы также можете определить пользовательские типы агентов с помощью опции `agents` для более специализированных паттернов делегирования.

    [Узнайте больше о subagents →](/docs/ru/agent-sdk/subagents)
  </Tab>
  <Tab title="MCP">
    Подключайтесь к внешним системам через Model Context Protocol: базы данных, браузеры, API и [сотни других](https://github.com/modelcontextprotocol/servers).

    Этот пример подключает [Playwright MCP server](https://github.com/microsoft/playwright-mcp), чтобы дать вашему агенту возможности автоматизации браузера:

    <CodeGroup>
    ```python Python
    import asyncio
    from claude_agent_sdk import query, ClaudeAgentOptions

    async def main():
        async for message in query(
            prompt="Open example.com and describe what you see",
            options=ClaudeAgentOptions(
                mcp_servers={
                    "playwright": {"command": "npx", "args": ["@playwright/mcp@latest"]}
                }
            )
        ):
            print(message)

    asyncio.run(main())
    ```

    ```typescript TypeScript
    import { query } from "@anthropic-ai/claude-agent-sdk";

    for await (const message of query({
      prompt: "Open example.com and describe what you see",
      options: {
        mcpServers: {
          playwright: { command: "npx", args: ["@playwright/mcp@latest"] }
        }
      }
    })) {
      console.log(message);
    }
    ```
    </CodeGroup>

    [Узнайте больше о MCP →](/docs/ru/agent-sdk/mcp)
  </Tab>
  <Tab title="Permissions">
    Контролируйте точно, какие инструменты может использовать ваш агент. Разрешайте безопасные операции, блокируйте опасные или требуйте одобрения для чувствительных действий.

    Этот пример создает агента только для чтения, который может анализировать, но не изменять код:

    <CodeGroup>
    ```python Python
    import asyncio
    from claude_agent_sdk import query, ClaudeAgentOptions

    async def main():
        async for message in query(
            prompt="Review this code for best practices",
            options=ClaudeAgentOptions(
                allowed_tools=["Read", "Glob", "Grep"],
                permission_mode="bypassPermissions"
            )
        ):
            print(message)

    asyncio.run(main())
    ```

    ```typescript TypeScript
    import { query } from "@anthropic-ai/claude-agent-sdk";

    for await (const message of query({
      prompt: "Review this code for best practices",
      options: {
        allowedTools: ["Read", "Glob", "Grep"],
        permissionMode: "bypassPermissions"
      }
    })) {
      console.log(message);
    }
    ```
    </CodeGroup>

    [Узнайте больше о permissions →](/docs/ru/agent-sdk/permissions)
  </Tab>
  <Tab title="Sessions">
    Сохраняйте контекст между несколькими обменами. Claude помнит прочитанные файлы, выполненный анализ и историю разговора. Возобновляйте сеансы позже или разветвляйте их для изучения различных подходов.

    Этот пример захватывает ID сеанса из первого запроса, затем возобновляет работу с полным контекстом:

    <CodeGroup>
    ```python Python
    import asyncio
    from claude_agent_sdk import query, ClaudeAgentOptions

    async def main():
        session_id = None

        # First query: capture the session ID
        async for message in query(
            prompt="Read the authentication module",
            options=ClaudeAgentOptions(allowed_tools=["Read", "Glob"])
        ):
            if hasattr(message, 'subtype') and message.subtype == 'init':
                session_id = message.data.get('session_id')

        # Resume with full context from the first query
        async for message in query(
            prompt="Now find all places that call it",  # "it" = auth module
            options=ClaudeAgentOptions(resume=session_id)
        ):
            pass

    asyncio.run(main())
    ```

    ```typescript TypeScript
    import { query } from "@anthropic-ai/claude-agent-sdk";

    let sessionId: string | undefined;

    // First query: capture the session ID
    for await (const message of query({
      prompt: "Read the authentication module",
      options: { allowedTools: ["Read", "Glob"] }
    })) {
      if (message.type === "system" && message.subtype === "init") {
        sessionId = message.session_id;
      }
    }

    // Resume with full context from the first query
    for await (const message of query({
      prompt: "Now find all places that call it",  // "it" = auth module
      options: { resume: sessionId }
    })) {
      // Process messages...
    }
    ```
    </CodeGroup>

    [Узнайте больше о sessions →](/docs/ru/agent-sdk/sessions)
  </Tab>
</Tabs>

### Функции Claude Code

SDK также поддерживает конфигурацию на основе файловой системы Claude Code. Чтобы использовать эти функции, установите `setting_sources=["project"]` (Python) или `settingSources: ['project']` (TypeScript) в ваших опциях.

| Функция | Описание | Расположение |
|---------|-------------|----------|
| [Skills](/docs/ru/agent-sdk/skills) | Специализированные возможности, определенные в Markdown | `.claude/skills/SKILL.md` |
| [Slash commands](/docs/ru/agent-sdk/slash-commands) | Пользовательские команды для обычных задач | `.claude/commands/*.md` |
| [Memory](/docs/ru/agent-sdk/modifying-system-prompts) | Контекст проекта и инструкции | `CLAUDE.md` или `.claude/CLAUDE.md` |
| [Plugins](/docs/ru/agent-sdk/plugins) | Расширяйте пользовательскими командами, агентами и MCP серверами | Программно через опцию `plugins` |

## Начало работы

<Steps>
  <Step title="Установите Claude Code">
    SDK использует Claude Code как свою среду выполнения:

    <Tabs>
      <Tab title="macOS/Linux/WSL">
        ```bash
        curl -fsSL https://claude.ai/install.sh | bash
        ```
      </Tab>
      <Tab title="Homebrew">
        ```bash
        brew install --cask claude-code
        ```
      </Tab>
      <Tab title="npm">
        ```bash
        npm install -g @anthropic-ai/claude-code
        ```
      </Tab>
    </Tabs>

    См. [Claude Code setup](https://docs.anthropic.com/en/docs/claude-code/setup) для Windows и других опций.
  </Step>
  <Step title="Установите SDK">
    <Tabs>
      <Tab title="TypeScript">
        ```bash
        npm install @anthropic-ai/claude-agent-sdk
        ```
      </Tab>
      <Tab title="Python">
        ```bash
        pip install claude-agent-sdk
        ```
      </Tab>
    </Tabs>
  </Step>
  <Step title="Установите ваш API ключ">
    ```bash
    export ANTHROPIC_API_KEY=your-api-key
    ```
    Получите ваш ключ из [Console](https://console.anthropic.com/).

    SDK также поддерживает аутентификацию через поставщиков API третьих сторон:

    - **Amazon Bedrock**: Установите переменную окружения `CLAUDE_CODE_USE_BEDROCK=1` и настройте учетные данные AWS
    - **Google Vertex AI**: Установите переменную окружения `CLAUDE_CODE_USE_VERTEX=1` и настройте учетные данные Google Cloud
    - **Microsoft Foundry**: Установите переменную окружения `CLAUDE_CODE_USE_FOUNDRY=1` и настройте учетные данные Azure

    <Note>
    Если не одобрено ранее, мы не разрешаем разработчикам третьих сторон предлагать вход Claude.ai или ограничения скорости для своих продуктов, включая агентов, созданных на Claude Agent SDK. Вместо этого используйте методы аутентификации с API ключом, описанные в этом документе.
    </Note>
  </Step>
  <Step title="Запустите вашего первого агента">
    Этот пример создает агента, который выводит список файлов в вашем текущем каталоге, используя встроенные инструменты.

    <CodeGroup>
    ```python Python
    import asyncio
    from claude_agent_sdk import query, ClaudeAgentOptions

    async def main():
        async for message in query(
            prompt="What files are in this directory?",
            options=ClaudeAgentOptions(allowed_tools=["Bash", "Glob"])
        ):
            print(message)

    asyncio.run(main())
    ```

    ```typescript TypeScript
    import { query } from "@anthropic-ai/claude-agent-sdk";

    for await (const message of query({
      prompt: "What files are in this directory?",
      options: { allowedTools: ["Bash", "Glob"] },
    })) {
      console.log(message);
    }
    ```
    </CodeGroup>
  </Step>
</Steps>

**Готовы создавать?** Следуйте [Быстрому старту](/docs/ru/agent-sdk/quickstart), чтобы создать агента, который находит и исправляет ошибки за несколько минут.

## Сравните Agent SDK с другими инструментами Claude

Платформа Claude предлагает несколько способов создания с Claude. Вот как Agent SDK вписывается:

<Tabs>
  <Tab title="Agent SDK vs Client SDK">
    [Anthropic Client SDK](/docs/ru/api/client-sdks) дает вам прямой доступ к API: вы отправляете подсказки и реализуете выполнение инструментов самостоятельно. **Agent SDK** дает вам Claude со встроенным выполнением инструментов.

    С Client SDK вы реализуете цикл инструментов. С Agent SDK Claude обрабатывает это:

    <CodeGroup>
    ```python Python
    # Client SDK: You implement the tool loop
    response = client.messages.create(...)
    while response.stop_reason == "tool_use":
        result = your_tool_executor(response.tool_use)
        response = client.messages.create(tool_result=result, ...)

    # Agent SDK: Claude handles tools autonomously
    async for message in query(prompt="Fix the bug in auth.py"):
        print(message)
    ```

    ```typescript TypeScript
    // Client SDK: You implement the tool loop
    let response = await client.messages.create({...});
    while (response.stop_reason === "tool_use") {
      const result = yourToolExecutor(response.tool_use);
      response = await client.messages.create({ tool_result: result, ... });
    }

    // Agent SDK: Claude handles tools autonomously
    for await (const message of query({ prompt: "Fix the bug in auth.py" })) {
      console.log(message);
    }
    ```
    </CodeGroup>
  </Tab>
  <Tab title="Agent SDK vs Claude Code CLI">
    Те же возможности, другой интерфейс:

    | Вариант использования | Лучший выбор |
    |----------|-------------|
    | Интерактивная разработка | CLI |
    | CI/CD конвейеры | SDK |
    | Пользовательские приложения | SDK |
    | Одноразовые задачи | CLI |
    | Производственная автоматизация | SDK |

    Многие команды используют оба: CLI для ежедневной разработки, SDK для производства. Рабочие процессы напрямую переводятся между ними.
  </Tab>
</Tabs>

## Журнал изменений

Просмотрите полный журнал изменений для обновлений SDK, исправлений ошибок и новых функций:

- **TypeScript SDK**: [View CHANGELOG.md](https://github.com/anthropics/claude-agent-sdk-typescript/blob/main/CHANGELOG.md)
- **Python SDK**: [View CHANGELOG.md](https://github.com/anthropics/claude-agent-sdk-python/blob/main/CHANGELOG.md)

## Сообщение об ошибках

Если вы столкнулись с ошибками или проблемами с Agent SDK:

- **TypeScript SDK**: [Report issues on GitHub](https://github.com/anthropics/claude-agent-sdk-typescript/issues)
- **Python SDK**: [Report issues on GitHub](https://github.com/anthropics/claude-agent-sdk-python/issues)

## Рекомендации по брендингу

Для партнеров, интегрирующих Claude Agent SDK, использование брендинга Claude является опциональным. При ссылке на Claude в вашем продукте:

**Разрешено:**
- "Claude Agent" (предпочтительно для раскрывающихся меню)
- "Claude" (когда находится в меню, уже помеченном как "Agents")
- "{YourAgentName} Powered by Claude" (если у вас есть существующее имя агента)

**Не разрешено:**
- "Claude Code" или "Claude Code Agent"
- Фирменные ASCII-арт Claude Code или визуальные элементы, которые имитируют Claude Code

Ваш продукт должен сохранять свой собственный брендинг и не должен выглядеть как Claude Code или любой продукт Anthropic. По вопросам соответствия брендингу свяжитесь с нашей [командой продаж](https://www.anthropic.com/contact-sales).

## Лицензия и условия

Использование Claude Agent SDK регулируется [Коммерческими условиями обслуживания Anthropic](https://www.anthropic.com/legal/commercial-terms), включая случаи, когда вы используете его для питания продуктов и услуг, которые вы предоставляете своим собственным клиентам и конечным пользователям, за исключением случаев, когда конкретный компонент или зависимость покрыты другой лицензией, как указано в файле LICENSE этого компонента.

## Следующие шаги

<CardGroup cols={2}>
  <Card title="Быстрый старт" icon="play" href="/docs/ru/agent-sdk/quickstart">
    Создайте агента, который находит и исправляет ошибки за несколько минут
  </Card>
  <Card title="Примеры агентов" icon="star" href="https://github.com/anthropics/claude-agent-sdk-demos">
    Помощник по электронной почте, исследовательский агент и многое другое
  </Card>
  <Card title="TypeScript SDK" icon="code" href="/docs/ru/agent-sdk/typescript">
    Полная справка API TypeScript и примеры
  </Card>
  <Card title="Python SDK" icon="code" href="/docs/ru/agent-sdk/python">
    Полная справка API Python и примеры
  </Card>
</CardGroup>