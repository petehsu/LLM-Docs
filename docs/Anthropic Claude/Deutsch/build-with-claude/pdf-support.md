# PDF-Unterstützung

Verarbeiten Sie PDFs mit Claude. Extrahieren Sie Text, analysieren Sie Diagramme und verstehen Sie visuelle Inhalte aus Ihren Dokumenten.

---

Sie können Claude jetzt zu jedem Text, Bildern, Diagrammen und Tabellen in PDFs befragen, die Sie bereitstellen. Einige Beispiel-Anwendungsfälle:
- Analyse von Finanzberichten und Verstehen von Diagrammen/Tabellen
- Extraktion wichtiger Informationen aus Rechtsdokumenten
- Übersetzungshilfe für Dokumente
- Konvertierung von Dokumentinformationen in strukturierte Formate

## Bevor Sie beginnen

### PDF-Anforderungen prüfen
Claude funktioniert mit jedem Standard-PDF. Sie sollten jedoch sicherstellen, dass Ihre Anfragegröße diese Anforderungen erfüllt, wenn Sie PDF-Unterstützung verwenden:

| Anforderung | Limit |
|---|---|
| Maximale Anfragegröße | 32MB |
| Maximale Seiten pro Anfrage | 100 |
| Format | Standard-PDF (keine Passwörter/Verschlüsselung) |

Bitte beachten Sie, dass beide Limits für die gesamte Anfrage-Payload gelten, einschließlich aller anderen Inhalte, die zusammen mit PDFs gesendet werden.

Da die PDF-Unterstützung auf Claudes Vision-Fähigkeiten basiert, unterliegt sie denselben [Einschränkungen und Überlegungen](/docs/de/build-with-claude/vision#limitations) wie andere Vision-Aufgaben.

### Unterstützte Plattformen und Modelle

PDF-Unterstützung wird derzeit über direkten API-Zugang und Google Vertex AI unterstützt. Alle [aktiven Modelle](/docs/de/about-claude/models/overview) unterstützen PDF-Verarbeitung.

PDF-Unterstützung ist jetzt auf Amazon Bedrock mit den folgenden Überlegungen verfügbar:

### Amazon Bedrock PDF-Unterstützung

Bei der Verwendung von PDF-Unterstützung über Amazon Bedrocks Converse API gibt es zwei verschiedene Dokumentverarbeitungsmodi:

<Note>
**Wichtig**: Um auf Claudes vollständige visuelle PDF-Verständnisfähigkeiten in der Converse API zuzugreifen, müssen Sie Zitate aktivieren. Ohne aktivierte Zitate fällt die API auf nur grundlegende Textextraktion zurück. Erfahren Sie mehr über [Arbeiten mit Zitaten](/docs/de/build-with-claude/citations).
</Note>

#### Dokumentverarbeitungsmodi

1. **Converse Document Chat** (Ursprünglicher Modus - Nur Textextraktion)
   - Bietet grundlegende Textextraktion aus PDFs
   - Kann keine Bilder, Diagramme oder visuelle Layouts innerhalb von PDFs analysieren
   - Verwendet etwa 1.000 Token für ein 3-seitiges PDF
   - Wird automatisch verwendet, wenn Zitate nicht aktiviert sind

2. **Claude PDF Chat** (Neuer Modus - Vollständiges visuelles Verständnis)
   - Bietet vollständige visuelle Analyse von PDFs
   - Kann Diagramme, Grafiken, Bilder und visuelle Layouts verstehen und analysieren
   - Verarbeitet jede Seite sowohl als Text als auch als Bild für umfassendes Verständnis
   - Verwendet etwa 7.000 Token für ein 3-seitiges PDF
   - **Erfordert aktivierte Zitate** in der Converse API

#### Wichtige Einschränkungen

- **Converse API**: Visuelle PDF-Analyse erfordert aktivierte Zitate. Es gibt derzeit keine Option, visuelle Analyse ohne Zitate zu verwenden (im Gegensatz zur InvokeModel API).
- **InvokeModel API**: Bietet vollständige Kontrolle über PDF-Verarbeitung ohne erzwungene Zitate.

#### Häufige Probleme

Wenn Kunden berichten, dass Claude keine Bilder oder Diagramme in ihren PDFs sieht, wenn sie die Converse API verwenden, müssen sie wahrscheinlich das Zitate-Flag aktivieren. Ohne es fällt Converse auf nur grundlegende Textextraktion zurück.

<Note>
Dies ist eine bekannte Einschränkung der Converse API, an deren Behebung wir arbeiten. Für Anwendungen, die visuelle PDF-Analyse ohne Zitate benötigen, verwenden Sie stattdessen die InvokeModel API.
</Note>

<Note>
Für Nicht-PDF-Dateien wie .csv, .xlsx, .docx, .md oder .txt-Dateien siehe [Arbeiten mit anderen Dateiformaten](/docs/de/build-with-claude/files#working-with-other-file-formats).
</Note>

***

## PDFs mit Claude verarbeiten

### Senden Sie Ihre erste PDF-Anfrage
Beginnen wir mit einem einfachen Beispiel mit der Messages API. Sie können PDFs auf drei Arten an Claude bereitstellen:

1. Als URL-Referenz zu einem online gehosteten PDF
2. Als base64-kodiertes PDF in `document`-Inhaltsblöcken  
3. Über eine `file_id` aus der [Files API](/docs/de/build-with-claude/files)

#### Option 1: URL-basiertes PDF-Dokument

Der einfachste Ansatz ist, ein PDF direkt über eine URL zu referenzieren:

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
                "text": "Was sind die wichtigsten Erkenntnisse in diesem Dokument?"
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
                        "text": "Was sind die wichtigsten Erkenntnisse in diesem Dokument?"
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
                text: 'Was sind die wichtigsten Erkenntnisse in diesem Dokument?',
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
 .text("Was sind die wichtigsten Erkenntnisse in diesem Dokument?")
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

#### Option 2: Base64-kodiertes PDF-Dokument

Wenn Sie PDFs von Ihrem lokalen System senden müssen oder wenn eine URL nicht verfügbar ist:

<CodeGroup>
    ```bash Shell
    # Methode 1: Remote-PDF abrufen und kodieren
    curl -s "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf" | base64 | tr -d '\n' > pdf_base64.txt

    # Methode 2: Lokale PDF-Datei kodieren
    # base64 document.pdf | tr -d '\n' > pdf_base64.txt

    # JSON-Anfragedatei mit dem pdf_base64.txt-Inhalt erstellen
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
                "text": "Was sind die wichtigsten Erkenntnisse in diesem Dokument?"
            }]
        }]
    }' > request.json

    # API-Anfrage mit der JSON-Datei senden
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

    # Zuerst PDF laden und kodieren 
    pdf_url = "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf"
    pdf_data = base64.standard_b64encode(httpx.get(pdf_url).content).decode("utf-8")

    # Alternative: Von lokaler Datei laden
    # with open("document.pdf", "rb") as f:
    #     pdf_data = base64.standard_b64encode(f.read()).decode("utf-8")

    # An Claude mit base64-Kodierung senden
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
                        "text": "Was sind die wichtigsten Erkenntnisse in diesem Dokument?"
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
      // Methode 1: Remote-PDF abrufen und kodieren
      const pdfURL = "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf";
      const pdfResponse = await fetch(pdfURL);
      const arrayBuffer = await pdfResponse.arrayBuffer();
      const pdfBase64 = Buffer.from(arrayBuffer).toString('base64');
      
      // Methode 2: Von lokaler Datei laden
      // const pdfBase64 = fs.readFileSync('document.pdf').toString('base64');
      
      // API-Anfrage mit base64-kodiertem PDF senden
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
                text: 'Was sind die wichtigsten Erkenntnisse in diesem Dokument?',
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

            // Methode 1: Remote-PDF herunterladen und kodieren
            String pdfUrl = "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf";
            HttpClient httpClient = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(pdfUrl))
                    .GET()
                    .build();

            HttpResponse<byte[]> response = httpClient.send(request, HttpResponse.BodyHandlers.ofByteArray());
            String pdfBase64 = Base64.getEncoder().encodeToString(response.body());

            // Methode 2: Von lokaler Datei laden
            // byte[] fileBytes = Files.readAllBytes(Path.of("document.pdf"));
            // String pdfBase64 = Base64.getEncoder().encodeToString(fileBytes);

            // Dokumentblock mit base64-Daten erstellen
            DocumentBlockParam documentParam = DocumentBlockParam.builder()
                    .base64PdfSource(pdfBase64)
                    .build();

            // Nachricht mit Dokument- und Text-Inhaltsblöcken erstellen
            MessageCreateParams params = MessageCreateParams.builder()
                    .model(Model.CLAUDE_OPUS_4_20250514)
                    .maxTokens(1024)
                    .addUserMessageOfBlockParams(
                            List.of(
 ContentBlockParam.ofDocument(documentParam),
 ContentBlockParam.ofText(TextBlockParam.builder().text("Was sind die wichtigsten Erkenntnisse in diesem Dokument?").build())
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

#### Option 3: Files API

Für PDFs, die Sie wiederholt verwenden werden, oder wenn Sie Kodierungs-Overhead vermeiden möchten, verwenden Sie die [Files API](/docs/de/build-with-claude/files): 

<CodeGroup>
```bash Shell
# Zuerst Ihr PDF zur Files API hochladen
curl -X POST https://api.anthropic.com/v1/files \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  -F "file=@document.pdf"

# Dann die zurückgegebene file_id in Ihrer Nachricht verwenden
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
        "text": "Was sind die wichtigsten Erkenntnisse in diesem Dokument?"
      }]
    }]
  }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

# PDF-Datei hochladen
with open("document.pdf", "rb") as f:
    file_upload = client.beta.files.upload(file=("document.pdf", f, "application/pdf"))

# Hochgeladene Datei in einer Nachricht verwenden
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
                    "text": "Was sind die wichtigsten Erkenntnisse in diesem Dokument?"
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
  // PDF-Datei hochladen
  const fileUpload = await anthropic.beta.files.upload({
    file: toFile(fs.createReadStream('document.pdf'), undefined, { type: 'application/pdf' })
  }, {
    betas: ['files-api-2025-04-14']
  });

  // Hochgeladene Datei in einer Nachricht verwenden
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
            text: 'Was sind die wichtigsten Erkenntnisse in diesem Dokument?'
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

        // PDF-Datei hochladen
        File file = client.beta().files().upload(FileUploadParams.builder()
                .file(Files.newInputStream(Path.of("document.pdf")))
                .build());

        // Hochgeladene Datei in einer Nachricht verwenden
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
 .text("Was sind die wichtigsten Erkenntnisse in diesem Dokument?")
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

### Wie PDF-Unterstützung funktioniert
Wenn Sie ein PDF an Claude senden, laufen folgende Schritte ab:
<Steps>
  <Step title="Das System extrahiert den Inhalt des Dokuments.">
    - Das System konvertiert jede Seite des Dokuments in ein Bild.
    - Der Text von jeder Seite wird extrahiert und zusammen mit dem Bild jeder Seite bereitgestellt.
  </Step>
  <Step title="Claude analysiert sowohl den Text als auch die Bilder, um das Dokument besser zu verstehen.">
    - Dokumente werden als Kombination aus Text und Bildern zur Analyse bereitgestellt.
    - Dies ermöglicht es Benutzern, nach Einblicken in visuelle Elemente eines PDFs zu fragen, wie Diagramme, Schaubilder und andere nicht-textuelle Inhalte.
  </Step>
  <Step title="Claude antwortet und referenziert dabei den Inhalt des PDFs, falls relevant.">
    Claude kann sowohl textuelle als auch visuelle Inhalte referenzieren, wenn es antwortet. Sie können die Leistung weiter verbessern, indem Sie PDF-Unterstützung integrieren mit:
    - **Prompt-Caching**: Um die Leistung für wiederholte Analysen zu verbessern.
    - **Batch-Verarbeitung**: Für hochvolumige Dokumentverarbeitung.
    - **Tool-Verwendung**: Um spezifische Informationen aus Dokumenten für die Verwendung als Tool-Eingaben zu extrahieren.
  </Step>
</Steps>

### Schätzen Sie Ihre Kosten
Die Token-Anzahl einer PDF-Datei hängt vom gesamten aus dem Dokument extrahierten Text sowie der Anzahl der Seiten ab:
- Text-Token-Kosten: Jede Seite verwendet typischerweise 1.500-3.000 Token pro Seite, abhängig von der Inhaltsdichte. Standard-API-Preise gelten ohne zusätzliche PDF-Gebühren.
- Bild-Token-Kosten: Da jede Seite in ein Bild konvertiert wird, werden dieselben [bildbasierten Kostenberechnungen](/docs/de/build-with-claude/vision#evaluate-image-size) angewendet.

Sie können [Token-Zählung](/docs/de/build-with-claude/token-counting) verwenden, um Kosten für Ihre spezifischen PDFs zu schätzen.

***

## PDF-Verarbeitung optimieren

### Leistung verbessern
Befolgen Sie diese Best Practices für optimale Ergebnisse:
- Platzieren Sie PDFs vor Text in Ihren Anfragen
- Verwenden Sie Standard-Schriftarten
- Stellen Sie sicher, dass Text klar und lesbar ist
- Drehen Sie Seiten in die richtige aufrechte Ausrichtung
- Verwenden Sie logische Seitenzahlen (aus PDF-Viewer) in Prompts
- Teilen Sie große PDFs bei Bedarf in Chunks auf
- Aktivieren Sie Prompt-Caching für wiederholte Analysen

### Skalieren Sie Ihre Implementierung
Für hochvolumige Verarbeitung betrachten Sie diese Ansätze:

#### Prompt-Caching verwenden
Cachen Sie PDFs, um die Leistung bei wiederholten Abfragen zu verbessern:
<CodeGroup>
```bash Shell
# JSON-Anfragedatei mit dem pdf_base64.txt-Inhalt erstellen
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
            "text": "Welches Modell hat die höchsten menschlichen Präferenz-Gewinnraten in jedem Anwendungsfall?"
        }]
    }]
}' > request.json

# Dann den API-Aufruf mit der JSON-Datei machen
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
                    "text": "Analysieren Sie dieses Dokument."
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
          text: 'Welches Modell hat die höchsten menschlichen Präferenz-Gewinnraten in jedem Anwendungsfall?',
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

        // PDF-Datei als base64 lesen
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
 .text("Welches Modell hat die höchsten menschlichen Präferenz-Gewinnraten in jedem Anwendungsfall?")
 .build())
                ))
                .build();


        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>

#### Dokument-Batches verarbeiten
Verwenden Sie die Message Batches API für hochvolumige Workflows:
<CodeGroup>
```bash Shell
# JSON-Anfragedatei mit dem pdf_base64.txt-Inhalt erstellen
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
                            "text": "Welches Modell hat die höchsten menschlichen Präferenz-Gewinnraten in jedem Anwendungsfall?"
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
                            "text": "Extrahieren Sie 5 wichtige Erkenntnisse aus diesem Dokument."
                        }
                    ]
                }
              ]
          }
      }
  ]
}
' > request.json

# Dann den API-Aufruf mit der JSON-Datei machen
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
 "text": "Fassen Sie dieses Dokument zusammen."
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
                text: 'Welches Modell hat die höchsten menschlichen Präferenz-Gewinnraten in jedem Anwendungsfall?',
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
                text: 'Extrahieren Sie 5 wichtige Erkenntnisse aus diesem Dokument.',
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

        // PDF-Datei als base64 lesen
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
 .text("Welches Modell hat die höchsten menschlichen Präferenz-Gewinnraten in jedem Anwendungsfall?")
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
 .text("Extrahieren Sie 5 wichtige Erkenntnisse aus diesem Dokument.")
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

## Nächste Schritte

<CardGroup cols={2}>
  <Card
    title="PDF-Beispiele ausprobieren"
    icon="file"
    href="https://github.com/anthropics/anthropic-cookbook/tree/main/multimodal"
  >
    Erkunden Sie praktische Beispiele der PDF-Verarbeitung in unserem Cookbook-Rezept.
  </Card>

  <Card
    title="API-Referenz anzeigen"
    icon="code"
    href="/docs/de/api/messages"
  >
    Sehen Sie die vollständige API-Dokumentation für PDF-Unterstützung.
  </Card>
</CardGroup>