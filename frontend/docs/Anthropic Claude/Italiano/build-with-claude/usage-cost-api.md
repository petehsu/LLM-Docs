# API di utilizzo e costo

Accedi programmaticamente ai dati di utilizzo dell'API e ai costi della tua organizzazione con l'API di amministrazione per utilizzo e costo.

---

<Tip>
**The Admin API is unavailable for individual accounts.** To collaborate with teammates and add members, set up your organization in **Console → Settings → Organization**.
</Tip>

L'API di amministrazione per utilizzo e costo fornisce accesso programmatico e granulare ai dati storici di utilizzo dell'API e ai costi per la tua organizzazione. Questi dati sono simili alle informazioni disponibili nelle pagine [Utilizzo](/usage) e [Costo](/cost) della Claude Console.

Questa API ti consente di monitorare, analizzare e ottimizzare meglio le tue implementazioni di Claude:

* **Tracciamento accurato dell'utilizzo:** Ottieni conteggi precisi dei token e modelli di utilizzo invece di affidarti esclusivamente al conteggio dei token di risposta
* **Riconciliazione dei costi:** Abbina i record interni con la fatturazione di Anthropic per i team di finanza e contabilità
* **Prestazioni e miglioramento del prodotto:** Monitora le prestazioni del prodotto mentre misuri se i cambiamenti al sistema le hanno migliorate, o configura avvisi
* **Ottimizzazione dei [limiti di velocità](/docs/it/api/rate-limits) e del [livello di priorità](/docs/it/api/service-tiers#get-started-with-priority-tier):** Ottimizza funzionalità come la [memorizzazione in cache dei prompt](/docs/it/build-with-claude/prompt-caching) o prompt specifici per sfruttare al massimo la capacità allocata, o acquista capacità dedicata.
* **Analisi avanzata:** Esegui analisi dei dati più approfondite rispetto a quelle disponibili in Console

<Check>
  **Chiave API di amministrazione richiesta**
  
  Questa API fa parte dell'[API di amministrazione](/docs/it/build-with-claude/administration-api). Questi endpoint richiedono una chiave API di amministrazione (che inizia con `sk-ant-admin...`) che differisce dalle chiavi API standard. Solo i membri dell'organizzazione con il ruolo di amministratore possono fornire chiavi API di amministrazione tramite la [Claude Console](/settings/admin-keys).
</Check>

## Soluzioni partner

Le principali piattaforme di osservabilità offrono integrazioni pronte all'uso per monitorare l'utilizzo e i costi dell'API Claude, senza scrivere codice personalizzato. Queste integrazioni forniscono dashboard, avvisi e analitiche per aiutarti a gestire l'utilizzo dell'API in modo efficace.

<CardGroup cols={3}>
  <Card title="CloudZero" icon="chart" href="https://docs.cloudzero.com/docs/connections-anthropic">
    Piattaforma di intelligenza cloud per il tracciamento e la previsione dei costi
  </Card>
  <Card title="Datadog" icon="chart" href="https://docs.datadoghq.com/integrations/anthropic/">
    Osservabilità LLM con tracciamento e monitoraggio automatici
  </Card>
  <Card title="Grafana Cloud" icon="chart" href="https://grafana.com/docs/grafana-cloud/monitor-infrastructure/integrations/integration-reference/integration-anthropic/">
    Integrazione senza agenti per facile osservabilità LLM con dashboard e avvisi pronti all'uso
  </Card>
  <Card title="Honeycomb" icon="polygon" href="https://docs.honeycomb.io/integrations/anthropic-usage-monitoring/">
    Query avanzate e visualizzazione tramite OpenTelemetry
  </Card>
  <Card title="Vantage" icon="chart" href="https://docs.vantage.sh/connecting_anthropic">
    Piattaforma FinOps per l'osservabilità dei costi e dell'utilizzo di LLM
  </Card>
</CardGroup>

## Avvio rapido

Ottieni l'utilizzo giornaliero della tua organizzazione degli ultimi 7 giorni:

```bash
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-08T00:00:00Z&\
ending_at=2025-01-15T00:00:00Z&\
bucket_width=1d" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

<Tip>
  **Imposta un'intestazione User-Agent per le integrazioni**
  
  Se stai creando un'integrazione, imposta l'intestazione User-Agent per aiutarci a comprendere i modelli di utilizzo:
  ```
  User-Agent: YourApp/1.0.0 (https://yourapp.com)
  ```
</Tip>

## API di utilizzo

Traccia il consumo di token in tutta la tua organizzazione con suddivisioni dettagliate per modello, workspace e livello di servizio con l'endpoint `/v1/organizations/usage_report/messages`.

### Concetti chiave

- **Bucket di tempo**: Aggrega i dati di utilizzo in intervalli fissi (`1m`, `1h` o `1d`)
- **Tracciamento dei token**: Misura i token di input non memorizzati in cache, input memorizzati in cache, creazione della cache e token di output
- **Filtro e raggruppamento**: Filtra per chiave API, workspace, modello, livello di servizio o finestra di contesto, e raggruppa i risultati per queste dimensioni
- **Utilizzo di strumenti server**: Traccia l'utilizzo di strumenti lato server come la ricerca web

Per i dettagli completi dei parametri e gli schemi di risposta, consulta il [riferimento dell'API di utilizzo](/docs/it/api/admin-api/usage-cost/get-messages-usage-report).

### Esempi di base

#### Utilizzo giornaliero per modello

```bash
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-01T00:00:00Z&\
ending_at=2025-01-08T00:00:00Z&\
group_by[]=model&\
bucket_width=1d" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

#### Utilizzo orario con filtro

```bash
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-15T00:00:00Z&\
ending_at=2025-01-15T23:59:59Z&\
models[]=claude-sonnet-4-5-20250929&\
service_tiers[]=batch&\
context_window[]=0-200k&\
bucket_width=1h" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

#### Filtra l'utilizzo per chiavi API e workspace

```bash
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-01T00:00:00Z&\
ending_at=2025-01-08T00:00:00Z&\
api_key_ids[]=apikey_01Rj2N8SVvo6BePZj99NhmiT&\
api_key_ids[]=apikey_01ABC123DEF456GHI789JKL&\
workspace_ids[]=wrkspc_01JwQvzr7rXLA5AGx3HKfFUJ&\
workspace_ids[]=wrkspc_01XYZ789ABC123DEF456MNO&\
bucket_width=1d" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

<Tip>
Per recuperare gli ID delle chiavi API della tua organizzazione, utilizza l'endpoint [Elenca chiavi API](/docs/it/api/admin-api/apikeys/list-api-keys).

Per recuperare gli ID dei workspace della tua organizzazione, utilizza l'endpoint [Elenca workspace](/docs/it/api/admin-api/workspaces/list-workspaces), o trova gli ID dei workspace della tua organizzazione nella Console Anthropic.
</Tip>

### Limiti di granularità temporale

| Granularità | Limite predefinito | Limite massimo | Caso d'uso |
|-------------|---------------|---------------|----------|
| `1m` | 60 bucket | 1440 bucket | Monitoraggio in tempo reale |
| `1h` | 24 bucket | 168 bucket | Modelli giornalieri |
| `1d` | 7 bucket | 31 bucket | Report settimanali/mensili |

## API di costo

Recupera suddivisioni dei costi a livello di servizio in USD con l'endpoint `/v1/organizations/cost_report`.

### Concetti chiave

- **Valuta**: Tutti i costi in USD, riportati come stringhe decimali in unità più basse (centesimi)
- **Tipi di costo**: Traccia i costi di utilizzo dei token, ricerca web ed esecuzione del codice
- **Raggruppamento**: Raggruppa i costi per workspace o descrizione per suddivisioni dettagliate
- **Bucket di tempo**: Solo granularità giornaliera (`1d`)

Per i dettagli completi dei parametri e gli schemi di risposta, consulta il [riferimento dell'API di costo](/docs/it/api/admin-api/usage-cost/get-cost-report).

<Warning>
  I costi del livello di priorità utilizzano un modello di fatturazione diverso e non sono inclusi nell'endpoint dei costi. Traccia l'utilizzo del livello di priorità tramite l'endpoint di utilizzo.
</Warning>

### Esempio di base

```bash
curl "https://api.anthropic.com/v1/organizations/cost_report?\
starting_at=2025-01-01T00:00:00Z&\
ending_at=2025-01-31T00:00:00Z&\
group_by[]=workspace_id&\
group_by[]=description" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

## Paginazione

Entrambi gli endpoint supportano la paginazione per set di dati di grandi dimensioni:

1. Effettua la tua richiesta iniziale
2. Se `has_more` è `true`, utilizza il valore `next_page` nella tua richiesta successiva
3. Continua finché `has_more` non è `false`

```bash
# Prima richiesta
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-01T00:00:00Z&\
ending_at=2025-01-31T00:00:00Z&\
limit=7" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"

# La risposta include: "has_more": true, "next_page": "page_xyz..."

# Richiesta successiva con paginazione
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-01T00:00:00Z&\
ending_at=2025-01-31T00:00:00Z&\
limit=7&\
page=page_xyz..." \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

## Casi d'uso comuni

Esplora implementazioni dettagliate in [anthropic-cookbook](https://github.com/anthropics/anthropic-cookbook):

- **Report di utilizzo giornaliero**: Traccia i trend di consumo dei token
- **Attribuzione dei costi**: Alloca le spese per workspace per addebiti
- **Efficienza della cache**: Misura e ottimizza la memorizzazione in cache dei prompt
- **Monitoraggio del budget**: Configura avvisi per soglie di spesa
- **Esportazione CSV**: Genera report per i team di finanza

## Domande frequenti

### Quanto sono freschi i dati?
I dati di utilizzo e costo in genere compaiono entro 5 minuti dal completamento della richiesta API, anche se i ritardi possono occasionalmente essere più lunghi.

### Quale frequenza di polling è consigliata?
L'API supporta il polling una volta al minuto per l'uso sostenuto. Per brevi burst (ad es. download di dati paginati), il polling più frequente è accettabile. Memorizza in cache i risultati per i dashboard che richiedono aggiornamenti frequenti.

### Come tracciare l'utilizzo dell'esecuzione del codice?
I costi di esecuzione del codice compaiono nell'endpoint dei costi raggruppati sotto `Code Execution Usage` nel campo descrizione. L'esecuzione del codice non è inclusa nell'endpoint di utilizzo.

### Come tracciare l'utilizzo del livello di priorità?
Filtra o raggruppa per `service_tier` nell'endpoint di utilizzo e cerca il valore `priority`. I costi del livello di priorità non sono disponibili nell'endpoint dei costi.

### Cosa succede con l'utilizzo di Workbench?
L'utilizzo dell'API da Workbench non è associato a una chiave API, quindi `api_key_id` sarà `null` anche quando si raggruppa per quella dimensione.

### Come è rappresentato il workspace predefinito?
L'utilizzo e i costi attribuiti al workspace predefinito hanno un valore `null` per `workspace_id`.

### Come ottengo suddivisioni dei costi per utente per Claude Code?

Utilizza l'[API di analitiche di Claude Code](/docs/it/build-with-claude/claude-code-analytics-api), che fornisce costi stimati per utente e metriche di produttività senza i limiti di prestazioni della suddivisione dei costi per molte chiavi API. Per l'utilizzo generale dell'API con molte chiavi, utilizza l'[API di utilizzo](#usage-api) per tracciare il consumo di token come proxy dei costi.

## Vedi anche
Le API di utilizzo e costo possono essere utilizzate per aiutarti a fornire un'esperienza migliore ai tuoi utenti, aiutarti a gestire i costi e preservare il tuo limite di velocità. Scopri di più su alcune di queste altre funzionalità:

- [Panoramica dell'API di amministrazione](/docs/it/build-with-claude/administration-api)
- [Riferimento dell'API di amministrazione](/docs/it/api/admin)
- [Prezzi](/docs/it/about-claude/pricing)
- [Memorizzazione in cache dei prompt](/docs/it/build-with-claude/prompt-caching) - Ottimizza i costi con la memorizzazione in cache
- [Elaborazione batch](/docs/it/build-with-claude/batch-processing) - Sconto del 50% sulle richieste batch
- [Limiti di velocità](/docs/it/api/rate-limits) - Comprendi i livelli di utilizzo