# Zitate

Claude ist in der Lage, detaillierte Zitate zu liefern, wenn es Fragen zu Dokumenten beantwortet, und hilft Ihnen dabei, Informationsquellen in Antworten zu verfolgen und zu verifizieren.

---

Claude ist in der Lage, detaillierte Zitate zu liefern, wenn es Fragen zu Dokumenten beantwortet, und hilft Ihnen dabei, Informationsquellen in Antworten zu verfolgen und zu verifizieren.

Alle [aktiven Modelle](/docs/de/about-claude/models/overview) unterstützen Zitate, mit Ausnahme von Haiku 3.

<Warning>
*Zitate mit Claude Sonnet 3.7*

Claude Sonnet 3.7 ist möglicherweise weniger geneigt, Zitate zu erstellen als andere Claude-Modelle, ohne explizitere Anweisungen vom Benutzer. Bei der Verwendung von Zitaten mit Claude Sonnet 3.7 empfehlen wir, zusätzliche Anweisungen in den `user`-Turn aufzunehmen, wie zum Beispiel `"Verwenden Sie Zitate, um Ihre Antwort zu untermauern."`.

Wir haben auch beobachtet, dass das Modell, wenn es aufgefordert wird, seine Antwort zu strukturieren, wahrscheinlich keine Zitate verwenden wird, es sei denn, es wird explizit angewiesen, Zitate in diesem Format zu verwenden. Wenn das Modell beispielsweise aufgefordert wird, `<result>`-Tags in seiner Antwort zu verwenden, sollten Sie etwas wie `"Verwenden Sie immer Zitate in Ihrer Antwort, auch innerhalb von <result>-Tags."` hinzufügen.
</Warning>
<Tip>
  Bitte teilen Sie Ihr Feedback und Ihre Vorschläge zur Zitat-Funktion über dieses [Formular](https://forms.gle/9n9hSrKnKe3rpowH9) mit.
</Tip>

Hier ist ein Beispiel für die Verwendung von Zitaten mit der Messages API:

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
              "data": "Das Gras ist grün. Der Himmel ist blau."
            },
            "title": "Mein Dokument",
            "context": "Dies ist ein vertrauenswürdiges Dokument.",
            "citations": {"enabled": true}
          },
          {
            "type": "text",
            "text": "Welche Farbe haben das Gras und der Himmel?"
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
                        "data": "Das Gras ist grün. Der Himmel ist blau."
                    },
                    "title": "Mein Dokument",
                    "context": "Dies ist ein vertrauenswürdiges Dokument.",
                    "citations": {"enabled": True}
                },
                {
                    "type": "text",
                    "text": "Welche Farbe haben das Gras und der Himmel?"
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
                .data("Das Gras ist grün. Der Himmel ist blau.")
                .build();

        DocumentBlockParam documentParam = DocumentBlockParam.builder()
                .source(source)
                .title("Mein Dokument")
                .context("Dies ist ein vertrauenswürdiges Dokument.")
                .citations(CitationsConfigParam.builder().enabled(true).build())
                .build();
        
        TextBlockParam textBlockParam = TextBlockParam.builder()
                .text("Welche Farbe haben das Gras und der Himmel?")
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
**Vergleich mit prompt-basierten Ansätzen**

Im Vergleich zu prompt-basierten Zitat-Lösungen hat die Zitat-Funktion folgende Vorteile:
- **Kosteneinsparungen:** Wenn Ihr prompt-basierter Ansatz Claude dazu auffordert, direkte Zitate auszugeben, können Sie Kosteneinsparungen sehen, da `cited_text` nicht zu Ihren Ausgabe-Token zählt.
- **Bessere Zitat-Zuverlässigkeit:** Da wir Zitate in die jeweiligen oben genannten Antwortformate parsen und `cited_text` extrahieren, enthalten Zitate garantiert gültige Zeiger auf die bereitgestellten Dokumente.
- **Verbesserte Zitat-Qualität:** In unseren Evaluierungen stellten wir fest, dass die Zitat-Funktion deutlich wahrscheinlicher die relevantesten Zitate aus Dokumenten zitiert als rein prompt-basierte Ansätze.
</Tip>

---

## Wie Zitate funktionieren

Integrieren Sie Zitate mit Claude in diesen Schritten:

<Steps>
  <Step title="Dokument(e) bereitstellen und Zitate aktivieren">
    - Fügen Sie Dokumente in einem der unterstützten Formate hinzu: [PDFs](#pdf-dokumente), [Klartext](#klartext-dokumente) oder [benutzerdefinierte Inhalte](#benutzerdefinierte-inhalts-dokumente) Dokumente
    - Setzen Sie `citations.enabled=true` für jedes Ihrer Dokumente. Derzeit müssen Zitate für alle oder keine der Dokumente innerhalb einer Anfrage aktiviert werden.
    - Beachten Sie, dass derzeit nur Text-Zitate unterstützt werden und Bild-Zitate noch nicht möglich sind.
  </Step>
  <Step title="Dokumente werden verarbeitet">
    - Dokumentinhalte werden "aufgeteilt", um die minimale Granularität möglicher Zitate zu definieren. Zum Beispiel würde eine Satz-Aufteilung Claude erlauben, einen einzelnen Satz zu zitieren oder mehrere aufeinanderfolgende Sätze zu verketten, um einen Absatz (oder länger) zu zitieren!
      - **Für PDFs:** Text wird wie in [PDF-Unterstützung](/docs/de/build-with-claude/pdf-support) beschrieben extrahiert und der Inhalt wird in Sätze aufgeteilt. Das Zitieren von Bildern aus PDFs wird derzeit nicht unterstützt.
      - **Für Klartext-Dokumente:** Der Inhalt wird in Sätze aufgeteilt, die zitiert werden können.
      - **Für benutzerdefinierte Inhalts-Dokumente:** Ihre bereitgestellten Inhaltsblöcke werden unverändert verwendet und keine weitere Aufteilung wird vorgenommen.
  </Step>
  <Step title="Claude liefert zitierte Antwort">
    - Antworten können jetzt mehrere Textblöcke enthalten, wobei jeder Textblock eine Behauptung enthalten kann, die Claude macht, und eine Liste von Zitaten, die die Behauptung unterstützen.
    - Zitate verweisen auf spezifische Stellen in Quelldokumenten. Das Format dieser Zitate hängt vom Typ des zitierten Dokuments ab.
      - **Für PDFs:** Zitate enthalten den Seitenzahlenbereich (1-indiziert).
      - **Für Klartext-Dokumente:** Zitate enthalten den Zeichenindex-Bereich (0-indiziert).
      - **Für benutzerdefinierte Inhalts-Dokumente:** Zitate enthalten den Inhaltsblock-Index-Bereich (0-indiziert) entsprechend der ursprünglich bereitgestellten Inhaltsliste.
    - Dokumentindizes werden bereitgestellt, um die Referenzquelle anzugeben und sind 0-indiziert entsprechend der Liste aller Dokumente in Ihrer ursprünglichen Anfrage.
  </Step>
</Steps>

<Tip>
  **Automatische Aufteilung vs. benutzerdefinierte Inhalte**

  Standardmäßig werden Klartext- und PDF-Dokumente automatisch in Sätze aufgeteilt. Wenn Sie mehr Kontrolle über die Zitat-Granularität benötigen (z.B. für Aufzählungspunkte oder Transkripte), verwenden Sie stattdessen benutzerdefinierte Inhalts-Dokumente. Siehe [Dokumenttypen](#dokumenttypen) für weitere Details.

  Wenn Sie beispielsweise möchten, dass Claude spezifische Sätze aus Ihren RAG-Chunks zitieren kann, sollten Sie jeden RAG-Chunk in ein Klartext-Dokument einfügen. Andernfalls, wenn Sie keine weitere Aufteilung wünschen oder wenn Sie eine benutzerdefinierte Aufteilung anpassen möchten, können Sie RAG-Chunks in benutzerdefinierte Inhalts-Dokument(e) einfügen.
</Tip>

### Zitierbare vs. nicht-zitierbare Inhalte

- Text, der innerhalb des `source`-Inhalts eines Dokuments gefunden wird, kann zitiert werden.
- `title` und `context` sind optionale Felder, die an das Modell weitergegeben werden, aber nicht für zitierten Inhalt verwendet werden.
- `title` ist in der Länge begrenzt, daher kann das `context`-Feld nützlich sein, um Dokument-Metadaten als Text oder stringifiziertes JSON zu speichern.

### Zitat-Indizes
- Dokumentindizes sind 0-indiziert aus der Liste aller Dokument-Inhaltsblöcke in der Anfrage (über alle Nachrichten hinweg).
- Zeichenindizes sind 0-indiziert mit exklusiven Endindizes.
- Seitenzahlen sind 1-indiziert mit exklusiven End-Seitenzahlen.
- Inhaltsblock-Indizes sind 0-indiziert mit exklusiven Endindizes aus der in dem benutzerdefinierten Inhalts-Dokument bereitgestellten `content`-Liste.

### Token-Kosten
- Das Aktivieren von Zitaten führt zu einem leichten Anstieg der Eingabe-Token aufgrund von Systemprompt-Ergänzungen und Dokument-Aufteilung.
- Die Zitat-Funktion ist jedoch sehr effizient mit Ausgabe-Token. Unter der Haube gibt das Modell Zitate in einem standardisierten Format aus, die dann in zitierten Text und Dokument-Standort-Indizes geparst werden. Das `cited_text`-Feld wird zur Bequemlichkeit bereitgestellt und zählt nicht zu den Ausgabe-Token.
- Wenn es in nachfolgenden Gesprächsrunden zurückgegeben wird, wird `cited_text` auch nicht zu den Eingabe-Token gezählt.

### Funktionskompatibilität
Zitate funktionieren in Verbindung mit anderen API-Funktionen einschließlich [Prompt-Caching](/docs/de/build-with-claude/prompt-caching), [Token-Zählung](/docs/de/build-with-claude/token-counting) und [Batch-Verarbeitung](/docs/de/build-with-claude/batch-processing).

#### Verwendung von Prompt-Caching mit Zitaten

Zitate und Prompt-Caching können effektiv zusammen verwendet werden.

Die in Antworten generierten Zitat-Blöcke können nicht direkt gecacht werden, aber die Quelldokumente, auf die sie verweisen, können gecacht werden. Um die Leistung zu optimieren, wenden Sie `cache_control` auf Ihre Top-Level-Dokument-Inhaltsblöcke an.

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# Langes Dokument-Inhalt (z.B. technische Dokumentation)
long_document = "Dies ist ein sehr langes Dokument mit Tausenden von Wörtern..." + " ... " * 1000  # Minimale cacheable Länge

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
                    "cache_control": {"type": "ephemeral"}  # Cache den Dokument-Inhalt
                },
                {
                    "type": "text",
                    "text": "Was sagt dieses Dokument über API-Funktionen?"
                }
            ]
        }
    ]
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

// Langes Dokument-Inhalt (z.B. technische Dokumentation)
const longDocument = "Dies ist ein sehr langes Dokument mit Tausenden von Wörtern..." + " ... ".repeat(1000);  // Minimale cacheable Länge

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
          cache_control: { type: "ephemeral" }  // Cache den Dokument-Inhalt
        },
        {
          type: "text",
          text: "Was sagt dieses Dokument über API-Funktionen?"
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
                        "data": "Dies ist ein sehr langes Dokument mit Tausenden von Wörtern..."
                    },
                    "citations": {"enabled": true},
                    "cache_control": {"type": "ephemeral"}
                },
                {
                    "type": "text",
                    "text": "Was sagt dieses Dokument über API-Funktionen?"
                }
            ]
        }
    ]
}'
```
</CodeGroup>

In diesem Beispiel:
- Der Dokument-Inhalt wird mit `cache_control` auf dem Dokument-Block gecacht
- Zitate sind auf dem Dokument aktiviert
- Claude kann Antworten mit Zitaten generieren, während es von gecachtem Dokument-Inhalt profitiert
- Nachfolgende Anfragen mit demselben Dokument profitieren vom gecachten Inhalt

## Dokumenttypen

### Auswahl eines Dokumenttyps

Wir unterstützen drei Dokumenttypen für Zitate. Dokumente können direkt in der Nachricht bereitgestellt werden (base64, Text oder URL) oder über die [Files API](/docs/de/build-with-claude/files) hochgeladen und durch `file_id` referenziert werden:

| Typ | Am besten für | Aufteilung | Zitat-Format |
| :--- | :--- | :--- | :--- |
| Klartext | Einfache Textdokumente, Prosa | Satz | Zeichenindizes (0-indiziert) |
| PDF | PDF-Dateien mit Textinhalt | Satz | Seitenzahlen (1-indiziert) |
| Benutzerdefinierter Inhalt | Listen, Transkripte, spezielle Formatierung, granularere Zitate | Keine zusätzliche Aufteilung | Block-Indizes (0-indiziert) |

<Note>
.csv, .xlsx, .docx, .md und .txt Dateien werden nicht als Dokument-Blöcke unterstützt. Konvertieren Sie diese zu Klartext und fügen Sie sie direkt in den Nachrichteninhalt ein. Siehe [Arbeiten mit anderen Dateiformaten](/docs/de/build-with-claude/files#working-with-other-file-formats).
</Note>

### Klartext-Dokumente

Klartext-Dokumente werden automatisch in Sätze aufgeteilt. Sie können sie inline oder per Referenz mit ihrer `file_id` bereitstellen:

<Tabs>
<Tab title="Inline-Text">
```python
{
    "type": "document",
    "source": {
        "type": "text",
        "media_type": "text/plain",
        "data": "Klartext-Inhalt..."
    },
    "title": "Dokument-Titel", # optional
    "context": "Kontext über das Dokument, das nicht zitiert wird", # optional
    "citations": {"enabled": True}
}
```
</Tab>
<Tab title="Files API">
```python
{
    "type": "document",
    "source": {
        "type": "file",
        "file_id": "file_011CNvxoj286tYUAZFiZMf1U"
    },
    "title": "Dokument-Titel", # optional
    "context": "Kontext über das Dokument, das nicht zitiert wird", # optional
    "citations": {"enabled": True}
}
```
</Tab>
</Tabs>

<section title="Beispiel Klartext-Zitat">

```python
{
    "type": "char_location",
    "cited_text": "Der exakte Text, der zitiert wird", # zählt nicht zu Ausgabe-Token
    "document_index": 0,
    "document_title": "Dokument-Titel",
    "start_char_index": 0,    # 0-indiziert
    "end_char_index": 50      # exklusiv
}
```

</section>

### PDF-Dokumente

PDF-Dokumente können als base64-kodierte Daten oder per `file_id` bereitgestellt werden. PDF-Text wird extrahiert und in Sätze aufgeteilt. Da Bild-Zitate noch nicht unterstützt werden, sind PDFs, die Scans von Dokumenten sind und keinen extrahierbaren Text enthalten, nicht zitierbar.

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
    "title": "Dokument-Titel", # optional
    "context": "Kontext über das Dokument, das nicht zitiert wird", # optional
    "citations": {"enabled": True}
}
```
</Tab>
<Tab title="Files API">
```python
{
    "type": "document",
    "source": {
        "type": "file",
        "file_id": "file_011CNvxoj286tYUAZFiZMf1U"
    },
    "title": "Dokument-Titel", # optional
    "context": "Kontext über das Dokument, das nicht zitiert wird", # optional
    "citations": {"enabled": True}
}
```
</Tab>
</Tabs>

<section title="Beispiel PDF-Zitat">

```python
{
    "type": "page_location",
    "cited_text": "Der exakte Text, der zitiert wird", # zählt nicht zu Ausgabe-Token
    "document_index": 0,     
    "document_title": "Dokument-Titel", 
    "start_page_number": 1,  # 1-indiziert
    "end_page_number": 2     # exklusiv
}
```

</section>

### Benutzerdefinierte Inhalts-Dokumente

Benutzerdefinierte Inhalts-Dokumente geben Ihnen Kontrolle über die Zitat-Granularität. Keine zusätzliche Aufteilung wird vorgenommen und Chunks werden dem Modell entsprechend den bereitgestellten Inhaltsblöcken zur Verfügung gestellt.

```python
{
    "type": "document",
    "source": {
        "type": "content",
        "content": [
            {"type": "text", "text": "Erster Chunk"},
            {"type": "text", "text": "Zweiter Chunk"}
        ]
    },
    "title": "Dokument-Titel", # optional
    "context": "Kontext über das Dokument, das nicht zitiert wird", # optional
    "citations": {"enabled": True}
}
```

<section title="Beispiel-Zitat">

```python
{
    "type": "content_block_location",
    "cited_text": "Der exakte Text, der zitiert wird", # zählt nicht zu Ausgabe-Token
    "document_index": 0,
    "document_title": "Dokument-Titel",
    "start_block_index": 0,   # 0-indiziert
    "end_block_index": 1      # exklusiv
}
```

</section>

---

## Antwort-Struktur

Wenn Zitate aktiviert sind, enthalten Antworten mehrere Textblöcke mit Zitaten:

```python
{
    "content": [
        {
            "type": "text",
            "text": "Laut dem Dokument, "
        },
        {
            "type": "text",
            "text": "ist das Gras grün",
            "citations": [{
                "type": "char_location",
                "cited_text": "Das Gras ist grün.",
                "document_index": 0,
                "document_title": "Beispiel-Dokument",
                "start_char_index": 0,
                "end_char_index": 20
            }]
        },
        {
            "type": "text",
            "text": " und "
        },
        {
            "type": "text",
            "text": "der Himmel ist blau",
            "citations": [{
                "type": "char_location",
                "cited_text": "Der Himmel ist blau.",
                "document_index": 0,
                "document_title": "Beispiel-Dokument",
                "start_char_index": 20,
                "end_char_index": 36
            }]
        },
        {
            "type": "text",
            "text": ". Informationen von Seite 5 besagen, dass ",
        },
        {
            "type": "text",
            "text": "Wasser essentiell ist",
            "citations": [{
                "type": "page_location",
                "cited_text": "Wasser ist essentiell für das Leben.",
                "document_index": 1,
                "document_title": "PDF-Dokument",
                "start_page_number": 5,
                "end_page_number": 6
            }]
        },
        {
            "type": "text",
            "text": ". Das benutzerdefinierte Dokument erwähnt ",
        },
        {
            "type": "text",
            "text": "wichtige Erkenntnisse",
            "citations": [{
                "type": "content_block_location",
                "cited_text": "Dies sind wichtige Erkenntnisse.",
                "document_index": 2,
                "document_title": "Benutzerdefiniertes Inhalts-Dokument",
                "start_block_index": 0,
                "end_block_index": 1
            }]
        }
    ]
}
```

### Streaming-Unterstützung

Für Streaming-Antworten haben wir einen `citations_delta`-Typ hinzugefügt, der ein einzelnes Zitat enthält, das zur `citations`-Liste auf dem aktuellen `text`-Inhaltsblock hinzugefügt werden soll.

<section title="Beispiel Streaming-Events">

```python
event: message_start
data: {"type": "message_start", ...}

event: content_block_start
data: {"type": "content_block_start", "index": 0, ...}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, 
       "delta": {"type": "text_delta", "text": "Laut..."}}

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