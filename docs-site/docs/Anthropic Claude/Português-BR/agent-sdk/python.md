# Referência do Agent SDK - Python

Referência completa da API para o Agent SDK Python, incluindo todas as funções, tipos e classes.

---

## Instalação

```bash
pip install claude-agent-sdk
```

## Escolhendo Entre `query()` e `ClaudeSDKClient`

O SDK Python fornece duas maneiras de interagir com Claude Code:

### Comparação Rápida

| Recurso             | `query()`                     | `ClaudeSDKClient`                  |
| :------------------ | :---------------------------- | :--------------------------------- |
| **Sessão**         | Cria nova sessão cada vez | Reutiliza a mesma sessão                |
| **Conversa**    | Troca única               | Múltiplas trocas no mesmo contexto |
| **Conexão**      | Gerenciada automaticamente         | Controle manual                     |
| **Entrada em Streaming** | ✅ Suportado                  | ✅ Suportado                       |
| **Interrupções**      | ❌ Não suportado              | ✅ Suportado                       |
| **Hooks**           | ❌ Não suportado              | ✅ Suportado                       |
| **Ferramentas Personalizadas**    | ❌ Não suportado              | ✅ Suportado                       |
| **Continuar Chat**   | ❌ Nova sessão cada vez      | ✅ Mantém conversa          |
| **Caso de Uso**        | Tarefas únicas                 | Conversas contínuas           |

### Quando Usar `query()` (Nova Sessão Cada Vez)

**Melhor para:**

- Perguntas únicas onde você não precisa do histórico de conversa
- Tarefas independentes que não requerem contexto de trocas anteriores
- Scripts de automação simples
- Quando você quer um novo começo cada vez

### Quando Usar `ClaudeSDKClient` (Conversa Contínua)

**Melhor para:**

- **Continuando conversas** - Quando você precisa que Claude se lembre do contexto
- **Perguntas de acompanhamento** - Construindo sobre respostas anteriores
- **Aplicações interativas** - Interfaces de chat, REPLs
- **Lógica orientada por resposta** - Quando a próxima ação depende da resposta de Claude
- **Controle de sessão** - Gerenciando o ciclo de vida da conversa explicitamente

## Funções

### `query()`

Cria uma nova sessão para cada interação com Claude Code. Retorna um iterador assíncrono que produz mensagens conforme chegam. Cada chamada para `query()` começa do zero sem memória de interações anteriores.

```python
async def query(
    *,
    prompt: str | AsyncIterable[dict[str, Any]],
    options: ClaudeAgentOptions | None = None
) -> AsyncIterator[Message]
```

#### Parâmetros

| Parâmetro | Tipo                         | Descrição                                                                |
| :-------- | :--------------------------- | :------------------------------------------------------------------------- |
| `prompt`  | `str \| AsyncIterable[dict]` | O prompt de entrada como uma string ou iterável assíncrono para modo de streaming          |
| `options` | `ClaudeAgentOptions \| None` | Objeto de configuração opcional (padrão para `ClaudeAgentOptions()` se None) |

#### Retorna

Retorna um `AsyncIterator[Message]` que produz mensagens da conversa.

#### Exemplo - Com opções

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

Decorador para definir ferramentas MCP com segurança de tipo.

```python
def tool(
    name: str,
    description: str,
    input_schema: type | dict[str, Any]
) -> Callable[[Callable[[Any], Awaitable[dict[str, Any]]]], SdkMcpTool[Any]]
```

#### Parâmetros

| Parâmetro      | Tipo                     | Descrição                                             |
| :------------- | :----------------------- | :------------------------------------------------------ |
| `name`         | `str`                    | Identificador único para a ferramenta                          |
| `description`  | `str`                    | Descrição legível por humanos do que a ferramenta faz        |
| `input_schema` | `type \| dict[str, Any]` | Schema definindo os parâmetros de entrada da ferramenta (veja abaixo) |

#### Opções de Schema de Entrada

1. **Mapeamento de tipo simples** (recomendado):

   ```python
   {"text": str, "count": int, "enabled": bool}
   ```

2. **Formato JSON Schema** (para validação complexa):
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

#### Retorna

Uma função decoradora que envolve a implementação da ferramenta e retorna uma instância `SdkMcpTool`.

#### Exemplo

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

Cria um servidor MCP em processo que é executado dentro de sua aplicação Python.

```python
def create_sdk_mcp_server(
    name: str,
    version: str = "1.0.0",
    tools: list[SdkMcpTool[Any]] | None = None
) -> McpSdkServerConfig
```

#### Parâmetros

| Parâmetro | Tipo                            | Padrão   | Descrição                                           |
| :-------- | :------------------------------ | :-------- | :---------------------------------------------------- |
| `name`    | `str`                           | -         | Identificador único para o servidor                      |
| `version` | `str`                           | `"1.0.0"` | String de versão do servidor                                 |
| `tools`   | `list[SdkMcpTool[Any]] \| None` | `None`    | Lista de funções de ferramenta criadas com decorador `@tool` |

#### Retorna

Retorna um objeto `McpSdkServerConfig` que pode ser passado para `ClaudeAgentOptions.mcp_servers`.

#### Exemplo

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

**Mantém uma sessão de conversa através de múltiplas trocas.** Este é o equivalente Python de como a função `query()` do SDK TypeScript funciona internamente - ela cria um objeto cliente que pode continuar conversas.

#### Recursos Principais

- **Continuidade de Sessão**: Mantém contexto de conversa através de múltiplas chamadas `query()`
- **Mesma Conversa**: Claude se lembra de mensagens anteriores na sessão
- **Suporte a Interrupção**: Pode parar Claude no meio da execução
- **Ciclo de Vida Explícito**: Você controla quando a sessão começa e termina
- **Fluxo Orientado por Resposta**: Pode reagir a respostas e enviar acompanhamentos
- **Ferramentas Personalizadas e Hooks**: Suporta ferramentas personalizadas (criadas com decorador `@tool`) e hooks

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

| Método                      | Descrição                                                         |
| :-------------------------- | :------------------------------------------------------------------ |
| `__init__(options)`         | Inicializa o cliente com configuração opcional                   |
| `connect(prompt)`           | Conecta a Claude com um prompt inicial opcional ou fluxo de mensagem |
| `query(prompt, session_id)` | Envia uma nova solicitação em modo de streaming                                |
| `receive_messages()`        | Recebe todas as mensagens de Claude como um iterador assíncrono               |
| `receive_response()`        | Recebe mensagens até e incluindo uma ResultMessage                |
| `interrupt()`               | Envia sinal de interrupção (funciona apenas em modo de streaming)                |
| `disconnect()`              | Desconecta de Claude                                              |

#### Suporte a Context Manager

O cliente pode ser usado como um gerenciador de contexto assíncrono para gerenciamento automático de conexão:

```python
async with ClaudeSDKClient() as client:
    await client.query("Hello Claude")
    async for message in client.receive_response():
        print(message)
```

> **Importante:** Ao iterar sobre mensagens, evite usar `break` para sair cedo, pois isso pode causar problemas de limpeza do asyncio. Em vez disso, deixe a iteração ser concluída naturalmente ou use sinalizadores para rastrear quando você encontrou o que precisa.

#### Exemplo - Continuando uma conversa

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

#### Exemplo - Entrada em streaming com ClaudeSDKClient

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

#### Exemplo - Usando interrupções

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

#### Exemplo - Controle avançado de permissão

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

Definição para uma ferramenta SDK MCP criada com o decorador `@tool`.

```python
@dataclass
class SdkMcpTool(Generic[T]):
    name: str
    description: str
    input_schema: type[T] | dict[str, Any]
    handler: Callable[[T], Awaitable[dict[str, Any]]]
```

| Propriedade       | Tipo                                       | Descrição                                |
| :------------- | :----------------------------------------- | :----------------------------------------- |
| `name`         | `str`                                      | Identificador único para a ferramenta             |
| `description`  | `str`                                      | Descrição legível por humanos                 |
| `input_schema` | `type[T] \| dict[str, Any]`                | Schema para validação de entrada                |
| `handler`      | `Callable[[T], Awaitable[dict[str, Any]]]` | Função assíncrona que manipula a execução da ferramenta |

### `ClaudeAgentOptions`

Dataclass de configuração para consultas Claude Code.

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

| Propriedade                      | Tipo                                         | Padrão              | Descrição                                                                                                                                                                             |
| :---------------------------- | :------------------------------------------- | :------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `allowed_tools`               | `list[str]`                                  | `[]`                 | Lista de nomes de ferramentas permitidas                                                                                                                                                              |
| `system_prompt`               | `str \| SystemPromptPreset \| None`          | `None`               | Configuração de prompt do sistema. Passe uma string para prompt personalizado, ou use `{"type": "preset", "preset": "claude_code"}` para o prompt do sistema Claude Code. Adicione `"append"` para estender o preset |
| `mcp_servers`                 | `dict[str, McpServerConfig] \| str \| Path`  | `{}`                 | Configurações de servidor MCP ou caminho para arquivo de configuração                                                                                                                                        |
| `permission_mode`             | `PermissionMode \| None`                     | `None`               | Modo de permissão para uso de ferramentas                                                                                                                                                          |
| `continue_conversation`       | `bool`                                       | `False`              | Continuar a conversa mais recente                                                                                                                                                                   |
| `resume`                      | `str \| None`                                | `None`               | ID de sessão para retomar                                                                                                                                                                    |
| `max_turns`                   | `int \| None`                                | `None`               | Número máximo de turnos de conversa                                                                                                                                                              |
| `disallowed_tools`            | `list[str]`                                  | `[]`                 | Lista de nomes de ferramentas não permitidas                                                                                                                                                           |
| `model`                       | `str \| None`                                | `None`               | Modelo Claude a usar                                                                                                                                                                     |
| `output_format`               | [`OutputFormat`](#outputformat) ` \| None`   | `None`               | Defina o formato de saída para resultados do agente. Veja [Saídas estruturadas](/docs/pt-BR/agent-sdk/structured-outputs) para detalhes                                                                    |
| `permission_prompt_tool_name` | `str \| None`                                | `None`               | Nome da ferramenta MCP para prompts de permissão                                                                                                                                                    |
| `cwd`                         | `str \| Path \| None`                        | `None`               | Diretório de trabalho atual                                                                                                                                                               |
| `settings`                    | `str \| None`                                | `None`               | Caminho para arquivo de configurações                                                                                                                                                                   |
| `add_dirs`                    | `list[str \| Path]`                          | `[]`                 | Diretórios adicionais que Claude pode acessar                                                                                                                                                |
| `env`                         | `dict[str, str]`                             | `{}`                 | Variáveis de ambiente                                                                                                                                                                   |
| `extra_args`                  | `dict[str, str \| None]`                     | `{}`                 | Argumentos CLI adicionais para passar diretamente para o CLI                                                                                                                                    |
| `max_buffer_size`             | `int \| None`                                | `None`               | Máximo de bytes ao fazer buffer da saída padrão do CLI                                                                                                                                                 |
| `debug_stderr`                | `Any`                                        | `sys.stderr`         | _Descontinuado_ - Objeto semelhante a arquivo para saída de depuração. Use callback `stderr` em vez disso                                                                                                         |
| `stderr`                      | `Callable[[str], None] \| None`              | `None`               | Função de callback para saída stderr do CLI                                                                                                                                            |
| `can_use_tool`                | `CanUseTool \| None`                         | `None`               | Função de callback de permissão de ferramenta                                                                                                                                                       |
| `hooks`                       | `dict[HookEvent, list[HookMatcher]] \| None` | `None`               | Configurações de hook para interceptar eventos                                                                                                                                             |
| `user`                        | `str \| None`                                | `None`               | Identificador de usuário                                                                                                                                                                         |
| `include_partial_messages`    | `bool`                                       | `False`              | Incluir eventos de streaming de mensagem parcial                                                                                                                                                |
| `fork_session`                | `bool`                                       | `False`              | Ao retomar com `resume`, fazer fork para um novo ID de sessão em vez de continuar a sessão original                                                                                        |
| `agents`                      | `dict[str, AgentDefinition] \| None`         | `None`               | Subagentes definidos programaticamente                                                                                                                                                      |
| `plugins`                     | `list[SdkPluginConfig]`                      | `[]`                 | Carregar plugins personalizados de caminhos locais. Veja [Plugins](/docs/pt-BR/agent-sdk/plugins) para detalhes                                                                             |
| `sandbox`                     | [`SandboxSettings`](#sandboxsettings) ` \| None` | `None`              | Configurar comportamento de sandbox programaticamente. Veja [Configurações de sandbox](#sandboxsettings) para detalhes                                        |
| `setting_sources`             | `list[SettingSource] \| None`                | `None` (sem configurações) | Controlar quais configurações do sistema de arquivos carregar. Quando omitido, nenhuma configuração é carregada. **Nota:** Deve incluir `"project"` para carregar arquivos CLAUDE.md                                             |

### `OutputFormat`

Configuração para validação de saída estruturada.

```python
class OutputFormat(TypedDict):
    type: Literal["json_schema"]
    schema: dict[str, Any]
```

| Campo    | Obrigatório | Descrição                                    |
| :------- | :------- | :--------------------------------------------- |
| `type`   | Sim      | Deve ser `"json_schema"` para validação JSON Schema |
| `schema` | Sim      | Definição JSON Schema para validação de saída   |

### `SystemPromptPreset`

Configuração para usar o prompt do sistema preset Claude Code com adições opcionais.

```python
class SystemPromptPreset(TypedDict):
    type: Literal["preset"]
    preset: Literal["claude_code"]
    append: NotRequired[str]
```

| Campo    | Obrigatório | Descrição                                                   |
| :------- | :------- | :------------------------------------------------------------ |
| `type`   | Sim      | Deve ser `"preset"` para usar um prompt do sistema preset              |
| `preset` | Sim      | Deve ser `"claude_code"` para usar o prompt do sistema Claude Code    |
| `append` | Não       | Instruções adicionais para anexar ao prompt do sistema preset |

### `SettingSource`

Controla quais fontes de configuração baseadas em sistema de arquivos o SDK carrega configurações.

```python
SettingSource = Literal["user", "project", "local"]
```

| Valor       | Descrição                                  | Localização                      |
| :---------- | :------------------------------------------- | :---------------------------- |
| `"user"`    | Configurações globais do usuário                         | `~/.claude/settings.json`     |
| `"project"` | Configurações de projeto compartilhadas (controladas por versão) | `.claude/settings.json`       |
| `"local"`   | Configurações de projeto local (ignoradas por git)          | `.claude/settings.local.json` |

#### Comportamento padrão

Quando `setting_sources` é **omitido** ou **`None`**, o SDK **não** carrega nenhuma configuração do sistema de arquivos. Isso fornece isolamento para aplicações SDK.

#### Por que usar setting_sources?

**Carregar todas as configurações do sistema de arquivos (comportamento legado):**

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

**Carregar apenas fontes de configuração específicas:**

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

**Ambientes de teste e CI:**

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

**Aplicações apenas SDK:**

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

**Carregando instruções de projeto CLAUDE.md:**

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

#### Precedência de configurações

Quando múltiplas fontes são carregadas, as configurações são mescladas com esta precedência (maior para menor):

1. Configurações locais (`.claude/settings.local.json`)
2. Configurações de projeto (`.claude/settings.json`)
3. Configurações do usuário (`~/.claude/settings.json`)

Opções programáticas (como `agents`, `allowed_tools`) sempre substituem configurações do sistema de arquivos.

### `AgentDefinition`

Configuração para um subagente definido programaticamente.

```python
@dataclass
class AgentDefinition:
    description: str
    prompt: str
    tools: list[str] | None = None
    model: Literal["sonnet", "opus", "haiku", "inherit"] | None = None
```

| Campo         | Obrigatório | Descrição                                                    |
| :------------ | :------- | :------------------------------------------------------------- |
| `description` | Sim      | Descrição em linguagem natural de quando usar este agente         |
| `tools`       | Não       | Array de nomes de ferramentas permitidas. Se omitido, herda todas as ferramentas    |
| `prompt`      | Sim      | O prompt do sistema do agente                                      |
| `model`       | Não       | Substituição de modelo para este agente. Se omitido, usa o modelo principal |

### `PermissionMode`

Modos de permissão para controlar a execução de ferramentas.

```python
PermissionMode = Literal[
    "default",           # Standard permission behavior
    "acceptEdits",       # Auto-accept file edits
    "plan",              # Planning mode - no execution
    "bypassPermissions"  # Bypass all permission checks (use with caution)
]
```

### `McpSdkServerConfig`

Configuração para servidores MCP SDK criados com `create_sdk_mcp_server()`.

```python
class McpSdkServerConfig(TypedDict):
    type: Literal["sdk"]
    name: str
    instance: Any  # MCP Server instance
```

### `McpServerConfig`

Tipo de união para configurações de servidor MCP.

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

Configuração para carregar plugins no SDK.

```python
class SdkPluginConfig(TypedDict):
    type: Literal["local"]
    path: str
```

| Campo | Tipo | Descrição |
|:------|:-----|:------------|
| `type` | `Literal["local"]` | Deve ser `"local"` (apenas plugins locais atualmente suportados) |
| `path` | `str` | Caminho absoluto ou relativo para o diretório do plugin |

**Exemplo:**
```python
plugins=[
    {"type": "local", "path": "./my-plugin"},
    {"type": "local", "path": "/absolute/path/to/plugin"}
]
```

Para informações completas sobre criação e uso de plugins, veja [Plugins](/docs/pt-BR/agent-sdk/plugins).

## Tipos de Mensagem

### `Message`

Tipo de união de todas as mensagens possíveis.

```python
Message = UserMessage | AssistantMessage | SystemMessage | ResultMessage
```

### `UserMessage`

Mensagem de entrada do usuário.

```python
@dataclass
class UserMessage:
    content: str | list[ContentBlock]
```

### `AssistantMessage`

Mensagem de resposta do assistente com blocos de conteúdo.

```python
@dataclass
class AssistantMessage:
    content: list[ContentBlock]
    model: str
```

### `SystemMessage`

Mensagem do sistema com metadados.

```python
@dataclass
class SystemMessage:
    subtype: str
    data: dict[str, Any]
```

### `ResultMessage`

Mensagem de resultado final com informações de custo e uso.

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

## Tipos de Bloco de Conteúdo

### `ContentBlock`

Tipo de união de todos os blocos de conteúdo.

```python
ContentBlock = TextBlock | ThinkingBlock | ToolUseBlock | ToolResultBlock
```

### `TextBlock`

Bloco de conteúdo de texto.

```python
@dataclass
class TextBlock:
    text: str
```

### `ThinkingBlock`

Bloco de conteúdo de pensamento (para modelos com capacidade de pensamento).

```python
@dataclass
class ThinkingBlock:
    thinking: str
    signature: str
```

### `ToolUseBlock`

Bloco de solicitação de uso de ferramenta.

```python
@dataclass
class ToolUseBlock:
    id: str
    name: str
    input: dict[str, Any]
```

### `ToolResultBlock`

Bloco de resultado de execução de ferramenta.

```python
@dataclass
class ToolResultBlock:
    tool_use_id: str
    content: str | list[dict[str, Any]] | None = None
    is_error: bool | None = None
```

## Tipos de Erro

### `ClaudeSDKError`

Classe de exceção base para todos os erros do SDK.

```python
class ClaudeSDKError(Exception):
    """Erro base para Claude SDK."""
```

### `CLINotFoundError`

Levantado quando Claude Code CLI não está instalado ou não foi encontrado.

```python
class CLINotFoundError(CLIConnectionError):
    def __init__(self, message: str = "Claude Code not found", cli_path: str | None = None):
        """
        Args:
            message: Mensagem de erro (padrão: "Claude Code not found")
            cli_path: Caminho opcional para a CLI que não foi encontrada
        """
```

### `CLIConnectionError`

Levantado quando a conexão com Claude Code falha.

```python
class CLIConnectionError(ClaudeSDKError):
    """Falha ao conectar com Claude Code."""
```

### `ProcessError`

Levantado quando o processo Claude Code falha.

```python
class ProcessError(ClaudeSDKError):
    def __init__(self, message: str, exit_code: int | None = None, stderr: str | None = None):
        self.exit_code = exit_code
        self.stderr = stderr
```

### `CLIJSONDecodeError`

Levantado quando a análise JSON falha.

```python
class CLIJSONDecodeError(ClaudeSDKError):
    def __init__(self, line: str, original_error: Exception):
        """
        Args:
            line: A linha que falhou ao analisar
            original_error: A exceção original de decodificação JSON
        """
        self.line = line
        self.original_error = original_error
```

## Tipos de Hook

Para um guia abrangente sobre o uso de hooks com exemplos e padrões comuns, consulte o [guia de Hooks](/docs/pt-BR/agent-sdk/hooks).

### `HookEvent`

Tipos de eventos de hook suportados. Observe que devido a limitações de configuração, o SDK Python não suporta hooks SessionStart, SessionEnd e Notification.

```python
HookEvent = Literal[
    "PreToolUse",      # Chamado antes da execução da ferramenta
    "PostToolUse",     # Chamado após a execução da ferramenta
    "UserPromptSubmit", # Chamado quando o usuário envia um prompt
    "Stop",            # Chamado ao parar a execução
    "SubagentStop",    # Chamado quando um subaagente para
    "PreCompact"       # Chamado antes da compactação de mensagem
]
```

### `HookCallback`

Definição de tipo para funções de callback de hook.

```python
HookCallback = Callable[
    [dict[str, Any], str | None, HookContext],
    Awaitable[dict[str, Any]]
]
```

Parâmetros:

- `input_data`: Dados de entrada específicos do hook (consulte [guia de Hooks](/docs/pt-BR/agent-sdk/hooks#input-data))
- `tool_use_id`: Identificador opcional de uso de ferramenta (para hooks relacionados a ferramentas)
- `context`: Contexto do hook com informações adicionais

Retorna um dicionário que pode conter:

- `decision`: `"block"` para bloquear a ação
- `systemMessage`: Mensagem do sistema a adicionar à transcrição
- `hookSpecificOutput`: Dados de saída específicos do hook

### `HookContext`

Informações de contexto passadas para callbacks de hook.

```python
@dataclass
class HookContext:
    signal: Any | None = None  # Futuro: suporte a sinal de aborto
```

### `HookMatcher`

Configuração para corresponder hooks a eventos ou ferramentas específicas.

```python
@dataclass
class HookMatcher:
    matcher: str | None = None        # Nome da ferramenta ou padrão a corresponder (ex: "Bash", "Write|Edit")
    hooks: list[HookCallback] = field(default_factory=list)  # Lista de callbacks a executar
    timeout: float | None = None        # Tempo limite em segundos para todos os hooks neste matcher (padrão: 60)
```

### Exemplo de Uso de Hook

Este exemplo registra dois hooks: um que bloqueia comandos bash perigosos como `rm -rf /`, e outro que registra todo o uso de ferramentas para auditoria. O hook de segurança só é executado em comandos Bash (via `matcher`), enquanto o hook de logging é executado em todas as ferramentas.

```python
from claude_agent_sdk import query, ClaudeAgentOptions, HookMatcher, HookContext
from typing import Any

async def validate_bash_command(
    input_data: dict[str, Any],
    tool_use_id: str | None,
    context: HookContext
) -> dict[str, Any]:
    """Validar e potencialmente bloquear comandos bash perigosos."""
    if input_data['tool_name'] == 'Bash':
        command = input_data['tool_input'].get('command', '')
        if 'rm -rf /' in command:
            return {
                'hookSpecificOutput': {
                    'hookEventName': 'PreToolUse',
                    'permissionDecision': 'deny',
                    'permissionDecisionReason': 'Comando perigoso bloqueado'
                }
            }
    return {}

async def log_tool_use(
    input_data: dict[str, Any],
    tool_use_id: str | None,
    context: HookContext
) -> dict[str, Any]:
    """Registrar todo o uso de ferramentas para auditoria."""
    print(f"Ferramenta usada: {input_data.get('tool_name')}")
    return {}

options = ClaudeAgentOptions(
    hooks={
        'PreToolUse': [
            HookMatcher(matcher='Bash', hooks=[validate_bash_command], timeout=120),  # 2 min para validação
            HookMatcher(hooks=[log_tool_use])  # Aplica a todas as ferramentas (tempo limite padrão de 60s)
        ],
        'PostToolUse': [
            HookMatcher(hooks=[log_tool_use])
        ]
    }
)

async for message in query(
    prompt="Analisar este repositório de código",
    options=options
):
    print(message)
```

## Tipos de Entrada/Saída de Ferramenta

Documentação de esquemas de entrada/saída para todas as ferramentas Claude Code integradas. Embora o SDK Python não exporte esses como tipos, eles representam a estrutura de entradas e saídas de ferramentas em mensagens.

### Task

**Nome da ferramenta:** `Task`

**Entrada:**

```python
{
    "description": str,      # Uma descrição breve (3-5 palavras) da tarefa
    "prompt": str,           # A tarefa para o agente executar
    "subagent_type": str     # O tipo de agente especializado a usar
}
```

**Saída:**

```python
{
    "result": str,                    # Resultado final do subaagente
    "usage": dict | None,             # Estatísticas de uso de tokens
    "total_cost_usd": float | None,  # Custo total em USD
    "duration_ms": int | None         # Duração da execução em milissegundos
}
```

### Bash

**Nome da ferramenta:** `Bash`

**Entrada:**

```python
{
    "command": str,                  # O comando a executar
    "timeout": int | None,           # Tempo limite opcional em milissegundos (máx 600000)
    "description": str | None,       # Descrição clara e concisa (5-10 palavras)
    "run_in_background": bool | None # Definir como true para executar em segundo plano
}
```

**Saída:**

```python
{
    "output": str,              # Saída combinada de stdout e stderr
    "exitCode": int,            # Código de saída do comando
    "killed": bool | None,      # Se o comando foi interrompido devido ao tempo limite
    "shellId": str | None       # ID do shell para processos em segundo plano
}
```

### Edit

**Nome da ferramenta:** `Edit`

**Entrada:**

```python
{
    "file_path": str,           # O caminho absoluto do arquivo a modificar
    "old_string": str,          # O texto a substituir
    "new_string": str,          # O texto para substituir por
    "replace_all": bool | None  # Substituir todas as ocorrências (padrão False)
}
```

**Saída:**

```python
{
    "message": str,      # Mensagem de confirmação
    "replacements": int, # Número de substituições realizadas
    "file_path": str     # Caminho do arquivo que foi editado
}
```

### Read

**Nome da ferramenta:** `Read`

**Entrada:**

```python
{
    "file_path": str,       # O caminho absoluto do arquivo a ler
    "offset": int | None,   # O número da linha para começar a ler
    "limit": int | None     # O número de linhas a ler
}
```

**Saída (Arquivos de texto):**

```python
{
    "content": str,         # Conteúdo do arquivo com números de linha
    "total_lines": int,     # Número total de linhas no arquivo
    "lines_returned": int   # Linhas realmente retornadas
}
```

**Saída (Imagens):**

```python
{
    "image": str,       # Dados de imagem codificados em Base64
    "mime_type": str,   # Tipo MIME da imagem
    "file_size": int    # Tamanho do arquivo em bytes
}
```

### Write

**Nome da ferramenta:** `Write`

**Entrada:**

```python
{
    "file_path": str,  # O caminho absoluto do arquivo a escrever
    "content": str     # O conteúdo a escrever no arquivo
}
```

**Saída:**

```python
{
    "message": str,        # Mensagem de sucesso
    "bytes_written": int,  # Número de bytes escritos
    "file_path": str       # Caminho do arquivo que foi escrito
}
```

### Glob

**Nome da ferramenta:** `Glob`

**Entrada:**

```python
{
    "pattern": str,       # O padrão glob para corresponder arquivos
    "path": str | None    # O diretório a pesquisar (padrão para cwd)
}
```

**Saída:**

```python
{
    "matches": list[str],  # Array de caminhos de arquivo correspondentes
    "count": int,          # Número de correspondências encontradas
    "search_path": str     # Diretório de pesquisa usado
}
```

### Grep

**Nome da ferramenta:** `Grep`

**Entrada:**

```python
{
    "pattern": str,                    # O padrão de expressão regular
    "path": str | None,                # Arquivo ou diretório a pesquisar
    "glob": str | None,                # Padrão glob para filtrar arquivos
    "type": str | None,                # Tipo de arquivo a pesquisar
    "output_mode": str | None,         # "content", "files_with_matches", ou "count"
    "-i": bool | None,                 # Pesquisa insensível a maiúsculas/minúsculas
    "-n": bool | None,                 # Mostrar números de linha
    "-B": int | None,                  # Linhas a mostrar antes de cada correspondência
    "-A": int | None,                  # Linhas a mostrar após cada correspondência
    "-C": int | None,                  # Linhas a mostrar antes e depois
    "head_limit": int | None,          # Limitar saída às primeiras N linhas/entradas
    "multiline": bool | None           # Ativar modo multilinha
}
```

**Saída (modo content):**

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

**Saída (modo files_with_matches):**

```python
{
    "files": list[str],  # Arquivos contendo correspondências
    "count": int         # Número de arquivos com correspondências
}
```

### NotebookEdit

**Nome da ferramenta:** `NotebookEdit`

**Entrada:**

```python
{
    "notebook_path": str,                     # Caminho absoluto para o notebook Jupyter
    "cell_id": str | None,                    # O ID da célula a editar
    "new_source": str,                        # A nova fonte para a célula
    "cell_type": "code" | "markdown" | None,  # O tipo da célula
    "edit_mode": "replace" | "insert" | "delete" | None  # Tipo de operação de edição
}
```

**Saída:**

```python
{
    "message": str,                              # Mensagem de sucesso
    "edit_type": "replaced" | "inserted" | "deleted",  # Tipo de edição realizada
    "cell_id": str | None,                       # ID da célula que foi afetada
    "total_cells": int                           # Total de células no notebook após edição
}
```

### WebFetch

**Nome da ferramenta:** `WebFetch`

**Entrada:**

```python
{
    "url": str,     # A URL para buscar conteúdo
    "prompt": str   # O prompt para executar no conteúdo buscado
}
```

**Saída:**

```python
{
    "response": str,           # Resposta do modelo de IA ao prompt
    "url": str,                # URL que foi buscada
    "final_url": str | None,   # URL final após redirecionamentos
    "status_code": int | None  # Código de status HTTP
}
```

### WebSearch

**Nome da ferramenta:** `WebSearch`

**Entrada:**

```python
{
    "query": str,                        # A consulta de pesquisa a usar
    "allowed_domains": list[str] | None, # Incluir apenas resultados desses domínios
    "blocked_domains": list[str] | None  # Nunca incluir resultados desses domínios
}
```

**Saída:**

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

**Nome da ferramenta:** `TodoWrite`

**Entrada:**

```python
{
    "todos": [
        {
            "content": str,                              # A descrição da tarefa
            "status": "pending" | "in_progress" | "completed",  # Status da tarefa
            "activeForm": str                            # Forma ativa da descrição
        }
    ]
}
```

**Saída:**

```python
{
    "message": str,  # Mensagem de sucesso
    "stats": {
        "total": int,
        "pending": int,
        "in_progress": int,
        "completed": int
    }
}
```

### BashOutput

**Nome da ferramenta:** `BashOutput`

**Entrada:**

```python
{
    "bash_id": str,       # O ID do shell em segundo plano
    "filter": str | None  # Regex opcional para filtrar linhas de saída
}
```

**Saída:**

```python
{
    "output": str,                                      # Nova saída desde a última verificação
    "status": "running" | "completed" | "failed",       # Status atual do shell
    "exitCode": int | None                              # Código de saída quando concluído
}
```

### KillBash

**Nome da ferramenta:** `KillBash`

**Entrada:**

```python
{
    "shell_id": str  # O ID do shell em segundo plano a interromper
}
```

**Saída:**

```python
{
    "message": str,  # Mensagem de sucesso
    "shell_id": str  # ID do shell interrompido
}
```

### ExitPlanMode

**Nome da ferramenta:** `ExitPlanMode`

**Entrada:**

```python
{
    "plan": str  # O plano a executar pelo usuário para aprovação
}
```

**Saída:**

```python
{
    "message": str,          # Mensagem de confirmação
    "approved": bool | None  # Se o usuário aprovou o plano
}
```

### ListMcpResources

**Nome da ferramenta:** `ListMcpResources`

**Entrada:**

```python
{
    "server": str | None  # Nome do servidor opcional para filtrar recursos
}
```

**Saída:**

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

**Nome da ferramenta:** `ReadMcpResource`

**Entrada:**

```python
{
    "server": str,  # O nome do servidor MCP
    "uri": str      # O URI do recurso a ler
}
```

**Saída:**

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

## Recursos Avançados com ClaudeSDKClient

### Construindo uma Interface de Conversa Contínua

```python
from claude_agent_sdk import ClaudeSDKClient, ClaudeAgentOptions, AssistantMessage, TextBlock
import asyncio

class ConversationSession:
    """Mantém uma única sessão de conversa com Claude."""

    def __init__(self, options: ClaudeAgentOptions = None):
        self.client = ClaudeSDKClient(options)
        self.turn_count = 0

    async def start(self):
        await self.client.connect()
        print("Iniciando sessão de conversa. Claude lembrará do contexto.")
        print("Comandos: 'exit' para sair, 'interrupt' para parar tarefa atual, 'new' para nova sessão")

        while True:
            user_input = input(f"\n[Turno {self.turn_count + 1}] Você: ")

            if user_input.lower() == 'exit':
                break
            elif user_input.lower() == 'interrupt':
                await self.client.interrupt()
                print("Tarefa interrompida!")
                continue
            elif user_input.lower() == 'new':
                # Desconectar e reconectar para uma sessão nova
                await self.client.disconnect()
                await self.client.connect()
                self.turn_count = 0
                print("Iniciada nova sessão de conversa (contexto anterior apagado)")
                continue

            # Enviar mensagem - Claude lembra todas as mensagens anteriores nesta sessão
            await self.client.query(user_input)
            self.turn_count += 1

            # Processar resposta
            print(f"[Turno {self.turn_count}] Claude: ", end="")
            async for message in self.client.receive_response():
                if isinstance(message, AssistantMessage):
                    for block in message.content:
                        if isinstance(block, TextBlock):
                            print(block.text, end="")
            print()  # Nova linha após resposta

        await self.client.disconnect()
        print(f"Conversa encerrada após {self.turn_count} turnos.")

async def main():
    options = ClaudeAgentOptions(
        allowed_tools=["Read", "Write", "Bash"],
        permission_mode="acceptEdits"
    )
    session = ConversationSession(options)
    await session.start()

# Exemplo de conversa:
# Turno 1 - Você: "Criar um arquivo chamado hello.py"
# Turno 1 - Claude: "Vou criar um arquivo hello.py para você..."
# Turno 2 - Você: "O que tem naquele arquivo?"
# Turno 2 - Claude: "O arquivo hello.py que criei contém..." (lembra!)
# Turno 3 - Você: "Adicione uma função main a ele"
# Turno 3 - Claude: "Vou adicionar uma função main ao hello.py..." (sabe qual arquivo!)

asyncio.run(main())
```

### Usando Hooks para Modificação de Comportamento

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
    """Registrar todo o uso de ferramentas antes da execução."""
    tool_name = input_data.get('tool_name', 'unknown')
    print(f"[PRE-TOOL] Prestes a usar: {tool_name}")

    # Você pode modificar ou bloquear a execução da ferramenta aqui
    if tool_name == "Bash" and "rm -rf" in str(input_data.get('tool_input', {})):
        return {
            'hookSpecificOutput': {
                'hookEventName': 'PreToolUse',
                'permissionDecision': 'deny',
                'permissionDecisionReason': 'Comando perigoso bloqueado'
            }
        }
    return {}

async def post_tool_logger(
    input_data: dict[str, Any],
    tool_use_id: str | None,
    context: HookContext
) -> dict[str, Any]:
    """Registrar resultados após execução da ferramenta."""
    tool_name = input_data.get('tool_name', 'unknown')
    print(f"[POST-TOOL] Concluído: {tool_name}")
    return {}

async def user_prompt_modifier(
    input_data: dict[str, Any],
    tool_use_id: str | None,
    context: HookContext
) -> dict[str, Any]:
    """Adicionar contexto aos prompts do usuário."""
    original_prompt = input_data.get('prompt', '')

    # Adicionar timestamp a todos os prompts
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
        await client.query("Listar arquivos no diretório atual")

        async for message in client.receive_response():
            # Hooks registrarão automaticamente o uso de ferramentas
            pass

asyncio.run(main())
```

### Monitoramento de Progresso em Tempo Real

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
            "Criar 5 arquivos Python com diferentes algoritmos de ordenação"
        )

        # Monitorar progresso em tempo real
        files_created = []
        async for message in client.receive_messages():
            if isinstance(message, AssistantMessage):
                for block in message.content:
                    if isinstance(block, ToolUseBlock):
                        if block.name == "Write":
                            file_path = block.input.get("file_path", "")
                            print(f"🔨 Criando: {file_path}")
                    elif isinstance(block, ToolResultBlock):
                        print(f"✅ Execução de ferramenta concluída")
                    elif isinstance(block, TextBlock):
                        print(f"💭 Claude diz: {block.text[:100]}...")

            # Verificar se recebemos o resultado final
            if hasattr(message, 'subtype') and message.subtype in ['success', 'error']:
                print(f"\n🎯 Tarefa concluída!")
                break

asyncio.run(monitor_progress())
```

## Exemplo de Uso

### Operações básicas de arquivo (usando query)

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
        prompt="Criar uma estrutura de projeto Python com setup.py",
        options=options
    ):
        if isinstance(message, AssistantMessage):
            for block in message.content:
                if isinstance(block, ToolUseBlock):
                    print(f"Usando ferramenta: {block.name}")

asyncio.run(create_project())
```

### Tratamento de erros

```python
from claude_agent_sdk import (
    query,
    CLINotFoundError,
    ProcessError,
    CLIJSONDecodeError
)

try:
    async for message in query(prompt="Olá"):
        print(message)
except CLINotFoundError:
    print("Por favor, instale Claude Code: npm install -g @anthropic-ai/claude-code")
except ProcessError as e:
    print(f"Processo falhou com código de saída: {e.exit_code}")
except CLIJSONDecodeError as e:
    print(f"Falha ao analisar resposta: {e}")
```

### Modo streaming com cliente

```python
from claude_agent_sdk import ClaudeSDKClient
import asyncio

async def interactive_session():
    async with ClaudeSDKClient() as client:
        # Enviar mensagem inicial
        await client.query("Como está o tempo?")

        # Processar respostas
        async for msg in client.receive_response():
            print(msg)

        # Enviar acompanhamento
        await client.query("Conte-me mais sobre isso")

        # Processar resposta de acompanhamento
        async for msg in client.receive_response():
            print(msg)

asyncio.run(interactive_session())
```

### Usando ferramentas personalizadas com ClaudeSDKClient

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

# Definir ferramentas personalizadas com decorador @tool
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
                "text": f"Erro: {str(e)}"
            }],
            "is_error": True
        }

@tool("get_time", "Obter hora atual", {})
async def get_time(args: dict[str, Any]) -> dict[str, Any]:
    from datetime import datetime
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    return {
        "content": [{
            "type": "text",
            "text": f"Hora atual: {current_time}"
        }]
    }

async def main():
    # Criar servidor SDK MCP com ferramentas personalizadas
    my_server = create_sdk_mcp_server(
        name="utilities",
        version="1.0.0",
        tools=[calculate, get_time]
    )

    # Configurar opções com o servidor
    options = ClaudeAgentOptions(
        mcp_servers={"utils": my_server},
        allowed_tools=[
            "mcp__utils__calculate",
            "mcp__utils__get_time"
        ]
    )

    # Usar ClaudeSDKClient para uso interativo de ferramentas
    async with ClaudeSDKClient(options=options) as client:
        await client.query("Quanto é 123 * 456?")

        # Processar resposta de cálculo
        async for message in client.receive_response():
            if isinstance(message, AssistantMessage):
                for block in message.content:
                    if isinstance(block, TextBlock):
                        print(f"Cálculo: {block.text}")

        # Acompanhamento com consulta de hora
        await client.query("Que horas são agora?")

        async for message in client.receive_response():
            if isinstance(message, AssistantMessage):
                for block in message.content:
                    if isinstance(block, TextBlock):
                        print(f"Hora: {block.text}")

asyncio.run(main())
```

## Configuração de Sandbox

### `SandboxSettings`

Configuração para comportamento de sandbox. Use isso para ativar sandboxing de comando e configurar restrições de rede programaticamente.

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

| Propriedade | Tipo | Padrão | Descrição |
| :------- | :--- | :------ | :---------- |
| `enabled` | `bool` | `False` | Ativar modo sandbox para execução de comando |
| `autoAllowBashIfSandboxed` | `bool` | `False` | Aprovar automaticamente comandos bash quando sandbox está ativado |
| `excludedCommands` | `list[str]` | `[]` | Comandos que sempre contornam restrições de sandbox (ex: `["docker"]`). Esses são executados sem sandbox automaticamente sem envolvimento do modelo |
| `allowUnsandboxedCommands` | `bool` | `False` | Permitir que o modelo solicite executar comandos fora do sandbox. Quando `True`, o modelo pode definir `dangerouslyDisableSandbox` na entrada da ferramenta, que volta para o [sistema de permissões](#permissions-fallback-for-unsandboxed-commands) |
| `network` | [`SandboxNetworkConfig`](#sandboxnetworkconfig) | `None` | Configuração de sandbox específica de rede |
| `ignoreViolations` | [`SandboxIgnoreViolations`](#sandboxignoreviolations) | `None` | Configurar quais violações de sandbox ignorar |
| `enableWeakerNestedSandbox` | `bool` | `False` | Ativar um sandbox aninhado mais fraco para compatibilidade |

<Note>
**Restrições de acesso a sistema de arquivos e rede** NÃO são configuradas via configurações de sandbox. Em vez disso, são derivadas de [regras de permissão](https://code.claude.com/docs/pt-BR/settings#permission-settings):

- **Restrições de leitura do sistema de arquivos**: Regras de negação de leitura
- **Restrições de escrita do sistema de arquivos**: Regras de permissão/negação de edição
- **Restrições de rede**: Regras de permissão/negação de WebFetch

Use configurações de sandbox para sandboxing de execução de comando, e regras de permissão para controle de acesso a sistema de arquivos e rede.
</Note>

#### Exemplo de uso

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
    prompt="Construir e testar meu projeto",
    options=ClaudeAgentOptions(sandbox=sandbox_settings)
):
    print(message)
```

### `SandboxNetworkConfig`

Configuração específica de rede para modo sandbox.

```python
class SandboxNetworkConfig(TypedDict, total=False):
    allowLocalBinding: bool
    allowUnixSockets: list[str]
    allowAllUnixSockets: bool
    httpProxyPort: int
    socksProxyPort: int
```

| Propriedade | Tipo | Padrão | Descrição |
| :------- | :--- | :------ | :---------- |
| `allowLocalBinding` | `bool` | `False` | Permitir que processos se vinculem a portas locais (ex: para servidores de desenvolvimento) |
| `allowUnixSockets` | `list[str]` | `[]` | Caminhos de socket Unix que processos podem acessar (ex: socket Docker) |
| `allowAllUnixSockets` | `bool` | `False` | Permitir acesso a todos os sockets Unix |
| `httpProxyPort` | `int` | `None` | Porta de proxy HTTP para requisições de rede |
| `socksProxyPort` | `int` | `None` | Porta de proxy SOCKS para requisições de rede |

### `SandboxIgnoreViolations`

Configuração para ignorar violações de sandbox específicas.

```python
class SandboxIgnoreViolations(TypedDict, total=False):
    file: list[str]
    network: list[str]
```

| Propriedade | Tipo | Padrão | Descrição |
| :------- | :--- | :------ | :---------- |
| `file` | `list[str]` | `[]` | Padrões de caminho de arquivo para ignorar violações |
| `network` | `list[str]` | `[]` | Padrões de rede para ignorar violações |

### Fallback de Permissões para Comandos Sem Sandbox

Quando `allowUnsandboxedCommands` está ativado, o modelo pode solicitar executar comandos fora do sandbox definindo `dangerouslyDisableSandbox: True` na entrada da ferramenta. Essas solicitações voltam para o sistema de permissões existente, significando que seu manipulador `can_use_tool` será invocado, permitindo que você implemente lógica de autorização personalizada.

<Note>
**`excludedCommands` vs `allowUnsandboxedCommands`:**
- `excludedCommands`: Uma lista estática de comandos que sempre contornam o sandbox automaticamente (ex: `["docker"]`). O modelo não tem controle sobre isso.
- `allowUnsandboxedCommands`: Permite que o modelo decida em tempo de execução se deve solicitar execução sem sandbox definindo `dangerouslyDisableSandbox: True` na entrada da ferramenta.
</Note>

```python
from claude_agent_sdk import query, ClaudeAgentOptions

async def can_use_tool(tool: str, input: dict) -> bool:
    # Verificar se o modelo está solicitando contornar o sandbox
    if tool == "Bash" and input.get("dangerouslyDisableSandbox"):
        # O modelo quer executar este comando fora do sandbox
        print(f"Comando sem sandbox solicitado: {input.get('command')}")

        # Retornar True para permitir, False para negar
        return is_command_authorized(input.get("command"))
    return True

async def main():
    async for message in query(
        prompt="Implantar minha aplicação",
        options=ClaudeAgentOptions(
            sandbox={
                "enabled": True,
                "allowUnsandboxedCommands": True  # Modelo pode solicitar execução sem sandbox
            },
            permission_mode="default",
            can_use_tool=can_use_tool
        )
    ):
        print(message)
```

Este padrão permite que você:

- **Auditar solicitações do modelo**: Registrar quando o modelo solicita execução sem sandbox
- **Implementar listas de permissão**: Permitir apenas comandos específicos para executar sem sandbox
- **Adicionar fluxos de trabalho de aprovação**: Exigir autorização explícita para operações privilegiadas

<Warning>
Comandos executados com `dangerouslyDisableSandbox: True` têm acesso total ao sistema. Certifique-se de que seu manipulador `can_use_tool` valida essas solicitações cuidadosamente.
</Warning>

## Veja também

- [Guia do SDK Python](/docs/pt-BR/agent-sdk/python) - Tutorial e exemplos
- [Visão geral do SDK](/docs/pt-BR/agent-sdk/overview) - Conceitos gerais do SDK
- [Referência do SDK TypeScript](/docs/pt-BR/agent-sdk/typescript) - Documentação do SDK TypeScript
- [Referência da CLI](https://code.claude.com/docs/pt-BR/cli-reference) - Interface de linha de comando
- [Fluxos de trabalho comuns](https://code.claude.com/docs/pt-BR/common-workflows) - Guias passo a passo