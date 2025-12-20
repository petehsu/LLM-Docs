# 接入 Kilo Code

> 在 VS Code 中使用 Kilo Code 插件接入智谱 GLM 模型的完整指南

Kilo Code 是一个功能强大的 VS Code 插件，支持 MCP（Model Context Protocol），可以帮助您在编辑器中使用 AI 模型进行高效的代码开发。

<Tip>
  [GLM Coding Plan](https://zhipuaishengchan.datasink.sensorsdata.cn/r/Uw) 上线，专为编码搭配设计，20元即可包月！

  套餐专属 [视觉理解 MCP Server](/cn/coding-plan/mcp/vision-mcp-server) 、 [网络搜索 MCP Server](/cn/coding-plan/mcp/search-mcp-server) 、 [网页读取 MCP Server](/cn/coding-plan/mcp/reader-mcp-server) 让您的 Code Agent 拥有搜索与视觉。
</Tip>

<Warning>
  在 2025-09-30 日期前已使用的用户请注意：\
  GLM Coding Plan 的模型已支持 GLM-4.6，请在配置中将模型切换为 `glm-4.6` 已体验最新模型。
</Warning>

## 一、安装 Kilo Code 插件

### 1. 打开插件市场

1. 打开 VS Code
2. 点击左侧插件市场图标
3. 在搜索框中输入 `Kilo Code`
4. 找到 `Kilo Code` 插件

![Description](https://cdn.bigmodel.cn/markdown/1753630612433kilo-1.png?attname=kilo-1.png)

### 2. 安装插件

1. 点击 `Install` 按钮进行安装
2. 安装完成后，选择信任开发者

![Description](https://cdn.bigmodel.cn/markdown/1753630620321kilo-2.png?attname=kilo-2.png)

## 二、配置 API 设置

### 1. 选择 API Key 方式

选择 `使用你自己的 API 秘钥`

![Description](https://cdn.bigmodel.cn/markdown/1753630625104kilo-3.png?attname=kilo-3.png)

### 2. 填入配置信息

请按照以下配置填入相关信息：

> 若您的 Kilo Code 版本较低没有 `China Coding Plan` 选项，请先将插件更新到最新版本。

* **API Provider**：选择 `Z AI`
* **Z AI Entrypoint**：选择 `China Coding Plan (https://open.bigmodel.cn/api/coding/paas/v4)`
* **Z AI API Key**：填入您的智谱 API Key
* **Model**：选择 `glm-4.6` 或者列表中您想使用的模型

![Description](https://cdn.bigmodel.cn/markdown/1760931950273image.png?attname=image.png)

## 三、开始使用

配置完成后，您可以在输入框中输入需求，让 AI 模型帮助您完成各种任务，例如：

* 分析数据表结构
* 统计数据和计算平均值
* 生成和优化 SQL 查询
* 代码生成和重构
* 项目分析和文档编写

### 使用演示

<video src="https://cdn.bigmodel.cn/agent-demos/demo-kilocode.mp4" controls />

## 四、视觉和搜索 MCP 服务器

参考 [视觉MCP服务器](/cn/coding-plan/mcp/vision-mcp-server) 和 [搜索MCP服务器](/cn/coding-plan/mcp/search-mcp-server) 文档，配置完成后即可在 Kilo 中使用。


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.bigmodel.cn/llms.txt