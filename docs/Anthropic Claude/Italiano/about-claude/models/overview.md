# Panoramica dei modelli

Claude è una famiglia di modelli linguistici di grandi dimensioni all'avanguardia sviluppati da Anthropic. Questa guida introduce i nostri modelli e confronta le loro prestazioni.

---

## Scelta di un modello

Se non sei sicuro di quale modello utilizzare, ti consigliamo di iniziare con **Claude Sonnet 4.5**. Offre il miglior equilibrio tra intelligenza, velocità e costo per la maggior parte dei casi d'uso, con prestazioni eccezionali nei compiti di codifica e agenti.

Tutti i modelli Claude attuali supportano input di testo e immagini, output di testo, capacità multilingue e visione. I modelli sono disponibili tramite l'API Anthropic, AWS Bedrock e Google Vertex AI.

Una volta scelto un modello, [scopri come effettuare la tua prima chiamata API](/docs/it/get-started).

### Confronto dei modelli più recenti

| Funzionalità | Claude Sonnet 4.5 | Claude Haiku 4.5 | Claude Opus 4.5 |
|:--------|:------------------|:-----------------|:----------------|
| **Descrizione** | Il nostro modello intelligente per agenti complessi e codifica | Il nostro modello più veloce con intelligenza quasi all'avanguardia | Modello premium che combina l'intelligenza massima con prestazioni pratiche |
| **ID API Claude** | claude-sonnet-4-5-20250929 | claude-haiku-4-5-20251001 | claude-opus-4-5-20251101 |
| **Alias API Claude**<sup>1</sup> | claude-sonnet-4-5 | claude-haiku-4-5 | claude-opus-4-5 |
| **ID AWS Bedrock** | anthropic.claude-sonnet-4-5-20250929-v1:0 | anthropic.claude-haiku-4-5-20251001-v1:0 | anthropic.claude-opus-4-5-20251101-v1:0 |
| **ID GCP Vertex AI** | claude-sonnet-4-5@20250929 | claude-haiku-4-5@20251001 | claude-opus-4-5@20251101 |
| **Prezzi**<sup>2</sup> | \$3 / input MTok<br/>\$15 / output MTok | \$1 / input MTok<br/>\$5 / output MTok | \$5 / input MTok<br/>\$25 / output MTok |
| **[Pensiero esteso](/docs/it/build-with-claude/extended-thinking)** | Sì | Sì | Sì |
| **[Tier di priorità](/docs/it/api/service-tiers)** | Sì | Sì | Sì |
| **Latenza comparativa** | Veloce | Più veloce | Moderata |
| **Finestra di contesto** | <Tooltip tooltipContent="~150K parole \ ~680K caratteri unicode">200K token</Tooltip> / <br/> <Tooltip tooltipContent="~750K parole \ ~3.4M caratteri unicode">1M token</Tooltip> (beta)<sup>3</sup> | <Tooltip tooltipContent="~150K parole \ ~680K caratteri unicode">200K token</Tooltip> | <Tooltip tooltipContent="~150K parole \ ~680K caratteri unicode">200K token</Tooltip> |
| **Output massimo** | 64K token | 64K token | 64K token |
| **Cutoff di conoscenza affidabile** | Gen 2025<sup>4</sup> | Feb 2025 | Mag 2025<sup>4</sup> |
| **Cutoff dei dati di addestramento** | Lug 2025 | Lug 2025 | Ago 2025 |

_<sup>1 - Gli alias puntano automaticamente allo snapshot del modello più recente. Quando rilasciamo nuovi snapshot del modello, migriamo gli alias per puntare alla versione più recente di un modello, in genere entro una settimana dal nuovo rilascio. Sebbene gli alias siano utili per la sperimentazione, consigliamo di utilizzare versioni di modelli specifiche (ad es. `claude-sonnet-4-5-20250929`) nelle applicazioni di produzione per garantire un comportamento coerente.</sup>_

_<sup>2 - Consulta la nostra [pagina dei prezzi](/docs/it/about-claude/pricing) per informazioni complete sui prezzi, inclusi sconti dell'API batch, tariffe di caching dei prompt, costi del pensiero esteso e tariffe di elaborazione della visione.</sup>_

_<sup>3 - Claude Sonnet 4.5 supporta una [finestra di contesto di 1M token](/docs/it/build-with-claude/context-windows#1m-token-context-window) quando si utilizza l'intestazione beta `context-1m-2025-08-07`. I [prezzi del contesto lungo](/docs/it/about-claude/pricing#long-context-pricing) si applicano alle richieste che superano 200K token.</sup>_

_<sup>4 - **Cutoff di conoscenza affidabile** indica la data fino alla quale la conoscenza di un modello è più estesa e affidabile. **Cutoff dei dati di addestramento** è l'intervallo di date più ampio dei dati di addestramento utilizzati. Ad esempio, Claude Sonnet 4.5 è stato addestrato su informazioni pubblicamente disponibili fino a luglio 2025, ma la sua conoscenza è più estesa e affidabile fino a gennaio 2025. Per ulteriori informazioni, consulta [l'Hub di trasparenza di Anthropic](https://www.anthropic.com/transparency).</sup>_

<Note>I modelli con la stessa data di snapshot (ad es. 20240620) sono identici su tutte le piattaforme e non cambiano. La data dello snapshot nel nome del modello garantisce coerenza e consente agli sviluppatori di fare affidamento su prestazioni stabili in ambienti diversi.</Note>

<Note>A partire da **Claude Sonnet 4.5 e tutti i modelli futuri**, AWS Bedrock e Google Vertex AI offrono due tipi di endpoint: **endpoint globali** (routing dinamico per la massima disponibilità) e **endpoint regionali** (routing dei dati garantito attraverso regioni geografiche specifiche). Per ulteriori informazioni, consulta la [sezione dei prezzi della piattaforma di terze parti](/docs/it/about-claude/pricing#third-party-platform-pricing).</Note>

<section title="Modelli legacy">

I seguenti modelli sono ancora disponibili ma consigliamo di migrare ai modelli attuali per prestazioni migliori:

| Funzionalità | Claude Opus 4.1 | Claude Sonnet 4 | Claude Sonnet 3.7 | Claude Opus 4 | Claude Haiku 3.5 | Claude Haiku 3 |
|:--------|:----------------|:----------------|:------------------|:--------------|:-----------------|:---------------|
| **ID API Claude** | claude-opus-4-1-20250805 | claude-sonnet-4-20250514 | claude-3-7-sonnet-20250219 | claude-opus-4-20250514 | claude-3-5-haiku-20241022 | claude-3-haiku-20240307 |
| **Alias API Claude** | claude-opus-4-1 | claude-sonnet-4-0 | claude-3-7-sonnet-latest | claude-opus-4-0 | claude-3-5-haiku-latest | — |
| **ID AWS Bedrock** | anthropic.claude-opus-4-1-20250805-v1:0 | anthropic.claude-sonnet-4-20250514-v1:0 | anthropic.claude-3-7-sonnet-20250219-v1:0 | anthropic.claude-opus-4-20250514-v1:0 | anthropic.claude-3-5-haiku-20241022-v1:0 | anthropic.claude-3-haiku-20240307-v1:0 |
| **ID GCP Vertex AI** | claude-opus-4-1@20250805 | claude-sonnet-4@20250514 | claude-3-7-sonnet@20250219 | claude-opus-4@20250514 | claude-3-5-haiku@20241022 | claude-3-haiku@20240307 |
| **Prezzi** | \$15 / input MTok<br/>\$75 / output MTok | \$3 / input MTok<br/>\$15 / output MTok | \$3 / input MTok<br/>\$15 / output MTok | \$15 / input MTok<br/>\$75 / output MTok | \$0.80 / input MTok<br/>\$4 / output MTok | \$0.25 / input MTok<br/>\$1.25 / output MTok |
| **[Pensiero esteso](/docs/it/build-with-claude/extended-thinking)** | Sì | Sì | Sì | Sì | No | No |
| **[Tier di priorità](/docs/it/api/service-tiers)** | Sì | Sì | Sì | Sì | Sì | No |
| **Latenza comparativa** | Moderata | Veloce | Veloce | Moderata | Più veloce | Veloce |
| **Finestra di contesto** | <Tooltip tooltipContent="~150K parole \ ~680K caratteri unicode">200K token</Tooltip> | <Tooltip tooltipContent="~150K parole \ ~680K caratteri unicode">200K token</Tooltip> / <br/> <Tooltip tooltipContent="~750K parole \ ~3.4M caratteri unicode">1M token</Tooltip> (beta)<sup>1</sup> | <Tooltip tooltipContent="~150K parole \ ~680K caratteri unicode">200K token</Tooltip> | <Tooltip tooltipContent="~150K parole \ ~680K caratteri unicode">200K token</Tooltip> | <Tooltip tooltipContent="~150K parole \ ~215K caratteri unicode">200K token</Tooltip> | <Tooltip tooltipContent="~150K parole \ ~680K caratteri unicode">200K token</Tooltip> |
| **Output massimo** | 32K token | 64K token | 64K token / 128K token (beta)<sup>4</sup> | 32K token | 8K token | 4K token |
| **Cutoff di conoscenza affidabile** | Gen 2025<sup>2</sup> | Gen 2025<sup>2</sup> | Ott 2024<sup>2</sup> | Gen 2025<sup>2</sup> | <sup>3</sup> | <sup>3</sup> |
| **Cutoff dei dati di addestramento** | Mar 2025 | Mar 2025 | Nov 2024 | Mar 2025 | Lug 2024 | Ago 2023 |

_<sup>1 - Claude Sonnet 4 supporta una [finestra di contesto di 1M token](/docs/it/build-with-claude/context-windows#1m-token-context-window) quando si utilizza l'intestazione beta `context-1m-2025-08-07`. I [prezzi del contesto lungo](/docs/it/about-claude/pricing#long-context-pricing) si applicano alle richieste che superano 200K token.</sup>_

_<sup>2 - **Cutoff di conoscenza affidabile** indica la data fino alla quale la conoscenza di un modello è più estesa e affidabile. **Cutoff dei dati di addestramento** è l'intervallo di date più ampio dei dati di addestramento utilizzati.</sup>_

_<sup>3 - Alcuni modelli Haiku hanno una singola data di cutoff dei dati di addestramento.</sup>_

_<sup>4 - Includi l'intestazione beta `output-128k-2025-02-19` nella tua richiesta API per aumentare la lunghezza massima del token di output a 128K token per Claude Sonnet 3.7. Ti consigliamo vivamente di utilizzare la nostra [API Messages in streaming](/docs/it/build-with-claude/streaming) per evitare timeout durante la generazione di output più lunghi. Consulta la nostra guida su [richieste lunghe](/docs/it/api/errors#long-requests) per ulteriori dettagli.</sup>_

</section>

## Prestazioni di prompt e output

I modelli Claude 4 eccellono in:
- **Prestazioni**: Risultati di primo livello nel ragionamento, codifica, compiti multilingue, gestione del contesto lungo, onestà ed elaborazione delle immagini. Consulta il [post del blog Claude 4](http://www.anthropic.com/news/claude-4) per ulteriori informazioni.
- **Risposte coinvolgenti**: I modelli Claude sono ideali per applicazioni che richiedono interazioni ricche e simili a quelle umane.

    - Se preferisci risposte più concise, puoi regolare i tuoi prompt per guidare il modello verso la lunghezza di output desiderata. Consulta le nostre [guide di ingegneria dei prompt](/docs/it/build-with-claude/prompt-engineering) per i dettagli.
    - Per le migliori pratiche specifiche di prompt di Claude 4, consulta la nostra [guida alle migliori pratiche di Claude 4](/docs/it/build-with-claude/prompt-engineering/claude-4-best-practices).
- **Qualità dell'output**: Quando migri dalle generazioni di modelli precedenti a Claude 4, potresti notare miglioramenti più significativi nelle prestazioni complessive.

## Migrazione a Claude 4.5

Se stai attualmente utilizzando modelli Claude 3, consigliamo di migrare a Claude 4.5 per sfruttare l'intelligenza migliorata e le capacità potenziate. Per istruzioni dettagliate sulla migrazione, consulta [Migrazione a Claude 4.5](/docs/it/about-claude/models/migrating-to-claude-4).

## Inizia con Claude

Se sei pronto a iniziare a esplorare cosa Claude può fare per te, tuffiamoci! Che tu sia uno sviluppatore che cerca di integrare Claude nelle tue applicazioni o un utente che desidera sperimentare la potenza dell'IA in prima persona, abbiamo tutto quello che ti serve.

<Note>Vuoi chattare con Claude? Visita [claude.ai](http://www.claude.ai)!</Note>

<CardGroup cols={3}>
  <Card title="Introduzione a Claude" icon="check" href="/docs/it/intro">
    Esplora le capacità di Claude e il flusso di sviluppo.
  </Card>
  <Card title="Guida rapida" icon="lightning" href="/docs/it/get-started">
    Scopri come effettuare la tua prima chiamata API in pochi minuti.
  </Card>
  <Card title="Console Claude" icon="code" href="/">
    Crea e testa prompt potenti direttamente nel tuo browser.
  </Card>
</CardGroup>

Se hai domande o hai bisogno di assistenza, non esitare a contattare il nostro [team di supporto](https://support.claude.com/) o consulta la [comunità Discord](https://www.anthropic.com/discord).