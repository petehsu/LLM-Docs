# Schnellstart

Erste Schritte mit dem Python- oder TypeScript-Agent-SDK zum Erstellen von KI-Agenten, die autonom funktionieren

---

Verwenden Sie das Agent SDK, um einen KI-Agenten zu erstellen, der Ihren Code liest, Fehler findet und behebt – alles ohne manuelle Eingriffe.

**Das werden Sie tun:**
1. Ein Projekt mit dem Agent SDK einrichten
2. Eine Datei mit fehlerhaftem Code erstellen
3. Einen Agenten ausführen, der Fehler automatisch findet und behebt

## Voraussetzungen

- **Node.js 18+** oder **Python 3.10+**
- Ein **Anthropic-Konto** ([hier anmelden](https://console.anthropic.com/))

## Setup

<Steps>
  <Step title="Claude Code installieren">
    Das Agent SDK verwendet Claude Code als Runtime. Installieren Sie es für Ihre Plattform:

    <Tabs>
      <Tab title="macOS/Linux/WSL">
        ```bash
        curl -fsSL https://claude.ai/install.sh | bash
        ```
      </Tab>
      <Tab title="Homebrew">
        ```bash
        brew install --cask claude-code
        ```
      </Tab>
      <Tab title="npm">
        ```bash
        npm install -g @anthropic-ai/claude-code
        ```
      </Tab>
    </Tabs>

    Nachdem Sie Claude Code auf Ihrem Computer installiert haben, führen Sie `claude` in Ihrem Terminal aus und folgen Sie den Aufforderungen zur Authentifizierung. Das SDK verwendet diese Authentifizierung automatisch.

    <Tip>
    Weitere Informationen zur Claude Code-Installation finden Sie unter [Claude Code-Setup](https://docs.anthropic.com/de/docs/claude-code/setup).
    </Tip>
  </Step>

  <Step title="Projektordner erstellen">
    Erstellen Sie ein neues Verzeichnis für diesen Schnellstart:

    ```bash
    mkdir my-agent && cd my-agent
    ```

    Für Ihre eigenen Projekte können Sie das SDK aus jedem Ordner ausführen; es hat standardmäßig Zugriff auf Dateien in diesem Verzeichnis und seinen Unterverzeichnissen.
  </Step>

  <Step title="SDK installieren">
    Installieren Sie das Agent SDK-Paket für Ihre Sprache:

    <Tabs>
      <Tab title="TypeScript">
        ```bash
        npm install @anthropic-ai/claude-agent-sdk
        ```
      </Tab>
      <Tab title="Python (uv)">
        [uv](https://docs.astral.sh/uv/) ist ein schneller Python-Paketmanager, der virtuelle Umgebungen automatisch verwaltet:
        ```bash
        uv init && uv add claude-agent-sdk
        ```
      </Tab>
      <Tab title="Python (pip)">
        Erstellen Sie zuerst eine virtuelle Umgebung und installieren Sie dann:
        ```bash
        python3 -m venv .venv && source .venv/bin/activate
        pip3 install claude-agent-sdk
        ```
      </Tab>
    </Tabs>
  </Step>

  <Step title="API-Schlüssel festlegen">
    Wenn Sie Claude Code bereits authentifiziert haben (durch Ausführen von `claude` in Ihrem Terminal), verwendet das SDK diese Authentifizierung automatisch.

    Andernfalls benötigen Sie einen API-Schlüssel, den Sie von der [Anthropic Console](https://console.anthropic.com/) erhalten können.

    Erstellen Sie eine `.env`-Datei in Ihrem Projektverzeichnis und speichern Sie den API-Schlüssel dort:

    ```bash
    ANTHROPIC_API_KEY=your-api-key
    ```

    <Note>
    **Verwenden Sie Amazon Bedrock, Google Vertex AI oder Microsoft Azure?** Siehe die Setup-Handbücher für [Bedrock](https://code.claude.com/docs/de/amazon-bedrock), [Vertex AI](https://code.claude.com/docs/de/google-vertex-ai) oder [Azure AI Foundry](https://code.claude.com/docs/de/azure-ai-foundry).

    Sofern nicht vorher genehmigt, erlauben wir Drittentwicklern nicht, Claude.ai-Login oder Ratenlimits für ihre Produkte anzubieten, einschließlich Agenten, die auf dem Claude Agent SDK basieren. Bitte verwenden Sie stattdessen die in diesem Dokument beschriebenen API-Schlüssel-Authentifizierungsmethoden.
    </Note>
  </Step>
</Steps>

## Fehlerhafte Datei erstellen

Dieser Schnellstart führt Sie durch die Erstellung eines Agenten, der Fehler im Code finden und beheben kann. Zunächst benötigen Sie eine Datei mit einigen absichtlichen Fehlern, die der Agent beheben kann. Erstellen Sie `utils.py` im Verzeichnis `my-agent` und fügen Sie den folgenden Code ein:

```python
def calculate_average(numbers):
    total = 0
    for num in numbers:
        total += num
    return total / len(numbers)

def get_user_name(user):
    return user["name"].upper()
```

Dieser Code hat zwei Fehler:
1. `calculate_average([])` stürzt mit Division durch Null ab
2. `get_user_name(None)` stürzt mit einem TypeError ab

## Erstellen Sie einen Agenten, der Fehler findet und behebt

Erstellen Sie `agent.py`, wenn Sie das Python SDK verwenden, oder `agent.ts` für TypeScript:

<CodeGroup>
```python Python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions, AssistantMessage, ResultMessage

async def main():
    # Agentic loop: streams messages as Claude works
    async for message in query(
        prompt="Review utils.py for bugs that would cause crashes. Fix any issues you find.",
        options=ClaudeAgentOptions(
            allowed_tools=["Read", "Edit", "Glob"],  # Tools Claude can use
            permission_mode="acceptEdits"            # Auto-approve file edits
        )
    ):
        # Print human-readable output
        if isinstance(message, AssistantMessage):
            for block in message.content:
                if hasattr(block, "text"):
                    print(block.text)              # Claude's reasoning
                elif hasattr(block, "name"):
                    print(f"Tool: {block.name}")   # Tool being called
        elif isinstance(message, ResultMessage):
            print(f"Done: {message.subtype}")      # Final result

asyncio.run(main())
```

```typescript TypeScript
import { query } from "@anthropic-ai/claude-agent-sdk";

// Agentic loop: streams messages as Claude works
for await (const message of query({
  prompt: "Review utils.py for bugs that would cause crashes. Fix any issues you find.",
  options: {
    allowedTools: ["Read", "Edit", "Glob"],  // Tools Claude can use
    permissionMode: "acceptEdits"            // Auto-approve file edits
  }
})) {
  // Print human-readable output
  if (message.type === "assistant" && message.message?.content) {
    for (const block of message.message.content) {
      if ("text" in block) {
        console.log(block.text);             // Claude's reasoning
      } else if ("name" in block) {
        console.log(`Tool: ${block.name}`);  // Tool being called
      }
    }
  } else if (message.type === "result") {
    console.log(`Done: ${message.subtype}`); // Final result
  }
}
```
</CodeGroup>

Dieser Code hat drei Hauptteile:

1. **`query`**: der Haupteinstiegspunkt, der die agentic loop erstellt. Er gibt einen asynchronen Iterator zurück, daher verwenden Sie `async for`, um Nachrichten zu streamen, während Claude arbeitet. Siehe die vollständige API in der [Python](/docs/de/agent-sdk/python#query) oder [TypeScript](/docs/de/agent-sdk/typescript#query) SDK-Referenz.

2. **`prompt`**: was Sie Claude tun möchten. Claude bestimmt basierend auf der Aufgabe, welche Tools zu verwenden sind.

3. **`options`**: Konfiguration für den Agenten. Dieses Beispiel verwendet `allowedTools`, um Claude auf `Read`, `Edit` und `Glob` zu beschränken, und `permissionMode: "acceptEdits"`, um Dateiänderungen automatisch zu genehmigen. Andere Optionen umfassen `systemPrompt`, `mcpServers` und mehr. Siehe alle Optionen für [Python](/docs/de/agent-sdk/python#claudeagentoptions) oder [TypeScript](/docs/de/agent-sdk/typescript#claudeagentoptions).

Die `async for`-Schleife läuft weiter, während Claude denkt, Tools aufruft, Ergebnisse beobachtet und entscheidet, was als nächstes zu tun ist. Jede Iteration ergibt eine Nachricht: Claudes Überlegung, ein Tool-Aufruf, ein Tool-Ergebnis oder das endgültige Ergebnis. Das SDK verwaltet die Orchestrierung (Tool-Ausführung, Kontextverwaltung, Wiederholungen), sodass Sie nur den Stream verbrauchen. Die Schleife endet, wenn Claude die Aufgabe abschließt oder auf einen Fehler trifft.

Die Nachrichtenbehandlung in der Schleife filtert nach benutzerfreundlicher Ausgabe. Ohne Filterung würden Sie rohe Nachrichtenobjekte sehen, einschließlich Systeminitialisierung und internem Status, was zum Debuggen nützlich ist, aber sonst störend wirkt.

<Note>
Dieses Beispiel verwendet Streaming, um den Fortschritt in Echtzeit anzuzeigen. Wenn Sie keine Live-Ausgabe benötigen (z. B. für Hintergrundaufträge oder CI-Pipelines), können Sie alle Nachrichten auf einmal sammeln. Siehe [Streaming vs. Single-Turn-Modus](/docs/de/agent-sdk/streaming-vs-single-mode) für Details.
</Note>

### Führen Sie Ihren Agenten aus

Ihr Agent ist bereit. Führen Sie ihn mit dem folgenden Befehl aus:

<CodeGroup>
```bash Python
python3 agent.py
```

```bash TypeScript
npx tsx agent.ts
```
</CodeGroup>

Nach der Ausführung überprüfen Sie `utils.py`. Sie sehen defensiven Code, der leere Listen und Null-Benutzer verarbeitet. Ihr Agent hat autonom:

1. **Gelesen** `utils.py`, um den Code zu verstehen
2. **Analysiert** die Logik und identifiziert Grenzfälle, die zum Absturz führen würden
3. **Bearbeitet** die Datei, um ordnungsgemäße Fehlerbehandlung hinzuzufügen

Das macht das Agent SDK anders: Claude führt Tools direkt aus, anstatt Sie zu bitten, sie zu implementieren.

<Note>
Wenn Sie „Claude Code nicht gefunden" sehen, [installieren Sie Claude Code](#claude-code-installieren) und starten Sie Ihr Terminal neu. Für „API-Schlüssel nicht gefunden", [legen Sie Ihren API-Schlüssel fest](#api-schlüssel-festlegen). Siehe das [vollständige Troubleshooting-Handbuch](https://docs.anthropic.com/de/docs/claude-code/troubleshooting) für weitere Hilfe.
</Note>

### Versuchen Sie andere Prompts

Jetzt, da Ihr Agent eingerichtet ist, versuchen Sie einige verschiedene Prompts:

- `"Add docstrings to all functions in utils.py"`
- `"Add type hints to all functions in utils.py"`
- `"Create a README.md documenting the functions in utils.py"`

### Passen Sie Ihren Agenten an

Sie können das Verhalten Ihres Agenten ändern, indem Sie die Optionen ändern. Hier sind einige Beispiele:

**Fügen Sie Web-Suchfunktion hinzu:**

<CodeGroup>
```python Python
options=ClaudeAgentOptions(
    allowed_tools=["Read", "Edit", "Glob", "WebSearch"],
    permission_mode="acceptEdits"
)
```

```typescript TypeScript
options: {
  allowedTools: ["Read", "Edit", "Glob", "WebSearch"],
  permissionMode: "acceptEdits"
}
```
</CodeGroup>

**Geben Sie Claude einen benutzerdefinierten System-Prompt:**

<CodeGroup>
```python Python
options=ClaudeAgentOptions(
    allowed_tools=["Read", "Edit", "Glob"],
    permission_mode="acceptEdits",
    system_prompt="You are a senior Python developer. Always follow PEP 8 style guidelines."
)
```

```typescript TypeScript
options: {
  allowedTools: ["Read", "Edit", "Glob"],
  permissionMode: "acceptEdits",
  systemPrompt: "You are a senior Python developer. Always follow PEP 8 style guidelines."
}
```
</CodeGroup>

**Führen Sie Befehle im Terminal aus:**

<CodeGroup>
```python Python
options=ClaudeAgentOptions(
    allowed_tools=["Read", "Edit", "Glob", "Bash"],
    permission_mode="acceptEdits"
)
```

```typescript TypeScript
options: {
  allowedTools: ["Read", "Edit", "Glob", "Bash"],
  permissionMode: "acceptEdits"
}
```
</CodeGroup>

Mit aktiviertem `Bash` versuchen Sie: `"Write unit tests for utils.py, run them, and fix any failures"`

## Wichtige Konzepte

**Tools** steuern, was Ihr Agent tun kann:

| Tools | Was der Agent tun kann |
|-------|----------------------|
| `Read`, `Glob`, `Grep` | Schreibgeschützte Analyse |
| `Read`, `Edit`, `Glob` | Code analysieren und ändern |
| `Read`, `Edit`, `Bash`, `Glob`, `Grep` | Vollständige Automatisierung |

**Berechtigungsmodi** steuern, wie viel menschliche Aufsicht Sie möchten:

| Modus | Verhalten | Anwendungsfall |
|------|----------|----------|
| `acceptEdits` | Genehmigt Dateibearbeitungen automatisch, fragt nach anderen Aktionen | Vertrauenswürdige Entwicklungs-Workflows |
| `bypassPermissions` | Läuft ohne Aufforderungen | CI/CD-Pipelines, Automatisierung |
| `default` | Erfordert einen `canUseTool`-Callback zur Genehmigungsbehandlung | Benutzerdefinierte Genehmigungsabläufe |

Das obige Beispiel verwendet den `acceptEdits`-Modus, der Dateivorgänge automatisch genehmigt, damit der Agent ohne interaktive Aufforderungen ausgeführt werden kann. Wenn Sie Benutzer zur Genehmigung auffordern möchten, verwenden Sie den `default`-Modus und stellen Sie einen [`canUseTool`-Callback](/docs/de/agent-sdk/permissions#canusetool) bereit, der Benutzereingaben sammelt. Für mehr Kontrolle siehe [Berechtigungen](/docs/de/agent-sdk/permissions).

## Nächste Schritte

Jetzt, da Sie Ihren ersten Agenten erstellt haben, erfahren Sie, wie Sie seine Fähigkeiten erweitern und ihn auf Ihren Anwendungsfall zuschneiden:

- **[Berechtigungen](/docs/de/agent-sdk/permissions)**: Steuern Sie, was Ihr Agent tun kann und wann er Genehmigung benötigt
- **[Hooks](/docs/de/agent-sdk/hooks)**: Führen Sie benutzerdefinierten Code vor oder nach Tool-Aufrufen aus
- **[Sessions](/docs/de/agent-sdk/sessions)**: Erstellen Sie Multi-Turn-Agenten, die den Kontext beibehalten
- **[MCP-Server](/docs/de/agent-sdk/mcp)**: Verbinden Sie sich mit Datenbanken, Browsern, APIs und anderen externen Systemen
- **[Hosting](/docs/de/agent-sdk/hosting)**: Stellen Sie Agenten auf Docker, Cloud und CI/CD bereit
- **[Beispiel-Agenten](https://github.com/anthropics/claude-agent-sdk-demos)**: Siehe vollständige Beispiele: E-Mail-Assistent, Forschungsagent und mehr