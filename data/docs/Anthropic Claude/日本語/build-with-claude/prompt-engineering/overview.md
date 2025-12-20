# プロンプトエンジニアリングの概要

プロンプトエンジニアリングの基本的なガイドと、Claude を使用してプロンプトを改善するための戦略を学びます。

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

## プロンプトエンジニアリング前に

このガイドは、以下のことを前提としています：
1. ユースケースの成功基準が明確に定義されていること
2. その基準に対して経験的にテストする方法があること
3. 改善したい最初のドラフトプロンプトがあること

そうでない場合は、まずそれを確立することに時間を費やすことを強くお勧めします。[成功基準を定義する](/docs/ja/test-and-evaluate/define-success)と[強力な経験的評価を作成する](/docs/ja/test-and-evaluate/develop-tests)をチェックして、ヒントとガイダンスを確認してください。

<Card title="プロンプトジェネレータ" icon="link" href="/dashboard">
  最初のドラフトプロンプトがありませんか？Claude コンソールのプロンプトジェネレータを試してください！
</Card>

***

## プロンプトエンジニアリングを行う時期

  このガイドは、プロンプトエンジニアリングを通じて制御可能な成功基準に焦点を当てています。
  すべての成功基準または失敗した評価がプロンプトエンジニアリングで最適に解決されるわけではありません。たとえば、レイテンシーとコストは、異なるモデルを選択することで、より簡単に改善できる場合があります。

<section title="プロンプティング vs. ファインチューニング">

  プロンプトエンジニアリングは、ファインチューニングなどの他のモデル動作制御方法よりもはるかに高速であり、はるかに短い時間でパフォーマンスの飛躍的な向上をもたらすことができます。プロンプトエンジニアリングをファインチューニングより優先する理由は次のとおりです：<br/>
  - **リソース効率**：ファインチューニングは高性能な GPU と大容量メモリが必要ですが、プロンプトエンジニアリングはテキスト入力のみが必要なため、はるかにリソースフレンドリーです。
  - **コスト効率**：クラウドベースの AI サービスの場合、ファインチューニングは大きなコストがかかります。プロンプトエンジニアリングはベースモデルを使用するため、通常はより安価です。
  - **モデル更新の維持**：プロバイダーがモデルを更新する場合、ファインチューニングされたバージョンは再トレーニングが必要になる可能性があります。プロンプトは通常、変更なしでバージョン間で機能します。
  - **時間節約**：ファインチューニングには数時間から数日かかる場合があります。対照的に、プロンプトエンジニアリングはほぼ瞬時に結果を提供し、迅速な問題解決が可能になります。
  - **最小限のデータニーズ**：ファインチューニングには、大量のタスク固有のラベル付きデータが必要です。これは稀であるか高価である可能性があります。プロンプトエンジニアリングは、少数ショットまたはゼロショット学習で機能します。
  - **柔軟性と迅速な反復**：さまざまなアプローチを素早く試し、プロンプトを調整し、即座に結果を確認します。この迅速な実験はファインチューニングでは困難です。
  - **ドメイン適応**：再トレーニングなしに、プロンプトでドメイン固有のコンテキストを提供することで、モデルを新しいドメインに簡単に適応させます。
  - **理解の向上**：プロンプトエンジニアリングは、取得されたドキュメントなどの外部コンテンツをモデルがより良く理解し、利用するのに役立つ点で、ファインチューニングよりもはるかに効果的です。
  - **一般的な知識の保持**：ファインチューニングは、モデルが一般的な知識を失う破滅的な忘却のリスクがあります。プロンプトエンジニアリングはモデルの広範な機能を維持します。
  - **透明性**：プロンプトは人間が読める形式で、モデルが受け取る正確な情報を示します。この透明性は、理解とデバッグに役立ちます。

</section>

***

## プロンプトエンジニアリングの方法

このセクションのプロンプトエンジニアリングページは、最も広く効果的なテクニックからより専門的なテクニックへと整理されています。パフォーマンスのトラブルシューティング時には、これらのテクニックを順番に試すことをお勧めしますが、各テクニックの実際の影響はユースケースによって異なります。
1. [プロンプトジェネレータ](/docs/ja/build-with-claude/prompt-engineering/prompt-generator)
2. [明確で直接的に](/docs/ja/build-with-claude/prompt-engineering/be-clear-and-direct)
3. [例を使用する（マルチショット）](/docs/ja/build-with-claude/prompt-engineering/multishot-prompting)
4. [Claude に考えさせる（思考の連鎖）](/docs/ja/build-with-claude/prompt-engineering/chain-of-thought)
5. [XML タグを使用する](/docs/ja/build-with-claude/prompt-engineering/use-xml-tags)
6. [Claude にロールを与える（システムプロンプト）](/docs/ja/build-with-claude/prompt-engineering/system-prompts)
7. [Claude の応答を事前入力する](/docs/ja/build-with-claude/prompt-engineering/prefill-claudes-response)
8. [複雑なプロンプトをチェーンする](/docs/ja/build-with-claude/prompt-engineering/chain-prompts)
9. [長いコンテキストのヒント](/docs/ja/build-with-claude/prompt-engineering/long-context-tips)

***

## プロンプトエンジニアリングチュートリアル

インタラクティブな学習者の場合は、代わりにインタラクティブなチュートリアルに直接飛び込むことができます！

<CardGroup cols={2}>
  <Card title="GitHub プロンプティングチュートリアル" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    ドキュメントに記載されているプロンプトエンジニアリングの概念をカバーする、例が豊富なチュートリアル。
  </Card>
  <Card title="Google Sheets プロンプティングチュートリアル" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    インタラクティブなスプレッドシート経由でのプロンプトエンジニアリングチュートリアルのより軽量なバージョン。
  </Card>
</CardGroup>