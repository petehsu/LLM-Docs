# 网页读取 MCP

<Info>
  网页读取 MCP Server 是一个基于模型上下文协议 (Model Context Protocol) 的网页内容抓取能力实现，为 Claude Code, Cline 等兼容 MCP 的客户端提供智谱的强大网页内容抓取能力，包括网页内容提取、结构化数据获取等功能。
</Info>

## 产品简介

<Tip>
  此拥有网页读取能力的 Remote MCP Server 是智谱为 **GLM Coding Plan 用户开发的专属 Server**, 让您的 Code Agent 拥有网页内容抓取能力，获取网页详细内容和结构化数据。
</Tip>

## 功能特性

<CardGroup cols={3}>
  <Card title="网页内容抓取" icon={<svg style={{maskImage: "url(/resource/icon/globe.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"}/>}>
    支持抓取任意网页的完整内容，包括文本、链接等
  </Card>

  <Card title="结构化数据" icon={<svg style={{maskImage: "url(/resource/icon/database.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"}/>}>
    提取网页的结构化数据，包括标题、正文、元数据等
  </Card>

  <Card title="远程服务" icon={<svg style={{maskImage: "url(/resource/icon/link.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"}/>}>
    基于 HTTP 协议的远程 MCP 服务，无需本地安装
  </Card>
</CardGroup>

## 支持的工具

该服务器实现了模型上下文协议，可与任何兼容 MCP 的客户端一起使用。目前提供以下工具：

* **`webReader`** - 抓取指定URL的网页内容，返回结果包括网页标题、正文内容、元数据、链接列表等。

## 示例场景

<AccordionGroup>
  <Accordion title="API 文档读取与摘要" defaultOpen>
    自动抓取并解析官方文档页面的标题、正文、示例与版本说明，提炼要点摘要，帮助快速对接与实现。
  </Accordion>

  <Accordion title="开源项目页面解析" defaultOpen>
    解析项目官网或仓库页面（如 README、Release Notes、使用指南），提取核心信息与链接列表，辅助评估与集成。
  </Accordion>

  <Accordion title="技术文章理解与知识提取">
    从博客、教程、指南页面提取步骤、命令与注意事项，将非结构化内容整理为可用的开发笔记与任务清单。
  </Accordion>

  <Accordion title="BUG 问题参考文档修复">
    问题修复，读取指定网页的公开信源已有的步骤，参考修复问题。
  </Accordion>

  <Accordion title="知识库构建与同步">
    将指定网页内容转换为结构化数据，并结合页面内链接进行增量同步，构建团队技术知识库。
  </Accordion>
</AccordionGroup>

## 安装与使用

### 快速开始

<Steps>
  <Step title="获取访问令牌">
    前往 [智谱开放平台](https://open.bigmodel.cn/usercenter/apikeys) 获取您的 API Key
  </Step>

  <Step title="配置 MCP 服务器">
    根据您使用的客户端 **参考下方** 选择相应的配置方式
  </Step>
</Steps>

### 支持的客户端

<Tabs>
  <Tab title="Claude Code">
    **一键安装命令**

    注意替换里面的 `your_api_key` 为您上一步获取到的 API Key

    ```bash  theme={null}
    claude mcp add -s user -t http web-reader https://open.bigmodel.cn/api/mcp/web_reader/mcp --header "Authorization: Bearer your_api_key"
    ```

    **手动配置**

    编辑 Claude Code 的配置文件, 位于用户目录下 `.claude.json` 的 MCP 部分：

    ```json  theme={null}
    {
      "mcpServers": {
        "web-reader": {
          "type": "http",
          "url": "https://open.bigmodel.cn/api/mcp/web_reader/mcp",
          "headers": {
            "Authorization": "Bearer your_api_key"
          }
        }
      }
    }
    ```
  </Tab>

  <Tab title="Cline (VS Code)">
    在 Cline 扩展设置中添加 MCP 服务器配置：

    注意替换里面的 `your_api_key` 为您上一步获取到的 API Key

    ```json  theme={null}
    {
      "mcpServers": {
        "web-reader": {
          "type": "streamableHttp",
          "url": "https://open.bigmodel.cn/api/mcp/web_reader/mcp",
          "headers": {
            "Authorization": "Bearer your_api_key"
          }
        }
      }
    }
    ```

    若老版本 Cline 不支持 StreamableHttp 类型的 MCP 服务器，可以使用 SSE 类型的配置：

    ```json  theme={null}
    {
      "mcpServers": {
        "web-reader": {
          "type": "sse",
          "url": "https://open.bigmodel.cn/api/mcp/web_reader/sse?Authorization=your_api_key"
        }
      }
    }
    ```
  </Tab>

  <Tab title="OpenCode">
    在 OpenCode 设置中添加 MCP 服务器配置：

    参考 [OpenCode MCP 文档](https://opencode.ai/docs/mcp-servers)

    注意替换里面的 `your_api_key` 为您上一步获取到的 API Key

    ```json  theme={null}
    {
        "$schema": "https://opencode.ai/config.json",
        "mcp": {
            "web-reader": {
                "type": "remote",
                "url": "https://open.bigmodel.cn/api/mcp/web_reader/mcp",
                "headers": {
                    "Authorization": "Bearer your_api_key"
                }
            }
        }
    }
    ```
  </Tab>

  <Tab title="Crush">
    在 Crush 设置中添加 MCP 服务器配置：

    注意替换里面的 `your_api_key` 为您上一步获取到的 API Key

    ```json  theme={null}
    {
        "$schema": "https://charm.land/crush.json",
        "mcp": {
            "web-reader": {
                "type": "http",
                "url": "https://open.bigmodel.cn/api/mcp/web_reader/mcp",
                "headers": {
                    "Authorization": "Bearer your_api_key"
                }
            }
        }
    }
    ```
  </Tab>

  <Tab title="Goose">
    在 Goose 设置中添加 MCP 服务器配置：

    点击 `Extensions` -> `Add custom extension`

    配置 Extension Name 为 `web-reader`，Type 选择 `SSE`，Endpoint 填写如下 URL：

    ```
    https://open.bigmodel.cn/api/mcp/web_reader/sse?Authorization=your_api_key
    ```

    最后点击底部 `Add Extension` 即可，注意替换里面的 `your_api_key` 为您上一步获取到的 API Key
  </Tab>

  <Tab title="Roo Code, Kilo Code 其它">
    对于 Roo Code, Kilo Code 等其它支持 MCP 协议的客户端，参考以下通用配置：

    注意替换里面的 `your_api_key` 为您上一步获取到的 API Key

    ```json  theme={null}
    {
      "mcpServers": {
        "web-reader": {
          "type": "streamable-http",
          "url": "https://open.bigmodel.cn/api/mcp/web_reader/mcp",
          "headers": {
            "Authorization": "Bearer your_api_key"
          }
        }
      }
    }
    ```
  </Tab>
</Tabs>

## MCP 使用额度说明

<Check>
  调用额度如下：

  * **Lite 套餐**：联网搜索 MCP 和网页读取 MCP 每月合计 1 百次，达到上限后当月无法调用；视觉理解 MCP 共享套餐的 5 小时最大 prompt 资源池，达到上限后会在 5 小时周期后恢复额度。
  * **Pro 套餐**：联网搜索 MCP 和网页读取 MCP 每月合计 1 千次，达到上限后当月无法调用；视觉理解 MCP 共享套餐的 5 小时最大 prompt 资源池，达到上限后会在 5 小时周期后恢复额度。
  * **Max 套餐**：联网搜索 MCP 和网页读取 MCP 每月合计 4 千次，达到上限后当月无法调用；视觉理解 MCP 共享套餐的 5 小时最大 prompt 资源池，达到上限后会在 5 小时周期后恢复额度。
</Check>

## 故障排除

<AccordionGroup>
  <Accordion title="访问令牌无效">
    **问题：** 收到访问令牌无效的错误

    **解决方案：**

    1. 确认访问令牌是否正确复制
    2. 检查访问令牌是否已激活
    3. 确认访问令牌是否有足够的余额
    4. 检查 Authorization header 格式是否正确
  </Accordion>

  <Accordion title="连接超时">
    **问题：** MCP 服务器连接超时

    **解决方案：**

    1. 检查网络连接
    2. 确认防火墙设置
    3. 验证服务器 URL 是否正确
    4. 增加超时时间设置
  </Accordion>

  <Accordion title="网页读取失败">
    **问题：** 网页内容抓取返回空结果或错误

    **解决方案：**

    1. 确认目标 URL 是否可访问
    2. 检查网页是否存在反爬虫机制
    3. 尝试使用不同的网页 URL
    4. 确认网络连接正常
    5. 联系技术支持获取帮助
  </Accordion>
</AccordionGroup>

## 相关资源

* [模型上下文协议 (MCP) 官方文档](https://modelcontextprotocol.io/)
* [Claude Code MCP 配置指南](https://docs.anthropic.com/en/docs/claude-code/mcp)
* [智谱 API 文档](/cn/api/introduction)
* [GLM Coding Plan 介绍](/cn/coding-plan/overview)


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.bigmodel.cn/llms.txt