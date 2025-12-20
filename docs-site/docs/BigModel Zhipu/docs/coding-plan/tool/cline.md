# Cline

> 在 Cline 插件中使用 GLM Coding Plan 的方法

Cline 是一个强大的 VS Code 插件，可以帮助您在编辑器中直接使用 AI 模型进行代码生成、文件操作等任务。它不仅能加快开发节奏，还能在复杂任务中提供上下文理解和智能建议，让开发过程更高效、更流畅。

搭配 [**GLM Coding Plan**](https://zhipuaishengchan.datasink.sensorsdata.cn/t/Nd)，Cline 的能力将进一步升级 —— 以更低成本解锁更多用量，助你在代码生成、文件处理和多模态交互中更加得心应手。

<Warning>
  使用 GLM Coding Plan 时，需要配置专属的 Coding API 端点 [https://open.bigmodel.cn/api/coding/paas/v4](https://open.bigmodel.cn/api/coding/paas/v4) 而不是通用 API 端点
</Warning>

<Warning>
  在 2025-09-30 日期前已使用的用户请注意：\
  GLM Coding Plan 的模型已支持 GLM-4.6，请在配置中将模型切换为 `glm-4.6` 已体验最新模型。
</Warning>

## 一、安装 Cline 插件

### 1. 打开插件市场

1. 打开 VS Code
2. 点击左侧插件市场图标
3. 在搜索框中输入 `cline`
4. 找到 `Cline` 扩展

![Description](https://cdn.bigmodel.cn/markdown/1753630047557cline-1.png?attname=cline-1.png)

### 2. 安装插件

1. 点击 `Install` 按钮进行安装
2. 安装完成后，选择信任开发者

![Description](https://cdn.bigmodel.cn/markdown/1753630063558cline-2.png?attname=cline-2.png)

## 二、配置 API 设置

### 1. 选择 API Key 方式

选择 `Use your own API Key`

![Description](https://cdn.bigmodel.cn/markdown/1753630072448cline-3.png?attname=cline-3.png)

### 2. 填入配置信息

请按照以下配置填入相关信息：

* **API Provider**：选择 `OpenAI Compatible`
* **Base URL**：输入 `https://open.bigmodel.cn/api/coding/paas/v4`
* **API Key**：填入您的智谱 API Key
* **模型**：选择"使用自定义"，并输入模型名称（如：`glm-4.6`）
* **其他配置**：
  * 取消勾选 **Support Images**
  * 调整 **Context Window Size** 为 `204800`
  * 根据您的任务需求调整 `temperature` 等其它参数

![Description](https://cdn.bigmodel.cn/markdown/1759228550002cline.png?attname=cline.png)

## 三、开始使用

配置完成后，您可以在输入框中输入需求，让模型帮助您完成各种任务，例如：

* 创建和编辑文件
* 生成代码
* 重构代码
* 解释代码逻辑
* 调试问题

![Description](https://cdn.bigmodel.cn/markdown/1753630086163cline-5.png?attname=cline-5.png)

## 四、视觉和搜索 MCP 服务器

参考 [视觉MCP服务器](../mcp/vision-mcp-server) ，[搜索MCP服务器](../mcp/search-mcp-server) 和 [网页读取MCP服务器](../mcp/reader-mcp-server) 文档，配置完成后即可在 Cline 中使用。


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.bigmodel.cn/llms.txt