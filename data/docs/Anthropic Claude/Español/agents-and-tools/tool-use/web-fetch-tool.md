# Herramienta de obtención web

La herramienta de obtención web permite a Claude recuperar contenido completo de páginas web y documentos PDF especificados.

---

La herramienta de obtención web permite a Claude recuperar contenido completo de páginas web y documentos PDF especificados.

<Note>
La herramienta de obtención web está actualmente en beta. Para habilitarla, utiliza el encabezado beta `web-fetch-2025-09-10` en tus solicitudes de API.

Por favor, utiliza [este formulario](https://forms.gle/NhWcgmkcvPCMmPE86) para proporcionar comentarios sobre la calidad de las respuestas del modelo, la API en sí, o la calidad de la documentación.
</Note>

<Warning>
Habilitar la herramienta de obtención web en entornos donde Claude procesa entrada no confiable junto con datos sensibles presenta riesgos de exfiltración de datos. Recomendamos usar esta herramienta solo en entornos confiables o cuando se manejan datos no sensibles.

Para minimizar los riesgos de exfiltración, Claude no puede construir dinámicamente URLs. Claude solo puede obtener URLs que han sido proporcionadas explícitamente por el usuario o que provienen de resultados anteriores de búsqueda web u obtención web. Sin embargo, todavía existe un riesgo residual que debe considerarse cuidadosamente al usar esta herramienta.

Si la exfiltración de datos es una preocupación, considera:
- Deshabilitar completamente la herramienta de obtención web
- Usar el parámetro `max_uses` para limitar el número de solicitudes
- Usar el parámetro `allowed_domains` para restringir a dominios seguros conocidos
</Warning>

## Modelos soportados

La obtención web está disponible en:

- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Sonnet 3.7 ([deprecated](/docs/es/about-claude/model-deprecations)) (`claude-3-7-sonnet-20250219`)
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)
- Claude Haiku 3.5 (`claude-3-5-haiku-latest`)
- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)

## Cómo funciona la obtención web

Cuando añades la herramienta de obtención web a tu solicitud de API:

1. Claude decide cuándo obtener contenido basándose en el prompt y las URLs disponibles.
2. La API recupera el contenido de texto completo de la URL especificada.
3. Para PDFs, se realiza extracción automática de texto.
4. Claude analiza el contenido obtenido y proporciona una respuesta con citas opcionales.

<Note>
La herramienta de obtención web actualmente no soporta sitios web renderizados dinámicamente mediante Javascript.
</Note>

## Cómo usar la obtención web

Proporciona la herramienta de obtención web en tu solicitud de API:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: web-fetch-2025-09-10" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 1024,
        "messages": [
            {
                "role": "user",
                "content": "Please analyze the content at https://example.com/article"
            }
        ],
        "tools": [{
            "type": "web_fetch_20250910",
            "name": "web_fetch",
            "max_uses": 5
        }]
    }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": "Please analyze the content at https://example.com/article"
        }
    ],
    tools=[{
        "type": "web_fetch_20250910",
        "name": "web_fetch",
        "max_uses": 5
    }],
    extra_headers={
        "anthropic-beta": "web-fetch-2025-09-10"
    }
)
print(response)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

async function main() {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: "Please analyze the content at https://example.com/article"
      }
    ],
    tools: [{
      type: "web_fetch_20250910",
      name: "web_fetch",
      max_uses: 5
    }],
    headers: {
      "anthropic-beta": "web-fetch-2025-09-10"
    }
  });

  console.log(response);
}

main().catch(console.error);
```
</CodeGroup>

### Definición de la herramienta

La herramienta de obtención web soporta los siguientes parámetros:

```json JSON
{
  "type": "web_fetch_20250910",
  "name": "web_fetch",

  // Optional: Limit the number of fetches per request
  "max_uses": 10,

  // Optional: Only fetch from these domains
  "allowed_domains": ["example.com", "docs.example.com"],

  // Optional: Never fetch from these domains
  "blocked_domains": ["private.example.com"],

  // Optional: Enable citations for fetched content
  "citations": {
    "enabled": true
  },

  // Optional: Maximum content length in tokens
  "max_content_tokens": 100000
}
```

#### Máximo de usos

El parámetro `max_uses` limita el número de obtenciones web realizadas. Si Claude intenta más obtenciones de las permitidas, el `web_fetch_tool_result` será un error con el código de error `max_uses_exceeded`. Actualmente no hay límite predeterminado.

#### Filtrado de dominios

Cuando uses filtros de dominio:

- Los dominios no deben incluir el esquema HTTP/HTTPS (usa `example.com` en lugar de `https://example.com`)
- Los subdominios se incluyen automáticamente (`example.com` cubre `docs.example.com`)
- Se soportan subrrutas (`example.com/blog`)
- Puedes usar `allowed_domains` o `blocked_domains`, pero no ambos en la misma solicitud.

<Warning>
Ten en cuenta que los caracteres Unicode en nombres de dominio pueden crear vulnerabilidades de seguridad a través de ataques de homografía, donde caracteres visualmente similares de diferentes scripts pueden eludir filtros de dominio. Por ejemplo, `аmazon.com` (usando la 'а' cirílica) puede parecer idéntico a `amazon.com` pero representa un dominio diferente.

Cuando configures listas de permitidos/bloqueados de dominios:
- Usa nombres de dominio solo ASCII cuando sea posible
- Considera que los analizadores de URL pueden manejar la normalización Unicode de manera diferente
- Prueba tus filtros de dominio con variaciones potenciales de homografía
- Audita regularmente tus configuraciones de dominio para caracteres Unicode sospechosos
</Warning>

#### Límites de contenido

El parámetro `max_content_tokens` limita la cantidad de contenido que se incluirá en el contexto. Si el contenido obtenido excede este límite, será truncado. Esto ayuda a controlar el uso de tokens al obtener documentos grandes.

<Note>
El límite del parámetro `max_content_tokens` es aproximado. El número real de tokens de entrada utilizados puede variar en una pequeña cantidad.
</Note>

#### Citas

A diferencia de la búsqueda web donde las citas siempre están habilitadas, las citas son opcionales para la obtención web. Establece `"citations": {"enabled": true}` para permitir que Claude cite pasajes específicos de documentos obtenidos.

<Note>
Cuando se muestran salidas de API directamente a usuarios finales, las citas deben incluirse a la fuente original. Si realizas modificaciones en las salidas de API, incluyendo reprocesamiento y/o combinación con tu propio material antes de mostrarlas a usuarios finales, muestra citas según corresponda basándote en consulta con tu equipo legal.
</Note>

### Respuesta

Aquí hay una estructura de respuesta de ejemplo:

```json
{
  "role": "assistant",
  "content": [
    // 1. Claude's decision to fetch
    {
      "type": "text",
      "text": "I'll fetch the content from the article to analyze it."
    },
    // 2. The fetch request
    {
      "type": "server_tool_use",
      "id": "srvtoolu_01234567890abcdef",
      "name": "web_fetch",
      "input": {
        "url": "https://example.com/article"
      }
    },
    // 3. Fetch results
    {
      "type": "web_fetch_tool_result",
      "tool_use_id": "srvtoolu_01234567890abcdef",
      "content": {
        "type": "web_fetch_result",
        "url": "https://example.com/article",
        "content": {
          "type": "document",
          "source": {
            "type": "text",
            "media_type": "text/plain",
            "data": "Full text content of the article..."
          },
          "title": "Article Title",
          "citations": {"enabled": true}
        },
        "retrieved_at": "2025-08-25T10:30:00Z"
      }
    },
    // 4. Claude's analysis with citations (if enabled)
    {
      "text": "Based on the article, ",
      "type": "text"
    },
    {
      "text": "the main argument presented is that artificial intelligence will transform healthcare",
      "type": "text",
      "citations": [
        {
          "type": "char_location",
          "document_index": 0,
          "document_title": "Article Title",
          "start_char_index": 1234,
          "end_char_index": 1456,
          "cited_text": "Artificial intelligence is poised to revolutionize healthcare delivery..."
        }
      ]
    }
  ],
  "id": "msg_a930390d3a",
  "usage": {
    "input_tokens": 25039,
    "output_tokens": 931,
    "server_tool_use": {
      "web_fetch_requests": 1
    }
  },
  "stop_reason": "end_turn"
}
```

#### Resultados de obtención

Los resultados de obtención incluyen:

- `url`: La URL que fue obtenida
- `content`: Un bloque de documento que contiene el contenido obtenido
- `retrieved_at`: Marca de tiempo de cuándo se recuperó el contenido

<Note>
La herramienta de obtención web almacena en caché los resultados para mejorar el rendimiento y reducir solicitudes redundantes. Esto significa que el contenido devuelto puede no ser siempre la versión más reciente disponible en la URL. El comportamiento del caché se gestiona automáticamente y puede cambiar con el tiempo para optimizar diferentes tipos de contenido y patrones de uso.
</Note>

Para documentos PDF, el contenido se devolverá como datos codificados en base64:

```json
{
  "type": "web_fetch_tool_result",
  "tool_use_id": "srvtoolu_02",
  "content": {
    "type": "web_fetch_result",
    "url": "https://example.com/paper.pdf",
    "content": {
      "type": "document",
      "source": {
        "type": "base64",
        "media_type": "application/pdf",
        "data": "JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmo..."
      },
      "citations": {"enabled": true}
    },
    "retrieved_at": "2025-08-25T10:30:02Z"
  }
}
```

#### Errores

Cuando la herramienta de obtención web encuentra un error, la API de Claude devuelve una respuesta 200 (éxito) con el error representado en el cuerpo de la respuesta:

```json
{
  "type": "web_fetch_tool_result",
  "tool_use_id": "srvtoolu_a93jad",
  "content": {
    "type": "web_fetch_tool_error",
    "error_code": "url_not_accessible"
  }
}
```

Estos son los códigos de error posibles:

- `invalid_input`: Formato de URL inválido
- `url_too_long`: La URL excede la longitud máxima (250 caracteres)
- `url_not_allowed`: URL bloqueada por reglas de filtrado de dominio y restricciones del modelo
- `url_not_accessible`: Error al obtener contenido (error HTTP)
- `too_many_requests`: Límite de velocidad excedido
- `unsupported_content_type`: Tipo de contenido no soportado (solo texto y PDF)
- `max_uses_exceeded`: Máximo de usos de la herramienta de obtención web excedido
- `unavailable`: Ocurrió un error interno

## Validación de URL

Por razones de seguridad, la herramienta de obtención web solo puede obtener URLs que han aparecido previamente en el contexto de la conversación. Esto incluye:

- URLs en mensajes de usuario
- URLs en resultados de herramientas del lado del cliente
- URLs de resultados anteriores de búsqueda web u obtención web

La herramienta no puede obtener URLs arbitrarias que Claude genere o URLs de herramientas de servidor basadas en contenedores (Ejecución de Código, Bash, etc.).

## Búsqueda y obtención combinadas

La obtención web funciona sin problemas con la búsqueda web para recopilación de información integral:

```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Find recent articles about quantum computing and analyze the most relevant one in detail"
        }
    ],
    tools=[
        {
            "type": "web_search_20250305",
            "name": "web_search",
            "max_uses": 3
        },
        {
            "type": "web_fetch_20250910",
            "name": "web_fetch",
            "max_uses": 5,
            "citations": {"enabled": True}
        }
    ],
    extra_headers={
        "anthropic-beta": "web-fetch-2025-09-10"
    }
)
```

En este flujo de trabajo, Claude:
1. Usará búsqueda web para encontrar artículos relevantes
2. Seleccionará los resultados más prometedores
3. Usará obtención web para recuperar contenido completo
4. Proporcionará análisis detallado con citas

## Almacenamiento en caché de prompts

La obtención web funciona con [almacenamiento en caché de prompts](/docs/es/build-with-claude/prompt-caching). Para habilitar el almacenamiento en caché de prompts, añade puntos de ruptura `cache_control` en tu solicitud. Los resultados de obtención en caché pueden reutilizarse en turnos de conversación.

```python
import anthropic

client = anthropic.Anthropic()

# First request with web fetch
messages = [
    {
        "role": "user",
        "content": "Analyze this research paper: https://arxiv.org/abs/2024.12345"
    }
]

response1 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=messages,
    tools=[{
        "type": "web_fetch_20250910",
        "name": "web_fetch"
    }],
    extra_headers={
        "anthropic-beta": "web-fetch-2025-09-10"
    }
)

# Add Claude's response to conversation
messages.append({
    "role": "assistant",
    "content": response1.content
})

# Second request with cache breakpoint
messages.append({
    "role": "user",
    "content": "What methodology does the paper use?",
    "cache_control": {"type": "ephemeral"}
})

response2 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=messages,
    tools=[{
        "type": "web_fetch_20250910",
        "name": "web_fetch"
    }],
    extra_headers={
        "anthropic-beta": "web-fetch-2025-09-10"
    }
)

# The second response benefits from cached fetch results
print(f"Cache read tokens: {response2.usage.get('cache_read_input_tokens', 0)}")
```

## Transmisión

Con la transmisión habilitada, los eventos de obtención son parte de la transmisión con una pausa durante la recuperación de contenido:

```javascript
event: message_start
data: {"type": "message_start", "message": {"id": "msg_abc123", "type": "message"}}

event: content_block_start
data: {"type": "content_block_start", "index": 0, "content_block": {"type": "text", "text": ""}}

// Claude's decision to fetch

event: content_block_start
data: {"type": "content_block_start", "index": 1, "content_block": {"type": "server_tool_use", "id": "srvtoolu_xyz789", "name": "web_fetch"}}

// Fetch URL streamed
event: content_block_delta
data: {"type": "content_block_delta", "index": 1, "delta": {"type": "input_json_delta", "partial_json": "{\"url\":\"https://example.com/article\"}"}}

// Pause while fetch executes

// Fetch results streamed
event: content_block_start
data: {"type": "content_block_start", "index": 2, "content_block": {"type": "web_fetch_tool_result", "tool_use_id": "srvtoolu_xyz789", "content": {"type": "web_fetch_result", "url": "https://example.com/article", "content": {"type": "document", "source": {"type": "text", "media_type": "text/plain", "data": "Article content..."}}}}}

// Claude's response continues...
```

## Solicitudes por lotes

Puedes incluir la herramienta de obtención web en la [API de Lotes de Mensajes](/docs/es/build-with-claude/batch-processing). Las llamadas de herramienta de obtención web a través de la API de Lotes de Mensajes se cotizan igual que las solicitudes de API de Mensajes regulares.

## Uso y precios

Web fetch usage has **no additional charges** beyond standard token costs:

```json
"usage": {
  "input_tokens": 25039,
  "output_tokens": 931,
  "cache_read_input_tokens": 0,
  "cache_creation_input_tokens": 0,
  "server_tool_use": {
    "web_fetch_requests": 1
  }
}
```

The web fetch tool is available on the Claude API at **no additional cost**. You only pay standard token costs for the fetched content that becomes part of your conversation context.

To protect against inadvertently fetching large content that would consume excessive tokens, use the `max_content_tokens` parameter to set appropriate limits based on your use case and budget considerations.

Example token usage for typical content:
- Average web page (10KB): ~2,500 tokens
- Large documentation page (100KB): ~25,000 tokens  
- Research paper PDF (500KB): ~125,000 tokens