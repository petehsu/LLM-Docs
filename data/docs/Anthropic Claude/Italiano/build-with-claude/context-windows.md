# Finestre di contesto

Comprendi come funzionano le finestre di contesto nei modelli Claude e come gestire efficacemente i token

---

## Comprensione della finestra di contesto

La "finestra di contesto" si riferisce alla totalità della quantità di testo che un modello di linguaggio può consultare e referenziare quando genera nuovo testo, più il nuovo testo che genera. Questo è diverso dal grande corpus di dati su cui il modello di linguaggio è stato addestrato, e rappresenta invece una "memoria di lavoro" per il modello. Una finestra di contesto più ampia consente al modello di comprendere e rispondere a prompt più complessi e lunghi, mentre una finestra di contesto più piccola può limitare la capacità del modello di gestire prompt più lunghi o mantenere la coerenza su conversazioni estese.

Il diagramma sottostante illustra il comportamento standard della finestra di contesto per le richieste API<sup>1</sup>:

![Context window diagram](/docs/images/context-window.svg)

_<sup>1</sup>Per le interfacce di chat, come per [claude.ai](https://claude.ai/), le finestre di contesto possono anche essere configurate su un sistema "first in, first out" continuo._

* **Accumulo progressivo di token:** Man mano che la conversazione avanza attraverso i turni, ogni messaggio dell'utente e risposta dell'assistente si accumulano all'interno della finestra di contesto. I turni precedenti vengono preservati completamente.
* **Modello di crescita lineare:** L'utilizzo del contesto cresce linearmente con ogni turno, con i turni precedenti preservati completamente.
* **Capacità di 200K token:** La finestra di contesto totale disponibile (200.000 token) rappresenta la capacità massima per l'archiviazione della cronologia della conversazione e la generazione di nuovo output da Claude.
* **Flusso input-output:** Ogni turno consiste in:
  - **Fase di input:** Contiene tutta la cronologia della conversazione precedente più il messaggio dell'utente corrente
  - **Fase di output:** Genera una risposta di testo che diventa parte di un input futuro

## La finestra di contesto con il pensiero esteso

Quando si utilizza il [pensiero esteso](/docs/it/build-with-claude/extended-thinking), tutti i token di input e output, inclusi i token utilizzati per il pensiero, contano verso il limite della finestra di contesto, con alcune sfumature in situazioni multi-turno.

I token del budget di pensiero sono un sottoinsieme del tuo parametro `max_tokens`, vengono fatturati come token di output e contano verso i limiti di velocità.

Tuttavia, i blocchi di pensiero precedenti vengono automaticamente rimossi dal calcolo della finestra di contesto dall'API Claude e non fanno parte della cronologia della conversazione che il modello "vede" per i turni successivi, preservando la capacità di token per il contenuto della conversazione effettiva.

Il diagramma sottostante dimostra la gestione specializzata dei token quando il pensiero esteso è abilitato:

![Context window diagram with extended thinking](/docs/images/context-window-thinking.svg)

* **Rimozione del pensiero esteso:** I blocchi di pensiero esteso (mostrati in grigio scuro) vengono generati durante la fase di output di ogni turno, **ma non vengono trasportati come token di input per i turni successivi**. Non è necessario rimuovere i blocchi di pensiero da solo. L'API Claude lo fa automaticamente per te se li restituisci.
* **Dettagli di implementazione tecnica:**
  - L'API esclude automaticamente i blocchi di pensiero dai turni precedenti quando li restituisci come parte della cronologia della conversazione.
  - I token di pensiero esteso vengono fatturati come token di output solo una volta, durante la loro generazione.
  - Il calcolo della finestra di contesto effettiva diventa: `context_window = (input_tokens - previous_thinking_tokens) + current_turn_tokens`.
  - I token di pensiero includono sia i blocchi `thinking` che i blocchi `redacted_thinking`.

Questa architettura è efficiente in termini di token e consente un ragionamento esteso senza spreco di token, poiché i blocchi di pensiero possono essere sostanziali in lunghezza.

<Note>
Puoi leggere di più sulla finestra di contesto e il pensiero esteso nella nostra [guida al pensiero esteso](/docs/it/build-with-claude/extended-thinking).
</Note>

## La finestra di contesto con il pensiero esteso e l'uso degli strumenti

Il diagramma sottostante illustra la gestione dei token della finestra di contesto quando si combina il pensiero esteso con l'uso degli strumenti:

![Context window diagram with extended thinking and tool use](/docs/images/context-window-thinking-tools.svg)

<Steps>
  <Step title="Architettura del primo turno">
    - **Componenti di input:** Configurazione degli strumenti e messaggio dell'utente
    - **Componenti di output:** Pensiero esteso + risposta di testo + richiesta di uso dello strumento
    - **Calcolo dei token:** Tutti i componenti di input e output contano verso la finestra di contesto, e tutti i componenti di output vengono fatturati come token di output.
  </Step>
  <Step title="Gestione dei risultati dello strumento (turno 2)">
    - **Componenti di input:** Ogni blocco del primo turno così come il `tool_result`. Il blocco di pensiero esteso **deve** essere restituito con i risultati dello strumento corrispondente. Questo è l'unico caso in cui **devi** restituire i blocchi di pensiero.
    - **Componenti di output:** Dopo che i risultati dello strumento sono stati restituiti a Claude, Claude risponderà solo con testo (nessun pensiero esteso aggiuntivo fino al prossimo messaggio `user`).
    - **Calcolo dei token:** Tutti i componenti di input e output contano verso la finestra di contesto, e tutti i componenti di output vengono fatturati come token di output.
  </Step>
  <Step title="Terzo Step">
    - **Componenti di input:** Tutti gli input e l'output del turno precedente vengono trasportati con l'eccezione del blocco di pensiero, che può essere eliminato ora che Claude ha completato l'intero ciclo di uso dello strumento. L'API rimuoverà automaticamente il blocco di pensiero per te se lo restituisci, oppure puoi sentirti libero di rimuoverlo tu stesso in questa fase. Questo è anche il punto in cui aggiungeresti il prossimo turno `User`.
    - **Componenti di output:** Poiché c'è un nuovo turno `User` al di fuori del ciclo di uso dello strumento, Claude genererà un nuovo blocco di pensiero esteso e continuerà da lì.
    - **Calcolo dei token:** I token di pensiero precedenti vengono automaticamente rimossi dai calcoli della finestra di contesto. Tutti gli altri blocchi precedenti contano ancora come parte della finestra di token, e il blocco di pensiero nel turno `Assistant` corrente conta come parte della finestra di contesto.
  </Step>
</Steps>

* **Considerazioni per l'uso degli strumenti con il pensiero esteso:**
  - Quando si postano i risultati dello strumento, l'intero blocco di pensiero non modificato che accompagna quella specifica richiesta di strumento (incluse le porzioni di firma/redatte) deve essere incluso.
  - Il calcolo della finestra di contesto effettiva per il pensiero esteso con l'uso degli strumenti diventa: `context_window = input_tokens + current_turn_tokens`.
  - Il sistema utilizza firme crittografiche per verificare l'autenticità del blocco di pensiero. La mancata preservazione dei blocchi di pensiero durante l'uso dello strumento può interrompere la continuità del ragionamento di Claude. Pertanto, se modifichi i blocchi di pensiero, l'API restituirà un errore.

<Note>
I modelli Claude 4 supportano il [pensiero interleaved](/docs/it/build-with-claude/extended-thinking#interleaved-thinking), che consente a Claude di pensare tra le chiamate agli strumenti e fare ragionamenti più sofisticati dopo aver ricevuto i risultati dello strumento.

Claude Sonnet 3.7 non supporta il pensiero interleaved, quindi non c'è interleaving del pensiero esteso e delle chiamate agli strumenti senza un turno utente non-`tool_result` in mezzo.

Per ulteriori informazioni sull'utilizzo degli strumenti con il pensiero esteso, consulta la nostra [guida al pensiero esteso](/docs/it/build-with-claude/extended-thinking#extended-thinking-with-tool-use).
</Note>

## Finestra di contesto di 1M token

Claude Sonnet 4 e 4.5 supportano una finestra di contesto di 1 milione di token. Questa finestra di contesto estesa ti consente di elaborare documenti molto più grandi, mantenere conversazioni più lunghe e lavorare con basi di codice più estese.

<Note>
La finestra di contesto di 1M token è attualmente in beta per le organizzazioni nel [livello di utilizzo](/docs/it/api/rate-limits) 4 e le organizzazioni con limiti di velocità personalizzati. La finestra di contesto di 1M token è disponibile solo per Claude Sonnet 4 e Sonnet 4.5.
</Note>

Per utilizzare la finestra di contesto di 1M token, includi l'[intestazione beta](/docs/it/api/beta-headers) `context-1m-2025-08-07` nelle tue richieste API:

<CodeGroup>

```python Python
from anthropic import Anthropic

client = Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Process this large document..."}
    ],
    betas=["context-1m-2025-08-07"]
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const msg = await anthropic.beta.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 1024,
  messages: [
    { role: 'user', content: 'Process this large document...' }
  ],
  betas: ['context-1m-2025-08-07']
});
```

```bash cURL
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: context-1m-2025-08-07" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "Process this large document..."}
    ]
  }'
```

</CodeGroup>

**Considerazioni importanti:**
- **Stato beta**: Questa è una funzione beta soggetta a modifiche. Le funzioni e i prezzi possono essere modificati o rimossi nelle versioni future.
- **Requisito del livello di utilizzo**: La finestra di contesto di 1M token è disponibile per le organizzazioni nel [livello di utilizzo](/docs/it/api/rate-limits) 4 e le organizzazioni con limiti di velocità personalizzati. Le organizzazioni di livello inferiore devono avanzare al livello di utilizzo 4 per accedere a questa funzione.
- **Disponibilità**: La finestra di contesto di 1M token è attualmente disponibile su Claude API, [Microsoft Foundry](/docs/it/build-with-claude/claude-in-microsoft-foundry), [Amazon Bedrock](/docs/it/build-with-claude/claude-on-amazon-bedrock) e [Google Cloud's Vertex AI](/docs/it/build-with-claude/claude-on-vertex-ai).
- **Prezzi**: Le richieste che superano 200K token vengono automaticamente addebitate a tariffe premium (2x input, 1,5x output pricing). Consulta la [documentazione sui prezzi](/docs/it/about-claude/pricing#long-context-pricing) per i dettagli.
- **Limiti di velocità**: Le richieste di contesto lungo hanno limiti di velocità dedicati. Consulta la [documentazione sui limiti di velocità](/docs/it/api/rate-limits#long-context-rate-limits) per i dettagli.
- **Considerazioni multimodali**: Quando si elaborano grandi quantità di immagini o pdf, tieni presente che i file possono variare nell'utilizzo dei token. Quando abbini un prompt grande con un gran numero di immagini, potresti raggiungere i [limiti di dimensione della richiesta](/docs/it/api/overview#request-size-limits).

## Consapevolezza del contesto in Claude Sonnet 4.5 e Haiku 4.5

Claude Sonnet 4.5 e Claude Haiku 4.5 presentano **consapevolezza del contesto**, consentendo a questi modelli di tracciare la loro finestra di contesto rimanente (cioè "budget di token") durante una conversazione. Questo consente a Claude di eseguire attività e gestire il contesto più efficacemente comprendendo quanto spazio ha a disposizione. Claude è addestrato nativamente per utilizzare questo contesto precisamente per persistere nel compito fino alla fine, piuttosto che dover indovinare quanti token rimangono. Per un modello, la mancanza di consapevolezza del contesto è come competere in uno show di cucina senza un orologio. I modelli Claude 4.5 cambiano questo informando esplicitamente il modello sul suo contesto rimanente, in modo che possa sfruttare al massimo i token disponibili.

**Come funziona:**

All'inizio di una conversazione, Claude riceve informazioni sulla sua finestra di contesto totale:

```
<budget:token_budget>200000</budget:token_budget>
```

Il budget è impostato su 200K token (standard), 500K token (Claude.ai Enterprise) o 1M token (beta, per le organizzazioni idonee).

Dopo ogni chiamata dello strumento, Claude riceve un aggiornamento sulla capacità rimanente:

```
<system_warning>Token usage: 35000/200000; 165000 remaining</system_warning>
```

Questa consapevolezza aiuta Claude a determinare quanta capacità rimane per il lavoro e consente un'esecuzione più efficace su attività di lunga durata. I token delle immagini sono inclusi in questi budget.

**Vantaggi:**

La consapevolezza del contesto è particolarmente preziosa per:
- Sessioni di agenti di lunga durata che richiedono un focus sostenuto
- Flussi di lavoro multi-finestra di contesto in cui le transizioni di stato sono importanti
- Attività complesse che richiedono una gestione attenta dei token

Per una guida al prompt su come sfruttare la consapevolezza del contesto, consulta la nostra [guida alle best practice di Claude 4](/docs/it/build-with-claude/prompt-engineering/claude-4-best-practices#context-awareness-and-multi-window-workflows).

## Gestione della finestra di contesto con i modelli Claude più recenti

Nei modelli Claude più recenti (a partire da Claude Sonnet 3.7), se la somma dei token di prompt e dei token di output supera la finestra di contesto del modello, il sistema restituirà un errore di convalida anziché troncare silenziosamente il contesto. Questo cambiamento fornisce un comportamento più prevedibile ma richiede una gestione dei token più attenta.

Per pianificare l'utilizzo dei token e assicurarti di rimanere entro i limiti della finestra di contesto, puoi utilizzare l'[API di conteggio dei token](/docs/it/build-with-claude/token-counting) per stimare quanti token utilizzeranno i tuoi messaggi prima di inviarli a Claude.

Consulta la nostra tabella di [confronto dei modelli](/docs/it/about-claude/models/overview#model-comparison-table) per un elenco delle dimensioni della finestra di contesto per modello.

# Passaggi successivi
<CardGroup cols={2}>
  <Card title="Tabella di confronto dei modelli" icon="scales" href="/docs/it/about-claude/models/overview#model-comparison-table">
    Consulta la nostra tabella di confronto dei modelli per un elenco delle dimensioni della finestra di contesto e dei prezzi dei token di input/output per modello.
  </Card>
  <Card title="Panoramica del pensiero esteso" icon="settings" href="/docs/it/build-with-claude/extended-thinking">
    Scopri di più su come funziona il pensiero esteso e come implementarlo insieme ad altre funzioni come l'uso degli strumenti e la cache dei prompt.
  </Card>
</CardGroup>