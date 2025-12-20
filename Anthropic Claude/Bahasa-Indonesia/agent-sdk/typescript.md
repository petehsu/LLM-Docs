# Agent SDK reference - TypeScript

Referensi API lengkap untuk TypeScript Agent SDK, termasuk semua fungsi, tipe, dan antarmuka.

---

<script src="/components/typescript-sdk-type-links.js" defer />

<Note>
**Coba antarmuka V2 baru (pratinjau):** Antarmuka yang disederhanakan dengan pola `send()` dan `receive()` sekarang tersedia, membuat percakapan multi-putaran lebih mudah. [Pelajari lebih lanjut](/docs/id/agent-sdk/typescript-v2-preview)
</Note>

## Instalasi

```bash
npm install @anthropic-ai/claude-agent-sdk
```

## Fungsi

### `query()`

Fungsi utama untuk berinteraksi dengan Claude Code. Membuat generator asinkron yang melakukan streaming pesan saat tiba.

```typescript
function query({
  prompt,
  options
}: {
  prompt: string | AsyncIterable<SDKUserMessage>;
  options?: Options;
}): Query
```

#### Parameter

| Parameter | Tipe | Deskripsi |
| :-------- | :--- | :---------- |
| `prompt` | `string \| AsyncIterable<`[`SDKUserMessage`](#sdkusermessage)`>` | Prompt input sebagai string atau async iterable untuk mode streaming |
| `options` | [`Options`](#options) | Objek konfigurasi opsional (lihat tipe Options di bawah) |

#### Pengembalian

Mengembalikan objek [`Query`](#query-1) yang memperluas `AsyncGenerator<`[`SDKMessage`](#sdkmessage)`, void>` dengan metode tambahan.

### `tool()`

Membuat definisi alat MCP yang aman tipe untuk digunakan dengan server MCP SDK.

```typescript
function tool<Schema extends ZodRawShape>(
  name: string,
  description: string,
  inputSchema: Schema,
  handler: (args: z.infer<ZodObject<Schema>>, extra: unknown) => Promise<CallToolResult>
): SdkMcpToolDefinition<Schema>
```

#### Parameter

| Parameter | Tipe | Deskripsi |
| :-------- | :--- | :---------- |
| `name` | `string` | Nama alat |
| `description` | `string` | Deskripsi tentang apa yang dilakukan alat |
| `inputSchema` | `Schema extends ZodRawShape` | Skema Zod yang mendefinisikan parameter input alat |
| `handler` | `(args, extra) => Promise<`[`CallToolResult`](#calltoolresult)`>` | Fungsi asinkron yang mengeksekusi logika alat |

### `createSdkMcpServer()`

Membuat instance server MCP yang berjalan dalam proses yang sama dengan aplikasi Anda.

```typescript
function createSdkMcpServer(options: {
  name: string;
  version?: string;
  tools?: Array<SdkMcpToolDefinition<any>>;
}): McpSdkServerConfigWithInstance
```

#### Parameter

| Parameter | Tipe | Deskripsi |
| :-------- | :--- | :---------- |
| `options.name` | `string` | Nama server MCP |
| `options.version` | `string` | String versi opsional |
| `options.tools` | `Array<SdkMcpToolDefinition>` | Array definisi alat yang dibuat dengan [`tool()`](#tool) |

## Tipe

### `Options`

Objek konfigurasi untuk fungsi `query()`.

| Properti | Tipe | Default | Deskripsi |
| :------- | :--- | :------ | :---------- |
| `abortController` | `AbortController` | `new AbortController()` | Pengontrol untuk membatalkan operasi |
| `additionalDirectories` | `string[]` | `[]` | Direktori tambahan yang dapat diakses Claude |
| `agents` | `Record<string, [`AgentDefinition`](#agentdefinition)>` | `undefined` | Tentukan subagen secara terprogram |
| `allowDangerouslySkipPermissions` | `boolean` | `false` | Aktifkan bypass izin. Diperlukan saat menggunakan `permissionMode: 'bypassPermissions'` |
| `allowedTools` | `string[]` | Semua alat | Daftar nama alat yang diizinkan |
| `betas` | [`SdkBeta`](#sdkbeta)`[]` | `[]` | Aktifkan fitur beta (misalnya, `['context-1m-2025-08-07']`) |
| `canUseTool` | [`CanUseTool`](#canusetool) | `undefined` | Fungsi izin kustom untuk penggunaan alat |
| `continue` | `boolean` | `false` | Lanjutkan percakapan terbaru |
| `cwd` | `string` | `process.cwd()` | Direktori kerja saat ini |
| `disallowedTools` | `string[]` | `[]` | Daftar nama alat yang tidak diizinkan |
| `env` | `Dict<string>` | `process.env` | Variabel lingkungan |
| `executable` | `'bun' \| 'deno' \| 'node'` | Terdeteksi otomatis | Runtime JavaScript yang digunakan |
| `executableArgs` | `string[]` | `[]` | Argumen untuk diteruskan ke executable |
| `extraArgs` | `Record<string, string \| null>` | `{}` | Argumen tambahan |
| `fallbackModel` | `string` | `undefined` | Model yang digunakan jika model utama gagal |
| `forkSession` | `boolean` | `false` | Saat melanjutkan dengan `resume`, fork ke ID sesi baru alih-alih melanjutkan sesi asli |
| `hooks` | `Partial<Record<`[`HookEvent`](#hookevent)`, `[`HookCallbackMatcher`](#hookcallbackmatcher)`[]>>` | `{}` | Callback hook untuk acara |
| `includePartialMessages` | `boolean` | `false` | Sertakan acara pesan parsial |
| `maxBudgetUsd` | `number` | `undefined` | Anggaran maksimal dalam USD untuk kueri |
| `maxThinkingTokens` | `number` | `undefined` | Token maksimal untuk proses pemikiran |
| `maxTurns` | `number` | `undefined` | Putaran percakapan maksimal |
| `mcpServers` | `Record<string, [`McpServerConfig`](#mcpserverconfig)>` | `{}` | Konfigurasi server MCP |
| `model` | `string` | Default dari CLI | Model Claude yang digunakan |
| `outputFormat` | `{ type: 'json_schema', schema: JSONSchema }` | `undefined` | Tentukan format output untuk hasil agen. Lihat [Structured outputs](/docs/id/agent-sdk/structured-outputs) untuk detail |
| `pathToClaudeCodeExecutable` | `string` | Menggunakan executable bawaan | Path ke executable Claude Code |
| `permissionMode` | [`PermissionMode`](#permissionmode) | `'default'` | Mode izin untuk sesi |
| `permissionPromptToolName` | `string` | `undefined` | Nama alat MCP untuk prompt izin |
| `plugins` | [`SdkPluginConfig`](#sdkpluginconfig)`[]` | `[]` | Muat plugin kustom dari path lokal. Lihat [Plugins](/docs/id/agent-sdk/plugins) untuk detail |
| `resume` | `string` | `undefined` | ID sesi untuk dilanjutkan |
| `resumeSessionAt` | `string` | `undefined` | Lanjutkan sesi pada UUID pesan tertentu |
| `sandbox` | [`SandboxSettings`](#sandboxsettings) | `undefined` | Konfigurasi perilaku sandbox secara terprogram. Lihat [Sandbox settings](#sandboxsettings) untuk detail |
| `settingSources` | [`SettingSource`](#settingsource)`[]` | `[]` (tidak ada pengaturan) | Kontrol sumber pengaturan filesystem mana yang akan dimuat. Saat dihilangkan, tidak ada pengaturan yang dimuat. **Catatan:** Harus menyertakan `'project'` untuk memuat file CLAUDE.md |
| `stderr` | `(data: string) => void` | `undefined` | Callback untuk output stderr |
| `strictMcpConfig` | `boolean` | `false` | Terapkan validasi MCP yang ketat |
| `systemPrompt` | `string \| { type: 'preset'; preset: 'claude_code'; append?: string }` | `undefined` (prompt kosong) | Konfigurasi prompt sistem. Teruskan string untuk prompt kustom, atau `{ type: 'preset', preset: 'claude_code' }` untuk menggunakan prompt sistem Claude Code. Saat menggunakan bentuk objek preset, tambahkan `append` untuk memperluas prompt sistem dengan instruksi tambahan |
| `tools` | `string[] \| { type: 'preset'; preset: 'claude_code' }` | `undefined` | Konfigurasi alat. Teruskan array nama alat atau gunakan preset untuk mendapatkan alat default Claude Code |

### `Query`

Antarmuka yang dikembalikan oleh fungsi `query()`.

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

#### Metode

| Metode | Deskripsi |
| :----- | :---------- |
| `interrupt()` | Mengganggu kueri (hanya tersedia dalam mode input streaming) |
| `setPermissionMode()` | Mengubah mode izin (hanya tersedia dalam mode input streaming) |
| `setModel()` | Mengubah model (hanya tersedia dalam mode input streaming) |
| `setMaxThinkingTokens()` | Mengubah token pemikiran maksimal (hanya tersedia dalam mode input streaming) |
| `supportedCommands()` | Mengembalikan perintah slash yang tersedia |
| `supportedModels()` | Mengembalikan model yang tersedia dengan info tampilan |
| `mcpServerStatus()` | Mengembalikan status server MCP yang terhubung |
| `accountInfo()` | Mengembalikan informasi akun |

### `AgentDefinition`

Konfigurasi untuk subagen yang didefinisikan secara terprogram.

```typescript
type AgentDefinition = {
  description: string;
  tools?: string[];
  prompt: string;
  model?: 'sonnet' | 'opus' | 'haiku' | 'inherit';
}
```

| Field | Diperlukan | Deskripsi |
|:------|:---------|:------------|
| `description` | Ya | Deskripsi bahasa alami tentang kapan menggunakan agen ini |
| `tools` | Tidak | Array nama alat yang diizinkan. Jika dihilangkan, mewarisi semua alat |
| `prompt` | Ya | Prompt sistem agen |
| `model` | Tidak | Override model untuk agen ini. Jika dihilangkan, menggunakan model utama |

### `SettingSource`

Mengontrol sumber konfigurasi berbasis filesystem mana yang dimuat pengaturan SDK.

```typescript
type SettingSource = 'user' | 'project' | 'local';
```

| Nilai | Deskripsi | Lokasi |
|:------|:------------|:---------|
| `'user'` | Pengaturan pengguna global | `~/.claude/settings.json` |
| `'project'` | Pengaturan proyek bersama (version controlled) | `.claude/settings.json` |
| `'local'` | Pengaturan proyek lokal (gitignored) | `.claude/settings.local.json` |

#### Perilaku default

Ketika `settingSources` **dihilangkan** atau **undefined**, SDK **tidak** memuat pengaturan filesystem apa pun. Ini memberikan isolasi untuk aplikasi SDK.

#### Mengapa menggunakan settingSources?

**Muat semua pengaturan filesystem (perilaku legacy):**
```typescript
// Muat semua pengaturan seperti SDK v0.0.x
const result = query({
  prompt: "Analisis kode ini",
  options: {
    settingSources: ['user', 'project', 'local']  // Muat semua pengaturan
  }
});
```

**Muat hanya sumber pengaturan tertentu:**
```typescript
// Muat hanya pengaturan proyek, abaikan pengguna dan lokal
const result = query({
  prompt: "Jalankan pemeriksaan CI",
  options: {
    settingSources: ['project']  // Hanya .claude/settings.json
  }
});
```

**Lingkungan pengujian dan CI:**
```typescript
// Pastikan perilaku konsisten di CI dengan mengecualikan pengaturan lokal
const result = query({
  prompt: "Jalankan tes",
  options: {
    settingSources: ['project'],  // Hanya pengaturan bersama tim
    permissionMode: 'bypassPermissions'
  }
});
```

**Aplikasi hanya SDK:**
```typescript
// Tentukan semuanya secara terprogram (perilaku default)
// Tidak ada dependensi filesystem - settingSources default ke []
const result = query({
  prompt: "Tinjau PR ini",
  options: {
    // settingSources: [] adalah default, tidak perlu ditentukan
    agents: { /* ... */ },
    mcpServers: { /* ... */ },
    allowedTools: ['Read', 'Grep', 'Glob']
  }
});
```

**Memuat instruksi proyek CLAUDE.md:**
```typescript
// Muat pengaturan proyek untuk menyertakan file CLAUDE.md
const result = query({
  prompt: "Tambahkan fitur baru mengikuti konvensi proyek",
  options: {
    systemPrompt: {
      type: 'preset',
      preset: 'claude_code'  // Diperlukan untuk menggunakan CLAUDE.md
    },
    settingSources: ['project'],  // Memuat CLAUDE.md dari direktori proyek
    allowedTools: ['Read', 'Write', 'Edit']
  }
});
```

#### Preseden pengaturan

Ketika beberapa sumber dimuat, pengaturan digabungkan dengan preseden ini (tertinggi ke terendah):
1. Pengaturan lokal (`.claude/settings.local.json`)
2. Pengaturan proyek (`.claude/settings.json`)
3. Pengaturan pengguna (`~/.claude/settings.json`)

Opsi terprogram (seperti `agents`, `allowedTools`) selalu menimpa pengaturan filesystem.

### `PermissionMode`

```typescript
type PermissionMode =
  | 'default'           // Perilaku izin standar
  | 'acceptEdits'       // Auto-terima edit file
  | 'bypassPermissions' // Bypass semua pemeriksaan izin
  | 'plan'              // Mode perencanaan - tidak ada eksekusi
```

### `CanUseTool`

Tipe fungsi izin kustom untuk mengontrol penggunaan alat.

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

Hasil pemeriksaan izin.

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

Konfigurasi untuk server MCP.

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

Konfigurasi untuk memuat plugin di SDK.

```typescript
type SdkPluginConfig = {
  type: 'local';
  path: string;
}
```

| Field | Tipe | Deskripsi |
|:------|:-----|:------------|
| `type` | `'local'` | Harus `'local'` (hanya plugin lokal yang didukung saat ini) |
| `path` | `string` | Path absolut atau relatif ke direktori plugin |

**Contoh:**
```typescript
plugins: [
  { type: 'local', path: './my-plugin' },
  { type: 'local', path: '/absolute/path/to/plugin' }
]
```

Untuk informasi lengkap tentang membuat dan menggunakan plugin, lihat [Plugins](/docs/id/agent-sdk/plugins).

## Tipe Pesan

### `SDKMessage`

Tipe union dari semua pesan yang mungkin dikembalikan oleh kueri.

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

Pesan respons asisten.

```typescript
type SDKAssistantMessage = {
  type: 'assistant';
  uuid: UUID;
  session_id: string;
  message: APIAssistantMessage; // Dari SDK Anthropic
  parent_tool_use_id: string | null;
}
```

### `SDKUserMessage`

Pesan input pengguna.

```typescript
type SDKUserMessage = {
  type: 'user';
  uuid?: UUID;
  session_id: string;
  message: APIUserMessage; // Dari SDK Anthropic
  parent_tool_use_id: string | null;
}
```

### `SDKUserMessageReplay`

Pesan pengguna yang diputar ulang dengan UUID yang diperlukan.

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

Pesan hasil akhir.

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

Pesan inisialisasi sistem.

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

Pesan parsial streaming (hanya ketika `includePartialMessages` adalah true).

```typescript
type SDKPartialAssistantMessage = {
  type: 'stream_event';
  event: RawMessageStreamEvent; // Dari SDK Anthropic
  parent_tool_use_id: string | null;
  uuid: UUID;
  session_id: string;
}
```

### `SDKCompactBoundaryMessage`

Pesan yang menunjukkan batas pemadatan percakapan.

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

Informasi tentang penggunaan alat yang ditolak.

```typescript
type SDKPermissionDenial = {
  tool_name: string;
  tool_use_id: string;
  tool_input: ToolInput;
}
```

## Tipe Hook

Untuk panduan komprehensif tentang menggunakan hook dengan contoh dan pola umum, lihat [panduan Hooks](/docs/id/agent-sdk/hooks).

### `HookEvent`

Acara hook yang tersedia.

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

Tipe fungsi callback hook.

```typescript
type HookCallback = (
  input: HookInput, // Union dari semua tipe input hook
  toolUseID: string | undefined,
  options: { signal: AbortSignal }
) => Promise<HookJSONOutput>;
```

### `HookCallbackMatcher`

Konfigurasi hook dengan matcher opsional.

```typescript
interface HookCallbackMatcher {
  matcher?: string;
  hooks: HookCallback[];
}
```

### `HookInput`

Tipe union dari semua tipe input hook.

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

Antarmuka dasar yang diperluas oleh semua tipe input hook.

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
  reason: ExitReason;  // String dari array EXIT_REASONS
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

Nilai pengembalian hook.

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

## Tipe Input Alat

Dokumentasi skema input untuk semua alat Claude Code bawaan. Tipe-tipe ini diekspor dari `@anthropic-ai/claude-agent-sdk` dan dapat digunakan untuk interaksi alat yang aman tipe.

### `ToolInput`

**Catatan:** Ini adalah tipe dokumentasi saja untuk kejelasan. Ini mewakili union dari semua tipe input alat.

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

**Nama alat:** `Task`

```typescript
interface AgentInput {
  /**
   * Deskripsi singkat tugas (3-5 kata)
   */
  description: string;
  /**
   * Tugas untuk dijalankan agen
   */
  prompt: string;
  /**
   * Jenis agen khusus yang digunakan untuk tugas ini
   */
  subagent_type: string;
}
```

Meluncurkan agen baru untuk menangani tugas kompleks multi-langkah secara otonom.

### AskUserQuestion

**Nama alat:** `AskUserQuestion`

```typescript
interface AskUserQuestionInput {
  /**
   * Pertanyaan untuk ditanyakan kepada pengguna (1-4 pertanyaan)
   */
  questions: Array<{
    /**
     * Pertanyaan lengkap untuk ditanyakan kepada pengguna. Harus jelas, spesifik,
     * dan diakhiri dengan tanda tanya.
     */
    question: string;
    /**
     * Label sangat singkat ditampilkan sebagai chip/tag (maks 12 karakter).
     * Contoh: "Auth method", "Library", "Approach"
     */
    header: string;
    /**
     * Pilihan yang tersedia (2-4 opsi). Opsi "Other" disediakan
     * secara otomatis.
     */
    options: Array<{
      /**
       * Teks tampilan untuk opsi ini (1-5 kata)
       */
      label: string;
      /**
       * Penjelasan tentang apa yang dimaksud opsi ini
       */
      description: string;
    }>;
    /**
     * Atur ke true untuk memungkinkan beberapa pilihan
     */
    multiSelect: boolean;
  }>;
  /**
   * Jawaban pengguna diisi oleh sistem izin.
   * Memetakan teks pertanyaan ke label opsi yang dipilih.
   * Jawaban multi-pilih dipisahkan dengan koma.
   */
  answers?: Record<string, string>;
}
```

Menanyakan pertanyaan klarifikasi kepada pengguna selama eksekusi. Lihat [Menangani Alat AskUserQuestion](/docs/id/agent-sdk/permissions#handling-the-askuserquestion-tool) untuk detail penggunaan.

### Bash

**Nama alat:** `Bash`

```typescript
interface BashInput {
  /**
   * Perintah yang akan dieksekusi
   */
  command: string;
  /**
   * Timeout opsional dalam milidetik (maks 600000)
   */
  timeout?: number;
  /**
   * Deskripsi jelas dan ringkas tentang apa yang dilakukan perintah ini dalam 5-10 kata
   */
  description?: string;
  /**
   * Atur ke true untuk menjalankan perintah ini di latar belakang
   */
  run_in_background?: boolean;
}
```

Mengeksekusi perintah bash dalam sesi shell persisten dengan timeout opsional dan eksekusi latar belakang.

### BashOutput

**Nama alat:** `BashOutput`

```typescript
interface BashOutputInput {
  /**
   * ID shell latar belakang untuk mengambil output dari
   */
  bash_id: string;
  /**
   * Regex opsional untuk memfilter baris output
   */
  filter?: string;
}
```

Mengambil output dari shell bash latar belakang yang sedang berjalan atau selesai.

### Edit

**Nama alat:** `Edit`

```typescript
interface FileEditInput {
  /**
   * Path absolut ke file yang akan dimodifikasi
   */
  file_path: string;
  /**
   * Teks yang akan diganti
   */
  old_string: string;
  /**
   * Teks untuk menggantinya (harus berbeda dari old_string)
   */
  new_string: string;
  /**
   * Ganti semua kemunculan old_string (default false)
   */
  replace_all?: boolean;
}
```

Melakukan penggantian string yang tepat dalam file.

### Read

**Nama alat:** `Read`

```typescript
interface FileReadInput {
  /**
   * Path absolut ke file yang akan dibaca
   */
  file_path: string;
  /**
   * Nomor baris untuk mulai membaca dari
   */
  offset?: number;
  /**
   * Jumlah baris yang akan dibaca
   */
  limit?: number;
}
```

Membaca file dari filesystem lokal, termasuk teks, gambar, PDF, dan notebook Jupyter.

### Write

**Nama alat:** `Write`

```typescript
interface FileWriteInput {
  /**
   * Path absolut ke file yang akan ditulis
   */
  file_path: string;
  /**
   * Konten yang akan ditulis ke file
   */
  content: string;
}
```

Menulis file ke filesystem lokal, menimpa jika ada.

### Glob

**Nama alat:** `Glob`

```typescript
interface GlobInput {
  /**
   * Pola glob untuk mencocokkan file
   */
  pattern: string;
  /**
   * Direktori untuk dicari (default ke cwd)
   */
  path?: string;
}
```

Pencocokan pola file cepat yang bekerja dengan ukuran codebase apa pun.

### Grep

**Nama alat:** `Grep`

```typescript
interface GrepInput {
  /**
   * Pola ekspresi reguler untuk dicari
   */
  pattern: string;
  /**
   * File atau direktori untuk dicari (default ke cwd)
   */
  path?: string;
  /**
   * Pola glob untuk memfilter file (misalnya "*.js")
   */
  glob?: string;
  /**
   * Jenis file untuk dicari (misalnya "js", "py", "rust")
   */
  type?: string;
  /**
   * Mode output: "content", "files_with_matches", atau "count"
   */
  output_mode?: 'content' | 'files_with_matches' | 'count';
  /**
   * Pencarian tidak peka huruf besar-kecil
   */
  '-i'?: boolean;
  /**
   * Tampilkan nomor baris (untuk mode content)
   */
  '-n'?: boolean;
  /**
   * Baris untuk ditampilkan sebelum setiap kecocokan
   */
  '-B'?: number;
  /**
   * Baris untuk ditampilkan setelah setiap kecocokan
   */
  '-A'?: number;
  /**
   * Baris untuk ditampilkan sebelum dan sesudah setiap kecocokan
   */
  '-C'?: number;
  /**
   * Batasi output ke N baris/entri pertama
   */
  head_limit?: number;
  /**
   * Aktifkan mode multiline
   */
  multiline?: boolean;
}
```

Alat pencarian canggih yang dibangun di atas ripgrep dengan dukungan regex.

### KillBash

**Nama alat:** `KillBash`

```typescript
interface KillShellInput {
  /**
   * ID shell latar belakang yang akan dibunuh
   */
  shell_id: string;
}
```

Membunuh shell bash latar belakang yang sedang berjalan berdasarkan ID-nya.

### NotebookEdit

**Nama alat:** `NotebookEdit`

```typescript
interface NotebookEditInput {
  /**
   * Path absolut ke file notebook Jupyter
   */
  notebook_path: string;
  /**
   * ID sel yang akan diedit
   */
  cell_id?: string;
  /**
   * Sumber baru untuk sel
   */
  new_source: string;
  /**
   * Jenis sel (code atau markdown)
   */
  cell_type?: 'code' | 'markdown';
  /**
   * Jenis edit (replace, insert, delete)
   */
  edit_mode?: 'replace' | 'insert' | 'delete';
}
```

Mengedit sel dalam file notebook Jupyter.

### WebFetch

**Nama alat:** `WebFetch`

```typescript
interface WebFetchInput {
  /**
   * URL untuk mengambil konten dari
   */
  url: string;
  /**
   * Prompt untuk dijalankan pada konten yang diambil
   */
  prompt: string;
}
```

Mengambil konten dari URL dan memprosesnya dengan model AI.

### WebSearch

**Nama alat:** `WebSearch`

```typescript
interface WebSearchInput {
  /**
   * Kueri pencarian yang digunakan
   */
  query: string;
  /**
   * Hanya sertakan hasil dari domain ini
   */
  allowed_domains?: string[];
  /**
   * Jangan pernah sertakan hasil dari domain ini
   */
  blocked_domains?: string[];
}
```

Mencari web dan mengembalikan hasil yang diformat.

### TodoWrite

**Nama alat:** `TodoWrite`

```typescript
interface TodoWriteInput {
  /**
   * Daftar todo yang diperbarui
   */
  todos: Array<{
    /**
     * Deskripsi tugas
     */
    content: string;
    /**
     * Status tugas
     */
    status: 'pending' | 'in_progress' | 'completed';
    /**
     * Bentuk aktif dari deskripsi tugas
     */
    activeForm: string;
  }>;
}
```

Membuat dan mengelola daftar tugas terstruktur untuk melacak kemajuan.

### ExitPlanMode

**Nama alat:** `ExitPlanMode`

```typescript
interface ExitPlanModeInput {
  /**
   * Rencana yang akan dijalankan oleh pengguna untuk persetujuan
   */
  plan: string;
}
```

Keluar dari mode perencanaan dan meminta pengguna untuk menyetujui rencana.

### ListMcpResources

**Nama alat:** `ListMcpResources`

```typescript
interface ListMcpResourcesInput {
  /**
   * Nama server opsional untuk memfilter sumber daya
   */
  server?: string;
}
```

Mencantumkan sumber daya MCP yang tersedia dari server yang terhubung.

### ReadMcpResource

**Nama alat:** `ReadMcpResource`

```typescript
interface ReadMcpResourceInput {
  /**
   * Nama server MCP
   */
  server: string;
  /**
   * URI sumber daya MCP yang akan dibaca
   */
  uri: string;
}
```

Membaca sumber daya MCP tertentu dari server.

## Tipe Output Alat

Dokumentasi skema output untuk semua alat Claude Code bawaan. Tipe-tipe ini mewakili data respons aktual yang dikembalikan oleh setiap alat.

### `ToolOutput`

**Catatan:** Ini adalah tipe dokumentasi saja untuk kejelasan. Ini mewakili union dari semua tipe output alat.

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

**Nama alat:** `Task`

```typescript
interface TaskOutput {
  /**
   * Pesan hasil akhir dari subagen
   */
  result: string;
  /**
   * Statistik penggunaan token
   */
  usage?: {
    input_tokens: number;
    output_tokens: number;
    cache_creation_input_tokens?: number;
    cache_read_input_tokens?: number;
  };
  /**
   * Total biaya dalam USD
   */
  total_cost_usd?: number;
  /**
   * Durasi eksekusi dalam milidetik
   */
  duration_ms?: number;
}
```

Mengembalikan hasil akhir dari subagen setelah menyelesaikan tugas yang didelegasikan.

### AskUserQuestion

**Nama alat:** `AskUserQuestion`

```typescript
interface AskUserQuestionOutput {
  /**
   * Pertanyaan yang ditanyakan
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
   * Jawaban yang diberikan oleh pengguna.
   * Memetakan teks pertanyaan ke string jawaban.
   * Jawaban multi-pilih dipisahkan dengan koma.
   */
  answers: Record<string, string>;
}
```

Mengembalikan pertanyaan yang ditanyakan dan jawaban pengguna.

### Bash

**Nama alat:** `Bash`

```typescript
interface BashOutput {
  /**
   * Output stdout dan stderr gabungan
   */
  output: string;
  /**
   * Kode keluar perintah
   */
  exitCode: number;
  /**
   * Apakah perintah dibunuh karena timeout
   */
  killed?: boolean;
  /**
   * Shell ID untuk proses latar belakang
   */
  shellId?: string;
}
```

Mengembalikan output perintah dengan status keluar. Perintah latar belakang kembali segera dengan shellId.

### BashOutput

**Nama alat:** `BashOutput`

```typescript
interface BashOutputToolOutput {
  /**
   * Output baru sejak pemeriksaan terakhir
   */
  output: string;
  /**
   * Status shell saat ini
   */
  status: 'running' | 'completed' | 'failed';
  /**
   * Kode keluar (saat selesai)
   */
  exitCode?: number;
}
```

Mengembalikan output inkremental dari shell latar belakang.

### Edit

**Nama alat:** `Edit`

```typescript
interface EditOutput {
  /**
   * Pesan konfirmasi
   */
  message: string;
  /**
   * Jumlah penggantian yang dibuat
   */
  replacements: number;
  /**
   * Path file yang diedit
   */
  file_path: string;
}
```

Mengembalikan konfirmasi edit yang berhasil dengan jumlah penggantian.

### Baca

**Nama alat:** `Read`

```typescript
type ReadOutput = 
  | TextFileOutput
  | ImageFileOutput
  | PDFFileOutput
  | NotebookFileOutput;

interface TextFileOutput {
  /**
   * Isi file dengan nomor baris
   */
  content: string;
  /**
   * Jumlah total baris dalam file
   */
  total_lines: number;
  /**
   * Baris yang benar-benar dikembalikan
   */
  lines_returned: number;
}

interface ImageFileOutput {
  /**
   * Data gambar yang dikodekan Base64
   */
  image: string;
  /**
   * Tipe MIME gambar
   */
  mime_type: string;
  /**
   * Ukuran file dalam byte
   */
  file_size: number;
}

interface PDFFileOutput {
  /**
   * Array konten halaman
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
   * Jumlah total halaman
   */
  total_pages: number;
}

interface NotebookFileOutput {
  /**
   * Sel notebook Jupyter
   */
  cells: Array<{
    cell_type: 'code' | 'markdown';
    source: string;
    outputs?: any[];
    execution_count?: number;
  }>;
  /**
   * Metadata notebook
   */
  metadata?: Record<string, any>;
}
```

Mengembalikan isi file dalam format yang sesuai dengan jenis file.

### Tulis

**Nama alat:** `Write`

```typescript
interface WriteOutput {
  /**
   * Pesan kesuksesan
   */
  message: string;
  /**
   * Jumlah byte yang ditulis
   */
  bytes_written: number;
  /**
   * Jalur file yang ditulis
   */
  file_path: string;
}
```

Mengembalikan konfirmasi setelah berhasil menulis file.

### Glob

**Nama alat:** `Glob`

```typescript
interface GlobOutput {
  /**
   * Array jalur file yang cocok
   */
  matches: string[];
  /**
   * Jumlah kecocokan yang ditemukan
   */
  count: number;
  /**
   * Direktori pencarian yang digunakan
   */
  search_path: string;
}
```

Mengembalikan jalur file yang cocok dengan pola glob, diurutkan berdasarkan waktu modifikasi.

### Grep

**Nama alat:** `Grep`

```typescript
type GrepOutput = 
  | GrepContentOutput
  | GrepFilesOutput
  | GrepCountOutput;

interface GrepContentOutput {
  /**
   * Baris yang cocok dengan konteks
   */
  matches: Array<{
    file: string;
    line_number?: number;
    line: string;
    before_context?: string[];
    after_context?: string[];
  }>;
  /**
   * Jumlah total kecocokan
   */
  total_matches: number;
}

interface GrepFilesOutput {
  /**
   * File yang berisi kecocokan
   */
  files: string[];
  /**
   * Jumlah file dengan kecocokan
   */
  count: number;
}

interface GrepCountOutput {
  /**
   * Hitungan kecocokan per file
   */
  counts: Array<{
    file: string;
    count: number;
  }>;
  /**
   * Total kecocokan di semua file
   */
  total: number;
}
```

Mengembalikan hasil pencarian dalam format yang ditentukan oleh output_mode.

### KillBash

**Nama alat:** `KillBash`

```typescript
interface KillBashOutput {
  /**
   * Pesan kesuksesan
   */
  message: string;
  /**
   * ID shell yang dibunuh
   */
  shell_id: string;
}
```

Mengembalikan konfirmasi setelah menghentikan shell latar belakang.

### NotebookEdit

**Nama alat:** `NotebookEdit`

```typescript
interface NotebookEditOutput {
  /**
   * Pesan kesuksesan
   */
  message: string;
  /**
   * Jenis edit yang dilakukan
   */
  edit_type: 'replaced' | 'inserted' | 'deleted';
  /**
   * ID sel yang terpengaruh
   */
  cell_id?: string;
  /**
   * Total sel dalam notebook setelah edit
   */
  total_cells: number;
}
```

Mengembalikan konfirmasi setelah memodifikasi notebook Jupyter.

### WebFetch

**Nama alat:** `WebFetch`

```typescript
interface WebFetchOutput {
  /**
   * Respons model AI terhadap prompt
   */
  response: string;
  /**
   * URL yang diambil
   */
  url: string;
  /**
   * URL akhir setelah pengalihan
   */
  final_url?: string;
  /**
   * Kode status HTTP
   */
  status_code?: number;
}
```

Mengembalikan analisis AI terhadap konten web yang diambil.

### WebSearch

**Nama alat:** `WebSearch`

```typescript
interface WebSearchOutput {
  /**
   * Hasil pencarian
   */
  results: Array<{
    title: string;
    url: string;
    snippet: string;
    /**
     * Metadata tambahan jika tersedia
     */
    metadata?: Record<string, any>;
  }>;
  /**
   * Jumlah total hasil
   */
  total_results: number;
  /**
   * Query yang dicari
   */
  query: string;
}
```

Mengembalikan hasil pencarian web yang diformat.

### TodoWrite

**Nama alat:** `TodoWrite`

```typescript
interface TodoWriteOutput {
  /**
   * Pesan kesuksesan
   */
  message: string;
  /**
   * Statistik todo saat ini
   */
  stats: {
    total: number;
    pending: number;
    in_progress: number;
    completed: number;
  };
}
```

Mengembalikan konfirmasi dengan statistik tugas saat ini.

### ExitPlanMode

**Nama alat:** `ExitPlanMode`

```typescript
interface ExitPlanModeOutput {
  /**
   * Pesan konfirmasi
   */
  message: string;
  /**
   * Apakah pengguna menyetujui rencana
   */
  approved?: boolean;
}
```

Mengembalikan konfirmasi setelah keluar dari mode rencana.

### ListMcpResources

**Nama alat:** `ListMcpResources`

```typescript
interface ListMcpResourcesOutput {
  /**
   * Sumber daya yang tersedia
   */
  resources: Array<{
    uri: string;
    name: string;
    description?: string;
    mimeType?: string;
    server: string;
  }>;
  /**
   * Jumlah total sumber daya
   */
  total: number;
}
```

Mengembalikan daftar sumber daya MCP yang tersedia.

### ReadMcpResource

**Nama alat:** `ReadMcpResource`

```typescript
interface ReadMcpResourceOutput {
  /**
   * Isi sumber daya
   */
  contents: Array<{
    uri: string;
    mimeType?: string;
    text?: string;
    blob?: string;
  }>;
  /**
   * Server yang menyediakan sumber daya
   */
  server: string;
}
```

Mengembalikan isi sumber daya MCP yang diminta.

## Jenis Izin

### `PermissionUpdate`

Operasi untuk memperbarui izin.

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
  | 'userSettings'     // Pengaturan pengguna global
  | 'projectSettings'  // Pengaturan proyek per-direktori
  | 'localSettings'    // Pengaturan lokal yang diabaikan git
  | 'session'          // Hanya sesi saat ini
```

### `PermissionRuleValue`

```typescript
type PermissionRuleValue = {
  toolName: string;
  ruleContent?: string;
}
```

## Jenis Lainnya

### `ApiKeySource`

```typescript
type ApiKeySource = 'user' | 'project' | 'org' | 'temporary';
```

### `SdkBeta`

Fitur beta yang tersedia yang dapat diaktifkan melalui opsi `betas`. Lihat [header Beta](/docs/id/api/beta-headers) untuk informasi lebih lanjut.

```typescript
type SdkBeta = 'context-1m-2025-08-07';
```

| Nilai | Deskripsi | Model Kompatibel |
|:------|:----------|:-----------------|
| `'context-1m-2025-08-07'` | Mengaktifkan [jendela konteks](/docs/id/build-with-claude/context-windows) 1 juta token | Claude Sonnet 4, Claude Sonnet 4.5 |

### `SlashCommand`

Informasi tentang perintah slash yang tersedia.

```typescript
type SlashCommand = {
  name: string;
  description: string;
  argumentHint: string;
}
```

### `ModelInfo`

Informasi tentang model yang tersedia.

```typescript
type ModelInfo = {
  value: string;
  displayName: string;
  description: string;
}
```

### `McpServerStatus`

Status server MCP yang terhubung.

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

Informasi akun untuk pengguna yang terautentikasi.

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

Statistik penggunaan per-model yang dikembalikan dalam pesan hasil.

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

Versi [`Usage`](#usage) dengan semua field yang dapat null dibuat non-nullable.

```typescript
type NonNullableUsage = {
  [K in keyof Usage]: NonNullable<Usage[K]>;
}
```

### `Usage`

Statistik penggunaan token (dari `@anthropic-ai/sdk`).

```typescript
type Usage = {
  input_tokens: number | null;
  output_tokens: number | null;
  cache_creation_input_tokens?: number | null;
  cache_read_input_tokens?: number | null;
}
```

### `CallToolResult`

Jenis hasil alat MCP (dari `@modelcontextprotocol/sdk/types.js`).

```typescript
type CallToolResult = {
  content: Array<{
    type: 'text' | 'image' | 'resource';
    // Field tambahan bervariasi berdasarkan jenis
  }>;
  isError?: boolean;
}
```

### `AbortError`

Kelas error khusus untuk operasi abort.

```typescript
class AbortError extends Error {}
```

## Konfigurasi Sandbox

### `SandboxSettings`

Konfigurasi untuk perilaku sandbox. Gunakan ini untuk mengaktifkan sandboxing perintah dan mengonfigurasi pembatasan jaringan secara terprogram.

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

| Properti | Tipe | Default | Deskripsi |
| :------- | :--- | :------ | :---------- |
| `enabled` | `boolean` | `false` | Aktifkan mode sandbox untuk eksekusi perintah |
| `autoAllowBashIfSandboxed` | `boolean` | `false` | Setujui otomatis perintah bash ketika sandbox diaktifkan |
| `excludedCommands` | `string[]` | `[]` | Perintah yang selalu melewati pembatasan sandbox (misalnya, `['docker']`). Ini berjalan tanpa sandbox secara otomatis tanpa keterlibatan model |
| `allowUnsandboxedCommands` | `boolean` | `false` | Izinkan model untuk meminta menjalankan perintah di luar sandbox. Ketika `true`, model dapat mengatur `dangerouslyDisableSandbox` dalam input alat, yang kembali ke [sistem izin](#permissions-fallback-for-unsandboxed-commands) |
| `network` | [`NetworkSandboxSettings`](#networksandboxsettings) | `undefined` | Konfigurasi sandbox khusus jaringan |
| `ignoreViolations` | [`SandboxIgnoreViolations`](#sandboxignoreviolations) | `undefined` | Konfigurasi pelanggaran sandbox mana yang akan diabaikan |
| `enableWeakerNestedSandbox` | `boolean` | `false` | Aktifkan sandbox bersarang yang lebih lemah untuk kompatibilitas |

<Note>
**Pembatasan akses filesystem dan jaringan** TIDAK dikonfigurasi melalui pengaturan sandbox. Sebaliknya, mereka berasal dari [aturan izin](https://code.claude.com/docs/id/settings#permission-settings):

- **Pembatasan baca filesystem**: Aturan deny baca
- **Pembatasan tulis filesystem**: Aturan allow/deny edit
- **Pembatasan jaringan**: Aturan allow/deny WebFetch

Gunakan pengaturan sandbox untuk sandboxing eksekusi perintah, dan aturan izin untuk kontrol akses filesystem dan jaringan.
</Note>

#### Contoh penggunaan

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

Konfigurasi khusus jaringan untuk mode sandbox.

```typescript
type NetworkSandboxSettings = {
  allowLocalBinding?: boolean;
  allowUnixSockets?: string[];
  allowAllUnixSockets?: boolean;
  httpProxyPort?: number;
  socksProxyPort?: number;
}
```

| Properti | Tipe | Default | Deskripsi |
| :------- | :--- | :------ | :---------- |
| `allowLocalBinding` | `boolean` | `false` | Izinkan proses untuk mengikat ke port lokal (misalnya, untuk server dev) |
| `allowUnixSockets` | `string[]` | `[]` | Jalur soket Unix yang dapat diakses oleh proses (misalnya, soket Docker) |
| `allowAllUnixSockets` | `boolean` | `false` | Izinkan akses ke semua soket Unix |
| `httpProxyPort` | `number` | `undefined` | Port proxy HTTP untuk permintaan jaringan |
| `socksProxyPort` | `number` | `undefined` | Port proxy SOCKS untuk permintaan jaringan |

### `SandboxIgnoreViolations`

Konfigurasi untuk mengabaikan pelanggaran sandbox tertentu.

```typescript
type SandboxIgnoreViolations = {
  file?: string[];
  network?: string[];
}
```

| Properti | Tipe | Default | Deskripsi |
| :------- | :--- | :------ | :---------- |
| `file` | `string[]` | `[]` | Pola jalur file untuk mengabaikan pelanggaran |
| `network` | `string[]` | `[]` | Pola jaringan untuk mengabaikan pelanggaran |

### Fallback Izin untuk Perintah Tanpa Sandbox

Ketika `allowUnsandboxedCommands` diaktifkan, model dapat meminta untuk menjalankan perintah di luar sandbox dengan mengatur `dangerouslyDisableSandbox: true` dalam input alat. Permintaan ini kembali ke sistem izin yang ada, artinya handler `canUseTool` Anda akan dipanggil, memungkinkan Anda untuk mengimplementasikan logika otorisasi khusus.

<Note>
**`excludedCommands` vs `allowUnsandboxedCommands`:**
- `excludedCommands`: Daftar statis perintah yang selalu melewati sandbox secara otomatis (misalnya, `['docker']`). Model tidak memiliki kontrol atas ini.
- `allowUnsandboxedCommands`: Memungkinkan model untuk memutuskan pada waktu runtime apakah akan meminta eksekusi tanpa sandbox dengan mengatur `dangerouslyDisableSandbox: true` dalam input alat.
</Note>

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

const result = await query({
  prompt: "Deploy my application",
  options: {
    sandbox: {
      enabled: true,
      allowUnsandboxedCommands: true  // Model dapat meminta eksekusi tanpa sandbox
    },
    permissionMode: "default",
    canUseTool: async (tool, input) => {
      // Periksa apakah model meminta untuk melewati sandbox
      if (tool === "Bash" && input.dangerouslyDisableSandbox) {
        // Model ingin menjalankan perintah ini di luar sandbox
        console.log(`Unsandboxed command requested: ${input.command}`);

        // Kembalikan true untuk mengizinkan, false untuk menolak
        return isCommandAuthorized(input.command);
      }
      return true;
    }
  }
});
```

Pola ini memungkinkan Anda untuk:

- **Audit permintaan model**: Catat ketika model meminta eksekusi tanpa sandbox
- **Implementasikan allowlist**: Hanya izinkan perintah tertentu untuk berjalan tanpa sandbox
- **Tambahkan alur persetujuan**: Memerlukan otorisasi eksplisit untuk operasi istimewa

<Warning>
Perintah yang berjalan dengan `dangerouslyDisableSandbox: true` memiliki akses sistem penuh. Pastikan handler `canUseTool` Anda memvalidasi permintaan ini dengan hati-hati.
</Warning>

## Lihat juga

- [Ringkasan SDK](/docs/id/agent-sdk/overview) - Konsep SDK umum
- [Referensi SDK Python](/docs/id/agent-sdk/python) - Dokumentasi SDK Python
- [Referensi CLI](https://code.claude.com/docs/id/cli-reference) - Antarmuka baris perintah
- [Alur kerja umum](https://code.claude.com/docs/id/common-workflows) - Panduan langkah demi langkah