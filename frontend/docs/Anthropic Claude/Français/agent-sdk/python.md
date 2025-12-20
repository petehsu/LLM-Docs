# Référence du SDK Agent - Python

Référence API complète pour le SDK Agent Python, incluant toutes les fonctions, types et classes.

---

## Installation

```bash
pip install claude-agent-sdk
```

## Choisir entre `query()` et `ClaudeSDKClient`

Le SDK Python fournit deux façons d'interagir avec Claude Code :

### Comparaison rapide

| Fonctionnalité      | `query()`                     | `ClaudeSDKClient`                  |
| :------------------ | :---------------------------- | :--------------------------------- |
| **Session**         | Crée une nouvelle session à chaque fois | Réutilise la même session                |
| **Conversation**    | Échange unique               | Plusieurs échanges dans le même contexte |
| **Connexion**      | Gérée automatiquement         | Contrôle manuel                     |
| **Entrée en streaming** | ✅ Supportée                  | ✅ Supportée                       |
| **Interruptions**      | ❌ Non supportées              | ✅ Supportées                       |
| **Hooks**           | ❌ Non supportés              | ✅ Supportés                       |
| **Outils personnalisés**    | ❌ Non supportés              | ✅ Supportés                       |
| **Continuer la conversation**   | ❌ Nouvelle session à chaque fois      | ✅ Maintient la conversation          |
| **Cas d'usage**        | Tâches ponctuelles                 | Conversations continues           |

### Quand utiliser `query()` (Nouvelle session à chaque fois)

**Idéal pour :**

- Les questions ponctuelles où vous n'avez pas besoin d'historique de conversation
- Les tâches indépendantes qui ne nécessitent pas de contexte des échanges précédents
- Les scripts d'automatisation simples
- Quand vous voulez un nouveau départ à chaque fois

### Quand utiliser `ClaudeSDKClient` (Conversation continue)

**Idéal pour :**

- **Continuer les conversations** - Quand vous avez besoin que Claude se souvienne du contexte
- **Questions de suivi** - S'appuyer sur les réponses précédentes
- **Applications interactives** - Interfaces de chat, REPLs
- **Logique basée sur les réponses** - Quand l'action suivante dépend de la réponse de Claude
- **Contrôle de session** - Gérer explicitement le cycle de vie de la conversation

## Fonctions

### `query()`

Crée une nouvelle session pour chaque interaction avec Claude Code. Retourne un itérateur asynchrone qui produit des messages au fur et à mesure qu'ils arrivent. Chaque appel à `query()` recommence à zéro sans mémoire des interactions précédentes.

```python
async def query(
    *,
    prompt: str | AsyncIterable[dict[str, Any]],
    options: ClaudeAgentOptions | None = None
) -> AsyncIterator[Message]
```

#### Paramètres

| Paramètre | Type                         | Description                                                                |
| :-------- | :--------------------------- | :------------------------------------------------------------------------- |
| `prompt`  | `str \| AsyncIterable[dict]` | L'invite d'entrée sous forme de chaîne ou d'itérable asynchrone pour le mode streaming          |
| `options` | `ClaudeAgentOptions \| None` | Objet de configuration optionnel (par défaut `ClaudeAgentOptions()` si None) |

#### Retours

Retourne un `AsyncIterator[Message]` qui produit des messages de la conversation.

#### Exemple - Avec options

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

Décorateur pour définir des outils MCP avec sécurité des types.

```python
def tool(
    name: str,
    description: str,
    input_schema: type | dict[str, Any]
) -> Callable[[Callable[[Any], Awaitable[dict[str, Any]]]], SdkMcpTool[Any]]
```

#### Paramètres

| Paramètre      | Type                     | Description                                             |
| :------------- | :----------------------- | :------------------------------------------------------ |
| `name`         | `str`                    | Identifiant unique pour l'outil                          |
| `description`  | `str`                    | Description lisible par l'homme de ce que fait l'outil        |
| `input_schema` | `type \| dict[str, Any]` | Schéma définissant les paramètres d'entrée de l'outil (voir ci-dessous) |

#### Options de schéma d'entrée

1. **Mappage de type simple** (recommandé):

   ```python
   {"text": str, "count": int, "enabled": bool}
   ```

2. **Format JSON Schema** (pour la validation complexe):
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

#### Retours

Une fonction décorateur qui enveloppe l'implémentation de l'outil et retourne une instance `SdkMcpTool`.

#### Exemple

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

Créer un serveur MCP en processus qui s'exécute dans votre application Python.

```python
def create_sdk_mcp_server(
    name: str,
    version: str = "1.0.0",
    tools: list[SdkMcpTool[Any]] | None = None
) -> McpSdkServerConfig
```

#### Paramètres

| Paramètre | Type                            | Défaut    | Description                                           |
| :-------- | :------------------------------ | :-------- | :---------------------------------------------------- |
| `name`    | `str`                           | -         | Identifiant unique pour le serveur                      |
| `version` | `str`                           | `"1.0.0"` | Chaîne de version du serveur                                 |
| `tools`   | `list[SdkMcpTool[Any]] \| None` | `None`    | Liste des fonctions d'outil créées avec le décorateur `@tool` |

#### Retours

Retourne un objet `McpSdkServerConfig` qui peut être passé à `ClaudeAgentOptions.mcp_servers`.

#### Exemple

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

## Classes

### `ClaudeSDKClient`

**Maintient une session de conversation sur plusieurs échanges.** C'est l'équivalent Python de la façon dont la fonction `query()` du SDK TypeScript fonctionne en interne - elle crée un objet client qui peut continuer les conversations.

#### Fonctionnalités clés

- **Continuité de session** : Maintient le contexte de conversation sur plusieurs appels `query()`
- **Même conversation** : Claude se souvient des messages précédents dans la session
- **Support des interruptions** : Peut arrêter Claude en cours d'exécution
- **Cycle de vie explicite** : Vous contrôlez quand la session commence et se termine
- **Flux basé sur les réponses** : Peut réagir aux réponses et envoyer des suites
- **Outils personnalisés et hooks** : Supporte les outils personnalisés (créés avec le décorateur `@tool`) et les hooks

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

#### Méthodes

| Méthode                      | Description                                                         |
| :-------------------------- | :------------------------------------------------------------------ |
| `__init__(options)`         | Initialiser le client avec une configuration optionnelle                   |
| `connect(prompt)`           | Se connecter à Claude avec une invite initiale optionnelle ou un flux de messages |
| `query(prompt, session_id)` | Envoyer une nouvelle demande en mode streaming                                |
| `receive_messages()`        | Recevoir tous les messages de Claude en tant qu'itérateur asynchrone               |
| `receive_response()`        | Recevoir les messages jusqu'à et incluant un ResultMessage                |
| `interrupt()`               | Envoyer un signal d'interruption (fonctionne uniquement en mode streaming)                |
| `disconnect()`              | Se déconnecter de Claude                                              |

#### Support du gestionnaire de contexte

Le client peut être utilisé comme gestionnaire de contexte asynchrone pour la gestion automatique de la connexion :

```python
async with ClaudeSDKClient() as client:
    await client.query("Hello Claude")
    async for message in client.receive_response():
        print(message)
```

> **Important :** Lors de l'itération sur les messages, évitez d'utiliser `break` pour quitter tôt car cela peut causer des problèmes de nettoyage asyncio. À la place, laissez l'itération se terminer naturellement ou utilisez des drapeaux pour suivre quand vous avez trouvé ce que vous cherchiez.

#### Exemple - Continuer une conversation

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

#### Exemple - Entrée en streaming avec ClaudeSDKClient

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

#### Exemple - Utiliser les interruptions

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

#### Exemple - Contrôle des permissions avancé

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

## Types

### `SdkMcpTool`

Définition pour un outil MCP SDK créé avec le décorateur `@tool`.

```python
@dataclass
class SdkMcpTool(Generic[T]):
    name: str
    description: str
    input_schema: type[T] | dict[str, Any]
    handler: Callable[[T], Awaitable[dict[str, Any]]]
```

| Propriété      | Type                                       | Description                                |
| :------------- | :----------------------------------------- | :----------------------------------------- |
| `name`         | `str`                                      | Identifiant unique pour l'outil             |
| `description`  | `str`                                      | Description lisible par l'homme                 |
| `input_schema` | `type[T] \| dict[str, Any]`                | Schéma pour la validation d'entrée                |
| `handler`      | `Callable[[T], Awaitable[dict[str, Any]]]` | Fonction asynchrone qui gère l'exécution de l'outil |

### `ClaudeAgentOptions`

Classe de configuration pour les requêtes Claude Code.

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

| Propriété                      | Type                                         | Défaut              | Description                                                                                                                                                                             |
| :---------------------------- | :------------------------------------------- | :------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `allowed_tools`               | `list[str]`                                  | `[]`                 | Liste des noms d'outils autorisés                                                                                                                                                              |
| `system_prompt`               | `str \| SystemPromptPreset \| None`          | `None`               | Configuration de l'invite système. Passez une chaîne pour une invite personnalisée, ou utilisez `{"type": "preset", "preset": "claude_code"}` pour l'invite système de Claude Code. Ajoutez `"append"` pour étendre le préréglage |
| `mcp_servers`                 | `dict[str, McpServerConfig] \| str \| Path`  | `{}`                 | Configurations du serveur MCP ou chemin vers le fichier de configuration                                                                                                                        |
| `permission_mode`             | `PermissionMode \| None`                     | `None`               | Mode de permission pour l'utilisation des outils                                                                                                                                          |
| `continue_conversation`       | `bool`                                       | `False`              | Continuer la conversation la plus récente                                                                                                                                                   |
| `resume`                      | `str \| None`                                | `None`               | ID de session à reprendre                                                                                                                                                                    |
| `max_turns`                   | `int \| None`                                | `None`               | Nombre maximum de tours de conversation                                                                                                                                                              |
| `disallowed_tools`            | `list[str]`                                  | `[]`                 | Liste des noms d'outils non autorisés                                                                                                                                                           |
| `model`                       | `str \| None`                                | `None`               | Modèle Claude à utiliser                                                                                                                                                                     |
| `output_format`               | [`OutputFormat`](#outputformat) ` \| None`   | `None`               | Définir le format de sortie pour les résultats de l'agent. Voir [Sorties structurées](/docs/fr/agent-sdk/structured-outputs) pour plus de détails                                                                    |
| `permission_prompt_tool_name` | `str \| None`                                | `None`               | Nom de l'outil MCP pour les invites de permission                                                                                                                                                    |
| `cwd`                         | `str \| Path \| None`                        | `None`               | Répertoire de travail courant                                                                                                                                                               |
| `settings`                    | `str \| None`                                | `None`               | Chemin vers le fichier de paramètres                                                                                                                                                                   |
| `add_dirs`                    | `list[str \| Path]`                          | `[]`                 | Répertoires supplémentaires auxquels Claude peut accéder                                                                                                                                                |
| `env`                         | `dict[str, str]`                             | `{}`                 | Variables d'environnement                                                                                                                                                                   |
| `extra_args`                  | `dict[str, str \| None]`                     | `{}`                 | Arguments CLI supplémentaires à passer directement au CLI                                                                                                                                    |
| `max_buffer_size`             | `int \| None`                                | `None`               | Nombre maximum d'octets lors de la mise en mémoire tampon de la sortie standard du CLI                                                                                                                                                 |
| `debug_stderr`                | `Any`                                        | `sys.stderr`         | _Déprécié_ - Objet de type fichier pour la sortie de débogage. Utilisez plutôt le rappel `stderr`                                                                                                         |
| `stderr`                      | `Callable[[str], None] \| None`              | `None`               | Fonction de rappel pour la sortie stderr du CLI                                                                                                                                            |
| `can_use_tool`                | `CanUseTool \| None`                         | `None`               | Fonction de rappel de permission d'outil                                                                                                                                                       |
| `hooks`                       | `dict[HookEvent, list[HookMatcher]] \| None` | `None`               | Configurations de hook pour intercepter les événements                                                                                                                                             |
| `user`                        | `str \| None`                                | `None`               | Identifiant utilisateur                                                                                                                                                                         |
| `include_partial_messages`    | `bool`                                       | `False`              | Inclure les événements de streaming de messages partiels                                                                                                                                                |
| `fork_session`                | `bool`                                       | `False`              | Lors de la reprise avec `resume`, bifurquer vers un nouvel ID de session au lieu de continuer la session d'origine                                                                                        |
| `agents`                      | `dict[str, AgentDefinition] \| None`         | `None`               | Sous-agents définis par programmation                                                                                                                                                      |
| `plugins`                     | `list[SdkPluginConfig]`                      | `[]`                 | Charger des plugins personnalisés à partir de chemins locaux. Voir [Plugins](/docs/fr/agent-sdk/plugins) pour plus de détails                                                                                             |
| `sandbox`                     | [`SandboxSettings`](#sandboxsettings) ` \| None` | `None`              | Configurer le comportement du sandbox par programmation. Voir [Paramètres du sandbox](#sandboxsettings) pour plus de détails                                        |
| `setting_sources`             | `list[SettingSource] \| None`                | `None` (pas de paramètres) | Contrôler quels paramètres du système de fichiers charger. Lorsqu'omis, aucun paramètre n'est chargé. **Remarque :** Doit inclure `"project"` pour charger les fichiers CLAUDE.md                                             |

### `OutputFormat`

Configuration pour la validation de sortie structurée.

```python
class OutputFormat(TypedDict):
    type: Literal["json_schema"]
    schema: dict[str, Any]
```

| Champ    | Requis | Description                                    |
| :------- | :------- | :--------------------------------------------- |
| `type`   | Oui      | Doit être `"json_schema"` pour la validation JSON Schema |
| `schema` | Oui      | Définition JSON Schema pour la validation de sortie   |

### `SystemPromptPreset`

Configuration pour utiliser l'invite système préréglée de Claude Code avec des ajouts optionnels.

```python
class SystemPromptPreset(TypedDict):
    type: Literal["preset"]
    preset: Literal["claude_code"]
    append: NotRequired[str]
```

| Champ    | Requis | Description                                                   |
| :------- | :------- | :------------------------------------------------------------ |
| `type`   | Oui      | Doit être `"preset"` pour utiliser une invite système préréglée              |
| `preset` | Oui      | Doit être `"claude_code"` pour utiliser l'invite système de Claude Code    |
| `append` | Non       | Instructions supplémentaires à ajouter à l'invite système préréglée |

### `SettingSource`

Contrôle quelles sources de configuration basées sur le système de fichiers le SDK charge les paramètres.

```python
SettingSource = Literal["user", "project", "local"]
```

| Valeur       | Description                                  | Localisation                      |
| :---------- | :------------------------------------------- | :---------------------------- |
| `"user"`    | Paramètres utilisateur globaux                         | `~/.claude/settings.json`     |
| `"project"` | Paramètres de projet partagés (contrôle de version) | `.claude/settings.json`       |
| `"local"`   | Paramètres de projet locaux (gitignorés)          | `.claude/settings.local.json` |

#### Comportement par défaut

Lorsque `setting_sources` est **omis** ou **`None`**, le SDK ne charge **pas** les paramètres du système de fichiers. Cela fournit l'isolation pour les applications SDK.

#### Pourquoi utiliser setting_sources ?

**Charger tous les paramètres du système de fichiers (comportement hérité) :**

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

**Charger uniquement des sources de paramètres spécifiques :**

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

**Environnements de test et CI :**

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

**Applications SDK uniquement :**

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

**Chargement des instructions de projet CLAUDE.md :**

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

#### Précédence des paramètres

Lorsque plusieurs sources sont chargées, les paramètres sont fusionnés avec cette précédence (du plus élevé au plus bas) :

1. Paramètres locaux (`.claude/settings.local.json`)
2. Paramètres de projet (`.claude/settings.json`)
3. Paramètres utilisateur (`~/.claude/settings.json`)

Les options programmatiques (comme `agents`, `allowed_tools`) remplacent toujours les paramètres du système de fichiers.

### `AgentDefinition`

Configuration pour un sous-agent défini par programmation.

```python
@dataclass
class AgentDefinition:
    description: str
    prompt: str
    tools: list[str] | None = None
    model: Literal["sonnet", "opus", "haiku", "inherit"] | None = None
```

| Champ         | Requis | Description                                                    |
| :------------ | :------- | :------------------------------------------------------------- |
| `description` | Oui      | Description en langage naturel de quand utiliser cet agent         |
| `tools`       | Non       | Tableau des noms d'outils autorisés. Si omis, hérite de tous les outils    |
| `prompt`      | Oui      | L'invite système de l'agent                                      |
| `model`       | Non       | Remplacement de modèle pour cet agent. Si omis, utilise le modèle principal |

### `PermissionMode`

Modes de permission pour contrôler l'exécution des outils.

```python
PermissionMode = Literal[
    "default",           # Standard permission behavior
    "acceptEdits",       # Auto-accept file edits
    "plan",              # Planning mode - no execution
    "bypassPermissions"  # Bypass all permission checks (use with caution)
]
```

### `McpSdkServerConfig`

Configuration pour les serveurs MCP SDK créés avec `create_sdk_mcp_server()`.

```python
class McpSdkServerConfig(TypedDict):
    type: Literal["sdk"]
    name: str
    instance: Any  # MCP Server instance
```

### `McpServerConfig`

Type union pour les configurations du serveur MCP.

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

Configuration pour charger les plugins dans le SDK.

```python
class SdkPluginConfig(TypedDict):
    type: Literal["local"]
    path: str
```

| Champ | Type | Description |
|:------|:-----|:------------|
| `type` | `Literal["local"]` | Doit être `"local"` (seuls les plugins locaux sont actuellement supportés) |
| `path` | `str` | Chemin absolu ou relatif vers le répertoire du plugin |

**Exemple :**
```python
plugins=[
    {"type": "local", "path": "./my-plugin"},
    {"type": "local", "path": "/absolute/path/to/plugin"}
]
```

Pour des informations complètes sur la création et l'utilisation de plugins, voir [Plugins](/docs/fr/agent-sdk/plugins).

## Types de messages

### `Message`

Type union de tous les messages possibles.

```python
Message = UserMessage | AssistantMessage | SystemMessage | ResultMessage
```

### `UserMessage`

Message d'entrée utilisateur.

```python
@dataclass
class UserMessage:
    content: str | list[ContentBlock]
```

### `AssistantMessage`

Message de réponse de l'assistant avec des blocs de contenu.

```python
@dataclass
class AssistantMessage:
    content: list[ContentBlock]
    model: str
```

### `SystemMessage`

Message système avec métadonnées.

```python
@dataclass
class SystemMessage:
    subtype: str
    data: dict[str, Any]
```

### `ResultMessage`

Message de résultat final avec informations de coût et d'utilisation.

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

## Types de blocs de contenu

### `ContentBlock`

Type union de tous les blocs de contenu.

```python
ContentBlock = TextBlock | ThinkingBlock | ToolUseBlock | ToolResultBlock
```

### `TextBlock`

Bloc de contenu textuel.

```python
@dataclass
class TextBlock:
    text: str
```

### `ThinkingBlock`

Bloc de contenu de réflexion (pour les modèles avec capacité de réflexion).

```python
@dataclass
class ThinkingBlock:
    thinking: str
    signature: str
```

### `ToolUseBlock`

Bloc de demande d'utilisation d'outil.

```python
@dataclass
class ToolUseBlock:
    id: str
    name: str
    input: dict[str, Any]
```

### `ToolResultBlock`

Bloc de résultat d'exécution d'outil.

```python
@dataclass
class ToolResultBlock:
    tool_use_id: str
    content: str | list[dict[str, Any]] | None = None
    is_error: bool | None = None
```

## Types d'erreur

### `ClaudeSDKError`

Classe d'exception de base pour toutes les erreurs du SDK.

```python
class ClaudeSDKError(Exception):
    """Erreur de base pour Claude SDK."""
```

### `CLINotFoundError`

Levée lorsque Claude Code CLI n'est pas installé ou introuvable.

```python
class CLINotFoundError(CLIConnectionError):
    def __init__(self, message: str = "Claude Code not found", cli_path: str | None = None):
        """
        Args:
            message: Message d'erreur (par défaut : "Claude Code not found")
            cli_path: Chemin optionnel vers la CLI qui n'a pas été trouvée
        """
```

### `CLIConnectionError`

Levée lorsque la connexion à Claude Code échoue.

```python
class CLIConnectionError(ClaudeSDKError):
    """Impossible de se connecter à Claude Code."""
```

### `ProcessError`

Levée lorsque le processus Claude Code échoue.

```python
class ProcessError(ClaudeSDKError):
    def __init__(self, message: str, exit_code: int | None = None, stderr: str | None = None):
        self.exit_code = exit_code
        self.stderr = stderr
```

### `CLIJSONDecodeError`

Levée lorsque l'analyse JSON échoue.

```python
class CLIJSONDecodeError(ClaudeSDKError):
    def __init__(self, line: str, original_error: Exception):
        """
        Args:
            line: La ligne qui n'a pas pu être analysée
            original_error: L'exception d'analyse JSON d'origine
        """
        self.line = line
        self.original_error = original_error
```

## Types de hook

Pour un guide complet sur l'utilisation des hooks avec des exemples et des modèles courants, consultez le [guide des hooks](/docs/fr/agent-sdk/hooks).

### `HookEvent`

Types d'événements de hook pris en charge. Notez que en raison des limitations de configuration, le SDK Python ne prend pas en charge les hooks SessionStart, SessionEnd et Notification.

```python
HookEvent = Literal[
    "PreToolUse",      # Appelé avant l'exécution de l'outil
    "PostToolUse",     # Appelé après l'exécution de l'outil
    "UserPromptSubmit", # Appelé lorsque l'utilisateur soumet une invite
    "Stop",            # Appelé lors de l'arrêt de l'exécution
    "SubagentStop",    # Appelé lorsqu'un sous-agent s'arrête
    "PreCompact"       # Appelé avant la compaction des messages
]
```

### `HookCallback`

Définition de type pour les fonctions de rappel de hook.

```python
HookCallback = Callable[
    [dict[str, Any], str | None, HookContext],
    Awaitable[dict[str, Any]]
]
```

Paramètres :

- `input_data` : Données d'entrée spécifiques au hook (voir [guide des hooks](/docs/fr/agent-sdk/hooks#input-data))
- `tool_use_id` : Identifiant d'utilisation d'outil optionnel (pour les hooks liés aux outils)
- `context` : Contexte du hook avec des informations supplémentaires

Retourne un dictionnaire qui peut contenir :

- `decision` : `"block"` pour bloquer l'action
- `systemMessage` : Message système à ajouter à la transcription
- `hookSpecificOutput` : Données de sortie spécifiques au hook

### `HookContext`

Informations de contexte transmises aux rappels de hook.

```python
@dataclass
class HookContext:
    signal: Any | None = None  # Futur : support du signal d'abandon
```

### `HookMatcher`

Configuration pour faire correspondre les hooks à des événements ou des outils spécifiques.

```python
@dataclass
class HookMatcher:
    matcher: str | None = None        # Nom de l'outil ou motif à faire correspondre (par exemple, "Bash", "Write|Edit")
    hooks: list[HookCallback] = field(default_factory=list)  # Liste des rappels à exécuter
    timeout: float | None = None        # Délai d'expiration en secondes pour tous les hooks dans ce matcher (par défaut : 60)
```

### Exemple d'utilisation de hook

Cet exemple enregistre deux hooks : l'un qui bloque les commandes bash dangereuses comme `rm -rf /`, et un autre qui enregistre toute l'utilisation des outils pour l'audit. Le hook de sécurité s'exécute uniquement sur les commandes Bash (via le `matcher`), tandis que le hook de journalisation s'exécute sur tous les outils.

```python
from claude_agent_sdk import query, ClaudeAgentOptions, HookMatcher, HookContext
from typing import Any

async def validate_bash_command(
    input_data: dict[str, Any],
    tool_use_id: str | None,
    context: HookContext
) -> dict[str, Any]:
    """Valider et potentiellement bloquer les commandes bash dangereuses."""
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
    """Enregistrer toute l'utilisation des outils pour l'audit."""
    print(f"Tool used: {input_data.get('tool_name')}")
    return {}

options = ClaudeAgentOptions(
    hooks={
        'PreToolUse': [
            HookMatcher(matcher='Bash', hooks=[validate_bash_command], timeout=120),  # 2 min pour la validation
            HookMatcher(hooks=[log_tool_use])  # S'applique à tous les outils (délai d'expiration par défaut de 60 s)
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

## Types d'entrée/sortie d'outil

Documentation des schémas d'entrée/sortie pour tous les outils Claude Code intégrés. Bien que le SDK Python n'exporte pas ces éléments en tant que types, ils représentent la structure des entrées et sorties d'outils dans les messages.

### Task

**Nom de l'outil :** `Task`

**Entrée :**

```python
{
    "description": str,      # Une description courte (3-5 mots) de la tâche
    "prompt": str,           # La tâche à effectuer par l'agent
    "subagent_type": str     # Le type d'agent spécialisé à utiliser
}
```

**Sortie :**

```python
{
    "result": str,                    # Résultat final du sous-agent
    "usage": dict | None,             # Statistiques d'utilisation des jetons
    "total_cost_usd": float | None,  # Coût total en USD
    "duration_ms": int | None         # Durée d'exécution en millisecondes
}
```

### Bash

**Nom de l'outil :** `Bash`

**Entrée :**

```python
{
    "command": str,                  # La commande à exécuter
    "timeout": int | None,           # Délai d'expiration optionnel en millisecondes (max 600000)
    "description": str | None,       # Description claire et concise (5-10 mots)
    "run_in_background": bool | None # Définir sur true pour exécuter en arrière-plan
}
```

**Sortie :**

```python
{
    "output": str,              # Sortie combinée stdout et stderr
    "exitCode": int,            # Code de sortie de la commande
    "killed": bool | None,      # Si la commande a été tuée en raison du délai d'expiration
    "shellId": str | None       # ID du shell pour les processus en arrière-plan
}
```

### Edit

**Nom de l'outil :** `Edit`

**Entrée :**

```python
{
    "file_path": str,           # Le chemin absolu du fichier à modifier
    "old_string": str,          # Le texte à remplacer
    "new_string": str,          # Le texte pour le remplacer
    "replace_all": bool | None  # Remplacer toutes les occurrences (par défaut False)
}
```

**Sortie :**

```python
{
    "message": str,      # Message de confirmation
    "replacements": int, # Nombre de remplacements effectués
    "file_path": str     # Chemin du fichier qui a été modifié
}
```

### Read

**Nom de l'outil :** `Read`

**Entrée :**

```python
{
    "file_path": str,       # Le chemin absolu du fichier à lire
    "offset": int | None,   # Le numéro de ligne à partir duquel commencer la lecture
    "limit": int | None     # Le nombre de lignes à lire
}
```

**Sortie (fichiers texte) :**

```python
{
    "content": str,         # Contenu du fichier avec numéros de ligne
    "total_lines": int,     # Nombre total de lignes dans le fichier
    "lines_returned": int   # Lignes réellement retournées
}
```

**Sortie (images) :**

```python
{
    "image": str,       # Données d'image codées en base64
    "mime_type": str,   # Type MIME de l'image
    "file_size": int    # Taille du fichier en octets
}
```

### Write

**Nom de l'outil :** `Write`

**Entrée :**

```python
{
    "file_path": str,  # Le chemin absolu du fichier à écrire
    "content": str     # Le contenu à écrire dans le fichier
}
```

**Sortie :**

```python
{
    "message": str,        # Message de succès
    "bytes_written": int,  # Nombre d'octets écrits
    "file_path": str       # Chemin du fichier qui a été écrit
}
```

### Glob

**Nom de l'outil :** `Glob`

**Entrée :**

```python
{
    "pattern": str,       # Le motif glob pour faire correspondre les fichiers
    "path": str | None    # Le répertoire à rechercher (par défaut cwd)
}
```

**Sortie :**

```python
{
    "matches": list[str],  # Tableau des chemins de fichiers correspondants
    "count": int,          # Nombre de correspondances trouvées
    "search_path": str     # Répertoire de recherche utilisé
}
```

### Grep

**Nom de l'outil :** `Grep`

**Entrée :**

```python
{
    "pattern": str,                    # Le motif d'expression régulière
    "path": str | None,                # Fichier ou répertoire à rechercher
    "glob": str | None,                # Motif glob pour filtrer les fichiers
    "type": str | None,                # Type de fichier à rechercher
    "output_mode": str | None,         # "content", "files_with_matches", ou "count"
    "-i": bool | None,                 # Recherche insensible à la casse
    "-n": bool | None,                 # Afficher les numéros de ligne
    "-B": int | None,                  # Lignes à afficher avant chaque correspondance
    "-A": int | None,                  # Lignes à afficher après chaque correspondance
    "-C": int | None,                  # Lignes à afficher avant et après
    "head_limit": int | None,          # Limiter la sortie aux N premières lignes/entrées
    "multiline": bool | None           # Activer le mode multiligne
}
```

**Sortie (mode contenu) :**

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

**Sortie (mode files_with_matches) :**

```python
{
    "files": list[str],  # Fichiers contenant des correspondances
    "count": int         # Nombre de fichiers avec des correspondances
}
```

### NotebookEdit

**Nom de l'outil :** `NotebookEdit`

**Entrée :**

```python
{
    "notebook_path": str,                     # Chemin absolu du notebook Jupyter
    "cell_id": str | None,                    # L'ID de la cellule à modifier
    "new_source": str,                        # La nouvelle source pour la cellule
    "cell_type": "code" | "markdown" | None,  # Le type de la cellule
    "edit_mode": "replace" | "insert" | "delete" | None  # Type d'opération d'édition
}
```

**Sortie :**

```python
{
    "message": str,                              # Message de succès
    "edit_type": "replaced" | "inserted" | "deleted",  # Type d'édition effectuée
    "cell_id": str | None,                       # ID de la cellule affectée
    "total_cells": int                           # Nombre total de cellules dans le notebook après édition
}
```

### WebFetch

**Nom de l'outil :** `WebFetch`

**Entrée :**

```python
{
    "url": str,     # L'URL à partir de laquelle récupérer le contenu
    "prompt": str   # L'invite à exécuter sur le contenu récupéré
}
```

**Sortie :**

```python
{
    "response": str,           # Réponse du modèle IA à l'invite
    "url": str,                # URL qui a été récupérée
    "final_url": str | None,   # URL finale après les redirections
    "status_code": int | None  # Code de statut HTTP
}
```

### WebSearch

**Nom de l'outil :** `WebSearch`

**Entrée :**

```python
{
    "query": str,                        # La requête de recherche à utiliser
    "allowed_domains": list[str] | None, # Inclure uniquement les résultats de ces domaines
    "blocked_domains": list[str] | None  # Ne jamais inclure les résultats de ces domaines
}
```

**Sortie :**

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

**Nom de l'outil :** `TodoWrite`

**Entrée :**

```python
{
    "todos": [
        {
            "content": str,                              # La description de la tâche
            "status": "pending" | "in_progress" | "completed",  # Statut de la tâche
            "activeForm": str                            # Forme active de la description
        }
    ]
}
```

**Sortie :**

```python
{
    "message": str,  # Message de succès
    "stats": {
        "total": int,
        "pending": int,
        "in_progress": int,
        "completed": int
    }
}
```

### BashOutput

**Nom de l'outil :** `BashOutput`

**Entrée :**

```python
{
    "bash_id": str,       # L'ID du shell en arrière-plan
    "filter": str | None  # Expression régulière optionnelle pour filtrer les lignes de sortie
}
```

**Sortie :**

```python
{
    "output": str,                                      # Nouvelle sortie depuis la dernière vérification
    "status": "running" | "completed" | "failed",       # Statut actuel du shell
    "exitCode": int | None                              # Code de sortie une fois terminé
}
```

### KillBash

**Nom de l'outil :** `KillBash`

**Entrée :**

```python
{
    "shell_id": str  # L'ID du shell en arrière-plan à terminer
}
```

**Sortie :**

```python
{
    "message": str,  # Message de succès
    "shell_id": str  # ID du shell terminé
}
```

### ExitPlanMode

**Nom de l'outil :** `ExitPlanMode`

**Entrée :**

```python
{
    "plan": str  # Le plan à exécuter par l'utilisateur pour approbation
}
```

**Sortie :**

```python
{
    "message": str,          # Message de confirmation
    "approved": bool | None  # Si l'utilisateur a approuvé le plan
}
```

### ListMcpResources

**Nom de l'outil :** `ListMcpResources`

**Entrée :**

```python
{
    "server": str | None  # Nom de serveur optionnel pour filtrer les ressources par
}
```

**Sortie :**

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

**Nom de l'outil :** `ReadMcpResource`

**Entrée :**

```python
{
    "server": str,  # Le nom du serveur MCP
    "uri": str      # L'URI de la ressource à lire
}
```

**Sortie :**

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

## Fonctionnalités avancées avec ClaudeSDKClient

### Construire une interface de conversation continue

```python
from claude_agent_sdk import ClaudeSDKClient, ClaudeAgentOptions, AssistantMessage, TextBlock
import asyncio

class ConversationSession:
    """Maintient une seule session de conversation avec Claude."""

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

### Utiliser les hooks pour la modification du comportement

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
    """Enregistrer toute l'utilisation des outils avant l'exécution."""
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
    """Enregistrer les résultats après l'exécution de l'outil."""
    tool_name = input_data.get('tool_name', 'unknown')
    print(f"[POST-TOOL] Completed: {tool_name}")
    return {}

async def user_prompt_modifier(
    input_data: dict[str, Any],
    tool_use_id: str | None,
    context: HookContext
) -> dict[str, Any]:
    """Ajouter du contexte aux invites utilisateur."""
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

### Surveillance de la progression en temps réel

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

## Exemple d'utilisation

### Opérations de fichier de base (utilisant query)

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

### Gestion des erreurs

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

### Mode de diffusion en continu avec client

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

### Utiliser des outils personnalisés avec ClaudeSDKClient

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

## Configuration du bac à sable

### `SandboxSettings`

Configuration du comportement du bac à sable. Utilisez ceci pour activer le sandboxing des commandes et configurer les restrictions réseau par programmation.

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

| Propriété | Type | Par défaut | Description |
| :------- | :--- | :------ | :---------- |
| `enabled` | `bool` | `False` | Activer le mode bac à sable pour l'exécution des commandes |
| `autoAllowBashIfSandboxed` | `bool` | `False` | Approuver automatiquement les commandes bash lorsque le bac à sable est activé |
| `excludedCommands` | `list[str]` | `[]` | Commandes qui contournent toujours les restrictions du bac à sable (par exemple, `["docker"]`). Celles-ci s'exécutent sans bac à sable automatiquement sans implication du modèle |
| `allowUnsandboxedCommands` | `bool` | `False` | Permettre au modèle de demander l'exécution de commandes en dehors du bac à sable. Lorsque `True`, le modèle peut définir `dangerouslyDisableSandbox` dans l'entrée de l'outil, ce qui revient au [système de permissions](#permissions-fallback-for-unsandboxed-commands) |
| `network` | [`SandboxNetworkConfig`](#sandboxnetworkconfig) | `None` | Configuration du bac à sable spécifique au réseau |
| `ignoreViolations` | [`SandboxIgnoreViolations`](#sandboxignoreviolations) | `None` | Configurer les violations du bac à sable à ignorer |
| `enableWeakerNestedSandbox` | `bool` | `False` | Activer un bac à sable imbriqué plus faible pour la compatibilité |

<Note>
**Les restrictions d'accès au système de fichiers et au réseau** ne sont PAS configurées via les paramètres du bac à sable. Au lieu de cela, elles sont dérivées des [règles de permission](https://code.claude.com/docs/fr/settings#permission-settings) :

- **Restrictions de lecture du système de fichiers** : Règles de refus de lecture
- **Restrictions d'écriture du système de fichiers** : Règles d'autorisation/refus d'édition
- **Restrictions réseau** : Règles d'autorisation/refus de WebFetch

Utilisez les paramètres du bac à sable pour le sandboxing de l'exécution des commandes, et les règles de permission pour le contrôle d'accès au système de fichiers et au réseau.
</Note>

#### Exemple d'utilisation

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

Configuration spécifique au réseau pour le mode bac à sable.

```python
class SandboxNetworkConfig(TypedDict, total=False):
    allowLocalBinding: bool
    allowUnixSockets: list[str]
    allowAllUnixSockets: bool
    httpProxyPort: int
    socksProxyPort: int
```

| Propriété | Type | Par défaut | Description |
| :------- | :--- | :------ | :---------- |
| `allowLocalBinding` | `bool` | `False` | Permettre aux processus de se lier aux ports locaux (par exemple, pour les serveurs de développement) |
| `allowUnixSockets` | `list[str]` | `[]` | Chemins de socket Unix auxquels les processus peuvent accéder (par exemple, socket Docker) |
| `allowAllUnixSockets` | `bool` | `False` | Permettre l'accès à tous les sockets Unix |
| `httpProxyPort` | `int` | `None` | Port du proxy HTTP pour les requêtes réseau |
| `socksProxyPort` | `int` | `None` | Port du proxy SOCKS pour les requêtes réseau |

### `SandboxIgnoreViolations`

Configuration pour ignorer les violations spécifiques du bac à sable.

```python
class SandboxIgnoreViolations(TypedDict, total=False):
    file: list[str]
    network: list[str]
```

| Propriété | Type | Par défaut | Description |
| :------- | :--- | :------ | :---------- |
| `file` | `list[str]` | `[]` | Motifs de chemin de fichier pour ignorer les violations |
| `network` | `list[str]` | `[]` | Motifs réseau pour ignorer les violations |

### Système de permissions de secours pour les commandes non sandboxées

Lorsque `allowUnsandboxedCommands` est activé, le modèle peut demander l'exécution de commandes en dehors du bac à sable en définissant `dangerouslyDisableSandbox: True` dans l'entrée de l'outil. Ces demandes reviennent au système de permissions existant, ce qui signifie que votre gestionnaire `can_use_tool` sera invoqué, vous permettant d'implémenter une logique d'autorisation personnalisée.

<Note>
**`excludedCommands` vs `allowUnsandboxedCommands` :**
- `excludedCommands` : Une liste statique de commandes qui contournent toujours le bac à sable automatiquement (par exemple, `["docker"]`). Le modèle n'a aucun contrôle sur cela.
- `allowUnsandboxedCommands` : Permet au modèle de décider à l'exécution s'il faut demander l'exécution sans bac à sable en définissant `dangerouslyDisableSandbox: True` dans l'entrée de l'outil.
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

Ce modèle vous permet de :

- **Auditer les demandes du modèle** : Enregistrer lorsque le modèle demande l'exécution sans bac à sable
- **Implémenter des listes blanches** : Permettre uniquement à des commandes spécifiques de s'exécuter sans bac à sable
- **Ajouter des flux d'approbation** : Exiger une autorisation explicite pour les opérations privilégiées

<Warning>
Les commandes s'exécutant avec `dangerouslyDisableSandbox: True` ont un accès système complet. Assurez-vous que votre gestionnaire `can_use_tool` valide ces demandes avec soin.
</Warning>

## Voir aussi

- [Guide du SDK Python](/docs/fr/agent-sdk/python) - Tutoriel et exemples
- [Aperçu du SDK](/docs/fr/agent-sdk/overview) - Concepts généraux du SDK
- [Référence du SDK TypeScript](/docs/fr/agent-sdk/typescript) - Documentation du SDK TypeScript
- [Référence CLI](https://code.claude.com/docs/fr/cli-reference) - Interface de ligne de commande
- [Flux de travail courants](https://code.claude.com/docs/fr/common-workflows) - Guides étape par étape