# Referência do Agent SDK - TypeScript

Referência completa da API do Agent SDK TypeScript, incluindo todas as funções, tipos e interfaces.

---

<script src="/components/typescript-sdk-type-links.js" defer />

<Note>
**Experimente a nova interface V2 (visualização):** Uma interface simplificada com padrões `send()` e `receive()` agora está disponível, facilitando conversas multi-turno. [Saiba mais](/docs/pt-BR/agent-sdk/typescript-v2-preview)
</Note>

## Instalação

```bash
npm install @anthropic-ai/claude-agent-sdk
```

## Funções

### `query()`

A função principal para interagir com Claude Code. Cria um gerador assíncrono que transmite mensagens conforme chegam.

```typescript
function query({
  prompt,
  options
}: {
  prompt: string | AsyncIterable<SDKUserMessage>;
  options?: Options;
}): Query
```

#### Parâmetros

| Parâmetro | Tipo | Descrição |
| :-------- | :--- | :---------- |
| `prompt` | `string \| AsyncIterable<`[`SDKUserMessage`](#sdkusermessage)`>` | O prompt de entrada como uma string ou iterável assíncrono para modo de transmissão |
| `options` | [`Options`](#options) | Objeto de configuração opcional (veja o tipo Options abaixo) |

#### Retorna

Retorna um objeto [`Query`](#query-1) que estende `AsyncGenerator<`[`SDKMessage`](#sdkmessage)`, void>` com métodos adicionais.

### `tool()`

Cria uma definição de ferramenta MCP type-safe para uso com servidores MCP do SDK.

```typescript
function tool<Schema extends ZodRawShape>(
  name: string,
  description: string,
  inputSchema: Schema,
  handler: (args: z.infer<ZodObject<Schema>>, extra: unknown) => Promise<CallToolResult>
): SdkMcpToolDefinition<Schema>
```

#### Parâmetros

| Parâmetro | Tipo | Descrição |
| :-------- | :--- | :---------- |
| `name` | `string` | O nome da ferramenta |
| `description` | `string` | Uma descrição do que a ferramenta faz |
| `inputSchema` | `Schema extends ZodRawShape` | Schema Zod que define os parâmetros de entrada da ferramenta |
| `handler` | `(args, extra) => Promise<`[`CallToolResult`](#calltoolresult)`>` | Função assíncrona que executa a lógica da ferramenta |

### `createSdkMcpServer()`

Cria uma instância de servidor MCP que é executada no mesmo processo que sua aplicação.

```typescript
function createSdkMcpServer(options: {
  name: string;
  version?: string;
  tools?: Array<SdkMcpToolDefinition<any>>;
}): McpSdkServerConfigWithInstance
```

#### Parâmetros

| Parâmetro | Tipo | Descrição |
| :-------- | :--- | :---------- |
| `options.name` | `string` | O nome do servidor MCP |
| `options.version` | `string` | String de versão opcional |
| `options.tools` | `Array<SdkMcpToolDefinition>` | Array de definições de ferramentas criadas com [`tool()`](#tool) |

## Tipos

### `Options`

Objeto de configuração para a função `query()`.

| Propriedade | Tipo | Padrão | Descrição |
| :------- | :--- | :------ | :---------- |
| `abortController` | `AbortController` | `new AbortController()` | Controlador para cancelar operações |
| `additionalDirectories` | `string[]` | `[]` | Diretórios adicionais que Claude pode acessar |
| `agents` | `Record<string, [`AgentDefinition`](#agentdefinition)>` | `undefined` | Defina subagentos programaticamente |
| `allowDangerouslySkipPermissions` | `boolean` | `false` | Ativar bypass de permissões. Necessário ao usar `permissionMode: 'bypassPermissions'` |
| `allowedTools` | `string[]` | Todas as ferramentas | Lista de nomes de ferramentas permitidas |
| `betas` | [`SdkBeta`](#sdkbeta)`[]` | `[]` | Ativar recursos beta (por exemplo, `['context-1m-2025-08-07']`) |
| `canUseTool` | [`CanUseTool`](#canusetool) | `undefined` | Função de permissão personalizada para uso de ferramentas |
| `continue` | `boolean` | `false` | Continuar a conversa mais recente |
| `cwd` | `string` | `process.cwd()` | Diretório de trabalho atual |
| `disallowedTools` | `string[]` | `[]` | Lista de nomes de ferramentas não permitidas |
| `env` | `Dict<string>` | `process.env` | Variáveis de ambiente |
| `executable` | `'bun' \| 'deno' \| 'node'` | Auto-detectado | Runtime JavaScript a usar |
| `executableArgs` | `string[]` | `[]` | Argumentos a passar para o executável |
| `extraArgs` | `Record<string, string \| null>` | `{}` | Argumentos adicionais |
| `fallbackModel` | `string` | `undefined` | Modelo a usar se o primário falhar |
| `forkSession` | `boolean` | `false` | Ao retomar com `resume`, fazer fork para um novo ID de sessão em vez de continuar a sessão original |
| `hooks` | `Partial<Record<`[`HookEvent`](#hookevent)`, `[`HookCallbackMatcher`](#hookcallbackmatcher)`[]>>` | `{}` | Callbacks de hook para eventos |
| `includePartialMessages` | `boolean` | `false` | Incluir eventos de mensagem parcial |
| `maxBudgetUsd` | `number` | `undefined` | Orçamento máximo em USD para a consulta |
| `maxThinkingTokens` | `number` | `undefined` | Tokens máximos para o processo de pensamento |
| `maxTurns` | `number` | `undefined` | Turnos de conversa máximos |
| `mcpServers` | `Record<string, [`McpServerConfig`](#mcpserverconfig)>` | `{}` | Configurações de servidor MCP |
| `model` | `string` | Padrão da CLI | Modelo Claude a usar |
| `outputFormat` | `{ type: 'json_schema', schema: JSONSchema }` | `undefined` | Defina o formato de saída para resultados de agente. Veja [Saídas estruturadas](/docs/pt-BR/agent-sdk/structured-outputs) para detalhes |
| `pathToClaudeCodeExecutable` | `string` | Usa executável integrado | Caminho para o executável Claude Code |
| `permissionMode` | [`PermissionMode`](#permissionmode) | `'default'` | Modo de permissão para a sessão |
| `permissionPromptToolName` | `string` | `undefined` | Nome da ferramenta MCP para prompts de permissão |
| `plugins` | [`SdkPluginConfig`](#sdkpluginconfig)`[]` | `[]` | Carregar plugins personalizados de caminhos locais. Veja [Plugins](/docs/pt-BR/agent-sdk/plugins) para detalhes |
| `resume` | `string` | `undefined` | ID de sessão a retomar |
| `resumeSessionAt` | `string` | `undefined` | Retomar sessão em um UUID de mensagem específico |
| `sandbox` | [`SandboxSettings`](#sandboxsettings) | `undefined` | Configurar comportamento da sandbox programaticamente. Veja [Configurações de sandbox](#sandboxsettings) para detalhes |
| `settingSources` | [`SettingSource`](#settingsource)`[]` | `[]` (sem configurações) | Controlar quais configurações baseadas em sistema de arquivos carregar. Quando omitido, nenhuma configuração é carregada. **Nota:** Deve incluir `'project'` para carregar arquivos CLAUDE.md |
| `stderr` | `(data: string) => void` | `undefined` | Callback para saída stderr |
| `strictMcpConfig` | `boolean` | `false` | Aplicar validação MCP rigorosa |
| `systemPrompt` | `string \| { type: 'preset'; preset: 'claude_code'; append?: string }` | `undefined` (prompt vazio) | Configuração de prompt do sistema. Passe uma string para prompt personalizado, ou `{ type: 'preset', preset: 'claude_code' }` para usar o prompt do sistema do Claude Code. Ao usar a forma de objeto preset, adicione `append` para estender o prompt do sistema com instruções adicionais |
| `tools` | `string[] \| { type: 'preset'; preset: 'claude_code' }` | `undefined` | Configuração de ferramentas. Passe um array de nomes de ferramentas ou use o preset para obter as ferramentas padrão do Claude Code |

### `Query`

Interface retornada pela função `query()`.

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

| Método | Descrição |
| :----- | :---------- |
| `interrupt()` | Interrompe a consulta (disponível apenas em modo de entrada de transmissão) |
| `setPermissionMode()` | Altera o modo de permissão (disponível apenas em modo de entrada de transmissão) |
| `setModel()` | Altera o modelo (disponível apenas em modo de entrada de transmissão) |
| `setMaxThinkingTokens()` | Altera os tokens de pensamento máximos (disponível apenas em modo de entrada de transmissão) |
| `supportedCommands()` | Retorna comandos de barra disponíveis |
| `supportedModels()` | Retorna modelos disponíveis com informações de exibição |
| `mcpServerStatus()` | Retorna status dos servidores MCP conectados |
| `accountInfo()` | Retorna informações da conta |

### `AgentDefinition`

Configuração para um subagentos definido programaticamente.

```typescript
type AgentDefinition = {
  description: string;
  tools?: string[];
  prompt: string;
  model?: 'sonnet' | 'opus' | 'haiku' | 'inherit';
}
```

| Campo | Obrigatório | Descrição |
|:------|:---------|:------------|
| `description` | Sim | Descrição em linguagem natural de quando usar este agente |
| `tools` | Não | Array de nomes de ferramentas permitidas. Se omitido, herda todas as ferramentas |
| `prompt` | Sim | O prompt do sistema do agente |
| `model` | Não | Override de modelo para este agente. Se omitido, usa o modelo principal |

### `SettingSource`

Controla quais fontes de configuração baseadas em sistema de arquivos o SDK carrega configurações.

```typescript
type SettingSource = 'user' | 'project' | 'local';
```

| Valor | Descrição | Localização |
|:------|:------------|:---------|
| `'user'` | Configurações globais do usuário | `~/.claude/settings.json` |
| `'project'` | Configurações de projeto compartilhadas (versionadas) | `.claude/settings.json` |
| `'local'` | Configurações de projeto local (gitignored) | `.claude/settings.local.json` |

#### Comportamento padrão

Quando `settingSources` é **omitido** ou **undefined**, o SDK **não** carrega nenhuma configuração do sistema de arquivos. Isso fornece isolamento para aplicações SDK.

#### Por que usar settingSources?

**Carregar todas as configurações do sistema de arquivos (comportamento legado):**
```typescript
// Carregar todas as configurações como SDK v0.0.x fez
const result = query({
  prompt: "Analyze this code",
  options: {
    settingSources: ['user', 'project', 'local']  // Carregar todas as configurações
  }
});
```

**Carregar apenas fontes de configuração específicas:**
```typescript
// Carregar apenas configurações de projeto, ignorar usuário e local
const result = query({
  prompt: "Run CI checks",
  options: {
    settingSources: ['project']  // Apenas .claude/settings.json
  }
});
```

**Ambientes de teste e CI:**
```typescript
// Garantir comportamento consistente em CI excluindo configurações locais
const result = query({
  prompt: "Run tests",
  options: {
    settingSources: ['project'],  // Apenas configurações compartilhadas da equipe
    permissionMode: 'bypassPermissions'
  }
});
```

**Aplicações apenas SDK:**
```typescript
// Defina tudo programaticamente (comportamento padrão)
// Sem dependências do sistema de arquivos - settingSources padrão para []
const result = query({
  prompt: "Review this PR",
  options: {
    // settingSources: [] é o padrão, não precisa especificar
    agents: { /* ... */ },
    mcpServers: { /* ... */ },
    allowedTools: ['Read', 'Grep', 'Glob']
  }
});
```

**Carregando instruções de projeto CLAUDE.md:**
```typescript
// Carregar configurações de projeto para incluir arquivos CLAUDE.md
const result = query({
  prompt: "Add a new feature following project conventions",
  options: {
    systemPrompt: {
      type: 'preset',
      preset: 'claude_code'  // Necessário para usar CLAUDE.md
    },
    settingSources: ['project'],  // Carrega CLAUDE.md do diretório do projeto
    allowedTools: ['Read', 'Write', 'Edit']
  }
});
```

#### Precedência de configurações

Quando múltiplas fontes são carregadas, as configurações são mescladas com esta precedência (mais alta para mais baixa):
1. Configurações locais (`.claude/settings.local.json`)
2. Configurações de projeto (`.claude/settings.json`)
3. Configurações do usuário (`~/.claude/settings.json`)

Opções programáticas (como `agents`, `allowedTools`) sempre substituem configurações do sistema de arquivos.

### `PermissionMode`

```typescript
type PermissionMode =
  | 'default'           // Comportamento de permissão padrão
  | 'acceptEdits'       // Auto-aceitar edições de arquivo
  | 'bypassPermissions' // Bypass de todas as verificações de permissão
  | 'plan'              // Modo de planejamento - sem execução
```

### `CanUseTool`

Tipo de função de permissão personalizada para controlar o uso de ferramentas.

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

Resultado de uma verificação de permissão.

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

Configuração para servidores MCP.

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

Configuração para carregar plugins no SDK.

```typescript
type SdkPluginConfig = {
  type: 'local';
  path: string;
}
```

| Campo | Tipo | Descrição |
|:------|:-----|:------------|
| `type` | `'local'` | Deve ser `'local'` (apenas plugins locais atualmente suportados) |
| `path` | `string` | Caminho absoluto ou relativo para o diretório do plugin |

**Exemplo:**
```typescript
plugins: [
  { type: 'local', path: './my-plugin' },
  { type: 'local', path: '/absolute/path/to/plugin' }
]
```

Para informações completas sobre criação e uso de plugins, veja [Plugins](/docs/pt-BR/agent-sdk/plugins).

## Tipos de Mensagem

### `SDKMessage`

Tipo de união de todas as mensagens possíveis retornadas pela consulta.

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

Mensagem de resposta do assistente.

```typescript
type SDKAssistantMessage = {
  type: 'assistant';
  uuid: UUID;
  session_id: string;
  message: APIAssistantMessage; // Do SDK Anthropic
  parent_tool_use_id: string | null;
}
```

### `SDKUserMessage`

Mensagem de entrada do usuário.

```typescript
type SDKUserMessage = {
  type: 'user';
  uuid?: UUID;
  session_id: string;
  message: APIUserMessage; // Do SDK Anthropic
  parent_tool_use_id: string | null;
}
```

### `SDKUserMessageReplay`

Mensagem de usuário repetida com UUID obrigatório.

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

Mensagem de resultado final.

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

Mensagem de inicialização do sistema.

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

Mensagem parcial de transmissão (apenas quando `includePartialMessages` é true).

```typescript
type SDKPartialAssistantMessage = {
  type: 'stream_event';
  event: RawMessageStreamEvent; // Do SDK Anthropic
  parent_tool_use_id: string | null;
  uuid: UUID;
  session_id: string;
}
```

### `SDKCompactBoundaryMessage`

Mensagem indicando um limite de compactação de conversa.

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

Informações sobre um uso de ferramenta negado.

```typescript
type SDKPermissionDenial = {
  tool_name: string;
  tool_use_id: string;
  tool_input: ToolInput;
}
```

## Tipos de Hook

Para um guia abrangente sobre o uso de hooks com exemplos e padrões comuns, veja o [guia de Hooks](/docs/pt-BR/agent-sdk/hooks).

### `HookEvent`

Eventos de hook disponíveis.

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

Tipo de função de callback de hook.

```typescript
type HookCallback = (
  input: HookInput, // União de todos os tipos de entrada de hook
  toolUseID: string | undefined,
  options: { signal: AbortSignal }
) => Promise<HookJSONOutput>;
```

### `HookCallbackMatcher`

Configuração de hook com matcher opcional.

```typescript
interface HookCallbackMatcher {
  matcher?: string;
  hooks: HookCallback[];
}
```

### `HookInput`

Tipo de união de todos os tipos de entrada de hook.

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

Interface base que todos os tipos de entrada de hook estendem.

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
  reason: ExitReason;  // String do array EXIT_REASONS
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

Valor de retorno do hook.

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

## Tipos de Entrada de Ferramenta

Documentação de esquemas de entrada para todas as ferramentas Claude Code integradas. Esses tipos são exportados de `@anthropic-ai/claude-agent-sdk` e podem ser usados para interações de ferramentas type-safe.

### `ToolInput`

**Nota:** Este é um tipo apenas para documentação para clareza. Representa a união de todos os tipos de entrada de ferramenta.

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

**Nome da ferramenta:** `Task`

```typescript
interface AgentInput {
  /**
   * Uma descrição breve (3-5 palavras) da tarefa
   */
  description: string;
  /**
   * A tarefa para o agente executar
   */
  prompt: string;
  /**
   * O tipo de agente especializado a usar para esta tarefa
   */
  subagent_type: string;
}
```

Inicia um novo agente para lidar com tarefas complexas e multi-etapas de forma autônoma.

### AskUserQuestion

**Nome da ferramenta:** `AskUserQuestion`

```typescript
interface AskUserQuestionInput {
  /**
   * Perguntas a fazer ao usuário (1-4 perguntas)
   */
  questions: Array<{
    /**
     * A pergunta completa a fazer ao usuário. Deve ser clara, específica,
     * e terminar com um ponto de interrogação.
     */
    question: string;
    /**
     * Rótulo muito curto exibido como um chip/tag (máx 12 caracteres).
     * Exemplos: "Auth method", "Library", "Approach"
     */
    header: string;
    /**
     * As opções disponíveis (2-4 opções). Uma opção "Other" é
     * fornecida automaticamente.
     */
    options: Array<{
      /**
       * Texto de exibição para esta opção (1-5 palavras)
       */
      label: string;
      /**
       * Explicação do que esta opção significa
       */
      description: string;
    }>;
    /**
     * Defina como true para permitir múltiplas seleções
     */
    multiSelect: boolean;
  }>;
  /**
   * Respostas do usuário preenchidas pelo sistema de permissões.
   * Mapeia texto da pergunta para rótulo(s) de opção selecionada.
   * Respostas de múltipla seleção são separadas por vírgula.
   */
  answers?: Record<string, string>;
}
```

Faz perguntas de esclarecimento ao usuário durante a execução. Veja [Tratando a Ferramenta AskUserQuestion](/docs/pt-BR/agent-sdk/permissions#handling-the-askuserquestion-tool) para detalhes de uso.

### Bash

**Nome da ferramenta:** `Bash`

```typescript
interface BashInput {
  /**
   * O comando a executar
   */
  command: string;
  /**
   * Timeout opcional em milissegundos (máx 600000)
   */
  timeout?: number;
  /**
   * Descrição clara e concisa do que este comando faz em 5-10 palavras
   */
  description?: string;
  /**
   * Defina como true para executar este comando em background
   */
  run_in_background?: boolean;
}
```

Executa comandos bash em uma sessão de shell persistente com timeout opcional e execução em background.

### BashOutput

**Nome da ferramenta:** `BashOutput`

```typescript
interface BashOutputInput {
  /**
   * O ID do shell background para recuperar saída
   */
  bash_id: string;
  /**
   * Regex opcional para filtrar linhas de saída
   */
  filter?: string;
}
```

Recupera saída de um shell bash em execução ou concluído.

### Edit

**Nome da ferramenta:** `Edit`

```typescript
interface FileEditInput {
  /**
   * O caminho absoluto para o arquivo a modificar
   */
  file_path: string;
  /**
   * O texto a substituir
   */
  old_string: string;
  /**
   * O texto para substituir (deve ser diferente de old_string)
   */
  new_string: string;
  /**
   * Substituir todas as ocorrências de old_string (padrão false)
   */
  replace_all?: boolean;
}
```

Realiza substituições exatas de string em arquivos.

### Read

**Nome da ferramenta:** `Read`

```typescript
interface FileReadInput {
  /**
   * O caminho absoluto para o arquivo a ler
   */
  file_path: string;
  /**
   * O número da linha para começar a ler
   */
  offset?: number;
  /**
   * O número de linhas a ler
   */
  limit?: number;
}
```

Lê arquivos do sistema de arquivos local, incluindo texto, imagens, PDFs e notebooks Jupyter.

### Write

**Nome da ferramenta:** `Write`

```typescript
interface FileWriteInput {
  /**
   * O caminho absoluto para o arquivo a escrever
   */
  file_path: string;
  /**
   * O conteúdo a escrever no arquivo
   */
  content: string;
}
```

Escreve um arquivo no sistema de arquivos local, sobrescrevendo se existir.

### Glob

**Nome da ferramenta:** `Glob`

```typescript
interface GlobInput {
  /**
   * O padrão glob para corresponder arquivos
   */
  pattern: string;
  /**
   * O diretório para pesquisar (padrão cwd)
   */
  path?: string;
}
```

Correspondência rápida de padrão de arquivo que funciona com qualquer tamanho de codebase.

### Grep

**Nome da ferramenta:** `Grep`

```typescript
interface GrepInput {
  /**
   * O padrão de expressão regular para pesquisar
   */
  pattern: string;
  /**
   * Arquivo ou diretório para pesquisar (padrão cwd)
   */
  path?: string;
  /**
   * Padrão glob para filtrar arquivos (por exemplo "*.js")
   */
  glob?: string;
  /**
   * Tipo de arquivo para pesquisar (por exemplo "js", "py", "rust")
   */
  type?: string;
  /**
   * Modo de saída: "content", "files_with_matches", ou "count"
   */
  output_mode?: 'content' | 'files_with_matches' | 'count';
  /**
   * Pesquisa insensível a maiúsculas/minúsculas
   */
  '-i'?: boolean;
  /**
   * Mostrar números de linha (para modo content)
   */
  '-n'?: boolean;
  /**
   * Linhas para mostrar antes de cada correspondência
   */
  '-B'?: number;
  /**
   * Linhas para mostrar após cada correspondência
   */
  '-A'?: number;
  /**
   * Linhas para mostrar antes e após cada correspondência
   */
  '-C'?: number;
  /**
   * Limitar saída para as primeiras N linhas/entradas
   */
  head_limit?: number;
  /**
   * Ativar modo multilinha
   */
  multiline?: boolean;
}
```

Ferramenta de pesquisa poderosa construída em ripgrep com suporte a regex.

### KillBash

**Nome da ferramenta:** `KillBash`

```typescript
interface KillShellInput {
  /**
   * O ID do shell background a matar
   */
  shell_id: string;
}
```

Mata um shell bash em execução em background pelo seu ID.

### NotebookEdit

**Nome da ferramenta:** `NotebookEdit`

```typescript
interface NotebookEditInput {
  /**
   * O caminho absoluto para o arquivo de notebook Jupyter
   */
  notebook_path: string;
  /**
   * O ID da célula a editar
   */
  cell_id?: string;
  /**
   * A nova fonte para a célula
   */
  new_source: string;
  /**
   * O tipo da célula (code ou markdown)
   */
  cell_type?: 'code' | 'markdown';
  /**
   * O tipo de edição (replace, insert, delete)
   */
  edit_mode?: 'replace' | 'insert' | 'delete';
}
```

Edita células em arquivos de notebook Jupyter.

### WebFetch

**Nome da ferramenta:** `WebFetch`

```typescript
interface WebFetchInput {
  /**
   * A URL para buscar conteúdo
   */
  url: string;
  /**
   * O prompt para executar no conteúdo buscado
   */
  prompt: string;
}
```

Busca conteúdo de uma URL e o processa com um modelo de IA.

### WebSearch

**Nome da ferramenta:** `WebSearch`

```typescript
interface WebSearchInput {
  /**
   * A consulta de pesquisa a usar
   */
  query: string;
  /**
   * Incluir apenas resultados destes domínios
   */
  allowed_domains?: string[];
  /**
   * Nunca incluir resultados destes domínios
   */
  blocked_domains?: string[];
}
```

Pesquisa a web e retorna resultados formatados.

### TodoWrite

**Nome da ferramenta:** `TodoWrite`

```typescript
interface TodoWriteInput {
  /**
   * A lista de tarefas atualizada
   */
  todos: Array<{
    /**
     * A descrição da tarefa
     */
    content: string;
    /**
     * O status da tarefa
     */
    status: 'pending' | 'in_progress' | 'completed';
    /**
     * Forma ativa da descrição da tarefa
     */
    activeForm: string;
  }>;
}
```

Cria e gerencia uma lista de tarefas estruturada para rastrear o progresso.

### ExitPlanMode

**Nome da ferramenta:** `ExitPlanMode`

```typescript
interface ExitPlanModeInput {
  /**
   * O plano a executar pelo usuário para aprovação
   */
  plan: string;
}
```

Sai do modo de planejamento e solicita ao usuário que aprove o plano.

### ListMcpResources

**Nome da ferramenta:** `ListMcpResources`

```typescript
interface ListMcpResourcesInput {
  /**
   * Nome do servidor opcional para filtrar recursos
   */
  server?: string;
}
```

Lista recursos MCP disponíveis de servidores conectados.

### ReadMcpResource

**Nome da ferramenta:** `ReadMcpResource`

```typescript
interface ReadMcpResourceInput {
  /**
   * O nome do servidor MCP
   */
  server: string;
  /**
   * O URI do recurso a ler
   */
  uri: string;
}
```

Lê um recurso MCP específico de um servidor.

## Tipos de Saída de Ferramenta

Documentação de esquemas de saída para todas as ferramentas Claude Code integradas. Esses tipos representam os dados de resposta reais retornados por cada ferramenta.

### `ToolOutput`

**Nota:** Este é um tipo apenas para documentação para clareza. Representa a união de todos os tipos de saída de ferramenta.

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

**Nome da ferramenta:** `Task`

```typescript
interface TaskOutput {
  /**
   * Mensagem de resultado final do subagentos
   */
  result: string;
  /**
   * Estatísticas de uso de tokens
   */
  usage?: {
    input_tokens: number;
    output_tokens: number;
    cache_creation_input_tokens?: number;
    cache_read_input_tokens?: number;
  };
  /**
   * Custo total em USD
   */
  total_cost_usd?: number;
  /**
   * Duração da execução em milissegundos
   */
  duration_ms?: number;
}
```

Retorna o resultado final do subagentos após concluir a tarefa delegada.

### AskUserQuestion

**Nome da ferramenta:** `AskUserQuestion`

```typescript
interface AskUserQuestionOutput {
  /**
   * As perguntas que foram feitas
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
   * As respostas fornecidas pelo usuário.
   * Mapeia texto da pergunta para string de resposta.
   * Respostas de múltipla seleção são separadas por vírgula.
   */
  answers: Record<string, string>;
}
```

Retorna as perguntas feitas e as respostas do usuário.

### Bash

**Nome da ferramenta:** `Bash`

```typescript
interface BashOutput {
  /**
   * Saída combinada de stdout e stderr
   */
  output: string;
  /**
   * Código de saída do comando
   */
  exitCode: number;
  /**
   * Se o comando foi morto devido a timeout
   */
  killed?: boolean;
  /**
   * ID do shell para processos em background
   */
  shellId?: string;
}
```

Retorna saída de comando com status de saída. Comandos em background retornam imediatamente com um shellId.

### BashOutput

**Nome da ferramenta:** `BashOutput`

```typescript
interface BashOutputToolOutput {
  /**
   * Nova saída desde a última verificação
   */
  output: string;
  /**
   * Status atual do shell
   */
  status: 'running' | 'completed' | 'failed';
  /**
   * Código de saída (quando concluído)
   */
  exitCode?: number;
}
```

Retorna saída incremental de shells em background.

### Edit

**Nome da ferramenta:** `Edit`

```typescript
interface EditOutput {
  /**
   * Mensagem de confirmação
   */
  message: string;
  /**
   * Número de substituições feitas
   */
  replacements: number;
  /**
   * Caminho do arquivo que foi editado
   */
  file_path: string;
}
```

Retorna confirmação de edições bem-sucedidas com contagem de substituições.

### Ler

**Nome da ferramenta:** `Read`

```typescript
type ReadOutput = 
  | TextFileOutput
  | ImageFileOutput
  | PDFFileOutput
  | NotebookFileOutput;

interface TextFileOutput {
  /**
   * Conteúdo do arquivo com números de linha
   */
  content: string;
  /**
   * Número total de linhas no arquivo
   */
  total_lines: number;
  /**
   * Linhas realmente retornadas
   */
  lines_returned: number;
}

interface ImageFileOutput {
  /**
   * Dados de imagem codificados em Base64
   */
  image: string;
  /**
   * Tipo MIME da imagem
   */
  mime_type: string;
  /**
   * Tamanho do arquivo em bytes
   */
  file_size: number;
}

interface PDFFileOutput {
  /**
   * Array de conteúdos de página
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
   * Células do notebook Jupyter
   */
  cells: Array<{
    cell_type: 'code' | 'markdown';
    source: string;
    outputs?: any[];
    execution_count?: number;
  }>;
  /**
   * Metadados do notebook
   */
  metadata?: Record<string, any>;
}
```

Retorna o conteúdo do arquivo em formato apropriado para o tipo de arquivo.

### Escrever

**Nome da ferramenta:** `Write`

```typescript
interface WriteOutput {
  /**
   * Mensagem de sucesso
   */
  message: string;
  /**
   * Número de bytes escritos
   */
  bytes_written: number;
  /**
   * Caminho do arquivo que foi escrito
   */
  file_path: string;
}
```

Retorna confirmação após escrever com sucesso o arquivo.

### Glob

**Nome da ferramenta:** `Glob`

```typescript
interface GlobOutput {
  /**
   * Array de caminhos de arquivo correspondentes
   */
  matches: string[];
  /**
   * Número de correspondências encontradas
   */
  count: number;
  /**
   * Diretório de pesquisa usado
   */
  search_path: string;
}
```

Retorna caminhos de arquivo correspondentes ao padrão glob, classificados por tempo de modificação.

### Grep

**Nome da ferramenta:** `Grep`

```typescript
type GrepOutput = 
  | GrepContentOutput
  | GrepFilesOutput
  | GrepCountOutput;

interface GrepContentOutput {
  /**
   * Linhas correspondentes com contexto
   */
  matches: Array<{
    file: string;
    line_number?: number;
    line: string;
    before_context?: string[];
    after_context?: string[];
  }>;
  /**
   * Número total de correspondências
   */
  total_matches: number;
}

interface GrepFilesOutput {
  /**
   * Arquivos contendo correspondências
   */
  files: string[];
  /**
   * Número de arquivos com correspondências
   */
  count: number;
}

interface GrepCountOutput {
  /**
   * Contagens de correspondência por arquivo
   */
  counts: Array<{
    file: string;
    count: number;
  }>;
  /**
   * Total de correspondências em todos os arquivos
   */
  total: number;
}
```

Retorna resultados de pesquisa no formato especificado por output_mode.

### KillBash

**Nome da ferramenta:** `KillBash`

```typescript
interface KillBashOutput {
  /**
   * Mensagem de sucesso
   */
  message: string;
  /**
   * ID do shell encerrado
   */
  shell_id: string;
}
```

Retorna confirmação após encerrar o shell em segundo plano.

### NotebookEdit

**Nome da ferramenta:** `NotebookEdit`

```typescript
interface NotebookEditOutput {
  /**
   * Mensagem de sucesso
   */
  message: string;
  /**
   * Tipo de edição realizada
   */
  edit_type: 'replaced' | 'inserted' | 'deleted';
  /**
   * ID da célula que foi afetada
   */
  cell_id?: string;
  /**
   * Total de células no notebook após a edição
   */
  total_cells: number;
}
```

Retorna confirmação após modificar o notebook Jupyter.

### WebFetch

**Nome da ferramenta:** `WebFetch`

```typescript
interface WebFetchOutput {
  /**
   * Resposta do modelo de IA ao prompt
   */
  response: string;
  /**
   * URL que foi buscada
   */
  url: string;
  /**
   * URL final após redirecionamentos
   */
  final_url?: string;
  /**
   * Código de status HTTP
   */
  status_code?: number;
}
```

Retorna a análise da IA do conteúdo web buscado.

### WebSearch

**Nome da ferramenta:** `WebSearch`

```typescript
interface WebSearchOutput {
  /**
   * Resultados de pesquisa
   */
  results: Array<{
    title: string;
    url: string;
    snippet: string;
    /**
     * Metadados adicionais se disponíveis
     */
    metadata?: Record<string, any>;
  }>;
  /**
   * Número total de resultados
   */
  total_results: number;
  /**
   * A consulta que foi pesquisada
   */
  query: string;
}
```

Retorna resultados de pesquisa formatados da web.

### TodoWrite

**Nome da ferramenta:** `TodoWrite`

```typescript
interface TodoWriteOutput {
  /**
   * Mensagem de sucesso
   */
  message: string;
  /**
   * Estatísticas atuais de tarefas
   */
  stats: {
    total: number;
    pending: number;
    in_progress: number;
    completed: number;
  };
}
```

Retorna confirmação com estatísticas atuais de tarefas.

### ExitPlanMode

**Nome da ferramenta:** `ExitPlanMode`

```typescript
interface ExitPlanModeOutput {
  /**
   * Mensagem de confirmação
   */
  message: string;
  /**
   * Se o usuário aprovou o plano
   */
  approved?: boolean;
}
```

Retorna confirmação após sair do modo de plano.

### ListMcpResources

**Nome da ferramenta:** `ListMcpResources`

```typescript
interface ListMcpResourcesOutput {
  /**
   * Recursos disponíveis
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

Retorna lista de recursos MCP disponíveis.

### ReadMcpResource

**Nome da ferramenta:** `ReadMcpResource`

```typescript
interface ReadMcpResourceOutput {
  /**
   * Conteúdo do recurso
   */
  contents: Array<{
    uri: string;
    mimeType?: string;
    text?: string;
    blob?: string;
  }>;
  /**
   * Servidor que forneceu o recurso
   */
  server: string;
}
```

Retorna o conteúdo do recurso MCP solicitado.

## Tipos de Permissão

### `PermissionUpdate`

Operações para atualizar permissões.

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
  | 'userSettings'     // Configurações globais do usuário
  | 'projectSettings'  // Configurações de projeto por diretório
  | 'localSettings'    // Configurações locais ignoradas pelo Git
  | 'session'          // Apenas sessão atual
```

### `PermissionRuleValue`

```typescript
type PermissionRuleValue = {
  toolName: string;
  ruleContent?: string;
}
```

## Outros Tipos

### `ApiKeySource`

```typescript
type ApiKeySource = 'user' | 'project' | 'org' | 'temporary';
```

### `SdkBeta`

Recursos beta disponíveis que podem ser ativados via opção `betas`. Veja [cabeçalhos beta](/docs/pt-BR/api/beta-headers) para mais informações.

```typescript
type SdkBeta = 'context-1m-2025-08-07';
```

| Valor | Descrição | Modelos Compatíveis |
|:------|:----------|:-------------------|
| `'context-1m-2025-08-07'` | Ativa [janela de contexto](/docs/pt-BR/build-with-claude/context-windows) de 1 milhão de tokens | Claude Sonnet 4, Claude Sonnet 4.5 |

### `SlashCommand`

Informações sobre um comando de barra disponível.

```typescript
type SlashCommand = {
  name: string;
  description: string;
  argumentHint: string;
}
```

### `ModelInfo`

Informações sobre um modelo disponível.

```typescript
type ModelInfo = {
  value: string;
  displayName: string;
  description: string;
}
```

### `McpServerStatus`

Status de um servidor MCP conectado.

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

Informações de conta para o usuário autenticado.

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

Estatísticas de uso por modelo retornadas em mensagens de resultado.

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

Uma versão de [`Usage`](#usage) com todos os campos anuláveis tornados não-anuláveis.

```typescript
type NonNullableUsage = {
  [K in keyof Usage]: NonNullable<Usage[K]>;
}
```

### `Usage`

Estatísticas de uso de tokens (de `@anthropic-ai/sdk`).

```typescript
type Usage = {
  input_tokens: number | null;
  output_tokens: number | null;
  cache_creation_input_tokens?: number | null;
  cache_read_input_tokens?: number | null;
}
```

### `CallToolResult`

Tipo de resultado de ferramenta MCP (de `@modelcontextprotocol/sdk/types.js`).

```typescript
type CallToolResult = {
  content: Array<{
    type: 'text' | 'image' | 'resource';
    // Campos adicionais variam por tipo
  }>;
  isError?: boolean;
}
```

### `AbortError`

Classe de erro personalizada para operações de aborto.

```typescript
class AbortError extends Error {}
```

## Configuração de Sandbox

### `SandboxSettings`

Configuração para comportamento de sandbox. Use isso para ativar sandboxing de comando e configurar restrições de rede programaticamente.

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

| Propriedade | Tipo | Padrão | Descrição |
| :---------- | :--- | :----- | :-------- |
| `enabled` | `boolean` | `false` | Ativar modo sandbox para execução de comando |
| `autoAllowBashIfSandboxed` | `boolean` | `false` | Aprovar automaticamente comandos bash quando o sandbox está ativado |
| `excludedCommands` | `string[]` | `[]` | Comandos que sempre contornam restrições de sandbox (por exemplo, `['docker']`). Estes são executados sem sandbox automaticamente sem envolvimento do modelo |
| `allowUnsandboxedCommands` | `boolean` | `false` | Permitir que o modelo solicite executar comandos fora do sandbox. Quando `true`, o modelo pode definir `dangerouslyDisableSandbox` na entrada da ferramenta, que volta para o [sistema de permissões](#permissions-fallback-for-unsandboxed-commands) |
| `network` | [`NetworkSandboxSettings`](#networksandboxsettings) | `undefined` | Configuração de sandbox específica de rede |
| `ignoreViolations` | [`SandboxIgnoreViolations`](#sandboxignoreviolations) | `undefined` | Configurar quais violações de sandbox ignorar |
| `enableWeakerNestedSandbox` | `boolean` | `false` | Ativar um sandbox aninhado mais fraco para compatibilidade |

<Note>
**Restrições de acesso ao sistema de arquivos e rede** NÃO são configuradas via configurações de sandbox. Em vez disso, são derivadas de [regras de permissão](https://code.claude.com/docs/pt-BR/settings#permission-settings):

- **Restrições de leitura do sistema de arquivos**: Regras de negação de leitura
- **Restrições de escrita do sistema de arquivos**: Regras de permissão/negação de edição
- **Restrições de rede**: Regras de permissão/negação de WebFetch

Use configurações de sandbox para sandboxing de execução de comando e regras de permissão para controle de acesso ao sistema de arquivos e rede.
</Note>

#### Exemplo de uso

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

Configuração específica de rede para modo sandbox.

```typescript
type NetworkSandboxSettings = {
  allowLocalBinding?: boolean;
  allowUnixSockets?: string[];
  allowAllUnixSockets?: boolean;
  httpProxyPort?: number;
  socksProxyPort?: number;
}
```

| Propriedade | Tipo | Padrão | Descrição |
| :---------- | :--- | :----- | :-------- |
| `allowLocalBinding` | `boolean` | `false` | Permitir que processos se vinculem a portas locais (por exemplo, para servidores de desenvolvimento) |
| `allowUnixSockets` | `string[]` | `[]` | Caminhos de socket Unix que processos podem acessar (por exemplo, socket Docker) |
| `allowAllUnixSockets` | `boolean` | `false` | Permitir acesso a todos os sockets Unix |
| `httpProxyPort` | `number` | `undefined` | Porta proxy HTTP para solicitações de rede |
| `socksProxyPort` | `number` | `undefined` | Porta proxy SOCKS para solicitações de rede |

### `SandboxIgnoreViolations`

Configuração para ignorar violações específicas de sandbox.

```typescript
type SandboxIgnoreViolations = {
  file?: string[];
  network?: string[];
}
```

| Propriedade | Tipo | Padrão | Descrição |
| :---------- | :--- | :----- | :-------- |
| `file` | `string[]` | `[]` | Padrões de caminho de arquivo para ignorar violações |
| `network` | `string[]` | `[]` | Padrões de rede para ignorar violações |

### Fallback de Permissões para Comandos Sem Sandbox

Quando `allowUnsandboxedCommands` está ativado, o modelo pode solicitar executar comandos fora do sandbox definindo `dangerouslyDisableSandbox: true` na entrada da ferramenta. Essas solicitações voltam para o sistema de permissões existente, significando que seu manipulador `canUseTool` será invocado, permitindo que você implemente lógica de autorização personalizada.

<Note>
**`excludedCommands` vs `allowUnsandboxedCommands`:**
- `excludedCommands`: Uma lista estática de comandos que sempre contornam o sandbox automaticamente (por exemplo, `['docker']`). O modelo não tem controle sobre isso.
- `allowUnsandboxedCommands`: Permite que o modelo decida em tempo de execução se deve solicitar execução sem sandbox definindo `dangerouslyDisableSandbox: true` na entrada da ferramenta.
</Note>

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

const result = await query({
  prompt: "Deploy my application",
  options: {
    sandbox: {
      enabled: true,
      allowUnsandboxedCommands: true  // O modelo pode solicitar execução sem sandbox
    },
    permissionMode: "default",
    canUseTool: async (tool, input) => {
      // Verificar se o modelo está solicitando contornar o sandbox
      if (tool === "Bash" && input.dangerouslyDisableSandbox) {
        // O modelo quer executar este comando fora do sandbox
        console.log(`Unsandboxed command requested: ${input.command}`);

        // Retornar true para permitir, false para negar
        return isCommandAuthorized(input.command);
      }
      return true;
    }
  }
});
```

Este padrão permite que você:

- **Audite solicitações do modelo**: Registre quando o modelo solicita execução sem sandbox
- **Implemente listas de permissão**: Permita apenas comandos específicos para executar sem sandbox
- **Adicione fluxos de trabalho de aprovação**: Exija autorização explícita para operações privilegiadas

<Warning>
Comandos em execução com `dangerouslyDisableSandbox: true` têm acesso total ao sistema. Certifique-se de que seu manipulador `canUseTool` valide essas solicitações cuidadosamente.
</Warning>

## Veja também

- [Visão geral do SDK](/docs/pt-BR/agent-sdk/overview) - Conceitos gerais do SDK
- [Referência do SDK Python](/docs/pt-BR/agent-sdk/python) - Documentação do SDK Python
- [Referência da CLI](https://code.claude.com/docs/pt-BR/cli-reference) - Interface de linha de comando
- [Fluxos de trabalho comuns](https://code.claude.com/docs/pt-BR/common-workflows) - Guias passo a passo