文档

产品定价

模型推理定价

# 模型推理价格说明

## 

### 

Token：代表常见的字符序列，每个汉字使用的 Token 数目可能是不同的。例如，单个汉字"夔"可能会被分解为若干 Token 的组合，而像"中国"这样短且常见的短语则可能会使用单个 Token。

大致来说，对于一段通常的中文文本，1 个 Token 大约相当于 1.5-2 个汉字。具体每次调用实际产生的 Tokens 数量可以通过调用[计算 Token API](/docs/api/misc#%E8%AE%A1%E7%AE%97-token) 来获得。

#### 

Chat Completion 接口收费：我们对 Input 和 Output 均实行按量计费。如果您上传并抽取文档内容，并将抽取的文档内容作为 Input 传输给模型，那么文档内容也将按量计费。

文件相关接口（文件内容抽取/文件存储）接口**限时免费**，即您只上传并抽取文档，这个API本身不会产生费用。

## 

### 

| 模型 | 计费单位 | 输入价格 （缓存命中） | 输入价格 （缓存未命中） | 输出价格 | 模型上下文长度 |
| --- | --- | --- | --- | --- | --- |
| kimi-k2-0905-preview | 1M tokens | ￥1.00 | ￥4.00 | ￥16.00 | 262,144 tokens |
| kimi-k2-0711-preview | 1M tokens | ￥1.00 | ￥4.00 | ￥16.00 | 131,072 tokens |
| kimi-k2-turbo-preview推荐 | 1M tokens | ￥1.00 | ￥8.00 | ￥58.00 | 262,144 tokens |
| kimi-k2-thinking | 1M tokens | ￥1.00 | ￥4.00 | ￥16.00 | 262,144 tokens |
| kimi-k2-thinking-turbo | 1M tokens | ￥1.00 | ￥8.00 | ￥58.00 | 262,144 tokens |

* kimi-k2 是一款具备超强代码和 Agent 能力的 MoE 架构基础模型，总参数 1T，激活参数 32B。在通用知识推理、编程、数学、Agent 等主要类别的基准性能测试中，K2 模型的性能超过其他主流开源模型
* kimi-k2-0905-preview 模型上下文长度 256k，在 kimi-k2-0711-preview 能力的基础上，具备更强的 Agentic Coding 能力、更突出的前端代码的美观度和实用性、以及更好的上下文理解能力
* kimi-k2-turbo-preview 模型上下文长度 256k，是 kimi k2 的高速版本模型，始终对标最新版本的 kimi-k2 模型（kimi-k2-0905-preview）。模型参数与 kimi-k2 一致，但输出速度已提至每秒 60 tokens，最高可达每秒 100 tokens
* kimi-k2-0711-preview 模型上下文长度为 128k
* kimi-k2-thinking 模型上下文长度 256k，是具有通用 Agentic 能力和推理能力的思考模型，它擅长深度推理[使用须知](/docs/guide/use-kimi-k2-thinking-model)
* kimi-k2-thinking-turbo 模型上下文长度 256k，是 kimi-k2-thinking 模型的高速版，适用于需要深度推理和追求极致高速的场景
* 支持 ToolCalls、JSON Mode、Partial Mode、联网搜索功能等，不支持视觉功能
* 支持自动上下文缓存功能，缓存命中的 tokens 将按照输入价格（缓存命中）单价收费，您可以在[控制台](/console)中查看"context caching"类型的费用明细

### 

💡 计费说明：kimi-latest 模型会根据您请求的上下文长度自动选择对应的计费模型，上下文越长，价格越高

| 模型 | 请求上下文长度范围 （自动选择计费模型） | 计费单位 | 输入价格 （缓存命中） | 输入价格 （缓存未命中） | 输出价格 |
| --- | --- | --- | --- | --- | --- |
| kimi-latest | ≤ 8,192 tokens | 1M tokens | ￥1.00 | ￥2.00 | ￥10.00 |
| 8,192 < 长度 ≤ 32,768 tokens | 1M tokens | ￥1.00 | ￥5.00 | ￥20.00 |
| 32,768 < 长度 ≤ 131,072 tokens | 1M tokens | ￥1.00 | ￥10.00 | ￥30.00 |

* kimi-latest 模型总是使用 Kimi 智能助手产品使用最新的 Kimi 大模型版本，可能包含尚未稳定的特性
* kimi-latest 模型上下文长度为 128k，会自动根据请求的上下文长度选择 8k/32k/128k 模型作为计费模型
* kimi-latest 是视觉模型，支持图片理解
* 支持自动上下文缓存，缓存命中的 Tokens 费用仅为 ￥1/M Tokens
* 其余功能与 moonshot-v1 系列模型保持一致，包括：ToolCalls、JSON Mode、Partial Mode、联网搜索功能等

### 

| 模型 | 计费单位 | 输入价格 | 输出价格 | 模型上下文长度 |
| --- | --- | --- | --- | --- |
| moonshot-v1-8k | 1M tokens | ￥2.00 | ￥10.00 | 8,192 tokens |
| moonshot-v1-32k | 1M tokens | ￥5.00 | ￥20.00 | 32,768 tokens |
| moonshot-v1-128k | 1M tokens | ￥10.00 | ￥30.00 | 131,072 tokens |
| moonshot-v1-8k-vision-preview | 1M tokens | ￥2.00 | ￥10.00 | 8,192 tokens |
| moonshot-v1-32k-vision-preview | 1M tokens | ￥5.00 | ￥20.00 | 32,768 tokens |
| moonshot-v1-128k-vision-preview | 1M tokens | ￥10.00 | ￥30.00 | 131,072 tokens |

此处 1M = 1,000,000，表格中的价格代表每消耗 1M tokens 的价格。

Last updated on 2025年11月11日

[查询余额](/docs/api/balance "查询余额")[联网搜索定价](/docs/pricing/tools "联网搜索定价")