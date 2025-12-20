# Preisgestaltung

Erfahren Sie mehr über Anthropics Preisstruktur für Modelle und Funktionen

---

Diese Seite bietet detaillierte Preisinformationen für Anthropics Modelle und Funktionen. Alle Preise sind in USD.

Die aktuellsten Preisinformationen finden Sie unter [claude.com/pricing](https://claude.com/pricing).

## Modellpreisgestaltung

Die folgende Tabelle zeigt die Preisgestaltung für alle Claude-Modelle über verschiedene Nutzungsstufen hinweg:

| Model             | Base Input Tokens | 5m Cache Writes | 1h Cache Writes | Cache Hits & Refreshes | Output Tokens |
|-------------------|-------------------|-----------------|-----------------|----------------------|---------------|
| Claude Opus 4.5   | $5 / MTok         | $6.25 / MTok    | $10 / MTok      | $0.50 / MTok | $25 / MTok    |
| Claude Opus 4.1   | $15 / MTok        | $18.75 / MTok   | $30 / MTok      | $1.50 / MTok | $75 / MTok    |
| Claude Opus 4     | $15 / MTok        | $18.75 / MTok   | $30 / MTok      | $1.50 / MTok | $75 / MTok    |
| Claude Sonnet 4.5   | $3 / MTok         | $3.75 / MTok    | $6 / MTok       | $0.30 / MTok | $15 / MTok    |
| Claude Sonnet 4   | $3 / MTok         | $3.75 / MTok    | $6 / MTok       | $0.30 / MTok | $15 / MTok    |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations)) | $3 / MTok         | $3.75 / MTok    | $6 / MTok       | $0.30 / MTok | $15 / MTok    |
| Claude Haiku 4.5  | $1 / MTok         | $1.25 / MTok    | $2 / MTok       | $0.10 / MTok | $5 / MTok     |
| Claude Haiku 3.5  | $0.80 / MTok      | $1 / MTok       | $1.6 / MTok     | $0.08 / MTok | $4 / MTok     |
| Claude Opus 3 ([deprecated](/docs/en/about-claude/model-deprecations))    | $15 / MTok        | $18.75 / MTok   | $30 / MTok      | $1.50 / MTok | $75 / MTok    |
| Claude Haiku 3    | $0.25 / MTok      | $0.30 / MTok    | $0.50 / MTok    | $0.03 / MTok | $1.25 / MTok  |

<Note>
MTok = Million Token. Die Spalte „Base Input Tokens" zeigt die Standard-Eingabepreisgestaltung, „Cache Writes" und „Cache Hits" sind spezifisch für [Prompt-Caching](/docs/de/build-with-claude/prompt-caching), und „Output Tokens" zeigt die Ausgabepreisgestaltung. Prompt-Caching bietet sowohl 5-Minuten- (Standard) als auch 1-Stunden-Cache-Dauern, um die Kosten für verschiedene Anwendungsfälle zu optimieren.

Die obige Tabelle spiegelt die folgenden Preismultiplikatoren für Prompt-Caching wider:
- 5-Minuten-Cache-Schreib-Token sind 1,25-mal der Preis der Basis-Eingabe-Token
- 1-Stunden-Cache-Schreib-Token sind 2-mal der Preis der Basis-Eingabe-Token
- Cache-Lese-Token sind 0,1-mal der Preis der Basis-Eingabe-Token
</Note>

## Preisgestaltung von Drittanbieter-Plattformen

Claude-Modelle sind auf [AWS Bedrock](/docs/de/build-with-claude/claude-on-amazon-bedrock), [Google Vertex AI](/docs/de/build-with-claude/claude-on-vertex-ai) und [Microsoft Foundry](/docs/de/build-with-claude/claude-in-microsoft-foundry) verfügbar. Für offizielle Preisgestaltung besuchen Sie:
- [AWS Bedrock-Preisgestaltung](https://aws.amazon.com/bedrock/pricing/)
- [Google Vertex AI-Preisgestaltung](https://cloud.google.com/vertex-ai/generative-ai/pricing)
- [Microsoft Foundry-Preisgestaltung](https://azure.microsoft.com/en-us/pricing/details/ai-foundry/#pricing)

<Note>
**Preisgestaltung für regionale Endpunkte für Claude 4.5-Modelle und darüber hinaus**

Ab Claude Sonnet 4.5 und Haiku 4.5 bieten AWS Bedrock und Google Vertex AI zwei Endpunkttypen:
- **Globale Endpunkte**: Dynamisches Routing über Regionen hinweg für maximale Verfügbarkeit
- **Regionale Endpunkte**: Datenrouting garantiert innerhalb spezifischer geografischer Regionen

Regionale Endpunkte beinhalten einen 10%-Aufschlag gegenüber globalen Endpunkten. **Die Claude API (1P) ist standardmäßig global und von dieser Änderung nicht betroffen.** Die Claude API ist nur global (gleichwertig mit dem globalen Endpunkt-Angebot und der Preisgestaltung von anderen Anbietern).

**Umfang**: Diese Preisstruktur gilt für Claude Sonnet 4.5, Haiku 4.5 und alle zukünftigen Modelle. Frühere Modelle (Claude Sonnet 4, Opus 4 und frühere Versionen) behalten ihre bestehende Preisgestaltung.

Für Implementierungsdetails und Code-Beispiele:
- [AWS Bedrock globale vs. regionale Endpunkte](/docs/de/build-with-claude/claude-on-amazon-bedrock#global-vs-regional-endpoints)
- [Google Vertex AI globale vs. regionale Endpunkte](/docs/de/build-with-claude/claude-on-vertex-ai#global-vs-regional-endpoints)
</Note>

## Funktionsspezifische Preisgestaltung

### Batch-Verarbeitung

Die Batch API ermöglicht die asynchrone Verarbeitung großer Mengen von Anfragen mit einem 50%-Rabatt auf Ein- und Ausgabe-Token.

| Model             | Batch input      | Batch output    |
|-------------------|------------------|-----------------|
| Claude Opus 4.5     | $2.50 / MTok     | $12.50 / MTok   |
| Claude Opus 4.1     | $7.50 / MTok     | $37.50 / MTok   |
| Claude Opus 4     | $7.50 / MTok     | $37.50 / MTok   |
| Claude Sonnet 4.5   | $1.50 / MTok     | $7.50 / MTok    |
| Claude Sonnet 4   | $1.50 / MTok     | $7.50 / MTok    |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations)) | $1.50 / MTok     | $7.50 / MTok    |
| Claude Haiku 4.5  | $0.50 / MTok     | $2.50 / MTok    |
| Claude Haiku 3.5  | $0.40 / MTok     | $2 / MTok       |
| Claude Opus 3 ([deprecated](/docs/en/about-claude/model-deprecations))  | $7.50 / MTok     | $37.50 / MTok   |
| Claude Haiku 3    | $0.125 / MTok    | $0.625 / MTok   |

Weitere Informationen zur Batch-Verarbeitung finden Sie in unserer [Batch-Verarbeitungsdokumentation](/docs/de/build-with-claude/batch-processing).

### Preisgestaltung für lange Kontexte

Bei Verwendung von Claude Sonnet 4 oder Sonnet 4.5 mit dem [aktivierten 1M-Token-Kontextfenster](/docs/de/build-with-claude/context-windows#1m-token-context-window) werden Anfragen, die 200K Eingabe-Token überschreiten, automatisch zu Premium-Preisen für lange Kontexte berechnet:

<Note>
Das 1M-Token-Kontextfenster befindet sich derzeit in der Beta-Phase für Organisationen in [Nutzungsstufe](/docs/de/api/rate-limits) 4 und Organisationen mit benutzerdefinierten Ratenlimits. Das 1M-Token-Kontextfenster ist nur für Claude Sonnet 4 und Sonnet 4.5 verfügbar.
</Note>

| ≤ 200K Eingabe-Token | > 200K Eingabe-Token |
|-----------------------------------|-------------------------------------|
| Eingabe: $3 / MTok | Eingabe: $6 / MTok |
| Ausgabe: $15 / MTok | Ausgabe: $22,50 / MTok |

Die Preisgestaltung für lange Kontexte wird mit anderen Preismodifikatoren kombiniert:
- Der [Batch API 50%-Rabatt](#batch-processing) gilt für die Preisgestaltung langer Kontexte
- [Prompt-Caching-Multiplikatoren](#model-pricing) gelten zusätzlich zur Preisgestaltung langer Kontexte

<Note>
Auch mit aktiviertem Beta-Flag werden Anfragen mit weniger als 200K Eingabe-Token zu Standard-Preisen berechnet. Wenn Ihre Anfrage 200K Eingabe-Token überschreitet, werden alle Token zu Premium-Preisen berechnet.

Der 200K-Schwellenwert basiert ausschließlich auf Eingabe-Token (einschließlich Cache-Lesevorgänge/Schreibvorgänge). Die Ausgabe-Token-Anzahl beeinflusst nicht die Auswahl der Preisstufe, aber Ausgabe-Token werden zum höheren Satz berechnet, wenn der Eingabe-Schwellenwert überschritten wird.
</Note>

Um zu überprüfen, ob Ihre API-Anfrage zu den 1M-Kontextfenster-Preisen berechnet wurde, untersuchen Sie das `usage`-Objekt in der API-Antwort:

```json
{
  "usage": {
    "input_tokens": 250000,
    "cache_creation_input_tokens": 0,
    "cache_read_input_tokens": 0,
    "output_tokens": 500
  }
}
```

Berechnen Sie die Gesamtzahl der Eingabe-Token durch Summation:
- `input_tokens`
- `cache_creation_input_tokens` (wenn Prompt-Caching verwendet wird)
- `cache_read_input_tokens` (wenn Prompt-Caching verwendet wird)

Wenn die Summe 200.000 Token überschreitet, wurde die gesamte Anfrage zu 1M-Kontextpreisen berechnet.

Weitere Informationen zum `usage`-Objekt finden Sie in der [API-Antwortdokumentation](/docs/de/api/messages#response-usage).

### Tool-Use-Preisgestaltung

Tool use requests are priced based on:
1. The total number of input tokens sent to the model (including in the `tools` parameter)
2. The number of output tokens generated
3. For server-side tools, additional usage-based pricing (e.g., web search charges per search performed)

Client-side tools are priced the same as any other Claude API request, while server-side tools may incur additional charges based on their specific usage.

The additional tokens from tool use come from:

- The `tools` parameter in API requests (tool names, descriptions, and schemas)
- `tool_use` content blocks in API requests and responses
- `tool_result` content blocks in API requests

When you use `tools`, we also automatically include a special system prompt for the model which enables tool use. The number of tool use tokens required for each model are listed below (excluding the additional tokens listed above). Note that the table assumes at least 1 tool is provided. If no `tools` are provided, then a tool choice of `none` uses 0 additional system prompt tokens.

| Model                    | Tool choice                                          | Tool use system prompt token count          |
|--------------------------|------------------------------------------------------|---------------------------------------------|
| Claude Opus 4.5            | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Opus 4.1            | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Opus 4            | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Sonnet 4.5          | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Sonnet 4          | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations))        | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Haiku 4.5         | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Haiku 3.5         | `auto`, `none`<hr />`any`, `tool`   | 264 tokens<hr />340 tokens |
| Claude Opus 3 ([deprecated](/docs/en/about-claude/model-deprecations))            | `auto`, `none`<hr />`any`, `tool`   | 530 tokens<hr />281 tokens |
| Claude Sonnet 3          | `auto`, `none`<hr />`any`, `tool`   | 159 tokens<hr />235 tokens |
| Claude Haiku 3           | `auto`, `none`<hr />`any`, `tool`   | 264 tokens<hr />340 tokens |

These token counts are added to your normal input and output tokens to calculate the total cost of a request.

Aktuelle Pro-Modell-Preise finden Sie in unserem [Modellpreisgestaltungs](#model-pricing)-Abschnitt oben.

Weitere Informationen zur Tool-Use-Implementierung und Best Practices finden Sie in unserer [Tool-Use-Dokumentation](/docs/de/agents-and-tools/tool-use/overview).

### Spezifische Tool-Preisgestaltung

#### Bash-Tool

The bash tool adds **245 input tokens** to your API calls.

Additional tokens are consumed by:
- Command outputs (stdout/stderr)
- Error messages
- Large file contents

Siehe [Tool-Use-Preisgestaltung](#tool-use-pricing) für vollständige Preisdetails.

#### Code-Ausführungs-Tool

Code execution tool usage is tracked separately from token usage. Execution time has a minimum of 5 minutes.
If files are included in the request, execution time is billed even if the tool is not used due to files being preloaded onto the container.

Each organization receives 50 free hours of usage with the code execution tool per day. Additional usage beyond the first 50 hours is billed at $0.05 per hour, per container.

#### Text-Editor-Tool

The text editor tool uses the same pricing structure as other tools used with Claude. It follows the standard input and output token pricing based on the Claude model you're using.

In addition to the base tokens, the following additional input tokens are needed for the text editor tool:

| Tool | Additional input tokens |
| ----------------------------------------- | --------------------------------------- |
| `text_editor_20250429` (Claude 4.x) | 700 tokens |
| `text_editor_20250124` (Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations))) | 700 tokens |

Siehe [Tool-Use-Preisgestaltung](#tool-use-pricing) für vollständige Preisdetails.

#### Web-Such-Tool

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

#### Web-Abruf-Tool

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

#### Computer-Use-Tool

Computer use follows the standard [tool use pricing](/docs/en/agents-and-tools/tool-use/overview#pricing). When using the computer use tool:

**System prompt overhead**: The computer use beta adds 466-499 tokens to the system prompt

**Computer use tool token usage**:
| Model | Input tokens per tool definition |
| ----- | -------------------------------- |
| Claude 4.x models | 735 tokens |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations)) | 735 tokens |

**Additional token consumption**:
- Screenshot images (see [Vision pricing](/docs/en/build-with-claude/vision))
- Tool execution results returned to Claude

<Note>
If you're also using bash or text editor tools alongside computer use, those tools have their own token costs as documented in their respective pages.
</Note>

## Preisgestaltungsbeispiele für Agent-Anwendungsfälle

Das Verständnis der Preisgestaltung für Agent-Anwendungen ist entscheidend beim Erstellen mit Claude. Diese realen Beispiele können Ihnen helfen, die Kosten für verschiedene Agent-Muster zu schätzen.

### Beispiel für einen Kundensupport-Agent

Beim Erstellen eines Kundensupport-Agenten könnte die Kostenaufschlüsselung wie folgt aussehen:

<Note>
  Beispielberechnung für die Verarbeitung von 10.000 Support-Tickets:
  - Durchschnittlich ~3.700 Token pro Konversation
  - Verwendung von Claude Sonnet 4.5 bei $3/MTok Eingabe, $15/MTok Ausgabe
  - Gesamtkosten: ~$22,20 pro 10.000 Tickets
</Note>

Eine detaillierte Anleitung zu dieser Berechnung finden Sie in unserem [Kundensupport-Agent-Leitfaden](/docs/de/about-claude/use-case-guides/customer-support-chat).

### Allgemeiner Agent-Workflow-Preisgestaltung

Für komplexere Agent-Architekturen mit mehreren Schritten:

1. **Verarbeitung der anfänglichen Anfrage**
   - Typische Eingabe: 500-1.000 Token
   - Verarbeitungskosten: ~$0,003 pro Anfrage

2. **Speicher- und Kontextabruf**
   - Abgerufener Kontext: 2.000-5.000 Token
   - Kosten pro Abruf: ~$0,015 pro Operation

3. **Aktionsplanung und -ausführung**
   - Planungs-Token: 1.000-2.000
   - Ausführungs-Feedback: 500-1.000
   - Kombinierte Kosten: ~$0,045 pro Aktion

Einen umfassenden Leitfaden zu Agent-Preismustern finden Sie in unserem [Agent-Anwendungsfälle-Leitfaden](/docs/de/about-claude/use-case-guides).

### Kostenoptimierungsstrategien

Beim Erstellen von Agenten mit Claude:

1. **Verwenden Sie geeignete Modelle**: Wählen Sie Haiku für einfache Aufgaben, Sonnet für komplexes Denken
2. **Implementieren Sie Prompt-Caching**: Reduzieren Sie Kosten für wiederholte Kontexte
3. **Batch-Operationen**: Verwenden Sie die Batch API für nicht zeitkritische Aufgaben
4. **Überwachen Sie Nutzungsmuster**: Verfolgen Sie Token-Verbrauch, um Optimierungsmöglichkeiten zu identifizieren

<Tip>
  Für Anwendungen mit hohem Volumen sollten Sie erwägen, unser [Enterprise-Sales-Team](https://claude.com/contact-sales) zu kontaktieren, um benutzerdefinierte Preisvereinbarungen zu treffen.
</Tip>

## Zusätzliche Preisüberlegungen

### Ratenlimits

Ratenlimits variieren je nach Nutzungsstufe und beeinflussen, wie viele Anfragen Sie stellen können:

- **Stufe 1**: Einstiegsnutzung mit grundlegenden Limits
- **Stufe 2**: Erhöhte Limits für wachsende Anwendungen
- **Stufe 3**: Höhere Limits für etablierte Anwendungen
- **Stufe 4**: Maximale Standard-Limits
- **Enterprise**: Benutzerdefinierte Limits verfügbar

Detaillierte Informationen zu Ratenlimits finden Sie in unserer [Ratenlimit-Dokumentation](/docs/de/api/rate-limits).

Für höhere Ratenlimits oder benutzerdefinierte Preisvereinbarungen [kontaktieren Sie unser Sales-Team](https://claude.com/contact-sales).

### Mengenrabatte

Mengenrabatte können für Benutzer mit hohem Volumen verfügbar sein. Diese werden von Fall zu Fall ausgehandelt.

- Standard-Stufen verwenden die oben angegebene Preisgestaltung
- Enterprise-Kunden können [den Vertrieb kontaktieren](mailto:sales@anthropic.com) für benutzerdefinierte Preisgestaltung
- Akademische und Forschungsrabatte können verfügbar sein

### Enterprise-Preisgestaltung

Für Enterprise-Kunden mit spezifischen Anforderungen:

- Benutzerdefinierte Ratenlimits
- Mengenrabatte
- Dedizierter Support
- Benutzerdefinierte Bedingungen

Kontaktieren Sie unser Sales-Team unter [sales@anthropic.com](mailto:sales@anthropic.com) oder über die [Claude Console](/settings/limits), um Enterprise-Preisoptionen zu besprechen.

## Abrechnung und Zahlung

- Die Abrechnung wird monatlich basierend auf tatsächlicher Nutzung berechnet
- Zahlungen werden in USD verarbeitet
- Kreditkarten- und Rechnungsoptionen verfügbar
- Nutzungsverfolgung verfügbar in der [Claude Console](/)

## Häufig gestellte Fragen

**Wie wird die Token-Nutzung berechnet?**

Token sind Textstücke, die Modelle verarbeiten. Als grobe Schätzung ist 1 Token ungefähr 4 Zeichen oder 0,75 Wörter im Englischen. Die genaue Anzahl variiert je nach Sprache und Inhaltstyp.

**Gibt es kostenlose Stufen oder Testversionen?**

Neue Benutzer erhalten eine kleine Menge kostenloser Credits zum Testen der API. [Kontaktieren Sie den Vertrieb](mailto:sales@anthropic.com) für Informationen zu erweiterten Testversionen für Enterprise-Evaluierung.

**Wie werden Rabatte kombiniert?**

Batch API- und Prompt-Caching-Rabatte können kombiniert werden. Beispielsweise bietet die Verwendung beider Funktionen zusammen erhebliche Kosteneinsparungen im Vergleich zu Standard-API-Aufrufen.

**Welche Zahlungsmethoden werden akzeptiert?**

Wir akzeptieren große Kreditkarten für Standard-Konten. Enterprise-Kunden können Rechnungen und andere Zahlungsmethoden vereinbaren.

Für zusätzliche Fragen zur Preisgestaltung kontaktieren Sie [support@anthropic.com](mailto:support@anthropic.com).