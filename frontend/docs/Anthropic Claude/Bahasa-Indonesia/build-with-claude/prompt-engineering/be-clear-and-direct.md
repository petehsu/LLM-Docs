# Jadilah jelas, langsung, dan terperinci

Pelajari cara memberikan instruksi yang jelas dan spesifik kepada Claude untuk hasil yang lebih baik

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

Saat berinteraksi dengan Claude, anggaplah Claude sebagai karyawan yang sangat berbakat tetapi sangat baru (dengan amnesia) yang membutuhkan instruksi eksplisit. Seperti karyawan baru mana pun, Claude tidak memiliki konteks tentang norma, gaya, pedoman, atau cara kerja pilihan Anda.
Semakin tepat Anda menjelaskan apa yang Anda inginkan, semakin baik respons Claude.

<Tip>**Aturan emas dari prompting yang jelas**<br/>Tunjukkan prompt Anda kepada rekan kerja, idealnya seseorang yang memiliki konteks minimal tentang tugas tersebut, dan minta mereka mengikuti instruksi. Jika mereka bingung, Claude kemungkinan besar juga akan bingung.</Tip>

## Cara menjadi jelas, kontekstual, dan spesifik

- **Berikan Claude informasi kontekstual:** Sama seperti Anda mungkin dapat berkinerja lebih baik pada suatu tugas jika Anda mengetahui lebih banyak konteks, Claude akan berkinerja lebih baik jika memiliki lebih banyak informasi kontekstual. Beberapa contoh informasi kontekstual:
    - Apa hasil tugas akan digunakan untuk
    - Audiens apa output yang dimaksudkan
    - Alur kerja apa tugas ini adalah bagian dari, dan di mana tugas ini berada dalam alur kerja tersebut
    - Tujuan akhir dari tugas, atau seperti apa penyelesaian tugas yang sukses
- **Jadilah spesifik tentang apa yang ingin Anda lakukan Claude:** Misalnya, jika Anda ingin Claude mengeluarkan hanya kode dan tidak ada yang lain, katakan saja.
- **Berikan instruksi sebagai langkah-langkah berurutan:** Gunakan daftar bernomor atau poin-poin untuk lebih memastikan bahwa Claude melaksanakan tugas dengan cara yang Anda inginkan.

### Contoh

    <section title="Contoh: Menganonimkan umpan balik pelanggan">

    Perhatikan bahwa Claude masih membuat kesalahan dalam contoh prompting yang tidak jelas, seperti meninggalkan nama pelanggan.

    | Peran | Prompt yang Tidak Jelas | Prompt yang Jelas |
    | --- | --- | --- |
    | Pengguna | Harap hapus semua informasi yang dapat diidentifikasi secara pribadi dari pesan umpan balik pelanggan ini: \{\{FEEDBACK_DATA\}\} | Tugas Anda adalah menganonimkan umpan balik pelanggan untuk tinjauan triwulanan kami.<br/><br/>Instruksi:<br/>1. Ganti semua nama pelanggan dengan "CUSTOMER_[ID]" (misalnya, "Jane Doe" → "CUSTOMER_001").<br/>2. Ganti alamat email dengan "EMAIL_[ID]@example.com".<br/>3. Redaksi nomor telepon sebagai "PHONE_[ID]".<br/>4. Jika pesan menyebutkan produk tertentu (misalnya, "AcmeCloud"), biarkan tetap utuh.<br/>5. Jika tidak ada PII yang ditemukan, salin pesan secara verbatim.<br/>6. Keluarkan hanya pesan yang diproses, dipisahkan oleh "---".<br/><br/>Data untuk diproses: \{\{FEEDBACK_DATA\}\} |
    | Asisten (respons Claude) | Berikut adalah pesan umpan balik pelanggan yang telah dianonimkan:<br/>1. Saya telah menggunakan perangkat lunak Anda selama bertahun-tahun, dan itu luar biasa. Tetapi akhir-akhir ini, AcmeCloud sering mogok. Perbaiki!<br/>2. XXX, perwakilan dukungan pelanggan Anda, sangat membantu. Dia memandu saya melalui seluruh proses. Email saya adalah XXX jika Anda ingin mengirim survei.<br/>3. Saya John Smith, dan saya tidak puas. Saya telah menunggu 2 jam mencoba menghubungi seseorang di XXX. Ini tidak dapat diterima! | CUSTOMER_001: Saya telah menggunakan perangkat lunak Anda selama bertahun-tahun, dan itu luar biasa. Tetapi akhir-akhir ini, AcmeCloud sering mogok. Perbaiki!<br/>---<br/>CUSTOMER_002: CUSTOMER_SERVICE_001, perwakilan dukungan pelanggan Anda, sangat membantu. Dia memandu saya melalui seluruh proses. Email saya adalah EMAIL_002@example.com jika Anda ingin mengirim survei.<br/>---<br/>CUSTOMER_003: Saya CUSTOMER_003, dan saya tidak puas. Saya telah menunggu 2 jam mencoba menghubungi seseorang di PHONE_001. Ini tidak dapat diterima! |
    
</section>
    <section title="Contoh: Membuat kampanye email pemasaran">

    Perhatikan bahwa Claude membuat detail untuk mengisi celah di mana ia kekurangan konteks dengan prompt yang tidak jelas.

    | Peran | Prompt yang Tidak Jelas | Prompt yang Spesifik |
    | --- | --- | --- |
    | Pengguna | Tulis email pemasaran untuk fitur AcmeCloud baru kami. | Tugas Anda adalah membuat email pemasaran yang ditargetkan untuk rilis fitur AcmeCloud Q3 kami.<br/><br/>Instruksi:<br/>1. Tulis untuk audiens target ini: Perusahaan teknologi menengah (100-500 karyawan) yang meningkatkan dari on-prem ke cloud.<br/>2. Sorot 3 fitur baru utama: enkripsi data tingkat lanjut, sinkronisasi lintas platform, dan kolaborasi real-time.<br/>3. Nada: Profesional namun mudah didekati. Tekankan keamanan, efisiensi, dan kerja sama tim.<br/>4. Sertakan CTA yang jelas: Uji coba gratis 30 hari dengan onboarding prioritas.<br/>5. Baris subjek: Di bawah 50 karakter, sebutkan "keamanan" dan "kolaborasi".<br/>6. Personalisasi: Gunakan variabel \{\{COMPANY_NAME\}\} dan \{\{CONTACT_NAME\}\}.<br/><br/>Struktur:<br/>1. Baris subjek<br/>2. Badan email (150-200 kata)<br/>3. Teks tombol CTA |
    | Asisten (respons Claude) | Berikut adalah draf email pemasaran untuk fitur baru kami:<br/><br/>Baris subjek: Tingkatkan Bisnis Anda dengan Fitur Terbaru AcmeCloud<br/><br/>Pelanggan Terhormat,<br/><br/>Kami senang memperkenalkan tiga fitur canggih untuk AcmeCloud yang akan merevolusi alur kerja Anda:<br/><br/>1. Kolaborasi Real-Time: Bekerja pada dokumen secara bersamaan dengan tim Anda. Tidak ada lagi masalah kontrol versi!<br/>2. Wawasan Bertenaga AI: Buat keputusan berbasis data dengan AI yang menganalisis tren dan mengotomatisasi tugas.<br/>3. Rangkaian Keamanan Lanjutan: Enkripsi end-to-end, autentikasi multi-faktor, dan deteksi ancaman menjaga data Anda tetap aman.<br/><br/>Penawaran Terbatas: Tingkatkan sekarang untuk diskon tahun pertama 20%. Plus, ajak teman untuk diskon tambahan 10%!<br/><br/>Terbaik,<br/>Tim AcmeCloud | Baris subjek: AcmeCloud: Keamanan perusahaan bertemu kerja tim real-time<br/><br/>Badan email:<br/>Pelanggan Terhormat \{\{CONTACT_NAME\}\},<br/><br/>Di \{\{COMPANY_NAME\}\}, Anda berkembang pesat dan mempertimbangkan cloud. Tetapi dengan pertumbuhan datang tantangan menjaga data tetap aman sambil mendorong kolaborasi. Di sinilah rilis Q3 AcmeCloud masuk, dirancang khusus untuk inovator teknologi seperti Anda.<br/><br/>1. Fort Knox untuk File Anda: Enkripsi tingkat militer sekarang melindungi data Anda, baik dalam perjalanan maupun saat istirahat. Kekayaan intelektual Anda tetap milik Anda, titik.<br/>2. Sinkronisasi Tanpa Batas: Windows, Mac, atau Linux—AcmeCloud berbicara semua bahasa. Kontrol versi terpadu berarti tidak ada lagi "final_v2_REALLY_FINAL.doc".<br/>3. Berkolaborasi dengan Kecepatan Cahaya: Tinggalkan ping-pong lampiran. Sekarang dev, desainer, dan ilmuwan data Anda berkolaborasi secara real-time, mengurangi waktu ke pasar.<br/><br/>Jangan hanya percaya kata-kata kami. Rasakan perbedaan AcmeCloud dengan uji coba 30 hari kami. Dan karena kami tahu waktu adalah aset paling berharga Anda, kami memberikan onboarding prioritas.<br/><br/>Tingkatkan Tim Anda Sekarang - Uji Coba Gratis 30 Hari |
    
</section>
    <section title="Contoh: Respons insiden">

    Perhatikan bahwa Claude mengeluarkan teks yang berlebihan dan pemformatan berbeda dengan prompt yang tidak jelas.
    | Peran | Prompt yang Tidak Jelas | Prompt yang Terperinci |
    | --- | --- | --- |
    | Pengguna | Analisis laporan pemadaman AcmeCloud ini dan ringkas poin-poin utamanya.<br/><br/>\{\{REPORT\}\} | Analisis laporan pemadaman AcmeCloud ini. Lewati pembukaan. Jaga respons Anda tetap ringkas dan tulis hanya informasi yang benar-benar diperlukan. Daftar hanya:<br/>1) Penyebab<br/>2) Durasi<br/>3) Layanan yang terdampak<br/>4) Jumlah pengguna yang terpengaruh<br/>5) Perkiraan kerugian pendapatan. <br/><br/>Berikut adalah laporannya: \{\{REPORT\}\}|
    | Asisten (respons Claude) | Berikut adalah ringkasan poin-poin utama dari laporan pemadaman AcmeCloud:<br/><br/>Pada 15 Mei, pembaruan load balancer yang salah konfigurasi menyebabkan masalah perutean lalu lintas yang signifikan, menghasilkan pemadaman layanan dari 09:15 hingga 13:52 UTC. Gangguan 4 jam 37 menit berdampak pada layanan sinkronisasi file inti kami dan dasbor admin, membuat keduanya tidak dapat diakses. Selain itu, aplikasi seluler mengalami kehilangan fungsionalitas sebagian. Sekitar 68% dari basis pengguna kami, berjumlah 1,3 juta pengguna, terpengaruh. Berdasarkan Perjanjian Tingkat Layanan (SLA) kami dan pendapatan rata-rata per pengguna, kami memperkirakan dampak keuangan sebesar $420.000 dalam kredit layanan dan potensi churn pelanggan. | 1) Penyebab: Pembaruan load balancer yang salah konfigurasi<br/>2) Durasi: 4h 37m (09:15-13:52 UTC, 15 Mei)<br/>3) Terdampak: Sinkronisasi inti, dasbor admin (down); aplikasi seluler (sebagian)<br/>4) Pengguna yang terpengaruh: 1,3M (68% dari basis)<br/>5) Perkiraan kerugian pendapatan: $420.000 |
    
</section>

***

<CardGroup cols={3}>
  <Card title="Perpustakaan prompt" icon="link" href="/docs/id/resources/prompt-library/library">
    Dapatkan inspirasi dari pilihan prompt yang dikurasi untuk berbagai tugas dan kasus penggunaan.
  </Card>
  <Card title="Tutorial prompting GitHub" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    Tutorial yang penuh dengan contoh yang mencakup konsep prompt engineering yang ditemukan dalam dokumentasi kami.
  </Card>
  <Card title="Tutorial prompting Google Sheets" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    Versi yang lebih ringan dari tutorial prompt engineering kami melalui spreadsheet interaktif.
  </Card>
</CardGroup>