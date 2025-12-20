# 接入 Claude Code

> 将智谱最新 GLM-4.6 系列模型集成到 Claude Code 的方法

智谱模型 GLM-4.6 可以通过一个兼容 Anthropic API 的端点与 Claude Code 集成。这意味着可以让 Claude Code 与 GLM-4.6 通信，而不需要修改 Claude Code 的任何代码。

<Tip>
  Claude Code 玩转新体验：20 元起解锁 GLM Coding 包月，3倍用量，1/7价格，独家升级支持联网搜索&多模态理解，响应更快，调用更稳。限时羊毛价，[立即订阅](https://bigmodel.cn/claude-code?utm_source=bigmodel\&utm_medium=link\&utm_term=cc\&utm_campaign=Platform_Ops&_channel_track_key=i8kwCaos)！

  套餐专属 [视觉理解 MCP Server](/cn/coding-plan/mcp/vision-mcp-server) 、 [网络搜索 MCP Server](/cn/coding-plan/mcp/search-mcp-server) 、 [网页读取 MCP Server](/cn/coding-plan/mcp/reader-mcp-server) 让您的 Code Agent 拥有搜索与视觉。
</Tip>

<Warning>
  在 2025-09-30 日期前已使用的用户请注意：\
  GLM Coding Plan 的默认模型已升级至 GLM-4.6，使用最新配置方式的用户无感知升级。\
  但若您之前在 `settings.json` 中配置过 GLM-4.5 的固定模型映射，请参考下方「常见问题」章节中的「如何切换使用模型」进行调整，以确保使用最新的 GLM-4.6 模型。
</Warning>

## 步骤一：安装 Claude Code

<Tabs>
  <Tab title="推荐安装方式">
    前提条件：

    * 您需要安装 [Node.js 18 或更新版本环境](https://nodejs.org/en/download/)
    * Windows 用户还需安装 [Git for Windows](https://git-scm.com/download/win)

    进入命令行界面，安装 Claude Code

    ```
    npm install -g @anthropic-ai/claude-code
    ```

    运行如下命令，查看安装结果，若显示版本号则表示安装成功

    ```
    claude --version
    ```
  </Tab>

  <Tab title="Cursor 引导安装方式">
    若您不熟悉 nodejs 且有 Cursor，您可以在 Cursor 中输入命令，Cursor 会引导你完成 Claude Code 的安装。

    ```bash  theme={null}
    https://docs.anthropic.com/zh-CN/docs/claude-code/overview Help me install Claude Code
    ```
  </Tab>
</Tabs>

<Note>
  **注意**：如果您在安装过程中遇到权限问题，请尝试使用 `sudo`（MacOS/Linux）或以管理员身份运行命令提示符（Windows）重新执行安装命令。\
  安装成功后，还需后续步骤，若您直接使用 `claude` 命令启动，可能由于网络或地区限制无法使用。
</Note>

## 步骤二：配置 GLM Coding Plan

<Steps>
  <Step title="注册账号">
    访问 [智谱开放平台](https://open.bigmodel.cn)，点击右上角的「注册/登录」按钮，按照提示完成账号注册流程。
  </Step>

  <Step title="获取API Key">
    登录后，在个人中心页面，点击 [API Keys](https://bigmodel.cn/usercenter/proj-mgmt/apikeys)，创建一个新的 API Key。

    <Warning>
      请妥善保管您的 API Key，不要泄露给他人，也不要直接硬编码在代码中。
    </Warning>
  </Step>

  <Step title="配置环境变量">
    通过在 **MacOS、Linux** 或 **Windows** 中使用以下**一种方式**设置环境变量：

    <Tip>
      **注意**：设置环境变量时，有些命令不会返回任何输出。这是正常的，只要没有报错即代表成功。\
      **注意**：选择以下适合您操作系统的一种方式进行配置即可。
    </Tip>

    <Tabs>
      <Tab title="方式一：自动化脚本（支持 MacOS Linux）">
        在终端或 IDE 中运行以下命令即可

        ```bash  theme={null}
        curl -O "https://cdn.bigmodel.cn/install/claude_code_env.sh" && bash ./claude_code_env.sh
        ```

        脚本会自动通过修改 `~/.claude/settings.json` 来配置如下环境变量(您无需手动修改)：

        ```json  theme={null}
        {
            "env": {
                "ANTHROPIC_AUTH_TOKEN": "your_zhipu_api_key",
                "ANTHROPIC_BASE_URL": "https://open.bigmodel.cn/api/anthropic",
                "API_TIMEOUT_MS": "3000000",
                "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": 1
            }
        }
        ```
      </Tab>

      <Tab title="方式二：手动配置（支持 Windows MacOS Linux）">
        根据您的环境选择下面一种方式即可，配置后需新建命令行窗口生效

        <CodeGroup>
          ```bash MacOS & Linux theme={null}
          # 编辑或新增 Claude Code 配置文件 `~/.claude/settings.json`
          # 新增或修改里面的 env 字段
          # 注意替换里面的 `your_zhipu_api_key` 为您上一步获取到的 API Key
          {
              "env": {
                  "ANTHROPIC_AUTH_TOKEN": "your_zhipu_api_key",
                  "ANTHROPIC_BASE_URL": "https://open.bigmodel.cn/api/anthropic",
                  "API_TIMEOUT_MS": "3000000",
                  "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": 1
              }
          }
          ```

          ```cmd Windows Cmd theme={null}
          # 在 Cmd 中运行以下命令
          # 注意替换里面的 `your_zhipu_api_key` 为您上一步获取到的 API Key
          setx ANTHROPIC_AUTH_TOKEN your_zhipu_api_key
          setx ANTHROPIC_BASE_URL https://open.bigmodel.cn/api/anthropic
          setx CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC 1
          ```

          ```powershell Windows PowerShell theme={null}
          # 在 PowerShell 中运行以下命令
          # 注意替换里面的 `your_zhipu_api_key` 为您上一步获取到的 API Key
          [System.Environment]::SetEnvironmentVariable('ANTHROPIC_AUTH_TOKEN', 'your_zhipu_api_key', 'User')
          [System.Environment]::SetEnvironmentVariable('ANTHROPIC_BASE_URL', 'https://open.bigmodel.cn/api/anthropic', 'User')
          [System.Environment]::SetEnvironmentVariable('CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC', '1', 'User')
          ```
        </CodeGroup>
      </Tab>
    </Tabs>
  </Step>
</Steps>

<Note>
  配置成功后，请确保重新打开一个新的终端窗口，以便环境配置生效。
</Note>

## 步骤三：开始使用 Claude Code

配置完成后，进入一个您的代码工作目录，在终端中执行 `claude` 命令即可开始使用 **Claude Code**

> 若遇到「Do you want to use this API key」选择 Yes 即可

启动后选择信任 Claude Code 访问文件夹里的文件，如下：

![Description](https://cdn.bigmodel.cn/markdown/1753631613096claude-2.png?attname=claude-2.png)

完毕！现在就可以正常使用 Claude Code 进行开发了。

> 对话/规划/代码编写/复杂推理等主场景时默认使用模型均为 GLM-4.6，Claude code 会在部分轻量任务时自动路由到 GLM-4.5-Air，这也是我们推荐的使用方式，兼顾性能、速度与价格，暂不支持其它模型（如 GLM-4.5-X/AirX/Flash 等）。

以下为简单示例：

**Case 1：根据提示信息创建网页**

![Description](https://cdn.bigmodel.cn/static/platform/images/usage-guide/scenario-examples/claude-code-case1-1.jpg)

![Description](https://cdn.bigmodel.cn/static/platform/images/usage-guide/scenario-examples/claude-code-case1-2.jpg)

* 生成文件：[megatron\_lm\_detailed\_architecture\_analysis.html](https://cdn.bigmodel.cn/static/platform/images/usage-guide/scenario-examples/megatron_lm_detailed_architecture_analysis.html)

**Case 2：生成一个打地鼠游戏**

![Description](https://cdn.bigmodel.cn/markdown/1753631619635claude-3.png?attname=claude-3.png)

![Description](https://cdn.bigmodel.cn/markdown/1753631624521claude-4.png?attname=claude-4.png)

![Description](https://cdn.bigmodel.cn/markdown/1753631630147claude-5.png?attname=claude-5.png)

**Case 3：生成一个日蚀动效**

Prompt：帮我生成日蚀过程的动态特效，尽量采用苹果手机的风格

![Description](https://cdn.bigmodel.cn/markdown/1753631640389claude-6.png?attname=claude-6.png)

![Description](https://cdn.bigmodel.cn/markdown/1753631646074claude-7.png?attname=claude-7.png)

***

## 常见问题

### 如何切换使用模型

<Check>
  Claude Code 内部模型环境变量与 GLM 模型对应关系，默认配置如下：

  * `ANTHROPIC_DEFAULT_OPUS_MODEL`：`GLM-4.6`
  * `ANTHROPIC_DEFAULT_SONNET_MODEL`：`GLM-4.6`
  * `ANTHROPIC_DEFAULT_HAIKU_MODEL`：`GLM-4.5-Air`
</Check>

如有调整诉求，可直接通过调整配置文件的方式（位于 `~/.claude/settings.json`）来调整到其他模型

<Note>
  一般不建议您手动调整模型映射，因为硬编码模型映射后，当 GLM Coding Plan 的模型更新升级时，不方便您自动更新到最新模型。
</Note>

<Note>
  若您想使用最新默认映射（针对老用户已配置旧模型映射的情况），删除 `settings.json` 中的模型映射配置即可，Claude Code 会自动使用最新的默认模型。
</Note>

1. 手动修改配置文件 `~/.claude/settings.json`，添加或替换如下环境变量参数：

```json  theme={null}
{
  "env": {
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "glm-4.5-air",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "glm-4.6",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "glm-4.6"
  }
}
```

2. 启动一个新的命令行窗口，运行`claude`启动 Claude Code，在 Claude Code 中输入`/status`确认模型状态：

![Description](https://cdn.bigmodel.cn/markdown/1759228558734cline-2.png?attname=cline-2.png)

### 视觉和搜索 MCP 服务器

参考 [视觉MCP服务器](/cn/coding-plan/mcp/vision-mcp-server) 和 [搜索MCP服务器](/cn/coding-plan/mcp/search-mcp-server) 文档，配置完成后即可在 Claude Code 中使用。

### 手工修改配置不生效

若您手动修改了 `~/.claude/settings.json` 配置文件，但发现配置没有生效，参考如下排查。

* 关闭所有 Claude Code 窗口，重新打开一个新的命令行窗口，再次运行 `claude` 启动。
* 如果问题仍然存在，您可以尝试删除 `~/.claude/settings.json` 文件，然后重新配置环境变量，Claude Code 会自动生成一个新的配置文件。
* 确认配置文件的 JSON 格式是否正确，检查变量名称和不能少逗号或多逗号，可以使用在线 JSON 校验工具进行检查。

### 推荐的 Claude Code 版本

建议使用最新版本的 Claude Code，您可以通过以下命令检查当前版本和升级：

> 我们在 Claude Code 2.0.14 等版本验证 OK。

```bash  theme={null}
# 检查当前版本
claude --version

2.0.14 (Claude Code)

# 升级到最新版本
claude update
```


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.bigmodel.cn/llms.txt