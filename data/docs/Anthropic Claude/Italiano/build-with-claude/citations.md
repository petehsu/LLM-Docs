# Citazioni

Claude è in grado di fornire citazioni dettagliate quando risponde a domande sui documenti, aiutandoti a tracciare e verificare le fonti di informazione nelle risposte.

---

Claude è in grado di fornire citazioni dettagliate quando risponde a domande sui documenti, aiutandoti a tracciare e verificare le fonti di informazione nelle risposte.

Tutti i [modelli attivi](/docs/it/about-claude/models/overview) supportano le citazioni, ad eccezione di Haiku 3.

<Warning>
*Citazioni con Claude Sonnet 3.7*

Claude Sonnet 3.7 potrebbe essere meno propenso a fare citazioni rispetto ad altri modelli Claude senza istruzioni più esplicite da parte dell'utente. Quando usi le citazioni con Claude Sonnet 3.7, raccomandiamo di includere istruzioni aggiuntive nel turno `user`, come `"Usa le citazioni per supportare la tua risposta."` per esempio.

Abbiamo anche osservato che quando al modello viene chiesto di strutturare la sua risposta, è improbabile che usi citazioni a meno che non gli venga esplicitamente detto di usare citazioni all'interno di quel formato. Per esempio, se al modello viene chiesto di usare tag `<result>` nella sua risposta, dovresti aggiungere qualcosa come `"Usa sempre citazioni nella tua risposta, anche all'interno dei tag <result>."`
</Warning>
<Tip>
  Ti preghiamo di condividere i tuoi feedback e suggerimenti sulla funzione citazioni usando questo [modulo](https://forms.gle/9n9hSrKnKe3rpowH9).
</Tip>

Ecco un esempio di come usare le citazioni con l'API Messages:

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "document",
            "source": {
              "type": "text",
              "media_type": "text/plain",
              "data": "The grass is green. The sky is blue."
            },
            "title": "My Document",
            "context": "This is a trustworthy document.",
            "citations": {"enabled": true}
          },
          {
            "type": "text",
            "text": "What color is the grass and sky?"
          }
        ]
      }
    ]
  }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "document",
                    "source": {
                        "type": "text",
                        "media_type": "text/plain",
                        "data": "The grass is green. The sky is blue."
                    },
                    "title": "My Document",
                    "context": "This is a trustworthy document.",
                    "citations": {"enabled": True}
                },
                {
                    "type": "text",
                    "text": "What color is the grass and sky?"
                }
            ]
        }
    ]
)
print(response)
```

```java Java
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.*;

public class DocumentExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        PlainTextSource source = PlainTextSource.builder()
                .data("The grass is green. The sky is blue.")
                .build();

        DocumentBlockParam documentParam = DocumentBlockParam.builder()
                .source(source)
                .title("My Document")
                .context("This is a trustworthy document.")
                .citations(CitationsConfigParam.builder().enabled(true).build())
                .build();
        
        TextBlockParam textBlockParam = TextBlockParam.builder()
                .text("What color is the grass and sky?")
                .build();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_SONNET_4_20250514)
                .maxTokens(1024)
                .addUserMessageOfBlockParams(List.of(ContentBlockParam.ofDocument(documentParam), ContentBlockParam.ofText(textBlockParam)))
                .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```

</CodeGroup>

<Tip>
**Confronto con approcci basati su prompt**

In confronto alle soluzioni di citazioni basate su prompt, la funzione citazioni ha i seguenti vantaggi:
- **Risparmio sui costi:** Se il tuo approccio basato su prompt chiede a Claude di produrre citazioni dirette, potresti vedere risparmi sui costi dovuti al fatto che `cited_text` non conta verso i tuoi token di output.
- **Migliore affidabilità delle citazioni:** Poiché analizziamo le citazioni nei rispettivi formati di risposta menzionati sopra ed estraiamo `cited_text`, le citazioni sono garantite per contenere puntatori validi ai documenti forniti.
- **Qualità delle citazioni migliorata:** Nelle nostre valutazioni, abbiamo trovato che la funzione citazioni è significativamente più probabile che citi le citazioni più rilevanti dai documenti rispetto agli approcci puramente basati su prompt.
</Tip>

---

## Come funzionano le citazioni

Integra le citazioni con Claude in questi passaggi:

<Steps>
  <Step title="Fornisci documento/i e abilita le citazioni">
    - Includi documenti in uno qualsiasi dei formati supportati: [PDF](#pdf-documents), [testo semplice](#plain-text-documents), o documenti di [contenuto personalizzato](#custom-content-documents)
    - Imposta `citations.enabled=true` su ciascuno dei tuoi documenti. Attualmente, le citazioni devono essere abilitate su tutti o nessuno dei documenti all'interno di una richiesta.
    - Nota che attualmente sono supportate solo le citazioni di testo e le citazioni di immagini non sono ancora possibili.
  </Step>
  <Step title="I documenti vengono elaborati">
    - I contenuti dei documenti vengono "suddivisi in blocchi" per definire la granularità minima delle possibili citazioni. Per esempio, la suddivisione in frasi permetterebbe a Claude di citare una singola frase o concatenare più frasi consecutive per citare un paragrafo (o più lungo)!
      - **Per i PDF:** Il testo viene estratto come descritto in [Supporto PDF](/docs/it/build-with-claude/pdf-support) e il contenuto viene suddiviso in frasi. Citare immagini dai PDF non è attualmente supportato.
      - **Per i documenti di testo semplice:** Il contenuto viene suddiviso in frasi che possono essere citate.
      - **Per i documenti di contenuto personalizzato:** I tuoi blocchi di contenuto forniti vengono usati così come sono e non viene fatta ulteriore suddivisione.
  </Step>
  <Step title="Claude fornisce una risposta citata">
    - Le risposte ora possono includere più blocchi di testo dove ogni blocco di testo può contenere un'affermazione che Claude sta facendo e un elenco di citazioni che supportano l'affermazione.
    - Le citazioni fanno riferimento a posizioni specifiche nei documenti sorgente. Il formato di queste citazioni dipende dal tipo di documento da cui si sta citando.
      - **Per i PDF:** le citazioni includeranno l'intervallo del numero di pagina (indicizzato da 1).
      - **Per i documenti di testo semplice:** Le citazioni includeranno l'intervallo dell'indice dei caratteri (indicizzato da 0).
      - **Per i documenti di contenuto personalizzato:** Le citazioni includeranno l'intervallo dell'indice del blocco di contenuto (indicizzato da 0) corrispondente all'elenco di contenuti originale fornito.
    - Gli indici dei documenti vengono forniti per indicare la sorgente di riferimento e sono indicizzati da 0 secondo l'elenco di tutti i documenti nella tua richiesta originale.
  </Step>
</Steps>

<Tip>
  **Suddivisione automatica vs contenuto personalizzato**

  Per impostazione predefinita, i documenti di testo semplice e PDF vengono automaticamente suddivisi in frasi. Se hai bisogno di più controllo sulla granularità delle citazioni (ad es., per punti elenco o trascrizioni), usa invece documenti di contenuto personalizzato. Vedi [Tipi di Documento](#document-types) per maggiori dettagli.

  Per esempio, se vuoi che Claude sia in grado di citare frasi specifiche dai tuoi blocchi RAG, dovresti mettere ogni blocco RAG in un documento di testo semplice. Altrimenti, se non vuoi che venga fatta ulteriore suddivisione, o se vuoi personalizzare qualsiasi suddivisione aggiuntiva, puoi mettere i blocchi RAG in documento/i di contenuto personalizzato.
</Tip>

### Contenuto citabile vs non citabile

- Il testo trovato all'interno del contenuto `source` di un documento può essere citato.
- `title` e `context` sono campi opzionali che verranno passati al modello ma non usati verso il contenuto citato.
- `title` è limitato in lunghezza quindi potresti trovare utile il campo `context` per memorizzare qualsiasi metadato del documento come testo o json stringificato.

### Indici delle citazioni
- Gli indici dei documenti sono indicizzati da 0 dall'elenco di tutti i blocchi di contenuto del documento nella richiesta (che si estende attraverso tutti i messaggi).
- Gli indici dei caratteri sono indicizzati da 0 con indici finali esclusivi.
- I numeri di pagina sono indicizzati da 1 con numeri di pagina finali esclusivi.
- Gli indici dei blocchi di contenuto sono indicizzati da 0 con indici finali esclusivi dall'elenco `content` fornito nel documento di contenuto personalizzato.

### Costi dei token
- Abilitare le citazioni comporta un leggero aumento nei token di input dovuto alle aggiunte del prompt di sistema e alla suddivisione dei documenti.
- Tuttavia, la funzione citazioni è molto efficiente con i token di output. Sotto il cofano, il modello sta producendo citazioni in un formato standardizzato che vengono poi analizzate in testo citato e indici di posizione del documento. Il campo `cited_text` è fornito per comodità e non conta verso i token di output.
- Quando passato indietro nei turni di conversazione successivi, `cited_text` non viene contato nemmeno verso i token di input.

### Compatibilità delle funzioni
Le citazioni funzionano insieme ad altre funzioni API inclusi [prompt caching](/docs/it/build-with-claude/prompt-caching), [conteggio token](/docs/it/build-with-claude/token-counting) e [elaborazione batch](/docs/it/build-with-claude/batch-processing).

#### Usare Prompt Caching con le Citazioni

Le citazioni e il prompt caching possono essere usati insieme efficacemente.

I blocchi di citazione generati nelle risposte non possono essere memorizzati nella cache direttamente, ma i documenti sorgente che referenziano possono essere memorizzati nella cache. Per ottimizzare le prestazioni, applica `cache_control` ai tuoi blocchi di contenuto del documento di livello superiore.

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# Contenuto documento lungo (ad es., documentazione tecnica)
long_document = "Questo è un documento molto lungo con migliaia di parole..." + " ... " * 1000  # Lunghezza minima memorizzabile nella cache

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "document",
                    "source": {
                        "type": "text",
                        "media_type": "text/plain",
                        "data": long_document
                    },
                    "citations": {"enabled": True},
                    "cache_control": {"type": "ephemeral"}  # Memorizza nella cache il contenuto del documento
                },
                {
                    "type": "text",
                    "text": "Cosa dice questo documento sulle funzioni API?"
                }
            ]
        }
    ]
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

// Contenuto documento lungo (ad es., documentazione tecnica)
const longDocument = "Questo è un documento molto lungo con migliaia di parole..." + " ... ".repeat(1000);  // Lunghezza minima memorizzabile nella cache

const response = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: [
        {
          type: "document",
          source: {
            type: "text",
            media_type: "text/plain",
            data: longDocument
          },
          citations: { enabled: true },
          cache_control: { type: "ephemeral" }  // Memorizza nella cache il contenuto del documento
        },
        {
          type: "text",
          text: "Cosa dice questo documento sulle funzioni API?"
        }
      ]
    }
  ]
});
```

```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "document",
                    "source": {
                        "type": "text",
                        "media_type": "text/plain",
                        "data": "Questo è un documento molto lungo con migliaia di parole..."
                    },
                    "citations": {"enabled": true},
                    "cache_control": {"type": "ephemeral"}
                },
                {
                    "type": "text",
                    "text": "Cosa dice questo documento sulle funzioni API?"
                }
            ]
        }
    ]
}'
```
</CodeGroup>

In questo esempio:
- Il contenuto del documento viene memorizzato nella cache usando `cache_control` sul blocco documento
- Le citazioni sono abilitate sul documento
- Claude può generare risposte con citazioni mentre beneficia del contenuto del documento memorizzato nella cache
- Le richieste successive che usano lo stesso documento beneficeranno del contenuto memorizzato nella cache

## Tipi di Documento

### Scegliere un tipo di documento

Supportiamo tre tipi di documento per le citazioni. I documenti possono essere forniti direttamente nel messaggio (base64, testo, o URL) o caricati tramite l'[API Files](/docs/it/build-with-claude/files) e referenziati per `file_id`:

| Tipo | Migliore per | Suddivisione | Formato citazione |
| :--- | :--- | :--- | :--- |
| Testo semplice | Documenti di testo semplici, prosa | Frase | Indici caratteri (indicizzati da 0) |
| PDF | File PDF con contenuto di testo | Frase | Numeri pagina (indicizzati da 1) |
| Contenuto personalizzato | Elenchi, trascrizioni, formattazione speciale, citazioni più granulari | Nessuna suddivisione aggiuntiva | Indici blocchi (indicizzati da 0) |

<Note>
I file .csv, .xlsx, .docx, .md, e .txt non sono supportati come blocchi documento. Convertili in testo semplice e includili direttamente nel contenuto del messaggio. Vedi [Lavorare con altri formati di file](/docs/it/build-with-claude/files#working-with-other-file-formats).
</Note>

### Documenti di testo semplice

I documenti di testo semplice vengono automaticamente suddivisi in frasi. Puoi fornirli inline o per riferimento con il loro `file_id`:

<Tabs>
<Tab title="Testo inline">
```python
{
    "type": "document",
    "source": {
        "type": "text",
        "media_type": "text/plain",
        "data": "Contenuto di testo semplice..."
    },
    "title": "Titolo Documento", # opzionale
    "context": "Contesto sul documento che non verrà citato", # opzionale
    "citations": {"enabled": True}
}
```
</Tab>
<Tab title="API Files">
```python
{
    "type": "document",
    "source": {
        "type": "file",
        "file_id": "file_011CNvxoj286tYUAZFiZMf1U"
    },
    "title": "Titolo Documento", # opzionale
    "context": "Contesto sul documento che non verrà citato", # opzionale
    "citations": {"enabled": True}
}
```
</Tab>
</Tabs>

<section title="Esempio citazione testo semplice">

```python
{
    "type": "char_location",
    "cited_text": "Il testo esatto che viene citato", # non conta verso i token di output
    "document_index": 0,
    "document_title": "Titolo Documento",
    "start_char_index": 0,    # indicizzato da 0
    "end_char_index": 50      # esclusivo
}
```

</section>

### Documenti PDF

I documenti PDF possono essere forniti come dati codificati in base64 o per `file_id`. Il testo PDF viene estratto e suddiviso in frasi. Poiché le citazioni di immagini non sono ancora supportate, i PDF che sono scansioni di documenti e non contengono testo estraibile non saranno citabili.

<Tabs>
<Tab title="Base64">
```python
{
    "type": "document",
    "source": {
        "type": "base64",
        "media_type": "application/pdf",
        "data": base64_encoded_pdf_data
    },
    "title": "Titolo Documento", # opzionale
    "context": "Contesto sul documento che non verrà citato", # opzionale
    "citations": {"enabled": True}
}
```
</Tab>
<Tab title="API Files">
```python
{
    "type": "document",
    "source": {
        "type": "file",
        "file_id": "file_011CNvxoj286tYUAZFiZMf1U"
    },
    "title": "Titolo Documento", # opzionale
    "context": "Contesto sul documento che non verrà citato", # opzionale
    "citations": {"enabled": True}
}
```
</Tab>
</Tabs>

<section title="Esempio citazione PDF">

```python
{
    "type": "page_location",
    "cited_text": "Il testo esatto che viene citato", # non conta verso i token di output
    "document_index": 0,     
    "document_title": "Titolo Documento", 
    "start_page_number": 1,  # indicizzato da 1
    "end_page_number": 2     # esclusivo
}
```

</section>

### Documenti di contenuto personalizzato

I documenti di contenuto personalizzato ti danno controllo sulla granularità delle citazioni. Non viene fatta suddivisione aggiuntiva e i blocchi vengono forniti al modello secondo i blocchi di contenuto forniti.

```python
{
    "type": "document",
    "source": {
        "type": "content",
        "content": [
            {"type": "text", "text": "Primo blocco"},
            {"type": "text", "text": "Secondo blocco"}
        ]
    },
    "title": "Titolo Documento", # opzionale
    "context": "Contesto sul documento che non verrà citato", # opzionale
    "citations": {"enabled": True}
}
```

<section title="Esempio citazione">

```python
{
    "type": "content_block_location",
    "cited_text": "Il testo esatto che viene citato", # non conta verso i token di output
    "document_index": 0,
    "document_title": "Titolo Documento",
    "start_block_index": 0,   # indicizzato da 0
    "end_block_index": 1      # esclusivo
}
```

</section>

---

## Struttura della Risposta

Quando le citazioni sono abilitate, le risposte includono più blocchi di testo con citazioni:

```python
{
    "content": [
        {
            "type": "text",
            "text": "Secondo il documento, "
        },
        {
            "type": "text",
            "text": "l'erba è verde",
            "citations": [{
                "type": "char_location",
                "cited_text": "L'erba è verde.",
                "document_index": 0,
                "document_title": "Documento di Esempio",
                "start_char_index": 0,
                "end_char_index": 20
            }]
        },
        {
            "type": "text",
            "text": " e "
        },
        {
            "type": "text",
            "text": "il cielo è blu",
            "citations": [{
                "type": "char_location",
                "cited_text": "Il cielo è blu.",
                "document_index": 0,
                "document_title": "Documento di Esempio",
                "start_char_index": 20,
                "end_char_index": 36
            }]
        },
        {
            "type": "text",
            "text": ". Le informazioni dalla pagina 5 affermano che ",
        },
        {
            "type": "text",
            "text": "l'acqua è essenziale",
            "citations": [{
                "type": "page_location",
                "cited_text": "L'acqua è essenziale per la vita.",
                "document_index": 1,
                "document_title": "Documento PDF",
                "start_page_number": 5,
                "end_page_number": 6
            }]
        },
        {
            "type": "text",
            "text": ". Il documento personalizzato menziona ",
        },
        {
            "type": "text",
            "text": "scoperte importanti",
            "citations": [{
                "type": "content_block_location",
                "cited_text": "Queste sono scoperte importanti.",
                "document_index": 2,
                "document_title": "Documento di Contenuto Personalizzato",
                "start_block_index": 0,
                "end_block_index": 1
            }]
        }
    ]
}
```

### Supporto Streaming

Per le risposte in streaming, abbiamo aggiunto un tipo `citations_delta` che contiene una singola citazione da aggiungere all'elenco `citations` sul blocco di contenuto `text` corrente.

<section title="Esempio eventi streaming">

```python
event: message_start
data: {"type": "message_start", ...}

event: content_block_start
data: {"type": "content_block_start", "index": 0, ...}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, 
       "delta": {"type": "text_delta", "text": "Secondo..."}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0,
       "delta": {"type": "citations_delta", 
                 "citation": {
                     "type": "char_location",
                     "cited_text": "...",
                     "document_index": 0,
                     ...
                 }}}

event: content_block_stop
data: {"type": "content_block_stop", "index": 0}

event: message_stop
data: {"type": "message_stop"}
```

</section>