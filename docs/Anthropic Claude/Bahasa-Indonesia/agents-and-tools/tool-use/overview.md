# Penggunaan alat dengan Claude

Claude dapat berinteraksi dengan alat dan fungsi, memungkinkan Anda memperluas kemampuan Claude untuk melakukan berbagai tugas.

---

Claude mampu berinteraksi dengan alat dan fungsi, memungkinkan Anda memperluas kemampuan Claude untuk melakukan berbagai tugas.

<Tip>
  Pelajari semua yang Anda butuhkan untuk menguasai penggunaan alat dengan Claude sebagai bagian dari [kursus](https://anthropic.skilljar.com/) baru kami! Silakan terus bagikan ide dan saran Anda menggunakan [formulir](https://forms.gle/BFnYc6iCkWoRzFgk7) ini.
</Tip>

<Tip>
**Jamin kepatuhan skema dengan penggunaan alat yang ketat**

[Structured Outputs](/docs/id/build-with-claude/structured-outputs) menyediakan validasi skema yang dijamin untuk input alat. Tambahkan `strict: true` ke definisi alat Anda untuk memastikan panggilan alat Claude selalu sesuai dengan skema Anda dengan tepat—tidak ada lagi ketidakcocokan tipe atau bidang yang hilang.

Sempurna untuk agen produksi di mana parameter alat yang tidak valid akan menyebabkan kegagalan. [Pelajari kapan menggunakan penggunaan alat yang ketat →](/docs/id/build-with-claude/structured-outputs#when-to-use-json-outputs-vs-strict-tool-use)
</Tip>

Berikut adalah contoh cara menyediakan alat ke Claude menggunakan Messages API:

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
        "name": "get_weather",
        "description": "Get the current weather in a given location",
        "input_schema": {
          "type": "object",
          "properties": {
            "location": {
              "type": "string",
              "description": "The city and state, e.g. San Francisco, CA"
            }
          },
          "required": ["location"]
        }
      }
    ],
    "messages": [
      {
        "role": "user",
        "content": "What is the weather like in San Francisco?"
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
            "name": "get_weather",
            "description": "Get the current weather in a given location",
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "The city and state, e.g. San Francisco, CA",
                    }
                },
                "required": ["location"],
            },
        }
    ],
    messages=[{"role": "user", "content": "What's the weather like in San Francisco?"}],
)
print(response)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

async function main() {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    tools: [{
      name: "get_weather",
      description: "Get the current weather in a given location",
      input_schema: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "The city and state, e.g. San Francisco, CA"
          }
        },
        required: ["location"]
      }
    }],
    messages: [{ 
      role: "user", 
      content: "Tell me the weather in San Francisco." 
    }]
  });

  console.log(response);
}

main().catch(console.error);
```

```java Java
import java.util.List;
import java.util.Map;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.JsonValue;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.Tool;
import com.anthropic.models.messages.Tool.InputSchema;

public class GetWeatherExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        InputSchema schema = InputSchema.builder()
                .properties(JsonValue.from(Map.of(
                        "location",
                        Map.of(
                                "type", "string",
                                "description", "The city and state, e.g. San Francisco, CA"))))
                .putAdditionalProperty("required", JsonValue.from(List.of("location")))
                .build();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_0)
                .maxTokens(1024)
                .addTool(Tool.builder()
                        .name("get_weather")
                        .description("Get the current weather in a given location")
                        .inputSchema(schema)
                        .build())
                .addUserMessage("What's the weather like in San Francisco?")
                .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```

</CodeGroup>

---

## Cara kerja penggunaan alat

Claude mendukung dua jenis alat:

1. **Alat klien**: Alat yang dijalankan pada sistem Anda, yang mencakup:
   - Alat khusus yang ditentukan pengguna yang Anda buat dan implementasikan
   - Alat yang ditentukan Anthropic seperti [penggunaan komputer](/docs/id/agents-and-tools/tool-use/computer-use-tool) dan [editor teks](/docs/id/agents-and-tools/tool-use/text-editor-tool) yang memerlukan implementasi klien

2. **Alat server**: Alat yang dijalankan pada server Anthropic, seperti alat [pencarian web](/docs/id/agents-and-tools/tool-use/web-search-tool) dan [pengambilan web](/docs/id/agents-and-tools/tool-use/web-fetch-tool). Alat ini harus ditentukan dalam permintaan API tetapi tidak memerlukan implementasi di pihak Anda.

<Note>
Alat yang ditentukan Anthropic menggunakan tipe yang diberi versi (misalnya, `web_search_20250305`, `text_editor_20250124`) untuk memastikan kompatibilitas di seluruh versi model.
</Note>

### Alat klien
Integrasikan alat klien dengan Claude dalam langkah-langkah berikut:

<Steps>
  <Step title="Berikan Claude dengan alat dan prompt pengguna">
    - Tentukan alat klien dengan nama, deskripsi, dan skema input dalam permintaan API Anda.
    - Sertakan prompt pengguna yang mungkin memerlukan alat ini, misalnya, "Bagaimana cuaca di San Francisco?"
  </Step>
  <Step title="Claude memutuskan untuk menggunakan alat">
    - Claude menilai apakah alat apa pun dapat membantu dengan kueri pengguna.
    - Jika ya, Claude membuat permintaan penggunaan alat yang diformat dengan benar.
    - Untuk alat klien, respons API memiliki `stop_reason` dari `tool_use`, menandakan niat Claude.
  </Step>
  <Step title="Jalankan alat dan kembalikan hasil">
    - Ekstrak nama alat dan input dari permintaan Claude
    - Jalankan kode alat pada sistem Anda
    - Kembalikan hasil dalam pesan `user` baru yang berisi blok konten `tool_result`
  </Step>
  <Step title="Claude menggunakan hasil alat untuk merumuskan respons">
    - Claude menganalisis hasil alat untuk membuat respons akhirnya terhadap prompt pengguna asli.
  </Step>
</Steps>
Catatan: Langkah 3 dan 4 bersifat opsional. Untuk beberapa alur kerja, permintaan penggunaan alat Claude (langkah 2) mungkin semua yang Anda butuhkan, tanpa mengirim hasil kembali ke Claude.

### Alat server

Alat server mengikuti alur kerja yang berbeda:

<Steps>
  <Step title="Berikan Claude dengan alat dan prompt pengguna">
    - Alat server, seperti [pencarian web](/docs/id/agents-and-tools/tool-use/web-search-tool) dan [pengambilan web](/docs/id/agents-and-tools/tool-use/web-fetch-tool), memiliki parameter mereka sendiri.
    - Sertakan prompt pengguna yang mungkin memerlukan alat ini, misalnya, "Cari berita terbaru tentang AI" atau "Analisis konten di URL ini."
  </Step>
  <Step title="Claude menjalankan alat server">
    - Claude menilai apakah alat server dapat membantu dengan kueri pengguna.
    - Jika ya, Claude menjalankan alat, dan hasilnya secara otomatis dimasukkan ke dalam respons Claude.
  </Step>
  <Step title="Claude menggunakan hasil alat server untuk merumuskan respons">
    - Claude menganalisis hasil alat server untuk membuat respons akhirnya terhadap prompt pengguna asli.
    - Tidak ada interaksi pengguna tambahan yang diperlukan untuk eksekusi alat server.
  </Step>
</Steps>

---

## Menggunakan alat MCP dengan Claude

Jika Anda membangun aplikasi yang menggunakan [Model Context Protocol (MCP)](https://modelcontextprotocol.io), Anda dapat menggunakan alat dari server MCP secara langsung dengan Messages API Claude. Definisi alat MCP menggunakan format skema yang mirip dengan format alat Claude. Anda hanya perlu mengganti nama `inputSchema` menjadi `input_schema`.

<Tip>
**Tidak ingin membangun klien MCP Anda sendiri?** Gunakan [konektor MCP](/docs/id/agents-and-tools/mcp-connector) untuk terhubung langsung ke server MCP jarak jauh dari Messages API tanpa mengimplementasikan klien.
</Tip>

### Mengonversi alat MCP ke format Claude

Ketika Anda membangun klien MCP dan memanggil `list_tools()` pada server MCP, Anda akan menerima definisi alat dengan bidang `inputSchema`. Untuk menggunakan alat ini dengan Claude, konversikan ke format Claude:

<CodeGroup>
```python Python
from mcp import ClientSession

async def get_claude_tools(mcp_session: ClientSession):
    """Convert MCP tools to Claude's tool format."""
    mcp_tools = await mcp_session.list_tools()

    claude_tools = []
    for tool in mcp_tools.tools:
        claude_tools.append({
            "name": tool.name,
            "description": tool.description or "",
            "input_schema": tool.inputSchema  # Rename inputSchema to input_schema
        })

    return claude_tools
```

```typescript TypeScript
import { Client } from "@modelcontextprotocol/sdk/client/index.js";

async function getClaudeTools(mcpClient: Client) {
  // Convert MCP tools to Claude's tool format
  const mcpTools = await mcpClient.listTools();

  return mcpTools.tools.map((tool) => ({
    name: tool.name,
    description: tool.description ?? "",
    input_schema: tool.inputSchema, // Rename inputSchema to input_schema
  }));
}
```
</CodeGroup>

Kemudian teruskan alat yang dikonversi ini ke Claude:

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()
claude_tools = await get_claude_tools(mcp_session)

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=claude_tools,
    messages=[{"role": "user", "content": "What tools do you have available?"}]
)
```

```typescript TypeScript
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();
const claudeTools = await getClaudeTools(mcpClient);

const response = await anthropic.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: claudeTools,
  messages: [{ role: "user", content: "What tools do you have available?" }],
});
```
</CodeGroup>

Ketika Claude merespons dengan blok `tool_use`, jalankan alat pada server MCP Anda menggunakan `call_tool()` dan kembalikan hasilnya ke Claude dalam blok `tool_result`.

Untuk panduan lengkap tentang membangun klien MCP, lihat [Bangun klien MCP](https://modelcontextprotocol.io/docs/develop/build-client).

---

## Contoh penggunaan alat

Berikut adalah beberapa contoh kode yang mendemonstrasikan berbagai pola dan teknik penggunaan alat. Demi singkatnya, alatnya adalah alat sederhana, dan deskripsi alatnya lebih pendek dari yang ideal untuk memastikan kinerja terbaik.

<section title="Contoh alat tunggal">

<CodeGroup>
    ```bash Shell
    curl https://api.anthropic.com/v1/messages \
         --header "x-api-key: $ANTHROPIC_API_KEY" \
         --header "anthropic-version: 2023-06-01" \
         --header "content-type: application/json" \
         --data \
    '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 1024,
        "tools": [{
            "name": "get_weather",
            "description": "Get the current weather in a given location",
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "The city and state, e.g. San Francisco, CA"
                    },
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"],
                        "description": "The unit of temperature, either \"celsius\" or \"fahrenheit\""
                    }
                },
                "required": ["location"]
            }
        }],
        "messages": [{"role": "user", "content": "What is the weather like in San Francisco?"}]
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
                "name": "get_weather",
                "description": "Get the current weather in a given location",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "location": {
                            "type": "string",
                            "description": "The city and state, e.g. San Francisco, CA"
                        },
                        "unit": {
                            "type": "string",
                            "enum": ["celsius", "fahrenheit"],
                            "description": "The unit of temperature, either \"celsius\" or \"fahrenheit\""
                        }
                    },
                    "required": ["location"]
                }
            }
        ],
        messages=[{"role": "user", "content": "What is the weather like in San Francisco?"}]
    )

    print(response)
    ```
    
    ```java Java
    import java.util.List;
    import java.util.Map;

    import com.anthropic.client.AnthropicClient;
    import com.anthropic.client.okhttp.AnthropicOkHttpClient;
    import com.anthropic.core.JsonValue;
    import com.anthropic.models.messages.Message;
    import com.anthropic.models.messages.MessageCreateParams;
    import com.anthropic.models.messages.Model;
    import com.anthropic.models.messages.Tool;
    import com.anthropic.models.messages.Tool.InputSchema;

    public class WeatherToolExample {

        public static void main(String[] args) {
            AnthropicClient client = AnthropicOkHttpClient.fromEnv();

            InputSchema schema = InputSchema.builder()
                    .properties(JsonValue.from(Map.of(
                            "location", Map.of(
                                    "type", "string",
                                    "description", "The city and state, e.g. San Francisco, CA"
                            ),
                            "unit", Map.of(
                                    "type", "string",
                                    "enum", List.of("celsius", "fahrenheit"),
                                    "description", "The unit of temperature, either \"celsius\" or \"fahrenheit\""
                            )
                    )))
                    .putAdditionalProperty("required", JsonValue.from(List.of("location")))
                    .build();

            MessageCreateParams params = MessageCreateParams.builder()
                    .model(Model.CLAUDE_OPUS_4_0)
                    .maxTokens(1024)
                    .addTool(Tool.builder()
                            .name("get_weather")
                            .description("Get the current weather in a given location")
                            .inputSchema(schema)
                            .build())
                    .addUserMessage("What is the weather like in San Francisco?")
                    .build();

            Message message = client.messages().create(params);
            System.out.println(message);
        }
    }
    ```

</CodeGroup>

Claude akan mengembalikan respons yang serupa dengan:

```json JSON
{
  "id": "msg_01Aq9w938a90dw8q",
  "model": "claude-sonnet-4-5",
  "stop_reason": "tool_use",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "I'll check the current weather in San Francisco for you."
    },
    {
      "type": "tool_use",
      "id": "toolu_01A09q90qw90lq917835lq9",
      "name": "get_weather",
      "input": {"location": "San Francisco, CA", "unit": "celsius"}
    }
  ]
}
```

Anda kemudian perlu menjalankan fungsi `get_weather` dengan input yang disediakan, dan mengembalikan hasilnya dalam pesan `user` baru:

<CodeGroup>
    ```bash Shell
    curl https://api.anthropic.com/v1/messages \
         --header "x-api-key: $ANTHROPIC_API_KEY" \
         --header "anthropic-version: 2023-06-01" \
         --header "content-type: application/json" \
         --data \
    '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 1024,
        "tools": [
            {
                "name": "get_weather",
                "description": "Get the current weather in a given location",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "location": {
                            "type": "string",
                            "description": "The city and state, e.g. San Francisco, CA"
                        },
                        "unit": {
                            "type": "string",
                            "enum": ["celsius", "fahrenheit"],
                            "description": "The unit of temperature, either \"celsius\" or \"fahrenheit\""
                        }
                    },
                    "required": ["location"]
                }
            }
        ],
        "messages": [
            {
                "role": "user",
                "content": "What is the weather like in San Francisco?"
            },
            {
                "role": "assistant",
                "content": [
                    {
                        "type": "text",
                        "text": "I'll check the current weather in San Francisco for you."
                    },
                    {
                        "type": "tool_use",
                        "id": "toolu_01A09q90qw90lq917835lq9",
                        "name": "get_weather",
                        "input": {
                            "location": "San Francisco, CA",
                            "unit": "celsius"
                        }
                    }
                ]
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "tool_result",
                        "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
                        "content": "15 degrees"
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
                "name": "get_weather",
                "description": "Get the current weather in a given location",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "location": {
                            "type": "string",
                            "description": "The city and state, e.g. San Francisco, CA"
                        },
                        "unit": {
                            "type": "string",
                            "enum": ["celsius", "fahrenheit"],
                            "description": "The unit of temperature, either 'celsius' or 'fahrenheit'"
                        }
                    },
                    "required": ["location"]
                }
            }
        ],
        messages=[
            {
                "role": "user",
                "content": "What's the weather like in San Francisco?"
            },
            {
                "role": "assistant",
                "content": [
                    {
                        "type": "text",
                        "text": "I'll check the current weather in San Francisco for you."
                    },
                    {
                        "type": "tool_use",
                        "id": "toolu_01A09q90qw90lq917835lq9",
                        "name": "get_weather",
                        "input": {"location": "San Francisco, CA", "unit": "celsius"}
                    }
                ]
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "tool_result",
                        "tool_use_id": "toolu_01A09q90qw90lq917835lq9", # from the API response
                        "content": "65 degrees" # from running your tool
                    }
                ]
            }
        ]
    )

    print(response)
    ```
    
   ```java Java
    import java.util.List;
    import java.util.Map;

    import com.anthropic.client.AnthropicClient;
    import com.anthropic.client.okhttp.AnthropicOkHttpClient;
    import com.anthropic.core.JsonValue;
    import com.anthropic.models.messages.*;
    import com.anthropic.models.messages.Tool.InputSchema;

    public class ToolConversationExample {

        public static void main(String[] args) {
            AnthropicClient client = AnthropicOkHttpClient.fromEnv();

            InputSchema schema = InputSchema.builder()
                    .properties(JsonValue.from(Map.of(
                            "location", Map.of(
                                    "type", "string",
                                    "description", "The city and state, e.g. San Francisco, CA"
                            ),
                            "unit", Map.of(
                                    "type", "string",
                                    "enum", List.of("celsius", "fahrenheit"),
                                    "description", "The unit of temperature, either \"celsius\" or \"fahrenheit\""
                            )
                    )))
                    .putAdditionalProperty("required", JsonValue.from(List.of("location")))
                    .build();

            MessageCreateParams params = MessageCreateParams.builder()
                    .model(Model.CLAUDE_OPUS_4_0)
                    .maxTokens(1024)
                    .addTool(Tool.builder()
                            .name("get_weather")
                            .description("Get the current weather in a given location")
                            .inputSchema(schema)
                            .build())
                    .addUserMessage("What is the weather like in San Francisco?")
                    .addAssistantMessageOfBlockParams(
                            List.of(
                                    ContentBlockParam.ofText(
                                            TextBlockParam.builder()
                                                    .text("I'll check the current weather in San Francisco for you.")
                                                    .build()
                                    ),
                                    ContentBlockParam.ofToolUse(
                                            ToolUseBlockParam.builder()
                                                    .id("toolu_01A09q90qw90lq917835lq9")
                                                    .name("get_weather")
                                                    .input(JsonValue.from(Map.of(
                                                            "location", "San Francisco, CA",
                                                            "unit", "celsius"
                                                    )))
                                                    .build()
                                    )
                            )
                    )
                    .addUserMessageOfBlockParams(List.of(
                            ContentBlockParam.ofToolResult(
                                    ToolResultBlockParam.builder()
                                            .toolUseId("toolu_01A09q90qw90lq917835lq9")
                                            .content("15 degrees")
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

Ini akan mencetak respons akhir Claude, menggabungkan data cuaca:

```json JSON
{
  "id": "msg_01Aq9w938a90dw8q",
  "model": "claude-sonnet-4-5",
  "stop_reason": "stop_sequence",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "The current weather in San Francisco is 15 degrees Celsius (59 degrees Fahrenheit). It's a cool day in the city by the bay!"
    }
  ]
}
```

</section>
<section title="Penggunaan alat paralel">

Claude dapat memanggil beberapa alat secara paralel dalam satu respons, yang berguna untuk tugas yang memerlukan beberapa operasi independen. Saat menggunakan alat paralel, semua blok `tool_use` disertakan dalam satu pesan asisten, dan semua blok `tool_result` yang sesuai harus disediakan dalam pesan pengguna berikutnya.

<Note>
**Penting**: Hasil alat harus diformat dengan benar untuk menghindari kesalahan API dan memastikan Claude terus menggunakan alat paralel. Lihat [panduan implementasi](/docs/id/agents-and-tools/tool-use/implement-tool-use#parallel-tool-use) kami untuk persyaratan pemformatan terperinci dan contoh kode lengkap.
</Note>

Untuk contoh komprehensif, skrip pengujian, dan praktik terbaik untuk mengimplementasikan panggilan alat paralel, lihat [bagian penggunaan alat paralel](/docs/id/agents-and-tools/tool-use/implement-tool-use#parallel-tool-use) dalam panduan implementasi kami.

</section>
<section title="Contoh alat berganda">

Anda dapat menyediakan Claude dengan beberapa alat untuk dipilih dalam satu permintaan. Berikut adalah contoh dengan alat `get_weather` dan `get_time`, bersama dengan kueri pengguna yang meminta keduanya.

<CodeGroup>
    ```bash Shell
    curl https://api.anthropic.com/v1/messages \
         --header "x-api-key: $ANTHROPIC_API_KEY" \
         --header "anthropic-version: 2023-06-01" \
         --header "content-type: application/json" \
         --data \
    '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 1024,
        "tools": [{
            "name": "get_weather",
            "description": "Get the current weather in a given location",
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "The city and state, e.g. San Francisco, CA"
                    },
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"],
                        "description": "The unit of temperature, either 'celsius' or 'fahrenheit'"
                    }
                },
                "required": ["location"]
            }
        },
        {
            "name": "get_time",
            "description": "Get the current time in a given time zone",
            "input_schema": {
                "type": "object",
                "properties": {
                    "timezone": {
                        "type": "string",
                        "description": "The IANA time zone name, e.g. America/Los_Angeles"
                    }
                },
                "required": ["timezone"]
            }
        }],
        "messages": [{
            "role": "user",
            "content": "What is the weather like right now in New York? Also what time is it there?"
        }]
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
                "name": "get_weather",
                "description": "Get the current weather in a given location",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "location": {
                            "type": "string",
                            "description": "The city and state, e.g. San Francisco, CA"
                        },
                        "unit": {
                            "type": "string",
                            "enum": ["celsius", "fahrenheit"],
                            "description": "The unit of temperature, either 'celsius' or 'fahrenheit'"
                        }
                    },
                    "required": ["location"]
                }
            },
            {
                "name": "get_time",
                "description": "Get the current time in a given time zone",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "timezone": {
                            "type": "string",
                            "description": "The IANA time zone name, e.g. America/Los_Angeles"
                        }
                    },
                    "required": ["timezone"]
                }
            }
        ],
        messages=[
            {
                "role": "user",
                "content": "What is the weather like right now in New York? Also what time is it there?"
            }
        ]
    )
    print(response)
    ```
    
    ```java Java
    import java.util.List;
    import java.util.Map;

    import com.anthropic.client.AnthropicClient;
    import com.anthropic.client.okhttp.AnthropicOkHttpClient;
    import com.anthropic.core.JsonValue;
    import com.anthropic.models.messages.Message;
    import com.anthropic.models.messages.MessageCreateParams;
    import com.anthropic.models.messages.Model;
    import com.anthropic.models.messages.Tool;
    import com.anthropic.models.messages.Tool.InputSchema;

    public class MultipleToolsExample {

        public static void main(String[] args) {
            AnthropicClient client = AnthropicOkHttpClient.fromEnv();

            // Weather tool schema
            InputSchema weatherSchema = InputSchema.builder()
                    .properties(JsonValue.from(Map.of(
                            "location", Map.of(
                                    "type", "string",
                                    "description", "The city and state, e.g. San Francisco, CA"
                            ),
                            "unit", Map.of(
                                    "type", "string",
                                    "enum", List.of("celsius", "fahrenheit"),
                                    "description", "The unit of temperature, either \"celsius\" or \"fahrenheit\""
                            )
                    )))
                    .putAdditionalProperty("required", JsonValue.from(List.of("location")))
                    .build();

            // Time tool schema
            InputSchema timeSchema = InputSchema.builder()
                    .properties(JsonValue.from(Map.of(
                            "timezone", Map.of(
                                    "type", "string",
                                    "description", "The IANA time zone name, e.g. America/Los_Angeles"
                            )
                    )))
                    .putAdditionalProperty("required", JsonValue.from(List.of("timezone")))
                    .build();

            MessageCreateParams params = MessageCreateParams.builder()
                    .model(Model.CLAUDE_OPUS_4_0)
                    .maxTokens(1024)
                    .addTool(Tool.builder()
                            .name("get_weather")
                            .description("Get the current weather in a given location")
                            .inputSchema(weatherSchema)
                            .build())
                    .addTool(Tool.builder()
                            .name("get_time")
                            .description("Get the current time in a given time zone")
                            .inputSchema(timeSchema)
                            .build())
                    .addUserMessage("What is the weather like right now in New York? Also what time is it there?")
                    .build();

            Message message = client.messages().create(params);
            System.out.println(message);
        }
    }
    ```

</CodeGroup>

Dalam hal ini, Claude mungkin:
- Menggunakan alat secara berurutan (satu per satu) — memanggil `get_weather` terlebih dahulu, kemudian `get_time` setelah menerima hasil cuaca
- Menggunakan panggilan alat paralel — mengeluarkan beberapa blok `tool_use` dalam satu respons ketika operasi independen

Ketika Claude membuat panggilan alat paralel, Anda harus mengembalikan semua hasil alat dalam satu pesan `user`, dengan setiap hasil dalam blok `tool_result` tersendiri.

</section>
<section title="Informasi yang hilang">

Jika prompt pengguna tidak menyertakan informasi yang cukup untuk mengisi semua parameter yang diperlukan untuk alat, Claude Opus jauh lebih mungkin mengenali bahwa parameter hilang dan memintanya. Claude Sonnet mungkin bertanya, terutama ketika diminta untuk berpikir sebelum mengeluarkan permintaan alat. Tetapi mungkin juga melakukan yang terbaik untuk menyimpulkan nilai yang masuk akal.

Misalnya, menggunakan alat `get_weather` di atas, jika Anda bertanya kepada Claude "What's the weather?" tanpa menentukan lokasi, Claude, khususnya Claude Sonnet, mungkin menebak tentang input alat:

```json JSON
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "get_weather",
  "input": {"location": "New York, NY", "unit": "fahrenheit"}
}
```

Perilaku ini tidak dijamin, terutama untuk prompt yang lebih ambigu dan untuk model yang kurang cerdas. Jika Claude Opus tidak memiliki konteks yang cukup untuk mengisi parameter yang diperlukan, jauh lebih mungkin merespons dengan pertanyaan klarifikasi daripada membuat panggilan alat.

</section>
<section title="Alat berurutan">

Beberapa tugas mungkin memerlukan pemanggilan beberapa alat secara berurutan, menggunakan output dari satu alat sebagai input ke alat lain. Dalam hal ini, Claude akan memanggil satu alat pada satu waktu. Jika diminta untuk memanggil alat semuanya sekaligus, Claude mungkin menebak parameter untuk alat lebih jauh ke hilir jika mereka bergantung pada hasil alat untuk alat lebih jauh ke hulu.

Berikut adalah contoh menggunakan alat `get_location` untuk mendapatkan lokasi pengguna, kemudian meneruskan lokasi itu ke alat `get_weather`:

<CodeGroup>
    ```bash Shell
    curl https://api.anthropic.com/v1/messages \
         --header "x-api-key: $ANTHROPIC_API_KEY" \
         --header "anthropic-version: 2023-06-01" \
         --header "content-type: application/json" \
         --data \
    '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 1024,
        "tools": [
            {
                "name": "get_location",
                "description": "Get the current user location based on their IP address. This tool has no parameters or arguments.",
                "input_schema": {
                    "type": "object",
                    "properties": {}
                }
            },
            {
                "name": "get_weather",
                "description": "Get the current weather in a given location",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "location": {
                            "type": "string",
                            "description": "The city and state, e.g. San Francisco, CA"
                        },
                        "unit": {
                            "type": "string",
                            "enum": ["celsius", "fahrenheit"],
                            "description": "The unit of temperature, either 'celsius' or 'fahrenheit'"
                        }
                    },
                    "required": ["location"]
                }
            }
        ],
        "messages": [{
            "role": "user",
            "content": "What is the weather like where I am?"
        }]
    }'
    ```

    ```python Python
    response = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1024,
        tools=[
            {
                "name": "get_location",
                "description": "Get the current user location based on their IP address. This tool has no parameters or arguments.",
                "input_schema": {
                    "type": "object",
                    "properties": {}
                }
            },
            {
                "name": "get_weather",
                "description": "Get the current weather in a given location",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "location": {
                            "type": "string",
                            "description": "The city and state, e.g. San Francisco, CA"
                        },
                        "unit": {
                            "type": "string",
                            "enum": ["celsius", "fahrenheit"],
                            "description": "The unit of temperature, either 'celsius' or 'fahrenheit'"
                        }
                    },
                    "required": ["location"]
                }
            }
        ],
        messages=[{
       		  "role": "user",
        	  "content": "What's the weather like where I am?"
        }]
    )
    ```
    
    ```java Java
    import java.util.List;
    import java.util.Map;

    import com.anthropic.client.AnthropicClient;
    import com.anthropic.client.okhttp.AnthropicOkHttpClient;
    import com.anthropic.core.JsonValue;
    import com.anthropic.models.messages.Message;
    import com.anthropic.models.messages.MessageCreateParams;
    import com.anthropic.models.messages.Model;
    import com.anthropic.models.messages.Tool;
    import com.anthropic.models.messages.Tool.InputSchema;

    public class EmptySchemaToolExample {

        public static void main(String[] args) {
            AnthropicClient client = AnthropicOkHttpClient.fromEnv();

            // Empty schema for location tool
            InputSchema locationSchema = InputSchema.builder()
                    .properties(JsonValue.from(Map.of()))
                    .build();

            // Weather tool schema
            InputSchema weatherSchema = InputSchema.builder()
                    .properties(JsonValue.from(Map.of(
                            "location", Map.of(
                                    "type", "string",
                                    "description", "The city and state, e.g. San Francisco, CA"
                            ),
                            "unit", Map.of(
                                    "type", "string",
                                    "enum", List.of("celsius", "fahrenheit"),
                                    "description", "The unit of temperature, either \"celsius\" or \"fahrenheit\""
                            )
                    )))
                    .putAdditionalProperty("required", JsonValue.from(List.of("location")))
                    .build();

            MessageCreateParams params = MessageCreateParams.builder()
                    .model(Model.CLAUDE_OPUS_4_0)
                    .maxTokens(1024)
                    .addTool(Tool.builder()
                            .name("get_location")
                            .description("Get the current user location based on their IP address. This tool has no parameters or arguments.")
                            .inputSchema(locationSchema)
                            .build())
                    .addTool(Tool.builder()
                            .name("get_weather")
                            .description("Get the current weather in a given location")
                            .inputSchema(weatherSchema)
                            .build())
                    .addUserMessage("What is the weather like where I am?")
                    .build();

            Message message = client.messages().create(params);
            System.out.println(message);
        }
    }
    ```

</CodeGroup>

Dalam hal ini, Claude akan terlebih dahulu memanggil alat `get_location` untuk mendapatkan lokasi pengguna. Setelah Anda mengembalikan lokasi dalam `tool_result`, Claude kemudian akan memanggil `get_weather` dengan lokasi itu untuk mendapatkan jawaban akhir.

Percakapan lengkap mungkin terlihat seperti:

| Peran      | Konten                                                                                                                                                                                                                                 |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pengguna      | What's the weather like where I am?                                                                                                                                                                                                     |
| Asisten | I'll find your current location first, then check the weather there. \[Tool use for get_location\] |
| Pengguna      | \[Tool result for get_location with matching id and result of San Francisco, CA\]                                                                                                                                                       |
| Asisten | \[Tool use for get_weather with the following input\]\{ "location": "San Francisco, CA", "unit": "fahrenheit" }                                                                                                                         |
| Pengguna      | \[Tool result for get_weather with matching id and result of "59°F (15°C), mostly cloudy"\]                                                                                                                                             |
| Asisten | Based on your current location in San Francisco, CA, the weather right now is 59°F (15°C) and mostly cloudy. It's a fairly cool and overcast day in the city. You may want to bring a light jacket if you're heading outside.           |

Contoh ini mendemonstrasikan bagaimana Claude dapat merantai beberapa panggilan alat bersama-sama untuk menjawab pertanyaan yang memerlukan pengumpulan data dari berbagai sumber. Langkah-langkah kunci adalah:

1. Claude pertama kali menyadari bahwa ia memerlukan lokasi pengguna untuk menjawab pertanyaan cuaca, jadi ia memanggil alat `get_location`.
2. Pengguna (yaitu kode klien) menjalankan fungsi `get_location` aktual dan mengembalikan hasilnya "San Francisco, CA" dalam blok `tool_result`.
3. Dengan lokasi sekarang diketahui, Claude melanjutkan untuk memanggil alat `get_weather`, meneruskan "San Francisco, CA" sebagai parameter `location` (serta parameter `unit` yang ditebak, karena `unit` bukan parameter yang diperlukan).
4. Pengguna sekali lagi menjalankan fungsi `get_weather` aktual dengan argumen yang disediakan dan mengembalikan data cuaca dalam blok `tool_result` lain.
5. Akhirnya, Claude menggabungkan data cuaca ke dalam respons bahasa alami untuk pertanyaan asli.

</section>
<section title="Penggunaan alat rantai pemikiran">

Secara default, Claude Opus diminta untuk berpikir sebelum menjawab kueri penggunaan alat untuk menentukan dengan baik apakah alat diperlukan, alat mana yang digunakan, dan parameter yang sesuai. Claude Sonnet dan Claude Haiku diminta untuk mencoba menggunakan alat sebanyak mungkin dan lebih mungkin memanggil alat yang tidak perlu atau menyimpulkan parameter yang hilang. Untuk meminta Sonnet atau Haiku menilai kueri pengguna dengan lebih baik sebelum membuat panggilan alat, prompt berikut dapat digunakan:

Prompt rantai pemikiran

`Answer the user's request using relevant tools (if they are available). Before calling a tool, do some analysis. First, think about which of the provided tools is the relevant tool to answer the user's request. Second, go through each of the required parameters of the relevant tool and determine if the user has directly provided or given enough information to infer a value. When deciding if the parameter can be inferred, carefully consider all the context to see if it supports a specific value. If all of the required parameters are present or can be reasonably inferred, proceed with the tool call. BUT, if one of the values for a required parameter is missing, DO NOT invoke the function (not even with fillers for the missing params) and instead, ask the user to provide the missing parameters. DO NOT ask for more information on optional parameters if it is not provided.
`

</section>

---

## Harga

Tool use requests are priced based on:
1. The total number of input tokens sent to the model (including in the `tools` parameter)
2. The number of output tokens generated
3. For server-side tools, additional usage-based pricing (e.g., web search charges per search performed)

Client-side tools are priced the same as any other Claude API request, while server-side tools may incur additional charges based on their specific usage.

The additional tokens from tool use come from:

- The `tools` parameter in API requests (tool names, descriptions, and schemas)
- `tool_use` content blocks in API requests and responses
- `tool_result` content blocks in API requests

When you use `tools`, we also automatically include a special system prompt for the model which enables tool use. The number of tool use tokens required for each model are listed below (excluding the additional tokens listed above). Note that the table assumes at least 1 tool is provided. If no `tools` are provided, then a tool choice of `none` uses 0 additional system prompt tokens.

| Model                    | Tool choice                                          | Tool use system prompt token count          |
|--------------------------|------------------------------------------------------|---------------------------------------------|
| Claude Opus 4.5            | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Opus 4.1            | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Opus 4            | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Sonnet 4.5          | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Sonnet 4          | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations))        | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Haiku 4.5         | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Haiku 3.5         | `auto`, `none`<hr />`any`, `tool`   | 264 tokens<hr />340 tokens |
| Claude Opus 3 ([deprecated](/docs/en/about-claude/model-deprecations))            | `auto`, `none`<hr />`any`, `tool`   | 530 tokens<hr />281 tokens |
| Claude Sonnet 3          | `auto`, `none`<hr />`any`, `tool`   | 159 tokens<hr />235 tokens |
| Claude Haiku 3           | `auto`, `none`<hr />`any`, `tool`   | 264 tokens<hr />340 tokens |

These token counts are added to your normal input and output tokens to calculate the total cost of a request.

Lihat [tabel perbandingan model](/docs/id/about-claude/models/overview#model-comparison-table) kami untuk harga per-model saat ini.

Ketika Anda mengirim prompt penggunaan alat, seperti permintaan API lainnya, respons akan menampilkan hitungan token input dan output sebagai bagian dari metrik `usage` yang dilaporkan.

---

## Langkah Berikutnya

Jelajahi repositori kami dengan contoh kode penggunaan alat yang siap diimplementasikan di cookbook kami:

<CardGroup cols={3}>
  <Card
    title="Alat Kalkulator"
    icon="calculator"
    href="https://github.com/anthropics/anthropic-cookbook/blob/main/tool_use/calculator_tool.ipynb"
  >
    Pelajari cara mengintegrasikan alat kalkulator sederhana dengan Claude untuk perhitungan numerik yang presisi.
  </Card>

{" "}
<Card
  title="Agen Layanan Pelanggan"
  icon="headset"
  href="https://github.com/anthropics/anthropic-cookbook/blob/main/tool_use/customer_service_agent.ipynb"
>
  Bangun bot layanan pelanggan yang responsif yang memanfaatkan alat klien untuk
  meningkatkan dukungan.
</Card>

  <Card
    title="Pengekstrak JSON"
    icon="code-brackets"
    href="https://github.com/anthropics/anthropic-cookbook/blob/main/tool_use/extracting_structured_json.ipynb"
  >
    Lihat bagaimana Claude dan penggunaan alat dapat mengekstrak data terstruktur dari teks tidak terstruktur.
  </Card>
</CardGroup>