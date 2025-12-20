# Usage and Cost API

Akses secara terprogram data penggunaan API dan biaya organisasi Anda dengan Usage & Cost Admin API.

---

<Tip>
**The Admin API is unavailable for individual accounts.** To collaborate with teammates and add members, set up your organization in **Console → Settings → Organization**.
</Tip>

Usage & Cost Admin API menyediakan akses terprogram dan granular ke data penggunaan API historis dan biaya untuk organisasi Anda. Data ini mirip dengan informasi yang tersedia di halaman [Usage](/usage) dan [Cost](/cost) dari Claude Console.

API ini memungkinkan Anda untuk lebih baik memantau, menganalisis, dan mengoptimalkan implementasi Claude Anda:

* **Pelacakan Penggunaan Akurat:** Dapatkan penghitungan token yang tepat dan pola penggunaan alih-alih hanya mengandalkan penghitungan token respons
* **Rekonsiliasi Biaya:** Cocokkan catatan internal dengan penagihan Anthropic untuk tim keuangan dan akuntansi
* **Kinerja produk dan peningkatan:** Pantau kinerja produk sambil mengukur apakah perubahan pada sistem telah meningkatkannya, atau atur peringatan
* **Optimasi [Rate limit](/docs/id/api/rate-limits) dan [Priority Tier](/docs/id/api/service-tiers#get-started-with-priority-tier):** Optimalkan fitur seperti [prompt caching](/docs/id/build-with-claude/prompt-caching) atau prompt spesifik untuk memanfaatkan kapasitas yang dialokasikan, atau beli kapasitas khusus.
* **Analisis Lanjutan:** Lakukan analisis data yang lebih mendalam daripada yang tersedia di Console

<Check>
  **Admin API key diperlukan**
  
  API ini adalah bagian dari [Admin API](/docs/id/build-with-claude/administration-api). Endpoint ini memerlukan Admin API key (dimulai dengan `sk-ant-admin...`) yang berbeda dari kunci API standar. Hanya anggota organisasi dengan peran admin yang dapat menyediakan Admin API key melalui [Claude Console](/settings/admin-keys).
</Check>

## Solusi mitra

Platform observabilitas terkemuka menawarkan integrasi siap pakai untuk memantau penggunaan dan biaya Claude API Anda, tanpa menulis kode khusus. Integrasi ini menyediakan dashboard, peringatan, dan analitik untuk membantu Anda mengelola penggunaan API secara efektif.

<CardGroup cols={3}>
  <Card title="CloudZero" icon="chart" href="https://docs.cloudzero.com/docs/connections-anthropic">
    Platform intelijen cloud untuk melacak dan memperkirakan biaya
  </Card>
  <Card title="Datadog" icon="chart" href="https://docs.datadoghq.com/integrations/anthropic/">
    Observabilitas LLM dengan pelacakan dan pemantauan otomatis
  </Card>
  <Card title="Grafana Cloud" icon="chart" href="https://grafana.com/docs/grafana-cloud/monitor-infrastructure/integrations/integration-reference/integration-anthropic/">
    Integrasi tanpa agen untuk observabilitas LLM yang mudah dengan dashboard dan peringatan siap pakai
  </Card>
  <Card title="Honeycomb" icon="polygon" href="https://docs.honeycomb.io/integrations/anthropic-usage-monitoring/">
    Kueri lanjutan dan visualisasi melalui OpenTelemetry
  </Card>
  <Card title="Vantage" icon="chart" href="https://docs.vantage.sh/connecting_anthropic">
    Platform FinOps untuk observabilitas biaya & penggunaan LLM
  </Card>
</CardGroup>

## Mulai cepat

Dapatkan penggunaan harian organisasi Anda untuk 7 hari terakhir:

```bash
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-08T00:00:00Z&\
ending_at=2025-01-15T00:00:00Z&\
bucket_width=1d" \
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

## Usage API

Lacak konsumsi token di seluruh organisasi Anda dengan rincian terperinci menurut model, workspace, dan service tier dengan endpoint `/v1/organizations/usage_report/messages`.

### Konsep kunci

- **Time buckets**: Agregasi data penggunaan dalam interval tetap (`1m`, `1h`, atau `1d`)
- **Token tracking**: Ukur input tanpa cache, input cache, pembuatan cache, dan token output
- **Filtering & grouping**: Filter berdasarkan API key, workspace, model, service tier, atau context window, dan kelompokkan hasil menurut dimensi ini
- **Server tool usage**: Lacak penggunaan alat sisi server seperti pencarian web

Untuk detail parameter lengkap dan skema respons, lihat [referensi Usage API](/docs/id/api/admin-api/usage-cost/get-messages-usage-report).

### Contoh dasar

#### Penggunaan harian menurut model

```bash
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-01T00:00:00Z&\
ending_at=2025-01-08T00:00:00Z&\
group_by[]=model&\
bucket_width=1d" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

#### Penggunaan per jam dengan filtering

```bash
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-15T00:00:00Z&\
ending_at=2025-01-15T23:59:59Z&\
models[]=claude-sonnet-4-5-20250929&\
service_tiers[]=batch&\
context_window[]=0-200k&\
bucket_width=1h" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

#### Filter penggunaan menurut API keys dan workspaces

```bash
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-01T00:00:00Z&\
ending_at=2025-01-08T00:00:00Z&\
api_key_ids[]=apikey_01Rj2N8SVvo6BePZj99NhmiT&\
api_key_ids[]=apikey_01ABC123DEF456GHI789JKL&\
workspace_ids[]=wrkspc_01JwQvzr7rXLA5AGx3HKfFUJ&\
workspace_ids[]=wrkspc_01XYZ789ABC123DEF456MNO&\
bucket_width=1d" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

<Tip>
Untuk mengambil ID API key organisasi Anda, gunakan endpoint [List API Keys](/docs/id/api/admin-api/apikeys/list-api-keys).

Untuk mengambil ID workspace organisasi Anda, gunakan endpoint [List Workspaces](/docs/id/api/admin-api/workspaces/list-workspaces), atau temukan ID workspace organisasi Anda di Anthropic Console.
</Tip>

### Batas granularitas waktu

| Granularitas | Batas Default | Batas Maksimum | Use Case |
|-------------|---------------|---------------|----------|
| `1m` | 60 buckets | 1440 buckets | Pemantauan real-time |
| `1h` | 24 buckets | 168 buckets | Pola harian |
| `1d` | 7 buckets | 31 buckets | Laporan mingguan/bulanan |

## Cost API

Ambil rincian biaya tingkat layanan dalam USD dengan endpoint `/v1/organizations/cost_report`.

### Konsep kunci

- **Mata uang**: Semua biaya dalam USD, dilaporkan sebagai string desimal dalam unit terendah (sen)
- **Jenis biaya**: Lacak biaya penggunaan token, pencarian web, dan eksekusi kode
- **Grouping**: Kelompokkan biaya menurut workspace atau deskripsi untuk rincian terperinci
- **Time buckets**: Granularitas harian saja (`1d`)

Untuk detail parameter lengkap dan skema respons, lihat [referensi Cost API](/docs/id/api/admin-api/usage-cost/get-cost-report).

<Warning>
  Biaya Priority Tier menggunakan model penagihan yang berbeda dan tidak termasuk dalam endpoint biaya. Lacak penggunaan Priority Tier melalui endpoint penggunaan sebagai gantinya.
</Warning>

### Contoh dasar

```bash
curl "https://api.anthropic.com/v1/organizations/cost_report?\
starting_at=2025-01-01T00:00:00Z&\
ending_at=2025-01-31T00:00:00Z&\
group_by[]=workspace_id&\
group_by[]=description" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

## Paginasi

Kedua endpoint mendukung paginasi untuk dataset besar:

1. Buat permintaan awal Anda
2. Jika `has_more` adalah `true`, gunakan nilai `next_page` dalam permintaan berikutnya
3. Lanjutkan sampai `has_more` adalah `false`

```bash
# Permintaan pertama
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-01T00:00:00Z&\
ending_at=2025-01-31T00:00:00Z&\
limit=7" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"

# Respons mencakup: "has_more": true, "next_page": "page_xyz..."

# Permintaan berikutnya dengan paginasi
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-01T00:00:00Z&\
ending_at=2025-01-31T00:00:00Z&\
limit=7&\
page=page_xyz..." \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

## Use case umum

Jelajahi implementasi terperinci di [anthropic-cookbook](https://github.com/anthropics/anthropic-cookbook):

- **Laporan penggunaan harian**: Lacak tren konsumsi token
- **Atribusi biaya**: Alokasikan pengeluaran menurut workspace untuk chargebacks
- **Efisiensi cache**: Ukur dan optimalkan prompt caching
- **Pemantauan anggaran**: Atur peringatan untuk ambang batas pengeluaran
- **Ekspor CSV**: Hasilkan laporan untuk tim keuangan

## Pertanyaan yang sering diajukan

### Seberapa segar datanya?
Data penggunaan dan biaya biasanya muncul dalam 5 menit setelah penyelesaian permintaan API, meskipun penundaan mungkin kadang-kadang lebih lama.

### Berapa frekuensi polling yang direkomendasikan?
API mendukung polling sekali per menit untuk penggunaan berkelanjutan. Untuk burst pendek (misalnya, mengunduh data yang dipaginasi), polling yang lebih sering dapat diterima. Cache hasil untuk dashboard yang memerlukan pembaruan sering.

### Bagaimana cara melacak penggunaan eksekusi kode?
Biaya eksekusi kode muncul di endpoint biaya yang dikelompokkan di bawah `Code Execution Usage` di bidang deskripsi. Eksekusi kode tidak termasuk dalam endpoint penggunaan.

### Bagaimana cara melacak penggunaan Priority Tier?
Filter atau kelompokkan menurut `service_tier` di endpoint penggunaan dan cari nilai `priority`. Biaya Priority Tier tidak tersedia di endpoint biaya.

### Apa yang terjadi dengan penggunaan Workbench?
Penggunaan API dari Workbench tidak terkait dengan API key, jadi `api_key_id` akan `null` bahkan saat mengelompokkan menurut dimensi tersebut.

### Bagaimana workspace default direpresentasikan?
Penggunaan dan biaya yang dikaitkan dengan workspace default memiliki nilai `null` untuk `workspace_id`.

### Bagaimana cara mendapatkan rincian biaya per pengguna untuk Claude Code?

Gunakan [Claude Code Analytics API](/docs/id/build-with-claude/claude-code-analytics-api), yang menyediakan biaya perkiraan per pengguna dan metrik produktivitas tanpa keterbatasan kinerja dari memecah biaya menurut banyak API key. Untuk penggunaan API umum dengan banyak key, gunakan [Usage API](#usage-api) untuk melacak konsumsi token sebagai proxy biaya.

## Lihat juga
Usage dan Cost API dapat digunakan untuk membantu Anda memberikan pengalaman yang lebih baik bagi pengguna Anda, membantu Anda mengelola biaya, dan menjaga rate limit Anda. Pelajari lebih lanjut tentang beberapa fitur lain ini:

- [Gambaran umum Admin API](/docs/id/build-with-claude/administration-api)
- [Referensi Admin API](/docs/id/api/admin)
- [Pricing](/docs/id/about-claude/pricing)
- [Prompt caching](/docs/id/build-with-claude/prompt-caching) - Optimalkan biaya dengan caching
- [Batch processing](/docs/id/build-with-claude/batch-processing) - Diskon 50% untuk permintaan batch
- [Rate limits](/docs/id/api/rate-limits) - Pahami tier penggunaan