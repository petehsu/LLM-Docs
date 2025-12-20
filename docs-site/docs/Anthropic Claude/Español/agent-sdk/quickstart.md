# Inicio rápido

Comienza con el SDK de Agent de Python o TypeScript para construir agentes de IA que funcionen de forma autónoma

---

Utiliza el SDK de Agent para construir un agente de IA que lea tu código, encuentre errores y los corrija, todo sin intervención manual.

**Lo que harás:**
1. Configurar un proyecto con el SDK de Agent
2. Crear un archivo con código con errores
3. Ejecutar un agente que encuentre y corrija los errores automáticamente

## Requisitos previos

- **Node.js 18+** o **Python 3.10+**
- Una **cuenta de Anthropic** ([regístrate aquí](https://console.anthropic.com/))

## Configuración

<Steps>
  <Step title="Instalar Claude Code">
    El SDK de Agent utiliza Claude Code como su tiempo de ejecución. Instálalo para tu plataforma:

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

    Después de instalar Claude Code en tu máquina, ejecuta `claude` en tu terminal y sigue las indicaciones para autenticarte. El SDK utilizará esta autenticación automáticamente.

    <Tip>
    Para más información sobre la instalación de Claude Code, consulta [Configuración de Claude Code](https://docs.anthropic.com/en/docs/claude-code/setup).
    </Tip>
  </Step>

  <Step title="Crear una carpeta de proyecto">
    Crea un nuevo directorio para este inicio rápido:

    ```bash
    mkdir my-agent && cd my-agent
    ```

    Para tus propios proyectos, puedes ejecutar el SDK desde cualquier carpeta; tendrá acceso a los archivos en ese directorio y sus subdirectorios de forma predeterminada.
  </Step>

  <Step title="Instalar el SDK">
    Instala el paquete del SDK de Agent para tu lenguaje:

    <Tabs>
      <Tab title="TypeScript">
        ```bash
        npm install @anthropic-ai/claude-agent-sdk
        ```
      </Tab>
      <Tab title="Python (uv)">
        [uv](https://docs.astral.sh/uv/) es un gestor de paquetes de Python rápido que maneja entornos virtuales automáticamente:
        ```bash
        uv init && uv add claude-agent-sdk
        ```
      </Tab>
      <Tab title="Python (pip)">
        Crea un entorno virtual primero, luego instala:
        ```bash
        python3 -m venv .venv && source .venv/bin/activate
        pip3 install claude-agent-sdk
        ```
      </Tab>
    </Tabs>
  </Step>

  <Step title="Establecer tu clave de API">
    Si ya has autenticado Claude Code (ejecutando `claude` en tu terminal), el SDK utiliza esa autenticación automáticamente.

    De lo contrario, necesitas una clave de API, que puedes obtener de la [Consola de Anthropic](https://console.anthropic.com/).

    Crea un archivo `.env` en tu directorio de proyecto y almacena la clave de API allí:

    ```bash
    ANTHROPIC_API_KEY=your-api-key
    ```

    <Note>
    **¿Usas Amazon Bedrock, Google Vertex AI o Microsoft Azure?** Consulta las guías de configuración para [Bedrock](https://code.claude.com/docs/en/amazon-bedrock), [Vertex AI](https://code.claude.com/docs/en/google-vertex-ai), o [Azure AI Foundry](https://code.claude.com/docs/en/azure-ai-foundry).

    A menos que haya sido aprobado previamente, no permitimos que desarrolladores de terceros ofrezcan inicio de sesión en Claude.ai o límites de velocidad para sus productos, incluidos los agentes construidos en el SDK de Agent de Claude. Por favor, utiliza los métodos de autenticación de clave de API descritos en este documento en su lugar.
    </Note>
  </Step>
</Steps>

## Crear un archivo con errores

Este inicio rápido te guía a través de la construcción de un agente que puede encontrar y corregir errores en el código. Primero, necesitas un archivo con algunos errores intencionales para que el agente corrija. Crea `utils.py` en el directorio `my-agent` y pega el siguiente código:

```python
def calculate_average(numbers):
    total = 0
    for num in numbers:
        total += num
    return total / len(numbers)

def get_user_name(user):
    return user["name"].upper()
```

Este código tiene dos errores:
1. `calculate_average([])` se bloquea con una división por cero
2. `get_user_name(None)` se bloquea con un TypeError

## Construir un agente que encuentre y corrija errores

Crea `agent.py` si estás usando el SDK de Python, o `agent.ts` para TypeScript:

<CodeGroup>
```python Python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions, AssistantMessage, ResultMessage

async def main():
    # Agentic loop: streams messages as Claude works
    async for message in query(
        prompt="Review utils.py for bugs that would cause crashes. Fix any issues you find.",
        options=ClaudeAgentOptions(
            allowed_tools=["Read", "Edit", "Glob"],  # Tools Claude can use
            permission_mode="acceptEdits"            # Auto-approve file edits
        )
    ):
        # Print human-readable output
        if isinstance(message, AssistantMessage):
            for block in message.content:
                if hasattr(block, "text"):
                    print(block.text)              # Claude's reasoning
                elif hasattr(block, "name"):
                    print(f"Tool: {block.name}")   # Tool being called
        elif isinstance(message, ResultMessage):
            print(f"Done: {message.subtype}")      # Final result

asyncio.run(main())
```

```typescript TypeScript
import { query } from "@anthropic-ai/claude-agent-sdk";

// Agentic loop: streams messages as Claude works
for await (const message of query({
  prompt: "Review utils.py for bugs that would cause crashes. Fix any issues you find.",
  options: {
    allowedTools: ["Read", "Edit", "Glob"],  // Tools Claude can use
    permissionMode: "acceptEdits"            // Auto-approve file edits
  }
})) {
  // Print human-readable output
  if (message.type === "assistant" && message.message?.content) {
    for (const block of message.message.content) {
      if ("text" in block) {
        console.log(block.text);             // Claude's reasoning
      } else if ("name" in block) {
        console.log(`Tool: ${block.name}`);  // Tool being called
      }
    }
  } else if (message.type === "result") {
    console.log(`Done: ${message.subtype}`); // Final result
  }
}
```
</CodeGroup>

Este código tiene tres partes principales:

1. **`query`**: el punto de entrada principal que crea el bucle agentic. Devuelve un iterador asincrónico, por lo que usas `async for` para transmitir mensajes mientras Claude trabaja. Consulta la API completa en la referencia del SDK de [Python](/docs/es/agent-sdk/python#query) o [TypeScript](/docs/es/agent-sdk/typescript#query).

2. **`prompt`**: lo que quieres que haga Claude. Claude determina qué herramientas usar en función de la tarea.

3. **`options`**: configuración para el agente. Este ejemplo usa `allowedTools` para restringir Claude a `Read`, `Edit` y `Glob`, y `permissionMode: "acceptEdits"` para aprobar automáticamente los cambios de archivo. Otras opciones incluyen `systemPrompt`, `mcpServers` y más. Consulta todas las opciones para [Python](/docs/es/agent-sdk/python#claudeagentoptions) o [TypeScript](/docs/es/agent-sdk/typescript#claudeagentoptions).

El bucle `async for` sigue ejecutándose mientras Claude piensa, llama a herramientas, observa resultados y decide qué hacer a continuación. Cada iteración produce un mensaje: el razonamiento de Claude, una llamada a herramienta, un resultado de herramienta o el resultado final. El SDK maneja la orquestación (ejecución de herramientas, gestión de contexto, reintentos) para que solo consumas el flujo. El bucle termina cuando Claude completa la tarea o encuentra un error.

El manejo de mensajes dentro del bucle filtra la salida legible por humanos. Sin filtrado, verías objetos de mensaje sin procesar, incluida la inicialización del sistema y el estado interno, lo que es útil para depuración pero ruidoso de otra manera.

<Note>
Este ejemplo utiliza transmisión para mostrar el progreso en tiempo real. Si no necesitas salida en vivo (por ejemplo, para trabajos en segundo plano o canalizaciones de CI), puedes recopilar todos los mensajes a la vez. Consulta [Transmisión vs. modo de un solo turno](/docs/es/agent-sdk/streaming-vs-single-mode) para más detalles.
</Note>

### Ejecutar tu agente

Tu agente está listo. Ejecútalo con el siguiente comando:

<CodeGroup>
```bash Python
python3 agent.py
```

```bash TypeScript
npx tsx agent.ts
```
</CodeGroup>

Después de ejecutar, verifica `utils.py`. Verás código defensivo que maneja listas vacías y usuarios nulos. Tu agente de forma autónoma:

1. **Leyó** `utils.py` para entender el código
2. **Analizó** la lógica e identificó casos extremos que causarían bloqueos
3. **Editó** el archivo para agregar manejo de errores adecuado

Esto es lo que hace diferente al SDK de Agent: Claude ejecuta herramientas directamente en lugar de pedirte que las implementes.

<Note>
Si ves "Claude Code not found", [instala Claude Code](#instalar-claude-code) y reinicia tu terminal. Para "API key not found", [establece tu clave de API](#establecer-tu-clave-de-api). Consulta la [guía completa de solución de problemas](https://docs.anthropic.com/en/docs/claude-code/troubleshooting) para más ayuda.
</Note>

### Prueba otros prompts

Ahora que tu agente está configurado, prueba algunos prompts diferentes:

- `"Add docstrings to all functions in utils.py"`
- `"Add type hints to all functions in utils.py"`
- `"Create a README.md documenting the functions in utils.py"`

### Personalizar tu agente

Puedes modificar el comportamiento de tu agente cambiando las opciones. Aquí hay algunos ejemplos:

**Agregar capacidad de búsqueda web:**

<CodeGroup>
```python Python
options=ClaudeAgentOptions(
    allowed_tools=["Read", "Edit", "Glob", "WebSearch"],
    permission_mode="acceptEdits"
)
```

```typescript TypeScript
options: {
  allowedTools: ["Read", "Edit", "Glob", "WebSearch"],
  permissionMode: "acceptEdits"
}
```
</CodeGroup>

**Dale a Claude un prompt de sistema personalizado:**

<CodeGroup>
```python Python
options=ClaudeAgentOptions(
    allowed_tools=["Read", "Edit", "Glob"],
    permission_mode="acceptEdits",
    system_prompt="You are a senior Python developer. Always follow PEP 8 style guidelines."
)
```

```typescript TypeScript
options: {
  allowedTools: ["Read", "Edit", "Glob"],
  permissionMode: "acceptEdits",
  systemPrompt: "You are a senior Python developer. Always follow PEP 8 style guidelines."
}
```
</CodeGroup>

**Ejecutar comandos en la terminal:**

<CodeGroup>
```python Python
options=ClaudeAgentOptions(
    allowed_tools=["Read", "Edit", "Glob", "Bash"],
    permission_mode="acceptEdits"
)
```

```typescript TypeScript
options: {
  allowedTools: ["Read", "Edit", "Glob", "Bash"],
  permissionMode: "acceptEdits"
}
```
</CodeGroup>

Con `Bash` habilitado, prueba: `"Write unit tests for utils.py, run them, and fix any failures"`

## Conceptos clave

**Las herramientas** controlan lo que tu agente puede hacer:

| Herramientas | Lo que el agente puede hacer |
|-------|----------------------|
| `Read`, `Glob`, `Grep` | Análisis de solo lectura |
| `Read`, `Edit`, `Glob` | Analizar y modificar código |
| `Read`, `Edit`, `Bash`, `Glob`, `Grep` | Automatización completa |

**Los modos de permisos** controlan cuánta supervisión humana deseas:

| Modo | Comportamiento | Caso de uso |
|------|----------|----------|
| `acceptEdits` | Aprueba automáticamente ediciones de archivo, pide otras acciones | Flujos de trabajo de desarrollo confiables |
| `bypassPermissions` | Se ejecuta sin indicaciones | Canalizaciones de CI/CD, automatización |
| `default` | Requiere una devolución de llamada `canUseTool` para manejar la aprobación | Flujos de aprobación personalizados |

El ejemplo anterior utiliza el modo `acceptEdits`, que aprueba automáticamente las operaciones de archivo para que el agente pueda ejecutarse sin indicaciones interactivas. Si deseas solicitar a los usuarios aprobación, utiliza el modo `default` y proporciona una devolución de llamada [`canUseTool`](/docs/es/agent-sdk/permissions#canusetool) que recopile entrada del usuario. Para más control, consulta [Permisos](/docs/es/agent-sdk/permissions).

## Próximos pasos

Ahora que has creado tu primer agente, aprende cómo extender sus capacidades y adaptarlo a tu caso de uso:

- **[Permisos](/docs/es/agent-sdk/permissions)**: controla lo que tu agente puede hacer y cuándo necesita aprobación
- **[Hooks](/docs/es/agent-sdk/hooks)**: ejecuta código personalizado antes o después de llamadas a herramientas
- **[Sesiones](/docs/es/agent-sdk/sessions)**: construye agentes de múltiples turnos que mantengan contexto
- **[Servidores MCP](/docs/es/agent-sdk/mcp)**: conéctate a bases de datos, navegadores, APIs y otros sistemas externos
- **[Hosting](/docs/es/agent-sdk/hosting)**: despliega agentes en Docker, nube y CI/CD
- **[Agentes de ejemplo](https://github.com/anthropics/claude-agent-sdk-demos)**: consulta ejemplos completos: asistente de correo electrónico, agente de investigación y más