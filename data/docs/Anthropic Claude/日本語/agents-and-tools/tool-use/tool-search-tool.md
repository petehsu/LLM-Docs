# ツール検索ツール

Claudeが数百または数千のツールを動的に検出し、オンデマンドで読み込むことを可能にするツール検索ツール

---

ツール検索ツールにより、Claudeは数百または数千のツールを動的に検出し、オンデマンドで読み込むことで、これらのツールを操作できます。すべてのツール定義をコンテキストウィンドウに事前に読み込む代わりに、Claudeはツールカタログ（ツール名、説明、引数名、引数説明を含む）を検索し、必要なツールのみを読み込みます。

このアプローチは、ツールライブラリがスケールするにつれて、2つの重大な課題を解決します：

- **コンテキスト効率**: ツール定義はコンテキストウィンドウの大部分を消費する可能性があります（50個のツール ≈ 10-20Kトークン）。実際の作業のためのスペースが減少します
- **ツール選択精度**: Claudeのツール選択能力は、従来利用可能な30～50個を超えるツールでは大幅に低下します

これはサーバー側のツールとして提供されていますが、独自のクライアント側ツール検索機能を実装することもできます。詳細については、[カスタムツール検索実装](#custom-tool-search-implementation)を参照してください。

<Note>
ツール検索ツールは現在パブリックベータ版です。プロバイダーに適切な[ベータヘッダー](/docs/ja/api/beta-headers)を含めてください：

| プロバイダー                 | ベータヘッダー                    | サポートされているモデル                       |
| ------------------------ | ------------------------------ | -------------------------------------- |
| Claude API<br/>Microsoft Foundry  | `advanced-tool-use-2025-11-20` | Claude Opus 4.5<br />Claude Sonnet 4.5 |
| Google Cloud's Vertex AI | `tool-search-tool-2025-10-19`  | Claude Opus 4.5<br />Claude Sonnet 4.5 |
| Amazon Bedrock           | `tool-search-tool-2025-10-19`  | Claude Opus 4.5                        |
</Note>

<Warning>
  Amazon Bedrockでは、サーバー側のツール検索は[invoke API](https://docs.aws.amazon.com/bedrock/latest/userguide/bedrock-runtime_example_bedrock-runtime_InvokeModel_AnthropicClaude_section.html)経由でのみ利用可能で、converse APIではありません。
</Warning>

独自の検索実装から`tool_reference`ブロックを返すことで、[クライアント側ツール検索](#custom-tool-search-implementation)を実装することもできます。

## ツール検索の仕組み

ツール検索には2つのバリアントがあります：

- **Regex** (`tool_search_tool_regex_20251119`): Claudeはツールを検索するための正規表現パターンを構築します
- **BM25** (`tool_search_tool_bm25_20251119`): Claudeは自然言語クエリを使用してツールを検索します

ツール検索ツールを有効にすると：

1. ツール検索ツール（例：`tool_search_tool_regex_20251119`または`tool_search_tool_bm25_20251119`）をツールリストに含めます
2. すぐに読み込まれるべきではないツールに対して、`defer_loading: true`を使用してすべてのツール定義を提供します
3. Claudeは最初、ツール検索ツールと非遅延ツールのみを見ます
4. Claudeが追加のツールが必要な場合、ツール検索ツールを使用して検索します
5. APIは3～5個の最も関連性の高い`tool_reference`ブロックを返します
6. これらの参照は自動的に完全なツール定義に展開されます
7. Claudeは発見されたツールから選択して、それらを呼び出します

これにより、コンテキストウィンドウを効率的に保ちながら、高いツール選択精度を維持します。

## クイックスタート

遅延ツールを使用した簡単な例を次に示します：

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: advanced-tool-use-2025-11-20" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5-20250929",
        "max_tokens": 2048,
        "messages": [
            {
                "role": "user",
                "content": "What is the weather in San Francisco?"
            }
        ],
        "tools": [
            {
                "type": "tool_search_tool_regex_20251119",
                "name": "tool_search_tool_regex"
            },
            {
                "name": "get_weather",
                "description": "Get the weather at a specific location",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "location": {"type": "string"},
                        "unit": {
                            "type": "string",
                            "enum": ["celsius", "fahrenheit"]
                        }
                    },
                    "required": ["location"]
                },
                "defer_loading": true
            },
            {
                "name": "search_files",
                "description": "Search through files in the workspace",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "query": {"type": "string"},
                        "file_types": {
                            "type": "array",
                            "items": {"type": "string"}
                        }
                    },
                    "required": ["query"]
                },
                "defer_loading": true
            }
        ]
    }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=2048,
    messages=[
        {
            "role": "user",
            "content": "What is the weather in San Francisco?"
        }
    ],
    tools=[
        {
            "type": "tool_search_tool_regex_20251119",
            "name": "tool_search_tool_regex"
        },
        {
            "name": "get_weather",
            "description": "Get the weather at a specific location",
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {"type": "string"},
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"]
                    }
                },
                "required": ["location"]
            },
            "defer_loading": True
        },
        {
            "name": "search_files",
            "description": "Search through files in the workspace",
            "input_schema": {
                "type": "object",
                "properties": {
                    "query": {"type": "string"},
                    "file_types": {
                        "type": "array",
                        "items": {"type": "string"}
                    }
                },
                "required": ["query"]
            },
            "defer_loading": True
        }
    ]
)

print(response)
```

```typescript TypeScript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

async function main() {
  const response = await client.beta.messages.create({
    model: "claude-sonnet-4-5-20250929",
    betas: ["advanced-tool-use-2025-11-20"],
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: "What is the weather in San Francisco?",
      },
    ],
    tools: [
      {
        type: "tool_search_tool_regex_20251119",
        name: "tool_search_tool_regex",
      },
      {
        name: "get_weather",
        description: "Get the weather at a specific location",
        input_schema: {
          type: "object",
          properties: {
            location: { type: "string" },
            unit: {
              type: "string",
              enum: ["celsius", "fahrenheit"],
            },
          },
          required: ["location"],
        },
        defer_loading: true,
      },
      {
        name: "search_files",
        description: "Search through files in the workspace",
        input_schema: {
          type: "object",
          properties: {
            query: { type: "string" },
            file_types: {
              type: "array",
              items: { type: "string" },
            },
          },
          required: ["query"],
        },
        defer_loading: true,
      },
    ],
  });

  console.log(JSON.stringify(response, null, 2));
}

main();
```

</CodeGroup>

## ツール定義

ツール検索ツールには2つのバリアントがあります：

```json JSON
{
  "type": "tool_search_tool_regex_20251119",
  "name": "tool_search_tool_regex"
}
```

```json JSON
{
  "type": "tool_search_tool_bm25_20251119",
  "name": "tool_search_tool_bm25"
}
```

<Warning>
**正規表現バリアントクエリ形式：自然言語ではなくPython正規表現**

`tool_search_tool_regex_20251119`を使用する場合、Claudeは自然言語クエリではなく、Pythonの`re.search()`構文を使用して正規表現パターンを構築します。一般的なパターン：

- `"weather"` - 「weather」を含むツール名/説明にマッチします
- `"get_.*_data"` - `get_user_data`、`get_weather_data`などのツールにマッチします
- `"database.*query|query.*database"` - 柔軟性のためのORパターン
- `"(?i)slack"` - 大文字小文字を区別しない検索

最大クエリ長：200文字

</Warning>

<Note>
**BM25バリアントクエリ形式：自然言語**

`tool_search_tool_bm25_20251119`を使用する場合、Claudeは自然言語クエリを使用してツールを検索します。

</Note>

### 遅延ツール読み込み

`defer_loading: true`を追加することで、オンデマンド読み込み用にツールをマークします：

```json JSON
{
  "name": "get_weather",
  "description": "Get current weather for a location",
  "input_schema": {
    "type": "object",
    "properties": {
      "location": { "type": "string" },
      "unit": { "type": "string", "enum": ["celsius", "fahrenheit"] }
    },
    "required": ["location"]
  },
  "defer_loading": true
}
```

**重要なポイント：**

- `defer_loading`がないツールはすぐにコンテキストに読み込まれます
- `defer_loading: true`のツールは、Claudeが検索経由で発見した場合にのみ読み込まれます
- ツール検索ツール自体は**決して**`defer_loading: true`を持つべきではありません
- 最適なパフォーマンスのために、最も頻繁に使用される3～5個のツールを非遅延として保ちます

両方のツール検索バリアント（`regex`と`bm25`）は、ツール名、説明、引数名、および引数説明を検索します。

## レスポンス形式

Claudeがツール検索ツールを使用する場合、レスポンスには新しいブロックタイプが含まれます：

```json JSON
{
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "I'll search for tools to help with the weather information."
    },
    {
      "type": "server_tool_use",
      "id": "srvtoolu_01ABC123",
      "name": "tool_search_tool_regex",
      "input": {
        "query": "weather"
      }
    },
    {
      "type": "tool_search_tool_result",
      "tool_use_id": "srvtoolu_01ABC123",
      "content": {
        "type": "tool_search_tool_search_result",
        "tool_references": [{ "type": "tool_reference", "tool_name": "get_weather" }]
      }
    },
    {
      "type": "text",
      "text": "I found a weather tool. Let me get the weather for San Francisco."
    },
    {
      "type": "tool_use",
      "id": "toolu_01XYZ789",
      "name": "get_weather",
      "input": { "location": "San Francisco", "unit": "fahrenheit" }
    }
  ],
  "stop_reason": "tool_use"
}
```

### レスポンスの理解

- **`server_tool_use`**: Claudeがツール検索ツールを呼び出していることを示します
- **`tool_search_tool_result`**: ネストされた`tool_search_tool_search_result`オブジェクトを含む検索結果を含みます
- **`tool_references`**: 発見されたツールを指す`tool_reference`オブジェクトの配列
- **`tool_use`**: Claudeが発見されたツールを呼び出しています

`tool_reference`ブロックは、Claudeに表示される前に自動的に完全なツール定義に展開されます。この展開を自分で処理する必要はありません。`tools`パラメータにすべての一致するツール定義を提供する限り、APIで自動的に発生します。

## MCP統合

ツール検索ツールは[MCPサーバー](/docs/ja/agents-and-tools/mcp-connector)と連携します。APIリクエストに`"mcp-client-2025-11-20"`[ベータヘッダー](/docs/ja/api/beta-headers)を追加してから、`default_config`で`mcp_toolset`を使用してMCPツールの読み込みを遅延させます：

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
  --header "x-api-key: $ANTHROPIC_API_KEY" \
  --header "anthropic-version: 2023-06-01" \
  --header "anthropic-beta: advanced-tool-use-2025-11-20,mcp-client-2025-11-20" \
  --header "content-type: application/json" \
  --data '{
    "model": "claude-sonnet-4-5-20250929",
    "max_tokens": 2048,
    "mcp_servers": [
      {
        "type": "url",
        "name": "database-server",
        "url": "https://mcp-db.example.com"
      }
    ],
    "tools": [
      {
        "type": "tool_search_tool_regex_20251119",
        "name": "tool_search_tool_regex"
      },
      {
        "type": "mcp_toolset",
        "mcp_server_name": "database-server",
        "default_config": {
          "defer_loading": true
        },
        "configs": {
          "search_events": {
            "defer_loading": false
          }
        }
      }
    ],
    "messages": [
      {
        "role": "user",
        "content": "What events are in my database?"
      }
    ]
  }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    betas=["advanced-tool-use-2025-11-20", "mcp-client-2025-11-20"],
    max_tokens=2048,
    mcp_servers=[
        {
            "type": "url",
            "name": "database-server",
            "url": "https://mcp-db.example.com"
        }
    ],
    tools=[
        {
            "type": "tool_search_tool_regex_20251119",
            "name": "tool_search_tool_regex"
        },
        {
            "type": "mcp_toolset",
            "mcp_server_name": "database-server",
            "default_config": {
                "defer_loading": True
            },
            "configs": {
                "search_events": {
                    "defer_loading": False
                }
            }
        }
    ],
    messages=[
        {
            "role": "user",
            "content": "What events are in my database?"
        }
    ]
)

print(response)
```

```typescript TypeScript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

async function main() {
  const response = await client.beta.messages.create({
    model: "claude-sonnet-4-5-20250929",
    betas: ["advanced-tool-use-2025-11-20", "mcp-client-2025-11-20"],
    max_tokens: 2048,
    mcp_servers: [
      {
        type: "url",
        name: "database-server",
        url: "https://mcp-db.example.com",
      },
    ],
    tools: [
      {
        type: "tool_search_tool_regex_20251119",
        name: "tool_search_tool_regex",
      },
      {
        type: "mcp_toolset",
        mcp_server_name: "database-server",
        default_config: {
          defer_loading: true,
        },
        configs: {
          search_events: {
            defer_loading: false,
          },
        },
      },
    ],
    messages: [
      {
        role: "user",
        content: "What events are in my database?",
      },
    ],
  });

  console.log(JSON.stringify(response, null, 2));
}

main();
```

</CodeGroup>

**MCP設定オプション：**

- `default_config.defer_loading`: MCPサーバーからのすべてのツールのデフォルトを設定します
- `configs`: 名前で特定のツールのデフォルトをオーバーライドします
- 複数のMCPサーバーをツール検索と組み合わせて、大規模なツールライブラリを実現します

## カスタムツール検索実装

カスタムツール（例：埋め込みやセマンティック検索を使用）から`tool_reference`ブロックを返すことで、独自のツール検索ロジックを実装できます：

```json JSON
{
  "type": "tool_search_tool_result",
  "tool_use_id": "toolu_custom_search",
  "content": {
    "type": "tool_search_tool_search_result",
    "tool_references": [{ "type": "tool_reference", "tool_name": "discovered_tool_name" }]
  }
}
```

参照されるすべてのツールは、トップレベルの`tools`パラメータに`defer_loading: true`を持つ対応するツール定義を持つ必要があります。このアプローチにより、ツール検索システムとの互換性を維持しながら、より高度な検索アルゴリズムを使用できます。

埋め込みを使用した完全な例については、[埋め込みを使用したツール検索クックブック](https://github.com/anthropics/anthropic-cookbook)を参照してください。

## エラーハンドリング

<Note>
  ツール検索ツールは[ツール使用例](/docs/ja/agents-and-tools/tool-use/implement-tool-use#providing-tool-use-examples)と互換性がありません。
  ツール使用の例を提供する必要がある場合は、ツール検索なしで標準的なツール呼び出しを使用してください。
</Note>

### HTTPエラー（400ステータス）

これらのエラーはリクエストが処理されるのを防ぎます：

**すべてのツールが遅延：**

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "All tools have defer_loading set. At least one tool must be non-deferred."
  }
}
```

**ツール定義がない：**

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "Tool reference 'unknown_tool' has no corresponding tool definition"
  }
}
```

### ツール結果エラー（200ステータス）

ツール実行中のエラーは、本文にエラー情報を含む200レスポンスを返します：

```json JSON
{
  "type": "tool_result",
  "tool_use_id": "srvtoolu_01ABC123",
  "content": {
    "type": "tool_search_tool_result_error",
    "error_code": "invalid_pattern"
  }
}
```

**エラーコード：**

- `too_many_requests`: ツール検索操作のレート制限を超過しました
- `invalid_pattern`: 不正な形式の正規表現パターン
- `pattern_too_long`: パターンが200文字制限を超えています
- `unavailable`: ツール検索サービスが一時的に利用不可です

### よくある間違い

<section title="400エラー：すべてのツールが遅延しています">

**原因**: 検索ツールを含むすべてのツールに`defer_loading: true`を設定しました

**修正**: ツール検索ツールから`defer_loading`を削除します：

```json
{
  "type": "tool_search_tool_regex_20251119", // ここにdefer_loadingはありません
  "name": "tool_search_tool_regex"
}
```

</section>

<section title="400エラー：ツール定義がない">

**原因**: `tool_reference`が`tools`配列にないツールを指しています

**修正**: 発見される可能性のあるすべてのツールが完全な定義を持つことを確認します：

```json
{
  "name": "my_tool",
  "description": "Full description here",
  "input_schema": {
    /* complete schema */
  },
  "defer_loading": true
}
```

</section>

<section title="Claudeが予期されたツールを見つけません">

**原因**: ツール名または説明が正規表現パターンと一致しません

**デバッグステップ：**

1. ツール名と説明を確認してください。Claudeは両方のフィールドを検索します
2. パターンをテストします：`import re; re.search(r"your_pattern", "tool_name")`
3. デフォルトでは検索は大文字小文字を区別します（大文字小文字を区別しない場合は`(?i)`を使用）
4. Claudeは`".*weather.*"`のような広いパターンを使用し、完全一致ではありません

**ヒント**: ツール説明に一般的なキーワードを追加して、発見可能性を向上させます

</section>

## プロンプトキャッシング

ツール検索は[プロンプトキャッシング](/docs/ja/build-with-claude/prompt-caching)と連携します。マルチターン会話を最適化するために`cache_control`ブレークポイントを追加します：

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# ツール検索を使用した最初のリクエスト
messages = [
    {
        "role": "user",
        "content": "What's the weather in Seattle?"
    }
]

response1 = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=2048,
    messages=messages,
    tools=[
        {
            "type": "tool_search_tool_regex_20251119",
            "name": "tool_search_tool_regex"
        },
        {
            "name": "get_weather",
            "description": "Get weather for a location",
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {"type": "string"}
                },
                "required": ["location"]
            },
            "defer_loading": True
        }
    ]
)

# Claudeのレスポンスを会話に追加します
messages.append({
    "role": "assistant",
    "content": response1.content
})

# キャッシュブレークポイント付きの2番目のリクエスト
messages.append({
    "role": "user",
    "content": "What about New York?",
    "cache_control": {"type": "ephemeral"}
})

response2 = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=2048,
    messages=messages,
    tools=[
        {
            "type": "tool_search_tool_regex_20251119",
            "name": "tool_search_tool_regex"
        },
        {
            "name": "get_weather",
            "description": "Get weather for a location",
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {"type": "string"}
                },
                "required": ["location"]
            },
            "defer_loading": True
        }
    ]
)

print(f"Cache read tokens: {response2.usage.get('cache_read_input_tokens', 0)}")
```
</CodeGroup>

システムは会話履歴全体を通じてtool_referenceブロックを自動的に展開するため、Claudeは後続のターンで再検索することなく、発見されたツールを再利用できます。

## ストリーミング

ストリーミングが有効な場合、ストリームの一部としてツール検索イベントを受け取ります：

```javascript
event: content_block_start
data: {"type": "content_block_start", "index": 1, "content_block": {"type": "server_tool_use", "id": "srvtoolu_xyz789", "name": "tool_search_tool_regex"}}

// 検索クエリがストリーミングされます
event: content_block_delta
data: {"type": "content_block_delta", "index": 1, "delta": {"type": "input_json_delta", "partial_json": "{\"query\":\"weather\"}"}}

// 検索実行中に一時停止

// 検索結果がストリーミングされます
event: content_block_start
data: {"type": "content_block_start", "index": 2, "content_block": {"type": "tool_search_tool_result", "tool_use_id": "srvtoolu_xyz789", "content": {"type": "tool_search_tool_search_result", "tool_references": [{"type": "tool_reference", "tool_name": "get_weather"}]}}}

// Claudeが発見されたツールで続行します
```

## バッチリクエスト

[メッセージバッチAPI](/docs/ja/build-with-claude/batch-processing)にツール検索ツールを含めることができます。メッセージバッチAPIを通じたツール検索操作は、通常のメッセージAPIリクエストと同じ価格で課金されます。

## 制限とベストプラクティス

### 制限

- **最大ツール数**: カタログ内に10,000個のツール
- **検索結果**: 検索ごとに3～5個の最も関連性の高いツールを返します
- **パターン長**: 正規表現パターンの最大200文字
- **モデルサポート**: Sonnet 4.0以上、Opus 4.0以上のみ（Haikuなし）

### ツール検索を使用する場合

**良いユースケース：**

- システムで10個以上のツールが利用可能
- ツール定義が>10Kトークンを消費している
- 大規模なツールセットでツール選択精度の問題が発生している
- MCPを使用したシステムを構築している複数のサーバー（200個以上のツール）
- ツールライブラリが時間とともに成長している

**従来のツール呼び出しがより良い場合：**

- 合計10個未満のツール
- すべてのツールがすべてのリクエストで頻繁に使用される
- 非常に小さいツール定義（合計<100トークン）

### 最適化のヒント

- 最も頻繁に使用される3～5個のツールを非遅延として保ちます
- 明確で説明的なツール名と説明を書きます
- ユーザーがタスクを説明する方法と一致するセマンティックキーワードを説明に使用します
- 利用可能なツールカテゴリを説明するシステムプロンプトセクションを追加します：「Slack、GitHub、Jiraと相互作用するためのツールを検索できます」
- Claudeが発見するツールを監視して、説明を改善します

## 使用方法

ツール検索ツールの使用方法はレスポンス使用オブジェクトで追跡されます：

```json JSON
{
  "usage": {
    "input_tokens": 1024,
    "output_tokens": 256,
    "server_tool_use": {
      "tool_search_requests": 2
    }
  }
}
```