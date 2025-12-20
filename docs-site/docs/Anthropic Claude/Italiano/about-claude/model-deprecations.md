# Deprecazioni dei modelli

Informazioni sulle deprecazioni dei modelli API di Anthropic, con date di ritiro e modelli di sostituzione consigliati.

---

Con il lancio di modelli più sicuri e capaci, ritiriamo regolarmente i modelli più vecchi. Le applicazioni che si basano sui modelli Anthropic potrebbero necessitare di aggiornamenti occasionali per continuare a funzionare. I clienti interessati riceveranno sempre una notifica via email e nella nostra documentazione.

Questa pagina elenca tutte le deprecazioni dell'API, insieme alle sostituzioni consigliate.

## Panoramica

Anthropic utilizza i seguenti termini per descrivere il ciclo di vita dei nostri modelli:
- **Attivo**: Il modello è completamente supportato e consigliato per l'uso.
- **Legacy**: Il modello non riceverà più aggiornamenti e potrebbe essere deprecato in futuro.
- **Deprecato**: Il modello non è più disponibile per i nuovi clienti ma continua a essere disponibile per gli utenti esistenti fino al ritiro. Assegniamo una data di ritiro a questo punto.
- **Ritirato**: Il modello non è più disponibile per l'uso. Le richieste ai modelli ritirati avranno esito negativo.

<Warning>
Si prega di notare che i modelli deprecati potrebbero essere meno affidabili dei modelli attivi. Ti invitiamo a trasferire i carichi di lavoro ai modelli attivi per mantenere il massimo livello di supporto e affidabilità.
</Warning>

## Migrazione alle sostituzioni

Una volta che un modello è deprecato, esegui la migrazione di tutto l'utilizzo a una sostituzione adatta prima della data di ritiro. Le richieste ai modelli dopo la data di ritiro avranno esito negativo.

Per aiutare a misurare le prestazioni dei modelli di sostituzione sulle tue attività, consigliamo un test approfondito delle tue applicazioni con i nuovi modelli ben prima della data di ritiro.

Per istruzioni specifiche sulla migrazione da Claude 3.7 a modelli Claude 4.5, vedi [Migrazione a Claude 4.5](/docs/it/about-claude/models/migrating-to-claude-4).

## Notifiche

Anthropic notifica i clienti con distribuzioni attive per i modelli con ritiri imminenti. Forniamo almeno 60 giorni di preavviso prima del ritiro del modello per i modelli rilasciati pubblicamente.

## Audit dell'utilizzo del modello

Per aiutare a identificare l'utilizzo di modelli deprecati, i clienti possono accedere a un audit del loro utilizzo dell'API. Segui questi passaggi:

1. Vai alla pagina [Utilizzo](/settings/usage) in Console
2. Fai clic sul pulsante "Esporta"
3. Rivedi il CSV scaricato per visualizzare l'utilizzo suddiviso per chiave API e modello

Questo audit ti aiuterà a individuare eventuali istanze in cui la tua applicazione sta ancora utilizzando modelli deprecati, permettendoti di dare priorità agli aggiornamenti ai modelli più recenti prima della data di ritiro.

## Best practice

1. Controlla regolarmente la nostra documentazione per gli aggiornamenti sulle deprecazioni dei modelli.
2. Testa le tue applicazioni con modelli più recenti ben prima della data di ritiro del tuo modello attuale.
3. Aggiorna il tuo codice per utilizzare il modello di sostituzione consigliato il prima possibile.
4. Contatta il nostro team di supporto se hai bisogno di assistenza con la migrazione o hai domande.

## Svantaggi della deprecazione e mitigazioni

Attualmente deprecamo e ritiriamo i modelli per garantire capacità per i nuovi rilasci di modelli. Riconosciamo che ciò comporta degli svantaggi:
- Gli utenti che apprezzano modelli specifici devono migrare a nuove versioni
- I ricercatori perdono l'accesso ai modelli per studi in corso e comparativi
- Il ritiro del modello introduce rischi legati alla sicurezza e al benessere del modello

Ad un certo punto, speriamo di rendere nuovamente disponibili pubblicamente i modelli passati. Nel frattempo, ci siamo impegnati nella conservazione a lungo termine dei pesi dei modelli e in altre misure per aiutare a mitigare questi impatti. Per ulteriori dettagli, vedi [Impegni sulla deprecazione e conservazione dei modelli](https://www.anthropic.com/research/deprecation-commitments).

## Stato del modello

Tutti i modelli rilasciati pubblicamente sono elencati di seguito con il loro stato:

| Nome del modello API        | Stato attuale       | Deprecato         | Data di ritiro provvisoria |
|:----------------------------|:--------------------|:------------------|:-------------------------|
| `claude-3-opus-20240229`    | Deprecato           | 30 giugno 2025    | 5 gennaio 2026           |
| `claude-3-haiku-20240307`   | Attivo              | N/A               | Non prima del 7 marzo 2025 |
| `claude-3-5-haiku-20241022` | Attivo              | N/A               | Non prima del 22 ottobre 2025 |
| `claude-3-7-sonnet-20250219`| Deprecato           | 28 ottobre 2025   | 19 febbraio 2026         |
| `claude-sonnet-4-20250514`  | Attivo              | N/A               | Non prima del 14 maggio 2026 |
| `claude-opus-4-20250514`    | Attivo              | N/A               | Non prima del 14 maggio 2026 |
| `claude-opus-4-1-20250805`  | Attivo              | N/A               | Non prima del 5 agosto 2026 |
| `claude-sonnet-4-5-20250929`| Attivo              | N/A               | Non prima del 29 settembre 2026 |
| `claude-haiku-4-5-20251001` | Attivo              | N/A               | Non prima del 15 ottobre 2026 |
| `claude-opus-4-5-20251101`  | Attivo              | N/A               | Non prima del 24 novembre 2026 |

## Cronologia delle deprecazioni

Tutte le deprecazioni sono elencate di seguito, con gli annunci più recenti in alto.

### 2025-10-28: Modello Claude Sonnet 3.7

Il 28 ottobre 2025, abbiamo notificato agli sviluppatori che utilizzano il modello Claude Sonnet 3.7 del suo imminente ritiro dall'API Claude.

| Data di ritiro              | Modello deprecato           | Sostituzione consigliata        |
|:----------------------------|:----------------------------|:--------------------------------|
| 19 febbraio 2026            | `claude-3-7-sonnet-20250219`| `claude-sonnet-4-5-20250929`     |

### 2025-08-13: Modelli Claude Sonnet 3.5

<Note>
Questi modelli sono stati ritirati il 28 ottobre 2025.
</Note>

Il 13 agosto 2025, abbiamo notificato agli sviluppatori che utilizzano i modelli Claude Sonnet 3.5 del loro imminente ritiro.

| Data di ritiro              | Modello deprecato           | Sostituzione consigliata        |
|:----------------------------|:----------------------------|:--------------------------------|
| 28 ottobre 2025             | `claude-3-5-sonnet-20240620`| `claude-sonnet-4-5-20250929`     |
| 28 ottobre 2025             | `claude-3-5-sonnet-20241022`| `claude-sonnet-4-5-20250929`     |

### 2025-06-30: Modello Claude Opus 3

Il 30 giugno 2025, abbiamo notificato agli sviluppatori che utilizzano il modello Claude Opus 3 del suo imminente ritiro.

| Data di ritiro              | Modello deprecato           | Sostituzione consigliata        |
|:----------------------------|:----------------------------|:--------------------------------|
| 5 gennaio 2026              | `claude-3-opus-20240229`    | `claude-opus-4-1-20250805`      |

### 2025-01-21: Modelli Claude 2, Claude 2.1 e Claude Sonnet 3

<Note>
Questi modelli sono stati ritirati il 21 luglio 2025.
</Note>

Il 21 gennaio 2025, abbiamo notificato agli sviluppatori che utilizzano i modelli Claude 2, Claude 2.1 e Claude Sonnet 3 dei loro imminenti ritiri.

| Data di ritiro              | Modello deprecato           | Sostituzione consigliata        |
|:----------------------------|:----------------------------|:--------------------------------|
| 21 luglio 2025              | `claude-2.0`                | `claude-sonnet-4-5-20250929`      |
| 21 luglio 2025              | `claude-2.1`                | `claude-sonnet-4-5-20250929`      |
| 21 luglio 2025              | `claude-3-sonnet-20240229`  | `claude-sonnet-4-5-20250929`      |

### 2024-09-04: Modelli Claude 1 e Instant

<Note>
Questi modelli sono stati ritirati il 6 novembre 2024.
</Note>

Il 4 settembre 2024, abbiamo notificato agli sviluppatori che utilizzano i modelli Claude 1 e Instant dei loro imminenti ritiri.

| Data di ritiro              | Modello deprecato         | Sostituzione consigliata   |
|:----------------------------|:--------------------------|:---------------------------|
| 6 novembre 2024             | `claude-1.0`              | `claude-3-5-haiku-20241022`|
| 6 novembre 2024             | `claude-1.1`              | `claude-3-5-haiku-20241022`|
| 6 novembre 2024             | `claude-1.2`              | `claude-3-5-haiku-20241022`|
| 6 novembre 2024             | `claude-1.3`              | `claude-3-5-haiku-20241022`|
| 6 novembre 2024             | `claude-instant-1.0`      | `claude-3-5-haiku-20241022`|
| 6 novembre 2024             | `claude-instant-1.1`      | `claude-3-5-haiku-20241022`|
| 6 novembre 2024             | `claude-instant-1.2`      | `claude-3-5-haiku-20241022`|