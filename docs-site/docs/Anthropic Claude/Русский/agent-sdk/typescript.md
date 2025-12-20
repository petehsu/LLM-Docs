# Справочник Agent SDK - TypeScript

Полный справочник API для TypeScript Agent SDK, включающий все функции, типы и интерфейсы.

---

<script src="/components/typescript-sdk-type-links.js" defer />

<Note>
**Попробуйте новый интерфейс V2 (предпросмотр):** Упрощённый интерфейс с паттернами `send()` и `receive()` теперь доступен, что облегчает многооборотные диалоги. [Узнайте больше](/docs/ru/agent-sdk/typescript-v2-preview)
</Note>

## Установка

```bash
npm install @anthropic-ai/claude-agent-sdk
```

## Функции

### `query()`

Основная функция для взаимодействия с Claude Code. Создаёт асинхронный генератор, который потоком передаёт сообщения по мере их поступления.

```typescript
function query({
  prompt,
  options
}: {
  prompt: string | AsyncIterable<SDKUserMessage>;
  options?: Options;
}): Query
```

#### Параметры

| Параметр | Тип | Описание |
| :-------- | :--- | :---------- |
| `prompt` | `string \| AsyncIterable<`[`SDKUserMessage`](#sdkusermessage)`>` | Входной запрос в виде строки или асинхронного итерируемого объекта для режима потоковой передачи |
| `options` | [`Options`](#options) | Необязательный объект конфигурации (см. тип Options ниже) |

#### Возвращаемое значение

Возвращает объект [`Query`](#query-1), который расширяет `AsyncGenerator<`[`SDKMessage`](#sdkmessage)`, void>` дополнительными методами.

### `tool()`

Создаёт определение инструмента MCP, безопасное по типам, для использования с серверами MCP SDK.

```typescript
function tool<Schema extends ZodRawShape>(
  name: string,
  description: string,
  inputSchema: Schema,
  handler: (args: z.infer<ZodObject<Schema>>, extra: unknown) => Promise<CallToolResult>
): SdkMcpToolDefinition<Schema>
```

#### Параметры

| Параметр | Тип | Описание |
| :-------- | :--- | :---------- |
| `name` | `string` | Имя инструмента |
| `description` | `string` | Описание того, что делает инструмент |
| `inputSchema` | `Schema extends ZodRawShape` | Схема Zod, определяющая входные параметры инструмента |
| `handler` | `(args, extra) => Promise<`[`CallToolResult`](#calltoolresult)`>` | Асинхронная функция, которая выполняет логику инструмента |

### `createSdkMcpServer()`

Создаёт экземпляр сервера MCP, который работает в том же процессе, что и ваше приложение.

```typescript
function createSdkMcpServer(options: {
  name: string;
  version?: string;
  tools?: Array<SdkMcpToolDefinition<any>>;
}): McpSdkServerConfigWithInstance
```

#### Параметры

| Параметр | Тип | Описание |
| :-------- | :--- | :---------- |
| `options.name` | `string` | Имя сервера MCP |
| `options.version` | `string` | Необязательная строка версии |
| `options.tools` | `Array<SdkMcpToolDefinition>` | Массив определений инструментов, созданных с помощью [`tool()`](#tool) |

## Типы

### `Options`

Объект конфигурации для функции `query()`.

| Свойство | Тип | По умолчанию | Описание |
| :------- | :--- | :------ | :---------- |
| `abortController` | `AbortController` | `new AbortController()` | Контроллер для отмены операций |
| `additionalDirectories` | `string[]` | `[]` | Дополнительные каталоги, к которым Claude может получить доступ |
| `agents` | `Record<string, [`AgentDefinition`](#agentdefinition)>` | `undefined` | Программное определение подагентов |
| `allowDangerouslySkipPermissions` | `boolean` | `false` | Включить обход разрешений. Требуется при использовании `permissionMode: 'bypassPermissions'` |
| `allowedTools` | `string[]` | Все инструменты | Список разрешённых имён инструментов |
| `betas` | [`SdkBeta`](#sdkbeta)`[]` | `[]` | Включить бета-функции (например, `['context-1m-2025-08-07']`) |
| `canUseTool` | [`CanUseTool`](#canusetool) | `undefined` | Пользовательская функция разрешения для использования инструментов |
| `continue` | `boolean` | `false` | Продолжить самый последний диалог |
| `cwd` | `string` | `process.cwd()` | Текущий рабочий каталог |
| `disallowedTools` | `string[]` | `[]` | Список запрещённых имён инструментов |
| `env` | `Dict<string>` | `process.env` | Переменные окружения |
| `executable` | `'bun' \| 'deno' \| 'node'` | Автоопределение | Среда выполнения JavaScript для использования |
| `executableArgs` | `string[]` | `[]` | Аргументы для передачи исполняемому файлу |
| `extraArgs` | `Record<string, string \| null>` | `{}` | Дополнительные аргументы |
| `fallbackModel` | `string` | `undefined` | Модель для использования, если основная не работает |
| `forkSession` | `boolean` | `false` | При возобновлении с `resume` разветвить на новый ID сессии вместо продолжения исходной сессии |
| `hooks` | `Partial<Record<`[`HookEvent`](#hookevent)`, `[`HookCallbackMatcher`](#hookcallbackmatcher)`[]>>` | `{}` | Обратные вызовы хуков для событий |
| `includePartialMessages` | `boolean` | `false` | Включить события частичных сообщений |
| `maxBudgetUsd` | `number` | `undefined` | Максимальный бюджет в USD для запроса |
| `maxThinkingTokens` | `number` | `undefined` | Максимальное количество токенов для процесса мышления |
| `maxTurns` | `number` | `undefined` | Максимальное количество ходов диалога |
| `mcpServers` | `Record<string, [`McpServerConfig`](#mcpserverconfig)>` | `{}` | Конфигурации серверов MCP |
| `model` | `string` | По умолчанию из CLI | Модель Claude для использования |
| `outputFormat` | `{ type: 'json_schema', schema: JSONSchema }` | `undefined` | Определить формат вывода для результатов агента. Подробнее см. [Структурированные выходы](/docs/ru/agent-sdk/structured-outputs) |
| `pathToClaudeCodeExecutable` | `string` | Использует встроенный исполняемый файл | Путь к исполняемому файлу Claude Code |
| `permissionMode` | [`PermissionMode`](#permissionmode) | `'default'` | Режим разрешений для сессии |
| `permissionPromptToolName` | `string` | `undefined` | Имя инструмента MCP для запросов разрешений |
| `plugins` | [`SdkPluginConfig`](#sdkpluginconfig)`[]` | `[]` | Загрузить пользовательские плагины из локальных путей. Подробнее см. [Плагины](/docs/ru/agent-sdk/plugins) |
| `resume` | `string` | `undefined` | ID сессии для возобновления |
| `resumeSessionAt` | `string` | `undefined` | Возобновить сессию в определённом UUID сообщения |
| `sandbox` | [`SandboxSettings`](#sandboxsettings) | `undefined` | Программно настроить поведение песочницы. Подробнее см. [Параметры песочницы](#sandboxsettings) |
| `settingSources` | [`SettingSource`](#settingsource)`[]` | `[]` (без параметров) | Контролировать, какие параметры на основе файловой системы загружать. При пропуске параметры не загружаются. **Примечание:** Должен включать `'project'` для загрузки файлов CLAUDE.md |
| `stderr` | `(data: string) => void` | `undefined` | Обратный вызов для вывода stderr |
| `strictMcpConfig` | `boolean` | `false` | Применить строгую валидацию MCP |
| `systemPrompt` | `string \| { type: 'preset'; preset: 'claude_code'; append?: string }` | `undefined` (пустой запрос) | Конфигурация системного запроса. Передайте строку для пользовательского запроса или `{ type: 'preset', preset: 'claude_code' }` для использования системного запроса Claude Code. При использовании формы объекта предустановки добавьте `append` для расширения системного запроса дополнительными инструкциями |
| `tools` | `string[] \| { type: 'preset'; preset: 'claude_code' }` | `undefined` | Конфигурация инструментов. Передайте массив имён инструментов или используйте предустановку для получения инструментов Claude Code по умолчанию |

### `Query`

Интерфейс, возвращаемый функцией `query()`.

```typescript
interface Query extends AsyncGenerator<SDKMessage, void> {
  interrupt(): Promise<void>;
  setPermissionMode(mode: PermissionMode): Promise<void>;
  setModel(model?: string): Promise<void>;
  setMaxThinkingTokens(maxThinkingTokens: number | null): Promise<void>;
  supportedCommands(): Promise<SlashCommand[]>;
  supportedModels(): Promise<ModelInfo[]>;
  mcpServerStatus(): Promise<McpServerStatus[]>;
  accountInfo(): Promise<AccountInfo>;
}
```

#### Методы

| Метод | Описание |
| :----- | :---------- |
| `interrupt()` | Прерывает запрос (доступно только в режиме потоковой передачи входных данных) |
| `setPermissionMode()` | Изменяет режим разрешений (доступно только в режиме потоковой передачи входных данных) |
| `setModel()` | Изменяет модель (доступно только в режиме потоковой передачи входных данных) |
| `setMaxThinkingTokens()` | Изменяет максимальное количество токенов мышления (доступно только в режиме потоковой передачи входных данных) |
| `supportedCommands()` | Возвращает доступные команды слэша |
| `supportedModels()` | Возвращает доступные модели с информацией отображения |
| `mcpServerStatus()` | Возвращает статус подключённых серверов MCP |
| `accountInfo()` | Возвращает информацию об учётной записи |

### `AgentDefinition`

Конфигурация для подагента, определённого программно.

```typescript
type AgentDefinition = {
  description: string;
  tools?: string[];
  prompt: string;
  model?: 'sonnet' | 'opus' | 'haiku' | 'inherit';
}
```

| Поле | Обязательно | Описание |
|:------|:---------|:------------|
| `description` | Да | Описание на естественном языке того, когда использовать этого агента |
| `tools` | Нет | Массив разрешённых имён инструментов. При пропуске наследует все инструменты |
| `prompt` | Да | Системный запрос агента |
| `model` | Нет | Переопределение модели для этого агента. При пропуске использует основную модель |

### `SettingSource`

Контролирует, какие источники конфигурации на основе файловой системы загружает SDK.

```typescript
type SettingSource = 'user' | 'project' | 'local';
```

| Значение | Описание | Местоположение |
|:------|:------------|:---------|
| `'user'` | Глобальные параметры пользователя | `~/.claude/settings.json` |
| `'project'` | Общие параметры проекта (контролируемые версией) | `.claude/settings.json` |
| `'local'` | Локальные параметры проекта (в gitignore) | `.claude/settings.local.json` |

#### Поведение по умолчанию

Когда `settingSources` **пропущен** или **undefined**, SDK **не** загружает параметры файловой системы. Это обеспечивает изоляцию для приложений SDK.

#### Почему использовать settingSources?

**Загрузить все параметры файловой системы (поведение прежних версий):**
```typescript
// Загрузить все параметры как SDK v0.0.x
const result = query({
  prompt: "Analyze this code",
  options: {
    settingSources: ['user', 'project', 'local']  // Загрузить все параметры
  }
});
```

**Загрузить только определённые источники параметров:**
```typescript
// Загрузить только параметры проекта, игнорировать пользовательские и локальные
const result = query({
  prompt: "Run CI checks",
  options: {
    settingSources: ['project']  // Только .claude/settings.json
  }
});
```

**Тестирование и окружения CI:**
```typescript
// Обеспечить согласованное поведение в CI, исключив локальные параметры
const result = query({
  prompt: "Run tests",
  options: {
    settingSources: ['project'],  // Только параметры, общие для команды
    permissionMode: 'bypassPermissions'
  }
});
```

**Приложения только SDK:**
```typescript
// Определить всё программно (поведение по умолчанию)
// Нет зависимостей файловой системы - settingSources по умолчанию []
const result = query({
  prompt: "Review this PR",
  options: {
    // settingSources: [] по умолчанию, не нужно указывать
    agents: { /* ... */ },
    mcpServers: { /* ... */ },
    allowedTools: ['Read', 'Grep', 'Glob']
  }
});
```

**Загрузка инструкций проекта CLAUDE.md:**
```typescript
// Загрузить параметры проекта для включения файлов CLAUDE.md
const result = query({
  prompt: "Add a new feature following project conventions",
  options: {
    systemPrompt: {
      type: 'preset',
      preset: 'claude_code'  // Требуется для использования CLAUDE.md
    },
    settingSources: ['project'],  // Загружает CLAUDE.md из каталога проекта
    allowedTools: ['Read', 'Write', 'Edit']
  }
});
```

#### Приоритет параметров

Когда загружаются несколько источников, параметры объединяются с этим приоритетом (от высшего к низшему):
1. Локальные параметры (`.claude/settings.local.json`)
2. Параметры проекта (`.claude/settings.json`)
3. Параметры пользователя (`~/.claude/settings.json`)

Программные опции (такие как `agents`, `allowedTools`) всегда переопределяют параметры файловой системы.

### `PermissionMode`

```typescript
type PermissionMode =
  | 'default'           // Стандартное поведение разрешений
  | 'acceptEdits'       // Автоматически принимать редактирование файлов
  | 'bypassPermissions' // Обойти все проверки разрешений
  | 'plan'              // Режим планирования - без выполнения
```

### `CanUseTool`

Пользовательский тип функции разрешения для управления использованием инструментов.

```typescript
type CanUseTool = (
  toolName: string,
  input: ToolInput,
  options: {
    signal: AbortSignal;
    suggestions?: PermissionUpdate[];
  }
) => Promise<PermissionResult>;
```

### `PermissionResult`

Результат проверки разрешения.

```typescript
type PermissionResult = 
  | {
      behavior: 'allow';
      updatedInput: ToolInput;
      updatedPermissions?: PermissionUpdate[];
    }
  | {
      behavior: 'deny';
      message: string;
      interrupt?: boolean;
    }
```

### `McpServerConfig`

Конфигурация для серверов MCP.

```typescript
type McpServerConfig = 
  | McpStdioServerConfig
  | McpSSEServerConfig
  | McpHttpServerConfig
  | McpSdkServerConfigWithInstance;
```

#### `McpStdioServerConfig`

```typescript
type McpStdioServerConfig = {
  type?: 'stdio';
  command: string;
  args?: string[];
  env?: Record<string, string>;
}
```

#### `McpSSEServerConfig`

```typescript
type McpSSEServerConfig = {
  type: 'sse';
  url: string;
  headers?: Record<string, string>;
}
```

#### `McpHttpServerConfig`

```typescript
type McpHttpServerConfig = {
  type: 'http';
  url: string;
  headers?: Record<string, string>;
}
```

#### `McpSdkServerConfigWithInstance`

```typescript
type McpSdkServerConfigWithInstance = {
  type: 'sdk';
  name: string;
  instance: McpServer;
}
```

### `SdkPluginConfig`

Конфигурация для загрузки плагинов в SDK.

```typescript
type SdkPluginConfig = {
  type: 'local';
  path: string;
}
```

| Поле | Тип | Описание |
|:------|:-----|:------------|
| `type` | `'local'` | Должно быть `'local'` (в настоящее время поддерживаются только локальные плагины) |
| `path` | `string` | Абсолютный или относительный путь к каталогу плагина |

**Пример:**
```typescript
plugins: [
  { type: 'local', path: './my-plugin' },
  { type: 'local', path: '/absolute/path/to/plugin' }
]
```

Полную информацию о создании и использовании плагинов см. в разделе [Плагины](/docs/ru/agent-sdk/plugins).

## Типы сообщений

### `SDKMessage`

Тип объединения всех возможных сообщений, возвращаемых запросом.

```typescript
type SDKMessage = 
  | SDKAssistantMessage
  | SDKUserMessage
  | SDKUserMessageReplay
  | SDKResultMessage
  | SDKSystemMessage
  | SDKPartialAssistantMessage
  | SDKCompactBoundaryMessage;
```

### `SDKAssistantMessage`

Сообщение ответа ассистента.

```typescript
type SDKAssistantMessage = {
  type: 'assistant';
  uuid: UUID;
  session_id: string;
  message: APIAssistantMessage; // Из SDK Anthropic
  parent_tool_use_id: string | null;
}
```

### `SDKUserMessage`

Сообщение пользовательского ввода.

```typescript
type SDKUserMessage = {
  type: 'user';
  uuid?: UUID;
  session_id: string;
  message: APIUserMessage; // Из SDK Anthropic
  parent_tool_use_id: string | null;
}
```

### `SDKUserMessageReplay`

Повторно воспроизведённое пользовательское сообщение с обязательным UUID.

```typescript
type SDKUserMessageReplay = {
  type: 'user';
  uuid: UUID;
  session_id: string;
  message: APIUserMessage;
  parent_tool_use_id: string | null;
}
```

### `SDKResultMessage`

Финальное сообщение результата.

```typescript
type SDKResultMessage =
  | {
      type: 'result';
      subtype: 'success';
      uuid: UUID;
      session_id: string;
      duration_ms: number;
      duration_api_ms: number;
      is_error: boolean;
      num_turns: number;
      result: string;
      total_cost_usd: number;
      usage: NonNullableUsage;
      modelUsage: { [modelName: string]: ModelUsage };
      permission_denials: SDKPermissionDenial[];
      structured_output?: unknown;
    }
  | {
      type: 'result';
      subtype:
        | 'error_max_turns'
        | 'error_during_execution'
        | 'error_max_budget_usd'
        | 'error_max_structured_output_retries';
      uuid: UUID;
      session_id: string;
      duration_ms: number;
      duration_api_ms: number;
      is_error: boolean;
      num_turns: number;
      total_cost_usd: number;
      usage: NonNullableUsage;
      modelUsage: { [modelName: string]: ModelUsage };
      permission_denials: SDKPermissionDenial[];
      errors: string[];
    }
```

### `SDKSystemMessage`

Сообщение инициализации системы.

```typescript
type SDKSystemMessage = {
  type: 'system';
  subtype: 'init';
  uuid: UUID;
  session_id: string;
  apiKeySource: ApiKeySource;
  cwd: string;
  tools: string[];
  mcp_servers: {
    name: string;
    status: string;
  }[];
  model: string;
  permissionMode: PermissionMode;
  slash_commands: string[];
  output_style: string;
}
```

### `SDKPartialAssistantMessage`

Потоковое частичное сообщение (только когда `includePartialMessages` имеет значение true).

```typescript
type SDKPartialAssistantMessage = {
  type: 'stream_event';
  event: RawMessageStreamEvent; // Из SDK Anthropic
  parent_tool_use_id: string | null;
  uuid: UUID;
  session_id: string;
}
```

### `SDKCompactBoundaryMessage`

Сообщение, указывающее на границу компактирования диалога.

```typescript
type SDKCompactBoundaryMessage = {
  type: 'system';
  subtype: 'compact_boundary';
  uuid: UUID;
  session_id: string;
  compact_metadata: {
    trigger: 'manual' | 'auto';
    pre_tokens: number;
  };
}
```

### `SDKPermissionDenial`

Информация об отклонённом использовании инструмента.

```typescript
type SDKPermissionDenial = {
  tool_name: string;
  tool_use_id: string;
  tool_input: ToolInput;
}
```

## Типы хуков

Для полного руководства по использованию хуков с примерами и распространёнными паттернами см. [Руководство по хукам](/docs/ru/agent-sdk/hooks).

### `HookEvent`

Доступные события хуков.

```typescript
type HookEvent =
  | 'PreToolUse'
  | 'PostToolUse'
  | 'PostToolUseFailure'
  | 'Notification'
  | 'UserPromptSubmit'
  | 'SessionStart'
  | 'SessionEnd'
  | 'Stop'
  | 'SubagentStart'
  | 'SubagentStop'
  | 'PreCompact'
  | 'PermissionRequest';
```

### `HookCallback`

Тип функции обратного вызова хука.

```typescript
type HookCallback = (
  input: HookInput, // Объединение всех типов входных данных хука
  toolUseID: string | undefined,
  options: { signal: AbortSignal }
) => Promise<HookJSONOutput>;
```

### `HookCallbackMatcher`

Конфигурация хука с необязательным сопоставителем.

```typescript
interface HookCallbackMatcher {
  matcher?: string;
  hooks: HookCallback[];
}
```

### `HookInput`

Тип объединения всех типов входных данных хука.

```typescript
type HookInput =
  | PreToolUseHookInput
  | PostToolUseHookInput
  | PostToolUseFailureHookInput
  | NotificationHookInput
  | UserPromptSubmitHookInput
  | SessionStartHookInput
  | SessionEndHookInput
  | StopHookInput
  | SubagentStartHookInput
  | SubagentStopHookInput
  | PreCompactHookInput
  | PermissionRequestHookInput;
```

### `BaseHookInput`

Базовый интерфейс, который расширяют все типы входных данных хука.

```typescript
type BaseHookInput = {
  session_id: string;
  transcript_path: string;
  cwd: string;
  permission_mode?: string;
}
```

#### `PreToolUseHookInput`

```typescript
type PreToolUseHookInput = BaseHookInput & {
  hook_event_name: 'PreToolUse';
  tool_name: string;
  tool_input: unknown;
}
```

#### `PostToolUseHookInput`

```typescript
type PostToolUseHookInput = BaseHookInput & {
  hook_event_name: 'PostToolUse';
  tool_name: string;
  tool_input: unknown;
  tool_response: unknown;
}
```

#### `PostToolUseFailureHookInput`

```typescript
type PostToolUseFailureHookInput = BaseHookInput & {
  hook_event_name: 'PostToolUseFailure';
  tool_name: string;
  tool_input: unknown;
  error: string;
  is_interrupt?: boolean;
}
```

#### `NotificationHookInput`

```typescript
type NotificationHookInput = BaseHookInput & {
  hook_event_name: 'Notification';
  message: string;
  title?: string;
}
```

#### `UserPromptSubmitHookInput`

```typescript
type UserPromptSubmitHookInput = BaseHookInput & {
  hook_event_name: 'UserPromptSubmit';
  prompt: string;
}
```

#### `SessionStartHookInput`

```typescript
type SessionStartHookInput = BaseHookInput & {
  hook_event_name: 'SessionStart';
  source: 'startup' | 'resume' | 'clear' | 'compact';
}
```

#### `SessionEndHookInput`

```typescript
type SessionEndHookInput = BaseHookInput & {
  hook_event_name: 'SessionEnd';
  reason: ExitReason;  // Строка из массива EXIT_REASONS
}
```

#### `StopHookInput`

```typescript
type StopHookInput = BaseHookInput & {
  hook_event_name: 'Stop';
  stop_hook_active: boolean;
}
```

#### `SubagentStartHookInput`

```typescript
type SubagentStartHookInput = BaseHookInput & {
  hook_event_name: 'SubagentStart';
  agent_id: string;
  agent_type: string;
}
```

#### `SubagentStopHookInput`

```typescript
type SubagentStopHookInput = BaseHookInput & {
  hook_event_name: 'SubagentStop';
  stop_hook_active: boolean;
}
```

#### `PreCompactHookInput`

```typescript
type PreCompactHookInput = BaseHookInput & {
  hook_event_name: 'PreCompact';
  trigger: 'manual' | 'auto';
  custom_instructions: string | null;
}
```

#### `PermissionRequestHookInput`

```typescript
type PermissionRequestHookInput = BaseHookInput & {
  hook_event_name: 'PermissionRequest';
  tool_name: string;
  tool_input: unknown;
  permission_suggestions?: PermissionUpdate[];
}
```

### `HookJSONOutput`

Возвращаемое значение хука.

```typescript
type HookJSONOutput = AsyncHookJSONOutput | SyncHookJSONOutput;
```

#### `AsyncHookJSONOutput`

```typescript
type AsyncHookJSONOutput = {
  async: true;
  asyncTimeout?: number;
}
```

#### `SyncHookJSONOutput`

```typescript
type SyncHookJSONOutput = {
  continue?: boolean;
  suppressOutput?: boolean;
  stopReason?: string;
  decision?: 'approve' | 'block';
  systemMessage?: string;
  reason?: string;
  hookSpecificOutput?:
    | {
        hookEventName: 'PreToolUse';
        permissionDecision?: 'allow' | 'deny' | 'ask';
        permissionDecisionReason?: string;
        updatedInput?: Record<string, unknown>;
      }
    | {
        hookEventName: 'UserPromptSubmit';
        additionalContext?: string;
      }
    | {
        hookEventName: 'SessionStart';
        additionalContext?: string;
      }
    | {
        hookEventName: 'PostToolUse';
        additionalContext?: string;
      };
}
```

## Типы входных данных инструментов

Документация схем входных данных для всех встроенных инструментов Claude Code. Эти типы экспортируются из `@anthropic-ai/claude-agent-sdk` и могут использоваться для безопасного по типам взаимодействия с инструментами.

### `ToolInput`

**Примечание:** Это тип только для документации для ясности. Он представляет объединение всех типов входных данных инструментов.

```typescript
type ToolInput =
  | AgentInput
  | AskUserQuestionInput
  | BashInput
  | BashOutputInput
  | FileEditInput
  | FileReadInput
  | FileWriteInput
  | GlobInput
  | GrepInput
  | KillShellInput
  | NotebookEditInput
  | WebFetchInput
  | WebSearchInput
  | TodoWriteInput
  | ExitPlanModeInput
  | ListMcpResourcesInput
  | ReadMcpResourceInput;
```

### Task

**Имя инструмента:** `Task`

```typescript
interface AgentInput {
  /**
   * Краткое описание задачи (3-5 слов)
   */
  description: string;
  /**
   * Задача для выполнения агентом
   */
  prompt: string;
  /**
   * Тип специализированного агента для использования в этой задаче
   */
  subagent_type: string;
}
```

Запускает нового агента для автономного выполнения сложных многошаговых задач.

### AskUserQuestion

**Имя инструмента:** `AskUserQuestion`

```typescript
interface AskUserQuestionInput {
  /**
   * Вопросы для пользователя (1-4 вопроса)
   */
  questions: Array<{
    /**
     * Полный вопрос для пользователя. Должен быть ясным, конкретным
     * и заканчиваться вопросительным знаком.
     */
    question: string;
    /**
     * Очень короткая метка, отображаемая как чип/тег (макс 12 символов).
     * Примеры: "Auth method", "Library", "Approach"
     */
    header: string;
    /**
     * Доступные варианты (2-4 опции). Опция "Other" предоставляется
     * автоматически.
     */
    options: Array<{
      /**
       * Текст отображения для этого варианта (1-5 слов)
       */
      label: string;
      /**
       * Объяснение того, что означает этот вариант
       */
      description: string;
    }>;
    /**
     * Установить в true для разрешения множественного выбора
     */
    multiSelect: boolean;
  }>;
  /**
   * Ответы пользователя, заполненные системой разрешений.
   * Сопоставляет текст вопроса с выбранной меткой опции.
   * Ответы с множественным выбором разделены запятыми.
   */
  answers?: Record<string, string>;
}
```

Задаёт уточняющие вопросы пользователю во время выполнения. Подробнее см. [Обработка инструмента AskUserQuestion](/docs/ru/agent-sdk/permissions#handling-the-askuserquestion-tool).

### Bash

**Имя инструмента:** `Bash`

```typescript
interface BashInput {
  /**
   * Команда для выполнения
   */
  command: string;
  /**
   * Необязательный тайм-аут в миллисекундах (макс 600000)
   */
  timeout?: number;
  /**
   * Ясное, краткое описание того, что делает эта команда в 5-10 словах
   */
  description?: string;
  /**
   * Установить в true для выполнения этой команды в фоновом режиме
   */
  run_in_background?: boolean;
}
```

Выполняет команды bash в постоянной сессии оболочки с необязательным тайм-аутом и фоновым выполнением.

### BashOutput

**Имя инструмента:** `BashOutput`

```typescript
interface BashOutputInput {
  /**
   * ID фоновой оболочки для получения вывода из
   */
  bash_id: string;
  /**
   * Необязательное регулярное выражение для фильтрации строк вывода
   */
  filter?: string;
}
```

Получает вывод из работающей или завершённой фоновой оболочки bash.

### Edit

**Имя инструмента:** `Edit`

```typescript
interface FileEditInput {
  /**
   * Абсолютный путь к файлу для изменения
   */
  file_path: string;
  /**
   * Текст для замены
   */
  old_string: string;
  /**
   * Текст для замены на (должен отличаться от old_string)
   */
  new_string: string;
  /**
   * Заменить все вхождения old_string (по умолчанию false)
   */
  replace_all?: boolean;
}
```

Выполняет точные замены строк в файлах.

### Read

**Имя инструмента:** `Read`

```typescript
interface FileReadInput {
  /**
   * Абсолютный путь к файлу для чтения
   */
  file_path: string;
  /**
   * Номер строки для начала чтения
   */
  offset?: number;
  /**
   * Количество строк для чтения
   */
  limit?: number;
}
```

Читает файлы из локальной файловой системы, включая текст, изображения, PDF и записные книжки Jupyter.

### Write

**Имя инструмента:** `Write`

```typescript
interface FileWriteInput {
  /**
   * Абсолютный путь к файлу для записи
   */
  file_path: string;
  /**
   * Содержимое для записи в файл
   */
  content: string;
}
```

Записывает файл в локальную файловую систему, перезаписывая, если он существует.

### Glob

**Имя инструмента:** `Glob`

```typescript
interface GlobInput {
  /**
   * Шаблон glob для сопоставления файлов
   */
  pattern: string;
  /**
   * Каталог для поиска (по умолчанию cwd)
   */
  path?: string;
}
```

Быстрое сопоставление шаблонов файлов, которое работает с кодовой базой любого размера.

### Grep

**Имя инструмента:** `Grep`

```typescript
interface GrepInput {
  /**
   * Шаблон регулярного выражения для поиска
   */
  pattern: string;
  /**
   * Файл или каталог для поиска (по умолчанию cwd)
   */
  path?: string;
  /**
   * Шаблон glob для фильтрации файлов (например "*.js")
   */
  glob?: string;
  /**
   * Тип файла для поиска (например "js", "py", "rust")
   */
  type?: string;
  /**
   * Режим вывода: "content", "files_with_matches" или "count"
   */
  output_mode?: 'content' | 'files_with_matches' | 'count';
  /**
   * Поиск без учёта регистра
   */
  '-i'?: boolean;
  /**
   * Показать номера строк (для режима content)
   */
  '-n'?: boolean;
  /**
   * Строки для отображения перед каждым совпадением
   */
  '-B'?: number;
  /**
   * Строки для отображения после каждого совпадения
   */
  '-A'?: number;
  /**
   * Строки для отображения перед и после каждого совпадения
   */
  '-C'?: number;
  /**
   * Ограничить вывод первыми N строками/записями
   */
  head_limit?: number;
  /**
   * Включить многострочный режим
   */
  multiline?: boolean;
}
```

Мощный инструмент поиска, построенный на ripgrep с поддержкой регулярных выражений.

### KillBash

**Имя инструмента:** `KillBash`

```typescript
interface KillShellInput {
  /**
   * ID фоновой оболочки для завершения
   */
  shell_id: string;
}
```

Завершает работающую фоновую оболочку bash по её ID.

### NotebookEdit

**Имя инструмента:** `NotebookEdit`

```typescript
interface NotebookEditInput {
  /**
   * Абсолютный путь к файлу записной книжки Jupyter
   */
  notebook_path: string;
  /**
   * ID ячейки для редактирования
   */
  cell_id?: string;
  /**
   * Новый исходный код для ячейки
   */
  new_source: string;
  /**
   * Тип ячейки (code или markdown)
   */
  cell_type?: 'code' | 'markdown';
  /**
   * Тип редактирования (replace, insert, delete)
   */
  edit_mode?: 'replace' | 'insert' | 'delete';
}
```

Редактирует ячейки в файлах записных книжек Jupyter.

### WebFetch

**Имя инструмента:** `WebFetch`

```typescript
interface WebFetchInput {
  /**
   * URL для получения содержимого из
   */
  url: string;
  /**
   * Запрос для выполнения на полученном содержимом
   */
  prompt: string;
}
```

Получает содержимое из URL и обрабатывает его с помощью модели AI.

### WebSearch

**Имя инструмента:** `WebSearch`

```typescript
interface WebSearchInput {
  /**
   * Поисковый запрос для использования
   */
  query: string;
  /**
   * Включить только результаты из этих доменов
   */
  allowed_domains?: string[];
  /**
   * Никогда не включать результаты из этих доменов
   */
  blocked_domains?: string[];
}
```

Ищет в Интернете и возвращает отформатированные результаты.

### TodoWrite

**Имя инструмента:** `TodoWrite`

```typescript
interface TodoWriteInput {
  /**
   * Обновленный список дел
   */
  todos: Array<{
    /**
     * Описание задачи
     */
    content: string;
    /**
     * Статус задачи
     */
    status: 'pending' | 'in_progress' | 'completed';
    /**
     * Активная форма описания задачи
     */
    activeForm: string;
  }>;
}
```

Создаёт и управляет структурированным списком задач для отслеживания прогресса.

### ExitPlanMode

**Имя инструмента:** `ExitPlanMode`

```typescript
interface ExitPlanModeInput {
  /**
   * План для выполнения пользователем на утверждение
   */
  plan: string;
}
```

Выходит из режима планирования и предлагает пользователю одобрить план.

### ListMcpResources

**Имя инструмента:** `ListMcpResources`

```typescript
interface ListMcpResourcesInput {
  /**
   * Необязательное имя сервера для фильтрации ресурсов
   */
  server?: string;
}
```

Перечисляет доступные ресурсы MCP с подключённых серверов.

### ReadMcpResource

**Имя инструмента:** `ReadMcpResource`

```typescript
interface ReadMcpResourceInput {
  /**
   * Имя сервера MCP
   */
  server: string;
  /**
   * URI ресурса для чтения
   */
  uri: string;
}
```

Читает определённый ресурс MCP с сервера.

## Типы выходных данных инструментов

Документация схем выходных данных для всех встроенных инструментов Claude Code. Эти типы представляют фактические данные ответа, возвращаемые каждым инструментом.

### `ToolOutput`

**Примечание:** Это тип только для документации для ясности. Он представляет объединение всех типов выходных данных инструментов.

```typescript
type ToolOutput =
  | TaskOutput
  | AskUserQuestionOutput
  | BashOutput
  | BashOutputToolOutput
  | EditOutput
  | ReadOutput
  | WriteOutput
  | GlobOutput
  | GrepOutput
  | KillBashOutput
  | NotebookEditOutput
  | WebFetchOutput
  | WebSearchOutput
  | TodoWriteOutput
  | ExitPlanModeOutput
  | ListMcpResourcesOutput
  | ReadMcpResourceOutput;
```

### Task

**Имя инструмента:** `Task`

```typescript
interface TaskOutput {
  /**
   * Финальное сообщение результата от подагента
   */
  result: string;
  /**
   * Статистика использования токенов
   */
  usage?: {
    input_tokens: number;
    output_tokens: number;
    cache_creation_input_tokens?: number;
    cache_read_input_tokens?: number;
  };
  /**
   * Общая стоимость в USD
   */
  total_cost_usd?: number;
  /**
   * Продолжительность выполнения в миллисекундах
   */
  duration_ms?: number;
}
```

Возвращает финальный результат от подагента после завершения делегированной задачи.

### AskUserQuestion

**Имя инструмента:** `AskUserQuestion`

```typescript
interface AskUserQuestionOutput {
  /**
   * Вопросы, которые были заданы
   */
  questions: Array<{
    question: string;
    header: string;
    options: Array<{
      label: string;
      description: string;
    }>;
    multiSelect: boolean;
  }>;
  /**
   * Ответы, предоставленные пользователем.
   * Сопоставляет текст вопроса со строкой ответа.
   * Ответы с множественным выбором разделены запятыми.
   */
  answers: Record<string, string>;
}
```

Возвращает заданные вопросы и ответы пользователя.

### Bash

**Имя инструмента:** `Bash`

```typescript
interface BashOutput {
  /**
   * Объединённый вывод stdout и stderr
   */
  output: string;
  /**
   * Код выхода команды
   */
  exitCode: number;
  /**
   * Была ли команда завершена из-за тайм-аута
   */
  killed?: boolean;
  /**
   * ID оболочки для фоновых процессов
   */
  shellId?: string;
}
```

Возвращает вывод команды со статусом выхода. Фоновые команды возвращаются немедленно с shellId.

### BashOutput

**Имя инструмента:** `BashOutput`

```typescript
interface BashOutputToolOutput {
  /**
   * Новый вывод с момента последней проверки
   */
  output: string;
  /**
   * Текущий статус оболочки
   */
  status: 'running' | 'completed' | 'failed';
  /**
   * Код выхода (при завершении)
   */
  exitCode?: number;
}
```

Возвращает дополнительный вывод из фоновых оболочек.

### Edit

**Имя инструмента:** `Edit`

```typescript
interface EditOutput {
  /**
   * Сообщение подтверждения
   */
  message: string;
  /**
   * Количество выполненных замен
   */
  replacements: number;
  /**
   * Путь к файлу, который был отредактирован
   */
  file_path: string;
}
```

Возвращает подтверждение успешного редактирования с количеством замен.

### Read

**Имя инструмента:** `Read`

```typescript
type ReadOutput = 
  | TextFileOutput
  | ImageFileOutput
  | PDFFileOutput
  | NotebookFileOutput;

interface TextFileOutput {
  /**
   * Содержимое файла с номерами строк
   */
  content: string;
  /**
   * Общее количество строк в файле
   */
  total_lines: number;
  /**
   * Фактически возвращённые строки
   */
  lines_returned: number;
}

interface ImageFileOutput {
  /**
   * Данные изображения в кодировке Base64
   */
  image: string;
  /**
   * MIME-тип изображения
   */
  mime_type: string;
  /**
   * Размер файла в байтах
   */
  file_size: number;
}

interface PDFFileOutput {
  /**
   * Массив содержимого страниц
   */
  pages: Array<{
    page_number: number;
    text?: string;
    images?: Array<{
      image: string;
      mime_type: string;
    }>;
  }>;
  /**
   * Общее количество страниц
   */
  total_pages: number;
}

interface NotebookFileOutput {
  /**
   * Ячейки Jupyter notebook
   */
  cells: Array<{
    cell_type: 'code' | 'markdown';
    source: string;
    outputs?: any[];
    execution_count?: number;
  }>;
  /**
   * Метаданные notebook
   */
  metadata?: Record<string, any>;
}
```

Возвращает содержимое файла в формате, соответствующем типу файла.

### Write

**Имя инструмента:** `Write`

```typescript
interface WriteOutput {
  /**
   * Сообщение об успехе
   */
  message: string;
  /**
   * Количество записанных байтов
   */
  bytes_written: number;
  /**
   * Путь файла, который был записан
   */
  file_path: string;
}
```

Возвращает подтверждение после успешной записи файла.

### Glob

**Имя инструмента:** `Glob`

```typescript
interface GlobOutput {
  /**
   * Массив совпадающих путей файлов
   */
  matches: string[];
  /**
   * Количество найденных совпадений
   */
  count: number;
  /**
   * Используемая директория поиска
   */
  search_path: string;
}
```

Возвращает пути файлов, соответствующие шаблону glob, отсортированные по времени изменения.

### Grep

**Имя инструмента:** `Grep`

```typescript
type GrepOutput = 
  | GrepContentOutput
  | GrepFilesOutput
  | GrepCountOutput;

interface GrepContentOutput {
  /**
   * Совпадающие строки с контекстом
   */
  matches: Array<{
    file: string;
    line_number?: number;
    line: string;
    before_context?: string[];
    after_context?: string[];
  }>;
  /**
   * Общее количество совпадений
   */
  total_matches: number;
}

interface GrepFilesOutput {
  /**
   * Файлы, содержащие совпадения
   */
  files: string[];
  /**
   * Количество файлов с совпадениями
   */
  count: number;
}

interface GrepCountOutput {
  /**
   * Количество совпадений для каждого файла
   */
  counts: Array<{
    file: string;
    count: number;
  }>;
  /**
   * Общее количество совпадений во всех файлах
   */
  total: number;
}
```

Возвращает результаты поиска в формате, указанном в output_mode.

### KillBash

**Имя инструмента:** `KillBash`

```typescript
interface KillBashOutput {
  /**
   * Сообщение об успехе
   */
  message: string;
  /**
   * ID завершённой оболочки
   */
  shell_id: string;
}
```

Возвращает подтверждение после завершения фоновой оболочки.

### NotebookEdit

**Имя инструмента:** `NotebookEdit`

```typescript
interface NotebookEditOutput {
  /**
   * Сообщение об успехе
   */
  message: string;
  /**
   * Тип выполненного редактирования
   */
  edit_type: 'replaced' | 'inserted' | 'deleted';
  /**
   * ID ячейки, которая была затронута
   */
  cell_id?: string;
  /**
   * Общее количество ячеек в notebook после редактирования
   */
  total_cells: number;
}
```

Возвращает подтверждение после изменения Jupyter notebook.

### WebFetch

**Имя инструмента:** `WebFetch`

```typescript
interface WebFetchOutput {
  /**
   * Ответ модели ИИ на подсказку
   */
  response: string;
  /**
   * URL, который был загружен
   */
  url: string;
  /**
   * Финальный URL после перенаправлений
   */
  final_url?: string;
  /**
   * Код состояния HTTP
   */
  status_code?: number;
}
```

Возвращает анализ ИИ загруженного веб-контента.

### WebSearch

**Имя инструмента:** `WebSearch`

```typescript
interface WebSearchOutput {
  /**
   * Результаты поиска
   */
  results: Array<{
    title: string;
    url: string;
    snippet: string;
    /**
     * Дополнительные метаданные, если доступны
     */
    metadata?: Record<string, any>;
  }>;
  /**
   * Общее количество результатов
   */
  total_results: number;
  /**
   * Запрос, который был выполнен
   */
  query: string;
}
```

Возвращает отформатированные результаты поиска из веб-сети.

### TodoWrite

**Имя инструмента:** `TodoWrite`

```typescript
interface TodoWriteOutput {
  /**
   * Сообщение об успехе
   */
  message: string;
  /**
   * Текущая статистика задач
   */
  stats: {
    total: number;
    pending: number;
    in_progress: number;
    completed: number;
  };
}
```

Возвращает подтверждение с текущей статистикой задач.

### ExitPlanMode

**Имя инструмента:** `ExitPlanMode`

```typescript
interface ExitPlanModeOutput {
  /**
   * Сообщение подтверждения
   */
  message: string;
  /**
   * Одобрил ли пользователь план
   */
  approved?: boolean;
}
```

Возвращает подтверждение после выхода из режима планирования.

### ListMcpResources

**Имя инструмента:** `ListMcpResources`

```typescript
interface ListMcpResourcesOutput {
  /**
   * Доступные ресурсы
   */
  resources: Array<{
    uri: string;
    name: string;
    description?: string;
    mimeType?: string;
    server: string;
  }>;
  /**
   * Общее количество ресурсов
   */
  total: number;
}
```

Возвращает список доступных ресурсов MCP.

### ReadMcpResource

**Имя инструмента:** `ReadMcpResource`

```typescript
interface ReadMcpResourceOutput {
  /**
   * Содержимое ресурса
   */
  contents: Array<{
    uri: string;
    mimeType?: string;
    text?: string;
    blob?: string;
  }>;
  /**
   * Сервер, предоставивший ресурс
   */
  server: string;
}
```

Возвращает содержимое запрошенного ресурса MCP.

## Типы разрешений

### `PermissionUpdate`

Операции для обновления разрешений.

```typescript
type PermissionUpdate = 
  | {
      type: 'addRules';
      rules: PermissionRuleValue[];
      behavior: PermissionBehavior;
      destination: PermissionUpdateDestination;
    }
  | {
      type: 'replaceRules';
      rules: PermissionRuleValue[];
      behavior: PermissionBehavior;
      destination: PermissionUpdateDestination;
    }
  | {
      type: 'removeRules';
      rules: PermissionRuleValue[];
      behavior: PermissionBehavior;
      destination: PermissionUpdateDestination;
    }
  | {
      type: 'setMode';
      mode: PermissionMode;
      destination: PermissionUpdateDestination;
    }
  | {
      type: 'addDirectories';
      directories: string[];
      destination: PermissionUpdateDestination;
    }
  | {
      type: 'removeDirectories';
      directories: string[];
      destination: PermissionUpdateDestination;
    }
```

### `PermissionBehavior`

```typescript
type PermissionBehavior = 'allow' | 'deny' | 'ask';
```

### `PermissionUpdateDestination`

```typescript
type PermissionUpdateDestination = 
  | 'userSettings'     // Глобальные параметры пользователя
  | 'projectSettings'  // Параметры проекта для каждой директории
  | 'localSettings'    // Игнорируемые git локальные параметры
  | 'session'          // Только текущая сессия
```

### `PermissionRuleValue`

```typescript
type PermissionRuleValue = {
  toolName: string;
  ruleContent?: string;
}
```

## Другие типы

### `ApiKeySource`

```typescript
type ApiKeySource = 'user' | 'project' | 'org' | 'temporary';
```

### `SdkBeta`

Доступные бета-функции, которые можно включить через опцию `betas`. Дополнительную информацию см. в разделе [Бета-заголовки](/docs/ru/api/beta-headers).

```typescript
type SdkBeta = 'context-1m-2025-08-07';
```

| Значение | Описание | Совместимые модели |
|:------|:------------|:------------------|
| `'context-1m-2025-08-07'` | Включает [контекстное окно](/docs/ru/build-with-claude/context-windows) в 1 миллион токенов | Claude Sonnet 4, Claude Sonnet 4.5 |

### `SlashCommand`

Информация о доступной команде с косой чертой.

```typescript
type SlashCommand = {
  name: string;
  description: string;
  argumentHint: string;
}
```

### `ModelInfo`

Информация о доступной модели.

```typescript
type ModelInfo = {
  value: string;
  displayName: string;
  description: string;
}
```

### `McpServerStatus`

Статус подключённого сервера MCP.

```typescript
type McpServerStatus = {
  name: string;
  status: 'connected' | 'failed' | 'needs-auth' | 'pending';
  serverInfo?: {
    name: string;
    version: string;
  };
}
```

### `AccountInfo`

Информация об учётной записи аутентифицированного пользователя.

```typescript
type AccountInfo = {
  email?: string;
  organization?: string;
  subscriptionType?: string;
  tokenSource?: string;
  apiKeySource?: string;
}
```

### `ModelUsage`

Статистика использования для каждой модели, возвращаемая в сообщениях результатов.

```typescript
type ModelUsage = {
  inputTokens: number;
  outputTokens: number;
  cacheReadInputTokens: number;
  cacheCreationInputTokens: number;
  webSearchRequests: number;
  costUSD: number;
  contextWindow: number;
}
```

### `ConfigScope`

```typescript
type ConfigScope = 'local' | 'user' | 'project';
```

### `NonNullableUsage`

Версия [`Usage`](#usage) со всеми обнуляемыми полями, сделанными необнуляемыми.

```typescript
type NonNullableUsage = {
  [K in keyof Usage]: NonNullable<Usage[K]>;
}
```

### `Usage`

Статистика использования токенов (из `@anthropic-ai/sdk`).

```typescript
type Usage = {
  input_tokens: number | null;
  output_tokens: number | null;
  cache_creation_input_tokens?: number | null;
  cache_read_input_tokens?: number | null;
}
```

### `CallToolResult`

Тип результата инструмента MCP (из `@modelcontextprotocol/sdk/types.js`).

```typescript
type CallToolResult = {
  content: Array<{
    type: 'text' | 'image' | 'resource';
    // Дополнительные поля варьируются в зависимости от типа
  }>;
  isError?: boolean;
}
```

### `AbortError`

Пользовательский класс ошибки для операций прерывания.

```typescript
class AbortError extends Error {}
```

## Конфигурация песочницы

### `SandboxSettings`

Конфигурация поведения песочницы. Используйте это для программного включения изоляции команд и конфигурирования ограничений сети.

```typescript
type SandboxSettings = {
  enabled?: boolean;
  autoAllowBashIfSandboxed?: boolean;
  excludedCommands?: string[];
  allowUnsandboxedCommands?: boolean;
  network?: NetworkSandboxSettings;
  ignoreViolations?: SandboxIgnoreViolations;
  enableWeakerNestedSandbox?: boolean;
}
```

| Свойство | Тип | По умолчанию | Описание |
| :------- | :--- | :------ | :---------- |
| `enabled` | `boolean` | `false` | Включить режим песочницы для выполнения команд |
| `autoAllowBashIfSandboxed` | `boolean` | `false` | Автоматически одобрять команды bash при включённой песочнице |
| `excludedCommands` | `string[]` | `[]` | Команды, которые всегда обходят ограничения песочницы (например, `['docker']`). Они выполняются без изоляции автоматически без участия модели |
| `allowUnsandboxedCommands` | `boolean` | `false` | Разрешить модели запрашивать выполнение команд вне песочницы. Когда `true`, модель может установить `dangerouslyDisableSandbox` в входных данных инструмента, что переходит к [системе разрешений](#permissions-fallback-for-unsandboxed-commands) |
| `network` | [`NetworkSandboxSettings`](#networksandboxsettings) | `undefined` | Конфигурация песочницы, специфичная для сети |
| `ignoreViolations` | [`SandboxIgnoreViolations`](#sandboxignoreviolations) | `undefined` | Конфигурируйте, какие нарушения песочницы игнорировать |
| `enableWeakerNestedSandbox` | `boolean` | `false` | Включить более слабую вложенную песочницу для совместимости |

<Note>
**Ограничения доступа к файловой системе и сети** НЕ конфигурируются через параметры песочницы. Вместо этого они получены из [правил разрешений](https://code.claude.com/docs/ru/settings#permission-settings):

- **Ограничения чтения файловой системы**: Правила отказа в чтении
- **Ограничения записи в файловую систему**: Правила разрешения/отказа редактирования
- **Ограничения сети**: Правила разрешения/отказа WebFetch

Используйте параметры песочницы для изоляции выполнения команд и правила разрешений для контроля доступа к файловой системе и сети.
</Note>

#### Пример использования

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

const result = await query({
  prompt: "Build and test my project",
  options: {
    sandbox: {
      enabled: true,
      autoAllowBashIfSandboxed: true,
      excludedCommands: ["docker"],
      network: {
        allowLocalBinding: true,
        allowUnixSockets: ["/var/run/docker.sock"]
      }
    }
  }
});
```

### `NetworkSandboxSettings`

Конфигурация, специфичная для сети, для режима песочницы.

```typescript
type NetworkSandboxSettings = {
  allowLocalBinding?: boolean;
  allowUnixSockets?: string[];
  allowAllUnixSockets?: boolean;
  httpProxyPort?: number;
  socksProxyPort?: number;
}
```

| Свойство | Тип | По умолчанию | Описание |
| :------- | :--- | :------ | :---------- |
| `allowLocalBinding` | `boolean` | `false` | Разрешить процессам привязываться к локальным портам (например, для серверов разработки) |
| `allowUnixSockets` | `string[]` | `[]` | Пути сокетов Unix, к которым могут получить доступ процессы (например, сокет Docker) |
| `allowAllUnixSockets` | `boolean` | `false` | Разрешить доступ ко всем сокетам Unix |
| `httpProxyPort` | `number` | `undefined` | Порт HTTP-прокси для сетевых запросов |
| `socksProxyPort` | `number` | `undefined` | Порт SOCKS-прокси для сетевых запросов |

### `SandboxIgnoreViolations`

Конфигурация для игнорирования определённых нарушений песочницы.

```typescript
type SandboxIgnoreViolations = {
  file?: string[];
  network?: string[];
}
```

| Свойство | Тип | По умолчанию | Описание |
| :------- | :--- | :------ | :---------- |
| `file` | `string[]` | `[]` | Шаблоны путей файлов для игнорирования нарушений |
| `network` | `string[]` | `[]` | Шаблоны сети для игнорирования нарушений |

### Откат системы разрешений для команд без изоляции

Когда `allowUnsandboxedCommands` включён, модель может запросить выполнение команд вне песочницы, установив `dangerouslyDisableSandbox: true` во входных данных инструмента. Эти запросы переходят к существующей системе разрешений, что означает, что ваш обработчик `canUseTool` будет вызван, позволяя вам реализовать пользовательскую логику авторизации.

<Note>
**`excludedCommands` vs `allowUnsandboxedCommands`:**
- `excludedCommands`: Статический список команд, которые всегда автоматически обходят песочницу (например, `['docker']`). Модель не имеет контроля над этим.
- `allowUnsandboxedCommands`: Позволяет модели решать во время выполнения, запрашивать ли выполнение без изоляции, установив `dangerouslyDisableSandbox: true` во входных данных инструмента.
</Note>

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

const result = await query({
  prompt: "Deploy my application",
  options: {
    sandbox: {
      enabled: true,
      allowUnsandboxedCommands: true  // Модель может запросить выполнение без изоляции
    },
    permissionMode: "default",
    canUseTool: async (tool, input) => {
      // Проверьте, запрашивает ли модель обход песочницы
      if (tool === "Bash" && input.dangerouslyDisableSandbox) {
        // Модель хочет выполнить эту команду вне песочницы
        console.log(`Unsandboxed command requested: ${input.command}`);

        // Верните true для разрешения, false для отказа
        return isCommandAuthorized(input.command);
      }
      return true;
    }
  }
});
```

Этот паттерн позволяет вам:

- **Аудировать запросы модели**: Логировать, когда модель запрашивает выполнение без изоляции
- **Реализовать списки разрешений**: Разрешить только определённым командам выполняться без изоляции
- **Добавить рабочие процессы одобрения**: Требовать явную авторизацию для привилегированных операций

<Warning>
Команды, выполняемые с `dangerouslyDisableSandbox: true`, имеют полный доступ к системе. Убедитесь, что ваш обработчик `canUseTool` тщательно проверяет эти запросы.
</Warning>

## См. также

- [Обзор SDK](/docs/ru/agent-sdk/overview) - Общие концепции SDK
- [Справочник Python SDK](/docs/ru/agent-sdk/python) - Документация Python SDK
- [Справочник CLI](https://code.claude.com/docs/ru/cli-reference) - Интерфейс командной строки
- [Общие рабочие процессы](https://code.claude.com/docs/ru/common-workflows) - Пошаговые руководства