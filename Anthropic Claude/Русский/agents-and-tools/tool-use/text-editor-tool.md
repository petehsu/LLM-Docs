# Инструмент текстового редактора

Claude может использовать определённый Anthropic инструмент текстового редактора для просмотра и изменения текстовых файлов, помогая вам отлаживать, исправлять и улучшать ваш код или другие текстовые документы.

---

Claude может использовать определённый Anthropic инструмент текстового редактора для просмотра и изменения текстовых файлов, помогая вам отлаживать, исправлять и улучшать ваш код или другие текстовые документы. Это позволяет Claude напрямую взаимодействовать с вашими файлами, обеспечивая практическую помощь вместо просто предложения изменений.

## Совместимость моделей

| Модель | Версия инструмента |
|-------|--------------|
| Claude 4.x модели | `text_editor_20250728` |
| Claude Sonnet 3.7 ([устарела](/docs/ru/about-claude/model-deprecations)) | `text_editor_20250124` |

<Warning>
Инструмент `text_editor_20250728` для моделей Claude 4 не включает команду `undo_edit`. Если вам требуется эта функциональность, вам нужно будет использовать Claude Sonnet 3.7 ([устарела](/docs/ru/about-claude/model-deprecations)).
</Warning>

<Warning>
Старые версии инструмента не гарантируют обратную совместимость с новыми моделями. Всегда используйте версию инструмента, которая соответствует версии вашей модели.
</Warning>

## Когда использовать инструмент текстового редактора

Некоторые примеры использования инструмента текстового редактора:
- **Отладка кода**: Попросите Claude определить и исправить ошибки в вашем коде, от синтаксических ошибок до логических проблем.
- **Рефакторинг кода**: Позвольте Claude улучшить структуру вашего кода, читаемость и производительность через целевые правки.
- **Генерация документации**: Попросите Claude добавить docstring, комментарии или файлы README в вашу кодовую базу.
- **Создание тестов**: Попросите Claude создать модульные тесты для вашего кода на основе его понимания реализации.

## Использование инструмента текстового редактора

<Tabs>
<Tab title="Claude 4">
Предоставьте инструмент текстового редактора (названный `str_replace_based_edit_tool`) Claude, используя Messages API.

Вы можете опционально указать параметр `max_characters` для управления усечением при просмотре больших файлов.

<Note>
`max_characters` совместим только с `text_editor_20250728` и более поздними версиями инструмента текстового редактора.
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
Предоставьте инструмент текстового редактора (названный `str_replace_editor`) Claude, используя Messages API:
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

Инструмент текстового редактора может быть использован следующим образом:

<Steps>
  <Step title="Предоставьте Claude инструмент текстового редактора и запрос пользователя">
    - Включите инструмент текстового редактора в ваш запрос API
    - Предоставьте запрос пользователя, который может потребовать изучения или изменения файлов, например "Можешь ли ты исправить синтаксическую ошибку в моём коде?"
  </Step>
  <Step title="Claude использует инструмент для изучения файлов или директорий">
    - Claude оценивает, что ему нужно посмотреть, и использует команду `view` для изучения содержимого файла или списка содержимого директории
    - Ответ API будет содержать блок содержимого `tool_use` с командой `view`
  </Step>
  <Step title="Выполните команду view и верните результаты">
    - Извлеките путь файла или директории из запроса использования инструмента Claude
    - Прочитайте содержимое файла или список содержимого директории
    - Если параметр `max_characters` был указан в конфигурации инструмента, усеките содержимое файла до этой длины
    - Верните результаты Claude, продолжив разговор с новым сообщением `user`, содержащим блок содержимого `tool_result`
  </Step>
  <Step title="Claude использует инструмент для изменения файлов">
    - После изучения файла или директории Claude может использовать команду, такую как `str_replace`, для внесения изменений или `insert` для добавления текста в определённый номер строки.
    - Если Claude использует команду `str_replace`, Claude создаёт правильно отформатированный запрос использования инструмента со старым текстом и новым текстом для его замены
  </Step>
  <Step title="Выполните правку и верните результаты">
    - Извлеките путь файла, старый текст и новый текст из запроса использования инструмента Claude
    - Выполните замену текста в файле
    - Верните результаты Claude
  </Step>
  <Step title="Claude предоставляет свой анализ и объяснение">
    - После изучения и возможного редактирования файлов Claude предоставляет полное объяснение того, что он обнаружил и какие изменения он внёс
  </Step>
</Steps>

### Команды инструмента текстового редактора

Инструмент текстового редактора поддерживает несколько команд для просмотра и изменения файлов:

#### view

Команда `view` позволяет Claude изучить содержимое файла или список содержимого директории. Она может прочитать весь файл или определённый диапазон строк.

Параметры:
- `command`: Должно быть "view"
- `path`: Путь к файлу или директории для просмотра
- `view_range` (опционально): Массив из двух целых чисел, указывающих начальный и конечный номера строк для просмотра. Номера строк начинаются с 1, а -1 для конечной строки означает чтение до конца файла. Этот параметр применяется только при просмотре файлов, а не директорий.

<section title="Примеры команд view">

```json
// Пример просмотра файла
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "str_replace_editor",
  "input": {
    "command": "view",
    "path": "primes.py"
  }
}

// Пример просмотра директории
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

Команда `str_replace` позволяет Claude заменить определённую строку в файле на новую строку. Это используется для внесения точных правок.

Параметры:
- `command`: Должно быть "str_replace"
- `path`: Путь к файлу для изменения
- `old_str`: Текст для замены (должен совпадать точно, включая пробелы и отступы)
- `new_str`: Новый текст для вставки вместо старого текста

<section title="Пример команды str_replace">

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

Команда `create` позволяет Claude создать новый файл с указанным содержимым.

Параметры:
- `command`: Должно быть "create"
- `path`: Путь, где должен быть создан новый файл
- `file_text`: Содержимое для записи в новый файл

<section title="Пример команды create">

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

Команда `insert` позволяет Claude вставить текст в определённое место в файле.

Параметры:
- `command`: Должно быть "insert"
- `path`: Путь к файлу для изменения
- `insert_line`: Номер строки, после которой вставить текст (0 для начала файла)
- `new_str`: Текст для вставки

<section title="Пример команды insert">

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

Команда `undo_edit` позволяет Claude отменить последнюю правку, сделанную в файле.

<Note>
Эта команда доступна только в Claude Sonnet 3.7 ([устарела](/docs/ru/about-claude/model-deprecations)). Она не поддерживается в моделях Claude 4, использующих `text_editor_20250728`.
</Note>

Параметры:
- `command`: Должно быть "undo_edit"
- `path`: Путь к файлу, последняя правка которого должна быть отменена

<section title="Пример команды undo_edit">

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

### Пример: Исправление синтаксической ошибки с помощью инструмента текстового редактора

<Tabs>
<Tab title="Claude 4">

Этот пример демонстрирует, как модели Claude 4 используют инструмент текстового редактора для исправления синтаксической ошибки в файле Python.

Сначала ваше приложение предоставляет Claude инструмент текстового редактора и запрос для исправления синтаксической ошибки:

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

Claude сначала будет использовать инструмент текстового редактора для просмотра файла:

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

Затем ваше приложение должно прочитать файл и вернуть его содержимое Claude:

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
**Номера строк**

В примере выше результат инструмента `view` включает содержимое файла с номерами строк, добавленными в начало каждой строки (например, "1: def is_prime(n):"). Номера строк не требуются, но они необходимы для успешного использования параметра `view_range` для изучения определённых разделов файлов и параметра `insert_line` для добавления содержимого в точные места.
</Tip>

Claude определит синтаксическую ошибку и использует команду `str_replace` для её исправления:

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

Затем ваше приложение должно внести правку и вернуть результат:

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

Наконец, Claude предоставит полное объяснение исправления:

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
Этот пример демонстрирует, как Claude Sonnet 3.7 использует инструмент текстового редактора для исправления синтаксической ошибки в файле Python.

Сначала ваше приложение предоставляет Claude инструмент текстового редактора и запрос для исправления синтаксической ошибки:

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
Примеры Claude Sonnet 3.7 следуют тому же формату, что и примеры Claude 4 выше, используя те же вызовы инструментов и ответы, но с типом инструмента `text_editor_20250124` и именем `str_replace_editor`.
</Note>
</Tab>
</Tabs>

***

## Реализация инструмента текстового редактора

Инструмент текстового редактора реализован как инструмент без схемы. При использовании этого инструмента вам не нужно предоставлять входную схему, как с другими инструментами; схема встроена в модель Claude и не может быть изменена.

Тип инструмента зависит от версии модели:
- **Claude 4**: `type: "text_editor_20250728"`
- **Claude Sonnet 3.7**: `type: "text_editor_20250124"`

<Steps>
  <Step title="Инициализируйте реализацию редактора">
    Создайте вспомогательные функции для обработки файловых операций, таких как чтение, запись и изменение файлов. Рассмотрите возможность реализации функции резервного копирования для восстановления после ошибок.
  </Step>
  <Step title="Обработка вызовов инструмента редактора">
    Создайте функцию, которая обрабатывает вызовы инструментов от Claude на основе типа команды:
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
  <Step title="Реализуйте меры безопасности">
    Добавьте проверку валидации и меры безопасности:
    - Проверяйте пути файлов, чтобы предотвратить обход директорий
    - Создавайте резервные копии перед внесением изменений
    - Обрабатывайте ошибки корректно
    - Реализуйте проверки прав доступа
  </Step>
  <Step title="Обработка ответов Claude">
    Извлекайте и обрабатывайте вызовы инструментов из ответов Claude:
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
При реализации инструмента текстового редактора помните:

1. **Безопасность**: Инструмент имеет доступ к вашей локальной файловой системе, поэтому реализуйте надлежащие меры безопасности.
2. **Резервная копия**: Всегда создавайте резервные копии перед разрешением редактирования важных файлов.
3. **Валидация**: Проверяйте все входные данные, чтобы предотвратить непредусмотренные изменения.
4. **Уникальное совпадение**: Убедитесь, что замены совпадают ровно в одном месте, чтобы избежать непредусмотренных редактирований.
</Warning>

### Обработка ошибок

При использовании инструмента текстового редактора могут возникнуть различные ошибки. Вот рекомендации по их обработке:

<section title="Файл не найден">

Если Claude пытается просмотреть или изменить файл, который не существует, верните соответствующее сообщение об ошибке в `tool_result`:

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

<section title="Несколько совпадений для замены">

Если команда `str_replace` Claude совпадает с несколькими местами в файле, верните соответствующее сообщение об ошибке:

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

<section title="Нет совпадений для замены">

Если команда `str_replace` Claude не совпадает ни с каким текстом в файле, верните соответствующее сообщение об ошибке:

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

<section title="Ошибки прав доступа">

Если возникают проблемы с правами доступа при создании, чтении или изменении файлов, верните соответствующее сообщение об ошибке:

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

### Следуйте лучшим практикам реализации

<section title="Предоставляйте четкий контекст">

При просьбе к Claude исправить или изменить код будьте конкретны в отношении того, какие файлы нужно проверить или какие проблемы нужно решить. Четкий контекст помогает Claude определить правильные файлы и внести соответствующие изменения.

**Менее полезный запрос**: "Можешь ли ты исправить мой код?"

**Лучший запрос**: "В моем файле primes.py есть синтаксическая ошибка, которая препятствует его запуску. Можешь ли ты это исправить?"

</section>

<section title="Будьте явны в отношении путей файлов">

Четко указывайте пути файлов при необходимости, особенно если вы работаете с несколькими файлами или файлами в разных директориях.

**Менее полезный запрос**: "Проверь мой вспомогательный файл"

**Лучший запрос**: "Можешь ли ты проверить мой файл utils/helpers.py на предмет проблем с производительностью?"

</section>

<section title="Создавайте резервные копии перед редактированием">

Реализуйте систему резервного копирования в вашем приложении, которая создает копии файлов перед разрешением Claude редактировать их, особенно для важного или производственного кода.

```python
def backup_file(file_path):
    """Create a backup of a file before editing."""
    backup_path = f"{file_path}.backup"
    if os.path.exists(file_path):
        with open(file_path, 'r') as src, open(backup_path, 'w') as dst:
            dst.write(src.read())
```

</section>

<section title="Осторожно обрабатывайте замену уникального текста">

Команда `str_replace` требует точного совпадения текста, который нужно заменить. Ваше приложение должно убедиться, что существует ровно одно совпадение для старого текста или предоставить соответствующие сообщения об ошибках.
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

<section title="Проверяйте изменения">

После того как Claude внесет изменения в файл, проверьте изменения, запустив тесты или убедившись, что код по-прежнему работает как ожидается.
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

## Цены и использование токенов

The text editor tool uses the same pricing structure as other tools used with Claude. It follows the standard input and output token pricing based on the Claude model you're using.

In addition to the base tokens, the following additional input tokens are needed for the text editor tool:

| Tool | Additional input tokens |
| ----------------------------------------- | --------------------------------------- |
| `text_editor_20250429` (Claude 4.x) | 700 tokens |
| `text_editor_20250124` (Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations))) | 700 tokens |

Для получения более подробной информации о ценах на инструменты см. [Цены на использование инструментов](/docs/ru/agents-and-tools/tool-use/overview#pricing).

## Интеграция инструмента текстового редактора с другими инструментами

Инструмент текстового редактора можно использовать вместе с другими инструментами Claude. При объединении инструментов убедитесь, что вы:
- Соответствуете версии инструмента модели, которую вы используете
- Учитываете дополнительное использование токенов для всех инструментов, включенных в ваш запрос

## Журнал изменений

| Дата | Версия | Изменения |
| ---- | ------- | ------- |
| 28 июля 2025 г. | `text_editor_20250728` | Выпуск обновленного инструмента текстового редактора, который исправляет некоторые проблемы и добавляет необязательный параметр `max_characters`. В остальном идентичен `text_editor_20250429`. |
| 29 апреля 2025 г. | `text_editor_20250429` | Выпуск инструмента текстового редактора для Claude 4. Эта версия удаляет команду `undo_edit`, но сохраняет все остальные возможности. Имя инструмента было обновлено, чтобы отражать его архитектуру на основе str_replace. |
| 13 марта 2025 г. | `text_editor_20250124` | Введение документации автономного инструмента текстового редактора. Эта версия оптимизирована для Claude Sonnet 3.7, но имеет идентичные возможности с предыдущей версией. |
| 22 октября 2024 г. | `text_editor_20241022` | Первоначальный выпуск инструмента текстового редактора с Claude Sonnet 3.5 ([снят с производства](/docs/ru/about-claude/model-deprecations)). Предоставляет возможности для просмотра, создания и редактирования файлов через команды `view`, `create`, `str_replace`, `insert` и `undo_edit`. |

## Следующие шаги

Вот несколько идей о том, как использовать инструмент текстового редактора более удобным и мощным способом:

- **Интегрируйте с вашим рабочим процессом разработки**: Встройте инструмент текстового редактора в ваши инструменты разработки или IDE
- **Создайте систему проверки кода**: Попросите Claude проверить ваш код и внести улучшения
- **Создайте помощника по отладке**: Создайте систему, в которой Claude может помочь вам диагностировать и исправлять проблемы в вашем коде
- **Реализуйте преобразование формата файлов**: Позвольте Claude помочь вам преобразовать файлы из одного формата в другой
- **Автоматизируйте документацию**: Установите рабочие процессы для Claude, чтобы автоматически документировать ваш код

По мере создания приложений с инструментом текстового редактора мы с нетерпением ждем, как вы используете возможности Claude для улучшения вашего рабочего процесса разработки и производительности.

<CardGroup cols={3}>
  <Card
    title="Обзор использования инструментов"
    icon="wrench"
    href="/docs/ru/agents-and-tools/tool-use/overview"
  >
    Узнайте, как реализовать рабочие процессы инструментов для использования с Claude.
  </Card>

  <Card
    title="Инструмент Bash"
    icon="terminal"
    href="/docs/ru/agents-and-tools/tool-use/bash-tool"
  >
    Выполняйте команды оболочки с Claude.
  </Card>
</CardGroup>