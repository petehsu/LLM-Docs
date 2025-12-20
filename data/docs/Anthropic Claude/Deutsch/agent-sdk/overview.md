# Agent SDK Übersicht

Erstellen Sie produktive KI-Agenten mit Claude Code als Bibliothek

---

<Note>
Das Claude Code SDK wurde in das Claude Agent SDK umbenannt. Wenn Sie vom alten SDK migrieren, siehe den [Migrationsleitfaden](/docs/de/agent-sdk/migration-guide).
</Note>

Erstellen Sie KI-Agenten, die autonom Dateien lesen, Befehle ausführen, das Web durchsuchen, Code bearbeiten und vieles mehr. Das Agent SDK bietet Ihnen die gleichen Tools, den Agent-Loop und die Kontextverwaltung, die Claude Code antreiben, programmierbar in Python und TypeScript.

<CodeGroup>
```python Python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions

async def main():
    async for message in query(
        prompt="Find and fix the bug in auth.py",
        options=ClaudeAgentOptions(allowed_tools=["Read", "Edit", "Bash"])
    ):
        print(message)  # Claude reads the file, finds the bug, edits it

asyncio.run(main())
```

```typescript TypeScript
import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "Find and fix the bug in auth.py",
  options: { allowedTools: ["Read", "Edit", "Bash"] }
})) {
  console.log(message);  // Claude reads the file, finds the bug, edits it
}
```
</CodeGroup>

Das Agent SDK enthält integrierte Tools zum Lesen von Dateien, Ausführen von Befehlen und Bearbeiten von Code, sodass Ihr Agent sofort arbeiten kann, ohne dass Sie die Tool-Ausführung implementieren müssen. Tauchen Sie in den Schnellstart ein oder erkunden Sie echte Agenten, die mit dem SDK erstellt wurden:

<CardGroup cols={2}>
  <Card title="Schnellstart" icon="play" href="/docs/de/agent-sdk/quickstart">
    Erstellen Sie einen Bug-Fix-Agenten in Minuten
  </Card>
  <Card title="Beispielagenten" icon="star" href="https://github.com/anthropics/claude-agent-sdk-demos">
    E-Mail-Assistent, Forschungsagent und mehr
  </Card>
</CardGroup>

## Funktionen

Alles, was Claude Code leistungsstark macht, ist im SDK verfügbar:

<Tabs>
  <Tab title="Integrierte Tools">
    Ihr Agent kann Dateien lesen, Befehle ausführen und Codebasen sofort durchsuchen. Wichtige Tools sind:

    | Tool | Was es tut |
    |------|-----------|
    | **Read** | Lesen Sie jede Datei im Arbeitsverzeichnis |
    | **Write** | Erstellen Sie neue Dateien |
    | **Edit** | Nehmen Sie präzise Änderungen an vorhandenen Dateien vor |
    | **Bash** | Führen Sie Terminalbefehl, Skripte, Git-Operationen aus |
    | **Glob** | Suchen Sie Dateien nach Muster (`**/*.ts`, `src/**/*.py`) |
    | **Grep** | Durchsuchen Sie Dateiinhalte mit Regex |
    | **WebSearch** | Durchsuchen Sie das Web nach aktuellen Informationen |
    | **WebFetch** | Rufen Sie Webseiteninhalte ab und analysieren Sie sie |

    Dieses Beispiel erstellt einen Agenten, der Ihre Codebasis nach TODO-Kommentaren durchsucht:

    <CodeGroup>
    ```python Python
    import asyncio
    from claude_agent_sdk import query, ClaudeAgentOptions

    async def main():
        async for message in query(
            prompt="Find all TODO comments and create a summary",
            options=ClaudeAgentOptions(allowed_tools=["Read", "Glob", "Grep"])
        ):
            print(message)

    asyncio.run(main())
    ```

    ```typescript TypeScript
    import { query } from "@anthropic-ai/claude-agent-sdk";

    for await (const message of query({
      prompt: "Find all TODO comments and create a summary",
      options: { allowedTools: ["Read", "Glob", "Grep"] }
    })) {
      console.log(message);
    }
    ```
    </CodeGroup>

  </Tab>
  <Tab title="Hooks">
    Führen Sie benutzerdefinierten Code an wichtigen Punkten im Agent-Lebenszyklus aus. Hooks können Shell-Befehle oder benutzerdefinierte Skripte ausführen, um Agent-Verhalten zu validieren, zu protokollieren, zu blockieren oder zu transformieren.

    **Verfügbare Hooks:** `PreToolUse`, `PostToolUse`, `Stop`, `SessionStart`, `SessionEnd`, `UserPromptSubmit` und mehr.

    Dieses Beispiel protokolliert alle Dateiänderungen in einer Audit-Datei:

    <CodeGroup>
    ```python Python
    import asyncio
    from claude_agent_sdk import query, ClaudeAgentOptions

    async def main():
        async for message in query(
            prompt="Suggest improvements to utils.py",
            options=ClaudeAgentOptions(
                permission_mode="acceptEdits",
                hooks={
                    "PostToolUse": [{
                        "matcher": "Edit|Write",
                        "hooks": [{"type": "command", "command": "echo \"$(date): file modified\" >> ./audit.log"}]
                    }]
                }
            )
        ):
            print(message)

    asyncio.run(main())
    ```

    ```typescript TypeScript
    import { query } from "@anthropic-ai/claude-agent-sdk";

    for await (const message of query({
      prompt: "Suggest improvements to utils.py",
      options: {
        permissionMode: "acceptEdits",
        hooks: {
          PostToolUse: [{
            matcher: "Edit|Write",
            hooks: [{ type: "command", command: "echo \"$(date): file modified\" >> ./audit.log" }]
          }]
        }
      }
    })) {
      console.log(message);
    }
    ```
    </CodeGroup>

    [Weitere Informationen zu Hooks →](/docs/de/agent-sdk/hooks)
  </Tab>
  <Tab title="Subagenten">
    Spawnen Sie spezialisierte Agenten, um fokussierte Teilaufgaben zu bewältigen. Ihr Hauptagent delegiert Arbeit, und Subagenten berichten mit Ergebnissen zurück.

    Aktivieren Sie das `Task`-Tool, um Claude zu ermöglichen, Subagenten zu spawnen, wenn es entscheidet, dass eine Aufgabe komplex genug ist, um von Delegation zu profitieren. Claude bestimmt automatisch, wann Subagenten basierend auf Aufgabenkomplexität verwendet werden sollen.

    <CodeGroup>
    ```python Python
    import asyncio
    from claude_agent_sdk import query, ClaudeAgentOptions

    async def main():
        async for message in query(
            prompt="Analyze this codebase for security vulnerabilities",
            options=ClaudeAgentOptions(allowed_tools=["Read", "Glob", "Grep", "Task"])
        ):
            print(message)

    asyncio.run(main())
    ```

    ```typescript TypeScript
    import { query } from "@anthropic-ai/claude-agent-sdk";

    for await (const message of query({
      prompt: "Analyze this codebase for security vulnerabilities",
      options: {
        allowedTools: ["Read", "Glob", "Grep", "Task"]
      }
    })) {
      console.log(message);
    }
    ```
    </CodeGroup>

    Sie können auch benutzerdefinierte Agent-Typen mit der `agents`-Option für spezialisierte Delegationsmuster definieren.

    [Weitere Informationen zu Subagenten →](/docs/de/agent-sdk/subagents)
  </Tab>
  <Tab title="MCP">
    Verbinden Sie sich mit externen Systemen über das Model Context Protocol: Datenbanken, Browser, APIs und [hunderte mehr](https://github.com/modelcontextprotocol/servers).

    Dieses Beispiel verbindet den [Playwright MCP Server](https://github.com/microsoft/playwright-mcp), um Ihrem Agenten Browser-Automatisierungsfunktionen zu geben:

    <CodeGroup>
    ```python Python
    import asyncio
    from claude_agent_sdk import query, ClaudeAgentOptions

    async def main():
        async for message in query(
            prompt="Open example.com and describe what you see",
            options=ClaudeAgentOptions(
                mcp_servers={
                    "playwright": {"command": "npx", "args": ["@playwright/mcp@latest"]}
                }
            )
        ):
            print(message)

    asyncio.run(main())
    ```

    ```typescript TypeScript
    import { query } from "@anthropic-ai/claude-agent-sdk";

    for await (const message of query({
      prompt: "Open example.com and describe what you see",
      options: {
        mcpServers: {
          playwright: { command: "npx", args: ["@playwright/mcp@latest"] }
        }
      }
    })) {
      console.log(message);
    }
    ```
    </CodeGroup>

    [Weitere Informationen zu MCP →](/docs/de/agent-sdk/mcp)
  </Tab>
  <Tab title="Berechtigungen">
    Kontrollieren Sie genau, welche Tools Ihr Agent verwenden kann. Erlauben Sie sichere Operationen, blockieren Sie gefährliche oder erfordern Sie Genehmigung für sensible Aktionen.

    Dieses Beispiel erstellt einen schreibgeschützten Agenten, der Code analysieren, aber nicht ändern kann:

    <CodeGroup>
    ```python Python
    import asyncio
    from claude_agent_sdk import query, ClaudeAgentOptions

    async def main():
        async for message in query(
            prompt="Review this code for best practices",
            options=ClaudeAgentOptions(
                allowed_tools=["Read", "Glob", "Grep"],
                permission_mode="bypassPermissions"
            )
        ):
            print(message)

    asyncio.run(main())
    ```

    ```typescript TypeScript
    import { query } from "@anthropic-ai/claude-agent-sdk";

    for await (const message of query({
      prompt: "Review this code for best practices",
      options: {
        allowedTools: ["Read", "Glob", "Grep"],
        permissionMode: "bypassPermissions"
      }
    })) {
      console.log(message);
    }
    ```
    </CodeGroup>

    [Weitere Informationen zu Berechtigungen →](/docs/de/agent-sdk/permissions)
  </Tab>
  <Tab title="Sitzungen">
    Behalten Sie den Kontext über mehrere Austausche hinweg. Claude merkt sich gelesene Dateien, durchgeführte Analysen und Gesprächsverlauf. Setzen Sie Sitzungen später fort oder teilen Sie sie auf, um verschiedene Ansätze zu erkunden.

    Dieses Beispiel erfasst die Sitzungs-ID aus der ersten Abfrage und setzt dann fort, um mit vollem Kontext fortzufahren:

    <CodeGroup>
    ```python Python
    import asyncio
    from claude_agent_sdk import query, ClaudeAgentOptions

    async def main():
        session_id = None

        # First query: capture the session ID
        async for message in query(
            prompt="Read the authentication module",
            options=ClaudeAgentOptions(allowed_tools=["Read", "Glob"])
        ):
            if hasattr(message, 'subtype') and message.subtype == 'init':
                session_id = message.data.get('session_id')

        # Resume with full context from the first query
        async for message in query(
            prompt="Now find all places that call it",  # "it" = auth module
            options=ClaudeAgentOptions(resume=session_id)
        ):
            pass

    asyncio.run(main())
    ```

    ```typescript TypeScript
    import { query } from "@anthropic-ai/claude-agent-sdk";

    let sessionId: string | undefined;

    // First query: capture the session ID
    for await (const message of query({
      prompt: "Read the authentication module",
      options: { allowedTools: ["Read", "Glob"] }
    })) {
      if (message.type === "system" && message.subtype === "init") {
        sessionId = message.session_id;
      }
    }

    // Resume with full context from the first query
    for await (const message of query({
      prompt: "Now find all places that call it",  // "it" = auth module
      options: { resume: sessionId }
    })) {
      // Process messages...
    }
    ```
    </CodeGroup>

    [Weitere Informationen zu Sitzungen →](/docs/de/agent-sdk/sessions)
  </Tab>
</Tabs>

### Claude Code Funktionen

Das SDK unterstützt auch die dateisystembasierte Konfiguration von Claude Code. Um diese Funktionen zu verwenden, setzen Sie `setting_sources=["project"]` (Python) oder `settingSources: ['project']` (TypeScript) in Ihren Optionen.

| Funktion | Beschreibung | Ort |
|---------|-------------|-----|
| [Skills](/docs/de/agent-sdk/skills) | Spezialisierte Funktionen, die in Markdown definiert sind | `.claude/skills/SKILL.md` |
| [Slash-Befehle](/docs/de/agent-sdk/slash-commands) | Benutzerdefinierte Befehle für häufige Aufgaben | `.claude/commands/*.md` |
| [Speicher](/docs/de/agent-sdk/modifying-system-prompts) | Projektkontext und Anweisungen | `CLAUDE.md` oder `.claude/CLAUDE.md` |
| [Plugins](/docs/de/agent-sdk/plugins) | Erweitern Sie mit benutzerdefinierten Befehlen, Agenten und MCP-Servern | Programmgesteuert über `plugins`-Option |

## Erste Schritte

<Steps>
  <Step title="Installieren Sie Claude Code">
    Das SDK verwendet Claude Code als seine Laufzeit:

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

    Siehe [Claude Code Setup](https://docs.anthropic.com/en/docs/claude-code/setup) für Windows und andere Optionen.
  </Step>
  <Step title="Installieren Sie das SDK">
    <Tabs>
      <Tab title="TypeScript">
        ```bash
        npm install @anthropic-ai/claude-agent-sdk
        ```
      </Tab>
      <Tab title="Python">
        ```bash
        pip install claude-agent-sdk
        ```
      </Tab>
    </Tabs>
  </Step>
  <Step title="Legen Sie Ihren API-Schlüssel fest">
    ```bash
    export ANTHROPIC_API_KEY=your-api-key
    ```
    Holen Sie sich Ihren Schlüssel von der [Konsole](https://console.anthropic.com/).

    Das SDK unterstützt auch Authentifizierung über Drittanbieter-API-Anbieter:

    - **Amazon Bedrock**: Setzen Sie die Umgebungsvariable `CLAUDE_CODE_USE_BEDROCK=1` und konfigurieren Sie AWS-Anmeldedaten
    - **Google Vertex AI**: Setzen Sie die Umgebungsvariable `CLAUDE_CODE_USE_VERTEX=1` und konfigurieren Sie Google Cloud-Anmeldedaten
    - **Microsoft Foundry**: Setzen Sie die Umgebungsvariable `CLAUDE_CODE_USE_FOUNDRY=1` und konfigurieren Sie Azure-Anmeldedaten

    <Note>
    Sofern nicht vorher genehmigt, erlauben wir Drittanbieter-Entwicklern nicht, Claude.ai-Anmeldung oder Ratenlimits für ihre Produkte anzubieten, einschließlich Agenten, die auf dem Claude Agent SDK basieren. Verwenden Sie stattdessen die in diesem Dokument beschriebenen API-Schlüssel-Authentifizierungsmethoden.
    </Note>
  </Step>
  <Step title="Führen Sie Ihren ersten Agenten aus">
    Dieses Beispiel erstellt einen Agenten, der Dateien in Ihrem aktuellen Verzeichnis mit integrierten Tools auflistet.

    <CodeGroup>
    ```python Python
    import asyncio
    from claude_agent_sdk import query, ClaudeAgentOptions

    async def main():
        async for message in query(
            prompt="What files are in this directory?",
            options=ClaudeAgentOptions(allowed_tools=["Bash", "Glob"])
        ):
            print(message)

    asyncio.run(main())
    ```

    ```typescript TypeScript
    import { query } from "@anthropic-ai/claude-agent-sdk";

    for await (const message of query({
      prompt: "What files are in this directory?",
      options: { allowedTools: ["Bash", "Glob"] },
    })) {
      console.log(message);
    }
    ```
    </CodeGroup>
  </Step>
</Steps>

**Bereit zum Bauen?** Folgen Sie dem [Schnellstart](/docs/de/agent-sdk/quickstart), um einen Agenten zu erstellen, der Bugs in Minuten findet und behebt.

## Vergleichen Sie das Agent SDK mit anderen Claude-Tools

Die Claude-Plattform bietet mehrere Möglichkeiten, mit Claude zu bauen. So passt das Agent SDK ein:

<Tabs>
  <Tab title="Agent SDK vs Client SDK">
    Das [Anthropic Client SDK](/docs/de/api/client-sdks) gibt Ihnen direkten API-Zugriff: Sie senden Prompts und implementieren die Tool-Ausführung selbst. Das **Agent SDK** gibt Ihnen Claude mit integrierter Tool-Ausführung.

    Mit dem Client SDK implementieren Sie einen Tool-Loop. Mit dem Agent SDK handhabt Claude es:

    <CodeGroup>
    ```python Python
    # Client SDK: You implement the tool loop
    response = client.messages.create(...)
    while response.stop_reason == "tool_use":
        result = your_tool_executor(response.tool_use)
        response = client.messages.create(tool_result=result, ...)

    # Agent SDK: Claude handles tools autonomously
    async for message in query(prompt="Fix the bug in auth.py"):
        print(message)
    ```

    ```typescript TypeScript
    // Client SDK: You implement the tool loop
    let response = await client.messages.create({...});
    while (response.stop_reason === "tool_use") {
      const result = yourToolExecutor(response.tool_use);
      response = await client.messages.create({ tool_result: result, ... });
    }

    // Agent SDK: Claude handles tools autonomously
    for await (const message of query({ prompt: "Fix the bug in auth.py" })) {
      console.log(message);
    }
    ```
    </CodeGroup>
  </Tab>
  <Tab title="Agent SDK vs Claude Code CLI">
    Gleiche Funktionen, andere Schnittstelle:

    | Anwendungsfall | Beste Wahl |
    |----------|-------------|
    | Interaktive Entwicklung | CLI |
    | CI/CD-Pipelines | SDK |
    | Benutzerdefinierte Anwendungen | SDK |
    | Einmalige Aufgaben | CLI |
    | Produktionsautomation | SDK |

    Viele Teams verwenden beide: CLI für die tägliche Entwicklung, SDK für die Produktion. Workflows lassen sich direkt zwischen ihnen übersetzen.
  </Tab>
</Tabs>

## Änderungsprotokoll

Sehen Sie sich das vollständige Änderungsprotokoll für SDK-Updates, Fehlerbehebungen und neue Funktionen an:

- **TypeScript SDK**: [CHANGELOG.md anzeigen](https://github.com/anthropics/claude-agent-sdk-typescript/blob/main/CHANGELOG.md)
- **Python SDK**: [CHANGELOG.md anzeigen](https://github.com/anthropics/claude-agent-sdk-python/blob/main/CHANGELOG.md)

## Fehler melden

Wenn Sie auf Fehler oder Probleme mit dem Agent SDK stoßen:

- **TypeScript SDK**: [Probleme auf GitHub melden](https://github.com/anthropics/claude-agent-sdk-typescript/issues)
- **Python SDK**: [Probleme auf GitHub melden](https://github.com/anthropics/claude-agent-sdk-python/issues)

## Branding-Richtlinien

Für Partner, die das Claude Agent SDK integrieren, ist die Verwendung von Claude-Branding optional. Wenn Sie Claude in Ihrem Produkt referenzieren:

**Erlaubt:**
- "Claude Agent" (bevorzugt für Dropdown-Menüs)
- "Claude" (wenn bereits in einem Menü mit der Bezeichnung "Agents")
- "{YourAgentName} Powered by Claude" (wenn Sie einen vorhandenen Agent-Namen haben)

**Nicht erlaubt:**
- "Claude Code" oder "Claude Code Agent"
- Claude Code-Branding ASCII-Art oder visuelle Elemente, die Claude Code nachahmen

Ihr Produkt sollte sein eigenes Branding beibehalten und nicht wie Claude Code oder ein anderes Anthropic-Produkt aussehen. Für Fragen zur Branding-Compliance kontaktieren Sie unser [Vertriebsteam](https://www.anthropic.com/contact-sales).

## Lizenz und Bedingungen

Die Verwendung des Claude Agent SDK unterliegt den [Geschäftsbedingungen von Anthropic](https://www.anthropic.com/legal/commercial-terms), auch wenn Sie es verwenden, um Produkte und Dienstleistungen bereitzustellen, die Sie Ihren eigenen Kunden und Endbenutzern zur Verfügung stellen, außer insofern ein bestimmter Komponente oder Abhängigkeit unter einer anderen Lizenz abgedeckt ist, wie in der LICENSE-Datei dieser Komponente angegeben.

## Nächste Schritte

<CardGroup cols={2}>
  <Card title="Schnellstart" icon="play" href="/docs/de/agent-sdk/quickstart">
    Erstellen Sie einen Agenten, der Bugs in Minuten findet und behebt
  </Card>
  <Card title="Beispielagenten" icon="star" href="https://github.com/anthropics/claude-agent-sdk-demos">
    E-Mail-Assistent, Forschungsagent und mehr
  </Card>
  <Card title="TypeScript SDK" icon="code" href="/docs/de/agent-sdk/typescript">
    Vollständige TypeScript-API-Referenz und Beispiele
  </Card>
  <Card title="Python SDK" icon="code" href="/docs/de/agent-sdk/python">
    Vollständige Python-API-Referenz und Beispiele
  </Card>
</CardGroup>