# Panoramica API

La Claude API è un'API RESTful che fornisce accesso programmatico ai modelli Claude. Scopri come autenticarti, utilizzare gli SDK client e accedere alle API disponibili.

---

La Claude API è un'API RESTful all'indirizzo `https://api.anthropic.com` che fornisce accesso programmatico ai modelli Claude. L'API principale è l'API Messages (`POST /v1/messages`) per le interazioni conversazionali.

<Note>
**Nuovo a Claude?** Inizia con [Get started](/docs/it/get-started) per i prerequisiti e la tua prima chiamata API, oppure consulta [Working with Messages](/docs/it/build-with-claude/working-with-messages) per i pattern di richiesta/risposta e gli esempi.
</Note>

## Prerequisiti

Per utilizzare la Claude API, avrai bisogno di:

- Un account [Anthropic Console](https://console.anthropic.com)
- Una [chiave API](/settings/keys)

Per le istruzioni di configurazione passo dopo passo, consulta [Get started](/docs/it/get-started).

## API disponibili

La Claude API include le seguenti API:

**Disponibilità generale:**
- **[Messages API](/docs/it/api/messages)**: Invia messaggi a Claude per le interazioni conversazionali (`POST /v1/messages`)
- **[Message Batches API](/docs/it/api/creating-message-batches)**: Elabora grandi volumi di richieste Messages in modo asincrono con riduzione dei costi del 50% (`POST /v1/messages/batches`)
- **[Token Counting API](/docs/it/api/messages-count-tokens)**: Conta i token in un messaggio prima di inviarlo per gestire i costi e i limiti di velocità (`POST /v1/messages/count_tokens`)
- **[Models API](/docs/it/api/models-list)**: Elenca i modelli Claude disponibili e i loro dettagli (`GET /v1/models`)

**Beta:**
- **[Files API](/docs/it/api/files-create)**: Carica e gestisci file per l'uso in più chiamate API (`POST /v1/files`, `GET /v1/files`)
- **[Skills API](/docs/it/api/skills/create-skill)**: Crea e gestisci competenze personalizzate degli agenti (`POST /v1/skills`, `GET /v1/skills`)

Per il riferimento API completo con tutti gli endpoint, parametri e schemi di risposta, esplora le pagine di riferimento API elencate nella navigazione. Per accedere alle funzioni beta, consulta [Beta headers](/docs/it/api/beta-headers).

## Autenticazione

Tutte le richieste alla Claude API devono includere questi header:

| Header | Valore | Obbligatorio |
|--------|--------|----------|
| `x-api-key` | La tua chiave API da Console | Sì |
| `anthropic-version` | Versione API (ad es., `2023-06-01`) | Sì |
| `content-type` | `application/json` | Sì |

Se stai utilizzando gli [SDK Client](#client-sdks), l'SDK invierà questi header automaticamente. Per i dettagli sul versionamento dell'API, consulta [API versions](/docs/it/api/versioning).

### Ottenere le chiavi API

L'API è resa disponibile tramite la [Console](https://console.anthropic.com/) web. Puoi utilizzare il [Workbench](https://console.anthropic.com/workbench) per provare l'API nel browser e quindi generare le chiavi API in [Account Settings](https://console.anthropic.com/settings/keys). Utilizza gli [workspace](https://console.anthropic.com/settings/workspaces) per segmentare le tue chiavi API e [controllare la spesa](/docs/it/api/rate-limits) per caso d'uso.

## SDK Client

Anthropic fornisce SDK ufficiali che semplificano l'integrazione dell'API gestendo l'autenticazione, la formattazione delle richieste, la gestione degli errori e altro ancora.

**Vantaggi**:
- Gestione automatica degli header (x-api-key, anthropic-version, content-type)
- Gestione delle richieste e delle risposte type-safe
- Logica di retry integrata e gestione degli errori
- Supporto dello streaming
- Timeout delle richieste e gestione della connessione

**Esempio** (Python):
```python
from anthropic import Anthropic

client = Anthropic()  # Legge ANTHROPIC_API_KEY dall'ambiente
message = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello, Claude"}]
)
```

Per un elenco degli SDK client e le rispettive istruzioni di installazione, consulta [Client SDKs](/docs/it/api/client-sdks).

## Claude API vs Piattaforme di terze parti

Claude è disponibile tramite l'API diretta di Anthropic e tramite piattaforme partner. Scegli in base alla tua infrastruttura, ai requisiti di conformità e alle preferenze di prezzo.

### Claude API

- **Accesso diretto** ai modelli e alle funzioni più recenti per primo
- **Fatturazione e supporto Anthropic**
- **Ideale per**: Nuove integrazioni, accesso completo alle funzioni, relazione diretta con Anthropic

### API di piattaforme di terze parti

Accedi a Claude tramite AWS, Google Cloud o Microsoft Azure:
- **Integrato** con la fatturazione e l'IAM del provider cloud
- **Potrebbe avere ritardi nelle funzioni** o differenze rispetto all'API diretta
- **Ideale per**: Impegni cloud esistenti, requisiti di conformità specifici, fatturazione cloud consolidata

| Piattaforma | Provider | Documentazione |
|----------|----------|---------------|
| Amazon Bedrock | AWS | [Claude on Amazon Bedrock](/docs/it/build-with-claude/claude-on-amazon-bedrock) |
| Vertex AI | Google Cloud | [Claude on Vertex AI](/docs/it/build-with-claude/claude-on-vertex-ai) |
| Azure AI | Microsoft Azure | [Claude on Azure AI](/docs/it/build-with-claude/claude-in-microsoft-foundry) |

<Note>
Per la disponibilità delle funzioni tra le piattaforme, consulta la [Features overview](/docs/it/build-with-claude/overview).
</Note>

## Formato di richiesta e risposta

### Limiti di dimensione della richiesta

L'API ha diverse dimensioni massime di richiesta a seconda dell'endpoint:

| Endpoint | Dimensione massima |
|----------|--------------|
| Endpoint standard (Messages, Token Counting) | 32 MB |
| [Batch API](/docs/it/build-with-claude/batch-processing) | 256 MB |
| [Files API](/docs/it/build-with-claude/files) | 500 MB |

Se superi questi limiti, riceverai un errore 413 `request_too_large`.

### Header di risposta

La Claude API include i seguenti header in ogni risposta:

- `request-id`: Un identificatore univoco globale per la richiesta
- `anthropic-organization-id`: L'ID dell'organizzazione associato alla chiave API utilizzata nella richiesta

## Limiti di velocità e disponibilità

### Limiti di velocità

L'API applica limiti di velocità e limiti di spesa per prevenire gli abusi e gestire la capacità. I limiti sono organizzati in livelli di utilizzo che aumentano automaticamente man mano che utilizzi l'API. Ogni livello ha:

- **Limiti di spesa**: Costo mensile massimo per l'utilizzo dell'API
- **Limiti di velocità**: Numero massimo di richieste al minuto (RPM) e token al minuto (TPM)

Puoi visualizzare i limiti attuali della tua organizzazione nella [Console](/settings/limits). Per limiti più elevati o Priority Tier (livelli di servizio migliorati con spesa impegnata), contatta il team di vendita tramite la Console.

Per informazioni dettagliate su limiti, livelli e l'algoritmo token bucket utilizzato per il rate limiting, consulta [Rate limits](/docs/it/api/rate-limits).

### Disponibilità

La Claude API è disponibile in [molti paesi e regioni](/docs/it/api/supported-regions) in tutto il mondo. Controlla la pagina delle regioni supportate per confermare la disponibilità nella tua posizione.

## Esempio di base

Ecco una richiesta minima utilizzando l'API Messages:

```bash
curl https://api.anthropic.com/v1/messages \
  --header "x-api-key: $ANTHROPIC_API_KEY" \
  --header "anthropic-version: 2023-06-01" \
  --header "content-type: application/json" \
  --data '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "Hello, Claude"}
    ]
  }'
```

**Risposta:**
```json
{
  "id": "msg_01XFDUDYJgAACzvnptvVoYEL",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "Hello! How can I assist you today?"
    }
  ],
  "model": "claude-sonnet-4-5",
  "stop_reason": "end_turn",
  "usage": {
    "input_tokens": 12,
    "output_tokens": 8
  }
}
```

Per esempi completi e tutorial, consulta [Get started](/docs/it/get-started) e [Working with Messages](/docs/it/build-with-claude/working-with-messages).

## Passaggi successivi

<CardGroup cols={3}>
  <Card title="Get started" icon="rocket" href="/docs/it/get-started">
    Prerequisiti, tutorial passo dopo passo ed esempi in più lingue
  </Card>
  <Card title="Working with Messages" icon="message" href="/docs/it/build-with-claude/working-with-messages">
    Pattern di richiesta/risposta, conversazioni multi-turno e best practice
  </Card>
  <Card title="Messages API Reference" icon="book" href="/docs/it/api/messages">
    Specifica API completa: parametri, risposte e codici di errore
  </Card>
  <Card title="Client SDKs" icon="code" href="/docs/it/api/client-sdks">
    Guide di installazione per Python, TypeScript, Java, Go, C#, Ruby e PHP
  </Card>
  <Card title="Features overview" icon="grid" href="/docs/it/build-with-claude/overview">
    Esplora le capacità: caching, vision, tool use, streaming e altro ancora
  </Card>
  <Card title="Rate limits" icon="gauge" href="/docs/it/api/rate-limits">
    Livelli di utilizzo, limiti di spesa e rate limiting con algoritmo token bucket
  </Card>
</CardGroup>