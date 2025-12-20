# Claude 4.5の新機能

Claude 4.5では、異なるユースケース向けに設計された3つのモデルが導入されています

---

Claude 4.5では、異なるユースケース向けに設計された3つのモデルが導入されています。

- **Claude Opus 4.5**: 最大の機能と実用的なパフォーマンスを組み合わせた、最も知能の高いモデルです。以前のOpusモデルよりもアクセスしやすい価格設定が特徴です。200kトークンのコンテキストウィンドウで利用可能です。
- **Claude Sonnet 4.5**: 複雑なエージェントとコーディングに最適なモデルで、ほとんどのタスクで最高の知能を備えています。200kおよび1M（ベータ）トークンのコンテキストウィンドウで利用可能です。
- **Claude Haiku 4.5**: 最速で最も知能の高いHaikuモデルで、フロンティアに近いパフォーマンスを実現しています。200kトークンのコンテキストウィンドウで利用可能です。

## Opus 4.5がOpus 4.1より改善された主な点

### 最大の知能

Claude Opus 4.5は、最大の機能と実用的なパフォーマンスを組み合わせた、最も知能の高いモデルです。推論、コーディング、複雑な問題解決タスク全体で段階的な改善を実現しながら、Opusファミリーから期待される高品質の出力を維持しています。

### Effortパラメータ

Claude Opus 4.5は、[effortパラメータ](/docs/ja/build-with-claude/effort)をサポートする唯一のモデルで、Claude応答時に使用するトークン数を制御できます。これにより、単一のモデルで応答の徹底性とトークン効率のトレードオフを調整できます。

effortパラメータは、テキスト応答、ツール呼び出し、拡張思考を含む応答内のすべてのトークンに影響します。以下から選択できます。
- **High effort**: 複雑な分析と詳細な説明のための最大限の徹底性
- **Medium effort**: ほとんどの本番ユースケースのためのバランスの取れたアプローチ
- **Low effort**: 大量自動化のための最もトークン効率的な応答

### コンピュータ使用の優秀性

Claude Opus 4.5は、[強化されたコンピュータ使用機能](/docs/ja/agents-and-tools/tool-use/computer-use-tool)を導入し、特定の画面領域を全解像度で詳細に検査できる新しいズームアクションを備えています。これにより、Claude は標準的なスクリーンショットでは不明確な可能性がある細粒度のUI要素、小さなテキスト、詳細な視覚情報を検査できます。

ズーム機能は特に以下の場合に価値があります。
- 小さなUI要素とコントロールの検査
- 細かい字や詳細なテキストの読み取り
- 密集した情報を含む複雑なインターフェースの分析
- アクションを実行する前に正確な視覚的詳細を確認

### 実用的なパフォーマンス

Claude Opus 4.5は、以前のOpusモデルよりも[アクセスしやすい価格設定](/docs/ja/about-claude/pricing)でフラッグシップレベルの知能を提供し、より広い範囲のアプリケーションとユースケースで高度なAI機能を利用可能にしています。

### 思考ブロックの保持

Claude Opus 4.5は、[以前のすべての思考ブロックを自動的に保持](/docs/ja/build-with-claude/extended-thinking#thinking-block-preservation-in-claude-opus-4-5)し、拡張マルチターンインタラクションとツール使用セッション全体で推論の連続性を維持します。これにより、Claude は複雑で長時間実行されるタスクで作業する際に、完全な推論履歴を効果的に活用できます。

## Sonnet 4.5がSonnet 4より改善された主な点

### コーディングの優秀性

Claude Sonnet 4.5は現在までで最高のコーディングモデルで、開発ライフサイクル全体で大幅な改善を実現しています。

- **SWE-bench Verified パフォーマンス**: コーディングベンチマークで最先端の高度な性能
- **計画とシステム設計の強化**: より優れたアーキテクチャの決定とコード組織
- **セキュリティエンジニアリングの改善**: より堅牢なセキュリティプラクティスと脆弱性検出
- **命令追従の改善**: コーディング仕様と要件への より正確な準拠

<Note>
Claude Sonnet 4.5は、[拡張思考](/docs/ja/build-with-claude/extended-thinking)が有効な場合、コーディングタスクで大幅に優れたパフォーマンスを発揮します。拡張思考はデフォルトで無効ですが、複雑なコーディング作業では有効にすることをお勧めします。拡張思考は[プロンプトキャッシング効率](/docs/ja/build-with-claude/prompt-caching#caching-with-thinking-blocks)に影響することに注意してください。設定の詳細については、[移行ガイド](/docs/ja/about-claude/models/migrating-to-claude-4#extended-thinking-recommendations)を参照してください。
</Note>

### エージェント機能

Claude Sonnet 4.5は、エージェント機能における大きな進歩を導入しています。

- **拡張された自律操作**: Sonnet 4.5は、段階的な進捗に対する明確さと焦点を維持しながら、数時間独立して作業できます。モデルは、すべてを一度に試みるのではなく、一度に数個のタスクで着実に進歩します。実現されたことを正確に反映した事実ベースの進捗更新を提供します。
- **コンテキスト認識**: Claude は会話全体でトークン使用量を追跡し、各ツール呼び出し後に更新を受け取ります。この認識は、タスクの早期放棄を防ぎ、長時間実行されるタスクでより効果的な実行を可能にします。技術的な詳細については[コンテキスト認識](/docs/ja/build-with-claude/context-windows#context-awareness-in-claude-sonnet-4-5)を、プロンプティングガイダンスについては[プロンプティングガイダンス](/docs/ja/build-with-claude/prompt-engineering/claude-4-best-practices#context-awareness-and-multi-window-workflows)を参照してください。
- **強化されたツール使用**: モデルは並列ツール呼び出しをより効果的に使用し、研究中に複数の推測検索を同時に実行し、複数のファイルを一度に読み取ってコンテキストをより速く構築します。複数のツールと情報ソース全体での改善された調整により、モデルはエージェント検索とコーディングワークフローで幅広い機能を効果的に活用できます。
- **高度なコンテキスト管理**: Sonnet 4.5は外部ファイルで例外的な状態追跡を維持し、セッション全体でゴール指向を保持します。より効果的なコンテキストウィンドウ使用と新しいコンテキスト管理API機能と組み合わせることで、モデルは拡張セッション全体で情報を最適に処理し、時間の経過とともに一貫性を維持します。

<Note>コンテキスト認識は、Claude Sonnet 4、Sonnet 4.5、Haiku 4.5、Opus 4、Opus 4.1、およびOpus 4.5で利用可能です。</Note>

### コミュニケーションとインタラクションスタイル

Claude Sonnet 4.5は、簡潔で直接的で自然なコミュニケーションアプローチを備えています。事実ベースの進捗更新を提供し、ワークフローの勢いを維持するためにツール呼び出し後の冗長な要約をスキップする場合があります（ただし、これはプロンプティングで調整できます）。

このコミュニケーションスタイルで作業するための詳細なガイダンスについては、[Claude 4ベストプラクティス](/docs/ja/build-with-claude/prompt-engineering/claude-4-best-practices)を参照してください。

### クリエイティブコンテンツ生成

Claude Sonnet 4.5はクリエイティブコンテンツタスクで優れています。

- **プレゼンテーションとアニメーション**: スライドと視覚的コンテンツの作成でClaude Opus 4.1およびOpus 4.5と同等またはそれ以上
- **クリエイティブな輝き**: 強い命令追従で洗練された専門的な出力を生成
- **初回品質**: 初回の試みで使用可能でよく設計されたコンテンツを生成

## Haiku 4.5がHaiku 3.5より改善された主な点

Claude Haiku 4.5は、Haikuモデルファミリーの変革的な飛躍を表し、フロンティア機能を最速のモデルクラスにもたらします。

### フロンティアに近い知能と驚異的な速度

Claude Haiku 4.5は、Sonnet 4と同等のフロンティアに近いパフォーマンスを大幅に低いコストとより高速で提供します。

- **フロンティアに近い知能**: 推論、コーディング、複雑なタスク全体でSonnet 4パフォーマンスと同等
- **強化された速度**: Sonnet 4の2倍以上の速度で、出力トークン/秒（OTPS）の最適化
- **最適なコスト性能**: フロンティアに近い知能を3分の1のコストで、大量デプロイに最適

### 拡張思考機能

Claude Haiku 4.5は、**最初のHaikuモデル**で拡張思考をサポートし、高度な推論機能をHaikuファミリーにもたらします。

- **速度での推論**: 複雑な問題解決のためのClaudeの内部推論プロセスへのアクセス
- **思考要約**: 本番対応デプロイメント用の要約された思考出力
- **インターリーブされた思考**: より洗練されたマルチステップワークフロー用のツール呼び出し間での思考
- **予算制御**: 推論の深さと速度のバランスを取るために思考トークン予算を設定

拡張思考は、APIリクエストに`thinking`パラメータを追加することで明示的に有効にする必要があります。実装の詳細については、[拡張思考ドキュメント](/docs/ja/build-with-claude/extended-thinking)を参照してください。

<Note>
Claude Haiku 4.5は、[拡張思考](/docs/ja/build-with-claude/extended-thinking)が有効な場合、コーディングと推論タスクで大幅に優れたパフォーマンスを発揮します。拡張思考はデフォルトで無効ですが、複雑な問題解決、コーディング作業、マルチステップ推論では有効にすることをお勧めします。拡張思考は[プロンプトキャッシング効率](/docs/ja/build-with-claude/prompt-caching#caching-with-thinking-blocks)に影響することに注意してください。設定の詳細については、[移行ガイド](/docs/ja/about-claude/models/migrating-to-claude-4#extended-thinking-recommendations)を参照してください。
</Note>

<Note>Claude Sonnet 3.7、Sonnet 4、Sonnet 4.5、Haiku 4.5、Opus 4、Opus 4.1、およびOpus 4.5で利用可能です。</Note>

### コンテキスト認識

Claude Haiku 4.5は**コンテキスト認識**機能を備えており、モデルが会話全体で残りのコンテキストウィンドウを追跡できます。

- **トークン予算追跡**: Claude は各ツール呼び出し後に残りのコンテキスト容量のリアルタイム更新を受け取ります
- **より優れたタスク永続性**: モデルは利用可能な作業スペースを理解することで、タスクをより効果的に実行できます
- **マルチコンテキストウィンドウワークフロー**: 拡張セッション全体での状態遷移の改善されたハンドリング

これは、ネイティブコンテキスト認識機能を備えた最初のHaikuモデルです。プロンプティングガイダンスについては、[Claude 4ベストプラクティス](/docs/ja/build-with-claude/prompt-engineering/claude-4-best-practices#context-awareness-and-multi-window-workflows)を参照してください。

<Note>Claude Sonnet 4、Sonnet 4.5、Haiku 4.5、Opus 4、Opus 4.1、およびOpus 4.5で利用可能です。</Note>

### 強力なコーディングとツール使用

Claude Haiku 4.5は、最新のClaudeモデルから期待される堅牢なコーディング機能を提供します。

- **コーディング能力**: コード生成、デバッグ、リファクタリングタスク全体での強力なパフォーマンス
- **完全なツールサポート**: bash、コード実行、テキストエディタ、ウェブ検索、コンピュータ使用を含むすべてのClaude 4ツールと互換性
- **強化されたコンピュータ使用**: 自律デスクトップインタラクションとブラウザ自動化ワークフロー用に最適化
- **並列ツール実行**: 複雑なワークフロー用の複数ツール全体での効率的な調整

Haiku 4.5は、知能と効率の両方を要求するユースケース向けに設計されています。

- **リアルタイムアプリケーション**: インタラクティブなユーザーエクスペリエンス用の高速応答時間
- **大量処理**: 大規模デプロイメント用のコスト効果的な知能
- **フリーティア実装**: アクセスしやすい価格設定での プレミアムモデル品質
- **サブエージェントアーキテクチャ**: マルチエージェントシステム用の高速で知能的なエージェント
- **規模でのコンピュータ使用**: コスト効果的な自律デスクトップとブラウザ自動化

## 新しいAPI機能

### プログラマティックツール呼び出し（ベータ）

[プログラマティックツール呼び出し](/docs/ja/agents-and-tools/tool-use/programmatic-tool-calling)により、Claude はモデルを通じた各ツール呼び出しのラウンドトリップを必要とするのではなく、コード実行コンテナ内でプログラマティックにツールを呼び出すコードを記述できます。これにより、マルチツールワークフローのレイテンシが大幅に削減され、Claude がモデルのコンテキストウィンドウに到達する前にデータをフィルタリングまたは処理できるようにすることで、トークン消費が削減されます。

```python
tools=[
    {
        "type": "code_execution_20250825",
        "name": "code_execution"
    },
    {
        "name": "query_database",
        "description": "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
        "input_schema": {...},
        "allowed_callers": ["code_execution_20250825"]  # Enable programmatic calling
    }
]
```

主な利点：
- **削減されたレイテンシ**: ツール呼び出し間のモデルラウンドトリップを排除
- **トークン効率**: Claude に戻す前にプログラマティックにツール結果を処理およびフィルタリング
- **複雑なワークフロー**: ループ、条件付きロジック、バッチ処理をサポート

<Note>Claude Opus 4.5およびClaude Sonnet 4.5で利用可能です。[ベータヘッダー](/docs/ja/api/beta-headers)が必要です: `advanced-tool-use-2025-11-20`</Note>

### ツール検索ツール（ベータ）

[ツール検索ツール](/docs/ja/agents-and-tools/tool-use/tool-search-tool)により、Claude は数百または数千のツールで作業でき、必要に応じてそれらを動的に発見してロードできます。すべてのツール定義をコンテキストウィンドウに事前にロードするのではなく、Claude はツールカタログを検索し、必要なツールのみをロードします。

2つの検索バリアントが利用可能です。
- **Regex** (`tool_search_tool_regex_20251119`): Claude はツール名、説明、引数を検索するための正規表現パターンを構築します
- **BM25** (`tool_search_tool_bm25_20251119`): Claude は自然言語クエリを使用してツールを検索します

```python
tools=[
    {
        "type": "tool_search_tool_regex_20251119",
        "name": "tool_search_tool_regex"
    },
    {
        "name": "get_weather",
        "description": "Get the weather at a specific location",
        "input_schema": {...},
        "defer_loading": True  # Load on-demand via search
    }
]
```

このアプローチは、2つの重要な課題を解決します。
- **コンテキスト効率**: すべてのツール定義を事前にロードしないことで10～20Kトークンを節約
- **ツール選択精度**: 100以上の利用可能なツールがある場合でも高い精度を維持

<Note>Claude Opus 4.5およびClaude Sonnet 4.5で利用可能です。[ベータヘッダー](/docs/ja/api/beta-headers)が必要です: `advanced-tool-use-2025-11-20`</Note>

### Effortパラメータ（ベータ）

[effortパラメータ](/docs/ja/build-with-claude/effort)により、Claude 応答時に使用するトークン数を制御でき、応答の徹底性とトークン効率のトレードオフを調整できます。

```python
response = client.beta.messages.create(
    model="claude-opus-4-5-20251101",
    betas=["effort-2025-11-24"],
    max_tokens=4096,
    messages=[{"role": "user", "content": "..."}],
    output_config={
        "effort": "medium"  # "low", "medium", or "high"
    }
)
```

effortパラメータは、テキスト応答、ツール呼び出し、拡張思考を含む応答内のすべてのトークンに影響します。低いeffortレベルは最小限の説明で より簡潔な応答を生成し、高いeffortは詳細な推論と包括的な回答を提供します。

<Note>Claude Opus 4.5でのみ利用可能です。[ベータヘッダー](/docs/ja/api/beta-headers)が必要です: `effort-2025-11-24`</Note>

### ツール使用例（ベータ）

[ツール使用例](/docs/ja/agents-and-tools/tool-use/implement-tool-use#providing-tool-use-examples)により、有効なツール入力の具体的な例を提供して、Claude がツールをより効果的に使用する方法を理解するのに役立てることができます。これは、ネストされたオブジェクト、オプションパラメータ、または形式に敏感な入力を持つ複雑なツールに特に役立ちます。

```python
tools=[
    {
        "name": "get_weather",
        "description": "Get the current weather in a given location",
        "input_schema": {...},
        "input_examples": [
            {
                "location": "San Francisco, CA",
                "unit": "fahrenheit"
            },
            {
                "location": "Tokyo, Japan",
                "unit": "celsius"
            },
            {
                "location": "New York, NY"  # Demonstrates optional 'unit' parameter
            }
        ]
    }
]
```

例はツールスキーマと一緒にプロンプトに含まれ、Claude に整形式のツール呼び出しの具体的なパターンを示します。各例は、ツールの`input_schema`に従って有効である必要があります。

<Note>Claude Sonnet 4.5、Haiku 4.5、Opus 4.5、Opus 4.1、およびOpus 4で利用可能です。[ベータヘッダー](/docs/ja/api/beta-headers)が必要です: `advanced-tool-use-2025-11-20`。</Note>

### メモリツール（ベータ）

新しい[メモリツール](/docs/ja/agents-and-tools/tool-use/memory-tool)により、Claude はコンテキストウィンドウ外で情報を保存および取得できます。

```python
tools=[
    {
        "type": "memory_20250818",
        "name": "memory"
    }
]
```

これにより、以下が可能になります。
- 時間の経過とともに知識ベースを構築
- セッション全体でプロジェクト状態を維持
- ファイルベースのストレージを通じて事実上無制限のコンテキストを保持

<Note>Claude Sonnet 4、Sonnet 4.5、Haiku 4.5、Opus 4、Opus 4.1、およびOpus 4.5で利用可能です。[ベータヘッダー](/docs/ja/api/beta-headers)が必要です: `context-management-2025-06-27`</Note>

### コンテキスト編集

[コンテキスト編集](/docs/ja/build-with-claude/context-editing)を使用して、自動ツール呼び出しクリアリングを通じたインテリジェントなコンテキスト管理を行います。

```python
response = client.beta.messages.create(
    betas=["context-management-2025-06-27"],
    model="claude-sonnet-4-5",  # or claude-haiku-4-5
    max_tokens=4096,
    messages=[{"role": "user", "content": "..."}],
    context_management={
        "edits": [
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {"type": "input_tokens", "value": 500},
                "keep": {"type": "tool_uses", "value": 2},
                "clear_at_least": {"type": "input_tokens", "value": 100}
            }
        ]
    },
    tools=[...]
)
```

この機能は、トークン制限に近づくと古いツール呼び出しと結果を自動的に削除し、長時間実行されるエージェントセッションでコンテキストを管理するのに役立ちます。

<Note>Claude Sonnet 4、Sonnet 4.5、Haiku 4.5、Opus 4、Opus 4.1、およびOpus 4.5で利用可能です。[ベータヘッダー](/docs/ja/api/beta-headers)が必要です: `context-management-2025-06-27`</Note>

### 強化された停止理由

Claude 4.5モデルは、新しい`model_context_window_exceeded`停止理由を導入しており、要求された`max_tokens`制限ではなくコンテキストウィンドウ制限に達したために生成が停止したことを明示的に示します。これにより、アプリケーションロジックでコンテキストウィンドウ制限を処理しやすくなります。

```json
{
  "stop_reason": "model_context_window_exceeded",
  "usage": {
    "input_tokens": 150000,
    "output_tokens": 49950
  }
}
```

### 改善されたツールパラメータハンドリング

Claude 4.5モデルには、ツール呼び出し文字列パラメータの意図的なフォーマットを保持するバグ修正が含まれています。以前は、文字列パラメータの末尾の改行が誤ってストリップされることがありました。この修正により、正確なフォーマットが必要なツール（テキストエディタなど）が意図したとおりにパラメータを受け取ることが保証されます。

<Note>
これは、APIの変更を必要としないバックグラウンドの改善です。ただし、文字列パラメータを持つツールは、以前にストリップされた末尾の改行を含む値を受け取る場合があります。
</Note>

**例：**

```json
// 前：最後の改行が誤ってストリップされた
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "edit_todo",
  "input": {
    "file": "todo.txt",
    "contents": "1. Chop onions.\n2. ???\n3. Profit"
  }
}

// 後：末尾の改行が意図したとおりに保持された
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "edit_todo",
  "input": {
    "file": "todo.txt",
    "contents": "1. Chop onions.\n2. ???\n3. Profit\n"
  }
}
```

### トークンカウント最適化

Claude 4.5モデルには、モデルパフォーマンスを改善するための自動最適化が含まれています。これらの最適化はリクエストに少量のトークンを追加する可能性がありますが、**これらのシステム追加トークンについては課金されません**。

## Claude 4で導入された機能

以下の機能はClaude 4で導入され、Claude Sonnet 4.5およびClaude Haiku 4.5を含むClaude 4モデル全体で利用可能です。

### 新しい拒否停止理由

Claude 4モデルは、モデルがセーフティ上の理由で生成を拒否するコンテンツの新しい`refusal`停止理由を導入しています。

```json
{
  "id": "msg_014XEDjypDjFzgKVWdFUXxZP",
  "type": "message",
  "role": "assistant",
  "model": "claude-sonnet-4-5",
  "content": [{"type": "text", "text": "I would be happy to assist you. You can "}],
  "stop_reason": "refusal",
  "stop_sequence": null,
  "usage": {
    "input_tokens": 564,
    "cache_creation_input_tokens": 0,
    "cache_read_input_tokens": 0,
    "output_tokens": 22
  }
}
```

Claude 4モデルを使用する場合、[`refusal`停止理由を処理](/docs/ja/test-and-evaluate/strengthen-guardrails/handle-streaming-refusals)するようにアプリケーションを更新する必要があります。

### 要約された思考

拡張思考が有効な場合、Claude 4モデルのMessages APIは、Claude の完全な思考プロセスの要約を返します。要約された思考は、拡張思考の完全な知能上の利点を提供しながら、悪用を防ぎます。

APIはClaude 3.7および4モデル全体で一貫していますが、拡張思考のストリーミング応答は「チャンキー」配信パターンで返される可能性があり、ストリーミングイベント間に遅延が生じる可能性があります。

<Note>
要約はリクエストで対象とするモデルとは異なるモデルによって処理されます。思考モデルは要約された出力を見ません。
</Note>

詳細については、[拡張思考ドキュメント](/docs/ja/build-with-claude/extended-thinking#summarized-thinking)を参照してください。

### インターリーブされた思考

Claude 4モデルは、ツール使用と拡張思考のインターリーブをサポートし、ツール使用と応答を通常のメッセージと混在させることができるより自然な会話を可能にします。

<Note>
インターリーブされた思考はベータ版です。インターリーブされた思考を有効にするには、APIリクエストに[ベータヘッダー](/docs/ja/api/beta-headers) `interleaved-thinking-2025-05-14`を追加してください。
</Note>

詳細については、[拡張思考ドキュメント](/docs/ja/build-with-claude/extended-thinking#interleaved-thinking)を参照してください。

### 行動の違い

Claude 4モデルは、プロンプトの構造化方法に影響を与える可能性のある注目すべき行動変化があります。

#### コミュニケーションスタイルの変化

- **より簡潔で直接的**: Claude 4モデルはより効率的にコミュニケーションし、冗長な説明が少なくなります
- **より自然なトーン**: 応答はやや会話的で、機械的ではなくなります
- **効率重視**: ワークフローの勢いを維持するために詳細な要約をスキップする場合があります（必要に応じてより詳細を求めることができます）

#### 命令追従

Claude 4モデルは正確な命令追従のために訓練されており、より明示的な指示が必要です。

- **アクションについて明示的**: Claude にアクションを実行させたい場合は、「変更を提案できますか」ではなく「これらの変更を行う」または「この機能を実装する」のような直接的な言語を使用してください
- **望ましい行動を明確に述べる**: Claude は指示を正確に従うため、望むものについて具体的であることはより良い結果を達成するのに役立ちます

これらのモデルで作業するための包括的なガイダンスについては、[Claude 4プロンプトエンジニアリングベストプラクティス](/docs/ja/build-with-claude/prompt-engineering/claude-4-best-practices)を参照してください。

### 更新されたテキストエディタツール

テキストエディタツールはClaude 4モデル用に以下の変更で更新されました。

- **ツールタイプ**: `text_editor_20250728`
- **ツール名**: `str_replace_based_edit_tool`
- `undo_edit`コマンドはサポートされなくなりました

<Note>
`str_replace_editor`テキストエディタツールはClaude Sonnet 3.7で同じままです。
</Note>

Claude Sonnet 3.7からテキストエディタツールを使用して移行する場合：

```python
# Claude Sonnet 3.7
tools=[
    {
        "type": "text_editor_20250124",
        "name": "str_replace_editor"
    }
]

# Claude 4 models
tools=[
    {
        "type": "text_editor_20250728",
        "name": "str_replace_based_edit_tool"
    }
]
```

詳細については、[テキストエディタツールドキュメント](/docs/ja/agents-and-tools/tool-use/text-editor-tool)を参照してください。

### 更新されたコード実行ツール

コード実行ツールを使用している場合は、Bashコマンドとファイル操作機能を追加する最新バージョン`code_execution_20250825`を使用していることを確認してください。

レガシーバージョン`code_execution_20250522`（Pythonのみ）はまだ利用可能ですが、新しい実装には推奨されません。

移行手順については、[コード実行ツールドキュメント](/docs/ja/agents-and-tools/tool-use/code-execution-tool#upgrade-to-latest-tool-version)を参照してください。

## 価格と利用可能性

### 価格

Claude 4.5モデルは競争力のある価格を維持しています。

| モデル | 入力 | 出力 |
|-------|-------|--------|
| Claude Opus 4.5 | 100万トークンあたり$5 | 100万トークンあたり$25 |
| Claude Sonnet 4.5 | 100万トークンあたり$3 | 100万トークンあたり$15 |
| Claude Haiku 4.5 | 100万トークンあたり$1 | 100万トークンあたり$5 |

詳細については、[価格ドキュメント](/docs/ja/about-claude/pricing)を参照してください。

### サードパーティプラットフォーム価格

Claude 4.5モデル（Opus 4.5、Sonnet 4.5、Haiku 4.5）から開始して、AWS BedrockおよびGoogle Vertex AIは2つのエンドポイントタイプを提供します。

- **グローバルエンドポイント**: 最大の可用性のための動的ルーティング
- **リージョナルエンドポイント**: 特定の地理的領域を通じた保証されたデータルーティング（**10%の価格プレミアム**付き）

**このリージョナル価格はすべてのClaude 4.5モデルに適用されます：Opus 4.5、Sonnet 4.5、およびHaiku 4.5。**

**Claude API（1P）はグローバルがデフォルトで、この変更の影響を受けません。** Claude APIはグローバルのみです（他のプロバイダーのグローバルエンドポイント提供と価格設定に相当）。

実装の詳細と移行ガイダンスについては：
- [AWS Bedrockグローバル対リージョナルエンドポイント](/docs/ja/build-with-claude/claude-on-amazon-bedrock#global-vs-regional-endpoints)
- [Google Vertex AIグローバル対リージョナルエンドポイント](/docs/ja/build-with-claude/claude-on-vertex-ai#global-vs-regional-endpoints)

### 利用可能性

Claude 4.5モデルは以下で利用可能です。

| モデル | Claude API | Amazon Bedrock | Google Cloud Vertex AI |
|-------|-----------|----------------|------------------------|
| Claude Opus 4.5 | `claude-opus-4-5-20251101` | `anthropic.claude-opus-4-5-20251101-v1:0` | `claude-opus-4-5@20251101` |
| Claude Sonnet 4.5 | `claude-sonnet-4-5-20250929` | `anthropic.claude-sonnet-4-5-20250929-v1:0` | `claude-sonnet-4-5@20250929` |
| Claude Haiku 4.5 | `claude-haiku-4-5-20251001` | `anthropic.claude-haiku-4-5-20251001-v1:0` | `claude-haiku-4-5@20251001` |

Claude.aiおよびClaude Codeプラットフォームを通じても利用可能です。

## 移行ガイド

破壊的な変更と移行要件は、アップグレード元のモデルによって異なります。詳細な移行手順（ステップバイステップガイド、破壊的な変更、移行チェックリストを含む）については、[Claude 4.5への移行](/docs/ja/about-claude/models/migrating-to-claude-4)を参照してください。

移行ガイドは以下のシナリオをカバーしています。
- **Claude Sonnet 3.7 → Sonnet 4.5**: 破壊的な変更を含む完全な移行パス
- **Claude Haiku 3.5 → Haiku 4.5**: 破壊的な変更を含む完全な移行パス
- **Claude Sonnet 4 → Sonnet 4.5**: 最小限の変更での迅速なアップグレード
- **Claude Opus 4.1 → Sonnet 4.5**: 破壊的な変更なしのシームレスなアップグレード
- **Claude Opus 4.1 → Opus 4.5**: 破壊的な変更なしのシームレスなアップグレード
- **Claude Opus 4.5 → Sonnet 4.5**: 破壊的な変更なしのシームレスなダウングレード

## 次のステップ

<CardGroup cols={3}>
  <Card title="ベストプラクティス" icon="lightbulb" href="/docs/ja/build-with-claude/prompt-engineering/claude-4-best-practices">
    Claude 4.5モデルのプロンプトエンジニアリング技術を学ぶ
  </Card>
  <Card title="モデル概要" icon="table" href="/docs/ja/about-claude/models/overview">
    Claude 4.5モデルと他のClaudeモデルを比較
  </Card>
  <Card title="移行ガイド" icon="arrow-right-arrow-left" href="/docs/ja/about-claude/models/migrating-to-claude-4">
    以前のモデルからアップグレード
  </Card>
</CardGroup>