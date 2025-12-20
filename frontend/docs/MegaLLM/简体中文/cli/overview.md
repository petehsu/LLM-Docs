# CLI 概述

> MegaLLM CLI 是一个交互式配置工具,用于配置 AI 编程助手以使用 MegaLLM AI 服务。它自动化配置过程,安全地管理 API 密钥,并在多个平台上提供无缝的配置体验。

## 快速开始

几秒钟内即可开始使用:

```bash  theme={null}
npx megallm@latest
```

就是这样!交互式向导将引导您完成整个配置过程。

<Tip>
  无需安装 - 只需运行 `npx megallm@latest` 并按照提示操作
</Tip>

## 功能说明

CLI 会自动:

* **检测** 已安装的 AI 工具和您的系统配置
* **安装** 缺失的工具(需要您的许可)
* **配置** AI 助手使用您的 MegaLLM API 密钥
* **备份** 在进行更改之前备份现有配置
* **验证** 设置以确保一切正常运行

## 支持的工具

<CardGroup cols={3}>
  <Card title="Claude Code" icon="robot">
    系统级和项目级配置
  </Card>

  <Card title="Codex/Windsurf" icon="code">
    系统级配置
  </Card>

  <Card title="OpenCode" icon="brackets-curly">
    系统级和项目级配置
  </Card>
</CardGroup>

## 核心特性

<CardGroup cols={2}>
  <Card title="智能检测" icon="magnifying-glass">
    自动检测操作系统、Shell、已安装工具和现有配置
  </Card>

  <Card title="自动化配置" icon="wand-magic-sparkles">
    带有分步指导的交互式向导
  </Card>

  <Card title="安全存储" icon="shield-halved">
    自动备份和安全的 API 密钥管理
  </Card>

  <Card title="跨平台" icon="globe">
    支持 macOS、Linux、Windows 以及所有主流 Shell
  </Card>
</CardGroup>

## 工作原理

<Steps>
  <Step title="运行 CLI">
    在终端中执行 `npx megallm@latest`
  </Step>

  <Step title="系统检测">
    CLI 检测您的操作系统、Shell 和已安装的 AI 工具
  </Step>

  <Step title="选择配置">
    选择要配置的工具以及配置级别(系统级/项目级)
  </Step>

  <Step title="输入 API 密钥">
    提供您的 MegaLLM API 密钥(或获得创建指引)
  </Step>

  <Step title="审查并确认">
    查看配置摘要并确认
  </Step>

  <Step title="应用设置">
    CLI 配置文件、设置环境变量并重新加载 Shell
  </Step>
</Steps>

## 配置级别

在两个配置级别之间进行选择:

### 系统级(全局)

应用于您计算机上的**所有项目**。

**适用于:**

* 个人开发环境
* 单一开发者配置
* 快速测试和原型开发

**存储位置:**

* `~/.claude/` - Claude Code
* `~/.codex/` - Codex/Windsurf
* `~/.config/opencode/` - OpenCode

### 项目级(本地)

**仅**应用于当前项目目录。

**适用于:**

* 具有共享配置的团队项目
* 每个项目使用不同的 API 密钥
* 版本控制的设置

**存储位置:**

* `./.claude/` - Claude Code
* `./opencode.json` - OpenCode

<Note>
  **Codex/Windsurf 仅支持系统级配置**
</Note>

## 系统要求

<Info>
  需要 **Node.js 18.0.0+**。检查您的版本: `node --version`
</Info>

**支持的平台:**

* macOS (Intel 和 Apple Silicon)
* Linux (所有主流发行版)
* Windows (10/11,支持 WSL 或原生)

**支持的 Shell:**

* bash
* zsh
* fish
* PowerShell

## 安装选项

### NPX(推荐)

无需安装:

```bash  theme={null}
npx megallm@latest
```

### 全局安装

安装一次,随时使用:

```bash  theme={null}
npm install -g megallm
megallm
```

### 特定版本

运行特定版本:

```bash  theme={null}
npx megallm@2.5.9
```

## 首次配置示例

```bash  theme={null}
# 运行 CLI
npx megallm@latest

# 交互式提示:
# ✓ 系统检测: Linux (bash)
# ✓ 工具检测: Claude Code ✓, Codex ✗
#
# ? 选择工具? › Claude Code
# ? 配置级别? › 系统级(全局)
# ? 输入 API 密钥: sk-mega-***
#
# ✓ 配置成功应用!
# 🎉 准备好使用 Claude Code 与 MegaLLM
```

## 获取您的 API 密钥

<Steps>
  <Step title="访问控制台">
    前往 [megallm.io/dashboard](https://megallm.io/dashboard)
  </Step>

  <Step title="注册或登录">
    创建账户或登录现有账户
  </Step>

  <Step title="生成 API 密钥">
    导航到 API 密钥部分并点击"创建新 API 密钥"
  </Step>

  <Step title="复制密钥">
    复制您的密钥(以 `sk-mega-` 开头) - 您将无法再次看到它
  </Step>

  <Step title="在 CLI 中使用">
    在配置期间提示时粘贴密钥
  </Step>
</Steps>

<Tip>
  CLI 可以在配置期间自动为您打开控制台
</Tip>

## 下一步

<CardGroup cols={2}>
  <Card title="安装指南" icon="download" href="/cn/cli/installation">
    详细的安装和系统要求
  </Card>

  <Card title="配置" icon="gear" href="/cn/cli/configuration">
    完整的配置工作流程
  </Card>

  <Card title="配置详情" icon="gear" href="/cn/cli/configuration">
    每个工具的配置详情
  </Card>

  <Card title="示例" icon="code" href="/cn/cli/examples">
    实用的使用示例
  </Card>

  <Card title="故障排除" icon="circle-exclamation" href="/cn/cli/troubleshooting">
    常见问题和解决方案
  </Card>

  <Card title="常见问题" icon="circle-question" href="/cn/cli/faq">
    常见问题解答
  </Card>
</CardGroup>

## 快速链接

* [Claude Code 配置](/cn/cli/claude-config)
* [Codex/Windsurf 配置](/cn/cli/codex-config)
* [OpenCode 配置](/cn/cli/opencode-config)
* [GitHub 仓库](https://github.com/Megallm/megallm-npm)
* [NPM 包](https://www.npmjs.com/package/megallm)

## 技术支持

需要帮助?我们随时为您服务:

* **邮箱**: [support@megallm.io](mailto:support@megallm.io)
* **Discord**: [加入我们的社区](https://discord.gg/devsindia)
* **GitHub Issues**: [报告错误或请求功能](https://github.com/Megallm/megallm-npm/issues)


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt