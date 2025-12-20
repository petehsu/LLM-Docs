# 其他工具

> 在其他工具中使用 GLM Coding Plan 的方法

将  **GLM-4.6** 模型通过 **OpenAI 协议** 接入到兼容该协议的各种工具中，并进行配置和使用的方法。只要是支持 **OpenAI 协议** 的工具，都可以通过替换请求的 API 链接来接入 **GLM-4.6** 模型及 [**GLM Coding Plan**](https://zhipuaishengchan.datasink.sensorsdata.cn/t/Nd)，从而利用强大的智谱 AI 能力。

<Warning>
  使用 GLM Coding Plan 时，需要配置专属的 Coding API 端点 [https://open.bigmodel.cn/api/coding/paas/v4](https://open.bigmodel.cn/api/coding/paas/v4) 而不是通用 API 端点
</Warning>

<Warning>
  在 2025-09-30 日期前已使用的用户请注意：\
  GLM Coding Plan 的模型已支持 GLM-4.6，请在配置中将模型切换为 GLM-4.6 以体验最新模型。
</Warning>

## 一、适用工具

任何支持 **OpenAI 协议** 的工具，都可以使用 **GLM-4.6** 模型。您只需要通过替换默认的 OpenAI API URL，使用 **GLM-4.6** 和  **GLM Coding 套餐** 提供的接口即可。以下是一些常见且流行的支持 **OpenAI 协议** 的工具，您可以使用相同的方式接入 `GLM-4.6`：

* **Cursor**
* **Gemini CLI**
* **Cherry studio**
* ...

## 二、安装和配置方法

> 核心步骤：
>
> 1. 找到适配 OpenAI 协议的 Provider
> 2. **`添加/替换 OpenAI Base URL 为 https://open.bigmodel.cn/api/coding/paas/v4`**
> 3. [**输入智谱开放平台 API Key 并选择 GLM-4.6 模型**](https://bigmodel.cn/usercenter/proj-mgmt/apikeys)

以 **Cursor** 为例，注意 Cursor 高级版及以上才支持自定义配置，以下步骤展示了如何通过 OpenAI 协议接入 `GLM-4.6` 模型。类似地，其他支持 OpenAI 协议的工具也可以采用相同的配置方式。

### 1. 安装 Cursor

访问 Cursor 官网 下载并安装适合您的操作系统的版本。

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

## 三、如何替换链接

1. **找到您工具中的 API 配置部分**：例如，在 **Goose** 中，这通常是在配置文件中设置 API 地址的位置；在 **VS Code** 插件 或 **IntelliJ IDEA** 插件 中，通常通过插件的设置界面来配置。
2. **替换 OpenAI Base URL**：

将默认的 OpenAI API 地址替换为 GLM-4.6 的接口地址：`https://open.bigmodel.cn/api/coding/paas/v4`。

3. **输入 API Key 和选择模型**：

* 输入您的 **GLM-4.6 API Key**。
* 选择 `GLM-4.6`, `GLM-4.5` 或 `GLM-4.5-air` 模型。

## 四、总结

通过以上步骤，您可以将 **GLM-4.6** 模型接入任何支持 **OpenAI 协议** 的工具。只需简单地替换 API 链接并输入相应的 API 密钥，您便可以在这些工具中利用 **GLM-4.6** 模型进行强大的代码生成、调试和分析任务。只要工具支持 OpenAI 协议，就能轻松实现与 **GLM-4.6** 的集成。


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.bigmodel.cn/llms.txt