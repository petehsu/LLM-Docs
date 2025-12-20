# Agent SDK-Referenz - Python

Vollständige API-Referenz für das Python Agent SDK, einschließlich aller Funktionen, Typen und Klassen.

---

## Installation

```bash
pip install claude-agent-sdk
```

## Wahl zwischen `query()` und `ClaudeSDKClient`

Das Python SDK bietet zwei Möglichkeiten, um mit Claude Code zu interagieren:

### Schnellvergleich

| Funktion            | `query()`                     | `ClaudeSDKClient`                  |
| :------------------ | :---------------------------- | :--------------------------------- |
| **Sitzung**         | Erstellt jedes Mal eine neue Sitzung | Verwendet dieselbe Sitzung wieder |
| **Konversation**    | Einzelner Austausch           | Mehrere Austausche im gleichen Kontext |
| **Verbindung**      | Automatisch verwaltet         | Manuelle Kontrolle                     |
| **Streaming-Eingabe** | ✅ Unterstützt                  | ✅ Unterstützt                       |
| **Unterbrechungen**      | ❌ Nicht unterstützt              | ✅ Unterstützt                       |
| **Hooks**           | ❌ Nicht unterstützt              | ✅ Unterstützt                       |
| **Benutzerdefinierte Tools**    | ❌ Nicht unterstützt              | ✅ Unterstützt                       |
| **Chat fortsetzen**   | ❌ Neue Sitzung jedes Mal      | ✅ Erhält Konversation          |
| **Anwendungsfall**        | Einmalige Aufgaben                 | Kontinuierliche Konversationen           |

### Wann `query()` verwendet werden sollte (Neue Sitzung jedes Mal)

**Am besten für:**

- Einmalige Fragen, bei denen Sie keine Konversationsverlauf benötigen
- Unabhängige Aufgaben, die keinen Kontext aus vorherigen Austauschen erfordern
- Einfache Automatisierungsskripte
- Wenn Sie jedes Mal einen frischen Start möchten

### Wann `ClaudeSDKClient` verwendet werden sollte (Kontinuierliche Konversation)

**Am besten für:**

- **Konversationen fortsetzen** - Wenn Claude den Kontext merken muss
- **Nachfolgefragen** - Aufbau auf vorherigen Antworten
- **Interaktive Anwendungen** - Chat-Schnittstellen, REPLs
- **Antwortgesteuerte Logik** - Wenn die nächste Aktion von Claudes Antwort abhängt
- **Sitzungskontrolle** - Explizite Verwaltung des Konversationslebenszyklus

## Funktionen

### `query()`

Erstellt eine neue Sitzung für jede Interaktion mit Claude Code. Gibt einen asynchronen Iterator zurück, der Nachrichten bei ihrer Ankunft liefert. Jeder Aufruf von `query()` beginnt frisch ohne Erinnerung an vorherige Interaktionen.

```python
async def query(
    *,
    prompt: str | AsyncIterable[dict[str, Any]],
    options: ClaudeAgentOptions | None = None
) -> AsyncIterator[Message]
```

#### Parameter

| Parameter | Typ                         | Beschreibung                                                                |
| :-------- | :--------------------------- | :------------------------------------------------------------------------- |
| `prompt`  | `str \| AsyncIterable[dict]` | Die Eingabeaufforderung als Zeichenkette oder asynchroner Iterator für den Streaming-Modus          |
| `options` | `ClaudeAgentOptions \| None` | Optionales Konfigurationsobjekt (standardmäßig `ClaudeAgentOptions()`, wenn None) |

#### Rückgabewert

Gibt einen `AsyncIterator[Message]` zurück, der Nachrichten aus der Konversation liefert.

#### Beispiel - Mit Optionen

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

Dekorator zum Definieren von MCP-Tools mit Typsicherheit.

```python
def tool(
    name: str,
    description: str,
    input_schema: type | dict[str, Any]
) -> Callable[[Callable[[Any], Awaitable[dict[str, Any]]]], SdkMcpTool[Any]]
```

#### Parameter

| Parameter      | Typ                     | Beschreibung                                             |
| :------------- | :----------------------- | :------------------------------------------------------ |
| `name`         | `str`                    | Eindeutige Kennung für das Tool                          |
| `description`  | `str`                    | Benutzerfreundliche Beschreibung der Funktion des Tools        |
| `input_schema` | `type \| dict[str, Any]` | Schema, das die Eingabeparameter des Tools definiert (siehe unten) |

#### Optionen für Eingabeschema

1. **Einfache Typ-Zuordnung** (empfohlen):

   ```python
   {"text": str, "count": int, "enabled": bool}
   ```

2. **JSON-Schema-Format** (für komplexe Validierung):
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

#### Rückgabewert

Eine Dekoratorfunktion, die die Tool-Implementierung umhüllt und eine `SdkMcpTool`-Instanz zurückgibt.

#### Beispiel

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

Erstellen Sie einen In-Process-MCP-Server, der in Ihrer Python-Anwendung ausgeführt wird.

```python
def create_sdk_mcp_server(
    name: str,
    version: str = "1.0.0",
    tools: list[SdkMcpTool[Any]] | None = None
) -> McpSdkServerConfig
```

#### Parameter

| Parameter | Typ                            | Standard   | Beschreibung                                           |
| :-------- | :------------------------------ | :-------- | :---------------------------------------------------- |
| `name`    | `str`                           | -         | Eindeutige Kennung für den Server                      |
| `version` | `str`                           | `"1.0.0"` | Versionsnummer des Servers                                 |
| `tools`   | `list[SdkMcpTool[Any]] \| None` | `None`    | Liste von Tool-Funktionen, die mit dem `@tool`-Dekorator erstellt wurden |

#### Rückgabewert

Gibt ein `McpSdkServerConfig`-Objekt zurück, das an `ClaudeAgentOptions.mcp_servers` übergeben werden kann.

#### Beispiel

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

## Klassen

### `ClaudeSDKClient`

**Erhält eine Konversationssitzung über mehrere Austausche hinweg.** Dies ist das Python-Äquivalent dazu, wie die `query()`-Funktion des TypeScript SDK intern funktioniert - sie erstellt ein Client-Objekt, das Konversationen fortsetzen kann.

#### Hauptmerkmale

- **Sitzungskontinuität**: Erhält den Konversationskontext über mehrere `query()`-Aufrufe hinweg
- **Gleiche Konversation**: Claude erinnert sich an vorherige Nachrichten in der Sitzung
- **Unterbrechungsunterstützung**: Kann Claude während der Ausführung stoppen
- **Expliziter Lebenszyklus**: Sie kontrollieren, wann die Sitzung beginnt und endet
- **Antwortgesteuerte Abläufe**: Kann auf Antworten reagieren und Nachfolgefragen senden
- **Benutzerdefinierte Tools & Hooks**: Unterstützt benutzerdefinierte Tools (erstellt mit dem `@tool`-Dekorator) und Hooks

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

#### Methoden

| Methode                      | Beschreibung                                                         |
| :-------------------------- | :------------------------------------------------------------------ |
| `__init__(options)`         | Initialisieren Sie den Client mit optionaler Konfiguration                   |
| `connect(prompt)`           | Verbindung zu Claude mit einer optionalen anfänglichen Aufforderung oder einem Nachrichtenstrom |
| `query(prompt, session_id)` | Senden Sie eine neue Anfrage im Streaming-Modus                                |
| `receive_messages()`        | Empfangen Sie alle Nachrichten von Claude als asynchronen Iterator               |
| `receive_response()`        | Empfangen Sie Nachrichten bis zu und einschließlich einer ResultMessage                |
| `interrupt()`               | Senden Sie ein Unterbrechungssignal (funktioniert nur im Streaming-Modus)                |
| `disconnect()`              | Trennen Sie die Verbindung zu Claude                                              |

#### Unterstützung für Context Manager

Der Client kann als asynchroner Context Manager für automatische Verbindungsverwaltung verwendet werden:

```python
async with ClaudeSDKClient() as client:
    await client.query("Hello Claude")
    async for message in client.receive_response():
        print(message)
```

> **Wichtig:** Vermeiden Sie bei der Iteration über Nachrichten die Verwendung von `break` zum vorzeitigen Beenden, da dies zu asyncio-Bereinigungsproblemen führen kann. Lassen Sie die Iteration stattdessen natürlich abschließen oder verwenden Sie Flags, um zu verfolgen, wann Sie gefunden haben, was Sie brauchen.

#### Beispiel - Konversation fortsetzen

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

#### Beispiel - Streaming-Eingabe mit ClaudeSDKClient

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

#### Beispiel - Verwendung von Unterbrechungen

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

#### Beispiel - Erweiterte Berechtigungskontrolle

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

## Typen

### `SdkMcpTool`

Definition für ein SDK MCP-Tool, das mit dem `@tool`-Dekorator erstellt wurde.

```python
@dataclass
class SdkMcpTool(Generic[T]):
    name: str
    description: str
    input_schema: type[T] | dict[str, Any]
    handler: Callable[[T], Awaitable[dict[str, Any]]]
```

| Eigenschaft       | Typ                                       | Beschreibung                                |
| :------------- | :----------------------------------------- | :----------------------------------------- |
| `name`         | `str`                                      | Eindeutige Kennung für das Tool             |
| `description`  | `str`                                      | Benutzerfreundliche Beschreibung                 |
| `input_schema` | `type[T] \| dict[str, Any]`                | Schema für Eingabevalidierung                |
| `handler`      | `Callable[[T], Awaitable[dict[str, Any]]]` | Asynchrone Funktion, die die Tool-Ausführung verarbeitet |

### `ClaudeAgentOptions`

Konfigurationsdatenklasse für Claude Code-Abfragen.

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

| Eigenschaft                      | Typ                                         | Standard              | Beschreibung                                                                                                                                                                             |
| :---------------------------- | :------------------------------------------- | :------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `allowed_tools`               | `list[str]`                                  | `[]`                 | Liste der zulässigen Tool-Namen                                                                                                                                                              |
| `system_prompt`               | `str \| SystemPromptPreset \| None`          | `None`               | Systemanforderungskonfiguration. Übergeben Sie eine Zeichenkette für eine benutzerdefinierte Aufforderung oder verwenden Sie `{"type": "preset", "preset": "claude_code"}` für die Systemanforderung von Claude Code. Fügen Sie `"append"` hinzu, um die Voreinstellung zu erweitern |
| `mcp_servers`                 | `dict[str, McpServerConfig] \| str \| Path`  | `{}`                 | MCP-Serverkonfigurationen oder Pfad zur Konfigurationsdatei                                                                                                                                        |
| `permission_mode`             | `PermissionMode \| None`                     | `None`               | Berechtigungsmodus für die Tool-Nutzung                                                                                                                                                          |
| `continue_conversation`       | `bool`                                       | `False`              | Setzen Sie die neueste Konversation fort                                                                                                                                                   |
| `resume`                      | `str \| None`                                | `None`               | Sitzungs-ID zum Fortsetzen                                                                                                                                                                    |
| `max_turns`                   | `int \| None`                                | `None`               | Maximale Konversationsrunden                                                                                                                                                              |
| `disallowed_tools`            | `list[str]`                                  | `[]`                 | Liste der nicht zulässigen Tool-Namen                                                                                                                                                           |
| `model`                       | `str \| None`                                | `None`               | Zu verwendendes Claude-Modell                                                                                                                                                                                     |
| `output_format`               | [`OutputFormat`](#outputformat) ` \| None`   | `None`               | Definieren Sie das Ausgabeformat für Agent-Ergebnisse. Siehe [Strukturierte Ausgaben](/docs/de/agent-sdk/structured-outputs) für Details                                                                    |
| `permission_prompt_tool_name` | `str \| None`                                | `None`               | MCP-Tool-Name für Berechtigungsaufforderungen                                                                                                                                                    |
| `cwd`                         | `str \| Path \| None`                        | `None`               | Aktuelles Arbeitsverzeichnis                                                                                                                                                               |
| `settings`                    | `str \| None`                                | `None`               | Pfad zur Einstellungsdatei                                                                                                                                                                   |
| `add_dirs`                    | `list[str \| Path]`                          | `[]`                 | Zusätzliche Verzeichnisse, auf die Claude zugreifen kann                                                                                                                                                |
| `env`                         | `dict[str, str]`                             | `{}`                 | Umgebungsvariablen                                                                                                                                                                   |
| `extra_args`                  | `dict[str, str \| None]`                     | `{}`                 | Zusätzliche CLI-Argumente, die direkt an die CLI übergeben werden                                                                                                                                    |
| `max_buffer_size`             | `int \| None`                                | `None`               | Maximale Bytes beim Puffern der CLI-Standardausgabe                                                                                                                                                 |
| `debug_stderr`                | `Any`                                        | `sys.stderr`         | _Veraltet_ - Dateiähnliches Objekt für Debug-Ausgabe. Verwenden Sie stattdessen den `stderr`-Rückruf                                                                                         |
| `stderr`                      | `Callable[[str], None] \| None`              | `None`               | Rückruffunktion für stderr-Ausgabe von CLI                                                                                                                                            |
| `can_use_tool`                | `CanUseTool \| None`                         | `None`               | Rückruffunktion für Tool-Berechtigung                                                                                                                                                       |
| `hooks`                       | `dict[HookEvent, list[HookMatcher]] \| None` | `None`               | Hook-Konfigurationen zum Abfangen von Ereignissen                                                                                                                                             |
| `user`                        | `str \| None`                                | `None`               | Benutzerkennung                                                                                                                                                                         |
| `include_partial_messages`    | `bool`                                       | `False`              | Schließen Sie Streaming-Ereignisse für Teillachrichten ein                                                                                                                                                |
| `fork_session`                | `bool`                                       | `False`              | Beim Fortsetzen mit `resume` zu einer neuen Sitzungs-ID verzweigen, anstatt die ursprüngliche Sitzung fortzusetzen                                                                                        |
| `agents`                      | `dict[str, AgentDefinition] \| None`         | `None`               | Programmgesteuert definierte Unteragenten                                                                                                                                                      |
| `plugins`                     | `list[SdkPluginConfig]`                      | `[]`                 | Laden Sie benutzerdefinierte Plugins aus lokalen Pfaden. Siehe [Plugins](/docs/de/agent-sdk/plugins) für Details                                                                             |
| `sandbox`                     | [`SandboxSettings`](#sandboxsettings) ` \| None` | `None`              | Konfigurieren Sie das Sandbox-Verhalten programmgesteuert. Siehe [Sandbox-Einstellungen](#sandboxsettings) für Details                                                        |
| `setting_sources`             | `list[SettingSource] \| None`                | `None` (keine Einstellungen) | Kontrollieren Sie, welche Dateisystem-Einstellungen geladen werden. Wenn weggelassen, werden keine Einstellungen geladen. **Hinweis:** Muss `"project"` enthalten, um CLAUDE.md-Dateien zu laden                                             |

### `OutputFormat`

Konfiguration für die Validierung strukturierter Ausgaben.

```python
class OutputFormat(TypedDict):
    type: Literal["json_schema"]
    schema: dict[str, Any]
```

| Feld    | Erforderlich | Beschreibung                                    |
| :------- | :------- | :--------------------------------------------- |
| `type`   | Ja      | Muss `"json_schema"` für JSON-Schema-Validierung sein |
| `schema` | Ja      | JSON-Schema-Definition für Ausgabevalidierung   |

### `SystemPromptPreset`

Konfiguration für die Verwendung der Voreinstellung für die Systemanforderung von Claude Code mit optionalen Ergänzungen.

```python
class SystemPromptPreset(TypedDict):
    type: Literal["preset"]
    preset: Literal["claude_code"]
    append: NotRequired[str]
```

| Feld    | Erforderlich | Beschreibung                                                   |
| :------- | :------- | :------------------------------------------------------------ |
| `type`   | Ja      | Muss `"preset"` sein, um eine Voreinstellung für die Systemanforderung zu verwenden              |
| `preset` | Ja      | Muss `"claude_code"` sein, um die Systemanforderung von Claude Code zu verwenden    |
| `append` | Nein       | Zusätzliche Anweisungen, die an die Voreinstellung für die Systemanforderung angehängt werden |

### `SettingSource`

Kontrolliert, welche dateisystembasierte Konfigurationsquellen das SDK lädt.

```python
SettingSource = Literal["user", "project", "local"]
```

| Wert       | Beschreibung                                  | Speicherort                      |
| :---------- | :------------------------------------------- | :---------------------------- |
| `"user"`    | Globale Benutzereinstellungen                         | `~/.claude/settings.json`     |
| `"project"` | Gemeinsame Projekteinstellungen (versionskontrolliert) | `.claude/settings.json`       |
| `"local"`   | Lokale Projekteinstellungen (gitignoriert)          | `.claude/settings.local.json` |

#### Standardverhalten

Wenn `setting_sources` **weggelassen** oder **`None`** ist, lädt das SDK **keine** Dateisystem-Einstellungen. Dies bietet Isolation für SDK-Anwendungen.

#### Warum setting_sources verwenden?

**Laden Sie alle Dateisystem-Einstellungen (Legacy-Verhalten):**

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

**Laden Sie nur bestimmte Einstellungsquellen:**

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

**Test- und CI-Umgebungen:**

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

**SDK-only-Anwendungen:**

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

**Laden von CLAUDE.md-Projektanweisungen:**

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

#### Einstellungspriorität

Wenn mehrere Quellen geladen werden, werden Einstellungen mit dieser Priorität zusammengeführt (höchste bis niedrigste):

1. Lokale Einstellungen (`.claude/settings.local.json`)
2. Projekteinstellungen (`.claude/settings.json`)
3. Benutzereinstellungen (`~/.claude/settings.json`)

Programmgesteuerte Optionen (wie `agents`, `allowed_tools`) überschreiben immer Dateisystem-Einstellungen.

### `AgentDefinition`

Konfiguration für einen programmgesteuert definierten Unteragenten.

```python
@dataclass
class AgentDefinition:
    description: str
    prompt: str
    tools: list[str] | None = None
    model: Literal["sonnet", "opus", "haiku", "inherit"] | None = None
```

| Feld         | Erforderlich | Beschreibung                                                    |
| :------------ | :------- | :------------------------------------------------------------- |
| `description` | Ja      | Natürlichsprachige Beschreibung, wann dieser Agent verwendet werden sollte         |
| `tools`       | Nein       | Array von zulässigen Tool-Namen. Wenn weggelassen, erbt alle Tools    |
| `prompt`      | Ja      | Die Systemanforderung des Agenten                                      |
| `model`       | Nein       | Modellüberschreibung für diesen Agenten. Wenn weggelassen, verwendet das Hauptmodell |

### `PermissionMode`

Berechtigungsmodi zur Kontrolle der Tool-Ausführung.

```python
PermissionMode = Literal[
    "default",           # Standard permission behavior
    "acceptEdits",       # Auto-accept file edits
    "plan",              # Planning mode - no execution
    "bypassPermissions"  # Bypass all permission checks (use with caution)
]
```

### `McpSdkServerConfig`

Konfiguration für SDK MCP-Server, die mit `create_sdk_mcp_server()` erstellt wurden.

```python
class McpSdkServerConfig(TypedDict):
    type: Literal["sdk"]
    name: str
    instance: Any  # MCP Server instance
```

### `McpServerConfig`

Union-Typ für MCP-Serverkonfigurationen.

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

Konfiguration zum Laden von Plugins im SDK.

```python
class SdkPluginConfig(TypedDict):
    type: Literal["local"]
    path: str
```

| Feld | Typ | Beschreibung |
|:------|:-----|:------------|
| `type` | `Literal["local"]` | Muss `"local"` sein (nur lokale Plugins werden derzeit unterstützt) |
| `path` | `str` | Absoluter oder relativer Pfad zum Plugin-Verzeichnis |

**Beispiel:**
```python
plugins=[
    {"type": "local", "path": "./my-plugin"},
    {"type": "local", "path": "/absolute/path/to/plugin"}
]
```

Vollständige Informationen zum Erstellen und Verwenden von Plugins finden Sie unter [Plugins](/docs/de/agent-sdk/plugins).

## Nachrichtentypen

### `Message`

Union-Typ aller möglichen Nachrichten.

```python
Message = UserMessage | AssistantMessage | SystemMessage | ResultMessage
```

### `UserMessage`

Benutzereingabenachricht.

```python
@dataclass
class UserMessage:
    content: str | list[ContentBlock]
```

### `AssistantMessage`

Assistentenantwort-Nachricht mit Inhaltsblöcken.

```python
@dataclass
class AssistantMessage:
    content: list[ContentBlock]
    model: str
```

### `SystemMessage`

Systemnachricht mit Metadaten.

```python
@dataclass
class SystemMessage:
    subtype: str
    data: dict[str, Any]
```

### `ResultMessage`

Endgültige Ergebnisnachricht mit Kosten- und Nutzungsinformationen.

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

## Inhaltsblocktypen

### `ContentBlock`

Union-Typ aller Inhaltsblöcke.

```python
ContentBlock = TextBlock | ThinkingBlock | ToolUseBlock | ToolResultBlock
```

### `TextBlock`

Textinhaltsblock.

```python
@dataclass
class TextBlock:
    text: str
```

### `ThinkingBlock`

Thinking-Inhaltsblock (für Modelle mit Thinking-Fähigkeit).

```python
@dataclass
class ThinkingBlock:
    thinking: str
    signature: str
```

### `ToolUseBlock`

Tool-Verwendungsanforderungsblock.

```python
@dataclass
class ToolUseBlock:
    id: str
    name: str
    input: dict[str, Any]
```

### `ToolResultBlock`

Tool-Ausführungsergebnisblock.

```python
@dataclass
class ToolResultBlock:
    tool_use_id: str
    content: str | list[dict[str, Any]] | None = None
    is_error: bool | None = None
```

## Fehlertypen

### `ClaudeSDKError`

Basis-Ausnahmeklasse für alle SDK-Fehler.

```python
class ClaudeSDKError(Exception):
    """Base error for Claude SDK."""
```

### `CLINotFoundError`

Wird ausgelöst, wenn Claude Code CLI nicht installiert oder nicht gefunden ist.

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

Wird ausgelöst, wenn die Verbindung zu Claude Code fehlschlägt.

```python
class CLIConnectionError(ClaudeSDKError):
    """Failed to connect to Claude Code."""
```

### `ProcessError`

Wird ausgelöst, wenn der Claude Code-Prozess fehlschlägt.

```python
class ProcessError(ClaudeSDKError):
    def __init__(self, message: str, exit_code: int | None = None, stderr: str | None = None):
        self.exit_code = exit_code
        self.stderr = stderr
```

### `CLIJSONDecodeError`

Wird ausgelöst, wenn das JSON-Parsing fehlschlägt.

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

## Hook-Typen

Eine umfassende Anleitung zur Verwendung von Hooks mit Beispielen und häufigen Mustern finden Sie im [Hooks-Leitfaden](/docs/de/agent-sdk/hooks).

### `HookEvent`

Unterstützte Hook-Ereignistypen. Beachten Sie, dass das Python SDK aufgrund von Setup-Einschränkungen die Hooks SessionStart, SessionEnd und Notification nicht unterstützt.

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

Typdefinition für Hook-Callback-Funktionen.

```python
HookCallback = Callable[
    [dict[str, Any], str | None, HookContext],
    Awaitable[dict[str, Any]]
]
```

Parameter:

- `input_data`: Hook-spezifische Eingabedaten (siehe [Hooks-Leitfaden](/docs/de/agent-sdk/hooks#input-data))
- `tool_use_id`: Optionale Tool-Verwendungskennung (für Tool-bezogene Hooks)
- `context`: Hook-Kontext mit zusätzlichen Informationen

Gibt ein Wörterbuch zurück, das möglicherweise Folgendes enthält:

- `decision`: `"block"` zum Blockieren der Aktion
- `systemMessage`: Systemnachricht, die zum Transkript hinzugefügt werden soll
- `hookSpecificOutput`: Hook-spezifische Ausgabedaten

### `HookContext`

Kontextinformationen, die an Hook-Callbacks übergeben werden.

```python
@dataclass
class HookContext:
    signal: Any | None = None  # Future: abort signal support
```

### `HookMatcher`

Konfiguration zum Abgleichen von Hooks mit bestimmten Ereignissen oder Tools.

```python
@dataclass
class HookMatcher:
    matcher: str | None = None        # Tool name or pattern to match (e.g., "Bash", "Write|Edit")
    hooks: list[HookCallback] = field(default_factory=list)  # List of callbacks to execute
    timeout: float | None = None        # Timeout in seconds for all hooks in this matcher (default: 60)
```

### Hook-Verwendungsbeispiel

Dieses Beispiel registriert zwei Hooks: einen, der gefährliche Bash-Befehle wie `rm -rf /` blockiert, und einen anderen, der alle Tool-Verwendungen für Audits protokolliert. Der Sicherheits-Hook wird nur auf Bash-Befehle ausgeführt (über den `matcher`), während der Logging-Hook auf alle Tools angewendet wird.

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

## Tool-Input-/Output-Typen

Dokumentation von Input-/Output-Schemata für alle integrierten Claude Code-Tools. Obwohl das Python SDK diese nicht als Typen exportiert, stellen sie die Struktur von Tool-Eingaben und -Ausgaben in Nachrichten dar.

### Task

**Tool-Name:** `Task`

**Eingabe:**

```python
{
    "description": str,      # A short (3-5 word) description of the task
    "prompt": str,           # The task for the agent to perform
    "subagent_type": str     # The type of specialized agent to use
}
```

**Ausgabe:**

```python
{
    "result": str,                    # Final result from the subagent
    "usage": dict | None,             # Token usage statistics
    "total_cost_usd": float | None,  # Total cost in USD
    "duration_ms": int | None         # Execution duration in milliseconds
}
```

### Bash

**Tool-Name:** `Bash`

**Eingabe:**

```python
{
    "command": str,                  # The command to execute
    "timeout": int | None,           # Optional timeout in milliseconds (max 600000)
    "description": str | None,       # Clear, concise description (5-10 words)
    "run_in_background": bool | None # Set to true to run in background
}
```

**Ausgabe:**

```python
{
    "output": str,              # Combined stdout and stderr output
    "exitCode": int,            # Exit code of the command
    "killed": bool | None,      # Whether command was killed due to timeout
    "shellId": str | None       # Shell ID for background processes
}
```

### Edit

**Tool-Name:** `Edit`

**Eingabe:**

```python
{
    "file_path": str,           # The absolute path to the file to modify
    "old_string": str,          # The text to replace
    "new_string": str,          # The text to replace it with
    "replace_all": bool | None  # Replace all occurrences (default False)
}
```

**Ausgabe:**

```python
{
    "message": str,      # Confirmation message
    "replacements": int, # Number of replacements made
    "file_path": str     # File path that was edited
}
```

### Read

**Tool-Name:** `Read`

**Eingabe:**

```python
{
    "file_path": str,       # The absolute path to the file to read
    "offset": int | None,   # The line number to start reading from
    "limit": int | None     # The number of lines to read
}
```

**Ausgabe (Textdateien):**

```python
{
    "content": str,         # File contents with line numbers
    "total_lines": int,     # Total number of lines in file
    "lines_returned": int   # Lines actually returned
}
```

**Ausgabe (Bilder):**

```python
{
    "image": str,       # Base64 encoded image data
    "mime_type": str,   # Image MIME type
    "file_size": int    # File size in bytes
}
```

### Write

**Tool-Name:** `Write`

**Eingabe:**

```python
{
    "file_path": str,  # The absolute path to the file to write
    "content": str     # The content to write to the file
}
```

**Ausgabe:**

```python
{
    "message": str,        # Success message
    "bytes_written": int,  # Number of bytes written
    "file_path": str       # File path that was written
}
```

### Glob

**Tool-Name:** `Glob`

**Eingabe:**

```python
{
    "pattern": str,       # The glob pattern to match files against
    "path": str | None    # The directory to search in (defaults to cwd)
}
```

**Ausgabe:**

```python
{
    "matches": list[str],  # Array of matching file paths
    "count": int,          # Number of matches found
    "search_path": str     # Search directory used
}
```

### Grep

**Tool-Name:** `Grep`

**Eingabe:**

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

**Ausgabe (Content-Modus):**

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

**Ausgabe (files_with_matches-Modus):**

```python
{
    "files": list[str],  # Files containing matches
    "count": int         # Number of files with matches
}
```

### NotebookEdit

**Tool-Name:** `NotebookEdit`

**Eingabe:**

```python
{
    "notebook_path": str,                     # Absolute path to the Jupyter notebook
    "cell_id": str | None,                    # The ID of the cell to edit
    "new_source": str,                        # The new source for the cell
    "cell_type": "code" | "markdown" | None,  # The type of the cell
    "edit_mode": "replace" | "insert" | "delete" | None  # Edit operation type
}
```

**Ausgabe:**

```python
{
    "message": str,                              # Success message
    "edit_type": "replaced" | "inserted" | "deleted",  # Type of edit performed
    "cell_id": str | None,                       # Cell ID that was affected
    "total_cells": int                           # Total cells in notebook after edit
}
```

### WebFetch

**Tool-Name:** `WebFetch`

**Eingabe:**

```python
{
    "url": str,     # The URL to fetch content from
    "prompt": str   # The prompt to run on the fetched content
}
```

**Ausgabe:**

```python
{
    "response": str,           # AI model's response to the prompt
    "url": str,                # URL that was fetched
    "final_url": str | None,   # Final URL after redirects
    "status_code": int | None  # HTTP status code
}
```

### WebSearch

**Tool-Name:** `WebSearch`

**Eingabe:**

```python
{
    "query": str,                        # The search query to use
    "allowed_domains": list[str] | None, # Only include results from these domains
    "blocked_domains": list[str] | None  # Never include results from these domains
}
```

**Ausgabe:**

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

**Tool-Name:** `TodoWrite`

**Eingabe:**

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

**Ausgabe:**

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

**Tool-Name:** `BashOutput`

**Eingabe:**

```python
{
    "bash_id": str,       # The ID of the background shell
    "filter": str | None  # Optional regex to filter output lines
}
```

**Ausgabe:**

```python
{
    "output": str,                                      # New output since last check
    "status": "running" | "completed" | "failed",       # Current shell status
    "exitCode": int | None                              # Exit code when completed
}
```

### KillBash

**Tool-Name:** `KillBash`

**Eingabe:**

```python
{
    "shell_id": str  # The ID of the background shell to kill
}
```

**Ausgabe:**

```python
{
    "message": str,  # Success message
    "shell_id": str  # ID of the killed shell
}
```

### ExitPlanMode

**Tool-Name:** `ExitPlanMode`

**Eingabe:**

```python
{
    "plan": str  # The plan to run by the user for approval
}
```

**Ausgabe:**

```python
{
    "message": str,          # Confirmation message
    "approved": bool | None  # Whether user approved the plan
}
```

### ListMcpResources

**Tool-Name:** `ListMcpResources`

**Eingabe:**

```python
{
    "server": str | None  # Optional server name to filter resources by
}
```

**Ausgabe:**

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

**Tool-Name:** `ReadMcpResource`

**Eingabe:**

```python
{
    "server": str,  # The MCP server name
    "uri": str      # The resource URI to read
}
```

**Ausgabe:**

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

## Erweiterte Funktionen mit ClaudeSDKClient

### Erstellen einer kontinuierlichen Konversationsschnittstelle

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

### Verwendung von Hooks zur Verhaltensänderung

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

### Echtzeit-Fortschrittsüberwachung

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

## Beispielverwendung

### Grundlegende Dateivorgänge (mit query)

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

### Fehlerbehandlung

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

### Streaming-Modus mit Client

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

### Verwendung von benutzerdefinierten Tools mit ClaudeSDKClient

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

## Sandbox-Konfiguration

### `SandboxSettings`

Konfiguration für Sandbox-Verhalten. Verwenden Sie dies, um Befehlssandboxing zu aktivieren und Netzwerkbeschränkungen programmgesteuert zu konfigurieren.

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

| Eigenschaft | Typ | Standard | Beschreibung |
| :------- | :--- | :------ | :---------- |
| `enabled` | `bool` | `False` | Aktivieren Sie den Sandbox-Modus für die Befehlsausführung |
| `autoAllowBashIfSandboxed` | `bool` | `False` | Bash-Befehle automatisch genehmigen, wenn die Sandbox aktiviert ist |
| `excludedCommands` | `list[str]` | `[]` | Befehle, die immer Sandbox-Beschränkungen umgehen (z. B. `["docker"]`). Diese werden automatisch ohne Modellbeteiligung unsandboxed ausgeführt |
| `allowUnsandboxedCommands` | `bool` | `False` | Erlauben Sie dem Modell, die Ausführung von Befehlen außerhalb der Sandbox anzufordern. Wenn `True`, kann das Modell `dangerouslyDisableSandbox` in der Tool-Eingabe setzen, was auf das [Berechtigungssystem](#permissions-fallback-for-unsandboxed-commands) zurückfällt |
| `network` | [`SandboxNetworkConfig`](#sandboxnetworkconfig) | `None` | Netzwerkspezifische Sandbox-Konfiguration |
| `ignoreViolations` | [`SandboxIgnoreViolations`](#sandboxignoreviolations) | `None` | Konfigurieren Sie, welche Sandbox-Verstöße ignoriert werden sollen |
| `enableWeakerNestedSandbox` | `bool` | `False` | Aktivieren Sie eine schwächere verschachtelte Sandbox für Kompatibilität |

<Note>
**Dateisystem- und Netzwerkzugriffsbeschränkungen** werden NICHT über Sandbox-Einstellungen konfiguriert. Stattdessen werden sie von [Berechtigungsregeln](https://code.claude.com/docs/de/settings#permission-settings) abgeleitet:

- **Dateisystem-Lesebeschränkungen**: Regeln zum Ablehnen von Lesevorgängen
- **Dateisystem-Schreibbeschränkungen**: Regeln zum Zulassen/Ablehnen von Bearbeitungen
- **Netzwerkbeschränkungen**: Regeln zum Zulassen/Ablehnen von WebFetch

Verwenden Sie Sandbox-Einstellungen für Befehlsausführungs-Sandboxing und Berechtigungsregeln für Dateisystem- und Netzwerkzugriffskontrolle.
</Note>

#### Beispielverwendung

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

Netzwerkspezifische Konfiguration für den Sandbox-Modus.

```python
class SandboxNetworkConfig(TypedDict, total=False):
    allowLocalBinding: bool
    allowUnixSockets: list[str]
    allowAllUnixSockets: bool
    httpProxyPort: int
    socksProxyPort: int
```

| Eigenschaft | Typ | Standard | Beschreibung |
| :------- | :--- | :------ | :---------- |
| `allowLocalBinding` | `bool` | `False` | Erlauben Sie Prozessen, an lokale Ports zu binden (z. B. für Dev-Server) |
| `allowUnixSockets` | `list[str]` | `[]` | Unix-Socket-Pfade, auf die Prozesse zugreifen können (z. B. Docker-Socket) |
| `allowAllUnixSockets` | `bool` | `False` | Erlauben Sie den Zugriff auf alle Unix-Sockets |
| `httpProxyPort` | `int` | `None` | HTTP-Proxy-Port für Netzwerkanfragen |
| `socksProxyPort` | `int` | `None` | SOCKS-Proxy-Port für Netzwerkanfragen |

### `SandboxIgnoreViolations`

Konfiguration zum Ignorieren bestimmter Sandbox-Verstöße.

```python
class SandboxIgnoreViolations(TypedDict, total=False):
    file: list[str]
    network: list[str]
```

| Eigenschaft | Typ | Standard | Beschreibung |
| :------- | :--- | :------ | :---------- |
| `file` | `list[str]` | `[]` | Dateipfad-Muster zum Ignorieren von Verstößen |
| `network` | `list[str]` | `[]` | Netzwerkmuster zum Ignorieren von Verstößen |

### Berechtigungsfallback für unsandboxed Befehle

Wenn `allowUnsandboxedCommands` aktiviert ist, kann das Modell anfordern, Befehle außerhalb der Sandbox auszuführen, indem es `dangerouslyDisableSandbox: True` in der Tool-Eingabe setzt. Diese Anfragen fallen auf das vorhandene Berechtigungssystem zurück, was bedeutet, dass Ihr `can_use_tool`-Handler aufgerufen wird, sodass Sie benutzerdefinierte Autorisierungslogik implementieren können.

<Note>
**`excludedCommands` vs `allowUnsandboxedCommands`:**
- `excludedCommands`: Eine statische Liste von Befehlen, die die Sandbox immer automatisch umgehen (z. B. `["docker"]`). Das Modell hat keine Kontrolle darüber.
- `allowUnsandboxedCommands`: Ermöglicht dem Modell, zur Laufzeit zu entscheiden, ob unsandboxed Ausführung angefordert werden soll, indem `dangerouslyDisableSandbox: True` in der Tool-Eingabe gesetzt wird.
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

Dieses Muster ermöglicht es Ihnen:

- **Modellabfragen prüfen**: Protokollieren Sie, wenn das Modell unsandboxed Ausführung anfordert
- **Allowlists implementieren**: Nur bestimmte Befehle dürfen unsandboxed ausgeführt werden
- **Genehmigungsworkflows hinzufügen**: Erfordern Sie explizite Autorisierung für privilegierte Operationen

<Warning>
Befehle, die mit `dangerouslyDisableSandbox: True` ausgeführt werden, haben vollständigen Systemzugriff. Stellen Sie sicher, dass Ihr `can_use_tool`-Handler diese Anfragen sorgfältig validiert.
</Warning>

## Siehe auch

- [Python SDK-Leitfaden](/docs/de/agent-sdk/python) - Tutorial und Beispiele
- [SDK-Übersicht](/docs/de/agent-sdk/overview) - Allgemeine SDK-Konzepte
- [TypeScript SDK-Referenz](/docs/de/agent-sdk/typescript) - TypeScript SDK-Dokumentation
- [CLI-Referenz](https://code.claude.com/docs/de/cli-reference) - Befehlszeilenschnittstelle
- [Häufige Workflows](https://code.claude.com/docs/de/common-workflows) - Schritt-für-Schritt-Anleitungen