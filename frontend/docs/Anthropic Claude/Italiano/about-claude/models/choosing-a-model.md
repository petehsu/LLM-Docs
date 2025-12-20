# Scegliere il modello giusto

La selezione del modello Claude ottimale per la tua applicazione comporta il bilanciamento di tre considerazioni chiave: capacità, velocità e costo. Questa guida ti aiuta a prendere una decisione consapevole in base ai tuoi requisiti specifici.

---

## Stabilire i criteri chiave

Quando scegli un modello Claude, ti consigliamo di valutare prima questi fattori:
- **Capacità:** Quali caratteristiche o capacità specifiche dovrà avere il modello per soddisfare le tue esigenze?
- **Velocità:** Con quale rapidità il modello deve rispondere nella tua applicazione?
- **Costo:** Qual è il tuo budget sia per lo sviluppo che per l'utilizzo in produzione?

Conoscere queste risposte in anticipo renderà molto più facile restringere il campo e decidere quale modello utilizzare.

***

## Scegli il miglior modello per iniziare

Ci sono due approcci generali che puoi utilizzare per iniziare a testare quale modello Claude funziona meglio per le tue esigenze.

### Opzione 1: Inizia con un modello veloce ed economico

Per molte applicazioni, iniziare con un modello più veloce ed economico come Claude Haiku 4.5 può essere l'approccio ottimale:

1. Inizia l'implementazione con Claude Haiku 4.5
2. Testa accuratamente il tuo caso d'uso
3. Valuta se le prestazioni soddisfano i tuoi requisiti
4. Esegui l'upgrade solo se necessario per colmare specifiche lacune di capacità

Questo approccio consente un'iterazione rapida, costi di sviluppo inferiori ed è spesso sufficiente per molte applicazioni comuni. Questo approccio è migliore per:
- Prototipazione e sviluppo iniziale
- Applicazioni con requisiti di latenza ristretti
- Implementazioni sensibili ai costi
- Attività ad alto volume e semplici

### Opzione 2: Inizia con il modello più capace

Per attività complesse in cui l'intelligenza e le capacità avanzate sono fondamentali, potresti voler iniziare con il modello più capace e poi considerare l'ottimizzazione verso modelli più efficienti in seguito:

1. Implementa con Claude Sonnet 4.5
2. Ottimizza i tuoi prompt per questi modelli
3. Valuta se le prestazioni soddisfano i tuoi requisiti
4. Considera l'aumento dell'efficienza riducendo gradualmente l'intelligenza nel tempo con una maggiore ottimizzazione del flusso di lavoro

Questo approccio è migliore per:
- Attività di ragionamento complesso
- Applicazioni scientifiche o matematiche
- Attività che richiedono una comprensione sfumata
- Applicazioni in cui l'accuratezza supera le considerazioni di costo
- Codifica avanzata

## Matrice di selezione del modello

| Quando hai bisogno di... | Ti consigliamo di iniziare con... | Esempi di casi d'uso |
|------------------|-------------------|-------------------|
| Miglior modello per agenti complessi e codifica, intelligenza più elevata nella maggior parte dei compiti, orchestrazione superiore degli strumenti per attività autonome di lunga durata | Claude Sonnet 4.5 | Agenti di codifica autonomi, automazione della sicurezza informatica, analisi finanziaria complessa, attività di ricerca multi-ora, framework multi-agente |
| Massima intelligenza con prestazioni pratiche per attività specializzate complesse | Claude Opus 4.5 | Ingegneria del software professionale, agenti avanzati per attività d'ufficio, utilizzo di computer e browser su larga scala, applicazioni di visione con cambio di fase |
| Intelligenza e ragionamento eccezionali per attività specializzate complesse | Claude Opus 4.1 | Refactoring di codebase altamente complesso, scrittura creativa sfumata, analisi scientifica specializzata |
| Prestazioni quasi ai limiti con velocità fulminea e pensiero esteso - il nostro modello Haiku più veloce e intelligente al prezzo più economico | Claude Haiku 4.5 | Applicazioni in tempo reale, elaborazione intelligente ad alto volume, distribuzioni sensibili ai costi che richiedono un ragionamento forte, attività di sub-agente |

***

## Decidi se eseguire l'upgrade o cambiare modelli

Per determinare se hai bisogno di eseguire l'upgrade o cambiare modelli, dovresti:
1. [Creare test di benchmark](/docs/it/test-and-evaluate/develop-tests) specifici per il tuo caso d'uso - avere un buon set di valutazione è il passo più importante del processo
2. Testare con i tuoi prompt e dati effettivi
3. Confrontare le prestazioni tra i modelli per:
   - Accuratezza delle risposte
   - Qualità della risposta
   - Gestione dei casi limite
4. Valutare i compromessi tra prestazioni e costo

## Passaggi successivi

<CardGroup cols={3}>
  <Card title="Grafico di confronto dei modelli" icon="settings" href="/docs/it/about-claude/models/overview">
    Vedi le specifiche dettagliate e i prezzi per i più recenti modelli Claude
  </Card>
  <Card title="Novità in Claude 4.5" icon="sparkle" href="/docs/it/about-claude/models/whats-new-claude-4-5">
    Esplora i miglioramenti più recenti nei modelli Claude 4.5
  </Card>
  <Card title="Inizia a costruire" icon="code" href="/docs/it/get-started">
    Inizia con la tua prima chiamata API
  </Card>
</CardGroup>