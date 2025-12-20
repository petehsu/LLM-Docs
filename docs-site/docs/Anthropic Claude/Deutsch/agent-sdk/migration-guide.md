# Zu Claude Agent SDK migrieren

Anleitung zur Migration der Claude Code TypeScript- und Python-SDKs zum Claude Agent SDK

---

## Übersicht

Das Claude Code SDK wurde in das **Claude Agent SDK** umbenannt und seine Dokumentation wurde neu organisiert. Diese Änderung spiegelt die umfassenderen Fähigkeiten des SDK für die Erstellung von KI-Agenten wider, die über reine Codierungsaufgaben hinausgehen.

## Was hat sich geändert

| Aspekt                   | Alt                         | Neu                              |
| :----------------------- | :-------------------------- | :------------------------------- |
| **Paketname (TS/JS)** | `@anthropic-ai/claude-code` | `@anthropic-ai/claude-agent-sdk` |
| **Python-Paket**       | `claude-code-sdk`           | `claude-agent-sdk`               |
| **Dokumentationsort** | Claude Code-Dokumentation | API-Anleitung → Agent SDK-Bereich |

<Note>
**Dokumentationsänderungen:** Die Agent SDK-Dokumentation wurde von der Claude Code-Dokumentation zur API-Anleitung unter einem dedizierten [Agent SDK](/docs/de/agent-sdk/overview)-Bereich verschoben. Die Claude Code-Dokumentation konzentriert sich nun auf das CLI-Tool und Automatisierungsfunktionen.
</Note>

## Migrationsschritte

### Für TypeScript/JavaScript-Projekte

**1. Deinstallieren Sie das alte Paket:**

```bash
npm uninstall @anthropic-ai/claude-code
```

**2. Installieren Sie das neue Paket:**

```bash
npm install @anthropic-ai/claude-agent-sdk
```

**3. Aktualisieren Sie Ihre Importe:**

Ändern Sie alle Importe von `@anthropic-ai/claude-code` zu `@anthropic-ai/claude-agent-sdk`:

```typescript
// Vorher
import { query, tool, createSdkMcpServer } from "@anthropic-ai/claude-code";

// Nachher
import {
  query,
  tool,
  createSdkMcpServer,
} from "@anthropic-ai/claude-agent-sdk";
```

**4. Aktualisieren Sie die package.json-Abhängigkeiten:**

Wenn Sie das Paket in Ihrer `package.json` aufgelistet haben, aktualisieren Sie es:

```json
// Vorher
{
  "dependencies": {
    "@anthropic-ai/claude-code": "^1.0.0"
  }
}

// Nachher
{
  "dependencies": {
    "@anthropic-ai/claude-agent-sdk": "^0.1.0"
  }
}
```

Das ist alles! Keine weiteren Codeänderungen sind erforderlich.

### Für Python-Projekte

**1. Deinstallieren Sie das alte Paket:**

```bash
pip uninstall claude-code-sdk
```

**2. Installieren Sie das neue Paket:**

```bash
pip install claude-agent-sdk
```

**3. Aktualisieren Sie Ihre Importe:**

Ändern Sie alle Importe von `claude_code_sdk` zu `claude_agent_sdk`:

```python
# Vorher
from claude_code_sdk import query, ClaudeCodeOptions

# Nachher
from claude_agent_sdk import query, ClaudeAgentOptions
```

**4. Aktualisieren Sie die Typnamen:**

Ändern Sie `ClaudeCodeOptions` zu `ClaudeAgentOptions`:

```python
# Vorher
from claude_agent_sdk import query, ClaudeCodeOptions

options = ClaudeCodeOptions(
    model="claude-sonnet-4-5"
)

# Nachher
from claude_agent_sdk import query, ClaudeAgentOptions

options = ClaudeAgentOptions(
    model="claude-sonnet-4-5"
)
```

**5. Überprüfen Sie [Breaking Changes](#breaking-changes)**

Nehmen Sie alle erforderlichen Codeänderungen vor, um die Migration abzuschließen.

## Breaking Changes

<Warning>
Um die Isolation und explizite Konfiguration zu verbessern, führt Claude Agent SDK v0.1.0 Breaking Changes für Benutzer ein, die vom Claude Code SDK migrieren. Überprüfen Sie diesen Abschnitt sorgfältig vor der Migration.
</Warning>

### Python: ClaudeCodeOptions in ClaudeAgentOptions umbenannt

**Was hat sich geändert:** Der Python SDK-Typ `ClaudeCodeOptions` wurde in `ClaudeAgentOptions` umbenannt.

**Migration:**

```python
# VORHER (v0.0.x)
from claude_agent_sdk import query, ClaudeCodeOptions

options = ClaudeCodeOptions(
    model="claude-sonnet-4-5",
    permission_mode="acceptEdits"
)

# NACHHER (v0.1.0)
from claude_agent_sdk import query, ClaudeAgentOptions

options = ClaudeAgentOptions(
    model="claude-sonnet-4-5",
    permission_mode="acceptEdits"
)
```

**Warum sich das geändert hat:** Der Typname entspricht nun der Marke "Claude Agent SDK" und bietet Konsistenz in den Namenskonventionen des SDK.

### System-Prompt ist nicht mehr Standard

**Was hat sich geändert:** Das SDK verwendet nicht mehr standardmäßig den System-Prompt von Claude Code.

**Migration:**

<CodeGroup>

```typescript TypeScript
// VORHER (v0.0.x) - Verwendete standardmäßig Claude Code's System-Prompt
const result = query({ prompt: "Hello" });

// NACHHER (v0.1.0) - Verwendet standardmäßig einen leeren System-Prompt
// Um das alte Verhalten zu erhalten, fordern Sie explizit Claude Code's Voreinstellung an:
const result = query({
  prompt: "Hello",
  options: {
    systemPrompt: { type: "preset", preset: "claude_code" }
  }
});

// Oder verwenden Sie einen benutzerdefinierten System-Prompt:
const result = query({
  prompt: "Hello",
  options: {
    systemPrompt: "You are a helpful coding assistant"
  }
});
```

```python Python
# VORHER (v0.0.x) - Verwendete standardmäßig Claude Code's System-Prompt
async for message in query(prompt="Hello"):
    print(message)

# NACHHER (v0.1.0) - Verwendet standardmäßig einen leeren System-Prompt
# Um das alte Verhalten zu erhalten, fordern Sie explizit Claude Code's Voreinstellung an:
from claude_agent_sdk import query, ClaudeAgentOptions

async for message in query(
    prompt="Hello",
    options=ClaudeAgentOptions(
        system_prompt={"type": "preset", "preset": "claude_code"}  # Verwenden Sie die Voreinstellung
    )
):
    print(message)

# Oder verwenden Sie einen benutzerdefinierten System-Prompt:
async for message in query(
    prompt="Hello",
    options=ClaudeAgentOptions(
        system_prompt="You are a helpful coding assistant"
    )
):
    print(message)
```

</CodeGroup>

**Warum sich das geändert hat:** Bietet bessere Kontrolle und Isolation für SDK-Anwendungen. Sie können nun Agenten mit benutzerdefiniertem Verhalten erstellen, ohne die CLI-fokussierten Anweisungen von Claude Code zu erben.

### Einstellungsquellen werden nicht mehr standardmäßig geladen

**Was hat sich geändert:** Das SDK liest nicht mehr standardmäßig aus Dateisystem-Einstellungen (CLAUDE.md, settings.json, Schrägstrich-Befehle usw.).

**Migration:**

<CodeGroup>

```typescript TypeScript
// VORHER (v0.0.x) - Lud alle Einstellungen automatisch
const result = query({ prompt: "Hello" });
// Würde lesen aus:
// - ~/.claude/settings.json (Benutzer)
// - .claude/settings.json (Projekt)
// - .claude/settings.local.json (lokal)
// - CLAUDE.md-Dateien
// - Benutzerdefinierte Schrägstrich-Befehle

// NACHHER (v0.1.0) - Keine Einstellungen standardmäßig geladen
// Um das alte Verhalten zu erhalten:
const result = query({
  prompt: "Hello",
  options: {
    settingSources: ["user", "project", "local"]
  }
});

// Oder laden Sie nur bestimmte Quellen:
const result = query({
  prompt: "Hello",
  options: {
    settingSources: ["project"]  // Nur Projekteinstellungen
  }
});
```

```python Python
# VORHER (v0.0.x) - Lud alle Einstellungen automatisch
async for message in query(prompt="Hello"):
    print(message)
# Würde lesen aus:
# - ~/.claude/settings.json (Benutzer)
# - .claude/settings.json (Projekt)
# - .claude/settings.local.json (lokal)
# - CLAUDE.md-Dateien
# - Benutzerdefinierte Schrägstrich-Befehle

# NACHHER (v0.1.0) - Keine Einstellungen standardmäßig geladen
# Um das alte Verhalten zu erhalten:
from claude_agent_sdk import query, ClaudeAgentOptions

async for message in query(
    prompt="Hello",
    options=ClaudeAgentOptions(
        setting_sources=["user", "project", "local"]
    )
):
    print(message)

# Oder laden Sie nur bestimmte Quellen:
async for message in query(
    prompt="Hello",
    options=ClaudeAgentOptions(
        setting_sources=["project"]  # Nur Projekteinstellungen
    )
):
    print(message)
```

</CodeGroup>

**Warum sich das geändert hat:** Stellt sicher, dass SDK-Anwendungen ein vorhersehbares Verhalten unabhängig von lokalen Dateisystem-Konfigurationen haben. Dies ist besonders wichtig für:
- **CI/CD-Umgebungen** - Konsistentes Verhalten ohne lokale Anpassungen
- **Bereitgestellte Anwendungen** - Keine Abhängigkeit von Dateisystem-Einstellungen
- **Tests** - Isolierte Testumgebungen
- **Multi-Tenant-Systeme** - Verhinderung von Einstellungslecks zwischen Benutzern

<Note>
**Rückwärtskompatibilität:** Wenn Ihre Anwendung auf Dateisystem-Einstellungen angewiesen war (benutzerdefinierte Schrägstrich-Befehle, CLAUDE.md-Anweisungen usw.), fügen Sie `settingSources: ['user', 'project', 'local']` zu Ihren Optionen hinzu.
</Note>

## Warum die Umbenennung?

Das Claude Code SDK wurde ursprünglich für Codierungsaufgaben entwickelt, hat sich aber zu einem leistungsstarken Framework für die Erstellung aller Arten von KI-Agenten entwickelt. Der neue Name "Claude Agent SDK" spiegelt seine Fähigkeiten besser wider:

- Erstellung von Business-Agenten (Rechtsassistenten, Finanzberater, Kundensupport)
- Erstellung spezialisierter Codierungs-Agenten (SRE-Bots, Sicherheitsprüfer, Code-Review-Agenten)
- Entwicklung benutzerdefinierter Agenten für jede Domäne mit Tool-Nutzung, MCP-Integration und mehr

## Hilfe erhalten

Wenn Sie während der Migration auf Probleme stoßen:

**Für TypeScript/JavaScript:**

1. Überprüfen Sie, dass alle Importe aktualisiert wurden, um `@anthropic-ai/claude-agent-sdk` zu verwenden
2. Überprüfen Sie, dass Ihre package.json den neuen Paketnamen hat
3. Führen Sie `npm install` aus, um sicherzustellen, dass die Abhängigkeiten aktualisiert werden

**Für Python:**

1. Überprüfen Sie, dass alle Importe aktualisiert wurden, um `claude_agent_sdk` zu verwenden
2. Überprüfen Sie, dass Ihre requirements.txt oder pyproject.toml den neuen Paketnamen hat
3. Führen Sie `pip install claude-agent-sdk` aus, um sicherzustellen, dass das Paket installiert ist

## Nächste Schritte

- Erkunden Sie die [Agent SDK-Übersicht](/docs/de/agent-sdk/overview), um mehr über verfügbare Funktionen zu erfahren
- Schauen Sie sich die [TypeScript SDK-Referenz](/docs/de/agent-sdk/typescript) für detaillierte API-Dokumentation an
- Überprüfen Sie die [Python SDK-Referenz](/docs/de/agent-sdk/python) für Python-spezifische Dokumentation
- Erfahren Sie mehr über [Benutzerdefinierte Tools](/docs/de/agent-sdk/custom-tools) und [MCP-Integration](/docs/de/agent-sdk/mcp)