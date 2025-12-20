# 検索結果

ソース帰属を含む検索結果を提供することで、RAGアプリケーション向けの自然な引用を有効にします

---

検索結果コンテンツブロックは、適切なソース帰属を備えた自然な引用を可能にし、Webサーチ品質の引用をカスタムアプリケーションにもたらします。この機能は、Claudeが正確にソースを引用する必要があるRAG（検索拡張生成）アプリケーションに特に強力です。

検索結果機能は、以下のモデルで利用可能です：

- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)
- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Sonnet 3.7 ([非推奨](/docs/ja/about-claude/model-deprecations)) (`claude-3-7-sonnet-20250219`)
- Claude 3.5 Haiku (`claude-3-5-haiku-20241022`)

## 主な利点

- **自然な引用** - Webサーチと同じ品質の引用をあらゆるコンテンツで実現
- **柔軟な統合** - 動的RAG用のツール戻り値での使用、または事前取得データ用のトップレベルコンテンツとしての使用
- **適切なソース帰属** - 各結果にはソースとタイトル情報が含まれ、明確な帰属を実現
- **ドキュメント回避策は不要** - ドキュメントベースの回避策の必要性を排除
- **一貫した引用形式** - Claudeのウェブサーチ機能の引用品質と形式に一致

## 仕組み

検索結果は2つの方法で提供できます：

1. **ツール呼び出しから** - カスタムツールが検索結果を返し、動的RAGアプリケーションを有効にします
2. **トップレベルコンテンツとして** - 事前取得またはキャッシュされたコンテンツ用に、ユーザーメッセージで直接検索結果を提供します

どちらの場合でも、Claudeは検索結果から情報を自動的に引用し、適切なソース帰属を付与できます。

### 検索結果スキーマ

検索結果は以下の構造を使用します：

```json
{
  "type": "search_result",
  "source": "https://example.com/article",  // 必須：ソースURLまたは識別子
  "title": "Article Title",                  // 必須：結果のタイトル
  "content": [                               // 必須：テキストブロックの配列
    {
      "type": "text",
      "text": "The actual content of the search result..."
    }
  ],
  "citations": {                             // オプション：引用設定
    "enabled": true                          // この結果の引用を有効/無効にする
  }
}
```

### 必須フィールド

| フィールド | 型 | 説明 |
|-------|------|-------------|
| `type` | string | `"search_result"`である必要があります |
| `source` | string | コンテンツのソースURLまたは識別子 |
| `title` | string | 検索結果の説明的なタイトル |
| `content` | array | 実際のコンテンツを含むテキストブロックの配列 |

### オプションフィールド

| フィールド | 型 | 説明 |
|-------|------|-------------|
| `citations` | object | `enabled`ブール値フィールドを持つ引用設定 |
| `cache_control` | object | キャッシュ制御設定（例：`{"type": "ephemeral"}`） |

`content`配列の各項目は、以下を含むテキストブロックである必要があります：
- `type`：`"text"`である必要があります
- `text`：実際のテキストコンテンツ（空でない文字列）

## 方法1：ツール呼び出しからの検索結果

最も強力なユースケースは、カスタムツールから検索結果を返すことです。これにより、ツールが関連コンテンツを取得して自動引用で返す動的RAGアプリケーションが可能になります。

### 例：ナレッジベースツール

<CodeGroup>
```python Python
from anthropic import Anthropic
from anthropic.types import (
    MessageParam,
    TextBlockParam,
    SearchResultBlockParam,
    ToolResultBlockParam
)

client = Anthropic()

# ナレッジベース検索ツールを定義
knowledge_base_tool = {
    "name": "search_knowledge_base",
    "description": "Search the company knowledge base for information",
    "input_schema": {
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "The search query"
            }
        },
        "required": ["query"]
    }
}

# ツール呼び出しを処理する関数
def search_knowledge_base(query):
    # ここに検索ロジックを記述
    # 正しい形式で検索結果を返す
    return [
        SearchResultBlockParam(
            type="search_result",
            source="https://docs.company.com/product-guide",
            title="Product Configuration Guide",
            content=[
                TextBlockParam(
                    type="text",
                    text="To configure the product, navigate to Settings > Configuration. The default timeout is 30 seconds, but can be adjusted between 10-120 seconds based on your needs."
                )
            ],
            citations={"enabled": True}
        ),
        SearchResultBlockParam(
            type="search_result",
            source="https://docs.company.com/troubleshooting",
            title="Troubleshooting Guide",
            content=[
                TextBlockParam(
                    type="text",
                    text="If you encounter timeout errors, first check the configuration settings. Common causes include network latency and incorrect timeout values."
                )
            ],
            citations={"enabled": True}
        )
    ]

# ツール付きでメッセージを作成
response = client.messages.create(
    model="claude-sonnet-4-5",  # すべてのサポートされているモデルで動作
    max_tokens=1024,
    tools=[knowledge_base_tool],
    messages=[
        MessageParam(
            role="user",
            content="How do I configure the timeout settings?"
        )
    ]
)

# Claudeがツールを呼び出すときに、検索結果を提供
if response.content[0].type == "tool_use":
    tool_result = search_knowledge_base(response.content[0].input["query"])
    
    # ツール結果を返す
    final_response = client.messages.create(
        model="claude-sonnet-4-5",  # すべてのサポートされているモデルで動作
        max_tokens=1024,
        messages=[
            MessageParam(role="user", content="How do I configure the timeout settings?"),
            MessageParam(role="assistant", content=response.content),
            MessageParam(
                role="user",
                content=[
                    ToolResultBlockParam(
                        type="tool_result",
                        tool_use_id=response.content[0].id,
                        content=tool_result  # 検索結果がここに入ります
                    )
                ]
            )
        ]
    )
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

// ナレッジベース検索ツールを定義
const knowledgeBaseTool = {
  name: "search_knowledge_base",
  description: "Search the company knowledge base for information",
  input_schema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "The search query"
      }
    },
    required: ["query"]
  }
};

// ツール呼び出しを処理する関数
function searchKnowledgeBase(query: string) {
  // ここに検索ロジックを記述
  // 正しい形式で検索結果を返す
  return [
    {
      type: "search_result" as const,
      source: "https://docs.company.com/product-guide",
      title: "Product Configuration Guide",
      content: [
        {
          type: "text" as const,
          text: "To configure the product, navigate to Settings > Configuration. The default timeout is 30 seconds, but can be adjusted between 10-120 seconds based on your needs."
        }
      ],
      citations: { enabled: true }
    },
    {
      type: "search_result" as const,
      source: "https://docs.company.com/troubleshooting",
      title: "Troubleshooting Guide",
      content: [
        {
          type: "text" as const,
          text: "If you encounter timeout errors, first check the configuration settings. Common causes include network latency and incorrect timeout values."
        }
      ],
      citations: { enabled: true }
    }
  ];
}

// ツール付きでメッセージを作成
const response = await anthropic.messages.create({
  model: "claude-sonnet-4-5", // すべてのサポートされているモデルで動作
  max_tokens: 1024,
  tools: [knowledgeBaseTool],
  messages: [
    {
      role: "user",
      content: "How do I configure the timeout settings?"
    }
  ]
});

// ツール使用を処理して結果を提供
if (response.content[0].type === "tool_use") {
  const toolResult = searchKnowledgeBase(response.content[0].input.query);
  
  const finalResponse = await anthropic.messages.create({
    model: "claude-sonnet-4-5", // すべてのサポートされているモデルで動作
    max_tokens: 1024,
      messages: [
      { role: "user", content: "How do I configure the timeout settings?" },
      { role: "assistant", content: response.content },
      {
        role: "user",
        content: [
          {
            type: "tool_result" as const,
            tool_use_id: response.content[0].id,
            content: toolResult  // 検索結果がここに入ります
          }
        ]
      }
    ]
  });
}
```
</CodeGroup>

## 方法2：トップレベルコンテンツとしての検索結果

ユーザーメッセージで直接検索結果を提供することもできます。これは以下の場合に便利です：
- 検索インフラストラクチャから事前取得されたコンテンツ
- 前のクエリからキャッシュされた検索結果
- 外部検索サービスからのコンテンツ
- テストと開発

### 例：直接検索結果

<CodeGroup>
```python Python
from anthropic import Anthropic
from anthropic.types import (
    MessageParam,
    TextBlockParam,
    SearchResultBlockParam
)

client = Anthropic()

# ユーザーメッセージで直接検索結果を提供
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        MessageParam(
            role="user",
            content=[
                SearchResultBlockParam(
                    type="search_result",
                    source="https://docs.company.com/api-reference",
                    title="API Reference - Authentication",
                    content=[
                        TextBlockParam(
                            type="text",
                            text="All API requests must include an API key in the Authorization header. Keys can be generated from the dashboard. Rate limits: 1000 requests per hour for standard tier, 10000 for premium."
                        )
                    ],
                    citations={"enabled": True}
                ),
                SearchResultBlockParam(
                    type="search_result",
                    source="https://docs.company.com/quickstart",
                    title="Getting Started Guide",
                    content=[
                        TextBlockParam(
                            type="text",
                            text="To get started: 1) Sign up for an account, 2) Generate an API key from the dashboard, 3) Install our SDK using pip install company-sdk, 4) Initialize the client with your API key."
                        )
                    ],
                    citations={"enabled": True}
                ),
                TextBlockParam(
                    type="text",
                    text="Based on these search results, how do I authenticate API requests and what are the rate limits?"
                )
            ]
        )
    ]
)

print(response.model_dump_json(indent=2))
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

// ユーザーメッセージで直接検索結果を提供
const response = await anthropic.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: [
        {
          type: "search_result" as const,
          source: "https://docs.company.com/api-reference",
          title: "API Reference - Authentication",
          content: [
            {
              type: "text" as const,
              text: "All API requests must include an API key in the Authorization header. Keys can be generated from the dashboard. Rate limits: 1000 requests per hour for standard tier, 10000 for premium."
            }
          ],
          citations: { enabled: true }
        },
        {
          type: "search_result" as const,
          source: "https://docs.company.com/quickstart",
          title: "Getting Started Guide",
          content: [
            {
              type: "text" as const,
              text: "To get started: 1) Sign up for an account, 2) Generate an API key from the dashboard, 3) Install our SDK using pip install company-sdk, 4) Initialize the client with your API key."
            }
          ],
          citations: { enabled: true }
        },
        {
          type: "text" as const,
          text: "Based on these search results, how do I authenticate API requests and what are the rate limits?"
        }
      ]
    }
  ]
});

console.log(response);
```

```bash Shell
#!/bin/sh
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "search_result",
                    "source": "https://docs.company.com/api-reference",
                    "title": "API Reference - Authentication",
                    "content": [
                        {
                            "type": "text",
                            "text": "All API requests must include an API key in the Authorization header. Keys can be generated from the dashboard. Rate limits: 1000 requests per hour for standard tier, 10000 for premium."
                        }
                    ],
                    "citations": {
                        "enabled": true
                    }
                },
                {
                    "type": "search_result",
                    "source": "https://docs.company.com/quickstart",
                    "title": "Getting Started Guide",
                    "content": [
                        {
                            "type": "text",
                            "text": "To get started: 1) Sign up for an account, 2) Generate an API key from the dashboard, 3) Install our SDK using pip install company-sdk, 4) Initialize the client with your API key."
                        }
                    ],
                    "citations": {
                        "enabled": true
                    }
                },
                {
                    "type": "text",
                    "text": "Based on these search results, how do I authenticate API requests and what are the rate limits?"
                }
            ]
        }
    ]
}'
```
</CodeGroup>

## 引用付きのClaudeの応答

検索結果がどのように提供されるかに関わらず、Claudeは自動的に情報を使用する際に引用を含めます：

```json
{
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "To authenticate API requests, you need to include an API key in the Authorization header",
      "citations": [
        {
          "type": "search_result_location",
          "source": "https://docs.company.com/api-reference",
          "title": "API Reference - Authentication",
          "cited_text": "All API requests must include an API key in the Authorization header",
          "search_result_index": 0,
          "start_block_index": 0,
          "end_block_index": 0
        }
      ]
    },
    {
      "type": "text",
      "text": ". You can generate API keys from your dashboard",
      "citations": [
        {
          "type": "search_result_location",
          "source": "https://docs.company.com/api-reference",
          "title": "API Reference - Authentication",
          "cited_text": "Keys can be generated from the dashboard",
          "search_result_index": 0,
          "start_block_index": 0,
          "end_block_index": 0
        }
      ]
    },
    {
      "type": "text",
      "text": ". The rate limits are 1,000 requests per hour for the standard tier and 10,000 requests per hour for the premium tier.",
      "citations": [
        {
          "type": "search_result_location",
          "source": "https://docs.company.com/api-reference",
          "title": "API Reference - Authentication",
          "cited_text": "Rate limits: 1000 requests per hour for standard tier, 10000 for premium",
          "search_result_index": 0,
          "start_block_index": 0,
          "end_block_index": 0
        }
      ]
    }
  ]
}
```

### 引用フィールド

各引用には以下が含まれます：

| フィールド | 型 | 説明 |
|-------|------|-------------|
| `type` | string | 検索結果引用の場合は常に`"search_result_location"` |
| `source` | string | 元の検索結果からのソース |
| `title` | string or null | 元の検索結果からのタイトル |
| `cited_text` | string | 引用されている正確なテキスト |
| `search_result_index` | integer | 検索結果のインデックス（0ベース） |
| `start_block_index` | integer | コンテンツ配列内の開始位置 |
| `end_block_index` | integer | コンテンツ配列内の終了位置 |

注：`search_result_index`は、検索結果がどのように提供されたか（ツール呼び出しまたはトップレベルコンテンツ）に関わらず、検索結果コンテンツブロックのインデックス（0ベース）を指します。

## 複数のコンテンツブロック

検索結果は`content`配列に複数のテキストブロックを含めることができます：

```json
{
  "type": "search_result",
  "source": "https://docs.company.com/api-guide",
  "title": "API Documentation",
  "content": [
    {
      "type": "text",
      "text": "Authentication: All API requests require an API key."
    },
    {
      "type": "text",
      "text": "Rate Limits: The API allows 1000 requests per hour per key."
    },
    {
      "type": "text",
      "text": "Error Handling: The API returns standard HTTP status codes."
    }
  ]
}
```

Claudeは`start_block_index`と`end_block_index`フィールドを使用して特定のブロックを引用できます。

## 高度な使用方法

### 両方の方法を組み合わせる

同じ会話でツールベースとトップレベルの検索結果の両方を使用できます：

```python
# トップレベル検索結果を含む最初のメッセージ
messages = [
    MessageParam(
        role="user",
        content=[
            SearchResultBlockParam(
                type="search_result",
                source="https://docs.company.com/overview",
                title="Product Overview",
                content=[
                    TextBlockParam(type="text", text="Our product helps teams collaborate...")
                ],
                citations={"enabled": True}
            ),
            TextBlockParam(
                type="text",
                text="Tell me about this product and search for pricing information"
            )
        ]
    )
]

# Claudeが応答してツールを呼び出して価格情報を検索する可能性があります
# その後、より多くの検索結果を含むツール結果を提供します
```

### 他のコンテンツタイプと組み合わせる

両方の方法は、検索結果を他のコンテンツと混在させることをサポートしています：

```python
# ツール結果内
tool_result = [
    SearchResultBlockParam(
        type="search_result",
        source="https://docs.company.com/guide",
        title="User Guide",
        content=[TextBlockParam(type="text", text="Configuration details...")],
        citations={"enabled": True}
    ),
    TextBlockParam(
        type="text",
        text="Additional context: This applies to version 2.0 and later."
    )
]

# トップレベルコンテンツ内
user_content = [
    SearchResultBlockParam(
        type="search_result",
        source="https://research.com/paper",
        title="Research Paper",
        content=[TextBlockParam(type="text", text="Key findings...")],
        citations={"enabled": True}
    ),
    {
        "type": "image",
        "source": {"type": "url", "url": "https://example.com/chart.png"}
    },
    TextBlockParam(
        type="text",
        text="How does the chart relate to the research findings?"
    )
]
```

### キャッシュ制御

パフォーマンス向上のためにキャッシュ制御を追加します：

```json
{
  "type": "search_result",
  "source": "https://docs.company.com/guide",
  "title": "User Guide",
  "content": [{"type": "text", "text": "..."}],
  "cache_control": {
    "type": "ephemeral"
  }
}
```

### 引用制御

デフォルトでは、検索結果の引用は無効になっています。`citations`設定を明示的に設定することで引用を有効にできます：

```json
{
  "type": "search_result",
  "source": "https://docs.company.com/guide",
  "title": "User Guide",
  "content": [{"type": "text", "text": "Important documentation..."}],
  "citations": {
    "enabled": true  // この結果の引用を有効にする
  }
}
```

`citations.enabled`が`true`に設定されている場合、Claudeは検索結果から情報を使用する際に引用参照を含めます。これにより以下が可能になります：
- カスタムRAGアプリケーション向けの自然な引用
- 独自のナレッジベースとインターフェースする際のソース帰属
- 検索結果を返すカスタムツール向けのウェブサーチ品質の引用

`citations`フィールドが省略されている場合、引用はデフォルトで無効になります。

<Warning>
引用はすべてか無かです：リクエスト内のすべての検索結果が引用を有効にするか、すべてが無効にするかのいずれかです。異なる引用設定を持つ検索結果を混在させるとエラーが発生します。一部のソースの引用を無効にする必要がある場合は、そのリクエスト内のすべての検索結果の引用を無効にする必要があります。
</Warning>

## ベストプラクティス

### ツールベースの検索の場合（方法1）

- **動的コンテンツ**：リアルタイム検索と動的RAGアプリケーション用に使用
- **エラーハンドリング**：検索が失敗した場合に適切なメッセージを返す
- **結果制限**：コンテキストオーバーフローを避けるために、最も関連性の高い結果のみを返す

### トップレベル検索の場合（方法2）

- **事前取得コンテンツ**：検索結果が既にある場合に使用
- **バッチ処理**：複数の検索結果を一度に処理するのに最適
- **テスト**：既知のコンテンツで引用動作をテストするのに最適

### 一般的なベストプラクティス

1. **結果を効果的に構造化する**
   - 明確で永続的なソースURLを使用
   - 説明的なタイトルを提供
   - 長いコンテンツを論理的なテキストブロックに分割

2. **一貫性を保つ**
   - アプリケーション全体でソース形式を一貫させる
   - タイトルがコンテンツを正確に反映していることを確認
   - フォーマットを一貫させる

3. **エラーを適切に処理する**
   ```python
   def search_with_fallback(query):
       try:
           results = perform_search(query)
           if not results:
               return {"type": "text", "text": "No results found."}
           return format_as_search_results(results)
       except Exception as e:
           return {"type": "text", "text": f"Search error: {str(e)}"}
   ```

## 制限事項

- 検索結果コンテンツブロックはClaude API、Amazon Bedrock、Google CloudのVertex AIで利用可能です
- 検索結果内ではテキストコンテンツのみがサポートされています（画像やその他のメディアはサポートされていません）
- `content`配列には少なくとも1つのテキストブロックが含まれている必要があります