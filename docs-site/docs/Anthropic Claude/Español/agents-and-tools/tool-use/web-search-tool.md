# Herramienta de búsqueda web

La herramienta de búsqueda web proporciona a Claude acceso directo a contenido web en tiempo real, permitiéndole responder preguntas con información actualizada más allá de su fecha de corte de conocimiento.

---

La herramienta de búsqueda web proporciona a Claude acceso directo a contenido web en tiempo real, permitiéndole responder preguntas con información actualizada más allá de su fecha de corte de conocimiento. Claude cita automáticamente las fuentes de los resultados de búsqueda como parte de su respuesta.

<Note>
Por favor, comuníquese a través de nuestro [formulario de comentarios](https://forms.gle/sWjBtsrNEY2oKGuE8) para compartir su experiencia con la herramienta de búsqueda web.
</Note>

## Modelos soportados

La búsqueda web está disponible en:

- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Sonnet 3.7 ([deprecated](/docs/es/about-claude/model-deprecations)) (`claude-3-7-sonnet-20250219`)
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)
- Claude Haiku 3.5 (`claude-3-5-haiku-latest`)
- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)

## Cómo funciona la búsqueda web

Cuando agrega la herramienta de búsqueda web a su solicitud de API:

1. Claude decide cuándo buscar según el mensaje.
2. La API ejecuta las búsquedas y proporciona a Claude los resultados. Este proceso puede repetirse varias veces durante una única solicitud.
3. Al final de su turno, Claude proporciona una respuesta final con fuentes citadas.

## Cómo usar la búsqueda web

<Note>
El administrador de su organización debe habilitar la búsqueda web en [Console](/settings/privacy).
</Note>

Proporcione la herramienta de búsqueda web en su solicitud de API:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 1024,
        "messages": [
            {
                "role": "user",
                "content": "What is the weather in NYC?"
            }
        ],
        "tools": [{
            "type": "web_search_20250305",
            "name": "web_search",
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
            "content": "What's the weather in NYC?"
        }
    ],
    tools=[{
        "type": "web_search_20250305",
        "name": "web_search",
        "max_uses": 5
    }]
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
        content: "What's the weather in NYC?"
      }
    ],
    tools: [{
      type: "web_search_20250305",
      name: "web_search",
      max_uses: 5
    }]
  });

  console.log(response);
}

main().catch(console.error);
```
</CodeGroup>

### Definición de herramienta

La herramienta de búsqueda web admite los siguientes parámetros:

```json JSON
{
  "type": "web_search_20250305",
  "name": "web_search",

  // Opcional: Limitar el número de búsquedas por solicitud
  "max_uses": 5,

  // Opcional: Solo incluir resultados de estos dominios
  "allowed_domains": ["example.com", "trusteddomain.org"],

  // Opcional: Nunca incluir resultados de estos dominios
  "blocked_domains": ["untrustedsource.com"],

  // Opcional: Localizar resultados de búsqueda
  "user_location": {
    "type": "approximate",
    "city": "San Francisco",
    "region": "California",
    "country": "US",
    "timezone": "America/Los_Angeles"
  }
}
```

#### Max uses

El parámetro `max_uses` limita el número de búsquedas realizadas. Si Claude intenta más búsquedas de las permitidas, el `web_search_tool_result` será un error con el código de error `max_uses_exceeded`.

#### Filtrado de dominios

Cuando use filtros de dominio:

- Los dominios no deben incluir el esquema HTTP/HTTPS (use `example.com` en lugar de `https://example.com`)
- Los subdominios se incluyen automáticamente (`example.com` cubre `docs.example.com`)
- Los subdominios específicos restringen los resultados solo a ese subdominio (`docs.example.com` devuelve solo resultados de ese subdominio, no de `example.com` o `api.example.com`)
- Se admiten subrutas y coinciden con cualquier cosa después de la ruta (`example.com/blog` coincide con `example.com/blog/post-1`)
- Puede usar `allowed_domains` o `blocked_domains`, pero no ambos en la misma solicitud.

**Soporte de comodín:**

- Solo se permite un comodín (`*`) por entrada de dominio, y debe aparecer después de la parte del dominio (en la ruta)
- Válido: `example.com/*`, `example.com/*/articles`
- Inválido: `*.example.com`, `ex*.com`, `example.com/*/news/*`

Los formatos de dominio inválidos devolverán un error de herramienta `invalid_tool_input`.

<Note>
Las restricciones de dominio a nivel de solicitud deben ser compatibles con las restricciones de dominio a nivel de organización configuradas en la Consola. Los dominios a nivel de solicitud solo pueden restringir aún más los dominios, no anular ni expandir más allá de la lista a nivel de organización. Si su solicitud incluye dominios que entran en conflicto con la configuración de la organización, la API devolverá un error de validación.
</Note>

#### Localización

El parámetro `user_location` le permite localizar los resultados de búsqueda según la ubicación de un usuario.

- `type`: El tipo de ubicación (debe ser `approximate`)
- `city`: El nombre de la ciudad
- `region`: La región o estado
- `country`: El país
- `timezone`: El [ID de zona horaria IANA](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).

### Respuesta

Aquí hay una estructura de respuesta de ejemplo:

```json
{
  "role": "assistant",
  "content": [
    // 1. Decisión de Claude de buscar
    {
      "type": "text",
      "text": "I'll search for when Claude Shannon was born."
    },
    // 2. La consulta de búsqueda utilizada
    {
      "type": "server_tool_use",
      "id": "srvtoolu_01WYG3ziw53XMcoyKL4XcZmE",
      "name": "web_search",
      "input": {
        "query": "claude shannon birth date"
      }
    },
    // 3. Resultados de búsqueda
    {
      "type": "web_search_tool_result",
      "tool_use_id": "srvtoolu_01WYG3ziw53XMcoyKL4XcZmE",
      "content": [
        {
          "type": "web_search_result",
          "url": "https://en.wikipedia.org/wiki/Claude_Shannon",
          "title": "Claude Shannon - Wikipedia",
          "encrypted_content": "EqgfCioIARgBIiQ3YTAwMjY1Mi1mZjM5LTQ1NGUtODgxNC1kNjNjNTk1ZWI3Y...",
          "page_age": "April 30, 2025"
        }
      ]
    },
    {
      "text": "Based on the search results, ",
      "type": "text"
    },
    // 4. Respuesta de Claude con citas
    {
      "text": "Claude Shannon was born on April 30, 1916, in Petoskey, Michigan",
      "type": "text",
      "citations": [
        {
          "type": "web_search_result_location",
          "url": "https://en.wikipedia.org/wiki/Claude_Shannon",
          "title": "Claude Shannon - Wikipedia",
          "encrypted_index": "Eo8BCioIAhgBIiQyYjQ0OWJmZi1lNm..",
          "cited_text": "Claude Elwood Shannon (April 30, 1916 – February 24, 2001) was an American mathematician, electrical engineer, computer scientist, cryptographer and i..."
        }
      ]
    }
  ],
  "id": "msg_a930390d3a",
  "usage": {
    "input_tokens": 6039,
    "output_tokens": 931,
    "server_tool_use": {
      "web_search_requests": 1
    }
  },
  "stop_reason": "end_turn"
}
```

#### Resultados de búsqueda

Los resultados de búsqueda incluyen:

- `url`: La URL de la página de origen
- `title`: El título de la página de origen
- `page_age`: Cuándo se actualizó por última vez el sitio
- `encrypted_content`: Contenido cifrado que debe pasarse nuevamente en conversaciones de múltiples turnos para citas

#### Citas

Las citas siempre están habilitadas para la búsqueda web, y cada `web_search_result_location` incluye:

- `url`: La URL de la fuente citada
- `title`: El título de la fuente citada
- `encrypted_index`: Una referencia que debe pasarse nuevamente para conversaciones de múltiples turnos.
- `cited_text`: Hasta 150 caracteres del contenido citado

Los campos de cita de búsqueda web `cited_text`, `title` y `url` no cuentan para el uso de tokens de entrada o salida.

<Note>
  Al mostrar las salidas de la API directamente a los usuarios finales, las citas deben incluirse a la fuente original. Si está realizando modificaciones en las salidas de la API, incluyendo reprocesamiento y/o combinación con su propio material antes de mostrarlas a los usuarios finales, muestre las citas según sea apropiado basándose en la consulta con su equipo legal.
</Note>

#### Errores

Cuando la herramienta de búsqueda web encuentra un error (como alcanzar límites de velocidad), la API de Claude aún devuelve una respuesta 200 (éxito). El error se representa dentro del cuerpo de la respuesta usando la siguiente estructura:

```json
{
  "type": "web_search_tool_result",
  "tool_use_id": "servertoolu_a93jad",
  "content": {
    "type": "web_search_tool_result_error",
    "error_code": "max_uses_exceeded"
  }
}
```

Estos son los códigos de error posibles:

- `too_many_requests`: Límite de velocidad excedido
- `invalid_input`: Parámetro de consulta de búsqueda inválido
- `max_uses_exceeded`: Usos máximos de la herramienta de búsqueda web excedidos
- `query_too_long`: La consulta excede la longitud máxima
- `unavailable`: Ocurrió un error interno

#### Razón de parada `pause_turn`

La respuesta puede incluir una razón de parada `pause_turn`, que indica que la API pausó un turno de larga duración. Puede proporcionar la respuesta tal como está en una solicitud posterior para permitir que Claude continúe su turno, o modificar el contenido si desea interrumpir la conversación.

## Almacenamiento en caché de mensajes

La búsqueda web funciona con [almacenamiento en caché de mensajes](/docs/es/build-with-claude/prompt-caching). Para habilitar el almacenamiento en caché de mensajes, agregue al menos un punto de interrupción `cache_control` en su solicitud. El sistema almacenará automáticamente en caché hasta el último bloque `web_search_tool_result` al ejecutar la herramienta.

Para conversaciones de múltiples turnos, establezca un punto de interrupción `cache_control` en o después del último bloque `web_search_tool_result` para reutilizar el contenido en caché.

Por ejemplo, para usar el almacenamiento en caché de mensajes con búsqueda web para una conversación de múltiples turnos:

<CodeGroup>
```python
import anthropic

client = anthropic.Anthropic()

# Primera solicitud con búsqueda web y punto de interrupción de caché
messages = [
    {
        "role": "user",
        "content": "What's the current weather in San Francisco today?"
    }
]

response1 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=messages,
    tools=[{
        "type": "web_search_20250305",
        "name": "web_search",
        "user_location": {
            "type": "approximate",
            "city": "San Francisco",
            "region": "California",
            "country": "US",
            "timezone": "America/Los_Angeles"
        }
    }]
)

# Agregar la respuesta de Claude a la conversación
messages.append({
    "role": "assistant",
    "content": response1.content
})

# Segunda solicitud con punto de interrupción de caché después de los resultados de búsqueda
messages.append({
    "role": "user",
    "content": "Should I expect rain later this week?",
    "cache_control": {"type": "ephemeral"}  # Almacenar en caché hasta este punto
})

response2 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=messages,
    tools=[{
        "type": "web_search_20250305",
        "name": "web_search",
        "user_location": {
            "type": "approximate",
            "city": "San Francisco",
            "region": "California",
            "country": "US",
            "timezone": "America/Los_Angeles"
        }
    }]
)
# La segunda respuesta se beneficiará de los resultados de búsqueda en caché
# mientras aún puede realizar nuevas búsquedas si es necesario
print(f"Cache read tokens: {response2.usage.get('cache_read_input_tokens', 0)}")
```

</CodeGroup>

## Transmisión

Con la transmisión habilitada, recibirá eventos de búsqueda como parte de la transmisión. Habrá una pausa mientras se ejecuta la búsqueda:

```javascript
event: message_start
data: {"type": "message_start", "message": {"id": "msg_abc123", "type": "message"}}

event: content_block_start
data: {"type": "content_block_start", "index": 0, "content_block": {"type": "text", "text": ""}}

// Decisión de Claude de buscar

event: content_block_start
data: {"type": "content_block_start", "index": 1, "content_block": {"type": "server_tool_use", "id": "srvtoolu_xyz789", "name": "web_search"}}

// Consulta de búsqueda transmitida
event: content_block_delta
data: {"type": "content_block_delta", "index": 1, "delta": {"type": "input_json_delta", "partial_json": "{\"query\":\"latest quantum computing breakthroughs 2025\"}"}}

// Pausa mientras se ejecuta la búsqueda

// Resultados de búsqueda transmitidos
event: content_block_start
data: {"type": "content_block_start", "index": 2, "content_block": {"type": "web_search_tool_result", "tool_use_id": "srvtoolu_xyz789", "content": [{"type": "web_search_result", "title": "Quantum Computing Breakthroughs in 2025", "url": "https://example.com"}]}}

// Respuesta de Claude con citas (omitida en este ejemplo)
```

## Solicitudes por lotes

Puede incluir la herramienta de búsqueda web en la [API de Lotes de Mensajes](/docs/es/build-with-claude/batch-processing). Las llamadas de herramienta de búsqueda web a través de la API de Lotes de Mensajes se cotizan igual que las de las solicitudes regulares de la API de Mensajes.

## Uso y precios

Web search usage is charged in addition to token usage:

```json
"usage": {
  "input_tokens": 105,
  "output_tokens": 6039,
  "cache_read_input_tokens": 7123,
  "cache_creation_input_tokens": 7345,
  "server_tool_use": {
    "web_search_requests": 1
  }
}
```

Web search is available on the Claude API for **$10 per 1,000 searches**, plus standard token costs for search-generated content. Web search results retrieved throughout a conversation are counted as input tokens, in search iterations executed during a single turn and in subsequent conversation turns.

Each web search counts as one use, regardless of the number of results returned. If an error occurs during web search, the web search will not be billed.