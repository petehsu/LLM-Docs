# ウェブフェッチツール

Claudeが指定されたウェブページとPDFドキュメントから完全なコンテンツを取得できるウェブフェッチツール

---

ウェブフェッチツールを使用すると、Claudeは指定されたウェブページとPDFドキュメントから完全なコンテンツを取得できます。

<Note>
ウェブフェッチツールは現在ベータ版です。これを有効にするには、APIリクエストでベータヘッダー `web-fetch-2025-09-10` を使用してください。

[このフォーム](https://forms.gle/NhWcgmkcvPCMmPE86)を使用して、モデルレスポンスの品質、API自体、またはドキュメントの品質に関するフィードバックを提供してください。
</Note>

<Warning>
Claudeが信頼できない入力を機密データと一緒に処理する環境でウェブフェッチツールを有効にすると、データ流出のリスクが生じます。このツールは信頼できる環境でのみ、または機密でないデータを処理する場合にのみ使用することをお勧めします。

流出リスクを最小化するために、Claudeは動的にURLを構築することはできません。Claudeは、ユーザーが明示的に提供したURL、または以前のウェブ検索またはウェブフェッチ結果から得たURLのみをフェッチできます。ただし、このツールを使用する場合は、慎重に検討すべき残存リスクがあります。

データ流出が懸念される場合は、以下を検討してください：
- ウェブフェッチツールを完全に無効にする
- `max_uses` パラメータを使用してリクエスト数を制限する
- `allowed_domains` パラメータを使用して既知の安全なドメインに制限する
</Warning>

## サポートされているモデル

ウェブフェッチは以下で利用可能です：

- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Sonnet 3.7 ([廃止予定](/docs/ja/about-claude/model-deprecations)) (`claude-3-7-sonnet-20250219`)
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)
- Claude Haiku 3.5 (`claude-3-5-haiku-latest`)
- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)

## ウェブフェッチの仕組み

APIリクエストにウェブフェッチツールを追加すると：

1. Claudeはプロンプトと利用可能なURLに基づいてコンテンツをフェッチするタイミングを決定します。
2. APIは指定されたURLから完全なテキストコンテンツを取得します。
3. PDFの場合、自動テキスト抽出が実行されます。
4. Claudeはフェッチされたコンテンツを分析し、オプションの引用付きレスポンスを提供します。

<Note>
ウェブフェッチツールは現在、Javascriptで動的にレンダリングされるウェブサイトをサポートしていません。
</Note>

## ウェブフェッチの使用方法

APIリクエストにウェブフェッチツールを提供します：

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: web-fetch-2025-09-10" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 1024,
        "messages": [
            {
                "role": "user",
                "content": "Please analyze the content at https://example.com/article"
            }
        ],
        "tools": [{
            "type": "web_fetch_20250910",
            "name": "web_fetch",
            "max_uses": 5
        }]
    }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": "Please analyze the content at https://example.com/article"
        }
    ],
    tools=[{
        "type": "web_fetch_20250910",
        "name": "web_fetch",
        "max_uses": 5
    }],
    extra_headers={
        "anthropic-beta": "web-fetch-2025-09-10"
    }
)
print(response)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

async function main() {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: "Please analyze the content at https://example.com/article"
      }
    ],
    tools: [{
      type: "web_fetch_20250910",
      name: "web_fetch",
      max_uses: 5
    }],
    headers: {
      "anthropic-beta": "web-fetch-2025-09-10"
    }
  });

  console.log(response);
}

main().catch(console.error);
```
</CodeGroup>

### ツール定義

ウェブフェッチツールは以下のパラメータをサポートしています：

```json JSON
{
  "type": "web_fetch_20250910",
  "name": "web_fetch",

  // オプション：リクエストごとのフェッチ数を制限
  "max_uses": 10,

  // オプション：これらのドメインからのみフェッチ
  "allowed_domains": ["example.com", "docs.example.com"],

  // オプション：これらのドメインからはフェッチしない
  "blocked_domains": ["private.example.com"],

  // オプション：フェッチされたコンテンツの引用を有効にする
  "citations": {
    "enabled": true
  },

  // オプション：最大コンテンツ長（トークン単位）
  "max_content_tokens": 100000
}
```

#### Max uses

`max_uses` パラメータは実行されるウェブフェッチの数を制限します。Claudeが許可されたフェッチ数を超えてフェッチしようとした場合、`web_fetch_tool_result` は `max_uses_exceeded` エラーコードを含むエラーになります。現在、デフォルト制限はありません。

#### ドメインフィルタリング

ドメインフィルタを使用する場合：

- ドメインにはHTTP/HTTPSスキームを含めないでください（`https://example.com` の代わりに `example.com` を使用）
- サブドメインは自動的に含まれます（`example.com` は `docs.example.com` をカバー）
- サブパスがサポートされています（`example.com/blog`）
- 同じリクエストで `allowed_domains` または `blocked_domains` のいずれかを使用できますが、両方は使用できません。

<Warning>
ドメイン名のUnicode文字は、異なるスクリプトの視覚的に類似した文字がドメインフィルタをバイパスできるホモグラフ攻撃を通じてセキュリティの脆弱性を生じさせる可能性があることに注意してください。たとえば、`аmazon.com`（キリル文字の「а」を使用）は `amazon.com` と同じに見えるかもしれませんが、異なるドメインを表します。

ドメイン許可/ブロックリストを設定する場合：
- 可能な限りASCIIのみのドメイン名を使用してください
- URLパーサーがUnicode正規化を異なる方法で処理する可能性があることを考慮してください
- 潜在的なホモグラフバリエーションでドメインフィルタをテストしてください
- 疑わしいUnicode文字がないかドメイン設定を定期的に監査してください
</Warning>

#### コンテンツ制限

`max_content_tokens` パラメータは、コンテキストに含まれるコンテンツの量を制限します。フェッチされたコンテンツがこの制限を超える場合、切り詰められます。これは大きなドキュメントをフェッチする場合のトークン使用量を制御するのに役立ちます。

<Note>
`max_content_tokens` パラメータ制限は概算です。実際に使用される入力トークン数は少量変動する可能性があります。
</Note>

#### 引用

ウェブ検索では引用が常に有効になっていますが、ウェブフェッチでは引用はオプションです。`"citations": {"enabled": true}` を設定して、Claudeがフェッチされたドキュメントから特定の段落を引用できるようにします。

<Note>
APIの出力をエンドユーザーに直接表示する場合、元のソースへの引用を含める必要があります。APIの出力を修正する場合（再処理や独自のマテリアルとの組み合わせを含む）、エンドユーザーに表示する前に、法務チームとの相談に基づいて適切に引用を表示してください。
</Note>

### レスポンス

レスポンス構造の例を次に示します：

```json
{
  "role": "assistant",
  "content": [
    // 1. Claudeのフェッチ決定
    {
      "type": "text",
      "text": "I'll fetch the content from the article to analyze it."
    },
    // 2. フェッチリクエスト
    {
      "type": "server_tool_use",
      "id": "srvtoolu_01234567890abcdef",
      "name": "web_fetch",
      "input": {
        "url": "https://example.com/article"
      }
    },
    // 3. フェッチ結果
    {
      "type": "web_fetch_tool_result",
      "tool_use_id": "srvtoolu_01234567890abcdef",
      "content": {
        "type": "web_fetch_result",
        "url": "https://example.com/article",
        "content": {
          "type": "document",
          "source": {
            "type": "text",
            "media_type": "text/plain",
            "data": "Full text content of the article..."
          },
          "title": "Article Title",
          "citations": {"enabled": true}
        },
        "retrieved_at": "2025-08-25T10:30:00Z"
      }
    },
    // 4. Claudeの分析（引用が有効な場合）
    {
      "text": "Based on the article, ",
      "type": "text"
    },
    {
      "text": "the main argument presented is that artificial intelligence will transform healthcare",
      "type": "text",
      "citations": [
        {
          "type": "char_location",
          "document_index": 0,
          "document_title": "Article Title",
          "start_char_index": 1234,
          "end_char_index": 1456,
          "cited_text": "Artificial intelligence is poised to revolutionize healthcare delivery..."
        }
      ]
    }
  ],
  "id": "msg_a930390d3a",
  "usage": {
    "input_tokens": 25039,
    "output_tokens": 931,
    "server_tool_use": {
      "web_fetch_requests": 1
    }
  },
  "stop_reason": "end_turn"
}
```

#### フェッチ結果

フェッチ結果には以下が含まれます：

- `url`：フェッチされたURL
- `content`：フェッチされたコンテンツを含むドキュメントブロック
- `retrieved_at`：コンテンツが取得されたときのタイムスタンプ

<Note>
ウェブフェッチツールは結果をキャッシュして、パフォーマンスを向上させ、冗長なリクエストを削減します。これは、返されるコンテンツが常にURLで利用可能な最新バージョンであるとは限らないことを意味します。キャッシュ動作は自動的に管理され、異なるコンテンツタイプと使用パターンに対して最適化するために時間とともに変わる可能性があります。
</Note>

PDFドキュメントの場合、コンテンツはBase64エンコードされたデータとして返されます：

```json
{
  "type": "web_fetch_tool_result",
  "tool_use_id": "srvtoolu_02",
  "content": {
    "type": "web_fetch_result",
    "url": "https://example.com/paper.pdf",
    "content": {
      "type": "document",
      "source": {
        "type": "base64",
        "media_type": "application/pdf",
        "data": "JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmo..."
      },
      "citations": {"enabled": true}
    },
    "retrieved_at": "2025-08-25T10:30:02Z"
  }
}
```

#### エラー

ウェブフェッチツールがエラーに遭遇すると、Claude APIは200（成功）レスポンスを返し、エラーはレスポンス本体で表現されます：

```json
{
  "type": "web_fetch_tool_result",
  "tool_use_id": "srvtoolu_a93jad",
  "content": {
    "type": "web_fetch_tool_error",
    "error_code": "url_not_accessible"
  }
}
```

これらは可能なエラーコードです：

- `invalid_input`：無効なURL形式
- `url_too_long`：URLが最大長（250文字）を超えている
- `url_not_allowed`：ドメインフィルタリングルールとモデル制限によってURLがブロックされている
- `url_not_accessible`：コンテンツのフェッチに失敗した（HTTPエラー）
- `too_many_requests`：レート制限を超えている
- `unsupported_content_type`：サポートされていないコンテンツタイプ（テキストとPDFのみ）
- `max_uses_exceeded`：ウェブフェッチツールの最大使用回数を超えている
- `unavailable`：内部エラーが発生した

## URL検証

セキュリティ上の理由から、ウェブフェッチツールは会話コンテキストに以前表示されたURLのみをフェッチできます。これには以下が含まれます：

- ユーザーメッセージ内のURL
- クライアント側ツール結果内のURL
- 以前のウェブ検索またはウェブフェッチ結果からのURL

このツールは、Claudeが生成した任意のURLや、コンテナベースのサーバーツール（コード実行、Bashなど）からのURLをフェッチできません。

## 検索とフェッチの組み合わせ

ウェブフェッチはウェブ検索とシームレスに連携して、包括的な情報収集を実現します：

```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Find recent articles about quantum computing and analyze the most relevant one in detail"
        }
    ],
    tools=[
        {
            "type": "web_search_20250305",
            "name": "web_search",
            "max_uses": 3
        },
        {
            "type": "web_fetch_20250910",
            "name": "web_fetch",
            "max_uses": 5,
            "citations": {"enabled": True}
        }
    ],
    extra_headers={
        "anthropic-beta": "web-fetch-2025-09-10"
    }
)
```

このワークフローでは、Claudeは以下を実行します：
1. ウェブ検索を使用して関連記事を検索する
2. 最も有望な結果を選択する
3. ウェブフェッチを使用して完全なコンテンツを取得する
4. 引用付きで詳細な分析を提供する

## プロンプトキャッシング

ウェブフェッチは[プロンプトキャッシング](/docs/ja/build-with-claude/prompt-caching)と連携します。プロンプトキャッシングを有効にするには、リクエストに `cache_control` ブレークポイントを追加します。キャッシュされたフェッチ結果は、会話ターン全体で再利用できます。

```python
import anthropic

client = anthropic.Anthropic()

# ウェブフェッチを使用した最初のリクエスト
messages = [
    {
        "role": "user",
        "content": "Analyze this research paper: https://arxiv.org/abs/2024.12345"
    }
]

response1 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=messages,
    tools=[{
        "type": "web_fetch_20250910",
        "name": "web_fetch"
    }],
    extra_headers={
        "anthropic-beta": "web-fetch-2025-09-10"
    }
)

# Claudeのレスポンスを会話に追加
messages.append({
    "role": "assistant",
    "content": response1.content
})

# キャッシュブレークポイント付きの2番目のリクエスト
messages.append({
    "role": "user",
    "content": "What methodology does the paper use?",
    "cache_control": {"type": "ephemeral"}
})

response2 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=messages,
    tools=[{
        "type": "web_fetch_20250910",
        "name": "web_fetch"
    }],
    extra_headers={
        "anthropic-beta": "web-fetch-2025-09-10"
    }
)

# 2番目のレスポンスはキャッシュされたフェッチ結果から利益を得ます
print(f"Cache read tokens: {response2.usage.get('cache_read_input_tokens', 0)}")
```

## ストリーミング

ストリーミングが有効な場合、フェッチイベントはストリームの一部であり、コンテンツ取得中に一時停止します：

```javascript
event: message_start
data: {"type": "message_start", "message": {"id": "msg_abc123", "type": "message"}}

event: content_block_start
data: {"type": "content_block_start", "index": 0, "content_block": {"type": "text", "text": ""}}

// Claudeのフェッチ決定

event: content_block_start
data: {"type": "content_block_start", "index": 1, "content_block": {"type": "server_tool_use", "id": "srvtoolu_xyz789", "name": "web_fetch"}}

// フェッチURLがストリーム
event: content_block_delta
data: {"type": "content_block_delta", "index": 1, "delta": {"type": "input_json_delta", "partial_json": "{\"url\":\"https://example.com/article\"}"}}

// フェッチ実行中に一時停止

// フェッチ結果がストリーム
event: content_block_start
data: {"type": "content_block_start", "index": 2, "content_block": {"type": "web_fetch_tool_result", "tool_use_id": "srvtoolu_xyz789", "content": {"type": "web_fetch_result", "url": "https://example.com/article", "content": {"type": "document", "source": {"type": "text", "media_type": "text/plain", "data": "Article content..."}}}}}

// Claudeのレスポンスが続く...
```

## バッチリクエスト

[メッセージバッチAPI](/docs/ja/build-with-claude/batch-processing)にウェブフェッチツールを含めることができます。メッセージバッチAPIを通じたウェブフェッチツール呼び出しは、通常のメッセージAPIリクエストと同じ価格です。

## 使用量と価格

Web fetch usage has **no additional charges** beyond standard token costs:

```json
"usage": {
  "input_tokens": 25039,
  "output_tokens": 931,
  "cache_read_input_tokens": 0,
  "cache_creation_input_tokens": 0,
  "server_tool_use": {
    "web_fetch_requests": 1
  }
}
```

The web fetch tool is available on the Claude API at **no additional cost**. You only pay standard token costs for the fetched content that becomes part of your conversation context.

To protect against inadvertently fetching large content that would consume excessive tokens, use the `max_content_tokens` parameter to set appropriate limits based on your use case and budget considerations.

Example token usage for typical content:
- Average web page (10KB): ~2,500 tokens
- Large documentation page (100KB): ~25,000 tokens  
- Research paper PDF (500KB): ~125,000 tokens