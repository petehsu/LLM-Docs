# Novità in Claude 4.5

Scopri le tre nuove versioni di Claude 4.5 e le loro capacità distintive, inclusi miglioramenti chiave, nuove funzionalità API e prezzi competitivi.

---

Claude 4.5 introduce tre modelli progettati per diversi casi d'uso:

- **Claude Opus 4.5**: Il nostro modello più intelligente che combina la massima capacità con prestazioni pratiche. Presenta un prezzo più accessibile rispetto ai precedenti modelli Opus. Disponibile con una finestra di contesto di 200k token.
- **Claude Sonnet 4.5**: Il nostro miglior modello per agenti complessi e codifica, con l'intelligenza più elevata nella maggior parte dei compiti. Disponibile con una finestra di contesto di 200k e 1M (beta) token.
- **Claude Haiku 4.5**: Il nostro modello Haiku più veloce e intelligente con prestazioni quasi all'avanguardia. Disponibile con una finestra di contesto di 200k token.

## Miglioramenti chiave in Opus 4.5 rispetto a Opus 4.1

### Intelligenza massima

Claude Opus 4.5 rappresenta il nostro modello più intelligente, combinando la massima capacità con prestazioni pratiche. Offre miglioramenti significativi nel ragionamento, nella codifica e nei compiti di risoluzione di problemi complessi, mantenendo gli output di alta qualità attesi dalla famiglia Opus.

### Parametro effort

Claude Opus 4.5 è l'unico modello che supporta il [parametro effort](/docs/it/build-with-claude/effort), permettendoti di controllare quanti token Claude utilizza quando risponde. Questo ti dà la possibilità di fare un compromesso tra la completezza della risposta e l'efficienza dei token con un singolo modello.

Il parametro effort influisce su tutti i token nella risposta, incluse le risposte di testo, le chiamate di strumenti e il pensiero esteso. Puoi scegliere tra:
- **High effort**: Massima completezza per analisi complesse e spiegazioni dettagliate
- **Medium effort**: Approccio equilibrato per la maggior parte dei casi d'uso in produzione
- **Low effort**: Risposte più efficienti in termini di token per l'automazione ad alto volume

### Eccellenza nell'uso del computer

Claude Opus 4.5 introduce [capacità di computer use migliorate](/docs/it/agents-and-tools/tool-use/computer-use-tool) con una nuova azione di zoom che consente un'ispezione dettagliata di specifiche regioni dello schermo a risoluzione completa. Questo permette a Claude di esaminare elementi UI a grana fine, testo piccolo e informazioni visive dettagliate che potrebbero essere poco chiare negli screenshot standard.

La capacità di zoom è particolarmente preziosa per:
- Ispezionare piccoli elementi e controlli dell'interfaccia utente
- Leggere caratteri piccoli o testo dettagliato
- Analizzare interfacce complesse con informazioni dense
- Verificare dettagli visivi precisi prima di intraprendere azioni

### Prestazioni pratiche

Claude Opus 4.5 offre intelligenza di livello flagship a un [prezzo più accessibile](/docs/it/about-claude/pricing) rispetto ai precedenti modelli Opus, rendendo le capacità di IA avanzate disponibili per una gamma più ampia di applicazioni e casi d'uso.

### Preservazione dei blocchi di pensiero

Claude Opus 4.5 [preserva automaticamente tutti i blocchi di pensiero precedenti](/docs/it/build-with-claude/extended-thinking#thinking-block-preservation-in-claude-opus-4-5) durante le conversazioni, mantenendo la continuità del ragionamento attraverso interazioni multi-turno estese e sessioni di utilizzo di strumenti. Questo assicura che Claude possa sfruttare efficacemente la sua intera cronologia di ragionamento quando lavora su compiti complessi e di lunga durata.

## Miglioramenti chiave in Sonnet 4.5 rispetto a Sonnet 4

### Eccellenza nella codifica

Claude Sonnet 4.5 è il nostro miglior modello di codifica fino ad oggi, con miglioramenti significativi in tutto il ciclo di vita dello sviluppo:

- **Prestazioni verificate SWE-bench**: Stato avanzato all'avanguardia nei benchmark di codifica
- **Pianificazione e progettazione del sistema migliorate**: Migliori decisioni architettoniche e organizzazione del codice
- **Ingegneria della sicurezza migliorata**: Pratiche di sicurezza più robuste e rilevamento delle vulnerabilità
- **Miglior seguimento delle istruzioni**: Aderenza più precisa alle specifiche e ai requisiti di codifica

<Note>
Claude Sonnet 4.5 funziona significativamente meglio nei compiti di codifica quando il [pensiero esteso](/docs/it/build-with-claude/extended-thinking) è abilitato. Il pensiero esteso è disabilitato per impostazione predefinita, ma consigliamo di abilitarlo per il lavoro di codifica complesso. Tieni presente che il pensiero esteso influisce sull'[efficienza della cache dei prompt](/docs/it/build-with-claude/prompt-caching#caching-with-thinking-blocks). Consulta la [guida alla migrazione](/docs/it/about-claude/models/migrating-to-claude-4#extended-thinking-recommendations) per i dettagli di configurazione.
</Note>

### Capacità degli agenti

Claude Sonnet 4.5 introduce importanti progressi nelle capacità degli agenti:

- **Operazione autonoma estesa**: Sonnet 4.5 può lavorare in modo indipendente per ore mantenendo chiarezza e focus sui progressi incrementali. Il modello fa progressi costanti su pochi compiti alla volta piuttosto che tentare di fare tutto contemporaneamente. Fornisce aggiornamenti di progresso basati su fatti che riflettono accuratamente ciò che è stato realizzato.
- **Consapevolezza del contesto**: Claude ora traccia l'utilizzo dei token durante le conversazioni, ricevendo aggiornamenti dopo ogni chiamata di strumento. Questa consapevolezza aiuta a prevenire l'abbandono prematuro dei compiti e consente un'esecuzione più efficace nei compiti di lunga durata. Consulta [Consapevolezza del contesto](/docs/it/build-with-claude/context-windows#context-awareness-in-claude-sonnet-4-5) per i dettagli tecnici e la [guida al prompting](/docs/it/build-with-claude/prompt-engineering/claude-4-best-practices#context-awareness-and-multi-window-workflows).
- **Utilizzo degli strumenti migliorato**: Il modello utilizza più efficacemente le chiamate di strumenti parallele, lanciando più ricerche speculative simultaneamente durante la ricerca e leggendo più file contemporaneamente per costruire il contesto più velocemente. Il coordinamento migliorato tra più strumenti e fonti di informazioni consente al modello di sfruttare efficacemente un'ampia gamma di capacità nella ricerca agentica e nei flussi di lavoro di codifica.
- **Gestione avanzata del contesto**: Sonnet 4.5 mantiene un tracciamento dello stato eccezionale nei file esterni, preservando l'orientamento agli obiettivi tra le sessioni. Combinato con un utilizzo più efficace della finestra di contesto e le nostre nuove funzionalità API di gestione del contesto, il modello gestisce in modo ottimale le informazioni tra sessioni estese per mantenere la coerenza nel tempo.

<Note>La consapevolezza del contesto è disponibile in Claude Sonnet 4, Sonnet 4.5, Haiku 4.5, Opus 4, Opus 4.1 e Opus 4.5.</Note>

### Stile di comunicazione e interazione

Claude Sonnet 4.5 ha un approccio comunicativo raffinato che è conciso, diretto e naturale. Fornisce aggiornamenti di progresso basati su fatti e può saltare riepiloghi dettagliati dopo le chiamate di strumenti per mantenere lo slancio del flusso di lavoro (anche se questo può essere regolato con il prompting).

Per una guida dettagliata su come lavorare con questo stile di comunicazione, consulta [Best practice di Claude 4](/docs/it/build-with-claude/prompt-engineering/claude-4-best-practices).

### Generazione di contenuti creativi

Claude Sonnet 4.5 eccelle nei compiti di contenuti creativi:

- **Presentazioni e animazioni**: Corrisponde o supera Claude Opus 4.1 e Opus 4.5 per la creazione di diapositive e contenuti visivi
- **Tocco creativo**: Produce output lucido e professionale con un forte seguimento delle istruzioni
- **Qualità al primo tentativo**: Genera contenuti utilizzabili e ben progettati nei tentativi iniziali

## Miglioramenti chiave in Haiku 4.5 rispetto a Haiku 3.5

Claude Haiku 4.5 rappresenta un salto trasformativo per la famiglia di modelli Haiku, portando capacità all'avanguardia alla nostra classe di modelli più veloce:

### Intelligenza quasi all'avanguardia con velocità fulminea

Claude Haiku 4.5 offre prestazioni quasi all'avanguardia che corrispondono a Sonnet 4 a un costo significativamente inferiore e una velocità più elevata:

- **Intelligenza quasi all'avanguardia**: Corrisponde alle prestazioni di Sonnet 4 nel ragionamento, nella codifica e nei compiti complessi
- **Velocità migliorata**: Più del doppio della velocità di Sonnet 4, con ottimizzazioni per i token di output al secondo (OTPS)
- **Rapporto costo-prestazioni ottimale**: Intelligenza quasi all'avanguardia a un terzo del costo, ideale per distribuzioni ad alto volume

### Capacità di pensiero esteso

Claude Haiku 4.5 è il **primo modello Haiku** a supportare il pensiero esteso, portando capacità di ragionamento avanzate alla famiglia Haiku:

- **Ragionamento a velocità**: Accesso al processo di ragionamento interno di Claude per la risoluzione di problemi complessi
- **Riassunto del pensiero**: Output di pensiero riassunto per distribuzioni pronte per la produzione
- **Pensiero intercalato**: Pensa tra le chiamate di strumenti per flussi di lavoro multi-step più sofisticati
- **Controllo del budget**: Configura i budget dei token di pensiero per bilanciare la profondità del ragionamento con la velocità

Il pensiero esteso deve essere abilitato esplicitamente aggiungendo un parametro `thinking` alle tue richieste API. Consulta la [documentazione del pensiero esteso](/docs/it/build-with-claude/extended-thinking) per i dettagli di implementazione.

<Note>
Claude Haiku 4.5 funziona significativamente meglio nei compiti di codifica e ragionamento quando il [pensiero esteso](/docs/it/build-with-claude/extended-thinking) è abilitato. Il pensiero esteso è disabilitato per impostazione predefinita, ma consigliamo di abilitarlo per la risoluzione di problemi complessi, il lavoro di codifica e il ragionamento multi-step. Tieni presente che il pensiero esteso influisce sull'[efficienza della cache dei prompt](/docs/it/build-with-claude/prompt-caching#caching-with-thinking-blocks). Consulta la [guida alla migrazione](/docs/it/about-claude/models/migrating-to-claude-4#extended-thinking-recommendations) per i dettagli di configurazione.
</Note>

<Note>Disponibile in Claude Sonnet 3.7, Sonnet 4, Sonnet 4.5, Haiku 4.5, Opus 4, Opus 4.1 e Opus 4.5.</Note>

### Consapevolezza del contesto

Claude Haiku 4.5 presenta **consapevolezza del contesto**, consentendo al modello di tracciare la sua finestra di contesto rimanente durante una conversazione:

- **Tracciamento del budget dei token**: Claude riceve aggiornamenti in tempo reale sulla capacità di contesto rimanente dopo ogni chiamata di strumento
- **Migliore persistenza dei compiti**: Il modello può eseguire i compiti più efficacemente comprendendo lo spazio di lavoro disponibile
- **Flussi di lavoro multi-finestra di contesto**: Gestione migliorata delle transizioni di stato tra sessioni estese

Questo è il primo modello Haiku con capacità native di consapevolezza del contesto. Per la guida al prompting, consulta [Best practice di Claude 4](/docs/it/build-with-claude/prompt-engineering/claude-4-best-practices#context-awareness-and-multi-window-workflows).

<Note>Disponibile in Claude Sonnet 4, Sonnet 4.5, Haiku 4.5, Opus 4, Opus 4.1 e Opus 4.5.</Note>

### Codifica forte e utilizzo degli strumenti

Claude Haiku 4.5 offre solide capacità di codifica attese dai moderni modelli Claude:

- **Competenza di codifica**: Prestazioni forti nella generazione di codice, nel debug e nei compiti di refactoring
- **Supporto completo degli strumenti**: Compatibile con tutti gli strumenti di Claude 4 inclusi bash, esecuzione del codice, editor di testo, ricerca web e computer use
- **Computer use migliorato**: Ottimizzato per l'interazione autonoma del desktop e i flussi di lavoro di automazione del browser
- **Esecuzione parallela degli strumenti**: Coordinamento efficiente tra più strumenti per flussi di lavoro complessi

Haiku 4.5 è progettato per casi d'uso che richiedono sia intelligenza che efficienza:

- **Applicazioni in tempo reale**: Tempi di risposta rapidi per esperienze utente interattive
- **Elaborazione ad alto volume**: Intelligenza conveniente per distribuzioni su larga scala
- **Implementazioni del livello gratuito**: Qualità del modello premium a prezzi accessibili
- **Architetture di sub-agenti**: Agenti veloci e intelligenti per sistemi multi-agente
- **Computer use su larga scala**: Automazione autonoma del desktop e del browser conveniente

## Nuove funzionalità API

### Chiamata di strumenti programmatica (Beta)

La [chiamata di strumenti programmatica](/docs/it/agents-and-tools/tool-use/programmatic-tool-calling) consente a Claude di scrivere codice che chiama i tuoi strumenti in modo programmatico all'interno di un contenitore di esecuzione del codice, piuttosto che richiedere round trip attraverso il modello per ogni invocazione di strumento. Questo riduce significativamente la latenza per i flussi di lavoro multi-strumento e diminuisce il consumo di token consentendo a Claude di filtrare o elaborare i dati prima che raggiungano la finestra di contesto del modello.

```python
tools=[
    {
        "type": "code_execution_20250825",
        "name": "code_execution"
    },
    {
        "name": "query_database",
        "description": "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
        "input_schema": {...},
        "allowed_callers": ["code_execution_20250825"]  # Enable programmatic calling
    }
]
```

Vantaggi chiave:
- **Latenza ridotta**: Elimina i round trip del modello tra le chiamate di strumenti
- **Efficienza dei token**: Elabora e filtra i risultati degli strumenti in modo programmatico prima di restituirli a Claude
- **Flussi di lavoro complessi**: Supporta cicli, logica condizionale ed elaborazione batch

<Note>Disponibile in Claude Opus 4.5 e Claude Sonnet 4.5. Richiede [intestazione beta](/docs/it/api/beta-headers): `advanced-tool-use-2025-11-20`</Note>

### Strumento di ricerca degli strumenti (Beta)

Lo [strumento di ricerca degli strumenti](/docs/it/agents-and-tools/tool-use/tool-search-tool) consente a Claude di lavorare con centinaia o migliaia di strumenti scoprendo e caricando dinamicamente quelli necessari su richiesta. Invece di caricare tutte le definizioni degli strumenti nella finestra di contesto in anticipo, Claude cerca il tuo catalogo di strumenti e carica solo gli strumenti di cui ha bisogno.

Sono disponibili due varianti di ricerca:
- **Regex** (`tool_search_tool_regex_20251119`): Claude costruisce pattern regex per cercare nomi, descrizioni e argomenti degli strumenti
- **BM25** (`tool_search_tool_bm25_20251119`): Claude utilizza query in linguaggio naturale per cercare gli strumenti

```python
tools=[
    {
        "type": "tool_search_tool_regex_20251119",
        "name": "tool_search_tool_regex"
    },
    {
        "name": "get_weather",
        "description": "Get the weather at a specific location",
        "input_schema": {...},
        "defer_loading": True  # Load on-demand via search
    }
]
```

Questo approccio risolve due sfide critiche:
- **Efficienza del contesto**: Risparmia 10-20K token non caricando tutte le definizioni degli strumenti in anticipo
- **Accuratezza della selezione degli strumenti**: Mantieni un'elevata accuratezza anche con 100+ strumenti disponibili

<Note>Disponibile in Claude Opus 4.5 e Claude Sonnet 4.5. Richiede [intestazione beta](/docs/it/api/beta-headers): `advanced-tool-use-2025-11-20`</Note>

### Parametro effort (Beta)

Il [parametro effort](/docs/it/build-with-claude/effort) ti consente di controllare quanti token Claude utilizza quando risponde, facendo un compromesso tra la completezza della risposta e l'efficienza dei token:

```python
response = client.beta.messages.create(
    model="claude-opus-4-5-20251101",
    betas=["effort-2025-11-24"],
    max_tokens=4096,
    messages=[{"role": "user", "content": "..."}],
    output_config={
        "effort": "medium"  # "low", "medium", or "high"
    }
)
```

Il parametro effort influisce su tutti i token nella risposta, incluse le risposte di testo, le chiamate di strumenti e il pensiero esteso. I livelli di effort inferiore producono risposte più concise con spiegazioni minime, mentre l'effort superiore fornisce ragionamento dettagliato e risposte complete.

<Note>Disponibile esclusivamente in Claude Opus 4.5. Richiede [intestazione beta](/docs/it/api/beta-headers): `effort-2025-11-24`</Note>

### Esempi di utilizzo degli strumenti (Beta)

Gli [esempi di utilizzo degli strumenti](/docs/it/agents-and-tools/tool-use/implement-tool-use#providing-tool-use-examples) ti consentono di fornire esempi concreti di input di strumenti validi per aiutare Claude a comprendere come utilizzare i tuoi strumenti più efficacemente. Questo è particolarmente utile per strumenti complessi con oggetti annidati, parametri opzionali o input sensibili al formato.

```python
tools=[
    {
        "name": "get_weather",
        "description": "Get the current weather in a given location",
        "input_schema": {...},
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
                "location": "New York, NY"  # Demonstrates optional 'unit' parameter
            }
        ]
    }
]
```

Gli esempi sono inclusi nel prompt insieme al tuo schema degli strumenti, mostrando a Claude pattern concreti per chiamate di strumenti ben formate. Ogni esempio deve essere valido secondo lo `input_schema` dello strumento.

<Note>Disponibile in Claude Sonnet 4.5, Haiku 4.5, Opus 4.5, Opus 4.1 e Opus 4. Richiede [intestazione beta](/docs/it/api/beta-headers): `advanced-tool-use-2025-11-20`.</Note>

### Strumento di memoria (Beta)

Il nuovo [strumento di memoria](/docs/it/agents-and-tools/tool-use/memory-tool) consente a Claude di archiviare e recuperare informazioni al di fuori della finestra di contesto:

```python
tools=[
    {
        "type": "memory_20250818",
        "name": "memory"
    }
]
```

Questo consente:
- Costruire basi di conoscenza nel tempo
- Mantenere lo stato del progetto tra le sessioni
- Preservare contesto effettivamente illimitato attraverso l'archiviazione basata su file

<Note>Disponibile in Claude Sonnet 4, Sonnet 4.5, Haiku 4.5, Opus 4, Opus 4.1 e Opus 4.5. Richiede [intestazione beta](/docs/it/api/beta-headers): `context-management-2025-06-27`</Note>

### Modifica del contesto

Utilizza la [modifica del contesto](/docs/it/build-with-claude/context-editing) per la gestione intelligente del contesto attraverso la cancellazione automatica delle chiamate di strumenti:

```python
response = client.beta.messages.create(
    betas=["context-management-2025-06-27"],
    model="claude-sonnet-4-5",  # or claude-haiku-4-5
    max_tokens=4096,
    messages=[{"role": "user", "content": "..."}],
    context_management={
        "edits": [
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {"type": "input_tokens", "value": 500},
                "keep": {"type": "tool_uses", "value": 2},
                "clear_at_least": {"type": "input_tokens", "value": 100}
            }
        ]
    },
    tools=[...]
)
```

Questa funzionalità rimuove automaticamente le chiamate di strumenti e i risultati più vecchi quando ci si avvicina ai limiti dei token, aiutando a gestire il contesto nelle sessioni di agenti di lunga durata.

<Note>Disponibile in Claude Sonnet 4, Sonnet 4.5, Haiku 4.5, Opus 4, Opus 4.1 e Opus 4.5. Richiede [intestazione beta](/docs/it/api/beta-headers): `context-management-2025-06-27`</Note>

### Motivi di arresto migliorati

I modelli Claude 4.5 introducono un nuovo motivo di arresto `model_context_window_exceeded` che indica esplicitamente quando la generazione si è fermata a causa del raggiungimento del limite della finestra di contesto, piuttosto che il limite `max_tokens` richiesto. Questo rende più facile gestire i limiti della finestra di contesto nella logica dell'applicazione.

```json
{
  "stop_reason": "model_context_window_exceeded",
  "usage": {
    "input_tokens": 150000,
    "output_tokens": 49950
  }
}
```

### Gestione migliorata dei parametri degli strumenti

I modelli Claude 4.5 includono una correzione di bug che preserva la formattazione intenzionale nei parametri di stringa delle chiamate di strumenti. In precedenza, le newline finali nei parametri di stringa venivano talvolta rimosse in modo errato. Questa correzione assicura che gli strumenti che richiedono una formattazione precisa (come gli editor di testo) ricevano i parametri esattamente come previsto.

<Note>
Questo è un miglioramento dietro le quinte senza modifiche API richieste. Tuttavia, gli strumenti con parametri di stringa potrebbero ora ricevere valori con newline finali che erano precedentemente rimosse.
</Note>

**Esempio:**

```json
// Prima: Newline finale rimossa accidentalmente
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "edit_todo",
  "input": {
    "file": "todo.txt",
    "contents": "1. Chop onions.\n2. ???\n3. Profit"
  }
}

// Dopo: Newline finale preservata come previsto
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "edit_todo",
  "input": {
    "file": "todo.txt",
    "contents": "1. Chop onions.\n2. ???\n3. Profit\n"
  }
}
```

### Ottimizzazioni del conteggio dei token

I modelli Claude 4.5 includono ottimizzazioni automatiche per migliorare le prestazioni del modello. Queste ottimizzazioni possono aggiungere piccole quantità di token alle richieste, ma **non ti viene addebitato per questi token aggiunti dal sistema**.

## Funzionalità introdotte in Claude 4

Le seguenti funzionalità sono state introdotte in Claude 4 e sono disponibili su tutti i modelli Claude 4, inclusi Claude Sonnet 4.5 e Claude Haiku 4.5.

### Nuovo motivo di rifiuto

I modelli Claude 4 introducono un nuovo motivo di arresto `refusal` per i contenuti che il modello rifiuta di generare per motivi di sicurezza:

```json
{
  "id": "msg_014XEDjypDjFzgKVWdFUXxZP",
  "type": "message",
  "role": "assistant",
  "model": "claude-sonnet-4-5",
  "content": [{"type": "text", "text": "I would be happy to assist you. You can "}],
  "stop_reason": "refusal",
  "stop_sequence": null,
  "usage": {
    "input_tokens": 564,
    "cache_creation_input_tokens": 0,
    "cache_read_input_tokens": 0,
    "output_tokens": 22
  }
}
```

Quando utilizzi i modelli Claude 4, dovresti aggiornare la tua applicazione per [gestire i motivi di arresto `refusal`](/docs/it/test-and-evaluate/strengthen-guardrails/handle-streaming-refusals).

### Pensiero riassunto

Con il pensiero esteso abilitato, l'API Messages per i modelli Claude 4 restituisce un riassunto del processo di pensiero completo di Claude. Il pensiero riassunto fornisce i vantaggi di intelligenza completa del pensiero esteso, prevenendo l'uso improprio.

Mentre l'API è coerente tra i modelli Claude 3.7 e 4, le risposte in streaming per il pensiero esteso potrebbero tornare in un pattern di consegna "frammentato", con possibili ritardi tra gli eventi di streaming.

<Note>
La riassunzione viene elaborata da un modello diverso da quello che specifichi nelle tue richieste. Il modello di pensiero non vede l'output riassunto.
</Note>

Per ulteriori informazioni, consulta la [documentazione del pensiero esteso](/docs/it/build-with-claude/extended-thinking#summarized-thinking).

### Pensiero intercalato

I modelli Claude 4 supportano l'intercalamento dell'utilizzo degli strumenti con il pensiero esteso, consentendo conversazioni più naturali in cui gli utilizzi degli strumenti e le risposte possono essere mescolati con messaggi regolari.

<Note>
Il pensiero intercalato è in beta. Per abilitare il pensiero intercalato, aggiungi l'[intestazione beta](/docs/it/api/beta-headers) `interleaved-thinking-2025-05-14` alla tua richiesta API.
</Note>

Per ulteriori informazioni, consulta la [documentazione del pensiero esteso](/docs/it/build-with-claude/extended-thinking#interleaved-thinking).

### Differenze comportamentali

I modelli Claude 4 hanno notevoli cambiamenti comportamentali che possono influire su come strutturi i prompt:

#### Cambiamenti nello stile di comunicazione

- **Più conciso e diretto**: I modelli Claude 4 comunicano in modo più efficiente, con spiegazioni meno dettagliate
- **Tono più naturale**: Le risposte sono leggermente più conversazionali e meno simili a una macchina
- **Focalizzato sull'efficienza**: Potrebbe saltare riepiloghi dettagliati dopo il completamento delle azioni per mantenere lo slancio del flusso di lavoro (puoi chiedere più dettagli se necessario)

#### Seguimento delle istruzioni

I modelli Claude 4 sono addestrati per il seguimento preciso delle istruzioni e richiedono una direzione più esplicita:

- **Sii esplicito sulle azioni**: Utilizza un linguaggio diretto come "Apporta queste modifiche" o "Implementa questa funzionalità" piuttosto che "Puoi suggerire modifiche" se vuoi che Claude agisca
- **Dichiara chiaramente i comportamenti desiderati**: Claude seguirà le istruzioni con precisione, quindi essere specifico su ciò che vuoi aiuta a ottenere risultati migliori

Per una guida completa su come lavorare con questi modelli, consulta [Best practice di prompt engineering di Claude 4](/docs/it/build-with-claude/prompt-engineering/claude-4-best-practices).

### Strumento editor di testo aggiornato

Lo strumento editor di testo è stato aggiornato per i modelli Claude 4 con le seguenti modifiche:

- **Tipo di strumento**: `text_editor_20250728`
- **Nome dello strumento**: `str_replace_based_edit_tool`
- Il comando `undo_edit` non è più supportato

<Note>
Lo strumento editor di testo `str_replace_editor` rimane lo stesso per Claude Sonnet 3.7.
</Note>

Se stai migrando da Claude Sonnet 3.7 e utilizzi lo strumento editor di testo:

```python
# Claude Sonnet 3.7
tools=[
    {
        "type": "text_editor_20250124",
        "name": "str_replace_editor"
    }
]

# Modelli Claude 4
tools=[
    {
        "type": "text_editor_20250728",
        "name": "str_replace_based_edit_tool"
    }
]
```

Per ulteriori informazioni, consulta la [documentazione dello strumento editor di testo](/docs/it/agents-and-tools/tool-use/text-editor-tool).

### Strumento di esecuzione del codice aggiornato

Se stai utilizzando lo strumento di esecuzione del codice, assicurati di utilizzare la versione più recente `code_execution_20250825`, che aggiunge comandi Bash e capacità di manipolazione dei file.

La versione legacy `code_execution_20250522` (solo Python) è ancora disponibile ma non consigliata per le nuove implementazioni.

Per le istruzioni di migrazione, consulta la [documentazione dello strumento di esecuzione del codice](/docs/it/agents-and-tools/tool-use/code-execution-tool#upgrade-to-latest-tool-version).

## Prezzi e disponibilità

### Prezzi

I modelli Claude 4.5 mantengono prezzi competitivi:

| Modello | Input | Output |
|-------|-------|--------|
| Claude Opus 4.5 | $5 per milione di token | $25 per milione di token |
| Claude Sonnet 4.5 | $3 per milione di token | $15 per milione di token |
| Claude Haiku 4.5 | $1 per milione di token | $5 per milione di token |

Per ulteriori dettagli, consulta la [documentazione dei prezzi](/docs/it/about-claude/pricing).

### Prezzi delle piattaforme di terze parti

A partire dai modelli Claude 4.5 (Opus 4.5, Sonnet 4.5 e Haiku 4.5), AWS Bedrock e Google Vertex AI offrono due tipi di endpoint:

- **Endpoint globali**: Routing dinamico per la massima disponibilità
- **Endpoint regionali**: Routing dei dati garantito attraverso regioni geografiche specifiche con un **premio di prezzo del 10%**

**Questo prezzo regionale si applica a tutti i modelli Claude 4.5: Opus 4.5, Sonnet 4.5 e Haiku 4.5.**

**L'API Claude (1P) è globale per impostazione predefinita e non è interessata da questo cambiamento.** L'API Claude è solo globale (equivalente all'offerta e ai prezzi dell'endpoint globale di altri provider).

Per i dettagli di implementazione e la guida alla migrazione:
- [Endpoint globali vs regionali di AWS Bedrock](/docs/it/build-with-claude/claude-on-amazon-bedrock#global-vs-regional-endpoints)
- [Endpoint globali vs regionali di Google Vertex AI](/docs/it/build-with-claude/claude-on-vertex-ai#global-vs-regional-endpoints)

### Disponibilità

I modelli Claude 4.5 sono disponibili su:

| Modello | Claude API | Amazon Bedrock | Google Cloud Vertex AI |
|-------|-----------|----------------|------------------------|
| Claude Opus 4.5 | `claude-opus-4-5-20251101` | `anthropic.claude-opus-4-5-20251101-v1:0` | `claude-opus-4-5@20251101` |
| Claude Sonnet 4.5 | `claude-sonnet-4-5-20250929` | `anthropic.claude-sonnet-4-5-20250929-v1:0` | `claude-sonnet-4-5@20250929` |
| Claude Haiku 4.5 | `claude-haiku-4-5-20251001` | `anthropic.claude-haiku-4-5-20251001-v1:0` | `claude-haiku-4-5@20251001` |

Disponibile anche tramite le piattaforme Claude.ai e Claude Code.

## Guida alla migrazione

I cambiamenti di rilievo e i requisiti di migrazione variano a seconda dal modello da cui stai eseguendo l'upgrade. Per istruzioni di migrazione dettagliate, incluse guide passo dopo passo, cambiamenti di rilievo e liste di controllo della migrazione, consulta [Migrazione a Claude 4.5](/docs/it/about-claude/models/migrating-to-claude-4).

La guida alla migrazione copre i seguenti scenari:
- **Claude Sonnet 3.7 → Sonnet 4.5**: Percorso di migrazione completo con cambiamenti di rilievo
- **Claude Haiku 3.5 → Haiku 4.5**: Percorso di migrazione completo con cambiamenti di rilievo
- **Claude Sonnet 4 → Sonnet 4.5**: Upgrade rapido con modifiche minime
- **Claude Opus 4.1 → Sonnet 4.5**: Upgrade senza problemi senza cambiamenti di rilievo
- **Claude Opus 4.1 → Opus 4.5**: Upgrade senza problemi senza cambiamenti di rilievo
- **Claude Opus 4.5 → Sonnet 4.5**: Downgrade senza problemi senza cambiamenti di rilievo

## Passaggi successivi

<CardGroup cols={3}>
  <Card title="Best practice" icon="lightbulb" href="/docs/it/build-with-claude/prompt-engineering/claude-4-best-practices">
    Scopri le tecniche di prompt engineering per i modelli Claude 4.5
  </Card>
  <Card title="Panoramica dei modelli" icon="table" href="/docs/it/about-claude/models/overview">
    Confronta i modelli Claude 4.5 con altri modelli Claude
  </Card>
  <Card title="Guida alla migrazione" icon="arrow-right-arrow-left" href="/docs/it/about-claude/models/migrating-to-claude-4">
    Esegui l'upgrade dai modelli precedenti
  </Card>
</CardGroup>