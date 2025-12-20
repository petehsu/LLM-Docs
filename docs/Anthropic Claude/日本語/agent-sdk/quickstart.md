# クイックスタート

Python または TypeScript Agent SDK を使用して、自律的に動作する AI エージェントを構築する方法を学びます

---

Agent SDK を使用して、コードを読み、バグを見つけ、手動操作なしでそれらを修正する AI エージェントを構築します。

**実行すること:**
1. Agent SDK でプロジェクトをセットアップする
2. バグのあるコードを含むファイルを作成する
3. バグを自動的に見つけて修正するエージェントを実行する

## 前提条件

- **Node.js 18+** または **Python 3.10+**
- **Anthropic アカウント** ([ここでサインアップ](https://console.anthropic.com/))

## セットアップ

<Steps>
  <Step title="Claude Code をインストール">
    Agent SDK は Claude Code をランタイムとして使用します。プラットフォーム用にインストールしてください:

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

    Claude Code をマシンにインストールした後、ターミナルで `claude` を実行し、プロンプトに従って認証してください。SDK はこの認証を自動的に使用します。

    <Tip>
    Claude Code インストールの詳細については、[Claude Code セットアップ](https://docs.anthropic.com/ja/docs/claude-code/setup)を参照してください。
    </Tip>
  </Step>

  <Step title="プロジェクトフォルダを作成">
    このクイックスタート用に新しいディレクトリを作成してください:

    ```bash
    mkdir my-agent && cd my-agent
    ```

    独自のプロジェクトの場合、任意のフォルダから SDK を実行できます。デフォルトでは、そのディレクトリとそのサブディレクトリ内のファイルにアクセスできます。
  </Step>

  <Step title="SDK をインストール">
    言語用の Agent SDK パッケージをインストールしてください:

    <Tabs>
      <Tab title="TypeScript">
        ```bash
        npm install @anthropic-ai/claude-agent-sdk
        ```
      </Tab>
      <Tab title="Python (uv)">
        [uv](https://docs.astral.sh/uv/) は、仮想環境を自動的に処理する高速 Python パッケージマネージャーです:
        ```bash
        uv init && uv add claude-agent-sdk
        ```
      </Tab>
      <Tab title="Python (pip)">
        まず仮想環境を作成してからインストールしてください:
        ```bash
        python3 -m venv .venv && source .venv/bin/activate
        pip3 install claude-agent-sdk
        ```
      </Tab>
    </Tabs>
  </Step>

  <Step title="API キーを設定">
    Claude Code を既に認証している場合 (ターミナルで `claude` を実行することで)、SDK はその認証を自動的に使用します。

    それ以外の場合は、API キーが必要です。これは [Anthropic Console](https://console.anthropic.com/) から取得できます。

    プロジェクトディレクトリに `.env` ファイルを作成し、API キーをそこに保存してください:

    ```bash
    ANTHROPIC_API_KEY=your-api-key
    ```

    <Note>
    **Amazon Bedrock、Google Vertex AI、または Microsoft Azure を使用していますか?** [Bedrock](https://code.claude.com/docs/ja/amazon-bedrock)、[Vertex AI](https://code.claude.com/docs/ja/google-vertex-ai)、または [Azure AI Foundry](https://code.claude.com/docs/ja/azure-ai-foundry) のセットアップガイドを参照してください。

    特に承認されていない限り、サードパーティの開発者が Claude Agent SDK で構築されたエージェントを含む、製品に対して Claude.ai ログインまたはレート制限を提供することは許可されていません。代わりに、このドキュメントで説明されている API キー認証方法を使用してください。
    </Note>
  </Step>
</Steps>

## バグのあるファイルを作成

このクイックスタートでは、コード内のバグを見つけて修正できるエージェントを構築する方法を説明します。まず、エージェントが修正するための意図的なバグを含むファイルが必要です。`my-agent` ディレクトリに `utils.py` を作成し、以下のコードを貼り付けてください:

```python
def calculate_average(numbers):
    total = 0
    for num in numbers:
        total += num
    return total / len(numbers)

def get_user_name(user):
    return user["name"].upper()
```

このコードには 2 つのバグがあります:
1. `calculate_average([])` はゼロで除算してクラッシュします
2. `get_user_name(None)` は TypeError でクラッシュします

## バグを見つけて修正するエージェントを構築

Python SDK を使用している場合は `agent.py` を作成し、TypeScript の場合は `agent.ts` を作成してください:

<CodeGroup>
```python Python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions, AssistantMessage, ResultMessage

async def main():
    # Agentic loop: Claude が動作するときにメッセージをストリーミングします
    async for message in query(
        prompt="Review utils.py for bugs that would cause crashes. Fix any issues you find.",
        options=ClaudeAgentOptions(
            allowed_tools=["Read", "Edit", "Glob"],  # Claude が使用できるツール
            permission_mode="acceptEdits"            # ファイル編集を自動承認
        )
    ):
        # 人間が読める出力を印刷
        if isinstance(message, AssistantMessage):
            for block in message.content:
                if hasattr(block, "text"):
                    print(block.text)              # Claude の推論
                elif hasattr(block, "name"):
                    print(f"Tool: {block.name}")   # 呼び出されているツール
        elif isinstance(message, ResultMessage):
            print(f"Done: {message.subtype}")      # 最終結果

asyncio.run(main())
```

```typescript TypeScript
import { query } from "@anthropic-ai/claude-agent-sdk";

// Agentic loop: Claude が動作するときにメッセージをストリーミングします
for await (const message of query({
  prompt: "Review utils.py for bugs that would cause crashes. Fix any issues you find.",
  options: {
    allowedTools: ["Read", "Edit", "Glob"],  // Claude が使用できるツール
    permissionMode: "acceptEdits"            // ファイル編集を自動承認
  }
})) {
  // 人間が読める出力を印刷
  if (message.type === "assistant" && message.message?.content) {
    for (const block of message.message.content) {
      if ("text" in block) {
        console.log(block.text);             // Claude の推論
      } else if ("name" in block) {
        console.log(`Tool: ${block.name}`);  // 呼び出されているツール
      }
    }
  } else if (message.type === "result") {
    console.log(`Done: ${message.subtype}`); // 最終結果
  }
}
```
</CodeGroup>

このコードには 3 つの主要な部分があります:

1. **`query`**: agentic ループを作成するメインエントリーポイント。非同期イテレータを返すため、`async for` を使用して Claude が動作するときにメッセージをストリーミングします。完全な API については、[Python](/docs/ja/agent-sdk/python#query) または [TypeScript](/docs/ja/agent-sdk/typescript#query) SDK リファレンスを参照してください。

2. **`prompt`**: Claude に実行させたいこと。Claude はタスクに基づいて使用するツールを判断します。

3. **`options`**: エージェントの設定。この例では `allowedTools` を使用して Claude を `Read`、`Edit`、`Glob` に制限し、`permissionMode: "acceptEdits"` を使用してファイル変更を自動承認します。その他のオプションには `systemPrompt`、`mcpServers` などがあります。[Python](/docs/ja/agent-sdk/python#claudeagentoptions) または [TypeScript](/docs/ja/agent-sdk/typescript#claudeagentoptions) のすべてのオプションを参照してください。

`async for` ループは Claude が考え、ツールを呼び出し、結果を観察し、次に何をするかを決定する間、実行し続けます。各反復は、Claude の推論、ツール呼び出し、ツール結果、または最終結果のいずれかのメッセージを生成します。SDK はオーケストレーション (ツール実行、コンテキスト管理、再試行) を処理するため、ストリームを消費するだけです。Claude がタスクを完了するか、エラーに遭遇するとループが終了します。

ループ内のメッセージ処理は、人間が読める出力をフィルタリングします。フィルタリングなしでは、システム初期化と内部状態を含む生のメッセージオブジェクトが表示されます。これはデバッグに役立ちますが、それ以外の場合はノイズが多いです。

<Note>
この例はストリーミングを使用してリアルタイムで進行状況を表示します。ライブ出力が不要な場合 (バックグラウンドジョブや CI パイプラインなど)、すべてのメッセージを一度に収集できます。詳細については、[ストリーミング対単一ターンモード](/docs/ja/agent-sdk/streaming-vs-single-mode)を参照してください。
</Note>

### エージェントを実行

エージェントの準備ができました。次のコマンドで実行してください:

<CodeGroup>
```bash Python
python3 agent.py
```

```bash TypeScript
npx tsx agent.ts
```
</CodeGroup>

実行後、`utils.py` を確認してください。空のリストと null ユーザーを処理する防御的なコードが表示されます。エージェントは自律的に:

1. **読み取り** `utils.py` でコードを理解
2. **分析** ロジックを分析し、クラッシュを引き起こすエッジケースを特定
3. **編集** ファイルを編集して適切なエラーハンドリングを追加

これが Agent SDK を異なるものにする理由です: Claude は実装を求める代わりに、ツールを直接実行します。

<Note>
「Claude Code not found」が表示される場合は、[Claude Code をインストール](#install-claude-code)してターミナルを再起動してください。「API key not found」の場合は、[API キーを設定](#set-your-api-key)してください。詳細については、[完全なトラブルシューティングガイド](https://docs.anthropic.com/ja/docs/claude-code/troubleshooting)を参照してください。
</Note>

### 他のプロンプトを試す

エージェントがセットアップされたので、異なるプロンプトを試してください:

- `"Add docstrings to all functions in utils.py"`
- `"Add type hints to all functions in utils.py"`
- `"Create a README.md documenting the functions in utils.py"`

### エージェントをカスタマイズ

オプションを変更することで、エージェントの動作を変更できます。いくつかの例を次に示します:

**Web 検索機能を追加:**

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

**Claude にカスタムシステムプロンプトを提供:**

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

**ターミナルでコマンドを実行:**

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

`Bash` が有効な場合、試してください: `"Write unit tests for utils.py, run them, and fix any failures"`

## 主要な概念

**ツール** はエージェントが何ができるかを制御します:

| ツール | エージェントが実行できること |
|-------|----------------------|
| `Read`、`Glob`、`Grep` | 読み取り専用分析 |
| `Read`、`Edit`、`Glob` | コードの分析と変更 |
| `Read`、`Edit`、`Bash`、`Glob`、`Grep` | 完全な自動化 |

**権限モード** は、必要な人間の監視の量を制御します:

| モード | 動作 | ユースケース |
|------|----------|----------|
| `acceptEdits` | ファイル編集を自動承認し、他のアクションを要求 | 信頼できる開発ワークフロー |
| `bypassPermissions` | プロンプトなしで実行 | CI/CD パイプライン、自動化 |
| `default` | 承認を処理するために `canUseTool` コールバックが必要 | カスタム承認フロー |

上記の例は `acceptEdits` モードを使用しており、ファイル操作を自動承認するため、エージェントはインタラクティブなプロンプトなしで実行できます。ユーザーに承認を促す場合は、`default` モードを使用し、ユーザー入力を収集する [`canUseTool` コールバック](/docs/ja/agent-sdk/permissions#canusetool) を提供してください。より詳細な制御については、[権限](/docs/ja/agent-sdk/permissions)を参照してください。

## 次のステップ

最初のエージェントを作成したので、その機能を拡張し、ユースケースに合わせてカスタマイズする方法を学びます:

- **[権限](/docs/ja/agent-sdk/permissions)**: エージェントが何ができるか、いつ承認が必要かを制御
- **[フック](/docs/ja/agent-sdk/hooks)**: ツール呼び出しの前後にカスタムコードを実行
- **[セッション](/docs/ja/agent-sdk/sessions)**: コンテキストを維持する複数ターンエージェントを構築
- **[MCP サーバー](/docs/ja/agent-sdk/mcp)**: データベース、ブラウザ、API、その他の外部システムに接続
- **[ホスティング](/docs/ja/agent-sdk/hosting)**: Docker、クラウド、CI/CD にエージェントをデプロイ
- **[サンプルエージェント](https://github.com/anthropics/claude-agent-sdk-demos)**: 完全な例を参照: メールアシスタント、リサーチエージェント、その他