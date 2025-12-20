# Files API

---

Files API 让您可以上传和管理文件以与 Claude API 一起使用，而无需在每次请求时重新上传内容。这在使用[代码执行工具](/docs/zh-CN/agents-and-tools/tool-use/code-execution-tool)提供输入（例如数据集和文档）然后下载输出（例如图表）时特别有用。您还可以使用 Files API 来避免在多个 API 调用中不断重新上传经常使用的文档和图像。您可以[直接探索 API 参考](/docs/zh-CN/api/files-create)，以及本指南。

<Note>
Files API 目前处于测试版。请通过我们的[反馈表单](https://forms.gle/tisHyierGwgN4DUE9)分享您对 Files API 的体验。
</Note>

## 支持的模型

在 Messages 请求中引用 `file_id` 在所有支持给定文件类型的模型中都受支持。例如，[图像](/docs/zh-CN/build-with-claude/vision)在所有 Claude 3+ 模型中受支持，[PDF](/docs/zh-CN/build-with-claude/pdf-support) 在所有 Claude 3.5+ 模型中受支持，以及[各种其他文件类型](/docs/zh-CN/agents-and-tools/tool-use/code-execution-tool#supported-file-types)用于 Claude 3.5 Haiku 及所有 Claude 3.7+ 模型中的代码执行工具。

Files API 目前在 Amazon Bedrock 或 Google Vertex AI 上不受支持。

## Files API 如何工作

Files API 提供了一种简单的创建一次、使用多次的文件处理方法：

- **上传文件**到我们的安全存储并接收唯一的 `file_id`
- **下载文件**由技能或代码执行工具创建
- **在 [Messages](/docs/zh-CN/api/messages) 请求中引用文件**使用 `file_id` 而不是重新上传内容
- **管理您的文件**通过列表、检索和删除操作

## 如何使用 Files API

<Note>
要使用 Files API，您需要包含测试版功能头：`anthropic-beta: files-api-2025-04-14`。
</Note>

### 上传文件

上传文件以在将来的 API 调用中引用：

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

上传文件的响应将包括：

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

### 在消息中使用文件

上传后，使用其 `file_id` 引用文件：

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

### 文件类型和内容块

Files API 支持对应于不同内容块类型的不同文件类型：

| 文件类型 | MIME 类型 | 内容块类型 | 用例 |
| :--- | :--- | :--- | :--- |
| PDF | `application/pdf` | `document` | 文本分析、文档处理 |
| 纯文本 | `text/plain` | `document` | 文本分析、处理 |
| 图像 | `image/jpeg`, `image/png`, `image/gif`, `image/webp` | `image` | 图像分析、视觉任务 |
| [数据集、其他](/docs/zh-CN/agents-and-tools/tool-use/code-execution-tool#supported-file-types) | 变化 | `container_upload` | 分析数据、创建可视化  |

### 使用其他文件格式

对于不支持作为 `document` 块的文件类型（.csv、.txt、.md、.docx、.xlsx），将文件转换为纯文本，并将内容直接包含在您的消息中：

<CodeGroup>
```bash Shell
# 示例：读取文本文件并将其作为纯文本发送
# 注意：对于包含特殊字符的文件，请考虑 base64 编码
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

# 示例：读取 CSV 文件
df = pd.read_csv('data.csv')
csv_content = df.to_string()

# 在消息中作为纯文本发送
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
  // 示例：读取文本文件
  const textContent = fs.readFileSync('document.txt', 'utf-8');

  // 在消息中作为纯文本发送
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
对于包含图像的 .docx 文件，首先将其转换为 PDF 格式，然后使用[PDF 支持](/docs/zh-CN/build-with-claude/pdf-support)来利用内置的图像解析。这允许使用 PDF 文档中的引用。
</Note>

#### 文档块

对于 PDF 和文本文件，使用 `document` 内容块：

```json
{
  "type": "document",
  "source": {
    "type": "file",
    "file_id": "file_011CNha8iCJcU1wXNR6q4V8w"
  },
  "title": "Document Title", // 可选
  "context": "Context about the document", // 可选  
  "citations": {"enabled": true} // 可选，启用引用
}
```

#### 图像块

对于图像，使用 `image` 内容块：

```json
{
  "type": "image",
  "source": {
    "type": "file",
    "file_id": "file_011CPMxVD3fHLUhvTqtsQA5w"
  }
}
```

### 管理文件

#### 列表文件

检索您上传的文件列表：

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

#### 获取文件元数据

检索有关特定文件的信息：

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

#### 删除文件

从您的工作区删除文件：

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

### 下载文件

下载由技能或代码执行工具创建的文件：

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

# 保存到文件
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

// 保存到文件
fs.writeFileSync("downloaded_file.txt", fileContent);
```
</CodeGroup>

<Note>
您只能下载由[技能](/docs/zh-CN/build-with-claude/skills-guide)或[代码执行工具](/docs/zh-CN/agents-and-tools/tool-use/code-execution-tool)创建的文件。您上传的文件无法下载。
</Note>

---

## 文件存储和限制

### 存储限制

- **最大文件大小：** 每个文件 500 MB
- **总存储空间：** 每个组织 100 GB

### 文件生命周期

- 文件的作用域限于 API 密钥的工作区。其他 API 密钥可以使用由与同一工作区关联的任何其他 API 密钥创建的文件
- 文件持续存在直到您删除它们
- 已删除的文件无法恢复
- 删除后不久，文件将无法通过 API 访问，但它们可能会在活跃的 `Messages` API 调用和相关工具使用中持续存在
- 用户删除的文件将根据我们的[数据保留政策](https://privacy.claude.com/en/articles/7996866-how-long-do-you-store-my-organization-s-data)被删除。

---

## 错误处理

使用 Files API 时的常见错误包括：

- **文件未找到 (404)：** 指定的 `file_id` 不存在或您无权访问它
- **无效的文件类型 (400)：** 文件类型与内容块类型不匹配（例如，在文档块中使用图像文件）
- **超过上下文窗口大小 (400)：** 文件大于上下文窗口大小（例如在 `/v1/messages` 请求中使用 500 MB 纯文本文件）
- **无效的文件名 (400)：** 文件名不符合长度要求（1-255 个字符）或包含禁止字符（`<`、`>`、`:`、`"`、`|`、`?`、`*`、`\`、`/` 或 unicode 字符 0-31）
- **文件过大 (413)：** 文件超过 500 MB 限制
- **超过存储限制 (403)：** 您的组织已达到 100 GB 存储限制

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "File not found: file_011CNha8iCJcU1wXNR6q4V8w"
  }
}
```

## 使用和计费

Files API 操作是**免费的**：
- 上传文件
- 下载文件
- 列表文件
- 获取文件元数据  
- 删除文件

在 `Messages` 请求中使用的文件内容按输入令牌计费。您只能下载由[技能](/docs/zh-CN/build-with-claude/skills-guide)或[代码执行工具](/docs/zh-CN/agents-and-tools/tool-use/code-execution-tool)创建的文件。

### 速率限制

在测试版期间：
- 与文件相关的 API 调用限制为每分钟大约 100 个请求
- 如果您的用例需要更高的限制，请[联系我们](mailto:sales@anthropic.com)