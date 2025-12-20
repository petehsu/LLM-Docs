# Streaming dei Messaggi

Impara come utilizzare lo streaming per ricevere risposte incrementali dai messaggi di Claude utilizzando eventi server-sent.

---

Quando crei un Messaggio, puoi impostare `"stream": true` per trasmettere incrementalmente la risposta utilizzando [eventi server-sent](https://developer.mozilla.org/en-US/Web/API/Server-sent%5Fevents/Using%5Fserver-sent%5Fevents) (SSE).

## Streaming con SDK

I nostri SDK [Python](https://github.com/anthropics/anthropic-sdk-python) e [TypeScript](https://github.com/anthropics/anthropic-sdk-typescript) offrono diversi modi di streaming. L'SDK Python consente sia stream sincroni che asincroni. Consulta la documentazione in ogni SDK per i dettagli.

<CodeGroup>
    ```python Python
    import anthropic

    client = anthropic.Anthropic()

    with client.messages.stream(
        max_tokens=1024,
        messages=[{"role": "user", "content": "Ciao"}],
        model="claude-sonnet-4-5",
    ) as stream:
      for text in stream.text_stream:
          print(text, end="", flush=True)
    ```

    ```typescript TypeScript
    import Anthropic from '@anthropic-ai/sdk';

    const client = new Anthropic();

    await client.messages.stream({
        messages: [{role: 'user', content: "Ciao"}],
        model: 'claude-sonnet-4-5',
        max_tokens: 1024,
    }).on('text', (text) => {
        console.log(text);
    });
    ```
</CodeGroup>

## Tipi di eventi

Ogni evento server-sent include un tipo di evento denominato e dati JSON associati. Ogni evento utilizzerà un nome evento SSE (ad es. `event: message_stop`), e includerà il `type` di evento corrispondente nei suoi dati.

Ogni stream utilizza il seguente flusso di eventi:

1. `message_start`: contiene un oggetto `Message` con `content` vuoto.
2. Una serie di blocchi di contenuto, ognuno dei quali ha un `content_block_start`, uno o più eventi `content_block_delta`, e un evento `content_block_stop`. Ogni blocco di contenuto avrà un `index` che corrisponde al suo indice nell'array `content` del Messaggio finale.
3. Uno o più eventi `message_delta`, che indicano modifiche di alto livello all'oggetto `Message` finale.
4. Un evento finale `message_stop`.

  <Warning>
  I conteggi dei token mostrati nel campo `usage` dell'evento `message_delta` sono *cumulativi*.
  </Warning>

### Eventi ping

I flussi di eventi possono anche includere qualsiasi numero di eventi `ping`.

### Eventi di errore

Occasionalmente potremmo inviare [errori](/docs/it/api/errors) nel flusso di eventi. Ad esempio, durante periodi di utilizzo elevato, potresti ricevere un `overloaded_error`, che normalmente corrisponderebbe a un HTTP 529 in un contesto non-streaming:

```json Esempio di errore
event: error
data: {"type": "error", "error": {"type": "overloaded_error", "message": "Overloaded"}}
```

### Altri eventi

In conformità con la nostra [politica di versioning](/docs/it/api/versioning), potremmo aggiungere nuovi tipi di eventi, e il tuo codice dovrebbe gestire i tipi di eventi sconosciuti con grazia.

## Tipi di delta dei blocchi di contenuto

Ogni evento `content_block_delta` contiene un `delta` di un tipo che aggiorna il blocco `content` a un dato `index`.

### Delta di testo

Un delta del blocco di contenuto `text` appare così:
```json Delta di testo
event: content_block_delta
data: {"type": "content_block_delta","index": 0,"delta": {"type": "text_delta", "text": "ello amico"}}
```

### Delta JSON di input

I delta per i blocchi di contenuto `tool_use` corrispondono agli aggiornamenti per il campo `input` del blocco. Per supportare la massima granularità, i delta sono _stringhe JSON parziali_, mentre il `tool_use.input` finale è sempre un _oggetto_.

Puoi accumulare i delta delle stringhe e analizzare il JSON una volta che ricevi un evento `content_block_stop`, utilizzando una libreria come [Pydantic](https://docs.pydantic.dev/latest/concepts/json/#partial-json-parsing) per fare il parsing JSON parziale, o utilizzando i nostri [SDK](/docs/it/api/client-sdks), che forniscono helper per accedere ai valori incrementali analizzati.

Un delta del blocco di contenuto `tool_use` appare così:
```json Delta JSON di input
event: content_block_delta
data: {"type": "content_block_delta","index": 1,"delta": {"type": "input_json_delta","partial_json": "{\"location\": \"San Fra"}}}
```
Nota: I nostri modelli attuali supportano solo l'emissione di una chiave e valore completi da `input` alla volta. Pertanto, quando si utilizzano strumenti, potrebbero esserci ritardi tra gli eventi di streaming mentre il modello sta lavorando. Una volta che una chiave e valore `input` sono accumulati, li emettiamo come eventi multipli `content_block_delta` con json parziale frammentato in modo che il formato possa supportare automaticamente una granularità più fine nei modelli futuri.

### Delta di pensiero

Quando si utilizza [pensiero esteso](/docs/it/build-with-claude/extended-thinking#streaming-thinking) con streaming abilitato, riceverai contenuto di pensiero tramite eventi `thinking_delta`. Questi delta corrispondono al campo `thinking` dei blocchi di contenuto `thinking`.

Per il contenuto di pensiero, un evento speciale `signature_delta` viene inviato proprio prima dell'evento `content_block_stop`. Questa firma viene utilizzata per verificare l'integrità del blocco di pensiero.

Un tipico delta di pensiero appare così:
```json Delta di pensiero
event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "Risolviamo questo passo dopo passo:\n\n1. Prima scomponiamo 27 * 453"}}
```

Il delta della firma appare così:
```json Delta della firma
event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "signature_delta", "signature": "EqQBCgIYAhIM1gbcDa9GJwZA2b3hGgxBdjrkzLoky3dl1pkiMOYds..."}}
```

## Risposta completa del flusso HTTP

Raccomandiamo vivamente di utilizzare i nostri [SDK client](/docs/it/api/client-sdks) quando si utilizza la modalità streaming. Tuttavia, se stai costruendo un'integrazione API diretta, dovrai gestire questi eventi da solo.

Una risposta stream è composta da:
1. Un evento `message_start`
2. Potenzialmente multipli blocchi di contenuto, ognuno dei quali contiene:
    - Un evento `content_block_start`
    - Potenzialmente multipli eventi `content_block_delta`
    - Un evento `content_block_stop`
3. Un evento `message_delta`
4. Un evento `message_stop`

Potrebbero esserci eventi `ping` dispersi in tutta la risposta. Vedi [Tipi di eventi](#tipi-di-eventi) per maggiori dettagli sul formato.

### Richiesta di streaming di base

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --data \
'{
  "model": "claude-sonnet-4-5",
  "messages": [{"role": "user", "content": "Ciao"}],
  "max_tokens": 256,
  "stream": true
}'
```

```python Python
import anthropic

client = anthropic.Anthropic()

with client.messages.stream(
    model="claude-sonnet-4-5",
    messages=[{"role": "user", "content": "Ciao"}],
    max_tokens=256,
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```
</CodeGroup>

```json Risposta
event: message_start
data: {"type": "message_start", "message": {"id": "msg_1nZdL29xx5MUA1yADyHTEsnR8uuvGzszyY", "type": "message", "role": "assistant", "content": [], "model": "claude-sonnet-4-5-20250929", "stop_reason": null, "stop_sequence": null, "usage": {"input_tokens": 25, "output_tokens": 1}}}

event: content_block_start
data: {"type": "content_block_start", "index": 0, "content_block": {"type": "text", "text": ""}}

event: ping
data: {"type": "ping"}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "text_delta", "text": "Ciao"}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "text_delta", "text": "!"}}

event: content_block_stop
data: {"type": "content_block_stop", "index": 0}

event: message_delta
data: {"type": "message_delta", "delta": {"stop_reason": "end_turn", "stop_sequence":null}, "usage": {"output_tokens": 15}}

event: message_stop
data: {"type": "message_stop"}

```

### Richiesta di streaming con uso di strumenti

<Tip>
L'uso di strumenti ora supporta lo streaming a grana fine per i valori dei parametri come funzionalità beta. Per maggiori dettagli, vedi [Streaming di strumenti a grana fine](/docs/it/agents-and-tools/tool-use/fine-grained-tool-streaming).
</Tip>

In questa richiesta, chiediamo a Claude di utilizzare uno strumento per dirci il tempo.

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
          "description": "Ottieni il tempo attuale in una determinata località",
          "input_schema": {
            "type": "object",
            "properties": {
              "location": {
                "type": "string",
                "description": "La città e lo stato, ad es. San Francisco, CA"
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
          "content": "Com'è il tempo a San Francisco?"
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
        "description": "Ottieni il tempo attuale in una determinata località",
        "input_schema": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "La città e lo stato, ad es. San Francisco, CA"
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
            "content": "Com'è il tempo a San Francisco?"
        }
    ],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```
</CodeGroup>

```json Risposta
event: message_start
data: {"type":"message_start","message":{"id":"msg_014p7gG3wDgGV9EUtLvnow3U","type":"message","role":"assistant","model":"claude-sonnet-4-5-20250929","stop_sequence":null,"usage":{"input_tokens":472,"output_tokens":2},"content":[],"stop_reason":null}}

event: content_block_start
data: {"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}

event: ping
data: {"type": "ping"}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"Va bene"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":","}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" controlliamo"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" il"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" tempo"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" per"}}

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

### Richiesta di streaming con pensiero esteso

In questa richiesta, abilitiamo il pensiero esteso con streaming per vedere il ragionamento passo dopo passo di Claude.

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
            "content": "Quanto fa 27 * 453?"
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
            "content": "Quanto fa 27 * 453?"
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

```json Risposta
event: message_start
data: {"type": "message_start", "message": {"id": "msg_01...", "type": "message", "role": "assistant", "content": [], "model": "claude-sonnet-4-5-20250929", "stop_reason": null, "stop_sequence": null}}

event: content_block_start
data: {"type": "content_block_start", "index": 0, "content_block": {"type": "thinking", "thinking": ""}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "Risolviamo questo passo dopo passo:\n\n1. Prima scomponiamo 27 * 453"}}

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

### Richiesta di streaming con uso dello strumento di ricerca web

In questa richiesta, chiediamo a Claude di cercare sul web informazioni meteorologiche attuali.

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
            "content": "Com'è il tempo a New York City oggi?"
        }
    ]
}'
```

```python Python
import anthropic

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
            "content": "Com'è il tempo a New York City oggi?"
        }
    ],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```
</CodeGroup>

```json Risposta
event: message_start
data: {"type":"message_start","message":{"id":"msg_01G...","type":"message","role":"assistant","model":"claude-sonnet-4-5-20250929","content":[],"stop_reason":null,"stop_sequence":null,"usage":{"input_tokens":2679,"cache_creation_input_tokens":0,"cache_read_input_tokens":0,"output_tokens":3}}}

event: content_block_start
data: {"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"Controllerò"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" il tempo attuale a New York City per te"}}

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
data: {"type":"content_block_delta","index":3,"delta":{"type":"text_delta","text":"Ecco le informazioni meteorologiche attuali per New York"}}

event: content_block_delta
data: {"type":"content_block_delta","index":3,"delta":{"type":"text_delta","text":" City:\n\n# Tempo"}}

event: content_block_delta
data: {"type":"content_block_delta","index":3,"delta":{"type":"text_delta","text":" a New York City"}}

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

## Recupero degli errori

Quando una richiesta di streaming viene interrotta a causa di problemi di rete, timeout o altri errori, puoi recuperare riprendendo da dove il flusso è stato interrotto. Questo approccio ti fa risparmiare dal dover rielaborare l'intera risposta.

La strategia di recupero di base prevede:

1. **Catturare la risposta parziale**: Salva tutto il contenuto che è stato ricevuto con successo prima che si verificasse l'errore
2. **Costruire una richiesta di continuazione**: Crea una nuova richiesta API che includa la risposta parziale dell'assistente come inizio di un nuovo messaggio dell'assistente
3. **Riprendere lo streaming**: Continua a ricevere il resto della risposta da dove è stata interrotta

### Migliori pratiche per il recupero degli errori

1. **Utilizza le funzionalità dell'SDK**: Sfrutta le capacità integrate dell'SDK per l'accumulo dei messaggi e la gestione degli errori
2. **Gestisci i tipi di contenuto**: Sii consapevole che i messaggi possono contenere più blocchi di contenuto (`text`, `tool_use`, `thinking`). I blocchi di uso strumenti e pensiero esteso non possono essere parzialmente recuperati. Puoi riprendere lo streaming dal blocco di testo più recente.