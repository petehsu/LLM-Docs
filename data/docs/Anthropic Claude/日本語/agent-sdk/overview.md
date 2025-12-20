# Agent SDK概要

Claude Codeをライブラリとして使用して本番環境のAIエージェントを構築する

---

<Note>
Claude Code SDKはClaude Agent SDKに名前が変更されました。古いSDKから移行する場合は、[移行ガイド](/docs/ja/agent-sdk/migration-guide)を参照してください。
</Note>

ファイルを自動的に読み取り、コマンドを実行し、ウェブを検索し、コードを編集するなど、さらに多くのことができるAIエージェントを構築します。Agent SDKは、Claude Codeを強化する同じツール、エージェントループ、およびコンテキスト管理をPythonおよびTypeScriptでプログラム可能にします。

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

Agent SDKには、ファイルの読み取り、コマンドの実行、コードの編集用の組み込みツールが含まれているため、ツール実行を実装することなく、エージェントはすぐに動作を開始できます。クイックスタートに進むか、SDKで構築された実際のエージェントを探索してください：

<CardGroup cols={2}>
  <Card title="クイックスタート" icon="play" href="/docs/ja/agent-sdk/quickstart">
    数分でバグ修正エージェントを構築する
  </Card>
  <Card title="エージェントの例" icon="star" href="https://github.com/anthropics/claude-agent-sdk-demos">
    メールアシスタント、リサーチエージェント、その他
  </Card>
</CardGroup>

## 機能

Claude Codeを強力にするすべてのものがSDKで利用可能です：

<Tabs>
  <Tab title="組み込みツール">
    エージェントは、ファイルの読み取り、コマンドの実行、コードベースの検索をすぐに実行できます。主要なツールは以下の通りです：

    | ツール | 機能 |
    |------|--------------|
    | **Read** | 作業ディレクトリ内の任意のファイルを読み取る |
    | **Write** | 新しいファイルを作成する |
    | **Edit** | 既存ファイルに正確な編集を加える |
    | **Bash** | ターミナルコマンド、スクリプト、git操作を実行する |
    | **Glob** | パターンでファイルを検索する（`**/*.ts`、`src/**/*.py`） |
    | **Grep** | 正規表現でファイルコンテンツを検索する |
    | **WebSearch** | 最新情報についてウェブを検索する |
    | **WebFetch** | ウェブページコンテンツを取得して解析する |

    この例は、コードベースのTODOコメントを検索するエージェントを作成します：

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
  <Tab title="フック">
    エージェントのライフサイクルの重要なポイントでカスタムコードを実行します。フックはシェルコマンドまたはカスタムスクリプトを実行して、エージェントの動作を検証、ログ、ブロック、または変換できます。

    **利用可能なフック：** `PreToolUse`、`PostToolUse`、`Stop`、`SessionStart`、`SessionEnd`、`UserPromptSubmit`、その他。

    この例は、すべてのファイル変更を監査ファイルにログします：

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

    [フックについてさらに詳しく →](/docs/ja/agent-sdk/hooks)
  </Tab>
  <Tab title="サブエージェント">
    特化したエージェントを生成して、焦点を絞ったサブタスクを処理します。メインエージェントが作業を委譲し、サブエージェントが結果を報告します。

    `Task`ツールを有効にして、Claudeがタスクが委譲から利益を得るのに十分に複雑であると判断したときにサブエージェントを生成できるようにします。Claudeはタスクの複雑さに基づいてサブエージェントを使用するタイミングを自動的に決定します。

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

    `agents`オプションを使用してカスタムエージェントタイプを定義して、より特化した委譲パターンを実現することもできます。

    [サブエージェントについてさらに詳しく →](/docs/ja/agent-sdk/subagents)
  </Tab>
  <Tab title="MCP">
    Model Context Protocolを介して外部システムに接続します：データベース、ブラウザ、API、および[数百以上](https://github.com/modelcontextprotocol/servers)。

    この例は、[Playwright MCPサーバー](https://github.com/microsoft/playwright-mcp)を接続して、エージェントにブラウザ自動化機能を提供します：

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

    [MCPについてさらに詳しく →](/docs/ja/agent-sdk/mcp)
  </Tab>
  <Tab title="権限">
    エージェントが使用できるツールを正確に制御します。安全な操作を許可し、危険な操作をブロックするか、機密アクションの承認を要求します。

    この例は、コードを分析できるが変更できない読み取り専用エージェントを作成します：

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

    [権限についてさらに詳しく →](/docs/ja/agent-sdk/permissions)
  </Tab>
  <Tab title="セッション">
    複数の交換にわたってコンテキストを維持します。Claudeは読み取ったファイル、実行した分析、会話履歴を記憶します。後でセッションを再開するか、異なるアプローチを探索するためにフォークします。

    この例は、最初のクエリからセッションIDをキャプチャし、その後完全なコンテキストで再開します：

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

    [セッションについてさらに詳しく →](/docs/ja/agent-sdk/sessions)
  </Tab>
</Tabs>

### Claude Codeの機能

SDKはClaude Codeのファイルシステムベースの設定もサポートしています。これらの機能を使用するには、オプションで`setting_sources=["project"]`（Python）または`settingSources: ['project']`（TypeScript）を設定します。

| 機能 | 説明 | 場所 |
|---------|-------------|----------|
| [スキル](/docs/ja/agent-sdk/skills) | Markdownで定義された特化した機能 | `.claude/skills/SKILL.md` |
| [スラッシュコマンド](/docs/ja/agent-sdk/slash-commands) | 一般的なタスク用のカスタムコマンド | `.claude/commands/*.md` |
| [メモリ](/docs/ja/agent-sdk/modifying-system-prompts) | プロジェクトコンテキストと指示 | `CLAUDE.md`または`.claude/CLAUDE.md` |
| [プラグイン](/docs/ja/agent-sdk/plugins) | カスタムコマンド、エージェント、MCPサーバーで拡張 | `plugins`オプション経由でプログラム的に |

## 開始する

<Steps>
  <Step title="Claude Codeをインストールする">
    SDKはClaude Codeをランタイムとして使用します：

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

    Windowsおよび他のオプションについては、[Claude Codeセットアップ](https://docs.anthropic.com/en/docs/claude-code/setup)を参照してください。
  </Step>
  <Step title="SDKをインストールする">
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
  <Step title="APIキーを設定する">
    ```bash
    export ANTHROPIC_API_KEY=your-api-key
    ```
    [コンソール](https://console.anthropic.com/)からキーを取得します。

    SDKはサードパーティAPIプロバイダー経由の認証もサポートしています：

    - **Amazon Bedrock**: `CLAUDE_CODE_USE_BEDROCK=1`環境変数を設定し、AWSの認証情報を構成します
    - **Google Vertex AI**: `CLAUDE_CODE_USE_VERTEX=1`環境変数を設定し、Google Cloudの認証情報を構成します
    - **Microsoft Foundry**: `CLAUDE_CODE_USE_FOUNDRY=1`環境変数を設定し、Azureの認証情報を構成します

    <Note>
    以前に承認されていない限り、当社はサードパーティ開発者がClaude.aiログインまたはレート制限をそれらの製品に提供することを許可していません。これには、Claude Agent SDKで構築されたエージェントも含まれます。代わりに、このドキュメントで説明されているAPIキー認証方法を使用してください。
    </Note>
  </Step>
  <Step title="最初のエージェントを実行する">
    この例は、組み込みツールを使用して現在のディレクトリ内のファイルをリストするエージェントを作成します。

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

**構築する準備はできていますか？** [クイックスタート](/docs/ja/agent-sdk/quickstart)に従って、数分でバグを見つけて修正するエージェントを作成します。

## Agent SDKと他のClaudeツールを比較する

Claudeプラットフォームは、Claudeで構築するための複数の方法を提供しています。Agent SDKがどのように適合するかは以下の通りです：

<Tabs>
  <Tab title="Agent SDK対Client SDK">
    [Anthropic Client SDK](/docs/ja/api/client-sdks)は直接APIアクセスを提供します：プロンプトを送信し、ツール実行を自分で実装します。**Agent SDK**は、組み込みツール実行を備えたClaudeを提供します。

    Client SDKでは、ツールループを実装します。Agent SDKでは、Claudeがそれを処理します：

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
  <Tab title="Agent SDK対Claude Code CLI">
    同じ機能、異なるインターフェース：

    | ユースケース | 最適な選択 |
    |----------|-------------|
    | インタラクティブ開発 | CLI |
    | CI/CDパイプライン | SDK |
    | カスタムアプリケーション | SDK |
    | ワンオフタスク | CLI |
    | 本番環境の自動化 | SDK |

    多くのチームは両方を使用しています：日常の開発にはCLI、本番環境にはSDK。ワークフローはそれらの間で直接変換されます。
  </Tab>
</Tabs>

## 変更ログ

SDKの更新、バグ修正、新機能の完全な変更ログを表示します：

- **TypeScript SDK**: [CHANGELOG.mdを表示](https://github.com/anthropics/claude-agent-sdk-typescript/blob/main/CHANGELOG.md)
- **Python SDK**: [CHANGELOG.mdを表示](https://github.com/anthropics/claude-agent-sdk-python/blob/main/CHANGELOG.md)

## バグの報告

Agent SDKでバグまたは問題が発生した場合：

- **TypeScript SDK**: [GitHubで問題を報告](https://github.com/anthropics/claude-agent-sdk-typescript/issues)
- **Python SDK**: [GitHubで問題を報告](https://github.com/anthropics/claude-agent-sdk-python/issues)

## ブランドガイドライン

Claude Agent SDKを統合するパートナーの場合、Claudeブランドの使用はオプションです。製品内でClaudeを参照する場合：

**許可されている：**
- 「Claude Agent」（ドロップダウンメニューに推奨）
- 「Claude」（既に「エージェント」というラベルが付いたメニュー内の場合）
- 「{YourAgentName} Powered by Claude」（既存のエージェント名がある場合）

**許可されていない：**
- 「Claude Code」または「Claude Code Agent」
- Claude Codeをミミックするブランド化されたASCIIアートまたはビジュアル要素

製品は独自のブランドを維持し、Claude CodeまたはAnthropicの製品のように見えるべきではありません。ブランドコンプライアンスについてのご質問は、当社の[営業チーム](https://www.anthropic.com/contact-sales)にお問い合わせください。

## ライセンスと利用規約

Claude Agent SDKの使用は、[Anthropicの商用利用規約](https://www.anthropic.com/legal/commercial-terms)によって管理されます。これは、独自の顧客およびエンドユーザーに利用可能にする製品およびサービスを強化するためにそれを使用する場合を含みます。ただし、特定のコンポーネントまたは依存関係がそのコンポーネントのLICENSEファイルに示されている別のライセンスでカバーされている場合を除きます。

## 次のステップ

<CardGroup cols={2}>
  <Card title="クイックスタート" icon="play" href="/docs/ja/agent-sdk/quickstart">
    数分でバグを見つけて修正するエージェントを構築する
  </Card>
  <Card title="エージェントの例" icon="star" href="https://github.com/anthropics/claude-agent-sdk-demos">
    メールアシスタント、リサーチエージェント、その他
  </Card>
  <Card title="TypeScript SDK" icon="code" href="/docs/ja/agent-sdk/typescript">
    完全なTypeScript APIリファレンスと例
  </Card>
  <Card title="Python SDK" icon="code" href="/docs/ja/agent-sdk/python">
    完全なPython APIリファレンスと例
  </Card>
</CardGroup>