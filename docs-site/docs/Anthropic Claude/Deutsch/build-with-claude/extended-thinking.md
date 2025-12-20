# Mit erweitertem Denken bauen

Erweitertes Denken gibt Claude verbesserte Denkfähigkeiten für komplexe Aufgaben, während es unterschiedliche Transparenzstufen in seinen schrittweisen Denkprozess vor der endgültigen Antwort bietet.

---

Erweitertes Denken gibt Claude verbesserte Denkfähigkeiten für komplexe Aufgaben, während es unterschiedliche Transparenzstufen in seinen schrittweisen Denkprozess vor der endgültigen Antwort bietet.

## Unterstützte Modelle

Erweitertes Denken wird in den folgenden Modellen unterstützt:

- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Sonnet 3.7 (`claude-3-7-sonnet-20250219`) ([veraltet](/docs/de/about-claude/model-deprecations))
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)
- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)

<Note>
Das API-Verhalten unterscheidet sich zwischen Claude Sonnet 3.7 und Claude 4 Modellen, aber die API-Strukturen bleiben genau gleich.

Weitere Informationen finden Sie unter [Unterschiede beim Denken zwischen Modellversionen](#differences-in-thinking-across-model-versions).
</Note>

## Wie erweitertes Denken funktioniert

Wenn erweitertes Denken aktiviert ist, erstellt Claude `thinking` Inhaltsblöcke, in denen es sein internes Denken ausgibt. Claude bezieht Erkenntnisse aus diesem Denken ein, bevor es eine endgültige Antwort formuliert.

Die API-Antwort enthält `thinking` Inhaltsblöcke, gefolgt von `text` Inhaltsblöcken.

Hier ist ein Beispiel des Standard-Antwortformats:

```json
{
  "content": [
    {
      "type": "thinking",
      "thinking": "Lassen Sie mich das Schritt für Schritt analysieren...",
      "signature": "WaUjzkypQ2mUEVM36O2TxuC06KN8xyfbJwyem2dw3URve/op91XWHOEBLLqIOMfFG/UvLEczmEsUjavL...."
    },
    {
      "type": "text",
      "text": "Basierend auf meiner Analyse..."
    }
  ]
}
```

Weitere Informationen zum Antwortformat des erweiterten Denkens finden Sie in der [Messages API Referenz](/docs/de/api/messages).

## Wie man erweitertes Denken verwendet

Hier ist ein Beispiel für die Verwendung von erweitertem Denken in der Messages API:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 16000,
    "thinking": {
        "type": "enabled",
        "budget_tokens": 10000
    },
    "messages": [
        {
            "role": "user",
            "content": "Gibt es unendlich viele Primzahlen, so dass n mod 4 == 3?"
        }
    ]
}'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    messages=[{
        "role": "user",
        "content": "Gibt es unendlich viele Primzahlen, so dass n mod 4 == 3?"
    }]
)

# Die Antwort enthält zusammengefasste Denkblöcke und Textblöcke
for block in response.content:
    if block.type == "thinking":
        print(f"\nDenkzusammenfassung: {block.thinking}")
    elif block.type == "text":
        print(f"\nAntwort: {block.text}")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 16000,
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  messages: [{
    role: "user",
    content: "Gibt es unendlich viele Primzahlen, so dass n mod 4 == 3?"
  }]
});

// Die Antwort enthält zusammengefasste Denkblöcke und Textblöcke
for (const block of response.content) {
  if (block.type === "thinking") {
    console.log(`\nDenkzusammenfassung: ${block.thinking}`);
  } else if (block.type === "text") {
    console.log(`\nAntwort: ${block.text}`);
  }
}
```

```java Java
import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.beta.messages.*;
import com.anthropic.models.beta.messages.MessageCreateParams;
import com.anthropic.models.messages.*;

public class SimpleThinkingExample {
    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        BetaMessage response = client.beta().messages().create(
                MessageCreateParams.builder()
                        .model(Model.CLAUDE_OPUS_4_0)
                        .maxTokens(16000)
                        .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(10000).build())
                        .addUserMessage("Gibt es unendlich viele Primzahlen, so dass n mod 4 == 3?")
                        .build()
        );

        System.out.println(response);
    }
}
```

</CodeGroup>

Um erweitertes Denken zu aktivieren, fügen Sie ein `thinking` Objekt hinzu, wobei der `type` Parameter auf `enabled` und `budget_tokens` auf ein angegebenes Token-Budget für erweitertes Denken gesetzt wird.

Der `budget_tokens` Parameter bestimmt die maximale Anzahl von Token, die Claude für seinen internen Denkprozess verwenden darf. Bei Claude 4 Modellen gilt diese Grenze für vollständige Denk-Token und nicht für [die zusammengefasste Ausgabe](#summarized-thinking). Größere Budgets können die Antwortqualität verbessern, indem sie eine gründlichere Analyse für komplexe Probleme ermöglichen, obwohl Claude möglicherweise nicht das gesamte zugewiesene Budget nutzt, besonders bei Bereichen über 32k.

`budget_tokens` muss auf einen Wert kleiner als `max_tokens` gesetzt werden. Bei Verwendung von [verschachteltem Denken mit Tools](#interleaved-thinking) können Sie diese Grenze jedoch überschreiten, da die Token-Grenze zu Ihrem gesamten Kontextfenster wird (200k Token).

### Zusammengefasstes Denken

Mit aktiviertem erweitertem Denken gibt die Messages API für Claude 4 Modelle eine Zusammenfassung von Claudes vollständigem Denkprozess zurück. Zusammengefasstes Denken bietet die vollständigen Intelligenzvorteile des erweiterten Denkens, während es Missbrauch verhindert.

Hier sind einige wichtige Überlegungen für zusammengefasstes Denken:

- Sie werden für die vollständigen Denk-Token berechnet, die durch die ursprüngliche Anfrage generiert wurden, nicht für die Zusammenfassungs-Token.
- Die abgerechnete Ausgabe-Token-Anzahl wird **nicht** mit der Anzahl der Token übereinstimmen, die Sie in der Antwort sehen.
- Die ersten Zeilen der Denkausgabe sind ausführlicher und bieten detailliertes Denken, das besonders für Prompt-Engineering-Zwecke hilfreich ist.
- Während Anthropic versucht, die Funktion des erweiterten Denkens zu verbessern, unterliegt das Zusammenfassungsverhalten Änderungen.
- Die Zusammenfassung bewahrt die Schlüsselideen von Claudes Denkprozess mit minimaler zusätzlicher Latenz, was ein streambares Benutzererlebnis und eine einfache Migration von Claude Sonnet 3.7 zu Claude 4 Modellen ermöglicht.
- Die Zusammenfassung wird von einem anderen Modell verarbeitet als dem, das Sie in Ihren Anfragen anvisieren. Das Denkmodell sieht die zusammengefasste Ausgabe nicht.

<Note>
Claude Sonnet 3.7 gibt weiterhin vollständige Denkausgabe zurück.

In seltenen Fällen, in denen Sie Zugriff auf vollständige Denkausgabe für Claude 4 Modelle benötigen, [kontaktieren Sie unser Verkaufsteam](mailto:sales@anthropic.com).
</Note>

### Streaming-Denken

Sie können Antworten mit erweitertem Denken mit [Server-Sent Events (SSE)](https://developer.mozilla.org/en-US/Web/API/Server-sent%5Fevents/Using%5Fserver-sent%5Fevents) streamen.

Wenn Streaming für erweitertes Denken aktiviert ist, erhalten Sie Denkinhalte über `thinking_delta` Events.

Weitere Dokumentation zum Streaming über die Messages API finden Sie unter [Streaming Messages](/docs/de/build-with-claude/streaming).

Hier ist, wie man Streaming mit Denken handhabt:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 16000,
    "stream": true,
    "thinking": {
        "type": "enabled",
        "budget_tokens": 10000
    },
    "messages": [
        {
            "role": "user",
            "content": "Was ist 27 * 453?"
        }
    ]
}'
```

```python Python
import anthropic

client = anthropic.Anthropic()

with client.messages.stream(
    model="claude-sonnet-4-5",
    max_tokens=16000,
    thinking={"type": "enabled", "budget_tokens": 10000},
    messages=[{"role": "user", "content": "Was ist 27 * 453?"}],
) as stream:
    thinking_started = False
    response_started = False

    for event in stream:
        if event.type == "content_block_start":
            print(f"\nStarting {event.content_block.type} block...")
            # Flags für jeden neuen Block zurücksetzen
            thinking_started = False
            response_started = False
        elif event.type == "content_block_delta":
            if event.delta.type == "thinking_delta":
                if not thinking_started:
                    print("Denken: ", end="", flush=True)
                    thinking_started = True
                print(event.delta.thinking, end="", flush=True)
            elif event.delta.type == "text_delta":
                if not response_started:
                    print("Antwort: ", end="", flush=True)
                    response_started = True
                print(event.delta.text, end="", flush=True)
        elif event.type == "content_block_stop":
            print("\nBlock complete.")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const stream = await client.messages.stream({
  model: "claude-sonnet-4-5",
  max_tokens: 16000,
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  messages: [{
    role: "user",
    content: "Was ist 27 * 453?"
  }]
});

let thinkingStarted = false;
let responseStarted = false;

for await (const event of stream) {
  if (event.type === 'content_block_start') {
    console.log(`\nStarting ${event.content_block.type} block...`);
    // Flags für jeden neuen Block zurücksetzen
    thinkingStarted = false;
    responseStarted = false;
  } else if (event.type === 'content_block_delta') {
    if (event.delta.type === 'thinking_delta') {
      if (!thinkingStarted) {
        process.stdout.write('Denken: ');
        thinkingStarted = true;
      }
      process.stdout.write(event.delta.thinking);
    } else if (event.delta.type === 'text_delta') {
      if (!responseStarted) {
        process.stdout.write('Antwort: ');
        responseStarted = true;
      }
      process.stdout.write(event.delta.text);
    }
  } else if (event.type === 'content_block_stop') {
    console.log('\nBlock complete.');
  }
}
```

```java Java
import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.http.StreamResponse;
import com.anthropic.models.beta.messages.MessageCreateParams;
import com.anthropic.models.beta.messages.BetaRawMessageStreamEvent;
import com.anthropic.models.beta.messages.BetaThinkingConfigEnabled;
import com.anthropic.models.messages.Model;

public class SimpleThinkingStreamingExample {
    private static boolean thinkingStarted = false;
    private static boolean responseStarted = false;
    
    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        MessageCreateParams createParams = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_0)
                .maxTokens(16000)
                .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(10000).build())
                .addUserMessage("Was ist 27 * 453?")
                .build();

        try (StreamResponse<BetaRawMessageStreamEvent> streamResponse =
                     client.beta().messages().createStreaming(createParams)) {
            streamResponse.stream()
                    .forEach(event -> {
                        if (event.isContentBlockStart()) {
                            System.out.printf("\nStarting %s block...%n",
                                    event.asContentBlockStart()._type());
                            // Flags für jeden neuen Block zurücksetzen
                            thinkingStarted = false;
                            responseStarted = false;
                        } else if (event.isContentBlockDelta()) {
                            var delta = event.asContentBlockDelta().delta();
                            if (delta.isBetaThinking()) {
                                if (!thinkingStarted) {
                                    System.out.print("Denken: ");
                                    thinkingStarted = true;
                                }
                                System.out.print(delta.asBetaThinking().thinking());
                                System.out.flush();
                            } else if (delta.isBetaText()) {
                                if (!responseStarted) {
                                    System.out.print("Antwort: ");
                                    responseStarted = true;
                                }
                                System.out.print(delta.asBetaText().text());
                                System.out.flush();
                            }
                        } else if (event.isContentBlockStop()) {
                            System.out.println("\nBlock complete.");
                        }
                    });
        }
    }
}
```

</CodeGroup>

<TryInConsoleButton userPrompt="Was ist 27 * 453?" thinkingBudgetTokens={16000}>
  Im Konsole versuchen
</TryInConsoleButton>

Beispiel-Streaming-Ausgabe:
```json
event: message_start
data: {"type": "message_start", "message": {"id": "msg_01...", "type": "message", "role": "assistant", "content": [], "model": "claude-sonnet-4-5", "stop_reason": null, "stop_sequence": null}}

event: content_block_start
data: {"type": "content_block_start", "index": 0, "content_block": {"type": "thinking", "thinking": ""}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "Lassen Sie mich das Schritt für Schritt lösen:\n\n1. Zuerst 27 * 453 aufteilen"}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "\n2. 453 = 400 + 50 + 3"}}

// Zusätzliche Denk-Deltas...

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "signature_delta", "signature": "EqQBCgIYAhIM1gbcDa9GJwZA2b3hGgxBdjrkzLoky3dl1pkiMOYds..."}}

event: content_block_stop
data: {"type": "content_block_stop", "index": 0}

event: content_block_start
data: {"type": "content_block_start", "index": 1, "content_block": {"type": "text", "text": ""}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 1, "delta": {"type": "text_delta", "text": "27 * 453 = 12.231"}}

// Zusätzliche Text-Deltas...

event: content_block_stop
data: {"type": "content_block_stop", "index": 1}

event: message_delta
data: {"type": "message_delta", "delta": {"stop_reason": "end_turn", "stop_sequence": null}}

event: message_stop
data: {"type": "message_stop"}
```

<Note>
Wenn Sie Streaming mit aktiviertem Denken verwenden, können Sie bemerken, dass Text manchmal in größeren Blöcken ankommt, die sich mit kleinerer, Token-für-Token-Lieferung abwechseln. Dies ist erwartetes Verhalten, besonders für Denkinhalte.

Das Streaming-System muss Inhalte in Batches für optimale Leistung verarbeiten, was zu diesem "klumpigen" Liefermuster führen kann, mit möglichen Verzögerungen zwischen Streaming-Events. Wir arbeiten kontinuierlich daran, dieses Erlebnis zu verbessern, mit zukünftigen Updates, die sich auf ein sanfteres Streaming von Denkinhalten konzentrieren.
</Note>

## Erweitertes Denken mit Tool-Verwendung

Erweitertes Denken kann zusammen mit [Tool-Verwendung](/docs/de/agents-and-tools/tool-use/overview) verwendet werden, was Claude ermöglicht, die Auswahl von Tools und die Verarbeitung von Ergebnissen zu durchdenken.

Bei Verwendung von erweitertem Denken mit Tool-Verwendung sollten Sie sich der folgenden Einschränkungen bewusst sein:

1. **Tool-Auswahl-Einschränkung**: Tool-Verwendung mit Denken unterstützt nur `tool_choice: {"type": "auto"}` (Standard) oder `tool_choice: {"type": "none"}`. Die Verwendung von `tool_choice: {"type": "any"}` oder `tool_choice: {"type": "tool", "name": "..."}` führt zu einem Fehler, da diese Optionen Tool-Verwendung erzwingen, was mit erweitertem Denken nicht kompatibel ist.

2. **Denkblöcke bewahren**: Während der Tool-Verwendung müssen Sie `thinking` Blöcke an die API für die letzte Assistenten-Nachricht zurückgeben. Geben Sie den vollständigen unveränderten Block an die API zurück, um die Denk-Kontinuität zu bewahren.

### Denkmodelle in Gesprächen umschalten

Sie können das Denken nicht in der Mitte einer Assistenten-Runde umschalten, einschließlich während Tool-Verwendungsschleifen. Die gesamte Assistenten-Runde muss in einem einzigen Denkmodus arbeiten:

- **Wenn Denken aktiviert ist**, muss die endgültige Assistenten-Runde mit einem Denkblock beginnen.
- **Wenn Denken deaktiviert ist**, darf die endgültige Assistenten-Runde keine Denkblöcke enthalten

Aus der Perspektive des Modells sind **Tool-Verwendungsschleifen Teil der Assistenten-Runde**. Eine Assistenten-Runde ist nicht abgeschlossen, bis Claude seine vollständige Antwort fertiggestellt hat, die mehrere Tool-Aufrufe und Ergebnisse enthalten kann.

Zum Beispiel ist diese Sequenz alles Teil einer **einzelnen Assistenten-Runde**:
```
Benutzer: "Wie ist das Wetter in Paris?"
Assistent: [thinking] + [tool_use: get_weather]
Benutzer: [tool_result: "20°C, sonnig"]
Assistent: [text: "Das Wetter in Paris ist 20°C und sonnig"]
```

Obwohl es mehrere API-Nachrichten gibt, ist die Tool-Verwendungsschleife konzeptionell Teil einer kontinuierlichen Assistenten-Antwort.

#### Häufige Fehlerszenarien

Sie könnten auf diesen Fehler stoßen:
```
Expected `thinking` or `redacted_thinking`, but found `tool_use`.
When `thinking` is enabled, a final `assistant` message must start
with a thinking block (preceding the lastmost set of `tool_use` and
`tool_result` blocks).
```

Dies tritt typischerweise auf, wenn:
1. Sie Denken **deaktiviert** während einer Tool-Verwendungssequenz hatten
2. Sie Denken wieder aktivieren möchten
3. Ihre letzte Assistenten-Nachricht Tool-Verwendungsblöcke enthält, aber keinen Denkblock

#### Praktische Anleitung

**✗ Ungültig: Denken unmittelbar nach Tool-Verwendung umschalten**
```
Benutzer: "Wie ist das Wetter?"
Assistent: [tool_use] (Denken deaktiviert)
Benutzer: [tool_result]
// Kann Denken hier nicht aktivieren - immer noch in der gleichen Assistenten-Runde
```

**✓ Gültig: Assistenten-Runde zuerst abschließen**
```
Benutzer: "Wie ist das Wetter?"
Assistent: [tool_use] (Denken deaktiviert)
Benutzer: [tool_result]
Assistent: [text: "Es ist sonnig"] 
Benutzer: "Wie ist es morgen?" (Denken deaktiviert)
Assistent: [thinking] + [text: "..."] (Denken aktiviert - neue Runde)
```

**Best Practice**: Planen Sie Ihre Denkstrategie am Anfang jeder Runde, anstatt zu versuchen, sie in der Mitte umzuschalten.

<Note>
Das Umschalten von Denkmodellen invalidiert auch Prompt-Caching für Nachrichtenverlauf. Weitere Details finden Sie im Abschnitt [Erweitertes Denken mit Prompt-Caching](#extended-thinking-with-prompt-caching).
</Note>

<section title="Beispiel: Denkblöcke mit Tool-Ergebnissen übergeben">

Hier ist ein praktisches Beispiel, das zeigt, wie man Denkblöcke bei der Bereitstellung von Tool-Ergebnissen bewahrt:

<CodeGroup>
```python Python
weather_tool = {
    "name": "get_weather",
    "description": "Aktuelles Wetter für einen Ort abrufen",
    "input_schema": {
        "type": "object",
        "properties": {
            "location": {"type": "string"}
        },
        "required": ["location"]
    }
}

# Erste Anfrage - Claude antwortet mit Denken und Tool-Anfrage
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    tools=[weather_tool],
    messages=[
        {"role": "user", "content": "Wie ist das Wetter in Paris?"}
    ]
)
```

```typescript TypeScript
const weatherTool = {
  name: "get_weather",
  description: "Aktuelles Wetter für einen Ort abrufen",
  input_schema: {
    type: "object",
    properties: {
      location: { type: "string" }
    },
    required: ["location"]
  }
};

// Erste Anfrage - Claude antwortet mit Denken und Tool-Anfrage
const response = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 16000,
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  tools: [weatherTool],
  messages: [
    { role: "user", content: "Wie ist das Wetter in Paris?" }
  ]
});
```

```java Java
import java.util.List;
import java.util.Map;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.JsonValue;
import com.anthropic.models.beta.messages.BetaMessage;
import com.anthropic.models.beta.messages.MessageCreateParams;
import com.anthropic.models.beta.messages.BetaThinkingConfigEnabled;
import com.anthropic.models.beta.messages.BetaTool;
import com.anthropic.models.beta.messages.BetaTool.InputSchema;
import com.anthropic.models.messages.Model;

public class ThinkingWithToolsExample {
    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        InputSchema schema = InputSchema.builder()
                .properties(JsonValue.from(Map.of(
                        "location", Map.of("type", "string")
                )))
                .putAdditionalProperty("required", JsonValue.from(List.of("location")))
                .build();

        BetaTool weatherTool = BetaTool.builder()
                .name("get_weather")
                .description("Aktuelles Wetter für einen Ort abrufen")
                .inputSchema(schema)
                .build();

        BetaMessage response = client.beta().messages().create(
                MessageCreateParams.builder()
                        .model(Model.CLAUDE_OPUS_4_0)
                        .maxTokens(16000)
                        .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(10000).build())
                        .addTool(weatherTool)
                        .addUserMessage("Wie ist das Wetter in Paris?")
                        .build()
        );

        System.out.println(response);
    }
}
```
</CodeGroup>

Die API-Antwort enthält Denk-, Text- und Tool-Verwendungsblöcke:

```json
{
    "content": [
        {
            "type": "thinking",
            "thinking": "Der Benutzer möchte das aktuelle Wetter in Paris wissen. Ich habe Zugriff auf eine Funktion `get_weather`...",
            "signature": "BDaL4VrbR2Oj0hO4XpJxT28J5TILnCrrUXoKiiNBZW9P+nr8XSj1zuZzAl4egiCCpQNvfyUuFFJP5CncdYZEQPPmLxYsNrcs...."
        },
        {
            "type": "text",
            "text": "Ich kann Ihnen helfen, die aktuellen Wetterinformationen für Paris zu erhalten. Lassen Sie mich das für Sie überprüfen"
        },
        {
            "type": "tool_use",
            "id": "toolu_01CswdEQBMshySk6Y9DFKrfq",
            "name": "get_weather",
            "input": {
                "location": "Paris"
            }
        }
    ]
}
```

Lassen Sie uns das Gespräch fortsetzen und das Tool verwenden

<CodeGroup>
```python Python
# Denkblock und Tool-Verwendungsblock extrahieren
thinking_block = next((block for block in response.content
                      if block.type == 'thinking'), None)
tool_use_block = next((block for block in response.content
                      if block.type == 'tool_use'), None)

# Rufen Sie Ihre tatsächliche Wetter-API auf, hier ist, wo Ihr tatsächlicher API-Aufruf stattfinden würde
# Lassen Sie uns so tun, als würden wir das zurückbekommen
weather_data = {"temperature": 88}

# Zweite Anfrage - Denkblock und Tool-Ergebnis einschließen
# Keine neuen Denkblöcke werden in der Antwort generiert
continuation = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    tools=[weather_tool],
    messages=[
        {"role": "user", "content": "Wie ist das Wetter in Paris?"},
        # Beachten Sie, dass der thinking_block zusammen mit dem tool_use_block übergeben wird
        # Wenn dies nicht übergeben wird, wird ein Fehler ausgelöst
        {"role": "assistant", "content": [thinking_block, tool_use_block]},
        {"role": "user", "content": [{
            "type": "tool_result",
            "tool_use_id": tool_use_block.id,
            "content": f"Aktuelle Temperatur: {weather_data['temperature']}°F"
        }]}
    ]
)
```

```typescript TypeScript
// Denkblock und Tool-Verwendungsblock extrahieren
const thinkingBlock = response.content.find(block =>
  block.type === 'thinking');
const toolUseBlock = response.content.find(block =>
  block.type === 'tool_use');

// Rufen Sie Ihre tatsächliche Wetter-API auf, hier ist, wo Ihr tatsächlicher API-Aufruf stattfinden würde
// Lassen Sie uns so tun, als würden wir das zurückbekommen
const weatherData = { temperature: 88 };

// Zweite Anfrage - Denkblock und Tool-Ergebnis einschließen
// Keine neuen Denkblöcke werden in der Antwort generiert
const continuation = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 16000,
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  tools: [weatherTool],
  messages: [
    { role: "user", content: "Wie ist das Wetter in Paris?" },
    // Beachten Sie, dass der thinkingBlock zusammen mit dem toolUseBlock übergeben wird
    // Wenn dies nicht übergeben wird, wird ein Fehler ausgelöst
    { role: "assistant", content: [thinkingBlock, toolUseBlock] },
    { role: "user", content: [{
      type: "tool_result",
      tool_use_id: toolUseBlock.id,
      content: `Aktuelle Temperatur: ${weatherData.temperature}°F`
    }]}
  ]
});
```

```java Java
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.JsonValue;
import com.anthropic.models.beta.messages.*;
import com.anthropic.models.beta.messages.BetaTool.InputSchema;
import com.anthropic.models.messages.Model;

public class ThinkingToolsResultExample {
    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        InputSchema schema = InputSchema.builder()
                .properties(JsonValue.from(Map.of(
                        "location", Map.of("type", "string")
                )))
                .putAdditionalProperty("required", JsonValue.from(List.of("location")))
                .build();

        BetaTool weatherTool = BetaTool.builder()
                .name("get_weather")
                .description("Aktuelles Wetter für einen Ort abrufen")
                .inputSchema(schema)
                .build();

        BetaMessage response = client.beta().messages().create(
                MessageCreateParams.builder()
                        .model(Model.CLAUDE_OPUS_4_0)
                        .maxTokens(16000)
                        .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(10000).build())
                        .addTool(weatherTool)
                        .addUserMessage("Wie ist das Wetter in Paris?")
                        .build()
        );

        // Denkblock und Tool-Verwendungsblock extrahieren
        Optional<BetaThinkingBlock> thinkingBlockOpt = response.content().stream()
                .filter(BetaContentBlock::isThinking)
                .map(BetaContentBlock::asThinking)
                .findFirst();

        Optional<BetaToolUseBlock> toolUseBlockOpt = response.content().stream()
                .filter(BetaContentBlock::isToolUse)
                .map(BetaContentBlock::asToolUse)
                .findFirst();

        if (thinkingBlockOpt.isPresent() && toolUseBlockOpt.isPresent()) {
            BetaThinkingBlock thinkingBlock = thinkingBlockOpt.get();
            BetaToolUseBlock toolUseBlock = toolUseBlockOpt.get();

            // Rufen Sie Ihre tatsächliche Wetter-API auf, hier ist, wo Ihr tatsächlicher API-Aufruf stattfinden würde
            // Lassen Sie uns so tun, als würden wir das zurückbekommen
            Map<String, Object> weatherData = Map.of("temperature", 88);

            // Zweite Anfrage - Denkblock und Tool-Ergebnis einschließen
            // Keine neuen Denkblöcke werden in der Antwort generiert
            BetaMessage continuation = client.beta().messages().create(
                    MessageCreateParams.builder()
                            .model(Model.CLAUDE_OPUS_4_0)
                            .maxTokens(16000)
                            .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(10000).build())
                            .addTool(weatherTool)
                            .addUserMessage("Wie ist das Wetter in Paris?")
                            .addAssistantMessageOfBetaContentBlockParams(
                                    // Beachten Sie, dass der thinkingBlock zusammen mit dem toolUseBlock übergeben wird
                                    // Wenn dies nicht übergeben wird, wird ein Fehler ausgelöst
                                    List.of(
                                            BetaContentBlockParam.ofThinking(thinkingBlock.toParam()),
                                            BetaContentBlockParam.ofToolUse(toolUseBlock.toParam())
                                    )
                            )
                            .addUserMessageOfBetaContentBlockParams(List.of(
                                    BetaContentBlockParam.ofToolResult(
                                            BetaToolResultBlockParam.builder()
                                                    .toolUseId(toolUseBlock.id())
                                                    .content(String.format("Aktuelle Temperatur: %d°F", (Integer)weatherData.get("temperature")))
                                                    .build()
                                    )
                            ))
                            .build()
            );

            System.out.println(continuation);
        }
    }
}
```
</CodeGroup>

Die API-Antwort enthält jetzt **nur** Text

```json
{
    "content": [
        {
            "type": "text",
            "text": "Derzeit in Paris beträgt die Temperatur 88°F (31°C)"
        }
    ]
}
```

</section>

### Denkblöcke bewahren

Während der Tool-Verwendung müssen Sie `thinking` Blöcke an die API zurückgeben, und Sie müssen den vollständigen unveränderten Block an die API zurückgeben. Dies ist entscheidend für die Aufrechterhaltung des Denkflusses des Modells und der Gesprächsintegrität.

<Tip>
Während Sie `thinking` Blöcke aus vorherigen `assistant` Rollen-Runden weglassen können, empfehlen wir, immer alle Denkblöcke an die API für jedes mehrteilige Gespräch zurückzugeben. Die API wird:
- Die bereitgestellten Denkblöcke automatisch filtern
- Die relevanten Denkblöcke verwenden, die notwendig sind, um das Denken des Modells zu bewahren
- Nur die Eingabe-Token für die Blöcke berechnen, die Claude angezeigt werden
</Tip>

<Note>
Wenn Sie Denkmodelle während eines Gesprächs umschalten, denken Sie daran, dass die gesamte Assistenten-Runde (einschließlich Tool-Verwendungsschleifen) in einem einzigen Denkmodus arbeiten muss. Weitere Details finden Sie unter [Denkmodelle in Gesprächen umschalten](#toggling-thinking-modes-in-conversations).
</Note>

Wenn Claude Tools aufruft, pausiert es die Konstruktion einer Antwort, um auf externe Informationen zu warten. Wenn Tool-Ergebnisse zurückgegeben werden, wird Claude diese bestehende Antwort weiter aufbauen. Dies macht es notwendig, Denkblöcke während der Tool-Verwendung zu bewahren, aus ein paar Gründen:

1. **Denk-Kontinuität**: Die Denkblöcke erfassen Claudes schrittweises Denken, das zu Tool-Anfragen führte. Wenn Sie Tool-Ergebnisse posten, stellt das Einschließen des ursprünglichen Denkens sicher, dass Claude sein Denken von dort fortsetzen kann, wo es aufgehört hat.

2. **Kontext-Erhaltung**: Während Tool-Ergebnisse als Benutzer-Nachrichten in der API-Struktur erscheinen, sind sie Teil eines kontinuierlichen Denkflusses. Das Bewahren von Denkblöcken erhält diesen konzeptionellen Fluss über mehrere API-Aufrufe hinweg. Weitere Informationen zur Kontext-Verwaltung finden Sie in unserem [Leitfaden zu Kontextfenstern](/docs/de/build-with-claude/context-windows).

**Wichtig**: Wenn Sie `thinking` Blöcke bereitstellen, muss die gesamte Sequenz von aufeinanderfolgenden `thinking` Blöcken den Ausgaben entsprechen, die das Modell während der ursprünglichen Anfrage generiert hat; Sie können die Sequenz dieser Blöcke nicht neu anordnen oder ändern.

### Interleaved thinking

Extended thinking mit Tool-Nutzung in Claude 4 Modellen unterstützt interleaved thinking, das Claude ermöglicht, zwischen Tool-Aufrufen zu denken und nach dem Erhalt von Tool-Ergebnissen anspruchsvollere Überlegungen anzustellen.

Mit interleaved thinking kann Claude:
- Über die Ergebnisse eines Tool-Aufrufs nachdenken, bevor entschieden wird, was als nächstes zu tun ist
- Mehrere Tool-Aufrufe mit Denkschritten dazwischen verketten
- Differenziertere Entscheidungen basierend auf Zwischenergebnissen treffen

Um interleaved thinking zu aktivieren, fügen Sie [den Beta-Header](/docs/de/api/beta-headers) `interleaved-thinking-2025-05-14` zu Ihrer API-Anfrage hinzu.

Hier sind einige wichtige Überlegungen für interleaved thinking:
- Mit interleaved thinking kann `budget_tokens` den `max_tokens` Parameter überschreiten, da es das Gesamtbudget über alle Denkblöcke innerhalb einer Assistent-Runde darstellt.
- Interleaved thinking wird nur für [Tools unterstützt, die über die Messages API verwendet werden](/docs/de/agents-and-tools/tool-use/overview).
- Interleaved thinking wird nur für Claude 4 Modelle unterstützt, mit dem Beta-Header `interleaved-thinking-2025-05-14`.
- Direkte Aufrufe der Claude API ermöglichen es Ihnen, `interleaved-thinking-2025-05-14` in Anfragen an jedes Modell zu übergeben, ohne Auswirkungen.
- Auf Plattformen von Drittanbietern (z. B. [Amazon Bedrock](/docs/de/build-with-claude/claude-on-amazon-bedrock) und [Vertex AI](/docs/de/build-with-claude/claude-on-vertex-ai)), wenn Sie `interleaved-thinking-2025-05-14` an ein anderes Modell als Claude Opus 4.5, Claude Opus 4.1, Opus 4 oder Sonnet 4 übergeben, schlägt Ihre Anfrage fehl.

<section title="Tool-Nutzung ohne interleaved thinking">

Ohne interleaved thinking denkt Claude einmal am Anfang der Assistent-Runde. Nachfolgende Antworten nach Tool-Ergebnissen werden ohne neue Denkblöcke fortgesetzt.

```
User: "What's the total revenue if we sold 150 units at $50 each,
       and how does this compare to our average monthly revenue?"

Turn 1: [thinking] "I need to calculate 150 * $50, then check the database..."
        [tool_use: calculator] { "expression": "150 * 50" }
  ↓ tool result: "7500"

Turn 2: [tool_use: database_query] { "query": "SELECT AVG(revenue)..." }
        ↑ no thinking block
  ↓ tool result: "5200"

Turn 3: [text] "The total revenue is $7,500, which is 44% above your
        average monthly revenue of $5,200."
        ↑ no thinking block
```

</section>

<section title="Tool-Nutzung mit interleaved thinking">

Mit aktiviertem interleaved thinking kann Claude nach dem Erhalt jedes Tool-Ergebnisses denken, was es ermöglicht, über Zwischenergebnisse nachzudenken, bevor es fortfährt.

```
User: "What's the total revenue if we sold 150 units at $50 each,
       and how does this compare to our average monthly revenue?"

Turn 1: [thinking] "I need to calculate 150 * $50 first..."
        [tool_use: calculator] { "expression": "150 * 50" }
  ↓ tool result: "7500"

Turn 2: [thinking] "Got $7,500. Now I should query the database to compare..."
        [tool_use: database_query] { "query": "SELECT AVG(revenue)..." }
        ↑ thinking after receiving calculator result
  ↓ tool result: "5200"

Turn 3: [thinking] "$7,500 vs $5,200 average - that's a 44% increase..."
        [text] "The total revenue is $7,500, which is 44% above your
        average monthly revenue of $5,200."
        ↑ thinking before final answer
```

</section>

## Extended thinking mit Prompt Caching

[Prompt Caching](/docs/de/build-with-claude/prompt-caching) mit Thinking hat mehrere wichtige Überlegungen:

<Tip>
Extended Thinking Aufgaben dauern oft länger als 5 Minuten. Erwägen Sie die Verwendung der [1-Stunden-Cache-Dauer](/docs/de/build-with-claude/prompt-caching#1-hour-cache-duration), um Cache-Treffer über längere Thinking-Sitzungen und mehrstufige Workflows hinweg zu erhalten.
</Tip>

**Entfernung von Denkblock-Kontext**
- Denkblöcke aus vorherigen Runden werden aus dem Kontext entfernt, was Cache-Breakpoints beeinflussen kann
- Bei der Fortsetzung von Gesprächen mit Tool-Nutzung werden Denkblöcke zwischengespeichert und zählen als Eingabe-Token, wenn sie aus dem Cache gelesen werden
- Dies erzeugt einen Kompromiss: Während Denkblöcke visuell keinen Kontextfensterplatz verbrauchen, zählen sie dennoch zu Ihrer Eingabe-Token-Nutzung, wenn sie zwischengespeichert sind
- Wenn Thinking deaktiviert wird, schlagen Anfragen fehl, wenn Sie Thinking-Inhalte im aktuellen Tool-Use-Turn übergeben. In anderen Kontexten wird Thinking-Inhalt, der an die API übergeben wird, einfach ignoriert

**Cache-Invalidierungsmuster**
- Änderungen an Thinking-Parametern (aktiviert/deaktiviert oder Budgetverteilung) invalidieren Message-Cache-Breakpoints
- [Interleaved thinking](#interleaved-thinking) verstärkt Cache-Invalidierung, da Denkblöcke zwischen mehreren [Tool-Aufrufen](#extended-thinking-with-tool-use) auftreten können
- System-Prompts und Tools bleiben zwischengespeichert, trotz Änderungen an Thinking-Parametern oder Block-Entfernung

<Note>
Während Denkblöcke für Caching und Kontextberechnungen entfernt werden, müssen sie bei der Fortsetzung von Gesprächen mit [Tool-Nutzung](#extended-thinking-with-tool-use) erhalten bleiben, besonders mit [interleaved thinking](#interleaved-thinking).
</Note>

### Verständnis des Denkblock-Caching-Verhaltens

Bei Verwendung von Extended Thinking mit Tool-Nutzung zeigen Denkblöcke ein spezifisches Caching-Verhalten, das die Token-Zählung beeinflusst:

**Wie es funktioniert:**

1. Caching tritt nur auf, wenn Sie eine nachfolgende Anfrage stellen, die Tool-Ergebnisse enthält
2. Wenn die nachfolgende Anfrage gestellt wird, kann die vorherige Gesprächshistorie (einschließlich Denkblöcke) zwischengespeichert werden
3. Diese zwischengespeicherten Denkblöcke zählen als Eingabe-Token in Ihren Nutzungsmetriken, wenn sie aus dem Cache gelesen werden
4. Wenn ein Non-Tool-Result-User-Block enthalten ist, werden alle vorherigen Denkblöcke ignoriert und aus dem Kontext entfernt

**Detailliertes Beispielablauf:**

**Anfrage 1:**
```
User: "What's the weather in Paris?"
```
**Antwort 1:**
```
[thinking_block_1] + [tool_use block 1]
```

**Anfrage 2:**
```
User: ["What's the weather in Paris?"], 
Assistant: [thinking_block_1] + [tool_use block 1], 
User: [tool_result_1, cache=True]
```
**Antwort 2:**
```
[thinking_block_2] + [text block 2]
```
Anfrage 2 schreibt einen Cache des Anfrageinhalts (nicht der Antwort). Der Cache enthält die ursprüngliche Benutzernachricht, den ersten Denkblock, Tool-Use-Block und das Tool-Ergebnis.

**Anfrage 3:**
```
User: ["What's the weather in Paris?"],
Assistant: [thinking_block_1] + [tool_use block 1],
User: [tool_result_1, cache=True],
Assistant: [thinking_block_2] + [text block 2],
User: [Text response, cache=True]
```
Für Claude Opus 4.5 und später werden alle vorherigen Denkblöcke standardmäßig beibehalten. Für ältere Modelle werden, da ein Non-Tool-Result-User-Block enthalten war, alle vorherigen Denkblöcke ignoriert. Diese Anfrage wird genauso verarbeitet wie:
```
User: ["What's the weather in Paris?"],
Assistant: [tool_use block 1],
User: [tool_result_1, cache=True],
Assistant: [text block 2],
User: [Text response, cache=True]
```

**Wichtige Punkte:**
- Dieses Caching-Verhalten geschieht automatisch, auch ohne explizite `cache_control` Marker
- Dieses Verhalten ist konsistent, ob Sie reguläres Thinking oder interleaved thinking verwenden

<section title="System-Prompt-Caching (beibehalten, wenn Thinking sich ändert)">

<CodeGroup>
```python Python
from anthropic import Anthropic
import requests
from bs4 import BeautifulSoup

client = Anthropic()

def fetch_article_content(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')

    # Remove script and style elements
    for script in soup(["script", "style"]):
        script.decompose()

    # Get text
    text = soup.get_text()

    # Break into lines and remove leading and trailing space on each
    lines = (line.strip() for line in text.splitlines())
    # Break multi-headlines into a line each
    chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
    # Drop blank lines
    text = '\n'.join(chunk for chunk in chunks if chunk)

    return text

# Fetch the content of the article
book_url = "https://www.gutenberg.org/cache/epub/1342/pg1342.txt"
book_content = fetch_article_content(book_url)
# Use just enough text for caching (first few chapters)
LARGE_TEXT = book_content[:5000]

SYSTEM_PROMPT=[
    {
        "type": "text",
        "text": "You are an AI assistant that is tasked with literary analysis. Analyze the following text carefully.",
    },
    {
        "type": "text",
        "text": LARGE_TEXT,
        "cache_control": {"type": "ephemeral"}
    }
]

MESSAGES = [
    {
        "role": "user",
        "content": "Analyze the tone of this passage."
    }
]

# First request - establish cache
print("First request - establishing cache")
response1 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=20000,
    thinking={
        "type": "enabled",
        "budget_tokens": 4000
    },
    system=SYSTEM_PROMPT,
    messages=MESSAGES
)

print(f"First response usage: {response1.usage}")

MESSAGES.append({
    "role": "assistant",
    "content": response1.content
})
MESSAGES.append({
    "role": "user",
    "content": "Analyze the characters in this passage."
})
# Second request - same thinking parameters (cache hit expected)
print("\nSecond request - same thinking parameters (cache hit expected)")
response2 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=20000,
    thinking={
        "type": "enabled",
        "budget_tokens": 4000
    },
    system=SYSTEM_PROMPT,
    messages=MESSAGES
)

print(f"Second response usage: {response2.usage}")

# Third request - different thinking parameters (cache miss for messages)
print("\nThird request - different thinking parameters (cache miss for messages)")
response3 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=20000,
    thinking={
        "type": "enabled",
        "budget_tokens": 8000  # Changed thinking budget
    },
    system=SYSTEM_PROMPT,  # System prompt remains cached
    messages=MESSAGES  # Messages cache is invalidated
)

print(f"Third response usage: {response3.usage}")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';
import axios from 'axios';
import * as cheerio from 'cheerio';

const client = new Anthropic();

async function fetchArticleContent(url: string): Promise<string> {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  
  // Remove script and style elements
  $('script, style').remove();
  
  // Get text
  let text = $.text();
  
  // Break into lines and remove leading and trailing space on each
  const lines = text.split('\n').map(line => line.trim());
  // Drop blank lines
  text = lines.filter(line => line.length > 0).join('\n');
  
  return text;
}

// Fetch the content of the article
const bookUrl = "https://www.gutenberg.org/cache/epub/1342/pg1342.txt";
const bookContent = await fetchArticleContent(bookUrl);
// Use just enough text for caching (first few chapters)
const LARGE_TEXT = bookContent.slice(0, 5000);

const SYSTEM_PROMPT = [
  {
    type: "text",
    text: "You are an AI assistant that is tasked with literary analysis. Analyze the following text carefully.",
  },
  {
    type: "text",
    text: LARGE_TEXT,
    cache_control: { type: "ephemeral" }
  }
];

const MESSAGES = [
  {
    role: "user",
    content: "Analyze the tone of this passage."
  }
];

// First request - establish cache
console.log("First request - establishing cache");
const response1 = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 20000,
  thinking: {
    type: "enabled",
    budget_tokens: 4000
  },
  system: SYSTEM_PROMPT,
  messages: MESSAGES
});

console.log(`First response usage: ${response1.usage}`);

MESSAGES.push({
  role: "assistant",
  content: response1.content
});
MESSAGES.push({
  role: "user",
  content: "Analyze the characters in this passage."
});

// Second request - same thinking parameters (cache hit expected)
console.log("\nSecond request - same thinking parameters (cache hit expected)");
const response2 = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 20000,
  thinking: {
    type: "enabled",
    budget_tokens: 4000
  },
  system: SYSTEM_PROMPT,
  messages: MESSAGES
});

console.log(`Second response usage: ${response2.usage}`);

// Third request - different thinking parameters (cache miss for messages)
console.log("\nThird request - different thinking parameters (cache miss for messages)");
const response3 = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 20000,
  thinking: {
    type: "enabled",
    budget_tokens: 8000  // Changed thinking budget
  },
  system: SYSTEM_PROMPT,  // System prompt remains cached
  messages: MESSAGES  // Messages cache is invalidated
});

console.log(`Third response usage: ${response3.usage}`);
```
</CodeGroup>

</section>
<section title="Messages-Caching (invalidiert, wenn Thinking sich ändert)">

<CodeGroup>
```python Python
from anthropic import Anthropic
import requests
from bs4 import BeautifulSoup

client = Anthropic()

def fetch_article_content(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')

    # Remove script and style elements
    for script in soup(["script", "style"]):
        script.decompose()

    # Get text
    text = soup.get_text()

    # Break into lines and remove leading and trailing space on each
    lines = (line.strip() for line in text.splitlines())
    # Break multi-headlines into a line each
    chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
    # Drop blank lines
    text = '\n'.join(chunk for chunk in chunks if chunk)

    return text

# Fetch the content of the article
book_url = "https://www.gutenberg.org/cache/epub/1342/pg1342.txt"
book_content = fetch_article_content(book_url)
# Use just enough text for caching (first few chapters)
LARGE_TEXT = book_content[:5000]

# No system prompt - caching in messages instead
MESSAGES = [
    {
        "role": "user",
        "content": [
            {
                "type": "text",
                "text": LARGE_TEXT,
                "cache_control": {"type": "ephemeral"},
            },
            {
                "type": "text",
                "text": "Analyze the tone of this passage."
            }
        ]
    }
]

# First request - establish cache
print("First request - establishing cache")
response1 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=20000,
    thinking={
        "type": "enabled",
        "budget_tokens": 4000
    },
    messages=MESSAGES
)

print(f"First response usage: {response1.usage}")

MESSAGES.append({
    "role": "assistant",
    "content": response1.content
})
MESSAGES.append({
    "role": "user",
    "content": "Analyze the characters in this passage."
})
# Second request - same thinking parameters (cache hit expected)
print("\nSecond request - same thinking parameters (cache hit expected)")
response2 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=20000,
    thinking={
        "type": "enabled",
        "budget_tokens": 4000  # Same thinking budget
    },
    messages=MESSAGES
)

print(f"Second response usage: {response2.usage}")

MESSAGES.append({
    "role": "assistant",
    "content": response2.content
})
MESSAGES.append({
    "role": "user",
    "content": "Analyze the setting in this passage."
})

# Third request - different thinking budget (cache miss expected)
print("\nThird request - different thinking budget (cache miss expected)")
response3 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=20000,
    thinking={
        "type": "enabled",
        "budget_tokens": 8000  # Different thinking budget breaks cache
    },
    messages=MESSAGES
)

print(f"Third response usage: {response3.usage}")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';
import axios from 'axios';
import * as cheerio from 'cheerio';

const client = new Anthropic();

async function fetchArticleContent(url: string): Promise<string> {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  // Remove script and style elements
  $('script, style').remove();

  // Get text
  let text = $.text();

  // Clean up text (break into lines, remove whitespace)
  const lines = text.split('\n').map(line => line.trim());
  const chunks = lines.flatMap(line => line.split('  ').map(phrase => phrase.trim()));
  text = chunks.filter(chunk => chunk).join('\n');

  return text;
}

async function main() {
  // Fetch the content of the article
  const bookUrl = "https://www.gutenberg.org/cache/epub/1342/pg1342.txt";
  const bookContent = await fetchArticleContent(bookUrl);
  // Use just enough text for caching (first few chapters)
  const LARGE_TEXT = bookContent.substring(0, 5000);

  // No system prompt - caching in messages instead
  let MESSAGES = [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: LARGE_TEXT,
          cache_control: {type: "ephemeral"},
        },
        {
          type: "text",
          text: "Analyze the tone of this passage."
        }
      ]
    }
  ];

  // First request - establish cache
  console.log("First request - establishing cache");
  const response1 = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 20000,
    thinking: {
      type: "enabled",
      budget_tokens: 4000
    },
    messages: MESSAGES
  });

  console.log(`First response usage: `, response1.usage);

  MESSAGES = [
    ...MESSAGES,
    {
      role: "assistant",
      content: response1.content
    },
    {
      role: "user",
      content: "Analyze the characters in this passage."
    }
  ];

  // Second request - same thinking parameters (cache hit expected)
  console.log("\nSecond request - same thinking parameters (cache hit expected)");
  const response2 = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 20000,
    thinking: {
      type: "enabled",
      budget_tokens: 4000  // Same thinking budget
    },
    messages: MESSAGES
  });

  console.log(`Second response usage: `, response2.usage);

  MESSAGES = [
    ...MESSAGES,
    {
      role: "assistant",
      content: response2.content
    },
    {
      role: "user",
      content: "Analyze the setting in this passage."
    }
  ];

  // Third request - different thinking budget (cache miss expected)
  console.log("\nThird request - different thinking budget (cache miss expected)");
  const response3 = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 20000,
    thinking: {
      type: "enabled",
      budget_tokens: 8000  // Different thinking budget breaks cache
    },
    messages: MESSAGES
  });

  console.log(`Third response usage: `, response3.usage);
}

main().catch(console.error);
```

```java Java
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.Arrays;
import java.util.regex.Pattern;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.beta.messages.*;
import com.anthropic.models.beta.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;

import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toList;

public class ThinkingCacheExample {
    public static void main(String[] args) throws IOException {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Fetch the content of the article
        String bookUrl = "https://www.gutenberg.org/cache/epub/1342/pg1342.txt";
        String bookContent = fetchArticleContent(bookUrl);
        // Use just enough text for caching (first few chapters)
        String largeText = bookContent.substring(0, 5000);

        List<BetaTextBlockParam> systemPrompt = List.of(
                BetaTextBlockParam.builder()
                        .text("You are an AI assistant that is tasked with literary analysis. Analyze the following text carefully.")
                        .build(),
                BetaTextBlockParam.builder()
                        .text(largeText)
                        .cacheControl(BetaCacheControlEphemeral.builder().build())
                        .build()
        );

        List<BetaMessageParam> messages = new ArrayList<>();
        messages.add(BetaMessageParam.builder()
                .role(BetaMessageParam.Role.USER)
                .content("Analyze the tone of this passage.")
                .build());

        // First request - establish cache
        System.out.println("First request - establishing cache");
        BetaMessage response1 = client.beta().messages().create(
                MessageCreateParams.builder()
                        .model(Model.CLAUDE_OPUS_4_0)
                        .maxTokens(20000)
                        .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(4000).build())
                        .systemOfBetaTextBlockParams(systemPrompt)
                        .messages(messages)
                        .build()
        );

        System.out.println("First response usage: " + response1.usage());

        // Second request - same thinking parameters (cache hit expected)
        System.out.println("\nSecond request - same thinking parameters (cache hit expected)");
        BetaMessage response2 = client.beta().messages().create(
                MessageCreateParams.builder()
                        .model(Model.CLAUDE_OPUS_4_0)
                        .maxTokens(20000)
                        .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(4000).build())
                        .systemOfBetaTextBlockParams(systemPrompt)
                        .addMessage(response1)
                        .addUserMessage("Analyze the characters in this passage.")
                        .messages(messages)
                        .build()
        );

        System.out.println("Second response usage: " + response2.usage());

        // Third request - different thinking budget (cache hit expected because system prompt caching)
        System.out.println("\nThird request - different thinking budget (cache hit expected)");
        BetaMessage response3 = client.beta().messages().create(
                MessageCreateParams.builder()
                        .model(Model.CLAUDE_OPUS_4_0)
                        .maxTokens(20000)
                        .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(8000).build())
                        .systemOfBetaTextBlockParams(systemPrompt)
                        .addMessage(response1)
                        .addUserMessage("Analyze the characters in this passage.")
                        .addMessage(response2)
                        .addUserMessage("Analyze the setting in this passage.")
                        .build()
        );

        System.out.println("Third response usage: " + response3.usage());
    }

    private static String fetchArticleContent(String url) throws IOException {
        // Fetch HTML content
        String htmlContent = fetchHtml(url);

        // Remove script and style elements
        String noScriptStyle = removeElements(htmlContent, "script", "style");

        // Extract text (simple approach - remove HTML tags)
        String text = removeHtmlTags(noScriptStyle);

        // Clean up text (break into lines, remove whitespace)
        List<String> lines = Arrays.asList(text.split("\n"));
        List<String> trimmedLines = lines.stream()
                .map(String::trim)
                .collect(toList());

        // Split on double spaces and flatten
        List<String> chunks = trimmedLines.stream()
                .flatMap(line -> Arrays.stream(line.split("  "))
                        .map(String::trim))
                .collect(toList());

        // Filter empty chunks and join with newlines
        return chunks.stream()
                .filter(chunk -> !chunk.isEmpty())
                .collect(joining("\n"));
    }

    /**
     * Fetches HTML content from a URL
     */
    private static String fetchHtml(String urlString) throws IOException {
        try (InputStream inputStream = new URL(urlString).openStream()) {
            StringBuilder content = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(inputStream))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    content.append(line).append("\n");
                }
            }
            return content.toString();
        }
    }

    /**
     * Removes specified HTML elements and their content
     */
    private static String removeElements(String html, String... elementNames) {
        String result = html;
        for (String element : elementNames) {
            // Pattern to match <element>...</element> and self-closing tags
            String pattern = "<" + element + "\\s*[^>]*>.*?</" + element + ">|<" + element + "\\s*[^>]*/?>";
            result = Pattern.compile(pattern, Pattern.DOTALL).matcher(result).replaceAll("");
        }
        return result;
    }

    /**
     * Removes all HTML tags from content
     */
    private static String removeHtmlTags(String html) {
        // Replace <br> and <p> tags with newlines for better text formatting
        String withLineBreaks = html.replaceAll("<br\\s*/?\\s*>|</?p\\s*[^>]*>", "\n");

        // Remove remaining HTML tags
        String noTags = withLineBreaks.replaceAll("<[^>]*>", "");

        // Decode HTML entities (simplified for common entities)
        return decodeHtmlEntities(noTags);
    }

    /**
     * Simple HTML entity decoder for common entities
     */
    private static String decodeHtmlEntities(String text) {
        return text
                .replaceAll("&nbsp;", " ")
                .replaceAll("&amp;", "&")
                .replaceAll("&lt;", "<")
                .replaceAll("&gt;", ">")
                .replaceAll("&quot;", "\"")
                .replaceAll("&#39;", "'")
                .replaceAll("&hellip;", "...")
                .replaceAll("&mdash;", "—");
    }

}
```
</CodeGroup>

Hier ist die Ausgabe des Skripts (Sie können leicht unterschiedliche Zahlen sehen)

```
First request - establishing cache
First response usage: { cache_creation_input_tokens: 1370, cache_read_input_tokens: 0, input_tokens: 17, output_tokens: 700 }

Second request - same thinking parameters (cache hit expected)

Second response usage: { cache_creation_input_tokens: 0, cache_read_input_tokens: 1370, input_tokens: 303, output_tokens: 874 }

Third request - different thinking budget (cache miss expected)
Third response usage: { cache_creation_input_tokens: 1370, cache_read_input_tokens: 0, input_tokens: 747, output_tokens: 619 }
```

Dieses Beispiel zeigt, dass bei Caching im Messages-Array die Änderung der Thinking-Parameter (budget_tokens von 4000 auf 8000 erhöht) **den Cache invalidiert**. Die dritte Anfrage zeigt keinen Cache-Treffer mit `cache_creation_input_tokens=1370` und `cache_read_input_tokens=0`, was beweist, dass Message-basiertes Caching invalidiert wird, wenn sich Thinking-Parameter ändern.

</section>

## Max tokens und Kontextfenstergröße mit Extended Thinking

In älteren Claude-Modellen (vor Claude Sonnet 3.7) würde das System automatisch `max_tokens` anpassen, um in das Kontextfenster zu passen, wenn die Summe von Prompt-Tokens und `max_tokens` das Kontextfenster des Modells überschreitet. Dies bedeutete, dass Sie einen großen `max_tokens` Wert setzen konnten und das System ihn nach Bedarf stillschweigend reduzieren würde.

Mit Claude 3.7 und 4 Modellen wird `max_tokens` (das Ihr Thinking-Budget einschließt, wenn Thinking aktiviert ist) als striktes Limit durchgesetzt. Das System gibt nun einen Validierungsfehler zurück, wenn Prompt-Tokens + `max_tokens` die Kontextfenstergröße überschreitet.

<Note>
Sie können unseren [Leitfaden zu Kontextfenstern](/docs/de/build-with-claude/context-windows) für einen gründlicheren Überblick lesen.
</Note>

### Das Kontextfenster mit Extended Thinking

Bei der Berechnung der Kontextfensternutzung mit aktiviertem Thinking gibt es einige Überlegungen zu beachten:

- Denkblöcke aus vorherigen Runden werden entfernt und nicht auf Ihr Kontextfenster angerechnet
- Aktuelles Turn-Thinking zählt zu Ihrem `max_tokens` Limit für diesen Turn

Das folgende Diagramm zeigt die spezialisierte Token-Verwaltung, wenn Extended Thinking aktiviert ist:

![Kontextfenster-Diagramm mit Extended Thinking](/docs/images/context-window-thinking.svg)

Das effektive Kontextfenster wird berechnet als:

```
context window =
  (current input tokens - previous thinking tokens) +
  (thinking tokens + encrypted thinking tokens + text output tokens)
```

Wir empfehlen die Verwendung der [Token-Zähl-API](/docs/de/build-with-claude/token-counting), um genaue Token-Zählungen für Ihren spezifischen Anwendungsfall zu erhalten, besonders bei mehrstufigen Gesprächen, die Thinking einschließen.

### Das Kontextfenster mit Extended Thinking und Tool-Nutzung

Bei Verwendung von Extended Thinking mit Tool-Nutzung müssen Denkblöcke explizit erhalten und mit den Tool-Ergebnissen zurückgegeben werden.

Die effektive Kontextfensterberechnung für Extended Thinking mit Tool-Nutzung wird zu:

```
context window =
  (current input tokens + previous thinking tokens + tool use tokens) +
  (thinking tokens + encrypted thinking tokens + text output tokens)
```

Das folgende Diagramm zeigt die Token-Verwaltung für Extended Thinking mit Tool-Nutzung:

![Kontextfenster-Diagramm mit Extended Thinking und Tool-Nutzung](/docs/images/context-window-thinking-tools.svg)

### Verwaltung von Tokens mit Extended Thinking

Angesichts des Kontextfenster- und `max_tokens` Verhaltens mit Extended Thinking Claude 3.7 und 4 Modellen müssen Sie möglicherweise:

- Ihre Token-Nutzung aktiver überwachen und verwalten
- `max_tokens` Werte anpassen, wenn sich Ihre Prompt-Länge ändert
- Möglicherweise die [Token-Zähl-Endpunkte](/docs/de/build-with-claude/token-counting) häufiger verwenden
- Beachten, dass vorherige Denkblöcke sich nicht in Ihrem Kontextfenster ansammeln

Diese Änderung wurde vorgenommen, um vorhersagbareres und transparenteres Verhalten zu bieten, besonders da die maximalen Token-Limits erheblich gestiegen sind.

## Thinking-Verschlüsselung

Der vollständige Thinking-Inhalt wird verschlüsselt und im `signature` Feld zurückgegeben. Dieses Feld wird verwendet, um zu überprüfen, dass Denkblöcke von Claude generiert wurden, wenn sie an die API zurückgegeben werden.

<Note>
Es ist nur streng notwendig, Denkblöcke zurückzusenden, wenn Sie [Tools mit Extended Thinking verwenden](#extended-thinking-with-tool-use). Ansonsten können Sie Denkblöcke aus vorherigen Runden weglassen oder die API sie für Sie entfernen lassen, wenn Sie sie zurückgeben.

Wenn Sie Denkblöcke zurückgeben, empfehlen wir, alles so zurückzugeben, wie Sie es erhalten haben, um Konsistenz zu gewährleisten und potenzielle Probleme zu vermeiden.
</Note>

Hier sind einige wichtige Überlegungen zur Thinking-Verschlüsselung:
- Beim [Streaming von Antworten](#streaming-thinking) wird die Signatur über ein `signature_delta` innerhalb eines `content_block_delta` Events hinzugefügt, kurz vor dem `content_block_stop` Event.
- `signature` Werte sind in Claude 4 Modellen erheblich länger als in vorherigen Modellen.
- Das `signature` Feld ist ein undurchsichtiges Feld und sollte nicht interpretiert oder analysiert werden - es existiert ausschließlich zu Verifizierungszwecken.
- `signature` Werte sind plattformübergreifend kompatibel (Claude APIs, [Amazon Bedrock](/docs/de/build-with-claude/claude-on-amazon-bedrock) und [Vertex AI](/docs/de/build-with-claude/claude-on-vertex-ai)). Werte, die auf einer Plattform generiert werden, sind mit einer anderen kompatibel.

### Thinking-Redaktion

Gelegentlich wird Claudes interne Argumentation von unseren Sicherheitssystemen gekennzeichnet. Wenn dies geschieht, verschlüsseln wir einen Teil oder den gesamten `thinking`-Block und geben ihn als `redacted_thinking`-Block an Sie zurück. `redacted_thinking`-Blöcke werden entschlüsselt, wenn sie an die API zurückgegeben werden, sodass Claude seine Antwort fortsetzen kann, ohne den Kontext zu verlieren.

Beim Erstellen von kundenorientierten Anwendungen, die erweitertes Denken nutzen:

- Beachten Sie, dass redacted-thinking-Blöcke verschlüsselte Inhalte enthalten, die nicht für Menschen lesbar sind
- Erwägen Sie, eine einfache Erklärung wie diese bereitzustellen: „Einige von Claudes interner Argumentation wurden automatisch aus Sicherheitsgründen verschlüsselt. Dies beeinträchtigt nicht die Qualität der Antworten."
- Wenn Sie Thinking-Blöcke Benutzern zeigen, können Sie redacted-Blöcke filtern und dabei normale Thinking-Blöcke beibehalten
- Seien Sie transparent, dass die Verwendung von erweiterten Thinking-Funktionen gelegentlich dazu führen kann, dass einige Überlegungen verschlüsselt werden
- Implementieren Sie angemessene Fehlerbehandlung, um redacted-thinking ohne Beeinträchtigung Ihrer Benutzeroberfläche elegant zu verwalten

Hier ist ein Beispiel, das sowohl normale als auch redacted-thinking-Blöcke zeigt:

```json
{
  "content": [
    {
      "type": "thinking",
      "thinking": "Let me analyze this step by step...",
      "signature": "WaUjzkypQ2mUEVM36O2TxuC06KN8xyfbJwyem2dw3URve/op91XWHOEBLLqIOMfFG/UvLEczmEsUjavL...."
    },
    {
      "type": "redacted_thinking",
      "data": "EmwKAhgBEgy3va3pzix/LafPsn4aDFIT2Xlxh0L5L8rLVyIwxtE3rAFBa8cr3qpPkNRj2YfWXGmKDxH4mPnZ5sQ7vB9URj2pLmN3kF8/dW5hR7xJ0aP1oLs9yTcMnKVf2wRpEGjH9XZaBt4UvDcPrQ..."
    },
    {
      "type": "text",
      "text": "Based on my analysis..."
    }
  ]
}
```

<Note>
Das Sehen von redacted-thinking-Blöcken in Ihrer Ausgabe ist ein erwartetes Verhalten. Das Modell kann diese redacted-Argumentation weiterhin nutzen, um seine Antworten zu informieren und dabei Sicherheitsvorkehrungen zu wahren.

Wenn Sie die Behandlung von redacted-thinking in Ihrer Anwendung testen müssen, können Sie diese spezielle Test-Zeichenkette als Ihre Eingabeaufforderung verwenden: `ANTHROPIC_MAGIC_STRING_TRIGGER_REDACTED_THINKING_46C9A13E193C177646C7398A98432ECCCE4C1253D5E2D82641AC0E52CC2876CB`
</Note>

Wenn Sie `thinking`- und `redacted_thinking`-Blöcke in einem Multi-Turn-Gespräch an die API zurückgeben, müssen Sie den vollständigen unveränderten Block für den letzten Assistant-Turn an die API zurückgeben. Dies ist entscheidend für die Aufrechterhaltung des Argumentationsflusses des Modells. Wir empfehlen, alle Thinking-Blöcke an die API zurückzugeben. Weitere Details finden Sie im Abschnitt [Thinking-Blöcke beibehalten](#preserving-thinking-blocks) oben.

<section title="Beispiel: Arbeiten mit redacted-thinking-Blöcken">

Dieses Beispiel zeigt, wie Sie `redacted_thinking`-Blöcke verarbeiten, die in Antworten erscheinen können, wenn Claudes interne Argumentation Inhalte enthält, die von Sicherheitssystemen gekennzeichnet werden:

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# Using a special prompt that triggers redacted thinking (for demonstration purposes only)
response = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    messages=[{
        "role": "user",
        "content": "ANTHROPIC_MAGIC_STRING_TRIGGER_REDACTED_THINKING_46C9A13E193C177646C7398A98432ECCCE4C1253D5E2D82641AC0E52CC2876CB"
    }]
)

# Identify redacted thinking blocks
has_redacted_thinking = any(
    block.type == "redacted_thinking" for block in response.content
)

if has_redacted_thinking:
    print("Response contains redacted thinking blocks")
    # These blocks are still usable in subsequent requests

    # Extract all blocks (both redacted and non-redacted)
    all_thinking_blocks = [
        block for block in response.content
        if block.type in ["thinking", "redacted_thinking"]
    ]

    # When passing to subsequent requests, include all blocks without modification
    # This preserves the integrity of Claude's reasoning

    print(f"Found {len(all_thinking_blocks)} thinking blocks total")
    print(f"These blocks are still billable as output tokens")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

// Using a special prompt that triggers redacted thinking (for demonstration purposes only)
const response = await client.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 16000,
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  messages: [{
    role: "user",
    content: "ANTHROPIC_MAGIC_STRING_TRIGGER_REDACTED_THINKING_46C9A13E193C177646C7398A98432ECCCE4C1253D5E2D82641AC0E52CC2876CB"
  }]
});

// Identify redacted thinking blocks
const hasRedactedThinking = response.content.some(
  block => block.type === "redacted_thinking"
);

if (hasRedactedThinking) {
  console.log("Response contains redacted thinking blocks");
  // These blocks are still usable in subsequent requests

  // Extract all blocks (both redacted and non-redacted)
  const allThinkingBlocks = response.content.filter(
    block => block.type === "thinking" || block.type === "redacted_thinking"
  );

  // When passing to subsequent requests, include all blocks without modification
  // This preserves the integrity of Claude's reasoning

  console.log(`Found ${allThinkingBlocks.length} thinking blocks total`);
  console.log(`These blocks are still billable as output tokens`);
}
```

```java Java
import java.util.List;

import static java.util.stream.Collectors.toList;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.beta.messages.BetaContentBlock;
import com.anthropic.models.beta.messages.BetaMessage;
import com.anthropic.models.beta.messages.MessageCreateParams;
import com.anthropic.models.beta.messages.BetaThinkingConfigEnabled;
import com.anthropic.models.messages.Model;

public class RedactedThinkingExample {
    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Using a special prompt that triggers redacted thinking (for demonstration purposes only)
        BetaMessage response = client.beta().messages().create(
                MessageCreateParams.builder()
                        .model(Model.CLAUDE_SONNET_4_5)
                        .maxTokens(16000)
                        .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(10000).build())
                        .addUserMessage("ANTHROPIC_MAGIC_STRING_TRIGGER_REDACTED_THINKING_46C9A13E193C177646C7398A98432ECCCE4C1253D5E2D82641AC0E52CC2876CB")
                        .build()
        );

        // Identify redacted thinking blocks
        boolean hasRedactedThinking = response.content().stream()
                .anyMatch(BetaContentBlock::isRedactedThinking);

        if (hasRedactedThinking) {
            System.out.println("Response contains redacted thinking blocks");
            // These blocks are still usable in subsequent requests
            // Extract all blocks (both redacted and non-redacted)
            List<BetaContentBlock> allThinkingBlocks = response.content().stream()
                    .filter(block -> block.isThinking() ||
                            block.isRedactedThinking())
                    .collect(toList());

            // When passing to subsequent requests, include all blocks without modification
            // This preserves the integrity of Claude's reasoning
            System.out.println("Found " + allThinkingBlocks.size() + " thinking blocks total");
            System.out.println("These blocks are still billable as output tokens");
        }
    }
}
```

</CodeGroup>

<TryInConsoleButton
  userPrompt="ANTHROPIC_MAGIC_STRING_TRIGGER_REDACTED_THINKING_46C9A13E193C177646C7398A98432ECCCE4C1253D5E2D82641AC0E52CC2876CB"
  thinkingBudgetTokens={16000}
>
  Im Konsole versuchen
</TryInConsoleButton>

</section>

## Unterschiede beim Denken über Modellversionen hinweg

Die Messages API verarbeitet das Denken unterschiedlich zwischen Claude Sonnet 3.7 und Claude 4 Modellen, hauptsächlich in Bezug auf Redaktions- und Zusammenfassungsverhalten.

Siehe die folgende Tabelle für einen komprimierten Vergleich:

| Funktion | Claude Sonnet 3.7 | Claude 4 Modelle (vor Opus 4.5) | Claude Opus 4.5 und später |
|---------|------------------|-------------------------------|--------------------------|
| **Thinking-Ausgabe** | Gibt vollständige Thinking-Ausgabe zurück | Gibt zusammengefasste Thinking-Ausgabe zurück | Gibt zusammengefasste Thinking-Ausgabe zurück |
| **Verschachteltes Denken** | Nicht unterstützt | Unterstützt mit `interleaved-thinking-2025-05-14` Beta-Header | Unterstützt mit `interleaved-thinking-2025-05-14` Beta-Header |
| **Thinking-Block-Beibehaltung** | Nicht über Turns hinweg beibehalten | Nicht über Turns hinweg beibehalten | **Standardmäßig beibehalten** (ermöglicht Cache-Optimierung, Token-Einsparungen) |

### Thinking-Block-Beibehaltung in Claude Opus 4.5

Claude Opus 4.5 führt ein neues Standardverhalten ein: **Thinking-Blöcke aus vorherigen Assistant-Turns werden standardmäßig im Modellkontext beibehalten**. Dies unterscheidet sich von früheren Modellen, die Thinking-Blöcke aus vorherigen Turns entfernen.

**Vorteile der Thinking-Block-Beibehaltung:**

- **Cache-Optimierung**: Bei Verwendung von Tool-Use ermöglichen beibehaltene Thinking-Blöcke Cache-Treffer, da sie mit Tool-Ergebnissen zurückgegeben und inkrementell über den Assistant-Turn hinweg zwischengespeichert werden, was zu Token-Einsparungen in mehrstufigen Workflows führt
- **Keine Auswirkung auf die Intelligenz**: Die Beibehaltung von Thinking-Blöcken hat keine negativen Auswirkungen auf die Modellleistung

**Wichtige Überlegungen:**

- **Kontextnutzung**: Lange Gespräche verbrauchen mehr Kontextraum, da Thinking-Blöcke im Kontext beibehalten werden
- **Automatisches Verhalten**: Dies ist das Standardverhalten für Claude Opus 4.5 – keine Codeänderungen oder Beta-Header erforderlich
- **Rückwärtskompatibilität**: Um diese Funktion zu nutzen, geben Sie weiterhin vollständige, unveränderte Thinking-Blöcke an die API zurück, wie Sie es für Tool-Use tun würden

<Note>
Für frühere Modelle (Claude Sonnet 4.5, Opus 4.1 usw.) werden Thinking-Blöcke aus vorherigen Turns weiterhin aus dem Kontext entfernt. Das im Abschnitt [Erweitertes Denken mit Prompt-Caching](#extended-thinking-with-prompt-caching) beschriebene vorhandene Verhalten gilt für diese Modelle.
</Note>

## Preisgestaltung

Vollständige Preisinformationen einschließlich Basissätze, Cache-Schreibvorgänge, Cache-Treffer und Ausgabe-Token finden Sie auf der [Preisseite](/docs/de/about-claude/pricing).

Der Thinking-Prozess verursacht Gebühren für:
- Während des Denkens verwendete Token (Ausgabe-Token)
- Thinking-Blöcke aus dem letzten Assistant-Turn, die in nachfolgenden Anfragen enthalten sind (Eingabe-Token)
- Standard-Text-Ausgabe-Token

<Note>
Wenn erweitertes Denken aktiviert ist, wird automatisch eine spezialisierte Systemaufforderung eingebunden, um diese Funktion zu unterstützen.
</Note>

Bei Verwendung von zusammengefasstem Denken:
- **Eingabe-Token**: Token in Ihrer ursprünglichen Anfrage (schließt Thinking-Token aus vorherigen Turns aus)
- **Ausgabe-Token (abgerechnet)**: Die ursprünglichen Thinking-Token, die Claude intern generiert hat
- **Ausgabe-Token (sichtbar)**: Die zusammengefassten Thinking-Token, die Sie in der Antwort sehen
- **Keine Gebühr**: Token, die zur Generierung der Zusammenfassung verwendet werden

<Warning>
Die abgerechnete Ausgabe-Token-Anzahl wird **nicht** mit der sichtbaren Token-Anzahl in der Antwort übereinstimmen. Sie werden für den vollständigen Thinking-Prozess abgerechnet, nicht für die Zusammenfassung, die Sie sehen.
</Warning>

## Best Practices und Überlegungen für erweitertes Denken

### Arbeiten mit Thinking-Budgets

- **Budget-Optimierung:** Das Mindestbudget beträgt 1.024 Token. Wir empfehlen, mit dem Minimum zu beginnen und das Thinking-Budget schrittweise zu erhöhen, um den optimalen Bereich für Ihren Anwendungsfall zu finden. Höhere Token-Anzahlen ermöglichen umfassendere Überlegungen, aber mit sinkenden Erträgen je nach Aufgabe. Eine Erhöhung des Budgets kann die Antwortqualität verbessern, allerdings auf Kosten erhöhter Latenz. Für kritische Aufgaben testen Sie verschiedene Einstellungen, um das optimale Gleichgewicht zu finden. Beachten Sie, dass das Thinking-Budget ein Ziel und keine strikte Grenze ist – die tatsächliche Token-Nutzung kann je nach Aufgabe variieren.
- **Startpunkte:** Beginnen Sie mit größeren Thinking-Budgets (16k+ Token) für komplexe Aufgaben und passen Sie diese nach Bedarf an.
- **Große Budgets:** Für Thinking-Budgets über 32k empfehlen wir die Verwendung von [Batch-Verarbeitung](/docs/de/build-with-claude/batch-processing), um Netzwerkprobleme zu vermeiden. Anfragen, die das Modell dazu bringen, über 32k Token nachzudenken, führen zu lange laufenden Anfragen, die möglicherweise gegen Systemzeitüberschreitungen und Limits für offene Verbindungen verstoßen.
- **Token-Nutzungsverfolgung:** Überwachen Sie die Thinking-Token-Nutzung, um Kosten und Leistung zu optimieren.

### Leistungsüberlegungen

- **Antwortzeiten:** Seien Sie auf möglicherweise längere Antwortzeiten vorbereitet, da zusätzliche Verarbeitung für den Reasoning-Prozess erforderlich ist. Berücksichtigen Sie, dass die Generierung von Thinking-Blöcken die Gesamtantwortzeit erhöhen kann.
- **Streaming-Anforderungen:** Streaming ist erforderlich, wenn `max_tokens` größer als 21.333 ist. Beim Streaming seien Sie darauf vorbereitet, sowohl Thinking- als auch Text-Content-Blöcke bei ihrer Ankunft zu verarbeiten.

### Funktionskompatibilität

- Denken ist nicht kompatibel mit `temperature`- oder `top_k`-Änderungen sowie mit [erzwungener Tool-Nutzung](/docs/de/agents-and-tools/tool-use/implement-tool-use#forcing-tool-use).
- Wenn Denken aktiviert ist, können Sie `top_p` auf Werte zwischen 1 und 0,95 setzen.
- Sie können Antworten nicht vorausfüllen, wenn Denken aktiviert ist.
- Änderungen am Thinking-Budget machen zwischengespeicherte Prompt-Präfixe ungültig, die Nachrichten enthalten. Zwischengespeicherte Systemaufforderungen und Tool-Definitionen funktionieren jedoch weiterhin, wenn sich Thinking-Parameter ändern.

### Nutzungsrichtlinien

- **Aufgabenauswahl:** Verwenden Sie erweitertes Denken für besonders komplexe Aufgaben, die von schrittweiser Argumentation profitieren, wie Mathematik, Codierung und Analyse.
- **Kontextbehandlung:** Sie müssen vorherige Thinking-Blöcke nicht selbst entfernen. Die Claude API ignoriert automatisch Thinking-Blöcke aus vorherigen Turns und sie werden nicht bei der Berechnung der Kontextnutzung berücksichtigt.
- **Prompt-Engineering:** Lesen Sie unsere [Tipps zum Prompt-Engineering für erweitertes Denken](/docs/de/build-with-claude/prompt-engineering/extended-thinking-tips), wenn Sie Claudes Thinking-Fähigkeiten maximieren möchten.

## Nächste Schritte

<CardGroup>
  <Card title="Probieren Sie das Extended-Thinking-Cookbook aus" icon="book" href="https://github.com/anthropics/anthropic-cookbook/tree/main/extended_thinking">
    Erkunden Sie praktische Beispiele des Denkens in unserem Cookbook.
  </Card>
  <Card title="Tipps zum Prompt-Engineering für erweitertes Denken" icon="code" href="/docs/de/build-with-claude/prompt-engineering/extended-thinking-tips">
    Lernen Sie Best Practices für Prompt-Engineering beim erweiterten Denken.
  </Card>
</CardGroup>