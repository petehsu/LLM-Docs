# 嵌入向量

文本嵌入向量是文本的數值表示，能夠測量語義相似性。本指南介紹嵌入向量、其應用，以及如何使用嵌入模型進行搜索、推薦和異常檢測等任務。

---

## 實施嵌入向量之前

在選擇嵌入向量提供商時，根據您的需求和偏好，有幾個因素可以考慮：

- 數據集大小和領域特異性：模型訓練數據集的大小及其與您要嵌入的領域的相關性。更大或更具領域特異性的數據通常會產生更好的領域內嵌入向量
- 推理性能：嵌入查找速度和端到端延遲。這對於大規模生產部署來說是一個特別重要的考慮因素
- 自定義：在私有數據上繼續訓練的選項，或針對非常特定領域的模型專業化。這可以提高在獨特詞彙表上的性能

## 如何通過 Anthropic 獲取嵌入向量

Anthropic 不提供自己的嵌入模型。一個擁有廣泛選項和功能的嵌入向量提供商，涵蓋了上述所有考慮因素的是 Voyage AI。

Voyage AI 製作最先進的嵌入模型，並為特定行業領域（如金融和醫療保健）提供定制模型，或為個別客戶提供定制微調模型。

本指南的其餘部分針對 Voyage AI，但我們鼓勵您評估各種嵌入向量供應商，以找到最適合您特定用例的選擇。

## 可用模型

Voyage 推薦使用以下文本嵌入模型：

| 模型 | 上下文長度 | 嵌入維度 | 描述 |
| --- | --- | --- | --- |
| `voyage-3-large` | 32,000 | 1024（默認）、256、512、2048 | 最佳通用和多語言檢索質量。詳情請參見[博客文章](https://blog.voyageai.com/2025/01/07/voyage-3-large/)。 |
| `voyage-3.5` | 32,000 | 1024（默認）、256、512、2048 | 針對通用和多語言檢索質量進行優化。詳情請參見[博客文章](https://blog.voyageai.com/2025/05/20/voyage-3-5/)。 |
| `voyage-3.5-lite` | 32,000 | 1024（默認）、256、512、2048 | 針對延遲和成本進行優化。詳情請參見[博客文章](https://blog.voyageai.com/2025/05/20/voyage-3-5/)。 |
| `voyage-code-3` | 32,000 | 1024（默認）、256、512、2048 | 針對**代碼**檢索進行優化。詳情請參見[博客文章](https://blog.voyageai.com/2024/12/04/voyage-code-3/)。 |
| `voyage-finance-2` | 32,000 | 1024 | 針對**金融**檢索和 RAG 進行優化。詳情請參見[博客文章](https://blog.voyageai.com/2024/06/03/domain-specific-embeddings-finance-edition-voyage-finance-2/)。 |
| `voyage-law-2` | 16,000 | 1024 | 針對**法律**和**長上下文**檢索和 RAG 進行優化。同時改善了所有領域的性能。詳情請參見[博客文章](https://blog.voyageai.com/2024/04/15/domain-specific-embeddings-and-retrieval-legal-edition-voyage-law-2/)。 |

此外，推薦以下多模態嵌入模型：

| 模型 | 上下文長度 | 嵌入維度 | 描述 |
| --- | --- | --- | --- |
| `voyage-multimodal-3` | 32000 | 1024 | 豐富的多模態嵌入模型，可以向量化交錯的文本和內容豐富的圖像，如 PDF、幻燈片、表格、圖表等的截圖。詳情請參見[博客文章](https://blog.voyageai.com/2024/11/12/voyage-multimodal-3/)。 |

需要幫助決定使用哪個文本嵌入模型？查看[常見問題](https://docs.voyageai.com/docs/faq#what-embedding-models-are-available-and-which-one-should-i-use&ref=anthropic)。

## Voyage AI 入門

要訪問 Voyage 嵌入向量：

1. 在 Voyage AI 網站上註冊
2. 獲取 API 密鑰
3. 為方便起見，將 API 密鑰設置為環境變量：

```bash
export VOYAGE_API_KEY="<your secret key>"
```

您可以通過使用官方的 [`voyageai` Python 包](https://github.com/voyage-ai/voyageai-python)或 HTTP 請求來獲取嵌入向量，如下所述。

### Voyage Python 庫

可以使用以下命令安裝 `voyageai` 包：

```bash
pip install -U voyageai
```

然後，您可以創建一個客戶端對象並開始使用它來嵌入您的文本：

```python
import voyageai

vo = voyageai.Client()
# 這將自動使用環境變量 VOYAGE_API_KEY。
# 或者，您可以使用 vo = voyageai.Client(api_key="<your secret key>")

texts = ["Sample text 1", "Sample text 2"]

result = vo.embed(texts, model="voyage-3.5", input_type="document")
print(result.embeddings[0])
print(result.embeddings[1])
```

`result.embeddings` 將是一個包含兩個嵌入向量的列表，每個向量包含 1024 個浮點數。運行上述代碼後，兩個嵌入向量將在屏幕上打印出來：

```
[-0.013131560757756233, 0.019828535616397858, ...]   # embedding for "Sample text 1"
[-0.0069352793507277966, 0.020878976210951805, ...]  # embedding for "Sample text 2"
```

在創建嵌入向量時，您可以為 `embed()` 函數指定一些其他參數。

有關 Voyage python 包的更多信息，請參見 [Voyage 文檔](https://docs.voyageai.com/docs/embeddings#python-api)。

### Voyage HTTP API

您也可以通過請求 Voyage HTTP API 來獲取嵌入向量。例如，您可以在終端中通過 `curl` 命令發送 HTTP 請求：

```bash
curl https://api.voyageai.com/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $VOYAGE_API_KEY" \
  -d '{
    "input": ["Sample text 1", "Sample text 2"],
    "model": "voyage-3.5"
  }'
```

您將得到的響應是一個包含嵌入向量和令牌使用情況的 JSON 對象：

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

有關 Voyage HTTP API 的更多信息，請參見 [Voyage 文檔](https://docs.voyageai.com/reference/embeddings-api)。

### AWS Marketplace

Voyage 嵌入向量可在 [AWS Marketplace](https://aws.amazon.com/marketplace/seller-profile?id=seller-snt4gb6fd7ljg) 上獲得。在 AWS 上訪問 Voyage 的說明可在[這裡](https://docs.voyageai.com/docs/aws-marketplace-model-package?ref=anthropic)找到。

## 快速入門示例

現在我們知道如何獲取嵌入向量，讓我們看一個簡短的示例。

假設我們有一個包含六個文檔的小語料庫來檢索

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

我們首先使用 Voyage 將每個文檔轉換為嵌入向量

```python
import voyageai

vo = voyageai.Client()

# Embed the documents
doc_embds = vo.embed(
    documents, model="voyage-3.5", input_type="document"
).embeddings
```

嵌入向量將允許我們在向量空間中進行語義搜索/檢索。給定一個示例查詢，

```python
query = "When is Apple's conference call scheduled?"
```

我們將其轉換為嵌入向量，並進行最近鄰搜索，根據嵌入空間中的距離找到最相關的文檔。

```python
import numpy as np

# Embed the query
query_embd = vo.embed(
    [query], model="voyage-3.5", input_type="query"
).embeddings[0]

# Compute the similarity
# Voyage embeddings are normalized to length 1, therefore dot-product
# and cosine similarity are the same.
similarities = np.dot(doc_embds, query_embd)

retrieved_id = np.argmax(similarities)
print(documents[retrieved_id])
```

請注意，我們分別使用 `input_type="document"` 和 `input_type="query"` 來嵌入文檔和查詢。更多規範可以在[這裡](/docs/zh-TW/build-with-claude/embeddings#voyage-python-package)找到。

輸出將是第 5 個文檔，這確實是與查詢最相關的：

```
Apple's conference call to discuss fourth fiscal quarter results and business updates is scheduled for Thursday, November 2, 2023 at 2:00 p.m. PT / 5:00 p.m. ET.
```

如果您正在尋找關於如何使用嵌入向量進行 RAG 的詳細教程集，包括向量數據庫，請查看我們的 [RAG 教程](https://github.com/anthropics/anthropic-cookbook/blob/main/third_party/Pinecone/rag_using_pinecone.ipynb)。

## 常見問題

  <section title="為什麼 Voyage 嵌入向量具有卓越的質量？">

    嵌入模型依賴強大的神經網絡來捕獲和壓縮語義上下文，類似於生成模型。Voyage 的經驗豐富的 AI 研究團隊優化了嵌入過程的每個組件，包括：
    - 模型架構
    - 數據收集
    - 損失函數
    - 優化器選擇

    在他們的[博客](https://blog.voyageai.com/)上了解更多關於 Voyage 技術方法的信息。
  
</section>

  <section title="有哪些嵌入模型可用，我應該使用哪一個？">

    對於通用嵌入，我們推薦：
    - `voyage-3-large`：最佳質量
    - `voyage-3.5-lite`：最低延遲和成本
    - `voyage-3.5`：在具有競爭力的價格點上平衡性能與卓越的檢索質量
    
    對於檢索，使用 `input_type` 參數來指定文本是查詢還是文檔類型。

    領域特定模型：

    - 法律任務：`voyage-law-2`
    - 代碼和編程文檔：`voyage-code-3`
    - 金融相關任務：`voyage-finance-2`
  
</section>

  <section title="我應該使用哪個相似性函數？">

    您可以將 Voyage 嵌入向量與點積相似性、餘弦相似性或歐幾里得距離一起使用。關於嵌入相似性的解釋可以在[這裡](https://www.pinecone.io/learn/vector-similarity/)找到。

    Voyage AI 嵌入向量被標準化為長度 1，這意味著：

    - 餘弦相似性等同於點積相似性，而後者可以更快地計算。
    - 餘弦相似性和歐幾里得距離將產生相同的排名。
  
</section>

  <section title="字符、單詞和令牌之間的關係是什麼？">

    請參見此[頁面](https://docs.voyageai.com/docs/tokenization?ref=anthropic)。
  
</section>

  <section title="何時以及如何使用 input_type 參數？">

    對於所有檢索任務和用例（例如 RAG），我們建議使用 `input_type` 參數來指定輸入文本是查詢還是文檔。不要省略 `input_type` 或設置 `input_type=None`。指定輸入文本是查詢還是文檔可以為檢索創建更好的密集向量表示，這可以導致更好的檢索質量。

    使用 `input_type` 參數時，特殊提示會在嵌入之前添加到輸入文本的前面。具體來說：

    > 📘 **與 `input_type` 相關的提示**
    > 
    > - 對於查詢，提示是「Represent the query for retrieving supporting documents: 」。
    > - 對於文檔，提示是「Represent the document for retrieval: 」。
    > - 示例
    >     - 當 `input_type="query"` 時，像「When is Apple's conference call scheduled?」這樣的查詢將變成「**Represent the query for retrieving supporting documents:** When is Apple's conference call scheduled?」
    >     - 當 `input_type="document"` 時，像「Apple's conference call to discuss fourth fiscal quarter results and business updates is scheduled for Thursday, November 2, 2023 at 2:00 p.m. PT / 5:00 p.m. ET.」這樣的查詢將變成「**Represent the document for retrieval:** Apple's conference call to discuss fourth fiscal quarter results and business updates is scheduled for Thursday, November 2, 2023 at 2:00 p.m. PT / 5:00 p.m. ET.」

    `voyage-large-2-instruct`，顧名思義，被訓練為對添加到輸入文本前面的附加指令做出響應。對於分類、聚類或其他 [MTEB](https://huggingface.co/mteb) 子任務，請使用[這裡](https://github.com/voyage-ai/voyage-large-2-instruct)的指令。
  
</section>

  <section title="有哪些量化選項可用？">

    嵌入中的量化將高精度值（如 32 位單精度浮點數）轉換為較低精度格式（如 8 位整數或 1 位二進制值），分別將存儲、內存和成本降低 4 倍和 32 倍。支持的 Voyage 模型通過使用 `output_dtype` 參數指定輸出數據類型來啟用量化：

    - `float`：每個返回的嵌入向量是 32 位（4 字節）單精度浮點數的列表。這是默認設置，提供最高的精度/檢索準確性。
    - `int8` 和 `uint8`：每個返回的嵌入向量是 8 位（1 字節）整數的列表，範圍分別為 -128 到 127 和 0 到 255。
    - `binary` 和 `ubinary`：每個返回的嵌入向量是 8 位整數的列表，表示位打包的量化單位嵌入值：`binary` 使用 `int8`，`ubinary` 使用 `uint8`。返回的整數列表的長度是嵌入實際維度的 1/8。二進制類型使用偏移二進制方法，您可以在下面的常見問題中了解更多信息。

    > **二進制量化示例**
    > 
    > 考慮以下八個嵌入值：-0.03955078、0.006214142、-0.07446289、-0.039001465、0.0046463013、0.00030612946、-0.08496094 和 0.03994751。使用二進制量化，小於或等於零的值將被量化為二進制零，正值被量化為二進制一，結果是以下二進制序列：0、1、0、0、1、1、0、1。然後將這八位打包成一個 8 位整數，01001101（最左邊的位作為最高有效位）。
    >   - `ubinary`：二進制序列直接轉換並表示為無符號整數（`uint8`）77。
    >   - `binary`：二進制序列表示為有符號整數（`int8`）-51，使用偏移二進制方法計算（77 - 128 = -51）。
  
</section>

  <section title="如何截斷 Matryoshka 嵌入向量？">

    Matryoshka 學習在單個向量內創建具有粗到細表示的嵌入向量。支持多個輸出維度的 Voyage 模型（如 `voyage-code-3`）生成這樣的 Matryoshka 嵌入向量。您可以通過保留維度的前導子集來截斷這些向量。例如，以下 Python 代碼演示了如何將 1024 維向量截斷為 256 維：

    ```python
    import voyageai
    import numpy as np

    def embd_normalize(v: np.ndarray) -> np.ndarray:
        """
        Normalize the rows of a 2D numpy array to unit vectors by dividing each row by its Euclidean
        norm. Raises a ValueError if any row has a norm of zero to prevent division by zero.
        """
        row_norms = np.linalg.norm(v, axis=1, keepdims=True)
        if np.any(row_norms == 0):
            raise ValueError("Cannot normalize rows with a norm of zero.")
        return v / row_norms


    vo = voyageai.Client()

    # Generate voyage-code-3 vectors, which by default are 1024-dimensional floating-point numbers
    embd = vo.embed(['Sample text 1', 'Sample text 2'], model='voyage-code-3').embeddings

    # Set shorter dimension
    short_dim = 256

    # Resize and normalize vectors to shorter dimension
    resized_embd = embd_normalize(np.array(embd)[:, :short_dim]).tolist()
    ```
  
</section>

## 定價

訪問 Voyage 的[定價頁面](https://docs.voyageai.com/docs/pricing?ref=anthropic)獲取最新的定價詳情。