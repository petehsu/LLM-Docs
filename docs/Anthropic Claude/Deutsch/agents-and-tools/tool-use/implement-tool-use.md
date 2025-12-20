# Wie man Tool-Nutzung implementiert

Erfahren Sie, wie Sie Tools mit Claude definieren und verwenden, einschließlich Best Practices für Tool-Definitionen, Beispiele und SDK-Implementierungen.

---

## Auswahl eines Modells

Wir empfehlen die Verwendung des neuesten Claude Sonnet (4.5) oder Claude Opus (4.1) Modells für komplexe Tools und mehrdeutige Anfragen; sie handhaben mehrere Tools besser und suchen bei Bedarf nach Klarstellung.

Verwenden Sie Claude Haiku Modelle für unkomplizierte Tools, aber beachten Sie, dass sie möglicherweise fehlende Parameter ableiten.

<Tip>
Wenn Sie Claude mit Tool-Nutzung und erweitertem Denken verwenden, lesen Sie unseren Leitfaden [hier](/docs/de/build-with-claude/extended-thinking) für weitere Informationen.
</Tip>

## Angeben von Client-Tools

Client-Tools (sowohl von Anthropic definiert als auch benutzerdefiniert) werden im `tools` Top-Level-Parameter der API-Anfrage angegeben. Jede Tool-Definition enthält:

| Parameter      | Beschreibung                                                                                         |
| :------------- | :-------------------------------------------------------------------------------------------------- |
| `name`         | Der Name des Tools. Muss dem Regex `^[a-zA-Z0-9_-]{1,64}$` entsprechen.                                 |
| `description`  | Eine detaillierte Klartextbeschreibung, was das Tool tut, wann es verwendet werden sollte und wie es sich verhält. |
| `input_schema` | Ein [JSON Schema](https://json-schema.org/) Objekt, das die erwarteten Parameter für das Tool definiert.     |
| `input_examples` | (Optional, Beta) Ein Array von Beispiel-Eingabeobjekten, um Claude zu helfen, das Tool zu verstehen. Siehe [Bereitstellung von Tool-Nutzungsbeispielen](#providing-tool-use-examples). |

<section title="Beispiel einer einfachen Tool-Definition">

```json JSON
{
  "name": "get_weather",
  "description": "Get the current weather in a given location",
  "input_schema": {
    "type": "object",
    "properties": {
      "location": {
        "type": "string",
        "description": "The city and state, e.g. San Francisco, CA"
      },
      "unit": {
        "type": "string",
        "enum": ["celsius", "fahrenheit"],
        "description": "The unit of temperature, either 'celsius' or 'fahrenheit'"
      }
    },
    "required": ["location"]
  }
}
```

Dieses Tool mit dem Namen `get_weather` erwartet ein Eingabeobjekt mit einer erforderlichen `location` Zeichenkette und einer optionalen `unit` Zeichenkette, die entweder "celsius" oder "fahrenheit" sein muss.

</section>

### Tool-Nutzungs-Systemprompt

Wenn Sie die Claude API mit dem `tools` Parameter aufrufen, erstellen wir einen speziellen Systemprompt aus den Tool-Definitionen, der Tool-Konfiguration und jedem benutzerdefinierten Systemprompt. Der konstruierte Prompt ist darauf ausgelegt, das Modell anzuweisen, die angegebenen Tools zu verwenden und den notwendigen Kontext für den ordnungsgemäßen Betrieb des Tools bereitzustellen:

```
In this environment you have access to a set of tools you can use to answer the user's question.
{{ FORMATTING INSTRUCTIONS }}
String and scalar parameters should be specified as is, while lists and objects should use JSON format. Note that spaces for string values are not stripped. The output is not expected to be valid XML and is parsed with regular expressions.
Here are the functions available in JSONSchema format:
{{ TOOL DEFINITIONS IN JSON SCHEMA }}
{{ USER SYSTEM PROMPT }}
{{ TOOL CONFIGURATION }}
```

### Best Practices für Tool-Definitionen

Um die beste Leistung von Claude bei der Verwendung von Tools zu erhalten, befolgen Sie diese Richtlinien:

- **Bieten Sie äußerst detaillierte Beschreibungen.** Dies ist bei weitem der wichtigste Faktor für die Tool-Leistung. Ihre Beschreibungen sollten jedes Detail über das Tool erklären, einschließlich:
  - Was das Tool tut
  - Wann es verwendet werden sollte (und wann nicht)
  - Was jeder Parameter bedeutet und wie er das Verhalten des Tools beeinflusst
  - Alle wichtigen Vorbehalte oder Einschränkungen, wie z. B. welche Informationen das Tool nicht zurückgibt, wenn der Tool-Name unklar ist. Je mehr Kontext Sie Claude über Ihre Tools geben können, desto besser wird es bei der Entscheidung, wann und wie sie verwendet werden. Streben Sie mindestens 3-4 Sätze pro Tool-Beschreibung an, mehr wenn das Tool komplex ist.
- **Priorisieren Sie Beschreibungen, erwägen Sie aber die Verwendung von `input_examples` für komplexe Tools.** Klare Beschreibungen sind am wichtigsten, aber für Tools mit komplexen Eingaben, verschachtelten Objekten oder formatempfindlichen Parametern können Sie das Feld `input_examples` (Beta) verwenden, um schemavalidierte Beispiele bereitzustellen. Siehe [Bereitstellung von Tool-Nutzungsbeispielen](#providing-tool-use-examples) für Details.

<section title="Beispiel einer guten Tool-Beschreibung">

```json JSON
{
  "name": "get_stock_price",
  "description": "Retrieves the current stock price for a given ticker symbol. The ticker symbol must be a valid symbol for a publicly traded company on a major US stock exchange like NYSE or NASDAQ. The tool will return the latest trade price in USD. It should be used when the user asks about the current or most recent price of a specific stock. It will not provide any other information about the stock or company.",
  "input_schema": {
    "type": "object",
    "properties": {
      "ticker": {
        "type": "string",
        "description": "The stock ticker symbol, e.g. AAPL for Apple Inc."
      }
    },
    "required": ["ticker"]
  }
}
```

</section>

<section title="Beispiel einer schlechten Tool-Beschreibung">

```json JSON
{
  "name": "get_stock_price",
  "description": "Gets the stock price for a ticker.",
  "input_schema": {
    "type": "object",
    "properties": {
      "ticker": {
        "type": "string"
      }
    },
    "required": ["ticker"]
  }
}
```

</section>

Die gute Beschreibung erklärt klar, was das Tool tut, wann es verwendet werden sollte, welche Daten es zurückgibt und was der `ticker` Parameter bedeutet. Die schlechte Beschreibung ist zu kurz und lässt Claude mit vielen offenen Fragen über das Verhalten und die Verwendung des Tools.

## Bereitstellung von Tool-Nutzungsbeispielen

Sie können konkrete Beispiele gültiger Tool-Eingaben bereitstellen, um Claude zu helfen, Ihre Tools effektiver zu verstehen. Dies ist besonders nützlich für komplexe Tools mit verschachtelten Objekten, optionalen Parametern oder formatempfindlichen Eingaben.

<Info>
Tool-Nutzungsbeispiele ist eine Beta-Funktion. Fügen Sie den entsprechenden [Beta-Header](/docs/de/api/beta-headers) für Ihren Anbieter ein:

| Anbieter | Beta-Header | Unterstützte Modelle |
|----------|-------------|------------------|
| Claude API,<br/>Microsoft Foundry | `advanced-tool-use-2025-11-20` | Alle Modelle |
| Vertex AI,<br/>Amazon Bedrock | `tool-examples-2025-10-29` | Nur Claude Opus 4.5 |
</Info>

### Grundlegende Verwendung

Fügen Sie ein optionales `input_examples` Feld zu Ihrer Tool-Definition mit einem Array von Beispiel-Eingabeobjekten hinzu. Jedes Beispiel muss gemäß dem `input_schema` des Tools gültig sein:

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    betas=["advanced-tool-use-2025-11-20"],
    tools=[
        {
            "name": "get_weather",
            "description": "Get the current weather in a given location",
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "The city and state, e.g. San Francisco, CA"
                    },
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"],
                        "description": "The unit of temperature"
                    }
                },
                "required": ["location"]
            },
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
                    "location": "New York, NY"  # 'unit' is optional
                }
            ]
        }
    ],
    messages=[
        {"role": "user", "content": "What's the weather like in San Francisco?"}
    ]
)
```

```typescript TypeScript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const response = await client.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  betas: ["advanced-tool-use-2025-11-20"],
  tools: [
    {
      name: "get_weather",
      description: "Get the current weather in a given location",
      input_schema: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "The city and state, e.g. San Francisco, CA",
          },
          unit: {
            type: "string",
            enum: ["celsius", "fahrenheit"],
            description: "The unit of temperature",
          },
        },
        required: ["location"],
      },
      input_examples: [
        {
          location: "San Francisco, CA",
          unit: "fahrenheit",
        },
        {
          location: "Tokyo, Japan",
          unit: "celsius",
        },
        {
          location: "New York, NY",
          // Demonstrates that 'unit' is optional
        },
      ],
    },
  ],
  messages: [{ role: "user", content: "What's the weather like in San Francisco?" }],
});
```
</CodeGroup>

Beispiele sind im Prompt neben Ihrem Tool-Schema enthalten und zeigen Claude konkrete Muster für gut geformte Tool-Aufrufe. Dies hilft Claude zu verstehen, wann optionale Parameter einzubeziehen sind, welche Formate zu verwenden sind und wie komplexe Eingaben strukturiert werden.

### Anforderungen und Einschränkungen

- **Schema-Validierung** - Jedes Beispiel muss gemäß dem `input_schema` des Tools gültig sein. Ungültige Beispiele geben einen 400-Fehler zurück
- **Nicht unterstützt für serverseitige Tools** - Nur benutzerdefinierte Tools können Eingabebeispiele haben
- **Token-Kosten** - Beispiele addieren sich zu Prompt-Tokens: ~20-50 Tokens für einfache Beispiele, ~100-200 Tokens für komplexe verschachtelte Objekte

## Tool Runner (Beta)

Der Tool Runner bietet eine sofort einsatzbereite Lösung für die Ausführung von Tools mit Claude. Anstatt Tool-Aufrufe, Tool-Ergebnisse und Gesprächsverwaltung manuell zu handhaben, führt der Tool Runner automatisch aus:

- Führt Tools aus, wenn Claude sie aufruft
- Verwaltet den Request/Response-Zyklus
- Verwaltet den Gesprächszustand
- Bietet Typsicherheit und Validierung

Wir empfehlen, dass Sie den Tool Runner für die meisten Tool-Nutzungsimplementierungen verwenden.

<Note>
Der Tool Runner ist derzeit in Beta und verfügbar in den [Python](https://github.com/anthropics/anthropic-sdk-python/blob/main/tools.md), [TypeScript](https://github.com/anthropics/anthropic-sdk-typescript/blob/main/helpers.md#tool-helpers) und [Ruby](https://github.com/anthropics/anthropic-sdk-ruby/blob/main/helpers.md#3-auto-looping-tool-runner-beta) SDKs.
</Note>

<Tip>
**Automatische Kontextverwaltung mit Komprimierung**

Der Tool Runner unterstützt automatische [Komprimierung](/docs/de/build-with-claude/context-editing#client-side-compaction-sdk), die Zusammenfassungen generiert, wenn die Token-Nutzung einen Schwellenwert überschreitet. Dies ermöglicht es langfristigen agentengesteuerten Aufgaben, über Kontextfenster-Grenzen hinaus fortzufahren.
</Tip>

<Tabs>
<Tab title="Python">

### Grundlegende Verwendung

Verwenden Sie den `@beta_tool` Dekorator, um Tools zu definieren und `client.beta.messages.tool_runner()` um sie auszuführen.

<Note>
Wenn Sie den asynchronen Client verwenden, ersetzen Sie `@beta_tool` durch `@beta_async_tool` und definieren Sie die Funktion mit `async def`.
</Note>

```python
import anthropic
import json
from anthropic import beta_tool

# Initialize client
client = anthropic.Anthropic()

# Define tools using the decorator
@beta_tool
def get_weather(location: str, unit: str = "fahrenheit") -> str:
    """Get the current weather in a given location.

    Args:
        location: The city and state, e.g. San Francisco, CA
        unit: Temperature unit, either 'celsius' or 'fahrenheit'
    """
    # In a full implementation, you'd call a weather API here
    return json.dumps({"temperature": "20°C", "condition": "Sunny"})

@beta_tool
def calculate_sum(a: int, b: int) -> str:
    """Add two numbers together.

    Args:
        a: First number
        b: Second number
    """
    return str(a + b)

# Use the tool runner
runner = client.beta.messages.tool_runner(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[get_weather, calculate_sum],
    messages=[
        {"role": "user", "content": "What's the weather like in Paris? Also, what's 15 + 27?"}
    ]
)
for message in runner:
    print(message.content[0].text)
```

Die dekorierte Funktion muss einen Content Block oder Content Block Array zurückgeben, einschließlich Text, Bilder oder Dokument-Blöcke. Dies ermöglicht Tools, reichhaltige, multimodale Antworten zurückzugeben. Zurückgegebene Strings werden in einen Text-Content Block konvertiert.
Wenn Sie ein strukturiertes JSON-Objekt an Claude zurückgeben möchten, kodieren Sie es vor der Rückgabe als JSON-String. Zahlen, Boolesche Werte oder andere nicht-String-Primitive müssen auch in Strings konvertiert werden.

Der `@beta_tool` Dekorator inspiziert die Funktionsargumente und den Docstring, um eine JSON-Schema-Darstellung der gegebenen Funktion zu extrahieren. Im obigen Beispiel wird `calculate_sum` in folgende Form umgewandelt:

```json
{
  "name": "calculate_sum",
  "description": "Adds two integers together.",
  "input_schema": {
    "additionalProperties": false,
    "properties": {
      "left": {
        "description": "The first integer to add.",
        "title": "Left",
        "type": "integer"
      },
      "right": {
        "description": "The second integer to add.",
        "title": "Right",
        "type": "integer"
      }
    },
    "required": ["left", "right"],
    "type": "object"
  }
}
```

### Iteration über den Tool Runner

Der von `tool_runner()` zurückgegebene Tool Runner ist ein Iterable, das Sie mit einer `for` Schleife durchlaufen können. Dies wird oft als "Tool-Aufrufs-Schleife" bezeichnet.
Jede Loop-Iteration ergibt eine Nachricht, die von Claude zurückgegeben wurde.

Nachdem Ihr Code die aktuelle Nachricht in der Schleife verarbeitet hat, prüft der Tool Runner die Nachricht, um zu sehen, ob Claude eine Tool-Nutzung angefordert hat. Wenn ja, ruft er das Tool auf und sendet das Tool-Ergebnis automatisch an Claude zurück, dann ergibt er die nächste Nachricht von Claude, um die nächste Iteration Ihrer Schleife zu starten.

Sie können die Schleife bei jeder Iteration mit einer einfachen `break` Anweisung beenden. Der Tool Runner wird in einer Schleife laufen, bis Claude eine Nachricht ohne Tool-Nutzung zurückgibt.

Wenn Sie sich nicht um Zwischennachrichten kümmern, können Sie statt einer Schleife die `until_done()` Methode aufrufen, die die letzte Nachricht von Claude zurückgibt:

```python
runner = client.beta.messages.tool_runner(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[get_weather, calculate_sum],
    messages=[
        {"role": "user", "content": "What's the weather like in Paris? Also, what's 15 + 27?"}
    ]
)
final_message = runner.until_done()
print(final_message.content[0].text)
```

### Erweiterte Verwendung

Innerhalb der Schleife haben Sie die Möglichkeit, die nächste Anfrage des Tool Runners an die Messages API vollständig anzupassen.
Die Methode `runner.generate_tool_call_response()` ruft das Tool auf (wenn Claude eine Tool-Nutzung ausgelöst hat) und gibt Ihnen Zugriff auf das Tool-Ergebnis, das an die Messages API zurückgesendet wird.
Die Methoden `runner.set_messages_params()` und `runner.append_messages()` ermöglichen es Ihnen, die Parameter für die nächste Messages API-Anfrage zu ändern.

```python
runner = client.beta.messages.tool_runner(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[get_weather],
    messages=[{"role": "user", "content": "What's the weather in San Francisco?"}]
)
for message in runner:
    # Get the tool response that will be sent
    tool_response = runner.generate_tool_call_response()

    # Customize the next request
    runner.set_messages_params(lambda params: {
        **params,
        "max_tokens": 2048  # Increase tokens for next request
    })

    # Or add additional messages
    runner.append_messages(
        {"role": "user", "content": "Please be concise in your response."}
    )
```

### Streaming

Wenn Sie Streaming mit `stream=True` aktivieren, ist jeder Wert, der vom Tool Runner ausgegeben wird, ein `BetaMessageStream` wie von `anthropic.messages.stream()` zurückgegeben. Der `BetaMessageStream` ist selbst ein Iterable, das Streaming-Events von der Messages API ergibt.

Sie können `message_stream.get_final_message()` verwenden, um das SDK die Akkumulation von Streaming-Events in die endgültige Nachricht für Sie durchführen zu lassen.

```python
runner = client.beta.messages.tool_runner(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[calculate_sum],
    messages=[{"role": "user", "content": "What is 15 + 27?"}],
    stream=True
)

# When streaming, the runner returns BetaMessageStream
for message_stream in runner:
    for event in message_stream:
        print('event:', event)
    print('message:', message_stream.get_final_message())

print(runner.until_done())
```

</Tab>
<Tab title="TypeScript (Zod)">

### Grundlegende Verwendung

Verwenden Sie `betaZodTool()` für typsichere Tool-Definitionen mit Zod-Validierung (erfordert Zod 3.25.0 oder höher).

```typescript
import { Anthropic } from '@anthropic-ai/sdk';
import { betaZodTool, betaTool } from '@anthropic-ai/sdk/helpers/beta/zod';
import { z } from 'zod';

const anthropic = new Anthropic();

// Using betaZodTool (requires Zod 3.25.0+)
const getWeatherTool = betaZodTool({
  name: 'get_weather',
  description: 'Get the current weather in a given location',
  inputSchema: z.object({
    location: z.string().describe('The city and state, e.g. San Francisco, CA'),
    unit: z.enum(['celsius', 'fahrenheit']).default('fahrenheit')
      .describe('Temperature unit')
  }),
  run: async (input) => {
    // In a full implementation, you'd call a weather API here
    return JSON.stringify({temperature: '20°C', condition: 'Sunny'});
  }
});

// Use the tool runner
const runner = anthropic.beta.messages.toolRunner({
  model: 'claude-sonnet-4-5',
  max_tokens: 1024,
  tools: [getWeatherTool],
  messages: [
    {
      role: 'user',
      content: "What's the weather like in Paris?"
    }
  ]
});

// Process messages as they come in
for await (const message of runner) {
  console.log(message.content[0].text);
}
```

Die `run` Funktion muss einen Content Block oder Content Block Array zurückgeben, einschließlich Text, Bilder oder Dokument-Blöcke. Dies ermöglicht Tools, reichhaltige, multimodale Antworten zurückzugeben. Zurückgegebene Strings werden in einen Text-Content Block konvertiert.
Wenn Sie ein strukturiertes JSON-Objekt an Claude zurückgeben möchten, stringifizieren Sie es zu einem JSON-String vor der Rückgabe. Zahlen, Boolesche Werte oder andere nicht-String-Primitive müssen auch in Strings konvertiert werden.

### Iteration über den Tool Runner

Der von `toolRunner()` zurückgegebene Tool Runner ist ein asynchrones Iterable, das Sie mit einer `for await ... of` Schleife durchlaufen können. Dies wird oft als "Tool-Aufrufs-Schleife" bezeichnet.
Jede Loop-Iteration ergibt eine Nachricht, die von Claude zurückgegeben wurde.

Nachdem Ihr Code die aktuelle Nachricht in der Schleife verarbeitet hat, prüft der Tool Runner die Nachricht, um zu sehen, ob Claude eine Tool-Nutzung angefordert hat. Wenn ja, ruft er das Tool auf und sendet das Tool-Ergebnis automatisch an Claude zurück, dann ergibt er die nächste Nachricht von Claude, um die nächste Iteration Ihrer Schleife zu starten.

Sie können die Schleife bei jeder Iteration mit einer einfachen `break` Anweisung beenden. Der Tool Runner wird in einer Schleife laufen, bis Claude eine Nachricht ohne Tool-Nutzung zurückgibt.

Wenn Sie sich nicht um Zwischennachrichten kümmern, können Sie statt einer Schleife einfach auf den Tool Runner warten, was die letzte Nachricht von Claude zurückgibt.

### Erweiterte Verwendung

Innerhalb der Schleife haben Sie die Möglichkeit, die nächste Anfrage des Tool Runners an die Messages API vollständig anzupassen.
Die Methode `runner.generateToolResponse()` ruft das Tool auf (wenn Claude eine Tool-Nutzung ausgelöst hat) und gibt Ihnen Zugriff auf das Tool-Ergebnis, das an die Messages API zurückgesendet wird.
Die Methoden `runner.setMessagesParams()` und `runner.pushMessages()` ermöglichen es Ihnen, die Parameter für die nächste Messages API-Anfrage zu ändern. Die aktuellen Parameter sind unter `runner.params` verfügbar.

```typescript
const runner = anthropic.beta.messages.toolRunner({
  model: 'claude-sonnet-4-5',
  max_tokens: 1024,
  tools: [getWeatherTool],
  messages: [
    { role: 'user', content: "What's the weather in San Francisco?" }
  ]
});

for await (const message of runner) {
  // Get the tool response that will be sent
  const toolResponse = await runner.generateToolResponse();

  // Customize the next request
  runner.setMessagesParams(params => ({
    ...params,
    max_tokens: 2048  // Increase tokens for next request
  }));

  // Or add additional messages
  runner.pushMessages(
    { role: 'user', content: 'Please be concise in your response.' }
  );
}
```

### Streaming

Wenn Sie Streaming mit `stream: true` aktivieren, ist jeder Wert, der vom Tool Runner ausgegeben wird, ein `MessageStream` wie von `anthropic.messages.stream()` zurückgegeben. Der `MessageStream` ist selbst ein asynchrones Iterable, das Streaming-Events von der Messages API ergibt.

Sie können `messageStream.finalMessage()` verwenden, um das SDK die Akkumulation von Streaming-Events in die endgültige Nachricht für Sie durchführen zu lassen.

```typescript
const runner = anthropic.beta.messages.toolRunner({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 1000,
  messages: [{ role: 'user', content: 'What is the weather in San Francisco?' }],
  tools: [calculatorTool],
  stream: true,
});

// When streaming, the runner returns BetaMessageStream
for await (const messageStream of runner) {
  for await (const event of messageStream) {
    console.log('event:', event);
  }
  console.log('message:', await messageStream.finalMessage());
}

console.log(await runner);
```

</Tab>
<Tab title="TypeScript (JSON Schema)">

### Grundlegende Verwendung

Verwenden Sie `betaTool()` für typsichere Tool-Definitionen basierend auf JSON-Schemas. TypeScript und Ihr Editor werden sich des Typs des `input` Parameters für die Autovervollständigung bewusst sein.

<Note>
Die von Claude generierte Eingabe wird zur Laufzeit nicht validiert. Führen Sie die Validierung in der `run` Funktion durch, falls erforderlich.
</Note>

```typescript
import { Anthropic } from '@anthropic-ai/sdk';
import { betaZodTool, betaTool } from '@anthropic-ai/sdk/helpers/beta/json-schema';
import { z } from 'zod';

const anthropic = new Anthropic();

// Using betaTool with JSON schema (no Zod required)
const calculateSumTool = betaTool({
  name: 'calculate_sum',
  description: 'Add two numbers together',
  inputSchema: {
    type: 'object',
    properties: {
      a: { type: 'number', description: 'First number' },
      b: { type: 'number', description: 'Second number' }
    },
    required: ['a', 'b']
  },
  run: async (input) => {
    return String(input.a + input.b);
  }
});

// Use the tool runner
const runner = anthropic.beta.messages.toolRunner({
  model: 'claude-sonnet-4-5',
  max_tokens: 1024,
  tools: [getWeatherTool, calculateSumTool],
  messages: [
    {
      role: 'user',
      content: "What's 15 + 27?"
    }
  ]
});

// Process messages as they come in
for await (const message of runner) {
  console.log(message.content[0].text);
}
```

Die `run` Funktion muss einen beliebigen Content Block oder Content Block Array zurückgeben, einschließlich Text, Bild oder Dokument-Blöcke. Dies ermöglicht Tools, reichhaltige, multimodale Antworten zurückzugeben. Zurückgegebene Strings werden in einen Text-Content Block konvertiert.
Wenn Sie ein strukturiertes JSON-Objekt an Claude zurückgeben möchten, kodieren Sie es zu einem JSON-String vor der Rückgabe. Zahlen, Boolesche Werte oder andere nicht-String-Primitive müssen auch in Strings konvertiert werden.

### Iteration über den Tool Runner

Der von `toolRunner()` zurückgegebene Tool Runner ist ein asynchrones Iterable, das Sie mit einer `for await ... of` Schleife durchlaufen können. Dies wird oft als "Tool-Aufrufs-Schleife" bezeichnet.
Jede Loop-Iteration ergibt eine Nachricht, die von Claude zurückgegeben wurde.

Nachdem Ihr Code die aktuelle Nachricht in der Schleife verarbeitet hat, prüft der Tool Runner die Nachricht, um zu sehen, ob Claude eine Tool-Nutzung angefordert hat. Wenn ja, ruft er das Tool auf und sendet das Tool-Ergebnis automatisch an Claude zurück, dann ergibt er die nächste Nachricht von Claude, um die nächste Iteration Ihrer Schleife zu starten.

Sie können die Schleife bei jeder Iteration mit einer einfachen `break` Anweisung beenden. Der Tool Runner wird in einer Schleife laufen, bis Claude eine Nachricht ohne Tool-Nutzung zurückgibt.

Wenn Sie sich nicht um Zwischennachrichten kümmern, können Sie statt einer Schleife einfach auf den Tool Runner warten, was die letzte Nachricht von Claude zurückgibt.

### Erweiterte Verwendung

Innerhalb der Schleife haben Sie die Möglichkeit, die nächste Anfrage des Tool Runners an die Messages API vollständig anzupassen.
Die Methode `runner.generateToolResponse()` ruft das Tool auf (wenn Claude eine Tool-Nutzung ausgelöst hat) und gibt Ihnen Zugriff auf das Tool-Ergebnis, das an die Messages API zurückgesendet wird.
Die Methoden `runner.setMessagesParams()` und `runner.pushMessages()` ermöglichen es Ihnen, die Parameter für die nächste Messages API-Anfrage zu ändern. Die aktuellen Parameter sind unter `runner.params` verfügbar.

```typescript
const runner = anthropic.beta.messages.toolRunner({
  model: 'claude-sonnet-4-5',
  max_tokens: 1024,
  tools: [getWeatherTool],
  messages: [
    { role: 'user', content: "What's the weather in San Francisco?" }
  ]
});

for await (const message of runner) {
  // Get the tool response that will be sent
  const toolResponse = await runner.generateToolResponse();

  // Customize the next request
  runner.setMessagesParams(params => ({
    ...params,
    max_tokens: 2048  // Increase tokens for next request
  }));

  // Or add additional messages
  runner.pushMessages(
    { role: 'user', content: 'Please be concise in your response.' }
  );
}
```

### Streaming

Wenn Sie Streaming mit `stream: true` aktivieren, ist jeder Wert, der vom Tool Runner ausgegeben wird, ein `MessageStream` wie von `anthropic.messages.stream()` zurückgegeben. Der `MessageStream` ist selbst ein asynchrones Iterable, das Streaming-Events von der Messages API ergibt.

Sie können `messageStream.finalMessage()` verwenden, um das SDK die Akkumulation von Streaming-Events in die endgültige Nachricht für Sie durchführen zu lassen.

```typescript
const runner = anthropic.beta.messages.toolRunner({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 1000,
  messages: [{ role: 'user', content: 'What is the weather in San Francisco?' }],
  tools: [calculatorTool],
  stream: true,
});

// When streaming, the runner returns BetaMessageStream
for await (const messageStream of runner) {
  for await (const event of messageStream) {
    console.log('event:', event);
  }
  console.log('message:', await messageStream.finalMessage());
}

console.log(await runner);
```

</Tab>
<Tab title="Ruby">

### Grundlegende Verwendung

Definieren Sie Tools mit `Anthropic::BaseTool` mit einem Input-Schema, dann verwenden Sie `client.beta.messages.tool_runner` um sie auszuführen.

```ruby
require "anthropic"

# Initialize client
client = Anthropic::Client.new

# Define input schema
class GetWeatherInput < Anthropic::BaseModel
  required :location, String, doc: "The city and state, e.g. San Francisco, CA"
  optional :unit, Anthropic::InputSchema::EnumOf["celsius", "fahrenheit"],
           doc: "Temperature unit"
end

# Define tool
class GetWeather < Anthropic::BaseTool
  doc "Get the current weather in a given location"
  input_schema GetWeatherInput

  def call(input)
    # In a full implementation, you'd call a weather API here
    JSON.generate({temperature: "20°C", condition: "Sunny"})
  end
end

class CalculateSumInput < Anthropic::BaseModel
  required :a, Integer, doc: "First number"
  required :b, Integer, doc: "Second number"
end

class CalculateSum < Anthropic::BaseTool
  doc "Add two numbers together"
  input_schema CalculateSumInput

  def call(input)
    (input.a + input.b).to_s
  end
end

# Use the tool runner
runner = client.beta.messages.tool_runner(
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: [GetWeather.new, CalculateSum.new],
  messages: [
    {role: "user", content: "What's the weather like in Paris? Also, what's 15 + 27?"}
  ]
)

runner.each_message do |message|
  message.content.each do |block|
    puts block.text if block.respond_to?(:text)
  end
end
```

Die `call` Methode muss einen String oder einen Content Block Array zurückgeben. Wenn Sie ein strukturiertes JSON-Objekt an Claude zurückgeben möchten, kodieren Sie es zu einem JSON-String vor der Rückgabe.

Die `Anthropic::BaseTool` Klasse verwendet die `doc` Methode für die Tool-Beschreibung und `input_schema` um die erwarteten Parameter zu definieren. Das SDK wird dies automatisch in das entsprechende JSON-Schema-Format konvertieren.

### Iteration über den Tool Runner

Der Tool Runner bietet eine `each_message` Methode, die jede Nachricht ergibt, während das Gespräch fortschreitet. Dies wird oft als "Tool-Aufrufs-Schleife" bezeichnet.

Nachdem Ihr Code die aktuelle Nachricht verarbeitet hat, prüft der Tool Runner, ob Claude eine Tool-Nutzung angefordert hat. Wenn ja, ruft er das Tool auf und sendet das Tool-Ergebnis automatisch an Claude zurück, dann ergibt er die nächste Nachricht.

Wenn Sie sich nicht um Zwischennachrichten kümmern, können Sie die `run_until_finished` Methode verwenden, um alle Nachrichten auf einmal zu erhalten:

```ruby
runner = client.beta.messages.tool_runner(
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: [GetWeather.new, CalculateSum.new],
  messages: [
    {role: "user", content: "What's the weather like in Paris? Also, what's 15 + 27?"}
  ]
)

all_messages = runner.run_until_finished
all_messages.each { |msg| puts msg.content }
```

### Erweiterte Verwendung

Der Tool Runner bietet mehrere Methoden zum Anpassen des Verhaltens:

- `#next_message` - Schreiten Sie manuell durch das Gespräch eine Nachricht nach der anderen
- `#feed_messages` - Injizieren Sie zusätzliche Nachrichten während des Gesprächs
- `#params` - Greifen Sie auf die aktuellen Request-Parameter zu oder ändern Sie sie

```ruby
runner = client.beta.messages.tool_runner(
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: [GetWeather.new],
  messages: [{role: "user", content: "What's the weather in San Francisco?"}]
)

# Manual step-by-step control
message = runner.next_message
puts message.content

# Inject follow-up messages
runner.feed_messages([
  {role: "user", content: "Also check Boston"}
])

# Access current parameters
puts runner.params
```

### Streaming

Wenn Sie Streaming verwenden, iterieren Sie mit `each_streaming` um Echtzeit-Events zu erhalten:

```ruby
runner = client.beta.messages.tool_runner(
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: [CalculateSum.new],
  messages: [{role: "user", content: "What is 15 + 27?"}]
)

runner.each_streaming do |event|
  case event
  when Anthropic::Streaming::TextEvent
    print event.text
  when Anthropic::Streaming::ToolUseEvent
    puts "\nTool called: #{event.tool_name}"
  end
end
```

</Tab>
</Tabs>

<Note>
Der SDK Tool Runner ist in Beta. Der Rest dieses Dokuments behandelt die manuelle Tool-Implementierung.
</Note>

## Steuern der Claude-Ausgabe

### Erzwingung der Tool-Nutzung

In einigen Fällen möchten Sie möglicherweise, dass Claude ein bestimmtes Tool verwendet, um die Frage des Benutzers zu beantworten, auch wenn Claude denkt, dass es eine Antwort ohne die Verwendung eines Tools geben kann. Sie können dies tun, indem Sie das Tool im `tool_choice` Feld wie folgt angeben:

```
tool_choice = {"type": "tool", "name": "get_weather"}
```

Bei der Arbeit mit dem tool_choice Parameter haben wir vier mögliche Optionen:

- `auto` ermöglicht Claude zu entscheiden, ob eines der bereitgestellten Tools aufgerufen werden soll oder nicht. Dies ist der Standardwert, wenn `tools` bereitgestellt werden.
- `any` teilt Claude mit, dass es eines der bereitgestellten Tools verwenden muss, erzwingt aber kein bestimmtes Tool.
- `tool` ermöglicht es uns, Claude zu zwingen, immer ein bestimmtes Tool zu verwenden.
- `none` verhindert, dass Claude Tools verwendet. Dies ist der Standardwert, wenn keine `tools` bereitgestellt werden.

<Note>
Wenn Sie [Prompt-Caching](/docs/de/build-with-claude/prompt-caching#what-invalidates-the-cache) verwenden, werden Änderungen am `tool_choice` Parameter zwischengespeicherte Message-Blöcke ungültig machen. Tool-Definitionen und Systemprompts bleiben zwischengespeichert, aber Message-Inhalte müssen erneut verarbeitet werden.
</Note>

Dieses Diagramm zeigt, wie jede Option funktioniert:

<Frame>
  ![Image](/docs/images/tool_choice.png)
</Frame>

Beachten Sie, dass wenn Sie `tool_choice` als `any` oder `tool` haben, wir die Assistenten-Nachricht vorab ausfüllen, um zu erzwingen, dass ein Tool verwendet wird. Dies bedeutet, dass die Modelle keine natürliche Sprachantwort oder Erklärung vor `tool_use` Content Blöcken ausgeben, auch wenn explizit danach gefragt wird.

<Note>
Wenn Sie [erweitertes Denken](/docs/de/build-with-claude/extended-thinking) mit Tool-Nutzung verwenden, werden `tool_choice: {"type": "any"}` und `tool_choice: {"type": "tool", "name": "..."}` nicht unterstützt und führen zu einem Fehler. Nur `tool_choice: {"type": "auto"}` (der Standard) und `tool_choice: {"type": "none"}` sind mit erweitertem Denken kompatibel.
</Note>

Unsere Tests haben gezeigt, dass dies die Leistung nicht verringern sollte. Wenn Sie möchten, dass das Modell natürlichsprachlichen Kontext oder Erklärungen bietet, während Sie dennoch anfordern, dass das Modell ein bestimmtes Tool verwendet, können Sie `{"type": "auto"}` für `tool_choice` (der Standard) verwenden und explizite Anweisungen in einer `user` Nachricht hinzufügen. Zum Beispiel: `What's the weather like in London? Use the get_weather tool in your response.`

<Tip>
**Garantierte Tool-Aufrufe mit strikten Tools**

Kombinieren Sie `tool_choice: {"type": "any"}` mit [strikter Tool-Nutzung](/docs/de/build-with-claude/structured-outputs) um zu garantieren, dass eines Ihrer Tools aufgerufen wird UND dass die Tool-Eingaben streng Ihrem Schema folgen. Setzen Sie `strict: true` auf Ihren Tool-Definitionen um die Schema-Validierung zu aktivieren.
</Tip>

### JSON-Ausgabe

Tools müssen nicht unbedingt Client-Funktionen sein — Sie können Tools jederzeit verwenden, wenn Sie möchten, dass das Modell JSON-Ausgabe zurückgibt, die einem bereitgestellten Schema folgt. Zum Beispiel könnten Sie ein `record_summary` Tool mit einem bestimmten Schema verwenden. Siehe [Tool-Nutzung mit Claude](/docs/de/agents-and-tools/tool-use/overview) für ein vollständiges funktionierendes Beispiel.

### Modellreaktionen mit Tools

Bei der Verwendung von Tools wird Claude häufig kommentieren, was es tut, oder natürlich auf den Benutzer reagieren, bevor es Tools aufruft.

Beispielsweise könnte Claude bei der Eingabeaufforderung „Wie ist das Wetter in San Francisco gerade, und wie spät ist es dort?" mit folgendem antworten:

```json JSON
{
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "Ich helfe dir, das aktuelle Wetter und die Zeit in San Francisco zu überprüfen."
    },
    {
      "type": "tool_use",
      "id": "toolu_01A09q90qw90lq917835lq9",
      "name": "get_weather",
      "input": {"location": "San Francisco, CA"}
    }
  ]
}
```

Dieser natürliche Antwortstil hilft Benutzern zu verstehen, was Claude tut, und schafft eine konversativere Interaktion. Du kannst den Stil und den Inhalt dieser Antworten durch deine Systemaufforderungen und durch die Bereitstellung von `<examples>` in deinen Aufforderungen steuern.

Es ist wichtig zu beachten, dass Claude verschiedene Formulierungen und Ansätze verwenden kann, wenn es seine Aktionen erklärt. Dein Code sollte diese Antworten wie jeden anderen vom Assistenten generierten Text behandeln und sich nicht auf spezifische Formatierungskonventionen verlassen.

### Parallele Tool-Nutzung

Standardmäßig kann Claude mehrere Tools verwenden, um eine Benutzerabfrage zu beantworten. Du kannst dieses Verhalten deaktivieren durch:

- Setzen von `disable_parallel_tool_use=true`, wenn der tool_choice-Typ `auto` ist, was sicherstellt, dass Claude **höchstens ein** Tool verwendet
- Setzen von `disable_parallel_tool_use=true`, wenn der tool_choice-Typ `any` oder `tool` ist, was sicherstellt, dass Claude **genau ein** Tool verwendet

<section title="Vollständiges Beispiel für parallele Tool-Nutzung">

<Note>
**Einfacher mit Tool Runner**: Das folgende Beispiel zeigt manuelle parallele Tool-Behandlung. Für die meisten Anwendungsfälle verwaltet [tool runner](#tool-runner-beta) die parallele Tool-Ausführung automatisch mit viel weniger Code.
</Note>

Hier ist ein vollständiges Beispiel, das zeigt, wie man parallele Tool-Aufrufe in der Nachrichtenhistorie richtig formatiert:

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# Tools definieren
tools = [
    {
        "name": "get_weather",
        "description": "Rufe das aktuelle Wetter an einem bestimmten Ort ab",
        "input_schema": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "Die Stadt und der Staat, z.B. San Francisco, CA"
                }
            },
            "required": ["location"]
        }
    },
    {
        "name": "get_time",
        "description": "Rufe die aktuelle Zeit in einer bestimmten Zeitzone ab",
        "input_schema": {
            "type": "object",
            "properties": {
                "timezone": {
                    "type": "string",
                    "description": "Die Zeitzone, z.B. America/New_York"
                }
            },
            "required": ["timezone"]
        }
    }
]

# Anfängliche Anfrage
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=tools,
    messages=[
        {
            "role": "user",
            "content": "Wie ist das Wetter in SF und NYC, und wie spät ist es dort?"
        }
    ]
)

# Claudes Antwort mit parallelen Tool-Aufrufen
print("Claude möchte Tools verwenden:", response.stop_reason == "tool_use")
print("Anzahl der Tool-Aufrufe:", len([c for c in response.content if c.type == "tool_use"]))

# Baue die Konversation mit Tool-Ergebnissen auf
messages = [
    {
        "role": "user",
        "content": "Wie ist das Wetter in SF und NYC, und wie spät ist es dort?"
    },
    {
        "role": "assistant",
        "content": response.content  # Enthält mehrere tool_use-Blöcke
    },
    {
        "role": "user",
        "content": [
            {
                "type": "tool_result",
                "tool_use_id": "toolu_01",  # Muss mit der ID aus tool_use übereinstimmen
                "content": "San Francisco: 68°F, teilweise bewölkt"
            },
            {
                "type": "tool_result",
                "tool_use_id": "toolu_02",
                "content": "New York: 45°F, klarer Himmel"
            },
            {
                "type": "tool_result",
                "tool_use_id": "toolu_03",
                "content": "San Francisco Zeit: 14:30 Uhr PST"
            },
            {
                "type": "tool_result",
                "tool_use_id": "toolu_04",
                "content": "New York Zeit: 17:30 Uhr EST"
            }
        ]
    }
]

# Erhalte die endgültige Antwort
final_response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=tools,
    messages=messages
)

print(final_response.content[0].text)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

// Tools definieren
const tools = [
  {
    name: "get_weather",
    description: "Rufe das aktuelle Wetter an einem bestimmten Ort ab",
    input_schema: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "Die Stadt und der Staat, z.B. San Francisco, CA"
        }
      },
      required: ["location"]
    }
  },
  {
    name: "get_time",
    description: "Rufe die aktuelle Zeit in einer bestimmten Zeitzone ab",
    input_schema: {
      type: "object",
      properties: {
        timezone: {
          type: "string",
          description: "Die Zeitzone, z.B. America/New_York"
        }
      },
      required: ["timezone"]
    }
  }
];

// Anfängliche Anfrage
const response = await anthropic.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: tools,
  messages: [
    {
      role: "user",
      content: "Wie ist das Wetter in SF und NYC, und wie spät ist es dort?"
    }
  ]
});

// Baue Konversation mit Tool-Ergebnissen auf
const messages = [
  {
    role: "user",
    content: "Wie ist das Wetter in SF und NYC, und wie spät ist es dort?"
  },
  {
    role: "assistant",
    content: response.content  // Enthält mehrere tool_use-Blöcke
  },
  {
    role: "user",
    content: [
      {
        type: "tool_result",
        tool_use_id: "toolu_01",  // Muss mit der ID aus tool_use übereinstimmen
        content: "San Francisco: 68°F, teilweise bewölkt"
      },
      {
        type: "tool_result",
        tool_use_id: "toolu_02",
        content: "New York: 45°F, klarer Himmel"
      },
      {
        type: "tool_result",
        tool_use_id: "toolu_03",
        content: "San Francisco Zeit: 14:30 Uhr PST"
      },
      {
        type: "tool_result",
        tool_use_id: "toolu_04",
        content: "New York Zeit: 17:30 Uhr EST"
      }
    ]
  }
];

// Erhalte die endgültige Antwort
const finalResponse = await anthropic.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: tools,
  messages: messages
});

console.log(finalResponse.content[0].text);
```
</CodeGroup>

Die Assistentennachricht mit parallelen Tool-Aufrufen würde wie folgt aussehen:

```json
{
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "Ich überprüfe das Wetter und die Zeit für San Francisco und New York City."
    },
    {
      "type": "tool_use",
      "id": "toolu_01",
      "name": "get_weather",
      "input": {"location": "San Francisco, CA"}
    },
    {
      "type": "tool_use",
      "id": "toolu_02",
      "name": "get_weather",
      "input": {"location": "New York, NY"}
    },
    {
      "type": "tool_use",
      "id": "toolu_03",
      "name": "get_time",
      "input": {"timezone": "America/Los_Angeles"}
    },
    {
      "type": "tool_use",
      "id": "toolu_04",
      "name": "get_time",
      "input": {"timezone": "America/New_York"}
    }
  ]
}
```

</section>
<section title="Vollständiges Test-Skript für parallele Tools">

Hier ist ein vollständiges, ausführbares Skript zum Testen und Überprüfen, ob parallele Tool-Aufrufe korrekt funktionieren:

<CodeGroup>
```python Python
#!/usr/bin/env python3
"""Test-Skript zur Überprüfung paralleler Tool-Aufrufe mit der Claude API"""

import os
from anthropic import Anthropic

# Client initialisieren
client = Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

# Tools definieren
tools = [
    {
        "name": "get_weather",
        "description": "Rufe das aktuelle Wetter an einem bestimmten Ort ab",
        "input_schema": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "Die Stadt und der Staat, z.B. San Francisco, CA"
                }
            },
            "required": ["location"]
        }
    },
    {
        "name": "get_time",
        "description": "Rufe die aktuelle Zeit in einer bestimmten Zeitzone ab",
        "input_schema": {
            "type": "object",
            "properties": {
                "timezone": {
                    "type": "string",
                    "description": "Die Zeitzone, z.B. America/New_York"
                }
            },
            "required": ["timezone"]
        }
    }
]

# Test-Konversation mit parallelen Tool-Aufrufen
messages = [
    {
        "role": "user",
        "content": "Wie ist das Wetter in SF und NYC, und wie spät ist es dort?"
    }
]

# Mache anfängliche Anfrage
print("Fordere parallele Tool-Aufrufe an...")
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=messages,
    tools=tools
)

# Überprüfe auf parallele Tool-Aufrufe
tool_uses = [block for block in response.content if block.type == "tool_use"]
print(f"\n✓ Claude hat {len(tool_uses)} Tool-Aufrufe gemacht")

if len(tool_uses) > 1:
    print("✓ Parallele Tool-Aufrufe erkannt!")
    for tool in tool_uses:
        print(f"  - {tool.name}: {tool.input}")
else:
    print("✗ Keine parallelen Tool-Aufrufe erkannt")

# Simuliere Tool-Ausführung und formatiere Ergebnisse korrekt
tool_results = []
for tool_use in tool_uses:
    if tool_use.name == "get_weather":
        if "San Francisco" in str(tool_use.input):
            result = "San Francisco: 68°F, teilweise bewölkt"
        else:
            result = "New York: 45°F, klarer Himmel"
    else:  # get_time
        if "Los_Angeles" in str(tool_use.input):
            result = "14:30 Uhr PST"
        else:
            result = "17:30 Uhr EST"

    tool_results.append({
        "type": "tool_result",
        "tool_use_id": tool_use.id,
        "content": result
    })

# Setze Konversation mit Tool-Ergebnissen fort
messages.extend([
    {"role": "assistant", "content": response.content},
    {"role": "user", "content": tool_results}  # Alle Ergebnisse in einer Nachricht!
])

# Erhalte endgültige Antwort
print("\nErhalte endgültige Antwort...")
final_response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=messages,
    tools=tools
)

print(f"\nClaudes Antwort:\n{final_response.content[0].text}")

# Überprüfe Formatierung
print("\n--- Überprüfung ---")
print(f"✓ Tool-Ergebnisse in einzelner Benutzernachricht gesendet: {len(tool_results)} Ergebnisse")
print("✓ Kein Text vor Tool-Ergebnissen im Content-Array")
print("✓ Konversation korrekt formatiert für zukünftige parallele Tool-Nutzung")
```

```typescript TypeScript
#!/usr/bin/env node
// Test-Skript zur Überprüfung paralleler Tool-Aufrufe mit der Claude API

import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Tools definieren
const tools = [
  {
    name: "get_weather",
    description: "Rufe das aktuelle Wetter an einem bestimmten Ort ab",
    input_schema: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "Die Stadt und der Staat, z.B. San Francisco, CA"
        }
      },
      required: ["location"]
    }
  },
  {
    name: "get_time",
    description: "Rufe die aktuelle Zeit in einer bestimmten Zeitzone ab",
    input_schema: {
      type: "object",
      properties: {
        timezone: {
          type: "string",
          description: "Die Zeitzone, z.B. America/New_York"
        }
      },
      required: ["timezone"]
    }
  }
];

async function testParallelTools() {
  // Mache anfängliche Anfrage
  console.log("Fordere parallele Tool-Aufrufe an...");
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    messages: [{
      role: "user",
      content: "Wie ist das Wetter in SF und NYC, und wie spät ist es dort?"
    }],
    tools: tools
  });

  // Überprüfe auf parallele Tool-Aufrufe
  const toolUses = response.content.filter(block => block.type === "tool_use");
  console.log(`\n✓ Claude hat ${toolUses.length} Tool-Aufrufe gemacht`);

  if (toolUses.length > 1) {
    console.log("✓ Parallele Tool-Aufrufe erkannt!");
    toolUses.forEach(tool => {
      console.log(`  - ${tool.name}: ${JSON.stringify(tool.input)}`);
    });
  } else {
    console.log("✗ Keine parallelen Tool-Aufrufe erkannt");
  }

  // Simuliere Tool-Ausführung und formatiere Ergebnisse korrekt
  const toolResults = toolUses.map(toolUse => {
    let result;
    if (toolUse.name === "get_weather") {
      result = toolUse.input.location.includes("San Francisco")
        ? "San Francisco: 68°F, teilweise bewölkt"
        : "New York: 45°F, klarer Himmel";
    } else {
      result = toolUse.input.timezone.includes("Los_Angeles")
        ? "14:30 Uhr PST"
        : "17:30 Uhr EST";
    }

    return {
      type: "tool_result",
      tool_use_id: toolUse.id,
      content: result
    };
  });

  // Erhalte endgültige Antwort mit korrekter Formatierung
  console.log("\nErhalte endgültige Antwort...");
  const finalResponse = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    messages: [
      { role: "user", content: "Wie ist das Wetter in SF und NYC, und wie spät ist es dort?" },
      { role: "assistant", content: response.content },
      { role: "user", content: toolResults }  // Alle Ergebnisse in einer Nachricht!
    ],
    tools: tools
  });

  console.log(`\nClaudes Antwort:\n${finalResponse.content[0].text}`);

  // Überprüfe Formatierung
  console.log("\n--- Überprüfung ---");
  console.log(`✓ Tool-Ergebnisse in einzelner Benutzernachricht gesendet: ${toolResults.length} Ergebnisse`);
  console.log("✓ Kein Text vor Tool-Ergebnissen im Content-Array");
  console.log("✓ Konversation korrekt formatiert für zukünftige parallele Tool-Nutzung");
}

testParallelTools().catch(console.error);
```
</CodeGroup>

Dieses Skript demonstriert:
- Wie man parallele Tool-Aufrufe und Ergebnisse richtig formatiert
- Wie man überprüft, dass parallele Aufrufe gemacht werden
- Die korrekte Nachrichtenstruktur, die zukünftige parallele Tool-Nutzung fördert
- Häufige Fehler, die vermieden werden sollten (wie Text vor Tool-Ergebnissen)

Führe dieses Skript aus, um deine Implementierung zu testen und sicherzustellen, dass Claude parallele Tool-Aufrufe effektiv macht.

</section>

#### Maximierung der parallelen Tool-Nutzung

Während Claude 4-Modelle standardmäßig hervorragende Fähigkeiten zur parallelen Tool-Nutzung haben, kannst du die Wahrscheinlichkeit der parallelen Tool-Ausführung über alle Modelle hinweg mit gezieltem Prompting erhöhen:

<section title="Systemaufforderungen für parallele Tool-Nutzung">

Für Claude 4-Modelle (Opus 4 und Sonnet 4) füge dies zu deiner Systemaufforderung hinzu:
```text
Für maximale Effizienz, wenn du mehrere unabhängige Operationen durchführen musst, rufe alle relevanten Tools gleichzeitig auf, anstatt sie nacheinander zu verwenden.
```

Für noch stärkere parallele Tool-Nutzung (empfohlen, wenn das Standard nicht ausreicht), verwende:
```text
<use_parallel_tool_calls>
Für maximale Effizienz, wenn du mehrere unabhängige Operationen durchführst, rufe alle relevanten Tools gleichzeitig auf, anstatt sie nacheinander zu verwenden. Priorisiere das gleichzeitige Aufrufen von Tools, wenn möglich. Wenn du beispielsweise 3 Dateien lesen musst, führe 3 Tool-Aufrufe parallel aus, um alle 3 Dateien gleichzeitig in den Kontext zu laden. Wenn du mehrere schreibgeschützte Befehle wie `ls` oder `list_dir` ausführst, führe immer alle Befehle parallel aus. Bevorzuge die Maximierung paralleler Tool-Aufrufe gegenüber der Ausführung zu vieler Tools nacheinander.
</use_parallel_tool_calls>
```

</section>
<section title="Benutzer-Nachricht-Prompting">

Du kannst auch parallele Tool-Nutzung innerhalb spezifischer Benutzernachrichten fördern:

```python
# Statt:
"Wie ist das Wetter in Paris? Überprüfe auch London."

# Verwende:
"Überprüfe das Wetter in Paris und London gleichzeitig."

# Oder sei explizit:
"Bitte verwende parallele Tool-Aufrufe, um das Wetter für Paris, London und Tokio gleichzeitig zu erhalten."
```

</section>

<Warning>
**Parallele Tool-Nutzung mit Claude Sonnet 3.7**

Claude Sonnet 3.7 ist möglicherweise weniger wahrscheinlich, parallele Tool-Aufrufe in einer Antwort zu machen, auch wenn du `disable_parallel_tool_use` nicht gesetzt hast. Wir empfehlen [ein Upgrade auf Claude 4-Modelle](/docs/de/about-claude/models/migrating-to-claude-4), die eingebaute token-effiziente Tool-Nutzung und verbesserte parallele Tool-Aufrufe haben.

Wenn du noch Claude Sonnet 3.7 verwendest, kannst du den `token-efficient-tools-2025-02-19` [Beta-Header](/docs/de/api/beta-headers) aktivieren, der Claude hilft, parallele Tools zu verwenden. Du kannst auch ein „Batch-Tool" einführen, das als Meta-Tool fungiert, um Aufrufe zu anderen Tools gleichzeitig zu wrappen.

Siehe [dieses Beispiel](https://github.com/anthropics/anthropic-cookbook/blob/main/tool_use/parallel_tools_claude_3_7_sonnet.ipynb) in unserem Cookbook, um zu erfahren, wie du diesen Workaround verwendest.

</Warning>

## Behandlung von Tool-Nutzungs- und Tool-Ergebnis-Content-Blöcken

<Note>
**Einfacher mit Tool Runner**: Die manuelle Tool-Behandlung, die in diesem Abschnitt beschrieben wird, wird automatisch von [tool runner](#tool-runner-beta) verwaltet. Verwende diesen Abschnitt, wenn du benutzerdefinierte Kontrolle über die Tool-Ausführung benötigst.
</Note>

Claudes Antwort unterscheidet sich je nachdem, ob es ein Client-Tool oder Server-Tool verwendet.

### Behandlung von Ergebnissen aus Client-Tools

Die Antwort hat einen `stop_reason` von `tool_use` und einen oder mehrere `tool_use` Content-Blöcke, die Folgendes enthalten:

- `id`: Ein eindeutiger Bezeichner für diesen bestimmten Tool-Use-Block. Dies wird später verwendet, um die Tool-Ergebnisse abzugleichen.
- `name`: Der Name des verwendeten Tools.
- `input`: Ein Objekt, das die an das Tool übergebene Eingabe enthält und dem `input_schema` des Tools entspricht.

<section title="Beispiel-API-Antwort mit einem `tool_use` Content-Block">

```json JSON
{
  "id": "msg_01Aq9w938a90dw8q",
  "model": "claude-sonnet-4-5",
  "stop_reason": "tool_use",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "Ich überprüfe das aktuelle Wetter in San Francisco für dich."
    },
    {
      "type": "tool_use",
      "id": "toolu_01A09q90qw90lq917835lq9",
      "name": "get_weather",
      "input": {"location": "San Francisco, CA", "unit": "celsius"}
    }
  ]
}
```

</section>

Wenn du eine Tool-Use-Antwort für ein Client-Tool erhältst, solltest du:

1. Den `name`, `id` und `input` aus dem `tool_use` Block extrahieren.
2. Das tatsächliche Tool in deiner Codebasis ausführen, das diesem Tool-Namen entspricht, und die Tool-`input` übergeben.
3. Die Konversation fortsetzen, indem du eine neue Nachricht mit der `role` von `user` sendest und einen `content` Block mit dem `tool_result` Typ und den folgenden Informationen enthältst:
   - `tool_use_id`: Die `id` der Tool-Use-Anfrage, für die dies ein Ergebnis ist.
   - `content`: Das Ergebnis des Tools als String (z.B. `"content": "15 Grad"`), eine Liste verschachtelter Content-Blöcke (z.B. `"content": [{"type": "text", "text": "15 Grad"}]`) oder eine Liste von Dokument-Blöcken (z.B. `"content": ["type": "document", "source": {"type": "text", "media_type": "text/plain", "data": "15 Grad"}]`). Diese Content-Blöcke können die Typen `text`, `image` oder `document` verwenden.
   - `is_error` (optional): Setze auf `true`, wenn die Tool-Ausführung zu einem Fehler führte.

<Note>
**Wichtige Formatierungsanforderungen**:
- Tool-Ergebnis-Blöcke müssen unmittelbar nach ihren entsprechenden Tool-Use-Blöcken in der Nachrichtenhistorie folgen. Du kannst keine Nachrichten zwischen der Tool-Use-Nachricht des Assistenten und der Tool-Ergebnis-Nachricht des Benutzers einfügen.
- In der Benutzernachricht, die Tool-Ergebnisse enthält, müssen die tool_result-Blöcke ZUERST im Content-Array stehen. Jeder Text muss NACH allen Tool-Ergebnissen kommen.

Beispielsweise wird dies einen 400-Fehler verursachen:
```json
{"role": "user", "content": [
  {"type": "text", "text": "Hier sind die Ergebnisse:"},  // ❌ Text vor tool_result
  {"type": "tool_result", "tool_use_id": "toolu_01", ...}
]}
```

Dies ist korrekt:
```json
{"role": "user", "content": [
  {"type": "tool_result", "tool_use_id": "toolu_01", ...},
  {"type": "text", "text": "Was sollte ich als nächstes tun?"}  // ✅ Text nach tool_result
]}
```

Wenn du einen Fehler wie „tool_use ids were found without tool_result blocks immediately after" erhältst, überprüfe, dass deine Tool-Ergebnisse korrekt formatiert sind.
</Note>

<section title="Beispiel eines erfolgreichen Tool-Ergebnisses">

```json JSON
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "15 Grad"
    }
  ]
}
```

</section>

<section title="Beispiel eines Tool-Ergebnisses mit Bildern">

```json JSON
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": [
        {"type": "text", "text": "15 Grad"},
        {
          "type": "image",
          "source": {
            "type": "base64",
            "media_type": "image/jpeg",
            "data": "/9j/4AAQSkZJRg...",
          }
        }
      ]
    }
  ]
}
```

</section>
<section title="Beispiel eines leeren Tool-Ergebnisses">

```json JSON
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
    }
  ]
}
```

</section>

<section title="Beispiel eines Tool-Ergebnisses mit Dokumenten">

```json JSON
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": [
        {"type": "text", "text": "Das Wetter ist"},
        {
          "type": "document",
          "source": {
            "type": "text",
            "media_type": "text/plain",
            "data": "15 Grad"
          }
        }
      ]
    }
  ]
}
```

</section>

Nach Erhalt des Tool-Ergebnisses wird Claude diese Informationen verwenden, um eine Antwort auf die ursprüngliche Benutzeraufforderung zu generieren.

### Behandlung von Ergebnissen aus Server-Tools

Claude führt das Tool intern aus und integriert die Ergebnisse direkt in seine Antwort, ohne dass zusätzliche Benutzerinteraktion erforderlich ist.

<Tip>
  **Unterschiede zu anderen APIs**

Im Gegensatz zu APIs, die Tool-Nutzung trennen oder spezielle Rollen wie `tool` oder `function` verwenden, integriert die Claude API Tools direkt in die `user` und `assistant` Nachrichtenstruktur.

Nachrichten enthalten Arrays von `text`, `image`, `tool_use` und `tool_result` Blöcken. `user` Nachrichten enthalten Client-Content und `tool_result`, während `assistant` Nachrichten KI-generierte Inhalte und `tool_use` enthalten.

</Tip>

### Behandlung des `max_tokens` Stop-Grundes

Wenn Claudes [Antwort aufgrund des Erreichens des `max_tokens` Limits abgeschnitten wird](/docs/de/build-with-claude/handling-stop-reasons#max-tokens) und die abgeschnittene Antwort einen unvollständigen Tool-Use-Block enthält, musst du die Anfrage mit einem höheren `max_tokens` Wert erneut versuchen, um den vollständigen Tool-Use zu erhalten.

<CodeGroup>
```python Python
# Überprüfe, ob die Antwort während der Tool-Nutzung abgeschnitten wurde
if response.stop_reason == "max_tokens":
    # Überprüfe, ob der letzte Content-Block ein unvollständiger tool_use ist
    last_block = response.content[-1]
    if last_block.type == "tool_use":
        # Sende die Anfrage mit höherem max_tokens
        response = client.messages.create(
            model="claude-sonnet-4-5",
            max_tokens=4096,  # Erhöhtes Limit
            messages=messages,
            tools=tools
        )
```

```typescript TypeScript
// Überprüfe, ob die Antwort während der Tool-Nutzung abgeschnitten wurde
if (response.stop_reason === "max_tokens") {
  // Überprüfe, ob der letzte Content-Block ein unvollständiger tool_use ist
  const lastBlock = response.content[response.content.length - 1];
  if (lastBlock.type === "tool_use") {
    // Sende die Anfrage mit höherem max_tokens
    response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 4096, // Erhöhtes Limit
      messages: messages,
      tools: tools
    });
  }
}
```
</CodeGroup>

#### Behandlung des `pause_turn` Stop-Grundes

Bei der Verwendung von Server-Tools wie Web Search kann die API einen `pause_turn` Stop-Grund zurückgeben, was anzeigt, dass die API einen langen Zug pausiert hat.

Hier ist, wie man den `pause_turn` Stop-Grund behandelt:

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# Anfängliche Anfrage mit Web Search
response = client.messages.create(
    model="claude-3-7-sonnet-latest",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": "Suche nach umfassenden Informationen über Durchbrüche in der Quantencomputer im Jahr 2025"
        }
    ],
    tools=[{
        "type": "web_search_20250305",
        "name": "web_search",
        "max_uses": 10
    }]
)

# Überprüfe, ob die Antwort einen pause_turn Stop-Grund hat
if response.stop_reason == "pause_turn":
    # Setze die Konversation mit dem pausierten Inhalt fort
    messages = [
        {"role": "user", "content": "Suche nach umfassenden Informationen über Durchbrüche in der Quantencomputer im Jahr 2025"},
        {"role": "assistant", "content": response.content}
    ]

    # Sende die Fortsetzungsanfrage
    continuation = client.messages.create(
        model="claude-3-7-sonnet-latest",
        max_tokens=1024,
        messages=messages,
        tools=[{
            "type": "web_search_20250305",
            "name": "web_search",
            "max_uses": 10
        }]
    )

    print(continuation)
else:
    print(response)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

// Anfängliche Anfrage mit Web Search
const response = await anthropic.messages.create({
  model: "claude-3-7-sonnet-latest",
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: "Suche nach umfassenden Informationen über Durchbrüche in der Quantencomputer im Jahr 2025"
    }
  ],
  tools: [{
    type: "web_search_20250305",
    name: "web_search",
    max_uses: 10
  }]
});

// Überprüfe, ob die Antwort einen pause_turn Stop-Grund hat
if (response.stop_reason === "pause_turn") {
  // Setze die Konversation mit dem pausierten Inhalt fort
  const messages = [
    { role: "user", content: "Suche nach umfassenden Informationen über Durchbrüche in der Quantencomputer im Jahr 2025" },
    { role: "assistant", content: response.content }
  ];

  // Sende die Fortsetzungsanfrage
  const continuation = await anthropic.messages.create({
    model: "claude-3-7-sonnet-latest",
    max_tokens: 1024,
    messages: messages,
    tools: [{
      type: "web_search_20250305",
      name: "web_search",
      max_uses: 10
    }]
  });

  console.log(continuation);
} else {
  console.log(response);
}
```
</CodeGroup>

Bei der Behandlung von `pause_turn`:
- **Setze die Konversation fort**: Übergebe die pausierte Antwort wie sie ist in einer nachfolgenden Anfrage, um Claude seinen Zug fortsetzen zu lassen
- **Modifiziere bei Bedarf**: Du kannst den Inhalt optional vor der Fortsetzung modifizieren, wenn du die Konversation unterbrechen oder umleiten möchtest
- **Bewahre den Tool-Status**: Füge die gleichen Tools in die Fortsetzungsanfrage ein, um die Funktionalität zu erhalten

## Fehlerbehebung

<Note>
**Eingebaute Fehlerbehandlung**: [Tool runner](#tool-runner-beta) bietet automatische Fehlerbehandlung für die meisten häufigen Szenarien. Dieser Abschnitt behandelt manuelle Fehlerbehandlung für fortgeschrittene Anwendungsfälle.
</Note>

Es gibt verschiedene Arten von Fehlern, die bei der Verwendung von Tools mit Claude auftreten können:

<section title="Tool-Ausführungsfehler">

Wenn das Tool selbst während der Ausführung einen Fehler wirft (z.B. ein Netzwerkfehler beim Abrufen von Wetterdaten), kannst du die Fehlermeldung im `content` zusammen mit `"is_error": true` zurückgeben:

```json JSON
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "ConnectionError: Der Wetterdienst-API ist nicht verfügbar (HTTP 500)",
      "is_error": true
    }
  ]
}
```

Claude wird dann diesen Fehler in seine Antwort an den Benutzer einbeziehen, z.B. „Entschuldigung, ich konnte das aktuelle Wetter nicht abrufen, da der Wetterdienst-API nicht verfügbar ist. Bitte versuche es später erneut."

</section>
<section title="Ungültiger Tool-Name">

Wenn Claudes versuchte Verwendung eines Tools ungültig ist (z.B. fehlende erforderliche Parameter), bedeutet dies normalerweise, dass nicht genug Informationen vorhanden waren, damit Claude das Tool korrekt verwendet. Dein bester Ansatz während der Entwicklung ist, die Anfrage erneut mit detaillierteren `description` Werten in deinen Tool-Definitionen zu versuchen.

Du kannst die Konversation aber auch mit einem `tool_result` fortsetzen, das den Fehler anzeigt, und Claude wird versuchen, das Tool erneut mit den fehlenden Informationen zu verwenden:

```json JSON
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Fehler: Erforderlicher Parameter 'location' fehlt",
      "is_error": true
    }
  ]
}
```

Wenn eine Tool-Anfrage ungültig ist oder Parameter fehlen, wird Claude 2-3 Mal mit Korrektionen erneut versuchen, bevor er sich beim Benutzer entschuldigt.

<Tip>
Um ungültige Tool-Aufrufe vollständig zu eliminieren, verwende [strikte Tool-Nutzung](/docs/de/build-with-claude/structured-outputs) mit `strict: true` in deinen Tool-Definitionen. Dies garantiert, dass Tool-Eingaben immer genau deinem Schema entsprechen, was fehlende Parameter und Typ-Nichtübereinstimmungen verhindert.
</Tip>

</section>
<section title="<search_quality_reflection> Tags">

Um zu verhindern, dass Claude mit \<search_quality_reflection> Tags über die Suchqualität nachdenkt, füge „Do not reflect on the quality of the returned search results in your response" zu deiner Aufforderung hinzu.

</section>
<section title="Server-Tool-Fehler">

Wenn Server-Tools auf Fehler stoßen (z.B. Netzwerkprobleme mit Web Search), wird Claude diese Fehler transparent behandeln und versuchen, eine alternative Antwort oder Erklärung für den Benutzer bereitzustellen. Im Gegensatz zu Client-Tools musst du `is_error` Ergebnisse für Server-Tools nicht behandeln.

Für Web Search sind mögliche Fehlercodes:
- `too_many_requests`: Rate Limit überschritten
- `invalid_input`: Ungültiger Suchquery-Parameter
- `max_uses_exceeded`: Maximale Web-Search-Tool-Nutzungen überschritten
- `query_too_long`: Query überschreitet maximale Länge
- `unavailable`: Ein interner Fehler ist aufgetreten

</section>
<section title="Parallele Tool-Aufrufe funktionieren nicht">

Wenn Claude nicht wie erwartet parallele Tool-Aufrufe macht, überprüfe diese häufigen Probleme:

**1. Falsche Tool-Ergebnis-Formatierung**

Das häufigste Problem ist die falsche Formatierung von Tool-Ergebnissen in der Konversationshistorie. Dies „lehrt" Claude, parallele Aufrufe zu vermeiden.

Speziell für parallele Tool-Nutzung:
- ❌ **Falsch**: Senden separater Benutzernachrichten für jedes Tool-Ergebnis
- ✅ **Richtig**: Alle Tool-Ergebnisse müssen in einer einzelnen Benutzernachricht sein

```json
// ❌ Dies reduziert parallele Tool-Nutzung
[
  {"role": "assistant", "content": [tool_use_1, tool_use_2]},
  {"role": "user", "content": [tool_result_1]},
  {"role": "user", "content": [tool_result_2]}  // Separate Nachricht
]

// ✅ Dies erhält parallele Tool-Nutzung
[
  {"role": "assistant", "content": [tool_use_1, tool_use_2]},
  {"role": "user", "content": [tool_result_1, tool_result_2]}  // Einzelne Nachricht
]
```

Siehe die [allgemeinen Formatierungsanforderungen oben](#handling-tool-use-and-tool-result-content-blocks) für andere Formatierungsregeln.

**2. Schwaches Prompting**

Standard-Prompting ist möglicherweise nicht ausreichend. Verwende stärkere Sprache:

```text
<use_parallel_tool_calls>
Für maximale Effizienz, wenn du mehrere unabhängige Operationen durchführst,
rufe alle relevanten Tools gleichzeitig auf, anstatt sie nacheinander zu verwenden.
Priorisiere das gleichzeitige Aufrufen von Tools, wenn möglich.
</use_parallel_tool_calls>
```

**3. Messung der parallelen Tool-Nutzung**

Um zu überprüfen, dass parallele Tool-Aufrufe funktionieren:

```python
# Berechne durchschnittliche Tools pro Tool-Aufrufs-Nachricht
tool_call_messages = [msg for msg in messages if any(
    block.type == "tool_use" for block in msg.content
)]
total_tool_calls = sum(
    len([b for b in msg.content if b.type == "tool_use"])
    for msg in tool_call_messages
)
avg_tools_per_message = total_tool_calls / len(tool_call_messages)
print(f"Durchschnittliche Tools pro Nachricht: {avg_tools_per_message}")
# Sollte > 1.0 sein, wenn parallele Aufrufe funktionieren
```

**4. Modellspezifisches Verhalten**

- Claude Opus 4.5, Opus 4.1 und Sonnet 4: Zeichnen sich durch parallele Tool-Nutzung mit minimalem Prompting aus
- Claude Sonnet 3.7: Benötigt möglicherweise stärkeres Prompting oder den `token-efficient-tools-2025-02-19` [Beta-Header](/docs/de/api/beta-headers). Erwäge [ein Upgrade auf Claude 4](/docs/de/about-claude/models/migrating-to-claude-4).
- Claude Haiku: Weniger wahrscheinlich, parallele Tools ohne explizites Prompting zu verwenden

</section>