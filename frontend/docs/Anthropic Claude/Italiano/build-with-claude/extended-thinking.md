# Costruire con il ragionamento esteso

Il ragionamento esteso fornisce a Claude capacità di ragionamento migliorate per compiti complessi, con diversi livelli di trasparenza nel suo processo di pensiero passo dopo passo prima di fornire la risposta finale.

---

Il ragionamento esteso fornisce a Claude capacità di ragionamento migliorate per compiti complessi, con diversi livelli di trasparenza nel suo processo di pensiero passo dopo passo prima di fornire la risposta finale.

## Modelli supportati

Il ragionamento esteso è supportato nei seguenti modelli:

- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Sonnet 3.7 (`claude-3-7-sonnet-20250219`) ([deprecato](/docs/it/about-claude/model-deprecations))
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)
- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)

<Note>
Il comportamento dell'API differisce tra i modelli Claude Sonnet 3.7 e Claude 4, ma le forme dell'API rimangono esattamente le stesse.

Per ulteriori informazioni, consulta [Differenze nel ragionamento tra le versioni dei modelli](#differences-in-thinking-across-model-versions).
</Note>

## Come funziona il ragionamento esteso

Quando il ragionamento esteso è attivato, Claude crea blocchi di contenuto `thinking` dove produce il suo ragionamento interno. Claude incorpora gli insegnamenti da questo ragionamento prima di formulare una risposta finale.

La risposta dell'API includerà blocchi di contenuto `thinking`, seguiti da blocchi di contenuto `text`.

Ecco un esempio del formato di risposta predefinito:

```json
{
  "content": [
    {
      "type": "thinking",
      "thinking": "Lasciami analizzare questo passo dopo passo...",
      "signature": "WaUjzkypQ2mUEVM36O2TxuC06KN8xyfbJwyem2dw3URve/op91XWHOEBLLqIOMfFG/UvLEczmEsUjavL...."
    },
    {
      "type": "text",
      "text": "Basandomi sulla mia analisi..."
    }
  ]
}
```

Per ulteriori informazioni sul formato di risposta del ragionamento esteso, consulta il [Riferimento API Messages](/docs/it/api/messages).

## Come utilizzare il ragionamento esteso

Ecco un esempio di utilizzo del ragionamento esteso nell'API Messages:

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
            "content": "Esiste un numero infinito di numeri primi tali che n mod 4 == 3?"
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
        "content": "Esiste un numero infinito di numeri primi tali che n mod 4 == 3?"
    }]
)

# La risposta conterrà blocchi di pensiero riassunti e blocchi di testo
for block in response.content:
    if block.type == "thinking":
        print(f"\nRiassunto del pensiero: {block.thinking}")
    elif block.type == "text":
        print(f"\nRisposta: {block.text}")
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
    content: "Esiste un numero infinito di numeri primi tali che n mod 4 == 3?"
  }]
});

// La risposta conterrà blocchi di pensiero riassunti e blocchi di testo
for (const block of response.content) {
  if (block.type === "thinking") {
    console.log(`\nRiassunto del pensiero: ${block.thinking}`);
  } else if (block.type === "text") {
    console.log(`\nRisposta: ${block.text}`);
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
                        .addUserMessage("Esiste un numero infinito di numeri primi tali che n mod 4 == 3?")
                        .build()
        );

        System.out.println(response);
    }
}
```

</CodeGroup>

Per attivare il ragionamento esteso, aggiungi un oggetto `thinking`, con il parametro `type` impostato su `enabled` e `budget_tokens` impostato su un budget di token specificato per il ragionamento esteso.

Il parametro `budget_tokens` determina il numero massimo di token che Claude può utilizzare per il suo processo di ragionamento interno. Nei modelli Claude 4, questo limite si applica ai token di ragionamento completo, e non all'[output riassunto](#summarized-thinking). Budget più grandi possono migliorare la qualità della risposta consentendo un'analisi più approfondita per problemi complessi, anche se Claude potrebbe non utilizzare l'intero budget allocato, specialmente negli intervalli superiori a 32k.

`budget_tokens` deve essere impostato su un valore inferiore a `max_tokens`. Tuttavia, quando si utilizza il [ragionamento intercalato con strumenti](#interleaved-thinking), è possibile superare questo limite poiché il limite di token diventa l'intera finestra di contesto (200k token).

### Ragionamento riassunto

Con il ragionamento esteso abilitato, l'API Messages per i modelli Claude 4 restituisce un riassunto del processo di ragionamento completo di Claude. Il ragionamento riassunto fornisce i vantaggi di intelligenza completa del ragionamento esteso, prevenendo al contempo l'uso improprio.

Ecco alcune considerazioni importanti per il ragionamento riassunto:

- Ti viene addebitato il numero completo di token di ragionamento generati dalla richiesta originale, non i token di riepilogo.
- Il conteggio dei token di output fatturati **non corrisponderà** al conteggio dei token che vedi nella risposta.
- Le prime righe dell'output di pensiero sono più dettagliate, fornendo un ragionamento dettagliato che è particolarmente utile per scopi di ingegneria dei prompt.
- Mentre Anthropic cerca di migliorare la funzione di ragionamento esteso, il comportamento della sintesi è soggetto a modifiche.
- La sintesi preserva le idee chiave del processo di ragionamento di Claude con latenza minima aggiunta, consentendo un'esperienza utente trasmissibile e una facile migrazione da Claude Sonnet 3.7 ai modelli Claude 4.
- La sintesi viene elaborata da un modello diverso da quello che specifichi nelle tue richieste. Il modello di ragionamento non vede l'output riassunto.

<Note>
Claude Sonnet 3.7 continua a restituire l'output di ragionamento completo.

Nei rari casi in cui hai bisogno di accesso all'output di ragionamento completo per i modelli Claude 4, [contatta il nostro team di vendita](mailto:sales@anthropic.com).
</Note>

### Ragionamento in streaming

Puoi trasmettere risposte di ragionamento esteso utilizzando [server-sent events (SSE)](https://developer.mozilla.org/en-US/Web/API/Server-sent%5Fevents/Using%5Fserver-sent%5Fevents).

Quando lo streaming è abilitato per il ragionamento esteso, ricevi il contenuto di pensiero tramite eventi `thinking_delta`.

Per ulteriore documentazione sullo streaming tramite l'API Messages, consulta [Streaming Messages](/docs/it/build-with-claude/streaming).

Ecco come gestire lo streaming con il ragionamento:

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
    max_tokens=16000,
    thinking={"type": "enabled", "budget_tokens": 10000},
    messages=[{"role": "user", "content": "Quanto fa 27 * 453?"}],
) as stream:
    thinking_started = False
    response_started = False

    for event in stream:
        if event.type == "content_block_start":
            print(f"\nInizio del blocco {event.content_block.type}...")
            # Reimposta i flag per ogni nuovo blocco
            thinking_started = False
            response_started = False
        elif event.type == "content_block_delta":
            if event.delta.type == "thinking_delta":
                if not thinking_started:
                    print("Pensiero: ", end="", flush=True)
                    thinking_started = True
                print(event.delta.thinking, end="", flush=True)
            elif event.delta.type == "text_delta":
                if not response_started:
                    print("Risposta: ", end="", flush=True)
                    response_started = True
                print(event.delta.text, end="", flush=True)
        elif event.type == "content_block_stop":
            print("\nBlocco completato.")
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
    content: "Quanto fa 27 * 453?"
  }]
});

let thinkingStarted = false;
let responseStarted = false;

for await (const event of stream) {
  if (event.type === 'content_block_start') {
    console.log(`\nInizio del blocco ${event.content_block.type}...`);
    // Reimposta i flag per ogni nuovo blocco
    thinkingStarted = false;
    responseStarted = false;
  } else if (event.type === 'content_block_delta') {
    if (event.delta.type === 'thinking_delta') {
      if (!thinkingStarted) {
        process.stdout.write('Pensiero: ');
        thinkingStarted = true;
      }
      process.stdout.write(event.delta.thinking);
    } else if (event.delta.type === 'text_delta') {
      if (!responseStarted) {
        process.stdout.write('Risposta: ');
        responseStarted = true;
      }
      process.stdout.write(event.delta.text);
    }
  } else if (event.type === 'content_block_stop') {
    console.log('\nBlocco completato.');
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
                .addUserMessage("Quanto fa 27 * 453?")
                .build();

        try (StreamResponse<BetaRawMessageStreamEvent> streamResponse =
                     client.beta().messages().createStreaming(createParams)) {
            streamResponse.stream()
                    .forEach(event -> {
                        if (event.isContentBlockStart()) {
                            System.out.printf("\nInizio del blocco %s...%n",
                                    event.asContentBlockStart()._type());
                            // Reimposta i flag per ogni nuovo blocco
                            thinkingStarted = false;
                            responseStarted = false;
                        } else if (event.isContentBlockDelta()) {
                            var delta = event.asContentBlockDelta().delta();
                            if (delta.isBetaThinking()) {
                                if (!thinkingStarted) {
                                    System.out.print("Pensiero: ");
                                    thinkingStarted = true;
                                }
                                System.out.print(delta.asBetaThinking().thinking());
                                System.out.flush();
                            } else if (delta.isBetaText()) {
                                if (!responseStarted) {
                                    System.out.print("Risposta: ");
                                    responseStarted = true;
                                }
                                System.out.print(delta.asBetaText().text());
                                System.out.flush();
                            }
                        } else if (event.isContentBlockStop()) {
                            System.out.println("\nBlocco completato.");
                        }
                    });
        }
    }
}
```

</CodeGroup>

<TryInConsoleButton userPrompt="Quanto fa 27 * 453?" thinkingBudgetTokens={16000}>
  Prova nella Console
</TryInConsoleButton>

Esempio di output dello streaming:
```json
event: message_start
data: {"type": "message_start", "message": {"id": "msg_01...", "type": "message", "role": "assistant", "content": [], "model": "claude-sonnet-4-5", "stop_reason": null, "stop_sequence": null}}

event: content_block_start
data: {"type": "content_block_start", "index": 0, "content_block": {"type": "thinking", "thinking": ""}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "Lasciami risolvere questo passo dopo passo:\n\n1. Per prima cosa scomponi 27 * 453"}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "\n2. 453 = 400 + 50 + 3"}}

// Delta di pensiero aggiuntivi...

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "signature_delta", "signature": "EqQBCgIYAhIM1gbcDa9GJwZA2b3hGgxBdjrkzLoky3dl1pkiMOYds..."}}

event: content_block_stop
data: {"type": "content_block_stop", "index": 0}

event: content_block_start
data: {"type": "content_block_start", "index": 1, "content_block": {"type": "text", "text": ""}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 1, "delta": {"type": "text_delta", "text": "27 * 453 = 12.231"}}

// Delta di testo aggiuntivi...

event: content_block_stop
data: {"type": "content_block_stop", "index": 1}

event: message_delta
data: {"type": "message_delta", "delta": {"stop_reason": "end_turn", "stop_sequence": null}}

event: message_stop
data: {"type": "message_stop"}
```

<Note>
Quando si utilizza lo streaming con il ragionamento abilitato, potresti notare che il testo a volte arriva in blocchi più grandi alternati con una consegna token per token più piccola. Questo è un comportamento previsto, specialmente per il contenuto di pensiero.

Il sistema di streaming deve elaborare il contenuto in batch per prestazioni ottimali, il che può risultare in questo modello di consegna "frammentaria", con possibili ritardi tra gli eventi di streaming. Stiamo continuamente lavorando per migliorare questa esperienza, con aggiornamenti futuri focalizzati su rendere il contenuto di pensiero più fluido nello streaming.
</Note>

## Ragionamento esteso con uso di strumenti

Il ragionamento esteso può essere utilizzato insieme all'[uso di strumenti](/docs/it/agents-and-tools/tool-use/overview), consentendo a Claude di ragionare attraverso la selezione degli strumenti e l'elaborazione dei risultati.

Quando si utilizza il ragionamento esteso con l'uso di strumenti, tieni presente le seguenti limitazioni:

1. **Limitazione della scelta dello strumento**: L'uso di strumenti con ragionamento supporta solo `tool_choice: {"type": "auto"}` (il valore predefinito) o `tool_choice: {"type": "none"}`. L'utilizzo di `tool_choice: {"type": "any"}` o `tool_choice: {"type": "tool", "name": "..."}` risulterà in un errore perché queste opzioni forzano l'uso dello strumento, che è incompatibile con il ragionamento esteso.

2. **Preservazione dei blocchi di ragionamento**: Durante l'uso dello strumento, devi passare i blocchi `thinking` all'API per l'ultimo messaggio dell'assistente. Includi il blocco completo e non modificato all'API per mantenere la continuità del ragionamento.

### Attivazione/disattivazione delle modalità di ragionamento nelle conversazioni

Non puoi attivare/disattivare il ragionamento nel mezzo di un turno dell'assistente, incluso durante i cicli di uso dello strumento. L'intero turno dell'assistente deve operare in una singola modalità di ragionamento:

- **Se il ragionamento è abilitato**, il turno finale dell'assistente deve iniziare con un blocco di ragionamento.
- **Se il ragionamento è disabilitato**, il turno finale dell'assistente non deve contenere alcun blocco di ragionamento

Dal punto di vista del modello, **i cicli di uso dello strumento fanno parte del turno dell'assistente**. Un turno dell'assistente non si completa finché Claude non termina la sua risposta completa, che può includere più chiamate di strumenti e risultati.

Ad esempio, questa sequenza fa parte di un **singolo turno dell'assistente**:
```
Utente: "Qual è il meteo a Parigi?"
Assistente: [ragionamento] + [tool_use: get_weather]
Utente: [tool_result: "20°C, soleggiato"]
Assistente: [testo: "Il meteo a Parigi è 20°C e soleggiato"]
```

Anche se ci sono più messaggi API, il ciclo di uso dello strumento è concettualmente parte di una risposta dell'assistente continua.

#### Scenari di errore comuni

Potresti incontrare questo errore:
```
Expected `thinking` or `redacted_thinking`, but found `tool_use`.
When `thinking` is enabled, a final `assistant` message must start
with a thinking block (preceding the lastmost set of `tool_use` and
`tool_result` blocks).
```

Questo si verifica in genere quando:
1. Avevi il ragionamento **disabilitato** durante una sequenza di uso dello strumento
2. Vuoi abilitare il ragionamento di nuovo
3. Il tuo ultimo messaggio dell'assistente contiene blocchi di uso dello strumento ma nessun blocco di ragionamento

#### Guida pratica

**✗ Non valido: Attivazione/disattivazione del ragionamento immediatamente dopo l'uso dello strumento**
```
Utente: "Qual è il meteo?"
Assistente: [tool_use] (ragionamento disabilitato)
Utente: [tool_result]
// Non puoi abilitare il ragionamento qui - ancora nello stesso turno dell'assistente
```

**✓ Valido: Completa il turno dell'assistente per primo**
```
Utente: "Qual è il meteo?"
Assistente: [tool_use] (ragionamento disabilitato)
Utente: [tool_result]
Assistente: [testo: "È soleggiato"] 
Utente: "E domani?" (ragionamento disabilitato)
Assistente: [ragionamento] + [testo: "..."] (ragionamento abilitato - nuovo turno)
```

**Migliore pratica**: Pianifica la tua strategia di ragionamento all'inizio di ogni turno piuttosto che cercare di attivare/disattivare a metà turno.

<Note>
L'attivazione/disattivazione delle modalità di ragionamento invalida anche la memorizzazione nella cache dei prompt per la cronologia dei messaggi. Per ulteriori dettagli, consulta la sezione [Ragionamento esteso con memorizzazione nella cache dei prompt](#extended-thinking-with-prompt-caching).
</Note>

<section title="Esempio: Passaggio di blocchi di ragionamento con risultati degli strumenti">

Ecco un esempio pratico che mostra come preservare i blocchi di ragionamento quando si forniscono risultati degli strumenti:

<CodeGroup>
```python Python
weather_tool = {
    "name": "get_weather",
    "description": "Ottieni il meteo attuale per una posizione",
    "input_schema": {
        "type": "object",
        "properties": {
            "location": {"type": "string"}
        },
        "required": ["location"]
    }
}

# Prima richiesta - Claude risponde con ragionamento e richiesta di strumento
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    tools=[weather_tool],
    messages=[
        {"role": "user", "content": "Qual è il meteo a Parigi?"}
    ]
)
```

```typescript TypeScript
const weatherTool = {
  name: "get_weather",
  description: "Ottieni il meteo attuale per una posizione",
  input_schema: {
    type: "object",
    properties: {
      location: { type: "string" }
    },
    required: ["location"]
  }
};

// Prima richiesta - Claude risponde con ragionamento e richiesta di strumento
const response = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 16000,
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  tools: [weatherTool],
  messages: [
    { role: "user", content: "Qual è il meteo a Parigi?" }
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
                .description("Ottieni il meteo attuale per una posizione")
                .inputSchema(schema)
                .build();

        BetaMessage response = client.beta().messages().create(
                MessageCreateParams.builder()
                        .model(Model.CLAUDE_OPUS_4_0)
                        .maxTokens(16000)
                        .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(10000).build())
                        .addTool(weatherTool)
                        .addUserMessage("Qual è il meteo a Parigi?")
                        .build()
        );

        System.out.println(response);
    }
}
```
</CodeGroup>

La risposta dell'API includerà blocchi di ragionamento, testo e tool_use:

```json
{
    "content": [
        {
            "type": "thinking",
            "thinking": "L'utente vuole conoscere il meteo attuale a Parigi. Ho accesso a una funzione `get_weather`...",
            "signature": "BDaL4VrbR2Oj0hO4XpJxT28J5TILnCrrUXoKiiNBZW9P+nr8XSj1zuZzAl4egiCCpQNvfyUuFFJP5CncdYZEQPPmLxYsNrcs...."
        },
        {
            "type": "text",
            "text": "Posso aiutarti a ottenere le informazioni meteorologiche attuali per Parigi. Lasciami controllare per te"
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

Ora continuiamo la conversazione e utilizziamo lo strumento

<CodeGroup>
```python Python
# Estrai il blocco di ragionamento e il blocco di uso dello strumento
thinking_block = next((block for block in response.content
                      if block.type == 'thinking'), None)
tool_use_block = next((block for block in response.content
                      if block.type == 'tool_use'), None)

# Chiama la tua API meteorologica effettiva, qui è dove andrebbe la tua chiamata API effettiva
# supponiamo che questo sia quello che otteniamo indietro
weather_data = {"temperature": 88}

# Seconda richiesta - Includi il blocco di ragionamento e il risultato dello strumento
# Nessun nuovo blocco di ragionamento verrà generato nella risposta
continuation = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    tools=[weather_tool],
    messages=[
        {"role": "user", "content": "Qual è il meteo a Parigi?"},
        # nota che il thinking_block viene passato insieme al tool_use_block
        # se questo non viene passato, viene generato un errore
        {"role": "assistant", "content": [thinking_block, tool_use_block]},
        {"role": "user", "content": [{
            "type": "tool_result",
            "tool_use_id": tool_use_block.id,
            "content": f"Temperatura attuale: {weather_data['temperature']}°F"
        }]}
    ]
)
```

```typescript TypeScript
// Estrai il blocco di ragionamento e il blocco di uso dello strumento
const thinkingBlock = response.content.find(block =>
  block.type === 'thinking');
const toolUseBlock = response.content.find(block =>
  block.type === 'tool_use');

// Chiama la tua API meteorologica effettiva, qui è dove andrebbe la tua chiamata API effettiva
// supponiamo che questo sia quello che otteniamo indietro
const weatherData = { temperature: 88 };

// Seconda richiesta - Includi il blocco di ragionamento e il risultato dello strumento
// Nessun nuovo blocco di ragionamento verrà generato nella risposta
const continuation = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 16000,
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  tools: [weatherTool],
  messages: [
    { role: "user", content: "Qual è il meteo a Parigi?" },
    // nota che il thinkingBlock viene passato insieme al toolUseBlock
    // se questo non viene passato, viene generato un errore
    { role: "assistant", content: [thinkingBlock, toolUseBlock] },
    { role: "user", content: [{
      type: "tool_result",
      tool_use_id: toolUseBlock.id,
      content: `Temperatura attuale: ${weatherData.temperature}°F`
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
                .description("Ottieni il meteo attuale per una posizione")
                .inputSchema(schema)
                .build();

        BetaMessage response = client.beta().messages().create(
                MessageCreateParams.builder()
                        .model(Model.CLAUDE_OPUS_4_0)
                        .maxTokens(16000)
                        .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(10000).build())
                        .addTool(weatherTool)
                        .addUserMessage("Qual è il meteo a Parigi?")
                        .build()
        );

        // Estrai il blocco di ragionamento e il blocco di uso dello strumento
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

            // Chiama la tua API meteorologica effettiva, qui è dove andrebbe la tua chiamata API effettiva
            // supponiamo che questo sia quello che otteniamo indietro
            Map<String, Object> weatherData = Map.of("temperature", 88);

            // Seconda richiesta - Includi il blocco di ragionamento e il risultato dello strumento
            // Nessun nuovo blocco di ragionamento verrà generato nella risposta
            BetaMessage continuation = client.beta().messages().create(
                    MessageCreateParams.builder()
                            .model(Model.CLAUDE_OPUS_4_0)
                            .maxTokens(16000)
                            .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(10000).build())
                            .addTool(weatherTool)
                            .addUserMessage("Qual è il meteo a Parigi?")
                            .addAssistantMessageOfBetaContentBlockParams(
                                    // nota che il thinkingBlock viene passato insieme al toolUseBlock
                                    // se questo non viene passato, viene generato un errore
                                    List.of(
                                            BetaContentBlockParam.ofThinking(thinkingBlock.toParam()),
                                            BetaContentBlockParam.ofToolUse(toolUseBlock.toParam())
                                    )
                            )
                            .addUserMessageOfBetaContentBlockParams(List.of(
                                    BetaContentBlockParam.ofToolResult(
                                            BetaToolResultBlockParam.builder()
                                                    .toolUseId(toolUseBlock.id())
                                                    .content(String.format("Temperatura attuale: %d°F", (Integer)weatherData.get("temperature")))
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

La risposta dell'API ora conterrà **solo** testo

```json
{
    "content": [
        {
            "type": "text",
            "text": "Attualmente a Parigi, la temperatura è 88°F (31°C)"
        }
    ]
}
```

</section>

### Preservazione dei blocchi di ragionamento

Durante l'uso dello strumento, devi passare i blocchi `thinking` all'API, e devi includere il blocco completo e non modificato all'API. Questo è critico per mantenere il flusso di ragionamento del modello e l'integrità della conversazione.

<Tip>
Anche se puoi omettere i blocchi `thinking` dai turni precedenti del ruolo `assistant`, suggeriamo di passare sempre tutti i blocchi di ragionamento all'API per qualsiasi conversazione multi-turno. L'API:
- Filtrerà automaticamente i blocchi di ragionamento forniti
- Utilizzerà i blocchi di ragionamento rilevanti necessari per preservare il ragionamento del modello
- Addebiterà solo i token di input per i blocchi mostrati a Claude
</Tip>

<Note>
Quando attivi/disattivi le modalità di ragionamento durante una conversazione, ricorda che l'intero turno dell'assistente (inclusi i cicli di uso dello strumento) deve operare in una singola modalità di ragionamento. Per ulteriori dettagli, consulta [Attivazione/disattivazione delle modalità di ragionamento nelle conversazioni](#toggling-thinking-modes-in-conversations).
</Note>

Quando Claude invoca strumenti, sta mettendo in pausa la costruzione di una risposta per attendere informazioni esterne. Quando i risultati dello strumento vengono restituiti, Claude continuerà a costruire quella risposta esistente. Questo rende necessaria la preservazione dei blocchi di ragionamento durante l'uso dello strumento, per un paio di motivi:

1. **Continuità del ragionamento**: I blocchi di ragionamento catturano il ragionamento passo dopo passo di Claude che ha portato alle richieste di strumenti. Quando pubblichi i risultati dello strumento, includere il ragionamento originale assicura che Claude possa continuare il suo ragionamento da dove l'ha lasciato.

2. **Manutenzione del contesto**: Mentre i risultati dello strumento appaiono come messaggi dell'utente nella struttura dell'API, fanno parte di un flusso di ragionamento continuo. Preservare i blocchi di ragionamento mantiene questo flusso concettuale attraverso più chiamate API. Per ulteriori informazioni sulla gestione del contesto, consulta la nostra [guida sulle finestre di contesto](/docs/it/build-with-claude/context-windows).

**Importante**: Quando fornisci blocchi `thinking`, l'intera sequenza di blocchi `thinking` consecutivi deve corrispondere agli output generati dal modello durante la richiesta originale; non puoi riordinare o modificare la sequenza di questi blocchi.

### Pensiero intercalato

Il pensiero esteso con uso di strumenti nei modelli Claude 4 supporta il pensiero intercalato, che consente a Claude di pensare tra le chiamate di strumenti e fare ragionamenti più sofisticati dopo aver ricevuto i risultati degli strumenti.

Con il pensiero intercalato, Claude può:
- Ragionare sui risultati di una chiamata di strumento prima di decidere cosa fare dopo
- Concatenare più chiamate di strumenti con passaggi di ragionamento intermedi
- Prendere decisioni più sfumate basate sui risultati intermedi

Per abilitare il pensiero intercalato, aggiungi [l'intestazione beta](/docs/it/api/beta-headers) `interleaved-thinking-2025-05-14` alla tua richiesta API.

Ecco alcune considerazioni importanti per il pensiero intercalato:
- Con il pensiero intercalato, il `budget_tokens` può superare il parametro `max_tokens`, poiché rappresenta il budget totale su tutti i blocchi di pensiero all'interno di un turno dell'assistente.
- Il pensiero intercalato è supportato solo per [strumenti utilizzati tramite l'API Messages](/docs/it/agents-and-tools/tool-use/overview).
- Il pensiero intercalato è supportato solo per i modelli Claude 4, con l'intestazione beta `interleaved-thinking-2025-05-14`.
- Le chiamate dirette all'API Claude ti consentono di passare `interleaved-thinking-2025-05-14` nelle richieste a qualsiasi modello, senza alcun effetto.
- Su piattaforme di terze parti (ad es., [Amazon Bedrock](/docs/it/build-with-claude/claude-on-amazon-bedrock) e [Vertex AI](/docs/it/build-with-claude/claude-on-vertex-ai)), se passi `interleaved-thinking-2025-05-14` a qualsiasi modello diverso da Claude Opus 4.5, Claude Opus 4.1, Opus 4 o Sonnet 4, la tua richiesta avrà esito negativo.

<section title="Uso di strumenti senza pensiero intercalato">

Senza il pensiero intercalato, Claude pensa una volta all'inizio del turno dell'assistente. Le risposte successive dopo i risultati degli strumenti continuano senza nuovi blocchi di pensiero.

```
User: "What's the total revenue if we sold 150 units at $50 each,
       and how does this compare to our average monthly revenue?"

Turn 1: [thinking] "I need to calculate 150 * $50, then check the database..."
        [tool_use: calculator] { "expression": "150 * 50" }
  ↓ tool result: "7500"

Turn 2: [tool_use: database_query] { "query": "SELECT AVG(revenue)..." }
        ↑ no thinking block
  ↓ tool result: "5200"

Turn 3: [text] "The total revenue is $7,500, which is 44% above your
        average monthly revenue of $5,200."
        ↑ no thinking block
```

</section>

<section title="Uso di strumenti con pensiero intercalato">

Con il pensiero intercalato abilitato, Claude può pensare dopo aver ricevuto ogni risultato dello strumento, consentendogli di ragionare sui risultati intermedi prima di continuare.

```
User: "What's the total revenue if we sold 150 units at $50 each,
       and how does this compare to our average monthly revenue?"

Turn 1: [thinking] "I need to calculate 150 * $50 first..."
        [tool_use: calculator] { "expression": "150 * 50" }
  ↓ tool result: "7500"

Turn 2: [thinking] "Got $7,500. Now I should query the database to compare..."
        [tool_use: database_query] { "query": "SELECT AVG(revenue)..." }
        ↑ thinking after receiving calculator result
  ↓ tool result: "5200"

Turn 3: [thinking] "$7,500 vs $5,200 average - that's a 44% increase..."
        [text] "The total revenue is $7,500, which is 44% above your
        average monthly revenue of $5,200."
        ↑ thinking before final answer
```

</section>

## Pensiero esteso con caching dei prompt

[Il caching dei prompt](/docs/it/build-with-claude/prompt-caching) con il pensiero ha diverse considerazioni importanti:

<Tip>
I compiti di pensiero esteso spesso richiedono più di 5 minuti per essere completati. Considera l'utilizzo della [durata della cache di 1 ora](/docs/it/build-with-claude/prompt-caching#1-hour-cache-duration) per mantenere i cache hit su sessioni di pensiero più lunghe e flussi di lavoro multi-step.
</Tip>

**Rimozione del contesto del blocco di pensiero**
- I blocchi di pensiero dai turni precedenti vengono rimossi dal contesto, il che può influire sui punti di interruzione della cache
- Quando si continuano conversazioni con uso di strumenti, i blocchi di pensiero vengono memorizzati nella cache e contano come token di input quando letti dalla cache
- Questo crea un compromesso: mentre i blocchi di pensiero non consumano spazio nella finestra di contesto visivamente, contano comunque verso l'utilizzo dei token di input quando memorizzati nella cache
- Se il pensiero viene disabilitato, le richieste avranno esito negativo se passi contenuto di pensiero nel turno di uso dello strumento corrente. In altri contesti, il contenuto di pensiero passato all'API viene semplicemente ignorato

**Modelli di invalidazione della cache**
- Le modifiche ai parametri di pensiero (abilitato/disabilitato o allocazione del budget) invalidano i punti di interruzione della cache dei messaggi
- [Il pensiero intercalato](#interleaved-thinking) amplifica l'invalidazione della cache, poiché i blocchi di pensiero possono verificarsi tra più [chiamate di strumenti](#extended-thinking-with-tool-use)
- I prompt di sistema e gli strumenti rimangono memorizzati nella cache nonostante le modifiche ai parametri di pensiero o la rimozione dei blocchi

<Note>
Sebbene i blocchi di pensiero vengano rimossi per il caching e i calcoli del contesto, devono essere preservati quando si continuano conversazioni con [uso di strumenti](#extended-thinking-with-tool-use), specialmente con [pensiero intercalato](#interleaved-thinking).
</Note>

### Comprensione del comportamento del caching dei blocchi di pensiero

Quando si utilizza il pensiero esteso con uso di strumenti, i blocchi di pensiero mostrano un comportamento di caching specifico che influisce sul conteggio dei token:

**Come funziona:**

1. Il caching si verifica solo quando effettui una richiesta successiva che include risultati degli strumenti
2. Quando viene effettuata la richiesta successiva, la cronologia della conversazione precedente (inclusi i blocchi di pensiero) può essere memorizzata nella cache
3. Questi blocchi di pensiero memorizzati nella cache contano come token di input nelle tue metriche di utilizzo quando letti dalla cache
4. Quando è incluso un blocco utente non relativo al risultato dello strumento, tutti i blocchi di pensiero precedenti vengono ignorati e rimossi dal contesto

**Flusso di esempio dettagliato:**

**Richiesta 1:**
```
User: "What's the weather in Paris?"
```
**Risposta 1:**
```
[thinking_block_1] + [tool_use block 1]
```

**Richiesta 2:**
```
User: ["What's the weather in Paris?"], 
Assistant: [thinking_block_1] + [tool_use block 1], 
User: [tool_result_1, cache=True]
```
**Risposta 2:**
```
[thinking_block_2] + [text block 2]
```
La richiesta 2 scrive una cache del contenuto della richiesta (non della risposta). La cache include il messaggio utente originale, il primo blocco di pensiero, il blocco di uso dello strumento e il risultato dello strumento.

**Richiesta 3:**
```
User: ["What's the weather in Paris?"],
Assistant: [thinking_block_1] + [tool_use block 1],
User: [tool_result_1, cache=True],
Assistant: [thinking_block_2] + [text block 2],
User: [Text response, cache=True]
```
Per Claude Opus 4.5 e versioni successive, tutti i blocchi di pensiero precedenti vengono mantenuti per impostazione predefinita. Per i modelli più vecchi, poiché è stato incluso un blocco utente non relativo al risultato dello strumento, tutti i blocchi di pensiero precedenti vengono ignorati. Questa richiesta verrà elaborata come:
```
User: ["What's the weather in Paris?"],
Assistant: [tool_use block 1],
User: [tool_result_1, cache=True],
Assistant: [text block 2],
User: [Text response, cache=True]
```

**Punti chiave:**
- Questo comportamento di caching accade automaticamente, anche senza marcatori `cache_control` espliciti
- Questo comportamento è coerente sia quando si utilizza il pensiero regolare che il pensiero intercalato

<section title="Caching del prompt di sistema (preservato quando il pensiero cambia)">

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
<section title="Caching dei messaggi (invalidato quando il pensiero cambia)">

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

Ecco l'output dello script (potresti vedere numeri leggermente diversi)

```
First request - establishing cache
First response usage: { cache_creation_input_tokens: 1370, cache_read_input_tokens: 0, input_tokens: 17, output_tokens: 700 }

Second request - same thinking parameters (cache hit expected)

Second response usage: { cache_creation_input_tokens: 0, cache_read_input_tokens: 1370, input_tokens: 303, output_tokens: 874 }

Third request - different thinking budget (cache miss expected)
Third response usage: { cache_creation_input_tokens: 1370, cache_read_input_tokens: 0, input_tokens: 747, output_tokens: 619 }
```

Questo esempio dimostra che quando il caching è configurato nell'array dei messaggi, modificare i parametri di pensiero (budget_tokens aumentato da 4000 a 8000) **invalida la cache**. La terza richiesta non mostra alcun cache hit con `cache_creation_input_tokens=1370` e `cache_read_input_tokens=0`, provando che il caching basato su messaggi viene invalidato quando i parametri di pensiero cambiano.

</section>

## Max tokens e dimensione della finestra di contesto con pensiero esteso

Nei modelli Claude più vecchi (precedenti a Claude Sonnet 3.7), se la somma dei token del prompt e di `max_tokens` superava la finestra di contesto del modello, il sistema regolava automaticamente `max_tokens` per adattarsi al limite di contesto. Ciò significava che potevi impostare un valore `max_tokens` grande e il sistema lo avrebbe silenziosamente ridotto secondo le necessità.

Con i modelli Claude 3.7 e 4, `max_tokens` (che include il tuo budget di pensiero quando il pensiero è abilitato) viene applicato come limite rigoroso. Il sistema ora restituirà un errore di convalida se i token del prompt + `max_tokens` superano la dimensione della finestra di contesto.

<Note>
Puoi leggere la nostra [guida sulle finestre di contesto](/docs/it/build-with-claude/context-windows) per un approfondimento più completo.
</Note>

### La finestra di contesto con pensiero esteso

Quando si calcola l'utilizzo della finestra di contesto con il pensiero abilitato, ci sono alcune considerazioni di cui essere consapevoli:

- I blocchi di pensiero dai turni precedenti vengono rimossi e non contano verso la tua finestra di contesto
- Il pensiero del turno corrente conta verso il tuo limite `max_tokens` per quel turno

Il diagramma sottostante dimostra la gestione specializzata dei token quando il pensiero esteso è abilitato:

![Diagramma della finestra di contesto con pensiero esteso](/docs/images/context-window-thinking.svg)

La finestra di contesto effettiva viene calcolata come:

```
context window =
  (current input tokens - previous thinking tokens) +
  (thinking tokens + encrypted thinking tokens + text output tokens)
```

Consigliamo di utilizzare l'[API di conteggio dei token](/docs/it/build-with-claude/token-counting) per ottenere conteggi accurati dei token per il tuo caso d'uso specifico, specialmente quando si lavora con conversazioni multi-turno che includono il pensiero.

### La finestra di contesto con pensiero esteso e uso di strumenti

Quando si utilizza il pensiero esteso con uso di strumenti, i blocchi di pensiero devono essere esplicitamente preservati e restituiti con i risultati degli strumenti.

Il calcolo della finestra di contesto effettiva per il pensiero esteso con uso di strumenti diventa:

```
context window =
  (current input tokens + previous thinking tokens + tool use tokens) +
  (thinking tokens + encrypted thinking tokens + text output tokens)
```

Il diagramma sottostante illustra la gestione dei token per il pensiero esteso con uso di strumenti:

![Diagramma della finestra di contesto con pensiero esteso e uso di strumenti](/docs/images/context-window-thinking-tools.svg)

### Gestione dei token con pensiero esteso

Data la finestra di contesto e il comportamento di `max_tokens` con il pensiero esteso nei modelli Claude 3.7 e 4, potrebbe essere necessario:

- Monitorare e gestire più attivamente l'utilizzo dei token
- Regolare i valori di `max_tokens` al variare della lunghezza del prompt
- Potenzialmente utilizzare gli [endpoint di conteggio dei token](/docs/it/build-with-claude/token-counting) più frequentemente
- Essere consapevoli che i blocchi di pensiero precedenti non si accumulano nella tua finestra di contesto

Questo cambiamento è stato apportato per fornire un comportamento più prevedibile e trasparente, specialmente poiché i limiti massimi di token sono aumentati significativamente.

## Crittografia del pensiero

Il contenuto completo del pensiero è crittografato e restituito nel campo `signature`. Questo campo viene utilizzato per verificare che i blocchi di pensiero siano stati generati da Claude quando passati di nuovo all'API.

<Note>
È strettamente necessario inviare di nuovo i blocchi di pensiero solo quando si utilizzano [strumenti con pensiero esteso](#extended-thinking-with-tool-use). Altrimenti puoi omettere i blocchi di pensiero dai turni precedenti, o lasciare che l'API li rimuova per te se li passi di nuovo. 

Se invii di nuovo i blocchi di pensiero, consigliamo di passare tutto di nuovo come lo hai ricevuto per coerenza e per evitare potenziali problemi.
</Note>

Ecco alcune considerazioni importanti sulla crittografia del pensiero:
- Quando [trasmetti risposte in streaming](#streaming-thinking), la firma viene aggiunta tramite un `signature_delta` all'interno di un evento `content_block_delta` poco prima dell'evento `content_block_stop`.
- I valori di `signature` sono significativamente più lunghi nei modelli Claude 4 rispetto ai modelli precedenti.
- Il campo `signature` è un campo opaco e non deve essere interpretato o analizzato - esiste esclusivamente per scopi di verifica.
- I valori di `signature` sono compatibili tra le piattaforme (API Claude, [Amazon Bedrock](/docs/it/build-with-claude/claude-on-amazon-bedrock) e [Vertex AI](/docs/it/build-with-claude/claude-on-vertex-ai)). I valori generati su una piattaforma saranno compatibili con un'altra.

### Redazione del pensiero

Occasionalmente il ragionamento interno di Claude verrà contrassegnato dai nostri sistemi di sicurezza. Quando ciò accade, crittografiamo parte o tutto il blocco `thinking` e lo restituiamo come blocco `redacted_thinking`. I blocchi `redacted_thinking` vengono decriptati quando passati di nuovo all'API, permettendo a Claude di continuare la sua risposta senza perdere il contesto.

Quando si costruiscono applicazioni rivolte ai clienti che utilizzano il pensiero esteso:

- Sii consapevole che i blocchi di pensiero redatto contengono contenuti crittografati che non sono leggibili dall'uomo
- Considera di fornire una semplice spiegazione come: "Parte del ragionamento interno di Claude è stato automaticamente crittografato per motivi di sicurezza. Questo non influisce sulla qualità delle risposte."
- Se mostri i blocchi di pensiero agli utenti, puoi filtrare i blocchi redatti preservando i blocchi di pensiero normali
- Sii trasparente sul fatto che l'utilizzo delle funzioni di pensiero esteso può occasionalmente comportare la crittografia di parte del ragionamento
- Implementa una gestione degli errori appropriata per gestire con eleganza il pensiero redatto senza interrompere l'interfaccia utente

Ecco un esempio che mostra sia i blocchi di pensiero normali che quelli redatti:

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
Vedere blocchi di pensiero redatto nell'output è un comportamento previsto. Il modello può comunque utilizzare questo ragionamento redatto per informare le sue risposte mantenendo i guardrail di sicurezza.

Se hai bisogno di testare la gestione del pensiero redatto nella tua applicazione, puoi utilizzare questa stringa di test speciale come prompt: `ANTHROPIC_MAGIC_STRING_TRIGGER_REDACTED_THINKING_46C9A13E193C177646C7398A98432ECCCE4C1253D5E2D82641AC0E52CC2876CB`
</Note>

Quando si passano i blocchi `thinking` e `redacted_thinking` di nuovo all'API in una conversazione multi-turno, è necessario includere il blocco completo e non modificato di nuovo all'API per l'ultimo turno dell'assistente. Questo è critico per mantenere il flusso di ragionamento del modello. Suggeriamo di passare sempre tutti i blocchi di pensiero all'API. Per ulteriori dettagli, consulta la sezione [Preservazione dei blocchi di pensiero](#preserving-thinking-blocks) sopra.

<section title="Esempio: Lavorare con blocchi di pensiero redatto">

Questo esempio dimostra come gestire i blocchi `redacted_thinking` che possono apparire nelle risposte quando il ragionamento interno di Claude contiene contenuti contrassegnati dai sistemi di sicurezza:

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
  Prova nella Console
</TryInConsoleButton>

</section>

## Differenze nel pensiero tra le versioni del modello

L'API Messages gestisce il pensiero diversamente tra i modelli Claude Sonnet 3.7 e Claude 4, principalmente nel comportamento di redazione e riassunto.

Consulta la tabella seguente per un confronto condensato:

| Funzione | Claude Sonnet 3.7 | Modelli Claude 4 (pre-Opus 4.5) | Claude Opus 4.5 e successivi |
|---------|------------------|-------------------------------|--------------------------|
| **Output del pensiero** | Restituisce l'output completo del pensiero | Restituisce il pensiero riassunto | Restituisce il pensiero riassunto |
| **Pensiero intercalato** | Non supportato | Supportato con intestazione beta `interleaved-thinking-2025-05-14` | Supportato con intestazione beta `interleaved-thinking-2025-05-14` |
| **Preservazione del blocco di pensiero** | Non preservato tra i turni | Non preservato tra i turni | **Preservato per impostazione predefinita** (abilita l'ottimizzazione della cache, risparmio di token) |

### Preservazione del blocco di pensiero in Claude Opus 4.5

Claude Opus 4.5 introduce un nuovo comportamento predefinito: **i blocchi di pensiero dai turni dell'assistente precedenti vengono preservati nel contesto del modello per impostazione predefinita**. Questo differisce dai modelli precedenti, che rimuovono i blocchi di pensiero dai turni precedenti.

**Vantaggi della preservazione del blocco di pensiero:**

- **Ottimizzazione della cache**: Quando si utilizza l'uso di strumenti, i blocchi di pensiero preservati abilitano i hit della cache poiché vengono passati di nuovo con i risultati degli strumenti e memorizzati nella cache in modo incrementale nel turno dell'assistente, risultando in risparmi di token nei flussi di lavoro multi-step
- **Nessun impatto sull'intelligenza**: La preservazione dei blocchi di pensiero non ha effetti negativi sulle prestazioni del modello

**Considerazioni importanti:**

- **Utilizzo del contesto**: Le conversazioni lunghe consumeranno più spazio di contesto poiché i blocchi di pensiero vengono mantenuti nel contesto
- **Comportamento automatico**: Questo è il comportamento predefinito per Claude Opus 4.5—non sono richiesti cambiamenti di codice o intestazioni beta
- **Compatibilità all'indietro**: Per sfruttare questa funzione, continua a passare i blocchi di pensiero completi e non modificati all'API come faresti per l'uso di strumenti

<Note>
Per i modelli precedenti (Claude Sonnet 4.5, Opus 4.1, ecc.), i blocchi di pensiero dai turni precedenti continuano a essere rimossi dal contesto. Il comportamento esistente descritto nella sezione [Pensiero esteso con caching del prompt](#extended-thinking-with-prompt-caching) si applica a quei modelli.
</Note>

## Prezzi

Per informazioni complete sui prezzi inclusi i tassi base, le scritture della cache, i hit della cache e i token di output, consulta la [pagina dei prezzi](/docs/it/about-claude/pricing).

Il processo di pensiero comporta addebiti per:
- Token utilizzati durante il pensiero (token di output)
- Blocchi di pensiero dall'ultimo turno dell'assistente inclusi nelle richieste successive (token di input)
- Token di output di testo standard

<Note>
Quando il pensiero esteso è abilitato, un prompt di sistema specializzato viene automaticamente incluso per supportare questa funzione.
</Note>

Quando si utilizza il pensiero riassunto:
- **Token di input**: Token nella tua richiesta originale (esclude i token di pensiero dai turni precedenti)
- **Token di output (fatturati)**: I token di pensiero originali che Claude ha generato internamente
- **Token di output (visibili)**: I token di pensiero riassunti che vedi nella risposta
- **Nessun addebito**: Token utilizzati per generare il riassunto

<Warning>
Il conteggio dei token di output fatturati **non** corrisponderà al conteggio dei token visibili nella risposta. Sei fatturato per l'intero processo di pensiero, non per il riassunto che vedi.
</Warning>

## Best practice e considerazioni per il pensiero esteso

### Lavorare con i budget di pensiero

- **Ottimizzazione del budget:** Il budget minimo è 1.024 token. Suggeriamo di iniziare con il minimo e aumentare il budget di pensiero in modo incrementale per trovare l'intervallo ottimale per il tuo caso d'uso. Conteggi di token più elevati abilitano un ragionamento più completo ma con rendimenti decrescenti a seconda dell'attività. Aumentare il budget può migliorare la qualità della risposta al costo di una latenza aumentata. Per attività critiche, testa diverse impostazioni per trovare il bilancio ottimale. Nota che il budget di pensiero è un obiettivo piuttosto che un limite rigoroso—l'utilizzo effettivo di token può variare in base all'attività.
- **Punti di partenza:** Inizia con budget di pensiero più grandi (16k+ token) per attività complesse e regola in base alle tue esigenze.
- **Budget grandi:** Per budget di pensiero superiori a 32k, consigliamo di utilizzare l'[elaborazione batch](/docs/it/build-with-claude/batch-processing) per evitare problemi di rete. Le richieste che spingono il modello a pensare oltre 32k token causano richieste a lunga esecuzione che potrebbero scontrarsi con timeout di sistema e limiti di connessione aperta.
- **Tracciamento dell'utilizzo dei token:** Monitora l'utilizzo dei token di pensiero per ottimizzare i costi e le prestazioni.

### Considerazioni sulle prestazioni

- **Tempi di risposta:** Sii preparato per potenziali tempi di risposta più lunghi dovuti all'elaborazione aggiuntiva richiesta per il processo di ragionamento. Tieni conto del fatto che la generazione di blocchi di pensiero può aumentare il tempo di risposta complessivo.
- **Requisiti di streaming:** Lo streaming è richiesto quando `max_tokens` è maggiore di 21.333. Durante lo streaming, sii preparato a gestire sia i blocchi di contenuto di pensiero che di testo mentre arrivano.

### Compatibilità delle funzioni

- Il pensiero non è compatibile con modifiche a `temperature` o `top_k` così come con l'[uso forzato di strumenti](/docs/it/agents-and-tools/tool-use/implement-tool-use#forcing-tool-use).
- Quando il pensiero è abilitato, puoi impostare `top_p` su valori tra 1 e 0,95.
- Non puoi pre-compilare le risposte quando il pensiero è abilitato.
- I cambiamenti al budget di pensiero invalidano i prefissi del prompt memorizzati nella cache che includono messaggi. Tuttavia, i prompt di sistema memorizzati nella cache e le definizioni degli strumenti continueranno a funzionare quando i parametri di pensiero cambiano.

### Linee guida di utilizzo

- **Selezione dell'attività:** Utilizza il pensiero esteso per attività particolarmente complesse che beneficiano del ragionamento passo dopo passo come matematica, codifica e analisi.
- **Gestione del contesto:** Non è necessario rimuovere i blocchi di pensiero precedenti da solo. L'API Claude ignora automaticamente i blocchi di pensiero dai turni precedenti e non sono inclusi nel calcolo dell'utilizzo del contesto.
- **Ingegneria del prompt:** Consulta i nostri [suggerimenti per il prompt di pensiero esteso](/docs/it/build-with-claude/prompt-engineering/extended-thinking-tips) se desideri massimizzare le capacità di pensiero di Claude.

## Passaggi successivi

<CardGroup>
  <Card title="Prova il cookbook di pensiero esteso" icon="book" href="https://github.com/anthropics/anthropic-cookbook/tree/main/extended_thinking">
    Esplora esempi pratici di pensiero nel nostro cookbook.
  </Card>
  <Card title="Suggerimenti per il prompt di pensiero esteso" icon="code" href="/docs/it/build-with-claude/prompt-engineering/extended-thinking-tips">
    Scopri le best practice di ingegneria del prompt per il pensiero esteso.
  </Card>
</CardGroup>