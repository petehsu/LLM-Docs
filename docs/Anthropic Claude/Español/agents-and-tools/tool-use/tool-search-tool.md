# Herramienta de búsqueda de herramientas

Permite a Claude trabajar con cientos o miles de herramientas descubriendo y cargando dinámicamente solo las que necesita

---

La herramienta de búsqueda de herramientas permite a Claude trabajar con cientos o miles de herramientas descubriendo y cargando dinámicamente solo las que necesita. En lugar de cargar todas las definiciones de herramientas en la ventana de contexto de antemano, Claude busca en tu catálogo de herramientas—incluyendo nombres de herramientas, descripciones, nombres de argumentos y descripciones de argumentos—y carga solo las herramientas que necesita.

Este enfoque resuelve dos desafíos críticos a medida que las bibliotecas de herramientas se escalan:

- **Eficiencia de contexto**: Las definiciones de herramientas pueden consumir porciones masivas de tu ventana de contexto (50 herramientas ≈ 10-20K tokens), dejando menos espacio para el trabajo real
- **Precisión en la selección de herramientas**: La capacidad de Claude para seleccionar correctamente herramientas se degrada significativamente con más de 30-50 herramientas disponibles convencionalmente

Aunque esto se proporciona como una herramienta del lado del servidor, también puedes implementar tu propia funcionalidad de búsqueda de herramientas del lado del cliente. Consulta [Implementación personalizada de búsqueda de herramientas](#custom-tool-search-implementation) para más detalles.

<Note>
La herramienta de búsqueda de herramientas está actualmente en beta pública. Incluye el [encabezado beta](/docs/es/api/beta-headers) apropiado para tu proveedor:

| Proveedor                 | Encabezado beta                | Modelos soportados                     |
| ------------------------ | ------------------------------ | -------------------------------------- |
| Claude API<br/>Microsoft Foundry  | `advanced-tool-use-2025-11-20` | Claude Opus 4.5<br />Claude Sonnet 4.5 |
| Google Cloud's Vertex AI | `tool-search-tool-2025-10-19`  | Claude Opus 4.5<br />Claude Sonnet 4.5 |
| Amazon Bedrock           | `tool-search-tool-2025-10-19`  | Claude Opus 4.5                        |
</Note>

<Warning>
  En Amazon Bedrock, la búsqueda de herramientas del lado del servidor está disponible solo a través de la [API invoke](https://docs.aws.amazon.com/bedrock/latest/userguide/bedrock-runtime_example_bedrock-runtime_InvokeModel_AnthropicClaude_section.html),
  no la API converse.
</Warning>

También puedes implementar [búsqueda de herramientas del lado del cliente](#custom-tool-search-implementation) devolviendo bloques `tool_reference` desde tu propia implementación de búsqueda.

## Cómo funciona la búsqueda de herramientas

Hay dos variantes de búsqueda de herramientas:

- **Regex** (`tool_search_tool_regex_20251119`): Claude construye patrones regex para buscar herramientas
- **BM25** (`tool_search_tool_bm25_20251119`): Claude usa consultas en lenguaje natural para buscar herramientas

Cuando habilitas la herramienta de búsqueda de herramientas:

1. Incluyes una herramienta de búsqueda de herramientas (por ejemplo, `tool_search_tool_regex_20251119` o `tool_search_tool_bm25_20251119`) en tu lista de herramientas
2. Proporcionas todas las definiciones de herramientas con `defer_loading: true` para herramientas que no deberían cargarse inmediatamente
3. Claude ve solo la herramienta de búsqueda de herramientas y cualquier herramienta no diferida inicialmente
4. Cuando Claude necesita herramientas adicionales, busca usando una herramienta de búsqueda de herramientas
5. La API devuelve 3-5 bloques `tool_reference` más relevantes
6. Estas referencias se expanden automáticamente en definiciones de herramientas completas
7. Claude selecciona de las herramientas descubiertas e las invoca

Esto mantiene tu ventana de contexto eficiente mientras se mantiene alta la precisión en la selección de herramientas.

## Inicio rápido

Aquí hay un ejemplo simple con herramientas diferidas:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: advanced-tool-use-2025-11-20" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5-20250929",
        "max_tokens": 2048,
        "messages": [
            {
                "role": "user",
                "content": "What is the weather in San Francisco?"
            }
        ],
        "tools": [
            {
                "type": "tool_search_tool_regex_20251119",
                "name": "tool_search_tool_regex"
            },
            {
                "name": "get_weather",
                "description": "Get the weather at a specific location",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "location": {"type": "string"},
                        "unit": {
                            "type": "string",
                            "enum": ["celsius", "fahrenheit"]
                        }
                    },
                    "required": ["location"]
                },
                "defer_loading": true
            },
            {
                "name": "search_files",
                "description": "Search through files in the workspace",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "query": {"type": "string"},
                        "file_types": {
                            "type": "array",
                            "items": {"type": "string"}
                        }
                    },
                    "required": ["query"]
                },
                "defer_loading": true
            }
        ]
    }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=2048,
    messages=[
        {
            "role": "user",
            "content": "What is the weather in San Francisco?"
        }
    ],
    tools=[
        {
            "type": "tool_search_tool_regex_20251119",
            "name": "tool_search_tool_regex"
        },
        {
            "name": "get_weather",
            "description": "Get the weather at a specific location",
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {"type": "string"},
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"]
                    }
                },
                "required": ["location"]
            },
            "defer_loading": True
        },
        {
            "name": "search_files",
            "description": "Search through files in the workspace",
            "input_schema": {
                "type": "object",
                "properties": {
                    "query": {"type": "string"},
                    "file_types": {
                        "type": "array",
                        "items": {"type": "string"}
                    }
                },
                "required": ["query"]
            },
            "defer_loading": True
        }
    ]
)

print(response)
```

```typescript TypeScript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

async function main() {
  const response = await client.beta.messages.create({
    model: "claude-sonnet-4-5-20250929",
    betas: ["advanced-tool-use-2025-11-20"],
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: "What is the weather in San Francisco?",
      },
    ],
    tools: [
      {
        type: "tool_search_tool_regex_20251119",
        name: "tool_search_tool_regex",
      },
      {
        name: "get_weather",
        description: "Get the weather at a specific location",
        input_schema: {
          type: "object",
          properties: {
            location: { type: "string" },
            unit: {
              type: "string",
              enum: ["celsius", "fahrenheit"],
            },
          },
          required: ["location"],
        },
        defer_loading: true,
      },
      {
        name: "search_files",
        description: "Search through files in the workspace",
        input_schema: {
          type: "object",
          properties: {
            query: { type: "string" },
            file_types: {
              type: "array",
              items: { type: "string" },
            },
          },
          required: ["query"],
        },
        defer_loading: true,
      },
    ],
  });

  console.log(JSON.stringify(response, null, 2));
}

main();
```

</CodeGroup>

## Definición de herramienta

La herramienta de búsqueda de herramientas tiene dos variantes:

```json JSON
{
  "type": "tool_search_tool_regex_20251119",
  "name": "tool_search_tool_regex"
}
```

```json JSON
{
  "type": "tool_search_tool_bm25_20251119",
  "name": "tool_search_tool_bm25"
}
```

<Warning>
**Formato de consulta de variante Regex: Regex de Python, NO lenguaje natural**

Cuando uses `tool_search_tool_regex_20251119`, Claude construye patrones regex usando la sintaxis `re.search()` de Python, no consultas en lenguaje natural. Patrones comunes:

- `"weather"` - coincide con nombres/descripciones de herramientas que contienen "weather"
- `"get_.*_data"` - coincide con herramientas como `get_user_data`, `get_weather_data`
- `"database.*query|query.*database"` - patrones OR para flexibilidad
- `"(?i)slack"` - búsqueda insensible a mayúsculas/minúsculas

Longitud máxima de consulta: 200 caracteres

</Warning>

<Note>
**Formato de consulta de variante BM25: Lenguaje natural**

Cuando uses `tool_search_tool_bm25_20251119`, Claude usa consultas en lenguaje natural para buscar herramientas.

</Note>

### Carga diferida de herramientas

Marca herramientas para carga bajo demanda agregando `defer_loading: true`:

```json JSON
{
  "name": "get_weather",
  "description": "Get current weather for a location",
  "input_schema": {
    "type": "object",
    "properties": {
      "location": { "type": "string" },
      "unit": { "type": "string", "enum": ["celsius", "fahrenheit"] }
    },
    "required": ["location"]
  },
  "defer_loading": true
}
```

**Puntos clave:**

- Las herramientas sin `defer_loading` se cargan en contexto inmediatamente
- Las herramientas con `defer_loading: true` se cargan solo cuando Claude las descubre a través de búsqueda
- La herramienta de búsqueda de herramientas en sí **nunca** debe tener `defer_loading: true`
- Mantén tus 3-5 herramientas más frecuentemente usadas como no diferidas para un rendimiento óptimo

Ambas variantes de búsqueda de herramientas (`regex` y `bm25`) buscan nombres de herramientas, descripciones, nombres de argumentos y descripciones de argumentos.

## Formato de respuesta

Cuando Claude usa la herramienta de búsqueda de herramientas, la respuesta incluye nuevos tipos de bloques:

```json JSON
{
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "I'll search for tools to help with the weather information."
    },
    {
      "type": "server_tool_use",
      "id": "srvtoolu_01ABC123",
      "name": "tool_search_tool_regex",
      "input": {
        "query": "weather"
      }
    },
    {
      "type": "tool_search_tool_result",
      "tool_use_id": "srvtoolu_01ABC123",
      "content": {
        "type": "tool_search_tool_search_result",
        "tool_references": [{ "type": "tool_reference", "tool_name": "get_weather" }]
      }
    },
    {
      "type": "text",
      "text": "I found a weather tool. Let me get the weather for San Francisco."
    },
    {
      "type": "tool_use",
      "id": "toolu_01XYZ789",
      "name": "get_weather",
      "input": { "location": "San Francisco", "unit": "fahrenheit" }
    }
  ],
  "stop_reason": "tool_use"
}
```

### Entendiendo la respuesta

- **`server_tool_use`**: Indica que Claude está invocando la herramienta de búsqueda de herramientas
- **`tool_search_tool_result`**: Contiene los resultados de búsqueda con un objeto `tool_search_tool_search_result` anidado
- **`tool_references`**: Array de objetos `tool_reference` que apuntan a herramientas descubiertas
- **`tool_use`**: Claude invocando la herramienta descubierta

Los bloques `tool_reference` se expanden automáticamente en definiciones de herramientas completas antes de ser mostrados a Claude. No necesitas manejar esta expansión tú mismo. Sucede automáticamente en la API siempre que proporciones todas las definiciones de herramientas coincidentes en el parámetro `tools`.

## Integración MCP

La herramienta de búsqueda de herramientas funciona con [servidores MCP](/docs/es/agents-and-tools/mcp-connector). Agrega el [encabezado beta](/docs/es/api/beta-headers) `"mcp-client-2025-11-20"` a tu solicitud de API, y luego usa `mcp_toolset` con `default_config` para diferir la carga de herramientas MCP:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
  --header "x-api-key: $ANTHROPIC_API_KEY" \
  --header "anthropic-version: 2023-06-01" \
  --header "anthropic-beta: advanced-tool-use-2025-11-20,mcp-client-2025-11-20" \
  --header "content-type: application/json" \
  --data '{
    "model": "claude-sonnet-4-5-20250929",
    "max_tokens": 2048,
    "mcp_servers": [
      {
        "type": "url",
        "name": "database-server",
        "url": "https://mcp-db.example.com"
      }
    ],
    "tools": [
      {
        "type": "tool_search_tool_regex_20251119",
        "name": "tool_search_tool_regex"
      },
      {
        "type": "mcp_toolset",
        "mcp_server_name": "database-server",
        "default_config": {
          "defer_loading": true
        },
        "configs": {
          "search_events": {
            "defer_loading": false
          }
        }
      }
    ],
    "messages": [
      {
        "role": "user",
        "content": "What events are in my database?"
      }
    ]
  }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    betas=["advanced-tool-use-2025-11-20", "mcp-client-2025-11-20"],
    max_tokens=2048,
    mcp_servers=[
        {
            "type": "url",
            "name": "database-server",
            "url": "https://mcp-db.example.com"
        }
    ],
    tools=[
        {
            "type": "tool_search_tool_regex_20251119",
            "name": "tool_search_tool_regex"
        },
        {
            "type": "mcp_toolset",
            "mcp_server_name": "database-server",
            "default_config": {
                "defer_loading": True
            },
            "configs": {
                "search_events": {
                    "defer_loading": False
                }
            }
        }
    ],
    messages=[
        {
            "role": "user",
            "content": "What events are in my database?"
        }
    ]
)

print(response)
```

```typescript TypeScript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

async function main() {
  const response = await client.beta.messages.create({
    model: "claude-sonnet-4-5-20250929",
    betas: ["advanced-tool-use-2025-11-20", "mcp-client-2025-11-20"],
    max_tokens: 2048,
    mcp_servers: [
      {
        type: "url",
        name: "database-server",
        url: "https://mcp-db.example.com",
      },
    ],
    tools: [
      {
        type: "tool_search_tool_regex_20251119",
        name: "tool_search_tool_regex",
      },
      {
        type: "mcp_toolset",
        mcp_server_name: "database-server",
        default_config: {
          defer_loading: true,
        },
        configs: {
          search_events: {
            defer_loading: false,
          },
        },
      },
    ],
    messages: [
      {
        role: "user",
        content: "What events are in my database?",
      },
    ],
  });

  console.log(JSON.stringify(response, null, 2));
}

main();
```

</CodeGroup>

**Opciones de configuración MCP:**

- `default_config.defer_loading`: Establece el valor predeterminado para todas las herramientas del servidor MCP
- `configs`: Anula los valores predeterminados para herramientas específicas por nombre
- Combina múltiples servidores MCP con búsqueda de herramientas para bibliotecas de herramientas masivas

## Implementación personalizada de búsqueda de herramientas

Puedes implementar tu propia lógica de búsqueda de herramientas (por ejemplo, usando embeddings o búsqueda semántica) devolviendo bloques `tool_reference` desde una herramienta personalizada:

```json JSON
{
  "type": "tool_search_tool_result",
  "tool_use_id": "toolu_custom_search",
  "content": {
    "type": "tool_search_tool_search_result",
    "tool_references": [{ "type": "tool_reference", "tool_name": "discovered_tool_name" }]
  }
}
```

Cada herramienta referenciada debe tener una definición de herramienta correspondiente en el parámetro `tools` de nivel superior con `defer_loading: true`. Este enfoque te permite usar algoritmos de búsqueda más sofisticados mientras se mantiene la compatibilidad con el sistema de búsqueda de herramientas.

Para un ejemplo completo usando embeddings, consulta nuestro [cookbook de búsqueda de herramientas con embeddings](https://github.com/anthropics/anthropic-cookbook).

## Manejo de errores

<Note>
  La herramienta de búsqueda de herramientas no es compatible con [ejemplos de uso de herramientas](/docs/es/agents-and-tools/tool-use/implement-tool-use#providing-tool-use-examples).
  Si necesitas proporcionar ejemplos de uso de herramientas, usa llamadas de herramientas estándar
  sin búsqueda de herramientas.
</Note>

### Errores HTTP (estado 400)

Estos errores previenen que la solicitud sea procesada:

**Todas las herramientas diferidas:**

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "All tools have defer_loading set. At least one tool must be non-deferred."
  }
}
```

**Definición de herramienta faltante:**

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "Tool reference 'unknown_tool' has no corresponding tool definition"
  }
}
```

### Errores de resultado de herramienta (estado 200)

Los errores durante la ejecución de herramientas devuelven una respuesta 200 con información de error en el cuerpo:

```json JSON
{
  "type": "tool_result",
  "tool_use_id": "srvtoolu_01ABC123",
  "content": {
    "type": "tool_search_tool_result_error",
    "error_code": "invalid_pattern"
  }
}
```

**Códigos de error:**

- `too_many_requests`: Límite de velocidad excedido para operaciones de búsqueda de herramientas
- `invalid_pattern`: Patrón regex malformado
- `pattern_too_long`: El patrón excede el límite de 200 caracteres
- `unavailable`: Servicio de búsqueda de herramientas temporalmente no disponible

### Errores comunes

<section title="Error 400: Todas las herramientas están diferidas">

**Causa**: Estableciste `defer_loading: true` en TODAS las herramientas incluyendo la herramienta de búsqueda

**Solución**: Elimina `defer_loading` de la herramienta de búsqueda de herramientas:

```json
{
  "type": "tool_search_tool_regex_20251119", // Sin defer_loading aquí
  "name": "tool_search_tool_regex"
}
```

</section>

<section title="Error 400: Definición de herramienta faltante">

**Causa**: Una `tool_reference` apunta a una herramienta que no está en tu array `tools`

**Solución**: Asegúrate de que cada herramienta que podría ser descubierta tenga una definición completa:

```json
{
  "name": "my_tool",
  "description": "Full description here",
  "input_schema": {
    /* complete schema */
  },
  "defer_loading": true
}
```

</section>

<section title="Claude no encuentra las herramientas esperadas">

**Causa**: Los nombres o descripciones de herramientas no coinciden con el patrón regex

**Pasos de depuración:**

1. Verifica el nombre y descripción de la herramienta—Claude busca en AMBOS campos
2. Prueba tu patrón: `import re; re.search(r"your_pattern", "tool_name")`
3. Recuerda que las búsquedas son sensibles a mayúsculas/minúsculas por defecto (usa `(?i)` para insensible a mayúsculas/minúsculas)
4. Claude usa patrones amplios como `".*weather.*"` no coincidencias exactas

**Consejo**: Agrega palabras clave comunes a las descripciones de herramientas para mejorar la detectabilidad

</section>

## Almacenamiento en caché de prompts

La búsqueda de herramientas funciona con [almacenamiento en caché de prompts](/docs/es/build-with-claude/prompt-caching). Agrega puntos de ruptura `cache_control` para optimizar conversaciones de múltiples turnos:

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# Primera solicitud con búsqueda de herramientas
messages = [
    {
        "role": "user",
        "content": "What's the weather in Seattle?"
    }
]

response1 = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=2048,
    messages=messages,
    tools=[
        {
            "type": "tool_search_tool_regex_20251119",
            "name": "tool_search_tool_regex"
        },
        {
            "name": "get_weather",
            "description": "Get weather for a location",
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {"type": "string"}
                },
                "required": ["location"]
            },
            "defer_loading": True
        }
    ]
)

# Agrega la respuesta de Claude a la conversación
messages.append({
    "role": "assistant",
    "content": response1.content
})

# Segunda solicitud con punto de ruptura de caché
messages.append({
    "role": "user",
    "content": "What about New York?",
    "cache_control": {"type": "ephemeral"}
})

response2 = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=2048,
    messages=messages,
    tools=[
        {
            "type": "tool_search_tool_regex_20251119",
            "name": "tool_search_tool_regex"
        },
        {
            "name": "get_weather",
            "description": "Get weather for a location",
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {"type": "string"}
                },
                "required": ["location"]
            },
            "defer_loading": True
        }
    ]
)

print(f"Cache read tokens: {response2.usage.get('cache_read_input_tokens', 0)}")
```
</CodeGroup>

El sistema expande automáticamente bloques tool_reference en todo el historial de conversación completo, por lo que Claude puede reutilizar herramientas descubiertas en turnos posteriores sin volver a buscar.

## Streaming

Con streaming habilitado, recibirás eventos de búsqueda de herramientas como parte del stream:

```javascript
event: content_block_start
data: {"type": "content_block_start", "index": 1, "content_block": {"type": "server_tool_use", "id": "srvtoolu_xyz789", "name": "tool_search_tool_regex"}}

// Consulta de búsqueda transmitida
event: content_block_delta
data: {"type": "content_block_delta", "index": 1, "delta": {"type": "input_json_delta", "partial_json": "{\"query\":\"weather\"}"}}

// Pausa mientras se ejecuta la búsqueda

// Resultados de búsqueda transmitidos
event: content_block_start
data: {"type": "content_block_start", "index": 2, "content_block": {"type": "tool_search_tool_result", "tool_use_id": "srvtoolu_xyz789", "content": {"type": "tool_search_tool_search_result", "tool_references": [{"type": "tool_reference", "tool_name": "get_weather"}]}}}

// Claude continúa con herramientas descubiertas
```

## Solicitudes por lotes

Puedes incluir la herramienta de búsqueda de herramientas en la [API de Lotes de Mensajes](/docs/es/build-with-claude/batch-processing). Las operaciones de búsqueda de herramientas a través de la API de Lotes de Mensajes se cotizan igual que las solicitudes de la API de Mensajes regular.

## Límites y mejores prácticas

### Límites

- **Máximo de herramientas**: 10,000 herramientas en tu catálogo
- **Resultados de búsqueda**: Devuelve 3-5 herramientas más relevantes por búsqueda
- **Longitud de patrón**: Máximo 200 caracteres para patrones regex
- **Soporte de modelo**: Solo Sonnet 4.0+, Opus 4.0+ (sin Haiku)

### Cuándo usar búsqueda de herramientas

**Casos de uso buenos:**

- 10+ herramientas disponibles en tu sistema
- Definiciones de herramientas consumiendo >10K tokens
- Experimentando problemas de precisión en la selección de herramientas con grandes conjuntos de herramientas
- Construyendo sistemas impulsados por MCP con múltiples servidores (200+ herramientas)
- Biblioteca de herramientas creciendo con el tiempo

**Cuándo el llamado de herramientas tradicional podría ser mejor:**

- Menos de 10 herramientas en total
- Todas las herramientas se usan frecuentemente en cada solicitud
- Definiciones de herramientas muy pequeñas (\<100 tokens en total)

### Consejos de optimización

- Mantén 3-5 herramientas más frecuentemente usadas como no diferidas
- Escribe nombres y descripciones de herramientas claros y descriptivos
- Usa palabras clave semánticas en descripciones que coincidan con cómo los usuarios describen tareas
- Agrega una sección de prompt del sistema describiendo categorías de herramientas disponibles: "Puedes buscar herramientas para interactuar con Slack, GitHub y Jira"
- Monitorea qué herramientas descubre Claude para refinar descripciones

## Uso

El uso de la herramienta de búsqueda de herramientas se rastrea en el objeto de uso de respuesta:

```json JSON
{
  "usage": {
    "input_tokens": 1024,
    "output_tokens": 256,
    "server_tool_use": {
      "tool_search_requests": 2
    }
  }
}
```