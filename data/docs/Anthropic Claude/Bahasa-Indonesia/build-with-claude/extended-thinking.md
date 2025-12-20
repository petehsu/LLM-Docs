# Membangun dengan pemikiran yang diperluas

Pemikiran yang diperluas memberikan Claude kemampuan penalaran yang ditingkatkan untuk tugas-tugas kompleks, sambil memberikan tingkat transparansi yang berbeda-beda ke dalam proses pemikiran langkah demi langkah sebelum memberikan jawaban akhirnya.

---

Pemikiran yang diperluas memberikan Claude kemampuan penalaran yang ditingkatkan untuk tugas-tugas kompleks, sambil memberikan tingkat transparansi yang berbeda-beda ke dalam proses pemikiran langkah demi langkah sebelum memberikan jawaban akhirnya.

## Model yang didukung

Pemikiran yang diperluas didukung dalam model berikut:

- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Sonnet 3.7 (`claude-3-7-sonnet-20250219`) ([tidak direkomendasikan lagi](/docs/id/about-claude/model-deprecations))
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)
- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)

<Note>
Perilaku API berbeda di seluruh model Claude Sonnet 3.7 dan Claude 4, tetapi bentuk API tetap sama persis.

Untuk informasi lebih lanjut, lihat [Perbedaan dalam pemikiran di seluruh versi model](#differences-in-thinking-across-model-versions).
</Note>

## Cara kerja pemikiran yang diperluas

Ketika pemikiran yang diperluas diaktifkan, Claude membuat blok konten `thinking` di mana ia mengeluarkan penalaran internalnya. Claude menggabungkan wawasan dari penalaran ini sebelum menyusun respons akhir.

Respons API akan mencakup blok konten `thinking`, diikuti oleh blok konten `text`.

Berikut adalah contoh format respons default:

```json
{
  "content": [
    {
      "type": "thinking",
      "thinking": "Mari saya analisis ini langkah demi langkah...",
      "signature": "WaUjzkypQ2mUEVM36O2TxuC06KN8xyfbJwyem2dw3URve/op91XWHOEBLLqIOMfFG/UvLEczmEsUjavL...."
    },
    {
      "type": "text",
      "text": "Berdasarkan analisis saya..."
    }
  ]
}
```

Untuk informasi lebih lanjut tentang format respons pemikiran yang diperluas, lihat [Referensi API Pesan](/docs/id/api/messages).

## Cara menggunakan pemikiran yang diperluas

Berikut adalah contoh penggunaan pemikiran yang diperluas dalam API Pesan:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 16000,
    "thinking": {
        "type": "enabled",
        "budget_tokens": 10000
    },
    "messages": [
        {
            "role": "user",
            "content": "Apakah ada jumlah bilangan prima yang tak terbatas sehingga n mod 4 == 3?"
        }
    ]
}'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    messages=[{
        "role": "user",
        "content": "Apakah ada jumlah bilangan prima yang tak terbatas sehingga n mod 4 == 3?"
    }]
)

# Respons akan berisi blok pemikiran ringkasan dan blok teks
for block in response.content:
    if block.type == "thinking":
        print(f"\nRingkasan pemikiran: {block.thinking}")
    elif block.type == "text":
        print(f"\nRespons: {block.text}")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 16000,
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  messages: [{
    role: "user",
    content: "Apakah ada jumlah bilangan prima yang tak terbatas sehingga n mod 4 == 3?"
  }]
});

// Respons akan berisi blok pemikiran ringkasan dan blok teks
for (const block of response.content) {
  if (block.type === "thinking") {
    console.log(`\nRingkasan pemikiran: ${block.thinking}`);
  } else if (block.type === "text") {
    console.log(`\nRespons: ${block.text}`);
  }
}
```

```java Java
import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.beta.messages.*;
import com.anthropic.models.beta.messages.MessageCreateParams;
import com.anthropic.models.messages.*;

public class SimpleThinkingExample {
    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        BetaMessage response = client.beta().messages().create(
                MessageCreateParams.builder()
                        .model(Model.CLAUDE_OPUS_4_0)
                        .maxTokens(16000)
                        .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(10000).build())
                        .addUserMessage("Apakah ada jumlah bilangan prima yang tak terbatas sehingga n mod 4 == 3?")
                        .build()
        );

        System.out.println(response);
    }
}
```

</CodeGroup>

Untuk mengaktifkan pemikiran yang diperluas, tambahkan objek `thinking`, dengan parameter `type` diatur ke `enabled` dan `budget_tokens` ke anggaran token yang ditentukan untuk pemikiran yang diperluas.

Parameter `budget_tokens` menentukan jumlah maksimum token yang diizinkan Claude gunakan untuk proses penalaran internalnya. Dalam model Claude 4, batas ini berlaku untuk token pemikiran penuh, dan bukan untuk [keluaran ringkasan](#summarized-thinking). Anggaran yang lebih besar dapat meningkatkan kualitas respons dengan memungkinkan analisis yang lebih menyeluruh untuk masalah kompleks, meskipun Claude mungkin tidak menggunakan seluruh anggaran yang dialokasikan, terutama pada rentang di atas 32k.

`budget_tokens` harus diatur ke nilai yang kurang dari `max_tokens`. Namun, ketika menggunakan [pemikiran yang disisipi dengan alat](#interleaved-thinking), Anda dapat melampaui batas ini karena batas token menjadi seluruh jendela konteks Anda (200k token).

### Pemikiran ringkasan

Dengan pemikiran yang diperluas diaktifkan, API Pesan untuk model Claude 4 mengembalikan ringkasan dari proses pemikiran penuh Claude. Pemikiran ringkasan memberikan manfaat intelijen penuh dari pemikiran yang diperluas, sambil mencegah penyalahgunaan.

Berikut adalah beberapa pertimbangan penting untuk pemikiran ringkasan:

- Anda dikenakan biaya untuk token pemikiran penuh yang dihasilkan oleh permintaan asli, bukan token ringkasan.
- Jumlah token keluaran yang ditagih akan **tidak cocok** dengan jumlah token yang Anda lihat dalam respons.
- Beberapa baris pertama dari keluaran pemikiran lebih verbose, memberikan penalaran terperinci yang sangat membantu untuk tujuan rekayasa prompt.
- Saat Anthropic berusaha meningkatkan fitur pemikiran yang diperluas, perilaku ringkasan dapat berubah.
- Ringkasan mempertahankan ide-ide kunci dari proses pemikiran Claude dengan latensi tambahan minimal, memungkinkan pengalaman pengguna yang dapat dialirkan dan migrasi mudah dari Claude Sonnet 3.7 ke model Claude 4.
- Ringkasan diproses oleh model yang berbeda dari yang Anda targetkan dalam permintaan Anda. Model pemikiran tidak melihat keluaran ringkasan.

<Note>
Claude Sonnet 3.7 terus mengembalikan keluaran pemikiran penuh.

Dalam kasus langka di mana Anda memerlukan akses ke keluaran pemikiran penuh untuk model Claude 4, [hubungi tim penjualan kami](mailto:sales@anthropic.com).
</Note>

### Pemikiran streaming

Anda dapat melakukan streaming respons pemikiran yang diperluas menggunakan [server-sent events (SSE)](https://developer.mozilla.org/en-US/Web/API/Server-sent%5Fevents/Using%5Fserver-sent%5Fevents).

Ketika streaming diaktifkan untuk pemikiran yang diperluas, Anda menerima konten pemikiran melalui acara `thinking_delta`.

Untuk dokumentasi lebih lanjut tentang streaming melalui API Pesan, lihat [Pesan Streaming](/docs/id/build-with-claude/streaming).

Berikut adalah cara menangani streaming dengan pemikiran:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 16000,
    "stream": true,
    "thinking": {
        "type": "enabled",
        "budget_tokens": 10000
    },
    "messages": [
        {
            "role": "user",
            "content": "Berapa 27 * 453?"
        }
    ]
}'
```

```python Python
import anthropic

client = anthropic.Anthropic()

with client.messages.stream(
    model="claude-sonnet-4-5",
    max_tokens=16000,
    thinking={"type": "enabled", "budget_tokens": 10000},
    messages=[{"role": "user", "content": "Berapa 27 * 453?"}],
) as stream:
    thinking_started = False
    response_started = False

    for event in stream:
        if event.type == "content_block_start":
            print(f"\nMemulai blok {event.content_block.type}...")
            # Atur ulang flag untuk setiap blok baru
            thinking_started = False
            response_started = False
        elif event.type == "content_block_delta":
            if event.delta.type == "thinking_delta":
                if not thinking_started:
                    print("Pemikiran: ", end="", flush=True)
                    thinking_started = True
                print(event.delta.thinking, end="", flush=True)
            elif event.delta.type == "text_delta":
                if not response_started:
                    print("Respons: ", end="", flush=True)
                    response_started = True
                print(event.delta.text, end="", flush=True)
        elif event.type == "content_block_stop":
            print("\nBlok selesai.")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const stream = await client.messages.stream({
  model: "claude-sonnet-4-5",
  max_tokens: 16000,
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  messages: [{
    role: "user",
    content: "Berapa 27 * 453?"
  }]
});

let thinkingStarted = false;
let responseStarted = false;

for await (const event of stream) {
  if (event.type === 'content_block_start') {
    console.log(`\nMemulai blok ${event.content_block.type}...`);
    // Atur ulang flag untuk setiap blok baru
    thinkingStarted = false;
    responseStarted = false;
  } else if (event.type === 'content_block_delta') {
    if (event.delta.type === 'thinking_delta') {
      if (!thinkingStarted) {
        process.stdout.write('Pemikiran: ');
        thinkingStarted = true;
      }
      process.stdout.write(event.delta.thinking);
    } else if (event.delta.type === 'text_delta') {
      if (!responseStarted) {
        process.stdout.write('Respons: ');
        responseStarted = true;
      }
      process.stdout.write(event.delta.text);
    }
  } else if (event.type === 'content_block_stop') {
    console.log('\nBlok selesai.');
  }
}
```

```java Java
import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.http.StreamResponse;
import com.anthropic.models.beta.messages.MessageCreateParams;
import com.anthropic.models.beta.messages.BetaRawMessageStreamEvent;
import com.anthropic.models.beta.messages.BetaThinkingConfigEnabled;
import com.anthropic.models.messages.Model;

public class SimpleThinkingStreamingExample {
    private static boolean thinkingStarted = false;
    private static boolean responseStarted = false;
    
    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        MessageCreateParams createParams = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_0)
                .maxTokens(16000)
                .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(10000).build())
                .addUserMessage("Berapa 27 * 453?")
                .build();

        try (StreamResponse<BetaRawMessageStreamEvent> streamResponse =
                     client.beta().messages().createStreaming(createParams)) {
            streamResponse.stream()
                    .forEach(event -> {
                        if (event.isContentBlockStart()) {
                            System.out.printf("\nMemulai blok %s...%n",
                                    event.asContentBlockStart()._type());
                            // Atur ulang flag untuk setiap blok baru
                            thinkingStarted = false;
                            responseStarted = false;
                        } else if (event.isContentBlockDelta()) {
                            var delta = event.asContentBlockDelta().delta();
                            if (delta.isBetaThinking()) {
                                if (!thinkingStarted) {
                                    System.out.print("Pemikiran: ");
                                    thinkingStarted = true;
                                }
                                System.out.print(delta.asBetaThinking().thinking());
                                System.out.flush();
                            } else if (delta.isBetaText()) {
                                if (!responseStarted) {
                                    System.out.print("Respons: ");
                                    responseStarted = true;
                                }
                                System.out.print(delta.asBetaText().text());
                                System.out.flush();
                            }
                        } else if (event.isContentBlockStop()) {
                            System.out.println("\nBlok selesai.");
                        }
                    });
        }
    }
}
```

</CodeGroup>

<TryInConsoleButton userPrompt="Berapa 27 * 453?" thinkingBudgetTokens={16000}>
  Coba di Konsol
</TryInConsoleButton>

Contoh keluaran streaming:
```json
event: message_start
data: {"type": "message_start", "message": {"id": "msg_01...", "type": "message", "role": "assistant", "content": [], "model": "claude-sonnet-4-5", "stop_reason": null, "stop_sequence": null}}

event: content_block_start
data: {"type": "content_block_start", "index": 0, "content_block": {"type": "thinking", "thinking": ""}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "Mari saya selesaikan ini langkah demi langkah:\n\n1. Pertama pecahkan 27 * 453"}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "\n2. 453 = 400 + 50 + 3"}}

// Delta pemikiran tambahan...

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "signature_delta", "signature": "EqQBCgIYAhIM1gbcDa9GJwZA2b3hGgxBdjrkzLoky3dl1pkiMOYds..."}}

event: content_block_stop
data: {"type": "content_block_stop", "index": 0}

event: content_block_start
data: {"type": "content_block_start", "index": 1, "content_block": {"type": "text", "text": ""}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 1, "delta": {"type": "text_delta", "text": "27 * 453 = 12.231"}}

// Delta teks tambahan...

event: content_block_stop
data: {"type": "content_block_stop", "index": 1}

event: message_delta
data: {"type": "message_delta", "delta": {"stop_reason": "end_turn", "stop_sequence": null}}

event: message_stop
data: {"type": "message_stop"}
```

<Note>
Ketika menggunakan streaming dengan pemikiran diaktifkan, Anda mungkin memperhatikan bahwa teks kadang-kadang tiba dalam potongan yang lebih besar bergantian dengan pengiriman token demi token yang lebih kecil. Ini adalah perilaku yang diharapkan, terutama untuk konten pemikiran.

Sistem streaming perlu memproses konten dalam batch untuk kinerja optimal, yang dapat menghasilkan pola pengiriman "chunky" ini, dengan kemungkinan penundaan antara acara streaming. Kami terus bekerja untuk meningkatkan pengalaman ini, dengan pembaruan di masa depan berfokus pada membuat konten pemikiran mengalir lebih lancar.
</Note>

## Pemikiran yang diperluas dengan penggunaan alat

Pemikiran yang diperluas dapat digunakan bersama dengan [penggunaan alat](/docs/id/agents-and-tools/tool-use/overview), memungkinkan Claude untuk bernalar melalui pemilihan alat dan pemrosesan hasil.

Ketika menggunakan pemikiran yang diperluas dengan penggunaan alat, perhatikan batasan berikut:

1. **Batasan pilihan alat**: Penggunaan alat dengan pemikiran hanya mendukung `tool_choice: {"type": "auto"}` (default) atau `tool_choice: {"type": "none"}`. Menggunakan `tool_choice: {"type": "any"}` atau `tool_choice: {"type": "tool", "name": "..."}` akan menghasilkan kesalahan karena opsi ini memaksa penggunaan alat, yang tidak kompatibel dengan pemikiran yang diperluas.

2. **Mempertahankan blok pemikiran**: Selama penggunaan alat, Anda harus meneruskan blok `thinking` kembali ke API untuk pesan asisten terakhir. Sertakan blok yang lengkap dan tidak dimodifikasi kembali ke API untuk mempertahankan kontinuitas penalaran.

### Mengalihkan mode pemikiran dalam percakapan

Anda tidak dapat mengalihkan pemikiran di tengah giliran asisten, termasuk selama loop penggunaan alat. Seluruh giliran asisten harus beroperasi dalam mode pemikiran tunggal:

- **Jika pemikiran diaktifkan**, giliran asisten akhir harus dimulai dengan blok pemikiran.
- **Jika pemikiran dinonaktifkan**, giliran asisten akhir tidak boleh berisi blok pemikiran apa pun

Dari perspektif model, **loop penggunaan alat adalah bagian dari giliran asisten**. Giliran asisten tidak selesai sampai Claude menyelesaikan respons penuhnya, yang mungkin mencakup beberapa panggilan alat dan hasil.

Sebagai contoh, urutan ini semuanya bagian dari **giliran asisten tunggal**:
```
Pengguna: "Bagaimana cuaca di Paris?"
Asisten: [pemikiran] + [penggunaan_alat: dapatkan_cuaca]
Pengguna: [hasil_alat: "20°C, cerah"]
Asisten: [teks: "Cuaca di Paris adalah 20°C dan cerah"]
```

Meskipun ada beberapa pesan API, loop penggunaan alat secara konseptual adalah bagian dari satu respons asisten yang berkelanjutan.

#### Skenario kesalahan umum

Anda mungkin mengalami kesalahan ini:
```
Diharapkan `thinking` atau `redacted_thinking`, tetapi ditemukan `tool_use`.
Ketika `thinking` diaktifkan, pesan `assistant` akhir harus dimulai
dengan blok pemikiran (mendahului set `tool_use` dan
`tool_result` terakhir).
```

Ini biasanya terjadi ketika:
1. Anda memiliki pemikiran **dinonaktifkan** selama urutan penggunaan alat
2. Anda ingin mengaktifkan pemikiran lagi
3. Pesan asisten terakhir Anda berisi blok penggunaan alat tetapi tidak ada blok pemikiran

#### Panduan praktis

**✗ Tidak valid: Mengalihkan pemikiran segera setelah penggunaan alat**
```
Pengguna: "Bagaimana cuacanya?"
Asisten: [penggunaan_alat] (pemikiran dinonaktifkan)
Pengguna: [hasil_alat]
// Tidak dapat mengaktifkan pemikiran di sini - masih dalam giliran asisten yang sama
```

**✓ Valid: Selesaikan giliran asisten terlebih dahulu**
```
Pengguna: "Bagaimana cuacanya?"
Asisten: [penggunaan_alat] (pemikiran dinonaktifkan)
Pengguna: [hasil_alat]
Asisten: [teks: "Cerah"]
Pengguna: "Bagaimana besok?" (pemikiran dinonaktifkan)
Asisten: [pemikiran] + [teks: "..."] (pemikiran diaktifkan - giliran baru)
```

**Praktik terbaik**: Rencanakan strategi pemikiran Anda di awal setiap giliran daripada mencoba mengalihkan di tengah giliran.

<Note>
Mengalihkan mode pemikiran juga membatalkan caching prompt untuk riwayat pesan. Untuk detail lebih lanjut, lihat bagian [Pemikiran yang diperluas dengan caching prompt](#extended-thinking-with-prompt-caching).
</Note>

<section title="Contoh: Meneruskan blok pemikiran dengan hasil alat">

Berikut adalah contoh praktis yang menunjukkan cara mempertahankan blok pemikiran saat memberikan hasil alat:

<CodeGroup>
```python Python
weather_tool = {
    "name": "get_weather",
    "description": "Dapatkan cuaca saat ini untuk lokasi",
    "input_schema": {
        "type": "object",
        "properties": {
            "location": {"type": "string"}
        },
        "required": ["location"]
    }
}

# Permintaan pertama - Claude merespons dengan pemikiran dan permintaan alat
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    tools=[weather_tool],
    messages=[
        {"role": "user", "content": "Bagaimana cuaca di Paris?"}
    ]
)
```

```typescript TypeScript
const weatherTool = {
  name: "get_weather",
  description: "Dapatkan cuaca saat ini untuk lokasi",
  input_schema: {
    type: "object",
    properties: {
      location: { type: "string" }
    },
    required: ["location"]
  }
};

// Permintaan pertama - Claude merespons dengan pemikiran dan permintaan alat
const response = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 16000,
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  tools: [weatherTool],
  messages: [
    { role: "user", content: "Bagaimana cuaca di Paris?" }
  ]
});
```

```java Java
import java.util.List;
import java.util.Map;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.JsonValue;
import com.anthropic.models.beta.messages.BetaMessage;
import com.anthropic.models.beta.messages.MessageCreateParams;
import com.anthropic.models.beta.messages.BetaThinkingConfigEnabled;
import com.anthropic.models.beta.messages.BetaTool;
import com.anthropic.models.beta.messages.BetaTool.InputSchema;
import com.anthropic.models.messages.Model;

public class ThinkingWithToolsExample {
    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        InputSchema schema = InputSchema.builder()
                .properties(JsonValue.from(Map.of(
                        "location", Map.of("type", "string")
                )))
                .putAdditionalProperty("required", JsonValue.from(List.of("location")))
                .build();

        BetaTool weatherTool = BetaTool.builder()
                .name("get_weather")
                .description("Dapatkan cuaca saat ini untuk lokasi")
                .inputSchema(schema)
                .build();

        BetaMessage response = client.beta().messages().create(
                MessageCreateParams.builder()
                        .model(Model.CLAUDE_OPUS_4_0)
                        .maxTokens(16000)
                        .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(10000).build())
                        .addTool(weatherTool)
                        .addUserMessage("Bagaimana cuaca di Paris?")
                        .build()
        );

        System.out.println(response);
    }
}
```
</CodeGroup>

Respons API akan mencakup blok pemikiran, teks, dan penggunaan_alat:

```json
{
    "content": [
        {
            "type": "thinking",
            "thinking": "Pengguna ingin mengetahui cuaca saat ini di Paris. Saya memiliki akses ke fungsi `get_weather`...",
            "signature": "BDaL4VrbR2Oj0hO4XpJxT28J5TILnCrrUXoKiiNBZW9P+nr8XSj1zuZzAl4egiCCpQNvfyUuFFJP5CncdYZEQPPmLxYsNrcs...."
        },
        {
            "type": "text",
            "text": "Saya dapat membantu Anda mendapatkan informasi cuaca saat ini untuk Paris. Mari saya periksa itu untuk Anda"
        },
        {
            "type": "tool_use",
            "id": "toolu_01CswdEQBMshySk6Y9DFKrfq",
            "name": "get_weather",
            "input": {
                "location": "Paris"
            }
        }
    ]
}
```

Sekarang mari kita lanjutkan percakapan dan gunakan alat

<CodeGroup>
```python Python
# Ekstrak blok pemikiran dan blok penggunaan alat
thinking_block = next((block for block in response.content
                      if block.type == 'thinking'), None)
tool_use_block = next((block for block in response.content
                      if block.type == 'tool_use'), None)

# Panggil API cuaca aktual Anda, di sini adalah tempat panggilan API aktual Anda akan dilakukan
# mari kita pura-pura ini adalah apa yang kami dapatkan kembali
weather_data = {"temperature": 88}

# Permintaan kedua - Sertakan blok pemikiran dan hasil alat
# Tidak ada blok pemikiran baru yang akan dihasilkan dalam respons
continuation = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    tools=[weather_tool],
    messages=[
        {"role": "user", "content": "Bagaimana cuaca di Paris?"},
        # perhatikan bahwa thinking_block dilewatkan serta tool_use_block
        # jika ini tidak dilewatkan, kesalahan akan dimunculkan
        {"role": "assistant", "content": [thinking_block, tool_use_block]},
        {"role": "user", "content": [{
            "type": "tool_result",
            "tool_use_id": tool_use_block.id,
            "content": f"Suhu saat ini: {weather_data['temperature']}°F"
        }]}
    ]
)
```

```typescript TypeScript
// Ekstrak blok pemikiran dan blok penggunaan alat
const thinkingBlock = response.content.find(block =>
  block.type === 'thinking');
const toolUseBlock = response.content.find(block =>
  block.type === 'tool_use');

// Panggil API cuaca aktual Anda, di sini adalah tempat panggilan API aktual Anda akan dilakukan
// mari kita pura-pura ini adalah apa yang kami dapatkan kembali
const weatherData = { temperature: 88 };

// Permintaan kedua - Sertakan blok pemikiran dan hasil alat
// Tidak ada blok pemikiran baru yang akan dihasilkan dalam respons
const continuation = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 16000,
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  tools: [weatherTool],
  messages: [
    { role: "user", content: "Bagaimana cuaca di Paris?" },
    // perhatikan bahwa thinkingBlock dilewatkan serta toolUseBlock
    // jika ini tidak dilewatkan, kesalahan akan dimunculkan
    { role: "assistant", content: [thinkingBlock, toolUseBlock] },
    { role: "user", content: [{
      type: "tool_result",
      tool_use_id: toolUseBlock.id,
      content: `Suhu saat ini: ${weatherData.temperature}°F`
    }]}
  ]
});
```

```java Java
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.JsonValue;
import com.anthropic.models.beta.messages.*;
import com.anthropic.models.beta.messages.BetaTool.InputSchema;
import com.anthropic.models.messages.Model;

public class ThinkingToolsResultExample {
    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        InputSchema schema = InputSchema.builder()
                .properties(JsonValue.from(Map.of(
                        "location", Map.of("type", "string")
                )))
                .putAdditionalProperty("required", JsonValue.from(List.of("location")))
                .build();

        BetaTool weatherTool = BetaTool.builder()
                .name("get_weather")
                .description("Dapatkan cuaca saat ini untuk lokasi")
                .inputSchema(schema)
                .build();

        BetaMessage response = client.beta().messages().create(
                MessageCreateParams.builder()
                        .model(Model.CLAUDE_OPUS_4_0)
                        .maxTokens(16000)
                        .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(10000).build())
                        .addTool(weatherTool)
                        .addUserMessage("Bagaimana cuaca di Paris?")
                        .build()
        );

        // Ekstrak blok pemikiran dan blok penggunaan alat
        Optional<BetaThinkingBlock> thinkingBlockOpt = response.content().stream()
                .filter(BetaContentBlock::isThinking)
                .map(BetaContentBlock::asThinking)
                .findFirst();

        Optional<BetaToolUseBlock> toolUseBlockOpt = response.content().stream()
                .filter(BetaContentBlock::isToolUse)
                .map(BetaContentBlock::asToolUse)
                .findFirst();

        if (thinkingBlockOpt.isPresent() && toolUseBlockOpt.isPresent()) {
            BetaThinkingBlock thinkingBlock = thinkingBlockOpt.get();
            BetaToolUseBlock toolUseBlock = toolUseBlockOpt.get();

            // Panggil API cuaca aktual Anda, di sini adalah tempat panggilan API aktual Anda akan dilakukan
            // mari kita pura-pura ini adalah apa yang kami dapatkan kembali
            Map<String, Object> weatherData = Map.of("temperature", 88);

            // Permintaan kedua - Sertakan blok pemikiran dan hasil alat
            // Tidak ada blok pemikiran baru yang akan dihasilkan dalam respons
            BetaMessage continuation = client.beta().messages().create(
                    MessageCreateParams.builder()
                            .model(Model.CLAUDE_OPUS_4_0)
                            .maxTokens(16000)
                            .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(10000).build())
                            .addTool(weatherTool)
                            .addUserMessage("Bagaimana cuaca di Paris?")
                            .addAssistantMessageOfBetaContentBlockParams(
                                    // perhatikan bahwa thinkingBlock dilewatkan serta toolUseBlock
                                    // jika ini tidak dilewatkan, kesalahan akan dimunculkan
                                    List.of(
                                            BetaContentBlockParam.ofThinking(thinkingBlock.toParam()),
                                            BetaContentBlockParam.ofToolUse(toolUseBlock.toParam())
                                    )
                            )
                            .addUserMessageOfBetaContentBlockParams(List.of(
                                    BetaContentBlockParam.ofToolResult(
                                            BetaToolResultBlockParam.builder()
                                                    .toolUseId(toolUseBlock.id())
                                                    .content(String.format("Suhu saat ini: %d°F", (Integer)weatherData.get("temperature")))
                                                    .build()
                                    )
                            ))
                            .build()
            );

            System.out.println(continuation);
        }
    }
}
```
</CodeGroup>

Respons API sekarang akan **hanya** mencakup teks

```json
{
    "content": [
        {
            "type": "text",
            "text": "Saat ini di Paris, suhu adalah 88°F (31°C)"
        }
    ]
}
```

</section>

### Mempertahankan blok pemikiran

Selama penggunaan alat, Anda harus meneruskan blok `thinking` kembali ke API, dan Anda harus menyertakan blok yang lengkap dan tidak dimodifikasi kembali ke API. Ini sangat penting untuk mempertahankan aliran penalaran model dan integritas percakapan.

<Tip>
Meskipun Anda dapat menghilangkan blok `thinking` dari giliran `assistant` sebelumnya, kami menyarankan untuk selalu meneruskan semua blok pemikiran kembali ke API untuk percakapan multi-giliran apa pun. API akan:
- Secara otomatis memfilter blok pemikiran yang disediakan
- Menggunakan blok pemikiran yang relevan yang diperlukan untuk mempertahankan penalaran model
- Hanya menagih token input untuk blok yang ditampilkan ke Claude
</Tip>

<Note>
Ketika mengalihkan mode pemikiran selama percakapan, ingat bahwa seluruh giliran asisten (termasuk loop penggunaan alat) harus beroperasi dalam mode pemikiran tunggal. Untuk detail lebih lanjut, lihat [Mengalihkan mode pemikiran dalam percakapan](#toggling-thinking-modes-in-conversations).
</Note>

Ketika Claude memanggil alat, ia menghentikan konstruksi respons untuk menunggu informasi eksternal. Ketika hasil alat dikembalikan, Claude akan melanjutkan membangun respons yang ada. Ini memerlukan pemeliharaan blok pemikiran selama penggunaan alat, untuk beberapa alasan:

1. **Kontinuitas penalaran**: Blok pemikiran menangkap penalaran langkah demi langkah Claude yang menyebabkan permintaan alat. Ketika Anda memposting hasil alat, menyertakan pemikiran asli memastikan Claude dapat melanjutkan penalarannya dari tempat ia berhenti.

2. **Pemeliharaan konteks**: Meskipun hasil alat muncul sebagai pesan pengguna dalam struktur API, mereka adalah bagian dari aliran penalaran yang berkelanjutan. Mempertahankan blok pemikiran mempertahankan aliran konseptual ini di seluruh panggilan API beberapa. Untuk informasi lebih lanjut tentang manajemen konteks, lihat [panduan kami tentang jendela konteks](/docs/id/build-with-claude/context-windows).

**Penting**: Ketika memberikan blok `thinking`, seluruh urutan blok `thinking` berturut-turut harus cocok dengan keluaran yang dihasilkan oleh model selama permintaan asli; Anda tidak dapat mengatur ulang atau memodifikasi urutan blok ini.

### Pemikiran yang tersisip

Pemikiran yang diperluas dengan penggunaan alat dalam model Claude 4 mendukung pemikiran yang tersisip, yang memungkinkan Claude untuk berpikir di antara panggilan alat dan membuat penalaran yang lebih canggih setelah menerima hasil alat.

Dengan pemikiran yang tersisip, Claude dapat:
- Bernalar tentang hasil panggilan alat sebelum memutuskan apa yang harus dilakukan selanjutnya
- Menghubungkan beberapa panggilan alat dengan langkah-langkah penalaran di antaranya
- Membuat keputusan yang lebih bernuansa berdasarkan hasil perantara

Untuk mengaktifkan pemikiran yang tersisip, tambahkan [header beta](/docs/id/api/beta-headers) `interleaved-thinking-2025-05-14` ke permintaan API Anda.

Berikut adalah beberapa pertimbangan penting untuk pemikiran yang tersisip:
- Dengan pemikiran yang tersisip, `budget_tokens` dapat melebihi parameter `max_tokens`, karena mewakili total anggaran di semua blok pemikiran dalam satu giliran asisten.
- Pemikiran yang tersisip hanya didukung untuk [alat yang digunakan melalui Messages API](/docs/id/agents-and-tools/tool-use/overview).
- Pemikiran yang tersisip didukung untuk model Claude 4 saja, dengan header beta `interleaved-thinking-2025-05-14`.
- Panggilan langsung ke Claude API memungkinkan Anda melewatkan `interleaved-thinking-2025-05-14` dalam permintaan ke model apa pun, tanpa efek.
- Di platform pihak ketiga (misalnya, [Amazon Bedrock](/docs/id/build-with-claude/claude-on-amazon-bedrock) dan [Vertex AI](/docs/id/build-with-claude/claude-on-vertex-ai)), jika Anda melewatkan `interleaved-thinking-2025-05-14` ke model apa pun selain Claude Opus 4.5, Claude Opus 4.1, Opus 4, atau Sonnet 4, permintaan Anda akan gagal.

<section title="Penggunaan alat tanpa pemikiran yang tersisip">

Tanpa pemikiran yang tersisip, Claude berpikir sekali di awal giliran asisten. Respons berikutnya setelah hasil alat berlanjut tanpa blok pemikiran baru.

```
User: "What's the total revenue if we sold 150 units at $50 each,
       and how does this compare to our average monthly revenue?"

Turn 1: [thinking] "I need to calculate 150 * $50, then check the database..."
        [tool_use: calculator] { "expression": "150 * 50" }
  ↓ tool result: "7500"

Turn 2: [tool_use: database_query] { "query": "SELECT AVG(revenue)..." }
        ↑ no thinking block
  ↓ tool result: "5200"

Turn 3: [text] "The total revenue is $7,500, which is 44% above your
        average monthly revenue of $5,200."
        ↑ no thinking block
```

</section>

<section title="Penggunaan alat dengan pemikiran yang tersisip">

Dengan pemikiran yang tersisip diaktifkan, Claude dapat berpikir setelah menerima setiap hasil alat, memungkinkannya untuk bernalar tentang hasil perantara sebelum melanjutkan.

```
User: "What's the total revenue if we sold 150 units at $50 each,
       and how does this compare to our average monthly revenue?"

Turn 1: [thinking] "I need to calculate 150 * $50 first..."
        [tool_use: calculator] { "expression": "150 * 50" }
  ↓ tool result: "7500"

Turn 2: [thinking] "Got $7,500. Now I should query the database to compare..."
        [tool_use: database_query] { "query": "SELECT AVG(revenue)..." }
        ↑ thinking after receiving calculator result
  ↓ tool result: "5200"

Turn 3: [thinking] "$7,500 vs $5,200 average - that's a 44% increase..."
        [text] "The total revenue is $7,500, which is 44% above your
        average monthly revenue of $5,200."
        ↑ thinking before final answer
```

</section>

## Pemikiran yang diperluas dengan penyimpanan prompt

[Penyimpanan prompt](/docs/id/build-with-claude/prompt-caching) dengan pemikiran memiliki beberapa pertimbangan penting:

<Tip>
Tugas pemikiran yang diperluas sering kali memakan waktu lebih dari 5 menit untuk diselesaikan. Pertimbangkan menggunakan [durasi cache 1 jam](/docs/id/build-with-claude/prompt-caching#1-hour-cache-duration) untuk mempertahankan cache hit di seluruh sesi pemikiran yang lebih lama dan alur kerja multi-langkah.
</Tip>

**Penghapusan konteks blok pemikiran**
- Blok pemikiran dari giliran sebelumnya dihapus dari konteks, yang dapat mempengaruhi titik henti cache
- Saat melanjutkan percakapan dengan penggunaan alat, blok pemikiran disimpan dalam cache dan dihitung sebagai token input saat dibaca dari cache
- Ini menciptakan pertukaran: meskipun blok pemikiran tidak mengonsumsi ruang jendela konteks secara visual, mereka tetap dihitung terhadap penggunaan token input Anda saat disimpan dalam cache
- Jika pemikiran menjadi dinonaktifkan, permintaan akan gagal jika Anda melewatkan konten pemikiran dalam giliran penggunaan alat saat ini. Dalam konteks lain, konten pemikiran yang dilewatkan ke API hanya diabaikan

**Pola invalidasi cache**
- Perubahan pada parameter pemikiran (diaktifkan/dinonaktifkan atau alokasi anggaran) membatalkan titik henti cache pesan
- [Pemikiran yang tersisip](#interleaved-thinking) memperkuat invalidasi cache, karena blok pemikiran dapat terjadi di antara beberapa [panggilan alat](#extended-thinking-with-tool-use)
- Prompt sistem dan alat tetap disimpan dalam cache meskipun ada perubahan parameter pemikiran atau penghapusan blok

<Note>
Meskipun blok pemikiran dihapus untuk penyimpanan cache dan perhitungan konteks, mereka harus dipertahankan saat melanjutkan percakapan dengan [penggunaan alat](#extended-thinking-with-tool-use), terutama dengan [pemikiran yang tersisip](#interleaved-thinking).
</Note>

### Memahami perilaku penyimpanan blok pemikiran

Saat menggunakan pemikiran yang diperluas dengan penggunaan alat, blok pemikiran menunjukkan perilaku penyimpanan cache tertentu yang mempengaruhi penghitungan token:

**Cara kerjanya:**

1. Penyimpanan cache hanya terjadi ketika Anda membuat permintaan berikutnya yang mencakup hasil alat
2. Ketika permintaan berikutnya dibuat, riwayat percakapan sebelumnya (termasuk blok pemikiran) dapat disimpan dalam cache
3. Blok pemikiran yang disimpan dalam cache ini dihitung sebagai token input dalam metrik penggunaan Anda saat dibaca dari cache
4. Ketika blok pengguna hasil non-alat disertakan, semua blok pemikiran sebelumnya diabaikan dan dihapus dari konteks

**Alur contoh terperinci:**

**Permintaan 1:**
```
User: "What's the weather in Paris?"
```
**Respons 1:**
```
[thinking_block_1] + [tool_use block 1]
```

**Permintaan 2:**
```
User: ["What's the weather in Paris?"], 
Assistant: [thinking_block_1] + [tool_use block 1], 
User: [tool_result_1, cache=True]
```
**Respons 2:**
```
[thinking_block_2] + [text block 2]
```
Permintaan 2 menulis cache dari konten permintaan (bukan respons). Cache mencakup pesan pengguna asli, blok pemikiran pertama, blok penggunaan alat, dan hasil alat.

**Permintaan 3:**
```
User: ["What's the weather in Paris?"],
Assistant: [thinking_block_1] + [tool_use block 1],
User: [tool_result_1, cache=True],
Assistant: [thinking_block_2] + [text block 2],
User: [Text response, cache=True]
```
Untuk Claude Opus 4.5 dan yang lebih baru, semua blok pemikiran sebelumnya disimpan secara default. Untuk model yang lebih lama, karena blok pengguna hasil non-alat disertakan, semua blok pemikiran sebelumnya diabaikan. Permintaan ini akan diproses sama dengan:
```
User: ["What's the weather in Paris?"],
Assistant: [tool_use block 1],
User: [tool_result_1, cache=True],
Assistant: [text block 2],
User: [Text response, cache=True]
```

**Poin kunci:**
- Perilaku penyimpanan cache ini terjadi secara otomatis, bahkan tanpa penanda `cache_control` eksplisit
- Perilaku ini konsisten apakah menggunakan pemikiran reguler atau pemikiran yang tersisip

<section title="Penyimpanan prompt sistem (dipertahankan saat pemikiran berubah)">

<CodeGroup>
```python Python
from anthropic import Anthropic
import requests
from bs4 import BeautifulSoup

client = Anthropic()

def fetch_article_content(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')

    # Remove script and style elements
    for script in soup(["script", "style"]):
        script.decompose()

    # Get text
    text = soup.get_text()

    # Break into lines and remove leading and trailing space on each
    lines = (line.strip() for line in text.splitlines())
    # Break multi-headlines into a line each
    chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
    # Drop blank lines
    text = '\n'.join(chunk for chunk in chunks if chunk)

    return text

# Fetch the content of the article
book_url = "https://www.gutenberg.org/cache/epub/1342/pg1342.txt"
book_content = fetch_article_content(book_url)
# Use just enough text for caching (first few chapters)
LARGE_TEXT = book_content[:5000]

SYSTEM_PROMPT=[
    {
        "type": "text",
        "text": "You are an AI assistant that is tasked with literary analysis. Analyze the following text carefully.",
    },
    {
        "type": "text",
        "text": LARGE_TEXT,
        "cache_control": {"type": "ephemeral"}
    }
]

MESSAGES = [
    {
        "role": "user",
        "content": "Analyze the tone of this passage."
    }
]

# First request - establish cache
print("First request - establishing cache")
response1 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=20000,
    thinking={
        "type": "enabled",
        "budget_tokens": 4000
    },
    system=SYSTEM_PROMPT,
    messages=MESSAGES
)

print(f"First response usage: {response1.usage}")

MESSAGES.append({
    "role": "assistant",
    "content": response1.content
})
MESSAGES.append({
    "role": "user",
    "content": "Analyze the characters in this passage."
})
# Second request - same thinking parameters (cache hit expected)
print("\nSecond request - same thinking parameters (cache hit expected)")
response2 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=20000,
    thinking={
        "type": "enabled",
        "budget_tokens": 4000
    },
    system=SYSTEM_PROMPT,
    messages=MESSAGES
)

print(f"Second response usage: {response2.usage}")

# Third request - different thinking parameters (cache miss for messages)
print("\nThird request - different thinking parameters (cache miss for messages)")
response3 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=20000,
    thinking={
        "type": "enabled",
        "budget_tokens": 8000  # Changed thinking budget
    },
    system=SYSTEM_PROMPT,  # System prompt remains cached
    messages=MESSAGES  # Messages cache is invalidated
)

print(f"Third response usage: {response3.usage}")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';
import axios from 'axios';
import * as cheerio from 'cheerio';

const client = new Anthropic();

async function fetchArticleContent(url: string): Promise<string> {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  
  // Remove script and style elements
  $('script, style').remove();
  
  // Get text
  let text = $.text();
  
  // Break into lines and remove leading and trailing space on each
  const lines = text.split('\n').map(line => line.trim());
  // Drop blank lines
  text = lines.filter(line => line.length > 0).join('\n');
  
  return text;
}

// Fetch the content of the article
const bookUrl = "https://www.gutenberg.org/cache/epub/1342/pg1342.txt";
const bookContent = await fetchArticleContent(bookUrl);
// Use just enough text for caching (first few chapters)
const LARGE_TEXT = bookContent.slice(0, 5000);

const SYSTEM_PROMPT = [
  {
    type: "text",
    text: "You are an AI assistant that is tasked with literary analysis. Analyze the following text carefully.",
  },
  {
    type: "text",
    text: LARGE_TEXT,
    cache_control: { type: "ephemeral" }
  }
];

const MESSAGES = [
  {
    role: "user",
    content: "Analyze the tone of this passage."
  }
];

// First request - establish cache
console.log("First request - establishing cache");
const response1 = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 20000,
  thinking: {
    type: "enabled",
    budget_tokens: 4000
  },
  system: SYSTEM_PROMPT,
  messages: MESSAGES
});

console.log(`First response usage: ${response1.usage}`);

MESSAGES.push({
  role: "assistant",
  content: response1.content
});
MESSAGES.push({
  role: "user",
  content: "Analyze the characters in this passage."
});

// Second request - same thinking parameters (cache hit expected)
console.log("\nSecond request - same thinking parameters (cache hit expected)");
const response2 = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 20000,
  thinking: {
    type: "enabled",
    budget_tokens: 4000
  },
  system: SYSTEM_PROMPT,
  messages: MESSAGES
});

console.log(`Second response usage: ${response2.usage}`);

// Third request - different thinking parameters (cache miss for messages)
console.log("\nThird request - different thinking parameters (cache miss for messages)");
const response3 = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 20000,
  thinking: {
    type: "enabled",
    budget_tokens: 8000  // Changed thinking budget
  },
  system: SYSTEM_PROMPT,  // System prompt remains cached
  messages: MESSAGES  // Messages cache is invalidated
});

console.log(`Third response usage: ${response3.usage}`);
```
</CodeGroup>

</section>
<section title="Penyimpanan pesan (dibatalkan saat pemikiran berubah)">

<CodeGroup>
```python Python
from anthropic import Anthropic
import requests
from bs4 import BeautifulSoup

client = Anthropic()

def fetch_article_content(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')

    # Remove script and style elements
    for script in soup(["script", "style"]):
        script.decompose()

    # Get text
    text = soup.get_text()

    # Break into lines and remove leading and trailing space on each
    lines = (line.strip() for line in text.splitlines())
    # Break multi-headlines into a line each
    chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
    # Drop blank lines
    text = '\n'.join(chunk for chunk in chunks if chunk)

    return text

# Fetch the content of the article
book_url = "https://www.gutenberg.org/cache/epub/1342/pg1342.txt"
book_content = fetch_article_content(book_url)
# Use just enough text for caching (first few chapters)
LARGE_TEXT = book_content[:5000]

# No system prompt - caching in messages instead
MESSAGES = [
    {
        "role": "user",
        "content": [
            {
                "type": "text",
                "text": LARGE_TEXT,
                "cache_control": {"type": "ephemeral"},
            },
            {
                "type": "text",
                "text": "Analyze the tone of this passage."
            }
        ]
    }
]

# First request - establish cache
print("First request - establishing cache")
response1 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=20000,
    thinking={
        "type": "enabled",
        "budget_tokens": 4000
    },
    messages=MESSAGES
)

print(f"First response usage: {response1.usage}")

MESSAGES.append({
    "role": "assistant",
    "content": response1.content
})
MESSAGES.append({
    "role": "user",
    "content": "Analyze the characters in this passage."
})
# Second request - same thinking parameters (cache hit expected)
print("\nSecond request - same thinking parameters (cache hit expected)")
response2 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=20000,
    thinking={
        "type": "enabled",
        "budget_tokens": 4000  # Same thinking budget
    },
    messages=MESSAGES
)

print(f"Second response usage: {response2.usage}")

MESSAGES.append({
    "role": "assistant",
    "content": response2.content
})
MESSAGES.append({
    "role": "user",
    "content": "Analyze the setting in this passage."
})

# Third request - different thinking budget (cache miss expected)
print("\nThird request - different thinking budget (cache miss expected)")
response3 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=20000,
    thinking={
        "type": "enabled",
        "budget_tokens": 8000  # Different thinking budget breaks cache
    },
    messages=MESSAGES
)

print(f"Third response usage: {response3.usage}")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';
import axios from 'axios';
import * as cheerio from 'cheerio';

const client = new Anthropic();

async function fetchArticleContent(url: string): Promise<string> {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  // Remove script and style elements
  $('script, style').remove();

  // Get text
  let text = $.text();

  // Clean up text (break into lines, remove whitespace)
  const lines = text.split('\n').map(line => line.trim());
  const chunks = lines.flatMap(line => line.split('  ').map(phrase => phrase.trim()));
  text = chunks.filter(chunk => chunk).join('\n');

  return text;
}

async function main() {
  // Fetch the content of the article
  const bookUrl = "https://www.gutenberg.org/cache/epub/1342/pg1342.txt";
  const bookContent = await fetchArticleContent(bookUrl);
  // Use just enough text for caching (first few chapters)
  const LARGE_TEXT = bookContent.substring(0, 5000);

  // No system prompt - caching in messages instead
  let MESSAGES = [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: LARGE_TEXT,
          cache_control: {type: "ephemeral"},
        },
        {
          type: "text",
          text: "Analyze the tone of this passage."
        }
      ]
    }
  ];

  // First request - establish cache
  console.log("First request - establishing cache");
  const response1 = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 20000,
    thinking: {
      type: "enabled",
      budget_tokens: 4000
    },
    messages: MESSAGES
  });

  console.log(`First response usage: `, response1.usage);

  MESSAGES = [
    ...MESSAGES,
    {
      role: "assistant",
      content: response1.content
    },
    {
      role: "user",
      content: "Analyze the characters in this passage."
    }
  ];

  // Second request - same thinking parameters (cache hit expected)
  console.log("\nSecond request - same thinking parameters (cache hit expected)");
  const response2 = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 20000,
    thinking: {
      type: "enabled",
      budget_tokens: 4000  // Same thinking budget
    },
    messages: MESSAGES
  });

  console.log(`Second response usage: `, response2.usage);

  MESSAGES = [
    ...MESSAGES,
    {
      role: "assistant",
      content: response2.content
    },
    {
      role: "user",
      content: "Analyze the setting in this passage."
    }
  ];

  // Third request - different thinking budget (cache miss expected)
  console.log("\nThird request - different thinking budget (cache miss expected)");
  const response3 = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 20000,
    thinking: {
      type: "enabled",
      budget_tokens: 8000  // Different thinking budget breaks cache
    },
    messages: MESSAGES
  });

  console.log(`Third response usage: `, response3.usage);
}

main().catch(console.error);
```

```java Java
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.Arrays;
import java.util.regex.Pattern;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.beta.messages.*;
import com.anthropic.models.beta.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;

import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toList;

public class ThinkingCacheExample {
    public static void main(String[] args) throws IOException {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Fetch the content of the article
        String bookUrl = "https://www.gutenberg.org/cache/epub/1342/pg1342.txt";
        String bookContent = fetchArticleContent(bookUrl);
        // Use just enough text for caching (first few chapters)
        String largeText = bookContent.substring(0, 5000);

        List<BetaTextBlockParam> systemPrompt = List.of(
                BetaTextBlockParam.builder()
                        .text("You are an AI assistant that is tasked with literary analysis. Analyze the following text carefully.")
                        .build(),
                BetaTextBlockParam.builder()
                        .text(largeText)
                        .cacheControl(BetaCacheControlEphemeral.builder().build())
                        .build()
        );

        List<BetaMessageParam> messages = new ArrayList<>();
        messages.add(BetaMessageParam.builder()
                .role(BetaMessageParam.Role.USER)
                .content("Analyze the tone of this passage.")
                .build());

        // First request - establish cache
        System.out.println("First request - establishing cache");
        BetaMessage response1 = client.beta().messages().create(
                MessageCreateParams.builder()
                        .model(Model.CLAUDE_OPUS_4_0)
                        .maxTokens(20000)
                        .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(4000).build())
                        .systemOfBetaTextBlockParams(systemPrompt)
                        .messages(messages)
                        .build()
        );

        System.out.println("First response usage: " + response1.usage());

        // Second request - same thinking parameters (cache hit expected)
        System.out.println("\nSecond request - same thinking parameters (cache hit expected)");
        BetaMessage response2 = client.beta().messages().create(
                MessageCreateParams.builder()
                        .model(Model.CLAUDE_OPUS_4_0)
                        .maxTokens(20000)
                        .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(4000).build())
                        .systemOfBetaTextBlockParams(systemPrompt)
                        .addMessage(response1)
                        .addUserMessage("Analyze the characters in this passage.")
                        .messages(messages)
                        .build()
        );

        System.out.println("Second response usage: " + response2.usage());

        // Third request - different thinking budget (cache hit expected because system prompt caching)
        System.out.println("\nThird request - different thinking budget (cache hit expected)");
        BetaMessage response3 = client.beta().messages().create(
                MessageCreateParams.builder()
                        .model(Model.CLAUDE_OPUS_4_0)
                        .maxTokens(20000)
                        .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(8000).build())
                        .systemOfBetaTextBlockParams(systemPrompt)
                        .addMessage(response1)
                        .addUserMessage("Analyze the characters in this passage.")
                        .addMessage(response2)
                        .addUserMessage("Analyze the setting in this passage.")
                        .build()
        );

        System.out.println("Third response usage: " + response3.usage());
    }

    private static String fetchArticleContent(String url) throws IOException {
        // Fetch HTML content
        String htmlContent = fetchHtml(url);

        // Remove script and style elements
        String noScriptStyle = removeElements(htmlContent, "script", "style");

        // Extract text (simple approach - remove HTML tags)
        String text = removeHtmlTags(noScriptStyle);

        // Clean up text (break into lines, remove whitespace)
        List<String> lines = Arrays.asList(text.split("\n"));
        List<String> trimmedLines = lines.stream()
                .map(String::trim)
                .collect(toList());

        // Split on double spaces and flatten
        List<String> chunks = trimmedLines.stream()
                .flatMap(line -> Arrays.stream(line.split("  "))
                        .map(String::trim))
                .collect(toList());

        // Filter empty chunks and join with newlines
        return chunks.stream()
                .filter(chunk -> !chunk.isEmpty())
                .collect(joining("\n"));
    }

    /**
     * Fetches HTML content from a URL
     */
    private static String fetchHtml(String urlString) throws IOException {
        try (InputStream inputStream = new URL(urlString).openStream()) {
            StringBuilder content = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(inputStream))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    content.append(line).append("\n");
                }
            }
            return content.toString();
        }
    }

    /**
     * Removes specified HTML elements and their content
     */
    private static String removeElements(String html, String... elementNames) {
        String result = html;
        for (String element : elementNames) {
            // Pattern to match <element>...</element> and self-closing tags
            String pattern = "<" + element + "\\s*[^>]*>.*?</" + element + ">|<" + element + "\\s*[^>]*/?>";
            result = Pattern.compile(pattern, Pattern.DOTALL).matcher(result).replaceAll("");
        }
        return result;
    }

    /**
     * Removes all HTML tags from content
     */
    private static String removeHtmlTags(String html) {
        // Replace <br> and <p> tags with newlines for better text formatting
        String withLineBreaks = html.replaceAll("<br\\s*/?\\s*>|</?p\\s*[^>]*>", "\n");

        // Remove remaining HTML tags
        String noTags = withLineBreaks.replaceAll("<[^>]*>", "");

        // Decode HTML entities (simplified for common entities)
        return decodeHtmlEntities(noTags);
    }

    /**
     * Simple HTML entity decoder for common entities
     */
    private static String decodeHtmlEntities(String text) {
        return text
                .replaceAll("&nbsp;", " ")
                .replaceAll("&amp;", "&")
                .replaceAll("&lt;", "<")
                .replaceAll("&gt;", ">")
                .replaceAll("&quot;", "\"")
                .replaceAll("&#39;", "'")
                .replaceAll("&hellip;", "...")
                .replaceAll("&mdash;", "—");
    }

}
```
</CodeGroup>

Berikut adalah output dari skrip (Anda mungkin melihat angka yang sedikit berbeda)

```
First request - establishing cache
First response usage: { cache_creation_input_tokens: 1370, cache_read_input_tokens: 0, input_tokens: 17, output_tokens: 700 }

Second request - same thinking parameters (cache hit expected)

Second response usage: { cache_creation_input_tokens: 0, cache_read_input_tokens: 1370, input_tokens: 303, output_tokens: 874 }

Third request - different thinking budget (cache miss expected)
Third response usage: { cache_creation_input_tokens: 1370, cache_read_input_tokens: 0, input_tokens: 747, output_tokens: 619 }
```

Contoh ini menunjukkan bahwa ketika penyimpanan cache diatur dalam array pesan, mengubah parameter pemikiran (budget_tokens ditingkatkan dari 4000 menjadi 8000) **membatalkan cache**. Permintaan ketiga menunjukkan tidak ada cache hit dengan `cache_creation_input_tokens=1370` dan `cache_read_input_tokens=0`, membuktikan bahwa penyimpanan cache berbasis pesan dibatalkan saat parameter pemikiran berubah.

</section>

## Token maksimal dan ukuran jendela konteks dengan pemikiran yang diperluas

Dalam model Claude yang lebih lama (sebelum Claude Sonnet 3.7), jika jumlah token prompt dan `max_tokens` melebihi jendela konteks model, sistem akan secara otomatis menyesuaikan `max_tokens` agar sesuai dengan batas konteks. Ini berarti Anda dapat mengatur nilai `max_tokens` yang besar dan sistem akan secara diam-diam menguranginya sesuai kebutuhan.

Dengan model Claude 3.7 dan 4, `max_tokens` (yang mencakup anggaran pemikiran Anda saat pemikiran diaktifkan) diberlakukan sebagai batas ketat. Sistem sekarang akan mengembalikan kesalahan validasi jika token prompt + `max_tokens` melebihi ukuran jendela konteks.

<Note>
Anda dapat membaca [panduan kami tentang jendela konteks](/docs/id/build-with-claude/context-windows) untuk penyelaman yang lebih mendalam.
</Note>

### Jendela konteks dengan pemikiran yang diperluas

Saat menghitung penggunaan jendela konteks dengan pemikiran diaktifkan, ada beberapa pertimbangan yang perlu diperhatikan:

- Blok pemikiran dari giliran sebelumnya dihapus dan tidak dihitung terhadap jendela konteks Anda
- Pemikiran giliran saat ini dihitung terhadap batas `max_tokens` untuk giliran itu

Diagram di bawah menunjukkan manajemen token khusus saat pemikiran yang diperluas diaktifkan:

![Diagram jendela konteks dengan pemikiran yang diperluas](/docs/images/context-window-thinking.svg)

Jendela konteks yang efektif dihitung sebagai:

```
context window =
  (current input tokens - previous thinking tokens) +
  (thinking tokens + encrypted thinking tokens + text output tokens)
```

Kami merekomendasikan menggunakan [API penghitungan token](/docs/id/build-with-claude/token-counting) untuk mendapatkan penghitungan token yang akurat untuk kasus penggunaan spesifik Anda, terutama saat bekerja dengan percakapan multi-giliran yang mencakup pemikiran.

### Jendela konteks dengan pemikiran yang diperluas dan penggunaan alat

Saat menggunakan pemikiran yang diperluas dengan penggunaan alat, blok pemikiran harus secara eksplisit dipertahankan dan dikembalikan dengan hasil alat.

Perhitungan jendela konteks yang efektif untuk pemikiran yang diperluas dengan penggunaan alat menjadi:

```
context window =
  (current input tokens + previous thinking tokens + tool use tokens) +
  (thinking tokens + encrypted thinking tokens + text output tokens)
```

Diagram di bawah mengilustrasikan manajemen token untuk pemikiran yang diperluas dengan penggunaan alat:

![Diagram jendela konteks dengan pemikiran yang diperluas dan penggunaan alat](/docs/images/context-window-thinking-tools.svg)

### Mengelola token dengan pemikiran yang diperluas

Mengingat perilaku jendela konteks dan `max_tokens` dengan model Claude 3.7 dan 4 pemikiran yang diperluas, Anda mungkin perlu:

- Lebih aktif memantau dan mengelola penggunaan token Anda
- Menyesuaikan nilai `max_tokens` saat panjang prompt Anda berubah
- Berpotensi menggunakan [endpoint penghitungan token](/docs/id/build-with-claude/token-counting) lebih sering
- Menyadari bahwa blok pemikiran sebelumnya tidak terakumulasi dalam jendela konteks Anda

Perubahan ini telah dilakukan untuk memberikan perilaku yang lebih dapat diprediksi dan transparan, terutama karena batas token maksimal telah meningkat secara signifikan.

## Enkripsi pemikiran

Konten pemikiran penuh dienkripsi dan dikembalikan dalam bidang `signature`. Bidang ini digunakan untuk memverifikasi bahwa blok pemikiran dihasilkan oleh Claude saat dilewatkan kembali ke API.

<Note>
Hanya benar-benar perlu mengirim kembali blok pemikiran saat menggunakan [alat dengan pemikiran yang diperluas](#extended-thinking-with-tool-use). Jika tidak, Anda dapat menghilangkan blok pemikiran dari giliran sebelumnya, atau membiarkan API menghapusnya untuk Anda jika Anda melewatkannya kembali.

Jika mengirim kembali blok pemikiran, kami merekomendasikan melewatkan semuanya kembali seperti yang Anda terima untuk konsistensi dan untuk menghindari potensi masalah.
</Note>

Berikut adalah beberapa pertimbangan penting tentang enkripsi pemikiran:
- Saat [streaming respons](#streaming-thinking), tanda tangan ditambahkan melalui `signature_delta` di dalam acara `content_block_delta` tepat sebelum acara `content_block_stop`.
- Nilai `signature` secara signifikan lebih panjang dalam model Claude 4 dibandingkan dengan model sebelumnya.
- Bidang `signature` adalah bidang buram dan tidak boleh diinterpretasikan atau diurai - bidang ini hanya ada untuk tujuan verifikasi.
- Nilai `signature` kompatibel di seluruh platform (Claude API, [Amazon Bedrock](/docs/id/build-with-claude/claude-on-amazon-bedrock), dan [Vertex AI](/docs/id/build-with-claude/claude-on-vertex-ai)). Nilai yang dihasilkan di satu platform akan kompatibel dengan platform lain.

### Redaksi pemikiran

Kadang-kadang penalaran internal Claude akan ditandai oleh sistem keamanan kami. Ketika ini terjadi, kami mengenkripsi sebagian atau seluruh blok `thinking` dan mengembalikannya kepada Anda sebagai blok `redacted_thinking`. Blok `redacted_thinking` didekripsi ketika diteruskan kembali ke API, memungkinkan Claude untuk melanjutkan responsnya tanpa kehilangan konteks.

Saat membangun aplikasi yang menghadap pelanggan yang menggunakan pemikiran yang diperluas:

- Sadari bahwa blok pemikiran yang diredaksi berisi konten terenkripsi yang tidak dapat dibaca manusia
- Pertimbangkan untuk memberikan penjelasan sederhana seperti: "Beberapa penalaran internal Claude telah dienkripsi secara otomatis untuk alasan keamanan. Ini tidak mempengaruhi kualitas respons."
- Jika menampilkan blok pemikiran kepada pengguna, Anda dapat memfilter blok yang diredaksi sambil mempertahankan blok pemikiran normal
- Bersikap transparan bahwa menggunakan fitur pemikiran yang diperluas dapat sesekali menghasilkan beberapa penalaran yang dienkripsi
- Implementasikan penanganan kesalahan yang sesuai untuk mengelola pemikiran yang diredaksi dengan anggun tanpa merusak UI Anda

Berikut adalah contoh yang menunjukkan blok pemikiran normal dan yang diredaksi:

```json
{
  "content": [
    {
      "type": "thinking",
      "thinking": "Let me analyze this step by step...",
      "signature": "WaUjzkypQ2mUEVM36O2TxuC06KN8xyfbJwyem2dw3URve/op91XWHOEBLLqIOMfFG/UvLEczmEsUjavL...."
    },
    {
      "type": "redacted_thinking",
      "data": "EmwKAhgBEgy3va3pzix/LafPsn4aDFIT2Xlxh0L5L8rLVyIwxtE3rAFBa8cr3qpPkNRj2YfWXGmKDxH4mPnZ5sQ7vB9URj2pLmN3kF8/dW5hR7xJ0aP1oLs9yTcMnKVf2wRpEGjH9XZaBt4UvDcPrQ..."
    },
    {
      "type": "text",
      "text": "Based on my analysis..."
    }
  ]
}
```

<Note>
Melihat blok pemikiran yang diredaksi dalam output Anda adalah perilaku yang diharapkan. Model masih dapat menggunakan penalaran yang diredaksi ini untuk menginformasikan responsnya sambil mempertahankan penjaga keamanan.

Jika Anda perlu menguji penanganan pemikiran yang diredaksi dalam aplikasi Anda, Anda dapat menggunakan string uji khusus ini sebagai prompt Anda: `ANTHROPIC_MAGIC_STRING_TRIGGER_REDACTED_THINKING_46C9A13E193C177646C7398A98432ECCCE4C1253D5E2D82641AC0E52CC2876CB`
</Note>

Saat melewatkan blok `thinking` dan `redacted_thinking` kembali ke API dalam percakapan multi-putaran, Anda harus menyertakan blok yang lengkap dan tidak dimodifikasi kembali ke API untuk giliran asisten terakhir. Ini sangat penting untuk mempertahankan aliran penalaran model. Kami menyarankan untuk selalu melewatkan semua blok pemikiran ke API. Untuk detail lebih lanjut, lihat bagian [Preserving thinking blocks](#preserving-thinking-blocks) di atas.

<section title="Contoh: Bekerja dengan blok pemikiran yang diredaksi">

Contoh ini menunjukkan cara menangani blok `redacted_thinking` yang mungkin muncul dalam respons ketika penalaran internal Claude berisi konten yang ditandai oleh sistem keamanan:

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# Using a special prompt that triggers redacted thinking (for demonstration purposes only)
response = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    messages=[{
        "role": "user",
        "content": "ANTHROPIC_MAGIC_STRING_TRIGGER_REDACTED_THINKING_46C9A13E193C177646C7398A98432ECCCE4C1253D5E2D82641AC0E52CC2876CB"
    }]
)

# Identify redacted thinking blocks
has_redacted_thinking = any(
    block.type == "redacted_thinking" for block in response.content
)

if has_redacted_thinking:
    print("Response contains redacted thinking blocks")
    # These blocks are still usable in subsequent requests

    # Extract all blocks (both redacted and non-redacted)
    all_thinking_blocks = [
        block for block in response.content
        if block.type in ["thinking", "redacted_thinking"]
    ]

    # When passing to subsequent requests, include all blocks without modification
    # This preserves the integrity of Claude's reasoning

    print(f"Found {len(all_thinking_blocks)} thinking blocks total")
    print(f"These blocks are still billable as output tokens")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

// Using a special prompt that triggers redacted thinking (for demonstration purposes only)
const response = await client.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 16000,
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  messages: [{
    role: "user",
    content: "ANTHROPIC_MAGIC_STRING_TRIGGER_REDACTED_THINKING_46C9A13E193C177646C7398A98432ECCCE4C1253D5E2D82641AC0E52CC2876CB"
  }]
});

// Identify redacted thinking blocks
const hasRedactedThinking = response.content.some(
  block => block.type === "redacted_thinking"
);

if (hasRedactedThinking) {
  console.log("Response contains redacted thinking blocks");
  // These blocks are still usable in subsequent requests

  // Extract all blocks (both redacted and non-redacted)
  const allThinkingBlocks = response.content.filter(
    block => block.type === "thinking" || block.type === "redacted_thinking"
  );

  // When passing to subsequent requests, include all blocks without modification
  // This preserves the integrity of Claude's reasoning

  console.log(`Found ${allThinkingBlocks.length} thinking blocks total`);
  console.log(`These blocks are still billable as output tokens`);
}
```

```java Java
import java.util.List;

import static java.util.stream.Collectors.toList;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.beta.messages.BetaContentBlock;
import com.anthropic.models.beta.messages.BetaMessage;
import com.anthropic.models.beta.messages.MessageCreateParams;
import com.anthropic.models.beta.messages.BetaThinkingConfigEnabled;
import com.anthropic.models.messages.Model;

public class RedactedThinkingExample {
    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Using a special prompt that triggers redacted thinking (for demonstration purposes only)
        BetaMessage response = client.beta().messages().create(
                MessageCreateParams.builder()
                        .model(Model.CLAUDE_SONNET_4_5)
                        .maxTokens(16000)
                        .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(10000).build())
                        .addUserMessage("ANTHROPIC_MAGIC_STRING_TRIGGER_REDACTED_THINKING_46C9A13E193C177646C7398A98432ECCCE4C1253D5E2D82641AC0E52CC2876CB")
                        .build()
        );

        // Identify redacted thinking blocks
        boolean hasRedactedThinking = response.content().stream()
                .anyMatch(BetaContentBlock::isRedactedThinking);

        if (hasRedactedThinking) {
            System.out.println("Response contains redacted thinking blocks");
            // These blocks are still usable in subsequent requests
            // Extract all blocks (both redacted and non-redacted)
            List<BetaContentBlock> allThinkingBlocks = response.content().stream()
                    .filter(block -> block.isThinking() ||
                            block.isRedactedThinking())
                    .collect(toList());

            // When passing to subsequent requests, include all blocks without modification
            // This preserves the integrity of Claude's reasoning
            System.out.println("Found " + allThinkingBlocks.size() + " thinking blocks total");
            System.out.println("These blocks are still billable as output tokens");
        }
    }
}
```

</CodeGroup>

<TryInConsoleButton
  userPrompt="ANTHROPIC_MAGIC_STRING_TRIGGER_REDACTED_THINKING_46C9A13E193C177646C7398A98432ECCCE4C1253D5E2D82641AC0E52CC2876CB"
  thinkingBudgetTokens={16000}
>
  Coba di Konsol
</TryInConsoleButton>

</section>

## Perbedaan pemikiran di seluruh versi model

Messages API menangani pemikiran secara berbeda di seluruh model Claude Sonnet 3.7 dan Claude 4, terutama dalam perilaku redaksi dan ringkasan.

Lihat tabel di bawah untuk perbandingan yang dipadatkan:

| Fitur | Claude Sonnet 3.7 | Model Claude 4 (pre-Opus 4.5) | Claude Opus 4.5 dan lebih baru |
|---------|------------------|-------------------------------|--------------------------|
| **Output Pemikiran** | Mengembalikan output pemikiran penuh | Mengembalikan pemikiran yang diringkas | Mengembalikan pemikiran yang diringkas |
| **Pemikiran yang Disisipi** | Tidak didukung | Didukung dengan header beta `interleaved-thinking-2025-05-14` | Didukung dengan header beta `interleaved-thinking-2025-05-14` |
| **Preservasi Blok Pemikiran** | Tidak dipertahankan di seluruh putaran | Tidak dipertahankan di seluruh putaran | **Dipertahankan secara default** (memungkinkan optimasi cache, penghematan token) |

### Preservasi blok pemikiran di Claude Opus 4.5

Claude Opus 4.5 memperkenalkan perilaku default baru: **blok pemikiran dari giliran asisten sebelumnya dipertahankan dalam konteks model secara default**. Ini berbeda dari model sebelumnya, yang menghapus blok pemikiran dari putaran sebelumnya.

**Manfaat preservasi blok pemikiran:**

- **Optimasi cache**: Saat menggunakan tool use, blok pemikiran yang dipertahankan memungkinkan cache hits karena diteruskan kembali dengan hasil tool dan di-cache secara inkremental di seluruh giliran asisten, menghasilkan penghematan token dalam alur kerja multi-langkah
- **Tidak ada dampak kecerdasan**: Mempertahankan blok pemikiran tidak memiliki efek negatif pada kinerja model

**Pertimbangan penting:**

- **Penggunaan konteks**: Percakapan panjang akan mengonsumsi lebih banyak ruang konteks karena blok pemikiran dipertahankan dalam konteks
- **Perilaku otomatis**: Ini adalah perilaku default untuk Claude Opus 4.5—tidak diperlukan perubahan kode atau header beta
- **Kompatibilitas mundur**: Untuk memanfaatkan fitur ini, terus lewatkan blok pemikiran yang lengkap dan tidak dimodifikasi kembali ke API seperti yang Anda lakukan untuk tool use

<Note>
Untuk model sebelumnya (Claude Sonnet 4.5, Opus 4.1, dll.), blok pemikiran dari putaran sebelumnya terus dihapus dari konteks. Perilaku yang ada yang dijelaskan dalam bagian [Extended thinking with prompt caching](#extended-thinking-with-prompt-caching) berlaku untuk model tersebut.
</Note>

## Harga

Untuk informasi harga lengkap termasuk tarif dasar, penulisan cache, cache hits, dan token output, lihat [halaman harga](/docs/id/about-claude/pricing).

Proses pemikiran dikenakan biaya untuk:
- Token yang digunakan selama pemikiran (token output)
- Blok pemikiran dari giliran asisten terakhir yang disertakan dalam permintaan berikutnya (token input)
- Token output teks standar

<Note>
Ketika pemikiran yang diperluas diaktifkan, prompt sistem khusus secara otomatis disertakan untuk mendukung fitur ini.
</Note>

Saat menggunakan pemikiran yang diringkas:
- **Token input**: Token dalam permintaan asli Anda (mengecualikan token pemikiran dari putaran sebelumnya)
- **Token output (ditagih)**: Token pemikiran asli yang dihasilkan Claude secara internal
- **Token output (terlihat)**: Token pemikiran yang diringkas yang Anda lihat dalam respons
- **Tidak ada biaya**: Token yang digunakan untuk menghasilkan ringkasan

<Warning>
Jumlah token output yang ditagih **tidak akan** cocok dengan jumlah token yang terlihat dalam respons. Anda ditagih untuk proses pemikiran penuh, bukan ringkasan yang Anda lihat.
</Warning>

## Praktik terbaik dan pertimbangan untuk pemikiran yang diperluas

### Bekerja dengan anggaran pemikiran

- **Optimasi anggaran:** Anggaran minimum adalah 1.024 token. Kami menyarankan untuk memulai dengan minimum dan meningkatkan anggaran pemikiran secara bertahap untuk menemukan rentang optimal untuk kasus penggunaan Anda. Jumlah token yang lebih tinggi memungkinkan penalaran yang lebih komprehensif tetapi dengan hasil yang berkurang tergantung pada tugas. Meningkatkan anggaran dapat meningkatkan kualitas respons dengan mengorbankan latensi yang meningkat. Untuk tugas-tugas penting, uji pengaturan yang berbeda untuk menemukan keseimbangan optimal. Perhatikan bahwa anggaran pemikiran adalah target daripada batas ketat—penggunaan token aktual dapat bervariasi berdasarkan tugas.
- **Titik awal:** Mulai dengan anggaran pemikiran yang lebih besar (16k+ token) untuk tugas-tugas kompleks dan sesuaikan berdasarkan kebutuhan Anda.
- **Anggaran besar:** Untuk anggaran pemikiran di atas 32k, kami merekomendasikan menggunakan [batch processing](/docs/id/build-with-claude/batch-processing) untuk menghindari masalah jaringan. Permintaan yang mendorong model untuk berpikir di atas 32k token menyebabkan permintaan yang berjalan lama yang mungkin mengalami batas waktu sistem dan batas koneksi terbuka.
- **Pelacakan penggunaan token:** Pantau penggunaan token pemikiran untuk mengoptimalkan biaya dan kinerja.

### Pertimbangan kinerja

- **Waktu respons:** Bersiaplah untuk waktu respons yang berpotensi lebih lama karena pemrosesan tambahan yang diperlukan untuk proses penalaran. Faktor dalam bahwa menghasilkan blok pemikiran dapat meningkatkan waktu respons keseluruhan.
- **Persyaratan streaming:** Streaming diperlukan ketika `max_tokens` lebih besar dari 21.333. Saat streaming, bersiaplah untuk menangani blok konten pemikiran dan teks saat tiba.

### Kompatibilitas fitur

- Pemikiran tidak kompatibel dengan modifikasi `temperature` atau `top_k` serta [forced tool use](/docs/id/agents-and-tools/tool-use/implement-tool-use#forcing-tool-use).
- Ketika pemikiran diaktifkan, Anda dapat mengatur `top_p` ke nilai antara 1 dan 0,95.
- Anda tidak dapat mengisi respons sebelumnya ketika pemikiran diaktifkan.
- Perubahan pada anggaran pemikiran membatalkan awalan prompt yang di-cache yang mencakup pesan. Namun, prompt sistem yang di-cache dan definisi tool akan terus berfungsi ketika parameter pemikiran berubah.

### Panduan penggunaan

- **Pemilihan tugas:** Gunakan pemikiran yang diperluas untuk tugas-tugas yang sangat kompleks yang mendapat manfaat dari penalaran langkah demi langkah seperti matematika, pengkodean, dan analisis.
- **Penanganan konteks:** Anda tidak perlu menghapus blok pemikiran sebelumnya sendiri. API Claude secara otomatis mengabaikan blok pemikiran dari putaran sebelumnya dan mereka tidak disertakan saat menghitung penggunaan konteks.
- **Prompt engineering:** Tinjau [extended thinking prompting tips](/docs/id/build-with-claude/prompt-engineering/extended-thinking-tips) kami jika Anda ingin memaksimalkan kemampuan pemikiran Claude.

## Langkah berikutnya

<CardGroup>
  <Card title="Coba buku resep pemikiran yang diperluas" icon="book" href="https://github.com/anthropics/anthropic-cookbook/tree/main/extended_thinking">
    Jelajahi contoh praktis pemikiran dalam buku resep kami.
  </Card>
  <Card title="Extended thinking prompting tips" icon="code" href="/docs/id/build-with-claude/prompt-engineering/extended-thinking-tips">
    Pelajari praktik terbaik prompt engineering untuk pemikiran yang diperluas.
  </Card>
</CardGroup>