# Claude Code Analytics API

Akses secara terprogram metrik analitik penggunaan Claude Code organisasi Anda dan metrik produktivitas dengan Claude Code Analytics Admin API.

---

<Tip>
**The Admin API is unavailable for individual accounts.** To collaborate with teammates and add members, set up your organization in **Console → Settings → Organization**.
</Tip>

Claude Code Analytics Admin API menyediakan akses terprogram ke metrik penggunaan harian yang diagregasi untuk pengguna Claude Code, memungkinkan organisasi untuk menganalisis produktivitas pengembang dan membangun dasbor khusus. API ini menjembatani kesenjangan antara [dasbor Analytics](/claude-code) dasar kami dan integrasi OpenTelemetry yang kompleks.

API ini memungkinkan Anda untuk lebih baik memantau, menganalisis, dan mengoptimalkan adopsi Claude Code Anda:

* **Analisis Produktivitas Pengembang:** Lacak sesi, baris kode yang ditambahkan/dihapus, komit, dan permintaan tarik yang dibuat menggunakan Claude Code
* **Metrik Penggunaan Alat:** Pantau tingkat penerimaan dan penolakan untuk alat Claude Code yang berbeda (Edit, Write, NotebookEdit)
* **Analisis Biaya:** Lihat perkiraan biaya dan penggunaan token yang dipecah berdasarkan model Claude
* **Pelaporan Khusus:** Ekspor data untuk membangun dasbor eksekutif dan laporan untuk tim manajemen
* **Justifikasi Penggunaan:** Berikan metrik untuk membenarkan dan memperluas adopsi Claude Code secara internal

<Check>
  **Kunci API Admin diperlukan**
  
  API ini adalah bagian dari [Admin API](/docs/id/build-with-claude/administration-api). Titik akhir ini memerlukan kunci Admin API (dimulai dengan `sk-ant-admin...`) yang berbeda dari kunci API standar. Hanya anggota organisasi dengan peran admin yang dapat menyediakan kunci Admin API melalui [Konsol Claude](/settings/admin-keys).
</Check>

## Mulai cepat

Dapatkan analitik Claude Code organisasi Anda untuk hari tertentu:

```bash
curl "https://api.anthropic.com/v1/organizations/usage_report/claude_code?\
starting_at=2025-09-08&\
limit=20" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

<Tip>
  **Atur header User-Agent untuk integrasi**
  
  Jika Anda membangun integrasi, atur header User-Agent Anda untuk membantu kami memahami pola penggunaan:
  ```
  User-Agent: YourApp/1.0.0 (https://yourapp.com)
  ```
</Tip>

## Claude Code Analytics API

Lacak penggunaan Claude Code, metrik produktivitas, dan aktivitas pengembang di seluruh organisasi Anda dengan titik akhir `/v1/organizations/usage_report/claude_code`.

### Konsep kunci

- **Agregasi harian**: Mengembalikan metrik untuk satu hari yang ditentukan oleh parameter `starting_at`
- **Data tingkat pengguna**: Setiap catatan mewakili aktivitas satu pengguna untuk hari yang ditentukan
- **Metrik produktivitas**: Lacak sesi, baris kode, komit, permintaan tarik, dan penggunaan alat
- **Data token dan biaya**: Pantau penggunaan dan perkiraan biaya yang dipecah berdasarkan model Claude
- **Paginasi berbasis kursor**: Tangani kumpulan data besar dengan paginasi stabil menggunakan kursor buram
- **Kesegaran data**: Metrik tersedia dengan penundaan hingga 1 jam untuk konsistensi

Untuk detail parameter lengkap dan skema respons, lihat [referensi Claude Code Analytics API](/docs/id/api/admin-api/claude-code/get-claude-code-usage-report).

### Contoh dasar

#### Dapatkan analitik untuk hari tertentu

```bash
curl "https://api.anthropic.com/v1/organizations/usage_report/claude_code?\
starting_at=2025-09-08" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

#### Dapatkan analitik dengan paginasi

```bash
# Permintaan pertama
curl "https://api.anthropic.com/v1/organizations/usage_report/claude_code?\
starting_at=2025-09-08&\
limit=20" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"

# Permintaan berikutnya menggunakan kursor dari respons
curl "https://api.anthropic.com/v1/organizations/usage_report/claude_code?\
starting_at=2025-09-08&\
page=page_MjAyNS0wNS0xNFQwMDowMDowMFo=" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

### Parameter permintaan

| Parameter | Tipe | Diperlukan | Deskripsi |
|-----------|------|----------|-------------|
| `starting_at` | string | Ya | Tanggal UTC dalam format YYYY-MM-DD. Mengembalikan metrik untuk hari tunggal ini saja |
| `limit` | integer | Tidak | Jumlah catatan per halaman (default: 20, maks: 1000) |
| `page` | string | Tidak | Token kursor buram dari field `next_page` respons sebelumnya |

### Metrik yang tersedia

Setiap catatan respons berisi metrik berikut untuk satu pengguna pada satu hari:

#### Dimensi
- **date**: Tanggal dalam format RFC 3339 (stempel waktu UTC)
- **actor**: Pengguna atau kunci API yang melakukan tindakan Claude Code (baik `user_actor` dengan `email_address` atau `api_actor` dengan `api_key_name`)
- **organization_id**: UUID organisasi
- **customer_type**: Jenis akun pelanggan (`api` untuk pelanggan API, `subscription` untuk pelanggan Pro/Team)
- **terminal_type**: Jenis terminal atau lingkungan tempat Claude Code digunakan (misalnya, `vscode`, `iTerm.app`, `tmux`)

#### Metrik inti
- **num_sessions**: Jumlah sesi Claude Code yang berbeda yang dimulai oleh aktor ini
- **lines_of_code.added**: Jumlah total baris kode yang ditambahkan di semua file oleh Claude Code
- **lines_of_code.removed**: Jumlah total baris kode yang dihapus di semua file oleh Claude Code
- **commits_by_claude_code**: Jumlah komit git yang dibuat melalui fungsionalitas komit Claude Code
- **pull_requests_by_claude_code**: Jumlah permintaan tarik yang dibuat melalui fungsionalitas PR Claude Code

#### Metrik tindakan alat
Rincian tingkat penerimaan dan penolakan tindakan alat berdasarkan jenis alat:
- **edit_tool.accepted/rejected**: Jumlah proposal alat Edit yang diterima/ditolak pengguna
- **write_tool.accepted/rejected**: Jumlah proposal alat Write yang diterima/ditolak pengguna
- **notebook_edit_tool.accepted/rejected**: Jumlah proposal alat NotebookEdit yang diterima/ditolak pengguna

#### Rincian model
Untuk setiap model Claude yang digunakan:
- **model**: Pengenal model Claude (misalnya, `claude-sonnet-4-5-20250929`)
- **tokens.input/output**: Jumlah token input dan output untuk model ini
- **tokens.cache_read/cache_creation**: Penggunaan token terkait cache untuk model ini
- **estimated_cost.amount**: Perkiraan biaya dalam sen USD untuk model ini
- **estimated_cost.currency**: Kode mata uang untuk jumlah biaya (saat ini selalu `USD`)

### Struktur respons

API mengembalikan data dalam format berikut:

```json
{
  "data": [
    {
      "date": "2025-09-01T00:00:00Z",
      "actor": {
        "type": "user_actor",
        "email_address": "developer@company.com"
      },
      "organization_id": "dc9f6c26-b22c-4831-8d01-0446bada88f1",
      "customer_type": "api",
      "terminal_type": "vscode",
      "core_metrics": {
        "num_sessions": 5,
        "lines_of_code": {
          "added": 1543,
          "removed": 892
        },
        "commits_by_claude_code": 12,
        "pull_requests_by_claude_code": 2
      },
      "tool_actions": {
        "edit_tool": {
          "accepted": 45,
          "rejected": 5
        },
        "multi_edit_tool": {
          "accepted": 12,
          "rejected": 2
        },
        "write_tool": {
          "accepted": 8,
          "rejected": 1
        },
        "notebook_edit_tool": {
          "accepted": 3,
          "rejected": 0
        }
      },
      "model_breakdown": [
        {
          "model": "claude-sonnet-4-5-20250929",
          "tokens": {
            "input": 100000,
            "output": 35000,
            "cache_read": 10000,
            "cache_creation": 5000
          },
          "estimated_cost": {
            "currency": "USD",
            "amount": 1025
          }
        }
      ]
    }
  ],
  "has_more": false,
  "next_page": null
}
```

## Paginasi

API mendukung paginasi berbasis kursor untuk organisasi dengan jumlah pengguna yang besar:

1. Buat permintaan awal Anda dengan parameter `limit` opsional
2. Jika `has_more` adalah `true` dalam respons, gunakan nilai `next_page` dalam permintaan berikutnya Anda
3. Lanjutkan sampai `has_more` adalah `false`

Kursor mengenkode posisi catatan terakhir dan memastikan paginasi stabil bahkan saat data baru tiba. Setiap sesi paginasi mempertahankan batas data yang konsisten untuk memastikan Anda tidak melewatkan atau menduplikasi catatan.

## Kasus penggunaan umum

- **Dasbor eksekutif**: Buat laporan tingkat tinggi yang menunjukkan dampak Claude Code pada kecepatan pengembangan
- **Perbandingan alat AI**: Ekspor metrik untuk membandingkan Claude Code dengan alat pengkodean AI lainnya seperti Copilot dan Cursor
- **Analisis produktivitas pengembang**: Lacak metrik produktivitas individu dan tim dari waktu ke waktu
- **Pelacakan dan alokasi biaya**: Pantau pola pengeluaran dan alokasikan biaya berdasarkan tim atau proyek
- **Pemantauan adopsi**: Identifikasi tim dan pengguna mana yang mendapatkan nilai paling banyak dari Claude Code
- **Justifikasi ROI**: Berikan metrik konkret untuk membenarkan dan memperluas adopsi Claude Code secara internal

## Pertanyaan yang sering diajukan

### Seberapa segar data analitik?
Data analitik Claude Code biasanya muncul dalam 1 jam setelah penyelesaian aktivitas pengguna. Untuk memastikan hasil paginasi yang konsisten, hanya data yang lebih lama dari 1 jam yang disertakan dalam respons.

### Bisakah saya mendapatkan metrik real-time?
Tidak, API ini hanya menyediakan metrik yang diagregasi harian. Untuk pemantauan real-time, pertimbangkan menggunakan [integrasi OpenTelemetry](https://code.claude.com/docs/en/monitoring-usage).

### Bagaimana pengguna diidentifikasi dalam data?
Pengguna diidentifikasi melalui field `actor` dengan dua cara:
- **`user_actor`**: Berisi `email_address` untuk pengguna yang mengautentikasi melalui OAuth (paling umum)
- **`api_actor`**: Berisi `api_key_name` untuk pengguna yang mengautentikasi melalui kunci API

Field `customer_type` menunjukkan apakah penggunaan berasal dari pelanggan `api` (API PAYG) atau pelanggan `subscription` (rencana Pro/Team).

### Berapa periode retensi data?
Data analitik Claude Code historis disimpan dan dapat diakses melalui API. Tidak ada periode penghapusan yang ditentukan untuk data ini.

### Penerapan Claude Code mana yang didukung?
API ini hanya melacak penggunaan Claude Code di Claude API (pihak pertama). Penggunaan di Amazon Bedrock, Google Vertex AI, atau platform pihak ketiga lainnya tidak disertakan.

### Berapa biaya untuk menggunakan API ini?
Claude Code Analytics API gratis digunakan untuk semua organisasi dengan akses ke Admin API.

### Bagaimana cara menghitung tingkat penerimaan alat?
Tingkat penerimaan alat = `accepted / (accepted + rejected)` untuk setiap jenis alat. Misalnya, jika alat edit menunjukkan 45 diterima dan 5 ditolak, tingkat penerimaan adalah 90%.

### Zona waktu apa yang digunakan untuk parameter tanggal?
Semua tanggal dalam UTC. Parameter `starting_at` harus dalam format YYYY-MM-DD dan mewakili tengah malam UTC untuk hari itu.

## Lihat juga

Claude Code Analytics API membantu Anda memahami dan mengoptimalkan alur kerja pengembangan tim Anda. Pelajari lebih lanjut tentang fitur terkait:

- [Gambaran umum Admin API](/docs/id/build-with-claude/administration-api)
- [Referensi Admin API](/docs/id/api/admin)
- [Dasbor Claude Code Analytics](/claude-code)
- [API Penggunaan dan Biaya](/docs/id/build-with-claude/usage-cost-api) - Lacak penggunaan API di semua layanan Anthropic
- [Manajemen identitas dan akses](https://code.claude.com/docs/en/iam)
- [Pemantauan penggunaan dengan OpenTelemetry](https://code.claude.com/docs/en/monitoring-usage) untuk metrik khusus dan peringatan