# Files API

---

Die Files API ermöglicht es Ihnen, Dateien hochzuladen und zu verwalten, um sie mit der Claude API zu verwenden, ohne Inhalte bei jeder Anfrage erneut hochladen zu müssen. Dies ist besonders nützlich bei der Verwendung des [Code-Ausführungstools](/docs/de/agents-and-tools/tool-use/code-execution-tool), um Eingaben (z.B. Datensätze und Dokumente) bereitzustellen und dann Ausgaben (z.B. Diagramme) herunterzuladen. Sie können die Files API auch verwenden, um zu vermeiden, häufig verwendete Dokumente und Bilder bei mehreren API-Aufrufen kontinuierlich erneut hochladen zu müssen. Sie können [die API-Referenz direkt erkunden](/docs/de/api/files-create), zusätzlich zu diesem Leitfaden.

<Note>
Die Files API befindet sich derzeit in der Beta-Phase. Bitte wenden Sie sich über unser [Feedback-Formular](https://forms.gle/tisHyierGwgN4DUE9) an uns, um Ihre Erfahrungen mit der Files API zu teilen.
</Note>

## Unterstützte Modelle

Das Referenzieren einer `file_id` in einer Messages-Anfrage wird in allen Modellen unterstützt, die den jeweiligen Dateityp unterstützen. Zum Beispiel werden [Bilder](/docs/de/build-with-claude/vision) in allen Claude 3+ Modellen unterstützt, [PDFs](/docs/de/build-with-claude/pdf-support) in allen Claude 3.5+ Modellen und [verschiedene andere Dateitypen](/docs/de/agents-and-tools/tool-use/code-execution-tool#supported-file-types) für das Code-Ausführungstool in Claude 3.5 Haiku plus allen Claude 3.7+ Modellen.

Die Files API wird derzeit nicht auf Amazon Bedrock oder Google Vertex AI unterstützt.

## Wie die Files API funktioniert

Die Files API bietet einen einfachen Ansatz zum einmaligen Erstellen und vielfachen Verwenden für die Arbeit mit Dateien:

- **Dateien hochladen** in unseren sicheren Speicher und eine eindeutige `file_id` erhalten
- **Dateien herunterladen**, die vom Code-Ausführungstool erstellt wurden
- **Dateien referenzieren** in [Messages](/docs/de/api/messages)-Anfragen unter Verwendung der `file_id` anstatt Inhalte erneut hochzuladen
- **Ihre Dateien verwalten** mit Auflisten-, Abrufen- und Löschoperationen

## Wie man die Files API verwendet

<Note>
Um die Files API zu verwenden, müssen Sie den Beta-Feature-Header einschließen: `anthropic-beta: files-api-2025-04-14`.
</Note>

### Eine Datei hochladen

Laden Sie eine Datei hoch, um sie in zukünftigen API-Aufrufen zu referenzieren:

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

Die Antwort vom Hochladen einer Datei wird Folgendes enthalten:

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

### Eine Datei in Nachrichten verwenden

Nach dem Hochladen referenzieren Sie die Datei mit ihrer `file_id`:

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
            "text": "Bitte fassen Sie dieses Dokument für mich zusammen."          
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
                    "text": "Bitte fassen Sie dieses Dokument für mich zusammen."
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
          text: "Bitte fassen Sie dieses Dokument für mich zusammen."
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

### Dateitypen und Inhaltsblöcke

Die Files API unterstützt verschiedene Dateitypen, die verschiedenen Inhaltsblocktypen entsprechen:

| Dateityp | MIME-Typ | Inhaltsblocktyp | Anwendungsfall |
| :--- | :--- | :--- | :--- |
| PDF | `application/pdf` | `document` | Textanalyse, Dokumentenverarbeitung |
| Klartext | `text/plain` | `document` | Textanalyse, Verarbeitung |
| Bilder | `image/jpeg`, `image/png`, `image/gif`, `image/webp` | `image` | Bildanalyse, visuelle Aufgaben |
| [Datensätze, andere](/docs/de/agents-and-tools/tool-use/code-execution-tool#supported-file-types) | Variiert | `container_upload` | Daten analysieren, Visualisierungen erstellen  |

### Arbeiten mit anderen Dateiformaten

Für Dateitypen, die nicht als `document`-Blöcke unterstützt werden (.csv, .txt, .md, .docx, .xlsx), konvertieren Sie die Dateien in Klartext und fügen Sie den Inhalt direkt in Ihre Nachricht ein:

<CodeGroup>
```bash Shell
# Beispiel: Eine Textdatei lesen und als Klartext senden
# Hinweis: Für Dateien mit Sonderzeichen sollten Sie Base64-Kodierung in Betracht ziehen
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
          "text": "Hier ist der Dokumenteninhalt:\n\n${TEXT_CONTENT}\n\nBitte fassen Sie dieses Dokument zusammen."
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

# Beispiel: Eine CSV-Datei lesen
df = pd.read_csv('data.csv')
csv_content = df.to_string()

# Als Klartext in der Nachricht senden
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": f"Hier sind die CSV-Daten:\n\n{csv_content}\n\nBitte analysieren Sie diese Daten."
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
  // Beispiel: Eine Textdatei lesen
  const textContent = fs.readFileSync('document.txt', 'utf-8');

  // Als Klartext in der Nachricht senden
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Hier ist der Dokumenteninhalt:\n\n${textContent}\n\nBitte fassen Sie dieses Dokument zusammen.`
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
Für .docx-Dateien, die Bilder enthalten, konvertieren Sie sie zuerst in das PDF-Format und verwenden Sie dann die [PDF-Unterstützung](/docs/de/build-with-claude/pdf-support), um die eingebaute Bildanalyse zu nutzen. Dies ermöglicht die Verwendung von Zitaten aus dem PDF-Dokument.
</Note>

#### Dokumentblöcke

Für PDFs und Textdateien verwenden Sie den `document`-Inhaltsblock:

```json
{
  "type": "document",
  "source": {
    "type": "file",
    "file_id": "file_011CNha8iCJcU1wXNR6q4V8w"
  },
  "title": "Dokumenttitel", // Optional
  "context": "Kontext über das Dokument", // Optional  
  "citations": {"enabled": true} // Optional, aktiviert Zitate
}
```

#### Bildblöcke

Für Bilder verwenden Sie den `image`-Inhaltsblock:

```json
{
  "type": "image",
  "source": {
    "type": "file",
    "file_id": "file_011CPMxVD3fHLUhvTqtsQA5w"
  }
}
```

### Dateien verwalten

#### Dateien auflisten

Rufen Sie eine Liste Ihrer hochgeladenen Dateien ab:

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

#### Dateimetadaten abrufen

Rufen Sie Informationen über eine bestimmte Datei ab:

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

#### Eine Datei löschen

Entfernen Sie eine Datei aus Ihrem Arbeitsbereich:

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

### Eine Datei herunterladen

Laden Sie Dateien herunter, die vom Code-Ausführungstool erstellt wurden:

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

# In Datei speichern
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

// In Datei speichern
fs.writeFileSync("downloaded_file.txt", fileContent);
```
</CodeGroup>

<Note>
Sie können nur Dateien herunterladen, die vom [Code-Ausführungstool](/docs/de/agents-and-tools/tool-use/code-execution-tool) erstellt wurden. Dateien, die Sie hochgeladen haben, können nicht heruntergeladen werden.
</Note>

---

## Dateispeicherung und Limits

### Speicherlimits

- **Maximale Dateigröße:** 500 MB pro Datei
- **Gesamtspeicher:** 100 GB pro Organisation

### Datei-Lebenszyklus

- Dateien sind auf den Arbeitsbereich des API-Schlüssels beschränkt. Andere API-Schlüssel können Dateien verwenden, die von jedem anderen API-Schlüssel erstellt wurden, der mit demselben Arbeitsbereich verknüpft ist
- Dateien bleiben bestehen, bis Sie sie löschen
- Gelöschte Dateien können nicht wiederhergestellt werden
- Dateien sind über die API kurz nach dem Löschen nicht mehr zugänglich, aber sie können in aktiven `Messages`-API-Aufrufen und zugehörigen Tool-Verwendungen bestehen bleiben

---

## Fehlerbehandlung

Häufige Fehler bei der Verwendung der Files API umfassen:

- **Datei nicht gefunden (404):** Die angegebene `file_id` existiert nicht oder Sie haben keinen Zugriff darauf
- **Ungültiger Dateityp (400):** Der Dateityp stimmt nicht mit dem Inhaltsblocktyp überein (z.B. Verwendung einer Bilddatei in einem Dokumentblock)
- **Überschreitet Kontextfenstergröße (400):** Die Datei ist größer als die Kontextfenstergröße (z.B. Verwendung einer 500 MB Klartextdatei in einer `/v1/messages`-Anfrage)
- **Ungültiger Dateiname (400):** Dateiname erfüllt nicht die Längenanforderungen (1-255 Zeichen) oder enthält verbotene Zeichen (`<`, `>`, `:`, `"`, `|`, `?`, `*`, `\`, `/`, oder Unicode-Zeichen 0-31)
- **Datei zu groß (413):** Datei überschreitet das 500 MB Limit
- **Speicherlimit überschritten (403):** Ihre Organisation hat das 100 GB Speicherlimit erreicht

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "File not found: file_011CNha8iCJcU1wXNR6q4V8w"
  }
}
```

## Nutzung und Abrechnung

File API-Operationen sind **kostenlos**:
- Dateien hochladen
- Dateien herunterladen
- Dateien auflisten
- Dateimetadaten abrufen  
- Dateien löschen

Dateiinhalte, die in `Messages`-Anfragen verwendet werden, werden als Eingabe-Token berechnet. Sie können nur Dateien herunterladen, die vom Code-Ausführungstool erstellt wurden.

### Rate-Limits

Während der Beta-Phase:
- Dateibezogene API-Aufrufe sind auf etwa 100 Anfragen pro Minute begrenzt
- [Kontaktieren Sie uns](mailto:sales@anthropic.com), wenn Sie höhere Limits für Ihren Anwendungsfall benötigen