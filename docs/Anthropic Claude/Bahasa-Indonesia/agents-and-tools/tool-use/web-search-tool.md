# Alat pencarian web

Alat pencarian web memberikan Claude akses langsung ke konten web real-time, memungkinkannya menjawab pertanyaan dengan informasi terkini di luar pengetahuan cutoff-nya.

---

Alat pencarian web memberikan Claude akses langsung ke konten web real-time, memungkinkannya menjawab pertanyaan dengan informasi terkini di luar pengetahuan cutoff-nya. Claude secara otomatis mengutip sumber dari hasil pencarian sebagai bagian dari jawabannya.

<Note>
Silakan hubungi kami melalui [formulir umpan balik](https://forms.gle/sWjBtsrNEY2oKGuE8) kami untuk berbagi pengalaman Anda dengan alat pencarian web.
</Note>

## Model yang didukung

Pencarian web tersedia di:

- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Sonnet 3.7 ([deprecated](/docs/id/about-claude/model-deprecations)) (`claude-3-7-sonnet-20250219`)
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)
- Claude Haiku 3.5 (`claude-3-5-haiku-latest`)
- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)

## Cara kerja pencarian web

Ketika Anda menambahkan alat pencarian web ke permintaan API Anda:

1. Claude memutuskan kapan harus mencari berdasarkan prompt.
2. API menjalankan pencarian dan memberikan Claude hasil pencarian. Proses ini dapat berulang beberapa kali selama satu permintaan.
3. Di akhir gilirannya, Claude memberikan respons akhir dengan sumber yang dikutip.

## Cara menggunakan pencarian web

<Note>
Administrator organisasi Anda harus mengaktifkan pencarian web di [Console](/settings/privacy).
</Note>

Sediakan alat pencarian web dalam permintaan API Anda:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 1024,
        "messages": [
            {
                "role": "user",
                "content": "What is the weather in NYC?"
            }
        ],
        "tools": [{
            "type": "web_search_20250305",
            "name": "web_search",
            "max_uses": 5
        }]
    }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": "What's the weather in NYC?"
        }
    ],
    tools=[{
        "type": "web_search_20250305",
        "name": "web_search",
        "max_uses": 5
    }]
)
print(response)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

async function main() {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: "What's the weather in NYC?"
      }
    ],
    tools: [{
      type: "web_search_20250305",
      name: "web_search",
      max_uses: 5
    }]
  });

  console.log(response);
}

main().catch(console.error);
```
</CodeGroup>

### Definisi alat

Alat pencarian web mendukung parameter berikut:

```json JSON
{
  "type": "web_search_20250305",
  "name": "web_search",

  // Opsional: Batasi jumlah pencarian per permintaan
  "max_uses": 5,

  // Opsional: Hanya sertakan hasil dari domain ini
  "allowed_domains": ["example.com", "trusteddomain.org"],

  // Opsional: Jangan pernah sertakan hasil dari domain ini
  "blocked_domains": ["untrustedsource.com"],

  // Opsional: Lokalisasi hasil pencarian
  "user_location": {
    "type": "approximate",
    "city": "San Francisco",
    "region": "California",
    "country": "US",
    "timezone": "America/Los_Angeles"
  }
}
```

#### Max uses

Parameter `max_uses` membatasi jumlah pencarian yang dilakukan. Jika Claude mencoba lebih banyak pencarian daripada yang diizinkan, `web_search_tool_result` akan menjadi kesalahan dengan kode kesalahan `max_uses_exceeded`.

#### Penyaringan domain

Saat menggunakan filter domain:

- Domain tidak boleh menyertakan skema HTTP/HTTPS (gunakan `example.com` bukan `https://example.com`)
- Subdomain secara otomatis disertakan (`example.com` mencakup `docs.example.com`)
- Subdomain spesifik membatasi hasil hanya ke subdomain itu (`docs.example.com` mengembalikan hasil hanya dari subdomain itu, bukan dari `example.com` atau `api.example.com`)
- Subpath didukung dan cocok dengan apa pun setelah path (`example.com/blog` cocok dengan `example.com/blog/post-1`)
- Anda dapat menggunakan `allowed_domains` atau `blocked_domains`, tetapi tidak keduanya dalam permintaan yang sama.

**Dukungan wildcard:**

- Hanya satu wildcard (`*`) yang diizinkan per entri domain, dan harus muncul setelah bagian domain (di path)
- Valid: `example.com/*`, `example.com/*/articles`
- Tidak valid: `*.example.com`, `ex*.com`, `example.com/*/news/*`

Format domain yang tidak valid akan mengembalikan kesalahan alat `invalid_tool_input`.

<Note>
Pembatasan domain tingkat permintaan harus kompatibel dengan pembatasan domain tingkat organisasi yang dikonfigurasi di Console. Domain tingkat permintaan hanya dapat lebih membatasi domain, bukan mengganti atau memperluas di luar daftar tingkat organisasi. Jika permintaan Anda menyertakan domain yang bertentangan dengan pengaturan organisasi, API akan mengembalikan kesalahan validasi.
</Note>

#### Lokalisasi

Parameter `user_location` memungkinkan Anda melokalisasi hasil pencarian berdasarkan lokasi pengguna.

- `type`: Jenis lokasi (harus `approximate`)
- `city`: Nama kota
- `region`: Wilayah atau negara bagian
- `country`: Negara
- `timezone`: [ID zona waktu IANA](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).

### Respons

Berikut adalah contoh struktur respons:

```json
{
  "role": "assistant",
  "content": [
    // 1. Keputusan Claude untuk mencari
    {
      "type": "text",
      "text": "I'll search for when Claude Shannon was born."
    },
    // 2. Kueri pencarian yang digunakan
    {
      "type": "server_tool_use",
      "id": "srvtoolu_01WYG3ziw53XMcoyKL4XcZmE",
      "name": "web_search",
      "input": {
        "query": "claude shannon birth date"
      }
    },
    // 3. Hasil pencarian
    {
      "type": "web_search_tool_result",
      "tool_use_id": "srvtoolu_01WYG3ziw53XMcoyKL4XcZmE",
      "content": [
        {
          "type": "web_search_result",
          "url": "https://en.wikipedia.org/wiki/Claude_Shannon",
          "title": "Claude Shannon - Wikipedia",
          "encrypted_content": "EqgfCioIARgBIiQ3YTAwMjY1Mi1mZjM5LTQ1NGUtODgxNC1kNjNjNTk1ZWI3Y...",
          "page_age": "April 30, 2025"
        }
      ]
    },
    {
      "text": "Based on the search results, ",
      "type": "text"
    },
    // 4. Respons Claude dengan kutipan
    {
      "text": "Claude Shannon was born on April 30, 1916, in Petoskey, Michigan",
      "type": "text",
      "citations": [
        {
          "type": "web_search_result_location",
          "url": "https://en.wikipedia.org/wiki/Claude_Shannon",
          "title": "Claude Shannon - Wikipedia",
          "encrypted_index": "Eo8BCioIAhgBIiQyYjQ0OWJmZi1lNm..",
          "cited_text": "Claude Elwood Shannon (April 30, 1916 – February 24, 2001) was an American mathematician, electrical engineer, computer scientist, cryptographer and i..."
        }
      ]
    }
  ],
  "id": "msg_a930390d3a",
  "usage": {
    "input_tokens": 6039,
    "output_tokens": 931,
    "server_tool_use": {
      "web_search_requests": 1
    }
  },
  "stop_reason": "end_turn"
}
```

#### Hasil pencarian

Hasil pencarian mencakup:

- `url`: URL halaman sumber
- `title`: Judul halaman sumber
- `page_age`: Kapan situs terakhir diperbarui
- `encrypted_content`: Konten terenkripsi yang harus diteruskan kembali dalam percakapan multi-turn untuk kutipan

#### Kutipan

Kutipan selalu diaktifkan untuk pencarian web, dan setiap `web_search_result_location` mencakup:

- `url`: URL sumber yang dikutip
- `title`: Judul sumber yang dikutip
- `encrypted_index`: Referensi yang harus diteruskan kembali untuk percakapan multi-turn.
- `cited_text`: Hingga 150 karakter konten yang dikutip

Bidang kutipan pencarian web `cited_text`, `title`, dan `url` tidak dihitung terhadap penggunaan token input atau output.

<Note>
  Saat menampilkan output API langsung kepada pengguna akhir, kutipan harus disertakan ke sumber asli. Jika Anda membuat modifikasi pada output API, termasuk dengan memproses ulang dan/atau menggabungkannya dengan materi Anda sendiri sebelum menampilkannya kepada pengguna akhir, tampilkan kutipan sesuai kebutuhan berdasarkan konsultasi dengan tim hukum Anda.
</Note>

#### Kesalahan

Ketika alat pencarian web mengalami kesalahan (seperti mencapai batas laju), Claude API masih mengembalikan respons 200 (sukses). Kesalahan direpresentasikan dalam badan respons menggunakan struktur berikut:

```json
{
  "type": "web_search_tool_result",
  "tool_use_id": "servertoolu_a93jad",
  "content": {
    "type": "web_search_tool_result_error",
    "error_code": "max_uses_exceeded"
  }
}
```

Ini adalah kode kesalahan yang mungkin:

- `too_many_requests`: Batas laju terlampaui
- `invalid_input`: Parameter kueri pencarian tidak valid
- `max_uses_exceeded`: Penggunaan alat pencarian web maksimum terlampaui
- `query_too_long`: Kueri melebihi panjang maksimum
- `unavailable`: Kesalahan internal terjadi

#### Alasan penghentian `pause_turn`

Respons dapat menyertakan alasan penghentian `pause_turn`, yang menunjukkan bahwa API menjeda giliran yang berjalan lama. Anda dapat memberikan respons kembali apa adanya dalam permintaan berikutnya untuk membiarkan Claude melanjutkan gilirannya, atau memodifikasi konten jika Anda ingin mengganggu percakapan.

## Prompt caching

Pencarian web bekerja dengan [prompt caching](/docs/id/build-with-claude/prompt-caching). Untuk mengaktifkan prompt caching, tambahkan setidaknya satu breakpoint `cache_control` dalam permintaan Anda. Sistem akan secara otomatis cache hingga blok `web_search_tool_result` terakhir saat menjalankan alat.

Untuk percakapan multi-turn, atur breakpoint `cache_control` pada atau setelah blok `web_search_tool_result` terakhir untuk menggunakan kembali konten yang di-cache.

Misalnya, untuk menggunakan prompt caching dengan pencarian web untuk percakapan multi-turn:

<CodeGroup>
```python
import anthropic

client = anthropic.Anthropic()

# Permintaan pertama dengan pencarian web dan breakpoint cache
messages = [
    {
        "role": "user",
        "content": "What's the current weather in San Francisco today?"
    }
]

response1 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=messages,
    tools=[{
        "type": "web_search_20250305",
        "name": "web_search",
        "user_location": {
            "type": "approximate",
            "city": "San Francisco",
            "region": "California",
            "country": "US",
            "timezone": "America/Los_Angeles"
        }
    }]
)

# Tambahkan respons Claude ke percakapan
messages.append({
    "role": "assistant",
    "content": response1.content
})

# Permintaan kedua dengan breakpoint cache setelah hasil pencarian
messages.append({
    "role": "user",
    "content": "Should I expect rain later this week?",
    "cache_control": {"type": "ephemeral"}  # Cache hingga titik ini
})

response2 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=messages,
    tools=[{
        "type": "web_search_20250305",
        "name": "web_search",
        "user_location": {
            "type": "approximate",
            "city": "San Francisco",
            "region": "California",
            "country": "US",
            "timezone": "America/Los_Angeles"
        }
    }]
)
# Respons kedua akan mendapat manfaat dari hasil pencarian yang di-cache
# sambil masih dapat melakukan pencarian baru jika diperlukan
print(f"Cache read tokens: {response2.usage.get('cache_read_input_tokens', 0)}")
```

</CodeGroup>

## Streaming

Dengan streaming diaktifkan, Anda akan menerima acara pencarian sebagai bagian dari aliran. Akan ada jeda saat pencarian dijalankan:

```javascript
event: message_start
data: {"type": "message_start", "message": {"id": "msg_abc123", "type": "message"}}

event: content_block_start
data: {"type": "content_block_start", "index": 0, "content_block": {"type": "text", "text": ""}}

// Keputusan Claude untuk mencari

event: content_block_start
data: {"type": "content_block_start", "index": 1, "content_block": {"type": "server_tool_use", "id": "srvtoolu_xyz789", "name": "web_search"}}

// Kueri pencarian di-streaming
event: content_block_delta
data: {"type": "content_block_delta", "index": 1, "delta": {"type": "input_json_delta", "partial_json": "{\"query\":\"latest quantum computing breakthroughs 2025\"}"}}

// Jeda saat pencarian dijalankan

// Hasil pencarian di-streaming
event: content_block_start
data: {"type": "content_block_start", "index": 2, "content_block": {"type": "web_search_tool_result", "tool_use_id": "srvtoolu_xyz789", "content": [{"type": "web_search_result", "title": "Quantum Computing Breakthroughs in 2025", "url": "https://example.com"}]}}

// Respons Claude dengan kutipan (dihilangkan dalam contoh ini)
```

## Permintaan batch

Anda dapat menyertakan alat pencarian web dalam [Messages Batches API](/docs/id/build-with-claude/batch-processing). Panggilan alat pencarian web melalui Messages Batches API dihargai sama dengan yang ada dalam permintaan Messages API biasa.

## Penggunaan dan harga

Web search usage is charged in addition to token usage:

```json
"usage": {
  "input_tokens": 105,
  "output_tokens": 6039,
  "cache_read_input_tokens": 7123,
  "cache_creation_input_tokens": 7345,
  "server_tool_use": {
    "web_search_requests": 1
  }
}
```

Web search is available on the Claude API for **$10 per 1,000 searches**, plus standard token costs for search-generated content. Web search results retrieved throughout a conversation are counted as input tokens, in search iterations executed during a single turn and in subsequent conversation turns.

Each web search counts as one use, regardless of the number of results returned. If an error occurs during web search, the web search will not be billed.