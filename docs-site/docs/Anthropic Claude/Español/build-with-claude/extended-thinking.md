# Construir con pensamiento extendido

El pensamiento extendido proporciona a Claude capacidades de razonamiento mejoradas para tareas complejas, con varios niveles de transparencia en su proceso de pensamiento paso a paso.

---

El pensamiento extendido proporciona a Claude capacidades de razonamiento mejoradas para tareas complejas, mientras proporciona varios niveles de transparencia en su proceso de pensamiento paso a paso antes de entregar su respuesta final.

## Modelos compatibles

El pensamiento extendido es compatible con los siguientes modelos:

- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Sonnet 3.7 (`claude-3-7-sonnet-20250219`) ([obsoleto](/docs/es/about-claude/model-deprecations))
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)
- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)

<Note>
El comportamiento de la API difiere entre los modelos Claude Sonnet 3.7 y Claude 4, pero las formas de la API siguen siendo exactamente iguales.

Para obtener más información, consulte [Diferencias en el pensamiento entre versiones de modelos](#differences-in-thinking-across-model-versions).
</Note>

## Cómo funciona el pensamiento extendido

Cuando el pensamiento extendido está activado, Claude crea bloques de contenido `thinking` donde genera su razonamiento interno. Claude incorpora información de este razonamiento antes de elaborar una respuesta final.

La respuesta de la API incluirá bloques de contenido `thinking`, seguidos de bloques de contenido `text`.

Aquí hay un ejemplo del formato de respuesta predeterminado:

```json
{
  "content": [
    {
      "type": "thinking",
      "thinking": "Let me analyze this step by step...",
      "signature": "WaUjzkypQ2mUEVM36O2TxuC06KN8xyfbJwyem2dw3URve/op91XWHOEBLLqIOMfFG/UvLEczmEsUjavL...."
    },
    {
      "type": "text",
      "text": "Based on my analysis..."
    }
  ]
}
```

Para obtener más información sobre el formato de respuesta del pensamiento extendido, consulte la [Referencia de la API de Mensajes](/docs/es/api/messages).

## Cómo usar el pensamiento extendido

Aquí hay un ejemplo de uso del pensamiento extendido en la API de Mensajes:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 16000,
    "thinking": {
        "type": "enabled",
        "budget_tokens": 10000
    },
    "messages": [
        {
            "role": "user",
            "content": "Are there an infinite number of prime numbers such that n mod 4 == 3?"
        }
    ]
}'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    messages=[{
        "role": "user",
        "content": "Are there an infinite number of prime numbers such that n mod 4 == 3?"
    }]
)

# The response will contain summarized thinking blocks and text blocks
for block in response.content:
    if block.type == "thinking":
        print(f"\nThinking summary: {block.thinking}")
    elif block.type == "text":
        print(f"\nResponse: {block.text}")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 16000,
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  messages: [{
    role: "user",
    content: "Are there an infinite number of prime numbers such that n mod 4 == 3?"
  }]
});

// The response will contain summarized thinking blocks and text blocks
for (const block of response.content) {
  if (block.type === "thinking") {
    console.log(`\nThinking summary: ${block.thinking}`);
  } else if (block.type === "text") {
    console.log(`\nResponse: ${block.text}`);
  }
}
```

```java Java
import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.beta.messages.*;
import com.anthropic.models.beta.messages.MessageCreateParams;
import com.anthropic.models.messages.*;

public class SimpleThinkingExample {
    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        BetaMessage response = client.beta().messages().create(
                MessageCreateParams.builder()
                        .model(Model.CLAUDE_OPUS_4_0)
                        .maxTokens(16000)
                        .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(10000).build())
                        .addUserMessage("Are there an infinite number of prime numbers such that n mod 4 == 3?")
                        .build()
        );

        System.out.println(response);
    }
}
```

</CodeGroup>

Para activar el pensamiento extendido, agregue un objeto `thinking`, con el parámetro `type` establecido en `enabled` y `budget_tokens` en un presupuesto de tokens especificado para el pensamiento extendido.

El parámetro `budget_tokens` determina el número máximo de tokens que Claude puede usar para su proceso de razonamiento interno. En los modelos Claude 4, este límite se aplica a los tokens de pensamiento completo, y no a [la salida resumida](#summarized-thinking). Los presupuestos más grandes pueden mejorar la calidad de la respuesta al permitir un análisis más exhaustivo para problemas complejos, aunque Claude puede no usar todo el presupuesto asignado, especialmente en rangos superiores a 32k.

`budget_tokens` debe establecerse en un valor menor que `max_tokens`. Sin embargo, cuando se usa [pensamiento intercalado con herramientas](#interleaved-thinking), puede exceder este límite ya que el límite de tokens se convierte en su ventana de contexto completa (200k tokens).

### Pensamiento resumido

Con el pensamiento extendido habilitado, la API de Mensajes para los modelos Claude 4 devuelve un resumen del proceso de pensamiento completo de Claude. El pensamiento resumido proporciona los beneficios de inteligencia completa del pensamiento extendido, mientras previene el mal uso.

Aquí hay algunas consideraciones importantes para el pensamiento resumido:

- Se le cobra por los tokens de pensamiento completo generados por la solicitud original, no por los tokens de resumen.
- El recuento de tokens de salida facturados **no coincidirá** con el recuento de tokens que ve en la respuesta.
- Las primeras líneas de la salida de pensamiento son más detalladas, proporcionando razonamiento detallado que es particularmente útil para propósitos de ingeniería de prompts.
- A medida que Anthropic busca mejorar la característica de pensamiento extendido, el comportamiento de resumen está sujeto a cambios.
- La resumen preserva las ideas clave del proceso de pensamiento de Claude con latencia mínima agregada, permitiendo una experiencia de usuario transmisible y migración fácil de Claude Sonnet 3.7 a modelos Claude 4.
- La resumen es procesada por un modelo diferente al que apunta en sus solicitudes. El modelo de pensamiento no ve la salida resumida.

<Note>
Claude Sonnet 3.7 continúa devolviendo la salida de pensamiento completo.

En casos raros donde necesita acceso a la salida de pensamiento completo para modelos Claude 4, [póngase en contacto con nuestro equipo de ventas](mailto:sales@anthropic.com).
</Note>

### Pensamiento en streaming

Puede transmitir respuestas de pensamiento extendido usando [eventos enviados por servidor (SSE)](https://developer.mozilla.org/en-US/Web/API/Server-sent%5Fevents/Using%5Fserver-sent%5Fevents).

Cuando el streaming está habilitado para el pensamiento extendido, recibe contenido de pensamiento a través de eventos `thinking_delta`.

Para obtener más documentación sobre streaming a través de la API de Mensajes, consulte [Streaming de Mensajes](/docs/es/build-with-claude/streaming).

Aquí se explica cómo manejar el streaming con pensamiento:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 16000,
    "stream": true,
    "thinking": {
        "type": "enabled",
        "budget_tokens": 10000
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
    max_tokens=16000,
    thinking={"type": "enabled", "budget_tokens": 10000},
    messages=[{"role": "user", "content": "What is 27 * 453?"}],
) as stream:
    thinking_started = False
    response_started = False

    for event in stream:
        if event.type == "content_block_start":
            print(f"\nStarting {event.content_block.type} block...")
            # Reset flags for each new block
            thinking_started = False
            response_started = False
        elif event.type == "content_block_delta":
            if event.delta.type == "thinking_delta":
                if not thinking_started:
                    print("Thinking: ", end="", flush=True)
                    thinking_started = True
                print(event.delta.thinking, end="", flush=True)
            elif event.delta.type == "text_delta":
                if not response_started:
                    print("Response: ", end="", flush=True)
                    response_started = True
                print(event.delta.text, end="", flush=True)
        elif event.type == "content_block_stop":
            print("\nBlock complete.")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const stream = await client.messages.stream({
  model: "claude-sonnet-4-5",
  max_tokens: 16000,
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  messages: [{
    role: "user",
    content: "What is 27 * 453?"
  }]
});

let thinkingStarted = false;
let responseStarted = false;

for await (const event of stream) {
  if (event.type === 'content_block_start') {
    console.log(`\nStarting ${event.content_block.type} block...`);
    // Reset flags for each new block
    thinkingStarted = false;
    responseStarted = false;
  } else if (event.type === 'content_block_delta') {
    if (event.delta.type === 'thinking_delta') {
      if (!thinkingStarted) {
        process.stdout.write('Thinking: ');
        thinkingStarted = true;
      }
      process.stdout.write(event.delta.thinking);
    } else if (event.delta.type === 'text_delta') {
      if (!responseStarted) {
        process.stdout.write('Response: ');
        responseStarted = true;
      }
      process.stdout.write(event.delta.text);
    }
  } else if (event.type === 'content_block_stop') {
    console.log('\nBlock complete.');
  }
}
```

```java Java
import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.http.StreamResponse;
import com.anthropic.models.beta.messages.MessageCreateParams;
import com.anthropic.models.beta.messages.BetaRawMessageStreamEvent;
import com.anthropic.models.beta.messages.BetaThinkingConfigEnabled;
import com.anthropic.models.messages.Model;

public class SimpleThinkingStreamingExample {
    private static boolean thinkingStarted = false;
    private static boolean responseStarted = false;
    
    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        MessageCreateParams createParams = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_0)
                .maxTokens(16000)
                .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(10000).build())
                .addUserMessage("What is 27 * 453?")
                .build();

        try (StreamResponse<BetaRawMessageStreamEvent> streamResponse =
                     client.beta().messages().createStreaming(createParams)) {
            streamResponse.stream()
                    .forEach(event -> {
                        if (event.isContentBlockStart()) {
                            System.out.printf("\nStarting %s block...%n",
                                    event.asContentBlockStart()._type());
                            // Reset flags for each new block
                            thinkingStarted = false;
                            responseStarted = false;
                        } else if (event.isContentBlockDelta()) {
                            var delta = event.asContentBlockDelta().delta();
                            if (delta.isBetaThinking()) {
                                if (!thinkingStarted) {
                                    System.out.print("Thinking: ");
                                    thinkingStarted = true;
                                }
                                System.out.print(delta.asBetaThinking().thinking());
                                System.out.flush();
                            } else if (delta.isBetaText()) {
                                if (!responseStarted) {
                                    System.out.print("Response: ");
                                    responseStarted = true;
                                }
                                System.out.print(delta.asBetaText().text());
                                System.out.flush();
                            }
                        } else if (event.isContentBlockStop()) {
                            System.out.println("\nBlock complete.");
                        }
                    });
        }
    }
}
```

</CodeGroup>

<TryInConsoleButton userPrompt="What is 27 * 453?" thinkingBudgetTokens={16000}>
  Prueba en la consola
</TryInConsoleButton>

Ejemplo de salida de streaming:
```json
event: message_start
data: {"type": "message_start", "message": {"id": "msg_01...", "type": "message", "role": "assistant", "content": [], "model": "claude-sonnet-4-5", "stop_reason": null, "stop_sequence": null}}

event: content_block_start
data: {"type": "content_block_start", "index": 0, "content_block": {"type": "thinking", "thinking": ""}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "Let me solve this step by step:\n\n1. First break down 27 * 453"}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "\n2. 453 = 400 + 50 + 3"}}

// Additional thinking deltas...

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "signature_delta", "signature": "EqQBCgIYAhIM1gbcDa9GJwZA2b3hGgxBdjrkzLoky3dl1pkiMOYds..."}}

event: content_block_stop
data: {"type": "content_block_stop", "index": 0}

event: content_block_start
data: {"type": "content_block_start", "index": 1, "content_block": {"type": "text", "text": ""}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 1, "delta": {"type": "text_delta", "text": "27 * 453 = 12,231"}}

// Additional text deltas...

event: content_block_stop
data: {"type": "content_block_stop", "index": 1}

event: message_delta
data: {"type": "message_delta", "delta": {"stop_reason": "end_turn", "stop_sequence": null}}

event: message_stop
data: {"type": "message_stop"}
```

<Note>
Cuando se usa streaming con pensamiento habilitado, puede notar que el texto a veces llega en fragmentos más grandes alternando con entrega token por token. Este es el comportamiento esperado, especialmente para contenido de pensamiento.

El sistema de streaming necesita procesar contenido en lotes para un rendimiento óptimo, lo que puede resultar en este patrón de entrega "fragmentada", con posibles retrasos entre eventos de streaming. Estamos trabajando continuamente para mejorar esta experiencia, con futuras actualizaciones enfocadas en hacer que el contenido de pensamiento se transmita más suavemente.
</Note>

## Pensamiento extendido con uso de herramientas

El pensamiento extendido se puede usar junto con [uso de herramientas](/docs/es/agents-and-tools/tool-use/overview), permitiendo a Claude razonar a través de la selección de herramientas y el procesamiento de resultados.

Cuando se usa pensamiento extendido con uso de herramientas, tenga en cuenta las siguientes limitaciones:

1. **Limitación de elección de herramienta**: El uso de herramientas con pensamiento solo admite `tool_choice: {"type": "auto"}` (el predeterminado) o `tool_choice: {"type": "none"}`. Usar `tool_choice: {"type": "any"}` o `tool_choice: {"type": "tool", "name": "..."}` resultará en un error porque estas opciones fuerzan el uso de herramientas, que es incompatible con el pensamiento extendido.

2. **Preservación de bloques de pensamiento**: Durante el uso de herramientas, debe pasar bloques `thinking` de vuelta a la API para el último mensaje del asistente. Incluya el bloque completo sin modificar de vuelta a la API para mantener la continuidad del razonamiento.

### Alternancia de modos de pensamiento en conversaciones

No puede alternar el pensamiento en medio de un turno del asistente, incluido durante bucles de uso de herramientas. El turno completo del asistente debe operar en un único modo de pensamiento:

- **Si el pensamiento está habilitado**, el turno final del asistente debe comenzar con un bloque de pensamiento.
- **Si el pensamiento está deshabilitado**, el turno final del asistente no debe contener ningún bloque de pensamiento

Desde la perspectiva del modelo, **los bucles de uso de herramientas son parte del turno del asistente**. Un turno del asistente no se completa hasta que Claude termina su respuesta completa, que puede incluir múltiples llamadas de herramientas y resultados.

Por ejemplo, esta secuencia es toda parte de un **único turno del asistente**:
```
User: "What's the weather in Paris?"
Assistant: [thinking] + [tool_use: get_weather]
User: [tool_result: "20°C, sunny"]
Assistant: [text: "The weather in Paris is 20°C and sunny"]
```

Aunque hay múltiples mensajes de API, el bucle de uso de herramientas es conceptualmente parte de una respuesta continua del asistente.

#### Escenarios de error comunes

Puede encontrar este error:
```
Expected `thinking` or `redacted_thinking`, but found `tool_use`.
When `thinking` is enabled, a final `assistant` message must start
with a thinking block (preceding the lastmost set of `tool_use` and
`tool_result` blocks).
```

Esto típicamente ocurre cuando:
1. Tenía pensamiento **deshabilitado** durante una secuencia de uso de herramientas
2. Desea habilitar el pensamiento nuevamente
3. Su último mensaje del asistente contiene bloques de uso de herramientas pero sin bloque de pensamiento

#### Orientación práctica

**✗ Inválido: Alternancia de pensamiento inmediatamente después del uso de herramientas**
```
User: "What's the weather?"
Assistant: [tool_use] (thinking disabled)
User: [tool_result]
// Cannot enable thinking here - still in the same assistant turn
```

**✓ Válido: Completar el turno del asistente primero**
```
User: "What's the weather?"
Assistant: [tool_use] (thinking disabled)
User: [tool_result]
Assistant: [text: "It's sunny"] 
User: "What about tomorrow?" (thinking disabled)
Assistant: [thinking] + [text: "..."] (thinking enabled - new turn)
```

**Mejor práctica**: Planifique su estrategia de pensamiento al inicio de cada turno en lugar de intentar alternar a mitad de turno.

<Note>
La alternancia de modos de pensamiento también invalida el almacenamiento en caché de prompts para el historial de mensajes. Para obtener más detalles, consulte la sección [Pensamiento extendido con almacenamiento en caché de prompts](#extended-thinking-with-prompt-caching).
</Note>

<section title="Ejemplo: Pasar bloques de pensamiento con resultados de herramientas">

Aquí hay un ejemplo práctico que muestra cómo preservar bloques de pensamiento al proporcionar resultados de herramientas:

<CodeGroup>
```python Python
weather_tool = {
    "name": "get_weather",
    "description": "Get current weather for a location",
    "input_schema": {
        "type": "object",
        "properties": {
            "location": {"type": "string"}
        },
        "required": ["location"]
    }
}

# First request - Claude responds with thinking and tool request
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    tools=[weather_tool],
    messages=[
        {"role": "user", "content": "What's the weather in Paris?"}
    ]
)
```

```typescript TypeScript
const weatherTool = {
  name: "get_weather",
  description: "Get current weather for a location",
  input_schema: {
    type: "object",
    properties: {
      location: { type: "string" }
    },
    required: ["location"]
  }
};

// First request - Claude responds with thinking and tool request
const response = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 16000,
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  tools: [weatherTool],
  messages: [
    { role: "user", content: "What's the weather in Paris?" }
  ]
});
```

```java Java
import java.util.List;
import java.util.Map;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.JsonValue;
import com.anthropic.models.beta.messages.BetaMessage;
import com.anthropic.models.beta.messages.MessageCreateParams;
import com.anthropic.models.beta.messages.BetaThinkingConfigEnabled;
import com.anthropic.models.beta.messages.BetaTool;
import com.anthropic.models.beta.messages.BetaTool.InputSchema;
import com.anthropic.models.messages.Model;

public class ThinkingWithToolsExample {
    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        InputSchema schema = InputSchema.builder()
                .properties(JsonValue.from(Map.of(
                        "location", Map.of("type", "string")
                )))
                .putAdditionalProperty("required", JsonValue.from(List.of("location")))
                .build();

        BetaTool weatherTool = BetaTool.builder()
                .name("get_weather")
                .description("Get current weather for a location")
                .inputSchema(schema)
                .build();

        BetaMessage response = client.beta().messages().create(
                MessageCreateParams.builder()
                        .model(Model.CLAUDE_OPUS_4_0)
                        .maxTokens(16000)
                        .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(10000).build())
                        .addTool(weatherTool)
                        .addUserMessage("What's the weather in Paris?")
                        .build()
        );

        System.out.println(response);
    }
}
```
</CodeGroup>

La respuesta de la API incluirá bloques de pensamiento, texto y tool_use:

```json
{
    "content": [
        {
            "type": "thinking",
            "thinking": "The user wants to know the current weather in Paris. I have access to a function `get_weather`...",
            "signature": "BDaL4VrbR2Oj0hO4XpJxT28J5TILnCrrUXoKiiNBZW9P+nr8XSj1zuZzAl4egiCCpQNvfyUuFFJP5CncdYZEQPPmLxYsNrcs...."
        },
        {
            "type": "text",
            "text": "I can help you get the current weather information for Paris. Let me check that for you"
        },
        {
            "type": "tool_use",
            "id": "toolu_01CswdEQBMshySk6Y9DFKrfq",
            "name": "get_weather",
            "input": {
                "location": "Paris"
            }
        }
    ]
}
```

Ahora continuemos la conversación y usemos la herramienta

<CodeGroup>
```python Python
# Extract thinking block and tool use block
thinking_block = next((block for block in response.content
                      if block.type == 'thinking'), None)
tool_use_block = next((block for block in response.content
                      if block.type == 'tool_use'), None)

# Call your actual weather API, here is where your actual API call would go
# let's pretend this is what we get back
weather_data = {"temperature": 88}

# Second request - Include thinking block and tool result
# No new thinking blocks will be generated in the response
continuation = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    tools=[weather_tool],
    messages=[
        {"role": "user", "content": "What's the weather in Paris?"},
        # notice that the thinking_block is passed in as well as the tool_use_block
        # if this is not passed in, an error is raised
        {"role": "assistant", "content": [thinking_block, tool_use_block]},
        {"role": "user", "content": [{
            "type": "tool_result",
            "tool_use_id": tool_use_block.id,
            "content": f"Current temperature: {weather_data['temperature']}°F"
        }]}
    ]
)
```

```typescript TypeScript
// Extract thinking block and tool use block
const thinkingBlock = response.content.find(block =>
  block.type === 'thinking');
const toolUseBlock = response.content.find(block =>
  block.type === 'tool_use');

// Call your actual weather API, here is where your actual API call would go
// let's pretend this is what we get back
const weatherData = { temperature: 88 };

// Second request - Include thinking block and tool result
// No new thinking blocks will be generated in the response
const continuation = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 16000,
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  tools: [weatherTool],
  messages: [
    { role: "user", content: "What's the weather in Paris?" },
    // notice that the thinkingBlock is passed in as well as the toolUseBlock
    // if this is not passed in, an error is raised
    { role: "assistant", content: [thinkingBlock, toolUseBlock] },
    { role: "user", content: [{
      type: "tool_result",
      tool_use_id: toolUseBlock.id,
      content: `Current temperature: ${weatherData.temperature}°F`
    }]}
  ]
});
```

```java Java
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.JsonValue;
import com.anthropic.models.beta.messages.*;
import com.anthropic.models.beta.messages.BetaTool.InputSchema;
import com.anthropic.models.messages.Model;

public class ThinkingToolsResultExample {
    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        InputSchema schema = InputSchema.builder()
                .properties(JsonValue.from(Map.of(
                        "location", Map.of("type", "string")
                )))
                .putAdditionalProperty("required", JsonValue.from(List.of("location")))
                .build();

        BetaTool weatherTool = BetaTool.builder()
                .name("get_weather")
                .description("Get current weather for a location")
                .inputSchema(schema)
                .build();

        BetaMessage response = client.beta().messages().create(
                MessageCreateParams.builder()
                        .model(Model.CLAUDE_OPUS_4_0)
                        .maxTokens(16000)
                        .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(10000).build())
                        .addTool(weatherTool)
                        .addUserMessage("What's the weather in Paris?")
                        .build()
        );

        // Extract thinking block and tool use block
        Optional<BetaThinkingBlock> thinkingBlockOpt = response.content().stream()
                .filter(BetaContentBlock::isThinking)
                .map(BetaContentBlock::asThinking)
                .findFirst();

        Optional<BetaToolUseBlock> toolUseBlockOpt = response.content().stream()
                .filter(BetaContentBlock::isToolUse)
                .map(BetaContentBlock::asToolUse)
                .findFirst();

        if (thinkingBlockOpt.isPresent() && toolUseBlockOpt.isPresent()) {
            BetaThinkingBlock thinkingBlock = thinkingBlockOpt.get();
            BetaToolUseBlock toolUseBlock = toolUseBlockOpt.get();

            // Call your actual weather API, here is where your actual API call would go
            // let's pretend this is what we get back
            Map<String, Object> weatherData = Map.of("temperature", 88);

            // Second request - Include thinking block and tool result
            // No new thinking blocks will be generated in the response
            BetaMessage continuation = client.beta().messages().create(
                    MessageCreateParams.builder()
                            .model(Model.CLAUDE_OPUS_4_0)
                            .maxTokens(16000)
                            .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(10000).build())
                            .addTool(weatherTool)
                            .addUserMessage("What's the weather in Paris?")
                            .addAssistantMessageOfBetaContentBlockParams(
                                    // notice that the thinkingBlock is passed in as well as the toolUseBlock
                                    // if this is not passed in, an error is raised
                                    List.of(
                                            BetaContentBlockParam.ofThinking(thinkingBlock.toParam()),
                                            BetaContentBlockParam.ofToolUse(toolUseBlock.toParam())
                                    )
                            )
                            .addUserMessageOfBetaContentBlockParams(List.of(
                                    BetaContentBlockParam.ofToolResult(
                                            BetaToolResultBlockParam.builder()
                                                    .toolUseId(toolUseBlock.id())
                                                    .content(String.format("Current temperature: %d°F", (Integer)weatherData.get("temperature")))
                                                    .build()
                                    )
                            ))
                            .build()
            );

            System.out.println(continuation);
        }
    }
}
```
</CodeGroup>

La respuesta de la API ahora **solo** incluirá texto

```json
{
    "content": [
        {
            "type": "text",
            "text": "Currently in Paris, the temperature is 88°F (31°C)"
        }
    ]
}
```

</section>

### Preservación de bloques de pensamiento

Durante el uso de herramientas, debe pasar bloques `thinking` de vuelta a la API, y debe incluir el bloque completo sin modificar de vuelta a la API. Esto es crítico para mantener el flujo de razonamiento del modelo e integridad de la conversación.

<Tip>
Aunque puede omitir bloques `thinking` de turnos anteriores del `assistant`, sugerimos siempre pasar de vuelta todos los bloques de pensamiento a la API para cualquier conversación de múltiples turnos. La API:
- Filtrará automáticamente los bloques de pensamiento proporcionados
- Usará los bloques de pensamiento relevantes necesarios para preservar el razonamiento del modelo
- Solo facturará los tokens de entrada para los bloques mostrados a Claude
</Tip>

<Note>
Cuando alterna modos de pensamiento durante una conversación, recuerde que el turno completo del asistente (incluidos bucles de uso de herramientas) debe operar en un único modo de pensamiento. Para obtener más detalles, consulte [Alternancia de modos de pensamiento en conversaciones](#toggling-thinking-modes-in-conversations).
</Note>

Cuando Claude invoca herramientas, está pausando su construcción de una respuesta para esperar información externa. Cuando se devuelven resultados de herramientas, Claude continuará construyendo esa respuesta existente. Esto requiere preservar bloques de pensamiento durante el uso de herramientas, por un par de razones:

1. **Continuidad del razonamiento**: Los bloques de pensamiento capturan el razonamiento paso a paso de Claude que condujo a solicitudes de herramientas. Cuando publica resultados de herramientas, incluir el pensamiento original asegura que Claude pueda continuar su razonamiento desde donde se quedó.

2. **Mantenimiento del contexto**: Aunque los resultados de herramientas aparecen como mensajes de usuario en la estructura de la API, son parte de un flujo de razonamiento continuo. Preservar bloques de pensamiento mantiene este flujo conceptual a través de múltiples llamadas de API. Para obtener más información sobre la gestión del contexto, consulte nuestra [guía sobre ventanas de contexto](/docs/es/build-with-claude/context-windows).

**Importante**: Cuando proporciona bloques `thinking`, la secuencia completa de bloques `thinking` consecutivos debe coincidir con las salidas generadas por el modelo durante la solicitud original; no puede reorganizar o modificar la secuencia de estos bloques.

### Pensamiento intercalado

El pensamiento extendido con uso de herramientas en modelos Claude 4 admite pensamiento intercalado, que permite a Claude pensar entre llamadas de herramientas y hacer un razonamiento más sofisticado después de recibir resultados de herramientas.

Con pensamiento intercalado, Claude puede:
- Razonar sobre los resultados de una llamada de herramienta antes de decidir qué hacer a continuación
- Encadenar múltiples llamadas de herramientas con pasos de razonamiento en medio
- Tomar decisiones más matizadas basadas en resultados intermedios

Para habilitar el pensamiento intercalado, agregue [el encabezado beta](/docs/es/api/beta-headers) `interleaved-thinking-2025-05-14` a su solicitud de API.

Aquí hay algunas consideraciones importantes para el pensamiento intercalado:
- Con pensamiento intercalado, `budget_tokens` puede exceder el parámetro `max_tokens`, ya que representa el presupuesto total en todos los bloques de pensamiento dentro de un turno del asistente.
- El pensamiento intercalado solo se admite para [herramientas utilizadas a través de la API de Mensajes](/docs/es/agents-and-tools/tool-use/overview).
- El pensamiento intercalado se admite solo para modelos Claude 4, con el encabezado beta `interleaved-thinking-2025-05-14`.
- Las llamadas directas a la API de Claude le permiten pasar `interleaved-thinking-2025-05-14` en solicitudes a cualquier modelo, sin efecto.
- En plataformas de terceros (por ejemplo, [Amazon Bedrock](/docs/es/build-with-claude/claude-on-amazon-bedrock) y [Vertex AI](/docs/es/build-with-claude/claude-on-vertex-ai)), si pasa `interleaved-thinking-2025-05-14` a cualquier modelo que no sea Claude Opus 4.5, Claude Opus 4.1, Opus 4 u Sonnet 4, su solicitud fallará.

<section title="Uso de herramientas sin pensamiento intercalado">

Sin pensamiento intercalado, Claude piensa una vez al inicio del turno del asistente. Las respuestas posteriores después de los resultados de herramientas continúan sin nuevos bloques de pensamiento.

```
Usuario: "¿Cuál es el ingreso total si vendemos 150 unidades a $50 cada una,
          y cómo se compara esto con nuestro ingreso promedio mensual?"

Turno 1: [pensamiento] "Necesito calcular 150 * $50, luego verificar la base de datos..."
         [tool_use: calculator] { "expression": "150 * 50" }
  ↓ resultado de herramienta: "7500"

Turno 2: [tool_use: database_query] { "query": "SELECT AVG(revenue)..." }
         ↑ sin bloque de pensamiento
  ↓ resultado de herramienta: "5200"

Turno 3: [texto] "El ingreso total es $7,500, que es 44% superior a su
         ingreso promedio mensual de $5,200."
         ↑ sin bloque de pensamiento
```

</section>

<section title="Uso de herramientas con pensamiento intercalado">

Con pensamiento intercalado habilitado, Claude puede pensar después de recibir cada resultado de herramienta, permitiéndole razonar sobre resultados intermedios antes de continuar.

```
Usuario: "¿Cuál es el ingreso total si vendemos 150 unidades a $50 cada una,
          y cómo se compara esto con nuestro ingreso promedio mensual?"

Turno 1: [pensamiento] "Necesito calcular 150 * $50 primero..."
         [tool_use: calculator] { "expression": "150 * 50" }
  ↓ resultado de herramienta: "7500"

Turno 2: [pensamiento] "Obtuve $7,500. Ahora debería consultar la base de datos para comparar..."
         [tool_use: database_query] { "query": "SELECT AVG(revenue)..." }
         ↑ pensamiento después de recibir resultado de calculadora
  ↓ resultado de herramienta: "5200"

Turno 3: [pensamiento] "$7,500 vs $5,200 promedio - eso es un aumento del 44%..."
         [texto] "El ingreso total es $7,500, que es 44% superior a su
         ingreso promedio mensual de $5,200."
         ↑ pensamiento antes de la respuesta final
```

</section>

## Pensamiento extendido con almacenamiento en caché de indicaciones

[El almacenamiento en caché de indicaciones](/docs/es/build-with-claude/prompt-caching) con pensamiento tiene varias consideraciones importantes:

<Tip>
Las tareas de pensamiento extendido a menudo tardan más de 5 minutos en completarse. Considere usar la [duración de caché de 1 hora](/docs/es/build-with-claude/prompt-caching#1-hour-cache-duration) para mantener aciertos de caché en sesiones de pensamiento más largas y flujos de trabajo de múltiples pasos.
</Tip>

**Eliminación del contexto del bloque de pensamiento**
- Los bloques de pensamiento de turnos anteriores se eliminan del contexto, lo que puede afectar los puntos de ruptura de caché
- Al continuar conversaciones con uso de herramientas, los bloques de pensamiento se almacenan en caché y cuentan como tokens de entrada cuando se leen desde el caché
- Esto crea una compensación: aunque los bloques de pensamiento no consumen espacio de ventana de contexto visualmente, aún cuentan hacia su uso de tokens de entrada cuando se almacenan en caché
- Si el pensamiento se deshabilita, las solicitudes fallarán si pasa contenido de pensamiento en el turno actual de uso de herramientas. En otros contextos, el contenido de pensamiento pasado a la API simplemente se ignora

**Patrones de invalidación de caché**
- Los cambios en los parámetros de pensamiento (habilitado/deshabilitado o asignación de presupuesto) invalidan los puntos de ruptura de caché de mensajes
- [El pensamiento intercalado](#interleaved-thinking) amplifica la invalidación de caché, ya que los bloques de pensamiento pueden ocurrir entre múltiples [llamadas de herramientas](#extended-thinking-with-tool-use)
- Los indicadores del sistema y las herramientas permanecen en caché a pesar de los cambios de parámetros de pensamiento o la eliminación de bloques

<Note>
Aunque los bloques de pensamiento se eliminan para el almacenamiento en caché y los cálculos de contexto, deben preservarse al continuar conversaciones con [uso de herramientas](#extended-thinking-with-tool-use), especialmente con [pensamiento intercalado](#interleaved-thinking).
</Note>

### Comprensión del comportamiento de almacenamiento en caché de bloques de pensamiento

Cuando se usa pensamiento extendido con uso de herramientas, los bloques de pensamiento exhiben un comportamiento de almacenamiento en caché específico que afecta el conteo de tokens:

**Cómo funciona:**

1. El almacenamiento en caché solo ocurre cuando realiza una solicitud posterior que incluye resultados de herramientas
2. Cuando se realiza la solicitud posterior, el historial de conversación anterior (incluidos los bloques de pensamiento) puede almacenarse en caché
3. Estos bloques de pensamiento en caché cuentan como tokens de entrada en sus métricas de uso cuando se leen desde el caché
4. Cuando se incluye un bloque de usuario sin resultado de herramienta, todos los bloques de pensamiento anteriores se ignoran y se eliminan del contexto

**Flujo de ejemplo detallado:**

**Solicitud 1:**
```
Usuario: "¿Cuál es el clima en París?"
```
**Respuesta 1:**
```
[thinking_block_1] + [tool_use block 1]
```

**Solicitud 2:**
```
Usuario: ["¿Cuál es el clima en París?"], 
Asistente: [thinking_block_1] + [tool_use block 1], 
Usuario: [tool_result_1, cache=True]
```
**Respuesta 2:**
```
[thinking_block_2] + [text block 2]
```
La solicitud 2 escribe un caché del contenido de la solicitud (no de la respuesta). El caché incluye el mensaje de usuario original, el primer bloque de pensamiento, el bloque de uso de herramientas y el resultado de la herramienta.

**Solicitud 3:**
```
Usuario: ["¿Cuál es el clima en París?"],
Asistente: [thinking_block_1] + [tool_use block 1],
Usuario: [tool_result_1, cache=True],
Asistente: [thinking_block_2] + [text block 2],
Usuario: [Respuesta de texto, cache=True]
```
Para Claude Opus 4.5 y posteriores, todos los bloques de pensamiento anteriores se mantienen de forma predeterminada. Para modelos más antiguos, porque se incluyó un bloque de usuario sin resultado de herramienta, todos los bloques de pensamiento anteriores se ignoran. Esta solicitud se procesará igual que:
```
Usuario: ["¿Cuál es el clima en París?"],
Asistente: [tool_use block 1],
Usuario: [tool_result_1, cache=True],
Asistente: [text block 2],
Usuario: [Respuesta de texto, cache=True]
```

**Puntos clave:**
- Este comportamiento de almacenamiento en caché ocurre automáticamente, incluso sin marcadores `cache_control` explícitos
- Este comportamiento es consistente ya sea usando pensamiento regular o pensamiento intercalado

<section title="Almacenamiento en caché de indicadores del sistema (preservado cuando cambia el pensamiento)">

<CodeGroup>
```python Python
from anthropic import Anthropic
import requests
from bs4 import BeautifulSoup

client = Anthropic()

def fetch_article_content(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')

    # Remove script and style elements
    for script in soup(["script", "style"]):
        script.decompose()

    # Get text
    text = soup.get_text()

    # Break into lines and remove leading and trailing space on each
    lines = (line.strip() for line in text.splitlines())
    # Break multi-headlines into a line each
    chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
    # Drop blank lines
    text = '\n'.join(chunk for chunk in chunks if chunk)

    return text

# Fetch the content of the article
book_url = "https://www.gutenberg.org/cache/epub/1342/pg1342.txt"
book_content = fetch_article_content(book_url)
# Use just enough text for caching (first few chapters)
LARGE_TEXT = book_content[:5000]

SYSTEM_PROMPT=[
    {
        "type": "text",
        "text": "You are an AI assistant that is tasked with literary analysis. Analyze the following text carefully.",
    },
    {
        "type": "text",
        "text": LARGE_TEXT,
        "cache_control": {"type": "ephemeral"}
    }
]

MESSAGES = [
    {
        "role": "user",
        "content": "Analyze the tone of this passage."
    }
]

# First request - establish cache
print("First request - establishing cache")
response1 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=20000,
    thinking={
        "type": "enabled",
        "budget_tokens": 4000
    },
    system=SYSTEM_PROMPT,
    messages=MESSAGES
)

print(f"First response usage: {response1.usage}")

MESSAGES.append({
    "role": "assistant",
    "content": response1.content
})
MESSAGES.append({
    "role": "user",
    "content": "Analyze the characters in this passage."
})
# Second request - same thinking parameters (cache hit expected)
print("\nSecond request - same thinking parameters (cache hit expected)")
response2 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=20000,
    thinking={
        "type": "enabled",
        "budget_tokens": 4000
    },
    system=SYSTEM_PROMPT,
    messages=MESSAGES
)

print(f"Second response usage: {response2.usage}")

# Third request - different thinking parameters (cache miss for messages)
print("\nThird request - different thinking parameters (cache miss for messages)")
response3 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=20000,
    thinking={
        "type": "enabled",
        "budget_tokens": 8000  # Changed thinking budget
    },
    system=SYSTEM_PROMPT,  # System prompt remains cached
    messages=MESSAGES  # Messages cache is invalidated
)

print(f"Third response usage: {response3.usage}")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';
import axios from 'axios';
import * as cheerio from 'cheerio';

const client = new Anthropic();

async function fetchArticleContent(url: string): Promise<string> {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  
  // Remove script and style elements
  $('script, style').remove();
  
  // Get text
  let text = $.text();
  
  // Break into lines and remove leading and trailing space on each
  const lines = text.split('\n').map(line => line.trim());
  // Drop blank lines
  text = lines.filter(line => line.length > 0).join('\n');
  
  return text;
}

// Fetch the content of the article
const bookUrl = "https://www.gutenberg.org/cache/epub/1342/pg1342.txt";
const bookContent = await fetchArticleContent(bookUrl);
// Use just enough text for caching (first few chapters)
const LARGE_TEXT = bookContent.slice(0, 5000);

const SYSTEM_PROMPT = [
  {
    type: "text",
    text: "You are an AI assistant that is tasked with literary analysis. Analyze the following text carefully.",
  },
  {
    type: "text",
    text: LARGE_TEXT,
    cache_control: { type: "ephemeral" }
  }
];

const MESSAGES = [
  {
    role: "user",
    content: "Analyze the tone of this passage."
  }
];

// First request - establish cache
console.log("First request - establishing cache");
const response1 = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 20000,
  thinking: {
    type: "enabled",
    budget_tokens: 4000
  },
  system: SYSTEM_PROMPT,
  messages: MESSAGES
});

console.log(`First response usage: ${response1.usage}`);

MESSAGES.push({
  role: "assistant",
  content: response1.content
});
MESSAGES.push({
  role: "user",
  content: "Analyze the characters in this passage."
});

// Second request - same thinking parameters (cache hit expected)
console.log("\nSecond request - same thinking parameters (cache hit expected)");
const response2 = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 20000,
  thinking: {
    type: "enabled",
    budget_tokens: 4000
  },
  system: SYSTEM_PROMPT,
  messages: MESSAGES
});

console.log(`Second response usage: ${response2.usage}`);

// Third request - different thinking parameters (cache miss for messages)
console.log("\nThird request - different thinking parameters (cache miss for messages)");
const response3 = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 20000,
  thinking: {
    type: "enabled",
    budget_tokens: 8000  // Changed thinking budget
  },
  system: SYSTEM_PROMPT,  // System prompt remains cached
  messages: MESSAGES  // Messages cache is invalidated
});

console.log(`Third response usage: ${response3.usage}`);
```
</CodeGroup>

</section>
<section title="Almacenamiento en caché de mensajes (invalidado cuando cambia el pensamiento)">

<CodeGroup>
```python Python
from anthropic import Anthropic
import requests
from bs4 import BeautifulSoup

client = Anthropic()

def fetch_article_content(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')

    # Remove script and style elements
    for script in soup(["script", "style"]):
        script.decompose()

    # Get text
    text = soup.get_text()

    # Break into lines and remove leading and trailing space on each
    lines = (line.strip() for line in text.splitlines())
    # Break multi-headlines into a line each
    chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
    # Drop blank lines
    text = '\n'.join(chunk for chunk in chunks if chunk)

    return text

# Fetch the content of the article
book_url = "https://www.gutenberg.org/cache/epub/1342/pg1342.txt"
book_content = fetch_article_content(book_url)
# Use just enough text for caching (first few chapters)
LARGE_TEXT = book_content[:5000]

# No system prompt - caching in messages instead
MESSAGES = [
    {
        "role": "user",
        "content": [
            {
                "type": "text",
                "text": LARGE_TEXT,
                "cache_control": {"type": "ephemeral"},
            },
            {
                "type": "text",
                "text": "Analyze the tone of this passage."
            }
        ]
    }
]

# First request - establish cache
print("First request - establishing cache")
response1 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=20000,
    thinking={
        "type": "enabled",
        "budget_tokens": 4000
    },
    messages=MESSAGES
)

print(f"First response usage: {response1.usage}")

MESSAGES.append({
    "role": "assistant",
    "content": response1.content
})
MESSAGES.append({
    "role": "user",
    "content": "Analyze the characters in this passage."
})
# Second request - same thinking parameters (cache hit expected)
print("\nSecond request - same thinking parameters (cache hit expected)")
response2 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=20000,
    thinking={
        "type": "enabled",
        "budget_tokens": 4000  # Same thinking budget
    },
    messages=MESSAGES
)

print(f"Second response usage: {response2.usage}")

MESSAGES.append({
    "role": "assistant",
    "content": response2.content
})
MESSAGES.append({
    "role": "user",
    "content": "Analyze the setting in this passage."
})

# Third request - different thinking budget (cache miss expected)
print("\nThird request - different thinking budget (cache miss expected)")
response3 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=20000,
    thinking={
        "type": "enabled",
        "budget_tokens": 8000  # Different thinking budget breaks cache
    },
    messages=MESSAGES
)

print(f"Third response usage: {response3.usage}")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';
import axios from 'axios';
import * as cheerio from 'cheerio';

const client = new Anthropic();

async function fetchArticleContent(url: string): Promise<string> {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  // Remove script and style elements
  $('script, style').remove();

  // Get text
  let text = $.text();

  // Clean up text (break into lines, remove whitespace)
  const lines = text.split('\n').map(line => line.trim());
  const chunks = lines.flatMap(line => line.split('  ').map(phrase => phrase.trim()));
  text = chunks.filter(chunk => chunk).join('\n');

  return text;
}

async function main() {
  // Fetch the content of the article
  const bookUrl = "https://www.gutenberg.org/cache/epub/1342/pg1342.txt";
  const bookContent = await fetchArticleContent(bookUrl);
  // Use just enough text for caching (first few chapters)
  const LARGE_TEXT = bookContent.substring(0, 5000);

  // No system prompt - caching in messages instead
  let MESSAGES = [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: LARGE_TEXT,
          cache_control: {type: "ephemeral"},
        },
        {
          type: "text",
          text: "Analyze the tone of this passage."
        }
      ]
    }
  ];

  // First request - establish cache
  console.log("First request - establishing cache");
  const response1 = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 20000,
    thinking: {
      type: "enabled",
      budget_tokens: 4000
    },
    messages: MESSAGES
  });

  console.log(`First response usage: `, response1.usage);

  MESSAGES = [
    ...MESSAGES,
    {
      role: "assistant",
      content: response1.content
    },
    {
      role: "user",
      content: "Analyze the characters in this passage."
    }
  ];

  // Second request - same thinking parameters (cache hit expected)
  console.log("\nSecond request - same thinking parameters (cache hit expected)");
  const response2 = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 20000,
    thinking: {
      type: "enabled",
      budget_tokens: 4000  // Same thinking budget
    },
    messages: MESSAGES
  });

  console.log(`Second response usage: `, response2.usage);

  MESSAGES = [
    ...MESSAGES,
    {
      role: "assistant",
      content: response2.content
    },
    {
      role: "user",
      content: "Analyze the setting in this passage."
    }
  ];

  // Third request - different thinking budget (cache miss expected)
  console.log("\nThird request - different thinking budget (cache miss expected)");
  const response3 = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 20000,
    thinking: {
      type: "enabled",
      budget_tokens: 8000  // Different thinking budget breaks cache
    },
    messages: MESSAGES
  });

  console.log(`Third response usage: `, response3.usage);
}

main().catch(console.error);
```

```java Java
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.Arrays;
import java.util.regex.Pattern;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.beta.messages.*;
import com.anthropic.models.beta.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;

import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toList;

public class ThinkingCacheExample {
    public static void main(String[] args) throws IOException {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Fetch the content of the article
        String bookUrl = "https://www.gutenberg.org/cache/epub/1342/pg1342.txt";
        String bookContent = fetchArticleContent(bookUrl);
        // Use just enough text for caching (first few chapters)
        String largeText = bookContent.substring(0, 5000);

        List<BetaTextBlockParam> systemPrompt = List.of(
                BetaTextBlockParam.builder()
                        .text("You are an AI assistant that is tasked with literary analysis. Analyze the following text carefully.")
                        .build(),
                BetaTextBlockParam.builder()
                        .text(largeText)
                        .cacheControl(BetaCacheControlEphemeral.builder().build())
                        .build()
        );

        List<BetaMessageParam> messages = new ArrayList<>();
        messages.add(BetaMessageParam.builder()
                .role(BetaMessageParam.Role.USER)
                .content("Analyze the tone of this passage.")
                .build());

        // First request - establish cache
        System.out.println("First request - establishing cache");
        BetaMessage response1 = client.beta().messages().create(
                MessageCreateParams.builder()
                        .model(Model.CLAUDE_OPUS_4_0)
                        .maxTokens(20000)
                        .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(4000).build())
                        .systemOfBetaTextBlockParams(systemPrompt)
                        .messages(messages)
                        .build()
        );

        System.out.println("First response usage: " + response1.usage());

        // Second request - same thinking parameters (cache hit expected)
        System.out.println("\nSecond request - same thinking parameters (cache hit expected)");
        BetaMessage response2 = client.beta().messages().create(
                MessageCreateParams.builder()
                        .model(Model.CLAUDE_OPUS_4_0)
                        .maxTokens(20000)
                        .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(4000).build())
                        .systemOfBetaTextBlockParams(systemPrompt)
                        .addMessage(response1)
                        .addUserMessage("Analyze the characters in this passage.")
                        .messages(messages)
                        .build()
        );

        System.out.println("Second response usage: " + response2.usage());

        // Third request - different thinking budget (cache hit expected because system prompt caching)
        System.out.println("\nThird request - different thinking budget (cache hit expected)");
        BetaMessage response3 = client.beta().messages().create(
                MessageCreateParams.builder()
                        .model(Model.CLAUDE_OPUS_4_0)
                        .maxTokens(20000)
                        .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(8000).build())
                        .systemOfBetaTextBlockParams(systemPrompt)
                        .addMessage(response1)
                        .addUserMessage("Analyze the characters in this passage.")
                        .addMessage(response2)
                        .addUserMessage("Analyze the setting in this passage.")
                        .build()
        );

        System.out.println("Third response usage: " + response3.usage());
    }

    private static String fetchArticleContent(String url) throws IOException {
        // Fetch HTML content
        String htmlContent = fetchHtml(url);

        // Remove script and style elements
        String noScriptStyle = removeElements(htmlContent, "script", "style");

        // Extract text (simple approach - remove HTML tags)
        String text = removeHtmlTags(noScriptStyle);

        // Clean up text (break into lines, remove whitespace)
        List<String> lines = Arrays.asList(text.split("\n"));
        List<String> trimmedLines = lines.stream()
                .map(String::trim)
                .collect(toList());

        // Split on double spaces and flatten
        List<String> chunks = trimmedLines.stream()
                .flatMap(line -> Arrays.stream(line.split("  "))
                        .map(String::trim))
                .collect(toList());

        // Filter empty chunks and join with newlines
        return chunks.stream()
                .filter(chunk -> !chunk.isEmpty())
                .collect(joining("\n"));
    }

    /**
     * Fetches HTML content from a URL
     */
    private static String fetchHtml(String urlString) throws IOException {
        try (InputStream inputStream = new URL(urlString).openStream()) {
            StringBuilder content = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(inputStream))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    content.append(line).append("\n");
                }
            }
            return content.toString();
        }
    }

    /**
     * Removes specified HTML elements and their content
     */
    private static String removeElements(String html, String... elementNames) {
        String result = html;
        for (String element : elementNames) {
            // Pattern to match <element>...</element> and self-closing tags
            String pattern = "<" + element + "\\s*[^>]*>.*?</" + element + ">|<" + element + "\\s*[^>]*/?>";
            result = Pattern.compile(pattern, Pattern.DOTALL).matcher(result).replaceAll("");
        }
        return result;
    }

    /**
     * Removes all HTML tags from content
     */
    private static String removeHtmlTags(String html) {
        // Replace <br> and <p> tags with newlines for better text formatting
        String withLineBreaks = html.replaceAll("<br\\s*/?\\s*>|</?p\\s*[^>]*>", "\n");

        // Remove remaining HTML tags
        String noTags = withLineBreaks.replaceAll("<[^>]*>", "");

        // Decode HTML entities (simplified for common entities)
        return decodeHtmlEntities(noTags);
    }

    /**
     * Simple HTML entity decoder for common entities
     */
    private static String decodeHtmlEntities(String text) {
        return text
                .replaceAll("&nbsp;", " ")
                .replaceAll("&amp;", "&")
                .replaceAll("&lt;", "<")
                .replaceAll("&gt;", ">")
                .replaceAll("&quot;", "\"")
                .replaceAll("&#39;", "'")
                .replaceAll("&hellip;", "...")
                .replaceAll("&mdash;", "—");
    }

}
```
</CodeGroup>

Aquí está la salida del script (puede ver números ligeramente diferentes)

```
First request - establishing cache
First response usage: { cache_creation_input_tokens: 1370, cache_read_input_tokens: 0, input_tokens: 17, output_tokens: 700 }

Second request - same thinking parameters (cache hit expected)

Second response usage: { cache_creation_input_tokens: 0, cache_read_input_tokens: 1370, input_tokens: 303, output_tokens: 874 }

Third request - different thinking budget (cache miss expected)
Third response usage: { cache_creation_input_tokens: 1370, cache_read_input_tokens: 0, input_tokens: 747, output_tokens: 619 }
```

Este ejemplo demuestra que cuando el almacenamiento en caché se configura en la matriz de mensajes, cambiar los parámetros de pensamiento (presupuesto_tokens aumentado de 4000 a 8000) **invalida el caché**. La tercera solicitud no muestra acierto de caché con `cache_creation_input_tokens=1370` y `cache_read_input_tokens=0`, lo que prueba que el almacenamiento en caché basado en mensajes se invalida cuando cambian los parámetros de pensamiento.

</section>

## Tokens máximos y tamaño de ventana de contexto con pensamiento extendido

En modelos Claude más antiguos (anteriores a Claude Sonnet 3.7), si la suma de tokens de indicación y `max_tokens` excedía la ventana de contexto del modelo, el sistema ajustaría automáticamente `max_tokens` para caber dentro del límite de contexto. Esto significaba que podía establecer un valor grande de `max_tokens` y el sistema lo reduciría silenciosamente según sea necesario.

Con modelos Claude 3.7 y 4, `max_tokens` (que incluye su presupuesto de pensamiento cuando el pensamiento está habilitado) se aplica como un límite estricto. El sistema ahora devolverá un error de validación si tokens de indicación + `max_tokens` excede el tamaño de la ventana de contexto.

<Note>
Puede leer nuestra [guía sobre ventanas de contexto](/docs/es/build-with-claude/context-windows) para un análisis más profundo.
</Note>

### La ventana de contexto con pensamiento extendido

Al calcular el uso de la ventana de contexto con pensamiento habilitado, hay algunas consideraciones de las que ser consciente:

- Los bloques de pensamiento de turnos anteriores se eliminan y no cuentan hacia su ventana de contexto
- El pensamiento del turno actual cuenta hacia su límite de `max_tokens` para ese turno

El diagrama a continuación demuestra la gestión especializada de tokens cuando el pensamiento extendido está habilitado:

![Diagrama de ventana de contexto con pensamiento extendido](/docs/images/context-window-thinking.svg)

La ventana de contexto efectiva se calcula como:

```
ventana de contexto =
  (tokens de entrada actuales - tokens de pensamiento anteriores) +
  (tokens de pensamiento + tokens de pensamiento encriptados + tokens de salida de texto)
```

Recomendamos usar la [API de conteo de tokens](/docs/es/build-with-claude/token-counting) para obtener conteos de tokens precisos para su caso de uso específico, especialmente cuando se trabaja con conversaciones de múltiples turnos que incluyen pensamiento.

### La ventana de contexto con pensamiento extendido y uso de herramientas

Cuando se usa pensamiento extendido con uso de herramientas, los bloques de pensamiento deben preservarse explícitamente y devolverse con los resultados de herramientas.

El cálculo de ventana de contexto efectiva para pensamiento extendido con uso de herramientas se convierte en:

```
ventana de contexto =
  (tokens de entrada actuales + tokens de pensamiento anteriores + tokens de uso de herramientas) +
  (tokens de pensamiento + tokens de pensamiento encriptados + tokens de salida de texto)
```

El diagrama a continuación ilustra la gestión de tokens para pensamiento extendido con uso de herramientas:

![Diagrama de ventana de contexto con pensamiento extendido y uso de herramientas](/docs/images/context-window-thinking-tools.svg)

### Gestión de tokens con pensamiento extendido

Dado el comportamiento de ventana de contexto y `max_tokens` con pensamiento extendido en modelos Claude 3.7 y 4, puede que necesite:

- Monitorear y gestionar más activamente su uso de tokens
- Ajustar valores de `max_tokens` a medida que cambia la longitud de su indicación
- Potencialmente usar los [puntos finales de conteo de tokens](/docs/es/build-with-claude/token-counting) más frecuentemente
- Ser consciente de que los bloques de pensamiento anteriores no se acumulan en su ventana de contexto

Este cambio se ha realizado para proporcionar un comportamiento más predecible y transparente, especialmente a medida que los límites de tokens máximos han aumentado significativamente.

## Encriptación de pensamiento

El contenido completo del pensamiento se encripta y se devuelve en el campo `signature`. Este campo se utiliza para verificar que los bloques de pensamiento fueron generados por Claude cuando se devuelven a la API.

<Note>
Solo es estrictamente necesario enviar bloques de pensamiento cuando se usan [herramientas con pensamiento extendido](#extended-thinking-with-tool-use). De lo contrario, puede omitir bloques de pensamiento de turnos anteriores, o dejar que la API los elimine por usted si los devuelve.

Si envía bloques de pensamiento, recomendamos devolver todo tal como lo recibió para mantener la consistencia y evitar posibles problemas.
</Note>

Aquí hay algunas consideraciones importantes sobre la encriptación de pensamiento:
- Cuando [transmite respuestas](#streaming-thinking), la firma se agrega a través de un `signature_delta` dentro de un evento `content_block_delta` justo antes del evento `content_block_stop`.
- Los valores de `signature` son significativamente más largos en modelos Claude 4 que en modelos anteriores.
- El campo `signature` es un campo opaco y no debe interpretarse ni analizarse - existe únicamente para propósitos de verificación.
- Los valores de `signature` son compatibles entre plataformas (API de Claude, [Amazon Bedrock](/docs/es/build-with-claude/claude-on-amazon-bedrock) y [Vertex AI](/docs/es/build-with-claude/claude-on-vertex-ai)). Los valores generados en una plataforma serán compatibles con otra.

### Redacción del pensamiento

Ocasionalmente, el razonamiento interno de Claude será marcado por nuestros sistemas de seguridad. Cuando esto ocurre, ciframos parte o todo el bloque `thinking` y lo devolvemos como un bloque `redacted_thinking`. Los bloques `redacted_thinking` se descifran cuando se devuelven a la API, permitiendo que Claude continúe su respuesta sin perder contexto.

Al construir aplicaciones orientadas al cliente que utilizan pensamiento extendido:

- Ten en cuenta que los bloques de pensamiento redactado contienen contenido cifrado que no es legible por humanos
- Considera proporcionar una explicación simple como: "Parte del razonamiento interno de Claude ha sido cifrado automáticamente por razones de seguridad. Esto no afecta la calidad de las respuestas."
- Si muestras bloques de pensamiento a los usuarios, puedes filtrar los bloques redactados mientras preservas los bloques de pensamiento normales
- Sé transparente sobre que el uso de características de pensamiento extendido puede ocasionalmente resultar en que parte del razonamiento sea cifrado
- Implementa manejo de errores apropiado para gestionar gracefully el pensamiento redactado sin romper tu interfaz de usuario

Aquí hay un ejemplo que muestra tanto bloques de pensamiento normales como redactados:

```json
{
  "content": [
    {
      "type": "thinking",
      "thinking": "Let me analyze this step by step...",
      "signature": "WaUjzkypQ2mUEVM36O2TxuC06KN8xyfbJwyem2dw3URve/op91XWHOEBLLqIOMfFG/UvLEczmEsUjavL...."
    },
    {
      "type": "redacted_thinking",
      "data": "EmwKAhgBEgy3va3pzix/LafPsn4aDFIT2Xlxh0L5L8rLVyIwxtE3rAFBa8cr3qpPkNRj2YfWXGmKDxH4mPnZ5sQ7vB9URj2pLmN3kF8/dW5hR7xJ0aP1oLs9yTcMnKVf2wRpEGjH9XZaBt4UvDcPrQ..."
    },
    {
      "type": "text",
      "text": "Based on my analysis..."
    }
  ]
}
```

<Note>
Ver bloques de pensamiento redactado en tu salida es un comportamiento esperado. El modelo aún puede usar este razonamiento redactado para informar sus respuestas mientras mantiene los guardarraíles de seguridad.

Si necesitas probar el manejo del pensamiento redactado en tu aplicación, puedes usar esta cadena de prueba especial como tu prompt: `ANTHROPIC_MAGIC_STRING_TRIGGER_REDACTED_THINKING_46C9A13E193C177646C7398A98432ECCCE4C1253D5E2D82641AC0E52CC2876CB`
</Note>

Al pasar bloques `thinking` y `redacted_thinking` de vuelta a la API en una conversación de múltiples turnos, debes incluir el bloque completo sin modificar de vuelta a la API para el último turno del asistente. Esto es crítico para mantener el flujo de razonamiento del modelo. Sugerimos siempre pasar todos los bloques de pensamiento a la API. Para más detalles, consulta la sección [Preservando bloques de pensamiento](#preserving-thinking-blocks) arriba.

<section title="Ejemplo: Trabajar con bloques de pensamiento redactado">

Este ejemplo demuestra cómo manejar bloques `redacted_thinking` que pueden aparecer en respuestas cuando el razonamiento interno de Claude contiene contenido marcado por sistemas de seguridad:

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# Using a special prompt that triggers redacted thinking (for demonstration purposes only)
response = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    messages=[{
        "role": "user",
        "content": "ANTHROPIC_MAGIC_STRING_TRIGGER_REDACTED_THINKING_46C9A13E193C177646C7398A98432ECCCE4C1253D5E2D82641AC0E52CC2876CB"
    }]
)

# Identify redacted thinking blocks
has_redacted_thinking = any(
    block.type == "redacted_thinking" for block in response.content
)

if has_redacted_thinking:
    print("Response contains redacted thinking blocks")
    # These blocks are still usable in subsequent requests

    # Extract all blocks (both redacted and non-redacted)
    all_thinking_blocks = [
        block for block in response.content
        if block.type in ["thinking", "redacted_thinking"]
    ]

    # When passing to subsequent requests, include all blocks without modification
    # This preserves the integrity of Claude's reasoning

    print(f"Found {len(all_thinking_blocks)} thinking blocks total")
    print(f"These blocks are still billable as output tokens")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

// Using a special prompt that triggers redacted thinking (for demonstration purposes only)
const response = await client.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 16000,
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  messages: [{
    role: "user",
    content: "ANTHROPIC_MAGIC_STRING_TRIGGER_REDACTED_THINKING_46C9A13E193C177646C7398A98432ECCCE4C1253D5E2D82641AC0E52CC2876CB"
  }]
});

// Identify redacted thinking blocks
const hasRedactedThinking = response.content.some(
  block => block.type === "redacted_thinking"
);

if (hasRedactedThinking) {
  console.log("Response contains redacted thinking blocks");
  // These blocks are still usable in subsequent requests

  // Extract all blocks (both redacted and non-redacted)
  const allThinkingBlocks = response.content.filter(
    block => block.type === "thinking" || block.type === "redacted_thinking"
  );

  // When passing to subsequent requests, include all blocks without modification
  // This preserves the integrity of Claude's reasoning

  console.log(`Found ${allThinkingBlocks.length} thinking blocks total`);
  console.log(`These blocks are still billable as output tokens`);
}
```

```java Java
import java.util.List;

import static java.util.stream.Collectors.toList;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.beta.messages.BetaContentBlock;
import com.anthropic.models.beta.messages.BetaMessage;
import com.anthropic.models.beta.messages.MessageCreateParams;
import com.anthropic.models.beta.messages.BetaThinkingConfigEnabled;
import com.anthropic.models.messages.Model;

public class RedactedThinkingExample {
    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Using a special prompt that triggers redacted thinking (for demonstration purposes only)
        BetaMessage response = client.beta().messages().create(
                MessageCreateParams.builder()
                        .model(Model.CLAUDE_SONNET_4_5)
                        .maxTokens(16000)
                        .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(10000).build())
                        .addUserMessage("ANTHROPIC_MAGIC_STRING_TRIGGER_REDACTED_THINKING_46C9A13E193C177646C7398A98432ECCCE4C1253D5E2D82641AC0E52CC2876CB")
                        .build()
        );

        // Identify redacted thinking blocks
        boolean hasRedactedThinking = response.content().stream()
                .anyMatch(BetaContentBlock::isRedactedThinking);

        if (hasRedactedThinking) {
            System.out.println("Response contains redacted thinking blocks");
            // These blocks are still usable in subsequent requests
            // Extract all blocks (both redacted and non-redacted)
            List<BetaContentBlock> allThinkingBlocks = response.content().stream()
                    .filter(block -> block.isThinking() ||
                            block.isRedactedThinking())
                    .collect(toList());

            // When passing to subsequent requests, include all blocks without modification
            // This preserves the integrity of Claude's reasoning
            System.out.println("Found " + allThinkingBlocks.size() + " thinking blocks total");
            System.out.println("These blocks are still billable as output tokens");
        }
    }
}
```

</CodeGroup>

<TryInConsoleButton
  userPrompt="ANTHROPIC_MAGIC_STRING_TRIGGER_REDACTED_THINKING_46C9A13E193C177646C7398A98432ECCCE4C1253D5E2D82641AC0E52CC2876CB"
  thinkingBudgetTokens={16000}
>
  Prueba en la Consola
</TryInConsoleButton>

</section>

## Diferencias en el pensamiento entre versiones de modelos

La API de Mensajes maneja el pensamiento de manera diferente entre los modelos Claude Sonnet 3.7 y Claude 4, principalmente en el comportamiento de redacción y resumen.

Consulta la tabla a continuación para una comparación condensada:

| Característica | Claude Sonnet 3.7 | Modelos Claude 4 (pre-Opus 4.5) | Claude Opus 4.5 y posterior |
|---------|------------------|-------------------------------|--------------------------|
| **Salida de Pensamiento** | Devuelve salida de pensamiento completa | Devuelve pensamiento resumido | Devuelve pensamiento resumido |
| **Pensamiento Intercalado** | No compatible | Compatible con encabezado beta `interleaved-thinking-2025-05-14` | Compatible con encabezado beta `interleaved-thinking-2025-05-14` |
| **Preservación de Bloque de Pensamiento** | No preservado entre turnos | No preservado entre turnos | **Preservado por defecto** (habilita optimización de caché, ahorro de tokens) |

### Preservación de bloques de pensamiento en Claude Opus 4.5

Claude Opus 4.5 introduce un nuevo comportamiento por defecto: **los bloques de pensamiento de turnos anteriores del asistente se preservan en el contexto del modelo por defecto**. Esto difiere de los modelos anteriores, que eliminan los bloques de pensamiento de turnos anteriores.

**Beneficios de la preservación de bloques de pensamiento:**

- **Optimización de caché**: Al usar herramientas, los bloques de pensamiento preservados habilitan aciertos de caché ya que se devuelven con resultados de herramientas y se cachean incrementalmente a través del turno del asistente, resultando en ahorro de tokens en flujos de trabajo de múltiples pasos
- **Sin impacto en la inteligencia**: Preservar bloques de pensamiento no tiene efecto negativo en el desempeño del modelo

**Consideraciones importantes:**

- **Uso de contexto**: Las conversaciones largas consumirán más espacio de contexto ya que los bloques de pensamiento se retienen en el contexto
- **Comportamiento automático**: Este es el comportamiento por defecto para Claude Opus 4.5—no se requieren cambios de código ni encabezados beta
- **Compatibilidad hacia atrás**: Para aprovechar esta característica, continúa pasando bloques de pensamiento completos sin modificar de vuelta a la API como lo harías para el uso de herramientas

<Note>
Para modelos anteriores (Claude Sonnet 4.5, Opus 4.1, etc.), los bloques de pensamiento de turnos anteriores continúan siendo removidos del contexto. El comportamiento existente descrito en la sección [Pensamiento extendido con almacenamiento en caché de prompts](#extended-thinking-with-prompt-caching) se aplica a esos modelos.
</Note>

## Precios

Para información completa de precios incluyendo tasas base, escrituras de caché, aciertos de caché y tokens de salida, consulta la [página de precios](/docs/es/about-claude/pricing).

El proceso de pensamiento incurre en cargos por:
- Tokens utilizados durante el pensamiento (tokens de salida)
- Bloques de pensamiento del último turno del asistente incluidos en solicitudes posteriores (tokens de entrada)
- Tokens de salida de texto estándar

<Note>
Cuando el pensamiento extendido está habilitado, un prompt de sistema especializado se incluye automáticamente para soportar esta característica.
</Note>

Cuando se usa pensamiento resumido:
- **Tokens de entrada**: Tokens en tu solicitud original (excluye tokens de pensamiento de turnos anteriores)
- **Tokens de salida (facturados)**: Los tokens de pensamiento originales que Claude generó internamente
- **Tokens de salida (visibles)**: Los tokens de pensamiento resumido que ves en la respuesta
- **Sin cargo**: Tokens utilizados para generar el resumen

<Warning>
El recuento de tokens de salida facturados **no** coincidirá con el recuento de tokens visible en la respuesta. Se te factura por el proceso de pensamiento completo, no por el resumen que ves.
</Warning>

## Mejores prácticas y consideraciones para pensamiento extendido

### Trabajar con presupuestos de pensamiento

- **Optimización de presupuesto:** El presupuesto mínimo es 1,024 tokens. Sugerimos comenzar con el mínimo e incrementar el presupuesto de pensamiento incrementalmente para encontrar el rango óptimo para tu caso de uso. Los recuentos de tokens más altos habilitan razonamiento más comprehensivo pero con retornos decrecientes dependiendo de la tarea. Incrementar el presupuesto puede mejorar la calidad de la respuesta al costo de mayor latencia. Para tareas críticas, prueba diferentes configuraciones para encontrar el balance óptimo. Ten en cuenta que el presupuesto de pensamiento es un objetivo en lugar de un límite estricto—el uso real de tokens puede variar basado en la tarea.
- **Puntos de partida:** Comienza con presupuestos de pensamiento más grandes (16k+ tokens) para tareas complejas y ajusta basado en tus necesidades.
- **Presupuestos grandes:** Para presupuestos de pensamiento por encima de 32k, recomendamos usar [procesamiento por lotes](/docs/es/build-with-claude/batch-processing) para evitar problemas de red. Las solicitudes que empujan al modelo a pensar por encima de 32k tokens causan solicitudes de larga duración que podrían chocar contra tiempos de espera del sistema y límites de conexiones abiertas.
- **Seguimiento de uso de tokens:** Monitorea el uso de tokens de pensamiento para optimizar costos y desempeño.

### Consideraciones de desempeño

- **Tiempos de respuesta:** Prepárate para tiempos de respuesta potencialmente más largos debido al procesamiento adicional requerido para el proceso de razonamiento. Ten en cuenta que generar bloques de pensamiento puede aumentar el tiempo de respuesta general.
- **Requisitos de streaming:** El streaming es requerido cuando `max_tokens` es mayor que 21,333. Cuando se usa streaming, prepárate para manejar tanto bloques de contenido de pensamiento como de texto conforme llegan.

### Compatibilidad de características

- El pensamiento no es compatible con modificaciones de `temperature` o `top_k` así como con [uso forzado de herramientas](/docs/es/agents-and-tools/tool-use/implement-tool-use#forcing-tool-use).
- Cuando el pensamiento está habilitado, puedes establecer `top_p` a valores entre 1 y 0.95.
- No puedes pre-rellenar respuestas cuando el pensamiento está habilitado.
- Los cambios al presupuesto de pensamiento invalidan prefijos de prompts cacheados que incluyen mensajes. Sin embargo, los prompts de sistema cacheados y definiciones de herramientas continuarán funcionando cuando los parámetros de pensamiento cambien.

### Directrices de uso

- **Selección de tareas:** Usa pensamiento extendido para tareas particularmente complejas que se benefician del razonamiento paso a paso como matemáticas, codificación y análisis.
- **Manejo de contexto:** No necesitas remover bloques de pensamiento anteriores tú mismo. La API de Claude automáticamente ignora bloques de pensamiento de turnos anteriores y no se incluyen cuando se calcula el uso de contexto.
- **Ingeniería de prompts:** Revisa nuestros [consejos de prompting de pensamiento extendido](/docs/es/build-with-claude/prompt-engineering/extended-thinking-tips) si quieres maximizar las capacidades de pensamiento de Claude.

## Próximos pasos

<CardGroup>
  <Card title="Prueba el libro de recetas de pensamiento extendido" icon="book" href="https://github.com/anthropics/anthropic-cookbook/tree/main/extended_thinking">
    Explora ejemplos prácticos de pensamiento en nuestro libro de recetas.
  </Card>
  <Card title="Consejos de prompting de pensamiento extendido" icon="code" href="/docs/es/build-with-claude/prompt-engineering/extended-thinking-tips">
    Aprende mejores prácticas de ingeniería de prompts para pensamiento extendido.
  </Card>
</CardGroup>