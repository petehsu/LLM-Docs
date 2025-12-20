# Effort

Controlla quanti token Claude utilizza quando risponde con il parametro effort, bilanciando tra la completezza della risposta e l'efficienza dei token.

---

Il parametro effort ti consente di controllare quanto Claude sia disposto a spendere token quando risponde alle richieste. Questo ti dà la possibilità di bilanciare tra la completezza della risposta e l'efficienza dei token, il tutto con un singolo modello.

<Note>
  Il parametro effort è attualmente in beta ed è supportato solo da Claude Opus 4.5.

  Devi includere l'[intestazione beta](/docs/it/api/beta-headers) `effort-2025-11-24` quando utilizzi questa funzione.
</Note>

## Come funziona effort

Per impostazione predefinita, Claude utilizza il massimo sforzo, spendendo quanti token necessari per il miglior risultato possibile. Abbassando il livello di effort, puoi istruire Claude a essere più conservatore nell'utilizzo dei token, ottimizzando per velocità e costo accettando una riduzione di capacità.

<Tip>
Impostare `effort` a `"high"` produce esattamente lo stesso comportamento di omettere completamente il parametro `effort`.
</Tip>

Il parametro effort influisce su **tutti i token** nella risposta, inclusi:

- Risposte di testo e spiegazioni
- Chiamate di strumenti e argomenti di funzioni
- Pensiero esteso (quando abilitato)

Questo approccio ha due vantaggi principali:

1. Non richiede che il pensiero sia abilitato per utilizzarlo.
2. Può influire su tutta la spesa di token incluse le chiamate di strumenti. Ad esempio, uno sforzo inferiore significherebbe che Claude effettua meno chiamate di strumenti. Questo offre un grado molto maggiore di controllo sull'efficienza.

### Livelli di effort

| Livello  | Descrizione                                                                                                                      | Caso d'uso tipico                                                                      |
| -------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `high`   | Massima capacità. Claude utilizza quanti token necessari per il miglior risultato possibile. Equivalente a non impostare il parametro.  | Ragionamento complesso, problemi di codifica difficili, compiti agentici                           |
| `medium` | Approccio equilibrato con risparmi di token moderati. | Compiti agentici che richiedono un equilibrio tra velocità, costo e prestazioni                                                         |
| `low`    | Più efficiente. Risparmi significativi di token con una riduzione di capacità. | Compiti più semplici che necessitano della migliore velocità e dei costi più bassi, come i subagenzi                     |

## Utilizzo di base

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-opus-4-5-20251101",
    betas=["effort-2025-11-24"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Analyze the trade-offs between microservices and monolithic architectures"
    }],
    output_config={
        "effort": "medium"
    }
)

print(response.content[0].text)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.beta.messages.create({
  model: "claude-opus-4-5-20251101",
  betas: ["effort-2025-11-24"],
  max_tokens: 4096,
  messages: [{
    role: "user",
    content: "Analyze the trade-offs between microservices and monolithic architectures"
  }],
  output_config: {
    effort: "medium"
  }
});

console.log(response.content[0].text);
```

```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: effort-2025-11-24" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-opus-4-5-20251101",
        "max_tokens": 4096,
        "messages": [{
            "role": "user",
            "content": "Analyze the trade-offs between microservices and monolithic architectures"
        }],
        "output_config": {
            "effort": "medium"
        }
    }'
```

</CodeGroup>

## Quando dovrei regolare il parametro effort?

- Usa **high effort** (il valore predefinito) quando hai bisogno del miglior lavoro di Claude—ragionamento complesso, analisi sfumata, problemi di codifica difficili, o qualsiasi compito in cui la qualità è la priorità principale.
- Usa **medium effort** come opzione equilibrata quando desideri prestazioni solide senza la piena spesa di token dello sforzo alto.
- Usa **low effort** quando stai ottimizzando per velocità (perché Claude risponde con meno token) o costo—ad esempio, compiti di classificazione semplici, ricerche rapide, o casi d'uso ad alto volume dove i miglioramenti di qualità marginali non giustificano latenza aggiuntiva o spesa.

## Effort con l'uso di strumenti

Quando si utilizzano strumenti, il parametro effort influisce sia sulle spiegazioni intorno alle chiamate di strumenti che sulle chiamate di strumenti stesse. I livelli di effort inferiori tendono a:

- Combinare più operazioni in meno chiamate di strumenti
- Effettuare meno chiamate di strumenti
- Procedere direttamente all'azione senza preambolo
- Utilizzare messaggi di conferma concisi dopo il completamento

I livelli di effort superiori possono:

- Effettuare più chiamate di strumenti
- Spiegare il piano prima di intraprendere un'azione
- Fornire riepiloghi dettagliati dei cambiamenti
- Includere commenti di codice più completi

## Effort con il pensiero esteso

Il parametro effort funziona insieme al budget di token di pensiero quando il pensiero esteso è abilitato. Questi due controlli servono scopi diversi:

- **Parametro effort**: Controlla come Claude spende tutti i token—inclusi i token di pensiero, le risposte di testo e le chiamate di strumenti
- **Budget di token di pensiero**: Imposta un limite massimo sui token di pensiero specificamente

Il parametro effort può essere utilizzato con o senza il pensiero esteso abilitato. Quando entrambi sono configurati:

1. Per prima cosa determina il livello di effort appropriato per il tuo compito
2. Quindi imposta il budget di token di pensiero in base alla complessità del compito

Per le migliori prestazioni su compiti di ragionamento complesso, usa high effort (il valore predefinito) con un budget di token di pensiero elevato. Questo consente a Claude di pensare a fondo e fornire risposte complete.

## Best practice

1. **Inizia con high**: Usa livelli di effort inferiori per bilanciare le prestazioni con l'efficienza dei token.
2. **Usa low per compiti sensibili alla velocità o semplici**: Quando la latenza è importante o i compiti sono semplici, lo sforzo basso può ridurre significativamente i tempi di risposta e i costi.
3. **Testa il tuo caso d'uso**: L'impatto dei livelli di effort varia in base al tipo di compito. Valuta le prestazioni sui tuoi casi d'uso specifici prima di distribuire.
4. **Considera l'effort dinamico**: Regola l'effort in base alla complessità del compito. Le query semplici possono garantire uno sforzo basso mentre la codifica agentiva e il ragionamento complesso beneficiano dello sforzo alto.