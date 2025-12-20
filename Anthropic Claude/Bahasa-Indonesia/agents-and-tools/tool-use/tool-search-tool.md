# Alat pencarian alat

Alat pencarian alat memungkinkan Claude untuk bekerja dengan ratusan atau ribuan alat dengan menemukan dan memuat mereka secara dinamis sesuai permintaan.

---

Alat pencarian alat memungkinkan Claude untuk bekerja dengan ratusan atau ribuan alat dengan menemukan dan memuat mereka secara dinamis sesuai permintaan. Alih-alih memuat semua definisi alat ke jendela konteks di awal, Claude mencari katalog alat Anda—termasuk nama alat, deskripsi, nama argumen, dan deskripsi argumen—dan memuat hanya alat yang dibutuhkannya.

Pendekatan ini mengatasi dua tantangan kritis saat perpustakaan alat berkembang:

- **Efisiensi konteks**: Definisi alat dapat mengonsumsi bagian besar dari jendela konteks Anda (50 alat ≈ 10-20K token), meninggalkan lebih sedikit ruang untuk pekerjaan sebenarnya
- **Akurasi pemilihan alat**: Kemampuan Claude untuk memilih alat dengan benar menurun secara signifikan dengan lebih dari 30-50 alat yang tersedia secara konvensional

Meskipun ini disediakan sebagai alat sisi server, Anda juga dapat menerapkan fungsionalitas pencarian alat sisi klien Anda sendiri. Lihat [Implementasi pencarian alat khusus](#custom-tool-search-implementation) untuk detail.

<Note>
Alat pencarian alat saat ini dalam beta publik. Sertakan [header beta](/docs/id/api/beta-headers) yang sesuai untuk penyedia Anda:

| Penyedia                 | Header beta                    | Model yang didukung                    |
| ------------------------ | ------------------------------ | -------------------------------------- |
| Claude API<br/>Microsoft Foundry  | `advanced-tool-use-2025-11-20` | Claude Opus 4.5<br />Claude Sonnet 4.5 |
| Google Cloud's Vertex AI | `tool-search-tool-2025-10-19`  | Claude Opus 4.5<br />Claude Sonnet 4.5 |
| Amazon Bedrock           | `tool-search-tool-2025-10-19`  | Claude Opus 4.5                        |
</Note>

<Warning>
  Di Amazon Bedrock, pencarian alat sisi server hanya tersedia melalui [API invoke](https://docs.aws.amazon.com/bedrock/latest/userguide/bedrock-runtime_example_bedrock-runtime_InvokeModel_AnthropicClaude_section.html),
  bukan API converse.
</Warning>

Anda juga dapat menerapkan [pencarian alat sisi klien](#custom-tool-search-implementation) dengan mengembalikan blok `tool_reference` dari implementasi pencarian Anda sendiri.

## Cara kerja pencarian alat

Ada dua varian pencarian alat:

- **Regex** (`tool_search_tool_regex_20251119`): Claude membuat pola regex untuk mencari alat
- **BM25** (`tool_search_tool_bm25_20251119`): Claude menggunakan kueri bahasa alami untuk mencari alat

Ketika Anda mengaktifkan alat pencarian alat:

1. Anda menyertakan alat pencarian alat (misalnya, `tool_search_tool_regex_20251119` atau `tool_search_tool_bm25_20251119`) dalam daftar alat Anda
2. Anda menyediakan semua definisi alat dengan `defer_loading: true` untuk alat yang tidak boleh dimuat segera
3. Claude hanya melihat alat pencarian alat dan alat non-deferred apa pun pada awalnya
4. Ketika Claude membutuhkan alat tambahan, ia mencari menggunakan alat pencarian alat
5. API mengembalikan 3-5 blok `tool_reference` paling relevan
6. Referensi ini secara otomatis diperluas menjadi definisi alat lengkap
7. Claude memilih dari alat yang ditemukan dan menjalankannya

Ini menjaga jendela konteks Anda tetap efisien sambil mempertahankan akurasi pemilihan alat yang tinggi.

## Mulai cepat

Berikut adalah contoh sederhana dengan alat yang ditangguhkan:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: advanced-tool-use-2025-11-20" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5-20250929",
        "max_tokens": 2048,
        "messages": [
            {
                "role": "user",
                "content": "What is the weather in San Francisco?"
            }
        ],
        "tools": [
            {
                "type": "tool_search_tool_regex_20251119",
                "name": "tool_search_tool_regex"
            },
            {
                "name": "get_weather",
                "description": "Get the weather at a specific location",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "location": {"type": "string"},
                        "unit": {
                            "type": "string",
                            "enum": ["celsius", "fahrenheit"]
                        }
                    },
                    "required": ["location"]
                },
                "defer_loading": true
            },
            {
                "name": "search_files",
                "description": "Search through files in the workspace",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "query": {"type": "string"},
                        "file_types": {
                            "type": "array",
                            "items": {"type": "string"}
                        }
                    },
                    "required": ["query"]
                },
                "defer_loading": true
            }
        ]
    }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=2048,
    messages=[
        {
            "role": "user",
            "content": "What is the weather in San Francisco?"
        }
    ],
    tools=[
        {
            "type": "tool_search_tool_regex_20251119",
            "name": "tool_search_tool_regex"
        },
        {
            "name": "get_weather",
            "description": "Get the weather at a specific location",
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {"type": "string"},
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"]
                    }
                },
                "required": ["location"]
            },
            "defer_loading": True
        },
        {
            "name": "search_files",
            "description": "Search through files in the workspace",
            "input_schema": {
                "type": "object",
                "properties": {
                    "query": {"type": "string"},
                    "file_types": {
                        "type": "array",
                        "items": {"type": "string"}
                    }
                },
                "required": ["query"]
            },
            "defer_loading": True
        }
    ]
)

print(response)
```

```typescript TypeScript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

async function main() {
  const response = await client.beta.messages.create({
    model: "claude-sonnet-4-5-20250929",
    betas: ["advanced-tool-use-2025-11-20"],
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: "What is the weather in San Francisco?",
      },
    ],
    tools: [
      {
        type: "tool_search_tool_regex_20251119",
        name: "tool_search_tool_regex",
      },
      {
        name: "get_weather",
        description: "Get the weather at a specific location",
        input_schema: {
          type: "object",
          properties: {
            location: { type: "string" },
            unit: {
              type: "string",
              enum: ["celsius", "fahrenheit"],
            },
          },
          required: ["location"],
        },
        defer_loading: true,
      },
      {
        name: "search_files",
        description: "Search through files in the workspace",
        input_schema: {
          type: "object",
          properties: {
            query: { type: "string" },
            file_types: {
              type: "array",
              items: { type: "string" },
            },
          },
          required: ["query"],
        },
        defer_loading: true,
      },
    ],
  });

  console.log(JSON.stringify(response, null, 2));
}

main();
```

</CodeGroup>

## Definisi alat

Alat pencarian alat memiliki dua varian:

```json JSON
{
  "type": "tool_search_tool_regex_20251119",
  "name": "tool_search_tool_regex"
}
```

```json JSON
{
  "type": "tool_search_tool_bm25_20251119",
  "name": "tool_search_tool_bm25"
}
```

<Warning>
**Format kueri varian Regex: Regex Python, BUKAN bahasa alami**

Saat menggunakan `tool_search_tool_regex_20251119`, Claude membuat pola regex menggunakan sintaks `re.search()` Python, bukan kueri bahasa alami. Pola umum:

- `"weather"` - cocok dengan nama alat/deskripsi yang berisi "weather"
- `"get_.*_data"` - cocok dengan alat seperti `get_user_data`, `get_weather_data`
- `"database.*query|query.*database"` - pola OR untuk fleksibilitas
- `"(?i)slack"` - pencarian tidak peka huruf besar-kecil

Panjang kueri maksimal: 200 karakter

</Warning>

<Note>
**Format kueri varian BM25: Bahasa alami**

Saat menggunakan `tool_search_tool_bm25_20251119`, Claude menggunakan kueri bahasa alami untuk mencari alat.

</Note>

### Pemuatan alat yang ditangguhkan

Tandai alat untuk pemuatan sesuai permintaan dengan menambahkan `defer_loading: true`:

```json JSON
{
  "name": "get_weather",
  "description": "Get current weather for a location",
  "input_schema": {
    "type": "object",
    "properties": {
      "location": { "type": "string" },
      "unit": { "type": "string", "enum": ["celsius", "fahrenheit"] }
    },
    "required": ["location"]
  },
  "defer_loading": true
}
```

**Poin kunci:**

- Alat tanpa `defer_loading` dimuat ke konteks segera
- Alat dengan `defer_loading: true` hanya dimuat ketika Claude menemukannya melalui pencarian
- Alat pencarian alat itu sendiri **tidak boleh** memiliki `defer_loading: true`
- Pertahankan 3-5 alat yang paling sering digunakan sebagai non-deferred untuk kinerja optimal

Kedua varian pencarian alat (`regex` dan `bm25`) mencari nama alat, deskripsi, nama argumen, dan deskripsi argumen.

## Format respons

Ketika Claude menggunakan alat pencarian alat, respons mencakup tipe blok baru:

```json JSON
{
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "I'll search for tools to help with the weather information."
    },
    {
      "type": "server_tool_use",
      "id": "srvtoolu_01ABC123",
      "name": "tool_search_tool_regex",
      "input": {
        "query": "weather"
      }
    },
    {
      "type": "tool_search_tool_result",
      "tool_use_id": "srvtoolu_01ABC123",
      "content": {
        "type": "tool_search_tool_search_result",
        "tool_references": [{ "type": "tool_reference", "tool_name": "get_weather" }]
      }
    },
    {
      "type": "text",
      "text": "I found a weather tool. Let me get the weather for San Francisco."
    },
    {
      "type": "tool_use",
      "id": "toolu_01XYZ789",
      "name": "get_weather",
      "input": { "location": "San Francisco", "unit": "fahrenheit" }
    }
  ],
  "stop_reason": "tool_use"
}
```

### Memahami respons

- **`server_tool_use`**: Menunjukkan Claude menjalankan alat pencarian alat
- **`tool_search_tool_result`**: Berisi hasil pencarian dengan objek `tool_search_tool_search_result` bersarang
- **`tool_references`**: Array objek `tool_reference` yang menunjuk ke alat yang ditemukan
- **`tool_use`**: Claude menjalankan alat yang ditemukan

Blok `tool_reference` secara otomatis diperluas menjadi definisi alat lengkap sebelum ditampilkan kepada Claude. Anda tidak perlu menangani ekspansi ini sendiri. Ini terjadi secara otomatis di API selama Anda menyediakan semua definisi alat yang cocok dalam parameter `tools`.

## Integrasi MCP

Alat pencarian alat bekerja dengan [server MCP](/docs/id/agents-and-tools/mcp-connector). Tambahkan [header beta](/docs/id/api/beta-headers) `"mcp-client-2025-11-20"` ke permintaan API Anda, kemudian gunakan `mcp_toolset` dengan `default_config` untuk menunda pemuatan alat MCP:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
  --header "x-api-key: $ANTHROPIC_API_KEY" \
  --header "anthropic-version: 2023-06-01" \
  --header "anthropic-beta: advanced-tool-use-2025-11-20,mcp-client-2025-11-20" \
  --header "content-type: application/json" \
  --data '{
    "model": "claude-sonnet-4-5-20250929",
    "max_tokens": 2048,
    "mcp_servers": [
      {
        "type": "url",
        "name": "database-server",
        "url": "https://mcp-db.example.com"
      }
    ],
    "tools": [
      {
        "type": "tool_search_tool_regex_20251119",
        "name": "tool_search_tool_regex"
      },
      {
        "type": "mcp_toolset",
        "mcp_server_name": "database-server",
        "default_config": {
          "defer_loading": true
        },
        "configs": {
          "search_events": {
            "defer_loading": false
          }
        }
      }
    ],
    "messages": [
      {
        "role": "user",
        "content": "What events are in my database?"
      }
    ]
  }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    betas=["advanced-tool-use-2025-11-20", "mcp-client-2025-11-20"],
    max_tokens=2048,
    mcp_servers=[
        {
            "type": "url",
            "name": "database-server",
            "url": "https://mcp-db.example.com"
        }
    ],
    tools=[
        {
            "type": "tool_search_tool_regex_20251119",
            "name": "tool_search_tool_regex"
        },
        {
            "type": "mcp_toolset",
            "mcp_server_name": "database-server",
            "default_config": {
                "defer_loading": True
            },
            "configs": {
                "search_events": {
                    "defer_loading": False
                }
            }
        }
    ],
    messages=[
        {
            "role": "user",
            "content": "What events are in my database?"
        }
    ]
)

print(response)
```

```typescript TypeScript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

async function main() {
  const response = await client.beta.messages.create({
    model: "claude-sonnet-4-5-20250929",
    betas: ["advanced-tool-use-2025-11-20", "mcp-client-2025-11-20"],
    max_tokens: 2048,
    mcp_servers: [
      {
        type: "url",
        name: "database-server",
        url: "https://mcp-db.example.com",
      },
    ],
    tools: [
      {
        type: "tool_search_tool_regex_20251119",
        name: "tool_search_tool_regex",
      },
      {
        type: "mcp_toolset",
        mcp_server_name: "database-server",
        default_config: {
          defer_loading: true,
        },
        configs: {
          search_events: {
            defer_loading: false,
          },
        },
      },
    ],
    messages: [
      {
        role: "user",
        content: "What events are in my database?",
      },
    ],
  });

  console.log(JSON.stringify(response, null, 2));
}

main();
```

</CodeGroup>

**Opsi konfigurasi MCP:**

- `default_config.defer_loading`: Tetapkan default untuk semua alat dari server MCP
- `configs`: Ganti default untuk alat tertentu berdasarkan nama
- Gabungkan beberapa server MCP dengan pencarian alat untuk perpustakaan alat yang besar

## Implementasi pencarian alat khusus

Anda dapat menerapkan logika pencarian alat Anda sendiri (misalnya, menggunakan embedding atau pencarian semantik) dengan mengembalikan blok `tool_reference` dari alat khusus:

```json JSON
{
  "type": "tool_search_tool_result",
  "tool_use_id": "toolu_custom_search",
  "content": {
    "type": "tool_search_tool_search_result",
    "tool_references": [{ "type": "tool_reference", "tool_name": "discovered_tool_name" }]
  }
}
```

Setiap alat yang direferensikan harus memiliki definisi alat yang sesuai dalam parameter `tools` tingkat atas dengan `defer_loading: true`. Pendekatan ini memungkinkan Anda menggunakan algoritma pencarian yang lebih canggih sambil mempertahankan kompatibilitas dengan sistem pencarian alat.

Untuk contoh lengkap menggunakan embedding, lihat [buku resep pencarian alat dengan embedding](https://github.com/anthropics/anthropic-cookbook) kami.

## Penanganan kesalahan

<Note>
  Alat pencarian alat tidak kompatibel dengan [contoh penggunaan alat](/docs/id/agents-and-tools/tool-use/implement-tool-use#providing-tool-use-examples).
  Jika Anda perlu memberikan contoh penggunaan alat, gunakan pemanggilan alat standar
  tanpa pencarian alat.
</Note>

### Kesalahan HTTP (status 400)

Kesalahan ini mencegah permintaan diproses:

**Semua alat ditangguhkan:**

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "All tools have defer_loading set. At least one tool must be non-deferred."
  }
}
```

**Definisi alat yang hilang:**

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "Tool reference 'unknown_tool' has no corresponding tool definition"
  }
}
```

### Kesalahan hasil alat (status 200)

Kesalahan selama eksekusi alat mengembalikan respons 200 dengan informasi kesalahan di badan:

```json JSON
{
  "type": "tool_result",
  "tool_use_id": "srvtoolu_01ABC123",
  "content": {
    "type": "tool_search_tool_result_error",
    "error_code": "invalid_pattern"
  }
}
```

**Kode kesalahan:**

- `too_many_requests`: Batas laju terlampaui untuk operasi pencarian alat
- `invalid_pattern`: Pola regex yang salah format
- `pattern_too_long`: Pola melebihi batas 200 karakter
- `unavailable`: Layanan pencarian alat sementara tidak tersedia

### Kesalahan umum

<section title="Kesalahan 400: Semua alat ditangguhkan">

**Penyebab**: Anda menetapkan `defer_loading: true` pada SEMUA alat termasuk alat pencarian

**Perbaikan**: Hapus `defer_loading` dari alat pencarian alat:

```json
{
  "type": "tool_search_tool_regex_20251119", // Tidak ada defer_loading di sini
  "name": "tool_search_tool_regex"
}
```

</section>

<section title="Kesalahan 400: Definisi alat yang hilang">

**Penyebab**: `tool_reference` menunjuk ke alat yang tidak ada dalam array `tools` Anda

**Perbaikan**: Pastikan setiap alat yang dapat ditemukan memiliki definisi lengkap:

```json
{
  "name": "my_tool",
  "description": "Full description here",
  "input_schema": {
    /* complete schema */
  },
  "defer_loading": true
}
```

</section>

<section title="Claude tidak menemukan alat yang diharapkan">

**Penyebab**: Nama atau deskripsi alat tidak cocok dengan pola regex

**Langkah debugging:**

1. Periksa nama dan deskripsi alat—Claude mencari KEDUA bidang
2. Uji pola Anda: `import re; re.search(r"your_pattern", "tool_name")`
3. Ingat pencarian peka huruf besar-kecil secara default (gunakan `(?i)` untuk tidak peka huruf besar-kecil)
4. Claude menggunakan pola luas seperti `".*weather.*"` bukan kecocokan tepat

**Tip**: Tambahkan kata kunci umum ke deskripsi alat untuk meningkatkan kemampuan penemuan

</section>

## Caching prompt

Pencarian alat bekerja dengan [caching prompt](/docs/id/build-with-claude/prompt-caching). Tambahkan titik henti `cache_control` untuk mengoptimalkan percakapan multi-putaran:

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# Permintaan pertama dengan pencarian alat
messages = [
    {
        "role": "user",
        "content": "What's the weather in Seattle?"
    }
]

response1 = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=2048,
    messages=messages,
    tools=[
        {
            "type": "tool_search_tool_regex_20251119",
            "name": "tool_search_tool_regex"
        },
        {
            "name": "get_weather",
            "description": "Get weather for a location",
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {"type": "string"}
                },
                "required": ["location"]
            },
            "defer_loading": True
        }
    ]
)

# Tambahkan respons Claude ke percakapan
messages.append({
    "role": "assistant",
    "content": response1.content
})

# Permintaan kedua dengan titik henti cache
messages.append({
    "role": "user",
    "content": "What about New York?",
    "cache_control": {"type": "ephemeral"}
})

response2 = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=2048,
    messages=messages,
    tools=[
        {
            "type": "tool_search_tool_regex_20251119",
            "name": "tool_search_tool_regex"
        },
        {
            "name": "get_weather",
            "description": "Get weather for a location",
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {"type": "string"}
                },
                "required": ["location"]
            },
            "defer_loading": True
        }
    ]
)

print(f"Cache read tokens: {response2.usage.get('cache_read_input_tokens', 0)}")
```
</CodeGroup>

Sistem secara otomatis memperluas blok tool_reference di seluruh riwayat percakapan lengkap, sehingga Claude dapat menggunakan kembali alat yang ditemukan dalam putaran berikutnya tanpa pencarian ulang.

## Streaming

Dengan streaming diaktifkan, Anda akan menerima peristiwa pencarian alat sebagai bagian dari aliran:

```javascript
event: content_block_start
data: {"type": "content_block_start", "index": 1, "content_block": {"type": "server_tool_use", "id": "srvtoolu_xyz789", "name": "tool_search_tool_regex"}}

// Kueri pencarian dialirkan
event: content_block_delta
data: {"type": "content_block_delta", "index": 1, "delta": {"type": "input_json_delta", "partial_json": "{\"query\":\"weather\"}"}}

// Jeda saat pencarian dieksekusi

// Hasil pencarian dialirkan
event: content_block_start
data: {"type": "content_block_start", "index": 2, "content_block": {"type": "tool_search_tool_result", "tool_use_id": "srvtoolu_xyz789", "content": {"type": "tool_search_tool_search_result", "tool_references": [{"type": "tool_reference", "tool_name": "get_weather"}]}}}

// Claude melanjutkan dengan alat yang ditemukan
```

## Permintaan batch

Anda dapat menyertakan alat pencarian alat dalam [Messages Batches API](/docs/id/build-with-claude/batch-processing). Operasi pencarian alat melalui Messages Batches API dihargai sama dengan yang ada di permintaan Messages API reguler.

## Batas dan praktik terbaik

### Batas

- **Alat maksimal**: 10.000 alat dalam katalog Anda
- **Hasil pencarian**: Mengembalikan 3-5 alat paling relevan per pencarian
- **Panjang pola**: Maksimal 200 karakter untuk pola regex
- **Dukungan model**: Sonnet 4.0+, Opus 4.0+ saja (tidak ada Haiku)

### Kapan menggunakan pencarian alat

**Kasus penggunaan yang baik:**

- 10+ alat tersedia di sistem Anda
- Definisi alat mengonsumsi >10K token
- Mengalami masalah akurasi pemilihan alat dengan set alat besar
- Membangun sistem bertenaga MCP dengan beberapa server (200+ alat)
- Perpustakaan alat berkembang seiring waktu

**Kapan pemanggilan alat tradisional mungkin lebih baik:**

- Kurang dari 10 alat total
- Semua alat sering digunakan di setiap permintaan
- Definisi alat sangat kecil (\<100 token total)

### Tips optimasi

- Pertahankan 3-5 alat yang paling sering digunakan sebagai non-deferred
- Tulis nama dan deskripsi alat yang jelas dan deskriptif
- Gunakan kata kunci semantik dalam deskripsi yang cocok dengan cara pengguna menggambarkan tugas
- Tambahkan bagian prompt sistem yang menggambarkan kategori alat yang tersedia: "Anda dapat mencari alat untuk berinteraksi dengan Slack, GitHub, dan Jira"
- Pantau alat mana yang Claude temukan untuk menyempurnakan deskripsi

## Penggunaan

Penggunaan alat pencarian alat dilacak dalam objek penggunaan respons:

```json JSON
{
  "usage": {
    "input_tokens": 1024,
    "output_tokens": 256,
    "server_tool_use": {
      "tool_search_requests": 2
    }
  }
}
```