# Référence du SDK Agent - TypeScript

Référence API complète du SDK Agent TypeScript, incluant toutes les fonctions, types et interfaces.

---

<script src="/components/typescript-sdk-type-links.js" defer />

<Note>
**Essayez la nouvelle interface V2 (aperçu) :** Une interface simplifiée avec les modèles `send()` et `receive()` est maintenant disponible, ce qui facilite les conversations multi-tours. [En savoir plus](/docs/fr/agent-sdk/typescript-v2-preview)
</Note>

## Installation

```bash
npm install @anthropic-ai/claude-agent-sdk
```

## Fonctions

### `query()`

La fonction principale pour interagir avec Claude Code. Crée un générateur asynchrone qui diffuse les messages au fur et à mesure de leur arrivée.

```typescript
function query({
  prompt,
  options
}: {
  prompt: string | AsyncIterable<SDKUserMessage>;
  options?: Options;
}): Query
```

#### Paramètres

| Paramètre | Type | Description |
| :-------- | :--- | :---------- |
| `prompt` | `string \| AsyncIterable<`[`SDKUserMessage`](#sdkusermessage)`>` | L'invite d'entrée sous forme de chaîne ou d'itérable asynchrone pour le mode de diffusion |
| `options` | [`Options`](#options) | Objet de configuration optionnel (voir le type Options ci-dessous) |

#### Retours

Retourne un objet [`Query`](#query-1) qui étend `AsyncGenerator<`[`SDKMessage`](#sdkmessage)`, void>` avec des méthodes supplémentaires.

### `tool()`

Crée une définition d'outil MCP type-safe pour une utilisation avec les serveurs MCP du SDK.

```typescript
function tool<Schema extends ZodRawShape>(
  name: string,
  description: string,
  inputSchema: Schema,
  handler: (args: z.infer<ZodObject<Schema>>, extra: unknown) => Promise<CallToolResult>
): SdkMcpToolDefinition<Schema>
```

#### Paramètres

| Paramètre | Type | Description |
| :-------- | :--- | :---------- |
| `name` | `string` | Le nom de l'outil |
| `description` | `string` | Une description de ce que fait l'outil |
| `inputSchema` | `Schema extends ZodRawShape` | Schéma Zod définissant les paramètres d'entrée de l'outil |
| `handler` | `(args, extra) => Promise<`[`CallToolResult`](#calltoolresult)`>` | Fonction asynchrone qui exécute la logique de l'outil |

### `createSdkMcpServer()`

Crée une instance de serveur MCP qui s'exécute dans le même processus que votre application.

```typescript
function createSdkMcpServer(options: {
  name: string;
  version?: string;
  tools?: Array<SdkMcpToolDefinition<any>>;
}): McpSdkServerConfigWithInstance
```

#### Paramètres

| Paramètre | Type | Description |
| :-------- | :--- | :---------- |
| `options.name` | `string` | Le nom du serveur MCP |
| `options.version` | `string` | Chaîne de version optionnelle |
| `options.tools` | `Array<SdkMcpToolDefinition>` | Tableau de définitions d'outils créées avec [`tool()`](#tool) |

## Types

### `Options`

Objet de configuration pour la fonction `query()`.

| Propriété | Type | Par défaut | Description |
| :------- | :--- | :------ | :---------- |
| `abortController` | `AbortController` | `new AbortController()` | Contrôleur pour annuler les opérations |
| `additionalDirectories` | `string[]` | `[]` | Répertoires supplémentaires auxquels Claude peut accéder |
| `agents` | `Record<string, [`AgentDefinition`](#agentdefinition)>` | `undefined` | Définir les sous-agents par programmation |
| `allowDangerouslySkipPermissions` | `boolean` | `false` | Activer le contournement des permissions. Requis lors de l'utilisation de `permissionMode: 'bypassPermissions'` |
| `allowedTools` | `string[]` | Tous les outils | Liste des noms d'outils autorisés |
| `betas` | [`SdkBeta`](#sdkbeta)`[]` | `[]` | Activer les fonctionnalités bêta (par exemple, `['context-1m-2025-08-07']`) |
| `canUseTool` | [`CanUseTool`](#canusetool) | `undefined` | Fonction de permission personnalisée pour l'utilisation des outils |
| `continue` | `boolean` | `false` | Continuer la conversation la plus récente |
| `cwd` | `string` | `process.cwd()` | Répertoire de travail actuel |
| `disallowedTools` | `string[]` | `[]` | Liste des noms d'outils non autorisés |
| `env` | `Dict<string>` | `process.env` | Variables d'environnement |
| `executable` | `'bun' \| 'deno' \| 'node'` | Détection automatique | Runtime JavaScript à utiliser |
| `executableArgs` | `string[]` | `[]` | Arguments à passer à l'exécutable |
| `extraArgs` | `Record<string, string \| null>` | `{}` | Arguments supplémentaires |
| `fallbackModel` | `string` | `undefined` | Modèle à utiliser si le modèle principal échoue |
| `forkSession` | `boolean` | `false` | Lors de la reprise avec `resume`, créer une nouvelle session au lieu de continuer la session d'origine |
| `hooks` | `Partial<Record<`[`HookEvent`](#hookevent)`, `[`HookCallbackMatcher`](#hookcallbackmatcher)`[]>>` | `{}` | Rappels de crochet pour les événements |
| `includePartialMessages` | `boolean` | `false` | Inclure les événements de messages partiels |
| `maxBudgetUsd` | `number` | `undefined` | Budget maximum en USD pour la requête |
| `maxThinkingTokens` | `number` | `undefined` | Jetons maximum pour le processus de réflexion |
| `maxTurns` | `number` | `undefined` | Tours de conversation maximum |
| `mcpServers` | `Record<string, [`McpServerConfig`](#mcpserverconfig)>` | `{}` | Configurations du serveur MCP |
| `model` | `string` | Par défaut de la CLI | Modèle Claude à utiliser |
| `outputFormat` | `{ type: 'json_schema', schema: JSONSchema }` | `undefined` | Définir le format de sortie pour les résultats de l'agent. Voir [Sorties structurées](/docs/fr/agent-sdk/structured-outputs) pour plus de détails |
| `pathToClaudeCodeExecutable` | `string` | Utilise l'exécutable intégré | Chemin vers l'exécutable Claude Code |
| `permissionMode` | [`PermissionMode`](#permissionmode) | `'default'` | Mode de permission pour la session |
| `permissionPromptToolName` | `string` | `undefined` | Nom de l'outil MCP pour les invites de permission |
| `plugins` | [`SdkPluginConfig`](#sdkpluginconfig)`[]` | `[]` | Charger les plugins personnalisés à partir de chemins locaux. Voir [Plugins](/docs/fr/agent-sdk/plugins) pour plus de détails |
| `resume` | `string` | `undefined` | ID de session à reprendre |
| `resumeSessionAt` | `string` | `undefined` | Reprendre la session à un UUID de message spécifique |
| `sandbox` | [`SandboxSettings`](#sandboxsettings) | `undefined` | Configurer le comportement du bac à sable par programmation. Voir [Paramètres du bac à sable](#sandboxsettings) pour plus de détails |
| `settingSources` | [`SettingSource`](#settingsource)`[]` | `[]` (pas de paramètres) | Contrôler quels paramètres basés sur le système de fichiers charger. Lorsqu'il est omis, aucun paramètre n'est chargé. **Remarque :** Doit inclure `'project'` pour charger les fichiers CLAUDE.md |
| `stderr` | `(data: string) => void` | `undefined` | Rappel pour la sortie stderr |
| `strictMcpConfig` | `boolean` | `false` | Appliquer la validation MCP stricte |
| `systemPrompt` | `string \| { type: 'preset'; preset: 'claude_code'; append?: string }` | `undefined` (invite vide) | Configuration de l'invite système. Passez une chaîne pour une invite personnalisée, ou `{ type: 'preset', preset: 'claude_code' }` pour utiliser l'invite système de Claude Code. Lors de l'utilisation de la forme d'objet prédéfini, ajoutez `append` pour étendre l'invite système avec des instructions supplémentaires |
| `tools` | `string[] \| { type: 'preset'; preset: 'claude_code' }` | `undefined` | Configuration des outils. Passez un tableau de noms d'outils ou utilisez le prédéfini pour obtenir les outils par défaut de Claude Code |

### `Query`

Interface retournée par la fonction `query()`.

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

#### Méthodes

| Méthode | Description |
| :----- | :---------- |
| `interrupt()` | Interrompt la requête (disponible uniquement en mode d'entrée en diffusion) |
| `setPermissionMode()` | Change le mode de permission (disponible uniquement en mode d'entrée en diffusion) |
| `setModel()` | Change le modèle (disponible uniquement en mode d'entrée en diffusion) |
| `setMaxThinkingTokens()` | Change les jetons de réflexion maximum (disponible uniquement en mode d'entrée en diffusion) |
| `supportedCommands()` | Retourne les commandes slash disponibles |
| `supportedModels()` | Retourne les modèles disponibles avec les informations d'affichage |
| `mcpServerStatus()` | Retourne l'état des serveurs MCP connectés |
| `accountInfo()` | Retourne les informations du compte |

### `AgentDefinition`

Configuration pour un sous-agent défini par programmation.

```typescript
type AgentDefinition = {
  description: string;
  tools?: string[];
  prompt: string;
  model?: 'sonnet' | 'opus' | 'haiku' | 'inherit';
}
```

| Champ | Requis | Description |
|:------|:---------|:------------|
| `description` | Oui | Description en langage naturel de quand utiliser cet agent |
| `tools` | Non | Tableau des noms d'outils autorisés. S'il est omis, hérite tous les outils |
| `prompt` | Oui | L'invite système de l'agent |
| `model` | Non | Remplacement du modèle pour cet agent. S'il est omis, utilise le modèle principal |

### `SettingSource`

Contrôle les sources de configuration basées sur le système de fichiers que le SDK charge.

```typescript
type SettingSource = 'user' | 'project' | 'local';
```

| Valeur | Description | Emplacement |
|:------|:------------|:---------|
| `'user'` | Paramètres utilisateur globaux | `~/.claude/settings.json` |
| `'project'` | Paramètres de projet partagés (contrôle de version) | `.claude/settings.json` |
| `'local'` | Paramètres de projet locaux (gitignorés) | `.claude/settings.local.json` |

#### Comportement par défaut

Lorsque `settingSources` est **omis** ou **undefined**, le SDK ne charge **pas** les paramètres du système de fichiers. Cela fournit l'isolation pour les applications SDK.

#### Pourquoi utiliser settingSources ?

**Charger tous les paramètres du système de fichiers (comportement hérité) :**
```typescript
// Charger tous les paramètres comme le SDK v0.0.x l'a fait
const result = query({
  prompt: "Analyze this code",
  options: {
    settingSources: ['user', 'project', 'local']  // Charger tous les paramètres
  }
});
```

**Charger uniquement des sources de paramètres spécifiques :**
```typescript
// Charger uniquement les paramètres du projet, ignorer les paramètres utilisateur et locaux
const result = query({
  prompt: "Run CI checks",
  options: {
    settingSources: ['project']  // Uniquement .claude/settings.json
  }
});
```

**Environnements de test et CI :**
```typescript
// Assurer un comportement cohérent en CI en excluant les paramètres locaux
const result = query({
  prompt: "Run tests",
  options: {
    settingSources: ['project'],  // Uniquement les paramètres partagés par l'équipe
    permissionMode: 'bypassPermissions'
  }
});
```

**Applications SDK uniquement :**
```typescript
// Définir tout par programmation (comportement par défaut)
// Pas de dépendances du système de fichiers - settingSources par défaut à []
const result = query({
  prompt: "Review this PR",
  options: {
    // settingSources: [] est la valeur par défaut, pas besoin de spécifier
    agents: { /* ... */ },
    mcpServers: { /* ... */ },
    allowedTools: ['Read', 'Grep', 'Glob']
  }
});
```

**Chargement des instructions du projet CLAUDE.md :**
```typescript
// Charger les paramètres du projet pour inclure les fichiers CLAUDE.md
const result = query({
  prompt: "Add a new feature following project conventions",
  options: {
    systemPrompt: {
      type: 'preset',
      preset: 'claude_code'  // Requis pour utiliser CLAUDE.md
    },
    settingSources: ['project'],  // Charge CLAUDE.md à partir du répertoire du projet
    allowedTools: ['Read', 'Write', 'Edit']
  }
});
```

#### Précédence des paramètres

Lorsque plusieurs sources sont chargées, les paramètres sont fusionnés avec cette précédence (la plus élevée à la plus basse) :
1. Paramètres locaux (`.claude/settings.local.json`)
2. Paramètres du projet (`.claude/settings.json`)
3. Paramètres utilisateur (`~/.claude/settings.json`)

Les options programmatiques (comme `agents`, `allowedTools`) remplacent toujours les paramètres du système de fichiers.

### `PermissionMode`

```typescript
type PermissionMode =
  | 'default'           // Comportement de permission standard
  | 'acceptEdits'       // Accepter automatiquement les modifications de fichiers
  | 'bypassPermissions' // Contourner tous les contrôles de permission
  | 'plan'              // Mode de planification - pas d'exécution
```

### `CanUseTool`

Type de fonction de permission personnalisée pour contrôler l'utilisation des outils.

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

Résultat d'une vérification de permission.

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

Configuration pour les serveurs MCP.

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

Configuration pour charger les plugins dans le SDK.

```typescript
type SdkPluginConfig = {
  type: 'local';
  path: string;
}
```

| Champ | Type | Description |
|:------|:-----|:------------|
| `type` | `'local'` | Doit être `'local'` (seuls les plugins locaux sont actuellement supportés) |
| `path` | `string` | Chemin absolu ou relatif vers le répertoire du plugin |

**Exemple :**
```typescript
plugins: [
  { type: 'local', path: './my-plugin' },
  { type: 'local', path: '/absolute/path/to/plugin' }
]
```

Pour des informations complètes sur la création et l'utilisation de plugins, voir [Plugins](/docs/fr/agent-sdk/plugins).

## Types de messages

### `SDKMessage`

Type union de tous les messages possibles retournés par la requête.

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

Message de réponse de l'assistant.

```typescript
type SDKAssistantMessage = {
  type: 'assistant';
  uuid: UUID;
  session_id: string;
  message: APIAssistantMessage; // Du SDK Anthropic
  parent_tool_use_id: string | null;
}
```

### `SDKUserMessage`

Message d'entrée utilisateur.

```typescript
type SDKUserMessage = {
  type: 'user';
  uuid?: UUID;
  session_id: string;
  message: APIUserMessage; // Du SDK Anthropic
  parent_tool_use_id: string | null;
}
```

### `SDKUserMessageReplay`

Message utilisateur rejoué avec UUID requis.

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

Message de résultat final.

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

Message d'initialisation du système.

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

Message partiel en diffusion (uniquement lorsque `includePartialMessages` est true).

```typescript
type SDKPartialAssistantMessage = {
  type: 'stream_event';
  event: RawMessageStreamEvent; // Du SDK Anthropic
  parent_tool_use_id: string | null;
  uuid: UUID;
  session_id: string;
}
```

### `SDKCompactBoundaryMessage`

Message indiquant une limite de compaction de conversation.

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

Informations sur une utilisation d'outil refusée.

```typescript
type SDKPermissionDenial = {
  tool_name: string;
  tool_use_id: string;
  tool_input: ToolInput;
}
```

## Types de crochet

Pour un guide complet sur l'utilisation des crochets avec des exemples et des modèles courants, voir le [guide des crochets](/docs/fr/agent-sdk/hooks).

### `HookEvent`

Événements de crochet disponibles.

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

Type de fonction de rappel de crochet.

```typescript
type HookCallback = (
  input: HookInput, // Union de tous les types d'entrée de crochet
  toolUseID: string | undefined,
  options: { signal: AbortSignal }
) => Promise<HookJSONOutput>;
```

### `HookCallbackMatcher`

Configuration de crochet avec correspondant optionnel.

```typescript
interface HookCallbackMatcher {
  matcher?: string;
  hooks: HookCallback[];
}
```

### `HookInput`

Type union de tous les types d'entrée de crochet.

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

Interface de base que tous les types d'entrée de crochet étendent.

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
  reason: ExitReason;  // Chaîne du tableau EXIT_REASONS
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

Valeur de retour du crochet.

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

## Types d'entrée d'outil

Documentation des schémas d'entrée pour tous les outils Claude Code intégrés. Ces types sont exportés depuis `@anthropic-ai/claude-agent-sdk` et peuvent être utilisés pour les interactions d'outils type-safe.

### `ToolInput`

**Remarque :** Ceci est un type de documentation uniquement pour la clarté. Il représente l'union de tous les types d'entrée d'outil.

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

**Nom de l'outil :** `Task`

```typescript
interface AgentInput {
  /**
   * Une description courte (3-5 mots) de la tâche
   */
  description: string;
  /**
   * La tâche que l'agent doit effectuer
   */
  prompt: string;
  /**
   * Le type d'agent spécialisé à utiliser pour cette tâche
   */
  subagent_type: string;
}
```

Lance un nouvel agent pour gérer les tâches complexes et multi-étapes de manière autonome.

### AskUserQuestion

**Nom de l'outil :** `AskUserQuestion`

```typescript
interface AskUserQuestionInput {
  /**
   * Questions à poser à l'utilisateur (1-4 questions)
   */
  questions: Array<{
    /**
     * La question complète à poser à l'utilisateur. Doit être claire, spécifique,
     * et se terminer par un point d'interrogation.
     */
    question: string;
    /**
     * Étiquette très courte affichée sous forme de puce/tag (max 12 caractères).
     * Exemples : "Auth method", "Library", "Approach"
     */
    header: string;
    /**
     * Les choix disponibles (2-4 options). Une option "Other" est
     * automatiquement fournie.
     */
    options: Array<{
      /**
       * Texte d'affichage pour cette option (1-5 mots)
       */
      label: string;
      /**
       * Explication de ce que signifie cette option
       */
      description: string;
    }>;
    /**
     * Définir à true pour permettre les sélections multiples
     */
    multiSelect: boolean;
  }>;
  /**
   * Réponses utilisateur remplies par le système de permission.
   * Mappe le texte de la question aux étiquettes d'option sélectionnées.
   * Les réponses multi-sélection sont séparées par des virgules.
   */
  answers?: Record<string, string>;
}
```

Pose des questions de clarification à l'utilisateur pendant l'exécution. Voir [Gestion de l'outil AskUserQuestion](/docs/fr/agent-sdk/permissions#handling-the-askuserquestion-tool) pour les détails d'utilisation.

### Bash

**Nom de l'outil :** `Bash`

```typescript
interface BashInput {
  /**
   * La commande à exécuter
   */
  command: string;
  /**
   * Délai d'expiration optionnel en millisecondes (max 600000)
   */
  timeout?: number;
  /**
   * Description claire et concise de ce que fait cette commande en 5-10 mots
   */
  description?: string;
  /**
   * Définir à true pour exécuter cette commande en arrière-plan
   */
  run_in_background?: boolean;
}
```

Exécute les commandes bash dans une session shell persistante avec délai d'expiration optionnel et exécution en arrière-plan.

### BashOutput

**Nom de l'outil :** `BashOutput`

```typescript
interface BashOutputInput {
  /**
   * L'ID du shell en arrière-plan à partir duquel récupérer la sortie
   */
  bash_id: string;
  /**
   * Regex optionnel pour filtrer les lignes de sortie
   */
  filter?: string;
}
```

Récupère la sortie d'un shell bash en arrière-plan en cours d'exécution ou terminé.

### Edit

**Nom de l'outil :** `Edit`

```typescript
interface FileEditInput {
  /**
   * Le chemin absolu du fichier à modifier
   */
  file_path: string;
  /**
   * Le texte à remplacer
   */
  old_string: string;
  /**
   * Le texte pour le remplacer (doit être différent de old_string)
   */
  new_string: string;
  /**
   * Remplacer toutes les occurrences de old_string (par défaut false)
   */
  replace_all?: boolean;
}
```

Effectue les remplacements de chaînes exactes dans les fichiers.

### Read

**Nom de l'outil :** `Read`

```typescript
interface FileReadInput {
  /**
   * Le chemin absolu du fichier à lire
   */
  file_path: string;
  /**
   * Le numéro de ligne à partir duquel commencer la lecture
   */
  offset?: number;
  /**
   * Le nombre de lignes à lire
   */
  limit?: number;
}
```

Lit les fichiers du système de fichiers local, y compris le texte, les images, les PDF et les notebooks Jupyter.

### Write

**Nom de l'outil :** `Write`

```typescript
interface FileWriteInput {
  /**
   * Le chemin absolu du fichier à écrire
   */
  file_path: string;
  /**
   * Le contenu à écrire dans le fichier
   */
  content: string;
}
```

Écrit un fichier dans le système de fichiers local, en écrasant s'il existe.

### Glob

**Nom de l'outil :** `Glob`

```typescript
interface GlobInput {
  /**
   * Le motif glob à faire correspondre aux fichiers
   */
  pattern: string;
  /**
   * Le répertoire à rechercher (par défaut cwd)
   */
  path?: string;
}
```

Correspondance de motif de fichier rapide qui fonctionne avec n'importe quelle taille de base de code.

### Grep

**Nom de l'outil :** `Grep`

```typescript
interface GrepInput {
  /**
   * Le motif d'expression régulière à rechercher
   */
  pattern: string;
  /**
   * Fichier ou répertoire à rechercher (par défaut cwd)
   */
  path?: string;
  /**
   * Motif glob pour filtrer les fichiers (par exemple "*.js")
   */
  glob?: string;
  /**
   * Type de fichier à rechercher (par exemple "js", "py", "rust")
   */
  type?: string;
  /**
   * Mode de sortie : "content", "files_with_matches", ou "count"
   */
  output_mode?: 'content' | 'files_with_matches' | 'count';
  /**
   * Recherche insensible à la casse
   */
  '-i'?: boolean;
  /**
   * Afficher les numéros de ligne (pour le mode contenu)
   */
  '-n'?: boolean;
  /**
   * Lignes à afficher avant chaque correspondance
   */
  '-B'?: number;
  /**
   * Lignes à afficher après chaque correspondance
   */
  '-A'?: number;
  /**
   * Lignes à afficher avant et après chaque correspondance
   */
  '-C'?: number;
  /**
   * Limiter la sortie aux N premières lignes/entrées
   */
  head_limit?: number;
  /**
   * Activer le mode multiligne
   */
  multiline?: boolean;
}
```

Outil de recherche puissant basé sur ripgrep avec support des expressions régulières.

### KillBash

**Nom de l'outil :** `KillBash`

```typescript
interface KillShellInput {
  /**
   * L'ID du shell en arrière-plan à arrêter
   */
  shell_id: string;
}
```

Arrête un shell bash en arrière-plan en cours d'exécution par son ID.

### NotebookEdit

**Nom de l'outil :** `NotebookEdit`

```typescript
interface NotebookEditInput {
  /**
   * Le chemin absolu du fichier notebook Jupyter
   */
  notebook_path: string;
  /**
   * L'ID de la cellule à modifier
   */
  cell_id?: string;
  /**
   * La nouvelle source pour la cellule
   */
  new_source: string;
  /**
   * Le type de la cellule (code ou markdown)
   */
  cell_type?: 'code' | 'markdown';
  /**
   * Le type de modification (replace, insert, delete)
   */
  edit_mode?: 'replace' | 'insert' | 'delete';
}
```

Modifie les cellules dans les fichiers notebook Jupyter.

### WebFetch

**Nom de l'outil :** `WebFetch`

```typescript
interface WebFetchInput {
  /**
   * L'URL à partir de laquelle récupérer le contenu
   */
  url: string;
  /**
   * L'invite à exécuter sur le contenu récupéré
   */
  prompt: string;
}
```

Récupère le contenu d'une URL et le traite avec un modèle IA.

### WebSearch

**Nom de l'outil :** `WebSearch`

```typescript
interface WebSearchInput {
  /**
   * La requête de recherche à utiliser
   */
  query: string;
  /**
   * Inclure uniquement les résultats de ces domaines
   */
  allowed_domains?: string[];
  /**
   * Ne jamais inclure les résultats de ces domaines
   */
  blocked_domains?: string[];
}
```

Recherche le web et retourne les résultats formatés.

### TodoWrite

**Nom de l'outil :** `TodoWrite`

```typescript
interface TodoWriteInput {
  /**
   * La liste de tâches mise à jour
   */
  todos: Array<{
    /**
     * La description de la tâche
     */
    content: string;
    /**
     * L'état de la tâche
     */
    status: 'pending' | 'in_progress' | 'completed';
    /**
     * Forme active de la description de la tâche
     */
    activeForm: string;
  }>;
}
```

Crée et gère une liste de tâches structurée pour suivre la progression.

### ExitPlanMode

**Nom de l'outil :** `ExitPlanMode`

```typescript
interface ExitPlanModeInput {
  /**
   * Le plan à exécuter par l'utilisateur pour approbation
   */
  plan: string;
}
```

Quitte le mode de planification et demande à l'utilisateur d'approuver le plan.

### ListMcpResources

**Nom de l'outil :** `ListMcpResources`

```typescript
interface ListMcpResourcesInput {
  /**
   * Nom du serveur optionnel pour filtrer les ressources par
   */
  server?: string;
}
```

Liste les ressources MCP disponibles à partir des serveurs connectés.

### ReadMcpResource

**Nom de l'outil :** `ReadMcpResource`

```typescript
interface ReadMcpResourceInput {
  /**
   * Le nom du serveur MCP
   */
  server: string;
  /**
   * L'URI de la ressource à lire
   */
  uri: string;
}
```

Lit une ressource MCP spécifique à partir d'un serveur.

## Types de sortie d'outil

Documentation des schémas de sortie pour tous les outils Claude Code intégrés. Ces types représentent les données de réponse réelles retournées par chaque outil.

### `ToolOutput`

**Remarque :** Ceci est un type de documentation uniquement pour la clarté. Il représente l'union de tous les types de sortie d'outil.

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

**Nom de l'outil :** `Task`

```typescript
interface TaskOutput {
  /**
   * Message de résultat final du sous-agent
   */
  result: string;
  /**
   * Statistiques d'utilisation des jetons
   */
  usage?: {
    input_tokens: number;
    output_tokens: number;
    cache_creation_input_tokens?: number;
    cache_read_input_tokens?: number;
  };
  /**
   * Coût total en USD
   */
  total_cost_usd?: number;
  /**
   * Durée d'exécution en millisecondes
   */
  duration_ms?: number;
}
```

Retourne le résultat final du sous-agent après avoir complété la tâche déléguée.

### AskUserQuestion

**Nom de l'outil :** `AskUserQuestion`

```typescript
interface AskUserQuestionOutput {
  /**
   * Les questions qui ont été posées
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
   * Les réponses fournies par l'utilisateur.
   * Mappe le texte de la question à la chaîne de réponse.
   * Les réponses multi-sélection sont séparées par des virgules.
   */
  answers: Record<string, string>;
}
```

Retourne les questions posées et les réponses de l'utilisateur.

### Bash

**Nom de l'outil :** `Bash`

```typescript
interface BashOutput {
  /**
   * Sortie combinée de stdout et stderr
   */
  output: string;
  /**
   * Code de sortie de la commande
   */
  exitCode: number;
  /**
   * Si la commande a été arrêtée en raison d'un délai d'expiration
   */
  killed?: boolean;
  /**
   * ID du shell pour les processus en arrière-plan
   */
  shellId?: string;
}
```

Retourne la sortie de la commande avec l'état de sortie. Les commandes en arrière-plan retournent immédiatement avec un shellId.

### BashOutput

**Nom de l'outil :** `BashOutput`

```typescript
interface BashOutputToolOutput {
  /**
   * Nouvelle sortie depuis la dernière vérification
   */
  output: string;
  /**
   * État actuel du shell
   */
  status: 'running' | 'completed' | 'failed';
  /**
   * Code de sortie (lorsque terminé)
   */
  exitCode?: number;
}
```

Retourne la sortie incrémentale des shells en arrière-plan.

### Edit

**Nom de l'outil :** `Edit`

```typescript
interface EditOutput {
  /**
   * Message de confirmation
   */
  message: string;
  /**
   * Nombre de remplacements effectués
   */
  replacements: number;
  /**
   * Chemin du fichier qui a été modifié
   */
  file_path: string;
}
```

Retourne la confirmation des modifications réussies avec le nombre de remplacements.

### Lire

**Nom de l'outil :** `Read`

```typescript
type ReadOutput = 
  | TextFileOutput
  | ImageFileOutput
  | PDFFileOutput
  | NotebookFileOutput;

interface TextFileOutput {
  /**
   * Contenu du fichier avec numéros de ligne
   */
  content: string;
  /**
   * Nombre total de lignes dans le fichier
   */
  total_lines: number;
  /**
   * Lignes réellement retournées
   */
  lines_returned: number;
}

interface ImageFileOutput {
  /**
   * Données d'image codées en Base64
   */
  image: string;
  /**
   * Type MIME de l'image
   */
  mime_type: string;
  /**
   * Taille du fichier en octets
   */
  file_size: number;
}

interface PDFFileOutput {
  /**
   * Tableau des contenus de page
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
   * Nombre total de pages
   */
  total_pages: number;
}

interface NotebookFileOutput {
  /**
   * Cellules du notebook Jupyter
   */
  cells: Array<{
    cell_type: 'code' | 'markdown';
    source: string;
    outputs?: any[];
    execution_count?: number;
  }>;
  /**
   * Métadonnées du notebook
   */
  metadata?: Record<string, any>;
}
```

Retourne le contenu du fichier dans le format approprié au type de fichier.

### Écrire

**Nom de l'outil :** `Write`

```typescript
interface WriteOutput {
  /**
   * Message de succès
   */
  message: string;
  /**
   * Nombre d'octets écrits
   */
  bytes_written: number;
  /**
   * Chemin du fichier qui a été écrit
   */
  file_path: string;
}
```

Retourne une confirmation après avoir écrit le fichier avec succès.

### Glob

**Nom de l'outil :** `Glob`

```typescript
interface GlobOutput {
  /**
   * Tableau des chemins de fichiers correspondants
   */
  matches: string[];
  /**
   * Nombre de correspondances trouvées
   */
  count: number;
  /**
   * Répertoire de recherche utilisé
   */
  search_path: string;
}
```

Retourne les chemins de fichiers correspondant au motif glob, triés par heure de modification.

### Grep

**Nom de l'outil :** `Grep`

```typescript
type GrepOutput = 
  | GrepContentOutput
  | GrepFilesOutput
  | GrepCountOutput;

interface GrepContentOutput {
  /**
   * Lignes correspondantes avec contexte
   */
  matches: Array<{
    file: string;
    line_number?: number;
    line: string;
    before_context?: string[];
    after_context?: string[];
  }>;
  /**
   * Nombre total de correspondances
   */
  total_matches: number;
}

interface GrepFilesOutput {
  /**
   * Fichiers contenant des correspondances
   */
  files: string[];
  /**
   * Nombre de fichiers avec correspondances
   */
  count: number;
}

interface GrepCountOutput {
  /**
   * Comptages de correspondances par fichier
   */
  counts: Array<{
    file: string;
    count: number;
  }>;
  /**
   * Total des correspondances dans tous les fichiers
   */
  total: number;
}
```

Retourne les résultats de recherche dans le format spécifié par output_mode.

### KillBash

**Nom de l'outil :** `KillBash`

```typescript
interface KillBashOutput {
  /**
   * Message de succès
   */
  message: string;
  /**
   * ID du shell terminé
   */
  shell_id: string;
}
```

Retourne une confirmation après la fin du shell en arrière-plan.

### NotebookEdit

**Nom de l'outil :** `NotebookEdit`

```typescript
interface NotebookEditOutput {
  /**
   * Message de succès
   */
  message: string;
  /**
   * Type de modification effectuée
   */
  edit_type: 'replaced' | 'inserted' | 'deleted';
  /**
   * ID de la cellule affectée
   */
  cell_id?: string;
  /**
   * Nombre total de cellules dans le notebook après modification
   */
  total_cells: number;
}
```

Retourne une confirmation après la modification du notebook Jupyter.

### WebFetch

**Nom de l'outil :** `WebFetch`

```typescript
interface WebFetchOutput {
  /**
   * Réponse du modèle IA au prompt
   */
  response: string;
  /**
   * URL qui a été récupérée
   */
  url: string;
  /**
   * URL finale après les redirections
   */
  final_url?: string;
  /**
   * Code de statut HTTP
   */
  status_code?: number;
}
```

Retourne l'analyse de l'IA du contenu web récupéré.

### WebSearch

**Nom de l'outil :** `WebSearch`

```typescript
interface WebSearchOutput {
  /**
   * Résultats de recherche
   */
  results: Array<{
    title: string;
    url: string;
    snippet: string;
    /**
     * Métadonnées supplémentaires si disponibles
     */
    metadata?: Record<string, any>;
  }>;
  /**
   * Nombre total de résultats
   */
  total_results: number;
  /**
   * La requête qui a été recherchée
   */
  query: string;
}
```

Retourne les résultats de recherche formatés du web.

### TodoWrite

**Nom de l'outil :** `TodoWrite`

```typescript
interface TodoWriteOutput {
  /**
   * Message de succès
   */
  message: string;
  /**
   * Statistiques actuelles des tâches
   */
  stats: {
    total: number;
    pending: number;
    in_progress: number;
    completed: number;
  };
}
```

Retourne une confirmation avec les statistiques actuelles des tâches.

### ExitPlanMode

**Nom de l'outil :** `ExitPlanMode`

```typescript
interface ExitPlanModeOutput {
  /**
   * Message de confirmation
   */
  message: string;
  /**
   * Si l'utilisateur a approuvé le plan
   */
  approved?: boolean;
}
```

Retourne une confirmation après la sortie du mode plan.

### ListMcpResources

**Nom de l'outil :** `ListMcpResources`

```typescript
interface ListMcpResourcesOutput {
  /**
   * Ressources disponibles
   */
  resources: Array<{
    uri: string;
    name: string;
    description?: string;
    mimeType?: string;
    server: string;
  }>;
  /**
   * Nombre total de ressources
   */
  total: number;
}
```

Retourne la liste des ressources MCP disponibles.

### ReadMcpResource

**Nom de l'outil :** `ReadMcpResource`

```typescript
interface ReadMcpResourceOutput {
  /**
   * Contenu de la ressource
   */
  contents: Array<{
    uri: string;
    mimeType?: string;
    text?: string;
    blob?: string;
  }>;
  /**
   * Serveur qui a fourni la ressource
   */
  server: string;
}
```

Retourne le contenu de la ressource MCP demandée.

## Types de permission

### `PermissionUpdate`

Opérations pour mettre à jour les permissions.

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
  | 'userSettings'     // Paramètres utilisateur globaux
  | 'projectSettings'  // Paramètres de projet par répertoire
  | 'localSettings'    // Paramètres locaux ignorés par Git
  | 'session'          // Session actuelle uniquement
```

### `PermissionRuleValue`

```typescript
type PermissionRuleValue = {
  toolName: string;
  ruleContent?: string;
}
```

## Autres types

### `ApiKeySource`

```typescript
type ApiKeySource = 'user' | 'project' | 'org' | 'temporary';
```

### `SdkBeta`

Les fonctionnalités bêta disponibles qui peuvent être activées via l'option `betas`. Voir [En-têtes bêta](/docs/fr/api/beta-headers) pour plus d'informations.

```typescript
type SdkBeta = 'context-1m-2025-08-07';
```

| Valeur | Description | Modèles compatibles |
|:------|:------------|:------------------|
| `'context-1m-2025-08-07'` | Active la [fenêtre de contexte](/docs/fr/build-with-claude/context-windows) de 1 million de tokens | Claude Sonnet 4, Claude Sonnet 4.5 |

### `SlashCommand`

Informations sur une commande slash disponible.

```typescript
type SlashCommand = {
  name: string;
  description: string;
  argumentHint: string;
}
```

### `ModelInfo`

Informations sur un modèle disponible.

```typescript
type ModelInfo = {
  value: string;
  displayName: string;
  description: string;
}
```

### `McpServerStatus`

Statut d'un serveur MCP connecté.

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

Informations de compte pour l'utilisateur authentifié.

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

Statistiques d'utilisation par modèle retournées dans les messages de résultat.

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

Une version de [`Usage`](#usage) avec tous les champs nullables rendus non-nullables.

```typescript
type NonNullableUsage = {
  [K in keyof Usage]: NonNullable<Usage[K]>;
}
```

### `Usage`

Statistiques d'utilisation des tokens (de `@anthropic-ai/sdk`).

```typescript
type Usage = {
  input_tokens: number | null;
  output_tokens: number | null;
  cache_creation_input_tokens?: number | null;
  cache_read_input_tokens?: number | null;
}
```

### `CallToolResult`

Type de résultat d'outil MCP (de `@modelcontextprotocol/sdk/types.js`).

```typescript
type CallToolResult = {
  content: Array<{
    type: 'text' | 'image' | 'resource';
    // Les champs supplémentaires varient selon le type
  }>;
  isError?: boolean;
}
```

### `AbortError`

Classe d'erreur personnalisée pour les opérations d'abandon.

```typescript
class AbortError extends Error {}
```

## Configuration du bac à sable

### `SandboxSettings`

Configuration du comportement du bac à sable. Utilisez ceci pour activer l'isolation des commandes et configurer les restrictions réseau par programmation.

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

| Propriété | Type | Par défaut | Description |
| :------- | :--- | :------ | :---------- |
| `enabled` | `boolean` | `false` | Activer le mode bac à sable pour l'exécution des commandes |
| `autoAllowBashIfSandboxed` | `boolean` | `false` | Approuver automatiquement les commandes bash lorsque le bac à sable est activé |
| `excludedCommands` | `string[]` | `[]` | Commandes qui contournent toujours les restrictions du bac à sable (par exemple, `['docker']`). Celles-ci s'exécutent sans isolation automatiquement sans intervention du modèle |
| `allowUnsandboxedCommands` | `boolean` | `false` | Permettre au modèle de demander l'exécution de commandes en dehors du bac à sable. Lorsque `true`, le modèle peut définir `dangerouslyDisableSandbox` dans l'entrée de l'outil, ce qui revient au [système de permissions](#permissions-fallback-for-unsandboxed-commands) |
| `network` | [`NetworkSandboxSettings`](#networksandboxsettings) | `undefined` | Configuration du bac à sable spécifique au réseau |
| `ignoreViolations` | [`SandboxIgnoreViolations`](#sandboxignoreviolations) | `undefined` | Configurer les violations du bac à sable à ignorer |
| `enableWeakerNestedSandbox` | `boolean` | `false` | Activer un bac à sable imbriqué plus faible pour la compatibilité |

<Note>
**Les restrictions d'accès au système de fichiers et au réseau** ne sont PAS configurées via les paramètres du bac à sable. Au lieu de cela, elles sont dérivées des [règles de permission](https://code.claude.com/docs/fr/settings#permission-settings) :

- **Restrictions de lecture du système de fichiers** : Règles de refus de lecture
- **Restrictions d'écriture du système de fichiers** : Règles d'autorisation/refus d'édition
- **Restrictions réseau** : Règles d'autorisation/refus de WebFetch

Utilisez les paramètres du bac à sable pour l'isolation des commandes, et les règles de permission pour le contrôle d'accès au système de fichiers et au réseau.
</Note>

#### Exemple d'utilisation

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

Configuration spécifique au réseau pour le mode bac à sable.

```typescript
type NetworkSandboxSettings = {
  allowLocalBinding?: boolean;
  allowUnixSockets?: string[];
  allowAllUnixSockets?: boolean;
  httpProxyPort?: number;
  socksProxyPort?: number;
}
```

| Propriété | Type | Par défaut | Description |
| :------- | :--- | :------ | :---------- |
| `allowLocalBinding` | `boolean` | `false` | Permettre aux processus de se lier aux ports locaux (par exemple, pour les serveurs de développement) |
| `allowUnixSockets` | `string[]` | `[]` | Chemins de socket Unix auxquels les processus peuvent accéder (par exemple, socket Docker) |
| `allowAllUnixSockets` | `boolean` | `false` | Permettre l'accès à tous les sockets Unix |
| `httpProxyPort` | `number` | `undefined` | Port du proxy HTTP pour les requêtes réseau |
| `socksProxyPort` | `number` | `undefined` | Port du proxy SOCKS pour les requêtes réseau |

### `SandboxIgnoreViolations`

Configuration pour ignorer les violations spécifiques du bac à sable.

```typescript
type SandboxIgnoreViolations = {
  file?: string[];
  network?: string[];
}
```

| Propriété | Type | Par défaut | Description |
| :------- | :--- | :------ | :---------- |
| `file` | `string[]` | `[]` | Motifs de chemin de fichier pour lesquels ignorer les violations |
| `network` | `string[]` | `[]` | Motifs réseau pour lesquels ignorer les violations |

### Secours des permissions pour les commandes sans isolation

Lorsque `allowUnsandboxedCommands` est activé, le modèle peut demander l'exécution de commandes en dehors du bac à sable en définissant `dangerouslyDisableSandbox: true` dans l'entrée de l'outil. Ces demandes reviennent au système de permissions existant, ce qui signifie que votre gestionnaire `canUseTool` sera invoqué, vous permettant d'implémenter une logique d'autorisation personnalisée.

<Note>
**`excludedCommands` vs `allowUnsandboxedCommands` :**
- `excludedCommands` : Une liste statique de commandes qui contournent toujours le bac à sable automatiquement (par exemple, `['docker']`). Le modèle n'a aucun contrôle sur ceci.
- `allowUnsandboxedCommands` : Permet au modèle de décider à l'exécution s'il faut demander l'exécution sans isolation en définissant `dangerouslyDisableSandbox: true` dans l'entrée de l'outil.
</Note>

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

const result = await query({
  prompt: "Deploy my application",
  options: {
    sandbox: {
      enabled: true,
      allowUnsandboxedCommands: true  // Le modèle peut demander l'exécution sans isolation
    },
    permissionMode: "default",
    canUseTool: async (tool, input) => {
      // Vérifier si le modèle demande de contourner le bac à sable
      if (tool === "Bash" && input.dangerouslyDisableSandbox) {
        // Le modèle veut exécuter cette commande en dehors du bac à sable
        console.log(`Unsandboxed command requested: ${input.command}`);

        // Retourner true pour autoriser, false pour refuser
        return isCommandAuthorized(input.command);
      }
      return true;
    }
  }
});
```

Ce modèle vous permet de :

- **Auditer les demandes du modèle** : Enregistrer quand le modèle demande l'exécution sans isolation
- **Implémenter des listes blanches** : Permettre uniquement à des commandes spécifiques de s'exécuter sans isolation
- **Ajouter des flux d'approbation** : Exiger une autorisation explicite pour les opérations privilégiées

<Warning>
Les commandes s'exécutant avec `dangerouslyDisableSandbox: true` ont un accès complet au système. Assurez-vous que votre gestionnaire `canUseTool` valide ces demandes avec soin.
</Warning>

## Voir aussi

- [Aperçu du SDK](/docs/fr/agent-sdk/overview) - Concepts généraux du SDK
- [Référence du SDK Python](/docs/fr/agent-sdk/python) - Documentation du SDK Python
- [Référence CLI](https://code.claude.com/docs/fr/cli-reference) - Interface de ligne de commande
- [Flux de travail courants](https://code.claude.com/docs/fr/common-workflows) - Guides étape par étape