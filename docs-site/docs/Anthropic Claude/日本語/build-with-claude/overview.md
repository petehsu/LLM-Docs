# 機能概要

Claudeの高度な機能と能力を探索します。

---

## コア機能

これらの機能は、様々な形式とユースケースにおいて、Claudeの基本的な処理、分析、コンテンツ生成能力を強化します。

| 機能 | 説明 | 利用可能性 |
|---------|-------------|--------------|
| [100万トークンコンテキストウィンドウ](/docs/ja/build-with-claude/context-windows#1m-token-context-window) | より大きなドキュメントを処理し、より長い会話を維持し、より広範なコードベースで作業できる拡張コンテキストウィンドウ。 | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [Agent Skills](/docs/ja/agents-and-tools/agent-skills/overview) | Skillsを使用してClaudeの機能を拡張します。事前構築されたSkills（PowerPoint、Excel、Word、PDF）を使用するか、指示とスクリプトを使用してカスタムSkillsを作成します。Skillsは段階的な開示を使用してコンテキストを効率的に管理します。 | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [バッチ処理](/docs/ja/build-with-claude/batch-processing) | コスト削減のために大量のリクエストを非同期で処理します。バッチあたり多数のクエリを含むバッチを送信します。バッチAPI呼び出しは標準API呼び出しより50%低いコストです。 | <PlatformAvailability claudeApi bedrock vertexAi /> |
| [引用](/docs/ja/build-with-claude/citations) | ソースドキュメントでClaudeの応答を根拠付けます。引用を使用すると、Claudeは応答の生成に使用する正確な文と段落への詳細な参照を提供でき、より検証可能で信頼できる出力につながります。 | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [コンテキスト編集](/docs/ja/build-with-claude/context-editing) | 設定可能な戦略で会話コンテキストを自動的に管理します。トークン制限に近づいたときのツール結果のクリアと、拡張思考会話での思考ブロックの管理をサポートします。 | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [Effort](/docs/ja/build-with-claude/effort) | effortパラメータを使用してClaudeが応答時に使用するトークン数を制御し、応答の徹底性とトークン効率のバランスを取ります。 | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [拡張思考](/docs/ja/build-with-claude/extended-thinking) | 複雑なタスク向けの強化された推論機能で、最終的な答えを提供する前にClaudeのステップバイステップの思考プロセスに透明性を提供します。 | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Files API](/docs/ja/build-with-claude/files) | Claudeで使用するファイルをアップロードして管理し、各リクエストでコンテンツを再度アップロードする必要がありません。PDF、画像、テキストファイルをサポートします。 | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [PDFサポート](/docs/ja/build-with-claude/pdf-support) | PDFドキュメントからテキストと視覚的コンテンツを処理および分析します。 | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [プロンプトキャッシング（5分）](/docs/ja/build-with-claude/prompt-caching) | Claudeにより多くの背景知識と出力例を提供して、コストとレイテンシを削減します。 | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [プロンプトキャッシング（1時間）](/docs/ja/build-with-claude/prompt-caching#1-hour-cache-duration) | 頻繁にはアクセスされないが重要なコンテキスト向けの拡張1時間キャッシュ期間で、標準的な5分キャッシュを補完します。 | <PlatformAvailability claudeApi azureAi /> |
| [検索結果](/docs/ja/build-with-claude/search-results) | 適切なソース帰属を持つ検索結果を提供することで、RAGアプリケーション向けの自然な引用を有効にします。カスタムナレッジベースとツール向けのウェブ検索品質の引用を実現します。 | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [構造化出力](/docs/ja/build-with-claude/structured-outputs) | 2つのアプローチでスキーマ準拠を保証します。構造化データ応答向けのJSON出力と、検証されたツール入力向けの厳密なツール使用。Sonnet 4.5、Opus 4.1、Opus 4.5、Haiku 4.5で利用可能です。 | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [トークンカウント](/docs/ja/api/messages-count-tokens) | トークンカウントを使用すると、メッセージをClaudeに送信する前にメッセージ内のトークン数を決定でき、プロンプトと使用状況について情報に基づいた決定を下すのに役立ちます。 | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [ツール使用](/docs/ja/agents-and-tools/tool-use/overview) | Claudeが外部ツールとAPIと相互作用して、より広い範囲のタスクを実行できるようにします。サポートされているツールのリストについては、[ツールテーブル](#tools)を参照してください。 | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |

## ツール

これらの機能により、Claudeは外部システムと相互作用し、様々なツールインターフェースを通じてコードを実行し、自動化されたタスクを実行できます。

| 機能 | 説明 | 利用可能性 |
|---------|-------------|--------------|
| [Bash](/docs/ja/agents-and-tools/tool-use/bash-tool) | bashコマンドとスクリプトを実行して、システムシェルと相互作用し、コマンドライン操作を実行します。 | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [コード実行](/docs/ja/agents-and-tools/tool-use/code-execution-tool) | サンドボックス環境でPythonコードを実行して、高度なデータ分析を行います。 | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [プログラマティックツール呼び出し](/docs/ja/agents-and-tools/tool-use/programmatic-tool-calling) | Claudeがコード実行コンテナ内からツールをプログラマティックに呼び出せるようにし、マルチツールワークフロー向けのレイテンシとトークン消費を削減します。 | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [コンピュータ使用](/docs/ja/agents-and-tools/tool-use/computer-use-tool) | スクリーンショットを撮影し、マウスとキーボードコマンドを発行してコンピュータインターフェースを制御します。 | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [細粒度ツールストリーミング](/docs/ja/agents-and-tools/tool-use/fine-grained-tool-streaming) | バッファリング/JSON検証なしでツール使用パラメータをストリーミングし、大きなパラメータの受信レイテンシを削減します。 | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [MCPコネクタ](/docs/ja/agents-and-tools/mcp-connector) | 別のMCPクライアントなしでMessages APIから直接リモート[MCP](/docs/ja/mcp)サーバーに接続します。 | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [メモリ](/docs/ja/agents-and-tools/tool-use/memory-tool) | Claudeが会話全体で情報を保存および取得できるようにします。時間をかけてナレッジベースを構築し、プロジェクトコンテキストを維持し、過去のインタラクションから学習します。 | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [テキストエディタ](/docs/ja/agents-and-tools/tool-use/text-editor-tool) | ファイル操作タスク向けの組み込みテキストエディタインターフェースを使用してテキストファイルを作成および編集します。 | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [ツール検索](/docs/ja/agents-and-tools/tool-use/tool-search-tool) | 正規表現ベースの検索を使用してツールを動的に発見し、オンデマンドで読み込むことで数千のツールにスケーリングし、コンテキスト使用を最適化し、ツール選択精度を向上させます。 | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [ウェブフェッチ](/docs/ja/agents-and-tools/tool-use/web-fetch-tool) | 詳細な分析のために指定されたウェブページとPDFドキュメントから完全なコンテンツを取得します。 | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [ウェブ検索](/docs/ja/agents-and-tools/tool-use/web-search-tool) | ウェブ全体からの現在の実世界データでClaudeの包括的な知識を拡張します。 | <PlatformAvailability claudeApi vertexAi azureAi /> |