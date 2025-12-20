# 文字編輯器工具

Claude 可以使用 Anthropic 定義的文字編輯器工具來檢視和修改文字檔案，幫助您除錯、修復和改進您的程式碼或其他文字文件。

---

Claude 可以使用 Anthropic 定義的文字編輯器工具來檢視和修改文字檔案，幫助您除錯、修復和改進您的程式碼或其他文字文件。這使 Claude 能夠直接與您的檔案互動，提供實際的協助，而不僅僅是建議更改。

## 模型相容性

| 模型 | 工具版本 |
|-------|--------------|
| Claude 4.x 模型 | `text_editor_20250728` |
| Claude Sonnet 3.7 ([已棄用](/docs/zh-TW/about-claude/model-deprecations)) | `text_editor_20250124` |

<Warning>
Claude 4 模型的 `text_editor_20250728` 工具不包含 `undo_edit` 命令。如果您需要此功能，您需要使用 Claude Sonnet 3.7 ([已棄用](/docs/zh-TW/about-claude/model-deprecations))。
</Warning>

<Warning>
較舊的工具版本不保證與較新的模型向後相容。始終使用與您的模型版本相對應的工具版本。
</Warning>

## 何時使用文字編輯器工具

以下是一些使用文字編輯器工具的例子：
- **程式碼除錯**：讓 Claude 識別並修復您程式碼中的錯誤，從語法錯誤到邏輯問題。
- **程式碼重構**：讓 Claude 通過有針對性的編輯來改進您的程式碼結構、可讀性和效能。
- **文件生成**：要求 Claude 為您的程式碼庫添加文件字符串、註解或 README 檔案。
- **測試建立**：讓 Claude 根據其對實現的理解為您的程式碼建立單元測試。

## 使用文字編輯器工具

<Tabs>
<Tab title="Claude 4">
使用 Messages API 向 Claude 提供文字編輯器工具（名為 `str_replace_based_edit_tool`）。

您可以選擇指定 `max_characters` 參數來控制檢視大型檔案時的截斷。

<Note>
`max_characters` 僅與 `text_editor_20250728` 及更新版本的文字編輯器工具相容。
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
使用 Messages API 向 Claude 提供文字編輯器工具（名為 `str_replace_editor`）：
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

文字編輯器工具可以按以下方式使用：

<Steps>
  <Step title="向 Claude 提供文字編輯器工具和使用者提示">
    - 在您的 API 請求中包含文字編輯器工具
    - 提供一個使用者提示，可能需要檢查或修改檔案，例如「您能幫我修復程式碼中的語法錯誤嗎？」
  </Step>
  <Step title="Claude 使用該工具檢查檔案或目錄">
    - Claude 評估需要查看的內容，並使用 `view` 命令檢查檔案內容或列出目錄內容
    - API 回應將包含一個包含 `view` 命令的 `tool_use` 內容區塊
  </Step>
  <Step title="執行 view 命令並返回結果">
    - 從 Claude 的工具使用請求中提取檔案或目錄路徑
    - 讀取檔案的內容或列出目錄內容
    - 如果在工具配置中指定了 `max_characters` 參數，請將檔案內容截斷到該長度
    - 通過繼續對話並使用包含 `tool_result` 內容區塊的新 `user` 訊息將結果返回給 Claude
  </Step>
  <Step title="Claude 使用該工具修改檔案">
    - 檢查檔案或目錄後，Claude 可能會使用 `str_replace` 等命令進行更改，或使用 `insert` 在特定行號處添加文字。
    - 如果 Claude 使用 `str_replace` 命令，Claude 會構造一個格式正確的工具使用請求，其中包含舊文字和要替換它的新文字
  </Step>
  <Step title="執行編輯並返回結果">
    - 從 Claude 的工具使用請求中提取檔案路徑、舊文字和新文字
    - 在檔案中執行文字替換
    - 將結果返回給 Claude
  </Step>
  <Step title="Claude 提供其分析和解釋">
    - 檢查並可能編輯檔案後，Claude 提供了它發現的內容和所做更改的完整解釋
  </Step>
</Steps>

### 文字編輯器工具命令

文字編輯器工具支援多個用於檢視和修改檔案的命令：

#### view

`view` 命令允許 Claude 檢查檔案的內容或列出目錄的內容。它可以讀取整個檔案或特定行範圍。

參數：
- `command`：必須是「view」
- `path`：要檢視的檔案或目錄的路徑
- `view_range`（可選）：一個包含兩個整數的陣列，指定要檢視的開始和結束行號。行號從 1 開始，結束行為 -1 表示讀到檔案末尾。此參數僅在檢視檔案時適用，不適用於目錄。

<section title="檢視命令範例">

```json
// 檢視檔案的範例
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "str_replace_editor",
  "input": {
    "command": "view",
    "path": "primes.py"
  }
}

// 檢視目錄的範例
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

`str_replace` 命令允許 Claude 用新字符串替換檔案中的特定字符串。這用於進行精確編輯。

參數：
- `command`：必須是「str_replace」
- `path`：要修改的檔案的路徑
- `old_str`：要替換的文字（必須完全匹配，包括空格和縮排）
- `new_str`：要插入以替換舊文字的新文字

<section title="str_replace 命令範例">

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

`create` 命令允許 Claude 建立一個具有指定內容的新檔案。

參數：
- `command`：必須是「create」
- `path`：應建立新檔案的路徑
- `file_text`：要寫入新檔案的內容

<section title="create 命令範例">

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

`insert` 命令允許 Claude 在檔案中的特定位置插入文字。

參數：
- `command`：必須是「insert」
- `path`：要修改的檔案的路徑
- `insert_line`：要在其後插入文字的行號（0 表示檔案開頭）
- `new_str`：要插入的文字

<section title="insert 命令範例">

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

`undo_edit` 命令允許 Claude 還原對檔案所做的最後編輯。

<Note>
此命令僅在 Claude Sonnet 3.7 ([已棄用](/docs/zh-TW/about-claude/model-deprecations)) 中可用。Claude 4 模型使用 `text_editor_20250728` 不支援此命令。
</Note>

參數：
- `command`：必須是「undo_edit」
- `path`：應撤銷其最後編輯的檔案的路徑

<section title="undo_edit 命令範例">

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

### 範例：使用文字編輯器工具修復語法錯誤

<Tabs>
<Tab title="Claude 4">

此範例演示了 Claude 4 模型如何使用文字編輯器工具修復 Python 檔案中的語法錯誤。

首先，您的應用程式向 Claude 提供文字編輯器工具和修復語法錯誤的提示：

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

Claude 將首先使用文字編輯器工具檢視檔案：

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

您的應用程式應該讀取該檔案並將其內容返回給 Claude：

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
**行號**

在上面的範例中，`view` 工具結果包含檔案內容，每行前面都有行號（例如「1: def is_prime(n):」）。行號不是必需的，但對於成功使用 `view_range` 參數檢查檔案的特定部分和 `insert_line` 參數在精確位置添加內容至關重要。
</Tip>

Claude 將識別語法錯誤並使用 `str_replace` 命令修復它：

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

您的應用程式應該進行編輯並返回結果：

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

最後，Claude 將提供修復的完整解釋：

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
此範例演示了 Claude Sonnet 3.7 如何使用文字編輯器工具修復 Python 檔案中的語法錯誤。

首先，您的應用程式向 Claude 提供文字編輯器工具和修復語法錯誤的提示：

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
Claude Sonnet 3.7 範例遵循與上面 Claude 4 範例相同的格式，使用相同的工具呼叫和回應，但使用 `text_editor_20250124` 工具類型和 `str_replace_editor` 名稱。
</Note>
</Tab>
</Tabs>

***

## 實現文字編輯器工具

文字編輯器工具是作為無模式工具實現的。使用此工具時，您不需要像其他工具那樣提供輸入模式；該模式內置於 Claude 的模型中，無法修改。

工具類型取決於模型版本：
- **Claude 4**: `type: "text_editor_20250728"`
- **Claude Sonnet 3.7**: `type: "text_editor_20250124"`

<Steps>
  <Step title="初始化您的編輯器實現">
    建立輔助函數來處理檔案操作，例如讀取、寫入和修改檔案。考慮實現備份功能以從錯誤中恢復。
  </Step>
  <Step title="處理編輯器工具呼叫">
    建立一個函數，根據命令類型處理來自 Claude 的工具呼叫：
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
  <Step title="實現安全措施">
    新增驗證和安全檢查：
    - 驗證檔案路徑以防止目錄遍歷
    - 在進行變更前建立備份
    - 優雅地處理錯誤
    - 實現權限檢查
  </Step>
  <Step title="處理 Claude 的回應">
    從 Claude 的回應中提取並處理工具呼叫：
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
實現文字編輯器工具時，請記住：

1. **安全性**：該工具可以存取您的本機檔案系統，因此請實現適當的安全措施。
2. **備份**：在允許編輯重要檔案之前，始終建立備份。
3. **驗證**：驗證所有輸入以防止意外變更。
4. **唯一匹配**：確保替換恰好匹配一個位置，以避免意外編輯。
</Warning>

### 處理錯誤

使用文字編輯器工具時，可能會發生各種錯誤。以下是如何處理它們的指導：

<section title="找不到檔案">

如果 Claude 嘗試檢視或修改不存在的檔案，請在 `tool_result` 中傳回適當的錯誤訊息：

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

<section title="替換的多個匹配項">

如果 Claude 的 `str_replace` 命令在檔案中匹配多個位置，請傳回適當的錯誤訊息：

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

<section title="替換沒有匹配項">

如果 Claude 的 `str_replace` 命令與檔案中的任何文字都不匹配，請傳回適當的錯誤訊息：

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

<section title="權限錯誤">

如果在建立、讀取或修改檔案時出現權限問題，請傳回適當的錯誤訊息：

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

### 遵循實現最佳實踐

<section title="提供清晰的上下文">

當要求 Claude 修復或修改程式碼時，請明確說明需要檢查哪些檔案或需要解決哪些問題。清晰的上下文可幫助 Claude 識別正確的檔案並進行適當的變更。

**不太有幫助的提示**："你能修復我的程式碼嗎？"

**更好的提示**："我的 primes.py 檔案中有語法錯誤，導致它無法執行。你能修復它嗎？"

</section>

<section title="明確指定檔案路徑">

在需要時清楚地指定檔案路徑，特別是如果您正在處理多個檔案或不同目錄中的檔案。

**不太有幫助的提示**："檢查我的輔助檔案"

**更好的提示**："你能檢查我的 utils/helpers.py 檔案是否有任何效能問題嗎？"

</section>

<section title="編輯前建立備份">

在您的應用程式中實現備份系統，在允許 Claude 編輯檔案之前建立檔案副本，特別是對於重要或生產程式碼。

```python
def backup_file(file_path):
    """Create a backup of a file before editing."""
    backup_path = f"{file_path}.backup"
    if os.path.exists(file_path):
        with open(file_path, 'r') as src, open(backup_path, 'w') as dst:
            dst.write(src.read())
```

</section>

<section title="小心處理唯一文字替換">

`str_replace` 命令需要要替換的文字完全匹配。您的應用程式應確保舊文字恰好有一個匹配項，或提供適當的錯誤訊息。
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

<section title="驗證變更">

在 Claude 對檔案進行變更後，透過執行測試或檢查程式碼是否仍按預期工作來驗證變更。
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

## 定價和代幣使用

The text editor tool uses the same pricing structure as other tools used with Claude. It follows the standard input and output token pricing based on the Claude model you're using.

In addition to the base tokens, the following additional input tokens are needed for the text editor tool:

| Tool | Additional input tokens |
| ----------------------------------------- | --------------------------------------- |
| `text_editor_20250429` (Claude 4.x) | 700 tokens |
| `text_editor_20250124` (Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations))) | 700 tokens |

有關工具定價的更詳細資訊，請參閱[工具使用定價](/docs/zh-TW/agents-and-tools/tool-use/overview#pricing)。

## 將文字編輯器工具與其他工具整合

文字編輯器工具可與其他 Claude 工具一起使用。在組合工具時，請確保您：
- 將工具版本與您使用的模型相匹配
- 考慮您的請求中包含的所有工具的額外代幣使用量

## 變更日誌

| 日期 | 版本 | 變更 |
| ---- | ------- | ------- |
| 2025 年 7 月 28 日 | `text_editor_20250728` | 發佈更新的文字編輯器工具，修復了一些問題並新增了可選的 `max_characters` 參數。除此之外，它與 `text_editor_20250429` 相同。 |
| 2025 年 4 月 29 日 | `text_editor_20250429` | 發佈適用於 Claude 4 的文字編輯器工具。此版本移除了 `undo_edit` 命令，但保留了所有其他功能。工具名稱已更新以反映其基於 str_replace 的架構。 |
| 2025 年 3 月 13 日 | `text_editor_20250124` | 獨立文字編輯器工具文件的介紹。此版本針對 Claude Sonnet 3.7 進行了最佳化，但具有與先前版本相同的功能。 |
| 2024 年 10 月 22 日 | `text_editor_20241022` | 文字編輯器工具與 Claude Sonnet 3.5 的初始版本發佈（[已停用](/docs/zh-TW/about-claude/model-deprecations)）。透過 `view`、`create`、`str_replace`、`insert` 和 `undo_edit` 命令提供檢視、建立和編輯檔案的功能。 |

## 後續步驟

以下是如何以更便利和強大的方式使用文字編輯器工具的一些想法：

- **與您的開發工作流程整合**：將文字編輯器工具構建到您的開發工具或 IDE 中
- **建立程式碼審查系統**：讓 Claude 審查您的程式碼並進行改進
- **構建除錯助手**：建立一個系統，其中 Claude 可以幫助您診斷和修復程式碼中的問題
- **實現檔案格式轉換**：讓 Claude 幫助您將檔案從一種格式轉換為另一種格式
- **自動化文件**：設定工作流程，讓 Claude 自動記錄您的程式碼

當您使用文字編輯器工具構建應用程式時，我們很期待看到您如何利用 Claude 的功能來增強您的開發工作流程和生產力。

<CardGroup cols={3}>
  <Card
    title="工具使用概述"
    icon="wrench"
    href="/docs/zh-TW/agents-and-tools/tool-use/overview"
  >
    了解如何實現與 Claude 一起使用的工具工作流程。
  </Card>

  <Card
    title="Bash 工具"
    icon="terminal"
    href="/docs/zh-TW/agents-and-tools/tool-use/bash-tool"
  >
    使用 Claude 執行 shell 命令。
  </Card>
</CardGroup>