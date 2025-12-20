# Crush

> 在 Crush 中使用 GLM Coding Plan 的方法

Crush 既是一款在终端中运行的 CLI + TUI AI 编程工具，也支持多种模型接入，能够在命令行环境下完成代码生成、调试、对话、文件操作与多任务处理等工作。

搭配 [**GLM Coding Plan**](https://zhipuaishengchan.datasink.sensorsdata.cn/t/Nd)，Crush 可在终端中发挥强大的编程与对话能力，兼具高效与稳定，全面提升开发体验。

<Warning>
  使用 GLM Coding Plan 时，需要配置专属的 Coding API 端点 [https://open.bigmodel.cn/api/coding/paas/v4](https://open.bigmodel.cn/api/coding/paas/v4) 而不是通用 API 端点
</Warning>

<Warning>
  在 2025-09-30 日期前已使用的用户请注意：\
  GLM Coding Plan 的模型已支持 GLM-4.6，请在配置中将模型切换为 `glm-4.6` 已体验最新模型。
</Warning>

## 一、安装 Crush

根据您的系统选择对应的安装方式：

<Tabs>
  <Tab title="Homebrew（macOS 推荐）">
    ```
    brew install charmbracelet/tap/crush
    ```
  </Tab>

  <Tab title="NPM（跨平台）">
    ```
    npm install -g @charmland/crush
    ```
  </Tab>

  <Tab title="Arch Linux">
    ```
    yay -S crush-bin
    ```
  </Tab>

  <Tab title="Nix">
    ```
    nix run github:numtide/nix-ai-tools#crush
    ```
  </Tab>
</Tabs>

## 二、配置 GLM-4.6 模型

### 1. 获取您的 ZHIPU API 密钥

访问智谱 Bigmodel 开放平台，获取你的 [API key](https://open.bigmodel.cn/usercenter/proj-mgmt/apikeys)。

### 2. 启动 Crush 并选择模型

运行 crush 命令启动应用：

```
crush
```

在模型选择界面中，选择以下模型之一：

* glm-4.6 : 最新最强编码模型
* glm-4.5 : 标准版本，适合复杂任务
* glm-4.5-air : 轻量版本，响应更快

### 3. 输入 API 密钥

在提示界面中输入您从智谱 AI 获取的 API Key。
![Description](https://cdn.bigmodel.cn/markdown/1759228565353crush.png?attname=crush.png)

## 三、修改 Crush 配置

### 1. 找到配置文件

配置文件位置因操作系统而异：

<Tabs>
  <Tab title="macOS/Linux">
    ```
    ~/.config/crush/crush.json
    ```
  </Tab>

  <Tab title="Windows">
    ```
    %USERPROFILE%\.config\crush\crush.json
    ```
  </Tab>
</Tabs>

### 2. 修改 API 端点

打开 crush.json 文件，配置如下，注意替换您的 API KEY：

```
{
  "providers": {
    "zai": {
      "id": "zai",
      "name": "ZAI Provider",
      "base_url": "https://open.bigmodel.cn/api/coding/paas/v4",
      "api_key": "your_api_key"
    }
  }
}
```

## 四、完成配置并启动 Crush

### 1. 配置完成后，您可以运行以下命令启动 Crush

```
crush
```

### 2. 通过输入模型名称，选择 GLM-4.6 模型进行操作

```
/models
```

配置完成后，重启 Crush 应用。您现在可以：

* 使用 GLM-4.6 进行代码生成和优化
* 进行技术问答和调试
* 执行复杂的编程任务
* 享受智谱 AI 的强大能力

## 五、视觉和搜索 MCP 服务器

参考 [视觉MCP服务器](../mcp/vision-mcp-server) ，[搜索MCP服务器](../mcp/search-mcp-server) 和 [网页读取MCP服务器](../mcp/reader-mcp-server) 文档，配置完成后即可在 Crush 中使用。


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.bigmodel.cn/llms.txt