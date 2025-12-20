# モデル概要

Claudeは、Anthropicによって開発された最先端の大規模言語モデルのファミリーです。このガイドでは、当社のモデルを紹介し、それらのパフォーマンスを比較します。

---

## モデルの選択

どのモデルを使用するか不確かな場合は、**Claude Sonnet 4.5**から始めることをお勧めします。ほとんどのユースケースにおいて、インテリジェンス、速度、コストの最適なバランスを提供し、コーディングとエージェントタスクで優れたパフォーマンスを発揮します。

現在のすべてのClaudeモデルは、テキストと画像の入力、テキスト出力、多言語機能、およびビジョンをサポートしています。モデルはAnthropicAPI、AWS Bedrock、およびGoogle Vertex AIを通じて利用可能です。

モデルを選択したら、[最初のAPIコールを行う方法を学びます](/docs/ja/get-started)。

### 最新モデルの比較

| 機能 | Claude Sonnet 4.5 | Claude Haiku 4.5 | Claude Opus 4.5 |
|:--------|:------------------|:-----------------|:----------------|
| **説明** | 複雑なエージェントとコーディング用のスマートモデル | 最先端に近いインテリジェンスを備えた最速モデル | 最大のインテリジェンスと実用的なパフォーマンスを組み合わせたプレミアムモデル |
| **Claude API ID** | claude-sonnet-4-5-20250929 | claude-haiku-4-5-20251001 | claude-opus-4-5-20251101 |
| **Claude APIエイリアス**<sup>1</sup> | claude-sonnet-4-5 | claude-haiku-4-5 | claude-opus-4-5 |
| **AWS Bedrock ID** | anthropic.claude-sonnet-4-5-20250929-v1:0 | anthropic.claude-haiku-4-5-20251001-v1:0 | anthropic.claude-opus-4-5-20251101-v1:0 |
| **GCP Vertex AI ID** | claude-sonnet-4-5@20250929 | claude-haiku-4-5@20251001 | claude-opus-4-5@20251101 |
| **価格**<sup>2</sup> | \$3 / 入力 MTok<br/>\$15 / 出力 MTok | \$1 / 入力 MTok<br/>\$5 / 出力 MTok | \$5 / 入力 MTok<br/>\$25 / 出力 MTok |
| **[拡張思考](/docs/ja/build-with-claude/extended-thinking)** | はい | はい | はい |
| **[優先度ティア](/docs/ja/api/service-tiers)** | はい | はい | はい |
| **比較レイテンシ** | 高速 | 最速 | 中程度 |
| **コンテキストウィンドウ** | <Tooltip tooltipContent="~150K words \ ~680K unicode characters">200K トークン</Tooltip> / <br/> <Tooltip tooltipContent="~750K words \ ~3.4M unicode characters">1M トークン</Tooltip> (ベータ)<sup>3</sup> | <Tooltip tooltipContent="~150K words \ ~680K unicode characters">200K トークン</Tooltip> | <Tooltip tooltipContent="~150K words \ ~680K unicode characters">200K トークン</Tooltip> |
| **最大出力** | 64K トークン | 64K トークン | 64K トークン |
| **信頼できるナレッジカットオフ** | 2025年1月<sup>4</sup> | 2025年2月 | 2025年5月<sup>4</sup> |
| **トレーニングデータカットオフ** | 2025年7月 | 2025年7月 | 2025年8月 |

_<sup>1 - エイリアスは自動的に最新のモデルスナップショットを指します。新しいモデルスナップショットをリリースすると、通常、新しいリリースから1週間以内にエイリアスを最新バージョンのモデルを指すように移行します。エイリアスは実験に便利ですが、本番アプリケーションでは一貫した動作を確保するために特定のモデルバージョン（例：`claude-sonnet-4-5-20250929`）を使用することをお勧めします。</sup>_

_<sup>2 - バッチAPI割引、プロンプトキャッシング料金、拡張思考コスト、ビジョン処理料金を含む完全な価格情報については、[価格ページ](/docs/ja/about-claude/pricing)を参照してください。</sup>_

_<sup>3 - Claude Sonnet 4.5は、`context-1m-2025-08-07`ベータヘッダーを使用する場合、[1Mトークンコンテキストウィンドウ](/docs/ja/build-with-claude/context-windows#1m-token-context-window)をサポートしています。[長コンテキスト価格](/docs/ja/about-claude/pricing#long-context-pricing)は200Kトークンを超えるリクエストに適用されます。</sup>_

_<sup>4 - **信頼できるナレッジカットオフ**は、モデルのナレッジが最も広範で信頼できる日付を示します。**トレーニングデータカットオフ**は、使用されたトレーニングデータのより広い日付範囲です。たとえば、Claude Sonnet 4.5は2025年7月までの公開情報でトレーニングされていますが、そのナレッジは2025年1月までが最も広範で信頼できます。詳細については、[Anthropicの透明性ハブ](https://www.anthropic.com/transparency)を参照してください。</sup>_

<Note>同じスナップショット日付（例：20240620）を持つモデルは、すべてのプラットフォーム全体で同一であり、変更されません。モデル名のスナップショット日付は一貫性を確保し、開発者が異なる環境全体で安定したパフォーマンスに依存できるようにします。</Note>

<Note>**Claude Sonnet 4.5およびすべての将来のモデル**から始まり、AWS BedrockとGoogle Vertex AIは2つのエンドポイントタイプを提供します：**グローバルエンドポイント**（最大可用性のための動的ルーティング）および**リージョナルエンドポイント**（特定の地理的領域を通じた保証されたデータルーティング）。詳細については、[サードパーティプラットフォーム価格セクション](/docs/ja/about-claude/pricing#third-party-platform-pricing)を参照してください。</Note>

<section title="レガシーモデル">

以下のモデルはまだ利用可能ですが、改善されたパフォーマンスのために現在のモデルへの移行をお勧めします：

| 機能 | Claude Opus 4.1 | Claude Sonnet 4 | Claude Sonnet 3.7 | Claude Opus 4 | Claude Haiku 3.5 | Claude Haiku 3 |
|:--------|:----------------|:----------------|:------------------|:--------------|:-----------------|:---------------|
| **Claude API ID** | claude-opus-4-1-20250805 | claude-sonnet-4-20250514 | claude-3-7-sonnet-20250219 | claude-opus-4-20250514 | claude-3-5-haiku-20241022 | claude-3-haiku-20240307 |
| **Claude APIエイリアス** | claude-opus-4-1 | claude-sonnet-4-0 | claude-3-7-sonnet-latest | claude-opus-4-0 | claude-3-5-haiku-latest | — |
| **AWS Bedrock ID** | anthropic.claude-opus-4-1-20250805-v1:0 | anthropic.claude-sonnet-4-20250514-v1:0 | anthropic.claude-3-7-sonnet-20250219-v1:0 | anthropic.claude-opus-4-20250514-v1:0 | anthropic.claude-3-5-haiku-20241022-v1:0 | anthropic.claude-3-haiku-20240307-v1:0 |
| **GCP Vertex AI ID** | claude-opus-4-1@20250805 | claude-sonnet-4@20250514 | claude-3-7-sonnet@20250219 | claude-opus-4@20250514 | claude-3-5-haiku@20241022 | claude-3-haiku@20240307 |
| **価格** | \$15 / 入力 MTok<br/>\$75 / 出力 MTok | \$3 / 入力 MTok<br/>\$15 / 出力 MTok | \$3 / 入力 MTok<br/>\$15 / 出力 MTok | \$15 / 入力 MTok<br/>\$75 / 出力 MTok | \$0.80 / 入力 MTok<br/>\$4 / 出力 MTok | \$0.25 / 入力 MTok<br/>\$1.25 / 出力 MTok |
| **[拡張思考](/docs/ja/build-with-claude/extended-thinking)** | はい | はい | はい | はい | いいえ | いいえ |
| **[優先度ティア](/docs/ja/api/service-tiers)** | はい | はい | はい | はい | はい | いいえ |
| **比較レイテンシ** | 中程度 | 高速 | 高速 | 中程度 | 最速 | 高速 |
| **コンテキストウィンドウ** | <Tooltip tooltipContent="~150K words \ ~680K unicode characters">200K トークン</Tooltip> | <Tooltip tooltipContent="~150K words \ ~680K unicode characters">200K トークン</Tooltip> / <br/> <Tooltip tooltipContent="~750K words \ ~3.4M unicode characters">1M トークン</Tooltip> (ベータ)<sup>1</sup> | <Tooltip tooltipContent="~150K words \ ~680K unicode characters">200K トークン</Tooltip> | <Tooltip tooltipContent="~150K words \ ~680K unicode characters">200K トークン</Tooltip> | <Tooltip tooltipContent="~150K words \ ~215K unicode characters">200K トークン</Tooltip> | <Tooltip tooltipContent="~150K words \ ~680K unicode characters">200K トークン</Tooltip> |
| **最大出力** | 32K トークン | 64K トークン | 64K トークン / 128K トークン (ベータ)<sup>4</sup> | 32K トークン | 8K トークン | 4K トークン |
| **信頼できるナレッジカットオフ** | 2025年1月<sup>2</sup> | 2025年1月<sup>2</sup> | 2024年10月<sup>2</sup> | 2025年1月<sup>2</sup> | <sup>3</sup> | <sup>3</sup> |
| **トレーニングデータカットオフ** | 2025年3月 | 2025年3月 | 2024年11月 | 2025年3月 | 2024年7月 | 2023年8月 |

_<sup>1 - Claude Sonnet 4は、`context-1m-2025-08-07`ベータヘッダーを使用する場合、[1Mトークンコンテキストウィンドウ](/docs/ja/build-with-claude/context-windows#1m-token-context-window)をサポートしています。[長コンテキスト価格](/docs/ja/about-claude/pricing#long-context-pricing)は200Kトークンを超えるリクエストに適用されます。</sup>_

_<sup>2 - **信頼できるナレッジカットオフ**は、モデルのナレッジが最も広範で信頼できる日付を示します。**トレーニングデータカットオフ**は、使用されたトレーニングデータのより広い日付範囲です。</sup>_

_<sup>3 - 一部のHaikuモデルは単一のトレーニングデータカットオフ日付を持っています。</sup>_

_<sup>4 - APIリクエストにベータヘッダー`output-128k-2025-02-19`を含めて、Claude Sonnet 3.7の最大出力トークン長を128Kトークンに増やします。より長い出力を生成する場合のタイムアウトを避けるために、[ストリーミングMessages API](/docs/ja/build-with-claude/streaming)を使用することを強くお勧めします。詳細については、[長いリクエスト](/docs/ja/api/errors#long-requests)に関するガイダンスを参照してください。</sup>_

</section>

## プロンプトと出力のパフォーマンス

Claude 4モデルは以下の点で優れています：
- **パフォーマンス**：推論、コーディング、多言語タスク、長コンテキスト処理、正直性、画像処理における最高レベルの結果。詳細については、[Claude 4ブログ投稿](http://www.anthropic.com/news/claude-4)を参照してください。
- **魅力的な応答**：Claudeモデルは、豊かで人間らしいインタラクションを必要とするアプリケーションに最適です。

    - より簡潔な応答を好む場合は、プロンプトを調整して、モデルを目的の出力長に導くことができます。詳細については、[プロンプトエンジニアリングガイド](/docs/ja/build-with-claude/prompt-engineering)を参照してください。
    - Claude 4の特定のプロンプティングベストプラクティスについては、[Claude 4ベストプラクティスガイド](/docs/ja/build-with-claude/prompt-engineering/claude-4-best-practices)を参照してください。
- **出力品質**：以前のモデル世代からClaude 4に移行する場合、全体的なパフォーマンスの大幅な改善に気付くかもしれません。

## Claude 4.5への移行

現在Claude 3モデルを使用している場合は、改善されたインテリジェンスと拡張された機能を活用するためにClaude 4.5への移行をお勧めします。詳細な移行手順については、[Claude 4.5への移行](/docs/ja/about-claude/models/migrating-to-claude-4)を参照してください。

## Claudeを始める

Claudeがあなたのために何ができるかを探索する準備ができたら、始めましょう！Claudeをアプリケーションに統合したい開発者であっても、AIの力を直接体験したいユーザーであっても、私たちはあなたをサポートします。

<Note>Claudeとチャットしたいですか？[claude.ai](http://www.claude.ai)にアクセスしてください！</Note>

<CardGroup cols={3}>
  <Card title="Claudeの紹介" icon="check" href="/docs/ja/intro">
    Claudeの機能と開発フローを探索します。
  </Card>
  <Card title="クイックスタート" icon="lightning" href="/docs/ja/get-started">
    数分で最初のAPIコールを行う方法を学びます。
  </Card>
  <Card title="Claude Console" icon="code" href="/">
    ブラウザで直接強力なプロンプトを作成およびテストします。
  </Card>
</CardGroup>

ご質問がある場合や支援が必要な場合は、[サポートチーム](https://support.claude.com/)に連絡するか、[Discordコミュニティ](https://www.anthropic.com/discord)を参照してください。