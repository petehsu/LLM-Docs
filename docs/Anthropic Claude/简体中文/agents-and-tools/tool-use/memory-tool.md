# 记忆工具

记忆工具使Claude能够通过记忆文件目录在对话间存储和检索信息。Claude可以创建、读取、更新和删除在会话间持久化的文件，允许它随着时间的推移构建知识，而无需将所有内容保留在上下文窗口中。

---

记忆工具使Claude能够通过记忆文件目录在对话间存储和检索信息。Claude可以创建、读取、更新和删除在会话间持久化的文件，允许它随着时间的推移构建知识，而无需将所有内容保留在上下文窗口中。

记忆工具在客户端运行——你通过自己的基础设施控制数据的存储位置和方式。

<Note>
记忆工具目前处于测试阶段。要启用它，请在API请求中使用测试版标头`context-management-2025-06-27`。

请通过我们的[反馈表单](https://forms.gle/YXC2EKGMhjN1c4L88)分享你对此功能的反馈。
</Note>

## 用例

- 在多个代理执行间维护项目上下文
- 从过去的交互、决策和反馈中学习
- 随着时间的推移构建知识库
- 启用跨对话学习，其中Claude在重复工作流中改进

## 工作原理

启用后，Claude在开始任务前会自动检查其记忆目录。Claude可以在`/memories`目录中创建、读取、更新和删除文件，以存储其工作时学到的内容，然后在未来的对话中引用这些记忆，以更有效地处理类似任务或从中断处继续。

由于这是一个客户端工具，Claude进行工具调用来执行记忆操作，你的应用程序在本地执行这些操作。这给了你完全控制记忆存储位置和方式的权力。出于安全考虑，你应该将所有记忆操作限制在`/memories`目录内。

### 示例：记忆工具调用如何工作

当你要求Claude帮助完成任务时，Claude会自动首先检查其记忆目录。以下是典型交互的样子：

**1. 用户请求：**
```
"Help me respond to this customer service ticket."
```

**2. Claude检查记忆目录：**
```
"I'll help you respond to the customer service ticket. Let me check my memory for any previous context."
```

Claude调用记忆工具：
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

**3. 你的应用程序返回目录内容：**
```json
{
  "type": "tool_result",
  "tool_use_id": "toolu_01C4D5E6F7G8H9I0J1K2L3M4",
  "content": "Here're the files and directories up to 2 levels deep in /memories, excluding hidden items and node_modules:\n4.0K\t/memories\n1.5K\t/memories/customer_service_guidelines.xml\n2.0K\t/memories/refund_policies.xml"
}
```

**4. Claude读取相关文件：**
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

**5. 你的应用程序返回文件内容：**
```json
{
  "type": "tool_result",
  "tool_use_id": "toolu_01D5E6F7G8H9I0J1K2L3M4N5",
  "content": "Here's the content of /memories/customer_service_guidelines.xml with line numbers:\n     1\t<guidelines>\n     2\t<addressing_customers>\n     3\t- Always address customers by their first name\n     4\t- Use empathetic language\n..."
}
```

**6. Claude使用记忆来帮助：**
```
"Based on your customer service guidelines, I can help you craft a response. Please share the ticket details..."
```

## 支持的模型

记忆工具可用于：

- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)
- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)

## 入门

要使用记忆工具：

1. 在API请求中包含测试版标头`context-management-2025-06-27`
2. 将记忆工具添加到你的请求中
3. 为记忆操作实现客户端处理程序

<Note>
要在你的应用程序中处理记忆工具操作，你需要为每个记忆命令实现处理程序。我们的SDK提供记忆工具助手，处理工具接口——你可以子类化`BetaAbstractMemoryTool`（Python）或使用`betaMemoryTool`（TypeScript）来实现你自己的记忆后端（基于文件、数据库、云存储、加密文件等）。

有关工作示例，请参阅：
- Python：[examples/memory/basic.py](https://github.com/anthropics/anthropic-sdk-python/blob/main/examples/memory/basic.py)
- TypeScript：[examples/tools-helpers-memory.ts](https://github.com/anthropics/anthropic-sdk-typescript/blob/main/examples/tools-helpers-memory.ts)
</Note>

## 基本用法

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

## 工具命令

你的客户端实现需要处理这些记忆工具命令。虽然这些规范描述了Claude最熟悉的推荐行为，但你可以修改你的实现并根据需要返回字符串。

### view
显示目录内容或文件内容，带有可选的行范围：

```json
{
  "command": "view",
  "path": "/memories",
  "view_range": [1, 10]  // 可选：查看特定行
}
```

#### 返回值

**对于目录：** 返回显示文件和目录及其大小的列表：
```
Here're the files and directories up to 2 levels deep in {path}, excluding hidden items and node_modules:
{size}    {path}
{size}    {path}/{filename1}
{size}    {path}/{filename2}
```

- 列出最多2级深的文件
- 显示人类可读的大小（例如`5.5K`、`1.2M`）
- 排除隐藏项（以`.`开头的文件）和`node_modules`
- 在大小和路径之间使用制表符

**对于文件：** 返回带有标头和行号的文件内容：
```
Here's the content of {path} with line numbers:
{line_numbers}{tab}{content}
```

行号格式：
- **宽度**：6个字符，右对齐，用空格填充
- **分隔符**：行号和内容之间的制表符
- **索引**：1索引（第一行是第1行）
- **行限制**：超过999,999行的文件应返回错误：`"File {path} exceeds maximum line limit of 999,999 lines."`

**示例输出：**
```
Here's the content of /memories/notes.txt with line numbers:
     1	Hello World
     2	This is line two
    10	Line ten
   100	Line one hundred
```

#### 错误处理

- **文件/目录不存在**：`"The path {path} does not exist. Please provide a valid path."`

### create
创建新文件：

```json
{
  "command": "create",
  "path": "/memories/notes.txt",
  "file_text": "Meeting notes:\n- Discussed project timeline\n- Next steps defined\n"
}
```

#### 返回值

- **成功**：`"File created successfully at: {path}"`

#### 错误处理

- **文件已存在**：`"Error: File {path} already exists"`

### str_replace
替换文件中的文本：

```json
{
  "command": "str_replace",
  "path": "/memories/preferences.txt",
  "old_str": "Favorite color: blue",
  "new_str": "Favorite color: green"
}
```

#### 返回值

- **成功**：`"The memory file has been edited."`后跟编辑文件的代码片段和行号

#### 错误处理

- **文件不存在**：`"Error: The path {path} does not exist. Please provide a valid path."`
- **文本未找到**：``"No replacement was performed, old_str `{old_str}` did not appear verbatim in {path}."``
- **重复文本**：当`old_str`出现多次时，返回：``"No replacement was performed. Multiple occurrences of old_str `{old_str}` in lines: {line_numbers}. Please ensure it is unique"``

#### 目录处理

如果路径是目录，返回"文件不存在"错误。

### insert
在特定行插入文本：

```json
{
  "command": "insert",
  "path": "/memories/todo.txt",
  "insert_line": 2,
  "insert_text": "- Review memory tool documentation\n"
}
```

#### 返回值

- **成功**：`"The file {path} has been edited."`

#### 错误处理

- **文件不存在**：`"Error: The path {path} does not exist"`
- **无效的行号**：``"Error: Invalid `insert_line` parameter: {insert_line}. It should be within the range of lines of the file: [0, {n_lines}]"``

#### 目录处理

如果路径是目录，返回"文件不存在"错误。

### delete
删除文件或目录：

```json
{
  "command": "delete",
  "path": "/memories/old_file.txt"
}
```

#### 返回值

- **成功**：`"Successfully deleted {path}"`

#### 错误处理

- **文件/目录不存在**：`"Error: The path {path} does not exist"`

#### 目录处理

递归删除目录及其所有内容。

### rename
重命名或移动文件/目录：

```json
{
  "command": "rename",
  "old_path": "/memories/draft.txt",
  "new_path": "/memories/final.txt"
}
```

#### 返回值

- **成功**：`"Successfully renamed {old_path} to {new_path}"`

#### 错误处理

- **源不存在**：`"Error: The path {old_path} does not exist"`
- **目标已存在**：返回错误（不覆盖）：`"Error: The destination {new_path} already exists"`

#### 目录处理

重命名目录。

## 提示指导

当包含记忆工具时，我们会自动将此指令包含到系统提示中：

```
IMPORTANT: ALWAYS VIEW YOUR MEMORY DIRECTORY BEFORE DOING ANYTHING ELSE.
MEMORY PROTOCOL:
1. Use the `view` command of your `memory` tool to check for earlier progress.
2. ... (work on the task) ...
     - As you make progress, record status / progress / thoughts etc in your memory.
ASSUME INTERRUPTION: Your context window might be reset at any moment, so you risk losing any progress that is not recorded in your memory directory.
```

如果你观察到Claude创建混乱的记忆文件，你可以包含此指令：

> 注意：编辑你的记忆文件夹时，始终尝试保持其内容最新、连贯和有组织。你可以重命名或删除不再相关的文件。除非必要，否则不要创建新文件。

你也可以指导Claude写入记忆的内容，例如，"仅在你的记忆系统中写下与\<topic\>相关的信息。"

## 安全考虑

以下是实现记忆存储时的重要安全问题：

### 敏感信息
Claude通常会拒绝在记忆文件中写下敏感信息。但是，你可能想实现更严格的验证，以剥离潜在的敏感信息。

### 文件存储大小
考虑跟踪记忆文件大小并防止文件增长过大。考虑添加记忆读取命令可以返回的最大字符数，并让Claude分页浏览内容。

### 记忆过期
考虑定期清除在较长时间内未被访问的记忆文件。

### 路径遍历保护

<Warning>
恶意路径输入可能会尝试访问`/memories`目录外的文件。你的实现**必须**验证所有路径以防止目录遍历攻击。
</Warning>

考虑这些保护措施：

- 验证所有路径都以`/memories`开头
- 将路径解析为其规范形式，并验证它们保持在记忆目录内
- 拒绝包含`../`、`..\`或其他遍历模式的路径
- 监视URL编码的遍历序列（`%2e%2e%2f`）
- 使用你的语言的内置路径安全实用程序（例如Python的`pathlib.Path.resolve()`和`relative_to()`）

## 错误处理

记忆工具使用类似于[文本编辑器工具](/docs/zh-CN/agents-and-tools/tool-use/text-editor-tool#handle-errors)的错误处理模式。有关详细的错误消息和行为，请参阅上面的各个工具命令部分。常见错误包括文件未找到、权限错误、无效路径和重复文本匹配。

## 与上下文编辑一起使用

记忆工具可以与[上下文编辑](/docs/zh-CN/build-with-claude/context-editing)结合使用，当对话上下文增长超过配置的阈值时，它会自动清除旧的工具结果。这种组合支持长时间运行的代理工作流，否则会超过上下文限制。

### 它们如何协同工作

启用上下文编辑且你的对话接近清除阈值时，Claude会自动收到警告通知。这会提示Claude在这些结果从上下文窗口中清除之前，将工具结果中的任何重要信息保存到记忆文件中。

工具结果被清除后，Claude可以在需要时从记忆文件中检索存储的信息，有效地将记忆视为其工作上下文的扩展。这允许Claude：

- 继续复杂的多步工作流，而不会丢失关键信息
- 即使在工具结果被删除后，也能引用过去的工作和决策
- 在超过典型上下文限制的对话中保持连贯的上下文
- 随着时间的推移构建知识库，同时保持活跃上下文窗口的可管理性

### 示例工作流

考虑一个有许多文件操作的代码重构项目：

1. Claude对文件进行许多编辑，生成许多工具结果
2. 当上下文增长并接近你的阈值时，Claude收到警告
3. Claude将迄今为止所做的更改总结到记忆文件（例如`/memories/refactoring_progress.xml`）
4. 上下文编辑自动清除较旧的工具结果
5. Claude继续工作，在需要回忆已完成的更改时引用记忆文件
6. 工作流可以无限期继续，Claude管理活跃上下文和持久记忆

### 配置

要同时使用两个功能：

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
        # 你的其他工具
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
    // 你的其他工具
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

你也可以排除记忆工具调用被清除，以确保Claude始终可以访问最近的记忆操作：

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