# Files API

---

Files APIを使用すると、Claude APIで使用するファイルをアップロードして管理できます。リクエストのたびにコンテンツを再度アップロードする必要がありません。これは、[コード実行ツール](/docs/ja/agents-and-tools/tool-use/code-execution-tool)を使用して入力（データセットやドキュメントなど）を提供し、出力（チャートなど）をダウンロードする場合に特に便利です。Files APIを使用して、複数のAPI呼び出し全体で頻繁に使用されるドキュメントと画像を継続的に再度アップロードする必要がなくなります。このガイドに加えて、[APIリファレンスを直接探索](/docs/ja/api/files-create)することもできます。

<Note>
Files APIは現在ベータ版です。[フィードバックフォーム](https://forms.gle/tisHyierGwgN4DUE9)を通じてお問い合わせいただき、Files APIでのご経験をお聞かせください。
</Note>

## サポートされているモデル

Messages リクエストで `file_id` を参照することは、指定されたファイルタイプをサポートするすべてのモデルでサポートされています。たとえば、[画像](/docs/ja/build-with-claude/vision)はすべてのClaude 3+モデルでサポートされ、[PDF](/docs/ja/build-with-claude/pdf-support)はすべてのClaude 3.5+モデルでサポートされ、[その他のさまざまなファイルタイプ](/docs/ja/agents-and-tools/tool-use/code-execution-tool#supported-file-types)はClaude 3.5 HaikuおよびすべてのClaude 3.7+モデルのコード実行ツールでサポートされています。

Files APIは現在、Amazon BedrockまたはGoogle Vertex AIではサポートされていません。

## Files APIの仕組み

Files APIは、ファイルを操作するためのシンプルな「一度アップロード、何度も使用」アプローチを提供します：

- **ファイルをアップロード**して、セキュアなストレージに保存し、一意の `file_id` を受け取ります
- **ファイルをダウンロード**して、スキルまたはコード実行ツールから作成されたファイルを取得します
- **ファイルを参照**して、[Messages](/docs/ja/api/messages)リクエストで `file_id` を使用し、コンテンツを再度アップロードする代わりに使用します
- **ファイルを管理**して、リスト、取得、削除操作を実行します

## Files APIの使用方法

<Note>
Files APIを使用するには、ベータ機能ヘッダーを含める必要があります：`anthropic-beta: files-api-2025-04-14`。
</Note>

### ファイルのアップロード

将来のAPI呼び出しで参照するためにファイルをアップロードします：

<CodeGroup>
```bash Shell
curl -X POST https://api.anthropic.com/v1/files \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  -F "file=@/path/to/document.pdf"
```

```python Python
import anthropic

client = anthropic.Anthropic()
client.beta.files.upload(
  file=("document.pdf", open("/path/to/document.pdf", "rb"), "application/pdf"),
)
```

```typescript TypeScript
import Anthropic, { toFile } from '@anthropic-ai/sdk';
import fs from "fs";

const anthropic = new Anthropic();

await anthropic.beta.files.upload({
  file: await toFile(fs.createReadStream('/path/to/document.pdf'), undefined, { type: 'application/pdf' })
}, {
  betas: ['files-api-2025-04-14']
});
```
</CodeGroup>

ファイルをアップロードしたときのレスポンスには、以下が含まれます：

```json
{
  "id": "file_011CNha8iCJcU1wXNR6q4V8w",
  "type": "file",
  "filename": "document.pdf",
  "mime_type": "application/pdf",
  "size_bytes": 1024000,
  "created_at": "2025-01-01T00:00:00Z",
  "downloadable": false
}
```

### メッセージでファイルを使用する

アップロード後、`file_id` を使用してファイルを参照します：

<CodeGroup>
```bash Shell
curl -X POST https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "Please summarize this document for me."          
          },
          {
            "type": "document",
            "source": {
              "type": "file",
              "file_id": "file_011CNha8iCJcU1wXNR6q4V8w"
            }
          }
        ]
      }
    ]
  }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Please summarize this document for me."
                },
                {
                    "type": "document",
                    "source": {
                        "type": "file",
                        "file_id": "file_011CNha8iCJcU1wXNR6q4V8w"
                    }
                }
            ]
        }
    ],
    betas=["files-api-2025-04-14"],
)
print(response)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "Please summarize this document for me."
        },
        {
          type: "document",
          source: {
            type: "file",
            file_id: "file_011CNha8iCJcU1wXNR6q4V8w"
          }
        }
      ]
    }
  ],
  betas: ["files-api-2025-04-14"],
});

console.log(response);
```
</CodeGroup>

### ファイルタイプとコンテンツブロック

Files APIは、異なるコンテンツブロックタイプに対応する異なるファイルタイプをサポートしています：

| ファイルタイプ | MIMEタイプ | コンテンツブロックタイプ | ユースケース |
| :--- | :--- | :--- | :--- |
| PDF | `application/pdf` | `document` | テキスト分析、ドキュメント処理 |
| プレーンテキスト | `text/plain` | `document` | テキスト分析、処理 |
| 画像 | `image/jpeg`, `image/png`, `image/gif`, `image/webp` | `image` | 画像分析、ビジュアルタスク |
| [データセット、その他](/docs/ja/agents-and-tools/tool-use/code-execution-tool#supported-file-types) | 異なる | `container_upload` | データ分析、ビジュアライゼーション作成 |

### その他のファイル形式の操作

`document` ブロックとしてサポートされていないファイルタイプ（.csv、.txt、.md、.docx、.xlsx）の場合、ファイルをプレーンテキストに変換し、コンテンツをメッセージに直接含めます：

<CodeGroup>
```bash Shell
# 例：テキストファイルを読み込んでプレーンテキストとして送信
# 注：特殊文字を含むファイルの場合、base64エンコーディングを検討してください
TEXT_CONTENT=$(cat document.txt | jq -Rs .)

curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d @- <<EOF
{
  "model": "claude-sonnet-4-5",
  "max_tokens": 1024,
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "Here's the document content:\n\n${TEXT_CONTENT}\n\nPlease summarize this document."
        }
      ]
    }
  ]
}
EOF
```

```python Python
import pandas as pd
import anthropic

client = anthropic.Anthropic()

# 例：CSVファイルを読み込む
df = pd.read_csv('data.csv')
csv_content = df.to_string()

# メッセージ内でプレーンテキストとして送信
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": f"Here's the CSV data:\n\n{csv_content}\n\nPlease analyze this data."
                }
            ]
        }
    ]
)

print(response.content[0].text)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';
import fs from 'fs';

const anthropic = new Anthropic();

async function analyzeDocument() {
  // 例：テキストファイルを読み込む
  const textContent = fs.readFileSync('document.txt', 'utf-8');

  // メッセージ内でプレーンテキストとして送信
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Here's the document content:\n\n${textContent}\n\nPlease summarize this document.`
          }
        ]
      }
    ]
  });

  console.log(response.content[0].text);
}

analyzeDocument();
```
</CodeGroup>

<Note>
画像を含む.docxファイルの場合、まずPDF形式に変換してから、[PDFサポート](/docs/ja/build-with-claude/pdf-support)を使用して組み込みの画像解析を活用します。これにより、PDFドキュメントからの引用を使用できます。
</Note>

#### ドキュメントブロック

PDFとテキストファイルの場合、`document` コンテンツブロックを使用します：

```json
{
  "type": "document",
  "source": {
    "type": "file",
    "file_id": "file_011CNha8iCJcU1wXNR6q4V8w"
  },
  "title": "Document Title", // オプション
  "context": "Context about the document", // オプション  
  "citations": {"enabled": true} // オプション、引用を有効にします
}
```

#### 画像ブロック

画像の場合、`image` コンテンツブロックを使用します：

```json
{
  "type": "image",
  "source": {
    "type": "file",
    "file_id": "file_011CPMxVD3fHLUhvTqtsQA5w"
  }
}
```

### ファイルの管理

#### ファイルのリスト

アップロードされたファイルのリストを取得します：

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/files \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14"
```

```python Python
import anthropic

client = anthropic.Anthropic()
files = client.beta.files.list()
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();
const files = await anthropic.beta.files.list({
  betas: ['files-api-2025-04-14'],
});
```
</CodeGroup>

#### ファイルメタデータの取得

特定のファイルに関する情報を取得します：

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/files/file_011CNha8iCJcU1wXNR6q4V8w \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14"
```

```python Python
import anthropic

client = anthropic.Anthropic()
file = client.beta.files.retrieve_metadata("file_011CNha8iCJcU1wXNR6q4V8w")
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();
const file = await anthropic.beta.files.retrieveMetadata(
  "file_011CNha8iCJcU1wXNR6q4V8w",
  { betas: ['files-api-2025-04-14'] },
);
```
</CodeGroup>

#### ファイルの削除

ワークスペースからファイルを削除します：

<CodeGroup>
```bash Shell
curl -X DELETE https://api.anthropic.com/v1/files/file_011CNha8iCJcU1wXNR6q4V8w \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14"
```

```python Python
import anthropic

client = anthropic.Anthropic()
result = client.beta.files.delete("file_011CNha8iCJcU1wXNR6q4V8w")
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();
const result = await anthropic.beta.files.delete(
  "file_011CNha8iCJcU1wXNR6q4V8w",
  { betas: ['files-api-2025-04-14'] },
);
```
</CodeGroup>

### ファイルのダウンロード

スキルまたはコード実行ツールによって作成されたファイルをダウンロードします：

<CodeGroup>
```bash Shell
curl -X GET "https://api.anthropic.com/v1/files/file_011CNha8iCJcU1wXNR6q4V8w/content" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  --output downloaded_file.txt
```

```python Python
import anthropic

client = anthropic.Anthropic()
file_content = client.beta.files.download("file_011CNha8iCJcU1wXNR6q4V8w")

# ファイルに保存
with open("downloaded_file.txt", "w") as f:
    f.write(file_content.decode('utf-8'))
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';
import fs from 'fs';

const anthropic = new Anthropic();

const fileContent = await anthropic.beta.files.download(
  "file_011CNha8iCJcU1wXNR6q4V8w",
  { betas: ['files-api-2025-04-14'] },
);

// ファイルに保存
fs.writeFileSync("downloaded_file.txt", fileContent);
```
</CodeGroup>

<Note>
ダウンロードできるのは、[スキル](/docs/ja/build-with-claude/skills-guide)またはコード実行ツール](/ja/agents-and-tools/tool-use/code-execution-tool)によって作成されたファイルのみです。アップロードしたファイルはダウンロードできません。
</Note>

---

## ファイルストレージと制限

### ストレージ制限

- **最大ファイルサイズ：** ファイルあたり500 MB
- **総ストレージ：** 組織あたり100 GB

### ファイルのライフサイクル

- ファイルはAPIキーのワークスペースにスコープされます。他のAPIキーは、同じワークスペースに関連付けられた他のAPIキーによって作成されたファイルを使用できます
- ファイルは削除するまで保持されます
- 削除されたファイルは復旧できません
- ファイルはAPI経由で削除後すぐにアクセスできなくなりますが、アクティブな `Messages` API呼び出しと関連するツール使用に保持される場合があります
- ユーザーが削除したファイルは、[データ保持ポリシー](https://privacy.claude.com/en/articles/7996866-how-long-do-you-store-my-organization-s-data)に従って削除されます。

---

## エラーハンドリング

Files APIを使用する場合の一般的なエラーには、以下が含まれます：

- **ファイルが見つかりません（404）：** 指定された `file_id` が存在しないか、アクセス権がありません
- **無効なファイルタイプ（400）：** ファイルタイプがコンテンツブロックタイプと一致しません（例：ドキュメントブロックで画像ファイルを使用）
- **コンテキストウィンドウサイズを超過（400）：** ファイルがコンテキストウィンドウサイズより大きい（例：`/v1/messages` リクエストで500 MBのプレーンテキストファイルを使用）
- **無効なファイル名（400）：** ファイル名が長さ要件（1～255文字）を満たしていないか、禁止文字（`<`、`>`、`:`、`"`、`|`、`?`、`*`、`\`、`/`、またはユニコード文字0～31）を含んでいます
- **ファイルが大きすぎます（413）：** ファイルが500 MBの制限を超えています
- **ストレージ制限を超過（403）：** 組織が100 GBのストレージ制限に達しています

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "File not found: file_011CNha8iCJcU1wXNR6q4V8w"
  }
}
```

## 使用とビリング

File API操作は**無料**です：
- ファイルのアップロード
- ファイルのダウンロード
- ファイルのリスト
- ファイルメタデータの取得
- ファイルの削除

`Messages` リクエストで使用されるファイルコンテンツは、入力トークンとして課金されます。ダウンロードできるのは、[スキル](/docs/ja/build-with-claude/skills-guide)またはコード実行ツール](/ja/agents-and-tools/tool-use/code-execution-tool)によって作成されたファイルのみです。

### レート制限

ベータ期間中：
- ファイル関連のAPI呼び出しは、1分あたり約100リクエストに制限されています
- ユースケースに対してより高い制限が必要な場合は、[お問い合わせください](mailto:sales@anthropic.com)