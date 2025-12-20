# Migrazione a Claude 4.5

Guida alla migrazione a Claude 4.5 con istruzioni passo dopo passo e modifiche critiche chiaramente indicate

---

Questa guida copre due percorsi di migrazione chiave verso i modelli Claude 4.5:

- **Claude Sonnet 3.7 → Claude Sonnet 4.5**: Il nostro modello più intelligente con ragionamento, codifica e capacità di agenti a lungo termine di classe mondiale
- **Claude Haiku 3.5 → Claude Haiku 4.5**: Il nostro modello Haiku più veloce e intelligente con prestazioni quasi di frontiera per applicazioni in tempo reale ed elaborazione intelligente ad alto volume

Entrambe le migrazioni comportano modifiche critiche che richiedono aggiornamenti alla tua implementazione. Questa guida ti guiderà attraverso ogni percorso di migrazione con istruzioni passo dopo passo e modifiche critiche chiaramente indicate.

Prima di iniziare la migrazione, ti consigliamo di rivedere [Novità in Claude 4.5](/docs/it/about-claude/models/whats-new-claude-4-5) per comprendere le nuove funzionalità e capacità disponibili in questi modelli, incluso il pensiero esteso, la consapevolezza del contesto e i miglioramenti comportamentali.

## Migrazione da Claude Sonnet 3.7 a Claude Sonnet 4.5

Claude Sonnet 4.5 è il nostro modello più intelligente, che offre prestazioni di classe mondiale per ragionamento, codifica e agenti autonomi a lungo termine. Questa migrazione include diverse modifiche critiche che richiedono aggiornamenti alla tua implementazione.

### Passaggi di migrazione

1. **Aggiorna il nome del modello:**
   ```python
   # Prima (Claude Sonnet 3.7)
   model="claude-3-7-sonnet-20250219"

   # Dopo (Claude Sonnet 4.5)
   model="claude-sonnet-4-5-20250929"
   ```

2. **Aggiorna i parametri di campionamento**

   <Warning>
   Questa è una modifica critica rispetto a Claude Sonnet 3.7.
   </Warning>

   Usa solo `temperature` O `top_p`, non entrambi:

   ```python
   # Prima (Claude Sonnet 3.7) - Questo darà errore in Sonnet 4.5
   response = client.messages.create(
       model="claude-3-7-sonnet-20250219",
       temperature=0.7,
       top_p=0.9,  # Non puoi usare entrambi
       ...
   )

   # Dopo (Claude Sonnet 4.5)
   response = client.messages.create(
       model="claude-sonnet-4-5-20250929",
       temperature=0.7,  # Usa temperature O top_p, non entrambi
       ...
   )
   ```

3. **Gestisci il nuovo motivo di arresto `refusal`**

   Aggiorna la tua applicazione per [gestire i motivi di arresto `refusal`](/docs/it/test-and-evaluate/strengthen-guardrails/handle-streaming-refusals):

   ```python
   response = client.messages.create(...)

   if response.stop_reason == "refusal":
       # Gestisci il rifiuto in modo appropriato
       pass
   ```

4. **Aggiorna lo strumento editor di testo (se applicabile)**

   <Warning>
   Questa è una modifica critica rispetto a Claude Sonnet 3.7.
   </Warning>

   Aggiorna a `text_editor_20250728` (tipo) e `str_replace_based_edit_tool` (nome). Rimuovi qualsiasi codice che utilizza il comando `undo_edit`.
   
   ```python
   # Prima (Claude Sonnet 3.7)
   tools=[{"type": "text_editor_20250124", "name": "str_replace_editor"}]

   # Dopo (Claude Sonnet 4.5)
   tools=[{"type": "text_editor_20250728", "name": "str_replace_based_edit_tool"}]
   ```

   Vedi [Documentazione dello strumento editor di testo](/docs/it/agents-and-tools/tool-use/text-editor-tool) per i dettagli.

5. **Aggiorna lo strumento di esecuzione del codice (se applicabile)**

   Aggiorna a `code_execution_20250825`. La versione legacy `code_execution_20250522` funziona ancora ma non è consigliata. Vedi [Documentazione dello strumento di esecuzione del codice](/docs/it/agents-and-tools/tool-use/code-execution-tool#upgrade-to-latest-tool-version) per le istruzioni di migrazione.

6. **Rimuovi l'intestazione beta per l'uso efficiente dei token**

   L'uso efficiente dei token è una funzionalità beta che funziona solo con Claude 3.7 Sonnet. Tutti i modelli Claude 4 hanno l'uso efficiente dei token integrato, quindi non dovresti più includere l'intestazione beta.

   Rimuovi l'[intestazione beta](/docs/it/api/beta-headers) `token-efficient-tools-2025-02-19` dalle tue richieste:

   ```python
   # Prima (Claude Sonnet 3.7)
   client.messages.create(
       model="claude-3-7-sonnet-20250219",
       betas=["token-efficient-tools-2025-02-19"],  # Rimuovi questo
       ...
   )

   # Dopo (Claude Sonnet 4.5)
   client.messages.create(
       model="claude-sonnet-4-5-20250929",
       # Nessuna intestazione beta token-efficient-tools
       ...
   )
   ```

7. **Rimuovi l'intestazione beta per l'output esteso**

   L'[intestazione beta](/docs/it/api/beta-headers) `output-128k-2025-02-19` per l'output esteso è disponibile solo in Claude Sonnet 3.7.

   Rimuovi questa intestazione dalle tue richieste:

   ```python
   # Prima (Claude Sonnet 3.7)
   client.messages.create(
       model="claude-3-7-sonnet-20250219",
       betas=["output-128k-2025-02-19"],  # Rimuovi questo
       ...
   )

   # Dopo (Claude Sonnet 4.5)
   client.messages.create(
       model="claude-sonnet-4-5-20250929",
       # Nessuna intestazione beta output-128k
       ...
   )
   ```

8. **Aggiorna i tuoi prompt per i cambiamenti comportamentali**

   Claude Sonnet 4.5 ha uno stile di comunicazione più conciso e diretto e richiede una direzione esplicita. Rivedi [le migliori pratiche di ingegneria dei prompt Claude 4](/docs/it/build-with-claude/prompt-engineering/claude-4-best-practices) per una guida all'ottimizzazione.

9. **Considera di abilitare il pensiero esteso per compiti complessi**

   Abilita il [pensiero esteso](/docs/it/build-with-claude/extended-thinking) per miglioramenti significativi delle prestazioni su compiti di codifica e ragionamento (disabilitato per impostazione predefinita):

   ```python
   response = client.messages.create(
       model="claude-sonnet-4-5-20250929",
       max_tokens=16000,
       thinking={"type": "enabled", "budget_tokens": 10000},
       messages=[...]
   )
   ```

   <Note>
   Il pensiero esteso influisce sull'efficienza della [cache dei prompt](/docs/it/build-with-claude/prompt-caching#caching-with-thinking-blocks).
   </Note>

10. **Testa la tua implementazione**

   Testa in un ambiente di sviluppo prima di distribuire in produzione per assicurarti che tutte le modifiche critiche siano gestite correttamente.

### Checklist di migrazione da Sonnet 3.7 → 4.5

- [ ] Aggiorna l'ID del modello a `claude-sonnet-4-5-20250929`
- [ ] **CRITICO**: Aggiorna i parametri di campionamento per usare solo `temperature` O `top_p`, non entrambi
- [ ] Gestisci il nuovo motivo di arresto `refusal` nella tua applicazione
- [ ] **CRITICO**: Aggiorna lo strumento editor di testo a `text_editor_20250728` e `str_replace_based_edit_tool` (se applicabile)
- [ ] **CRITICO**: Rimuovi qualsiasi codice che utilizza il comando `undo_edit` (se applicabile)
- [ ] Aggiorna lo strumento di esecuzione del codice a `code_execution_20250825` (se applicabile)
- [ ] Rimuovi l'intestazione beta `token-efficient-tools-2025-02-19` (se applicabile)
- [ ] Rimuovi l'intestazione beta `output-128k-2025-02-19` (se applicabile)
- [ ] Rivedi e aggiorna i prompt seguendo le [migliori pratiche Claude 4](/docs/it/build-with-claude/prompt-engineering/claude-4-best-practices)
- [ ] Considera di abilitare il pensiero esteso per compiti di ragionamento complesso
- [ ] Gestisci il motivo di arresto `model_context_window_exceeded` (specifico di Sonnet 4.5)
- [ ] Considera di abilitare lo strumento di memoria per agenti a lungo termine (beta)
- [ ] Considera di usare la cancellazione automatica delle chiamate di strumento per la modifica del contesto (beta)
- [ ] Testa in ambiente di sviluppo prima della distribuzione in produzione

### Funzionalità rimosse da Claude Sonnet 3.7

- **Uso efficiente dei token**: L'intestazione beta `token-efficient-tools-2025-02-19` funziona solo con Claude 3.7 Sonnet e non è supportata nei modelli Claude 4 (vedi passaggio 6)
- **Output esteso**: L'intestazione beta `output-128k-2025-02-19` non è supportata (vedi passaggio 7)

Entrambe le intestazioni possono essere incluse nelle richieste Claude 4 ma non avranno alcun effetto.

## Migrazione da Claude Haiku 3.5 a Claude Haiku 4.5

Claude Haiku 4.5 è il nostro modello Haiku più veloce e intelligente con prestazioni quasi di frontiera, che offre qualità di modello premium con prestazioni in tempo reale per applicazioni interattive ed elaborazione intelligente ad alto volume. Questa migrazione include diverse modifiche critiche che richiedono aggiornamenti alla tua implementazione.

Per una panoramica completa delle nuove capacità, vedi [Novità in Claude 4.5](/docs/it/about-claude/models/whats-new-claude-4-5#key-improvements-in-haiku-4-5-over-haiku-3-5).

<Note>
Prezzi di Haiku 4.5: $1 per milione di token di input, $5 per milione di token di output. Vedi [Prezzi di Claude](/docs/it/about-claude/pricing) per i dettagli.
</Note>

### Passaggi di migrazione

1. **Aggiorna il nome del modello:**
   ```python
   # Prima (Haiku 3.5)
   model="claude-3-5-haiku-20241022"

   # Dopo (Haiku 4.5)
   model="claude-haiku-4-5-20251001"
   ```

2. **Aggiorna le versioni degli strumenti (se applicabile)**

   <Warning>
   Questa è una modifica critica rispetto a Claude Haiku 3.5.
   </Warning>

   Haiku 4.5 supporta solo le versioni più recenti degli strumenti:

   ```python
   # Prima (Haiku 3.5)
   tools=[{"type": "text_editor_20250124", "name": "str_replace_editor"}]

   # Dopo (Haiku 4.5)
   tools=[{"type": "text_editor_20250728", "name": "str_replace_based_edit_tool"}]
   ```

   - **Editor di testo**: Usa `text_editor_20250728` e `str_replace_based_edit_tool`
   - **Esecuzione del codice**: Usa `code_execution_20250825`
   - Rimuovi qualsiasi codice che utilizza il comando `undo_edit`

3. **Aggiorna i parametri di campionamento**

   <Warning>
   Questa è una modifica critica rispetto a Claude Haiku 3.5.
   </Warning>

   Usa solo `temperature` O `top_p`, non entrambi:

   ```python
   # Prima (Haiku 3.5) - Questo darà errore in Haiku 4.5
   response = client.messages.create(
       model="claude-3-5-haiku-20241022",
       temperature=0.7,
       top_p=0.9,  # Non puoi usare entrambi
       ...
   )

   # Dopo (Haiku 4.5)
   response = client.messages.create(
       model="claude-haiku-4-5-20251001",
       temperature=0.7,  # Usa temperature O top_p, non entrambi
       ...
   )
   ```

4. **Rivedi i nuovi limiti di velocità**

   Haiku 4.5 ha limiti di velocità separati da Haiku 3.5. Vedi [Documentazione dei limiti di velocità](/docs/it/api/rate-limits) per i dettagli.

5. **Gestisci il nuovo motivo di arresto `refusal`**

   Aggiorna la tua applicazione per [gestire i motivi di arresto refusal](/docs/it/test-and-evaluate/strengthen-guardrails/handle-streaming-refusals).

6. **Considera di abilitare il pensiero esteso per compiti complessi**

   Abilita il [pensiero esteso](/docs/it/build-with-claude/extended-thinking) per miglioramenti significativi delle prestazioni su compiti di codifica e ragionamento (disabilitato per impostazione predefinita):

   ```python
   response = client.messages.create(
       model="claude-haiku-4-5-20251001",
       max_tokens=16000,
       thinking={"type": "enabled", "budget_tokens": 5000},
       messages=[...]
   )
   ```
   <Note>
   Il pensiero esteso influisce sull'efficienza della [cache dei prompt](/docs/it/build-with-claude/prompt-caching#caching-with-thinking-blocks).
   </Note>

7. **Esplora le nuove capacità**

   Vedi [Novità in Claude 4.5](/docs/it/about-claude/models/whats-new-claude-4-5#key-improvements-in-haiku-4-5-over-haiku-3-5) per i dettagli sulla consapevolezza del contesto, capacità di output aumentata (64K token), intelligenza superiore e velocità migliorata.

8. **Testa la tua implementazione**

   Testa in un ambiente di sviluppo prima di distribuire in produzione per assicurarti che tutte le modifiche critiche siano gestite correttamente.

### Checklist di migrazione da Haiku 3.5 → 4.5

- [ ] Aggiorna l'ID del modello a `claude-haiku-4-5-20251001`
- [ ] **CRITICO**: Aggiorna le versioni degli strumenti alle più recenti (ad es. `text_editor_20250728`, `code_execution_20250825`) - le versioni legacy non sono supportate
- [ ] **CRITICO**: Rimuovi qualsiasi codice che utilizza il comando `undo_edit` (se applicabile)
- [ ] **CRITICO**: Aggiorna i parametri di campionamento per usare solo `temperature` O `top_p`, non entrambi
- [ ] Rivedi e regola per i nuovi limiti di velocità (separati da Haiku 3.5)
- [ ] Gestisci il nuovo motivo di arresto `refusal` nella tua applicazione
- [ ] Considera di abilitare il pensiero esteso per compiti di ragionamento complesso (nuova capacità)
- [ ] Sfrutta la consapevolezza del contesto per una migliore gestione dei token in sessioni lunghe
- [ ] Preparati per risposte più grandi (output massimo aumentato da 8K a 64K token)
- [ ] Rivedi e aggiorna i prompt seguendo le [migliori pratiche Claude 4](/docs/it/build-with-claude/prompt-engineering/claude-4-best-practices)
- [ ] Testa in ambiente di sviluppo prima della distribuzione in produzione

## Scelta tra Sonnet 4.5 e Haiku 4.5

Sia Claude Sonnet 4.5 che Claude Haiku 4.5 sono potenti modelli Claude 4 con punti di forza diversi:

### Scegli Claude Sonnet 4.5 (più intelligente) per:

- **Ragionamento e analisi complessi**: Intelligenza di classe mondiale per compiti sofisticati
- **Agenti autonomi a lungo termine**: Prestazioni superiori per agenti che lavorano indipendentemente per periodi estesi
- **Compiti di codifica avanzati**: Il nostro modello di codifica più forte con pianificazione avanzata e ingegneria della sicurezza
- **Flussi di lavoro con contesto ampio**: Gestione del contesto migliorata con strumento di memoria e capacità di modifica del contesto
- **Compiti che richiedono la massima capacità**: Quando l'intelligenza e l'accuratezza sono le priorità principali

### Scegli Claude Haiku 4.5 (più veloce e intelligente Haiku) per:

- **Applicazioni in tempo reale**: Tempi di risposta rapidi per esperienze utente interattive con prestazioni quasi di frontiera
- **Elaborazione intelligente ad alto volume**: Intelligenza conveniente su larga scala con velocità migliorata
- **Distribuzioni sensibili ai costi**: Prestazioni quasi di frontiera a prezzi inferiori
- **Architetture di sub-agenti**: Agenti veloci e intelligenti per sistemi multi-agente
- **Uso del computer su larga scala**: Automazione desktop e browser autonoma conveniente
- **Compiti che richiedono velocità**: Quando la bassa latenza è critica mantenendo un'intelligenza quasi di frontiera

### Raccomandazioni sul pensiero esteso

I modelli Claude 4, in particolare Sonnet e Haiku 4.5, mostrano miglioramenti significativi delle prestazioni quando si utilizza il [pensiero esteso](/docs/it/build-with-claude/extended-thinking) per compiti di codifica e ragionamento complesso. Il pensiero esteso è **disabilitato per impostazione predefinita** ma ti consigliamo di abilitarlo per il lavoro impegnativo.

**Importante**: Il pensiero esteso influisce sull'efficienza della [cache dei prompt](/docs/it/build-with-claude/prompt-caching#caching-with-thinking-blocks). Quando il contenuto non relativo ai risultati degli strumenti viene aggiunto a una conversazione, i blocchi di pensiero vengono rimossi dalla cache, il che può aumentare i costi nelle conversazioni multi-turno. Ti consigliamo di abilitare il pensiero quando i vantaggi di prestazione superano il compromesso della cache.

## Altri scenari di migrazione

I percorsi di migrazione primari coperti sopra (Sonnet 3.7 → 4.5 e Haiku 3.5 → 4.5) rappresentano gli aggiornamenti più comuni. Tuttavia, potresti migrare da altri modelli Claude a Claude 4.5. Questa sezione copre questi scenari.

### Migrazione da Claude Sonnet 4 → Sonnet 4.5

**Modifica critica**: Non puoi specificare sia `temperature` che `top_p` nella stessa richiesta.

Tutte le altre chiamate API funzioneranno senza modifiche. Aggiorna il tuo ID del modello e regola i parametri di campionamento se necessario:

```python
# Prima (Claude Sonnet 4)
model="claude-sonnet-4-20250514"

# Dopo (Claude Sonnet 4.5)
model="claude-sonnet-4-5-20250929"
```

### Migrazione da Claude Opus 4.1 → Sonnet 4.5

**Nessuna modifica critica.** Tutte le chiamate API funzioneranno senza modifiche.

Semplicemente aggiorna il tuo ID del modello:

```python
# Prima (Claude Opus 4.1)
model="claude-opus-4-1-20250805"

# Dopo (Claude Sonnet 4.5)
model="claude-sonnet-4-5-20250929"
```

Claude Sonnet 4.5 è il nostro modello più intelligente con ragionamento, codifica e capacità di agenti a lungo termine di classe mondiale. Offre prestazioni superiori rispetto a Opus 4.1 per la maggior parte dei casi d'uso.

### Migrazione da Claude Opus 4.1 → Opus 4.5

**Nessuna modifica critica.** Tutte le chiamate API funzioneranno senza modifiche.

Semplicemente aggiorna il tuo ID del modello:

```python
# Prima (Claude Opus 4.1)
model="claude-opus-4-1-20250805"

# Dopo (Claude Opus 4.5)
model="claude-opus-4-5-20251101"
```

Claude Opus 4.5 è il nostro modello più intelligente, che combina la massima capacità con prestazioni pratiche. Presenta miglioramenti significativi nella visione, codifica e uso del computer a un prezzo più accessibile rispetto a Opus 4.1. Ideale per compiti specializzati complessi e ingegneria del software professionale.

<Note>
Per basi di codice con molti riferimenti ai modelli, è disponibile un [plugin Claude Code](https://github.com/anthropics/claude-code/tree/main/plugins/claude-opus-4-5-migration) per automatizzare la migrazione a Opus 4.5.
</Note>

### Migrazione tra modelli Claude 4.5

**Nessuna modifica critica.** Tutte le chiamate API funzioneranno senza modifiche.

Semplicemente aggiorna il tuo ID del modello.

## Hai bisogno di aiuto?

- Controlla la nostra [documentazione API](/docs/it/api/overview) per le specifiche dettagliate
- Rivedi le [capacità dei modelli](/docs/it/about-claude/models/overview) per i confronti delle prestazioni
- Rivedi le [note di rilascio API](/docs/it/release-notes/api) per gli aggiornamenti API
- Contatta il supporto se riscontri problemi durante la migrazione