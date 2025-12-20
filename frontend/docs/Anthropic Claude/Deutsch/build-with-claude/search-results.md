# Suchergebnisse

Aktivieren Sie natürliche Zitate für RAG-Anwendungen, indem Sie Suchergebnisse mit Quellenangabe bereitstellen

---

Suchergebnis-Inhaltsblöcke ermöglichen natürliche Zitate mit ordnungsgemäßer Quellenangabe und bringen Web-Such-ähnliche Zitate in Ihre benutzerdefinierten Anwendungen. Diese Funktion ist besonders leistungsstark für RAG-Anwendungen (Retrieval-Augmented Generation), bei denen Claude Quellen genau zitieren muss.

Die Suchergebnis-Funktion ist auf den folgenden Modellen verfügbar:

- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)
- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Sonnet 3.7 ([veraltet](/docs/de/about-claude/model-deprecations)) (`claude-3-7-sonnet-20250219`)
- Claude 3.5 Haiku (`claude-3-5-haiku-20241022`)

## Wichtigste Vorteile

- **Natürliche Zitate** - Erreichen Sie die gleiche Zitierqualität wie Web-Suche für beliebige Inhalte
- **Flexible Integration** - Verwenden Sie in Tool-Rückgaben für dynamisches RAG oder als Top-Level-Inhalt für vorab abgerufene Daten
- **Ordnungsgemäße Quellenangabe** - Jedes Ergebnis enthält Quellen- und Titelinformationen für klare Zuordnung
- **Keine Dokument-Workarounds erforderlich** - Beseitigt die Notwendigkeit für dokumentbasierte Workarounds
- **Konsistentes Zitierformat** - Entspricht der Zitierqualität und dem Format von Claudes Web-Such-Funktionalität

## Funktionsweise

Suchergebnisse können auf zwei Arten bereitgestellt werden:

1. **Aus Tool-Aufrufen** - Ihre benutzerdefinierten Tools geben Suchergebnisse zurück und ermöglichen dynamische RAG-Anwendungen
2. **Als Top-Level-Inhalt** - Sie stellen Suchergebnisse direkt in Benutzernachrichten für vorab abgerufene oder zwischengespeicherte Inhalte bereit

In beiden Fällen kann Claude automatisch Informationen aus den Suchergebnissen mit ordnungsgemäßer Quellenangabe zitieren.

### Suchergebnis-Schema

Suchergebnisse verwenden die folgende Struktur:

```json
{
  "type": "search_result",
  "source": "https://example.com/article",  // Erforderlich: Quellen-URL oder Kennung
  "title": "Article Title",                  // Erforderlich: Titel des Ergebnisses
  "content": [                               // Erforderlich: Array von Textblöcken
    {
      "type": "text",
      "text": "The actual content of the search result..."
    }
  ],
  "citations": {                             // Optional: Zitier-Konfiguration
    "enabled": true                          // Zitate für dieses Ergebnis aktivieren/deaktivieren
  }
}
```

### Erforderliche Felder

| Feld | Typ | Beschreibung |
|-------|------|-------------|
| `type` | string | Muss `"search_result"` sein |
| `source` | string | Die Quellen-URL oder Kennung für den Inhalt |
| `title` | string | Ein beschreibender Titel für das Suchergebnis |
| `content` | array | Ein Array von Textblöcken mit dem tatsächlichen Inhalt |

### Optionale Felder

| Feld | Typ | Beschreibung |
|-------|------|-------------|
| `citations` | object | Zitier-Konfiguration mit `enabled` Boolean-Feld |
| `cache_control` | object | Cache-Kontrolleinstellungen (z. B. `{"type": "ephemeral"}`) |

Jedes Element im `content`-Array muss ein Textblock mit folgenden Eigenschaften sein:
- `type`: Muss `"text"` sein
- `text`: Der tatsächliche Textinhalt (nicht-leerer String)

## Methode 1: Suchergebnisse aus Tool-Aufrufen

Der leistungsstärkste Anwendungsfall ist die Rückgabe von Suchergebnissen aus Ihren benutzerdefinierten Tools. Dies ermöglicht dynamische RAG-Anwendungen, bei denen Tools relevante Inhalte abrufen und mit automatischen Zitaten zurückgeben.

### Beispiel: Wissensdatenbank-Tool

<CodeGroup>
```python Python
from anthropic import Anthropic
from anthropic.types import (
    MessageParam,
    TextBlockParam,
    SearchResultBlockParam,
    ToolResultBlockParam
)

client = Anthropic()

# Define a knowledge base search tool
knowledge_base_tool = {
    "name": "search_knowledge_base",
    "description": "Search the company knowledge base for information",
    "input_schema": {
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "The search query"
            }
        },
        "required": ["query"]
    }
}

# Function to handle the tool call
def search_knowledge_base(query):
    # Your search logic here
    # Returns search results in the correct format
    return [
        SearchResultBlockParam(
            type="search_result",
            source="https://docs.company.com/product-guide",
            title="Product Configuration Guide",
            content=[
                TextBlockParam(
                    type="text",
                    text="To configure the product, navigate to Settings > Configuration. The default timeout is 30 seconds, but can be adjusted between 10-120 seconds based on your needs."
                )
            ],
            citations={"enabled": True}
        ),
        SearchResultBlockParam(
            type="search_result",
            source="https://docs.company.com/troubleshooting",
            title="Troubleshooting Guide",
            content=[
                TextBlockParam(
                    type="text",
                    text="If you encounter timeout errors, first check the configuration settings. Common causes include network latency and incorrect timeout values."
                )
            ],
            citations={"enabled": True}
        )
    ]

# Create a message with the tool
response = client.messages.create(
    model="claude-sonnet-4-5",  # Works with all supported models
    max_tokens=1024,
    tools=[knowledge_base_tool],
    messages=[
        MessageParam(
            role="user",
            content="How do I configure the timeout settings?"
        )
    ]
)

# When Claude calls the tool, provide the search results
if response.content[0].type == "tool_use":
    tool_result = search_knowledge_base(response.content[0].input["query"])
    
    # Send the tool result back
    final_response = client.messages.create(
        model="claude-sonnet-4-5",  # Works with all supported models
        max_tokens=1024,
        messages=[
            MessageParam(role="user", content="How do I configure the timeout settings?"),
            MessageParam(role="assistant", content=response.content),
            MessageParam(
                role="user",
                content=[
                    ToolResultBlockParam(
                        type="tool_result",
                        tool_use_id=response.content[0].id,
                        content=tool_result  # Search results go here
                    )
                ]
            )
        ]
    )
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

// Define a knowledge base search tool
const knowledgeBaseTool = {
  name: "search_knowledge_base",
  description: "Search the company knowledge base for information",
  input_schema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "The search query"
      }
    },
    required: ["query"]
  }
};

// Function to handle the tool call
function searchKnowledgeBase(query: string) {
  // Your search logic here
  // Returns search results in the correct format
  return [
    {
      type: "search_result" as const,
      source: "https://docs.company.com/product-guide",
      title: "Product Configuration Guide",
      content: [
        {
          type: "text" as const,
          text: "To configure the product, navigate to Settings > Configuration. The default timeout is 30 seconds, but can be adjusted between 10-120 seconds based on your needs."
        }
      ],
      citations: { enabled: true }
    },
    {
      type: "search_result" as const,
      source: "https://docs.company.com/troubleshooting",
      title: "Troubleshooting Guide",
      content: [
        {
          type: "text" as const,
          text: "If you encounter timeout errors, first check the configuration settings. Common causes include network latency and incorrect timeout values."
        }
      ],
      citations: { enabled: true }
    }
  ];
}

// Create a message with the tool
const response = await anthropic.messages.create({
  model: "claude-sonnet-4-5", // Works with all supported models
  max_tokens: 1024,
  tools: [knowledgeBaseTool],
  messages: [
    {
      role: "user",
      content: "How do I configure the timeout settings?"
    }
  ]
});

// Handle tool use and provide results
if (response.content[0].type === "tool_use") {
  const toolResult = searchKnowledgeBase(response.content[0].input.query);
  
  const finalResponse = await anthropic.messages.create({
    model: "claude-sonnet-4-5", // Works with all supported models
    max_tokens: 1024,
      messages: [
      { role: "user", content: "How do I configure the timeout settings?" },
      { role: "assistant", content: response.content },
      {
        role: "user",
        content: [
          {
            type: "tool_result" as const,
            tool_use_id: response.content[0].id,
            content: toolResult  // Search results go here
          }
        ]
      }
    ]
  });
}
```
</CodeGroup>

## Methode 2: Suchergebnisse als Top-Level-Inhalt

Sie können Suchergebnisse auch direkt in Benutzernachrichten bereitstellen. Dies ist nützlich für:
- Vorab abgerufene Inhalte aus Ihrer Such-Infrastruktur
- Zwischengespeicherte Suchergebnisse aus vorherigen Abfragen
- Inhalte von externen Such-Services
- Tests und Entwicklung

### Beispiel: Direkte Suchergebnisse

<CodeGroup>
```python Python
from anthropic import Anthropic
from anthropic.types import (
    MessageParam,
    TextBlockParam,
    SearchResultBlockParam
)

client = Anthropic()

# Provide search results directly in the user message
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        MessageParam(
            role="user",
            content=[
                SearchResultBlockParam(
                    type="search_result",
                    source="https://docs.company.com/api-reference",
                    title="API Reference - Authentication",
                    content=[
                        TextBlockParam(
                            type="text",
                            text="All API requests must include an API key in the Authorization header. Keys can be generated from the dashboard. Rate limits: 1000 requests per hour for standard tier, 10000 for premium."
                        )
                    ],
                    citations={"enabled": True}
                ),
                SearchResultBlockParam(
                    type="search_result",
                    source="https://docs.company.com/quickstart",
                    title="Getting Started Guide",
                    content=[
                        TextBlockParam(
                            type="text",
                            text="To get started: 1) Sign up for an account, 2) Generate an API key from the dashboard, 3) Install our SDK using pip install company-sdk, 4) Initialize the client with your API key."
                        )
                    ],
                    citations={"enabled": True}
                ),
                TextBlockParam(
                    type="text",
                    text="Based on these search results, how do I authenticate API requests and what are the rate limits?"
                )
            ]
        )
    ]
)

print(response.model_dump_json(indent=2))
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

// Provide search results directly in the user message
const response = await anthropic.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: [
        {
          type: "search_result" as const,
          source: "https://docs.company.com/api-reference",
          title: "API Reference - Authentication",
          content: [
            {
              type: "text" as const,
              text: "All API requests must include an API key in the Authorization header. Keys can be generated from the dashboard. Rate limits: 1000 requests per hour for standard tier, 10000 for premium."
            }
          ],
          citations: { enabled: true }
        },
        {
          type: "search_result" as const,
          source: "https://docs.company.com/quickstart",
          title: "Getting Started Guide",
          content: [
            {
              type: "text" as const,
              text: "To get started: 1) Sign up for an account, 2) Generate an API key from the dashboard, 3) Install our SDK using pip install company-sdk, 4) Initialize the client with your API key."
            }
          ],
          citations: { enabled: true }
        },
        {
          type: "text" as const,
          text: "Based on these search results, how do I authenticate API requests and what are the rate limits?"
        }
      ]
    }
  ]
});

console.log(response);
```

```bash Shell
#!/bin/sh
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "search_result",
                    "source": "https://docs.company.com/api-reference",
                    "title": "API Reference - Authentication",
                    "content": [
                        {
                            "type": "text",
                            "text": "All API requests must include an API key in the Authorization header. Keys can be generated from the dashboard. Rate limits: 1000 requests per hour for standard tier, 10000 for premium."
                        }
                    ],
                    "citations": {
                        "enabled": true
                    }
                },
                {
                    "type": "search_result",
                    "source": "https://docs.company.com/quickstart",
                    "title": "Getting Started Guide",
                    "content": [
                        {
                            "type": "text",
                            "text": "To get started: 1) Sign up for an account, 2) Generate an API key from the dashboard, 3) Install our SDK using pip install company-sdk, 4) Initialize the client with your API key."
                        }
                    ],
                    "citations": {
                        "enabled": true
                    }
                },
                {
                    "type": "text",
                    "text": "Based on these search results, how do I authenticate API requests and what are the rate limits?"
                }
            ]
        }
    ]
}'
```
</CodeGroup>

## Claudes Antwort mit Zitaten

Unabhängig davon, wie Suchergebnisse bereitgestellt werden, fügt Claude automatisch Zitate ein, wenn Informationen aus ihnen verwendet werden:

```json
{
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "To authenticate API requests, you need to include an API key in the Authorization header",
      "citations": [
        {
          "type": "search_result_location",
          "source": "https://docs.company.com/api-reference",
          "title": "API Reference - Authentication",
          "cited_text": "All API requests must include an API key in the Authorization header",
          "search_result_index": 0,
          "start_block_index": 0,
          "end_block_index": 0
        }
      ]
    },
    {
      "type": "text",
      "text": ". You can generate API keys from your dashboard",
      "citations": [
        {
          "type": "search_result_location",
          "source": "https://docs.company.com/api-reference",
          "title": "API Reference - Authentication",
          "cited_text": "Keys can be generated from the dashboard",
          "search_result_index": 0,
          "start_block_index": 0,
          "end_block_index": 0
        }
      ]
    },
    {
      "type": "text",
      "text": ". The rate limits are 1,000 requests per hour for the standard tier and 10,000 requests per hour for the premium tier.",
      "citations": [
        {
          "type": "search_result_location",
          "source": "https://docs.company.com/api-reference",
          "title": "API Reference - Authentication",
          "cited_text": "Rate limits: 1000 requests per hour for standard tier, 10000 for premium",
          "search_result_index": 0,
          "start_block_index": 0,
          "end_block_index": 0
        }
      ]
    }
  ]
}
```

### Zitierfelder

Jedes Zitat enthält:

| Feld | Typ | Beschreibung |
|-------|------|-------------|
| `type` | string | Immer `"search_result_location"` für Suchergebnis-Zitate |
| `source` | string | Die Quelle aus dem ursprünglichen Suchergebnis |
| `title` | string oder null | Der Titel aus dem ursprünglichen Suchergebnis |
| `cited_text` | string | Der genaue zitierte Text |
| `search_result_index` | integer | Index des Suchergebnisses (0-basiert) |
| `start_block_index` | integer | Startposition im Content-Array |
| `end_block_index` | integer | Endposition im Content-Array |

Hinweis: Der `search_result_index` bezieht sich auf den Index des Suchergebnis-Inhaltsblocks (0-basiert), unabhängig davon, wie die Suchergebnisse bereitgestellt wurden (Tool-Aufruf oder Top-Level-Inhalt).

## Mehrere Inhaltsblöcke

Suchergebnisse können mehrere Textblöcke im `content`-Array enthalten:

```json
{
  "type": "search_result",
  "source": "https://docs.company.com/api-guide",
  "title": "API Documentation",
  "content": [
    {
      "type": "text",
      "text": "Authentication: All API requests require an API key."
    },
    {
      "type": "text",
      "text": "Rate Limits: The API allows 1000 requests per hour per key."
    },
    {
      "type": "text",
      "text": "Error Handling: The API returns standard HTTP status codes."
    }
  ]
}
```

Claude kann spezifische Blöcke mit den Feldern `start_block_index` und `end_block_index` zitieren.

## Erweiterte Verwendung

### Kombination beider Methoden

Sie können sowohl Tool-basierte als auch Top-Level-Suchergebnisse in der gleichen Konversation verwenden:

```python
# First message with top-level search results
messages = [
    MessageParam(
        role="user",
        content=[
            SearchResultBlockParam(
                type="search_result",
                source="https://docs.company.com/overview",
                title="Product Overview",
                content=[
                    TextBlockParam(type="text", text="Our product helps teams collaborate...")
                ],
                citations={"enabled": True}
            ),
            TextBlockParam(
                type="text",
                text="Tell me about this product and search for pricing information"
            )
        ]
    )
]

# Claude might respond and call a tool to search for pricing
# Then you provide tool results with more search results
```

### Kombination mit anderen Inhaltstypen

Beide Methoden unterstützen das Mischen von Suchergebnissen mit anderen Inhaltstypen:

```python
# In tool results
tool_result = [
    SearchResultBlockParam(
        type="search_result",
        source="https://docs.company.com/guide",
        title="User Guide",
        content=[TextBlockParam(type="text", text="Configuration details...")],
        citations={"enabled": True}
    ),
    TextBlockParam(
        type="text",
        text="Additional context: This applies to version 2.0 and later."
    )
]

# In top-level content
user_content = [
    SearchResultBlockParam(
        type="search_result",
        source="https://research.com/paper",
        title="Research Paper",
        content=[TextBlockParam(type="text", text="Key findings...")],
        citations={"enabled": True}
    ),
    {
        "type": "image",
        "source": {"type": "url", "url": "https://example.com/chart.png"}
    },
    TextBlockParam(
        type="text",
        text="How does the chart relate to the research findings?"
    )
]
```

### Cache-Kontrolle

Fügen Sie Cache-Kontrolle für bessere Leistung hinzu:

```json
{
  "type": "search_result",
  "source": "https://docs.company.com/guide",
  "title": "User Guide",
  "content": [{"type": "text", "text": "..."}],
  "cache_control": {
    "type": "ephemeral"
  }
}
```

### Zitier-Kontrolle

Standardmäßig sind Zitate für Suchergebnisse deaktiviert. Sie können Zitate aktivieren, indem Sie die `citations`-Konfiguration explizit setzen:

```json
{
  "type": "search_result",
  "source": "https://docs.company.com/guide",
  "title": "User Guide",
  "content": [{"type": "text", "text": "Important documentation..."}],
  "citations": {
    "enabled": true  // Enable citations for this result
  }
}
```

Wenn `citations.enabled` auf `true` gesetzt ist, wird Claude Zitierverweise einbeziehen, wenn Informationen aus dem Suchergebnis verwendet werden. Dies ermöglicht:
- Natürliche Zitate für Ihre benutzerdefinierten RAG-Anwendungen
- Quellenangabe bei der Schnittstelle mit proprietären Wissensdatenbanken
- Web-Such-ähnliche Zitate für jedes benutzerdefinierte Tool, das Suchergebnisse zurückgibt

Wenn das `citations`-Feld weggelassen wird, sind Zitate standardmäßig deaktiviert.

<Warning>
Zitate sind alles oder nichts: Entweder müssen alle Suchergebnisse in einer Anfrage Zitate aktiviert haben, oder alle müssen sie deaktiviert haben. Das Mischen von Suchergebnissen mit unterschiedlichen Zitiereinstellungen führt zu einem Fehler. Wenn Sie Zitate für einige Quellen deaktivieren müssen, müssen Sie sie für alle Suchergebnisse in dieser Anfrage deaktivieren.
</Warning>

## Best Practices

### Für Tool-basierte Suche (Methode 1)

- **Dynamischer Inhalt**: Verwenden Sie für Echtzeitsuchen und dynamische RAG-Anwendungen
- **Fehlerbehandlung**: Geben Sie geeignete Meldungen zurück, wenn Suchen fehlschlagen
- **Ergebnislimits**: Geben Sie nur die relevantesten Ergebnisse zurück, um Kontext-Überfluss zu vermeiden

### Für Top-Level-Suche (Methode 2)

- **Vorab abgerufene Inhalte**: Verwenden Sie, wenn Sie bereits Suchergebnisse haben
- **Batch-Verarbeitung**: Ideal für die Verarbeitung mehrerer Suchergebnisse auf einmal
- **Tests**: Großartig zum Testen des Zitierungsverhaltens mit bekanntem Inhalt

### Allgemeine Best Practices

1. **Strukturieren Sie Ergebnisse effektiv**
   - Verwenden Sie klare, permanente Quellen-URLs
   - Geben Sie beschreibende Titel an
   - Teilen Sie lange Inhalte in logische Textblöcke auf

2. **Wahren Sie Konsistenz**
   - Verwenden Sie konsistente Quellenformate in Ihrer Anwendung
   - Stellen Sie sicher, dass Titel den Inhalt genau widerspiegeln
   - Halten Sie die Formatierung konsistent

3. **Behandeln Sie Fehler elegant**
   ```python
   def search_with_fallback(query):
       try:
           results = perform_search(query)
           if not results:
               return {"type": "text", "text": "No results found."}
           return format_as_search_results(results)
       except Exception as e:
           return {"type": "text", "text": f"Search error: {str(e)}"}
   ```

## Einschränkungen

- Suchergebnis-Inhaltsblöcke sind auf Claude API, Amazon Bedrock und Google Cloud's Vertex AI verfügbar
- Nur Textinhalte werden in Suchergebnissen unterstützt (keine Bilder oder andere Medien)
- Das `content`-Array muss mindestens einen Textblock enthalten