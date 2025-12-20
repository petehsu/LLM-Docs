# コード実行ツール

Claudeがコード実行ツールを使用してデータを分析し、可視化を作成し、複雑な計算を実行し、システムコマンドを実行し、ファイルを作成・編集し、APIの会話内でアップロードされたファイルを直接処理する方法を学びます。

---

Claudeはデータを分析し、可視化を作成し、複雑な計算を実行し、システムコマンドを実行し、ファイルを作成・編集し、APIの会話内でアップロードされたファイルを直接処理できます。
コード実行ツールにより、Claudeはセキュアなサンドボックス環境でBashコマンドを実行し、ファイルを操作できます。

<Note>
コード実行ツールは現在パブリックベータ版です。

この機能を使用するには、`"code-execution-2025-08-25"` [ベータヘッダー](/docs/ja/api/beta-headers)をAPIリクエストに追加してください。
</Note>

## モデルの互換性

コード実行ツールは以下のモデルで利用可能です：

| モデル | ツールバージョン |
|-------|--------------|
| Claude Opus 4.5 (`claude-opus-4-5-20251101`) | `code_execution_20250825` |
| Claude Opus 4.1 (`claude-opus-4-1-20250805`) | `code_execution_20250825` |
| Claude Opus 4 (`claude-opus-4-20250514`) | `code_execution_20250825` |
| Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`) | `code_execution_20250825` |
| Claude Sonnet 4 (`claude-sonnet-4-20250514`) | `code_execution_20250825` |
| Claude Sonnet 3.7 (`claude-3-7-sonnet-20250219`) ([廃止予定](/docs/ja/about-claude/model-deprecations)) | `code_execution_20250825` |
| Claude Haiku 4.5 (`claude-haiku-4-5-20251001`) | `code_execution_20250825` |
| Claude Haiku 3.5 (`claude-3-5-haiku-latest`) | `code_execution_20250825` |

<Note>
現在のバージョン`code_execution_20250825`はBashコマンドとファイル操作をサポートしています。レガシーバージョン`code_execution_20250522`（Pythonのみ）も利用可能です。移行の詳細については[最新ツールバージョンへのアップグレード](#upgrade-to-latest-tool-version)を参照してください。
</Note>

<Warning>
古いツールバージョンは新しいモデルとの下位互換性が保証されていません。常にモデルバージョンに対応するツールバージョンを使用してください。
</Warning>

## クイックスタート

Claudeに計算を実行するよう依頼する簡単な例を以下に示します：

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: code-execution-2025-08-25" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": "Calculate the mean and standard deviation of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
            }
        ],
        "tools": [{
            "type": "code_execution_20250825",
            "name": "code_execution"
        }]
    }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["code-execution-2025-08-25"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Calculate the mean and standard deviation of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)

print(response)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

async function main() {
  const response = await anthropic.beta.messages.create({
    model: "claude-sonnet-4-5",
    betas: ["code-execution-2025-08-25"],
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: "Calculate the mean and standard deviation of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
      }
    ],
    tools: [{
      type: "code_execution_20250825",
      name: "code_execution"
    }]
  });

  console.log(response);
}

main().catch(console.error);
```
</CodeGroup>

## コード実行の仕組み

APIリクエストにコード実行ツールを追加すると：

1. Claudeはコード実行が質問に答えるのに役立つかどうかを評価します
2. ツールは自動的にClaudeに以下の機能を提供します：
   - **Bashコマンド**：システム操作とパッケージ管理のためのシェルコマンドを実行
   - **ファイル操作**：コードを含むファイルを直接作成、表示、編集
3. Claudeは単一のリクエストでこれらの機能の任意の組み合わせを使用できます
4. すべての操作はセキュアなサンドボックス環境で実行されます
5. Claudeは生成されたグラフ、計算、または分析を含む結果を提供します

## ツールの使用方法

### Bashコマンドを実行

Claudeにシステム情報を確認し、パッケージをインストールするよう依頼します：

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: code-execution-2025-08-25" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [{
            "role": "user",
            "content": "Check the Python version and list installed packages"
        }],
        "tools": [{
            "type": "code_execution_20250825",
            "name": "code_execution"
        }]
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["code-execution-2025-08-25"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Check the Python version and list installed packages"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  betas: ["code-execution-2025-08-25"],
  max_tokens: 4096,
  messages: [{
    role: "user",
    content: "Check the Python version and list installed packages"
  }],
  tools: [{
    type: "code_execution_20250825",
    name: "code_execution"
  }]
});
```
</CodeGroup>

### ファイルを直接作成・編集

Claudeはサンドボックスのファイル操作機能を使用してファイルを直接作成、表示、編集できます：

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: code-execution-2025-08-25" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [{
            "role": "user",
            "content": "Create a config.yaml file with database settings, then update the port from 5432 to 3306"
        }],
        "tools": [{
            "type": "code_execution_20250825",
            "name": "code_execution"
        }]
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["code-execution-2025-08-25"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Create a config.yaml file with database settings, then update the port from 5432 to 3306"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  betas: ["code-execution-2025-08-25"],
  max_tokens: 4096,
  messages: [{
    role: "user",
    content: "Create a config.yaml file with database settings, then update the port from 5432 to 3306"
  }],
  tools: [{
    type: "code_execution_20250825",
    name: "code_execution"
  }]
});
```
</CodeGroup>

### 独自のファイルをアップロードして分析

独自のデータファイル（CSV、Excel、画像など）を分析するには、Files APIを使用してアップロードし、リクエストで参照します：

<Note>
Files APIをCode Executionで使用するには、2つのベータヘッダーが必要です：`"anthropic-beta": "code-execution-2025-08-25,files-api-2025-04-14"`
</Note>

Python環境は、Files APIを介してアップロードされた様々なファイルタイプを処理できます：

- CSV
- Excel (.xlsx, .xls)
- JSON
- XML
- 画像 (JPEG, PNG, GIF, WebP)
- テキストファイル (.txt, .md, .py など)

#### ファイルをアップロードして分析

1. **[Files API](/docs/ja/build-with-claude/files)を使用してファイルをアップロード**
2. **`container_upload`コンテンツブロックを使用してメッセージでファイルを参照**
3. **APIリクエストにコード実行ツールを含める**

<CodeGroup>
```bash Shell
# まずファイルをアップロード
curl https://api.anthropic.com/v1/files \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: files-api-2025-04-14" \
    --form 'file=@"data.csv"' \

# その後、file_idをコード実行で使用
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: code-execution-2025-08-25,files-api-2025-04-14" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [{
            "role": "user",
            "content": [
                {"type": "text", "text": "Analyze this CSV data"},
                {"type": "container_upload", "file_id": "file_abc123"}
            ]
        }],
        "tools": [{
            "type": "code_execution_20250825",
            "name": "code_execution"
        }]
    }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

# ファイルをアップロード
file_object = client.beta.files.upload(
    file=open("data.csv", "rb"),
)

# コード実行でfile_idを使用
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["code-execution-2025-08-25", "files-api-2025-04-14"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": "Analyze this CSV data"},
            {"type": "container_upload", "file_id": file_object.id}
        ]
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';
import { createReadStream } from 'fs';

const anthropic = new Anthropic();

async function main() {
  // ファイルをアップロード
  const fileObject = await anthropic.beta.files.create({
    file: createReadStream("data.csv"),
  });

  // コード実行でfile_idを使用
  const response = await anthropic.beta.messages.create({
    model: "claude-sonnet-4-5",
    betas: ["code-execution-2025-08-25", "files-api-2025-04-14"],
    max_tokens: 4096,
    messages: [{
      role: "user",
      content: [
        { type: "text", text: "Analyze this CSV data" },
        { type: "container_upload", file_id: fileObject.id }
      ]
    }],
    tools: [{
      type: "code_execution_20250825",
      name: "code_execution"
    }]
  });

  console.log(response);
}

main().catch(console.error);
```
</CodeGroup>

#### 生成されたファイルを取得

Claudeがコード実行中にファイルを作成する場合、Files APIを使用してこれらのファイルを取得できます：

<CodeGroup>
```python Python
from anthropic import Anthropic

# クライアントを初期化
client = Anthropic()

# ファイルを作成するコード実行をリクエスト
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["code-execution-2025-08-25", "files-api-2025-04-14"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Create a matplotlib visualization and save it as output.png"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)

# レスポンスからファイルIDを抽出
def extract_file_ids(response):
    file_ids = []
    for item in response.content:
        if item.type == 'bash_code_execution_tool_result':
            content_item = item.content
            if content_item.type == 'bash_code_execution_result':
                for file in content_item.content:
                    if hasattr(file, 'file_id'):
                        file_ids.append(file.file_id)
    return file_ids

# 作成されたファイルをダウンロード
for file_id in extract_file_ids(response):
    file_metadata = client.beta.files.retrieve_metadata(file_id)
    file_content = client.beta.files.download(file_id)
    file_content.write_to_file(file_metadata.filename)
    print(f"Downloaded: {file_metadata.filename}")
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';
import { writeFileSync } from 'fs';

// クライアントを初期化
const anthropic = new Anthropic();

async function main() {
  // ファイルを作成するコード実行をリクエスト
  const response = await anthropic.beta.messages.create({
    model: "claude-sonnet-4-5",
    betas: ["code-execution-2025-08-25", "files-api-2025-04-14"],
    max_tokens: 4096,
    messages: [{
      role: "user",
      content: "Create a matplotlib visualization and save it as output.png"
    }],
    tools: [{
      type: "code_execution_20250825",
      name: "code_execution"
    }]
  });

  // レスポンスからファイルIDを抽出
  function extractFileIds(response: any): string[] {
    const fileIds: string[] = [];
    for (const item of response.content) {
      if (item.type === 'bash_code_execution_tool_result') {
        const contentItem = item.content;
        if (contentItem.type === 'bash_code_execution_result' && contentItem.content) {
          for (const file of contentItem.content) {
            fileIds.push(file.file_id);
          }
        }
      }
    }
    return fileIds;
  }

  // 作成されたファイルをダウンロード
  const fileIds = extractFileIds(response);
  for (const fileId of fileIds) {
    const fileMetadata = await anthropic.beta.files.retrieveMetadata(fileId);
    const fileContent = await anthropic.beta.files.download(fileId);

    // ReadableStreamをBufferに変換して保存
    const chunks: Uint8Array[] = [];
    for await (const chunk of fileContent) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    writeFileSync(fileMetadata.filename, buffer);
    console.log(`Downloaded: ${fileMetadata.filename}`);
  }
}

main().catch(console.error);
```
</CodeGroup>

### 操作を組み合わせる

すべての機能を使用した複雑なワークフロー：

<CodeGroup>
```bash Shell
# まずファイルをアップロード
curl https://api.anthropic.com/v1/files \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: files-api-2025-04-14" \
    --form 'file=@"data.csv"' \
    > file_response.json

# file_idを抽出（jqを使用）
FILE_ID=$(jq -r '.id' file_response.json)

# その後、コード実行で使用
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: code-execution-2025-08-25,files-api-2025-04-14" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [{
            "role": "user",
            "content": [
                {
                    "type": "text", 
                    "text": "Analyze this CSV data: create a summary report, save visualizations, and create a README with the findings"
                },
                {
                    "type": "container_upload", 
                    "file_id": "'$FILE_ID'"
                }
            ]
        }],
        "tools": [{
            "type": "code_execution_20250825",
            "name": "code_execution"
        }]
    }'
```

```python Python
# ファイルをアップロード
file_object = client.beta.files.upload(
    file=open("data.csv", "rb"),
)

# コード実行で使用
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["code-execution-2025-08-25", "files-api-2025-04-14"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": "Analyze this CSV data: create a summary report, save visualizations, and create a README with the findings"},
            {"type": "container_upload", "file_id": file_object.id}
        ]
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)

# Claudeは以下を実行する可能性があります：
# 1. bashを使用してファイルサイズを確認し、データをプレビュー
# 2. text_editorを使用してCSVを分析し、可視化を作成するPythonコードを記述
# 3. bashを使用してPythonコードを実行
# 4. text_editorを使用して調査結果を含むREADME.mdを作成
# 5. bashを使用してファイルをレポートディレクトリに整理
```

```typescript TypeScript
// ファイルをアップロード
const fileObject = await anthropic.beta.files.create({
  file: createReadStream("data.csv"),
});

// コード実行で使用
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  betas: ["code-execution-2025-08-25", "files-api-2025-04-14"],
  max_tokens: 4096,
  messages: [{
    role: "user",
    content: [
      {type: "text", text: "Analyze this CSV data: create a summary report, save visualizations, and create a README with the findings"},
      {type: "container_upload", file_id: fileObject.id}
    ]
  }],
  tools: [{
    type: "code_execution_20250825",
    name: "code_execution"
  }]
});

// Claudeは以下を実行する可能性があります：
// 1. bashを使用してファイルサイズを確認し、データをプレビュー
// 2. text_editorを使用してCSVを分析し、可視化を作成するPythonコードを記述
// 3. bashを使用してPythonコードを実行
// 4. text_editorを使用して調査結果を含むREADME.mdを作成
// 5. bashを使用してファイルをレポートディレクトリに整理
```
</CodeGroup>

## ツール定義

コード実行ツールは追加のパラメータを必要としません：

```json JSON
{
  "type": "code_execution_20250825",
  "name": "code_execution"
}
```

このツールが提供される場合、Claudeは自動的に2つのサブツールにアクセスできます：
- `bash_code_execution`：シェルコマンドを実行
- `text_editor_code_execution`：ファイルを表示、作成、編集（コード記述を含む）

## レスポンス形式

コード実行ツールは操作に応じて2つのタイプの結果を返すことができます：

### Bashコマンドレスポンス

```json
{
  "type": "server_tool_use",
  "id": "srvtoolu_01B3C4D5E6F7G8H9I0J1K2L3",
  "name": "bash_code_execution",
  "input": {
    "command": "ls -la | head -5"
  }
},
{
  "type": "bash_code_execution_tool_result",
  "tool_use_id": "srvtoolu_01B3C4D5E6F7G8H9I0J1K2L3",
  "content": {
    "type": "bash_code_execution_result",
    "stdout": "total 24\ndrwxr-xr-x 2 user user 4096 Jan 1 12:00 .\ndrwxr-xr-x 3 user user 4096 Jan 1 11:00 ..\n-rw-r--r-- 1 user user  220 Jan 1 12:00 data.csv\n-rw-r--r-- 1 user user  180 Jan 1 12:00 config.json",
    "stderr": "",
    "return_code": 0
  }
}
```

### ファイル操作レスポンス

**ファイルを表示：**
```json
{
  "type": "server_tool_use",
  "id": "srvtoolu_01C4D5E6F7G8H9I0J1K2L3M4",
  "name": "text_editor_code_execution",
  "input": {
    "command": "view",
    "path": "config.json"
  }
},
{
  "type": "text_editor_code_execution_tool_result",
  "tool_use_id": "srvtoolu_01C4D5E6F7G8H9I0J1K2L3M4",
  "content": {
    "type": "text_editor_code_execution_result",
    "file_type": "text",
    "content": "{\n  \"setting\": \"value\",\n  \"debug\": true\n}",
    "numLines": 4,
    "startLine": 1,
    "totalLines": 4
  }
}
```

**ファイルを作成：**
```json
{
  "type": "server_tool_use",
  "id": "srvtoolu_01D5E6F7G8H9I0J1K2L3M4N5",
  "name": "text_editor_code_execution",
  "input": {
    "command": "create",
    "path": "new_file.txt",
    "file_text": "Hello, World!"
  }
},
{
  "type": "text_editor_code_execution_tool_result",
  "tool_use_id": "srvtoolu_01D5E6F7G8H9I0J1K2L3M4N5",
  "content": {
    "type": "text_editor_code_execution_result",
    "is_file_update": false
  }
}
```

**ファイルを編集（str_replace）：**
```json
{
  "type": "server_tool_use",
  "id": "srvtoolu_01E6F7G8H9I0J1K2L3M4N5O6",
  "name": "text_editor_code_execution",
  "input": {
    "command": "str_replace",
    "path": "config.json",
    "old_str": "\"debug\": true",
    "new_str": "\"debug\": false"
  }
},
{
  "type": "text_editor_code_execution_tool_result",
  "tool_use_id": "srvtoolu_01E6F7G8H9I0J1K2L3M4N5O6",
  "content": {
    "type": "text_editor_code_execution_result",
    "oldStart": 3,
    "oldLines": 1,
    "newStart": 3,
    "newLines": 1,
    "lines": ["-  \"debug\": true", "+  \"debug\": false"]
  }
}
```

### 結果

すべての実行結果には以下が含まれます：
- `stdout`：正常な実行からの出力
- `stderr`：実行が失敗した場合のエラーメッセージ
- `return_code`：成功時は0、失敗時は0以外

ファイル操作の追加フィールド：
- **表示**：`file_type`、`content`、`numLines`、`startLine`、`totalLines`
- **作成**：`is_file_update`（ファイルが既に存在したかどうか）
- **編集**：`oldStart`、`oldLines`、`newStart`、`newLines`、`lines`（diff形式）

### エラー

各ツールタイプは特定のエラーを返すことができます：

**共通エラー（すべてのツール）：**
```json
{
  "type": "bash_code_execution_tool_result",
  "tool_use_id": "srvtoolu_01VfmxgZ46TiHbmXgy928hQR",
  "content": {
    "type": "bash_code_execution_tool_result_error",
    "error_code": "unavailable"
  }
}
```

**ツールタイプ別エラーコード：**

| ツール | エラーコード | 説明 |
|------|-----------|-------------|
| すべてのツール | `unavailable` | ツールは一時的に利用不可 |
| すべてのツール | `execution_time_exceeded` | 実行が最大時間制限を超過 |
| すべてのツール | `container_expired` | コンテナが期限切れで利用不可 |
| すべてのツール | `invalid_tool_input` | ツールに無効なパラメータが提供された |
| すべてのツール | `too_many_requests` | ツール使用のレート制限を超過 |
| text_editor | `file_not_found` | ファイルが存在しない（表示/編集操作の場合） |
| text_editor | `string_not_found` | `old_str`がファイルに見つからない（str_replaceの場合） |

#### `pause_turn`停止理由

レスポンスに`pause_turn`停止理由が含まれる場合があります。これはAPIが長時間実行されるターンを一時停止したことを示します。レスポンスをそのまま後続のリクエストで提供してClaudeがターンを続行できるようにするか、会話を中断したい場合はコンテンツを変更できます。

## コンテナ

コード実行ツールはセキュアなコンテナ化された環境で実行され、特にPythonに焦点を当てた設計になっています。

### ランタイム環境
- **Pythonバージョン**：3.11.12
- **オペレーティングシステム**：Linuxベースのコンテナ
- **アーキテクチャ**：x86_64 (AMD64)

### リソース制限
- **メモリ**：5GiB RAM
- **ディスク容量**：5GiBワークスペースストレージ
- **CPU**：1 CPU

### ネットワークとセキュリティ
- **インターネットアクセス**：セキュリティのため完全に無効
- **外部接続**：アウトバウンドネットワークリクエストは許可されていません
- **サンドボックス分離**：ホストシステムおよび他のコンテナからの完全な分離
- **ファイルアクセス**：ワークスペースディレクトリのみに制限
- **ワークスペーススコープ**：[Files](/docs/ja/build-with-claude/files)と同様に、コンテナはAPIキーのワークスペースにスコープされます
- **有効期限**：コンテナは作成から30日後に期限切れになります

### プリインストールされたライブラリ
サンドボックス化されたPython環境には、これらの一般的に使用されるライブラリが含まれています：
- **データサイエンス**：pandas、numpy、scipy、scikit-learn、statsmodels
- **可視化**：matplotlib、seaborn
- **ファイル処理**：pyarrow、openpyxl、xlsxwriter、xlrd、pillow、python-pptx、python-docx、pypdf、pdfplumber、pypdfium2、pdf2image、pdfkit、tabula-py、reportlab[pycairo]、Img2pdf
- **数学・計算**：sympy、mpmath
- **ユーティリティ**：tqdm、python-dateutil、pytz、joblib、unzip、unrar、7zip、bc、rg (ripgrep)、fd、sqlite

## コンテナの再利用

前のレスポンスからコンテナIDを提供することで、複数のAPIリクエスト間で既存のコンテナを再利用できます。
これにより、リクエスト間で作成されたファイルを保持できます。

### 例

<CodeGroup>
```python Python
import os
from anthropic import Anthropic

# クライアントを初期化
client = Anthropic(
    api_key=os.getenv("ANTHROPIC_API_KEY")
)

# 最初のリクエスト：ランダムな数字を含むファイルを作成
response1 = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["code-execution-2025-08-25"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Write a file with a random number and save it to '/tmp/number.txt'"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)

# 最初のレスポンスからコンテナIDを抽出
container_id = response1.container.id

# 2番目のリクエスト：コンテナを再利用してファイルを読み取る
response2 = client.beta.messages.create(
    container=container_id,  # 同じコンテナを再利用
    model="claude-sonnet-4-5",
    betas=["code-execution-2025-08-25"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Read the number from '/tmp/number.txt' and calculate its square"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

async function main() {
  // 最初のリクエスト：ランダムな数字を含むファイルを作成
  const response1 = await anthropic.beta.messages.create({
    model: "claude-sonnet-4-5",
    betas: ["code-execution-2025-08-25"],
    max_tokens: 4096,
    messages: [{
      role: "user",
      content: "Write a file with a random number and save it to '/tmp/number.txt'"
    }],
    tools: [{
      type: "code_execution_20250825",
      name: "code_execution"
    }]
  });

  // 最初のレスポンスからコンテナIDを抽出
  const containerId = response1.container.id;

  // 2番目のリクエスト：コンテナを再利用してファイルを読み取る
  const response2 = await anthropic.beta.messages.create({
    container: containerId,  // 同じコンテナを再利用
    model: "claude-sonnet-4-5",
    betas: ["code-execution-2025-08-25"],
    max_tokens: 4096,
    messages: [{
      role: "user",
      content: "Read the number from '/tmp/number.txt' and calculate its square"
    }],
    tools: [{
      type: "code_execution_20250825",
      name: "code_execution"
    }]
  });

  console.log(response2.content);
}

main().catch(console.error);
```

```bash Shell
# 最初のリクエスト：ランダムな数字を含むファイルを作成
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: code-execution-2025-08-25" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [{
            "role": "user",
            "content": "Write a file with a random number and save it to \"/tmp/number.txt\""
        }],
        "tools": [{
            "type": "code_execution_20250825",
            "name": "code_execution"
        }]
    }' > response1.json

# jqを使用してレスポンスからコンテナIDを抽出
CONTAINER_ID=$(jq -r '.container.id' response1.json)

# 2番目のリクエスト：コンテナを再利用してファイルを読み取る
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: code-execution-2025-08-25" \
    --header "content-type: application/json" \
    --data '{
        "container": "'$CONTAINER_ID'",
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [{
            "role": "user",
            "content": "Read the number from \"/tmp/number.txt\" and calculate its square"
        }],
        "tools": [{
            "type": "code_execution_20250825",
            "name": "code_execution"
        }]
    }'
```
</CodeGroup>

## ストリーミング

ストリーミングが有効な場合、コード実行イベントが発生時に受け取られます：

```javascript
event: content_block_start
data: {"type": "content_block_start", "index": 1, "content_block": {"type": "server_tool_use", "id": "srvtoolu_xyz789", "name": "code_execution"}}

// コード実行がストリーム化
event: content_block_delta
data: {"type": "content_block_delta", "index": 1, "delta": {"type": "input_json_delta", "partial_json": "{\"code\":\"import pandas as pd\\ndf = pd.read_csv('data.csv')\\nprint(df.head())\"}"}}

// コード実行中に一時停止

// 実行結果がストリーム化
event: content_block_start
data: {"type": "content_block_start", "index": 2, "content_block": {"type": "code_execution_tool_result", "tool_use_id": "srvtoolu_xyz789", "content": {"stdout": "   A  B  C\n0  1  2  3\n1  4  5  6", "stderr": ""}}}
```

## バッチリクエスト

[Messages Batches API](/docs/ja/build-with-claude/batch-processing)にコード実行ツールを含めることができます。Messages Batches APIを通じたコード実行ツール呼び出しは、通常のMessages APIリクエストと同じ価格です。

## 使用方法と価格

Code execution tool usage is tracked separately from token usage. Execution time has a minimum of 5 minutes.
If files are included in the request, execution time is billed even if the tool is not used due to files being preloaded onto the container.

Each organization receives 50 free hours of usage with the code execution tool per day. Additional usage beyond the first 50 hours is billed at $0.05 per hour, per container.

## 最新ツールバージョンへのアップグレード

`code-execution-2025-08-25`にアップグレードすることで、ファイル操作とBash機能（複数言語のコードを含む）にアクセスできます。価格に違いはありません。

### 変更内容

| コンポーネント | レガシー | 現在 |
|-----------|------------------|----------------------------|
| ベータヘッダー | `code-execution-2025-05-22` | `code-execution-2025-08-25` |
| ツールタイプ | `code_execution_20250522` | `code_execution_20250825` |
| 機能 | Pythonのみ | Bashコマンド、ファイル操作 |
| レスポンスタイプ | `code_execution_result` | `bash_code_execution_result`、`text_editor_code_execution_result` |

### 下位互換性

- 既存のすべてのPythonコード実行は以前と同じように機能し続けます
- 既存のPythonのみのワークフローに変更は必要ありません

### アップグレード手順

アップグレードするには、APIリクエストで以下の変更を行う必要があります：

1. **ベータヘッダーを更新**：
   ```diff
   - "anthropic-beta": "code-execution-2025-05-22"
   + "anthropic-beta": "code-execution-2025-08-25"
   ```

2. **ツールタイプを更新**：
   ```diff
   - "type": "code_execution_20250522"
   + "type": "code_execution_20250825"
   ```

3. **レスポンス処理を確認**（プログラムでレスポンスを解析する場合）：
   - Python実行レスポンスの前のブロックは送信されなくなります
   - 代わりに、Bashおよびファイル操作の新しいレスポンスタイプが送信されます（レスポンス形式セクションを参照）

## プログラマティックツール呼び出し

コード実行ツールは[プログラマティックツール呼び出し](/docs/ja/agents-and-tools/tool-use/programmatic-tool-calling)を強化します。これにより、Claudeは実行コンテナ内でカスタムツールをプログラマティックに呼び出すコードを記述できます。これにより、効率的なマルチツールワークフロー、Claudeのコンテキストに到達する前のデータフィルタリング、複雑な条件付きロジックが可能になります。

<CodeGroup>
```python Python
# ツールのプログラマティック呼び出しを有効化
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Get weather for 5 cities and find the warmest"
    }],
    tools=[
        {
            "type": "code_execution_20250825",
            "name": "code_execution"
        },
        {
            "name": "get_weather",
            "description": "Get weather for a city",
            "input_schema": {...},
            "allowed_callers": ["code_execution_20250825"]  # プログラマティック呼び出しを有効化
        }
    ]
)
```
</CodeGroup>

詳細については、[プログラマティックツール呼び出しドキュメント](/docs/ja/agents-and-tools/tool-use/programmatic-tool-calling)を参照してください。

## Agent Skillsでのコード実行の使用

コード実行ツールにより、Claudeは[Agent Skills](/docs/ja/agents-and-tools/agent-skills/overview)を使用できます。Skillsはモジュール化された機能で、指示、スクリプト、リソースで構成され、Claudeの機能を拡張します。

詳細については、[Agent Skillsドキュメント](/docs/ja/agents-and-tools/agent-skills/overview)および[Agent Skills APIガイド](/docs/ja/build-with-claude/skills-guide)を参照してください。