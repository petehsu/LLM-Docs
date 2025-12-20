# 远程 MCP 服务器

了解如何连接到第三方部署的远程 MCP 服务器，扩展 Claude API 的功能。

---

几家公司已经部署了远程 MCP 服务器，开发者可以通过 Anthropic MCP 连接器 API 连接到这些服务器。这些服务器通过 MCP 协议提供对各种服务和工具的远程访问，从而扩展了开发者和最终用户可用的功能。

<Note>
    下面列出的远程 MCP 服务器是设计用于与 Claude API 配合使用的第三方服务。这些服务器
    不属于 Anthropic 拥有、运营或认可。用户应该只连接到他们信任的远程 MCP 服务器，
    并且在连接之前应该审查每个服务器的安全实践和条款。
</Note>

## 连接到远程 MCP 服务器

要连接到远程 MCP 服务器：

1. 查看您想要使用的特定服务器的文档。
2. 确保您拥有必要的身份验证凭据。
3. 按照每家公司提供的特定服务器连接说明进行操作。

有关将远程 MCP 服务器与 Claude API 一起使用的更多信息，请参阅 [MCP 连接器文档](/docs/zh-CN/agents-and-tools/mcp-connector)。

## 远程 MCP 服务器示例

<MCPServersTable platform="mcpConnector" />

<Note>
**寻找更多？** [在 GitHub 上查找数百个 MCP 服务器](https://github.com/modelcontextprotocol/servers)。
</Note>