# Programmatischer Tool-Aufruf

Claude kann Code schreiben, der Tools programmatisch innerhalb eines Code-Ausführungs-Containers aufruft, anstatt mehrere Roundtrips durch das Modell zu erfordern.

---

Programmatischer Tool-Aufruf ermöglicht es Claude, Code zu schreiben, der Ihre Tools programmatisch innerhalb eines [Code-Ausführungs](/docs/de/agents-and-tools/tool-use/code-execution-tool)-Containers aufruft, anstatt mehrere Roundtrips durch das Modell für jeden Tool-Aufruf zu erfordern. Dies reduziert die Latenz für Multi-Tool-Workflows und verringert den Token-Verbrauch, indem Claude Daten filtern oder verarbeiten kann, bevor sie das Kontextfenster des Modells erreichen.

<Note>
Programmatischer Tool-Aufruf befindet sich derzeit in der öffentlichen Beta.

Um diese Funktion zu nutzen, fügen Sie den `"advanced-tool-use-2025-11-20"` [Beta-Header](/docs/de/api/beta-headers) zu Ihren API-Anfragen hinzu.

Diese Funktion erfordert, dass das Code-Ausführungs-Tool aktiviert ist.
</Note>

## Modellkompatibilität

Programmatischer Tool-Aufruf ist auf den folgenden Modellen verfügbar:

| Modell | Tool-Version |
|-------|--------------|
| Claude Opus 4.5 (`claude-opus-4-5-20251101`) | `code_execution_20250825` |
| Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`) | `code_execution_20250825` |

<Warning>
Programmatischer Tool-Aufruf ist über die Claude API und Microsoft Foundry verfügbar.
</Warning>

## Schnellstart

Hier ist ein einfaches Beispiel, bei dem Claude programmatisch mehrmals eine Datenbank abfragt und Ergebnisse aggregiert:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: advanced-tool-use-2025-11-20" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": "Query sales data for the West, East, and Central regions, then tell me which region had the highest revenue"
            }
        ],
        "tools": [
            {
                "type": "code_execution_20250825",
                "name": "code_execution"
            },
            {
                "name": "query_database",
                "description": "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "sql": {
                            "type": "string",
                            "description": "SQL query to execute"
                        }
                    },
                    "required": ["sql"]
                },
                "allowed_callers": ["code_execution_20250825"]
            }
        ]
    }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Query sales data for the West, East, and Central regions, then tell me which region had the highest revenue"
    }],
    tools=[
        {
            "type": "code_execution_20250825",
            "name": "code_execution"
        },
        {
            "name": "query_database",
            "description": "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
            "input_schema": {
                "type": "object",
                "properties": {
                    "sql": {
                        "type": "string",
                        "description": "SQL query to execute"
                    }
                },
                "required": ["sql"]
            },
            "allowed_callers": ["code_execution_20250825"]
        }
    ]
)

print(response)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

async function main() {
  const response = await anthropic.beta.messages.create({
    model: "claude-sonnet-4-5",
    betas: ["advanced-tool-use-2025-11-20"],
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: "Query sales data for the West, East, and Central regions, then tell me which region had the highest revenue"
      }
    ],
    tools: [
      {
        type: "code_execution_20250825",
        name: "code_execution"
      },
      {
        name: "query_database",
        description: "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
        input_schema: {
          type: "object",
          properties: {
            sql: {
              type: "string",
              description: "SQL query to execute"
            }
          },
          required: ["sql"]
        },
        allowed_callers: ["code_execution_20250825"]
      }
    ]
  });

  console.log(response);
}

main().catch(console.error);
```
</CodeGroup>

## Wie programmatischer Tool-Aufruf funktioniert

Wenn Sie ein Tool so konfigurieren, dass es von der Code-Ausführung aufgerufen werden kann, und Claude beschließt, dieses Tool zu verwenden:

1. Claude schreibt Python-Code, der das Tool als Funktion aufruft, möglicherweise mit mehreren Tool-Aufrufen und Vor-/Nachverarbeitungslogik
2. Claude führt diesen Code in einem Sandbox-Container über Code-Ausführung aus
3. Wenn eine Tool-Funktion aufgerufen wird, pausiert die Code-Ausführung und die API gibt einen `tool_use`-Block zurück
4. Sie stellen das Tool-Ergebnis bereit, und die Code-Ausführung wird fortgesetzt (Zwischenergebnisse werden nicht in Claudes Kontextfenster geladen)
5. Sobald die gesamte Code-Ausführung abgeschlossen ist, erhält Claude die endgültige Ausgabe und setzt die Arbeit an der Aufgabe fort

Dieser Ansatz ist besonders nützlich für:
- **Große Datenverarbeitung**: Filtern oder aggregieren Sie Tool-Ergebnisse, bevor sie Claudes Kontext erreichen
- **Multi-Schritt-Workflows**: Sparen Sie Token und Latenz, indem Sie Tools nacheinander oder in einer Schleife aufrufen, ohne Claude zwischen Tool-Aufrufen zu samplen
- **Bedingte Logik**: Treffen Sie Entscheidungen basierend auf Zwischenergebnissen von Tools

<Note>
Benutzerdefinierte Tools werden in asynchrone Python-Funktionen konvertiert, um parallele Tool-Aufrufe zu unterstützen. Wenn Claude Code schreibt, der Ihre Tools aufruft, verwendet es `await` (z. B. `result = await query_database("<sql>")`) und fügt automatisch die entsprechende asynchrone Wrapper-Funktion ein.

Die asynchrone Wrapper wird in den Code-Beispielen in dieser Dokumentation aus Gründen der Klarheit weggelassen.
</Note>

## Kernkonzepte

### Das Feld `allowed_callers`

Das Feld `allowed_callers` gibt an, welche Kontexte ein Tool aufrufen können:

```json
{
  "name": "query_database",
  "description": "Execute a SQL query against the database",
  "input_schema": {...},
  "allowed_callers": ["code_execution_20250825"]
}
```

**Mögliche Werte:**
- `["direct"]` - Nur Claude kann dieses Tool direkt aufrufen (Standard, wenn weggelassen)
- `["code_execution_20250825"]` - Nur von innerhalb der Code-Ausführung aufrufbar
- `["direct", "code_execution_20250825"]` - Von direkt und von Code-Ausführung aufrufbar

<Tip>
Wir empfehlen, für jedes Tool entweder `["direct"]` oder `["code_execution_20250825"]` zu wählen, anstatt beide zu aktivieren, da dies Claude eine klarere Anleitung gibt, wie das Tool am besten verwendet wird.
</Tip>

### Das Feld `caller` in Antworten

Jeder Tool-Use-Block enthält ein Feld `caller`, das angibt, wie es aufgerufen wurde:

**Direkter Aufruf (traditionelle Tool-Verwendung):**
```json
{
  "type": "tool_use",
  "id": "toolu_abc123",
  "name": "query_database",
  "input": {"sql": "<sql>"},
  "caller": {"type": "direct"}
}
```

**Programmatischer Aufruf:**
```json
{
  "type": "tool_use",
  "id": "toolu_xyz789",
  "name": "query_database",
  "input": {"sql": "<sql>"},
  "caller": {
    "type": "code_execution_20250825",
    "tool_id": "srvtoolu_abc123"
  }
}
```

Die `tool_id` verweist auf das Code-Ausführungs-Tool, das den programmatischen Aufruf getätigt hat.

### Container-Lebenszyklus

Programmatischer Tool-Aufruf verwendet die gleichen Container wie Code-Ausführung:

- **Container-Erstellung**: Ein neuer Container wird für jede Sitzung erstellt, es sei denn, Sie verwenden einen vorhandenen erneut
- **Ablauf**: Container laufen nach etwa 4,5 Minuten Inaktivität ab (kann sich ändern)
- **Container-ID**: Wird in Antworten über das Feld `container` zurückgegeben
- **Wiederverwendung**: Übergeben Sie die Container-ID, um den Status über Anfragen hinweg beizubehalten

<Warning>
Wenn ein Tool programmatisch aufgerufen wird und der Container auf Ihr Tool-Ergebnis wartet, müssen Sie antworten, bevor der Container abläuft. Überwachen Sie das Feld `expires_at`. Wenn der Container abläuft, kann Claude den Tool-Aufruf als Timeout behandeln und ihn erneut versuchen.
</Warning>

## Beispiel-Workflow

Hier ist ein Beispiel für einen vollständigen programmatischen Tool-Aufruf-Ablauf:

### Schritt 1: Anfängliche Anfrage

Senden Sie eine Anfrage mit Code-Ausführung und einem Tool, das programmatische Aufrufe ermöglicht. Um programmatische Aufrufe zu aktivieren, fügen Sie das Feld `allowed_callers` zu Ihrer Tool-Definition hinzu.

<Note>
Geben Sie detaillierte Beschreibungen des Ausgabeformats Ihres Tools in der Tool-Beschreibung an. Wenn Sie angeben, dass das Tool JSON zurückgibt, wird Claude versuchen, das Ergebnis in Code zu deserialisieren und zu verarbeiten. Je mehr Details Sie über das Ausgabeschema bereitstellen, desto besser kann Claude die Antwort programmatisch verarbeiten.
</Note>

<CodeGroup>
```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Query customer purchase history from the last quarter and identify our top 5 customers by revenue"
    }],
    tools=[
        {
            "type": "code_execution_20250825",
            "name": "code_execution"
        },
        {
            "name": "query_database",
            "description": "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
            "input_schema": {...},
            "allowed_callers": ["code_execution_20250825"]
        }
    ]
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  betas: ["advanced-tool-use-2025-11-20"],
  max_tokens: 4096,
  messages: [{
    role: "user",
    content: "Query customer purchase history from the last quarter and identify our top 5 customers by revenue"
  }],
  tools: [
    {
      type: "code_execution_20250825",
      name: "code_execution"
    },
    {
      name: "query_database",
      description: "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
      input_schema: {...},
      allowed_callers: ["code_execution_20250825"]
    }
  ]
});
```
</CodeGroup>

### Schritt 2: API-Antwort mit Tool-Aufruf

Claude schreibt Code, der Ihr Tool aufruft. Die API pausiert und gibt folgendes zurück:

```json
{
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "I'll query the purchase history and analyze the results."
    },
    {
      "type": "server_tool_use",
      "id": "srvtoolu_abc123",
      "name": "code_execution",
      "input": {
        "code": "results = await query_database('<sql>')\ntop_customers = sorted(results, key=lambda x: x['revenue'], reverse=True)[:5]\nprint(f'Top 5 customers: {top_customers}')"
      }
    },
    {
      "type": "tool_use",
      "id": "toolu_def456",
      "name": "query_database",
      "input": {"sql": "<sql>"},
      "caller": {
        "type": "code_execution_20250825",
        "tool_id": "srvtoolu_abc123"
      }
    }
  ],
  "container": {
    "id": "container_xyz789",
    "expires_at": "2025-01-15T14:30:00Z"
  },
  "stop_reason": "tool_use"
}
```

### Schritt 3: Tool-Ergebnis bereitstellen

Fügen Sie die vollständige Gesprächshistorie plus Ihr Tool-Ergebnis ein:

<CodeGroup>
```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=4096,
    container="container_xyz789",  # Reuse the container
    messages=[
        {"role": "user", "content": "Query customer purchase history from the last quarter and identify our top 5 customers by revenue"},
        {
            "role": "assistant",
            "content": [
                {"type": "text", "text": "I'll query the purchase history and analyze the results."},
                {
                    "type": "server_tool_use",
                    "id": "srvtoolu_abc123",
                    "name": "code_execution",
                    "input": {"code": "..."}
                },
                {
                    "type": "tool_use",
                    "id": "toolu_def456",
                    "name": "query_database",
                    "input": {"sql": "<sql>"},
                    "caller": {
                        "type": "code_execution_20250825",
                        "tool_id": "srvtoolu_abc123"
                    }
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "tool_result",
                    "tool_use_id": "toolu_def456",
                    "content": "[{\"customer_id\": \"C1\", \"revenue\": 45000}, {\"customer_id\": \"C2\", \"revenue\": 38000}, ...]"
                }
            ]
        }
    ],
    tools=[...]
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  betas: ["advanced-tool-use-2025-11-20"],
  max_tokens: 4096,
  container: "container_xyz789",  // Reuse the container
  messages: [
    { role: "user", content: "Query customer purchase history from the last quarter and identify our top 5 customers by revenue" },
    {
      role: "assistant",
      content: [
        { type: "text", text: "I'll query the purchase history and analyze the results." },
        {
          type: "server_tool_use",
          id: "srvtoolu_abc123",
          name: "code_execution",
          input: { code: "..." }
        },
        {
          type: "tool_use",
          id: "toolu_def456",
          name: "query_database",
          input: { sql: "<sql>" },
          caller: {
            type: "code_execution_20250825",
            tool_id: "srvtoolu_abc123"
          }
        }
      ]
    },
    {
      role: "user",
      content: [
        {
          type: "tool_result",
          tool_use_id: "toolu_def456",
          content: "[{\"customer_id\": \"C1\", \"revenue\": 45000}, {\"customer_id\": \"C2\", \"revenue\": 38000}, ...]"
        }
      ]
    }
  ],
  tools: [...]
});
```
</CodeGroup>

### Schritt 4: Nächster Tool-Aufruf oder Abschluss

Die Code-Ausführung wird fortgesetzt und verarbeitet die Ergebnisse. Wenn zusätzliche Tool-Aufrufe erforderlich sind, wiederholen Sie Schritt 3, bis alle Tool-Aufrufe erfüllt sind.

### Schritt 5: Endgültige Antwort

Sobald die Code-Ausführung abgeschlossen ist, stellt Claude die endgültige Antwort bereit:

```json
{
  "content": [
    {
      "type": "code_execution_tool_result",
      "tool_use_id": "srvtoolu_abc123",
      "content": {
        "type": "code_execution_result",
        "stdout": "Top 5 customers by revenue:\n1. Customer C1: $45,000\n2. Customer C2: $38,000\n3. Customer C5: $32,000\n4. Customer C8: $28,500\n5. Customer C3: $24,000",
        "stderr": "",
        "return_code": 0,
        "content": []
      }
    },
    {
      "type": "text",
      "text": "I've analyzed the purchase history from last quarter. Your top 5 customers generated $167,500 in total revenue, with Customer C1 leading at $45,000."
    }
  ],
  "stop_reason": "end_turn"
}
```

## Erweiterte Muster

### Batch-Verarbeitung mit Schleifen

Claude kann Code schreiben, der mehrere Elemente effizient verarbeitet:

```python
# async wrapper omitted for clarity
regions = ["West", "East", "Central", "North", "South"]
results = {}
for region in regions:
    data = await query_database(f"<sql for {region}>")
    results[region] = sum(row["revenue"] for row in data)

# Process results programmatically
top_region = max(results.items(), key=lambda x: x[1])
print(f"Top region: {top_region[0]} with ${top_region[1]:,} in revenue")
```

Dieses Muster:
- Reduziert Model-Roundtrips von N (eine pro Region) auf 1
- Verarbeitet große Ergebnissätze programmatisch, bevor sie zu Claude zurückkehren
- Spart Token, indem nur aggregierte Schlussfolgerungen statt Rohdaten zurückgegeben werden

### Frühzeitige Beendigung

Claude kann die Verarbeitung beenden, sobald Erfolgskriterien erfüllt sind:

```python
# async wrapper omitted for clarity
endpoints = ["us-east", "eu-west", "apac"]
for endpoint in endpoints:
    status = await check_health(endpoint)
    if status == "healthy":
        print(f"Found healthy endpoint: {endpoint}")
        break  # Stop early, don't check remaining
```

### Bedingte Tool-Auswahl

```python
# async wrapper omitted for clarity
file_info = await get_file_info(path)
if file_info["size"] < 10000:
    content = await read_full_file(path)
else:
    content = await read_file_summary(path)
print(content)
```

### Datenfilterung

```python
# async wrapper omitted for clarity
logs = await fetch_logs(server_id)
errors = [log for log in logs if "ERROR" in log]
print(f"Found {len(errors)} errors")
for error in errors[-10:]:  # Only return last 10 errors
    print(error)
```

## Antwortformat

### Programmatischer Tool-Aufruf

Wenn Code-Ausführung ein Tool aufruft:

```json
{
  "type": "tool_use",
  "id": "toolu_abc123",
  "name": "query_database",
  "input": {"sql": "<sql>"},
  "caller": {
    "type": "code_execution_20250825",
    "tool_id": "srvtoolu_xyz789"
  }
}
```

### Tool-Ergebnis-Verarbeitung

Ihr Tool-Ergebnis wird an den laufenden Code zurückgegeben:

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_abc123",
      "content": "[{\"customer_id\": \"C1\", \"revenue\": 45000, \"orders\": 23}, {\"customer_id\": \"C2\", \"revenue\": 38000, \"orders\": 18}, ...]"
    }
  ]
}
```

### Code-Ausführung abgeschlossen

Wenn alle Tool-Aufrufe erfüllt sind und der Code abgeschlossen ist:

```json
{
  "type": "code_execution_tool_result",
  "tool_use_id": "srvtoolu_xyz789",
  "content": {
    "type": "code_execution_result",
    "stdout": "Analysis complete. Top 5 customers identified from 847 total records.",
    "stderr": "",
    "return_code": 0,
    "content": []
  }
}
```

## Fehlerbehandlung

### Häufige Fehler

| Fehler | Beschreibung | Lösung |
|-------|-------------|----------|
| `invalid_tool_input` | Tool-Eingabe stimmt nicht mit Schema überein | Validieren Sie das input_schema Ihres Tools |
| `tool_not_allowed` | Tool erlaubt den angeforderten Caller-Typ nicht | Überprüfen Sie, dass `allowed_callers` die richtigen Kontexte enthält |
| `missing_beta_header` | PTC-Beta-Header nicht bereitgestellt | Fügen Sie beide Beta-Header zu Ihrer Anfrage hinzu |

### Container-Ablauf während Tool-Aufruf

Wenn Ihr Tool zu lange zum Antworten braucht, erhält die Code-Ausführung einen `TimeoutError`. Claude sieht dies in stderr und wird normalerweise erneut versuchen:

```json
{
  "type": "code_execution_tool_result",
  "tool_use_id": "srvtoolu_abc123",
  "content": {
    "type": "code_execution_result",
    "stdout": "",
    "stderr": "TimeoutError: Calling tool ['query_database'] timed out.",
    "return_code": 0,
    "content": []
  }
}
```

Um Timeouts zu vermeiden:
- Überwachen Sie das Feld `expires_at` in Antworten
- Implementieren Sie Timeouts für Ihre Tool-Ausführung
- Erwägen Sie, lange Operationen in kleinere Teile zu unterteilen

### Tool-Ausführungsfehler

Wenn Ihr Tool einen Fehler zurückgibt:

```python
# Provide error information in the tool result
{
    "type": "tool_result",
    "tool_use_id": "toolu_abc123",
    "content": "Error: Query timeout - table lock exceeded 30 seconds"
}
```

Claudes Code erhält diesen Fehler und kann ihn entsprechend verarbeiten.

## Einschränkungen und Beschränkungen

### Feature-Inkompatibilitäten

- **Strukturierte Ausgaben**: Tools mit `strict: true` werden nicht mit programmatischem Aufruf unterstützt
- **Tool-Auswahl**: Sie können programmatische Aufrufe eines bestimmten Tools nicht über `tool_choice` erzwingen
- **Parallele Tool-Verwendung**: `disable_parallel_tool_use: true` wird nicht mit programmatischem Aufruf unterstützt

### Tool-Einschränkungen

Die folgenden Tools können derzeit nicht programmatisch aufgerufen werden, aber die Unterstützung kann in zukünftigen Versionen hinzugefügt werden:

- Web-Suche
- Web-Abruf
- Tools, die von einem [MCP-Connector](/docs/de/agents-and-tools/mcp-connector) bereitgestellt werden

### Nachrichtenformatierungseinschränkungen

Bei der Antwort auf programmatische Tool-Aufrufe gibt es strenge Formatierungsanforderungen:

**Nur Tool-Ergebnis-Antworten**: Wenn es ausstehende programmatische Tool-Aufrufe gibt, die auf Ergebnisse warten, muss Ihre Antwortnachricht **nur** `tool_result`-Blöcke enthalten. Sie können keinen Text-Inhalt einschließen, auch nicht nach den Tool-Ergebnissen.

```json
// ❌ UNGÜLTIG - Kann keinen Text einschließen, wenn auf programmatische Tool-Aufrufe geantwortet wird
{
  "role": "user",
  "content": [
    {"type": "tool_result", "tool_use_id": "toolu_01", "content": "[{\"customer_id\": \"C1\", \"revenue\": 45000}]"},
    {"type": "text", "text": "What should I do next?"}  // This will cause an error
  ]
}

// ✅ GÜLTIG - Nur Tool-Ergebnisse bei Antwort auf programmatische Tool-Aufrufe
{
  "role": "user",
  "content": [
    {"type": "tool_result", "tool_use_id": "toolu_01", "content": "[{\"customer_id\": \"C1\", \"revenue\": 45000}]"}
  ]
}
```

Diese Einschränkung gilt nur bei der Antwort auf programmatische (Code-Ausführungs-)Tool-Aufrufe. Für reguläre Client-seitige Tool-Aufrufe können Sie Text-Inhalt nach Tool-Ergebnissen einschließen.

### Rate Limits

Programmatische Tool-Aufrufe unterliegen den gleichen Rate Limits wie reguläre Tool-Aufrufe. Jeder Tool-Aufruf von Code-Ausführung zählt als separate Invokation.

### Tool-Ergebnisse vor Verwendung validieren

Bei der Implementierung benutzerdefinierter Tools, die programmatisch aufgerufen werden:

- **Tool-Ergebnisse werden als Strings zurückgegeben**: Sie können beliebigen Inhalt enthalten, einschließlich Code-Snippets oder ausführbarer Befehle, die von der Ausführungsumgebung verarbeitet werden können.
- **Externe Tool-Ergebnisse validieren**: Wenn Ihr Tool Daten aus externen Quellen zurückgibt oder Benutzereingaben akzeptiert, beachten Sie Code-Injection-Risiken, wenn die Ausgabe als Code interpretiert oder ausgeführt wird.

## Token-Effizienz

Programmatischer Tool-Aufruf kann den Token-Verbrauch erheblich reduzieren:

- **Tool-Ergebnisse von programmatischen Aufrufen werden nicht zu Claudes Kontext hinzugefügt** - nur die endgültige Code-Ausgabe
- **Zwischenverarbeitung erfolgt in Code** - Filterung, Aggregation usw. verbrauchen keine Model-Token
- **Mehrere Tool-Aufrufe in einer Code-Ausführung** - reduziert Overhead im Vergleich zu separaten Model-Turns

Beispielsweise verwendet das direkte Aufrufen von 10 Tools etwa 10x die Token des programmatischen Aufrufs und der Rückgabe einer Zusammenfassung.

## Verwendung und Preisgestaltung

Programmatischer Tool-Aufruf verwendet die gleiche Preisgestaltung wie Code-Ausführung. Siehe die [Code-Ausführungs-Preisgestaltung](/docs/de/agents-and-tools/tool-use/code-execution-tool#usage-and-pricing) für Details.

<Note>
Token-Zählung für programmatische Tool-Aufrufe: Tool-Ergebnisse von programmatischen Invokationen zählen nicht zu Ihrer Input-/Output-Token-Nutzung. Nur das endgültige Code-Ausführungsergebnis und Claudes Antwort zählen.
</Note>

## Best Practices

### Tool-Design

- **Geben Sie detaillierte Ausgabebeschreibungen an**: Da Claude Tool-Ergebnisse in Code deserialisiert, dokumentieren Sie das Format klar (JSON-Struktur, Feldtypen usw.)
- **Geben Sie strukturierte Daten zurück**: JSON oder andere leicht analysierbare Formate funktionieren am besten für programmatische Verarbeitung
- **Halten Sie Antworten prägnant**: Geben Sie nur notwendige Daten zurück, um Verarbeitungs-Overhead zu minimieren

### Wann programmatischer Aufruf zu verwenden ist

**Gute Anwendungsfälle:**
- Verarbeitung großer Datensätze, bei denen Sie nur Aggregate oder Zusammenfassungen benötigen
- Multi-Schritt-Workflows mit 3+ abhängigen Tool-Aufrufen
- Operationen, die Filterung, Sortierung oder Transformation von Tool-Ergebnissen erfordern
- Aufgaben, bei denen Zwischendaten Claudes Reasoning nicht beeinflussen sollten
- Parallele Operationen über viele Elemente (z. B. Überprüfung von 50 Endpoints)

**Weniger ideale Anwendungsfälle:**
- Einzelne Tool-Aufrufe mit einfachen Antworten
- Tools, die sofortiges Benutzer-Feedback benötigen
- Sehr schnelle Operationen, bei denen Code-Ausführungs-Overhead den Vorteil überwiegen würde

### Leistungsoptimierung

- **Verwenden Sie Container erneut**, wenn Sie mehrere verwandte Anfragen stellen, um den Status beizubehalten
- **Batch ähnliche Operationen** in einer einzigen Code-Ausführung, wenn möglich

## Fehlerbehebung

### Häufige Probleme

**"Tool not allowed"-Fehler**
- Überprüfen Sie, dass Ihre Tool-Definition `"allowed_callers": ["code_execution_20250825"]` enthält
- Überprüfen Sie, dass Sie die richtigen Beta-Header verwenden

**Container-Ablauf**
- Stellen Sie sicher, dass Sie auf Tool-Aufrufe innerhalb der Container-Lebensdauer (~4,5 Minuten) antworten
- Überwachen Sie das Feld `expires_at` in Antworten
- Erwägen Sie, schnellere Tool-Ausführung zu implementieren

**Beta-Header-Probleme**
- Sie benötigen den Header: `"advanced-tool-use-2025-11-20"`

**Tool-Ergebnis wird nicht korrekt analysiert**
- Stellen Sie sicher, dass Ihr Tool String-Daten zurückgibt, die Claude deserialisieren kann
- Geben Sie klare Ausgabeformat-Dokumentation in Ihrer Tool-Beschreibung an

### Debugging-Tipps

1. **Protokollieren Sie alle Tool-Aufrufe und Ergebnisse**, um den Ablauf zu verfolgen
2. **Überprüfen Sie das Feld `caller`**, um programmatische Invokation zu bestätigen
3. **Überwachen Sie Container-IDs**, um ordnungsgemäße Wiederverwendung sicherzustellen
4. **Testen Sie Tools unabhängig**, bevor Sie programmatische Aufrufe aktivieren

## Warum programmatischer Tool-Aufruf funktioniert

Claudes Training umfasst umfangreiche Exposition gegenüber Code, was es effektiv macht, durch Tool-Aufrufe zu argumentieren und sie zu verketten. Wenn Tools als aufrufbare Funktionen innerhalb einer Code-Ausführungsumgebung präsentiert werden, kann Claude diese Stärke nutzen, um:

- **Natürlich über Tool-Komposition zu argumentieren**: Operationen verketten und Abhängigkeiten so natürlich wie das Schreiben von Python-Code handhaben
- **Große Ergebnisse effizient zu verarbeiten**: Große Tool-Ausgaben filtern, nur relevante Daten extrahieren oder Zwischenergebnisse in Dateien schreiben, bevor Zusammenfassungen zum Kontextfenster zurückkehren
- **Latenz erheblich zu reduzieren**: Eliminieren Sie den Overhead des erneuten Sammelns von Claude zwischen jedem Tool-Aufruf in Multi-Schritt-Workflows

Dieser Ansatz ermöglicht Workflows, die mit traditioneller Tool-Verwendung unpraktisch wären – wie die Verarbeitung von Dateien über 1M Token – indem Claude mit Daten programmatisch arbeiten kann, anstatt alles in den Gesprächskontext zu laden.

## Alternative Implementierungen

Programmatischer Tool-Aufruf ist ein verallgemeinerbares Muster, das außerhalb von Anthropics verwalteter Code-Ausführung implementiert werden kann. Hier ist ein Überblick über die Ansätze:

### Client-seitige direkte Ausführung

Stellen Sie Claude ein Code-Ausführungs-Tool zur Verfügung und beschreiben Sie, welche Funktionen in dieser Umgebung verfügbar sind. Wenn Claude das Tool mit Code aufruft, führt Ihre Anwendung es lokal aus, wo diese Funktionen definiert sind.

**Vorteile:**
- Einfach zu implementieren mit minimalem Umstrukturieren
- Vollständige Kontrolle über die Umgebung und Anweisungen

**Nachteile:**
- Führt nicht vertrauenswürdigen Code außerhalb einer Sandbox aus
- Tool-Invokationen können Vektoren für Code-Injection sein

**Verwenden Sie, wenn:** Ihre Anwendung sicher beliebigen Code ausführen kann, Sie eine einfache Lösung möchten und Anthropics verwaltetes Angebot nicht passt.

### Selbstverwaltete Sandbox-Ausführung

Gleicher Ansatz aus Claudes Perspektive, aber Code läuft in einem Sandbox-Container mit Sicherheitsbeschränkungen (z. B. kein Netzwerk-Egress). Wenn Ihre Tools externe Ressourcen benötigen, benötigen Sie ein Protokoll zum Ausführen von Tool-Aufrufen außerhalb der Sandbox.

**Vorteile:**
- Sicherer programmatischer Tool-Aufruf auf Ihrer eigenen Infrastruktur
- Vollständige Kontrolle über die Ausführungsumgebung

**Nachteile:**
- Komplex zu bauen und zu warten
- Erfordert die Verwaltung von Infrastruktur und Inter-Prozess-Kommunikation

**Verwenden Sie, wenn:** Sicherheit ist kritisch und Anthropics verwaltete Lösung passt nicht zu Ihren Anforderungen.

### Anthropic-verwaltete Ausführung

Anthropics programmatischer Tool-Aufruf ist eine verwaltete Version der Sandbox-Ausführung mit einer für Claude optimierten Python-Umgebung. Anthropic verwaltet Container-Management, Code-Ausführung und sichere Tool-Invokations-Kommunikation.

**Vorteile:**
- Sicher und standardmäßig sicher
- Einfach zu aktivieren mit minimaler Konfiguration
- Umgebung und Anweisungen für Claude optimiert

Wir empfehlen die Verwendung von Anthropics verwalteter Lösung, wenn Sie die Claude API verwenden.

## Verwandte Funktionen

<CardGroup cols={2}>
  <Card title="Code Execution Tool" icon="code" href="/docs/de/agents-and-tools/tool-use/code-execution-tool">
    Erfahren Sie mehr über die zugrunde liegende Code-Ausführungsfunktion, die programmatischen Tool-Aufruf ermöglicht.
  </Card>
  <Card title="Tool Use Overview" icon="wrench" href="/docs/de/agents-and-tools/tool-use/overview">
    Verstehen Sie die Grundlagen der Tool-Verwendung mit Claude.
  </Card>
  <Card title="Implement Tool Use" icon="hammer" href="/docs/de/agents-and-tools/tool-use/implement-tool-use">
    Schritt-für-Schritt-Anleitung zur Implementierung von Tools.
  </Card>
</CardGroup>