# Prompt caching

Prompt caching è una potente funzionalità che ottimizza l'utilizzo dell'API consentendo di riprendere da prefissi specifici nei tuoi prompt. Questo approccio riduce significativamente i tempi di elaborazione e i costi per attività ripetitive o prompt con elementi coerenti.

---

Prompt caching è una potente funzionalità che ottimizza l'utilizzo dell'API consentendo di riprendere da prefissi specifici nei tuoi prompt. Questo approccio riduce significativamente i tempi di elaborazione e i costi per attività ripetitive o prompt con elementi coerenti.

Ecco un esempio di come implementare prompt caching con l'API Messages utilizzando un blocco `cache_control`:

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
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
      {
        "role": "user",
        "content": "Analyze the major themes in Pride and Prejudice."
      }
    ]
  }'

# Call the model again with the same inputs up to the cache checkpoint
curl https://api.anthropic.com/v1/messages # rest of input
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    system=[
      {
        "type": "text",
        "text": "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n",
      },
      {
        "type": "text",
        "text": "<the entire contents of 'Pride and Prejudice'>",
        "cache_control": {"type": "ephemeral"}
      }
    ],
    messages=[{"role": "user", "content": "Analyze the major themes in 'Pride and Prejudice'."}],
)
print(response.usage.model_dump_json())

# Call the model again with the same inputs up to the cache checkpoint
response = client.messages.create(.....)
print(response.usage.model_dump_json())
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  system: [
    {
      type: "text",
      text: "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n",
    },
    {
      type: "text",
      text: "<the entire contents of 'Pride and Prejudice'>",
      cache_control: { type: "ephemeral" }
    }
  ],
  messages: [
    {
      role: "user",
      content: "Analyze the major themes in 'Pride and Prejudice'."
    }
  ]
});
console.log(response.usage);

// Call the model again with the same inputs up to the cache checkpoint
const new_response = await client.messages.create(...)
console.log(new_response.usage);
```

```java Java
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;

public class PromptCachingExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                .systemOfTextBlockParams(List.of(
                        TextBlockParam.builder()
                                .text("You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n")
                                .build(),
                        TextBlockParam.builder()
                                .text("<the entire contents of 'Pride and Prejudice'>")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build()
                ))
                .addUserMessage("Analyze the major themes in 'Pride and Prejudice'.")
                .build();

        Message message = client.messages().create(params);
        System.out.println(message.usage());
    }
}
```
</CodeGroup>

```json JSON
{"cache_creation_input_tokens":188086,"cache_read_input_tokens":0,"input_tokens":21,"output_tokens":393}
{"cache_creation_input_tokens":0,"cache_read_input_tokens":188086,"input_tokens":21,"output_tokens":393}
```

In questo esempio, l'intero testo di "Pride and Prejudice" viene memorizzato nella cache utilizzando il parametro `cache_control`. Questo consente il riutilizzo di questo testo di grandi dimensioni su più chiamate API senza rielaborarlo ogni volta. Modificando solo il messaggio dell'utente puoi fare varie domande sul libro mentre utilizzi il contenuto memorizzato nella cache, portando a risposte più veloci e a una migliore efficienza.

---

## Come funziona prompt caching

Quando invii una richiesta con prompt caching abilitato:

1. Il sistema verifica se un prefisso del prompt, fino a un punto di interruzione della cache specificato, è già memorizzato nella cache da una query recente.
2. Se trovato, utilizza la versione memorizzata nella cache, riducendo i tempi di elaborazione e i costi.
3. Altrimenti, elabora il prompt completo e memorizza nella cache il prefisso una volta che la risposta inizia.

Questo è particolarmente utile per:
- Prompt con molti esempi
- Grandi quantità di contesto o informazioni di background
- Attività ripetitive con istruzioni coerenti
- Lunghe conversazioni multi-turno

Per impostazione predefinita, la cache ha una durata di 5 minuti. La cache viene aggiornata senza costi aggiuntivi ogni volta che il contenuto memorizzato nella cache viene utilizzato.

<Note>
Se ritieni che 5 minuti sia troppo breve, Anthropic offre anche una durata della cache di 1 ora [a costo aggiuntivo](#pricing).

Per ulteriori informazioni, vedi [Durata della cache di 1 ora](#1-hour-cache-duration).
</Note>

<Tip>
  **Prompt caching memorizza nella cache il prefisso completo**

Prompt caching fa riferimento all'intero prompt - `tools`, `system` e `messages` (in quell'ordine) fino a e includendo il blocco designato con `cache_control`.

</Tip>

---
## Prezzi

Prompt caching introduce una nuova struttura di prezzi. La tabella seguente mostra il prezzo per milione di token per ogni modello supportato:

| Model             | Base Input Tokens | 5m Cache Writes | 1h Cache Writes | Cache Hits & Refreshes | Output Tokens |
|-------------------|-------------------|-----------------|-----------------|----------------------|---------------|
| Claude Opus 4.5   | $5 / MTok         | $6.25 / MTok    | $10 / MTok      | $0.50 / MTok | $25 / MTok    |
| Claude Opus 4.1   | $15 / MTok        | $18.75 / MTok   | $30 / MTok      | $1.50 / MTok | $75 / MTok    |
| Claude Opus 4     | $15 / MTok        | $18.75 / MTok   | $30 / MTok      | $1.50 / MTok | $75 / MTok    |
| Claude Sonnet 4.5   | $3 / MTok         | $3.75 / MTok    | $6 / MTok       | $0.30 / MTok | $15 / MTok    |
| Claude Sonnet 4   | $3 / MTok         | $3.75 / MTok    | $6 / MTok       | $0.30 / MTok | $15 / MTok    |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations)) | $3 / MTok         | $3.75 / MTok    | $6 / MTok       | $0.30 / MTok | $15 / MTok    |
| Claude Haiku 4.5  | $1 / MTok         | $1.25 / MTok    | $2 / MTok       | $0.10 / MTok | $5 / MTok     |
| Claude Haiku 3.5  | $0.80 / MTok      | $1 / MTok       | $1.6 / MTok     | $0.08 / MTok | $4 / MTok     |
| Claude Opus 3 ([deprecated](/docs/en/about-claude/model-deprecations))    | $15 / MTok        | $18.75 / MTok   | $30 / MTok      | $1.50 / MTok | $75 / MTok    |
| Claude Haiku 3    | $0.25 / MTok      | $0.30 / MTok    | $0.50 / MTok    | $0.03 / MTok | $1.25 / MTok  |

<Note>
La tabella sopra riflette i seguenti moltiplicatori di prezzo per prompt caching:
- I token di scrittura della cache di 5 minuti sono 1,25 volte il prezzo dei token di input di base
- I token di scrittura della cache di 1 ora sono 2 volte il prezzo dei token di input di base
- I token di lettura della cache sono 0,1 volte il prezzo dei token di input di base
</Note>

---
## Come implementare prompt caching

### Modelli supportati

Prompt caching è attualmente supportato su:
- Claude Opus 4.5
- Claude Opus 4.1
- Claude Opus 4
- Claude Sonnet 4.5
- Claude Sonnet 4
- Claude Sonnet 3.7 ([deprecato](/docs/it/about-claude/model-deprecations))
- Claude Haiku 4.5
- Claude Haiku 3.5
- Claude Haiku 3
- Claude Opus 3 ([deprecato](/docs/it/about-claude/model-deprecations))

### Strutturare il tuo prompt

Posiziona il contenuto statico (definizioni di strumenti, istruzioni di sistema, contesto, esempi) all'inizio del tuo prompt. Contrassegna la fine del contenuto riutilizzabile per la memorizzazione nella cache utilizzando il parametro `cache_control`.

I prefissi della cache vengono creati nel seguente ordine: `tools`, `system`, quindi `messages`. Questo ordine forma una gerarchia in cui ogni livello si basa su quelli precedenti.

#### Come funziona il controllo automatico del prefisso

Puoi utilizzare un solo punto di interruzione della cache alla fine del tuo contenuto statico e il sistema troverà automaticamente la sequenza più lunga di blocchi memorizzati nella cache corrispondenti. Comprendere come funziona aiuta a ottimizzare la tua strategia di caching.

**Tre principi fondamentali:**

1. **Le chiavi della cache sono cumulative**: Quando memorizzi esplicitamente nella cache un blocco con `cache_control`, la chiave hash della cache viene generata eseguendo l'hash di tutti i blocchi precedenti nella conversazione in sequenza. Ciò significa che la cache per ogni blocco dipende da tutto il contenuto che lo ha preceduto.

2. **Controllo sequenziale all'indietro**: Il sistema verifica i hit della cache lavorando all'indietro dal tuo punto di interruzione esplicito, controllando ogni blocco precedente in ordine inverso. Questo assicura di ottenere il hit della cache più lungo possibile.

3. **Finestra di lookback di 20 blocchi**: Il sistema controlla solo fino a 20 blocchi prima di ogni punto di interruzione `cache_control` esplicito. Dopo aver controllato 20 blocchi senza una corrispondenza, smette di controllare e passa al prossimo punto di interruzione esplicito (se presente).

**Esempio: Comprendere la finestra di lookback**

Considera una conversazione con 30 blocchi di contenuto in cui imposti `cache_control` solo sul blocco 30:

- **Se invii il blocco 31 senza modifiche ai blocchi precedenti**: Il sistema controlla il blocco 30 (corrispondenza!). Ottieni un hit della cache al blocco 30 e solo il blocco 31 necessita di elaborazione.

- **Se modifichi il blocco 25 e invii il blocco 31**: Il sistema controlla all'indietro dal blocco 30 → 29 → 28... → 25 (nessuna corrispondenza) → 24 (corrispondenza!). Poiché il blocco 24 non è cambiato, ottieni un hit della cache al blocco 24 e solo i blocchi 25-30 necessitano di rielaborazione.

- **Se modifichi il blocco 5 e invii il blocco 31**: Il sistema controlla all'indietro dal blocco 30 → 29 → 28... → 11 (controllo #20). Dopo 20 controlli senza trovare una corrispondenza, smette di cercare. Poiché il blocco 5 è oltre la finestra di 20 blocchi, non si verifica alcun hit della cache e tutti i blocchi necessitano di rielaborazione. Tuttavia, se avessi impostato un punto di interruzione `cache_control` esplicito sul blocco 5, il sistema continuerebbe a controllare da quel punto di interruzione: blocco 5 (nessuna corrispondenza) → blocco 4 (corrispondenza!). Questo consente un hit della cache al blocco 4, dimostrando perché dovresti posizionare i punti di interruzione prima del contenuto modificabile.

**Conclusione chiave**: Imposta sempre un punto di interruzione della cache esplicito alla fine della tua conversazione per massimizzare le tue possibilità di hit della cache. Inoltre, imposta i punti di interruzione appena prima dei blocchi di contenuto che potrebbero essere modificabili per assicurare che quelle sezioni possano essere memorizzate nella cache in modo indipendente.

#### Quando utilizzare più punti di interruzione

Puoi definire fino a 4 punti di interruzione della cache se desideri:
- Memorizzare nella cache diverse sezioni che cambiano a frequenze diverse (ad esempio, gli strumenti cambiano raramente, ma il contesto si aggiorna quotidianamente)
- Avere più controllo su esattamente cosa viene memorizzato nella cache
- Assicurare la memorizzazione nella cache per il contenuto più di 20 blocchi prima del tuo punto di interruzione finale
- Posizionare i punti di interruzione prima del contenuto modificabile per garantire hit della cache anche quando si verificano modifiche oltre la finestra di 20 blocchi

<Note>
**Limitazione importante**: Se il tuo prompt ha più di 20 blocchi di contenuto prima del tuo punto di interruzione della cache e modifichi il contenuto prima di quei 20 blocchi, non otterrai un hit della cache a meno che non aggiunga punti di interruzione espliciti aggiuntivi più vicini a quel contenuto.
</Note>

### Limitazioni della cache
La lunghezza minima del prompt memorizzabile nella cache è:
- 4096 token per Claude Opus 4.5
- 1024 token per Claude Opus 4.1, Claude Opus 4, Claude Sonnet 4.5, Claude Sonnet 4, Claude Sonnet 3.7 ([deprecato](/docs/it/about-claude/model-deprecations)) e Claude Opus 3 ([deprecato](/docs/it/about-claude/model-deprecations))
- 4096 token per Claude Haiku 4.5
- 2048 token per Claude Haiku 3.5 e Claude Haiku 3

I prompt più brevi non possono essere memorizzati nella cache, anche se contrassegnati con `cache_control`. Qualsiasi richiesta di memorizzare nella cache meno di questo numero di token verrà elaborata senza caching. Per vedere se un prompt è stato memorizzato nella cache, vedi i campi di utilizzo della risposta [fields](/docs/it/build-with-claude/prompt-caching#tracking-cache-performance).

Per le richieste simultanee, nota che una voce della cache diventa disponibile solo dopo l'inizio della prima risposta. Se hai bisogno di hit della cache per richieste parallele, attendi la prima risposta prima di inviare le richieste successive.

Attualmente, "ephemeral" è l'unico tipo di cache supportato, che per impostazione predefinita ha una durata di 5 minuti.

### Comprendere i costi dei punti di interruzione della cache

**I punti di interruzione della cache stessi non aggiungono alcun costo.** Ti viene addebitato solo per:
- **Scritture della cache**: Quando il nuovo contenuto viene scritto nella cache (25% in più rispetto ai token di input di base per TTL di 5 minuti)
- **Letture della cache**: Quando il contenuto memorizzato nella cache viene utilizzato (10% del prezzo del token di input di base)
- **Token di input regolari**: Per qualsiasi contenuto non memorizzato nella cache

L'aggiunta di più punti di interruzione `cache_control` non aumenta i tuoi costi - paghi comunque lo stesso importo in base a quale contenuto è effettivamente memorizzato nella cache e letto. I punti di interruzione ti danno semplicemente il controllo su quali sezioni possono essere memorizzate nella cache in modo indipendente.

### Cosa può essere memorizzato nella cache
La maggior parte dei blocchi nella richiesta può essere designata per la memorizzazione nella cache con `cache_control`. Questo include:

- Strumenti: Definizioni di strumenti nell'array `tools`
- Messaggi di sistema: Blocchi di contenuto nell'array `system`
- Messaggi di testo: Blocchi di contenuto nell'array `messages.content`, per i turni sia dell'utente che dell'assistente
- Immagini e documenti: Blocchi di contenuto nell'array `messages.content`, nei turni dell'utente
- Utilizzo di strumenti e risultati di strumenti: Blocchi di contenuto nell'array `messages.content`, nei turni sia dell'utente che dell'assistente

Ognuno di questi elementi può essere contrassegnato con `cache_control` per abilitare la memorizzazione nella cache per quella parte della richiesta.

### Cosa non può essere memorizzato nella cache
Mentre la maggior parte dei blocchi di richiesta può essere memorizzata nella cache, ci sono alcune eccezioni:

- I blocchi di pensiero non possono essere memorizzati nella cache direttamente con `cache_control`. Tuttavia, i blocchi di pensiero POSSONO essere memorizzati nella cache insieme ad altro contenuto quando appaiono nei turni dell'assistente precedenti. Quando memorizzati nella cache in questo modo, CONTANO come token di input quando letti dalla cache.
- I blocchi di sub-contenuto (come [citazioni](/docs/it/build-with-claude/citations)) stessi non possono essere memorizzati nella cache direttamente. Invece, memorizza nella cache il blocco di livello superiore.

    Nel caso delle citazioni, i blocchi di contenuto del documento di livello superiore che servono come materiale di origine per le citazioni possono essere memorizzati nella cache. Questo ti consente di utilizzare prompt caching con le citazioni in modo efficace memorizzando nella cache i documenti a cui le citazioni faranno riferimento.
- I blocchi di testo vuoti non possono essere memorizzati nella cache.

### Cosa invalida la cache

Le modifiche al contenuto memorizzato nella cache possono invalidare parte o tutta la cache.

Come descritto in [Strutturare il tuo prompt](#structuring-your-prompt), la cache segue la gerarchia: `tools` → `system` → `messages`. Le modifiche a ogni livello invalidano quel livello e tutti i livelli successivi.

La tabella seguente mostra quali parti della cache vengono invalidate da diversi tipi di modifiche. ✘ indica che la cache viene invalidata, mentre ✓ indica che la cache rimane valida.

| Cosa cambia | Cache degli strumenti | Cache di sistema | Cache dei messaggi | Impatto |
|------------|------------------|---------------|----------------|-------------|
| **Definizioni degli strumenti** | ✘ | ✘ | ✘ | La modifica delle definizioni degli strumenti (nomi, descrizioni, parametri) invalida l'intera cache |
| **Attiva/disattiva ricerca web** | ✓ | ✘ | ✘ | L'abilitazione/disabilitazione della ricerca web modifica il prompt di sistema |
| **Attiva/disattiva citazioni** | ✓ | ✘ | ✘ | L'abilitazione/disabilitazione delle citazioni modifica il prompt di sistema |
| **Scelta dello strumento** | ✓ | ✓ | ✘ | Le modifiche al parametro `tool_choice` influiscono solo sui blocchi di messaggi |
| **Immagini** | ✓ | ✓ | ✘ | L'aggiunta/rimozione di immagini in qualsiasi punto del prompt influisce sui blocchi di messaggi |
| **Parametri di pensiero** | ✓ | ✓ | ✘ | Le modifiche alle impostazioni di pensiero esteso (abilitazione/disabilitazione, budget) influiscono sui blocchi di messaggi |
| **Risultati non di strumento passati a richieste di pensiero esteso** | ✓ | ✓ | ✘ | Quando i risultati non di strumento vengono passati in richieste mentre il pensiero esteso è abilitato, tutti i blocchi di pensiero precedentemente memorizzati nella cache vengono rimossi dal contesto e tutti i messaggi nel contesto che seguono quei blocchi di pensiero vengono rimossi dalla cache. Per ulteriori dettagli, vedi [Caching con blocchi di pensiero](#caching-with-thinking-blocks). |

### Tracciamento delle prestazioni della cache

Monitora le prestazioni della cache utilizzando questi campi di risposta dell'API, all'interno di `usage` nella risposta (o evento `message_start` se [streaming](/docs/it/build-with-claude/streaming)):

- `cache_creation_input_tokens`: Numero di token scritti nella cache quando si crea una nuova voce.
- `cache_read_input_tokens`: Numero di token recuperati dalla cache per questa richiesta.
- `input_tokens`: Numero di token di input che non sono stati letti da o utilizzati per creare una cache (cioè, token dopo l'ultimo punto di interruzione della cache).

<Note>
**Comprendere la suddivisione dei token**

Il campo `input_tokens` rappresenta solo i token che vengono **dopo l'ultimo punto di interruzione della cache** nella tua richiesta - non tutti i token di input che hai inviato.

Per calcolare il totale dei token di input:
```
total_input_tokens = cache_read_input_tokens + cache_creation_input_tokens + input_tokens
```

**Spiegazione spaziale:**
- `cache_read_input_tokens` = token prima del punto di interruzione già memorizzati nella cache (letture)
- `cache_creation_input_tokens` = token prima del punto di interruzione in fase di memorizzazione nella cache ora (scritture)
- `input_tokens` = token dopo il tuo ultimo punto di interruzione (non idonei per la cache)

**Esempio:** Se hai una richiesta con 100.000 token di contenuto memorizzato nella cache (letto dalla cache), 0 token di nuovo contenuto in fase di memorizzazione nella cache e 50 token nel tuo messaggio utente (dopo il punto di interruzione della cache):
- `cache_read_input_tokens`: 100.000
- `cache_creation_input_tokens`: 0
- `input_tokens`: 50
- **Token di input totali elaborati**: 100.050 token

Questo è importante per comprendere sia i costi che i limiti di velocità, poiché `input_tokens` sarà tipicamente molto più piccolo del tuo input totale quando utilizzi il caching in modo efficace.
</Note>

### Migliori pratiche per un caching efficace

Per ottimizzare le prestazioni del prompt caching:

- Memorizza nella cache il contenuto stabile e riutilizzabile come istruzioni di sistema, informazioni di background, contesti ampi o definizioni di strumenti frequenti.
- Posiziona il contenuto memorizzato nella cache all'inizio del prompt per le migliori prestazioni.
- Utilizza i punti di interruzione della cache strategicamente per separare diverse sezioni di prefisso memorizzabili nella cache.
- Imposta i punti di interruzione della cache alla fine delle conversazioni e appena prima del contenuto modificabile per massimizzare i tassi di hit della cache, specialmente quando si lavora con prompt che hanno più di 20 blocchi di contenuto.
- Analizza regolarmente i tassi di hit della cache e regola la tua strategia secondo necessità.

### Ottimizzazione per diversi casi d'uso

Personalizza la tua strategia di prompt caching al tuo scenario:

- Agenti conversazionali: Riduci il costo e la latenza per conversazioni estese, specialmente quelle con istruzioni lunghe o documenti caricati.
- Assistenti di codifica: Migliora l'autocompletamento e le domande sulla base di codice mantenendo sezioni rilevanti o una versione riassunta della base di codice nel prompt.
- Elaborazione di documenti di grandi dimensioni: Incorpora materiale completo di lunga forma incluse immagini nel tuo prompt senza aumentare la latenza della risposta.
- Set di istruzioni dettagliati: Condividi elenchi estesi di istruzioni, procedure ed esempi per mettere a punto le risposte di Claude. Gli sviluppatori spesso includono uno o due esempi nel prompt, ma con prompt caching puoi ottenere prestazioni ancora migliori includendo 20+ diversi esempi di risposte di alta qualità.
- Utilizzo di strumenti agentici: Migliora le prestazioni per scenari che coinvolgono più chiamate di strumenti e modifiche di codice iterative, dove ogni passaggio tipicamente richiede una nuova chiamata API.
- Parla con libri, articoli, documentazione, trascrizioni di podcast e altri contenuti di lunga forma: Dai vita a qualsiasi base di conoscenza incorporando l'intero documento(i) nel prompt e lasciando che gli utenti facciano domande.

### Risoluzione dei problemi comuni

Se riscontri comportamenti inaspettati:

- Assicurati che le sezioni memorizzate nella cache siano identiche e contrassegnate con cache_control negli stessi luoghi tra le chiamate
- Verifica che le chiamate vengano effettuate entro la durata della cache (5 minuti per impostazione predefinita)
- Verifica che `tool_choice` e l'utilizzo delle immagini rimangono coerenti tra le chiamate
- Convalida che stai memorizzando nella cache almeno il numero minimo di token
- Il sistema controlla automaticamente i hit della cache ai confini dei blocchi di contenuto precedenti (fino a ~20 blocchi prima del tuo punto di interruzione). Per prompt con più di 20 blocchi di contenuto, potrebbe essere necessario parametri `cache_control` aggiuntivi prima nel prompt per assicurare che tutto il contenuto possa essere memorizzato nella cache
- Verifica che le chiavi nei tuoi blocchi di contenuto `tool_use` abbiano un ordine stabile poiché alcuni linguaggi (ad esempio Swift, Go) randomizzano l'ordine delle chiavi durante la conversione JSON, interrompendo le cache

<Note>
Le modifiche a `tool_choice` o la presenza/assenza di immagini in qualsiasi punto del prompt invalideranno la cache, richiedendo la creazione di una nuova voce della cache. Per ulteriori dettagli sull'invalidazione della cache, vedi [Cosa invalida la cache](#what-invalidates-the-cache).
</Note>

### Caching con blocchi di pensiero

Quando si utilizza [pensiero esteso](/docs/it/build-with-claude/extended-thinking) con prompt caching, i blocchi di pensiero hanno un comportamento speciale:

**Memorizzazione automatica nella cache insieme ad altro contenuto**: Mentre i blocchi di pensiero non possono essere esplicitamente contrassegnati con `cache_control`, vengono memorizzati nella cache come parte del contenuto della richiesta quando effettui successive chiamate API con risultati di strumenti. Questo accade comunemente durante l'utilizzo di strumenti quando passi i blocchi di pensiero indietro per continuare la conversazione.

**Conteggio dei token di input**: Quando i blocchi di pensiero vengono letti dalla cache, contano come token di input nelle tue metriche di utilizzo. Questo è importante per il calcolo dei costi e il budgeting dei token.

**Modelli di invalidazione della cache**:
- La cache rimane valida quando vengono forniti solo risultati di strumenti come messaggi utente
- La cache viene invalidata quando viene aggiunto contenuto utente non di risultato di strumento, causando la rimozione di tutti i blocchi di pensiero precedenti
- Questo comportamento di caching si verifica anche senza marcatori `cache_control` espliciti

Per ulteriori dettagli sull'invalidazione della cache, vedi [Cosa invalida la cache](#what-invalidates-the-cache).

**Esempio con utilizzo di strumenti**:
```
Richiesta 1: Utente: "Qual è il meteo a Parigi?"
Risposta: [thinking_block_1] + [blocco tool_use 1]

Richiesta 2:
Utente: ["Qual è il meteo a Parigi?"],
Assistente: [thinking_block_1] + [blocco tool_use 1],
Utente: [tool_result_1, cache=True]
Risposta: [thinking_block_2] + [blocco testo 2]
# La richiesta 2 memorizza nella cache il suo contenuto di richiesta (non la risposta)
# La cache include: messaggio utente, thinking_block_1, blocco tool_use 1 e tool_result_1

Richiesta 3:
Utente: ["Qual è il meteo a Parigi?"],
Assistente: [thinking_block_1] + [blocco tool_use 1],
Utente: [tool_result_1, cache=True],
Assistente: [thinking_block_2] + [blocco testo 2],
Utente: [Risposta di testo, cache=True]
# Il blocco utente non di risultato di strumento designa un nuovo ciclo di assistente e tutti i blocchi di pensiero precedenti vengono rimossi
# Questa richiesta viene elaborata come se i blocchi di pensiero non fossero mai stati presenti
```

Quando viene incluso un blocco utente non di risultato di strumento, designa un nuovo ciclo di assistente e tutti i blocchi di pensiero precedenti vengono rimossi dal contesto.

Per informazioni più dettagliate, vedi la [documentazione di pensiero esteso](/docs/it/build-with-claude/extended-thinking#understanding-thinking-block-caching-behavior).

---
## Archiviazione e condivisione della cache

- **Isolamento dell'organizzazione**: Le cache sono isolate tra le organizzazioni. Diverse organizzazioni non condividono mai le cache, anche se utilizzano prompt identici.

- **Corrispondenza esatta**: I hit della cache richiedono segmenti di prompt identici al 100%, inclusi tutto il testo e le immagini fino a e includendo il blocco contrassegnato con controllo della cache.

- **Generazione di token di output**: Prompt caching non ha alcun effetto sulla generazione di token di output. La risposta che ricevi sarà identica a quella che otterresti se prompt caching non fosse utilizzato.

---
## Durata della cache di 1 ora

Se ritieni che 5 minuti sia troppo breve, Anthropic offre anche una durata della cache di 1 ora [a costo aggiuntivo](#pricing).

Per utilizzare la cache estesa, includi `ttl` nella definizione di `cache_control` come questo:
```json
"cache_control": {
    "type": "ephemeral",
    "ttl": "5m" | "1h"
}
```

La risposta includerà informazioni dettagliate sulla cache come la seguente:
```json
{
    "usage": {
        "input_tokens": ...,
        "cache_read_input_tokens": ...,
        "cache_creation_input_tokens": ...,
        "output_tokens": ...,

        "cache_creation": {
            "ephemeral_5m_input_tokens": 456,
            "ephemeral_1h_input_tokens": 100,
        }
    }
}
```

Nota che il campo `cache_creation_input_tokens` attuale è uguale alla somma dei valori nell'oggetto `cache_creation`.

### Quando utilizzare la cache di 1 ora

Se hai prompt che vengono utilizzati a una cadenza regolare (cioè, prompt di sistema che vengono utilizzati più frequentemente di ogni 5 minuti), continua a utilizzare la cache di 5 minuti, poiché questa continuerà a essere aggiornata senza costi aggiuntivi.

La cache di 1 ora è meglio utilizzata nei seguenti scenari:
- Quando hai prompt che probabilmente vengono utilizzati meno frequentemente di 5 minuti, ma più frequentemente di ogni ora. Ad esempio, quando un agente laterale agentivo impiegherà più di 5 minuti, o quando memorizzi una lunga conversazione di chat con un utente e generalmente ti aspetti che quell'utente potrebbe non rispondere nei prossimi 5 minuti.
- Quando la latenza è importante e i tuoi prompt di follow-up potrebbero essere inviati oltre 5 minuti.
- Quando desideri migliorare l'utilizzo del tuo limite di velocità, poiché i hit della cache non vengono detratti dal tuo limite di velocità.

<Note>
La cache di 5 minuti e 1 ora si comportano allo stesso modo rispetto alla latenza. Generalmente vedrai un tempo migliorato al primo token per documenti lunghi.
</Note>

### Miscelazione di diversi TTL

Puoi utilizzare sia controlli della cache di 1 ora che di 5 minuti nella stessa richiesta, ma con un vincolo importante: Le voci della cache con TTL più lungo devono apparire prima di TTL più brevi (cioè, una voce della cache di 1 ora deve apparire prima di qualsiasi voce della cache di 5 minuti).

Quando si mescolano i TTL, determiniamo tre posizioni di fatturazione nel tuo prompt:
1. Posizione `A`: Il conteggio dei token al hit della cache più alto (o 0 se nessun hit).
2. Posizione `B`: Il conteggio dei token al blocco `cache_control` di 1 ora più alto dopo `A` (o uguale a `A` se nessuno esiste).
3. Posizione `C`: Il conteggio dei token all'ultimo blocco `cache_control`.

<Note>
Se `B` e/o `C` sono più grandi di `A`, saranno necessariamente cache miss, perché `A` è il hit della cache più alto.
</Note>

Ti verrà addebitato per:
1. Token di lettura della cache per `A`.
2. Token di scrittura della cache di 1 ora per `(B - A)`.
3. Token di scrittura della cache di 5 minuti per `(C - B)`.

Ecco 3 esempi. Questo raffigura i token di input di 3 richieste, ognuna delle quali ha diversi hit della cache e cache miss. Ognuno ha un prezzo calcolato diverso, mostrato nelle caselle colorate, di conseguenza.
![Mixing TTLs Diagram](/docs/images/prompt-cache-mixed-ttl.svg)

---

## Esempi di prompt caching

Per aiutarti a iniziare con il prompt caching, abbiamo preparato un [prompt caching cookbook](https://github.com/anthropics/anthropic-cookbook/blob/main/misc/prompt_caching.ipynb) con esempi dettagliati e best practice.

Di seguito, abbiamo incluso diversi frammenti di codice che mostrano vari modelli di prompt caching. Questi esempi dimostrano come implementare il caching in diversi scenari, aiutandoti a comprendere le applicazioni pratiche di questa funzionalità:

<section title="Esempio di caching di contesto ampio">

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
    "system": [
        {
            "type": "text",
            "text": "You are an AI assistant tasked with analyzing legal documents."
        },
        {
            "type": "text",
            "text": "Here is the full text of a complex legal agreement: [Insert full text of a 50-page legal agreement here]",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    "messages": [
        {
            "role": "user",
            "content": "What are the key terms and conditions in this agreement?"
        }
    ]
}'
```

```python Python
import anthropic
client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": "You are an AI assistant tasked with analyzing legal documents."
        },
        {
            "type": "text",
            "text": "Here is the full text of a complex legal agreement: [Insert full text of a 50-page legal agreement here]",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        {
            "role": "user",
            "content": "What are the key terms and conditions in this agreement?"
        }
    ]
)
print(response.model_dump_json())
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  system: [
    {
        "type": "text",
        "text": "You are an AI assistant tasked with analyzing legal documents."
    },
    {
        "type": "text",
        "text": "Here is the full text of a complex legal agreement: [Insert full text of a 50-page legal agreement here]",
        "cache_control": {"type": "ephemeral"}
    }
  ],
  messages: [
    {
        "role": "user",
        "content": "What are the key terms and conditions in this agreement?"
    }
  ]
});
console.log(response);
```

```java Java
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;

public class LegalDocumentAnalysisExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                .systemOfTextBlockParams(List.of(
                        TextBlockParam.builder()
                                .text("You are an AI assistant tasked with analyzing legal documents.")
                                .build(),
                        TextBlockParam.builder()
                                .text("Here is the full text of a complex legal agreement: [Insert full text of a 50-page legal agreement here]")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build()
                ))
                .addUserMessage("What are the key terms and conditions in this agreement?")
                .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>
Questo esempio dimostra l'utilizzo di base del prompt caching, memorizzando nella cache il testo completo dell'accordo legale come prefisso mantenendo l'istruzione dell'utente non memorizzata nella cache.

Per la prima richiesta:
- `input_tokens`: Numero di token nel messaggio dell'utente solo
- `cache_creation_input_tokens`: Numero di token nell'intero messaggio di sistema, incluso il documento legale
- `cache_read_input_tokens`: 0 (nessun cache hit sulla prima richiesta)

Per le richieste successive entro la durata della cache:
- `input_tokens`: Numero di token nel messaggio dell'utente solo
- `cache_creation_input_tokens`: 0 (nessuna nuova creazione di cache)
- `cache_read_input_tokens`: Numero di token nell'intero messaggio di sistema memorizzato nella cache

</section>
<section title="Caching delle definizioni degli strumenti">

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
                    },
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"],
                        "description": "The unit of temperature, either celsius or fahrenheit"
                    }
                },
                "required": ["location"]
            }
        },
        # many more tools
        {
            "name": "get_time",
            "description": "Get the current time in a given time zone",
            "input_schema": {
                "type": "object",
                "properties": {
                    "timezone": {
                        "type": "string",
                        "description": "The IANA time zone name, e.g. America/Los_Angeles"
                    }
                },
                "required": ["timezone"]
            },
            "cache_control": {"type": "ephemeral"}
        }
    ],
    "messages": [
        {
            "role": "user",
            "content": "What is the weather and time in New York?"
        }
    ]
}'
```

```python Python
import anthropic
client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
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
                        "description": "The unit of temperature, either 'celsius' or 'fahrenheit'"
                    }
                },
                "required": ["location"]
            },
        },
        # many more tools
        {
            "name": "get_time",
            "description": "Get the current time in a given time zone",
            "input_schema": {
                "type": "object",
                "properties": {
                    "timezone": {
                        "type": "string",
                        "description": "The IANA time zone name, e.g. America/Los_Angeles"
                    }
                },
                "required": ["timezone"]
            },
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        {
            "role": "user",
            "content": "What's the weather and time in New York?"
        }
    ]
)
print(response.model_dump_json())
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
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
                        "description": "The unit of temperature, either 'celsius' or 'fahrenheit'"
                    }
                },
                "required": ["location"]
            },
        },
        // many more tools
        {
            "name": "get_time",
            "description": "Get the current time in a given time zone",
            "input_schema": {
                "type": "object",
                "properties": {
                    "timezone": {
                        "type": "string",
                        "description": "The IANA time zone name, e.g. America/Los_Angeles"
                    }
                },
                "required": ["timezone"]
            },
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages: [
        {
            "role": "user",
            "content": "What's the weather and time in New York?"
        }
    ]
});
console.log(response);
```

```java Java
import java.util.List;
import java.util.Map;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.JsonValue;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.Tool;
import com.anthropic.models.messages.Tool.InputSchema;

public class ToolsWithCacheControlExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Weather tool schema
        InputSchema weatherSchema = InputSchema.builder()
                .properties(JsonValue.from(Map.of(
                        "location", Map.of(
                                "type", "string",
                                "description", "The city and state, e.g. San Francisco, CA"
                        ),
                        "unit", Map.of(
                                "type", "string",
                                "enum", List.of("celsius", "fahrenheit"),
                                "description", "The unit of temperature, either celsius or fahrenheit"
                        )
                )))
                .putAdditionalProperty("required", JsonValue.from(List.of("location")))
                .build();

        // Time tool schema
        InputSchema timeSchema = InputSchema.builder()
                .properties(JsonValue.from(Map.of(
                        "timezone", Map.of(
                                "type", "string",
                                "description", "The IANA time zone name, e.g. America/Los_Angeles"
                        )
                )))
                .putAdditionalProperty("required", JsonValue.from(List.of("timezone")))
                .build();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                .addTool(Tool.builder()
                        .name("get_weather")
                        .description("Get the current weather in a given location")
                        .inputSchema(weatherSchema)
                        .build())
                .addTool(Tool.builder()
                        .name("get_time")
                        .description("Get the current time in a given time zone")
                        .inputSchema(timeSchema)
                        .cacheControl(CacheControlEphemeral.builder().build())
                        .build())
                .addUserMessage("What is the weather and time in New York?")
                .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>

In questo esempio, dimostriamo il caching delle definizioni degli strumenti.

Il parametro `cache_control` è posizionato sullo strumento finale (`get_time`) per designare tutti gli strumenti come parte del prefisso statico.

Ciò significa che tutte le definizioni degli strumenti, inclusi `get_weather` e qualsiasi altro strumento definito prima di `get_time`, verranno memorizzati nella cache come un singolo prefisso.

Questo approccio è utile quando hai un set coerente di strumenti che desideri riutilizzare in più richieste senza rielaborarli ogni volta.

Per la prima richiesta:
- `input_tokens`: Numero di token nel messaggio dell'utente
- `cache_creation_input_tokens`: Numero di token in tutte le definizioni degli strumenti e nel prompt di sistema
- `cache_read_input_tokens`: 0 (nessun cache hit sulla prima richiesta)

Per le richieste successive entro la durata della cache:
- `input_tokens`: Numero di token nel messaggio dell'utente
- `cache_creation_input_tokens`: 0 (nessuna nuova creazione di cache)
- `cache_read_input_tokens`: Numero di token in tutte le definizioni degli strumenti e nel prompt di sistema memorizzati nella cache

</section>

<section title="Continuazione di una conversazione multi-turno">

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
    "system": [
        {
            "type": "text",
            "text": "...long system prompt",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Hello, can you tell me more about the solar system?",
                }
            ]
        },
        {
            "role": "assistant",
            "content": "Certainly! The solar system is the collection of celestial bodies that orbit our Sun. It consists of eight planets, numerous moons, asteroids, comets, and other objects. The planets, in order from closest to farthest from the Sun, are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet has its own unique characteristics and features. Is there a specific aspect of the solar system you would like to know more about?"
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Good to know."
                },
                {
                    "type": "text",
                    "text": "Tell me more about Mars.",
                    "cache_control": {"type": "ephemeral"}
                }
            ]
        }
    ]
}'
```

```python Python
import anthropic
client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": "...long system prompt",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        # ...long conversation so far
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Hello, can you tell me more about the solar system?",
                }
            ]
        },
        {
            "role": "assistant",
            "content": "Certainly! The solar system is the collection of celestial bodies that orbit our Sun. It consists of eight planets, numerous moons, asteroids, comets, and other objects. The planets, in order from closest to farthest from the Sun, are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet has its own unique characteristics and features. Is there a specific aspect of the solar system you'd like to know more about?"
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Good to know."
                },
                {
                    "type": "text",
                    "text": "Tell me more about Mars.",
                    "cache_control": {"type": "ephemeral"}
                }
            ]
        }
    ]
)
print(response.model_dump_json())
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    system=[
        {
            "type": "text",
            "text": "...long system prompt",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        // ...long conversation so far
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Hello, can you tell me more about the solar system?",
                }
            ]
        },
        {
            "role": "assistant",
            "content": "Certainly! The solar system is the collection of celestial bodies that orbit our Sun. It consists of eight planets, numerous moons, asteroids, comets, and other objects. The planets, in order from closest to farthest from the Sun, are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet has its own unique characteristics and features. Is there a specific aspect of the solar system you'd like to know more about?"
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Good to know."
                },
                {
                    "type": "text",
                    "text": "Tell me more about Mars.",
                    "cache_control": {"type": "ephemeral"}
                }
            ]
        }
    ]
});
console.log(response);
```

```java Java
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.ContentBlockParam;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;

public class ConversationWithCacheControlExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Create ephemeral system prompt
        TextBlockParam systemPrompt = TextBlockParam.builder()
                .text("...long system prompt")
                .cacheControl(CacheControlEphemeral.builder().build())
                .build();

        // Create message params
        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                .systemOfTextBlockParams(List.of(systemPrompt))
                // First user message (without cache control)
                .addUserMessage("Hello, can you tell me more about the solar system?")
                // Assistant response
                .addAssistantMessage("Certainly! The solar system is the collection of celestial bodies that orbit our Sun. It consists of eight planets, numerous moons, asteroids, comets, and other objects. The planets, in order from closest to farthest from the Sun, are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet has its own unique characteristics and features. Is there a specific aspect of the solar system you would like to know more about?")
                // Second user message (with cache control)
                .addUserMessageOfBlockParams(List.of(
                        ContentBlockParam.ofText(TextBlockParam.builder()
                                .text("Good to know.")
                                .build()),
                        ContentBlockParam.ofText(TextBlockParam.builder()
                                .text("Tell me more about Mars.")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build())
                ))
                .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>

In questo esempio, dimostriamo come utilizzare il prompt caching in una conversazione multi-turno.

Durante ogni turno, contrassegniamo il blocco finale del messaggio finale con `cache_control` in modo che la conversazione possa essere memorizzata nella cache in modo incrementale. Il sistema cercherà automaticamente e utilizzerà la sequenza più lunga di blocchi precedentemente memorizzati nella cache per i messaggi di follow-up. Cioè, i blocchi che erano precedentemente contrassegnati con un blocco `cache_control` non sono successivamente contrassegnati con questo, ma saranno comunque considerati un cache hit (e anche un cache refresh!) se vengono colpiti entro 5 minuti.

Inoltre, nota che il parametro `cache_control` è posizionato sul messaggio di sistema. Questo è per garantire che se viene rimosso dalla cache (dopo non essere stato utilizzato per più di 5 minuti), verrà aggiunto di nuovo alla cache sulla richiesta successiva.

Questo approccio è utile per mantenere il contesto nelle conversazioni in corso senza rielaborare ripetutamente le stesse informazioni.

Quando questo è configurato correttamente, dovresti vedere quanto segue nella risposta di utilizzo di ogni richiesta:
- `input_tokens`: Numero di token nel nuovo messaggio dell'utente (sarà minimo)
- `cache_creation_input_tokens`: Numero di token nei nuovi turni dell'assistente e dell'utente
- `cache_read_input_tokens`: Numero di token nella conversazione fino al turno precedente

</section>

<section title="Mettere tutto insieme: Più punti di interruzione della cache">

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
    "tools": [
        {
            "name": "search_documents",
            "description": "Search through the knowledge base",
            "input_schema": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Search query"
                    }
                },
                "required": ["query"]
            }
        },
        {
            "name": "get_document",
            "description": "Retrieve a specific document by ID",
            "input_schema": {
                "type": "object",
                "properties": {
                    "doc_id": {
                        "type": "string",
                        "description": "Document ID"
                    }
                },
                "required": ["doc_id"]
            },
            "cache_control": {"type": "ephemeral"}
        }
    ],
    "system": [
        {
            "type": "text",
            "text": "You are a helpful research assistant with access to a document knowledge base.\n\n# Instructions\n- Always search for relevant documents before answering\n- Provide citations for your sources\n- Be objective and accurate in your responses\n- If multiple documents contain relevant information, synthesize them\n- Acknowledge when information is not available in the knowledge base",
            "cache_control": {"type": "ephemeral"}
        },
        {
            "type": "text",
            "text": "# Knowledge Base Context\n\nHere are the relevant documents for this conversation:\n\n## Document 1: Solar System Overview\nThe solar system consists of the Sun and all objects that orbit it...\n\n## Document 2: Planetary Characteristics\nEach planet has unique features. Mercury is the smallest planet...\n\n## Document 3: Mars Exploration\nMars has been a target of exploration for decades...\n\n[Additional documents...]",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    "messages": [
        {
            "role": "user",
            "content": "Can you search for information about Mars rovers?"
        },
        {
            "role": "assistant",
            "content": [
                {
                    "type": "tool_use",
                    "id": "tool_1",
                    "name": "search_documents",
                    "input": {"query": "Mars rovers"}
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "tool_result",
                    "tool_use_id": "tool_1",
                    "content": "Found 3 relevant documents: Document 3 (Mars Exploration), Document 7 (Rover Technology), Document 9 (Mission History)"
                }
            ]
        },
        {
            "role": "assistant",
            "content": [
                {
                    "type": "text",
                    "text": "I found 3 relevant documents about Mars rovers. Let me get more details from the Mars Exploration document."
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Yes, please tell me about the Perseverance rover specifically.",
                    "cache_control": {"type": "ephemeral"}
                }
            ]
        }
    ]
}'
```

```python Python
import anthropic
client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[
        {
            "name": "search_documents",
            "description": "Search through the knowledge base",
            "input_schema": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Search query"
                    }
                },
                "required": ["query"]
            }
        },
        {
            "name": "get_document",
            "description": "Retrieve a specific document by ID",
            "input_schema": {
                "type": "object",
                "properties": {
                    "doc_id": {
                        "type": "string",
                        "description": "Document ID"
                    }
                },
                "required": ["doc_id"]
            },
            "cache_control": {"type": "ephemeral"}
        }
    ],
    system=[
        {
            "type": "text",
            "text": "You are a helpful research assistant with access to a document knowledge base.\n\n# Instructions\n- Always search for relevant documents before answering\n- Provide citations for your sources\n- Be objective and accurate in your responses\n- If multiple documents contain relevant information, synthesize them\n- Acknowledge when information is not available in the knowledge base",
            "cache_control": {"type": "ephemeral"}
        },
        {
            "type": "text",
            "text": "# Knowledge Base Context\n\nHere are the relevant documents for this conversation:\n\n## Document 1: Solar System Overview\nThe solar system consists of the Sun and all objects that orbit it...\n\n## Document 2: Planetary Characteristics\nEach planet has unique features. Mercury is the smallest planet...\n\n## Document 3: Mars Exploration\nMars has been a target of exploration for decades...\n\n[Additional documents...]",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        {
            "role": "user",
            "content": "Can you search for information about Mars rovers?"
        },
        {
            "role": "assistant",
            "content": [
                {
                    "type": "tool_use",
                    "id": "tool_1",
                    "name": "search_documents",
                    "input": {"query": "Mars rovers"}
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "tool_result",
                    "tool_use_id": "tool_1",
                    "content": "Found 3 relevant documents: Document 3 (Mars Exploration), Document 7 (Rover Technology), Document 9 (Mission History)"
                }
            ]
        },
        {
            "role": "assistant",
            "content": [
                {
                    "type": "text",
                    "text": "I found 3 relevant documents about Mars rovers. Let me get more details from the Mars Exploration document."
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Yes, please tell me about the Perseverance rover specifically.",
                    "cache_control": {"type": "ephemeral"}
                }
            ]
        }
    ]
)
print(response.model_dump_json())
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    tools: [
        {
            name: "search_documents",
            description: "Search through the knowledge base",
            input_schema: {
                type: "object",
                properties: {
                    query: {
                        type: "string",
                        description: "Search query"
                    }
                },
                required: ["query"]
            }
        },
        {
            name: "get_document",
            description: "Retrieve a specific document by ID",
            input_schema: {
                type: "object",
                properties: {
                    doc_id: {
                        type: "string",
                        description: "Document ID"
                    }
                },
                required: ["doc_id"]
            },
            cache_control: { type: "ephemeral" }
        }
    ],
    system: [
        {
            type: "text",
            text: "You are a helpful research assistant with access to a document knowledge base.\n\n# Instructions\n- Always search for relevant documents before answering\n- Provide citations for your sources\n- Be objective and accurate in your responses\n- If multiple documents contain relevant information, synthesize them\n- Acknowledge when information is not available in the knowledge base",
            cache_control: { type: "ephemeral" }
        },
        {
            type: "text",
            text: "# Knowledge Base Context\n\nHere are the relevant documents for this conversation:\n\n## Document 1: Solar System Overview\nThe solar system consists of the Sun and all objects that orbit it...\n\n## Document 2: Planetary Characteristics\nEach planet has unique features. Mercury is the smallest planet...\n\n## Document 3: Mars Exploration\nMars has been a target of exploration for decades...\n\n[Additional documents...]",
            cache_control: { type: "ephemeral" }
        }
    ],
    messages: [
        {
            role: "user",
            content: "Can you search for information about Mars rovers?"
        },
        {
            role: "assistant",
            content: [
                {
                    type: "tool_use",
                    id: "tool_1",
                    name: "search_documents",
                    input: { query: "Mars rovers" }
                }
            ]
        },
        {
            role: "user",
            content: [
                {
                    type: "tool_result",
                    tool_use_id: "tool_1",
                    content: "Found 3 relevant documents: Document 3 (Mars Exploration), Document 7 (Rover Technology), Document 9 (Mission History)"
                }
            ]
        },
        {
            role: "assistant",
            content: [
                {
                    type: "text",
                    text: "I found 3 relevant documents about Mars rovers. Let me get more details from the Mars Exploration document."
                }
            ]
        },
        {
            role: "user",
            content: [
                {
                    type: "text",
                    text: "Yes, please tell me about the Perseverance rover specifically.",
                    cache_control: { type: "ephemeral" }
                }
            ]
        }
    ]
});
console.log(response);
```

```java Java
import java.util.List;
import java.util.Map;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.JsonValue;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.ContentBlockParam;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;
import com.anthropic.models.messages.Tool;
import com.anthropic.models.messages.Tool.InputSchema;
import com.anthropic.models.messages.ToolResultBlockParam;
import com.anthropic.models.messages.ToolUseBlockParam;

public class MultipleCacheBreakpointsExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Search tool schema
        InputSchema searchSchema = InputSchema.builder()
                .properties(JsonValue.from(Map.of(
                        "query", Map.of(
                                "type", "string",
                                "description", "Search query"
                        )
                )))
                .putAdditionalProperty("required", JsonValue.from(List.of("query")))
                .build();

        // Get document tool schema
        InputSchema getDocSchema = InputSchema.builder()
                .properties(JsonValue.from(Map.of(
                        "doc_id", Map.of(
                                "type", "string",
                                "description", "Document ID"
                        )
                )))
                .putAdditionalProperty("required", JsonValue.from(List.of("doc_id")))
                .build();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                // Tools with cache control on the last one
                .addTool(Tool.builder()
                        .name("search_documents")
                        .description("Search through the knowledge base")
                        .inputSchema(searchSchema)
                        .build())
                .addTool(Tool.builder()
                        .name("get_document")
                        .description("Retrieve a specific document by ID")
                        .inputSchema(getDocSchema)
                        .cacheControl(CacheControlEphemeral.builder().build())
                        .build())
                // System prompts with cache control on instructions and context separately
                .systemOfTextBlockParams(List.of(
                        TextBlockParam.builder()
                                .text("You are a helpful research assistant with access to a document knowledge base.\n\n# Instructions\n- Always search for relevant documents before answering\n- Provide citations for your sources\n- Be objective and accurate in your responses\n- If multiple documents contain relevant information, synthesize them\n- Acknowledge when information is not available in the knowledge base")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build(),
                        TextBlockParam.builder()
                                .text("# Knowledge Base Context\n\nHere are the relevant documents for this conversation:\n\n## Document 1: Solar System Overview\nThe solar system consists of the Sun and all objects that orbit it...\n\n## Document 2: Planetary Characteristics\nEach planet has unique features. Mercury is the smallest planet...\n\n## Document 3: Mars Exploration\nMars has been a target of exploration for decades...\n\n[Additional documents...]")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build()
                ))
                // Conversation history
                .addUserMessage("Can you search for information about Mars rovers?")
                .addAssistantMessageOfBlockParams(List.of(
                        ContentBlockParam.ofToolUse(ToolUseBlockParam.builder()
                                .id("tool_1")
                                .name("search_documents")
                                .input(JsonValue.from(Map.of("query", "Mars rovers")))
                                .build())
                ))
                .addUserMessageOfBlockParams(List.of(
                        ContentBlockParam.ofToolResult(ToolResultBlockParam.builder()
                                .toolUseId("tool_1")
                                .content("Found 3 relevant documents: Document 3 (Mars Exploration), Document 7 (Rover Technology), Document 9 (Mission History)")
                                .build())
                ))
                .addAssistantMessageOfBlockParams(List.of(
                        ContentBlockParam.ofText(TextBlockParam.builder()
                                .text("I found 3 relevant documents about Mars rovers. Let me get more details from the Mars Exploration document.")
                                .build())
                ))
                .addUserMessageOfBlockParams(List.of(
                        ContentBlockParam.ofText(TextBlockParam.builder()
                                .text("Yes, please tell me about the Perseverance rover specifically.")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build())
                ))
                .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>

Questo esempio completo dimostra come utilizzare tutti i 4 punti di interruzione della cache disponibili per ottimizzare diverse parti del tuo prompt:

1. **Cache degli strumenti** (punto di interruzione della cache 1): Il parametro `cache_control` sull'ultima definizione dello strumento memorizza nella cache tutte le definizioni degli strumenti.

2. **Cache delle istruzioni riutilizzabili** (punto di interruzione della cache 2): Le istruzioni statiche nel prompt di sistema vengono memorizzate nella cache separatamente. Queste istruzioni cambiano raramente tra le richieste.

3. **Cache del contesto RAG** (punto di interruzione della cache 3): I documenti della knowledge base vengono memorizzati nella cache indipendentemente, consentendoti di aggiornare i documenti RAG senza invalidare la cache degli strumenti o delle istruzioni.

4. **Cache della cronologia della conversazione** (punto di interruzione della cache 4): La risposta dell'assistente è contrassegnata con `cache_control` per abilitare il caching incrementale della conversazione mentre progredisce.

Questo approccio fornisce la massima flessibilità:
- Se aggiorni solo il messaggio dell'utente finale, tutti e quattro i segmenti della cache vengono riutilizzati
- Se aggiorni i documenti RAG ma mantieni gli stessi strumenti e istruzioni, i primi due segmenti della cache vengono riutilizzati
- Se modifichi la conversazione ma mantieni gli stessi strumenti, istruzioni e documenti, i primi tre segmenti vengono riutilizzati
- Ogni punto di interruzione della cache può essere invalidato indipendentemente in base a ciò che cambia nella tua applicazione

Per la prima richiesta:
- `input_tokens`: Token nel messaggio dell'utente finale
- `cache_creation_input_tokens`: Token in tutti i segmenti memorizzati nella cache (strumenti + istruzioni + documenti RAG + cronologia della conversazione)
- `cache_read_input_tokens`: 0 (nessun cache hit)

Per le richieste successive con solo un nuovo messaggio dell'utente:
- `input_tokens`: Token solo nel nuovo messaggio dell'utente
- `cache_creation_input_tokens`: Eventuali nuovi token aggiunti alla cronologia della conversazione
- `cache_read_input_tokens`: Tutti i token precedentemente memorizzati nella cache (strumenti + istruzioni + documenti RAG + conversazione precedente)

Questo modello è particolarmente potente per:
- Applicazioni RAG con contesti di documenti di grandi dimensioni
- Sistemi di agenti che utilizzano più strumenti
- Conversazioni di lunga durata che devono mantenere il contesto
- Applicazioni che devono ottimizzare diverse parti del prompt in modo indipendente

</section>

---
## Domande frequenti

  <section title="Ho bisogno di più punti di interruzione della cache o uno alla fine è sufficiente?">

    **Nella maggior parte dei casi, un singolo punto di interruzione della cache alla fine del tuo contenuto statico è sufficiente.** Il sistema controlla automaticamente i cache hit a tutti i confini dei blocchi di contenuto precedenti (fino a 20 blocchi prima del tuo punto di interruzione) e utilizza la sequenza più lunga di blocchi memorizzati nella cache.

    Hai bisogno di più punti di interruzione solo se:
    - Hai più di 20 blocchi di contenuto prima del tuo punto di cache desiderato
    - Desideri memorizzare nella cache sezioni che si aggiornano a frequenze diverse in modo indipendente
    - Hai bisogno di un controllo esplicito su ciò che viene memorizzato nella cache per l'ottimizzazione dei costi

    Esempio: Se hai istruzioni di sistema (cambiano raramente) e contesto RAG (cambia quotidianamente), potresti utilizzare due punti di interruzione per memorizzarli nella cache separatamente.
  
</section>

  <section title="I punti di interruzione della cache aggiungono costi extra?">

    No, i punti di interruzione della cache stessi sono gratuiti. Paghi solo per:
    - Scrivere contenuto nella cache (25% in più rispetto ai token di input di base per TTL di 5 minuti)
    - Leggere dalla cache (10% del prezzo del token di input di base)
    - Token di input regolari per contenuto non memorizzato nella cache

    Il numero di punti di interruzione non influisce sui prezzi - conta solo la quantità di contenuto memorizzato nella cache e letto.
  
</section>

  <section title="Come calcolo i token di input totali dai campi di utilizzo?">

    La risposta di utilizzo include tre campi di token di input separati che insieme rappresentano il tuo input totale:

    ```
    total_input_tokens = cache_read_input_tokens + cache_creation_input_tokens + input_tokens
    ```

    - `cache_read_input_tokens`: Token recuperati dalla cache (tutto prima dei punti di interruzione della cache che era memorizzato nella cache)
    - `cache_creation_input_tokens`: Nuovi token in fase di scrittura nella cache (ai punti di interruzione della cache)
    - `input_tokens`: Token **dopo l'ultimo punto di interruzione della cache** che non sono memorizzati nella cache

    **Importante:** `input_tokens` NON rappresenta tutti i token di input - solo la porzione dopo il tuo ultimo punto di interruzione della cache. Se hai contenuto memorizzato nella cache, `input_tokens` sarà tipicamente molto più piccolo del tuo input totale.

    **Esempio:** Con un documento di 200K token memorizzato nella cache e una domanda dell'utente di 50 token:
    - `cache_read_input_tokens`: 200.000
    - `cache_creation_input_tokens`: 0
    - `input_tokens`: 50
    - **Totale**: 200.050 token

    Questa suddivisione è critica per comprendere sia i tuoi costi che l'utilizzo del limite di velocità. Vedi [Tracciamento delle prestazioni della cache](#tracking-cache-performance) per ulteriori dettagli.
  
</section>

  <section title="Qual è la durata della cache?">

    La durata minima predefinita della cache (TTL) è di 5 minuti. Questa durata viene aggiornata ogni volta che il contenuto memorizzato nella cache viene utilizzato.

    Se ritieni che 5 minuti sia troppo breve, Anthropic offre anche una [cache TTL di 1 ora](#1-hour-cache-duration).
  
</section>

  <section title="Quanti punti di interruzione della cache posso utilizzare?">

    Puoi definire fino a 4 punti di interruzione della cache (utilizzando parametri `cache_control`) nel tuo prompt.
  
</section>

  <section title="Il prompt caching è disponibile per tutti i modelli?">

    No, il prompt caching è attualmente disponibile solo per Claude Opus 4.5, Claude Opus 4.1, Claude Opus 4, Claude Sonnet 4.5, Claude Sonnet 4, Claude Sonnet 3.7 ([deprecato](/docs/it/about-claude/model-deprecations)), Claude Haiku 4.5, Claude Haiku 3.5, Claude Haiku 3 e Claude Opus 3 ([deprecato](/docs/it/about-claude/model-deprecations)).
  
</section>

  <section title="Come funziona il prompt caching con il pensiero esteso?">

    I prompt di sistema e gli strumenti memorizzati nella cache verranno riutilizzati quando i parametri di pensiero cambiano. Tuttavia, i cambiamenti di pensiero (abilitazione/disabilitazione o modifiche al budget) invalideranno i prefissi del prompt precedentemente memorizzati nella cache con contenuto di messaggi.

    Per ulteriori dettagli sull'invalidazione della cache, vedi [Cosa invalida la cache](#what-invalidates-the-cache).

    Per ulteriori informazioni sul pensiero esteso, inclusa la sua interazione con l'uso degli strumenti e il prompt caching, vedi la [documentazione del pensiero esteso](/docs/it/build-with-claude/extended-thinking#extended-thinking-and-prompt-caching).
  
</section>

  <section title="Come abilito il prompt caching?">

    Per abilitare il prompt caching, includi almeno un punto di interruzione `cache_control` nella tua richiesta API.
  
</section>

  <section title="Posso utilizzare il prompt caching con altre funzionalità API?">

    Sì, il prompt caching può essere utilizzato insieme ad altre funzionalità API come l'uso degli strumenti e le capacità di visione. Tuttavia, modificare se ci sono immagini in un prompt o modificare le impostazioni di uso degli strumenti interromperà la cache.

    Per ulteriori dettagli sull'invalidazione della cache, vedi [Cosa invalida la cache](#what-invalidates-the-cache).
  
</section>

  <section title="Come il prompt caching influisce sui prezzi?">

    Il prompt caching introduce una nuova struttura di prezzi in cui le scritture nella cache costano il 25% in più rispetto ai token di input di base, mentre i cache hit costano solo il 10% del prezzo del token di input di base.
  
</section>

  <section title="Posso cancellare manualmente la cache?">

    Attualmente, non c'è modo di cancellare manualmente la cache. I prefissi memorizzati nella cache scadono automaticamente dopo un minimo di 5 minuti di inattività.
  
</section>

  <section title="Come posso tracciare l'efficacia della mia strategia di caching?">

    Puoi monitorare le prestazioni della cache utilizzando i campi `cache_creation_input_tokens` e `cache_read_input_tokens` nella risposta API.
  
</section>

  <section title="Cosa può interrompere la cache?">

    Vedi [Cosa invalida la cache](#what-invalidates-the-cache) per ulteriori dettagli sull'invalidazione della cache, incluso un elenco di modifiche che richiedono la creazione di una nuova voce della cache.
  
</section>

  <section title="Come il prompt caching gestisce la privacy e la separazione dei dati?">

Il prompt caching è progettato con forti misure di privacy e separazione dei dati:

1. Le chiavi della cache vengono generate utilizzando un hash crittografico dei prompt fino al punto di controllo della cache. Ciò significa che solo le richieste con prompt identici possono accedere a una cache specifica.

2. Le cache sono specifiche dell'organizzazione. Gli utenti all'interno della stessa organizzazione possono accedere alla stessa cache se utilizzano prompt identici, ma le cache non vengono condivise tra diverse organizzazioni, anche per prompt identici.

3. Il meccanismo di caching è progettato per mantenere l'integrità e la privacy di ogni conversazione o contesto univoco.

4. È sicuro utilizzare `cache_control` ovunque nei tuoi prompt. Per l'efficienza dei costi, è meglio escludere le parti altamente variabili (ad es. input arbitrario dell'utente) dal caching.

Queste misure garantiscono che il prompt caching mantenga la privacy e la sicurezza dei dati mentre offre vantaggi di prestazioni.
  
</section>
  <section title="Posso utilizzare il prompt caching con l'API Batches?">

    Sì, è possibile utilizzare il prompt caching con le tue richieste [Batches API](/docs/it/build-with-claude/batch-processing). Tuttavia, poiché le richieste batch asincrone possono essere elaborate contemporaneamente e in qualsiasi ordine, i cache hit vengono forniti su base best-effort.

    La [cache di 1 ora](#1-hour-cache-duration) può aiutare a migliorare i tuoi cache hit. Il modo più conveniente di utilizzarla è il seguente:
    - Raccogli un set di richieste di messaggi che hanno un prefisso condiviso.
    - Invia una richiesta batch con solo una singola richiesta che ha questo prefisso condiviso e un blocco di cache di 1 ora. Questo verrà scritto nella cache di 1 ora.
    - Non appena è completo, invia il resto delle richieste. Dovrai monitorare il lavoro per sapere quando è completo.

    Questo è tipicamente migliore dell'utilizzo della cache di 5 minuti semplicemente perché è comune che le richieste batch richiedano tra 5 minuti e 1 ora per essere completate. Stiamo considerando modi per migliorare questi tassi di cache hit e rendere questo processo più semplice.
  
</section>
  <section title="Perché sto vedendo l'errore `AttributeError: 'Beta' object has no attribute 'prompt_caching'` in Python?">

  Questo errore di solito appare quando hai aggiornato il tuo SDK o stai utilizzando esempi di codice obsoleti. Il prompt caching è ora generalmente disponibile, quindi non hai più bisogno del prefisso beta. Invece di:
    <CodeGroup>
      ```python Python
      python client.beta.prompt_caching.messages.create(...)
      ```
    </CodeGroup>
    Semplicemente usa:
    <CodeGroup>
      ```python Python
      python client.messages.create(...)
      ```
    </CodeGroup>
  
</section>
  <section title="Perché sto vedendo 'TypeError: Cannot read properties of undefined (reading 'messages')'?">

  Questo errore di solito appare quando hai aggiornato il tuo SDK o stai utilizzando esempi di codice obsoleti. Il prompt caching è ora generalmente disponibile, quindi non hai più bisogno del prefisso beta. Invece di:

      ```typescript TypeScript
      client.beta.promptCaching.messages.create(...)
      ```

      Semplicemente usa:

      ```typescript
      client.messages.create(...)
      ```
  
</section>