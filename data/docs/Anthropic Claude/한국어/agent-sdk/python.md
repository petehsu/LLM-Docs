# Agent SDK reference - Python

Python Agent SDK의 완전한 API 참조로, 모든 함수, 타입 및 클래스를 포함합니다.

---

## 설치

```bash
pip install claude-agent-sdk
```

## `query()`와 `ClaudeSDKClient` 중 선택하기

Python SDK는 Claude Code와 상호작용하는 두 가지 방법을 제공합니다:

### 빠른 비교

| 기능             | `query()`                     | `ClaudeSDKClient`                  |
| :------------------ | :---------------------------- | :--------------------------------- |
| **세션**         | 매번 새 세션 생성 | 동일한 세션 재사용                |
| **대화**    | 단일 교환               | 동일한 컨텍스트에서 여러 교환 |
| **연결**      | 자동 관리         | 수동 제어                     |
| **스트리밍 입력** | ✅ 지원됨                  | ✅ 지원됨                       |
| **중단**      | ❌ 지원되지 않음              | ✅ 지원됨                       |
| **훅**           | ❌ 지원되지 않음              | ✅ 지원됨                       |
| **사용자 정의 도구**    | ❌ 지원되지 않음              | ✅ 지원됨                       |
| **대화 계속**   | ❌ 매번 새 세션      | ✅ 대화 유지          |
| **사용 사례**        | 일회성 작업                 | 지속적인 대화           |

### `query()` 사용 시기 (매번 새 세션)

**최적의 경우:**

- 대화 기록이 필요 없는 일회성 질문
- 이전 교환의 컨텍스트가 필요 없는 독립적인 작업
- 간단한 자동화 스크립트
- 매번 새로 시작하고 싶을 때

### `ClaudeSDKClient` 사용 시기 (지속적인 대화)

**최적의 경우:**

- **대화 계속** - Claude가 컨텍스트를 기억해야 할 때
- **후속 질문** - 이전 응답을 기반으로 구축
- **대화형 애플리케이션** - 채팅 인터페이스, REPL
- **응답 기반 로직** - 다음 작업이 Claude의 응답에 따라 달라질 때
- **세션 제어** - 대화 생명주기를 명시적으로 관리

## 함수

### `query()`

Claude Code와의 각 상호작용을 위해 새 세션을 생성합니다. 메시지가 도착하면 메시지를 생성하는 비동기 반복자를 반환합니다. `query()`에 대한 각 호출은 이전 상호작용의 메모리 없이 새로 시작됩니다.

```python
async def query(
    *,
    prompt: str | AsyncIterable[dict[str, Any]],
    options: ClaudeAgentOptions | None = None
) -> AsyncIterator[Message]
```

#### 매개변수

| 매개변수 | 타입                         | 설명                                                                |
| :-------- | :--------------------------- | :------------------------------------------------------------------------- |
| `prompt`  | `str \| AsyncIterable[dict]` | 문자열 또는 스트리밍 모드를 위한 비동기 반복 가능한 입력 프롬프트          |
| `options` | `ClaudeAgentOptions \| None` | 선택적 구성 객체 (None인 경우 `ClaudeAgentOptions()`로 기본값 설정) |

#### 반환값

대화에서 메시지를 생성하는 `AsyncIterator[Message]`를 반환합니다.

#### 예제 - 옵션 포함

```python

import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions

async def main():
    options = ClaudeAgentOptions(
        system_prompt="You are an expert Python developer",
        permission_mode='acceptEdits',
        cwd="/home/user/project"
    )

    async for message in query(
        prompt="Create a Python web server",
        options=options
    ):
        print(message)


asyncio.run(main())
```

### `tool()`

타입 안전성을 갖춘 MCP 도구 정의를 위한 데코레이터입니다.

```python
def tool(
    name: str,
    description: str,
    input_schema: type | dict[str, Any]
) -> Callable[[Callable[[Any], Awaitable[dict[str, Any]]]], SdkMcpTool[Any]]
```

#### 매개변수

| 매개변수      | 타입                     | 설명                                             |
| :------------- | :----------------------- | :------------------------------------------------------ |
| `name`         | `str`                    | 도구의 고유 식별자                          |
| `description`  | `str`                    | 도구가 수행하는 작업에 대한 인간이 읽을 수 있는 설명        |
| `input_schema` | `type \| dict[str, Any]` | 도구의 입력 매개변수를 정의하는 스키마 (아래 참조) |

#### 입력 스키마 옵션

1. **단순 타입 매핑** (권장):

   ```python
   {"text": str, "count": int, "enabled": bool}
   ```

2. **JSON Schema 형식** (복잡한 검증의 경우):
   ```python
   {
       "type": "object",
       "properties": {
           "text": {"type": "string"},
           "count": {"type": "integer", "minimum": 0}
       },
       "required": ["text"]
   }
   ```

#### 반환값

도구 구현을 래핑하고 `SdkMcpTool` 인스턴스를 반환하는 데코레이터 함수입니다.

#### 예제

```python
from claude_agent_sdk import tool
from typing import Any

@tool("greet", "Greet a user", {"name": str})
async def greet(args: dict[str, Any]) -> dict[str, Any]:
    return {
        "content": [{
            "type": "text",
            "text": f"Hello, {args['name']}!"
        }]
    }
```

### `create_sdk_mcp_server()`

Python 애플리케이션 내에서 실행되는 인프로세스 MCP 서버를 생성합니다.

```python
def create_sdk_mcp_server(
    name: str,
    version: str = "1.0.0",
    tools: list[SdkMcpTool[Any]] | None = None
) -> McpSdkServerConfig
```

#### 매개변수

| 매개변수 | 타입                            | 기본값   | 설명                                           |
| :-------- | :------------------------------ | :-------- | :---------------------------------------------------- |
| `name`    | `str`                           | -         | 서버의 고유 식별자                      |
| `version` | `str`                           | `"1.0.0"` | 서버 버전 문자열                                 |
| `tools`   | `list[SdkMcpTool[Any]] \| None` | `None`    | `@tool` 데코레이터로 생성된 도구 함수 목록 |

#### 반환값

`ClaudeAgentOptions.mcp_servers`에 전달할 수 있는 `McpSdkServerConfig` 객체를 반환합니다.

#### 예제

```python
from claude_agent_sdk import tool, create_sdk_mcp_server

@tool("add", "Add two numbers", {"a": float, "b": float})
async def add(args):
    return {
        "content": [{
            "type": "text",
            "text": f"Sum: {args['a'] + args['b']}"
        }]
    }

@tool("multiply", "Multiply two numbers", {"a": float, "b": float})
async def multiply(args):
    return {
        "content": [{
            "type": "text",
            "text": f"Product: {args['a'] * args['b']}"
        }]
    }

calculator = create_sdk_mcp_server(
    name="calculator",
    version="2.0.0",
    tools=[add, multiply]  # Pass decorated functions
)

# Use with Claude
options = ClaudeAgentOptions(
    mcp_servers={"calc": calculator},
    allowed_tools=["mcp__calc__add", "mcp__calc__multiply"]
)
```

## 클래스

### `ClaudeSDKClient`

**여러 교환에 걸쳐 대화 세션을 유지합니다.** 이것은 TypeScript SDK의 `query()` 함수가 내부적으로 작동하는 방식과 동일한 Python 버전입니다 - 대화를 계속할 수 있는 클라이언트 객체를 생성합니다.

#### 주요 기능

- **세션 연속성**: 여러 `query()` 호출에 걸쳐 대화 컨텍스트 유지
- **동일한 대화**: Claude가 세션의 이전 메시지를 기억함
- **중단 지원**: Claude 실행 중 중지 가능
- **명시적 생명주기**: 세션이 시작되고 끝나는 시점을 제어
- **응답 기반 흐름**: 응답에 반응하고 후속 조치를 보낼 수 있음
- **사용자 정의 도구 및 훅**: `@tool` 데코레이터로 생성된 사용자 정의 도구 및 훅 지원

```python
class ClaudeSDKClient:
    def __init__(self, options: ClaudeAgentOptions | None = None)
    async def connect(self, prompt: str | AsyncIterable[dict] | None = None) -> None
    async def query(self, prompt: str | AsyncIterable[dict], session_id: str = "default") -> None
    async def receive_messages(self) -> AsyncIterator[Message]
    async def receive_response(self) -> AsyncIterator[Message]
    async def interrupt(self) -> None
    async def disconnect(self) -> None
```

#### 메서드

| 메서드                      | 설명                                                         |
| :-------------------------- | :------------------------------------------------------------------ |
| `__init__(options)`         | 선택적 구성으로 클라이언트 초기화                   |
| `connect(prompt)`           | 선택적 초기 프롬프트 또는 메시지 스트림으로 Claude에 연결 |
| `query(prompt, session_id)` | 스트리밍 모드에서 새 요청 전송                                |
| `receive_messages()`        | Claude의 모든 메시지를 비동기 반복자로 수신               |
| `receive_response()`        | ResultMessage를 포함하여 메시지 수신                |
| `interrupt()`               | 중단 신호 전송 (스트리밍 모드에서만 작동)                |
| `disconnect()`              | Claude에서 연결 해제                                              |

#### 컨텍스트 관리자 지원

클라이언트는 자동 연결 관리를 위해 비동기 컨텍스트 관리자로 사용할 수 있습니다:

```python
async with ClaudeSDKClient() as client:
    await client.query("Hello Claude")
    async for message in client.receive_response():
        print(message)
```

> **중요:** 메시지를 반복할 때 조기에 종료하기 위해 `break`를 사용하지 마세요. 이는 asyncio 정리 문제를 일으킬 수 있습니다. 대신 반복이 자연스럽게 완료되도록 하거나 플래그를 사용하여 필요한 것을 찾았을 때를 추적하세요.

#### 예제 - 대화 계속하기

```python
import asyncio
from claude_agent_sdk import ClaudeSDKClient, AssistantMessage, TextBlock, ResultMessage

async def main():
    async with ClaudeSDKClient() as client:
        # First question
        await client.query("What's the capital of France?")

        # Process response
        async for message in client.receive_response():
            if isinstance(message, AssistantMessage):
                for block in message.content:
                    if isinstance(block, TextBlock):
                        print(f"Claude: {block.text}")

        # Follow-up question - Claude remembers the previous context
        await client.query("What's the population of that city?")

        async for message in client.receive_response():
            if isinstance(message, AssistantMessage):
                for block in message.content:
                    if isinstance(block, TextBlock):
                        print(f"Claude: {block.text}")

        # Another follow-up - still in the same conversation
        await client.query("What are some famous landmarks there?")

        async for message in client.receive_response():
            if isinstance(message, AssistantMessage):
                for block in message.content:
                    if isinstance(block, TextBlock):
                        print(f"Claude: {block.text}")

asyncio.run(main())
```

#### 예제 - ClaudeSDKClient를 사용한 스트리밍 입력

```python
import asyncio
from claude_agent_sdk import ClaudeSDKClient

async def message_stream():
    """Generate messages dynamically."""
    yield {"type": "text", "text": "Analyze the following data:"}
    await asyncio.sleep(0.5)
    yield {"type": "text", "text": "Temperature: 25°C"}
    await asyncio.sleep(0.5)
    yield {"type": "text", "text": "Humidity: 60%"}
    await asyncio.sleep(0.5)
    yield {"type": "text", "text": "What patterns do you see?"}

async def main():
    async with ClaudeSDKClient() as client:
        # Stream input to Claude
        await client.query(message_stream())

        # Process response
        async for message in client.receive_response():
            print(message)

        # Follow-up in same session
        await client.query("Should we be concerned about these readings?")

        async for message in client.receive_response():
            print(message)

asyncio.run(main())
```

#### 예제 - 중단 사용

```python
import asyncio
from claude_agent_sdk import ClaudeSDKClient, ClaudeAgentOptions

async def interruptible_task():
    options = ClaudeAgentOptions(
        allowed_tools=["Bash"],
        permission_mode="acceptEdits"
    )

    async with ClaudeSDKClient(options=options) as client:
        # Start a long-running task
        await client.query("Count from 1 to 100 slowly")

        # Let it run for a bit
        await asyncio.sleep(2)

        # Interrupt the task
        await client.interrupt()
        print("Task interrupted!")

        # Send a new command
        await client.query("Just say hello instead")

        async for message in client.receive_response():
            # Process the new response
            pass

asyncio.run(interruptible_task())
```

#### 예제 - 고급 권한 제어

```python
from claude_agent_sdk import (
    ClaudeSDKClient,
    ClaudeAgentOptions
)

async def custom_permission_handler(
    tool_name: str,
    input_data: dict,
    context: dict
):
    """Custom logic for tool permissions."""

    # Block writes to system directories
    if tool_name == "Write" and input_data.get("file_path", "").startswith("/system/"):
        return {
            "behavior": "deny",
            "message": "System directory write not allowed",
            "interrupt": True
        }

    # Redirect sensitive file operations
    if tool_name in ["Write", "Edit"] and "config" in input_data.get("file_path", ""):
        safe_path = f"./sandbox/{input_data['file_path']}"
        return {
            "behavior": "allow",
            "updatedInput": {**input_data, "file_path": safe_path}
        }

    # Allow everything else
    return {
        "behavior": "allow",
        "updatedInput": input_data
    }

async def main():
    options = ClaudeAgentOptions(
        can_use_tool=custom_permission_handler,
        allowed_tools=["Read", "Write", "Edit"]
    )

    async with ClaudeSDKClient(options=options) as client:
        await client.query("Update the system config file")

        async for message in client.receive_response():
            # Will use sandbox path instead
            print(message)

asyncio.run(main())
```

## 타입

### `SdkMcpTool`

`@tool` 데코레이터로 생성된 SDK MCP 도구의 정의입니다.

```python
@dataclass
class SdkMcpTool(Generic[T]):
    name: str
    description: str
    input_schema: type[T] | dict[str, Any]
    handler: Callable[[T], Awaitable[dict[str, Any]]]
```

| 속성       | 타입                                       | 설명                                |
| :------------- | :----------------------------------------- | :----------------------------------------- |
| `name`         | `str`                                      | 도구의 고유 식별자             |
| `description`  | `str`                                      | 인간이 읽을 수 있는 설명                 |
| `input_schema` | `type[T] \| dict[str, Any]`                | 입력 검증을 위한 스키마                |
| `handler`      | `Callable[[T], Awaitable[dict[str, Any]]]` | 도구 실행을 처리하는 비동기 함수 |

### `ClaudeAgentOptions`

Claude Code 쿼리를 위한 구성 데이터클래스입니다.

```python
@dataclass
class ClaudeAgentOptions:
    allowed_tools: list[str] = field(default_factory=list)
    system_prompt: str | SystemPromptPreset | None = None
    mcp_servers: dict[str, McpServerConfig] | str | Path = field(default_factory=dict)
    permission_mode: PermissionMode | None = None
    continue_conversation: bool = False
    resume: str | None = None
    max_turns: int | None = None
    disallowed_tools: list[str] = field(default_factory=list)
    model: str | None = None
    output_format: OutputFormat | None = None
    permission_prompt_tool_name: str | None = None
    cwd: str | Path | None = None
    settings: str | None = None
    add_dirs: list[str | Path] = field(default_factory=list)
    env: dict[str, str] = field(default_factory=dict)
    extra_args: dict[str, str | None] = field(default_factory=dict)
    max_buffer_size: int | None = None
    debug_stderr: Any = sys.stderr  # Deprecated
    stderr: Callable[[str], None] | None = None
    can_use_tool: CanUseTool | None = None
    hooks: dict[HookEvent, list[HookMatcher]] | None = None
    user: str | None = None
    include_partial_messages: bool = False
    fork_session: bool = False
    agents: dict[str, AgentDefinition] | None = None
    setting_sources: list[SettingSource] | None = None
```

| 속성                      | 타입                                         | 기본값              | 설명                                                                                                                                                                             |
| :---------------------------- | :------------------------------------------- | :------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `allowed_tools`               | `list[str]`                                  | `[]`                 | 허용된 도구 이름 목록                                                                                                                                                              |
| `system_prompt`               | `str \| SystemPromptPreset \| None`          | `None`               | 시스템 프롬프트 구성. 사용자 정의 프롬프트의 경우 문자열을 전달하거나, Claude Code의 시스템 프롬프트의 경우 `{"type": "preset", "preset": "claude_code"}`를 사용하세요. 프리셋을 확장하려면 `"append"`를 추가하세요 |
| `mcp_servers`                 | `dict[str, McpServerConfig] \| str \| Path`  | `{}`                 | MCP 서버 구성 또는 구성 파일 경로                                                                                                                                        |
| `permission_mode`             | `PermissionMode \| None`                     | `None`               | 도구 사용을 위한 권한 모드                                                                                                                                                          |
| `continue_conversation`       | `bool`                                       | `False`              | 가장 최근 대화 계속                                                                                                                                                                   |
| `resume`                      | `str \| None`                                | `None`               | 재개할 세션 ID                                                                                                                                                                    |
| `max_turns`                   | `int \| None`                                | `None`               | 최대 대화 턴                                                                                                                                                              |
| `disallowed_tools`            | `list[str]`                                  | `[]`                 | 허용되지 않는 도구 이름 목록                                                                                                                                                           |
| `model`                       | `str \| None`                                | `None`               | 사용할 Claude 모델                                                                                                                                                                     |
| `output_format`               | [`OutputFormat`](#outputformat) ` \| None`   | `None`               | 에이전트 결과의 출력 형식을 정의합니다. 자세한 내용은 [구조화된 출력](/docs/ko/agent-sdk/structured-outputs)을 참조하세요                                                                    |
| `permission_prompt_tool_name` | `str \| None`                                | `None`               | 권한 프롬프트를 위한 MCP 도구 이름                                                                                                                                                    |
| `cwd`                         | `str \| Path \| None`                        | `None`               | 현재 작업 디렉토리                                                                                                                                                               |
| `settings`                    | `str \| None`                                | `None`               | 설정 파일 경로                                                                                                                                                                   |
| `add_dirs`                    | `list[str \| Path]`                          | `[]`                 | Claude가 접근할 수 있는 추가 디렉토리                                                                                                                                                |
| `env`                         | `dict[str, str]`                             | `{}`                 | 환경 변수                                                                                                                                                                   |
| `extra_args`                  | `dict[str, str \| None]`                     | `{}`                 | CLI에 직접 전달할 추가 CLI 인수                                                                                                                                    |
| `max_buffer_size`             | `int \| None`                                | `None`               | CLI stdout를 버퍼링할 때 최대 바이트                                                                                                                                                 |
| `debug_stderr`                | `Any`                                        | `sys.stderr`         | _더 이상 사용되지 않음_ - 디버그 출력을 위한 파일 유사 객체. 대신 `stderr` 콜백을 사용하세요                                                                                                         |
| `stderr`                      | `Callable[[str], None] \| None`              | `None`               | CLI의 stderr 출력을 위한 콜백 함수                                                                                                                                            |
| `can_use_tool`                | `CanUseTool \| None`                         | `None`               | 도구 권한 콜백 함수                                                                                                                                                       |
| `hooks`                       | `dict[HookEvent, list[HookMatcher]] \| None` | `None`               | 이벤트 가로채기를 위한 훅 구성                                                                                                                                             |
| `user`                        | `str \| None`                                | `None`               | 사용자 식별자                                                                                                                                                                         |
| `include_partial_messages`    | `bool`                                       | `False`              | 부분 메시지 스트리밍 이벤트 포함                                                                                                                                                |
| `fork_session`                | `bool`                                       | `False`              | `resume`으로 재개할 때 원본 세션을 계속하는 대신 새 세션 ID로 포크                                                                                        |
| `agents`                      | `dict[str, AgentDefinition] \| None`         | `None`               | 프로그래밍 방식으로 정의된 서브에이전트                                                                                                                                                      |
| `plugins`                     | `list[SdkPluginConfig]`                      | `[]`                 | 로컬 경로에서 사용자 정의 플러그인을 로드합니다. 자세한 내용은 [플러그인](/docs/ko/agent-sdk/plugins)을 참조하세요                                                                             |
| `sandbox`                     | [`SandboxSettings`](#sandboxsettings) ` \| None` | `None`              | 프로그래밍 방식으로 샌드박스 동작을 구성합니다. 자세한 내용은 [샌드박스 설정](#sandboxsettings)을 참조하세요                                        |
| `setting_sources`             | `list[SettingSource] \| None`                | `None` (설정 없음) | 로드할 파일 시스템 설정을 제어합니다. 생략하면 설정이 로드되지 않습니다. **참고:** CLAUDE.md 파일을 로드하려면 `"project"`를 포함해야 합니다                                             |

### `OutputFormat`

구조화된 출력 검증을 위한 구성입니다.

```python
class OutputFormat(TypedDict):
    type: Literal["json_schema"]
    schema: dict[str, Any]
```

| 필드    | 필수 | 설명                                    |
| :------- | :------- | :--------------------------------------------- |
| `type`   | 예      | JSON Schema 검증을 위해 `"json_schema"`이어야 합니다 |
| `schema` | 예      | 출력 검증을 위한 JSON Schema 정의   |

### `SystemPromptPreset`

선택적 추가 사항이 있는 Claude Code의 프리셋 시스템 프롬프트 사용을 위한 구성입니다.

```python
class SystemPromptPreset(TypedDict):
    type: Literal["preset"]
    preset: Literal["claude_code"]
    append: NotRequired[str]
```

| 필드    | 필수 | 설명                                                   |
| :------- | :------- | :------------------------------------------------------------ |
| `type`   | 예      | 프리셋 시스템 프롬프트를 사용하려면 `"preset"`이어야 합니다              |
| `preset` | 예      | Claude Code의 시스템 프롬프트를 사용하려면 `"claude_code"`이어야 합니다    |
| `append` | 아니오       | 프리셋 시스템 프롬프트에 추가할 추가 지침 |

### `SettingSource`

SDK가 로드하는 설정의 파일 시스템 기반 구성 소스를 제어합니다.

```python
SettingSource = Literal["user", "project", "local"]
```

| 값       | 설명                                  | 위치                      |
| :---------- | :------------------------------------------- | :---------------------------- |
| `"user"`    | 전역 사용자 설정                         | `~/.claude/settings.json`     |
| `"project"` | 공유 프로젝트 설정 (버전 제어됨) | `.claude/settings.json`       |
| `"local"`   | 로컬 프로젝트 설정 (gitignored)          | `.claude/settings.local.json` |

#### 기본 동작

`setting_sources`가 **생략되거나** **`None`**일 때, SDK는 파일 시스템 설정을 **로드하지 않습니다**. 이는 SDK 애플리케이션에 격리를 제공합니다.

#### setting_sources를 사용하는 이유는?

**모든 파일 시스템 설정 로드 (레거시 동작):**

```python
# SDK v0.0.x처럼 모든 설정 로드
from claude_agent_sdk import query, ClaudeAgentOptions

async for message in query(
    prompt="Analyze this code",
    options=ClaudeAgentOptions(
        setting_sources=["user", "project", "local"]  # Load all settings
    )
):
    print(message)
```

**특정 설정 소스만 로드:**

```python
# 프로젝트 설정만 로드, 사용자 및 로컬 무시
async for message in query(
    prompt="Run CI checks",
    options=ClaudeAgentOptions(
        setting_sources=["project"]  # Only .claude/settings.json
    )
):
    print(message)
```

**테스트 및 CI 환경:**

```python
# 로컬 설정을 제외하여 CI에서 일관된 동작 보장
async for message in query(
    prompt="Run tests",
    options=ClaudeAgentOptions(
        setting_sources=["project"],  # Only team-shared settings
        permission_mode="bypassPermissions"
    )
):
    print(message)
```

**SDK 전용 애플리케이션:**

```python
# 모든 것을 프로그래밍 방식으로 정의 (기본 동작)
# 파일 시스템 종속성 없음 - setting_sources는 기본값이 None
async for message in query(
    prompt="Review this PR",
    options=ClaudeAgentOptions(
        # setting_sources=None is the default, no need to specify
        agents={ /* ... */ },
        mcp_servers={ /* ... */ },
        allowed_tools=["Read", "Grep", "Glob"]
    )
):
    print(message)
```

**CLAUDE.md 프로젝트 지침 로드:**

```python
# 프로젝트 설정을 로드하여 CLAUDE.md 파일 포함
async for message in query(
    prompt="Add a new feature following project conventions",
    options=ClaudeAgentOptions(
        system_prompt={
            "type": "preset",
            "preset": "claude_code"  # Use Claude Code's system prompt
        },
        setting_sources=["project"],  # Required to load CLAUDE.md from project
        allowed_tools=["Read", "Write", "Edit"]
    )
):
    print(message)
```

#### 설정 우선순위

여러 소스가 로드될 때, 설정은 다음 우선순위(높음에서 낮음)로 병합됩니다:

1. 로컬 설정 (`.claude/settings.local.json`)
2. 프로젝트 설정 (`.claude/settings.json`)
3. 사용자 설정 (`~/.claude/settings.json`)

프로그래밍 방식의 옵션 (예: `agents`, `allowed_tools`)은 항상 파일 시스템 설정을 재정의합니다.

### `AgentDefinition`

프로그래밍 방식으로 정의된 서브에이전트를 위한 구성입니다.

```python
@dataclass
class AgentDefinition:
    description: str
    prompt: str
    tools: list[str] | None = None
    model: Literal["sonnet", "opus", "haiku", "inherit"] | None = None
```

| 필드         | 필수 | 설명                                                    |
| :------------ | :------- | :------------------------------------------------------------- |
| `description` | 예      | 이 에이전트를 사용할 시기에 대한 자연어 설명         |
| `tools`       | 아니오       | 허용된 도구 이름 배열. 생략하면 모든 도구를 상속합니다    |
| `prompt`      | 예      | 에이전트의 시스템 프롬프트                                      |
| `model`       | 아니오       | 이 에이전트의 모델 재정의. 생략하면 메인 모델을 사용합니다 |

### `PermissionMode`

도구 실행을 제어하기 위한 권한 모드입니다.

```python
PermissionMode = Literal[
    "default",           # Standard permission behavior
    "acceptEdits",       # Auto-accept file edits
    "plan",              # Planning mode - no execution
    "bypassPermissions"  # Bypass all permission checks (use with caution)
]
```

### `McpSdkServerConfig`

`create_sdk_mcp_server()`로 생성된 SDK MCP 서버를 위한 구성입니다.

```python
class McpSdkServerConfig(TypedDict):
    type: Literal["sdk"]
    name: str
    instance: Any  # MCP Server instance
```

### `McpServerConfig`

MCP 서버 구성을 위한 합집합 타입입니다.

```python
McpServerConfig = McpStdioServerConfig | McpSSEServerConfig | McpHttpServerConfig | McpSdkServerConfig
```

#### `McpStdioServerConfig`

```python
class McpStdioServerConfig(TypedDict):
    type: NotRequired[Literal["stdio"]]  # Optional for backwards compatibility
    command: str
    args: NotRequired[list[str]]
    env: NotRequired[dict[str, str]]
```

#### `McpSSEServerConfig`

```python
class McpSSEServerConfig(TypedDict):
    type: Literal["sse"]
    url: str
    headers: NotRequired[dict[str, str]]
```

#### `McpHttpServerConfig`

```python
class McpHttpServerConfig(TypedDict):
    type: Literal["http"]
    url: str
    headers: NotRequired[dict[str, str]]
```

### `SdkPluginConfig`

SDK에서 플러그인을 로드하기 위한 구성입니다.

```python
class SdkPluginConfig(TypedDict):
    type: Literal["local"]
    path: str
```

| 필드 | 타입 | 설명 |
|:------|:-----|:------------|
| `type` | `Literal["local"]` | `"local"`이어야 합니다 (현재 로컬 플러그인만 지원됨) |
| `path` | `str` | 플러그인 디렉토리의 절대 또는 상대 경로 |

**예제:**
```python
plugins=[
    {"type": "local", "path": "./my-plugin"},
    {"type": "local", "path": "/absolute/path/to/plugin"}
]
```

플러그인 생성 및 사용에 대한 완전한 정보는 [플러그인](/docs/ko/agent-sdk/plugins)을 참조하세요.

## 메시지 타입

### `Message`

모든 가능한 메시지의 합집합 타입입니다.

```python
Message = UserMessage | AssistantMessage | SystemMessage | ResultMessage
```

### `UserMessage`

사용자 입력 메시지입니다.

```python
@dataclass
class UserMessage:
    content: str | list[ContentBlock]
```

### `AssistantMessage`

콘텐츠 블록이 있는 어시스턴트 응답 메시지입니다.

```python
@dataclass
class AssistantMessage:
    content: list[ContentBlock]
    model: str
```

### `SystemMessage`

메타데이터가 있는 시스템 메시지입니다.

```python
@dataclass
class SystemMessage:
    subtype: str
    data: dict[str, Any]
```

### `ResultMessage`

비용 및 사용 정보가 있는 최종 결과 메시지입니다.

```python
@dataclass
class ResultMessage:
    subtype: str
    duration_ms: int
    duration_api_ms: int
    is_error: bool
    num_turns: int
    session_id: str
    total_cost_usd: float | None = None
    usage: dict[str, Any] | None = None
    result: str | None = None
```

## 콘텐츠 블록 타입

### `ContentBlock`

모든 콘텐츠 블록의 합집합 타입입니다.

```python
ContentBlock = TextBlock | ThinkingBlock | ToolUseBlock | ToolResultBlock
```

### `TextBlock`

텍스트 콘텐츠 블록입니다.

```python
@dataclass
class TextBlock:
    text: str
```

### `ThinkingBlock`

사고 콘텐츠 블록입니다(사고 기능이 있는 모델용).

```python
@dataclass
class ThinkingBlock:
    thinking: str
    signature: str
```

### `ToolUseBlock`

도구 사용 요청 블록입니다.

```python
@dataclass
class ToolUseBlock:
    id: str
    name: str
    input: dict[str, Any]
```

### `ToolResultBlock`

도구 실행 결과 블록입니다.

```python
@dataclass
class ToolResultBlock:
    tool_use_id: str
    content: str | list[dict[str, Any]] | None = None
    is_error: bool | None = None
```

## 오류 유형

### `ClaudeSDKError`

모든 SDK 오류에 대한 기본 예외 클래스입니다.

```python
class ClaudeSDKError(Exception):
    """Claude SDK의 기본 오류입니다."""
```

### `CLINotFoundError`

Claude Code CLI가 설치되지 않았거나 찾을 수 없을 때 발생합니다.

```python
class CLINotFoundError(CLIConnectionError):
    def __init__(self, message: str = "Claude Code not found", cli_path: str | None = None):
        """
        Args:
            message: 오류 메시지 (기본값: "Claude Code not found")
            cli_path: 찾을 수 없는 CLI의 선택적 경로
        """
```

### `CLIConnectionError`

Claude Code에 대한 연결이 실패할 때 발생합니다.

```python
class CLIConnectionError(ClaudeSDKError):
    """Claude Code에 연결하지 못했습니다."""
```

### `ProcessError`

Claude Code 프로세스가 실패할 때 발생합니다.

```python
class ProcessError(ClaudeSDKError):
    def __init__(self, message: str, exit_code: int | None = None, stderr: str | None = None):
        self.exit_code = exit_code
        self.stderr = stderr
```

### `CLIJSONDecodeError`

JSON 파싱이 실패할 때 발생합니다.

```python
class CLIJSONDecodeError(ClaudeSDKError):
    def __init__(self, line: str, original_error: Exception):
        """
        Args:
            line: 파싱에 실패한 줄
            original_error: 원본 JSON 디코드 예외
        """
        self.line = line
        self.original_error = original_error
```

## 훅 유형

훅 사용에 대한 예제 및 일반적인 패턴을 포함한 포괄적인 가이드는 [훅 가이드](/docs/ko/agent-sdk/hooks)를 참조하세요.

### `HookEvent`

지원되는 훅 이벤트 유형입니다. 설정 제한으로 인해 Python SDK는 SessionStart, SessionEnd 및 Notification 훅을 지원하지 않습니다.

```python
HookEvent = Literal[
    "PreToolUse",      # 도구 실행 전에 호출됨
    "PostToolUse",     # 도구 실행 후에 호출됨
    "UserPromptSubmit", # 사용자가 프롬프트를 제출할 때 호출됨
    "Stop",            # 실행을 중지할 때 호출됨
    "SubagentStop",    # 서브에이전트가 중지될 때 호출됨
    "PreCompact"       # 메시지 압축 전에 호출됨
]
```

### `HookCallback`

훅 콜백 함수의 타입 정의입니다.

```python
HookCallback = Callable[
    [dict[str, Any], str | None, HookContext],
    Awaitable[dict[str, Any]]
]
```

매개변수:

- `input_data`: 훅 특정 입력 데이터 ([훅 가이드](/docs/ko/agent-sdk/hooks#input-data) 참조)
- `tool_use_id`: 선택적 도구 사용 식별자 (도구 관련 훅의 경우)
- `context`: 추가 정보가 포함된 훅 컨텍스트

다음을 포함할 수 있는 딕셔너리를 반환합니다:

- `decision`: 작업을 차단하려면 `"block"`
- `systemMessage`: 트랜스크립트에 추가할 시스템 메시지
- `hookSpecificOutput`: 훅 특정 출력 데이터

### `HookContext`

훅 콜백에 전달되는 컨텍스트 정보입니다.

```python
@dataclass
class HookContext:
    signal: Any | None = None  # 향후: 중단 신호 지원
```

### `HookMatcher`

특정 이벤트 또는 도구에 훅을 일치시키기 위한 구성입니다.

```python
@dataclass
class HookMatcher:
    matcher: str | None = None        # 일치시킬 도구 이름 또는 패턴 (예: "Bash", "Write|Edit")
    hooks: list[HookCallback] = field(default_factory=list)  # 실행할 콜백 목록
    timeout: float | None = None        # 이 매처의 모든 훅에 대한 시간 초과(초 단위) (기본값: 60)
```

### 훅 사용 예제

이 예제는 두 개의 훅을 등록합니다: `rm -rf /`와 같은 위험한 bash 명령을 차단하는 훅과 감사를 위해 모든 도구 사용을 기록하는 훅입니다. 보안 훅은 `matcher`를 통해 Bash 명령에서만 실행되고, 로깅 훅은 모든 도구에서 실행됩니다.

```python
from claude_agent_sdk import query, ClaudeAgentOptions, HookMatcher, HookContext
from typing import Any

async def validate_bash_command(
    input_data: dict[str, Any],
    tool_use_id: str | None,
    context: HookContext
) -> dict[str, Any]:
    """위험한 bash 명령을 검증하고 잠재적으로 차단합니다."""
    if input_data['tool_name'] == 'Bash':
        command = input_data['tool_input'].get('command', '')
        if 'rm -rf /' in command:
            return {
                'hookSpecificOutput': {
                    'hookEventName': 'PreToolUse',
                    'permissionDecision': 'deny',
                    'permissionDecisionReason': 'Dangerous command blocked'
                }
            }
    return {}

async def log_tool_use(
    input_data: dict[str, Any],
    tool_use_id: str | None,
    context: HookContext
) -> dict[str, Any]:
    """감사를 위해 모든 도구 사용을 기록합니다."""
    print(f"Tool used: {input_data.get('tool_name')}")
    return {}

options = ClaudeAgentOptions(
    hooks={
        'PreToolUse': [
            HookMatcher(matcher='Bash', hooks=[validate_bash_command], timeout=120),  # 검증을 위해 2분
            HookMatcher(hooks=[log_tool_use])  # 모든 도구에 적용 (기본 60초 시간 초과)
        ],
        'PostToolUse': [
            HookMatcher(hooks=[log_tool_use])
        ]
    }
)

async for message in query(
    prompt="Analyze this codebase",
    options=options
):
    print(message)
```

## 도구 입력/출력 유형

모든 기본 제공 Claude Code 도구의 입력/출력 스키마 문서입니다. Python SDK는 이들을 타입으로 내보내지 않지만, 메시지의 도구 입력 및 출력 구조를 나타냅니다.

### Task

**도구 이름:** `Task`

**입력:**

```python
{
    "description": str,      # 작업의 짧은 설명 (3-5단어)
    "prompt": str,           # 에이전트가 수행할 작업
    "subagent_type": str     # 사용할 특화된 에이전트의 유형
}
```

**출력:**

```python
{
    "result": str,                    # 서브에이전트의 최종 결과
    "usage": dict | None,             # 토큰 사용 통계
    "total_cost_usd": float | None,  # USD 단위의 총 비용
    "duration_ms": int | None         # 실행 시간(밀리초)
}
```

### Bash

**도구 이름:** `Bash`

**입력:**

```python
{
    "command": str,                  # 실행할 명령
    "timeout": int | None,           # 선택적 시간 초과(밀리초 단위, 최대 600000)
    "description": str | None,       # 명확하고 간결한 설명 (5-10단어)
    "run_in_background": bool | None # 백그라운드에서 실행하려면 true로 설정
}
```

**출력:**

```python
{
    "output": str,              # 표준 출력 및 표준 오류 출력의 조합
    "exitCode": int,            # 명령의 종료 코드
    "killed": bool | None,      # 시간 초과로 인해 명령이 종료되었는지 여부
    "shellId": str | None       # 백그라운드 프로세스의 셸 ID
}
```

### Edit

**도구 이름:** `Edit`

**입력:**

```python
{
    "file_path": str,           # 수정할 파일의 절대 경로
    "old_string": str,          # 바꿀 텍스트
    "new_string": str,          # 바꿀 텍스트
    "replace_all": bool | None  # 모든 항목 바꾸기 (기본값 False)
}
```

**출력:**

```python
{
    "message": str,      # 확인 메시지
    "replacements": int, # 수행된 바꾸기 수
    "file_path": str     # 편집된 파일 경로
}
```

### Read

**도구 이름:** `Read`

**입력:**

```python
{
    "file_path": str,       # 읽을 파일의 절대 경로
    "offset": int | None,   # 읽기를 시작할 줄 번호
    "limit": int | None     # 읽을 줄 수
}
```

**출력 (텍스트 파일):**

```python
{
    "content": str,         # 줄 번호가 있는 파일 내용
    "total_lines": int,     # 파일의 총 줄 수
    "lines_returned": int   # 실제로 반환된 줄 수
}
```

**출력 (이미지):**

```python
{
    "image": str,       # Base64 인코딩된 이미지 데이터
    "mime_type": str,   # 이미지 MIME 타입
    "file_size": int    # 파일 크기(바이트)
}
```

### Write

**도구 이름:** `Write`

**입력:**

```python
{
    "file_path": str,  # 쓸 파일의 절대 경로
    "content": str     # 파일에 쓸 내용
}
```

**출력:**

```python
{
    "message": str,        # 성공 메시지
    "bytes_written": int,  # 쓴 바이트 수
    "file_path": str       # 쓴 파일 경로
}
```

### Glob

**도구 이름:** `Glob`

**입력:**

```python
{
    "pattern": str,       # 파일과 일치시킬 glob 패턴
    "path": str | None    # 검색할 디렉토리 (기본값: cwd)
}
```

**출력:**

```python
{
    "matches": list[str],  # 일치하는 파일 경로 배열
    "count": int,          # 찾은 일치 수
    "search_path": str     # 사용된 검색 디렉토리
}
```

### Grep

**도구 이름:** `Grep`

**입력:**

```python
{
    "pattern": str,                    # 정규식 패턴
    "path": str | None,                # 검색할 파일 또는 디렉토리
    "glob": str | None,                # 파일을 필터링할 glob 패턴
    "type": str | None,                # 검색할 파일 유형
    "output_mode": str | None,         # "content", "files_with_matches" 또는 "count"
    "-i": bool | None,                 # 대소문자 구분 없는 검색
    "-n": bool | None,                 # 줄 번호 표시
    "-B": int | None,                  # 각 일치 전에 표시할 줄
    "-A": int | None,                  # 각 일치 후에 표시할 줄
    "-C": int | None,                  # 전후에 표시할 줄
    "head_limit": int | None,          # 출력을 처음 N개 줄/항목으로 제한
    "multiline": bool | None           # 다중 줄 모드 활성화
}
```

**출력 (콘텐츠 모드):**

```python
{
    "matches": [
        {
            "file": str,
            "line_number": int | None,
            "line": str,
            "before_context": list[str] | None,
            "after_context": list[str] | None
        }
    ],
    "total_matches": int
}
```

**출력 (files_with_matches 모드):**

```python
{
    "files": list[str],  # 일치를 포함하는 파일
    "count": int         # 일치를 포함하는 파일 수
}
```

### NotebookEdit

**도구 이름:** `NotebookEdit`

**입력:**

```python
{
    "notebook_path": str,                     # Jupyter 노트북의 절대 경로
    "cell_id": str | None,                    # 편집할 셀의 ID
    "new_source": str,                        # 셀의 새로운 소스
    "cell_type": "code" | "markdown" | None,  # 셀의 유형
    "edit_mode": "replace" | "insert" | "delete" | None  # 편집 작업 유형
}
```

**출력:**

```python
{
    "message": str,                              # 성공 메시지
    "edit_type": "replaced" | "inserted" | "deleted",  # 수행된 편집 유형
    "cell_id": str | None,                       # 영향을 받은 셀 ID
    "total_cells": int                           # 편집 후 노트북의 총 셀 수
}
```

### WebFetch

**도구 이름:** `WebFetch`

**입력:**

```python
{
    "url": str,     # 콘텐츠를 가져올 URL
    "prompt": str   # 가져온 콘텐츠에서 실행할 프롬프트
}
```

**출력:**

```python
{
    "response": str,           # 프롬프트에 대한 AI 모델의 응답
    "url": str,                # 가져온 URL
    "final_url": str | None,   # 리디렉션 후 최종 URL
    "status_code": int | None  # HTTP 상태 코드
}
```

### WebSearch

**도구 이름:** `WebSearch`

**입력:**

```python
{
    "query": str,                        # 사용할 검색 쿼리
    "allowed_domains": list[str] | None, # 이 도메인의 결과만 포함
    "blocked_domains": list[str] | None  # 이 도메인의 결과는 절대 포함하지 않음
}
```

**출력:**

```python
{
    "results": [
        {
            "title": str,
            "url": str,
            "snippet": str,
            "metadata": dict | None
        }
    ],
    "total_results": int,
    "query": str
}
```

### TodoWrite

**도구 이름:** `TodoWrite`

**입력:**

```python
{
    "todos": [
        {
            "content": str,                              # 작업 설명
            "status": "pending" | "in_progress" | "completed",  # 작업 상태
            "activeForm": str                            # 설명의 활성 형식
        }
    ]
}
```

**출력:**

```python
{
    "message": str,  # 성공 메시지
    "stats": {
        "total": int,
        "pending": int,
        "in_progress": int,
        "completed": int
    }
}
```

### BashOutput

**도구 이름:** `BashOutput`

**입력:**

```python
{
    "bash_id": str,       # 백그라운드 셸의 ID
    "filter": str | None  # 출력 줄을 필터링할 선택적 정규식
}
```

**출력:**

```python
{
    "output": str,                                      # 마지막 확인 이후의 새로운 출력
    "status": "running" | "completed" | "failed",       # 현재 셸 상태
    "exitCode": int | None                              # 완료 시 종료 코드
}
```

### KillBash

**도구 이름:** `KillBash`

**입력:**

```python
{
    "shell_id": str  # 종료할 백그라운드 셸의 ID
}
```

**출력:**

```python
{
    "message": str,  # 성공 메시지
    "shell_id": str  # 종료된 셸의 ID
}
```

### ExitPlanMode

**도구 이름:** `ExitPlanMode`

**입력:**

```python
{
    "plan": str  # 사용자 승인을 위해 실행할 계획
}
```

**출력:**

```python
{
    "message": str,          # 확인 메시지
    "approved": bool | None  # 사용자가 계획을 승인했는지 여부
}
```

### ListMcpResources

**도구 이름:** `ListMcpResources`

**입력:**

```python
{
    "server": str | None  # 리소스를 필터링할 선택적 서버 이름
}
```

**출력:**

```python
{
    "resources": [
        {
            "uri": str,
            "name": str,
            "description": str | None,
            "mimeType": str | None,
            "server": str
        }
    ],
    "total": int
}
```

### ReadMcpResource

**도구 이름:** `ReadMcpResource`

**입력:**

```python
{
    "server": str,  # MCP 서버 이름
    "uri": str      # 읽을 리소스 URI
}
```

**출력:**

```python
{
    "contents": [
        {
            "uri": str,
            "mimeType": str | None,
            "text": str | None,
            "blob": str | None
        }
    ],
    "server": str
}
```

## ClaudeSDKClient를 사용한 고급 기능

### 지속적인 대화 인터페이스 구축

```python
from claude_agent_sdk import ClaudeSDKClient, ClaudeAgentOptions, AssistantMessage, TextBlock
import asyncio

class ConversationSession:
    """Claude와의 단일 대화 세션을 유지합니다."""

    def __init__(self, options: ClaudeAgentOptions = None):
        self.client = ClaudeSDKClient(options)
        self.turn_count = 0

    async def start(self):
        await self.client.connect()
        print("Starting conversation session. Claude will remember context.")
        print("Commands: 'exit' to quit, 'interrupt' to stop current task, 'new' for new session")

        while True:
            user_input = input(f"\n[Turn {self.turn_count + 1}] You: ")

            if user_input.lower() == 'exit':
                break
            elif user_input.lower() == 'interrupt':
                await self.client.interrupt()
                print("Task interrupted!")
                continue
            elif user_input.lower() == 'new':
                # 새로운 세션을 위해 연결 해제 및 재연결
                await self.client.disconnect()
                await self.client.connect()
                self.turn_count = 0
                print("Started new conversation session (previous context cleared)")
                continue

            # 메시지 전송 - Claude는 이 세션의 모든 이전 메시지를 기억합니다
            await self.client.query(user_input)
            self.turn_count += 1

            # 응답 처리
            print(f"[Turn {self.turn_count}] Claude: ", end="")
            async for message in self.client.receive_response():
                if isinstance(message, AssistantMessage):
                    for block in message.content:
                        if isinstance(block, TextBlock):
                            print(block.text, end="")
            print()  # 응답 후 새 줄

        await self.client.disconnect()
        print(f"Conversation ended after {self.turn_count} turns.")

async def main():
    options = ClaudeAgentOptions(
        allowed_tools=["Read", "Write", "Bash"],
        permission_mode="acceptEdits"
    )
    session = ConversationSession(options)
    await session.start()

# 예제 대화:
# Turn 1 - You: "Create a file called hello.py"
# Turn 1 - Claude: "I'll create a hello.py file for you..."
# Turn 2 - You: "What's in that file?"
# Turn 2 - Claude: "The hello.py file I just created contains..." (기억합니다!)
# Turn 3 - You: "Add a main function to it"
# Turn 3 - Claude: "I'll add a main function to hello.py..." (어느 파일인지 알고 있습니다!)

asyncio.run(main())
```

### 동작 수정을 위해 훅 사용

```python
from claude_agent_sdk import (
    ClaudeSDKClient,
    ClaudeAgentOptions,
    HookMatcher,
    HookContext
)
import asyncio
from typing import Any

async def pre_tool_logger(
    input_data: dict[str, Any],
    tool_use_id: str | None,
    context: HookContext
) -> dict[str, Any]:
    """실행 전에 모든 도구 사용을 기록합니다."""
    tool_name = input_data.get('tool_name', 'unknown')
    print(f"[PRE-TOOL] About to use: {tool_name}")

    # 여기서 도구 실행을 수정하거나 차단할 수 있습니다
    if tool_name == "Bash" and "rm -rf" in str(input_data.get('tool_input', {})):
        return {
            'hookSpecificOutput': {
                'hookEventName': 'PreToolUse',
                'permissionDecision': 'deny',
                'permissionDecisionReason': 'Dangerous command blocked'
            }
        }
    return {}

async def post_tool_logger(
    input_data: dict[str, Any],
    tool_use_id: str | None,
    context: HookContext
) -> dict[str, Any]:
    """도구 실행 후 결과를 기록합니다."""
    tool_name = input_data.get('tool_name', 'unknown')
    print(f"[POST-TOOL] Completed: {tool_name}")
    return {}

async def user_prompt_modifier(
    input_data: dict[str, Any],
    tool_use_id: str | None,
    context: HookContext
) -> dict[str, Any]:
    """사용자 프롬프트에 컨텍스트를 추가합니다."""
    original_prompt = input_data.get('prompt', '')

    # 모든 프롬프트에 타임스탬프 추가
    from datetime import datetime
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    return {
        'hookSpecificOutput': {
            'hookEventName': 'UserPromptSubmit',
            'updatedPrompt': f"[{timestamp}] {original_prompt}"
        }
    }

async def main():
    options = ClaudeAgentOptions(
        hooks={
            'PreToolUse': [
                HookMatcher(hooks=[pre_tool_logger]),
                HookMatcher(matcher='Bash', hooks=[pre_tool_logger])
            ],
            'PostToolUse': [
                HookMatcher(hooks=[post_tool_logger])
            ],
            'UserPromptSubmit': [
                HookMatcher(hooks=[user_prompt_modifier])
            ]
        },
        allowed_tools=["Read", "Write", "Bash"]
    )

    async with ClaudeSDKClient(options=options) as client:
        await client.query("List files in current directory")

        async for message in client.receive_response():
            # 훅이 도구 사용을 자동으로 기록합니다
            pass

asyncio.run(main())
```

### 실시간 진행 상황 모니터링

```python
from claude_agent_sdk import (
    ClaudeSDKClient,
    ClaudeAgentOptions,
    AssistantMessage,
    ToolUseBlock,
    ToolResultBlock,
    TextBlock
)
import asyncio

async def monitor_progress():
    options = ClaudeAgentOptions(
        allowed_tools=["Write", "Bash"],
        permission_mode="acceptEdits"
    )

    async with ClaudeSDKClient(options=options) as client:
        await client.query(
            "Create 5 Python files with different sorting algorithms"
        )

        # 실시간으로 진행 상황 모니터링
        files_created = []
        async for message in client.receive_messages():
            if isinstance(message, AssistantMessage):
                for block in message.content:
                    if isinstance(block, ToolUseBlock):
                        if block.name == "Write":
                            file_path = block.input.get("file_path", "")
                            print(f"🔨 Creating: {file_path}")
                    elif isinstance(block, ToolResultBlock):
                        print(f"✅ Completed tool execution")
                    elif isinstance(block, TextBlock):
                        print(f"💭 Claude says: {block.text[:100]}...")

            # 최종 결과를 받았는지 확인
            if hasattr(message, 'subtype') and message.subtype in ['success', 'error']:
                print(f"\n🎯 Task completed!")
                break

asyncio.run(monitor_progress())
```

## 사용 예제

### 기본 파일 작업 (query 사용)

```python
from claude_agent_sdk import query, ClaudeAgentOptions, AssistantMessage, ToolUseBlock
import asyncio

async def create_project():
    options = ClaudeAgentOptions(
        allowed_tools=["Read", "Write", "Bash"],
        permission_mode='acceptEdits',
        cwd="/home/user/project"
    )

    async for message in query(
        prompt="Create a Python project structure with setup.py",
        options=options
    ):
        if isinstance(message, AssistantMessage):
            for block in message.content:
                if isinstance(block, ToolUseBlock):
                    print(f"Using tool: {block.name}")

asyncio.run(create_project())
```

### 오류 처리

```python
from claude_agent_sdk import (
    query,
    CLINotFoundError,
    ProcessError,
    CLIJSONDecodeError
)

try:
    async for message in query(prompt="Hello"):
        print(message)
except CLINotFoundError:
    print("Please install Claude Code: npm install -g @anthropic-ai/claude-code")
except ProcessError as e:
    print(f"Process failed with exit code: {e.exit_code}")
except CLIJSONDecodeError as e:
    print(f"Failed to parse response: {e}")
```

### 클라이언트를 사용한 스트리밍 모드

```python
from claude_agent_sdk import ClaudeSDKClient
import asyncio

async def interactive_session():
    async with ClaudeSDKClient() as client:
        # 초기 메시지 전송
        await client.query("What's the weather like?")

        # 응답 처리
        async for msg in client.receive_response():
            print(msg)

        # 후속 메시지 전송
        await client.query("Tell me more about that")

        # 후속 응답 처리
        async for msg in client.receive_response():
            print(msg)

asyncio.run(interactive_session())
```

### ClaudeSDKClient를 사용한 사용자 정의 도구

```python
from claude_agent_sdk import (
    ClaudeSDKClient,
    ClaudeAgentOptions,
    tool,
    create_sdk_mcp_server,
    AssistantMessage,
    TextBlock
)
import asyncio
from typing import Any

# @tool 데코레이터로 사용자 정의 도구 정의
@tool("calculate", "Perform mathematical calculations", {"expression": str})
async def calculate(args: dict[str, Any]) -> dict[str, Any]:
    try:
        result = eval(args["expression"], {"__builtins__": {}})
        return {
            "content": [{
                "type": "text",
                "text": f"Result: {result}"
            }]
        }
    except Exception as e:
        return {
            "content": [{
                "type": "text",
                "text": f"Error: {str(e)}"
            }],
            "is_error": True
        }

@tool("get_time", "Get current time", {})
async def get_time(args: dict[str, Any]) -> dict[str, Any]:
    from datetime import datetime
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    return {
        "content": [{
            "type": "text",
            "text": f"Current time: {current_time}"
        }]
    }

async def main():
    # 사용자 정의 도구를 사용하여 SDK MCP 서버 생성
    my_server = create_sdk_mcp_server(
        name="utilities",
        version="1.0.0",
        tools=[calculate, get_time]
    )

    # 서버를 사용하여 옵션 구성
    options = ClaudeAgentOptions(
        mcp_servers={"utils": my_server},
        allowed_tools=[
            "mcp__utils__calculate",
            "mcp__utils__get_time"
        ]
    )

    # 대화형 도구 사용을 위해 ClaudeSDKClient 사용
    async with ClaudeSDKClient(options=options) as client:
        await client.query("What's 123 * 456?")

        # 계산 응답 처리
        async for message in client.receive_response():
            if isinstance(message, AssistantMessage):
                for block in message.content:
                    if isinstance(block, TextBlock):
                        print(f"Calculation: {block.text}")

        # 시간 쿼리로 후속 처리
        await client.query("What time is it now?")

        async for message in client.receive_response():
            if isinstance(message, AssistantMessage):
                for block in message.content:
                    if isinstance(block, TextBlock):
                        print(f"Time: {block.text}")

asyncio.run(main())
```

## 샌드박스 구성

### `SandboxSettings`

샌드박스 동작에 대한 구성입니다. 이를 사용하여 명령 샌드박싱을 활성화하고 네트워크 제한을 프로그래밍 방식으로 구성합니다.

```python
class SandboxSettings(TypedDict, total=False):
    enabled: bool
    autoAllowBashIfSandboxed: bool
    excludedCommands: list[str]
    allowUnsandboxedCommands: bool
    network: SandboxNetworkConfig
    ignoreViolations: SandboxIgnoreViolations
    enableWeakerNestedSandbox: bool
```

| 속성 | 타입 | 기본값 | 설명 |
| :------- | :--- | :------ | :---------- |
| `enabled` | `bool` | `False` | 명령 실행을 위한 샌드박스 모드 활성화 |
| `autoAllowBashIfSandboxed` | `bool` | `False` | 샌드박스가 활성화되면 bash 명령 자동 승인 |
| `excludedCommands` | `list[str]` | `[]` | 항상 샌드박스 제한을 우회하는 명령 (예: `["docker"]`). 이들은 모델 개입 없이 자동으로 샌드박스되지 않은 상태로 실행됩니다 |
| `allowUnsandboxedCommands` | `bool` | `False` | 모델이 샌드박스 외부에서 명령을 실행하도록 요청할 수 있도록 허용합니다. `True`일 때, 모델은 도구 입력에서 `dangerouslyDisableSandbox`를 설정할 수 있으며, 이는 [권한 시스템](#permissions-fallback-for-unsandboxed-commands)으로 폴백됩니다 |
| `network` | [`SandboxNetworkConfig`](#sandboxnetworkconfig) | `None` | 네트워크 특정 샌드박스 구성 |
| `ignoreViolations` | [`SandboxIgnoreViolations`](#sandboxignoreviolations) | `None` | 무시할 샌드박스 위반 구성 |
| `enableWeakerNestedSandbox` | `bool` | `False` | 호환성을 위해 더 약한 중첩 샌드박스 활성화 |

<Note>
**파일 시스템 및 네트워크 액세스 제한**은 샌드박스 설정을 통해 구성되지 않습니다. 대신 [권한 규칙](https://code.claude.com/docs/en/settings#permission-settings)에서 파생됩니다:

- **파일 시스템 읽기 제한**: 읽기 거부 규칙
- **파일 시스템 쓰기 제한**: 편집 허용/거부 규칙
- **네트워크 제한**: WebFetch 허용/거부 규칙

명령 실행 샌드박싱을 위해 샌드박스 설정을 사용하고, 파일 시스템 및 네트워크 액세스 제어를 위해 권한 규칙을 사용합니다.
</Note>

#### 사용 예제

```python
from claude_agent_sdk import query, ClaudeAgentOptions, SandboxSettings

sandbox_settings: SandboxSettings = {
    "enabled": True,
    "autoAllowBashIfSandboxed": True,
    "excludedCommands": ["docker"],
    "network": {
        "allowLocalBinding": True,
        "allowUnixSockets": ["/var/run/docker.sock"]
    }
}

async for message in query(
    prompt="Build and test my project",
    options=ClaudeAgentOptions(sandbox=sandbox_settings)
):
    print(message)
```

### `SandboxNetworkConfig`

샌드박스 모드에 대한 네트워크 특정 구성입니다.

```python
class SandboxNetworkConfig(TypedDict, total=False):
    allowLocalBinding: bool
    allowUnixSockets: list[str]
    allowAllUnixSockets: bool
    httpProxyPort: int
    socksProxyPort: int
```

| 속성 | 타입 | 기본값 | 설명 |
| :------- | :--- | :------ | :---------- |
| `allowLocalBinding` | `bool` | `False` | 프로세스가 로컬 포트에 바인딩하도록 허용 (예: 개발 서버의 경우) |
| `allowUnixSockets` | `list[str]` | `[]` | 프로세스가 액세스할 수 있는 Unix 소켓 경로 (예: Docker 소켓) |
| `allowAllUnixSockets` | `bool` | `False` | 모든 Unix 소켓에 대한 액세스 허용 |
| `httpProxyPort` | `int` | `None` | 네트워크 요청을 위한 HTTP 프록시 포트 |
| `socksProxyPort` | `int` | `None` | 네트워크 요청을 위한 SOCKS 프록시 포트 |

### `SandboxIgnoreViolations`

특정 샌드박스 위반을 무시하기 위한 구성입니다.

```python
class SandboxIgnoreViolations(TypedDict, total=False):
    file: list[str]
    network: list[str]
```

| 속성 | 타입 | 기본값 | 설명 |
| :------- | :--- | :------ | :---------- |
| `file` | `list[str]` | `[]` | 위반을 무시할 파일 경로 패턴 |
| `network` | `list[str]` | `[]` | 위반을 무시할 네트워크 패턴 |

### 샌드박스되지 않은 명령에 대한 권한 폴백

`allowUnsandboxedCommands`가 활성화되면, 모델은 도구 입력에서 `dangerouslyDisableSandbox: True`를 설정하여 샌드박스 외부에서 명령을 실행하도록 요청할 수 있습니다. 이러한 요청은 기존 권한 시스템으로 폴백되므로, `can_use_tool` 핸들러가 호출되어 사용자 정의 인증 로직을 구현할 수 있습니다.

<Note>
**`excludedCommands` vs `allowUnsandboxedCommands`:**
- `excludedCommands`: 항상 자동으로 샌드박스를 우회하는 명령의 정적 목록 (예: `["docker"]`). 모델이 이를 제어할 수 없습니다.
- `allowUnsandboxedCommands`: 모델이 도구 입력에서 `dangerouslyDisableSandbox: True`를 설정하여 런타임에 샌드박스되지 않은 실행을 요청하도록 허용합니다.
</Note>

```python
from claude_agent_sdk import query, ClaudeAgentOptions

async def can_use_tool(tool: str, input: dict) -> bool:
    # 모델이 샌드박스를 우회하도록 요청하는지 확인
    if tool == "Bash" and input.get("dangerouslyDisableSandbox"):
        # 모델이 샌드박스 외부에서 이 명령을 실행하기를 원합니다
        print(f"Unsandboxed command requested: {input.get('command')}")

        # 허용하려면 True, 거부하려면 False 반환
        return is_command_authorized(input.get("command"))
    return True

async def main():
    async for message in query(
        prompt="Deploy my application",
        options=ClaudeAgentOptions(
            sandbox={
                "enabled": True,
                "allowUnsandboxedCommands": True  # 모델이 샌드박스되지 않은 실행을 요청할 수 있음
            },
            permission_mode="default",
            can_use_tool=can_use_tool
        )
    ):
        print(message)
```

이 패턴을 통해 다음을 수행할 수 있습니다:

- **모델 요청 감사**: 모델이 샌드박스되지 않은 실행을 요청할 때 기록
- **허용 목록 구현**: 특정 명령만 샌드박스되지 않은 상태로 실행하도록 허용
- **승인 워크플로우 추가**: 권한 있는 작업에 대해 명시적 인증 필요

<Warning>
`dangerouslyDisableSandbox: True`로 실행되는 명령은 전체 시스템 액세스 권한이 있습니다. `can_use_tool` 핸들러가 이러한 요청을 신중하게 검증하는지 확인하세요.
</Warning>

## 참고 항목

- [Python SDK 가이드](/docs/ko/agent-sdk/python) - 튜토리얼 및 예제
- [SDK 개요](/docs/ko/agent-sdk/overview) - 일반 SDK 개념
- [TypeScript SDK 참조](/docs/ko/agent-sdk/typescript) - TypeScript SDK 문서
- [CLI 참조](https://code.claude.com/docs/en/cli-reference) - 명령줄 인터페이스
- [일반적인 워크플로우](https://code.claude.com/docs/en/common-workflows) - 단계별 가이드