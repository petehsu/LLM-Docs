# MCP-Connector

Verbinden Sie sich direkt mit Remote-MCP-Servern über die Messages API ohne einen separaten MCP-Client

---

Claudes Model Context Protocol (MCP) Connector-Funktion ermöglicht es Ihnen, sich direkt von der Messages API aus mit Remote-MCP-Servern zu verbinden, ohne einen separaten MCP-Client zu implementieren.

<Note>
  **Aktuelle Version**: Diese Funktion erfordert den Beta-Header: `"anthropic-beta": "mcp-client-2025-11-20"`

  Die vorherige Version (`mcp-client-2025-04-04`) ist veraltet. Siehe die [Dokumentation der veralteten Version](#deprecated-version-mcp-client-2025-04-04) unten.
</Note>

## Wichtigste Funktionen

- **Direkte API-Integration**: Verbindung zu MCP-Servern ohne Implementierung eines MCP-Clients
- **Tool-Calling-Unterstützung**: Zugriff auf MCP-Tools über die Messages API
- **Flexible Tool-Konfiguration**: Aktivieren Sie alle Tools, erstellen Sie eine Zulassungsliste für bestimmte Tools oder eine Blockliste für unerwünschte Tools
- **Pro-Tool-Konfiguration**: Konfigurieren Sie einzelne Tools mit benutzerdefinierten Einstellungen
- **OAuth-Authentifizierung**: Unterstützung für OAuth-Bearer-Token für authentifizierte Server
- **Mehrere Server**: Verbindung zu mehreren MCP-Servern in einer einzelnen Anfrage

## Einschränkungen

- Von der Funktionsmenge der [MCP-Spezifikation](https://modelcontextprotocol.io/introduction#explore-mcp) werden derzeit nur [Tool-Aufrufe](https://modelcontextprotocol.io/docs/concepts/tools) unterstützt.
- Der Server muss öffentlich über HTTP verfügbar gemacht werden (unterstützt sowohl Streamable HTTP als auch SSE-Transporte). Lokale STDIO-Server können nicht direkt verbunden werden.
- Der MCP-Connector wird derzeit nicht auf Amazon Bedrock und Google Vertex unterstützt.

## Verwendung des MCP-Connectors in der Messages API

Der MCP-Connector verwendet zwei Komponenten:

1. **MCP-Serverdefinition** (`mcp_servers` Array): Definiert die Verbindungsdetails (URL, Authentifizierung)
2. **MCP-Toolset** (`tools` Array): Konfiguriert, welche Tools aktiviert werden und wie sie konfiguriert werden

### Grundlegendes Beispiel

Dieses Beispiel aktiviert alle Tools von einem MCP-Server mit Standardkonfiguration:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: mcp-client-2025-11-20" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1000,
    "messages": [{"role": "user", "content": "What tools do you have available?"}],
    "mcp_servers": [
      {
        "type": "url",
        "url": "https://example-server.modelcontextprotocol.io/sse",
        "name": "example-mcp",
        "authorization_token": "YOUR_TOKEN"
      }
    ],
    "tools": [
      {
        "type": "mcp_toolset",
        "mcp_server_name": "example-mcp"
      }
    ]
  }'
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1000,
  messages: [
    {
      role: "user",
      content: "What tools do you have available?",
    },
  ],
  mcp_servers: [
    {
      type: "url",
      url: "https://example-server.modelcontextprotocol.io/sse",
      name: "example-mcp",
      authorization_token: "YOUR_TOKEN",
    },
  ],
  tools: [
    {
      type: "mcp_toolset",
      mcp_server_name: "example-mcp",
    },
  ],
  betas: ["mcp-client-2025-11-20"],
});
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1000,
    messages=[{
        "role": "user",
        "content": "What tools do you have available?"
    }],
    mcp_servers=[{
        "type": "url",
        "url": "https://mcp.example.com/sse",
        "name": "example-mcp",
        "authorization_token": "YOUR_TOKEN"
    }],
    tools=[{
        "type": "mcp_toolset",
        "mcp_server_name": "example-mcp"
    }],
    betas=["mcp-client-2025-11-20"]
)
```
</CodeGroup>

## MCP-Serverkonfiguration

Jeder MCP-Server im `mcp_servers` Array definiert die Verbindungsdetails:

```json
{
  "type": "url",
  "url": "https://example-server.modelcontextprotocol.io/sse",
  "name": "example-mcp",
  "authorization_token": "YOUR_TOKEN"
}
```

### Feldbeschreibungen

| Eigenschaft | Typ | Erforderlich | Beschreibung |
|----------|------|----------|-------------|
| `type` | string | Ja | Derzeit wird nur "url" unterstützt |
| `url` | string | Ja | Die URL des MCP-Servers. Muss mit https:// beginnen |
| `name` | string | Ja | Ein eindeutiger Bezeichner für diesen MCP-Server. Muss von genau einem MCPToolset im `tools` Array referenziert werden. |
| `authorization_token` | string | Nein | OAuth-Autorisierungstoken, falls vom MCP-Server erforderlich. Siehe [MCP-Spezifikation](https://modelcontextprotocol.io/specification/2025-03-26/basic/authorization). |

## MCP-Toolset-Konfiguration

Das MCPToolset befindet sich im `tools` Array und konfiguriert, welche Tools vom MCP-Server aktiviert sind und wie sie konfiguriert werden sollten.

### Grundlegende Struktur

```json
{
  "type": "mcp_toolset",
  "mcp_server_name": "example-mcp",
  "default_config": {
    "enabled": true,
    "defer_loading": false
  },
  "configs": {
    "specific_tool_name": {
      "enabled": true,
      "defer_loading": true
    }
  }
}
```

### Feldbeschreibungen

| Eigenschaft | Typ | Erforderlich | Beschreibung |
|----------|------|----------|-------------|
| `type` | string | Ja | Muss "mcp_toolset" sein |
| `mcp_server_name` | string | Ja | Muss einem Servernamen entsprechen, der im `mcp_servers` Array definiert ist |
| `default_config` | object | Nein | Standardkonfiguration, die auf alle Tools in diesem Set angewendet wird. Einzelne Tool-Konfigurationen in `configs` überschreiben diese Standardwerte. |
| `configs` | object | Nein | Pro-Tool-Konfigurationsüberschreibungen. Schlüssel sind Tool-Namen, Werte sind Konfigurationsobjekte. |
| `cache_control` | object | Nein | Cache-Breakpoint-Konfiguration für dieses Toolset |

### Tool-Konfigurationsoptionen

Jedes Tool (ob in `default_config` oder in `configs` konfiguriert) unterstützt die folgenden Felder:

| Eigenschaft | Typ | Standard | Beschreibung |
|----------|------|---------|-------------|
| `enabled` | boolean | `true` | Ob dieses Tool aktiviert ist |
| `defer_loading` | boolean | `false` | Wenn true, wird die Tool-Beschreibung nicht anfänglich an das Modell gesendet. Wird mit [Tool Search Tool](/agents-and-tools/tool-search-tool) verwendet. |

### Konfigurationsmerging

Konfigurationswerte werden mit dieser Priorität zusammengeführt (höchste bis niedrigste):

1. Tool-spezifische Einstellungen in `configs`
2. Set-Level `default_config`
3. Systemstandards

Beispiel:

```json
{
  "type": "mcp_toolset",
  "mcp_server_name": "google-calendar-mcp",
  "default_config": {
    "defer_loading": true
  },
  "configs": {
    "search_events": {
      "enabled": false
    }
  }
}
```

Ergebnisse in:
- `search_events`: `enabled: false` (aus configs), `defer_loading: true` (aus default_config)
- Alle anderen Tools: `enabled: true` (Systemstandard), `defer_loading: true` (aus default_config)

## Häufige Konfigurationsmuster

### Aktivieren Sie alle Tools mit Standardkonfiguration

Das einfachste Muster - aktivieren Sie alle Tools von einem Server:

```json
{
  "type": "mcp_toolset",
  "mcp_server_name": "google-calendar-mcp",
}
```

### Zulassungsliste - Aktivieren Sie nur bestimmte Tools

Setzen Sie `enabled: false` als Standard, aktivieren Sie dann explizit bestimmte Tools:

```json
{
  "type": "mcp_toolset",
  "mcp_server_name": "google-calendar-mcp",
  "default_config": {
    "enabled": false
  },
  "configs": {
    "search_events": {
      "enabled": true
    },
    "create_event": {
      "enabled": true
    }
  }
}
```

### Blockliste - Deaktivieren Sie bestimmte Tools

Aktivieren Sie alle Tools standardmäßig, deaktivieren Sie dann explizit unerwünschte Tools:

```json
{
  "type": "mcp_toolset",
  "mcp_server_name": "google-calendar-mcp",
  "configs": {
    "delete_all_events": {
      "enabled": false
    },
    "share_calendar_publicly": {
      "enabled": false
    }
  }
}
```

### Gemischt - Zulassungsliste mit Pro-Tool-Konfiguration

Kombinieren Sie Zulassungslisten mit benutzerdefinierter Konfiguration für jedes Tool:

```json
{
  "type": "mcp_toolset",
  "mcp_server_name": "google-calendar-mcp",
  "default_config": {
    "enabled": false,
    "defer_loading": true
  },
  "configs": {
    "search_events": {
      "enabled": true,
      "defer_loading": false
    },
    "list_events": {
      "enabled": true
    }
  }
}
```

In diesem Beispiel:
- `search_events` ist mit `defer_loading: false` aktiviert
- `list_events` ist mit `defer_loading: true` aktiviert (geerbt von default_config)
- Alle anderen Tools sind deaktiviert

## Validierungsregeln

Die API erzwingt diese Validierungsregeln:

- **Server muss existieren**: Der `mcp_server_name` in einem MCPToolset muss einem Server entsprechen, der im `mcp_servers` Array definiert ist
- **Server muss verwendet werden**: Jeder MCP-Server, der im `mcp_servers` Array definiert ist, muss von genau einem MCPToolset referenziert werden
- **Eindeutiges Toolset pro Server**: Jeder MCP-Server kann nur von einem MCPToolset referenziert werden
- **Unbekannte Tool-Namen**: Wenn ein Tool-Name in `configs` nicht auf dem MCP-Server existiert, wird eine Backend-Warnung protokolliert, aber es wird kein Fehler zurückgegeben (MCP-Server können dynamische Tool-Verfügbarkeit haben)

## Antwort-Inhaltstypen

Wenn Claude MCP-Tools verwendet, enthält die Antwort zwei neue Content-Block-Typen:

### MCP Tool Use Block

```json
{
  "type": "mcp_tool_use",
  "id": "mcptoolu_014Q35RayjACSWkSj4X2yov1",
  "name": "echo",
  "server_name": "example-mcp",
  "input": { "param1": "value1", "param2": "value2" }
}
```

### MCP Tool Result Block

```json
{
  "type": "mcp_tool_result",
  "tool_use_id": "mcptoolu_014Q35RayjACSWkSj4X2yov1",
  "is_error": false,
  "content": [
    {
      "type": "text",
      "text": "Hello"
    }
  ]
}
```

## Mehrere MCP-Server

Sie können sich mit mehreren MCP-Servern verbinden, indem Sie mehrere Serverdefinitionen in `mcp_servers` und ein entsprechendes MCPToolset für jeden im `tools` Array einschließen:

```json
{
  "model": "claude-sonnet-4-5",
  "max_tokens": 1000,
  "messages": [
    {
      "role": "user",
      "content": "Use tools from both mcp-server-1 and mcp-server-2 to complete this task"
    }
  ],
  "mcp_servers": [
    {
      "type": "url",
      "url": "https://mcp.example1.com/sse",
      "name": "mcp-server-1",
      "authorization_token": "TOKEN1"
    },
    {
      "type": "url",
      "url": "https://mcp.example2.com/sse",
      "name": "mcp-server-2",
      "authorization_token": "TOKEN2"
    }
  ],
  "tools": [
    {
      "type": "mcp_toolset",
      "mcp_server_name": "mcp-server-1"
    },
    {
      "type": "mcp_toolset",
      "mcp_server_name": "mcp-server-2",
      "default_config": {
        "defer_loading": true
      }
    }
  ]
}
```

## Authentifizierung

Für MCP-Server, die OAuth-Authentifizierung erfordern, müssen Sie ein Zugriffstoken abrufen. Der MCP-Connector-Beta unterstützt die Übergabe eines `authorization_token`-Parameters in der MCP-Serverdefinition.
API-Verbraucher werden erwartet, den OAuth-Flow zu handhaben und das Zugriffstoken vor dem API-Aufruf zu erhalten, sowie das Token bei Bedarf zu aktualisieren.

### Abrufen eines Zugriffstokens zum Testen

Der MCP-Inspector kann Sie durch den Prozess des Abrufens eines Zugriffstokens zu Testzwecken führen.

1. Führen Sie den Inspector mit dem folgenden Befehl aus. Sie benötigen Node.js auf Ihrem Computer installiert.

   ```bash
   npx @modelcontextprotocol/inspector
   ```

2. Wählen Sie in der linken Seitenleiste für "Transport type" entweder "SSE" oder "Streamable HTTP".
3. Geben Sie die URL des MCP-Servers ein.
4. Klicken Sie im rechten Bereich auf die Schaltfläche "Open Auth Settings" nach "Need to configure authentication?".
5. Klicken Sie auf "Quick OAuth Flow" und autorisieren Sie auf dem OAuth-Bildschirm.
6. Folgen Sie den Schritten im Abschnitt "OAuth Flow Progress" des Inspectors und klicken Sie auf "Continue", bis Sie "Authentication complete" erreichen.
7. Kopieren Sie den `access_token`-Wert.
8. Fügen Sie ihn in das `authorization_token`-Feld in Ihrer MCP-Serverkonfiguration ein.

### Verwendung des Zugriffstokens

Nachdem Sie ein Zugriffstoken mit einem der oben genannten OAuth-Flows erhalten haben, können Sie es in Ihrer MCP-Serverkonfiguration verwenden:

```json
{
  "mcp_servers": [
    {
      "type": "url",
      "url": "https://example-server.modelcontextprotocol.io/sse",
      "name": "authenticated-server",
      "authorization_token": "YOUR_ACCESS_TOKEN_HERE"
    }
  ]
}
```

Detaillierte Erklärungen des OAuth-Flows finden Sie im Abschnitt [Authorization](https://modelcontextprotocol.io/docs/concepts/authentication) in der MCP-Spezifikation.

## Migrationsleitfaden

Wenn Sie den veralteten `mcp-client-2025-04-04` Beta-Header verwenden, folgen Sie diesem Leitfaden, um zur neuen Version zu migrieren.

### Wichtigste Änderungen

1. **Neuer Beta-Header**: Wechsel von `mcp-client-2025-04-04` zu `mcp-client-2025-11-20`
2. **Tool-Konfiguration verschoben**: Die Tool-Konfiguration befindet sich jetzt im `tools` Array als MCPToolset-Objekte, nicht in der MCP-Serverdefinition
3. **Flexiblere Konfiguration**: Das neue Muster unterstützt Zulassungslisten, Blocklisten und Pro-Tool-Konfiguration

### Migrationsschritte

**Vorher (veraltet):**

```json
{
  "model": "claude-sonnet-4-5",
  "max_tokens": 1000,
  "messages": [...],
  "mcp_servers": [
    {
      "type": "url",
      "url": "https://mcp.example.com/sse",
      "name": "example-mcp",
      "authorization_token": "YOUR_TOKEN",
      "tool_configuration": {
        "enabled": true,
        "allowed_tools": ["tool1", "tool2"]
      }
    }
  ]
}
```

**Nachher (aktuell):**

```json
{
  "model": "claude-sonnet-4-5",
  "max_tokens": 1000,
  "messages": [...],
  "mcp_servers": [
    {
      "type": "url",
      "url": "https://mcp.example.com/sse",
      "name": "example-mcp",
      "authorization_token": "YOUR_TOKEN"
    }
  ],
  "tools": [
    {
      "type": "mcp_toolset",
      "mcp_server_name": "example-mcp",
      "default_config": {
        "enabled": false
      },
      "configs": {
        "tool1": {
          "enabled": true
        },
        "tool2": {
          "enabled": true
        }
      }
    }
  ]
}
```

### Häufige Migrationsmuster

| Altes Muster | Neues Muster |
|-------------|-------------|
| Keine `tool_configuration` (alle Tools aktiviert) | MCPToolset ohne `default_config` oder `configs` |
| `tool_configuration.enabled: false` | MCPToolset mit `default_config.enabled: false` |
| `tool_configuration.allowed_tools: [...]` | MCPToolset mit `default_config.enabled: false` und spezifischen Tools, die in `configs` aktiviert sind |

## Veraltete Version: mcp-client-2025-04-04

<Note type="warning">
  Diese Version ist veraltet. Bitte migrieren Sie zu `mcp-client-2025-11-20` mit dem [Migrationsleitfaden](#migration-guide) oben.
</Note>

Die vorherige Version des MCP-Connectors enthielt die Tool-Konfiguration direkt in der MCP-Serverdefinition:

```json
{
  "mcp_servers": [
    {
      "type": "url",
      "url": "https://example-server.modelcontextprotocol.io/sse",
      "name": "example-mcp",
      "authorization_token": "YOUR_TOKEN",
      "tool_configuration": {
        "enabled": true,
        "allowed_tools": ["example_tool_1", "example_tool_2"]
      }
    }
  ]
}
```

### Veraltete Feldbeschreibungen

| Eigenschaft | Typ | Beschreibung |
|----------|------|-------------|
| `tool_configuration` | object | **Veraltet**: Verwenden Sie stattdessen MCPToolset im `tools` Array |
| `tool_configuration.enabled` | boolean | **Veraltet**: Verwenden Sie `default_config.enabled` in MCPToolset |
| `tool_configuration.allowed_tools` | array | **Veraltet**: Verwenden Sie das Zulassungslisten-Muster mit `configs` in MCPToolset |