# Alat web fetch

Alat web fetch memungkinkan Claude untuk mengambil konten lengkap dari halaman web dan dokumen PDF yang ditentukan.

---

Alat web fetch memungkinkan Claude untuk mengambil konten lengkap dari halaman web dan dokumen PDF yang ditentukan.

<Note>
Alat web fetch saat ini dalam beta. Untuk mengaktifkannya, gunakan header beta `web-fetch-2025-09-10` dalam permintaan API Anda.

Silakan gunakan [formulir ini](https://forms.gle/NhWcgmkcvPCMmPE86) untuk memberikan umpan balik tentang kualitas respons model, API itu sendiri, atau kualitas dokumentasi.
</Note>

<Warning>
Mengaktifkan alat web fetch di lingkungan di mana Claude memproses input yang tidak dipercaya bersama data sensitif menimbulkan risiko exfiltration data. Kami merekomendasikan hanya menggunakan alat ini di lingkungan terpercaya atau saat menangani data non-sensitif.

Untuk meminimalkan risiko exfiltration, Claude tidak diizinkan untuk secara dinamis membuat URL. Claude hanya dapat mengambil URL yang telah secara eksplisit disediakan oleh pengguna atau yang berasal dari hasil web search atau web fetch sebelumnya. Namun, masih ada risiko residual yang harus dipertimbangkan dengan hati-hati saat menggunakan alat ini.

Jika exfiltration data menjadi perhatian, pertimbangkan:
- Menonaktifkan alat web fetch sepenuhnya
- Menggunakan parameter `max_uses` untuk membatasi jumlah permintaan
- Menggunakan parameter `allowed_domains` untuk membatasi ke domain yang diketahui aman
</Warning>

## Model yang didukung

Web fetch tersedia di:

- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Sonnet 3.7 ([deprecated](/docs/id/about-claude/model-deprecations)) (`claude-3-7-sonnet-20250219`)
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)
- Claude Haiku 3.5 (`claude-3-5-haiku-latest`)
- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)

## Cara kerja web fetch

Ketika Anda menambahkan alat web fetch ke permintaan API Anda:

1. Claude memutuskan kapan harus mengambil konten berdasarkan prompt dan URL yang tersedia.
2. API mengambil konten teks lengkap dari URL yang ditentukan.
3. Untuk PDF, ekstraksi teks otomatis dilakukan.
4. Claude menganalisis konten yang diambil dan memberikan respons dengan kutipan opsional.

<Note>
Alat web fetch saat ini tidak mendukung situs web yang dirender secara dinamis melalui Javascript.
</Note>

## Cara menggunakan web fetch

Sediakan alat web fetch dalam permintaan API Anda:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: web-fetch-2025-09-10" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 1024,
        "messages": [
            {
                "role": "user",
                "content": "Please analyze the content at https://example.com/article"
            }
        ],
        "tools": [{
            "type": "web_fetch_20250910",
            "name": "web_fetch",
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
            "content": "Please analyze the content at https://example.com/article"
        }
    ],
    tools=[{
        "type": "web_fetch_20250910",
        "name": "web_fetch",
        "max_uses": 5
    }],
    extra_headers={
        "anthropic-beta": "web-fetch-2025-09-10"
    }
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
        content: "Please analyze the content at https://example.com/article"
      }
    ],
    tools: [{
      type: "web_fetch_20250910",
      name: "web_fetch",
      max_uses: 5
    }],
    headers: {
      "anthropic-beta": "web-fetch-2025-09-10"
    }
  });

  console.log(response);
}

main().catch(console.error);
```
</CodeGroup>

### Definisi alat

Alat web fetch mendukung parameter berikut:

```json JSON
{
  "type": "web_fetch_20250910",
  "name": "web_fetch",

  // Optional: Limit the number of fetches per request
  "max_uses": 10,

  // Optional: Only fetch from these domains
  "allowed_domains": ["example.com", "docs.example.com"],

  // Optional: Never fetch from these domains
  "blocked_domains": ["private.example.com"],

  // Optional: Enable citations for fetched content
  "citations": {
    "enabled": true
  },

  // Optional: Maximum content length in tokens
  "max_content_tokens": 100000
}
```

#### Max uses

Parameter `max_uses` membatasi jumlah web fetch yang dilakukan. Jika Claude mencoba lebih banyak fetch daripada yang diizinkan, `web_fetch_tool_result` akan menjadi error dengan kode error `max_uses_exceeded`. Saat ini tidak ada batas default.

#### Penyaringan domain

Saat menggunakan filter domain:

- Domain tidak boleh menyertakan skema HTTP/HTTPS (gunakan `example.com` bukan `https://example.com`)
- Subdomain secara otomatis disertakan (`example.com` mencakup `docs.example.com`)
- Subpath didukung (`example.com/blog`)
- Anda dapat menggunakan `allowed_domains` atau `blocked_domains`, tetapi tidak keduanya dalam permintaan yang sama.

<Warning>
Perhatikan bahwa karakter Unicode dalam nama domain dapat menciptakan kerentanan keamanan melalui serangan homograf, di mana karakter yang terlihat serupa dari skrip berbeda dapat melewati filter domain. Misalnya, `аmazon.com` (menggunakan 'а' Cyrillic) mungkin terlihat identik dengan `amazon.com` tetapi mewakili domain yang berbeda.

Saat mengonfigurasi daftar allow/block domain:
- Gunakan nama domain ASCII-only jika memungkinkan
- Pertimbangkan bahwa parser URL dapat menangani normalisasi Unicode secara berbeda
- Uji filter domain Anda dengan variasi homograf potensial
- Audit konfigurasi domain Anda secara teratur untuk karakter Unicode yang mencurigakan
</Warning>

#### Batas konten

Parameter `max_content_tokens` membatasi jumlah konten yang akan disertakan dalam konteks. Jika konten yang diambil melebihi batas ini, akan dipotong. Ini membantu mengontrol penggunaan token saat mengambil dokumen besar.

<Note>
Batas parameter `max_content_tokens` bersifat perkiraan. Jumlah sebenarnya dari token input yang digunakan dapat bervariasi dalam jumlah kecil.
</Note>

#### Kutipan

Tidak seperti web search di mana kutipan selalu diaktifkan, kutipan bersifat opsional untuk web fetch. Atur `"citations": {"enabled": true}` untuk memungkinkan Claude mengutip bagian spesifik dari dokumen yang diambil.

<Note>
Saat menampilkan output API secara langsung kepada pengguna akhir, kutipan harus disertakan ke sumber asli. Jika Anda membuat modifikasi pada output API, termasuk dengan memproses ulang dan/atau menggabungkannya dengan materi Anda sendiri sebelum menampilkannya kepada pengguna akhir, tampilkan kutipan sesuai kebutuhan berdasarkan konsultasi dengan tim hukum Anda.
</Note>

### Respons

Berikut adalah contoh struktur respons:

```json
{
  "role": "assistant",
  "content": [
    // 1. Claude's decision to fetch
    {
      "type": "text",
      "text": "I'll fetch the content from the article to analyze it."
    },
    // 2. The fetch request
    {
      "type": "server_tool_use",
      "id": "srvtoolu_01234567890abcdef",
      "name": "web_fetch",
      "input": {
        "url": "https://example.com/article"
      }
    },
    // 3. Fetch results
    {
      "type": "web_fetch_tool_result",
      "tool_use_id": "srvtoolu_01234567890abcdef",
      "content": {
        "type": "web_fetch_result",
        "url": "https://example.com/article",
        "content": {
          "type": "document",
          "source": {
            "type": "text",
            "media_type": "text/plain",
            "data": "Full text content of the article..."
          },
          "title": "Article Title",
          "citations": {"enabled": true}
        },
        "retrieved_at": "2025-08-25T10:30:00Z"
      }
    },
    // 4. Claude's analysis with citations (if enabled)
    {
      "text": "Based on the article, ",
      "type": "text"
    },
    {
      "text": "the main argument presented is that artificial intelligence will transform healthcare",
      "type": "text",
      "citations": [
        {
          "type": "char_location",
          "document_index": 0,
          "document_title": "Article Title",
          "start_char_index": 1234,
          "end_char_index": 1456,
          "cited_text": "Artificial intelligence is poised to revolutionize healthcare delivery..."
        }
      ]
    }
  ],
  "id": "msg_a930390d3a",
  "usage": {
    "input_tokens": 25039,
    "output_tokens": 931,
    "server_tool_use": {
      "web_fetch_requests": 1
    }
  },
  "stop_reason": "end_turn"
}
```

#### Hasil fetch

Hasil fetch mencakup:

- `url`: URL yang diambil
- `content`: Blok dokumen yang berisi konten yang diambil
- `retrieved_at`: Stempel waktu saat konten diambil

<Note>
Alat web fetch menyimpan hasil dalam cache untuk meningkatkan kinerja dan mengurangi permintaan yang berlebihan. Ini berarti konten yang dikembalikan mungkin bukan versi terbaru yang tersedia di URL. Perilaku cache dikelola secara otomatis dan dapat berubah seiring waktu untuk mengoptimalkan jenis konten dan pola penggunaan yang berbeda.
</Note>

Untuk dokumen PDF, konten akan dikembalikan sebagai data yang dikodekan base64:

```json
{
  "type": "web_fetch_tool_result",
  "tool_use_id": "srvtoolu_02",
  "content": {
    "type": "web_fetch_result",
    "url": "https://example.com/paper.pdf",
    "content": {
      "type": "document",
      "source": {
        "type": "base64",
        "media_type": "application/pdf",
        "data": "JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmo..."
      },
      "citations": {"enabled": true}
    },
    "retrieved_at": "2025-08-25T10:30:02Z"
  }
}
```

#### Error

Ketika alat web fetch mengalami error, Claude API mengembalikan respons 200 (sukses) dengan error yang diwakili dalam badan respons:

```json
{
  "type": "web_fetch_tool_result",
  "tool_use_id": "srvtoolu_a93jad",
  "content": {
    "type": "web_fetch_tool_error",
    "error_code": "url_not_accessible"
  }
}
```

Ini adalah kode error yang mungkin:

- `invalid_input`: Format URL tidak valid
- `url_too_long`: URL melebihi panjang maksimum (250 karakter)
- `url_not_allowed`: URL diblokir oleh aturan penyaringan domain dan pembatasan model
- `url_not_accessible`: Gagal mengambil konten (error HTTP)
- `too_many_requests`: Batas laju terlampaui
- `unsupported_content_type`: Jenis konten tidak didukung (hanya teks dan PDF)
- `max_uses_exceeded`: Penggunaan alat web fetch maksimum terlampaui
- `unavailable`: Terjadi error internal

## Validasi URL

Untuk alasan keamanan, alat web fetch hanya dapat mengambil URL yang sebelumnya muncul dalam konteks percakapan. Ini mencakup:

- URL dalam pesan pengguna
- URL dalam hasil alat sisi klien
- URL dari hasil web search atau web fetch sebelumnya

Alat tidak dapat mengambil URL arbitrer yang dihasilkan Claude atau URL dari alat server berbasis container (Code Execution, Bash, dll.).

## Pencarian dan fetch gabungan

Web fetch bekerja dengan mulus dengan web search untuk pengumpulan informasi yang komprehensif:

```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Find recent articles about quantum computing and analyze the most relevant one in detail"
        }
    ],
    tools=[
        {
            "type": "web_search_20250305",
            "name": "web_search",
            "max_uses": 3
        },
        {
            "type": "web_fetch_20250910",
            "name": "web_fetch",
            "max_uses": 5,
            "citations": {"enabled": True}
        }
    ],
    extra_headers={
        "anthropic-beta": "web-fetch-2025-09-10"
    }
)
```

Dalam alur kerja ini, Claude akan:
1. Menggunakan web search untuk menemukan artikel yang relevan
2. Memilih hasil yang paling menjanjikan
3. Menggunakan web fetch untuk mengambil konten lengkap
4. Memberikan analisis terperinci dengan kutipan

## Prompt caching

Web fetch bekerja dengan [prompt caching](/docs/id/build-with-claude/prompt-caching). Untuk mengaktifkan prompt caching, tambahkan breakpoint `cache_control` dalam permintaan Anda. Hasil fetch yang di-cache dapat digunakan kembali di seluruh putaran percakapan.

```python
import anthropic

client = anthropic.Anthropic()

# First request with web fetch
messages = [
    {
        "role": "user",
        "content": "Analyze this research paper: https://arxiv.org/abs/2024.12345"
    }
]

response1 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=messages,
    tools=[{
        "type": "web_fetch_20250910",
        "name": "web_fetch"
    }],
    extra_headers={
        "anthropic-beta": "web-fetch-2025-09-10"
    }
)

# Add Claude's response to conversation
messages.append({
    "role": "assistant",
    "content": response1.content
})

# Second request with cache breakpoint
messages.append({
    "role": "user",
    "content": "What methodology does the paper use?",
    "cache_control": {"type": "ephemeral"}
})

response2 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=messages,
    tools=[{
        "type": "web_fetch_20250910",
        "name": "web_fetch"
    }],
    extra_headers={
        "anthropic-beta": "web-fetch-2025-09-10"
    }
)

# The second response benefits from cached fetch results
print(f"Cache read tokens: {response2.usage.get('cache_read_input_tokens', 0)}")
```

## Streaming

Dengan streaming diaktifkan, peristiwa fetch adalah bagian dari stream dengan jeda selama pengambilan konten:

```javascript
event: message_start
data: {"type": "message_start", "message": {"id": "msg_abc123", "type": "message"}}

event: content_block_start
data: {"type": "content_block_start", "index": 0, "content_block": {"type": "text", "text": ""}}

// Claude's decision to fetch

event: content_block_start
data: {"type": "content_block_start", "index": 1, "content_block": {"type": "server_tool_use", "id": "srvtoolu_xyz789", "name": "web_fetch"}}

// Fetch URL streamed
event: content_block_delta
data: {"type": "content_block_delta", "index": 1, "delta": {"type": "input_json_delta", "partial_json": "{\"url\":\"https://example.com/article\"}"}}

// Pause while fetch executes

// Fetch results streamed
event: content_block_start
data: {"type": "content_block_start", "index": 2, "content_block": {"type": "web_fetch_tool_result", "tool_use_id": "srvtoolu_xyz789", "content": {"type": "web_fetch_result", "url": "https://example.com/article", "content": {"type": "document", "source": {"type": "text", "media_type": "text/plain", "data": "Article content..."}}}}}

// Claude's response continues...
```

## Permintaan batch

Anda dapat menyertakan alat web fetch dalam [Messages Batches API](/docs/id/build-with-claude/batch-processing). Panggilan alat web fetch melalui Messages Batches API dihargai sama dengan yang ada dalam permintaan Messages API biasa.

## Penggunaan dan harga

Web fetch usage has **no additional charges** beyond standard token costs:

```json
"usage": {
  "input_tokens": 25039,
  "output_tokens": 931,
  "cache_read_input_tokens": 0,
  "cache_creation_input_tokens": 0,
  "server_tool_use": {
    "web_fetch_requests": 1
  }
}
```

The web fetch tool is available on the Claude API at **no additional cost**. You only pay standard token costs for the fetched content that becomes part of your conversation context.

To protect against inadvertently fetching large content that would consume excessive tokens, use the `max_content_tokens` parameter to set appropriate limits based on your use case and budget considerations.

Example token usage for typical content:
- Average web page (10KB): ~2,500 tokens
- Large documentation page (100KB): ~25,000 tokens  
- Research paper PDF (500KB): ~125,000 tokens