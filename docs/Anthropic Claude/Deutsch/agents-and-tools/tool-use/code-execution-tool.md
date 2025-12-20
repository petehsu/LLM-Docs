# Code-Ausführungstool

Claude kann Daten analysieren, Visualisierungen erstellen, komplexe Berechnungen durchführen, Systembefehle ausführen, Dateien erstellen und bearbeiten sowie hochgeladene Dateien direkt in der API-Konversation verarbeiten.

---

Claude kann Daten analysieren, Visualisierungen erstellen, komplexe Berechnungen durchführen, Systembefehle ausführen, Dateien erstellen und bearbeiten sowie hochgeladene Dateien direkt in der API-Konversation verarbeiten.
Das Code-Ausführungstool ermöglicht Claude, Bash-Befehle auszuführen und Dateien in einer sicheren, isolierten Umgebung zu manipulieren, einschließlich des Schreibens von Code.

<Note>
Das Code-Ausführungstool befindet sich derzeit in der öffentlichen Beta.

Um diese Funktion zu nutzen, fügen Sie den `"code-execution-2025-08-25"` [Beta-Header](/docs/de/api/beta-headers) zu Ihren API-Anfragen hinzu.
</Note>

## Modellkompatibilität

Das Code-Ausführungstool ist auf den folgenden Modellen verfügbar:

| Modell | Tool-Version |
|-------|--------------|
| Claude Opus 4.5 (`claude-opus-4-5-20251101`) | `code_execution_20250825` |
| Claude Opus 4.1 (`claude-opus-4-1-20250805`) | `code_execution_20250825` |
| Claude Opus 4 (`claude-opus-4-20250514`) | `code_execution_20250825` |
| Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`) | `code_execution_20250825` |
| Claude Sonnet 4 (`claude-sonnet-4-20250514`) | `code_execution_20250825` |
| Claude Sonnet 3.7 (`claude-3-7-sonnet-20250219`) ([veraltet](/docs/de/about-claude/model-deprecations)) | `code_execution_20250825` |
| Claude Haiku 4.5 (`claude-haiku-4-5-20251001`) | `code_execution_20250825` |
| Claude Haiku 3.5 (`claude-3-5-haiku-latest`) | `code_execution_20250825` |

<Note>
Die aktuelle Version `code_execution_20250825` unterstützt Bash-Befehle und Dateivorgänge. Eine ältere Version `code_execution_20250522` (nur Python) ist ebenfalls verfügbar. Siehe [Upgrade auf die neueste Tool-Version](#upgrade-to-latest-tool-version) für Migrationsinformationen.
</Note>

<Warning>
Ältere Tool-Versionen sind nicht garantiert abwärtskompatibel mit neueren Modellen. Verwenden Sie immer die Tool-Version, die Ihrer Modellversion entspricht.
</Warning>

## Schnellstart

Hier ist ein einfaches Beispiel, das Claude auffordert, eine Berechnung durchzuführen:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: code-execution-2025-08-25" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": "Calculate the mean and standard deviation of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
            }
        ],
        "tools": [{
            "type": "code_execution_20250825",
            "name": "code_execution"
        }]
    }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["code-execution-2025-08-25"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Calculate the mean and standard deviation of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)

print(response)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

async function main() {
  const response = await anthropic.beta.messages.create({
    model: "claude-sonnet-4-5",
    betas: ["code-execution-2025-08-25"],
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: "Calculate the mean and standard deviation of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
      }
    ],
    tools: [{
      type: "code_execution_20250825",
      name: "code_execution"
    }]
  });

  console.log(response);
}

main().catch(console.error);
```
</CodeGroup>

## Wie die Code-Ausführung funktioniert

Wenn Sie das Code-Ausführungstool zu Ihrer API-Anfrage hinzufügen:

1. Claude bewertet, ob die Code-Ausführung zur Beantwortung Ihrer Frage hilfreich wäre
2. Das Tool stellt Claude automatisch die folgenden Funktionen zur Verfügung:
   - **Bash-Befehle**: Führen Sie Shell-Befehle für Systemvorgänge und Paketverwaltung aus
   - **Dateivorgänge**: Erstellen, anzeigen und bearbeiten Sie Dateien direkt, einschließlich des Schreibens von Code
3. Claude kann eine beliebige Kombination dieser Funktionen in einer einzelnen Anfrage verwenden
4. Alle Vorgänge werden in einer sicheren Sandbox-Umgebung ausgeführt
5. Claude stellt Ergebnisse mit allen generierten Diagrammen, Berechnungen oder Analysen bereit

## Wie man das Tool verwendet

### Bash-Befehle ausführen

Bitten Sie Claude, Systeminformationen zu überprüfen und Pakete zu installieren:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: code-execution-2025-08-25" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [{
            "role": "user",
            "content": "Check the Python version and list installed packages"
        }],
        "tools": [{
            "type": "code_execution_20250825",
            "name": "code_execution"
        }]
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["code-execution-2025-08-25"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Check the Python version and list installed packages"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  betas: ["code-execution-2025-08-25"],
  max_tokens: 4096,
  messages: [{
    role: "user",
    content: "Check the Python version and list installed packages"
  }],
  tools: [{
    type: "code_execution_20250825",
    name: "code_execution"
  }]
});
```
</CodeGroup>

### Dateien direkt erstellen und bearbeiten

Claude kann Dateien direkt in der Sandbox mit den Dateiverwaltungsfunktionen erstellen, anzeigen und bearbeiten:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: code-execution-2025-08-25" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [{
            "role": "user",
            "content": "Create a config.yaml file with database settings, then update the port from 5432 to 3306"
        }],
        "tools": [{
            "type": "code_execution_20250825",
            "name": "code_execution"
        }]
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["code-execution-2025-08-25"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Create a config.yaml file with database settings, then update the port from 5432 to 3306"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  betas: ["code-execution-2025-08-25"],
  max_tokens: 4096,
  messages: [{
    role: "user",
    content: "Create a config.yaml file with database settings, then update the port from 5432 to 3306"
  }],
  tools: [{
    type: "code_execution_20250825",
    name: "code_execution"
  }]
});
```
</CodeGroup>

### Hochladen und Analysieren Ihrer eigenen Dateien

Um Ihre eigenen Datendateien (CSV, Excel, Bilder usw.) zu analysieren, laden Sie diese über die Files API hoch und referenzieren Sie sie in Ihrer Anfrage:

<Note>
Die Verwendung der Files API mit Code Execution erfordert zwei Beta-Header: `"anthropic-beta": "code-execution-2025-08-25,files-api-2025-04-14"`
</Note>

Die Python-Umgebung kann verschiedene Dateitypen verarbeiten, die über die Files API hochgeladen werden, einschließlich:

- CSV
- Excel (.xlsx, .xls)
- JSON
- XML
- Bilder (JPEG, PNG, GIF, WebP)
- Textdateien (.txt, .md, .py, usw.)

#### Dateien hochladen und analysieren

1. **Laden Sie Ihre Datei hoch** mit der [Files API](/docs/de/build-with-claude/files)
2. **Referenzieren Sie die Datei** in Ihrer Nachricht mit einem `container_upload` Content-Block
3. **Fügen Sie das Code-Ausführungstool** in Ihre API-Anfrage ein

<CodeGroup>
```bash Shell
# Laden Sie zunächst eine Datei hoch
curl https://api.anthropic.com/v1/files \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: files-api-2025-04-14" \
    --form 'file=@"data.csv"' \

# Verwenden Sie dann die file_id mit Code Execution
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: code-execution-2025-08-25,files-api-2025-04-14" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [{
            "role": "user",
            "content": [
                {"type": "text", "text": "Analyze this CSV data"},
                {"type": "container_upload", "file_id": "file_abc123"}
            ]
        }],
        "tools": [{
            "type": "code_execution_20250825",
            "name": "code_execution"
        }]
    }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

# Laden Sie eine Datei hoch
file_object = client.beta.files.upload(
    file=open("data.csv", "rb"),
)

# Verwenden Sie die file_id mit Code Execution
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["code-execution-2025-08-25", "files-api-2025-04-14"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": "Analyze this CSV data"},
            {"type": "container_upload", "file_id": file_object.id}
        ]
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';
import { createReadStream } from 'fs';

const anthropic = new Anthropic();

async function main() {
  // Laden Sie eine Datei hoch
  const fileObject = await anthropic.beta.files.create({
    file: createReadStream("data.csv"),
  });

  // Verwenden Sie die file_id mit Code Execution
  const response = await anthropic.beta.messages.create({
    model: "claude-sonnet-4-5",
    betas: ["code-execution-2025-08-25", "files-api-2025-04-14"],
    max_tokens: 4096,
    messages: [{
      role: "user",
      content: [
        { type: "text", text: "Analyze this CSV data" },
        { type: "container_upload", file_id: fileObject.id }
      ]
    }],
    tools: [{
      type: "code_execution_20250825",
      name: "code_execution"
    }]
  });

  console.log(response);
}

main().catch(console.error);
```
</CodeGroup>

#### Generierte Dateien abrufen

Wenn Claude während der Code-Ausführung Dateien erstellt, können Sie diese Dateien mit der Files API abrufen:

<CodeGroup>
```python Python
from anthropic import Anthropic

# Initialisieren Sie den Client
client = Anthropic()

# Fordern Sie Code-Ausführung an, die Dateien erstellt
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["code-execution-2025-08-25", "files-api-2025-04-14"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Create a matplotlib visualization and save it as output.png"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)

# Extrahieren Sie Datei-IDs aus der Antwort
def extract_file_ids(response):
    file_ids = []
    for item in response.content:
        if item.type == 'bash_code_execution_tool_result':
            content_item = item.content
            if content_item.type == 'bash_code_execution_result':
                for file in content_item.content:
                    if hasattr(file, 'file_id'):
                        file_ids.append(file.file_id)
    return file_ids

# Laden Sie die erstellten Dateien herunter
for file_id in extract_file_ids(response):
    file_metadata = client.beta.files.retrieve_metadata(file_id)
    file_content = client.beta.files.download(file_id)
    file_content.write_to_file(file_metadata.filename)
    print(f"Downloaded: {file_metadata.filename}")
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';
import { writeFileSync } from 'fs';

// Initialisieren Sie den Client
const anthropic = new Anthropic();

async function main() {
  // Fordern Sie Code-Ausführung an, die Dateien erstellt
  const response = await anthropic.beta.messages.create({
    model: "claude-sonnet-4-5",
    betas: ["code-execution-2025-08-25", "files-api-2025-04-14"],
    max_tokens: 4096,
    messages: [{
      role: "user",
      content: "Create a matplotlib visualization and save it as output.png"
    }],
    tools: [{
      type: "code_execution_20250825",
      name: "code_execution"
    }]
  });

  // Extrahieren Sie Datei-IDs aus der Antwort
  function extractFileIds(response: any): string[] {
    const fileIds: string[] = [];
    for (const item of response.content) {
      if (item.type === 'bash_code_execution_tool_result') {
        const contentItem = item.content;
        if (contentItem.type === 'bash_code_execution_result' && contentItem.content) {
          for (const file of contentItem.content) {
            fileIds.push(file.file_id);
          }
        }
      }
    }
    return fileIds;
  }

  // Laden Sie die erstellten Dateien herunter
  const fileIds = extractFileIds(response);
  for (const fileId of fileIds) {
    const fileMetadata = await anthropic.beta.files.retrieveMetadata(fileId);
    const fileContent = await anthropic.beta.files.download(fileId);

    // Konvertieren Sie ReadableStream in Buffer und speichern Sie
    const chunks: Uint8Array[] = [];
    for await (const chunk of fileContent) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    writeFileSync(fileMetadata.filename, buffer);
    console.log(`Downloaded: ${fileMetadata.filename}`);
  }
}

main().catch(console.error);
```
</CodeGroup>

### Vorgänge kombinieren

Ein komplexer Workflow mit allen Funktionen:

<CodeGroup>
```bash Shell
# Laden Sie zunächst eine Datei hoch
curl https://api.anthropic.com/v1/files \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: files-api-2025-04-14" \
    --form 'file=@"data.csv"' \
    > file_response.json

# Extrahieren Sie file_id (mit jq)
FILE_ID=$(jq -r '.id' file_response.json)

# Verwenden Sie es dann mit Code Execution
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: code-execution-2025-08-25,files-api-2025-04-14" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [{
            "role": "user",
            "content": [
                {
                    "type": "text", 
                    "text": "Analyze this CSV data: create a summary report, save visualizations, and create a README with the findings"
                },
                {
                    "type": "container_upload", 
                    "file_id": "'$FILE_ID'"
                }
            ]
        }],
        "tools": [{
            "type": "code_execution_20250825",
            "name": "code_execution"
        }]
    }'
```

```python Python
# Laden Sie eine Datei hoch
file_object = client.beta.files.upload(
    file=open("data.csv", "rb"),
)

# Verwenden Sie es mit Code Execution
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["code-execution-2025-08-25", "files-api-2025-04-14"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": "Analyze this CSV data: create a summary report, save visualizations, and create a README with the findings"},
            {"type": "container_upload", "file_id": file_object.id}
        ]
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)

# Claude könnte:
# 1. Bash verwenden, um die Dateigröße zu überprüfen und Daten in der Vorschau anzuzeigen
# 2. Text-Editor verwenden, um Python-Code zu schreiben, um die CSV zu analysieren und Visualisierungen zu erstellen
# 3. Bash verwenden, um den Python-Code auszuführen
# 4. Text-Editor verwenden, um eine README.md mit Erkenntnissen zu erstellen
# 5. Bash verwenden, um Dateien in ein Report-Verzeichnis zu organisieren
```

```typescript TypeScript
// Laden Sie eine Datei hoch
const fileObject = await anthropic.beta.files.create({
  file: createReadStream("data.csv"),
});

// Verwenden Sie es mit Code Execution
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  betas: ["code-execution-2025-08-25", "files-api-2025-04-14"],
  max_tokens: 4096,
  messages: [{
    role: "user",
    content: [
      {type: "text", text: "Analyze this CSV data: create a summary report, save visualizations, and create a README with the findings"},
      {type: "container_upload", file_id: fileObject.id}
    ]
  }],
  tools: [{
    type: "code_execution_20250825",
    name: "code_execution"
  }]
});

// Claude könnte:
// 1. Bash verwenden, um die Dateigröße zu überprüfen und Daten in der Vorschau anzuzeigen
// 2. Text-Editor verwenden, um Python-Code zu schreiben, um die CSV zu analysieren und Visualisierungen zu erstellen
// 3. Bash verwenden, um den Python-Code auszuführen
// 4. Text-Editor verwenden, um eine README.md mit Erkenntnissen zu erstellen
// 5. Bash verwenden, um Dateien in ein Report-Verzeichnis zu organisieren
```
</CodeGroup>

## Tool-Definition

Das Code-Ausführungstool erfordert keine zusätzlichen Parameter:

```json JSON
{
  "type": "code_execution_20250825",
  "name": "code_execution"
}
```

Wenn dieses Tool bereitgestellt wird, erhält Claude automatisch Zugriff auf zwei Sub-Tools:
- `bash_code_execution`: Shell-Befehle ausführen
- `text_editor_code_execution`: Dateien anzeigen, erstellen und bearbeiten, einschließlich des Schreibens von Code

## Antwortformat

Das Code-Ausführungstool kann je nach Vorgang zwei Arten von Ergebnissen zurückgeben:

### Bash-Befehl-Antwort

```json
{
  "type": "server_tool_use",
  "id": "srvtoolu_01B3C4D5E6F7G8H9I0J1K2L3",
  "name": "bash_code_execution",
  "input": {
    "command": "ls -la | head -5"
  }
},
{
  "type": "bash_code_execution_tool_result",
  "tool_use_id": "srvtoolu_01B3C4D5E6F7G8H9I0J1K2L3",
  "content": {
    "type": "bash_code_execution_result",
    "stdout": "total 24\ndrwxr-xr-x 2 user user 4096 Jan 1 12:00 .\ndrwxr-xr-x 3 user user 4096 Jan 1 11:00 ..\n-rw-r--r-- 1 user user  220 Jan 1 12:00 data.csv\n-rw-r--r-- 1 user user  180 Jan 1 12:00 config.json",
    "stderr": "",
    "return_code": 0
  }
}
```

### Dateivorgangs-Antworten

**Datei anzeigen:**
```json
{
  "type": "server_tool_use",
  "id": "srvtoolu_01C4D5E6F7G8H9I0J1K2L3M4",
  "name": "text_editor_code_execution",
  "input": {
    "command": "view",
    "path": "config.json"
  }
},
{
  "type": "text_editor_code_execution_tool_result",
  "tool_use_id": "srvtoolu_01C4D5E6F7G8H9I0J1K2L3M4",
  "content": {
    "type": "text_editor_code_execution_result",
    "file_type": "text",
    "content": "{\n  \"setting\": \"value\",\n  \"debug\": true\n}",
    "numLines": 4,
    "startLine": 1,
    "totalLines": 4
  }
}
```

**Datei erstellen:**
```json
{
  "type": "server_tool_use",
  "id": "srvtoolu_01D5E6F7G8H9I0J1K2L3M4N5",
  "name": "text_editor_code_execution",
  "input": {
    "command": "create",
    "path": "new_file.txt",
    "file_text": "Hello, World!"
  }
},
{
  "type": "text_editor_code_execution_tool_result",
  "tool_use_id": "srvtoolu_01D5E6F7G8H9I0J1K2L3M4N5",
  "content": {
    "type": "text_editor_code_execution_result",
    "is_file_update": false
  }
}
```

**Datei bearbeiten (str_replace):**
```json
{
  "type": "server_tool_use",
  "id": "srvtoolu_01E6F7G8H9I0J1K2L3M4N5O6",
  "name": "text_editor_code_execution",
  "input": {
    "command": "str_replace",
    "path": "config.json",
    "old_str": "\"debug\": true",
    "new_str": "\"debug\": false"
  }
},
{
  "type": "text_editor_code_execution_tool_result",
  "tool_use_id": "srvtoolu_01E6F7G8H9I0J1K2L3M4N5O6",
  "content": {
    "type": "text_editor_code_execution_result",
    "oldStart": 3,
    "oldLines": 1,
    "newStart": 3,
    "newLines": 1,
    "lines": ["-  \"debug\": true", "+  \"debug\": false"]
  }
}
```

### Ergebnisse

Alle Ausführungsergebnisse enthalten:
- `stdout`: Ausgabe aus erfolgreicher Ausführung
- `stderr`: Fehlermeldungen, wenn die Ausführung fehlschlägt
- `return_code`: 0 für Erfolg, nicht-null für Fehler

Zusätzliche Felder für Dateivorgänge:
- **Anzeigen**: `file_type`, `content`, `numLines`, `startLine`, `totalLines`
- **Erstellen**: `is_file_update` (ob Datei bereits existierte)
- **Bearbeiten**: `oldStart`, `oldLines`, `newStart`, `newLines`, `lines` (Diff-Format)

### Fehler

Jeder Tool-Typ kann spezifische Fehler zurückgeben:

**Häufige Fehler (alle Tools):**
```json
{
  "type": "bash_code_execution_tool_result",
  "tool_use_id": "srvtoolu_01VfmxgZ46TiHbmXgy928hQR",
  "content": {
    "type": "bash_code_execution_tool_result_error",
    "error_code": "unavailable"
  }
}
```

**Fehlercodes nach Tool-Typ:**

| Tool | Fehlercode | Beschreibung |
|------|-----------|-------------|
| Alle Tools | `unavailable` | Das Tool ist vorübergehend nicht verfügbar |
| Alle Tools | `execution_time_exceeded` | Die Ausführung hat das maximale Zeitlimit überschritten |
| Alle Tools | `container_expired` | Container ist abgelaufen und nicht mehr verfügbar |
| Alle Tools | `invalid_tool_input` | Ungültige Parameter für das Tool bereitgestellt |
| Alle Tools | `too_many_requests` | Rate Limit für Tool-Nutzung überschritten |
| text_editor | `file_not_found` | Datei existiert nicht (für view/edit-Vorgänge) |
| text_editor | `string_not_found` | Der `old_str` wurde nicht in der Datei gefunden (für str_replace) |

#### `pause_turn` Stop-Grund

Die Antwort kann einen `pause_turn` Stop-Grund enthalten, der anzeigt, dass die API einen langen Durchgang unterbrochen hat. Sie können die Antwort in einer nachfolgenden Anfrage unverändert bereitstellen, um Claude seinen Durchgang fortsetzen zu lassen, oder den Inhalt ändern, wenn Sie das Gespräch unterbrechen möchten.

## Container

Das Code-Ausführungstool wird in einer sicheren, containerisierten Umgebung ausgeführt, die speziell für Code-Ausführung mit stärkerem Fokus auf Python entwickelt wurde.

### Laufzeitumgebung
- **Python-Version**: 3.11.12
- **Betriebssystem**: Linux-basierter Container
- **Architektur**: x86_64 (AMD64)

### Ressourcenlimits
- **Speicher**: 5 GiB RAM
- **Festplattenspeicher**: 5 GiB Workspace-Speicher
- **CPU**: 1 CPU

### Netzwerk und Sicherheit
- **Internetzugriff**: Vollständig deaktiviert aus Sicherheitsgründen
- **Externe Verbindungen**: Keine ausgehenden Netzwerkanfragen zulässig
- **Sandbox-Isolation**: Vollständige Isolation vom Host-System und anderen Containern
- **Dateizugriff**: Beschränkt auf Workspace-Verzeichnis nur
- **Workspace-Bereichsfestlegung**: Wie [Files](/docs/de/build-with-claude/files) sind Container auf den Workspace des API-Schlüssels beschränkt
- **Ablauf**: Container verfallen 30 Tage nach der Erstellung

### Vorinstallierte Bibliotheken
Die sandboxed Python-Umgebung enthält diese häufig verwendeten Bibliotheken:
- **Data Science**: pandas, numpy, scipy, scikit-learn, statsmodels
- **Visualisierung**: matplotlib, seaborn
- **Dateiverarbeitung**: pyarrow, openpyxl, xlsxwriter, xlrd, pillow, python-pptx, python-docx, pypdf, pdfplumber, pypdfium2, pdf2image, pdfkit, tabula-py, reportlab[pycairo], Img2pdf
- **Mathematik & Computing**: sympy, mpmath
- **Utilities**: tqdm, python-dateutil, pytz, joblib, unzip, unrar, 7zip, bc, rg (ripgrep), fd, sqlite

## Container-Wiederverwendung

Sie können einen vorhandenen Container über mehrere API-Anfragen hinweg wiederverwenden, indem Sie die Container-ID aus einer vorherigen Antwort bereitstellen.
Dies ermöglicht es Ihnen, erstellte Dateien zwischen Anfragen beizubehalten.

### Beispiel

<CodeGroup>
```python Python
import os
from anthropic import Anthropic

# Initialisieren Sie den Client
client = Anthropic(
    api_key=os.getenv("ANTHROPIC_API_KEY")
)

# Erste Anfrage: Erstellen Sie eine Datei mit einer Zufallszahl
response1 = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["code-execution-2025-08-25"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Write a file with a random number and save it to '/tmp/number.txt'"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)

# Extrahieren Sie die Container-ID aus der ersten Antwort
container_id = response1.container.id

# Zweite Anfrage: Verwenden Sie den Container erneut, um die Datei zu lesen
response2 = client.beta.messages.create(
    container=container_id,  # Verwenden Sie denselben Container erneut
    model="claude-sonnet-4-5",
    betas=["code-execution-2025-08-25"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Read the number from '/tmp/number.txt' and calculate its square"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

async function main() {
  // Erste Anfrage: Erstellen Sie eine Datei mit einer Zufallszahl
  const response1 = await anthropic.beta.messages.create({
    model: "claude-sonnet-4-5",
    betas: ["code-execution-2025-08-25"],
    max_tokens: 4096,
    messages: [{
      role: "user",
      content: "Write a file with a random number and save it to '/tmp/number.txt'"
    }],
    tools: [{
      type: "code_execution_20250825",
      name: "code_execution"
    }]
  });

  // Extrahieren Sie die Container-ID aus der ersten Antwort
  const containerId = response1.container.id;

  // Zweite Anfrage: Verwenden Sie den Container erneut, um die Datei zu lesen
  const response2 = await anthropic.beta.messages.create({
    container: containerId,  // Verwenden Sie denselben Container erneut
    model: "claude-sonnet-4-5",
    betas: ["code-execution-2025-08-25"],
    max_tokens: 4096,
    messages: [{
      role: "user",
      content: "Read the number from '/tmp/number.txt' and calculate its square"
    }],
    tools: [{
      type: "code_execution_20250825",
      name: "code_execution"
    }]
  });

  console.log(response2.content);
}

main().catch(console.error);
```

```bash Shell
# Erste Anfrage: Erstellen Sie eine Datei mit einer Zufallszahl
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: code-execution-2025-08-25" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [{
            "role": "user",
            "content": "Write a file with a random number and save it to \"/tmp/number.txt\""
        }],
        "tools": [{
            "type": "code_execution_20250825",
            "name": "code_execution"
        }]
    }' > response1.json

# Extrahieren Sie die Container-ID aus der Antwort (mit jq)
CONTAINER_ID=$(jq -r '.container.id' response1.json)

# Zweite Anfrage: Verwenden Sie den Container erneut, um die Datei zu lesen
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: code-execution-2025-08-25" \
    --header "content-type: application/json" \
    --data '{
        "container": "'$CONTAINER_ID'",
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [{
            "role": "user",
            "content": "Read the number from \"/tmp/number.txt\" and calculate its square"
        }],
        "tools": [{
            "type": "code_execution_20250825",
            "name": "code_execution"
        }]
    }'
```
</CodeGroup>

## Streaming

Mit aktiviertem Streaming erhalten Sie Code-Ausführungsereignisse, wenn sie auftreten:

```javascript
event: content_block_start
data: {"type": "content_block_start", "index": 1, "content_block": {"type": "server_tool_use", "id": "srvtoolu_xyz789", "name": "code_execution"}}

// Code-Ausführung gestreamt
event: content_block_delta
data: {"type": "content_block_delta", "index": 1, "delta": {"type": "input_json_delta", "partial_json": "{\"code\":\"import pandas as pd\\ndf = pd.read_csv('data.csv')\\nprint(df.head())\"}"}}

// Pause während Code ausgeführt wird

// Ausführungsergebnisse gestreamt
event: content_block_start
data: {"type": "content_block_start", "index": 2, "content_block": {"type": "code_execution_tool_result", "tool_use_id": "srvtoolu_xyz789", "content": {"stdout": "   A  B  C\n0  1  2  3\n1  4  5  6", "stderr": ""}}}
```

## Batch-Anfragen

Sie können das Code-Ausführungstool in die [Messages Batches API](/docs/de/build-with-claude/batch-processing) einbeziehen. Code-Ausführungstool-Aufrufe über die Messages Batches API werden genauso berechnet wie die in regulären Messages API-Anfragen.

## Nutzung und Preisgestaltung

Code execution tool usage is tracked separately from token usage. Execution time has a minimum of 5 minutes.
If files are included in the request, execution time is billed even if the tool is not used due to files being preloaded onto the container.

Each organization receives 50 free hours of usage with the code execution tool per day. Additional usage beyond the first 50 hours is billed at $0.05 per hour, per container.

## Upgrade auf die neueste Tool-Version

Durch das Upgrade auf `code-execution-2025-08-25` erhalten Sie Zugriff auf Dateiverwaltung und Bash-Funktionen, einschließlich Code in mehreren Sprachen. Es gibt keinen Preisunterschied.

### Was sich geändert hat

| Komponente | Legacy | Aktuell |
|-----------|------------------|----------------------------|
| Beta-Header | `code-execution-2025-05-22` | `code-execution-2025-08-25` |
| Tool-Typ | `code_execution_20250522` | `code_execution_20250825` |
| Funktionen | Nur Python | Bash-Befehle, Dateivorgänge |
| Antworttypen | `code_execution_result` | `bash_code_execution_result`, `text_editor_code_execution_result` |

### Abwärtskompatibilität

- Alle vorhandenen Python-Code-Ausführungen funktionieren genau wie zuvor
- Keine Änderungen erforderlich für vorhandene Python-only-Workflows

### Upgrade-Schritte

Um ein Upgrade durchzuführen, müssen Sie die folgenden Änderungen in Ihren API-Anfragen vornehmen:

1. **Aktualisieren Sie den Beta-Header**:
   ```diff
   - "anthropic-beta": "code-execution-2025-05-22"
   + "anthropic-beta": "code-execution-2025-08-25"
   ```

2. **Aktualisieren Sie den Tool-Typ**:
   ```diff
   - "type": "code_execution_20250522"
   + "type": "code_execution_20250825"
   ```

3. **Überprüfen Sie die Antwortbehandlung** (wenn Sie Antworten programmgesteuert analysieren):
   - Die vorherigen Blöcke für Python-Ausführungsantworten werden nicht mehr gesendet
   - Stattdessen werden neue Antworttypen für Bash- und Dateivorgänge gesendet (siehe Abschnitt Antwortformat)

## Programmgesteuerte Tool-Aufrufe

Das Code-Ausführungstool ermöglicht [programmgesteuerte Tool-Aufrufe](/docs/de/agents-and-tools/tool-use/programmatic-tool-calling), die es Claude ermöglichen, Code zu schreiben, der Ihre benutzerdefinierten Tools programmgesteuert im Ausführungscontainer aufruft. Dies ermöglicht effiziente Multi-Tool-Workflows, Datenfilterung vor Erreichen von Claudes Kontext und komplexe bedingte Logik.

<CodeGroup>
```python Python
# Aktivieren Sie programmgesteuerte Aufrufe für Ihre Tools
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Get weather for 5 cities and find the warmest"
    }],
    tools=[
        {
            "type": "code_execution_20250825",
            "name": "code_execution"
        },
        {
            "name": "get_weather",
            "description": "Get weather for a city",
            "input_schema": {...},
            "allowed_callers": ["code_execution_20250825"]  # Aktivieren Sie programmgesteuerte Aufrufe
        }
    ]
)
```
</CodeGroup>

Weitere Informationen finden Sie in der [Dokumentation zu programmgesteuerten Tool-Aufrufen](/docs/de/agents-and-tools/tool-use/programmatic-tool-calling).

## Verwendung von Code Execution mit Agent Skills

Das Code-Ausführungstool ermöglicht Claude, [Agent Skills](/docs/de/agents-and-tools/agent-skills/overview) zu verwenden. Skills sind modulare Funktionen, die aus Anweisungen, Skripten und Ressourcen bestehen und Claudes Funktionalität erweitern.

Weitere Informationen finden Sie in der [Agent Skills-Dokumentation](/docs/de/agents-and-tools/agent-skills/overview) und [Agent Skills API-Anleitung](/docs/de/build-with-claude/skills-guide).