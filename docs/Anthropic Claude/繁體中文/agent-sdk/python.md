# Agent SDK 參考 - Python

Python Agent SDK 的完整 API 參考，包括所有函數、類型和類別。

---

## 安裝

```bash
pip install claude-agent-sdk
```

## 在 `query()` 和 `ClaudeSDKClient` 之間選擇

Python SDK 提供了兩種與 Claude Code 互動的方式：

### 快速比較

| 功能             | `query()`                     | `ClaudeSDKClient`                  |
| :------------------ | :---------------------------- | :--------------------------------- |
| **會話**         | 每次建立新會話 | 重複使用相同會話                |
| **對話**    | 單次交換               | 同一上下文中的多次交換 |
| **連接**      | 自動管理         | 手動控制                     |
| **串流輸入** | ✅ 支援                  | ✅ 支援                       |
| **中斷**      | ❌ 不支援              | ✅ 支援                       |
| **鉤子**           | ❌ 不支援              | ✅ 支援                       |
| **自訂工具**    | ❌ 不支援              | ✅ 支援                       |
| **繼續聊天**   | ❌ 每次新會話      | ✅ 維持對話          |
| **使用案例**        | 一次性任務                 | 持續對話           |

### 何時使用 `query()`（每次新會話）

**最適合：**

- 一次性問題，不需要對話歷史
- 不需要先前交換上下文的獨立任務
- 簡單的自動化指令碼
- 當您想每次都重新開始時

### 何時使用 `ClaudeSDKClient`（持續對話）

**最適合：**

- **繼續對話** - 當您需要 Claude 記住上下文時
- **後續問題** - 基於先前的回應進行構建
- **互動式應用程式** - 聊天介面、REPL
- **回應驅動的邏輯** - 當下一個動作取決於 Claude 的回應時
- **會話控制** - 明確管理對話生命週期

## 函數

### `query()`

為每次與 Claude Code 的互動建立新會話。返回一個非同步迭代器，在消息到達時產生消息。每次呼叫 `query()` 都會重新開始，不記得先前的互動。

```python
async def query(
    *,
    prompt: str | AsyncIterable[dict[str, Any]],
    options: ClaudeAgentOptions | None = None
) -> AsyncIterator[Message]
```

#### 參數

| 參數 | 類型                         | 描述                                                                |
| :-------- | :--------------------------- | :------------------------------------------------------------------------- |
| `prompt`  | `str \| AsyncIterable[dict]` | 輸入提示，可以是字串或用於串流模式的非同步可迭代物件          |
| `options` | `ClaudeAgentOptions \| None` | 可選的配置物件（如果為 None，預設為 `ClaudeAgentOptions()`） |

#### 返回

返回一個 `AsyncIterator[Message]`，從對話中產生消息。

#### 範例 - 使用選項

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

用於定義具有類型安全的 MCP 工具的裝飾器。

```python
def tool(
    name: str,
    description: str,
    input_schema: type | dict[str, Any]
) -> Callable[[Callable[[Any], Awaitable[dict[str, Any]]]], SdkMcpTool[Any]]
```

#### 參數

| 參數      | 類型                     | 描述                                             |
| :------------- | :----------------------- | :------------------------------------------------------ |
| `name`         | `str`                    | 工具的唯一識別碼                          |
| `description`  | `str`                    | 工具功能的人類可讀描述        |
| `input_schema` | `type \| dict[str, Any]` | 定義工具輸入參數的架構（見下文） |

#### 輸入架構選項

1. **簡單類型對應**（推薦）：

   ```python
   {"text": str, "count": int, "enabled": bool}
   ```

2. **JSON Schema 格式**（用於複雜驗證）：
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

#### 返回

一個裝飾器函數，包裝工具實現並返回一個 `SdkMcpTool` 實例。

#### 範例

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

建立在 Python 應用程式內執行的進程內 MCP 伺服器。

```python
def create_sdk_mcp_server(
    name: str,
    version: str = "1.0.0",
    tools: list[SdkMcpTool[Any]] | None = None
) -> McpSdkServerConfig
```

#### 參數

| 參數 | 類型                            | 預設   | 描述                                           |
| :-------- | :------------------------------ | :-------- | :---------------------------------------------------- |
| `name`    | `str`                           | -         | 伺服器的唯一識別碼                      |
| `version` | `str`                           | `"1.0.0"` | 伺服器版本字串                                 |
| `tools`   | `list[SdkMcpTool[Any]] \| None` | `None`    | 使用 `@tool` 裝飾器建立的工具函數清單 |

#### 返回

返回一個 `McpSdkServerConfig` 物件，可以傳遞給 `ClaudeAgentOptions.mcp_servers`。

#### 範例

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

## 類別

### `ClaudeSDKClient`

**在多次交換中維持對話會話。** 這是 TypeScript SDK 的 `query()` 函數內部工作方式的 Python 等效物 - 它建立一個可以繼續對話的客戶端物件。

#### 主要功能

- **會話連續性**：在多個 `query()` 呼叫中維持對話上下文
- **相同對話**：Claude 記得會話中的先前消息
- **中斷支援**：可以在執行中停止 Claude
- **明確的生命週期**：您控制會話何時開始和結束
- **回應驅動的流程**：可以對回應做出反應並發送後續消息
- **自訂工具和鉤子**：支援自訂工具（使用 `@tool` 裝飾器建立）和鉤子

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

#### 方法

| 方法                      | 描述                                                         |
| :-------------------------- | :------------------------------------------------------------------ |
| `__init__(options)`         | 使用可選配置初始化客戶端                   |
| `connect(prompt)`           | 使用可選的初始提示或消息串流連接到 Claude |
| `query(prompt, session_id)` | 以串流模式發送新請求                                |
| `receive_messages()`        | 以非同步迭代器的形式接收來自 Claude 的所有消息               |
| `receive_response()`        | 接收消息直到並包括 ResultMessage                |
| `interrupt()`               | 發送中斷信號（僅在串流模式下工作）                |
| `disconnect()`              | 從 Claude 斷開連接                                              |

#### 上下文管理器支援

客戶端可以用作非同步上下文管理器以進行自動連接管理：

```python
async with ClaudeSDKClient() as client:
    await client.query("Hello Claude")
    async for message in client.receive_response():
        print(message)
```

> **重要：** 在迭代消息時，避免使用 `break` 提前退出，因為這可能會導致 asyncio 清理問題。相反，讓迭代自然完成或使用標誌來追蹤何時找到所需內容。

#### 範例 - 繼續對話

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

#### 範例 - 使用 ClaudeSDKClient 進行串流輸入

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

#### 範例 - 使用中斷

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

#### 範例 - 進階權限控制

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

## 類型

### `SdkMcpTool`

使用 `@tool` 裝飾器建立的 SDK MCP 工具的定義。

```python
@dataclass
class SdkMcpTool(Generic[T]):
    name: str
    description: str
    input_schema: type[T] | dict[str, Any]
    handler: Callable[[T], Awaitable[dict[str, Any]]]
```

| 屬性       | 類型                                       | 描述                                |
| :------------- | :----------------------------------------- | :----------------------------------------- |
| `name`         | `str`                                      | 工具的唯一識別碼             |
| `description`  | `str`                                      | 人類可讀的描述                 |
| `input_schema` | `type[T] \| dict[str, Any]`                | 輸入驗證的架構                |
| `handler`      | `Callable[[T], Awaitable[dict[str, Any]]]` | 處理工具執行的非同步函數 |

### `ClaudeAgentOptions`

Claude Code 查詢的配置資料類別。

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

| 屬性                      | 類型                                         | 預設              | 描述                                                                                                                                                                             |
| :---------------------------- | :------------------------------------------- | :------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `allowed_tools`               | `list[str]`                                  | `[]`                 | 允許的工具名稱清單                                                                                                                                                              |
| `system_prompt`               | `str \| SystemPromptPreset \| None`          | `None`               | 系統提示配置。傳遞字串以取得自訂提示，或使用 `{"type": "preset", "preset": "claude_code"}` 以取得 Claude Code 的系統提示。新增 `"append"` 以擴展預設值 |
| `mcp_servers`                 | `dict[str, McpServerConfig] \| str \| Path`  | `{}`                 | MCP 伺服器配置或配置檔案的路徑                                                                                                                                        |
| `permission_mode`             | `PermissionMode \| None`                     | `None`               | 工具使用的權限模式                                                                                                                                                          |
| `continue_conversation`       | `bool`                                       | `False`              | 繼續最近的對話                                                                                                                                                   |
| `resume`                      | `str \| None`                                | `None`               | 要繼續的會話 ID                                                                                                                                                                    |
| `max_turns`                   | `int \| None`                                | `None`               | 最大對話輪數                                                                                                                                                              |
| `disallowed_tools`            | `list[str]`                                  | `[]`                 | 不允許的工具名稱清單                                                                                                                                                           |
| `model`                       | `str \| None`                                | `None`               | 要使用的 Claude 模型                                                                                                                                                                     |
| `output_format`               | [`OutputFormat`](#outputformat) ` \| None`   | `None`               | 定義代理結果的輸出格式。詳見 [結構化輸出](/docs/zh-TW/agent-sdk/structured-outputs)                                                                    |
| `permission_prompt_tool_name` | `str \| None`                                | `None`               | 權限提示的 MCP 工具名稱                                                                                                                                                    |
| `cwd`                         | `str \| Path \| None`                        | `None`               | 目前工作目錄                                                                                                                                                               |
| `settings`                    | `str \| None`                                | `None`               | 設定檔案的路徑                                                                                                                                                                   |
| `add_dirs`                    | `list[str \| Path]`                          | `[]`                 | Claude 可以存取的其他目錄                                                                                                                                                |
| `env`                         | `dict[str, str]`                             | `{}`                 | 環境變數                                                                                                                                                                   |
| `extra_args`                  | `dict[str, str \| None]`                     | `{}`                 | 要直接傳遞給 CLI 的其他 CLI 引數                                                                                                                    |
| `max_buffer_size`             | `int \| None`                                | `None`               | 緩衝 CLI stdout 時的最大位元組數                                                                                                                                                 |
| `debug_stderr`                | `Any`                                        | `sys.stderr`         | _已棄用_ - 用於偵錯輸出的類似檔案的物件。改用 `stderr` 回呼                                                                                                         |
| `stderr`                      | `Callable[[str], None] \| None`              | `None`               | CLI 標準錯誤輸出的回呼函數                                                                                                                            |
| `can_use_tool`                | `CanUseTool \| None`                         | `None`               | 工具權限回呼函數                                                                                                                                                       |
| `hooks`                       | `dict[HookEvent, list[HookMatcher]] \| None` | `None`               | 用於攔截事件的鉤子配置                                                                                                                                             |
| `user`                        | `str \| None`                                | `None`               | 使用者識別碼                                                                                                                                                                         |
| `include_partial_messages`    | `bool`                                       | `False`              | 包括部分消息串流事件                                                                                                                                                |
| `fork_session`                | `bool`                                       | `False`              | 使用 `resume` 繼續時，分支到新的會話 ID 而不是繼續原始會話                                                                                        |
| `agents`                      | `dict[str, AgentDefinition] \| None`         | `None`               | 以程式設計方式定義的子代理                                                                                                                                      |
| `plugins`                     | `list[SdkPluginConfig]`                      | `[]`                 | 從本機路徑載入自訂外掛程式。詳見 [外掛程式](/docs/zh-TW/agent-sdk/plugins)                                                                             |
| `sandbox`                     | [`SandboxSettings`](#sandboxsettings) ` \| None` | `None`              | 以程式設計方式配置沙箱行為。詳見 [沙箱設定](#sandboxsettings)                                        |
| `setting_sources`             | `list[SettingSource] \| None`                | `None`（無設定） | 控制要載入哪些檔案系統設定。省略時，不載入任何設定。**注意：** 必須包括 `"project"` 以載入 CLAUDE.md 檔案                                             |

### `OutputFormat`

結構化輸出驗證的配置。

```python
class OutputFormat(TypedDict):
    type: Literal["json_schema"]
    schema: dict[str, Any]
```

| 欄位    | 必需 | 描述                                    |
| :------- | :------- | :--------------------------------------------- |
| `type`   | 是      | 必須為 `"json_schema"` 以進行 JSON Schema 驗證 |
| `schema` | 是      | 輸出驗證的 JSON Schema 定義   |

### `SystemPromptPreset`

使用 Claude Code 的預設系統提示（可選新增）的配置。

```python
class SystemPromptPreset(TypedDict):
    type: Literal["preset"]
    preset: Literal["claude_code"]
    append: NotRequired[str]
```

| 欄位    | 必需 | 描述                                                   |
| :------- | :------- | :------------------------------------------------------------ |
| `type`   | 是      | 必須為 `"preset"` 以使用預設系統提示              |
| `preset` | 是      | 必須為 `"claude_code"` 以使用 Claude Code 的系統提示    |
| `append` | 否       | 要附加到預設系統提示的其他指示 |

### `SettingSource`

控制 SDK 從哪些檔案系統配置源載入設定。

```python
SettingSource = Literal["user", "project", "local"]
```

| 值       | 描述                                  | 位置                      |
| :---------- | :------------------------------------------- | :---------------------------- |
| `"user"`    | 全域使用者設定                         | `~/.claude/settings.json`     |
| `"project"` | 共用專案設定（版本控制）       | `.claude/settings.json`       |
| `"local"`   | 本機專案設定（gitignored）          | `.claude/settings.local.json` |

#### 預設行為

當 `setting_sources` **省略**或**為 `None`** 時，SDK **不會**載入任何檔案系統設定。這為 SDK 應用程式提供了隔離。

#### 為什麼使用 setting_sources？

**載入所有檔案系統設定（舊版行為）：**

```python
# Load all settings like SDK v0.0.x did
from claude_agent_sdk import query, ClaudeAgentOptions

async for message in query(
    prompt="Analyze this code",
    options=ClaudeAgentOptions(
        setting_sources=["user", "project", "local"]  # Load all settings
    )
):
    print(message)
```

**僅載入特定設定源：**

```python
# Load only project settings, ignore user and local
async for message in query(
    prompt="Run CI checks",
    options=ClaudeAgentOptions(
        setting_sources=["project"]  # Only .claude/settings.json
    )
):
    print(message)
```

**測試和 CI 環境：**

```python
# Ensure consistent behavior in CI by excluding local settings
async for message in query(
    prompt="Run tests",
    options=ClaudeAgentOptions(
        setting_sources=["project"],  # Only team-shared settings
        permission_mode="bypassPermissions"
    )
):
    print(message)
```

**僅限 SDK 的應用程式：**

```python
# Define everything programmatically (default behavior)
# No filesystem dependencies - setting_sources defaults to None
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

**載入 CLAUDE.md 專案指示：**

```python
# Load project settings to include CLAUDE.md files
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

#### 設定優先順序

載入多個源時，設定會按此優先順序（從高到低）合併：

1. 本機設定（`.claude/settings.local.json`）
2. 專案設定（`.claude/settings.json`）
3. 使用者設定（`~/.claude/settings.json`）

程式設計選項（如 `agents`、`allowed_tools`）始終會覆寫檔案系統設定。

### `AgentDefinition`

以程式設計方式定義的子代理的配置。

```python
@dataclass
class AgentDefinition:
    description: str
    prompt: str
    tools: list[str] | None = None
    model: Literal["sonnet", "opus", "haiku", "inherit"] | None = None
```

| 欄位         | 必需 | 描述                                                    |
| :------------ | :------- | :------------------------------------------------------------- |
| `description` | 是      | 何時使用此代理的自然語言描述         |
| `tools`       | 否       | 允許的工具名稱陣列。如果省略，繼承所有工具    |
| `prompt`      | 是      | 代理的系統提示                                      |
| `model`       | 否       | 此代理的模型覆寫。如果省略，使用主模型 |

### `PermissionMode`

用於控制工具執行的權限模式。

```python
PermissionMode = Literal[
    "default",           # Standard permission behavior
    "acceptEdits",       # Auto-accept file edits
    "plan",              # Planning mode - no execution
    "bypassPermissions"  # Bypass all permission checks (use with caution)
]
```

### `McpSdkServerConfig`

使用 `create_sdk_mcp_server()` 建立的 SDK MCP 伺服器的配置。

```python
class McpSdkServerConfig(TypedDict):
    type: Literal["sdk"]
    name: str
    instance: Any  # MCP Server instance
```

### `McpServerConfig`

MCP 伺服器配置的聯合類型。

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

SDK 中載入外掛程式的配置。

```python
class SdkPluginConfig(TypedDict):
    type: Literal["local"]
    path: str
```

| 欄位 | 類型 | 描述 |
|:------|:-----|:------------|
| `type` | `Literal["local"]` | 必須為 `"local"`（目前僅支援本機外掛程式） |
| `path` | `str` | 外掛程式目錄的絕對或相對路徑 |

**範例：**
```python
plugins=[
    {"type": "local", "path": "./my-plugin"},
    {"type": "local", "path": "/absolute/path/to/plugin"}
]
```

如需建立和使用外掛程式的完整資訊，請參閱 [外掛程式](/docs/zh-TW/agent-sdk/plugins)。

## 消息類型

### `Message`

所有可能消息的聯合類型。

```python
Message = UserMessage | AssistantMessage | SystemMessage | ResultMessage
```

### `UserMessage`

使用者輸入消息。

```python
@dataclass
class UserMessage:
    content: str | list[ContentBlock]
```

### `AssistantMessage`

具有內容區塊的助手回應消息。

```python
@dataclass
class AssistantMessage:
    content: list[ContentBlock]
    model: str
```

### `SystemMessage`

具有中繼資料的系統消息。

```python
@dataclass
class SystemMessage:
    subtype: str
    data: dict[str, Any]
```

### `ResultMessage`

具有成本和使用資訊的最終結果消息。

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

## 內容區塊類型

### `ContentBlock`

所有內容區塊的聯合類型。

```python
ContentBlock = TextBlock | ThinkingBlock | ToolUseBlock | ToolResultBlock
```

### `TextBlock`

文字內容區塊。

```python
@dataclass
class TextBlock:
    text: str
```

### `ThinkingBlock`

思考內容區塊（適用於具有思考能力的模型）。

```python
@dataclass
class ThinkingBlock:
    thinking: str
    signature: str
```

### `ToolUseBlock`

工具使用請求區塊。

```python
@dataclass
class ToolUseBlock:
    id: str
    name: str
    input: dict[str, Any]
```

### `ToolResultBlock`

工具執行結果區塊。

```python
@dataclass
class ToolResultBlock:
    tool_use_id: str
    content: str | list[dict[str, Any]] | None = None
    is_error: bool | None = None
```

## 錯誤類型

### `ClaudeSDKError`

所有 SDK 錯誤的基礎例外類別。

```python
class ClaudeSDKError(Exception):
    """Claude SDK 的基礎錯誤。"""
```

### `CLINotFoundError`

當 Claude Code CLI 未安裝或找不到時引發。

```python
class CLINotFoundError(CLIConnectionError):
    def __init__(self, message: str = "Claude Code not found", cli_path: str | None = None):
        """
        Args:
            message: 錯誤訊息（預設值："Claude Code not found"）
            cli_path: 找不到的 CLI 的選擇性路徑
        """
```

### `CLIConnectionError`

當連接到 Claude Code 失敗時引發。

```python
class CLIConnectionError(ClaudeSDKError):
    """無法連接到 Claude Code。"""
```

### `ProcessError`

當 Claude Code 程序失敗時引發。

```python
class ProcessError(ClaudeSDKError):
    def __init__(self, message: str, exit_code: int | None = None, stderr: str | None = None):
        self.exit_code = exit_code
        self.stderr = stderr
```

### `CLIJSONDecodeError`

當 JSON 解析失敗時引發。

```python
class CLIJSONDecodeError(ClaudeSDKError):
    def __init__(self, line: str, original_error: Exception):
        """
        Args:
            line: 無法解析的行
            original_error: 原始 JSON 解碼例外
        """
        self.line = line
        self.original_error = original_error
```

## 掛鉤類型

如需使用掛鉤的完整指南、範例和常見模式，請參閱[掛鉤指南](/docs/zh-TW/agent-sdk/hooks)。

### `HookEvent`

支援的掛鉤事件類型。請注意，由於設定限制，Python SDK 不支援 SessionStart、SessionEnd 和 Notification 掛鉤。

```python
HookEvent = Literal[
    "PreToolUse",      # 在工具執行前呼叫
    "PostToolUse",     # 在工具執行後呼叫
    "UserPromptSubmit", # 當使用者提交提示時呼叫
    "Stop",            # 當停止執行時呼叫
    "SubagentStop",    # 當子代理停止時呼叫
    "PreCompact"       # 在訊息壓縮前呼叫
]
```

### `HookCallback`

掛鉤回呼函式的類型定義。

```python
HookCallback = Callable[
    [dict[str, Any], str | None, HookContext],
    Awaitable[dict[str, Any]]
]
```

參數：

- `input_data`: 掛鉤特定的輸入資料（請參閱[掛鉤指南](/docs/zh-TW/agent-sdk/hooks#input-data)）
- `tool_use_id`: 選擇性的工具使用識別碼（適用於工具相關的掛鉤）
- `context`: 掛鉤上下文，包含其他資訊

傳回可能包含以下內容的字典：

- `decision`: `"block"` 以阻止該動作
- `systemMessage`: 要新增到文字記錄的系統訊息
- `hookSpecificOutput`: 掛鉤特定的輸出資料

### `HookContext`

傳遞給掛鉤回呼的上下文資訊。

```python
@dataclass
class HookContext:
    signal: Any | None = None  # 未來：中止信號支援
```

### `HookMatcher`

用於將掛鉤與特定事件或工具相符的設定。

```python
@dataclass
class HookMatcher:
    matcher: str | None = None        # 要相符的工具名稱或模式（例如 "Bash"、"Write|Edit"）
    hooks: list[HookCallback] = field(default_factory=list)  # 要執行的回呼清單
    timeout: float | None = None        # 此相符器中所有掛鉤的逾時時間（秒）（預設值：60）
```

### 掛鉤使用範例

此範例註冊了兩個掛鉤：一個阻止危險的 bash 命令（如 `rm -rf /`），另一個記錄所有工具使用情況以進行稽核。安全掛鉤僅在 Bash 命令上執行（透過 `matcher`），而記錄掛鉤在所有工具上執行。

```python
from claude_agent_sdk import query, ClaudeAgentOptions, HookMatcher, HookContext
from typing import Any

async def validate_bash_command(
    input_data: dict[str, Any],
    tool_use_id: str | None,
    context: HookContext
) -> dict[str, Any]:
    """驗證並可能阻止危險的 bash 命令。"""
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
    """記錄所有工具使用情況以進行稽核。"""
    print(f"Tool used: {input_data.get('tool_name')}")
    return {}

options = ClaudeAgentOptions(
    hooks={
        'PreToolUse': [
            HookMatcher(matcher='Bash', hooks=[validate_bash_command], timeout=120),  # 驗證 2 分鐘
            HookMatcher(hooks=[log_tool_use])  # 適用於所有工具（預設 60 秒逾時）
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

## 工具輸入/輸出類型

所有內建 Claude Code 工具的輸入/輸出架構文件。雖然 Python SDK 不會將這些匯出為類型，但它們代表訊息中工具輸入和輸出的結構。

### Task

**工具名稱：** `Task`

**輸入：**

```python
{
    "description": str,      # 任務的簡短（3-5 個字）描述
    "prompt": str,           # 代理要執行的任務
    "subagent_type": str     # 要使用的專門代理類型
}
```

**輸出：**

```python
{
    "result": str,                    # 來自子代理的最終結果
    "usage": dict | None,             # 代幣使用統計
    "total_cost_usd": float | None,  # 美元總成本
    "duration_ms": int | None         # 執行持續時間（毫秒）
}
```

### Bash

**工具名稱：** `Bash`

**輸入：**

```python
{
    "command": str,                  # 要執行的命令
    "timeout": int | None,           # 選擇性逾時時間（毫秒）（最大 600000）
    "description": str | None,       # 清晰簡潔的描述（5-10 個字）
    "run_in_background": bool | None # 設定為 true 以在背景執行
}
```

**輸出：**

```python
{
    "output": str,              # 合併的 stdout 和 stderr 輸出
    "exitCode": int,            # 命令的結束代碼
    "killed": bool | None,      # 命令是否因逾時而被終止
    "shellId": str | None       # 背景程序的 Shell ID
}
```

### Edit

**工具名稱：** `Edit`

**輸入：**

```python
{
    "file_path": str,           # 要修改的檔案的絕對路徑
    "old_string": str,          # 要取代的文字
    "new_string": str,          # 要取代為的文字
    "replace_all": bool | None  # 取代所有出現次數（預設 False）
}
```

**輸出：**

```python
{
    "message": str,      # 確認訊息
    "replacements": int, # 進行的取代次數
    "file_path": str     # 已編輯的檔案路徑
}
```

### Read

**工具名稱：** `Read`

**輸入：**

```python
{
    "file_path": str,       # 要讀取的檔案的絕對路徑
    "offset": int | None,   # 開始讀取的行號
    "limit": int | None     # 要讀取的行數
}
```

**輸出（文字檔案）：**

```python
{
    "content": str,         # 包含行號的檔案內容
    "total_lines": int,     # 檔案中的總行數
    "lines_returned": int   # 實際傳回的行數
}
```

**輸出（影像）：**

```python
{
    "image": str,       # Base64 編碼的影像資料
    "mime_type": str,   # 影像 MIME 類型
    "file_size": int    # 檔案大小（位元組）
}
```

### Write

**工具名稱：** `Write`

**輸入：**

```python
{
    "file_path": str,  # 要寫入的檔案的絕對路徑
    "content": str     # 要寫入檔案的內容
}
```

**輸出：**

```python
{
    "message": str,        # 成功訊息
    "bytes_written": int,  # 寫入的位元組數
    "file_path": str       # 已寫入的檔案路徑
}
```

### Glob

**工具名稱：** `Glob`

**輸入：**

```python
{
    "pattern": str,       # 要與檔案相符的 glob 模式
    "path": str | None    # 要搜尋的目錄（預設為 cwd）
}
```

**輸出：**

```python
{
    "matches": list[str],  # 相符檔案路徑的陣列
    "count": int,          # 找到的相符項數
    "search_path": str     # 使用的搜尋目錄
}
```

### Grep

**工具名稱：** `Grep`

**輸入：**

```python
{
    "pattern": str,                    # 正規表達式模式
    "path": str | None,                # 要搜尋的檔案或目錄
    "glob": str | None,                # 用於篩選檔案的 glob 模式
    "type": str | None,                # 要搜尋的檔案類型
    "output_mode": str | None,         # "content"、"files_with_matches" 或 "count"
    "-i": bool | None,                 # 不區分大小寫搜尋
    "-n": bool | None,                 # 顯示行號
    "-B": int | None,                  # 每個相符項前要顯示的行數
    "-A": int | None,                  # 每個相符項後要顯示的行數
    "-C": int | None,                  # 每個相符項前後要顯示的行數
    "head_limit": int | None,          # 將輸出限制為前 N 行/項目
    "multiline": bool | None           # 啟用多行模式
}
```

**輸出（內容模式）：**

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

**輸出（files_with_matches 模式）：**

```python
{
    "files": list[str],  # 包含相符項的檔案
    "count": int         # 包含相符項的檔案數
}
```

### NotebookEdit

**工具名稱：** `NotebookEdit`

**輸入：**

```python
{
    "notebook_path": str,                     # Jupyter 筆記本的絕對路徑
    "cell_id": str | None,                    # 要編輯的儲存格 ID
    "new_source": str,                        # 儲存格的新來源
    "cell_type": "code" | "markdown" | None,  # 儲存格的類型
    "edit_mode": "replace" | "insert" | "delete" | None  # 編輯操作類型
}
```

**輸出：**

```python
{
    "message": str,                              # 成功訊息
    "edit_type": "replaced" | "inserted" | "deleted",  # 執行的編輯類型
    "cell_id": str | None,                       # 受影響的儲存格 ID
    "total_cells": int                           # 編輯後筆記本中的總儲存格數
}
```

### WebFetch

**工具名稱：** `WebFetch`

**輸入：**

```python
{
    "url": str,     # 要從中擷取內容的 URL
    "prompt": str   # 在擷取的內容上執行的提示
}
```

**輸出：**

```python
{
    "response": str,           # AI 模型對提示的回應
    "url": str,                # 已擷取的 URL
    "final_url": str | None,   # 重新導向後的最終 URL
    "status_code": int | None  # HTTP 狀態代碼
}
```

### WebSearch

**工具名稱：** `WebSearch`

**輸入：**

```python
{
    "query": str,                        # 要使用的搜尋查詢
    "allowed_domains": list[str] | None, # 僅包含來自這些網域的結果
    "blocked_domains": list[str] | None  # 永遠不包含來自這些網域的結果
}
```

**輸出：**

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

**工具名稱：** `TodoWrite`

**輸入：**

```python
{
    "todos": [
        {
            "content": str,                              # 任務描述
            "status": "pending" | "in_progress" | "completed",  # 任務狀態
            "activeForm": str                            # 描述的主動形式
        }
    ]
}
```

**輸出：**

```python
{
    "message": str,  # 成功訊息
    "stats": {
        "total": int,
        "pending": int,
        "in_progress": int,
        "completed": int
    }
}
```

### BashOutput

**工具名稱：** `BashOutput`

**輸入：**

```python
{
    "bash_id": str,       # 背景 shell 的 ID
    "filter": str | None  # 選擇性正規表達式以篩選輸出行
}
```

**輸出：**

```python
{
    "output": str,                                      # 自上次檢查以來的新輸出
    "status": "running" | "completed" | "failed",       # 目前 shell 狀態
    "exitCode": int | None                              # 完成時的結束代碼
}
```

### KillBash

**工具名稱：** `KillBash`

**輸入：**

```python
{
    "shell_id": str  # 要終止的背景 shell 的 ID
}
```

**輸出：**

```python
{
    "message": str,  # 成功訊息
    "shell_id": str  # 已終止的 shell ID
}
```

### ExitPlanMode

**工具名稱：** `ExitPlanMode`

**輸入：**

```python
{
    "plan": str  # 使用者要執行以供核准的計畫
}
```

**輸出：**

```python
{
    "message": str,          # 確認訊息
    "approved": bool | None  # 使用者是否核准了計畫
}
```

### ListMcpResources

**工具名稱：** `ListMcpResources`

**輸入：**

```python
{
    "server": str | None  # 選擇性伺服器名稱以篩選資源
}
```

**輸出：**

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

**工具名稱：** `ReadMcpResource`

**輸入：**

```python
{
    "server": str,  # MCP 伺服器名稱
    "uri": str      # 要讀取的資源 URI
}
```

**輸出：**

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

## 使用 ClaudeSDKClient 的進階功能

### 建立連續對話介面

```python
from claude_agent_sdk import ClaudeSDKClient, ClaudeAgentOptions, AssistantMessage, TextBlock
import asyncio

class ConversationSession:
    """維護與 Claude 的單一對話工作階段。"""

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
                # 斷開連接並重新連接以進行新工作階段
                await self.client.disconnect()
                await self.client.connect()
                self.turn_count = 0
                print("Started new conversation session (previous context cleared)")
                continue

            # 傳送訊息 - Claude 記住此工作階段中的所有先前訊息
            await self.client.query(user_input)
            self.turn_count += 1

            # 處理回應
            print(f"[Turn {self.turn_count}] Claude: ", end="")
            async for message in self.client.receive_response():
                if isinstance(message, AssistantMessage):
                    for block in message.content:
                        if isinstance(block, TextBlock):
                            print(block.text, end="")
            print()  # 回應後的新行

        await self.client.disconnect()
        print(f"Conversation ended after {self.turn_count} turns.")

async def main():
    options = ClaudeAgentOptions(
        allowed_tools=["Read", "Write", "Bash"],
        permission_mode="acceptEdits"
    )
    session = ConversationSession(options)
    await session.start()

# 範例對話：
# Turn 1 - You: "Create a file called hello.py"
# Turn 1 - Claude: "I'll create a hello.py file for you..."
# Turn 2 - You: "What's in that file?"
# Turn 2 - Claude: "The hello.py file I just created contains..." (記住！)
# Turn 3 - You: "Add a main function to it"
# Turn 3 - Claude: "I'll add a main function to hello.py..." (知道是哪個檔案！)

asyncio.run(main())
```

### 使用掛鉤進行行為修改

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
    """在執行前記錄所有工具使用情況。"""
    tool_name = input_data.get('tool_name', 'unknown')
    print(f"[PRE-TOOL] About to use: {tool_name}")

    # 您可以在此修改或阻止工具執行
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
    """在工具執行後記錄結果。"""
    tool_name = input_data.get('tool_name', 'unknown')
    print(f"[POST-TOOL] Completed: {tool_name}")
    return {}

async def user_prompt_modifier(
    input_data: dict[str, Any],
    tool_use_id: str | None,
    context: HookContext
) -> dict[str, Any]:
    """將上下文新增到使用者提示。"""
    original_prompt = input_data.get('prompt', '')

    # 將時間戳記新增到所有提示
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
            # 掛鉤將自動記錄工具使用情況
            pass

asyncio.run(main())
```

### 即時進度監控

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

        # 即時監控進度
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

            # 檢查我們是否已收到最終結果
            if hasattr(message, 'subtype') and message.subtype in ['success', 'error']:
                print(f"\n🎯 Task completed!")
                break

asyncio.run(monitor_progress())
```

## 使用範例

### 基本檔案操作（使用 query）

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

### 錯誤處理

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

### 使用用戶端的串流模式

```python
from claude_agent_sdk import ClaudeSDKClient
import asyncio

async def interactive_session():
    async with ClaudeSDKClient() as client:
        # 傳送初始訊息
        await client.query("What's the weather like?")

        # 處理回應
        async for msg in client.receive_response():
            print(msg)

        # 傳送後續訊息
        await client.query("Tell me more about that")

        # 處理後續回應
        async for msg in client.receive_response():
            print(msg)

asyncio.run(interactive_session())
```

### 使用 ClaudeSDKClient 的自訂工具

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

# 使用 @tool 裝飾器定義自訂工具
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
    # 使用自訂工具建立 SDK MCP 伺服器
    my_server = create_sdk_mcp_server(
        name="utilities",
        version="1.0.0",
        tools=[calculate, get_time]
    )

    # 使用伺服器設定選項
    options = ClaudeAgentOptions(
        mcp_servers={"utils": my_server},
        allowed_tools=[
            "mcp__utils__calculate",
            "mcp__utils__get_time"
        ]
    )

    # 使用 ClaudeSDKClient 進行互動式工具使用
    async with ClaudeSDKClient(options=options) as client:
        await client.query("What's 123 * 456?")

        # 處理計算回應
        async for message in client.receive_response():
            if isinstance(message, AssistantMessage):
                for block in message.content:
                    if isinstance(block, TextBlock):
                        print(f"Calculation: {block.text}")

        # 後續時間查詢
        await client.query("What time is it now?")

        async for message in client.receive_response():
            if isinstance(message, AssistantMessage):
                for block in message.content:
                    if isinstance(block, TextBlock):
                        print(f"Time: {block.text}")

asyncio.run(main())
```

## 沙箱設定

### `SandboxSettings`

沙箱行為的設定。使用此選項以程式設計方式啟用命令沙箱並設定網路限制。

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

| 屬性 | 類型 | 預設值 | 描述 |
| :------- | :--- | :------ | :---------- |
| `enabled` | `bool` | `False` | 為命令執行啟用沙箱模式 |
| `autoAllowBashIfSandboxed` | `bool` | `False` | 啟用沙箱時自動核准 bash 命令 |
| `excludedCommands` | `list[str]` | `[]` | 始終繞過沙箱限制的命令（例如 `["docker"]`）。這些命令自動執行沙箱外，無需模型參與 |
| `allowUnsandboxedCommands` | `bool` | `False` | 允許模型要求在沙箱外執行命令。當為 `True` 時，模型可以在工具輸入中設定 `dangerouslyDisableSandbox`，這會回退到[權限系統](#permissions-fallback-for-unsandboxed-commands) |
| `network` | [`SandboxNetworkConfig`](#sandboxnetworkconfig) | `None` | 網路特定的沙箱設定 |
| `ignoreViolations` | [`SandboxIgnoreViolations`](#sandboxignoreviolations) | `None` | 設定要忽略的沙箱違規 |
| `enableWeakerNestedSandbox` | `bool` | `False` | 啟用較弱的巢狀沙箱以相容性 |

<Note>
**檔案系統和網路存取限制**不是透過沙箱設定設定的。相反，它們衍生自[權限規則](https://code.claude.com/docs/zh-TW/settings#permission-settings)：

- **檔案系統讀取限制**：讀取拒絕規則
- **檔案系統寫入限制**：編輯允許/拒絕規則
- **網路限制**：WebFetch 允許/拒絕規則

使用沙箱設定進行命令執行沙箱，並使用權限規則進行檔案系統和網路存取控制。
</Note>

#### 使用範例

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

沙箱模式的網路特定設定。

```python
class SandboxNetworkConfig(TypedDict, total=False):
    allowLocalBinding: bool
    allowUnixSockets: list[str]
    allowAllUnixSockets: bool
    httpProxyPort: int
    socksProxyPort: int
```

| 屬性 | 類型 | 預設值 | 描述 |
| :------- | :--- | :------ | :---------- |
| `allowLocalBinding` | `bool` | `False` | 允許程序繫結到本機連接埠（例如開發伺服器） |
| `allowUnixSockets` | `list[str]` | `[]` | 程序可以存取的 Unix 通訊端路徑（例如 Docker 通訊端） |
| `allowAllUnixSockets` | `bool` | `False` | 允許存取所有 Unix 通訊端 |
| `httpProxyPort` | `int` | `None` | 網路請求的 HTTP Proxy 連接埠 |
| `socksProxyPort` | `int` | `None` | 網路請求的 SOCKS Proxy 連接埠 |

### `SandboxIgnoreViolations`

用於忽略特定沙箱違規的設定。

```python
class SandboxIgnoreViolations(TypedDict, total=False):
    file: list[str]
    network: list[str]
```

| 屬性 | 類型 | 預設值 | 描述 |
| :------- | :--- | :------ | :---------- |
| `file` | `list[str]` | `[]` | 要忽略違規的檔案路徑模式 |
| `network` | `list[str]` | `[]` | 要忽略違規的網路模式 |

### 沙箱外命令的權限回退

當啟用 `allowUnsandboxedCommands` 時，模型可以透過在工具輸入中設定 `dangerouslyDisableSandbox: True` 來要求在沙箱外執行命令。這些請求會回退到現有的權限系統，這表示您的 `can_use_tool` 處理程式將被呼叫，讓您實現自訂授權邏輯。

<Note>
**`excludedCommands` 與 `allowUnsandboxedCommands`：**
- `excludedCommands`：始終自動繞過沙箱的靜態命令清單（例如 `["docker"]`）。模型無法控制此項。
- `allowUnsandboxedCommands`：讓模型在執行時透過在工具輸入中設定 `dangerouslyDisableSandbox: True` 來決定是否要求沙箱外執行。
</Note>

```python
from claude_agent_sdk import query, ClaudeAgentOptions

async def can_use_tool(tool: str, input: dict) -> bool:
    # 檢查模型是否要求繞過沙箱
    if tool == "Bash" and input.get("dangerouslyDisableSandbox"):
        # 模型想在沙箱外執行此命令
        print(f"Unsandboxed command requested: {input.get('command')}")

        # 傳回 True 以允許，False 以拒絕
        return is_command_authorized(input.get("command"))
    return True

async def main():
    async for message in query(
        prompt="Deploy my application",
        options=ClaudeAgentOptions(
            sandbox={
                "enabled": True,
                "allowUnsandboxedCommands": True  # 模型可以要求沙箱外執行
            },
            permission_mode="default",
            can_use_tool=can_use_tool
        )
    ):
        print(message)
```

此模式讓您能夠：

- **稽核模型請求**：記錄模型何時要求沙箱外執行
- **實現允許清單**：僅允許特定命令在沙箱外執行
- **新增核准工作流程**：要求明確授權以進行特權操作

<Warning>
使用 `dangerouslyDisableSandbox: True` 執行的命令具有完整的系統存取權。確保您的 `can_use_tool` 處理程式仔細驗證這些請求。
</Warning>

## 另請參閱

- [Python SDK 指南](/docs/zh-TW/agent-sdk/python) - 教學課程和範例
- [SDK 概觀](/docs/zh-TW/agent-sdk/overview) - 一般 SDK 概念
- [TypeScript SDK 參考](/docs/zh-TW/agent-sdk/typescript) - TypeScript SDK 文件
- [CLI 參考](https://code.claude.com/docs/zh-TW/cli-reference) - 命令列介面
- [常見工作流程](https://code.claude.com/docs/zh-TW/common-workflows) - 逐步指南