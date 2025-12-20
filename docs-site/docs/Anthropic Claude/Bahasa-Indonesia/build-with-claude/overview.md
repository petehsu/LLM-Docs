# Ikhtisar fitur

Jelajahi fitur dan kemampuan canggih Claude.

---

## Kemampuan inti

Fitur-fitur ini meningkatkan kemampuan fundamental Claude untuk memproses, menganalisis, dan menghasilkan konten di berbagai format dan kasus penggunaan.

| Fitur | Deskripsi | Ketersediaan |
|---------|-------------|--------------|
| [Jendela konteks 1M token](/docs/id/build-with-claude/context-windows#1m-token-context-window) | Jendela konteks yang diperluas yang memungkinkan Anda memproses dokumen yang jauh lebih besar, mempertahankan percakapan yang lebih panjang, dan bekerja dengan basis kode yang lebih ekstensif. | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [Agent Skills](/docs/id/agents-and-tools/agent-skills/overview) | Perluas kemampuan Claude dengan Skills. Gunakan Skills yang sudah dibangun (PowerPoint, Excel, Word, PDF) atau buat Skills kustom dengan instruksi dan skrip. Skills menggunakan progressive disclosure untuk mengelola konteks secara efisien. | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [Pemrosesan batch](/docs/id/build-with-claude/batch-processing) | Proses volume besar permintaan secara asinkron untuk penghematan biaya. Kirim batch dengan jumlah besar kueri per batch. Panggilan API Batch berharga 50% lebih murah daripada panggilan API standar. | <PlatformAvailability claudeApi bedrock vertexAi /> |
| [Kutipan](/docs/id/build-with-claude/citations) | Dasarkan respons Claude dalam dokumen sumber. Dengan Kutipan, Claude dapat memberikan referensi terperinci ke kalimat dan bagian yang tepat yang digunakannya untuk menghasilkan respons, menghasilkan output yang lebih dapat diverifikasi dan terpercaya. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Pengeditan konteks](/docs/id/build-with-claude/context-editing) | Kelola konteks percakapan secara otomatis dengan strategi yang dapat dikonfigurasi. Mendukung penghapusan hasil alat saat mendekati batas token dan mengelola blok pemikiran dalam percakapan pemikiran yang diperluas. | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [Effort](/docs/id/build-with-claude/effort) | Kontrol berapa banyak token yang digunakan Claude saat merespons dengan parameter effort, menukar antara kelengkapan respons dan efisiensi token. | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [Pemikiran yang diperluas](/docs/id/build-with-claude/extended-thinking) | Kemampuan penalaran yang ditingkatkan untuk tugas-tugas kompleks, memberikan transparansi ke dalam proses pemikiran langkah demi langkah Claude sebelum memberikan jawaban akhirnya. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Files API](/docs/id/build-with-claude/files) | Unggah dan kelola file untuk digunakan dengan Claude tanpa mengunggah ulang konten dengan setiap permintaan. Mendukung PDF, gambar, dan file teks. | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [Dukungan PDF](/docs/id/build-with-claude/pdf-support) | Proses dan analisis konten teks dan visual dari dokumen PDF. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Prompt caching (5m)](/docs/id/build-with-claude/prompt-caching) | Berikan Claude dengan lebih banyak pengetahuan latar belakang dan contoh output untuk mengurangi biaya dan latensi. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Prompt caching (1hr)](/docs/id/build-with-claude/prompt-caching#1-hour-cache-duration) | Durasi cache 1 jam yang diperluas untuk konteks yang kurang sering diakses tetapi penting, melengkapi cache standar 5 menit. | <PlatformAvailability claudeApi azureAi /> |
| [Hasil pencarian](/docs/id/build-with-claude/search-results) | Aktifkan kutipan alami untuk aplikasi RAG dengan memberikan hasil pencarian dengan atribusi sumber yang tepat. Capai kutipan berkualitas pencarian web untuk basis pengetahuan dan alat kustom. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Output terstruktur](/docs/id/build-with-claude/structured-outputs) | Jamin kepatuhan skema dengan dua pendekatan: output JSON untuk respons data terstruktur, dan penggunaan alat ketat untuk input alat yang divalidasi. Tersedia di Sonnet 4.5, Opus 4.1, Opus 4.5, dan Haiku 4.5. | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [Penghitungan token](/docs/id/api/messages-count-tokens) | Penghitungan token memungkinkan Anda menentukan jumlah token dalam pesan sebelum mengirimnya ke Claude, membantu Anda membuat keputusan berdasarkan informasi tentang prompt dan penggunaan Anda. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Penggunaan alat](/docs/id/agents-and-tools/tool-use/overview) | Aktifkan Claude untuk berinteraksi dengan alat dan API eksternal untuk melakukan berbagai tugas. Untuk daftar alat yang didukung, lihat [tabel Alat](#tools). | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |

## Alat

Fitur-fitur ini memungkinkan Claude untuk berinteraksi dengan sistem eksternal, menjalankan kode, dan melakukan tugas otomatis melalui berbagai antarmuka alat.

| Fitur | Deskripsi | Ketersediaan |
|---------|-------------|--------------|
| [Bash](/docs/id/agents-and-tools/tool-use/bash-tool) | Jalankan perintah bash dan skrip untuk berinteraksi dengan shell sistem dan melakukan operasi baris perintah. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Eksekusi kode](/docs/id/agents-and-tools/tool-use/code-execution-tool) | Jalankan kode Python di lingkungan sandbox untuk analisis data tingkat lanjut. | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [Pemanggilan alat secara terprogram](/docs/id/agents-and-tools/tool-use/programmatic-tool-calling) | Aktifkan Claude untuk memanggil alat Anda secara terprogram dari dalam wadah eksekusi kode, mengurangi latensi dan konsumsi token untuk alur kerja multi-alat. | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [Penggunaan komputer](/docs/id/agents-and-tools/tool-use/computer-use-tool) | Kontrol antarmuka komputer dengan mengambil tangkapan layar dan mengeluarkan perintah mouse dan keyboard. | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [Streaming alat berbutir halus](/docs/id/agents-and-tools/tool-use/fine-grained-tool-streaming) | Stream parameter penggunaan alat tanpa buffering/validasi JSON, mengurangi latensi untuk menerima parameter besar. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Konektor MCP](/docs/id/agents-and-tools/mcp-connector) | Terhubung ke server [MCP](/docs/id/mcp) jarak jauh langsung dari Messages API tanpa klien MCP terpisah. | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [Memori](/docs/id/agents-and-tools/tool-use/memory-tool) | Aktifkan Claude untuk menyimpan dan mengambil informasi di seluruh percakapan. Bangun basis pengetahuan seiring waktu, pertahankan konteks proyek, dan pelajari dari interaksi masa lalu. | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [Editor teks](/docs/id/agents-and-tools/tool-use/text-editor-tool) | Buat dan edit file teks dengan antarmuka editor teks bawaan untuk tugas manipulasi file. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Pencarian alat](/docs/id/agents-and-tools/tool-use/tool-search-tool) | Skalakan ke ribuan alat dengan menemukan dan memuat alat secara dinamis sesuai permintaan menggunakan pencarian berbasis regex, mengoptimalkan penggunaan konteks dan meningkatkan akurasi pemilihan alat. | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [Web fetch](/docs/id/agents-and-tools/tool-use/web-fetch-tool) | Ambil konten lengkap dari halaman web dan dokumen PDF yang ditentukan untuk analisis mendalam. | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [Pencarian web](/docs/id/agents-and-tools/tool-use/web-search-tool) | Tingkatkan pengetahuan komprehensif Claude dengan data dunia nyata yang saat ini dari seluruh web. | <PlatformAvailability claudeApi vertexAi azureAi /> |