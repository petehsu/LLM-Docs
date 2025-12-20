# Cara mengimplementasikan penggunaan alat

Panduan lengkap untuk mengimplementasikan penggunaan alat dengan Claude, termasuk definisi alat, contoh, dan praktik terbaik.

---

## Memilih model

Kami merekomendasikan menggunakan Claude Sonnet (4.5) atau Claude Opus (4.1) terbaru untuk alat kompleks dan kueri yang ambigu; mereka menangani beberapa alat dengan lebih baik dan mencari klarifikasi saat diperlukan.

Gunakan model Claude Haiku untuk alat yang sederhana, tetapi perhatikan bahwa mereka mungkin menyimpulkan parameter yang hilang.

<Tip>
Jika menggunakan Claude dengan penggunaan alat dan pemikiran yang diperluas, lihat panduan kami [di sini](/docs/id/build-with-claude/extended-thinking) untuk informasi lebih lanjut.
</Tip>

## Menentukan alat klien

Alat klien (baik yang ditentukan Anthropic maupun yang ditentukan pengguna) ditentukan dalam parameter tingkat atas `tools` dari permintaan API. Setiap definisi alat mencakup:

| Parameter      | Deskripsi                                                                                         |
| :------------- | :-------------------------------------------------------------------------------------------------- |
| `name`         | Nama alat. Harus cocok dengan regex `^[a-zA-Z0-9_-]{1,64}$`.                                 |
| `description`  | Deskripsi plaintext terperinci tentang apa yang dilakukan alat, kapan harus digunakan, dan bagaimana perilakunya. |
| `input_schema` | Objek [JSON Schema](https://json-schema.org/) yang mendefinisikan parameter yang diharapkan untuk alat.     |
| `input_examples` | (Opsional, beta) Larik objek input contoh untuk membantu Claude memahami cara menggunakan alat. Lihat [Memberikan contoh penggunaan alat](#providing-tool-use-examples). |

<section title="Contoh definisi alat sederhana">

```json JSON
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
```

Alat ini, bernama `get_weather`, mengharapkan objek input dengan string `location` yang diperlukan dan string `unit` opsional yang harus berupa "celsius" atau "fahrenheit".

</section>

### Prompt sistem penggunaan alat

Ketika Anda memanggil Claude API dengan parameter `tools`, kami membuat prompt sistem khusus dari definisi alat, konfigurasi alat, dan prompt sistem yang ditentukan pengguna. Prompt yang dibangun dirancang untuk menginstruksikan model menggunakan alat yang ditentukan dan memberikan konteks yang diperlukan agar alat beroperasi dengan baik:

```
In this environment you have access to a set of tools you can use to answer the user's question.
{{ FORMATTING INSTRUCTIONS }}
String and scalar parameters should be specified as is, while lists and objects should use JSON format. Note that spaces for string values are not stripped. The output is not expected to be valid XML and is parsed with regular expressions.
Here are the functions available in JSONSchema format:
{{ TOOL DEFINITIONS IN JSON SCHEMA }}
{{ USER SYSTEM PROMPT }}
{{ TOOL CONFIGURATION }}
```

### Praktik terbaik untuk definisi alat

Untuk mendapatkan kinerja terbaik dari Claude saat menggunakan alat, ikuti panduan ini:

- **Berikan deskripsi yang sangat terperinci.** Ini adalah faktor paling penting dalam kinerja alat. Deskripsi Anda harus menjelaskan setiap detail tentang alat, termasuk:
  - Apa yang dilakukan alat
  - Kapan harus digunakan (dan kapan tidak boleh digunakan)
  - Apa arti setiap parameter dan bagaimana pengaruhnya terhadap perilaku alat
  - Peringatan atau batasan penting apa pun, seperti informasi apa yang tidak dikembalikan alat jika nama alat tidak jelas. Semakin banyak konteks yang dapat Anda berikan Claude tentang alat Anda, semakin baik dalam memutuskan kapan dan bagaimana menggunakannya. Targetkan setidaknya 3-4 kalimat per deskripsi alat, lebih banyak jika alat kompleks.
- **Prioritaskan deskripsi, tetapi pertimbangkan menggunakan `input_examples` untuk alat kompleks.** Deskripsi yang jelas paling penting, tetapi untuk alat dengan input kompleks, objek bersarang, atau parameter sensitif format, Anda dapat menggunakan bidang `input_examples` (beta) untuk memberikan contoh yang divalidasi skema. Lihat [Memberikan contoh penggunaan alat](#providing-tool-use-examples) untuk detail.

<section title="Contoh deskripsi alat yang baik">

```json JSON
{
  "name": "get_stock_price",
  "description": "Retrieves the current stock price for a given ticker symbol. The ticker symbol must be a valid symbol for a publicly traded company on a major US stock exchange like NYSE or NASDAQ. The tool will return the latest trade price in USD. It should be used when the user asks about the current or most recent price of a specific stock. It will not provide any other information about the stock or company.",
  "input_schema": {
    "type": "object",
    "properties": {
      "ticker": {
        "type": "string",
        "description": "The stock ticker symbol, e.g. AAPL for Apple Inc."
      }
    },
    "required": ["ticker"]
  }
}
```

</section>

<section title="Contoh deskripsi alat yang buruk">

```json JSON
{
  "name": "get_stock_price",
  "description": "Gets the stock price for a ticker.",
  "input_schema": {
    "type": "object",
    "properties": {
      "ticker": {
        "type": "string"
      }
    },
    "required": ["ticker"]
  }
}
```

</section>

Deskripsi yang baik dengan jelas menjelaskan apa yang dilakukan alat, kapan menggunakannya, data apa yang dikembalikan, dan apa arti parameter `ticker`. Deskripsi yang buruk terlalu singkat dan meninggalkan Claude dengan banyak pertanyaan terbuka tentang perilaku dan penggunaan alat.

## Memberikan contoh penggunaan alat

Anda dapat memberikan contoh konkret dari input alat yang valid untuk membantu Claude memahami cara menggunakan alat Anda dengan lebih efektif. Ini sangat berguna untuk alat kompleks dengan objek bersarang, parameter opsional, atau input sensitif format.

<Info>
Contoh penggunaan alat adalah fitur beta. Sertakan [header beta](/docs/id/api/beta-headers) yang sesuai untuk penyedia Anda:

| Penyedia | Header beta | Model yang didukung |
|----------|-------------|------------------|
| Claude API,<br/>Microsoft Foundry | `advanced-tool-use-2025-11-20` | Semua model |
| Vertex AI,<br/>Amazon Bedrock | `tool-examples-2025-10-29` | Claude Opus 4.5 saja |
</Info>

### Penggunaan dasar

Tambahkan bidang `input_examples` opsional ke definisi alat Anda dengan larik objek input contoh. Setiap contoh harus valid sesuai dengan `input_schema` alat:

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    betas=["advanced-tool-use-2025-11-20"],
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
                        "description": "The unit of temperature"
                    }
                },
                "required": ["location"]
            },
            "input_examples": [
                {
                    "location": "San Francisco, CA",
                    "unit": "fahrenheit"
                },
                {
                    "location": "Tokyo, Japan",
                    "unit": "celsius"
                },
                {
                    "location": "New York, NY"  # 'unit' is optional
                }
            ]
        }
    ],
    messages=[
        {"role": "user", "content": "What's the weather like in San Francisco?"}
    ]
)
```

```typescript TypeScript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const response = await client.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  betas: ["advanced-tool-use-2025-11-20"],
  tools: [
    {
      name: "get_weather",
      description: "Get the current weather in a given location",
      input_schema: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "The city and state, e.g. San Francisco, CA",
          },
          unit: {
            type: "string",
            enum: ["celsius", "fahrenheit"],
            description: "The unit of temperature",
          },
        },
        required: ["location"],
      },
      input_examples: [
        {
          location: "San Francisco, CA",
          unit: "fahrenheit",
        },
        {
          location: "Tokyo, Japan",
          unit: "celsius",
        },
        {
          location: "New York, NY",
          // Demonstrates that 'unit' is optional
        },
      ],
    },
  ],
  messages: [{ role: "user", content: "What's the weather like in San Francisco?" }],
});
```
</CodeGroup>

Contoh disertakan dalam prompt bersama skema alat Anda, menunjukkan Claude pola konkret untuk panggilan alat yang terbentuk dengan baik. Ini membantu Claude memahami kapan harus menyertakan parameter opsional, format apa yang harus digunakan, dan cara menyusun input kompleks.

### Persyaratan dan batasan

- **Validasi skema** - Setiap contoh harus valid sesuai dengan `input_schema` alat. Contoh yang tidak valid mengembalikan kesalahan 400
- **Tidak didukung untuk alat sisi server** - Hanya alat yang ditentukan pengguna yang dapat memiliki contoh input
- **Biaya token** - Contoh menambah token prompt: ~20-50 token untuk contoh sederhana, ~100-200 token untuk objek bersarang kompleks

## Pelari alat (beta)

Pelari alat menyediakan solusi siap pakai untuk menjalankan alat dengan Claude. Alih-alih menangani panggilan alat, hasil alat, dan manajemen percakapan secara manual, pelari alat secara otomatis:

- Menjalankan alat ketika Claude memanggilnya
- Menangani siklus permintaan/respons
- Mengelola status percakapan
- Menyediakan keamanan tipe dan validasi

Kami merekomendasikan agar Anda menggunakan pelari alat untuk sebagian besar implementasi penggunaan alat.

<Note>
Pelari alat saat ini dalam beta dan tersedia di SDK [Python](https://github.com/anthropics/anthropic-sdk-python/blob/main/tools.md), [TypeScript](https://github.com/anthropics/anthropic-sdk-typescript/blob/main/helpers.md#tool-helpers), dan [Ruby](https://github.com/anthropics/anthropic-sdk-ruby/blob/main/helpers.md#3-auto-looping-tool-runner-beta).
</Note>

<Tip>
**Manajemen konteks otomatis dengan pemadatan**

Pelari alat mendukung [pemadatan](/docs/id/build-with-claude/context-editing#client-side-compaction-sdk) otomatis, yang menghasilkan ringkasan ketika penggunaan token melebihi ambang batas. Ini memungkinkan tugas agentic jangka panjang untuk melanjutkan melampaui batas jendela konteks.
</Tip>

<Tabs>
<Tab title="Python">

### Penggunaan dasar

Gunakan dekorator `@beta_tool` untuk mendefinisikan alat dan `client.beta.messages.tool_runner()` untuk menjalankannya.

<Note>
Jika Anda menggunakan klien async, ganti `@beta_tool` dengan `@beta_async_tool` dan tentukan fungsi dengan `async def`.
</Note>

```python
import anthropic
import json
from anthropic import beta_tool

# Initialize client
client = anthropic.Anthropic()

# Define tools using the decorator
@beta_tool
def get_weather(location: str, unit: str = "fahrenheit") -> str:
    """Get the current weather in a given location.

    Args:
        location: The city and state, e.g. San Francisco, CA
        unit: Temperature unit, either 'celsius' or 'fahrenheit'
    """
    # In a full implementation, you'd call a weather API here
    return json.dumps({"temperature": "20°C", "condition": "Sunny"})

@beta_tool
def calculate_sum(a: int, b: int) -> str:
    """Add two numbers together.

    Args:
        a: First number
        b: Second number
    """
    return str(a + b)

# Use the tool runner
runner = client.beta.messages.tool_runner(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[get_weather, calculate_sum],
    messages=[
        {"role": "user", "content": "What's the weather like in Paris? Also, what's 15 + 27?"}
    ]
)
for message in runner:
    print(message.content[0].text)
```

Fungsi yang didekorasi harus mengembalikan blok konten atau larik blok konten, termasuk teks, gambar, atau blok dokumen. Ini memungkinkan alat mengembalikan respons kaya multimodal. String yang dikembalikan akan dikonversi ke blok konten teks.
Jika Anda ingin mengembalikan objek JSON terstruktur ke Claude, enkode ke string JSON sebelum mengembalikannya. Angka, boolean, atau primitif non-string lainnya juga harus dikonversi ke string.

Dekorator `@beta_tool` akan memeriksa argumen fungsi dan docstring untuk mengekstrak representasi skema json dari fungsi yang diberikan, dalam contoh di atas `calculate_sum` akan diubah menjadi:

```json
{
  "name": "calculate_sum",
  "description": "Adds two integers together.",
  "input_schema": {
    "additionalProperties": false,
    "properties": {
      "left": {
        "description": "The first integer to add.",
        "title": "Left",
        "type": "integer"
      },
      "right": {
        "description": "The second integer to add.",
        "title": "Right",
        "type": "integer"
      }
    },
    "required": ["left", "right"],
    "type": "object"
  }
}
```

### Iterasi di atas pelari alat

Pelari alat yang dikembalikan oleh `tool_runner()` dapat diiterasi, yang dapat Anda iterasi dengan loop `for`. Ini sering disebut sebagai "loop panggilan alat".
Setiap iterasi loop menghasilkan pesan yang dikembalikan oleh Claude.

Setelah kode Anda memiliki kesempatan untuk memproses pesan saat ini di dalam loop, pelari alat akan memeriksa pesan untuk melihat apakah Claude meminta penggunaan alat. Jika demikian, itu akan memanggil alat dan mengirim hasil alat kembali ke Claude secara otomatis, kemudian menghasilkan pesan berikutnya dari Claude untuk memulai iterasi berikutnya dari loop Anda.

Anda dapat mengakhiri loop pada iterasi apa pun dengan pernyataan `break` sederhana. Pelari alat akan terus berulang sampai Claude mengembalikan pesan tanpa penggunaan alat.

Jika Anda tidak peduli dengan pesan perantara, alih-alih menggunakan loop, Anda dapat memanggil metode `until_done()`, yang akan mengembalikan pesan terakhir dari Claude:

```python
runner = client.beta.messages.tool_runner(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[get_weather, calculate_sum],
    messages=[
        {"role": "user", "content": "What's the weather like in Paris? Also, what's 15 + 27?"}
    ]
)
final_message = runner.until_done()
print(final_message.content[0].text)
```

### Penggunaan lanjutan

Dalam loop, Anda memiliki kemampuan untuk sepenuhnya menyesuaikan permintaan berikutnya dari pelari alat ke Messages API.
Metode `runner.generate_tool_call_response()` akan memanggil alat (jika Claude memicu penggunaan alat) dan memberi Anda akses ke hasil alat yang akan dikirim kembali ke Messages API.
Metode `runner.set_messages_params()` dan `runner.append_messages()` memungkinkan Anda memodifikasi parameter untuk permintaan Messages API berikutnya.

```python
runner = client.beta.messages.tool_runner(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[get_weather],
    messages=[{"role": "user", "content": "What's the weather in San Francisco?"}]
)
for message in runner:
    # Get the tool response that will be sent
    tool_response = runner.generate_tool_call_response()

    # Customize the next request
    runner.set_messages_params(lambda params: {
        **params,
        "max_tokens": 2048  # Increase tokens for next request
    })

    # Or add additional messages
    runner.append_messages(
        {"role": "user", "content": "Please be concise in your response."}
    )
```

### Streaming

Saat mengaktifkan streaming dengan `stream=True`, setiap nilai yang dipancarkan oleh pelari alat adalah `BetaMessageStream` seperti yang dikembalikan dari `anthropic.messages.stream()`. `BetaMessageStream` itu sendiri adalah iterable yang menghasilkan peristiwa streaming dari Messages API.

Anda dapat menggunakan `message_stream.get_final_message()` untuk membiarkan SDK melakukan akumulasi peristiwa streaming menjadi pesan terakhir untuk Anda.

```python
runner = client.beta.messages.tool_runner(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[calculate_sum],
    messages=[{"role": "user", "content": "What is 15 + 27?"}],
    stream=True
)

# When streaming, the runner returns BetaMessageStream
for message_stream in runner:
    for event in message_stream:
        print('event:', event)
    print('message:', message_stream.get_final_message())

print(runner.until_done())
```

</Tab>
<Tab title="TypeScript (Zod)">

### Penggunaan dasar

Gunakan `betaZodTool()` untuk definisi alat yang aman tipe dengan validasi Zod (memerlukan Zod 3.25.0 atau lebih tinggi).

```typescript
import { Anthropic } from '@anthropic-ai/sdk';
import { betaZodTool, betaTool } from '@anthropic-ai/sdk/helpers/beta/zod';
import { z } from 'zod';

const anthropic = new Anthropic();

// Using betaZodTool (requires Zod 3.25.0+)
const getWeatherTool = betaZodTool({
  name: 'get_weather',
  description: 'Get the current weather in a given location',
  inputSchema: z.object({
    location: z.string().describe('The city and state, e.g. San Francisco, CA'),
    unit: z.enum(['celsius', 'fahrenheit']).default('fahrenheit')
      .describe('Temperature unit')
  }),
  run: async (input) => {
    // In a full implementation, you'd call a weather API here
    return JSON.stringify({temperature: '20°C', condition: 'Sunny'});
  }
});

// Use the tool runner
const runner = anthropic.beta.messages.toolRunner({
  model: 'claude-sonnet-4-5',
  max_tokens: 1024,
  tools: [getWeatherTool],
  messages: [
    {
      role: 'user',
      content: "What's the weather like in Paris?"
    }
  ]
});

// Process messages as they come in
for await (const message of runner) {
  console.log(message.content[0].text);
}
```

Fungsi `run` harus mengembalikan blok konten atau larik blok konten, termasuk teks, gambar, atau blok dokumen. Ini memungkinkan alat mengembalikan respons kaya multimodal. String yang dikembalikan akan dikonversi ke blok konten teks.
Jika Anda ingin mengembalikan objek JSON terstruktur ke Claude, stringify ke string JSON sebelum mengembalikannya. Angka, boolean, atau primitif non-string lainnya juga harus dikonversi ke string.

### Iterasi di atas pelari alat

Pelari alat yang dikembalikan oleh `toolRunner()` adalah async iterable, yang dapat Anda iterasi dengan loop `for await ... of`. Ini sering disebut sebagai "loop panggilan alat".
Setiap iterasi loop menghasilkan pesan yang dikembalikan oleh Claude.

Setelah kode Anda memiliki kesempatan untuk memproses pesan saat ini di dalam loop, pelari alat akan memeriksa pesan untuk melihat apakah Claude meminta penggunaan alat. Jika demikian, itu akan memanggil alat dan mengirim hasil alat kembali ke Claude secara otomatis, kemudian menghasilkan pesan berikutnya dari Claude untuk memulai iterasi berikutnya dari loop Anda.

Anda dapat mengakhiri loop pada iterasi apa pun dengan pernyataan `break` sederhana. Pelari alat akan terus berulang sampai Claude mengembalikan pesan tanpa penggunaan alat.

Jika Anda tidak peduli dengan pesan perantara, alih-alih menggunakan loop, Anda dapat `await` pelari alat, yang akan mengembalikan pesan terakhir dari Claude.

### Penggunaan lanjutan

Dalam loop, Anda memiliki kemampuan untuk sepenuhnya menyesuaikan permintaan berikutnya dari pelari alat ke Messages API.
Metode `runner.generateToolResponse()` akan memanggil alat (jika Claude memicu penggunaan alat) dan memberi Anda akses ke hasil alat yang akan dikirim kembali ke Messages API.
Metode `runner.setMessagesParams()` dan `runner.pushMessages()` memungkinkan Anda memodifikasi parameter untuk permintaan Messages API berikutnya. Parameter saat ini tersedia di bawah `runner.params`.

```typescript
const runner = anthropic.beta.messages.toolRunner({
  model: 'claude-sonnet-4-5',
  max_tokens: 1024,
  tools: [getWeatherTool],
  messages: [
    { role: 'user', content: "What's the weather in San Francisco?" }
  ]
});

for await (const message of runner) {
  // Get the tool response that will be sent
  const toolResponse = await runner.generateToolResponse();

  // Customize the next request
  runner.setMessagesParams(params => ({
    ...params,
    max_tokens: 2048  // Increase tokens for next request
  }));

  // Or add additional messages
  runner.pushMessages(
    { role: 'user', content: 'Please be concise in your response.' }
  );
}
```

### Streaming

Saat mengaktifkan streaming dengan `stream: true`, setiap nilai yang dipancarkan oleh pelari alat adalah `MessageStream` seperti yang dikembalikan dari `anthropic.messages.stream()`. `MessageStream` itu sendiri adalah async iterable yang menghasilkan peristiwa streaming dari Messages API.

Anda dapat menggunakan `messageStream.finalMessage()` untuk membiarkan SDK melakukan akumulasi peristiwa streaming menjadi pesan terakhir untuk Anda.

```typescript
const runner = anthropic.beta.messages.toolRunner({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 1000,
  messages: [{ role: 'user', content: 'What is the weather in San Francisco?' }],
  tools: [calculatorTool],
  stream: true,
});

// When streaming, the runner returns BetaMessageStream
for await (const messageStream of runner) {
  for await (const event of messageStream) {
    console.log('event:', event);
  }
  console.log('message:', await messageStream.finalMessage());
}

console.log(await runner);
```

</Tab>
<Tab title="TypeScript (JSON Schema)">

### Penggunaan dasar

Gunakan `betaTool()` untuk definisi alat yang aman tipe berdasarkan skema JSON. TypeScript dan editor Anda akan menyadari tipe parameter `input` untuk penyelesaian otomatis.

<Note>
Input yang dihasilkan oleh Claude tidak akan divalidasi saat runtime. Lakukan validasi di dalam fungsi `run` jika diperlukan.
</Note>

```typescript
import { Anthropic } from '@anthropic-ai/sdk';
import { betaZodTool, betaTool } from '@anthropic-ai/sdk/helpers/beta/json-schema';
import { z } from 'zod';

const anthropic = new Anthropic();

// Using betaTool with JSON schema (no Zod required)
const calculateSumTool = betaTool({
  name: 'calculate_sum',
  description: 'Add two numbers together',
  inputSchema: {
    type: 'object',
    properties: {
      a: { type: 'number', description: 'First number' },
      b: { type: 'number', description: 'Second number' }
    },
    required: ['a', 'b']
  },
  run: async (input) => {
    return String(input.a + input.b);
  }
});

// Use the tool runner
const runner = anthropic.beta.messages.toolRunner({
  model: 'claude-sonnet-4-5',
  max_tokens: 1024,
  tools: [getWeatherTool, calculateSumTool],
  messages: [
    {
      role: 'user',
      content: "What's 15 + 27?"
    }
  ]
});

// Process messages as they come in
for await (const message of runner) {
  console.log(message.content[0].text);
}
```

Fungsi `run` harus mengembalikan blok konten apa pun atau larik blok konten, termasuk teks, gambar, atau blok dokumen. Ini memungkinkan alat mengembalikan respons kaya multimodal. String yang dikembalikan akan dikonversi ke blok konten teks.
Jika Anda ingin mengembalikan objek JSON terstruktur ke Claude, enkode ke string JSON sebelum mengembalikannya. Angka, boolean, atau primitif non-string lainnya juga harus dikonversi ke string.

### Iterasi di atas pelari alat

Pelari alat yang dikembalikan oleh `toolRunner()` adalah async iterable, yang dapat Anda iterasi dengan loop `for await ... of`. Ini sering disebut sebagai "loop panggilan alat".
Setiap iterasi loop menghasilkan pesan yang dikembalikan oleh Claude.

Setelah kode Anda memiliki kesempatan untuk memproses pesan saat ini di dalam loop, pelari alat akan memeriksa pesan untuk melihat apakah Claude meminta penggunaan alat. Jika demikian, itu akan memanggil alat dan mengirim hasil alat kembali ke Claude secara otomatis, kemudian menghasilkan pesan berikutnya dari Claude untuk memulai iterasi berikutnya dari loop Anda.

Anda dapat mengakhiri loop pada iterasi apa pun dengan pernyataan `break` sederhana. Pelari alat akan terus berulang sampai Claude mengembalikan pesan tanpa penggunaan alat.

Jika Anda tidak peduli dengan pesan perantara, alih-alih menggunakan loop, Anda dapat `await` pelari alat, yang akan mengembalikan pesan terakhir dari Claude.

### Penggunaan lanjutan

Dalam loop, Anda memiliki kemampuan untuk sepenuhnya menyesuaikan permintaan berikutnya dari pelari alat ke Messages API.
Metode `runner.generateToolResponse()` akan memanggil alat (jika Claude memicu penggunaan alat) dan memberi Anda akses ke hasil alat yang akan dikirim kembali ke Messages API.
Metode `runner.setMessagesParams()` dan `runner.pushMessages()` memungkinkan Anda memodifikasi parameter untuk permintaan Messages API berikutnya. Parameter saat ini tersedia di bawah `runner.params`.

```typescript
const runner = anthropic.beta.messages.toolRunner({
  model: 'claude-sonnet-4-5',
  max_tokens: 1024,
  tools: [getWeatherTool],
  messages: [
    { role: 'user', content: "What's the weather in San Francisco?" }
  ]
});

for await (const message of runner) {
  // Get the tool response that will be sent
  const toolResponse = await runner.generateToolResponse();

  // Customize the next request
  runner.setMessagesParams(params => ({
    ...params,
    max_tokens: 2048  // Increase tokens for next request
  }));

  // Or add additional messages
  runner.pushMessages(
    { role: 'user', content: 'Please be concise in your response.' }
  );
}
```

### Streaming

Saat mengaktifkan streaming dengan `stream: true`, setiap nilai yang dipancarkan oleh pelari alat adalah `MessageStream` seperti yang dikembalikan dari `anthropic.messages.stream()`. `MessageStream` itu sendiri adalah async iterable yang menghasilkan peristiwa streaming dari Messages API.

Anda dapat menggunakan `messageStream.finalMessage()` untuk membiarkan SDK melakukan akumulasi peristiwa streaming menjadi pesan terakhir untuk Anda.

```typescript
const runner = anthropic.beta.messages.toolRunner({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 1000,
  messages: [{ role: 'user', content: 'What is the weather in San Francisco?' }],
  tools: [calculatorTool],
  stream: true,
});

// When streaming, the runner returns BetaMessageStream
for await (const messageStream of runner) {
  for await (const event of messageStream) {
    console.log('event:', event);
  }
  console.log('message:', await messageStream.finalMessage());
}

console.log(await runner);
```

</Tab>
<Tab title="Ruby">

### Penggunaan dasar

Tentukan alat menggunakan `Anthropic::BaseTool` dengan skema input, kemudian gunakan `client.beta.messages.tool_runner` untuk menjalankannya.

```ruby
require "anthropic"

# Initialize client
client = Anthropic::Client.new

# Define input schema
class GetWeatherInput < Anthropic::BaseModel
  required :location, String, doc: "The city and state, e.g. San Francisco, CA"
  optional :unit, Anthropic::InputSchema::EnumOf["celsius", "fahrenheit"],
           doc: "Temperature unit"
end

# Define tool
class GetWeather < Anthropic::BaseTool
  doc "Get the current weather in a given location"
  input_schema GetWeatherInput

  def call(input)
    # In a full implementation, you'd call a weather API here
    JSON.generate({temperature: "20°C", condition: "Sunny"})
  end
end

class CalculateSumInput < Anthropic::BaseModel
  required :a, Integer, doc: "First number"
  required :b, Integer, doc: "Second number"
end

class CalculateSum < Anthropic::BaseTool
  doc "Add two numbers together"
  input_schema CalculateSumInput

  def call(input)
    (input.a + input.b).to_s
  end
end

# Use the tool runner
runner = client.beta.messages.tool_runner(
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: [GetWeather.new, CalculateSum.new],
  messages: [
    {role: "user", content: "What's the weather like in Paris? Also, what's 15 + 27?"}
  ]
)

runner.each_message do |message|
  message.content.each do |block|
    puts block.text if block.respond_to?(:text)
  end
end
```

Metode `call` harus mengembalikan string atau larik blok konten. Jika Anda ingin mengembalikan objek JSON terstruktur ke Claude, enkode ke string JSON sebelum mengembalikannya.

Kelas `Anthropic::BaseTool` menggunakan metode `doc` untuk deskripsi alat dan `input_schema` untuk mendefinisikan parameter yang diharapkan. SDK akan secara otomatis mengonversi ini ke format skema JSON yang sesuai.

### Iterasi di atas pelari alat

Pelari alat menyediakan metode `each_message` yang menghasilkan setiap pesan saat percakapan berlangsung. Ini sering disebut sebagai "loop panggilan alat".

Setelah kode Anda memiliki kesempatan untuk memproses pesan saat ini, pelari alat akan memeriksa apakah Claude meminta penggunaan alat. Jika demikian, itu akan memanggil alat dan mengirim hasil alat kembali ke Claude secara otomatis, kemudian menghasilkan pesan berikutnya.

Jika Anda tidak peduli dengan pesan perantara, Anda dapat menggunakan metode `run_until_finished` untuk mendapatkan semua pesan sekaligus:

```ruby
runner = client.beta.messages.tool_runner(
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: [GetWeather.new, CalculateSum.new],
  messages: [
    {role: "user", content: "What's the weather like in Paris? Also, what's 15 + 27?"}
  ]
)

all_messages = runner.run_until_finished
all_messages.each { |msg| puts msg.content }
```

### Penggunaan lanjutan

Pelari alat menyediakan beberapa metode untuk menyesuaikan perilaku:

- `#next_message` - Langkah manual melalui percakapan satu pesan pada satu waktu
- `#feed_messages` - Injeksi pesan tambahan di tengah percakapan
- `#params` - Akses atau modifikasi parameter permintaan saat ini

```ruby
runner = client.beta.messages.tool_runner(
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: [GetWeather.new],
  messages: [{role: "user", content: "What's the weather in San Francisco?"}]
)

# Manual step-by-step control
message = runner.next_message
puts message.content

# Inject follow-up messages
runner.feed_messages([
  {role: "user", content: "Also check Boston"}
])

# Access current parameters
puts runner.params
```

### Streaming

Saat menggunakan streaming, iterasi dengan `each_streaming` untuk menerima peristiwa real-time:

```ruby
runner = client.beta.messages.tool_runner(
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: [CalculateSum.new],
  messages: [{role: "user", content: "What is 15 + 27?"}]
)

runner.each_streaming do |event|
  case event
  when Anthropic::Streaming::TextEvent
    print event.text
  when Anthropic::Streaming::ToolUseEvent
    puts "\nTool called: #{event.tool_name}"
  end
end
```

</Tab>
</Tabs>

<Note>
Pelari alat SDK dalam beta. Sisa dokumen ini mencakup implementasi alat manual.
</Note>

## Mengontrol output Claude

### Memaksa penggunaan alat

Dalam beberapa kasus, Anda mungkin ingin Claude menggunakan alat tertentu untuk menjawab pertanyaan pengguna, bahkan jika Claude berpikir dapat memberikan jawaban tanpa menggunakan alat. Anda dapat melakukan ini dengan menentukan alat dalam bidang `tool_choice` seperti ini:

```
tool_choice = {"type": "tool", "name": "get_weather"}
```

Saat bekerja dengan parameter tool_choice, kami memiliki empat opsi yang mungkin:

- `auto` memungkinkan Claude memutuskan apakah akan memanggil alat yang disediakan atau tidak. Ini adalah nilai default ketika `tools` disediakan.
- `any` memberitahu Claude bahwa itu harus menggunakan salah satu alat yang disediakan, tetapi tidak memaksa alat tertentu.
- `tool` memungkinkan kami memaksa Claude untuk selalu menggunakan alat tertentu.
- `none` mencegah Claude menggunakan alat apa pun. Ini adalah nilai default ketika tidak ada `tools` yang disediakan.

<Note>
Saat menggunakan [prompt caching](/docs/id/build-with-claude/prompt-caching#what-invalidates-the-cache), perubahan pada parameter `tool_choice` akan membatalkan blok pesan yang di-cache. Definisi alat dan prompt sistem tetap di-cache, tetapi konten pesan harus diproses ulang.
</Note>

Diagram ini mengilustrasikan cara kerja setiap opsi:

<Frame>
  ![Image](/docs/images/tool_choice.png)
</Frame>

Perhatikan bahwa ketika Anda memiliki `tool_choice` sebagai `any` atau `tool`, kami akan mengisi pesan asisten sebelumnya untuk memaksa alat digunakan. Ini berarti bahwa model tidak akan memancarkan respons bahasa alami atau penjelasan sebelum blok konten `tool_use`, bahkan jika secara eksplisit diminta untuk melakukannya.

<Note>
Saat menggunakan [pemikiran yang diperluas](/docs/id/build-with-claude/extended-thinking) dengan penggunaan alat, `tool_choice: {"type": "any"}` dan `tool_choice: {"type": "tool", "name": "..."}` tidak didukung dan akan menghasilkan kesalahan. Hanya `tool_choice: {"type": "auto"}` (default) dan `tool_choice: {"type": "none"}` yang kompatibel dengan pemikiran yang diperluas.
</Note>

Pengujian kami telah menunjukkan bahwa ini seharusnya tidak mengurangi kinerja. Jika Anda ingin model memberikan konteks bahasa alami atau penjelasan sambil tetap meminta model menggunakan alat tertentu, Anda dapat menggunakan `{"type": "auto"}` untuk `tool_choice` (default) dan menambahkan instruksi eksplisit dalam pesan `user`. Misalnya: `What's the weather like in London? Use the get_weather tool in your response.`

<Tip>
**Panggilan alat yang dijamin dengan alat ketat**

Gabungkan `tool_choice: {"type": "any"}` dengan [penggunaan alat ketat](/docs/id/build-with-claude/structured-outputs) untuk menjamin bahwa salah satu alat Anda akan dipanggil DAN input alat secara ketat mengikuti skema Anda. Atur `strict: true` pada definisi alat Anda untuk mengaktifkan validasi skema.
</Tip>

### Output JSON

Alat tidak harus berupa fungsi klien — Anda dapat menggunakan alat kapan saja Anda ingin model mengembalikan output JSON yang mengikuti skema yang disediakan. Misalnya, Anda mungkin menggunakan alat `record_summary` dengan skema tertentu. Lihat [Penggunaan alat dengan Claude](/docs/id/agents-and-tools/tool-use/overview) untuk contoh kerja lengkap.

### Respons model dengan alat

Saat menggunakan alat, Claude sering kali akan mengomentari apa yang sedang dilakukannya atau merespons secara alami kepada pengguna sebelum memanggil alat.

Misalnya, diberikan prompt "Bagaimana cuaca di San Francisco sekarang, dan jam berapa di sana?", Claude mungkin merespons dengan:

```json JSON
{
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "Saya akan membantu Anda memeriksa cuaca saat ini dan waktu di San Francisco."
    },
    {
      "type": "tool_use",
      "id": "toolu_01A09q90qw90lq917835lq9",
      "name": "get_weather",
      "input": {"location": "San Francisco, CA"}
    }
  ]
}
```

Gaya respons alami ini membantu pengguna memahami apa yang dilakukan Claude dan menciptakan interaksi yang lebih percakapan. Anda dapat memandu gaya dan konten respons ini melalui prompt sistem Anda dan dengan menyediakan `<examples>` dalam prompt Anda.

Penting untuk dicatat bahwa Claude dapat menggunakan berbagai frasa dan pendekatan saat menjelaskan tindakannya. Kode Anda harus memperlakukan respons ini seperti teks yang dihasilkan asisten lainnya, dan tidak mengandalkan konvensi pemformatan tertentu.

### Penggunaan alat paralel

Secara default, Claude dapat menggunakan beberapa alat untuk menjawab pertanyaan pengguna. Anda dapat menonaktifkan perilaku ini dengan:

- Mengatur `disable_parallel_tool_use=true` ketika tipe tool_choice adalah `auto`, yang memastikan bahwa Claude menggunakan **paling banyak satu** alat
- Mengatur `disable_parallel_tool_use=true` ketika tipe tool_choice adalah `any` atau `tool`, yang memastikan bahwa Claude menggunakan **tepat satu** alat

<section title="Contoh penggunaan alat paralel lengkap">

<Note>
**Lebih sederhana dengan Tool runner**: Contoh di bawah ini menunjukkan penanganan alat paralel manual. Untuk sebagian besar kasus penggunaan, [tool runner](#tool-runner-beta) secara otomatis menangani eksekusi alat paralel dengan kode yang jauh lebih sedikit.
</Note>

Berikut adalah contoh lengkap yang menunjukkan cara memformat dengan benar panggilan alat paralel dalam riwayat pesan:

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# Tentukan alat
tools = [
    {
        "name": "get_weather",
        "description": "Dapatkan cuaca saat ini di lokasi tertentu",
        "input_schema": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "Kota dan negara bagian, misalnya San Francisco, CA"
                }
            },
            "required": ["location"]
        }
    },
    {
        "name": "get_time",
        "description": "Dapatkan waktu saat ini di zona waktu tertentu",
        "input_schema": {
            "type": "object",
            "properties": {
                "timezone": {
                    "type": "string",
                    "description": "Zona waktu, misalnya America/New_York"
                }
            },
            "required": ["timezone"]
        }
    }
]

# Permintaan awal
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=tools,
    messages=[
        {
            "role": "user",
            "content": "Bagaimana cuaca di SF dan NYC, dan jam berapa di sana?"
        }
    ]
)

# Respons Claude dengan panggilan alat paralel
print("Claude ingin menggunakan alat:", response.stop_reason == "tool_use")
print("Jumlah panggilan alat:", len([c for c in response.content if c.type == "tool_use"]))

# Bangun percakapan dengan hasil alat
messages = [
    {
        "role": "user",
        "content": "Bagaimana cuaca di SF dan NYC, dan jam berapa di sana?"
    },
    {
        "role": "assistant",
        "content": response.content  # Berisi beberapa blok tool_use
    },
    {
        "role": "user",
        "content": [
            {
                "type": "tool_result",
                "tool_use_id": "toolu_01",  # Harus cocok dengan ID dari tool_use
                "content": "San Francisco: 68°F, sebagian berawan"
            },
            {
                "type": "tool_result",
                "tool_use_id": "toolu_02",
                "content": "New York: 45°F, langit cerah"
            },
            {
                "type": "tool_result",
                "tool_use_id": "toolu_03",
                "content": "Waktu San Francisco: 2:30 PM PST"
            },
            {
                "type": "tool_result",
                "tool_use_id": "toolu_04",
                "content": "Waktu New York: 5:30 PM EST"
            }
        ]
    }
]

# Dapatkan respons akhir
final_response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=tools,
    messages=messages
)

print(final_response.content[0].text)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

// Tentukan alat
const tools = [
  {
    name: "get_weather",
    description: "Dapatkan cuaca saat ini di lokasi tertentu",
    input_schema: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "Kota dan negara bagian, misalnya San Francisco, CA"
        }
      },
      required: ["location"]
    }
  },
  {
    name: "get_time",
    description: "Dapatkan waktu saat ini di zona waktu tertentu",
    input_schema: {
      type: "object",
      properties: {
        timezone: {
          type: "string",
          description: "Zona waktu, misalnya America/New_York"
        }
      },
      required: ["timezone"]
    }
  }
];

// Permintaan awal
const response = await anthropic.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: tools,
  messages: [
    {
      role: "user",
      content: "Bagaimana cuaca di SF dan NYC, dan jam berapa di sana?"
    }
  ]
});

// Bangun percakapan dengan hasil alat
const messages = [
  {
    role: "user",
    content: "Bagaimana cuaca di SF dan NYC, dan jam berapa di sana?"
  },
  {
    role: "assistant",
    content: response.content  // Berisi beberapa blok tool_use
  },
  {
    role: "user",
    content: [
      {
        type: "tool_result",
        tool_use_id: "toolu_01",  // Harus cocok dengan ID dari tool_use
        content: "San Francisco: 68°F, sebagian berawan"
      },
      {
        type: "tool_result",
        tool_use_id: "toolu_02",
        content: "New York: 45°F, langit cerah"
      },
      {
        type: "tool_result",
        tool_use_id: "toolu_03",
        content: "Waktu San Francisco: 2:30 PM PST"
      },
      {
        type: "tool_result",
        tool_use_id: "toolu_04",
        content: "Waktu New York: 5:30 PM EST"
      }
    ]
  }
];

// Dapatkan respons akhir
const finalResponse = await anthropic.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: tools,
  messages: messages
});

console.log(finalResponse.content[0].text);
```
</CodeGroup>

Pesan asisten dengan panggilan alat paralel akan terlihat seperti ini:

```json
{
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "Saya akan memeriksa cuaca dan waktu untuk San Francisco dan New York City."
    },
    {
      "type": "tool_use",
      "id": "toolu_01",
      "name": "get_weather",
      "input": {"location": "San Francisco, CA"}
    },
    {
      "type": "tool_use",
      "id": "toolu_02",
      "name": "get_weather",
      "input": {"location": "New York, NY"}
    },
    {
      "type": "tool_use",
      "id": "toolu_03",
      "name": "get_time",
      "input": {"timezone": "America/Los_Angeles"}
    },
    {
      "type": "tool_use",
      "id": "toolu_04",
      "name": "get_time",
      "input": {"timezone": "America/New_York"}
    }
  ]
}
```

</section>
<section title="Skrip pengujian lengkap untuk alat paralel">

Berikut adalah skrip lengkap yang dapat dijalankan untuk menguji dan memverifikasi bahwa panggilan alat paralel berfungsi dengan benar:

<CodeGroup>
```python Python
#!/usr/bin/env python3
"""Skrip pengujian untuk memverifikasi panggilan alat paralel dengan API Claude"""

import os
from anthropic import Anthropic

# Inisialisasi klien
client = Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

# Tentukan alat
tools = [
    {
        "name": "get_weather",
        "description": "Dapatkan cuaca saat ini di lokasi tertentu",
        "input_schema": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "Kota dan negara bagian, misalnya San Francisco, CA"
                }
            },
            "required": ["location"]
        }
    },
    {
        "name": "get_time",
        "description": "Dapatkan waktu saat ini di zona waktu tertentu",
        "input_schema": {
            "type": "object",
            "properties": {
                "timezone": {
                    "type": "string",
                    "description": "Zona waktu, misalnya America/New_York"
                }
            },
            "required": ["timezone"]
        }
    }
]

# Percakapan pengujian dengan panggilan alat paralel
messages = [
    {
        "role": "user",
        "content": "Bagaimana cuaca di SF dan NYC, dan jam berapa di sana?"
    }
]

# Buat permintaan awal
print("Meminta panggilan alat paralel...")
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=messages,
    tools=tools
)

# Periksa panggilan alat paralel
tool_uses = [block for block in response.content if block.type == "tool_use"]
print(f"\n✓ Claude membuat {len(tool_uses)} panggilan alat")

if len(tool_uses) > 1:
    print("✓ Panggilan alat paralel terdeteksi!")
    for tool in tool_uses:
        print(f"  - {tool.name}: {tool.input}")
else:
    print("✗ Tidak ada panggilan alat paralel yang terdeteksi")

# Simulasikan eksekusi alat dan format hasil dengan benar
tool_results = []
for tool_use in tool_uses:
    if tool_use.name == "get_weather":
        if "San Francisco" in str(tool_use.input):
            result = "San Francisco: 68°F, sebagian berawan"
        else:
            result = "New York: 45°F, langit cerah"
    else:  # get_time
        if "Los_Angeles" in str(tool_use.input):
            result = "2:30 PM PST"
        else:
            result = "5:30 PM EST"

    tool_results.append({
        "type": "tool_result",
        "tool_use_id": tool_use.id,
        "content": result
    })

# Lanjutkan percakapan dengan hasil alat
messages.extend([
    {"role": "assistant", "content": response.content},
    {"role": "user", "content": tool_results}  # Semua hasil dalam satu pesan!
])

# Dapatkan respons akhir
print("\nMendapatkan respons akhir...")
final_response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=messages,
    tools=tools
)

print(f"\nRespons Claude:\n{final_response.content[0].text}")

# Verifikasi pemformatan
print("\n--- Verifikasi ---")
print(f"✓ Hasil alat dikirim dalam pesan pengguna tunggal: {len(tool_results)} hasil")
print("✓ Tidak ada teks sebelum hasil alat dalam larik konten")
print("✓ Percakapan diformat dengan benar untuk penggunaan alat paralel di masa depan")
```

```typescript TypeScript
#!/usr/bin/env node
// Skrip pengujian untuk memverifikasi panggilan alat paralel dengan API Claude

import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Tentukan alat
const tools = [
  {
    name: "get_weather",
    description: "Dapatkan cuaca saat ini di lokasi tertentu",
    input_schema: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "Kota dan negara bagian, misalnya San Francisco, CA"
        }
      },
      required: ["location"]
    }
  },
  {
    name: "get_time",
    description: "Dapatkan waktu saat ini di zona waktu tertentu",
    input_schema: {
      type: "object",
      properties: {
        timezone: {
          type: "string",
          description: "Zona waktu, misalnya America/New_York"
        }
      },
      required: ["timezone"]
    }
  }
];

async function testParallelTools() {
  // Buat permintaan awal
  console.log("Meminta panggilan alat paralel...");
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    messages: [{
      role: "user",
      content: "Bagaimana cuaca di SF dan NYC, dan jam berapa di sana?"
    }],
    tools: tools
  });

  // Periksa panggilan alat paralel
  const toolUses = response.content.filter(block => block.type === "tool_use");
  console.log(`\n✓ Claude membuat ${toolUses.length} panggilan alat`);

  if (toolUses.length > 1) {
    console.log("✓ Panggilan alat paralel terdeteksi!");
    toolUses.forEach(tool => {
      console.log(`  - ${tool.name}: ${JSON.stringify(tool.input)}`);
    });
  } else {
    console.log("✗ Tidak ada panggilan alat paralel yang terdeteksi");
  }

  // Simulasikan eksekusi alat dan format hasil dengan benar
  const toolResults = toolUses.map(toolUse => {
    let result;
    if (toolUse.name === "get_weather") {
      result = toolUse.input.location.includes("San Francisco")
        ? "San Francisco: 68°F, sebagian berawan"
        : "New York: 45°F, langit cerah";
    } else {
      result = toolUse.input.timezone.includes("Los_Angeles")
        ? "2:30 PM PST"
        : "5:30 PM EST";
    }

    return {
      type: "tool_result",
      tool_use_id: toolUse.id,
      content: result
    };
  });

  // Dapatkan respons akhir dengan pemformatan yang benar
  console.log("\nMendapatkan respons akhir...");
  const finalResponse = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    messages: [
      { role: "user", content: "Bagaimana cuaca di SF dan NYC, dan jam berapa di sana?" },
      { role: "assistant", content: response.content },
      { role: "user", content: toolResults }  // Semua hasil dalam satu pesan!
    ],
    tools: tools
  });

  console.log(`\nRespons Claude:\n${finalResponse.content[0].text}`);

  // Verifikasi pemformatan
  console.log("\n--- Verifikasi ---");
  console.log(`✓ Hasil alat dikirim dalam pesan pengguna tunggal: ${toolResults.length} hasil`);
  console.log("✓ Tidak ada teks sebelum hasil alat dalam larik konten");
  console.log("✓ Percakapan diformat dengan benar untuk penggunaan alat paralel di masa depan");
}

testParallelTools().catch(console.error);
```
</CodeGroup>

Skrip ini mendemonstrasikan:
- Cara memformat dengan benar panggilan alat paralel dan hasil
- Cara memverifikasi bahwa panggilan paralel sedang dilakukan
- Struktur pesan yang benar yang mendorong penggunaan alat paralel di masa depan
- Kesalahan umum yang harus dihindari (seperti teks sebelum hasil alat)

Jalankan skrip ini untuk menguji implementasi Anda dan memastikan Claude membuat panggilan alat paralel secara efektif.

</section>

#### Memaksimalkan penggunaan alat paralel

Meskipun model Claude 4 memiliki kemampuan penggunaan alat paralel yang sangat baik secara default, Anda dapat meningkatkan kemungkinan eksekusi alat paralel di semua model dengan prompting yang ditargetkan:

<section title="Prompt sistem untuk penggunaan alat paralel">

Untuk model Claude 4 (Opus 4, dan Sonnet 4), tambahkan ini ke prompt sistem Anda:
```text
Untuk efisiensi maksimal, kapan pun Anda perlu melakukan beberapa operasi independen, panggil semua alat yang relevan secara bersamaan daripada secara berurutan.
```

Untuk penggunaan alat paralel yang lebih kuat (direkomendasikan jika default tidak cukup), gunakan:
```text
<use_parallel_tool_calls>
Untuk efisiensi maksimal, kapan pun Anda melakukan beberapa operasi independen, panggil semua alat yang relevan secara bersamaan daripada secara berurutan. Prioritaskan memanggil alat secara paralel kapan pun memungkinkan. Misalnya, saat membaca 3 file, jalankan 3 panggilan alat secara paralel untuk membaca ketiga file ke dalam konteks pada waktu yang sama. Saat menjalankan beberapa perintah read-only seperti `ls` atau `list_dir`, selalu jalankan semua perintah secara paralel. Lebih baik memaksimalkan panggilan alat paralel daripada menjalankan terlalu banyak alat secara berurutan.
</use_parallel_tool_calls>
```

</section>
<section title="Prompting pesan pengguna">

Anda juga dapat mendorong penggunaan alat paralel dalam pesan pengguna tertentu:

```python
# Alih-alih:
"Bagaimana cuaca di Paris? Juga periksa London."

# Gunakan:
"Periksa cuaca di Paris dan London secara bersamaan."

# Atau jadilah eksplisit:
"Silakan gunakan panggilan alat paralel untuk mendapatkan cuaca untuk Paris, London, dan Tokyo pada waktu yang sama."
```

</section>

<Warning>
**Penggunaan alat paralel dengan Claude Sonnet 3.7**

Claude Sonnet 3.7 mungkin kurang mungkin membuat panggilan alat paralel dalam respons, bahkan ketika Anda belum mengatur `disable_parallel_tool_use`. Kami merekomendasikan [meningkatkan ke model Claude 4](/docs/id/about-claude/models/migrating-to-claude-4), yang memiliki penggunaan alat yang hemat token bawaan dan pemanggilan alat paralel yang ditingkatkan.

Jika Anda masih menggunakan Claude Sonnet 3.7, Anda dapat mengaktifkan header beta `token-efficient-tools-2025-02-19` [beta header](/docs/id/api/beta-headers), yang membantu mendorong Claude untuk menggunakan alat paralel. Anda juga dapat memperkenalkan "alat batch" yang dapat bertindak sebagai meta-alat untuk membungkus invokasi ke alat lain secara bersamaan.

Lihat [contoh ini](https://github.com/anthropics/anthropic-cookbook/blob/main/tool_use/parallel_tools_claude_3_7_sonnet.ipynb) dalam cookbook kami untuk cara menggunakan solusi ini.

</Warning>

## Menangani blok konten penggunaan alat dan hasil alat

<Note>
**Lebih sederhana dengan Tool runner**: Penanganan alat manual yang dijelaskan di bagian ini secara otomatis dikelola oleh [tool runner](#tool-runner-beta). Gunakan bagian ini ketika Anda memerlukan kontrol khusus atas eksekusi alat.
</Note>

Respons Claude berbeda tergantung pada apakah menggunakan alat klien atau alat server.

### Menangani hasil dari alat klien

Respons akan memiliki `stop_reason` dari `tool_use` dan satu atau lebih blok konten `tool_use` yang mencakup:

- `id`: Pengenal unik untuk blok penggunaan alat tertentu ini. Ini akan digunakan untuk mencocokkan hasil alat nanti.
- `name`: Nama alat yang digunakan.
- `input`: Objek yang berisi input yang diteruskan ke alat, sesuai dengan `input_schema` alat.

<section title="Contoh respons API dengan blok konten `tool_use`">

```json JSON
{
  "id": "msg_01Aq9w938a90dw8q",
  "model": "claude-sonnet-4-5",
  "stop_reason": "tool_use",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "Saya akan memeriksa cuaca saat ini di San Francisco untuk Anda."
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

</section>

Ketika Anda menerima respons penggunaan alat untuk alat klien, Anda harus:

1. Ekstrak `name`, `id`, dan `input` dari blok `tool_use`.
2. Jalankan alat sebenarnya dalam codebase Anda yang sesuai dengan nama alat itu, meneruskan `input` alat.
3. Lanjutkan percakapan dengan mengirim pesan baru dengan `role` dari `user`, dan blok `content` yang berisi tipe `tool_result` dan informasi berikut:
   - `tool_use_id`: `id` dari permintaan penggunaan alat yang merupakan hasil ini.
   - `content`: Hasil alat, sebagai string (misalnya `"content": "15 derajat"`), daftar blok konten bersarang (misalnya `"content": [{"type": "text", "text": "15 derajat"}]`), atau daftar blok dokumen (misalnya `"content": ["type": "document", "source": {"type": "text", "media_type": "text/plain", "data": "15 derajat"}]`). Blok konten ini dapat menggunakan tipe `text`, `image`, atau `document`.
   - `is_error` (opsional): Atur ke `true` jika eksekusi alat menghasilkan kesalahan.

<Note>
**Persyaratan pemformatan penting**:
- Blok hasil alat harus segera mengikuti blok penggunaan alat yang sesuai dalam riwayat pesan. Anda tidak dapat menyertakan pesan apa pun antara pesan penggunaan alat asisten dan pesan hasil alat pengguna.
- Dalam pesan pengguna yang berisi hasil alat, blok tool_result harus datang PERTAMA dalam larik konten. Teks apa pun harus datang SETELAH semua hasil alat.

Misalnya, ini akan menyebabkan kesalahan 400:
```json
{"role": "user", "content": [
  {"type": "text", "text": "Berikut adalah hasilnya:"},  // ❌ Teks sebelum tool_result
  {"type": "tool_result", "tool_use_id": "toolu_01", ...}
]}
```

Ini benar:
```json
{"role": "user", "content": [
  {"type": "tool_result", "tool_use_id": "toolu_01", ...},
  {"type": "text", "text": "Apa yang harus saya lakukan selanjutnya?"}  // ✅ Teks setelah tool_result
]}
```

Jika Anda menerima kesalahan seperti "tool_use ids were found without tool_result blocks immediately after", periksa bahwa hasil alat Anda diformat dengan benar.
</Note>

<section title="Contoh hasil alat yang berhasil">

```json JSON
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "15 derajat"
    }
  ]
}
```

</section>

<section title="Contoh hasil alat dengan gambar">

```json JSON
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": [
        {"type": "text", "text": "15 derajat"},
        {
          "type": "image",
          "source": {
            "type": "base64",
            "media_type": "image/jpeg",
            "data": "/9j/4AAQSkZJRg...",
          }
        }
      ]
    }
  ]
}
```

</section>
<section title="Contoh hasil alat kosong">

```json JSON
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
    }
  ]
}
```

</section>

<section title="Contoh hasil alat dengan dokumen">

```json JSON
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": [
        {"type": "text", "text": "Cuacanya adalah"},
        {
          "type": "document",
          "source": {
            "type": "text",
            "media_type": "text/plain",
            "data": "15 derajat"
          }
        }
      ]
    }
  ]
}
```

</section>

Setelah menerima hasil alat, Claude akan menggunakan informasi itu untuk melanjutkan menghasilkan respons terhadap prompt pengguna asli.

### Menangani hasil dari alat server

Claude mengeksekusi alat secara internal dan menggabungkan hasil langsung ke dalam responsnya tanpa memerlukan interaksi pengguna tambahan.

<Tip>
  **Perbedaan dari API lain**

Tidak seperti API yang memisahkan penggunaan alat atau menggunakan peran khusus seperti `tool` atau `function`, API Claude mengintegrasikan alat langsung ke dalam struktur pesan `user` dan `assistant`.

Pesan berisi larik blok `text`, `image`, `tool_use`, dan `tool_result`. Pesan `user` mencakup konten klien dan `tool_result`, sementara pesan `assistant` berisi konten yang dihasilkan AI dan `tool_use`.

</Tip>

### Menangani alasan penghentian `max_tokens`

Jika [respons Claude terpotong karena mencapai batas `max_tokens`](/docs/id/build-with-claude/handling-stop-reasons#max-tokens), dan respons yang terpotong berisi blok penggunaan alat yang tidak lengkap, Anda perlu mencoba ulang permintaan dengan nilai `max_tokens` yang lebih tinggi untuk mendapatkan penggunaan alat lengkap.

<CodeGroup>
```python Python
# Periksa apakah respons terpotong selama penggunaan alat
if response.stop_reason == "max_tokens":
    # Periksa apakah blok konten terakhir adalah tool_use yang tidak lengkap
    last_block = response.content[-1]
    if last_block.type == "tool_use":
        # Kirim permintaan dengan max_tokens yang lebih tinggi
        response = client.messages.create(
            model="claude-sonnet-4-5",
            max_tokens=4096,  # Batas yang ditingkatkan
            messages=messages,
            tools=tools
        )
```

```typescript TypeScript
// Periksa apakah respons terpotong selama penggunaan alat
if (response.stop_reason === "max_tokens") {
  // Periksa apakah blok konten terakhir adalah tool_use yang tidak lengkap
  const lastBlock = response.content[response.content.length - 1];
  if (lastBlock.type === "tool_use") {
    // Kirim permintaan dengan max_tokens yang lebih tinggi
    response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 4096, // Batas yang ditingkatkan
      messages: messages,
      tools: tools
    });
  }
}
```
</CodeGroup>

#### Menangani alasan penghentian `pause_turn`

Saat menggunakan alat server seperti pencarian web, API dapat mengembalikan alasan penghentian `pause_turn`, menunjukkan bahwa API telah menjeda giliran yang berjalan lama.

Berikut cara menangani alasan penghentian `pause_turn`:

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# Permintaan awal dengan pencarian web
response = client.messages.create(
    model="claude-3-7-sonnet-latest",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": "Cari informasi komprehensif tentang terobosan komputasi kuantum pada tahun 2025"
        }
    ],
    tools=[{
        "type": "web_search_20250305",
        "name": "web_search",
        "max_uses": 10
    }]
)

# Periksa apakah respons memiliki alasan penghentian pause_turn
if response.stop_reason == "pause_turn":
    # Lanjutkan percakapan dengan konten yang dijeda
    messages = [
        {"role": "user", "content": "Cari informasi komprehensif tentang terobosan komputasi kuantum pada tahun 2025"},
        {"role": "assistant", "content": response.content}
    ]

    # Kirim permintaan kelanjutan
    continuation = client.messages.create(
        model="claude-3-7-sonnet-latest",
        max_tokens=1024,
        messages=messages,
        tools=[{
            "type": "web_search_20250305",
            "name": "web_search",
            "max_uses": 10
        }]
    )

    print(continuation)
else:
    print(response)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

// Permintaan awal dengan pencarian web
const response = await anthropic.messages.create({
  model: "claude-3-7-sonnet-latest",
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: "Cari informasi komprehensif tentang terobosan komputasi kuantum pada tahun 2025"
    }
  ],
  tools: [{
    type: "web_search_20250305",
    name: "web_search",
    max_uses: 10
  }]
});

// Periksa apakah respons memiliki alasan penghentian pause_turn
if (response.stop_reason === "pause_turn") {
  // Lanjutkan percakapan dengan konten yang dijeda
  const messages = [
    { role: "user", content: "Cari informasi komprehensif tentang terobosan komputasi kuantum pada tahun 2025" },
    { role: "assistant", content: response.content }
  ];

  // Kirim permintaan kelanjutan
  const continuation = await anthropic.messages.create({
    model: "claude-3-7-sonnet-latest",
    max_tokens: 1024,
    messages: messages,
    tools: [{
      type: "web_search_20250305",
      name: "web_search",
      max_uses: 10
    }]
  });

  console.log(continuation);
} else {
  console.log(response);
}
```
</CodeGroup>

Saat menangani `pause_turn`:
- **Lanjutkan percakapan**: Teruskan respons yang dijeda apa adanya dalam permintaan berikutnya untuk membiarkan Claude melanjutkan gilirannya
- **Ubah jika diperlukan**: Anda dapat secara opsional memodifikasi konten sebelum melanjutkan jika Anda ingin mengganggu atau mengalihkan percakapan
- **Pertahankan status alat**: Sertakan alat yang sama dalam permintaan kelanjutan untuk mempertahankan fungsionalitas

## Pemecahan masalah kesalahan

<Note>
**Penanganan Kesalahan Bawaan**: [Tool runner](#tool-runner-beta) menyediakan penanganan kesalahan otomatis untuk sebagian besar skenario umum. Bagian ini mencakup penanganan kesalahan manual untuk kasus penggunaan lanjutan.
</Note>

Ada beberapa jenis kesalahan berbeda yang dapat terjadi saat menggunakan alat dengan Claude:

<section title="Kesalahan eksekusi alat">

Jika alat itu sendiri melempar kesalahan selama eksekusi (misalnya kesalahan jaringan saat mengambil data cuaca), Anda dapat mengembalikan pesan kesalahan dalam `content` bersama dengan `"is_error": true`:

```json JSON
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "ConnectionError: layanan cuaca API tidak tersedia (HTTP 500)",
      "is_error": true
    }
  ]
}
```

Claude kemudian akan menggabungkan kesalahan ini ke dalam responsnya kepada pengguna, misalnya "Maaf, saya tidak dapat mengambil cuaca saat ini karena layanan cuaca API tidak tersedia. Silakan coba lagi nanti."

</section>
<section title="Nama alat tidak valid">

Jika upaya Claude menggunakan alat tidak valid (misalnya parameter yang diperlukan hilang), biasanya berarti tidak ada cukup informasi bagi Claude untuk menggunakan alat dengan benar. Taruhan terbaik Anda selama pengembangan adalah mencoba permintaan lagi dengan nilai `description` yang lebih terperinci dalam definisi alat Anda.

Namun, Anda juga dapat melanjutkan percakapan dengan `tool_result` yang menunjukkan kesalahan, dan Claude akan mencoba menggunakan alat lagi dengan informasi yang hilang diisi:

```json JSON
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Kesalahan: Parameter 'location' yang diperlukan hilang",
      "is_error": true
    }
  ]
}
```

Jika permintaan alat tidak valid atau parameter hilang, Claude akan mencoba ulang 2-3 kali dengan koreksi sebelum meminta maaf kepada pengguna.

<Tip>
Untuk menghilangkan panggilan alat yang tidak valid sepenuhnya, gunakan [penggunaan alat ketat](/docs/id/build-with-claude/structured-outputs) dengan `strict: true` pada definisi alat Anda. Ini menjamin bahwa input alat akan selalu cocok dengan skema Anda dengan tepat, mencegah parameter yang hilang dan ketidakcocokan tipe.
</Tip>

</section>
<section title="Tag \<search_quality_reflection>">

Untuk mencegah Claude mencerminkan kualitas pencarian dengan tag \<search_quality_reflection>, tambahkan "Jangan mencerminkan kualitas hasil pencarian yang dikembalikan dalam respons Anda" ke prompt Anda.

</section>
<section title="Kesalahan alat server">

Ketika alat server mengalami kesalahan (misalnya masalah jaringan dengan Pencarian Web), Claude akan menangani kesalahan ini secara transparan dan mencoba memberikan respons alternatif atau penjelasan kepada pengguna. Tidak seperti alat klien, Anda tidak perlu menangani hasil `is_error` untuk alat server.

Untuk pencarian web khususnya, kode kesalahan yang mungkin termasuk:
- `too_many_requests`: Batas laju terlampaui
- `invalid_input`: Parameter kueri pencarian tidak valid
- `max_uses_exceeded`: Penggunaan alat pencarian web maksimal terlampaui
- `query_too_long`: Kueri melebihi panjang maksimal
- `unavailable`: Kesalahan internal terjadi

</section>
<section title="Panggilan alat paralel tidak berfungsi">

Jika Claude tidak membuat panggilan alat paralel saat diharapkan, periksa masalah umum ini:

**1. Pemformatan hasil alat yang tidak benar**

Masalah paling umum adalah memformat hasil alat dengan tidak benar dalam riwayat percakapan. Ini "mengajarkan" Claude untuk menghindari panggilan paralel.

Khusus untuk penggunaan alat paralel:
- ❌ **Salah**: Mengirim pesan pengguna terpisah untuk setiap hasil alat
- ✅ **Benar**: Semua hasil alat harus dalam satu pesan pengguna

```json
// ❌ Ini mengurangi penggunaan alat paralel
[
  {"role": "assistant", "content": [tool_use_1, tool_use_2]},
  {"role": "user", "content": [tool_result_1]},
  {"role": "user", "content": [tool_result_2]}  // Pesan terpisah
]

// ✅ Ini mempertahankan penggunaan alat paralel
[
  {"role": "assistant", "content": [tool_use_1, tool_use_2]},
  {"role": "user", "content": [tool_result_1, tool_result_2]}  // Pesan tunggal
]
```

Lihat [persyaratan pemformatan umum di atas](#handling-tool-use-and-tool-result-content-blocks) untuk aturan pemformatan lainnya.

**2. Prompting yang lemah**

Prompting default mungkin tidak cukup. Gunakan bahasa yang lebih kuat:

```text
<use_parallel_tool_calls>
Untuk efisiensi maksimal, kapan pun Anda melakukan beberapa operasi independen,
panggil semua alat yang relevan secara bersamaan daripada secara berurutan.
Prioritaskan memanggil alat secara paralel kapan pun memungkinkan.
</use_parallel_tool_calls>
```

**3. Mengukur penggunaan alat paralel**

Untuk memverifikasi panggilan alat paralel berfungsi:

```python
# Hitung rata-rata alat per pesan pemanggilan alat
tool_call_messages = [msg for msg in messages if any(
    block.type == "tool_use" for block in msg.content
)]
total_tool_calls = sum(
    len([b for b in msg.content if b.type == "tool_use"])
    for msg in tool_call_messages
)
avg_tools_per_message = total_tool_calls / len(tool_call_messages)
print(f"Rata-rata alat per pesan: {avg_tools_per_message}")
# Harus > 1.0 jika panggilan paralel berfungsi
```

**4. Perilaku khusus model**

- Claude Opus 4.5, Opus 4.1, dan Sonnet 4: Unggul dalam penggunaan alat paralel dengan prompting minimal
- Claude Sonnet 3.7: Mungkin memerlukan prompting yang lebih kuat atau header beta `token-efficient-tools-2025-02-19` [beta header](/docs/id/api/beta-headers). Pertimbangkan [meningkatkan ke Claude 4](/docs/id/about-claude/models/migrating-to-claude-4).
- Claude Haiku: Kurang mungkin menggunakan alat paralel tanpa prompting eksplisit

</section>