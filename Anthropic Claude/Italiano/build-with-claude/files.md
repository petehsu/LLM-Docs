# Files API

---

L'API Files ti consente di caricare e gestire file da utilizzare con l'API Claude senza ricaricare il contenuto ad ogni richiesta. Questo è particolarmente utile quando si utilizza lo [strumento di esecuzione del codice](/docs/it/agents-and-tools/tool-use/code-execution-tool) per fornire input (ad es. dataset e documenti) e quindi scaricare output (ad es. grafici). Puoi anche utilizzare l'API Files per evitare di dover ricaricare continuamente documenti e immagini utilizzati di frequente in più chiamate API. Puoi [esplorare il riferimento API direttamente](/docs/it/api/files-create), oltre a questa guida.

<Note>
L'API Files è attualmente in beta. Ti invitiamo a contattarci tramite il nostro [modulo di feedback](https://forms.gle/tisHyierGwgN4DUE9) per condividere la tua esperienza con l'API Files.
</Note>

## Modelli supportati

Il riferimento a un `file_id` in una richiesta Messages è supportato in tutti i modelli che supportano il tipo di file specificato. Ad esempio, le [immagini](/docs/it/build-with-claude/vision) sono supportate in tutti i modelli Claude 3+, i [PDF](/docs/it/build-with-claude/pdf-support) in tutti i modelli Claude 3.5+, e [vari altri tipi di file](/docs/it/agents-and-tools/tool-use/code-execution-tool#supported-file-types) per lo strumento di esecuzione del codice in Claude 3.5 Haiku più tutti i modelli Claude 3.7+.

L'API Files non è attualmente supportata su Amazon Bedrock o Google Vertex AI.

## Come funziona l'API Files

L'API Files fornisce un semplice approccio carica-una-volta, usa-molte-volte per lavorare con i file:

- **Carica file** nel nostro storage sicuro e ricevi un `file_id` univoco
- **Scarica file** che vengono creati da skill o dallo strumento di esecuzione del codice
- **Fai riferimento ai file** nelle richieste [Messages](/docs/it/api/messages) utilizzando il `file_id` invece di ricaricare il contenuto
- **Gestisci i tuoi file** con operazioni di elenco, recupero e eliminazione

## Come utilizzare l'API Files

<Note>
Per utilizzare l'API Files, dovrai includere l'intestazione della funzione beta: `anthropic-beta: files-api-2025-04-14`.
</Note>

### Caricamento di un file

Carica un file da utilizzare nelle future chiamate API:

<CodeGroup>
```bash Shell
curl -X POST https://api.anthropic.com/v1/files \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  -F "file=@/path/to/document.pdf"
```

```python Python
import anthropic

client = anthropic.Anthropic()
client.beta.files.upload(
  file=("document.pdf", open("/path/to/document.pdf", "rb"), "application/pdf"),
)
```

```typescript TypeScript
import Anthropic, { toFile } from '@anthropic-ai/sdk';
import fs from "fs";

const anthropic = new Anthropic();

await anthropic.beta.files.upload({
  file: await toFile(fs.createReadStream('/path/to/document.pdf'), undefined, { type: 'application/pdf' })
}, {
  betas: ['files-api-2025-04-14']
});
```
</CodeGroup>

La risposta dal caricamento di un file includerà:

```json
{
  "id": "file_011CNha8iCJcU1wXNR6q4V8w",
  "type": "file",
  "filename": "document.pdf",
  "mime_type": "application/pdf",
  "size_bytes": 1024000,
  "created_at": "2025-01-01T00:00:00Z",
  "downloadable": false
}
```

### Utilizzo di un file nei messaggi

Una volta caricato, fai riferimento al file utilizzando il suo `file_id`:

<CodeGroup>
```bash Shell
curl -X POST https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "Please summarize this document for me."          
          },
          {
            "type": "document",
            "source": {
              "type": "file",
              "file_id": "file_011CNha8iCJcU1wXNR6q4V8w"
            }
          }
        ]
      }
    ]
  }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Please summarize this document for me."
                },
                {
                    "type": "document",
                    "source": {
                        "type": "file",
                        "file_id": "file_011CNha8iCJcU1wXNR6q4V8w"
                    }
                }
            ]
        }
    ],
    betas=["files-api-2025-04-14"],
)
print(response)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "Please summarize this document for me."
        },
        {
          type: "document",
          source: {
            type: "file",
            file_id: "file_011CNha8iCJcU1wXNR6q4V8w"
          }
        }
      ]
    }
  ],
  betas: ["files-api-2025-04-14"],
});

console.log(response);
```
</CodeGroup>

### Tipi di file e blocchi di contenuto

L'API Files supporta diversi tipi di file che corrispondono a diversi tipi di blocchi di contenuto:

| Tipo di file | Tipo MIME | Tipo di blocco di contenuto | Caso d'uso |
| :--- | :--- | :--- | :--- |
| PDF | `application/pdf` | `document` | Analisi del testo, elaborazione di documenti |
| Testo semplice | `text/plain` | `document` | Analisi del testo, elaborazione |
| Immagini | `image/jpeg`, `image/png`, `image/gif`, `image/webp` | `image` | Analisi delle immagini, attività visive |
| [Dataset, altri](/docs/it/agents-and-tools/tool-use/code-execution-tool#supported-file-types) | Varia | `container_upload` | Analizzare dati, creare visualizzazioni  |

### Lavoro con altri formati di file

Per i tipi di file non supportati come blocchi `document` (.csv, .txt, .md, .docx, .xlsx), converti i file in testo semplice e includi il contenuto direttamente nel tuo messaggio:

<CodeGroup>
```bash Shell
# Esempio: Lettura di un file di testo e invio come testo semplice
# Nota: Per i file con caratteri speciali, considera la codifica base64
TEXT_CONTENT=$(cat document.txt | jq -Rs .)

curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d @- <<EOF
{
  "model": "claude-sonnet-4-5",
  "max_tokens": 1024,
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "Here's the document content:\n\n${TEXT_CONTENT}\n\nPlease summarize this document."
        }
      ]
    }
  ]
}
EOF
```

```python Python
import pandas as pd
import anthropic

client = anthropic.Anthropic()

# Esempio: Lettura di un file CSV
df = pd.read_csv('data.csv')
csv_content = df.to_string()

# Invia come testo semplice nel messaggio
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": f"Here's the CSV data:\n\n{csv_content}\n\nPlease analyze this data."
                }
            ]
        }
    ]
)

print(response.content[0].text)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';
import fs from 'fs';

const anthropic = new Anthropic();

async function analyzeDocument() {
  // Esempio: Lettura di un file di testo
  const textContent = fs.readFileSync('document.txt', 'utf-8');

  // Invia come testo semplice nel messaggio
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Here's the document content:\n\n${textContent}\n\nPlease summarize this document.`
          }
        ]
      }
    ]
  });

  console.log(response.content[0].text);
}

analyzeDocument();
```
</CodeGroup>

<Note>
Per i file .docx contenenti immagini, convertili prima in formato PDF, quindi utilizza il [supporto PDF](/docs/it/build-with-claude/pdf-support) per sfruttare l'analisi delle immagini integrata. Questo consente di utilizzare citazioni dal documento PDF.
</Note>

#### Blocchi di documento

Per i PDF e i file di testo, utilizza il blocco di contenuto `document`:

```json
{
  "type": "document",
  "source": {
    "type": "file",
    "file_id": "file_011CNha8iCJcU1wXNR6q4V8w"
  },
  "title": "Document Title", // Opzionale
  "context": "Context about the document", // Opzionale  
  "citations": {"enabled": true} // Opzionale, abilita le citazioni
}
```

#### Blocchi di immagine

Per le immagini, utilizza il blocco di contenuto `image`:

```json
{
  "type": "image",
  "source": {
    "type": "file",
    "file_id": "file_011CPMxVD3fHLUhvTqtsQA5w"
  }
}
```

### Gestione dei file

#### Elenco dei file

Recupera un elenco dei tuoi file caricati:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/files \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14"
```

```python Python
import anthropic

client = anthropic.Anthropic()
files = client.beta.files.list()
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();
const files = await anthropic.beta.files.list({
  betas: ['files-api-2025-04-14'],
});
```
</CodeGroup>

#### Ottenere i metadati del file

Recupera informazioni su un file specifico:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/files/file_011CNha8iCJcU1wXNR6q4V8w \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14"
```

```python Python
import anthropic

client = anthropic.Anthropic()
file = client.beta.files.retrieve_metadata("file_011CNha8iCJcU1wXNR6q4V8w")
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();
const file = await anthropic.beta.files.retrieveMetadata(
  "file_011CNha8iCJcU1wXNR6q4V8w",
  { betas: ['files-api-2025-04-14'] },
);
```
</CodeGroup>

#### Eliminare un file

Rimuovi un file dal tuo workspace:

<CodeGroup>
```bash Shell
curl -X DELETE https://api.anthropic.com/v1/files/file_011CNha8iCJcU1wXNR6q4V8w \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14"
```

```python Python
import anthropic

client = anthropic.Anthropic()
result = client.beta.files.delete("file_011CNha8iCJcU1wXNR6q4V8w")
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();
const result = await anthropic.beta.files.delete(
  "file_011CNha8iCJcU1wXNR6q4V8w",
  { betas: ['files-api-2025-04-14'] },
);
```
</CodeGroup>

### Download di un file

Scarica file che sono stati creati da skill o dallo strumento di esecuzione del codice:

<CodeGroup>
```bash Shell
curl -X GET "https://api.anthropic.com/v1/files/file_011CNha8iCJcU1wXNR6q4V8w/content" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  --output downloaded_file.txt
```

```python Python
import anthropic

client = anthropic.Anthropic()
file_content = client.beta.files.download("file_011CNha8iCJcU1wXNR6q4V8w")

# Salva su file
with open("downloaded_file.txt", "w") as f:
    f.write(file_content.decode('utf-8'))
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';
import fs from 'fs';

const anthropic = new Anthropic();

const fileContent = await anthropic.beta.files.download(
  "file_011CNha8iCJcU1wXNR6q4V8w",
  { betas: ['files-api-2025-04-14'] },
);

// Salva su file
fs.writeFileSync("downloaded_file.txt", fileContent);
```
</CodeGroup>

<Note>
Puoi scaricare solo i file che sono stati creati da [skill](/docs/it/build-with-claude/skills-guide) o dallo [strumento di esecuzione del codice](/docs/it/agents-and-tools/tool-use/code-execution-tool). I file che hai caricato non possono essere scaricati.
</Note>

---

## Archiviazione dei file e limiti

### Limiti di archiviazione

- **Dimensione massima del file:** 500 MB per file
- **Archiviazione totale:** 100 GB per organizzazione

### Ciclo di vita del file

- I file sono limitati al workspace della chiave API. Altre chiavi API possono utilizzare file creati da qualsiasi altra chiave API associata allo stesso workspace
- I file persistono fino a quando non li elimini
- I file eliminati non possono essere recuperati
- I file sono inaccessibili tramite l'API poco dopo l'eliminazione, ma potrebbero persistere nelle chiamate attive dell'API Messages e negli usi degli strumenti associati
- I file che gli utenti eliminano verranno eliminati in conformità alla nostra [politica di conservazione dei dati](https://privacy.claude.com/en/articles/7996866-how-long-do-you-store-my-organization-s-data).

---

## Gestione degli errori

Gli errori comuni quando si utilizza l'API Files includono:

- **File non trovato (404):** Il `file_id` specificato non esiste o non hai accesso ad esso
- **Tipo di file non valido (400):** Il tipo di file non corrisponde al tipo di blocco di contenuto (ad es. utilizzo di un file immagine in un blocco documento)
- **Supera la dimensione della finestra di contesto (400):** Il file è più grande della dimensione della finestra di contesto (ad es. utilizzo di un file di testo semplice di 500 MB in una richiesta `/v1/messages`)
- **Nome file non valido (400):** Il nome file non soddisfa i requisiti di lunghezza (1-255 caratteri) o contiene caratteri vietati (`<`, `>`, `:`, `"`, `|`, `?`, `*`, `\`, `/`, o caratteri unicode 0-31)
- **File troppo grande (413):** Il file supera il limite di 500 MB
- **Limite di archiviazione superato (403):** La tua organizzazione ha raggiunto il limite di archiviazione di 100 GB

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "File not found: file_011CNha8iCJcU1wXNR6q4V8w"
  }
}
```

## Utilizzo e fatturazione

Le operazioni dell'API Files sono **gratuite**:
- Caricamento di file
- Download di file
- Elenco dei file
- Ottenimento dei metadati del file  
- Eliminazione di file

Il contenuto del file utilizzato nelle richieste `Messages` viene addebitato come token di input. Puoi scaricare solo i file creati da [skill](/docs/it/build-with-claude/skills-guide) o dallo [strumento di esecuzione del codice](/docs/it/agents-and-tools/tool-use/code-execution-tool).

### Limiti di velocità

Durante il periodo beta:
- Le chiamate API relative ai file sono limitate a circa 100 richieste al minuto
- [Contattaci](mailto:sales@anthropic.com) se hai bisogno di limiti più alti per il tuo caso d'uso