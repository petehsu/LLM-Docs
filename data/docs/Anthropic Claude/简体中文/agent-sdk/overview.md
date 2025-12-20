# Agent SDK 概览

使用 Claude Code 作为库构建生产级 AI 代理

---

<Note>
Claude Code SDK 已重命名为 Claude Agent SDK。如果您正在从旧 SDK 迁移，请参阅[迁移指南](/docs/zh-CN/agent-sdk/migration-guide)。
</Note>

构建能够自主读取文件、运行命令、搜索网络、编辑代码等的 AI 代理。Agent SDK 为您提供了与 Claude Code 相同的工具、代理循环和上下文管理，可在 Python 和 TypeScript 中编程。

<CodeGroup>
```python Python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions

async def main():
    async for message in query(
        prompt="Find and fix the bug in auth.py",
        options=ClaudeAgentOptions(allowed_tools=["Read", "Edit", "Bash"])
    ):
        print(message)  # Claude reads the file, finds the bug, edits it

asyncio.run(main())
```

```typescript TypeScript
import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "Find and fix the bug in auth.py",
  options: { allowedTools: ["Read", "Edit", "Bash"] }
})) {
  console.log(message);  // Claude reads the file, finds the bug, edits it
}
```
</CodeGroup>

Agent SDK 包含用于读取文件、运行命令和编辑代码的内置工具，因此您的代理可以立即开始工作，无需您实现工具执行。深入了解快速入门或探索使用 SDK 构建的真实代理：

<CardGroup cols={2}>
  <Card title="快速入门" icon="play" href="/docs/zh-CN/agent-sdk/quickstart">
    在几分钟内构建一个 bug 修复代理
  </Card>
  <Card title="示例代理" icon="star" href="https://github.com/anthropics/claude-agent-sdk-demos">
    电子邮件助手、研究代理等
  </Card>
</CardGroup>

## 功能

Claude Code 强大的一切功能都可在 SDK 中使用：

<Tabs>
  <Tab title="内置工具">
    您的代理可以开箱即用地读取文件、运行命令和搜索代码库。关键工具包括：

    | 工具 | 功能 |
    |------|------|
    | **Read** | 读取工作目录中的任何文件 |
    | **Write** | 创建新文件 |
    | **Edit** | 对现有文件进行精确编辑 |
    | **Bash** | 运行终端命令、脚本、git 操作 |
    | **Glob** | 按模式查找文件（`**/*.ts`、`src/**/*.py`） |
    | **Grep** | 使用正则表达式搜索文件内容 |
    | **WebSearch** | 搜索网络获取最新信息 |
    | **WebFetch** | 获取并解析网页内容 |

    此示例创建一个搜索代码库中所有 TODO 注释的代理：

    <CodeGroup>
    ```python Python
    import asyncio
    from claude_agent_sdk import query, ClaudeAgentOptions

    async def main():
        async for message in query(
            prompt="Find all TODO comments and create a summary",
            options=ClaudeAgentOptions(allowed_tools=["Read", "Glob", "Grep"])
        ):
            print(message)

    asyncio.run(main())
    ```

    ```typescript TypeScript
    import { query } from "@anthropic-ai/claude-agent-sdk";

    for await (const message of query({
      prompt: "Find all TODO comments and create a summary",
      options: { allowedTools: ["Read", "Glob", "Grep"] }
    })) {
      console.log(message);
    }
    ```
    </CodeGroup>

  </Tab>
  <Tab title="钩子">
    在代理生命周期的关键点运行自定义代码。钩子可以执行 shell 命令或自定义脚本来验证、记录、阻止或转换代理行为。

    **可用钩子：** `PreToolUse`、`PostToolUse`、`Stop`、`SessionStart`、`SessionEnd`、`UserPromptSubmit` 等。

    此示例将所有文件更改记录到审计文件：

    <CodeGroup>
    ```python Python
    import asyncio
    from claude_agent_sdk import query, ClaudeAgentOptions

    async def main():
        async for message in query(
            prompt="Suggest improvements to utils.py",
            options=ClaudeAgentOptions(
                permission_mode="acceptEdits",
                hooks={
                    "PostToolUse": [{
                        "matcher": "Edit|Write",
                        "hooks": [{"type": "command", "command": "echo \"$(date): file modified\" >> ./audit.log"}]
                    }]
                }
            )
        ):
            print(message)

    asyncio.run(main())
    ```

    ```typescript TypeScript
    import { query } from "@anthropic-ai/claude-agent-sdk";

    for await (const message of query({
      prompt: "Suggest improvements to utils.py",
      options: {
        permissionMode: "acceptEdits",
        hooks: {
          PostToolUse: [{
            matcher: "Edit|Write",
            hooks: [{ type: "command", command: "echo \"$(date): file modified\" >> ./audit.log" }]
          }]
        }
      }
    })) {
      console.log(message);
    }
    ```
    </CodeGroup>

    [了解更多关于钩子的信息 →](/docs/zh-CN/agent-sdk/hooks)
  </Tab>
  <Tab title="子代理">
    生成专门的代理来处理专注的子任务。您的主代理委派工作，子代理报告结果。

    启用 `Task` 工具让 Claude 在决定任务足够复杂以受益于委派时生成子代理。Claude 根据任务复杂性自动确定何时使用子代理。

    <CodeGroup>
    ```python Python
    import asyncio
    from claude_agent_sdk import query, ClaudeAgentOptions

    async def main():
        async for message in query(
            prompt="Analyze this codebase for security vulnerabilities",
            options=ClaudeAgentOptions(allowed_tools=["Read", "Glob", "Grep", "Task"])
        ):
            print(message)

    asyncio.run(main())
    ```

    ```typescript TypeScript
    import { query } from "@anthropic-ai/claude-agent-sdk";

    for await (const message of query({
      prompt: "Analyze this codebase for security vulnerabilities",
      options: {
        allowedTools: ["Read", "Glob", "Grep", "Task"]
      }
    })) {
      console.log(message);
    }
    ```
    </CodeGroup>

    您也可以使用 `agents` 选项定义自定义代理类型，以实现更专门的委派模式。

    [了解更多关于子代理的信息 →](/docs/zh-CN/agent-sdk/subagents)
  </Tab>
  <Tab title="MCP">
    通过模型上下文协议连接到外部系统：数据库、浏览器、API 和[数百个更多](https://github.com/modelcontextprotocol/servers)。

    此示例连接 [Playwright MCP 服务器](https://github.com/microsoft/playwright-mcp)以为您的代理提供浏览器自动化功能：

    <CodeGroup>
    ```python Python
    import asyncio
    from claude_agent_sdk import query, ClaudeAgentOptions

    async def main():
        async for message in query(
            prompt="Open example.com and describe what you see",
            options=ClaudeAgentOptions(
                mcp_servers={
                    "playwright": {"command": "npx", "args": ["@playwright/mcp@latest"]}
                }
            )
        ):
            print(message)

    asyncio.run(main())
    ```

    ```typescript TypeScript
    import { query } from "@anthropic-ai/claude-agent-sdk";

    for await (const message of query({
      prompt: "Open example.com and describe what you see",
      options: {
        mcpServers: {
          playwright: { command: "npx", args: ["@playwright/mcp@latest"] }
        }
      }
    })) {
      console.log(message);
    }
    ```
    </CodeGroup>

    [了解更多关于 MCP 的信息 →](/docs/zh-CN/agent-sdk/mcp)
  </Tab>
  <Tab title="权限">
    精确控制您的代理可以使用哪些工具。允许安全操作、阻止危险操作或要求对敏感操作进行批准。

    此示例创建一个只读代理，可以分析但不能修改代码：

    <CodeGroup>
    ```python Python
    import asyncio
    from claude_agent_sdk import query, ClaudeAgentOptions

    async def main():
        async for message in query(
            prompt="Review this code for best practices",
            options=ClaudeAgentOptions(
                allowed_tools=["Read", "Glob", "Grep"],
                permission_mode="bypassPermissions"
            )
        ):
            print(message)

    asyncio.run(main())
    ```

    ```typescript TypeScript
    import { query } from "@anthropic-ai/claude-agent-sdk";

    for await (const message of query({
      prompt: "Review this code for best practices",
      options: {
        allowedTools: ["Read", "Glob", "Grep"],
        permissionMode: "bypassPermissions"
      }
    })) {
      console.log(message);
    }
    ```
    </CodeGroup>

    [了解更多关于权限的信息 →](/docs/zh-CN/agent-sdk/permissions)
  </Tab>
  <Tab title="会话">
    在多次交互中保持上下文。Claude 记住读取的文件、完成的分析和对话历史。稍后恢复会话，或分叉会话以探索不同的方法。

    此示例从第一个查询中捕获会话 ID，然后恢复以继续使用完整上下文：

    <CodeGroup>
    ```python Python
    import asyncio
    from claude_agent_sdk import query, ClaudeAgentOptions

    async def main():
        session_id = None

        # First query: capture the session ID
        async for message in query(
            prompt="Read the authentication module",
            options=ClaudeAgentOptions(allowed_tools=["Read", "Glob"])
        ):
            if hasattr(message, 'subtype') and message.subtype == 'init':
                session_id = message.data.get('session_id')

        # Resume with full context from the first query
        async for message in query(
            prompt="Now find all places that call it",  # "it" = auth module
            options=ClaudeAgentOptions(resume=session_id)
        ):
            pass

    asyncio.run(main())
    ```

    ```typescript TypeScript
    import { query } from "@anthropic-ai/claude-agent-sdk";

    let sessionId: string | undefined;

    // First query: capture the session ID
    for await (const message of query({
      prompt: "Read the authentication module",
      options: { allowedTools: ["Read", "Glob"] }
    })) {
      if (message.type === "system" && message.subtype === "init") {
        sessionId = message.session_id;
      }
    }

    // Resume with full context from the first query
    for await (const message of query({
      prompt: "Now find all places that call it",  // "it" = auth module
      options: { resume: sessionId }
    })) {
      // Process messages...
    }
    ```
    </CodeGroup>

    [了解更多关于会话的信息 →](/docs/zh-CN/agent-sdk/sessions)
  </Tab>
</Tabs>

### Claude Code 功能

SDK 还支持 Claude Code 的基于文件系统的配置。要使用这些功能，请在您的选项中设置 `setting_sources=["project"]`（Python）或 `settingSources: ['project']`（TypeScript）。

| 功能 | 描述 | 位置 |
|------|------|------|
| [技能](/docs/zh-CN/agent-sdk/skills) | 在 Markdown 中定义的专门功能 | `.claude/skills/SKILL.md` |
| [斜杠命令](/docs/zh-CN/agent-sdk/slash-commands) | 常见任务的自定义命令 | `.claude/commands/*.md` |
| [记忆](/docs/zh-CN/agent-sdk/modifying-system-prompts) | 项目上下文和说明 | `CLAUDE.md` 或 `.claude/CLAUDE.md` |
| [插件](/docs/zh-CN/agent-sdk/plugins) | 使用自定义命令、代理和 MCP 服务器扩展 | 通过 `plugins` 选项编程 |

## 开始使用

<Steps>
  <Step title="安装 Claude Code">
    SDK 使用 Claude Code 作为其运行时：

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

    有关 Windows 和其他选项，请参阅 [Claude Code 设置](https://docs.anthropic.com/en/docs/claude-code/setup)。
  </Step>
  <Step title="安装 SDK">
    <Tabs>
      <Tab title="TypeScript">
        ```bash
        npm install @anthropic-ai/claude-agent-sdk
        ```
      </Tab>
      <Tab title="Python">
        ```bash
        pip install claude-agent-sdk
        ```
      </Tab>
    </Tabs>
  </Step>
  <Step title="设置您的 API 密钥">
    ```bash
    export ANTHROPIC_API_KEY=your-api-key
    ```
    从[控制台](https://console.anthropic.com/)获取您的密钥。

    SDK 还支持通过第三方 API 提供商进行身份验证：

    - **Amazon Bedrock**：设置 `CLAUDE_CODE_USE_BEDROCK=1` 环境变量并配置 AWS 凭证
    - **Google Vertex AI**：设置 `CLAUDE_CODE_USE_VERTEX=1` 环境变量并配置 Google Cloud 凭证
    - **Microsoft Foundry**：设置 `CLAUDE_CODE_USE_FOUNDRY=1` 环境变量并配置 Azure 凭证

    <Note>
    除非事先获得批准，否则我们不允许第三方开发人员为其产品（包括基于 Claude Agent SDK 构建的代理）提供 Claude.ai 登录或速率限制。请改用本文档中描述的 API 密钥身份验证方法。
    </Note>
  </Step>
  <Step title="运行您的第一个代理">
    此示例创建一个使用内置工具列出当前目录中文件的代理。

    <CodeGroup>
    ```python Python
    import asyncio
    from claude_agent_sdk import query, ClaudeAgentOptions

    async def main():
        async for message in query(
            prompt="What files are in this directory?",
            options=ClaudeAgentOptions(allowed_tools=["Bash", "Glob"])
        ):
            print(message)

    asyncio.run(main())
    ```

    ```typescript TypeScript
    import { query } from "@anthropic-ai/claude-agent-sdk";

    for await (const message of query({
      prompt: "What files are in this directory?",
      options: { allowedTools: ["Bash", "Glob"] },
    })) {
      console.log(message);
    }
    ```
    </CodeGroup>
  </Step>
</Steps>

**准备好构建了吗？** 按照[快速入门](/docs/zh-CN/agent-sdk/quickstart)在几分钟内创建一个查找和修复 bug 的代理。

## 将 Agent SDK 与其他 Claude 工具进行比较

Claude 平台提供了多种使用 Claude 构建的方式。以下是 Agent SDK 的适用场景：

<Tabs>
  <Tab title="Agent SDK vs Client SDK">
    [Anthropic Client SDK](/docs/zh-CN/api/client-sdks) 为您提供直接 API 访问：您发送提示并自己实现工具执行。**Agent SDK** 为您提供具有内置工具执行的 Claude。

    使用 Client SDK，您实现工具循环。使用 Agent SDK，Claude 处理它：

    <CodeGroup>
    ```python Python
    # Client SDK: You implement the tool loop
    response = client.messages.create(...)
    while response.stop_reason == "tool_use":
        result = your_tool_executor(response.tool_use)
        response = client.messages.create(tool_result=result, ...)

    # Agent SDK: Claude handles tools autonomously
    async for message in query(prompt="Fix the bug in auth.py"):
        print(message)
    ```

    ```typescript TypeScript
    // Client SDK: You implement the tool loop
    let response = await client.messages.create({...});
    while (response.stop_reason === "tool_use") {
      const result = yourToolExecutor(response.tool_use);
      response = await client.messages.create({ tool_result: result, ... });
    }

    // Agent SDK: Claude handles tools autonomously
    for await (const message of query({ prompt: "Fix the bug in auth.py" })) {
      console.log(message);
    }
    ```
    </CodeGroup>
  </Tab>
  <Tab title="Agent SDK vs Claude Code CLI">
    相同的功能，不同的界面：

    | 用例 | 最佳选择 |
    |------|---------|
    | 交互式开发 | CLI |
    | CI/CD 管道 | SDK |
    | 自定义应用程序 | SDK |
    | 一次性任务 | CLI |
    | 生产自动化 | SDK |

    许多团队同时使用两者：CLI 用于日常开发，SDK 用于生产。工作流在它们之间直接转换。
  </Tab>
</Tabs>

## 更新日志

查看完整的更新日志以了解 SDK 更新、bug 修复和新功能：

- **TypeScript SDK**：[查看 CHANGELOG.md](https://github.com/anthropics/claude-agent-sdk-typescript/blob/main/CHANGELOG.md)
- **Python SDK**：[查看 CHANGELOG.md](https://github.com/anthropics/claude-agent-sdk-python/blob/main/CHANGELOG.md)

## 报告 bug

如果您在 Agent SDK 中遇到 bug 或问题：

- **TypeScript SDK**：[在 GitHub 上报告问题](https://github.com/anthropics/claude-agent-sdk-typescript/issues)
- **Python SDK**：[在 GitHub 上报告问题](https://github.com/anthropics/claude-agent-sdk-python/issues)

## 品牌指南

对于集成 Claude Agent SDK 的合作伙伴，使用 Claude 品牌是可选的。在您的产品中引用 Claude 时：

**允许：**
- "Claude Agent"（下拉菜单首选）
- "Claude"（当已在标记为"Agents"的菜单中时）
- "{YourAgentName} Powered by Claude"（如果您有现有的代理名称）

**不允许：**
- "Claude Code" 或 "Claude Code Agent"
- Claude Code 品牌的 ASCII 艺术或模仿 Claude Code 的视觉元素

您的产品应保持自己的品牌，不应显示为 Claude Code 或任何 Anthropic 产品。有关品牌合规性问题，请联系我们的[销售团队](https://www.anthropic.com/contact-sales)。

## 许可证和条款

Claude Agent SDK 的使用受 [Anthropic 商业服务条款](https://www.anthropic.com/legal/commercial-terms)管制，包括当您使用它为您自己的客户和最终用户提供的产品和服务时，除非特定组件或依赖项在该组件的 LICENSE 文件中指示的不同许可证下。

## 后续步骤

<CardGroup cols={2}>
  <Card title="快速入门" icon="play" href="/docs/zh-CN/agent-sdk/quickstart">
    构建一个在几分钟内查找和修复 bug 的代理
  </Card>
  <Card title="示例代理" icon="star" href="https://github.com/anthropics/claude-agent-sdk-demos">
    电子邮件助手、研究代理等
  </Card>
  <Card title="TypeScript SDK" icon="code" href="/docs/zh-CN/agent-sdk/typescript">
    完整的 TypeScript API 参考和示例
  </Card>
  <Card title="Python SDK" icon="code" href="/docs/zh-CN/agent-sdk/python">
    完整的 Python API 参考和示例
  </Card>
</CardGroup>