# MegaLLM 文档

> 欢迎使用 MegaLLM - 通过单一强大 API 连接 70 多个大型语言模型的通用 AI 平台。

<Info>
  **一个 API，无限可能**：访问 GPT-5、Claude Opus 4.1、Gemini 2.5 Pro 等更多模型，无需在多个提供商之间切换。
</Info>

## 什么是 MegaLLM？

MegaLLM 是您的 AI **"超级 API"**。无需分别集成 OpenAI、Anthropic、Google 和其他提供商，您可以通过一个统一接口访问他们的所有模型。

### 为什么选择 MegaLLM？

* **即时模型切换**：通过一个参数更改模型
* **自动故障转移**：当一个模型失败时永不宕机
* **统一计费**：您所有 AI 使用的一张账单
* **零集成开销**：现有代码的即插即用替代方案

## 快速开始

<CardGroup cols={2}>
  <Card title="模型目录" icon="grid-2-plus" href="/home/models">
    浏览 70 多个 AI 模型及其定价和功能
  </Card>

  <Card title="快速开始" icon="rocket-launch" href="/dev-docs/getting-started/quick-start">
    获取您的 API 密钥并发出第一个请求
  </Card>

  <Card title="OpenAI API" icon="brackets-curly" href="/dev-docs/openai/overview">
    使用任何模型的 OpenAI 兼容端点
  </Card>

  <Card title="Anthropic API" icon="comments" href="/dev-docs/anthropic/overview">
    使用 Anthropic 格式访问 Claude 模型
  </Card>
</CardGroup>

## 核心功能

<CardGroup cols={3}>
  <Card title="自动故障转移" icon="arrows-rotate" href="/home/faq">
    通过智能模型切换确保高可用性
  </Card>

  <Card title="身份验证" icon="shield-halved" href="/dev-docs/getting-started/authentication">
    简单的 API 密钥管理和安全性
  </Card>

  <Card title="常见问题" icon="circle-info" href="/home/faq">
    常见问题和故障排除
  </Card>
</CardGroup>

## 谁在使用 MegaLLM？

### 开发者

* 无需重写代码即可尝试不同模型
* 将集成复杂性从数周减少到几分钟
* 通过自动故障转移构建更强大的应用程序

### 企业

* 确保面向客户的 AI 功能的高可用性
* 优化多个模型提供商的成本
* 通过提供商灵活性保护 AI 投资的未来

### 研究人员

* 访问发布的最新模型
* 运行全面的评估和基准测试
* 测试不同任务的模型性能

## 示例：切换模型

```python  theme={null}
from openai import OpenAI

client = OpenAI(
    base_url="https://ai.megallm.io/v1",
    api_key="your-api-key"
)

# 尝试 GPT-5 进行复杂推理
response = client.chat.completions.create(
    model="gpt-5",
    messages=[{"role": "user", "content": "分析这些数据..."}]
)

# 切换到 Claude 进行分析
response = client.chat.completions.create(
    model="claude-3.7-sonnet",
    messages=[{"role": "user", "content": "分析这些数据..."}]
)

# 使用 Claude 进行创意写作
response = client.chat.completions.create(
    model="claude-opus-4-1-20250805",
    messages=[{"role": "user", "content": "写一个关于...的故事"}]
)
```

## 流行的模型组合

| 用例        | 主要模型                     | 备用模型                             | 原因      |
| --------- | ------------------------ | -------------------------------- | ------- |
| **聊天机器人** | gpt-4o-mini              | gpt-3.5-turbo, claude-3.5-sonnet | 快速、高性价比 |
| **代码生成**  | gpt-5                    | claude-3.7-sonnet, gpt-4o        | 专门用于代码  |
| **分析**    | claude-opus-4-1-20250805 | gpt-5, gemini-2.5-pro            | 最佳推理能力  |
| **创意写作**  | claude-opus-4-1-20250805 | gpt-5, claude-sonnet-4           | 卓越的创造力  |

## 开始使用

<Tip>
  **准备好开始了吗？** 前往我们的[快速开始指南](/dev-docs/getting-started/quick-start)，在几分钟内完成您的第一个 API 调用。
</Tip>

### 三步设置

1. **获取 API 密钥**：注册并获取您的 MegaLLM API 密钥
2. **选择格式**：使用 OpenAI 或 Anthropic API 格式
3. **开始构建**：向 70 多个模型中的任何一个发出第一个请求

## 需要帮助？

* **浏览我们的指南**：每个功能的综合文档
* **查看常见问题**：常见问题和解决方案
* **联系支持**：[support@megallm.io](mailto:support@megallm.io) 获取技术协助
* **使用搜索**：按 Cmd+K 搜索所有文档


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt