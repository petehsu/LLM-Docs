# GraphRAG

## 概念介绍

LLM 由于不可避免的幻觉问题，在部分场景的应用效果不佳，借助 RAG 方案可以大幅提升 LLM 的生成质量与可用性。GraphRAG 是由微软研究院开发，它通过结合大型语言模型（LLM）和知识图谱，显著提高了 AI 在处理复杂信息和大型数据集上的问答和主题发现能力。相比基线 RAG，GraphRAG 在全面理解大型数据集方面具有更好的性能。

## 工作原理

1. 提取知识图谱：首先，GraphRAG 从原始文本中创建一个“知识图谱”。这个知识图谱就像一个连接想法的网络，每个想法（或“节点”）都以有意义的方式与其他节点相连。
2. 建立社区层次结构：接下来，GraphRAG 将这些连接的想法组织成组，或称为“社区”。这些社区可以视为相关概念的集群。
3. 生成摘要：对于每个社区，GraphRAG 会生成摘要，捕捉主要点。这有助于理解关键思想，而不会在细节中迷失。
4. 利用结构：当你需要执行涉及检索和生成信息的任务（基于RAG的任务）时，GraphRAG 使用这个组织良好的结构。这使得过程更加高效和准确。 GraphRAG的优势在于它能够提供更准确、上下文相关且全面的答案，相比于传统的仅基于向量的RAG方法。它增强了AI对复杂和私有数据的推理能力，通过以更智能的方式组织信息，允许AI做出更好的决策并提供更多准确的响应。

## 方案

### 运行 GraphRAG

运行 GraphRAG 只需`pip install graphrag`即可，具体使用方法可参考官方手册：[Getting Started](https://microsoft.github.io/graphrag/get_started/)。 使用 GraphRAG 前需要先初始化项目，在项目路径`./graphtest`运行

```
python -m graphrag.index --init --root ./graphtest
```

此时在项目路径下会有：

* Input：用于存放项目知识
* Output：用于运行文件
* prompts：提示词
* .env：api key
* settings.yaml：配置 LLM 要使用 GLM 系列模型运行 GraphRAG 需要分别配置` .env`以及`settings.yaml`两个文件。 在`.env`中，配置你的 api key

```
GRAPHRAG_API_KEY=<you api key>
```

在`settings.yaml`中配置 LLM：

* 将`model`修改为智谱 BigModel 大模型，并将`api_base`配置为智谱大模型的请求 URL，例如：

```
llm:
  api_key: ${GRAPHRAG_API_KEY}
  type: openai_chat
  model: glm-4-air    # 修改 LLM
  api_base: https://open.bigmodel.cn/api/paas/v4    # 修改请求 URL

embeddings:
  async_mode: threaded
  llm:
    api_key: ${GRAPHRAG_API_KEY}
    type: openai_embedding
    model: embedding-3    # 修改向量模型
    api_base: https://open.bigmodel.cn/api/paas/v4    # 修改请求 URL
```

在 Input 目录中存入文本资料后，运行 GraphRAG 构建知识图谱。构建知识图谱的过程需要根据文本数据量的大小等待一定时长，首次运行建议使用较小的文本进行测试。

```
python -m graphrag.index --root ./graphtest
```

### 查询

GraphRAG 的查询模式分为全局查询和局部查询：

* 全局查询：利用知识图谱的层级摘要对整个知识库进行推理总结，适合进行全局的总结分析和摘要以及创造；

```
python -m graphrag.query --root ./graphtest --method global "your query" 
```

* 局部查询：通过扩展相关实体和概念来对特定实体进行推理，适合对特定问题进行分析和总结。

```
python -m graphrag.query --root ./graphtest --method local "your query"
```

## 方案亮点

* 结构化知识表示
* 强大的上下文理解
* 高效的查询处理
* 支持多跳推理
* 生成内容准确相关
* 可解释性强


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.bigmodel.cn/llms.txt