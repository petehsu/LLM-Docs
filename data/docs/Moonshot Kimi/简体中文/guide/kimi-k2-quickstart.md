文档

入门指南

Kimi K2 快速开始

# Kimi K2 快速开始

## 

Kimi K2 是月之暗面推出的新一代具备自主行动 (agentic) 能力的旗舰模型。采用 1T 总参数量、32B 激活参数的 MoE 架构设计。该模型在代码编程 (AI coding) 和智能体 (Agent) 搭建两大领域表现卓越。[技术报告 (opens in a new tab)](https://moonshotai.github.io/Kimi-K2/)

![kimi-k2](/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fkimi-k2-blog.de881a89.png&w=3840&q=75)

### 

* 国内领先：Kimi K2 是目前国内表现最优秀的 Coding 模型之一
* 全栈支持：从前端到后端，从代码生成到开发运维、调试优化，全方位覆盖真实编程场景
* 效率倍增：官方提供联网搜索等十余款开箱即用工具，配合精准的 tool call 调用能力，显著提升编程效率

### 

* 复杂任务分解：能够自动将需求拆解为一系列可执行的工具调用结构 [用 Kimi K2 模型搭建 Agent](/docs/guide/use-kimi-k2-to-setup-agent)
* Enforcer & Json Mode：特有功能确保工具调用格式的稳定性和可控性
* 多工具协同：内置联网搜索等十余款工具，支持复杂的多步骤智能体工作流 [了解更多](/docs/guide/use-official-tools)
* 准确的工具调用：官方 API 版本工具调用准确率接近 100%，是智能体可靠运行的基础(注：第三方平台部署的开源版本工具调用能力可能会有所下降，具体测试结果请见 [K2 Vendor Verifier 项目 (opens in a new tab)](https://mp.weixin.qq.com/s/uTIr8JhyGMvJKY-oN38x6A))

### 

* kimi-k2-0905-Preview，kimi-k2-turbo-preview，kimi-k2-thinking，kimi-k2-thinking-turbo 模型均提供 256K 上下文窗口

### 

* kimi-k2-thinking，kimi-k2-thinking-turbo 模型是最新推出的思考模型，支持多步工具调用和推理，擅长解决复杂问题

### 

| K2 模型版本 | 特点 |
| --- | --- |
| kimi-k2-0905-preview | kimi k2 最新版本，支持 256K 上下文窗口 |
| kimi-k2-turbo-preview | kimi k2 高速版本，速度高达 60-100 Tokens/s，适合企业级和高响应智能体应用 |
| kimi-k2-thinking | kimi k2 的长思考模型，支持 256k 上下文，支持多步工具调用与思考，擅长解决更复杂的问题 |
| kimi-k2-thinking-turbo | kimi k2 的长思考模型的高速版本 |

* 注：kimi k2 模型的更多说明请见 [模型列表](/docs/introduction#%E6%A8%A1%E5%9E%8B%E5%88%97%E8%A1%A8)

## 

* [立即体验](/playground)：在开发工作台，快速通过交互式操作测试模型在业务场景上的效果
* [申请 API Key](/console/api-keys)：立即通过 API 调用测试

## 

以下是完整的调用示例，帮助您快速上手 Kimi K2 模型。

### 

Kimi API 完全兼容 OpenAI 的 API 格式，你可以通过如下方式来安装 OpenAI SDK：

```python
pip install --upgrade 'openai>=1.0'
```

### 

```python
python -c 'import openai; print("version =",openai.__version__)'

# 输出可能是 version = 1.10.0，表示 OpenAI SDK 已经安装成功，当前 python 实际使用了 openai 的 v1.10.0 的库
```

### 

```python
from openai import OpenAI

client =OpenAI(
    api_key ="$MOONSHOT_API_KEY",
    base_url ="https://api.moonshot.cn/v1",
)

completion = client.chat.completions.create(
    model ="kimi-k2-turbo-preview",
    messages = [
        {"role": "system", "content": "你是 Kimi，由 Moonshot AI 提供的人工智能助手，你更擅长中文和英文的对话。你会为用户提供安全，有帮助，准确的回答。同时，你会拒绝一切涉及恐怖主义，种族歧视，黄色暴力等问题的回答。Moonshot AI 为专有名词，不可翻译成其他语言。"},
        {"role": "user", "content": "你好，我叫李雷，1+1等于多少？"}
    ],
    temperature =0.6, #控制输出的随机性
# max_tokens=32000, #最大输出 tokens
)

print(completion.choices[0].message.content)
```

如果您成功运行上述代码，且没有任何报错，那么您将看到类似如下的内容输出：

```text
你好，李雷！1+1 等于 2。这是一个基本的数学加法问题。如果你有其他问题或需要帮助，请随时告诉我。
```

### 

```python
from openai import OpenAI

client =OpenAI(
    api_key ="MOONSHOT_API_KEY", # 替换为你自己的API Key
    base_url ="https://api.moonshot.cn/v1",
)

stream = client.chat.completions.create(
    model ="kimi-k2-turbo-preview",
    messages = [
        {"role": "system", "content": "你是 Kimi，由 Moonshot AI 提供的人工智能助手，你更擅长中文和英文的对话。你会为用户提供安全，有帮助，准确的回答。同时，你会拒绝一切涉及恐怖主义，种族歧视，黄色暴力等问题的回答。Moonshot AI 为专有名词，不可翻译成其他语言。"},
        {"role": "user", "content": "你好，我叫李雷，1+1等于多少？"}
    ],
    temperature=0.6, #控制输出的随机性
    max_tokens=32000, #最大输出tokens 
    stream=True, # 启用流式输出
)

for chunk in stream:
        delta = chunk.choices[0].delta #流式片段
if delta.content:
print(delta.content, end="")
```

## 

* Kimi K2 为纯文本模型。如需处理图片等多种文件格式，推荐使用 [Kimi Latest](/docs/pricing/chat#%E7%94%9F%E6%88%90%E6%A8%A1%E5%9E%8B-kimi-latest) 模型，该模型与 kimi.com 智能助手 k1.5 模型效果保持一致。
* 在这里查看在 [Claude Code, Roo Code, Cline中使用Kimi K2](/docs/guide/agent-support)的方法
* 在这里查看如何使用[Kimi K2 长思考模型](/docs/guide/use-kimi-k2-thinking-model)
* 联网搜索是Kimi API官方提供的强大工具之一，在这里查看如何使用[联网搜索](/docs/guide/use-web-search)，以及其他[官方工具](/docs/guide/use-formula-tool-in-chatapi)
* 在这里查看全部[模型价格](/docs/pricing/chat)，[充值与限速说明](/docs/pricing/limits)，[联网搜索价格说明](/docs/pricing/tools)

Last updated on 2025年11月13日

[常见问题](/docs/pricing/faq "常见问题")[Kimi K2 Thinking 快速开始](/docs/guide/use-kimi-k2-thinking-model "Kimi K2 Thinking 快速开始")