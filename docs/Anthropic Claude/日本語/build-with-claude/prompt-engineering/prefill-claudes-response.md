# Claude の応答を事前入力してより大きな出力制御を実現

Claude の応答を事前入力して、出力をより細かく制御する方法を学びます。

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

<Note>
事前入力は非拡張思考モードでのみ利用可能です。現在、拡張思考ではサポートされていません。
</Note>

Claude を使用する場合、`Assistant` メッセージを事前入力することで応答をガイドする独特の機能があります。この強力なテクニックにより、Claude のアクションを指示し、前置きをスキップし、JSON や XML などの特定の形式を強制し、ロールプレイシナリオでキャラクターの一貫性を保つことさえできます。

Claude が期待通りに動作していない場合がありますが、いくつかの事前入力された文は Claude のパフォーマンスを大幅に向上させることができます。少しの事前入力は大きな効果があります！

## Claude の応答を事前入力する方法

事前入力するには、`Assistant` メッセージに目的の初期テキストを含めます（Claude の応答は `Assistant` メッセージが終わるところから続きます）:

```python
import anthropic

client = anthropic.Anthropic()
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "What is your favorite color?"},
        {"role": "assistant", "content": "As an AI assistant, I don't have a favorite color, But if I had to pick, it would be green because"}  # Prefill here
    ]
)
```

<Warning>
  事前入力コンテンツは末尾の空白で終わることはできません。`"As an AI assistant, I "` のような事前入力（末尾にスペースがある）はエラーになります。
</Warning>

### 例

#### 例 1: 出力形式の制御と前置きのスキップ

<Tip>**パワーユーザーのヒント**: `{` を事前入力すると、Claude は前置きをスキップして JSON オブジェクトを直接出力するようになります。これはより清潔で、より簡潔で、プログラムが追加処理なしで解析しやすくなります。
特定のスキーマに準拠する保証された JSON 出力については、事前入力の代わりに [構造化出力](/docs/ja/build-with-claude/structured-outputs) の使用を検討してください。構造化出力により、Claude の応答が常に定義された JSON スキーマと一致することが保証され、厳密な形式準拠が必要な本番アプリケーションに最適です。</Tip>

    <section title="例: 事前入力なしの構造化データ抽出">

    | ロール | コンテンツ |
    | ---- | ------- |
    | ユーザー | この製品説明から名前、サイズ、価格、色を JSON オブジェクトとして抽出してください:<br/><br/>\<description><br/>SmartHome Mini はコンパクトなスマートホームアシスタントで、黒または白で利用可能で、わずか $49.99 です。幅わずか 5 インチで、音声またはアプリを使用してライト、サーモスタット、その他の接続デバイスを制御できます。自宅のどこに配置しても使用できます。この手頃な価格のハブは、スマートデバイスに便利なハンズフリー制御をもたらします。<br/>\</description> |
    | アシスタント | JSON 形式で抽出された情報は次のとおりです:<br/><br/>\`\`\`json<br/>\{<br/>  "name": "SmartHome Mini",<br/>  "size": "5 inches wide",<br/>  "price": "\$49.99",<br/>  "colors": ["black", "white"]<br/>\}<br/>\`\`\`<br/><br/>製品説明から次の詳細を抽出しました:<br/>- **名前**: SmartHome Mini<br/>- **サイズ**: 幅 5 インチ<br/>- **価格**: $49.99<br/>- **色**: 黒と白で利用可能<br/><br/>JSON オブジェクトは、プログラムが解析して使用しやすい構造化形式を提供します。変更が必要な場合や他にご質問がある場合はお知らせください！ |
    
</section>

    <section title="例: 事前入力ありの構造化データ抽出">

    | ロール | コンテンツ |
    | ---- | ------- |
    | ユーザー | この製品説明から名前、サイズ、価格、色を JSON オブジェクトとして抽出してください:<br/><br/>\<description><br/>SmartHome Mini はコンパクトなスマートホームアシスタントで、黒または白で利用可能で、わずか $49.99 です。幅わずか 5 インチで、音声またはアプリを使用してライト、サーモスタット、その他の接続デバイスを制御できます。自宅のどこに配置しても使用できます。この手頃な価格のハブは、スマートデバイスに便利なハンズフリー制御をもたらします。<br/>\</description> |
    | アシスタント（事前入力） | \{ |
    | アシスタント（Claude の応答） | "name": "SmartHome Mini",<br/>"size": "5 inches wide",<br/>"price": "\$49.99",<br/>"colors": [<br/>  "black",<br/>  "white"<br/>]<br/>\} |
    
</section>

#### 例 2: ロールプレイシナリオでキャラクターを維持する

<Tip>**ロールプレイのヒント**: 括弧で囲まれた `[ROLE_NAME]` を事前入力すると、より長く複雑な会話でも Claude がキャラクターを保つことができます。これは `system` パラメータのロールプロンプティングと組み合わせると特に強力です。</Tip>

    <section title="例: ロールプロンプティングなしでキャラクターを維持">

    | ロール | コンテンツ |
    | ---- | ------- |
    | ユーザー（「Sherlock Holmes」Claude との 50 ターンの会話） | この靴の所有者について何を推測しますか？ \<image>muddy_shoe.jpg\</image> |
    | アシスタント | AI アシスタントとして、提供していただいた泥だらけの靴の画像を分析させていただきます。推測は次のとおりです... |
    
</section>

    <section title="例: ロールプロンプティングありでキャラクターを維持">

    | ロール | コンテンツ |
    | ---- | ------- |
    | ユーザー（「Sherlock Holmes」Claude との 50 ターンの会話） | この靴の所有者について何を推測しますか？ <br/>\<image>muddy_shoe.jpg\</image> |
    | アシスタント（事前入力） | [Sherlock Holmes] |
    | アシスタント（Claude の応答） | ああ、ここに何があるのか？最も奇妙な標本だ、Watson！この靴を識別眼で調べてみましょう。泥は、ご覧のように、一般的なロンドン粘土ではなく、Hampstead Heath の周辺にのみ見られる鉄分豊富な土壌の特徴的な赤褐色です。しかし、靴底の摩耗は、Heath の緩やかな斜面よりも Whitechapel の石畳に適した歩き方を示唆しています。<br/><br/>さあ、靴ひもを見てください！それらは医療専門家に好まれる特定の結び方で結ばれています。おそらく手術ガウンを結ぶ年間の習慣から得られたものです。しかし、つま先ボックスの傷は別の話を語っています。それらは武道、特に Baritsu で採用される可能性のあるキック動作と一致しています。<br/><br/>したがって、不在の靴の所有者は医者、おそらく外科医で、Whitechapel に住んでいますが Hampstead Heath に頻繁に訪れます。おそらく好奇心の強い目から離れた秘密の Baritsu 練習のためです。最も興味深いケースです、Watson！急いで行きましょう。ゲームが始まっています！ |
    
</section>

---

<CardGroup cols={3}>
  <Card title="メッセージの操作" icon="messages" href="/docs/ja/build-with-claude/working-with-messages">
    事前入力およびその他の Messages API パターンのさらに多くの例を参照してください。
  </Card>
  <Card title="プロンプトライブラリ" icon="link" href="/docs/ja/resources/prompt-library/library">
    様々なタスクとユースケースのためのキュレーションされたプロンプトの選択から着想を得てください。
  </Card>
  <Card title="GitHub プロンプティングチュートリアル" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    ドキュメントに記載されているプロンプトエンジニアリングの概念をカバーする例が豊富なチュートリアル。
  </Card>
  <Card title="Google Sheets プロンプティングチュートリアル" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    インタラクティブなスプレッドシートを使用したプロンプトエンジニアリングチュートリアルの軽量版。
  </Card>
</CardGroup>