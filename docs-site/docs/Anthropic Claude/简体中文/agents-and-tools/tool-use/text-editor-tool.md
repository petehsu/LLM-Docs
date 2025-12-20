# 文本编辑器工具

Claude 可以使用 Anthropic 定义的文本编辑器工具来查看和修改文本文件，帮助您调试、修复和改进代码或其他文本文档。

---

Claude 可以使用 Anthropic 定义的文本编辑器工具来查看和修改文本文件，帮助您调试、修复和改进代码或其他文本文档。这使 Claude 能够直接与您的文件交互，提供实际操作协助，而不仅仅是建议更改。

## 模型兼容性

| 模型 | 工具版本 |
|-------|--------------|
| Claude 4.x 模型 | `text_editor_20250728` |
| Claude Sonnet 3.7 ([已弃用](/docs/zh-CN/about-claude/model-deprecations)) | `text_editor_20250124` |

<Warning>
Claude 4 模型的 `text_editor_20250728` 工具不包括 `undo_edit` 命令。如果您需要此功能，您需要使用 Claude Sonnet 3.7 ([已弃用](/docs/zh-CN/about-claude/model-deprecations))。
</Warning>

<Warning>
较旧的工具版本不保证与较新的模型向后兼容。始终使用与您的模型版本相对应的工具版本。
</Warning>

## 何时使用文本编辑器工具

以下是一些使用文本编辑器工具的示例：
- **代码调试**：让 Claude 识别并修复代码中的错误，从语法错误到逻辑问题。
- **代码重构**：让 Claude 通过有针对性的编辑来改进代码结构、可读性和性能。
- **文档生成**：要求 Claude 为您的代码库添加文档字符串、注释或 README 文件。
- **测试创建**：让 Claude 根据其对实现的理解为您的代码创建单元测试。

## 使用文本编辑器工具

<Tabs>
<Tab title="Claude 4">
使用 Messages API 向 Claude 提供文本编辑器工具（名为 `str_replace_based_edit_tool`）。

您可以选择指定 `max_characters` 参数来控制查看大文件时的截断。

<Note>
`max_characters` 仅与 `text_editor_20250728` 及更新版本的文本编辑器工具兼容。
</Note>

<CodeGroup>

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
        "type": "text_editor_20250728",
        "name": "str_replace_based_edit_tool",
        "max_characters": 10000
      }
    ],
    "messages": [
      {
        "role": "user",
        "content": "There'\''s a syntax error in my primes.py file. Can you help me fix it?"
      }
    ]
  }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[
        {
            "type": "text_editor_20250728",
            "name": "str_replace_based_edit_tool",
            "max_characters": 10000
        }
    ],
    messages=[
        {
            "role": "user", 
            "content": "There's a syntax error in my primes.py file. Can you help me fix it?"
        }
    ]
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const response = await anthropic.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: [
    {
      type: "text_editor_20250728",
      name: "str_replace_based_edit_tool",
      max_characters: 10000
    }
  ],
  messages: [
    {
      role: "user",
      content: "There's a syntax error in my primes.py file. Can you help me fix it?"
    }
  ]
});
```

```java Java
import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.ToolStrReplaceBasedEditTool20250728;

public class TextEditorToolExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        ToolStrReplaceBasedEditTool20250728 editorTool = ToolStrReplaceBasedEditTool20250728.builder()
                .build();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_SONNET_4_0)
                .maxTokens(1024)
                .addTool(editorTool)
                .addUserMessage("There's a syntax error in my primes.py file. Can you help me fix it?")
                .build();

        Message message = client.messages().create(params);
    }
}
```
</CodeGroup>
</Tab>
<Tab title="Claude Sonnet 3.7">
使用 Messages API 向 Claude 提供文本编辑器工具（名为 `str_replace_editor`）：
<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-3-7-sonnet-20250219",
    "max_tokens": 1024,
    "tools": [
      {
        "type": "text_editor_20250124",
        "name": "str_replace_editor"
      }
    ],
    "messages": [
      {
        "role": "user",
        "content": "There'\''s a syntax error in my primes.py file. Can you help me fix it?"
      }
    ]
  }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-3-7-sonnet-20250219",
    max_tokens=1024,
    tools=[
        {
            "type": "text_editor_20250124",
            "name": "str_replace_editor"
        }
    ],
    messages=[
        {
            "role": "user", 
            "content": "There's a syntax error in my primes.py file. Can you help me fix it?"
        }
    ]
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const response = await anthropic.messages.create({
  model: "claude-3-7-sonnet-20250219",
  max_tokens: 1024,
  tools: [
    {
      type: "text_editor_20250124",
      name: "str_replace_editor"
    }
  ],
  messages: [
    {
      role: "user",
      content: "There's a syntax error in my primes.py file. Can you help me fix it?"
    }
  ]
});
```

```java Java
import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.ToolTextEditor20250124;

public class TextEditorToolExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        ToolTextEditor20250124 editorTool = ToolTextEditor20250124.builder()
                .build();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_3_7_SONNET_LATEST)
                .maxTokens(1024)
                .addTool(editorTool)
                .addUserMessage("There's a syntax error in my primes.py file. Can you help me fix it?")
                .build();

        Message message = client.messages().create(params);
    }
}
```
</CodeGroup>
</Tab>
</Tabs>

文本编辑器工具可以按以下方式使用：

<Steps>
  <Step title="向 Claude 提供文本编辑器工具和用户提示">
    - 在您的 API 请求中包含文本编辑器工具
    - 提供可能需要检查或修改文件的用户提示，例如"您能修复我代码中的语法错误吗？"
  </Step>
  <Step title="Claude 使用该工具检查文件或目录">
    - Claude 评估需要查看的内容，并使用 `view` 命令检查文件内容或列出目录内容
    - API 响应将包含带有 `view` 命令的 `tool_use` 内容块
  </Step>
  <Step title="执行 view 命令并返回结果">
    - 从 Claude 的工具使用请求中提取文件或目录路径
    - 读取文件的内容或列出目录内容
    - 如果在工具配置中指定了 `max_characters` 参数，将文件内容截断到该长度
    - 通过继续对话并返回包含 `tool_result` 内容块的新 `user` 消息将结果返回给 Claude
  </Step>
  <Step title="Claude 使用该工具修改文件">
    - 检查文件或目录后，Claude 可能会使用 `str_replace` 等命令进行更改，或使用 `insert` 在特定行号处添加文本。
    - 如果 Claude 使用 `str_replace` 命令，Claude 会构造一个格式正确的工具使用请求，其中包含旧文本和要替换它的新文本
  </Step>
  <Step title="执行编辑并返回结果">
    - 从 Claude 的工具使用请求中提取文件路径、旧文本和新文本
    - 在文件中执行文本替换
    - 将结果返回给 Claude
  </Step>
  <Step title="Claude 提供其分析和解释">
    - 检查并可能编辑文件后，Claude 提供了它发现的内容和所做更改的完整解释
  </Step>
</Steps>

### 文本编辑器工具命令

文本编辑器工具支持多个用于查看和修改文件的命令：

#### view

`view` 命令允许 Claude 检查文件的内容或列出目录的内容。它可以读取整个文件或特定范围的行。

参数：
- `command`：必须为 "view"
- `path`：要查看的文件或目录的路径
- `view_range`（可选）：一个包含两个整数的数组，指定要查看的开始和结束行号。行号从 1 开始，结束行为 -1 表示读到文件末尾。此参数仅在查看文件时适用，不适用于目录。

<section title="view 命令示例">

```json
// 查看文件的示例
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "str_replace_editor",
  "input": {
    "command": "view",
    "path": "primes.py"
  }
}

// 查看目录的示例
{
  "type": "tool_use",
  "id": "toolu_02B19r91rw91mr917835mr9",
  "name": "str_replace_editor",
  "input": {
    "command": "view",
    "path": "src/"
  }
}
```

</section>

#### str_replace

`str_replace` 命令允许 Claude 用新字符串替换文件中的特定字符串。这用于进行精确编辑。

参数：
- `command`：必须为 "str_replace"
- `path`：要修改的文件的路径
- `old_str`：要替换的文本（必须完全匹配，包括空格和缩进）
- `new_str`：要插入以替换旧文本的新文本

<section title="str_replace 命令示例">

```json
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "str_replace_editor",
  "input": {
    "command": "str_replace",
    "path": "primes.py",
    "old_str": "for num in range(2, limit + 1)",
    "new_str": "for num in range(2, limit + 1):"
  }
}
```

</section>

#### create

`create` 命令允许 Claude 创建具有指定内容的新文件。

参数：
- `command`：必须为 "create"
- `path`：应创建新文件的路径
- `file_text`：要写入新文件的内容

<section title="create 命令示例">

```json
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "str_replace_editor",
  "input": {
    "command": "create",
    "path": "test_primes.py",
    "file_text": "import unittest\nimport primes\n\nclass TestPrimes(unittest.TestCase):\n    def test_is_prime(self):\n        self.assertTrue(primes.is_prime(2))\n        self.assertTrue(primes.is_prime(3))\n        self.assertFalse(primes.is_prime(4))\n\nif __name__ == '__main__':\n    unittest.main()"
  }
}
```

</section>

#### insert

`insert` 命令允许 Claude 在文件中的特定位置插入文本。

参数：
- `command`：必须为 "insert"
- `path`：要修改的文件的路径
- `insert_line`：要在其后插入文本的行号（0 表示文件开头）
- `new_str`：要插入的文本

<section title="insert 命令示例">

```json
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "str_replace_editor",
  "input": {
    "command": "insert",
    "path": "primes.py",
    "insert_line": 0,
    "new_str": "\"\"\"Module for working with prime numbers.\n\nThis module provides functions to check if a number is prime\nand to generate a list of prime numbers up to a given limit.\n\"\"\"\n"
  }
}
```

</section>

#### undo_edit

`undo_edit` 命令允许 Claude 撤销对文件所做的最后一次编辑。

<Note>
此命令仅在 Claude Sonnet 3.7 ([已弃用](/docs/zh-CN/about-claude/model-deprecations)) 中可用。Claude 4 模型使用 `text_editor_20250728` 不支持此命令。
</Note>

参数：
- `command`：必须为 "undo_edit"
- `path`：应撤销其最后一次编辑的文件的路径

<section title="undo_edit 命令示例">

```json
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "str_replace_editor",
  "input": {
    "command": "undo_edit",
    "path": "primes.py"
  }
}
```

</section>

### 示例：使用文本编辑器工具修复语法错误

<Tabs>
<Tab title="Claude 4">

此示例演示了 Claude 4 模型如何使用文本编辑器工具修复 Python 文件中的语法错误。

首先，您的应用程序向 Claude 提供文本编辑器工具和修复语法错误的提示：

<CodeGroup>
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
        "type": "text_editor_20250728",
        "name": "str_replace_based_edit_tool"
      }
    ],
    "messages": [
      {
        "role": "user",
        "content": "There'\''s a syntax error in my primes.py file. Can you help me fix it?"
      }
    ]
  }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[
        {
            "type": "text_editor_20250728",
            "name": "str_replace_based_edit_tool"
        }
    ],
    messages=[
        {
            "role": "user", 
            "content": "There's a syntax error in my primes.py file. Can you help me fix it?"
        }
    ]
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const response = await anthropic.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: [
    {
      type: "text_editor_20250728",
      name: "str_replace_based_edit_tool"
    }
  ],
  messages: [
    {
      role: "user",
      content: "There's a syntax error in my primes.py file. Can you help me fix it?"
    }
  ]
});
```

```java Java
import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.ToolStrReplaceBasedEditTool20250728;

public class TextEditorToolExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        ToolStrReplaceBasedEditTool20250728 editorTool = ToolStrReplaceBasedEditTool20250728.builder()
                .build();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_SONNET_4_0)
                .maxTokens(1024)
                .addTool(editorTool)
                .addUserMessage("There's a syntax error in my primes.py file. Can you help me fix it?")
                .build();

        Message message = client.messages().create(params);
    }
}
```
</CodeGroup>

Claude 将首先使用文本编辑器工具查看文件：

```json
{
  "id": "msg_01XAbCDeFgHiJkLmNoPQrStU",
  "model": "claude-sonnet-4-5",
  "stop_reason": "tool_use",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "I'll help you fix the syntax error in your primes.py file. First, let me take a look at the file to identify the issue."
    },
    {
      "type": "tool_use",
      "id": "toolu_01AbCdEfGhIjKlMnOpQrStU",
      "name": "str_replace_based_edit_tool",
      "input": {
        "command": "view",
        "path": "primes.py"
      }
    }
  ]
}
```

您的应用程序应该读取文件并将其内容返回给 Claude：

<CodeGroup>
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
        "type": "text_editor_20250728",
        "name": "str_replace_based_edit_tool"
      }
    ],
    "messages": [
      {
        "role": "user",
        "content": "There'\''s a syntax error in my primes.py file. Can you help me fix it?"
      },
      {
            "role": "assistant",
            "content": [
                {
                    "type": "text",
                    "text": "I'\''ll help you fix the syntax error in your primes.py file. First, let me take a look at the file to identify the issue."
                },
                {
                    "type": "tool_use",
                    "id": "toolu_01AbCdEfGhIjKlMnOpQrStU",
                    "name": "str_replace_based_edit_tool",
                    "input": {
                        "command": "view",
                        "path": "primes.py"
                    }
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "tool_result",
                    "tool_use_id": "toolu_01AbCdEfGhIjKlMnOpQrStU",
                    "content": "1: def is_prime(n):\n2:     \"\"\"Check if a number is prime.\"\"\"\n3:     if n <= 1:\n4:         return False\n5:     if n <= 3:\n6:         return True\n7:     if n % 2 == 0 or n % 3 == 0:\n8:         return False\n9:     i = 5\n10:     while i * i <= n:\n11:         if n % i == 0 or n % (i + 2) == 0:\n12:             return False\n13:         i += 6\n14:     return True\n15: \n16: def get_primes(limit):\n17:     \"\"\"Generate a list of prime numbers up to the given limit.\"\"\"\n18:     primes = []\n19:     for num in range(2, limit + 1)\n20:         if is_prime(num):\n21:             primes.append(num)\n22:     return primes\n23: \n24: def main():\n25:     \"\"\"Main function to demonstrate prime number generation.\"\"\"\n26:     limit = 100\n27:     prime_list = get_primes(limit)\n28:     print(f\"Prime numbers up to {limit}:\")\n29:     print(prime_list)\n30:     print(f\"Found {len(prime_list)} prime numbers.\")\n31: \n32: if __name__ == \"__main__\":\n33:     main()"
                }
            ]
        }
    ]
  }'
```

```python Python
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[
        {
            "type": "text_editor_20250728",
            "name": "str_replace_based_edit_tool"
        }
    ],
    messages=[
        {
            "role": "user", 
            "content": "There's a syntax error in my primes.py file. Can you help me fix it?"
        },
        {
            "role": "assistant",
            "content": [
                {
                    "type": "text",
                    "text": "I'll help you fix the syntax error in your primes.py file. First, let me take a look at the file to identify the issue."
                },
                {
                    "type": "tool_use",
                    "id": "toolu_01AbCdEfGhIjKlMnOpQrStU",
                    "name": "str_replace_based_edit_tool",
                    "input": {
                        "command": "view",
                        "path": "primes.py"
                    }
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "tool_result",
                    "tool_use_id": "toolu_01AbCdEfGhIjKlMnOpQrStU",
                    "content": "1: def is_prime(n):\n2:     \"\"\"Check if a number is prime.\"\"\"\n3:     if n <= 1:\n4:         return False\n5:     if n <= 3:\n6:         return True\n7:     if n % 2 == 0 or n % 3 == 0:\n8:         return False\n9:     i = 5\n10:     while i * i <= n:\n11:         if n % i == 0 or n % (i + 2) == 0:\n12:             return False\n13:         i += 6\n14:     return True\n15: \n16: def get_primes(limit):\n17:     \"\"\"Generate a list of prime numbers up to the given limit.\"\"\"\n18:     primes = []\n19:     for num in range(2, limit + 1)\n20:         if is_prime(num):\n21:             primes.append(num)\n22:     return primes\n23: \n24: def main():\n25:     \"\"\"Main function to demonstrate prime number generation.\"\"\"\n26:     limit = 100\n27:     prime_list = get_primes(limit)\n28:     print(f\"Prime numbers up to {limit}:\")\n29:     print(prime_list)\n30:     print(f\"Found {len(prime_list)} prime numbers.\")\n31: \n32: if __name__ == \"__main__\":\n33:     main()"
                }
            ]
        }
    ]
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const response = await anthropic.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: [
    {
      type: "text_editor_20250728",
      name: "str_replace_based_edit_tool"
    }
  ],
  messages: [
    {
      role: "user",
      content: "There's a syntax error in my primes.py file. Can you help me fix it?"
    },
    {
      role: "assistant",
      content: [
          {
              type: "text",
              text: "I'll help you fix the syntax error in your primes.py file. First, let me take a look at the file to identify the issue."
          },
          {
              type: "tool_use",
              id: "toolu_01AbCdEfGhIjKlMnOpQrStU",
              name: "str_replace_based_edit_tool",
              input: {
                  command: "view",
                  path: "primes.py"
              }
          }
      ]
    },
    {
      role: "user",
      content: [
          {
              type: "tool_result",
              tool_use_id: "toolu_01AbCdEfGhIjKlMnOpQrStU",
              content: "1: def is_prime(n):\n2:     \"\"\"Check if a number is prime.\"\"\"\n3:     if n <= 1:\n4:         return False\n5:     if n <= 3:\n6:         return True\n7:     if n % 2 == 0 or n % 3 == 0:\n8:         return False\n9:     i = 5\n10:     while i * i <= n:\n11:         if n % i == 0 or n % (i + 2) == 0:\n12:             return False\n13:         i += 6\n14:     return True\n15: \n16: def get_primes(limit):\n17:     \"\"\"Generate a list of prime numbers up to the given limit.\"\"\"\n18:     primes = []\n19:     for num in range(2, limit + 1)\n20:         if is_prime(num):\n21:             primes.append(num)\n22:     return primes\n23: \n24: def main():\n25:     \"\"\"Main function to demonstrate prime number generation.\"\"\"\n26:     limit = 100\n27:     prime_list = get_primes(limit)\n28:     print(f\"Prime numbers up to {limit}:\")\n29:     print(prime_list)\n30:     print(f\"Found {len(prime_list)} prime numbers.\")\n31: \n32: if __name__ == \"__main__\":\n33:     main()"
          }
      ]
    }
  ]
});
```

```java Java
import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.ToolStrReplaceBasedEditTool20250728;

public class TextEditorToolExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        ToolStrReplaceBasedEditTool20250728 editorTool = ToolStrReplaceBasedEditTool20250728.builder()
            .build();

        MessageCreateParams params = MessageCreateParams.builder()
            .model(Model.CLAUDE_SONNET_4_0)
            .maxTokens(1024)
            .addTool(editorTool)
            .addUserMessage("There's a syntax error in my primes.py file. Can you help me fix it?")
            .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>

<Tip>
**行号**

在上面的示例中，`view` 工具结果包含文件内容，每行前面都有行号（例如，"1: def is_prime(n):"）。行号不是必需的，但对于成功使用 `view_range` 参数检查文件的特定部分和 `insert_line` 参数在精确位置添加内容至关重要。
</Tip>

Claude 将识别语法错误并使用 `str_replace` 命令修复它：

```json
{
  "id": "msg_01VwXyZAbCdEfGhIjKlMnO",
  "model": "claude-sonnet-4-5",
  "stop_reason": "tool_use",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "I found the syntax error in your primes.py file. In the `get_primes` function, there is a missing colon (:) at the end of the for loop line. Let me fix that for you."
    },
    {
      "type": "tool_use",
      "id": "toolu_01PqRsTuVwXyZAbCdEfGh",
      "name": "str_replace_based_edit_tool",
      "input": {
        "command": "str_replace",
        "path": "primes.py",
        "old_str": "    for num in range(2, limit + 1)",
        "new_str": "    for num in range(2, limit + 1):"
      }
    }
  ]
}
```

您的应用程序应该进行编辑并返回结果：

<CodeGroup>
```python Python
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[
        {
            "type": "text_editor_20250728",
            "name": "str_replace_based_edit_tool"
        }
    ],
    messages=[
        # Previous messages...
        {
            "role": "assistant",
            "content": [
                {
                    "type": "text",
                    "text": "I found the syntax error in your primes.py file. In the `get_primes` function, there is a missing colon (:) at the end of the for loop line. Let me fix that for you."
                },
                {
                    "type": "tool_use",
                    "id": "toolu_01PqRsTuVwXyZAbCdEfGh",
                    "name": "str_replace_based_edit_tool",
                    "input": {
                        "command": "str_replace",
                        "path": "primes.py",
                        "old_str": "    for num in range(2, limit + 1)",
                        "new_str": "    for num in range(2, limit + 1):"
                    }
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "tool_result",
                    "tool_use_id": "toolu_01PqRsTuVwXyZAbCdEfGh",
                    "content": "Successfully replaced text at exactly one location."
                }
            ]
        }
    ]
)
```

```typescript TypeScript
const response = await anthropic.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: [
    {
      type: "text_editor_20250728",
      name: "str_replace_based_edit_tool"
    }
  ],
  messages: [
    // Previous messages...
    {
      role: "assistant",
      content: [
        {
          type: "text",
          text: "I found the syntax error in your primes.py file. In the `get_primes` function, there is a missing colon (:) at the end of the for loop line. Let me fix that for you."
        },
        {
          type: "tool_use",
          id: "toolu_01PqRsTuVwXyZAbCdEfGh",
          name: "str_replace_based_edit_tool",
          input: {
            command: "str_replace",
            path: "primes.py",
            old_str: "    for num in range(2, limit + 1)",
            new_str: "    for num in range(2, limit + 1):"
          }
        }
      ]
    },
    {
      role: "user",
      content: [
        {
          type: "tool_result",
          tool_use_id: "toolu_01PqRsTuVwXyZAbCdEfGh",
          content: "Successfully replaced text at exactly one location."
        }
      ]
    }
  ]
});
```

```java Java
import java.util.List;
import java.util.Map;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.JsonValue;
import com.anthropic.models.messages.ContentBlockParam;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.MessageParam;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;
import com.anthropic.models.messages.ToolResultBlockParam;
import com.anthropic.models.messages.ToolStrReplaceBasedEditTool20250728;
import com.anthropic.models.messages.ToolUseBlockParam;

public class TextEditorConversationExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_SONNET_4_0)
                .maxTokens(1024)
                .addTool(ToolStrReplaceBasedEditTool20250728.builder()
                        .build())
                // Previous messages would go here
                .addAssistantMessageOfBlockParams(
                        List.of(
                                ContentBlockParam.ofText(TextBlockParam.builder()
                                        .text("I found the syntax error in your primes.py file. In the `get_primes` function, there is a missing colon (:) at the end of the for loop line. Let me fix that for you.")
                                        .build()),
                                ContentBlockParam.ofToolUse(ToolUseBlockParam.builder()
                                        .id("toolu_01PqRsTuVwXyZAbCdEfGh")
                                        .name("str_replace_based_edit_tool")
                                        .input(JsonValue.from(Map.of(
                                                "command", "str_replace",
                                                "path", "primes.py",
                                                "old_str", "    for num in range(2, limit + 1)",
                                                "new_str", "    for num in range(2, limit + 1):"
                                        )))
                                        .build()
                                )
                        )
                )
                .addUserMessageOfBlockParams(List.of(
                        ContentBlockParam.ofToolResult(ToolResultBlockParam.builder()
                                .toolUseId("toolu_01PqRsTuVwXyZAbCdEfGh")
                                .content("Successfully replaced text at exactly one location.")
                                .build()
                        )
                ))
                .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>

最后，Claude 将提供修复的完整解释：

```json
{
  "id": "msg_01IjKlMnOpQrStUvWxYzAb",
  "model": "claude-sonnet-4-5",
  "stop_reason": "end_turn",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "I've fixed the syntax error in your primes.py file. The issue was in the `get_primes` function at line 19. There was a missing colon (:) at the end of the for loop line.\n\nHere's what I changed:\n\nFrom:\n```python\nfor num in range(2, limit + 1)\n```\n\nTo:\n```python\nfor num in range(2, limit + 1):\n```\n\nIn Python, a colon is required at the end of statements that start a new code block, such as for loops, if statements, function definitions, etc. Without the colon, Python raises a syntax error because it doesn't know where the code block begins.\n\nYour code should now run correctly. The function will properly generate a list of prime numbers up to the specified limit."
    }
  ]
}
```
</Tab>

<Tab title="Claude Sonnet 3.7">
此示例演示了 Claude Sonnet 3.7 如何使用文本编辑器工具修复 Python 文件中的语法错误。

首先，您的应用程序向 Claude 提供文本编辑器工具和修复语法错误的提示：

```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-3-7-sonnet-20250219",
    max_tokens=1024,
    tools=[
        {
            "type": "text_editor_20250124",
            "name": "str_replace_editor"
        }
    ],
    messages=[
        {
            "role": "user", 
            "content": "There's a syntax error in my primes.py file. Can you help me fix it?"
        }
    ]
)

print(response)
```

<Note>
Claude Sonnet 3.7 示例遵循与上面 Claude 4 示例相同的格式，使用相同的工具调用和响应，但使用 `text_editor_20250124` 工具类型和 `str_replace_editor` 名称。
</Note>
</Tab>
</Tabs>

***

## 实现文本编辑器工具

文本编辑器工具作为无模式工具实现。使用此工具时，您无需像其他工具那样提供输入模式；该模式内置于Claude的模型中，无法修改。

工具类型取决于模型版本：
- **Claude 4**: `type: "text_editor_20250728"`
- **Claude Sonnet 3.7**: `type: "text_editor_20250124"`

<Steps>
  <Step title="初始化您的编辑器实现">
    创建辅助函数来处理文件操作，如读取、写入和修改文件。考虑实现备份功能以从错误中恢复。
  </Step>
  <Step title="处理编辑器工具调用">
    创建一个函数来处理来自Claude的工具调用，基于命令类型：
    ```python
    def handle_editor_tool(tool_call, model_version):
        input_params = tool_call.input
        command = input_params.get('command', '')
        file_path = input_params.get('path', '')
        
        if command == 'view':
            # Read and return file contents
            pass
        elif command == 'str_replace':
            # Replace text in file
            pass
        elif command == 'create':
            # Create new file
            pass
        elif command == 'insert':
            # Insert text at location
            pass
        elif command == 'undo_edit':
            # Check if it's a Claude 4 model
            if 'str_replace_based_edit_tool' in model_version:
                return {"error": "undo_edit command is not supported in Claude 4"}
            # Restore from backup for Claude 3.7
            pass
    ```
  </Step>
  <Step title="实现安全措施">
    添加验证和安全检查：
    - 验证文件路径以防止目录遍历
    - 在进行更改前创建备份
    - 优雅地处理错误
    - 实现权限检查
  </Step>
  <Step title="处理Claude的响应">
    从Claude的响应中提取和处理工具调用：
    ```python
    # Process tool use in Claude's response
    for content in response.content:
        if content.type == "tool_use":
            # Execute the tool based on command
            result = handle_editor_tool(content)
            
            # Return result to Claude
            tool_result = {
                "type": "tool_result",
                "tool_use_id": content.id,
                "content": result
            }
    ```
  </Step>
</Steps>

<Warning>
实现文本编辑器工具时，请记住：

1. **安全性**：该工具可以访问您的本地文件系统，因此请实现适当的安全措施。
2. **备份**：在允许编辑重要文件之前，始终创建备份。
3. **验证**：验证所有输入以防止意外更改。
4. **唯一匹配**：确保替换恰好匹配一个位置，以避免意外编辑。
</Warning>

### 处理错误

使用文本编辑器工具时，可能会出现各种错误。以下是如何处理它们的指导：

<section title="文件未找到">

如果Claude尝试查看或修改不存在的文件，请在`tool_result`中返回适当的错误消息：

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Error: File not found",
      "is_error": true
    }
  ]
}
```

</section>

<section title="替换有多个匹配项">

如果Claude的`str_replace`命令在文件中匹配多个位置，请返回适当的错误消息：

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Error: Found 3 matches for replacement text. Please provide more context to make a unique match.",
      "is_error": true
    }
  ]
}
```

</section>

<section title="替换没有匹配项">

如果Claude的`str_replace`命令与文件中的任何文本都不匹配，请返回适当的错误消息：

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Error: No match found for replacement. Please check your text and try again.",
      "is_error": true
    }
  ]
}
```

</section>

<section title="权限错误">

如果在创建、读取或修改文件时存在权限问题，请返回适当的错误消息：

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Error: Permission denied. Cannot write to file.",
      "is_error": true
    }
  ]
}
```

</section>

### 遵循实现最佳实践

<section title="提供清晰的上下文">

当要求Claude修复或修改代码时，请具体说明需要检查哪些文件或需要解决哪些问题。清晰的上下文有助于Claude识别正确的文件并进行适当的更改。

**不太有用的提示**："你能修复我的代码吗？"

**更好的提示**："我的primes.py文件中有语法错误，导致它无法运行。你能修复它吗？"

</section>

<section title="明确指定文件路径">

在需要时清楚地指定文件路径，特别是如果您使用多个文件或不同目录中的文件。

**不太有用的提示**："查看我的辅助文件"

**更好的提示**："你能检查我的utils/helpers.py文件是否有任何性能问题吗？"

</section>

<section title="编辑前创建备份">

在您的应用程序中实现备份系统，在允许Claude编辑文件之前创建文件副本，特别是对于重要或生产代码。

```python
def backup_file(file_path):
    """Create a backup of a file before editing."""
    backup_path = f"{file_path}.backup"
    if os.path.exists(file_path):
        with open(file_path, 'r') as src, open(backup_path, 'w') as dst:
            dst.write(src.read())
```

</section>

<section title="谨慎处理唯一文本替换">

`str_replace`命令需要要替换的文本完全匹配。您的应用程序应确保旧文本恰好有一个匹配项，或提供适当的错误消息。
```python
def safe_replace(file_path, old_text, new_text):
    """Replace text only if there's exactly one match."""
    with open(file_path, 'r') as f:
        content = f.read()
    
    count = content.count(old_text)
    if count == 0:
        return "Error: No match found"
    elif count > 1:
        return f"Error: Found {count} matches"
    else:
        new_content = content.replace(old_text, new_text)
        with open(file_path, 'w') as f:
            f.write(new_content)
        return "Successfully replaced text"
```

</section>

<section title="验证更改">

Claude对文件进行更改后，通过运行测试或检查代码是否仍按预期工作来验证更改。
```python
def verify_changes(file_path):
    """Run tests or checks after making changes."""
    try:
        # For Python files, check for syntax errors
        if file_path.endswith('.py'):
            import ast
            with open(file_path, 'r') as f:
                ast.parse(f.read())
            return "Syntax check passed"
    except Exception as e:
        return f"Verification failed: {str(e)}"
```

</section>

---

## 定价和令牌使用

The text editor tool uses the same pricing structure as other tools used with Claude. It follows the standard input and output token pricing based on the Claude model you're using.

In addition to the base tokens, the following additional input tokens are needed for the text editor tool:

| Tool | Additional input tokens |
| ----------------------------------------- | --------------------------------------- |
| `text_editor_20250429` (Claude 4.x) | 700 tokens |
| `text_editor_20250124` (Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations))) | 700 tokens |

有关工具定价的更多详细信息，请参阅[工具使用定价](/docs/zh-CN/agents-and-tools/tool-use/overview#pricing)。

## 将文本编辑器工具与其他工具集成

文本编辑器工具可以与其他Claude工具一起使用。组合工具时，请确保：
- 将工具版本与您使用的模型相匹配
- 考虑请求中包含的所有工具的额外令牌使用

## 更改日志

| 日期 | 版本 | 更改 |
| ---- | ------- | ------- |
| 2025年7月28日 | `text_editor_20250728` | 发布更新的文本编辑器工具，修复了一些问题并添加了可选的`max_characters`参数。除此之外，它与`text_editor_20250429`相同。 |
| 2025年4月29日 | `text_editor_20250429` | 发布Claude 4的文本编辑器工具。此版本删除了`undo_edit`命令，但保持了所有其他功能。工具名称已更新以反映其基于str_replace的架构。 |
| 2025年3月13日 | `text_editor_20250124` | 独立文本编辑器工具文档的介绍。此版本针对Claude Sonnet 3.7进行了优化，但具有与之前版本相同的功能。 |
| 2024年10月22日 | `text_editor_20241022` | 文本编辑器工具与Claude Sonnet 3.5的初始版本发布（[已停用](/docs/zh-CN/about-claude/model-deprecations)）。通过`view`、`create`、`str_replace`、`insert`和`undo_edit`命令提供查看、创建和编辑文件的功能。 |

## 后续步骤

以下是如何以更便捷和强大的方式使用文本编辑器工具的一些想法：

- **与您的开发工作流集成**：将文本编辑器工具构建到您的开发工具或IDE中
- **创建代码审查系统**：让Claude审查您的代码并进行改进
- **构建调试助手**：创建一个系统，Claude可以帮助您诊断和修复代码中的问题
- **实现文件格式转换**：让Claude帮助您将文件从一种格式转换为另一种格式
- **自动化文档**：设置工作流以让Claude自动记录您的代码

当您使用文本编辑器工具构建应用程序时，我们很高兴看到您如何利用Claude的功能来增强您的开发工作流和生产力。

<CardGroup cols={3}>
  <Card
    title="工具使用概述"
    icon="wrench"
    href="/docs/zh-CN/agents-and-tools/tool-use/overview"
  >
    了解如何实现与Claude一起使用的工具工作流。
  </Card>

  <Card
    title="Bash工具"
    icon="terminal"
    href="/docs/zh-CN/agents-and-tools/tool-use/bash-tool"
  >
    使用Claude执行shell命令。
  </Card>
</CardGroup>