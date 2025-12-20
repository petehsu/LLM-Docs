# Prezzi

Scopri la struttura dei prezzi di Anthropic per i modelli e le funzionalità

---

Questa pagina fornisce informazioni dettagliate sui prezzi per i modelli e le funzionalità di Anthropic. Tutti i prezzi sono in USD.

Per le informazioni sui prezzi più attuali, visita [claude.com/pricing](https://claude.com/pricing).

## Prezzi dei modelli

La tabella seguente mostra i prezzi per tutti i modelli Claude in diversi livelli di utilizzo:

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
MTok = Milioni di token. La colonna "Base Input Tokens" mostra i prezzi di input standard, "Cache Writes" e "Cache Hits" sono specifici per [prompt caching](/docs/it/build-with-claude/prompt-caching), e "Output Tokens" mostra i prezzi di output. Il prompt caching offre durate della cache di 5 minuti (predefinita) e 1 ora per ottimizzare i costi per diversi casi d'uso.

La tabella sopra riflette i seguenti moltiplicatori di prezzo per il prompt caching:
- I token di scrittura della cache di 5 minuti sono 1,25 volte il prezzo dei token di input base
- I token di scrittura della cache di 1 ora sono 2 volte il prezzo dei token di input base
- I token di lettura della cache sono 0,1 volte il prezzo dei token di input base
</Note>

## Prezzi delle piattaforme di terze parti

I modelli Claude sono disponibili su [AWS Bedrock](/docs/it/build-with-claude/claude-on-amazon-bedrock), [Google Vertex AI](/docs/it/build-with-claude/claude-on-vertex-ai), e [Microsoft Foundry](/docs/it/build-with-claude/claude-in-microsoft-foundry). Per i prezzi ufficiali, visita:
- [Prezzi AWS Bedrock](https://aws.amazon.com/bedrock/pricing/)
- [Prezzi Google Vertex AI](https://cloud.google.com/vertex-ai/generative-ai/pricing)
- [Prezzi Microsoft Foundry](https://azure.microsoft.com/en-us/pricing/details/ai-foundry/#pricing)

<Note>
**Prezzi degli endpoint regionali per i modelli Claude 4.5 e successivi**

A partire da Claude Sonnet 4.5 e Haiku 4.5, AWS Bedrock e Google Vertex AI offrono due tipi di endpoint:
- **Endpoint globali**: Instradamento dinamico tra le regioni per la massima disponibilità
- **Endpoint regionali**: Instradamento dei dati garantito all'interno di regioni geografiche specifiche

Gli endpoint regionali includono un premio del 10% rispetto agli endpoint globali. **L'API Claude (1P) è globale per impostazione predefinita e non è interessata da questo cambiamento.** L'API Claude è solo globale (equivalente all'offerta di endpoint globale e ai prezzi di altri provider).

**Ambito**: Questa struttura di prezzo si applica a Claude Sonnet 4.5, Haiku 4.5 e a tutti i modelli futuri. I modelli precedenti (Claude Sonnet 4, Opus 4 e versioni precedenti) mantengono i loro prezzi esistenti.

Per i dettagli di implementazione e gli esempi di codice:
- [Endpoint globali e regionali di AWS Bedrock](/docs/it/build-with-claude/claude-on-amazon-bedrock#global-vs-regional-endpoints)
- [Endpoint globali e regionali di Google Vertex AI](/docs/it/build-with-claude/claude-on-vertex-ai#global-vs-regional-endpoints)
</Note>

## Prezzi specifici delle funzionalità

### Elaborazione in batch

L'API Batch consente l'elaborazione asincrona di grandi volumi di richieste con uno sconto del 50% sia sui token di input che di output.

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

Per ulteriori informazioni sull'elaborazione in batch, consulta la nostra [documentazione sull'elaborazione in batch](/docs/it/build-with-claude/batch-processing).

### Prezzi del contesto lungo

Quando si utilizza Claude Sonnet 4 o Sonnet 4.5 con la [finestra di contesto di 1M token abilitata](/docs/it/build-with-claude/context-windows#1m-token-context-window), le richieste che superano 200K token di input vengono automaticamente addebitate ai tassi di contesto lungo premium:

<Note>
La finestra di contesto di 1M token è attualmente in beta per le organizzazioni nel [livello di utilizzo](/docs/it/api/rate-limits) 4 e per le organizzazioni con limiti di velocità personalizzati. La finestra di contesto di 1M token è disponibile solo per Claude Sonnet 4 e Sonnet 4.5.
</Note>

| ≤ 200K token di input | > 200K token di input |
|-----------------------------------|-------------------------------------|
| Input: $3 / MTok | Input: $6 / MTok |
| Output: $15 / MTok | Output: $22,50 / MTok |

I prezzi del contesto lungo si sommano con altri modificatori di prezzo:
- Lo [sconto dell'API Batch del 50%](#batch-processing) si applica ai prezzi del contesto lungo
- I [moltiplicatori del prompt caching](#model-pricing) si applicano in aggiunta ai prezzi del contesto lungo

<Note>
Anche con il flag beta abilitato, le richieste con meno di 200K token di input vengono addebitate ai tassi standard. Se la tua richiesta supera 200K token di input, tutti i token incorrono in prezzi premium.

La soglia di 200K si basa esclusivamente sui token di input (incluse le letture/scritture della cache). Il conteggio dei token di output non influisce sulla selezione del livello di prezzo, anche se i token di output vengono addebitati al tasso più alto quando viene superata la soglia di input.
</Note>

Per verificare se la tua richiesta API è stata addebitata ai tassi della finestra di contesto di 1M, esamina l'oggetto `usage` nella risposta API:

```json
{
  "usage": {
    "input_tokens": 250000,
    "cache_creation_input_tokens": 0,
    "cache_read_input_tokens": 0,
    "output_tokens": 500
  }
}
```

Calcola il totale dei token di input sommando:
- `input_tokens`
- `cache_creation_input_tokens` (se si utilizza il prompt caching)
- `cache_read_input_tokens` (se si utilizza il prompt caching)

Se il totale supera 200.000 token, l'intera richiesta è stata fatturata ai tassi del contesto di 1M.

Per ulteriori informazioni sull'oggetto `usage`, consulta la [documentazione della risposta API](/docs/it/api/messages#response-usage).

### Prezzi dell'uso degli strumenti

Tool use requests are priced based on:
1. The total number of input tokens sent to the model (including in the `tools` parameter)
2. The number of output tokens generated
3. For server-side tools, additional usage-based pricing (e.g., web search charges per search performed)

Client-side tools are priced the same as any other Claude API request, while server-side tools may incur additional charges based on their specific usage.

The additional tokens from tool use come from:

- The `tools` parameter in API requests (tool names, descriptions, and schemas)
- `tool_use` content blocks in API requests and responses
- `tool_result` content blocks in API requests

When you use `tools`, we also automatically include a special system prompt for the model which enables tool use. The number of tool use tokens required for each model are listed below (excluding the additional tokens listed above). Note that the table assumes at least 1 tool is provided. If no `tools` are provided, then a tool choice of `none` uses 0 additional system prompt tokens.

| Model                    | Tool choice                                          | Tool use system prompt token count          |
|--------------------------|------------------------------------------------------|---------------------------------------------|
| Claude Opus 4.5            | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Opus 4.1            | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Opus 4            | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Sonnet 4.5          | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Sonnet 4          | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations))        | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Haiku 4.5         | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Haiku 3.5         | `auto`, `none`<hr />`any`, `tool`   | 264 tokens<hr />340 tokens |
| Claude Opus 3 ([deprecated](/docs/en/about-claude/model-deprecations))            | `auto`, `none`<hr />`any`, `tool`   | 530 tokens<hr />281 tokens |
| Claude Sonnet 3          | `auto`, `none`<hr />`any`, `tool`   | 159 tokens<hr />235 tokens |
| Claude Haiku 3           | `auto`, `none`<hr />`any`, `tool`   | 264 tokens<hr />340 tokens |

These token counts are added to your normal input and output tokens to calculate the total cost of a request.

Per i prezzi attuali per modello, fai riferimento alla nostra sezione [prezzi dei modelli](#model-pricing) sopra.

Per ulteriori informazioni sull'implementazione dell'uso degli strumenti e le best practice, consulta la nostra [documentazione sull'uso degli strumenti](/docs/it/agents-and-tools/tool-use/overview).

### Prezzi di strumenti specifici

#### Strumento Bash

The bash tool adds **245 input tokens** to your API calls.

Additional tokens are consumed by:
- Command outputs (stdout/stderr)
- Error messages
- Large file contents

Consulta [prezzi dell'uso degli strumenti](#tool-use-pricing) per i dettagli completi sui prezzi.

#### Strumento di esecuzione del codice

Code execution tool usage is tracked separately from token usage. Execution time has a minimum of 5 minutes.
If files are included in the request, execution time is billed even if the tool is not used due to files being preloaded onto the container.

Each organization receives 50 free hours of usage with the code execution tool per day. Additional usage beyond the first 50 hours is billed at $0.05 per hour, per container.

#### Strumento editor di testo

The text editor tool uses the same pricing structure as other tools used with Claude. It follows the standard input and output token pricing based on the Claude model you're using.

In addition to the base tokens, the following additional input tokens are needed for the text editor tool:

| Tool | Additional input tokens |
| ----------------------------------------- | --------------------------------------- |
| `text_editor_20250429` (Claude 4.x) | 700 tokens |
| `text_editor_20250124` (Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations))) | 700 tokens |

Consulta [prezzi dell'uso degli strumenti](#tool-use-pricing) per i dettagli completi sui prezzi.

#### Strumento di ricerca web

Web search usage is charged in addition to token usage:

```json
"usage": {
  "input_tokens": 105,
  "output_tokens": 6039,
  "cache_read_input_tokens": 7123,
  "cache_creation_input_tokens": 7345,
  "server_tool_use": {
    "web_search_requests": 1
  }
}
```

Web search is available on the Claude API for **$10 per 1,000 searches**, plus standard token costs for search-generated content. Web search results retrieved throughout a conversation are counted as input tokens, in search iterations executed during a single turn and in subsequent conversation turns.

Each web search counts as one use, regardless of the number of results returned. If an error occurs during web search, the web search will not be billed.

#### Strumento di recupero web

Web fetch usage has **no additional charges** beyond standard token costs:

```json
"usage": {
  "input_tokens": 25039,
  "output_tokens": 931,
  "cache_read_input_tokens": 0,
  "cache_creation_input_tokens": 0,
  "server_tool_use": {
    "web_fetch_requests": 1
  }
}
```

The web fetch tool is available on the Claude API at **no additional cost**. You only pay standard token costs for the fetched content that becomes part of your conversation context.

To protect against inadvertently fetching large content that would consume excessive tokens, use the `max_content_tokens` parameter to set appropriate limits based on your use case and budget considerations.

Example token usage for typical content:
- Average web page (10KB): ~2,500 tokens
- Large documentation page (100KB): ~25,000 tokens  
- Research paper PDF (500KB): ~125,000 tokens

#### Strumento di uso del computer

Computer use follows the standard [tool use pricing](/docs/en/agents-and-tools/tool-use/overview#pricing). When using the computer use tool:

**System prompt overhead**: The computer use beta adds 466-499 tokens to the system prompt

**Computer use tool token usage**:
| Model | Input tokens per tool definition |
| ----- | -------------------------------- |
| Claude 4.x models | 735 tokens |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations)) | 735 tokens |

**Additional token consumption**:
- Screenshot images (see [Vision pricing](/docs/en/build-with-claude/vision))
- Tool execution results returned to Claude

<Note>
If you're also using bash or text editor tools alongside computer use, those tools have their own token costs as documented in their respective pages.
</Note>

## Esempi di prezzi per i casi d'uso degli agenti

Comprendere i prezzi per le applicazioni di agenti è cruciale quando si costruisce con Claude. Questi esempi del mondo reale possono aiutarti a stimare i costi per diversi modelli di agenti.

### Esempio di agente di supporto clienti

Quando si costruisce un agente di supporto clienti, ecco come i costi potrebbero suddividersi:

<Note>
  Calcolo di esempio per l'elaborazione di 10.000 ticket di supporto:
  - Media di ~3.700 token per conversazione
  - Utilizzo di Claude Sonnet 4.5 a $3/MTok di input, $15/MTok di output
  - Costo totale: ~$22,20 per 10.000 ticket
</Note>

Per una procedura dettagliata di questo calcolo, consulta la nostra [guida all'agente di supporto clienti](/docs/it/about-claude/use-case-guides/customer-support-chat).

### Prezzi del flusso di lavoro generale dell'agente

Per architetture di agenti più complesse con più passaggi:

1. **Elaborazione della richiesta iniziale**
   - Input tipico: 500-1.000 token
   - Costo di elaborazione: ~$0,003 per richiesta

2. **Recupero della memoria e del contesto**
   - Contesto recuperato: 2.000-5.000 token
   - Costo per recupero: ~$0,015 per operazione

3. **Pianificazione e esecuzione dell'azione**
   - Token di pianificazione: 1.000-2.000
   - Feedback di esecuzione: 500-1.000
   - Costo combinato: ~$0,045 per azione

Per una guida completa sui modelli di prezzi degli agenti, consulta la nostra [guida ai casi d'uso degli agenti](/docs/it/about-claude/use-case-guides).

### Strategie di ottimizzazione dei costi

Quando si costruiscono agenti con Claude:

1. **Utilizza modelli appropriati**: Scegli Haiku per compiti semplici, Sonnet per ragionamento complesso
2. **Implementa il prompt caching**: Riduci i costi per il contesto ripetuto
3. **Operazioni in batch**: Utilizza l'API Batch per compiti non sensibili al tempo
4. **Monitora i modelli di utilizzo**: Traccia il consumo di token per identificare opportunità di ottimizzazione

<Tip>
  Per applicazioni di agenti ad alto volume, considera di contattare il nostro [team di vendita aziendale](https://claude.com/contact-sales) per accordi di prezzi personalizzati.
</Tip>

## Considerazioni aggiuntive sui prezzi

### Limiti di velocità

I limiti di velocità variano in base al livello di utilizzo e influiscono su quante richieste puoi effettuare:

- **Livello 1**: Utilizzo a livello di ingresso con limiti di base
- **Livello 2**: Limiti aumentati per applicazioni in crescita
- **Livello 3**: Limiti più alti per applicazioni consolidate
- **Livello 4**: Limiti standard massimi
- **Enterprise**: Limiti personalizzati disponibili

Per informazioni dettagliate sui limiti di velocità, consulta la nostra [documentazione sui limiti di velocità](/docs/it/api/rate-limits).

Per limiti di velocità più alti o accordi di prezzi personalizzati, [contatta il nostro team di vendita](https://claude.com/contact-sales).

### Sconti per volume

Gli sconti per volume potrebbero essere disponibili per gli utenti ad alto volume. Questi vengono negoziati caso per caso.

- I livelli standard utilizzano i prezzi mostrati sopra
- I clienti Enterprise possono [contattare le vendite](mailto:sales@anthropic.com) per prezzi personalizzati
- Potrebbero essere disponibili sconti accademici e per la ricerca

### Prezzi Enterprise

Per i clienti Enterprise con esigenze specifiche:

- Limiti di velocità personalizzati
- Sconti per volume
- Supporto dedicato
- Termini personalizzati

Contatta il nostro team di vendita a [sales@anthropic.com](mailto:sales@anthropic.com) o tramite la [Console Claude](/settings/limits) per discutere le opzioni di prezzi Enterprise.

## Fatturazione e pagamento

- La fatturazione viene calcolata mensilmente in base all'utilizzo effettivo
- I pagamenti vengono elaborati in USD
- Sono disponibili opzioni di carta di credito e fatturazione
- Il tracciamento dell'utilizzo è disponibile nella [Console Claude](/)

## Domande frequenti

**Come viene calcolato l'utilizzo dei token?**

I token sono pezzi di testo che i modelli elaborano. Come stima approssimativa, 1 token è approssimativamente 4 caratteri o 0,75 parole in inglese. Il conteggio esatto varia in base alla lingua e al tipo di contenuto.

**Ci sono livelli gratuiti o prove?**

I nuovi utenti ricevono una piccola quantità di crediti gratuiti per testare l'API. [Contatta le vendite](mailto:sales@anthropic.com) per informazioni su prove estese per la valutazione aziendale.

**Come si sommano gli sconti?**

Gli sconti dell'API Batch e del prompt caching possono essere combinati. Ad esempio, l'utilizzo di entrambe le funzionalità insieme fornisce risparmi significativi rispetto alle chiamate API standard.

**Quali metodi di pagamento sono accettati?**

Accettiamo le principali carte di credito per gli account standard. I clienti Enterprise possono organizzare la fatturazione e altri metodi di pagamento.

Per domande aggiuntive sui prezzi, contatta [support@anthropic.com](mailto:support@anthropic.com).