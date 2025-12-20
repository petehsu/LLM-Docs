# Procesamiento por lotes

Procesa grandes volúmenes de solicitudes de forma asincrónica con la API de Message Batches

---

El procesamiento por lotes es un enfoque poderoso para manejar grandes volúmenes de solicitudes de manera eficiente. En lugar de procesar solicitudes una a la vez con respuestas inmediatas, el procesamiento por lotes te permite enviar múltiples solicitudes juntas para procesamiento asincrónico. Este patrón es particularmente útil cuando:

- Necesitas procesar grandes volúmenes de datos
- Las respuestas inmediatas no son necesarias
- Deseas optimizar la eficiencia de costos
- Estás ejecutando evaluaciones o análisis a gran escala

La API de Message Batches es nuestra primera implementación de este patrón.

---

# API de Message Batches

La API de Message Batches es una forma poderosa y rentable de procesar de forma asincrónica grandes volúmenes de solicitudes de [Messages](/docs/es/api/messages). Este enfoque es muy adecuado para tareas que no requieren respuestas inmediatas, con la mayoría de lotes finalizándose en menos de 1 hora mientras se reducen costos en un 50% y se aumenta el rendimiento.

Puedes [explorar la referencia de API directamente](/docs/es/api/creating-message-batches), además de esta guía.

## Cómo funciona la API de Message Batches

Cuando envías una solicitud a la API de Message Batches:

1. El sistema crea un nuevo Message Batch con las solicitudes de Messages proporcionadas.
2. El lote se procesa entonces de forma asincrónica, con cada solicitud manejada independientemente.
3. Puedes sondear el estado del lote y recuperar resultados cuando el procesamiento haya finalizado para todas las solicitudes.

Esto es especialmente útil para operaciones en masa que no requieren resultados inmediatos, tales como:
- Evaluaciones a gran escala: Procesa miles de casos de prueba de manera eficiente.
- Moderación de contenido: Analiza grandes volúmenes de contenido generado por usuarios de forma asincrónica.
- Análisis de datos: Genera información o resúmenes para grandes conjuntos de datos.
- Generación de contenido en masa: Crea grandes cantidades de texto para varios propósitos (por ejemplo, descripciones de productos, resúmenes de artículos).

### Limitaciones de lotes
- Un Message Batch está limitado a 100,000 solicitudes de Message o 256 MB de tamaño, lo que se alcance primero.
- Procesamos cada lote lo más rápido posible, con la mayoría de lotes completándose dentro de 1 hora. Podrás acceder a los resultados del lote cuando todos los mensajes se hayan completado o después de 24 horas, lo que ocurra primero. Los lotes expirarán si el procesamiento no se completa dentro de 24 horas.
- Los resultados del lote están disponibles durante 29 días después de la creación. Después de eso, aún puedes ver el Batch, pero sus resultados ya no estarán disponibles para descargar.
- Los lotes están limitados a un [Workspace](/settings/workspaces). Puedes ver todos los lotes—y sus resultados—que fueron creados dentro del Workspace al que pertenece tu clave de API.
- Los límites de velocidad se aplican tanto a las solicitudes HTTP de la API de Batches como al número de solicitudes dentro de un lote esperando ser procesadas. Consulta [Límites de velocidad de la API de Message Batches](/docs/es/api/rate-limits#message-batches-api). Además, podemos ralentizar el procesamiento según la demanda actual y tu volumen de solicitudes. En ese caso, puedes ver más solicitudes expirando después de 24 horas.
- Debido al alto rendimiento y procesamiento concurrente, los lotes pueden exceder ligeramente el [límite de gasto](/settings/limits) configurado de tu Workspace.

### Modelos soportados

Todos los [modelos activos](/docs/es/about-claude/models/overview) soportan la API de Message Batches.

### Qué se puede procesar por lotes
Cualquier solicitud que puedas hacer a la API de Messages puede incluirse en un lote. Esto incluye:

- Visión
- Uso de herramientas
- Mensajes del sistema
- Conversaciones de múltiples turnos
- Cualquier característica beta

Como cada solicitud en el lote se procesa independientemente, puedes mezclar diferentes tipos de solicitudes dentro de un único lote.

<Tip>
Como los lotes pueden tardar más de 5 minutos en procesarse, considera usar la [duración de caché de 1 hora](/docs/es/build-with-claude/prompt-caching#1-hour-cache-duration) con almacenamiento en caché de indicaciones para mejores tasas de acierto de caché al procesar lotes con contexto compartido.
</Tip>

---
## Precios

La API de Batches ofrece ahorros de costos significativos. Todo el uso se cobra al 50% de los precios estándar de la API.

| Model             | Batch input      | Batch output    |
|-------------------|------------------|-----------------|
| Claude Opus 4.5     | $2.50 / MTok     | $12.50 / MTok   |
| Claude Opus 4.1     | $7.50 / MTok     | $37.50 / MTok   |
| Claude Opus 4     | $7.50 / MTok     | $37.50 / MTok   |
| Claude Sonnet 4.5   | $1.50 / MTok     | $7.50 / MTok    |
| Claude Sonnet 4   | $1.50 / MTok     | $7.50 / MTok    |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations)) | $1.50 / MTok     | $7.50 / MTok    |
| Claude Haiku 4.5  | $0.50 / MTok     | $2.50 / MTok    |
| Claude Haiku 3.5  | $0.40 / MTok     | $2 / MTok       |
| Claude Opus 3 ([deprecated](/docs/en/about-claude/model-deprecations))  | $7.50 / MTok     | $37.50 / MTok   |
| Claude Haiku 3    | $0.125 / MTok    | $0.625 / MTok   |

---
## Cómo usar la API de Message Batches

### Prepara y crea tu lote

Un Message Batch se compone de una lista de solicitudes para crear un Message. La forma de una solicitud individual se compone de:
- Un `custom_id` único para identificar la solicitud de Messages
- Un objeto `params` con los parámetros estándar de [Messages API](/docs/es/api/messages)

Puedes [crear un lote](/docs/es/api/creating-message-batches) pasando esta lista al parámetro `requests`:

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages/batches \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "requests": [
        {
            "custom_id": "my-first-request",
            "params": {
                "model": "claude-sonnet-4-5",
                "max_tokens": 1024,
                "messages": [
                    {"role": "user", "content": "Hello, world"}
                ]
            }
        },
        {
            "custom_id": "my-second-request",
            "params": {
                "model": "claude-sonnet-4-5",
                "max_tokens": 1024,
                "messages": [
                    {"role": "user", "content": "Hi again, friend"}
                ]
            }
        }
    ]
}'
```

```python Python
import anthropic
from anthropic.types.message_create_params import MessageCreateParamsNonStreaming
from anthropic.types.messages.batch_create_params import Request

client = anthropic.Anthropic()

message_batch = client.messages.batches.create(
    requests=[
        Request(
            custom_id="my-first-request",
            params=MessageCreateParamsNonStreaming(
                model="claude-sonnet-4-5",
                max_tokens=1024,
                messages=[{
                    "role": "user",
                    "content": "Hello, world",
                }]
            )
        ),
        Request(
            custom_id="my-second-request",
            params=MessageCreateParamsNonStreaming(
                model="claude-sonnet-4-5",
                max_tokens=1024,
                messages=[{
                    "role": "user",
                    "content": "Hi again, friend",
                }]
            )
        )
    ]
)

print(message_batch)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const messageBatch = await anthropic.messages.batches.create({
  requests: [{
    custom_id: "my-first-request",
    params: {
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      messages: [
        {"role": "user", "content": "Hello, world"}
      ]
    }
  }, {
    custom_id: "my-second-request",
    params: {
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      messages: [
        {"role": "user", "content": "Hi again, friend"}
      ]
    }
  }]
});

console.log(messageBatch)
```

```java Java
import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.batches.*;

public class BatchExample {
    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        BatchCreateParams params = BatchCreateParams.builder()
            .addRequest(BatchCreateParams.Request.builder()
                .customId("my-first-request")
                .params(BatchCreateParams.Request.Params.builder()
                    .model(Model.CLAUDE_OPUS_4_0)
                    .maxTokens(1024)
                    .addUserMessage("Hello, world")
                    .build())
                .build())
            .addRequest(BatchCreateParams.Request.builder()
                .customId("my-second-request")
                .params(BatchCreateParams.Request.Params.builder()
                    .model(Model.CLAUDE_OPUS_4_0)
                    .maxTokens(1024)
                    .addUserMessage("Hi again, friend")
                    .build())
                .build())
            .build();

        MessageBatch messageBatch = client.messages().batches().create(params);

        System.out.println(messageBatch);
    }
}
```

</CodeGroup>

En este ejemplo, dos solicitudes separadas se procesan por lotes juntas para procesamiento asincrónico. Cada solicitud tiene un `custom_id` único y contiene los parámetros estándar que usarías para una llamada a la API de Messages.

<Tip>
  **Prueba tus solicitudes de lote con la API de Messages**

La validación del objeto `params` para cada solicitud de mensaje se realiza de forma asincrónica, y los errores de validación se devuelven cuando el procesamiento de todo el lote ha finalizado. Puedes asegurar que estés construyendo tu entrada correctamente verificando la forma de tu solicitud con la [API de Messages](/docs/es/api/messages) primero.
</Tip>

Cuando se crea un lote por primera vez, la respuesta tendrá un estado de procesamiento de `in_progress`.

```json JSON
{
  "id": "msgbatch_01HkcTjaV5uDC8jWR4ZsDV8d",
  "type": "message_batch",
  "processing_status": "in_progress",
  "request_counts": {
    "processing": 2,
    "succeeded": 0,
    "errored": 0,
    "canceled": 0,
    "expired": 0
  },
  "ended_at": null,
  "created_at": "2024-09-24T18:37:24.100435Z",
  "expires_at": "2024-09-25T18:37:24.100435Z",
  "cancel_initiated_at": null,
  "results_url": null
}
```

### Rastreando tu lote

El campo `processing_status` del Message Batch indica la etapa en la que se encuentra el procesamiento del lote. Comienza como `in_progress`, luego se actualiza a `ended` una vez que todas las solicitudes en el lote han finalizado el procesamiento y los resultados están listos. Puedes monitorear el estado de tu lote visitando la [Consola](/settings/workspaces/default/batches), o usando el [endpoint de recuperación](/docs/es/api/retrieving-message-batches).

#### Sondeo para la finalización de Message Batch

Para sondear un Message Batch, necesitarás su `id`, que se proporciona en la respuesta al crear un lote o listando lotes. Puedes implementar un bucle de sondeo que verifique el estado del lote periódicamente hasta que el procesamiento haya finalizado:

<CodeGroup>
```python Python
import anthropic
import time

client = anthropic.Anthropic()

message_batch = None
while True:
    message_batch = client.messages.batches.retrieve(
        MESSAGE_BATCH_ID
    )
    if message_batch.processing_status == "ended":
        break

    print(f"Batch {MESSAGE_BATCH_ID} is still processing...")
    time.sleep(60)
print(message_batch)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

let messageBatch;
while (true) {
  messageBatch = await anthropic.messages.batches.retrieve(
    MESSAGE_BATCH_ID
  );
  if (messageBatch.processing_status === 'ended') {
    break;
  }

  console.log(`Batch ${messageBatch} is still processing... waiting`);
  await new Promise(resolve => setTimeout(resolve, 60_000));
}
console.log(messageBatch);
```

```bash Shell
#!/bin/sh

until [[ $(curl -s "https://api.anthropic.com/v1/messages/batches/$MESSAGE_BATCH_ID" \
          --header "x-api-key: $ANTHROPIC_API_KEY" \
          --header "anthropic-version: 2023-06-01" \
          | grep -o '"processing_status":[[:space:]]*"[^"]*"' \
          | cut -d'"' -f4) == "ended" ]]; do
    echo "Batch $MESSAGE_BATCH_ID is still processing..."
    sleep 60
done

echo "Batch $MESSAGE_BATCH_ID has finished processing"
```
</CodeGroup>

### Listando todos los Message Batches

Puedes listar todos los Message Batches en tu Workspace usando el [endpoint de lista](/docs/es/api/listing-message-batches). La API soporta paginación, obteniendo automáticamente páginas adicionales según sea necesario:

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# Automatically fetches more pages as needed.
for message_batch in client.messages.batches.list(
    limit=20
):
    print(message_batch)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

// Automatically fetches more pages as needed.
for await (const messageBatch of anthropic.messages.batches.list({
  limit: 20
})) {
  console.log(messageBatch);
}
```

```bash Shell
#!/bin/sh

if ! command -v jq &> /dev/null; then
    echo "Error: This script requires jq. Please install it first."
    exit 1
fi

BASE_URL="https://api.anthropic.com/v1/messages/batches"

has_more=true
after_id=""

while [ "$has_more" = true ]; do
    # Construct URL with after_id if it exists
    if [ -n "$after_id" ]; then
        url="${BASE_URL}?limit=20&after_id=${after_id}"
    else
        url="$BASE_URL?limit=20"
    fi

    response=$(curl -s "$url" \
              --header "x-api-key: $ANTHROPIC_API_KEY" \
              --header "anthropic-version: 2023-06-01")

    # Extract values using jq
    has_more=$(echo "$response" | jq -r '.has_more')
    after_id=$(echo "$response" | jq -r '.last_id')

    # Process and print each entry in the data array
    echo "$response" | jq -c '.data[]' | while read -r entry; do
        echo "$entry" | jq '.'
    done
done
```

```java Java
import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.batches.*;

public class BatchListExample {
    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Automatically fetches more pages as needed
        for (MessageBatch messageBatch : client.messages().batches().list(
                BatchListParams.builder()
                        .limit(20)
                        .build()
        )) {
            System.out.println(messageBatch);
        }
    }
}
```
</CodeGroup>

### Recuperando resultados del lote

Una vez que el procesamiento del lote ha finalizado, cada solicitud de Messages en el lote tendrá un resultado. Hay 4 tipos de resultados:

| Tipo de Resultado | Descripción |
|-------------|-------------|
| `succeeded` | La solicitud fue exitosa. Incluye el resultado del mensaje. |
| `errored`   | La solicitud encontró un error y no se creó un mensaje. Los errores posibles incluyen solicitudes inválidas y errores internos del servidor. No se te cobrará por estas solicitudes. |
| `canceled`  | El usuario canceló el lote antes de que esta solicitud pudiera enviarse al modelo. No se te cobrará por estas solicitudes. |
| `expired`   | El lote alcanzó su expiración de 24 horas antes de que esta solicitud pudiera enviarse al modelo. No se te cobrará por estas solicitudes. |

Verás una descripción general de tus resultados con el `request_counts` del lote, que muestra cuántas solicitudes alcanzaron cada uno de estos cuatro estados.

Los resultados del lote están disponibles para descargar en la propiedad `results_url` en el Message Batch, y si el permiso de la organización lo permite, en la Consola. Debido al tamaño potencialmente grande de los resultados, se recomienda [transmitir resultados](/docs/es/api/retrieving-message-batch-results) en lugar de descargarlos todos a la vez.

<CodeGroup>

```bash Shell
#!/bin/sh
curl "https://api.anthropic.com/v1/messages/batches/msgbatch_01HkcTjaV5uDC8jWR4ZsDV8d" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_API_KEY" \
  | grep -o '"results_url":[[:space:]]*"[^"]*"' \
  | cut -d'"' -f4 \
  | while read -r url; do
    curl -s "$url" \
      --header "anthropic-version: 2023-06-01" \
      --header "x-api-key: $ANTHROPIC_API_KEY" \
      | sed 's/}{/}\n{/g' \
      | while IFS= read -r line
    do
      result_type=$(echo "$line" | sed -n 's/.*"result":[[:space:]]*{[[:space:]]*"type":[[:space:]]*"\([^"]*\)".*/\1/p')
      custom_id=$(echo "$line" | sed -n 's/.*"custom_id":[[:space:]]*"\([^"]*\)".*/\1/p')
      error_type=$(echo "$line" | sed -n 's/.*"error":[[:space:]]*{[[:space:]]*"type":[[:space:]]*"\([^"]*\)".*/\1/p')

      case "$result_type" in
        "succeeded")
          echo "Success! $custom_id"
          ;;
        "errored")
          if [ "$error_type" = "invalid_request" ]; then
            # Request body must be fixed before re-sending request
            echo "Validation error: $custom_id"
          else
            # Request can be retried directly
            echo "Server error: $custom_id"
          fi
          ;;
        "expired")
          echo "Expired: $line"
          ;;
      esac
    done
  done

```
```python Python
import anthropic

client = anthropic.Anthropic()

# Stream results file in memory-efficient chunks, processing one at a time
for result in client.messages.batches.results(
    "msgbatch_01HkcTjaV5uDC8jWR4ZsDV8d",
):
    match result.result.type:
        case "succeeded":
            print(f"Success! {result.custom_id}")
        case "errored":
            if result.result.error.type == "invalid_request":
                # Request body must be fixed before re-sending request
                print(f"Validation error {result.custom_id}")
            else:
                # Request can be retried directly
                print(f"Server error {result.custom_id}")
        case "expired":
            print(f"Request expired {result.custom_id}")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

// Stream results file in memory-efficient chunks, processing one at a time
for await (const result of await anthropic.messages.batches.results(
    "msgbatch_01HkcTjaV5uDC8jWR4ZsDV8d"
)) {
  switch (result.result.type) {
    case 'succeeded':
      console.log(`Success! ${result.custom_id}`);
      break;
    case 'errored':
      if (result.result.error.type == "invalid_request") {
        // Request body must be fixed before re-sending request
        console.log(`Validation error: ${result.custom_id}`);
      } else {
        // Request can be retried directly
        console.log(`Server error: ${result.custom_id}`);
      }
      break;
    case 'expired':
      console.log(`Request expired: ${result.custom_id}`);
      break;
  }
}
```

```java Java
import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.http.StreamResponse;
import com.anthropic.models.messages.batches.MessageBatchIndividualResponse;
import com.anthropic.models.messages.batches.BatchResultsParams;

public class BatchResultsExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Stream results file in memory-efficient chunks, processing one at a time
        try (StreamResponse<MessageBatchIndividualResponse> streamResponse = client.messages()
                .batches()
                .resultsStreaming(
                        BatchResultsParams.builder()
                                .messageBatchId("msgbatch_01HkcTjaV5uDC8jWR4ZsDV8d")
                                .build())) {

            streamResponse.stream().forEach(result -> {
                if (result.result().isSucceeded()) {
                    System.out.println("Success! " + result.customId());
                } else if (result.result().isErrored()) {
                    if (result.result().asErrored().error().error().isInvalidRequestError()) {
                        // Request body must be fixed before re-sending request
                        System.out.println("Validation error: " + result.customId());
                    } else {
                        // Request can be retried directly
                        System.out.println("Server error: " + result.customId());
                    }
                } else if (result.result().isExpired()) {
                    System.out.println("Request expired: " + result.customId());
                }
            });
        }
    }
}
```

</CodeGroup>

Los resultados estarán en formato `.jsonl`, donde cada línea es un objeto JSON válido que representa el resultado de una única solicitud en el Message Batch. Para cada resultado transmitido, puedes hacer algo diferente dependiendo de su `custom_id` y tipo de resultado. Aquí hay un conjunto de resultados de ejemplo:

```json .jsonl file
{"custom_id":"my-second-request","result":{"type":"succeeded","message":{"id":"msg_014VwiXbi91y3JMjcpyGBHX5","type":"message","role":"assistant","model":"claude-sonnet-4-5-20250929","content":[{"type":"text","text":"Hello again! It's nice to see you. How can I assist you today? Is there anything specific you'd like to chat about or any questions you have?"}],"stop_reason":"end_turn","stop_sequence":null,"usage":{"input_tokens":11,"output_tokens":36}}}}
{"custom_id":"my-first-request","result":{"type":"succeeded","message":{"id":"msg_01FqfsLoHwgeFbguDgpz48m7","type":"message","role":"assistant","model":"claude-sonnet-4-5-20250929","content":[{"type":"text","text":"Hello! How can I assist you today? Feel free to ask me any questions or let me know if there's anything you'd like to chat about."}],"stop_reason":"end_turn","stop_sequence":null,"usage":{"input_tokens":10,"output_tokens":34}}}}
```

Si tu resultado tiene un error, su `result.error` se establecerá en nuestra [forma de error](/docs/es/api/errors#error-shapes) estándar.

<Tip>
  **Los resultados del lote pueden no coincidir con el orden de entrada**

Los resultados del lote pueden devolverse en cualquier orden y pueden no coincidir con el orden de las solicitudes cuando se creó el lote. En el ejemplo anterior, el resultado para la segunda solicitud del lote se devuelve antes que la primera. Para hacer coincidir correctamente los resultados con sus solicitudes correspondientes, siempre usa el campo `custom_id`.
</Tip>

### Cancelando un Message Batch

Puedes cancelar un Message Batch que está siendo procesado actualmente usando el [endpoint de cancelación](/docs/es/api/canceling-message-batches). Inmediatamente después de la cancelación, el `processing_status` de un lote será `canceling`. Puedes usar la misma técnica de sondeo descrita anteriormente para esperar hasta que la cancelación se finalice. Los lotes cancelados terminan con un estado de `ended` y pueden contener resultados parciales para solicitudes que fueron procesadas antes de la cancelación.

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

message_batch = client.messages.batches.cancel(
    MESSAGE_BATCH_ID,
)
print(message_batch)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const messageBatch = await anthropic.messages.batches.cancel(
    MESSAGE_BATCH_ID
);
console.log(messageBatch);
```

```bash Shell
#!/bin/sh
curl --request POST https://api.anthropic.com/v1/messages/batches/$MESSAGE_BATCH_ID/cancel \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01"
```

```java Java
import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.batches.*;

public class BatchCancelExample {
    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        MessageBatch messageBatch = client.messages().batches().cancel(
                BatchCancelParams.builder()
                        .messageBatchId(MESSAGE_BATCH_ID)
                        .build()
        );
        System.out.println(messageBatch);
    }
}
```
</CodeGroup>

La respuesta mostrará el lote en un estado `canceling`:

```json JSON
{
  "id": "msgbatch_013Zva2CMHLNnXjNJJKqJ2EF",
  "type": "message_batch",
  "processing_status": "canceling",
  "request_counts": {
    "processing": 2,
    "succeeded": 0,
    "errored": 0,
    "canceled": 0,
    "expired": 0
  },
  "ended_at": null,
  "created_at": "2024-09-24T18:37:24.100435Z",
  "expires_at": "2024-09-25T18:37:24.100435Z",
  "cancel_initiated_at": "2024-09-24T18:39:03.114875Z",
  "results_url": null
}
```

### Uso del almacenamiento en caché de indicaciones con Message Batches

La API de Message Batches admite el almacenamiento en caché de indicaciones, lo que le permite reducir potencialmente los costos y el tiempo de procesamiento para solicitudes por lotes. Los descuentos de precios del almacenamiento en caché de indicaciones y Message Batches se pueden acumular, proporcionando ahorros de costos aún mayores cuando se utilizan ambas características juntas. Sin embargo, dado que las solicitudes por lotes se procesan de forma asincrónica y concurrente, los aciertos de caché se proporcionan en base al mejor esfuerzo. Los usuarios típicamente experimentan tasas de acierto de caché que van del 30% al 98%, dependiendo de sus patrones de tráfico.

Para maximizar la probabilidad de aciertos de caché en sus solicitudes por lotes:

1. Incluya bloques `cache_control` idénticos en cada solicitud de Message dentro de su lote
2. Mantenga un flujo constante de solicitudes para evitar que las entradas de caché expiren después de su vida útil de 5 minutos
3. Estructure sus solicitudes para compartir la mayor cantidad posible de contenido almacenado en caché

Ejemplo de implementación del almacenamiento en caché de indicaciones en un lote:

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages/batches \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "requests": [
        {
            "custom_id": "my-first-request",
            "params": {
                "model": "claude-sonnet-4-5",
                "max_tokens": 1024,
                "system": [
                    {
                        "type": "text",
                        "text": "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n"
                    },
                    {
                        "type": "text",
                        "text": "<the entire contents of Pride and Prejudice>",
                        "cache_control": {"type": "ephemeral"}
                    }
                ],
                "messages": [
                    {"role": "user", "content": "Analyze the major themes in Pride and Prejudice."}
                ]
            }
        },
        {
            "custom_id": "my-second-request",
            "params": {
                "model": "claude-sonnet-4-5",
                "max_tokens": 1024,
                "system": [
                    {
                        "type": "text",
                        "text": "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n"
                    },
                    {
                        "type": "text",
                        "text": "<the entire contents of Pride and Prejudice>",
                        "cache_control": {"type": "ephemeral"}
                    }
                ],
                "messages": [
                    {"role": "user", "content": "Write a summary of Pride and Prejudice."}
                ]
            }
        }
    ]
}'
```

```python Python
import anthropic
from anthropic.types.message_create_params import MessageCreateParamsNonStreaming
from anthropic.types.messages.batch_create_params import Request

client = anthropic.Anthropic()

message_batch = client.messages.batches.create(
    requests=[
        Request(
            custom_id="my-first-request",
            params=MessageCreateParamsNonStreaming(
                model="claude-sonnet-4-5",
                max_tokens=1024,
                system=[
                    {
                        "type": "text",
                        "text": "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n"
                    },
                    {
                        "type": "text",
                        "text": "<the entire contents of Pride and Prejudice>",
                        "cache_control": {"type": "ephemeral"}
                    }
                ],
                messages=[{
                    "role": "user",
                    "content": "Analyze the major themes in Pride and Prejudice."
                }]
            )
        ),
        Request(
            custom_id="my-second-request",
            params=MessageCreateParamsNonStreaming(
                model="claude-sonnet-4-5",
                max_tokens=1024,
                system=[
                    {
                        "type": "text",
                        "text": "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n"
                    },
                    {
                        "type": "text",
                        "text": "<the entire contents of Pride and Prejudice>",
                        "cache_control": {"type": "ephemeral"}
                    }
                ],
                messages=[{
                    "role": "user",
                    "content": "Write a summary of Pride and Prejudice."
                }]
            )
        )
    ]
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const messageBatch = await anthropic.messages.batches.create({
  requests: [{
    custom_id: "my-first-request",
    params: {
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      system: [
        {
          type: "text",
          text: "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n"
        },
        {
          type: "text",
          text: "<the entire contents of Pride and Prejudice>",
          cache_control: {type: "ephemeral"}
        }
      ],
      messages: [
        {"role": "user", "content": "Analyze the major themes in Pride and Prejudice."}
      ]
    }
  }, {
    custom_id: "my-second-request",
    params: {
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      system: [
        {
          type: "text",
          text: "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n"
        },
        {
          type: "text",
          text: "<the entire contents of Pride and Prejudice>",
          cache_control: {type: "ephemeral"}
        }
      ],
      messages: [
        {"role": "user", "content": "Write a summary of Pride and Prejudice."}
      ]
    }
  }]
});
```

```java Java
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;
import com.anthropic.models.messages.batches.*;

public class BatchExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        BatchCreateParams createParams = BatchCreateParams.builder()
                .addRequest(BatchCreateParams.Request.builder()
                        .customId("my-first-request")
                        .params(BatchCreateParams.Request.Params.builder()
                                .model(Model.CLAUDE_OPUS_4_0)
                                .maxTokens(1024)
                                .systemOfTextBlockParams(List.of(
                                        TextBlockParam.builder()
                                                .text("You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n")
                                                .build(),
                                        TextBlockParam.builder()
                                                .text("<the entire contents of Pride and Prejudice>")
                                                .cacheControl(CacheControlEphemeral.builder().build())
                                                .build()
                                ))
                                .addUserMessage("Analyze the major themes in Pride and Prejudice.")
                                .build())
                        .build())
                .addRequest(BatchCreateParams.Request.builder()
                        .customId("my-second-request")
                        .params(BatchCreateParams.Request.Params.builder()
                                .model(Model.CLAUDE_OPUS_4_0)
                                .maxTokens(1024)
                                .systemOfTextBlockParams(List.of(
                                        TextBlockParam.builder()
                                                .text("You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n")
                                                .build(),
                                        TextBlockParam.builder()
                                                .text("<the entire contents of Pride and Prejudice>")
                                                .cacheControl(CacheControlEphemeral.builder().build())
                                                .build()
                                ))
                                .addUserMessage("Write a summary of Pride and Prejudice.")
                                .build())
                        .build())
                .build();

        MessageBatch messageBatch = client.messages().batches().create(createParams);
    }
}
```

</CodeGroup>

En este ejemplo, ambas solicitudes en el lote incluyen mensajes del sistema idénticos y el texto completo de Pride and Prejudice marcado con `cache_control` para aumentar la probabilidad de aciertos de caché.

### Mejores prácticas para procesamiento por lotes efectivo

Para aprovechar al máximo la API de Batches:

- Monitoree regularmente el estado del procesamiento por lotes e implemente la lógica de reintentos apropiada para solicitudes fallidas.
- Utilice valores `custom_id` significativos para hacer coincidir fácilmente los resultados con las solicitudes, ya que el orden no está garantizado.
- Considere dividir conjuntos de datos muy grandes en múltiples lotes para una mejor manejabilidad.
- Realice una prueba de ejecución de una única forma de solicitud con la API de Messages para evitar errores de validación.

### Solución de problemas comunes

Si experimenta un comportamiento inesperado:

- Verifique que el tamaño total de la solicitud por lotes no exceda 256 MB. Si el tamaño de la solicitud es demasiado grande, puede obtener un error 413 `request_too_large`.
- Compruebe que está utilizando [modelos compatibles](#supported-models) para todas las solicitudes en el lote.
- Asegúrese de que cada solicitud en el lote tenga un `custom_id` único.
- Asegúrese de que hayan pasado menos de 29 días desde el tiempo de `created_at` del lote (no el tiempo de procesamiento `ended_at`). Si han pasado más de 29 días, los resultados ya no serán visibles.
- Confirme que el lote no ha sido cancelado.

Tenga en cuenta que el fallo de una solicitud en un lote no afecta el procesamiento de otras solicitudes.

---
## Almacenamiento y privacidad de lotes

- **Aislamiento del Workspace**: Los lotes se aíslan dentro del Workspace en el que se crean. Solo pueden ser accedidos por claves API asociadas con ese Workspace, o por usuarios con permiso para ver lotes de Workspace en la Consola.

- **Disponibilidad de resultados**: Los resultados de los lotes están disponibles durante 29 días después de que se crea el lote, lo que permite tiempo suficiente para la recuperación y el procesamiento.

---
## Preguntas frecuentes

  <section title="¿Cuánto tiempo tarda en procesarse un lote?">

    Los lotes pueden tardar hasta 24 horas en procesarse, pero muchos se completarán antes. El tiempo de procesamiento real depende del tamaño del lote, la demanda actual y su volumen de solicitudes. Es posible que un lote expire y no se complete dentro de 24 horas.
  
</section>

  <section title="¿La API de Batches está disponible para todos los modelos?">

    Consulte [arriba](#supported-models) para ver la lista de modelos compatibles.
  
</section>

  <section title="¿Puedo usar la API de Message Batches con otras características de API?">

    Sí, la API de Message Batches admite todas las características disponibles en la API de Messages, incluidas las características beta. Sin embargo, el streaming no es compatible con solicitudes por lotes.
  
</section>

  <section title="¿Cómo afecta la API de Message Batches a los precios?">

    La API de Message Batches ofrece un descuento del 50% en todo el uso en comparación con los precios estándar de la API. Esto se aplica a los tokens de entrada, tokens de salida y cualquier token especial. Para más información sobre precios, visite nuestra [página de precios](https://claude.com/pricing#anthropic-api).
  
</section>

  <section title="¿Puedo actualizar un lote después de haberlo enviado?">

    No, una vez que se ha enviado un lote, no se puede modificar. Si necesita hacer cambios, debe cancelar el lote actual y enviar uno nuevo. Tenga en cuenta que la cancelación puede no tener efecto inmediato.
  
</section>

  <section title="¿Hay límites de velocidad de la API de Message Batches y cómo interactúan con los límites de velocidad de la API de Messages?">

    La API de Message Batches tiene límites de velocidad basados en solicitudes HTTP además de límites en el número de solicitudes que necesitan procesamiento. Consulte [Límites de velocidad de la API de Message Batches](/docs/es/api/rate-limits#message-batches-api). El uso de la API de Batches no afecta los límites de velocidad en la API de Messages.
  
</section>

  <section title="¿Cómo manejo errores en mis solicitudes por lotes?">

    Cuando recupera los resultados, cada solicitud tendrá un campo `result` que indica si `succeeded`, `errored`, fue `canceled`, o `expired`. Para resultados `errored`, se proporcionará información de error adicional. Vea el objeto de respuesta de error en la [referencia de API](/docs/es/api/creating-message-batches).
  
</section>

  <section title="¿Cómo maneja la API de Message Batches la privacidad y la separación de datos?">

    La API de Message Batches está diseñada con medidas sólidas de privacidad y separación de datos:

    1. Los lotes y sus resultados se aíslan dentro del Workspace en el que se crearon. Esto significa que solo pueden ser accedidos por claves API del mismo Workspace.
    2. Cada solicitud dentro de un lote se procesa de forma independiente, sin fuga de datos entre solicitudes.
    3. Los resultados solo están disponibles durante un tiempo limitado (29 días), y siguen nuestra [política de retención de datos](https://support.claude.com/en/articles/7996866-how-long-do-you-store-personal-data).
    4. La descarga de resultados de lotes en la Consola se puede deshabilitar a nivel de organización o por Workspace.
  
</section>

  <section title="¿Puedo usar almacenamiento en caché de indicaciones en la API de Message Batches?">

    Sí, es posible usar almacenamiento en caché de indicaciones con la API de Message Batches. Sin embargo, debido a que las solicitudes por lotes asincrónicas pueden procesarse de forma concurrente y en cualquier orden, los aciertos de caché se proporcionan en base al mejor esfuerzo.
  
</section>