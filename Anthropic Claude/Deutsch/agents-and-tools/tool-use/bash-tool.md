# Bash-Tool

Das Bash-Tool ermöglicht Claude, Shell-Befehle in einer persistenten Bash-Sitzung auszuführen und ermöglicht Systemoperationen, Skriptausführung und Befehlszeilenautomatisierung.

---

Das Bash-Tool ermöglicht Claude, Shell-Befehle in einer persistenten Bash-Sitzung auszuführen, was Systemoperationen, Skriptausführung und Befehlszeilenautomatisierung ermöglicht.

## Übersicht

Das Bash-Tool bietet Claude:
- Persistente Bash-Sitzung, die den Status beibehält
- Möglichkeit, jeden Shell-Befehl auszuführen
- Zugriff auf Umgebungsvariablen und Arbeitsverzeichnis
- Befehlsverkettungs- und Skriptfunktionen

## Modellkompatibilität

| Modell | Tool-Version |
|-------|--------------|
| Claude 4-Modelle und Sonnet 3.7 ([veraltet](/docs/de/about-claude/model-deprecations)) | `bash_20250124` |

<Warning>
Ältere Tool-Versionen sind nicht garantiert abwärtskompatibel mit neueren Modellen. Verwenden Sie immer die Tool-Version, die Ihrer Modellversion entspricht.
</Warning>

## Anwendungsfälle

- **Entwicklungs-Workflows**: Führen Sie Build-Befehle, Tests und Entwicklungstools aus
- **Systemautomatisierung**: Führen Sie Skripte aus, verwalten Sie Dateien, automatisieren Sie Aufgaben
- **Datenverarbeitung**: Verarbeiten Sie Dateien, führen Sie Analyseskripte aus, verwalten Sie Datensätze
- **Umgebungseinrichtung**: Installieren Sie Pakete, konfigurieren Sie Umgebungen

## Schnellstart

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[
        {
            "type": "bash_20250124",
            "name": "bash"
        }
    ],
    messages=[
        {"role": "user", "content": "List all Python files in the current directory."}
    ]
)
```

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "tools": [
      {
        "type": "bash_20250124",
        "name": "bash"
      }
    ],
    "messages": [
      {
        "role": "user",
        "content": "List all Python files in the current directory."
      }
    ]
  }'
```
</CodeGroup>

## Funktionsweise

Das Bash-Tool verwaltet eine persistente Sitzung:

1. Claude bestimmt, welcher Befehl ausgeführt werden soll
2. Sie führen den Befehl in einer Bash-Shell aus
3. Geben Sie die Ausgabe (stdout und stderr) an Claude zurück
4. Der Sitzungsstatus bleibt zwischen Befehlen erhalten (Umgebungsvariablen, Arbeitsverzeichnis)

## Parameter

| Parameter | Erforderlich | Beschreibung |
|-----------|----------|-------------|
| `command` | Ja* | Der auszuführende Bash-Befehl |
| `restart` | Nein | Auf `true` setzen, um die Bash-Sitzung neu zu starten |

*Erforderlich, es sei denn, Sie verwenden `restart`

<section title="Beispielverwendung">

```json
// Befehl ausführen
{
  "command": "ls -la *.py"
}

// Sitzung neu starten
{
  "restart": true
}
```

</section>

## Beispiel: Mehrstufige Automatisierung

Claude kann Befehle verketten, um komplexe Aufgaben zu erledigen:

```python
# Benutzeranfrage
"Install the requests library and create a simple Python script that fetches a joke from an API, then run it."

# Claudes Tool verwendet:
# 1. Paket installieren
{"command": "pip install requests"}

# 2. Skript erstellen
{"command": "cat > fetch_joke.py << 'EOF'\nimport requests\nresponse = requests.get('https://official-joke-api.appspot.com/random_joke')\njoke = response.json()\nprint(f\"Setup: {joke['setup']}\")\nprint(f\"Punchline: {joke['punchline']}\")\nEOF"}

# 3. Skript ausführen
{"command": "python fetch_joke.py"}
```

Die Sitzung behält den Status zwischen Befehlen bei, sodass in Schritt 2 erstellte Dateien in Schritt 3 verfügbar sind.

***

## Implementieren Sie das Bash-Tool

Das Bash-Tool wird als schemalooses Tool implementiert. Bei der Verwendung dieses Tools müssen Sie kein Eingabeschema wie bei anderen Tools bereitstellen. Das Schema ist in Claudes Modell integriert und kann nicht geändert werden.

<Steps>
  <Step title="Richten Sie eine Bash-Umgebung ein">
    Erstellen Sie eine persistente Bash-Sitzung, mit der Claude interagieren kann:
    ```python
    import subprocess
    import threading
    import queue
    
    class BashSession:
        def __init__(self):
            self.process = subprocess.Popen(
                ['/bin/bash'],
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                bufsize=0
            )
            self.output_queue = queue.Queue()
            self.error_queue = queue.Queue()
            self._start_readers()
    ```
  </Step>
  <Step title="Behandeln Sie die Befehlsausführung">
    Erstellen Sie eine Funktion zum Ausführen von Befehlen und zum Erfassen der Ausgabe:
    ```python
    def execute_command(self, command):
        # Befehl an Bash senden
        self.process.stdin.write(command + '\n')
        self.process.stdin.flush()
        
        # Ausgabe mit Timeout erfassen
        output = self._read_output(timeout=10)
        return output
    ```
  </Step>
  <Step title="Verarbeiten Sie Claudes Tool-Aufrufe">
    Extrahieren und führen Sie Befehle aus Claudes Antworten aus:
    ```python
    for content in response.content:
        if content.type == "tool_use" and content.name == "bash":
            if content.input.get("restart"):
                bash_session.restart()
                result = "Bash session restarted"
            else:
                command = content.input.get("command")
                result = bash_session.execute_command(command)
            
            # Ergebnis an Claude zurückgeben
            tool_result = {
                "type": "tool_result",
                "tool_use_id": content.id,
                "content": result
            }
    ```
  </Step>
  <Step title="Implementieren Sie Sicherheitsmaßnahmen">
    Fügen Sie Validierung und Einschränkungen hinzu:
    ```python
    def validate_command(command):
        # Gefährliche Befehle blockieren
        dangerous_patterns = ['rm -rf /', 'format', ':(){:|:&};:']
        for pattern in dangerous_patterns:
            if pattern in command:
                return False, f"Command contains dangerous pattern: {pattern}"
        
        # Weitere Validierung nach Bedarf hinzufügen
        return True, None
    ```
  </Step>
</Steps>

### Behandeln Sie Fehler

Bei der Implementierung des Bash-Tools müssen Sie verschiedene Fehlerszenarien behandeln:

<section title="Timeout bei Befehlsausführung">

Wenn ein Befehl zu lange dauert:

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Error: Command timed out after 30 seconds",
      "is_error": true
    }
  ]
}
```

</section>

<section title="Befehl nicht gefunden">

Wenn ein Befehl nicht existiert:

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "bash: nonexistentcommand: command not found",
      "is_error": true
    }
  ]
}
```

</section>

<section title="Berechtigung verweigert">

Wenn es Berechtigungsprobleme gibt:

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "bash: /root/sensitive-file: Permission denied",
      "is_error": true
    }
  ]
}
```

</section>

### Befolgen Sie Best Practices für die Implementierung

<section title="Verwenden Sie Befehlszeitüberschreitungen">

Implementieren Sie Timeouts, um hängende Befehle zu verhindern:
```python
def execute_with_timeout(command, timeout=30):
    try:
        result = subprocess.run(
            command, 
            shell=True, 
            capture_output=True, 
            text=True, 
            timeout=timeout
        )
        return result.stdout + result.stderr
    except subprocess.TimeoutExpired:
        return f"Command timed out after {timeout} seconds"
```

</section>

<section title="Behalten Sie den Sitzungsstatus bei">

Halten Sie die Bash-Sitzung persistent, um Umgebungsvariablen und das Arbeitsverzeichnis beizubehalten:
```python
# Befehle, die in derselben Sitzung ausgeführt werden, behalten den Status bei
commands = [
    "cd /tmp",
    "echo 'Hello' > test.txt",
    "cat test.txt"  # Dies funktioniert, weil wir noch in /tmp sind
]
```

</section>

<section title="Behandeln Sie große Ausgaben">

Kürzen Sie sehr große Ausgaben, um Probleme mit Token-Limits zu vermeiden:
```python
def truncate_output(output, max_lines=100):
    lines = output.split('\n')
    if len(lines) > max_lines:
        truncated = '\n'.join(lines[:max_lines])
        return f"{truncated}\n\n... Output truncated ({len(lines)} total lines) ..."
    return output
```

</section>

<section title="Protokollieren Sie alle Befehle">

Führen Sie ein Audit-Trail ausgeführter Befehle:
```python
import logging

def log_command(command, output, user_id):
    logging.info(f"User {user_id} executed: {command}")
    logging.info(f"Output: {output[:200]}...")  # Erste 200 Zeichen protokollieren
```

</section>

<section title="Bereinigen Sie Ausgaben">

Entfernen Sie vertrauliche Informationen aus Befehlsausgaben:
```python
def sanitize_output(output):
    # Entfernen Sie potenzielle Geheimnisse oder Anmeldedaten
    import re
    # Beispiel: AWS-Anmeldedaten entfernen
    output = re.sub(r'aws_access_key_id\s*=\s*\S+', 'aws_access_key_id=***', output)
    output = re.sub(r'aws_secret_access_key\s*=\s*\S+', 'aws_secret_access_key=***', output)
    return output
```

</section>

## Sicherheit

<Warning>
Das Bash-Tool bietet direkten Systemzugriff. Implementieren Sie diese wesentlichen Sicherheitsmaßnahmen:
- Ausführung in isolierten Umgebungen (Docker/VM)
- Implementierung von Befehlsfilterung und Allowlists
- Festlegung von Ressourcenlimits (CPU, Speicher, Festplatte)
- Protokollierung aller ausgeführten Befehle
</Warning>

### Wichtige Empfehlungen
- Verwenden Sie `ulimit`, um Ressourcenbeschränkungen festzulegen
- Filtern Sie gefährliche Befehle (`sudo`, `rm -rf`, usw.)
- Führen Sie mit minimalen Benutzerberechtigungen aus
- Überwachen und protokollieren Sie alle Befehlsausführungen

## Preisgestaltung

The bash tool adds **245 input tokens** to your API calls.

Additional tokens are consumed by:
- Command outputs (stdout/stderr)
- Error messages
- Large file contents

Siehe [Tool-Use-Preisgestaltung](/docs/de/agents-and-tools/tool-use/overview#pricing) für vollständige Preisdetails.

## Häufige Muster

### Entwicklungs-Workflows
- Tests ausführen: `pytest && coverage report`
- Projekte erstellen: `npm install && npm run build`
- Git-Operationen: `git status && git add . && git commit -m "message"`

### Dateivorgänge
- Daten verarbeiten: `wc -l *.csv && ls -lh *.csv`
- Dateien durchsuchen: `find . -name "*.py" | xargs grep "pattern"`
- Sicherungen erstellen: `tar -czf backup.tar.gz ./data`

### Systemaufgaben
- Ressourcen überprüfen: `df -h && free -m`
- Prozessverwaltung: `ps aux | grep python`
- Umgebungseinrichtung: `export PATH=$PATH:/new/path && echo $PATH`

## Einschränkungen

- **Keine interaktiven Befehle**: Kann `vim`, `less` oder Passwortaufforderungen nicht verarbeiten
- **Keine GUI-Anwendungen**: Nur Befehlszeilenschnittstelle
- **Sitzungsbereich**: Bleibt innerhalb der Konversation bestehen, geht zwischen API-Aufrufen verloren
- **Ausgabelimits**: Große Ausgaben können gekürzt werden
- **Kein Streaming**: Ergebnisse werden nach Abschluss zurückgegeben

## Kombination mit anderen Tools

Das Bash-Tool ist am leistungsfähigsten, wenn es mit dem [Text-Editor](/docs/de/agents-and-tools/tool-use/text-editor-tool) und anderen Tools kombiniert wird.

## Nächste Schritte

<CardGroup cols={2}>
  <Card
    title="Tool-Use-Übersicht"
    icon="tool"
    href="/docs/de/agents-and-tools/tool-use/overview"
  >
    Erfahren Sie mehr über Tool-Use mit Claude
  </Card>

  <Card
    title="Text-Editor-Tool"
    icon="file"
    href="/docs/de/agents-and-tools/tool-use/text-editor-tool"
  >
    Anzeigen und Bearbeiten von Textdateien mit Claude
  </Card>
</CardGroup>