# 在 AI 编程工具里使用 M2

> MiniMax-M2 具备良好的代码理解、多轮对话和推理能力，兼容 OpenAI 和Anthropic 接口协议，适用于代码助手、Agent 工具、AI IDE 等多种场景。

## 获取 API Key

### Coding Plan API Key

推荐您订阅 [Coding Plan](https://platform.minimaxi.com/subscribe/coding-plan), 为您的编程提升效率

* 访问 [Coding Plan](https://platform.minimaxi.com/subscribe/coding-plan) 选择最适合您的编程套餐
* 前往 [账户管理/Conding Plan](https://platform.minimaxi.com/user-center/payment/coding-plan)  页面，查看您订阅的 Coding Plan 套餐，并获得Coding Plan的API Key，用于编程工具使用。

![apikey](https://filecdn.minimax.chat/public/2e4dbe4b-4782-4a42-98c5-d242617c0ab4.png)

### 开放平台 API Key

* 访问 [MiniMax 开放平台](https://platform.minimaxi.com/user-center/basic-information/interface-key) (国际用户可访问 [MiniMax Developer Platform](https://platform.minimax.io/user-center/basic-information/interface-key))
* 点击“**创建新的密钥**”按钮，输入项目名称以创建新的 API Key
* 创建成功后，系统将展示 API Key。**请务必复制并妥善保存**，该密钥**只会显示一次**，无法再次查看

![](https://filecdn.minimax.chat/public/6edf8af2-8e57-430b-b9ed-5c7d95c6cfc5.png)

## 在 Claude Code 中使用 MiniMax-M2（推荐）

### 安装 Claude Code

可参考 [Claude Code 文档](https://docs.claude.com/en/docs/claude-code/setup) 进行安装。

### 配置 MiniMax API

<Warning>
  **重要提示：使用前请先清除 Anthropic 环境变量**

  在配置前，请确保清除以下 Anthropic 相关的环境变量，以免影响 MiniMax API 的正常使用：

  * `ANTHROPIC_AUTH_TOKEN`
  * `ANTHROPIC_BASE_URL`
</Warning>

1. 编辑或创建 Claude Code 的配置文件，路径为 `~/.claude/settings.json`，在该文件中添加或更新 `env` 字段。

* `ANTHROPIC_BASE_URL` 需根据地理位置设置：国内用户使用 `https://api.minimaxi.com/anthropic`，国际用户使用 `https://api.minimax.io/anthropic`
* `<MINIMAX_API_KEY>` 需替换为从 [MiniMax 开发者平台](https://platform.minimaxi.com/user-center/basic-information/interface-key) (国际用户可访问 [MiniMax Developer Platform](https://platform.minimax.io/user-center/basic-information/interface-key)) 获取的 API Key

```json  theme={null}
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://api.minimaxi.com/anthropic",
    "ANTHROPIC_AUTH_TOKEN": "<MINIMAX_API_KEY>",
    "API_TIMEOUT_MS": "3000000",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": 1,
    "ANTHROPIC_MODEL": "MiniMax-M2",
    "ANTHROPIC_SMALL_FAST_MODEL": "MiniMax-M2",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "MiniMax-M2",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "MiniMax-M2",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "MiniMax-M2"
  }
}
```

2. 配置完成后，进入工作目录，在终端中运行 `claude` 命令以启动 Claude Code
3. 启动后，选择 **信任此文件夹 (Trust This Folder)**，以允许 Claude Code 访问该文件夹中的文件，随后开始在 Claude Code 中使用 MiniMax-M2

![](https://filecdn.minimax.chat/public/7ca00f05-81bd-4058-a357-3bb79eabd738.jpg)

### 在 Claude Code for VS Code 插件中使用

1. 安装 Claude Code for VS Code 插件

<img src="https://filecdn.minimax.chat/public/6939e914-b090-4f4f-9c0b-1e394828c23c.jpg" width="80%" />

2. 完成安装后，点击 **Settings**

![](https://filecdn.minimax.chat/public/d538a295-18e1-4381-ab35-3cfd2fbb7cfc.png)

3. 配置模型为 `MiniMax-M2`

* Settings - `Claude Code: Selected Model` 输入 `MiniMax-M2`

![](https://filecdn.minimax.chat/public/dcd3628e-d373-4c87-89ad-f9f8d031aeab.png)

或者

* 点击 **Edit in settings.json**，进入配置文件，修改 `claude-code.selectedModel` 为 `MiniMax-M2`

<img src="https://filecdn.minimax.chat/public/cddb052e-715e-4298-a688-76b93012eca3.jpg" width="80%" />

4. 配置环境变量信息

* 若已安装 Claude Code，请参考[文档](/guides/text-ai-coding-tools#configure-minimax-api)进行环境变量配置
* 若尚未安装 Claude Code，点击 `Edit in settings.json`

![](https://filecdn.minimax.chat/public/f36b5e4f-e0ab-424d-a34c-e54285e39633.png)

* 将 `claude-code.environmentVariables` 变量更改为以下设置。
* `ANTHROPIC_BASE_URL` 的 value 需根据地理位置设置：国内用户使用 `https://api.minimaxi.com/anthropic`，国际用户使用 `https://api.minimax.io/anthropic`

```json  theme={null}
"claudeCode.environmentVariables": [
        {
            "name": "ANTHROPIC_BASE_URL",
            "value": "https://api.minimaxi.com/anthropic"
        },
        {
            "name": "ANTHROPIC_AUTH_TOKEN",
            "value": "<MINIMAX_API_KEY>"
        },
        {
            "name": "API_TIMEOUT_MS",
            "value": "3000000"
        },
        {
            "name": "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC",
            "value": "1"
        },
        {
            "name": "ANTHROPIC_MODEL",
            "value": "MiniMax-M2"
        },
        {
            "name": "ANTHROPIC_SMALL_FAST_MODEL",
            "value": "MiniMax-M2"
        },
        {
            "name": "ANTHROPIC_DEFAULT_SONNET_MODEL",
            "value": "MiniMax-M2"
        },
        {
            "name": "ANTHROPIC_DEFAULT_OPUS_MODEL",
            "value": "MiniMax-M2"
        },
        {
            "name": "ANTHROPIC_DEFAULT_HAIKU_MODEL",
            "value": "MiniMax-M2"
        }
    ],
```

## 在 Cursor 中使用 MiniMax-M2

### 安装 Cursor

1. 通过 [Cursor 官网](https://cursor.com/) 下载并安装 Cursor
2. 打开 Cursor，右上角“设置”按钮，进入设置界面。点击“Sign in”按钮，登录自己的 Cursor 账户

![](https://filecdn.minimax.chat/public/e4755804-3b87-43e3-b595-5c0806f72853.png)

### 在 Cursor 中配置 MiniMax API

<Warning>
  **重要提示：使用前请先清除 OpenAI 环境变量**

  在配置前，请确保清除以下 OpenAI 相关的环境变量，以免影响 MiniMax API 的正常使用：

  * `OPENAI_API_KEY`
  * `OPENAI_BASE_URL`
</Warning>

<Warning>
  **注意：Cursor 仅支持订阅高级会员及以上的用户配置自定义模型**

  若非Cursor高级会员，配置时将出现以下错误:

  `The model MiniMax-M2 does not work with your current plan or api key`
</Warning>

1. 点击左侧栏的 **"Models"**，进入模型配置页面
2. 展开 **"API Keys"** 部分，配置 API 信息：
   * 勾选 **"Override OpenAI Base URL"**
   * 在下方输入 MiniMax 的调用地址（国内用户使用 `https://api.minimaxi.com/v1`，国际用户使用 `https://api.minimax.io/v1`）
3. 在 **OpenAI API Key** 输入框，配置从 [MiniMax 开放平台](https://platform.minimaxi.com/user-center/basic-information/interface-key) (国际用户可访问 [MiniMax Developer Platform](https://platform.minimax.io/user-center/basic-information/interface-key)) 获取的 API Key
4. 点击 **“OpenAI API Key”** 栏右侧的按钮

![](https://filecdn.minimax.chat/public/ebf48187-f00f-48df-a479-d9c17df67f71.jpeg)

5. 在弹出的窗口中点击 **“Enable OpenAI API Key”** 按钮，完成设置验证

![](https://filecdn.minimax.chat/public/67d40b7c-1a18-4553-a0f8-9ceb2dc610a4.png)

6. 在 **Models** 板块中，点击 **“View All Models”** 按钮，并点击 **“Add Custom Model”** 按钮

![](https://filecdn.minimax.chat/public/0c4bebfb-2859-482e-872b-11d6d361bc63.jpeg)

7. 输入模型名称“MiniMax-M2”后，点击“Add”按钮

![](https://filecdn.minimax.chat/public/f43b41a0-e24e-4d25-9aab-ee95ae37a638.jpeg)

8. 启用刚添加的 “MiniMax-M2” 模型
9. 在聊天面板中选择 **“MiniMax-M2”** 模型，开始使用 **“MiniMax-M2”**

<img src="https://filecdn.minimax.chat/public/8b022196-46fd-40d4-b928-8ef1eb239214.jpg" width="60%" />

## 在 Trae 中使用 MiniMax-M2

### 安装 Trae

1. 访问 [Trae 官网](https://www.trae.cn/) 下载并安装 Trae
2. 完成安装后，启动 Trae IDE

### 直接使用内置模型

安装完成后，启动 Trae IDE，即可直接使用内置的 MiniMax M2 模型，无需额外配置。

<img src="https://filecdn.minimax.chat/public/54d7d9a3-5c15-463a-9376-7d3ccc53fb17.png" width="60%" />

## 在 Cline 中使用 MiniMax-M2

### 安装 Cline

1. 打开 VS Code，点击左侧活动栏中的扩展图标，在搜索框中输入 `Cline`
2. 点击 `Install` 按钮进行安装，安装完成后，可能需要重启 VS Code

<img src="https://filecdn.minimax.chat/public/f1ba35cd-16b0-4bb3-aec0-6e27d5c5c7e9.png" width="80%" />

3. 完成安装后，可以在左侧活动栏中看到 "Cline" 的图标

<img src="https://filecdn.minimax.chat/public/cc07cac7-ef54-49ad-920a-5dd48c363911.png" width="60%" />

<Warning>
  若已安装 Cline，请升级至 3.34.1 或更高版本，并重启插件和 VS code 以确保正常使用。
</Warning>

### 在 Cline 中配置 MiniMax API

<Warning>
  **重要提示：使用前请先清除 Anthropic 环境变量**

  在配置前，请确保清除以下 Anthropic 相关的环境变量，以免影响 MiniMax API 的正常使用：

  * `ANTHROPIC_AUTH_TOKEN`
  * `ANTHROPIC_BASE_URL`
</Warning>

1. 点击"**Use your own API key**"按钮，进入 Cline 的参数配置界面
2. API Provider -> 选择"**MiniMax**"
3. MiniMax Entrypoint -> 根据您的地理位置选择（国内用户选择 `api.minimaxi.com`，国际用户选择 `api.minimax.io`）
4. MiniMax API Key -> 输入在 [MiniMax 开放平台](https://platform.minimaxi.com/user-center/basic-information/interface-key) (国际用户可访问 [MiniMax Developer Platform](https://platform.minimax.io/user-center/basic-information/interface-key)) 获取的 key
5. 点击“Let's go!”按钮后，点击右上角的"Done"，保存配置

<img src="https://filecdn.minimax.chat/public/2cd4bd7e-cf7a-44c3-b344-46698ca135c3.jpeg" width="60%" />

6. 勾选 Auto-approve 中的"Edit"选项框，开始使用“MiniMax-M2”

<img src="https://filecdn.minimax.chat/public/74a0374b-22ed-4cf1-b04c-a51a7f248e39.png" width="80%" />

## 在 Roo Code 中使用 MiniMax-M2

### 安装 Roo Code

1. 打开 VS Code，点击左侧活动栏中的扩展图标，在搜索框中输入 `Roo Code`
2. 点击 `Install` 按钮进行安装，安装完成后，可能需要重启 VS Code

<img src="https://filecdn.minimax.chat/public/4d6997ad-70dc-4079-bb91-5abd7e4d8074.jpg" width="80%" />

### 在 Roo Code 中配置 MiniMax API

1. 点击"**Settings**"按钮，进入参数配置界面

<img src="https://filecdn.minimax.chat/public/c25c37f6-7910-4b5c-a404-04926ef6d61a.png" width="60%" />

2. API Provider -> 选择"**MiniMax**"
3. MiniMax Entrypoint -> 根据您的地理位置选择（国内用户选择 `api.minimaxi.com`，国际用户选择 `api.minimax.io`）
4. MiniMax API Key 输入在 [MiniMax 开放平台](https://platform.minimaxi.com/user-center/basic-information/interface-key) (国际用户可访问 [MiniMax Developer Platform](https://platform.minimax.io/user-center/basic-information/interface-key)) 获取的 key
5. Model 选择 **MiniMax-M2**
6. 依次点击右上角的“Save”和"Done"按钮，保存配置

<img src="https://filecdn.minimax.chat/public/a398ac86-c000-4b0d-bf92-13487e2992de.png" width="60%" />

7. 开始使用“MiniMax-M2”

<img src="https://filecdn.minimax.chat/public/2f8b2574-bd73-4e02-a6ab-9698ac1decb7.png" width="60%" />

## 在 Kilo Code 中使用 MiniMax-M2

### 安装 Kilo Code

1. 打开 VS Code，点击左侧活动栏中的扩展图标，在搜索框中输入 `Kilo Code`

2. 点击 `Install` 按钮进行安装，安装完成后，可能需要重启 VS Code

<img src="https://filecdn.minimax.chat/public/f515a531-ff92-4797-ad96-a4afcada914e.jpg" width="80%" />

### 在 Kilo Code 中配置 MiniMax API

<Warning>
  **重要提示：使用前请先清除 Anthropic 环境变量**

  在配置前，请确保清除以下 Anthropic 相关的环境变量，以免影响 MiniMax API 的正常使用：

  * `ANTHROPIC_AUTH_TOKEN`
  * `ANTHROPIC_BASE_URL`
</Warning>

1. 点击"**Settings**"按钮，进入参数配置界面

<img src="https://filecdn.minimax.chat/public/827b88f5-8f56-441d-8c81-adb9be4eddc5.png" width="60%" />

2. API Provider -> 选择"**MiniMax**"
3. MiniMax Entrypoint -> 根据您的地理位置选择（国内用户选择 `api.minimaxi.com`，国际用户选择 `api.minimax.io`）
4. MiniMax API Key 输入在 [MiniMax 开放平台](https://platform.minimaxi.com/user-center/basic-information/interface-key) (国际用户可访问 [MiniMax Developer Platform](https://platform.minimax.io/user-center/basic-information/interface-key)) 获取的 key
5. Model 选择 **MiniMax-M2**
6. 依次点击右上角的“Save”和"Done"按钮，保存配置

<img src="https://filecdn.minimax.chat/public/cd94debc-17da-469e-b63f-53f0bcbc6f5b.jpg" width="80%" />

7. 开始使用"MiniMax-M2"

<img src="https://filecdn.minimax.chat/public/23da53cc-b7a1-4e65-95fb-0be6394d652e.jpg" width="60%" />

## 在 Droid 中使用 MiniMax-M2

### 安装 Droid

对于 Mac/Linux 用户，请使用以下指令安装：

```bash  theme={null}
curl -fsSL https://app.factory.ai/cli | sh
```

对于 Windows 用户，请使用以下指令安装：

```bash  theme={null}
irm https://app.factory.ai/cli/windows | iex
```

更多信息可参考 [Droid 文档](https://docs.factory.ai/cli/getting-started/quickstart) 。

### 在 Droid 中配置 MiniMax API

<Warning>
  **重要提示：使用前请先清除 Anthropic 环境变量**

  在配置前，请确保清除以下 Anthropic 相关的环境变量，以免影响 MiniMax API 的正常使用：

  * `ANTHROPIC_AUTH_TOKEN`
  * `ANTHROPIC_BASE_URL`
</Warning>

1. 使用以下指令，更新 Droid 配置文件，该配置文件的路径为 `~/.factory/config.json`。

* `base_url` 需根据地理位置设置：国内用户使用 `https://api.minimaxi.com/anthropic`，国际用户使用 `https://api.minimax.io/anthropic`
* `<MINIMAX_API_KEY>` 需替换为从 [MiniMax 开发者平台](https://platform.minimaxi.com/user-center/basic-information/interface-key) (国际用户可访问 [MiniMax Developer Platform](https://platform.minimax.io/user-center/basic-information/interface-key)) 获取的 API Key

<Note>
  提示:

  * 配置文件的路径为 `~/.factory/config.json`, 并非 `~/.factory/settings.json`
  * 清空 `ANTHROPIC_AUTH_TOKEN` 环境变量，否则会覆盖 `.factory/config.json` 中的 API Key 并导致错误
</Note>

```json  theme={null}
{
    "custom_models": [
        {
            "model_display_name": "MiniMax-M2",
            "model": "MiniMax-M2",
            "base_url": "https://api.minimaxi.com/anthropic",
            "api_key": "<MINIMAX_API_KEY>",
            "provider": "anthropic",
            "max_tokens": 16384
        }
    ]
}
```

2. 进入项目目录，启动 `Droid`

```bash  theme={null}
cd /path/to/your/project
droid
```

3. 输入 `/model`, 选择 “**MiniMax-M2**” 模型，并在 Droid 中使用

<img src="https://filecdn.minimax.chat/public/200b5ce4-5e13-4490-b75e-b10431412ac0.jpeg" width="60%" />

## 在 OpenCode 中使用 MiniMax-M2

### 安装 OpenCode

* 使用 `curl` 安装 OpenCode

```bash  theme={null}
curl -fsSL https://opencode.ai/install | bash
```

* 使用 `npm` 安装 OpenCode

```bash  theme={null}
npm i -g opencode-ai
```

更多信息请参考 [OpenCode 官网](https://opencode.ai/)

### 配置 MiniMax API

<Warning>
  **重要提示:使用前请先清除 Anthropic 环境变量**

  在配置前，请确保清除以下 Anthropic 相关的环境变量，以免影响 MiniMax API 的正常使用：

  * `ANTHROPIC_AUTH_TOKEN`
  * `ANTHROPIC_BASE_URL`
</Warning>

1. 编辑 OpenCode 的配置文件，路径为 `~/.config/opencode/opencode.json`，将以下配置添加到配置文件中。

* `baseURL` 需根据地理位置设置：国内用户使用 `https://api.minimaxi.com/anthropic/v1`，国际用户使用 `https://api.minimax.io/anthropic/v1`
* `<MINIMAX_API_KEY>` 需设置为从 [MiniMax 开发者平台](https://platform.minimaxi.com/user-center/basic-information/interface-key) (国际用户可访问 [MiniMax Developer Platform](https://platform.minimax.io/user-center/basic-information/interface-key)) 获取的 API Key（可选）

```json  theme={null}
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "minimax": {
      "npm": "@ai-sdk/anthropic",
      "options": {
        "baseURL": "https://api.minimaxi.com/anthropic/v1",
        "apiKey": "<MINIMAX_API_KEY> (可选)"
      },
      "models": {
        "MiniMax-M2": {
          "name": "MiniMax-M2"
        }
      }
    }
  }
}
```

**其他认证方式：**

如果你不想在配置文件中直接添加 API 密钥，可以使用交互式登录命令进行认证。按照以下步骤操作：

i. 运行认证命令：

```bash  theme={null}
opencode auth login
```

ii. 当提示选择 provider 时，选择 **"Other"**：

<img src="https://filecdn.minimax.chat/public/f616dac4-2ec4-4fc0-aabb-9776d5ec9043.png" width="60%" />

iii. 输入 provider ID **"minimax"**：

<img src="https://filecdn.minimax.chat/public/4a7d2327-651d-450a-b041-dd17e5ac78ec.png" width="60%" />

iv. 当提示输入 API 密钥时，输入你的 **MiniMax API Key**：

<img src="https://filecdn.minimax.chat/public/74a8214a-8f4a-4019-b335-c9a9717db8da.png" width="80%" />

2. 进入项目目录，启动 `opencode`

```bash  theme={null}
cd /path/to/your/project

opencode
```

3. 输入 `/models`，选择 "**MiniMax-M2**" 模型并在 OpenCode 中使用它

<img src="https://filecdn.minimax.chat/public/9480a75a-cbbf-441e-9740-d55301b9e700.png" width="80%" />

## 在 Codex CLI 中使用 MiniMax-M2（不推荐）

为了方便将模型与 Codex CLI 集成，建议使用 **codex-MiniMax-M2** 模型名称。虽然模型可以通过 Bash 等工具与文件进行交互，但这种方式并非 Agent 工作流的最佳实践。为实现 Agent 开发实践的最佳效果，建议使用 **Claude Code** 或 **Cursor** 工具。

### 安装 Codex CLI

1. 使用 `npm` 全局安装 Codex CLI

```bash  theme={null}
npm i -g @openai/codex
```

### 在 Codex CLI 中配置 MiniMax API

<Warning>
  **重要提示：使用前请先清除 OpenAI 环境变量**

  在配置前，请确保清除以下 OpenAI 相关的环境变量，以免影响 MiniMax API 的正常使用：

  * `OPENAI_API_KEY`
  * `OPENAI_BASE_URL`
</Warning>

1. 编辑 Codex 的配置文件，路径为 `.codex/config.toml`，将以下配置添加到配置文件中。

* `base_url` 需根据地理位置设置：国内用户使用 `https://api.minimaxi.com/v1`，国际用户使用 `https://api.minimax.io/v1`

```toml  theme={null}
[model_providers.minimax]
name = "MiniMax Chat Completions API"
base_url = "https://api.minimaxi.com/v1"
env_key = "MINIMAX_API_KEY"
wire_api = "chat"
requires_openai_auth = false
request_max_retries = 4
stream_max_retries = 10
stream_idle_timeout_ms = 300000

[profiles.m2]
model = "codex-MiniMax-M2"
model_provider = "minimax"
```

2. 出于安全考虑，请在当前终端会话中通过环境变量设置 API Key，其中，需要将 `MINIMAX_API_KEY` 替换为从 [MiniMax 开发者平台](https://platform.minimaxi.com/user-center/basic-information/interface-key) (国际用户可访问 [MiniMax Developer Platform](https://platform.minimax.io/user-center/basic-information/interface-key)) 获取的 API Key

```
export MINIMAX_API_KEY="<MINIMAX_API_KEY>"
```

3. 使用指定的配置文件启动 Codex CLI。

```bash  theme={null}
codex --profile m2
```

## 在 Grok CLI 中使用 MiniMax-M2（不推荐）

### 安装 Grok CLI

1. 使用 `npm` 全局安装 Grok CLI

```bash  theme={null}
npm install -g @vibe-kit/grok-cli
```

### 在 Grok CLI 中配置 MiniMax API

<Warning>
  **重要提示：使用前请先清除 OpenAI 环境变量**

  在配置前，请确保清除以下 OpenAI 相关的环境变量，以免影响 MiniMax API 的正常使用：

  * `OPENAI_API_KEY`
  * `OPENAI_BASE_URL`
</Warning>

1. 通过环境变量配置 URL 和 API Key

* `GROK_BASE_URL` 需根据地理位置设置：国内用户使用 `https://api.minimaxi.com/v1`，国际用户使用 `https://api.minimax.io/v1`
* `<MINIMAX_API_KEY>` 需替换为从 [MiniMax 开发者平台](https://platform.minimaxi.com/user-center/basic-information/interface-key) (国际用户可访问 [MiniMax Developer Platform](https://platform.minimax.io/user-center/basic-information/interface-key)) 获取的 API Key

```bash  theme={null}
export GROK_BASE_URL="https://api.minimaxi.com/v1"
export GROK_API_KEY="<MINIMAX_API_KEY>"
```

2. 使用指定模型"**MiniMax-M2**"启动 Grok CLI

```bash  theme={null}
grok --model MiniMax-M2
```

## 常见问题

### API Error

```bash  theme={null}
API Error: Cannot read properties of undefined (reading 'map')
```

请按以下步骤检查：

1. 确保已正确设置 API Host，根据您的地理位置选择：国内用户使用 `https://api.minimaxi.com`，国际用户使用 `https://api.minimax.io`
2. 确认已将 `<MINIMAX_API_KEY>` 替换为你在 [MiniMax 开发者平台](https://platform.minimaxi.com/user-center/basic-information/interface-key) (国际用户可访问 [MiniMax Developer Platform](https://platform.minimax.io/user-center/basic-information/interface-key)) 获取的真实 API Key。
3. 如果使用 Claude Code 或 Droid，请清除环境变量：`ANTHROPIC_AUTH_TOKEN`
4. 如果在 VSCode 或 Cursor 中使用 Claude Code，请确保配置模型为 `MiniMax-M2`，详见[在 Claude Code for VS Code 中使用 M2](/guides/text-ai-coding-tools#%E5%9C%A8-claude-code-for-vs-code-%E4%B8%AD%E4%BD%BF%E7%94%A8)
5. 触发[速率限制](/guides/rate-limits#3%E3%80%81%E6%88%91%E4%BB%AC%E7%9A%84-api-%E7%9A%84%E9%99%90%E9%80%9F%E5%85%B7%E4%BD%93%E6%95%B0%E5%80%BC)，请稍后再试。

如果以上方法仍未解决问题，请联系我们：

* 通过邮箱 [Model@minimaxi.com](mailto:Model@minimaxi.com) 等官方渠道联系我们的技术支持团队
* 在我们的 [Github](https://github.com/MiniMax-AI/MiniMax-M2/issues) 仓库提交Issue

## 推荐阅读

<Columns cols={2}>
  <Card title="M2 工具使用 & Interleaved Thinking" icon="book-open" href="/guides/text-m2-function-call" cta="点击查看">
    工具使用让 AI 模型调用外部 API。
  </Card>

  <Card title="文本生成指南" icon="book-open" href="/guides/text-generation" cta="点击查看">
    支持通过 Anthropic 和 OpenAI 兼容接口进行文本生成调用
  </Card>

  <Card title="Anthropic API 兼容（推荐）" icon="book-open" href="/api-reference/text-anthropic-api" cta="点击查看">
    通过 Anthropic SDK 调用 MiniMax 模型
  </Card>

  <Card title="OpenAI API 兼容" icon="book-open" href="/api-reference/text-openai-api" cta="点击查看">
    通过 OpenAI SDK 调用 MiniMax 模型
  </Card>
</Columns>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://platform.minimaxi.com/docs/llms.txt