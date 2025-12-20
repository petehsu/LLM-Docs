# Cursor

> 在 Cursor 中使用 GLM Coding Plan 的方法

将 **GLM-4.6** 模型通过 OpenAI 协议在 **Cursor** 中自定义配置模型接入使用。

<Danger>
  注意：由于 Cursor 的限制，只有订阅了 Cursor 高级会员及以上的用户才支持自定义配置模型。
</Danger>

<Danger>
  注意：若非 Cursor 高级会员，配置后会报错 `The model GLM does not work with your current plan or api key`.
</Danger>

### 1. 安装 Cursor

访问 Cursor 官网下载并安装适合您的操作系统的版本。

### 2. 创建新 Provider/Model

在 Cursor 中，打开 “**Models**” 部分，并点击 “**Add Custom Model**” 按钮。

![Description](https://cdn.bigmodel.cn/markdown/176032162759420251013-100713.jpeg?attname=20251013-100713.jpeg)

* 选择 **OpenAI 协议**。
* 配置 **OpenAI API Key**（从[智谱开放平台](https://bigmodel.cn/usercenter/proj-mgmt/apikeys)获取）。
* 在 **Override OpenAI Base URL** 中，将默认 URL 替换为 **GLM-4.6** 的接口地址：`https://open.bigmodel.cn/api/coding/paas/v4`。
* 输入您希望使用的模型，如 `GLM-4.6`, `GLM-4.5` 或 `GLM-4.5-air`。
* 注意: 在 Cursor 中，需要输入模型的大写名称不能小写名称，如 `GLM-4.6`。

![Description](https://cdn.bigmodel.cn/markdown/176032171278120251013-100720.jpeg?attname=20251013-100720.jpeg)

### 3. 保存并切换模型

配置完成后，保存设置并在主页上选择您刚创建的 **GLM-4.6 Provider**。

### 4. 开始使用

通过该设置，您可以开始使用 **GLM-4.6** 模型进行代码生成、调试、任务分析等工作。

![Description](https://cdn.bigmodel.cn/markdown/176032176545720251013-100725.jpeg?attname=20251013-100725.jpeg)


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.bigmodel.cn/llms.txt