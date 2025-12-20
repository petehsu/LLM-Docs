# 更新日志

本页总览

# 更新日志

## 时间: 2025-12-01​

### DeepSeek-V3.2​

`deepseek-chat` 和 `deepseek-reasoner` 都已升级为 DeepSeek-V3.2.

  * `deepseek-chat` 对应 DeepSeek-V3.2 的**非思考模式**
  * `deepseek-reasoner` 对应 DeepSeek-V3.2 的**思考模式**

### DeepSeek-V3.2-Speciale​

我们非正式部署了 DeepSeek-V3.2-Speciale 的 API 服务，API 用户可以通过设置 `base_url="https://api.deepseek.com/v3.2_speciale_expires_on_20251215"` 访问该模型。该模型 API 价格不变，只支持思考模式下的对话功能，不支持工具调用等功能，最大输出长度默认为 128K，支持时间截止至北京时间 2025-12-15 23:59。

详细更新内容请[参阅文档](</zh-cn/news/news251201>)

* * *

## 时间: 2025-09-29​

### DeepSeek-V3.2-Exp​

`deepseek-chat` 和 `deepseek-reasoner` 都已经升级为 DeepSeek-V3.2-Exp。

  * `deepseek-chat` 对应 DeepSeek-V3.2-Exp 的**非思考模式**
  * `deepseek-reasoner` 对应 DeepSeek-V3.2-Exp 的**思考模式**

详细更新内容请[参阅文档](</zh-cn/news/news250929>)

* * *

## 时间: 2025-09-22​

### DeepSeek-V3.1-Terminus​

**`deepseek-chat` 和 `deepseek-reasoner` 都已经升级为 DeepSeek-V3.1-Terminus。**`deepseek-chat` 对应 DeepSeek-V3.1-Terminus 的**非思考模式** ，`deepseek-reasoner` 对应 DeepSeek-V3.1-Terminus 的**思考模式** 。

此次更新在保持模型原有能力的基础上，针对用户反馈的问题进行了改进，包括：

  * 语言一致性：缓解了中英文混杂、偶发异常字符等情况；
  * Agent能力：进一步优化了 Code Agent 与 Search Agent 的表现。

* * *

## 时间: 2025-08-21​

### DeepSeek-V3.1​

**`deepseek-chat` 和 `deepseek-reasoner` 都已经升级为 DeepSeek-V3.1。**`deepseek-chat` 对应 DeepSeek-V3.1 的**非思考模式** ，`deepseek-reasoner` 对应 DeepSeek-V3.1 的**思考模式** 。

  * DeepSeek-V3.1 包含以下主要变化：
    * 混合推理架构：一个模型同时支持思考模式与非思考模式
    * 更高的思考效率：相比 DeepSeek-R1-0528，DeepSeek-V3.1-Think 能在更短时间内给出答案
    * 更强的 Agent 能力：通过 Post-Training 优化，新模型在工具使用与智能体任务中的表现有较大提升
      * SWE-bench Verified: 66.0
      * SWE-bench Multilingual: 54.5
      * Terminal-bench: 31.3

* * *

## 时间: 2025-05-28​

### deepseek-reasoner​

**`deepseek-reasoner` 模型升级为 DeepSeek-R1-0528：**

  * **推理能力增强**
    * 基准测试提升显著（Pass@1）
      * AIME 2025: 70.0→ 87.5 (+17.5)
      * GPQA: 71.5 → 81.0 (+9.5)
      * LCB_v6: 63.5 → 73.3 (+9.8)
      * Aider: 57.0 → 71.6 (+14.6)
    * 注：复杂推理问题相比老版本R1会使用更多tokens
  * **Web前端开发能力优化**
    * 生成的网页与游戏更加美观
  * **幻觉降低**
    * 极大程度抑制了老版本R1所存在的幻觉问题
  * **Json Output与Function Calling 支持**
    * Function call性能
      * Tau-bench score: 53.5 (Airline)/63.9 (Retail)

* * *

## 时间: 2025-03-24​

### deepseek-chat​

**`deepseek-chat` 模型升级为 DeepSeek-V3-0324：**

  * **推理能力增强**
    * 基准测试提升显著
      * MMLU-Pro: 75.9 → 81.2 (+5.3)
      * GPQA: 59.1 → 68.4 (+9.3)
      * AIME: 39.6 → 59.4 (+19.8)
      * LiveCodeBench: 39.2 → 49.2 (+10.0)
  * **Web前端开发能力优化**
    * 代码生成准确率提升
    * 生成的网页与游戏前端更加美观
  * **中文写作能力升级**
    * 风格与内容优化
      * 实现与R1写作风格对齐
      * 中长篇写作内容质量提升
  * **功能增强**
    * 多轮交互式改写能力提升
    * 翻译质量与书信写作优化
  * **中文搜索能力优化**
    * 报告分析类请求优化，输出内容详实
  * **Function Calling 能力改进**
    * Function Calling 准确率提升，修复 V3 之前的问题

* * *

## 时间: 2025-01-20​

### deepseek-reasoner​

  * `deepseek-reasoner` 是我们的新模型 DeepSeek-R1. 可以通过指定 `model=deepseek-reasoner` 调用。
  * 详细更新，请参考: [DeepSeek-R1 正式发布](</zh-cn/news/news250120>)
  * 调用指南，请参考: [推理模型](</zh-cn/guides/thinking_mode>)

* * *

## 时间: 2024-12-26​

### deepseek-chat​

  * `deepseek-chat` 模型升级为 DeepSeek-V3，接口不变，可以通过指定 `model=deepseek-chat` 调用。
  * 详细更新，请参考：[DeepSeek-V3 正式发布](</zh-cn/news/news1226>)

* * *

## 时间：2024-12-10​

### deepseek-chat​

deepseek-chat 模型升级为 DeepSeek-V2.5-1210，模型各项能力提升，相关基准测试：

  * 数学能力：在 MATH-500 基准测试中的表现从 74.8% 提升至 82.8%
  * 代码能力：在 LiveCodebench (08.01 - 12.01) 基准测试中的准确率从 29.2% 提升至 34.38%
  * 中文写作与推理能力：在内部测试集中表现也有相应提升

与此同时，全新版本的模型对文件上传和网页总结功能的用户体验进行了优化。

* * *

## 时间：2024-09-05​

### `deepseek-coder` & `deepseek-chat` 升级为 DeepSeek V2.5 模型​

DeepSeek V2 Chat 和 DeepSeek Coder V2 两个模型已经合并升级，升级后的新模型为 DeepSeek V2.5。

为向前兼容，API 用户通过 `deepseek-coder` 或 `deepseek-chat` 均可以访问新的模型。

新模型在通用能力、代码能力上，都显著超过了旧版本的两个模型。

**新模型更好的对齐了人类的偏好，在写作任务、指令跟随等多方面进行了优化：**

  * ArenaHard winrate从 68.3% 提升至 76.3%
  * AlpacaEval 2.0 LC winrate从 46.61% 提升至 50.52%
  * MT-Bench 分数从 8.84 提升至 9.02
  * AlignBench 分数从 7.88 提升至 8.04

**新模型在原Coder模型的基础上进一步提升了代码生成能力，对常见编程应用场景进行了优化，并在标准测试集上取得了以下成绩：**

  * HumanEval: 89%
  * LiveCodeBench (1-9月): 41%

* * *

## 时间：2024-08-02​

### API 上线硬盘缓存技术​

DeepSeek API 创新采用硬盘缓存，价格再降一个数量级

更新详情请跳转文档 [API 上线硬盘缓存 2024/08/02](</zh-cn/news/news0802>)

* * *

## 时间：2024-07-25​

### API 接口更新​

  * **更新接口`/chat/completions`**
    * JSON 输出
    * Function 调用
    * 对话前缀续写（Beta）
    * 8K 最长输出（Beta）
  * **新增接口`/completions`**
    * FIM 补全（Beta）

更新详情请跳转文档 [API 升级新功能 2024/07/25](</zh-cn/news/news0725>)

* * *

## 时间：2024-07-24​

### deepseek-coder​

deepseek-coder 模型升级为 DeepSeek-Coder-V2-0724。

* * *

## 时间：2024-06-28​

### deepseek-chat​

`deepseek-chat` 模型升级为 DeepSeek-V2-0628，模型推理能力提升，相关基准测试：

  * 代码，HumanEval Pass@1 79.88% -> 84.76%
  * 数学，MATH ACC@1 55.02% -> 71.02%
  * 推理，BBH 78.56% -> 83.40%

在 Arena-Hard 测评中，与 GPT-4-0314 的对战胜率从 41.6% 提升到了 68.3%。

模型角色扮演能力显著增强，可以在对话中按要求扮演不同角色。

* * *

## 时间：2024-06-14​

### deepseek-coder​

`deepseek-coder` 模型升级为 DeepSeek-Coder-V2-0614，代码能力显著提升，在代码生成、代码理解、代码修复和代码补全上达到了 GPT-4-Turbo-0409 的水平，并拥有卓越的数学和推理能力，其通用能力与 DeepSeek-V2-0517 持平。

* * *

## 时间：2024-05-17​

### deepseek-chat​

`deepseek-chat` 模型升级为 DeepSeek-V2-0517，模型在指令跟随方面的性能得到了显著提升，IFEval Benchmark Prompt-Level 准确率从 63.9% 跃升至 77.6%。此外，我们对API端的“system”区域指令跟随能力进行了优化，显著增强了沉浸式翻译、RAG 等任务的用户体验。

模型对于 JSON 格式输出的准确性得到了提升。在内部测试集中，JSON 解析率从 78% 提高到了85%。通过引入恰当的正则表达式，JSON 解析率进一步提高至 97%。