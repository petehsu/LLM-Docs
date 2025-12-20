# 功能更新

> 平台功能改进和优化记录

## 最新功能更新

<Update label="2025-05-07" description="【AI搜索工具】新增多项实用参数">
  Web Search API 和 API Search in Chat 本次更新新增多项实用参数，帮助您更精准地控制搜索行为，提升数据获取效率。

  **1.请求参数扩展**

  * **count**：支持自定义返回的搜索结果数量。
  * **search\_domain\_filter**：可按指定域名筛选搜索结果。
  * **search\_recency\_filter**：支持按时间范围过滤内容。
  * **content\_size**：可调整网页摘要的字数。

  **2. 响应参数扩展**

  * **publish\_date**：新增网页发布时间字段，便于时效性分析和排序。

  [网络搜索 API 接口文档](/api-reference/%E5%B7%A5%E5%85%B7-api/%E7%BD%91%E7%BB%9C%E6%90%9C%E7%B4%A2)

  [API Search in Chat 接口文档](/api-reference/%E6%A8%A1%E5%9E%8B-api/%E5%AF%B9%E8%AF%9D%E8%A1%A5%E5%85%A8)
</Update>

<Update label="2025-04-28" description="【模型微调】新增支持 DPO 训练能力">
  微调训练平台支持 DPO 文本偏好对齐训练功能。[使用指南](/cn/guide/tools/fine-tuning)

  * 支持范围：glm-4-air、glm-4-9b、glm-4-flash
  * 支持训练方式：全参训练
  * 支持版本：8k
  * [训练计费](https://bigmodel.cn/pricing)：DPO 训练单价同该模型在对应训练方式下 SFT 监督微调训练定价
</Update>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.bigmodel.cn/llms.txt