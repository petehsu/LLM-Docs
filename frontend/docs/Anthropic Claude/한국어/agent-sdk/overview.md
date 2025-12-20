# Agent SDK 개요

Claude Code를 라이브러리로 사용하여 프로덕션 AI 에이전트 구축

---

<Note>
Claude Code SDK는 Claude Agent SDK로 이름이 변경되었습니다. 이전 SDK에서 마이그레이션하는 경우 [마이그레이션 가이드](/docs/ko/agent-sdk/migration-guide)를 참조하세요.
</Note>

파일을 자동으로 읽고, 명령을 실행하고, 웹을 검색하고, 코드를 편집하는 등의 작업을 수행하는 AI 에이전트를 구축하세요. Agent SDK는 Claude Code를 강화하는 동일한 도구, 에이전트 루프 및 컨텍스트 관리를 Python과 TypeScript로 프로그래밍할 수 있게 제공합니다.

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

Agent SDK에는 파일 읽기, 명령 실행 및 코드 편집을 위한 기본 제공 도구가 포함되어 있으므로 도구 실행을 직접 구현하지 않고도 에이전트가 즉시 작업을 시작할 수 있습니다. 빠른 시작을 살펴보거나 SDK로 구축한 실제 에이전트를 탐색하세요:

<CardGroup cols={2}>
  <Card title="빠른 시작" icon="play" href="/docs/ko/agent-sdk/quickstart">
    몇 분 안에 버그 수정 에이전트 구축
  </Card>
  <Card title="예제 에이전트" icon="star" href="https://github.com/anthropics/claude-agent-sdk-demos">
    이메일 어시스턴트, 연구 에이전트 등
  </Card>
</CardGroup>

## 기능

Claude Code를 강력하게 만드는 모든 것이 SDK에서 사용 가능합니다:

<Tabs>
  <Tab title="기본 제공 도구">
    에이전트는 기본적으로 파일을 읽고, 명령을 실행하고, 코드베이스를 검색할 수 있습니다. 주요 도구는 다음과 같습니다:

    | 도구 | 기능 |
    |------|------|
    | **Read** | 작업 디렉토리의 모든 파일 읽기 |
    | **Write** | 새 파일 생성 |
    | **Edit** | 기존 파일에 정확한 편집 수행 |
    | **Bash** | 터미널 명령, 스크립트, git 작업 실행 |
    | **Glob** | 패턴으로 파일 찾기 (`**/*.ts`, `src/**/*.py`) |
    | **Grep** | 정규식으로 파일 내용 검색 |
    | **WebSearch** | 현재 정보를 위해 웹 검색 |
    | **WebFetch** | 웹 페이지 내용 가져오기 및 파싱 |

    이 예제는 코드베이스에서 TODO 주석을 검색하는 에이전트를 만듭니다:

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
  <Tab title="훅">
    에이전트 라이프사이클의 주요 지점에서 사용자 정의 코드를 실행합니다. 훅은 셸 명령이나 사용자 정의 스크립트를 실행하여 에이전트 동작을 검증, 로깅, 차단 또는 변환할 수 있습니다.

    **사용 가능한 훅:** `PreToolUse`, `PostToolUse`, `Stop`, `SessionStart`, `SessionEnd`, `UserPromptSubmit` 등.

    이 예제는 모든 파일 변경을 감사 파일에 기록합니다:

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

    [훅에 대해 자세히 알아보기 →](/docs/ko/agent-sdk/hooks)
  </Tab>
  <Tab title="서브에이전트">
    특화된 에이전트를 생성하여 집중된 부작업을 처리합니다. 메인 에이전트가 작업을 위임하고 서브에이전트가 결과를 보고합니다.

    `Task` 도구를 활성화하여 Claude가 위임의 이점을 얻을 수 있을 정도로 복잡한 작업이라고 판단할 때 서브에이전트를 생성하도록 합니다. Claude는 작업 복잡도에 따라 자동으로 서브에이전트 사용 시기를 결정합니다.

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

    더 특화된 위임 패턴을 위해 `agents` 옵션으로 사용자 정의 에이전트 유형을 정의할 수도 있습니다.

    [서브에이전트에 대해 자세히 알아보기 →](/docs/ko/agent-sdk/subagents)
  </Tab>
  <Tab title="MCP">
    Model Context Protocol을 통해 외부 시스템에 연결합니다: 데이터베이스, 브라우저, API 및 [수백 개 이상](https://github.com/modelcontextprotocol/servers).

    이 예제는 [Playwright MCP 서버](https://github.com/microsoft/playwright-mcp)를 연결하여 에이전트에 브라우저 자동화 기능을 제공합니다:

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

    [MCP에 대해 자세히 알아보기 →](/docs/ko/agent-sdk/mcp)
  </Tab>
  <Tab title="권한">
    에이전트가 사용할 수 있는 도구를 정확히 제어합니다. 안전한 작업을 허용하고, 위험한 작업을 차단하거나, 민감한 작업에 대해 승인을 요구합니다.

    이 예제는 코드를 분석할 수 있지만 수정할 수 없는 읽기 전용 에이전트를 만듭니다:

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

    [권한에 대해 자세히 알아보기 →](/docs/ko/agent-sdk/permissions)
  </Tab>
  <Tab title="세션">
    여러 교환 간에 컨텍스트를 유지합니다. Claude는 읽은 파일, 수행한 분석 및 대화 기록을 기억합니다. 나중에 세션을 재개하거나 다른 접근 방식을 탐색하기 위해 포크합니다.

    이 예제는 첫 번째 쿼리에서 세션 ID를 캡처한 다음 전체 컨텍스트로 계속하기 위해 재개합니다:

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

    [세션에 대해 자세히 알아보기 →](/docs/ko/agent-sdk/sessions)
  </Tab>
</Tabs>

### Claude Code 기능

SDK는 또한 Claude Code의 파일시스템 기반 구성을 지원합니다. 이러한 기능을 사용하려면 옵션에서 `setting_sources=["project"]` (Python) 또는 `settingSources: ['project']` (TypeScript)를 설정하세요.

| 기능 | 설명 | 위치 |
|------|------|------|
| [Skills](/docs/ko/agent-sdk/skills) | Markdown에 정의된 특화된 기능 | `.claude/skills/SKILL.md` |
| [Slash commands](/docs/ko/agent-sdk/slash-commands) | 일반적인 작업을 위한 사용자 정의 명령 | `.claude/commands/*.md` |
| [Memory](/docs/ko/agent-sdk/modifying-system-prompts) | 프로젝트 컨텍스트 및 지침 | `CLAUDE.md` 또는 `.claude/CLAUDE.md` |
| [Plugins](/docs/ko/agent-sdk/plugins) | 사용자 정의 명령, 에이전트 및 MCP 서버로 확장 | `plugins` 옵션을 통한 프로그래밍 방식 |

## 시작하기

<Steps>
  <Step title="Claude Code 설치">
    SDK는 Claude Code를 런타임으로 사용합니다:

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

    Windows 및 기타 옵션은 [Claude Code 설정](https://docs.anthropic.com/en/docs/claude-code/setup)을 참조하세요.
  </Step>
  <Step title="SDK 설치">
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
  <Step title="API 키 설정">
    ```bash
    export ANTHROPIC_API_KEY=your-api-key
    ```
    [Console](https://console.anthropic.com/)에서 키를 가져오세요.

    SDK는 또한 타사 API 제공자를 통한 인증을 지원합니다:

    - **Amazon Bedrock**: `CLAUDE_CODE_USE_BEDROCK=1` 환경 변수를 설정하고 AWS 자격증명을 구성합니다
    - **Google Vertex AI**: `CLAUDE_CODE_USE_VERTEX=1` 환경 변수를 설정하고 Google Cloud 자격증명을 구성합니다
    - **Microsoft Foundry**: `CLAUDE_CODE_USE_FOUNDRY=1` 환경 변수를 설정하고 Azure 자격증명을 구성합니다

    <Note>
    이전에 승인되지 않은 경우, 당사는 Claude Agent SDK에 구축된 에이전트를 포함하여 타사 개발자가 Claude.ai 로그인 또는 제품의 속도 제한을 제공하도록 허용하지 않습니다. 대신 이 문서에 설명된 API 키 인증 방법을 사용하세요.
    </Note>
  </Step>
  <Step title="첫 번째 에이전트 실행">
    이 예제는 기본 제공 도구를 사용하여 현재 디렉토리의 파일을 나열하는 에이전트를 만듭니다.

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

**구축할 준비가 되셨나요?** [빠른 시작](/docs/ko/agent-sdk/quickstart)을 따라 몇 분 안에 버그를 찾고 수정하는 에이전트를 만드세요.

## Agent SDK를 다른 Claude 도구와 비교

Claude 플랫폼은 Claude로 구축하는 여러 방법을 제공합니다. Agent SDK가 어떻게 적합한지 다음과 같습니다:

<Tabs>
  <Tab title="Agent SDK vs Client SDK">
    [Anthropic Client SDK](/docs/ko/api/client-sdks)는 직접 API 액세스를 제공합니다: 프롬프트를 보내고 도구 실행을 직접 구현합니다. **Agent SDK**는 기본 제공 도구 실행이 있는 Claude를 제공합니다.

    Client SDK를 사용하면 도구 루프를 구현합니다. Agent SDK를 사용하면 Claude가 처리합니다:

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
    동일한 기능, 다른 인터페이스:

    | 사용 사례 | 최적의 선택 |
    |----------|-----------|
    | 대화형 개발 | CLI |
    | CI/CD 파이프라인 | SDK |
    | 사용자 정의 애플리케이션 | SDK |
    | 일회성 작업 | CLI |
    | 프로덕션 자동화 | SDK |

    많은 팀이 둘 다 사용합니다: 일일 개발을 위한 CLI, 프로덕션을 위한 SDK. 워크플로우는 둘 간에 직접 변환됩니다.
  </Tab>
</Tabs>

## 변경 로그

SDK 업데이트, 버그 수정 및 새 기능에 대한 전체 변경 로그를 확인하세요:

- **TypeScript SDK**: [CHANGELOG.md 보기](https://github.com/anthropics/claude-agent-sdk-typescript/blob/main/CHANGELOG.md)
- **Python SDK**: [CHANGELOG.md 보기](https://github.com/anthropics/claude-agent-sdk-python/blob/main/CHANGELOG.md)

## 버그 보고

Agent SDK에서 버그나 문제가 발생하면:

- **TypeScript SDK**: [GitHub에서 문제 보고](https://github.com/anthropics/claude-agent-sdk-typescript/issues)
- **Python SDK**: [GitHub에서 문제 보고](https://github.com/anthropics/claude-agent-sdk-python/issues)

## 브랜딩 가이드라인

Claude Agent SDK를 통합하는 파트너의 경우 Claude 브랜딩 사용은 선택 사항입니다. 제품에서 Claude를 참조할 때:

**허용됨:**
- "Claude Agent" (드롭다운 메뉴에 권장)
- "Claude" (이미 "Agents"로 레이블이 지정된 메뉴 내)
- "{YourAgentName} Powered by Claude" (기존 에이전트 이름이 있는 경우)

**허용되지 않음:**
- "Claude Code" 또는 "Claude Code Agent"
- Claude Code 브랜딩 ASCII 아트 또는 Claude Code를 모방하는 시각적 요소

제품은 자체 브랜딩을 유지해야 하며 Claude Code 또는 Anthropic 제품으로 보이지 않아야 합니다. 브랜딩 준수에 대한 질문은 [영업팀](https://www.anthropic.com/contact-sales)에 문의하세요.

## 라이선스 및 약관

Claude Agent SDK의 사용은 [Anthropic의 상용 서비스 약관](https://www.anthropic.com/legal/commercial-terms)에 의해 관리되며, 이는 자신의 고객 및 최종 사용자가 사용할 수 있도록 제공하는 제품 및 서비스를 강화하기 위해 사용할 때도 포함됩니다. 단, 특정 구성 요소 또는 종속성이 해당 구성 요소의 LICENSE 파일에 표시된 대로 다른 라이선스에 의해 적용되는 경우는 제외합니다.

## 다음 단계

<CardGroup cols={2}>
  <Card title="빠른 시작" icon="play" href="/docs/ko/agent-sdk/quickstart">
    몇 분 안에 버그를 찾고 수정하는 에이전트 구축
  </Card>
  <Card title="예제 에이전트" icon="star" href="https://github.com/anthropics/claude-agent-sdk-demos">
    이메일 어시스턴트, 연구 에이전트 등
  </Card>
  <Card title="TypeScript SDK" icon="code" href="/docs/ko/agent-sdk/typescript">
    전체 TypeScript API 참조 및 예제
  </Card>
  <Card title="Python SDK" icon="code" href="/docs/ko/agent-sdk/python">
    전체 Python API 참조 및 예제
  </Card>
</CardGroup>