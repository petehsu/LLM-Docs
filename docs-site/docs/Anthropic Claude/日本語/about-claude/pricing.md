# 料金

Anthropicのモデルと機能の料金体系について学ぶ

---

このページでは、Anthropicのモデルと機能の詳細な料金情報を提供しています。すべての価格はUSD表示です。

最新の料金情報については、[claude.com/pricing](https://claude.com/pricing)をご覧ください。

## モデル料金

以下の表は、異なる使用量階層全体のすべてのClaudeモデルの料金を示しています：

| Model             | Base Input Tokens | 5m Cache Writes | 1h Cache Writes | Cache Hits & Refreshes | Output Tokens |
|-------------------|-------------------|-----------------|-----------------|----------------------|---------------|
| Claude Opus 4.5   | $5 / MTok         | $6.25 / MTok    | $10 / MTok      | $0.50 / MTok | $25 / MTok    |
| Claude Opus 4.1   | $15 / MTok        | $18.75 / MTok   | $30 / MTok      | $1.50 / MTok | $75 / MTok    |
| Claude Opus 4     | $15 / MTok        | $18.75 / MTok   | $30 / MTok      | $1.50 / MTok | $75 / MTok    |
| Claude Sonnet 4.5   | $3 / MTok         | $3.75 / MTok    | $6 / MTok       | $0.30 / MTok | $15 / MTok    |
| Claude Sonnet 4   | $3 / MTok         | $3.75 / MTok    | $6 / MTok       | $0.30 / MTok | $15 / MTok    |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations)) | $3 / MTok         | $3.75 / MTok    | $6 / MTok       | $0.30 / MTok | $15 / MTok    |
| Claude Haiku 4.5  | $1 / MTok         | $1.25 / MTok    | $2 / MTok       | $0.10 / MTok | $5 / MTok     |
| Claude Haiku 3.5  | $0.80 / MTok      | $1 / MTok       | $1.6 / MTok     | $0.08 / MTok | $4 / MTok     |
| Claude Opus 3 ([deprecated](/docs/en/about-claude/model-deprecations))    | $15 / MTok        | $18.75 / MTok   | $30 / MTok      | $1.50 / MTok | $75 / MTok    |
| Claude Haiku 3    | $0.25 / MTok      | $0.30 / MTok    | $0.50 / MTok    | $0.03 / MTok | $1.25 / MTok  |

<Note>
MTok = 100万トークン。「Base Input Tokens」列は標準入力料金を示し、「Cache Writes」と「Cache Hits」は[プロンプトキャッシング](/docs/ja/build-with-claude/prompt-caching)に固有のもので、「Output Tokens」は出力料金を示しています。プロンプトキャッシングは、異なるユースケースのコストを最適化するために、5分（デフォルト）と1時間のキャッシュ期間の両方を提供しています。

上記の表は、プロンプトキャッシングの以下の料金乗数を反映しています：
- 5分キャッシュ書き込みトークンは基本入力トークン価格の1.25倍
- 1時間キャッシュ書き込みトークンは基本入力トークン価格の2倍
- キャッシュ読み取りトークンは基本入力トークン価格の0.1倍
</Note>

## サードパーティプラットフォーム料金

Claudeモデルは[AWS Bedrock](/docs/ja/build-with-claude/claude-on-amazon-bedrock)、[Google Vertex AI](/docs/ja/build-with-claude/claude-on-vertex-ai)、および[Microsoft Foundry](/docs/ja/build-with-claude/claude-in-microsoft-foundry)で利用可能です。公式料金については、以下をご覧ください：
- [AWS Bedrock料金](https://aws.amazon.com/bedrock/pricing/)
- [Google Vertex AI料金](https://cloud.google.com/vertex-ai/generative-ai/pricing)
- [Microsoft Foundry料金](https://azure.microsoft.com/en-us/pricing/details/ai-foundry/#pricing)

<Note>
**Claude 4.5モデル以降のリージョナルエンドポイント料金**

Claude Sonnet 4.5とHaiku 4.5から始まり、AWS BedrockとGoogle Vertex AIは2つのエンドポイントタイプを提供しています：
- **グローバルエンドポイント**：最大の可用性のためのリージョン間の動的ルーティング
- **リージョナルエンドポイント**：特定の地理的リージョン内でのデータルーティングが保証される

リージョナルエンドポイントはグローバルエンドポイントより10%のプレミアムが含まれます。**Claude API（1P）はデフォルトでグローバルであり、この変更の影響を受けません。** Claude APIはグローバルのみ（他のプロバイダーのグローバルエンドポイント提供と料金に相当）です。

**スコープ**：この料金体系はClaude Sonnet 4.5、Haiku 4.5、およびすべての将来のモデルに適用されます。以前のモデル（Claude Sonnet 4、Opus 4、およびそれ以前のリリース）は既存の料金を保持しています。

実装の詳細とコード例については：
- [AWS Bedrockグローバルエンドポイント対リージョナルエンドポイント](/docs/ja/build-with-claude/claude-on-amazon-bedrock#global-vs-regional-endpoints)
- [Google Vertex AIグローバルエンドポイント対リージョナルエンドポイント](/docs/ja/build-with-claude/claude-on-vertex-ai#global-vs-regional-endpoints)
</Note>

## 機能固有の料金

### バッチ処理

Batch APIは、入力トークンと出力トークンの両方で50%割引で大量のリクエストの非同期処理を可能にします。

| Model             | Batch input      | Batch output    |
|-------------------|------------------|-----------------|
| Claude Opus 4.5     | $2.50 / MTok     | $12.50 / MTok   |
| Claude Opus 4.1     | $7.50 / MTok     | $37.50 / MTok   |
| Claude Opus 4     | $7.50 / MTok     | $37.50 / MTok   |
| Claude Sonnet 4.5   | $1.50 / MTok     | $7.50 / MTok    |
| Claude Sonnet 4   | $1.50 / MTok     | $7.50 / MTok    |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations)) | $1.50 / MTok     | $7.50 / MTok    |
| Claude Haiku 4.5  | $0.50 / MTok     | $2.50 / MTok    |
| Claude Haiku 3.5  | $0.40 / MTok     | $2 / MTok       |
| Claude Opus 3 ([deprecated](/docs/en/about-claude/model-deprecations))  | $7.50 / MTok     | $37.50 / MTok   |
| Claude Haiku 3    | $0.125 / MTok    | $0.625 / MTok   |

バッチ処理の詳細については、[バッチ処理ドキュメント](/docs/ja/build-with-claude/batch-processing)をご覧ください。

### 長いコンテキスト料金

Claude Sonnet 4またはSonnet 4.5を[1Mトークンコンテキストウィンドウが有効](/docs/ja/build-with-claude/context-windows#1m-token-context-window)にして使用する場合、200K入力トークンを超えるリクエストは自動的にプレミアム長いコンテキスト料金で課金されます：

<Note>
1Mトークンコンテキストウィンドウは現在、[使用量階層](/docs/ja/api/rate-limits)4の組織およびカスタムレート制限を持つ組織のベータ版です。1MトークンコンテキストウィンドウはClaude Sonnet 4とSonnet 4.5でのみ利用可能です。
</Note>

| ≤ 200K入力トークン | > 200K入力トークン |
|-----------------------------------|-------------------------------------|
| 入力：$3 / MTok | 入力：$6 / MTok |
| 出力：$15 / MTok | 出力：$22.50 / MTok |

長いコンテキスト料金は他の料金修飾子と組み合わされます：
- [Batch API 50%割引](#batch-processing)は長いコンテキスト料金に適用されます
- [プロンプトキャッシング乗数](#model-pricing)は長いコンテキスト料金の上に適用されます

<Note>
ベータフラグが有効になっていても、200K未満の入力トークンを持つリクエストは標準料金で課金されます。リクエストが200K入力トークンを超える場合、すべてのトークンはプレミアム料金が適用されます。

200Kしきい値は入力トークンのみに基づいています（キャッシュ読み取り/書き込みを含む）。出力トークン数は料金階層の選択に影響しませんが、入力しきい値を超える場合、出力トークンはより高い料金で課金されます。
</Note>

APIリクエストが1Mコンテキストウィンドウ料金で課金されたかどうかを確認するには、APIレスポンスの`usage`オブジェクトを確認してください：

```json
{
  "usage": {
    "input_tokens": 250000,
    "cache_creation_input_tokens": 0,
    "cache_read_input_tokens": 0,
    "output_tokens": 500
  }
}
```

以下を合計して総入力トークンを計算します：
- `input_tokens`
- `cache_creation_input_tokens`（プロンプトキャッシングを使用している場合）
- `cache_read_input_tokens`（プロンプトキャッシングを使用している場合）

合計が200,000トークンを超える場合、リクエスト全体は1Mコンテキスト料金で請求されました。

`usage`オブジェクトの詳細については、[APIレスポンスドキュメント](/docs/ja/api/messages#response-usage)をご覧ください。

### ツール使用料金

Tool use requests are priced based on:
1. The total number of input tokens sent to the model (including in the `tools` parameter)
2. The number of output tokens generated
3. For server-side tools, additional usage-based pricing (e.g., web search charges per search performed)

Client-side tools are priced the same as any other Claude API request, while server-side tools may incur additional charges based on their specific usage.

The additional tokens from tool use come from:

- The `tools` parameter in API requests (tool names, descriptions, and schemas)
- `tool_use` content blocks in API requests and responses
- `tool_result` content blocks in API requests

When you use `tools`, we also automatically include a special system prompt for the model which enables tool use. The number of tool use tokens required for each model are listed below (excluding the additional tokens listed above). Note that the table assumes at least 1 tool is provided. If no `tools` are provided, then a tool choice of `none` uses 0 additional system prompt tokens.

| Model                    | Tool choice                                          | Tool use system prompt token count          |
|--------------------------|------------------------------------------------------|---------------------------------------------|
| Claude Opus 4.5            | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Opus 4.1            | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Opus 4            | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Sonnet 4.5          | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Sonnet 4          | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations))        | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Haiku 4.5         | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Haiku 3.5         | `auto`, `none`<hr />`any`, `tool`   | 264 tokens<hr />340 tokens |
| Claude Opus 3 ([deprecated](/docs/en/about-claude/model-deprecations))            | `auto`, `none`<hr />`any`, `tool`   | 530 tokens<hr />281 tokens |
| Claude Sonnet 3          | `auto`, `none`<hr />`any`, `tool`   | 159 tokens<hr />235 tokens |
| Claude Haiku 3           | `auto`, `none`<hr />`any`, `tool`   | 264 tokens<hr />340 tokens |

These token counts are added to your normal input and output tokens to calculate the total cost of a request.

現在のモデルごとの価格については、上記の[モデル料金](#model-pricing)セクションを参照してください。

ツール使用の実装とベストプラクティスの詳細については、[ツール使用ドキュメント](/docs/ja/agents-and-tools/tool-use/overview)をご覧ください。

### 特定のツール料金

#### Bashツール

The bash tool adds **245 input tokens** to your API calls.

Additional tokens are consumed by:
- Command outputs (stdout/stderr)
- Error messages
- Large file contents

完全な料金詳細については[ツール使用料金](#tool-use-pricing)をご覧ください。

#### コード実行ツール

Code execution tool usage is tracked separately from token usage. Execution time has a minimum of 5 minutes.
If files are included in the request, execution time is billed even if the tool is not used due to files being preloaded onto the container.

Each organization receives 50 free hours of usage with the code execution tool per day. Additional usage beyond the first 50 hours is billed at $0.05 per hour, per container.

#### テキストエディタツール

The text editor tool uses the same pricing structure as other tools used with Claude. It follows the standard input and output token pricing based on the Claude model you're using.

In addition to the base tokens, the following additional input tokens are needed for the text editor tool:

| Tool | Additional input tokens |
| ----------------------------------------- | --------------------------------------- |
| `text_editor_20250429` (Claude 4.x) | 700 tokens |
| `text_editor_20250124` (Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations))) | 700 tokens |

完全な料金詳細については[ツール使用料金](#tool-use-pricing)をご覧ください。

#### ウェブ検索ツール

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

#### ウェブフェッチツール

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

#### コンピュータ使用ツール

Computer use follows the standard [tool use pricing](/docs/en/agents-and-tools/tool-use/overview#pricing). When using the computer use tool:

**System prompt overhead**: The computer use beta adds 466-499 tokens to the system prompt

**Computer use tool token usage**:
| Model | Input tokens per tool definition |
| ----- | -------------------------------- |
| Claude 4.x models | 735 tokens |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations)) | 735 tokens |

**Additional token consumption**:
- Screenshot images (see [Vision pricing](/docs/en/build-with-claude/vision))
- Tool execution results returned to Claude

<Note>
If you're also using bash or text editor tools alongside computer use, those tools have their own token costs as documented in their respective pages.
</Note>

## エージェントユースケース料金の例

エージェントアプリケーションの料金を理解することは、Claudeで構築する際に重要です。これらの実世界の例は、異なるエージェントパターンのコスト推定に役立ちます。

### カスタマーサポートエージェントの例

カスタマーサポートエージェントを構築する場合、コストの内訳は次のようになります：

<Note>
  10,000件のサポートチケットを処理するための計算例：
  - 会話あたり平均約3,700トークン
  - Claude Sonnet 4.5を使用、入力$3/MTok、出力$15/MTok
  - 総コスト：10,000チケットあたり約$22.20
</Note>

この計算の詳細なウォークスルーについては、[カスタマーサポートエージェントガイド](/docs/ja/about-claude/use-case-guides/customer-support-chat)をご覧ください。

### 一般的なエージェントワークフロー料金

複数のステップを持つより複雑なエージェントアーキテクチャの場合：

1. **初期リクエスト処理**
   - 典型的な入力：500～1,000トークン
   - 処理コスト：リクエストあたり約$0.003

2. **メモリとコンテキスト取得**
   - 取得されたコンテキスト：2,000～5,000トークン
   - 取得あたりのコスト：操作あたり約$0.015

3. **アクション計画と実行**
   - 計画トークン：1,000～2,000
   - 実行フィードバック：500～1,000
   - 合計コスト：アクションあたり約$0.045

エージェント料金パターンの包括的なガイドについては、[エージェントユースケースガイド](/docs/ja/about-claude/use-case-guides)をご覧ください。

### コスト最適化戦略

Claudeでエージェントを構築する場合：

1. **適切なモデルを使用する**：シンプルなタスクにはHaikuを、複雑な推論にはSonnetを選択します
2. **プロンプトキャッシングを実装する**：繰り返されるコンテキストのコストを削減します
3. **バッチ操作**：時間に敏感でないタスクにはBatch APIを使用します
4. **使用パターンを監視する**：トークン消費を追跡して最適化の機会を特定します

<Tip>
  大量のエージェントアプリケーションの場合、カスタム料金の取り決めについて[エンタープライズセールスチーム](https://claude.com/contact-sales)に連絡することを検討してください。
</Tip>

## 追加の料金に関する考慮事項

### レート制限

レート制限は使用量階層によって異なり、実行できるリクエスト数に影響します：

- **階層1**：基本的な制限を持つエントリーレベルの使用
- **階層2**：成長するアプリケーション向けの増加した制限
- **階層3**：確立されたアプリケーション向けのより高い制限
- **階層4**：最大標準制限
- **エンタープライズ**：カスタム制限が利用可能

詳細なレート制限情報については、[レート制限ドキュメント](/docs/ja/api/rate-limits)をご覧ください。

より高いレート制限またはカスタム料金の取り決めについては、[セールスチームに連絡してください](https://claude.com/contact-sales)。

### ボリュームディスカウント

大量ユーザー向けのボリュームディスカウントが利用可能な場合があります。これらはケースバイケースで交渉されます。

- 標準階層は上記の料金を使用します
- エンタープライズ顧客は[セールスに連絡](mailto:sales@anthropic.com)してカスタム料金を取得できます
- 学術および研究割引が利用可能な場合があります

### エンタープライズ料金

特定のニーズを持つエンタープライズ顧客向け：

- カスタムレート制限
- ボリュームディスカウント
- 専任サポート
- カスタム条件

[sales@anthropic.com](mailto:sales@anthropic.com)でセールスチームに連絡するか、[Claude Console](/settings/limits)を通じてエンタープライズ料金オプションについて相談してください。

## 請求と支払い

- 請求は実際の使用に基づいて月単位で計算されます
- 支払いはUSDで処理されます
- クレジットカードと請求書オプションが利用可能です
- 使用状況追跡は[Claude Console](/)で利用可能です

## よくある質問

**トークン使用量はどのように計算されますか？**

トークンはモデルが処理するテキストの断片です。大まかな推定として、1トークンは英語で約4文字または0.75語です。正確な数は言語とコンテンツタイプによって異なります。

**無料階層またはトライアルはありますか？**

新規ユーザーはAPIをテストするための少量の無料クレジットを受け取ります。エンタープライズ評価のための延長トライアルについては[セールスに連絡](mailto:sales@anthropic.com)してください。

**割引はどのようにスタックしますか？**

Batch APIとプロンプトキャッシング割引は組み合わせることができます。たとえば、両方の機能を一緒に使用すると、標準APIコールと比較して大幅なコスト削減が得られます。

**どの支払い方法が受け入れられていますか？**

標準アカウント向けに主要なクレジットカードを受け入れています。エンタープライズ顧客は請求書およびその他の支払い方法を手配できます。

料金に関する追加の質問については、[support@anthropic.com](mailto:support@anthropic.com)に連絡してください。