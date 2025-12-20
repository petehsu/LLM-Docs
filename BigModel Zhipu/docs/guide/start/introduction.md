# 平台介绍

> Z智谱·一站式大模型开发平台

<Frame>
  <img className="block dark:hidden" src="https://cdn.bigmodel.cn/static/logo/dark.svg" alt="智谱AI开放平台" />

  <img className="hidden dark:block" src="https://cdn.bigmodel.cn/static/logo/light.svg" alt="智谱AI开放平台" />
</Frame>

## 平台定位

智谱大模型开放平台 [bigmodel.cn](http://bigmodel.cn)，提供功能丰富、灵活易用、高性价比的大模型 API 服务，支持智能体开发与模型精调、推理、评测等，致力于构建高效通用的“一站式模型即服务” AI 开发新范式。

## 平台优势

<CardGroup cols={2}>
  <Card title="模型矩阵" icon={<svg style={{maskImage: "url(/resource/icon/book-open.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"}/>}>
    全模态、全尺寸、低幻觉、高精度
  </Card>

  <Card title="开发套件" icon={<svg style={{maskImage: "url(/resource/icon/flask.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"}/>}>
    覆盖模型与 AI 应用开发，全链路开箱即用
  </Card>

  <Card title="深耕场景" icon={<svg style={{maskImage: "url(/resource/icon/list.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"}/>}>
    深度耦合业务的应用级 Agent，直达生产力
  </Card>

  <Card title="服务保障" icon={<svg style={{maskImage: "url(/resource/icon/helmet-safety.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"}/>}>
    充沛高并发算力资源，多层次安全防护机制
  </Card>
</CardGroup>

## 查看模型

平台已上架数十个模型，覆盖文本生成、语言推理、图像理解、视频生成、音视频处理等多场景。前往 [模型概览](/cn/guide/start/model-overview)，即可查看所有模型的功能定位、模型价格、上下文长度等基本信息。

## 极速体验

您可前往智谱大模型 [体验中心](https://bigmodel.cn/trialcenter/modeltrial)，极速体验模型能力。

<Tip>
  在对话框输入相关参数及prompt，点击发送，即可看到对应模型所输出的结果。

  ![](https://cdn.bigmodel.cn/static/logo/introduction.png)

  点击页面左侧的按钮，可自由切换体验文本模态、多模态模型及数十种智能体。
</Tip>

## 快速开始

[快速开始](/cn/guide/start/quick-start) 将引导您逐步完成 API 调用流程，涵盖注册账号、环境配置、获取 API key、SDK 使用等关键步骤。帮助您分钟级完成模型调用服务，并集成到您的业务或应用中。

## 开发指南

平台提供多种开发方式，满足不同开发者的需求和技术栈偏好。无论您是初学者还是经验丰富的开发者，都能找到适合的集成方案。

<CardGroup cols={2}>
  <Card title="HTTP API 调用" href="/cn/guide/develop/http/introduction">
    标准 RESTful API 接口，支持所有编程语言和平台
  </Card>

  <Card title="官方 Python SDK" href="/cn/guide/develop/python/introduction">
    功能完整的 Python 开发工具包，支持异步调用和类型安全
  </Card>

  <Card title="官方 Java SDK" href="/cn/guide/develop/java/introduction">
    企业级 Java 开发工具包，支持高并发和高可用性
  </Card>

  <Card title="OpenAI SDK 兼容" href="/cn/guide/develop/openai/introduction">
    兼容 OpenAI SDK，零学习成本快速迁移现有应用
  </Card>

  <Card title="LangChain 集成" href="/cn/guide/develop/langchain/introduction">
    集成 LangChain 框架，构建复杂的 AI 应用和智能代理
  </Card>
</CardGroup>

## 核心概念

<Tabs>
  <Tab title="GLM">
    <Card title="GLM - General Language Model" icon={<svg style={{maskImage: "url(/resource/icon/brain.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"}/>}>
      GLM 是一款基于自回归填空的预训练语言模型。ChatGLM 系列模型，支持相对复杂的自然语言指令，并且能够解决困难的推理类问题。该模型配备了易于使用的 API 接口，允许开发者轻松将其融入各类应用，广泛应用于智能客服、虚拟主播、聊天机器人等诸多领域。
    </Card>
  </Tab>

  <Tab title="Token">
    <Card title="Token - 文本处理单位" icon={<svg style={{maskImage: "url(/resource/icon/coins.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"}/>}>
      Token 是模型用来表示自然语言文本的基本单位，可以直观的理解为“字”或“词”；通常 1 个中文词语、1 个英文单词、1 个数字或 1 个符号计为 1 个 token。
      GLM 系列模型中 token 和字数的换算比例约为 1:1.6 ，但因为不同模型的分词不同，所以换算比例也存在差异，每一次实际处理 token 数量以模型返回为准，您可以从返回结果的 usage 中查看。
    </Card>
  </Tab>

  <Tab title="上下文窗口">
    <Card title="Context Window - 上下文窗口" icon={<svg style={{maskImage: "url(/resource/icon/window.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"}/>}>
      上下文窗口是指模型在一次对话中能够处理的最大长度。包括：

      * 用户输入的内容
      * 模型生成的回复
      * 模型在生成回复过程中进行推理或调用工具时产生的中间内容（如：GLM-4-AllTools ）

      <br />

      <Danger>
        如果超出上下文窗口限制，会发生什么？

        1. 超出部分被截断：
           如果总文本量超过了上下文窗口的限制，超出的部分将被自动丢弃，无法被处理。
        2. 影响对话内容：
           你可能看不到被丢弃的部分，从而影响模型的回答质量或上下文的连贯性。
      </Danger>
    </Card>
  </Tab>
</Tabs>

查看模型的上下文限制，或者使用 Tokenizer 工具估算上下文长度。

<Note>
  **重要提醒**：以上内容主要适用于 GLM-4 系列语言模型。对于多模态模型，输入内容有严格长度限制，若超出限制，系统将提示"prompt 超长"。
</Note>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.bigmodel.cn/llms.txt