# Transmisión de Mensajes

Aprende cómo transmitir respuestas de Claude de forma incremental usando eventos enviados por el servidor (SSE).

---

Al crear un Mensaje, puedes establecer `"stream": true` para transmitir incrementalmente la respuesta usando [eventos enviados por el servidor](https://developer.mozilla.org/en-US/Web/API/Server-sent%5Fevents/Using%5Fserver-sent%5Fevents) (SSE).

## Transmisión con SDKs

Nuestros SDKs de [Python](https://github.com/anthropics/anthropic-sdk-python) y [TypeScript](https://github.com/anthropics/anthropic-sdk-typescript) ofrecen múltiples formas de transmisión. El SDK de Python permite tanto transmisiones síncronas como asíncronas. Consulta la documentación en cada SDK para obtener detalles.

<CodeGroup>
    ```python Python
    import anthropic

    client = anthropic.Anthropic()

    with client.messages.stream(
        max_tokens=1024,
        messages=[{"role": "user", "content": "Hello"}],
        model="claude-sonnet-4-5",
    ) as stream:
      for text in stream.text_stream:
          print(text, end="", flush=True)
    ```

    ```typescript TypeScript
    import Anthropic from '@anthropic-ai/sdk';

    const client = new Anthropic();

    await client.messages.stream({
        messages: [{role: 'user', content: "Hello"}],
        model: 'claude-sonnet-4-5',
        max_tokens: 1024,
    }).on('text', (text) => {
        console.log(text);
    });
    ```
</CodeGroup>

## Tipos de eventos

Cada evento enviado por el servidor incluye un tipo de evento con nombre y datos JSON asociados. Cada evento usará un nombre de evento SSE (por ejemplo, `event: message_stop`), e incluirá el `type` de evento correspondiente en sus datos.

Cada transmisión usa el siguiente flujo de eventos:

1. `message_start`: contiene un objeto `Message` con `content` vacío.
2. Una serie de bloques de contenido, cada uno de los cuales tiene un `content_block_start`, uno o más eventos `content_block_delta`, y un evento `content_block_stop`. Cada bloque de contenido tendrá un `index` que corresponde a su índice en el array `content` del Mensaje final.
3. Uno o más eventos `message_delta`, indicando cambios de nivel superior al objeto `Message` final.
4. Un evento final `message_stop`.

  <Warning>
  Los conteos de tokens mostrados en el campo `usage` del evento `message_delta` son *acumulativos*.
  </Warning>

### Eventos ping

Las transmisiones de eventos también pueden incluir cualquier número de eventos `ping`.

### Eventos de error

Ocasionalmente podemos enviar [errores](/docs/es/api/errors) en la transmisión de eventos. Por ejemplo, durante períodos de alto uso, puedes recibir un `overloaded_error`, que normalmente correspondería a un HTTP 529 en un contexto sin transmisión:

```json Example error
event: error
data: {"type": "error", "error": {"type": "overloaded_error", "message": "Overloaded"}}
```

### Otros eventos

De acuerdo con nuestra [política de versionado](/docs/es/api/versioning), podemos agregar nuevos tipos de eventos, y tu código debe manejar tipos de eventos desconocidos de manera elegante.

## Tipos de delta de bloques de contenido

Cada evento `content_block_delta` contiene un `delta` de un tipo que actualiza el bloque `content` en un `index` dado.

### Delta de texto

Un delta de bloque de contenido `text` se ve así:
```json Text delta
event: content_block_delta
data: {"type": "content_block_delta","index": 0,"delta": {"type": "text_delta", "text": "ello frien"}}
```

### Delta de JSON de entrada

Los deltas para bloques de contenido `tool_use` corresponden a actualizaciones para el campo `input` del bloque. Para soportar la máxima granularidad, los deltas son _cadenas JSON parciales_, mientras que el `tool_use.input` final siempre es un _objeto_.

Puedes acumular los deltas de cadena y analizar el JSON una vez que recibas un evento `content_block_stop`, usando una biblioteca como [Pydantic](https://docs.pydantic.dev/latest/concepts/json/#partial-json-parsing) para hacer análisis JSON parcial, o usando nuestros [SDKs](/docs/es/api/client-sdks), que proporcionan ayudantes para acceder a valores incrementales analizados.

Un delta de bloque de contenido `tool_use` se ve así:
```json Input JSON delta
event: content_block_delta
data: {"type": "content_block_delta","index": 1,"delta": {"type": "input_json_delta","partial_json": "{\"location\": \"San Fra"}}}
```
Nota: Nuestros modelos actuales solo soportan emitir una clave completa y un valor de propiedad de `input` a la vez. Como tal, al usar herramientas, puede haber retrasos entre eventos de transmisión mientras el modelo está trabajando. Una vez que se acumulan una clave y valor de `input`, los emitimos como múltiples eventos `content_block_delta` con json parcial fragmentado para que el formato pueda soportar automáticamente una granularidad más fina en modelos futuros.

### Delta de pensamiento

Al usar [pensamiento extendido](/docs/es/build-with-claude/extended-thinking#streaming-thinking) con transmisión habilitada, recibirás contenido de pensamiento a través de eventos `thinking_delta`. Estos deltas corresponden al campo `thinking` de los bloques de contenido `thinking`.

Para el contenido de pensamiento, se envía un evento especial `signature_delta` justo antes del evento `content_block_stop`. Esta firma se usa para verificar la integridad del bloque de pensamiento.

Un delta de pensamiento típico se ve así:
```json Thinking delta
event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "Let me solve this step by step:\n\n1. First break down 27 * 453"}}
```

El delta de firma se ve así:
```json Signature delta
event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "signature_delta", "signature": "EqQBCgIYAhIM1gbcDa9GJwZA2b3hGgxBdjrkzLoky3dl1pkiMOYds..."}}
```

## Respuesta completa de transmisión HTTP

Recomendamos encarecidamente que uses nuestros [SDKs de cliente](/docs/es/api/client-sdks) al usar el modo de transmisión. Sin embargo, si estás construyendo una integración directa de API, necesitarás manejar estos eventos tú mismo.

Una respuesta de transmisión está compuesta por:
1. Un evento `message_start`
2. Potencialmente múltiples bloques de contenido, cada uno de los cuales contiene:
    - Un evento `content_block_start`
    - Potencialmente múltiples eventos `content_block_delta`
    - Un evento `content_block_stop`
3. Un evento `message_delta`
4. Un evento `message_stop`

También puede haber eventos `ping` dispersos a lo largo de la respuesta. Consulta [Tipos de eventos](#tipos-de-eventos) para más detalles sobre el formato.

### Solicitud básica de transmisión

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --data \
'{
  "model": "claude-sonnet-4-5",
  "messages": [{"role": "user", "content": "Hello"}],
  "max_tokens": 256,
  "stream": true
}'
```

```python Python
import anthropic

client = anthropic.Anthropic()

with client.messages.stream(
    model="claude-sonnet-4-5",
    messages=[{"role": "user", "content": "Hello"}],
    max_tokens=256,
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```
</CodeGroup>

```json Response
event: message_start
data: {"type": "message_start", "message": {"id": "msg_1nZdL29xx5MUA1yADyHTEsnR8uuvGzszyY", "type": "message", "role": "assistant", "content": [], "model": "claude-sonnet-4-5-20250929", "stop_reason": null, "stop_sequence": null, "usage": {"input_tokens": 25, "output_tokens": 1}}}

event: content_block_start
data: {"type": "content_block_start", "index": 0, "content_block": {"type": "text", "text": ""}}

event: ping
data: {"type": "ping"}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "text_delta", "text": "Hello"}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "text_delta", "text": "!"}}

event: content_block_stop
data: {"type": "content_block_stop", "index": 0}

event: message_delta
data: {"type": "message_delta", "delta": {"stop_reason": "end_turn", "stop_sequence":null}, "usage": {"output_tokens": 15}}

event: message_stop
data: {"type": "message_stop"}

```

### Solicitud de transmisión con uso de herramientas

<Tip>
El uso de herramientas ahora soporta transmisión de grano fino para valores de parámetros como una característica beta. Para más detalles, consulta [Transmisión de herramientas de grano fino](/docs/es/agents-and-tools/tool-use/fine-grained-tool-streaming).
</Tip>

En esta solicitud, le pedimos a Claude que use una herramienta para decirnos el clima.

<CodeGroup>
```bash Shell
  curl https://api.anthropic.com/v1/messages \
    -H "content-type: application/json" \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -d '{
      "model": "claude-sonnet-4-5",
      "max_tokens": 1024,
      "tools": [
        {
          "name": "get_weather",
          "description": "Get the current weather in a given location",
          "input_schema": {
            "type": "object",
            "properties": {
              "location": {
                "type": "string",
                "description": "The city and state, e.g. San Francisco, CA"
              }
            },
            "required": ["location"]
          }
        }
      ],
      "tool_choice": {"type": "any"},
      "messages": [
        {
          "role": "user",
          "content": "What is the weather like in San Francisco?"
        }
      ],
      "stream": true
    }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

tools = [
    {
        "name": "get_weather",
        "description": "Get the current weather in a given location",
        "input_schema": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "The city and state, e.g. San Francisco, CA"
                }
            },
            "required": ["location"]
        }
    }
]

with client.messages.stream(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=tools,
    tool_choice={"type": "any"},
    messages=[
        {
            "role": "user",
            "content": "What is the weather like in San Francisco?"
        }
    ],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```
</CodeGroup>

```json Response
event: message_start
data: {"type":"message_start","message":{"id":"msg_014p7gG3wDgGV9EUtLvnow3U","type":"message","role":"assistant","model":"claude-sonnet-4-5-20250929","stop_sequence":null,"usage":{"input_tokens":472,"output_tokens":2},"content":[],"stop_reason":null}}

event: content_block_start
data: {"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}

event: ping
data: {"type": "ping"}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"Okay"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":","}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" let"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"'s"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" check"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" the"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" weather"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" for"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" San"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" Francisco"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":","}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" CA"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":":"}}

event: content_block_stop
data: {"type":"content_block_stop","index":0}

event: content_block_start
data: {"type":"content_block_start","index":1,"content_block":{"type":"tool_use","id":"toolu_01T1x1fJ34qAmk2tNTrN7Up6","name":"get_weather","input":{}}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":""}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"{\"location\":"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":" \"San"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":" Francisc"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"o,"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":" CA\""}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":", "}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"\"unit\": \"fah"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"renheit\"}"}}

event: content_block_stop
data: {"type":"content_block_stop","index":1}

event: message_delta
data: {"type":"message_delta","delta":{"stop_reason":"tool_use","stop_sequence":null},"usage":{"output_tokens":89}}

event: message_stop
data: {"type":"message_stop"}
```

### Solicitud de transmisión con pensamiento extendido

En esta solicitud, habilitamos el pensamiento extendido con transmisión para ver el razonamiento paso a paso de Claude.

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 20000,
    "stream": true,
    "thinking": {
        "type": "enabled",
        "budget_tokens": 16000
    },
    "messages": [
        {
            "role": "user",
            "content": "What is 27 * 453?"
        }
    ]
}'
```

```python Python
import anthropic

client = anthropic.Anthropic()

with client.messages.stream(
    model="claude-sonnet-4-5",
    max_tokens=20000,
    thinking={
        "type": "enabled",
        "budget_tokens": 16000
    },
    messages=[
        {
            "role": "user",
            "content": "What is 27 * 453?"
        }
    ],
) as stream:
    for event in stream:
        if event.type == "content_block_delta":
            if event.delta.type == "thinking_delta":
                print(event.delta.thinking, end="", flush=True)
            elif event.delta.type == "text_delta":
                print(event.delta.text, end="", flush=True)
```
</CodeGroup>

```json Response
event: message_start
data: {"type": "message_start", "message": {"id": "msg_01...", "type": "message", "role": "assistant", "content": [], "model": "claude-sonnet-4-5-20250929", "stop_reason": null, "stop_sequence": null}}

event: content_block_start
data: {"type": "content_block_start", "index": 0, "content_block": {"type": "thinking", "thinking": ""}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "Let me solve this step by step:\n\n1. First break down 27 * 453"}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "\n2. 453 = 400 + 50 + 3"}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "\n3. 27 * 400 = 10,800"}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "\n4. 27 * 50 = 1,350"}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "\n5. 27 * 3 = 81"}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "\n6. 10,800 + 1,350 + 81 = 12,231"}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "signature_delta", "signature": "EqQBCgIYAhIM1gbcDa9GJwZA2b3hGgxBdjrkzLoky3dl1pkiMOYds..."}}

event: content_block_stop
data: {"type": "content_block_stop", "index": 0}

event: content_block_start
data: {"type": "content_block_start", "index": 1, "content_block": {"type": "text", "text": ""}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 1, "delta": {"type": "text_delta", "text": "27 * 453 = 12,231"}}

event: content_block_stop
data: {"type": "content_block_stop", "index": 1}

event: message_delta
data: {"type": "message_delta", "delta": {"stop_reason": "end_turn", "stop_sequence": null}}

event: message_stop
data: {"type": "message_stop"}
```

### Solicitud de transmisión con uso de herramienta de búsqueda web

En esta solicitud, le pedimos a Claude que busque en la web información actual del clima.

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "stream": true,
    "tools": [
        {
            "type": "web_search_20250305",
            "name": "web_search",
            "max_uses": 5
        }
    ],
    "messages": [
        {
            "role": "user",
            "content": "What is the weather like in New York City today?"
        }
    ]
}'
```

```python Python
import anthrop

client = anthropic.Anthropic()

with client.messages.stream(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[
        {
            "type": "web_search_20250305",
            "name": "web_search",
            "max_uses": 5
        }
    ],
    messages=[
        {
            "role": "user",
            "content": "What is the weather like in New York City today?"
        }
    ],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```
</CodeGroup>

```json Response
event: message_start
data: {"type":"message_start","message":{"id":"msg_01G...","type":"message","role":"assistant","model":"claude-sonnet-4-5-20250929","content":[],"stop_reason":null,"stop_sequence":null,"usage":{"input_tokens":2679,"cache_creation_input_tokens":0,"cache_read_input_tokens":0,"output_tokens":3}}}

event: content_block_start
data: {"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"I'll check"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" the current weather in New York City for you"}}

event: ping
data: {"type": "ping"}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"."}}

event: content_block_stop
data: {"type":"content_block_stop","index":0}

event: content_block_start
data: {"type":"content_block_start","index":1,"content_block":{"type":"server_tool_use","id":"srvtoolu_014hJH82Qum7Td6UV8gDXThB","name":"web_search","input":{}}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":""}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"{\"query"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"\":"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":" \"weather"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":" NY"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"C to"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"day\"}"}}

event: content_block_stop
data: {"type":"content_block_stop","index":1 }

event: content_block_start
data: {"type":"content_block_start","index":2,"content_block":{"type":"web_search_tool_result","tool_use_id":"srvtoolu_014hJH82Qum7Td6UV8gDXThB","content":[{"type":"web_search_result","title":"Weather in New York City in May 2025 (New York) - detailed Weather Forecast for a month","url":"https://world-weather.info/forecast/usa/new_york/may-2025/","encrypted_content":"Ev0DCioIAxgCIiQ3NmU4ZmI4OC1k...","page_age":null},...]}}

event: content_block_stop
data: {"type":"content_block_stop","index":2}

event: content_block_start
data: {"type":"content_block_start","index":3,"content_block":{"type":"text","text":""}}

event: content_block_delta
data: {"type":"content_block_delta","index":3,"delta":{"type":"text_delta","text":"Here's the current weather information for New York"}}

event: content_block_delta
data: {"type":"content_block_delta","index":3,"delta":{"type":"text_delta","text":" City:\n\n# Weather"}}

event: content_block_delta
data: {"type":"content_block_delta","index":3,"delta":{"type":"text_delta","text":" in New York City"}}

event: content_block_delta
data: {"type":"content_block_delta","index":3,"delta":{"type":"text_delta","text":"\n\n"}}

...

event: content_block_stop
data: {"type":"content_block_stop","index":17}

event: message_delta
data: {"type":"message_delta","delta":{"stop_reason":"end_turn","stop_sequence":null},"usage":{"input_tokens":10682,"cache_creation_input_tokens":0,"cache_read_input_tokens":0,"output_tokens":510,"server_tool_use":{"web_search_requests":1}}}

event: message_stop
data: {"type":"message_stop"}
```

## Recuperación de errores

Cuando una solicitud de transmisión se interrumpe debido a problemas de red, tiempos de espera u otros errores, puedes recuperarte reanudando desde donde se interrumpió la transmisión. Este enfoque te ahorra tener que reprocesar toda la respuesta.

La estrategia básica de recuperación involucra:

1. **Capturar la respuesta parcial**: Guarda todo el contenido que se recibió exitosamente antes de que ocurriera el error
2. **Construir una solicitud de continuación**: Crea una nueva solicitud de API que incluya la respuesta parcial del asistente como el comienzo de un nuevo mensaje del asistente
3. **Reanudar la transmisión**: Continúa recibiendo el resto de la respuesta desde donde se interrumpió

### Mejores prácticas para la recuperación de errores

1. **Usar características del SDK**: Aprovecha las capacidades integradas de acumulación de mensajes y manejo de errores del SDK
2. **Manejar tipos de contenido**: Ten en cuenta que los mensajes pueden contener múltiples bloques de contenido (`text`, `tool_use`, `thinking`). Los bloques de uso de herramientas y pensamiento extendido no pueden recuperarse parcialmente. Puedes reanudar la transmisión desde el bloque de texto más reciente.