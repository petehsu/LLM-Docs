文档

使用手册

# 主要概念

## 

Moonshot的文本生成模型（指moonshot-v1）是训练用于理解自然语言和书面语言的，它可以根据输入生成文本输出。对模型的输入也被称为“prompt”。通常我们建议您提供明确的指令以及给出一些范例，来让模型能够完成既定的任务，设计 prompt 本质上就是学会如何“训练”模型。moonshot-v1模型可以用于各种任务，包括内容或代码生成、摘要、对话、创意写作等。

## 

语言模型推理服务是一个基于我们 (Moonshot AI) 开发和训练的预训练模型的 API 服务。在设计上，我们对外主要提供了一个 Chat Completions 接口，它可以用于生成文本，但是它本身是不支持访问网络、数据库等外部资源，也不支持执行任何代码。

## 

文本生成模型以 Token 为基本单位来处理文本。Token 代表常见的字符序列。例如，单个汉字"夔"可能会被分解为若干 Token 的组合，而像"中国"这样短且常见的短语则可能会使用单个 Token。大致来说，对于一段通常的中文文本，1 个 Token 大约相当于 1.5-2 个汉字。

需要注意的是，对于我们的文本模型，Input 和 Output 的总和长度不能超过模型的最大上下文长度。

## 

这些速率限制是如何工作的？

速率限制通过4种方式衡量：并发、RPM（每分钟请求数）、TPM（每分钟 Token 数）、TPD（每天 Token 数）。速率限制可能会在任何一种选项中达到，取决于哪个先发生。例如，你可能向 ChatCompletions 发送了 20 个请求，每个请求只有 100 个 Token ，那么你就达到了限制（如果你的 RPM 限制是 20），即使你在这些 20 个请求中没有发满 200k 个 Token （假设你的TPM限制是 200k）。

对网关，出于方便考虑，我们会基于请求中的 max\_tokens 参数来计算速率限制。这意味着，如果你的请求中包含了 max\_tokens 参数，我们会使用这个参数来计算速率限制。如果你的请求中没有包含 max\_tokens 参数，我们会使用默认的 max\_tokens 参数来计算速率限制。当你发出请求后，我们会基于你请求的 token 数量加上你 max\_tokens 参数的数量来判断你是否达到了速率限制。而不考虑实际生成的 token 数量。

而在计费环节中，我们会基于你请求的 token 数量加上实际生成的 token 数量来计算费用。

* **其他值得注意的重要事项**
  + 速率限制是在用户级别而非密钥级别上实施的。
  + 目前我们在所有模型中共享速率限制。

## 

你可以使用我们的 [List Models API](/docs/api/chat#list-models) 来获取当前可用的模型列表。当前的我们支持的模型有：

### 

| 模型名称 | 描述 |
| --- | --- |
| `kimi-k2-0905-preview` | 上下文长度 256k，在 0711 版本基础上增强了 Agentic Coding 能力、前端代码美观度和实用性、以及上下文理解能力 |
| `kimi-k2-0711-preview` | 上下文长度 128k，MoE 架构基础模型，总参数 1T，激活参数 32B。具备超强代码和 Agent 能力。[查看技术博客 (opens in a new tab)](https://moonshotai.github.io/Kimi-K2/) |
| `kimi-k2-turbo-preview` | K2 的高速版本，对标最新版本(0905)。输出速度提升至每秒 60-100 tokens，上下文长度 256k |
| `kimi-k2-thinking` | K2 长思考模型，支持 256k 上下文，支持多步工具调用与思考，擅长解决更复杂的问题 |
| `kimi-k2-thinking-turbo` | K2 长思考模型的高速版本，支持 256k 上下文，擅长深度推理，输出速度提升至每秒 60-100 tokens |

### 

| 模型名称 | 描述 |
| --- | --- |
| `moonshot-v1-8k` | 适用于生成短文本，上下文长度 8k |
| `moonshot-v1-32k` | 适用于生成长文本，上下文长度 32k |
| `moonshot-v1-128k` | 适用于生成超长文本，上下文长度 128k |
| `moonshot-v1-8k-vision-preview` | Vision 视觉模型，理解图片内容并输出文本，上下文长度 8k |
| `moonshot-v1-32k-vision-preview` | Vision 视觉模型，理解图片内容并输出文本，上下文长度 32k |
| `moonshot-v1-128k-vision-preview` | Vision 视觉模型，理解图片内容并输出文本，上下文长度 128k |

> 注：以上moonshot-v1 模型的区别仅在于最大上下文长度(包括输入和输出)，效果上并无差异。

### 

| 模型名称 | 描述 |
| --- | --- |
| `kimi-latest` | 支持 128k 上下文的视觉模型，具备图片理解能力。使用 Kimi 智能助手最新版本，可能包含尚未稳定的特性 |

### 

> `kimi-thinking-preview` 已于 **2025 年 11 月 11 日下线**，不再维护和支持。  
> 建议直接升级至 [kimi-k2-thinking-preview 模型](/docs/guide/use-kimi-k2-thinking-model)，以获得持续支持和更强推理能力。

如需更多支持，请 [联系销售](/contact-sales)

# 使用指南

## 

你需要一个 API 密钥来使用我们的服务。你可以在我们的[控制台](/console)中[创建一个 API 密钥](/console/api-keys)。

## 

你可以使用我们的 Chat Completions API 来发送请求。你需要提供一个 API 密钥和一个模型名称。你可以选择是否使用默认的 max\_tokens 参数，或者自定义 max\_tokens 参数。可以参考 [API 文档](/docs/api/chat#%E5%8D%95%E8%BD%AE%E5%AF%B9%E8%AF%9D)中的调用方法。

## 

通常的，我们会设置一个 5 分钟的超时时间。如果单个请求超过了这个时间，我们会返回一个 504 错误。如果你的请求超过了速率限制，我们会返回一个 429 错误。如果你的请求成功了，我们会返回一个 JSON 格式的响应。

如果是为了快速处理一些任务，你可以使用我们的 Chat Completions API 的非 streaming 模式。这种模式下，我们会在一次请求中返回所有的生成文本。如果你需要更多的控制，你可以使用 streaming 模式。在这种模式下，我们会返回一个 [SSE (opens in a new tab)](https://kimi.moonshot.cn/share/cr7boh3dqn37a5q9tds0) 流，你可以在这个流中获取生成的文本，这样用户体验可能会更好，并且你也可以在任何时候中断请求，而不会浪费资源。

Last updated on 2025年11月11日

[欢迎](/docs/overview "欢迎")[Chat](/docs/api/chat "Chat")