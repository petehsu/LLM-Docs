# Web-Suchwerkzeug

Das Web-Suchwerkzeug gibt Claude direkten Zugriff auf Echtzeit-Webinhalte und ermöglicht es, Fragen mit aktuellen Informationen über seinen Wissensstichtag hinaus zu beantworten.

---

Das Web-Suchwerkzeug gibt Claude direkten Zugriff auf Echtzeit-Webinhalte, was es ihm ermöglicht, Fragen mit aktuellen Informationen über seinen Wissensstichtag hinaus zu beantworten. Claude zitiert automatisch Quellen aus Suchergebnissen als Teil seiner Antwort.

<Note>
Bitte teilen Sie Ihre Erfahrungen mit dem Web-Suchwerkzeug über unser [Feedback-Formular](https://forms.gle/sWjBtsrNEY2oKGuE8) mit.
</Note>

## Unterstützte Modelle

Web-Suche ist verfügbar auf:

- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Sonnet 3.7 ([veraltet](/docs/de/about-claude/model-deprecations)) (`claude-3-7-sonnet-20250219`)
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)
- Claude Haiku 3.5 (`claude-3-5-haiku-latest`)
- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)

## Wie die Web-Suche funktioniert

Wenn Sie das Web-Suchwerkzeug zu Ihrer API-Anfrage hinzufügen:

1. Claude entscheidet basierend auf der Eingabeaufforderung, wann gesucht werden soll.
2. Die API führt die Suchen durch und stellt Claude die Ergebnisse zur Verfügung. Dieser Prozess kann sich mehrmals während einer einzelnen Anfrage wiederholen.
3. Am Ende seines Zuges stellt Claude eine endgültige Antwort mit zitierten Quellen bereit.

## Wie man Web-Suche verwendet

<Note>
Der Administrator Ihrer Organisation muss die Web-Suche in der [Konsole](/settings/privacy) aktivieren.
</Note>

Stellen Sie das Web-Suchwerkzeug in Ihrer API-Anfrage bereit:

<CodeGroup>
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
                "content": "What is the weather in NYC?"
            }
        ],
        "tools": [{
            "type": "web_search_20250305",
            "name": "web_search",
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
            "content": "What's the weather in NYC?"
        }
    ],
    tools=[{
        "type": "web_search_20250305",
        "name": "web_search",
        "max_uses": 5
    }]
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
        content: "What's the weather in NYC?"
      }
    ],
    tools: [{
      type: "web_search_20250305",
      name: "web_search",
      max_uses: 5
    }]
  });

  console.log(response);
}

main().catch(console.error);
```
</CodeGroup>

### Werkzeugdefinition

Das Web-Suchwerkzeug unterstützt die folgenden Parameter:

```json JSON
{
  "type": "web_search_20250305",
  "name": "web_search",

  // Optional: Begrenzen Sie die Anzahl der Suchen pro Anfrage
  "max_uses": 5,

  // Optional: Nur Ergebnisse von diesen Domains einbeziehen
  "allowed_domains": ["example.com", "trusteddomain.org"],

  // Optional: Ergebnisse von diesen Domains niemals einbeziehen
  "blocked_domains": ["untrustedsource.com"],

  // Optional: Suchergebnisse lokalisieren
  "user_location": {
    "type": "approximate",
    "city": "San Francisco",
    "region": "California",
    "country": "US",
    "timezone": "America/Los_Angeles"
  }
}
```

#### Max uses

Der Parameter `max_uses` begrenzt die Anzahl der durchgeführten Suchen. Wenn Claude mehr Suchen versucht als erlaubt, wird das `web_search_tool_result` ein Fehler mit dem Fehlercode `max_uses_exceeded` sein.

#### Domain-Filterung

Bei Verwendung von Domain-Filtern:

- Domains sollten nicht das HTTP/HTTPS-Schema enthalten (verwenden Sie `example.com` statt `https://example.com`)
- Subdomains werden automatisch einbezogen (`example.com` umfasst `docs.example.com`)
- Spezifische Subdomains beschränken Ergebnisse nur auf diese Subdomain (`docs.example.com` gibt nur Ergebnisse von dieser Subdomain zurück, nicht von `example.com` oder `api.example.com`)
- Unterpfade werden unterstützt und entsprechen allem nach dem Pfad (`example.com/blog` entspricht `example.com/blog/post-1`)
- Sie können entweder `allowed_domains` oder `blocked_domains` verwenden, aber nicht beide in derselben Anfrage.

**Wildcard-Unterstützung:**

- Pro Domain-Eintrag ist nur ein Wildcard (`*`) erlaubt, und es muss nach dem Domain-Teil (im Pfad) erscheinen
- Gültig: `example.com/*`, `example.com/*/articles`
- Ungültig: `*.example.com`, `ex*.com`, `example.com/*/news/*`

Ungültige Domain-Formate geben einen `invalid_tool_input`-Werkzeugfehler zurück.

<Note>
Domain-Beschränkungen auf Anfrage-Ebene müssen mit Domain-Beschränkungen auf Organisations-Ebene kompatibel sein, die in der Konsole konfiguriert sind. Domain-Beschränkungen auf Anfrage-Ebene können Domains nur weiter einschränken, nicht überschreiben oder über die Liste auf Organisations-Ebene hinaus erweitern. Wenn Ihre Anfrage Domains enthält, die mit Organisations-Einstellungen in Konflikt stehen, gibt die API einen Validierungsfehler zurück.
</Note>

#### Lokalisierung

Der Parameter `user_location` ermöglicht es Ihnen, Suchergebnisse basierend auf dem Standort eines Benutzers zu lokalisieren.

- `type`: Der Standorttyp (muss `approximate` sein)
- `city`: Der Stadtname
- `region`: Die Region oder der Staat
- `country`: Das Land
- `timezone`: Die [IANA-Zeitzone-ID](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).

### Antwort

Hier ist eine Beispiel-Antwortstruktur:

```json
{
  "role": "assistant",
  "content": [
    // 1. Claudes Entscheidung zu suchen
    {
      "type": "text",
      "text": "I'll search for when Claude Shannon was born."
    },
    // 2. Die verwendete Suchanfrage
    {
      "type": "server_tool_use",
      "id": "srvtoolu_01WYG3ziw53XMcoyKL4XcZmE",
      "name": "web_search",
      "input": {
        "query": "claude shannon birth date"
      }
    },
    // 3. Suchergebnisse
    {
      "type": "web_search_tool_result",
      "tool_use_id": "srvtoolu_01WYG3ziw53XMcoyKL4XcZmE",
      "content": [
        {
          "type": "web_search_result",
          "url": "https://en.wikipedia.org/wiki/Claude_Shannon",
          "title": "Claude Shannon - Wikipedia",
          "encrypted_content": "EqgfCioIARgBIiQ3YTAwMjY1Mi1mZjM5LTQ1NGUtODgxNC1kNjNjNTk1ZWI3Y...",
          "page_age": "April 30, 2025"
        }
      ]
    },
    {
      "text": "Based on the search results, ",
      "type": "text"
    },
    // 4. Claudes Antwort mit Zitaten
    {
      "text": "Claude Shannon was born on April 30, 1916, in Petoskey, Michigan",
      "type": "text",
      "citations": [
        {
          "type": "web_search_result_location",
          "url": "https://en.wikipedia.org/wiki/Claude_Shannon",
          "title": "Claude Shannon - Wikipedia",
          "encrypted_index": "Eo8BCioIAhgBIiQyYjQ0OWJmZi1lNm..",
          "cited_text": "Claude Elwood Shannon (April 30, 1916 – February 24, 2001) was an American mathematician, electrical engineer, computer scientist, cryptographer and i..."
        }
      ]
    }
  ],
  "id": "msg_a930390d3a",
  "usage": {
    "input_tokens": 6039,
    "output_tokens": 931,
    "server_tool_use": {
      "web_search_requests": 1
    }
  },
  "stop_reason": "end_turn"
}
```

#### Suchergebnisse

Suchergebnisse enthalten:

- `url`: Die URL der Quellseite
- `title`: Der Titel der Quellseite
- `page_age`: Wann die Website zuletzt aktualisiert wurde
- `encrypted_content`: Verschlüsselter Inhalt, der in mehrteiligen Konversationen für Zitate zurückgegeben werden muss

#### Zitate

Zitate sind immer für die Web-Suche aktiviert, und jedes `web_search_result_location` enthält:

- `url`: Die URL der zitierten Quelle
- `title`: Der Titel der zitierten Quelle
- `encrypted_index`: Eine Referenz, die für mehrteilige Konversationen zurückgegeben werden muss.
- `cited_text`: Bis zu 150 Zeichen des zitierten Inhalts

Die Web-Suche-Zitierungsfelder `cited_text`, `title` und `url` zählen nicht zur Eingabe- oder Ausgabe-Token-Nutzung.

<Note>
  Wenn Sie API-Ausgaben direkt für Endbenutzer anzeigen, müssen Zitate zur ursprünglichen Quelle einbezogen werden. Wenn Sie Änderungen an API-Ausgaben vornehmen, einschließlich durch Neuverarbeitung und/oder Kombination mit Ihrem eigenen Material, bevor Sie sie Endbenutzern anzeigen, zeigen Sie Zitate wie angemessen basierend auf Rücksprache mit Ihrem Rechtsteam an.
</Note>

#### Fehler

Wenn das Web-Suchwerkzeug auf einen Fehler stößt (z. B. Ratenlimit-Überschreitung), gibt die Claude API immer noch eine 200 (Erfolg)-Antwort zurück. Der Fehler wird im Antwortkörper mit der folgenden Struktur dargestellt:

```json
{
  "type": "web_search_tool_result",
  "tool_use_id": "servertoolu_a93jad",
  "content": {
    "type": "web_search_tool_result_error",
    "error_code": "max_uses_exceeded"
  }
}
```

Dies sind die möglichen Fehlercodes:

- `too_many_requests`: Ratenlimit überschritten
- `invalid_input`: Ungültiger Suchanfrage-Parameter
- `max_uses_exceeded`: Maximale Web-Suchwerkzeug-Nutzungen überschritten
- `query_too_long`: Anfrage überschreitet maximale Länge
- `unavailable`: Ein interner Fehler ist aufgetreten

#### `pause_turn` Stop-Grund

Die Antwort kann einen `pause_turn` Stop-Grund enthalten, der anzeigt, dass die API einen langen Zug unterbrochen hat. Sie können die Antwort in einer nachfolgenden Anfrage unverändert zurückgeben, um Claude seinen Zug fortsetzen zu lassen, oder Sie können den Inhalt ändern, wenn Sie das Gespräch unterbrechen möchten.

## Prompt-Caching

Die Web-Suche funktioniert mit [Prompt-Caching](/docs/de/build-with-claude/prompt-caching). Um Prompt-Caching zu aktivieren, fügen Sie mindestens einen `cache_control`-Haltepunkt in Ihrer Anfrage hinzu. Das System speichert automatisch bis zum letzten `web_search_tool_result`-Block, wenn das Werkzeug ausgeführt wird.

Für mehrteilige Konversationen setzen Sie einen `cache_control`-Haltepunkt auf oder nach dem letzten `web_search_tool_result`-Block, um zwischengespeicherte Inhalte wiederzuverwenden.

Um beispielsweise Prompt-Caching mit Web-Suche für eine mehrteilige Konversation zu verwenden:

<CodeGroup>
```python
import anthropic

client = anthropic.Anthropic()

# Erste Anfrage mit Web-Suche und Cache-Haltepunkt
messages = [
    {
        "role": "user",
        "content": "What's the current weather in San Francisco today?"
    }
]

response1 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=messages,
    tools=[{
        "type": "web_search_20250305",
        "name": "web_search",
        "user_location": {
            "type": "approximate",
            "city": "San Francisco",
            "region": "California",
            "country": "US",
            "timezone": "America/Los_Angeles"
        }
    }]
)

# Claudes Antwort zum Gespräch hinzufügen
messages.append({
    "role": "assistant",
    "content": response1.content
})

# Zweite Anfrage mit Cache-Haltepunkt nach den Suchergebnissen
messages.append({
    "role": "user",
    "content": "Should I expect rain later this week?",
    "cache_control": {"type": "ephemeral"}  # Cache bis zu diesem Punkt
})

response2 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=messages,
    tools=[{
        "type": "web_search_20250305",
        "name": "web_search",
        "user_location": {
            "type": "approximate",
            "city": "San Francisco",
            "region": "California",
            "country": "US",
            "timezone": "America/Los_Angeles"
        }
    }]
)
# Die zweite Antwort profitiert von zwischengespeicherten Suchergebnissen
# während sie immer noch neue Suchen durchführen kann, falls erforderlich
print(f"Cache read tokens: {response2.usage.get('cache_read_input_tokens', 0)}")
```

</CodeGroup>

## Streaming

Mit aktiviertem Streaming erhalten Sie Suchereignisse als Teil des Streams. Es gibt eine Pause während die Suche ausgeführt wird:

```javascript
event: message_start
data: {"type": "message_start", "message": {"id": "msg_abc123", "type": "message"}}

event: content_block_start
data: {"type": "content_block_start", "index": 0, "content_block": {"type": "text", "text": ""}}

// Claudes Entscheidung zu suchen

event: content_block_start
data: {"type": "content_block_start", "index": 1, "content_block": {"type": "server_tool_use", "id": "srvtoolu_xyz789", "name": "web_search"}}

// Suchanfrage gestreamt
event: content_block_delta
data: {"type": "content_block_delta", "index": 1, "delta": {"type": "input_json_delta", "partial_json": "{\"query\":\"latest quantum computing breakthroughs 2025\"}"}}

// Pause während die Suche ausgeführt wird

// Suchergebnisse gestreamt
event: content_block_start
data: {"type": "content_block_start", "index": 2, "content_block": {"type": "web_search_tool_result", "tool_use_id": "srvtoolu_xyz789", "content": [{"type": "web_search_result", "title": "Quantum Computing Breakthroughs in 2025", "url": "https://example.com"}]}}

// Claudes Antwort mit Zitaten (in diesem Beispiel weggelassen)
```

## Batch-Anfragen

Sie können das Web-Suchwerkzeug in die [Messages Batches API](/docs/de/build-with-claude/batch-processing) einbeziehen. Web-Suchwerkzeug-Aufrufe über die Messages Batches API werden genauso berechnet wie die in regulären Messages API-Anfragen.

## Nutzung und Preisgestaltung

Web search usage is charged in addition to token usage:

```json
"usage": {
  "input_tokens": 105,
  "output_tokens": 6039,
  "cache_read_input_tokens": 7123,
  "cache_creation_input_tokens": 7345,
  "server_tool_use": {
    "web_search_requests": 1
  }
}
```

Web search is available on the Claude API for **$10 per 1,000 searches**, plus standard token costs for search-generated content. Web search results retrieved throughout a conversation are counted as input tokens, in search iterations executed during a single turn and in subsequent conversation turns.

Each web search counts as one use, regardless of the number of results returned. If an error occurs during web search, the web search will not be billed.