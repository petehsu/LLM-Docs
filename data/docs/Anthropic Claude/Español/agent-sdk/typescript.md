# Referencia del SDK de Agent - TypeScript

Referencia completa de la API del SDK de Agent de TypeScript, incluyendo todas las funciones, tipos e interfaces.

---

<script src="/components/typescript-sdk-type-links.js" defer />

<Note>
**Prueba la nueva interfaz V2 (vista previa):** Una interfaz simplificada con patrones `send()` y `receive()` está disponible ahora, haciendo que las conversaciones multi-turno sean más fáciles. [Aprende más](/docs/es/agent-sdk/typescript-v2-preview)
</Note>

## Instalación

```bash
npm install @anthropic-ai/claude-agent-sdk
```

## Funciones

### `query()`

La función principal para interactuar con Claude Code. Crea un generador asincrónico que transmite mensajes a medida que llegan.

```typescript
function query({
  prompt,
  options
}: {
  prompt: string | AsyncIterable<SDKUserMessage>;
  options?: Options;
}): Query
```

#### Parámetros

| Parámetro | Tipo | Descripción |
| :-------- | :--- | :---------- |
| `prompt` | `string \| AsyncIterable<`[`SDKUserMessage`](#sdkusermessage)`>` | El mensaje de entrada como una cadena o iterable asincrónico para modo de transmisión |
| `options` | [`Options`](#options) | Objeto de configuración opcional (ver tipo Options a continuación) |

#### Retorna

Retorna un objeto [`Query`](#query-1) que extiende `AsyncGenerator<`[`SDKMessage`](#sdkmessage)`, void>` con métodos adicionales.

### `tool()`

Crea una definición de herramienta MCP segura de tipos para usar con servidores MCP del SDK.

```typescript
function tool<Schema extends ZodRawShape>(
  name: string,
  description: string,
  inputSchema: Schema,
  handler: (args: z.infer<ZodObject<Schema>>, extra: unknown) => Promise<CallToolResult>
): SdkMcpToolDefinition<Schema>
```

#### Parámetros

| Parámetro | Tipo | Descripción |
| :-------- | :--- | :---------- |
| `name` | `string` | El nombre de la herramienta |
| `description` | `string` | Una descripción de lo que hace la herramienta |
| `inputSchema` | `Schema extends ZodRawShape` | Esquema Zod que define los parámetros de entrada de la herramienta |
| `handler` | `(args, extra) => Promise<`[`CallToolResult`](#calltoolresult)`>` | Función asincrónica que ejecuta la lógica de la herramienta |

### `createSdkMcpServer()`

Crea una instancia de servidor MCP que se ejecuta en el mismo proceso que tu aplicación.

```typescript
function createSdkMcpServer(options: {
  name: string;
  version?: string;
  tools?: Array<SdkMcpToolDefinition<any>>;
}): McpSdkServerConfigWithInstance
```

#### Parámetros

| Parámetro | Tipo | Descripción |
| :-------- | :--- | :---------- |
| `options.name` | `string` | El nombre del servidor MCP |
| `options.version` | `string` | Cadena de versión opcional |
| `options.tools` | `Array<SdkMcpToolDefinition>` | Matriz de definiciones de herramientas creadas con [`tool()`](#tool) |

## Tipos

### `Options`

Objeto de configuración para la función `query()`.

| Propiedad | Tipo | Predeterminado | Descripción |
| :------- | :--- | :------ | :---------- |
| `abortController` | `AbortController` | `new AbortController()` | Controlador para cancelar operaciones |
| `additionalDirectories` | `string[]` | `[]` | Directorios adicionales a los que Claude puede acceder |
| `agents` | `Record<string, [`AgentDefinition`](#agentdefinition)>` | `undefined` | Definir subagentes programáticamente |
| `allowDangerouslySkipPermissions` | `boolean` | `false` | Habilitar omisión de permisos. Requerido cuando se usa `permissionMode: 'bypassPermissions'` |
| `allowedTools` | `string[]` | Todas las herramientas | Lista de nombres de herramientas permitidas |
| `betas` | [`SdkBeta`](#sdkbeta)`[]` | `[]` | Habilitar características beta (por ejemplo, `['context-1m-2025-08-07']`) |
| `canUseTool` | [`CanUseTool`](#canusetool) | `undefined` | Función de permiso personalizada para uso de herramientas |
| `continue` | `boolean` | `false` | Continuar la conversación más reciente |
| `cwd` | `string` | `process.cwd()` | Directorio de trabajo actual |
| `disallowedTools` | `string[]` | `[]` | Lista de nombres de herramientas no permitidas |
| `env` | `Dict<string>` | `process.env` | Variables de entorno |
| `executable` | `'bun' \| 'deno' \| 'node'` | Detectado automáticamente | Tiempo de ejecución de JavaScript a usar |
| `executableArgs` | `string[]` | `[]` | Argumentos a pasar al ejecutable |
| `extraArgs` | `Record<string, string \| null>` | `{}` | Argumentos adicionales |
| `fallbackModel` | `string` | `undefined` | Modelo a usar si el principal falla |
| `forkSession` | `boolean` | `false` | Al reanudar con `resume`, bifurcar a un nuevo ID de sesión en lugar de continuar la sesión original |
| `hooks` | `Partial<Record<`[`HookEvent`](#hookevent)`, `[`HookCallbackMatcher`](#hookcallbackmatcher)`[]>>` | `{}` | Devoluciones de llamada de gancho para eventos |
| `includePartialMessages` | `boolean` | `false` | Incluir eventos de mensajes parciales |
| `maxBudgetUsd` | `number` | `undefined` | Presupuesto máximo en USD para la consulta |
| `maxThinkingTokens` | `number` | `undefined` | Tokens máximos para el proceso de pensamiento |
| `maxTurns` | `number` | `undefined` | Turnos de conversación máximos |
| `mcpServers` | `Record<string, [`McpServerConfig`](#mcpserverconfig)>` | `{}` | Configuraciones de servidor MCP |
| `model` | `string` | Predeterminado de CLI | Modelo Claude a usar |
| `outputFormat` | `{ type: 'json_schema', schema: JSONSchema }` | `undefined` | Definir formato de salida para resultados del agente. Ver [Salidas estructuradas](/docs/es/agent-sdk/structured-outputs) para detalles |
| `pathToClaudeCodeExecutable` | `string` | Usa ejecutable integrado | Ruta al ejecutable de Claude Code |
| `permissionMode` | [`PermissionMode`](#permissionmode) | `'default'` | Modo de permiso para la sesión |
| `permissionPromptToolName` | `string` | `undefined` | Nombre de herramienta MCP para solicitudes de permiso |
| `plugins` | [`SdkPluginConfig`](#sdkpluginconfig)`[]` | `[]` | Cargar complementos personalizados desde rutas locales. Ver [Complementos](/docs/es/agent-sdk/plugins) para detalles |
| `resume` | `string` | `undefined` | ID de sesión a reanudar |
| `resumeSessionAt` | `string` | `undefined` | Reanudar sesión en un UUID de mensaje específico |
| `sandbox` | [`SandboxSettings`](#sandboxsettings) | `undefined` | Configurar comportamiento de sandbox programáticamente. Ver [Configuración de sandbox](#sandboxsettings) para detalles |
| `settingSources` | [`SettingSource`](#settingsource)`[]` | `[]` (sin configuración) | Controlar qué configuraciones del sistema de archivos cargar. Cuando se omite, no se carga ninguna configuración. **Nota:** Debe incluir `'project'` para cargar archivos CLAUDE.md |
| `stderr` | `(data: string) => void` | `undefined` | Devolución de llamada para salida de stderr |
| `strictMcpConfig` | `boolean` | `false` | Aplicar validación MCP estricta |
| `systemPrompt` | `string \| { type: 'preset'; preset: 'claude_code'; append?: string }` | `undefined` (mensaje vacío) | Configuración de mensaje del sistema. Pasar una cadena para mensaje personalizado, o `{ type: 'preset', preset: 'claude_code' }` para usar el mensaje del sistema de Claude Code. Cuando se usa la forma de objeto predeterminado, agregar `append` para extender el mensaje del sistema con instrucciones adicionales |
| `tools` | `string[] \| { type: 'preset'; preset: 'claude_code' }` | `undefined` | Configuración de herramientas. Pasar una matriz de nombres de herramientas o usar el predeterminado para obtener las herramientas predeterminadas de Claude Code |

### `Query`

Interfaz retornada por la función `query()`.

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

#### Métodos

| Método | Descripción |
| :----- | :---------- |
| `interrupt()` | Interrumpe la consulta (solo disponible en modo de entrada de transmisión) |
| `setPermissionMode()` | Cambia el modo de permiso (solo disponible en modo de entrada de transmisión) |
| `setModel()` | Cambia el modelo (solo disponible en modo de entrada de transmisión) |
| `setMaxThinkingTokens()` | Cambia los tokens de pensamiento máximos (solo disponible en modo de entrada de transmisión) |
| `supportedCommands()` | Retorna comandos de barra diagonal disponibles |
| `supportedModels()` | Retorna modelos disponibles con información de visualización |
| `mcpServerStatus()` | Retorna estado de servidores MCP conectados |
| `accountInfo()` | Retorna información de cuenta |

### `AgentDefinition`

Configuración para un subagente definido programáticamente.

```typescript
type AgentDefinition = {
  description: string;
  tools?: string[];
  prompt: string;
  model?: 'sonnet' | 'opus' | 'haiku' | 'inherit';
}
```

| Campo | Requerido | Descripción |
|:------|:---------|:------------|
| `description` | Sí | Descripción en lenguaje natural de cuándo usar este agente |
| `tools` | No | Matriz de nombres de herramientas permitidas. Si se omite, hereda todas las herramientas |
| `prompt` | Sí | El mensaje del sistema del agente |
| `model` | No | Anulación de modelo para este agente. Si se omite, usa el modelo principal |

### `SettingSource`

Controla qué fuentes de configuración basadas en el sistema de archivos carga el SDK.

```typescript
type SettingSource = 'user' | 'project' | 'local';
```

| Valor | Descripción | Ubicación |
|:------|:------------|:---------|
| `'user'` | Configuración global del usuario | `~/.claude/settings.json` |
| `'project'` | Configuración de proyecto compartida (controlada por versión) | `.claude/settings.json` |
| `'local'` | Configuración de proyecto local (ignorada por git) | `.claude/settings.local.json` |

#### Comportamiento predeterminado

Cuando `settingSources` está **omitido** o **indefinido**, el SDK **no** carga ninguna configuración del sistema de archivos. Esto proporciona aislamiento para aplicaciones SDK.

#### ¿Por qué usar settingSources?

**Cargar todas las configuraciones del sistema de archivos (comportamiento heredado):**
```typescript
// Cargar todas las configuraciones como lo hizo SDK v0.0.x
const result = query({
  prompt: "Analiza este código",
  options: {
    settingSources: ['user', 'project', 'local']  // Cargar todas las configuraciones
  }
});
```

**Cargar solo fuentes de configuración específicas:**
```typescript
// Cargar solo configuraciones de proyecto, ignorar usuario y local
const result = query({
  prompt: "Ejecutar verificaciones de CI",
  options: {
    settingSources: ['project']  // Solo .claude/settings.json
  }
});
```

**Entornos de prueba y CI:**
```typescript
// Asegurar comportamiento consistente en CI excluyendo configuraciones locales
const result = query({
  prompt: "Ejecutar pruebas",
  options: {
    settingSources: ['project'],  // Solo configuraciones compartidas del equipo
    permissionMode: 'bypassPermissions'
  }
});
```

**Aplicaciones solo SDK:**
```typescript
// Definir todo programáticamente (comportamiento predeterminado)
// Sin dependencias del sistema de archivos - settingSources predeterminado a []
const result = query({
  prompt: "Revisar este PR",
  options: {
    // settingSources: [] es el predeterminado, no es necesario especificar
    agents: { /* ... */ },
    mcpServers: { /* ... */ },
    allowedTools: ['Read', 'Grep', 'Glob']
  }
});
```

**Cargando instrucciones de proyecto CLAUDE.md:**
```typescript
// Cargar configuraciones de proyecto para incluir archivos CLAUDE.md
const result = query({
  prompt: "Agregar una nueva característica siguiendo convenciones de proyecto",
  options: {
    systemPrompt: {
      type: 'preset',
      preset: 'claude_code'  // Requerido para usar CLAUDE.md
    },
    settingSources: ['project'],  // Carga CLAUDE.md del directorio de proyecto
    allowedTools: ['Read', 'Write', 'Edit']
  }
});
```

#### Precedencia de configuraciones

Cuando se cargan múltiples fuentes, las configuraciones se fusionan con esta precedencia (mayor a menor):
1. Configuraciones locales (`.claude/settings.local.json`)
2. Configuraciones de proyecto (`.claude/settings.json`)
3. Configuraciones de usuario (`~/.claude/settings.json`)

Las opciones programáticas (como `agents`, `allowedTools`) siempre anulan las configuraciones del sistema de archivos.

### `PermissionMode`

```typescript
type PermissionMode =
  | 'default'           // Comportamiento de permiso estándar
  | 'acceptEdits'       // Aceptar automáticamente ediciones de archivo
  | 'bypassPermissions' // Omitir todas las verificaciones de permiso
  | 'plan'              // Modo de planificación - sin ejecución
```

### `CanUseTool`

Tipo de función de permiso personalizado para controlar el uso de herramientas.

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

Resultado de una verificación de permiso.

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

Configuración para servidores MCP.

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

Configuración para cargar complementos en el SDK.

```typescript
type SdkPluginConfig = {
  type: 'local';
  path: string;
}
```

| Campo | Tipo | Descripción |
|:------|:-----|:------------|
| `type` | `'local'` | Debe ser `'local'` (solo complementos locales actualmente soportados) |
| `path` | `string` | Ruta absoluta o relativa al directorio del complemento |

**Ejemplo:**
```typescript
plugins: [
  { type: 'local', path: './my-plugin' },
  { type: 'local', path: '/absolute/path/to/plugin' }
]
```

Para información completa sobre crear y usar complementos, ver [Complementos](/docs/es/agent-sdk/plugins).

## Tipos de Mensaje

### `SDKMessage`

Tipo de unión de todos los mensajes posibles retornados por la consulta.

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

Mensaje de respuesta del asistente.

```typescript
type SDKAssistantMessage = {
  type: 'assistant';
  uuid: UUID;
  session_id: string;
  message: APIAssistantMessage; // Del SDK de Anthropic
  parent_tool_use_id: string | null;
}
```

### `SDKUserMessage`

Mensaje de entrada del usuario.

```typescript
type SDKUserMessage = {
  type: 'user';
  uuid?: UUID;
  session_id: string;
  message: APIUserMessage; // Del SDK de Anthropic
  parent_tool_use_id: string | null;
}
```

### `SDKUserMessageReplay`

Mensaje de usuario reproducido con UUID requerido.

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

Mensaje de resultado final.

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

Mensaje de inicialización del sistema.

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

Mensaje parcial de transmisión (solo cuando `includePartialMessages` es verdadero).

```typescript
type SDKPartialAssistantMessage = {
  type: 'stream_event';
  event: RawMessageStreamEvent; // Del SDK de Anthropic
  parent_tool_use_id: string | null;
  uuid: UUID;
  session_id: string;
}
```

### `SDKCompactBoundaryMessage`

Mensaje que indica un límite de compactación de conversación.

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

Información sobre un uso de herramienta denegado.

```typescript
type SDKPermissionDenial = {
  tool_name: string;
  tool_use_id: string;
  tool_input: ToolInput;
}
```

## Tipos de Gancho

Para una guía completa sobre el uso de ganchos con ejemplos y patrones comunes, ver la [guía de Ganchos](/docs/es/agent-sdk/hooks).

### `HookEvent`

Eventos de gancho disponibles.

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

Tipo de función de devolución de llamada de gancho.

```typescript
type HookCallback = (
  input: HookInput, // Unión de todos los tipos de entrada de gancho
  toolUseID: string | undefined,
  options: { signal: AbortSignal }
) => Promise<HookJSONOutput>;
```

### `HookCallbackMatcher`

Configuración de gancho con coincidencia opcional.

```typescript
interface HookCallbackMatcher {
  matcher?: string;
  hooks: HookCallback[];
}
```

### `HookInput`

Tipo de unión de todos los tipos de entrada de gancho.

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

Interfaz base que todos los tipos de entrada de gancho extienden.

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
  reason: ExitReason;  // Cadena del array EXIT_REASONS
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

Valor de retorno del gancho.

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

## Tipos de Entrada de Herramienta

Documentación de esquemas de entrada para todas las herramientas integradas de Claude Code. Estos tipos se exportan desde `@anthropic-ai/claude-agent-sdk` y se pueden usar para interacciones de herramientas seguras de tipos.

### `ToolInput`

**Nota:** Este es un tipo de solo documentación para claridad. Representa la unión de todos los tipos de entrada de herramienta.

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

**Nombre de herramienta:** `Task`

```typescript
interface AgentInput {
  /**
   * Una descripción breve (3-5 palabras) de la tarea
   */
  description: string;
  /**
   * La tarea para que el agente realice
   */
  prompt: string;
  /**
   * El tipo de agente especializado a usar para esta tarea
   */
  subagent_type: string;
}
```

Lanza un nuevo agente para manejar tareas complejas y multi-paso de forma autónoma.

### AskUserQuestion

**Nombre de herramienta:** `AskUserQuestion`

```typescript
interface AskUserQuestionInput {
  /**
   * Preguntas a hacer al usuario (1-4 preguntas)
   */
  questions: Array<{
    /**
     * La pregunta completa a hacer al usuario. Debe ser clara, específica,
     * y terminar con un signo de interrogación.
     */
    question: string;
    /**
     * Etiqueta muy breve mostrada como chip/etiqueta (máx 12 caracteres).
     * Ejemplos: "Método de autenticación", "Biblioteca", "Enfoque"
     */
    header: string;
    /**
     * Las opciones disponibles (2-4 opciones). Una opción "Otro" es
     * proporcionada automáticamente.
     */
    options: Array<{
      /**
       * Texto de visualización para esta opción (1-5 palabras)
       */
      label: string;
      /**
       * Explicación de lo que significa esta opción
       */
      description: string;
    }>;
    /**
     * Establecer en verdadero para permitir selecciones múltiples
     */
    multiSelect: boolean;
  }>;
  /**
   * Respuestas del usuario completadas por el sistema de permisos.
   * Mapea texto de pregunta a etiqueta(s) de opción seleccionada.
   * Las respuestas de selección múltiple están separadas por comas.
   */
  answers?: Record<string, string>;
}
```

Hace preguntas aclaratorias al usuario durante la ejecución. Ver [Manejo de la herramienta AskUserQuestion](/docs/es/agent-sdk/permissions#handling-the-askuserquestion-tool) para detalles de uso.

### Bash

**Nombre de herramienta:** `Bash`

```typescript
interface BashInput {
  /**
   * El comando a ejecutar
   */
  command: string;
  /**
   * Tiempo de espera opcional en milisegundos (máx 600000)
   */
  timeout?: number;
  /**
   * Descripción clara y concisa de lo que hace este comando en 5-10 palabras
   */
  description?: string;
  /**
   * Establecer en verdadero para ejecutar este comando en segundo plano
   */
  run_in_background?: boolean;
}
```

Ejecuta comandos bash en una sesión de shell persistente con tiempo de espera opcional y ejecución en segundo plano.

### BashOutput

**Nombre de herramienta:** `BashOutput`

```typescript
interface BashOutputInput {
  /**
   * El ID del shell en segundo plano del que recuperar salida
   */
  bash_id: string;
  /**
   * Expresión regular opcional para filtrar líneas de salida
   */
  filter?: string;
}
```

Recupera salida de un shell bash en segundo plano en ejecución o completado.

### Edit

**Nombre de herramienta:** `Edit`

```typescript
interface FileEditInput {
  /**
   * La ruta absoluta al archivo a modificar
   */
  file_path: string;
  /**
   * El texto a reemplazar
   */
  old_string: string;
  /**
   * El texto para reemplazarlo (debe ser diferente de old_string)
   */
  new_string: string;
  /**
   * Reemplazar todas las ocurrencias de old_string (predeterminado falso)
   */
  replace_all?: boolean;
}
```

Realiza reemplazos de cadena exactos en archivos.

### Read

**Nombre de herramienta:** `Read`

```typescript
interface FileReadInput {
  /**
   * La ruta absoluta al archivo a leer
   */
  file_path: string;
  /**
   * El número de línea desde donde comenzar a leer
   */
  offset?: number;
  /**
   * El número de líneas a leer
   */
  limit?: number;
}
```

Lee archivos del sistema de archivos local, incluyendo texto, imágenes, PDFs y cuadernos Jupyter.

### Write

**Nombre de herramienta:** `Write`

```typescript
interface FileWriteInput {
  /**
   * La ruta absoluta al archivo a escribir
   */
  file_path: string;
  /**
   * El contenido a escribir en el archivo
   */
  content: string;
}
```

Escribe un archivo en el sistema de archivos local, sobrescribiendo si existe.

### Glob

**Nombre de herramienta:** `Glob`

```typescript
interface GlobInput {
  /**
   * El patrón glob para coincidir archivos
   */
  pattern: string;
  /**
   * El directorio a buscar (predeterminado a cwd)
   */
  path?: string;
}
```

Coincidencia de patrón de archivo rápida que funciona con cualquier tamaño de base de código.

### Grep

**Nombre de herramienta:** `Grep`

```typescript
interface GrepInput {
  /**
   * El patrón de expresión regular a buscar
   */
  pattern: string;
  /**
   * Archivo o directorio a buscar (predeterminado a cwd)
   */
  path?: string;
  /**
   * Patrón glob para filtrar archivos (por ejemplo "*.js")
   */
  glob?: string;
  /**
   * Tipo de archivo a buscar (por ejemplo "js", "py", "rust")
   */
  type?: string;
  /**
   * Modo de salida: "content", "files_with_matches", o "count"
   */
  output_mode?: 'content' | 'files_with_matches' | 'count';
  /**
   * Búsqueda insensible a mayúsculas
   */
  '-i'?: boolean;
  /**
   * Mostrar números de línea (para modo de contenido)
   */
  '-n'?: boolean;
  /**
   * Líneas a mostrar antes de cada coincidencia
   */
  '-B'?: number;
  /**
   * Líneas a mostrar después de cada coincidencia
   */
  '-A'?: number;
  /**
   * Líneas a mostrar antes y después de cada coincidencia
   */
  '-C'?: number;
  /**
   * Limitar salida a las primeras N líneas/entradas
   */
  head_limit?: number;
  /**
   * Habilitar modo multilínea
   */
  multiline?: boolean;
}
```

Herramienta de búsqueda poderosa construida en ripgrep con soporte de expresiones regulares.

### KillBash

**Nombre de herramienta:** `KillBash`

```typescript
interface KillShellInput {
  /**
   * El ID del shell en segundo plano a matar
   */
  shell_id: string;
}
```

Mata un shell bash en segundo plano en ejecución por su ID.

### NotebookEdit

**Nombre de herramienta:** `NotebookEdit`

```typescript
interface NotebookEditInput {
  /**
   * La ruta absoluta al archivo del cuaderno Jupyter
   */
  notebook_path: string;
  /**
   * El ID de la celda a editar
   */
  cell_id?: string;
  /**
   * La nueva fuente para la celda
   */
  new_source: string;
  /**
   * El tipo de la celda (código o markdown)
   */
  cell_type?: 'code' | 'markdown';
  /**
   * El tipo de edición (reemplazar, insertar, eliminar)
   */
  edit_mode?: 'replace' | 'insert' | 'delete';
}
```

Edita celdas en archivos de cuaderno Jupyter.

### WebFetch

**Nombre de herramienta:** `WebFetch`

```typescript
interface WebFetchInput {
  /**
   * La URL de la que obtener contenido
   */
  url: string;
  /**
   * El mensaje a ejecutar en el contenido obtenido
   */
  prompt: string;
}
```

Obtiene contenido de una URL y lo procesa con un modelo de IA.

### WebSearch

**Nombre de herramienta:** `WebSearch`

```typescript
interface WebSearchInput {
  /**
   * La consulta de búsqueda a usar
   */
  query: string;
  /**
   * Solo incluir resultados de estos dominios
   */
  allowed_domains?: string[];
  /**
   * Nunca incluir resultados de estos dominios
   */
  blocked_domains?: string[];
}
```

Busca en la web y retorna resultados formateados.

### TodoWrite

**Nombre de herramienta:** `TodoWrite`

```typescript
interface TodoWriteInput {
  /**
   * La lista de tareas actualizada
   */
  todos: Array<{
    /**
     * La descripción de la tarea
     */
    content: string;
    /**
     * El estado de la tarea
     */
    status: 'pending' | 'in_progress' | 'completed';
    /**
     * Forma activa de la descripción de la tarea
     */
    activeForm: string;
  }>;
}
```

Crea y gestiona una lista de tareas estructurada para rastrear el progreso.

### ExitPlanMode

**Nombre de herramienta:** `ExitPlanMode`

```typescript
interface ExitPlanModeInput {
  /**
   * El plan a ejecutar por el usuario para aprobación
   */
  plan: string;
}
```

Sale del modo de planificación e solicita al usuario que apruebe el plan.

### ListMcpResources

**Nombre de herramienta:** `ListMcpResources`

```typescript
interface ListMcpResourcesInput {
  /**
   * Nombre de servidor opcional para filtrar recursos por
   */
  server?: string;
}
```

Lista recursos MCP disponibles de servidores conectados.

### ReadMcpResource

**Nombre de herramienta:** `ReadMcpResource`

```typescript
interface ReadMcpResourceInput {
  /**
   * El nombre del servidor MCP
   */
  server: string;
  /**
   * El URI del recurso a leer
   */
  uri: string;
}
```

Lee un recurso MCP específico de un servidor.

## Tipos de Salida de Herramienta

Documentación de esquemas de salida para todas las herramientas integradas de Claude Code. Estos tipos representan los datos de respuesta reales retornados por cada herramienta.

### `ToolOutput`

**Nota:** Este es un tipo de solo documentación para claridad. Representa la unión de todos los tipos de salida de herramienta.

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

**Nombre de herramienta:** `Task`

```typescript
interface TaskOutput {
  /**
   * Mensaje de resultado final del subagente
   */
  result: string;
  /**
   * Estadísticas de uso de tokens
   */
  usage?: {
    input_tokens: number;
    output_tokens: number;
    cache_creation_input_tokens?: number;
    cache_read_input_tokens?: number;
  };
  /**
   * Costo total en USD
   */
  total_cost_usd?: number;
  /**
   * Duración de ejecución en milisegundos
   */
  duration_ms?: number;
}
```

Retorna el resultado final del subagente después de completar la tarea delegada.

### AskUserQuestion

**Nombre de herramienta:** `AskUserQuestion`

```typescript
interface AskUserQuestionOutput {
  /**
   * Las preguntas que fueron hechas
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
   * Las respuestas proporcionadas por el usuario.
   * Mapea texto de pregunta a cadena de respuesta.
   * Las respuestas de selección múltiple están separadas por comas.
   */
  answers: Record<string, string>;
}
```

Retorna las preguntas hechas y las respuestas del usuario.

### Bash

**Nombre de herramienta:** `Bash`

```typescript
interface BashOutput {
  /**
   * Salida combinada de stdout y stderr
   */
  output: string;
  /**
   * Código de salida del comando
   */
  exitCode: number;
  /**
   * Si el comando fue matado debido a tiempo de espera
   */
  killed?: boolean;
  /**
   * ID de shell para procesos en segundo plano
   */
  shellId?: string;
}
```

Retorna salida de comando con estado de salida. Los comandos en segundo plano retornan inmediatamente con un shellId.

### BashOutput

**Nombre de herramienta:** `BashOutput`

```typescript
interface BashOutputToolOutput {
  /**
   * Nueva salida desde la última verificación
   */
  output: string;
  /**
   * Estado actual del shell
   */
  status: 'running' | 'completed' | 'failed';
  /**
   * Código de salida (cuando se completa)
   */
  exitCode?: number;
}
```

Retorna salida incremental de shells en segundo plano.

### Edit

**Nombre de herramienta:** `Edit`

```typescript
interface EditOutput {
  /**
   * Mensaje de confirmación
   */
  message: string;
  /**
   * Número de reemplazos realizados
   */
  replacements: number;
  /**
   * Ruta de archivo que fue editada
   */
  file_path: string;
}
```

Retorna confirmación de ediciones exitosas con conteo de reemplazos.

### Leer

**Nombre de la herramienta:** `Read`

```typescript
type ReadOutput = 
  | TextFileOutput
  | ImageFileOutput
  | PDFFileOutput
  | NotebookFileOutput;

interface TextFileOutput {
  /**
   * Contenido del archivo con números de línea
   */
  content: string;
  /**
   * Número total de líneas en el archivo
   */
  total_lines: number;
  /**
   * Líneas realmente devueltas
   */
  lines_returned: number;
}

interface ImageFileOutput {
  /**
   * Datos de imagen codificados en Base64
   */
  image: string;
  /**
   * Tipo MIME de la imagen
   */
  mime_type: string;
  /**
   * Tamaño del archivo en bytes
   */
  file_size: number;
}

interface PDFFileOutput {
  /**
   * Array de contenidos de página
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
   * Número total de páginas
   */
  total_pages: number;
}

interface NotebookFileOutput {
  /**
   * Celdas del cuaderno Jupyter
   */
  cells: Array<{
    cell_type: 'code' | 'markdown';
    source: string;
    outputs?: any[];
    execution_count?: number;
  }>;
  /**
   * Metadatos del cuaderno
   */
  metadata?: Record<string, any>;
}
```

Devuelve el contenido del archivo en el formato apropiado para el tipo de archivo.

### Escribir

**Nombre de la herramienta:** `Write`

```typescript
interface WriteOutput {
  /**
   * Mensaje de éxito
   */
  message: string;
  /**
   * Número de bytes escritos
   */
  bytes_written: number;
  /**
   * Ruta del archivo que fue escrito
   */
  file_path: string;
}
```

Devuelve confirmación después de escribir exitosamente el archivo.

### Glob

**Nombre de la herramienta:** `Glob`

```typescript
interface GlobOutput {
  /**
   * Array de rutas de archivo coincidentes
   */
  matches: string[];
  /**
   * Número de coincidencias encontradas
   */
  count: number;
  /**
   * Directorio de búsqueda utilizado
   */
  search_path: string;
}
```

Devuelve rutas de archivo que coinciden con el patrón glob, ordenadas por tiempo de modificación.

### Grep

**Nombre de la herramienta:** `Grep`

```typescript
type GrepOutput = 
  | GrepContentOutput
  | GrepFilesOutput
  | GrepCountOutput;

interface GrepContentOutput {
  /**
   * Líneas coincidentes con contexto
   */
  matches: Array<{
    file: string;
    line_number?: number;
    line: string;
    before_context?: string[];
    after_context?: string[];
  }>;
  /**
   * Número total de coincidencias
   */
  total_matches: number;
}

interface GrepFilesOutput {
  /**
   * Archivos que contienen coincidencias
   */
  files: string[];
  /**
   * Número de archivos con coincidencias
   */
  count: number;
}

interface GrepCountOutput {
  /**
   * Conteos de coincidencias por archivo
   */
  counts: Array<{
    file: string;
    count: number;
  }>;
  /**
   * Total de coincidencias en todos los archivos
   */
  total: number;
}
```

Devuelve resultados de búsqueda en el formato especificado por output_mode.

### KillBash

**Nombre de la herramienta:** `KillBash`

```typescript
interface KillBashOutput {
  /**
   * Mensaje de éxito
   */
  message: string;
  /**
   * ID del shell terminado
   */
  shell_id: string;
}
```

Devuelve confirmación después de terminar el shell de fondo.

### NotebookEdit

**Nombre de la herramienta:** `NotebookEdit`

```typescript
interface NotebookEditOutput {
  /**
   * Mensaje de éxito
   */
  message: string;
  /**
   * Tipo de edición realizada
   */
  edit_type: 'replaced' | 'inserted' | 'deleted';
  /**
   * ID de celda que fue afectada
   */
  cell_id?: string;
  /**
   * Total de celdas en el cuaderno después de la edición
   */
  total_cells: number;
}
```

Devuelve confirmación después de modificar el cuaderno Jupyter.

### WebFetch

**Nombre de la herramienta:** `WebFetch`

```typescript
interface WebFetchOutput {
  /**
   * Respuesta del modelo de IA al prompt
   */
  response: string;
  /**
   * URL que fue obtenida
   */
  url: string;
  /**
   * URL final después de redirecciones
   */
  final_url?: string;
  /**
   * Código de estado HTTP
   */
  status_code?: number;
}
```

Devuelve el análisis de la IA del contenido web obtenido.

### WebSearch

**Nombre de la herramienta:** `WebSearch`

```typescript
interface WebSearchOutput {
  /**
   * Resultados de búsqueda
   */
  results: Array<{
    title: string;
    url: string;
    snippet: string;
    /**
     * Metadatos adicionales si están disponibles
     */
    metadata?: Record<string, any>;
  }>;
  /**
   * Número total de resultados
   */
  total_results: number;
  /**
   * La consulta que fue buscada
   */
  query: string;
}
```

Devuelve resultados de búsqueda formateados de la web.

### TodoWrite

**Nombre de la herramienta:** `TodoWrite`

```typescript
interface TodoWriteOutput {
  /**
   * Mensaje de éxito
   */
  message: string;
  /**
   * Estadísticas actuales de tareas
   */
  stats: {
    total: number;
    pending: number;
    in_progress: number;
    completed: number;
  };
}
```

Devuelve confirmación con estadísticas de tareas actuales.

### ExitPlanMode

**Nombre de la herramienta:** `ExitPlanMode`

```typescript
interface ExitPlanModeOutput {
  /**
   * Mensaje de confirmación
   */
  message: string;
  /**
   * Si el usuario aprobó el plan
   */
  approved?: boolean;
}
```

Devuelve confirmación después de salir del modo de plan.

### ListMcpResources

**Nombre de la herramienta:** `ListMcpResources`

```typescript
interface ListMcpResourcesOutput {
  /**
   * Recursos disponibles
   */
  resources: Array<{
    uri: string;
    name: string;
    description?: string;
    mimeType?: string;
    server: string;
  }>;
  /**
   * Número total de recursos
   */
  total: number;
}
```

Devuelve lista de recursos MCP disponibles.

### ReadMcpResource

**Nombre de la herramienta:** `ReadMcpResource`

```typescript
interface ReadMcpResourceOutput {
  /**
   * Contenidos del recurso
   */
  contents: Array<{
    uri: string;
    mimeType?: string;
    text?: string;
    blob?: string;
  }>;
  /**
   * Servidor que proporcionó el recurso
   */
  server: string;
}
```

Devuelve el contenido del recurso MCP solicitado.

## Tipos de Permisos

### `PermissionUpdate`

Operaciones para actualizar permisos.

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
  | 'userSettings'     // Configuración global del usuario
  | 'projectSettings'  // Configuración del proyecto por directorio
  | 'localSettings'    // Configuración local ignorada por Git
  | 'session'          // Solo sesión actual
```

### `PermissionRuleValue`

```typescript
type PermissionRuleValue = {
  toolName: string;
  ruleContent?: string;
}
```

## Otros Tipos

### `ApiKeySource`

```typescript
type ApiKeySource = 'user' | 'project' | 'org' | 'temporary';
```

### `SdkBeta`

Características beta disponibles que se pueden habilitar a través de la opción `betas`. Consulte [encabezados beta](/docs/es/api/beta-headers) para más información.

```typescript
type SdkBeta = 'context-1m-2025-08-07';
```

| Valor | Descripción | Modelos Compatibles |
|:------|:------------|:------------------|
| `'context-1m-2025-08-07'` | Habilita [ventana de contexto](/docs/es/build-with-claude/context-windows) de 1 millón de tokens | Claude Sonnet 4, Claude Sonnet 4.5 |

### `SlashCommand`

Información sobre un comando de barra disponible.

```typescript
type SlashCommand = {
  name: string;
  description: string;
  argumentHint: string;
}
```

### `ModelInfo`

Información sobre un modelo disponible.

```typescript
type ModelInfo = {
  value: string;
  displayName: string;
  description: string;
}
```

### `McpServerStatus`

Estado de un servidor MCP conectado.

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

Información de cuenta para el usuario autenticado.

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

Estadísticas de uso por modelo devueltas en mensajes de resultado.

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

Una versión de [`Usage`](#usage) con todos los campos anulables hechos no anulables.

```typescript
type NonNullableUsage = {
  [K in keyof Usage]: NonNullable<Usage[K]>;
}
```

### `Usage`

Estadísticas de uso de tokens (de `@anthropic-ai/sdk`).

```typescript
type Usage = {
  input_tokens: number | null;
  output_tokens: number | null;
  cache_creation_input_tokens?: number | null;
  cache_read_input_tokens?: number | null;
}
```

### `CallToolResult`

Tipo de resultado de herramienta MCP (de `@modelcontextprotocol/sdk/types.js`).

```typescript
type CallToolResult = {
  content: Array<{
    type: 'text' | 'image' | 'resource';
    // Los campos adicionales varían según el tipo
  }>;
  isError?: boolean;
}
```

### `AbortError`

Clase de error personalizada para operaciones de aborto.

```typescript
class AbortError extends Error {}
```

## Configuración de Sandbox

### `SandboxSettings`

Configuración para el comportamiento del sandbox. Utilice esto para habilitar el sandboxing de comandos y configurar restricciones de red mediante programación.

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

| Propiedad | Tipo | Predeterminado | Descripción |
| :------- | :--- | :------ | :---------- |
| `enabled` | `boolean` | `false` | Habilitar modo sandbox para ejecución de comandos |
| `autoAllowBashIfSandboxed` | `boolean` | `false` | Aprobar automáticamente comandos bash cuando el sandbox está habilitado |
| `excludedCommands` | `string[]` | `[]` | Comandos que siempre omiten restricciones de sandbox (por ejemplo, `['docker']`). Estos se ejecutan sin sandbox automáticamente sin participación del modelo |
| `allowUnsandboxedCommands` | `boolean` | `false` | Permitir que el modelo solicite ejecutar comandos fuera del sandbox. Cuando es `true`, el modelo puede establecer `dangerouslyDisableSandbox` en la entrada de la herramienta, que recurre al [sistema de permisos](#permissions-fallback-for-unsandboxed-commands) |
| `network` | [`NetworkSandboxSettings`](#networksandboxsettings) | `undefined` | Configuración de sandbox específica de red |
| `ignoreViolations` | [`SandboxIgnoreViolations`](#sandboxignoreviolations) | `undefined` | Configurar qué violaciones de sandbox ignorar |
| `enableWeakerNestedSandbox` | `boolean` | `false` | Habilitar un sandbox anidado más débil para compatibilidad |

<Note>
**Las restricciones de acceso al sistema de archivos y red** NO se configuran a través de la configuración de sandbox. En su lugar, se derivan de [reglas de permisos](https://code.claude.com/docs/es/settings#permission-settings):

- **Restricciones de lectura del sistema de archivos**: Reglas de denegación de lectura
- **Restricciones de escritura del sistema de archivos**: Reglas de permiso/denegación de edición
- **Restricciones de red**: Reglas de permiso/denegación de WebFetch

Utilice la configuración de sandbox para sandboxing de ejecución de comandos, y reglas de permisos para control de acceso al sistema de archivos y red.
</Note>

#### Ejemplo de uso

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

Configuración específica de red para modo sandbox.

```typescript
type NetworkSandboxSettings = {
  allowLocalBinding?: boolean;
  allowUnixSockets?: string[];
  allowAllUnixSockets?: boolean;
  httpProxyPort?: number;
  socksProxyPort?: number;
}
```

| Propiedad | Tipo | Predeterminado | Descripción |
| :------- | :--- | :------ | :---------- |
| `allowLocalBinding` | `boolean` | `false` | Permitir que los procesos se vinculen a puertos locales (por ejemplo, para servidores de desarrollo) |
| `allowUnixSockets` | `string[]` | `[]` | Rutas de socket Unix a las que los procesos pueden acceder (por ejemplo, socket de Docker) |
| `allowAllUnixSockets` | `boolean` | `false` | Permitir acceso a todos los sockets Unix |
| `httpProxyPort` | `number` | `undefined` | Puerto proxy HTTP para solicitudes de red |
| `socksProxyPort` | `number` | `undefined` | Puerto proxy SOCKS para solicitudes de red |

### `SandboxIgnoreViolations`

Configuración para ignorar violaciones de sandbox específicas.

```typescript
type SandboxIgnoreViolations = {
  file?: string[];
  network?: string[];
}
```

| Propiedad | Tipo | Predeterminado | Descripción |
| :------- | :--- | :------ | :---------- |
| `file` | `string[]` | `[]` | Patrones de ruta de archivo para ignorar violaciones |
| `network` | `string[]` | `[]` | Patrones de red para ignorar violaciones |

### Fallback de Permisos para Comandos Sin Sandbox

Cuando `allowUnsandboxedCommands` está habilitado, el modelo puede solicitar ejecutar comandos fuera del sandbox estableciendo `dangerouslyDisableSandbox: true` en la entrada de la herramienta. Estas solicitudes recurren al sistema de permisos existente, lo que significa que se invocará su controlador `canUseTool`, permitiéndole implementar lógica de autorización personalizada.

<Note>
**`excludedCommands` vs `allowUnsandboxedCommands`:**
- `excludedCommands`: Una lista estática de comandos que siempre omiten el sandbox automáticamente (por ejemplo, `['docker']`). El modelo no tiene control sobre esto.
- `allowUnsandboxedCommands`: Permite que el modelo decida en tiempo de ejecución si solicitar ejecución sin sandbox estableciendo `dangerouslyDisableSandbox: true` en la entrada de la herramienta.
</Note>

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

const result = await query({
  prompt: "Deploy my application",
  options: {
    sandbox: {
      enabled: true,
      allowUnsandboxedCommands: true  // El modelo puede solicitar ejecución sin sandbox
    },
    permissionMode: "default",
    canUseTool: async (tool, input) => {
      // Verificar si el modelo está solicitando omitir el sandbox
      if (tool === "Bash" && input.dangerouslyDisableSandbox) {
        // El modelo quiere ejecutar este comando fuera del sandbox
        console.log(`Unsandboxed command requested: ${input.command}`);

        // Devolver true para permitir, false para denegar
        return isCommandAuthorized(input.command);
      }
      return true;
    }
  }
});
```

Este patrón le permite:

- **Auditar solicitudes del modelo**: Registrar cuándo el modelo solicita ejecución sin sandbox
- **Implementar listas de permitidos**: Solo permitir que comandos específicos se ejecuten sin sandbox
- **Agregar flujos de trabajo de aprobación**: Requerir autorización explícita para operaciones privilegiadas

<Warning>
Los comandos que se ejecutan con `dangerouslyDisableSandbox: true` tienen acceso completo al sistema. Asegúrese de que su controlador `canUseTool` valide estas solicitudes cuidadosamente.
</Warning>

## Ver también

- [Descripción general del SDK](/docs/es/agent-sdk/overview) - Conceptos generales del SDK
- [Referencia del SDK de Python](/docs/es/agent-sdk/python) - Documentación del SDK de Python
- [Referencia de CLI](https://code.claude.com/docs/es/cli-reference) - Interfaz de línea de comandos
- [Flujos de trabajo comunes](https://code.claude.com/docs/es/common-workflows) - Guías paso a paso