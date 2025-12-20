# Batch-Verarbeitung

Effiziente Verarbeitung großer Anfragemengen mit der Message Batches API

---

Batch-Verarbeitung ist ein leistungsstarker Ansatz zur effizienten Verarbeitung großer Anfragemengen. Anstatt Anfragen einzeln mit sofortigen Antworten zu verarbeiten, ermöglicht die Batch-Verarbeitung das Einreichen mehrerer Anfragen zusammen zur asynchronen Verarbeitung. Dieses Muster ist besonders nützlich, wenn:

- Sie große Datenmengen verarbeiten müssen
- Sofortige Antworten nicht erforderlich sind
- Sie Kosteneffizienz optimieren möchten
- Sie großflächige Evaluierungen oder Analysen durchführen

Die Message Batches API ist unsere erste Implementierung dieses Musters.

---

# Message Batches API

Die Message Batches API ist eine leistungsstarke, kostengünstige Möglichkeit, große Mengen von [Messages](/docs/de/api/messages)-Anfragen asynchron zu verarbeiten. Dieser Ansatz eignet sich gut für Aufgaben, die keine sofortigen Antworten erfordern, wobei die meisten Batches in weniger als 1 Stunde abgeschlossen werden, während die Kosten um 50% gesenkt und der Durchsatz erhöht werden.

Sie können [die API-Referenz direkt erkunden](/docs/de/api/creating-message-batches), zusätzlich zu diesem Leitfaden.

## Wie die Message Batches API funktioniert

Wenn Sie eine Anfrage an die Message Batches API senden:

1. Das System erstellt einen neuen Message Batch mit den bereitgestellten Messages-Anfragen.
2. Der Batch wird dann asynchron verarbeitet, wobei jede Anfrage unabhängig bearbeitet wird.
3. Sie können den Status des Batches abfragen und Ergebnisse abrufen, wenn die Verarbeitung für alle Anfragen beendet ist.

Dies ist besonders nützlich für Massenoperationen, die keine sofortigen Ergebnisse erfordern, wie zum Beispiel:
- Großflächige Evaluierungen: Verarbeiten Sie effizient Tausende von Testfällen.
- Inhaltsmoderation: Analysieren Sie asynchron große Mengen von benutzergenerierten Inhalten.
- Datenanalyse: Generieren Sie Erkenntnisse oder Zusammenfassungen für große Datensätze.
- Masseninhaltsgenerierung: Erstellen Sie große Mengen an Text für verschiedene Zwecke (z. B. Produktbeschreibungen, Artikelzusammenfassungen).

### Batch-Einschränkungen
- Ein Message Batch ist auf entweder 100.000 Message-Anfragen oder 256 MB Größe begrenzt, je nachdem, welcher Grenzwert zuerst erreicht wird.
- Wir verarbeiten jeden Batch so schnell wie möglich, wobei die meisten Batches innerhalb von 1 Stunde abgeschlossen werden. Sie können auf Batch-Ergebnisse zugreifen, wenn alle Nachrichten abgeschlossen sind oder nach 24 Stunden, je nachdem, was zuerst eintritt. Batches verfallen, wenn die Verarbeitung nicht innerhalb von 24 Stunden abgeschlossen ist.
- Batch-Ergebnisse sind 29 Tage nach der Erstellung verfügbar. Danach können Sie den Batch zwar noch anzeigen, aber seine Ergebnisse können nicht mehr heruntergeladen werden.
- Batches sind auf einen [Workspace](/settings/workspaces) beschränkt. Sie können alle Batches – und deren Ergebnisse – anzeigen, die innerhalb des Workspace erstellt wurden, zu dem Ihr API-Schlüssel gehört.
- Ratenlimits gelten sowohl für HTTP-Anfragen der Batches API als auch für die Anzahl der Anfragen innerhalb eines Batches, die auf Verarbeitung warten. Siehe [Message Batches API-Ratenlimits](/docs/de/api/rate-limits#message-batches-api). Darüber hinaus können wir die Verarbeitung basierend auf der aktuellen Nachfrage und Ihrem Anfragevolumen verlangsamen. In diesem Fall können Sie mehr Anfragen sehen, die nach 24 Stunden ablaufen.
- Aufgrund des hohen Durchsatzes und der gleichzeitigen Verarbeitung können Batches das konfigurierte [Ausgabenlimit](/settings/limits) Ihres Workspace leicht überschreiten.

### Unterstützte Modelle

Alle [aktiven Modelle](/docs/de/about-claude/models/overview) unterstützen die Message Batches API.

### Was kann in Batches verarbeitet werden
Jede Anfrage, die Sie an die Messages API stellen können, kann in einen Batch aufgenommen werden. Dies umfasst:

- Vision
- Tool-Nutzung
- Systemnachrichten
- Mehrteilige Konversationen
- Alle Beta-Funktionen

Da jede Anfrage im Batch unabhängig verarbeitet wird, können Sie verschiedene Arten von Anfragen innerhalb eines einzelnen Batches mischen.

<Tip>
Da Batches länger als 5 Minuten verarbeitet werden können, sollten Sie die [1-Stunden-Cache-Dauer](/docs/de/build-with-claude/prompt-caching#1-hour-cache-duration) mit Prompt-Caching verwenden, um bessere Cache-Hit-Raten bei der Verarbeitung von Batches mit gemeinsamen Kontexten zu erzielen.
</Tip>

---
## Preisgestaltung

Die Batches API bietet erhebliche Kosteneinsparungen. Alle Nutzungen werden mit 50% der Standard-API-Preise berechnet.

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
## Wie man die Message Batches API verwendet

### Bereiten Sie Ihren Batch vor und erstellen Sie ihn

Ein Message Batch besteht aus einer Liste von Anfragen zum Erstellen einer Message. Die Form einer einzelnen Anfrage besteht aus:
- Eine eindeutige `custom_id` zur Identifizierung der Messages-Anfrage
- Ein `params`-Objekt mit den Standard-[Messages API](/docs/de/api/messages)-Parametern

Sie können [einen Batch erstellen](/docs/de/api/creating-message-batches), indem Sie diese Liste in den `requests`-Parameter übergeben:

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

In diesem Beispiel werden zwei separate Anfragen zusammen für die asynchrone Verarbeitung in einen Batch aufgenommen. Jede Anfrage hat eine eindeutige `custom_id` und enthält die Standard-Parameter, die Sie für einen Messages API-Aufruf verwenden würden.

<Tip>
  **Testen Sie Ihre Batch-Anfragen mit der Messages API**

Die Validierung des `params`-Objekts für jede Message-Anfrage wird asynchron durchgeführt, und Validierungsfehler werden zurückgegeben, wenn die Verarbeitung des gesamten Batches beendet ist. Sie können sicherstellen, dass Sie Ihre Eingabe korrekt erstellen, indem Sie Ihre Anfragefrom zunächst mit der [Messages API](/docs/de/api/messages) überprüfen.
</Tip>

Wenn ein Batch zum ersten Mal erstellt wird, hat die Antwort einen Verarbeitungsstatus von `in_progress`.

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

### Verfolgen Sie Ihren Batch

Das Feld `processing_status` des Message Batch gibt die Verarbeitungsphase des Batches an. Es beginnt als `in_progress`, wird dann auf `ended` aktualisiert, sobald alle Anfragen im Batch verarbeitet wurden und die Ergebnisse bereit sind. Sie können den Status Ihres Batches überwachen, indem Sie die [Konsole](/settings/workspaces/default/batches) besuchen oder den [Abruf-Endpunkt](/docs/de/api/retrieving-message-batches) verwenden.

#### Abfragen der Message Batch-Fertigstellung

Um einen Message Batch abzufragen, benötigen Sie seine `id`, die in der Antwort beim Erstellen eines Batches oder durch Auflisten von Batches bereitgestellt wird. Sie können eine Abfrageschleife implementieren, die den Batch-Status regelmäßig überprüft, bis die Verarbeitung beendet ist:

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

### Alle Message Batches auflisten

Sie können alle Message Batches in Ihrem Workspace mit dem [List-Endpunkt](/docs/de/api/listing-message-batches) auflisten. Die API unterstützt Pagination und ruft automatisch zusätzliche Seiten nach Bedarf ab:

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# Ruft automatisch weitere Seiten nach Bedarf ab.
for message_batch in client.messages.batches.list(
    limit=20
):
    print(message_batch)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

// Ruft automatisch weitere Seiten nach Bedarf ab.
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

        // Ruft automatisch weitere Seiten nach Bedarf ab
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

### Batch-Ergebnisse abrufen

Sobald die Batch-Verarbeitung beendet ist, hat jede Messages-Anfrage im Batch ein Ergebnis. Es gibt 4 Ergebnistypen:

| Ergebnistyp | Beschreibung |
|-------------|-------------|
| `succeeded` | Anfrage war erfolgreich. Enthält das Message-Ergebnis. |
| `errored`   | Anfrage ist auf einen Fehler gestoßen und eine Message wurde nicht erstellt. Mögliche Fehler sind ungültige Anfragen und interne Serverfehler. Sie werden für diese Anfragen nicht berechnet. |
| `canceled`  | Benutzer hat den Batch abgebrochen, bevor diese Anfrage an das Modell gesendet werden konnte. Sie werden für diese Anfragen nicht berechnet. |
| `expired`   | Batch hat seine 24-Stunden-Ablaufzeit erreicht, bevor diese Anfrage an das Modell gesendet werden konnte. Sie werden für diese Anfragen nicht berechnet. |

Sie sehen eine Übersicht Ihrer Ergebnisse mit den `request_counts` des Batches, die zeigen, wie viele Anfragen jeden dieser vier Zustände erreicht haben.

Die Ergebnisse des Batches können unter der Eigenschaft `results_url` auf dem Message Batch heruntergeladen werden, und falls die Organisationsberechtigung dies zulässt, in der Konsole. Aufgrund der möglicherweise großen Größe der Ergebnisse wird empfohlen, [Ergebnisse zu streamen](/docs/de/api/retrieving-message-batch-results), anstatt sie alle auf einmal herunterzuladen.

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

Die Ergebnisse liegen im `.jsonl`-Format vor, wobei jede Zeile ein gültiges JSON-Objekt ist, das das Ergebnis einer einzelnen Anfrage im Message Batch darstellt. Für jedes gestreamte Ergebnis können Sie je nach `custom_id` und Ergebnistyp etwas anderes tun. Hier ist ein Beispiel für einen Satz von Ergebnissen:

```json .jsonl file
{"custom_id":"my-second-request","result":{"type":"succeeded","message":{"id":"msg_014VwiXbi91y3JMjcpyGBHX5","type":"message","role":"assistant","model":"claude-sonnet-4-5-20250929","content":[{"type":"text","text":"Hello again! It's nice to see you. How can I assist you today? Is there anything specific you'd like to chat about or any questions you have?"}],"stop_reason":"end_turn","stop_sequence":null,"usage":{"input_tokens":11,"output_tokens":36}}}}
{"custom_id":"my-first-request","result":{"type":"succeeded","message":{"id":"msg_01FqfsLoHwgeFbguDgpz48m7","type":"message","role":"assistant","model":"claude-sonnet-4-5-20250929","content":[{"type":"text","text":"Hello! How can I assist you today? Feel free to ask me any questions or let me know if there's anything you'd like to chat about."}],"stop_reason":"end_turn","stop_sequence":null,"usage":{"input_tokens":10,"output_tokens":34}}}}
```

Wenn Ihr Ergebnis einen Fehler hat, wird sein `result.error` auf unsere Standard-[Fehlerform](/docs/de/api/errors#error-shapes) gesetzt.

<Tip>
  **Batch-Ergebnisse entsprechen möglicherweise nicht der Eingabereihenfolge**

Batch-Ergebnisse können in beliebiger Reihenfolge zurückgegeben werden und entsprechen möglicherweise nicht der Reihenfolge der Anfragen beim Erstellen des Batches. Im obigen Beispiel wird das Ergebnis für die zweite Batch-Anfrage vor der ersten zurückgegeben. Um Ergebnisse korrekt mit ihren entsprechenden Anfragen abzugleichen, verwenden Sie immer das Feld `custom_id`.
</Tip>

### Abbrechen eines Message Batch

Sie können einen Message Batch, der gerade verarbeitet wird, mit dem [Cancel-Endpunkt](/docs/de/api/canceling-message-batches) abbrechen. Unmittelbar nach dem Abbruch hat der `processing_status` eines Batches den Wert `canceling`. Sie können die gleiche oben beschriebene Abfragetechnik verwenden, um zu warten, bis der Abbruch abgeschlossen ist. Abgebrochene Batches enden mit dem Status `ended` und können teilweise Ergebnisse für Anfragen enthalten, die vor dem Abbruch verarbeitet wurden.

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

Die Antwort zeigt den Batch in einem `canceling`-Zustand:

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

### Prompt Caching mit Message Batches verwenden

Die Message Batches API unterstützt Prompt Caching, wodurch Sie möglicherweise Kosten und Verarbeitungszeit für Batch-Anfragen reduzieren können. Die Preisrabatte aus Prompt Caching und Message Batches können sich stapeln und bieten noch größere Kosteneinsparungen, wenn beide Funktionen zusammen verwendet werden. Da Batch-Anfragen jedoch asynchron und gleichzeitig verarbeitet werden, werden Cache Hits auf Best-Effort-Basis bereitgestellt. Benutzer erleben typischerweise Cache-Hit-Raten zwischen 30 % und 98 %, je nach ihren Verkehrsmustern.

Um die Wahrscheinlichkeit von Cache Hits in Ihren Batch-Anfragen zu maximieren:

1. Fügen Sie identische `cache_control` Blöcke in jede Message-Anfrage innerhalb Ihres Batches ein
2. Halten Sie einen stetigen Strom von Anfragen aufrecht, um zu verhindern, dass Cache-Einträge nach ihrer 5-Minuten-Lebensdauer ablaufen
3. Strukturieren Sie Ihre Anfragen so, dass sie so viel zwischengespeicherten Inhalt wie möglich gemeinsam nutzen

Beispiel für die Implementierung von Prompt Caching in einem Batch:

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

In diesem Beispiel enthalten beide Anfragen im Batch identische Systemmeldungen und den vollständigen Text von Pride and Prejudice, der mit `cache_control` gekennzeichnet ist, um die Wahrscheinlichkeit von Cache Hits zu erhöhen.

### Best Practices für effektives Batching

Um das Beste aus der Batches API herauszuholen:

- Überwachen Sie den Batch-Verarbeitungsstatus regelmäßig und implementieren Sie angemessene Wiederholungslogik für fehlgeschlagene Anfragen.
- Verwenden Sie aussagekräftige `custom_id` Werte, um Ergebnisse leicht mit Anfragen abzugleichen, da die Reihenfolge nicht garantiert ist.
- Erwägen Sie, sehr große Datensätze in mehrere Batches aufzuteilen, um eine bessere Verwaltbarkeit zu erreichen.
- Führen Sie einen Testlauf einer einzelnen Anfrageart mit der Messages API durch, um Validierungsfehler zu vermeiden.

### Behebung häufiger Probleme

Wenn Sie unerwartet Verhalten feststellen:

- Überprüfen Sie, dass die Gesamtgröße der Batch-Anfrage 256 MB nicht überschreitet. Wenn die Anfragegröße zu groß ist, erhalten Sie möglicherweise einen 413 `request_too_large` Fehler.
- Überprüfen Sie, dass Sie [unterstützte Modelle](#supported-models) für alle Anfragen im Batch verwenden.
- Stellen Sie sicher, dass jede Anfrage im Batch eine eindeutige `custom_id` hat.
- Stellen Sie sicher, dass weniger als 29 Tage seit der Batch `created_at` (nicht der Verarbeitung `ended_at`) Zeit vergangen sind. Wenn mehr als 29 Tage vergangen sind, sind die Ergebnisse nicht mehr einsehbar.
- Bestätigen Sie, dass der Batch nicht abgebrochen wurde.

Beachten Sie, dass das Fehlschlagen einer Anfrage in einem Batch die Verarbeitung anderer Anfragen nicht beeinträchtigt.

---
## Batch-Speicherung und Datenschutz

- **Workspace-Isolation**: Batches sind innerhalb des Workspace isoliert, in dem sie erstellt wurden. Sie können nur von API-Schlüsseln zugegriffen werden, die diesem Workspace zugeordnet sind, oder von Benutzern mit Berechtigung zum Anzeigen von Workspace-Batches in der Konsole.

- **Verfügbarkeit von Ergebnissen**: Batch-Ergebnisse sind 29 Tage nach der Batch-Erstellung verfügbar, was ausreichend Zeit für Abruf und Verarbeitung bietet.

---
## Häufig gestellte Fragen

  <section title="Wie lange dauert die Verarbeitung eines Batches?">

    Batches können bis zu 24 Stunden zur Verarbeitung benötigen, aber viele werden früher fertig. Die tatsächliche Verarbeitungszeit hängt von der Größe des Batches, der aktuellen Nachfrage und Ihrem Anfragevolumen ab. Es ist möglich, dass ein Batch abläuft und nicht innerhalb von 24 Stunden abgeschlossen wird.
  
</section>

  <section title="Ist die Batches API für alle Modelle verfügbar?">

    Siehe [oben](#supported-models) für die Liste der unterstützten Modelle.
  
</section>

  <section title="Kann ich die Message Batches API mit anderen API-Funktionen verwenden?">

    Ja, die Message Batches API unterstützt alle Funktionen, die in der Messages API verfügbar sind, einschließlich Beta-Funktionen. Streaming wird jedoch nicht für Batch-Anfragen unterstützt.
  
</section>

  <section title="Wie wirkt sich die Message Batches API auf die Preisgestaltung aus?">

    Die Message Batches API bietet einen 50%-Rabatt auf alle Nutzungen im Vergleich zu Standard-API-Preisen. Dies gilt für Eingabe-Token, Ausgabe-Token und alle speziellen Token. Weitere Informationen zur Preisgestaltung finden Sie auf unserer [Preisseite](https://claude.com/pricing#anthropic-api).
  
</section>

  <section title="Kann ich einen Batch nach der Übermittlung aktualisieren?">

    Nein, sobald ein Batch übermittelt wurde, kann er nicht mehr geändert werden. Wenn Sie Änderungen vornehmen müssen, sollten Sie den aktuellen Batch abbrechen und einen neuen einreichen. Beachten Sie, dass der Abbruch möglicherweise nicht sofort wirksam wird.
  
</section>

  <section title="Gibt es Rate Limits für die Message Batches API und interagieren sie mit den Rate Limits der Messages API?">

    Die Message Batches API hat HTTP-Request-basierte Rate Limits zusätzlich zu Limits für die Anzahl der Anfragen, die verarbeitet werden müssen. Siehe [Message Batches API Rate Limits](/docs/de/api/rate-limits#message-batches-api). Die Nutzung der Batches API beeinflusst die Rate Limits in der Messages API nicht.
  
</section>

  <section title="Wie gehe ich mit Fehlern in meinen Batch-Anfragen um?">

    Wenn Sie die Ergebnisse abrufen, hat jede Anfrage ein `result` Feld, das angibt, ob sie `succeeded`, `errored`, `canceled` oder `expired` wurde. Für `errored` Ergebnisse werden zusätzliche Fehlerinformationen bereitgestellt. Sehen Sie sich das Fehlerantwort-Objekt in der [API-Referenz](/docs/de/api/creating-message-batches) an.
  
</section>

  <section title="Wie handhabt die Message Batches API Datenschutz und Datentrennung?">

    Die Message Batches API ist mit starken Datenschutz- und Datentrennung-Maßnahmen konzipiert:

    1. Batches und ihre Ergebnisse sind innerhalb des Workspace isoliert, in dem sie erstellt wurden. Dies bedeutet, dass sie nur von API-Schlüsseln aus demselben Workspace zugegriffen werden können.
    2. Jede Anfrage innerhalb eines Batches wird unabhängig verarbeitet, ohne Datenlecks zwischen Anfragen.
    3. Ergebnisse sind nur für begrenzte Zeit (29 Tage) verfügbar und folgen unserer [Datenspeicherungsrichtlinie](https://support.claude.com/en/articles/7996866-how-long-do-you-store-personal-data).
    4. Das Herunterladen von Batch-Ergebnissen in der Konsole kann auf Organisationsebene oder pro Workspace deaktiviert werden.
  
</section>

  <section title="Kann ich Prompt Caching in der Message Batches API verwenden?">

    Ja, es ist möglich, Prompt Caching mit der Message Batches API zu verwenden. Da asynchrone Batch-Anfragen jedoch gleichzeitig und in beliebiger Reihenfolge verarbeitet werden können, werden Cache Hits auf Best-Effort-Basis bereitgestellt.
  
</section>