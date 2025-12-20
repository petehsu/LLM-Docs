# Resultados de búsqueda

Habilita citas naturales para aplicaciones RAG proporcionando resultados de búsqueda con atribución de fuente

---

Los bloques de contenido de resultados de búsqueda permiten citas naturales con atribución de fuente adecuada, trayendo citas de calidad de búsqueda web a tus aplicaciones personalizadas. Esta característica es particularmente poderosa para aplicaciones RAG (Generación Aumentada por Recuperación) donde necesitas que Claude cite fuentes con precisión.

La característica de resultados de búsqueda está disponible en los siguientes modelos:

- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)
- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Sonnet 3.7 ([deprecated](/docs/es/about-claude/model-deprecations)) (`claude-3-7-sonnet-20250219`)
- Claude 3.5 Haiku (`claude-3-5-haiku-20241022`)

## Beneficios clave

- **Citas naturales** - Logra la misma calidad de cita que la búsqueda web para cualquier contenido
- **Integración flexible** - Úsalo en retornos de herramientas para RAG dinámico o como contenido de nivel superior para datos pre-obtenidos
- **Atribución de fuente adecuada** - Cada resultado incluye información de fuente y título para una atribución clara
- **Sin necesidad de soluciones alternativas de documentos** - Elimina la necesidad de soluciones alternativas basadas en documentos
- **Formato de cita consistente** - Coincide con la calidad y formato de cita de la funcionalidad de búsqueda web de Claude

## Cómo funciona

Los resultados de búsqueda se pueden proporcionar de dos formas:

1. **Desde llamadas de herramientas** - Tus herramientas personalizadas devuelven resultados de búsqueda, habilitando aplicaciones RAG dinámicas
2. **Como contenido de nivel superior** - Proporcionas resultados de búsqueda directamente en mensajes de usuario para contenido pre-obtenido o almacenado en caché

En ambos casos, Claude puede citar automáticamente información de los resultados de búsqueda con atribución de fuente adecuada.

### Esquema de resultado de búsqueda

Los resultados de búsqueda utilizan la siguiente estructura:

```json
{
  "type": "search_result",
  "source": "https://example.com/article",  // Requerido: URL de fuente o identificador
  "title": "Article Title",                  // Requerido: Título del resultado
  "content": [                               // Requerido: Array de bloques de texto
    {
      "type": "text",
      "text": "The actual content of the search result..."
    }
  ],
  "citations": {                             // Opcional: Configuración de cita
    "enabled": true                          // Habilitar/deshabilitar citas para este resultado
  }
}
```

### Campos requeridos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `type` | string | Debe ser `"search_result"` |
| `source` | string | La URL de fuente o identificador del contenido |
| `title` | string | Un título descriptivo para el resultado de búsqueda |
| `content` | array | Un array de bloques de texto que contienen el contenido real |

### Campos opcionales

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `citations` | object | Configuración de cita con campo booleano `enabled` |
| `cache_control` | object | Configuración de control de caché (p. ej., `{"type": "ephemeral"}`) |

Cada elemento en el array `content` debe ser un bloque de texto con:
- `type`: Debe ser `"text"`
- `text`: El contenido de texto real (cadena no vacía)

## Método 1: Resultados de búsqueda desde llamadas de herramientas

El caso de uso más poderoso es devolver resultados de búsqueda desde tus herramientas personalizadas. Esto habilita aplicaciones RAG dinámicas donde las herramientas obtienen y devuelven contenido relevante con citas automáticas.

### Ejemplo: Herramienta de base de conocimiento

<CodeGroup>
```python Python
from anthropic import Anthropic
from anthropic.types import (
    MessageParam,
    TextBlockParam,
    SearchResultBlockParam,
    ToolResultBlockParam
)

client = Anthropic()

# Define a knowledge base search tool
knowledge_base_tool = {
    "name": "search_knowledge_base",
    "description": "Search the company knowledge base for information",
    "input_schema": {
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "The search query"
            }
        },
        "required": ["query"]
    }
}

# Function to handle the tool call
def search_knowledge_base(query):
    # Your search logic here
    # Returns search results in the correct format
    return [
        SearchResultBlockParam(
            type="search_result",
            source="https://docs.company.com/product-guide",
            title="Product Configuration Guide",
            content=[
                TextBlockParam(
                    type="text",
                    text="To configure the product, navigate to Settings > Configuration. The default timeout is 30 seconds, but can be adjusted between 10-120 seconds based on your needs."
                )
            ],
            citations={"enabled": True}
        ),
        SearchResultBlockParam(
            type="search_result",
            source="https://docs.company.com/troubleshooting",
            title="Troubleshooting Guide",
            content=[
                TextBlockParam(
                    type="text",
                    text="If you encounter timeout errors, first check the configuration settings. Common causes include network latency and incorrect timeout values."
                )
            ],
            citations={"enabled": True}
        )
    ]

# Create a message with the tool
response = client.messages.create(
    model="claude-sonnet-4-5",  # Works with all supported models
    max_tokens=1024,
    tools=[knowledge_base_tool],
    messages=[
        MessageParam(
            role="user",
            content="How do I configure the timeout settings?"
        )
    ]
)

# When Claude calls the tool, provide the search results
if response.content[0].type == "tool_use":
    tool_result = search_knowledge_base(response.content[0].input["query"])
    
    # Send the tool result back
    final_response = client.messages.create(
        model="claude-sonnet-4-5",  # Works with all supported models
        max_tokens=1024,
        messages=[
            MessageParam(role="user", content="How do I configure the timeout settings?"),
            MessageParam(role="assistant", content=response.content),
            MessageParam(
                role="user",
                content=[
                    ToolResultBlockParam(
                        type="tool_result",
                        tool_use_id=response.content[0].id,
                        content=tool_result  # Search results go here
                    )
                ]
            )
        ]
    )
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

// Define a knowledge base search tool
const knowledgeBaseTool = {
  name: "search_knowledge_base",
  description: "Search the company knowledge base for information",
  input_schema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "The search query"
      }
    },
    required: ["query"]
  }
};

// Function to handle the tool call
function searchKnowledgeBase(query: string) {
  // Your search logic here
  // Returns search results in the correct format
  return [
    {
      type: "search_result" as const,
      source: "https://docs.company.com/product-guide",
      title: "Product Configuration Guide",
      content: [
        {
          type: "text" as const,
          text: "To configure the product, navigate to Settings > Configuration. The default timeout is 30 seconds, but can be adjusted between 10-120 seconds based on your needs."
        }
      ],
      citations: { enabled: true }
    },
    {
      type: "search_result" as const,
      source: "https://docs.company.com/troubleshooting",
      title: "Troubleshooting Guide",
      content: [
        {
          type: "text" as const,
          text: "If you encounter timeout errors, first check the configuration settings. Common causes include network latency and incorrect timeout values."
        }
      ],
      citations: { enabled: true }
    }
  ];
}

// Create a message with the tool
const response = await anthropic.messages.create({
  model: "claude-sonnet-4-5", // Works with all supported models
  max_tokens: 1024,
  tools: [knowledgeBaseTool],
  messages: [
    {
      role: "user",
      content: "How do I configure the timeout settings?"
    }
  ]
});

// Handle tool use and provide results
if (response.content[0].type === "tool_use") {
  const toolResult = searchKnowledgeBase(response.content[0].input.query);
  
  const finalResponse = await anthropic.messages.create({
    model: "claude-sonnet-4-5", // Works with all supported models
    max_tokens: 1024,
      messages: [
      { role: "user", content: "How do I configure the timeout settings?" },
      { role: "assistant", content: response.content },
      {
        role: "user",
        content: [
          {
            type: "tool_result" as const,
            tool_use_id: response.content[0].id,
            content: toolResult  // Search results go here
          }
        ]
      }
    ]
  });
}
```
</CodeGroup>

## Método 2: Resultados de búsqueda como contenido de nivel superior

También puedes proporcionar resultados de búsqueda directamente en mensajes de usuario. Esto es útil para:
- Contenido pre-obtenido de tu infraestructura de búsqueda
- Resultados de búsqueda almacenados en caché de consultas anteriores
- Contenido de servicios de búsqueda externos
- Pruebas y desarrollo

### Ejemplo: Resultados de búsqueda directos

<CodeGroup>
```python Python
from anthropic import Anthropic
from anthropic.types import (
    MessageParam,
    TextBlockParam,
    SearchResultBlockParam
)

client = Anthropic()

# Provide search results directly in the user message
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        MessageParam(
            role="user",
            content=[
                SearchResultBlockParam(
                    type="search_result",
                    source="https://docs.company.com/api-reference",
                    title="API Reference - Authentication",
                    content=[
                        TextBlockParam(
                            type="text",
                            text="All API requests must include an API key in the Authorization header. Keys can be generated from the dashboard. Rate limits: 1000 requests per hour for standard tier, 10000 for premium."
                        )
                    ],
                    citations={"enabled": True}
                ),
                SearchResultBlockParam(
                    type="search_result",
                    source="https://docs.company.com/quickstart",
                    title="Getting Started Guide",
                    content=[
                        TextBlockParam(
                            type="text",
                            text="To get started: 1) Sign up for an account, 2) Generate an API key from the dashboard, 3) Install our SDK using pip install company-sdk, 4) Initialize the client with your API key."
                        )
                    ],
                    citations={"enabled": True}
                ),
                TextBlockParam(
                    type="text",
                    text="Based on these search results, how do I authenticate API requests and what are the rate limits?"
                )
            ]
        )
    ]
)

print(response.model_dump_json(indent=2))
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

// Provide search results directly in the user message
const response = await anthropic.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: [
        {
          type: "search_result" as const,
          source: "https://docs.company.com/api-reference",
          title: "API Reference - Authentication",
          content: [
            {
              type: "text" as const,
              text: "All API requests must include an API key in the Authorization header. Keys can be generated from the dashboard. Rate limits: 1000 requests per hour for standard tier, 10000 for premium."
            }
          ],
          citations: { enabled: true }
        },
        {
          type: "search_result" as const,
          source: "https://docs.company.com/quickstart",
          title: "Getting Started Guide",
          content: [
            {
              type: "text" as const,
              text: "To get started: 1) Sign up for an account, 2) Generate an API key from the dashboard, 3) Install our SDK using pip install company-sdk, 4) Initialize the client with your API key."
            }
          ],
          citations: { enabled: true }
        },
        {
          type: "text" as const,
          text: "Based on these search results, how do I authenticate API requests and what are the rate limits?"
        }
      ]
    }
  ]
});

console.log(response);
```

```bash Shell
#!/bin/sh
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "search_result",
                    "source": "https://docs.company.com/api-reference",
                    "title": "API Reference - Authentication",
                    "content": [
                        {
                            "type": "text",
                            "text": "All API requests must include an API key in the Authorization header. Keys can be generated from the dashboard. Rate limits: 1000 requests per hour for standard tier, 10000 for premium."
                        }
                    ],
                    "citations": {
                        "enabled": true
                    }
                },
                {
                    "type": "search_result",
                    "source": "https://docs.company.com/quickstart",
                    "title": "Getting Started Guide",
                    "content": [
                        {
                            "type": "text",
                            "text": "To get started: 1) Sign up for an account, 2) Generate an API key from the dashboard, 3) Install our SDK using pip install company-sdk, 4) Initialize the client with your API key."
                        }
                    ],
                    "citations": {
                        "enabled": true
                    }
                },
                {
                    "type": "text",
                    "text": "Based on these search results, how do I authenticate API requests and what are the rate limits?"
                }
            ]
        }
    ]
}'
```
</CodeGroup>

## Respuesta de Claude con citas

Independientemente de cómo se proporcionen los resultados de búsqueda, Claude incluye automáticamente citas cuando utiliza información de ellos:

```json
{
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "To authenticate API requests, you need to include an API key in the Authorization header",
      "citations": [
        {
          "type": "search_result_location",
          "source": "https://docs.company.com/api-reference",
          "title": "API Reference - Authentication",
          "cited_text": "All API requests must include an API key in the Authorization header",
          "search_result_index": 0,
          "start_block_index": 0,
          "end_block_index": 0
        }
      ]
    },
    {
      "type": "text",
      "text": ". You can generate API keys from your dashboard",
      "citations": [
        {
          "type": "search_result_location",
          "source": "https://docs.company.com/api-reference",
          "title": "API Reference - Authentication",
          "cited_text": "Keys can be generated from the dashboard",
          "search_result_index": 0,
          "start_block_index": 0,
          "end_block_index": 0
        }
      ]
    },
    {
      "type": "text",
      "text": ". The rate limits are 1,000 requests per hour for the standard tier and 10,000 requests per hour for the premium tier.",
      "citations": [
        {
          "type": "search_result_location",
          "source": "https://docs.company.com/api-reference",
          "title": "API Reference - Authentication",
          "cited_text": "Rate limits: 1000 requests per hour for standard tier, 10000 for premium",
          "search_result_index": 0,
          "start_block_index": 0,
          "end_block_index": 0
        }
      ]
    }
  ]
}
```

### Campos de cita

Cada cita incluye:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `type` | string | Siempre `"search_result_location"` para citas de resultados de búsqueda |
| `source` | string | La fuente del resultado de búsqueda original |
| `title` | string o null | El título del resultado de búsqueda original |
| `cited_text` | string | El texto exacto siendo citado |
| `search_result_index` | integer | Índice del resultado de búsqueda (basado en 0) |
| `start_block_index` | integer | Posición inicial en el array de contenido |
| `end_block_index` | integer | Posición final en el array de contenido |

Nota: El `search_result_index` se refiere al índice del bloque de contenido del resultado de búsqueda (basado en 0), independientemente de cómo se proporcionaron los resultados de búsqueda (llamada de herramienta o contenido de nivel superior).

## Múltiples bloques de contenido

Los resultados de búsqueda pueden contener múltiples bloques de texto en el array `content`:

```json
{
  "type": "search_result",
  "source": "https://docs.company.com/api-guide",
  "title": "API Documentation",
  "content": [
    {
      "type": "text",
      "text": "Authentication: All API requests require an API key."
    },
    {
      "type": "text",
      "text": "Rate Limits: The API allows 1000 requests per hour per key."
    },
    {
      "type": "text",
      "text": "Error Handling: The API returns standard HTTP status codes."
    }
  ]
}
```

Claude puede citar bloques específicos usando los campos `start_block_index` y `end_block_index`.

## Uso avanzado

### Combinando ambos métodos

Puedes usar resultados de búsqueda basados en herramientas y de nivel superior en la misma conversación:

```python
# First message with top-level search results
messages = [
    MessageParam(
        role="user",
        content=[
            SearchResultBlockParam(
                type="search_result",
                source="https://docs.company.com/overview",
                title="Product Overview",
                content=[
                    TextBlockParam(type="text", text="Our product helps teams collaborate...")
                ],
                citations={"enabled": True}
            ),
            TextBlockParam(
                type="text",
                text="Tell me about this product and search for pricing information"
            )
        ]
    )
]

# Claude might respond and call a tool to search for pricing
# Then you provide tool results with more search results
```

### Combinando con otros tipos de contenido

Ambos métodos soportan mezclar resultados de búsqueda con otro contenido:

```python
# In tool results
tool_result = [
    SearchResultBlockParam(
        type="search_result",
        source="https://docs.company.com/guide",
        title="User Guide",
        content=[TextBlockParam(type="text", text="Configuration details...")],
        citations={"enabled": True}
    ),
    TextBlockParam(
        type="text",
        text="Additional context: This applies to version 2.0 and later."
    )
]

# In top-level content
user_content = [
    SearchResultBlockParam(
        type="search_result",
        source="https://research.com/paper",
        title="Research Paper",
        content=[TextBlockParam(type="text", text="Key findings...")],
        citations={"enabled": True}
    ),
    {
        "type": "image",
        "source": {"type": "url", "url": "https://example.com/chart.png"}
    },
    TextBlockParam(
        type="text",
        text="How does the chart relate to the research findings?"
    )
]
```

### Control de caché

Añade control de caché para mejor rendimiento:

```json
{
  "type": "search_result",
  "source": "https://docs.company.com/guide",
  "title": "User Guide",
  "content": [{"type": "text", "text": "..."}],
  "cache_control": {
    "type": "ephemeral"
  }
}
```

### Control de cita

Por defecto, las citas están deshabilitadas para resultados de búsqueda. Puedes habilitar citas estableciendo explícitamente la configuración `citations`:

```json
{
  "type": "search_result",
  "source": "https://docs.company.com/guide",
  "title": "User Guide",
  "content": [{"type": "text", "text": "Important documentation..."}],
  "citations": {
    "enabled": true  // Enable citations for this result
  }
}
```

Cuando `citations.enabled` se establece en `true`, Claude incluirá referencias de cita cuando use información del resultado de búsqueda. Esto habilita:
- Citas naturales para tus aplicaciones RAG personalizadas
- Atribución de fuente cuando se interfaz con bases de conocimiento propietarias
- Citas de calidad de búsqueda web para cualquier herramienta personalizada que devuelva resultados de búsqueda

Si el campo `citations` se omite, las citas están deshabilitadas por defecto.

<Warning>
Las citas son todo o nada: o todos los resultados de búsqueda en una solicitud deben tener citas habilitadas, o todos deben tenerlas deshabilitadas. Mezclar resultados de búsqueda con diferentes configuraciones de cita resultará en un error. Si necesitas deshabilitar citas para algunas fuentes, debes deshabilitarlas para todos los resultados de búsqueda en esa solicitud.
</Warning>

## Mejores prácticas

### Para búsqueda basada en herramientas (Método 1)

- **Contenido dinámico**: Úsalo para búsquedas en tiempo real y aplicaciones RAG dinámicas
- **Manejo de errores**: Devuelve mensajes apropiados cuando las búsquedas fallan
- **Límites de resultados**: Devuelve solo los resultados más relevantes para evitar desbordamiento de contexto

### Para búsqueda de nivel superior (Método 2)

- **Contenido pre-obtenido**: Úsalo cuando ya tienes resultados de búsqueda
- **Procesamiento por lotes**: Ideal para procesar múltiples resultados de búsqueda a la vez
- **Pruebas**: Excelente para probar el comportamiento de citas con contenido conocido

### Mejores prácticas generales

1. **Estructura los resultados efectivamente**
   - Usa URLs de fuente claras y permanentes
   - Proporciona títulos descriptivos
   - Divide contenido largo en bloques de texto lógicos

2. **Mantén consistencia**
   - Usa formatos de fuente consistentes en tu aplicación
   - Asegúrate de que los títulos reflejen con precisión el contenido
   - Mantén el formato consistente

3. **Maneja errores con elegancia**
   ```python
   def search_with_fallback(query):
       try:
           results = perform_search(query)
           if not results:
               return {"type": "text", "text": "No results found."}
           return format_as_search_results(results)
       except Exception as e:
           return {"type": "text", "text": f"Search error: {str(e)}"}
   ```

## Limitaciones

- Los bloques de contenido de resultados de búsqueda están disponibles en Claude API, Amazon Bedrock y Google Cloud's Vertex AI
- Solo se soporta contenido de texto dentro de resultados de búsqueda (sin imágenes u otros medios)
- El array `content` debe contener al menos un bloque de texto