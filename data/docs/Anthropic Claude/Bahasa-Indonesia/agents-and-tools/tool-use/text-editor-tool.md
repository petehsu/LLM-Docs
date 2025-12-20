# Alat editor teks

Claude dapat menggunakan alat editor teks yang ditentukan oleh Anthropic untuk melihat dan memodifikasi file teks, membantu Anda men-debug, memperbaiki, dan meningkatkan kode atau dokumen teks lainnya.

---

Claude dapat menggunakan alat editor teks yang ditentukan oleh Anthropic untuk melihat dan memodifikasi file teks, membantu Anda men-debug, memperbaiki, dan meningkatkan kode atau dokumen teks lainnya. Ini memungkinkan Claude untuk berinteraksi langsung dengan file Anda, memberikan bantuan langsung daripada hanya menyarankan perubahan.

## Kompatibilitas model

| Model | Versi Alat |
|-------|--------------|
| Model Claude 4.x | `text_editor_20250728` |
| Claude Sonnet 3.7 ([deprecated](/docs/id/about-claude/model-deprecations)) | `text_editor_20250124` |

<Warning>
Alat `text_editor_20250728` untuk model Claude 4 tidak menyertakan perintah `undo_edit`. Jika Anda memerlukan fungsi ini, Anda perlu menggunakan Claude Sonnet 3.7 ([deprecated](/docs/id/about-claude/model-deprecations)).
</Warning>

<Warning>
Versi alat yang lebih lama tidak dijamin kompatibel mundur dengan model yang lebih baru. Selalu gunakan versi alat yang sesuai dengan versi model Anda.
</Warning>

## Kapan menggunakan alat editor teks

Beberapa contoh kapan menggunakan alat editor teks adalah:
- **Debugging kode**: Biarkan Claude mengidentifikasi dan memperbaiki bug dalam kode Anda, dari kesalahan sintaks hingga masalah logika.
- **Refactoring kode**: Biarkan Claude meningkatkan struktur kode, keterbacaan, dan kinerja Anda melalui pengeditan yang ditargetkan.
- **Pembuatan dokumentasi**: Minta Claude untuk menambahkan docstring, komentar, atau file README ke basis kode Anda.
- **Pembuatan tes**: Biarkan Claude membuat tes unit untuk kode Anda berdasarkan pemahamannya tentang implementasi.

## Gunakan alat editor teks

<Tabs>
<Tab title="Claude 4">
Sediakan alat editor teks (bernama `str_replace_based_edit_tool`) ke Claude menggunakan Messages API.

Anda dapat secara opsional menentukan parameter `max_characters` untuk mengontrol pemotongan saat melihat file besar.

<Note>
`max_characters` hanya kompatibel dengan `text_editor_20250728` dan versi alat editor teks yang lebih baru.
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
Sediakan alat editor teks (bernama `str_replace_editor`) ke Claude menggunakan Messages API:
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

Alat editor teks dapat digunakan dengan cara berikut:

<Steps>
  <Step title="Sediakan Claude dengan alat editor teks dan prompt pengguna">
    - Sertakan alat editor teks dalam permintaan API Anda
    - Sediakan prompt pengguna yang mungkin memerlukan pemeriksaan atau modifikasi file, seperti "Bisakah Anda memperbaiki kesalahan sintaks dalam kode saya?"
  </Step>
  <Step title="Claude menggunakan alat untuk memeriksa file atau direktori">
    - Claude menilai apa yang perlu dilihat dan menggunakan perintah `view` untuk memeriksa konten file atau mendaftar konten direktori
    - Respons API akan berisi blok konten `tool_use` dengan perintah `view`
  </Step>
  <Step title="Jalankan perintah view dan kembalikan hasil">
    - Ekstrak jalur file atau direktori dari permintaan penggunaan alat Claude
    - Baca konten file atau daftar konten direktori
    - Jika parameter `max_characters` ditentukan dalam konfigurasi alat, potong konten file ke panjang tersebut
    - Kembalikan hasil ke Claude dengan melanjutkan percakapan dengan pesan `user` baru yang berisi blok konten `tool_result`
  </Step>
  <Step title="Claude menggunakan alat untuk memodifikasi file">
    - Setelah memeriksa file atau direktori, Claude dapat menggunakan perintah seperti `str_replace` untuk membuat perubahan atau `insert` untuk menambahkan teks pada nomor baris tertentu.
    - Jika Claude menggunakan perintah `str_replace`, Claude membuat permintaan penggunaan alat yang diformat dengan benar dengan teks lama dan teks baru untuk menggantinya
  </Step>
  <Step title="Jalankan edit dan kembalikan hasil">
    - Ekstrak jalur file, teks lama, dan teks baru dari permintaan penggunaan alat Claude
    - Lakukan penggantian teks dalam file
    - Kembalikan hasil ke Claude
  </Step>
  <Step title="Claude memberikan analisis dan penjelasannya">
    - Setelah memeriksa dan mungkin mengedit file, Claude memberikan penjelasan lengkap tentang apa yang ditemukannya dan perubahan apa yang dilakukannya
  </Step>
</Steps>

### Perintah alat editor teks

Alat editor teks mendukung beberapa perintah untuk melihat dan memodifikasi file:

#### view

Perintah `view` memungkinkan Claude untuk memeriksa konten file atau mendaftar konten direktori. Ini dapat membaca seluruh file atau rentang baris tertentu.

Parameter:
- `command`: Harus "view"
- `path`: Jalur ke file atau direktori yang akan dilihat
- `view_range` (opsional): Larik dua bilangan bulat yang menentukan nomor baris awal dan akhir untuk dilihat. Nomor baris diindeks 1, dan -1 untuk baris akhir berarti baca hingga akhir file. Parameter ini hanya berlaku saat melihat file, bukan direktori.

<section title="Contoh perintah view">

```json
// Contoh untuk melihat file
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "str_replace_editor",
  "input": {
    "command": "view",
    "path": "primes.py"
  }
}

// Contoh untuk melihat direktori
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

Perintah `str_replace` memungkinkan Claude untuk mengganti string tertentu dalam file dengan string baru. Ini digunakan untuk membuat pengeditan yang tepat.

Parameter:
- `command`: Harus "str_replace"
- `path`: Jalur ke file yang akan dimodifikasi
- `old_str`: Teks yang akan diganti (harus cocok persis, termasuk spasi dan indentasi)
- `new_str`: Teks baru yang akan dimasukkan sebagai pengganti teks lama

<section title="Contoh perintah str_replace">

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

Perintah `create` memungkinkan Claude untuk membuat file baru dengan konten yang ditentukan.

Parameter:
- `command`: Harus "create"
- `path`: Jalur tempat file baru harus dibuat
- `file_text`: Konten yang akan ditulis ke file baru

<section title="Contoh perintah create">

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

Perintah `insert` memungkinkan Claude untuk menyisipkan teks pada lokasi tertentu dalam file.

Parameter:
- `command`: Harus "insert"
- `path`: Jalur ke file yang akan dimodifikasi
- `insert_line`: Nomor baris setelah teks akan disisipkan (0 untuk awal file)
- `new_str`: Teks yang akan disisipkan

<section title="Contoh perintah insert">

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

Perintah `undo_edit` memungkinkan Claude untuk membatalkan pengeditan terakhir yang dilakukan pada file.

<Note>
Perintah ini hanya tersedia di Claude Sonnet 3.7 ([deprecated](/docs/id/about-claude/model-deprecations)). Ini tidak didukung dalam model Claude 4 menggunakan `text_editor_20250728`.
</Note>

Parameter:
- `command`: Harus "undo_edit"
- `path`: Jalur ke file yang pengeditan terakhirnya harus dibatalkan

<section title="Contoh perintah undo_edit">

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

### Contoh: Memperbaiki kesalahan sintaks dengan alat editor teks

<Tabs>
<Tab title="Claude 4">

Contoh ini menunjukkan bagaimana model Claude 4 menggunakan alat editor teks untuk memperbaiki kesalahan sintaks dalam file Python.

Pertama, aplikasi Anda menyediakan Claude dengan alat editor teks dan prompt untuk memperbaiki kesalahan sintaks:

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

Claude akan menggunakan alat editor teks terlebih dahulu untuk melihat file:

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

Aplikasi Anda kemudian harus membaca file dan mengembalikan isinya ke Claude:

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
**Nomor baris**

Dalam contoh di atas, hasil alat `view` menyertakan konten file dengan nomor baris yang ditambahkan di depan setiap baris (misalnya, "1: def is_prime(n):"). Nomor baris tidak diperlukan, tetapi penting untuk berhasil menggunakan parameter `view_range` untuk memeriksa bagian tertentu dari file dan parameter `insert_line` untuk menambahkan konten pada lokasi yang tepat.
</Tip>

Claude akan mengidentifikasi kesalahan sintaks dan menggunakan perintah `str_replace` untuk memperbaikinya:

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

Aplikasi Anda kemudian harus membuat edit dan mengembalikan hasilnya:

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
        # Pesan sebelumnya...
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
    // Pesan sebelumnya...
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
                // Pesan sebelumnya akan masuk di sini
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

Terakhir, Claude akan memberikan penjelasan lengkap tentang perbaikannya:

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
Contoh ini menunjukkan bagaimana Claude Sonnet 3.7 menggunakan alat editor teks untuk memperbaiki kesalahan sintaks dalam file Python.

Pertama, aplikasi Anda menyediakan Claude dengan alat editor teks dan prompt untuk memperbaiki kesalahan sintaks:

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
Contoh Claude Sonnet 3.7 mengikuti format yang sama dengan contoh Claude 4 di atas, menggunakan panggilan alat dan respons yang sama tetapi dengan jenis alat `text_editor_20250124` dan nama `str_replace_editor`.
</Note>
</Tab>
</Tabs>

***

## Implementasikan alat editor teks

Alat editor teks diimplementasikan sebagai alat tanpa skema. Saat menggunakan alat ini, Anda tidak perlu memberikan skema input seperti dengan alat lainnya; skema dibangun ke dalam model Claude dan tidak dapat dimodifikasi.

Jenis alat tergantung pada versi model:
- **Claude 4**: `type: "text_editor_20250728"`
- **Claude Sonnet 3.7**: `type: "text_editor_20250124"`

<Steps>
  <Step title="Inisialisasi implementasi editor Anda">
    Buat fungsi pembantu untuk menangani operasi file seperti membaca, menulis, dan memodifikasi file. Pertimbangkan untuk mengimplementasikan fungsionalitas cadangan untuk memulihkan dari kesalahan.
  </Step>
  <Step title="Tangani panggilan alat editor">
    Buat fungsi yang memproses panggilan alat dari Claude berdasarkan jenis perintah:
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
  <Step title="Implementasikan langkah-langkah keamanan">
    Tambahkan validasi dan pemeriksaan keamanan:
    - Validasi jalur file untuk mencegah traversal direktori
    - Buat cadangan sebelum membuat perubahan
    - Tangani kesalahan dengan baik
    - Implementasikan pemeriksaan izin
  </Step>
  <Step title="Proses respons Claude">
    Ekstrak dan tangani panggilan alat dari respons Claude:
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
Saat mengimplementasikan alat editor teks, perhatikan hal berikut:

1. **Keamanan**: Alat ini memiliki akses ke sistem file lokal Anda, jadi implementasikan langkah-langkah keamanan yang tepat.
2. **Cadangan**: Selalu buat cadangan sebelum memungkinkan pengeditan file penting.
3. **Validasi**: Validasi semua input untuk mencegah perubahan yang tidak diinginkan.
4. **Pencocokan unik**: Pastikan penggantian cocok dengan tepat satu lokasi untuk menghindari pengeditan yang tidak diinginkan.
</Warning>

### Tangani kesalahan

Saat menggunakan alat editor teks, berbagai kesalahan dapat terjadi. Berikut adalah panduan tentang cara menanganinya:

<section title="File tidak ditemukan">

Jika Claude mencoba melihat atau memodifikasi file yang tidak ada, kembalikan pesan kesalahan yang sesuai dalam `tool_result`:

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

<section title="Beberapa kecocokan untuk penggantian">

Jika perintah `str_replace` Claude cocok dengan beberapa lokasi dalam file, kembalikan pesan kesalahan yang sesuai:

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

<section title="Tidak ada kecocokan untuk penggantian">

Jika perintah `str_replace` Claude tidak cocok dengan teks apa pun dalam file, kembalikan pesan kesalahan yang sesuai:

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

<section title="Kesalahan izin">

Jika ada masalah izin dengan membuat, membaca, atau memodifikasi file, kembalikan pesan kesalahan yang sesuai:

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

### Ikuti praktik terbaik implementasi

<section title="Berikan konteks yang jelas">

Saat meminta Claude untuk memperbaiki atau memodifikasi kode, spesifik tentang file mana yang perlu diperiksa atau masalah apa yang perlu ditangani. Konteks yang jelas membantu Claude mengidentifikasi file yang tepat dan membuat perubahan yang sesuai.

**Prompt yang kurang membantu**: "Bisakah Anda memperbaiki kode saya?"

**Prompt yang lebih baik**: "Ada kesalahan sintaks dalam file primes.py saya yang mencegahnya berjalan. Bisakah Anda memperbaikinya?"

</section>

<section title="Jadilah eksplisit tentang jalur file">

Tentukan jalur file dengan jelas saat diperlukan, terutama jika Anda bekerja dengan beberapa file atau file di direktori berbeda.

**Prompt yang kurang membantu**: "Tinjau file pembantu saya"

**Prompt yang lebih baik**: "Bisakah Anda memeriksa file utils/helpers.py saya untuk masalah kinerja apa pun?"

</section>

<section title="Buat cadangan sebelum mengedit">

Implementasikan sistem cadangan dalam aplikasi Anda yang membuat salinan file sebelum memungkinkan Claude mengeditnya, terutama untuk kode penting atau produksi.

```python
def backup_file(file_path):
    """Create a backup of a file before editing."""
    backup_path = f"{file_path}.backup"
    if os.path.exists(file_path):
        with open(file_path, 'r') as src, open(backup_path, 'w') as dst:
            dst.write(src.read())
```

</section>

<section title="Tangani penggantian teks unik dengan hati-hati">

Perintah `str_replace` memerlukan kecocokan tepat untuk teks yang akan diganti. Aplikasi Anda harus memastikan bahwa ada tepat satu kecocokan untuk teks lama atau memberikan pesan kesalahan yang sesuai.
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

<section title="Verifikasi perubahan">

Setelah Claude membuat perubahan pada file, verifikasi perubahan dengan menjalankan tes atau memeriksa bahwa kode masih berfungsi seperti yang diharapkan.
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

## Harga dan penggunaan token

The text editor tool uses the same pricing structure as other tools used with Claude. It follows the standard input and output token pricing based on the Claude model you're using.

In addition to the base tokens, the following additional input tokens are needed for the text editor tool:

| Tool | Additional input tokens |
| ----------------------------------------- | --------------------------------------- |
| `text_editor_20250429` (Claude 4.x) | 700 tokens |
| `text_editor_20250124` (Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations))) | 700 tokens |

Untuk informasi lebih detail tentang harga alat, lihat [Harga penggunaan alat](/docs/id/agents-and-tools/tool-use/overview#pricing).

## Integrasikan alat editor teks dengan alat lainnya

Alat editor teks dapat digunakan bersama dengan alat Claude lainnya. Saat menggabungkan alat, pastikan Anda:
- Cocokkan versi alat dengan model yang Anda gunakan
- Pertimbangkan penggunaan token tambahan untuk semua alat yang disertakan dalam permintaan Anda

## Catatan perubahan

| Tanggal | Versi | Perubahan |
| ---- | ------- | ------- |
| 28 Juli 2025 | `text_editor_20250728` | Rilis alat editor teks yang diperbarui yang memperbaiki beberapa masalah dan menambahkan parameter `max_characters` opsional. Sebaliknya identik dengan `text_editor_20250429`. |
| 29 April 2025 | `text_editor_20250429` | Rilis alat editor teks untuk Claude 4. Versi ini menghapus perintah `undo_edit` tetapi mempertahankan semua kemampuan lainnya. Nama alat telah diperbarui untuk mencerminkan arsitektur berbasis str_replace-nya. |
| 13 Maret 2025 | `text_editor_20250124` | Pengenalan dokumentasi alat editor teks mandiri. Versi ini dioptimalkan untuk Claude Sonnet 3.7 tetapi memiliki kemampuan identik dengan versi sebelumnya. |
| 22 Oktober 2024 | `text_editor_20241022` | Rilis awal alat editor teks dengan Claude Sonnet 3.5 ([pensiun](/docs/id/about-claude/model-deprecations)). Menyediakan kemampuan untuk melihat, membuat, dan mengedit file melalui perintah `view`, `create`, `str_replace`, `insert`, dan `undo_edit`. |

## Langkah berikutnya

Berikut adalah beberapa ide tentang cara menggunakan alat editor teks dengan cara yang lebih nyaman dan kuat:

- **Integrasikan dengan alur kerja pengembangan Anda**: Bangun alat editor teks ke dalam alat pengembangan atau IDE Anda
- **Buat sistem tinjauan kode**: Biarkan Claude meninjau kode Anda dan membuat perbaikan
- **Bangun asisten debugging**: Buat sistem di mana Claude dapat membantu Anda mendiagnosis dan memperbaiki masalah dalam kode Anda
- **Implementasikan konversi format file**: Biarkan Claude membantu Anda mengonversi file dari satu format ke format lain
- **Otomatisasi dokumentasi**: Siapkan alur kerja untuk Claude secara otomatis mendokumentasikan kode Anda

Saat Anda membangun aplikasi dengan alat editor teks, kami bersemangat melihat bagaimana Anda memanfaatkan kemampuan Claude untuk meningkatkan alur kerja pengembangan dan produktivitas Anda.

<CardGroup cols={3}>
  <Card
    title="Gambaran umum penggunaan alat"
    icon="wrench"
    href="/docs/id/agents-and-tools/tool-use/overview"
  >
    Pelajari cara mengimplementasikan alur kerja alat untuk digunakan dengan Claude.
  </Card>

  <Card
    title="Alat Bash"
    icon="terminal"
    href="/docs/id/agents-and-tools/tool-use/bash-tool"
  >
    Jalankan perintah shell dengan Claude.
  </Card>
</CardGroup>