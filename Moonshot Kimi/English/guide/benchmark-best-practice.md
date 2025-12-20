文档

入门指南

基准评估最佳实践

# 基准测试最佳实践

基准测试是一项对稳定性要求极高的工程任务。 您需要与模型进行大量交互，即使是微小的系统偏差或网络波动也可能影响结果的准确性。 我们总结了以下最佳实践，帮助您的评估结果可复现且可信。

## 

**重点提示：**

* 对于下表中未提到的 benchmark 或其他闭源 benchmark，推荐 temperature = 1.0，stream = True
* Reasoning 相关的 benchmark： maxtoken 推荐设置到 128k，并且总测试题量至少要到 500-1000 题才会获得一个相对低的测试方差。（比如 AIME2025 建议测试 32 次 30\*32=960 题）
* Code 相关的 benchmark：maxtoken 推荐设置到 256k
* Agentic Task 相关的 benchmark：如果需要 multi hop search，maxtoken 推荐设置到 256k 并配合 context management 机制；其他类型的 agentic task 推荐至少设置 16-64k 的 maxtoken

| Benchmark 分类 | Benchmark | Temperature | Max token 推荐设置 | 推荐测试次数 | 其他 |
| --- | --- | --- | --- | --- | --- |
| Code | SWE系列 | 推荐设置：0.7； 可接受的其他设置：1.0 | per step tokens = 16k; total max token = 256k | 5次 |  |
| Lcb + OJBench | 推荐设置：1.0 | max tokens = 128k | 1次 |  |
| TerminalBench | 推荐设置：1.0 | max tokens = 128k | 3次 |  |
| Reasoning | AIME2025 no tools | 推荐设置：1.0 | per step tokens = 96k; total max tokens = 96k | 32次 |  |
| AIME2025 w/ tools | 推荐设置：1.0 | per step tokens = 48k; total max tokens = 128k | 16次 | 推荐 max steps = 120 |
| AIME2025 heavy | 推荐设置：1.0 | max tokens = 128k | 8次 | 推荐max steps = 120 |
| HLE no tools | 推荐设置：1.0 | max tokens = 96k | 1次 |  |
| HLE w/ tools | 推荐设置：1.0 | total max tokens = 128k; per step tokens = 48k | 1次 | 推荐 max steps = 120 |
| HLE heavy | 推荐设置：1.0 | total max tokens = 128k; per step tokens = 48k | 1次 | 推荐max steps = 200 parallel n=8 |
| HMMT2025 no tools | 推荐设置：1.0 | max tokens = 96k | 32次 |  |
| HMMT2025 w/tools | 推荐设置：1.0 | per step tokens = 48k; total tokens = 128k | 16次 | 推荐 max steps = 120 |
| HMMT2025 heavy | 推荐设置：1.0 | max tokens = 128k | 8次 | 推荐max steps = 120 |
| IMO-AnswerBench | 推荐设置：1.0 | max tokens = 128k | 8次 |  |
| GPQA-Diamond | 推荐设置：1.0 | max tokens = 96k | 8次 |  |
| Agentic Search Task | BrowseComp/ BrowseComp-ZH/Seal-0/ Frames | 推荐设置：1.0 | per step tokens = 24k; total max tokens = 256k | 4次 | 推荐 max steps = 250 推荐增加 context management 机制，使得不会因为 context 爆炸无法调用足够多次工具 推荐 system prompt 给出日期，同时提到对不确定的信息应该使用 search 工具收集信息。 |
| Agentic Task | Tau系列 | 推荐设置：0.0 | >=16k | 4次 | 推荐 max steps = 100 |

## 

* 强烈推荐使用官方 API 来做 benchmark 测试：

  + 目前我们已经发现有第三方 API 会存在相同 benchmark 下测试效果大幅下降的情况，具体原因还在排查；
  + 在确保第三方 API 的精度完全可靠前，强烈推荐 benchmark 场景使用官方 API 进行测试
* 推荐使用`kimi-k2-thinking-turbo` 来测试，能更快完成测试过程

  + ⚠️ **请不要使用 kimi-thinking-preview**；是历史版本模型，不是 K2 thinking！
* 必须设置：**stream = true** ，非 Streaming 模式会引发各种不可控的中间网络中断问题
* 目前的 API default 配置（仅对 Kimi K2 thinking 生效）：

  + default temp = 1.0；
  + default max token = 64000
* 超时连接时间：

  + 如果设置了 stream=false，api.moonshot.cn 的超时时间是1小时，但各地运营商可能存在其他超时情况；
  + 所以还是强烈建议设置 Stream = True ；
* 使用较低的并发数以避免限流；
* 已知的其他问题

  + 因目前访问量较大，官方 API 可能会出现 429 overloaded，请在测试脚本中处理这种情况并重试
  + 在 streaming 测试过程中，有小概率事件遇到因为集群变化遇到的其他 finish\_reason，需要进行重试
  + 因为广域网断联情况非常复杂，我们强烈建议在测试脚本中引入**重试机制**

## 

**Q1:** temperature 取值对不同模型是一致的吗？

**A:** 不同模型系列的 temperature 设置不同：

* k2 系列模型：推荐使用 temperature=0.6
* k2-thinking 系列模型：推荐使用 temperature=1.0

**Q2:** 为什么要用 stream=true？

**A:** 长输出可能需要若干分钟。 空闲的TCP连接有可能会被防火墙、负载均衡器和NAT网关等各种中间网络设备终止。 流式传输能保持连接活跃，显著提高可靠性。 生产数据显示，stream=false 的请求失败率远高于 stream=true。

**Q3:** 我应该使用多少并发数？

**A:** 您的API账户有特定的速率限制，参考[充值与限速说明 (opens in a new tab)](https://platform.moonshot.cn/docs/pricing/limits)。 建议从较低的并发数开始。 如果遇到限流导致的 429 错误，则说明并发过高。 评估的准确性比速度更重要，请找到一个能让您保持在速率限制内合适的并发水平。

**Q5:** 为什么要重试某些错误？

**A:** 即使使用流式传输，发起请求时仍可能因为网络抖动等问题导致失败。 请对临时性故障（网络问题、服务器过载、速率限制）进行重试，以避免不必要的错误。

**Q6:** 为什么多轮对话和多步骤任务必须带上完整上下文和思考过程？

**A:** 完整上下文能帮助模型在多步推理过程中保持推理的连贯性，特别是在工具调用过程中。 如果省略思考过程，后续回复可能会不一致或质量下降，从而影响性能评估的准确性。

## 

如果您遇到任何问题，请发送邮件至 [api-service@moonshot.ai](mailto:api-service@moonshot.ai) 获得进一步的技术支持。

Last updated on 2025年11月10日

[Kimi K2 模型搭建 Agent 指南](/docs/guide/use-kimi-k2-to-setup-agent "Kimi K2 模型搭建 Agent 指南")[Prompt 最佳实践](/docs/guide/prompt-best-practice "Prompt 最佳实践")