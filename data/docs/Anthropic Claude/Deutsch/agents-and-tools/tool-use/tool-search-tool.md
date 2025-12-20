# Tool-Suchwerkzeug

Ermöglichen Sie Claude, mit Hunderten oder Tausenden von Werkzeugen zu arbeiten, indem Sie diese dynamisch entdecken und bei Bedarf laden.

---

Das Tool-Suchwerkzeug ermöglicht Claude, mit Hunderten oder Tausenden von Werkzeugen zu arbeiten, indem diese dynamisch entdeckt und bei Bedarf geladen werden. Anstatt alle Werkzeugdefinitionen vorab in das Kontextfenster zu laden, durchsucht Claude Ihren Werkzeugkatalog – einschließlich Werkzeugnamen, Beschreibungen, Argumentnamen und Argumentbeschreibungen – und lädt nur die Werkzeuge, die er benötigt.

Dieser Ansatz löst zwei kritische Herausforderungen bei der Skalierung von Werkzeugbibliotheken:

- **Kontexteffizienz**: Werkzeugdefinitionen können massive Teile Ihres Kontextfensters verbrauchen (50 Werkzeuge ≈ 10-20K Token), was weniger Platz für tatsächliche Arbeit lässt
- **Genauigkeit der Werkzeugauswahl**: Claudes Fähigkeit, Werkzeuge korrekt auszuwählen, verschlechtert sich erheblich bei mehr als 30-50 konventionell verfügbaren Werkzeugen

Obwohl dies als serverseitiges Werkzeug bereitgestellt wird, können Sie auch Ihre eigene clientseitige Tool-Suchfunktionalität implementieren. Siehe [Benutzerdefinierte Tool-Suchimplementierung](#custom-tool-search-implementation) für Details.

<Note>
Das Tool-Suchwerkzeug befindet sich derzeit in der öffentlichen Beta. Fügen Sie den entsprechenden [Beta-Header](/docs/de/api/beta-headers) für Ihren Anbieter ein:

| Anbieter                 | Beta-Header                    | Unterstützte Modelle                   |
| ------------------------ | ------------------------------ | -------------------------------------- |
| Claude API<br/>Microsoft Foundry  | `advanced-tool-use-2025-11-20` | Claude Opus 4.5<br />Claude Sonnet 4.5 |
| Google Cloud's Vertex AI | `tool-search-tool-2025-10-19`  | Claude Opus 4.5<br />Claude Sonnet 4.5 |
| Amazon Bedrock           | `tool-search-tool-2025-10-19`  | Claude Opus 4.5                        |
</Note>

<Warning>
  Bei Amazon Bedrock ist die serverseitige Tool-Suche nur über die [invoke
  API](https://docs.aws.amazon.com/bedrock/latest/userguide/bedrock-runtime_example_bedrock-runtime_InvokeModel_AnthropicClaude_section.html) verfügbar,
  nicht über die converse API.
</Warning>

Sie können auch [clientseitige Tool-Suche](#custom-tool-search-implementation) implementieren, indem Sie `tool_reference`-Blöcke aus Ihrer eigenen Suchimplementierung zurückgeben.

## Wie die Tool-Suche funktioniert

Es gibt zwei Tool-Suchvarianten:

- **Regex** (`tool_search_tool_regex_20251119`): Claude erstellt Regex-Muster zur Suche nach Werkzeugen
- **BM25** (`tool_search_tool_bm25_20251119`): Claude verwendet natürlichsprachliche Abfragen zur Suche nach Werkzeugen

Wenn Sie das Tool-Suchwerkzeug aktivieren:

1. Sie fügen ein Tool-Suchwerkzeug (z. B. `tool_search_tool_regex_20251119` oder `tool_search_tool_bm25_20251119`) in Ihre Werkzeugliste ein
2. Sie stellen alle Werkzeugdefinitionen mit `defer_loading: true` für Werkzeuge bereit, die nicht sofort geladen werden sollen
3. Claude sieht zunächst nur das Tool-Suchwerkzeug und alle nicht aufgeschobenen Werkzeuge
4. Wenn Claude zusätzliche Werkzeuge benötigt, sucht er mit einem Tool-Suchwerkzeug
5. Die API gibt 3-5 der relevantesten `tool_reference`-Blöcke zurück
6. Diese Referenzen werden automatisch in vollständige Werkzeugdefinitionen erweitert
7. Claude wählt aus den entdeckten Werkzeugen aus und ruft sie auf

Dies hält Ihr Kontextfenster effizient, während die hohe Genauigkeit der Werkzeugauswahl erhalten bleibt.

## Schnellstart

Hier ist ein einfaches Beispiel mit aufgeschobenen Werkzeugen:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: advanced-tool-use-2025-11-20" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5-20250929",
        "max_tokens": 2048,
        "messages": [
            {
                "role": "user",
                "content": "What is the weather in San Francisco?"
            }
        ],
        "tools": [
            {
                "type": "tool_search_tool_regex_20251119",
                "name": "tool_search_tool_regex"
            },
            {
                "name": "get_weather",
                "description": "Get the weather at a specific location",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "location": {"type": "string"},
                        "unit": {
                            "type": "string",
                            "enum": ["celsius", "fahrenheit"]
                        }
                    },
                    "required": ["location"]
                },
                "defer_loading": true
            },
            {
                "name": "search_files",
                "description": "Search through files in the workspace",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "query": {"type": "string"},
                        "file_types": {
                            "type": "array",
                            "items": {"type": "string"}
                        }
                    },
                    "required": ["query"]
                },
                "defer_loading": true
            }
        ]
    }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=2048,
    messages=[
        {
            "role": "user",
            "content": "What is the weather in San Francisco?"
        }
    ],
    tools=[
        {
            "type": "tool_search_tool_regex_20251119",
            "name": "tool_search_tool_regex"
        },
        {
            "name": "get_weather",
            "description": "Get the weather at a specific location",
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {"type": "string"},
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"]
                    }
                },
                "required": ["location"]
            },
            "defer_loading": True
        },
        {
            "name": "search_files",
            "description": "Search through files in the workspace",
            "input_schema": {
                "type": "object",
                "properties": {
                    "query": {"type": "string"},
                    "file_types": {
                        "type": "array",
                        "items": {"type": "string"}
                    }
                },
                "required": ["query"]
            },
            "defer_loading": True
        }
    ]
)

print(response)
```

```typescript TypeScript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

async function main() {
  const response = await client.beta.messages.create({
    model: "claude-sonnet-4-5-20250929",
    betas: ["advanced-tool-use-2025-11-20"],
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: "What is the weather in San Francisco?",
      },
    ],
    tools: [
      {
        type: "tool_search_tool_regex_20251119",
        name: "tool_search_tool_regex",
      },
      {
        name: "get_weather",
        description: "Get the weather at a specific location",
        input_schema: {
          type: "object",
          properties: {
            location: { type: "string" },
            unit: {
              type: "string",
              enum: ["celsius", "fahrenheit"],
            },
          },
          required: ["location"],
        },
        defer_loading: true,
      },
      {
        name: "search_files",
        description: "Search through files in the workspace",
        input_schema: {
          type: "object",
          properties: {
            query: { type: "string" },
            file_types: {
              type: "array",
              items: { type: "string" },
            },
          },
          required: ["query"],
        },
        defer_loading: true,
      },
    ],
  });

  console.log(JSON.stringify(response, null, 2));
}

main();
```

</CodeGroup>

## Werkzeugdefinition

Das Tool-Suchwerkzeug hat zwei Varianten:

```json JSON
{
  "type": "tool_search_tool_regex_20251119",
  "name": "tool_search_tool_regex"
}
```

```json JSON
{
  "type": "tool_search_tool_bm25_20251119",
  "name": "tool_search_tool_bm25"
}
```

<Warning>
**Regex-Variante Abfrageformat: Python-Regex, KEINE natürliche Sprache**

Bei Verwendung von `tool_search_tool_regex_20251119` erstellt Claude Regex-Muster unter Verwendung der `re.search()`-Syntax von Python, nicht natürlichsprachliche Abfragen. Häufige Muster:

- `"weather"` - passt zu Werkzeugnamen/Beschreibungen, die "weather" enthalten
- `"get_.*_data"` - passt zu Werkzeugen wie `get_user_data`, `get_weather_data`
- `"database.*query|query.*database"` - ODER-Muster für Flexibilität
- `"(?i)slack"` - Suche ohne Berücksichtigung der Groß-/Kleinschreibung

Maximale Abfragelänge: 200 Zeichen

</Warning>

<Note>
**BM25-Variante Abfrageformat: Natürliche Sprache**

Bei Verwendung von `tool_search_tool_bm25_20251119` verwendet Claude natürlichsprachliche Abfragen zur Suche nach Werkzeugen.

</Note>

### Aufgeschobenes Werkzeugladen

Markieren Sie Werkzeuge für das Laden bei Bedarf, indem Sie `defer_loading: true` hinzufügen:

```json JSON
{
  "name": "get_weather",
  "description": "Get current weather for a location",
  "input_schema": {
    "type": "object",
    "properties": {
      "location": { "type": "string" },
      "unit": { "type": "string", "enum": ["celsius", "fahrenheit"] }
    },
    "required": ["location"]
  },
  "defer_loading": true
}
```

**Wichtige Punkte:**

- Werkzeuge ohne `defer_loading` werden sofort in den Kontext geladen
- Werkzeuge mit `defer_loading: true` werden nur geladen, wenn Claude sie durch Suche entdeckt
- Das Tool-Suchwerkzeug selbst sollte **niemals** `defer_loading: true` haben
- Behalten Sie Ihre 3-5 am häufigsten verwendeten Werkzeuge als nicht aufgeschoben für optimale Leistung

Beide Tool-Suchvarianten (`regex` und `bm25`) durchsuchen Werkzeugnamen, Beschreibungen, Argumentnamen und Argumentbeschreibungen.

## Antwortformat

Wenn Claude das Tool-Suchwerkzeug verwendet, enthält die Antwort neue Blocktypen:

```json JSON
{
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "I'll search for tools to help with the weather information."
    },
    {
      "type": "server_tool_use",
      "id": "srvtoolu_01ABC123",
      "name": "tool_search_tool_regex",
      "input": {
        "query": "weather"
      }
    },
    {
      "type": "tool_search_tool_result",
      "tool_use_id": "srvtoolu_01ABC123",
      "content": {
        "type": "tool_search_tool_search_result",
        "tool_references": [{ "type": "tool_reference", "tool_name": "get_weather" }]
      }
    },
    {
      "type": "text",
      "text": "I found a weather tool. Let me get the weather for San Francisco."
    },
    {
      "type": "tool_use",
      "id": "toolu_01XYZ789",
      "name": "get_weather",
      "input": { "location": "San Francisco", "unit": "fahrenheit" }
    }
  ],
  "stop_reason": "tool_use"
}
```

### Die Antwort verstehen

- **`server_tool_use`**: Zeigt an, dass Claude das Tool-Suchwerkzeug aufruft
- **`tool_search_tool_result`**: Enthält die Suchergebnisse mit einem verschachtelten `tool_search_tool_search_result`-Objekt
- **`tool_references`**: Array von `tool_reference`-Objekten, die auf entdeckte Werkzeuge verweisen
- **`tool_use`**: Claude ruft das entdeckte Werkzeug auf

Die `tool_reference`-Blöcke werden automatisch in vollständige Werkzeugdefinitionen erweitert, bevor sie Claude angezeigt werden. Sie müssen diese Erweiterung nicht selbst durchführen. Dies geschieht automatisch in der API, solange Sie alle übereinstimmenden Werkzeugdefinitionen im `tools`-Parameter bereitstellen.

## MCP-Integration

Das Tool-Suchwerkzeug funktioniert mit [MCP-Servern](/docs/de/agents-and-tools/mcp-connector). Fügen Sie den `"mcp-client-2025-11-20"` [Beta-Header](/docs/de/api/beta-headers) zu Ihrer API-Anfrage hinzu, und verwenden Sie dann `mcp_toolset` mit `default_config`, um MCP-Werkzeuge aufzuschieben:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
  --header "x-api-key: $ANTHROPIC_API_KEY" \
  --header "anthropic-version: 2023-06-01" \
  --header "anthropic-beta: advanced-tool-use-2025-11-20,mcp-client-2025-11-20" \
  --header "content-type: application/json" \
  --data '{
    "model": "claude-sonnet-4-5-20250929",
    "max_tokens": 2048,
    "mcp_servers": [
      {
        "type": "url",
        "name": "database-server",
        "url": "https://mcp-db.example.com"
      }
    ],
    "tools": [
      {
        "type": "tool_search_tool_regex_20251119",
        "name": "tool_search_tool_regex"
      },
      {
        "type": "mcp_toolset",
        "mcp_server_name": "database-server",
        "default_config": {
          "defer_loading": true
        },
        "configs": {
          "search_events": {
            "defer_loading": false
          }
        }
      }
    ],
    "messages": [
      {
        "role": "user",
        "content": "What events are in my database?"
      }
    ]
  }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    betas=["advanced-tool-use-2025-11-20", "mcp-client-2025-11-20"],
    max_tokens=2048,
    mcp_servers=[
        {
            "type": "url",
            "name": "database-server",
            "url": "https://mcp-db.example.com"
        }
    ],
    tools=[
        {
            "type": "tool_search_tool_regex_20251119",
            "name": "tool_search_tool_regex"
        },
        {
            "type": "mcp_toolset",
            "mcp_server_name": "database-server",
            "default_config": {
                "defer_loading": True
            },
            "configs": {
                "search_events": {
                    "defer_loading": False
                }
            }
        }
    ],
    messages=[
        {
            "role": "user",
            "content": "What events are in my database?"
        }
    ]
)

print(response)
```

```typescript TypeScript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

async function main() {
  const response = await client.beta.messages.create({
    model: "claude-sonnet-4-5-20250929",
    betas: ["advanced-tool-use-2025-11-20", "mcp-client-2025-11-20"],
    max_tokens: 2048,
    mcp_servers: [
      {
        type: "url",
        name: "database-server",
        url: "https://mcp-db.example.com",
      },
    ],
    tools: [
      {
        type: "tool_search_tool_regex_20251119",
        name: "tool_search_tool_regex",
      },
      {
        type: "mcp_toolset",
        mcp_server_name: "database-server",
        default_config: {
          defer_loading: true,
        },
        configs: {
          search_events: {
            defer_loading: false,
          },
        },
      },
    ],
    messages: [
      {
        role: "user",
        content: "What events are in my database?",
      },
    ],
  });

  console.log(JSON.stringify(response, null, 2));
}

main();
```

</CodeGroup>

**MCP-Konfigurationsoptionen:**

- `default_config.defer_loading`: Standardwert für alle Werkzeuge vom MCP-Server festlegen
- `configs`: Standardwerte für bestimmte Werkzeuge nach Name überschreiben
- Kombinieren Sie mehrere MCP-Server mit Tool-Suche für massive Werkzeugbibliotheken

## Benutzerdefinierte Tool-Suchimplementierung

Sie können Ihre eigene Tool-Suchlogik implementieren (z. B. mit Embeddings oder semantischer Suche), indem Sie `tool_reference`-Blöcke von einem benutzerdefinierten Werkzeug zurückgeben:

```json JSON
{
  "type": "tool_search_tool_result",
  "tool_use_id": "toolu_custom_search",
  "content": {
    "type": "tool_search_tool_search_result",
    "tool_references": [{ "type": "tool_reference", "tool_name": "discovered_tool_name" }]
  }
}
```

Jedes referenzierte Werkzeug muss eine entsprechende Werkzeugdefinition im obersten `tools`-Parameter mit `defer_loading: true` haben. Dieser Ansatz ermöglicht es Ihnen, anspruchsvollere Suchalgorithmen zu verwenden und gleichzeitig die Kompatibilität mit dem Tool-Suchsystem zu wahren.

Ein vollständiges Beispiel mit Embeddings finden Sie in unserem [Tool-Suche mit Embeddings Cookbook](https://github.com/anthropics/anthropic-cookbook).

## Fehlerbehandlung

<Note>
  Das Tool-Suchwerkzeug ist nicht kompatibel mit [Tool-Use-
  Beispielen](/docs/de/agents-and-tools/tool-use/implement-tool-use#providing-tool-use-examples).
  Wenn Sie Beispiele für die Tool-Verwendung bereitstellen müssen, verwenden Sie Standard-Tool-Aufrufe
  ohne Tool-Suche.
</Note>

### HTTP-Fehler (Status 400)

Diese Fehler verhindern die Verarbeitung der Anfrage:

**Alle Werkzeuge aufgeschoben:**

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "All tools have defer_loading set. At least one tool must be non-deferred."
  }
}
```

**Fehlende Werkzeugdefinition:**

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "Tool reference 'unknown_tool' has no corresponding tool definition"
  }
}
```

### Tool-Ergebnis-Fehler (Status 200)

Fehler während der Werkzeugausführung geben eine 200-Antwort mit Fehlerinformationen im Text zurück:

```json JSON
{
  "type": "tool_result",
  "tool_use_id": "srvtoolu_01ABC123",
  "content": {
    "type": "tool_search_tool_result_error",
    "error_code": "invalid_pattern"
  }
}
```

**Fehlercodes:**

- `too_many_requests`: Ratenlimit für Tool-Suchvorgänge überschritten
- `invalid_pattern`: Fehlerhaftes Regex-Muster
- `pattern_too_long`: Muster überschreitet das Limit von 200 Zeichen
- `unavailable`: Tool-Suchservice vorübergehend nicht verfügbar

### Häufige Fehler

<section title="400 Fehler: Alle Werkzeuge sind aufgeschoben">

**Ursache**: Sie haben `defer_loading: true` auf ALLEN Werkzeugen einschließlich des Suchwerkzeugs gesetzt

**Behebung**: Entfernen Sie `defer_loading` vom Tool-Suchwerkzeug:

```json
{
  "type": "tool_search_tool_regex_20251119", // Kein defer_loading hier
  "name": "tool_search_tool_regex"
}
```

</section>

<section title="400 Fehler: Fehlende Werkzeugdefinition">

**Ursache**: Ein `tool_reference` verweist auf ein Werkzeug, das nicht in Ihrem `tools`-Array vorhanden ist

**Behebung**: Stellen Sie sicher, dass jedes Werkzeug, das entdeckt werden könnte, eine vollständige Definition hat:

```json
{
  "name": "my_tool",
  "description": "Full description here",
  "input_schema": {
    /* complete schema */
  },
  "defer_loading": true
}
```

</section>

<section title="Claude findet erwartete Werkzeuge nicht">

**Ursache**: Werkzeugnamen oder Beschreibungen stimmen nicht mit dem Regex-Muster überein

**Debugging-Schritte:**

1. Überprüfen Sie Werkzeugnamen und Beschreibung – Claude durchsucht BEIDE Felder
2. Testen Sie Ihr Muster: `import re; re.search(r"your_pattern", "tool_name")`
3. Denken Sie daran, dass Suchen standardmäßig Groß-/Kleinschreibung beachten (verwenden Sie `(?i)` für Groß-/Kleinschreibung ignorieren)
4. Claude verwendet breite Muster wie `".*weather.*"` keine exakten Übereinstimmungen

**Tipp**: Fügen Sie häufige Schlüsselwörter zu Werkzeugbeschreibungen hinzu, um die Auffindbarkeit zu verbessern

</section>

## Prompt-Caching

Die Tool-Suche funktioniert mit [Prompt-Caching](/docs/de/build-with-claude/prompt-caching). Fügen Sie `cache_control`-Haltepunkte hinzu, um mehrteilige Gespräche zu optimieren:

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# First request with tool search
messages = [
    {
        "role": "user",
        "content": "What's the weather in Seattle?"
    }
]

response1 = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=2048,
    messages=messages,
    tools=[
        {
            "type": "tool_search_tool_regex_20251119",
            "name": "tool_search_tool_regex"
        },
        {
            "name": "get_weather",
            "description": "Get weather for a location",
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {"type": "string"}
                },
                "required": ["location"]
            },
            "defer_loading": True
        }
    ]
)

# Add Claude's response to conversation
messages.append({
    "role": "assistant",
    "content": response1.content
})

# Second request with cache breakpoint
messages.append({
    "role": "user",
    "content": "What about New York?",
    "cache_control": {"type": "ephemeral"}
})

response2 = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=2048,
    messages=messages,
    tools=[
        {
            "type": "tool_search_tool_regex_20251119",
            "name": "tool_search_tool_regex"
        },
        {
            "name": "get_weather",
            "description": "Get weather for a location",
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {"type": "string"}
                },
                "required": ["location"]
            },
            "defer_loading": True
        }
    ]
)

print(f"Cache read tokens: {response2.usage.get('cache_read_input_tokens', 0)}")
```
</CodeGroup>

Das System erweitert tool_reference-Blöcke automatisch in der gesamten Gesprächshistorie, sodass Claude entdeckte Werkzeuge in nachfolgenden Durchläufen wiederverwenden kann, ohne erneut zu suchen.

## Streaming

Mit aktiviertem Streaming erhalten Sie Tool-Suchereignisse als Teil des Streams:

```javascript
event: content_block_start
data: {"type": "content_block_start", "index": 1, "content_block": {"type": "server_tool_use", "id": "srvtoolu_xyz789", "name": "tool_search_tool_regex"}}

// Search query streamed
event: content_block_delta
data: {"type": "content_block_delta", "index": 1, "delta": {"type": "input_json_delta", "partial_json": "{\"query\":\"weather\"}"}}

// Pause while search executes

// Search results streamed
event: content_block_start
data: {"type": "content_block_start", "index": 2, "content_block": {"type": "tool_search_tool_result", "tool_use_id": "srvtoolu_xyz789", "content": {"type": "tool_search_tool_search_result", "tool_references": [{"type": "tool_reference", "tool_name": "get_weather"}]}}}

// Claude continues with discovered tools
```

## Batch-Anfragen

Sie können das Tool-Suchwerkzeug in die [Messages Batches API](/docs/de/build-with-claude/batch-processing) einbeziehen. Tool-Suchvorgänge über die Messages Batches API werden genauso berechnet wie die in regulären Messages API-Anfragen.

## Limits und Best Practices

### Limits

- **Maximale Werkzeuge**: 10.000 Werkzeuge in Ihrem Katalog
- **Suchergebnisse**: Gibt 3-5 der relevantesten Werkzeuge pro Suche zurück
- **Musterlänge**: Maximale 200 Zeichen für Regex-Muster
- **Modellunterstützung**: Nur Sonnet 4.0+, Opus 4.0+ (kein Haiku)

### Wann sollte man Tool-Suche verwenden

**Gute Anwendungsfälle:**

- 10+ Werkzeuge in Ihrem System verfügbar
- Werkzeugdefinitionen verbrauchen >10K Token
- Probleme mit der Genauigkeit der Werkzeugauswahl bei großen Werkzeugsätzen
- Aufbau von MCP-gesteuerten Systemen mit mehreren Servern (200+ Werkzeuge)
- Werkzeugbibliothek wächst im Laufe der Zeit

**Wann traditioneller Tool-Aufruf besser sein könnte:**

- Weniger als 10 Werkzeuge insgesamt
- Alle Werkzeuge werden in jeder Anfrage häufig verwendet
- Sehr kleine Werkzeugdefinitionen (\<100 Token insgesamt)

### Optimierungstipps

- Behalten Sie 3-5 am häufigsten verwendete Werkzeuge als nicht aufgeschoben
- Schreiben Sie klare, aussagekräftige Werkzeugnamen und Beschreibungen
- Verwenden Sie semantische Schlüsselwörter in Beschreibungen, die damit übereinstimmen, wie Benutzer Aufgaben beschreiben
- Fügen Sie einen Systemaufforderungsabschnitt hinzu, der verfügbare Werkzeugkategorien beschreibt: "Sie können nach Werkzeugen suchen, um mit Slack, GitHub und Jira zu interagieren"
- Überwachen Sie, welche Werkzeuge Claude entdeckt, um Beschreibungen zu verfeinern

## Verwendung

Die Verwendung des Tool-Suchwerkzeugs wird im Verwendungsobjekt der Antwort verfolgt:

```json JSON
{
  "usage": {
    "input_tokens": 1024,
    "output_tokens": 256,
    "server_tool_use": {
      "tool_search_requests": 2
    }
  }
}
```