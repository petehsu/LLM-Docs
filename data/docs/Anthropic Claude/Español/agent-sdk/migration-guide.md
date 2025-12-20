# Migrar a Claude Agent SDK

Guía para migrar los SDKs de TypeScript y Python de Claude Code al Claude Agent SDK

---

## Descripción general

El SDK de Claude Code ha sido renombrado a **Claude Agent SDK** y su documentación ha sido reorganizada. Este cambio refleja las capacidades más amplias del SDK para construir agentes de IA más allá de solo tareas de codificación.

## Qué ha cambiado

| Aspecto                   | Anterior                    | Nuevo                            |
| :----------------------- | :-------------------------- | :------------------------------- |
| **Nombre del paquete (TS/JS)** | `@anthropic-ai/claude-code` | `@anthropic-ai/claude-agent-sdk` |
| **Paquete de Python**       | `claude-code-sdk`           | `claude-agent-sdk`               |
| **Ubicación de la documentación** | Documentación de Claude Code | Guía de API → Sección Agent SDK |

<Note>
**Cambios en la documentación:** La documentación del Agent SDK se ha movido de los documentos de Claude Code a la Guía de API bajo una sección dedicada [Agent SDK](/docs/es/agent-sdk/overview). Los documentos de Claude Code ahora se enfocan en la herramienta CLI y características de automatización.
</Note>

## Pasos de migración

### Para proyectos de TypeScript/JavaScript

**1. Desinstala el paquete anterior:**

```bash
npm uninstall @anthropic-ai/claude-code
```

**2. Instala el nuevo paquete:**

```bash
npm install @anthropic-ai/claude-agent-sdk
```

**3. Actualiza tus importaciones:**

Cambia todas las importaciones de `@anthropic-ai/claude-code` a `@anthropic-ai/claude-agent-sdk`:

```typescript
// Antes
import { query, tool, createSdkMcpServer } from "@anthropic-ai/claude-code";

// Después
import {
  query,
  tool,
  createSdkMcpServer,
} from "@anthropic-ai/claude-agent-sdk";
```

**4. Actualiza las dependencias de package.json:**

Si tienes el paquete listado en tu `package.json`, actualízalo:

```json
// Antes
{
  "dependencies": {
    "@anthropic-ai/claude-code": "^1.0.0"
  }
}

// Después
{
  "dependencies": {
    "@anthropic-ai/claude-agent-sdk": "^0.1.0"
  }
}
```

¡Eso es todo! No se requieren otros cambios de código.

### Para proyectos de Python

**1. Desinstala el paquete anterior:**

```bash
pip uninstall claude-code-sdk
```

**2. Instala el nuevo paquete:**

```bash
pip install claude-agent-sdk
```

**3. Actualiza tus importaciones:**

Cambia todas las importaciones de `claude_code_sdk` a `claude_agent_sdk`:

```python
# Antes
from claude_code_sdk import query, ClaudeCodeOptions

# Después
from claude_agent_sdk import query, ClaudeAgentOptions
```

**4. Actualiza los nombres de tipos:**

Cambia `ClaudeCodeOptions` a `ClaudeAgentOptions`:

```python
# Antes
from claude_agent_sdk import query, ClaudeCodeOptions

options = ClaudeCodeOptions(
    model="claude-sonnet-4-5"
)

# Después
from claude_agent_sdk import query, ClaudeAgentOptions

options = ClaudeAgentOptions(
    model="claude-sonnet-4-5"
)
```

**5. Revisa [cambios importantes](#breaking-changes)**

Realiza los cambios de código necesarios para completar la migración.

## Cambios importantes

<Warning>
Para mejorar el aislamiento y la configuración explícita, Claude Agent SDK v0.1.0 introduce cambios importantes para usuarios que migran desde Claude Code SDK. Revisa esta sección cuidadosamente antes de migrar.
</Warning>

### Python: ClaudeCodeOptions renombrado a ClaudeAgentOptions

**Qué cambió:** El tipo de SDK de Python `ClaudeCodeOptions` ha sido renombrado a `ClaudeAgentOptions`.

**Migración:**

```python
# ANTES (v0.0.x)
from claude_agent_sdk import query, ClaudeCodeOptions

options = ClaudeCodeOptions(
    model="claude-sonnet-4-5",
    permission_mode="acceptEdits"
)

# DESPUÉS (v0.1.0)
from claude_agent_sdk import query, ClaudeAgentOptions

options = ClaudeAgentOptions(
    model="claude-sonnet-4-5",
    permission_mode="acceptEdits"
)
```

**Por qué cambió:** El nombre del tipo ahora coincide con la marca "Claude Agent SDK" y proporciona consistencia en las convenciones de nomenclatura del SDK.

### El mensaje del sistema ya no es predeterminado

**Qué cambió:** El SDK ya no utiliza el mensaje del sistema de Claude Code de forma predeterminada.

**Migración:**

<CodeGroup>

```typescript TypeScript
// ANTES (v0.0.x) - Utilizaba el mensaje del sistema de Claude Code de forma predeterminada
const result = query({ prompt: "Hello" });

// DESPUÉS (v0.1.0) - Utiliza un mensaje del sistema vacío de forma predeterminada
// Para obtener el comportamiento anterior, solicita explícitamente el preajuste de Claude Code:
const result = query({
  prompt: "Hello",
  options: {
    systemPrompt: { type: "preset", preset: "claude_code" }
  }
});

// O utiliza un mensaje del sistema personalizado:
const result = query({
  prompt: "Hello",
  options: {
    systemPrompt: "You are a helpful coding assistant"
  }
});
```

```python Python
# ANTES (v0.0.x) - Utilizaba el mensaje del sistema de Claude Code de forma predeterminada
async for message in query(prompt="Hello"):
    print(message)

# DESPUÉS (v0.1.0) - Utiliza un mensaje del sistema vacío de forma predeterminada
# Para obtener el comportamiento anterior, solicita explícitamente el preajuste de Claude Code:
from claude_agent_sdk import query, ClaudeAgentOptions

async for message in query(
    prompt="Hello",
    options=ClaudeAgentOptions(
        system_prompt={"type": "preset", "preset": "claude_code"}  # Utiliza el preajuste
    )
):
    print(message)

# O utiliza un mensaje del sistema personalizado:
async for message in query(
    prompt="Hello",
    options=ClaudeAgentOptions(
        system_prompt="You are a helpful coding assistant"
    )
):
    print(message)
```

</CodeGroup>

**Por qué cambió:** Proporciona mejor control e aislamiento para aplicaciones SDK. Ahora puedes construir agentes con comportamiento personalizado sin heredar las instrucciones enfocadas en CLI de Claude Code.

### Las fuentes de configuración ya no se cargan de forma predeterminada

**Qué cambió:** El SDK ya no lee la configuración del sistema de archivos (CLAUDE.md, settings.json, comandos de barra, etc.) de forma predeterminada.

**Migración:**

<CodeGroup>

```typescript TypeScript
// ANTES (v0.0.x) - Cargaba toda la configuración automáticamente
const result = query({ prompt: "Hello" });
// Leería desde:
// - ~/.claude/settings.json (usuario)
// - .claude/settings.json (proyecto)
// - .claude/settings.local.json (local)
// - Archivos CLAUDE.md
// - Comandos de barra personalizados

// DESPUÉS (v0.1.0) - No se carga configuración de forma predeterminada
// Para obtener el comportamiento anterior:
const result = query({
  prompt: "Hello",
  options: {
    settingSources: ["user", "project", "local"]
  }
});

// O carga solo fuentes específicas:
const result = query({
  prompt: "Hello",
  options: {
    settingSources: ["project"]  // Solo configuración del proyecto
  }
});
```

```python Python
# ANTES (v0.0.x) - Cargaba toda la configuración automáticamente
async for message in query(prompt="Hello"):
    print(message)
# Leería desde:
# - ~/.claude/settings.json (usuario)
# - .claude/settings.json (proyecto)
# - .claude/settings.local.json (local)
# - Archivos CLAUDE.md
# - Comandos de barra personalizados

# DESPUÉS (v0.1.0) - No se carga configuración de forma predeterminada
# Para obtener el comportamiento anterior:
from claude_agent_sdk import query, ClaudeAgentOptions

async for message in query(
    prompt="Hello",
    options=ClaudeAgentOptions(
        setting_sources=["user", "project", "local"]
    )
):
    print(message)

# O carga solo fuentes específicas:
async for message in query(
    prompt="Hello",
    options=ClaudeAgentOptions(
        setting_sources=["project"]  # Solo configuración del proyecto
    )
):
    print(message)
```

</CodeGroup>

**Por qué cambió:** Garantiza que las aplicaciones SDK tengan un comportamiento predecible independiente de las configuraciones del sistema de archivos local. Esto es especialmente importante para:
- **Entornos CI/CD** - Comportamiento consistente sin personalizaciones locales
- **Aplicaciones implementadas** - Sin dependencia de la configuración del sistema de archivos
- **Pruebas** - Entornos de prueba aislados
- **Sistemas multiusuario** - Prevenir fugas de configuración entre usuarios

<Note>
**Compatibilidad hacia atrás:** Si tu aplicación dependía de la configuración del sistema de archivos (comandos de barra personalizados, instrucciones de CLAUDE.md, etc.), agrega `settingSources: ['user', 'project', 'local']` a tus opciones.
</Note>

## ¿Por qué el cambio de nombre?

El SDK de Claude Code fue diseñado originalmente para tareas de codificación, pero ha evolucionado hacia un marco poderoso para construir todo tipo de agentes de IA. El nuevo nombre "Claude Agent SDK" refleja mejor sus capacidades:

- Construir agentes empresariales (asistentes legales, asesores financieros, soporte al cliente)
- Crear agentes de codificación especializados (bots SRE, revisores de seguridad, agentes de revisión de código)
- Desarrollar agentes personalizados para cualquier dominio con uso de herramientas, integración MCP y más

## Obtener ayuda

Si encuentras problemas durante la migración:

**Para TypeScript/JavaScript:**

1. Verifica que todas las importaciones se actualicen para usar `@anthropic-ai/claude-agent-sdk`
2. Verifica que tu package.json tenga el nuevo nombre de paquete
3. Ejecuta `npm install` para asegurar que las dependencias se actualicen

**Para Python:**

1. Verifica que todas las importaciones se actualicen para usar `claude_agent_sdk`
2. Verifica que tu requirements.txt o pyproject.toml tenga el nuevo nombre de paquete
3. Ejecuta `pip install claude-agent-sdk` para asegurar que el paquete esté instalado

## Próximos pasos

- Explora la [Descripción general de Agent SDK](/docs/es/agent-sdk/overview) para aprender sobre las características disponibles
- Consulta la [Referencia del SDK de TypeScript](/docs/es/agent-sdk/typescript) para documentación detallada de la API
- Revisa la [Referencia del SDK de Python](/docs/es/agent-sdk/python) para documentación específica de Python
- Aprende sobre [Herramientas personalizadas](/docs/es/agent-sdk/custom-tools) e [Integración MCP](/docs/es/agent-sdk/mcp)