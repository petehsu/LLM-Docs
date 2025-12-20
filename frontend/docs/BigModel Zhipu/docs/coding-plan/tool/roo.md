# Roo Code

> 在 Roo Code 插件中使用 GLM Coding Plan 的方法

Roo Code 是一个智能的 VS Code 插件，能够帮助你完成项目分析、代码生成和重构等任务，让开发过程更加轻松高效。

搭配 [**GLM Coding Plan**](https://zhipuaishengchan.datasink.sensorsdata.cn/t/Nd)，Roo Code 的能力能进一步增强，让你在项目管理和代码优化中更高效、更稳定。

<Warning>
  使用 GLM Coding Plan 时，需要配置专属的 Coding API 端点 [https://open.bigmodel.cn/api/coding/paas/v4](https://open.bigmodel.cn/api/coding/paas/v4) 而不是通用 API 端点
</Warning>

<Warning>
  在 2025-09-30 日期前已使用的用户请注意：\
  GLM Coding Plan 的模型已支持 GLM-4.6，请在配置中将模型切换为 `glm-4.6` 已体验最新模型。
</Warning>

## 一、安装 Roo Code 插件

### 1. 打开插件市场

1. 打开 VS Code
2. 点击左侧插件市场图标
3. 在搜索框中输入 `Roo Code`
4. 找到 `Roo Code` 插件

![Description](https://cdn.bigmodel.cn/markdown/1753630093894roo-1.png?attname=roo-1.png)

### 2. 安装插件

1. 点击 `Install` 按钮进行安装
2. 安装完成后，选择信任开发者

![Description](https://cdn.bigmodel.cn/markdown/1753630101211roo-2.png?attname=roo-2.png)

## 二、配置 API 设置

### 配置信息

请按照以下配置填入相关信息：

> 若您的 Roo Code 版本较低没有 `China Coding Plan` 选项，请先将插件更新到最新版本。

* **API Provider**：选择 `Z AI`
* **Z AI Entrypoint**：选择 `China Coding Plan (https://open.bigmodel.cn/api/coding/paas/v4)`
* **Z AI API Key**：填入您的智谱 API Key
* **Model**：选择 `glm-4.6` 或者列表中您想使用的模型

![Description](https://cdn.bigmodel.cn/markdown/1760932336388image.png?attname=image.png)

## 三、权限设置和使用

### 1. 配置权限

根据您的具体需求，选择允许的权限：

* 文件读写操作
* 自动批准执行
* 项目访问权限

![Description](https://cdn.bigmodel.cn/markdown/1753630112197roo-4.png?attname=roo-4.png)

### 2. 开始使用

在输入框中输入您的需求，Roo Code 可以帮助您完成：

* 总结当前项目结构
* 分析重点模块和功能
* 代码重构和优化
* 生成文档和注释
* 问题诊断和修复建议

## 四、视觉和搜索 MCP 服务器

参考 [视觉MCP服务器](../mcp/vision-mcp-server) ，[搜索MCP服务器](../mcp/search-mcp-server) 和 [网页读取MCP服务器](../mcp/reader-mcp-server) 文档，配置完成后即可在 Roo Code 中使用。


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.bigmodel.cn/llms.txt