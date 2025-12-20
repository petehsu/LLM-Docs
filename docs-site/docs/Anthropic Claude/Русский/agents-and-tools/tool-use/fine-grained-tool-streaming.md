# Потоковая передача инструментов с детальной детализацией

Использование инструментов теперь поддерживает потоковую передачу параметров с детальной детализацией, что позволяет разработчикам передавать параметры инструментов без буферизации и валидации JSON, снижая задержку при получении больших параметров.

---

Использование инструментов теперь поддерживает потоковую передачу параметров с детальной детализацией [streaming](/docs/ru/build-with-claude/streaming). Это позволяет разработчикам передавать параметры инструментов без буферизации / валидации JSON, снижая задержку при получении больших параметров.

Потоковая передача инструментов с детальной детализацией доступна через Claude API, AWS Bedrock, Google Cloud's Vertex AI и Microsoft Foundry.

<Note>
Потоковая передача инструментов с детальной детализацией — это бета-функция. Пожалуйста, убедитесь, что вы оценили ваши ответы перед использованием в производстве.

Пожалуйста, используйте [эту форму](https://forms.gle/D4Fjr7GvQRzfTZT96) для предоставления отзывов о качестве ответов модели, самом API или качестве документации — мы с нетерпением ждем ваших отзывов!
</Note>

<Warning>
При использовании потоковой передачи инструментов с детальной детализацией вы можете потенциально получить недействительные или неполные входные данные JSON. Пожалуйста, убедитесь, что вы учитываете эти граничные случаи в вашем коде.
</Warning>

## Как использовать потоковую передачу инструментов с детальной детализацией

Чтобы использовать эту бета-функцию, просто добавьте бета-заголовок `fine-grained-tool-streaming-2025-05-14` к запросу использования инструмента и включите потоковую передачу.

Вот пример использования потоковой передачи инструментов с детальной детализацией с помощью API:

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

В этом примере потоковая передача инструментов с детальной детализацией позволяет Claude передавать строки длинного стихотворения в вызов инструмента `make_file` без буферизации для проверки того, является ли параметр `lines_of_text` действительным JSON. Это означает, что вы можете видеть поток параметров по мере его поступления, без необходимости ждать буферизации и валидации всего параметра.

<Note>
При потоковой передаче инструментов с детальной детализацией фрагменты использования инструментов начинают передаваться быстрее и часто бывают длиннее и содержат меньше разрывов слов. Это связано с различиями в поведении разбиения на фрагменты.

Пример:

Без потоковой передачи с детальной детализацией (задержка 15 сек):
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

С потоковой передачей с детальной детализацией (задержка 3 сек):
```
Chunk 1: '{"query": "TypeScript 5.0 5.1 5.2 5.3'
Chunk 2: ' new features comparison'
```
</Note>

<Warning>
Поскольку потоковая передача с детальной детализацией отправляет параметры без буферизации или валидации JSON, нет гарантии, что результирующий поток завершится действительной строкой JSON.
В частности, если достигнута [причина остановки](/docs/ru/build-with-claude/handling-stop-reasons) `max_tokens`, поток может завершиться в середине параметра и может быть неполным. Обычно вам придется написать специальную поддержку для обработки случаев, когда достигнут `max_tokens`.
</Warning>

## Обработка недействительного JSON в ответах инструментов

При использовании потоковой передачи инструментов с детальной детализацией вы можете получить недействительный или неполный JSON от модели. Если вам нужно передать этот недействительный JSON обратно модели в блоке ответа об ошибке, вы можете обернуть его в объект JSON, чтобы обеспечить правильную обработку (с разумным ключом). Например:

```json
{
  "INVALID_JSON": "<your invalid json string>"
}
```

Этот подход помогает модели понять, что содержимое является недействительным JSON, при этом сохраняя исходные неправильно сформированные данные для целей отладки.

<Note>
При обертывании недействительного JSON убедитесь, что вы правильно экранировали все кавычки или специальные символы в строке недействительного JSON, чтобы сохранить действительную структуру JSON в объекте-оболочке.
</Note>