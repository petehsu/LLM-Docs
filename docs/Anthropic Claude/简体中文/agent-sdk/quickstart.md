# 快速开始

使用 Python 或 TypeScript Agent SDK 开始构建能够自主工作的 AI 代理

---

使用 Agent SDK 构建一个 AI 代理，它可以读取你的代码、找到错误并修复它们，所有这一切都无需手动干预。

**你将做什么：**
1. 使用 Agent SDK 设置一个项目
2. 创建一个包含一些有缺陷代码的文件
3. 运行一个代理，自动查找并修复错误

## 前置条件

- **Node.js 18+** 或 **Python 3.10+**
- 一个 **Anthropic 账户**（[在此注册](https://console.anthropic.com/)）

## 设置

<Steps>
  <Step title="安装 Claude Code">
    Agent SDK 使用 Claude Code 作为其运行时。为你的平台安装它：

    <Tabs>
      <Tab title="macOS/Linux/WSL">
        ```bash
        curl -fsSL https://claude.ai/install.sh | bash
        ```
      </Tab>
      <Tab title="Homebrew">
        ```bash
        brew install --cask claude-code
        ```
      </Tab>
      <Tab title="npm">
        ```bash
        npm install -g @anthropic-ai/claude-code
        ```
      </Tab>
    </Tabs>

    在你的机器上安装 Claude Code 后，在终端中运行 `claude` 并按照提示进行身份验证。SDK 将自动使用此身份验证。

    <Tip>
    有关 Claude Code 安装的更多信息，请参阅 [Claude Code 设置](https://docs.anthropic.com/zh-CN/docs/claude-code/setup)。
    </Tip>
  </Step>

  <Step title="创建项目文件夹">
    为此快速开始创建一个新目录：

    ```bash
    mkdir my-agent && cd my-agent
    ```

    对于你自己的项目，你可以从任何文件夹运行 SDK；默认情况下，它将有权访问该目录及其子目录中的文件。
  </Step>

  <Step title="安装 SDK">
    为你的语言安装 Agent SDK 包：

    <Tabs>
      <Tab title="TypeScript">
        ```bash
        npm install @anthropic-ai/claude-agent-sdk
        ```
      </Tab>
      <Tab title="Python (uv)">
        [uv](https://docs.astral.sh/uv/) 是一个快速的 Python 包管理器，可以自动处理虚拟环境：
        ```bash
        uv init && uv add claude-agent-sdk
        ```
      </Tab>
      <Tab title="Python (pip)">
        首先创建一个虚拟环境，然后安装：
        ```bash
        python3 -m venv .venv && source .venv/bin/activate
        pip3 install claude-agent-sdk
        ```
      </Tab>
    </Tabs>
  </Step>

  <Step title="设置你的 API 密钥">
    如果你已经对 Claude Code 进行了身份验证（通过在终端中运行 `claude`），SDK 将自动使用该身份验证。

    否则，你需要一个 API 密钥，你可以从 [Anthropic 控制台](https://console.anthropic.com/) 获取。

    在你的项目目录中创建一个 `.env` 文件并在其中存储 API 密钥：

    ```bash
    ANTHROPIC_API_KEY=your-api-key
    ```

    <Note>
    **使用 Amazon Bedrock、Google Vertex AI 或 Microsoft Azure？** 请参阅 [Bedrock](https://code.claude.com/docs/zh-CN/amazon-bedrock)、[Vertex AI](https://code.claude.com/docs/zh-CN/google-vertex-ai) 或 [Azure AI Foundry](https://code.claude.com/docs/zh-CN/azure-ai-foundry) 的设置指南。

    除非事先获得批准，否则我们不允许第三方开发者为其产品（包括基于 Claude Agent SDK 构建的代理）提供 Claude.ai 登录或速率限制。请改用本文档中描述的 API 密钥身份验证方法。
    </Note>
  </Step>
</Steps>

## 创建一个有缺陷的文件

此快速开始将引导你构建一个可以查找并修复代码中错误的代理。首先，你需要一个包含一些有意错误的文件供代理修复。在 `my-agent` 目录中创建 `utils.py` 并粘贴以下代码：

```python
def calculate_average(numbers):
    total = 0
    for num in numbers:
        total += num
    return total / len(numbers)

def get_user_name(user):
    return user["name"].upper()
```

此代码有两个错误：
1. `calculate_average([])` 因除以零而崩溃
2. `get_user_name(None)` 因 TypeError 而崩溃

## 构建一个查找并修复错误的代理

如果你使用 Python SDK，请创建 `agent.py`，或者如果使用 TypeScript，请创建 `agent.ts`：

<CodeGroup>
```python Python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions, AssistantMessage, ResultMessage

async def main():
    # Agentic loop: streams messages as Claude works
    async for message in query(
        prompt="Review utils.py for bugs that would cause crashes. Fix any issues you find.",
        options=ClaudeAgentOptions(
            allowed_tools=["Read", "Edit", "Glob"],  # Tools Claude can use
            permission_mode="acceptEdits"            # Auto-approve file edits
        )
    ):
        # Print human-readable output
        if isinstance(message, AssistantMessage):
            for block in message.content:
                if hasattr(block, "text"):
                    print(block.text)              # Claude's reasoning
                elif hasattr(block, "name"):
                    print(f"Tool: {block.name}")   # Tool being called
        elif isinstance(message, ResultMessage):
            print(f"Done: {message.subtype}")      # Final result

asyncio.run(main())
```

```typescript TypeScript
import { query } from "@anthropic-ai/claude-agent-sdk";

// Agentic loop: streams messages as Claude works
for await (const message of query({
  prompt: "Review utils.py for bugs that would cause crashes. Fix any issues you find.",
  options: {
    allowedTools: ["Read", "Edit", "Glob"],  // Tools Claude can use
    permissionMode: "acceptEdits"            // Auto-approve file edits
  }
})) {
  // Print human-readable output
  if (message.type === "assistant" && message.message?.content) {
    for (const block of message.message.content) {
      if ("text" in block) {
        console.log(block.text);             // Claude's reasoning
      } else if ("name" in block) {
        console.log(`Tool: ${block.name}`);  // Tool being called
      }
    }
  } else if (message.type === "result") {
    console.log(`Done: ${message.subtype}`); // Final result
  }
}
```
</CodeGroup>

此代码有三个主要部分：

1. **`query`**：创建代理循环的主入口点。它返回一个异步迭代器，所以你使用 `async for` 来流式传输 Claude 工作时的消息。请参阅 [Python](/docs/zh-CN/agent-sdk/python#query) 或 [TypeScript](/docs/zh-CN/agent-sdk/typescript#query) SDK 参考中的完整 API。

2. **`prompt`**：你想让 Claude 做什么。Claude 根据任务确定要使用哪些工具。

3. **`options`**：代理的配置。此示例使用 `allowedTools` 将 Claude 限制为 `Read`、`Edit` 和 `Glob`，并使用 `permissionMode: "acceptEdits"` 自动批准文件更改。其他选项包括 `systemPrompt`、`mcpServers` 等。请参阅 [Python](/docs/zh-CN/agent-sdk/python#claudeagentoptions) 或 [TypeScript](/docs/zh-CN/agent-sdk/typescript#claudeagentoptions) 的所有选项。

`async for` 循环在 Claude 思考、调用工具、观察结果并决定下一步做什么时继续运行。每次迭代都会产生一条消息：Claude 的推理、工具调用、工具结果或最终结果。SDK 处理编排（工具执行、上下文管理、重试），所以你只需使用流。当 Claude 完成任务或遇到错误时，循环结束。

循环内的消息处理过滤人类可读的输出。如果不进行过滤，你会看到原始消息对象，包括系统初始化和内部状态，这对调试很有用，但通常很冗长。

<Note>
此示例使用流式传输来实时显示进度。如果你不需要实时输出（例如，对于后台作业或 CI 管道），你可以一次性收集所有消息。有关详细信息，请参阅 [流式传输与单轮模式](/docs/zh-CN/agent-sdk/streaming-vs-single-mode)。
</Note>

### 运行你的代理

你的代理已准备好。使用以下命令运行它：

<CodeGroup>
```bash Python
python3 agent.py
```

```bash TypeScript
npx tsx agent.ts
```
</CodeGroup>

运行后，检查 `utils.py`。你会看到处理空列表和空用户的防御性代码。你的代理自主地：

1. **读取** `utils.py` 以理解代码
2. **分析** 逻辑并识别会导致崩溃的边界情况
3. **编辑** 文件以添加适当的错误处理

这就是 Agent SDK 的与众不同之处：Claude 直接执行工具，而不是要求你实现它们。

<Note>
如果你看到"Claude Code not found"，请 [安装 Claude Code](#install-claude-code) 并重启你的终端。对于"API key not found"，请 [设置你的 API 密钥](#set-your-api-key)。有关更多帮助，请参阅 [完整故障排除指南](https://docs.anthropic.com/zh-CN/docs/claude-code/troubleshooting)。
</Note>

### 尝试其他提示

现在你的代理已设置好，尝试一些不同的提示：

- `"Add docstrings to all functions in utils.py"`
- `"Add type hints to all functions in utils.py"`
- `"Create a README.md documenting the functions in utils.py"`

### 自定义你的代理

你可以通过更改选项来修改代理的行为。以下是一些示例：

**添加网络搜索功能：**

<CodeGroup>
```python Python
options=ClaudeAgentOptions(
    allowed_tools=["Read", "Edit", "Glob", "WebSearch"],
    permission_mode="acceptEdits"
)
```

```typescript TypeScript
options: {
  allowedTools: ["Read", "Edit", "Glob", "WebSearch"],
  permissionMode: "acceptEdits"
}
```
</CodeGroup>

**给 Claude 一个自定义系统提示：**

<CodeGroup>
```python Python
options=ClaudeAgentOptions(
    allowed_tools=["Read", "Edit", "Glob"],
    permission_mode="acceptEdits",
    system_prompt="You are a senior Python developer. Always follow PEP 8 style guidelines."
)
```

```typescript TypeScript
options: {
  allowedTools: ["Read", "Edit", "Glob"],
  permissionMode: "acceptEdits",
  systemPrompt: "You are a senior Python developer. Always follow PEP 8 style guidelines."
}
```
</CodeGroup>

**在终端中运行命令：**

<CodeGroup>
```python Python
options=ClaudeAgentOptions(
    allowed_tools=["Read", "Edit", "Glob", "Bash"],
    permission_mode="acceptEdits"
)
```

```typescript TypeScript
options: {
  allowedTools: ["Read", "Edit", "Glob", "Bash"],
  permissionMode: "acceptEdits"
}
```
</CodeGroup>

启用 `Bash` 后，尝试：`"Write unit tests for utils.py, run them, and fix any failures"`

## 关键概念

**工具** 控制你的代理可以做什么：

| 工具 | 代理可以做什么 |
|-------|----------------------|
| `Read`、`Glob`、`Grep` | 只读分析 |
| `Read`、`Edit`、`Glob` | 分析和修改代码 |
| `Read`、`Edit`、`Bash`、`Glob`、`Grep` | 完全自动化 |

**权限模式** 控制你想要多少人工监督：

| 模式 | 行为 | 用例 |
|------|----------|----------|
| `acceptEdits` | 自动批准文件编辑，询问其他操作 | 受信任的开发工作流 |
| `bypassPermissions` | 无提示运行 | CI/CD 管道、自动化 |
| `default` | 需要 `canUseTool` 回调来处理批准 | 自定义批准流程 |

上面的示例使用 `acceptEdits` 模式，它自动批准文件操作，以便代理可以无需交互提示地运行。如果你想提示用户批准，请使用 `default` 模式并提供一个 [`canUseTool` 回调](/docs/zh-CN/agent-sdk/permissions#canusetool) 来收集用户输入。有关更多控制，请参阅 [权限](/docs/zh-CN/agent-sdk/permissions)。

## 后续步骤

现在你已经创建了你的第一个代理，学习如何扩展其功能并将其定制为你的用例：

- **[权限](/docs/zh-CN/agent-sdk/permissions)**：控制你的代理可以做什么以及何时需要批准
- **[钩子](/docs/zh-CN/agent-sdk/hooks)**：在工具调用之前或之后运行自定义代码
- **[会话](/docs/zh-CN/agent-sdk/sessions)**：构建维护上下文的多轮代理
- **[MCP 服务器](/docs/zh-CN/agent-sdk/mcp)**：连接到数据库、浏览器、API 和其他外部系统
- **[托管](/docs/zh-CN/agent-sdk/hosting)**：将代理部署到 Docker、云和 CI/CD
- **[示例代理](https://github.com/anthropics/claude-agent-sdk-demos)**：查看完整示例：电子邮件助手、研究代理等