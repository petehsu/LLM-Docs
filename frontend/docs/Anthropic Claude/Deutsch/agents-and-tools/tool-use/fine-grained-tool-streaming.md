# Feingranulares Tool-Streaming

Tool-Streaming mit feingranularer Unterstützung für Parameterwerte, um große Parameter ohne Pufferung zu streamen und die Latenz zu reduzieren.

---

Tool-Nutzung unterstützt jetzt feingranulares [Streaming](/docs/de/build-with-claude/streaming) für Parameterwerte. Dies ermöglicht es Entwicklern, Tool-Nutzungsparameter ohne Pufferung / JSON-Validierung zu streamen, was die Latenz beim Empfang großer Parameter reduziert.

Feingranulares Tool-Streaming ist über die Claude API, AWS Bedrock, Google Cloud's Vertex AI und Microsoft Foundry verfügbar.

<Note>
Feingranulares Tool-Streaming ist eine Beta-Funktion. Bitte stellen Sie sicher, dass Sie Ihre Antworten evaluieren, bevor Sie sie in der Produktion verwenden.

Bitte verwenden Sie [dieses Formular](https://forms.gle/D4Fjr7GvQRzfTZT96), um Feedback zur Qualität der Modellantworten, der API selbst oder der Qualität der Dokumentation zu geben – wir freuen uns auf Ihr Feedback!
</Note>

<Warning>
Bei Verwendung von feingranularem Tool-Streaming können Sie möglicherweise ungültige oder unvollständige JSON-Eingaben erhalten. Bitte stellen Sie sicher, dass Sie diese Grenzfälle in Ihrem Code berücksichtigen.
</Warning>

## Verwendung von feingranularem Tool-Streaming

Um diese Beta-Funktion zu verwenden, fügen Sie einfach den Beta-Header `fine-grained-tool-streaming-2025-05-14` zu einer Tool-Nutzungsanfrage hinzu und aktivieren Sie Streaming.

Hier ist ein Beispiel für die Verwendung von feingranularem Tool-Streaming mit der API:

<CodeGroup>

  ```bash Shell
  curl https://api.anthropic.com/v1/messages \
    -H "content-type: application/json" \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "anthropic-beta: fine-grained-tool-streaming-2025-05-14" \
    -d '{
      "model": "claude-sonnet-4-5",
      "max_tokens": 65536,
      "tools": [
        {
          "name": "make_file",
          "description": "Write text to a file",
          "input_schema": {
            "type": "object",
            "properties": {
              "filename": {
                "type": "string",
                "description": "The filename to write text to"
              },
              "lines_of_text": {
                "type": "array",
                "description": "An array of lines of text to write to the file"
              }
            },
            "required": ["filename", "lines_of_text"]
          }
        }
      ],
      "messages": [
        {
          "role": "user",
          "content": "Can you write a long poem and make a file called poem.txt?"
        }
      ],
      "stream": true
    }' | jq '.usage'
  ```

  ```python Python
  import anthropic

  client = anthropic.Anthropic()

  response = client.beta.messages.stream(
      max_tokens=65536,
      model="claude-sonnet-4-5",
      tools=[{
        "name": "make_file",
        "description": "Write text to a file",
        "input_schema": {
          "type": "object",
          "properties": {
            "filename": {
              "type": "string",
              "description": "The filename to write text to"
            },
            "lines_of_text": {
              "type": "array",
              "description": "An array of lines of text to write to the file"
            }
          },
          "required": ["filename", "lines_of_text"]
        }
      }],
      messages=[{
        "role": "user",
        "content": "Can you write a long poem and make a file called poem.txt?"
      }],
      betas=["fine-grained-tool-streaming-2025-05-14"]
  )

  print(response.usage)
  ```

  ```typescript TypeScript
  import Anthropic from '@anthropic-ai/sdk';

  const anthropic = new Anthropic();

  const message = await anthropic.beta.messages.stream({
    model: "claude-sonnet-4-5",
    max_tokens: 65536,
    tools: [{
      "name": "make_file",
      "description": "Write text to a file",
      "input_schema": {
        "type": "object",
        "properties": {
          "filename": {
            "type": "string",
            "description": "The filename to write text to"
          },
          "lines_of_text": {
            "type": "array",
            "description": "An array of lines of text to write to the file"
          }
        },
        "required": ["filename", "lines_of_text"]
      }
    }],
    messages: [{ 
      role: "user", 
      content: "Can you write a long poem and make a file called poem.txt?" 
    }],
    betas: ["fine-grained-tool-streaming-2025-05-14"]
  });

  console.log(message.usage);
  ```
</CodeGroup>

In diesem Beispiel ermöglicht feingranulares Tool-Streaming Claude, die Zeilen eines langen Gedichts in den Tool-Aufruf `make_file` zu streamen, ohne zu puffern, um zu validieren, ob der Parameter `lines_of_text` gültiges JSON ist. Dies bedeutet, dass Sie den Parameter-Stream sehen können, wenn er ankommt, ohne auf die Pufferung und Validierung des gesamten Parameters warten zu müssen.

<Note>
Mit feingranularem Tool-Streaming beginnen Tool-Nutzungs-Chunks schneller zu streamen und sind oft länger und enthalten weniger Wortumbrüche. Dies ist auf Unterschiede im Chunking-Verhalten zurückzuführen.

Beispiel:

Ohne feingranulares Streaming (15s Verzögerung):
```
Chunk 1: '{"'
Chunk 2: 'query": "Ty'
Chunk 3: 'peScri'
Chunk 4: 'pt 5.0 5.1 '
Chunk 5: '5.2 5'
Chunk 6: '.3'
Chunk 8: ' new f'
Chunk 9: 'eatur'
...
```

Mit feingranularem Streaming (3s Verzögerung):
```
Chunk 1: '{"query": "TypeScript 5.0 5.1 5.2 5.3'
Chunk 2: ' new features comparison'
```
</Note>

<Warning>
Da feingranulares Streaming Parameter ohne Pufferung oder JSON-Validierung sendet, gibt es keine Garantie, dass der resultierende Stream in einem gültigen JSON-String endet.
Besonders wenn der [Stop-Grund](/docs/de/build-with-claude/handling-stop-reasons) `max_tokens` erreicht wird, kann der Stream mitten in einem Parameter enden und unvollständig sein. Sie müssen in der Regel spezifische Unterstützung schreiben, um zu handhaben, wenn `max_tokens` erreicht wird.
</Warning>

## Umgang mit ungültigem JSON in Tool-Antworten

Bei Verwendung von feingranularem Tool-Streaming können Sie ungültiges oder unvollständiges JSON vom Modell erhalten. Wenn Sie dieses ungültige JSON in einem Fehlerantwort-Block an das Modell zurückgeben müssen, können Sie es in einem JSON-Objekt einwickeln, um eine ordnungsgemäße Verarbeitung sicherzustellen (mit einem angemessenen Schlüssel). Zum Beispiel:

```json
{
  "INVALID_JSON": "<your invalid json string>"
}
```

Dieser Ansatz hilft dem Modell zu verstehen, dass der Inhalt ungültiges JSON ist, während die ursprünglichen fehlerhaften Daten zu Debugging-Zwecken erhalten bleiben.

<Note>
Wenn Sie ungültiges JSON einwickeln, stellen Sie sicher, dass Sie alle Anführungszeichen oder Sonderzeichen in der ungültigen JSON-Zeichenkette ordnungsgemäß escapen, um eine gültige JSON-Struktur im Wrapper-Objekt zu erhalten.
</Note>