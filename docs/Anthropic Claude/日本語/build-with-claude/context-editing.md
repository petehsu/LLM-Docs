# コンテキスト編集

会話コンテキストが増加するにつれて、コンテキスト編集を使用して自動的に管理します。

---

## 概要

コンテキスト編集を使用すると、会話コンテキストが増加するにつれて自動的に管理でき、コストを最適化し、コンテキストウィンドウの制限内に留まるのに役立ちます。サーバー側のAPI戦略、クライアント側のSDK機能、またはその両方を一緒に使用できます。

| アプローチ | 実行場所 | 戦略 | 動作方法 |
|----------|---------|------|--------|
| **サーバー側** | API | ツール結果のクリア (`clear_tool_uses_20250919`)<br/>思考ブロックのクリア (`clear_thinking_20251015`) | プロンプトがClaudeに到達する前に適用されます。会話履歴から特定のコンテンツをクリアします。各戦略は独立して設定できます。 |
| **クライアント側** | SDK | コンパクション | [`tool_runner`](/docs/ja/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta)を使用する場合、[Python および TypeScript SDK](/docs/ja/api/client-sdks)で利用可能です。サマリーを生成し、完全な会話履歴を置き換えます。以下の[コンパクション](#client-side-compaction-sdk)を参照してください。 |

## 概要

コンテキスト編集を使用すると、会話コンテキストが増加するにつれて自動的に管理でき、コストを最適化し、コンテキストウィンドウの制限内に留まるのに役立ちます。サーバー側のAPI戦略、クライアント側のSDK機能、またはその両方を一緒に使用できます。

| アプローチ | 実行場所 | 戦略 | 動作方法 |
|----------|---------|------|--------|
| **サーバー側** | API | ツール結果のクリア (`clear_tool_uses_20250919`)<br/>思考ブロックのクリア (`clear_thinking_20251015`) | プロンプトがClaudeに到達する前に適用されます。会話履歴から特定のコンテンツをクリアします。各戦略は独立して設定できます。 |
| **クライアント側** | SDK | コンパクション | [`tool_runner`](/docs/ja/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta)を使用する場合、[Python および TypeScript SDK](/docs/ja/api/client-sdks)で利用可能です。サマリーを生成し、完全な会話履歴を置き換えます。以下の[コンパクション](#client-side-compaction-sdk)を参照してください。 |

## サーバー側の戦略

<Note>
コンテキスト編集は現在ベータ版で、ツール結果のクリアと思考ブロックのクリアがサポートされています。これを有効にするには、APIリクエストでベータヘッダー `context-management-2025-06-27` を使用してください。

このフィーチャーに関するフィードバックは、[フィードバックフォーム](https://forms.gle/YXC2EKGMhjN1c4L88)を通じてお知らせください。
</Note>

## 概要

コンテキスト編集を使用すると、会話コンテキストが増加するにつれて自動的に管理でき、コストを最適化し、コンテキストウィンドウの制限内に留まるのに役立ちます。サーバー側のAPI戦略、クライアント側のSDK機能、またはその両方を一緒に使用できます。

| アプローチ | 実行場所 | 戦略 | 動作方法 |
|----------|---------|------|--------|
| **サーバー側** | API | ツール結果のクリア (`clear_tool_uses_20250919`)<br/>思考ブロックのクリア (`clear_thinking_20251015`) | プロンプトがClaudeに到達する前に適用されます。会話履歴から特定のコンテンツをクリアします。各戦略は独立して設定できます。 |
| **クライアント側** | SDK | コンパクション | [`tool_runner`](/docs/ja/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta)を使用する場合、[Python および TypeScript SDK](/docs/ja/api/client-sdks)で利用可能です。サマリーを生成し、完全な会話履歴を置き換えます。以下の[コンパクション](#client-side-compaction-sdk)を参照してください。 |

## サーバー側の戦略

<Note>
コンテキスト編集は現在ベータ版で、ツール結果のクリアと思考ブロックのクリアがサポートされています。これを有効にするには、APIリクエストでベータヘッダー `context-management-2025-06-27` を使用してください。

このフィーチャーに関するフィードバックは、[フィードバックフォーム](https://forms.gle/YXC2EKGMhjN1c4L88)を通じてお知らせください。
</Note>

### ツール結果のクリア

`clear_tool_uses_20250919` 戦略は、会話コンテキストが設定されたしきい値を超えて増加したときにツール結果をクリアします。有効化されると、APIは自動的に時系列順に最も古いツール結果をクリアし、ツール結果が削除されたことをClaudeに知らせるプレースホルダーテキストで置き換えます。デフォルトでは、ツール結果のみがクリアされます。`clear_tool_inputs` を true に設定することで、ツール結果とツール呼び出し（ツール使用パラメータ）の両方をクリアすることもできます。

## 概要

コンテキスト編集を使用すると、会話コンテキストが増加するにつれて自動的に管理でき、コストを最適化し、コンテキストウィンドウの制限内に留まるのに役立ちます。サーバー側のAPI戦略、クライアント側のSDK機能、またはその両方を一緒に使用できます。

| アプローチ | 実行場所 | 戦略 | 動作方法 |
|----------|---------|------|--------|
| **サーバー側** | API | ツール結果のクリア (`clear_tool_uses_20250919`)<br/>思考ブロックのクリア (`clear_thinking_20251015`) | プロンプトがClaudeに到達する前に適用されます。会話履歴から特定のコンテンツをクリアします。各戦略は独立して設定できます。 |
| **クライアント側** | SDK | コンパクション | [`tool_runner`](/docs/ja/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta)を使用する場合、[Python および TypeScript SDK](/docs/ja/api/client-sdks)で利用可能です。サマリーを生成し、完全な会話履歴を置き換えます。以下の[コンパクション](#client-side-compaction-sdk)を参照してください。 |

## サーバー側の戦略

<Note>
コンテキスト編集は現在ベータ版で、ツール結果のクリアと思考ブロックのクリアがサポートされています。これを有効にするには、APIリクエストでベータヘッダー `context-management-2025-06-27` を使用してください。

このフィーチャーに関するフィードバックは、[フィードバックフォーム](https://forms.gle/YXC2EKGMhjN1c4L88)を通じてお知らせください。
</Note>

### ツール結果のクリア

`clear_tool_uses_20250919` 戦略は、会話コンテキストが設定されたしきい値を超えて増加したときにツール結果をクリアします。有効化されると、APIは自動的に時系列順に最も古いツール結果をクリアし、ツール結果が削除されたことをClaudeに知らせるプレースホルダーテキストで置き換えます。デフォルトでは、ツール結果のみがクリアされます。`clear_tool_inputs` を true に設定することで、ツール結果とツール呼び出し（ツール使用パラメータ）の両方をクリアすることもできます。

### 思考ブロックのクリア

`clear_thinking_20251015` 戦略は、拡張思考が有効な場合、会話内の `thinking` ブロックを管理します。この戦略は、前のターンから古い思考ブロックを自動的にクリアします。

<Tip>
**デフォルト動作**: 拡張思考が有効で `clear_thinking_20251015` 戦略を設定しない場合、APIは自動的に最後のアシスタントターンからの思考ブロックのみを保持します（`keep: {type: "thinking_turns", value: 1}` と同等）。

キャッシュヒットを最大化するには、`keep: "all"` を設定してすべての思考ブロックを保持します。
</Tip>

<Note>
アシスタント会話ターンには複数のコンテンツブロック（例：ツール使用時）と複数の思考ブロック（例：[インターリーブ思考](/docs/ja/build-with-claude/extended-thinking#interleaved-thinking)を使用する場合）が含まれる場合があります。
</Note>

<Tip>
**コンテキスト編集はサーバー側で実行されます**

コンテキスト編集はプロンプトがClaudeに到達する前に**サーバー側**で適用されます。クライアントアプリケーションは完全で未修正の会話履歴を保持します。編集されたバージョンとクライアント状態を同期する必要はありません。通常通りローカルで完全な会話履歴を管理し続けてください。
</Tip>

<Tip>
**コンテキスト編集とプロンプトキャッシング**

コンテキスト編集と[プロンプトキャッシング](/docs/ja/build-with-claude/prompt-caching)の相互作用は戦略によって異なります：

- **ツール結果のクリア**: コンテンツがクリアされるとキャッシュされたプロンプトプレフィックスが無効化されます。これに対応するために、キャッシュ無効化を価値のあるものにするために十分なトークンをクリアすることをお勧めします。`clear_at_least` パラメータを使用して、毎回クリアされるトークンの最小数を確保します。コンテンツがクリアされるたびにキャッシュ書き込みコストが発生しますが、その後のリクエストは新しくキャッシュされたプレフィックスを再利用できます。

- **思考ブロックのクリア**: 思考ブロックがコンテキストに**保持**されている場合（クリアされていない場合）、プロンプトキャッシュが保持され、キャッシュヒットが有効になり、入力トークンコストが削減されます。思考ブロックが**クリア**される場合、キャッシュはクリアが発生する時点で無効化されます。キャッシュパフォーマンスまたはコンテキストウィンドウの可用性を優先するかに基づいて `keep` パラメータを設定します。
</Tip>

## 概要

コンテキスト編集を使用すると、会話コンテキストが増加するにつれて自動的に管理でき、コストを最適化し、コンテキストウィンドウの制限内に留まるのに役立ちます。サーバー側のAPI戦略、クライアント側のSDK機能、またはその両方を一緒に使用できます。

| アプローチ | 実行場所 | 戦略 | 動作方法 |
|----------|---------|------|--------|
| **サーバー側** | API | ツール結果のクリア (`clear_tool_uses_20250919`)<br/>思考ブロックのクリア (`clear_thinking_20251015`) | プロンプトがClaudeに到達する前に適用されます。会話履歴から特定のコンテンツをクリアします。各戦略は独立して設定できます。 |
| **クライアント側** | SDK | コンパクション | [`tool_runner`](/docs/ja/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta)を使用する場合、[Python および TypeScript SDK](/docs/ja/api/client-sdks)で利用可能です。サマリーを生成し、完全な会話履歴を置き換えます。以下の[コンパクション](#client-side-compaction-sdk)を参照してください。 |

## サーバー側の戦略

<Note>
コンテキスト編集は現在ベータ版で、ツール結果のクリアと思考ブロックのクリアがサポートされています。これを有効にするには、APIリクエストでベータヘッダー `context-management-2025-06-27` を使用してください。

このフィーチャーに関するフィードバックは、[フィードバックフォーム](https://forms.gle/YXC2EKGMhjN1c4L88)を通じてお知らせください。
</Note>

### ツール結果のクリア

`clear_tool_uses_20250919` 戦略は、会話コンテキストが設定されたしきい値を超えて増加したときにツール結果をクリアします。有効化されると、APIは自動的に時系列順に最も古いツール結果をクリアし、ツール結果が削除されたことをClaudeに知らせるプレースホルダーテキストで置き換えます。デフォルトでは、ツール結果のみがクリアされます。`clear_tool_inputs` を true に設定することで、ツール結果とツール呼び出し（ツール使用パラメータ）の両方をクリアすることもできます。

### 思考ブロックのクリア

`clear_thinking_20251015` 戦略は、拡張思考が有効な場合、会話内の `thinking` ブロックを管理します。この戦略は、前のターンから古い思考ブロックを自動的にクリアします。

<Tip>
**デフォルト動作**: 拡張思考が有効で `clear_thinking_20251015` 戦略を設定しない場合、APIは自動的に最後のアシスタントターンからの思考ブロックのみを保持します（`keep: {type: "thinking_turns", value: 1}` と同等）。

キャッシュヒットを最大化するには、`keep: "all"` を設定してすべての思考ブロックを保持します。
</Tip>

<Note>
アシスタント会話ターンには複数のコンテンツブロック（例：ツール使用時）と複数の思考ブロック（例：[インターリーブ思考](/docs/ja/build-with-claude/extended-thinking#interleaved-thinking)を使用する場合）が含まれる場合があります。
</Note>

<Tip>
**コンテキスト編集はサーバー側で実行されます**

コンテキスト編集はプロンプトがClaudeに到達する前に**サーバー側**で適用されます。クライアントアプリケーションは完全で未修正の会話履歴を保持します。編集されたバージョンとクライアント状態を同期する必要はありません。通常通りローカルで完全な会話履歴を管理し続けてください。
</Tip>

<Tip>
**コンテキスト編集とプロンプトキャッシング**

コンテキスト編集と[プロンプトキャッシング](/docs/ja/build-with-claude/prompt-caching)の相互作用は戦略によって異なります：

- **ツール結果のクリア**: コンテンツがクリアされるとキャッシュされたプロンプトプレフィックスが無効化されます。これに対応するために、キャッシュ無効化を価値のあるものにするために十分なトークンをクリアすることをお勧めします。`clear_at_least` パラメータを使用して、毎回クリアされるトークンの最小数を確保します。コンテンツがクリアされるたびにキャッシュ書き込みコストが発生しますが、その後のリクエストは新しくキャッシュされたプレフィックスを再利用できます。

- **思考ブロックのクリア**: 思考ブロックがコンテキストに**保持**されている場合（クリアされていない場合）、プロンプトキャッシュが保持され、キャッシュヒットが有効になり、入力トークンコストが削減されます。思考ブロックが**クリア**される場合、キャッシュはクリアが発生する時点で無効化されます。キャッシュパフォーマンスまたはコンテキストウィンドウの可用性を優先するかに基づいて `keep` パラメータを設定します。
</Tip>

## サポートされているモデル

コンテキスト編集は以下で利用可能です：

- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)
- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)

## 概要

コンテキスト編集を使用すると、会話コンテキストが増加するにつれて自動的に管理でき、コストを最適化し、コンテキストウィンドウの制限内に留まるのに役立ちます。サーバー側のAPI戦略、クライアント側のSDK機能、またはその両方を一緒に使用できます。

| アプローチ | 実行場所 | 戦略 | 動作方法 |
|----------|---------|------|--------|
| **サーバー側** | API | ツール結果のクリア (`clear_tool_uses_20250919`)<br/>思考ブロックのクリア (`clear_thinking_20251015`) | プロンプトがClaudeに到達する前に適用されます。会話履歴から特定のコンテンツをクリアします。各戦略は独立して設定できます。 |
| **クライアント側** | SDK | コンパクション | [`tool_runner`](/docs/ja/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta)を使用する場合、[Python および TypeScript SDK](/docs/ja/api/client-sdks)で利用可能です。サマリーを生成し、完全な会話履歴を置き換えます。以下の[コンパクション](#client-side-compaction-sdk)を参照してください。 |

## サーバー側の戦略

<Note>
コンテキスト編集は現在ベータ版で、ツール結果のクリアと思考ブロックのクリアがサポートされています。これを有効にするには、APIリクエストでベータヘッダー `context-management-2025-06-27` を使用してください。

このフィーチャーに関するフィードバックは、[フィードバックフォーム](https://forms.gle/YXC2EKGMhjN1c4L88)を通じてお知らせください。
</Note>

### ツール結果のクリア

`clear_tool_uses_20250919` 戦略は、会話コンテキストが設定されたしきい値を超えて増加したときにツール結果をクリアします。有効化されると、APIは自動的に時系列順に最も古いツール結果をクリアし、ツール結果が削除されたことをClaudeに知らせるプレースホルダーテキストで置き換えます。デフォルトでは、ツール結果のみがクリアされます。`clear_tool_inputs` を true に設定することで、ツール結果とツール呼び出し（ツール使用パラメータ）の両方をクリアすることもできます。

### 思考ブロックのクリア

`clear_thinking_20251015` 戦略は、拡張思考が有効な場合、会話内の `thinking` ブロックを管理します。この戦略は、前のターンから古い思考ブロックを自動的にクリアします。

<Tip>
**デフォルト動作**: 拡張思考が有効で `clear_thinking_20251015` 戦略を設定しない場合、APIは自動的に最後のアシスタントターンからの思考ブロックのみを保持します（`keep: {type: "thinking_turns", value: 1}` と同等）。

キャッシュヒットを最大化するには、`keep: "all"` を設定してすべての思考ブロックを保持します。
</Tip>

<Note>
アシスタント会話ターンには複数のコンテンツブロック（例：ツール使用時）と複数の思考ブロック（例：[インターリーブ思考](/docs/ja/build-with-claude/extended-thinking#interleaved-thinking)を使用する場合）が含まれる場合があります。
</Note>

<Tip>
**コンテキスト編集はサーバー側で実行されます**

コンテキスト編集はプロンプトがClaudeに到達する前に**サーバー側**で適用されます。クライアントアプリケーションは完全で未修正の会話履歴を保持します。編集されたバージョンとクライアント状態を同期する必要はありません。通常通りローカルで完全な会話履歴を管理し続けてください。
</Tip>

<Tip>
**コンテキスト編集とプロンプトキャッシング**

コンテキスト編集と[プロンプトキャッシング](/docs/ja/build-with-claude/prompt-caching)の相互作用は戦略によって異なります：

- **ツール結果のクリア**: コンテンツがクリアされるとキャッシュされたプロンプトプレフィックスが無効化されます。これに対応するために、キャッシュ無効化を価値のあるものにするために十分なトークンをクリアすることをお勧めします。`clear_at_least` パラメータを使用して、毎回クリアされるトークンの最小数を確保します。コンテンツがクリアされるたびにキャッシュ書き込みコストが発生しますが、その後のリクエストは新しくキャッシュされたプレフィックスを再利用できます。

- **思考ブロックのクリア**: 思考ブロックがコンテキストに**保持**されている場合（クリアされていない場合）、プロンプトキャッシュが保持され、キャッシュヒットが有効になり、入力トークンコストが削減されます。思考ブロックが**クリア**される場合、キャッシュはクリアが発生する時点で無効化されます。キャッシュパフォーマンスまたはコンテキストウィンドウの可用性を優先するかに基づいて `keep` パラメータを設定します。
</Tip>

## ツール結果のクリア使用方法

ツール結果のクリアを有効にする最も簡単な方法は、戦略タイプのみを指定することです。他のすべての[設定オプション](#configuration-options-for-tool-result-clearing)はデフォルト値を使用します：

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": "Search for recent developments in AI"
            }
        ],
        "tools": [
            {
                "type": "web_search_20250305",
                "name": "web_search"
            }
        ],
        "context_management": {
            "edits": [
                {"type": "clear_tool_uses_20250919"}
            ]
        }
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Search for recent developments in AI"
        }
    ],
    tools=[
        {
            "type": "web_search_20250305",
            "name": "web_search"
        }
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {"type": "clear_tool_uses_20250919"}
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [
    {
      role: "user",
      content: "Search for recent developments in AI"
    }
  ],
  tools: [
    {
      type: "web_search_20250305",
      name: "web_search"
    }
  ],
  context_management: {
    edits: [
      { type: "clear_tool_uses_20250919" }
    ]
  },
  betas: ["context-management-2025-06-27"]
});
```

</CodeGroup>

## 概要

コンテキスト編集を使用すると、会話コンテキストが増加するにつれて自動的に管理でき、コストを最適化し、コンテキストウィンドウの制限内に留まるのに役立ちます。サーバー側のAPI戦略、クライアント側のSDK機能、またはその両方を一緒に使用できます。

| アプローチ | 実行場所 | 戦略 | 動作方法 |
|----------|---------|------|--------|
| **サーバー側** | API | ツール結果のクリア (`clear_tool_uses_20250919`)<br/>思考ブロックのクリア (`clear_thinking_20251015`) | プロンプトがClaudeに到達する前に適用されます。会話履歴から特定のコンテンツをクリアします。各戦略は独立して設定できます。 |
| **クライアント側** | SDK | コンパクション | [`tool_runner`](/docs/ja/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta)を使用する場合、[Python および TypeScript SDK](/docs/ja/api/client-sdks)で利用可能です。サマリーを生成し、完全な会話履歴を置き換えます。以下の[コンパクション](#client-side-compaction-sdk)を参照してください。 |

## サーバー側の戦略

<Note>
コンテキスト編集は現在ベータ版で、ツール結果のクリアと思考ブロックのクリアがサポートされています。これを有効にするには、APIリクエストでベータヘッダー `context-management-2025-06-27` を使用してください。

このフィーチャーに関するフィードバックは、[フィードバックフォーム](https://forms.gle/YXC2EKGMhjN1c4L88)を通じてお知らせください。
</Note>

### ツール結果のクリア

`clear_tool_uses_20250919` 戦略は、会話コンテキストが設定されたしきい値を超えて増加したときにツール結果をクリアします。有効化されると、APIは自動的に時系列順に最も古いツール結果をクリアし、ツール結果が削除されたことをClaudeに知らせるプレースホルダーテキストで置き換えます。デフォルトでは、ツール結果のみがクリアされます。`clear_tool_inputs` を true に設定することで、ツール結果とツール呼び出し（ツール使用パラメータ）の両方をクリアすることもできます。

### 思考ブロックのクリア

`clear_thinking_20251015` 戦略は、拡張思考が有効な場合、会話内の `thinking` ブロックを管理します。この戦略は、前のターンから古い思考ブロックを自動的にクリアします。

<Tip>
**デフォルト動作**: 拡張思考が有効で `clear_thinking_20251015` 戦略を設定しない場合、APIは自動的に最後のアシスタントターンからの思考ブロックのみを保持します（`keep: {type: "thinking_turns", value: 1}` と同等）。

キャッシュヒットを最大化するには、`keep: "all"` を設定してすべての思考ブロックを保持します。
</Tip>

<Note>
アシスタント会話ターンには複数のコンテンツブロック（例：ツール使用時）と複数の思考ブロック（例：[インターリーブ思考](/docs/ja/build-with-claude/extended-thinking#interleaved-thinking)を使用する場合）が含まれる場合があります。
</Note>

<Tip>
**コンテキスト編集はサーバー側で実行されます**

コンテキスト編集はプロンプトがClaudeに到達する前に**サーバー側**で適用されます。クライアントアプリケーションは完全で未修正の会話履歴を保持します。編集されたバージョンとクライアント状態を同期する必要はありません。通常通りローカルで完全な会話履歴を管理し続けてください。
</Tip>

<Tip>
**コンテキスト編集とプロンプトキャッシング**

コンテキスト編集と[プロンプトキャッシング](/docs/ja/build-with-claude/prompt-caching)の相互作用は戦略によって異なります：

- **ツール結果のクリア**: コンテンツがクリアされるとキャッシュされたプロンプトプレフィックスが無効化されます。これに対応するために、キャッシュ無効化を価値のあるものにするために十分なトークンをクリアすることをお勧めします。`clear_at_least` パラメータを使用して、毎回クリアされるトークンの最小数を確保します。コンテンツがクリアされるたびにキャッシュ書き込みコストが発生しますが、その後のリクエストは新しくキャッシュされたプレフィックスを再利用できます。

- **思考ブロックのクリア**: 思考ブロックがコンテキストに**保持**されている場合（クリアされていない場合）、プロンプトキャッシュが保持され、キャッシュヒットが有効になり、入力トークンコストが削減されます。思考ブロックが**クリア**される場合、キャッシュはクリアが発生する時点で無効化されます。キャッシュパフォーマンスまたはコンテキストウィンドウの可用性を優先するかに基づいて `keep` パラメータを設定します。
</Tip>

## サポートされているモデル

コンテキスト編集は以下で利用可能です：

- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)
- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)

## ツール結果のクリア使用方法

ツール結果のクリアを有効にする最も簡単な方法は、戦略タイプのみを指定することです。他のすべての[設定オプション](#configuration-options-for-tool-result-clearing)はデフォルト値を使用します：

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": "Search for recent developments in AI"
            }
        ],
        "tools": [
            {
                "type": "web_search_20250305",
                "name": "web_search"
            }
        ],
        "context_management": {
            "edits": [
                {"type": "clear_tool_uses_20250919"}
            ]
        }
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Search for recent developments in AI"
        }
    ],
    tools=[
        {
            "type": "web_search_20250305",
            "name": "web_search"
        }
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {"type": "clear_tool_uses_20250919"}
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [
    {
      role: "user",
      content: "Search for recent developments in AI"
    }
  ],
  tools: [
    {
      type: "web_search_20250305",
      name: "web_search"
    }
  ],
  context_management: {
    edits: [
      { type: "clear_tool_uses_20250919" }
    ]
  },
  betas: ["context-management-2025-06-27"]
});
```

</CodeGroup>

### 高度な設定

ツール結果のクリア動作を追加のパラメータでカスタマイズできます：

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": "Create a simple command line calculator app using Python"
            }
        ],
        "tools": [
            {
                "type": "text_editor_20250728",
                "name": "str_replace_based_edit_tool",
                "max_characters": 10000
            },
            {
                "type": "web_search_20250305",
                "name": "web_search",
                "max_uses": 3
            }
        ],
        "context_management": {
            "edits": [
                {
                    "type": "clear_tool_uses_20250919",
                    "trigger": {
                        "type": "input_tokens",
                        "value": 30000
                    },
                    "keep": {
                        "type": "tool_uses",
                        "value": 3
                    },
                    "clear_at_least": {
                        "type": "input_tokens",
                        "value": 5000
                    },
                    "exclude_tools": ["web_search"]
                }
            ]
        }
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Create a simple command line calculator app using Python"
        }
    ],
    tools=[
        {
            "type": "text_editor_20250728",
            "name": "str_replace_based_edit_tool",
            "max_characters": 10000
        },
        {
            "type": "web_search_20250305",
            "name": "web_search",
            "max_uses": 3
        }
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_tool_uses_20250919",
                # しきい値を超えたときにクリアをトリガー
                "trigger": {
                    "type": "input_tokens",
                    "value": 30000
                },
                # クリア後に保持するツール使用の数
                "keep": {
                    "type": "tool_uses",
                    "value": 3
                },
                # オプション：少なくともこの数のトークンをクリア
                "clear_at_least": {
                    "type": "input_tokens",
                    "value": 5000
                },
                # クリアから除外するツール
                "exclude_tools": ["web_search"]
            }
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [
    {
      role: "user",
      content: "Create a simple command line calculator app using Python"
    }
  ],
  tools: [
    {
      type: "text_editor_20250728",
      name: "str_replace_based_edit_tool",
      max_characters: 10000
    },
    {
      type: "web_search_20250305",
      name: "web_search",
      max_uses: 3
    }
  ],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_tool_uses_20250919",
        // しきい値を超えたときにクリアをトリガー
        trigger: {
          type: "input_tokens",
          value: 30000
        },
        // クリア後に保持するツール使用の数
        keep: {
          type: "tool_uses",
          value: 3
        },
        // オプション：少なくともこの数のトークンをクリア
        clear_at_least: {
          type: "input_tokens",
          value: 5000
        },
        // クリアから除外するツール
        exclude_tools: ["web_search"]
      }
    ]
  }
});
```

</CodeGroup>

## 概要

コンテキスト編集により、会話コンテキストが増加するにつれて自動的に管理でき、コストを最適化し、コンテキストウィンドウの制限内に留まるのに役立ちます。サーバー側のAPI戦略、クライアント側のSDK機能、またはその両方を組み合わせて使用できます。

| アプローチ | 実行場所 | 戦略 | 動作方法 |
|----------|---------|------|--------|
| **サーバー側** | API | ツール結果のクリア (`clear_tool_uses_20250919`)<br/>思考ブロックのクリア (`clear_thinking_20251015`) | プロンプトがClaudeに到達する前に適用されます。会話履歴から特定のコンテンツをクリアします。各戦略は独立して設定できます。 |
| **クライアント側** | SDK | 圧縮 | [`tool_runner`](/docs/ja/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta)を使用する場合、[Python および TypeScript SDK](/docs/ja/api/client-sdks)で利用可能です。要約を生成し、完全な会話履歴を置き換えます。以下の[圧縮](#client-side-compaction-sdk)を参照してください。 |

## サーバー側の戦略

<Note>
コンテキスト編集は現在ベータ版で、ツール結果のクリアと思考ブロックのクリアをサポートしています。これを有効にするには、APIリクエストでベータヘッダー `context-management-2025-06-27` を使用してください。

このフィーチャーに関するフィードバックは、[フィードバックフォーム](https://forms.gle/YXC2EKGMhjN1c4L88)を通じてお知らせください。
</Note>

### ツール結果のクリア

`clear_tool_uses_20250919` 戦略は、会話コンテキストが設定されたしきい値を超えて増加したときにツール結果をクリアします。有効化されると、APIは自動的に時系列順に最も古いツール結果をクリアし、ツール結果が削除されたことをClaudeに知らせるためのプレースホルダーテキストで置き換えます。デフォルトでは、ツール結果のみがクリアされます。`clear_tool_inputs` を true に設定することで、ツール結果とツール呼び出し（ツール使用パラメータ）の両方をクリアすることもできます。

### 思考ブロックのクリア

`clear_thinking_20251015` 戦略は、拡張思考が有効な場合に会話内の `thinking` ブロックを管理します。この戦略は、前のターンから古い思考ブロックを自動的にクリアします。

<Tip>
**デフォルト動作**: 拡張思考が有効で `clear_thinking_20251015` 戦略を設定しない場合、APIは自動的に最後のアシスタントターンからの思考ブロックのみを保持します（`keep: {type: "thinking_turns", value: 1}` と同等）。

キャッシュヒットを最大化するには、`keep: "all"` を設定してすべての思考ブロックを保持します。
</Tip>

<Note>
アシスタント会話ターンには複数のコンテンツブロック（例：ツール使用時）と複数の思考ブロック（例：[インターリーブ思考](/docs/ja/build-with-claude/extended-thinking#interleaved-thinking)を使用する場合）が含まれる場合があります。
</Note>

<Tip>
**コンテキスト編集はサーバー側で実行されます**

コンテキスト編集はプロンプトがClaudeに到達する前に**サーバー側**で適用されます。クライアントアプリケーションは完全で未修正の会話履歴を保持します。編集されたバージョンとクライアント状態を同期する必要はありません。通常通りローカルで完全な会話履歴を管理し続けてください。
</Tip>

<Tip>
**コンテキスト編集とプロンプトキャッシング**

コンテキスト編集と[プロンプトキャッシング](/docs/ja/build-with-claude/prompt-caching)の相互作用は戦略によって異なります：

- **ツール結果のクリア**: コンテンツがクリアされるとキャッシュされたプロンプトプレフィックスが無効化されます。これに対応するために、キャッシュ無効化を価値あるものにするために十分なトークンをクリアすることをお勧めします。`clear_at_least` パラメータを使用して、毎回クリアされるトークンの最小数を確保します。コンテンツがクリアされるたびにキャッシュ書き込みコストが発生しますが、その後のリクエストは新しくキャッシュされたプレフィックスを再利用できます。

- **思考ブロックのクリア**: 思考ブロックがコンテキストに**保持**されている（クリアされていない）場合、プロンプトキャッシュは保持され、キャッシュヒットが有効になり、入力トークンコストが削減されます。思考ブロックが**クリア**される場合、キャッシュはクリアが発生する時点で無効化されます。キャッシュパフォーマンスとコンテキストウィンドウの可用性のどちらを優先するかに基づいて `keep` パラメータを設定します。
</Tip>

## サポートされているモデル

コンテキスト編集は以下で利用可能です：

- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)
- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)

## ツール結果のクリア使用方法

ツール結果のクリアを有効にする最も簡単な方法は、戦略タイプのみを指定することです。他のすべての[設定オプション](#configuration-options-for-tool-result-clearing)はデフォルト値を使用します：

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": "Search for recent developments in AI"
            }
        ],
        "tools": [
            {
                "type": "web_search_20250305",
                "name": "web_search"
            }
        ],
        "context_management": {
            "edits": [
                {"type": "clear_tool_uses_20250919"}
            ]
        }
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Search for recent developments in AI"
        }
    ],
    tools=[
        {
            "type": "web_search_20250305",
            "name": "web_search"
        }
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {"type": "clear_tool_uses_20250919"}
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [
    {
      role: "user",
      content: "Search for recent developments in AI"
    }
  ],
  tools: [
    {
      type: "web_search_20250305",
      name: "web_search"
    }
  ],
  context_management: {
    edits: [
      { type: "clear_tool_uses_20250919" }
    ]
  },
  betas: ["context-management-2025-06-27"]
});
```

</CodeGroup>

### 高度な設定

ツール結果のクリア動作を追加パラメータでカスタマイズできます：

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": "Create a simple command line calculator app using Python"
            }
        ],
        "tools": [
            {
                "type": "text_editor_20250728",
                "name": "str_replace_based_edit_tool",
                "max_characters": 10000
            },
            {
                "type": "web_search_20250305",
                "name": "web_search",
                "max_uses": 3
            }
        ],
        "context_management": {
            "edits": [
                {
                    "type": "clear_tool_uses_20250919",
                    "trigger": {
                        "type": "input_tokens",
                        "value": 30000
                    },
                    "keep": {
                        "type": "tool_uses",
                        "value": 3
                    },
                    "clear_at_least": {
                        "type": "input_tokens",
                        "value": 5000
                    },
                    "exclude_tools": ["web_search"]
                }
            ]
        }
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Create a simple command line calculator app using Python"
        }
    ],
    tools=[
        {
            "type": "text_editor_20250728",
            "name": "str_replace_based_edit_tool",
            "max_characters": 10000
        },
        {
            "type": "web_search_20250305",
            "name": "web_search",
            "max_uses": 3
        }
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_tool_uses_20250919",
                # Trigger clearing when threshold is exceeded
                "trigger": {
                    "type": "input_tokens",
                    "value": 30000
                },
                # Number of tool uses to keep after clearing
                "keep": {
                    "type": "tool_uses",
                    "value": 3
                },
                # Optional: Clear at least this many tokens
                "clear_at_least": {
                    "type": "input_tokens",
                    "value": 5000
                },
                # Exclude these tools from being cleared
                "exclude_tools": ["web_search"]
            }
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [
    {
      role: "user",
      content: "Create a simple command line calculator app using Python"
    }
  ],
  tools: [
    {
      type: "text_editor_20250728",
      name: "str_replace_based_edit_tool",
      max_characters: 10000
    },
    {
      type: "web_search_20250305",
      name: "web_search",
      max_uses: 3
    }
  ],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_tool_uses_20250919",
        // Trigger clearing when threshold is exceeded
        trigger: {
          type: "input_tokens",
          value: 30000
        },
        // Number of tool uses to keep after clearing
        keep: {
          type: "tool_uses",
          value: 3
        },
        // Optional: Clear at least this many tokens
        clear_at_least: {
          type: "input_tokens",
          value: 5000
        },
        // Exclude these tools from being cleared
        exclude_tools: ["web_search"]
      }
    ]
  }
});
```

</CodeGroup>

## 思考ブロックのクリア使用方法

拡張思考が有効な場合、思考ブロックのクリアを有効にしてコンテキストとプロンプトキャッシングを効果的に管理します：

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5-20250929",
        "max_tokens": 1024,
        "messages": [...],
        "thinking": {
            "type": "enabled",
            "budget_tokens": 10000
        },
        "context_management": {
            "edits": [
                {
                    "type": "clear_thinking_20251015",
                    "keep": {
                        "type": "thinking_turns",
                        "value": 2
                    }
                }
            ]
        }
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[...],
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_thinking_20251015",
                "keep": {
                    "type": "thinking_turns",
                    "value": 2
                }
            }
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  messages: [...],
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_thinking_20251015",
        keep: {
          type: "thinking_turns",
          value: 2
        }
      }
    ]
  }
});
```

</CodeGroup>

### 思考ブロックのクリアの設定オプション

`clear_thinking_20251015` 戦略は以下の設定をサポートしています：

| 設定オプション | デフォルト | 説明 |
|-------------|---------|------|
| `keep` | `{type: "thinking_turns", value: 1}` | 保持する最近のアシスタントターン（思考ブロック付き）の数を定義します。最後のN個のターンを保持するには `{type: "thinking_turns", value: N}` を使用します（N > 0）。すべての思考ブロックを保持するには `"all"` を使用します。 |

**設定例：**

```json
// 最後の3つのアシスタントターンから思考ブロックを保持
{
  "type": "clear_thinking_20251015",
  "keep": {
    "type": "thinking_turns",
    "value": 3
  }
}

// すべての思考ブロックを保持（キャッシュヒットを最大化）
{
  "type": "clear_thinking_20251015",
  "keep": "all"
}
```

### 思考ブロックのクリアの設定オプション

`clear_thinking_20251015` 戦略は以下の設定をサポートしています：

| 設定オプション | デフォルト | 説明 |
|-------------|---------|------|
| `keep` | `{type: "thinking_turns", value: 1}` | 保持する最近のアシスタントターン（思考ブロック付き）の数を定義します。最後のN個のターンを保持するには `{type: "thinking_turns", value: N}` を使用します（N > 0）。すべての思考ブロックを保持するには `"all"` を使用します。 |

**設定例：**

```json
// 最後の3つのアシスタントターンから思考ブロックを保持
{
  "type": "clear_thinking_20251015",
  "keep": {
    "type": "thinking_turns",
    "value": 3
  }
}

// すべての思考ブロックを保持（キャッシュヒットを最大化）
{
  "type": "clear_thinking_20251015",
  "keep": "all"
}
```

### 戦略の組み合わせ

思考ブロックのクリアとツール結果のクリアを一緒に使用できます：

<Note>
複数の戦略を使用する場合、`clear_thinking_20251015` 戦略は `edits` 配列の最初にリストされる必要があります。
</Note>

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[...],
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    tools=[...],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_thinking_20251015",
                "keep": {
                    "type": "thinking_turns",
                    "value": 2
                }
            },
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {
                    "type": "input_tokens",
                    "value": 50000
                },
                "keep": {
                    "type": "tool_uses",
                    "value": 5
                }
            }
        ]
    }
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  messages: [...],
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  tools: [...],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_thinking_20251015",
        keep: {
          type: "thinking_turns",
          value: 2
        }
      },
      {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: 50000
        },
        keep: {
          type: "tool_uses",
          value: 5
        }
      }
    ]
  }
});
```

</CodeGroup>

### 思考ブロックのクリアの設定オプション

`clear_thinking_20251015` 戦略は以下の設定をサポートしています：

| 設定オプション | デフォルト | 説明 |
|-------------|---------|------|
| `keep` | `{type: "thinking_turns", value: 1}` | 保持する最近のアシスタントターン（思考ブロック付き）の数を定義します。最後のN個のターンを保持するには `{type: "thinking_turns", value: N}` を使用します（N > 0）。すべての思考ブロックを保持するには `"all"` を使用します。 |

**設定例：**

```json
// 最後の3つのアシスタントターンから思考ブロックを保持
{
  "type": "clear_thinking_20251015",
  "keep": {
    "type": "thinking_turns",
    "value": 3
  }
}

// すべての思考ブロックを保持（キャッシュヒットを最大化）
{
  "type": "clear_thinking_20251015",
  "keep": "all"
}
```

### 戦略の組み合わせ

思考ブロックのクリアとツール結果のクリアを一緒に使用できます：

<Note>
複数の戦略を使用する場合、`clear_thinking_20251015` 戦略は `edits` 配列の最初にリストされる必要があります。
</Note>

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[...],
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    tools=[...],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_thinking_20251015",
                "keep": {
                    "type": "thinking_turns",
                    "value": 2
                }
            },
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {
                    "type": "input_tokens",
                    "value": 50000
                },
                "keep": {
                    "type": "tool_uses",
                    "value": 5
                }
            }
        ]
    }
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  messages: [...],
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  tools: [...],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_thinking_20251015",
        keep: {
          type: "thinking_turns",
          value: 2
        }
      },
      {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: 50000
        },
        keep: {
          type: "tool_uses",
          value: 5
        }
      }
    ]
  }
});
```

</CodeGroup>

## ツール結果のクリアの設定オプション

| 設定オプション | デフォルト | 説明 |
|-------------|---------|------|
| `trigger` | 100,000入力トークン | コンテキスト編集戦略がいつ有効になるかを定義します。プロンプトがこのしきい値を超えると、クリアが開始されます。この値は `input_tokens` または `tool_uses` で指定できます。 |
| `keep` | 3ツール使用 | クリアが発生した後に保持する最近のツール使用/結果ペアの数を定義します。APIは最も古いツール相互作用を最初に削除し、最新のものを保持します。 |
| `clear_at_least` | なし | 戦略が有効になるたびにクリアされるトークンの最小数を確保します。APIが指定された量以上をクリアできない場合、戦略は適用されません。これはプロンプトキャッシュを破る価値があるかどうかを判断するのに役立ちます。 |
| `exclude_tools` | なし | ツール使用と結果がクリアされるべきではないツール名のリスト。重要なコンテキストを保持するのに役立ちます。 |
| `clear_tool_inputs` | `false` | ツール呼び出しパラメータをツール結果と一緒にクリアするかどうかを制御します。デフォルトでは、ツール結果のみがクリアされ、Claudeの元のツール呼び出しは表示されたままです。 |

### 思考ブロックのクリアの設定オプション

`clear_thinking_20251015` 戦略は以下の設定をサポートしています：

| 設定オプション | デフォルト | 説明 |
|-------------|---------|------|
| `keep` | `{type: "thinking_turns", value: 1}` | 保持する最近のアシスタントターン（思考ブロック付き）の数を定義します。最後のN個のターンを保持するには `{type: "thinking_turns", value: N}` を使用します（N > 0）。すべての思考ブロックを保持するには `"all"` を使用します。 |

**設定例：**

```json
// 最後の3つのアシスタントターンから思考ブロックを保持
{
  "type": "clear_thinking_20251015",
  "keep": {
    "type": "thinking_turns",
    "value": 3
  }
}

// すべての思考ブロックを保持（キャッシュヒットを最大化）
{
  "type": "clear_thinking_20251015",
  "keep": "all"
}
```

### 戦略の組み合わせ

思考ブロックのクリアとツール結果のクリアを一緒に使用できます：

<Note>
複数の戦略を使用する場合、`clear_thinking_20251015` 戦略は `edits` 配列の最初にリストされる必要があります。
</Note>

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[...],
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    tools=[...],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_thinking_20251015",
                "keep": {
                    "type": "thinking_turns",
                    "value": 2
                }
            },
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {
                    "type": "input_tokens",
                    "value": 50000
                },
                "keep": {
                    "type": "tool_uses",
                    "value": 5
                }
            }
        ]
    }
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  messages: [...],
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  tools: [...],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_thinking_20251015",
        keep: {
          type: "thinking_turns",
          value: 2
        }
      },
      {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: 50000
        },
        keep: {
          type: "tool_uses",
          value: 5
        }
      }
    ]
  }
});
```

</CodeGroup>

## ツール結果のクリアの設定オプション

| 設定オプション | デフォルト | 説明 |
|-------------|---------|------|
| `trigger` | 100,000入力トークン | コンテキスト編集戦略がいつ有効になるかを定義します。プロンプトがこのしきい値を超えると、クリアが開始されます。この値は `input_tokens` または `tool_uses` で指定できます。 |
| `keep` | 3ツール使用 | クリアが発生した後に保持する最近のツール使用/結果ペアの数を定義します。APIは最も古いツール相互作用を最初に削除し、最新のものを保持します。 |
| `clear_at_least` | なし | 戦略が有効になるたびにクリアされるトークンの最小数を確保します。APIが指定された量以上をクリアできない場合、戦略は適用されません。これはプロンプトキャッシュを破る価値があるかどうかを判断するのに役立ちます。 |
| `exclude_tools` | なし | ツール使用と結果がクリアされるべきではないツール名のリスト。重要なコンテキストを保持するのに役立ちます。 |
| `clear_tool_inputs` | `false` | ツール呼び出しパラメータをツール結果と一緒にクリアするかどうかを制御します。デフォルトでは、ツール結果のみがクリアされ、Claudeの元のツール呼び出しは表示されたままです。 |

## コンテキスト編集レスポンス

`context_management` レスポンスフィールドを使用して、リクエストに適用されたコンテキスト編集と、クリアされたコンテンツと入力トークンに関する有用な統計情報を確認できます。

```json Response
{
    "id": "msg_013Zva2CMHLNnXjNJJKqJ2EF",
    "type": "message",
    "role": "assistant",
    "content": [...],
    "usage": {...},
    "context_management": {
        "applied_edits": [
            // `clear_thinking_20251015` を使用する場合
            {
                "type": "clear_thinking_20251015",
                "cleared_thinking_turns": 3,
                "cleared_input_tokens": 15000
            },
            // `clear_tool_uses_20250919` を使用する場合
            {
                "type": "clear_tool_uses_20250919",
                "cleared_tool_uses": 8,
                "cleared_input_tokens": 50000
            }
        ]
    }
}
```

ストリーミングレスポンスの場合、コンテキスト編集は最終的な `message_delta` イベントに含まれます：

```json Streaming Response
{
    "type": "message_delta",
    "delta": {
        "stop_reason": "end_turn",
        "stop_sequence": null
    },
    "usage": {
        "output_tokens": 1024
    },
    "context_management": {
        "applied_edits": [...]
    }
}
```

### シンキングブロッククリアリングの設定オプション

`clear_thinking_20251015` ストラテジーは、以下の設定をサポートしています:

| 設定オプション | デフォルト | 説明 |
|---------------------|---------|-------------|
| `keep` | `{type: "thinking_turns", value: 1}` | 保持するシンキングブロック付きの最近のアシスタントターンの数を定義します。`{type: "thinking_turns", value: N}` を使用します。ここで N は > 0 である必要があり、最後の N ターンを保持するか、すべてのシンキングブロックを保持する場合は `"all"` を使用します。 |

**設定例:**

```json
// 最後の 3 つのアシスタントターンからシンキングブロックを保持
{
  "type": "clear_thinking_20251015",
  "keep": {
    "type": "thinking_turns",
    "value": 3
  }
}

// すべてのシンキングブロックを保持（キャッシュヒットを最大化）
{
  "type": "clear_thinking_20251015",
  "keep": "all"
}
```

### ストラテジーの組み合わせ

シンキングブロッククリアリングとツール結果クリアリングを一緒に使用できます:

<Note>
複数のストラテジーを使用する場合、`clear_thinking_20251015` ストラテジーは `edits` 配列の最初にリストされている必要があります。
</Note>

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[...],
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    tools=[...],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_thinking_20251015",
                "keep": {
                    "type": "thinking_turns",
                    "value": 2
                }
            },
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {
                    "type": "input_tokens",
                    "value": 50000
                },
                "keep": {
                    "type": "tool_uses",
                    "value": 5
                }
            }
        ]
    }
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  messages: [...],
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  tools: [...],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_thinking_20251015",
        keep: {
          type: "thinking_turns",
          value: 2
        }
      },
      {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: 50000
        },
        keep: {
          type: "tool_uses",
          value: 5
        }
      }
    ]
  }
});
```

</CodeGroup>

## ツール結果クリアリングの設定オプション

| 設定オプション | デフォルト | 説明 |
|---------------------|---------|-------------|
| `trigger` | 100,000 入力トークン | コンテキスト編集ストラテジーがいつアクティブになるかを定義します。プロンプトがこのしきい値を超えると、クリアリングが開始されます。この値は `input_tokens` または `tool_uses` で指定できます。 |
| `keep` | 3 ツール使用 | クリアリング後に保持する最近のツール使用/結果ペアの数を定義します。API は最も古いツール相互作用を最初に削除し、最も最近のものを保持します。 |
| `clear_at_least` | なし | ストラテジーがアクティブになるたびにクリアされる最小トークン数を確保します。API が指定された量以上をクリアできない場合、ストラテジーは適用されません。これにより、コンテキストクリアリングがプロンプトキャッシュを破壊する価値があるかどうかを判断するのに役立ちます。 |
| `exclude_tools` | なし | ツール使用と結果がクリアされるべきではないツール名のリスト。重要なコンテキストを保持するのに役立ちます。 |
| `clear_tool_inputs` | `false` | ツール結果と一緒にツール呼び出しパラメータをクリアするかどうかを制御します。デフォルトでは、Claude の元のツール呼び出しを表示したまま、ツール結果のみがクリアされます。 |

## コンテキスト編集レスポンス

`context_management` レスポンスフィールドを使用して、リクエストに適用されたコンテキスト編集と、クリアされたコンテンツと入力トークンに関する有用な統計を確認できます。

```json Response
{
    "id": "msg_013Zva2CMHLNnXjNJJKqJ2EF",
    "type": "message",
    "role": "assistant",
    "content": [...],
    "usage": {...},
    "context_management": {
        "applied_edits": [
            // `clear_thinking_20251015` を使用する場合
            {
                "type": "clear_thinking_20251015",
                "cleared_thinking_turns": 3,
                "cleared_input_tokens": 15000
            },
            // `clear_tool_uses_20250919` を使用する場合
            {
                "type": "clear_tool_uses_20250919",
                "cleared_tool_uses": 8,
                "cleared_input_tokens": 50000
            }
        ]
    }
}
```

ストリーミングレスポンスの場合、コンテキスト編集は最終的な `message_delta` イベントに含まれます:

```json Streaming Response
{
    "type": "message_delta",
    "delta": {
        "stop_reason": "end_turn",
        "stop_sequence": null
    },
    "usage": {
        "output_tokens": 1024
    },
    "context_management": {
        "applied_edits": [...]
    }
}
```

## トークンカウント

[トークンカウント](/docs/ja/build-with-claude/token-counting)エンドポイントはコンテキスト管理をサポートしており、コンテキスト編集が適用された後、プロンプトが使用するトークン数をプレビューできます。

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages/count_tokens \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "messages": [
            {
                "role": "user",
                "content": "Continue our conversation..."
            }
        ],
        "tools": [...],
        "context_management": {
            "edits": [
                {
                    "type": "clear_tool_uses_20250919",
                    "trigger": {
                        "type": "input_tokens",
                        "value": 30000
                    },
                    "keep": {
                        "type": "tool_uses",
                        "value": 5
                    }
                }
            ]
        }
    }'
```

```python Python
response = client.beta.messages.count_tokens(
    model="claude-sonnet-4-5",
    messages=[
        {
            "role": "user",
            "content": "Continue our conversation..."
        }
    ],
    tools=[...],  # Your tool definitions
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {
                    "type": "input_tokens",
                    "value": 30000
                },
                "keep": {
                    "type": "tool_uses",
                    "value": 5
                }
            }
        ]
    }
)

print(f"Original tokens: {response.context_management['original_input_tokens']}")
print(f"After clearing: {response.input_tokens}")
print(f"Savings: {response.context_management['original_input_tokens'] - response.input_tokens} tokens")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.countTokens({
  model: "claude-sonnet-4-5",
  messages: [
    {
      role: "user",
      content: "Continue our conversation..."
    }
  ],
  tools: [...],  // Your tool definitions
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: 30000
        },
        keep: {
          type: "tool_uses",
          value: 5
        }
      }
    ]
  }
});

console.log(`Original tokens: ${response.context_management?.original_input_tokens}`);
console.log(`After clearing: ${response.input_tokens}`);
console.log(`Savings: ${(response.context_management?.original_input_tokens || 0) - response.input_tokens} tokens`);
```
</CodeGroup>

```json Response
{
    "input_tokens": 25000,
    "context_management": {
        "original_input_tokens": 70000
    }
}
```

レスポンスは、コンテキスト管理が適用された後の最終的なトークンカウント (`input_tokens`) と、クリアリングが発生する前の元のトークンカウント (`original_input_tokens`) の両方を表示します。

## メモリツールとの使用

コンテキスト編集は[メモリツール](/docs/ja/agents-and-tools/tool-use/memory-tool)と組み合わせることができます。会話コンテキストが設定されたクリアリングしきい値に近づくと、Claude は重要な情報を保持するための自動警告を受け取ります。これにより、Claude は会話履歴からクリアされる前に、ツール結果またはコンテキストをメモリファイルに保存できます。

この組み合わせにより、以下が可能になります:

- **重要なコンテキストを保持**: Claude は、ツール結果がクリアされる前に、ツール結果から重要な情報をメモリファイルに書き込むことができます
- **長時間実行されるワークフローを維持**: 情報を永続的なストレージにオフロードすることで、そうでなければコンテキスト制限を超えるエージェントワークフローを有効にします
- **オンデマンドで情報にアクセス**: Claude は、すべてをアクティブなコンテキストウィンドウに保持するのではなく、必要に応じてメモリファイルから以前にクリアされた情報を検索できます

たとえば、Claude が多くの操作を実行するファイル編集ワークフローでは、コンテキストが増加するにつれて、Claude は完了した変更をメモリファイルに要約できます。ツール結果がクリアされると、Claude はメモリシステムを通じてその情報へのアクセスを保持し、効果的に作業を続けることができます。

両方の機能を一緒に使用するには、API リクエストで有効にします:

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[...],
    tools=[
        {
            "type": "memory_20250818",
            "name": "memory"
        },
        # Your other tools
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {"type": "clear_tool_uses_20250919"}
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [...],
  tools: [
    {
      type: "memory_20250818",
      name: "memory"
    },
    // Your other tools
  ],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      { type: "clear_tool_uses_20250919" }
    ]
  }
});
```

</CodeGroup>

## クライアント側コンパクション (SDK)

<Note>
コンパクションは、[`tool_runner` メソッド](/docs/ja/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta)を使用する場合、[Python および TypeScript SDK](/docs/ja/api/client-sdks) で利用可能です。
</Note>

コンパクションは、トークン使用量が大きくなりすぎた場合に要約を生成することで、会話コンテキストを自動的に管理する SDK 機能です。コンテンツをクリアするサーバー側のコンテキスト編集ストラテジーとは異なり、コンパクションは Claude に会話履歴を要約するよう指示し、その後、完全な履歴をその要約に置き換えます。これにより、Claude は、そうでなければ[コンテキストウィンドウ](/docs/ja/build-with-claude/context-windows)を超える長時間実行されるタスクで作業を続けることができます。

### コンパクションの仕組み

コンパクションが有効になると、SDK は各モデルレスポンスの後のトークン使用量を監視します:

1. **しきい値チェック**: SDK は総トークンを `input_tokens + cache_creation_input_tokens + cache_read_input_tokens + output_tokens` として計算します
2. **要約生成**: しきい値を超えると、要約プロンプトがユーザーターンとして挿入され、Claude は `<summary></summary>` タグでラップされた構造化要約を生成します
3. **コンテキスト置換**: SDK は要約を抽出し、メッセージ履歴全体をそれに置き換えます
4. **継続**: 会話は要約から再開され、Claude は中断したところから再開します

### コンパクションの使用

`tool_runner` 呼び出しに `compaction_control` を追加します:

<CodeGroup>

```python Python
import anthropic

client = anthropic.Anthropic()

runner = client.beta.messages.tool_runner(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    tools=[...],
    messages=[
        {
            "role": "user",
            "content": "Analyze all the files in this directory and write a summary report."
        }
    ],
    compaction_control={
        "enabled": True,
        "context_token_threshold": 100000
    }
)

for message in runner:
    print(f"Tokens used: {message.usage.input_tokens}")

final = runner.until_done()
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const runner = client.beta.messages.toolRunner({
    model: 'claude-sonnet-4-5',
    max_tokens: 4096,
    tools: [...],
    messages: [
        {
            role: 'user',
            content: 'Analyze all the files in this directory and write a summary report.'
        }
    ],
    compactionControl: {
        enabled: true,
        contextTokenThreshold: 100000
    }
});

for await (const message of runner) {
    console.log('Tokens used:', message.usage.input_tokens);
}

const finalMessage = await runner.runUntilDone();
```

</CodeGroup>

#### コンパクション中に何が起こるか

会話が成長するにつれて、メッセージ履歴が蓄積されます:

**コンパクション前（100k トークンに近づいている）:**
```json
[
  { "role": "user", "content": "Analyze all files and write a report..." },
  { "role": "assistant", "content": "I'll help. Let me start by reading..." },
  { "role": "user", "content": [{ "type": "tool_result", "tool_use_id": "...", "content": "..." }] },
  { "role": "assistant", "content": "Based on file1.txt, I see..." },
  { "role": "user", "content": [{ "type": "tool_result", "tool_use_id": "...", "content": "..." }] },
  { "role": "assistant", "content": "After analyzing file2.txt..." },
  // ... 50 more exchanges like this ...
]
```

トークンがしきい値を超えると、SDK は要約リクエストを挿入し、Claude は要約を生成します。その後、メッセージ履歴全体が置き換えられます:

**コンパクション後（約 2-3k トークンに戻る）:**
```json
[
  {
    "role": "assistant",
    "content": "# Task Overview\nThe user requested analysis of directory files to produce a summary report...\n\n# Current State\nAnalyzed 52 files across 3 subdirectories. Key findings documented in report.md...\n\n# Important Discoveries\n- Configuration files use YAML format\n- Found 3 deprecated dependencies\n- Test coverage at 67%\n\n# Next Steps\n1. Analyze remaining files in /src/legacy\n2. Complete final report sections...\n\n# Context to Preserve\nUser prefers markdown format with executive summary first..."
  }
]
```

Claude は、元の会話履歴であるかのように、この要約から作業を続けます。

### 設定オプション

| パラメータ | 型 | 必須 | デフォルト | 説明 |
|-----------|------|----------|---------|-------------|
| `enabled` | boolean | はい | - | 自動コンパクションを有効にするかどうか |
| `context_token_threshold` | number | いいえ | 100,000 | コンパクションがトリガーされるトークンカウント |
| `model` | string | いいえ | メインモデルと同じ | 要約生成に使用するモデル |
| `summary_prompt` | string | いいえ | 以下を参照 | 要約生成のカスタムプロンプト |

#### トークンしきい値の選択

しきい値は、コンパクションが発生するタイミングを決定します。低いしきい値は、より小さなコンテキストウィンドウでより頻繁なコンパクションを意味します。高いしきい値はより多くのコンテキストを許可しますが、制限に達するリスクがあります。

<CodeGroup>

```python Python
# メモリ制約のあるシナリオでより頻繁なコンパクション
compaction_control={
    "enabled": True,
    "context_token_threshold": 50000
}

# より多くのコンテキストが必要な場合、コンパクションの頻度を下げる
compaction_control={
    "enabled": True,
    "context_token_threshold": 150000
}
```

```typescript TypeScript
// メモリ制約のあるシナリオでより頻繁なコンパクション
compactionControl: {
    enabled: true,
    contextTokenThreshold: 50000
}

// より多くのコンテキストが必要な場合、コンパクションの頻度を下げる
compactionControl: {
    enabled: true,
    contextTokenThreshold: 150000
}
```

</CodeGroup>

#### 要約に別のモデルを使用

要約生成に、より高速または安価なモデルを使用できます:

<CodeGroup>

```python Python
compaction_control={
    "enabled": True,
    "context_token_threshold": 100000,
    "model": "claude-haiku-4-5"
}
```

```typescript TypeScript
compactionControl: {
    enabled: true,
    contextTokenThreshold: 100000,
    model: 'claude-haiku-4-5'
}
```

</CodeGroup>

#### カスタム要約プロンプト

ドメイン固有のニーズのためにカスタムプロンプトを提供できます。プロンプトは、Claude に要約を `<summary></summary>` タグでラップするよう指示する必要があります。

<CodeGroup>

```python Python
compaction_control={
    "enabled": True,
    "context_token_threshold": 100000,
    "summary_prompt": """Summarize the research conducted so far, including:
- Sources consulted and key findings
- Questions answered and remaining unknowns
- Recommended next steps

Wrap your summary in <summary></summary> tags."""
}
```

```typescript TypeScript
compactionControl: {
    enabled: true,
    contextTokenThreshold: 100000,
    summaryPrompt: `Summarize the research conducted so far, including:
- Sources consulted and key findings
- Questions answered and remaining unknowns
- Recommended next steps

Wrap your summary in <summary></summary> tags.`
}
```

</CodeGroup>

## メモリツールとの併用

コンテキスト編集は[メモリツール](/docs/ja/agents-and-tools/tool-use/memory-tool)と組み合わせることができます。会話コンテキストが設定されたクリアしきい値に近づくと、Claudeは重要な情報を保存するための自動警告を受け取ります。これにより、Claudeはツール結果またはコンテキストを、会話履歴からクリアされる前にメモリファイルに保存できます。

この組み合わせにより、以下のことが可能になります：

- **重要なコンテキストの保存**: Claudeはツール結果から重要な情報をメモリファイルに書き込むことができ、その結果がクリアされます
- **長時間実行されるワークフローの維持**: 情報を永続的なストレージにオフロードすることで、そうでなければコンテキスト制限を超えるエージェントワークフローを有効にします
- **必要に応じた情報へのアクセス**: Claudeは、アクティブなコンテキストウィンドウにすべてを保持する代わりに、必要に応じてメモリファイルから以前クリアされた情報を検索できます

例えば、Claudeが多くの操作を実行するファイル編集ワークフローでは、Claudeはコンテキストが増加するにつれて完了した変更をメモリファイルに要約できます。ツール結果がクリアされると、Claudeはメモリシステムを通じてその情報へのアクセスを保持し、効果的に作業を続けることができます。

両方の機能を一緒に使用するには、APIリクエストで有効にします：

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[...],
    tools=[
        {
            "type": "memory_20250818",
            "name": "memory"
        },
        # Your other tools
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {"type": "clear_tool_uses_20250919"}
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [...],
  tools: [
    {
      type: "memory_20250818",
      name: "memory"
    },
    // Your other tools
  ],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      { type: "clear_tool_uses_20250919" }
    ]
  }
});
```

</CodeGroup>

## クライアント側の圧縮（SDK）

<Note>
圧縮は、[`tool_runner`メソッド](/docs/ja/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta)を使用する場合、[PythonおよびTypeScript SDK](/docs/ja/api/client-sdks)で利用可能です。
</Note>

圧縮はSDK機能で、トークン使用量が大きくなりすぎた場合に要約を生成することで、会話コンテキストを自動的に管理します。コンテンツをクリアするサーバー側のコンテキスト編集戦略とは異なり、圧縮はClaudeに会話履歴を要約するよう指示し、その後、完全な履歴をその要約に置き換えます。これにより、Claudeは[コンテキストウィンドウ](/docs/ja/build-with-claude/context-windows)を超えるような長時間実行されるタスクで作業を続けることができます。

### 圧縮の仕組み

圧縮が有効になると、SDKは各モデル応答後のトークン使用量を監視します：

1. **しきい値チェック**: SDKは合計トークンを`input_tokens + cache_creation_input_tokens + cache_read_input_tokens + output_tokens`として計算します
2. **要約生成**: しきい値を超えると、要約プロンプトがユーザーターンとして挿入され、Claudeは`<summary></summary>`タグでラップされた構造化要約を生成します
3. **コンテキスト置換**: SDKは要約を抽出し、メッセージ履歴全体をそれに置き換えます
4. **継続**: 会話は要約から再開され、Claudeは中断したところから再開します

### 圧縮の使用

`tool_runner`呼び出しに`compaction_control`を追加します：

<CodeGroup>

```python Python
import anthropic

client = anthropic.Anthropic()

runner = client.beta.messages.tool_runner(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    tools=[...],
    messages=[
        {
            "role": "user",
            "content": "Analyze all the files in this directory and write a summary report."
        }
    ],
    compaction_control={
        "enabled": True,
        "context_token_threshold": 100000
    }
)

for message in runner:
    print(f"Tokens used: {message.usage.input_tokens}")

final = runner.until_done()
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const runner = client.beta.messages.toolRunner({
    model: 'claude-sonnet-4-5',
    max_tokens: 4096,
    tools: [...],
    messages: [
        {
            role: 'user',
            content: 'Analyze all the files in this directory and write a summary report.'
        }
    ],
    compactionControl: {
        enabled: true,
        contextTokenThreshold: 100000
    }
});

for await (const message of runner) {
    console.log('Tokens used:', message.usage.input_tokens);
}

const finalMessage = await runner.runUntilDone();
```

</CodeGroup>

#### 圧縮中に何が起こるか

会話が増加するにつれて、メッセージ履歴が蓄積されます：

**圧縮前（100kトークンに近づいている）:**
```json
[
  { "role": "user", "content": "Analyze all files and write a report..." },
  { "role": "assistant", "content": "I'll help. Let me start by reading..." },
  { "role": "user", "content": [{ "type": "tool_result", "tool_use_id": "...", "content": "..." }] },
  { "role": "assistant", "content": "Based on file1.txt, I see..." },
  { "role": "user", "content": [{ "type": "tool_result", "tool_use_id": "...", "content": "..." }] },
  { "role": "assistant", "content": "After analyzing file2.txt..." },
  // ... 50 more exchanges like this ...
]
```

トークンがしきい値を超えると、SDKは要約リクエストを挿入し、Claudeが要約を生成します。その後、履歴全体が置き換えられます：

**圧縮後（約2～3kトークンに戻る）:**
```json
[
  {
    "role": "assistant",
    "content": "# Task Overview\nThe user requested analysis of directory files to produce a summary report...\n\n# Current State\nAnalyzed 52 files across 3 subdirectories. Key findings documented in report.md...\n\n# Important Discoveries\n- Configuration files use YAML format\n- Found 3 deprecated dependencies\n- Test coverage at 67%\n\n# Next Steps\n1. Analyze remaining files in /src/legacy\n2. Complete final report sections...\n\n# Context to Preserve\nUser prefers markdown format with executive summary first..."
  }
]
```

Claudeはこの要約から、元の会話履歴であるかのように作業を続けます。

### 設定オプション

| パラメータ | 型 | 必須 | デフォルト | 説明 |
|-----------|------|----------|---------|-------------|
| `enabled` | boolean | はい | - | 自動圧縮を有効にするかどうか |
| `context_token_threshold` | number | いいえ | 100,000 | 圧縮がトリガーされるトークン数 |
| `model` | string | いいえ | メインモデルと同じ | 要約生成に使用するモデル |
| `summary_prompt` | string | いいえ | 以下を参照 | 要約生成のカスタムプロンプト |

#### トークンしきい値の選択

しきい値は圧縮が発生するタイミングを決定します。低いしきい値は、より小さなコンテキストウィンドウでより頻繁な圧縮を意味します。高いしきい値はより多くのコンテキストを許可しますが、制限に達するリスクがあります。

<CodeGroup>

```python Python
# メモリ制約のあるシナリオでより頻繁な圧縮
compaction_control={
    "enabled": True,
    "context_token_threshold": 50000
}

# より多くのコンテキストが必要な場合、圧縮の頻度を下げる
compaction_control={
    "enabled": True,
    "context_token_threshold": 150000
}
```

```typescript TypeScript
// メモリ制約のあるシナリオでより頻繁な圧縮
compactionControl: {
    enabled: true,
    contextTokenThreshold: 50000
}

// より多くのコンテキストが必要な場合、圧縮の頻度を下げる
compactionControl: {
    enabled: true,
    contextTokenThreshold: 150000
}
```

</CodeGroup>

#### 要約に別のモデルを使用する

要約生成に、より高速または安価なモデルを使用できます：

<CodeGroup>

```python Python
compaction_control={
    "enabled": True,
    "context_token_threshold": 100000,
    "model": "claude-haiku-4-5"
}
```

```typescript TypeScript
compactionControl: {
    enabled: true,
    contextTokenThreshold: 100000,
    model: 'claude-haiku-4-5'
}
```

</CodeGroup>

#### カスタム要約プロンプト

ドメイン固有のニーズに対応するカスタムプロンプトを提供できます。プロンプトは、Claudeに要約を`<summary></summary>`タグでラップするよう指示する必要があります。

<CodeGroup>

```python Python
compaction_control={
    "enabled": True,
    "context_token_threshold": 100000,
    "summary_prompt": """Summarize the research conducted so far, including:
- Sources consulted and key findings
- Questions answered and remaining unknowns
- Recommended next steps

Wrap your summary in <summary></summary> tags."""
}
```

```typescript TypeScript
compactionControl: {
    enabled: true,
    contextTokenThreshold: 100000,
    summaryPrompt: `Summarize the research conducted so far, including:
- Sources consulted and key findings
- Questions answered and remaining unknowns
- Recommended next steps

Wrap your summary in <summary></summary> tags.`
}
```

</CodeGroup>

### デフォルト要約プロンプト

組み込みの要約プロンプトは、以下を含む構造化された継続要約を作成するようClaudeに指示します：

1. **タスク概要**: ユーザーのコア要求、成功基準、および制約
2. **現在の状態**: 完了したもの、変更されたファイル、および生成されたアーティファクト
3. **重要な発見**: 技術的な制約、下された決定、解決されたエラー、および失敗したアプローチ
4. **次のステップ**: 必要な特定のアクション、ブロッカー、および優先順位
5. **保存するコンテキスト**: ユーザーの好み、ドメイン固有の詳細、および行われた約束

この構造により、Claudeは重要なコンテキストを失ったり、間違いを繰り返したりすることなく、効率的に作業を再開できます。

<section title="完全なデフォルトプロンプトを表示">

```
You have been working on the task described above but have not yet completed it. Write a continuation summary that will allow you (or another instance of yourself) to resume work efficiently in a future context window where the conversation history will be replaced with this summary. Your summary should be structured, concise, and actionable. Include:

1. Task Overview
The user's core request and success criteria
Any clarifications or constraints they specified

2. Current State
What has been completed so far
Files created, modified, or analyzed (with paths if relevant)
Key outputs or artifacts produced

3. Important Discoveries
Technical constraints or requirements uncovered
Decisions made and their rationale
Errors encountered and how they were resolved
What approaches were tried that didn't work (and why)

4. Next Steps
Specific actions needed to complete the task
Any blockers or open questions to resolve
Priority order if multiple steps remain

5. Context to Preserve
User preferences or style requirements
Domain-specific details that aren't obvious
Any promises made to the user

Be concise but complete—err on the side of including information that would prevent duplicate work or repeated mistakes. Write in a way that enables immediate resumption of the task.

Wrap your summary in <summary></summary> tags.
```

</section>

### 制限事項

#### サーバー側のツール

<Warning>
圧縮は、[ウェブ検索](/docs/ja/agents-and-tools/tool-use/web-search-tool)や[ウェブフェッチ](/docs/ja/agents-and-tools/tool-use/web-fetch-tool)などのサーバー側のツールを使用する場合、特別な考慮が必要です。
</Warning>

サーバー側のツールを使用する場合、SDKはトークン使用量を誤って計算し、圧縮が間違ったタイミングでトリガーされる可能性があります。

例えば、ウェブ検索操作後、APIレスポンスは以下のようになる可能性があります：

```json
{
  "usage": {
    "input_tokens": 63000,
    "cache_read_input_tokens": 270000,
    "output_tokens": 1400
  }
}
```

SDKは合計使用量を63,000 + 270,000 = 333,000トークンとして計算します。ただし、`cache_read_input_tokens`値には、サーバー側のツールによって行われた複数の内部API呼び出しからの累積読み取りが含まれており、実際の会話コンテキストではありません。実際のコンテキスト長は63,000の`input_tokens`のみかもしれませんが、SDKは333kを見て、圧縮を早期にトリガーします。

**回避策：**

- [トークンカウント](/docs/ja/build-with-claude/token-counting)エンドポイントを使用して、正確なコンテキスト長を取得します
- サーバー側のツールを広範に使用する場合、圧縮を避けます

#### ツール使用のエッジケース

ツール使用応答が保留中に圧縮がトリガーされた場合、SDKはメッセージ履歴から要約を生成する前にツール使用ブロックを削除します。要約から再開した後、必要に応じてClaudeはツール呼び出しを再発行します。

### 圧縮の監視

ログを有効にして、圧縮が発生するタイミングを追跡します：

<CodeGroup>

```python Python
import logging

logging.basicConfig(level=logging.INFO)
logging.getLogger("anthropic.lib.tools").setLevel(logging.INFO)

# ログは以下を表示します：
# INFO: Token usage 105000 has exceeded the threshold of 100000. Performing compaction.
# INFO: Compaction complete. New token usage: 2500
```

```typescript TypeScript
// SDKは圧縮イベントをコンソールにログします
// 以下のようなメッセージが表示されます：
// Token usage 105000 has exceeded the threshold of 100000. Performing compaction.
// Compaction complete. New token usage: 2500
```

</CodeGroup>

### 圧縮を使用する場合

**適切なユースケース：**

- 多くのファイルまたはデータソースを処理する長時間実行されるエージェントタスク
- 大量の情報を蓄積する研究ワークフロー
- 明確で測定可能な進捗を持つ複数ステップのタスク
- 会話の外で永続するアーティファクト（ファイル、レポート）を生成するタスク

**あまり理想的でないユースケース：**

- 早期の会話の詳細を正確に思い出す必要があるタスク
- サーバー側のツールを広範に使用するワークフロー
- 多くの変数にわたって正確な状態を維持する必要があるタスク