# Panoramica delle funzionalità

Esplora le funzionalità avanzate e le capacità di Claude.

---

## Capacità principali

Queste funzionalità migliorano le abilità fondamentali di Claude per l'elaborazione, l'analisi e la generazione di contenuti in vari formati e casi d'uso.

| Funzionalità | Descrizione | Disponibilità |
|---------|-------------|--------------|
| [Finestra di contesto da 1M token](/docs/it/build-with-claude/context-windows#1m-token-context-window) | Una finestra di contesto estesa che ti consente di elaborare documenti molto più grandi, mantenere conversazioni più lunghe e lavorare con basi di codice più estese. | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [Agent Skills](/docs/it/agents-and-tools/agent-skills/overview) | Estendi le capacità di Claude con Skills. Utilizza Skills pre-costruiti (PowerPoint, Excel, Word, PDF) o crea Skills personalizzati con istruzioni e script. Le Skills utilizzano la divulgazione progressiva per gestire in modo efficiente il contesto. | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [Elaborazione batch](/docs/it/build-with-claude/batch-processing) | Elabora grandi volumi di richieste in modo asincrono per risparmiare sui costi. Invia batch con un gran numero di query per batch. Le chiamate API batch costano il 50% in meno rispetto alle chiamate API standard. | <PlatformAvailability claudeApi bedrock vertexAi /> |
| [Citazioni](/docs/it/build-with-claude/citations) | Basa le risposte di Claude su documenti di origine. Con le Citazioni, Claude può fornire riferimenti dettagliati alle frasi e ai passaggi esatti che utilizza per generare risposte, portando a output più verificabili e affidabili. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Modifica del contesto](/docs/it/build-with-claude/context-editing) | Gestisci automaticamente il contesto della conversazione con strategie configurabili. Supporta la cancellazione dei risultati degli strumenti quando ci si avvicina ai limiti di token e la gestione dei blocchi di pensiero nelle conversazioni di pensiero esteso. | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [Effort](/docs/it/build-with-claude/effort) | Controlla quanti token Claude utilizza quando risponde con il parametro effort, scambiando tra la completezza della risposta e l'efficienza dei token. | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [Pensiero esteso](/docs/it/build-with-claude/extended-thinking) | Capacità di ragionamento migliorate per compiti complessi, fornendo trasparenza nel processo di pensiero passo dopo passo di Claude prima di fornire la sua risposta finale. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [API Files](/docs/it/build-with-claude/files) | Carica e gestisci file da utilizzare con Claude senza ricaricare il contenuto ad ogni richiesta. Supporta file PDF, immagini e file di testo. | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [Supporto PDF](/docs/it/build-with-claude/pdf-support) | Elabora e analizza il contenuto testuale e visivo da documenti PDF. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Prompt caching (5m)](/docs/it/build-with-claude/prompt-caching) | Fornisci a Claude più conoscenze di base e output di esempio per ridurre i costi e la latenza. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Prompt caching (1hr)](/docs/it/build-with-claude/prompt-caching#1-hour-cache-duration) | Durata della cache estesa di 1 ora per il contesto meno frequentemente accessibile ma importante, complementare alla cache standard di 5 minuti. | <PlatformAvailability claudeApi azureAi /> |
| [Risultati di ricerca](/docs/it/build-with-claude/search-results) | Abilita citazioni naturali per applicazioni RAG fornendo risultati di ricerca con corretta attribuzione della fonte. Ottieni citazioni di qualità ricerca web per basi di conoscenza personalizzate e strumenti. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Output strutturati](/docs/it/build-with-claude/structured-outputs) | Garantisci la conformità dello schema con due approcci: output JSON per risposte di dati strutturati e uso rigoroso degli strumenti per input degli strumenti convalidati. Disponibile su Sonnet 4.5, Opus 4.1, Opus 4.5 e Haiku 4.5. | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [Conteggio dei token](/docs/it/api/messages-count-tokens) | Il conteggio dei token ti consente di determinare il numero di token in un messaggio prima di inviarlo a Claude, aiutandoti a prendere decisioni consapevoli sui tuoi prompt e sull'utilizzo. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Uso degli strumenti](/docs/it/agents-and-tools/tool-use/overview) | Consenti a Claude di interagire con strumenti e API esterni per eseguire una varietà più ampia di attività. Per un elenco degli strumenti supportati, vedi [la tabella Strumenti](#tools). | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |

## Strumenti

Queste funzionalità consentono a Claude di interagire con sistemi esterni, eseguire codice e eseguire attività automatizzate attraverso varie interfacce di strumenti.

| Funzionalità | Descrizione | Disponibilità |
|---------|-------------|--------------|
| [Bash](/docs/it/agents-and-tools/tool-use/bash-tool) | Esegui comandi e script bash per interagire con la shell del sistema e eseguire operazioni da riga di comando. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Esecuzione del codice](/docs/it/agents-and-tools/tool-use/code-execution-tool) | Esegui codice Python in un ambiente sandbox per l'analisi avanzata dei dati. | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [Chiamata programmatica degli strumenti](/docs/it/agents-and-tools/tool-use/programmatic-tool-calling) | Consenti a Claude di chiamare i tuoi strumenti in modo programmatico da contenitori di esecuzione del codice, riducendo la latenza e il consumo di token per flussi di lavoro multi-strumento. | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [Uso del computer](/docs/it/agents-and-tools/tool-use/computer-use-tool) | Controlla le interfacce del computer acquisendo schermate e emettendo comandi del mouse e della tastiera. | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [Streaming degli strumenti a grana fine](/docs/it/agents-and-tools/tool-use/fine-grained-tool-streaming) | Trasmetti i parametri di uso degli strumenti senza buffering/convalida JSON, riducendo la latenza per la ricezione di parametri di grandi dimensioni. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Connettore MCP](/docs/it/agents-and-tools/mcp-connector) | Connettiti a server [MCP](/docs/it/mcp) remoti direttamente dall'API Messages senza un client MCP separato. | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [Memoria](/docs/it/agents-and-tools/tool-use/memory-tool) | Consenti a Claude di archiviare e recuperare informazioni tra conversazioni. Costruisci basi di conoscenza nel tempo, mantieni il contesto del progetto e impara dalle interazioni passate. | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [Editor di testo](/docs/it/agents-and-tools/tool-use/text-editor-tool) | Crea e modifica file di testo con un'interfaccia editor di testo integrata per attività di manipolazione dei file. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Ricerca degli strumenti](/docs/it/agents-and-tools/tool-use/tool-search-tool) | Scala a migliaia di strumenti scoprendo e caricando dinamicamente gli strumenti su richiesta utilizzando la ricerca basata su regex, ottimizzando l'utilizzo del contesto e migliorando l'accuratezza della selezione degli strumenti. | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [Web fetch](/docs/it/agents-and-tools/tool-use/web-fetch-tool) | Recupera il contenuto completo da pagine web e documenti PDF specificati per un'analisi approfondita. | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [Ricerca web](/docs/it/agents-and-tools/tool-use/web-search-tool) | Aumenta la conoscenza completa di Claude con dati attuali e reali da tutto il web. | <PlatformAvailability claudeApi vertexAi azureAi /> |