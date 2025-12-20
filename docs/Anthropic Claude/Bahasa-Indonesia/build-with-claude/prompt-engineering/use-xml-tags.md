# Gunakan tag XML untuk menyusun prompt Anda

Pelajari cara menggunakan tag XML untuk menyusun prompt yang lebih jelas dan terstruktur, meningkatkan akurasi respons Claude.

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

Ketika prompt Anda melibatkan beberapa komponen seperti konteks, instruksi, dan contoh, tag XML dapat menjadi pengubah permainan. Mereka membantu Claude mengurai prompt Anda dengan lebih akurat, menghasilkan output berkualitas lebih tinggi.

<Tip>**Tips XML**: Gunakan tag seperti `<instructions>`, `<example>`, dan `<formatting>` untuk memisahkan bagian-bagian berbeda dari prompt Anda dengan jelas. Ini mencegah Claude mencampuradukkan instruksi dengan contoh atau konteks.</Tip>

## Mengapa menggunakan tag XML?

- **Kejelasan:** Pisahkan bagian-bagian berbeda dari prompt Anda dengan jelas dan pastikan prompt Anda terstruktur dengan baik.
- **Akurasi:** Kurangi kesalahan yang disebabkan oleh Claude salah menafsirkan bagian-bagian prompt Anda.
- **Fleksibilitas:** Dengan mudah temukan, tambahkan, hapus, atau ubah bagian-bagian prompt Anda tanpa menulis ulang semuanya.
- **Parseability:** Memiliki Claude menggunakan tag XML dalam output-nya membuat lebih mudah untuk mengekstrak bagian-bagian spesifik dari respons-nya melalui post-processing.

<Note>Tidak ada tag XML "terbaik" yang kanonik yang Claude telah dilatih secara khusus, meskipun kami merekomendasikan bahwa nama tag Anda masuk akal dengan informasi yang mereka kelilingi.</Note>

***

## Praktik terbaik penandaan

1. **Konsisten**: Gunakan nama tag yang sama di seluruh prompt Anda, dan rujuk nama tag tersebut saat berbicara tentang konten (misalnya, `Menggunakan kontrak dalam tag <contract>...`).
2. **Sarangkan tag**: Anda harus menyarangkan tag `<outer><inner></inner></outer>` untuk konten hierarki.

<Tip>**Tips pengguna lanjutan**: Gabungkan tag XML dengan teknik lain seperti multishot prompting (`<examples>`) atau chain of thought (`<thinking>`, `<answer>`). Ini menciptakan prompt yang super-terstruktur dan berkinerja tinggi.</Tip>

### Contoh

  <section title="Contoh: Menghasilkan laporan keuangan">

    Tanpa tag XML, Claude salah memahami tugas dan menghasilkan laporan yang tidak sesuai dengan struktur atau nada yang diperlukan. Setelah substitusi, ada juga kemungkinan bahwa Claude salah memahami di mana satu bagian (seperti contoh laporan Q1) berhenti dan yang lain dimulai.

    | Peran | Tanpa Tag XML | Dengan Tag XML |
    | ---- | ----------- | ------------- |
    | Pengguna | Anda adalah analis keuangan di AcmeCorp. Hasilkan laporan keuangan Q2 untuk investor kami. Sertakan bagian tentang Pertumbuhan Pendapatan, Margin Keuntungan, dan Arus Kas, seperti dengan contoh ini dari tahun lalu: \{\{Q1_REPORT\}\}. Gunakan poin data dari spreadsheet ini: \{\{SPREADSHEET_DATA\}\}. Laporan harus sangat ringkas, langsung ke pokok, profesional, dan dalam format daftar. Laporan harus menyoroti kekuatan dan area untuk perbaikan. | Anda adalah analis keuangan di AcmeCorp. Hasilkan laporan keuangan Q2 untuk investor kami.<br/><br/>AcmeCorp adalah perusahaan B2B SaaS. Investor kami menghargai transparansi dan wawasan yang dapat ditindaklanjuti.<br/><br/>Gunakan data ini untuk laporan Anda:\<data>\{\{SPREADSHEET_DATA\}\}\</data><br/><br/>\<instructions><br/>1. Sertakan bagian: Pertumbuhan Pendapatan, Margin Keuntungan, Arus Kas.<br/>2. Sorot kekuatan dan area untuk perbaikan.<br/>\</instructions><br/><br/>Buat nada Anda ringkas dan profesional. Ikuti struktur ini:<br/>\<formatting_example>\{\{Q1_REPORT\}\}\</formatting_example> |
    | Asisten | Laporan Keuangan Q2 untuk Investor AcmeCorp<br/><br/>Investor Berharga,<br/><br/>Saya dengan senang hati mempersembahkan laporan keuangan Q2 kami, menampilkan pertumbuhan berkelanjutan dan ketahanan AcmeCorp di pasar B2B SaaS.<br/><br/>1. Pertumbuhan Pendapatan:<br/>Pendapatan Q2 kami mencapai \$15,2M, peningkatan 22% YoY. Pertumbuhan ini terutama didorong oleh ekspansi 30% dalam basis klien enterprise kami. Namun, segmen SMB kami mengalami penurunan kecil sebesar 5%, yang kami bertujuan untuk mengatasi melalui inisiatif pemasaran yang ditargetkan di Q3.<br/><br/>2. Margin Keuntungan:<br/>Margin kotor meningkat menjadi 72% (naik 3% dari Q1) karena optimasi infrastruktur. Margin EBITDA, bagaimanapun, turun menjadi 18% (turun 2%) karena kami berinvestasi berat dalam R&D untuk fitur berbasis AI kami yang akan datang.<br/><br/>3. Arus Kas:<br/>Arus kas operasional tetap kuat di \$4,1M. Cadangan kas kami berdiri di \$28M, memberikan runway 15 bulan dengan tingkat burn saat ini. Kami melihat peningkatan 20% dalam biaya akuisisi pelanggan, yang kami tangani melalui strategi penjualan yang lebih efisien.<br/><br/>Singkatnya, keuangan inti AcmeCorp tetap kuat. Kami menyeimbangkan investasi pertumbuhan dengan manajemen kas yang bijaksana. Fokus kami untuk Q3 akan merevitalisasi pertumbuhan SMB dan mengoptimalkan efisiensi penjualan.<br/><br/>Terima kasih atas kepercayaan berkelanjutan Anda.<br/><br/>Hormat,<br/>CFO, AcmeCorp | Laporan Keuangan Q2 untuk Investor AcmeCorp\</output><br/><br/>Pertumbuhan Pendapatan:<br/>- Pendapatan Q2: \$15,2M (22% YoY ↑)<br/>- Klien enterprise: 30% ↑<br/>- Segmen SMB: 5% ↓<br/>  Tindakan: Pemasaran Q3 yang ditargetkan<br/><br/>Margin Keuntungan:<br/>- Margin kotor: 72% (3% ↑ dari Q1)<br/>  Alasan: Optimasi infrastruktur<br/>- Margin EBITDA: 18% (2% ↓)<br/>  Alasan: Investasi R&D dalam fitur AI<br/><br/>Arus Kas:<br/>- Arus kas operasional: \$4,1M (kuat)<br/>- Cadangan kas: \$28M (runway 15 bulan)<br/>- Biaya akuisisi pelanggan: 20% ↑<br/>  Tindakan: Optimalkan strategi penjualan<br/><br/>Prospek:<br/>- Keuangan inti: Kuat<br/>- Fokus Q3: Revitalisasi SMB, optimalkan penjualan<br/><br/>Manajemen tetap berkomitmen untuk menyeimbangkan investasi pertumbuhan dengan disiplin keuangan. |
  
</section>
  <section title="Contoh: Analisis kontrak hukum">

    Tanpa tag XML, analisis Claude tidak terorganisir dan melewatkan poin-poin kunci. Dengan tag, itu memberikan analisis terstruktur dan menyeluruh yang dapat ditindaklanjuti oleh tim hukum.

    | Peran | Tanpa Tag XML | Dengan Tag XML |
    | ---- | ----------- | ------------- |
    | Pengguna | Analisis perjanjian lisensi perangkat lunak ini untuk risiko dan kewajiban potensial: \{\{CONTRACT\}\}. Fokus pada klausa indemnitasi, pembatasan tanggung jawab, dan kepemilikan IP. Juga, catat istilah yang tidak biasa atau mengkhawatirkan. Berikut adalah kontrak standar kami untuk referensi: \{\{STANDARD_CONTRACT\}\}. Berikan ringkasan temuan dan rekomendasi untuk tim hukum kami. | Analisis perjanjian lisensi perangkat lunak ini untuk risiko dan kewajiban hukum.<br/><br/>Kami adalah perusahaan multinasional yang mempertimbangkan perjanjian ini untuk infrastruktur data inti kami.<br/><br/>\<agreement><br/>\{\{CONTRACT\}\}\</agreement><br/><br/>Ini adalah kontrak standar kami untuk referensi:<br/>\<standard_contract>\{\{STANDARD_CONTRACT\}\}\</standard_contract><br/><br/>\<instructions><br/>1. Analisis klausa-klausa ini:<br/>   - Indemnitasi<br/>   - Pembatasan tanggung jawab<br/>   - Kepemilikan IP<br/><br/>2. Catat istilah yang tidak biasa atau mengkhawatirkan.<br/><br/>3. Bandingkan dengan kontrak standar kami.<br/><br/>4. Ringkas temuan dalam tag \<findings>.<br/><br/>5. Daftarkan rekomendasi yang dapat ditindaklanjuti dalam tag \<recommendations>.\</instructions> |
    | Asisten | Perjanjian lisensi perangkat lunak yang disediakan menunjukkan beberapa aspek yang mengkhawatirkan. Klausa indemnitasi terlalu luas, berpotensi mengekspos kami pada kewajiban yang signifikan. Bagian pembatasan tanggung jawab membatasi kerusakan pada hanya \$500, yang tidak memadai untuk penggunaan tingkat enterprise kami. Mengenai IP, perjanjian memberikan vendor kepemilikan bersama atas modifikasi atau integrasi apa pun yang kami buat.<br/><br/>Singkatnya, perjanjian ini tidak sesuai dengan kepentingan terbaik kami. Ini mengekspos kami pada risiko yang tidak perlu, membatasi jalan keluar kami jika terjadi kegagalan, dan mengorbankan hak kekayaan intelektual kami. Saya merekomendasikan untuk merundingkan kembali istilah-istilah ini atau mencari vendor alternatif. | \<findings><br/>1. Indemnitasi (Klausa 8):<br/>   - Masalah: Terlalu luas. Kami mengganti rugi vendor terhadap "klaim apa pun dan semua klaim" yang timbul dari penggunaan kami.<br/>   - Risiko: Dapat membuat kami bertanggung jawab bahkan atas kelalaian vendor atau cacat produk.<br/>   - Penyimpangan: Standar kami membatasi indemnitasi pada klaim yang timbul dari pelanggaran kami terhadap perjanjian.<br/><br/>2. Pembatasan Tanggung Jawab (Klausa 9):<br/>   - Masalah: Membatasi semua kerusakan pada \$500, termasuk kerusakan langsung.<br/>   - Risiko: Sangat tidak memadai untuk penggunaan enterprise. Kegagalan kritis dapat menghabiskan jutaan.<br/>   - Penyimpangan: Standar kami memungkinkan kerusakan langsung hingga 12 bulan biaya yang dibayarkan.<br/><br/>3. Kepemilikan IP (Klausa 12):<br/>   - Masalah: Memberikan vendor kepemilikan bersama atas modifikasi/integrasi kami.<br/>   - Risiko: Vendor dapat menggunakan atau menjual algoritma proprietary atau wawasan data kami.<br/>   - Penyimpangan: Standar kami mempertahankan kepemilikan penuh atas pekerjaan kami.<br/><br/>4. Istilah Tidak Biasa:<br/>   - Klausa 5.3: Vendor dapat menggunakan data penggunaan kami untuk "tujuan apa pun."<br/>   - Klausa 7.2: Vendor dapat mengakhiri untuk "kenyamanan" dengan hanya pemberitahuan 7 hari.<br/>   - Klausa 11: Tidak ada garansi apa pun, bahkan untuk kelayakan dasar.<br/>\</findings><br/><br/>\<recommendations><br/>1. Tolak perjanjian ini. Risiko jauh melampaui manfaat untuk enterprise.<br/>2. Konter-usulkan:<br/>   - Indemnitasi: Batasi pada klaim yang timbul dari pelanggaran kami terhadap perjanjian.<br/>   - Tanggung Jawab: Batasi pada 12 bulan biaya untuk kerusakan langsung; negosiasikan untuk kerusakan tidak langsung.<br/>   - IP: Kepemilikan penuh atas modifikasi/integrasi kami.<br/>   - Penggunaan Data: Batasi pada perbaikan layanan saja.<br/>   - Penghentian: Pemberitahuan minimum 90 hari; hanya untuk penyebab.<br/>   - Garansi: Tuntut kelayakan dasar dan kesesuaian untuk tujuan.<br/>3. Jika vendor menolak, jelajahi penyedia alternatif atau solusi in-house.<br/>4. Libatkan konseling hukum untuk negosiasi kontrak mengingat taruhan tinggi.<br/>\</recommendations> |
  
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