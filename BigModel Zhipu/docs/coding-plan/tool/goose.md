# Goose

> 在 Goose 中使用 GLM Coding Plan 的方法

Goose 是一款AI Agent 工具，支持在本地或桌面环境运行，也提供 CLI 形式。它支持多种模型接入，结合 MCP 协议连接外部工具与 API，自动化执行工程任务，如代码生成、调试、测试与部署。

搭配 [**GLM Coding Plan**](https://zhipuaishengchan.datasink.sensorsdata.cn/t/Nd)，Goose 的使用成本大幅降低，功能体验更加稳定与高效。

<Warning>
  在 2025-09-30 日期前已使用的用户请注意：\
  GLM Coding Plan 的模型已支持 GLM-4.6，请在配置中将模型切换为 `glm-4.6` 已体验最新模型。
</Warning>

## 一、安装 Goose 桌面版

1. 访问 Goose 桌面版的官方文档页面：[Goose 快速入门](https://block.github.io/goose/docs/quickstart/)。
2. 根据您的操作系统选择合适的安装方式，完成 Goose 桌面版的安装。

## 二、创建新 Provider

1. 打开 Goose 桌面版应用，进入主界面。
2. 找到并点击左侧菜单中的 **“创建新 Provider”**（如图所示）。
3. 按照提示输入所需信息，完成新 Provider 的创建。

![Description](https://cdn.bigmodel.cn/markdown/1758091325715goose-1.jpeg?attname=goose-1.jpeg)

## 三、选择 Anthropic 协议并配置

1. 在创建 Provider 的过程中，选择 Anthropic 协议。
2. 填写以下必要的配置：

* Base URL: 输入 GLM-4.6 API 地址 `https://open.bigmodel.cn/api/anthropic` 。
* API Key: 输入您的 GLM-4.6 API 密钥。
* Model: 选择 GLM-4.6, GLM-4.5 或 GLM-4.5-air，根据您的需求选择模型。

3. 配置完成后，保存设置并继续。

![Description](https://cdn.bigmodel.cn/markdown/1759308446944image.png?attname=image.png)

## 四、切换模型

1. 配置完成后，回到 Goose 桌面版的主界面。
2. 在主界面最底部找到并点击 “Switch Models”。
3. 在下拉列表中选择您刚才创建的 新 Provider。
4. 确保新 Provider 已成功切换为当前使用模型。

![Description](https://cdn.bigmodel.cn/markdown/1758091346221goose-3.jpeg?attname=goose-3.jpeg)

## 五、开始使用

1. 配置完成并切换模型后，您就可以开始使用 Goose 桌面版与 GLM-4.6 模型进行交互。
2. 输入您的请求，Goose 将根据您的配置自动调用 GLM-4.6 模型并生成响应。

![Description](https://cdn.bigmodel.cn/markdown/1758091350444goose-4.jpeg?attname=goose-4.jpeg)

## 六、视觉和搜索 MCP 服务器

参考 [视觉MCP服务器](../mcp/vision-mcp-server) ，[搜索MCP服务器](../mcp/search-mcp-server) 和 [网页读取MCP服务器](../mcp/reader-mcp-server) 文档，配置完成后即可在 Goose 中使用。


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.bigmodel.cn/llms.txt