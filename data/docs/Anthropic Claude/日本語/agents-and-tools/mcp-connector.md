# MCP コネクタ

Claude の Model Context Protocol (MCP) コネクタ機能を使用して、Messages API から直接リモート MCP サーバーに接続します。

---

Claude の Model Context Protocol (MCP) コネクタ機能により、Messages API から直接リモート MCP サーバーに接続でき、別の MCP クライアントを実装する必要がありません。

<Note>
  **現在のバージョン**: この機能にはベータヘッダーが必要です: `"anthropic-beta": "mcp-client-2025-11-20"`

  以前のバージョン (`mcp-client-2025-04-04`) は廃止予定です。下記の[廃止予定バージョンのドキュメント](#deprecated-version-mcp-client-2025-04-04)を参照してください。
</Note>

## 主な機能

- **直接 API 統合**: MCP クライアントを実装せずに MCP サーバーに接続
- **ツール呼び出しサポート**: Messages API を通じて MCP ツールにアクセス
- **柔軟なツール設定**: すべてのツールを有効にするか、特定のツールをホワイトリストに登録するか、不要なツールをブラックリストに登録するか選択可能
- **ツール単位の設定**: カスタム設定で個別のツールを設定
- **OAuth 認証**: 認証されたサーバー向けの OAuth Bearer トークンのサポート
- **複数サーバー**: 単一のリクエストで複数の MCP サーバーに接続

## 制限事項

- [MCP 仕様](https://modelcontextprotocol.io/introduction#explore-mcp)の機能セットのうち、[ツール呼び出し](https://modelcontextprotocol.io/docs/concepts/tools)のみが現在サポートされています。
- サーバーは HTTP を通じて公開されている必要があります (Streamable HTTP と SSE トランスポートの両方をサポート)。ローカル STDIO サーバーは直接接続できません。
- MCP コネクタは現在、Amazon Bedrock と Google Vertex ではサポートされていません。

## Messages API での MCP コネクタの使用

MCP コネクタは 2 つのコンポーネントを使用します:

1. **MCP サーバー定義** (`mcp_servers` 配列): サーバー接続の詳細 (URL、認証) を定義
2. **MCP ツールセット** (`tools` 配列): 有効にするツールと設定方法を設定

### 基本的な例

この例は、デフォルト設定で MCP サーバーのすべてのツールを有効にします:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: mcp-client-2025-11-20" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1000,
    "messages": [{"role": "user", "content": "What tools do you have available?"}],
    "mcp_servers": [
      {
        "type": "url",
        "url": "https://example-server.modelcontextprotocol.io/sse",
        "name": "example-mcp",
        "authorization_token": "YOUR_TOKEN"
      }
    ],
    "tools": [
      {
        "type": "mcp_toolset",
        "mcp_server_name": "example-mcp"
      }
    ]
  }'
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1000,
  messages: [
    {
      role: "user",
      content: "What tools do you have available?",
    },
  ],
  mcp_servers: [
    {
      type: "url",
      url: "https://example-server.modelcontextprotocol.io/sse",
      name: "example-mcp",
      authorization_token: "YOUR_TOKEN",
    },
  ],
  tools: [
    {
      type: "mcp_toolset",
      mcp_server_name: "example-mcp",
    },
  ],
  betas: ["mcp-client-2025-11-20"],
});
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1000,
    messages=[{
        "role": "user",
        "content": "What tools do you have available?"
    }],
    mcp_servers=[{
        "type": "url",
        "url": "https://mcp.example.com/sse",
        "name": "example-mcp",
        "authorization_token": "YOUR_TOKEN"
    }],
    tools=[{
        "type": "mcp_toolset",
        "mcp_server_name": "example-mcp"
    }],
    betas=["mcp-client-2025-11-20"]
)
```
</CodeGroup>

## MCP サーバー設定

`mcp_servers` 配列内の各 MCP サーバーは接続の詳細を定義します:

```json
{
  "type": "url",
  "url": "https://example-server.modelcontextprotocol.io/sse",
  "name": "example-mcp",
  "authorization_token": "YOUR_TOKEN"
}
```

### フィールドの説明

| プロパティ | 型 | 必須 | 説明 |
|----------|------|----------|-------------|
| `type` | string | はい | 現在は "url" のみがサポートされています |
| `url` | string | はい | MCP サーバーの URL。https:// で始まる必要があります |
| `name` | string | はい | この MCP サーバーの一意の識別子。`tools` 配列内の正確に 1 つの MCPToolset によって参照される必要があります。 |
| `authorization_token` | string | いいえ | MCP サーバーで必要な場合の OAuth 認可トークン。[MCP 仕様](https://modelcontextprotocol.io/specification/2025-03-26/basic/authorization)を参照してください。 |

## MCP ツールセット設定

MCPToolset は `tools` 配列に存在し、MCP サーバーのどのツールが有効になるか、およびそれらがどのように設定されるかを設定します。

### 基本的な構造

```json
{
  "type": "mcp_toolset",
  "mcp_server_name": "example-mcp",
  "default_config": {
    "enabled": true,
    "defer_loading": false
  },
  "configs": {
    "specific_tool_name": {
      "enabled": true,
      "defer_loading": true
    }
  }
}
```

### フィールドの説明

| プロパティ | 型 | 必須 | 説明 |
|----------|------|----------|-------------|
| `type` | string | はい | "mcp_toolset" である必要があります |
| `mcp_server_name` | string | はい | `mcp_servers` 配列で定義されたサーバー名と一致する必要があります |
| `default_config` | object | いいえ | このセット内のすべてのツールに適用されるデフォルト設定。`configs` 内の個別のツール設定がこれらのデフォルトをオーバーライドします。 |
| `configs` | object | いいえ | ツール単位の設定オーバーライド。キーはツール名、値は設定オブジェクトです。 |
| `cache_control` | object | いいえ | このツールセットのキャッシュブレークポイント設定 |

### ツール設定オプション

各ツール (`default_config` または `configs` で設定されているかどうかに関わらず) は以下のフィールドをサポートしています:

| プロパティ | 型 | デフォルト | 説明 |
|----------|------|---------|-------------|
| `enabled` | boolean | `true` | このツールが有効かどうか |
| `defer_loading` | boolean | `false` | true の場合、ツールの説明は最初はモデルに送信されません。[ツール検索ツール](/agents-and-tools/tool-search-tool)で使用されます。 |

### 設定のマージ

設定値は以下の優先度 (高から低) でマージされます:

1. `configs` 内のツール固有の設定
2. セットレベルの `default_config`
3. システムデフォルト

例:

```json
{
  "type": "mcp_toolset",
  "mcp_server_name": "google-calendar-mcp",
  "default_config": {
    "defer_loading": true
  },
  "configs": {
    "search_events": {
      "enabled": false
    }
  }
}
```

結果:
- `search_events`: `enabled: false` (configs から)、`defer_loading: true` (default_config から)
- その他すべてのツール: `enabled: true` (システムデフォルト)、`defer_loading: true` (default_config から)

## 一般的な設定パターン

### すべてのツールをデフォルト設定で有効にする

最もシンプルなパターン - サーバーのすべてのツールを有効にします:

```json
{
  "type": "mcp_toolset",
  "mcp_server_name": "google-calendar-mcp",
}
```

### ホワイトリスト - 特定のツールのみを有効にする

デフォルトとして `enabled: false` を設定し、特定のツールを明示的に有効にします:

```json
{
  "type": "mcp_toolset",
  "mcp_server_name": "google-calendar-mcp",
  "default_config": {
    "enabled": false
  },
  "configs": {
    "search_events": {
      "enabled": true
    },
    "create_event": {
      "enabled": true
    }
  }
}
```

### ブラックリスト - 特定のツールを無効にする

デフォルトですべてのツールを有効にし、不要なツールを明示的に無効にします:

```json
{
  "type": "mcp_toolset",
  "mcp_server_name": "google-calendar-mcp",
  "configs": {
    "delete_all_events": {
      "enabled": false
    },
    "share_calendar_publicly": {
      "enabled": false
    }
  }
}
```

### 混合 - ツール単位の設定を含むホワイトリスト

ホワイトリストと各ツールのカスタム設定を組み合わせます:

```json
{
  "type": "mcp_toolset",
  "mcp_server_name": "google-calendar-mcp",
  "default_config": {
    "enabled": false,
    "defer_loading": true
  },
  "configs": {
    "search_events": {
      "enabled": true,
      "defer_loading": false
    },
    "list_events": {
      "enabled": true
    }
  }
}
```

この例では:
- `search_events` は `defer_loading: false` で有効になります
- `list_events` は `defer_loading: true` で有効になります (default_config から継承)
- その他すべてのツールは無効になります

## 検証ルール

API は以下の検証ルールを適用します:

- **サーバーが存在する必要があります**: MCPToolset 内の `mcp_server_name` は `mcp_servers` 配列で定義されたサーバーと一致する必要があります
- **サーバーが使用される必要があります**: `mcp_servers` で定義されたすべての MCP サーバーは正確に 1 つの MCPToolset によって参照される必要があります
- **サーバーごとに一意のツールセット**: 各 MCP サーバーは 1 つの MCPToolset によってのみ参照できます
- **不明なツール名**: `configs` 内のツール名が MCP サーバーに存在しない場合、バックエンド警告がログに記録されますが、エラーは返されません (MCP サーバーはツール可用性が動的である可能性があります)

## レスポンスコンテンツタイプ

Claude が MCP ツールを使用する場合、レスポンスには 2 つの新しいコンテンツブロックタイプが含まれます:

### MCP ツール使用ブロック

```json
{
  "type": "mcp_tool_use",
  "id": "mcptoolu_014Q35RayjACSWkSj4X2yov1",
  "name": "echo",
  "server_name": "example-mcp",
  "input": { "param1": "value1", "param2": "value2" }
}
```

### MCP ツール結果ブロック

```json
{
  "type": "mcp_tool_result",
  "tool_use_id": "mcptoolu_014Q35RayjACSWkSj4X2yov1",
  "is_error": false,
  "content": [
    {
      "type": "text",
      "text": "Hello"
    }
  ]
}
```

## 複数の MCP サーバー

`mcp_servers` に複数のサーバー定義を含め、`tools` 配列に各サーバーに対応する MCPToolset を含めることで、複数の MCP サーバーに接続できます:

```json
{
  "model": "claude-sonnet-4-5",
  "max_tokens": 1000,
  "messages": [
    {
      "role": "user",
      "content": "Use tools from both mcp-server-1 and mcp-server-2 to complete this task"
    }
  ],
  "mcp_servers": [
    {
      "type": "url",
      "url": "https://mcp.example1.com/sse",
      "name": "mcp-server-1",
      "authorization_token": "TOKEN1"
    },
    {
      "type": "url",
      "url": "https://mcp.example2.com/sse",
      "name": "mcp-server-2",
      "authorization_token": "TOKEN2"
    }
  ],
  "tools": [
    {
      "type": "mcp_toolset",
      "mcp_server_name": "mcp-server-1"
    },
    {
      "type": "mcp_toolset",
      "mcp_server_name": "mcp-server-2",
      "default_config": {
        "defer_loading": true
      }
    }
  ]
}
```

## 認証

OAuth 認証が必要な MCP サーバーの場合、アクセストークンを取得する必要があります。MCP コネクタベータは MCP サーバー定義で `authorization_token` パラメータを渡すことをサポートしています。
API コンシューマーは OAuth フローを処理し、API 呼び出しの前にアクセストークンを取得し、必要に応じてトークンをリフレッシュすることが期待されます。

### テスト用のアクセストークンの取得

MCP インスペクタは、テスト目的でアクセストークンを取得するプロセスをガイドできます。

1. 次のコマンドでインスペクタを実行します。マシンに Node.js がインストールされている必要があります。

   ```bash
   npx @modelcontextprotocol/inspector
   ```

2. 左側のサイドバーで、「Transport type」に対して「SSE」または「Streamable HTTP」を選択します。
3. MCP サーバーの URL を入力します。
4. 右側の領域で、「Need to configure authentication?」の後の「Open Auth Settings」ボタンをクリックします。
5. 「Quick OAuth Flow」をクリックし、OAuth 画面で認可します。
6. インスペクタの「OAuth Flow Progress」セクションのステップに従い、「Authentication complete」に到達するまで「Continue」をクリックします。
7. `access_token` 値をコピーします。
8. MCP サーバー設定の `authorization_token` フィールドに貼り付けます。

### アクセストークンの使用

上記のいずれかの OAuth フローを使用してアクセストークンを取得したら、MCP サーバー設定で使用できます:

```json
{
  "mcp_servers": [
    {
      "type": "url",
      "url": "https://example-server.modelcontextprotocol.io/sse",
      "name": "authenticated-server",
      "authorization_token": "YOUR_ACCESS_TOKEN_HERE"
    }
  ]
}
```

OAuth フローの詳細な説明については、MCP 仕様の[認可セクション](https://modelcontextprotocol.io/docs/concepts/authentication)を参照してください。

## マイグレーションガイド

廃止予定の `mcp-client-2025-04-04` ベータヘッダーを使用している場合は、このガイドに従って新しいバージョンにマイグレーションしてください。

### 主な変更点

1. **新しいベータヘッダー**: `mcp-client-2025-04-04` から `mcp-client-2025-11-20` に変更
2. **ツール設定の移動**: ツール設定は MCP サーバー定義ではなく、`tools` 配列内の MCPToolset オブジェクトに移動しました
3. **より柔軟な設定**: 新しいパターンはホワイトリスト、ブラックリスト、およびツール単位の設定をサポートしています

### マイグレーションステップ

**前 (廃止予定):

```json
{
  "model": "claude-sonnet-4-5",
  "max_tokens": 1000,
  "messages": [...],
  "mcp_servers": [
    {
      "type": "url",
      "url": "https://mcp.example.com/sse",
      "name": "example-mcp",
      "authorization_token": "YOUR_TOKEN",
      "tool_configuration": {
        "enabled": true,
        "allowed_tools": ["tool1", "tool2"]
      }
    }
  ]
}
```

**後 (現在):

```json
{
  "model": "claude-sonnet-4-5",
  "max_tokens": 1000,
  "messages": [...],
  "mcp_servers": [
    {
      "type": "url",
      "url": "https://mcp.example.com/sse",
      "name": "example-mcp",
      "authorization_token": "YOUR_TOKEN"
    }
  ],
  "tools": [
    {
      "type": "mcp_toolset",
      "mcp_server_name": "example-mcp",
      "default_config": {
        "enabled": false
      },
      "configs": {
        "tool1": {
          "enabled": true
        },
        "tool2": {
          "enabled": true
        }
      }
    }
  ]
}
```

### 一般的なマイグレーションパターン

| 古いパターン | 新しいパターン |
|-------------|-------------|
| `tool_configuration` なし (すべてのツールが有効) | `default_config` または `configs` なしの MCPToolset |
| `tool_configuration.enabled: false` | `default_config.enabled: false` を持つ MCPToolset |
| `tool_configuration.allowed_tools: [...]` | `default_config.enabled: false` と `configs` で特定のツールが有効な MCPToolset |

## 廃止予定バージョン: mcp-client-2025-04-04

<Note type="warning">
  このバージョンは廃止予定です。上記の[マイグレーションガイド](#migration-guide)を使用して `mcp-client-2025-11-20` にマイグレーションしてください。
</Note>

MCP コネクタの以前のバージョンは、ツール設定を MCP サーバー定義に直接含めていました:

```json
{
  "mcp_servers": [
    {
      "type": "url",
      "url": "https://example-server.modelcontextprotocol.io/sse",
      "name": "example-mcp",
      "authorization_token": "YOUR_TOKEN",
      "tool_configuration": {
        "enabled": true,
        "allowed_tools": ["example_tool_1", "example_tool_2"]
      }
    }
  ]
}
```

### 廃止予定フィールドの説明

| プロパティ | 型 | 説明 |
|----------|------|-------------|
| `tool_configuration` | object | **廃止予定**: `tools` 配列内の MCPToolset を使用してください |
| `tool_configuration.enabled` | boolean | **廃止予定**: MCPToolset 内の `default_config.enabled` を使用してください |
| `tool_configuration.allowed_tools` | array | **廃止予定**: MCPToolset 内の `configs` を使用したホワイトリストパターンを使用してください |