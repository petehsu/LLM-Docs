# Apa yang baru di Claude 4.5

Pelajari tentang tiga model Claude 4.5 baru, fitur API, dan peningkatan kunci untuk Opus 4.5, Sonnet 4.5, dan Haiku 4.5

---

Claude 4.5 memperkenalkan tiga model yang dirancang untuk kasus penggunaan yang berbeda:

- **Claude Opus 4.5**: Model paling cerdas kami yang menggabungkan kemampuan maksimal dengan kinerja praktis. Menampilkan titik harga yang lebih terjangkau daripada model Opus sebelumnya. Tersedia dengan jendela konteks token 200k.
- **Claude Sonnet 4.5**: Model terbaik kami untuk agen kompleks dan pengkodean, dengan kecerdasan tertinggi di sebagian besar tugas. Tersedia dengan jendela konteks token 200k dan 1M (beta).
- **Claude Haiku 4.5**: Model Haiku tercepat dan paling cerdas kami dengan kinerja mendekati frontier. Tersedia dengan jendela konteks token 200k.

## Peningkatan kunci di Opus 4.5 dibandingkan Opus 4.1

### Kecerdasan maksimal

Claude Opus 4.5 mewakili model paling cerdas kami, menggabungkan kemampuan maksimal dengan kinerja praktis. Ini memberikan peningkatan langkah perubahan di seluruh penalaran, pengkodean, dan tugas pemecahan masalah kompleks sambil mempertahankan output berkualitas tinggi yang diharapkan dari keluarga Opus.

### Parameter effort

Claude Opus 4.5 adalah satu-satunya model yang mendukung [parameter effort](/docs/id/build-with-claude/effort), memungkinkan Anda mengontrol berapa banyak token yang digunakan Claude saat merespons. Ini memberi Anda kemampuan untuk menukar antara kelengkapan respons dan efisiensi token dengan satu model.

Parameter effort mempengaruhi semua token dalam respons, termasuk respons teks, panggilan alat, dan pemikiran yang diperluas. Anda dapat memilih antara:
- **High effort**: Kelengkapan maksimal untuk analisis kompleks dan penjelasan terperinci
- **Medium effort**: Pendekatan seimbang untuk sebagian besar kasus penggunaan produksi
- **Low effort**: Respons paling efisien token untuk otomasi volume tinggi

### Keunggulan penggunaan komputer

Claude Opus 4.5 memperkenalkan [kemampuan penggunaan komputer yang ditingkatkan](/docs/id/agents-and-tools/tool-use/computer-use-tool) dengan tindakan zoom baru yang memungkinkan inspeksi terperinci dari wilayah layar tertentu pada resolusi penuh. Ini memungkinkan Claude untuk memeriksa elemen UI yang halus, teks kecil, dan informasi visual terperinci yang mungkin tidak jelas dalam tangkapan layar standar.

Kemampuan zoom sangat berharga untuk:
- Memeriksa elemen dan kontrol UI kecil
- Membaca cetakan halus atau teks terperinci
- Menganalisis antarmuka kompleks dengan informasi padat
- Memverifikasi detail visual yang tepat sebelum mengambil tindakan

### Kinerja praktis

Claude Opus 4.5 memberikan kecerdasan flagship dengan [titik harga yang lebih terjangkau](/docs/id/about-claude/pricing) daripada model Opus sebelumnya, membuat kemampuan AI canggih tersedia untuk berbagai aplikasi dan kasus penggunaan.

### Preservasi blok pemikiran

Claude Opus 4.5 [secara otomatis mempertahankan semua blok pemikiran sebelumnya](/docs/id/build-with-claude/extended-thinking#thinking-block-preservation-in-claude-opus-4-5) di seluruh percakapan, mempertahankan kontinuitas penalaran di seluruh interaksi multi-turn yang diperluas dan sesi penggunaan alat. Ini memastikan Claude dapat secara efektif memanfaatkan riwayat penalaran penuhnya saat bekerja pada tugas yang kompleks dan berjalan lama.

## Peningkatan kunci di Sonnet 4.5 dibandingkan Sonnet 4

### Keunggulan pengkodean

Claude Sonnet 4.5 adalah model pengkodean terbaik kami hingga saat ini, dengan peningkatan signifikan di seluruh siklus hidup pengembangan:

- **Kinerja SWE-bench Verified**: Canggih state-of-the-art pada benchmark pengkodean
- **Perencanaan dan desain sistem yang ditingkatkan**: Keputusan arsitektur dan organisasi kode yang lebih baik
- **Rekayasa keamanan yang ditingkatkan**: Praktik keamanan yang lebih kuat dan deteksi kerentanan
- **Penurutan instruksi yang lebih baik**: Kepatuhan yang lebih tepat terhadap spesifikasi dan persyaratan pengkodean

<Note>
Claude Sonnet 4.5 berkinerja jauh lebih baik pada tugas pengkodean ketika [pemikiran yang diperluas](/docs/id/build-with-claude/extended-thinking) diaktifkan. Pemikiran yang diperluas dinonaktifkan secara default, tetapi kami merekomendasikan mengaktifkannya untuk pekerjaan pengkodean yang kompleks. Perhatikan bahwa pemikiran yang diperluas mempengaruhi [efisiensi caching prompt](/docs/id/build-with-claude/prompt-caching#caching-with-thinking-blocks). Lihat [panduan migrasi](/docs/id/about-claude/models/migrating-to-claude-4#extended-thinking-recommendations) untuk detail konfigurasi.
</Note>

### Kemampuan agen

Claude Sonnet 4.5 memperkenalkan kemajuan besar dalam kemampuan agen:

- **Operasi otonom yang diperluas**: Sonnet 4.5 dapat bekerja secara independen selama berjam-jam sambil mempertahankan kejelasan dan fokus pada kemajuan inkremental. Model membuat kemajuan stabil pada beberapa tugas sekaligus daripada mencoba semuanya sekaligus. Model memberikan pembaruan kemajuan berbasis fakta yang secara akurat mencerminkan apa yang telah dicapai.
- **Kesadaran konteks**: Claude sekarang melacak penggunaan tokennya di seluruh percakapan, menerima pembaruan setelah setiap panggilan alat. Kesadaran ini membantu mencegah penghentian tugas prematur dan memungkinkan eksekusi yang lebih efektif pada tugas yang berjalan lama. Lihat [Kesadaran konteks](/docs/id/build-with-claude/context-windows#context-awareness-in-claude-sonnet-4-5) untuk detail teknis dan [panduan prompting](/docs/id/build-with-claude/prompt-engineering/claude-4-best-practices#context-awareness-and-multi-window-workflows).
- **Penggunaan alat yang ditingkatkan**: Model menggunakan panggilan alat paralel dengan lebih efektif, menembakkan beberapa pencarian spekulatif secara bersamaan selama penelitian dan membaca beberapa file sekaligus untuk membangun konteks lebih cepat. Koordinasi yang ditingkatkan di seluruh beberapa alat dan sumber informasi memungkinkan model untuk secara efektif memanfaatkan berbagai kemampuan dalam pencarian agen dan alur kerja pengkodean.
- **Manajemen konteks lanjutan**: Sonnet 4.5 mempertahankan pelacakan status yang luar biasa dalam file eksternal, mempertahankan orientasi tujuan di seluruh sesi. Dikombinasikan dengan penggunaan jendela konteks yang lebih efektif dan fitur API manajemen konteks baru kami, model menangani informasi secara optimal di seluruh sesi yang diperluas untuk mempertahankan koherensi seiring waktu.

<Note>Kesadaran konteks tersedia di Claude Sonnet 4, Sonnet 4.5, Haiku 4.5, Opus 4, Opus 4.1, dan Opus 4.5.</Note>

### Gaya komunikasi dan interaksi

Claude Sonnet 4.5 memiliki pendekatan komunikasi yang disempurnakan yang ringkas, langsung, dan alami. Model memberikan pembaruan kemajuan berbasis fakta dan dapat melewati ringkasan verbose setelah panggilan alat untuk mempertahankan momentum alur kerja (meskipun ini dapat disesuaikan dengan prompting).

Untuk panduan terperinci tentang bekerja dengan gaya komunikasi ini, lihat [praktik terbaik Claude 4](/docs/id/build-with-claude/prompt-engineering/claude-4-best-practices).

### Pembuatan konten kreatif

Claude Sonnet 4.5 unggul dalam tugas konten kreatif:

- **Presentasi dan animasi**: Cocok atau melebihi Claude Opus 4.1 dan Opus 4.5 untuk membuat slide dan konten visual
- **Sentuhan kreatif**: Menghasilkan output yang dipoles dan profesional dengan penurutan instruksi yang kuat
- **Kualitas percobaan pertama**: Menghasilkan konten yang dapat digunakan dan dirancang dengan baik dalam upaya awal

## Peningkatan kunci di Haiku 4.5 dibandingkan Haiku 3.5

Claude Haiku 4.5 mewakili lompatan transformatif untuk keluarga model Haiku, membawa kemampuan frontier ke kelas model tercepat kami:

### Kecerdasan mendekati frontier dengan kecepatan kilat

Claude Haiku 4.5 memberikan kinerja mendekati frontier yang cocok dengan kinerja Sonnet 4 dengan biaya jauh lebih rendah dan kecepatan lebih cepat:

- **Kecerdasan mendekati frontier**: Cocok dengan kinerja Sonnet 4 di seluruh penalaran, pengkodean, dan tugas kompleks
- **Kecepatan yang ditingkatkan**: Lebih dari dua kali kecepatan Sonnet 4, dengan optimasi untuk token output per detik (OTPS)
- **Optimal cost-performance**: Kecerdasan mendekati frontier dengan sepertiga biaya, ideal untuk penyebaran volume tinggi

### Kemampuan pemikiran yang diperluas

Claude Haiku 4.5 adalah **model Haiku pertama** yang mendukung pemikiran yang diperluas, membawa kemampuan penalaran canggih ke keluarga Haiku:

- **Penalaran dengan kecepatan**: Akses ke proses penalaran internal Claude untuk pemecahan masalah kompleks
- **Ringkasan Pemikiran**: Output pemikiran yang diringkas untuk penyebaran siap produksi
- **Pemikiran yang disisipi**: Pikirkan di antara panggilan alat untuk alur kerja multi-langkah yang lebih canggih
- **Kontrol anggaran**: Konfigurasikan anggaran token pemikiran untuk menyeimbangkan kedalaman penalaran dengan kecepatan

Pemikiran yang diperluas harus diaktifkan secara eksplisit dengan menambahkan parameter `thinking` ke permintaan API Anda. Lihat [dokumentasi pemikiran yang diperluas](/docs/id/build-with-claude/extended-thinking) untuk detail implementasi.

<Note>
Claude Haiku 4.5 berkinerja jauh lebih baik pada tugas pengkodean dan penalaran ketika [pemikiran yang diperluas](/docs/id/build-with-claude/extended-thinking) diaktifkan. Pemikiran yang diperluas dinonaktifkan secara default, tetapi kami merekomendasikan mengaktifkannya untuk pemecahan masalah yang kompleks, pekerjaan pengkodean, dan penalaran multi-langkah. Perhatikan bahwa pemikiran yang diperluas mempengaruhi [efisiensi caching prompt](/docs/id/build-with-claude/prompt-caching#caching-with-thinking-blocks). Lihat [panduan migrasi](/docs/id/about-claude/models/migrating-to-claude-4#extended-thinking-recommendations) untuk detail konfigurasi.
</Note>

<Note>Tersedia di Claude Sonnet 3.7, Sonnet 4, Sonnet 4.5, Haiku 4.5, Opus 4, Opus 4.1, dan Opus 4.5.</Note>

### Kesadaran konteks

Claude Haiku 4.5 menampilkan **kesadaran konteks**, memungkinkan model untuk melacak jendela konteks sisanya di seluruh percakapan:

- **Pelacakan anggaran token**: Claude menerima pembaruan real-time tentang kapasitas konteks yang tersisa setelah setiap panggilan alat
- **Persistensi tugas yang lebih baik**: Model dapat menjalankan tugas dengan lebih efektif dengan memahami ruang kerja yang tersedia
- **Alur kerja jendela konteks multi**: Penanganan yang ditingkatkan dari transisi status di seluruh sesi yang diperluas

Ini adalah model Haiku pertama dengan kemampuan kesadaran konteks asli. Untuk panduan prompting, lihat [praktik terbaik Claude 4](/docs/id/build-with-claude/prompt-engineering/claude-4-best-practices#context-awareness-and-multi-window-workflows).

<Note>Tersedia di Claude Sonnet 4, Sonnet 4.5, Haiku 4.5, Opus 4, Opus 4.1, dan Opus 4.5.</Note>

### Pengkodean yang kuat dan penggunaan alat

Claude Haiku 4.5 memberikan kemampuan pengkodean yang kuat yang diharapkan dari model Claude modern:

- **Kemahiran pengkodean**: Kinerja yang kuat di seluruh pembuatan kode, debugging, dan tugas refactoring
- **Dukungan alat penuh**: Kompatibel dengan semua alat Claude 4 termasuk bash, eksekusi kode, editor teks, pencarian web, dan penggunaan komputer
- **Penggunaan komputer yang ditingkatkan**: Dioptimalkan untuk interaksi desktop otonom dan alur kerja otomasi browser
- **Eksekusi alat paralel**: Koordinasi efisien di seluruh beberapa alat untuk alur kerja kompleks

Haiku 4.5 dirancang untuk kasus penggunaan yang menuntut kecerdasan dan efisiensi:

- **Aplikasi real-time**: Waktu respons cepat untuk pengalaman pengguna interaktif
- **Pemrosesan volume tinggi**: Kecerdasan hemat biaya untuk penyebaran skala besar
- **Implementasi tingkat gratis**: Kualitas model premium dengan harga terjangkau
- **Arsitektur sub-agen**: Agen cepat dan cerdas untuk sistem multi-agen
- **Penggunaan komputer dalam skala**: Otomasi desktop dan browser otonom yang hemat biaya

## Fitur API baru

### Pemanggilan alat terprogram (Beta)

[Pemanggilan alat terprogram](/docs/id/agents-and-tools/tool-use/programmatic-tool-calling) memungkinkan Claude menulis kode yang memanggil alat Anda secara terprogram dalam wadah eksekusi kode, daripada memerlukan perjalanan bolak-balik melalui model untuk setiap invokasi alat. Ini secara signifikan mengurangi latensi untuk alur kerja multi-alat dan mengurangi konsumsi token dengan memungkinkan Claude untuk memfilter atau memproses data sebelum mencapai jendela konteks model.

```python
tools=[
    {
        "type": "code_execution_20250825",
        "name": "code_execution"
    },
    {
        "name": "query_database",
        "description": "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
        "input_schema": {...},
        "allowed_callers": ["code_execution_20250825"]  # Enable programmatic calling
    }
]
```

Manfaat utama:
- **Latensi berkurang**: Hilangkan perjalanan bolak-balik model antara panggilan alat
- **Efisiensi token**: Proses dan filter hasil alat secara terprogram sebelum kembali ke Claude
- **Alur kerja kompleks**: Dukungan loop, logika kondisional, dan pemrosesan batch

<Note>Tersedia di Claude Opus 4.5 dan Claude Sonnet 4.5. Memerlukan [header beta](/docs/id/api/beta-headers): `advanced-tool-use-2025-11-20`</Note>

### Alat pencarian alat (Beta)

[Alat pencarian alat](/docs/id/agents-and-tools/tool-use/tool-search-tool) memungkinkan Claude bekerja dengan ratusan atau ribuan alat dengan dinamis menemukan dan memuatnya sesuai permintaan. Alih-alih memuat semua definisi alat ke jendela konteks di muka, Claude mencari katalog alat Anda dan memuat hanya alat yang dibutuhkannya.

Dua varian pencarian tersedia:
- **Regex** (`tool_search_tool_regex_20251119`): Claude membuat pola regex untuk mencari nama alat, deskripsi, dan argumen
- **BM25** (`tool_search_tool_bm25_20251119`): Claude menggunakan kueri bahasa alami untuk mencari alat

```python
tools=[
    {
        "type": "tool_search_tool_regex_20251119",
        "name": "tool_search_tool_regex"
    },
    {
        "name": "get_weather",
        "description": "Get the weather at a specific location",
        "input_schema": {...},
        "defer_loading": True  # Load on-demand via search
    }
]
```

Pendekatan ini menyelesaikan dua tantangan kritis:
- **Efisiensi konteks**: Hemat 10-20K token dengan tidak memuat semua definisi alat di muka
- **Akurasi pemilihan alat**: Pertahankan akurasi tinggi bahkan dengan 100+ alat yang tersedia

<Note>Tersedia di Claude Opus 4.5 dan Claude Sonnet 4.5. Memerlukan [header beta](/docs/id/api/beta-headers): `advanced-tool-use-2025-11-20`</Note>

### Parameter effort (Beta)

[Parameter effort](/docs/id/build-with-claude/effort) memungkinkan Anda mengontrol berapa banyak token yang digunakan Claude saat merespons, menukar antara kelengkapan respons dan efisiensi token:

```python
response = client.beta.messages.create(
    model="claude-opus-4-5-20251101",
    betas=["effort-2025-11-24"],
    max_tokens=4096,
    messages=[{"role": "user", "content": "..."}],
    output_config={
        "effort": "medium"  # "low", "medium", or "high"
    }
)
```

Parameter effort mempengaruhi semua token dalam respons, termasuk respons teks, panggilan alat, dan pemikiran yang diperluas. Level effort yang lebih rendah menghasilkan respons yang lebih ringkas dengan penjelasan minimal, sementara effort yang lebih tinggi memberikan penalaran terperinci dan jawaban komprehensif.

<Note>Tersedia secara eksklusif di Claude Opus 4.5. Memerlukan [header beta](/docs/id/api/beta-headers): `effort-2025-11-24`</Note>

### Contoh penggunaan alat (Beta)

[Contoh penggunaan alat](/docs/id/agents-and-tools/tool-use/implement-tool-use#providing-tool-use-examples) memungkinkan Anda memberikan contoh konkret dari input alat yang valid untuk membantu Claude memahami cara menggunakan alat Anda dengan lebih efektif. Ini sangat berguna untuk alat kompleks dengan objek bersarang, parameter opsional, atau input sensitif format.

```python
tools=[
    {
        "name": "get_weather",
        "description": "Get the current weather in a given location",
        "input_schema": {...},
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
                "location": "New York, NY"  # Demonstrates optional 'unit' parameter
            }
        ]
    }
]
```

Contoh disertakan dalam prompt bersama skema alat Anda, menunjukkan Claude pola konkret untuk panggilan alat yang terbentuk dengan baik. Setiap contoh harus valid sesuai dengan `input_schema` alat.

<Note>Tersedia di Claude Sonnet 4.5, Haiku 4.5, Opus 4.5, Opus 4.1, dan Opus 4. Memerlukan [header beta](/docs/id/api/beta-headers): `advanced-tool-use-2025-11-20`.</Note>

### Alat memori (Beta)

[Alat memori](/docs/id/agents-and-tools/tool-use/memory-tool) baru memungkinkan Claude menyimpan dan mengambil informasi di luar jendela konteks:

```python
tools=[
    {
        "type": "memory_20250818",
        "name": "memory"
    }
]
```

Ini memungkinkan untuk:
- Membangun basis pengetahuan seiring waktu
- Mempertahankan status proyek di seluruh sesi
- Mempertahankan konteks yang efektif tanpa batas melalui penyimpanan berbasis file

<Note>Tersedia di Claude Sonnet 4, Sonnet 4.5, Haiku 4.5, Opus 4, Opus 4.1, dan Opus 4.5. Memerlukan [header beta](/docs/id/api/beta-headers): `context-management-2025-06-27`</Note>

### Pengeditan konteks

Gunakan [pengeditan konteks](/docs/id/build-with-claude/context-editing) untuk manajemen konteks cerdas melalui pembersihan panggilan alat otomatis:

```python
response = client.beta.messages.create(
    betas=["context-management-2025-06-27"],
    model="claude-sonnet-4-5",  # or claude-haiku-4-5
    max_tokens=4096,
    messages=[{"role": "user", "content": "..."}],
    context_management={
        "edits": [
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {"type": "input_tokens", "value": 500},
                "keep": {"type": "tool_uses", "value": 2},
                "clear_at_least": {"type": "input_tokens", "value": 100}
            }
        ]
    },
    tools=[...]
)
```

Fitur ini secara otomatis menghapus panggilan alat dan hasil yang lebih lama saat mendekati batas token, membantu mengelola konteks dalam sesi agen yang berjalan lama.

<Note>Tersedia di Claude Sonnet 4, Sonnet 4.5, Haiku 4.5, Opus 4, Opus 4.1, dan Opus 4.5. Memerlukan [header beta](/docs/id/api/beta-headers): `context-management-2025-06-27`</Note>

### Alasan penghentian yang ditingkatkan

Model Claude 4.5 memperkenalkan alasan penghentian `model_context_window_exceeded` baru yang secara eksplisit menunjukkan ketika pembuatan berhenti karena mencapai batas jendela konteks, daripada batas `max_tokens` yang diminta. Ini memudahkan untuk menangani batas jendela konteks dalam logika aplikasi Anda.

```json
{
  "stop_reason": "model_context_window_exceeded",
  "usage": {
    "input_tokens": 150000,
    "output_tokens": 49950
  }
}
```

### Penanganan parameter alat yang ditingkatkan

Model Claude 4.5 mencakup perbaikan bug yang mempertahankan pemformatan yang disengaja dalam parameter string panggilan alat. Sebelumnya, baris baru di akhir dalam parameter string kadang-kadang secara tidak benar dihapus. Perbaikan ini memastikan bahwa alat yang memerlukan pemformatan presisi (seperti editor teks) menerima parameter persis seperti yang dimaksudkan.

<Note>
Ini adalah peningkatan di balik layar tanpa perubahan API yang diperlukan. Namun, alat dengan parameter string sekarang dapat menerima nilai dengan baris baru di akhir yang sebelumnya dihapus.
</Note>

**Contoh:**

```json
// Sebelum: Baris baru akhir secara tidak sengaja dihapus
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "edit_todo",
  "input": {
    "file": "todo.txt",
    "contents": "1. Chop onions.\n2. ???\n3. Profit"
  }
}

// Sesudah: Baris baru di akhir dipertahankan seperti yang dimaksudkan
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "edit_todo",
  "input": {
    "file": "todo.txt",
    "contents": "1. Chop onions.\n2. ???\n3. Profit\n"
  }
}
```

### Optimasi penghitungan token

Model Claude 4.5 mencakup optimasi otomatis untuk meningkatkan kinerja model. Optimasi ini dapat menambahkan sejumlah kecil token ke permintaan, tetapi **Anda tidak ditagih untuk token yang ditambahkan sistem ini**.

## Fitur yang diperkenalkan di Claude 4

Fitur berikut diperkenalkan di Claude 4 dan tersedia di seluruh model Claude 4, termasuk Claude Sonnet 4.5 dan Claude Haiku 4.5.

### Alasan penolakan penghentian baru

Model Claude 4 memperkenalkan alasan penghentian `refusal` baru untuk konten yang ditolak model untuk alasan keamanan:

```json
{
  "id": "msg_014XEDjypDjFzgKVWdFUXxZP",
  "type": "message",
  "role": "assistant",
  "model": "claude-sonnet-4-5",
  "content": [{"type": "text", "text": "I would be happy to assist you. You can "}],
  "stop_reason": "refusal",
  "stop_sequence": null,
  "usage": {
    "input_tokens": 564,
    "cache_creation_input_tokens": 0,
    "cache_read_input_tokens": 0,
    "output_tokens": 22
  }
}
```

Saat menggunakan model Claude 4, Anda harus memperbarui aplikasi Anda untuk [menangani alasan penghentian `refusal`](/docs/id/test-and-evaluate/strengthen-guardrails/handle-streaming-refusals).

### Pemikiran yang diringkas

Dengan pemikiran yang diperluas diaktifkan, Messages API untuk model Claude 4 mengembalikan ringkasan dari proses pemikiran penuh Claude. Pemikiran yang diringkas memberikan manfaat kecerdasan penuh dari pemikiran yang diperluas, sambil mencegah penyalahgunaan.

Meskipun API konsisten di seluruh model Claude 3.7 dan 4, respons streaming untuk pemikiran yang diperluas mungkin kembali dalam pola pengiriman "chunky", dengan kemungkinan penundaan antara acara streaming.

<Note>
Ringkasan diproses oleh model yang berbeda dari yang Anda targetkan dalam permintaan Anda. Model pemikiran tidak melihat output yang diringkas.
</Note>

Untuk informasi lebih lanjut, lihat [dokumentasi pemikiran yang diperluas](/docs/id/build-with-claude/extended-thinking#summarized-thinking).

### Pemikiran yang disisipi

Model Claude 4 mendukung penyisipan penggunaan alat dengan pemikiran yang diperluas, memungkinkan percakapan yang lebih alami di mana penggunaan alat dan respons dapat dicampur dengan pesan reguler.

<Note>
Pemikiran yang disisipi dalam beta. Untuk mengaktifkan pemikiran yang disisipi, tambahkan [header beta](/docs/id/api/beta-headers) `interleaved-thinking-2025-05-14` ke permintaan API Anda.
</Note>

Untuk informasi lebih lanjut, lihat [dokumentasi pemikiran yang diperluas](/docs/id/build-with-claude/extended-thinking#interleaved-thinking).

### Perbedaan perilaku

Model Claude 4 memiliki perubahan perilaku yang terlihat yang dapat mempengaruhi cara Anda menyusun prompt:

#### Perubahan gaya komunikasi

- **Lebih ringkas dan langsung**: Model Claude 4 berkomunikasi lebih efisien, dengan penjelasan yang kurang verbose
- **Nada yang lebih alami**: Respons sedikit lebih percakapan dan kurang seperti mesin
- **Fokus efisiensi**: Dapat melewati ringkasan terperinci setelah menyelesaikan tindakan untuk mempertahankan momentum alur kerja (Anda dapat meminta lebih banyak detail jika diperlukan)

#### Penurutan instruksi

Model Claude 4 dilatih untuk penurutan instruksi yang presisi dan memerlukan arahan yang lebih eksplisit:

- **Jadilah eksplisit tentang tindakan**: Gunakan bahasa langsung seperti "Buat perubahan ini" atau "Implementasikan fitur ini" daripada "Bisakah Anda menyarankan perubahan" jika Anda ingin Claude mengambil tindakan
- **Nyatakan perilaku yang diinginkan dengan jelas**: Claude akan mengikuti instruksi dengan presisi, jadi menjadi spesifik tentang apa yang Anda inginkan membantu mencapai hasil yang lebih baik

Untuk panduan komprehensif tentang bekerja dengan model ini, lihat [praktik terbaik rekayasa prompt Claude 4](/docs/id/build-with-claude/prompt-engineering/claude-4-best-practices).

### Alat editor teks yang diperbarui

Alat editor teks telah diperbarui untuk model Claude 4 dengan perubahan berikut:

- **Jenis alat**: `text_editor_20250728`
- **Nama alat**: `str_replace_based_edit_tool`
- Perintah `undo_edit` tidak lagi didukung

<Note>
Alat editor teks `str_replace_editor` tetap sama untuk Claude Sonnet 3.7.
</Note>

Jika Anda bermigrasi dari Claude Sonnet 3.7 dan menggunakan alat editor teks:

```python
# Claude Sonnet 3.7
tools=[
    {
        "type": "text_editor_20250124",
        "name": "str_replace_editor"
    }
]

# Model Claude 4
tools=[
    {
        "type": "text_editor_20250728",
        "name": "str_replace_based_edit_tool"
    }
]
```

Untuk informasi lebih lanjut, lihat [dokumentasi alat editor teks](/docs/id/agents-and-tools/tool-use/text-editor-tool).

### Alat eksekusi kode yang diperbarui

Jika Anda menggunakan alat eksekusi kode, pastikan Anda menggunakan versi terbaru `code_execution_20250825`, yang menambahkan perintah Bash dan kemampuan manipulasi file.

Versi warisan `code_execution_20250522` (Python saja) masih tersedia tetapi tidak direkomendasikan untuk implementasi baru.

Untuk instruksi migrasi, lihat [dokumentasi alat eksekusi kode](/docs/id/agents-and-tools/tool-use/code-execution-tool#upgrade-to-latest-tool-version).

## Harga dan ketersediaan

### Harga

Model Claude 4.5 mempertahankan harga yang kompetitif:

| Model | Input | Output |
|-------|-------|--------|
| Claude Opus 4.5 | $5 per juta token | $25 per juta token |
| Claude Sonnet 4.5 | $3 per juta token | $15 per juta token |
| Claude Haiku 4.5 | $1 per juta token | $5 per juta token |

Untuk detail lebih lanjut, lihat [dokumentasi harga](/docs/id/about-claude/pricing).

### Harga platform pihak ketiga

Mulai dengan model Claude 4.5 (Opus 4.5, Sonnet 4.5, dan Haiku 4.5), AWS Bedrock dan Google Vertex AI menawarkan dua jenis endpoint:

- **Endpoint global**: Perutean dinamis untuk ketersediaan maksimal
- **Endpoint regional**: Perutean data yang dijamin melalui wilayah geografis tertentu dengan **premium harga 10%**

**Harga regional ini berlaku untuk semua model Claude 4.5: Opus 4.5, Sonnet 4.5, dan Haiku 4.5.**

**Claude API (1P) bersifat global secara default dan tidak terpengaruh oleh perubahan ini.** Claude API bersifat global-only (setara dengan penawaran endpoint global dan harga dari penyedia lain).

Untuk detail implementasi dan panduan migrasi:
- [Endpoint global vs regional AWS Bedrock](/docs/id/build-with-claude/claude-on-amazon-bedrock#global-vs-regional-endpoints)
- [Endpoint global vs regional Google Vertex AI](/docs/id/build-with-claude/claude-on-vertex-ai#global-vs-regional-endpoints)

### Ketersediaan

Model Claude 4.5 tersedia di:

| Model | Claude API | Amazon Bedrock | Google Cloud Vertex AI |
|-------|-----------|----------------|------------------------|
| Claude Opus 4.5 | `claude-opus-4-5-20251101` | `anthropic.claude-opus-4-5-20251101-v1:0` | `claude-opus-4-5@20251101` |
| Claude Sonnet 4.5 | `claude-sonnet-4-5-20250929` | `anthropic.claude-sonnet-4-5-20250929-v1:0` | `claude-sonnet-4-5@20250929` |
| Claude Haiku 4.5 | `claude-haiku-4-5-20251001` | `anthropic.claude-haiku-4-5-20251001-v1:0` | `claude-haiku-4-5@20251001` |

Juga tersedia melalui platform Claude.ai dan Claude Code.

## Panduan migrasi

Perubahan yang merusak dan persyaratan migrasi bervariasi tergantung pada model mana yang Anda tingkatkan. Untuk instruksi migrasi terperinci, termasuk panduan langkah demi langkah, perubahan yang merusak, dan daftar periksa migrasi, lihat [Bermigrasi ke Claude 4.5](/docs/id/about-claude/models/migrating-to-claude-4).

Panduan migrasi mencakup skenario berikut:
- **Claude Sonnet 3.7 → Sonnet 4.5**: Jalur migrasi lengkap dengan perubahan yang merusak
- **Claude Haiku 3.5 → Haiku 4.5**: Jalur migrasi lengkap dengan perubahan yang merusak
- **Claude Sonnet 4 → Sonnet 4.5**: Peningkatan cepat dengan perubahan minimal
- **Claude Opus 4.1 → Sonnet 4.5**: Peningkatan mulus tanpa perubahan yang merusak
- **Claude Opus 4.1 → Opus 4.5**: Peningkatan mulus tanpa perubahan yang merusak
- **Claude Opus 4.5 → Sonnet 4.5**: Downgrade mulus tanpa perubahan yang merusak

## Langkah berikutnya

<CardGroup cols={3}>
  <Card title="Praktik terbaik" icon="lightbulb" href="/docs/id/build-with-claude/prompt-engineering/claude-4-best-practices">
    Pelajari teknik rekayasa prompt untuk model Claude 4.5
  </Card>
  <Card title="Ikhtisar model" icon="table" href="/docs/id/about-claude/models/overview">
    Bandingkan model Claude 4.5 dengan model Claude lainnya
  </Card>
  <Card title="Panduan migrasi" icon="arrow-right-arrow-left" href="/docs/id/about-claude/models/migrating-to-claude-4">
    Tingkatkan dari model sebelumnya
  </Card>
</CardGroup>