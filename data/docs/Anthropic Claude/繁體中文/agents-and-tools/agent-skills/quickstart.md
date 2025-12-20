# 在 API 中開始使用 Agent Skills

學習如何使用 Agent Skills 在 10 分鐘內使用 Claude API 建立文件。

---

本教學展示如何使用 Agent Skills 建立 PowerPoint 簡報。您將學習如何啟用 Skills、提出簡單請求，以及存取生成的檔案。

## 先決條件

- [Anthropic API 金鑰](/settings/keys)
- 已安裝 Python 3.7+ 或 curl
- 對提出 API 請求有基本的熟悉度

## 什麼是 Agent Skills？

預先建立的 Agent Skills 使用專門的專業知識擴展 Claude 的功能，用於建立文件、分析資料和處理檔案等任務。Anthropic 在 API 中提供以下預先建立的 Agent Skills：

- **PowerPoint (pptx)**：建立和編輯簡報
- **Excel (xlsx)**：建立和分析試算表
- **Word (docx)**：建立和編輯文件
- **PDF (pdf)**：生成 PDF 文件

<Note>
**想要建立自訂 Skills？** 請參閱 [Agent Skills Cookbook](https://github.com/anthropics/claude-cookbooks/tree/main/skills)，以取得使用領域特定專業知識建立您自己的 Skills 的範例。
</Note>

## 步驟 1：列出可用的 Skills

首先，讓我們看看有哪些 Skills 可用。我們將使用 Skills API 列出所有 Anthropic 管理的 Skills：

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# List Anthropic-managed Skills
skills = client.beta.skills.list(
    source="anthropic",
    betas=["skills-2025-10-02"]
)

for skill in skills.data:
    print(f"{skill.id}: {skill.display_title}")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

// List Anthropic-managed Skills
const skills = await client.beta.skills.list({
  source: 'anthropic',
  betas: ['skills-2025-10-02']
});

for (const skill of skills.data) {
  console.log(`${skill.id}: ${skill.display_title}`);
}
```

```bash Shell
curl "https://api.anthropic.com/v1/skills?source=anthropic" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: skills-2025-10-02"
```
</CodeGroup>

您會看到以下 Skills：`pptx`、`xlsx`、`docx` 和 `pdf`。

此 API 會傳回每個 Skill 的中繼資料：其名稱和描述。Claude 在啟動時載入此中繼資料，以了解有哪些 Skills 可用。這是**漸進式揭露**的第一個層級，其中 Claude 發現 Skills 而不會立即載入其完整指示。

## 步驟 2：建立簡報

現在我們將使用 PowerPoint Skill 建立一份關於可再生能源的簡報。我們使用 Messages API 中的 `container` 參數指定 Skills：

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# Create a message with the PowerPoint Skill
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
        "content": "Create a presentation about renewable energy with 5 slides"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)

print(response.content)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

// Create a message with the PowerPoint Skill
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
    content: 'Create a presentation about renewable energy with 5 slides'
  }],
  tools: [{
    type: 'code_execution_20250825',
    name: 'code_execution'
  }]
});

console.log(response.content);
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
      "content": "Create a presentation about renewable energy with 5 slides"
    }],
    "tools": [{
      "type": "code_execution_20250825",
      "name": "code_execution"
    }]
  }'
```
</CodeGroup>

讓我們分解每個部分的作用：

- **`container.skills`**：指定 Claude 可以使用哪些 Skills
- **`type: "anthropic"`**：表示這是 Anthropic 管理的 Skill
- **`skill_id: "pptx"`**：PowerPoint Skill 識別碼
- **`version: "latest"`**：Skill 版本設定為最近發佈的版本
- **`tools`**：啟用程式碼執行（Skills 所需）
- **Beta 標頭**：`code-execution-2025-08-25` 和 `skills-2025-10-02`

當您提出此請求時，Claude 會自動將您的任務與相關的 Skill 進行比對。由於您要求簡報，Claude 判斷 PowerPoint Skill 是相關的，並載入其完整指示：這是漸進式揭露的第二個層級。然後 Claude 執行 Skill 的程式碼來建立您的簡報。

## 步驟 3：下載建立的檔案

簡報是在程式碼執行容器中建立的，並儲存為檔案。回應包含具有檔案 ID 的檔案參考。提取檔案 ID 並使用 Files API 下載它：

<CodeGroup>
```python Python
# Extract file ID from response
file_id = None
for block in response.content:
    if block.type == 'tool_use' and block.name == 'code_execution':
        # File ID is in the tool result
        for result_block in block.content:
            if hasattr(result_block, 'file_id'):
                file_id = result_block.file_id
                break

if file_id:
    # Download the file
    file_content = client.beta.files.download(
        file_id=file_id,
        betas=["files-api-2025-04-14"]
    )

    # Save to disk
    with open("renewable_energy.pptx", "wb") as f:
        file_content.write_to_file(f.name)

    print(f"Presentation saved to renewable_energy.pptx")
```

```typescript TypeScript
// Extract file ID from response
let fileId: string | null = null;
for (const block of response.content) {
  if (block.type === 'tool_use' && block.name === 'code_execution') {
    // File ID is in the tool result
    for (const resultBlock of block.content) {
      if ('file_id' in resultBlock) {
        fileId = resultBlock.file_id;
        break;
      }
    }
  }
}

if (fileId) {
  // Download the file
  const fileContent = await client.beta.files.download(fileId, {
    betas: ['files-api-2025-04-14']
  });

  // Save to disk
  const fs = require('fs');
  fs.writeFileSync('renewable_energy.pptx', Buffer.from(await fileContent.arrayBuffer()));

  console.log('Presentation saved to renewable_energy.pptx');
}
```

```bash Shell
# Extract file_id from response (using jq)
FILE_ID=$(echo "$RESPONSE" | jq -r '.content[] | select(.type=="tool_use" and .name=="code_execution") | .content[] | select(.file_id) | .file_id')

# Download the file
curl "https://api.anthropic.com/v1/files/$FILE_ID/content" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  --output renewable_energy.pptx

echo "Presentation saved to renewable_energy.pptx"
```
</CodeGroup>

<Note>
如需有關使用生成檔案的完整詳細資訊，請參閱[程式碼執行工具文件](/docs/zh-TW/agents-and-tools/tool-use/code-execution-tool#retrieve-generated-files)。
</Note>

## 嘗試更多範例

現在您已使用 Skills 建立了第一份文件，請嘗試這些變化：

### 建立試算表

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
            }
        ]
    },
    messages=[{
        "role": "user",
        "content": "Create a quarterly sales tracking spreadsheet with sample data"
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
      }
    ]
  },
  messages: [{
    role: 'user',
    content: 'Create a quarterly sales tracking spreadsheet with sample data'
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
        }
      ]
    },
    "messages": [{
      "role": "user",
      "content": "Create a quarterly sales tracking spreadsheet with sample data"
    }],
    "tools": [{
      "type": "code_execution_20250825",
      "name": "code_execution"
    }]
  }'
```
</CodeGroup>

### 建立 Word 文件

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
                "skill_id": "docx",
                "version": "latest"
            }
        ]
    },
    messages=[{
        "role": "user",
        "content": "Write a 2-page report on the benefits of renewable energy"
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
        skill_id: 'docx',
        version: 'latest'
      }
    ]
  },
  messages: [{
    role: 'user',
    content: 'Write a 2-page report on the benefits of renewable energy'
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
          "skill_id": "docx",
          "version": "latest"
        }
      ]
    },
    "messages": [{
      "role": "user",
      "content": "Write a 2-page report on the benefits of renewable energy"
    }],
    "tools": [{
      "type": "code_execution_20250825",
      "name": "code_execution"
    }]
  }'
```
</CodeGroup>

### 生成 PDF

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
                "skill_id": "pdf",
                "version": "latest"
            }
        ]
    },
    messages=[{
        "role": "user",
        "content": "Generate a PDF invoice template"
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
        skill_id: 'pdf',
        version: 'latest'
      }
    ]
  },
  messages: [{
    role: 'user',
    content: 'Generate a PDF invoice template'
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
          "skill_id": "pdf",
          "version": "latest"
        }
      ]
    },
    "messages": [{
      "role": "user",
      "content": "Generate a PDF invoice template"
    }],
    "tools": [{
      "type": "code_execution_20250825",
      "name": "code_execution"
    }]
  }'
```
</CodeGroup>

## 後續步驟

現在您已使用預先建立的 Agent Skills，您可以：

<CardGroup cols={2}>
  <Card
    title="API 指南"
    icon="book"
    href="/docs/zh-TW/build-with-claude/skills-guide"
  >
    使用 Claude API 搭配 Skills
  </Card>
  <Card
    title="建立自訂 Skills"
    icon="code"
    href="/docs/zh-TW/api/skills/create-skill"
  >
    上傳您自己的 Skills 以執行專門任務
  </Card>
  <Card
    title="撰寫指南"
    icon="edit"
    href="/docs/zh-TW/agents-and-tools/agent-skills/best-practices"
  >
    學習撰寫有效 Skills 的最佳實踐
  </Card>
  <Card
    title="在 Claude Code 中使用 Skills"
    icon="terminal"
    href="https://code.claude.com/docs/skills"
  >
    了解 Claude Code 中的 Skills
  </Card>
  <Card
    title="在 Agent SDK 中使用 Skills"
    icon="cube"
    href="/docs/zh-TW/agent-sdk/skills"
  >
    在 TypeScript 和 Python 中以程式設計方式使用 Skills
  </Card>
  <Card
    title="Agent Skills Cookbook"
    icon="book"
    href="https://github.com/anthropics/anthropic-cookbook/blob/main/skills/README.md"
  >
    探索範例 Skills 和實作模式
  </Card>
</CardGroup>