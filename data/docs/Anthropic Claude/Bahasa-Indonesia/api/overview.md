# Ikhtisar API

Pelajari tentang Claude API, termasuk autentikasi, endpoint yang tersedia, SDK klien, dan contoh permintaan dasar.

---

Claude API adalah API RESTful di `https://api.anthropic.com` yang menyediakan akses terprogram ke model Claude. API utama adalah Messages API (`POST /v1/messages`) untuk interaksi percakapan.

<Note>
**Baru mengenal Claude?** Mulai dengan [Memulai](/docs/id/get-started) untuk prasyarat dan panggilan API pertama Anda, atau lihat [Bekerja dengan Pesan](/docs/id/build-with-claude/working-with-messages) untuk pola permintaan/respons dan contoh.
</Note>

## Prasyarat

Untuk menggunakan Claude API, Anda memerlukan:

- Akun [Konsol Anthropic](https://console.anthropic.com)
- [Kunci API](/settings/keys)

Untuk instruksi pengaturan langkah demi langkah, lihat [Memulai](/docs/id/get-started).

## API yang Tersedia

Claude API mencakup API berikut:

**Ketersediaan Umum:**
- **[Messages API](/docs/id/api/messages)**: Kirim pesan ke Claude untuk interaksi percakapan (`POST /v1/messages`)
- **[Message Batches API](/docs/id/api/creating-message-batches)**: Proses volume besar permintaan Messages secara asinkron dengan pengurangan biaya 50% (`POST /v1/messages/batches`)
- **[Token Counting API](/docs/id/api/messages-count-tokens)**: Hitung token dalam pesan sebelum mengirim untuk mengelola biaya dan batas laju (`POST /v1/messages/count_tokens`)
- **[Models API](/docs/id/api/models-list)**: Daftar model Claude yang tersedia dan detailnya (`GET /v1/models`)

**Beta:**
- **[Files API](/docs/id/api/files-create)**: Unggah dan kelola file untuk digunakan di berbagai panggilan API (`POST /v1/files`, `GET /v1/files`)
- **[Skills API](/docs/id/api/skills/create-skill)**: Buat dan kelola keterampilan agen khusus (`POST /v1/skills`, `GET /v1/skills`)

Untuk referensi API lengkap dengan semua endpoint, parameter, dan skema respons, jelajahi halaman referensi API yang tercantum dalam navigasi. Untuk mengakses fitur beta, lihat [Header beta](/docs/id/api/beta-headers).

## Autentikasi

Semua permintaan ke Claude API harus menyertakan header ini:

| Header | Nilai | Diperlukan |
|--------|-------|----------|
| `x-api-key` | Kunci API Anda dari Konsol | Ya |
| `anthropic-version` | Versi API (misalnya, `2023-06-01`) | Ya |
| `content-type` | `application/json` | Ya |

Jika Anda menggunakan [SDK Klien](#client-sdks), SDK akan mengirim header ini secara otomatis. Untuk detail versioning API, lihat [Versi API](/docs/id/api/versioning).

### Mendapatkan Kunci API

API tersedia melalui [Konsol](https://console.anthropic.com/) web. Anda dapat menggunakan [Workbench](https://console.anthropic.com/workbench) untuk mencoba API di browser dan kemudian menghasilkan kunci API di [Pengaturan Akun](https://console.anthropic.com/settings/keys). Gunakan [workspace](https://console.anthropic.com/settings/workspaces) untuk membagi kunci API Anda dan [mengontrol pengeluaran](/docs/id/api/rate-limits) berdasarkan kasus penggunaan.

## SDK Klien

Anthropic menyediakan SDK resmi yang menyederhanakan integrasi API dengan menangani autentikasi, pemformatan permintaan, penanganan kesalahan, dan banyak lagi.

**Manfaat**:
- Manajemen header otomatis (x-api-key, anthropic-version, content-type)
- Penanganan permintaan dan respons yang aman tipe
- Logika pengulangan bawaan dan penanganan kesalahan
- Dukungan streaming
- Timeout permintaan dan manajemen koneksi

**Contoh** (Python):
```python
from anthropic import Anthropic

client = Anthropic()  # Membaca ANTHROPIC_API_KEY dari lingkungan
message = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello, Claude"}]
)
```

Untuk daftar SDK klien dan instruksi instalasi masing-masing, lihat [SDK Klien](/docs/id/api/client-sdks).

## Claude API vs Platform Pihak Ketiga

Claude tersedia melalui API langsung Anthropic dan melalui platform mitra. Pilih berdasarkan infrastruktur, persyaratan kepatuhan, dan preferensi harga Anda.

### Claude API

- **Akses langsung** ke model dan fitur terbaru terlebih dahulu
- **Penagihan dan dukungan Anthropic**
- **Terbaik untuk**: Integrasi baru, akses fitur penuh, hubungan langsung dengan Anthropic

### API Platform Pihak Ketiga

Akses Claude melalui AWS, Google Cloud, atau Microsoft Azure:
- **Terintegrasi** dengan penagihan dan IAM penyedia cloud
- **Mungkin memiliki penundaan fitur** atau perbedaan dari API langsung
- **Terbaik untuk**: Komitmen cloud yang ada, persyaratan kepatuhan khusus, penagihan cloud terpadu

| Platform | Penyedia | Dokumentasi |
|----------|----------|---------------|
| Amazon Bedrock | AWS | [Claude di Amazon Bedrock](/docs/id/build-with-claude/claude-on-amazon-bedrock) |
| Vertex AI | Google Cloud | [Claude di Vertex AI](/docs/id/build-with-claude/claude-on-vertex-ai) |
| Azure AI | Microsoft Azure | [Claude di Azure AI](/docs/id/build-with-claude/claude-in-microsoft-foundry) |

<Note>
Untuk ketersediaan fitur di seluruh platform, lihat [Ikhtisar fitur](/docs/id/build-with-claude/overview).
</Note>

## Format Permintaan dan Respons

### Batas Ukuran Permintaan

API memiliki ukuran permintaan maksimum yang berbeda tergantung pada endpoint:

| Endpoint | Ukuran Maksimum |
|----------|--------------|
| Endpoint standar (Messages, Token Counting) | 32 MB |
| [Batch API](/docs/id/build-with-claude/batch-processing) | 256 MB |
| [Files API](/docs/id/build-with-claude/files) | 500 MB |

Jika Anda melampaui batas ini, Anda akan menerima kesalahan `request_too_large` 413.

### Header Respons

Claude API menyertakan header berikut dalam setiap respons:

- `request-id`: Pengenal unik global untuk permintaan
- `anthropic-organization-id`: ID organisasi yang terkait dengan kunci API yang digunakan dalam permintaan

## Batas Laju dan Ketersediaan

### Batas Laju

API memberlakukan batas laju dan batas pengeluaran untuk mencegah penyalahgunaan dan mengelola kapasitas. Batas diatur ke dalam tingkat penggunaan yang meningkat secara otomatis saat Anda menggunakan API. Setiap tingkat memiliki:

- **Batas pengeluaran**: Biaya bulanan maksimum untuk penggunaan API
- **Batas laju**: Jumlah maksimum permintaan per menit (RPM) dan token per menit (TPM)

Anda dapat melihat batas organisasi Anda saat ini di [Konsol](/settings/limits). Untuk batas yang lebih tinggi atau Priority Tier (tingkat layanan yang ditingkatkan dengan pengeluaran berkomitmen), hubungi penjualan melalui Konsol.

Untuk informasi terperinci tentang batas, tingkat, dan algoritma token bucket yang digunakan untuk pembatasan laju, lihat [Batas laju](/docs/id/api/rate-limits).

### Ketersediaan

Claude API tersedia di [banyak negara dan wilayah](/docs/id/api/supported-regions) di seluruh dunia. Periksa halaman wilayah yang didukung untuk mengonfirmasi ketersediaan di lokasi Anda.

## Contoh Dasar

Berikut adalah permintaan minimal menggunakan Messages API:

```bash
curl https://api.anthropic.com/v1/messages \
  --header "x-api-key: $ANTHROPIC_API_KEY" \
  --header "anthropic-version: 2023-06-01" \
  --header "content-type: application/json" \
  --data '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "Hello, Claude"}
    ]
  }'
```

**Respons:**
```json
{
  "id": "msg_01XFDUDYJgAACzvnptvVoYEL",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "Hello! How can I assist you today?"
    }
  ],
  "model": "claude-sonnet-4-5",
  "stop_reason": "end_turn",
  "usage": {
    "input_tokens": 12,
    "output_tokens": 8
  }
}
```

Untuk contoh lengkap dan tutorial, lihat [Memulai](/docs/id/get-started) dan [Bekerja dengan Pesan](/docs/id/build-with-claude/working-with-messages).

## Langkah Berikutnya

<CardGroup cols={3}>
  <Card title="Memulai" icon="rocket" href="/docs/id/get-started">
    Prasyarat, tutorial langkah demi langkah, dan contoh dalam berbagai bahasa
  </Card>
  <Card title="Bekerja dengan Pesan" icon="message" href="/docs/id/build-with-claude/working-with-messages">
    Pola permintaan/respons, percakapan multi-giliran, dan praktik terbaik
  </Card>
  <Card title="Referensi Messages API" icon="book" href="/docs/id/api/messages">
    Spesifikasi API lengkap: parameter, respons, dan kode kesalahan
  </Card>
  <Card title="SDK Klien" icon="code" href="/docs/id/api/client-sdks">
    Panduan instalasi untuk Python, TypeScript, Java, Go, C#, Ruby, dan PHP
  </Card>
  <Card title="Ikhtisar fitur" icon="grid" href="/docs/id/build-with-claude/overview">
    Jelajahi kemampuan: caching, visi, penggunaan alat, streaming, dan banyak lagi
  </Card>
  <Card title="Batas laju" icon="gauge" href="/docs/id/api/rate-limits">
    Tingkat penggunaan, batas pengeluaran, dan pembatasan laju dengan algoritma token bucket
  </Card>
</CardGroup>