# Memory-Tool

Das Memory-Tool ermöglicht Claude, Informationen über Gespräche hinweg zu speichern und abzurufen.

---

Das Memory-Tool ermöglicht Claude, Informationen über Gespräche hinweg durch ein Memory-Dateiverzeichnis zu speichern und abzurufen. Claude kann Dateien erstellen, lesen, aktualisieren und löschen, die zwischen Sitzungen bestehen bleiben, sodass es Wissen über die Zeit aufbauen kann, ohne alles im Kontextfenster zu behalten.

Das Memory-Tool wird auf der Client-Seite ausgeführt – Sie kontrollieren, wo und wie die Daten durch Ihre eigene Infrastruktur gespeichert werden.

<Note>
Das Memory-Tool befindet sich derzeit in der Beta-Phase. Um es zu aktivieren, verwenden Sie den Beta-Header `context-management-2025-06-27` in Ihren API-Anfragen.

Bitte teilen Sie Ihr Feedback zu dieser Funktion über unser [Feedback-Formular](https://forms.gle/YXC2EKGMhjN1c4L88) mit.
</Note>

## Anwendungsfälle

- Projektkontext über mehrere Agent-Ausführungen hinweg beibehalten
- Aus vergangenen Interaktionen, Entscheidungen und Feedback lernen
- Wissensbasen im Laufe der Zeit aufbauen
- Konversationsübergreifendes Lernen ermöglichen, bei dem Claude bei wiederkehrenden Workflows besser wird

## Funktionsweise

Wenn aktiviert, überprüft Claude automatisch sein Memory-Verzeichnis, bevor es Aufgaben startet. Claude kann Dateien im `/memories`-Verzeichnis erstellen, lesen, aktualisieren und löschen, um zu speichern, was es beim Arbeiten lernt, und dann diese Erinnerungen in zukünftigen Gesprächen referenzieren, um ähnliche Aufgaben effektiver zu bewältigen oder dort weiterzumachen, wo es aufgehört hat.

Da es sich um ein Client-seitiges Tool handelt, führt Claude Tool-Aufrufe durch, um Memory-Operationen auszuführen, und Ihre Anwendung führt diese Operationen lokal aus. Dies gibt Ihnen vollständige Kontrolle darüber, wo und wie der Memory gespeichert wird. Aus Sicherheitsgründen sollten Sie alle Memory-Operationen auf das `/memories`-Verzeichnis beschränken.

### Beispiel: Wie Memory-Tool-Aufrufe funktionieren

Wenn Sie Claude bitten, bei einer Aufgabe zu helfen, überprüft Claude automatisch zuerst sein Memory-Verzeichnis. So sieht eine typische Interaktion aus:

**1. Benutzeranfrage:**
```
"Help me respond to this customer service ticket."
```

**2. Claude überprüft das Memory-Verzeichnis:**
```
"I'll help you respond to the customer service ticket. Let me check my memory for any previous context."
```

Claude ruft das Memory-Tool auf:
```json
{
  "type": "tool_use",
  "id": "toolu_01C4D5E6F7G8H9I0J1K2L3M4",
  "name": "memory",
  "input": {
    "command": "view",
    "path": "/memories"
  }
}
```

**3. Ihre Anwendung gibt den Verzeichnisinhalt zurück:**
```json
{
  "type": "tool_result",
  "tool_use_id": "toolu_01C4D5E6F7G8H9I0J1K2L3M4",
  "content": "Here're the files and directories up to 2 levels deep in /memories, excluding hidden items and node_modules:\n4.0K\t/memories\n1.5K\t/memories/customer_service_guidelines.xml\n2.0K\t/memories/refund_policies.xml"
}
```

**4. Claude liest relevante Dateien:**
```json
{
  "type": "tool_use",
  "id": "toolu_01D5E6F7G8H9I0J1K2L3M4N5",
  "name": "memory",
  "input": {
    "command": "view",
    "path": "/memories/customer_service_guidelines.xml"
  }
}
```

**5. Ihre Anwendung gibt den Dateiinhalt zurück:**
```json
{
  "type": "tool_result",
  "tool_use_id": "toolu_01D5E6F7G8H9I0J1K2L3M4N5",
  "content": "Here's the content of /memories/customer_service_guidelines.xml with line numbers:\n     1\t<guidelines>\n     2\t<addressing_customers>\n     3\t- Always address customers by their first name\n     4\t- Use empathetic language\n..."
}
```

**6. Claude nutzt die Memory, um zu helfen:**
```
"Based on your customer service guidelines, I can help you craft a response. Please share the ticket details..."
```

## Unterstützte Modelle

Das Memory-Tool ist verfügbar auf:

- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)
- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)

## Erste Schritte

Um das Memory-Tool zu verwenden:

1. Fügen Sie den Beta-Header `context-management-2025-06-27` in Ihre API-Anfragen ein
2. Fügen Sie das Memory-Tool zu Ihrer Anfrage hinzu
3. Implementieren Sie Client-seitige Handler für Memory-Operationen

<Note>
Um Memory-Tool-Operationen in Ihrer Anwendung zu verarbeiten, müssen Sie Handler für jeden Memory-Befehl implementieren. Unsere SDKs bieten Memory-Tool-Helfer, die die Tool-Schnittstelle verarbeiten – Sie können `BetaAbstractMemoryTool` (Python) unterklassifizieren oder `betaMemoryTool` (TypeScript) verwenden, um Ihr eigenes Memory-Backend zu implementieren (dateibasiert, Datenbank, Cloud-Speicher, verschlüsselte Dateien usw.).

Für funktionierende Beispiele siehe:
- Python: [examples/memory/basic.py](https://github.com/anthropics/anthropic-sdk-python/blob/main/examples/memory/basic.py)
- TypeScript: [examples/tools-helpers-memory.ts](https://github.com/anthropics/anthropic-sdk-typescript/blob/main/examples/tools-helpers-memory.ts)
</Note>

## Grundlegende Verwendung

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 2048,
        "messages": [
            {
                "role": "user",
                "content": "I'\''m working on a Python web scraper that keeps crashing with a timeout error. Here'\''s the problematic function:\n\n```python\ndef fetch_page(url, retries=3):\n    for i in range(retries):\n        try:\n            response = requests.get(url, timeout=5)\n            return response.text\n        except requests.exceptions.Timeout:\n            if i == retries - 1:\n                raise\n            time.sleep(1)\n```\n\nPlease help me debug this."
            }
        ],
        "tools": [{
            "type": "memory_20250818",
            "name": "memory"
        }]
    }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

message = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=2048,
    messages=[
        {
            "role": "user",
            "content": "I'm working on a Python web scraper that keeps crashing with a timeout error. Here's the problematic function:\n\n```python\ndef fetch_page(url, retries=3):\n    for i in range(retries):\n        try:\n            response = requests.get(url, timeout=5)\n            return response.text\n        except requests.exceptions.Timeout:\n            if i == retries - 1:\n                raise\n            time.sleep(1)\n```\n\nPlease help me debug this."
        }
    ],
    tools=[{
        "type": "memory_20250818",
        "name": "memory"
    }],
    betas=["context-management-2025-06-27"]
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const message = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 2048,
  messages: [
    {
      role: "user",
      content: "I'm working on a Python web scraper that keeps crashing with a timeout error. Here's the problematic function:\n\n```python\ndef fetch_page(url, retries=3):\n    for i in range(retries):\n        try:\n            response = requests.get(url, timeout=5)\n            return response.text\n        except requests.exceptions.Timeout:\n            if i == retries - 1:\n                raise\n            time.sleep(1)\n```\n\nPlease help me debug this."
    }
  ],
  tools: [{
    type: "memory_20250818",
    name: "memory"
  }],
  betas: ["context-management-2025-06-27"]
});
```

</CodeGroup>

## Tool-Befehle

Ihre Client-seitige Implementierung muss diese Memory-Tool-Befehle verarbeiten. Während diese Spezifikationen die empfohlenen Verhaltensweisen beschreiben, mit denen Claude am besten vertraut ist, können Sie Ihre Implementierung ändern und Zeichenketten nach Bedarf für Ihren Anwendungsfall zurückgeben.

### view
Zeigt Verzeichnisinhalte oder Dateiinhalte mit optionalen Zeilenbereichen an:

```json
{
  "command": "view",
  "path": "/memories",
  "view_range": [1, 10]  // Optional: view specific lines
}
```

#### Rückgabewerte

**Für Verzeichnisse:** Geben Sie eine Auflistung zurück, die Dateien und Verzeichnisse mit ihren Größen anzeigt:
```
Here're the files and directories up to 2 levels deep in {path}, excluding hidden items and node_modules:
{size}    {path}
{size}    {path}/{filename1}
{size}    {path}/{filename2}
```

- Listet Dateien bis zu 2 Ebenen tief auf
- Zeigt lesbare Größen an (z. B. `5.5K`, `1.2M`)
- Schließt versteckte Elemente (Dateien, die mit `.` beginnen) und `node_modules` aus
- Verwendet Tabulatorzeichen zwischen Größe und Pfad

**Für Dateien:** Geben Sie Dateiinhalte mit einem Header und Zeilennummern zurück:
```
Here's the content of {path} with line numbers:
{line_numbers}{tab}{content}
```

Zeilennummernformatierung:
- **Breite**: 6 Zeichen, rechts ausgerichtet mit Leerzeichen-Auffüllung
- **Trennzeichen**: Tabulatorzeichen zwischen Zeilennummer und Inhalt
- **Indizierung**: 1-indiziert (erste Zeile ist Zeile 1)
- **Zeilenlimit**: Dateien mit mehr als 999.999 Zeilen sollten einen Fehler zurückgeben: `"File {path} exceeds maximum line limit of 999,999 lines."`

**Beispielausgabe:**
```
Here's the content of /memories/notes.txt with line numbers:
     1	Hello World
     2	This is line two
    10	Line ten
   100	Line one hundred
```

#### Fehlerbehandlung

- **Datei/Verzeichnis existiert nicht**: `"The path {path} does not exist. Please provide a valid path."`

### create
Erstellen Sie eine neue Datei:

```json
{
  "command": "create",
  "path": "/memories/notes.txt",
  "file_text": "Meeting notes:\n- Discussed project timeline\n- Next steps defined\n"
}
```

#### Rückgabewerte

- **Erfolg**: `"File created successfully at: {path}"`

#### Fehlerbehandlung

- **Datei existiert bereits**: `"Error: File {path} already exists"`

### str_replace
Ersetzen Sie Text in einer Datei:

```json
{
  "command": "str_replace",
  "path": "/memories/preferences.txt",
  "old_str": "Favorite color: blue",
  "new_str": "Favorite color: green"
}
```

#### Rückgabewerte

- **Erfolg**: `"The memory file has been edited."` gefolgt von einem Snippet der bearbeiteten Datei mit Zeilennummern

#### Fehlerbehandlung

- **Datei existiert nicht**: `"Error: The path {path} does not exist. Please provide a valid path."`
- **Text nicht gefunden**: ``"No replacement was performed, old_str `{old_str}` did not appear verbatim in {path}."``
- **Doppelter Text**: Wenn `old_str` mehrmals vorkommt, geben Sie zurück: ``"No replacement was performed. Multiple occurrences of old_str `{old_str}` in lines: {line_numbers}. Please ensure it is unique"``

#### Verzeichnisbehandlung

Wenn der Pfad ein Verzeichnis ist, geben Sie einen Fehler "Datei existiert nicht" zurück.

### insert
Fügen Sie Text in einer bestimmten Zeile ein:

```json
{
  "command": "insert",
  "path": "/memories/todo.txt",
  "insert_line": 2,
  "insert_text": "- Review memory tool documentation\n"
}
```

#### Rückgabewerte

- **Erfolg**: `"The file {path} has been edited."`

#### Fehlerbehandlung

- **Datei existiert nicht**: `"Error: The path {path} does not exist"`
- **Ungültige Zeilennummer**: ``"Error: Invalid `insert_line` parameter: {insert_line}. It should be within the range of lines of the file: [0, {n_lines}]"``

#### Verzeichnisbehandlung

Wenn der Pfad ein Verzeichnis ist, geben Sie einen Fehler "Datei existiert nicht" zurück.

### delete
Löschen Sie eine Datei oder ein Verzeichnis:

```json
{
  "command": "delete",
  "path": "/memories/old_file.txt"
}
```

#### Rückgabewerte

- **Erfolg**: `"Successfully deleted {path}"`

#### Fehlerbehandlung

- **Datei/Verzeichnis existiert nicht**: `"Error: The path {path} does not exist"`

#### Verzeichnisbehandlung

Löscht das Verzeichnis und seinen gesamten Inhalt rekursiv.

### rename
Benennen Sie eine Datei/ein Verzeichnis um oder verschieben Sie sie:

```json
{
  "command": "rename",
  "old_path": "/memories/draft.txt",
  "new_path": "/memories/final.txt"
}
```

#### Rückgabewerte

- **Erfolg**: `"Successfully renamed {old_path} to {new_path}"`

#### Fehlerbehandlung

- **Quelle existiert nicht**: `"Error: The path {old_path} does not exist"`
- **Ziel existiert bereits**: Geben Sie einen Fehler zurück (nicht überschreiben): `"Error: The destination {new_path} already exists"`

#### Verzeichnisbehandlung

Benennt das Verzeichnis um.

## Prompting-Anleitung

Wir fügen automatisch diese Anweisung zur System-Eingabeaufforderung hinzu, wenn das Memory-Tool enthalten ist:

```
IMPORTANT: ALWAYS VIEW YOUR MEMORY DIRECTORY BEFORE DOING ANYTHING ELSE.
MEMORY PROTOCOL:
1. Use the `view` command of your `memory` tool to check for earlier progress.
2. ... (work on the task) ...
     - As you make progress, record status / progress / thoughts etc in your memory.
ASSUME INTERRUPTION: Your context window might be reset at any moment, so you risk losing any progress that is not recorded in your memory directory.
```

Wenn Sie beobachten, dass Claude ungeordnete Memory-Dateien erstellt, können Sie diese Anweisung einfügen:

> Hinweis: Versuchen Sie beim Bearbeiten Ihres Memory-Ordners, seinen Inhalt immer aktuell, kohärent und organisiert zu halten. Sie können Dateien umbenennen oder löschen, die nicht mehr relevant sind. Erstellen Sie keine neuen Dateien, wenn nicht nötig.

Sie können auch lenken, was Claude in Memory schreibt, z. B. „Schreiben Sie nur Informationen relevant zu \<topic\> in Ihr Memory-System."

## Sicherheitsüberlegungen

Hier sind wichtige Sicherheitsbedenken bei der Implementierung Ihres Memory-Speichers:

### Sensible Informationen
Claude wird normalerweise ablehnen, sensible Informationen in Memory-Dateien zu schreiben. Sie möchten jedoch möglicherweise eine strengere Validierung implementieren, die potenziell sensible Informationen entfernt.

### Speichergröße von Dateien
Erwägen Sie, Memory-Dateigrößen zu verfolgen und zu verhindern, dass Dateien zu groß werden. Erwägen Sie, eine maximale Anzahl von Zeichen hinzuzufügen, die der Memory-Lesbefehl zurückgeben kann, und lassen Sie Claude durch Inhalte blättern.

### Memory-Ablauf
Erwägen Sie, Memory-Dateien regelmäßig zu löschen, auf die über einen längeren Zeitraum nicht zugegriffen wurde.

### Schutz vor Pfad-Traversal

<Warning>
Böswillige Pfadeingaben könnten versuchen, auf Dateien außerhalb des `/memories`-Verzeichnisses zuzugreifen. Ihre Implementierung **MUSS** alle Pfade validieren, um Directory-Traversal-Angriffe zu verhindern.
</Warning>

Erwägen Sie diese Schutzmaßnahmen:

- Validieren Sie, dass alle Pfade mit `/memories` beginnen
- Lösen Sie Pfade in ihre kanonische Form auf und überprüfen Sie, dass sie im Memory-Verzeichnis bleiben
- Lehnen Sie Pfade ab, die Sequenzen wie `../`, `..\\` oder andere Traversal-Muster enthalten
- Achten Sie auf URL-codierte Traversal-Sequenzen (`%2e%2e%2f`)
- Verwenden Sie die integrierten Pfad-Sicherheitsdienstprogramme Ihrer Sprache (z. B. Pythons `pathlib.Path.resolve()` und `relative_to()`)

## Fehlerbehandlung

Das Memory-Tool verwendet ähnliche Fehlerbehandlungsmuster wie das [Text-Editor-Tool](/docs/de/agents-and-tools/tool-use/text-editor-tool#handle-errors). Siehe die einzelnen Tool-Befehlsabschnitte oben für detaillierte Fehlermeldungen und Verhaltensweisen. Häufige Fehler sind Datei nicht gefunden, Berechtigungsfehler, ungültige Pfade und doppelte Text-Übereinstimmungen.

## Verwendung mit Context Editing

Das Memory-Tool kann mit [Context Editing](/docs/de/build-with-claude/context-editing) kombiniert werden, das automatisch alte Tool-Ergebnisse löscht, wenn der Gesprächskontext einen konfigurierten Schwellenwert überschreitet. Diese Kombination ermöglicht langfristige agentengesteuerte Workflows, die sonst die Kontextlimits überschreiten würden.

### Wie sie zusammenarbeiten

Wenn Context Editing aktiviert ist und Ihr Gespräch sich dem Clearing-Schwellenwert nähert, erhält Claude automatisch eine Warnbenachrichtigung. Dies veranlasst Claude, alle wichtigen Informationen aus Tool-Ergebnissen in Memory-Dateien zu speichern, bevor diese Ergebnisse aus dem Kontextfenster gelöscht werden.

Nach dem Löschen von Tool-Ergebnissen kann Claude die gespeicherten Informationen aus Memory-Dateien abrufen, wenn nötig, und behandelt Memory effektiv als Erweiterung seines Arbeitskontexts. Dies ermöglicht Claude:

- Komplexe, mehrstufige Workflows ohne Verlust kritischer Informationen fortsetzen
- Auf vergangene Arbeiten und Entscheidungen verweisen, auch nachdem Tool-Ergebnisse entfernt wurden
- Kohärenten Kontext über Gespräche hinweg beibehalten, die typische Kontextlimits überschreiten würden
- Wissen über die Zeit aufbauen, während das aktive Kontextfenster verwaltbar bleibt

### Beispiel-Workflow

Betrachten Sie ein Code-Refactoring-Projekt mit vielen Dateioperationen:

1. Claude führt zahlreiche Änderungen an Dateien durch und generiert viele Tool-Ergebnisse
2. Wenn der Kontext wächst und sich Ihrem Schwellenwert nähert, erhält Claude eine Warnung
3. Claude fasst die bisherigen Änderungen in einer Memory-Datei zusammen (z. B. `/memories/refactoring_progress.xml`)
4. Context Editing löscht die älteren Tool-Ergebnisse automatisch
5. Claude setzt die Arbeit fort und referenziert die Memory-Datei, wenn es sich erinnern muss, welche Änderungen bereits abgeschlossen wurden
6. Der Workflow kann unbegrenzt fortgesetzt werden, wobei Claude sowohl aktiven Kontext als auch persistentes Memory verwaltet

### Konfiguration

Um beide Funktionen zusammen zu verwenden:

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[...],
    tools=[
        {
            "type": "memory_20250818",
            "name": "memory"
        },
        # Your other tools
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {
                    "type": "input_tokens",
                    "value": 100000
                },
                "keep": {
                    "type": "tool_uses",
                    "value": 3
                }
            }
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [...],
  tools: [
    {
      type: "memory_20250818",
      name: "memory"
    },
    // Your other tools
  ],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: 100000
        },
        keep: {
          type: "tool_uses",
          value: 3
        }
      }
    ]
  }
});
```

</CodeGroup>

Sie können auch Memory-Tool-Aufrufe von der Löschung ausschließen, um sicherzustellen, dass Claude immer Zugriff auf aktuelle Memory-Operationen hat:

<CodeGroup>

```python Python
context_management={
    "edits": [
        {
            "type": "clear_tool_uses_20250919",
            "exclude_tools": ["memory"]
        }
    ]
}
```

```typescript TypeScript
context_management: {
  edits: [
    {
      type: "clear_tool_uses_20250919",
      exclude_tools: ["memory"]
    }
  ]
}
```

</CodeGroup>