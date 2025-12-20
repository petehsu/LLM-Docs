# Referencia del SDK de Agent - Python

Referencia completa de la API del SDK de Agent de Python, incluyendo todas las funciones, tipos y clases.

---

## Instalación

```bash
pip install claude-agent-sdk
```

## Elegir entre `query()` y `ClaudeSDKClient`

El SDK de Python proporciona dos formas de interactuar con Claude Code:

### Comparación rápida

| Característica      | `query()`                     | `ClaudeSDKClient`                  |
| :------------------ | :---------------------------- | :--------------------------------- |
| **Sesión**          | Crea nueva sesión cada vez    | Reutiliza la misma sesión          |
| **Conversación**    | Intercambio único             | Múltiples intercambios en el mismo contexto |
| **Conexión**        | Gestionada automáticamente    | Control manual                     |
| **Entrada en streaming** | ✅ Compatible              | ✅ Compatible                       |
| **Interrupciones**  | ❌ No compatible              | ✅ Compatible                       |
| **Hooks**           | ❌ No compatible              | ✅ Compatible                       |
| **Herramientas personalizadas** | ❌ No compatible    | ✅ Compatible                       |
| **Continuar chat**  | ❌ Nueva sesión cada vez      | ✅ Mantiene la conversación        |
| **Caso de uso**     | Tareas puntuales              | Conversaciones continuas           |

### Cuándo usar `query()` (Nueva sesión cada vez)

**Mejor para:**

- Preguntas puntuales donde no necesitas historial de conversación
- Tareas independientes que no requieren contexto de intercambios anteriores
- Scripts de automatización simple
- Cuando quieres un comienzo fresco cada vez

### Cuándo usar `ClaudeSDKClient` (Conversación continua)

**Mejor para:**

- **Continuar conversaciones** - Cuando necesitas que Claude recuerde el contexto
- **Preguntas de seguimiento** - Construyendo sobre respuestas anteriores
- **Aplicaciones interactivas** - Interfaces de chat, REPLs
- **Lógica impulsada por respuestas** - Cuando la siguiente acción depende de la respuesta de Claude
- **Control de sesión** - Gestionar el ciclo de vida de la conversación explícitamente

## Funciones

### `query()`

Crea una nueva sesión para cada interacción con Claude Code. Devuelve un iterador asincrónico que produce mensajes a medida que llegan. Cada llamada a `query()` comienza de nuevo sin memoria de interacciones anteriores.

```python
async def query(
    *,
    prompt: str | AsyncIterable[dict[str, Any]],
    options: ClaudeAgentOptions | None = None
) -> AsyncIterator[Message]
```

#### Parámetros

| Parámetro | Tipo                         | Descripción                                                                |
| :-------- | :--------------------------- | :------------------------------------------------------------------------- |
| `prompt`  | `str \| AsyncIterable[dict]` | El prompt de entrada como una cadena o iterable asincrónico para modo streaming |
| `options` | `ClaudeAgentOptions \| None` | Objeto de configuración opcional (por defecto `ClaudeAgentOptions()` si es None) |

#### Devuelve

Devuelve un `AsyncIterator[Message]` que produce mensajes de la conversación.

#### Ejemplo - Con opciones

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

Decorador para definir herramientas MCP con seguridad de tipos.

```python
def tool(
    name: str,
    description: str,
    input_schema: type | dict[str, Any]
) -> Callable[[Callable[[Any], Awaitable[dict[str, Any]]]], SdkMcpTool[Any]]
```

#### Parámetros

| Parámetro      | Tipo                     | Descripción                                             |
| :------------- | :----------------------- | :------------------------------------------------------ |
| `name`         | `str`                    | Identificador único para la herramienta                 |
| `description`  | `str`                    | Descripción legible de lo que hace la herramienta       |
| `input_schema` | `type \| dict[str, Any]` | Esquema que define los parámetros de entrada de la herramienta (ver abajo) |

#### Opciones de esquema de entrada

1. **Mapeo de tipo simple** (recomendado):

   ```python
   {"text": str, "count": int, "enabled": bool}
   ```

2. **Formato JSON Schema** (para validación compleja):
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

#### Devuelve

Una función decoradora que envuelve la implementación de la herramienta y devuelve una instancia de `SdkMcpTool`.

#### Ejemplo

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

Crea un servidor MCP en proceso que se ejecuta dentro de tu aplicación Python.

```python
def create_sdk_mcp_server(
    name: str,
    version: str = "1.0.0",
    tools: list[SdkMcpTool[Any]] | None = None
) -> McpSdkServerConfig
```

#### Parámetros

| Parámetro | Tipo                            | Por defecto | Descripción                                           |
| :-------- | :------------------------------ | :-------- | :---------------------------------------------------- |
| `name`    | `str`                           | -         | Identificador único para el servidor                  |
| `version` | `str`                           | `"1.0.0"` | Cadena de versión del servidor                        |
| `tools`   | `list[SdkMcpTool[Any]] \| None` | `None`    | Lista de funciones de herramientas creadas con el decorador `@tool` |

#### Devuelve

Devuelve un objeto `McpSdkServerConfig` que puede pasarse a `ClaudeAgentOptions.mcp_servers`.

#### Ejemplo

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

## Clases

### `ClaudeSDKClient`

**Mantiene una sesión de conversación a través de múltiples intercambios.** Este es el equivalente en Python de cómo funciona internamente la función `query()` del SDK de TypeScript - crea un objeto cliente que puede continuar conversaciones.

#### Características clave

- **Continuidad de sesión**: Mantiene el contexto de la conversación a través de múltiples llamadas a `query()`
- **Misma conversación**: Claude recuerda mensajes anteriores en la sesión
- **Soporte de interrupciones**: Puede detener a Claude a mitad de la ejecución
- **Ciclo de vida explícito**: Controlas cuándo comienza y termina la sesión
- **Flujo impulsado por respuestas**: Puede reaccionar a respuestas y enviar seguimientos
- **Herramientas personalizadas y hooks**: Admite herramientas personalizadas (creadas con el decorador `@tool`) y hooks

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

#### Métodos

| Método                      | Descripción                                                         |
| :-------------------------- | :------------------------------------------------------------------ |
| `__init__(options)`         | Inicializa el cliente con configuración opcional                    |
| `connect(prompt)`           | Conecta a Claude con un prompt inicial opcional o flujo de mensajes |
| `query(prompt, session_id)` | Envía una nueva solicitud en modo streaming                         |
| `receive_messages()`        | Recibe todos los mensajes de Claude como un iterador asincrónico    |
| `receive_response()`        | Recibe mensajes hasta e incluyendo un ResultMessage                 |
| `interrupt()`               | Envía señal de interrupción (solo funciona en modo streaming)       |
| `disconnect()`              | Desconecta de Claude                                                |

#### Soporte de gestor de contexto

El cliente puede usarse como un gestor de contexto asincrónico para gestión automática de conexiones:

```python
async with ClaudeSDKClient() as client:
    await client.query("Hello Claude")
    async for message in client.receive_response():
        print(message)
```

> **Importante:** Al iterar sobre mensajes, evita usar `break` para salir temprano ya que esto puede causar problemas de limpieza de asyncio. En su lugar, deja que la iteración se complete naturalmente o usa banderas para rastrear cuándo has encontrado lo que necesitas.

#### Ejemplo - Continuando una conversación

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

#### Ejemplo - Entrada en streaming con ClaudeSDKClient

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

#### Ejemplo - Usando interrupciones

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

#### Ejemplo - Control de permisos avanzado

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

## Tipos

### `SdkMcpTool`

Definición para una herramienta MCP del SDK creada con el decorador `@tool`.

```python
@dataclass
class SdkMcpTool(Generic[T]):
    name: str
    description: str
    input_schema: type[T] | dict[str, Any]
    handler: Callable[[T], Awaitable[dict[str, Any]]]
```

| Propiedad      | Tipo                                       | Descripción                                |
| :------------- | :----------------------------------------- | :----------------------------------------- |
| `name`         | `str`                                      | Identificador único para la herramienta    |
| `description`  | `str`                                      | Descripción legible                        |
| `input_schema` | `type[T] \| dict[str, Any]`                | Esquema para validación de entrada         |
| `handler`      | `Callable[[T], Awaitable[dict[str, Any]]]` | Función asincrónica que maneja la ejecución de la herramienta |

### `ClaudeAgentOptions`

Clase de datos de configuración para consultas de Claude Code.

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

| Propiedad                     | Tipo                                         | Por defecto      | Descripción                                                                                                                                                                             |
| :---------------------------- | :------------------------------------------- | :------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `allowed_tools`               | `list[str]`                                  | `[]`                 | Lista de nombres de herramientas permitidas                                                                                                                                              |
| `system_prompt`               | `str \| SystemPromptPreset \| None`          | `None`               | Configuración del prompt del sistema. Pasa una cadena para un prompt personalizado, o usa `{"type": "preset", "preset": "claude_code"}` para el prompt del sistema de Claude Code. Agrega `"append"` para extender el preset |
| `mcp_servers`                 | `dict[str, McpServerConfig] \| str \| Path`  | `{}`                 | Configuraciones del servidor MCP o ruta al archivo de configuración                                                                                                                      |
| `permission_mode`             | `PermissionMode \| None`                     | `None`               | Modo de permiso para el uso de herramientas                                                                                                                                              |
| `continue_conversation`       | `bool`                                       | `False`              | Continuar la conversación más reciente                                                                                                                                                   |
| `resume`                      | `str \| None`                                | `None`               | ID de sesión a reanudar                                                                                                                                                                 |
| `max_turns`                   | `int \| None`                                | `None`               | Máximo de turnos de conversación                                                                                                                                                        |
| `disallowed_tools`            | `list[str]`                                  | `[]`                 | Lista de nombres de herramientas no permitidas                                                                                                                                           |
| `model`                       | `str \| None`                                | `None`               | Modelo de Claude a usar                                                                                                                                                                 |
| `output_format`               | [`OutputFormat`](#outputformat) ` \| None`   | `None`               | Define el formato de salida para los resultados del agente. Ver [Salidas estructuradas](/docs/es/agent-sdk/structured-outputs) para detalles                                            |
| `permission_prompt_tool_name` | `str \| None`                                | `None`               | Nombre de herramienta MCP para prompts de permiso                                                                                                                                        |
| `cwd`                         | `str \| Path \| None`                        | `None`               | Directorio de trabajo actual                                                                                                                                                            |
| `settings`                    | `str \| None`                                | `None`               | Ruta al archivo de configuración                                                                                                                                                        |
| `add_dirs`                    | `list[str \| Path]`                          | `[]`                 | Directorios adicionales a los que Claude puede acceder                                                                                                                                   |
| `env`                         | `dict[str, str]`                             | `{}`                 | Variables de entorno                                                                                                                                                                    |
| `extra_args`                  | `dict[str, str \| None]`                     | `{}`                 | Argumentos CLI adicionales a pasar directamente a la CLI                                                                                                                                 |
| `max_buffer_size`             | `int \| None`                                | `None`               | Máximo de bytes al almacenar en búfer la salida estándar de la CLI                                                                                                                       |
| `debug_stderr`                | `Any`                                        | `sys.stderr`         | _Deprecated_ - Objeto similar a un archivo para salida de depuración. Usa el callback `stderr` en su lugar                                                                              |
| `stderr`                      | `Callable[[str], None] \| None`              | `None`               | Función de callback para salida stderr de la CLI                                                                                                                                        |
| `can_use_tool`                | `CanUseTool \| None`                         | `None`               | Función de callback de permiso de herramienta                                                                                                                                            |
| `hooks`                       | `dict[HookEvent, list[HookMatcher]] \| None` | `None`               | Configuraciones de hook para interceptar eventos                                                                                                                                        |
| `user`                        | `str \| None`                                | `None`               | Identificador de usuario                                                                                                                                                                |
| `include_partial_messages`    | `bool`                                       | `False`              | Incluir eventos de streaming de mensajes parciales                                                                                                                                      |
| `fork_session`                | `bool`                                       | `False`              | Al reanudar con `resume`, bifurcar a un nuevo ID de sesión en lugar de continuar la sesión original                                                                                    |
| `agents`                      | `dict[str, AgentDefinition] \| None`         | `None`               | Suagentes definidos programáticamente                                                                                                                                                   |
| `plugins`                     | `list[SdkPluginConfig]`                      | `[]`                 | Cargar plugins personalizados desde rutas locales. Ver [Plugins](/docs/es/agent-sdk/plugins) para detalles                                                                             |
| `sandbox`                     | [`SandboxSettings`](#sandboxsettings) ` \| None` | `None`              | Configurar el comportamiento de la sandbox programáticamente. Ver [Configuración de sandbox](#sandboxsettings) para detalles                                        |
| `setting_sources`             | `list[SettingSource] \| None`                | `None` (sin configuración) | Controla qué configuraciones del sistema de archivos cargar. Cuando se omite, no se carga ninguna configuración. **Nota:** Debe incluir `"project"` para cargar archivos CLAUDE.md |

### `OutputFormat`

Configuración para validación de salida estructurada.

```python
class OutputFormat(TypedDict):
    type: Literal["json_schema"]
    schema: dict[str, Any]
```

| Campo    | Requerido | Descripción                                    |
| :------- | :------- | :--------------------------------------------- |
| `type`   | Sí      | Debe ser `"json_schema"` para validación de JSON Schema |
| `schema` | Sí      | Definición de JSON Schema para validación de salida |

### `SystemPromptPreset`

Configuración para usar el prompt del sistema preestablecido de Claude Code con adiciones opcionales.

```python
class SystemPromptPreset(TypedDict):
    type: Literal["preset"]
    preset: Literal["claude_code"]
    append: NotRequired[str]
```

| Campo    | Requerido | Descripción                                                   |
| :------- | :------- | :------------------------------------------------------------ |
| `type`   | Sí      | Debe ser `"preset"` para usar un prompt del sistema preestablecido |
| `preset` | Sí      | Debe ser `"claude_code"` para usar el prompt del sistema de Claude Code |
| `append` | No      | Instrucciones adicionales a agregar al prompt del sistema preestablecido |

### `SettingSource`

Controla qué fuentes de configuración basadas en el sistema de archivos carga el SDK.

```python
SettingSource = Literal["user", "project", "local"]
```

| Valor       | Descripción                                  | Ubicación                      |
| :---------- | :------------------------------------------- | :---------------------------- |
| `"user"`    | Configuración global del usuario             | `~/.claude/settings.json`     |
| `"project"` | Configuración compartida del proyecto (controlada por versión) | `.claude/settings.json`       |
| `"local"`   | Configuración local del proyecto (ignorada por git) | `.claude/settings.local.json` |

#### Comportamiento por defecto

Cuando `setting_sources` está **omitido** o es **`None`**, el SDK **no** carga ninguna configuración del sistema de archivos. Esto proporciona aislamiento para aplicaciones del SDK.

#### ¿Por qué usar setting_sources?

**Cargar todas las configuraciones del sistema de archivos (comportamiento heredado):**

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

**Cargar solo fuentes de configuración específicas:**

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

**Entornos de prueba e integración continua:**

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

**Aplicaciones solo del SDK:**

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

**Cargando instrucciones del proyecto CLAUDE.md:**

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

#### Precedencia de configuración

Cuando se cargan múltiples fuentes, las configuraciones se fusionan con esta precedencia (mayor a menor):

1. Configuración local (`.claude/settings.local.json`)
2. Configuración del proyecto (`.claude/settings.json`)
3. Configuración del usuario (`~/.claude/settings.json`)

Las opciones programáticas (como `agents`, `allowed_tools`) siempre anulan las configuraciones del sistema de archivos.

### `AgentDefinition`

Configuración para un suagente definido programáticamente.

```python
@dataclass
class AgentDefinition:
    description: str
    prompt: str
    tools: list[str] | None = None
    model: Literal["sonnet", "opus", "haiku", "inherit"] | None = None
```

| Campo         | Requerido | Descripción                                                    |
| :------------ | :------- | :------------------------------------------------------------- |
| `description` | Sí      | Descripción en lenguaje natural de cuándo usar este agente     |
| `tools`       | No      | Matriz de nombres de herramientas permitidas. Si se omite, hereda todas las herramientas |
| `prompt`      | Sí      | El prompt del sistema del agente                              |
| `model`       | No      | Anulación de modelo para este agente. Si se omite, usa el modelo principal |

### `PermissionMode`

Modos de permiso para controlar la ejecución de herramientas.

```python
PermissionMode = Literal[
    "default",           # Standard permission behavior
    "acceptEdits",       # Auto-accept file edits
    "plan",              # Planning mode - no execution
    "bypassPermissions"  # Bypass all permission checks (use with caution)
]
```

### `McpSdkServerConfig`

Configuración para servidores MCP del SDK creados con `create_sdk_mcp_server()`.

```python
class McpSdkServerConfig(TypedDict):
    type: Literal["sdk"]
    name: str
    instance: Any  # MCP Server instance
```

### `McpServerConfig`

Tipo de unión para configuraciones de servidor MCP.

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

Configuración para cargar plugins en el SDK.

```python
class SdkPluginConfig(TypedDict):
    type: Literal["local"]
    path: str
```

| Campo | Tipo | Descripción |
|:------|:-----|:------------|
| `type` | `Literal["local"]` | Debe ser `"local"` (actualmente solo se admiten plugins locales) |
| `path` | `str` | Ruta absoluta o relativa al directorio del plugin |

**Ejemplo:**
```python
plugins=[
    {"type": "local", "path": "./my-plugin"},
    {"type": "local", "path": "/absolute/path/to/plugin"}
]
```

Para información completa sobre cómo crear y usar plugins, ver [Plugins](/docs/es/agent-sdk/plugins).

## Tipos de mensaje

### `Message`

Tipo de unión de todos los mensajes posibles.

```python
Message = UserMessage | AssistantMessage | SystemMessage | ResultMessage
```

### `UserMessage`

Mensaje de entrada del usuario.

```python
@dataclass
class UserMessage:
    content: str | list[ContentBlock]
```

### `AssistantMessage`

Mensaje de respuesta del asistente con bloques de contenido.

```python
@dataclass
class AssistantMessage:
    content: list[ContentBlock]
    model: str
```

### `SystemMessage`

Mensaje del sistema con metadatos.

```python
@dataclass
class SystemMessage:
    subtype: str
    data: dict[str, Any]
```

### `ResultMessage`

Mensaje de resultado final con información de costo y uso.

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

## Tipos de bloque de contenido

### `ContentBlock`

Tipo de unión de todos los bloques de contenido.

```python
ContentBlock = TextBlock | ThinkingBlock | ToolUseBlock | ToolResultBlock
```

### `TextBlock`

Bloque de contenido de texto.

```python
@dataclass
class TextBlock:
    text: str
```

### `ThinkingBlock`

Bloque de contenido de pensamiento (para modelos con capacidad de pensamiento).

```python
@dataclass
class ThinkingBlock:
    thinking: str
    signature: str
```

### `ToolUseBlock`

Bloque de solicitud de uso de herramienta.

```python
@dataclass
class ToolUseBlock:
    id: str
    name: str
    input: dict[str, Any]
```

### `ToolResultBlock`

Bloque de resultado de ejecución de herramienta.

```python
@dataclass
class ToolResultBlock:
    tool_use_id: str
    content: str | list[dict[str, Any]] | None = None
    is_error: bool | None = None
```

## Tipos de Error

### `ClaudeSDKError`

Clase de excepción base para todos los errores del SDK.

```python
class ClaudeSDKError(Exception):
    """Error base para Claude SDK."""
```

### `CLINotFoundError`

Se genera cuando Claude Code CLI no está instalado o no se encuentra.

```python
class CLINotFoundError(CLIConnectionError):
    def __init__(self, message: str = "Claude Code not found", cli_path: str | None = None):
        """
        Args:
            message: Mensaje de error (predeterminado: "Claude Code not found")
            cli_path: Ruta opcional a la CLI que no se encontró
        """
```

### `CLIConnectionError`

Se genera cuando la conexión a Claude Code falla.

```python
class CLIConnectionError(ClaudeSDKError):
    """Error al conectar a Claude Code."""
```

### `ProcessError`

Se genera cuando el proceso de Claude Code falla.

```python
class ProcessError(ClaudeSDKError):
    def __init__(self, message: str, exit_code: int | None = None, stderr: str | None = None):
        self.exit_code = exit_code
        self.stderr = stderr
```

### `CLIJSONDecodeError`

Se genera cuando el análisis de JSON falla.

```python
class CLIJSONDecodeError(ClaudeSDKError):
    def __init__(self, line: str, original_error: Exception):
        """
        Args:
            line: La línea que no se pudo analizar
            original_error: La excepción original de decodificación JSON
        """
        self.line = line
        self.original_error = original_error
```

## Tipos de Hook

Para una guía completa sobre el uso de hooks con ejemplos y patrones comunes, consulte la [guía de Hooks](/docs/es/agent-sdk/hooks).

### `HookEvent`

Tipos de eventos de hook admitidos. Tenga en cuenta que debido a limitaciones de configuración, el SDK de Python no admite hooks de SessionStart, SessionEnd y Notification.

```python
HookEvent = Literal[
    "PreToolUse",      # Se llama antes de la ejecución de la herramienta
    "PostToolUse",     # Se llama después de la ejecución de la herramienta
    "UserPromptSubmit", # Se llama cuando el usuario envía un mensaje
    "Stop",            # Se llama cuando se detiene la ejecución
    "SubagentStop",    # Se llama cuando un subagente se detiene
    "PreCompact"       # Se llama antes de la compactación de mensajes
]
```

### `HookCallback`

Definición de tipo para funciones de devolución de llamada de hook.

```python
HookCallback = Callable[
    [dict[str, Any], str | None, HookContext],
    Awaitable[dict[str, Any]]
]
```

Parámetros:

- `input_data`: Datos de entrada específicos del hook (consulte [guía de Hooks](/docs/es/agent-sdk/hooks#input-data))
- `tool_use_id`: Identificador de uso de herramienta opcional (para hooks relacionados con herramientas)
- `context`: Contexto del hook con información adicional

Devuelve un diccionario que puede contener:

- `decision`: `"block"` para bloquear la acción
- `systemMessage`: Mensaje del sistema para agregar a la transcripción
- `hookSpecificOutput`: Datos de salida específicos del hook

### `HookContext`

Información de contexto pasada a las devoluciones de llamada de hook.

```python
@dataclass
class HookContext:
    signal: Any | None = None  # Futuro: soporte de señal de aborto
```

### `HookMatcher`

Configuración para hacer coincidir hooks con eventos o herramientas específicas.

```python
@dataclass
class HookMatcher:
    matcher: str | None = None        # Nombre de herramienta o patrón a coincidir (p. ej., "Bash", "Write|Edit")
    hooks: list[HookCallback] = field(default_factory=list)  # Lista de devoluciones de llamada a ejecutar
    timeout: float | None = None        # Tiempo de espera en segundos para todos los hooks en este matcher (predeterminado: 60)
```

### Ejemplo de Uso de Hook

Este ejemplo registra dos hooks: uno que bloquea comandos bash peligrosos como `rm -rf /`, y otro que registra todo el uso de herramientas para auditoría. El hook de seguridad solo se ejecuta en comandos Bash (a través del `matcher`), mientras que el hook de registro se ejecuta en todas las herramientas.

```python
from claude_agent_sdk import query, ClaudeAgentOptions, HookMatcher, HookContext
from typing import Any

async def validate_bash_command(
    input_data: dict[str, Any],
    tool_use_id: str | None,
    context: HookContext
) -> dict[str, Any]:
    """Validar y potencialmente bloquear comandos bash peligrosos."""
    if input_data['tool_name'] == 'Bash':
        command = input_data['tool_input'].get('command', '')
        if 'rm -rf /' in command:
            return {
                'hookSpecificOutput': {
                    'hookEventName': 'PreToolUse',
                    'permissionDecision': 'deny',
                    'permissionDecisionReason': 'Comando peligroso bloqueado'
                }
            }
    return {}

async def log_tool_use(
    input_data: dict[str, Any],
    tool_use_id: str | None,
    context: HookContext
) -> dict[str, Any]:
    """Registrar todo el uso de herramientas para auditoría."""
    print(f"Herramienta utilizada: {input_data.get('tool_name')}")
    return {}

options = ClaudeAgentOptions(
    hooks={
        'PreToolUse': [
            HookMatcher(matcher='Bash', hooks=[validate_bash_command], timeout=120),  # 2 min para validación
            HookMatcher(hooks=[log_tool_use])  # Se aplica a todas las herramientas (tiempo de espera predeterminado de 60s)
        ],
        'PostToolUse': [
            HookMatcher(hooks=[log_tool_use])
        ]
    }
)

async for message in query(
    prompt="Analizar este repositorio de código",
    options=options
):
    print(message)
```

## Tipos de Entrada/Salida de Herramienta

Documentación de esquemas de entrada/salida para todas las herramientas integradas de Claude Code. Aunque el SDK de Python no exporta estos como tipos, representan la estructura de entradas y salidas de herramientas en mensajes.

### Task

**Nombre de herramienta:** `Task`

**Entrada:**

```python
{
    "description": str,      # Una descripción breve (3-5 palabras) de la tarea
    "prompt": str,           # La tarea para que el agente realice
    "subagent_type": str     # El tipo de agente especializado a utilizar
}
```

**Salida:**

```python
{
    "result": str,                    # Resultado final del subagente
    "usage": dict | None,             # Estadísticas de uso de tokens
    "total_cost_usd": float | None,  # Costo total en USD
    "duration_ms": int | None         # Duración de ejecución en milisegundos
}
```

### Bash

**Nombre de herramienta:** `Bash`

**Entrada:**

```python
{
    "command": str,                  # El comando a ejecutar
    "timeout": int | None,           # Tiempo de espera opcional en milisegundos (máximo 600000)
    "description": str | None,       # Descripción clara y concisa (5-10 palabras)
    "run_in_background": bool | None # Establecer en true para ejecutar en segundo plano
}
```

**Salida:**

```python
{
    "output": str,              # Salida combinada de stdout y stderr
    "exitCode": int,            # Código de salida del comando
    "killed": bool | None,      # Si el comando fue eliminado debido al tiempo de espera
    "shellId": str | None       # ID de shell para procesos en segundo plano
}
```

### Edit

**Nombre de herramienta:** `Edit`

**Entrada:**

```python
{
    "file_path": str,           # La ruta absoluta del archivo a modificar
    "old_string": str,          # El texto a reemplazar
    "new_string": str,          # El texto para reemplazarlo
    "replace_all": bool | None  # Reemplazar todas las ocurrencias (predeterminado False)
}
```

**Salida:**

```python
{
    "message": str,      # Mensaje de confirmación
    "replacements": int, # Número de reemplazos realizados
    "file_path": str     # Ruta del archivo editado
}
```

### Read

**Nombre de herramienta:** `Read`

**Entrada:**

```python
{
    "file_path": str,       # La ruta absoluta del archivo a leer
    "offset": int | None,   # El número de línea desde el que comenzar a leer
    "limit": int | None     # El número de líneas a leer
}
```

**Salida (Archivos de texto):**

```python
{
    "content": str,         # Contenido del archivo con números de línea
    "total_lines": int,     # Número total de líneas en el archivo
    "lines_returned": int   # Líneas realmente devueltas
}
```

**Salida (Imágenes):**

```python
{
    "image": str,       # Datos de imagen codificados en base64
    "mime_type": str,   # Tipo MIME de imagen
    "file_size": int    # Tamaño del archivo en bytes
}
```

### Write

**Nombre de herramienta:** `Write`

**Entrada:**

```python
{
    "file_path": str,  # La ruta absoluta del archivo a escribir
    "content": str     # El contenido a escribir en el archivo
}
```

**Salida:**

```python
{
    "message": str,        # Mensaje de éxito
    "bytes_written": int,  # Número de bytes escritos
    "file_path": str       # Ruta del archivo escrito
}
```

### Glob

**Nombre de herramienta:** `Glob`

**Entrada:**

```python
{
    "pattern": str,       # El patrón glob para coincidir archivos
    "path": str | None    # El directorio a buscar (predeterminado al directorio actual)
}
```

**Salida:**

```python
{
    "matches": list[str],  # Matriz de rutas de archivos coincidentes
    "count": int,          # Número de coincidencias encontradas
    "search_path": str     # Directorio de búsqueda utilizado
}
```

### Grep

**Nombre de herramienta:** `Grep`

**Entrada:**

```python
{
    "pattern": str,                    # El patrón de expresión regular
    "path": str | None,                # Archivo o directorio a buscar
    "glob": str | None,                # Patrón glob para filtrar archivos
    "type": str | None,                # Tipo de archivo a buscar
    "output_mode": str | None,         # "content", "files_with_matches", o "count"
    "-i": bool | None,                 # Búsqueda sin distinción de mayúsculas y minúsculas
    "-n": bool | None,                 # Mostrar números de línea
    "-B": int | None,                  # Líneas a mostrar antes de cada coincidencia
    "-A": int | None,                  # Líneas a mostrar después de cada coincidencia
    "-C": int | None,                  # Líneas a mostrar antes y después
    "head_limit": int | None,          # Limitar salida a las primeras N líneas/entradas
    "multiline": bool | None           # Habilitar modo multilínea
}
```

**Salida (modo content):**

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

**Salida (modo files_with_matches):**

```python
{
    "files": list[str],  # Archivos que contienen coincidencias
    "count": int         # Número de archivos con coincidencias
}
```

### NotebookEdit

**Nombre de herramienta:** `NotebookEdit`

**Entrada:**

```python
{
    "notebook_path": str,                     # Ruta absoluta al cuaderno Jupyter
    "cell_id": str | None,                    # El ID de la celda a editar
    "new_source": str,                        # La nueva fuente para la celda
    "cell_type": "code" | "markdown" | None,  # El tipo de celda
    "edit_mode": "replace" | "insert" | "delete" | None  # Tipo de operación de edición
}
```

**Salida:**

```python
{
    "message": str,                              # Mensaje de éxito
    "edit_type": "replaced" | "inserted" | "deleted",  # Tipo de edición realizada
    "cell_id": str | None,                       # ID de celda que fue afectada
    "total_cells": int                           # Celdas totales en el cuaderno después de la edición
}
```

### WebFetch

**Nombre de herramienta:** `WebFetch`

**Entrada:**

```python
{
    "url": str,     # La URL de la que obtener contenido
    "prompt": str   # El mensaje a ejecutar en el contenido obtenido
}
```

**Salida:**

```python
{
    "response": str,           # Respuesta del modelo de IA al mensaje
    "url": str,                # URL que fue obtenida
    "final_url": str | None,   # URL final después de redirecciones
    "status_code": int | None  # Código de estado HTTP
}
```

### WebSearch

**Nombre de herramienta:** `WebSearch`

**Entrada:**

```python
{
    "query": str,                        # La consulta de búsqueda a utilizar
    "allowed_domains": list[str] | None, # Solo incluir resultados de estos dominios
    "blocked_domains": list[str] | None  # Nunca incluir resultados de estos dominios
}
```

**Salida:**

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

**Nombre de herramienta:** `TodoWrite`

**Entrada:**

```python
{
    "todos": [
        {
            "content": str,                              # La descripción de la tarea
            "status": "pending" | "in_progress" | "completed",  # Estado de la tarea
            "activeForm": str                            # Forma activa de la descripción
        }
    ]
}
```

**Salida:**

```python
{
    "message": str,  # Mensaje de éxito
    "stats": {
        "total": int,
        "pending": int,
        "in_progress": int,
        "completed": int
    }
}
```

### BashOutput

**Nombre de herramienta:** `BashOutput`

**Entrada:**

```python
{
    "bash_id": str,       # El ID del shell en segundo plano
    "filter": str | None  # Expresión regular opcional para filtrar líneas de salida
}
```

**Salida:**

```python
{
    "output": str,                                      # Nueva salida desde la última verificación
    "status": "running" | "completed" | "failed",       # Estado actual del shell
    "exitCode": int | None                              # Código de salida cuando se completa
}
```

### KillBash

**Nombre de herramienta:** `KillBash`

**Entrada:**

```python
{
    "shell_id": str  # El ID del shell en segundo plano a eliminar
}
```

**Salida:**

```python
{
    "message": str,  # Mensaje de éxito
    "shell_id": str  # ID del shell eliminado
}
```

### ExitPlanMode

**Nombre de herramienta:** `ExitPlanMode`

**Entrada:**

```python
{
    "plan": str  # El plan a ejecutar por el usuario para aprobación
}
```

**Salida:**

```python
{
    "message": str,          # Mensaje de confirmación
    "approved": bool | None  # Si el usuario aprobó el plan
}
```

### ListMcpResources

**Nombre de herramienta:** `ListMcpResources`

**Entrada:**

```python
{
    "server": str | None  # Nombre de servidor opcional para filtrar recursos por
}
```

**Salida:**

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

**Nombre de herramienta:** `ReadMcpResource`

**Entrada:**

```python
{
    "server": str,  # El nombre del servidor MCP
    "uri": str      # El URI del recurso a leer
}
```

**Salida:**

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

## Características Avanzadas con ClaudeSDKClient

### Construir una Interfaz de Conversación Continua

```python
from claude_agent_sdk import ClaudeSDKClient, ClaudeAgentOptions, AssistantMessage, TextBlock
import asyncio

class ConversationSession:
    """Mantiene una única sesión de conversación con Claude."""

    def __init__(self, options: ClaudeAgentOptions = None):
        self.client = ClaudeSDKClient(options)
        self.turn_count = 0

    async def start(self):
        await self.client.connect()
        print("Iniciando sesión de conversación. Claude recordará el contexto.")
        print("Comandos: 'exit' para salir, 'interrupt' para detener la tarea actual, 'new' para nueva sesión")

        while True:
            user_input = input(f"\n[Turno {self.turn_count + 1}] Tú: ")

            if user_input.lower() == 'exit':
                break
            elif user_input.lower() == 'interrupt':
                await self.client.interrupt()
                print("¡Tarea interrumpida!")
                continue
            elif user_input.lower() == 'new':
                # Desconectar y reconectar para una sesión nueva
                await self.client.disconnect()
                await self.client.connect()
                self.turn_count = 0
                print("Sesión de conversación nueva iniciada (contexto anterior borrado)")
                continue

            # Enviar mensaje - Claude recuerda todos los mensajes anteriores en esta sesión
            await self.client.query(user_input)
            self.turn_count += 1

            # Procesar respuesta
            print(f"[Turno {self.turn_count}] Claude: ", end="")
            async for message in self.client.receive_response():
                if isinstance(message, AssistantMessage):
                    for block in message.content:
                        if isinstance(block, TextBlock):
                            print(block.text, end="")
            print()  # Nueva línea después de la respuesta

        await self.client.disconnect()
        print(f"Conversación finalizada después de {self.turn_count} turnos.")

async def main():
    options = ClaudeAgentOptions(
        allowed_tools=["Read", "Write", "Bash"],
        permission_mode="acceptEdits"
    )
    session = ConversationSession(options)
    await session.start()

# Ejemplo de conversación:
# Turno 1 - Tú: "Crear un archivo llamado hello.py"
# Turno 1 - Claude: "Crearé un archivo hello.py para ti..."
# Turno 2 - Tú: "¿Qué hay en ese archivo?"
# Turno 2 - Claude: "El archivo hello.py que acabo de crear contiene..." (¡recuerda!)
# Turno 3 - Tú: "Agregar una función main a él"
# Turno 3 - Claude: "Agregaré una función main a hello.py..." (¡sabe qué archivo!)

asyncio.run(main())
```

### Usar Hooks para Modificación de Comportamiento

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
    """Registrar todo el uso de herramientas antes de la ejecución."""
    tool_name = input_data.get('tool_name', 'unknown')
    print(f"[PRE-TOOL] A punto de usar: {tool_name}")

    # Puedes modificar o bloquear la ejecución de la herramienta aquí
    if tool_name == "Bash" and "rm -rf" in str(input_data.get('tool_input', {})):
        return {
            'hookSpecificOutput': {
                'hookEventName': 'PreToolUse',
                'permissionDecision': 'deny',
                'permissionDecisionReason': 'Comando peligroso bloqueado'
            }
        }
    return {}

async def post_tool_logger(
    input_data: dict[str, Any],
    tool_use_id: str | None,
    context: HookContext
) -> dict[str, Any]:
    """Registrar resultados después de la ejecución de la herramienta."""
    tool_name = input_data.get('tool_name', 'unknown')
    print(f"[POST-TOOL] Completado: {tool_name}")
    return {}

async def user_prompt_modifier(
    input_data: dict[str, Any],
    tool_use_id: str | None,
    context: HookContext
) -> dict[str, Any]:
    """Agregar contexto a los mensajes del usuario."""
    original_prompt = input_data.get('prompt', '')

    # Agregar marca de tiempo a todos los mensajes
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
        await client.query("Listar archivos en el directorio actual")

        async for message in client.receive_response():
            # Los hooks registrarán automáticamente el uso de herramientas
            pass

asyncio.run(main())
```

### Monitoreo de Progreso en Tiempo Real

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
            "Crear 5 archivos Python con diferentes algoritmos de ordenamiento"
        )

        # Monitorear progreso en tiempo real
        files_created = []
        async for message in client.receive_messages():
            if isinstance(message, AssistantMessage):
                for block in message.content:
                    if isinstance(block, ToolUseBlock):
                        if block.name == "Write":
                            file_path = block.input.get("file_path", "")
                            print(f"🔨 Creando: {file_path}")
                    elif isinstance(block, ToolResultBlock):
                        print(f"✅ Ejecución de herramienta completada")
                    elif isinstance(block, TextBlock):
                        print(f"💭 Claude dice: {block.text[:100]}...")

            # Verificar si hemos recibido el resultado final
            if hasattr(message, 'subtype') and message.subtype in ['success', 'error']:
                print(f"\n🎯 ¡Tarea completada!")
                break

asyncio.run(monitor_progress())
```

## Uso de Ejemplo

### Operaciones básicas de archivo (usando query)

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
        prompt="Crear una estructura de proyecto Python con setup.py",
        options=options
    ):
        if isinstance(message, AssistantMessage):
            for block in message.content:
                if isinstance(block, ToolUseBlock):
                    print(f"Usando herramienta: {block.name}")

asyncio.run(create_project())
```

### Manejo de errores

```python
from claude_agent_sdk import (
    query,
    CLINotFoundError,
    ProcessError,
    CLIJSONDecodeError
)

try:
    async for message in query(prompt="Hola"):
        print(message)
except CLINotFoundError:
    print("Por favor instale Claude Code: npm install -g @anthropic-ai/claude-code")
except ProcessError as e:
    print(f"El proceso falló con código de salida: {e.exit_code}")
except CLIJSONDecodeError as e:
    print(f"Error al analizar la respuesta: {e}")
```

### Modo de transmisión con cliente

```python
from claude_agent_sdk import ClaudeSDKClient
import asyncio

async def interactive_session():
    async with ClaudeSDKClient() as client:
        # Enviar mensaje inicial
        await client.query("¿Cómo está el clima?")

        # Procesar respuestas
        async for msg in client.receive_response():
            print(msg)

        # Enviar seguimiento
        await client.query("Cuéntame más sobre eso")

        # Procesar respuesta de seguimiento
        async for msg in client.receive_response():
            print(msg)

asyncio.run(interactive_session())
```

### Usar herramientas personalizadas con ClaudeSDKClient

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

# Definir herramientas personalizadas con decorador @tool
@tool("calculate", "Realizar cálculos matemáticos", {"expression": str})
async def calculate(args: dict[str, Any]) -> dict[str, Any]:
    try:
        result = eval(args["expression"], {"__builtins__": {}})
        return {
            "content": [{
                "type": "text",
                "text": f"Resultado: {result}"
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

@tool("get_time", "Obtener la hora actual", {})
async def get_time(args: dict[str, Any]) -> dict[str, Any]:
    from datetime import datetime
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    return {
        "content": [{
            "type": "text",
            "text": f"Hora actual: {current_time}"
        }]
    }

async def main():
    # Crear servidor MCP del SDK con herramientas personalizadas
    my_server = create_sdk_mcp_server(
        name="utilities",
        version="1.0.0",
        tools=[calculate, get_time]
    )

    # Configurar opciones con el servidor
    options = ClaudeAgentOptions(
        mcp_servers={"utils": my_server},
        allowed_tools=[
            "mcp__utils__calculate",
            "mcp__utils__get_time"
        ]
    )

    # Usar ClaudeSDKClient para uso interactivo de herramientas
    async with ClaudeSDKClient(options=options) as client:
        await client.query("¿Cuánto es 123 * 456?")

        # Procesar respuesta de cálculo
        async for message in client.receive_response():
            if isinstance(message, AssistantMessage):
                for block in message.content:
                    if isinstance(block, TextBlock):
                        print(f"Cálculo: {block.text}")

        # Seguimiento con consulta de hora
        await client.query("¿Qué hora es ahora?")

        async for message in client.receive_response():
            if isinstance(message, AssistantMessage):
                for block in message.content:
                    if isinstance(block, TextBlock):
                        print(f"Hora: {block.text}")

asyncio.run(main())
```

## Configuración de Sandbox

### `SandboxSettings`

Configuración para el comportamiento del sandbox. Utilice esto para habilitar el sandboxing de comandos y configurar restricciones de red mediante programación.

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

| Propiedad | Tipo | Predeterminado | Descripción |
| :------- | :--- | :------ | :---------- |
| `enabled` | `bool` | `False` | Habilitar modo sandbox para ejecución de comandos |
| `autoAllowBashIfSandboxed` | `bool` | `False` | Aprobar automáticamente comandos bash cuando el sandbox está habilitado |
| `excludedCommands` | `list[str]` | `[]` | Comandos que siempre omiten restricciones de sandbox (p. ej., `["docker"]`). Estos se ejecutan sin sandbox automáticamente sin intervención del modelo |
| `allowUnsandboxedCommands` | `bool` | `False` | Permitir que el modelo solicite ejecutar comandos fuera del sandbox. Cuando es `True`, el modelo puede establecer `dangerouslyDisableSandbox` en la entrada de la herramienta, que se revierte al [sistema de permisos](#permissions-fallback-for-unsandboxed-commands) |
| `network` | [`SandboxNetworkConfig`](#sandboxnetworkconfig) | `None` | Configuración de sandbox específica de red |
| `ignoreViolations` | [`SandboxIgnoreViolations`](#sandboxignoreviolations) | `None` | Configurar qué violaciones de sandbox ignorar |
| `enableWeakerNestedSandbox` | `bool` | `False` | Habilitar un sandbox anidado más débil para compatibilidad |

<Note>
**Las restricciones de acceso al sistema de archivos y red** NO se configuran a través de la configuración de sandbox. En su lugar, se derivan de [reglas de permisos](https://code.claude.com/docs/es/settings#permission-settings):

- **Restricciones de lectura del sistema de archivos**: Reglas de denegación de lectura
- **Restricciones de escritura del sistema de archivos**: Reglas de permiso/denegación de edición
- **Restricciones de red**: Reglas de permiso/denegación de WebFetch

Utilice la configuración de sandbox para sandboxing de ejecución de comandos, y reglas de permisos para control de acceso al sistema de archivos y red.
</Note>

#### Ejemplo de uso

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
    prompt="Construir y probar mi proyecto",
    options=ClaudeAgentOptions(sandbox=sandbox_settings)
):
    print(message)
```

### `SandboxNetworkConfig`

Configuración específica de red para modo sandbox.

```python
class SandboxNetworkConfig(TypedDict, total=False):
    allowLocalBinding: bool
    allowUnixSockets: list[str]
    allowAllUnixSockets: bool
    httpProxyPort: int
    socksProxyPort: int
```

| Propiedad | Tipo | Predeterminado | Descripción |
| :------- | :--- | :------ | :---------- |
| `allowLocalBinding` | `bool` | `False` | Permitir que los procesos se vinculen a puertos locales (p. ej., para servidores de desarrollo) |
| `allowUnixSockets` | `list[str]` | `[]` | Rutas de socket Unix que los procesos pueden acceder (p. ej., socket de Docker) |
| `allowAllUnixSockets` | `bool` | `False` | Permitir acceso a todos los sockets Unix |
| `httpProxyPort` | `int` | `None` | Puerto proxy HTTP para solicitudes de red |
| `socksProxyPort` | `int` | `None` | Puerto proxy SOCKS para solicitudes de red |

### `SandboxIgnoreViolations`

Configuración para ignorar violaciones de sandbox específicas.

```python
class SandboxIgnoreViolations(TypedDict, total=False):
    file: list[str]
    network: list[str]
```

| Propiedad | Tipo | Predeterminado | Descripción |
| :------- | :--- | :------ | :---------- |
| `file` | `list[str]` | `[]` | Patrones de ruta de archivo para ignorar violaciones |
| `network` | `list[str]` | `[]` | Patrones de red para ignorar violaciones |

### Reversión de Permisos para Comandos Sin Sandbox

Cuando `allowUnsandboxedCommands` está habilitado, el modelo puede solicitar ejecutar comandos fuera del sandbox estableciendo `dangerouslyDisableSandbox: True` en la entrada de la herramienta. Estas solicitudes se revierten al sistema de permisos existente, lo que significa que se invocará su controlador `can_use_tool`, permitiéndole implementar lógica de autorización personalizada.

<Note>
**`excludedCommands` vs `allowUnsandboxedCommands`:**
- `excludedCommands`: Una lista estática de comandos que siempre omiten el sandbox automáticamente (p. ej., `["docker"]`). El modelo no tiene control sobre esto.
- `allowUnsandboxedCommands`: Permite que el modelo decida en tiempo de ejecución si solicitar ejecución sin sandbox estableciendo `dangerouslyDisableSandbox: True` en la entrada de la herramienta.
</Note>

```python
from claude_agent_sdk import query, ClaudeAgentOptions

async def can_use_tool(tool: str, input: dict) -> bool:
    # Verificar si el modelo está solicitando omitir el sandbox
    if tool == "Bash" and input.get("dangerouslyDisableSandbox"):
        # El modelo quiere ejecutar este comando fuera del sandbox
        print(f"Comando sin sandbox solicitado: {input.get('command')}")

        # Devolver True para permitir, False para denegar
        return is_command_authorized(input.get("command"))
    return True

async def main():
    async for message in query(
        prompt="Desplegar mi aplicación",
        options=ClaudeAgentOptions(
            sandbox={
                "enabled": True,
                "allowUnsandboxedCommands": True  # El modelo puede solicitar ejecución sin sandbox
            },
            permission_mode="default",
            can_use_tool=can_use_tool
        )
    ):
        print(message)
```

Este patrón le permite:

- **Auditar solicitudes del modelo**: Registrar cuándo el modelo solicita ejecución sin sandbox
- **Implementar listas de permitidos**: Solo permitir que comandos específicos se ejecuten sin sandbox
- **Agregar flujos de trabajo de aprobación**: Requerir autorización explícita para operaciones privilegiadas

<Warning>
Los comandos que se ejecutan con `dangerouslyDisableSandbox: True` tienen acceso completo al sistema. Asegúrese de que su controlador `can_use_tool` valide estas solicitudes cuidadosamente.
</Warning>

## Ver también

- [Guía del SDK de Python](/docs/es/agent-sdk/python) - Tutorial y ejemplos
- [Descripción general del SDK](/docs/es/agent-sdk/overview) - Conceptos generales del SDK
- [Referencia del SDK de TypeScript](/docs/es/agent-sdk/typescript) - Documentación del SDK de TypeScript
- [Referencia de CLI](https://code.claude.com/docs/es/cli-reference) - Interfaz de línea de comandos
- [Flujos de trabajo comunes](https://code.claude.com/docs/es/common-workflows) - Guías paso a paso