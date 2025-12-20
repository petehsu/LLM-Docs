# 嵌入向量

文本嵌入向量是文本的数值表示，能够测量语义相似性。本指南介绍嵌入向量、其应用以及如何使用嵌入模型进行搜索、推荐和异常检测等任务。

---

## 实施嵌入向量之前

在选择嵌入向量提供商时，您可以根据需求和偏好考虑以下几个因素：

- 数据集大小和领域特异性：模型训练数据集的大小及其与您要嵌入的领域的相关性。更大或更具领域特异性的数据通常会产生更好的领域内嵌入向量
- 推理性能：嵌入查找速度和端到端延迟。这对于大规模生产部署来说是一个特别重要的考虑因素
- 定制化：在私有数据上继续训练的选项，或针对非常特定领域的模型专业化。这可以提高在独特词汇表上的性能

## 如何通过 Anthropic 获取嵌入向量

Anthropic 不提供自己的嵌入模型。一个拥有广泛选择和能力的嵌入向量提供商，涵盖了上述所有考虑因素的是 Voyage AI。

Voyage AI 制作最先进的嵌入模型，并为特定行业领域（如金融和医疗保健）提供定制模型，或为个别客户提供定制微调模型。

本指南的其余部分针对 Voyage AI，但我们鼓励您评估各种嵌入向量供应商，以找到最适合您特定用例的选择。

## 可用模型

Voyage 推荐使用以下文本嵌入模型：

| 模型 | 上下文长度 | 嵌入维度 | 描述 |
| --- | --- | --- | --- |
| `voyage-3-large` | 32,000 | 1024（默认）、256、512、2048 | 最佳通用和多语言检索质量。详情请参见[博客文章](https://blog.voyageai.com/2025/01/07/voyage-3-large/)。 |
| `voyage-3.5` | 32,000 | 1024（默认）、256、512、2048 | 针对通用和多语言检索质量进行优化。详情请参见[博客文章](https://blog.voyageai.com/2025/05/20/voyage-3-5/)。 |
| `voyage-3.5-lite` | 32,000 | 1024（默认）、256、512、2048 | 针对延迟和成本进行优化。详情请参见[博客文章](https://blog.voyageai.com/2025/05/20/voyage-3-5/)。 |
| `voyage-code-3` | 32,000 | 1024（默认）、256、512、2048 | 针对**代码**检索进行优化。详情请参见[博客文章](https://blog.voyageai.com/2024/12/04/voyage-code-3/)。 |
| `voyage-finance-2` | 32,000 | 1024 | 针对**金融**检索和 RAG 进行优化。详情请参见[博客文章](https://blog.voyageai.com/2024/06/03/domain-specific-embeddings-finance-edition-voyage-finance-2/)。 |
| `voyage-law-2` | 16,000 | 1024 | 针对**法律**和**长上下文**检索和 RAG 进行优化。同时在所有领域都有改进的性能。详情请参见[博客文章](https://blog.voyageai.com/2024/04/15/domain-specific-embeddings-and-retrieval-legal-edition-voyage-law-2/)。 |

此外，推荐以下多模态嵌入模型：

| 模型 | 上下文长度 | 嵌入维度 | 描述 |
| --- | --- | --- | --- |
| `voyage-multimodal-3` | 32000 | 1024 | 丰富的多模态嵌入模型，可以向量化交错的文本和内容丰富的图像，如 PDF、幻灯片、表格、图形等的截图。详情请参见[博客文章](https://blog.voyageai.com/2024/11/12/voyage-multimodal-3/)。 |

需要帮助决定使用哪个文本嵌入模型？查看[常见问题解答](https://docs.voyageai.com/docs/faq#what-embedding-models-are-available-and-which-one-should-i-use&ref=anthropic)。

## Voyage AI 入门

要访问 Voyage 嵌入向量：

1. 在 Voyage AI 网站上注册
2. 获取 API 密钥
3. 为方便起见，将 API 密钥设置为环境变量：

```bash
export VOYAGE_API_KEY="<your secret key>"
```

您可以通过使用官方的[`voyageai` Python 包](https://github.com/voyage-ai/voyageai-python)或 HTTP 请求来获取嵌入向量，如下所述。

### Voyage Python 库

可以使用以下命令安装 `voyageai` 包：

```bash
pip install -U voyageai
```

然后，您可以创建一个客户端对象并开始使用它来嵌入您的文本：

```python
import voyageai

vo = voyageai.Client()
# 这将自动使用环境变量 VOYAGE_API_KEY。
# 或者，您可以使用 vo = voyageai.Client(api_key="<your secret key>")

texts = ["Sample text 1", "Sample text 2"]

result = vo.embed(texts, model="voyage-3.5", input_type="document")
print(result.embeddings[0])
print(result.embeddings[1])
```

`result.embeddings` 将是一个包含两个嵌入向量的列表，每个向量包含 1024 个浮点数。运行上述代码后，两个嵌入向量将在屏幕上打印出来：

```
[-0.013131560757756233, 0.019828535616397858, ...]   # "Sample text 1" 的嵌入向量
[-0.0069352793507277966, 0.020878976210951805, ...]  # "Sample text 2" 的嵌入向量
```

在创建嵌入向量时，您可以为 `embed()` 函数指定一些其他参数。

有关 Voyage python 包的更多信息，请参见[Voyage 文档](https://docs.voyageai.com/docs/embeddings#python-api)。

### Voyage HTTP API

您也可以通过请求 Voyage HTTP API 来获取嵌入向量。例如，您可以在终端中通过 `curl` 命令发送 HTTP 请求：

```bash
curl https://api.voyageai.com/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $VOYAGE_API_KEY" \
  -d '{
    "input": ["Sample text 1", "Sample text 2"],
    "model": "voyage-3.5"
  }'
```

您将得到的响应是一个包含嵌入向量和令牌使用情况的 JSON 对象：

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

有关 Voyage HTTP API 的更多信息，请参见[Voyage 文档](https://docs.voyageai.com/reference/embeddings-api)。

### AWS Marketplace

Voyage 嵌入向量在[AWS Marketplace](https://aws.amazon.com/marketplace/seller-profile?id=seller-snt4gb6fd7ljg)上可用。在 AWS 上访问 Voyage 的说明可在[此处](https://docs.voyageai.com/docs/aws-marketplace-model-package?ref=anthropic)找到。

## 快速入门示例

现在我们知道如何获取嵌入向量，让我们看一个简短的示例。

假设我们有一个包含六个文档的小语料库要检索

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

我们首先使用 Voyage 将每个文档转换为嵌入向量

```python
import voyageai

vo = voyageai.Client()

# 嵌入文档
doc_embds = vo.embed(
    documents, model="voyage-3.5", input_type="document"
).embeddings
```

嵌入向量将允许我们在向量空间中进行语义搜索/检索。给定一个示例查询，

```python
query = "When is Apple's conference call scheduled?"
```

我们将其转换为嵌入向量，并进行最近邻搜索，根据嵌入空间中的距离找到最相关的文档。

```python
import numpy as np

# 嵌入查询
query_embd = vo.embed(
    [query], model="voyage-3.5", input_type="query"
).embeddings[0]

# 计算相似性
# Voyage 嵌入向量被归一化为长度 1，因此点积
# 和余弦相似性是相同的。
similarities = np.dot(doc_embds, query_embd)

retrieved_id = np.argmax(similarities)
print(documents[retrieved_id])
```

请注意，我们分别使用 `input_type="document"` 和 `input_type="query"` 来嵌入文档和查询。更多规范可以在[这里](/docs/zh-CN/build-with-claude/embeddings#voyage-python-package)找到。

输出将是第 5 个文档，这确实是与查询最相关的：

```
Apple's conference call to discuss fourth fiscal quarter results and business updates is scheduled for Thursday, November 2, 2023 at 2:00 p.m. PT / 5:00 p.m. ET.
```

如果您正在寻找关于如何使用嵌入向量进行 RAG 的详细教程集，包括向量数据库，请查看我们的[RAG 教程](https://github.com/anthropics/anthropic-cookbook/blob/main/third_party/Pinecone/rag_using_pinecone.ipynb)。

## 常见问题解答

  <section title="为什么 Voyage 嵌入向量具有卓越的质量？">

    嵌入模型依赖强大的神经网络来捕获和压缩语义上下文，类似于生成模型。Voyage 的经验丰富的 AI 研究团队优化嵌入过程的每个组件，包括：
    - 模型架构
    - 数据收集
    - 损失函数
    - 优化器选择

    在他们的[博客](https://blog.voyageai.com/)上了解更多关于 Voyage 技术方法的信息。
  
</section>

  <section title="有哪些嵌入模型可用，我应该使用哪个？">

    对于通用嵌入，我们推荐：
    - `voyage-3-large`：最佳质量
    - `voyage-3.5-lite`：最低延迟和成本
    - `voyage-3.5`：在具有竞争力的价格点上具有卓越检索质量的平衡性能
    
    对于检索，使用 `input_type` 参数来指定文本是查询还是文档类型。

    领域特定模型：

    - 法律任务：`voyage-law-2`
    - 代码和编程文档：`voyage-code-3`
    - 金融相关任务：`voyage-finance-2`
  
</section>

  <section title="我应该使用哪个相似性函数？">

    您可以将 Voyage 嵌入向量与点积相似性、余弦相似性或欧几里得距离一起使用。关于嵌入相似性的解释可以在[这里](https://www.pinecone.io/learn/vector-similarity/)找到。

    Voyage AI 嵌入向量被归一化为长度 1，这意味着：

    - 余弦相似性等同于点积相似性，而后者可以更快地计算。
    - 余弦相似性和欧几里得距离将产生相同的排名。
  
</section>

  <section title="字符、单词和令牌之间的关系是什么？">

    请参见此[页面](https://docs.voyageai.com/docs/tokenization?ref=anthropic)。
  
</section>

  <section title="何时以及如何使用 input_type 参数？">

    对于所有检索任务和用例（例如 RAG），我们建议使用 `input_type` 参数来指定输入文本是查询还是文档。不要省略 `input_type` 或设置 `input_type=None`。指定输入文本是查询还是文档可以为检索创建更好的密集向量表示，这可以导致更好的检索质量。

    使用 `input_type` 参数时，特殊提示会在嵌入之前添加到输入文本前面。具体来说：

    > 📘 **与 `input_type` 相关的提示**
    > 
    > - 对于查询，提示是"Represent the query for retrieving supporting documents: "。
    > - 对于文档，提示是"Represent the document for retrieval: "。
    > - 示例
    >     - 当 `input_type="query"` 时，像"When is Apple's conference call scheduled?"这样的查询将变成"**Represent the query for retrieving supporting documents:** When is Apple's conference call scheduled?"
    >     - 当 `input_type="document"` 时，像"Apple's conference call to discuss fourth fiscal quarter results and business updates is scheduled for Thursday, November 2, 2023 at 2:00 p.m. PT / 5:00 p.m. ET."这样的查询将变成"**Represent the document for retrieval:** Apple's conference call to discuss fourth fiscal quarter results and business updates is scheduled for Thursday, November 2, 2023 at 2:00 p.m. PT / 5:00 p.m. ET."

    `voyage-large-2-instruct`，顾名思义，被训练为对添加到输入文本前面的附加指令做出响应。对于分类、聚类或其他[MTEB](https://huggingface.co/mteb)子任务，请使用[这里](https://github.com/voyage-ai/voyage-large-2-instruct)的指令。
  
</section>

  <section title="有哪些量化选项可用？">

    嵌入中的量化将高精度值（如 32 位单精度浮点数）转换为较低精度格式（如 8 位整数或 1 位二进制值），分别将存储、内存和成本减少 4 倍和 32 倍。支持的 Voyage 模型通过使用 `output_dtype` 参数指定输出数据类型来启用量化：

    - `float`：每个返回的嵌入向量是 32 位（4 字节）单精度浮点数的列表。这是默认值，提供最高精度/检索准确性。
    - `int8` 和 `uint8`：每个返回的嵌入向量是 8 位（1 字节）整数的列表，分别范围从 -128 到 127 和 0 到 255。
    - `binary` 和 `ubinary`：每个返回的嵌入向量是 8 位整数的列表，表示位打包的量化单位嵌入值：`binary` 使用 `int8`，`ubinary` 使用 `uint8`。返回的整数列表的长度是嵌入实际维度的 1/8。二进制类型使用偏移二进制方法，您可以在下面的常见问题解答中了解更多信息。

    > **二进制量化示例**
    > 
    > 考虑以下八个嵌入值：-0.03955078、0.006214142、-0.07446289、-0.039001465、0.0046463013、0.00030612946、-0.08496094 和 0.03994751。通过二进制量化，小于或等于零的值将被量化为二进制零，正值被量化为二进制一，产生以下二进制序列：0、1、0、0、1、1、0、1。然后将这八位打包成一个 8 位整数，01001101（最左边的位作为最高有效位）。
    >   - `ubinary`：二进制序列直接转换并表示为无符号整数（`uint8`）77。
    >   - `binary`：二进制序列表示为有符号整数（`int8`）-51，使用偏移二进制方法计算（77 - 128 = -51）。
  
</section>

  <section title="如何截断 Matryoshka 嵌入向量？">

    Matryoshka 学习在单个向量内创建具有从粗到细表示的嵌入向量。支持多个输出维度的 Voyage 模型（如 `voyage-code-3`）生成这样的 Matryoshka 嵌入向量。您可以通过保留维度的前导子集来截断这些向量。例如，以下 Python 代码演示了如何将 1024 维向量截断为 256 维：

    ```python
    import voyageai
    import numpy as np

    def embd_normalize(v: np.ndarray) -> np.ndarray:
        """
        通过将每行除以其欧几里得范数，将 2D numpy 数组的行归一化为单位向量。
        如果任何行的范数为零，则引发 ValueError 以防止除零。
        """
        row_norms = np.linalg.norm(v, axis=1, keepdims=True)
        if np.any(row_norms == 0):
            raise ValueError("Cannot normalize rows with a norm of zero.")
        return v / row_norms


    vo = voyageai.Client()

    # 生成 voyage-code-3 向量，默认情况下是 1024 维浮点数
    embd = vo.embed(['Sample text 1', 'Sample text 2'], model='voyage-code-3').embeddings

    # 设置较短维度
    short_dim = 256

    # 将向量调整大小并归一化为较短维度
    resized_embd = embd_normalize(np.array(embd)[:, :short_dim]).tolist()
    ```
  
</section>

## 定价

访问 Voyage 的[定价页面](https://docs.voyageai.com/docs/pricing?ref=anthropic)获取最新的定价详情。