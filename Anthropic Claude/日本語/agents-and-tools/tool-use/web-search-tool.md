# ウェブ検索ツール

Claude にリアルタイムのウェブコンテンツへの直接アクセスを提供し、知識カットオフを超えた最新情報で質問に答えることができます。

---

ウェブ検索ツールは Claude にリアルタイムのウェブコンテンツへの直接アクセスを提供し、知識カットオフを超えた最新情報で質問に答えることができます。Claude は自動的に検索結果からソースを引用して回答の一部として提示します。

<Note>
ウェブ検索ツールの使用体験についてのご意見は、[フィードバックフォーム](https://forms.gle/sWjBtsrNEY2oKGuE8)からお聞かせください。
</Note>

## サポートされているモデル

ウェブ検索は以下で利用可能です：

- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Sonnet 3.7 ([非推奨](/docs/ja/about-claude/model-deprecations)) (`claude-3-7-sonnet-20250219`)
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)
- Claude Haiku 3.5 (`claude-3-5-haiku-latest`)
- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)

## ウェブ検索の仕組み

API リクエストにウェブ検索ツールを追加すると：

1. Claude はプロンプトに基づいて検索するかどうかを判断します。
2. API は検索を実行し、Claude に結果を提供します。このプロセスは単一のリクエスト内で複数回繰り返される場合があります。
3. ターンの終わりに、Claude は引用されたソースを含む最終的な回答を提供します。

## ウェブ検索の使用方法

<Note>
組織の管理者が [Console](/settings/privacy) でウェブ検索を有効にする必要があります。
</Note>

API リクエストにウェブ検索ツールを提供します：

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 1024,
        "messages": [
            {
                "role": "user",
                "content": "What is the weather in NYC?"
            }
        ],
        "tools": [{
            "type": "web_search_20250305",
            "name": "web_search",
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
            "content": "What's the weather in NYC?"
        }
    ],
    tools=[{
        "type": "web_search_20250305",
        "name": "web_search",
        "max_uses": 5
    }]
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
        content: "What's the weather in NYC?"
      }
    ],
    tools: [{
      type: "web_search_20250305",
      name: "web_search",
      max_uses: 5
    }]
  });

  console.log(response);
}

main().catch(console.error);
```
</CodeGroup>

### ツール定義

ウェブ検索ツールは以下のパラメータをサポートしています：

```json JSON
{
  "type": "web_search_20250305",
  "name": "web_search",

  // オプション：リクエストごとの検索数を制限
  "max_uses": 5,

  // オプション：これらのドメインからの結果のみを含める
  "allowed_domains": ["example.com", "trusteddomain.org"],

  // オプション：これらのドメインからの結果を除外
  "blocked_domains": ["untrustedsource.com"],

  // オプション：検索結果をローカライズ
  "user_location": {
    "type": "approximate",
    "city": "San Francisco",
    "region": "California",
    "country": "US",
    "timezone": "America/Los_Angeles"
  }
}
```

#### Max uses

`max_uses` パラメータは実行される検索数を制限します。Claude が許可された数を超える検索を試みた場合、`web_search_tool_result` は `max_uses_exceeded` エラーコードを含むエラーになります。

#### ドメインフィルタリング

ドメインフィルタを使用する場合：

- ドメインには HTTP/HTTPS スキームを含めないでください（`https://example.com` ではなく `example.com` を使用）
- サブドメインは自動的に含まれます（`example.com` は `docs.example.com` をカバー）
- 特定のサブドメインは結果をそのサブドメインのみに制限します（`docs.example.com` は `example.com` または `api.example.com` からではなく、そのサブドメインからのみ結果を返す）
- サブパスはサポートされており、パスの後のすべてにマッチします（`example.com/blog` は `example.com/blog/post-1` にマッチ）
- `allowed_domains` または `blocked_domains` のいずれかを使用できますが、同じリクエストで両方を使用することはできません。

**ワイルドカードサポート：**

- ドメインエントリごとに 1 つのワイルドカード（`*`）のみが許可され、ドメイン部分の後（パス内）に表示される必要があります
- 有効：`example.com/*`、`example.com/*/articles`
- 無効：`*.example.com`、`ex*.com`、`example.com/*/news/*`

無効なドメイン形式は `invalid_tool_input` ツールエラーを返します。

<Note>
リクエストレベルのドメイン制限は、Console で設定された組織レベルのドメイン制限と互換性がある必要があります。リクエストレベルのドメインは、組織レベルのリストを超えてドメインをさらに制限することのみができ、オーバーライドまたは拡張することはできません。リクエストに組織設定と競合するドメインが含まれている場合、API は検証エラーを返します。
</Note>

#### ローカライゼーション

`user_location` パラメータを使用すると、ユーザーの位置情報に基づいて検索結果をローカライズできます。

- `type`：位置情報のタイプ（`approximate` である必要があります）
- `city`：都市名
- `region`：地域または州
- `country`：国
- `timezone`：[IANA タイムゾーン ID](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)。

### レスポンス

以下は応答構造の例です：

```json
{
  "role": "assistant",
  "content": [
    // 1. Claude の検索決定
    {
      "type": "text",
      "text": "I'll search for when Claude Shannon was born."
    },
    // 2. 使用された検索クエリ
    {
      "type": "server_tool_use",
      "id": "srvtoolu_01WYG3ziw53XMcoyKL4XcZmE",
      "name": "web_search",
      "input": {
        "query": "claude shannon birth date"
      }
    },
    // 3. 検索結果
    {
      "type": "web_search_tool_result",
      "tool_use_id": "srvtoolu_01WYG3ziw53XMcoyKL4XcZmE",
      "content": [
        {
          "type": "web_search_result",
          "url": "https://en.wikipedia.org/wiki/Claude_Shannon",
          "title": "Claude Shannon - Wikipedia",
          "encrypted_content": "EqgfCioIARgBIiQ3YTAwMjY1Mi1mZjM5LTQ1NGUtODgxNC1kNjNjNTk1ZWI3Y...",
          "page_age": "April 30, 2025"
        }
      ]
    },
    {
      "text": "Based on the search results, ",
      "type": "text"
    },
    // 4. 引用を含む Claude の回答
    {
      "text": "Claude Shannon was born on April 30, 1916, in Petoskey, Michigan",
      "type": "text",
      "citations": [
        {
          "type": "web_search_result_location",
          "url": "https://en.wikipedia.org/wiki/Claude_Shannon",
          "title": "Claude Shannon - Wikipedia",
          "encrypted_index": "Eo8BCioIAhgBIiQyYjQ0OWJmZi1lNm..",
          "cited_text": "Claude Elwood Shannon (April 30, 1916 – February 24, 2001) was an American mathematician, electrical engineer, computer scientist, cryptographer and i..."
        }
      ]
    }
  ],
  "id": "msg_a930390d3a",
  "usage": {
    "input_tokens": 6039,
    "output_tokens": 931,
    "server_tool_use": {
      "web_search_requests": 1
    }
  },
  "stop_reason": "end_turn"
}
```

#### 検索結果

検索結果には以下が含まれます：

- `url`：ソースページの URL
- `title`：ソースページのタイトル
- `page_age`：サイトが最後に更新された時期
- `encrypted_content`：マルチターン会話で引用のために返す必要がある暗号化されたコンテンツ

#### 引用

引用はウェブ検索に対して常に有効であり、各 `web_search_result_location` には以下が含まれます：

- `url`：引用されたソースの URL
- `title`：引用されたソースのタイトル
- `encrypted_index`：マルチターン会話で返す必要がある参照。
- `cited_text`：引用されたコンテンツの最大 150 文字

ウェブ検索引用フィールド `cited_text`、`title`、および `url` は入力または出力トークン使用量にカウントされません。

<Note>
API 出力をエンドユーザーに直接表示する場合、元のソースへの引用を含める必要があります。API 出力を修正する場合（再処理や独自のマテリアルとの組み合わせを含む）、法務チームとの相談に基づいて適切に引用を表示してください。
</Note>

#### エラー

ウェブ検索ツールがエラーに遭遇した場合（レート制限に達した場合など）、Claude API は依然として 200（成功）レスポンスを返します。エラーは以下の構造を使用してレスポンス本体内で表現されます：

```json
{
  "type": "web_search_tool_result",
  "tool_use_id": "servertoolu_a93jad",
  "content": {
    "type": "web_search_tool_result_error",
    "error_code": "max_uses_exceeded"
  }
}
```

これらは可能なエラーコードです：

- `too_many_requests`：レート制限超過
- `invalid_input`：無効な検索クエリパラメータ
- `max_uses_exceeded`：ウェブ検索ツール使用数超過
- `query_too_long`：クエリが最大長を超過
- `unavailable`：内部エラーが発生

#### `pause_turn` ストップ理由

レスポンスに `pause_turn` ストップ理由が含まれる場合があります。これは API が長時間実行されているターンを一時停止したことを示します。レスポンスをそのまま後続のリクエストで提供して Claude にターンを続行させるか、会話を中断したい場合はコンテンツを修正できます。

## プロンプトキャッシング

ウェブ検索は[プロンプトキャッシング](/docs/ja/build-with-claude/prompt-caching)で機能します。プロンプトキャッシングを有効にするには、リクエストに少なくとも 1 つの `cache_control` ブレークポイントを追加します。システムはツール実行時に最後の `web_search_tool_result` ブロックまで自動的にキャッシュします。

マルチターン会話の場合、最後の `web_search_tool_result` ブロック上またはその後に `cache_control` ブレークポイントを設定して、キャッシュされたコンテンツを再利用します。

たとえば、マルチターン会話でウェブ検索を使用してプロンプトキャッシングを使用するには：

<CodeGroup>
```python
import anthropic

client = anthropic.Anthropic()

# ウェブ検索とキャッシュブレークポイント付きの最初のリクエスト
messages = [
    {
        "role": "user",
        "content": "What's the current weather in San Francisco today?"
    }
]

response1 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=messages,
    tools=[{
        "type": "web_search_20250305",
        "name": "web_search",
        "user_location": {
            "type": "approximate",
            "city": "San Francisco",
            "region": "California",
            "country": "US",
            "timezone": "America/Los_Angeles"
        }
    }]
)

# Claude のレスポンスを会話に追加
messages.append({
    "role": "assistant",
    "content": response1.content
})

# 検索結果の後のキャッシュブレークポイント付きの 2 番目のリクエスト
messages.append({
    "role": "user",
    "content": "Should I expect rain later this week?",
    "cache_control": {"type": "ephemeral"}  # この時点までキャッシュ
})

response2 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=messages,
    tools=[{
        "type": "web_search_20250305",
        "name": "web_search",
        "user_location": {
            "type": "approximate",
            "city": "San Francisco",
            "region": "California",
            "country": "US",
            "timezone": "America/Los_Angeles"
        }
    }]
)
# 2 番目のレスポンスはキャッシュされた検索結果の恩恵を受けます
# 必要に応じて新しい検索を実行できます
print(f"Cache read tokens: {response2.usage.get('cache_read_input_tokens', 0)}")
```

</CodeGroup>

## ストリーミング

ストリーミングが有効な場合、ストリームの一部として検索イベントを受け取ります。検索実行中に一時停止があります：

```javascript
event: message_start
data: {"type": "message_start", "message": {"id": "msg_abc123", "type": "message"}}

event: content_block_start
data: {"type": "content_block_start", "index": 0, "content_block": {"type": "text", "text": ""}}

// Claude の検索決定

event: content_block_start
data: {"type": "content_block_start", "index": 1, "content_block": {"type": "server_tool_use", "id": "srvtoolu_xyz789", "name": "web_search"}}

// 検索クエリがストリーム
event: content_block_delta
data: {"type": "content_block_delta", "index": 1, "delta": {"type": "input_json_delta", "partial_json": "{\"query\":\"latest quantum computing breakthroughs 2025\"}"}}

// 検索実行中に一時停止

// 検索結果がストリーム
event: content_block_start
data: {"type": "content_block_start", "index": 2, "content_block": {"type": "web_search_tool_result", "tool_use_id": "srvtoolu_xyz789", "content": [{"type": "web_search_result", "title": "Quantum Computing Breakthroughs in 2025", "url": "https://example.com"}]}}

// 引用を含む Claude のレスポンス（この例では省略）
```

## バッチリクエスト

[Messages Batches API](/docs/ja/build-with-claude/batch-processing) にウェブ検索ツールを含めることができます。Messages Batches API を通じたウェブ検索ツール呼び出しは、通常の Messages API リクエストと同じ価格です。

## 使用量と価格

Web search usage is charged in addition to token usage:

```json
"usage": {
  "input_tokens": 105,
  "output_tokens": 6039,
  "cache_read_input_tokens": 7123,
  "cache_creation_input_tokens": 7345,
  "server_tool_use": {
    "web_search_requests": 1
  }
}
```

Web search is available on the Claude API for **$10 per 1,000 searches**, plus standard token costs for search-generated content. Web search results retrieved throughout a conversation are counted as input tokens, in search iterations executed during a single turn and in subsequent conversation turns.

Each web search counts as one use, regardless of the number of results returned. If an error occurs during web search, the web search will not be billed.