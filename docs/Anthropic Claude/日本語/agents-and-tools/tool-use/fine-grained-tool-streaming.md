# きめ細かいツールストリーミング

ツール使用がパラメータ値のきめ細かい[ストリーミング](/docs/ja/build-with-claude/streaming)をサポートするようになりました。これにより、開発者はバッファリング/JSON検証なしでツール使用パラメータをストリーミングでき、大規模なパラメータの受信を開始するまでのレイテンシを削減できます。

---

ツール使用がパラメータ値のきめ細かい[ストリーミング](/docs/ja/build-with-claude/streaming)をサポートするようになりました。これにより、開発者はバッファリング/JSON検証なしでツール使用パラメータをストリーミングでき、大規模なパラメータの受信を開始するまでのレイテンシを削減できます。

きめ細かいツールストリーミングは、Claude API、AWS Bedrock、Google CloudのVertex AI、およびMicrosoft Foundryを通じて利用可能です。

<Note>
きめ細かいツールストリーミングはベータ機能です。本番環境で使用する前に、必ずレスポンスを評価してください。

[このフォーム](https://forms.gle/D4Fjr7GvQRzfTZT96)を使用して、モデルレスポンスの品質、API自体、またはドキュメントの品質に関するフィードバックを提供してください。皆様からのご意見をお待ちしています。
</Note>

<Warning>
きめ細かいツールストリーミングを使用する場合、無効または部分的なJSON入力を受け取る可能性があります。コード内でこれらのエッジケースに対応していることを確認してください。
</Warning>

## きめ細かいツールストリーミングの使用方法

このベータ機能を使用するには、ツール使用リクエストにベータヘッダー `fine-grained-tool-streaming-2025-05-14` を追加し、ストリーミングをオンにするだけです。

APIできめ細かいツールストリーミングを使用する方法の例を次に示します。

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

この例では、きめ細かいツールストリーミングにより、Claudeは長い詩の行を `make_file` ツール呼び出しにストリーミングでき、`lines_of_text` パラメータが有効なJSONであるかを検証するためにバッファリングする必要がありません。これは、パラメータ全体がバッファリングされて検証されるのを待つ必要なく、到着時にパラメータストリームを見ることができることを意味します。

<Note>
きめ細かいツールストリーミングでは、ツール使用チャンクはより速くストリーミングを開始し、多くの場合より長く、単語の区切りが少なくなります。これはチャンキング動作の違いによるものです。

例：

きめ細かいストリーミングなし（15秒の遅延）:
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

きめ細かいストリーミングあり（3秒の遅延）:
```
Chunk 1: '{"query": "TypeScript 5.0 5.1 5.2 5.3'
Chunk 2: ' new features comparison'
```
</Note>

<Warning>
きめ細かいストリーミングはバッファリングまたはJSON検証なしでパラメータを送信するため、結果のストリームが有効なJSON文字列で完了することは保証されません。特に、[停止理由](/docs/ja/build-with-claude/handling-stop-reasons) `max_tokens` に達した場合、ストリームはパラメータの途中で終了し、不完全な可能性があります。通常、`max_tokens` に達した場合を処理するための特定のサポートを記述する必要があります。
</Warning>

## ツールレスポンスの無効なJSONの処理

きめ細かいツールストリーミングを使用する場合、モデルから無効または不完全なJSONを受け取る可能性があります。この無効なJSONをエラーレスポンスブロック内でモデルに戻す必要がある場合、適切な処理を確保するためにJSONオブジェクトでラップできます（合理的なキーを使用）。例えば：

```json
{
  "INVALID_JSON": "<your invalid json string>"
}
```

このアプローチは、コンテンツが無効なJSONであることをモデルが理解するのに役立ちながら、デバッグ目的で元の形式が正しくないデータを保持します。

<Note>
無効なJSONをラップする場合、ラッパーオブジェクト内の有効なJSON構造を維持するために、無効なJSON文字列内のすべての引用符または特殊文字を適切にエスケープしてください。
</Note>