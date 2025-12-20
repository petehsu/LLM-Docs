# Cómo implementar el uso de herramientas

Guía completa para implementar el uso de herramientas con Claude, incluyendo definiciones de herramientas, ejemplos y mejores prácticas.

---

## Elegir un modelo

Recomendamos usar el modelo Claude Sonnet (4.5) o Claude Opus (4.1) más reciente para herramientas complejas y consultas ambiguas; manejan múltiples herramientas mejor y buscan aclaraciones cuando es necesario.

Usa modelos Claude Haiku para herramientas directas, pero ten en cuenta que pueden inferir parámetros faltantes.

<Tip>
Si usas Claude con uso de herramientas y pensamiento extendido, consulta nuestra guía [aquí](/docs/es/build-with-claude/extended-thinking) para más información.
</Tip>

## Especificar herramientas del cliente

Las herramientas del cliente (tanto las definidas por Anthropic como las definidas por el usuario) se especifican en el parámetro de nivel superior `tools` de la solicitud de API. Cada definición de herramienta incluye:

| Parámetro      | Descripción                                                                                         |
| :------------- | :-------------------------------------------------------------------------------------------------- |
| `name`         | El nombre de la herramienta. Debe coincidir con la expresión regular `^[a-zA-Z0-9_-]{1,64}$`.                                 |
| `description`  | Una descripción detallada en texto plano de qué hace la herramienta, cuándo debe usarse y cómo se comporta. |
| `input_schema` | Un objeto [JSON Schema](https://json-schema.org/) que define los parámetros esperados para la herramienta.     |
| `input_examples` | (Opcional, beta) Una matriz de objetos de entrada de ejemplo para ayudar a Claude a entender cómo usar la herramienta. Consulta [Proporcionar ejemplos de uso de herramientas](#providing-tool-use-examples). |

<section title="Ejemplo de definición de herramienta simple">

```json JSON
{
  "name": "get_weather",
  "description": "Get the current weather in a given location",
  "input_schema": {
    "type": "object",
    "properties": {
      "location": {
        "type": "string",
        "description": "The city and state, e.g. San Francisco, CA"
      },
      "unit": {
        "type": "string",
        "enum": ["celsius", "fahrenheit"],
        "description": "The unit of temperature, either 'celsius' or 'fahrenheit'"
      }
    },
    "required": ["location"]
  }
}
```

Esta herramienta, llamada `get_weather`, espera un objeto de entrada con una cadena `location` requerida y una cadena `unit` opcional que debe ser "celsius" o "fahrenheit".

</section>

### Indicación del sistema de uso de herramientas

Cuando llamas a la API de Claude con el parámetro `tools`, construimos una indicación del sistema especial a partir de las definiciones de herramientas, la configuración de herramientas y cualquier indicación del sistema especificada por el usuario. La indicación construida está diseñada para instruir al modelo que use las herramientas especificadas y proporcione el contexto necesario para que la herramienta funcione correctamente:

```
In this environment you have access to a set of tools you can use to answer the user's question.
{{ FORMATTING INSTRUCTIONS }}
String and scalar parameters should be specified as is, while lists and objects should use JSON format. Note that spaces for string values are not stripped. The output is not expected to be valid XML and is parsed with regular expressions.
Here are the functions available in JSONSchema format:
{{ TOOL DEFINITIONS IN JSON SCHEMA }}
{{ USER SYSTEM PROMPT }}
{{ TOOL CONFIGURATION }}
```

### Mejores prácticas para definiciones de herramientas

Para obtener el mejor rendimiento de Claude al usar herramientas, sigue estas directrices:

- **Proporciona descripciones extremadamente detalladas.** Este es, con mucho, el factor más importante en el rendimiento de las herramientas. Tus descripciones deben explicar cada detalle sobre la herramienta, incluyendo:
  - Qué hace la herramienta
  - Cuándo debe usarse (y cuándo no)
  - Qué significa cada parámetro y cómo afecta el comportamiento de la herramienta
  - Cualquier advertencia o limitación importante, como qué información la herramienta no devuelve si el nombre de la herramienta no es claro. Cuanto más contexto puedas dar a Claude sobre tus herramientas, mejor será a la hora de decidir cuándo y cómo usarlas. Apunta a al menos 3-4 oraciones por descripción de herramienta, más si la herramienta es compleja.
- **Prioriza descripciones, pero considera usar `input_examples` para herramientas complejas.** Las descripciones claras son lo más importante, pero para herramientas con entradas complejas, objetos anidados o parámetros sensibles al formato, puedes usar el campo `input_examples` (beta) para proporcionar ejemplos validados por esquema. Consulta [Proporcionar ejemplos de uso de herramientas](#providing-tool-use-examples) para más detalles.

<section title="Ejemplo de una buena descripción de herramienta">

```json JSON
{
  "name": "get_stock_price",
  "description": "Retrieves the current stock price for a given ticker symbol. The ticker symbol must be a valid symbol for a publicly traded company on a major US stock exchange like NYSE or NASDAQ. The tool will return the latest trade price in USD. It should be used when the user asks about the current or most recent price of a specific stock. It will not provide any other information about the stock or company.",
  "input_schema": {
    "type": "object",
    "properties": {
      "ticker": {
        "type": "string",
        "description": "The stock ticker symbol, e.g. AAPL for Apple Inc."
      }
    },
    "required": ["ticker"]
  }
}
```

</section>

<section title="Ejemplo de descripción de herramienta deficiente">

```json JSON
{
  "name": "get_stock_price",
  "description": "Gets the stock price for a ticker.",
  "input_schema": {
    "type": "object",
    "properties": {
      "ticker": {
        "type": "string"
      }
    },
    "required": ["ticker"]
  }
}
```

</section>

La buena descripción explica claramente qué hace la herramienta, cuándo usarla, qué datos devuelve y qué significa el parámetro `ticker`. La descripción deficiente es demasiado breve y deja a Claude con muchas preguntas abiertas sobre el comportamiento y el uso de la herramienta.

## Proporcionar ejemplos de uso de herramientas

Puedes proporcionar ejemplos concretos de entradas de herramientas válidas para ayudar a Claude a entender cómo usar tus herramientas de manera más efectiva. Esto es particularmente útil para herramientas complejas con objetos anidados, parámetros opcionales o entradas sensibles al formato.

<Info>
Los ejemplos de uso de herramientas es una característica beta. Incluye el [encabezado beta](/docs/es/api/beta-headers) apropiado para tu proveedor:

| Proveedor | Encabezado beta | Modelos compatibles |
|----------|-------------|------------------|
| Claude API,<br/>Microsoft Foundry | `advanced-tool-use-2025-11-20` | Todos los modelos |
| Vertex AI,<br/>Amazon Bedrock | `tool-examples-2025-10-29` | Solo Claude Opus 4.5 |
</Info>

### Uso básico

Añade un campo `input_examples` opcional a tu definición de herramienta con una matriz de objetos de entrada de ejemplo. Cada ejemplo debe ser válido según el `input_schema` de la herramienta:

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    betas=["advanced-tool-use-2025-11-20"],
    tools=[
        {
            "name": "get_weather",
            "description": "Get the current weather in a given location",
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "The city and state, e.g. San Francisco, CA"
                    },
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"],
                        "description": "The unit of temperature"
                    }
                },
                "required": ["location"]
            },
            "input_examples": [
                {
                    "location": "San Francisco, CA",
                    "unit": "fahrenheit"
                },
                {
                    "location": "Tokyo, Japan",
                    "unit": "celsius"
                },
                {
                    "location": "New York, NY"  # 'unit' is optional
                }
            ]
        }
    ],
    messages=[
        {"role": "user", "content": "What's the weather like in San Francisco?"}
    ]
)
```

```typescript TypeScript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const response = await client.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  betas: ["advanced-tool-use-2025-11-20"],
  tools: [
    {
      name: "get_weather",
      description: "Get the current weather in a given location",
      input_schema: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "The city and state, e.g. San Francisco, CA",
          },
          unit: {
            type: "string",
            enum: ["celsius", "fahrenheit"],
            description: "The unit of temperature",
          },
        },
        required: ["location"],
      },
      input_examples: [
        {
          location: "San Francisco, CA",
          unit: "fahrenheit",
        },
        {
          location: "Tokyo, Japan",
          unit: "celsius",
        },
        {
          location: "New York, NY",
          // Demonstrates that 'unit' is optional
        },
      ],
    },
  ],
  messages: [{ role: "user", content: "What's the weather like in San Francisco?" }],
});
```
</CodeGroup>

Los ejemplos se incluyen en la indicación junto con tu esquema de herramienta, mostrando a Claude patrones concretos para llamadas de herramientas bien formadas. Esto ayuda a Claude a entender cuándo incluir parámetros opcionales, qué formatos usar y cómo estructurar entradas complejas.

### Requisitos y limitaciones

- **Validación de esquema** - Cada ejemplo debe ser válido según el `input_schema` de la herramienta. Los ejemplos inválidos devuelven un error 400
- **No compatible con herramientas del lado del servidor** - Solo las herramientas definidas por el usuario pueden tener ejemplos de entrada
- **Costo de tokens** - Los ejemplos se añaden a los tokens de indicación: ~20-50 tokens para ejemplos simples, ~100-200 tokens para objetos anidados complejos

## Ejecutor de herramientas (beta)

El ejecutor de herramientas proporciona una solución lista para usar para ejecutar herramientas con Claude. En lugar de manejar manualmente llamadas de herramientas, resultados de herramientas y gestión de conversaciones, el ejecutor de herramientas automáticamente:

- Ejecuta herramientas cuando Claude las llama
- Maneja el ciclo de solicitud/respuesta
- Gestiona el estado de la conversación
- Proporciona seguridad de tipos y validación

Recomendamos que uses el ejecutor de herramientas para la mayoría de las implementaciones de uso de herramientas.

<Note>
El ejecutor de herramientas está actualmente en beta y disponible en los SDK de [Python](https://github.com/anthropics/anthropic-sdk-python/blob/main/tools.md), [TypeScript](https://github.com/anthropics/anthropic-sdk-typescript/blob/main/helpers.md#tool-helpers) y [Ruby](https://github.com/anthropics/anthropic-sdk-ruby/blob/main/helpers.md#3-auto-looping-tool-runner-beta).
</Note>

<Tip>
**Gestión automática de contexto con compactación**

El ejecutor de herramientas admite [compactación](/docs/es/build-with-claude/context-editing#client-side-compaction-sdk) automática, que genera resúmenes cuando el uso de tokens excede un umbral. Esto permite que las tareas agénticas de larga duración continúen más allá de los límites de la ventana de contexto.
</Tip>

<Tabs>
<Tab title="Python">

### Uso básico

Usa el decorador `@beta_tool` para definir herramientas y `client.beta.messages.tool_runner()` para ejecutarlas.

<Note>
Si estás usando el cliente asincrónico, reemplaza `@beta_tool` con `@beta_async_tool` y define la función con `async def`.
</Note>

```python
import anthropic
import json
from anthropic import beta_tool

# Initialize client
client = anthropic.Anthropic()

# Define tools using the decorator
@beta_tool
def get_weather(location: str, unit: str = "fahrenheit") -> str:
    """Get the current weather in a given location.

    Args:
        location: The city and state, e.g. San Francisco, CA
        unit: Temperature unit, either 'celsius' or 'fahrenheit'
    """
    # In a full implementation, you'd call a weather API here
    return json.dumps({"temperature": "20°C", "condition": "Sunny"})

@beta_tool
def calculate_sum(a: int, b: int) -> str:
    """Add two numbers together.

    Args:
        a: First number
        b: Second number
    """
    return str(a + b)

# Use the tool runner
runner = client.beta.messages.tool_runner(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[get_weather, calculate_sum],
    messages=[
        {"role": "user", "content": "What's the weather like in Paris? Also, what's 15 + 27?"}
    ]
)
for message in runner:
    print(message.content[0].text)
```

La función decorada debe devolver un bloque de contenido o una matriz de bloques de contenido, incluyendo texto, imágenes o bloques de documentos. Esto permite que las herramientas devuelvan respuestas ricas y multimodales. Las cadenas devueltas se convertirán en un bloque de contenido de texto.
Si deseas devolver un objeto JSON estructurado a Claude, codifícalo como una cadena JSON antes de devolverlo. Los números, booleanos u otros primitivos que no sean cadenas también deben convertirse a cadenas.

El decorador `@beta_tool` inspeccionará los argumentos de la función y la cadena de documentación para extraer una representación de esquema json de la función dada, en el ejemplo anterior `calculate_sum` se convertirá en:

```json
{
  "name": "calculate_sum",
  "description": "Adds two integers together.",
  "input_schema": {
    "additionalProperties": false,
    "properties": {
      "left": {
        "description": "The first integer to add.",
        "title": "Left",
        "type": "integer"
      },
      "right": {
        "description": "The second integer to add.",
        "title": "Right",
        "type": "integer"
      }
    },
    "required": ["left", "right"],
    "type": "object"
  }
}
```

### Iterando sobre el ejecutor de herramientas

El ejecutor de herramientas devuelto por `tool_runner()` es iterable, que puedes iterar con un bucle `for`. Esto a menudo se conoce como un "bucle de llamada de herramienta".
Cada iteración del bucle produce un mensaje que fue devuelto por Claude.

Después de que tu código tenga la oportunidad de procesar el mensaje actual dentro del bucle, el ejecutor de herramientas verificará el mensaje para ver si Claude solicitó un uso de herramienta. Si es así, llamará a la herramienta y enviará el resultado de la herramienta de vuelta a Claude automáticamente, luego producirá el siguiente mensaje de Claude para comenzar la siguiente iteración de tu bucle.

Puedes terminar el bucle en cualquier iteración con una simple declaración `break`. El ejecutor de herramientas hará un bucle hasta que Claude devuelva un mensaje sin un uso de herramienta.

Si no te importan los mensajes intermedios, en lugar de usar un bucle, puedes llamar al método `until_done()`, que devolverá el mensaje final de Claude:

```python
runner = client.beta.messages.tool_runner(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[get_weather, calculate_sum],
    messages=[
        {"role": "user", "content": "What's the weather like in Paris? Also, what's 15 + 27?"}
    ]
)
final_message = runner.until_done()
print(final_message.content[0].text)
```

### Uso avanzado

Dentro del bucle, tienes la capacidad de personalizar completamente la siguiente solicitud del ejecutor de herramientas a la API de Mensajes.
El método `runner.generate_tool_call_response()` llamará a la herramienta (si Claude activó un uso de herramienta) y te dará acceso al resultado de la herramienta que se enviará de vuelta a la API de Mensajes.
Los métodos `runner.set_messages_params()` y `runner.append_messages()` te permiten modificar los parámetros para la siguiente solicitud de la API de Mensajes.

```python
runner = client.beta.messages.tool_runner(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[get_weather],
    messages=[{"role": "user", "content": "What's the weather in San Francisco?"}]
)
for message in runner:
    # Get the tool response that will be sent
    tool_response = runner.generate_tool_call_response()

    # Customize the next request
    runner.set_messages_params(lambda params: {
        **params,
        "max_tokens": 2048  # Increase tokens for next request
    })

    # Or add additional messages
    runner.append_messages(
        {"role": "user", "content": "Please be concise in your response."}
    )
```

### Transmisión

Cuando se habilita la transmisión con `stream=True`, cada valor emitido por el ejecutor de herramientas es un `BetaMessageStream` como se devuelve desde `anthropic.messages.stream()`. El `BetaMessageStream` es en sí mismo iterable que produce eventos de transmisión desde la API de Mensajes.

Puedes usar `message_stream.get_final_message()` para dejar que el SDK haga la acumulación de eventos de transmisión en el mensaje final para ti.

```python
runner = client.beta.messages.tool_runner(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[calculate_sum],
    messages=[{"role": "user", "content": "What is 15 + 27?"}],
    stream=True
)

# When streaming, the runner returns BetaMessageStream
for message_stream in runner:
    for event in message_stream:
        print('event:', event)
    print('message:', message_stream.get_final_message())

print(runner.until_done())
```

</Tab>
<Tab title="TypeScript (Zod)">

### Uso básico

Usa `betaZodTool()` para definiciones de herramientas seguras de tipos con validación Zod (requiere Zod 3.25.0 o superior).

```typescript
import { Anthropic } from '@anthropic-ai/sdk';
import { betaZodTool, betaTool } from '@anthropic-ai/sdk/helpers/beta/zod';
import { z } from 'zod';

const anthropic = new Anthropic();

// Using betaZodTool (requires Zod 3.25.0+)
const getWeatherTool = betaZodTool({
  name: 'get_weather',
  description: 'Get the current weather in a given location',
  inputSchema: z.object({
    location: z.string().describe('The city and state, e.g. San Francisco, CA'),
    unit: z.enum(['celsius', 'fahrenheit']).default('fahrenheit')
      .describe('Temperature unit')
  }),
  run: async (input) => {
    // In a full implementation, you'd call a weather API here
    return JSON.stringify({temperature: '20°C', condition: 'Sunny'});
  }
});

// Use the tool runner
const runner = anthropic.beta.messages.toolRunner({
  model: 'claude-sonnet-4-5',
  max_tokens: 1024,
  tools: [getWeatherTool],
  messages: [
    {
      role: 'user',
      content: "What's the weather like in Paris?"
    }
  ]
});

// Process messages as they come in
for await (const message of runner) {
  console.log(message.content[0].text);
}
```

La función `run` debe devolver un bloque de contenido o una matriz de bloques de contenido, incluyendo texto, imágenes o bloques de documentos. Esto permite que las herramientas devuelvan respuestas ricas y multimodales. Las cadenas devueltas se convertirán en un bloque de contenido de texto.
Si deseas devolver un objeto JSON estructurado a Claude, conviértelo a una cadena JSON antes de devolverlo. Los números, booleanos u otros primitivos que no sean cadenas también deben convertirse a cadenas.

### Iterando sobre el ejecutor de herramientas

El ejecutor de herramientas devuelto por `toolRunner()` es un iterable asincrónico, que puedes iterar con un bucle `for await ... of`. Esto a menudo se conoce como un "bucle de llamada de herramienta".
Cada iteración del bucle produce un mensaje que fue devuelto por Claude.

Después de que tu código tenga la oportunidad de procesar el mensaje actual dentro del bucle, el ejecutor de herramientas verificará el mensaje para ver si Claude solicitó un uso de herramienta. Si es así, llamará a la herramienta y enviará el resultado de la herramienta de vuelta a Claude automáticamente, luego producirá el siguiente mensaje de Claude para comenzar la siguiente iteración de tu bucle.

Puedes terminar el bucle en cualquier iteración con una simple declaración `break`. El ejecutor de herramientas hará un bucle hasta que Claude devuelva un mensaje sin un uso de herramienta.

Si no te importan los mensajes intermedios, en lugar de usar un bucle, simplemente puedes `await` el ejecutor de herramientas, que devolverá el mensaje final de Claude.

### Uso avanzado

Dentro del bucle, tienes la capacidad de personalizar completamente la siguiente solicitud del ejecutor de herramientas a la API de Mensajes.
El método `runner.generateToolResponse()` llamará a la herramienta (si Claude activó un uso de herramienta) y te dará acceso al resultado de la herramienta que se enviará de vuelta a la API de Mensajes.
Los métodos `runner.setMessagesParams()` y `runner.pushMessages()` te permiten modificar los parámetros para la siguiente solicitud de la API de Mensajes. Los parámetros actuales están disponibles bajo `runner.params`.

```typescript
const runner = anthropic.beta.messages.toolRunner({
  model: 'claude-sonnet-4-5',
  max_tokens: 1024,
  tools: [getWeatherTool],
  messages: [
    { role: 'user', content: "What's the weather in San Francisco?" }
  ]
});

for await (const message of runner) {
  // Get the tool response that will be sent
  const toolResponse = await runner.generateToolResponse();

  // Customize the next request
  runner.setMessagesParams(params => ({
    ...params,
    max_tokens: 2048  // Increase tokens for next request
  }));

  // Or add additional messages
  runner.pushMessages(
    { role: 'user', content: 'Please be concise in your response.' }
  );
}
```

### Transmisión

Cuando se habilita la transmisión con `stream: true`, cada valor emitido por el ejecutor de herramientas es un `MessageStream` como se devuelve desde `anthropic.messages.stream()`. El `MessageStream` es en sí mismo un iterable asincrónico que produce eventos de transmisión desde la API de Mensajes.

Puedes usar `messageStream.finalMessage()` para dejar que el SDK haga la acumulación de eventos de transmisión en el mensaje final para ti.

```typescript
const runner = anthropic.beta.messages.toolRunner({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 1000,
  messages: [{ role: 'user', content: 'What is the weather in San Francisco?' }],
  tools: [calculatorTool],
  stream: true,
});

// When streaming, the runner returns BetaMessageStream
for await (const messageStream of runner) {
  for await (const event of messageStream) {
    console.log('event:', event);
  }
  console.log('message:', await messageStream.finalMessage());
}

console.log(await runner);
```

</Tab>
<Tab title="TypeScript (JSON Schema)">

### Uso básico

Usa `betaTool()` para definiciones de herramientas seguras de tipos basadas en esquemas JSON. TypeScript y tu editor serán conscientes del tipo del parámetro `input` para autocompletado.

<Note>
La entrada generada por Claude no será validada en tiempo de ejecución. Realiza validación dentro de la función `run` si es necesario.
</Note>

```typescript
import { Anthropic } from '@anthropic-ai/sdk';
import { betaZodTool, betaTool } from '@anthropic-ai/sdk/helpers/beta/json-schema';
import { z } from 'zod';

const anthropic = new Anthropic();

// Using betaTool with JSON schema (no Zod required)
const calculateSumTool = betaTool({
  name: 'calculate_sum',
  description: 'Add two numbers together',
  inputSchema: {
    type: 'object',
    properties: {
      a: { type: 'number', description: 'First number' },
      b: { type: 'number', description: 'Second number' }
    },
    required: ['a', 'b']
  },
  run: async (input) => {
    return String(input.a + input.b);
  }
});

// Use the tool runner
const runner = anthropic.beta.messages.toolRunner({
  model: 'claude-sonnet-4-5',
  max_tokens: 1024,
  tools: [getWeatherTool, calculateSumTool],
  messages: [
    {
      role: 'user',
      content: "What's 15 + 27?"
    }
  ]
});

// Process messages as they come in
for await (const message of runner) {
  console.log(message.content[0].text);
}
```

La función `run` debe devolver cualquier bloque de contenido o matriz de bloques de contenido, incluyendo texto, imagen o bloques de documentos. Esto permite que las herramientas devuelvan respuestas ricas y multimodales. Las cadenas devueltas se convertirán en un bloque de contenido de texto.
Si deseas devolver un objeto JSON estructurado a Claude, codifícalo como una cadena JSON antes de devolverlo. Los números, booleanos u otros primitivos que no sean cadenas también deben convertirse a cadenas.

### Iterando sobre el ejecutor de herramientas

El ejecutor de herramientas devuelto por `toolRunner()` es un iterable asincrónico, que puedes iterar con un bucle `for await ... of`. Esto a menudo se conoce como un "bucle de llamada de herramienta".
Cada iteración del bucle produce un mensaje que fue devuelto por Claude.

Después de que tu código tenga la oportunidad de procesar el mensaje actual dentro del bucle, el ejecutor de herramientas verificará el mensaje para ver si Claude solicitó un uso de herramienta. Si es así, llamará a la herramienta y enviará el resultado de la herramienta de vuelta a Claude automáticamente, luego producirá el siguiente mensaje de Claude para comenzar la siguiente iteración de tu bucle.

Puedes terminar el bucle en cualquier iteración con una simple declaración `break`. El ejecutor de herramientas hará un bucle hasta que Claude devuelva un mensaje sin un uso de herramienta.

Si no te importan los mensajes intermedios, en lugar de usar un bucle, simplemente puedes `await` el ejecutor de herramientas, que devolverá el mensaje final de Claude.

### Uso avanzado

Dentro del bucle, tienes la capacidad de personalizar completamente la siguiente solicitud del ejecutor de herramientas a la API de Mensajes.
El método `runner.generateToolResponse()` llamará a la herramienta (si Claude activó un uso de herramienta) y te dará acceso al resultado de la herramienta que se enviará de vuelta a la API de Mensajes.
Los métodos `runner.setMessagesParams()` y `runner.pushMessages()` te permiten modificar los parámetros para la siguiente solicitud de la API de Mensajes. Los parámetros actuales están disponibles bajo `runner.params`.

```typescript
const runner = anthropic.beta.messages.toolRunner({
  model: 'claude-sonnet-4-5',
  max_tokens: 1024,
  tools: [getWeatherTool],
  messages: [
    { role: 'user', content: "What's the weather in San Francisco?" }
  ]
});

for await (const message of runner) {
  // Get the tool response that will be sent
  const toolResponse = await runner.generateToolResponse();

  // Customize the next request
  runner.setMessagesParams(params => ({
    ...params,
    max_tokens: 2048  // Increase tokens for next request
  }));

  // Or add additional messages
  runner.pushMessages(
    { role: 'user', content: 'Please be concise in your response.' }
  );
}
```

### Transmisión

Cuando se habilita la transmisión con `stream: true`, cada valor emitido por el ejecutor de herramientas es un `MessageStream` como se devuelve desde `anthropic.messages.stream()`. El `MessageStream` es en sí mismo un iterable asincrónico que produce eventos de transmisión desde la API de Mensajes.

Puedes usar `messageStream.finalMessage()` para dejar que el SDK haga la acumulación de eventos de transmisión en el mensaje final para ti.

```typescript
const runner = anthropic.beta.messages.toolRunner({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 1000,
  messages: [{ role: 'user', content: 'What is the weather in San Francisco?' }],
  tools: [calculatorTool],
  stream: true,
});

// When streaming, the runner returns BetaMessageStream
for await (const messageStream of runner) {
  for await (const event of messageStream) {
    console.log('event:', event);
  }
  console.log('message:', await messageStream.finalMessage());
}

console.log(await runner);
```

</Tab>
<Tab title="Ruby">

### Uso básico

Define herramientas usando `Anthropic::BaseTool` con un esquema de entrada, luego usa `client.beta.messages.tool_runner` para ejecutarlas.

```ruby
require "anthropic"

# Initialize client
client = Anthropic::Client.new

# Define input schema
class GetWeatherInput < Anthropic::BaseModel
  required :location, String, doc: "The city and state, e.g. San Francisco, CA"
  optional :unit, Anthropic::InputSchema::EnumOf["celsius", "fahrenheit"],
           doc: "Temperature unit"
end

# Define tool
class GetWeather < Anthropic::BaseTool
  doc "Get the current weather in a given location"
  input_schema GetWeatherInput

  def call(input)
    # In a full implementation, you'd call a weather API here
    JSON.generate({temperature: "20°C", condition: "Sunny"})
  end
end

class CalculateSumInput < Anthropic::BaseModel
  required :a, Integer, doc: "First number"
  required :b, Integer, doc: "Second number"
end

class CalculateSum < Anthropic::BaseTool
  doc "Add two numbers together"
  input_schema CalculateSumInput

  def call(input)
    (input.a + input.b).to_s
  end
end

# Use the tool runner
runner = client.beta.messages.tool_runner(
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: [GetWeather.new, CalculateSum.new],
  messages: [
    {role: "user", content: "What's the weather like in Paris? Also, what's 15 + 27?"}
  ]
)

runner.each_message do |message|
  message.content.each do |block|
    puts block.text if block.respond_to?(:text)
  end
end
```

El método `call` debe devolver una cadena o una matriz de bloques de contenido. Si deseas devolver un objeto JSON estructurado a Claude, codifícalo como una cadena JSON antes de devolverlo.

La clase `Anthropic::BaseTool` usa el método `doc` para la descripción de la herramienta e `input_schema` para definir los parámetros esperados. El SDK convertirá automáticamente esto al formato de esquema JSON apropiado.

### Iterando sobre el ejecutor de herramientas

El ejecutor de herramientas proporciona un método `each_message` que produce cada mensaje a medida que avanza la conversación. Esto a menudo se conoce como un "bucle de llamada de herramienta".

Después de que tu código tenga la oportunidad de procesar el mensaje actual, el ejecutor de herramientas verificará si Claude solicitó un uso de herramienta. Si es así, llamará a la herramienta y enviará el resultado de la herramienta de vuelta a Claude automáticamente, luego producirá el siguiente mensaje.

Si no te importan los mensajes intermedios, puedes usar el método `run_until_finished` para obtener todos los mensajes a la vez:

```ruby
runner = client.beta.messages.tool_runner(
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: [GetWeather.new, CalculateSum.new],
  messages: [
    {role: "user", content: "What's the weather like in Paris? Also, what's 15 + 27?"}
  ]
)

all_messages = runner.run_until_finished
all_messages.each { |msg| puts msg.content }
```

### Uso avanzado

El ejecutor de herramientas proporciona varios métodos para personalizar el comportamiento:

- `#next_message` - Avanza manualmente a través de la conversación un mensaje a la vez
- `#feed_messages` - Inyecta mensajes adicionales a mitad de la conversación
- `#params` - Accede o modifica los parámetros de solicitud actuales

```ruby
runner = client.beta.messages.tool_runner(
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: [GetWeather.new],
  messages: [{role: "user", content: "What's the weather in San Francisco?"}]
)

# Manual step-by-step control
message = runner.next_message
puts message.content

# Inject follow-up messages
runner.feed_messages([
  {role: "user", content: "Also check Boston"}
])

# Access current parameters
puts runner.params
```

### Transmisión

Cuando uses transmisión, itera con `each_streaming` para recibir eventos en tiempo real:

```ruby
runner = client.beta.messages.tool_runner(
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: [CalculateSum.new],
  messages: [{role: "user", content: "What is 15 + 27?"}]
)

runner.each_streaming do |event|
  case event
  when Anthropic::Streaming::TextEvent
    print event.text
  when Anthropic::Streaming::ToolUseEvent
    puts "\nTool called: #{event.tool_name}"
  end
end
```

</Tab>
</Tabs>

<Note>
El ejecutor de herramientas del SDK está en beta. El resto de este documento cubre la implementación manual de herramientas.
</Note>

## Controlar la salida de Claude

### Forzar el uso de herramientas

En algunos casos, es posible que desees que Claude use una herramienta específica para responder la pregunta del usuario, incluso si Claude cree que puede proporcionar una respuesta sin usar una herramienta. Puedes hacer esto especificando la herramienta en el campo `tool_choice` así:

```
tool_choice = {"type": "tool", "name": "get_weather"}
```

Cuando se trabaja con el parámetro tool_choice, tenemos cuatro opciones posibles:

- `auto` permite que Claude decida si llamar a cualquiera de las herramientas proporcionadas o no. Este es el valor predeterminado cuando se proporcionan `tools`.
- `any` le dice a Claude que debe usar una de las herramientas proporcionadas, pero no fuerza una herramienta en particular.
- `tool` nos permite forzar a Claude a usar siempre una herramienta en particular.
- `none` evita que Claude use cualquier herramienta. Este es el valor predeterminado cuando no se proporcionan `tools`.

<Note>
Cuando se usa [almacenamiento en caché de indicaciones](/docs/es/build-with-claude/prompt-caching#what-invalidates-the-cache), los cambios en el parámetro `tool_choice` invalidarán los bloques de mensajes en caché. Las definiciones de herramientas y las indicaciones del sistema permanecen en caché, pero el contenido del mensaje debe reprocesarse.
</Note>

Este diagrama ilustra cómo funciona cada opción:

<Frame>
  ![Image](/docs/images/tool_choice.png)
</Frame>

Ten en cuenta que cuando tienes `tool_choice` como `any` o `tool`, rellenaremos previamente el mensaje del asistente para forzar el uso de una herramienta. Esto significa que los modelos no emitirán una respuesta en lenguaje natural o explicación antes de los bloques de contenido `tool_use`, incluso si se les pide explícitamente que lo hagan.

<Note>
Cuando se usa [pensamiento extendido](/docs/es/build-with-claude/extended-thinking) con uso de herramientas, `tool_choice: {"type": "any"}` y `tool_choice: {"type": "tool", "name": "..."}` no son compatibles y resultarán en un error. Solo `tool_choice: {"type": "auto"}` (el predeterminado) y `tool_choice: {"type": "none"}` son compatibles con pensamiento extendido.
</Note>

Nuestras pruebas han demostrado que esto no debería reducir el rendimiento. Si deseas que el modelo proporcione contexto en lenguaje natural o explicaciones mientras aún solicitas que el modelo use una herramienta específica, puedes usar `{"type": "auto"}` para `tool_choice` (el predeterminado) y añadir instrucciones explícitas en un mensaje `user`. Por ejemplo: `¿Cuál es el clima en Londres? Usa la herramienta get_weather en tu respuesta.`

<Tip>
**Llamadas de herramientas garantizadas con herramientas estrictas**

Combina `tool_choice: {"type": "any"}` con [uso de herramientas estrictas](/docs/es/build-with-claude/structured-outputs) para garantizar tanto que una de tus herramientas será llamada COMO que las entradas de la herramienta sigan estrictamente tu esquema. Establece `strict: true` en tus definiciones de herramientas para habilitar la validación de esquema.
</Tip>

### Salida JSON

Las herramientas no necesariamente tienen que ser funciones del cliente — puedes usar herramientas en cualquier momento que desees que el modelo devuelva una salida JSON que siga un esquema proporcionado. Por ejemplo, podrías usar una herramienta `record_summary` con un esquema particular. Consulta [Uso de herramientas con Claude](/docs/es/agents-and-tools/tool-use/overview) para un ejemplo completo que funciona.

### Respuestas del modelo con herramientas

Al usar herramientas, Claude a menudo comentará sobre lo que está haciendo o responderá naturalmente al usuario antes de invocar herramientas.

Por ejemplo, dado el mensaje "¿Cuál es el clima en San Francisco ahora mismo, y qué hora es allí?", Claude podría responder con:

```json JSON
{
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "Te ayudaré a verificar el clima actual y la hora en San Francisco."
    },
    {
      "type": "tool_use",
      "id": "toolu_01A09q90qw90lq917835lq9",
      "name": "get_weather",
      "input": {"location": "San Francisco, CA"}
    }
  ]
}
```

Este estilo de respuesta natural ayuda a los usuarios a entender qué está haciendo Claude y crea una interacción más conversacional. Puedes guiar el estilo y contenido de estas respuestas a través de tus mensajes del sistema y proporcionando `<examples>` en tus mensajes.

Es importante notar que Claude puede usar varias frases y enfoques al explicar sus acciones. Tu código debe tratar estas respuestas como cualquier otro texto generado por el asistente, y no depender de convenciones de formato específicas.

### Uso paralelo de herramientas

Por defecto, Claude puede usar múltiples herramientas para responder a una consulta del usuario. Puedes desactivar este comportamiento mediante:

- Configurar `disable_parallel_tool_use=true` cuando el tipo de tool_choice es `auto`, lo que asegura que Claude use **como máximo una** herramienta
- Configurar `disable_parallel_tool_use=true` cuando el tipo de tool_choice es `any` o `tool`, lo que asegura que Claude use **exactamente una** herramienta

<section title="Ejemplo completo de uso paralelo de herramientas">

<Note>
**Más simple con Tool runner**: El ejemplo a continuación muestra el manejo manual de herramientas paralelas. Para la mayoría de casos de uso, [tool runner](#tool-runner-beta) maneja automáticamente la ejecución paralela de herramientas con mucho menos código.
</Note>

Aquí hay un ejemplo completo que muestra cómo formatear correctamente llamadas paralelas de herramientas en el historial de mensajes:

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# Define herramientas
tools = [
    {
        "name": "get_weather",
        "description": "Obtener el clima actual en una ubicación determinada",
        "input_schema": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "La ciudad y estado, p. ej. San Francisco, CA"
                }
            },
            "required": ["location"]
        }
    },
    {
        "name": "get_time",
        "description": "Obtener la hora actual en una zona horaria determinada",
        "input_schema": {
            "type": "object",
            "properties": {
                "timezone": {
                    "type": "string",
                    "description": "La zona horaria, p. ej. America/New_York"
                }
            },
            "required": ["timezone"]
        }
    }
]

# Solicitud inicial
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=tools,
    messages=[
        {
            "role": "user",
            "content": "¿Cuál es el clima en SF y NYC, y qué hora es allí?"
        }
    ]
)

# Respuesta de Claude con llamadas paralelas de herramientas
print("Claude quiere usar herramientas:", response.stop_reason == "tool_use")
print("Número de llamadas de herramientas:", len([c for c in response.content if c.type == "tool_use"]))

# Construir la conversación con resultados de herramientas
messages = [
    {
        "role": "user",
        "content": "¿Cuál es el clima en SF y NYC, y qué hora es allí?"
    },
    {
        "role": "assistant",
        "content": response.content  # Contiene múltiples bloques tool_use
    },
    {
        "role": "user",
        "content": [
            {
                "type": "tool_result",
                "tool_use_id": "toolu_01",  # Debe coincidir con el ID de tool_use
                "content": "San Francisco: 68°F, parcialmente nublado"
            },
            {
                "type": "tool_result",
                "tool_use_id": "toolu_02",
                "content": "Nueva York: 45°F, cielos despejados"
            },
            {
                "type": "tool_result",
                "tool_use_id": "toolu_03",
                "content": "Hora en San Francisco: 2:30 PM PST"
            },
            {
                "type": "tool_result",
                "tool_use_id": "toolu_04",
                "content": "Hora en Nueva York: 5:30 PM EST"
            }
        ]
    }
]

# Obtener respuesta final
final_response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=tools,
    messages=messages
)

print(final_response.content[0].text)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

// Define herramientas
const tools = [
  {
    name: "get_weather",
    description: "Obtener el clima actual en una ubicación determinada",
    input_schema: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "La ciudad y estado, p. ej. San Francisco, CA"
        }
      },
      required: ["location"]
    }
  },
  {
    name: "get_time",
    description: "Obtener la hora actual en una zona horaria determinada",
    input_schema: {
      type: "object",
      properties: {
        timezone: {
          type: "string",
          description: "La zona horaria, p. ej. America/New_York"
        }
      },
      required: ["timezone"]
    }
  }
];

// Solicitud inicial
const response = await anthropic.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: tools,
  messages: [
    {
      role: "user",
      content: "¿Cuál es el clima en SF y NYC, y qué hora es allí?"
    }
  ]
});

// Construir conversación con resultados de herramientas
const messages = [
  {
    role: "user",
    content: "¿Cuál es el clima en SF y NYC, y qué hora es allí?"
  },
  {
    role: "assistant",
    content: response.content  // Contiene múltiples bloques tool_use
  },
  {
    role: "user",
    content: [
      {
        type: "tool_result",
        tool_use_id: "toolu_01",  // Debe coincidir con el ID de tool_use
        content: "San Francisco: 68°F, parcialmente nublado"
      },
      {
        type: "tool_result",
        tool_use_id: "toolu_02",
        content: "Nueva York: 45°F, cielos despejados"
      },
      {
        type: "tool_result",
        tool_use_id: "toolu_03",
        content: "Hora en San Francisco: 2:30 PM PST"
      },
      {
        type: "tool_result",
        tool_use_id: "toolu_04",
        content: "Hora en Nueva York: 5:30 PM EST"
      }
    ]
  }
];

// Obtener respuesta final
const finalResponse = await anthropic.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: tools,
  messages: messages
});

console.log(finalResponse.content[0].text);
```
</CodeGroup>

El mensaje del asistente con llamadas paralelas de herramientas se vería así:

```json
{
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "Verificaré el clima y la hora para San Francisco y Nueva York."
    },
    {
      "type": "tool_use",
      "id": "toolu_01",
      "name": "get_weather",
      "input": {"location": "San Francisco, CA"}
    },
    {
      "type": "tool_use",
      "id": "toolu_02",
      "name": "get_weather",
      "input": {"location": "New York, NY"}
    },
    {
      "type": "tool_use",
      "id": "toolu_03",
      "name": "get_time",
      "input": {"timezone": "America/Los_Angeles"}
    },
    {
      "type": "tool_use",
      "id": "toolu_04",
      "name": "get_time",
      "input": {"timezone": "America/New_York"}
    }
  ]
}
```

</section>
<section title="Script de prueba completo para herramientas paralelas">

Aquí hay un script completo y ejecutable para probar y verificar que las llamadas paralelas de herramientas funcionan correctamente:

<CodeGroup>
```python Python
#!/usr/bin/env python3
"""Script de prueba para verificar llamadas paralelas de herramientas con la API de Claude"""

import os
from anthropic import Anthropic

# Inicializar cliente
client = Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

# Define herramientas
tools = [
    {
        "name": "get_weather",
        "description": "Obtener el clima actual en una ubicación determinada",
        "input_schema": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "La ciudad y estado, p. ej. San Francisco, CA"
                }
            },
            "required": ["location"]
        }
    },
    {
        "name": "get_time",
        "description": "Obtener la hora actual en una zona horaria determinada",
        "input_schema": {
            "type": "object",
            "properties": {
                "timezone": {
                    "type": "string",
                    "description": "La zona horaria, p. ej. America/New_York"
                }
            },
            "required": ["timezone"]
        }
    }
]

# Conversación de prueba con llamadas paralelas de herramientas
messages = [
    {
        "role": "user",
        "content": "¿Cuál es el clima en SF y NYC, y qué hora es allí?"
    }
]

# Hacer solicitud inicial
print("Solicitando llamadas paralelas de herramientas...")
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=messages,
    tools=tools
)

# Verificar llamadas paralelas de herramientas
tool_uses = [block for block in response.content if block.type == "tool_use"]
print(f"\n✓ Claude hizo {len(tool_uses)} llamadas de herramientas")

if len(tool_uses) > 1:
    print("✓ ¡Llamadas paralelas de herramientas detectadas!")
    for tool in tool_uses:
        print(f"  - {tool.name}: {tool.input}")
else:
    print("✗ No se detectaron llamadas paralelas de herramientas")

# Simular ejecución de herramientas y formatear resultados correctamente
tool_results = []
for tool_use in tool_uses:
    if tool_use.name == "get_weather":
        if "San Francisco" in str(tool_use.input):
            result = "San Francisco: 68°F, parcialmente nublado"
        else:
            result = "Nueva York: 45°F, cielos despejados"
    else:  # get_time
        if "Los_Angeles" in str(tool_use.input):
            result = "2:30 PM PST"
        else:
            result = "5:30 PM EST"

    tool_results.append({
        "type": "tool_result",
        "tool_use_id": tool_use.id,
        "content": result
    })

# Continuar conversación con resultados de herramientas
messages.extend([
    {"role": "assistant", "content": response.content},
    {"role": "user", "content": tool_results}  # ¡Todos los resultados en un mensaje!
])

# Obtener respuesta final
print("\nObteniendo respuesta final...")
final_response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=messages,
    tools=tools
)

print(f"\nRespuesta de Claude:\n{final_response.content[0].text}")

# Verificar formato
print("\n--- Verificación ---")
print(f"✓ Resultados de herramientas enviados en un único mensaje de usuario: {len(tool_results)} resultados")
print("✓ Sin texto antes de los resultados de herramientas en el array de contenido")
print("✓ Conversación formateada correctamente para futuro uso paralelo de herramientas")
```

```typescript TypeScript
#!/usr/bin/env node
// Script de prueba para verificar llamadas paralelas de herramientas con la API de Claude

import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Define herramientas
const tools = [
  {
    name: "get_weather",
    description: "Obtener el clima actual en una ubicación determinada",
    input_schema: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "La ciudad y estado, p. ej. San Francisco, CA"
        }
      },
      required: ["location"]
    }
  },
  {
    name: "get_time",
    description: "Obtener la hora actual en una zona horaria determinada",
    input_schema: {
      type: "object",
      properties: {
        timezone: {
          type: "string",
          description: "La zona horaria, p. ej. America/New_York"
        }
      },
      required: ["timezone"]
    }
  }
];

async function testParallelTools() {
  // Hacer solicitud inicial
  console.log("Solicitando llamadas paralelas de herramientas...");
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    messages: [{
      role: "user",
      content: "¿Cuál es el clima en SF y NYC, y qué hora es allí?"
    }],
    tools: tools
  });

  // Verificar llamadas paralelas de herramientas
  const toolUses = response.content.filter(block => block.type === "tool_use");
  console.log(`\n✓ Claude hizo ${toolUses.length} llamadas de herramientas`);

  if (toolUses.length > 1) {
    console.log("✓ ¡Llamadas paralelas de herramientas detectadas!");
    toolUses.forEach(tool => {
      console.log(`  - ${tool.name}: ${JSON.stringify(tool.input)}`);
    });
  } else {
    console.log("✗ No se detectaron llamadas paralelas de herramientas");
  }

  // Simular ejecución de herramientas y formatear resultados correctamente
  const toolResults = toolUses.map(toolUse => {
    let result;
    if (toolUse.name === "get_weather") {
      result = toolUse.input.location.includes("San Francisco")
        ? "San Francisco: 68°F, parcialmente nublado"
        : "Nueva York: 45°F, cielos despejados";
    } else {
      result = toolUse.input.timezone.includes("Los_Angeles")
        ? "2:30 PM PST"
        : "5:30 PM EST";
    }

    return {
      type: "tool_result",
      tool_use_id: toolUse.id,
      content: result
    };
  });

  // Obtener respuesta final con formato correcto
  console.log("\nObteniendo respuesta final...");
  const finalResponse = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    messages: [
      { role: "user", content: "¿Cuál es el clima en SF y NYC, y qué hora es allí?" },
      { role: "assistant", content: response.content },
      { role: "user", content: toolResults }  // ¡Todos los resultados en un mensaje!
    ],
    tools: tools
  });

  console.log(`\nRespuesta de Claude:\n${finalResponse.content[0].text}`);

  // Verificar formato
  console.log("\n--- Verificación ---");
  console.log(`✓ Resultados de herramientas enviados en un único mensaje de usuario: ${toolResults.length} resultados`);
  console.log("✓ Sin texto antes de los resultados de herramientas en el array de contenido");
  console.log("✓ Conversación formateada correctamente para futuro uso paralelo de herramientas");
}

testParallelTools().catch(console.error);
```
</CodeGroup>

Este script demuestra:
- Cómo formatear correctamente llamadas paralelas de herramientas y resultados
- Cómo verificar que se están realizando llamadas paralelas
- La estructura de mensaje correcta que fomenta el futuro uso paralelo de herramientas
- Errores comunes a evitar (como texto antes de resultados de herramientas)

Ejecuta este script para probar tu implementación y asegurar que Claude está realizando llamadas paralelas de herramientas de manera efectiva.

</section>

#### Maximizando el uso paralelo de herramientas

Aunque los modelos Claude 4 tienen excelentes capacidades de uso paralelo de herramientas por defecto, puedes aumentar la probabilidad de ejecución paralela de herramientas en todos los modelos con indicaciones dirigidas:

<section title="Mensajes del sistema para uso paralelo de herramientas">

Para modelos Claude 4 (Opus 4 y Sonnet 4), agrega esto a tu mensaje del sistema:
```text
Para máxima eficiencia, siempre que necesites realizar múltiples operaciones independientes, invoca todas las herramientas relevantes simultáneamente en lugar de secuencialmente.
```

Para un uso paralelo de herramientas aún más fuerte (recomendado si el predeterminado no es suficiente), usa:
```text
<use_parallel_tool_calls>
Para máxima eficiencia, siempre que realices múltiples operaciones independientes, invoca todas las herramientas relevantes simultáneamente en lugar de secuencialmente. Prioriza llamar a herramientas en paralelo siempre que sea posible. Por ejemplo, al leer 3 archivos, ejecuta 3 llamadas de herramientas en paralelo para leer los 3 archivos en contexto al mismo tiempo. Al ejecutar múltiples comandos de solo lectura como `ls` o `list_dir`, siempre ejecuta todos los comandos en paralelo. Inclínate hacia maximizar llamadas paralelas de herramientas en lugar de ejecutar demasiadas herramientas secuencialmente.
</use_parallel_tool_calls>
```

</section>
<section title="Indicaciones de mensajes de usuario">

También puedes fomentar el uso paralelo de herramientas dentro de mensajes de usuario específicos:

```python
# En lugar de:
"¿Cuál es el clima en París? También verifica Londres."

# Usa:
"Verifica el clima en París y Londres simultáneamente."

# O sé explícito:
"Por favor, usa llamadas paralelas de herramientas para obtener el clima de París, Londres y Tokio al mismo tiempo."
```

</section>

<Warning>
**Uso paralelo de herramientas con Claude Sonnet 3.7**

Claude Sonnet 3.7 puede ser menos probable que realice llamadas paralelas de herramientas en una respuesta, incluso cuando no hayas configurado `disable_parallel_tool_use`. Recomendamos [actualizar a modelos Claude 4](/docs/es/about-claude/models/migrating-to-claude-4), que tienen uso de herramientas eficiente en tokens y llamadas paralelas de herramientas mejoradas.

Si aún estás usando Claude Sonnet 3.7, puedes habilitar el encabezado beta `token-efficient-tools-2025-02-19` [beta header](/docs/es/api/beta-headers), que ayuda a fomentar que Claude use herramientas paralelas. También puedes introducir una "herramienta de lote" que pueda actuar como una meta-herramienta para envolver invocaciones a otras herramientas simultáneamente.

Consulta [este ejemplo](https://github.com/anthropics/anthropic-cookbook/blob/main/tool_use/parallel_tools_claude_3_7_sonnet.ipynb) en nuestro cookbook para saber cómo usar esta solución alternativa.

</Warning>

## Manejo de bloques de contenido de uso de herramientas y resultado de herramientas

<Note>
**Más simple con Tool runner**: El manejo manual de herramientas descrito en esta sección se gestiona automáticamente mediante [tool runner](#tool-runner-beta). Usa esta sección cuando necesites control personalizado sobre la ejecución de herramientas.
</Note>

La respuesta de Claude difiere según si usa una herramienta de cliente o servidor.

### Manejo de resultados de herramientas de cliente

La respuesta tendrá un `stop_reason` de `tool_use` y uno o más bloques de contenido `tool_use` que incluyen:

- `id`: Un identificador único para este bloque de uso de herramienta en particular. Esto se usará para hacer coincidir los resultados de la herramienta más adelante.
- `name`: El nombre de la herramienta que se está usando.
- `input`: Un objeto que contiene la entrada que se pasa a la herramienta, conforme al `input_schema` de la herramienta.

<section title="Ejemplo de respuesta de API con un bloque de contenido `tool_use`">

```json JSON
{
  "id": "msg_01Aq9w938a90dw8q",
  "model": "claude-sonnet-4-5",
  "stop_reason": "tool_use",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "Verificaré el clima actual en San Francisco para ti."
    },
    {
      "type": "tool_use",
      "id": "toolu_01A09q90qw90lq917835lq9",
      "name": "get_weather",
      "input": {"location": "San Francisco, CA", "unit": "celsius"}
    }
  ]
}
```

</section>

Cuando recibas una respuesta de uso de herramienta para una herramienta de cliente, debes:

1. Extraer el `name`, `id` e `input` del bloque `tool_use`.
2. Ejecutar la herramienta real en tu base de código correspondiente a ese nombre de herramienta, pasando la `input` de la herramienta.
3. Continuar la conversación enviando un nuevo mensaje con el `role` de `user` y un bloque de `content` que contenga el tipo `tool_result` y la siguiente información:
   - `tool_use_id`: El `id` de la solicitud de uso de herramienta para la cual esto es un resultado.
   - `content`: El resultado de la herramienta, como una cadena (p. ej. `"content": "15 grados"`), una lista de bloques de contenido anidados (p. ej. `"content": [{"type": "text", "text": "15 grados"}]`), o una lista de bloques de documento (p. ej. `"content": ["type": "document", "source": {"type": "text", "media_type": "text/plain", "data": "15 grados"}]`). Estos bloques de contenido pueden usar los tipos `text`, `image` o `document`.
   - `is_error` (opcional): Configura a `true` si la ejecución de la herramienta resultó en un error.

<Note>
**Requisitos de formato importantes**:
- Los bloques de resultado de herramienta deben seguir inmediatamente a sus bloques de uso de herramienta correspondientes en el historial de mensajes. No puedes incluir ningún mensaje entre el mensaje de uso de herramienta del asistente y el mensaje de resultado de herramienta del usuario.
- En el mensaje del usuario que contiene resultados de herramientas, los bloques tool_result deben venir PRIMERO en el array de contenido. Cualquier texto debe venir DESPUÉS de todos los resultados de herramientas.

Por ejemplo, esto causará un error 400:
```json
{"role": "user", "content": [
  {"type": "text", "text": "Aquí están los resultados:"},  // ❌ Texto antes de tool_result
  {"type": "tool_result", "tool_use_id": "toolu_01", ...}
]}
```

Esto es correcto:
```json
{"role": "user", "content": [
  {"type": "tool_result", "tool_use_id": "toolu_01", ...},
  {"type": "text", "text": "¿Qué debo hacer a continuación?"}  // ✅ Texto después de tool_result
]}
```

Si recibes un error como "tool_use ids were found without tool_result blocks immediately after", verifica que tus resultados de herramientas estén formateados correctamente.
</Note>

<section title="Ejemplo de resultado de herramienta exitoso">

```json JSON
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "15 grados"
    }
  ]
}
```

</section>

<section title="Ejemplo de resultado de herramienta con imágenes">

```json JSON
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": [
        {"type": "text", "text": "15 grados"},
        {
          "type": "image",
          "source": {
            "type": "base64",
            "media_type": "image/jpeg",
            "data": "/9j/4AAQSkZJRg...",
          }
        }
      ]
    }
  ]
}
```

</section>
<section title="Ejemplo de resultado de herramienta vacío">

```json JSON
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
    }
  ]
}
```

</section>

<section title="Ejemplo de resultado de herramienta con documentos">

```json JSON
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": [
        {"type": "text", "text": "El clima es"},
        {
          "type": "document",
          "source": {
            "type": "text",
            "media_type": "text/plain",
            "data": "15 grados"
          }
        }
      ]
    }
  ]
}
```

</section>

Después de recibir el resultado de la herramienta, Claude usará esa información para continuar generando una respuesta a la solicitud original del usuario.

### Manejo de resultados de herramientas de servidor

Claude ejecuta la herramienta internamente e incorpora los resultados directamente en su respuesta sin requerir interacción adicional del usuario.

<Tip>
  **Diferencias de otras APIs**

A diferencia de las APIs que separan el uso de herramientas o usan roles especiales como `tool` o `function`, la API de Claude integra herramientas directamente en la estructura de mensaje `user` y `assistant`.

Los mensajes contienen arrays de bloques `text`, `image`, `tool_use` y `tool_result`. Los mensajes `user` incluyen contenido de cliente y `tool_result`, mientras que los mensajes `assistant` contienen contenido generado por IA y `tool_use`.

</Tip>

### Manejo de la razón de parada `max_tokens`

Si la [respuesta de Claude se corta debido a alcanzar el límite `max_tokens`](/docs/es/build-with-claude/handling-stop-reasons#max-tokens), y la respuesta truncada contiene un bloque de uso de herramienta incompleto, necesitarás reintentar la solicitud con un valor `max_tokens` más alto para obtener el uso de herramienta completo.

<CodeGroup>
```python Python
# Verificar si la respuesta fue truncada durante el uso de herramienta
if response.stop_reason == "max_tokens":
    # Verificar si el último bloque de contenido es un tool_use incompleto
    last_block = response.content[-1]
    if last_block.type == "tool_use":
        # Enviar la solicitud con max_tokens más alto
        response = client.messages.create(
            model="claude-sonnet-4-5",
            max_tokens=4096,  # Límite aumentado
            messages=messages,
            tools=tools
        )
```

```typescript TypeScript
// Verificar si la respuesta fue truncada durante el uso de herramienta
if (response.stop_reason === "max_tokens") {
  // Verificar si el último bloque de contenido es un tool_use incompleto
  const lastBlock = response.content[response.content.length - 1];
  if (lastBlock.type === "tool_use") {
    // Enviar la solicitud con max_tokens más alto
    response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 4096, // Límite aumentado
      messages: messages,
      tools: tools
    });
  }
}
```
</CodeGroup>

#### Manejo de la razón de parada `pause_turn`

Cuando se usan herramientas de servidor como búsqueda web, la API puede devolver una razón de parada `pause_turn`, indicando que la API ha pausado un turno de larga duración.

Aquí se explica cómo manejar la razón de parada `pause_turn`:

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# Solicitud inicial con búsqueda web
response = client.messages.create(
    model="claude-3-7-sonnet-latest",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": "Busca información completa sobre avances en computación cuántica en 2025"
        }
    ],
    tools=[{
        "type": "web_search_20250305",
        "name": "web_search",
        "max_uses": 10
    }]
)

# Verificar si la respuesta tiene razón de parada pause_turn
if response.stop_reason == "pause_turn":
    # Continuar la conversación con el contenido pausado
    messages = [
        {"role": "user", "content": "Busca información completa sobre avances en computación cuántica en 2025"},
        {"role": "assistant", "content": response.content}
    ]

    # Enviar la solicitud de continuación
    continuation = client.messages.create(
        model="claude-3-7-sonnet-latest",
        max_tokens=1024,
        messages=messages,
        tools=[{
            "type": "web_search_20250305",
            "name": "web_search",
            "max_uses": 10
        }]
    )

    print(continuation)
else:
    print(response)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

// Solicitud inicial con búsqueda web
const response = await anthropic.messages.create({
  model: "claude-3-7-sonnet-latest",
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: "Busca información completa sobre avances en computación cuántica en 2025"
    }
  ],
  tools: [{
    type: "web_search_20250305",
    name: "web_search",
    max_uses: 10
  }]
});

// Verificar si la respuesta tiene razón de parada pause_turn
if (response.stop_reason === "pause_turn") {
  // Continuar la conversación con el contenido pausado
  const messages = [
    { role: "user", content: "Busca información completa sobre avances en computación cuántica en 2025" },
    { role: "assistant", content: response.content }
  ];

  // Enviar la solicitud de continuación
  const continuation = await anthropic.messages.create({
    model: "claude-3-7-sonnet-latest",
    max_tokens: 1024,
    messages: messages,
    tools: [{
      type: "web_search_20250305",
      name: "web_search",
      max_uses: 10
    }]
  });

  console.log(continuation);
} else {
  console.log(response);
}
```
</CodeGroup>

Al manejar `pause_turn`:
- **Continuar la conversación**: Pasa la respuesta pausada tal como está en una solicitud posterior para permitir que Claude continúe su turno
- **Modificar si es necesario**: Opcionalmente puedes modificar el contenido antes de continuar si deseas interrumpir o redirigir la conversación
- **Preservar estado de herramientas**: Incluye las mismas herramientas en la solicitud de continuación para mantener la funcionalidad

## Solución de problemas de errores

<Note>
**Manejo de errores integrado**: [Tool runner](#tool-runner-beta) proporciona manejo automático de errores para la mayoría de escenarios comunes. Esta sección cubre el manejo manual de errores para casos de uso avanzados.
</Note>

Hay varios tipos diferentes de errores que pueden ocurrir al usar herramientas con Claude:

<section title="Error de ejecución de herramienta">

Si la herramienta misma lanza un error durante la ejecución (p. ej. un error de red al obtener datos meteorológicos), puedes devolver el mensaje de error en el `content` junto con `"is_error": true`:

```json JSON
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "ConnectionError: el servicio de API meteorológica no está disponible (HTTP 500)",
      "is_error": true
    }
  ]
}
```

Claude entonces incorporará este error en su respuesta al usuario, p. ej. "Lo siento, no pude recuperar el clima actual porque el servicio de API meteorológica no está disponible. Por favor, intenta de nuevo más tarde."

</section>
<section title="Nombre de herramienta inválido">

Si el intento de Claude de usar una herramienta es inválido (p. ej. parámetros requeridos faltantes), generalmente significa que no había suficiente información para que Claude usara la herramienta correctamente. Tu mejor opción durante el desarrollo es intentar la solicitud de nuevo con valores de `description` más detallados en tus definiciones de herramientas.

Sin embargo, también puedes continuar la conversación hacia adelante con un `tool_result` que indique el error, y Claude intentará usar la herramienta de nuevo con la información faltante rellenada:

```json JSON
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Error: Parámetro requerido 'location' faltante",
      "is_error": true
    }
  ]
}
```

Si una solicitud de herramienta es inválida o faltan parámetros, Claude reintentará 2-3 veces con correcciones antes de disculparse con el usuario.

<Tip>
Para eliminar completamente llamadas de herramientas inválidas, usa [uso estricto de herramientas](/docs/es/build-with-claude/structured-outputs) con `strict: true` en tus definiciones de herramientas. Esto garantiza que las entradas de herramientas siempre coincidirán exactamente con tu esquema, previniendo parámetros faltantes y desajustes de tipo.
</Tip>

</section>
<section title="Etiquetas \<search_quality_reflection>">

Para evitar que Claude reflexione sobre la calidad de los resultados de búsqueda devueltos con etiquetas \<search_quality_reflection>, agrega "No reflexiones sobre la calidad de los resultados de búsqueda devueltos en tu respuesta" a tu mensaje.

</section>
<section title="Errores de herramientas de servidor">

Cuando las herramientas de servidor encuentran errores (p. ej., problemas de red con Búsqueda Web), Claude manejará estos errores de manera transparente e intentará proporcionar una respuesta alternativa o explicación al usuario. A diferencia de las herramientas de cliente, no necesitas manejar resultados `is_error` para herramientas de servidor.

Para búsqueda web específicamente, los códigos de error posibles incluyen:
- `too_many_requests`: Límite de velocidad excedido
- `invalid_input`: Parámetro de consulta de búsqueda inválido
- `max_uses_exceeded`: Máximo de usos de herramienta de búsqueda web excedido
- `query_too_long`: La consulta excede la longitud máxima
- `unavailable`: Ocurrió un error interno

</section>
<section title="Las llamadas paralelas de herramientas no funcionan">

Si Claude no está realizando llamadas paralelas de herramientas cuando se espera, verifica estos problemas comunes:

**1. Formato incorrecto de resultado de herramienta**

El problema más común es formatear incorrectamente los resultados de herramientas en el historial de conversación. Esto "enseña" a Claude a evitar llamadas paralelas.

Específicamente para uso paralelo de herramientas:
- ❌ **Incorrecto**: Enviar mensajes de usuario separados para cada resultado de herramienta
- ✅ **Correcto**: Todos los resultados de herramientas deben estar en un único mensaje de usuario

```json
// ❌ Esto reduce el uso paralelo de herramientas
[
  {"role": "assistant", "content": [tool_use_1, tool_use_2]},
  {"role": "user", "content": [tool_result_1]},
  {"role": "user", "content": [tool_result_2]}  // Mensaje separado
]

// ✅ Esto mantiene el uso paralelo de herramientas
[
  {"role": "assistant", "content": [tool_use_1, tool_use_2]},
  {"role": "user", "content": [tool_result_1, tool_result_2]}  // Mensaje único
]
```

Consulta los [requisitos de formato general anteriores](#handling-tool-use-and-tool-result-content-blocks) para otras reglas de formato.

**2. Indicación débil**

La indicación predeterminada puede no ser suficiente. Usa lenguaje más fuerte:

```text
<use_parallel_tool_calls>
Para máxima eficiencia, siempre que realices múltiples operaciones independientes,
invoca todas las herramientas relevantes simultáneamente en lugar de secuencialmente.
Prioriza llamar a herramientas en paralelo siempre que sea posible.
</use_parallel_tool_calls>
```

**3. Medición del uso paralelo de herramientas**

Para verificar que las llamadas paralelas de herramientas están funcionando:

```python
# Calcular herramientas promedio por mensaje de llamada de herramienta
tool_call_messages = [msg for msg in messages if any(
    block.type == "tool_use" for block in msg.content
)]
total_tool_calls = sum(
    len([b for b in msg.content if b.type == "tool_use"])
    for msg in tool_call_messages
)
avg_tools_per_message = total_tool_calls / len(tool_call_messages)
print(f"Herramientas promedio por mensaje: {avg_tools_per_message}")
# Debe ser > 1.0 si las llamadas paralelas están funcionando
```

**4. Comportamiento específico del modelo**

- Claude Opus 4.5, Opus 4.1 y Sonnet 4: Excelentes en uso paralelo de herramientas con indicación mínima
- Claude Sonnet 3.7: Puede necesitar indicación más fuerte o el encabezado beta `token-efficient-tools-2025-02-19` [beta header](/docs/es/api/beta-headers). Considera [actualizar a Claude 4](/docs/es/about-claude/models/migrating-to-claude-4).
- Claude Haiku: Menos probable que use herramientas paralelas sin indicación explícita

</section>