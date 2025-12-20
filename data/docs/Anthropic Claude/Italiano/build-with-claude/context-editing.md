# Modifica del contesto

Gestisci automaticamente il contesto della conversazione man mano che cresce con la modifica del contesto.

---

## Panoramica

La modifica del contesto ti consente di gestire automaticamente il contesto della conversazione man mano che cresce, aiutandoti a ottimizzare i costi e rimanere entro i limiti della finestra di contesto. Puoi utilizzare strategie API lato server, funzionalità SDK lato client, o entrambe insieme.

| Approccio | Dove viene eseguito | Strategie | Come funziona |
|----------|---------------|------------|--------------|
| **Lato server** | API | Cancellazione dei risultati degli strumenti (`clear_tool_uses_20250919`)<br/>Cancellazione dei blocchi di pensiero (`clear_thinking_20251015`) | Applicato prima che il prompt raggiunga Claude. Cancella contenuti specifici dalla cronologia della conversazione. Ogni strategia può essere configurata indipendentemente. |
| **Lato client** | SDK | Compattazione | Disponibile in [Python e TypeScript SDKs](/docs/it/api/client-sdks) quando si utilizza [`tool_runner`](/docs/it/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta). Genera un riepilogo e sostituisce la cronologia completa della conversazione. Vedi [Compattazione](#client-side-compaction-sdk) di seguito. |

## Panoramica

La modifica del contesto ti consente di gestire automaticamente il contesto della conversazione man mano che cresce, aiutandoti a ottimizzare i costi e rimanere entro i limiti della finestra di contesto. Puoi utilizzare strategie API lato server, funzionalità SDK lato client, o entrambe insieme.

| Approccio | Dove viene eseguito | Strategie | Come funziona |
|----------|---------------|------------|--------------|
| **Lato server** | API | Cancellazione dei risultati degli strumenti (`clear_tool_uses_20250919`)<br/>Cancellazione dei blocchi di pensiero (`clear_thinking_20251015`) | Applicato prima che il prompt raggiunga Claude. Cancella contenuti specifici dalla cronologia della conversazione. Ogni strategia può essere configurata indipendentemente. |
| **Lato client** | SDK | Compattazione | Disponibile in [Python e TypeScript SDKs](/docs/it/api/client-sdks) quando si utilizza [`tool_runner`](/docs/it/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta). Genera un riepilogo e sostituisce la cronologia completa della conversazione. Vedi [Compattazione](#client-side-compaction-sdk) di seguito. |

## Strategie lato server

<Note>
La modifica del contesto è attualmente in beta con supporto per la cancellazione dei risultati degli strumenti e la cancellazione dei blocchi di pensiero. Per abilitarla, utilizza l'intestazione beta `context-management-2025-06-27` nelle tue richieste API.

Contattaci tramite il nostro [modulo di feedback](https://forms.gle/YXC2EKGMhjN1c4L88) per condividere il tuo feedback su questa funzione.
</Note>

## Panoramica

La modifica del contesto ti consente di gestire automaticamente il contesto della conversazione man mano che cresce, aiutandoti a ottimizzare i costi e rimanere entro i limiti della finestra di contesto. Puoi utilizzare strategie API lato server, funzionalità SDK lato client, o entrambe insieme.

| Approccio | Dove viene eseguito | Strategie | Come funziona |
|----------|---------------|------------|--------------|
| **Lato server** | API | Cancellazione dei risultati degli strumenti (`clear_tool_uses_20250919`)<br/>Cancellazione dei blocchi di pensiero (`clear_thinking_20251015`) | Applicato prima che il prompt raggiunga Claude. Cancella contenuti specifici dalla cronologia della conversazione. Ogni strategia può essere configurata indipendentemente. |
| **Lato client** | SDK | Compattazione | Disponibile in [Python e TypeScript SDKs](/docs/it/api/client-sdks) quando si utilizza [`tool_runner`](/docs/it/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta). Genera un riepilogo e sostituisce la cronologia completa della conversazione. Vedi [Compattazione](#client-side-compaction-sdk) di seguito. |

## Strategie lato server

<Note>
La modifica del contesto è attualmente in beta con supporto per la cancellazione dei risultati degli strumenti e la cancellazione dei blocchi di pensiero. Per abilitarla, utilizza l'intestazione beta `context-management-2025-06-27` nelle tue richieste API.

Contattaci tramite il nostro [modulo di feedback](https://forms.gle/YXC2EKGMhjN1c4L88) per condividere il tuo feedback su questa funzione.
</Note>

### Cancellazione dei risultati degli strumenti

La strategia `clear_tool_uses_20250919` cancella i risultati degli strumenti quando il contesto della conversazione cresce oltre la soglia configurata. Quando attivata, l'API cancella automaticamente i risultati degli strumenti più vecchi in ordine cronologico, sostituendoli con testo segnaposto per far sapere a Claude che il risultato dello strumento è stato rimosso. Per impostazione predefinita, vengono cancellati solo i risultati degli strumenti. Puoi facoltativamente cancellare sia i risultati degli strumenti che le chiamate degli strumenti (i parametri di utilizzo dello strumento) impostando `clear_tool_inputs` su true.

## Panoramica

La modifica del contesto ti consente di gestire automaticamente il contesto della conversazione man mano che cresce, aiutandoti a ottimizzare i costi e rimanere entro i limiti della finestra di contesto. Puoi utilizzare strategie API lato server, funzionalità SDK lato client, o entrambe insieme.

| Approccio | Dove viene eseguito | Strategie | Come funziona |
|----------|---------------|------------|--------------|
| **Lato server** | API | Cancellazione dei risultati degli strumenti (`clear_tool_uses_20250919`)<br/>Cancellazione dei blocchi di pensiero (`clear_thinking_20251015`) | Applicato prima che il prompt raggiunga Claude. Cancella contenuti specifici dalla cronologia della conversazione. Ogni strategia può essere configurata indipendentemente. |
| **Lato client** | SDK | Compattazione | Disponibile in [Python e TypeScript SDKs](/docs/it/api/client-sdks) quando si utilizza [`tool_runner`](/docs/it/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta). Genera un riepilogo e sostituisce la cronologia completa della conversazione. Vedi [Compattazione](#client-side-compaction-sdk) di seguito. |

## Strategie lato server

<Note>
La modifica del contesto è attualmente in beta con supporto per la cancellazione dei risultati degli strumenti e la cancellazione dei blocchi di pensiero. Per abilitarla, utilizza l'intestazione beta `context-management-2025-06-27` nelle tue richieste API.

Contattaci tramite il nostro [modulo di feedback](https://forms.gle/YXC2EKGMhjN1c4L88) per condividere il tuo feedback su questa funzione.
</Note>

### Cancellazione dei risultati degli strumenti

La strategia `clear_tool_uses_20250919` cancella i risultati degli strumenti quando il contesto della conversazione cresce oltre la soglia configurata. Quando attivata, l'API cancella automaticamente i risultati degli strumenti più vecchi in ordine cronologico, sostituendoli con testo segnaposto per far sapere a Claude che il risultato dello strumento è stato rimosso. Per impostazione predefinita, vengono cancellati solo i risultati degli strumenti. Puoi facoltativamente cancellare sia i risultati degli strumenti che le chiamate degli strumenti (i parametri di utilizzo dello strumento) impostando `clear_tool_inputs` su true.

### Cancellazione dei blocchi di pensiero

La strategia `clear_thinking_20251015` gestisce i blocchi `thinking` nelle conversazioni quando il pensiero esteso è abilitato. Questa strategia cancella automaticamente i blocchi di pensiero più vecchi dai turni precedenti.

<Tip>
**Comportamento predefinito**: Quando il pensiero esteso è abilitato senza configurare la strategia `clear_thinking_20251015`, l'API mantiene automaticamente solo i blocchi di pensiero dall'ultimo turno dell'assistente (equivalente a `keep: {type: "thinking_turns", value: 1}`).

Per massimizzare i cache hit, preserva tutti i blocchi di pensiero impostando `keep: "all"`.
</Tip>

<Note>
Un turno di conversazione dell'assistente può includere più blocchi di contenuto (ad es. quando si utilizzano strumenti) e più blocchi di pensiero (ad es. con [pensiero intercalato](/docs/it/build-with-claude/extended-thinking#interleaved-thinking)).
</Note>

<Tip>
**La modifica del contesto avviene lato server**

La modifica del contesto viene applicata **lato server** prima che il prompt raggiunga Claude. La tua applicazione client mantiene la cronologia completa e non modificata della conversazione—non è necessario sincronizzare lo stato del tuo client con la versione modificata. Continua a gestire la tua cronologia completa della conversazione localmente come faresti normalmente.
</Tip>

<Tip>
**Modifica del contesto e caching del prompt**

L'interazione della modifica del contesto con il [caching del prompt](/docs/it/build-with-claude/prompt-caching) varia a seconda della strategia:

- **Cancellazione dei risultati degli strumenti**: Invalida i prefissi del prompt memorizzati nella cache quando il contenuto viene cancellato. Per tenere conto di ciò, consigliamo di cancellare abbastanza token per rendere l'invalidazione della cache utile. Utilizza il parametro `clear_at_least` per garantire che un numero minimo di token venga cancellato ogni volta. Incorrerai in costi di scrittura della cache ogni volta che il contenuto viene cancellato, ma le richieste successive possono riutilizzare il prefisso appena memorizzato nella cache.

- **Cancellazione dei blocchi di pensiero**: Quando i blocchi di pensiero sono **mantenuti** nel contesto (non cancellati), la cache del prompt viene preservata, abilitando i cache hit e riducendo i costi dei token di input. Quando i blocchi di pensiero sono **cancellati**, la cache viene invalidata nel punto in cui si verifica la cancellazione. Configura il parametro `keep` in base al fatto che tu voglia dare priorità alle prestazioni della cache o alla disponibilità della finestra di contesto.
</Tip>

## Panoramica

La modifica del contesto ti consente di gestire automaticamente il contesto della conversazione man mano che cresce, aiutandoti a ottimizzare i costi e rimanere entro i limiti della finestra di contesto. Puoi utilizzare strategie API lato server, funzionalità SDK lato client, o entrambe insieme.

| Approccio | Dove viene eseguito | Strategie | Come funziona |
|----------|---------------|------------|--------------|
| **Lato server** | API | Cancellazione dei risultati degli strumenti (`clear_tool_uses_20250919`)<br/>Cancellazione dei blocchi di pensiero (`clear_thinking_20251015`) | Applicato prima che il prompt raggiunga Claude. Cancella contenuti specifici dalla cronologia della conversazione. Ogni strategia può essere configurata indipendentemente. |
| **Lato client** | SDK | Compattazione | Disponibile in [Python e TypeScript SDKs](/docs/it/api/client-sdks) quando si utilizza [`tool_runner`](/docs/it/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta). Genera un riepilogo e sostituisce la cronologia completa della conversazione. Vedi [Compattazione](#client-side-compaction-sdk) di seguito. |

## Strategie lato server

<Note>
La modifica del contesto è attualmente in beta con supporto per la cancellazione dei risultati degli strumenti e la cancellazione dei blocchi di pensiero. Per abilitarla, utilizza l'intestazione beta `context-management-2025-06-27` nelle tue richieste API.

Contattaci tramite il nostro [modulo di feedback](https://forms.gle/YXC2EKGMhjN1c4L88) per condividere il tuo feedback su questa funzione.
</Note>

### Cancellazione dei risultati degli strumenti

La strategia `clear_tool_uses_20250919` cancella i risultati degli strumenti quando il contesto della conversazione cresce oltre la soglia configurata. Quando attivata, l'API cancella automaticamente i risultati degli strumenti più vecchi in ordine cronologico, sostituendoli con testo segnaposto per far sapere a Claude che il risultato dello strumento è stato rimosso. Per impostazione predefinita, vengono cancellati solo i risultati degli strumenti. Puoi facoltativamente cancellare sia i risultati degli strumenti che le chiamate degli strumenti (i parametri di utilizzo dello strumento) impostando `clear_tool_inputs` su true.

### Cancellazione dei blocchi di pensiero

La strategia `clear_thinking_20251015` gestisce i blocchi `thinking` nelle conversazioni quando il pensiero esteso è abilitato. Questa strategia cancella automaticamente i blocchi di pensiero più vecchi dai turni precedenti.

<Tip>
**Comportamento predefinito**: Quando il pensiero esteso è abilitato senza configurare la strategia `clear_thinking_20251015`, l'API mantiene automaticamente solo i blocchi di pensiero dall'ultimo turno dell'assistente (equivalente a `keep: {type: "thinking_turns", value: 1}`).

Per massimizzare i cache hit, preserva tutti i blocchi di pensiero impostando `keep: "all"`.
</Tip>

<Note>
Un turno di conversazione dell'assistente può includere più blocchi di contenuto (ad es. quando si utilizzano strumenti) e più blocchi di pensiero (ad es. con [pensiero intercalato](/docs/it/build-with-claude/extended-thinking#interleaved-thinking)).
</Note>

<Tip>
**La modifica del contesto avviene lato server**

La modifica del contesto viene applicata **lato server** prima che il prompt raggiunga Claude. La tua applicazione client mantiene la cronologia completa e non modificata della conversazione—non è necessario sincronizzare lo stato del tuo client con la versione modificata. Continua a gestire la tua cronologia completa della conversazione localmente come faresti normalmente.
</Tip>

<Tip>
**Modifica del contesto e caching del prompt**

L'interazione della modifica del contesto con il [caching del prompt](/docs/it/build-with-claude/prompt-caching) varia a seconda della strategia:

- **Cancellazione dei risultati degli strumenti**: Invalida i prefissi del prompt memorizzati nella cache quando il contenuto viene cancellato. Per tenere conto di ciò, consigliamo di cancellare abbastanza token per rendere l'invalidazione della cache utile. Utilizza il parametro `clear_at_least` per garantire che un numero minimo di token venga cancellato ogni volta. Incorrerai in costi di scrittura della cache ogni volta che il contenuto viene cancellato, ma le richieste successive possono riutilizzare il prefisso appena memorizzato nella cache.

- **Cancellazione dei blocchi di pensiero**: Quando i blocchi di pensiero sono **mantenuti** nel contesto (non cancellati), la cache del prompt viene preservata, abilitando i cache hit e riducendo i costi dei token di input. Quando i blocchi di pensiero sono **cancellati**, la cache viene invalidata nel punto in cui si verifica la cancellazione. Configura il parametro `keep` in base al fatto che tu voglia dare priorità alle prestazioni della cache o alla disponibilità della finestra di contesto.
</Tip>

## Modelli supportati

La modifica del contesto è disponibile su:

- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)
- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)

## Panoramica

La modifica del contesto ti consente di gestire automaticamente il contesto della conversazione man mano che cresce, aiutandoti a ottimizzare i costi e rimanere entro i limiti della finestra di contesto. Puoi utilizzare strategie API lato server, funzionalità SDK lato client, o entrambe insieme.

| Approccio | Dove viene eseguito | Strategie | Come funziona |
|----------|---------------|------------|--------------|
| **Lato server** | API | Cancellazione dei risultati degli strumenti (`clear_tool_uses_20250919`)<br/>Cancellazione dei blocchi di pensiero (`clear_thinking_20251015`) | Applicato prima che il prompt raggiunga Claude. Cancella contenuti specifici dalla cronologia della conversazione. Ogni strategia può essere configurata indipendentemente. |
| **Lato client** | SDK | Compattazione | Disponibile in [Python e TypeScript SDKs](/docs/it/api/client-sdks) quando si utilizza [`tool_runner`](/docs/it/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta). Genera un riepilogo e sostituisce la cronologia completa della conversazione. Vedi [Compattazione](#client-side-compaction-sdk) di seguito. |

## Strategie lato server

<Note>
La modifica del contesto è attualmente in beta con supporto per la cancellazione dei risultati degli strumenti e la cancellazione dei blocchi di pensiero. Per abilitarla, utilizza l'intestazione beta `context-management-2025-06-27` nelle tue richieste API.

Contattaci tramite il nostro [modulo di feedback](https://forms.gle/YXC2EKGMhjN1c4L88) per condividere il tuo feedback su questa funzione.
</Note>

### Cancellazione dei risultati degli strumenti

La strategia `clear_tool_uses_20250919` cancella i risultati degli strumenti quando il contesto della conversazione cresce oltre la soglia configurata. Quando attivata, l'API cancella automaticamente i risultati degli strumenti più vecchi in ordine cronologico, sostituendoli con testo segnaposto per far sapere a Claude che il risultato dello strumento è stato rimosso. Per impostazione predefinita, vengono cancellati solo i risultati degli strumenti. Puoi facoltativamente cancellare sia i risultati degli strumenti che le chiamate degli strumenti (i parametri di utilizzo dello strumento) impostando `clear_tool_inputs` su true.

### Cancellazione dei blocchi di pensiero

La strategia `clear_thinking_20251015` gestisce i blocchi `thinking` nelle conversazioni quando il pensiero esteso è abilitato. Questa strategia cancella automaticamente i blocchi di pensiero più vecchi dai turni precedenti.

<Tip>
**Comportamento predefinito**: Quando il pensiero esteso è abilitato senza configurare la strategia `clear_thinking_20251015`, l'API mantiene automaticamente solo i blocchi di pensiero dall'ultimo turno dell'assistente (equivalente a `keep: {type: "thinking_turns", value: 1}`).

Per massimizzare i cache hit, preserva tutti i blocchi di pensiero impostando `keep: "all"`.
</Tip>

<Note>
Un turno di conversazione dell'assistente può includere più blocchi di contenuto (ad es. quando si utilizzano strumenti) e più blocchi di pensiero (ad es. con [pensiero intercalato](/docs/it/build-with-claude/extended-thinking#interleaved-thinking)).
</Note>

<Tip>
**La modifica del contesto avviene lato server**

La modifica del contesto viene applicata **lato server** prima che il prompt raggiunga Claude. La tua applicazione client mantiene la cronologia completa e non modificata della conversazione—non è necessario sincronizzare lo stato del tuo client con la versione modificata. Continua a gestire la tua cronologia completa della conversazione localmente come faresti normalmente.
</Tip>

<Tip>
**Modifica del contesto e caching del prompt**

L'interazione della modifica del contesto con il [caching del prompt](/docs/it/build-with-claude/prompt-caching) varia a seconda della strategia:

- **Cancellazione dei risultati degli strumenti**: Invalida i prefissi del prompt memorizzati nella cache quando il contenuto viene cancellato. Per tenere conto di ciò, consigliamo di cancellare abbastanza token per rendere l'invalidazione della cache utile. Utilizza il parametro `clear_at_least` per garantire che un numero minimo di token venga cancellato ogni volta. Incorrerai in costi di scrittura della cache ogni volta che il contenuto viene cancellato, ma le richieste successive possono riutilizzare il prefisso appena memorizzato nella cache.

- **Cancellazione dei blocchi di pensiero**: Quando i blocchi di pensiero sono **mantenuti** nel contesto (non cancellati), la cache del prompt viene preservata, abilitando i cache hit e riducendo i costi dei token di input. Quando i blocchi di pensiero sono **cancellati**, la cache viene invalidata nel punto in cui si verifica la cancellazione. Configura il parametro `keep` in base al fatto che tu voglia dare priorità alle prestazioni della cache o alla disponibilità della finestra di contesto.
</Tip>

## Utilizzo della cancellazione dei risultati degli strumenti

Il modo più semplice per abilitare la cancellazione dei risultati degli strumenti è specificare solo il tipo di strategia, poiché tutte le altre [opzioni di configurazione](#configuration-options-for-tool-result-clearing) utilizzeranno i loro valori predefiniti:

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": "Search for recent developments in AI"
            }
        ],
        "tools": [
            {
                "type": "web_search_20250305",
                "name": "web_search"
            }
        ],
        "context_management": {
            "edits": [
                {"type": "clear_tool_uses_20250919"}
            ]
        }
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Search for recent developments in AI"
        }
    ],
    tools=[
        {
            "type": "web_search_20250305",
            "name": "web_search"
        }
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {"type": "clear_tool_uses_20250919"}
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [
    {
      role: "user",
      content: "Search for recent developments in AI"
    }
  ],
  tools: [
    {
      type: "web_search_20250305",
      name: "web_search"
    }
  ],
  context_management: {
    edits: [
      { type: "clear_tool_uses_20250919" }
    ]
  },
  betas: ["context-management-2025-06-27"]
});
```

</CodeGroup>

## Panoramica

La modifica del contesto ti consente di gestire automaticamente il contesto della conversazione man mano che cresce, aiutandoti a ottimizzare i costi e rimanere entro i limiti della finestra di contesto. Puoi utilizzare strategie API lato server, funzionalità SDK lato client, o entrambe insieme.

| Approccio | Dove viene eseguito | Strategie | Come funziona |
|----------|---------------|------------|--------------|
| **Lato server** | API | Cancellazione dei risultati degli strumenti (`clear_tool_uses_20250919`)<br/>Cancellazione dei blocchi di pensiero (`clear_thinking_20251015`) | Applicato prima che il prompt raggiunga Claude. Cancella contenuti specifici dalla cronologia della conversazione. Ogni strategia può essere configurata indipendentemente. |
| **Lato client** | SDK | Compattazione | Disponibile in [Python e TypeScript SDKs](/docs/it/api/client-sdks) quando si utilizza [`tool_runner`](/docs/it/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta). Genera un riepilogo e sostituisce la cronologia completa della conversazione. Vedi [Compattazione](#client-side-compaction-sdk) di seguito. |

## Strategie lato server

<Note>
La modifica del contesto è attualmente in beta con supporto per la cancellazione dei risultati degli strumenti e la cancellazione dei blocchi di pensiero. Per abilitarla, utilizza l'intestazione beta `context-management-2025-06-27` nelle tue richieste API.

Contattaci tramite il nostro [modulo di feedback](https://forms.gle/YXC2EKGMhjN1c4L88) per condividere il tuo feedback su questa funzione.
</Note>

### Cancellazione dei risultati degli strumenti

La strategia `clear_tool_uses_20250919` cancella i risultati degli strumenti quando il contesto della conversazione cresce oltre la soglia configurata. Quando attivata, l'API cancella automaticamente i risultati degli strumenti più vecchi in ordine cronologico, sostituendoli con testo segnaposto per far sapere a Claude che il risultato dello strumento è stato rimosso. Per impostazione predefinita, vengono cancellati solo i risultati degli strumenti. Puoi facoltativamente cancellare sia i risultati degli strumenti che le chiamate degli strumenti (i parametri di utilizzo dello strumento) impostando `clear_tool_inputs` su true.

### Cancellazione dei blocchi di pensiero

La strategia `clear_thinking_20251015` gestisce i blocchi `thinking` nelle conversazioni quando il pensiero esteso è abilitato. Questa strategia cancella automaticamente i blocchi di pensiero più vecchi dai turni precedenti.

<Tip>
**Comportamento predefinito**: Quando il pensiero esteso è abilitato senza configurare la strategia `clear_thinking_20251015`, l'API mantiene automaticamente solo i blocchi di pensiero dall'ultimo turno dell'assistente (equivalente a `keep: {type: "thinking_turns", value: 1}`).

Per massimizzare i cache hit, preserva tutti i blocchi di pensiero impostando `keep: "all"`.
</Tip>

<Note>
Un turno di conversazione dell'assistente può includere più blocchi di contenuto (ad es. quando si utilizzano strumenti) e più blocchi di pensiero (ad es. con [pensiero intercalato](/docs/it/build-with-claude/extended-thinking#interleaved-thinking)).
</Note>

<Tip>
**La modifica del contesto avviene lato server**

La modifica del contesto viene applicata **lato server** prima che il prompt raggiunga Claude. La tua applicazione client mantiene la cronologia completa e non modificata della conversazione—non è necessario sincronizzare lo stato del tuo client con la versione modificata. Continua a gestire la tua cronologia completa della conversazione localmente come faresti normalmente.
</Tip>

<Tip>
**Modifica del contesto e caching del prompt**

L'interazione della modifica del contesto con il [caching del prompt](/docs/it/build-with-claude/prompt-caching) varia a seconda della strategia:

- **Cancellazione dei risultati degli strumenti**: Invalida i prefissi del prompt memorizzati nella cache quando il contenuto viene cancellato. Per tenere conto di ciò, consigliamo di cancellare abbastanza token per rendere l'invalidazione della cache utile. Utilizza il parametro `clear_at_least` per garantire che un numero minimo di token venga cancellato ogni volta. Incorrerai in costi di scrittura della cache ogni volta che il contenuto viene cancellato, ma le richieste successive possono riutilizzare il prefisso appena memorizzato nella cache.

- **Cancellazione dei blocchi di pensiero**: Quando i blocchi di pensiero sono **mantenuti** nel contesto (non cancellati), la cache del prompt viene preservata, abilitando i cache hit e riducendo i costi dei token di input. Quando i blocchi di pensiero sono **cancellati**, la cache viene invalidata nel punto in cui si verifica la cancellazione. Configura il parametro `keep` in base al fatto che tu voglia dare priorità alle prestazioni della cache o alla disponibilità della finestra di contesto.
</Tip>

## Modelli supportati

La modifica del contesto è disponibile su:

- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)
- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)

## Utilizzo della cancellazione dei risultati degli strumenti

Il modo più semplice per abilitare la cancellazione dei risultati degli strumenti è specificare solo il tipo di strategia, poiché tutte le altre [opzioni di configurazione](#configuration-options-for-tool-result-clearing) utilizzeranno i loro valori predefiniti:

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": "Search for recent developments in AI"
            }
        ],
        "tools": [
            {
                "type": "web_search_20250305",
                "name": "web_search"
            }
        ],
        "context_management": {
            "edits": [
                {"type": "clear_tool_uses_20250919"}
            ]
        }
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Search for recent developments in AI"
        }
    ],
    tools=[
        {
            "type": "web_search_20250305",
            "name": "web_search"
        }
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {"type": "clear_tool_uses_20250919"}
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [
    {
      role: "user",
      content: "Search for recent developments in AI"
    }
  ],
  tools: [
    {
      type: "web_search_20250305",
      name: "web_search"
    }
  ],
  context_management: {
    edits: [
      { type: "clear_tool_uses_20250919" }
    ]
  },
  betas: ["context-management-2025-06-27"]
});
```

</CodeGroup>

### Configurazione avanzata

Puoi personalizzare il comportamento della cancellazione dei risultati degli strumenti con parametri aggiuntivi:

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": "Create a simple command line calculator app using Python"
            }
        ],
        "tools": [
            {
                "type": "text_editor_20250728",
                "name": "str_replace_based_edit_tool",
                "max_characters": 10000
            },
            {
                "type": "web_search_20250305",
                "name": "web_search",
                "max_uses": 3
            }
        ],
        "context_management": {
            "edits": [
                {
                    "type": "clear_tool_uses_20250919",
                    "trigger": {
                        "type": "input_tokens",
                        "value": 30000
                    },
                    "keep": {
                        "type": "tool_uses",
                        "value": 3
                    },
                    "clear_at_least": {
                        "type": "input_tokens",
                        "value": 5000
                    },
                    "exclude_tools": ["web_search"]
                }
            ]
        }
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Create a simple command line calculator app using Python"
        }
    ],
    tools=[
        {
            "type": "text_editor_20250728",
            "name": "str_replace_based_edit_tool",
            "max_characters": 10000
        },
        {
            "type": "web_search_20250305",
            "name": "web_search",
            "max_uses": 3
        }
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_tool_uses_20250919",
                # Trigger clearing when threshold is exceeded
                "trigger": {
                    "type": "input_tokens",
                    "value": 30000
                },
                # Number of tool uses to keep after clearing
                "keep": {
                    "type": "tool_uses",
                    "value": 3
                },
                # Optional: Clear at least this many tokens
                "clear_at_least": {
                    "type": "input_tokens",
                    "value": 5000
                },
                # Exclude these tools from being cleared
                "exclude_tools": ["web_search"]
            }
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [
    {
      role: "user",
      content: "Create a simple command line calculator app using Python"
    }
  ],
  tools: [
    {
      type: "text_editor_20250728",
      name: "str_replace_based_edit_tool",
      max_characters: 10000
    },
    {
      type: "web_search_20250305",
      name: "web_search",
      max_uses: 3
    }
  ],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_tool_uses_20250919",
        // Trigger clearing when threshold is exceeded
        trigger: {
          type: "input_tokens",
          value: 30000
        },
        // Number of tool uses to keep after clearing
        keep: {
          type: "tool_uses",
          value: 3
        },
        // Optional: Clear at least this many tokens
        clear_at_least: {
          type: "input_tokens",
          value: 5000
        },
        // Exclude these tools from being cleared
        exclude_tools: ["web_search"]
      }
    ]
  }
});
```

</CodeGroup>

## Panoramica

La modifica del contesto consente di gestire automaticamente il contesto della conversazione man mano che cresce, aiutandoti a ottimizzare i costi e rimanere entro i limiti della finestra di contesto. Puoi utilizzare strategie API lato server, funzionalità SDK lato client, o entrambe insieme.

| Approccio | Dove viene eseguito | Strategie | Come funziona |
|----------|---------------|------------|--------------|
| **Lato server** | API | Cancellazione dei risultati degli strumenti (`clear_tool_uses_20250919`)<br/>Cancellazione dei blocchi di pensiero (`clear_thinking_20251015`) | Applicato prima che il prompt raggiunga Claude. Cancella contenuti specifici dalla cronologia della conversazione. Ogni strategia può essere configurata indipendentemente. |
| **Lato client** | SDK | Compattazione | Disponibile negli [SDK Python e TypeScript](/docs/it/api/client-sdks) quando si utilizza [`tool_runner`](/docs/it/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta). Genera un riepilogo e sostituisce la cronologia completa della conversazione. Vedi [Compattazione](#client-side-compaction-sdk) di seguito. |

## Strategie lato server

<Note>
La modifica del contesto è attualmente in beta con supporto per la cancellazione dei risultati degli strumenti e la cancellazione dei blocchi di pensiero. Per abilitarla, utilizza l'intestazione beta `context-management-2025-06-27` nelle tue richieste API.

Ti invitiamo a contattarci tramite il nostro [modulo di feedback](https://forms.gle/YXC2EKGMhjN1c4L88) per condividere il tuo feedback su questa funzione.
</Note>

### Cancellazione dei risultati degli strumenti

La strategia `clear_tool_uses_20250919` cancella i risultati degli strumenti quando il contesto della conversazione cresce oltre la soglia configurata. Quando attivata, l'API cancella automaticamente i risultati degli strumenti più vecchi in ordine cronologico, sostituendoli con testo segnaposto per far sapere a Claude che il risultato dello strumento è stato rimosso. Per impostazione predefinita, vengono cancellati solo i risultati degli strumenti. Puoi facoltativamente cancellare sia i risultati degli strumenti che le chiamate degli strumenti (i parametri di utilizzo dello strumento) impostando `clear_tool_inputs` su true.

### Cancellazione dei blocchi di pensiero

La strategia `clear_thinking_20251015` gestisce i blocchi `thinking` nelle conversazioni quando il pensiero esteso è abilitato. Questa strategia cancella automaticamente i blocchi di pensiero più vecchi dai turni precedenti.

<Tip>
**Comportamento predefinito**: Quando il pensiero esteso è abilitato senza configurare la strategia `clear_thinking_20251015`, l'API mantiene automaticamente solo i blocchi di pensiero dall'ultimo turno dell'assistente (equivalente a `keep: {type: "thinking_turns", value: 1}`).

Per massimizzare i cache hit, preserva tutti i blocchi di pensiero impostando `keep: "all"`.
</Tip>

<Note>
Un turno di conversazione dell'assistente può includere più blocchi di contenuto (ad es. quando si utilizzano strumenti) e più blocchi di pensiero (ad es. con [pensiero intercalato](/docs/it/build-with-claude/extended-thinking#interleaved-thinking)).
</Note>

<Tip>
**La modifica del contesto avviene lato server**

La modifica del contesto viene applicata **lato server** prima che il prompt raggiunga Claude. La tua applicazione client mantiene la cronologia completa e non modificata della conversazione—non è necessario sincronizzare lo stato del tuo client con la versione modificata. Continua a gestire la tua cronologia completa della conversazione localmente come faresti normalmente.
</Tip>

<Tip>
**Modifica del contesto e caching del prompt**

L'interazione della modifica del contesto con il [caching del prompt](/docs/it/build-with-claude/prompt-caching) varia a seconda della strategia:

- **Cancellazione dei risultati degli strumenti**: Invalida i prefissi del prompt memorizzati nella cache quando il contenuto viene cancellato. Per tenerne conto, consigliamo di cancellare abbastanza token per rendere l'invalidazione della cache utile. Utilizza il parametro `clear_at_least` per garantire che un numero minimo di token venga cancellato ogni volta. Sostenirai costi di scrittura della cache ogni volta che il contenuto viene cancellato, ma le richieste successive possono riutilizzare il prefisso appena memorizzato nella cache.

- **Cancellazione dei blocchi di pensiero**: Quando i blocchi di pensiero sono **mantenuti** nel contesto (non cancellati), la cache del prompt viene preservata, abilitando i cache hit e riducendo i costi dei token di input. Quando i blocchi di pensiero sono **cancellati**, la cache viene invalidata nel punto in cui si verifica la cancellazione. Configura il parametro `keep` in base al fatto che tu voglia dare priorità alle prestazioni della cache o alla disponibilità della finestra di contesto.
</Tip>

## Modelli supportati

La modifica del contesto è disponibile su:

- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)
- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)

## Utilizzo della cancellazione dei risultati degli strumenti

Il modo più semplice per abilitare la cancellazione dei risultati degli strumenti è specificare solo il tipo di strategia, poiché tutte le altre [opzioni di configurazione](#configuration-options-for-tool-result-clearing) utilizzeranno i loro valori predefiniti:

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": "Search for recent developments in AI"
            }
        ],
        "tools": [
            {
                "type": "web_search_20250305",
                "name": "web_search"
            }
        ],
        "context_management": {
            "edits": [
                {"type": "clear_tool_uses_20250919"}
            ]
        }
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Search for recent developments in AI"
        }
    ],
    tools=[
        {
            "type": "web_search_20250305",
            "name": "web_search"
        }
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {"type": "clear_tool_uses_20250919"}
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [
    {
      role: "user",
      content: "Search for recent developments in AI"
    }
  ],
  tools: [
    {
      type: "web_search_20250305",
      name: "web_search"
    }
  ],
  context_management: {
    edits: [
      { type: "clear_tool_uses_20250919" }
    ]
  },
  betas: ["context-management-2025-06-27"]
});
```

</CodeGroup>

### Configurazione avanzata

Puoi personalizzare il comportamento della cancellazione dei risultati degli strumenti con parametri aggiuntivi:

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": "Create a simple command line calculator app using Python"
            }
        ],
        "tools": [
            {
                "type": "text_editor_20250728",
                "name": "str_replace_based_edit_tool",
                "max_characters": 10000
            },
            {
                "type": "web_search_20250305",
                "name": "web_search",
                "max_uses": 3
            }
        ],
        "context_management": {
            "edits": [
                {
                    "type": "clear_tool_uses_20250919",
                    "trigger": {
                        "type": "input_tokens",
                        "value": 30000
                    },
                    "keep": {
                        "type": "tool_uses",
                        "value": 3
                    },
                    "clear_at_least": {
                        "type": "input_tokens",
                        "value": 5000
                    },
                    "exclude_tools": ["web_search"]
                }
            ]
        }
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Create a simple command line calculator app using Python"
        }
    ],
    tools=[
        {
            "type": "text_editor_20250728",
            "name": "str_replace_based_edit_tool",
            "max_characters": 10000
        },
        {
            "type": "web_search_20250305",
            "name": "web_search",
            "max_uses": 3
        }
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_tool_uses_20250919",
                # Trigger clearing when threshold is exceeded
                "trigger": {
                    "type": "input_tokens",
                    "value": 30000
                },
                # Number of tool uses to keep after clearing
                "keep": {
                    "type": "tool_uses",
                    "value": 3
                },
                # Optional: Clear at least this many tokens
                "clear_at_least": {
                    "type": "input_tokens",
                    "value": 5000
                },
                # Exclude these tools from being cleared
                "exclude_tools": ["web_search"]
            }
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [
    {
      role: "user",
      content: "Create a simple command line calculator app using Python"
    }
  ],
  tools: [
    {
      type: "text_editor_20250728",
      name: "str_replace_based_edit_tool",
      max_characters: 10000
    },
    {
      type: "web_search_20250305",
      name: "web_search",
      max_uses: 3
    }
  ],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_tool_uses_20250919",
        // Trigger clearing when threshold is exceeded
        trigger: {
          type: "input_tokens",
          value: 30000
        },
        // Number of tool uses to keep after clearing
        keep: {
          type: "tool_uses",
          value: 3
        },
        // Optional: Clear at least this many tokens
        clear_at_least: {
          type: "input_tokens",
          value: 5000
        },
        // Exclude these tools from being cleared
        exclude_tools: ["web_search"]
      }
    ]
  }
});
```

</CodeGroup>

## Utilizzo della cancellazione dei blocchi di pensiero

Abilita la cancellazione dei blocchi di pensiero per gestire efficacemente il contesto e il caching del prompt quando il pensiero esteso è abilitato:

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5-20250929",
        "max_tokens": 1024,
        "messages": [...],
        "thinking": {
            "type": "enabled",
            "budget_tokens": 10000
        },
        "context_management": {
            "edits": [
                {
                    "type": "clear_thinking_20251015",
                    "keep": {
                        "type": "thinking_turns",
                        "value": 2
                    }
                }
            ]
        }
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[...],
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_thinking_20251015",
                "keep": {
                    "type": "thinking_turns",
                    "value": 2
                }
            }
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  messages: [...],
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_thinking_20251015",
        keep: {
          type: "thinking_turns",
          value: 2
        }
      }
    ]
  }
});
```

</CodeGroup>

### Opzioni di configurazione per la cancellazione dei blocchi di pensiero

La strategia `clear_thinking_20251015` supporta la seguente configurazione:

| Opzione di configurazione | Predefinito | Descrizione |
|---------------------|---------|-------------|
| `keep` | `{type: "thinking_turns", value: 1}` | Definisce quanti turni recenti dell'assistente con blocchi di pensiero preservare. Utilizza `{type: "thinking_turns", value: N}` dove N deve essere > 0 per mantenere gli ultimi N turni, o `"all"` per mantenere tutti i blocchi di pensiero. |

**Configurazioni di esempio:**

```json
// Keep thinking blocks from the last 3 assistant turns
{
  "type": "clear_thinking_20251015",
  "keep": {
    "type": "thinking_turns",
    "value": 3
  }
}

// Keep all thinking blocks (maximizes cache hits)
{
  "type": "clear_thinking_20251015",
  "keep": "all"
}
```

### Opzioni di configurazione per la cancellazione dei blocchi di pensiero

La strategia `clear_thinking_20251015` supporta la seguente configurazione:

| Opzione di configurazione | Predefinito | Descrizione |
|---------------------|---------|-------------|
| `keep` | `{type: "thinking_turns", value: 1}` | Definisce quanti turni recenti dell'assistente con blocchi di pensiero preservare. Utilizza `{type: "thinking_turns", value: N}` dove N deve essere > 0 per mantenere gli ultimi N turni, o `"all"` per mantenere tutti i blocchi di pensiero. |

**Configurazioni di esempio:**

```json
// Keep thinking blocks from the last 3 assistant turns
{
  "type": "clear_thinking_20251015",
  "keep": {
    "type": "thinking_turns",
    "value": 3
  }
}

// Keep all thinking blocks (maximizes cache hits)
{
  "type": "clear_thinking_20251015",
  "keep": "all"
}
```

### Combinazione di strategie

Puoi utilizzare sia la cancellazione dei blocchi di pensiero che la cancellazione dei risultati degli strumenti insieme:

<Note>
Quando si utilizzano più strategie, la strategia `clear_thinking_20251015` deve essere elencata per prima nell'array `edits`.
</Note>

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[...],
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    tools=[...],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_thinking_20251015",
                "keep": {
                    "type": "thinking_turns",
                    "value": 2
                }
            },
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {
                    "type": "input_tokens",
                    "value": 50000
                },
                "keep": {
                    "type": "tool_uses",
                    "value": 5
                }
            }
        ]
    }
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  messages: [...],
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  tools: [...],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_thinking_20251015",
        keep: {
          type: "thinking_turns",
          value: 2
        }
      },
      {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: 50000
        },
        keep: {
          type: "tool_uses",
          value: 5
        }
      }
    ]
  }
});
```

</CodeGroup>

### Opzioni di configurazione per la cancellazione dei blocchi di pensiero

La strategia `clear_thinking_20251015` supporta la seguente configurazione:

| Opzione di configurazione | Predefinito | Descrizione |
|---------------------|---------|-------------|
| `keep` | `{type: "thinking_turns", value: 1}` | Definisce quanti turni recenti dell'assistente con blocchi di pensiero preservare. Utilizza `{type: "thinking_turns", value: N}` dove N deve essere > 0 per mantenere gli ultimi N turni, o `"all"` per mantenere tutti i blocchi di pensiero. |

**Configurazioni di esempio:**

```json
// Keep thinking blocks from the last 3 assistant turns
{
  "type": "clear_thinking_20251015",
  "keep": {
    "type": "thinking_turns",
    "value": 3
  }
}

// Keep all thinking blocks (maximizes cache hits)
{
  "type": "clear_thinking_20251015",
  "keep": "all"
}
```

### Combinazione di strategie

Puoi utilizzare sia la cancellazione dei blocchi di pensiero che la cancellazione dei risultati degli strumenti insieme:

<Note>
Quando si utilizzano più strategie, la strategia `clear_thinking_20251015` deve essere elencata per prima nell'array `edits`.
</Note>

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[...],
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    tools=[...],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_thinking_20251015",
                "keep": {
                    "type": "thinking_turns",
                    "value": 2
                }
            },
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {
                    "type": "input_tokens",
                    "value": 50000
                },
                "keep": {
                    "type": "tool_uses",
                    "value": 5
                }
            }
        ]
    }
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  messages: [...],
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  tools: [...],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_thinking_20251015",
        keep: {
          type: "thinking_turns",
          value: 2
        }
      },
      {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: 50000
        },
        keep: {
          type: "tool_uses",
          value: 5
        }
      }
    ]
  }
});
```

</CodeGroup>

## Opzioni di configurazione per la cancellazione dei risultati degli strumenti

| Opzione di configurazione | Predefinito | Descrizione |
|---------------------|---------|-------------|
| `trigger` | 100.000 token di input | Definisce quando la strategia di modifica del contesto si attiva. Una volta che il prompt supera questa soglia, la cancellazione inizierà. Puoi specificare questo valore in `input_tokens` o `tool_uses`. |
| `keep` | 3 utilizzi di strumenti | Definisce quante coppie recenti di utilizzo/risultato dello strumento mantenere dopo che si verifica la cancellazione. L'API rimuove prima le interazioni degli strumenti più vecchie, preservando le più recenti. |
| `clear_at_least` | Nessuno | Garantisce che un numero minimo di token venga cancellato ogni volta che la strategia si attiva. Se l'API non riesce a cancellare almeno l'importo specificato, la strategia non verrà applicata. Questo aiuta a determinare se la cancellazione del contesto vale la pena di interrompere la cache del prompt. |
| `exclude_tools` | Nessuno | Elenco dei nomi degli strumenti i cui utilizzi e risultati non devono mai essere cancellati. Utile per preservare il contesto importante. |
| `clear_tool_inputs` | `false` | Controlla se i parametri della chiamata dello strumento vengono cancellati insieme ai risultati dello strumento. Per impostazione predefinita, vengono cancellati solo i risultati dello strumento mentre le chiamate dello strumento originali di Claude rimangono visibili. |

### Opzioni di configurazione per la cancellazione dei blocchi di pensiero

La strategia `clear_thinking_20251015` supporta la seguente configurazione:

| Opzione di configurazione | Predefinito | Descrizione |
|---------------------|---------|-------------|
| `keep` | `{type: "thinking_turns", value: 1}` | Definisce quanti turni recenti dell'assistente con blocchi di pensiero preservare. Utilizza `{type: "thinking_turns", value: N}` dove N deve essere > 0 per mantenere gli ultimi N turni, o `"all"` per mantenere tutti i blocchi di pensiero. |

**Configurazioni di esempio:**

```json
// Keep thinking blocks from the last 3 assistant turns
{
  "type": "clear_thinking_20251015",
  "keep": {
    "type": "thinking_turns",
    "value": 3
  }
}

// Keep all thinking blocks (maximizes cache hits)
{
  "type": "clear_thinking_20251015",
  "keep": "all"
}
```

### Combinazione di strategie

Puoi utilizzare sia la cancellazione dei blocchi di pensiero che la cancellazione dei risultati degli strumenti insieme:

<Note>
Quando si utilizzano più strategie, la strategia `clear_thinking_20251015` deve essere elencata per prima nell'array `edits`.
</Note>

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[...],
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    tools=[...],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_thinking_20251015",
                "keep": {
                    "type": "thinking_turns",
                    "value": 2
                }
            },
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {
                    "type": "input_tokens",
                    "value": 50000
                },
                "keep": {
                    "type": "tool_uses",
                    "value": 5
                }
            }
        ]
    }
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  messages: [...],
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  tools: [...],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_thinking_20251015",
        keep: {
          type: "thinking_turns",
          value: 2
        }
      },
      {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: 50000
        },
        keep: {
          type: "tool_uses",
          value: 5
        }
      }
    ]
  }
});
```

</CodeGroup>

## Opzioni di configurazione per la cancellazione dei risultati degli strumenti

| Opzione di configurazione | Predefinito | Descrizione |
|---------------------|---------|-------------|
| `trigger` | 100.000 token di input | Definisce quando la strategia di modifica del contesto si attiva. Una volta che il prompt supera questa soglia, la cancellazione inizierà. Puoi specificare questo valore in `input_tokens` o `tool_uses`. |
| `keep` | 3 utilizzi di strumenti | Definisce quante coppie recenti di utilizzo/risultato dello strumento mantenere dopo che si verifica la cancellazione. L'API rimuove prima le interazioni degli strumenti più vecchie, preservando le più recenti. |
| `clear_at_least` | Nessuno | Garantisce che un numero minimo di token venga cancellato ogni volta che la strategia si attiva. Se l'API non riesce a cancellare almeno l'importo specificato, la strategia non verrà applicata. Questo aiuta a determinare se la cancellazione del contesto vale la pena di interrompere la cache del prompt. |
| `exclude_tools` | Nessuno | Elenco dei nomi degli strumenti i cui utilizzi e risultati non devono mai essere cancellati. Utile per preservare il contesto importante. |
| `clear_tool_inputs` | `false` | Controlla se i parametri della chiamata dello strumento vengono cancellati insieme ai risultati dello strumento. Per impostazione predefinita, vengono cancellati solo i risultati dello strumento mentre le chiamate dello strumento originali di Claude rimangono visibili. |

## Risposta della modifica del contesto

Puoi vedere quali modifiche del contesto sono state applicate alla tua richiesta utilizzando il campo di risposta `context_management`, insieme a statistiche utili sul contenuto e sui token di input cancellati.

```json Response
{
    "id": "msg_013Zva2CMHLNnXjNJJKqJ2EF",
    "type": "message",
    "role": "assistant",
    "content": [...],
    "usage": {...},
    "context_management": {
        "applied_edits": [
            // When using `clear_thinking_20251015`
            {
                "type": "clear_thinking_20251015",
                "cleared_thinking_turns": 3,
                "cleared_input_tokens": 15000
            },
            // When using `clear_tool_uses_20250919`
            {
                "type": "clear_tool_uses_20250919",
                "cleared_tool_uses": 8,
                "cleared_input_tokens": 50000
            }
        ]
    }
}
```

Per le risposte in streaming, le modifiche del contesto saranno incluse nell'evento finale `message_delta`:

```json Streaming Response
{
    "type": "message_delta",
    "delta": {
        "stop_reason": "end_turn",
        "stop_sequence": null
    },
    "usage": {
        "output_tokens": 1024
    },
    "context_management": {
        "applied_edits": [...]
    }
}
```

### Opzioni di configurazione per la cancellazione dei blocchi di pensiero

La strategia `clear_thinking_20251015` supporta la seguente configurazione:

| Opzione di configurazione | Predefinito | Descrizione |
|---------------------|---------|-------------|
| `keep` | `{type: "thinking_turns", value: 1}` | Definisce quanti turni recenti dell'assistente con blocchi di pensiero preservare. Usa `{type: "thinking_turns", value: N}` dove N deve essere > 0 per mantenere gli ultimi N turni, o `"all"` per mantenere tutti i blocchi di pensiero. |

**Configurazioni di esempio:**

```json
// Mantieni i blocchi di pensiero degli ultimi 3 turni dell'assistente
{
  "type": "clear_thinking_20251015",
  "keep": {
    "type": "thinking_turns",
    "value": 3
  }
}

// Mantieni tutti i blocchi di pensiero (massimizza i hit della cache)
{
  "type": "clear_thinking_20251015",
  "keep": "all"
}
```

### Combinazione di strategie

Puoi utilizzare sia la cancellazione dei blocchi di pensiero che la cancellazione dei risultati degli strumenti insieme:

<Note>
Quando utilizzi più strategie, la strategia `clear_thinking_20251015` deve essere elencata per prima nell'array `edits`.
</Note>

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[...],
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    tools=[...],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_thinking_20251015",
                "keep": {
                    "type": "thinking_turns",
                    "value": 2
                }
            },
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {
                    "type": "input_tokens",
                    "value": 50000
                },
                "keep": {
                    "type": "tool_uses",
                    "value": 5
                }
            }
        ]
    }
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  messages: [...],
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  tools: [...],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_thinking_20251015",
        keep: {
          type: "thinking_turns",
          value: 2
        }
      },
      {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: 50000
        },
        keep: {
          type: "tool_uses",
          value: 5
        }
      }
    ]
  }
});
```

</CodeGroup>

## Opzioni di configurazione per la cancellazione dei risultati degli strumenti

| Opzione di configurazione | Predefinito | Descrizione |
|---------------------|---------|-------------|
| `trigger` | 100.000 token di input | Definisce quando la strategia di modifica del contesto si attiva. Una volta che il prompt supera questa soglia, la cancellazione avrà inizio. Puoi specificare questo valore in `input_tokens` o `tool_uses`. |
| `keep` | 3 utilizzi di strumenti | Definisce quante coppie recenti di utilizzo/risultato dello strumento mantenere dopo che si verifica la cancellazione. L'API rimuove prima le interazioni degli strumenti più vecchie, preservando le più recenti. |
| `clear_at_least` | Nessuno | Garantisce che un numero minimo di token venga cancellato ogni volta che la strategia si attiva. Se l'API non riesce a cancellare almeno l'importo specificato, la strategia non verrà applicata. Questo aiuta a determinare se la cancellazione del contesto vale la pena di interrompere la cache del tuo prompt. |
| `exclude_tools` | Nessuno | Elenco dei nomi degli strumenti i cui utilizzi e risultati non devono mai essere cancellati. Utile per preservare il contesto importante. |
| `clear_tool_inputs` | `false` | Controlla se i parametri della chiamata dello strumento vengono cancellati insieme ai risultati dello strumento. Per impostazione predefinita, solo i risultati dello strumento vengono cancellati mentre le chiamate dello strumento originali di Claude rimangono visibili. |

## Risposta della modifica del contesto

Puoi vedere quali modifiche del contesto sono state applicate alla tua richiesta utilizzando il campo di risposta `context_management`, insieme a statistiche utili sul contenuto e sui token di input cancellati.

```json Response
{
    "id": "msg_013Zva2CMHLNnXjNJJKqJ2EF",
    "type": "message",
    "role": "assistant",
    "content": [...],
    "usage": {...},
    "context_management": {
        "applied_edits": [
            // Quando utilizzi `clear_thinking_20251015`
            {
                "type": "clear_thinking_20251015",
                "cleared_thinking_turns": 3,
                "cleared_input_tokens": 15000
            },
            // Quando utilizzi `clear_tool_uses_20250919`
            {
                "type": "clear_tool_uses_20250919",
                "cleared_tool_uses": 8,
                "cleared_input_tokens": 50000
            }
        ]
    }
}
```

Per le risposte in streaming, le modifiche del contesto saranno incluse nell'evento finale `message_delta`:

```json Streaming Response
{
    "type": "message_delta",
    "delta": {
        "stop_reason": "end_turn",
        "stop_sequence": null
    },
    "usage": {
        "output_tokens": 1024
    },
    "context_management": {
        "applied_edits": [...]
    }
}
```

## Conteggio dei token

L'endpoint di [conteggio dei token](/docs/it/build-with-claude/token-counting) supporta la gestione del contesto, permettendoti di visualizzare in anteprima quanti token utilizzerà il tuo prompt dopo che la modifica del contesto è stata applicata.

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages/count_tokens \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "messages": [
            {
                "role": "user",
                "content": "Continue our conversation..."
            }
        ],
        "tools": [...],
        "context_management": {
            "edits": [
                {
                    "type": "clear_tool_uses_20250919",
                    "trigger": {
                        "type": "input_tokens",
                        "value": 30000
                    },
                    "keep": {
                        "type": "tool_uses",
                        "value": 5
                    }
                }
            ]
        }
    }'
```

```python Python
response = client.beta.messages.count_tokens(
    model="claude-sonnet-4-5",
    messages=[
        {
            "role": "user",
            "content": "Continue our conversation..."
        }
    ],
    tools=[...],  # Your tool definitions
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {
                    "type": "input_tokens",
                    "value": 30000
                },
                "keep": {
                    "type": "tool_uses",
                    "value": 5
                }
            }
        ]
    }
)

print(f"Original tokens: {response.context_management['original_input_tokens']}")
print(f"After clearing: {response.input_tokens}")
print(f"Savings: {response.context_management['original_input_tokens'] - response.input_tokens} tokens")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.countTokens({
  model: "claude-sonnet-4-5",
  messages: [
    {
      role: "user",
      content: "Continue our conversation..."
    }
  ],
  tools: [...],  // Your tool definitions
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: 30000
        },
        keep: {
          type: "tool_uses",
          value: 5
        }
      }
    ]
  }
});

console.log(`Original tokens: ${response.context_management?.original_input_tokens}`);
console.log(`After clearing: ${response.input_tokens}`);
console.log(`Savings: ${(response.context_management?.original_input_tokens || 0) - response.input_tokens} tokens`);
```
</CodeGroup>

```json Response
{
    "input_tokens": 25000,
    "context_management": {
        "original_input_tokens": 70000
    }
}
```

La risposta mostra sia il conteggio finale dei token dopo che la gestione del contesto è stata applicata (`input_tokens`) che il conteggio originale dei token prima che si verificasse qualsiasi cancellazione (`original_input_tokens`).

## Utilizzo con lo strumento Memory

La modifica del contesto può essere combinata con lo [strumento memory](/docs/it/agents-and-tools/tool-use/memory-tool). Quando il contesto della tua conversazione si avvicina alla soglia di cancellazione configurata, Claude riceve un avviso automatico per preservare le informazioni importanti. Questo consente a Claude di salvare i risultati degli strumenti o il contesto nei suoi file di memoria prima che vengano cancellati dalla cronologia della conversazione.

Questa combinazione ti consente di:

- **Preservare il contesto importante**: Claude può scrivere informazioni essenziali dai risultati degli strumenti nei file di memoria prima che quei risultati vengano cancellati
- **Mantenere flussi di lavoro di lunga durata**: Abilitare flussi di lavoro agentici che altrimenti supererebbero i limiti del contesto scaricando le informazioni in un'archiviazione persistente
- **Accedere alle informazioni su richiesta**: Claude può cercare informazioni precedentemente cancellate dai file di memoria quando necessario, piuttosto che mantenere tutto nella finestra di contesto attiva

Ad esempio, in un flusso di lavoro di modifica dei file in cui Claude esegue molte operazioni, Claude può riassumere le modifiche completate nei file di memoria man mano che il contesto cresce. Quando i risultati degli strumenti vengono cancellati, Claude mantiene l'accesso a queste informazioni attraverso il suo sistema di memoria e può continuare a lavorare in modo efficace.

Per utilizzare entrambe le funzionalità insieme, abilitale nella tua richiesta API:

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[...],
    tools=[
        {
            "type": "memory_20250818",
            "name": "memory"
        },
        # Your other tools
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {"type": "clear_tool_uses_20250919"}
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [...],
  tools: [
    {
      type: "memory_20250818",
      name: "memory"
    },
    // Your other tools
  ],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      { type: "clear_tool_uses_20250919" }
    ]
  }
});
```

</CodeGroup>

## Compattazione lato client (SDK)

<Note>
La compattazione è disponibile negli [SDK Python e TypeScript](/docs/it/api/client-sdks) quando si utilizza il metodo [`tool_runner`](/docs/it/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta).
</Note>

La compattazione è una funzionalità SDK che gestisce automaticamente il contesto della conversazione generando riassunti quando l'utilizzo dei token diventa troppo grande. A differenza delle strategie di modifica del contesto lato server che cancellano il contenuto, la compattazione istruisce Claude a riassumere la cronologia della conversazione, quindi sostituisce la cronologia completa con quel riassunto. Questo consente a Claude di continuare a lavorare su attività di lunga durata che altrimenti supererebbero la [finestra di contesto](/docs/it/build-with-claude/context-windows).

### Come funziona la compattazione

Quando la compattazione è abilitata, l'SDK monitora l'utilizzo dei token dopo ogni risposta del modello:

1. **Controllo della soglia**: L'SDK calcola i token totali come `input_tokens + cache_creation_input_tokens + cache_read_input_tokens + output_tokens`
2. **Generazione del riassunto**: Quando la soglia viene superata, un prompt di riassunto viene iniettato come turno dell'utente e Claude genera un riassunto strutturato racchiuso in tag `<summary></summary>`
3. **Sostituzione del contesto**: L'SDK estrae il riassunto e sostituisce l'intera cronologia dei messaggi con esso
4. **Continuazione**: La conversazione riprende dal riassunto, con Claude che continua da dove era rimasto

### Utilizzo della compattazione

Aggiungi `compaction_control` alla tua chiamata `tool_runner`:

<CodeGroup>

```python Python
import anthropic

client = anthropic.Anthropic()

runner = client.beta.messages.tool_runner(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    tools=[...],
    messages=[
        {
            "role": "user",
            "content": "Analyze all the files in this directory and write a summary report."
        }
    ],
    compaction_control={
        "enabled": True,
        "context_token_threshold": 100000
    }
)

for message in runner:
    print(f"Tokens used: {message.usage.input_tokens}")

final = runner.until_done()
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const runner = client.beta.messages.toolRunner({
    model: 'claude-sonnet-4-5',
    max_tokens: 4096,
    tools: [...],
    messages: [
        {
            role: 'user',
            content: 'Analyze all the files in this directory and write a summary report.'
        }
    ],
    compactionControl: {
        enabled: true,
        contextTokenThreshold: 100000
    }
});

for await (const message of runner) {
    console.log('Tokens used:', message.usage.input_tokens);
}

const finalMessage = await runner.runUntilDone();
```

</CodeGroup>

#### Cosa accade durante la compattazione

Man mano che la conversazione cresce, la cronologia dei messaggi si accumula:

**Prima della compattazione (avvicinandosi a 100k token):**
```json
[
  { "role": "user", "content": "Analyze all files and write a report..." },
  { "role": "assistant", "content": "I'll help. Let me start by reading..." },
  { "role": "user", "content": [{ "type": "tool_result", "tool_use_id": "...", "content": "..." }] },
  { "role": "assistant", "content": "Based on file1.txt, I see..." },
  { "role": "user", "content": [{ "type": "tool_result", "tool_use_id": "...", "content": "..." }] },
  { "role": "assistant", "content": "After analyzing file2.txt..." },
  // ... 50 more exchanges like this ...
]
```

Quando i token superano la soglia, l'SDK inietta una richiesta di riassunto e Claude genera un riassunto. L'intera cronologia viene quindi sostituita:

**Dopo la compattazione (tornato a ~2-3k token):**
```json
[
  {
    "role": "assistant",
    "content": "# Task Overview\nThe user requested analysis of directory files to produce a summary report...\n\n# Current State\nAnalyzed 52 files across 3 subdirectories. Key findings documented in report.md...\n\n# Important Discoveries\n- Configuration files use YAML format\n- Found 3 deprecated dependencies\n- Test coverage at 67%\n\n# Next Steps\n1. Analyze remaining files in /src/legacy\n2. Complete final report sections...\n\n# Context to Preserve\nUser prefers markdown format with executive summary first..."
  }
]
```

Claude continua a lavorare da questo riassunto come se fosse la cronologia della conversazione originale.

### Opzioni di configurazione

| Parametro | Tipo | Obbligatorio | Predefinito | Descrizione |
|-----------|------|----------|---------|-------------|
| `enabled` | boolean | Sì | - | Se abilitare la compattazione automatica |
| `context_token_threshold` | number | No | 100.000 | Conteggio dei token a cui si attiva la compattazione |
| `model` | string | No | Stesso modello principale | Modello da utilizzare per generare i riassunti |
| `summary_prompt` | string | No | Vedi sotto | Prompt personalizzato per la generazione del riassunto |

#### Scelta di una soglia di token

La soglia determina quando si verifica la compattazione. Una soglia più bassa significa compattazioni più frequenti con finestre di contesto più piccole. Una soglia più alta consente più contesto ma rischia di raggiungere i limiti.

<CodeGroup>

```python Python
# More frequent compaction for memory-constrained scenarios
compaction_control={
    "enabled": True,
    "context_token_threshold": 50000
}

# Less frequent compaction when you need more context
compaction_control={
    "enabled": True,
    "context_token_threshold": 150000
}
```

```typescript TypeScript
// More frequent compaction for memory-constrained scenarios
compactionControl: {
    enabled: true,
    contextTokenThreshold: 50000
}

// Less frequent compaction when you need more context
compactionControl: {
    enabled: true,
    contextTokenThreshold: 150000
}
```

</CodeGroup>

#### Utilizzo di un modello diverso per i riassunti

Puoi utilizzare un modello più veloce o più economico per generare i riassunti:

<CodeGroup>

```python Python
compaction_control={
    "enabled": True,
    "context_token_threshold": 100000,
    "model": "claude-haiku-4-5"
}
```

```typescript TypeScript
compactionControl: {
    enabled: true,
    contextTokenThreshold: 100000,
    model: 'claude-haiku-4-5'
}
```

</CodeGroup>

#### Prompt di riassunto personalizzati

Puoi fornire un prompt personalizzato per esigenze specifiche del dominio. Il tuo prompt dovrebbe istruire Claude a racchiudere il suo riassunto in tag `<summary></summary>`.

<CodeGroup>

```python Python
compaction_control={
    "enabled": True,
    "context_token_threshold": 100000,
    "summary_prompt": """Summarize the research conducted so far, including:
- Sources consulted and key findings
- Questions answered and remaining unknowns
- Recommended next steps

Wrap your summary in <summary></summary> tags."""
}
```

```typescript TypeScript
compactionControl: {
    enabled: true,
    contextTokenThreshold: 100000,
    summaryPrompt: `Summarize the research conducted so far, including:
- Sources consulted and key findings
- Questions answered and remaining unknowns
- Recommended next steps

Wrap your summary in <summary></summary> tags.`
}
```

</CodeGroup>

## Utilizzo con lo strumento Memory

La modifica del contesto può essere combinata con lo [strumento memory](/docs/it/agents-and-tools/tool-use/memory-tool). Quando il contesto della conversazione si avvicina alla soglia di cancellazione configurata, Claude riceve un avviso automatico per preservare le informazioni importanti. Ciò consente a Claude di salvare i risultati degli strumenti o il contesto nei file di memoria prima che vengano cancellati dalla cronologia della conversazione.

Questa combinazione ti consente di:

- **Preservare il contesto importante**: Claude può scrivere informazioni essenziali dai risultati degli strumenti nei file di memoria prima che questi risultati vengano cancellati
- **Mantenere flussi di lavoro a lungo termine**: Abilitare flussi di lavoro agentici che altrimenti supererebbero i limiti di contesto trasferendo le informazioni a un'archiviazione persistente
- **Accedere alle informazioni su richiesta**: Claude può cercare informazioni precedentemente cancellate dai file di memoria quando necessario, piuttosto che mantenere tutto nella finestra di contesto attiva

Ad esempio, in un flusso di lavoro di modifica dei file in cui Claude esegue molte operazioni, Claude può riassumere le modifiche completate nei file di memoria man mano che il contesto cresce. Quando i risultati degli strumenti vengono cancellati, Claude mantiene l'accesso a tali informazioni attraverso il suo sistema di memoria e può continuare a lavorare in modo efficace.

Per utilizzare entrambe le funzioni insieme, abilitale nella tua richiesta API:

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[...],
    tools=[
        {
            "type": "memory_20250818",
            "name": "memory"
        },
        # Your other tools
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {"type": "clear_tool_uses_20250919"}
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [...],
  tools: [
    {
      type: "memory_20250818",
      name: "memory"
    },
    // Your other tools
  ],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      { type: "clear_tool_uses_20250919" }
    ]
  }
});
```

</CodeGroup>

## Compattazione lato client (SDK)

<Note>
La compattazione è disponibile negli [SDK Python e TypeScript](/docs/it/api/client-sdks) quando si utilizza il [metodo `tool_runner`](/docs/it/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta).
</Note>

La compattazione è una funzione SDK che gestisce automaticamente il contesto della conversazione generando riassunti quando l'utilizzo dei token diventa troppo grande. A differenza delle strategie di modifica del contesto lato server che cancellano il contenuto, la compattazione istruisce Claude a riassumere la cronologia della conversazione, quindi sostituisce la cronologia completa con quel riassunto. Ciò consente a Claude di continuare a lavorare su attività a lungo termine che altrimenti supererebbero la [finestra di contesto](/docs/it/build-with-claude/context-windows).

### Come funziona la compattazione

Quando la compattazione è abilitata, l'SDK monitora l'utilizzo dei token dopo ogni risposta del modello:

1. **Controllo della soglia**: L'SDK calcola i token totali come `input_tokens + cache_creation_input_tokens + cache_read_input_tokens + output_tokens`
2. **Generazione del riassunto**: Quando la soglia viene superata, un prompt di riassunto viene iniettato come turno dell'utente e Claude genera un riassunto strutturato racchiuso in tag `<summary></summary>`
3. **Sostituzione del contesto**: L'SDK estrae il riassunto e sostituisce l'intera cronologia dei messaggi con esso
4. **Continuazione**: La conversazione riprende dal riassunto, con Claude che continua da dove si era fermato

### Utilizzo della compattazione

Aggiungi `compaction_control` alla tua chiamata `tool_runner`:

<CodeGroup>

```python Python
import anthropic

client = anthropic.Anthropic()

runner = client.beta.messages.tool_runner(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    tools=[...],
    messages=[
        {
            "role": "user",
            "content": "Analyze all the files in this directory and write a summary report."
        }
    ],
    compaction_control={
        "enabled": True,
        "context_token_threshold": 100000
    }
)

for message in runner:
    print(f"Tokens used: {message.usage.input_tokens}")

final = runner.until_done()
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const runner = client.beta.messages.toolRunner({
    model: 'claude-sonnet-4-5',
    max_tokens: 4096,
    tools: [...],
    messages: [
        {
            role: 'user',
            content: 'Analyze all the files in this directory and write a summary report.'
        }
    ],
    compactionControl: {
        enabled: true,
        contextTokenThreshold: 100000
    }
});

for await (const message of runner) {
    console.log('Tokens used:', message.usage.input_tokens);
}

const finalMessage = await runner.runUntilDone();
```

</CodeGroup>

#### Cosa accade durante la compattazione

Man mano che la conversazione cresce, la cronologia dei messaggi si accumula:

**Prima della compattazione (avvicinandosi a 100k token):**
```json
[
  { "role": "user", "content": "Analyze all files and write a report..." },
  { "role": "assistant", "content": "I'll help. Let me start by reading..." },
  { "role": "user", "content": [{ "type": "tool_result", "tool_use_id": "...", "content": "..." }] },
  { "role": "assistant", "content": "Based on file1.txt, I see..." },
  { "role": "user", "content": [{ "type": "tool_result", "tool_use_id": "...", "content": "..." }] },
  { "role": "assistant", "content": "After analyzing file2.txt..." },
  // ... 50 more exchanges like this ...
]
```

Quando i token superano la soglia, l'SDK inietta una richiesta di riassunto e Claude genera un riassunto. L'intera cronologia viene quindi sostituita:

**Dopo la compattazione (tornando a ~2-3k token):**
```json
[
  {
    "role": "assistant",
    "content": "# Task Overview\nThe user requested analysis of directory files to produce a summary report...\n\n# Current State\nAnalyzed 52 files across 3 subdirectories. Key findings documented in report.md...\n\n# Important Discoveries\n- Configuration files use YAML format\n- Found 3 deprecated dependencies\n- Test coverage at 67%\n\n# Next Steps\n1. Analyze remaining files in /src/legacy\n2. Complete final report sections...\n\n# Context to Preserve\nUser prefers markdown format with executive summary first..."
  }
]
```

Claude continua a lavorare da questo riassunto come se fosse la cronologia della conversazione originale.

### Opzioni di configurazione

| Parametro | Tipo | Obbligatorio | Predefinito | Descrizione |
|-----------|------|----------|---------|-------------|
| `enabled` | boolean | Sì | - | Se abilitare la compattazione automatica |
| `context_token_threshold` | number | No | 100,000 | Conteggio dei token in cui viene attivata la compattazione |
| `model` | string | No | Stesso modello principale | Modello da utilizzare per generare i riassunti |
| `summary_prompt` | string | No | Vedi sotto | Prompt personalizzato per la generazione del riassunto |

#### Scelta di una soglia di token

La soglia determina quando si verifica la compattazione. Una soglia più bassa significa compattazioni più frequenti con finestre di contesto più piccole. Una soglia più alta consente più contesto ma rischia di raggiungere i limiti.

<CodeGroup>

```python Python
# More frequent compaction for memory-constrained scenarios
compaction_control={
    "enabled": True,
    "context_token_threshold": 50000
}

# Less frequent compaction when you need more context
compaction_control={
    "enabled": True,
    "context_token_threshold": 150000
}
```

```typescript TypeScript
// More frequent compaction for memory-constrained scenarios
compactionControl: {
    enabled: true,
    contextTokenThreshold: 50000
}

// Less frequent compaction when you need more context
compactionControl: {
    enabled: true,
    contextTokenThreshold: 150000
}
```

</CodeGroup>

#### Utilizzo di un modello diverso per i riassunti

Puoi utilizzare un modello più veloce o più economico per generare i riassunti:

<CodeGroup>

```python Python
compaction_control={
    "enabled": True,
    "context_token_threshold": 100000,
    "model": "claude-haiku-4-5"
}
```

```typescript TypeScript
compactionControl: {
    enabled: true,
    contextTokenThreshold: 100000,
    model: 'claude-haiku-4-5'
}
```

</CodeGroup>

#### Prompt di riassunto personalizzati

Puoi fornire un prompt personalizzato per esigenze specifiche del dominio. Il tuo prompt dovrebbe istruire Claude a racchiudere il suo riassunto in tag `<summary></summary>`.

<CodeGroup>

```python Python
compaction_control={
    "enabled": True,
    "context_token_threshold": 100000,
    "summary_prompt": """Summarize the research conducted so far, including:
- Sources consulted and key findings
- Questions answered and remaining unknowns
- Recommended next steps

Wrap your summary in <summary></summary> tags."""
}
```

```typescript TypeScript
compactionControl: {
    enabled: true,
    contextTokenThreshold: 100000,
    summaryPrompt: `Summarize the research conducted so far, including:
- Sources consulted and key findings
- Questions answered and remaining unknowns
- Recommended next steps

Wrap your summary in <summary></summary> tags.`
}
```

</CodeGroup>

### Prompt di riassunto predefinito

Il prompt di riassunto integrato istruisce Claude a creare un riassunto di continuazione strutturato che include:

1. **Panoramica dell'attività**: La richiesta principale dell'utente, i criteri di successo e i vincoli
2. **Stato attuale**: Cosa è stato completato, file modificati e artefatti prodotti
3. **Scoperte importanti**: Vincoli tecnici, decisioni prese, errori risolti e approcci falliti
4. **Passaggi successivi**: Azioni specifiche necessarie, ostacoli e ordine di priorità
5. **Contesto da preservare**: Preferenze dell'utente, dettagli specifici del dominio e impegni presi

Questa struttura consente a Claude di riprendere il lavoro in modo efficiente senza perdere il contesto importante o ripetere errori.

<section title="View full default prompt">

```
You have been working on the task described above but have not yet completed it. Write a continuation summary that will allow you (or another instance of yourself) to resume work efficiently in a future context window where the conversation history will be replaced with this summary. Your summary should be structured, concise, and actionable. Include:

1. Task Overview
The user's core request and success criteria
Any clarifications or constraints they specified

2. Current State
What has been completed so far
Files created, modified, or analyzed (with paths if relevant)
Key outputs or artifacts produced

3. Important Discoveries
Technical constraints or requirements uncovered
Decisions made and their rationale
Errors encountered and how they were resolved
What approaches were tried that didn't work (and why)

4. Next Steps
Specific actions needed to complete the task
Any blockers or open questions to resolve
Priority order if multiple steps remain

5. Context to Preserve
User preferences or style requirements
Domain-specific details that aren't obvious
Any promises made to the user

Be concise but complete—err on the side of including information that would prevent duplicate work or repeated mistakes. Write in a way that enables immediate resumption of the task.

Wrap your summary in <summary></summary> tags.
```

</section>

### Limitazioni

#### Strumenti lato server

<Warning>
La compattazione richiede una considerazione speciale quando si utilizzano strumenti lato server come [web search](/docs/it/agents-and-tools/tool-use/web-search-tool) o [web fetch](/docs/it/agents-and-tools/tool-use/web-fetch-tool).
</Warning>

Quando si utilizzano strumenti lato server, l'SDK potrebbe calcolare in modo errato l'utilizzo dei token, causando l'attivazione della compattazione al momento sbagliato.

Ad esempio, dopo un'operazione di ricerca web, la risposta dell'API potrebbe mostrare:

```json
{
  "usage": {
    "input_tokens": 63000,
    "cache_read_input_tokens": 270000,
    "output_tokens": 1400
  }
}
```

L'SDK calcola l'utilizzo totale come 63.000 + 270.000 = 333.000 token. Tuttavia, il valore `cache_read_input_tokens` include letture accumulate da più chiamate API interne effettuate dallo strumento lato server, non il tuo contesto di conversazione effettivo. La tua lunghezza di contesto reale potrebbe essere solo i 63.000 `input_tokens`, ma l'SDK vede 333k e attiva la compattazione prematuramente.

**Soluzioni alternative:**

- Utilizza l'endpoint [token counting](/docs/it/build-with-claude/token-counting) per ottenere la lunghezza del contesto accurata
- Evita la compattazione quando utilizzi estensivamente strumenti lato server

#### Casi limite di utilizzo degli strumenti

Quando la compattazione viene attivata mentre una risposta di utilizzo dello strumento è in sospeso, l'SDK rimuove il blocco di utilizzo dello strumento dalla cronologia dei messaggi prima di generare il riassunto. Claude emetterà nuovamente la chiamata dello strumento dopo la ripresa dal riassunto se ancora necessario.

### Limitazioni

#### Strumenti lato server

<Warning>
La compattazione richiede una considerazione speciale quando si utilizzano strumenti lato server come [web search](/docs/it/agents-and-tools/tool-use/web-search-tool) o [web fetch](/docs/it/agents-and-tools/tool-use/web-fetch-tool).
</Warning>

Quando si utilizzano strumenti lato server, l'SDK potrebbe calcolare in modo errato l'utilizzo dei token, causando l'attivazione della compattazione al momento sbagliato.

Ad esempio, dopo un'operazione di ricerca web, la risposta dell'API potrebbe mostrare:

```json
{
  "usage": {
    "input_tokens": 63000,
    "cache_read_input_tokens": 270000,
    "output_tokens": 1400
  }
}
```

L'SDK calcola l'utilizzo totale come 63.000 + 270.000 = 333.000 token. Tuttavia, il valore `cache_read_input_tokens` include letture accumulate da più chiamate API interne effettuate dallo strumento lato server, non il tuo contesto di conversazione effettivo. La tua lunghezza di contesto reale potrebbe essere solo i 63.000 `input_tokens`, ma l'SDK vede 333k e attiva la compattazione prematuramente.

**Soluzioni alternative:**

- Utilizza l'endpoint [token counting](/docs/it/build-with-claude/token-counting) per ottenere la lunghezza del contesto accurata
- Evita la compattazione quando utilizzi estensivamente strumenti lato server

#### Casi limite di utilizzo degli strumenti

Quando la compattazione viene attivata mentre una risposta di utilizzo dello strumento è in sospeso, l'SDK rimuove il blocco di utilizzo dello strumento dalla cronologia dei messaggi prima di generare il riassunto. Claude emetterà nuovamente la chiamata dello strumento dopo la ripresa dal riassunto se ancora necessario.

### Monitoraggio della compattazione

Abilita la registrazione per tracciare quando si verifica la compattazione:

<CodeGroup>

```python Python
import logging

logging.basicConfig(level=logging.INFO)
logging.getLogger("anthropic.lib.tools").setLevel(logging.INFO)

# Logs will show:
# INFO: Token usage 105000 has exceeded the threshold of 100000. Performing compaction.
# INFO: Compaction complete. New token usage: 2500
```

```typescript TypeScript
// The SDK logs compaction events to the console
// You'll see messages like:
// Token usage 105000 has exceeded the threshold of 100000. Performing compaction.
// Compaction complete. New token usage: 2500
```

</CodeGroup>

### Limitazioni

#### Strumenti lato server

<Warning>
La compattazione richiede una considerazione speciale quando si utilizzano strumenti lato server come [web search](/docs/it/agents-and-tools/tool-use/web-search-tool) o [web fetch](/docs/it/agents-and-tools/tool-use/web-fetch-tool).
</Warning>

Quando si utilizzano strumenti lato server, l'SDK potrebbe calcolare in modo errato l'utilizzo dei token, causando l'attivazione della compattazione al momento sbagliato.

Ad esempio, dopo un'operazione di ricerca web, la risposta dell'API potrebbe mostrare:

```json
{
  "usage": {
    "input_tokens": 63000,
    "cache_read_input_tokens": 270000,
    "output_tokens": 1400
  }
}
```

L'SDK calcola l'utilizzo totale come 63.000 + 270.000 = 333.000 token. Tuttavia, il valore `cache_read_input_tokens` include letture accumulate da più chiamate API interne effettuate dallo strumento lato server, non il tuo contesto di conversazione effettivo. La tua lunghezza di contesto reale potrebbe essere solo i 63.000 `input_tokens`, ma l'SDK vede 333k e attiva la compattazione prematuramente.

**Soluzioni alternative:**

- Utilizza l'endpoint [token counting](/docs/it/build-with-claude/token-counting) per ottenere la lunghezza del contesto accurata
- Evita la compattazione quando utilizzi estensivamente strumenti lato server

#### Casi limite di utilizzo degli strumenti

Quando la compattazione viene attivata mentre una risposta di utilizzo dello strumento è in sospeso, l'SDK rimuove il blocco di utilizzo dello strumento dalla cronologia dei messaggi prima di generare il riassunto. Claude emetterà nuovamente la chiamata dello strumento dopo la ripresa dal riassunto se ancora necessario.

### Monitoraggio della compattazione

Abilita la registrazione per tracciare quando si verifica la compattazione:

<CodeGroup>

```python Python
import logging

logging.basicConfig(level=logging.INFO)
logging.getLogger("anthropic.lib.tools").setLevel(logging.INFO)

# Logs will show:
# INFO: Token usage 105000 has exceeded the threshold of 100000. Performing compaction.
# INFO: Compaction complete. New token usage: 2500
```

```typescript TypeScript
// The SDK logs compaction events to the console
// You'll see messages like:
// Token usage 105000 has exceeded the threshold of 100000. Performing compaction.
// Compaction complete. New token usage: 2500
```

</CodeGroup>

### Quando utilizzare la compattazione

**Buoni casi d'uso:**

- Attività di agenti a lungo termine che elaborano molti file o fonti di dati
- Flussi di lavoro di ricerca che accumulano grandi quantità di informazioni
- Attività multi-step con progressi chiari e misurabili
- Attività che producono artefatti (file, report) che persistono al di fuori della conversazione

**Casi d'uso meno ideali:**

- Attività che richiedono il ricordo preciso dei dettagli della conversazione iniziale
- Flussi di lavoro che utilizzano estensivamente strumenti lato server
- Attività che devono mantenere lo stato esatto su molte variabili