# プログラマティックツール呼び出し

Claudeがコード実行コンテナ内でツールをプログラマティックに呼び出すコードを記述できるようにします。

---

プログラマティックツール呼び出しにより、Claudeは[コード実行](/docs/ja/agents-and-tools/tool-use/code-execution-tool)コンテナ内でツールをプログラマティックに呼び出すコードを記述できます。これにより、ツール呼び出しごとにモデルを経由したラウンドトリップが不要になります。マルチツールワークフローのレイテンシが削減され、Claudeがデータをフィルタリングまたは処理してからモデルのコンテキストウィンドウに到達させることで、トークン消費が減少します。

<Note>
プログラマティックツール呼び出しは現在パブリックベータ版です。

この機能を使用するには、APIリクエストに`"advanced-tool-use-2025-11-20"` [ベータヘッダー](/docs/ja/api/beta-headers)を追加してください。

この機能にはコード実行ツールが有効になっている必要があります。
</Note>

## モデル互換性

プログラマティックツール呼び出しは以下のモデルで利用可能です：

| モデル | ツールバージョン |
|-------|--------------|
| Claude Opus 4.5 (`claude-opus-4-5-20251101`) | `code_execution_20250825` |
| Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`) | `code_execution_20250825` |

<Warning>
プログラマティックツール呼び出しはClaude APIおよびMicrosoft Foundryを通じて利用可能です。
</Warning>

## クイックスタート

Claudeがデータベースを複数回プログラマティックにクエリし、結果を集約する簡単な例を以下に示します：

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

## プログラマティックツール呼び出しの仕組み

コード実行から呼び出し可能なツールを設定し、Claudeがそのツールを使用することを決定した場合：

1. Claudeはツールを関数として呼び出すPythonコードを記述します。複数のツール呼び出しと前処理/後処理ロジックが含まれる可能性があります
2. Claudeはこのコードをコード実行経由でサンドボックスコンテナで実行します
3. ツール関数が呼び出されると、コード実行が一時停止され、APIが`tool_use`ブロックを返します
4. ツール結果を提供すると、コード実行が継続します（中間結果はClaudeのコンテキストウィンドウに読み込まれません）
5. すべてのコード実行が完了すると、Claudeは最終出力を受け取り、タスクの処理を続行します

このアプローチは特に以下に有用です：
- **大規模データ処理**：ツール結果をフィルタリングまたは集約してからClaudeのコンテキストに到達させます
- **マルチステップワークフロー**：ツール呼び出し間でClaudeをサンプリングせずにツールをシリアルまたはループで呼び出すことで、トークンとレイテンシを節約します
- **条件付きロジック**：中間ツール結果に基づいて決定を下します

<Note>
カスタムツールは並列ツール呼び出しをサポートするために非同期Python関数に変換されます。Claudeがツールを呼び出すコードを記述する場合、`await`を使用します（例：`result = await query_database("<sql>")`）。適切な非同期ラッパー関数が自動的に含まれます。

このドキュメントのコード例では、明確性のため非同期ラッパーは省略されています。
</Note>

## コアコンセプト

### `allowed_callers`フィールド

`allowed_callers`フィールドは、どのコンテキストがツールを呼び出せるかを指定します：

```json
{
  "name": "query_database",
  "description": "Execute a SQL query against the database",
  "input_schema": {...},
  "allowed_callers": ["code_execution_20250825"]
}
```

**可能な値：**
- `["direct"]` - Claudeのみがこのツールを直接呼び出せます（省略された場合のデフォルト）
- `["code_execution_20250825"]` - コード実行内からのみ呼び出し可能
- `["direct", "code_execution_20250825"]` - 直接呼び出しとコード実行の両方から呼び出し可能

<Tip>
各ツールに対して`["direct"]`または`["code_execution_20250825"]`のいずれかを選択することをお勧めします。両方を有効にするのではなく、これはClaudeにツールの最適な使用方法についてより明確なガイダンスを提供します。
</Tip>

### レスポンスの`caller`フィールド

すべてのツール使用ブロックには、それがどのように呼び出されたかを示す`caller`フィールドが含まれます：

**直接呼び出し（従来のツール使用）：**
```json
{
  "type": "tool_use",
  "id": "toolu_abc123",
  "name": "query_database",
  "input": {"sql": "\<sql\>"},
  "caller": {"type": "direct"}
}
```

**プログラマティック呼び出し：**
```json
{
  "type": "tool_use",
  "id": "toolu_xyz789",
  "name": "query_database",
  "input": {"sql": "\<sql\>"},
  "caller": {
    "type": "code_execution_20250825",
    "tool_id": "srvtoolu_abc123"
  }
}
```

`tool_id`はプログラマティック呼び出しを行ったコード実行ツールを参照します。

### コンテナライフサイクル

プログラマティックツール呼び出しはコード実行と同じコンテナを使用します：

- **コンテナ作成**：既存のコンテナを再利用しない限り、セッションごとに新しいコンテナが作成されます
- **有効期限**：コンテナは約4.5分の非アクティブ状態の後に有効期限が切れます（変更される可能性があります）
- **コンテナID**：レスポンスの`container`フィールド経由で返されます
- **再利用**：コンテナIDを渡してリクエスト間で状態を維持します

<Warning>
ツールがプログラマティックに呼び出され、コンテナがツール結果を待機している場合、コンテナが有効期限切れになる前に応答する必要があります。`expires_at`フィールドを監視してください。コンテナが有効期限切れになると、Claudeはツール呼び出しがタイムアウトしたと見なし、再試行する可能性があります。
</Warning>

## ワークフロー例

完全なプログラマティックツール呼び出しフローがどのように機能するかを以下に示します：

### ステップ1：初期リクエスト

コード実行とプログラマティック呼び出しを許可するツールを含むリクエストを送信します。プログラマティック呼び出しを有効にするには、ツール定義に`allowed_callers`フィールドを追加します。

<Note>
ツール定義で、ツールの出力形式の詳細な説明を提供してください。ツールがJSONを返すことを指定する場合、Claudeは結果を逆シリアル化してコードで処理しようとします。出力スキーマについて提供する詳細が多いほど、Claudeは応答をプログラマティックに処理できます。
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

### ステップ2：ツール呼び出しを含むAPIレスポンス

Claudeはツールを呼び出すコードを記述します。APIが一時停止して以下を返します：

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
      "input": {"sql": "\<sql\>"},
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

### ステップ3：ツール結果を提供

完全な会話履歴とツール結果を含めます：

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
                    "input": {"sql": "\<sql\>"},
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
          input: { sql: "\<sql\>" },
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

### ステップ4：次のツール呼び出しまたは完了

コード実行が継続され、結果が処理されます。追加のツール呼び出しが必要な場合、すべてのツール呼び出しが満たされるまでステップ3を繰り返します。

### ステップ5：最終レスポンス

コード実行が完了すると、Claudeは最終レスポンスを提供します：

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

## 高度なパターン

### ループを使用したバッチ処理

Claudeは複数のアイテムを効率的に処理するコードを記述できます：

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

このパターン：
- モデルラウンドトリップをN（地域ごとに1つ）から1に削減します
- 大規模な結果セットをClaudeに返す前にプログラマティックに処理します
- 生データの代わりに集約された結論のみを返すことでトークンを節約します

### 早期終了

Claudeは成功基準が満たされるとすぐに処理を停止できます：

```python
# async wrapper omitted for clarity
endpoints = ["us-east", "eu-west", "apac"]
for endpoint in endpoints:
    status = await check_health(endpoint)
    if status == "healthy":
        print(f"Found healthy endpoint: {endpoint}")
        break  # Stop early, don't check remaining
```

### 条件付きツール選択

```python
# async wrapper omitted for clarity
file_info = await get_file_info(path)
if file_info["size"] < 10000:
    content = await read_full_file(path)
else:
    content = await read_file_summary(path)
print(content)
```

### データフィルタリング

```python
# async wrapper omitted for clarity
logs = await fetch_logs(server_id)
errors = [log for log in logs if "ERROR" in log]
print(f"Found {len(errors)} errors")
for error in errors[-10:]:  # Only return last 10 errors
    print(error)
```

## レスポンス形式

### プログラマティックツール呼び出し

コード実行がツールを呼び出す場合：

```json
{
  "type": "tool_use",
  "id": "toolu_abc123",
  "name": "query_database",
  "input": {"sql": "\<sql\>"},
  "caller": {
    "type": "code_execution_20250825",
    "tool_id": "srvtoolu_xyz789"
  }
}
```

### ツール結果処理

ツール結果は実行中のコードに返されます：

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

### コード実行完了

すべてのツール呼び出しが満たされ、コードが完了した場合：

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

## エラーハンドリング

### 一般的なエラー

| エラー | 説明 | 解決策 |
|-------|-------------|----------|
| `invalid_tool_input` | ツール入力がスキーマと一致しません | ツールのinput_schemaを検証してください |
| `tool_not_allowed` | ツールが要求された呼び出し元タイプを許可していません | `allowed_callers`が正しいコンテキストを含むことを確認してください |
| `missing_beta_header` | PTCベータヘッダーが提供されていません | リクエストに両方のベータヘッダーを追加してください |

### ツール呼び出し中のコンテナ有効期限切れ

ツールの応答に時間がかかりすぎる場合、コード実行は`TimeoutError`を受け取ります。Claudeはこれをstderrで見て、通常は再試行します：

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

タイムアウトを防ぐには：
- レスポンスの`expires_at`フィールドを監視してください
- ツール実行のタイムアウトを実装してください
- 長い操作をより小さなチャンクに分割することを検討してください

### ツール実行エラー

ツールがエラーを返す場合：

```python
# Provide error information in the tool result
{
    "type": "tool_result",
    "tool_use_id": "toolu_abc123",
    "content": "Error: Query timeout - table lock exceeded 30 seconds"
}
```

Claudeのコードはこのエラーを受け取り、適切に処理できます。

## 制約と制限

### 機能の非互換性

- **構造化出力**：`strict: true`のツールはプログラマティック呼び出しではサポートされていません
- **ツール選択**：`tool_choice`経由で特定のツールのプログラマティック呼び出しを強制することはできません
- **並列ツール使用**：`disable_parallel_tool_use: true`はプログラマティック呼び出しではサポートされていません

### ツール制限

以下のツールは現在プログラマティックに呼び出すことはできませんが、将来のリリースでサポートが追加される可能性があります：

- ウェブ検索
- ウェブフェッチ
- [MCPコネクタ](/docs/ja/agents-and-tools/mcp-connector)によって提供されるツール

### メッセージフォーマット制限

プログラマティックツール呼び出しに応答する場合、厳密なフォーマット要件があります：

**ツール結果のみのレスポンス**：結果を待機しているプログラマティックツール呼び出しが保留中の場合、レスポンスメッセージには**のみ**`tool_result`ブロックが含まれている必要があります。ツール結果の後でも、テキストコンテンツを含めることはできません。

```json
// ❌ 無効 - プログラマティックツール呼び出しに応答する場合、テキストを含めることはできません
{
  "role": "user",
  "content": [
    {"type": "tool_result", "tool_use_id": "toolu_01", "content": "[{\"customer_id\": \"C1\", \"revenue\": 45000}]"},
    {"type": "text", "text": "What should I do next?"}  // This will cause an error
  ]
}

// ✅ 有効 - プログラマティックツール呼び出しに応答する場合、ツール結果のみ
{
  "role": "user",
  "content": [
    {"type": "tool_result", "tool_use_id": "toolu_01", "content": "[{\"customer_id\": \"C1\", \"revenue\": 45000}]"}
  ]
}
```

この制限は、プログラマティック（コード実行）ツール呼び出しに応答する場合にのみ適用されます。通常のクライアント側ツール呼び出しの場合、ツール結果の後にテキストコンテンツを含めることができます。

### レート制限

プログラマティックツール呼び出しは通常のツール呼び出しと同じレート制限の対象です。コード実行からのツール呼び出しはそれぞれ個別の呼び出しとしてカウントされます。

### ツール結果を使用する前に検証してください

プログラマティックに呼び出されるカスタムツールを実装する場合：

- **ツール結果は文字列として返されます**：コードスニペットや実行可能コマンドを含む任意のコンテンツを含めることができます。これは実行環境によって処理される可能性があります。
- **外部ツール結果を検証してください**：ツールが外部ソースからデータを返すか、ユーザー入力を受け入れる場合、出力がコードとして解釈または実行される場合のコードインジェクションリスクに注意してください。

## トークン効率

プログラマティックツール呼び出しはトークン消費を大幅に削減できます：

- **プログラマティック呼び出しからのツール結果はClaudeのコンテキストに追加されません** - 最終的なコード出力のみが追加されます
- **中間処理はコードで発生します** - フィルタリング、集約などはモデルトークンを消費しません
- **1つのコード実行内の複数のツール呼び出し** - 個別のモデルターンと比較してオーバーヘッドを削減します

たとえば、10個のツールを直接呼び出すと、プログラマティックに呼び出して概要を返すのと比べて約10倍のトークンを使用します。

## 使用とプライシング

プログラマティックツール呼び出しはコード実行と同じプライシングを使用します。詳細については、[コード実行プライシング](/docs/ja/agents-and-tools/tool-use/code-execution-tool#usage-and-pricing)を参照してください。

<Note>
プログラマティックツール呼び出しのトークンカウント：プログラマティック呼び出しからのツール結果は入力/出力トークン使用量にカウントされません。最終的なコード実行結果とClaudeのレスポンスのみがカウントされます。
</Note>

## ベストプラクティス

### ツール設計

- **詳細な出力説明を提供してください**：Claudeはコードでツール結果を逆シリアル化するため、形式（JSON構造、フィールドタイプなど）を明確に文書化してください
- **構造化データを返してください**：JSONまたは他の簡単に解析可能な形式がプログラマティック処理に最適です
- **レスポンスを簡潔に保ってください**：処理オーバーヘッドを最小化するために必要なデータのみを返してください

### プログラマティック呼び出しを使用する場合

**良いユースケース：**
- 集約または概要のみが必要な大規模データセットの処理
- 3つ以上の依存ツール呼び出しを含むマルチステップワークフロー
- ツール結果のフィルタリング、ソート、または変換が必要な操作
- 中間データがClaudeの推論に影響を与えるべきではないタスク
- 多くのアイテム（例：50個のエンドポイントをチェック）にわたる並列操作

**あまり理想的ではないユースケース：**
- シンプルなレスポンスを含む単一のツール呼び出し
- 即座のユーザーフィードバックが必要なツール
- コード実行オーバーヘッドが利益を上回る非常に高速な操作

### パフォーマンス最適化

- **複数の関連リクエストを行う場合、コンテナを再利用して**状態を維持してください
- **可能な場合、単一のコード実行内で類似の操作をバッチ処理してください**

## トラブルシューティング

### 一般的な問題

**「ツールが許可されていない」エラー**
- ツール定義に`"allowed_callers": ["code_execution_20250825"]`が含まれていることを確認してください
- 正しいベータヘッダーを使用していることを確認してください

**コンテナ有効期限切れ**
- コンテナの有効期間（約4.5分）内にツール呼び出しに応答することを確認してください
- レスポンスの`expires_at`フィールドを監視してください
- より高速なツール実行の実装を検討してください

**ベータヘッダーの問題**
- ヘッダーが必要です：`"advanced-tool-use-2025-11-20"`

**ツール結果が正しく解析されない**
- ツールがClaudeが逆シリアル化できる文字列データを返すことを確認してください
- ツール説明で明確な出力形式ドキュメントを提供してください

### デバッグのヒント

1. **すべてのツール呼び出しと結果をログに記録して**フローを追跡してください
2. **`caller`フィールドを確認して**プログラマティック呼び出しを確認してください
3. **コンテナIDを監視して**適切な再利用を確認してください
4. **プログラマティック呼び出しを有効にする前に、ツールを独立してテストしてください**

## プログラマティックツール呼び出しが機能する理由

Claudeのトレーニングにはコードへの広範な露出が含まれており、関数呼び出しの推論とチェーンに効果的です。ツールがコード実行環境内で呼び出し可能な関数として提示される場合、Claudeはこの強みを活用して以下を実現できます：

- **ツール構成について自然に推論する**：操作をチェーンし、依存関係を処理します。これはPythonコードを記述するのと同じくらい自然です
- **大規模な結果を効率的に処理する**：大規模なツール出力をフィルタリングし、関連データのみを抽出するか、中間結果をファイルに書き込んでから概要をコンテキストウィンドウに返します
- **レイテンシを大幅に削減する**：マルチステップワークフローでツール呼び出しごとにClaudeを再サンプリングするオーバーヘッドを排除します

このアプローチにより、従来のツール使用では実用的でないワークフロー（1Mトークンを超えるファイルの処理など）が可能になります。Claudeはすべてのデータを会話コンテキストに読み込むのではなく、プログラマティックにデータを操作できるようになります。

## 代替実装

プログラマティックツール呼び出しは、Anthropicの管理されたコード実行の外で実装できる一般化可能なパターンです。以下はアプローチの概要です：

### クライアント側直接実行

Claudeにコード実行ツールを提供し、その環境で利用可能な関数について説明してください。Claudeがコードでツールを呼び出すと、アプリケーションはそれらの関数が定義されているローカルで実行します。

**利点：**
- 最小限の再アーキテクチャで実装が簡単です
- 環境と指示を完全に制御できます

**欠点：**
- サンドボックスの外で信頼されていないコードを実行します
- ツール呼び出しはコードインジェクションのベクトルになる可能性があります

**使用する場合：**アプリケーションが安全に任意のコードを実行できる場合、シンプルなソリューションが必要な場合、またはAnthropicの管理されたオファリングがニーズに合わない場合。

### 自己管理サンドボックス実行

Claudeの観点からは同じアプローチですが、コードはセキュリティ制限（ネットワーク出力なしなど）を備えたサンドボックスコンテナで実行されます。ツールが外部リソースを必要とする場合、サンドボックスの外でツール呼び出しを実行するためのプロトコルが必要です。

**利点：**
- 独自のインフラストラクチャでセキュアなプログラマティックツール呼び出しが可能です
- 実行環境を完全に制御できます

**欠点：**
- 構築と保守が複雑です
- インフラストラクチャとプロセス間通信の両方を管理する必要があります

**使用する場合：**セキュリティが重要で、Anthropicの管理されたソリューションがニーズに合わない場合。

### Anthropic管理実行

Anthropicのプログラマティックツール呼び出しは、Claudeに調整されたサンドボックス実行の管理バージョンです。Anthropicはコンテナ管理、コード実行、セキュアなツール呼び出し通信を処理します。

**利点：**
- デフォルトでセキュアで安全です
- 最小限の設定で有効にするのが簡単です
- 環境と指示はClaudeに最適化されています

Claude APIを使用している場合は、Anthropicの管理されたソリューションを使用することをお勧めします。

## 関連機能

<CardGroup cols={2}>
  <Card title="コード実行ツール" icon="code" href="/docs/ja/agents-and-tools/tool-use/code-execution-tool">
    プログラマティックツール呼び出しを強化する基盤となるコード実行機能について学びます。
  </Card>
  <Card title="ツール使用の概要" icon="wrench" href="/docs/ja/agents-and-tools/tool-use/overview">
    Claudeでのツール使用の基礎を理解します。
  </Card>
  <Card title="ツール使用を実装する" icon="hammer" href="/docs/ja/agents-and-tools/tool-use/implement-tool-use">
    ツールを実装するためのステップバイステップガイド。
  </Card>
</CardGroup>