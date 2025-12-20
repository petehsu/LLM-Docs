# Bashツール

Claudeがシェルコマンドを永続的なbashセッションで実行できるようにするBashツール

---

Bashツールは、Claudeが永続的なbashセッションでシェルコマンドを実行できるようにし、システム操作、スクリプト実行、コマンドライン自動化を可能にします。

## 概要

Bashツールは、Claudeに以下を提供します：
- 状態を保持する永続的なbashセッション
- あらゆるシェルコマンドを実行する機能
- 環境変数と作業ディレクトリへのアクセス
- コマンドチェーンとスクリプト機能

## モデルの互換性

| モデル | ツールバージョン |
|-------|--------------|
| Claude 4モデルとSonnet 3.7 ([廃止予定](/docs/ja/about-claude/model-deprecations)) | `bash_20250124` |

<Warning>
古いツールバージョンは、新しいモデルとの後方互換性が保証されていません。常にモデルバージョンに対応するツールバージョンを使用してください。
</Warning>

## ユースケース

- **開発ワークフロー**: ビルドコマンド、テスト、開発ツールを実行
- **システム自動化**: スクリプト実行、ファイル管理、タスク自動化
- **データ処理**: ファイル処理、分析スクリプト実行、データセット管理
- **環境セットアップ**: パッケージインストール、環境設定

## クイックスタート

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[
        {
            "type": "bash_20250124",
            "name": "bash"
        }
    ],
    messages=[
        {"role": "user", "content": "List all Python files in the current directory."}
    ]
)
```

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "tools": [
      {
        "type": "bash_20250124",
        "name": "bash"
      }
    ],
    "messages": [
      {
        "role": "user",
        "content": "List all Python files in the current directory."
      }
    ]
  }'
```
</CodeGroup>

## 動作方法

Bashツールは永続的なセッションを保持します：

1. Claudeが実行するコマンドを決定します
2. bashシェルでコマンドを実行します
3. 出力（標準出力と標準エラー）をClaudeに返します
4. セッション状態はコマンド間で保持されます（環境変数、作業ディレクトリ）

## パラメータ

| パラメータ | 必須 | 説明 |
|-----------|----------|-------------|
| `command` | はい* | 実行するbashコマンド |
| `restart` | いいえ | `true`に設定してbashセッションを再開します |

*`restart`を使用する場合を除き必須

<section title="使用例">

```json
// コマンドを実行
{
  "command": "ls -la *.py"
}

// セッションを再開
{
  "restart": true
}
```

</section>

## 例：マルチステップ自動化

Claudeはコマンドをチェーンして複雑なタスクを完了できます：

```python
# ユーザーリクエスト
"Install the requests library and create a simple Python script that fetches a joke from an API, then run it."

# Claudeのツール使用：
# 1. パッケージをインストール
{"command": "pip install requests"}

# 2. スクリプトを作成
{"command": "cat > fetch_joke.py << 'EOF'\nimport requests\nresponse = requests.get('https://official-joke-api.appspot.com/random_joke')\njoke = response.json()\nprint(f\"Setup: {joke['setup']}\")\nprint(f\"Punchline: {joke['punchline']}\")\nEOF"}

# 3. スクリプトを実行
{"command": "python fetch_joke.py"}
```

セッションはコマンド間で状態を保持するため、ステップ2で作成されたファイルはステップ3で利用可能です。

***

## Bashツールを実装する

Bashツールはスキーマレスツールとして実装されています。このツールを使用する場合、他のツールのような入力スキーマを提供する必要はありません。スキーマはClaudeのモデルに組み込まれており、変更することはできません。

<Steps>
  <Step title="bash環境をセットアップ">
    Claudeが対話できる永続的なbashセッションを作成します：
    ```python
    import subprocess
    import threading
    import queue
    
    class BashSession:
        def __init__(self):
            self.process = subprocess.Popen(
                ['/bin/bash'],
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                bufsize=0
            )
            self.output_queue = queue.Queue()
            self.error_queue = queue.Queue()
            self._start_readers()
    ```
  </Step>
  <Step title="コマンド実行を処理">
    コマンドを実行して出力をキャプチャする関数を作成します：
    ```python
    def execute_command(self, command):
        # bashにコマンドを送信
        self.process.stdin.write(command + '\n')
        self.process.stdin.flush()
        
        # タイムアウト付きで出力をキャプチャ
        output = self._read_output(timeout=10)
        return output
    ```
  </Step>
  <Step title="Claudeのツール呼び出しを処理">
    Claudeの応答からコマンドを抽出して実行します：
    ```python
    for content in response.content:
        if content.type == "tool_use" and content.name == "bash":
            if content.input.get("restart"):
                bash_session.restart()
                result = "Bash session restarted"
            else:
                command = content.input.get("command")
                result = bash_session.execute_command(command)
            
            # 結果をClaudeに返す
            tool_result = {
                "type": "tool_result",
                "tool_use_id": content.id,
                "content": result
            }
    ```
  </Step>
  <Step title="安全対策を実装">
    検証と制限を追加します：
    ```python
    def validate_command(command):
        # 危険なコマンドをブロック
        dangerous_patterns = ['rm -rf /', 'format', ':(){:|:&};:']
        for pattern in dangerous_patterns:
            if pattern in command:
                return False, f"Command contains dangerous pattern: {pattern}"
        
        # 必要に応じてさらに検証を追加
        return True, None
    ```
  </Step>
</Steps>

### エラーを処理する

Bashツールを実装する場合、様々なエラーシナリオに対応します：

<section title="コマンド実行タイムアウト">

コマンドの実行に時間がかかりすぎる場合：

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Error: Command timed out after 30 seconds",
      "is_error": true
    }
  ]
}
```

</section>

<section title="コマンドが見つからない">

コマンドが存在しない場合：

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "bash: nonexistentcommand: command not found",
      "is_error": true
    }
  ]
}
```

</section>

<section title="アクセス許可が拒否された">

アクセス許可の問題がある場合：

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "bash: /root/sensitive-file: Permission denied",
      "is_error": true
    }
  ]
}
```

</section>

### 実装のベストプラクティスに従う

<section title="コマンドタイムアウトを使用">

ハングするコマンドを防ぐためにタイムアウトを実装します：
```python
def execute_with_timeout(command, timeout=30):
    try:
        result = subprocess.run(
            command, 
            shell=True, 
            capture_output=True, 
            text=True, 
            timeout=timeout
        )
        return result.stdout + result.stderr
    except subprocess.TimeoutExpired:
        return f"Command timed out after {timeout} seconds"
```

</section>

<section title="セッション状態を保持">

環境変数と作業ディレクトリを保持するためにbashセッションを永続化します：
```python
# 同じセッションで実行されるコマンドは状態を保持
commands = [
    "cd /tmp",
    "echo 'Hello' > test.txt",
    "cat test.txt"  # これは/tmpにいるため機能します
]
```

</section>

<section title="大きな出力を処理">

トークン制限の問題を防ぐために非常に大きな出力を切り詰めます：
```python
def truncate_output(output, max_lines=100):
    lines = output.split('\n')
    if len(lines) > max_lines:
        truncated = '\n'.join(lines[:max_lines])
        return f"{truncated}\n\n... Output truncated ({len(lines)} total lines) ..."
    return output
```

</section>

<section title="すべてのコマンドをログに記録">

実行されたコマンドの監査証跡を保持します：
```python
import logging

def log_command(command, output, user_id):
    logging.info(f"User {user_id} executed: {command}")
    logging.info(f"Output: {output[:200]}...")  # 最初の200文字をログに記録
```

</section>

<section title="出力をサニタイズ">

コマンド出力から機密情報を削除します：
```python
def sanitize_output(output):
    # 潜在的なシークレットまたは認証情報を削除
    import re
    # 例：AWSの認証情報を削除
    output = re.sub(r'aws_access_key_id\s*=\s*\S+', 'aws_access_key_id=***', output)
    output = re.sub(r'aws_secret_access_key\s*=\s*\S+', 'aws_secret_access_key=***', output)
    return output
```

</section>

## セキュリティ

<Warning>
Bashツールは直接的なシステムアクセスを提供します。これらの重要な安全対策を実装してください：
- 隔離された環境（Docker/VM）での実行
- コマンドフィルタリングとホワイトリストの実装
- リソース制限の設定（CPU、メモリ、ディスク）
- 実行されたすべてのコマンドのログ記録
</Warning>

### 主な推奨事項
- `ulimit`を使用してリソース制約を設定
- 危険なコマンド（`sudo`、`rm -rf`など）をフィルタリング
- 最小限のユーザー権限で実行
- すべてのコマンド実行を監視およびログに記録

## 価格

The bash tool adds **245 input tokens** to your API calls.

Additional tokens are consumed by:
- Command outputs (stdout/stderr)
- Error messages
- Large file contents

完全な価格詳細については、[ツール使用価格](/docs/ja/agents-and-tools/tool-use/overview#pricing)を参照してください。

## 一般的なパターン

### 開発ワークフロー
- テストの実行：`pytest && coverage report`
- プロジェクトのビルド：`npm install && npm run build`
- Git操作：`git status && git add . && git commit -m "message"`

### ファイル操作
- データ処理：`wc -l *.csv && ls -lh *.csv`
- ファイル検索：`find . -name "*.py" | xargs grep "pattern"`
- バックアップ作成：`tar -czf backup.tar.gz ./data`

### システムタスク
- リソース確認：`df -h && free -m`
- プロセス管理：`ps aux | grep python`
- 環境セットアップ：`export PATH=$PATH:/new/path && echo $PATH`

## 制限事項

- **対話型コマンドなし**：`vim`、`less`、またはパスワードプロンプトを処理できません
- **GUIアプリケーションなし**：コマンドラインのみ
- **セッションスコープ**：会話内で永続化され、APIコール間で失われます
- **出力制限**：大きな出力は切り詰められる可能性があります
- **ストリーミングなし**：完了後に結果が返されます

## 他のツールとの組み合わせ

Bashツールは、[テキストエディタ](/docs/ja/agents-and-tools/tool-use/text-editor-tool)および他のツールと組み合わせると最も強力です。

## 次のステップ

<CardGroup cols={2}>
  <Card
    title="ツール使用の概要"
    icon="tool"
    href="/docs/ja/agents-and-tools/tool-use/overview"
  >
    Claudeでのツール使用について学ぶ
  </Card>

  <Card
    title="テキストエディタツール"
    icon="file"
    href="/docs/ja/agents-and-tools/tool-use/text-editor-tool"
  >
    Claudeでテキストファイルを表示および編集
  </Card>
</CardGroup>