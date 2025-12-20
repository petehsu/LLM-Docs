# Claude Agent SDK への移行

Claude Code TypeScript および Python SDK を Claude Agent SDK に移行するためのガイド

---

## 概要

Claude Code SDK は **Claude Agent SDK** に名前が変更され、ドキュメントが再編成されました。この変更は、コーディングタスクだけでなく、AI エージェント構築のための SDK のより広い機能を反映しています。

## 変更内容

| 項目                   | 旧                         | 新                              |
| :----------------------- | :-------------------------- | :------------------------------- |
| **パッケージ名 (TS/JS)** | `@anthropic-ai/claude-code` | `@anthropic-ai/claude-agent-sdk` |
| **Python パッケージ**       | `claude-code-sdk`           | `claude-agent-sdk`               |
| **ドキュメント場所** | Claude Code ドキュメント | API ガイド → Agent SDK セクション |

<Note>
**ドキュメント変更:** Agent SDK ドキュメントは Claude Code ドキュメントから API ガイドの専用 [Agent SDK](/docs/ja/agent-sdk/overview) セクションに移動しました。Claude Code ドキュメントは現在、CLI ツールと自動化機能に焦点を当てています。
</Note>

## 移行手順

### TypeScript/JavaScript プロジェクトの場合

**1. 古いパッケージをアンインストール:**

```bash
npm uninstall @anthropic-ai/claude-code
```

**2. 新しいパッケージをインストール:**

```bash
npm install @anthropic-ai/claude-agent-sdk
```

**3. インポートを更新:**

`@anthropic-ai/claude-code` からのすべてのインポートを `@anthropic-ai/claude-agent-sdk` に変更します:

```typescript
// 変更前
import { query, tool, createSdkMcpServer } from "@anthropic-ai/claude-code";

// 変更後
import {
  query,
  tool,
  createSdkMcpServer,
} from "@anthropic-ai/claude-agent-sdk";
```

**4. package.json の依存関係を更新:**

`package.json` にパッケージがリストされている場合は、それを更新します:

```json
// 変更前
{
  "dependencies": {
    "@anthropic-ai/claude-code": "^1.0.0"
  }
}

// 変更後
{
  "dependencies": {
    "@anthropic-ai/claude-agent-sdk": "^0.1.0"
  }
}
```

以上です! その他のコード変更は不要です。

### Python プロジェクトの場合

**1. 古いパッケージをアンインストール:**

```bash
pip uninstall claude-code-sdk
```

**2. 新しいパッケージをインストール:**

```bash
pip install claude-agent-sdk
```

**3. インポートを更新:**

`claude_code_sdk` からのすべてのインポートを `claude_agent_sdk` に変更します:

```python
# 変更前
from claude_code_sdk import query, ClaudeCodeOptions

# 変更後
from claude_agent_sdk import query, ClaudeAgentOptions
```

**4. 型名を更新:**

`ClaudeCodeOptions` を `ClaudeAgentOptions` に変更します:

```python
# 変更前
from claude_agent_sdk import query, ClaudeCodeOptions

options = ClaudeCodeOptions(
    model="claude-sonnet-4-5"
)

# 変更後
from claude_agent_sdk import query, ClaudeAgentOptions

options = ClaudeAgentOptions(
    model="claude-sonnet-4-5"
)
```

**5. [破壊的変更](#breaking-changes) を確認**

移行を完了するために必要なコード変更を行います。

## 破壊的変更

<Warning>
分離の改善と明示的な設定のために、Claude Agent SDK v0.1.0 は Claude Code SDK から移行するユーザーに対して破壊的変更を導入しています。移行前にこのセクションを注意深く確認してください。
</Warning>

### Python: ClaudeCodeOptions が ClaudeAgentOptions に名前変更

**変更内容:** Python SDK の型 `ClaudeCodeOptions` が `ClaudeAgentOptions` に名前変更されました。

**移行:**

```python
# 変更前 (v0.0.x)
from claude_agent_sdk import query, ClaudeCodeOptions

options = ClaudeCodeOptions(
    model="claude-sonnet-4-5",
    permission_mode="acceptEdits"
)

# 変更後 (v0.1.0)
from claude_agent_sdk import query, ClaudeAgentOptions

options = ClaudeAgentOptions(
    model="claude-sonnet-4-5",
    permission_mode="acceptEdits"
)
```

**変更理由:** 型名は「Claude Agent SDK」ブランディングと一致し、SDK の命名規則全体で一貫性を提供します。

### システムプロンプトがデフォルトではなくなった

**変更内容:** SDK はデフォルトで Claude Code のシステムプロンプトを使用しなくなりました。

**移行:**

<CodeGroup>

```typescript TypeScript
// 変更前 (v0.0.x) - デフォルトで Claude Code のシステムプロンプトを使用
const result = query({ prompt: "Hello" });

// 変更後 (v0.1.0) - デフォルトで空のシステムプロンプトを使用
// 古い動作を取得するには、Claude Code のプリセットを明示的にリクエストします:
const result = query({
  prompt: "Hello",
  options: {
    systemPrompt: { type: "preset", preset: "claude_code" }
  }
});

// またはカスタムシステムプロンプトを使用します:
const result = query({
  prompt: "Hello",
  options: {
    systemPrompt: "You are a helpful coding assistant"
  }
});
```

```python Python
# 変更前 (v0.0.x) - デフォルトで Claude Code のシステムプロンプトを使用
async for message in query(prompt="Hello"):
    print(message)

# 変更後 (v0.1.0) - デフォルトで空のシステムプロンプトを使用
# 古い動作を取得するには、Claude Code のプリセットを明示的にリクエストします:
from claude_agent_sdk import query, ClaudeAgentOptions

async for message in query(
    prompt="Hello",
    options=ClaudeAgentOptions(
        system_prompt={"type": "preset", "preset": "claude_code"}  # プリセットを使用
    )
):
    print(message)

# またはカスタムシステムプロンプトを使用します:
async for message in query(
    prompt="Hello",
    options=ClaudeAgentOptions(
        system_prompt="You are a helpful coding assistant"
    )
):
    print(message)
```

</CodeGroup>

**変更理由:** SDK アプリケーションのより良い制御と分離を提供します。Claude Code の CLI 中心の指示を継承することなく、カスタム動作を持つエージェントを構築できるようになりました。

### 設定ソースがデフォルトで読み込まれなくなった

**変更内容:** SDK はデフォルトでファイルシステム設定 (CLAUDE.md、settings.json、スラッシュコマンドなど) を読み込まなくなりました。

**移行:**

<CodeGroup>

```typescript TypeScript
// 変更前 (v0.0.x) - すべての設定を自動的に読み込み
const result = query({ prompt: "Hello" });
// 以下から読み込みます:
// - ~/.claude/settings.json (ユーザー)
// - .claude/settings.json (プロジェクト)
// - .claude/settings.local.json (ローカル)
// - CLAUDE.md ファイル
// - カスタムスラッシュコマンド

// 変更後 (v0.1.0) - デフォルトで設定は読み込まれません
// 古い動作を取得するには:
const result = query({
  prompt: "Hello",
  options: {
    settingSources: ["user", "project", "local"]
  }
});

// または特定のソースのみを読み込みます:
const result = query({
  prompt: "Hello",
  options: {
    settingSources: ["project"]  // プロジェクト設定のみ
  }
});
```

```python Python
# 変更前 (v0.0.x) - すべての設定を自動的に読み込み
async for message in query(prompt="Hello"):
    print(message)
# 以下から読み込みます:
# - ~/.claude/settings.json (ユーザー)
# - .claude/settings.json (プロジェクト)
# - .claude/settings.local.json (ローカル)
# - CLAUDE.md ファイル
# - カスタムスラッシュコマンド

# 変更後 (v0.1.0) - デフォルトで設定は読み込まれません
# 古い動作を取得するには:
from claude_agent_sdk import query, ClaudeAgentOptions

async for message in query(
    prompt="Hello",
    options=ClaudeAgentOptions(
        setting_sources=["user", "project", "local"]
    )
):
    print(message)

# または特定のソースのみを読み込みます:
async for message in query(
    prompt="Hello",
    options=ClaudeAgentOptions(
        setting_sources=["project"]  # プロジェクト設定のみ
    )
):
    print(message)
```

</CodeGroup>

**変更理由:** SDK アプリケーションがローカルファイルシステム設定に依存しない予測可能な動作を確保します。これは特に以下の場合に重要です:
- **CI/CD 環境** - ローカルカスタマイズなしの一貫した動作
- **デプロイされたアプリケーション** - ファイルシステム設定への依存なし
- **テスト** - 分離されたテスト環境
- **マルチテナントシステム** - ユーザー間の設定漏洩を防止

<Note>
**後方互換性:** アプリケーションがファイルシステム設定 (カスタムスラッシュコマンド、CLAUDE.md 指示など) に依存していた場合は、オプションに `settingSources: ['user', 'project', 'local']` を追加します。
</Note>

## 名前変更の理由

Claude Code SDK はもともとコーディングタスク用に設計されていましたが、あらゆるタイプの AI エージェント構築のための強力なフレームワークに進化しました。新しい名前「Claude Agent SDK」はその機能をより良く反映しています:

- ビジネスエージェントの構築 (法務アシスタント、財務アドバイザー、カスタマーサポート)
- 特殊なコーディングエージェントの作成 (SRE ボット、セキュリティレビュアー、コードレビューエージェント)
- ツール使用、MCP 統合など、あらゆるドメイン用のカスタムエージェント開発

## ヘルプを得る

移行中に問題が発生した場合:

**TypeScript/JavaScript の場合:**

1. すべてのインポートが `@anthropic-ai/claude-agent-sdk` を使用するように更新されていることを確認します
2. package.json に新しいパッケージ名があることを確認します
3. `npm install` を実行して依存関係が更新されていることを確認します

**Python の場合:**

1. すべてのインポートが `claude_agent_sdk` を使用するように更新されていることを確認します
2. requirements.txt または pyproject.toml に新しいパッケージ名があることを確認します
3. `pip install claude-agent-sdk` を実行してパッケージがインストールされていることを確認します

## 次のステップ

- [Agent SDK 概要](/docs/ja/agent-sdk/overview) を探索して、利用可能な機能について学びます
- [TypeScript SDK リファレンス](/docs/ja/agent-sdk/typescript) をチェックして、詳細な API ドキュメントを確認します
- [Python SDK リファレンス](/docs/ja/agent-sdk/python) を確認して、Python 固有のドキュメントを確認します
- [カスタムツール](/docs/ja/agent-sdk/custom-tools) と [MCP 統合](/docs/ja/agent-sdk/mcp) について学びます