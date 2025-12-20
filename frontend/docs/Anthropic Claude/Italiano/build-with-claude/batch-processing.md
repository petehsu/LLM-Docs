# Elaborazione in batch

Elabora grandi volumi di richieste in modo efficiente utilizzando l'API Message Batches

---

L'elaborazione in batch è un approccio potente per gestire grandi volumi di richieste in modo efficiente. Invece di elaborare le richieste una alla volta con risposte immediate, l'elaborazione in batch ti consente di inviare più richieste insieme per l'elaborazione asincrona. Questo modello è particolarmente utile quando:

- Devi elaborare grandi volumi di dati
- Le risposte immediate non sono richieste
- Vuoi ottimizzare l'efficienza dei costi
- Stai eseguendo valutazioni o analisi su larga scala

L'API Message Batches è la nostra prima implementazione di questo modello.

---

# API Message Batches

L'API Message Batches è un modo potente e conveniente per elaborare in modo asincrono grandi volumi di richieste [Messages](/docs/it/api/messages). Questo approccio è ben adatto a compiti che non richiedono risposte immediate, con la maggior parte dei batch che si completano in meno di 1 ora riducendo i costi del 50% e aumentando la velocità effettiva.

Puoi [esplorare il riferimento API direttamente](/docs/it/api/creating-message-batches), oltre a questa guida.

## Come funziona l'API Message Batches

Quando invii una richiesta all'API Message Batches:

1. Il sistema crea un nuovo Message Batch con le richieste Messages fornite.
2. Il batch viene quindi elaborato in modo asincrono, con ogni richiesta gestita indipendentemente.
3. Puoi eseguire il polling dello stato del batch e recuperare i risultati quando l'elaborazione è terminata per tutte le richieste.

Questo è particolarmente utile per operazioni in blocco che non richiedono risultati immediati, come:
- Valutazioni su larga scala: Elabora migliaia di casi di test in modo efficiente.
- Moderazione dei contenuti: Analizza grandi volumi di contenuti generati dagli utenti in modo asincrono.
- Analisi dei dati: Genera approfondimenti o riepiloghi per grandi set di dati.
- Generazione di contenuti in blocco: Crea grandi quantità di testo per vari scopi (ad esempio, descrizioni di prodotti, riepiloghi di articoli).

### Limitazioni dei batch
- Un Message Batch è limitato a 100.000 richieste Messages o 256 MB di dimensione, a seconda di quale viene raggiunto per primo.
- Elaboriamo ogni batch il più velocemente possibile, con la maggior parte dei batch che si completano entro 1 ora. Potrai accedere ai risultati del batch quando tutti i messaggi sono stati completati o dopo 24 ore, a seconda di quale viene raggiunto per primo. I batch scadranno se l'elaborazione non si completa entro 24 ore.
- I risultati del batch sono disponibili per 29 giorni dopo la creazione. Dopo di che, puoi comunque visualizzare il Batch, ma i suoi risultati non saranno più disponibili per il download.
- I batch sono limitati a un [Workspace](/settings/workspaces). Puoi visualizzare tutti i batch e i loro risultati che sono stati creati all'interno del Workspace a cui appartiene la tua chiave API.
- I limiti di velocità si applicano sia alle richieste HTTP dell'API Batches che al numero di richieste all'interno di un batch in attesa di essere elaborate. Vedi [Limiti di velocità dell'API Message Batches](/docs/it/api/rate-limits#message-batches-api). Inoltre, potremmo rallentare l'elaborazione in base alla domanda attuale e al volume delle tue richieste. In tal caso, potresti vedere più richieste scadere dopo 24 ore.
- A causa della velocità effettiva elevata e dell'elaborazione concorrente, i batch potrebbero superare leggermente il [limite di spesa](/settings/limits) configurato del tuo Workspace.

### Modelli supportati

Tutti i [modelli attivi](/docs/it/about-claude/models/overview) supportano l'API Message Batches.

### Cosa può essere elaborato in batch
Qualsiasi richiesta che puoi fare all'API Messages può essere inclusa in un batch. Questo include:

- Vision
- Utilizzo di strumenti
- Messaggi di sistema
- Conversazioni multi-turno
- Qualsiasi funzionalità beta

Poiché ogni richiesta nel batch viene elaborata indipendentemente, puoi mescolare diversi tipi di richieste all'interno di un singolo batch.

<Tip>
Poiché i batch possono richiedere più di 5 minuti per l'elaborazione, considera l'utilizzo della [durata della cache di 1 ora](/docs/it/build-with-claude/prompt-caching#1-hour-cache-duration) con la memorizzazione nella cache dei prompt per migliori tassi di hit della cache durante l'elaborazione di batch con contesto condiviso.
</Tip>

---
## Prezzi

L'API Batches offre risparmi significativi sui costi. Tutti gli utilizzi vengono addebitati al 50% dei prezzi API standard.

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
## Come utilizzare l'API Message Batches

### Prepara e crea il tuo batch

Un Message Batch è composto da un elenco di richieste per creare un Message. La forma di una singola richiesta è composta da:
- Un `custom_id` univoco per identificare la richiesta Messages
- Un oggetto `params` con i parametri standard dell'[API Messages](/docs/it/api/messages)

Puoi [creare un batch](/docs/it/api/creating-message-batches) passando questo elenco nel parametro `requests`:

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

In questo esempio, due richieste separate vengono elaborate in batch insieme per l'elaborazione asincrona. Ogni richiesta ha un `custom_id` univoco e contiene i parametri standard che useresti per una chiamata all'API Messages.

<Tip>
  **Testa le tue richieste di batch con l'API Messages**

La convalida dell'oggetto `params` per ogni richiesta di messaggio viene eseguita in modo asincrono e gli errori di convalida vengono restituiti quando l'elaborazione dell'intero batch è terminata. Puoi assicurarti di costruire il tuo input correttamente verificando la forma della tua richiesta con l'[API Messages](/docs/it/api/messages) per primo.
</Tip>

Quando un batch viene creato per la prima volta, la risposta avrà uno stato di elaborazione di `in_progress`.

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

### Tracciamento del tuo batch

Il campo `processing_status` del Message Batch indica la fase di elaborazione in cui si trova il batch. Inizia come `in_progress`, quindi si aggiorna a `ended` una volta che tutte le richieste nel batch hanno finito l'elaborazione e i risultati sono pronti. Puoi monitorare lo stato del tuo batch visitando la [Console](/settings/workspaces/default/batches), o utilizzando l'[endpoint di recupero](/docs/it/api/retrieving-message-batches).

#### Polling per il completamento di Message Batch

Per eseguire il polling di un Message Batch, avrai bisogno del suo `id`, che viene fornito nella risposta quando crei un batch o elencando i batch. Puoi implementare un ciclo di polling che controlla periodicamente lo stato del batch fino a quando l'elaborazione non è terminata:

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

### Elenco di tutti i Message Batches

Puoi elencare tutti i Message Batches nel tuo Workspace utilizzando l'[endpoint di elenco](/docs/it/api/listing-message-batches). L'API supporta la paginazione, recuperando automaticamente pagine aggiuntive secondo necessità:

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

### Recupero dei risultati del batch

Una volta terminata l'elaborazione del batch, ogni richiesta Messages nel batch avrà un risultato. Ci sono 4 tipi di risultati:

| Tipo di risultato | Descrizione |
|-------------|-------------|
| `succeeded` | La richiesta è stata completata con successo. Include il risultato del messaggio. |
| `errored`   | La richiesta ha riscontrato un errore e un messaggio non è stato creato. Gli errori possibili includono richieste non valide e errori interni del server. Non ti verrà addebitato per queste richieste. |
| `canceled`  | L'utente ha annullato il batch prima che questa richiesta potesse essere inviata al modello. Non ti verrà addebitato per queste richieste. |
| `expired`   | Il batch ha raggiunto la sua scadenza di 24 ore prima che questa richiesta potesse essere inviata al modello. Non ti verrà addebitato per queste richieste. |

Vedrai una panoramica dei tuoi risultati con il `request_counts` del batch, che mostra quante richieste hanno raggiunto ognuno di questi quattro stati.

I risultati del batch sono disponibili per il download nella proprietà `results_url` sul Message Batch e, se il permesso dell'organizzazione lo consente, nella Console. A causa della potenziale grande dimensione dei risultati, è consigliato [trasmettere i risultati](/docs/it/api/retrieving-message-batch-results) invece di scaricarli tutti in una volta.

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

I risultati saranno in formato `.jsonl`, dove ogni riga è un oggetto JSON valido che rappresenta il risultato di una singola richiesta nel Message Batch. Per ogni risultato trasmesso, puoi fare qualcosa di diverso a seconda del suo `custom_id` e del tipo di risultato. Ecco un esempio di set di risultati:

```json .jsonl file
{"custom_id":"my-second-request","result":{"type":"succeeded","message":{"id":"msg_014VwiXbi91y3JMjcpyGBHX5","type":"message","role":"assistant","model":"claude-sonnet-4-5-20250929","content":[{"type":"text","text":"Hello again! It's nice to see you. How can I assist you today? Is there anything specific you'd like to chat about or any questions you have?"}],"stop_reason":"end_turn","stop_sequence":null,"usage":{"input_tokens":11,"output_tokens":36}}}}
{"custom_id":"my-first-request","result":{"type":"succeeded","message":{"id":"msg_01FqfsLoHwgeFbguDgpz48m7","type":"message","role":"assistant","model":"claude-sonnet-4-5-20250929","content":[{"type":"text","text":"Hello! How can I assist you today? Feel free to ask me any questions or let me know if there's anything you'd like to chat about."}],"stop_reason":"end_turn","stop_sequence":null,"usage":{"input_tokens":10,"output_tokens":34}}}}
```

Se il tuo risultato ha un errore, il suo `result.error` sarà impostato sulla nostra [forma di errore](/docs/it/api/errors#error-shapes) standard.

<Tip>
  **I risultati del batch potrebbero non corrispondere all'ordine di input**

I risultati del batch possono essere restituiti in qualsiasi ordine e potrebbero non corrispondere all'ordine delle richieste quando il batch è stato creato. Nell'esempio precedente, il risultato per la seconda richiesta del batch viene restituito prima della prima. Per abbinare correttamente i risultati alle loro richieste corrispondenti, usa sempre il campo `custom_id`.
</Tip>

### Annullamento di un Message Batch

Puoi annullare un Message Batch che è attualmente in elaborazione utilizzando l'[endpoint di annullamento](/docs/it/api/canceling-message-batches). Immediatamente dopo l'annullamento, il `processing_status` di un batch sarà `canceling`. Puoi utilizzare la stessa tecnica di polling descritta sopra per attendere fino a quando l'annullamento non è finalizzato. I batch annullati finiscono con uno stato di `ended` e possono contenere risultati parziali per le richieste che sono state elaborate prima dell'annullamento.

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

La risposta mostrerà il batch in uno stato `canceling`:

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

### Utilizzo della cache dei prompt con Message Batches

L'API Message Batches supporta la cache dei prompt, consentendoti di ridurre potenzialmente i costi e il tempo di elaborazione per le richieste batch. Gli sconti sui prezzi dalla cache dei prompt e da Message Batches possono accumularsi, fornendo risparmi sui costi ancora maggiori quando entrambe le funzionalità vengono utilizzate insieme. Tuttavia, poiché le richieste batch vengono elaborate in modo asincrono e concorrente, i cache hit sono forniti su base best-effort. Gli utenti in genere sperimentano tassi di cache hit che vanno dal 30% al 98%, a seconda dei loro modelli di traffico.

Per massimizzare la probabilità di cache hit nelle tue richieste batch:

1. Includi blocchi `cache_control` identici in ogni richiesta Message all'interno del tuo batch
2. Mantieni un flusso costante di richieste per evitare che le voci della cache scadano dopo la loro durata di 5 minuti
3. Struttura le tue richieste per condividere il maggior numero possibile di contenuti memorizzati nella cache

Esempio di implementazione della cache dei prompt in un batch:

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

In questo esempio, entrambe le richieste nel batch includono messaggi di sistema identici e il testo completo di Pride and Prejudice contrassegnato con `cache_control` per aumentare la probabilità di cache hit.

### Migliori pratiche per un batching efficace

Per ottenere il massimo dall'API Batches:

- Monitora regolarmente lo stato di elaborazione del batch e implementa una logica di retry appropriata per le richieste non riuscite.
- Utilizza valori `custom_id` significativi per abbinare facilmente i risultati alle richieste, poiché l'ordine non è garantito.
- Considera di suddividere set di dati molto grandi in più batch per una migliore gestibilità.
- Esegui un test di una singola forma di richiesta con l'API Messages per evitare errori di convalida.

### Risoluzione dei problemi comuni

Se si verificano comportamenti inaspettati:

- Verifica che la dimensione totale della richiesta batch non superi 256 MB. Se la dimensione della richiesta è troppo grande, potresti ricevere un errore 413 `request_too_large`.
- Controlla che stai utilizzando [modelli supportati](#supported-models) per tutte le richieste nel batch.
- Assicurati che ogni richiesta nel batch abbia un `custom_id` univoco.
- Assicurati che siano passati meno di 29 giorni dal tempo di `created_at` del batch (non dal tempo di elaborazione `ended_at`). Se sono passati più di 29 giorni, i risultati non saranno più visualizzabili.
- Conferma che il batch non sia stato annullato.

Nota che il fallimento di una richiesta in un batch non influisce sull'elaborazione delle altre richieste.

---
## Archiviazione e privacy dei batch

- **Isolamento dell'area di lavoro**: I batch sono isolati all'interno dell'area di lavoro in cui vengono creati. Possono essere accessibili solo da chiavi API associate a quell'area di lavoro, o da utenti con autorizzazione per visualizzare i batch dell'area di lavoro nella Console.

- **Disponibilità dei risultati**: I risultati del batch sono disponibili per 29 giorni dopo la creazione del batch, consentendo ampio tempo per il recupero e l'elaborazione.

---
## FAQ

  <section title="Quanto tempo impiega un batch per essere elaborato?">

    I batch possono richiedere fino a 24 ore per l'elaborazione, ma molti termineranno prima. Il tempo di elaborazione effettivo dipende dalla dimensione del batch, dalla domanda attuale e dal volume delle tue richieste. È possibile che un batch scada e non si completi entro 24 ore.
  
</section>

  <section title="L'API Batches è disponibile per tutti i modelli?">

    Vedi [sopra](#supported-models) per l'elenco dei modelli supportati.
  
</section>

  <section title="Posso utilizzare l'API Message Batches con altre funzionalità API?">

    Sì, l'API Message Batches supporta tutte le funzionalità disponibili nell'API Messages, incluse le funzionalità beta. Tuttavia, lo streaming non è supportato per le richieste batch.
  
</section>

  <section title="Come influisce l'API Message Batches sui prezzi?">

    L'API Message Batches offre uno sconto del 50% su tutti gli utilizzi rispetto ai prezzi API standard. Questo si applica ai token di input, ai token di output e a qualsiasi token speciale. Per ulteriori informazioni sui prezzi, visita la nostra [pagina dei prezzi](https://claude.com/pricing#anthropic-api).
  
</section>

  <section title="Posso aggiornare un batch dopo che è stato inviato?">

    No, una volta inviato un batch, non può essere modificato. Se hai bisogno di apportare modifiche, dovresti annullare il batch corrente e inviarne uno nuovo. Nota che l'annullamento potrebbe non avere effetto immediato.
  
</section>

  <section title="Ci sono limiti di velocità dell'API Message Batches e interagiscono con i limiti di velocità dell'API Messages?">

    L'API Message Batches ha limiti di velocità basati su richieste HTTP oltre ai limiti sul numero di richieste che necessitano di elaborazione. Vedi [Limiti di velocità dell'API Message Batches](/docs/it/api/rate-limits#message-batches-api). L'utilizzo dell'API Batches non influisce sui limiti di velocità nell'API Messages.
  
</section>

  <section title="Come gestisco gli errori nelle mie richieste batch?">

    Quando recuperi i risultati, ogni richiesta avrà un campo `result` che indica se ha `succeeded`, `errored`, è stata `canceled`, o è `expired`. Per i risultati `errored`, verranno fornite informazioni di errore aggiuntive. Visualizza l'oggetto di risposta di errore nel [riferimento API](/docs/it/api/creating-message-batches).
  
</section>

  <section title="Come gestisce l'API Message Batches la privacy e la separazione dei dati?">

    L'API Message Batches è progettata con forti misure di privacy e separazione dei dati:

    1. I batch e i loro risultati sono isolati all'interno dell'area di lavoro in cui sono stati creati. Ciò significa che possono essere accessibili solo da chiavi API dello stesso spazio di lavoro.
    2. Ogni richiesta all'interno di un batch viene elaborata in modo indipendente, senza perdita di dati tra le richieste.
    3. I risultati sono disponibili solo per un tempo limitato (29 giorni) e seguono la nostra [politica di conservazione dei dati](https://support.claude.com/en/articles/7996866-how-long-do-you-store-personal-data).
    4. Il download dei risultati del batch nella Console può essere disabilitato a livello di organizzazione o per singola area di lavoro.
  
</section>

  <section title="Posso utilizzare la cache dei prompt nell'API Message Batches?">

    Sì, è possibile utilizzare la cache dei prompt con l'API Message Batches. Tuttavia, poiché le richieste batch asincrone possono essere elaborate contemporaneamente e in qualsiasi ordine, i cache hit sono forniti su base best-effort.
  
</section>