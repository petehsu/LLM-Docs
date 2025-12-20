# Text-Editor-Tool

Claude kann ein von Anthropic definiertes Text-Editor-Tool verwenden, um Textdateien anzuzeigen und zu ändern und dir beim Debuggen, Beheben und Verbessern deines Codes oder anderer Textdokumente zu helfen.

---

Claude kann ein von Anthropic definiertes Text-Editor-Tool verwenden, um Textdateien anzuzeigen und zu ändern, was dir beim Debuggen, Beheben und Verbessern deines Codes oder anderer Textdokumente hilft. Dies ermöglicht Claude, direkt mit deinen Dateien zu interagieren und praktische Unterstützung zu bieten, anstatt nur Änderungen vorzuschlagen.

## Modellkompatibilität

| Modell | Tool-Version |
|-------|--------------|
| Claude 4.x Modelle | `text_editor_20250728` |
| Claude Sonnet 3.7 ([veraltet](/docs/de/about-claude/model-deprecations)) | `text_editor_20250124` |

<Warning>
Das `text_editor_20250728` Tool für Claude 4 Modelle enthält nicht den `undo_edit` Befehl. Wenn du diese Funktionalität benötigst, musst du Claude Sonnet 3.7 ([veraltet](/docs/de/about-claude/model-deprecations)) verwenden.
</Warning>

<Warning>
Ältere Tool-Versionen sind nicht garantiert rückwärtskompatibel mit neueren Modellen. Verwende immer die Tool-Version, die deiner Modellversion entspricht.
</Warning>

## Wann das Text-Editor-Tool verwendet werden sollte

Einige Beispiele für die Verwendung des Text-Editor-Tools sind:
- **Code-Debugging**: Lass Claude Fehler in deinem Code identifizieren und beheben, von Syntaxfehlern bis zu Logikproblemen.
- **Code-Refaktorierung**: Lass Claude deine Code-Struktur, Lesbarkeit und Leistung durch gezielte Änderungen verbessern.
- **Dokumentationsgenerierung**: Bitte Claude, Docstrings, Kommentare oder README-Dateien zu deiner Codebasis hinzuzufügen.
- **Test-Erstellung**: Lass Claude Unit-Tests für deinen Code basierend auf seinem Verständnis der Implementierung erstellen.

## Das Text-Editor-Tool verwenden

<Tabs>
<Tab title="Claude 4">
Stelle das Text-Editor-Tool (benannt `str_replace_based_edit_tool`) Claude über die Messages API zur Verfügung.

Du kannst optional einen `max_characters` Parameter angeben, um die Kürzung beim Anzeigen großer Dateien zu steuern.

<Note>
`max_characters` ist nur mit `text_editor_20250728` und späteren Versionen des Text-Editor-Tools kompatibel.
</Note>

<CodeGroup>

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
        "type": "text_editor_20250728",
        "name": "str_replace_based_edit_tool",
        "max_characters": 10000
      }
    ],
    "messages": [
      {
        "role": "user",
        "content": "There'\''s a syntax error in my primes.py file. Can you help me fix it?"
      }
    ]
  }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[
        {
            "type": "text_editor_20250728",
            "name": "str_replace_based_edit_tool",
            "max_characters": 10000
        }
    ],
    messages=[
        {
            "role": "user", 
            "content": "There's a syntax error in my primes.py file. Can you help me fix it?"
        }
    ]
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const response = await anthropic.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: [
    {
      type: "text_editor_20250728",
      name: "str_replace_based_edit_tool",
      max_characters: 10000
    }
  ],
  messages: [
    {
      role: "user",
      content: "There's a syntax error in my primes.py file. Can you help me fix it?"
    }
  ]
});
```

```java Java
import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.ToolStrReplaceBasedEditTool20250728;

public class TextEditorToolExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        ToolStrReplaceBasedEditTool20250728 editorTool = ToolStrReplaceBasedEditTool20250728.builder()
                .build();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_SONNET_4_0)
                .maxTokens(1024)
                .addTool(editorTool)
                .addUserMessage("There's a syntax error in my primes.py file. Can you help me fix it?")
                .build();

        Message message = client.messages().create(params);
    }
}
```
</CodeGroup>
</Tab>
<Tab title="Claude Sonnet 3.7">
Stelle das Text-Editor-Tool (benannt `str_replace_editor`) Claude über die Messages API zur Verfügung:
<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-3-7-sonnet-20250219",
    "max_tokens": 1024,
    "tools": [
      {
        "type": "text_editor_20250124",
        "name": "str_replace_editor"
      }
    ],
    "messages": [
      {
        "role": "user",
        "content": "There'\''s a syntax error in my primes.py file. Can you help me fix it?"
      }
    ]
  }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-3-7-sonnet-20250219",
    max_tokens=1024,
    tools=[
        {
            "type": "text_editor_20250124",
            "name": "str_replace_editor"
        }
    ],
    messages=[
        {
            "role": "user", 
            "content": "There's a syntax error in my primes.py file. Can you help me fix it?"
        }
    ]
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const response = await anthropic.messages.create({
  model: "claude-3-7-sonnet-20250219",
  max_tokens: 1024,
  tools: [
    {
      type: "text_editor_20250124",
      name: "str_replace_editor"
    }
  ],
  messages: [
    {
      role: "user",
      content: "There's a syntax error in my primes.py file. Can you help me fix it?"
    }
  ]
});
```

```java Java
import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.ToolTextEditor20250124;

public class TextEditorToolExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        ToolTextEditor20250124 editorTool = ToolTextEditor20250124.builder()
                .build();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_3_7_SONNET_LATEST)
                .maxTokens(1024)
                .addTool(editorTool)
                .addUserMessage("There's a syntax error in my primes.py file. Can you help me fix it?")
                .build();

        Message message = client.messages().create(params);
    }
}
```
</CodeGroup>
</Tab>
</Tabs>

Das Text-Editor-Tool kann auf folgende Weise verwendet werden:

<Steps>
  <Step title="Stelle Claude das Text-Editor-Tool und eine Benutzereingabe zur Verfügung">
    - Füge das Text-Editor-Tool in deine API-Anfrage ein
    - Stelle eine Benutzereingabe bereit, die möglicherweise das Untersuchen oder Ändern von Dateien erfordert, wie z. B. „Kannst du den Syntaxfehler in meinem Code beheben?"
  </Step>
  <Step title="Claude verwendet das Tool, um Dateien oder Verzeichnisse zu untersuchen">
    - Claude bewertet, was es sich ansehen muss, und verwendet den `view` Befehl, um Dateiinhalte zu untersuchen oder Verzeichnisinhalte aufzulisten
    - Die API-Antwort enthält einen `tool_use` Inhaltsblock mit dem `view` Befehl
  </Step>
  <Step title="Führe den view-Befehl aus und gib die Ergebnisse zurück">
    - Extrahiere den Datei- oder Verzeichnispfad aus Claudes Tool-Use-Anfrage
    - Lese den Dateiinhalt oder liste die Verzeichnisinhalte auf
    - Wenn ein `max_characters` Parameter in der Tool-Konfiguration angegeben wurde, kürze den Dateiinhalt auf diese Länge
    - Gib die Ergebnisse an Claude zurück, indem du das Gespräch mit einer neuen `user` Nachricht fortsetzt, die einen `tool_result` Inhaltsblock enthält
  </Step>
  <Step title="Claude verwendet das Tool, um Dateien zu ändern">
    - Nach dem Untersuchen der Datei oder des Verzeichnisses kann Claude einen Befehl wie `str_replace` verwenden, um Änderungen vorzunehmen, oder `insert`, um Text an einer bestimmten Zeilennummer hinzuzufügen
    - Wenn Claude den `str_replace` Befehl verwendet, erstellt Claude eine ordnungsgemäß formatierte Tool-Use-Anfrage mit dem alten Text und dem neuen Text, um ihn zu ersetzen
  </Step>
  <Step title="Führe die Bearbeitung aus und gib die Ergebnisse zurück">
    - Extrahiere den Dateipfad, den alten Text und den neuen Text aus Claudes Tool-Use-Anfrage
    - Führe die Textersetzung in der Datei durch
    - Gib die Ergebnisse an Claude zurück
  </Step>
  <Step title="Claude bietet seine Analyse und Erklärung">
    - Nach dem Untersuchen und möglicherweise Bearbeiten der Dateien bietet Claude eine vollständige Erklärung dessen, was es gefunden hat und welche Änderungen es vorgenommen hat
  </Step>
</Steps>

### Text-Editor-Tool-Befehle

Das Text-Editor-Tool unterstützt mehrere Befehle zum Anzeigen und Ändern von Dateien:

#### view

Der `view` Befehl ermöglicht Claude, den Inhalt einer Datei zu untersuchen oder die Inhalte eines Verzeichnisses aufzulisten. Er kann die gesamte Datei oder einen bestimmten Zeilenbereich lesen.

Parameter:
- `command`: Muss „view" sein
- `path`: Der Pfad zur anzuzeigenden Datei oder zum Verzeichnis
- `view_range` (optional): Ein Array von zwei Ganzzahlen, das die Start- und Endzeilennummern zum Anzeigen angibt. Zeilennummern sind 1-indiziert, und -1 für die Endzeilennummer bedeutet bis zum Ende der Datei lesen. Dieser Parameter gilt nur beim Anzeigen von Dateien, nicht von Verzeichnissen.

<section title="Beispiel-view-Befehle">

```json
// Beispiel zum Anzeigen einer Datei
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "str_replace_editor",
  "input": {
    "command": "view",
    "path": "primes.py"
  }
}

// Beispiel zum Anzeigen eines Verzeichnisses
{
  "type": "tool_use",
  "id": "toolu_02B19r91rw91mr917835mr9",
  "name": "str_replace_editor",
  "input": {
    "command": "view",
    "path": "src/"
  }
}
```

</section>

#### str_replace

Der `str_replace` Befehl ermöglicht Claude, eine bestimmte Zeichenkette in einer Datei durch eine neue Zeichenkette zu ersetzen. Dies wird für präzise Änderungen verwendet.

Parameter:
- `command`: Muss „str_replace" sein
- `path`: Der Pfad zur zu ändernden Datei
- `old_str`: Der zu ersetzende Text (muss genau übereinstimmen, einschließlich Leerzeichen und Einrückung)
- `new_str`: Der neue Text, der anstelle des alten Textes eingefügt werden soll

<section title="Beispiel str_replace Befehl">

```json
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "str_replace_editor",
  "input": {
    "command": "str_replace",
    "path": "primes.py",
    "old_str": "for num in range(2, limit + 1)",
    "new_str": "for num in range(2, limit + 1):"
  }
}
```

</section>

#### create

Der `create` Befehl ermöglicht Claude, eine neue Datei mit angegebenem Inhalt zu erstellen.

Parameter:
- `command`: Muss „create" sein
- `path`: Der Pfad, wo die neue Datei erstellt werden soll
- `file_text`: Der Inhalt, der in die neue Datei geschrieben werden soll

<section title="Beispiel create Befehl">

```json
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "str_replace_editor",
  "input": {
    "command": "create",
    "path": "test_primes.py",
    "file_text": "import unittest\nimport primes\n\nclass TestPrimes(unittest.TestCase):\n    def test_is_prime(self):\n        self.assertTrue(primes.is_prime(2))\n        self.assertTrue(primes.is_prime(3))\n        self.assertFalse(primes.is_prime(4))\n\nif __name__ == '__main__':\n    unittest.main()"
  }
}
```

</section>

#### insert

Der `insert` Befehl ermöglicht Claude, Text an einer bestimmten Stelle in einer Datei einzufügen.

Parameter:
- `command`: Muss „insert" sein
- `path`: Der Pfad zur zu ändernden Datei
- `insert_line`: Die Zeilennummer, nach der der Text eingefügt werden soll (0 für Anfang der Datei)
- `new_str`: Der einzufügende Text

<section title="Beispiel insert Befehl">

```json
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "str_replace_editor",
  "input": {
    "command": "insert",
    "path": "primes.py",
    "insert_line": 0,
    "new_str": "\"\"\"Module for working with prime numbers.\n\nThis module provides functions to check if a number is prime\nand to generate a list of prime numbers up to a given limit.\n\"\"\"\n"
  }
}
```

</section>

#### undo_edit

Der `undo_edit` Befehl ermöglicht Claude, die letzte an einer Datei vorgenommene Bearbeitung rückgängig zu machen.

<Note>
Dieser Befehl ist nur in Claude Sonnet 3.7 ([veraltet](/docs/de/about-claude/model-deprecations)) verfügbar. Er wird in Claude 4 Modellen mit dem `text_editor_20250728` nicht unterstützt.
</Note>

Parameter:
- `command`: Muss „undo_edit" sein
- `path`: Der Pfad zur Datei, deren letzte Bearbeitung rückgängig gemacht werden soll

<section title="Beispiel undo_edit Befehl">

```json
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "str_replace_editor",
  "input": {
    "command": "undo_edit",
    "path": "primes.py"
  }
}
```

</section>

### Beispiel: Beheben eines Syntaxfehlers mit dem Text-Editor-Tool

<Tabs>
<Tab title="Claude 4">

Dieses Beispiel zeigt, wie Claude 4 Modelle das Text-Editor-Tool verwenden, um einen Syntaxfehler in einer Python-Datei zu beheben.

Zunächst stellt deine Anwendung Claude das Text-Editor-Tool und eine Eingabeaufforderung zur Behebung eines Syntaxfehlers zur Verfügung:

<CodeGroup>
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
        "type": "text_editor_20250728",
        "name": "str_replace_based_edit_tool"
      }
    ],
    "messages": [
      {
        "role": "user",
        "content": "There'\''s a syntax error in my primes.py file. Can you help me fix it?"
      }
    ]
  }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[
        {
            "type": "text_editor_20250728",
            "name": "str_replace_based_edit_tool"
        }
    ],
    messages=[
        {
            "role": "user", 
            "content": "There's a syntax error in my primes.py file. Can you help me fix it?"
        }
    ]
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const response = await anthropic.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: [
    {
      type: "text_editor_20250728",
      name: "str_replace_based_edit_tool"
    }
  ],
  messages: [
    {
      role: "user",
      content: "There's a syntax error in my primes.py file. Can you help me fix it?"
    }
  ]
});
```

```java Java
import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.ToolStrReplaceBasedEditTool20250728;

public class TextEditorToolExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        ToolStrReplaceBasedEditTool20250728 editorTool = ToolStrReplaceBasedEditTool20250728.builder()
                .build();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_SONNET_4_0)
                .maxTokens(1024)
                .addTool(editorTool)
                .addUserMessage("There's a syntax error in my primes.py file. Can you help me fix it?")
                .build();

        Message message = client.messages().create(params);
    }
}
```
</CodeGroup>

Claude wird das Text-Editor-Tool zuerst verwenden, um die Datei anzuzeigen:

```json
{
  "id": "msg_01XAbCDeFgHiJkLmNoPQrStU",
  "model": "claude-sonnet-4-5",
  "stop_reason": "tool_use",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "I'll help you fix the syntax error in your primes.py file. First, let me take a look at the file to identify the issue."
    },
    {
      "type": "tool_use",
      "id": "toolu_01AbCdEfGhIjKlMnOpQrStU",
      "name": "str_replace_based_edit_tool",
      "input": {
        "command": "view",
        "path": "primes.py"
      }
    }
  ]
}
```

Deine Anwendung sollte dann die Datei lesen und ihren Inhalt an Claude zurückgeben:

<CodeGroup>
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
        "type": "text_editor_20250728",
        "name": "str_replace_based_edit_tool"
      }
    ],
    "messages": [
      {
        "role": "user",
        "content": "There'\''s a syntax error in my primes.py file. Can you help me fix it?"
      },
      {
            "role": "assistant",
            "content": [
                {
                    "type": "text",
                    "text": "I'\''ll help you fix the syntax error in your primes.py file. First, let me take a look at the file to identify the issue."
                },
                {
                    "type": "tool_use",
                    "id": "toolu_01AbCdEfGhIjKlMnOpQrStU",
                    "name": "str_replace_based_edit_tool",
                    "input": {
                        "command": "view",
                        "path": "primes.py"
                    }
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "tool_result",
                    "tool_use_id": "toolu_01AbCdEfGhIjKlMnOpQrStU",
                    "content": "1: def is_prime(n):\n2:     \"\"\"Check if a number is prime.\"\"\"\n3:     if n <= 1:\n4:         return False\n5:     if n <= 3:\n6:         return True\n7:     if n % 2 == 0 or n % 3 == 0:\n8:         return False\n9:     i = 5\n10:     while i * i <= n:\n11:         if n % i == 0 or n % (i + 2) == 0:\n12:             return False\n13:         i += 6\n14:     return True\n15: \n16: def get_primes(limit):\n17:     \"\"\"Generate a list of prime numbers up to the given limit.\"\"\"\n18:     primes = []\n19:     for num in range(2, limit + 1)\n20:         if is_prime(num):\n21:             primes.append(num)\n22:     return primes\n23: \n24: def main():\n25:     \"\"\"Main function to demonstrate prime number generation.\"\"\"\n26:     limit = 100\n27:     prime_list = get_primes(limit)\n28:     print(f\"Prime numbers up to {limit}:\")\n29:     print(prime_list)\n30:     print(f\"Found {len(prime_list)} prime numbers.\")\n31: \n32: if __name__ == \"__main__\":\n33:     main()"
                }
            ]
        }
    ]
  }'
```

```python Python
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[
        {
            "type": "text_editor_20250728",
            "name": "str_replace_based_edit_tool"
        }
    ],
    messages=[
        {
            "role": "user", 
            "content": "There's a syntax error in my primes.py file. Can you help me fix it?"
        },
        {
            "role": "assistant",
            "content": [
                {
                    "type": "text",
                    "text": "I'll help you fix the syntax error in your primes.py file. First, let me take a look at the file to identify the issue."
                },
                {
                    "type": "tool_use",
                    "id": "toolu_01AbCdEfGhIjKlMnOpQrStU",
                    "name": "str_replace_based_edit_tool",
                    "input": {
                        "command": "view",
                        "path": "primes.py"
                    }
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "tool_result",
                    "tool_use_id": "toolu_01AbCdEfGhIjKlMnOpQrStU",
                    "content": "1: def is_prime(n):\n2:     \"\"\"Check if a number is prime.\"\"\"\n3:     if n <= 1:\n4:         return False\n5:     if n <= 3:\n6:         return True\n7:     if n % 2 == 0 or n % 3 == 0:\n8:         return False\n9:     i = 5\n10:     while i * i <= n:\n11:         if n % i == 0 or n % (i + 2) == 0:\n12:             return False\n13:         i += 6\n14:     return True\n15: \n16: def get_primes(limit):\n17:     \"\"\"Generate a list of prime numbers up to the given limit.\"\"\"\n18:     primes = []\n19:     for num in range(2, limit + 1)\n20:         if is_prime(num):\n21:             primes.append(num)\n22:     return primes\n23: \n24: def main():\n25:     \"\"\"Main function to demonstrate prime number generation.\"\"\"\n26:     limit = 100\n27:     prime_list = get_primes(limit)\n28:     print(f\"Prime numbers up to {limit}:\")\n29:     print(prime_list)\n30:     print(f\"Found {len(prime_list)} prime numbers.\")\n31: \n32: if __name__ == \"__main__\":\n33:     main()"
                }
            ]
        }
    ]
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const response = await anthropic.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: [
    {
      type: "text_editor_20250728",
      name: "str_replace_based_edit_tool"
    }
  ],
  messages: [
    {
      role: "user",
      content: "There's a syntax error in my primes.py file. Can you help me fix it?"
    },
    {
      role: "assistant",
      content: [
          {
              type: "text",
              text: "I'll help you fix the syntax error in your primes.py file. First, let me take a look at the file to identify the issue."
          },
          {
              type: "tool_use",
              id: "toolu_01AbCdEfGhIjKlMnOpQrStU",
              name: "str_replace_based_edit_tool",
              input: {
                  command: "view",
                  path: "primes.py"
              }
          }
      ]
    },
    {
      role: "user",
      content: [
          {
              type: "tool_result",
              tool_use_id: "toolu_01AbCdEfGhIjKlMnOpQrStU",
              content: "1: def is_prime(n):\n2:     \"\"\"Check if a number is prime.\"\"\"\n3:     if n <= 1:\n4:         return False\n5:     if n <= 3:\n6:         return True\n7:     if n % 2 == 0 or n % 3 == 0:\n8:         return False\n9:     i = 5\n10:     while i * i <= n:\n11:         if n % i == 0 or n % (i + 2) == 0:\n12:             return False\n13:         i += 6\n14:     return True\n15: \n16: def get_primes(limit):\n17:     \"\"\"Generate a list of prime numbers up to the given limit.\"\"\"\n18:     primes = []\n19:     for num in range(2, limit + 1)\n20:         if is_prime(num):\n21:             primes.append(num)\n22:     return primes\n23: \n24: def main():\n25:     \"\"\"Main function to demonstrate prime number generation.\"\"\"\n26:     limit = 100\n27:     prime_list = get_primes(limit)\n28:     print(f\"Prime numbers up to {limit}:\")\n29:     print(prime_list)\n30:     print(f\"Found {len(prime_list)} prime numbers.\")\n31: \n32: if __name__ == \"__main__\":\n33:     main()"
          }
      ]
    }
  ]
});
```

```java Java
import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.ToolStrReplaceBasedEditTool20250728;

public class TextEditorToolExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        ToolStrReplaceBasedEditTool20250728 editorTool = ToolStrReplaceBasedEditTool20250728.builder()
            .build();

        MessageCreateParams params = MessageCreateParams.builder()
            .model(Model.CLAUDE_SONNET_4_0)
            .maxTokens(1024)
            .addTool(editorTool)
            .addUserMessage("There's a syntax error in my primes.py file. Can you help me fix it?")
            .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>

<Tip>
**Zeilennummern**

Im obigen Beispiel enthält das `view` Tool-Ergebnis Dateiinhalte mit Zeilennummern, die jeder Zeile vorangestellt sind (z. B. „1: def is_prime(n):"). Zeilennummern sind nicht erforderlich, aber sie sind essentiell für die erfolgreiche Verwendung des `view_range` Parameters zum Untersuchen bestimmter Dateibereiche und des `insert_line` Parameters zum Hinzufügen von Inhalten an genauen Positionen.
</Tip>

Claude wird den Syntaxfehler identifizieren und den `str_replace` Befehl verwenden, um ihn zu beheben:

```json
{
  "id": "msg_01VwXyZAbCdEfGhIjKlMnO",
  "model": "claude-sonnet-4-5",
  "stop_reason": "tool_use",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "I found the syntax error in your primes.py file. In the `get_primes` function, there is a missing colon (:) at the end of the for loop line. Let me fix that for you."
    },
    {
      "type": "tool_use",
      "id": "toolu_01PqRsTuVwXyZAbCdEfGh",
      "name": "str_replace_based_edit_tool",
      "input": {
        "command": "str_replace",
        "path": "primes.py",
        "old_str": "    for num in range(2, limit + 1)",
        "new_str": "    for num in range(2, limit + 1):"
      }
    }
  ]
}
```

Deine Anwendung sollte dann die Bearbeitung durchführen und das Ergebnis zurückgeben:

<CodeGroup>
```python Python
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[
        {
            "type": "text_editor_20250728",
            "name": "str_replace_based_edit_tool"
        }
    ],
    messages=[
        # Previous messages...
        {
            "role": "assistant",
            "content": [
                {
                    "type": "text",
                    "text": "I found the syntax error in your primes.py file. In the `get_primes` function, there is a missing colon (:) at the end of the for loop line. Let me fix that for you."
                },
                {
                    "type": "tool_use",
                    "id": "toolu_01PqRsTuVwXyZAbCdEfGh",
                    "name": "str_replace_based_edit_tool",
                    "input": {
                        "command": "str_replace",
                        "path": "primes.py",
                        "old_str": "    for num in range(2, limit + 1)",
                        "new_str": "    for num in range(2, limit + 1):"
                    }
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "tool_result",
                    "tool_use_id": "toolu_01PqRsTuVwXyZAbCdEfGh",
                    "content": "Successfully replaced text at exactly one location."
                }
            ]
        }
    ]
)
```

```typescript TypeScript
const response = await anthropic.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: [
    {
      type: "text_editor_20250728",
      name: "str_replace_based_edit_tool"
    }
  ],
  messages: [
    // Previous messages...
    {
      role: "assistant",
      content: [
        {
          type: "text",
          text: "I found the syntax error in your primes.py file. In the `get_primes` function, there is a missing colon (:) at the end of the for loop line. Let me fix that for you."
        },
        {
          type: "tool_use",
          id: "toolu_01PqRsTuVwXyZAbCdEfGh",
          name: "str_replace_based_edit_tool",
          input: {
            command: "str_replace",
            path: "primes.py",
            old_str: "    for num in range(2, limit + 1)",
            new_str: "    for num in range(2, limit + 1):"
          }
        }
      ]
    },
    {
      role: "user",
      content: [
        {
          type: "tool_result",
          tool_use_id: "toolu_01PqRsTuVwXyZAbCdEfGh",
          content: "Successfully replaced text at exactly one location."
        }
      ]
    }
  ]
});
```

```java Java
import java.util.List;
import java.util.Map;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.JsonValue;
import com.anthropic.models.messages.ContentBlockParam;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.MessageParam;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;
import com.anthropic.models.messages.ToolResultBlockParam;
import com.anthropic.models.messages.ToolStrReplaceBasedEditTool20250728;
import com.anthropic.models.messages.ToolUseBlockParam;

public class TextEditorConversationExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_SONNET_4_0)
                .maxTokens(1024)
                .addTool(ToolStrReplaceBasedEditTool20250728.builder()
                        .build())
                // Previous messages would go here
                .addAssistantMessageOfBlockParams(
                        List.of(
                                ContentBlockParam.ofText(TextBlockParam.builder()
                                        .text("I found the syntax error in your primes.py file. In the `get_primes` function, there is a missing colon (:) at the end of the for loop line. Let me fix that for you.")
                                        .build()),
                                ContentBlockParam.ofToolUse(ToolUseBlockParam.builder()
                                        .id("toolu_01PqRsTuVwXyZAbCdEfGh")
                                        .name("str_replace_based_edit_tool")
                                        .input(JsonValue.from(Map.of(
                                                "command", "str_replace",
                                                "path", "primes.py",
                                                "old_str", "    for num in range(2, limit + 1)",
                                                "new_str", "    for num in range(2, limit + 1):"
                                        )))
                                        .build()
                                )
                        )
                )
                .addUserMessageOfBlockParams(List.of(
                        ContentBlockParam.ofToolResult(ToolResultBlockParam.builder()
                                .toolUseId("toolu_01PqRsTuVwXyZAbCdEfGh")
                                .content("Successfully replaced text at exactly one location.")
                                .build()
                        )
                ))
                .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>

Abschließend wird Claude eine vollständige Erklärung der Behebung bereitstellen:

```json
{
  "id": "msg_01IjKlMnOpQrStUvWxYzAb",
  "model": "claude-sonnet-4-5",
  "stop_reason": "end_turn",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "I've fixed the syntax error in your primes.py file. The issue was in the `get_primes` function at line 19. There was a missing colon (:) at the end of the for loop line.\n\nHere's what I changed:\n\nFrom:\n```python\nfor num in range(2, limit + 1)\n```\n\nTo:\n```python\nfor num in range(2, limit + 1):\n```\n\nIn Python, a colon is required at the end of statements that start a new code block, such as for loops, if statements, function definitions, etc. Without the colon, Python raises a syntax error because it doesn't know where the code block begins.\n\nYour code should now run correctly. The function will properly generate a list of prime numbers up to the specified limit."
    }
  ]
}
```
</Tab>

<Tab title="Claude Sonnet 3.7">
Dieses Beispiel zeigt, wie Claude Sonnet 3.7 das Text-Editor-Tool verwendet, um einen Syntaxfehler in einer Python-Datei zu beheben.

Zunächst stellt deine Anwendung Claude das Text-Editor-Tool und eine Eingabeaufforderung zur Behebung eines Syntaxfehlers zur Verfügung:

```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-3-7-sonnet-20250219",
    max_tokens=1024,
    tools=[
        {
            "type": "text_editor_20250124",
            "name": "str_replace_editor"
        }
    ],
    messages=[
        {
            "role": "user", 
            "content": "There's a syntax error in my primes.py file. Can you help me fix it?"
        }
    ]
)

print(response)
```

<Note>
Die Claude Sonnet 3.7 Beispiele folgen dem gleichen Format wie die Claude 4 Beispiele oben und verwenden die gleichen Tool-Aufrufe und Antworten, aber mit dem `text_editor_20250124` Tool-Typ und dem Namen `str_replace_editor`.
</Note>
</Tab>
</Tabs>

***

## Implementieren Sie das Text-Editor-Tool

Das Text-Editor-Tool wird als schemalooses Tool implementiert. Bei der Verwendung dieses Tools müssen Sie kein Eingabeschema wie bei anderen Tools bereitstellen; das Schema ist in Claudes Modell integriert und kann nicht geändert werden.

Der Tool-Typ hängt von der Modellversion ab:
- **Claude 4**: `type: "text_editor_20250728"`
- **Claude Sonnet 3.7**: `type: "text_editor_20250124"`

<Steps>
  <Step title="Initialisieren Sie Ihre Editor-Implementierung">
    Erstellen Sie Hilfsfunktionen zur Verarbeitung von Dateivorgängen wie Lesen, Schreiben und Ändern von Dateien. Erwägen Sie die Implementierung einer Sicherungsfunktion, um sich von Fehlern zu erholen.
  </Step>
  <Step title="Verarbeiten Sie Editor-Tool-Aufrufe">
    Erstellen Sie eine Funktion, die Tool-Aufrufe von Claude basierend auf dem Befehlstyp verarbeitet:
    ```python
    def handle_editor_tool(tool_call, model_version):
        input_params = tool_call.input
        command = input_params.get('command', '')
        file_path = input_params.get('path', '')
        
        if command == 'view':
            # Read and return file contents
            pass
        elif command == 'str_replace':
            # Replace text in file
            pass
        elif command == 'create':
            # Create new file
            pass
        elif command == 'insert':
            # Insert text at location
            pass
        elif command == 'undo_edit':
            # Check if it's a Claude 4 model
            if 'str_replace_based_edit_tool' in model_version:
                return {"error": "undo_edit command is not supported in Claude 4"}
            # Restore from backup for Claude 3.7
            pass
    ```
  </Step>
  <Step title="Implementieren Sie Sicherheitsmaßnahmen">
    Fügen Sie Validierungs- und Sicherheitsprüfungen hinzu:
    - Validieren Sie Dateipfade, um Directory-Traversal zu verhindern
    - Erstellen Sie Sicherungen vor Änderungen
    - Behandeln Sie Fehler elegant
    - Implementieren Sie Berechtigungsprüfungen
  </Step>
  <Step title="Verarbeiten Sie Claudes Antworten">
    Extrahieren und verarbeiten Sie Tool-Aufrufe aus Claudes Antworten:
    ```python
    # Process tool use in Claude's response
    for content in response.content:
        if content.type == "tool_use":
            # Execute the tool based on command
            result = handle_editor_tool(content)
            
            # Return result to Claude
            tool_result = {
                "type": "tool_result",
                "tool_use_id": content.id,
                "content": result
            }
    ```
  </Step>
</Steps>

<Warning>
Beachten Sie bei der Implementierung des Text-Editor-Tools Folgendes:

1. **Sicherheit**: Das Tool hat Zugriff auf Ihr lokales Dateisystem, daher implementieren Sie angemessene Sicherheitsmaßnahmen.
2. **Sicherung**: Erstellen Sie immer Sicherungen, bevor Sie Änderungen an wichtigen Dateien zulassen.
3. **Validierung**: Validieren Sie alle Eingaben, um unbeabsichtigte Änderungen zu verhindern.
4. **Eindeutige Übereinstimmung**: Stellen Sie sicher, dass Ersetzungen genau an einer Stelle übereinstimmen, um unbeabsichtigte Änderungen zu vermeiden.
</Warning>

### Fehler behandeln

Bei der Verwendung des Text-Editor-Tools können verschiedene Fehler auftreten. Hier finden Sie Anleitungen zur Fehlerbehandlung:

<section title="Datei nicht gefunden">

Wenn Claude versucht, eine Datei anzuzeigen oder zu ändern, die nicht vorhanden ist, geben Sie eine entsprechende Fehlermeldung in `tool_result` zurück:

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Error: File not found",
      "is_error": true
    }
  ]
}
```

</section>

<section title="Mehrere Übereinstimmungen für Ersetzung">

Wenn Claudes `str_replace`-Befehl mehrere Stellen in der Datei findet, geben Sie eine entsprechende Fehlermeldung zurück:

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Error: Found 3 matches for replacement text. Please provide more context to make a unique match.",
      "is_error": true
    }
  ]
}
```

</section>

<section title="Keine Übereinstimmungen für Ersetzung">

Wenn Claudes `str_replace`-Befehl keinen Text in der Datei findet, geben Sie eine entsprechende Fehlermeldung zurück:

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Error: No match found for replacement. Please check your text and try again.",
      "is_error": true
    }
  ]
}
```

</section>

<section title="Berechtigungsfehler">

Wenn es Berechtigungsprobleme beim Erstellen, Lesen oder Ändern von Dateien gibt, geben Sie eine entsprechende Fehlermeldung zurück:

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Error: Permission denied. Cannot write to file.",
      "is_error": true
    }
  ]
}
```

</section>

### Befolgen Sie Best Practices für die Implementierung

<section title="Geben Sie klaren Kontext">

Seien Sie spezifisch, wenn Sie Claude bitten, Code zu reparieren oder zu ändern, welche Dateien untersucht werden müssen oder welche Probleme behoben werden müssen. Ein klarer Kontext hilft Claude, die richtigen Dateien zu identifizieren und angemessene Änderungen vorzunehmen.

**Weniger hilfreich**: "Kannst du meinen Code reparieren?"

**Besser**: "Es gibt einen Syntaxfehler in meiner primes.py-Datei, der verhindert, dass sie ausgeführt wird. Kannst du ihn reparieren?"

</section>

<section title="Seien Sie explizit bei Dateipfaden">

Geben Sie Dateipfade klar an, besonders wenn Sie mit mehreren Dateien oder Dateien in verschiedenen Verzeichnissen arbeiten.

**Weniger hilfreich**: "Überprüfe meine Hilfsdatei"

**Besser**: "Kannst du meine utils/helpers.py-Datei auf Leistungsprobleme überprüfen?"

</section>

<section title="Erstellen Sie Sicherungen vor der Bearbeitung">

Implementieren Sie ein Sicherungssystem in Ihrer Anwendung, das Kopien von Dateien erstellt, bevor Claude sie bearbeitet, besonders für wichtige oder Produktionscode.

```python
def backup_file(file_path):
    """Create a backup of a file before editing."""
    backup_path = f"{file_path}.backup"
    if os.path.exists(file_path):
        with open(file_path, 'r') as src, open(backup_path, 'w') as dst:
            dst.write(src.read())
```

</section>

<section title="Behandeln Sie eindeutige Textersetzung sorgfältig">

Der `str_replace`-Befehl erfordert eine genaue Übereinstimmung für den zu ersetzenden Text. Ihre Anwendung sollte sicherstellen, dass es genau eine Übereinstimmung für den alten Text gibt oder entsprechende Fehlermeldungen bereitstellen.
```python
def safe_replace(file_path, old_text, new_text):
    """Replace text only if there's exactly one match."""
    with open(file_path, 'r') as f:
        content = f.read()
    
    count = content.count(old_text)
    if count == 0:
        return "Error: No match found"
    elif count > 1:
        return f"Error: Found {count} matches"
    else:
        new_content = content.replace(old_text, new_text)
        with open(file_path, 'w') as f:
            f.write(new_content)
        return "Successfully replaced text"
```

</section>

<section title="Überprüfen Sie Änderungen">

Überprüfen Sie nach Änderungen durch Claude die Änderungen, indem Sie Tests ausführen oder überprüfen, dass der Code weiterhin wie erwartet funktioniert.
```python
def verify_changes(file_path):
    """Run tests or checks after making changes."""
    try:
        # For Python files, check for syntax errors
        if file_path.endswith('.py'):
            import ast
            with open(file_path, 'r') as f:
                ast.parse(f.read())
            return "Syntax check passed"
    except Exception as e:
        return f"Verification failed: {str(e)}"
```

</section>

---

## Preisgestaltung und Token-Nutzung

The text editor tool uses the same pricing structure as other tools used with Claude. It follows the standard input and output token pricing based on the Claude model you're using.

In addition to the base tokens, the following additional input tokens are needed for the text editor tool:

| Tool | Additional input tokens |
| ----------------------------------------- | --------------------------------------- |
| `text_editor_20250429` (Claude 4.x) | 700 tokens |
| `text_editor_20250124` (Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations))) | 700 tokens |

Weitere detaillierte Informationen zur Tool-Preisgestaltung finden Sie unter [Tool-Nutzungspreisgestaltung](/docs/de/agents-and-tools/tool-use/overview#pricing).

## Integrieren Sie das Text-Editor-Tool mit anderen Tools

Das Text-Editor-Tool kann zusammen mit anderen Claude-Tools verwendet werden. Beim Kombinieren von Tools sollten Sie Folgendes sicherstellen:
- Stimmen Sie die Tool-Version mit dem Modell ab, das Sie verwenden
- Berücksichtigen Sie die zusätzliche Token-Nutzung für alle Tools, die in Ihrer Anfrage enthalten sind

## Änderungsprotokoll

| Datum | Version | Änderungen |
| ---- | ------- | ------- |
| 28. Juli 2025 | `text_editor_20250728` | Veröffentlichung eines aktualisierten Text-Editor-Tools, das einige Probleme behebt und einen optionalen `max_characters`-Parameter hinzufügt. Es ist ansonsten identisch mit `text_editor_20250429`. |
| 29. April 2025 | `text_editor_20250429` | Veröffentlichung des Text-Editor-Tools für Claude 4. Diese Version entfernt den `undo_edit`-Befehl, behält aber alle anderen Funktionen bei. Der Tool-Name wurde aktualisiert, um seine str_replace-basierte Architektur widerzuspiegeln. |
| 13. März 2025 | `text_editor_20250124` | Einführung der eigenständigen Text-Editor-Tool-Dokumentation. Diese Version ist für Claude Sonnet 3.7 optimiert, hat aber identische Funktionen wie die vorherige Version. |
| 22. Oktober 2024 | `text_editor_20241022` | Erste Veröffentlichung des Text-Editor-Tools mit Claude Sonnet 3.5 ([eingestellt](/docs/de/about-claude/model-deprecations)). Bietet Funktionen zum Anzeigen, Erstellen und Bearbeiten von Dateien über die Befehle `view`, `create`, `str_replace`, `insert` und `undo_edit`. |

## Nächste Schritte

Hier sind einige Ideen, wie Sie das Text-Editor-Tool auf bequemere und leistungsfähigere Weise nutzen können:

- **Integration in Ihren Entwicklungs-Workflow**: Integrieren Sie das Text-Editor-Tool in Ihre Entwicklungstools oder IDE
- **Erstellen Sie ein Code-Review-System**: Lassen Sie Claude Ihren Code überprüfen und verbessern
- **Erstellen Sie einen Debugging-Assistenten**: Erstellen Sie ein System, in dem Claude Ihnen bei der Diagnose und Behebung von Problemen in Ihrem Code helfen kann
- **Implementieren Sie Dateiformat-Konvertierung**: Lassen Sie Claude Ihnen bei der Konvertierung von Dateien von einem Format in ein anderes helfen
- **Automatisieren Sie die Dokumentation**: Richten Sie Workflows ein, damit Claude Ihren Code automatisch dokumentiert

Während Sie Anwendungen mit dem Text-Editor-Tool erstellen, freuen wir uns darauf zu sehen, wie Sie Claudes Funktionen nutzen, um Ihren Entwicklungs-Workflow und Ihre Produktivität zu verbessern.

<CardGroup cols={3}>
  <Card
    title="Tool-Nutzungsübersicht"
    icon="wrench"
    href="/docs/de/agents-and-tools/tool-use/overview"
  >
    Erfahren Sie, wie Sie Tool-Workflows zur Verwendung mit Claude implementieren.
  </Card>

  <Card
    title="Bash-Tool"
    icon="terminal"
    href="/docs/de/agents-and-tools/tool-use/bash-tool"
  >
    Führen Sie Shell-Befehle mit Claude aus.
  </Card>
</CardGroup>