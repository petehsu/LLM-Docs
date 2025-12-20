# 代码执行工具

Claude 可以在 API 对话中直接分析数据、创建可视化、执行复杂计算、运行系统命令、创建和编辑文件，以及处理上传的文件。

---

Claude 可以分析数据、创建可视化、执行复杂计算、运行系统命令、创建和编辑文件，以及直接在 API 对话中处理上传的文件。
代码执行工具允许 Claude 在安全的沙箱环境中运行 Bash 命令和操作文件，包括编写代码。

<Note>
代码执行工具目前处于公开测试阶段。

要使用此功能，请在 API 请求中添加 `"code-execution-2025-08-25"` [测试版标头](/docs/zh-CN/api/beta-headers)。
</Note>

## 模型兼容性

代码执行工具在以下模型上可用：

| 模型 | 工具版本 |
|-------|--------------|
| Claude Opus 4.5 (`claude-opus-4-5-20251101`) | `code_execution_20250825` |
| Claude Opus 4.1 (`claude-opus-4-1-20250805`) | `code_execution_20250825` |
| Claude Opus 4 (`claude-opus-4-20250514`) | `code_execution_20250825` |
| Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`) | `code_execution_20250825` |
| Claude Sonnet 4 (`claude-sonnet-4-20250514`) | `code_execution_20250825` |
| Claude Sonnet 3.7 (`claude-3-7-sonnet-20250219`) ([已弃用](/docs/zh-CN/about-claude/model-deprecations)) | `code_execution_20250825` |
| Claude Haiku 4.5 (`claude-haiku-4-5-20251001`) | `code_execution_20250825` |
| Claude Haiku 3.5 (`claude-3-5-haiku-latest`) | `code_execution_20250825` |

<Note>
当前版本 `code_execution_20250825` 支持 Bash 命令和文件操作。还提供了仅支持 Python 的旧版本 `code_execution_20250522`。有关迁移详情，请参阅[升级到最新工具版本](#upgrade-to-latest-tool-version)。
</Note>

<Warning>
较旧的工具版本不保证与较新的模型向后兼容。始终使用与您的模型版本相对应的工具版本。
</Warning>

## 快速开始

这是一个简单的示例，要求 Claude 执行计算：

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

## 代码执行的工作原理

当您在 API 请求中添加代码执行工具时：

1. Claude 评估代码执行是否有助于回答您的问题
2. 该工具自动为 Claude 提供以下功能：
   - **Bash 命令**：执行 shell 命令进行系统操作和包管理
   - **文件操作**：直接创建、查看和编辑文件，包括编写代码
3. Claude 可以在单个请求中使用这些功能的任意组合
4. 所有操作都在安全的沙箱环境中运行
5. Claude 提供结果，包括任何生成的图表、计算或分析

## 如何使用该工具

### 执行 Bash 命令

要求 Claude 检查系统信息并安装包：

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

### 直接创建和编辑文件

Claude 可以使用文件操作功能在沙箱中直接创建、查看和编辑文件：

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

### 上传和分析您自己的文件

要分析您自己的数据文件（CSV、Excel、图像等），请通过文件 API 上传它们，并在您的请求中引用它们：

<Note>
使用文件 API 与代码执行需要两个测试版标头：`"anthropic-beta": "code-execution-2025-08-25,files-api-2025-04-14"`
</Note>

Python 环境可以处理通过文件 API 上传的各种文件类型，包括：

- CSV
- Excel (.xlsx, .xls)
- JSON
- XML
- 图像 (JPEG, PNG, GIF, WebP)
- 文本文件 (.txt, .md, .py 等)

#### 上传和分析文件

1. **使用[文件 API](/docs/zh-CN/build-with-claude/files) 上传您的文件**
2. **在您的消息中使用 `container_upload` 内容块引用该文件**
3. **在您的 API 请求中包含代码执行工具**

<CodeGroup>
```bash Shell
# 首先，上传一个文件
curl https://api.anthropic.com/v1/files \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: files-api-2025-04-14" \
    --form 'file=@"data.csv"' \

# 然后使用文件 ID 进行代码执行
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

# 上传一个文件
file_object = client.beta.files.upload(
    file=open("data.csv", "rb"),
)

# 使用文件 ID 进行代码执行
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
  // 上传一个文件
  const fileObject = await anthropic.beta.files.create({
    file: createReadStream("data.csv"),
  });

  // 使用文件 ID 进行代码执行
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

#### 检索生成的文件

当 Claude 在代码执行期间创建文件时，您可以使用文件 API 检索这些文件：

<CodeGroup>
```python Python
from anthropic import Anthropic

# 初始化客户端
client = Anthropic()

# 请求创建文件的代码执行
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

# 从响应中提取文件 ID
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

# 下载创建的文件
for file_id in extract_file_ids(response):
    file_metadata = client.beta.files.retrieve_metadata(file_id)
    file_content = client.beta.files.download(file_id)
    file_content.write_to_file(file_metadata.filename)
    print(f"Downloaded: {file_metadata.filename}")
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';
import { writeFileSync } from 'fs';

// 初始化客户端
const anthropic = new Anthropic();

async function main() {
  // 请求创建文件的代码执行
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

  // 从响应中提取文件 ID
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

  // 下载创建的文件
  const fileIds = extractFileIds(response);
  for (const fileId of fileIds) {
    const fileMetadata = await anthropic.beta.files.retrieveMetadata(fileId);
    const fileContent = await anthropic.beta.files.download(fileId);

    // 将 ReadableStream 转换为 Buffer 并保存
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

### 组合操作

使用所有功能的复杂工作流：

<CodeGroup>
```bash Shell
# 首先，上传一个文件
curl https://api.anthropic.com/v1/files \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: files-api-2025-04-14" \
    --form 'file=@"data.csv"' \
    > file_response.json

# 提取文件 ID（使用 jq）
FILE_ID=$(jq -r '.id' file_response.json)

# 然后使用它进行代码执行
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
# 上传一个文件
file_object = client.beta.files.upload(
    file=open("data.csv", "rb"),
)

# 使用它进行代码执行
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

# Claude 可能会：
# 1. 使用 bash 检查文件大小和预览数据
# 2. 使用 text_editor 编写 Python 代码来分析 CSV 并创建可视化
# 3. 使用 bash 运行 Python 代码
# 4. 使用 text_editor 创建包含发现的 README.md
# 5. 使用 bash 将文件组织到报告目录中
```

```typescript TypeScript
// 上传一个文件
const fileObject = await anthropic.beta.files.create({
  file: createReadStream("data.csv"),
});

// 使用它进行代码执行
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

// Claude 可能会：
// 1. 使用 bash 检查文件大小和预览数据
// 2. 使用 text_editor 编写 Python 代码来分析 CSV 并创建可视化
// 3. 使用 bash 运行 Python 代码
// 4. 使用 text_editor 创建包含发现的 README.md
// 5. 使用 bash 将文件组织到报告目录中
```
</CodeGroup>

## 工具定义

代码执行工具不需要额外的参数：

```json JSON
{
  "type": "code_execution_20250825",
  "name": "code_execution"
}
```

当提供此工具时，Claude 自动获得对两个子工具的访问权限：
- `bash_code_execution`：运行 shell 命令
- `text_editor_code_execution`：查看、创建和编辑文件，包括编写代码

## 响应格式

代码执行工具可以根据操作返回两种类型的结果：

### Bash 命令响应

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

### 文件操作响应

**查看文件：**
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

**创建文件：**
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

**编辑文件 (str_replace)：**
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

### 结果

所有执行结果包括：
- `stdout`：成功执行的输出
- `stderr`：执行失败时的错误消息
- `return_code`：成功为 0，失败为非零

文件操作的其他字段：
- **查看**：`file_type`、`content`、`numLines`、`startLine`、`totalLines`
- **创建**：`is_file_update`（文件是否已存在）
- **编辑**：`oldStart`、`oldLines`、`newStart`、`newLines`、`lines`（差异格式）

### 错误

每种工具类型都可以返回特定的错误：

**常见错误（所有工具）：**
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

**按工具类型的错误代码：**

| 工具 | 错误代码 | 描述 |
|------|-----------|-------------|
| 所有工具 | `unavailable` | 该工具暂时不可用 |
| 所有工具 | `execution_time_exceeded` | 执行超过最大时间限制 |
| 所有工具 | `container_expired` | 容器已过期且不再可用 |
| 所有工具 | `invalid_tool_input` | 提供给工具的参数无效 |
| 所有工具 | `too_many_requests` | 超过工具使用速率限制 |
| text_editor | `file_not_found` | 文件不存在（用于查看/编辑操作） |
| text_editor | `string_not_found` | 在文件中找不到 `old_str`（用于 str_replace） |

#### `pause_turn` 停止原因

响应可能包括 `pause_turn` 停止原因，这表示 API 暂停了长时间运行的轮次。您可以在后续请求中按原样提供响应以让 Claude 继续其轮次，或者如果您想中断对话，可以修改内容。

## 容器

代码执行工具在专为代码执行设计的安全容器化环境中运行，重点关注 Python。

### 运行时环境
- **Python 版本**：3.11.12
- **操作系统**：基于 Linux 的容器
- **架构**：x86_64 (AMD64)

### 资源限制
- **内存**：5GiB RAM
- **磁盘空间**：5GiB 工作区存储
- **CPU**：1 个 CPU

### 网络和安全
- **互联网访问**：出于安全考虑完全禁用
- **外部连接**：不允许出站网络请求
- **沙箱隔离**：与主机系统和其他容器完全隔离
- **文件访问**：仅限于工作区目录
- **工作区范围**：与[文件](/docs/zh-CN/build-with-claude/files)一样，容器的范围限定为 API 密钥的工作区
- **过期**：容器在创建后 30 天过期

### 预安装库
沙箱 Python 环境包括这些常用库：
- **数据科学**：pandas、numpy、scipy、scikit-learn、statsmodels
- **可视化**：matplotlib、seaborn
- **文件处理**：pyarrow、openpyxl、xlsxwriter、xlrd、pillow、python-pptx、python-docx、pypdf、pdfplumber、pypdfium2、pdf2image、pdfkit、tabula-py、reportlab[pycairo]、Img2pdf
- **数学与计算**：sympy、mpmath
- **实用工具**：tqdm、python-dateutil、pytz、joblib、unzip、unrar、7zip、bc、rg (ripgrep)、fd、sqlite

## 容器重用

您可以通过提供来自先前响应的容器 ID，在多个 API 请求中重用现有容器。
这允许您在请求之间维护创建的文件。

### 示例

<CodeGroup>
```python Python
import os
from anthropic import Anthropic

# 初始化客户端
client = Anthropic(
    api_key=os.getenv("ANTHROPIC_API_KEY")
)

# 第一个请求：创建包含随机数的文件
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

# 从第一个响应中提取容器 ID
container_id = response1.container.id

# 第二个请求：重用容器来读取文件
response2 = client.beta.messages.create(
    container=container_id,  # 重用同一容器
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
  // 第一个请求：创建包含随机数的文件
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

  // 从第一个响应中提取容器 ID
  const containerId = response1.container.id;

  // 第二个请求：重用容器来读取文件
  const response2 = await anthropic.beta.messages.create({
    container: containerId,  // 重用同一容器
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
# 第一个请求：创建包含随机数的文件
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

# 从响应中提取容器 ID（使用 jq）
CONTAINER_ID=$(jq -r '.container.id' response1.json)

# 第二个请求：重用容器来读取文件
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

## 流式传输

启用流式传输后，您将在代码执行事件发生时接收它们：

```javascript
event: content_block_start
data: {"type": "content_block_start", "index": 1, "content_block": {"type": "server_tool_use", "id": "srvtoolu_xyz789", "name": "code_execution"}}

// 代码执行流式传输
event: content_block_delta
data: {"type": "content_block_delta", "index": 1, "delta": {"type": "input_json_delta", "partial_json": "{\"code\":\"import pandas as pd\\ndf = pd.read_csv('data.csv')\\nprint(df.head())\"}"}}

// 暂停以执行代码

// 执行结果流式传输
event: content_block_start
data: {"type": "content_block_start", "index": 2, "content_block": {"type": "code_execution_tool_result", "tool_use_id": "srvtoolu_xyz789", "content": {"stdout": "   A  B  C\n0  1  2  3\n1  4  5  6", "stderr": ""}}}
```

## 批量请求

您可以在[消息批处理 API](/docs/zh-CN/build-with-claude/batch-processing) 中包含代码执行工具。通过消息批处理 API 的代码执行工具调用的定价与常规消息 API 请求中的相同。

## 使用和定价

Code execution tool usage is tracked separately from token usage. Execution time has a minimum of 5 minutes.
If files are included in the request, execution time is billed even if the tool is not used due to files being preloaded onto the container.

Each organization receives 50 free hours of usage with the code execution tool per day. Additional usage beyond the first 50 hours is billed at $0.05 per hour, per container.

## 升级到最新工具版本

通过升级到 `code-execution-2025-08-25`，您可以访问文件操作和 Bash 功能，包括多种语言的代码。没有价格差异。

### 变更内容

| 组件 | 旧版 | 当前 |
|-----------|------------------|----------------------------|
| 测试版标头 | `code-execution-2025-05-22` | `code-execution-2025-08-25` |
| 工具类型 | `code_execution_20250522` | `code_execution_20250825` |
| 功能 | 仅 Python | Bash 命令、文件操作 |
| 响应类型 | `code_execution_result` | `bash_code_execution_result`、`text_editor_code_execution_result` |

### 向后兼容性

- 所有现有的 Python 代码执行继续完全按照之前的方式工作
- 现有的仅 Python 工作流无需更改

### 升级步骤

要升级，您需要在 API 请求中进行以下更改：

1. **更新测试版标头**：
   ```diff
   - "anthropic-beta": "code-execution-2025-05-22"
   + "anthropic-beta": "code-execution-2025-08-25"
   ```

2. **更新工具类型**：
   ```diff
   - "type": "code_execution_20250522"
   + "type": "code_execution_20250825"
   ```

3. **审查响应处理**（如果以编程方式解析响应）：
   - 不再发送 Python 执行响应的先前块
   - 相反，将发送 Bash 和文件操作的新响应类型（请参阅响应格式部分）

## 程序化工具调用

代码执行工具支持[程序化工具调用](/docs/zh-CN/agents-and-tools/tool-use/programmatic-tool-calling)，这允许 Claude 编写在执行容器内以编程方式调用您的自定义工具的代码。这支持高效的多工具工作流、在到达 Claude 上下文之前进行数据过滤，以及复杂的条件逻辑。

<CodeGroup>
```python Python
# 为您的工具启用程序化调用
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
            "allowed_callers": ["code_execution_20250825"]  # 启用程序化调用
        }
    ]
)
```
</CodeGroup>

在[程序化工具调用文档](/docs/zh-CN/agents-and-tools/tool-use/programmatic-tool-calling)中了解更多信息。

## 使用代码执行与 Agent Skills

代码执行工具使 Claude 能够使用[Agent Skills](/docs/zh-CN/agents-and-tools/agent-skills/overview)。Skills 是由说明、脚本和资源组成的模块化功能，可扩展 Claude 的功能。

在[Agent Skills 文档](/docs/zh-CN/agents-and-tools/agent-skills/overview)和 [Agent Skills API 指南](/docs/zh-CN/build-with-claude/skills-guide)中了解更多信息。