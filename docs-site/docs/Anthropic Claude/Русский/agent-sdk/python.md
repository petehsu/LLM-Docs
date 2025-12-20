# Справочник Agent SDK - Python

Полный справочник API для Python Agent SDK, включающий все функции, типы и классы.

---

## Установка

```bash
pip install claude-agent-sdk
```

## Выбор между `query()` и `ClaudeSDKClient`

Python SDK предоставляет два способа взаимодействия с Claude Code:

### Быстрое сравнение

| Функция             | `query()`                     | `ClaudeSDKClient`                  |
| :------------------ | :---------------------------- | :--------------------------------- |
| **Сессия**         | Создает новую сессию каждый раз | Повторно использует одну и ту же сессию                |
| **Разговор**    | Один обмен               | Несколько обменов в одном контексте |
| **Соединение**      | Управляется автоматически         | Ручное управление                     |
| **Потоковый ввод** | ✅ Поддерживается                  | ✅ Поддерживается                       |
| **Прерывания**      | ❌ Не поддерживается              | ✅ Поддерживается                       |
| **Hooks**           | ❌ Не поддерживается              | ✅ Поддерживается                       |
| **Пользовательские инструменты**    | ❌ Не поддерживается              | ✅ Поддерживается                       |
| **Продолжить чат**   | ❌ Новая сессия каждый раз      | ✅ Сохраняет разговор          |
| **Вариант использования**        | Одноразовые задачи                 | Непрерывные разговоры           |

### Когда использовать `query()` (новая сессия каждый раз)

**Лучше всего для:**

- Одноразовых вопросов, когда вам не нужна история разговора
- Независимых задач, которые не требуют контекста из предыдущих обменов
- Простых скриптов автоматизации
- Когда вы хотите начать с чистого листа каждый раз

### Когда использовать `ClaudeSDKClient` (непрерывный разговор)

**Лучше всего для:**

- **Продолжения разговоров** - Когда вам нужно, чтобы Claude помнил контекст
- **Уточняющих вопросов** - Построение на основе предыдущих ответов
- **Интерактивных приложений** - Интерфейсы чата, REPL
- **Логики, управляемой ответами** - Когда следующее действие зависит от ответа Claude
- **Управления сессией** - Явное управление жизненным циклом разговора

## Функции

### `query()`

Создает новую сессию для каждого взаимодействия с Claude Code. Возвращает асинхронный итератор, который выдает сообщения по мере их поступления. Каждый вызов `query()` начинается с чистого листа без памяти о предыдущих взаимодействиях.

```python
async def query(
    *,
    prompt: str | AsyncIterable[dict[str, Any]],
    options: ClaudeAgentOptions | None = None
) -> AsyncIterator[Message]
```

#### Параметры

| Параметр | Тип                         | Описание                                                                |
| :-------- | :--------------------------- | :------------------------------------------------------------------------- |
| `prompt`  | `str \| AsyncIterable[dict]` | Входная подсказка в виде строки или асинхронного итератора для потокового режима          |
| `options` | `ClaudeAgentOptions \| None` | Необязательный объект конфигурации (по умолчанию `ClaudeAgentOptions()`, если None) |

#### Возвращаемое значение

Возвращает `AsyncIterator[Message]`, который выдает сообщения из разговора.

#### Пример - С опциями

```python

import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions

async def main():
    options = ClaudeAgentOptions(
        system_prompt="You are an expert Python developer",
        permission_mode='acceptEdits',
        cwd="/home/user/project"
    )

    async for message in query(
        prompt="Create a Python web server",
        options=options
    ):
        print(message)


asyncio.run(main())
```

### `tool()`

Декоратор для определения MCP инструментов с типобезопасностью.

```python
def tool(
    name: str,
    description: str,
    input_schema: type | dict[str, Any]
) -> Callable[[Callable[[Any], Awaitable[dict[str, Any]]]], SdkMcpTool[Any]]
```

#### Параметры

| Параметр      | Тип                     | Описание                                             |
| :------------- | :----------------------- | :------------------------------------------------------ |
| `name`         | `str`                    | Уникальный идентификатор инструмента                          |
| `description`  | `str`                    | Понятное описание того, что делает инструмент        |
| `input_schema` | `type \| dict[str, Any]` | Схема, определяющая входные параметры инструмента (см. ниже) |

#### Опции схемы ввода

1. **Простое сопоставление типов** (рекомендуется):

   ```python
   {"text": str, "count": int, "enabled": bool}
   ```

2. **Формат JSON Schema** (для сложной валидации):
   ```python
   {
       "type": "object",
       "properties": {
           "text": {"type": "string"},
           "count": {"type": "integer", "minimum": 0}
       },
       "required": ["text"]
   }
   ```

#### Возвращаемое значение

Функция-декоратор, которая оборачивает реализацию инструмента и возвращает экземпляр `SdkMcpTool`.

#### Пример

```python
from claude_agent_sdk import tool
from typing import Any

@tool("greet", "Greet a user", {"name": str})
async def greet(args: dict[str, Any]) -> dict[str, Any]:
    return {
        "content": [{
            "type": "text",
            "text": f"Hello, {args['name']}!"
        }]
    }
```

### `create_sdk_mcp_server()`

Создайте встроенный MCP сервер, который работает в вашем приложении Python.

```python
def create_sdk_mcp_server(
    name: str,
    version: str = "1.0.0",
    tools: list[SdkMcpTool[Any]] | None = None
) -> McpSdkServerConfig
```

#### Параметры

| Параметр | Тип                            | По умолчанию   | Описание                                           |
| :-------- | :------------------------------ | :-------- | :---------------------------------------------------- |
| `name`    | `str`                           | -         | Уникальный идентификатор сервера                      |
| `version` | `str`                           | `"1.0.0"` | Строка версии сервера                                 |
| `tools`   | `list[SdkMcpTool[Any]] \| None` | `None`    | Список функций инструментов, созданных с декоратором `@tool` |

#### Возвращаемое значение

Возвращает объект `McpSdkServerConfig`, который можно передать в `ClaudeAgentOptions.mcp_servers`.

#### Пример

```python
from claude_agent_sdk import tool, create_sdk_mcp_server

@tool("add", "Add two numbers", {"a": float, "b": float})
async def add(args):
    return {
        "content": [{
            "type": "text",
            "text": f"Sum: {args['a'] + args['b']}"
        }]
    }

@tool("multiply", "Multiply two numbers", {"a": float, "b": float})
async def multiply(args):
    return {
        "content": [{
            "type": "text",
            "text": f"Product: {args['a'] * args['b']}"
        }]
    }

calculator = create_sdk_mcp_server(
    name="calculator",
    version="2.0.0",
    tools=[add, multiply]  # Pass decorated functions
)

# Use with Claude
options = ClaudeAgentOptions(
    mcp_servers={"calc": calculator},
    allowed_tools=["mcp__calc__add", "mcp__calc__multiply"]
)
```

## Классы

### `ClaudeSDKClient`

**Сохраняет сессию разговора в нескольких обменах.** Это эквивалент Python функции `query()` TypeScript SDK - она создает объект клиента, который может продолжать разговоры.

#### Ключевые функции

- **Непрерывность сессии**: Сохраняет контекст разговора в нескольких вызовах `query()`
- **Один разговор**: Claude помнит предыдущие сообщения в сессии
- **Поддержка прерываний**: Может остановить Claude во время выполнения
- **Явный жизненный цикл**: Вы контролируете, когда сессия начинается и заканчивается
- **Логика, управляемая ответами**: Может реагировать на ответы и отправлять уточнения
- **Пользовательские инструменты и Hooks**: Поддерживает пользовательские инструменты (созданные с декоратором `@tool`) и hooks

```python
class ClaudeSDKClient:
    def __init__(self, options: ClaudeAgentOptions | None = None)
    async def connect(self, prompt: str | AsyncIterable[dict] | None = None) -> None
    async def query(self, prompt: str | AsyncIterable[dict], session_id: str = "default") -> None
    async def receive_messages(self) -> AsyncIterator[Message]
    async def receive_response(self) -> AsyncIterator[Message]
    async def interrupt(self) -> None
    async def disconnect(self) -> None
```

#### Методы

| Метод                      | Описание                                                         |
| :-------------------------- | :------------------------------------------------------------------ |
| `__init__(options)`         | Инициализировать клиент с необязательной конфигурацией                   |
| `connect(prompt)`           | Подключиться к Claude с необязательной начальной подсказкой или потоком сообщений |
| `query(prompt, session_id)` | Отправить новый запрос в потоковом режиме                                |
| `receive_messages()`        | Получить все сообщения от Claude как асинхронный итератор               |
| `receive_response()`        | Получить сообщения до и включая ResultMessage                |
| `interrupt()`               | Отправить сигнал прерывания (работает только в потоковом режиме)                |
| `disconnect()`              | Отключиться от Claude                                              |

#### Поддержка контекстного менеджера

Клиент можно использовать как асинхронный контекстный менеджер для автоматического управления соединением:

```python
async with ClaudeSDKClient() as client:
    await client.query("Hello Claude")
    async for message in client.receive_response():
        print(message)
```

> **Важно:** При итерации по сообщениям избегайте использования `break` для раннего выхода, так как это может вызвать проблемы с очисткой asyncio. Вместо этого позвольте итерации завершиться естественным образом или используйте флаги для отслеживания, когда вы нашли то, что вам нужно.

#### Пример - Продолжение разговора

```python
import asyncio
from claude_agent_sdk import ClaudeSDKClient, AssistantMessage, TextBlock, ResultMessage

async def main():
    async with ClaudeSDKClient() as client:
        # First question
        await client.query("What's the capital of France?")

        # Process response
        async for message in client.receive_response():
            if isinstance(message, AssistantMessage):
                for block in message.content:
                    if isinstance(block, TextBlock):
                        print(f"Claude: {block.text}")

        # Follow-up question - Claude remembers the previous context
        await client.query("What's the population of that city?")

        async for message in client.receive_response():
            if isinstance(message, AssistantMessage):
                for block in message.content:
                    if isinstance(block, TextBlock):
                        print(f"Claude: {block.text}")

        # Another follow-up - still in the same conversation
        await client.query("What are some famous landmarks there?")

        async for message in client.receive_response():
            if isinstance(message, AssistantMessage):
                for block in message.content:
                    if isinstance(block, TextBlock):
                        print(f"Claude: {block.text}")

asyncio.run(main())
```

#### Пример - Потоковый ввод с ClaudeSDKClient

```python
import asyncio
from claude_agent_sdk import ClaudeSDKClient

async def message_stream():
    """Generate messages dynamically."""
    yield {"type": "text", "text": "Analyze the following data:"}
    await asyncio.sleep(0.5)
    yield {"type": "text", "text": "Temperature: 25°C"}
    await asyncio.sleep(0.5)
    yield {"type": "text", "text": "Humidity: 60%"}
    await asyncio.sleep(0.5)
    yield {"type": "text", "text": "What patterns do you see?"}

async def main():
    async with ClaudeSDKClient() as client:
        # Stream input to Claude
        await client.query(message_stream())

        # Process response
        async for message in client.receive_response():
            print(message)

        # Follow-up in same session
        await client.query("Should we be concerned about these readings?")

        async for message in client.receive_response():
            print(message)

asyncio.run(main())
```

#### Пример - Использование прерываний

```python
import asyncio
from claude_agent_sdk import ClaudeSDKClient, ClaudeAgentOptions

async def interruptible_task():
    options = ClaudeAgentOptions(
        allowed_tools=["Bash"],
        permission_mode="acceptEdits"
    )

    async with ClaudeSDKClient(options=options) as client:
        # Start a long-running task
        await client.query("Count from 1 to 100 slowly")

        # Let it run for a bit
        await asyncio.sleep(2)

        # Interrupt the task
        await client.interrupt()
        print("Task interrupted!")

        # Send a new command
        await client.query("Just say hello instead")

        async for message in client.receive_response():
            # Process the new response
            pass

asyncio.run(interruptible_task())
```

#### Пример - Расширенное управление разрешениями

```python
from claude_agent_sdk import (
    ClaudeSDKClient,
    ClaudeAgentOptions
)

async def custom_permission_handler(
    tool_name: str,
    input_data: dict,
    context: dict
):
    """Custom logic for tool permissions."""

    # Block writes to system directories
    if tool_name == "Write" and input_data.get("file_path", "").startswith("/system/"):
        return {
            "behavior": "deny",
            "message": "System directory write not allowed",
            "interrupt": True
        }

    # Redirect sensitive file operations
    if tool_name in ["Write", "Edit"] and "config" in input_data.get("file_path", ""):
        safe_path = f"./sandbox/{input_data['file_path']}"
        return {
            "behavior": "allow",
            "updatedInput": {**input_data, "file_path": safe_path}
        }

    # Allow everything else
    return {
        "behavior": "allow",
        "updatedInput": input_data
    }

async def main():
    options = ClaudeAgentOptions(
        can_use_tool=custom_permission_handler,
        allowed_tools=["Read", "Write", "Edit"]
    )

    async with ClaudeSDKClient(options=options) as client:
        await client.query("Update the system config file")

        async for message in client.receive_response():
            # Will use sandbox path instead
            print(message)

asyncio.run(main())
```

## Типы

### `SdkMcpTool`

Определение инструмента SDK MCP, созданного с декоратором `@tool`.

```python
@dataclass
class SdkMcpTool(Generic[T]):
    name: str
    description: str
    input_schema: type[T] | dict[str, Any]
    handler: Callable[[T], Awaitable[dict[str, Any]]]
```

| Свойство       | Тип                                       | Описание                                |
| :------------- | :----------------------------------------- | :----------------------------------------- |
| `name`         | `str`                                      | Уникальный идентификатор инструмента             |
| `description`  | `str`                                      | Понятное описание                 |
| `input_schema` | `type[T] \| dict[str, Any]`                | Схема для валидации ввода                |
| `handler`      | `Callable[[T], Awaitable[dict[str, Any]]]` | Асинхронная функция, которая обрабатывает выполнение инструмента |

### `ClaudeAgentOptions`

Конфигурационный dataclass для запросов Claude Code.

```python
@dataclass
class ClaudeAgentOptions:
    allowed_tools: list[str] = field(default_factory=list)
    system_prompt: str | SystemPromptPreset | None = None
    mcp_servers: dict[str, McpServerConfig] | str | Path = field(default_factory=dict)
    permission_mode: PermissionMode | None = None
    continue_conversation: bool = False
    resume: str | None = None
    max_turns: int | None = None
    disallowed_tools: list[str] = field(default_factory=list)
    model: str | None = None
    output_format: OutputFormat | None = None
    permission_prompt_tool_name: str | None = None
    cwd: str | Path | None = None
    settings: str | None = None
    add_dirs: list[str | Path] = field(default_factory=list)
    env: dict[str, str] = field(default_factory=dict)
    extra_args: dict[str, str | None] = field(default_factory=dict)
    max_buffer_size: int | None = None
    debug_stderr: Any = sys.stderr  # Deprecated
    stderr: Callable[[str], None] | None = None
    can_use_tool: CanUseTool | None = None
    hooks: dict[HookEvent, list[HookMatcher]] | None = None
    user: str | None = None
    include_partial_messages: bool = False
    fork_session: bool = False
    agents: dict[str, AgentDefinition] | None = None
    setting_sources: list[SettingSource] | None = None
```

| Свойство                      | Тип                                         | По умолчанию              | Описание                                                                                                                                                                             |
| :---------------------------- | :------------------------------------------- | :------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `allowed_tools`               | `list[str]`                                  | `[]`                 | Список разрешенных имен инструментов                                                                                                                                                              |
| `system_prompt`               | `str \| SystemPromptPreset \| None`          | `None`               | Конфигурация системной подсказки. Передайте строку для пользовательской подсказки или используйте `{"type": "preset", "preset": "claude_code"}` для системной подсказки Claude Code. Добавьте `"append"` для расширения предустановки |
| `mcp_servers`                 | `dict[str, McpServerConfig] \| str \| Path`  | `{}`                 | Конфигурации MCP сервера или путь к файлу конфигурации                                                                                                                                        |
| `permission_mode`             | `PermissionMode \| None`                     | `None`               | Режим разрешения для использования инструментов                                                                                                                                                          |
| `continue_conversation`       | `bool`                                       | `False`              | Продолжить самый последний разговор                                                                                                                                                                   |
| `resume`                      | `str \| None`                                | `None`               | ID сессии для возобновления                                                                                                                                                                    |
| `max_turns`                   | `int \| None`                                | `None`               | Максимальное количество ходов разговора                                                                                                                                                              |
| `disallowed_tools`            | `list[str]`                                  | `[]`                 | Список запрещенных имен инструментов                                                                                                                                                           |
| `model`                       | `str \| None`                                | `None`               | Модель Claude для использования                                                                                                                                                                     |
| `output_format`               | [`OutputFormat`](#outputformat) ` \| None`   | `None`               | Определите формат вывода для результатов агента. Подробнее см. [Структурированные выходы](/docs/ru/agent-sdk/structured-outputs)                                                                    |
| `permission_prompt_tool_name` | `str \| None`                                | `None`               | Имя инструмента MCP для подсказок разрешения                                                                                                                                                    |
| `cwd`                         | `str \| Path \| None`                        | `None`               | Текущий рабочий каталог                                                                                                                                                               |
| `settings`                    | `str \| None`                                | `None`               | Путь к файлу настроек                                                                                                                                                                   |
| `add_dirs`                    | `list[str \| Path]`                          | `[]`                 | Дополнительные каталоги, к которым Claude может получить доступ                                                                                                                                                |
| `env`                         | `dict[str, str]`                             | `{}`                 | Переменные окружения                                                                                                                                                                                   |
| `extra_args`                  | `dict[str, str \| None]`                     | `{}`                 | Дополнительные аргументы CLI для передачи непосредственно в CLI                                                                                                                                    |
| `max_buffer_size`             | `int \| None`                                | `None`               | Максимальное количество байтов при буферизации stdout CLI                                                                                                                                                 |
| `debug_stderr`                | `Any`                                        | `sys.stderr`         | _Устарело_ - Объект, похожий на файл, для вывода отладки. Вместо этого используйте обратный вызов `stderr`                                                                                         |
| `stderr`                      | `Callable[[str], None] \| None`              | `None`               | Функция обратного вызова для вывода stderr из CLI                                                                                                                                            |
| `can_use_tool`                | `CanUseTool \| None`                         | `None`               | Функция обратного вызова разрешения инструмента                                                                                                                                                       |
| `hooks`                       | `dict[HookEvent, list[HookMatcher]] \| None` | `None`               | Конфигурации hook для перехвата событий                                                                                                                                             |
| `user`                        | `str \| None`                                | `None`               | Идентификатор пользователя                                                                                                                                                                         |
| `include_partial_messages`    | `bool`                                       | `False`              | Включить события потоковой передачи частичных сообщений                                                                                                                                                                |
| `fork_session`                | `bool`                                       | `False`              | При возобновлении с `resume` разветвить на новый ID сессии вместо продолжения исходной сессии                                                                                        |
| `agents`                      | `dict[str, AgentDefinition] \| None`         | `None`               | Программно определенные подагенты                                                                                                                                                      |
| `plugins`                     | `list[SdkPluginConfig]`                      | `[]`                 | Загрузить пользовательские плагины из локальных путей. Подробнее см. [Плагины](/docs/ru/agent-sdk/plugins)                                                                             |
| `sandbox`                     | [`SandboxSettings`](#sandboxsettings) ` \| None` | `None`              | Программно настроить поведение песочницы. Подробнее см. [Параметры песочницы](#sandboxsettings)                                        |
| `setting_sources`             | `list[SettingSource] \| None`                | `None` (нет настроек) | Контролируйте, какие параметры файловой системы загружать. Если опущено, параметры не загружаются. **Примечание:** Должно включать `"project"` для загрузки файлов CLAUDE.md                                             |

### `OutputFormat`

Конфигурация для валидации структурированного вывода.

```python
class OutputFormat(TypedDict):
    type: Literal["json_schema"]
    schema: dict[str, Any]
```

| Поле    | Обязательно | Описание                                    |
| :------- | :------- | :--------------------------------------------- |
| `type`   | Да      | Должно быть `"json_schema"` для валидации JSON Schema |
| `schema` | Да      | Определение JSON Schema для валидации вывода   |

### `SystemPromptPreset`

Конфигурация для использования предустановленной системной подсказки Claude Code с необязательными дополнениями.

```python
class SystemPromptPreset(TypedDict):
    type: Literal["preset"]
    preset: Literal["claude_code"]
    append: NotRequired[str]
```

| Поле    | Обязательно | Описание                                                   |
| :------- | :------- | :------------------------------------------------------------ |
| `type`   | Да      | Должно быть `"preset"` для использования предустановленной системной подсказки              |
| `preset` | Да      | Должно быть `"claude_code"` для использования системной подсказки Claude Code    |
| `append` | Нет       | Дополнительные инструкции для добавления к предустановленной системной подсказке |

### `SettingSource`

Контролирует, какие источники конфигурации на основе файловой системы загружает SDK.

```python
SettingSource = Literal["user", "project", "local"]
```

| Значение       | Описание                                  | Местоположение                      |
| :---------- | :------------------------------------------- | :---------------------------- |
| `"user"`    | Глобальные параметры пользователя                         | `~/.claude/settings.json`     |
| `"project"` | Общие параметры проекта (контролируемые версией) | `.claude/settings.json`       |
| `"local"`   | Локальные параметры проекта (gitignored)          | `.claude/settings.local.json` |

#### Поведение по умолчанию

Когда `setting_sources` **опущено** или **`None`**, SDK **не** загружает параметры файловой системы. Это обеспечивает изоляцию для приложений SDK.

#### Зачем использовать setting_sources?

**Загрузить все параметры файловой системы (устаревшее поведение):**

```python
# Load all settings like SDK v0.0.x did
from claude_agent_sdk import query, ClaudeAgentOptions

async for message in query(
    prompt="Analyze this code",
    options=ClaudeAgentOptions(
        setting_sources=["user", "project", "local"]  # Load all settings
    )
):
    print(message)
```

**Загрузить только определенные источники параметров:**

```python
# Load only project settings, ignore user and local
async for message in query(
    prompt="Run CI checks",
    options=ClaudeAgentOptions(
        setting_sources=["project"]  # Only .claude/settings.json
    )
):
    print(message)
```

**Тестирование и окружения CI:**

```python
# Ensure consistent behavior in CI by excluding local settings
async for message in query(
    prompt="Run tests",
    options=ClaudeAgentOptions(
        setting_sources=["project"],  # Only team-shared settings
        permission_mode="bypassPermissions"
    )
):
    print(message)
```

**Приложения только для SDK:**

```python
# Define everything programmatically (default behavior)
# No filesystem dependencies - setting_sources defaults to None
async for message in query(
    prompt="Review this PR",
    options=ClaudeAgentOptions(
        # setting_sources=None is the default, no need to specify
        agents={ /* ... */ },
        mcp_servers={ /* ... */ },
        allowed_tools=["Read", "Grep", "Glob"]
    )
):
    print(message)
```

**Загрузка инструкций проекта CLAUDE.md:**

```python
# Load project settings to include CLAUDE.md files
async for message in query(
    prompt="Add a new feature following project conventions",
    options=ClaudeAgentOptions(
        system_prompt={
            "type": "preset",
            "preset": "claude_code"  # Use Claude Code's system prompt
        },
        setting_sources=["project"],  # Required to load CLAUDE.md from project
        allowed_tools=["Read", "Write", "Edit"]
    )
):
    print(message)
```

#### Приоритет параметров

Когда загружаются несколько источников, параметры объединяются с этим приоритетом (от наивысшего к наименьшему):

1. Локальные параметры (`.claude/settings.local.json`)
2. Параметры проекта (`.claude/settings.json`)
3. Параметры пользователя (`~/.claude/settings.json`)

Программные опции (такие как `agents`, `allowed_tools`) всегда переопределяют параметры файловой системы.

### `AgentDefinition`

Конфигурация для подагента, определенного программно.

```python
@dataclass
class AgentDefinition:
    description: str
    prompt: str
    tools: list[str] | None = None
    model: Literal["sonnet", "opus", "haiku", "inherit"] | None = None
```

| Поле         | Обязательно | Описание                                                    |
| :------------ | :------- | :------------------------------------------------------------- |
| `description` | Да      | Описание на естественном языке того, когда использовать этого агента         |
| `tools`       | Нет       | Массив разрешенных имен инструментов. Если опущено, наследует все инструменты    |
| `prompt`      | Да      | Системная подсказка агента                                      |
| `model`       | Нет       | Переопределение модели для этого агента. Если опущено, использует основную модель |

### `PermissionMode`

Режимы разрешения для управления выполнением инструментов.

```python
PermissionMode = Literal[
    "default",           # Standard permission behavior
    "acceptEdits",       # Auto-accept file edits
    "plan",              # Planning mode - no execution
    "bypassPermissions"  # Bypass all permission checks (use with caution)
]
```

### `McpSdkServerConfig`

Конфигурация для SDK MCP серверов, созданных с помощью `create_sdk_mcp_server()`.

```python
class McpSdkServerConfig(TypedDict):
    type: Literal["sdk"]
    name: str
    instance: Any  # MCP Server instance
```

### `McpServerConfig`

Тип объединения для конфигураций MCP сервера.

```python
McpServerConfig = McpStdioServerConfig | McpSSEServerConfig | McpHttpServerConfig | McpSdkServerConfig
```

#### `McpStdioServerConfig`

```python
class McpStdioServerConfig(TypedDict):
    type: NotRequired[Literal["stdio"]]  # Optional for backwards compatibility
    command: str
    args: NotRequired[list[str]]
    env: NotRequired[dict[str, str]]
```

#### `McpSSEServerConfig`

```python
class McpSSEServerConfig(TypedDict):
    type: Literal["sse"]
    url: str
    headers: NotRequired[dict[str, str]]
```

#### `McpHttpServerConfig`

```python
class McpHttpServerConfig(TypedDict):
    type: Literal["http"]
    url: str
    headers: NotRequired[dict[str, str]]
```

### `SdkPluginConfig`

Конфигурация для загрузки плагинов в SDK.

```python
class SdkPluginConfig(TypedDict):
    type: Literal["local"]
    path: str
```

| Поле | Тип | Описание |
|:------|:-----|:------------|
| `type` | `Literal["local"]` | Должно быть `"local"` (в настоящее время поддерживаются только локальные плагины) |
| `path` | `str` | Абсолютный или относительный путь к каталогу плагина |

**Пример:**
```python
plugins=[
    {"type": "local", "path": "./my-plugin"},
    {"type": "local", "path": "/absolute/path/to/plugin"}
]
```

Полную информацию о создании и использовании плагинов см. в разделе [Плагины](/docs/ru/agent-sdk/plugins).

## Типы сообщений

### `Message`

Тип объединения всех возможных сообщений.

```python
Message = UserMessage | AssistantMessage | SystemMessage | ResultMessage
```

### `UserMessage`

Сообщение пользовательского ввода.

```python
@dataclass
class UserMessage:
    content: str | list[ContentBlock]
```

### `AssistantMessage`

Сообщение ответа помощника с блоками содержимого.

```python
@dataclass
class AssistantMessage:
    content: list[ContentBlock]
    model: str
```

### `SystemMessage`

Системное сообщение с метаданными.

```python
@dataclass
class SystemMessage:
    subtype: str
    data: dict[str, Any]
```

### `ResultMessage`

Финальное сообщение результата с информацией о стоимости и использовании.

```python
@dataclass
class ResultMessage:
    subtype: str
    duration_ms: int
    duration_api_ms: int
    is_error: bool
    num_turns: int
    session_id: str
    total_cost_usd: float | None = None
    usage: dict[str, Any] | None = None
    result: str | None = None
```

## Типы блоков содержимого

### `ContentBlock`

Тип объединения всех блоков содержимого.

```python
ContentBlock = TextBlock | ThinkingBlock | ToolUseBlock | ToolResultBlock
```

### `TextBlock`

Блок текстового содержимого.

```python
@dataclass
class TextBlock:
    text: str
```

### `ThinkingBlock`

Блок содержимого мышления (для моделей с возможностью мышления).

```python
@dataclass
class ThinkingBlock:
    thinking: str
    signature: str
```

### `ToolUseBlock`

Блок запроса использования инструмента.

```python
@dataclass
class ToolUseBlock:
    id: str
    name: str
    input: dict[str, Any]
```

### `ToolResultBlock`

Блок результата выполнения инструмента.

```python
@dataclass
class ToolResultBlock:
    tool_use_id: str
    content: str | list[dict[str, Any]] | None = None
    is_error: bool | None = None
```

## Типы ошибок

### `ClaudeSDKError`

Базовый класс исключения для всех ошибок SDK.

```python
class ClaudeSDKError(Exception):
    """Base error for Claude SDK."""
```

### `CLINotFoundError`

Возникает, когда Claude Code CLI не установлен или не найден.

```python
class CLINotFoundError(CLIConnectionError):
    def __init__(self, message: str = "Claude Code not found", cli_path: str | None = None):
        """
        Args:
            message: Error message (default: "Claude Code not found")
            cli_path: Optional path to the CLI that was not found
        """
```

### `CLIConnectionError`

Возникает, когда соединение с Claude Code не удается.

```python
class CLIConnectionError(ClaudeSDKError):
    """Failed to connect to Claude Code."""
```

### `ProcessError`

Возникает, когда процесс Claude Code завершается с ошибкой.

```python
class ProcessError(ClaudeSDKError):
    def __init__(self, message: str, exit_code: int | None = None, stderr: str | None = None):
        self.exit_code = exit_code
        self.stderr = stderr
```

### `CLIJSONDecodeError`

Возникает, когда анализ JSON не удается.

```python
class CLIJSONDecodeError(ClaudeSDKError):
    def __init__(self, line: str, original_error: Exception):
        """
        Args:
            line: The line that failed to parse
            original_error: The original JSON decode exception
        """
        self.line = line
        self.original_error = original_error
```

## Типы хуков

Для подробного руководства по использованию хуков с примерами и общими шаблонами см. [руководство по хукам](/docs/ru/agent-sdk/hooks).

### `HookEvent`

Поддерживаемые типы событий хука. Обратите внимание, что из-за ограничений установки Python SDK не поддерживает хуки SessionStart, SessionEnd и Notification.

```python
HookEvent = Literal[
    "PreToolUse",      # Called before tool execution
    "PostToolUse",     # Called after tool execution
    "UserPromptSubmit", # Called when user submits a prompt
    "Stop",            # Called when stopping execution
    "SubagentStop",    # Called when a subagent stops
    "PreCompact"       # Called before message compaction
]
```

### `HookCallback`

Определение типа для функций обратного вызова хука.

```python
HookCallback = Callable[
    [dict[str, Any], str | None, HookContext],
    Awaitable[dict[str, Any]]
]
```

Параметры:

- `input_data`: Данные входа, специфичные для хука (см. [руководство по хукам](/docs/ru/agent-sdk/hooks#input-data))
- `tool_use_id`: Необязательный идентификатор использования инструмента (для хуков, связанных с инструментами)
- `context`: Контекст хука с дополнительной информацией

Возвращает словарь, который может содержать:

- `decision`: `"block"` для блокировки действия
- `systemMessage`: Системное сообщение для добавления в стенограмму
- `hookSpecificOutput`: Выходные данные, специфичные для хука

### `HookContext`

Информация контекста, передаваемая в обратные вызовы хука.

```python
@dataclass
class HookContext:
    signal: Any | None = None  # Future: abort signal support
```

### `HookMatcher`

Конфигурация для сопоставления хуков с конкретными событиями или инструментами.

```python
@dataclass
class HookMatcher:
    matcher: str | None = None        # Tool name or pattern to match (e.g., "Bash", "Write|Edit")
    hooks: list[HookCallback] = field(default_factory=list)  # List of callbacks to execute
    timeout: float | None = None        # Timeout in seconds for all hooks in this matcher (default: 60)
```

### Пример использования хука

Этот пример регистрирует два хука: один, который блокирует опасные команды bash, такие как `rm -rf /`, и другой, который регистрирует все использование инструментов для аудита. Хук безопасности работает только с командами Bash (через `matcher`), в то время как хук логирования работает со всеми инструментами.

```python
from claude_agent_sdk import query, ClaudeAgentOptions, HookMatcher, HookContext
from typing import Any

async def validate_bash_command(
    input_data: dict[str, Any],
    tool_use_id: str | None,
    context: HookContext
) -> dict[str, Any]:
    """Validate and potentially block dangerous bash commands."""
    if input_data['tool_name'] == 'Bash':
        command = input_data['tool_input'].get('command', '')
        if 'rm -rf /' in command:
            return {
                'hookSpecificOutput': {
                    'hookEventName': 'PreToolUse',
                    'permissionDecision': 'deny',
                    'permissionDecisionReason': 'Dangerous command blocked'
                }
            }
    return {}

async def log_tool_use(
    input_data: dict[str, Any],
    tool_use_id: str | None,
    context: HookContext
) -> dict[str, Any]:
    """Log all tool usage for auditing."""
    print(f"Tool used: {input_data.get('tool_name')}")
    return {}

options = ClaudeAgentOptions(
    hooks={
        'PreToolUse': [
            HookMatcher(matcher='Bash', hooks=[validate_bash_command], timeout=120),  # 2 min for validation
            HookMatcher(hooks=[log_tool_use])  # Applies to all tools (default 60s timeout)
        ],
        'PostToolUse': [
            HookMatcher(hooks=[log_tool_use])
        ]
    }
)

async for message in query(
    prompt="Analyze this codebase",
    options=options
):
    print(message)
```

## Типы входа/выхода инструмента

Документация схем входа/выхода для всех встроенных инструментов Claude Code. Хотя Python SDK не экспортирует их как типы, они представляют структуру входов и выходов инструментов в сообщениях.

### Task

**Имя инструмента:** `Task`

**Вход:**

```python
{
    "description": str,      # A short (3-5 word) description of the task
    "prompt": str,           # The task for the agent to perform
    "subagent_type": str     # The type of specialized agent to use
}
```

**Выход:**

```python
{
    "result": str,                    # Final result from the subagent
    "usage": dict | None,             # Token usage statistics
    "total_cost_usd": float | None,  # Total cost in USD
    "duration_ms": int | None         # Execution duration in milliseconds
}
```

### Bash

**Имя инструмента:** `Bash`

**Вход:**

```python
{
    "command": str,                  # The command to execute
    "timeout": int | None,           # Optional timeout in milliseconds (max 600000)
    "description": str | None,       # Clear, concise description (5-10 words)
    "run_in_background": bool | None # Set to true to run in background
}
```

**Выход:**

```python
{
    "output": str,              # Combined stdout and stderr output
    "exitCode": int,            # Exit code of the command
    "killed": bool | None,      # Whether command was killed due to timeout
    "shellId": str | None       # Shell ID for background processes
}
```

### Edit

**Имя инструмента:** `Edit`

**Вход:**

```python
{
    "file_path": str,           # The absolute path to the file to modify
    "old_string": str,          # The text to replace
    "new_string": str,          # The text to replace it with
    "replace_all": bool | None  # Replace all occurrences (default False)
}
```

**Выход:**

```python
{
    "message": str,      # Confirmation message
    "replacements": int, # Number of replacements made
    "file_path": str     # File path that was edited
}
```

### Read

**Имя инструмента:** `Read`

**Вход:**

```python
{
    "file_path": str,       # The absolute path to the file to read
    "offset": int | None,   # The line number to start reading from
    "limit": int | None     # The number of lines to read
}
```

**Выход (текстовые файлы):**

```python
{
    "content": str,         # File contents with line numbers
    "total_lines": int,     # Total number of lines in file
    "lines_returned": int   # Lines actually returned
}
```

**Выход (изображения):**

```python
{
    "image": str,       # Base64 encoded image data
    "mime_type": str,   # Image MIME type
    "file_size": int    # File size in bytes
}
```

### Write

**Имя инструмента:** `Write`

**Вход:**

```python
{
    "file_path": str,  # The absolute path to the file to write
    "content": str     # The content to write to the file
}
```

**Выход:**

```python
{
    "message": str,        # Success message
    "bytes_written": int,  # Number of bytes written
    "file_path": str       # File path that was written
}
```

### Glob

**Имя инструмента:** `Glob`

**Вход:**

```python
{
    "pattern": str,       # The glob pattern to match files against
    "path": str | None    # The directory to search in (defaults to cwd)
}
```

**Выход:**

```python
{
    "matches": list[str],  # Array of matching file paths
    "count": int,          # Number of matches found
    "search_path": str     # Search directory used
}
```

### Grep

**Имя инструмента:** `Grep`

**Вход:**

```python
{
    "pattern": str,                    # The regular expression pattern
    "path": str | None,                # File or directory to search in
    "glob": str | None,                # Glob pattern to filter files
    "type": str | None,                # File type to search
    "output_mode": str | None,         # "content", "files_with_matches", or "count"
    "-i": bool | None,                 # Case insensitive search
    "-n": bool | None,                 # Show line numbers
    "-B": int | None,                  # Lines to show before each match
    "-A": int | None,                  # Lines to show after each match
    "-C": int | None,                  # Lines to show before and after
    "head_limit": int | None,          # Limit output to first N lines/entries
    "multiline": bool | None           # Enable multiline mode
}
```

**Выход (режим content):**

```python
{
    "matches": [
        {
            "file": str,
            "line_number": int | None,
            "line": str,
            "before_context": list[str] | None,
            "after_context": list[str] | None
        }
    ],
    "total_matches": int
}
```

**Выход (режим files_with_matches):**

```python
{
    "files": list[str],  # Files containing matches
    "count": int         # Number of files with matches
}
```

### NotebookEdit

**Имя инструмента:** `NotebookEdit`

**Вход:**

```python
{
    "notebook_path": str,                     # Absolute path to the Jupyter notebook
    "cell_id": str | None,                    # The ID of the cell to edit
    "new_source": str,                        # The new source for the cell
    "cell_type": "code" | "markdown" | None,  # The type of the cell
    "edit_mode": "replace" | "insert" | "delete" | None  # Edit operation type
}
```

**Выход:**

```python
{
    "message": str,                              # Success message
    "edit_type": "replaced" | "inserted" | "deleted",  # Type of edit performed
    "cell_id": str | None,                       # Cell ID that was affected
    "total_cells": int                           # Total cells in notebook after edit
}
```

### WebFetch

**Имя инструмента:** `WebFetch`

**Вход:**

```python
{
    "url": str,     # The URL to fetch content from
    "prompt": str   # The prompt to run on the fetched content
}
```

**Выход:**

```python
{
    "response": str,           # AI model's response to the prompt
    "url": str,                # URL that was fetched
    "final_url": str | None,   # Final URL after redirects
    "status_code": int | None  # HTTP status code
}
```

### WebSearch

**Имя инструмента:** `WebSearch`

**Вход:**

```python
{
    "query": str,                        # The search query to use
    "allowed_domains": list[str] | None, # Only include results from these domains
    "blocked_domains": list[str] | None  # Never include results from these domains
}
```

**Выход:**

```python
{
    "results": [
        {
            "title": str,
            "url": str,
            "snippet": str,
            "metadata": dict | None
        }
    ],
    "total_results": int,
    "query": str
}
```

### TodoWrite

**Имя инструмента:** `TodoWrite`

**Вход:**

```python
{
    "todos": [
        {
            "content": str,                              # The task description
            "status": "pending" | "in_progress" | "completed",  # Task status
            "activeForm": str                            # Active form of the description
        }
    ]
}
```

**Выход:**

```python
{
    "message": str,  # Success message
    "stats": {
        "total": int,
        "pending": int,
        "in_progress": int,
        "completed": int
    }
}
```

### BashOutput

**Имя инструмента:** `BashOutput`

**Вход:**

```python
{
    "bash_id": str,       # The ID of the background shell
    "filter": str | None  # Optional regex to filter output lines
}
```

**Выход:**

```python
{
    "output": str,                                      # New output since last check
    "status": "running" | "completed" | "failed",       # Current shell status
    "exitCode": int | None                              # Exit code when completed
}
```

### KillBash

**Имя инструмента:** `KillBash`

**Вход:**

```python
{
    "shell_id": str  # The ID of the background shell to kill
}
```

**Выход:**

```python
{
    "message": str,  # Success message
    "shell_id": str  # ID of the killed shell
}
```

### ExitPlanMode

**Имя инструмента:** `ExitPlanMode`

**Вход:**

```python
{
    "plan": str  # The plan to run by the user for approval
}
```

**Выход:**

```python
{
    "message": str,          # Confirmation message
    "approved": bool | None  # Whether user approved the plan
}
```

### ListMcpResources

**Имя инструмента:** `ListMcpResources`

**Вход:**

```python
{
    "server": str | None  # Optional server name to filter resources by
}
```

**Выход:**

```python
{
    "resources": [
        {
            "uri": str,
            "name": str,
            "description": str | None,
            "mimeType": str | None,
            "server": str
        }
    ],
    "total": int
}
```

### ReadMcpResource

**Имя инструмента:** `ReadMcpResource`

**Вход:**

```python
{
    "server": str,  # The MCP server name
    "uri": str      # The resource URI to read
}
```

**Выход:**

```python
{
    "contents": [
        {
            "uri": str,
            "mimeType": str | None,
            "text": str | None,
            "blob": str | None
        }
    ],
    "server": str
}
```

## Расширенные функции с ClaudeSDKClient

### Построение интерфейса непрерывного диалога

```python
from claude_agent_sdk import ClaudeSDKClient, ClaudeAgentOptions, AssistantMessage, TextBlock
import asyncio

class ConversationSession:
    """Maintains a single conversation session with Claude."""

    def __init__(self, options: ClaudeAgentOptions = None):
        self.client = ClaudeSDKClient(options)
        self.turn_count = 0

    async def start(self):
        await self.client.connect()
        print("Starting conversation session. Claude will remember context.")
        print("Commands: 'exit' to quit, 'interrupt' to stop current task, 'new' for new session")

        while True:
            user_input = input(f"\n[Turn {self.turn_count + 1}] You: ")

            if user_input.lower() == 'exit':
                break
            elif user_input.lower() == 'interrupt':
                await self.client.interrupt()
                print("Task interrupted!")
                continue
            elif user_input.lower() == 'new':
                # Disconnect and reconnect for a fresh session
                await self.client.disconnect()
                await self.client.connect()
                self.turn_count = 0
                print("Started new conversation session (previous context cleared)")
                continue

            # Send message - Claude remembers all previous messages in this session
            await self.client.query(user_input)
            self.turn_count += 1

            # Process response
            print(f"[Turn {self.turn_count}] Claude: ", end="")
            async for message in self.client.receive_response():
                if isinstance(message, AssistantMessage):
                    for block in message.content:
                        if isinstance(block, TextBlock):
                            print(block.text, end="")
            print()  # New line after response

        await self.client.disconnect()
        print(f"Conversation ended after {self.turn_count} turns.")

async def main():
    options = ClaudeAgentOptions(
        allowed_tools=["Read", "Write", "Bash"],
        permission_mode="acceptEdits"
    )
    session = ConversationSession(options)
    await session.start()

# Example conversation:
# Turn 1 - You: "Create a file called hello.py"
# Turn 1 - Claude: "I'll create a hello.py file for you..."
# Turn 2 - You: "What's in that file?"
# Turn 2 - Claude: "The hello.py file I just created contains..." (remembers!)
# Turn 3 - You: "Add a main function to it"
# Turn 3 - Claude: "I'll add a main function to hello.py..." (knows which file!)

asyncio.run(main())
```

### Использование хуков для модификации поведения

```python
from claude_agent_sdk import (
    ClaudeSDKClient,
    ClaudeAgentOptions,
    HookMatcher,
    HookContext
)
import asyncio
from typing import Any

async def pre_tool_logger(
    input_data: dict[str, Any],
    tool_use_id: str | None,
    context: HookContext
) -> dict[str, Any]:
    """Log all tool usage before execution."""
    tool_name = input_data.get('tool_name', 'unknown')
    print(f"[PRE-TOOL] About to use: {tool_name}")

    # You can modify or block the tool execution here
    if tool_name == "Bash" and "rm -rf" in str(input_data.get('tool_input', {})):
        return {
            'hookSpecificOutput': {
                'hookEventName': 'PreToolUse',
                'permissionDecision': 'deny',
                'permissionDecisionReason': 'Dangerous command blocked'
            }
        }
    return {}

async def post_tool_logger(
    input_data: dict[str, Any],
    tool_use_id: str | None,
    context: HookContext
) -> dict[str, Any]:
    """Log results after tool execution."""
    tool_name = input_data.get('tool_name', 'unknown')
    print(f"[POST-TOOL] Completed: {tool_name}")
    return {}

async def user_prompt_modifier(
    input_data: dict[str, Any],
    tool_use_id: str | None,
    context: HookContext
) -> dict[str, Any]:
    """Add context to user prompts."""
    original_prompt = input_data.get('prompt', '')

    # Add timestamp to all prompts
    from datetime import datetime
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    return {
        'hookSpecificOutput': {
            'hookEventName': 'UserPromptSubmit',
            'updatedPrompt': f"[{timestamp}] {original_prompt}"
        }
    }

async def main():
    options = ClaudeAgentOptions(
        hooks={
            'PreToolUse': [
                HookMatcher(hooks=[pre_tool_logger]),
                HookMatcher(matcher='Bash', hooks=[pre_tool_logger])
            ],
            'PostToolUse': [
                HookMatcher(hooks=[post_tool_logger])
            ],
            'UserPromptSubmit': [
                HookMatcher(hooks=[user_prompt_modifier])
            ]
        },
        allowed_tools=["Read", "Write", "Bash"]
    )

    async with ClaudeSDKClient(options=options) as client:
        await client.query("List files in current directory")

        async for message in client.receive_response():
            # Hooks will automatically log tool usage
            pass

asyncio.run(main())
```

### Мониторинг прогресса в реальном времени

```python
from claude_agent_sdk import (
    ClaudeSDKClient,
    ClaudeAgentOptions,
    AssistantMessage,
    ToolUseBlock,
    ToolResultBlock,
    TextBlock
)
import asyncio

async def monitor_progress():
    options = ClaudeAgentOptions(
        allowed_tools=["Write", "Bash"],
        permission_mode="acceptEdits"
    )

    async with ClaudeSDKClient(options=options) as client:
        await client.query(
            "Create 5 Python files with different sorting algorithms"
        )

        # Monitor progress in real-time
        files_created = []
        async for message in client.receive_messages():
            if isinstance(message, AssistantMessage):
                for block in message.content:
                    if isinstance(block, ToolUseBlock):
                        if block.name == "Write":
                            file_path = block.input.get("file_path", "")
                            print(f"🔨 Creating: {file_path}")
                    elif isinstance(block, ToolResultBlock):
                        print(f"✅ Completed tool execution")
                    elif isinstance(block, TextBlock):
                        print(f"💭 Claude says: {block.text[:100]}...")

            # Check if we've received the final result
            if hasattr(message, 'subtype') and message.subtype in ['success', 'error']:
                print(f"\n🎯 Task completed!")
                break

asyncio.run(monitor_progress())
```

## Пример использования

### Базовые операции с файлами (использование query)

```python
from claude_agent_sdk import query, ClaudeAgentOptions, AssistantMessage, ToolUseBlock
import asyncio

async def create_project():
    options = ClaudeAgentOptions(
        allowed_tools=["Read", "Write", "Bash"],
        permission_mode='acceptEdits',
        cwd="/home/user/project"
    )

    async for message in query(
        prompt="Create a Python project structure with setup.py",
        options=options
    ):
        if isinstance(message, AssistantMessage):
            for block in message.content:
                if isinstance(block, ToolUseBlock):
                    print(f"Using tool: {block.name}")

asyncio.run(create_project())
```

### Обработка ошибок

```python
from claude_agent_sdk import (
    query,
    CLINotFoundError,
    ProcessError,
    CLIJSONDecodeError
)

try:
    async for message in query(prompt="Hello"):
        print(message)
except CLINotFoundError:
    print("Please install Claude Code: npm install -g @anthropic-ai/claude-code")
except ProcessError as e:
    print(f"Process failed with exit code: {e.exit_code}")
except CLIJSONDecodeError as e:
    print(f"Failed to parse response: {e}")
```

### Режим потоковой передачи с клиентом

```python
from claude_agent_sdk import ClaudeSDKClient
import asyncio

async def interactive_session():
    async with ClaudeSDKClient() as client:
        # Send initial message
        await client.query("What's the weather like?")

        # Process responses
        async for msg in client.receive_response():
            print(msg)

        # Send follow-up
        await client.query("Tell me more about that")

        # Process follow-up response
        async for msg in client.receive_response():
            print(msg)

asyncio.run(interactive_session())
```

### Использование пользовательских инструментов с ClaudeSDKClient

```python
from claude_agent_sdk import (
    ClaudeSDKClient,
    ClaudeAgentOptions,
    tool,
    create_sdk_mcp_server,
    AssistantMessage,
    TextBlock
)
import asyncio
from typing import Any

# Define custom tools with @tool decorator
@tool("calculate", "Perform mathematical calculations", {"expression": str})
async def calculate(args: dict[str, Any]) -> dict[str, Any]:
    try:
        result = eval(args["expression"], {"__builtins__": {}})
        return {
            "content": [{
                "type": "text",
                "text": f"Result: {result}"
            }]
        }
    except Exception as e:
        return {
            "content": [{
                "type": "text",
                "text": f"Error: {str(e)}"
            }],
            "is_error": True
        }

@tool("get_time", "Get current time", {})
async def get_time(args: dict[str, Any]) -> dict[str, Any]:
    from datetime import datetime
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    return {
        "content": [{
            "type": "text",
            "text": f"Current time: {current_time}"
        }]
    }

async def main():
    # Create SDK MCP server with custom tools
    my_server = create_sdk_mcp_server(
        name="utilities",
        version="1.0.0",
        tools=[calculate, get_time]
    )

    # Configure options with the server
    options = ClaudeAgentOptions(
        mcp_servers={"utils": my_server},
        allowed_tools=[
            "mcp__utils__calculate",
            "mcp__utils__get_time"
        ]
    )

    # Use ClaudeSDKClient for interactive tool usage
    async with ClaudeSDKClient(options=options) as client:
        await client.query("What's 123 * 456?")

        # Process calculation response
        async for message in client.receive_response():
            if isinstance(message, AssistantMessage):
                for block in message.content:
                    if isinstance(block, TextBlock):
                        print(f"Calculation: {block.text}")

        # Follow up with time query
        await client.query("What time is it now?")

        async for message in client.receive_response():
            if isinstance(message, AssistantMessage):
                for block in message.content:
                    if isinstance(block, TextBlock):
                        print(f"Time: {block.text}")

asyncio.run(main())
```

## Конфигурация песочницы

### `SandboxSettings`

Конфигурация для поведения песочницы. Используйте это для включения изоляции команд и программной настройки ограничений сети.

```python
class SandboxSettings(TypedDict, total=False):
    enabled: bool
    autoAllowBashIfSandboxed: bool
    excludedCommands: list[str]
    allowUnsandboxedCommands: bool
    network: SandboxNetworkConfig
    ignoreViolations: SandboxIgnoreViolations
    enableWeakerNestedSandbox: bool
```

| Свойство | Тип | По умолчанию | Описание |
| :------- | :--- | :------ | :---------- |
| `enabled` | `bool` | `False` | Включить режим песочницы для выполнения команд |
| `autoAllowBashIfSandboxed` | `bool` | `False` | Автоматически одобрять команды bash при включенной песочнице |
| `excludedCommands` | `list[str]` | `[]` | Команды, которые всегда обходят ограничения песочницы (например, `["docker"]`). Они выполняются без изоляции автоматически без участия модели |
| `allowUnsandboxedCommands` | `bool` | `False` | Разрешить модели запрашивать выполнение команд вне песочницы. Когда `True`, модель может установить `dangerouslyDisableSandbox` во входных данных инструмента, что переходит к [системе разрешений](#permissions-fallback-for-unsandboxed-commands) |
| `network` | [`SandboxNetworkConfig`](#sandboxnetworkconfig) | `None` | Конфигурация песочницы, специфичная для сети |
| `ignoreViolations` | [`SandboxIgnoreViolations`](#sandboxignoreviolations) | `None` | Настройка нарушений песочницы для игнорирования |
| `enableWeakerNestedSandbox` | `bool` | `False` | Включить более слабую вложенную песочницу для совместимости |

<Note>
**Ограничения доступа к файловой системе и сети** НЕ настраиваются через параметры песочницы. Вместо этого они получены из [правил разрешений](https://code.claude.com/docs/en/settings#permission-settings):

- **Ограничения чтения файловой системы**: Правила отказа в чтении
- **Ограничения записи в файловую систему**: Правила разрешения/отказа редактирования
- **Ограничения сети**: Правила разрешения/отказа WebFetch

Используйте параметры песочницы для изоляции выполнения команд и правила разрешений для контроля доступа к файловой системе и сети.
</Note>

#### Пример использования

```python
from claude_agent_sdk import query, ClaudeAgentOptions, SandboxSettings

sandbox_settings: SandboxSettings = {
    "enabled": True,
    "autoAllowBashIfSandboxed": True,
    "excludedCommands": ["docker"],
    "network": {
        "allowLocalBinding": True,
        "allowUnixSockets": ["/var/run/docker.sock"]
    }
}

async for message in query(
    prompt="Build and test my project",
    options=ClaudeAgentOptions(sandbox=sandbox_settings)
):
    print(message)
```

### `SandboxNetworkConfig`

Конфигурация, специфичная для сети, для режима песочницы.

```python
class SandboxNetworkConfig(TypedDict, total=False):
    allowLocalBinding: bool
    allowUnixSockets: list[str]
    allowAllUnixSockets: bool
    httpProxyPort: int
    socksProxyPort: int
```

| Свойство | Тип | По умолчанию | Описание |
| :------- | :--- | :------ | :---------- |
| `allowLocalBinding` | `bool` | `False` | Разрешить процессам привязываться к локальным портам (например, для серверов разработки) |
| `allowUnixSockets` | `list[str]` | `[]` | Пути сокетов Unix, к которым процессы могут получить доступ (например, сокет Docker) |
| `allowAllUnixSockets` | `bool` | `False` | Разрешить доступ ко всем сокетам Unix |
| `httpProxyPort` | `int` | `None` | Порт HTTP-прокси для сетевых запросов |
| `socksProxyPort` | `int` | `None` | Порт SOCKS-прокси для сетевых запросов |

### `SandboxIgnoreViolations`

Конфигурация для игнорирования конкретных нарушений песочницы.

```python
class SandboxIgnoreViolations(TypedDict, total=False):
    file: list[str]
    network: list[str]
```

| Свойство | Тип | По умолчанию | Описание |
| :------- | :--- | :------ | :---------- |
| `file` | `list[str]` | `[]` | Шаблоны путей файлов для игнорирования нарушений |
| `network` | `list[str]` | `[]` | Шаблоны сети для игнорирования нарушений |

### Откат разрешений для команд без песочницы

Когда `allowUnsandboxedCommands` включен, модель может запросить выполнение команд вне песочницы, установив `dangerouslyDisableSandbox: True` во входных данных инструмента. Эти запросы переходят к существующей системе разрешений, что означает, что будет вызван ваш обработчик `can_use_tool`, позволяя вам реализовать пользовательскую логику авторизации.

<Note>
**`excludedCommands` vs `allowUnsandboxedCommands`:**
- `excludedCommands`: Статический список команд, которые всегда обходят песочницу автоматически (например, `["docker"]`). Модель не имеет контроля над этим.
- `allowUnsandboxedCommands`: Позволяет модели решать во время выполнения, запрашивать ли выполнение без песочницы, установив `dangerouslyDisableSandbox: True` во входных данных инструмента.
</Note>

```python
from claude_agent_sdk import query, ClaudeAgentOptions

async def can_use_tool(tool: str, input: dict) -> bool:
    # Check if the model is requesting to bypass the sandbox
    if tool == "Bash" and input.get("dangerouslyDisableSandbox"):
        # The model wants to run this command outside the sandbox
        print(f"Unsandboxed command requested: {input.get('command')}")

        # Return True to allow, False to deny
        return is_command_authorized(input.get("command"))
    return True

async def main():
    async for message in query(
        prompt="Deploy my application",
        options=ClaudeAgentOptions(
            sandbox={
                "enabled": True,
                "allowUnsandboxedCommands": True  # Model can request unsandboxed execution
            },
            permission_mode="default",
            can_use_tool=can_use_tool
        )
    ):
        print(message)
```

Этот шаблон позволяет вам:

- **Аудит запросов модели**: Логирование, когда модель запрашивает выполнение без песочницы
- **Реализация списков разрешений**: Разрешить только определенным командам выполняться без песочницы
- **Добавление рабочих процессов одобрения**: Требовать явной авторизации для привилегированных операций

<Warning>
Команды, выполняемые с `dangerouslyDisableSandbox: True`, имеют полный доступ к системе. Убедитесь, что ваш обработчик `can_use_tool` тщательно проверяет эти запросы.
</Warning>

## См. также

- [Руководство Python SDK](/docs/ru/agent-sdk/python) - Учебник и примеры
- [Обзор SDK](/docs/ru/agent-sdk/overview) - Общие концепции SDK
- [Справочник TypeScript SDK](/docs/ru/agent-sdk/typescript) - Документация TypeScript SDK
- [Справочник CLI](https://code.claude.com/docs/en/cli-reference) - Интерфейс командной строки
- [Общие рабочие процессы](https://code.claude.com/docs/en/common-workflows) - Пошаговые руководства