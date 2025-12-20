# Web-Abruf-Tool

Das Web-Abruf-Tool ermöglicht Claude, vollständigen Inhalt von angegebenen Webseiten und PDF-Dokumenten abzurufen.

---

Das Web-Abruf-Tool ermöglicht Claude, vollständigen Inhalt von angegebenen Webseiten und PDF-Dokumenten abzurufen.

<Note>
Das Web-Abruf-Tool befindet sich derzeit in der Beta-Phase. Um es zu aktivieren, verwenden Sie den Beta-Header `web-fetch-2025-09-10` in Ihren API-Anfragen.

Bitte verwenden Sie [dieses Formular](https://forms.gle/NhWcgmkcvPCMmPE86), um Feedback zur Qualität der Modellreaktionen, der API selbst oder der Dokumentationsqualität zu geben.
</Note>

<Warning>
Die Aktivierung des Web-Abruf-Tools in Umgebungen, in denen Claude nicht vertrauenswürdige Eingaben zusammen mit sensiblen Daten verarbeitet, birgt Risiken der Datenexfiltration. Wir empfehlen, dieses Tool nur in vertrauenswürdigen Umgebungen oder bei der Verarbeitung nicht sensibler Daten zu verwenden. 

Um Exfiltrationsrisiken zu minimieren, darf Claude keine URLs dynamisch konstruieren. Claude kann nur URLs abrufen, die vom Benutzer explizit bereitgestellt wurden oder die aus vorherigen Web-Such- oder Web-Abruf-Ergebnissen stammen. Es besteht jedoch immer noch ein Restrisiko, das bei der Verwendung dieses Tools sorgfältig berücksichtigt werden sollte.

Wenn Datenexfiltration ein Problem darstellt, sollten Sie Folgendes in Betracht ziehen:
- Deaktivieren Sie das Web-Abruf-Tool vollständig
- Verwenden Sie den Parameter `max_uses`, um die Anzahl der Anfragen zu begrenzen
- Verwenden Sie den Parameter `allowed_domains`, um auf bekannte sichere Domänen zu beschränken
</Warning>

## Unterstützte Modelle

Web-Abruf ist verfügbar auf:

- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Sonnet 3.7 ([veraltet](/docs/de/about-claude/model-deprecations)) (`claude-3-7-sonnet-20250219`)
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)
- Claude Haiku 3.5 (`claude-3-5-haiku-latest`)
- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)

## Funktionsweise des Web-Abrufs

Wenn Sie das Web-Abruf-Tool zu Ihrer API-Anfrage hinzufügen:

1. Claude entscheidet basierend auf der Eingabeaufforderung und verfügbaren URLs, wann Inhalte abgerufen werden sollen.
2. Die API ruft den vollständigen Textinhalt von der angegebenen URL ab.
3. Bei PDFs wird eine automatische Textextraktion durchgeführt.
4. Claude analysiert den abgerufenen Inhalt und liefert eine Antwort mit optionalen Zitaten.

<Note>
Das Web-Abruf-Tool unterstützt derzeit keine Websites, die dynamisch über Javascript gerendert werden.
</Note>

## Verwendung des Web-Abrufs

Stellen Sie das Web-Abruf-Tool in Ihrer API-Anfrage bereit:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: web-fetch-2025-09-10" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 1024,
        "messages": [
            {
                "role": "user",
                "content": "Please analyze the content at https://example.com/article"
            }
        ],
        "tools": [{
            "type": "web_fetch_20250910",
            "name": "web_fetch",
            "max_uses": 5
        }]
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
            "content": "Please analyze the content at https://example.com/article"
        }
    ],
    tools=[{
        "type": "web_fetch_20250910",
        "name": "web_fetch",
        "max_uses": 5
    }],
    extra_headers={
        "anthropic-beta": "web-fetch-2025-09-10"
    }
)
print(response)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

async function main() {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: "Please analyze the content at https://example.com/article"
      }
    ],
    tools: [{
      type: "web_fetch_20250910",
      name: "web_fetch",
      max_uses: 5
    }],
    headers: {
      "anthropic-beta": "web-fetch-2025-09-10"
    }
  });

  console.log(response);
}

main().catch(console.error);
```
</CodeGroup>

### Tool-Definition

Das Web-Abruf-Tool unterstützt die folgenden Parameter:

```json JSON
{
  "type": "web_fetch_20250910",
  "name": "web_fetch",

  // Optional: Begrenzen Sie die Anzahl der Abrufe pro Anfrage
  "max_uses": 10,

  // Optional: Nur von diesen Domänen abrufen
  "allowed_domains": ["example.com", "docs.example.com"],

  // Optional: Niemals von diesen Domänen abrufen
  "blocked_domains": ["private.example.com"],

  // Optional: Aktivieren Sie Zitate für abgerufene Inhalte
  "citations": {
    "enabled": true
  },

  // Optional: Maximale Inhaltslänge in Token
  "max_content_tokens": 100000
}
```

#### Max uses

Der Parameter `max_uses` begrenzt die Anzahl der durchgeführten Web-Abrufe. Wenn Claude versucht, mehr Abrufe als zulässig durchzuführen, ist das `web_fetch_tool_result` ein Fehler mit dem Fehlercode `max_uses_exceeded`. Es gibt derzeit keine Standardbegrenzung.

#### Domänenfilterung

Bei Verwendung von Domänenfiltern:

- Domänen sollten nicht das HTTP/HTTPS-Schema enthalten (verwenden Sie `example.com` statt `https://example.com`)
- Subdomänen sind automatisch enthalten (`example.com` umfasst `docs.example.com`)
- Unterpfade werden unterstützt (`example.com/blog`)
- Sie können entweder `allowed_domains` oder `blocked_domains` verwenden, aber nicht beide in derselben Anfrage.

<Warning>
Beachten Sie, dass Unicode-Zeichen in Domänennamen durch Homograph-Angriffe Sicherheitslücken schaffen können, bei denen visuell ähnliche Zeichen aus verschiedenen Skripten Domänenfilter umgehen können. Beispielsweise kann `аmazon.com` (mit kyrillischem 'а') identisch mit `amazon.com` aussehen, stellt aber eine andere Domäne dar. 

Bei der Konfiguration von Domänen-Zulassungs-/Blockierungslisten:
- Verwenden Sie nach Möglichkeit nur ASCII-Domänennamen
- Beachten Sie, dass URL-Parser Unicode-Normalisierung möglicherweise unterschiedlich handhaben
- Testen Sie Ihre Domänenfilter mit potenziellen Homograph-Variationen
- Überprüfen Sie regelmäßig Ihre Domänenkonfigurationen auf verdächtige Unicode-Zeichen
</Warning>

#### Inhaltsbegrenzungen

Der Parameter `max_content_tokens` begrenzt die Menge des Inhalts, der in den Kontext einbezogen wird. Wenn der abgerufene Inhalt diese Grenze überschreitet, wird er gekürzt. Dies hilft, die Token-Nutzung beim Abrufen großer Dokumente zu kontrollieren.

<Note>
Die Grenze des Parameters `max_content_tokens` ist ungefähr. Die tatsächliche Anzahl der verwendeten Eingabe-Token kann um einen kleinen Betrag variieren.
</Note>

#### Zitate

Im Gegensatz zur Web-Suche, bei der Zitate immer aktiviert sind, sind Zitate für Web-Abruf optional. Setzen Sie `"citations": {"enabled": true}`, um Claude zu ermöglichen, spezifische Passagen aus abgerufenen Dokumenten zu zitieren.

<Note>
Bei der direkten Anzeige von API-Ausgaben für Endbenutzer müssen Zitate zur ursprünglichen Quelle enthalten sein. Wenn Sie Änderungen an API-Ausgaben vornehmen, einschließlich durch Neuverarbeitung und/oder Kombination mit Ihrem eigenen Material, bevor Sie sie Endbenutzern anzeigen, zeigen Sie Zitate wie angemessen nach Rücksprache mit Ihrem Rechtsteam an.
</Note>

### Antwort

Hier ist eine Beispiel-Antwortstruktur:

```json
{
  "role": "assistant",
  "content": [
    // 1. Claudes Entscheidung zum Abrufen
    {
      "type": "text",
      "text": "I'll fetch the content from the article to analyze it."
    },
    // 2. Die Abrufanfrage
    {
      "type": "server_tool_use",
      "id": "srvtoolu_01234567890abcdef",
      "name": "web_fetch",
      "input": {
        "url": "https://example.com/article"
      }
    },
    // 3. Abrufergebnisse
    {
      "type": "web_fetch_tool_result",
      "tool_use_id": "srvtoolu_01234567890abcdef",
      "content": {
        "type": "web_fetch_result",
        "url": "https://example.com/article",
        "content": {
          "type": "document",
          "source": {
            "type": "text",
            "media_type": "text/plain",
            "data": "Full text content of the article..."
          },
          "title": "Article Title",
          "citations": {"enabled": true}
        },
        "retrieved_at": "2025-08-25T10:30:00Z"
      }
    },
    // 4. Claudes Analyse mit Zitaten (falls aktiviert)
    {
      "text": "Based on the article, ",
      "type": "text"
    },
    {
      "text": "the main argument presented is that artificial intelligence will transform healthcare",
      "type": "text",
      "citations": [
        {
          "type": "char_location",
          "document_index": 0,
          "document_title": "Article Title",
          "start_char_index": 1234,
          "end_char_index": 1456,
          "cited_text": "Artificial intelligence is poised to revolutionize healthcare delivery..."
        }
      ]
    }
  ],
  "id": "msg_a930390d3a",
  "usage": {
    "input_tokens": 25039,
    "output_tokens": 931,
    "server_tool_use": {
      "web_fetch_requests": 1
    }
  },
  "stop_reason": "end_turn"
}
```

#### Abrufergebnisse

Abrufergebnisse enthalten:

- `url`: Die abgerufene URL
- `content`: Ein Dokumentblock mit dem abgerufenen Inhalt
- `retrieved_at`: Zeitstempel, wann der Inhalt abgerufen wurde

<Note>
Das Web-Abruf-Tool speichert Ergebnisse zwischen, um die Leistung zu verbessern und redundante Anfragen zu reduzieren. Dies bedeutet, dass der zurückgegebene Inhalt möglicherweise nicht immer die neueste verfügbare Version unter der URL ist. Das Caching-Verhalten wird automatisch verwaltet und kann sich im Laufe der Zeit ändern, um für verschiedene Inhaltstypen und Nutzungsmuster zu optimieren.
</Note>

Bei PDF-Dokumenten wird der Inhalt als Base64-codierte Daten zurückgegeben:

```json
{
  "type": "web_fetch_tool_result",
  "tool_use_id": "srvtoolu_02",
  "content": {
    "type": "web_fetch_result",
    "url": "https://example.com/paper.pdf",
    "content": {
      "type": "document",
      "source": {
        "type": "base64",
        "media_type": "application/pdf",
        "data": "JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmo..."
      },
      "citations": {"enabled": true}
    },
    "retrieved_at": "2025-08-25T10:30:02Z"
  }
}
```

#### Fehler

Wenn das Web-Abruf-Tool auf einen Fehler stößt, gibt die Claude API eine 200-Antwort (Erfolg) mit dem im Antwortkörper dargestellten Fehler zurück:

```json
{
  "type": "web_fetch_tool_result",
  "tool_use_id": "srvtoolu_a93jad",
  "content": {
    "type": "web_fetch_tool_error",
    "error_code": "url_not_accessible"
  }
}
```

Dies sind die möglichen Fehlercodes:

- `invalid_input`: Ungültiges URL-Format
- `url_too_long`: URL überschreitet maximale Länge (250 Zeichen)
- `url_not_allowed`: URL durch Domänenfilterungsregeln und Modellbeschränkungen blockiert
- `url_not_accessible`: Fehler beim Abrufen von Inhalten (HTTP-Fehler)
- `too_many_requests`: Ratenlimit überschritten
- `unsupported_content_type`: Inhaltstyp nicht unterstützt (nur Text und PDF)
- `max_uses_exceeded`: Maximale Web-Abruf-Tool-Nutzung überschritten
- `unavailable`: Ein interner Fehler ist aufgetreten

## URL-Validierung

Aus Sicherheitsgründen kann das Web-Abruf-Tool nur URLs abrufen, die zuvor im Konversationskontext erschienen sind. Dies umfasst:

- URLs in Benutzernachrichten
- URLs in clientseitigen Tool-Ergebnissen
- URLs aus vorherigen Web-Such- oder Web-Abruf-Ergebnissen

Das Tool kann keine beliebigen URLs abrufen, die Claude generiert, oder URLs aus Container-basierten Server-Tools (Code Execution, Bash, etc.).

## Kombinierte Suche und Abruf

Web-Abruf funktioniert nahtlos mit Web-Suche für umfassende Informationsbeschaffung:

```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Find recent articles about quantum computing and analyze the most relevant one in detail"
        }
    ],
    tools=[
        {
            "type": "web_search_20250305",
            "name": "web_search",
            "max_uses": 3
        },
        {
            "type": "web_fetch_20250910",
            "name": "web_fetch",
            "max_uses": 5,
            "citations": {"enabled": True}
        }
    ],
    extra_headers={
        "anthropic-beta": "web-fetch-2025-09-10"
    }
)
```

In diesem Workflow wird Claude:
1. Web-Suche verwenden, um relevante Artikel zu finden
2. Die vielversprechendsten Ergebnisse auswählen
3. Web-Abruf verwenden, um vollständigen Inhalt abzurufen
4. Detaillierte Analyse mit Zitaten bereitstellen

## Prompt-Caching

Web-Abruf funktioniert mit [Prompt-Caching](/docs/de/build-with-claude/prompt-caching). Um Prompt-Caching zu aktivieren, fügen Sie `cache_control`-Haltepunkte in Ihrer Anfrage hinzu. Zwischengespeicherte Abrufergebnisse können über Konversationsrunden hinweg wiederverwendet werden.

```python
import anthropic

client = anthropic.Anthropic()

# Erste Anfrage mit Web-Abruf
messages = [
    {
        "role": "user",
        "content": "Analyze this research paper: https://arxiv.org/abs/2024.12345"
    }
]

response1 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=messages,
    tools=[{
        "type": "web_fetch_20250910",
        "name": "web_fetch"
    }],
    extra_headers={
        "anthropic-beta": "web-fetch-2025-09-10"
    }
)

# Claudes Antwort zur Konversation hinzufügen
messages.append({
    "role": "assistant",
    "content": response1.content
})

# Zweite Anfrage mit Cache-Haltepunkt
messages.append({
    "role": "user",
    "content": "What methodology does the paper use?",
    "cache_control": {"type": "ephemeral"}
})

response2 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=messages,
    tools=[{
        "type": "web_fetch_20250910",
        "name": "web_fetch"
    }],
    extra_headers={
        "anthropic-beta": "web-fetch-2025-09-10"
    }
)

# Die zweite Antwort profitiert von zwischengespeicherten Abrufergebnissen
print(f"Cache read tokens: {response2.usage.get('cache_read_input_tokens', 0)}")
```

## Streaming

Mit aktiviertem Streaming sind Abrufereignisse Teil des Streams mit einer Pause während des Inhaltabrufs:

```javascript
event: message_start
data: {"type": "message_start", "message": {"id": "msg_abc123", "type": "message"}}

event: content_block_start
data: {"type": "content_block_start", "index": 0, "content_block": {"type": "text", "text": ""}}

// Claudes Entscheidung zum Abrufen

event: content_block_start
data: {"type": "content_block_start", "index": 1, "content_block": {"type": "server_tool_use", "id": "srvtoolu_xyz789", "name": "web_fetch"}}

// Abruf-URL gestreamt
event: content_block_delta
data: {"type": "content_block_delta", "index": 1, "delta": {"type": "input_json_delta", "partial_json": "{\"url\":\"https://example.com/article\"}"}}

// Pause während Abruf ausgeführt wird

// Abrufergebnisse gestreamt
event: content_block_start
data: {"type": "content_block_start", "index": 2, "content_block": {"type": "web_fetch_tool_result", "tool_use_id": "srvtoolu_xyz789", "content": {"type": "web_fetch_result", "url": "https://example.com/article", "content": {"type": "document", "source": {"type": "text", "media_type": "text/plain", "data": "Article content..."}}}}}

// Claudes Antwort wird fortgesetzt...
```

## Batch-Anfragen

Sie können das Web-Abruf-Tool in die [Messages Batches API](/docs/de/build-with-claude/batch-processing) einbeziehen. Web-Abruf-Tool-Aufrufe über die Messages Batches API werden genauso bepreist wie die in regulären Messages API-Anfragen.

## Nutzung und Preisgestaltung

Web fetch usage has **no additional charges** beyond standard token costs:

```json
"usage": {
  "input_tokens": 25039,
  "output_tokens": 931,
  "cache_read_input_tokens": 0,
  "cache_creation_input_tokens": 0,
  "server_tool_use": {
    "web_fetch_requests": 1
  }
}
```

The web fetch tool is available on the Claude API at **no additional cost**. You only pay standard token costs for the fetched content that becomes part of your conversation context.

To protect against inadvertently fetching large content that would consume excessive tokens, use the `max_content_tokens` parameter to set appropriate limits based on your use case and budget considerations.

Example token usage for typical content:
- Average web page (10KB): ~2,500 tokens
- Large documentation page (100KB): ~25,000 tokens  
- Research paper PDF (500KB): ~125,000 tokens