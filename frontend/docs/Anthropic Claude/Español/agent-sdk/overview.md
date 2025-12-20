# Descripción general del Agent SDK

Construye agentes de IA en producción con Claude Code como una biblioteca

---

<Note>
El Claude Code SDK ha sido renombrado a Claude Agent SDK. Si estás migrando desde el SDK antiguo, consulta la [Guía de migración](/docs/es/agent-sdk/migration-guide).
</Note>

Construye agentes de IA que leen archivos de forma autónoma, ejecutan comandos, buscan en la web, editan código y más. El Agent SDK te proporciona las mismas herramientas, bucle de agente y gestión de contexto que potencian Claude Code, programable en Python y TypeScript.

<CodeGroup>
```python Python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions

async def main():
    async for message in query(
        prompt="Find and fix the bug in auth.py",
        options=ClaudeAgentOptions(allowed_tools=["Read", "Edit", "Bash"])
    ):
        print(message)  # Claude reads the file, finds the bug, edits it

asyncio.run(main())
```

```typescript TypeScript
import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "Find and fix the bug in auth.py",
  options: { allowedTools: ["Read", "Edit", "Bash"] }
})) {
  console.log(message);  // Claude reads the file, finds the bug, edits it
}
```
</CodeGroup>

El Agent SDK incluye herramientas integradas para leer archivos, ejecutar comandos y editar código, por lo que tu agente puede comenzar a trabajar inmediatamente sin que tengas que implementar la ejecución de herramientas. Sumérgete en el inicio rápido o explora agentes reales construidos con el SDK:

<CardGroup cols={2}>
  <Card title="Inicio rápido" icon="play" href="/docs/es/agent-sdk/quickstart">
    Construye un agente corrector de errores en minutos
  </Card>
  <Card title="Agentes de ejemplo" icon="star" href="https://github.com/anthropics/claude-agent-sdk-demos">
    Asistente de correo electrónico, agente de investigación y más
  </Card>
</CardGroup>

## Capacidades

Todo lo que hace que Claude Code sea poderoso está disponible en el SDK:

<Tabs>
  <Tab title="Herramientas integradas">
    Tu agente puede leer archivos, ejecutar comandos y buscar en bases de código de forma inmediata. Las herramientas clave incluyen:

    | Herramienta | Qué hace |
    |------|--------------|
    | **Read** | Lee cualquier archivo en el directorio de trabajo |
    | **Write** | Crea nuevos archivos |
    | **Edit** | Realiza ediciones precisas en archivos existentes |
    | **Bash** | Ejecuta comandos de terminal, scripts, operaciones git |
    | **Glob** | Encuentra archivos por patrón (`**/*.ts`, `src/**/*.py`) |
    | **Grep** | Busca contenido de archivos con regex |
    | **WebSearch** | Busca en la web información actual |
    | **WebFetch** | Obtiene y analiza contenido de páginas web |

    Este ejemplo crea un agente que busca comentarios TODO en tu base de código:

    <CodeGroup>
    ```python Python
    import asyncio
    from claude_agent_sdk import query, ClaudeAgentOptions

    async def main():
        async for message in query(
            prompt="Find all TODO comments and create a summary",
            options=ClaudeAgentOptions(allowed_tools=["Read", "Glob", "Grep"])
        ):
            print(message)

    asyncio.run(main())
    ```

    ```typescript TypeScript
    import { query } from "@anthropic-ai/claude-agent-sdk";

    for await (const message of query({
      prompt: "Find all TODO comments and create a summary",
      options: { allowedTools: ["Read", "Glob", "Grep"] }
    })) {
      console.log(message);
    }
    ```
    </CodeGroup>

  </Tab>
  <Tab title="Hooks">
    Ejecuta código personalizado en puntos clave del ciclo de vida del agente. Los hooks pueden ejecutar comandos de shell o scripts personalizados para validar, registrar, bloquear o transformar el comportamiento del agente.

    **Hooks disponibles:** `PreToolUse`, `PostToolUse`, `Stop`, `SessionStart`, `SessionEnd`, `UserPromptSubmit` y más.

    Este ejemplo registra todos los cambios de archivo en un archivo de auditoría:

    <CodeGroup>
    ```python Python
    import asyncio
    from claude_agent_sdk import query, ClaudeAgentOptions

    async def main():
        async for message in query(
            prompt="Suggest improvements to utils.py",
            options=ClaudeAgentOptions(
                permission_mode="acceptEdits",
                hooks={
                    "PostToolUse": [{
                        "matcher": "Edit|Write",
                        "hooks": [{"type": "command", "command": "echo \"$(date): file modified\" >> ./audit.log"}]
                    }]
                }
            )
        ):
            print(message)

    asyncio.run(main())
    ```

    ```typescript TypeScript
    import { query } from "@anthropic-ai/claude-agent-sdk";

    for await (const message of query({
      prompt: "Suggest improvements to utils.py",
      options: {
        permissionMode: "acceptEdits",
        hooks: {
          PostToolUse: [{
            matcher: "Edit|Write",
            hooks: [{ type: "command", command: "echo \"$(date): file modified\" >> ./audit.log" }]
          }]
        }
      }
    })) {
      console.log(message);
    }
    ```
    </CodeGroup>

    [Obtén más información sobre hooks →](/docs/es/agent-sdk/hooks)
  </Tab>
  <Tab title="Subagentes">
    Genera agentes especializados para manejar subtareas enfocadas. Tu agente principal delega trabajo y los subagentes reportan resultados.

    Habilita la herramienta `Task` para permitir que Claude genere subagentes cuando decide que una tarea es lo suficientemente compleja como para beneficiarse de la delegación. Claude determina automáticamente cuándo usar subagentes en función de la complejidad de la tarea.

    <CodeGroup>
    ```python Python
    import asyncio
    from claude_agent_sdk import query, ClaudeAgentOptions

    async def main():
        async for message in query(
            prompt="Analyze this codebase for security vulnerabilities",
            options=ClaudeAgentOptions(allowed_tools=["Read", "Glob", "Grep", "Task"])
        ):
            print(message)

    asyncio.run(main())
    ```

    ```typescript TypeScript
    import { query } from "@anthropic-ai/claude-agent-sdk";

    for await (const message of query({
      prompt: "Analyze this codebase for security vulnerabilities",
      options: {
        allowedTools: ["Read", "Glob", "Grep", "Task"]
      }
    })) {
      console.log(message);
    }
    ```
    </CodeGroup>

    También puedes definir tipos de agentes personalizados con la opción `agents` para patrones de delegación más especializados.

    [Obtén más información sobre subagentes →](/docs/es/agent-sdk/subagents)
  </Tab>
  <Tab title="MCP">
    Conéctate a sistemas externos a través del Protocolo de Contexto del Modelo: bases de datos, navegadores, APIs y [cientos más](https://github.com/modelcontextprotocol/servers).

    Este ejemplo conecta el [servidor MCP de Playwright](https://github.com/microsoft/playwright-mcp) para dar a tu agente capacidades de automatización de navegador:

    <CodeGroup>
    ```python Python
    import asyncio
    from claude_agent_sdk import query, ClaudeAgentOptions

    async def main():
        async for message in query(
            prompt="Open example.com and describe what you see",
            options=ClaudeAgentOptions(
                mcp_servers={
                    "playwright": {"command": "npx", "args": ["@playwright/mcp@latest"]}
                }
            )
        ):
            print(message)

    asyncio.run(main())
    ```

    ```typescript TypeScript
    import { query } from "@anthropic-ai/claude-agent-sdk";

    for await (const message of query({
      prompt: "Open example.com and describe what you see",
      options: {
        mcpServers: {
          playwright: { command: "npx", args: ["@playwright/mcp@latest"] }
        }
      }
    })) {
      console.log(message);
    }
    ```
    </CodeGroup>

    [Obtén más información sobre MCP →](/docs/es/agent-sdk/mcp)
  </Tab>
  <Tab title="Permisos">
    Controla exactamente qué herramientas puede usar tu agente. Permite operaciones seguras, bloquea las peligrosas o requiere aprobación para acciones sensibles.

    Este ejemplo crea un agente de solo lectura que puede analizar pero no modificar código:

    <CodeGroup>
    ```python Python
    import asyncio
    from claude_agent_sdk import query, ClaudeAgentOptions

    async def main():
        async for message in query(
            prompt="Review this code for best practices",
            options=ClaudeAgentOptions(
                allowed_tools=["Read", "Glob", "Grep"],
                permission_mode="bypassPermissions"
            )
        ):
            print(message)

    asyncio.run(main())
    ```

    ```typescript TypeScript
    import { query } from "@anthropic-ai/claude-agent-sdk";

    for await (const message of query({
      prompt: "Review this code for best practices",
      options: {
        allowedTools: ["Read", "Glob", "Grep"],
        permissionMode: "bypassPermissions"
      }
    })) {
      console.log(message);
    }
    ```
    </CodeGroup>

    [Obtén más información sobre permisos →](/docs/es/agent-sdk/permissions)
  </Tab>
  <Tab title="Sesiones">
    Mantén contexto a través de múltiples intercambios. Claude recuerda archivos leídos, análisis realizados e historial de conversación. Reanuda sesiones más tarde o divídelas para explorar diferentes enfoques.

    Este ejemplo captura el ID de sesión de la primera consulta, luego reanuda para continuar con contexto completo:

    <CodeGroup>
    ```python Python
    import asyncio
    from claude_agent_sdk import query, ClaudeAgentOptions

    async def main():
        session_id = None

        # First query: capture the session ID
        async for message in query(
            prompt="Read the authentication module",
            options=ClaudeAgentOptions(allowed_tools=["Read", "Glob"])
        ):
            if hasattr(message, 'subtype') and message.subtype == 'init':
                session_id = message.data.get('session_id')

        # Resume with full context from the first query
        async for message in query(
            prompt="Now find all places that call it",  # "it" = auth module
            options=ClaudeAgentOptions(resume=session_id)
        ):
            pass

    asyncio.run(main())
    ```

    ```typescript TypeScript
    import { query } from "@anthropic-ai/claude-agent-sdk";

    let sessionId: string | undefined;

    // First query: capture the session ID
    for await (const message of query({
      prompt: "Read the authentication module",
      options: { allowedTools: ["Read", "Glob"] }
    })) {
      if (message.type === "system" && message.subtype === "init") {
        sessionId = message.session_id;
      }
    }

    // Resume with full context from the first query
    for await (const message of query({
      prompt: "Now find all places that call it",  // "it" = auth module
      options: { resume: sessionId }
    })) {
      // Process messages...
    }
    ```
    </CodeGroup>

    [Obtén más información sobre sesiones →](/docs/es/agent-sdk/sessions)
  </Tab>
</Tabs>

### Características de Claude Code

El SDK también admite la configuración basada en el sistema de archivos de Claude Code. Para usar estas características, establece `setting_sources=["project"]` (Python) o `settingSources: ['project']` (TypeScript) en tus opciones.

| Característica | Descripción | Ubicación |
|---------|-------------|----------|
| [Skills](/docs/es/agent-sdk/skills) | Capacidades especializadas definidas en Markdown | `.claude/skills/SKILL.md` |
| [Slash commands](/docs/es/agent-sdk/slash-commands) | Comandos personalizados para tareas comunes | `.claude/commands/*.md` |
| [Memory](/docs/es/agent-sdk/modifying-system-prompts) | Contexto del proyecto e instrucciones | `CLAUDE.md` o `.claude/CLAUDE.md` |
| [Plugins](/docs/es/agent-sdk/plugins) | Extiende con comandos personalizados, agentes y servidores MCP | Programático a través de la opción `plugins` |

## Comenzar

<Steps>
  <Step title="Instala Claude Code">
    El SDK usa Claude Code como su tiempo de ejecución:

    <Tabs>
      <Tab title="macOS/Linux/WSL">
        ```bash
        curl -fsSL https://claude.ai/install.sh | bash
        ```
      </Tab>
      <Tab title="Homebrew">
        ```bash
        brew install --cask claude-code
        ```
      </Tab>
      <Tab title="npm">
        ```bash
        npm install -g @anthropic-ai/claude-code
        ```
      </Tab>
    </Tabs>

    Consulta [Configuración de Claude Code](https://docs.anthropic.com/en/docs/claude-code/setup) para Windows y otras opciones.
  </Step>
  <Step title="Instala el SDK">
    <Tabs>
      <Tab title="TypeScript">
        ```bash
        npm install @anthropic-ai/claude-agent-sdk
        ```
      </Tab>
      <Tab title="Python">
        ```bash
        pip install claude-agent-sdk
        ```
      </Tab>
    </Tabs>
  </Step>
  <Step title="Establece tu clave API">
    ```bash
    export ANTHROPIC_API_KEY=your-api-key
    ```
    Obtén tu clave de la [Consola](https://console.anthropic.com/).

    El SDK también admite autenticación a través de proveedores de API de terceros:

    - **Amazon Bedrock**: Establece la variable de entorno `CLAUDE_CODE_USE_BEDROCK=1` y configura las credenciales de AWS
    - **Google Vertex AI**: Establece la variable de entorno `CLAUDE_CODE_USE_VERTEX=1` y configura las credenciales de Google Cloud
    - **Microsoft Foundry**: Establece la variable de entorno `CLAUDE_CODE_USE_FOUNDRY=1` y configura las credenciales de Azure

    <Note>
    A menos que haya sido previamente aprobado, no permitimos que desarrolladores de terceros ofrezcan inicio de sesión en Claude.ai o límites de velocidad para sus productos, incluidos agentes construidos en el Claude Agent SDK. Por favor, utiliza los métodos de autenticación de clave API descritos en este documento en su lugar.
    </Note>
  </Step>
  <Step title="Ejecuta tu primer agente">
    Este ejemplo crea un agente que lista archivos en tu directorio actual usando herramientas integradas.

    <CodeGroup>
    ```python Python
    import asyncio
    from claude_agent_sdk import query, ClaudeAgentOptions

    async def main():
        async for message in query(
            prompt="What files are in this directory?",
            options=ClaudeAgentOptions(allowed_tools=["Bash", "Glob"])
        ):
            print(message)

    asyncio.run(main())
    ```

    ```typescript TypeScript
    import { query } from "@anthropic-ai/claude-agent-sdk";

    for await (const message of query({
      prompt: "What files are in this directory?",
      options: { allowedTools: ["Bash", "Glob"] },
    })) {
      console.log(message);
    }
    ```
    </CodeGroup>
  </Step>
</Steps>

**¿Listo para construir?** Sigue el [Inicio rápido](/docs/es/agent-sdk/quickstart) para crear un agente que encuentre y corrija errores en minutos.

## Compara el Agent SDK con otras herramientas de Claude

La plataforma Claude ofrece múltiples formas de construir con Claude. Así es como se ajusta el Agent SDK:

<Tabs>
  <Tab title="Agent SDK vs Client SDK">
    El [Anthropic Client SDK](/docs/es/api/client-sdks) te proporciona acceso directo a la API: envías indicaciones e implementas la ejecución de herramientas tú mismo. El **Agent SDK** te proporciona Claude con ejecución de herramientas integrada.

    Con el Client SDK, implementas un bucle de herramientas. Con el Agent SDK, Claude lo maneja:

    <CodeGroup>
    ```python Python
    # Client SDK: You implement the tool loop
    response = client.messages.create(...)
    while response.stop_reason == "tool_use":
        result = your_tool_executor(response.tool_use)
        response = client.messages.create(tool_result=result, ...)

    # Agent SDK: Claude handles tools autonomously
    async for message in query(prompt="Fix the bug in auth.py"):
        print(message)
    ```

    ```typescript TypeScript
    // Client SDK: You implement the tool loop
    let response = await client.messages.create({...});
    while (response.stop_reason === "tool_use") {
      const result = yourToolExecutor(response.tool_use);
      response = await client.messages.create({ tool_result: result, ... });
    }

    // Agent SDK: Claude handles tools autonomously
    for await (const message of query({ prompt: "Fix the bug in auth.py" })) {
      console.log(message);
    }
    ```
    </CodeGroup>
  </Tab>
  <Tab title="Agent SDK vs Claude Code CLI">
    Mismas capacidades, interfaz diferente:

    | Caso de uso | Mejor opción |
    |----------|-------------|
    | Desarrollo interactivo | CLI |
    | Tuberías CI/CD | SDK |
    | Aplicaciones personalizadas | SDK |
    | Tareas puntuales | CLI |
    | Automatización en producción | SDK |

    Muchos equipos usan ambos: CLI para desarrollo diario, SDK para producción. Los flujos de trabajo se traducen directamente entre ellos.
  </Tab>
</Tabs>

## Registro de cambios

Ver el registro de cambios completo para actualizaciones del SDK, correcciones de errores y nuevas características:

- **TypeScript SDK**: [Ver CHANGELOG.md](https://github.com/anthropics/claude-agent-sdk-typescript/blob/main/CHANGELOG.md)
- **Python SDK**: [Ver CHANGELOG.md](https://github.com/anthropics/claude-agent-sdk-python/blob/main/CHANGELOG.md)

## Reportar errores

Si encuentras errores o problemas con el Agent SDK:

- **TypeScript SDK**: [Reporta problemas en GitHub](https://github.com/anthropics/claude-agent-sdk-typescript/issues)
- **Python SDK**: [Reporta problemas en GitHub](https://github.com/anthropics/claude-agent-sdk-python/issues)

## Directrices de marca

Para socios que integran el Claude Agent SDK, el uso de la marca Claude es opcional. Al hacer referencia a Claude en tu producto:

**Permitido:**
- "Claude Agent" (preferido para menús desplegables)
- "Claude" (cuando ya está dentro de un menú etiquetado como "Agents")
- "{YourAgentName} Powered by Claude" (si tienes un nombre de agente existente)

**No permitido:**
- "Claude Code" o "Claude Code Agent"
- Arte ASCII de marca Claude Code o elementos visuales que imiten Claude Code

Tu producto debe mantener su propia marca y no parecer ser Claude Code o ningún producto de Anthropic. Para preguntas sobre cumplimiento de marca, contacta a nuestro [equipo de ventas](https://www.anthropic.com/contact-sales).

## Licencia y términos

El uso del Claude Agent SDK se rige por los [Términos de Servicio Comerciales de Anthropic](https://www.anthropic.com/legal/commercial-terms), incluso cuando lo usas para potenciar productos y servicios que pones a disposición de tus propios clientes y usuarios finales, excepto en la medida en que un componente específico o dependencia esté cubierto por una licencia diferente como se indica en el archivo LICENSE de ese componente.

## Próximos pasos

<CardGroup cols={2}>
  <Card title="Inicio rápido" icon="play" href="/docs/es/agent-sdk/quickstart">
    Construye un agente que encuentre y corrija errores en minutos
  </Card>
  <Card title="Agentes de ejemplo" icon="star" href="https://github.com/anthropics/claude-agent-sdk-demos">
    Asistente de correo electrónico, agente de investigación y más
  </Card>
  <Card title="TypeScript SDK" icon="code" href="/docs/es/agent-sdk/typescript">
    Referencia completa de API de TypeScript y ejemplos
  </Card>
  <Card title="Python SDK" icon="code" href="/docs/es/agent-sdk/python">
    Referencia completa de API de Python y ejemplos
  </Card>
</CardGroup>