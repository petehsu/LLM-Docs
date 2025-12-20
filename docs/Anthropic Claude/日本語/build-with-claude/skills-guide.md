# APIでエージェントスキルを使用する

APIを通じてエージェントスキルを使用してClaudeの機能を拡張する方法を学びます。

---

エージェントスキルは、指示、スクリプト、リソースの整理されたフォルダを通じてClaudeの機能を拡張します。このガイドでは、Claude APIで事前構築されたスキルとカスタムスキルの両方を使用する方法を示します。

<Note>
リクエスト/レスポンススキーマとすべてのパラメータを含む完全なAPIリファレンスについては、以下を参照してください：
- [スキル管理APIリファレンス](/docs/ja/api/skills/list-skills) - スキルのCRUD操作
- [スキルバージョンAPIリファレンス](/docs/ja/api/skills/list-skill-versions) - バージョン管理
</Note>

## クイックリンク

<CardGroup cols={2}>
  <Card
    title="エージェントスキルを始める"
    icon="rocket"
    href="/docs/ja/agents-and-tools/agent-skills/quickstart"
  >
    最初のスキルを作成する
  </Card>
  <Card
    title="カスタムスキルを作成する"
    icon="hammer"
    href="/docs/ja/agents-and-tools/agent-skills/best-practices"
  >
    スキル作成のベストプラクティス
  </Card>
</CardGroup>

## 概要

<Note>
エージェントスキルのアーキテクチャと実世界での応用についての詳細は、エンジニアリングブログをお読みください：[エージェントスキルで実世界に対応するエージェントを装備する](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)。
</Note>

スキルはコード実行ツールを通じてMessages APIと統合されます。Anthropicが管理する事前構築されたスキルを使用する場合でも、アップロードしたカスタムスキルを使用する場合でも、統合の形状は同じです。どちらもコード実行が必要で、同じ`container`構造を使用します。

### スキルの使用

スキルはソースに関係なくMessages APIで同じように統合されます。`container`パラメータでスキルを指定し、`skill_id`、`type`、およびオプションの`version`を指定すると、コード実行環境で実行されます。

**2つのソースからスキルを使用できます：**

| 側面 | Anthropicスキル | カスタムスキル |
|---|---|---|
| **Type値** | `anthropic` | `custom` |
| **スキルID** | 短い名前：`pptx`、`xlsx`、`docx`、`pdf` | 生成済み：`skill_01AbCdEfGhIjKlMnOpQrStUv` |
| **バージョン形式** | 日付ベース：`20251013`または`latest` | エポックタイムスタンプ：`1759178010641129`または`latest` |
| **管理** | Anthropicによって事前構築および保守 | [スキルAPI](/docs/ja/api/skills/create-skill)を通じてアップロードおよび管理 |
| **可用性** | すべてのユーザーが利用可能 | ワークスペースに限定 |

両方のスキルソースは[リストスキルエンドポイント](/docs/ja/api/skills/list-skills)によって返されます（`source`パラメータを使用してフィルタリング）。統合の形状と実行環境は同じです。唯一の違いはスキルの出所と管理方法です。

### 前提条件

スキルを使用するには、以下が必要です：

1. **Anthropic APIキー**（[コンソール](/settings/keys)から）
2. **ベータヘッダー**：
   - `code-execution-2025-08-25` - コード実行を有効にする（スキルに必須）
   - `skills-2025-10-02` - スキルAPIを有効にする
   - `files-api-2025-04-14` - コンテナへのファイルのアップロード/ダウンロード用
3. **コード実行ツール**がリクエストで有効になっている

---

## メッセージでスキルを使用する

### コンテナパラメータ

スキルはMessages APIの`container`パラメータを使用して指定されます。リクエストごとに最大8つのスキルを含めることができます。

構造はAnthropicスキルとカスタムスキルの両方で同じです。必須の`type`と`skill_id`を指定し、オプションで`version`を含めて特定のバージョンにピン留めします：

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    betas=["code-execution-2025-08-25", "skills-2025-10-02"],
    container={
        "skills": [
            {
                "type": "anthropic",
                "skill_id": "pptx",
                "version": "latest"
            }
        ]
    },
    messages=[{
        "role": "user",
        "content": "Create a presentation about renewable energy"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.beta.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 4096,
  betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
  container: {
    skills: [
      {
        type: 'anthropic',
        skill_id: 'pptx',
        version: 'latest'
      }
    ]
  },
  messages: [{
    role: 'user',
    content: 'Create a presentation about renewable energy'
  }],
  tools: [{
    type: 'code_execution_20250825',
    name: 'code_execution'
  }]
});
```

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5-20250929",
    "max_tokens": 4096,
    "container": {
      "skills": [
        {
          "type": "anthropic",
          "skill_id": "pptx",
          "version": "latest"
        }
      ]
    },
    "messages": [{
      "role": "user",
      "content": "Create a presentation about renewable energy"
    }],
    "tools": [{
      "type": "code_execution_20250825",
      "name": "code_execution"
    }]
  }'
```
</CodeGroup>

### 生成されたファイルのダウンロード

スキルがドキュメント（Excel、PowerPoint、PDF、Word）を作成する場合、レスポンスで`file_id`属性が返されます。これらのファイルをダウンロードするにはFiles APIを使用する必要があります。

**仕組み：**
1. スキルはコード実行中にファイルを作成する
2. レスポンスには作成されたファイルごとに`file_id`が含まれる
3. Files APIを使用して実際のファイルコンテンツをダウンロードする
4. ローカルに保存するか、必要に応じて処理する

**例：Excelファイルの作成とダウンロード**

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# ステップ1：スキルを使用してファイルを作成する
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    betas=["code-execution-2025-08-25", "skills-2025-10-02"],
    container={
        "skills": [
            {"type": "anthropic", "skill_id": "xlsx", "version": "latest"}
        ]
    },
    messages=[{
        "role": "user",
        "content": "Create an Excel file with a simple budget spreadsheet"
    }],
    tools=[{"type": "code_execution_20250825", "name": "code_execution"}]
)

# ステップ2：レスポンスからファイルIDを抽出する
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

# ステップ3：Files APIを使用してファイルをダウンロードする
for file_id in extract_file_ids(response):
    file_metadata = client.beta.files.retrieve_metadata(
        file_id=file_id,
        betas=["files-api-2025-04-14"]
    )
    file_content = client.beta.files.download(
        file_id=file_id,
        betas=["files-api-2025-04-14"]
    )

    # ステップ4：ディスクに保存する
    file_content.write_to_file(file_metadata.filename)
    print(f"Downloaded: {file_metadata.filename}")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

// ステップ1：スキルを使用してファイルを作成する
const response = await client.beta.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 4096,
  betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
  container: {
    skills: [
      {type: 'anthropic', skill_id: 'xlsx', version: 'latest'}
    ]
  },
  messages: [{
    role: 'user',
    content: 'Create an Excel file with a simple budget spreadsheet'
  }],
  tools: [{type: 'code_execution_20250825', name: 'code_execution'}]
});

// ステップ2：レスポンスからファイルIDを抽出する
function extractFileIds(response: any): string[] {
  const fileIds: string[] = [];
  for (const item of response.content) {
    if (item.type === 'bash_code_execution_tool_result') {
      const contentItem = item.content;
      if (contentItem.type === 'bash_code_execution_result') {
        for (const file of contentItem.content) {
          if ('file_id' in file) {
            fileIds.push(file.file_id);
          }
        }
      }
    }
  }
  return fileIds;
}

// ステップ3：Files APIを使用してファイルをダウンロードする
const fs = require('fs');
for (const fileId of extractFileIds(response)) {
  const fileMetadata = await client.beta.files.retrieve_metadata(fileId, {
    betas: ['files-api-2025-04-14']
  });
  const fileContent = await client.beta.files.download(fileId, {
    betas: ['files-api-2025-04-14']
  });

  // ステップ4：ディスクに保存する
  fs.writeFileSync(fileMetadata.filename, Buffer.from(await fileContent.arrayBuffer()));
  console.log(`Downloaded: ${fileMetadata.filename}`);
}
```

```bash Shell
# ステップ1：スキルを使用してファイルを作成する
RESPONSE=$(curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5-20250929",
    "max_tokens": 4096,
    "container": {
      "skills": [
        {"type": "anthropic", "skill_id": "xlsx", "version": "latest"}
      ]
    },
    "messages": [{
      "role": "user",
      "content": "Create an Excel file with a simple budget spreadsheet"
    }],
    "tools": [{
      "type": "code_execution_20250825",
      "name": "code_execution"
    }]
  }')

# ステップ2：レスポンスからfile_idを抽出する（jqを使用）
FILE_ID=$(echo "$RESPONSE" | jq -r '.content[] | select(.type=="bash_code_execution_tool_result") | .content | select(.type=="bash_code_execution_result") | .content[] | select(.file_id) | .file_id')

# ステップ3：メタデータからファイル名を取得する
FILENAME=$(curl "https://api.anthropic.com/v1/files/$FILE_ID" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" | jq -r '.filename')

# ステップ4：Files APIを使用してファイルをダウンロードする
curl "https://api.anthropic.com/v1/files/$FILE_ID/content" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  --output "$FILENAME"

echo "Downloaded: $FILENAME"
```
</CodeGroup>

**追加のFiles API操作：**

<CodeGroup>
```python Python
# ファイルメタデータを取得する
file_info = client.beta.files.retrieve_metadata(
    file_id=file_id,
    betas=["files-api-2025-04-14"]
)
print(f"Filename: {file_info.filename}, Size: {file_info.size_bytes} bytes")

# すべてのファイルをリストする
files = client.beta.files.list(betas=["files-api-2025-04-14"])
for file in files.data:
    print(f"{file.filename} - {file.created_at}")

# ファイルを削除する
client.beta.files.delete(
    file_id=file_id,
    betas=["files-api-2025-04-14"]
)
```

```typescript TypeScript
// ファイルメタデータを取得する
const fileInfo = await client.beta.files.retrieve_metadata(fileId, {
  betas: ['files-api-2025-04-14']
});
console.log(`Filename: ${fileInfo.filename}, Size: ${fileInfo.size_bytes} bytes`);

// すべてのファイルをリストする
const files = await client.beta.files.list({
  betas: ['files-api-2025-04-14']
});
for (const file of files.data) {
  console.log(`${file.filename} - ${file.created_at}`);
}

// ファイルを削除する
await client.beta.files.delete(fileId, {
  betas: ['files-api-2025-04-14']
});
```

```bash Shell
# ファイルメタデータを取得する
curl "https://api.anthropic.com/v1/files/$FILE_ID" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14"

# すべてのファイルをリストする
curl "https://api.anthropic.com/v1/files" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14"

# ファイルを削除する
curl -X DELETE "https://api.anthropic.com/v1/files/$FILE_ID" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14"
```
</CodeGroup>

<Note>
Files APIの完全な詳細については、[Files APIドキュメント](/docs/ja/api/files-content)を参照してください。
</Note>

### マルチターン会話

コンテナIDを指定して、複数のメッセージ間で同じコンテナを再利用します：

<CodeGroup>
```python Python
# 最初のリクエストがコンテナを作成する
response1 = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    betas=["code-execution-2025-08-25", "skills-2025-10-02"],
    container={
        "skills": [
            {"type": "anthropic", "skill_id": "xlsx", "version": "latest"}
        ]
    },
    messages=[{"role": "user", "content": "Analyze this sales data"}],
    tools=[{"type": "code_execution_20250825", "name": "code_execution"}]
)

# 同じコンテナで会話を続ける
messages = [
    {"role": "user", "content": "Analyze this sales data"},
    {"role": "assistant", "content": response1.content},
    {"role": "user", "content": "What was the total revenue?"}
]

response2 = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    betas=["code-execution-2025-08-25", "skills-2025-10-02"],
    container={
        "id": response1.container.id,  # コンテナを再利用する
        "skills": [
            {"type": "anthropic", "skill_id": "xlsx", "version": "latest"}
        ]
    },
    messages=messages,
    tools=[{"type": "code_execution_20250825", "name": "code_execution"}]
)
```

```typescript TypeScript
// 最初のリクエストがコンテナを作成する
const response1 = await client.beta.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 4096,
  betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
  container: {
    skills: [
      {type: 'anthropic', skill_id: 'xlsx', version: 'latest'}
    ]
  },
  messages: [{role: 'user', content: 'Analyze this sales data'}],
  tools: [{type: 'code_execution_20250825', name: 'code_execution'}]
});

// 同じコンテナで会話を続ける
const messages = [
  {role: 'user', content: 'Analyze this sales data'},
  {role: 'assistant', content: response1.content},
  {role: 'user', content: 'What was the total revenue?'}
];

const response2 = await client.beta.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 4096,
  betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
  container: {
    id: response1.container.id,  // コンテナを再利用する
    skills: [
      {type: 'anthropic', skill_id: 'xlsx', version: 'latest'}
    ]
  },
  messages,
  tools: [{type: 'code_execution_20250825', name: 'code_execution'}]
});
```
</CodeGroup>

### 長時間実行される操作

スキルは複数のターンが必要な操作を実行する場合があります。`pause_turn`停止理由を処理します：

<CodeGroup>
```python Python
messages = [{"role": "user", "content": "Process this large dataset"}]
max_retries = 10

response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    betas=["code-execution-2025-08-25", "skills-2025-10-02"],
    container={
        "skills": [
            {"type": "custom", "skill_id": "skill_01AbCdEfGhIjKlMnOpQrStUv", "version": "latest"}
        ]
    },
    messages=messages,
    tools=[{"type": "code_execution_20250825", "name": "code_execution"}]
)

# 長時間操作のためにpause_turnを処理する
for i in range(max_retries):
    if response.stop_reason != "pause_turn":
        break

    messages.append({"role": "assistant", "content": response.content})
    response = client.beta.messages.create(
        model="claude-sonnet-4-5-20250929",
        max_tokens=4096,
        betas=["code-execution-2025-08-25", "skills-2025-10-02"],
        container={
            "id": response.container.id,
            "skills": [
                {"type": "custom", "skill_id": "skill_01AbCdEfGhIjKlMnOpQrStUv", "version": "latest"}
            ]
        },
        messages=messages,
        tools=[{"type": "code_execution_20250825", "name": "code_execution"}]
    )
```

```typescript TypeScript
let messages = [{role: 'user' as const, content: 'Process this large dataset'}];
const maxRetries = 10;

let response = await client.beta.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 4096,
  betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
  container: {
    skills: [
      {type: 'custom', skill_id: 'skill_01AbCdEfGhIjKlMnOpQrStUv', version: 'latest'}
    ]
  },
  messages,
  tools: [{type: 'code_execution_20250825', name: 'code_execution'}]
});

// 長時間操作のためにpause_turnを処理する
for (let i = 0; i < maxRetries; i++) {
  if (response.stop_reason !== 'pause_turn') {
    break;
  }

  messages.push({role: 'assistant', content: response.content});
  response = await client.beta.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 4096,
    betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
    container: {
      id: response.container.id,
      skills: [
        {type: 'custom', skill_id: 'skill_01AbCdEfGhIjKlMnOpQrStUv', version: 'latest'}
      ]
    },
    messages,
    tools: [{type: 'code_execution_20250825', name: 'code_execution'}]
  });
}
```

```bash Shell
# 初期リクエスト
RESPONSE=$(curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5-20250929",
    "max_tokens": 4096,
    "container": {
      "skills": [
        {
          "type": "custom",
          "skill_id": "skill_01AbCdEfGhIjKlMnOpQrStUv",
          "version": "latest"
        }
      ]
    },
    "messages": [{
      "role": "user",
      "content": "Process this large dataset"
    }],
    "tools": [{
      "type": "code_execution_20250825",
      "name": "code_execution"
    }]
  }')

# stop_reasonを確認し、ループでpause_turnを処理する
STOP_REASON=$(echo "$RESPONSE" | jq -r '.stop_reason')
CONTAINER_ID=$(echo "$RESPONSE" | jq -r '.container.id')

while [ "$STOP_REASON" = "pause_turn" ]; do
  # 同じコンテナで続ける
  RESPONSE=$(curl https://api.anthropic.com/v1/messages \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02" \
    -H "content-type: application/json" \
    -d "{
      \"model\": \"claude-sonnet-4-5-20250929\",
      \"max_tokens\": 4096,
      \"container\": {
        \"id\": \"$CONTAINER_ID\",
        \"skills\": [{
          \"type\": \"custom\",
          \"skill_id\": \"skill_01AbCdEfGhIjKlMnOpQrStUv\",
          \"version\": \"latest\"
        }]
      },
      \"messages\": [/* include conversation history */],
      \"tools\": [{
        \"type\": \"code_execution_20250825\",
        \"name\": \"code_execution\"
      }]
    }")

  STOP_REASON=$(echo "$RESPONSE" | jq -r '.stop_reason')
done
```
</CodeGroup>

<Note>
レスポンスに`pause_turn`停止理由が含まれる場合があります。これは、APIが長時間実行されるスキル操作を一時停止したことを示します。レスポンスをそのまま後続のリクエストで提供して、Claudeがそのターンを続行できるようにするか、会話を中断して追加のガイダンスを提供する場合はコンテンツを変更できます。
</Note>

### 複数のスキルを使用する

複雑なワークフローを処理するために、単一のリクエストで複数のスキルを組み合わせます：

<CodeGroup>
```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    betas=["code-execution-2025-08-25", "skills-2025-10-02"],
    container={
        "skills": [
            {
                "type": "anthropic",
                "skill_id": "xlsx",
                "version": "latest"
            },
            {
                "type": "anthropic",
                "skill_id": "pptx",
                "version": "latest"
            },
            {
                "type": "custom",
                "skill_id": "skill_01AbCdEfGhIjKlMnOpQrStUv",
                "version": "latest"
            }
        ]
    },
    messages=[{
        "role": "user",
        "content": "Analyze sales data and create a presentation"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)
```

```typescript TypeScript
const response = await client.beta.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 4096,
  betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
  container: {
    skills: [
      {
        type: 'anthropic',
        skill_id: 'xlsx',
        version: 'latest'
      },
      {
        type: 'anthropic',
        skill_id: 'pptx',
        version: 'latest'
      },
      {
        type: 'custom',
        skill_id: 'skill_01AbCdEfGhIjKlMnOpQrStUv',
        version: 'latest'
      }
    ]
  },
  messages: [{
    role: 'user',
    content: 'Analyze sales data and create a presentation'
  }],
  tools: [{
    type: 'code_execution_20250825',
    name: 'code_execution'
  }]
});
```

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5-20250929",
    "max_tokens": 4096,
    "container": {
      "skills": [
        {
          "type": "anthropic",
          "skill_id": "xlsx",
          "version": "latest"
        },
        {
          "type": "anthropic",
          "skill_id": "pptx",
          "version": "latest"
        },
        {
          "type": "custom",
          "skill_id": "skill_01AbCdEfGhIjKlMnOpQrStUv",
          "version": "latest"
        }
      ]
    },
    "messages": [{
      "role": "user",
      "content": "Analyze sales data and create a presentation"
    }],
    "tools": [{
      "type": "code_execution_20250825",
      "name": "code_execution"
    }]
  }'
```
</CodeGroup>

---

## カスタムスキルの管理

### スキルの作成

カスタムスキルをアップロードして、ワークスペースで利用可能にします。ディレクトリパスまたは個別のファイルオブジェクトを使用してアップロードできます。

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# オプション1：files_from_dirヘルパーを使用する（Pythonのみ、推奨）
from anthropic.lib import files_from_dir

skill = client.beta.skills.create(
    display_title="Financial Analysis",
    files=files_from_dir("/path/to/financial_analysis_skill"),
    betas=["skills-2025-10-02"]
)

# オプション2：zipファイルを使用する
skill = client.beta.skills.create(
    display_title="Financial Analysis",
    files=[("skill.zip", open("financial_analysis_skill.zip", "rb"))],
    betas=["skills-2025-10-02"]
)

# オプション3：ファイルタプルを使用する（ファイル名、ファイルコンテンツ、MIMEタイプ）
skill = client.beta.skills.create(
    display_title="Financial Analysis",
    files=[
        ("financial_skill/SKILL.md", open("financial_skill/SKILL.md", "rb"), "text/markdown"),
        ("financial_skill/analyze.py", open("financial_skill/analyze.py", "rb"), "text/x-python"),
    ],
    betas=["skills-2025-10-02"]
)

print(f"Created skill: {skill.id}")
print(f"Latest version: {skill.latest_version}")
```

```typescript TypeScript
import Anthropic, { toFile } from '@anthropic-ai/sdk';
import fs from 'fs';

const client = new Anthropic();

// オプション1：zipファイルを使用する
const skill = await client.beta.skills.create({
  displayTitle: 'Financial Analysis',
  files: [
    await toFile(
      fs.createReadStream('financial_analysis_skill.zip'),
      'skill.zip'
    )
  ],
  betas: ['skills-2025-10-02']
});

// オプション2：個別のファイルオブジェクトを使用する
const skill = await client.beta.skills.create({
  displayTitle: 'Financial Analysis',
  files: [
    await toFile(
      fs.createReadStream('financial_skill/SKILL.md'),
      'financial_skill/SKILL.md',
      { type: 'text/markdown' }
    ),
    await toFile(
      fs.createReadStream('financial_skill/analyze.py'),
      'financial_skill/analyze.py',
      { type: 'text/x-python' }
    ),
  ],
  betas: ['skills-2025-10-02']
});

console.log(`Created skill: ${skill.id}`);
console.log(`Latest version: ${skill.latest_version}`);
```

```bash Shell
curl -X POST "https://api.anthropic.com/v1/skills" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: skills-2025-10-02" \
  -F "display_title=Financial Analysis" \
  -F "files[]=@financial_skill/SKILL.md;filename=financial_skill/SKILL.md" \
  -F "files[]=@financial_skill/analyze.py;filename=financial_skill/analyze.py"
```
</CodeGroup>

**要件：**
- トップレベルにSKILL.mdファイルを含める必要があります
- すべてのファイルは、パスで共通のルートディレクトリを指定する必要があります
- 合計アップロードサイズは8MB未満である必要があります
- YAMLフロントマター要件：
  - `name`：最大64文字、小文字/数字/ハイフンのみ、XMLタグなし、予約語なし（「anthropic」、「claude」）
  - `description`：最大1024文字、空でない、XMLタグなし

完全なリクエスト/レスポンススキーマについては、[スキル作成APIリファレンス](/docs/ja/api/skills/create-skill)を参照してください。

### スキルのリスト表示

ワークスペースで利用可能なすべてのスキル（Anthropicの事前構築されたスキルとカスタムスキルの両方）を取得します。`source`パラメータを使用してスキルタイプでフィルタリングします：

<CodeGroup>
```python Python
# すべてのスキルをリストする
skills = client.beta.skills.list(
    betas=["skills-2025-10-02"]
)

for skill in skills.data:
    print(f"{skill.id}: {skill.display_title} (source: {skill.source})")

# カスタムスキルのみをリストする
custom_skills = client.beta.skills.list(
    source="custom",
    betas=["skills-2025-10-02"]
)
```

```typescript TypeScript
// すべてのスキルをリストする
const skills = await client.beta.skills.list({
  betas: ['skills-2025-10-02']
});

for (const skill of skills.data) {
  console.log(`${skill.id}: ${skill.display_title} (source: ${skill.source})`);
}

// カスタムスキルのみをリストする
const customSkills = await client.beta.skills.list({
  source: 'custom',
  betas: ['skills-2025-10-02']
});
```

```bash Shell
# すべてのスキルをリストする
curl "https://api.anthropic.com/v1/skills" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: skills-2025-10-02"

# カスタムスキルのみをリストする
curl "https://api.anthropic.com/v1/skills?source=custom" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: skills-2025-10-02"
```
</CodeGroup>

ページネーションとフィルタリングオプションについては、[リストスキルAPIリファレンス](/docs/ja/api/skills/list-skills)を参照してください。

### スキルの取得

特定のスキルの詳細を取得します：

<CodeGroup>
```python Python
skill = client.beta.skills.retrieve(
    skill_id="skill_01AbCdEfGhIjKlMnOpQrStUv",
    betas=["skills-2025-10-02"]
)

print(f"Skill: {skill.display_title}")
print(f"Latest version: {skill.latest_version}")
print(f"Created: {skill.created_at}")
```

```typescript TypeScript
const skill = await client.beta.skills.retrieve(
  'skill_01AbCdEfGhIjKlMnOpQrStUv',
  { betas: ['skills-2025-10-02'] }
);

console.log(`Skill: ${skill.display_title}`);
console.log(`Latest version: ${skill.latest_version}`);
console.log(`Created: ${skill.created_at}`);
```

```bash Shell
curl "https://api.anthropic.com/v1/skills/skill_01AbCdEfGhIjKlMnOpQrStUv" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: skills-2025-10-02"
```
</CodeGroup>

### スキルの削除

スキルを削除するには、まずすべてのバージョンを削除する必要があります：

<CodeGroup>
```python Python
# ステップ1：すべてのバージョンを削除する
versions = client.beta.skills.versions.list(
    skill_id="skill_01AbCdEfGhIjKlMnOpQrStUv",
    betas=["skills-2025-10-02"]
)

for version in versions.data:
    client.beta.skills.versions.delete(
        skill_id="skill_01AbCdEfGhIjKlMnOpQrStUv",
        version=version.version,
        betas=["skills-2025-10-02"]
    )

# ステップ2：スキルを削除する
client.beta.skills.delete(
    skill_id="skill_01AbCdEfGhIjKlMnOpQrStUv",
    betas=["skills-2025-10-02"]
)
```

```typescript TypeScript
// ステップ1：すべてのバージョンを削除する
const versions = await client.beta.skills.versions.list(
  'skill_01AbCdEfGhIjKlMnOpQrStUv',
  { betas: ['skills-2025-10-02'] }
);

for (const version of versions.data) {
  await client.beta.skills.versions.delete(
    'skill_01AbCdEfGhIjKlMnOpQrStUv',
    version.version,
    { betas: ['skills-2025-10-02'] }
  );
}

// ステップ2：スキルを削除する
await client.beta.skills.delete(
  'skill_01AbCdEfGhIjKlMnOpQrStUv',
  { betas: ['skills-2025-10-02'] }
);
```

```bash Shell
# 最初にすべてのバージョンを削除してから、スキルを削除する
curl -X DELETE "https://api.anthropic.com/v1/skills/skill_01AbCdEfGhIjKlMnOpQrStUv" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: skills-2025-10-02"
```
</CodeGroup>

既存のバージョンを持つスキルを削除しようとすると、400エラーが返されます。

### バージョン管理

スキルはバージョン管理をサポートして、更新を安全に管理します：

**Anthropic管理スキル**：
- バージョンは日付形式を使用します：`20251013`
- 更新が行われると新しいバージョンがリリースされます
- 安定性のために正確なバージョンを指定します

**カスタムスキル**：
- 自動生成されたエポックタイムスタンプ：`1759178010641129`
- `"latest"`を使用して常に最新バージョンを取得します
- スキルファイルを更新するときに新しいバージョンを作成します

<CodeGroup>
```python Python
# 新しいバージョンを作成する
from anthropic.lib import files_from_dir

new_version = client.beta.skills.versions.create(
    skill_id="skill_01AbCdEfGhIjKlMnOpQrStUv",
    files=files_from_dir("/path/to/updated_skill"),
    betas=["skills-2025-10-02"]
)

# 特定のバージョンを使用する
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    betas=["code-execution-2025-08-25", "skills-2025-10-02"],
    container={
        "skills": [{
            "type": "custom",
            "skill_id": "skill_01AbCdEfGhIjKlMnOpQrStUv",
            "version": new_version.version
        }]
    },
    messages=[{"role": "user", "content": "Use updated Skill"}],
    tools=[{"type": "code_execution_20250825", "name": "code_execution"}]
)

# 最新バージョンを使用する
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    betas=["code-execution-2025-08-25", "skills-2025-10-02"],
    container={
        "skills": [{
            "type": "custom",
            "skill_id": "skill_01AbCdEfGhIjKlMnOpQrStUv",
            "version": "latest"
        }]
    },
    messages=[{"role": "user", "content": "Use latest Skill version"}],
    tools=[{"type": "code_execution_20250825", "name": "code_execution"}]
)
```

```typescript TypeScript
// zipファイルを使用して新しいバージョンを作成する
const fs = require('fs');

const newVersion = await client.beta.skills.versions.create(
  'skill_01AbCdEfGhIjKlMnOpQrStUv',
  {
    files: [
      fs.createReadStream('updated_skill.zip')
    ],
    betas: ['skills-2025-10-02']
  }
);

// 特定のバージョンを使用する
const response = await client.beta.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 4096,
  betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
  container: {
    skills: [{
      type: 'custom',
      skill_id: 'skill_01AbCdEfGhIjKlMnOpQrStUv',
      version: newVersion.version
    }]
  },
  messages: [{role: 'user', content: 'Use updated Skill'}],
  tools: [{type: 'code_execution_20250825', name: 'code_execution'}]
});

// 最新バージョンを使用する
const response = await client.beta.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 4096,
  betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
  container: {
    skills: [{
      type: 'custom',
      skill_id: 'skill_01AbCdEfGhIjKlMnOpQrStUv',
      version: 'latest'
    }]
  },
  messages: [{role: 'user', content: 'Use latest Skill version'}],
  tools: [{type: 'code_execution_20250825', name: 'code_execution'}]
});
```

```bash Shell
# 新しいバージョンを作成する
NEW_VERSION=$(curl -X POST "https://api.anthropic.com/v1/skills/skill_01AbCdEfGhIjKlMnOpQrStUv/versions" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: skills-2025-10-02" \
  -F "files[]=@updated_skill/SKILL.md;filename=updated_skill/SKILL.md")

VERSION_NUMBER=$(echo "$NEW_VERSION" | jq -r '.version')

# 特定のバージョンを使用する
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02" \
  -H "content-type: application/json" \
  -d "{
    \"model\": \"claude-sonnet-4-5-20250929\",
    \"max_tokens\": 4096,
    \"container\": {
      \"skills\": [{
        \"type\": \"custom\",
        \"skill_id\": \"skill_01AbCdEfGhIjKlMnOpQrStUv\",
        \"version\": \"$VERSION_NUMBER\"
      }]
    },
    \"messages\": [{\"role\": \"user\", \"content\": \"Use updated Skill\"}],
    \"tools\": [{\"type\": \"code_execution_20250825\", \"name\": \"code_execution\"}]
  }"

# 最新バージョンを使用する
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5-20250929",
    "max_tokens": 4096,
    "container": {
      "skills": [{
        "type": "custom",
        "skill_id": "skill_01AbCdEfGhIjKlMnOpQrStUv",
        "version": "latest"
      }]
    },
    "messages": [{"role": "user", "content": "Use latest Skill version"}],
    "tools": [{"type": "code_execution_20250825", "name": "code_execution"}]
  }'
```
</CodeGroup>

完全な詳細については、[スキルバージョン作成APIリファレンス](/docs/ja/api/skills/create-skill-version)を参照してください。

---

## スキルの読み込み方法

コンテナでスキルを指定する場合：

1. **メタデータ検出**：Claudeはシステムプロンプトで各スキルのメタデータ（名前、説明）を確認します
2. **ファイル読み込み**：スキルファイルはコンテナの`/skills/{directory}/`にコピーされます
3. **自動使用**：Claudeはリクエストに関連する場合、スキルを自動的に読み込んで使用します
4. **構成**：複数のスキルが複雑なワークフロー用に一緒に構成されます

段階的な開示アーキテクチャにより、効率的なコンテキスト使用が保証されます。Claudeは必要な場合にのみ完全なスキル指示を読み込みます。

---

## ユースケース

### 組織スキル

**ブランド＆コミュニケーション**
- ドキュメントに企業固有のフォーマット（色、フォント、レイアウト）を適用する
- 組織テンプレートに従うコミュニケーションを生成する
- すべての出力にわたってブランドガイドラインの一貫性を確保する

**プロジェクト管理**
- 企業固有のフォーマット（OKR、決定ログ）でノートを構成する
- チーム規約に従うタスクを生成する
- 標準化された会議記録とステータス更新を作成する

**ビジネス運営**
- 企業標準のレポート、提案、分析を作成する
- 企業固有の分析手順を実行する
- 組織テンプレートに従う財務モデルを生成する

### 個人スキル

**コンテンツ作成**
- カスタムドキュメントテンプレート
- 特殊なフォーマットとスタイリング
- ドメイン固有のコンテンツ生成

**データ分析**
- カスタムデータ処理パイプライン
- 特殊な可視化テンプレート
- 業界固有の分析方法

**開発＆自動化**
- コード生成テンプレート
- テストフレームワーク
- デプロイメントワークフロー

### 例：財務モデリング

ExcelとカスタムDCF分析スキルを組み合わせます：

<CodeGroup>
```python Python
# カスタムDCF分析スキルを作成する
from anthropic.lib import files_from_dir

dcf_skill = client.beta.skills.create(
    display_title="DCF Analysis",
    files=files_from_dir("/path/to/dcf_skill"),
    betas=["skills-2025-10-02"]
)

# Excelで使用して財務モデルを作成する
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    betas=["code-execution-2025-08-25", "skills-2025-10-02"],
    container={
        "skills": [
            {"type": "anthropic", "skill_id": "xlsx", "version": "latest"},
            {"type": "custom", "skill_id": dcf_skill.id, "version": "latest"}
        ]
    },
    messages=[{
        "role": "user",
        "content": "Build a DCF valuation model for a SaaS company with the attached financials"
    }],
    tools=[{"type": "code_execution_20250825", "name": "code_execution"}]
)
```

```typescript TypeScript
// カスタムDCF分析スキルを作成する
import { toFile } from '@anthropic-ai/sdk';
import fs from 'fs';

const dcfSkill = await client.beta.skills.create({
  displayTitle: 'DCF Analysis',
  files: [
    await toFile(fs.createReadStream('dcf_skill.zip'), 'skill.zip')
  ],
  betas: ['skills-2025-10-02']
});

// Excelで使用して財務モデルを作成する
const response = await client.beta.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 4096,
  betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
  container: {
    skills: [
      {type: 'anthropic', skill_id: 'xlsx', version: 'latest'},
      {type: 'custom', skill_id: dcfSkill.id, version: 'latest'}
    ]
  },
  messages: [{
    role: 'user',
    content: 'Build a DCF valuation model for a SaaS company with the attached financials'
  }],
  tools: [{type: 'code_execution_20250825', name: 'code_execution'}]
});
```

```bash Shell
# カスタムDCF分析スキルを作成する
DCF_SKILL=$(curl -X POST "https://api.anthropic.com/v1/skills" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: skills-2025-10-02" \
  -F "display_title=DCF Analysis" \
  -F "files[]=@dcf_skill/SKILL.md;filename=dcf_skill/SKILL.md")

DCF_SKILL_ID=$(echo "$DCF_SKILL" | jq -r '.id')

# Excelで使用して財務モデルを作成する
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02" \
  -H "content-type: application/json" \
  -d "{
    \"model\": \"claude-sonnet-4-5-20250929\",
    \"max_tokens\": 4096,
    \"container\": {
      \"skills\": [
        {
          \"type\": \"anthropic\",
          \"skill_id\": \"xlsx\",
          \"version\": \"latest\"
        },
        {
          \"type\": \"custom\",
          \"skill_id\": \"$DCF_SKILL_ID\",
          \"version\": \"latest\"
        }
      ]
    },
    \"messages\": [{
      \"role\": \"user\",
      \"content\": \"Build a DCF valuation model for a SaaS company with the attached financials\"
    }],
    \"tools\": [{
      \"type\": \"code_execution_20250825\",
      \"name\": \"code_execution\"
    }]
  }"
```
</CodeGroup>

---

## 制限と制約

### リクエスト制限
- **リクエストあたりの最大スキル数**：8
- **最大スキルアップロードサイズ**：8MB（すべてのファイルを合わせて）
- **YAMLフロントマター要件**：
  - `name`：最大64文字、小文字/数字/ハイフンのみ、XMLタグなし、予約語なし
  - `description`：最大1024文字、空でない、XMLタグなし

### 環境制約
スキルはコード実行コンテナで実行され、以下の制限があります：
- **ネットワークアクセスなし** - 外部APIコールを実行できない
- **ランタイムパッケージインストールなし** - 事前インストールされたパッケージのみ利用可能
- **分離環境** - 各リクエストは新しいコンテナを取得する

利用可能なパッケージについては、[コード実行ツールドキュメント](/docs/ja/agents-and-tools/tool-use/code-execution-tool)を参照してください。

---

## ベストプラクティス

### 複数のスキルを使用する場合

複数のドキュメントタイプまたはドメインを含むタスクの場合、スキルを組み合わせます：

**良いユースケース：**
- データ分析（Excel）+プレゼンテーション作成（PowerPoint）
- レポート生成（Word）+ PDFへのエクスポート
- カスタムドメインロジック+ドキュメント生成

**避けるべき：**
- 未使用のスキルを含める（パフォーマンスに影響）

### バージョン管理戦略

**本番環境の場合：**
```python
# 安定性のために特定のバージョンにピン留めする
container={
    "skills": [{
        "type": "custom",
        "skill_id": "skill_01AbCdEfGhIjKlMnOpQrStUv",
        "version": "1759178010641129"  # 特定のバージョン
    }]
}
```

**開発の場合：**
```python
# アクティブな開発に最新を使用する
container={
    "skills": [{
        "type": "custom",
        "skill_id": "skill_01AbCdEfGhIjKlMnOpQrStUv",
        "version": "latest"  # 常に最新を取得
    }]
}
```

### プロンプトキャッシングの考慮事項

プロンプトキャッシングを使用する場合、コンテナ内のスキルリストを変更するとキャッシュが破損することに注意してください：

<CodeGroup>
```python Python
# 最初のリクエストがキャッシュを作成する
response1 = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    betas=["code-execution-2025-08-25", "skills-2025-10-02", "prompt-caching-2024-07-31"],
    container={
        "skills": [
            {"type": "anthropic", "skill_id": "xlsx", "version": "latest"}
        ]
    },
    messages=[{"role": "user", "content": "Analyze sales data"}],
    tools=[{"type": "code_execution_20250825", "name": "code_execution"}]
)

# スキルの追加/削除がキャッシュを破損する
response2 = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    betas=["code-execution-2025-08-25", "skills-2025-10-02", "prompt-caching-2024-07-31"],
    container={
        "skills": [
            {"type": "anthropic", "skill_id": "xlsx", "version": "latest"},
            {"type": "anthropic", "skill_id": "pptx", "version": "latest"}  # キャッシュミス
        ]
    },
    messages=[{"role": "user", "content": "Create a presentation"}],
    tools=[{"type": "code_execution_20250825", "name": "code_execution"}]
)
```

```typescript TypeScript
// 最初のリクエストがキャッシュを作成する
const response1 = await client.beta.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 4096,
  betas: ['code-execution-2025-08-25', 'skills-2025-10-02', 'prompt-caching-2024-07-31'],
  container: {
    skills: [
      {type: 'anthropic', skill_id: 'xlsx', version: 'latest'}
    ]
  },
  messages: [{role: 'user', content: 'Analyze sales data'}],
  tools: [{type: 'code_execution_20250825', name: 'code_execution'}]
});

// スキルの追加/削除がキャッシュを破損する
const response2 = await client.beta.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 4096,
  betas: ['code-execution-2025-08-25', 'skills-2025-10-02', 'prompt-caching-2024-07-31'],
  container: {
    skills: [
      {type: 'anthropic', skill_id: 'xlsx', version: 'latest'},
      {type: 'anthropic', skill_id: 'pptx', version: 'latest'}  // キャッシュミス
    ]
  },
  messages: [{role: 'user', content: 'Create a presentation'}],
  tools: [{type: 'code_execution_20250825', name: 'code_execution'}]
});
```

```bash Shell
# 最初のリクエストがキャッシュを作成する
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02,prompt-caching-2024-07-31" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5-20250929",
    "max_tokens": 4096,
    "container": {
      "skills": [
        {"type": "anthropic", "skill_id": "xlsx", "version": "latest"}
      ]
    },
    "messages": [{"role": "user", "content": "Analyze sales data"}],
    "tools": [{"type": "code_execution_20250825", "name": "code_execution"}]
  }'

# スキルの追加/削除がキャッシュを破損する
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02,prompt-caching-2024-07-31" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5-20250929",
    "max_tokens": 4096,
    "container": {
      "skills": [
        {"type": "anthropic", "skill_id": "xlsx", "version": "latest"},
        {"type": "anthropic", "skill_id": "pptx", "version": "latest"}
      ]
    },
    "messages": [{"role": "user", "content": "Create a presentation"}],
    "tools": [{"type": "code_execution_20250825", "name": "code_execution"}]
  }'
```
</CodeGroup>

最適なキャッシングパフォーマンスのために、リクエスト間でスキルリストを一貫性のあるものに保ちます。

### エラーハンドリング

スキル関連のエラーを適切に処理します：

<CodeGroup>
```python Python
try:
    response = client.beta.messages.create(
        model="claude-sonnet-4-5-20250929",
        max_tokens=4096,
        betas=["code-execution-2025-08-25", "skills-2025-10-02"],
        container={
            "skills": [
                {"type": "custom", "skill_id": "skill_01AbCdEfGhIjKlMnOpQrStUv", "version": "latest"}
            ]
        },
        messages=[{"role": "user", "content": "Process data"}],
        tools=[{"type": "code_execution_20250825", "name": "code_execution"}]
    )
except anthropic.BadRequestError as e:
    if "skill" in str(e):
        print(f"Skill error: {e}")
        # スキル固有のエラーを処理する
    else:
        raise
```

```typescript TypeScript
try {
  const response = await client.beta.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 4096,
    betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
    container: {
      skills: [
        {type: 'custom', skill_id: 'skill_01AbCdEfGhIjKlMnOpQrStUv', version: 'latest'}
      ]
    },
    messages: [{role: 'user', content: 'Process data'}],
    tools: [{type: 'code_execution_20250825', name: 'code_execution'}]
  });
} catch (error) {
  if (error instanceof Anthropic.BadRequestError && error.message.includes('skill')) {
    console.error(`Skill error: ${error.message}`);
    // スキル固有のエラーを処理する
  } else {
    throw error;
  }
}
```
</CodeGroup>

---

## 次のステップ

<CardGroup cols={2}>
  <Card
    title="APIリファレンス"
    icon="book"
    href="/docs/ja/api/skills/create-skill"
  >
    すべてのエンドポイントを含む完全なAPIリファレンス
  </Card>
  <Card
    title="作成ガイド"
    icon="edit"
    href="/docs/ja/agents-and-tools/agent-skills/best-practices"
  >
    効果的なスキル作成のベストプラクティス
  </Card>
  <Card
    title="コード実行ツール"
    icon="terminal"
    href="/docs/ja/agents-and-tools/tool-use/code-execution-tool"
  >
    コード実行環境について学ぶ
  </Card>
</CardGroup>