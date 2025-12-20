# 細粒度工具串流

工具使用現在支援參數值的細粒度串流，允許開發者在不進行緩衝或 JSON 驗證的情況下串流工具使用參數，減少開始接收大型參數的延遲。

---

工具使用現在支援參數值的細粒度[串流](/docs/zh-TW/build-with-claude/streaming)。這允許開發者在不進行緩衝或 JSON 驗證的情況下串流工具使用參數，減少開始接收大型參數的延遲。

細粒度工具串流可透過 Claude API、AWS Bedrock、Google Cloud 的 Vertex AI 和 Microsoft Foundry 使用。

<Note>
細粒度工具串流是測試版功能。請確保在生產環境中使用前評估您的回應。

請使用[此表單](https://forms.gle/D4Fjr7GvQRzfTZT96)提供有關模型回應品質、API 本身或文件品質的反饋——我們迫不及待想聽到您的意見！
</Note>

<Warning>
使用細粒度工具串流時，您可能會收到無效或不完整的 JSON 輸入。請確保在您的程式碼中考慮這些邊界情況。
</Warning>

## 如何使用細粒度工具串流

要使用此測試版功能，只需將測試版標頭 `fine-grained-tool-streaming-2025-05-14` 新增至工具使用請求並開啟串流。

以下是如何使用 API 的細粒度工具串流的範例：

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

在此範例中，細粒度工具串流使 Claude 能夠將長詩的行串流到工具呼叫 `make_file` 中，而無需緩衝以驗證 `lines_of_text` 參數是否為有效的 JSON。這意味著您可以看到參數在到達時的串流，而無需等待整個參數進行緩衝和驗證。

<Note>
使用細粒度工具串流時，工具使用區塊開始串流的速度更快，通常更長且包含較少的換行符。這是由於分塊行為的差異。

範例：

沒有細粒度串流（15 秒延遲）：
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

使用細粒度串流（3 秒延遲）：
```
Chunk 1: '{"query": "TypeScript 5.0 5.1 5.2 5.3'
Chunk 2: ' new features comparison'
```
</Note>

<Warning>
因為細粒度串流在不進行緩衝或 JSON 驗證的情況下發送參數，所以無法保證產生的串流將以有效的 JSON 字串完成。特別是，如果達到[停止原因](/docs/zh-TW/build-with-claude/handling-stop-reasons) `max_tokens`，串流可能會在參數中途結束且可能不完整。您通常必須編寫特定的支援來處理何時達到 `max_tokens` 的情況。
</Warning>

## 處理工具回應中的無效 JSON

使用細粒度工具串流時，您可能會從模型收到無效或不完整的 JSON。如果您需要在錯誤回應區塊中將此無效 JSON 傳回給模型，您可以將其包裝在 JSON 物件中以確保正確處理（使用合理的鍵）。例如：

```json
{
  "INVALID_JSON": "<your invalid json string>"
}
```

此方法幫助模型理解內容是無效的 JSON，同時保留原始格式錯誤的資料以供除錯之用。

<Note>
包裝無效 JSON 時，請確保正確逸出無效 JSON 字串中的任何引號或特殊字元，以在包裝物件中維持有效的 JSON 結構。
</Note>