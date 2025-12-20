# 埋め込み

テキスト埋め込みは、意味的類似性を測定することを可能にするテキストの数値表現です。このガイドでは、埋め込み、その応用、および検索、推薦、異常検出などのタスクに埋め込みモデルを使用する方法を紹介します。

---

## 埋め込みを実装する前に

埋め込みプロバイダーを選択する際、ニーズと好みに応じて考慮できるいくつかの要因があります：

- データセットサイズとドメイン特異性：モデル訓練データセットのサイズと、埋め込みたいドメインとの関連性。一般的に、より大きなまたはよりドメイン固有のデータは、より良いドメイン内埋め込みを生成します
- 推論パフォーマンス：埋め込み検索速度とエンドツーエンドレイテンシ。これは大規模な本番デプロイメントにとって特に重要な考慮事項です
- カスタマイゼーション：プライベートデータでの継続的な訓練、または非常に特定のドメインに対するモデルの特殊化のオプション。これは独特な語彙でのパフォーマンスを向上させることができます

## Anthropicで埋め込みを取得する方法

Anthropicは独自の埋め込みモデルを提供していません。上記のすべての考慮事項を包含する幅広い選択肢と機能を持つ埋め込みプロバイダーの一つがVoyage AIです。

Voyage AIは最先端の埋め込みモデルを作成し、金融や医療などの特定の業界ドメイン向けのカスタマイズされたモデル、または個別の顧客向けのオーダーメイドのファインチューニングされたモデルを提供しています。

このガイドの残りの部分はVoyage AI向けですが、特定のユースケースに最適な選択肢を見つけるために、さまざまな埋め込みベンダーを評価することをお勧めします。

## 利用可能なモデル

Voyageは以下のテキスト埋め込みモデルの使用を推奨しています：

| モデル | コンテキスト長 | 埋め込み次元 | 説明 |
| --- | --- | --- | --- |
| `voyage-3-large` | 32,000 | 1024（デフォルト）、256、512、2048 | 最高の汎用および多言語検索品質。詳細は[ブログ投稿](https://blog.voyageai.com/2025/01/07/voyage-3-large/)をご覧ください。 |
| `voyage-3.5` | 32,000 | 1024（デフォルト）、256、512、2048 | 汎用および多言語検索品質に最適化。詳細は[ブログ投稿](https://blog.voyageai.com/2025/05/20/voyage-3-5/)をご覧ください。 |
| `voyage-3.5-lite` | 32,000 | 1024（デフォルト）、256、512、2048 | レイテンシとコストに最適化。詳細は[ブログ投稿](https://blog.voyageai.com/2025/05/20/voyage-3-5/)をご覧ください。 |
| `voyage-code-3` | 32,000 | 1024（デフォルト）、256、512、2048 | **コード**検索に最適化。詳細は[ブログ投稿](https://blog.voyageai.com/2024/12/04/voyage-code-3/)をご覧ください。 |
| `voyage-finance-2` | 32,000 | 1024 | **金融**検索とRAGに最適化。詳細は[ブログ投稿](https://blog.voyageai.com/2024/06/03/domain-specific-embeddings-finance-edition-voyage-finance-2/)をご覧ください。 |
| `voyage-law-2` | 16,000 | 1024 | **法的**および**長いコンテキスト**検索とRAGに最適化。すべてのドメインでのパフォーマンスも向上。詳細は[ブログ投稿](https://blog.voyageai.com/2024/04/15/domain-specific-embeddings-and-retrieval-legal-edition-voyage-law-2/)をご覧ください。 |

さらに、以下のマルチモーダル埋め込みモデルが推奨されます：

| モデル | コンテキスト長 | 埋め込み次元 | 説明 |
| --- | --- | --- | --- |
| `voyage-multimodal-3` | 32000 | 1024 | PDF、スライド、テーブル、図などのスクリーンショットなど、インターリーブされたテキストとコンテンツリッチな画像をベクトル化できる豊富なマルチモーダル埋め込みモデル。詳細は[ブログ投稿](https://blog.voyageai.com/2024/11/12/voyage-multimodal-3/)をご覧ください。 |

どのテキスト埋め込みモデルを使用するかの決定にお困りですか？[FAQ](https://docs.voyageai.com/docs/faq#what-embedding-models-are-available-and-which-one-should-i-use&ref=anthropic)をご確認ください。

## Voyage AIを始める

Voyage埋め込みにアクセスするには：

1. Voyage AIのウェブサイトでサインアップ
2. APIキーを取得
3. 便宜上、APIキーを環境変数として設定：

```bash
export VOYAGE_API_KEY="<your secret key>"
```

公式の[`voyageai` Pythonパッケージ](https://github.com/voyage-ai/voyageai-python)またはHTTPリクエストのいずれかを使用して埋め込みを取得できます。以下で説明します。

### Voyage Pythonライブラリ

`voyageai`パッケージは以下のコマンドを使用してインストールできます：

```bash
pip install -U voyageai
```

その後、クライアントオブジェクトを作成し、テキストの埋め込みに使用を開始できます：

```python
import voyageai

vo = voyageai.Client()
# これは自動的に環境変数VOYAGE_API_KEYを使用します。
# または、vo = voyageai.Client(api_key="<your secret key>")を使用できます

texts = ["Sample text 1", "Sample text 2"]

result = vo.embed(texts, model="voyage-3.5", input_type="document")
print(result.embeddings[0])
print(result.embeddings[1])
```

`result.embeddings`は、それぞれ1024個の浮動小数点数を含む2つの埋め込みベクトルのリストになります。上記のコードを実行すると、2つの埋め込みが画面に印刷されます：

```
[-0.013131560757756233, 0.019828535616397858, ...]   # "Sample text 1"の埋め込み
[-0.0069352793507277966, 0.020878976210951805, ...]  # "Sample text 2"の埋め込み
```

埋め込みを作成する際、`embed()`関数にいくつかの他の引数を指定できます。

Voyage pythonパッケージの詳細については、[Voyageドキュメント](https://docs.voyageai.com/docs/embeddings#python-api)をご覧ください。

### Voyage HTTP API

Voyage HTTP APIをリクエストして埋め込みを取得することもできます。例えば、ターミナルで`curl`コマンドを通じてHTTPリクエストを送信できます：

```bash
curl https://api.voyageai.com/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $VOYAGE_API_KEY" \
  -d '{
    "input": ["Sample text 1", "Sample text 2"],
    "model": "voyage-3.5"
  }'
```

取得するレスポンスは、埋め込みとトークン使用量を含むJSONオブジェクトです：

```json
{
  "object": "list",
  "data": [
    {
      "embedding": [-0.013131560757756233, 0.019828535616397858, ...],
      "index": 0
    },
    {
      "embedding": [-0.0069352793507277966, 0.020878976210951805, ...],
      "index": 1
    }
  ],
  "model": "voyage-3.5",
  "usage": {
    "total_tokens": 10
  }
}

```

Voyage HTTP APIの詳細については、[Voyageドキュメント](https://docs.voyageai.com/reference/embeddings-api)をご覧ください。

### AWS Marketplace

Voyage埋め込みは[AWS Marketplace](https://aws.amazon.com/marketplace/seller-profile?id=seller-snt4gb6fd7ljg)で利用可能です。AWSでVoyageにアクセスするための手順は[こちら](https://docs.voyageai.com/docs/aws-marketplace-model-package?ref=anthropic)で利用可能です。

## クイックスタート例

埋め込みの取得方法がわかったので、簡単な例を見てみましょう。

検索対象の6つのドキュメントからなる小さなコーパスがあるとします

```python
documents = [
    "The Mediterranean diet emphasizes fish, olive oil, and vegetables, believed to reduce chronic diseases.",
    "Photosynthesis in plants converts light energy into glucose and produces essential oxygen.",
    "20th-century innovations, from radios to smartphones, centered on electronic advancements.",
    "Rivers provide water, irrigation, and habitat for aquatic species, vital for ecosystems.",
    "Apple's conference call to discuss fourth fiscal quarter results and business updates is scheduled for Thursday, November 2, 2023 at 2:00 p.m. PT / 5:00 p.m. ET.",
    "Shakespeare's works, like 'Hamlet' and 'A Midsummer Night's Dream,' endure in literature."
]

```

まず、Voyageを使用してそれぞれを埋め込みベクトルに変換します

```python
import voyageai

vo = voyageai.Client()

# ドキュメントを埋め込む
doc_embds = vo.embed(
    documents, model="voyage-3.5", input_type="document"
).embeddings
```

埋め込みにより、ベクトル空間でセマンティック検索/検索を行うことができます。例のクエリが与えられた場合、

```python
query = "When is Apple's conference call scheduled?"
```

これを埋め込みに変換し、埋め込み空間での距離に基づいて最も関連性の高いドキュメントを見つけるために最近傍検索を実行します。

```python
import numpy as np

# クエリを埋め込む
query_embd = vo.embed(
    [query], model="voyage-3.5", input_type="query"
).embeddings[0]

# 類似性を計算
# Voyage埋め込みは長さ1に正規化されているため、内積と
# コサイン類似度は同じです。
similarities = np.dot(doc_embds, query_embd)

retrieved_id = np.argmax(similarities)
print(documents[retrieved_id])
```

ドキュメントとクエリの埋め込みにそれぞれ`input_type="document"`と`input_type="query"`を使用していることに注意してください。詳細な仕様は[こちら](/docs/ja/build-with-claude/embeddings#voyage-python-package)で確認できます。

出力は5番目のドキュメントになり、これは実際にクエリに最も関連性があります：

```
Apple's conference call to discuss fourth fiscal quarter results and business updates is scheduled for Thursday, November 2, 2023 at 2:00 p.m. PT / 5:00 p.m. ET.
```

ベクトルデータベースを含む埋め込みを使用したRAGの詳細なクックブックセットをお探しの場合は、[RAGクックブック](https://github.com/anthropics/anthropic-cookbook/blob/main/third_party/Pinecone/rag_using_pinecone.ipynb)をご確認ください。

## FAQ

  <section title="なぜVoyage埋め込みは優れた品質を持つのですか？">

    埋め込みモデルは、生成モデルと同様に、セマンティックコンテキストを捉えて圧縮するために強力なニューラルネットワークに依存しています。Voyageの経験豊富なAI研究者チームは、以下を含む埋め込みプロセスのすべてのコンポーネントを最適化しています：
    - モデルアーキテクチャ
    - データ収集
    - 損失関数
    - オプティマイザー選択

    Voyageの技術的アプローチについて詳しくは、彼らの[ブログ](https://blog.voyageai.com/)をご覧ください。
  
</section>

  <section title="どの埋め込みモデルが利用可能で、どれを使用すべきですか？">

    汎用埋め込みには、以下を推奨します：
    - `voyage-3-large`：最高品質
    - `voyage-3.5-lite`：最低レイテンシとコスト
    - `voyage-3.5`：競争力のある価格ポイントで優れた検索品質を持つバランスの取れたパフォーマンス
    
    検索には、`input_type`パラメータを使用してテキストがクエリかドキュメントタイプかを指定します。

    ドメイン固有モデル：

    - 法的タスク：`voyage-law-2`
    - コードとプログラミングドキュメント：`voyage-code-3`
    - 金融関連タスク：`voyage-finance-2`
  
</section>

  <section title="どの類似度関数を使用すべきですか？">

    Voyage埋め込みは、内積類似度、コサイン類似度、またはユークリッド距離のいずれかで使用できます。埋め込み類似度についての説明は[こちら](https://www.pinecone.io/learn/vector-similarity/)で見つけることができます。

    Voyage AI埋め込みは長さ1に正規化されています。これは以下を意味します：

    - コサイン類似度は内積類似度と等価であり、後者はより迅速に計算できます。
    - コサイン類似度とユークリッド距離は同一のランキングをもたらします。
  
</section>

  <section title="文字、単語、トークンの関係は何ですか？">

    この[ページ](https://docs.voyageai.com/docs/tokenization?ref=anthropic)をご覧ください。
  
</section>

  <section title="input_typeパラメータをいつ、どのように使用すべきですか？">

    すべての検索タスクとユースケース（例：RAG）について、`input_type`パラメータを使用して入力テキストがクエリかドキュメントかを指定することを推奨します。`input_type`を省略したり、`input_type=None`を設定したりしないでください。入力テキストがクエリかドキュメントかを指定することで、検索のためのより良い密なベクトル表現を作成でき、より良い検索品質につながります。

    `input_type`パラメータを使用する際、埋め込み前に入力テキストに特別なプロンプトが前置されます。具体的には：

    > 📘 **`input_type`に関連するプロンプト**
    > 
    > - クエリの場合、プロンプトは「Represent the query for retrieving supporting documents: 」です。
    > - ドキュメントの場合、プロンプトは「Represent the document for retrieval: 」です。
    > - 例
    >     - `input_type="query"`の場合、「When is Apple's conference call scheduled?」のようなクエリは「**Represent the query for retrieving supporting documents:** When is Apple's conference call scheduled?」になります。
    >     - `input_type="document"`の場合、「Apple's conference call to discuss fourth fiscal quarter results and business updates is scheduled for Thursday, November 2, 2023 at 2:00 p.m. PT / 5:00 p.m. ET.」のようなクエリは「**Represent the document for retrieval:** Apple's conference call to discuss fourth fiscal quarter results and business updates is scheduled for Thursday, November 2, 2023 at 2:00 p.m. PT / 5:00 p.m. ET.」になります。

    `voyage-large-2-instruct`は、名前が示すように、入力テキストに前置される追加の指示に応答するように訓練されています。分類、クラスタリング、または他の[MTEB](https://huggingface.co/mteb)サブタスクについては、[こちら](https://github.com/voyage-ai/voyage-large-2-instruct)の指示を使用してください。
  
</section>

  <section title="どの量子化オプションが利用可能ですか？">

    埋め込みでの量子化は、32ビット単精度浮動小数点数などの高精度値を、8ビット整数や1ビットバイナリ値などの低精度フォーマットに変換し、ストレージ、メモリ、コストをそれぞれ4倍と32倍削減します。サポートされているVoyageモデルは、`output_dtype`パラメータで出力データ型を指定することで量子化を有効にします：

    - `float`：返される各埋め込みは32ビット（4バイト）単精度浮動小数点数のリストです。これはデフォルトで、最高の精度/検索精度を提供します。
    - `int8`と`uint8`：返される各埋め込みは、それぞれ-128から127と0から255の範囲の8ビット（1バイト）整数のリストです。
    - `binary`と`ubinary`：返される各埋め込みは、ビットパックされた量子化された単一ビット埋め込み値を表す8ビット整数のリストです：`binary`の場合は`int8`、`ubinary`の場合は`uint8`。返される整数のリストの長さは、埋め込みの実際の次元の1/8です。バイナリタイプはオフセットバイナリ方法を使用し、以下のFAQで詳しく学ぶことができます。

    > **バイナリ量子化の例**
    > 
    > 以下の8つの埋め込み値を考えてみてください：-0.03955078、0.006214142、-0.07446289、-0.039001465、0.0046463013、0.00030612946、-0.08496094、0.03994751。バイナリ量子化では、ゼロ以下の値はバイナリゼロに量子化され、正の値はバイナリ1に量子化され、以下のバイナリシーケンスになります：0、1、0、0、1、1、0、1。これらの8ビットは単一の8ビット整数01001101にパックされます（左端のビットが最上位ビット）。
    >   - `ubinary`：バイナリシーケンスは直接変換され、符号なし整数（`uint8`）77として表現されます。
    >   - `binary`：バイナリシーケンスは、オフセットバイナリ方法を使用して計算された符号付き整数（`int8`）-51として表現されます（77 - 128 = -51）。
  
</section>

  <section title="Matryoshka埋め込みをどのように切り詰めることができますか？">

    Matryoshka学習は、単一のベクトル内で粗から細への表現を持つ埋め込みを作成します。複数の出力次元をサポートする`voyage-code-3`などのVoyageモデルは、このようなMatryoshka埋め込みを生成します。次元の先頭サブセットを保持することで、これらのベクトルを切り詰めることができます。例えば、以下のPythonコードは1024次元ベクトルを256次元に切り詰める方法を示しています：

    ```python
    import voyageai
    import numpy as np

    def embd_normalize(v: np.ndarray) -> np.ndarray:
        """
        2D numpy配列の行を、各行をそのユークリッドノルムで割ることで単位ベクトルに正規化します。
        ゼロ除算を防ぐために、任意の行のノルムがゼロの場合はValueErrorを発生させます。
        """
        row_norms = np.linalg.norm(v, axis=1, keepdims=True)
        if np.any(row_norms == 0):
            raise ValueError("Cannot normalize rows with a norm of zero.")
        return v / row_norms


    vo = voyageai.Client()

    # voyage-code-3ベクトルを生成します。デフォルトでは1024次元の浮動小数点数です
    embd = vo.embed(['Sample text 1', 'Sample text 2'], model='voyage-code-3').embeddings

    # より短い次元を設定
    short_dim = 256

    # ベクトルをより短い次元にリサイズして正規化
    resized_embd = embd_normalize(np.array(embd)[:, :short_dim]).tolist()
    ```
  
</section>

## 価格

最新の価格詳細については、Voyageの[価格ページ](https://docs.voyageai.com/docs/pricing?ref=anthropic)をご覧ください。