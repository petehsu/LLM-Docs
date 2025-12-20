# Быстрый старт

Начните работу с Python или TypeScript Agent SDK для создания AI-агентов, которые работают автономно

---

Используйте Agent SDK для создания AI-агента, который читает ваш код, находит ошибки и исправляет их, всё без ручного вмешательства.

**Что вы будете делать:**
1. Настроить проект с Agent SDK
2. Создать файл с некорректным кодом
3. Запустить агента, который автоматически находит и исправляет ошибки

## Предварительные требования

- **Node.js 18+** или **Python 3.10+**
- **Аккаунт Anthropic** ([зарегистрируйтесь здесь](https://console.anthropic.com/))

## Настройка

<Steps>
  <Step title="Установить Claude Code">
    Agent SDK использует Claude Code в качестве своей среды выполнения. Установите его для вашей платформы:

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

    После установки Claude Code на вашу машину запустите `claude` в терминале и следуйте подсказкам для аутентификации. SDK будет использовать эту аутентификацию автоматически.

    <Tip>
    Для получения дополнительной информации об установке Claude Code см. [Настройка Claude Code](https://docs.anthropic.com/en/docs/claude-code/setup).
    </Tip>
  </Step>

  <Step title="Создать папку проекта">
    Создайте новый каталог для этого быстрого старта:

    ```bash
    mkdir my-agent && cd my-agent
    ```

    Для ваших собственных проектов вы можете запустить SDK из любой папки; по умолчанию он будет иметь доступ к файлам в этом каталоге и его подкаталогах.
  </Step>

  <Step title="Установить SDK">
    Установите пакет Agent SDK для вашего языка программирования:

    <Tabs>
      <Tab title="TypeScript">
        ```bash
        npm install @anthropic-ai/claude-agent-sdk
        ```
      </Tab>
      <Tab title="Python (uv)">
        [uv](https://docs.astral.sh/uv/) — это быстрый менеджер пакетов Python, который автоматически управляет виртуальными окружениями:
        ```bash
        uv init && uv add claude-agent-sdk
        ```
      </Tab>
      <Tab title="Python (pip)">
        Сначала создайте виртуальное окружение, затем установите:
        ```bash
        python3 -m venv .venv && source .venv/bin/activate
        pip3 install claude-agent-sdk
        ```
      </Tab>
    </Tabs>
  </Step>

  <Step title="Установить ваш API ключ">
    Если вы уже аутентифицировали Claude Code (запустив `claude` в терминале), SDK будет использовать эту аутентификацию автоматически.

    В противном случае вам нужен API ключ, который вы можете получить из [Anthropic Console](https://console.anthropic.com/).

    Создайте файл `.env` в каталоге вашего проекта и сохраните там API ключ:

    ```bash
    ANTHROPIC_API_KEY=your-api-key
    ```

    <Note>
    **Используете Amazon Bedrock, Google Vertex AI или Microsoft Azure?** Смотрите руководства по настройке для [Bedrock](https://code.claude.com/docs/en/amazon-bedrock), [Vertex AI](https://code.claude.com/docs/en/google-vertex-ai) или [Azure AI Foundry](https://code.claude.com/docs/en/azure-ai-foundry).

    Если не было предварительного одобрения, мы не разрешаем сторонним разработчикам предлагать вход Claude.ai или ограничения скорости для своих продуктов, включая агентов, созданных на основе Claude Agent SDK. Вместо этого используйте методы аутентификации через API ключ, описанные в этом документе.
    </Note>
  </Step>
</Steps>

## Создать файл с ошибками

Этот быстрый старт проведёт вас через создание агента, который может находить и исправлять ошибки в коде. Сначала вам нужен файл с некоторыми намеренными ошибками для исправления агентом. Создайте `utils.py` в каталоге `my-agent` и вставьте следующий код:

```python
def calculate_average(numbers):
    total = 0
    for num in numbers:
        total += num
    return total / len(numbers)

def get_user_name(user):
    return user["name"].upper()
```

Этот код содержит две ошибки:
1. `calculate_average([])` падает с ошибкой деления на ноль
2. `get_user_name(None)` падает с TypeError

## Создать агента, который находит и исправляет ошибки

Создайте `agent.py`, если вы используете Python SDK, или `agent.ts` для TypeScript:

<CodeGroup>
```python Python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions, AssistantMessage, ResultMessage

async def main():
    # Agentic loop: streams messages as Claude works
    async for message in query(
        prompt="Review utils.py for bugs that would cause crashes. Fix any issues you find.",
        options=ClaudeAgentOptions(
            allowed_tools=["Read", "Edit", "Glob"],  # Tools Claude can use
            permission_mode="acceptEdits"            # Auto-approve file edits
        )
    ):
        # Print human-readable output
        if isinstance(message, AssistantMessage):
            for block in message.content:
                if hasattr(block, "text"):
                    print(block.text)              # Claude's reasoning
                elif hasattr(block, "name"):
                    print(f"Tool: {block.name}")   # Tool being called
        elif isinstance(message, ResultMessage):
            print(f"Done: {message.subtype}")      # Final result

asyncio.run(main())
```

```typescript TypeScript
import { query } from "@anthropic-ai/claude-agent-sdk";

// Agentic loop: streams messages as Claude works
for await (const message of query({
  prompt: "Review utils.py for bugs that would cause crashes. Fix any issues you find.",
  options: {
    allowedTools: ["Read", "Edit", "Glob"],  // Tools Claude can use
    permissionMode: "acceptEdits"            // Auto-approve file edits
  }
})) {
  // Print human-readable output
  if (message.type === "assistant" && message.message?.content) {
    for (const block of message.message.content) {
      if ("text" in block) {
        console.log(block.text);             // Claude's reasoning
      } else if ("name" in block) {
        console.log(`Tool: ${block.name}`);  // Tool being called
      }
    }
  } else if (message.type === "result") {
    console.log(`Done: ${message.subtype}`); // Final result
  }
}
```
</CodeGroup>

Этот код состоит из трёх основных частей:

1. **`query`**: основная точка входа, которая создаёт цикл агента. Она возвращает асинхронный итератор, поэтому вы используете `async for` для потоковой передачи сообщений по мере работы Claude. Полный API см. в справочнике [Python](/docs/ru/agent-sdk/python#query) или [TypeScript](/docs/ru/agent-sdk/typescript#query) SDK.

2. **`prompt`**: то, что вы хотите, чтобы Claude сделал. Claude определяет, какие инструменты использовать на основе задачи.

3. **`options`**: конфигурация для агента. В этом примере используется `allowedTools` для ограничения Claude инструментами `Read`, `Edit` и `Glob`, а также `permissionMode: "acceptEdits"` для автоматического одобрения изменений файлов. Другие опции включают `systemPrompt`, `mcpServers` и другие. Смотрите все опции для [Python](/docs/ru/agent-sdk/python#claudeagentoptions) или [TypeScript](/docs/ru/agent-sdk/typescript#claudeagentoptions).

Цикл `async for` продолжает работать, пока Claude думает, вызывает инструменты, наблюдает результаты и решает, что делать дальше. Каждая итерация выдаёт сообщение: рассуждение Claude, вызов инструмента, результат инструмента или окончательный результат. SDK обрабатывает оркестровку (выполнение инструментов, управление контекстом, повторные попытки), поэтому вы просто потребляете поток. Цикл заканчивается, когда Claude завершает задачу или возникает ошибка.

Обработка сообщений внутри цикла фильтрует вывод, удобный для чтения человеком. Без фильтрации вы увидите необработанные объекты сообщений, включая инициализацию системы и внутреннее состояние, что полезно для отладки, но в остальном шумно.

<Note>
В этом примере используется потоковая передача для отображения прогресса в реальном времени. Если вам не нужен живой вывод (например, для фоновых заданий или конвейеров CI), вы можете собрать все сообщения сразу. Подробнее см. [Потоковая передача в сравнении с однооборотным режимом](/docs/ru/agent-sdk/streaming-vs-single-mode).
</Note>

### Запустить ваш агент

Ваш агент готов. Запустите его с помощью следующей команды:

<CodeGroup>
```bash Python
python3 agent.py
```

```bash TypeScript
npx tsx agent.ts
```
</CodeGroup>

После запуска проверьте `utils.py`. Вы увидите защитный код, обрабатывающий пустые списки и нулевых пользователей. Ваш агент автономно:

1. **Прочитал** `utils.py` для понимания кода
2. **Проанализировал** логику и выявил граничные случаи, которые вызовут сбой
3. **Отредактировал** файл, чтобы добавить надлежащую обработку ошибок

Это то, что отличает Agent SDK: Claude выполняет инструменты напрямую вместо того, чтобы просить вас их реализовать.

<Note>
Если вы видите "Claude Code not found", [установите Claude Code](#install-claude-code) и перезагрузите терминал. Для "API key not found" [установите ваш API ключ](#set-your-api-key). Дополнительную помощь см. в [полном руководстве по устранению неполадок](https://docs.anthropic.com/en/docs/claude-code/troubleshooting).
</Note>

### Попробуйте другие подсказки

Теперь, когда ваш агент настроен, попробуйте некоторые другие подсказки:

- `"Add docstrings to all functions in utils.py"`
- `"Add type hints to all functions in utils.py"`
- `"Create a README.md documenting the functions in utils.py"`

### Настроить ваш агент

Вы можете изменить поведение вашего агента, изменив опции. Вот несколько примеров:

**Добавить возможность веб-поиска:**

<CodeGroup>
```python Python
options=ClaudeAgentOptions(
    allowed_tools=["Read", "Edit", "Glob", "WebSearch"],
    permission_mode="acceptEdits"
)
```

```typescript TypeScript
options: {
  allowedTools: ["Read", "Edit", "Glob", "WebSearch"],
  permissionMode: "acceptEdits"
}
```
</CodeGroup>

**Дать Claude пользовательскую системную подсказку:**

<CodeGroup>
```python Python
options=ClaudeAgentOptions(
    allowed_tools=["Read", "Edit", "Glob"],
    permission_mode="acceptEdits",
    system_prompt="You are a senior Python developer. Always follow PEP 8 style guidelines."
)
```

```typescript TypeScript
options: {
  allowedTools: ["Read", "Edit", "Glob"],
  permissionMode: "acceptEdits",
  systemPrompt: "You are a senior Python developer. Always follow PEP 8 style guidelines."
}
```
</CodeGroup>

**Запустить команды в терминале:**

<CodeGroup>
```python Python
options=ClaudeAgentOptions(
    allowed_tools=["Read", "Edit", "Glob", "Bash"],
    permission_mode="acceptEdits"
)
```

```typescript TypeScript
options: {
  allowedTools: ["Read", "Edit", "Glob", "Bash"],
  permissionMode: "acceptEdits"
}
```
</CodeGroup>

С включённым `Bash` попробуйте: `"Write unit tests for utils.py, run them, and fix any failures"`

## Ключевые концепции

**Инструменты** контролируют, что может делать ваш агент:

| Инструменты | Что может делать агент |
|-------|----------------------|
| `Read`, `Glob`, `Grep` | Анализ только для чтения |
| `Read`, `Edit`, `Glob` | Анализ и изменение кода |
| `Read`, `Edit`, `Bash`, `Glob`, `Grep` | Полная автоматизация |

**Режимы разрешений** контролируют, сколько человеческого надзора вы хотите:

| Режим | Поведение | Вариант использования |
|------|----------|----------|
| `acceptEdits` | Автоматически одобряет редактирование файлов, запрашивает другие действия | Надёжные рабочие процессы разработки |
| `bypassPermissions` | Работает без подсказок | Конвейеры CI/CD, автоматизация |
| `default` | Требует обратного вызова `canUseTool` для обработки одобрения | Пользовательские потоки одобрения |

Приведённый выше пример использует режим `acceptEdits`, который автоматически одобряет файловые операции, чтобы агент мог работать без интерактивных подсказок. Если вы хотите запрашивать у пользователей одобрение, используйте режим `default` и предоставьте обратный вызов [`canUseTool`](/docs/ru/agent-sdk/permissions#canusetool), который собирает пользовательский ввод. Для большего контроля см. [Разрешения](/docs/ru/agent-sdk/permissions).

## Следующие шаги

Теперь, когда вы создали своего первого агента, узнайте, как расширить его возможности и адаптировать его к вашему варианту использования:

- **[Разрешения](/docs/ru/agent-sdk/permissions)**: контролируйте, что может делать ваш агент и когда ему нужно одобрение
- **[Хуки](/docs/ru/agent-sdk/hooks)**: запускайте пользовательский код до или после вызовов инструментов
- **[Сессии](/docs/ru/agent-sdk/sessions)**: создавайте многооборотных агентов, которые сохраняют контекст
- **[MCP серверы](/docs/ru/agent-sdk/mcp)**: подключайтесь к базам данных, браузерам, API и другим внешним системам
- **[Хостинг](/docs/ru/agent-sdk/hosting)**: развёртывайте агентов в Docker, облако и CI/CD
- **[Примеры агентов](https://github.com/anthropics/claude-agent-sdk-demos)**: смотрите полные примеры: помощник по электронной почте, исследовательский агент и другие