文档

入门指南

ModelScope MCP 服务器配置指南

# 在 Playground 中配置 ModelScope MCP 服务器

Kimi 开放平台 与 ModelScope 魔搭达成官方合作，简化了 Kimi 开放平台 Playground 添加 MCP 服务器的操作步骤，同时可以在 ModelScope 社区发现海量 MCP 服务器。下面我们来看下如何在 Kimi Playground 中使用 ModelScope MCP 服务。

## 

首先，登录 Kimi Playground：[https://platform.moonshot.cn/playground (opens in a new tab)](https://platform.moonshot.cn/playground) 确保可以使用 Kimi K2 模型进行基本对话。

在 Kimi Playground 中启用 MCP 服务，需要在「MCP 服务器设置」中添加 MCP 服务配置。进入后，您会看到 Kimi Playground 默认选中 ModelScope 作为 MCP 服务提供商。Kimi Playground 与 ModelScope（魔搭）达成合作，您只需输入您的魔搭 API 令牌，即可一键同步您魔搭账号下所有已配置托管的 MCP 服务配置。如果您之前未使用过 ModelScope MCP 广场，建议参考 [ModelScope 官方文档 (opens in a new tab)](https://modelscope.cn/docs/mcp/kimi-playground)，选择并托管您的 MCP 服务。

### 

![mcp-server-setting](/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fconfig.9fed143c.png&w=3840&q=75)

### 

![syc](/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsyc.a070822e.png&w=3840&q=75)

其中 API 令牌可以通过访问[魔搭首页-访问令牌 (opens in a new tab)](https://modelscope.cn/my/myaccesstoken)页面获取

![keys](/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fget-keys.71b7495f.png&w=3840&q=75)

在获取 ModelScope API 令牌后，粘贴到步骤 3 的空格中，并点击「开始同步」按钮。

![start-syc](/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fstart-syc.fc8956d1.png&w=3840&q=75)

您将看到所有已配置连接的魔搭 Hosted MCP 服务已成功同步至 Kimi Playground 的可用 MCP 服务列表中.

![mcp-list](/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fmcp-list.eb81a5d4.png&w=3840&q=75)

然后您可以愉快地在 Kimi Playground 中体验 AI 助手调用 MCP 服务完成任务～

### 

如果后续在 ModelScope MCP 广场新增或删除托管 MCP 服务，您可以在“设置-MCP 服务器-同步服务器”中点击同步按钮进行增量更新。

![add-mcp](/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fadd-mcp.117461e0.png&w=3840&q=75)

## 

同步 MCP 服务后，您将在 Kimi Playground 平台页面的左侧看到之前同步操作已导入的的 “MCP 服务列表”。在该列表中，您可以多选并启用您希望在本次对话中使用的 MCP 服务。

![manage-mcp](/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fmanage-mcp.fc328625.png&w=3840&q=75)

例如，以高德地图为例，您可以在此列表中选择启用相关的 MCP 服务。

![maps](/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fmaps.2be214c9.png&w=3840&q=75)

轻松 get 您的专属行程助理！

Last updated on 2025年11月9日

[在编程工具中使用 Kimi K2 模型](/docs/guide/agent-support "在编程工具中使用 Kimi K2 模型")[Kimi 官方工具集成说明](/docs/guide/use-official-tools "Kimi 官方工具集成说明")