# Agent SDK reference - Python

Python Agent SDKの完全なAPIリファレンス。すべての関数、型、クラスを含みます。

---

## インストール

```bash
pip install claude-agent-sdk
```

## `query()` と `ClaudeSDKClient` の選択

Python SDKは、Claude Codeと対話するための2つの方法を提供します。

### クイック比較

| 機能             | `query()`                     | `ClaudeSDKClient`                  |
| :------------------ | :---------------------------- | :--------------------------------- |
| **セッション**         | 毎回新しいセッションを作成 | 同じセッションを再利用                |
| **会話**    | 単一の交換               | 同じコンテキスト内での複数の交換 |
| **接続**      | 自動的に管理         | 手動制御                     |
| **ストリーミング入力** | ✅ サポート                  | ✅ サポート                       |
| **割り込み**      | ❌ サポートなし              | ✅ サポート                       |
| **フック**           | ❌ サポートなし              | ✅ サポート                       |
| **カスタムツール**    | ❌ サポートなし              | ✅ サポート                       |
| **チャット継続**   | ❌ 毎回新しいセッション      | ✅ 会話を維持          |
| **ユースケース**        | 1回限りのタスク                 | 継続的な会話           |

### `query()` を使用する場合（毎回新しいセッション）

**最適な用途:**

- 会話履歴が不要な1回限りの質問
- 前の交換からのコンテキストが不要な独立したタスク
- シンプルな自動化スクリプト
- 毎回新しく開始したい場合

### `ClaudeSDKClient` を使用する場合（継続的な会話）

**最適な用途:**

- **会話の継続** - Claudeがコンテキストを覚えておく必要がある場合
- **フォローアップ質問** - 前の回答に基づいて構築する
- **インタラクティブなアプリケーション** - チャットインターフェース、REPL
- **レスポンス駆動ロジック** - 次のアクションがClaudeのレスポンスに依存する場合
- **セッション制御** - 会話ライフサイクルを明示的に管理する

## 関数

### `query()`

Claude Codeとの各インタラクションのために新しいセッションを作成します。メッセージが到着するにつれてメッセージを生成する非同期イテレータを返します。`query()` への各呼び出しは、前のインタラクションのメモリなしで新しく開始します。

```python
async def query(
    *,
    prompt: str | AsyncIterable[dict[str, Any]],
    options: ClaudeAgentOptions | None = None
) -> AsyncIterator[Message]
```

#### パラメータ

| パラメータ | 型                         | 説明                                                                |
| :-------- | :--------------------------- | :------------------------------------------------------------------------- |
| `prompt`  | `str \| AsyncIterable[dict]` | 入力プロンプト（文字列またはストリーミングモード用の非同期イテレータ）          |
| `options` | `ClaudeAgentOptions \| None` | オプションの設定オブジェクト（Noneの場合は `ClaudeAgentOptions()` がデフォルト） |

#### 戻り値

会話からのメッセージを生成する `AsyncIterator[Message]` を返します。

#### 例 - オプション付き

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

型安全性を備えたMCPツールを定義するためのデコレータ。

```python
def tool(
    name: str,
    description: str,
    input_schema: type | dict[str, Any]
) -> Callable[[Callable[[Any], Awaitable[dict[str, Any]]]], SdkMcpTool[Any]]
```

#### パラメータ

| パラメータ      | 型                     | 説明                                             |
| :------------- | :----------------------- | :------------------------------------------------------ |
| `name`         | `str`                    | ツールの一意の識別子                          |
| `description`  | `str`                    | ツールが何をするかの人間が読める説明        |
| `input_schema` | `type \| dict[str, Any]` | ツールの入力パラメータを定義するスキーマ（以下を参照） |

#### 入力スキーマオプション

1. **シンプルな型マッピング**（推奨）:

   ```python
   {"text": str, "count": int, "enabled": bool}
   ```

2. **JSONスキーマ形式**（複雑な検証用）:
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

#### 戻り値

ツール実装をラップし、`SdkMcpTool` インスタンスを返すデコレータ関数。

#### 例

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

Pythonアプリケーション内で実行されるインプロセスMCPサーバーを作成します。

```python
def create_sdk_mcp_server(
    name: str,
    version: str = "1.0.0",
    tools: list[SdkMcpTool[Any]] | None = None
) -> McpSdkServerConfig
```

#### パラメータ

| パラメータ | 型                            | デフォルト   | 説明                                           |
| :-------- | :------------------------------ | :-------- | :---------------------------------------------------- |
| `name`    | `str`                           | -         | サーバーの一意の識別子                      |
| `version` | `str`                           | `"1.0.0"` | サーバーバージョン文字列                                 |
| `tools`   | `list[SdkMcpTool[Any]] \| None` | `None`    | `@tool` デコレータで作成されたツール関数のリスト |

#### 戻り値

`ClaudeAgentOptions.mcp_servers` に渡すことができる `McpSdkServerConfig` オブジェクトを返します。

#### 例

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

## クラス

### `ClaudeSDKClient`

**複数の交換にわたって会話セッションを維持します。** これはTypeScript SDKの `query()` 関数が内部的にどのように機能するかのPython相当です - 会話を継続できるクライアントオブジェクトを作成します。

#### 主な機能

- **セッション継続性**: 複数の `query()` 呼び出しにわたって会話コンテキストを維持
- **同じ会話**: Claudeはセッション内の前のメッセージを覚えている
- **割り込みサポート**: Claudeの実行中に停止できる
- **明示的なライフサイクル**: セッションの開始と終了を制御
- **レスポンス駆動フロー**: レスポンスに反応してフォローアップを送信できる
- **カスタムツールとフック**: `@tool` デコレータで作成されたカスタムツールとフックをサポート

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

#### メソッド

| メソッド                      | 説明                                                         |
| :-------------------------- | :------------------------------------------------------------------ |
| `__init__(options)`         | オプションの設定でクライアントを初期化                   |
| `connect(prompt)`           | オプションの初期プロンプトまたはメッセージストリームでClaudeに接続 |
| `query(prompt, session_id)` | ストリーミングモードで新しいリクエストを送信                                |
| `receive_messages()`        | Claudeからのすべてのメッセージを非同期イテレータとして受け取る               |
| `receive_response()`        | ResultMessageを含むまでのメッセージを受け取る                |
| `interrupt()`               | 割り込み信号を送信（ストリーミングモードでのみ機能）                |
| `disconnect()`              | Claudeから切断                                              |

#### コンテキストマネージャサポート

クライアントは自動接続管理のための非同期コンテキストマネージャとして使用できます：

```python
async with ClaudeSDKClient() as client:
    await client.query("Hello Claude")
    async for message in client.receive_response():
        print(message)
```

> **重要:** メッセージを反復処理する場合、`break` を使用して早期に終了することは避けてください。これはasyncioのクリーンアップの問題を引き起こす可能性があります。代わりに、反復処理を自然に完了させるか、フラグを使用して必要なものを見つけたときを追跡してください。

#### 例 - 会話を継続する

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

#### 例 - ClaudeSDKClientでのストリーミング入力

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

#### 例 - 割り込みの使用

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

#### 例 - 高度なパーミッション制御

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

## 型

### `SdkMcpTool`

`@tool` デコレータで作成されたSDK MCPツールの定義。

```python
@dataclass
class SdkMcpTool(Generic[T]):
    name: str
    description: str
    input_schema: type[T] | dict[str, Any]
    handler: Callable[[T], Awaitable[dict[str, Any]]]
```

| プロパティ       | 型                                       | 説明                                |
| :------------- | :----------------------------------------- | :----------------------------------------- |
| `name`         | `str`                                      | ツールの一意の識別子             |
| `description`  | `str`                                      | 人間が読める説明                 |
| `input_schema` | `type[T] \| dict[str, Any]`                | 入力検証用のスキーマ                |
| `handler`      | `Callable[[T], Awaitable[dict[str, Any]]]` | ツール実行を処理する非同期関数 |

### `ClaudeAgentOptions`

Claude Codeクエリの設定データクラス。

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

| プロパティ                      | 型                                         | デフォルト              | 説明                                                                                                                                                                             |
| :---------------------------- | :------------------------------------------- | :------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `allowed_tools`               | `list[str]`                                  | `[]`                 | 許可されたツール名のリスト                                                                                                                                                              |
| `system_prompt`               | `str \| SystemPromptPreset \| None`          | `None`               | システムプロンプト設定。カスタムプロンプト用に文字列を渡すか、Claude Codeのシステムプロンプト用に `{"type": "preset", "preset": "claude_code"}` を使用します。プリセットを拡張するために `"append"` を追加します |
| `mcp_servers`                 | `dict[str, McpServerConfig] \| str \| Path`  | `{}`                 | MCPサーバー設定または設定ファイルへのパス                                                                                                                                        |
| `permission_mode`             | `PermissionMode \| None`                     | `None`               | ツール使用のパーミッションモード                                                                                                                                                          |
| `continue_conversation`       | `bool`                                       | `False`              | 最新の会話を継続                                                                                                                                                                   |
| `resume`                      | `str \| None`                                | `None`               | 再開するセッションID                                                                                                                                                                    |
| `max_turns`                   | `int \| None`                                | `None`               | 最大会話ターン数                                                                                                                                                              |
| `disallowed_tools`            | `list[str]`                                  | `[]`                 | 許可されていないツール名のリスト                                                                                                                                                           |
| `model`                       | `str \| None`                                | `None`               | 使用するClaudeモデル                                                                                                                                                                     |
| `output_format`               | [`OutputFormat`](#outputformat) ` \| None`   | `None`               | エージェント結果の出力形式を定義します。詳細は [構造化出力](/docs/ja/agent-sdk/structured-outputs) を参照してください                                                                    |
| `permission_prompt_tool_name` | `str \| None`                                | `None`               | パーミッションプロンプト用のMCPツール名                                                                                                                                                    |
| `cwd`                         | `str \| Path \| None`                        | `None`               | 現在の作業ディレクトリ                                                                                                                                                               |
| `settings`                    | `str \| None`                                | `None`               | 設定ファイルへのパス                                                                                                                                                                   |
| `add_dirs`                    | `list[str \| Path]`                          | `[]`                 | Claudeがアクセスできる追加ディレクトリ                                                                                                                                                |
| `env`                         | `dict[str, str]`                             | `{}`                 | 環境変数                                                                                                                                                                   |
| `extra_args`                  | `dict[str, str \| None]`                     | `{}`                 | CLIに直接渡す追加のCLI引数                                                                                                                                    |
| `max_buffer_size`             | `int \| None`                                | `None`               | CLI stdoutをバッファリングする場合の最大バイト数                                                                                                                                                 |
| `debug_stderr`                | `Any`                                        | `sys.stderr`         | _非推奨_ - デバッグ出力用のファイルのようなオブジェクト。代わりに `stderr` コールバックを使用してください                                                                                                         |
| `stderr`                      | `Callable[[str], None] \| None`              | `None`               | CLIからのstderr出力用のコールバック関数                                                                                                                                            |
| `can_use_tool`                | `CanUseTool \| None`                         | `None`               | ツールパーミッションコールバック関数                                                                                                                                                       |
| `hooks`                       | `dict[HookEvent, list[HookMatcher]] \| None` | `None`               | イベント傍受用のフック設定                                                                                                                                             |
| `user`                        | `str \| None`                                | `None`               | ユーザー識別子                                                                                                                                                                         |
| `include_partial_messages`    | `bool`                                       | `False`              | 部分的なメッセージストリーミングイベントを含める                                                                                                                                                                |
| `fork_session`                | `bool`                                       | `False`              | `resume` で再開する場合、元のセッションを継続する代わりに新しいセッションIDにフォークします                                                                                        |
| `agents`                      | `dict[str, AgentDefinition] \| None`         | `None`               | プログラムで定義されたサブエージェント                                                                                                                                                      |
| `plugins`                     | `list[SdkPluginConfig]`                      | `[]`                 | ローカルパスからカスタムプラグインをロードします。詳細は [プラグイン](/docs/ja/agent-sdk/plugins) を参照してください                                                                             |
| `sandbox`                     | [`SandboxSettings`](#sandboxsettings) ` \| None` | `None`              | サンドボックス動作をプログラムで設定します。詳細は [サンドボックス設定](#sandboxsettings) を参照してください                                        |
| `setting_sources`             | `list[SettingSource] \| None`                | `None`（設定なし） | どのファイルシステム設定をロードするかを制御します。省略した場合、設定はロードされません。**注:** CLAUDE.mdファイルをロードするには `"project"` を含める必要があります                                             |

### `OutputFormat`

構造化出力検証の設定。

```python
class OutputFormat(TypedDict):
    type: Literal["json_schema"]
    schema: dict[str, Any]
```

| フィールド    | 必須 | 説明                                    |
| :------- | :------- | :--------------------------------------------- |
| `type`   | はい      | JSON Schema検証の場合は `"json_schema"` である必要があります |
| `schema` | はい      | 出力検証用のJSONスキーマ定義   |

### `SystemPromptPreset`

Claude Codeのプリセットシステムプロンプトをオプションの追加で使用するための設定。

```python
class SystemPromptPreset(TypedDict):
    type: Literal["preset"]
    preset: Literal["claude_code"]
    append: NotRequired[str]
```

| フィールド    | 必須 | 説明                                                   |
| :------- | :------- | :------------------------------------------------------------ |
| `type`   | はい      | プリセットシステムプロンプトを使用するには `"preset"` である必要があります              |
| `preset` | はい      | Claude Codeのシステムプロンプトを使用するには `"claude_code"` である必要があります    |
| `append` | いいえ       | プリセットシステムプロンプトに追加する追加の指示 |

### `SettingSource`

SDKがロードする設定のファイルシステムベースの設定ソースを制御します。

```python
SettingSource = Literal["user", "project", "local"]
```

| 値       | 説明                                  | 場所                      |
| :---------- | :------------------------------------------- | :---------------------------- |
| `"user"`    | グローバルユーザー設定                         | `~/.claude/settings.json`     |
| `"project"` | 共有プロジェクト設定（バージョン管理）       | `.claude/settings.json`       |
| `"local"`   | ローカルプロジェクト設定（gitignored）          | `.claude/settings.local.json` |

#### デフォルト動作

`setting_sources` が **省略** または **`None`** の場合、SDKはファイルシステム設定をロード **しません**。これはSDKアプリケーションの分離を提供します。

#### setting_sources を使用する理由

**すべてのファイルシステム設定をロード（レガシー動作）:**

```python
# SDK v0.0.x のようにすべての設定をロード
from claude_agent_sdk import query, ClaudeAgentOptions

async for message in query(
    prompt="Analyze this code",
    options=ClaudeAgentOptions(
        setting_sources=["user", "project", "local"]  # Load all settings
    )
):
    print(message)
```

**特定の設定ソースのみをロード:**

```python
# プロジェクト設定のみをロード、ユーザーとローカルは無視
async for message in query(
    prompt="Run CI checks",
    options=ClaudeAgentOptions(
        setting_sources=["project"]  # Only .claude/settings.json
    )
):
    print(message)
```

**テストとCI環境:**

```python
# ローカル設定を除外してCI内で一貫した動作を確保
async for message in query(
    prompt="Run tests",
    options=ClaudeAgentOptions(
        setting_sources=["project"],  # Only team-shared settings
        permission_mode="bypassPermissions"
    )
):
    print(message)
```

**SDKのみのアプリケーション:**

```python
# すべてをプログラムで定義（デフォルト動作）
# ファイルシステムの依存関係なし - setting_sources はデフォルトで None
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

**CLAUDE.md プロジェクト指示をロード:**

```python
# プロジェクト設定をロードしてプロジェクトからCLAUDE.mdファイルを含める
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

#### 設定の優先順位

複数のソースがロードされる場合、設定はこの優先順位（高から低）でマージされます：

1. ローカル設定（`.claude/settings.local.json`）
2. プロジェクト設定（`.claude/settings.json`）
3. ユーザー設定（`~/.claude/settings.json`）

プログラムオプション（`agents`、`allowed_tools` など）は常にファイルシステム設定をオーバーライドします。

### `AgentDefinition`

プログラムで定義されたサブエージェントの設定。

```python
@dataclass
class AgentDefinition:
    description: str
    prompt: str
    tools: list[str] | None = None
    model: Literal["sonnet", "opus", "haiku", "inherit"] | None = None
```

| フィールド         | 必須 | 説明                                                    |
| :------------ | :------- | :------------------------------------------------------------- |
| `description` | はい      | このエージェントを使用する場合の自然言語説明         |
| `tools`       | いいえ       | 許可されたツール名の配列。省略した場合、すべてのツールを継承します    |
| `prompt`      | はい      | エージェントのシステムプロンプト                                      |
| `model`       | いいえ       | このエージェントのモデルオーバーライド。省略した場合、メインモデルを使用します |

### `PermissionMode`

ツール実行を制御するためのパーミッションモード。

```python
PermissionMode = Literal[
    "default",           # Standard permission behavior
    "acceptEdits",       # Auto-accept file edits
    "plan",              # Planning mode - no execution
    "bypassPermissions"  # Bypass all permission checks (use with caution)
]
```

### `McpSdkServerConfig`

`create_sdk_mcp_server()` で作成されたSDK MCPサーバーの設定。

```python
class McpSdkServerConfig(TypedDict):
    type: Literal["sdk"]
    name: str
    instance: Any  # MCP Server instance
```

### `McpServerConfig`

MCPサーバー設定の共用体型。

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

SDKでプラグインをロードするための設定。

```python
class SdkPluginConfig(TypedDict):
    type: Literal["local"]
    path: str
```

| フィールド | 型 | 説明 |
|:------|:-----|:------------|
| `type` | `Literal["local"]` | `"local"` である必要があります（現在ローカルプラグインのみサポート） |
| `path` | `str` | プラグインディレクトリへの絶対または相対パス |

**例:**
```python
plugins=[
    {"type": "local", "path": "./my-plugin"},
    {"type": "local", "path": "/absolute/path/to/plugin"}
]
```

プラグインの作成と使用に関する完全な情報については、[プラグイン](/docs/ja/agent-sdk/plugins) を参照してください。

## メッセージ型

### `Message`

すべての可能なメッセージの共用体型。

```python
Message = UserMessage | AssistantMessage | SystemMessage | ResultMessage
```

### `UserMessage`

ユーザー入力メッセージ。

```python
@dataclass
class UserMessage:
    content: str | list[ContentBlock]
```

### `AssistantMessage`

コンテンツブロック付きのアシスタント応答メッセージ。

```python
@dataclass
class AssistantMessage:
    content: list[ContentBlock]
    model: str
```

### `SystemMessage`

メタデータ付きのシステムメッセージ。

```python
@dataclass
class SystemMessage:
    subtype: str
    data: dict[str, Any]
```

### `ResultMessage`

コストと使用情報付きの最終結果メッセージ。

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

## コンテンツブロック型

### `ContentBlock`

すべてのコンテンツブロックの共用体型。

```python
ContentBlock = TextBlock | ThinkingBlock | ToolUseBlock | ToolResultBlock
```

### `TextBlock`

テキストコンテンツブロック。

```python
@dataclass
class TextBlock:
    text: str
```

### `ThinkingBlock`

思考コンテンツブロック（思考機能を持つモデル用）。

```python
@dataclass
class ThinkingBlock:
    thinking: str
    signature: str
```

### `ToolUseBlock`

ツール使用リクエストブロック。

```python
@dataclass
class ToolUseBlock:
    id: str
    name: str
    input: dict[str, Any]
```

### `ToolResultBlock`

ツール実行結果ブロック。

```python
@dataclass
class ToolResultBlock:
    tool_use_id: str
    content: str | list[dict[str, Any]] | None = None
    is_error: bool | None = None
```

## エラータイプ

### `ClaudeSDKError`

すべてのSDKエラーの基本例外クラス。

```python
class ClaudeSDKError(Exception):
    """Claude SDKの基本エラー。"""
```

### `CLINotFoundError`

Claude Code CLIがインストールされていないか見つからない場合に発生します。

```python
class CLINotFoundError(CLIConnectionError):
    def __init__(self, message: str = "Claude Code not found", cli_path: str | None = None):
        """
        Args:
            message: エラーメッセージ（デフォルト: "Claude Code not found"）
            cli_path: 見つからなかったCLIへのオプションパス
        """
```

### `CLIConnectionError`

Claude Codeへの接続に失敗した場合に発生します。

```python
class CLIConnectionError(ClaudeSDKError):
    """Claude Codeへの接続に失敗しました。"""
```

### `ProcessError`

Claude Codeプロセスが失敗した場合に発生します。

```python
class ProcessError(ClaudeSDKError):
    def __init__(self, message: str, exit_code: int | None = None, stderr: str | None = None):
        self.exit_code = exit_code
        self.stderr = stderr
```

### `CLIJSONDecodeError`

JSONパースに失敗した場合に発生します。

```python
class CLIJSONDecodeError(ClaudeSDKError):
    def __init__(self, line: str, original_error: Exception):
        """
        Args:
            line: パースに失敗した行
            original_error: 元のJSONデコード例外
        """
        self.line = line
        self.original_error = original_error
```

## フックタイプ

フックの使用に関する包括的なガイドと例、一般的なパターンについては、[フックガイド](/docs/ja/agent-sdk/hooks)を参照してください。

### `HookEvent`

サポートされているフックイベントタイプ。セットアップの制限により、Python SDKはSessionStart、SessionEnd、およびNotificationフックをサポートしていません。

```python
HookEvent = Literal[
    "PreToolUse",      # ツール実行前に呼び出される
    "PostToolUse",     # ツール実行後に呼び出される
    "UserPromptSubmit", # ユーザーがプロンプトを送信したときに呼び出される
    "Stop",            # 実行を停止するときに呼び出される
    "SubagentStop",    # サブエージェントが停止したときに呼び出される
    "PreCompact"       # メッセージコンパクト前に呼び出される
]
```

### `HookCallback`

フックコールバック関数の型定義。

```python
HookCallback = Callable[
    [dict[str, Any], str | None, HookContext],
    Awaitable[dict[str, Any]]
]
```

パラメータ：

- `input_data`: フック固有の入力データ（[フックガイド](/docs/ja/agent-sdk/hooks#input-data)を参照）
- `tool_use_id`: オプションのツール使用識別子（ツール関連フック用）
- `context`: 追加情報を含むフックコンテキスト

以下を含む可能性のある辞書を返します：

- `decision`: `"block"`でアクションをブロック
- `systemMessage`: トランスクリプトに追加するシステムメッセージ
- `hookSpecificOutput`: フック固有の出力データ

### `HookContext`

フックコールバックに渡されるコンテキスト情報。

```python
@dataclass
class HookContext:
    signal: Any | None = None  # 将来: 中止シグナルサポート
```

### `HookMatcher`

特定のイベントまたはツールにフックをマッチングするための設定。

```python
@dataclass
class HookMatcher:
    matcher: str | None = None        # マッチするツール名またはパターン（例："Bash"、"Write|Edit"）
    hooks: list[HookCallback] = field(default_factory=list)  # 実行するコールバックのリスト
    timeout: float | None = None        # このマッチャーのすべてのフックのタイムアウト（秒）（デフォルト: 60）
```

### フック使用例

この例は2つのフックを登録します。1つは`rm -rf /`のような危険なbashコマンドをブロックし、もう1つは監査用にすべてのツール使用をログします。セキュリティフックは`matcher`経由でBashコマンドのみで実行され、ログフックはすべてのツールで実行されます。

```python
from claude_agent_sdk import query, ClaudeAgentOptions, HookMatcher, HookContext
from typing import Any

async def validate_bash_command(
    input_data: dict[str, Any],
    tool_use_id: str | None,
    context: HookContext
) -> dict[str, Any]:
    """危険なbashコマンドを検証し、ブロックする可能性があります。"""
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
    """監査用にすべてのツール使用をログします。"""
    print(f"Tool used: {input_data.get('tool_name')}")
    return {}

options = ClaudeAgentOptions(
    hooks={
        'PreToolUse': [
            HookMatcher(matcher='Bash', hooks=[validate_bash_command], timeout=120),  # 検証用2分
            HookMatcher(hooks=[log_tool_use])  # すべてのツールに適用（デフォルト60秒タイムアウト）
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

## ツール入出力タイプ

すべての組み込みClaude Codeツールの入出力スキーマのドキュメント。Python SDKはこれらを型としてエクスポートしませんが、メッセージ内のツール入出力の構造を表します。

### Task

**ツール名:** `Task`

**入力:**

```python
{
    "description": str,      # タスクの短い説明（3～5語）
    "prompt": str,           # エージェントが実行するタスク
    "subagent_type": str     # 使用する特殊エージェントのタイプ
}
```

**出力:**

```python
{
    "result": str,                    # サブエージェントからの最終結果
    "usage": dict | None,             # トークン使用統計
    "total_cost_usd": float | None,  # USDでの総コスト
    "duration_ms": int | None         # ミリ秒単位の実行期間
}
```

### Bash

**ツール名:** `Bash`

**入力:**

```python
{
    "command": str,                  # 実行するコマンド
    "timeout": int | None,           # オプションのタイムアウト（ミリ秒、最大600000）
    "description": str | None,       # 明確で簡潔な説明（5～10語）
    "run_in_background": bool | None # バックグラウンドで実行する場合はtrueに設定
}
```

**出力:**

```python
{
    "output": str,              # 標準出力と標準エラーの結合出力
    "exitCode": int,            # コマンドの終了コード
    "killed": bool | None,      # タイムアウトによってコマンドが強制終了されたかどうか
    "shellId": str | None       # バックグラウンドプロセス用のシェルID
}
```

### Edit

**ツール名:** `Edit`

**入力:**

```python
{
    "file_path": str,           # 変更するファイルの絶対パス
    "old_string": str,          # 置換するテキスト
    "new_string": str,          # 置換先のテキスト
    "replace_all": bool | None  # すべての出現を置換（デフォルトFalse）
}
```

**出力:**

```python
{
    "message": str,      # 確認メッセージ
    "replacements": int, # 行われた置換の数
    "file_path": str     # 編集されたファイルパス
}
```

### Read

**ツール名:** `Read`

**入力:**

```python
{
    "file_path": str,       # 読み込むファイルの絶対パス
    "offset": int | None,   # 読み込みを開始する行番号
    "limit": int | None     # 読み込む行数
}
```

**出力（テキストファイル）:**

```python
{
    "content": str,         # 行番号付きのファイル内容
    "total_lines": int,     # ファイルの総行数
    "lines_returned": int   # 実際に返された行数
}
```

**出力（画像）:**

```python
{
    "image": str,       # Base64エンコードされた画像データ
    "mime_type": str,   # 画像MIMEタイプ
    "file_size": int    # バイト単位のファイルサイズ
}
```

### Write

**ツール名:** `Write`

**入力:**

```python
{
    "file_path": str,  # 書き込むファイルの絶対パス
    "content": str     # ファイルに書き込むコンテンツ
}
```

**出力:**

```python
{
    "message": str,        # 成功メッセージ
    "bytes_written": int,  # 書き込まれたバイト数
    "file_path": str       # 書き込まれたファイルパス
}
```

### Glob

**ツール名:** `Glob`

**入力:**

```python
{
    "pattern": str,       # ファイルをマッチングするglobパターン
    "path": str | None    # 検索するディレクトリ（デフォルトはcwd）
}
```

**出力:**

```python
{
    "matches": list[str],  # マッチングしたファイルパスの配列
    "count": int,          # 見つかったマッチ数
    "search_path": str     # 使用された検索ディレクトリ
}
```

### Grep

**ツール名:** `Grep`

**入力:**

```python
{
    "pattern": str,                    # 正規表現パターン
    "path": str | None,                # 検索するファイルまたはディレクトリ
    "glob": str | None,                # ファイルをフィルタリングするglobパターン
    "type": str | None,                # 検索するファイルタイプ
    "output_mode": str | None,         # "content"、"files_with_matches"、または"count"
    "-i": bool | None,                 # 大文字小文字を区別しない検索
    "-n": bool | None,                 # 行番号を表示
    "-B": int | None,                  # 各マッチの前に表示する行
    "-A": int | None,                  # 各マッチの後に表示する行
    "-C": int | None,                  # 前後に表示する行
    "head_limit": int | None,          # 出力を最初のN行/エントリに制限
    "multiline": bool | None           # マルチラインモードを有効化
}
```

**出力（contentモード）:**

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

**出力（files_with_matchesモード）:**

```python
{
    "files": list[str],  # マッチを含むファイル
    "count": int         # マッチを含むファイル数
}
```

### NotebookEdit

**ツール名:** `NotebookEdit`

**入力:**

```python
{
    "notebook_path": str,                     # Jupyterノートブックへの絶対パス
    "cell_id": str | None,                    # 編集するセルのID
    "new_source": str,                        # セルの新しいソース
    "cell_type": "code" | "markdown" | None,  # セルのタイプ
    "edit_mode": "replace" | "insert" | "delete" | None  # 編集操作タイプ
}
```

**出力:**

```python
{
    "message": str,                              # 成功メッセージ
    "edit_type": "replaced" | "inserted" | "deleted",  # 実行された編集のタイプ
    "cell_id": str | None,                       # 影響を受けたセルID
    "total_cells": int                           # 編集後のノートブックの総セル数
}
```

### WebFetch

**ツール名:** `WebFetch`

**入力:**

```python
{
    "url": str,     # コンテンツを取得するURL
    "prompt": str   # 取得したコンテンツで実行するプロンプト
}
```

**出力:**

```python
{
    "response": str,           # プロンプトに対するAIモデルの応答
    "url": str,                # 取得されたURL
    "final_url": str | None,   # リダイレクト後の最終URL
    "status_code": int | None  # HTTPステータスコード
}
```

### WebSearch

**ツール名:** `WebSearch`

**入力:**

```python
{
    "query": str,                        # 使用する検索クエリ
    "allowed_domains": list[str] | None, # これらのドメインからのみ結果を含める
    "blocked_domains": list[str] | None  # これらのドメインからの結果は含めない
}
```

**出力:**

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

**ツール名:** `TodoWrite`

**入力:**

```python
{
    "todos": [
        {
            "content": str,                              # タスクの説明
            "status": "pending" | "in_progress" | "completed",  # タスクステータス
            "activeForm": str                            # 説明のアクティブフォーム
        }
    ]
}
```

**出力:**

```python
{
    "message": str,  # 成功メッセージ
    "stats": {
        "total": int,
        "pending": int,
        "in_progress": int,
        "completed": int
    }
}
```

### BashOutput

**ツール名:** `BashOutput`

**入力:**

```python
{
    "bash_id": str,       # バックグラウンドシェルのID
    "filter": str | None  # 出力行をフィルタリングするオプションの正規表現
}
```

**出力:**

```python
{
    "output": str,                                      # 最後のチェック以降の新しい出力
    "status": "running" | "completed" | "failed",       # 現在のシェルステータス
    "exitCode": int | None                              # 完了時の終了コード
}
```

### KillBash

**ツール名:** `KillBash`

**入力:**

```python
{
    "shell_id": str  # 強制終了するバックグラウンドシェルのID
}
```

**出力:**

```python
{
    "message": str,  # 成功メッセージ
    "shell_id": str  # 強制終了されたシェルのID
}
```

### ExitPlanMode

**ツール名:** `ExitPlanMode`

**入力:**

```python
{
    "plan": str  # ユーザーの承認のために実行するプラン
}
```

**出力:**

```python
{
    "message": str,          # 確認メッセージ
    "approved": bool | None  # ユーザーがプランを承認したかどうか
}
```

### ListMcpResources

**ツール名:** `ListMcpResources`

**入力:**

```python
{
    "server": str | None  # リソースをフィルタリングするオプションのサーバー名
}
```

**出力:**

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

**ツール名:** `ReadMcpResource`

**入力:**

```python
{
    "server": str,  # MCPサーバー名
    "uri": str      # 読み込むリソースURI
}
```

**出力:**

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

## ClaudeSDKClientを使用した高度な機能

### 継続的な会話インターフェースの構築

```python
from claude_agent_sdk import ClaudeSDKClient, ClaudeAgentOptions, AssistantMessage, TextBlock
import asyncio

class ConversationSession:
    """Claudeとの単一の会話セッションを維持します。"""

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
                # 新しいセッションのために切断して再接続
                await self.client.disconnect()
                await self.client.connect()
                self.turn_count = 0
                print("Started new conversation session (previous context cleared)")
                continue

            # メッセージを送信 - Claudeはこのセッション内のすべての前のメッセージを覚えています
            await self.client.query(user_input)
            self.turn_count += 1

            # レスポンスを処理
            print(f"[Turn {self.turn_count}] Claude: ", end="")
            async for message in self.client.receive_response():
                if isinstance(message, AssistantMessage):
                    for block in message.content:
                        if isinstance(block, TextBlock):
                            print(block.text, end="")
            print()  # レスポンス後の新しい行

        await self.client.disconnect()
        print(f"Conversation ended after {self.turn_count} turns.")

async def main():
    options = ClaudeAgentOptions(
        allowed_tools=["Read", "Write", "Bash"],
        permission_mode="acceptEdits"
    )
    session = ConversationSession(options)
    await session.start()

# 会話例：
# Turn 1 - You: "Create a file called hello.py"
# Turn 1 - Claude: "I'll create a hello.py file for you..."
# Turn 2 - You: "What's in that file?"
# Turn 2 - Claude: "The hello.py file I just created contains..." (覚えています！)
# Turn 3 - You: "Add a main function to it"
# Turn 3 - Claude: "I'll add a main function to hello.py..." (どのファイルかわかっています！)

asyncio.run(main())
```

### 動作修正のためのフックの使用

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
    """実行前にすべてのツール使用をログします。"""
    tool_name = input_data.get('tool_name', 'unknown')
    print(f"[PRE-TOOL] About to use: {tool_name}")

    # ここでツール実行を変更またはブロックできます
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
    """ツール実行後に結果をログします。"""
    tool_name = input_data.get('tool_name', 'unknown')
    print(f"[POST-TOOL] Completed: {tool_name}")
    return {}

async def user_prompt_modifier(
    input_data: dict[str, Any],
    tool_use_id: str | None,
    context: HookContext
) -> dict[str, Any]:
    """ユーザープロンプトにコンテキストを追加します。"""
    original_prompt = input_data.get('prompt', '')

    # すべてのプロンプトにタイムスタンプを追加
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
            # フックは自動的にツール使用をログします
            pass

asyncio.run(main())
```

### リアルタイム進捗監視

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

        # リアルタイムで進捗を監視
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

            # 最終結果を受け取ったかどうかを確認
            if hasattr(message, 'subtype') and message.subtype in ['success', 'error']:
                print(f"\n🎯 Task completed!")
                break

asyncio.run(monitor_progress())
```

## 使用例

### 基本的なファイル操作（queryを使用）

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

### エラーハンドリング

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

### クライアントを使用したストリーミングモード

```python
from claude_agent_sdk import ClaudeSDKClient
import asyncio

async def interactive_session():
    async with ClaudeSDKClient() as client:
        # 初期メッセージを送信
        await client.query("What's the weather like?")

        # レスポンスを処理
        async for msg in client.receive_response():
            print(msg)

        # フォローアップを送信
        await client.query("Tell me more about that")

        # フォローアップレスポンスを処理
        async for msg in client.receive_response():
            print(msg)

asyncio.run(interactive_session())
```

### ClaudeSDKClientでカスタムツールを使用

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

# @toolデコレータでカスタムツールを定義
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
    # カスタムツールでSDK MCPサーバーを作成
    my_server = create_sdk_mcp_server(
        name="utilities",
        version="1.0.0",
        tools=[calculate, get_time]
    )

    # サーバーでオプションを設定
    options = ClaudeAgentOptions(
        mcp_servers={"utils": my_server},
        allowed_tools=[
            "mcp__utils__calculate",
            "mcp__utils__get_time"
        ]
    )

    # インタラクティブなツール使用のためにClaudeSDKClientを使用
    async with ClaudeSDKClient(options=options) as client:
        await client.query("What's 123 * 456?")

        # 計算レスポンスを処理
        async for message in client.receive_response():
            if isinstance(message, AssistantMessage):
                for block in message.content:
                    if isinstance(block, TextBlock):
                        print(f"Calculation: {block.text}")

        # 時刻クエリでフォローアップ
        await client.query("What time is it now?")

        async for message in client.receive_response():
            if isinstance(message, AssistantMessage):
                for block in message.content:
                    if isinstance(block, TextBlock):
                        print(f"Time: {block.text}")

asyncio.run(main())
```

## サンドボックス設定

### `SandboxSettings`

サンドボックス動作の設定。これを使用してコマンドサンドボックスを有効にし、ネットワーク制限をプログラムで設定します。

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

| プロパティ | 型 | デフォルト | 説明 |
| :------- | :--- | :------ | :---------- |
| `enabled` | `bool` | `False` | コマンド実行のサンドボックスモードを有効化 |
| `autoAllowBashIfSandboxed` | `bool` | `False` | サンドボックスが有効な場合、bashコマンドを自動承認 |
| `excludedCommands` | `list[str]` | `[]` | 常にサンドボックス制限をバイパスするコマンド（例：`["docker"]`）。これらはモデルの関与なしに自動的にサンドボックス外で実行されます |
| `allowUnsandboxedCommands` | `bool` | `False` | モデルがサンドボックス外でコマンドを実行するようリクエストすることを許可。`True`の場合、モデルはツール入力で`dangerouslyDisableSandbox`を設定でき、これは[パーミッションシステム](#permissions-fallback-for-unsandboxed-commands)にフォールバックします |
| `network` | [`SandboxNetworkConfig`](#sandboxnetworkconfig) | `None` | ネットワーク固有のサンドボックス設定 |
| `ignoreViolations` | [`SandboxIgnoreViolations`](#sandboxignoreviolations) | `None` | 無視するサンドボックス違反を設定 |
| `enableWeakerNestedSandbox` | `bool` | `False` | 互換性のための弱いネストされたサンドボックスを有効化 |

<Note>
**ファイルシステムとネットワークアクセス制限**はサンドボックス設定では設定されません。代わりに、[パーミッションルール](https://code.claude.com/docs/ja/settings#permission-settings)から派生します：

- **ファイルシステム読み込み制限**: 読み込み拒否ルール
- **ファイルシステム書き込み制限**: 編集許可/拒否ルール
- **ネットワーク制限**: WebFetch許可/拒否ルール

コマンド実行サンドボックスにはサンドボックス設定を使用し、ファイルシステムとネットワークアクセス制御にはパーミッションルールを使用します。
</Note>

#### 使用例

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

サンドボックスモード用のネットワーク固有設定。

```python
class SandboxNetworkConfig(TypedDict, total=False):
    allowLocalBinding: bool
    allowUnixSockets: list[str]
    allowAllUnixSockets: bool
    httpProxyPort: int
    socksProxyPort: int
```

| プロパティ | 型 | デフォルト | 説明 |
| :------- | :--- | :------ | :---------- |
| `allowLocalBinding` | `bool` | `False` | プロセスがローカルポートにバインドすることを許可（例：開発サーバー用） |
| `allowUnixSockets` | `list[str]` | `[]` | プロセスがアクセスできるUnixソケットパス（例：Dockerソケット） |
| `allowAllUnixSockets` | `bool` | `False` | すべてのUnixソケットへのアクセスを許可 |
| `httpProxyPort` | `int` | `None` | ネットワークリクエスト用HTTPプロキシポート |
| `socksProxyPort` | `int` | `None` | ネットワークリクエスト用SOCKSプロキシポート |

### `SandboxIgnoreViolations`

特定のサンドボックス違反を無視するための設定。

```python
class SandboxIgnoreViolations(TypedDict, total=False):
    file: list[str]
    network: list[str]
```

| プロパティ | 型 | デフォルト | 説明 |
| :------- | :--- | :------ | :---------- |
| `file` | `list[str]` | `[]` | 違反を無視するファイルパスパターン |
| `network` | `list[str]` | `[]` | 違反を無視するネットワークパターン |

### サンドボックス外コマンドのパーミッションフォールバック

`allowUnsandboxedCommands`が有効な場合、モデルはツール入力で`dangerouslyDisableSandbox: True`を設定することでサンドボックス外でコマンドを実行するようリクエストできます。これらのリクエストは既存のパーミッションシステムにフォールバックします。つまり、`can_use_tool`ハンドラが呼び出され、カスタム認可ロジックを実装できます。

<Note>
**`excludedCommands` vs `allowUnsandboxedCommands`:**
- `excludedCommands`: 常に自動的にサンドボックスをバイパスするコマンドの静的リスト（例：`["docker"]`）。モデルはこれを制御できません。
- `allowUnsandboxedCommands`: モデルが実行時にツール入力で`dangerouslyDisableSandbox: True`を設定することでサンドボックス外実行をリクエストすることを許可します。
</Note>

```python
from claude_agent_sdk import query, ClaudeAgentOptions

async def can_use_tool(tool: str, input: dict) -> bool:
    # モデルがサンドボックスをバイパスするようリクエストしているかを確認
    if tool == "Bash" and input.get("dangerouslyDisableSandbox"):
        # モデルはこのコマンドをサンドボックス外で実行したい
        print(f"Unsandboxed command requested: {input.get('command')}")

        # Trueを返して許可、Falseを返して拒否
        return is_command_authorized(input.get("command"))
    return True

async def main():
    async for message in query(
        prompt="Deploy my application",
        options=ClaudeAgentOptions(
            sandbox={
                "enabled": True,
                "allowUnsandboxedCommands": True  # モデルはサンドボックス外実行をリクエストできます
            },
            permission_mode="default",
            can_use_tool=can_use_tool
        )
    ):
        print(message)
```

このパターンにより、以下が可能になります：

- **モデルリクエストを監査**: モデルがサンドボックス外実行をリクエストするときをログ
- **許可リストを実装**: 特定のコマンドのみサンドボックス外で実行することを許可
- **承認ワークフローを追加**: 特権操作に明示的な認可を要求

<Warning>
`dangerouslyDisableSandbox: True`で実行されるコマンドは完全なシステムアクセスを持ちます。`can_use_tool`ハンドラがこれらのリクエストを慎重に検証することを確認してください。
</Warning>

## 関連項目

- [Python SDKガイド](/docs/ja/agent-sdk/python) - チュートリアルと例
- [SDKの概要](/docs/ja/agent-sdk/overview) - 一般的なSDKコンセプト
- [TypeScript SDKリファレンス](/docs/ja/agent-sdk/typescript) - TypeScript SDKドキュメント
- [CLIリファレンス](https://code.claude.com/docs/ja/cli-reference) - コマンドラインインターフェース
- [一般的なワークフロー](https://code.claude.com/docs/ja/common-workflows) - ステップバイステップガイド