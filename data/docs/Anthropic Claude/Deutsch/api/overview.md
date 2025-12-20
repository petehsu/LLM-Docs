# API-Übersicht

Die Claude API ist eine RESTful API, die programmatischen Zugriff auf Claude-Modelle bietet. Erfahren Sie mehr über die verfügbaren APIs, Authentifizierung und erste Schritte.

---

Die Claude API ist eine RESTful API unter `https://api.anthropic.com`, die programmatischen Zugriff auf Claude-Modelle bietet. Die primäre API ist die Messages API (`POST /v1/messages`) für Konversationsinteraktionen.

<Note>
**Neu bei Claude?** Beginnen Sie mit [Erste Schritte](/docs/de/get-started) für Voraussetzungen und Ihren ersten API-Aufruf, oder siehe [Arbeiten mit Messages](/docs/de/build-with-claude/working-with-messages) für Request-/Response-Muster und Beispiele.
</Note>

## Voraussetzungen

Um die Claude API zu verwenden, benötigen Sie:

- Ein [Anthropic Console-Konto](https://console.anthropic.com)
- Einen [API-Schlüssel](/settings/keys)

Für schrittweise Anweisungen zur Einrichtung siehe [Erste Schritte](/docs/de/get-started).

## Verfügbare APIs

Die Claude API umfasst die folgenden APIs:

**Allgemeine Verfügbarkeit:**
- **[Messages API](/docs/de/api/messages)**: Senden Sie Nachrichten an Claude für Konversationsinteraktionen (`POST /v1/messages`)
- **[Message Batches API](/docs/de/api/creating-message-batches)**: Verarbeiten Sie große Mengen von Messages-Anfragen asynchron mit 50% Kostenreduktion (`POST /v1/messages/batches`)
- **[Token Counting API](/docs/de/api/messages-count-tokens)**: Zählen Sie Token in einer Nachricht vor dem Senden, um Kosten und Rate Limits zu verwalten (`POST /v1/messages/count_tokens`)
- **[Models API](/docs/de/api/models-list)**: Listet verfügbare Claude-Modelle und deren Details auf (`GET /v1/models`)

**Beta:**
- **[Files API](/docs/de/api/files-create)**: Laden Sie Dateien hoch und verwalten Sie sie für die Verwendung über mehrere API-Aufrufe (`POST /v1/files`, `GET /v1/files`)
- **[Skills API](/docs/de/api/skills/create-skill)**: Erstellen und verwalten Sie benutzerdefinierte Agent-Skills (`POST /v1/skills`, `GET /v1/skills`)

Für die vollständige API-Referenz mit allen Endpunkten, Parametern und Response-Schemas erkunden Sie die API-Referenzseiten, die in der Navigation aufgeführt sind. Um auf Beta-Funktionen zuzugreifen, siehe [Beta-Header](/docs/de/api/beta-headers).

## Authentifizierung

Alle Anfragen an die Claude API müssen diese Header enthalten:

| Header | Wert | Erforderlich |
|--------|------|-------------|
| `x-api-key` | Ihr API-Schlüssel aus der Console | Ja |
| `anthropic-version` | API-Version (z. B. `2023-06-01`) | Ja |
| `content-type` | `application/json` | Ja |

Wenn Sie die [Client SDKs](#client-sdks) verwenden, sendet das SDK diese Header automatisch. Für Details zur API-Versionierung siehe [API-Versionen](/docs/de/api/versioning).

### API-Schlüssel abrufen

Die API wird über die Web-[Console](https://console.anthropic.com/) bereitgestellt. Sie können die [Workbench](https://console.anthropic.com/workbench) verwenden, um die API im Browser auszuprobieren, und dann API-Schlüssel in den [Kontoeinstellungen](https://console.anthropic.com/settings/keys) generieren. Verwenden Sie [Workspaces](https://console.anthropic.com/settings/workspaces), um Ihre API-Schlüssel zu segmentieren und [Ausgaben zu kontrollieren](/docs/de/api/rate-limits) nach Anwendungsfall.

## Client SDKs

Anthropic bietet offizielle SDKs, die die API-Integration vereinfachen, indem sie Authentifizierung, Request-Formatierung, Fehlerbehandlung und mehr handhaben.

**Vorteile**:
- Automatische Header-Verwaltung (x-api-key, anthropic-version, content-type)
- Typsichere Request- und Response-Behandlung
- Integrierte Wiederholungslogik und Fehlerbehandlung
- Streaming-Unterstützung
- Request-Timeouts und Verbindungsverwaltung

**Beispiel** (Python):
```python
from anthropic import Anthropic

client = Anthropic()  # Reads ANTHROPIC_API_KEY from environment
message = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello, Claude"}]
)
```

Eine Liste der Client SDKs und ihrer jeweiligen Installationsanweisungen finden Sie unter [Client SDKs](/docs/de/api/client-sdks).

## Claude API vs. Plattformen von Drittanbietern

Claude ist über die direkte API von Anthropic und über Partner-Plattformen verfügbar. Wählen Sie basierend auf Ihrer Infrastruktur, Compliance-Anforderungen und Preisvorlieben.

### Claude API

- **Direkter Zugriff** auf die neuesten Modelle und Funktionen zuerst
- **Anthropic-Abrechnung und Support**
- **Beste für**: Neue Integrationen, vollständiger Funktionszugriff, direkte Beziehung zu Anthropic

### APIs von Drittanbieter-Plattformen

Greifen Sie auf Claude über AWS, Google Cloud oder Microsoft Azure zu:
- **Integriert** mit Cloud-Provider-Abrechnung und IAM
- **Kann Funktionsverzögerungen** oder Unterschiede zur direkten API haben
- **Beste für**: Bestehende Cloud-Verpflichtungen, spezifische Compliance-Anforderungen, konsolidierte Cloud-Abrechnung

| Plattform | Anbieter | Dokumentation |
|-----------|----------|---------------|
| Amazon Bedrock | AWS | [Claude auf Amazon Bedrock](/docs/de/build-with-claude/claude-on-amazon-bedrock) |
| Vertex AI | Google Cloud | [Claude auf Vertex AI](/docs/de/build-with-claude/claude-on-vertex-ai) |
| Azure AI | Microsoft Azure | [Claude auf Azure AI](/docs/de/build-with-claude/claude-in-microsoft-foundry) |

<Note>
Für die Funktionsverfügbarkeit über Plattformen hinweg siehe die [Funktionsübersicht](/docs/de/build-with-claude/overview).
</Note>

## Request- und Response-Format

### Request-Größenlimits

Die API hat unterschiedliche maximale Request-Größen je nach Endpunkt:

| Endpunkt | Maximale Größe |
|----------|----------------|
| Standard-Endpunkte (Messages, Token Counting) | 32 MB |
| [Batch API](/docs/de/build-with-claude/batch-processing) | 256 MB |
| [Files API](/docs/de/build-with-claude/files) | 500 MB |

Wenn Sie diese Limits überschreiten, erhalten Sie einen 413 `request_too_large` Fehler.

### Response-Header

Die Claude API enthält die folgenden Header in jeder Response:

- `request-id`: Ein global eindeutiger Bezeichner für die Anfrage
- `anthropic-organization-id`: Die Organisations-ID, die dem API-Schlüssel zugeordnet ist, der in der Anfrage verwendet wird

## Rate Limits und Verfügbarkeit

### Rate Limits

Die API erzwingt Rate Limits und Ausgabenlimits, um Missbrauch zu verhindern und Kapazität zu verwalten. Limits sind in Nutzungsstufen organisiert, die automatisch zunehmen, wenn Sie die API verwenden. Jede Stufe hat:

- **Ausgabenlimits**: Maximale monatliche Kosten für API-Nutzung
- **Rate Limits**: Maximale Anzahl von Anfragen pro Minute (RPM) und Token pro Minute (TPM)

Sie können die aktuellen Limits Ihrer Organisation in der [Console](/settings/limits) anzeigen. Für höhere Limits oder Priority Tier (verbesserte Service-Level mit gebundenem Ausgabenbudget) kontaktieren Sie den Vertrieb über die Console.

Für detaillierte Informationen über Limits, Stufen und den Token-Bucket-Algorithmus, der für Rate Limiting verwendet wird, siehe [Rate Limits](/docs/de/api/rate-limits).

### Verfügbarkeit

Die Claude API ist in [vielen Ländern und Regionen](/docs/de/api/supported-regions) weltweit verfügbar. Überprüfen Sie die Seite der unterstützten Regionen, um die Verfügbarkeit an Ihrem Standort zu bestätigen.

## Grundlegendes Beispiel

Hier ist eine minimale Anfrage mit der Messages API:

```bash
curl https://api.anthropic.com/v1/messages \
  --header "x-api-key: $ANTHROPIC_API_KEY" \
  --header "anthropic-version: 2023-06-01" \
  --header "content-type: application/json" \
  --data '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "Hello, Claude"}
    ]
  }'
```

**Response:**
```json
{
  "id": "msg_01XFDUDYJgAACzvnptvVoYEL",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "Hello! How can I assist you today?"
    }
  ],
  "model": "claude-sonnet-4-5",
  "stop_reason": "end_turn",
  "usage": {
    "input_tokens": 12,
    "output_tokens": 8
  }
}
```

Für vollständige Beispiele und Tutorials siehe [Erste Schritte](/docs/de/get-started) und [Arbeiten mit Messages](/docs/de/build-with-claude/working-with-messages).

## Nächste Schritte

<CardGroup cols={3}>
  <Card title="Erste Schritte" icon="rocket" href="/docs/de/get-started">
    Voraussetzungen, schrittweise Anleitung und Beispiele in mehreren Sprachen
  </Card>
  <Card title="Arbeiten mit Messages" icon="message" href="/docs/de/build-with-claude/working-with-messages">
    Request-/Response-Muster, mehrteilige Konversationen und Best Practices
  </Card>
  <Card title="Messages API-Referenz" icon="book" href="/docs/de/api/messages">
    Vollständige API-Spezifikation: Parameter, Responses und Fehlercodes
  </Card>
  <Card title="Client SDKs" icon="code" href="/docs/de/api/client-sdks">
    Installationsanleitungen für Python, TypeScript, Java, Go, C#, Ruby und PHP
  </Card>
  <Card title="Funktionsübersicht" icon="grid" href="/docs/de/build-with-claude/overview">
    Erkunden Sie Funktionen: Caching, Vision, Tool Use, Streaming und mehr
  </Card>
  <Card title="Rate Limits" icon="gauge" href="/docs/de/api/rate-limits">
    Nutzungsstufen, Ausgabenlimits und Rate Limiting mit Token-Bucket-Algorithmus
  </Card>
</CardGroup>