# Harga

Pelajari struktur harga Anthropic untuk model dan fitur

---

Halaman ini menyediakan informasi harga terperinci untuk model dan fitur Anthropic. Semua harga dalam USD.

Untuk informasi harga terkini, silakan kunjungi [claude.com/pricing](https://claude.com/pricing).

## Harga model

Tabel berikut menunjukkan harga untuk semua model Claude di berbagai tingkat penggunaan:

| Model             | Base Input Tokens | 5m Cache Writes | 1h Cache Writes | Cache Hits & Refreshes | Output Tokens |
|-------------------|-------------------|-----------------|-----------------|----------------------|---------------|
| Claude Opus 4.5   | $5 / MTok         | $6.25 / MTok    | $10 / MTok      | $0.50 / MTok | $25 / MTok    |
| Claude Opus 4.1   | $15 / MTok        | $18.75 / MTok   | $30 / MTok      | $1.50 / MTok | $75 / MTok    |
| Claude Opus 4     | $15 / MTok        | $18.75 / MTok   | $30 / MTok      | $1.50 / MTok | $75 / MTok    |
| Claude Sonnet 4.5   | $3 / MTok         | $3.75 / MTok    | $6 / MTok       | $0.30 / MTok | $15 / MTok    |
| Claude Sonnet 4   | $3 / MTok         | $3.75 / MTok    | $6 / MTok       | $0.30 / MTok | $15 / MTok    |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations)) | $3 / MTok         | $3.75 / MTok    | $6 / MTok       | $0.30 / MTok | $15 / MTok    |
| Claude Haiku 4.5  | $1 / MTok         | $1.25 / MTok    | $2 / MTok       | $0.10 / MTok | $5 / MTok     |
| Claude Haiku 3.5  | $0.80 / MTok      | $1 / MTok       | $1.6 / MTok     | $0.08 / MTok | $4 / MTok     |
| Claude Opus 3 ([deprecated](/docs/en/about-claude/model-deprecations))    | $15 / MTok        | $18.75 / MTok   | $30 / MTok      | $1.50 / MTok | $75 / MTok    |
| Claude Haiku 3    | $0.25 / MTok      | $0.30 / MTok    | $0.50 / MTok    | $0.03 / MTok | $1.25 / MTok  |

<Note>
MTok = Juta token. Kolom "Base Input Tokens" menunjukkan harga input standar, "Cache Writes" dan "Cache Hits" khusus untuk [prompt caching](/docs/id/build-with-claude/prompt-caching), dan "Output Tokens" menunjukkan harga output. Prompt caching menawarkan durasi cache 5 menit (default) dan 1 jam untuk mengoptimalkan biaya untuk berbagai kasus penggunaan.

Tabel di atas mencerminkan pengganda harga berikut untuk prompt caching:
- Token cache write 5 menit adalah 1,25 kali harga token input dasar
- Token cache write 1 jam adalah 2 kali harga token input dasar
- Token cache read adalah 0,1 kali harga token input dasar
</Note>

## Harga platform pihak ketiga

Model Claude tersedia di [AWS Bedrock](/docs/id/build-with-claude/claude-on-amazon-bedrock), [Google Vertex AI](/docs/id/build-with-claude/claude-on-vertex-ai), dan [Microsoft Foundry](/docs/id/build-with-claude/claude-in-microsoft-foundry). Untuk harga resmi, kunjungi:
- [Harga AWS Bedrock](https://aws.amazon.com/bedrock/pricing/)
- [Harga Google Vertex AI](https://cloud.google.com/vertex-ai/generative-ai/pricing)
- [Harga Microsoft Foundry](https://azure.microsoft.com/en-us/pricing/details/ai-foundry/#pricing)

<Note>
**Harga endpoint regional untuk model Claude 4.5 dan seterusnya**

Mulai dari Claude Sonnet 4.5 dan Haiku 4.5, AWS Bedrock dan Google Vertex AI menawarkan dua jenis endpoint:
- **Endpoint global**: Perutean dinamis di seluruh wilayah untuk ketersediaan maksimal
- **Endpoint regional**: Perutean data dijamin dalam wilayah geografis tertentu

Endpoint regional mencakup premium 10% dibandingkan endpoint global. **Claude API (1P) bersifat global secara default dan tidak terpengaruh oleh perubahan ini.** Claude API bersifat global-only (setara dengan penawaran endpoint global dan harga dari penyedia lain).

**Cakupan**: Struktur harga ini berlaku untuk Claude Sonnet 4.5, Haiku 4.5, dan semua model di masa depan. Model sebelumnya (Claude Sonnet 4, Opus 4, dan rilis sebelumnya) mempertahankan harga yang ada.

Untuk detail implementasi dan contoh kode:
- [Endpoint global vs regional AWS Bedrock](/docs/id/build-with-claude/claude-on-amazon-bedrock#global-vs-regional-endpoints)
- [Endpoint global vs regional Google Vertex AI](/docs/id/build-with-claude/claude-on-vertex-ai#global-vs-regional-endpoints)
</Note>

## Harga khusus fitur

### Pemrosesan batch

Batch API memungkinkan pemrosesan asinkron dari volume besar permintaan dengan diskon 50% untuk token input dan output.

| Model             | Batch input      | Batch output    |
|-------------------|------------------|-----------------|
| Claude Opus 4.5     | $2.50 / MTok     | $12.50 / MTok   |
| Claude Opus 4.1     | $7.50 / MTok     | $37.50 / MTok   |
| Claude Opus 4     | $7.50 / MTok     | $37.50 / MTok   |
| Claude Sonnet 4.5   | $1.50 / MTok     | $7.50 / MTok    |
| Claude Sonnet 4   | $1.50 / MTok     | $7.50 / MTok    |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations)) | $1.50 / MTok     | $7.50 / MTok    |
| Claude Haiku 4.5  | $0.50 / MTok     | $2.50 / MTok    |
| Claude Haiku 3.5  | $0.40 / MTok     | $2 / MTok       |
| Claude Opus 3 ([deprecated](/docs/en/about-claude/model-deprecations))  | $7.50 / MTok     | $37.50 / MTok   |
| Claude Haiku 3    | $0.125 / MTok    | $0.625 / MTok   |

Untuk informasi lebih lanjut tentang pemrosesan batch, lihat [dokumentasi pemrosesan batch](/docs/id/build-with-claude/batch-processing) kami.

### Harga konteks panjang

Saat menggunakan Claude Sonnet 4 atau Sonnet 4.5 dengan [jendela konteks token 1M diaktifkan](/docs/id/build-with-claude/context-windows#1m-token-context-window), permintaan yang melebihi 200K token input secara otomatis dikenakan biaya pada tingkat konteks panjang premium:

<Note>
Jendela konteks token 1M saat ini dalam beta untuk organisasi di [tingkat penggunaan](/docs/id/api/rate-limits) 4 dan organisasi dengan batas laju kustom. Jendela konteks token 1M hanya tersedia untuk Claude Sonnet 4 dan Sonnet 4.5.
</Note>

| ≤ 200K token input | > 200K token input |
|-----------------------------------|-------------------------------------|
| Input: $3 / MTok | Input: $6 / MTok |
| Output: $15 / MTok | Output: $22.50 / MTok |

Harga konteks panjang ditumpuk dengan pengubah harga lainnya:
- Diskon [Batch API 50%](#batch-processing) berlaku untuk harga konteks panjang
- Pengganda [prompt caching](#model-pricing) berlaku di atas harga konteks panjang

<Note>
Bahkan dengan flag beta diaktifkan, permintaan dengan kurang dari 200K token input dikenakan biaya pada tingkat standar. Jika permintaan Anda melebihi 200K token input, semua token dikenakan harga premium.

Ambang batas 200K didasarkan semata-mata pada token input (termasuk cache reads/writes). Jumlah token output tidak mempengaruhi pemilihan tingkat harga, meskipun token output dikenakan biaya pada tingkat lebih tinggi ketika ambang batas input terlampaui.
</Note>

Untuk memeriksa apakah permintaan API Anda dikenakan biaya pada tingkat jendela konteks 1M, periksa objek `usage` dalam respons API:

```json
{
  "usage": {
    "input_tokens": 250000,
    "cache_creation_input_tokens": 0,
    "cache_read_input_tokens": 0,
    "output_tokens": 500
  }
}
```

Hitung total token input dengan menjumlahkan:
- `input_tokens`
- `cache_creation_input_tokens` (jika menggunakan prompt caching)
- `cache_read_input_tokens` (jika menggunakan prompt caching)

Jika total melebihi 200.000 token, seluruh permintaan ditagih pada tingkat konteks 1M.

Untuk informasi lebih lanjut tentang objek `usage`, lihat [dokumentasi respons API](/docs/id/api/messages#response-usage).

### Harga penggunaan alat

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

Untuk harga per-model saat ini, lihat bagian [harga model](#model-pricing) kami di atas.

Untuk informasi lebih lanjut tentang implementasi penggunaan alat dan praktik terbaik, lihat [dokumentasi penggunaan alat](/docs/id/agents-and-tools/tool-use/overview) kami.

### Harga alat spesifik

#### Alat Bash

The bash tool adds **245 input tokens** to your API calls.

Additional tokens are consumed by:
- Command outputs (stdout/stderr)
- Error messages
- Large file contents

Lihat [harga penggunaan alat](#tool-use-pricing) untuk detail harga lengkap.

#### Alat eksekusi kode

Code execution tool usage is tracked separately from token usage. Execution time has a minimum of 5 minutes.
If files are included in the request, execution time is billed even if the tool is not used due to files being preloaded onto the container.

Each organization receives 50 free hours of usage with the code execution tool per day. Additional usage beyond the first 50 hours is billed at $0.05 per hour, per container.

#### Alat editor teks

The text editor tool uses the same pricing structure as other tools used with Claude. It follows the standard input and output token pricing based on the Claude model you're using.

In addition to the base tokens, the following additional input tokens are needed for the text editor tool:

| Tool | Additional input tokens |
| ----------------------------------------- | --------------------------------------- |
| `text_editor_20250429` (Claude 4.x) | 700 tokens |
| `text_editor_20250124` (Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations))) | 700 tokens |

Lihat [harga penggunaan alat](#tool-use-pricing) untuk detail harga lengkap.

#### Alat pencarian web

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

#### Alat pengambilan web

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

#### Alat penggunaan komputer

Computer use follows the standard [tool use pricing](/docs/en/agents-and-tools/tool-use/overview#pricing). When using the computer use tool:

**System prompt overhead**: The computer use beta adds 466-499 tokens to the system prompt

**Computer use tool token usage**:
| Model | Input tokens per tool definition |
| ----- | -------------------------------- |
| Claude 4.x models | 735 tokens |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations)) | 735 tokens |

**Additional token consumption**:
- Screenshot images (see [Vision pricing](/docs/en/build-with-claude/vision))
- Tool execution results returned to Claude

<Note>
If you're also using bash or text editor tools alongside computer use, those tools have their own token costs as documented in their respective pages.
</Note>

## Contoh harga kasus penggunaan agen

Memahami harga untuk aplikasi agen sangat penting saat membangun dengan Claude. Contoh dunia nyata ini dapat membantu Anda memperkirakan biaya untuk pola agen yang berbeda.

### Contoh agen dukungan pelanggan

Saat membangun agen dukungan pelanggan, berikut adalah cara biaya dapat terbagi:

<Note>
  Contoh perhitungan untuk memproses 10.000 tiket dukungan:
  - Rata-rata ~3.700 token per percakapan
  - Menggunakan Claude Sonnet 4.5 pada $3/MTok input, $15/MTok output
  - Total biaya: ~$22.20 per 10.000 tiket
</Note>

Untuk panduan terperinci tentang perhitungan ini, lihat [panduan agen dukungan pelanggan](/docs/id/about-claude/use-case-guides/customer-support-chat) kami.

### Harga alur kerja agen umum

Untuk arsitektur agen yang lebih kompleks dengan beberapa langkah:

1. **Pemrosesan permintaan awal**
   - Input tipikal: 500-1.000 token
   - Biaya pemrosesan: ~$0.003 per permintaan

2. **Pengambilan memori dan konteks**
   - Konteks yang diambil: 2.000-5.000 token
   - Biaya per pengambilan: ~$0.015 per operasi

3. **Perencanaan dan eksekusi tindakan**
   - Token perencanaan: 1.000-2.000
   - Umpan balik eksekusi: 500-1.000
   - Biaya gabungan: ~$0.045 per tindakan

Untuk panduan komprehensif tentang pola harga agen, lihat [panduan kasus penggunaan agen](/docs/id/about-claude/use-case-guides) kami.

### Strategi optimasi biaya

Saat membangun agen dengan Claude:

1. **Gunakan model yang sesuai**: Pilih Haiku untuk tugas sederhana, Sonnet untuk penalaran kompleks
2. **Implementasikan prompt caching**: Kurangi biaya untuk konteks berulang
3. **Operasi batch**: Gunakan Batch API untuk tugas yang tidak sensitif waktu
4. **Pantau pola penggunaan**: Lacak konsumsi token untuk mengidentifikasi peluang optimasi

<Tip>
  Untuk aplikasi agen volume tinggi, pertimbangkan untuk menghubungi [tim penjualan enterprise](/docs/id/contact-sales) kami untuk pengaturan harga kustom.
</Tip>

## Pertimbangan harga tambahan

### Batas laju

Batas laju bervariasi menurut tingkat penggunaan dan mempengaruhi berapa banyak permintaan yang dapat Anda buat:

- **Tier 1**: Penggunaan tingkat entry dengan batas dasar
- **Tier 2**: Batas yang ditingkatkan untuk aplikasi yang berkembang
- **Tier 3**: Batas lebih tinggi untuk aplikasi yang sudah mapan
- **Tier 4**: Batas standar maksimal
- **Enterprise**: Batas kustom tersedia

Untuk informasi batas laju terperinci, lihat [dokumentasi batas laju](/docs/id/api/rate-limits) kami.

Untuk batas laju lebih tinggi atau pengaturan harga kustom, [hubungi tim penjualan kami](https://claude.com/contact-sales).

### Diskon volume

Diskon volume mungkin tersedia untuk pengguna volume tinggi. Ini dinegosiasikan berdasarkan kasus per kasus.

- Tier standar menggunakan harga yang ditunjukkan di atas
- Pelanggan enterprise dapat [menghubungi penjualan](mailto:sales@anthropic.com) untuk harga kustom
- Diskon akademik dan penelitian mungkin tersedia

### Harga enterprise

Untuk pelanggan enterprise dengan kebutuhan khusus:

- Batas laju kustom
- Diskon volume
- Dukungan khusus
- Syarat kustom

Hubungi tim penjualan kami di [sales@anthropic.com](mailto:sales@anthropic.com) atau melalui [Claude Console](/settings/limits) untuk membahas opsi harga enterprise.

## Penagihan dan pembayaran

- Penagihan dihitung bulanan berdasarkan penggunaan aktual
- Pembayaran diproses dalam USD
- Opsi kartu kredit dan faktur tersedia
- Pelacakan penggunaan tersedia di [Claude Console](/)

## Pertanyaan yang sering diajukan

**Bagaimana penggunaan token dihitung?**

Token adalah potongan teks yang diproses model. Sebagai perkiraan kasar, 1 token kira-kira 4 karakter atau 0,75 kata dalam bahasa Inggris. Jumlah pastinya bervariasi menurut bahasa dan jenis konten.

**Apakah ada tier gratis atau uji coba?**

Pengguna baru menerima sejumlah kecil kredit gratis untuk menguji API. [Hubungi penjualan](mailto:sales@anthropic.com) untuk informasi tentang uji coba yang diperpanjang untuk evaluasi enterprise.

**Bagaimana diskon ditumpuk?**

Diskon Batch API dan prompt caching dapat digabungkan. Misalnya, menggunakan kedua fitur bersama-sama memberikan penghematan biaya yang signifikan dibandingkan dengan panggilan API standar.

**Metode pembayaran apa yang diterima?**

Kami menerima kartu kredit utama untuk akun standar. Pelanggan enterprise dapat mengatur faktur dan metode pembayaran lainnya.

Untuk pertanyaan tambahan tentang harga, hubungi [support@anthropic.com](mailto:support@anthropic.com).