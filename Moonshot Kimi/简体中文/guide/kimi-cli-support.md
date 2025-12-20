文档

入门指南

Kimi CLI 使用指南

# 使用 Kimi CLI 调用 Kimi 大模型

Kimi CLI 是 Moonshot AI 自研的命令行通用智能体工具，它可以帮助你快速完成各种各样的编程和文件处理等任务。

> Kimi CLI 目前还在 Technical Preview 阶段，如遇到 bug 或有任何意见或建议，欢迎通过 [https://github.com/MoonshotAI/kimi-cli/issues (opens in a new tab)](https://github.com/MoonshotAI/kimi-cli/issues) 提交反馈！

![](/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fhello.d7a75b4b.png&w=3840&q=75)

## 

Kimi CLI 支持 macOS 和 Linux 系统，要求使用 uv 包管理器安装。

如果你的系统中还没有安装 uv，请先参考 [uv 安装说明 (opens in a new tab)](https://docs.astral.sh/uv/getting-started/installation/) 进行安装。通常，在 macOS 和 Linux 系统中，可使用以下命令安装 uv：

```sh
curl-LsSfhttps://astral.sh/uv/install.sh|sh
```

安装 uv 后，使用以下命令安装 Kimi CLI：

```sh
uvtoolinstall--python3.13kimi-cli
```

运行以下命令检查是否安装成功：

```sh
kimi--version
```

> 由于 macOS 的安全校验机制，在 macOS 上第一次运行可能需要较长时间，请耐心等待。可以尝试将你所使用的终端工具添加到「系统设置」-「隐私与安全性」-「开发者工具」中，以信任终端上运行的程序。

## 

使用以下命令升级 Kimi CLI：

```sh
uvtoolupgradekimi-cli--no-cache
```

## 

在命令行中进入你想要 Kimi CLI 操作的项目目录，运行 `kimi` 命令，即可启动 Kimi CLI。例如：

```sh
cdmy-project
kimi
```

首次运行时，Kimi CLI 会提示没有配置模型，需输入 `/setup` 元命令，进入配置流程：

![](/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsetup.eaedd5cc.png&w=3840&q=75)

* Kimi For Coding 会员权益用户，选择第一个「Kimi For Coding 」，在随后的提示中，输入在会员页面获得的 API Key，并选择 `kimi-for-coding` 模型；Moonshot AI 开放平台用户，根据提示选择对应的平台，输入 API Key 并选择想要使用的模型。[查看 Kimi For Coding 会员权益说明 (opens in a new tab)](https://www.kimi.com/coding/docs/benefits.html)
* 使用开放平台 API Key 的用户，请选择第二个 「Moonshot AI 开放平台」,然后配置在开放平台创建的 API Key [创建 API Key](/console/api-keys)，请确保 API Key 有足够的余额，否则可能会出现 API 调用失败的情况。

配置完成后，即可开始使用 Kimi CLI，例如：

![](/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F2048-game.1fdb010d.png&w=3840&q=75)

## 

Kimi CLI 不仅仅是一个编程智能体，还可以通过 Ctrl-K 快捷键切换到 shell 模式。通过该模式，你可以在不离开 Kimi CLI 的情况下，直接执行 shell 命令，方便进行文件操作和查看结果。例如：

![](/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fshell-mode.6ba7d851.png&w=3840&q=75)

## 

Zsh 用户可以搭配 [zsh-kimi-cli (opens in a new tab)](https://github.com/MoonshotAI/zsh-kimi-cli) 插件，在 shell 中快速调用 Kimi CLI。

使用如下命令安装（以 oh-my-zsh 为例，其它包管理请参考仓库 README）：

```sh
gitclonehttps://github.com/MoonshotAI/zsh-kimi-cli.git \
  ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/kimi-cli
```

然后在 `~/.zshrc` 中启用该插件：

```sh
plugins=(...kimi-cli)
```

重新启动 Zsh 之后，即可在 Zsh 中通过 Ctrl-K 进入 Kimi CLI 模式：

![](/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fzsh-integration.4c184687.png&w=3840&q=75)

目前 zsh-kimi-cli 插件还在持续更新中，请定期前往 `custom/plugins/kimi-cli` 目录通过 `git pull` 拉取更新。

## 

Kimi CLI 原生提供 [Agent Client Protocol (opens in a new tab)](https://github.com/agentclientprotocol/agent-client-protocol) 支持，可以搭配任何 ACP 客户端使用，例如 [Zed 编辑器 (opens in a new tab)](https://zed.dev/)。

> ACP 是 Zed 编辑器推出的一种通用智能体协议，使智能体的核心功能（服务端）和用户界面（客户端）解耦，用户可以自由选择不同的智能体服务端和客户端进行搭配使用。

要在 Zed 中使用 Kimi CLI，首先需确保已经安装并配置好 Kimi CLI，然后在 Zed 配置文件（`~/.config/zed/settings.json`）中添加以下内容：

```json
{
"agent_servers": {
"Kimi CLI": {
"command":"kimi",
"args": ["--acp"],
"env": {}
    }
  }
}
```

随后即可在 Zed 侧边栏创建 Kimi CLI Thread：

![](/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fzed-new-thread.14b09b3c.png&w=3840&q=75)

## 

Kimi CLI 支持广泛采用的 MCP 配置格式指定 MCP 工具。例如：

```json
{
"mcpServers": {
"context7": {
"url":"https://mcp.context7.com/mcp",
"headers": {
"CONTEXT7_API_KEY":"YOUR_API_KEY"
      }
    },
"chrome-devtools": {
"command":"npx",
"args": ["-y","chrome-devtools-mcp@latest"]
    }
  }
}
```

启动时，通过 `--mcp-config-file` 参数指定 MCP 配置文件路径即可。例如：

```sh
kimi--mcp-config-file/path/to/mcp.json
```

## 

除了上述功能，可以通过 `kimi --help` 查看更多用法。

Last updated on 2025年11月9日

[Kimi 官方工具集成说明](/docs/guide/use-official-tools "Kimi 官方工具集成说明")[Kimi K2 模型搭建 Agent 指南](/docs/guide/use-kimi-k2-to-setup-agent "Kimi K2 模型搭建 Agent 指南")