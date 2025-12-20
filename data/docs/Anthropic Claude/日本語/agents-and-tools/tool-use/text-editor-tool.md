# テキストエディタツール

Claudeがテキストファイルを表示・編集するためのAnthropicが定義したテキストエディタツールを使用して、コードやその他のテキストドキュメントのデバッグ、修正、改善を行うことができます。

---

Claudeは、テキストファイルを表示および変更するためのAnthropicが定義したテキストエディタツールを使用できます。これにより、コードやその他のテキストドキュメントのデバッグ、修正、改善を行うことができます。このツールにより、Claudeはファイルと直接対話でき、変更を提案するだけでなく、実践的なサポートを提供できます。

## モデルの互換性

| モデル | ツールバージョン |
|-------|--------------|
| Claude 4.xモデル | `text_editor_20250728` |
| Claude Sonnet 3.7 ([廃止予定](/docs/ja/about-claude/model-deprecations)) | `text_editor_20250124` |

<Warning>
Claude 4モデル用の`text_editor_20250728`ツールには`undo_edit`コマンドが含まれていません。この機能が必要な場合は、Claude Sonnet 3.7 ([廃止予定](/docs/ja/about-claude/model-deprecations))を使用する必要があります。
</Warning>

<Warning>
古いツールバージョンは、新しいモデルとの下位互換性が保証されていません。常にモデルバージョンに対応するツールバージョンを使用してください。
</Warning>

## テキストエディタツールを使用する場合

テキストエディタツールを使用する場合の例としては、以下のようなものがあります：
- **コードのデバッグ**: Claudeにコード内のバグを識別して修正させます。構文エラーからロジックの問題まで対応できます。
- **コードのリファクタリング**: Claudeにコード構造、可読性、パフォーマンスを改善させます。
- **ドキュメント生成**: Claudeにdocstring、コメント、READMEファイルをコードベースに追加させます。
- **テスト作成**: Claudeに実装の理解に基づいてコードのユニットテストを作成させます。

## テキストエディタツールを使用する

<Tabs>
<Tab title="Claude 4">
Messages APIを使用してテキストエディタツール（`str_replace_based_edit_tool`という名前）をClaudeに提供します。

大きなファイルを表示する際の切り詰めを制御するために、オプションで`max_characters`パラメータを指定できます。

<Note>
`max_characters`は`text_editor_20250728`以降のテキストエディタツールバージョンとのみ互換性があります。
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
Messages APIを使用してテキストエディタツール（`str_replace_editor`という名前）をClaudeに提供します：
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

テキストエディタツールは以下の方法で使用できます：

<Steps>
  <Step title="テキストエディタツールとユーザープロンプトをClaudeに提供する">
    - APIリクエストにテキストエディタツールを含める
    - ファイルの検査または変更が必要なユーザープロンプトを提供します。例えば「コードの構文エラーを修正できますか？」など
  </Step>
  <Step title="Claudeがツールを使用してファイルまたはディレクトリを検査する">
    - Claudeは何を確認する必要があるかを評価し、`view`コマンドを使用してファイルの内容を検査するか、ディレクトリの内容をリストします
    - APIレスポンスには`view`コマンドを含む`tool_use`コンテンツブロックが含まれます
  </Step>
  <Step title="viewコマンドを実行して結果を返す">
    - Claudeのツール使用リクエストからファイルまたはディレクトリパスを抽出します
    - ファイルの内容を読み込むか、ディレクトリの内容をリストします
    - ツール設定で`max_characters`パラメータが指定されていた場合、ファイルの内容をその長さに切り詰めます
    - `tool_result`コンテンツブロックを含む新しい`user`メッセージで会話を続けることで、結果をClaudeに返します
  </Step>
  <Step title="Claudeがツールを使用してファイルを変更する">
    - ファイルまたはディレクトリを検査した後、Claudeは`str_replace`などのコマンドを使用して変更を加えるか、`insert`を使用して特定の行番号にテキストを追加する場合があります
    - Claudeが`str_replace`コマンドを使用する場合、Claudeは古いテキストと新しいテキストを含む適切にフォーマットされたツール使用リクエストを構築します
  </Step>
  <Step title="編集を実行して結果を返す">
    - Claudeのツール使用リクエストからファイルパス、古いテキスト、新しいテキストを抽出します
    - ファイル内のテキスト置換を実行します
    - 結果をClaudeに返します
  </Step>
  <Step title="Claudeが分析と説明を提供する">
    - ファイルを検査して、場合によっては編集した後、Claudeは見つけたものと行った変更の完全な説明を提供します
  </Step>
</Steps>

### テキストエディタツールコマンド

テキストエディタツールは、ファイルを表示および変更するためのいくつかのコマンドをサポートしています：

#### view

`view`コマンドにより、Claudeはファイルの内容を検査するか、ディレクトリの内容をリストできます。ファイル全体または特定の行の範囲を読み込むことができます。

パラメータ：
- `command`: 「view」である必要があります
- `path`: 表示するファイルまたはディレクトリへのパス
- `view_range`（オプション）: 表示する開始行番号と終了行番号を指定する2つの整数の配列。行番号は1から始まり、終了行に-1を指定するとファイルの終わりまで読み込みます。このパラメータはファイルを表示する場合にのみ適用され、ディレクトリには適用されません。

<section title="viewコマンドの例">

```json
// ファイルを表示する例
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "str_replace_editor",
  "input": {
    "command": "view",
    "path": "primes.py"
  }
}

// ディレクトリを表示する例
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

`str_replace`コマンドにより、Claudeはファイル内の特定の文字列を新しい文字列に置換できます。これは正確な編集を行うために使用されます。

パラメータ：
- `command`: 「str_replace」である必要があります
- `path`: 変更するファイルへのパス
- `old_str`: 置換するテキスト（空白とインデントを含めて完全に一致する必要があります）
- `new_str`: 古いテキストの代わりに挿入する新しいテキスト

<section title="str_replaceコマンドの例">

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

`create`コマンドにより、Claudeは指定されたコンテンツで新しいファイルを作成できます。

パラメータ：
- `command`: 「create」である必要があります
- `path`: 新しいファイルを作成する場所へのパス
- `file_text`: 新しいファイルに書き込むコンテンツ

<section title="createコマンドの例">

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

`insert`コマンドにより、Claudeはファイル内の特定の場所にテキストを挿入できます。

パラメータ：
- `command`: 「insert」である必要があります
- `path`: 変更するファイルへのパス
- `insert_line`: テキストを挿入する行番号の後（ファイルの開始の場合は0）
- `new_str`: 挿入するテキスト

<section title="insertコマンドの例">

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

`undo_edit`コマンドにより、Claudeはファイルに加えた最後の編集を元に戻すことができます。

<Note>
このコマンドはClaude Sonnet 3.7 ([廃止予定](/docs/ja/about-claude/model-deprecations))でのみ利用可能です。Claude 4モデルで`text_editor_20250728`を使用する場合はサポートされていません。
</Note>

パラメータ：
- `command`: 「undo_edit」である必要があります
- `path`: 最後の編集を元に戻すファイルへのパス

<section title="undo_editコマンドの例">

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

### 例：テキストエディタツールで構文エラーを修正する

<Tabs>
<Tab title="Claude 4">

この例は、Claude 4モデルがテキストエディタツールを使用してPythonファイルの構文エラーを修正する方法を示しています。

まず、アプリケーションはClaudeにテキストエディタツールと構文エラーを修正するためのプロンプトを提供します：

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

Claudeはまずテキストエディタツールを使用してファイルを表示します：

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

その後、アプリケーションはファイルを読み込んで、その内容をClaudeに返す必要があります：

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
**行番号**

上記の例では、`view`ツール結果には各行の前に行番号が付いたファイルの内容が含まれています（例：「1: def is_prime(n):」）。行番号は必須ではありませんが、`view_range`パラメータを使用してファイルの特定のセクションを検査し、`insert_line`パラメータを使用して正確な場所にコンテンツを追加するために不可欠です。
</Tip>

Claudeは構文エラーを特定し、`str_replace`コマンドを使用して修正します：

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

その後、アプリケーションは編集を実行して結果を返す必要があります：

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

最後に、Claudeは修正の完全な説明を提供します：

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
この例は、Claude Sonnet 3.7がテキストエディタツールを使用してPythonファイルの構文エラーを修正する方法を示しています。

まず、アプリケーションはClaudeにテキストエディタツールと構文エラーを修正するためのプロンプトを提供します：

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
Claude Sonnet 3.7の例は上記のClaude 4の例と同じ形式に従い、同じツール呼び出しとレスポンスを使用しますが、`text_editor_20250124`ツールタイプと`str_replace_editor`名を使用します。
</Note>
</Tab>
</Tabs>

***

## テキストエディタツールの実装

テキストエディタツールはスキーマレスツールとして実装されています。このツールを使用する場合、他のツールのような入力スキーマを提供する必要はありません。スキーマはClaudeのモデルに組み込まれており、変更することはできません。

ツールタイプはモデルバージョンによって異なります：
- **Claude 4**: `type: "text_editor_20250728"`
- **Claude Sonnet 3.7**: `type: "text_editor_20250124"`

<Steps>
  <Step title="エディタ実装の初期化">
    ファイルの読み取り、書き込み、変更などのファイル操作を処理するヘルパー関数を作成します。ミスから回復するためのバックアップ機能の実装を検討してください。
  </Step>
  <Step title="エディタツール呼び出しの処理">
    コマンドタイプに基づいてClaudeからのツール呼び出しを処理する関数を作成します：
    ```python
    def handle_editor_tool(tool_call, model_version):
        input_params = tool_call.input
        command = input_params.get('command', '')
        file_path = input_params.get('path', '')
        
        if command == 'view':
            # ファイルの内容を読み取って返す
            pass
        elif command == 'str_replace':
            # ファイル内のテキストを置換
            pass
        elif command == 'create':
            # 新しいファイルを作成
            pass
        elif command == 'insert':
            # 位置にテキストを挿入
            pass
        elif command == 'undo_edit':
            # Claude 4モデルかどうかを確認
            if 'str_replace_based_edit_tool' in model_version:
                return {"error": "undo_edit command is not supported in Claude 4"}
            # Claude 3.7のバックアップから復元
            pass
    ```
  </Step>
  <Step title="セキュリティ対策の実装">
    検証とセキュリティチェックを追加します：
    - ディレクトリトラバーサルを防ぐためにファイルパスを検証
    - 変更前にバックアップを作成
    - エラーを適切に処理
    - パーミッションチェックを実装
  </Step>
  <Step title="Claudeの応答を処理">
    Claudeの応答からツール呼び出しを抽出して処理します：
    ```python
    # Claudeの応答でツール使用を処理
    for content in response.content:
        if content.type == "tool_use":
            # コマンドに基づいてツールを実行
            result = handle_editor_tool(content)
            
            # 結果をClaudeに返す
            tool_result = {
                "type": "tool_result",
                "tool_use_id": content.id,
                "content": result
            }
    ```
  </Step>
</Steps>

<Warning>
テキストエディタツールを実装する際は、以下の点に注意してください：

1. **セキュリティ**: ツールはローカルファイルシステムにアクセスできるため、適切なセキュリティ対策を実装してください。
2. **バックアップ**: 重要なファイルの編集を許可する前に、常にバックアップを作成してください。
3. **検証**: 意図しない変更を防ぐために、すべての入力を検証してください。
4. **一意のマッチング**: 置換が正確に1つの場所にマッチすることを確認して、意図しない編集を避けてください。
</Warning>

### エラーの処理

テキストエディタツールを使用する場合、様々なエラーが発生する可能性があります。以下は、それらの処理方法に関するガイダンスです：

<section title="ファイルが見つかりません">

Claudeが存在しないファイルを表示または変更しようとした場合、`tool_result`に適切なエラーメッセージを返します：

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

<section title="置換に複数のマッチがあります">

Claudeの`str_replace`コマンドがファイル内の複数の場所にマッチした場合、適切なエラーメッセージを返します：

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

<section title="置換にマッチがありません">

Claudeの`str_replace`コマンドがファイル内のテキストにマッチしない場合、適切なエラーメッセージを返します：

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

<section title="パーミッションエラー">

ファイルの作成、読み取り、または変更に関するパーミッション問題がある場合、適切なエラーメッセージを返します：

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

### 実装のベストプラクティスに従う

<section title="明確なコンテキストを提供">

Claudeにコードの修正または変更を依頼する場合、どのファイルを確認する必要があるか、または何の問題に対処する必要があるかについて具体的に説明してください。明確なコンテキストはClaudeが正しいファイルを識別し、適切な変更を加えるのに役立ちます。

**あまり役に立たないプロンプト**: 「コードを修正してもらえますか？」

**より良いプロンプト**: 「primes.pyファイルに構文エラーがあり、実行できません。修正してもらえますか？」

</section>

<section title="ファイルパスを明示的に指定">

特に複数のファイルや異なるディレクトリ内のファイルを操作している場合は、ファイルパスを明確に指定してください。

**あまり役に立たないプロンプト**: 「ヘルパーファイルを確認してください」

**より良いプロンプト**: 「utils/helpers.pyファイルをパフォーマンスの問題がないか確認してもらえますか？」

</section>

<section title="編集前にバックアップを作成">

アプリケーションにバックアップシステムを実装して、Claudeがファイルを編集することを許可する前にファイルのコピーを作成します。特に重要なコードまたは本番環境のコードの場合はそうです。

```python
def backup_file(file_path):
    """編集前にファイルのバックアップを作成します。"""
    backup_path = f"{file_path}.backup"
    if os.path.exists(file_path):
        with open(file_path, 'r') as src, open(backup_path, 'w') as dst:
            dst.write(src.read())
```

</section>

<section title="一意のテキスト置換を慎重に処理">

`str_replace`コマンドは、置換するテキストの完全一致が必要です。アプリケーションは、古いテキストに対して正確に1つのマッチが存在することを確認するか、適切なエラーメッセージを提供する必要があります。
```python
def safe_replace(file_path, old_text, new_text):
    """正確に1つのマッチがある場合のみテキストを置換します。"""
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

<section title="変更を検証">

Claudeがファイルに変更を加えた後、テストを実行するか、コードが期待通りに機能することを確認して変更を検証します。
```python
def verify_changes(file_path):
    """変更後にテストまたはチェックを実行します。"""
    try:
        # Pythonファイルの場合、構文エラーをチェック
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

## 価格とトークン使用量

The text editor tool uses the same pricing structure as other tools used with Claude. It follows the standard input and output token pricing based on the Claude model you're using.

In addition to the base tokens, the following additional input tokens are needed for the text editor tool:

| Tool | Additional input tokens |
| ----------------------------------------- | --------------------------------------- |
| `text_editor_20250429` (Claude 4.x) | 700 tokens |
| `text_editor_20250124` (Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations))) | 700 tokens |

ツール価格の詳細については、[ツール使用価格](/docs/ja/agents-and-tools/tool-use/overview#pricing)を参照してください。

## テキストエディタツールを他のツールと統合

テキストエディタツールは他のClaudeツールと一緒に使用できます。ツールを組み合わせる場合は、以下を確認してください：
- ツールバージョンを使用しているモデルと一致させる
- リクエストに含まれるすべてのツールの追加トークン使用量を考慮する

## 変更ログ

| 日付 | バージョン | 変更内容 |
| ---- | ------- | ------- |
| 2025年7月28日 | `text_editor_20250728` | いくつかの問題を修正し、オプションの`max_characters`パラメータを追加した更新されたテキストエディタツールのリリース。`text_editor_20250429`と同一です。 |
| 2025年4月29日 | `text_editor_20250429` | Claude 4用のテキストエディタツールのリリース。このバージョンは`undo_edit`コマンドを削除しますが、他のすべての機能は保持されます。ツール名はstr_replaceベースのアーキテクチャを反映するように更新されました。 |
| 2025年3月13日 | `text_editor_20250124` | スタンドアロンテキストエディタツールドキュメントの導入。このバージョンはClaude Sonnet 3.7に最適化されていますが、前のバージョンと同一の機能を備えています。 |
| 2024年10月22日 | `text_editor_20241022` | Claude Sonnet 3.5（[廃止](/docs/ja/about-claude/model-deprecations)）を使用したテキストエディタツールの初期リリース。`view`、`create`、`str_replace`、`insert`、および`undo_edit`コマンドを通じてファイルを表示、作成、編集するための機能を提供します。 |

## 次のステップ

テキストエディタツールをより便利で強力な方法で使用する方法のいくつかのアイデアを以下に示します：

- **開発ワークフローと統合**: テキストエディタツールを開発ツールまたはIDEに組み込む
- **コードレビューシステムを作成**: Claudeにコードをレビューして改善させる
- **デバッグアシスタントを構築**: Claudeがコード内の問題の診断と修正を支援するシステムを作成
- **ファイル形式変換を実装**: Claudeがファイルをある形式から別の形式に変換するのを支援
- **ドキュメント作成を自動化**: Claudeがコードを自動的にドキュメント化するワークフローを設定

テキストエディタツールを使用してアプリケーションを構築する際、Claudeの機能を活用して開発ワークフローと生産性を向上させる方法を見ることに期待しています。

<CardGroup cols={3}>
  <Card
    title="ツール使用の概要"
    icon="wrench"
    href="/docs/ja/agents-and-tools/tool-use/overview"
  >
    Claudeで使用するツールワークフローを実装する方法を学びます。
  </Card>

  <Card
    title="Bashツール"
    icon="terminal"
    href="/docs/ja/agents-and-tools/tool-use/bash-tool"
  >
    Claudeでシェルコマンドを実行します。
  </Card>
</CardGroup>