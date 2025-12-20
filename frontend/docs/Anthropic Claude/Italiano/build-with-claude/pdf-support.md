# Supporto PDF

Elabora PDF con Claude. Estrai testo, analizza grafici e comprendi contenuti visivi dai tuoi documenti.

---

Ora puoi chiedere a Claude di qualsiasi testo, immagini, grafici e tabelle nei PDF che fornisci. Alcuni casi d'uso di esempio:
- Analizzare report finanziari e comprendere grafici/tabelle
- Estrarre informazioni chiave da documenti legali
- Assistenza nella traduzione di documenti
- Convertire informazioni di documenti in formati strutturati

## Prima di iniziare

### Verifica i requisiti PDF
Claude funziona con qualsiasi PDF standard. Tuttavia, dovresti assicurarti che la dimensione della tua richiesta soddisfi questi requisiti quando usi il supporto PDF:

| Requisito | Limite |
|---|---|
| Dimensione massima richiesta | 32MB |
| Pagine massime per richiesta | 100 |
| Formato | PDF standard (senza password/crittografia) |

Si prega di notare che entrambi i limiti si applicano all'intero payload della richiesta, incluso qualsiasi altro contenuto inviato insieme ai PDF.

Poiché il supporto PDF si basa sulle capacità di visione di Claude, è soggetto alle stesse [limitazioni e considerazioni](/docs/it/build-with-claude/vision#limitations) di altre attività di visione.

### Piattaforme e modelli supportati

Il supporto PDF è attualmente supportato tramite accesso diretto API e Google Vertex AI. Tutti i [modelli attivi](/docs/it/about-claude/models/overview) supportano l'elaborazione PDF.

Il supporto PDF è ora disponibile su Amazon Bedrock con le seguenti considerazioni:

### Supporto PDF Amazon Bedrock

Quando si utilizza il supporto PDF tramite l'API Converse di Amazon Bedrock, ci sono due modalità distinte di elaborazione documenti:

<Note>
**Importante**: Per accedere alle complete capacità di comprensione visiva PDF di Claude nell'API Converse, devi abilitare le citazioni. Senza le citazioni abilitate, l'API ricade solo sull'estrazione di testo di base. Scopri di più su [lavorare con le citazioni](/docs/it/build-with-claude/citations).
</Note>

#### Modalità di Elaborazione Documenti

1. **Converse Document Chat** (Modalità originale - Solo estrazione testo)
   - Fornisce estrazione di testo di base dai PDF
   - Non può analizzare immagini, grafici o layout visivi all'interno dei PDF
   - Utilizza circa 1.000 token per un PDF di 3 pagine
   - Utilizzata automaticamente quando le citazioni non sono abilitate

2. **Claude PDF Chat** (Nuova modalità - Comprensione visiva completa)
   - Fornisce analisi visiva completa dei PDF
   - Può comprendere e analizzare grafici, diagrammi, immagini e layout visivi
   - Elabora ogni pagina sia come testo che come immagine per una comprensione completa
   - Utilizza circa 7.000 token per un PDF di 3 pagine
   - **Richiede che le citazioni siano abilitate** nell'API Converse

#### Limitazioni Chiave

- **API Converse**: L'analisi visiva PDF richiede che le citazioni siano abilitate. Attualmente non c'è opzione per utilizzare l'analisi visiva senza citazioni (a differenza dell'API InvokeModel).
- **API InvokeModel**: Fornisce controllo completo sull'elaborazione PDF senza citazioni forzate.

#### Problemi Comuni

Se i clienti segnalano che Claude non vede immagini o grafici nei loro PDF quando usa l'API Converse, probabilmente devono abilitare il flag delle citazioni. Senza di esso, Converse ricade solo sull'estrazione di testo di base.

<Note>
Questo è un vincolo noto con l'API Converse che stiamo lavorando per risolvere. Per applicazioni che richiedono analisi visiva PDF senza citazioni, considera di utilizzare l'API InvokeModel invece.
</Note>

<Note>
Per file non-PDF come .csv, .xlsx, .docx, .md, o .txt, vedi [Lavorare con altri formati di file](/docs/it/build-with-claude/files#working-with-other-file-formats).
</Note>

***

## Elabora PDF con Claude

### Invia la tua prima richiesta PDF
Iniziamo con un esempio semplice usando l'API Messages. Puoi fornire PDF a Claude in tre modi:

1. Come riferimento URL a un PDF ospitato online
2. Come PDF codificato in base64 nei blocchi di contenuto `document`  
3. Tramite un `file_id` dall'[API Files](/docs/it/build-with-claude/files)

#### Opzione 1: Documento PDF basato su URL

L'approccio più semplice è riferirsi a un PDF direttamente da un URL:

<CodeGroup>
   ```bash Shell
    curl https://api.anthropic.com/v1/messages \
      -H "content-type: application/json" \
      -H "x-api-key: $ANTHROPIC_API_KEY" \
      -H "anthropic-version: 2023-06-01" \
      -d '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 1024,
        "messages": [{
            "role": "user",
            "content": [{
                "type": "document",
                "source": {
                    "type": "url",
                    "url": "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf"
                }
            },
            {
                "type": "text",
                "text": "Quali sono i risultati chiave in questo documento?"
            }]
        }]
    }'
    ```
    ```python Python
    import anthropic

    client = anthropic.Anthropic()
    message = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "document",
                        "source": {
                            "type": "url",
                            "url": "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf"
                        }
                    },
                    {
                        "type": "text",
                        "text": "Quali sono i risultati chiave in questo documento?"
                    }
                ]
            }
        ],
    )

    print(message.content)
    ```
    ```typescript TypeScript
    import Anthropic from '@anthropic-ai/sdk';

    const anthropic = new Anthropic();
    
    async function main() {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'document',
                source: {
                  type: 'url',
                  url: 'https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf',
                },
              },
              {
                type: 'text',
                text: 'Quali sono i risultati chiave in questo documento?',
              },
            ],
          },
        ],
      });
      
      console.log(response);
    }
    
    main();
    ```
    ```java Java
    import java.util.List;

    import com.anthropic.client.AnthropicClient;
    import com.anthropic.client.okhttp.AnthropicOkHttpClient;
    import com.anthropic.models.messages.MessageCreateParams;
    import com.anthropic.models.messages.*;

    public class PdfExample {
        public static void main(String[] args) {
            AnthropicClient client = AnthropicOkHttpClient.fromEnv();

            // Create document block with URL
            DocumentBlockParam documentParam = DocumentBlockParam.builder()
                    .urlPdfSource("https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf")
                    .build();

            // Create a message with document and text content blocks
            MessageCreateParams params = MessageCreateParams.builder()
                    .model(Model.CLAUDE_OPUS_4_20250514)
                    .maxTokens(1024)
                    .addUserMessageOfBlockParams(
                            List.of(
 ContentBlockParam.ofDocument(documentParam),
 ContentBlockParam.ofText(
 TextBlockParam.builder()
 .text("Quali sono i risultati chiave in questo documento?")
 .build()
 )
                            )
                    )
                    .build();

            Message message = client.messages().create(params);
            System.out.println(message.content());
        }
    }
    ```
</CodeGroup>

#### Opzione 2: Documento PDF codificato in Base64

Se devi inviare PDF dal tuo sistema locale o quando un URL non è disponibile:

<CodeGroup>
    ```bash Shell
    # Metodo 1: Recupera e codifica un PDF remoto
    curl -s "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf" | base64 | tr -d '\n' > pdf_base64.txt

    # Metodo 2: Codifica un file PDF locale
    # base64 document.pdf | tr -d '\n' > pdf_base64.txt

    # Crea un file di richiesta JSON usando il contenuto di pdf_base64.txt
    jq -n --rawfile PDF_BASE64 pdf_base64.txt '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 1024,
        "messages": [{
            "role": "user",
            "content": [{
                "type": "document",
                "source": {
                    "type": "base64",
                    "media_type": "application/pdf",
                    "data": $PDF_BASE64
                }
            },
            {
                "type": "text",
                "text": "Quali sono i risultati chiave in questo documento?"
            }]
        }]
    }' > request.json

    # Invia la richiesta API usando il file JSON
    curl https://api.anthropic.com/v1/messages \
      -H "content-type: application/json" \
      -H "x-api-key: $ANTHROPIC_API_KEY" \
      -H "anthropic-version: 2023-06-01" \
      -d @request.json
    ```
    ```python Python
    import anthropic
    import base64
    import httpx

    # Prima, carica e codifica il PDF 
    pdf_url = "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf"
    pdf_data = base64.standard_b64encode(httpx.get(pdf_url).content).decode("utf-8")

    # Alternativa: Carica da un file locale
    # with open("document.pdf", "rb") as f:
    #     pdf_data = base64.standard_b64encode(f.read()).decode("utf-8")

    # Invia a Claude usando codifica base64
    client = anthropic.Anthropic()
    message = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "document",
                        "source": {
                            "type": "base64",
                            "media_type": "application/pdf",
                            "data": pdf_data
                        }
                    },
                    {
                        "type": "text",
                        "text": "Quali sono i risultati chiave in questo documento?"
                    }
                ]
            }
        ],
    )

    print(message.content)
    ```
    ```typescript TypeScript
    import Anthropic from '@anthropic-ai/sdk';
    import fetch from 'node-fetch';
    import fs from 'fs';

    async function main() {
      // Metodo 1: Recupera e codifica un PDF remoto
      const pdfURL = "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf";
      const pdfResponse = await fetch(pdfURL);
      const arrayBuffer = await pdfResponse.arrayBuffer();
      const pdfBase64 = Buffer.from(arrayBuffer).toString('base64');
      
      // Metodo 2: Carica da un file locale
      // const pdfBase64 = fs.readFileSync('document.pdf').toString('base64');
      
      // Invia la richiesta API con PDF codificato in base64
      const anthropic = new Anthropic();
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'document',
                source: {
                  type: 'base64',
                  media_type: 'application/pdf',
                  data: pdfBase64,
                },
              },
              {
                type: 'text',
                text: 'Quali sono i risultati chiave in questo documento?',
              },
            ],
          },
        ],
      });
      
      console.log(response);
    }
    
    main();
    ```

    ```java Java
    import java.io.IOException;
    import java.net.URI;
    import java.net.http.HttpClient;
    import java.net.http.HttpRequest;
    import java.net.http.HttpResponse;
    import java.util.Base64;
    import java.util.List;

    import com.anthropic.client.AnthropicClient;
    import com.anthropic.client.okhttp.AnthropicOkHttpClient;
    import com.anthropic.models.messages.ContentBlockParam;
    import com.anthropic.models.messages.DocumentBlockParam;
    import com.anthropic.models.messages.Message;
    import com.anthropic.models.messages.MessageCreateParams;
    import com.anthropic.models.messages.Model;
    import com.anthropic.models.messages.TextBlockParam;

    public class PdfExample {
        public static void main(String[] args) throws IOException, InterruptedException {
            AnthropicClient client = AnthropicOkHttpClient.fromEnv();

            // Metodo 1: Scarica e codifica un PDF remoto
            String pdfUrl = "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf";
            HttpClient httpClient = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(pdfUrl))
                    .GET()
                    .build();

            HttpResponse<byte[]> response = httpClient.send(request, HttpResponse.BodyHandlers.ofByteArray());
            String pdfBase64 = Base64.getEncoder().encodeToString(response.body());

            // Metodo 2: Carica da un file locale
            // byte[] fileBytes = Files.readAllBytes(Path.of("document.pdf"));
            // String pdfBase64 = Base64.getEncoder().encodeToString(fileBytes);

            // Crea blocco documento con dati base64
            DocumentBlockParam documentParam = DocumentBlockParam.builder()
                    .base64PdfSource(pdfBase64)
                    .build();

            // Crea un messaggio con blocchi di contenuto documento e testo
            MessageCreateParams params = MessageCreateParams.builder()
                    .model(Model.CLAUDE_OPUS_4_20250514)
                    .maxTokens(1024)
                    .addUserMessageOfBlockParams(
                            List.of(
 ContentBlockParam.ofDocument(documentParam),
 ContentBlockParam.ofText(TextBlockParam.builder().text("Quali sono i risultati chiave in questo documento?").build())
                            )
                    )
                    .build();

            Message message = client.messages().create(params);
            message.content().stream()
                    .flatMap(contentBlock -> contentBlock.text().stream())
                    .forEach(textBlock -> System.out.println(textBlock.text()));
        }
    }
    ```

</CodeGroup>

#### Opzione 3: API Files

Per PDF che userai ripetutamente, o quando vuoi evitare il sovraccarico di codifica, usa l'[API Files](/docs/it/build-with-claude/files): 

<CodeGroup>
```bash Shell
# Prima, carica il tuo PDF nell'API Files
curl -X POST https://api.anthropic.com/v1/files \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  -F "file=@document.pdf"

# Poi usa il file_id restituito nel tuo messaggio
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  -d '{
    "model": "claude-sonnet-4-5", 
    "max_tokens": 1024,
    "messages": [{
      "role": "user",
      "content": [{
        "type": "document",
        "source": {
          "type": "file",
          "file_id": "file_abc123"
        }
      },
      {
        "type": "text",
        "text": "Quali sono i risultati chiave in questo documento?"
      }]
    }]
  }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

# Carica il file PDF
with open("document.pdf", "rb") as f:
    file_upload = client.beta.files.upload(file=("document.pdf", f, "application/pdf"))

# Usa il file caricato in un messaggio
message = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    betas=["files-api-2025-04-14"],
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "document",
                    "source": {
                        "type": "file",
                        "file_id": file_upload.id
                    }
                },
                {
                    "type": "text",
                    "text": "Quali sono i risultati chiave in questo documento?"
                }
            ]
        }
    ],
)

print(message.content)
```

```typescript TypeScript
import { Anthropic, toFile } from '@anthropic-ai/sdk';
import fs from 'fs';

const anthropic = new Anthropic();

async function main() {
  // Carica il file PDF
  const fileUpload = await anthropic.beta.files.upload({
    file: toFile(fs.createReadStream('document.pdf'), undefined, { type: 'application/pdf' })
  }, {
    betas: ['files-api-2025-04-14']
  });

  // Usa il file caricato in un messaggio
  const response = await anthropic.beta.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    betas: ['files-api-2025-04-14'],
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'document',
            source: {
              type: 'file',
              file_id: fileUpload.id
            }
          },
          {
            type: 'text',
            text: 'Quali sono i risultati chiave in questo documento?'
          }
        ]
      }
    ]
  });

  console.log(response);
}

main();
```

```java Java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.File;
import com.anthropic.models.files.FileUploadParams;
import com.anthropic.models.messages.*;

public class PdfFilesExample {
    public static void main(String[] args) throws IOException {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Carica il file PDF
        File file = client.beta().files().upload(FileUploadParams.builder()
                .file(Files.newInputStream(Path.of("document.pdf")))
                .build());

        // Usa il file caricato in un messaggio
        DocumentBlockParam documentParam = DocumentBlockParam.builder()
                .fileSource(file.id())
                .build();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                .addUserMessageOfBlockParams(
                        List.of(
 ContentBlockParam.ofDocument(documentParam),
 ContentBlockParam.ofText(
 TextBlockParam.builder()
 .text("Quali sono i risultati chiave in questo documento?")
 .build()
 )
                        )
                )
                .build();

        Message message = client.messages().create(params);
        System.out.println(message.content());
    }
}
```
</CodeGroup>

### Come funziona il supporto PDF
Quando invii un PDF a Claude, si verificano i seguenti passaggi:
<Steps>
  <Step title="Il sistema estrae i contenuti del documento.">
    - Il sistema converte ogni pagina del documento in un'immagine.
    - Il testo di ogni pagina viene estratto e fornito insieme all'immagine di ogni pagina.
  </Step>
  <Step title="Claude analizza sia il testo che le immagini per comprendere meglio il documento.">
    - I documenti sono forniti come combinazione di testo e immagini per l'analisi.
    - Questo permette agli utenti di chiedere approfondimenti sugli elementi visivi di un PDF, come grafici, diagrammi e altri contenuti non testuali.
  </Step>
  <Step title="Claude risponde, facendo riferimento ai contenuti del PDF se pertinente.">
    Claude può fare riferimento sia al contenuto testuale che visivo quando risponde. Puoi migliorare ulteriormente le prestazioni integrando il supporto PDF con:
    - **Prompt caching**: Per migliorare le prestazioni per analisi ripetute.
    - **Elaborazione batch**: Per elaborazione di documenti ad alto volume.
    - **Uso di strumenti**: Per estrarre informazioni specifiche dai documenti da utilizzare come input per strumenti.
  </Step>
</Steps>

### Stima i tuoi costi
Il conteggio dei token di un file PDF dipende dal testo totale estratto dal documento così come dal numero di pagine:
- Costi token testo: Ogni pagina utilizza tipicamente 1.500-3.000 token per pagina a seconda della densità del contenuto. Si applica il prezzo API standard senza costi aggiuntivi per PDF.
- Costi token immagine: Poiché ogni pagina viene convertita in un'immagine, si applicano gli stessi [calcoli di costo basati su immagini](/docs/it/build-with-claude/vision#evaluate-image-size).

Puoi utilizzare il [conteggio dei token](/docs/it/build-with-claude/token-counting) per stimare i costi per i tuoi PDF specifici.

***

## Ottimizza l'elaborazione PDF

### Migliora le prestazioni
Segui queste migliori pratiche per risultati ottimali:
- Posiziona i PDF prima del testo nelle tue richieste
- Usa font standard
- Assicurati che il testo sia chiaro e leggibile
- Ruota le pagine nell'orientamento verticale corretto
- Usa numeri di pagina logici (dal visualizzatore PDF) nei prompt
- Dividi PDF grandi in blocchi quando necessario
- Abilita il prompt caching per analisi ripetute

### Scala la tua implementazione
Per elaborazione ad alto volume, considera questi approcci:

#### Usa il prompt caching
Memorizza nella cache i PDF per migliorare le prestazioni su query ripetute:
<CodeGroup>
```bash Shell
# Crea un file di richiesta JSON usando il contenuto di pdf_base64.txt
jq -n --rawfile PDF_BASE64 pdf_base64.txt '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [{
        "role": "user",
        "content": [{
            "type": "document",
            "source": {
                "type": "base64",
                "media_type": "application/pdf",
                "data": $PDF_BASE64
            },
            "cache_control": {
              "type": "ephemeral"
            }
        },
        {
            "type": "text",
            "text": "Quale modello ha i tassi di vittoria di preferenza umana più alti in ogni caso d'uso?"
        }]
    }]
}' > request.json

# Poi effettua la chiamata API usando il file JSON
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d @request.json
```
```python Python
message = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "document",
                    "source": {
                        "type": "base64",
                        "media_type": "application/pdf",
                        "data": pdf_data
                    },
                    "cache_control": {"type": "ephemeral"}
                },
                {
                    "type": "text",
                    "text": "Analizza questo documento."
                }
            ]
        }
    ],
)
```

```typescript TypeScript
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 1024,
  messages: [
    {
      content: [
        {
          type: 'document',
          source: {
            media_type: 'application/pdf',
            type: 'base64',
            data: pdfBase64,
          },
          cache_control: { type: 'ephemeral' },
        },
        {
          type: 'text',
          text: 'Quale modello ha i tassi di vittoria di preferenza umana più alti in ogni caso d\'uso?',
        },
      ],
      role: 'user',
    },
  ],
});
console.log(response);
```

```java Java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.Base64PdfSource;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.ContentBlockParam;
import com.anthropic.models.messages.DocumentBlockParam;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;

public class MessagesDocumentExample {

    public static void main(String[] args) throws IOException {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Leggi file PDF come base64
        byte[] pdfBytes = Files.readAllBytes(Paths.get("pdf_base64.txt"));
        String pdfBase64 = new String(pdfBytes);

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                .addUserMessageOfBlockParams(List.of(
                        ContentBlockParam.ofDocument(
 DocumentBlockParam.builder()
 .source(Base64PdfSource.builder()
 .data(pdfBase64)
 .build())
 .cacheControl(CacheControlEphemeral.builder().build())
 .build()),
                        ContentBlockParam.ofText(
 TextBlockParam.builder()
 .text("Quale modello ha i tassi di vittoria di preferenza umana più alti in ogni caso d'uso?")
 .build())
                ))
                .build();


        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>

#### Elabora batch di documenti
Usa l'API Message Batches per flussi di lavoro ad alto volume:
<CodeGroup>
```bash Shell
# Crea un file di richiesta JSON usando il contenuto di pdf_base64.txt
jq -n --rawfile PDF_BASE64 pdf_base64.txt '
{
  "requests": [
      {
          "custom_id": "my-first-request",
          "params": {
              "model": "claude-sonnet-4-5",
              "max_tokens": 1024,
              "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "document",
                            "source": {
 "type": "base64",
 "media_type": "application/pdf",
 "data": $PDF_BASE64
                            }
                        },
                        {
                            "type": "text",
                            "text": "Quale modello ha i tassi di vittoria di preferenza umana più alti in ogni caso d\'uso?"
                        }
                    ]
                }
              ]
          }
      },
      {
          "custom_id": "my-second-request",
          "params": {
              "model": "claude-sonnet-4-5",
              "max_tokens": 1024,
              "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "document",
                            "source": {
 "type": "base64",
 "media_type": "application/pdf",
 "data": $PDF_BASE64
                            }
                        },
                        {
                            "type": "text",
                            "text": "Estrai 5 approfondimenti chiave da questo documento."
                        }
                    ]
                }
              ]
          }
      }
  ]
}
' > request.json

# Poi effettua la chiamata API usando il file JSON
curl https://api.anthropic.com/v1/messages/batches \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d @request.json
```
```python Python
message_batch = client.messages.batches.create(
    requests=[
        {
            "custom_id": "doc1",
            "params": {
                "model": "claude-sonnet-4-5",
                "max_tokens": 1024,
                "messages": [
                    {
                        "role": "user",
                        "content": [
                            {
 "type": "document",
 "source": {
 "type": "base64",
 "media_type": "application/pdf",
 "data": pdf_data
 }
                            },
                            {
 "type": "text",
 "text": "Riassumi questo documento."
                            }
                        ]
                    }
                ]
            }
        }
    ]
)
```

```typescript TypeScript
const response = await anthropic.messages.batches.create({
  requests: [
    {
      custom_id: 'my-first-request',
      params: {
        max_tokens: 1024,
        messages: [
          {
            content: [
              {
                type: 'document',
                source: {
                  media_type: 'application/pdf',
                  type: 'base64',
                  data: pdfBase64,
                },
              },
              {
                type: 'text',
                text: 'Quale modello ha i tassi di vittoria di preferenza umana più alti in ogni caso d\'uso?',
              },
            ],
            role: 'user',
          },
        ],
        model: 'claude-sonnet-4-5',
      },
    },
    {
      custom_id: 'my-second-request',
      params: {
        max_tokens: 1024,
        messages: [
          {
            content: [
              {
                type: 'document',
                source: {
                  media_type: 'application/pdf',
                  type: 'base64',
                  data: pdfBase64,
                },
              },
              {
                type: 'text',
                text: 'Estrai 5 approfondimenti chiave da questo documento.',
              },
            ],
            role: 'user',
          },
        ],
        model: 'claude-sonnet-4-5',
      },
    }
  ],
});
console.log(response);
```

```java Java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.*;
import com.anthropic.models.messages.batches.*;

public class MessagesBatchDocumentExample {

    public static void main(String[] args) throws IOException {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Leggi file PDF come base64
        byte[] pdfBytes = Files.readAllBytes(Paths.get("pdf_base64.txt"));
        String pdfBase64 = new String(pdfBytes);

        BatchCreateParams params = BatchCreateParams.builder()
                .addRequest(BatchCreateParams.Request.builder()
                        .customId("my-first-request")
                        .params(BatchCreateParams.Request.Params.builder()
 .model(Model.CLAUDE_OPUS_4_20250514)
 .maxTokens(1024)
 .addUserMessageOfBlockParams(List.of(
 ContentBlockParam.ofDocument(
 DocumentBlockParam.builder()
 .source(Base64PdfSource.builder()
 .data(pdfBase64)
 .build())
 .build()
 ),
 ContentBlockParam.ofText(
 TextBlockParam.builder()
 .text("Quale modello ha i tassi di vittoria di preferenza umana più alti in ogni caso d'uso?")
 .build()
 )
 ))
 .build())
                        .build())
                .addRequest(BatchCreateParams.Request.builder()
                        .customId("my-second-request")
                        .params(BatchCreateParams.Request.Params.builder()
 .model(Model.CLAUDE_OPUS_4_20250514)
 .maxTokens(1024)
 .addUserMessageOfBlockParams(List.of(
 ContentBlockParam.ofDocument(
 DocumentBlockParam.builder()
 .source(Base64PdfSource.builder()
 .data(pdfBase64)
 .build())
 .build()
 ),
 ContentBlockParam.ofText(
 TextBlockParam.builder()
 .text("Estrai 5 approfondimenti chiave da questo documento.")
 .build()
 )
 ))
 .build())
                        .build())
                .build();

        MessageBatch batch = client.messages().batches().create(params);
        System.out.println(batch);
    }
}
```
</CodeGroup>

## Prossimi passi

<CardGroup cols={2}>
  <Card
    title="Prova esempi PDF"
    icon="file"
    href="https://github.com/anthropics/anthropic-cookbook/tree/main/multimodal"
  >
    Esplora esempi pratici di elaborazione PDF nella nostra ricetta del cookbook.
  </Card>

  <Card
    title="Visualizza riferimento API"
    icon="code"
    href="/docs/it/api/messages"
  >
    Vedi la documentazione API completa per il supporto PDF.
  </Card>
</CardGroup>