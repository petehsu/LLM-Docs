# OpenCode

> 在 OpenCode 中使用 GLM Coding Plan 的方法

OpenCode 既是一款在终端中运行的 CLI + TUI AI 编程代理工具，也提供 IDE 的插件集成，能够在不同开发环境下完成快速代码生成、调试、项目分析、文件操作与跨项目协作等任务。

搭配 [**GLM Coding Plan**](https://zhipuaishengchan.datasink.sensorsdata.cn/t/Nd)，OpenCode 的使用成本大幅降低，开发效率与稳定性全面提升。

<img src="https://mintcdn.com/zhipu-ef7018ed/q2gZk1zJC_jqbzxN/resource/opencode.png?fit=max&auto=format&n=q2gZk1zJC_jqbzxN&q=85&s=e66a963a5949825fd159fcd5c68be1f2" alt="Description" data-og-width="2210" width="2210" data-og-height="1156" height="1156" data-path="resource/opencode.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/zhipu-ef7018ed/q2gZk1zJC_jqbzxN/resource/opencode.png?w=280&fit=max&auto=format&n=q2gZk1zJC_jqbzxN&q=85&s=c5d3a94fa32e9092bce0f1ca4cac00dd 280w, https://mintcdn.com/zhipu-ef7018ed/q2gZk1zJC_jqbzxN/resource/opencode.png?w=560&fit=max&auto=format&n=q2gZk1zJC_jqbzxN&q=85&s=684688e515d0645b2e4ca6a947e1a485 560w, https://mintcdn.com/zhipu-ef7018ed/q2gZk1zJC_jqbzxN/resource/opencode.png?w=840&fit=max&auto=format&n=q2gZk1zJC_jqbzxN&q=85&s=c57adbc4dae2467aa5492dd91e19294e 840w, https://mintcdn.com/zhipu-ef7018ed/q2gZk1zJC_jqbzxN/resource/opencode.png?w=1100&fit=max&auto=format&n=q2gZk1zJC_jqbzxN&q=85&s=ab0186b5417401b4d85c2856ce1a84cc 1100w, https://mintcdn.com/zhipu-ef7018ed/q2gZk1zJC_jqbzxN/resource/opencode.png?w=1650&fit=max&auto=format&n=q2gZk1zJC_jqbzxN&q=85&s=4161b66b6fde81a43b16a5a168c47f8a 1650w, https://mintcdn.com/zhipu-ef7018ed/q2gZk1zJC_jqbzxN/resource/opencode.png?w=2500&fit=max&auto=format&n=q2gZk1zJC_jqbzxN&q=85&s=773e54543022b44a88d4cc9cb23d1f02 2500w" />

<Warning>
  使用 GLM Coding Plan 时，需要配置专属的 Coding API 端点 [https://open.bigmodel.cn/api/coding/paas/v4](https://open.bigmodel.cn/api/coding/paas/v4) 而不是通用 API 端点
</Warning>

<Warning>
  在 2025-09-30 日期前已使用的用户请注意：\
  GLM Coding Plan 的模型已支持 GLM-4.6，请在配置中将模型切换为 `glm-4.6` 已体验最新模型。
</Warning>

## 一、安装 OpenCode

安装 OpenCode 最简单的方式是使用官方安装脚本：

```bash  theme={null}
curl -fsSL https://opencode.ai/install | bash
```

你也可以使用 npm 安装：

```bash  theme={null}
npm install -g opencode-ai
```

## 二、开始使用

### 1. 获取您的 ZHIPU API 密钥

访问智谱 Bigmodel 开放平台，获取你的 [API key](https://open.bigmodel.cn/usercenter/proj-mgmt/apikeys)。

### 2. 运行 `opencode auth login` 并选择 **Zhipu AI Coding Plan**

```bash  theme={null}
$ opencode auth login

┌  Add credential
│
◆  Select provider
│  ● Zhipu AI Coding Plan
│  ...
└
```

### 3. 输入您的 Zhipu AI API Key

```bash  theme={null}
$ opencode auth login

┌  Add credential
│
◇  Select provider
│  Zhipu AI Coding Plan
│
◇  Enter your API key
│  _
└
```

### 4. 运行 `opencode` 启动 OpenCode

```bash  theme={null}
$ opencode
```

使用 `/models`  命令来选择模型，例如 GLM-4.6。

```
/models
```

### 5. 视觉和搜索 MCP 服务器

参考 [视觉MCP服务器](../mcp/vision-mcp-server) ，[搜索MCP服务器](../mcp/search-mcp-server) 和 [网页读取MCP服务器](../mcp/reader-mcp-server) 文档，配置完成后即可在 OpenCode 中使用。

### 6. 其它低版本

> 若您使用的低版本 OpenCode 内无 `Zhipu AI Coding Plan` Provider 选项，建议您升级 OpenCode 版本。\
> 或者您可以选择 `Zhipu AI` Provider 后再参考下方切换端点配置。

在 `~/.config/opencode/opencode.json` 中配置：

```
{
    "$schema": "https://opencode.ai/config.json",
    "provider": {
        "zhipuai": {
            "api": "https://open.bigmodel.cn/api/coding/paas/v4"
        }
    }
}
```


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.bigmodel.cn/llms.txt