# Gunakan contoh (multishot prompting) untuk membimbing perilaku Claude

Pelajari cara menggunakan contoh dan multishot prompting untuk meningkatkan akurasi dan konsistensi output Claude

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

Contoh adalah senjata rahasia pintas Anda untuk membuat Claude menghasilkan persis apa yang Anda butuhkan. Dengan memberikan beberapa contoh yang dirancang dengan baik dalam prompt Anda, Anda dapat secara dramatis meningkatkan akurasi, konsistensi, dan kualitas output Claude.
Teknik ini, yang dikenal sebagai few-shot atau multishot prompting, sangat efektif untuk tugas-tugas yang memerlukan output terstruktur atau kepatuhan terhadap format tertentu.

<Tip>**Tingkatkan prompt Anda**: Sertakan 3-5 contoh yang beragam dan relevan untuk menunjukkan kepada Claude persis apa yang Anda inginkan. Lebih banyak contoh = performa yang lebih baik, terutama untuk tugas-tugas yang kompleks.</Tip>

## Mengapa menggunakan contoh?

- **Akurasi**: Contoh mengurangi salah tafsir instruksi.
- **Konsistensi**: Contoh memberlakukan struktur dan gaya yang seragam.
- **Performa**: Contoh yang dipilih dengan baik meningkatkan kemampuan Claude untuk menangani tugas-tugas kompleks.

## Membuat contoh yang efektif

Untuk efektivitas maksimal, pastikan bahwa contoh Anda adalah:
- **Relevan**: Contoh Anda mencerminkan kasus penggunaan aktual Anda.
- **Beragam**: Contoh Anda mencakup kasus tepi dan tantangan potensial, dan bervariasi cukup sehingga Claude tidak secara tidak sengaja mengambil pola yang tidak dimaksudkan.
- **Jelas**: Contoh Anda dibungkus dalam tag `<example>` (jika ada beberapa, bersarang dalam tag `<examples>`) untuk struktur.

<Tip>Minta Claude untuk mengevaluasi contoh Anda untuk relevansi, keragaman, atau kejelasan. Atau biarkan Claude menghasilkan lebih banyak contoh berdasarkan set awal Anda.</Tip>
<section title="Contoh: Menganalisis umpan balik pelanggan">

    Perhatikan bahwa dalam versi "tanpa contoh", Claude tidak mencantumkan beberapa opsi untuk setiap kategori, meskipun analisis tertulisnya menunjukkan bahwa ada beberapa kategori untuk umpan balik tertentu. Ini juga mencakup penjelasan panjang ketika kami mungkin tidak menginginkannya.

    | Peran | Tanpa Contoh | Dengan Contoh |
    | --- | --- | --- |
    | Pengguna | Analisis umpan balik pelanggan ini dan kategorikan masalahnya. Gunakan kategori ini: UI/UX, Performance, Feature Request, Integration, Pricing, dan Other. Juga beri rating sentimen (Positive/Neutral/Negative) dan prioritas (High/Medium/Low).<br/><br/>Berikut adalah umpan baliknya: \{\{FEEDBACK\}\} | Tim CS kami kewalahan dengan umpan balik yang tidak terstruktur. Tugas Anda adalah menganalisis umpan balik dan mengkategorikan masalah untuk tim produk dan teknik kami. Gunakan kategori ini: UI/UX, Performance, Feature Request, Integration, Pricing, dan Other. Juga beri rating sentimen (Positive/Neutral/Negative) dan prioritas (High/Medium/Low). Berikut adalah contohnya:<br/><br/>\<example><br/>Input: Dashboard baru ini berantakan! Membutuhkan waktu lama untuk dimuat, dan saya tidak dapat menemukan tombol ekspor. Perbaiki ini segera!<br/>Category: UI/UX, Performance<br/>Sentiment: Negative<br/>Priority: High\</example><br/><br/>Sekarang, analisis umpan balik ini: \{\{FEEDBACK\}\} |
    | Asisten (respons Claude) | Berikut adalah analisis umpan balik pelanggan:<br/><br/>Issue: UI/UX<br/>Sentiment: Negative<br/>Priority: High<br/>Pelanggan frustrasi dengan desain dashboard baru, yang mereka anggap berantakan dan lambat dimuat. Mereka secara khusus menyebutkan tombol "ekspor" yang hilang, yang mungkin merupakan fitur penting. Masalah ini perlu ditangani sebagai prioritas tinggi.<br/><br/>Issue: Integration<br/>Sentiment: Positive<br/>Priority: Medium<br/>Pelanggan puas dengan integrasi Salesforce yang ada tetapi ingin melihat dukungan untuk Hubspot juga. Ini adalah permintaan fitur yang dapat dipertimbangkan untuk pembaruan produk di masa depan.<br/><br/>Issue: Pricing<br/>Sentiment: Negative<br/>Priority: High<br/>Pelanggan menganggap harga tidak masuk akal, terutama untuk fitur dasar. Mereka mengancam untuk beralih ke pesaing, jadi ini adalah masalah prioritas tinggi yang perlu ditinjau.<br/><br/>Issue: Performance<br/>Sentiment Negative<br/>Priority: High<br/>Pelanggan mengalami masalah kritis dengan aplikasi mobile, di mana unggahan file besar secara konsisten menghasilkan kerusakan. Ini adalah masalah signifikan yang berdampak pada kemampuan pelanggan untuk menggunakan produk secara efektif dan harus ditangani sebagai prioritas tinggi.<br/><br/>Issue: UI/UX<br/>Sentiment: Positive<br/>Priority: Low<br/>Pelanggan secara keseluruhan puas dengan produk, secara khusus menyebutkan UI yang intuitif dan dukungan pelanggan yang sangat baik. Ini adalah umpan balik positif yang tidak memerlukan tindakan segera. | Berikut adalah analisis umpan balik pelanggan:<br/><br/>1. Dashboard baru ini berantakan! Membutuhkan waktu lama untuk dimuat, dan saya tidak dapat menemukan tombol ekspor. Perbaiki ini segera!<br/>Category: UI/UX, Performance<br/>Sentiment: Negative<br/>Priority: High<br/><br/>2. Saya menyukai integrasi Salesforce! Tetapi akan bagus jika Anda bisa menambahkan Hubspot juga.<br/>Category: Integration, Feature Request<br/>Sentiment: Positive<br/>Priority: Medium<br/><br/>3. Harga Anda konyol! $99/bulan untuk fitur dasar? Saya beralih ke Competitor X.<br/>Category: Pricing<br/>Sentiment: Negative<br/>Priority: High<br/><br/>4. Aplikasi mobile terus mogok ketika saya mencoba mengunggah file besar (>50MB). Ini penting untuk agen lapangan kami.<br/>Category: Performance<br/>Sentiment: Negative<br/>Priority: High<br/><br/>5. Secara keseluruhan, saya puas dengan produk ini. UI intuitif, dan dukungan pelanggan sangat baik. Teruskan!<br/>Category: UI/UX, Other (Customer Support)<br/>Sentiment: Positive<br/>Priority: Low |

</section>

***

<CardGroup cols={3}>
  <Card title="Perpustakaan prompt" icon="link" href="/docs/id/resources/prompt-library/library">
    Dapatkan inspirasi dari pilihan prompt yang dikurasi untuk berbagai tugas dan kasus penggunaan.
  </Card>
  <Card title="Tutorial prompting GitHub" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    Tutorial yang penuh dengan contoh yang mencakup konsep prompt engineering yang ditemukan di dokumentasi kami.
  </Card>
  <Card title="Tutorial prompting Google Sheets" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    Versi yang lebih ringan dari tutorial prompt engineering kami melalui spreadsheet interaktif.
  </Card>
</CardGroup>