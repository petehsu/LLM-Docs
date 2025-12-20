# Factory Droid

> 在 Factory Droid 中使用 GLM 编码计划的方法

Factory Droid 是一款企业级 AI 编码代理，它运行在你的终端中，负责端到端的软件开发工作流。

搭配 [**GLM Coding Plan**](https://zhipuaishengchan.datasink.sensorsdata.cn/t/Nd)，Droid 可在终端中发挥强大的编程与对话能力，兼具高效与稳定，全面提升开发体验。

<Warning>
  Factory Droid 需要成功登录 Factory Droid 账户认证后才能使用，注意其需要海外手机号验证。
</Warning>

## 步骤 1：安装 Factory Droid

**macOS / Linux：**

```bash  theme={null}
curl -fsSL https://app.factory.ai/cli | sh
```

**Windows：**

```powershell  theme={null}
irm https://app.factory.ai/cli/windows | iex
```

## 步骤 2：配置 ZHIPU GLM 模型

### 1. 获取您的 ZHIPU API 密钥

访问智谱 Bigmodel 开放平台，获取你的 [API key](https://open.bigmodel.cn/usercenter/proj-mgmt/apikeys)。

### 2. 配置自定义模型

Factory Droid 通过 BYOK（Bring Your Own Key，自带密钥）连接 ZHIPU 的 GLM 模型。

**配置文件位置**

* macOS/Linux：`~/.factory/config.json`
* Windows：`%USERPROFILE%\.factory\config.json`

<Tip>
  使用下方任一方式即可：\
  注意替换里面的 `your_api_key` 为您上一步获取到的 API Key。
</Tip>

方式一: Anthropic 协议

```json  theme={null}
{
  "custom_models": [
    {
      "model_display_name": "GLM-4.6 [GLM Coding Plan China]",
      "model": "glm-4.6",
      "base_url": "https://open.bigmodel.cn/api/anthropic",
      "api_key": "your_api_key",
      "provider": "anthropic",
      "max_tokens": 131072
    }
  ]
}
```

方式二：OpenAi 协议

```json  theme={null}
{
  "custom_models": [
    {
      "model_display_name": "GLM-4.6 [GLM Coding Plan China]",
      "model": "glm-4.6",
      "base_url": "https://open.bigmodel.cn/api/coding/paas/v4",
      "api_key": "your_api_key",
      "provider": "generic-chat-completion-api",
      "max_tokens": 131072
    }
  ]
}
```

**重要说明**

* 将 `your_api_key` 替换为你的实际 API Key
* API Key 仅保存在本地，且不会上传到 Factory 服务器

## 步骤 3：开始使用 Factory Droid

### 1. 启动 Droid

进入项目目录并启动 droid：

```bash  theme={null}
cd /path/to/your/project
droid
```

首次启动时，系统会引导你通过浏览器登录以连接到 Factory 的服务。

<Warning>
  Factory Droid 需要成功登录认证后才能使用，。
</Warning>

### 2. 选择你的 GLM 模型

droid 运行后，使用 `/model` 命令选择 GLM 模型：

```
/model
```

你配置的 GLM 自定义模型会显示在 “Custom models（自定义模型）” 分区。选择你配置的 GLM 模型。

### 3. 开始编码

使用 droid 进行代码分析、功能实现、缺陷修复、变更审查等任务。

## 关键特性

**规范模式（Specification Mode）**

* 按 **Shift+Tab** 激活
* 用自然语言描述需求
* 在实现前自动生成计划
* 审核并批准计划后再进行代码更改

**自动运行模式（Auto-Run Mode）**

* **低**：编辑与只读命令
* **中**：可回滚命令（包安装、构建、本地 git 等）
* **高**：除明确危险的命令外的所有命令
* 使用 **Shift+Tab** 切换模式

**IDE 集成**

* **VS Code/Cursor/Windsurf**：运行 `droid` 时自动安装
* **JetBrains**：从插件市场安装
* 功能：交互式差异、自动共享当前文件/选区、快速启动

**AGENTS.md — 项目约定**

在仓库根目录记录你的工作流：

```markdown  theme={null}
# 构建与测试
- 测试: `npm test`
- 构建: `npm run build`

# 约定
- TypeScript 严格模式
- 100 字符行长限制
- 新功能必须配套测试
```

Droid 会自动遵循你团队的实践。

**其他特性**

* 使用 `/cost` 命令进行成本追踪
* 满足 SOC-2 合规，并提供企业级部署选项
* 集成：Jira、Notion、Slack、GitHub
* 支持 MCP（Model Context Protocol）
* 每次改动均具备透明的审查流程

## 资源

* 文档：[docs.factory.ai](https://docs.factory.ai/cli/getting-started/overview)
* BYOK 配置：[docs.factory.ai/cli/byok/overview](https://docs.factory.ai/cli/byok/overview)
* 支持：[support@factory.ai](mailto:support@factory.ai)


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.bigmodel.cn/llms.txt