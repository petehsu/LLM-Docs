# Agent SDK 參考 - TypeScript

TypeScript Agent SDK 的完整 API 參考，包括所有函數、類型和介面。

---

<script src="/components/typescript-sdk-type-links.js" defer />

<Note>
**試試新的 V2 介面（預覽版）：** 現在提供了一個簡化的介面，具有 `send()` 和 `receive()` 模式，使多輪對話更加容易。[了解更多](/docs/zh-TW/agent-sdk/typescript-v2-preview)
</Note>

## 安裝

```bash
npm install @anthropic-ai/claude-agent-sdk
```

## 函數

### `query()`

與 Claude Code 互動的主要函數。建立一個非同步生成器，在訊息到達時進行串流傳輸。

```typescript
function query({
  prompt,
  options
}: {
  prompt: string | AsyncIterable<SDKUserMessage>;
  options?: Options;
}): Query
```

#### 參數

| 參數 | 類型 | 描述 |
| :-------- | :--- | :---------- |
| `prompt` | `string \| AsyncIterable<`[`SDKUserMessage`](#sdkusermessage)`>` | 輸入提示，可以是字串或非同步可迭代物件（用於串流模式） |
| `options` | [`Options`](#options) | 可選的配置物件（請參閱下面的 Options 類型） |

#### 返回

返回一個 [`Query`](#query-1) 物件，該物件擴展 `AsyncGenerator<`[`SDKMessage`](#sdkmessage)`, void>` 並具有額外的方法。

### `tool()`

為與 SDK MCP 伺服器一起使用而建立類型安全的 MCP 工具定義。

```typescript
function tool<Schema extends ZodRawShape>(
  name: string,
  description: string,
  inputSchema: Schema,
  handler: (args: z.infer<ZodObject<Schema>>, extra: unknown) => Promise<CallToolResult>
): SdkMcpToolDefinition<Schema>
```

#### 參數

| 參數 | 類型 | 描述 |
| :-------- | :--- | :---------- |
| `name` | `string` | 工具的名稱 |
| `description` | `string` | 工具功能的描述 |
| `inputSchema` | `Schema extends ZodRawShape` | 定義工具輸入參數的 Zod 架構 |
| `handler` | `(args, extra) => Promise<`[`CallToolResult`](#calltoolresult)`>` | 執行工具邏輯的非同步函數 |

### `createSdkMcpServer()`

建立在與應用程式相同的進程中運行的 MCP 伺服器實例。

```typescript
function createSdkMcpServer(options: {
  name: string;
  version?: string;
  tools?: Array<SdkMcpToolDefinition<any>>;
}): McpSdkServerConfigWithInstance
```

#### 參數

| 參數 | 類型 | 描述 |
| :-------- | :--- | :---------- |
| `options.name` | `string` | MCP 伺服器的名稱 |
| `options.version` | `string` | 可選的版本字串 |
| `options.tools` | `Array<SdkMcpToolDefinition>` | 使用 [`tool()`](#tool) 建立的工具定義陣列 |

## 類型

### `Options`

`query()` 函數的配置物件。

| 屬性 | 類型 | 預設值 | 描述 |
| :------- | :--- | :------ | :---------- |
| `abortController` | `AbortController` | `new AbortController()` | 用於取消操作的控制器 |
| `additionalDirectories` | `string[]` | `[]` | Claude 可以存取的其他目錄 |
| `agents` | `Record<string, [`AgentDefinition`](#agentdefinition)>` | `undefined` | 以程式設計方式定義子代理 |
| `allowDangerouslySkipPermissions` | `boolean` | `false` | 啟用繞過權限。使用 `permissionMode: 'bypassPermissions'` 時需要 |
| `allowedTools` | `string[]` | 所有工具 | 允許的工具名稱清單 |
| `betas` | [`SdkBeta`](#sdkbeta)`[]` | `[]` | 啟用測試版功能（例如 `['context-1m-2025-08-07']`） |
| `canUseTool` | [`CanUseTool`](#canusetool) | `undefined` | 用於控制工具使用的自訂權限函數 |
| `continue` | `boolean` | `false` | 繼續最近的對話 |
| `cwd` | `string` | `process.cwd()` | 目前的工作目錄 |
| `disallowedTools` | `string[]` | `[]` | 不允許的工具名稱清單 |
| `env` | `Dict<string>` | `process.env` | 環境變數 |
| `executable` | `'bun' \| 'deno' \| 'node'` | 自動偵測 | 要使用的 JavaScript 執行時環境 |
| `executableArgs` | `string[]` | `[]` | 傳遞給執行檔的引數 |
| `extraArgs` | `Record<string, string \| null>` | `{}` | 其他引數 |
| `fallbackModel` | `string` | `undefined` | 主要模型失敗時使用的模型 |
| `forkSession` | `boolean` | `false` | 使用 `resume` 繼續時，分叉到新的工作階段 ID，而不是繼續原始工作階段 |
| `hooks` | `Partial<Record<`[`HookEvent`](#hookevent)`, `[`HookCallbackMatcher`](#hookcallbackmatcher)`[]>>` | `{}` | 事件的掛鉤回呼 |
| `includePartialMessages` | `boolean` | `false` | 包含部分訊息事件 |
| `maxBudgetUsd` | `number` | `undefined` | 查詢的最大預算（美元） |
| `maxThinkingTokens` | `number` | `undefined` | 思考過程的最大權杖數 |
| `maxTurns` | `number` | `undefined` | 最大對話輪數 |
| `mcpServers` | `Record<string, [`McpServerConfig`](#mcpserverconfig)>` | `{}` | MCP 伺服器配置 |
| `model` | `string` | CLI 的預設值 | 要使用的 Claude 模型 |
| `outputFormat` | `{ type: 'json_schema', schema: JSONSchema }` | `undefined` | 定義代理結果的輸出格式。詳見[結構化輸出](/docs/zh-TW/agent-sdk/structured-outputs) |
| `pathToClaudeCodeExecutable` | `string` | 使用內建執行檔 | Claude Code 執行檔的路徑 |
| `permissionMode` | [`PermissionMode`](#permissionmode) | `'default'` | 工作階段的權限模式 |
| `permissionPromptToolName` | `string` | `undefined` | 權限提示的 MCP 工具名稱 |
| `plugins` | [`SdkPluginConfig`](#sdkpluginconfig)`[]` | `[]` | 從本地路徑載入自訂外掛程式。詳見[外掛程式](/docs/zh-TW/agent-sdk/plugins) |
| `resume` | `string` | `undefined` | 要繼續的工作階段 ID |
| `resumeSessionAt` | `string` | `undefined` | 在特定訊息 UUID 處繼續工作階段 |
| `sandbox` | [`SandboxSettings`](#sandboxsettings) | `undefined` | 以程式設計方式配置沙箱行為。詳見[沙箱設定](#sandboxsettings) |
| `settingSources` | [`SettingSource`](#settingsource)`[]` | `[]`（無設定） | 控制要載入哪些檔案系統設定。省略時，不會載入任何設定。**注意：** 必須包含 `'project'` 才能載入 CLAUDE.md 檔案 |
| `stderr` | `(data: string) => void` | `undefined` | stderr 輸出的回呼 |
| `strictMcpConfig` | `boolean` | `false` | 強制執行嚴格的 MCP 驗證 |
| `systemPrompt` | `string \| { type: 'preset'; preset: 'claude_code'; append?: string }` | `undefined`（空提示） | 系統提示配置。傳遞字串以取得自訂提示，或傳遞 `{ type: 'preset', preset: 'claude_code' }` 以使用 Claude Code 的系統提示。使用預設物件形式時，新增 `append` 以使用其他指示擴展系統提示 |
| `tools` | `string[] \| { type: 'preset'; preset: 'claude_code' }` | `undefined` | 工具配置。傳遞工具名稱陣列或使用預設值以取得 Claude Code 的預設工具 |

### `Query`

`query()` 函數返回的介面。

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

#### 方法

| 方法 | 描述 |
| :----- | :---------- |
| `interrupt()` | 中斷查詢（僅在串流輸入模式中可用） |
| `setPermissionMode()` | 變更權限模式（僅在串流輸入模式中可用） |
| `setModel()` | 變更模型（僅在串流輸入模式中可用） |
| `setMaxThinkingTokens()` | 變更最大思考權杖數（僅在串流輸入模式中可用） |
| `supportedCommands()` | 返回可用的斜線命令 |
| `supportedModels()` | 返回可用的模型及其顯示資訊 |
| `mcpServerStatus()` | 返回連接的 MCP 伺服器的狀態 |
| `accountInfo()` | 返回帳戶資訊 |

### `AgentDefinition`

以程式設計方式定義的子代理的配置。

```typescript
type AgentDefinition = {
  description: string;
  tools?: string[];
  prompt: string;
  model?: 'sonnet' | 'opus' | 'haiku' | 'inherit';
}
```

| 欄位 | 必需 | 描述 |
|:------|:---------|:------------|
| `description` | 是 | 何時使用此代理的自然語言描述 |
| `tools` | 否 | 允許的工具名稱陣列。如果省略，繼承所有工具 |
| `prompt` | 是 | 代理的系統提示 |
| `model` | 否 | 此代理的模型覆蓋。如果省略，使用主模型 |

### `SettingSource`

控制 SDK 從哪些檔案系統配置源載入設定。

```typescript
type SettingSource = 'user' | 'project' | 'local';
```

| 值 | 描述 | 位置 |
|:------|:------------|:---------|
| `'user'` | 全域使用者設定 | `~/.claude/settings.json` |
| `'project'` | 共用專案設定（版本控制） | `.claude/settings.json` |
| `'local'` | 本地專案設定（gitignored） | `.claude/settings.local.json` |

#### 預設行為

當 `settingSources` **被省略**或**未定義**時，SDK **不會**載入任何檔案系統設定。這為 SDK 應用程式提供了隔離。

#### 為什麼使用 settingSources？

**載入所有檔案系統設定（舊版行為）：**
```typescript
// 像 SDK v0.0.x 一樣載入所有設定
const result = query({
  prompt: "分析此程式碼",
  options: {
    settingSources: ['user', 'project', 'local']  // 載入所有設定
  }
});
```

**僅載入特定設定源：**
```typescript
// 僅載入專案設定，忽略使用者和本地設定
const result = query({
  prompt: "執行 CI 檢查",
  options: {
    settingSources: ['project']  // 僅 .claude/settings.json
  }
});
```

**測試和 CI 環境：**
```typescript
// 透過排除本地設定來確保 CI 中的一致行為
const result = query({
  prompt: "執行測試",
  options: {
    settingSources: ['project'],  // 僅團隊共用設定
    permissionMode: 'bypassPermissions'
  }
});
```

**僅限 SDK 的應用程式：**
```typescript
// 以程式設計方式定義所有內容（預設行為）
// 無檔案系統依賴 - settingSources 預設為 []
const result = query({
  prompt: "檢查此 PR",
  options: {
    // settingSources: [] 是預設值，無需指定
    agents: { /* ... */ },
    mcpServers: { /* ... */ },
    allowedTools: ['Read', 'Grep', 'Glob']
  }
});
```

**載入 CLAUDE.md 專案指示：**
```typescript
// 載入專案設定以包含 CLAUDE.md 檔案
const result = query({
  prompt: "按照專案慣例新增功能",
  options: {
    systemPrompt: {
      type: 'preset',
      preset: 'claude_code'  // 需要使用 CLAUDE.md
    },
    settingSources: ['project'],  // 從專案目錄載入 CLAUDE.md
    allowedTools: ['Read', 'Write', 'Edit']
  }
});
```

#### 設定優先順序

載入多個源時，設定會按此優先順序合併（從高到低）：
1. 本地設定（`.claude/settings.local.json`）
2. 專案設定（`.claude/settings.json`）
3. 使用者設定（`~/.claude/settings.json`）

程式設計選項（如 `agents`、`allowedTools`）始終覆蓋檔案系統設定。

### `PermissionMode`

```typescript
type PermissionMode =
  | 'default'           // 標準權限行為
  | 'acceptEdits'       // 自動接受檔案編輯
  | 'bypassPermissions' // 繞過所有權限檢查
  | 'plan'              // 規劃模式 - 無執行
```

### `CanUseTool`

用於控制工具使用的自訂權限函數類型。

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

權限檢查的結果。

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

MCP 伺服器的配置。

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

SDK 中載入外掛程式的配置。

```typescript
type SdkPluginConfig = {
  type: 'local';
  path: string;
}
```

| 欄位 | 類型 | 描述 |
|:------|:-----|:------------|
| `type` | `'local'` | 必須是 `'local'`（目前僅支援本地外掛程式） |
| `path` | `string` | 外掛程式目錄的絕對或相對路徑 |

**範例：**
```typescript
plugins: [
  { type: 'local', path: './my-plugin' },
  { type: 'local', path: '/absolute/path/to/plugin' }
]
```

如需建立和使用外掛程式的完整資訊，請參閱[外掛程式](/docs/zh-TW/agent-sdk/plugins)。

## 訊息類型

### `SDKMessage`

查詢返回的所有可能訊息的聯合類型。

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

助手回應訊息。

```typescript
type SDKAssistantMessage = {
  type: 'assistant';
  uuid: UUID;
  session_id: string;
  message: APIAssistantMessage; // 來自 Anthropic SDK
  parent_tool_use_id: string | null;
}
```

### `SDKUserMessage`

使用者輸入訊息。

```typescript
type SDKUserMessage = {
  type: 'user';
  uuid?: UUID;
  session_id: string;
  message: APIUserMessage; // 來自 Anthropic SDK
  parent_tool_use_id: string | null;
}
```

### `SDKUserMessageReplay`

具有必需 UUID 的重播使用者訊息。

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

最終結果訊息。

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

系統初始化訊息。

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

串流部分訊息（僅當 `includePartialMessages` 為 true 時）。

```typescript
type SDKPartialAssistantMessage = {
  type: 'stream_event';
  event: RawMessageStreamEvent; // 來自 Anthropic SDK
  parent_tool_use_id: string | null;
  uuid: UUID;
  session_id: string;
}
```

### `SDKCompactBoundaryMessage`

指示對話壓縮邊界的訊息。

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

有關被拒絕的工具使用的資訊。

```typescript
type SDKPermissionDenial = {
  tool_name: string;
  tool_use_id: string;
  tool_input: ToolInput;
}
```

## 掛鉤類型

如需使用掛鉤的綜合指南、範例和常見模式，請參閱[掛鉤指南](/docs/zh-TW/agent-sdk/hooks)。

### `HookEvent`

可用的掛鉤事件。

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

掛鉤回呼函數類型。

```typescript
type HookCallback = (
  input: HookInput, // 所有掛鉤輸入類型的聯合
  toolUseID: string | undefined,
  options: { signal: AbortSignal }
) => Promise<HookJSONOutput>;
```

### `HookCallbackMatcher`

具有可選匹配器的掛鉤配置。

```typescript
interface HookCallbackMatcher {
  matcher?: string;
  hooks: HookCallback[];
}
```

### `HookInput`

所有掛鉤輸入類型的聯合類型。

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

所有掛鉤輸入類型擴展的基本介面。

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
  reason: ExitReason;  // EXIT_REASONS 陣列中的字串
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

掛鉤返回值。

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

## 工具輸入類型

所有內建 Claude Code 工具的輸入架構文件。這些類型從 `@anthropic-ai/claude-agent-sdk` 匯出，可用於類型安全的工具互動。

### `ToolInput`

**注意：** 這是一個僅用於清晰度的文件類型。它代表所有工具輸入類型的聯合。

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

**工具名稱：** `Task`

```typescript
interface AgentInput {
  /**
   * 任務的簡短（3-5 個單詞）描述
   */
  description: string;
  /**
   * 代理要執行的任務
   */
  prompt: string;
  /**
   * 用於此任務的專門代理類型
   */
  subagent_type: string;
}
```

啟動新代理以自主處理複雜的多步驟任務。

### AskUserQuestion

**工具名稱：** `AskUserQuestion`

```typescript
interface AskUserQuestionInput {
  /**
   * 要詢問使用者的問題（1-4 個問題）
   */
  questions: Array<{
    /**
     * 要詢問使用者的完整問題。應清晰、具體，
     * 並以問號結尾。
     */
    question: string;
    /**
     * 顯示為晶片/標籤的非常簡短的標籤（最多 12 個字元）。
     * 範例："Auth method"、"Library"、"Approach"
     */
    header: string;
    /**
     * 可用的選擇（2-4 個選項）。自動提供
     * "Other" 選項。
     */
    options: Array<{
      /**
       * 此選項的顯示文字（1-5 個單詞）
       */
      label: string;
      /**
       * 此選項含義的說明
       */
      description: string;
    }>;
    /**
     * 設定為 true 以允許多個選擇
     */
    multiSelect: boolean;
  }>;
  /**
   * 使用者答案由權限系統填充。
   * 將問題文字對應到選定的選項標籤。
   * 多選答案以逗號分隔。
   */
  answers?: Record<string, string>;
}
```

在執行期間詢問使用者澄清問題。詳見[處理 AskUserQuestion 工具](/docs/zh-TW/agent-sdk/permissions#handling-the-askuserquestion-tool)以了解使用詳情。

### Bash

**工具名稱：** `Bash`

```typescript
interface BashInput {
  /**
   * 要執行的命令
   */
  command: string;
  /**
   * 可選的逾時時間（毫秒）（最多 600000）
   */
  timeout?: number;
  /**
   * 此命令在 5-10 個單詞中的清晰、簡潔描述
   */
  description?: string;
  /**
   * 設定為 true 以在背景執行此命令
   */
  run_in_background?: boolean;
}
```

在持久 shell 工作階段中執行 bash 命令，支援可選的逾時和背景執行。

### BashOutput

**工具名稱：** `BashOutput`

```typescript
interface BashOutputInput {
  /**
   * 要從中檢索輸出的背景 shell 的 ID
   */
  bash_id: string;
  /**
   * 可選的正規表達式以篩選輸出行
   */
  filter?: string;
}
```

從執行中或已完成的背景 bash shell 檢索輸出。

### Edit

**工具名稱：** `Edit`

```typescript
interface FileEditInput {
  /**
   * 要修改的檔案的絕對路徑
   */
  file_path: string;
  /**
   * 要替換的文字
   */
  old_string: string;
  /**
   * 要替換為的文字（必須與 old_string 不同）
   */
  new_string: string;
  /**
   * 替換 old_string 的所有出現（預設 false）
   */
  replace_all?: boolean;
}
```

在檔案中執行精確的字串替換。

### Read

**工具名稱：** `Read`

```typescript
interface FileReadInput {
  /**
   * 要讀取的檔案的絕對路徑
   */
  file_path: string;
  /**
   * 開始讀取的行號
   */
  offset?: number;
  /**
   * 要讀取的行數
   */
  limit?: number;
}
```

從本地檔案系統讀取檔案，包括文字、影像、PDF 和 Jupyter 筆記本。

### Write

**工具名稱：** `Write`

```typescript
interface FileWriteInput {
  /**
   * 要寫入的檔案的絕對路徑
   */
  file_path: string;
  /**
   * 要寫入檔案的內容
   */
  content: string;
}
```

將檔案寫入本地檔案系統，如果存在則覆蓋。

### Glob

**工具名稱：** `Glob`

```typescript
interface GlobInput {
  /**
   * 要與檔案匹配的 glob 模式
   */
  pattern: string;
  /**
   * 要搜尋的目錄（預設為 cwd）
   */
  path?: string;
}
```

快速檔案模式匹配，適用於任何程式碼庫大小。

### Grep

**工具名稱：** `Grep`

```typescript
interface GrepInput {
  /**
   * 要搜尋的正規表達式模式
   */
  pattern: string;
  /**
   * 要搜尋的檔案或目錄（預設為 cwd）
   */
  path?: string;
  /**
   * Glob 模式以篩選檔案（例如 "*.js"）
   */
  glob?: string;
  /**
   * 要搜尋的檔案類型（例如 "js"、"py"、"rust"）
   */
  type?: string;
  /**
   * 輸出模式："content"、"files_with_matches" 或 "count"
   */
  output_mode?: 'content' | 'files_with_matches' | 'count';
  /**
   * 不區分大小寫搜尋
   */
  '-i'?: boolean;
  /**
   * 顯示行號（用於內容模式）
   */
  '-n'?: boolean;
  /**
   * 每個匹配項之前要顯示的行數
   */
  '-B'?: number;
  /**
   * 每個匹配項之後要顯示的行數
   */
  '-A'?: number;
  /**
   * 每個匹配項之前和之後要顯示的行數
   */
  '-C'?: number;
  /**
   * 將輸出限制為前 N 行/條目
   */
  head_limit?: number;
  /**
   * 啟用多行模式
   */
  multiline?: boolean;
}
```

基於 ripgrep 的強大搜尋工具，支援正規表達式。

### KillBash

**工具名稱：** `KillBash`

```typescript
interface KillShellInput {
  /**
   * 要終止的背景 shell 的 ID
   */
  shell_id: string;
}
```

按 ID 終止執行中的背景 bash shell。

### NotebookEdit

**工具名稱：** `NotebookEdit`

```typescript
interface NotebookEditInput {
  /**
   * Jupyter 筆記本檔案的絕對路徑
   */
  notebook_path: string;
  /**
   * 要編輯的儲存格的 ID
   */
  cell_id?: string;
  /**
   * 儲存格的新來源
   */
  new_source: string;
  /**
   * 儲存格的類型（程式碼或 markdown）
   */
  cell_type?: 'code' | 'markdown';
  /**
   * 編輯的類型（替換、插入、刪除）
   */
  edit_mode?: 'replace' | 'insert' | 'delete';
}
```

編輯 Jupyter 筆記本檔案中的儲存格。

### WebFetch

**工具名稱：** `WebFetch`

```typescript
interface WebFetchInput {
  /**
   * 要從中擷取內容的 URL
   */
  url: string;
  /**
   * 要在擷取的內容上執行的提示
   */
  prompt: string;
}
```

從 URL 擷取內容並使用 AI 模型進行處理。

### WebSearch

**工具名稱：** `WebSearch`

```typescript
interface WebSearchInput {
  /**
   * 要使用的搜尋查詢
   */
  query: string;
  /**
   * 僅包含來自這些網域的結果
   */
  allowed_domains?: string[];
  /**
   * 永遠不要包含來自這些網域的結果
   */
  blocked_domains?: string[];
}
```

搜尋網路並返回格式化的結果。

### TodoWrite

**工具名稱：** `TodoWrite`

```typescript
interface TodoWriteInput {
  /**
   * 更新的待辦事項清單
   */
  todos: Array<{
    /**
     * 任務描述
     */
    content: string;
    /**
     * 任務狀態
     */
    status: 'pending' | 'in_progress' | 'completed';
    /**
     * 任務描述的主動形式
     */
    activeForm: string;
  }>;
}
```

建立和管理結構化任務清單以追蹤進度。

### ExitPlanMode

**工具名稱：** `ExitPlanMode`

```typescript
interface ExitPlanModeInput {
  /**
   * 使用者批准要執行的計畫
   */
  plan: string;
}
```

退出規劃模式並提示使用者批准計畫。

### ListMcpResources

**工具名稱：** `ListMcpResources`

```typescript
interface ListMcpResourcesInput {
  /**
   * 可選的伺服器名稱以篩選資源
   */
  server?: string;
}
```

列出來自連接伺服器的可用 MCP 資源。

### ReadMcpResource

**工具名稱：** `ReadMcpResource`

```typescript
interface ReadMcpResourceInput {
  /**
   * MCP 伺服器名稱
   */
  server: string;
  /**
   * 要讀取的資源 URI
   */
  uri: string;
}
```

從伺服器讀取特定的 MCP 資源。

## 工具輸出類型

所有內建 Claude Code 工具的輸出架構文件。這些類型代表每個工具返回的實際回應資料。

### `ToolOutput`

**注意：** 這是一個僅用於清晰度的文件類型。它代表所有工具輸出類型的聯合。

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

**工具名稱：** `Task`

```typescript
interface TaskOutput {
  /**
   * 子代理的最終結果訊息
   */
  result: string;
  /**
   * 權杖使用統計資訊
   */
  usage?: {
    input_tokens: number;
    output_tokens: number;
    cache_creation_input_tokens?: number;
    cache_read_input_tokens?: number;
  };
  /**
   * 總成本（美元）
   */
  total_cost_usd?: number;
  /**
   * 執行持續時間（毫秒）
   */
  duration_ms?: number;
}
```

在子代理完成委派任務後返回最終結果。

### AskUserQuestion

**工具名稱：** `AskUserQuestion`

```typescript
interface AskUserQuestionOutput {
  /**
   * 被詢問的問題
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
   * 使用者提供的答案。
   * 將問題文字對應到答案字串。
   * 多選答案以逗號分隔。
   */
  answers: Record<string, string>;
}
```

返回詢問的問題和使用者的答案。

### Bash

**工具名稱：** `Bash`

```typescript
interface BashOutput {
  /**
   * 合併的 stdout 和 stderr 輸出
   */
  output: string;
  /**
   * 命令的結束代碼
   */
  exitCode: number;
  /**
   * 命令是否因逾時而被終止
   */
  killed?: boolean;
  /**
   * 背景進程的 Shell ID
   */
  shellId?: string;
}
```

返回命令輸出和結束狀態。背景命令立即返回 shellId。

### BashOutput

**工具名稱：** `BashOutput`

```typescript
interface BashOutputToolOutput {
  /**
   * 自上次檢查以來的新輸出
   */
  output: string;
  /**
   * 目前 shell 狀態
   */
  status: 'running' | 'completed' | 'failed';
  /**
   * 結束代碼（完成時）
   */
  exitCode?: number;
}
```

從背景 shell 返回增量輸出。

### Edit

**工具名稱：** `Edit`

```typescript
interface EditOutput {
  /**
   * 確認訊息
   */
  message: string;
  /**
   * 進行的替換次數
   */
  replacements: number;
  /**
   * 被編輯的檔案路徑
   */
  file_path: string;
}
```

返回成功編輯的確認和替換計數。

### Read

**工具名稱：** `Read`

```typescript
type ReadOutput = 
  | TextFileOutput
  | ImageFileOutput
  | PDFFileOutput
  | NotebookFileOutput;

interface TextFileOutput {
  /**
   * 包含行號的檔案內容
   */
  content: string;
  /**
   * 檔案中的總行數
   */
  total_lines: number;
  /**
   * 實際返回的行數
   */
  lines_returned: number;
}

interface ImageFileOutput {
  /**
   * Base64 編碼的影像資料
   */
  image: string;
  /**
   * 影像 MIME 類型
   */
  mime_type: string;
  /**
   * 檔案大小（位元組）
   */
  file_size: number;
}

interface PDFFileOutput {
  /**
   * 頁面內容陣列
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
   * 總頁數
   */
  total_pages: number;
}

interface NotebookFileOutput {
  /**
   * Jupyter 筆記本儲存格
   */
  cells: Array<{
    cell_type: 'code' | 'markdown';
    source: string;
    outputs?: any[];
    execution_count?: number;
  }>;
  /**
   * 筆記本中繼資料
   */
  metadata?: Record<string, any>;
}
```

根據檔案類型以適當的格式返回檔案內容。

### Write

**工具名稱：** `Write`

```typescript
interface WriteOutput {
  /**
   * 成功訊息
   */
  message: string;
  /**
   * 寫入的位元組數
   */
  bytes_written: number;
  /**
   * 寫入的檔案路徑
   */
  file_path: string;
}
```

成功寫入檔案後返回確認。

### Glob

**工具名稱：** `Glob`

```typescript
interface GlobOutput {
  /**
   * 符合的檔案路徑陣列
   */
  matches: string[];
  /**
   * 找到的符合項目數
   */
  count: number;
  /**
   * 使用的搜尋目錄
   */
  search_path: string;
}
```

返回符合 glob 模式的檔案路徑，按修改時間排序。

### Grep

**工具名稱：** `Grep`

```typescript
type GrepOutput = 
  | GrepContentOutput
  | GrepFilesOutput
  | GrepCountOutput;

interface GrepContentOutput {
  /**
   * 包含上下文的符合行
   */
  matches: Array<{
    file: string;
    line_number?: number;
    line: string;
    before_context?: string[];
    after_context?: string[];
  }>;
  /**
   * 符合項目的總數
   */
  total_matches: number;
}

interface GrepFilesOutput {
  /**
   * 包含符合項目的檔案
   */
  files: string[];
  /**
   * 包含符合項目的檔案數
   */
  count: number;
}

interface GrepCountOutput {
  /**
   * 每個檔案的符合計數
   */
  counts: Array<{
    file: string;
    count: number;
  }>;
  /**
   * 所有檔案的總符合數
   */
  total: number;
}
```

以 output_mode 指定的格式返回搜尋結果。

### KillBash

**工具名稱：** `KillBash`

```typescript
interface KillBashOutput {
  /**
   * 成功訊息
   */
  message: string;
  /**
   * 被終止的 shell 的 ID
   */
  shell_id: string;
}
```

終止背景 shell 後返回確認。

### NotebookEdit

**工具名稱：** `NotebookEdit`

```typescript
interface NotebookEditOutput {
  /**
   * 成功訊息
   */
  message: string;
  /**
   * 執行的編輯類型
   */
  edit_type: 'replaced' | 'inserted' | 'deleted';
  /**
   * 受影響的儲存格 ID
   */
  cell_id?: string;
  /**
   * 編輯後筆記本中的總儲存格數
   */
  total_cells: number;
}
```

修改 Jupyter 筆記本後返回確認。

### WebFetch

**工具名稱：** `WebFetch`

```typescript
interface WebFetchOutput {
  /**
   * AI 模型對提示的回應
   */
  response: string;
  /**
   * 被擷取的 URL
   */
  url: string;
  /**
   * 重新導向後的最終 URL
   */
  final_url?: string;
  /**
   * HTTP 狀態碼
   */
  status_code?: number;
}
```

返回 AI 對擷取的網頁內容的分析。

### WebSearch

**工具名稱：** `WebSearch`

```typescript
interface WebSearchOutput {
  /**
   * 搜尋結果
   */
  results: Array<{
    title: string;
    url: string;
    snippet: string;
    /**
     * 如果可用的其他中繼資料
     */
    metadata?: Record<string, any>;
  }>;
  /**
   * 結果的總數
   */
  total_results: number;
  /**
   * 搜尋的查詢
   */
  query: string;
}
```

返回來自網路的格式化搜尋結果。

### TodoWrite

**工具名稱：** `TodoWrite`

```typescript
interface TodoWriteOutput {
  /**
   * 成功訊息
   */
  message: string;
  /**
   * 目前的待辦事項統計資料
   */
  stats: {
    total: number;
    pending: number;
    in_progress: number;
    completed: number;
  };
}
```

返回確認和目前的工作統計資料。

### ExitPlanMode

**工具名稱：** `ExitPlanMode`

```typescript
interface ExitPlanModeOutput {
  /**
   * 確認訊息
   */
  message: string;
  /**
   * 使用者是否批准了計畫
   */
  approved?: boolean;
}
```

退出計畫模式後返回確認。

### ListMcpResources

**工具名稱：** `ListMcpResources`

```typescript
interface ListMcpResourcesOutput {
  /**
   * 可用的資源
   */
  resources: Array<{
    uri: string;
    name: string;
    description?: string;
    mimeType?: string;
    server: string;
  }>;
  /**
   * 資源的總數
   */
  total: number;
}
```

返回可用 MCP 資源的清單。

### ReadMcpResource

**工具名稱：** `ReadMcpResource`

```typescript
interface ReadMcpResourceOutput {
  /**
   * 資源內容
   */
  contents: Array<{
    uri: string;
    mimeType?: string;
    text?: string;
    blob?: string;
  }>;
  /**
   * 提供資源的伺服器
   */
  server: string;
}
```

返回所要求 MCP 資源的內容。

## 權限類型

### `PermissionUpdate`

用於更新權限的操作。

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
  | 'userSettings'     // 全域使用者設定
  | 'projectSettings'  // 每個目錄的專案設定
  | 'localSettings'    // Gitignored 本機設定
  | 'session'          // 僅限目前工作階段
```

### `PermissionRuleValue`

```typescript
type PermissionRuleValue = {
  toolName: string;
  ruleContent?: string;
}
```

## 其他類型

### `ApiKeySource`

```typescript
type ApiKeySource = 'user' | 'project' | 'org' | 'temporary';
```

### `SdkBeta`

可透過 `betas` 選項啟用的可用測試版功能。如需詳細資訊，請參閱[測試版標頭](/docs/zh-TW/api/beta-headers)。

```typescript
type SdkBeta = 'context-1m-2025-08-07';
```

| 值 | 說明 | 相容的模型 |
|:------|:------------|:------------------|
| `'context-1m-2025-08-07'` | 啟用 100 萬個權杖[內容視窗](/docs/zh-TW/build-with-claude/context-windows) | Claude Sonnet 4、Claude Sonnet 4.5 |

### `SlashCommand`

有關可用斜線命令的資訊。

```typescript
type SlashCommand = {
  name: string;
  description: string;
  argumentHint: string;
}
```

### `ModelInfo`

有關可用模型的資訊。

```typescript
type ModelInfo = {
  value: string;
  displayName: string;
  description: string;
}
```

### `McpServerStatus`

已連線 MCP 伺服器的狀態。

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

已驗證使用者的帳戶資訊。

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

在結果訊息中返回的每個模型的使用統計資料。

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

[`Usage`](#usage) 的版本，其中所有可為空的欄位都變成不可為空。

```typescript
type NonNullableUsage = {
  [K in keyof Usage]: NonNullable<Usage[K]>;
}
```

### `Usage`

權杖使用統計資料（來自 `@anthropic-ai/sdk`）。

```typescript
type Usage = {
  input_tokens: number | null;
  output_tokens: number | null;
  cache_creation_input_tokens?: number | null;
  cache_read_input_tokens?: number | null;
}
```

### `CallToolResult`

MCP 工具結果類型（來自 `@modelcontextprotocol/sdk/types.js`）。

```typescript
type CallToolResult = {
  content: Array<{
    type: 'text' | 'image' | 'resource';
    // 其他欄位因類型而異
  }>;
  isError?: boolean;
}
```

### `AbortError`

用於中止操作的自訂錯誤類別。

```typescript
class AbortError extends Error {}
```

## 沙箱設定

### `SandboxSettings`

沙箱行為的設定。使用此選項以程式設計方式啟用命令沙箱並設定網路限制。

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

| 屬性 | 類型 | 預設值 | 說明 |
| :------- | :--- | :------ | :---------- |
| `enabled` | `boolean` | `false` | 為命令執行啟用沙箱模式 |
| `autoAllowBashIfSandboxed` | `boolean` | `false` | 啟用沙箱時自動批准 bash 命令 |
| `excludedCommands` | `string[]` | `[]` | 始終繞過沙箱限制的命令（例如 `['docker']`）。這些命令會自動在沙箱外執行，無需模型參與 |
| `allowUnsandboxedCommands` | `boolean` | `false` | 允許模型要求在沙箱外執行命令。當設定為 `true` 時，模型可以在工具輸入中設定 `dangerouslyDisableSandbox`，這會回退到[權限系統](#permissions-fallback-for-unsandboxed-commands) |
| `network` | [`NetworkSandboxSettings`](#networksandboxsettings) | `undefined` | 網路特定的沙箱設定 |
| `ignoreViolations` | [`SandboxIgnoreViolations`](#sandboxignoreviolations) | `undefined` | 設定要忽略的沙箱違規 |
| `enableWeakerNestedSandbox` | `boolean` | `false` | 啟用較弱的巢狀沙箱以相容性 |

<Note>
**檔案系統和網路存取限制**不是透過沙箱設定進行設定。相反，它們是從[權限規則](https://code.claude.com/docs/zh-TW/settings#permission-settings)衍生的：

- **檔案系統讀取限制**：讀取拒絕規則
- **檔案系統寫入限制**：編輯允許/拒絕規則
- **網路限制**：WebFetch 允許/拒絕規則

使用沙箱設定進行命令執行沙箱，並使用權限規則進行檔案系統和網路存取控制。
</Note>

#### 使用範例

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

沙箱模式的網路特定設定。

```typescript
type NetworkSandboxSettings = {
  allowLocalBinding?: boolean;
  allowUnixSockets?: string[];
  allowAllUnixSockets?: boolean;
  httpProxyPort?: number;
  socksProxyPort?: number;
}
```

| 屬性 | 類型 | 預設值 | 說明 |
| :------- | :--- | :------ | :---------- |
| `allowLocalBinding` | `boolean` | `false` | 允許程序繫結到本機連接埠（例如用於開發伺服器） |
| `allowUnixSockets` | `string[]` | `[]` | 程序可以存取的 Unix 通訊端路徑（例如 Docker 通訊端） |
| `allowAllUnixSockets` | `boolean` | `false` | 允許存取所有 Unix 通訊端 |
| `httpProxyPort` | `number` | `undefined` | 網路要求的 HTTP Proxy 連接埠 |
| `socksProxyPort` | `number` | `undefined` | 網路要求的 SOCKS Proxy 連接埠 |

### `SandboxIgnoreViolations`

用於忽略特定沙箱違規的設定。

```typescript
type SandboxIgnoreViolations = {
  file?: string[];
  network?: string[];
}
```

| 屬性 | 類型 | 預設值 | 說明 |
| :------- | :--- | :------ | :---------- |
| `file` | `string[]` | `[]` | 要忽略違規的檔案路徑模式 |
| `network` | `string[]` | `[]` | 要忽略違規的網路模式 |

### 無沙箱命令的權限回退

啟用 `allowUnsandboxedCommands` 時，模型可以透過在工具輸入中設定 `dangerouslyDisableSandbox: true` 來要求在沙箱外執行命令。這些要求會回退到現有的權限系統，這表示您的 `canUseTool` 處理程式將被叫用，允許您實作自訂授權邏輯。

<Note>
**`excludedCommands` 與 `allowUnsandboxedCommands`：**
- `excludedCommands`：始終自動繞過沙箱的靜態命令清單（例如 `['docker']`）。模型對此沒有控制權。
- `allowUnsandboxedCommands`：讓模型在執行時透過在工具輸入中設定 `dangerouslyDisableSandbox: true` 來決定是否要求無沙箱執行。
</Note>

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

const result = await query({
  prompt: "Deploy my application",
  options: {
    sandbox: {
      enabled: true,
      allowUnsandboxedCommands: true  // 模型可以要求無沙箱執行
    },
    permissionMode: "default",
    canUseTool: async (tool, input) => {
      // 檢查模型是否要求繞過沙箱
      if (tool === "Bash" && input.dangerouslyDisableSandbox) {
        // 模型想要在沙箱外執行此命令
        console.log(`Unsandboxed command requested: ${input.command}`);

        // 返回 true 以允許，false 以拒絕
        return isCommandAuthorized(input.command);
      }
      return true;
    }
  }
});
```

此模式使您能夠：

- **稽核模型要求**：記錄模型何時要求無沙箱執行
- **實作允許清單**：僅允許特定命令在無沙箱狀態下執行
- **新增批准工作流程**：要求明確授權以進行特權操作

<Warning>
使用 `dangerouslyDisableSandbox: true` 執行的命令具有完整的系統存取權。確保您的 `canUseTool` 處理程式仔細驗證這些要求。
</Warning>

## 另請參閱

- [SDK 概觀](/docs/zh-TW/agent-sdk/overview) - 一般 SDK 概念
- [Python SDK 參考](/docs/zh-TW/agent-sdk/python) - Python SDK 文件
- [CLI 參考](https://code.claude.com/docs/zh-TW/cli-reference) - 命令列介面
- [常見工作流程](https://code.claude.com/docs/zh-TW/common-workflows) - 逐步指南