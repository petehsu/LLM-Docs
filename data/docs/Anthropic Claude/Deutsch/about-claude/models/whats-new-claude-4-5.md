# Neuerungen in Claude 4.5

Erfahren Sie mehr über die neuen Modelle und Funktionen in Claude 4.5, einschließlich verbesserter Fähigkeiten für Agenten, Codierung und erweiterte Kontextfenster.

---

Claude 4.5 führt drei Modelle ein, die für verschiedene Anwendungsfälle entwickelt wurden:

- **Claude Opus 4.5**: Unser intelligentestes Modell, das maximale Leistung mit praktischer Effizienz kombiniert. Bietet einen zugänglicheren Preis als frühere Opus-Modelle. Verfügbar mit einem 200k-Token-Kontextfenster.
- **Claude Sonnet 4.5**: Unser bestes Modell für komplexe Agenten und Codierung mit der höchsten Intelligenz bei den meisten Aufgaben. Verfügbar mit einem 200k- und 1M-Token-Kontextfenster (Beta).
- **Claude Haiku 4.5**: Unser schnellstes und intelligentestes Haiku-Modell mit nahezu Frontier-Leistung. Verfügbar mit einem 200k-Token-Kontextfenster.

## Wichtigste Verbesserungen in Opus 4.5 gegenüber Opus 4.1

### Maximale Intelligenz

Claude Opus 4.5 stellt unser intelligentestes Modell dar und kombiniert maximale Leistung mit praktischer Effizienz. Es bietet bedeutende Verbesserungen bei Reasoning, Codierung und komplexen Problemlösungsaufgaben, während es die hochwertigen Ausgaben beibehält, die von der Opus-Familie erwartet werden.

### Effort-Parameter

Claude Opus 4.5 ist das einzige Modell, das den [Effort-Parameter](/docs/de/build-with-claude/effort) unterstützt, mit dem Sie steuern können, wie viele Tokens Claude bei der Antwort verwendet. Dies gibt Ihnen die Möglichkeit, zwischen Antwortgründlichkeit und Token-Effizienz mit einem einzigen Modell zu wählen.

Der Effort-Parameter beeinflusst alle Tokens in der Antwort, einschließlich Textantworten, Tool-Aufrufe und erweitertes Denken. Sie können zwischen folgenden Optionen wählen:
- **High effort**: Maximale Gründlichkeit für komplexe Analysen und detaillierte Erklärungen
- **Medium effort**: Ausgewogener Ansatz für die meisten Produktionsanwendungsfälle
- **Low effort**: Effizienteste Token-Antworten für Hochvolumen-Automatisierung

### Exzellenz bei der Computernutzung

Claude Opus 4.5 führt [verbesserte Computernutzungsfähigkeiten](/docs/de/agents-and-tools/tool-use/computer-use-tool) mit einer neuen Zoom-Aktion ein, die eine detaillierte Überprüfung spezifischer Bildschirmbereiche in voller Auflösung ermöglicht. Dies ermöglicht Claude, feinkörnige UI-Elemente, kleine Texte und detaillierte visuelle Informationen zu untersuchen, die in Standard-Screenshots möglicherweise unklar sind.

Die Zoom-Funktion ist besonders wertvoll für:
- Überprüfung kleiner UI-Elemente und Steuerelemente
- Lesen von Kleingedrucktem oder detailliertem Text
- Analyse komplexer Schnittstellen mit dichter Information
- Überprüfung präziser visueller Details vor Aktionen

### Praktische Leistung

Claude Opus 4.5 bietet Flaggschiff-Intelligenz zu einem [zugänglicheren Preis](/docs/de/about-claude/pricing) als frühere Opus-Modelle, wodurch fortschrittliche KI-Funktionen für eine breitere Palette von Anwendungen und Anwendungsfällen verfügbar werden.

### Erhaltung von Thinking-Blöcken

Claude Opus 4.5 [erhält automatisch alle vorherigen Thinking-Blöcke](/docs/de/build-with-claude/extended-thinking#thinking-block-preservation-in-claude-opus-4-5) während Gesprächen, wodurch die Reasoning-Kontinuität über erweiterte Multi-Turn-Interaktionen und Tool-Use-Sitzungen hinweg gewährleistet wird. Dies stellt sicher, dass Claude seine vollständige Reasoning-Historie effektiv nutzen kann, wenn es an komplexen, langfristigen Aufgaben arbeitet.

## Wichtigste Verbesserungen in Sonnet 4.5 gegenüber Sonnet 4

### Codierungs-Exzellenz

Claude Sonnet 4.5 ist unser bestes Codierungsmodell bis dato mit erheblichen Verbesserungen über den gesamten Entwicklungslebenszyklus:

- **SWE-bench Verified-Leistung**: Fortgeschrittener Stand der Technik bei Codierungs-Benchmarks
- **Verbesserte Planung und Systemdesign**: Bessere architektonische Entscheidungen und Code-Organisation
- **Verbesserte Sicherheitstechnik**: Robustere Sicherheitspraktiken und Schwachstellenerkennung
- **Bessere Befolgung von Anweisungen**: Präzisere Einhaltung von Codierungsspezifikationen und Anforderungen

<Note>
Claude Sonnet 4.5 funktioniert bei Codierungsaufgaben erheblich besser, wenn [erweitertes Denken](/docs/de/build-with-claude/extended-thinking) aktiviert ist. Erweitertes Denken ist standardmäßig deaktiviert, aber wir empfehlen, es für komplexe Codierungsarbeiten zu aktivieren. Beachten Sie, dass erweitertes Denken die [Effizienz des Prompt-Cachings](/docs/de/build-with-claude/prompt-caching#caching-with-thinking-blocks) beeinflusst. Siehe den [Migrationsleitfaden](/docs/de/about-claude/models/migrating-to-claude-4#extended-thinking-recommendations) für Konfigurationsdetails.
</Note>

### Agent-Fähigkeiten

Claude Sonnet 4.5 führt bedeutende Fortschritte bei Agent-Fähigkeiten ein:

- **Erweiterte autonome Operation**: Sonnet 4.5 kann stundenlang unabhängig arbeiten und dabei Klarheit und Fokus auf inkrementelle Fortschritte bewahren. Das Modell macht stetige Fortschritte bei einigen wenigen Aufgaben gleichzeitig, anstatt alles auf einmal zu versuchen. Es bietet faktengestützte Fortschrittsaktualisierungen, die genau widerspiegeln, was erreicht wurde.
- **Kontextbewusstsein**: Claude verfolgt jetzt seine Token-Nutzung während Gesprächen und erhält Aktualisierungen nach jedem Tool-Aufruf. Dieses Bewusstsein hilft, vorzeitiges Aufgabenabbruch zu verhindern und ermöglicht eine effektivere Ausführung bei langfristigen Aufgaben. Siehe [Kontextbewusstsein](/docs/de/build-with-claude/context-windows#context-awareness-in-claude-sonnet-4-5) für technische Details und [Prompting-Anleitung](/docs/de/build-with-claude/prompt-engineering/claude-4-best-practices#context-awareness-and-multi-window-workflows).
- **Verbesserte Tool-Nutzung**: Das Modell nutzt parallele Tool-Aufrufe effektiver, führt mehrere spekulative Suchen gleichzeitig während der Recherche durch und liest mehrere Dateien gleichzeitig, um schneller Kontext aufzubauen. Verbesserte Koordination über mehrere Tools und Informationsquellen hinweg ermöglicht es dem Modell, eine breite Palette von Fähigkeiten in agentengestützten Such- und Codierungs-Workflows effektiv zu nutzen.
- **Fortgeschrittenes Kontextmanagement**: Sonnet 4.5 behält außergewöhnliches State-Tracking in externen Dateien bei und bewahrt Zielorientierung über Sitzungen hinweg. In Kombination mit effektiverer Kontextfenster-Nutzung und unseren neuen Kontextmanagement-API-Funktionen verwaltet das Modell Informationen optimal über erweiterte Sitzungen hinweg, um Kohärenz im Laufe der Zeit zu bewahren.

<Note>Kontextbewusstsein ist in Claude Sonnet 4, Sonnet 4.5, Haiku 4.5, Opus 4, Opus 4.1 und Opus 4.5 verfügbar.</Note>

### Kommunikations- und Interaktionsstil

Claude Sonnet 4.5 hat einen verfeinerten Kommunikationsansatz, der prägnant, direkt und natürlich ist. Es bietet faktengestützte Fortschrittsaktualisierungen und kann ausführliche Zusammenfassungen nach Tool-Aufrufen überspringen, um Workflow-Momentum zu bewahren (dies kann jedoch durch Prompting angepasst werden).

Für detaillierte Anleitung zur Arbeit mit diesem Kommunikationsstil siehe [Claude 4 Best Practices](/docs/de/build-with-claude/prompt-engineering/claude-4-best-practices).

### Kreative Inhaltserstellung

Claude Sonnet 4.5 zeichnet sich bei kreativen Inhaltsaufgaben aus:

- **Präsentationen und Animationen**: Entspricht oder übertrifft Claude Opus 4.1 und Opus 4.5 beim Erstellen von Folien und visuellen Inhalten
- **Kreative Note**: Produziert polierte, professionelle Ausgaben mit starker Befolgung von Anweisungen
- **Qualität beim ersten Versuch**: Generiert brauchbare, gut gestaltete Inhalte bei ersten Versuchen

## Wichtigste Verbesserungen in Haiku 4.5 gegenüber Haiku 3.5

Claude Haiku 4.5 stellt einen transformativen Sprung für die Haiku-Modellfamilie dar und bringt Frontier-Fähigkeiten zu unserer schnellsten Modellklasse:

### Nahezu Frontier-Intelligenz mit blitzschneller Geschwindigkeit

Claude Haiku 4.5 bietet nahezu Frontier-Leistung, die Sonnet 4 bei deutlich niedrigeren Kosten und schnellerer Geschwindigkeit entspricht:

- **Nahezu Frontier-Intelligenz**: Entspricht Sonnet 4-Leistung bei Reasoning, Codierung und komplexen Aufgaben
- **Verbesserte Geschwindigkeit**: Mehr als doppelte Geschwindigkeit von Sonnet 4 mit Optimierungen für Output-Tokens pro Sekunde (OTPS)
- **Optimales Kosten-Leistungs-Verhältnis**: Nahezu Frontier-Intelligenz zu einem Drittel der Kosten, ideal für Hochvolumen-Bereitstellungen

### Erweiterte Thinking-Fähigkeiten

Claude Haiku 4.5 ist das **erste Haiku-Modell**, das erweitertes Denken unterstützt und fortgeschrittene Reasoning-Fähigkeiten zur Haiku-Familie bringt:

- **Reasoning bei Geschwindigkeit**: Zugang zu Claudes internem Reasoning-Prozess für komplexe Problemlösung
- **Thinking-Zusammenfassung**: Zusammengefasste Thinking-Ausgabe für produktionsreife Bereitstellungen
- **Verschachteltes Denken**: Denken zwischen Tool-Aufrufen für anspruchsvollere Multi-Step-Workflows
- **Budget-Kontrolle**: Konfigurieren Sie Thinking-Token-Budgets, um Reasoning-Tiefe mit Geschwindigkeit auszugleichen

Erweitertes Denken muss explizit aktiviert werden, indem ein `thinking`-Parameter zu Ihren API-Anfragen hinzugefügt wird. Siehe die [Dokumentation zu erweitertem Denken](/docs/de/build-with-claude/extended-thinking) für Implementierungsdetails.

<Note>
Claude Haiku 4.5 funktioniert bei Codierungs- und Reasoning-Aufgaben erheblich besser, wenn [erweitertes Denken](/docs/de/build-with-claude/extended-thinking) aktiviert ist. Erweitertes Denken ist standardmäßig deaktiviert, aber wir empfehlen, es für komplexe Problemlösung, Codierungsarbeiten und Multi-Step-Reasoning zu aktivieren. Beachten Sie, dass erweitertes Denken die [Effizienz des Prompt-Cachings](/docs/de/build-with-claude/prompt-caching#caching-with-thinking-blocks) beeinflusst. Siehe den [Migrationsleitfaden](/docs/de/about-claude/models/migrating-to-claude-4#extended-thinking-recommendations) für Konfigurationsdetails.
</Note>

<Note>Verfügbar in Claude Sonnet 3.7, Sonnet 4, Sonnet 4.5, Haiku 4.5, Opus 4, Opus 4.1 und Opus 4.5.</Note>

### Kontextbewusstsein

Claude Haiku 4.5 verfügt über **Kontextbewusstsein**, das es dem Modell ermöglicht, sein verbleibendes Kontextfenster während eines Gesprächs zu verfolgen:

- **Token-Budget-Verfolgung**: Claude erhält Echtzeit-Aktualisierungen zur verbleibenden Kontextkapazität nach jedem Tool-Aufruf
- **Bessere Task-Persistenz**: Das Modell kann Aufgaben effektiver ausführen, indem es den verfügbaren Arbeitsbereich versteht
- **Multi-Kontextfenster-Workflows**: Verbesserte Handhabung von Zustandsübergängen über erweiterte Sitzungen hinweg

Dies ist das erste Haiku-Modell mit nativen Kontextbewusstsein-Fähigkeiten. Für Prompting-Anleitung siehe [Claude 4 Best Practices](/docs/de/build-with-claude/prompt-engineering/claude-4-best-practices#context-awareness-and-multi-window-workflows).

<Note>Verfügbar in Claude Sonnet 4, Sonnet 4.5, Haiku 4.5, Opus 4, Opus 4.1 und Opus 4.5.</Note>

### Starke Codierungs- und Tool-Nutzung

Claude Haiku 4.5 bietet robuste Codierungsfähigkeiten, die von modernen Claude-Modellen erwartet werden:

- **Codierungs-Kompetenz**: Starke Leistung bei Code-Generierung, Debugging und Refactoring-Aufgaben
- **Vollständige Tool-Unterstützung**: Kompatibel mit allen Claude 4-Tools einschließlich Bash, Code-Ausführung, Text-Editor, Web-Suche und Computernutzung
- **Verbesserte Computernutzung**: Optimiert für autonome Desktop-Interaktion und Browser-Automatisierungs-Workflows
- **Parallele Tool-Ausführung**: Effiziente Koordination über mehrere Tools für komplexe Workflows

Haiku 4.5 ist für Anwendungsfälle konzipiert, die sowohl Intelligenz als auch Effizienz erfordern:

- **Echtzeit-Anwendungen**: Schnelle Antwortzeiten für interaktive Benutzererfahrungen
- **Hochvolumen-Verarbeitung**: Kosteneffektive Intelligenz für großflächige Bereitstellungen
- **Free-Tier-Implementierungen**: Premium-Modellqualität zu zugänglichen Preisen
- **Sub-Agent-Architekturen**: Schnelle, intelligente Agenten für Multi-Agent-Systeme
- **Computernutzung im großen Maßstab**: Kosteneffektive autonome Desktop- und Browser-Automatisierung

## Neue API-Funktionen

### Programmatische Tool-Aufrufe (Beta)

[Programmatische Tool-Aufrufe](/docs/de/agents-and-tools/tool-use/programmatic-tool-calling) ermöglichen es Claude, Code zu schreiben, der Ihre Tools programmatisch innerhalb eines Code-Ausführungs-Containers aufruft, anstatt Round-Trips durch das Modell für jeden Tool-Aufruf zu erfordern. Dies reduziert die Latenz für Multi-Tool-Workflows erheblich und verringert den Token-Verbrauch, indem Claude Daten filtern oder verarbeiten kann, bevor sie das Kontextfenster des Modells erreichen.

```python
tools=[
    {
        "type": "code_execution_20250825",
        "name": "code_execution"
    },
    {
        "name": "query_database",
        "description": "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
        "input_schema": {...},
        "allowed_callers": ["code_execution_20250825"]  # Enable programmatic calling
    }
]
```

Wichtigste Vorteile:
- **Reduzierte Latenz**: Eliminieren Sie Model-Round-Trips zwischen Tool-Aufrufen
- **Token-Effizienz**: Verarbeiten und filtern Sie Tool-Ergebnisse programmatisch, bevor sie zu Claude zurückkehren
- **Komplexe Workflows**: Unterstützen Sie Schleifen, bedingte Logik und Batch-Verarbeitung

<Note>Verfügbar in Claude Opus 4.5 und Claude Sonnet 4.5. Erfordert [Beta-Header](/docs/de/api/beta-headers): `advanced-tool-use-2025-11-20`</Note>

### Tool-Such-Tool (Beta)

Das [Tool-Such-Tool](/docs/de/agents-and-tools/tool-use/tool-search-tool) ermöglicht es Claude, mit Hunderten oder Tausenden von Tools zu arbeiten, indem es sie dynamisch entdeckt und bei Bedarf lädt. Anstatt alle Tool-Definitionen vorab in das Kontextfenster zu laden, sucht Claude Ihren Tool-Katalog und lädt nur die Tools, die es benötigt.

Zwei Such-Varianten sind verfügbar:
- **Regex** (`tool_search_tool_regex_20251119`): Claude konstruiert Regex-Muster, um Tool-Namen, Beschreibungen und Argumente zu durchsuchen
- **BM25** (`tool_search_tool_bm25_20251119`): Claude verwendet natürlichsprachige Abfragen, um nach Tools zu suchen

```python
tools=[
    {
        "type": "tool_search_tool_regex_20251119",
        "name": "tool_search_tool_regex"
    },
    {
        "name": "get_weather",
        "description": "Get the weather at a specific location",
        "input_schema": {...},
        "defer_loading": True  # Load on-demand via search
    }
]
```

Dieser Ansatz löst zwei kritische Herausforderungen:
- **Kontext-Effizienz**: Sparen Sie 10-20K Tokens, indem Sie nicht alle Tool-Definitionen vorab laden
- **Tool-Auswahlgenauigkeit**: Bewahren Sie hohe Genauigkeit auch mit 100+ verfügbaren Tools

<Note>Verfügbar in Claude Opus 4.5 und Claude Sonnet 4.5. Erfordert [Beta-Header](/docs/de/api/beta-headers): `advanced-tool-use-2025-11-20`</Note>

### Effort-Parameter (Beta)

Der [Effort-Parameter](/docs/de/build-with-claude/effort) ermöglicht es Ihnen, zu steuern, wie viele Tokens Claude bei der Antwort verwendet, und wählen Sie zwischen Antwortgründlichkeit und Token-Effizienz:

```python
response = client.beta.messages.create(
    model="claude-opus-4-5-20251101",
    betas=["effort-2025-11-24"],
    max_tokens=4096,
    messages=[{"role": "user", "content": "..."}],
    output_config={
        "effort": "medium"  # "low", "medium", or "high"
    }
)
```

Der Effort-Parameter beeinflusst alle Tokens in der Antwort, einschließlich Textantworten, Tool-Aufrufe und erweitertes Denken. Niedrigere Effort-Level erzeugen prägnantere Antworten mit minimalen Erklärungen, während höherer Effort detailliertes Reasoning und umfassende Antworten bietet.

<Note>Ausschließlich in Claude Opus 4.5 verfügbar. Erfordert [Beta-Header](/docs/de/api/beta-headers): `effort-2025-11-24`</Note>

### Tool-Use-Beispiele (Beta)

[Tool-Use-Beispiele](/docs/de/agents-and-tools/tool-use/implement-tool-use#providing-tool-use-examples) ermöglichen es Ihnen, konkrete Beispiele gültiger Tool-Eingaben bereitzustellen, um Claude zu helfen, Ihre Tools effektiver zu nutzen. Dies ist besonders nützlich für komplexe Tools mit verschachtelten Objekten, optionalen Parametern oder formatempfindlichen Eingaben.

```python
tools=[
    {
        "name": "get_weather",
        "description": "Get the current weather in a given location",
        "input_schema": {...},
        "input_examples": [
            {
                "location": "San Francisco, CA",
                "unit": "fahrenheit"
            },
            {
                "location": "Tokyo, Japan",
                "unit": "celsius"
            },
            {
                "location": "New York, NY"  # Demonstrates optional 'unit' parameter
            }
        ]
    }
]
```

Beispiele sind im Prompt neben Ihrem Tool-Schema enthalten und zeigen Claude konkrete Muster für gut geformte Tool-Aufrufe. Jedes Beispiel muss gemäß dem `input_schema` des Tools gültig sein.

<Note>Verfügbar in Claude Sonnet 4.5, Haiku 4.5, Opus 4.5, Opus 4.1 und Opus 4. Erfordert [Beta-Header](/docs/de/api/beta-headers): `advanced-tool-use-2025-11-20`.</Note>

### Memory-Tool (Beta)

Das neue [Memory-Tool](/docs/de/agents-and-tools/tool-use/memory-tool) ermöglicht es Claude, Informationen außerhalb des Kontextfensters zu speichern und abzurufen:

```python
tools=[
    {
        "type": "memory_20250818",
        "name": "memory"
    }
]
```

Dies ermöglicht:
- Aufbau von Wissensdatenbanken im Laufe der Zeit
- Aufrechterhaltung des Projektzustands über Sitzungen hinweg
- Bewahrung effektiv unbegrenzten Kontexts durch dateigestützte Speicherung

<Note>Verfügbar in Claude Sonnet 4, Sonnet 4.5, Haiku 4.5, Opus 4, Opus 4.1 und Opus 4.5. Erfordert [Beta-Header](/docs/de/api/beta-headers): `context-management-2025-06-27`</Note>

### Kontext-Bearbeitung

Verwenden Sie [Kontext-Bearbeitung](/docs/de/build-with-claude/context-editing) für intelligentes Kontextmanagement durch automatisches Löschen von Tool-Aufrufen:

```python
response = client.beta.messages.create(
    betas=["context-management-2025-06-27"],
    model="claude-sonnet-4-5",  # or claude-haiku-4-5
    max_tokens=4096,
    messages=[{"role": "user", "content": "..."}],
    context_management={
        "edits": [
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {"type": "input_tokens", "value": 500},
                "keep": {"type": "tool_uses", "value": 2},
                "clear_at_least": {"type": "input_tokens", "value": 100}
            }
        ]
    },
    tools=[...]
)
```

Diese Funktion entfernt automatisch ältere Tool-Aufrufe und Ergebnisse, wenn sich die Token-Limits nähern, und hilft, den Kontext in langfristigen Agent-Sitzungen zu verwalten.

<Note>Verfügbar in Claude Sonnet 4, Sonnet 4.5, Haiku 4.5, Opus 4, Opus 4.1 und Opus 4.5. Erfordert [Beta-Header](/docs/de/api/beta-headers): `context-management-2025-06-27`</Note>

### Verbesserte Stop-Gründe

Claude 4.5-Modelle führen einen neuen `model_context_window_exceeded`-Stop-Grund ein, der explizit anzeigt, wenn die Generierung aufgrund des Erreichens des Kontextfenster-Limits angehalten wurde, anstatt des angeforderten `max_tokens`-Limits. Dies macht es einfacher, Kontextfenster-Limits in Ihrer Anwendungslogik zu handhaben.

```json
{
  "stop_reason": "model_context_window_exceeded",
  "usage": {
    "input_tokens": 150000,
    "output_tokens": 49950
  }
}
```

### Verbesserte Tool-Parameter-Handhabung

Claude 4.5-Modelle enthalten eine Fehlerbehebung, die beabsichtigte Formatierung in Tool-Aufruf-String-Parametern bewahrt. Zuvor wurden nachfolgende Zeilenumbrüche in String-Parametern manchmal fälschlicherweise entfernt. Diese Behebung stellt sicher, dass Tools, die präzise Formatierung erfordern (wie Text-Editoren), Parameter genau wie beabsichtigt erhalten.

<Note>
Dies ist eine Verbesserung hinter den Kulissen ohne erforderliche API-Änderungen. Tools mit String-Parametern können jedoch jetzt Werte mit nachfolgenden Zeilenumbrüchen erhalten, die zuvor entfernt wurden.
</Note>

**Beispiel:**

```json
// Before: Final newline accidentally stripped
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "edit_todo",
  "input": {
    "file": "todo.txt",
    "contents": "1. Chop onions.\n2. ???\n3. Profit"
  }
}

// After: Trailing newline preserved as intended
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "edit_todo",
  "input": {
    "file": "todo.txt",
    "contents": "1. Chop onions.\n2. ???\n3. Profit\n"
  }
}
```

### Token-Zähloptimierungen

Claude 4.5-Modelle enthalten automatische Optimierungen zur Verbesserung der Modellleistung. Diese Optimierungen können kleine Mengen von Tokens zu Anfragen hinzufügen, aber **Sie werden nicht für diese vom System hinzugefügten Tokens berechnet**.

## In Claude 4 eingeführte Funktionen

Die folgenden Funktionen wurden in Claude 4 eingeführt und sind über Claude 4-Modelle verfügbar, einschließlich Claude Sonnet 4.5 und Claude Haiku 4.5.

### Neuer Ablehnungs-Stop-Grund

Claude 4-Modelle führen einen neuen `refusal`-Stop-Grund für Inhalte ein, die das Modell aus Sicherheitsgründen nicht generiert:

```json
{
  "id": "msg_014XEDjypDjFzgKVWdFUXxZP",
  "type": "message",
  "role": "assistant",
  "model": "claude-sonnet-4-5",
  "content": [{"type": "text", "text": "I would be happy to assist you. You can "}],
  "stop_reason": "refusal",
  "stop_sequence": null,
  "usage": {
    "input_tokens": 564,
    "cache_creation_input_tokens": 0,
    "cache_read_input_tokens": 0,
    "output_tokens": 22
  }
}
```

Bei Verwendung von Claude 4-Modellen sollten Sie Ihre Anwendung aktualisieren, um [Ablehnungs-Stop-Gründe zu handhaben](/docs/de/test-and-evaluate/strengthen-guardrails/handle-streaming-refusals).

### Zusammengefasstes Denken

Mit aktiviertem erweitertem Denken gibt die Messages API für Claude 4-Modelle eine Zusammenfassung von Claudes vollständigem Thinking-Prozess zurück. Zusammengefasstes Denken bietet die vollständigen Intelligenzvorteile des erweiterten Denkens, während es Missbrauch verhindert.

Während die API über Claude 3.7 und 4-Modelle konsistent ist, können Streaming-Antworten für erweitertes Denken in einem "chunky"-Liefermuster mit möglichen Verzögerungen zwischen Streaming-Ereignissen zurückkehren.

<Note>
Die Zusammenfassung wird von einem anderen Modell verarbeitet als dem, das Sie in Ihren Anfragen anvisieren. Das Thinking-Modell sieht die zusammengefasste Ausgabe nicht.
</Note>

Weitere Informationen finden Sie in der [Dokumentation zu erweitertem Denken](/docs/de/build-with-claude/extended-thinking#summarized-thinking).

### Verschachteltes Denken

Claude 4-Modelle unterstützen die Verschachtelung von Tool-Use mit erweitertem Denken, was natürlichere Gespräche ermöglicht, bei denen Tool-Uses und Antworten mit regulären Nachrichten gemischt werden können.

<Note>
Verschachteltes Denken ist in Beta. Um verschachteltes Denken zu aktivieren, fügen Sie [den Beta-Header](/docs/de/api/beta-headers) `interleaved-thinking-2025-05-14` zu Ihrer API-Anfrage hinzu.
</Note>

Weitere Informationen finden Sie in der [Dokumentation zu erweitertem Denken](/docs/de/build-with-claude/extended-thinking#interleaved-thinking).

### Verhaltensunterschiede

Claude 4-Modelle haben bemerkenswerte Verhaltensänderungen, die beeinflussen können, wie Sie Prompts strukturieren:

#### Änderungen des Kommunikationsstils

- **Prägnanter und direkter**: Claude 4-Modelle kommunizieren effizienter mit weniger ausführlichen Erklärungen
- **Natürlicherer Ton**: Antworten sind leicht gesprächiger und weniger maschinenhaft
- **Effizienzorientiert**: Können ausführliche Zusammenfassungen nach Abschluss von Aktionen überspringen, um Workflow-Momentum zu bewahren (Sie können um mehr Details bitten, wenn nötig)

#### Befolgung von Anweisungen

Claude 4-Modelle sind für präzise Befolgung von Anweisungen trainiert und erfordern explizitere Richtung:

- **Seien Sie explizit über Aktionen**: Verwenden Sie direkte Sprache wie "Machen Sie diese Änderungen" oder "Implementieren Sie diese Funktion", anstatt "Können Sie Änderungen vorschlagen", wenn Sie möchten, dass Claude Maßnahmen ergreift
- **Gewünschte Verhaltensweisen klar angeben**: Claude wird Anweisungen präzise befolgen, daher ist Spezifität über das, was Sie möchten, hilfreich, um bessere Ergebnisse zu erzielen

Für umfassende Anleitung zur Arbeit mit diesen Modellen siehe [Claude 4 Prompt-Engineering Best Practices](/docs/de/build-with-claude/prompt-engineering/claude-4-best-practices).

### Aktualisiertes Text-Editor-Tool

Das Text-Editor-Tool wurde für Claude 4-Modelle mit den folgenden Änderungen aktualisiert:

- **Tool-Typ**: `text_editor_20250728`
- **Tool-Name**: `str_replace_based_edit_tool`
- Der `undo_edit`-Befehl wird nicht mehr unterstützt

<Note>
Das `str_replace_editor`-Text-Editor-Tool bleibt für Claude Sonnet 3.7 gleich.
</Note>

Wenn Sie von Claude Sonnet 3.7 migrieren und das Text-Editor-Tool verwenden:

```python
# Claude Sonnet 3.7
tools=[
    {
        "type": "text_editor_20250124",
        "name": "str_replace_editor"
    }
]

# Claude 4 models
tools=[
    {
        "type": "text_editor_20250728",
        "name": "str_replace_based_edit_tool"
    }
]
```

Weitere Informationen finden Sie in der [Text-Editor-Tool-Dokumentation](/docs/de/agents-and-tools/tool-use/text-editor-tool).

### Aktualisiertes Code-Ausführungs-Tool

Wenn Sie das Code-Ausführungs-Tool verwenden, stellen Sie sicher, dass Sie die neueste Version `code_execution_20250825` verwenden, die Bash-Befehle und Dateiverwaltungsfähigkeiten hinzufügt.

Die Legacy-Version `code_execution_20250522` (nur Python) ist noch verfügbar, wird aber nicht für neue Implementierungen empfohlen.

Für Migrationsinstruktionen siehe die [Code-Ausführungs-Tool-Dokumentation](/docs/de/agents-and-tools/tool-use/code-execution-tool#upgrade-to-latest-tool-version).

## Preisgestaltung und Verfügbarkeit

### Preisgestaltung

Claude 4.5-Modelle behalten wettbewerbsfähige Preise:

| Modell | Eingabe | Ausgabe |
|--------|---------|---------|
| Claude Opus 4.5 | $5 pro Million Tokens | $25 pro Million Tokens |
| Claude Sonnet 4.5 | $3 pro Million Tokens | $15 pro Million Tokens |
| Claude Haiku 4.5 | $1 pro Million Tokens | $5 pro Million Tokens |

Weitere Details finden Sie in der [Preisgestaltungs-Dokumentation](/docs/de/about-claude/pricing).

### Preisgestaltung auf Drittanbieter-Plattformen

Ab Claude 4.5-Modellen (Opus 4.5, Sonnet 4.5 und Haiku 4.5) bieten AWS Bedrock und Google Vertex AI zwei Endpoint-Typen:

- **Globale Endpoints**: Dynamisches Routing für maximale Verfügbarkeit
- **Regionale Endpoints**: Garantiertes Daten-Routing durch spezifische geografische Regionen mit einem **10% Preisaufschlag**

**Diese regionale Preisgestaltung gilt für alle Claude 4.5-Modelle: Opus 4.5, Sonnet 4.5 und Haiku 4.5.**

**Die Claude API (1P) ist standardmäßig global und von dieser Änderung nicht betroffen.** Die Claude API ist nur global (entspricht dem globalen Endpoint-Angebot und der Preisgestaltung von anderen Anbietern).

Für Implementierungsdetails und Migrationsleitfaden:
- [AWS Bedrock globale vs. regionale Endpoints](/docs/de/build-with-claude/claude-on-amazon-bedrock#global-vs-regional-endpoints)
- [Google Vertex AI globale vs. regionale Endpoints](/docs/de/build-with-claude/claude-on-vertex-ai#global-vs-regional-endpoints)

### Verfügbarkeit

Claude 4.5-Modelle sind verfügbar auf:

| Modell | Claude API | Amazon Bedrock | Google Cloud Vertex AI |
|--------|-----------|----------------|------------------------|
| Claude Opus 4.5 | `claude-opus-4-5-20251101` | `anthropic.claude-opus-4-5-20251101-v1:0` | `claude-opus-4-5@20251101` |
| Claude Sonnet 4.5 | `claude-sonnet-4-5-20250929` | `anthropic.claude-sonnet-4-5-20250929-v1:0` | `claude-sonnet-4-5@20250929` |
| Claude Haiku 4.5 | `claude-haiku-4-5-20251001` | `anthropic.claude-haiku-4-5-20251001-v1:0` | `claude-haiku-4-5@20251001` |

Auch verfügbar über Claude.ai und Claude Code-Plattformen.

## Migrationsleitfaden

Breaking Changes und Migrationsanforderungen variieren je nachdem, von welchem Modell Sie upgraden. Für detaillierte Migrationsinstruktionen, einschließlich Schritt-für-Schritt-Anleitungen, Breaking Changes und Migrations-Checklisten, siehe [Migration zu Claude 4.5](/docs/de/about-claude/models/migrating-to-claude-4).

Der Migrationsleitfaden behandelt die folgenden Szenarien:
- **Claude Sonnet 3.7 → Sonnet 4.5**: Vollständiger Migrationspfad mit Breaking Changes
- **Claude Haiku 3.5 → Haiku 4.5**: Vollständiger Migrationspfad mit Breaking Changes
- **Claude Sonnet 4 → Sonnet 4.5**: Schnelles Upgrade mit minimalen Änderungen
- **Claude Opus 4.1 → Sonnet 4.5**: Nahtloses Upgrade ohne Breaking Changes
- **Claude Opus 4.1 → Opus 4.5**: Nahtloses Upgrade ohne Breaking Changes
- **Claude Opus 4.5 → Sonnet 4.5**: Nahtloses Downgrade ohne Breaking Changes

## Nächste Schritte

<CardGroup cols={3}>
  <Card title="Best Practices" icon="lightbulb" href="/docs/de/build-with-claude/prompt-engineering/claude-4-best-practices">
    Erfahren Sie Prompt-Engineering-Techniken für Claude 4.5-Modelle
  </Card>
  <Card title="Modellübersicht" icon="table" href="/docs/de/about-claude/models/overview">
    Vergleichen Sie Claude 4.5-Modelle mit anderen Claude-Modellen
  </Card>
  <Card title="Migrationsleitfaden" icon="arrow-right-arrow-left" href="/docs/de/about-claude/models/migrating-to-claude-4">
    Upgrade von früheren Modellen
  </Card>
</CardGroup>