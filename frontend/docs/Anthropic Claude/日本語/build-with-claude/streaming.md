# ストリーミングメッセージ

サーバー送信イベント（SSE）を使用してメッセージレスポンスを段階的にストリーミングする方法について説明します。

---

メッセージを作成する際、`"stream": true`を設定することで、[サーバー送信イベント](https://developer.mozilla.org/en-US/Web/API/Server-sent%5Fevents/Using%5Fserver-sent%5Fevents)（SSE）を使用してレスポンスを段階的にストリーミングできます。

## SDKでのストリーミング

私たちの[Python](https://github.com/anthropics/anthropic-sdk-python)および[TypeScript](https://github.com/anthropics/anthropic-sdk-typescript) SDKは、複数のストリーミング方法を提供しています。Python SDKは同期と非同期の両方のストリームを許可します。詳細については、各SDKのドキュメントを参照してください。

<CodeGroup>
    ```python Python
    import anthropic

    client = anthropic.Anthropic()

    with client.messages.stream(
        max_tokens=1024,
        messages=[{"role": "user", "content": "Hello"}],
        model="claude-sonnet-4-5",
    ) as stream:
      for text in stream.text_stream:
          print(text, end="", flush=True)
    ```

    ```typescript TypeScript
    import Anthropic from '@anthropic-ai/sdk';

    const client = new Anthropic();

    await client.messages.stream({
        messages: [{role: 'user', content: "Hello"}],
        model: 'claude-sonnet-4-5',
        max_tokens: 1024,
    }).on('text', (text) => {
        console.log(text);
    });
    ```
</CodeGroup>

## イベントタイプ

各サーバー送信イベントには、名前付きイベントタイプと関連するJSONデータが含まれます。各イベントはSSEイベント名（例：`event: message_stop`）を使用し、そのデータに一致するイベント`type`を含みます。

各ストリームは以下のイベントフローを使用します：

1. `message_start`：空の`content`を持つ`Message`オブジェクトを含みます。
2. 一連のコンテンツブロック。それぞれに`content_block_start`、1つ以上の`content_block_delta`イベント、および`content_block_stop`イベントがあります。各コンテンツブロックには、最終的なMessage `content`配列内のインデックスに対応する`index`があります。
3. 1つ以上の`message_delta`イベント。最終的な`Message`オブジェクトへのトップレベルの変更を示します。
4. 最終的な`message_stop`イベント。

  <Warning>
  `message_delta`イベントの`usage`フィールドに表示されるトークン数は*累積*です。
  </Warning>

### Pingイベント

イベントストリームには、任意の数の`ping`イベントも含まれる場合があります。

### エラーイベント

イベントストリームで[エラー](/docs/ja/api/errors)を送信することがあります。例えば、使用量が多い期間中に、非ストリーミングコンテキストでは通常HTTP 529に対応する`overloaded_error`を受信する場合があります：

```json Example error
event: error
data: {"type": "error", "error": {"type": "overloaded_error", "message": "Overloaded"}}
```

### その他のイベント

私たちの[バージョニングポリシー](/docs/ja/api/versioning)に従って、新しいイベントタイプを追加する場合があり、あなたのコードは未知のイベントタイプを適切に処理する必要があります。

## コンテンツブロックデルタタイプ

各`content_block_delta`イベントには、指定された`index`でコンテンツブロックを更新するタイプの`delta`が含まれます。

### テキストデルタ

`text`コンテンツブロックデルタは次のようになります：
```json Text delta
event: content_block_delta
data: {"type": "content_block_delta","index": 0,"delta": {"type": "text_delta", "text": "ello frien"}}
```

### 入力JSONデルタ

`tool_use`コンテンツブロックのデルタは、ブロックの`input`フィールドの更新に対応します。最大の粒度をサポートするために、デルタは_部分JSON文字列_であり、最終的な`tool_use.input`は常に_オブジェクト_です。

文字列デルタを蓄積し、`content_block_stop`イベントを受信したらJSONを解析できます。[Pydantic](https://docs.pydantic.dev/latest/concepts/json/#partial-json-parsing)のようなライブラリを使用して部分JSON解析を行うか、解析された増分値にアクセスするヘルパーを提供する私たちの[SDK](/docs/ja/api/client-sdks)を使用してください。

`tool_use`コンテンツブロックデルタは次のようになります：
```json Input JSON delta
event: content_block_delta
data: {"type": "content_block_delta","index": 1,"delta": {"type": "input_json_delta","partial_json": "{\"location\": \"San Fra"}}}
```
注意：現在のモデルは、一度に`input`から1つの完全なキーと値のプロパティのみを出力することをサポートしています。そのため、ツールを使用する際、モデルが作業している間にストリーミングイベント間で遅延が発生する場合があります。`input`キーと値が蓄積されると、将来のモデルでより細かい粒度を自動的にサポートできるように、チャンク化された部分jsonを持つ複数の`content_block_delta`イベントとして出力されます。

### 思考デルタ

ストリーミングが有効な[拡張思考](/docs/ja/build-with-claude/extended-thinking#streaming-thinking)を使用する場合、`thinking_delta`イベントを通じて思考コンテンツを受信します。これらのデルタは、`thinking`コンテンツブロックの`thinking`フィールドに対応します。

思考コンテンツの場合、特別な`signature_delta`イベントが`content_block_stop`イベントの直前に送信されます。この署名は、思考ブロックの整合性を検証するために使用されます。

典型的な思考デルタは次のようになります：
```json Thinking delta
event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "Let me solve this step by step:\n\n1. First break down 27 * 453"}}
```

署名デルタは次のようになります：
```json Signature delta
event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "signature_delta", "signature": "EqQBCgIYAhIM1gbcDa9GJwZA2b3hGgxBdjrkzLoky3dl1pkiMOYds..."}}
```

## 完全なHTTPストリームレスポンス

ストリーミングモードを使用する際は、私たちの[クライアントSDK](/docs/ja/api/client-sdks)を使用することを強く推奨します。ただし、直接API統合を構築している場合は、これらのイベントを自分で処理する必要があります。

ストリームレスポンスは以下で構成されます：
1. `message_start`イベント
2. 潜在的に複数のコンテンツブロック。それぞれに以下が含まれます：
    - `content_block_start`イベント
    - 潜在的に複数の`content_block_delta`イベント
    - `content_block_stop`イベント
3. `message_delta`イベント
4. `message_stop`イベント

レスポンス全体に`ping`イベントが散在する場合もあります。フォーマットの詳細については、[イベントタイプ](#event-types)を参照してください。

### 基本的なストリーミングリクエスト

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --data \
'{
  "model": "claude-sonnet-4-5",
  "messages": [{"role": "user", "content": "Hello"}],
  "max_tokens": 256,
  "stream": true
}'
```

```python Python
import anthropic

client = anthropic.Anthropic()

with client.messages.stream(
    model="claude-sonnet-4-5",
    messages=[{"role": "user", "content": "Hello"}],
    max_tokens=256,
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```
</CodeGroup>

```json Response
event: message_start
data: {"type": "message_start", "message": {"id": "msg_1nZdL29xx5MUA1yADyHTEsnR8uuvGzszyY", "type": "message", "role": "assistant", "content": [], "model": "claude-sonnet-4-5-20250929", "stop_reason": null, "stop_sequence": null, "usage": {"input_tokens": 25, "output_tokens": 1}}}

event: content_block_start
data: {"type": "content_block_start", "index": 0, "content_block": {"type": "text", "text": ""}}

event: ping
data: {"type": "ping"}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "text_delta", "text": "Hello"}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "text_delta", "text": "!"}}

event: content_block_stop
data: {"type": "content_block_stop", "index": 0}

event: message_delta
data: {"type": "message_delta", "delta": {"stop_reason": "end_turn", "stop_sequence":null}, "usage": {"output_tokens": 15}}

event: message_stop
data: {"type": "message_stop"}

```

### ツール使用でのストリーミングリクエスト

<Tip>
ツール使用は現在、パラメータ値の細かいストリーミングをベータ機能としてサポートしています。詳細については、[細かいツールストリーミング](/docs/ja/agents-and-tools/tool-use/fine-grained-tool-streaming)を参照してください。
</Tip>

このリクエストでは、Claudeにツールを使用して天気を教えてもらいます。

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
          "name": "get_weather",
          "description": "Get the current weather in a given location",
          "input_schema": {
            "type": "object",
            "properties": {
              "location": {
                "type": "string",
                "description": "The city and state, e.g. San Francisco, CA"
              }
            },
            "required": ["location"]
          }
        }
      ],
      "tool_choice": {"type": "any"},
      "messages": [
        {
          "role": "user",
          "content": "What is the weather like in San Francisco?"
        }
      ],
      "stream": true
    }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

tools = [
    {
        "name": "get_weather",
        "description": "Get the current weather in a given location",
        "input_schema": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "The city and state, e.g. San Francisco, CA"
                }
            },
            "required": ["location"]
        }
    }
]

with client.messages.stream(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=tools,
    tool_choice={"type": "any"},
    messages=[
        {
            "role": "user",
            "content": "What is the weather like in San Francisco?"
        }
    ],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```
</CodeGroup>

```json Response
event: message_start
data: {"type":"message_start","message":{"id":"msg_014p7gG3wDgGV9EUtLvnow3U","type":"message","role":"assistant","model":"claude-sonnet-4-5-20250929","stop_sequence":null,"usage":{"input_tokens":472,"output_tokens":2},"content":[],"stop_reason":null}}

event: content_block_start
data: {"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}

event: ping
data: {"type": "ping"}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"Okay"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":","}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" let"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"'s"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" check"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" the"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" weather"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" for"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" San"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" Francisco"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":","}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" CA"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":":"}}

event: content_block_stop
data: {"type":"content_block_stop","index":0}

event: content_block_start
data: {"type":"content_block_start","index":1,"content_block":{"type":"tool_use","id":"toolu_01T1x1fJ34qAmk2tNTrN7Up6","name":"get_weather","input":{}}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":""}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"{\"location\":"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":" \"San"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":" Francisc"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"o,"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":" CA\""}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":", "}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"\"unit\": \"fah"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"renheit\"}"}}

event: content_block_stop
data: {"type":"content_block_stop","index":1}

event: message_delta
data: {"type":"message_delta","delta":{"stop_reason":"tool_use","stop_sequence":null},"usage":{"output_tokens":89}}

event: message_stop
data: {"type":"message_stop"}
```

### 拡張思考でのストリーミングリクエスト

このリクエストでは、ストリーミングで拡張思考を有効にして、Claudeの段階的な推論を見ることができます。

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 20000,
    "stream": true,
    "thinking": {
        "type": "enabled",
        "budget_tokens": 16000
    },
    "messages": [
        {
            "role": "user",
            "content": "What is 27 * 453?"
        }
    ]
}'
```

```python Python
import anthropic

client = anthropic.Anthropic()

with client.messages.stream(
    model="claude-sonnet-4-5",
    max_tokens=20000,
    thinking={
        "type": "enabled",
        "budget_tokens": 16000
    },
    messages=[
        {
            "role": "user",
            "content": "What is 27 * 453?"
        }
    ],
) as stream:
    for event in stream:
        if event.type == "content_block_delta":
            if event.delta.type == "thinking_delta":
                print(event.delta.thinking, end="", flush=True)
            elif event.delta.type == "text_delta":
                print(event.delta.text, end="", flush=True)
```
</CodeGroup>

```json Response
event: message_start
data: {"type": "message_start", "message": {"id": "msg_01...", "type": "message", "role": "assistant", "content": [], "model": "claude-sonnet-4-5-20250929", "stop_reason": null, "stop_sequence": null}}

event: content_block_start
data: {"type": "content_block_start", "index": 0, "content_block": {"type": "thinking", "thinking": ""}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "Let me solve this step by step:\n\n1. First break down 27 * 453"}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "\n2. 453 = 400 + 50 + 3"}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "\n3. 27 * 400 = 10,800"}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "\n4. 27 * 50 = 1,350"}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "\n5. 27 * 3 = 81"}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "\n6. 10,800 + 1,350 + 81 = 12,231"}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "signature_delta", "signature": "EqQBCgIYAhIM1gbcDa9GJwZA2b3hGgxBdjrkzLoky3dl1pkiMOYds..."}}

event: content_block_stop
data: {"type": "content_block_stop", "index": 0}

event: content_block_start
data: {"type": "content_block_start", "index": 1, "content_block": {"type": "text", "text": ""}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 1, "delta": {"type": "text_delta", "text": "27 * 453 = 12,231"}}

event: content_block_stop
data: {"type": "content_block_stop", "index": 1}

event: message_delta
data: {"type": "message_delta", "delta": {"stop_reason": "end_turn", "stop_sequence": null}}

event: message_stop
data: {"type": "message_stop"}
```

### ウェブ検索ツール使用でのストリーミングリクエスト

このリクエストでは、Claudeに現在の天気情報をウェブで検索してもらいます。

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "stream": true,
    "tools": [
        {
            "type": "web_search_20250305",
            "name": "web_search",
            "max_uses": 5
        }
    ],
    "messages": [
        {
            "role": "user",
            "content": "What is the weather like in New York City today?"
        }
    ]
}'
```

```python Python
import anthropic

client = anthropic.Anthropic()

with client.messages.stream(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[
        {
            "type": "web_search_20250305",
            "name": "web_search",
            "max_uses": 5
        }
    ],
    messages=[
        {
            "role": "user",
            "content": "What is the weather like in New York City today?"
        }
    ],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```
</CodeGroup>

```json Response
event: message_start
data: {"type":"message_start","message":{"id":"msg_01G...","type":"message","role":"assistant","model":"claude-sonnet-4-5-20250929","content":[],"stop_reason":null,"stop_sequence":null,"usage":{"input_tokens":2679,"cache_creation_input_tokens":0,"cache_read_input_tokens":0,"output_tokens":3}}}

event: content_block_start
data: {"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"I'll check"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" the current weather in New York City for you"}}

event: ping
data: {"type": "ping"}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"."}}

event: content_block_stop
data: {"type":"content_block_stop","index":0}

event: content_block_start
data: {"type":"content_block_start","index":1,"content_block":{"type":"server_tool_use","id":"srvtoolu_014hJH82Qum7Td6UV8gDXThB","name":"web_search","input":{}}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":""}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"{\"query"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"\":"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":" \"weather"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":" NY"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"C to"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"day\"}"}}

event: content_block_stop
data: {"type":"content_block_stop","index":1 }

event: content_block_start
data: {"type":"content_block_start","index":2,"content_block":{"type":"web_search_tool_result","tool_use_id":"srvtoolu_014hJH82Qum7Td6UV8gDXThB","content":[{"type":"web_search_result","title":"Weather in New York City in May 2025 (New York) - detailed Weather Forecast for a month","url":"https://world-weather.info/forecast/usa/new_york/may-2025/","encrypted_content":"Ev0DCioIAxgCIiQ3NmU4ZmI4OC1k...","page_age":null},...]}}

event: content_block_stop
data: {"type":"content_block_stop","index":2}

event: content_block_start
data: {"type":"content_block_start","index":3,"content_block":{"type":"text","text":""}}

event: content_block_delta
data: {"type":"content_block_delta","index":3,"delta":{"type":"text_delta","text":"Here's the current weather information for New York"}}

event: content_block_delta
data: {"type":"content_block_delta","index":3,"delta":{"type":"text_delta","text":" City:\n\n# Weather"}}

event: content_block_delta
data: {"type":"content_block_delta","index":3,"delta":{"type":"text_delta","text":" in New York City"}}

event: content_block_delta
data: {"type":"content_block_delta","index":3,"delta":{"type":"text_delta","text":"\n\n"}}

...

event: content_block_stop
data: {"type":"content_block_stop","index":17}

event: message_delta
data: {"type":"message_delta","delta":{"stop_reason":"end_turn","stop_sequence":null},"usage":{"input_tokens":10682,"cache_creation_input_tokens":0,"cache_read_input_tokens":0,"output_tokens":510,"server_tool_use":{"web_search_requests":1}}}

event: message_stop
data: {"type":"message_stop"}
```

## エラー回復

ネットワークの問題、タイムアウト、またはその他のエラーによりストリーミングリクエストが中断された場合、ストリームが中断された場所から再開することで回復できます。このアプローチにより、レスポンス全体を再処理する必要がなくなります。

基本的な回復戦略には以下が含まれます：

1. **部分レスポンスをキャプチャ**：エラーが発生する前に正常に受信されたすべてのコンテンツを保存します
2. **継続リクエストを構築**：新しいアシスタントメッセージの開始として部分アシスタントレスポンスを含む新しいAPIリクエストを作成します
3. **ストリーミングを再開**：中断された場所からレスポンスの残りを受信し続けます

### エラー回復のベストプラクティス

1. **SDK機能を使用**：SDKの組み込みメッセージ蓄積およびエラー処理機能を活用します
2. **コンテンツタイプを処理**：メッセージには複数のコンテンツブロック（`text`、`tool_use`、`thinking`）が含まれる可能性があることに注意してください。ツール使用と拡張思考ブロックは部分的に回復できません。最新のテキストブロックからストリーミングを再開できます。