# Edición de contexto

Administra automáticamente el contexto de la conversación a medida que crece con la edición de contexto.

---

## Descripción general

La edición de contexto te permite administrar automáticamente el contexto de la conversación a medida que crece, ayudándote a optimizar costos y mantenerte dentro de los límites de la ventana de contexto. Puedes usar estrategias de API del lado del servidor, características del SDK del lado del cliente, o ambas juntas.

| Enfoque | Dónde se ejecuta | Estrategias | Cómo funciona |
|----------|---------------|------------|--------------|
| **Lado del servidor** | API | Limpieza de resultados de herramientas (`clear_tool_uses_20250919`)<br/>Limpieza de bloques de pensamiento (`clear_thinking_20251015`) | Se aplica antes de que el mensaje llegue a Claude. Limpia contenido específico del historial de conversación. Cada estrategia se puede configurar de forma independiente. |
| **Lado del cliente** | SDK | Compactación | Disponible en [SDKs de Python y TypeScript](/docs/es/api/client-sdks) cuando se usa [`tool_runner`](/docs/es/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta). Genera un resumen y reemplaza el historial completo de conversación. Ver [Compactación](#client-side-compaction-sdk) abajo. |

## Descripción general

La edición de contexto te permite administrar automáticamente el contexto de la conversación a medida que crece, ayudándote a optimizar costos y mantenerte dentro de los límites de la ventana de contexto. Puedes usar estrategias de API del lado del servidor, características del SDK del lado del cliente, o ambas juntas.

| Enfoque | Dónde se ejecuta | Estrategias | Cómo funciona |
|----------|---------------|------------|--------------|
| **Lado del servidor** | API | Limpieza de resultados de herramientas (`clear_tool_uses_20250919`)<br/>Limpieza de bloques de pensamiento (`clear_thinking_20251015`) | Se aplica antes de que el mensaje llegue a Claude. Limpia contenido específico del historial de conversación. Cada estrategia se puede configurar de forma independiente. |
| **Lado del cliente** | SDK | Compactación | Disponible en [SDKs de Python y TypeScript](/docs/es/api/client-sdks) cuando se usa [`tool_runner`](/docs/es/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta). Genera un resumen y reemplaza el historial completo de conversación. Ver [Compactación](#client-side-compaction-sdk) abajo. |

## Estrategias del lado del servidor

<Note>
La edición de contexto está actualmente en beta con soporte para limpieza de resultados de herramientas y limpieza de bloques de pensamiento. Para habilitarla, usa el encabezado beta `context-management-2025-06-27` en tus solicitudes de API.

Por favor, comunícate a través de nuestro [formulario de comentarios](https://forms.gle/YXC2EKGMhjN1c4L88) para compartir tus comentarios sobre esta función.
</Note>

### Limpieza de resultados de herramientas

La estrategia `clear_tool_uses_20250919` limpia los resultados de herramientas cuando el contexto de la conversación crece más allá de tu umbral configurado. Cuando se activa, la API limpia automáticamente los resultados de herramientas más antiguos en orden cronológico, reemplazándolos con texto de marcador de posición para que Claude sepa que el resultado de la herramienta fue eliminado. Por defecto, solo se limpian los resultados de herramientas. Opcionalmente, puedes limpiar tanto los resultados de herramientas como las llamadas de herramientas (los parámetros de uso de herramientas) configurando `clear_tool_inputs` en verdadero.

### Limpieza de bloques de pensamiento

La estrategia `clear_thinking_20251015` administra bloques `thinking` en conversaciones cuando el pensamiento extendido está habilitado. Esta estrategia limpia automáticamente los bloques de pensamiento más antiguos de turnos anteriores.

<Tip>
**Comportamiento predeterminado**: Cuando el pensamiento extendido está habilitado sin configurar la estrategia `clear_thinking_20251015`, la API mantiene automáticamente solo los bloques de pensamiento del último turno del asistente (equivalente a `keep: {type: "thinking_turns", value: 1}`).

Para maximizar los aciertos de caché, preserva todos los bloques de pensamiento configurando `keep: "all"`.
</Tip>

<Note>
Un turno de conversación del asistente puede incluir múltiples bloques de contenido (por ejemplo, cuando se usan herramientas) y múltiples bloques de pensamiento (por ejemplo, con [pensamiento intercalado](/docs/es/build-with-claude/extended-thinking#interleaved-thinking)).
</Note>

<Tip>
**La edición de contexto ocurre del lado del servidor**

La edición de contexto se aplica **del lado del servidor** antes de que el mensaje llegue a Claude. Tu aplicación cliente mantiene el historial completo y sin modificar de la conversación—no necesitas sincronizar el estado de tu cliente con la versión editada. Continúa administrando tu historial completo de conversación localmente como lo harías normalmente.
</Tip>

<Tip>
**Edición de contexto y almacenamiento en caché de mensajes**

La interacción de la edición de contexto con [almacenamiento en caché de mensajes](/docs/es/build-with-claude/prompt-caching) varía según la estrategia:

- **Limpieza de resultados de herramientas**: Invalida los prefijos de mensajes en caché cuando se limpia contenido. Para tener esto en cuenta, recomendamos limpiar suficientes tokens para que la invalidación del caché valga la pena. Usa el parámetro `clear_at_least` para asegurar que se limpie un número mínimo de tokens cada vez. Incurrirás en costos de escritura de caché cada vez que se limpie contenido, pero las solicitudes posteriores pueden reutilizar el prefijo recién almacenado en caché.

- **Limpieza de bloques de pensamiento**: Cuando los bloques de pensamiento están **mantenidos** en contexto (no limpios), el caché de mensajes se preserva, habilitando aciertos de caché y reduciendo costos de tokens de entrada. Cuando los bloques de pensamiento están **limpios**, el caché se invalida en el punto donde ocurre la limpieza. Configura el parámetro `keep` basándote en si deseas priorizar el rendimiento del caché o la disponibilidad de la ventana de contexto.
</Tip>

## Modelos soportados

La edición de contexto está disponible en:

- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)
- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)

## Uso de limpieza de resultados de herramientas

La forma más simple de habilitar la limpieza de resultados de herramientas es especificar solo el tipo de estrategia, ya que todas las otras [opciones de configuración](#configuration-options-for-tool-result-clearing) usarán sus valores predeterminados:

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": "Search for recent developments in AI"
            }
        ],
        "tools": [
            {
                "type": "web_search_20250305",
                "name": "web_search"
            }
        ],
        "context_management": {
            "edits": [
                {"type": "clear_tool_uses_20250919"}
            ]
        }
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Search for recent developments in AI"
        }
    ],
    tools=[
        {
            "type": "web_search_20250305",
            "name": "web_search"
        }
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {"type": "clear_tool_uses_20250919"}
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [
    {
      role: "user",
      content: "Search for recent developments in AI"
    }
  ],
  tools: [
    {
      type: "web_search_20250305",
      name: "web_search"
    }
  ],
  context_management: {
    edits: [
      { type: "clear_tool_uses_20250919" }
    ]
  },
  betas: ["context-management-2025-06-27"]
});
```

</CodeGroup>

### Configuración avanzada

Puedes personalizar el comportamiento de limpieza de resultados de herramientas con parámetros adicionales:

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": "Create a simple command line calculator app using Python"
            }
        ],
        "tools": [
            {
                "type": "text_editor_20250728",
                "name": "str_replace_based_edit_tool",
                "max_characters": 10000
            },
            {
                "type": "web_search_20250305",
                "name": "web_search",
                "max_uses": 3
            }
        ],
        "context_management": {
            "edits": [
                {
                    "type": "clear_tool_uses_20250919",
                    "trigger": {
                        "type": "input_tokens",
                        "value": 30000
                    },
                    "keep": {
                        "type": "tool_uses",
                        "value": 3
                    },
                    "clear_at_least": {
                        "type": "input_tokens",
                        "value": 5000
                    },
                    "exclude_tools": ["web_search"]
                }
            ]
        }
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Create a simple command line calculator app using Python"
        }
    ],
    tools=[
        {
            "type": "text_editor_20250728",
            "name": "str_replace_based_edit_tool",
            "max_characters": 10000
        },
        {
            "type": "web_search_20250305",
            "name": "web_search",
            "max_uses": 3
        }
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_tool_uses_20250919",
                # Trigger clearing when threshold is exceeded
                "trigger": {
                    "type": "input_tokens",
                    "value": 30000
                },
                # Number of tool uses to keep after clearing
                "keep": {
                    "type": "tool_uses",
                    "value": 3
                },
                # Optional: Clear at least this many tokens
                "clear_at_least": {
                    "type": "input_tokens",
                    "value": 5000
                },
                # Exclude these tools from being cleared
                "exclude_tools": ["web_search"]
            }
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [
    {
      role: "user",
      content: "Create a simple command line calculator app using Python"
    }
  ],
  tools: [
    {
      type: "text_editor_20250728",
      name: "str_replace_based_edit_tool",
      max_characters: 10000
    },
    {
      type: "web_search_20250305",
      name: "web_search",
      max_uses: 3
    }
  ],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_tool_uses_20250919",
        // Trigger clearing when threshold is exceeded
        trigger: {
          type: "input_tokens",
          value: 30000
        },
        // Number of tool uses to keep after clearing
        keep: {
          type: "tool_uses",
          value: 3
        },
        // Optional: Clear at least this many tokens
        clear_at_least: {
          type: "input_tokens",
          value: 5000
        },
        // Exclude these tools from being cleared
        exclude_tools: ["web_search"]
      }
    ]
  }
});
```

</CodeGroup>

## Descripción general

La edición de contexto te permite gestionar automáticamente el contexto de la conversación a medida que crece, ayudándote a optimizar costos y mantenerte dentro de los límites de la ventana de contexto. Puedes usar estrategias de API del lado del servidor, características del SDK del lado del cliente, o ambas juntas.

| Enfoque | Dónde se ejecuta | Estrategias | Cómo funciona |
|----------|---------------|------------|--------------|
| **Lado del servidor** | API | Limpieza de resultados de herramientas (`clear_tool_uses_20250919`)<br/>Limpieza de bloques de pensamiento (`clear_thinking_20251015`) | Se aplica antes de que el mensaje llegue a Claude. Limpia contenido específico del historial de conversación. Cada estrategia se puede configurar de forma independiente. |
| **Lado del cliente** | SDK | Compactación | Disponible en [SDKs de Python y TypeScript](/docs/es/api/client-sdks) cuando se usa [`tool_runner`](/docs/es/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta). Genera un resumen y reemplaza el historial completo de conversación. Ver [Compactación](#client-side-compaction-sdk) abajo. |

## Estrategias del lado del servidor

<Note>
La edición de contexto está actualmente en beta con soporte para limpieza de resultados de herramientas y limpieza de bloques de pensamiento. Para habilitarla, usa el encabezado beta `context-management-2025-06-27` en tus solicitudes de API.

Por favor, comunícate a través de nuestro [formulario de comentarios](https://forms.gle/YXC2EKGMhjN1c4L88) para compartir tu retroalimentación sobre esta función.
</Note>

### Limpieza de resultados de herramientas

La estrategia `clear_tool_uses_20250919` limpia los resultados de herramientas cuando el contexto de la conversación crece más allá de tu umbral configurado. Cuando se activa, la API limpia automáticamente los resultados de herramientas más antiguos en orden cronológico, reemplazándolos con texto de marcador de posición para que Claude sepa que el resultado de la herramienta fue eliminado. Por defecto, solo se limpian los resultados de herramientas. Opcionalmente, puedes limpiar tanto los resultados de herramientas como las llamadas de herramientas (los parámetros de uso de herramientas) estableciendo `clear_tool_inputs` en true.

### Limpieza de bloques de pensamiento

La estrategia `clear_thinking_20251015` gestiona bloques `thinking` en conversaciones cuando el pensamiento extendido está habilitado. Esta estrategia limpia automáticamente los bloques de pensamiento más antiguos de turnos anteriores.

<Tip>
**Comportamiento predeterminado**: Cuando el pensamiento extendido está habilitado sin configurar la estrategia `clear_thinking_20251015`, la API mantiene automáticamente solo los bloques de pensamiento del último turno del asistente (equivalente a `keep: {type: "thinking_turns", value: 1}`).

Para maximizar los aciertos de caché, preserva todos los bloques de pensamiento estableciendo `keep: "all"`.
</Tip>

<Note>
Un turno de conversación del asistente puede incluir múltiples bloques de contenido (por ejemplo, cuando se usan herramientas) y múltiples bloques de pensamiento (por ejemplo, con [pensamiento intercalado](/docs/es/build-with-claude/extended-thinking#interleaved-thinking)).
</Note>

<Tip>
**La edición de contexto ocurre del lado del servidor**

La edición de contexto se aplica **del lado del servidor** antes de que el mensaje llegue a Claude. Tu aplicación cliente mantiene el historial completo y sin modificar de la conversación—no necesitas sincronizar el estado de tu cliente con la versión editada. Continúa gestionando tu historial completo de conversación localmente como lo harías normalmente.
</Tip>

<Tip>
**Edición de contexto y almacenamiento en caché de mensajes**

La interacción de la edición de contexto con [almacenamiento en caché de mensajes](/docs/es/build-with-claude/prompt-caching) varía según la estrategia:

- **Limpieza de resultados de herramientas**: Invalida los prefijos de mensaje en caché cuando se limpia contenido. Para tener esto en cuenta, recomendamos limpiar suficientes tokens para que la invalidación del caché valga la pena. Usa el parámetro `clear_at_least` para asegurar que se limpie un número mínimo de tokens cada vez. Incurrirás en costos de escritura de caché cada vez que se limpie contenido, pero las solicitudes posteriores pueden reutilizar el prefijo recién almacenado en caché.

- **Limpieza de bloques de pensamiento**: Cuando los bloques de pensamiento se **mantienen** en contexto (no se limpian), el caché de mensaje se preserva, habilitando aciertos de caché y reduciendo costos de tokens de entrada. Cuando los bloques de pensamiento se **limpian**, el caché se invalida en el punto donde ocurre la limpieza. Configura el parámetro `keep` según si deseas priorizar el rendimiento del caché o la disponibilidad de la ventana de contexto.
</Tip>

## Modelos soportados

La edición de contexto está disponible en:

- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)
- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)

## Uso de limpieza de resultados de herramientas

La forma más simple de habilitar la limpieza de resultados de herramientas es especificar solo el tipo de estrategia, ya que todas las otras [opciones de configuración](#configuration-options-for-tool-result-clearing) usarán sus valores predeterminados:

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": "Search for recent developments in AI"
            }
        ],
        "tools": [
            {
                "type": "web_search_20250305",
                "name": "web_search"
            }
        ],
        "context_management": {
            "edits": [
                {"type": "clear_tool_uses_20250919"}
            ]
        }
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Search for recent developments in AI"
        }
    ],
    tools=[
        {
            "type": "web_search_20250305",
            "name": "web_search"
        }
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {"type": "clear_tool_uses_20250919"}
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [
    {
      role: "user",
      content: "Search for recent developments in AI"
    }
  ],
  tools: [
    {
      type: "web_search_20250305",
      name: "web_search"
    }
  ],
  context_management: {
    edits: [
      { type: "clear_tool_uses_20250919" }
    ]
  },
  betas: ["context-management-2025-06-27"]
});
```

</CodeGroup>

### Configuración avanzada

Puedes personalizar el comportamiento de limpieza de resultados de herramientas con parámetros adicionales:

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": "Create a simple command line calculator app using Python"
            }
        ],
        "tools": [
            {
                "type": "text_editor_20250728",
                "name": "str_replace_based_edit_tool",
                "max_characters": 10000
            },
            {
                "type": "web_search_20250305",
                "name": "web_search",
                "max_uses": 3
            }
        ],
        "context_management": {
            "edits": [
                {
                    "type": "clear_tool_uses_20250919",
                    "trigger": {
                        "type": "input_tokens",
                        "value": 30000
                    },
                    "keep": {
                        "type": "tool_uses",
                        "value": 3
                    },
                    "clear_at_least": {
                        "type": "input_tokens",
                        "value": 5000
                    },
                    "exclude_tools": ["web_search"]
                }
            ]
        }
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Create a simple command line calculator app using Python"
        }
    ],
    tools=[
        {
            "type": "text_editor_20250728",
            "name": "str_replace_based_edit_tool",
            "max_characters": 10000
        },
        {
            "type": "web_search_20250305",
            "name": "web_search",
            "max_uses": 3
        }
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_tool_uses_20250919",
                # Trigger clearing when threshold is exceeded
                "trigger": {
                    "type": "input_tokens",
                    "value": 30000
                },
                # Number of tool uses to keep after clearing
                "keep": {
                    "type": "tool_uses",
                    "value": 3
                },
                # Optional: Clear at least this many tokens
                "clear_at_least": {
                    "type": "input_tokens",
                    "value": 5000
                },
                # Exclude these tools from being cleared
                "exclude_tools": ["web_search"]
            }
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [
    {
      role: "user",
      content: "Create a simple command line calculator app using Python"
    }
  ],
  tools: [
    {
      type: "text_editor_20250728",
      name: "str_replace_based_edit_tool",
      max_characters: 10000
    },
    {
      type: "web_search_20250305",
      name: "web_search",
      max_uses: 3
    }
  ],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_tool_uses_20250919",
        // Trigger clearing when threshold is exceeded
        trigger: {
          type: "input_tokens",
          value: 30000
        },
        // Number of tool uses to keep after clearing
        keep: {
          type: "tool_uses",
          value: 3
        },
        // Optional: Clear at least this many tokens
        clear_at_least: {
          type: "input_tokens",
          value: 5000
        },
        // Exclude these tools from being cleared
        exclude_tools: ["web_search"]
      }
    ]
  }
});
```

</CodeGroup>

## Uso de limpieza de bloques de pensamiento

Habilita la limpieza de bloques de pensamiento para gestionar el contexto y el almacenamiento en caché de mensajes de manera efectiva cuando el pensamiento extendido está habilitado:

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5-20250929",
        "max_tokens": 1024,
        "messages": [...],
        "thinking": {
            "type": "enabled",
            "budget_tokens": 10000
        },
        "context_management": {
            "edits": [
                {
                    "type": "clear_thinking_20251015",
                    "keep": {
                        "type": "thinking_turns",
                        "value": 2
                    }
                }
            ]
        }
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[...],
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_thinking_20251015",
                "keep": {
                    "type": "thinking_turns",
                    "value": 2
                }
            }
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  messages: [...],
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_thinking_20251015",
        keep: {
          type: "thinking_turns",
          value: 2
        }
      }
    ]
  }
});
```

</CodeGroup>

### Opciones de configuración para limpieza de bloques de pensamiento

La estrategia `clear_thinking_20251015` soporta la siguiente configuración:

| Opción de configuración | Predeterminado | Descripción |
|---------------------|---------|-------------|
| `keep` | `{type: "thinking_turns", value: 1}` | Define cuántos turnos recientes del asistente con bloques de pensamiento se deben preservar. Usa `{type: "thinking_turns", value: N}` donde N debe ser > 0 para mantener los últimos N turnos, o `"all"` para mantener todos los bloques de pensamiento. |

**Configuraciones de ejemplo:**

```json
// Mantener bloques de pensamiento de los últimos 3 turnos del asistente
{
  "type": "clear_thinking_20251015",
  "keep": {
    "type": "thinking_turns",
    "value": 3
  }
}

// Mantener todos los bloques de pensamiento (maximiza aciertos de caché)
{
  "type": "clear_thinking_20251015",
  "keep": "all"
}
```

### Opciones de configuración para limpieza de bloques de pensamiento

La estrategia `clear_thinking_20251015` soporta la siguiente configuración:

| Opción de configuración | Predeterminado | Descripción |
|---------------------|---------|-------------|
| `keep` | `{type: "thinking_turns", value: 1}` | Define cuántos turnos recientes del asistente con bloques de pensamiento se deben preservar. Usa `{type: "thinking_turns", value: N}` donde N debe ser > 0 para mantener los últimos N turnos, o `"all"` para mantener todos los bloques de pensamiento. |

**Configuraciones de ejemplo:**

```json
// Mantener bloques de pensamiento de los últimos 3 turnos del asistente
{
  "type": "clear_thinking_20251015",
  "keep": {
    "type": "thinking_turns",
    "value": 3
  }
}

// Mantener todos los bloques de pensamiento (maximiza aciertos de caché)
{
  "type": "clear_thinking_20251015",
  "keep": "all"
}
```

### Combinación de estrategias

Puedes usar tanto la limpieza de bloques de pensamiento como la limpieza de resultados de herramientas juntas:

<Note>
Cuando uses múltiples estrategias, la estrategia `clear_thinking_20251015` debe estar listada primero en el array `edits`.
</Note>

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[...],
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    tools=[...],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_thinking_20251015",
                "keep": {
                    "type": "thinking_turns",
                    "value": 2
                }
            },
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {
                    "type": "input_tokens",
                    "value": 50000
                },
                "keep": {
                    "type": "tool_uses",
                    "value": 5
                }
            }
        ]
    }
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  messages: [...],
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  tools: [...],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_thinking_20251015",
        keep: {
          type: "thinking_turns",
          value: 2
        }
      },
      {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: 50000
        },
        keep: {
          type: "tool_uses",
          value: 5
        }
      }
    ]
  }
});
```

</CodeGroup>

### Opciones de configuración para limpieza de bloques de pensamiento

La estrategia `clear_thinking_20251015` soporta la siguiente configuración:

| Opción de configuración | Predeterminado | Descripción |
|---------------------|---------|-------------|
| `keep` | `{type: "thinking_turns", value: 1}` | Define cuántos turnos recientes del asistente con bloques de pensamiento se deben preservar. Usa `{type: "thinking_turns", value: N}` donde N debe ser > 0 para mantener los últimos N turnos, o `"all"` para mantener todos los bloques de pensamiento. |

**Configuraciones de ejemplo:**

```json
// Mantener bloques de pensamiento de los últimos 3 turnos del asistente
{
  "type": "clear_thinking_20251015",
  "keep": {
    "type": "thinking_turns",
    "value": 3
  }
}

// Mantener todos los bloques de pensamiento (maximiza aciertos de caché)
{
  "type": "clear_thinking_20251015",
  "keep": "all"
}
```

### Combinación de estrategias

Puedes usar tanto la limpieza de bloques de pensamiento como la limpieza de resultados de herramientas juntas:

<Note>
Cuando uses múltiples estrategias, la estrategia `clear_thinking_20251015` debe estar listada primero en el array `edits`.
</Note>

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[...],
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    tools=[...],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_thinking_20251015",
                "keep": {
                    "type": "thinking_turns",
                    "value": 2
                }
            },
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {
                    "type": "input_tokens",
                    "value": 50000
                },
                "keep": {
                    "type": "tool_uses",
                    "value": 5
                }
            }
        ]
    }
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  messages: [...],
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  tools: [...],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_thinking_20251015",
        keep: {
          type: "thinking_turns",
          value: 2
        }
      },
      {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: 50000
        },
        keep: {
          type: "tool_uses",
          value: 5
        }
      }
    ]
  }
});
```

</CodeGroup>

## Opciones de configuración para limpieza de resultados de herramientas

| Opción de configuración | Predeterminado | Descripción |
|---------------------|---------|-------------|
| `trigger` | 100,000 tokens de entrada | Define cuándo se activa la estrategia de edición de contexto. Una vez que el mensaje excede este umbral, comenzará la limpieza. Puedes especificar este valor en `input_tokens` o `tool_uses`. |
| `keep` | 3 usos de herramientas | Define cuántos pares recientes de uso/resultado de herramientas se deben mantener después de que ocurra la limpieza. La API elimina primero las interacciones de herramientas más antiguas, preservando las más recientes. |
| `clear_at_least` | Ninguno | Asegura que se limpie un número mínimo de tokens cada vez que se activa la estrategia. Si la API no puede limpiar al menos la cantidad especificada, la estrategia no se aplicará. Esto ayuda a determinar si la limpieza de contexto vale la pena romper tu caché de mensaje. |
| `exclude_tools` | Ninguno | Lista de nombres de herramientas cuyos usos y resultados nunca deben ser limpiados. Útil para preservar contexto importante. |
| `clear_tool_inputs` | `false` | Controla si los parámetros de llamada de herramientas se limpian junto con los resultados de herramientas. Por defecto, solo se limpian los resultados de herramientas mientras se mantienen visibles las llamadas de herramientas originales de Claude. |

### Opciones de configuración para limpieza de bloques de pensamiento

La estrategia `clear_thinking_20251015` soporta la siguiente configuración:

| Opción de configuración | Predeterminado | Descripción |
|---------------------|---------|-------------|
| `keep` | `{type: "thinking_turns", value: 1}` | Define cuántos turnos recientes del asistente con bloques de pensamiento se deben preservar. Usa `{type: "thinking_turns", value: N}` donde N debe ser > 0 para mantener los últimos N turnos, o `"all"` para mantener todos los bloques de pensamiento. |

**Configuraciones de ejemplo:**

```json
// Mantener bloques de pensamiento de los últimos 3 turnos del asistente
{
  "type": "clear_thinking_20251015",
  "keep": {
    "type": "thinking_turns",
    "value": 3
  }
}

// Mantener todos los bloques de pensamiento (maximiza aciertos de caché)
{
  "type": "clear_thinking_20251015",
  "keep": "all"
}
```

### Combinación de estrategias

Puedes usar tanto la limpieza de bloques de pensamiento como la limpieza de resultados de herramientas juntas:

<Note>
Cuando uses múltiples estrategias, la estrategia `clear_thinking_20251015` debe estar listada primero en el array `edits`.
</Note>

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[...],
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    tools=[...],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_thinking_20251015",
                "keep": {
                    "type": "thinking_turns",
                    "value": 2
                }
            },
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {
                    "type": "input_tokens",
                    "value": 50000
                },
                "keep": {
                    "type": "tool_uses",
                    "value": 5
                }
            }
        ]
    }
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  messages: [...],
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  tools: [...],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_thinking_20251015",
        keep: {
          type: "thinking_turns",
          value: 2
        }
      },
      {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: 50000
        },
        keep: {
          type: "tool_uses",
          value: 5
        }
      }
    ]
  }
});
```

</CodeGroup>

## Opciones de configuración para limpieza de resultados de herramientas

| Opción de configuración | Predeterminado | Descripción |
|---------------------|---------|-------------|
| `trigger` | 100,000 tokens de entrada | Define cuándo se activa la estrategia de edición de contexto. Una vez que el mensaje excede este umbral, comenzará la limpieza. Puedes especificar este valor en `input_tokens` o `tool_uses`. |
| `keep` | 3 usos de herramientas | Define cuántos pares recientes de uso/resultado de herramientas se deben mantener después de que ocurra la limpieza. La API elimina primero las interacciones de herramientas más antiguas, preservando las más recientes. |
| `clear_at_least` | Ninguno | Asegura que se limpie un número mínimo de tokens cada vez que se activa la estrategia. Si la API no puede limpiar al menos la cantidad especificada, la estrategia no se aplicará. Esto ayuda a determinar si la limpieza de contexto vale la pena romper tu caché de mensaje. |
| `exclude_tools` | Ninguno | Lista de nombres de herramientas cuyos usos y resultados nunca deben ser limpiados. Útil para preservar contexto importante. |
| `clear_tool_inputs` | `false` | Controla si los parámetros de llamada de herramientas se limpian junto con los resultados de herramientas. Por defecto, solo se limpian los resultados de herramientas mientras se mantienen visibles las llamadas de herramientas originales de Claude. |

## Respuesta de edición de contexto

Puedes ver qué ediciones de contexto se aplicaron a tu solicitud usando el campo de respuesta `context_management`, junto con estadísticas útiles sobre el contenido y los tokens de entrada limpiados.

```json Response
{
    "id": "msg_013Zva2CMHLNnXjNJJKqJ2EF",
    "type": "message",
    "role": "assistant",
    "content": [...],
    "usage": {...},
    "context_management": {
        "applied_edits": [
            // When using `clear_thinking_20251015`
            {
                "type": "clear_thinking_20251015",
                "cleared_thinking_turns": 3,
                "cleared_input_tokens": 15000
            },
            // When using `clear_tool_uses_20250919`
            {
                "type": "clear_tool_uses_20250919",
                "cleared_tool_uses": 8,
                "cleared_input_tokens": 50000
            }
        ]
    }
}
```

Para respuestas de transmisión, las ediciones de contexto se incluirán en el evento final `message_delta`:

```json Streaming Response
{
    "type": "message_delta",
    "delta": {
        "stop_reason": "end_turn",
        "stop_sequence": null
    },
    "usage": {
        "output_tokens": 1024
    },
    "context_management": {
        "applied_edits": [...]
    }
}
```

### Opciones de configuración para limpiar bloques de pensamiento

La estrategia `clear_thinking_20251015` admite la siguiente configuración:

| Opción de configuración | Predeterminado | Descripción |
|---------------------|---------|-------------|
| `keep` | `{type: "thinking_turns", value: 1}` | Define cuántos turnos recientes del asistente con bloques de pensamiento se deben preservar. Use `{type: "thinking_turns", value: N}` donde N debe ser > 0 para mantener los últimos N turnos, o `"all"` para mantener todos los bloques de pensamiento. |

**Configuraciones de ejemplo:**

```json
// Mantener bloques de pensamiento de los últimos 3 turnos del asistente
{
  "type": "clear_thinking_20251015",
  "keep": {
    "type": "thinking_turns",
    "value": 3
  }
}

// Mantener todos los bloques de pensamiento (maximiza los aciertos de caché)
{
  "type": "clear_thinking_20251015",
  "keep": "all"
}
```

### Combinación de estrategias

Puede usar tanto la limpieza de bloques de pensamiento como la limpieza de resultados de herramientas juntas:

<Note>
Cuando use múltiples estrategias, la estrategia `clear_thinking_20251015` debe aparecer primero en el array `edits`.
</Note>

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[...],
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    tools=[...],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_thinking_20251015",
                "keep": {
                    "type": "thinking_turns",
                    "value": 2
                }
            },
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {
                    "type": "input_tokens",
                    "value": 50000
                },
                "keep": {
                    "type": "tool_uses",
                    "value": 5
                }
            }
        ]
    }
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  messages: [...],
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  tools: [...],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_thinking_20251015",
        keep: {
          type: "thinking_turns",
          value: 2
        }
      },
      {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: 50000
        },
        keep: {
          type: "tool_uses",
          value: 5
        }
      }
    ]
  }
});
```

</CodeGroup>

## Opciones de configuración para limpieza de resultados de herramientas

| Opción de configuración | Predeterminado | Descripción |
|---------------------|---------|-------------|
| `trigger` | 100,000 tokens de entrada | Define cuándo se activa la estrategia de edición de contexto. Una vez que el prompt excede este umbral, comenzará la limpieza. Puede especificar este valor en `input_tokens` o `tool_uses`. |
| `keep` | 3 usos de herramientas | Define cuántos pares recientes de uso/resultado de herramientas se deben mantener después de que ocurra la limpieza. La API elimina primero las interacciones de herramientas más antiguas, preservando las más recientes. |
| `clear_at_least` | Ninguno | Asegura que se limpie un número mínimo de tokens cada vez que se activa la estrategia. Si la API no puede limpiar al menos la cantidad especificada, la estrategia no se aplicará. Esto ayuda a determinar si vale la pena limpiar el contexto para romper su caché de prompt. |
| `exclude_tools` | Ninguno | Lista de nombres de herramientas cuyos usos y resultados nunca deben ser limpiados. Útil para preservar contexto importante. |
| `clear_tool_inputs` | `false` | Controla si los parámetros de llamada de herramientas se limpian junto con los resultados de herramientas. Por defecto, solo se limpian los resultados de herramientas mientras se mantienen visibles las llamadas originales de Claude. |

## Respuesta de edición de contexto

Puede ver qué ediciones de contexto se aplicaron a su solicitud usando el campo de respuesta `context_management`, junto con estadísticas útiles sobre el contenido y los tokens de entrada limpiados.

```json Response
{
    "id": "msg_013Zva2CMHLNnXjNJJKqJ2EF",
    "type": "message",
    "role": "assistant",
    "content": [...],
    "usage": {...},
    "context_management": {
        "applied_edits": [
            // Cuando se usa `clear_thinking_20251015`
            {
                "type": "clear_thinking_20251015",
                "cleared_thinking_turns": 3,
                "cleared_input_tokens": 15000
            },
            // Cuando se usa `clear_tool_uses_20250919`
            {
                "type": "clear_tool_uses_20250919",
                "cleared_tool_uses": 8,
                "cleared_input_tokens": 50000
            }
        ]
    }
}
```

Para respuestas de transmisión, las ediciones de contexto se incluirán en el evento final `message_delta`:

```json Streaming Response
{
    "type": "message_delta",
    "delta": {
        "stop_reason": "end_turn",
        "stop_sequence": null
    },
    "usage": {
        "output_tokens": 1024
    },
    "context_management": {
        "applied_edits": [...]
    }
}
```

## Conteo de tokens

El endpoint de [conteo de tokens](/docs/es/build-with-claude/token-counting) admite gestión de contexto, permitiéndole obtener una vista previa de cuántos tokens usará su prompt después de que se aplique la edición de contexto.

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages/count_tokens \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "messages": [
            {
                "role": "user",
                "content": "Continue our conversation..."
            }
        ],
        "tools": [...],
        "context_management": {
            "edits": [
                {
                    "type": "clear_tool_uses_20250919",
                    "trigger": {
                        "type": "input_tokens",
                        "value": 30000
                    },
                    "keep": {
                        "type": "tool_uses",
                        "value": 5
                    }
                }
            ]
        }
    }'
```

```python Python
response = client.beta.messages.count_tokens(
    model="claude-sonnet-4-5",
    messages=[
        {
            "role": "user",
            "content": "Continue our conversation..."
        }
    ],
    tools=[...],  # Your tool definitions
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {
                    "type": "input_tokens",
                    "value": 30000
                },
                "keep": {
                    "type": "tool_uses",
                    "value": 5
                }
            }
        ]
    }
)

print(f"Original tokens: {response.context_management['original_input_tokens']}")
print(f"After clearing: {response.input_tokens}")
print(f"Savings: {response.context_management['original_input_tokens'] - response.input_tokens} tokens")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.countTokens({
  model: "claude-sonnet-4-5",
  messages: [
    {
      role: "user",
      content: "Continue our conversation..."
    }
  ],
  tools: [...],  // Your tool definitions
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: 30000
        },
        keep: {
          type: "tool_uses",
          value: 5
        }
      }
    ]
  }
});

console.log(`Original tokens: ${response.context_management?.original_input_tokens}`);
console.log(`After clearing: ${response.input_tokens}`);
console.log(`Savings: ${(response.context_management?.original_input_tokens || 0) - response.input_tokens} tokens`);
```
</CodeGroup>

```json Response
{
    "input_tokens": 25000,
    "context_management": {
        "original_input_tokens": 70000
    }
}
```

La respuesta muestra tanto el conteo de tokens final después de que se aplica la gestión de contexto (`input_tokens`) como el conteo de tokens original antes de que ocurra cualquier limpieza (`original_input_tokens`).

## Uso con la herramienta de memoria

La edición de contexto se puede combinar con la [herramienta de memoria](/docs/es/agents-and-tools/tool-use/memory-tool). Cuando el contexto de su conversación se acerca al umbral de limpieza configurado, Claude recibe una advertencia automática para preservar información importante. Esto permite que Claude guarde resultados de herramientas o contexto en sus archivos de memoria antes de que se limpien del historial de conversación.

Esta combinación le permite:

- **Preservar contexto importante**: Claude puede escribir información esencial de los resultados de herramientas en archivos de memoria antes de que esos resultados se limpien
- **Mantener flujos de trabajo de larga duración**: Habilitar flujos de trabajo de agentes que de otro modo excederían los límites de contexto al descargar información al almacenamiento persistente
- **Acceder a información bajo demanda**: Claude puede buscar información previamente limpiada de archivos de memoria cuando sea necesario, en lugar de mantener todo en la ventana de contexto activa

Por ejemplo, en un flujo de trabajo de edición de archivos donde Claude realiza muchas operaciones, Claude puede resumir cambios completados en archivos de memoria a medida que crece el contexto. Cuando se limpian los resultados de herramientas, Claude retiene acceso a esa información a través de su sistema de memoria y puede continuar trabajando de manera efectiva.

Para usar ambas características juntas, habilítelas en su solicitud de API:

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[...],
    tools=[
        {
            "type": "memory_20250818",
            "name": "memory"
        },
        # Your other tools
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {"type": "clear_tool_uses_20250919"}
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [...],
  tools: [
    {
      type: "memory_20250818",
      name: "memory"
    },
    // Your other tools
  ],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      { type: "clear_tool_uses_20250919" }
    ]
  }
});
```

</CodeGroup>

## Compactación del lado del cliente (SDK)

<Note>
La compactación está disponible en los [SDK de Python y TypeScript](/docs/es/api/client-sdks) cuando se usa el método [`tool_runner`](/docs/es/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta).
</Note>

La compactación es una característica del SDK que gestiona automáticamente el contexto de la conversación generando resúmenes cuando el uso de tokens crece demasiado. A diferencia de las estrategias de edición de contexto del lado del servidor que limpian contenido, la compactación instruye a Claude para resumir el historial de conversación, luego reemplaza el historial completo con ese resumen. Esto permite que Claude continúe trabajando en tareas de larga duración que de otro modo excederían la [ventana de contexto](/docs/es/build-with-claude/context-windows).

### Cómo funciona la compactación

Cuando la compactación está habilitada, el SDK monitorea el uso de tokens después de cada respuesta del modelo:

1. **Verificación de umbral**: El SDK calcula tokens totales como `input_tokens + cache_creation_input_tokens + cache_read_input_tokens + output_tokens`
2. **Generación de resumen**: Cuando se excede el umbral, se inyecta una solicitud de resumen como un turno de usuario, y Claude genera un resumen estructurado envuelto en etiquetas `<summary></summary>`
3. **Reemplazo de contexto**: El SDK extrae el resumen y reemplaza todo el historial de mensajes con él
4. **Continuación**: La conversación se reanuda desde el resumen, con Claude continuando desde donde se quedó

### Uso de compactación

Agregue `compaction_control` a su llamada `tool_runner`:

<CodeGroup>

```python Python
import anthropic

client = anthropic.Anthropic()

runner = client.beta.messages.tool_runner(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    tools=[...],
    messages=[
        {
            "role": "user",
            "content": "Analyze all the files in this directory and write a summary report."
        }
    ],
    compaction_control={
        "enabled": True,
        "context_token_threshold": 100000
    }
)

for message in runner:
    print(f"Tokens used: {message.usage.input_tokens}")

final = runner.until_done()
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const runner = client.beta.messages.toolRunner({
    model: 'claude-sonnet-4-5',
    max_tokens: 4096,
    tools: [...],
    messages: [
        {
            role: 'user',
            content: 'Analyze all the files in this directory and write a summary report.'
        }
    ],
    compactionControl: {
        enabled: true,
        contextTokenThreshold: 100000
    }
});

for await (const message of runner) {
    console.log('Tokens used:', message.usage.input_tokens);
}

const finalMessage = await runner.runUntilDone();
```

</CodeGroup>

#### Qué sucede durante la compactación

A medida que crece la conversación, el historial de mensajes se acumula:

**Antes de la compactación (aproximándose a 100k tokens):**
```json
[
  { "role": "user", "content": "Analyze all files and write a report..." },
  { "role": "assistant", "content": "I'll help. Let me start by reading..." },
  { "role": "user", "content": [{ "type": "tool_result", "tool_use_id": "...", "content": "..." }] },
  { "role": "assistant", "content": "Based on file1.txt, I see..." },
  { "role": "user", "content": [{ "type": "tool_result", "tool_use_id": "...", "content": "..." }] },
  { "role": "assistant", "content": "After analyzing file2.txt..." },
  // ... 50 more exchanges like this ...
]
```

Cuando los tokens exceden el umbral, el SDK inyecta una solicitud de resumen y Claude genera un resumen. Todo el historial se reemplaza entonces:

**Después de la compactación (de vuelta a ~2-3k tokens):**
```json
[
  {
    "role": "assistant",
    "content": "# Task Overview\nThe user requested analysis of directory files to produce a summary report...\n\n# Current State\nAnalyzed 52 files across 3 subdirectories. Key findings documented in report.md...\n\n# Important Discoveries\n- Configuration files use YAML format\n- Found 3 deprecated dependencies\n- Test coverage at 67%\n\n# Next Steps\n1. Analyze remaining files in /src/legacy\n2. Complete final report sections...\n\n# Context to Preserve\nUser prefers markdown format with executive summary first..."
  }
]
```

Claude continúa trabajando desde este resumen como si fuera el historial de conversación original.

### Opciones de configuración

| Parámetro | Tipo | Requerido | Predeterminado | Descripción |
|-----------|------|----------|---------|-------------|
| `enabled` | boolean | Sí | - | Si se debe habilitar la compactación automática |
| `context_token_threshold` | number | No | 100,000 | Conteo de tokens en el cual se activa la compactación |
| `model` | string | No | Mismo que el modelo principal | Modelo a usar para generar resúmenes |
| `summary_prompt` | string | No | Ver abajo | Prompt personalizado para generación de resumen |

#### Elegir un umbral de tokens

El umbral determina cuándo ocurre la compactación. Un umbral más bajo significa compactaciones más frecuentes con ventanas de contexto más pequeñas. Un umbral más alto permite más contexto pero arriesga alcanzar límites.

<CodeGroup>

```python Python
# More frequent compaction for memory-constrained scenarios
compaction_control={
    "enabled": True,
    "context_token_threshold": 50000
}

# Less frequent compaction when you need more context
compaction_control={
    "enabled": True,
    "context_token_threshold": 150000
}
```

```typescript TypeScript
// More frequent compaction for memory-constrained scenarios
compactionControl: {
    enabled: true,
    contextTokenThreshold: 50000
}

// Less frequent compaction when you need more context
compactionControl: {
    enabled: true,
    contextTokenThreshold: 150000
}
```

</CodeGroup>

#### Usar un modelo diferente para resúmenes

Puede usar un modelo más rápido o más barato para generar resúmenes:

<CodeGroup>

```python Python
compaction_control={
    "enabled": True,
    "context_token_threshold": 100000,
    "model": "claude-haiku-4-5"
}
```

```typescript TypeScript
compactionControl: {
    enabled: true,
    contextTokenThreshold: 100000,
    model: 'claude-haiku-4-5'
}
```

</CodeGroup>

#### Prompts de resumen personalizados

Puede proporcionar un prompt personalizado para necesidades específicas del dominio. Su prompt debe instruir a Claude para envolver su resumen en etiquetas `<summary></summary>`.

<CodeGroup>

```python Python
compaction_control={
    "enabled": True,
    "context_token_threshold": 100000,
    "summary_prompt": """Summarize the research conducted so far, including:
- Sources consulted and key findings
- Questions answered and remaining unknowns
- Recommended next steps

Wrap your summary in <summary></summary> tags."""
}
```

```typescript TypeScript
compactionControl: {
    enabled: true,
    contextTokenThreshold: 100000,
    summaryPrompt: `Summarize the research conducted so far, including:
- Sources consulted and key findings
- Questions answered and remaining unknowns
- Recommended next steps

Wrap your summary in <summary></summary> tags.`
}
```

</CodeGroup>

## Uso con la herramienta de memoria

La edición de contexto se puede combinar con la [herramienta de memoria](/docs/es/agents-and-tools/tool-use/memory-tool). Cuando el contexto de tu conversación se acerca al umbral de limpieza configurado, Claude recibe una advertencia automática para preservar información importante. Esto permite que Claude guarde resultados de herramientas o contexto en sus archivos de memoria antes de que se borren del historial de conversación.

Esta combinación te permite:

- **Preservar contexto importante**: Claude puede escribir información esencial de los resultados de herramientas en archivos de memoria antes de que esos resultados se borren
- **Mantener flujos de trabajo de larga duración**: Habilitar flujos de trabajo agénticos que de otro modo excederían los límites de contexto descargando información en almacenamiento persistente
- **Acceder a información bajo demanda**: Claude puede buscar información previamente borrada de los archivos de memoria cuando sea necesario, en lugar de mantener todo en la ventana de contexto activa

Por ejemplo, en un flujo de trabajo de edición de archivos donde Claude realiza muchas operaciones, Claude puede resumir cambios completados en archivos de memoria a medida que crece el contexto. Cuando se borran los resultados de herramientas, Claude retiene acceso a esa información a través de su sistema de memoria y puede continuar trabajando de manera efectiva.

Para usar ambas características juntas, habilítalas en tu solicitud de API:

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[...],
    tools=[
        {
            "type": "memory_20250818",
            "name": "memory"
        },
        # Your other tools
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {"type": "clear_tool_uses_20250919"}
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [...],
  tools: [
    {
      type: "memory_20250818",
      name: "memory"
    },
    // Your other tools
  ],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      { type: "clear_tool_uses_20250919" }
    ]
  }
});
```

</CodeGroup>

## Compactación del lado del cliente (SDK)

<Note>
La compactación está disponible en los [SDK de Python y TypeScript](/docs/es/api/client-sdks) cuando se usa el [método `tool_runner`](/docs/es/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta).
</Note>

La compactación es una característica del SDK que gestiona automáticamente el contexto de la conversación generando resúmenes cuando el uso de tokens crece demasiado. A diferencia de las estrategias de edición de contexto del lado del servidor que borran contenido, la compactación instruye a Claude para que resuma el historial de conversación, luego reemplaza el historial completo con ese resumen. Esto permite que Claude continúe trabajando en tareas de larga duración que de otro modo excederían la [ventana de contexto](/docs/es/build-with-claude/context-windows).

### Cómo funciona la compactación

Cuando la compactación está habilitada, el SDK monitorea el uso de tokens después de cada respuesta del modelo:

1. **Verificación de umbral**: El SDK calcula tokens totales como `input_tokens + cache_creation_input_tokens + cache_read_input_tokens + output_tokens`
2. **Generación de resumen**: Cuando se excede el umbral, se inyecta un mensaje de solicitud de resumen como un turno del usuario, y Claude genera un resumen estructurado envuelto en etiquetas `<summary></summary>`
3. **Reemplazo de contexto**: El SDK extrae el resumen y reemplaza todo el historial de mensajes con él
4. **Continuación**: La conversación se reanuda desde el resumen, con Claude continuando desde donde se quedó

### Uso de compactación

Agrega `compaction_control` a tu llamada `tool_runner`:

<CodeGroup>

```python Python
import anthropic

client = anthropic.Anthropic()

runner = client.beta.messages.tool_runner(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    tools=[...],
    messages=[
        {
            "role": "user",
            "content": "Analyze all the files in this directory and write a summary report."
        }
    ],
    compaction_control={
        "enabled": True,
        "context_token_threshold": 100000
    }
)

for message in runner:
    print(f"Tokens used: {message.usage.input_tokens}")

final = runner.until_done()
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const runner = client.beta.messages.toolRunner({
    model: 'claude-sonnet-4-5',
    max_tokens: 4096,
    tools: [...],
    messages: [
        {
            role: 'user',
            content: 'Analyze all the files in this directory and write a summary report.'
        }
    ],
    compactionControl: {
        enabled: true,
        contextTokenThreshold: 100000
    }
});

for await (const message of runner) {
    console.log('Tokens used:', message.usage.input_tokens);
}

const finalMessage = await runner.runUntilDone();
```

</CodeGroup>

#### Qué sucede durante la compactación

A medida que crece la conversación, el historial de mensajes se acumula:

**Antes de la compactación (acercándose a 100k tokens):**
```json
[
  { "role": "user", "content": "Analyze all files and write a report..." },
  { "role": "assistant", "content": "I'll help. Let me start by reading..." },
  { "role": "user", "content": [{ "type": "tool_result", "tool_use_id": "...", "content": "..." }] },
  { "role": "assistant", "content": "Based on file1.txt, I see..." },
  { "role": "user", "content": [{ "type": "tool_result", "tool_use_id": "...", "content": "..." }] },
  { "role": "assistant", "content": "After analyzing file2.txt..." },
  // ... 50 more exchanges like this ...
]
```

Cuando los tokens exceden el umbral, el SDK inyecta una solicitud de resumen y Claude genera un resumen. Luego se reemplaza todo el historial:

**Después de la compactación (volviendo a ~2-3k tokens):**
```json
[
  {
    "role": "assistant",
    "content": "# Task Overview\nThe user requested analysis of directory files to produce a summary report...\n\n# Current State\nAnalyzed 52 files across 3 subdirectories. Key findings documented in report.md...\n\n# Important Discoveries\n- Configuration files use YAML format\n- Found 3 deprecated dependencies\n- Test coverage at 67%\n\n# Next Steps\n1. Analyze remaining files in /src/legacy\n2. Complete final report sections...\n\n# Context to Preserve\nUser prefers markdown format with executive summary first..."
  }
]
```

Claude continúa trabajando desde este resumen como si fuera el historial de conversación original.

### Opciones de configuración

| Parámetro | Tipo | Requerido | Predeterminado | Descripción |
|-----------|------|----------|---------|-------------|
| `enabled` | boolean | Sí | - | Si se habilita la compactación automática |
| `context_token_threshold` | number | No | 100,000 | Cantidad de tokens en la que se activa la compactación |
| `model` | string | No | Mismo que el modelo principal | Modelo a usar para generar resúmenes |
| `summary_prompt` | string | No | Ver abajo | Mensaje personalizado para la generación de resumen |

#### Elegir un umbral de tokens

El umbral determina cuándo ocurre la compactación. Un umbral más bajo significa compactaciones más frecuentes con ventanas de contexto más pequeñas. Un umbral más alto permite más contexto pero riesgo de alcanzar límites.

<CodeGroup>

```python Python
# More frequent compaction for memory-constrained scenarios
compaction_control={
    "enabled": True,
    "context_token_threshold": 50000
}

# Less frequent compaction when you need more context
compaction_control={
    "enabled": True,
    "context_token_threshold": 150000
}
```

```typescript TypeScript
// More frequent compaction for memory-constrained scenarios
compactionControl: {
    enabled: true,
    contextTokenThreshold: 50000
}

// Less frequent compaction when you need more context
compactionControl: {
    enabled: true,
    contextTokenThreshold: 150000
}
```

</CodeGroup>

#### Usar un modelo diferente para resúmenes

Puedes usar un modelo más rápido o más económico para generar resúmenes:

<CodeGroup>

```python Python
compaction_control={
    "enabled": True,
    "context_token_threshold": 100000,
    "model": "claude-haiku-4-5"
}
```

```typescript TypeScript
compactionControl: {
    enabled: true,
    contextTokenThreshold: 100000,
    model: 'claude-haiku-4-5'
}
```

</CodeGroup>

#### Mensajes de resumen personalizados

Puedes proporcionar un mensaje personalizado para necesidades específicas del dominio. Tu mensaje debe instruir a Claude para que envuelva su resumen en etiquetas `<summary></summary>`.

<CodeGroup>

```python Python
compaction_control={
    "enabled": True,
    "context_token_threshold": 100000,
    "summary_prompt": """Summarize the research conducted so far, including:
- Sources consulted and key findings
- Questions answered and remaining unknowns
- Recommended next steps

Wrap your summary in <summary></summary> tags."""
}
```

```typescript TypeScript
compactionControl: {
    enabled: true,
    contextTokenThreshold: 100000,
    summaryPrompt: `Summarize the research conducted so far, including:
- Sources consulted and key findings
- Questions answered and remaining unknowns
- Recommended next steps

Wrap your summary in <summary></summary> tags.`
}
```

</CodeGroup>

### Mensaje de resumen predeterminado

El mensaje de resumen integrado instruye a Claude para crear un resumen de continuación estructurado que incluya:

1. **Descripción general de la tarea**: La solicitud central del usuario, criterios de éxito y restricciones
2. **Estado actual**: Qué se ha completado, archivos modificados y artefactos producidos
3. **Descubrimientos importantes**: Restricciones técnicas, decisiones tomadas, errores resueltos y enfoques fallidos
4. **Próximos pasos**: Acciones específicas necesarias, bloqueadores y orden de prioridad
5. **Contexto a preservar**: Preferencias del usuario, detalles específicos del dominio y compromisos realizados

Esta estructura permite que Claude reanude el trabajo de manera eficiente sin perder contexto importante o repetir errores.

<section title="Ver mensaje predeterminado completo">

```
You have been working on the task described above but have not yet completed it. Write a continuation summary that will allow you (or another instance of yourself) to resume work efficiently in a future context window where the conversation history will be replaced with this summary. Your summary should be structured, concise, and actionable. Include:

1. Task Overview
The user's core request and success criteria
Any clarifications or constraints they specified

2. Current State
What has been completed so far
Files created, modified, or analyzed (with paths if relevant)
Key outputs or artifacts produced

3. Important Discoveries
Technical constraints or requirements uncovered
Decisions made and their rationale
Errors encountered and how they were resolved
What approaches were tried that didn't work (and why)

4. Next Steps
Specific actions needed to complete the task
Any blockers or open questions to resolve
Priority order if multiple steps remain

5. Context to Preserve
User preferences or style requirements
Domain-specific details that aren't obvious
Any promises made to the user

Be concise but complete—err on the side of including information that would prevent duplicate work or repeated mistakes. Write in a way that enables immediate resumption of the task.

Wrap your summary in <summary></summary> tags.
```

</section>

### Limitaciones

#### Herramientas del lado del servidor

<Warning>
La compactación requiere consideración especial cuando se usan herramientas del lado del servidor como [búsqueda web](/docs/es/agents-and-tools/tool-use/web-search-tool) o [búsqueda web](/docs/es/agents-and-tools/tool-use/web-fetch-tool).
</Warning>

Cuando se usan herramientas del lado del servidor, el SDK puede calcular incorrectamente el uso de tokens, causando que la compactación se active en el momento incorrecto.

Por ejemplo, después de una operación de búsqueda web, la respuesta de la API podría mostrar:

```json
{
  "usage": {
    "input_tokens": 63000,
    "cache_read_input_tokens": 270000,
    "output_tokens": 1400
  }
}
```

El SDK calcula el uso total como 63,000 + 270,000 = 333,000 tokens. Sin embargo, el valor `cache_read_input_tokens` incluye lecturas acumuladas de múltiples llamadas internas de API realizadas por la herramienta del lado del servidor, no tu contexto de conversación real. Tu longitud de contexto real podría ser solo los 63,000 `input_tokens`, pero el SDK ve 333k y activa la compactación prematuramente.

**Soluciones alternativas:**

- Usa el punto final de [conteo de tokens](/docs/es/build-with-claude/token-counting) para obtener la longitud de contexto precisa
- Evita la compactación cuando uses herramientas del lado del servidor extensamente

#### Casos extremos de uso de herramientas

Cuando la compactación se activa mientras una respuesta de uso de herramienta está pendiente, el SDK elimina el bloque de uso de herramienta del historial de mensajes antes de generar el resumen. Claude volverá a emitir la llamada de herramienta después de reanudar desde el resumen si aún es necesario.

### Limitaciones

#### Herramientas del lado del servidor

<Warning>
La compactación requiere consideración especial cuando se usan herramientas del lado del servidor como [búsqueda web](/docs/es/agents-and-tools/tool-use/web-search-tool) o [búsqueda web](/docs/es/agents-and-tools/tool-use/web-fetch-tool).
</Warning>

Cuando se usan herramientas del lado del servidor, el SDK puede calcular incorrectamente el uso de tokens, causando que la compactación se active en el momento incorrecto.

Por ejemplo, después de una operación de búsqueda web, la respuesta de la API podría mostrar:

```json
{
  "usage": {
    "input_tokens": 63000,
    "cache_read_input_tokens": 270000,
    "output_tokens": 1400
  }
}
```

El SDK calcula el uso total como 63,000 + 270,000 = 333,000 tokens. Sin embargo, el valor `cache_read_input_tokens` incluye lecturas acumuladas de múltiples llamadas internas de API realizadas por la herramienta del lado del servidor, no tu contexto de conversación real. Tu longitud de contexto real podría ser solo los 63,000 `input_tokens`, pero el SDK ve 333k y activa la compactación prematuramente.

**Soluciones alternativas:**

- Usa el punto final de [conteo de tokens](/docs/es/build-with-claude/token-counting) para obtener la longitud de contexto precisa
- Evita la compactación cuando uses herramientas del lado del servidor extensamente

#### Casos extremos de uso de herramientas

Cuando la compactación se activa mientras una respuesta de uso de herramienta está pendiente, el SDK elimina el bloque de uso de herramienta del historial de mensajes antes de generar el resumen. Claude volverá a emitir la llamada de herramienta después de reanudar desde el resumen si aún es necesario.

### Monitoreo de compactación

Habilita el registro para rastrear cuándo ocurre la compactación:

<CodeGroup>

```python Python
import logging

logging.basicConfig(level=logging.INFO)
logging.getLogger("anthropic.lib.tools").setLevel(logging.INFO)

# Logs will show:
# INFO: Token usage 105000 has exceeded the threshold of 100000. Performing compaction.
# INFO: Compaction complete. New token usage: 2500
```

```typescript TypeScript
// The SDK logs compaction events to the console
// You'll see messages like:
// Token usage 105000 has exceeded the threshold of 100000. Performing compaction.
// Compaction complete. New token usage: 2500
```

</CodeGroup>

### Limitaciones

#### Herramientas del lado del servidor

<Warning>
La compactación requiere consideración especial cuando se usan herramientas del lado del servidor como [búsqueda web](/docs/es/agents-and-tools/tool-use/web-search-tool) o [búsqueda web](/docs/es/agents-and-tools/tool-use/web-fetch-tool).
</Warning>

Cuando se usan herramientas del lado del servidor, el SDK puede calcular incorrectamente el uso de tokens, causando que la compactación se active en el momento incorrecto.

Por ejemplo, después de una operación de búsqueda web, la respuesta de la API podría mostrar:

```json
{
  "usage": {
    "input_tokens": 63000,
    "cache_read_input_tokens": 270000,
    "output_tokens": 1400
  }
}
```

El SDK calcula el uso total como 63,000 + 270,000 = 333,000 tokens. Sin embargo, el valor `cache_read_input_tokens` incluye lecturas acumuladas de múltiples llamadas internas de API realizadas por la herramienta del lado del servidor, no tu contexto de conversación real. Tu longitud de contexto real podría ser solo los 63,000 `input_tokens`, pero el SDK ve 333k y activa la compactación prematuramente.

**Soluciones alternativas:**

- Usa el punto final de [conteo de tokens](/docs/es/build-with-claude/token-counting) para obtener la longitud de contexto precisa
- Evita la compactación cuando uses herramientas del lado del servidor extensamente

#### Casos extremos de uso de herramientas

Cuando la compactación se activa mientras una respuesta de uso de herramienta está pendiente, el SDK elimina el bloque de uso de herramienta del historial de mensajes antes de generar el resumen. Claude volverá a emitir la llamada de herramienta después de reanudar desde el resumen si aún es necesario.

### Monitoreo de compactación

Habilita el registro para rastrear cuándo ocurre la compactación:

<CodeGroup>

```python Python
import logging

logging.basicConfig(level=logging.INFO)
logging.getLogger("anthropic.lib.tools").setLevel(logging.INFO)

# Logs will show:
# INFO: Token usage 105000 has exceeded the threshold of 100000. Performing compaction.
# INFO: Compaction complete. New token usage: 2500
```

```typescript TypeScript
// The SDK logs compaction events to the console
// You'll see messages like:
// Token usage 105000 has exceeded the threshold of 100000. Performing compaction.
// Compaction complete. New token usage: 2500
```

</CodeGroup>

### Cuándo usar compactación

**Casos de uso adecuados:**

- Tareas de agente de larga duración que procesan muchos archivos o fuentes de datos
- Flujos de trabajo de investigación que acumulan grandes cantidades de información
- Tareas de múltiples pasos con progreso claro y medible
- Tareas que producen artefactos (archivos, informes) que persisten fuera de la conversación

**Casos de uso menos ideales:**

- Tareas que requieren recuerdo preciso de detalles de conversación temprana
- Flujos de trabajo que usan herramientas del lado del servidor extensamente
- Tareas que necesitan mantener estado exacto en muchas variables