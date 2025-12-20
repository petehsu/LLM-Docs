# メモリツール

Claudeがメモリファイルディレクトリを通じて会話間で情報を保存・取得できるメモリツールについて学びます。

---

メモリツールにより、Claudeはメモリファイルディレクトリを通じて会話間で情報を保存・取得できます。Claudeはセッション間で永続化されるファイルを作成、読み取り、更新、削除でき、コンテキストウィンドウにすべてを保持することなく、時間をかけて知識を構築できます。

メモリツールはクライアント側で動作します。つまり、独自のインフラストラクチャを通じて、データがどこにどのように保存されるかを制御します。

<Note>
メモリツールは現在ベータ版です。有効にするには、APIリクエストでベータヘッダー `context-management-2025-06-27` を使用してください。

このフィーチャーに関するフィードバックを共有するには、[フィードバックフォーム](https://forms.gle/YXC2EKGMhjN1c4L88)からお問い合わせください。
</Note>

## ユースケース

- 複数のエージェント実行間でプロジェクトコンテキストを維持する
- 過去のインタラクション、決定、フィードバックから学ぶ
- 時間をかけてナレッジベースを構築する
- 会話間学習を有効にして、Claudeが繰り返されるワークフローで改善する

## 仕組み

有効にすると、Claudeはタスクを開始する前に自動的にメモリディレクトリをチェックします。Claudeは `/memories` ディレクトリ内のファイルを作成、読み取り、更新、削除して、作業中に学んだことを保存し、将来の会話でそれらのメモリを参照して、同様のタスクをより効果的に処理したり、中断したところから再開したりできます。

これはクライアント側のツールなので、Claudeはメモリ操作を実行するためにツール呼び出しを行い、アプリケーションはそれらの操作をローカルで実行します。これにより、メモリがどこにどのように保存されるかを完全に制御できます。セキュリティのため、すべてのメモリ操作を `/memories` ディレクトリに制限する必要があります。

### 例：メモリツール呼び出しの仕組み

Claudeにタスクを支援するよう依頼すると、Claudeは最初に自動的にメモリディレクトリをチェックします。典型的なインタラクションは次のようになります：

**1. ユーザーリクエスト：**
```
"Help me respond to this customer service ticket."
```

**2. Claudeがメモリディレクトリをチェック：**
```
"I'll help you respond to the customer service ticket. Let me check my memory for any previous context."
```

Claudeがメモリツールを呼び出します：
```json
{
  "type": "tool_use",
  "id": "toolu_01C4D5E6F7G8H9I0J1K2L3M4",
  "name": "memory",
  "input": {
    "command": "view",
    "path": "/memories"
  }
}
```

**3. アプリケーションがディレクトリの内容を返す：**
```json
{
  "type": "tool_result",
  "tool_use_id": "toolu_01C4D5E6F7G8H9I0J1K2L3M4",
  "content": "Here're the files and directories up to 2 levels deep in /memories, excluding hidden items and node_modules:\n4.0K\t/memories\n1.5K\t/memories/customer_service_guidelines.xml\n2.0K\t/memories/refund_policies.xml"
}
```

**4. Claudeが関連ファイルを読み取る：**
```json
{
  "type": "tool_use",
  "id": "toolu_01D5E6F7G8H9I0J1K2L3M4N5",
  "name": "memory",
  "input": {
    "command": "view",
    "path": "/memories/customer_service_guidelines.xml"
  }
}
```

**5. アプリケーションがファイルの内容を返す：**
```json
{
  "type": "tool_result",
  "tool_use_id": "toolu_01D5E6F7G8H9I0J1K2L3M4N5",
  "content": "Here's the content of /memories/customer_service_guidelines.xml with line numbers:\n     1\t<guidelines>\n     2\t<addressing_customers>\n     3\t- Always address customers by their first name\n     4\t- Use empathetic language\n..."
}
```

**6. Claudeがメモリを使用して支援：**
```
"Based on your customer service guidelines, I can help you craft a response. Please share the ticket details..."
```

## サポートされているモデル

メモリツールは以下で利用可能です：

- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)
- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)

## はじめに

メモリツールを使用するには：

1. APIリクエストにベータヘッダー `context-management-2025-06-27` を含める
2. リクエストにメモリツールを追加する
3. メモリ操作のクライアント側ハンドラーを実装する

<Note>
アプリケーションでメモリツール操作を処理するには、各メモリコマンドのハンドラーを実装する必要があります。SDKはメモリツールヘルパーを提供し、ツールインターフェースを処理します。`BetaAbstractMemoryTool`（Python）をサブクラス化するか、`betaMemoryTool`（TypeScript）を使用して、独自のメモリバックエンド（ファイルベース、データベース、クラウドストレージ、暗号化ファイルなど）を実装できます。

動作例については、以下を参照してください：
- Python: [examples/memory/basic.py](https://github.com/anthropics/anthropic-sdk-python/blob/main/examples/memory/basic.py)
- TypeScript: [examples/tools-helpers-memory.ts](https://github.com/anthropics/anthropic-sdk-typescript/blob/main/examples/tools-helpers-memory.ts)
</Note>

## 基本的な使用方法

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 2048,
        "messages": [
            {
                "role": "user",
                "content": "I'\''m working on a Python web scraper that keeps crashing with a timeout error. Here'\''s the problematic function:\n\n```python\ndef fetch_page(url, retries=3):\n    for i in range(retries):\n        try:\n            response = requests.get(url, timeout=5)\n            return response.text\n        except requests.exceptions.Timeout:\n            if i == retries - 1:\n                raise\n            time.sleep(1)\n```\n\nPlease help me debug this."
            }
        ],
        "tools": [{
            "type": "memory_20250818",
            "name": "memory"
        }]
    }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

message = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=2048,
    messages=[
        {
            "role": "user",
            "content": "I'm working on a Python web scraper that keeps crashing with a timeout error. Here's the problematic function:\n\n```python\ndef fetch_page(url, retries=3):\n    for i in range(retries):\n        try:\n            response = requests.get(url, timeout=5)\n            return response.text\n        except requests.exceptions.Timeout:\n            if i == retries - 1:\n                raise\n            time.sleep(1)\n```\n\nPlease help me debug this."
        }
    ],
    tools=[{
        "type": "memory_20250818",
        "name": "memory"
    }],
    betas=["context-management-2025-06-27"]
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const message = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 2048,
  messages: [
    {
      role: "user",
      content: "I'm working on a Python web scraper that keeps crashing with a timeout error. Here's the problematic function:\n\n```python\ndef fetch_page(url, retries=3):\n    for i in range(retries):\n        try:\n            response = requests.get(url, timeout=5)\n            return response.text\n        except requests.exceptions.Timeout:\n            if i == retries - 1:\n                raise\n            time.sleep(1)\n```\n\nPlease help me debug this."
    }
  ],
  tools: [{
    type: "memory_20250818",
    name: "memory"
  }],
  betas: ["context-management-2025-06-27"]
});
```

</CodeGroup>

## ツールコマンド

クライアント側の実装は、これらのメモリツールコマンドを処理する必要があります。これらの仕様はClaudeが最も慣れている推奨される動作を説明していますが、実装を変更し、ユースケースに応じて必要に応じて文字列を返すことができます。

### view
オプションの行範囲を含むディレクトリの内容またはファイルの内容を表示します：

```json
{
  "command": "view",
  "path": "/memories",
  "view_range": [1, 10]  // オプション：特定の行を表示
}
```

#### 戻り値

**ディレクトリの場合：** ファイルとディレクトリをサイズとともに表示するリストを返します：
```
Here're the files and directories up to 2 levels deep in {path}, excluding hidden items and node_modules:
{size}    {path}
{size}    {path}/{filename1}
{size}    {path}/{filename2}
```

- 最大2レベル深くまでファイルをリストします
- 人間が読める形式のサイズを表示します（例：`5.5K`、`1.2M`）
- 隠しアイテム（`.`で始まるファイル）と `node_modules` を除外します
- サイズとパスの間にタブ文字を使用します

**ファイルの場合：** ヘッダーと行番号を含むファイルの内容を返します：
```
Here's the content of {path} with line numbers:
{line_numbers}{tab}{content}
```

行番号のフォーマット：
- **幅**：6文字、スペースパディングで右揃え
- **区切り文字**：行番号とコンテンツの間にタブ文字
- **インデックス**：1から始まる（最初の行は行1）
- **行制限**：999,999行を超えるファイルはエラーを返す必要があります：`"File {path} exceeds maximum line limit of 999,999 lines."`

**出力例：**
```
Here's the content of /memories/notes.txt with line numbers:
     1	Hello World
     2	This is line two
    10	Line ten
   100	Line one hundred
```

#### エラーハンドリング

- **ファイル/ディレクトリが存在しない**：`"The path {path} does not exist. Please provide a valid path."`

### create
新しいファイルを作成します：

```json
{
  "command": "create",
  "path": "/memories/notes.txt",
  "file_text": "Meeting notes:\n- Discussed project timeline\n- Next steps defined\n"
}
```

#### 戻り値

- **成功**：`"File created successfully at: {path}"`

#### エラーハンドリング

- **ファイルが既に存在する**：`"Error: File {path} already exists"`

### str_replace
ファイル内のテキストを置換します：

```json
{
  "command": "str_replace",
  "path": "/memories/preferences.txt",
  "old_str": "Favorite color: blue",
  "new_str": "Favorite color: green"
}
```

#### 戻り値

- **成功**：`"The memory file has been edited."` の後に、編集されたファイルのスニペットと行番号が続きます

#### エラーハンドリング

- **ファイルが存在しない**：`"Error: The path {path} does not exist. Please provide a valid path."`
- **テキストが見つからない**：``"No replacement was performed, old_str `{old_str}` did not appear verbatim in {path}."``
- **重複テキスト**：`old_str` が複数回出現する場合、返す：``"No replacement was performed. Multiple occurrences of old_str `{old_str}` in lines: {line_numbers}. Please ensure it is unique"``

#### ディレクトリハンドリング

パスがディレクトリの場合、「ファイルが存在しない」エラーを返します。

### insert
特定の行にテキストを挿入します：

```json
{
  "command": "insert",
  "path": "/memories/todo.txt",
  "insert_line": 2,
  "insert_text": "- Review memory tool documentation\n"
}
```

#### 戻り値

- **成功**：`"The file {path} has been edited."`

#### エラーハンドリング

- **ファイルが存在しない**：`"Error: The path {path} does not exist"`
- **無効な行番号**：``"Error: Invalid `insert_line` parameter: {insert_line}. It should be within the range of lines of the file: [0, {n_lines}]"``

#### ディレクトリハンドリング

パスがディレクトリの場合、「ファイルが存在しない」エラーを返します。

### delete
ファイルまたはディレクトリを削除します：

```json
{
  "command": "delete",
  "path": "/memories/old_file.txt"
}
```

#### 戻り値

- **成功**：`"Successfully deleted {path}"`

#### エラーハンドリング

- **ファイル/ディレクトリが存在しない**：`"Error: The path {path} does not exist"`

#### ディレクトリハンドリング

ディレクトリとそのすべての内容を再帰的に削除します。

### rename
ファイル/ディレクトリの名前を変更または移動します：

```json
{
  "command": "rename",
  "old_path": "/memories/draft.txt",
  "new_path": "/memories/final.txt"
}
```

#### 戻り値

- **成功**：`"Successfully renamed {old_path} to {new_path}"`

#### エラーハンドリング

- **ソースが存在しない**：`"Error: The path {old_path} does not exist"`
- **宛先が既に存在する**：エラーを返します（上書きしない）：`"Error: The destination {new_path} already exists"`

#### ディレクトリハンドリング

ディレクトリの名前を変更します。

## プロンプトガイダンス

メモリツールが含まれている場合、システムプロンプトに自動的にこの指示を含めます：

```
IMPORTANT: ALWAYS VIEW YOUR MEMORY DIRECTORY BEFORE DOING ANYTHING ELSE.
MEMORY PROTOCOL:
1. Use the `view` command of your `memory` tool to check for earlier progress.
2. ... (work on the task) ...
     - As you make progress, record status / progress / thoughts etc in your memory.
ASSUME INTERRUPTION: Your context window might be reset at any moment, so you risk losing any progress that is not recorded in your memory directory.
```

Claudeが散らかったメモリファイルを作成していることに気付いた場合、この指示を含めることができます：

> Note: when editing your memory folder, always try to keep its content up-to-date, coherent and organized. You can rename or delete files that are no longer relevant. Do not create new files unless necessary.

また、Claudeがメモリに何を書き込むかをガイドすることもできます。例えば、「Only write down information relevant to \<topic\> in your memory system.」

## セキュリティに関する考慮事項

メモリストアを実装する際の重要なセキュリティ上の懸念事項は以下の通りです：

### 機密情報
Claudeは通常、機密情報をメモリファイルに書き込むことを拒否します。ただし、機密情報を削除する厳密な検証を実装することをお勧めします。

### ファイルストレージサイズ
メモリファイルのサイズを追跡し、ファイルが大きくなりすぎるのを防ぐことを検討してください。メモリ読み取りコマンドが返すことができる最大文字数を追加し、Claudeがコンテンツをページネーションできるようにすることを検討してください。

### メモリの有効期限
長時間アクセスされていないメモリファイルを定期的にクリアすることを検討してください。

### パストラバーサル保護

<Warning>
悪意のあるパス入力は `/memories` ディレクトリの外のファイルにアクセスしようとする可能性があります。実装は **必ず** すべてのパスを検証してディレクトリトラバーサル攻撃を防ぐ必要があります。
</Warning>

これらのセーフガードを検討してください：

- すべてのパスが `/memories` で始まることを検証する
- パスを正規形に解決し、メモリディレクトリ内に留まることを確認する
- `../`、`..\`、またはその他のトラバーサルパターンを含むパスを拒否する
- URLエンコードされたトラバーサルシーケンス（`%2e%2e%2f`）に注意する
- 言語の組み込みパスセキュリティユーティリティを使用する（例：Pythonの `pathlib.Path.resolve()` と `relative_to()`）

## エラーハンドリング

メモリツールは[テキストエディタツール](/docs/ja/agents-and-tools/tool-use/text-editor-tool#handle-errors)と同様のエラーハンドリングパターンを使用します。詳細なエラーメッセージと動作については、上記の個別のツールコマンドセクションを参照してください。一般的なエラーには、ファイルが見つからない、パーミッションエラー、無効なパス、重複テキストマッチが含まれます。

## コンテキスト編集との使用

メモリツールは[コンテキスト編集](/docs/ja/build-with-claude/context-editing)と組み合わせることができます。これは会話コンテキストが設定されたしきい値を超えて増加したときに古いツール結果を自動的にクリアします。この組み合わせにより、長時間実行されるエージェントワークフローがコンテキスト制限を超えるのを防ぐことができます。

### 連携方法

コンテキスト編集が有効になっており、会話がクリアしきい値に近づくと、Claudeは自動的に警告通知を受け取ります。これにより、Claudeはツール結果から重要な情報をメモリファイルに保存するよう促されます。その後、それらの結果がコンテキストウィンドウからクリアされます。

ツール結果がクリアされた後、Claudeは必要に応じてメモリファイルから保存された情報を取得でき、メモリを作業コンテキストの拡張として効果的に扱うことができます。これにより、Claudeは以下を実行できます：

- 重要な情報を失うことなく複雑なマルチステップワークフローを続行する
- ツール結果が削除された後でも過去の作業と決定を参照する
- 通常のコンテキスト制限を超える会話全体で一貫したコンテキストを維持する
- アクティブなコンテキストウィンドウを管理可能に保ちながら、時間をかけてナレッジベースを構築する

### ワークフロー例

多くのファイル操作を伴うコードリファクタリングプロジェクトを考えてみてください：

1. Claudeは多数のファイル編集を行い、多くのツール結果を生成します
2. コンテキストが増加してしきい値に近づくと、Claudeは警告を受け取ります
3. Claudeはこれまでに行った変更をメモリファイルに要約します（例：`/memories/refactoring_progress.xml`）
4. コンテキスト編集は古いツール結果を自動的にクリアします
5. Claudeは作業を続行し、既に完了した変更を思い出す必要があるときにメモリファイルを参照します
6. ワークフローは無期限に続行でき、Claudeはアクティブなコンテキストと永続的なメモリの両方を管理します

### 設定

両方の機能を一緒に使用するには：

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[...],
    tools=[
        {
            "type": "memory_20250818",
            "name": "memory"
        },
        # Your other tools
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {
                    "type": "input_tokens",
                    "value": 100000
                },
                "keep": {
                    "type": "tool_uses",
                    "value": 3
                }
            }
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [...],
  tools: [
    {
      type: "memory_20250818",
      name: "memory"
    },
    // Your other tools
  ],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: 100000
        },
        keep: {
          type: "tool_uses",
          value: 3
        }
      }
    ]
  }
});
```

</CodeGroup>

メモリツール呼び出しがクリアされるのを除外して、Claudeが常に最近のメモリ操作にアクセスできるようにすることもできます：

<CodeGroup>

```python Python
context_management={
    "edits": [
        {
            "type": "clear_tool_uses_20250919",
            "exclude_tools": ["memory"]
        }
    ]
}
```

```typescript TypeScript
context_management: {
  edits: [
    {
      type: "clear_tool_uses_20250919",
      exclude_tools: ["memory"]
    }
  ]
}
```

</CodeGroup>