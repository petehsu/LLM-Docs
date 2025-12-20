# Claude Developer Platform

Claude API、クライアント SDK、Claude Console の更新情報。

---

<Tip>
Claude Apps のリリースノートについては、[Claude Help Center の Claude Apps のリリースノート](https://support.claude.com/en/articles/12138966-release-notes)を参照してください。

Claude Code の更新については、`claude-code` リポジトリの[完全な CHANGELOG.md](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)を参照してください。
</Tip>

### 2025 年 12 月 4 日
- [構造化出力](/docs/ja/build-with-claude/structured-outputs)が Claude Haiku 4.5 に対応しました。

### 2025 年 11 月 24 日
- [Claude Opus 4.5](https://www.anthropic.com/news/claude-opus-4-5)をリリースしました。これは最大の能力と実用的なパフォーマンスを組み合わせた最も知的なモデルです。複雑な専門的タスク、プロフェッショナルなソフトウェアエンジニアリング、高度なエージェントに最適です。ビジョン、コーディング、コンピュータ使用において段階的な改善を実現し、以前の Opus モデルよりもアクセスしやすい価格で提供されます。詳細は[モデルと価格設定のドキュメント](/docs/ja/about-claude/models)をご覧ください。
- [プログラマティックツール呼び出し](/docs/ja/agents-and-tools/tool-use/programmatic-tool-calling)をパブリックベータでリリースしました。これにより Claude はコード実行内からツールを呼び出すことができ、マルチツールワークフローのレイテンシとトークン使用量を削減できます。
- [ツール検索ツール](/docs/ja/agents-and-tools/tool-use/tool-search-tool)をパブリックベータでリリースしました。これにより Claude は大規模なツールカタログからツールを動的に検出し、オンデマンドで読み込むことができます。
- [effort パラメータ](/docs/ja/build-with-claude/effort)を Claude Opus 4.5 のパブリックベータでリリースしました。これにより応答の徹底性と効率のトレードオフを通じてトークン使用量を制御できます。
- Python と TypeScript SDK に[クライアント側圧縮](/docs/ja/build-with-claude/context-editing#client-side-compaction-sdk)を追加しました。`tool_runner` を使用する際に会話コンテキストを要約を通じて自動的に管理します。

### 2025 年 11 月 21 日
- 検索結果コンテンツブロックが Amazon Bedrock で一般提供されるようになりました。詳細は[検索結果のドキュメント](/docs/ja/build-with-claude/search-results)をご覧ください。

### 2025 年 11 月 19 日
- **新しいドキュメンテーションプラットフォーム**を [platform.claude.com/docs](https://platform.claude.com/docs) でリリースしました。ドキュメントは Claude Console と並んで配置され、統一された開発者体験を提供します。以前の docs.claude.com のドキュメントサイトは新しい場所にリダイレクトされます。

### 2025 年 11 月 18 日
- **Claude in Microsoft Foundry** をリリースしました。これにより Claude モデルが Azure 請求と OAuth 認証を備えた Azure 顧客に提供されます。拡張思考、プロンプトキャッシング（5 分および 1 時間）、PDF サポート、Files API、Agent Skills、ツール使用を含む完全な Messages API にアクセスできます。詳細は[Microsoft Foundry のドキュメント](/docs/ja/build-with-claude/claude-in-microsoft-foundry)をご覧ください。

### 2025 年 11 月 14 日
- [構造化出力](/docs/ja/build-with-claude/structured-outputs)をパブリックベータでリリースしました。Claude の応答に対して保証されたスキーマ準拠を提供します。構造化データ応答には JSON 出力を、検証されたツール入力には厳密なツール使用を使用します。Claude Sonnet 4.5 と Claude Opus 4.1 で利用可能です。有効にするには、ベータヘッダー `structured-outputs-2025-11-13` を使用してください。

### 2025 年 10 月 28 日
- Claude Sonnet 3.7 モデルの廃止予定を発表しました。詳細は[ドキュメント](/docs/ja/about-claude/model-deprecations)をご覧ください。
- Claude Sonnet 3.5 モデルを廃止しました。これらのモデルへのすべてのリクエストはエラーを返すようになります。
- 思考ブロッククリア（`clear_thinking_20251015`）でコンテキスト編集を拡張しました。思考ブロックの自動管理を有効にします。詳細は[コンテキスト編集のドキュメント](/docs/ja/build-with-claude/context-editing)をご覧ください。

### 2025 年 10 月 16 日
- [Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)（`skills-2025-10-02` ベータ）をリリースしました。これは Claude の機能を拡張する新しい方法です。Skills は Claude が動的に読み込む指示、スクリプト、リソースの整理されたフォルダです。初期リリースには以下が含まれます：
  - **Anthropic 管理 Skills**: PowerPoint（.pptx）、Excel（.xlsx）、Word（.docx）、PDF ファイルを操作するための事前構築された Skills
  - **カスタム Skills**: Skills API（`/v1/skills` エンドポイント）を通じて独自の Skills をアップロードして、ドメイン専門知識と組織ワークフローをパッケージ化します
  - Skills には[コード実行ツール](/docs/ja/agents-and-tools/tool-use/code-execution-tool)を有効にする必要があります
  - 詳細は[Agent Skills のドキュメント](/docs/ja/agents-and-tools/agent-skills/overview)と [API リファレンス](/docs/ja/api/skills/create-skill)をご覧ください

### 2025 年 10 月 15 日
- [Claude Haiku 4.5](https://www.anthropic.com/news/claude-haiku-4-5)をリリースしました。これは最速で最も知的な Haiku モデルで、フロンティアに近いパフォーマンスを備えています。リアルタイムアプリケーション、大量処理、強力な推論が必要なコスト効率的なデプロイメントに最適です。詳細は[モデルと価格設定のドキュメント](/docs/ja/about-claude/models)をご覧ください。

### 2025 年 9 月 29 日
- [Claude Sonnet 4.5](https://www.anthropic.com/news/claude-sonnet-4-5)をリリースしました。これは複雑なエージェントとコーディングに最適なモデルで、ほとんどのタスクで最高の知能を備えています。詳細は[Claude 4.5 の新機能](/docs/ja/about-claude/models/whats-new-claude-4-5)をご覧ください。
- AWS Bedrock と Google Vertex AI に[グローバルエンドポイント価格](/docs/ja/about-claude/pricing#third-party-platform-pricing)を導入しました。Claude API（1P）の価格は影響を受けません。
- 新しい停止理由 `model_context_window_exceeded` を導入しました。これにより入力サイズを計算することなく最大限のトークンをリクエストできます。詳細は[停止理由の処理のドキュメント](/docs/ja/build-with-claude/handling-stop-reasons)をご覧ください。
- メモリツールをベータでリリースしました。これにより Claude は会話全体で情報を保存および参照できます。詳細は[メモリツールのドキュメント](/docs/ja/agents-and-tools/tool-use/memory-tool)をご覧ください。
- コンテキスト編集をベータでリリースしました。会話コンテキストを自動的に管理するための戦略を提供します。初期リリースはトークン制限に近づいた場合に古いツール結果と呼び出しをクリアすることをサポートしています。詳細は[コンテキスト編集のドキュメント](/docs/ja/build-with-claude/context-editing)をご覧ください。

### 2025 年 9 月 17 日
- Python と TypeScript SDK のベータ版ツールヘルパーをリリースしました。型安全な入力検証とツール実行の自動処理のためのツールランナーを備えたツール作成と実行を簡素化します。詳細については、[Python SDK のドキュメント](https://github.com/anthropics/anthropic-sdk-python/blob/main/tools.md)と [TypeScript SDK のドキュメント](https://github.com/anthropics/anthropic-sdk-typescript/blob/main/helpers.md#tool-helpers)を参照してください。

### 2025 年 9 月 16 日
- 開発者向けサービスを Claude ブランドの下に統一しました。プラットフォームとドキュメント全体で更新された命名と URL が表示されるはずですが、**開発者インターフェースは同じままです**。以下は注目すべき変更です：
  - Anthropic Console（[console.anthropic.com](https://console.anthropic.com)）→ Claude Console（[platform.claude.com](https://platform.claude.com)）。コンソールは 2025 年 12 月 16 日まで両方の URL で利用可能です。その後、[console.anthropic.com](https://console.anthropic.com) は自動的に [platform.claude.com](https://platform.claude.com) にリダイレクトされます。
  - Anthropic Docs（[docs.claude.com](https://docs.claude.com)）→ Claude Docs（[docs.claude.com](https://docs.claude.com)）
  - Anthropic Help Center（[support.claude.com](https://support.claude.com)）→ Claude Help Center（[support.claude.com](https://support.claude.com)）
  - API エンドポイント、ヘッダー、環境変数、SDK は同じままです。既存の統合は変更なしで動作し続けます。

### 2025 年 9 月 10 日
- ウェブフェッチツールをベータでリリースしました。これにより Claude は指定された Web ページと PDF ドキュメントから完全なコンテンツを取得できます。詳細は[ウェブフェッチツールのドキュメント](/docs/ja/agents-and-tools/tool-use/web-fetch-tool)をご覧ください。
- [Claude Code Analytics API](/docs/ja/build-with-claude/claude-code-analytics-api)をリリースしました。これにより組織は Claude Code の日次集計使用メトリクス（生産性メトリクス、ツール使用統計、コストデータを含む）にプログラムでアクセスできます。

### 2025 年 9 月 8 日
- [C# SDK](https://github.com/anthropics/anthropic-sdk-csharp) のベータ版をリリースしました。

### 2025 年 9 月 5 日
- Console の [Usage](https://console.anthropic.com/settings/usage) ページに[レート制限チャート](/docs/ja/api/rate-limits#monitoring-your-rate-limits-in-the-console)をリリースしました。これにより API レート制限使用量とキャッシング率を時間経過で監視できます。

### 2025 年 9 月 3 日
- クライアント側ツール結果で引用可能なドキュメントのサポートをリリースしました。詳細は[ツール使用のドキュメント](/docs/ja/agents-and-tools/tool-use/implement-tool-use)をご覧ください。

### 2025 年 9 月 2 日
- [Code Execution Tool](/docs/ja/agents-and-tools/tool-use/code-execution-tool) の v2 をパブリックベータでリリースしました。元の Python のみのツールを Bash コマンド実行と直接ファイル操作機能に置き換えます。これには他の言語でのコード記述が含まれます。

### 2025 年 8 月 27 日
- [PHP SDK](https://github.com/anthropics/anthropic-sdk-php) のベータ版をリリースしました。

### 2025 年 8 月 26 日
- Claude API の Claude Sonnet 4 の[1M トークンコンテキストウィンドウ](/docs/ja/build-with-claude/context-windows#1m-token-context-window)のレート制限を増加させました。詳細は[長いコンテキストレート制限](/docs/ja/api/rate-limits#long-context-rate-limits)をご覧ください。
- 1M トークンコンテキストウィンドウが Google Cloud の Vertex AI で利用可能になりました。詳細は [Claude on Vertex AI](/docs/ja/build-with-claude/claude-on-vertex-ai) をご覧ください。

### 2025 年 8 月 19 日
- リクエスト ID が既存の `request-id` ヘッダーと並んでエラー応答本体に直接含まれるようになりました。詳細は[エラーのドキュメント](/docs/ja/api/errors#error-shapes)をご覧ください。

### 2025 年 8 月 18 日
- [Usage & Cost API](/docs/ja/build-with-claude/usage-cost-api)をリリースしました。これにより管理者は組織の使用量とコストデータをプログラムで監視できます。
- 組織情報を取得するための新しいエンドポイントを Admin API に追加しました。詳細は [Organization Info Admin API リファレンス](/docs/ja/api/admin-api/organization/get-me)をご覧ください。

### 2025 年 8 月 13 日
- Claude Sonnet 3.5 モデル（`claude-3-5-sonnet-20240620` および `claude-3-5-sonnet-20241022`）の廃止予定を発表しました。これらのモデルは 2025 年 10 月 28 日に廃止されます。パフォーマンスと機能の向上のため、Claude Sonnet 4.5（`claude-sonnet-4-5-20250929`）への移行をお勧めします。詳細は[モデル廃止のドキュメント](/docs/ja/about-claude/model-deprecations)をご覧ください。
- プロンプトキャッシングの 1 時間キャッシュ期間が一般提供されるようになりました。ベータヘッダーなしで拡張キャッシュ TTL を使用できるようになりました。詳細は[プロンプトキャッシングのドキュメント](/docs/ja/build-with-claude/prompt-caching#1-hour-cache-duration)をご覧ください。

### 2025 年 8 月 12 日
- Claude API と Amazon Bedrock の Claude Sonnet 4 で[1M トークンコンテキストウィンドウ](/docs/ja/build-with-claude/context-windows#1m-token-context-window)のベータサポートをリリースしました。

### 2025 年 8 月 11 日
- API 使用量の急激な増加に続いて、一部の顧客が 429（`rate_limit_error`）[エラー](/docs/ja/api/errors)に遭遇する可能性があります。これは API の加速制限が原因です。以前は、同様のシナリオで 529（`overloaded_error`）エラーが発生していました。

### 2025 年 8 月 8 日
- 検索結果コンテンツブロックが Claude API と Google Cloud の Vertex AI で一般提供されるようになりました。この機能により RAG アプリケーションで適切なソース属性を持つ自然な引用が可能になります。ベータヘッダー `search-results-2025-06-09` は不要になりました。詳細は[検索結果のドキュメント](/docs/ja/build-with-claude/search-results)をご覧ください。

### 2025 年 8 月 5 日
- [Claude Opus 4.1](https://www.anthropic.com/news/claude-opus-4-1)をリリースしました。これは Claude Opus 4 への段階的な更新で、機能強化とパフォーマンス改善を備えています。<sup>*</sup> 詳細は[モデルと価格設定のドキュメント](/docs/ja/about-claude/models)をご覧ください。

_<sup>* - Opus 4.1 は `temperature` と `top_p` パラメータの両方を同時に指定することはできません。どちらか一方のみを使用してください。</sup>_

### 2025 年 7 月 28 日
- `text_editor_20250728` をリリースしました。これは更新されたテキストエディタツールで、以前のバージョンの問題を修正し、大きなファイルを表示する際の切り詰め長を制御できるオプションの `max_characters` パラメータを追加しています。

### 2025 年 7 月 24 日
- Claude API の Claude Opus 4 の[レート制限](/docs/ja/api/rate-limits)を増加させました。これにより Claude でビルドとスケーリングをより多くの容量で行えます。[使用量層 1-4 レート制限](/docs/ja/api/rate-limits#rate-limits)を持つ顧客の場合、これらの変更はアカウントに即座に適用されます。アクションは不要です。

### 2025 年 7 月 21 日
- Claude 2.0、Claude 2.1、Claude Sonnet 3 モデルを廃止しました。これらのモデルへのすべてのリクエストはエラーを返すようになります。詳細は[ドキュメント](/docs/ja/about-claude/model-deprecations)をご覧ください。

### 2025 年 7 月 17 日
- Claude API の Claude Sonnet 4 の[レート制限](/docs/ja/api/rate-limits)を増加させました。これにより Claude でビルドとスケーリングをより多くの容量で行えます。[使用量層 1-4 レート制限](/docs/ja/api/rate-limits#rate-limits)を持つ顧客の場合、これらの変更はアカウントに即座に適用されます。アクションは不要です。

### 2025 年 7 月 3 日
- 検索結果コンテンツブロックをベータでリリースしました。これにより RAG アプリケーションで自然な引用が可能になります。ツールは適切なソース属性を持つ検索結果を返すことができ、Claude はこれらのソースを応答で自動的に引用します。これは Web 検索の引用品質と一致します。これにより、カスタムナレッジベースアプリケーションでドキュメント回避策が不要になります。詳細は[検索結果のドキュメント](/docs/ja/build-with-claude/search-results)をご覧ください。この機能を有効にするには、ベータヘッダー `search-results-2025-06-09` を使用してください。

### 2025 年 6 月 30 日
- Claude Opus 3 モデルの廃止予定を発表しました。詳細は[ドキュメント](/docs/ja/about-claude/model-deprecations)をご覧ください。

### 2025 年 6 月 23 日
- Developer ロールを持つ Console ユーザーは [Cost](https://console.anthropic.com/settings/cost) ページにアクセスできるようになりました。以前は、Developer ロールは [Usage](https://console.anthropic.com/settings/usage) ページへのアクセスを許可していましたが、Cost ページへのアクセスは許可していませんでした。

### 2025 年 6 月 11 日
- [細粒度ツールストリーミング](/docs/ja/agents-and-tools/tool-use/fine-grained-tool-streaming)をパブリックベータでリリースしました。これは Claude がツール使用パラメータをバッファリング/JSON 検証なしでストリーミングできる機能です。細粒度ツールストリーミングを有効にするには、[ベータヘッダー](/docs/ja/api/beta-headers) `fine-grained-tool-streaming-2025-05-14` を使用してください。

### 2025 年 5 月 22 日
- [Claude Opus 4 と Claude Sonnet 4](http://www.anthropic.com/news/claude-4)をリリースしました。これらは拡張思考機能を備えた最新のモデルです。詳細は[モデルと価格設定のドキュメント](/docs/ja/about-claude/models)をご覧ください。
- Claude 4 モデルの[拡張思考](/docs/ja/build-with-claude/extended-thinking)のデフォルト動作は Claude の完全な思考プロセスの要約を返し、完全な思考は暗号化されて思考ブロック出力の `signature` フィールドで返されます。
- [インターリーブ思考](/docs/ja/build-with-claude/extended-thinking#interleaved-thinking)をパブリックベータでリリースしました。これは Claude がツール呼び出し間で思考できる機能です。インターリーブ思考を有効にするには、[ベータヘッダー](/docs/ja/api/beta-headers) `interleaved-thinking-2025-05-14` を使用してください。
- [Files API](/docs/ja/build-with-claude/files)をパブリックベータでリリースしました。これにより Messages API とコード実行ツールでファイルをアップロードして参照できます。
- [Code execution tool](/docs/ja/agents-and-tools/tool-use/code-execution-tool)をパブリックベータでリリースしました。これは Claude が安全なサンドボックス環境で Python コードを実行できるツールです。
- [MCP コネクタ](/docs/ja/agents-and-tools/mcp-connector)をパブリックベータでリリースしました。これは Messages API から直接リモート MCP サーバーに接続できる機能です。
- 回答品質を向上させ、ツールエラーを減らすため、Messages API の `top_p` [nucleus sampling](https://en.wikipedia.org/wiki/Top-p_sampling) パラメータのデフォルト値をすべてのモデルで 0.999 から 0.99 に変更しました。この変更を戻すには、`top_p` を 0.999 に設定してください。
    さらに、拡張思考が有効な場合、`top_p` を 0.95 から 1 の間の値に設定できるようになりました。
- [Go SDK](https://github.com/anthropics/anthropic-sdk-go)をベータから GA に移行しました。
- Console の [Usage](https://console.anthropic.com/settings/usage) ページに分単位と時間単位の粒度を含め、Usage ページに 429 エラー率を追加しました。

### 2025 年 5 月 21 日
- [Ruby SDK](https://github.com/anthropics/anthropic-sdk-ruby)をベータから GA に移行しました。

### 2025 年 5 月 7 日
- API でウェブ検索ツールをリリースしました。これにより Claude は Web から最新の情報にアクセスできます。詳細は[ウェブ検索ツールのドキュメント](/docs/ja/agents-and-tools/tool-use/web-search-tool)をご覧ください。

### 2025 年 5 月 1 日
- キャッシュ制御は `tool_result` と `document.source` の親 `content` ブロックで直接指定する必要があります。後方互換性のため、キャッシュ制御が `tool_result.content` または `document.source.content` の最後のブロックで検出された場合、代わりに親ブロックに自動的に適用されます。`tool_result.content` と `document.source.content` 内の他のブロックのキャッシュ制御は検証エラーになります。

### 2025 年 4 月 9 日
- [Ruby SDK](https://github.com/anthropics/anthropic-sdk-ruby) のベータ版をリリースしました

### 2025 年 3 月 31 日
- [Java SDK](https://github.com/anthropics/anthropic-sdk-java)をベータから GA に移行しました。
- [Go SDK](https://github.com/anthropics/anthropic-sdk-go)をアルファからベータに移行しました。

### 2025 年 2 月 27 日
- Messages API で画像と PDF の URL ソースブロックを追加しました。画像と PDF を base64 エンコードする代わりに、URL で直接参照できるようになりました。詳細は[ビジョンのドキュメント](/docs/ja/build-with-claude/vision)と [PDF サポートのドキュメント](/docs/ja/build-with-claude/pdf-support)をご覧ください。
- Messages API の `tool_choice` パラメータに `none` オプションのサポートを追加しました。これにより Claude がツールを呼び出すことを防ぎます。さらに、`tool_use` と `tool_result` ブロックを含める場合、ツールを提供する必要がなくなりました。
- OpenAI 互換 API エンドポイントをリリースしました。これにより既存の OpenAI 統合で API キー、ベース URL、モデル名を変更するだけで Claude モデルをテストできます。この互換性レイヤーはコアチャット完了機能をサポートしています。詳細は[OpenAI SDK 互換性のドキュメント](/docs/ja/api/openai-sdk)をご覧ください。

### 2025 年 2 月 24 日
- [Claude Sonnet 3.7](http://www.anthropic.com/news/claude-3-7-sonnet)をリリースしました。これは今までで最も知的なモデルです。Claude Sonnet 3.7 はほぼ瞬時の応答を生成するか、拡張思考をステップバイステップで表示できます。1 つのモデル、2 つの思考方法です。すべての Claude モデルの詳細は[モデルと価格設定のドキュメント](/docs/ja/about-claude/models)をご覧ください。
- Claude Haiku 3.5 にビジョンサポートを追加しました。これにより、モデルは画像を分析および理解できます。
- トークン効率的なツール使用実装をリリースしました。Claude でツールを使用する場合の全体的なパフォーマンスを向上させます。詳細は[ツール使用のドキュメント](/docs/ja/agents-and-tools/tool-use/overview)をご覧ください。
- [Console](https://console.anthropic.com/workbench) の新しいプロンプトのデフォルト温度を 0 から 1 に変更しました。これは API のデフォルト温度との一貫性のためです。既存の保存されたプロンプトは変更されません。
- コンピュータ使用システムプロンプトからテキスト編集ツールと bash ツールを分離した更新されたバージョンのツールをリリースしました：
  - `bash_20250124`: 以前のバージョンと同じ機能ですが、コンピュータ使用から独立しています。ベータヘッダーは不要です。
  - `text_editor_20250124`: 以前のバージョンと同じ機能ですが、コンピュータ使用から独立しています。ベータヘッダーは不要です。
  - `computer_20250124`: 「hold_key」、「left_mouse_down」、「left_mouse_up」、「scroll」、「triple_click」、「wait」を含む新しいコマンドオプションを備えた更新されたコンピュータ使用ツール。このツールには「computer-use-2025-01-24」anthropic-beta ヘッダーが必要です。
  詳細は[ツール使用のドキュメント](/docs/ja/agents-and-tools/tool-use/overview)をご覧ください。

### 2025 年 2 月 10 日
- すべての API レスポンスに `anthropic-organization-id` レスポンスヘッダーを追加しました。このヘッダーはリクエストで使用された API キーに関連付けられた組織 ID を提供します。

### 2025 年 1 月 31 日

- [Java SDK](https://github.com/anthropics/anthropic-sdk-java)をアルファからベータに移行しました。

### 2025 年 1 月 23 日

- API で引用機能をリリースしました。これにより Claude は情報のソース属性を提供できます。詳細は[引用のドキュメント](/docs/ja/build-with-claude/citations)をご覧ください。
- Messages API でプレーンテキストドキュメントとカスタムコンテンツドキュメントのサポートを追加しました。

### 2025 年 1 月 21 日

- Claude 2、Claude 2.1、Claude Sonnet 3 モデルの廃止予定を発表しました。詳細は[ドキュメント](/docs/ja/about-claude/model-deprecations)をご覧ください。

### 2025 年 1 月 15 日

- [プロンプトキャッシング](/docs/ja/build-with-claude/prompt-caching)を使いやすくするために更新しました。キャッシュブレークポイントを設定すると、以前にキャッシュされた最長のプレフィックスから自動的に読み込みます。
- ツールを使用する場合、Claude の口に言葉を入れることができるようになりました。

### 2025 年 1 月 10 日

- [Message Batches API でのプロンプトキャッシング](/docs/ja/build-with-claude/batch-processing#using-prompt-caching-with-message-batches)のサポートを最適化して、キャッシュヒット率を向上させました。

### 2024 年 12 月 19 日

- Message Batches API に[削除エンドポイント](/docs/ja/api/deleting-message-batches)のサポートを追加しました

### 2024 年 12 月 17 日
以下の機能は Claude API で一般提供されるようになりました：

- [Models API](/docs/ja/api/models-list): 利用可能なモデルをクエリし、モデル ID を検証し、[モデルエイリアス](/docs/ja/about-claude/models#model-names)を正規モデル ID に解決します。
- [Message Batches API](/docs/ja/build-with-claude/batch-processing): 大量のメッセージを非同期で処理し、標準 API コストの 50% で実行します。
- [Token counting API](/docs/ja/build-with-claude/token-counting): Claude に送信する前に Messages のトークン数を計算します。
- [Prompt Caching](/docs/ja/build-with-claude/prompt-caching): プロンプトコンテンツをキャッシュして再利用することで、コストを最大 90% 削減し、レイテンシを最大 80% 削減します。
- [PDF support](/docs/ja/build-with-claude/pdf-support): PDF を処理して、ドキュメント内のテキストと視覚的コンテンツの両方を分析します。

また、新しい公式 SDK もリリースしました：
- [Java SDK](https://github.com/anthropics/anthropic-sdk-java)（アルファ）
- [Go SDK](https://github.com/anthropics/anthropic-sdk-go)（アルファ）

### 2024 年 12 月 4 日

- [Developer Console](https://console.anthropic.com) の [Usage](https://console.anthropic.com/settings/usage) ページと [Cost](https://console.anthropic.com/settings/cost) ページに API キーでグループ化する機能を追加しました
- [Developer Console](https://console.anthropic.com) の [API keys](https://console.anthropic.com/settings/keys) ページに 2 つの新しい**最後に使用された時刻**と**コスト**列を追加し、任意の列でソートする機能を追加しました

### 2024 年 11 月 21 日

- [Admin API](/docs/ja/build-with-claude/administration-api)をリリースしました。これにより ユーザーは組織のリソースをプログラムで管理できます。

### 2024 年 11 月 20 日

- Messages API のレート制限を更新しました。分単位のトークンレート制限を新しい分単位の入力トークンと出力トークンレート制限に置き換えました。詳細は[ドキュメント](/docs/ja/api/rate-limits)をご覧ください。
- [Workbench](https://console.anthropic.com/workbench) に[ツール使用](/docs/ja/agents-and-tools/tool-use/overview)のサポートを追加しました。

### 2024 年 11 月 13 日

- すべての Claude Sonnet 3.5 モデルに PDF サポートを追加しました。詳細は[ドキュメント](/docs/ja/build-with-claude/pdf-support)をご覧ください。

### 2024 年 11 月 6 日

- Claude 1 と Instant モデルを廃止しました。詳細は[ドキュメント](/docs/ja/about-claude/model-deprecations)をご覧ください。

### 2024 年 11 月 4 日

- [Claude Haiku 3.5](https://www.anthropic.com/claude/haiku) が Claude API でテキストのみのモデルとして利用可能になりました。

### 2024 年 11 月 1 日

- 新しい Claude Sonnet 3.5 で使用するための PDF サポートを追加しました。詳細は[ドキュメント](/docs/ja/build-with-claude/pdf-support)をご覧ください。
- トークンカウント機能も追加しました。これにより Claude に送信する前に Message のトークン総数を決定できます。詳細は[ドキュメント](/docs/ja/build-with-claude/token-counting)をご覧ください。

### 2024 年 10 月 22 日

- 新しい Claude Sonnet 3.5 で使用するための Anthropic 定義のコンピュータ使用ツールを API に追加しました。詳細は[ドキュメント](/docs/ja/agents-and-tools/tool-use/computer-use-tool)をご覧ください。
- Claude Sonnet 3.5（最も知的なモデル）がアップグレードされ、Claude API で利用可能になりました。詳細は[こちら](https://www.anthropic.com/claude/sonnet)をご覧ください。

### 2024 年 10 月 8 日

- Message Batches API がベータで利用可能になりました。Claude API で大量のクエリを非同期で処理し、コストを 50% 削減します。詳細は[ドキュメント](/docs/ja/build-with-claude/batch-processing)をご覧ください。
- Messages API で `user`/`assistant` ターンの順序制限を緩和しました。連続した `user`/`assistant` メッセージは単一のメッセージに結合され、エラーが発生しなくなります。また、最初の入力メッセージが `user` メッセージである必要がなくなりました。
- Build と Scale プランを標準機能スイート（以前は Build と呼ばれていた）に置き換えました。追加機能は営業を通じて利用可能です。詳細は[こちら](https://claude.com/platform/api)をご覧ください。

### 2024 年 10 月 3 日

- API で並列ツール使用を無効にする機能を追加しました。`tool_choice` フィールドで `disable_parallel_tool_use: true` を設定して、Claude が最大 1 つのツールを使用するようにしてください。詳細は[ドキュメント](/docs/ja/agents-and-tools/tool-use/implement-tool-use#parallel-tool-use)をご覧ください。

### 2024 年 9 月 10 日

- [Developer Console](https://console.anthropic.com) にワークスペースを追加しました。ワークスペースにより、カスタム支出またはレート制限を設定し、API キーをグループ化し、プロジェクト別に使用量を追跡し、ユーザーロールでアクセスを制御できます。詳細は[ブログ投稿](https://www.anthropic.com/news/workspaces)をご覧ください。

### 2024 年 9 月 4 日

- Claude 1 モデルの廃止予定を発表しました。詳細は[ドキュメント](/docs/ja/about-claude/model-deprecations)をご覧ください。

### 2024 年 8 月 22 日

- API レスポンスで CORS ヘッダーを返すことで、ブラウザでの SDK の使用をサポートしました。SDK インスタンス化で `dangerouslyAllowBrowser: true` を設定して、この機能を有効にしてください。

### 2024 年 8 月 19 日

- Claude Sonnet 3.5 の 8,192 トークン出力をベータから一般提供に移行しました。

### 2024 年 8 月 14 日

- [プロンプトキャッシング](/docs/ja/build-with-claude/prompt-caching)が Claude API でベータ機能として利用可能になりました。プロンプトをキャッシュして再利用し、レイテンシを最大 80% 削減し、コストを最大 90% 削減します。

### 2024 年 7 月 15 日

- `anthropic-beta: max-tokens-3-5-sonnet-2024-07-15` ヘッダーで Claude Sonnet 3.5 から最大 8,192 トークンの長さの出力を生成します。

### 2024 年 7 月 9 日

- [Developer Console](https://console.anthropic.com) で Claude を使用してプロンプトのテストケースを自動生成します。
- [Developer Console](https://console.anthropic.com) の新しい出力比較モードで異なるプロンプトからの出力を並べて比較します。

### 2024 年 6 月 27 日

- [Developer Console](https://console.anthropic.com) の新しい [Usage](https://console.anthropic.com/settings/usage) タブと [Cost](https://console.anthropic.com/settings/cost) タブで、ドル金額、トークン数、API キー別に分類された API 使用量と請求を表示します。
- [Developer Console](https://console.anthropic.com) の新しい [Rate Limits](https://console.anthropic.com/settings/limits) タブで現在の API レート制限を表示します。

### 2024 年 6 月 20 日

- [Claude Sonnet 3.5](http://anthropic.com/news/claude-3-5-sonnet)（最も知的なモデル）が Claude API、Amazon Bedrock、Google Vertex AI で一般提供されるようになりました。

### 2024 年 5 月 30 日

- [ツール使用](/docs/ja/agents-and-tools/tool-use/overview)が Claude API、Amazon Bedrock、Google Vertex AI で一般提供されるようになりました。

### 2024 年 5 月 10 日

- [Developer Console](https://console.anthropic.com) でプロンプトジェネレータツールが利用可能になりました。Prompt Generator により、特定のタスクに合わせた高品質なプロンプトを Claude に生成させるのが簡単になります。詳細は[ブログ投稿](https://www.anthropic.com/news/prompt-generator)をご覧ください。