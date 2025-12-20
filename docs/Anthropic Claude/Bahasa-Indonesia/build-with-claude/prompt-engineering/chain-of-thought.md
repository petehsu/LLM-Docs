# Biarkan Claude berpikir (chain of thought prompting) untuk meningkatkan performa

Pelajari cara menggunakan chain of thought prompting untuk meningkatkan kinerja Claude pada tugas-tugas kompleks

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

Ketika menghadapi tugas-tugas kompleks seperti penelitian, analisis, atau pemecahan masalah, memberikan ruang bagi Claude untuk berpikir dapat secara dramatis meningkatkan kinerjanya. Teknik ini, yang dikenal sebagai chain of thought (CoT) prompting, mendorong Claude untuk memecah masalah langkah demi langkah, yang menghasilkan output yang lebih akurat dan bernuansa.

## Sebelum menerapkan CoT

### Mengapa membiarkan Claude berpikir?
- **Akurasi:** Melangkah melalui masalah mengurangi kesalahan, terutama dalam matematika, logika, analisis, atau tugas-tugas kompleks secara umum.
- **Kohesi:** Pemikiran terstruktur menghasilkan respons yang lebih kohesif dan terorganisir dengan baik.
- **Debugging:** Melihat proses pemikiran Claude membantu Anda menentukan di mana prompt mungkin tidak jelas.

### Mengapa tidak membiarkan Claude berpikir?
- Peningkatan panjang output dapat mempengaruhi latensi.
- Tidak semua tugas memerlukan pemikiran mendalam. Gunakan CoT dengan bijaksana untuk memastikan keseimbangan yang tepat antara performa dan latensi.

<Tip>Gunakan CoT untuk tugas-tugas yang memerlukan pemikiran manusia, seperti matematika kompleks, analisis multi-langkah, penulisan dokumen kompleks, atau keputusan dengan banyak faktor.</Tip>

***

## Cara meminta pemikiran

Teknik chain of thought di bawah ini **diurutkan dari yang paling sederhana hingga paling kompleks**. Metode yang kurang kompleks menggunakan lebih sedikit ruang di jendela konteks, tetapi juga umumnya kurang kuat.

<Tip>**Tip CoT**: Selalu biarkan Claude mengeluarkan pemikirannya. Tanpa mengeluarkan proses pemikirannya, tidak ada pemikiran yang terjadi!</Tip>

- **Prompt dasar**: Sertakan "Pikirkan langkah demi langkah" dalam prompt Anda.
    - Kurang memberikan panduan tentang *bagaimana* berpikir (yang khususnya tidak ideal jika tugas sangat spesifik untuk aplikasi, kasus penggunaan, atau organisasi Anda)
    <section title="Contoh: Menulis email donor (CoT dasar)">

        | Peran | Konten |
        | ---- | ------- |
        | Pengguna | Buat email yang dipersonalisasi untuk donor yang meminta kontribusi untuk program Care for Kids tahun ini.<br/><br/>Informasi program:<br/>\\{\{PROGRAM_DETAILS}}<br/>\</program><br/><br/>Informasi donor:<br/>\<donor>\{\{DONOR_DETAILS}}<br/>\</donor><br/><br/>Pikirkan langkah demi langkah sebelum Anda menulis email. |
    
</section>
- **Prompt terpandu**: Uraikan langkah-langkah spesifik untuk diikuti Claude dalam proses pemikirannya.
    - Kurang terstruktur untuk memudahkan pemisahan dan pemisahan jawaban dari pemikiran.
    <section title="Contoh: Menulis email donor (CoT terpandu)">

        | Peran | Konten |
        | ---- | ------- |
        | Pengguna | Buat email yang dipersonalisasi untuk donor yang meminta kontribusi untuk program Care for Kids tahun ini.<br/><br/>Informasi program:<br/>\\{\{PROGRAM_DETAILS}}<br/>\</program><br/><br/>Informasi donor:<br/>\<donor>\{\{DONOR_DETAILS}}<br/>\</donor><br/><br/>Pikirkan sebelum Anda menulis email. Pertama, pikirkan pesan apa yang mungkin menarik bagi donor ini mengingat riwayat donasi mereka dan kampanye mana yang telah mereka dukung di masa lalu. Kemudian, pikirkan aspek apa dari program Care for Kids yang akan menarik bagi mereka, mengingat riwayat mereka. Terakhir, tulis email donor yang dipersonalisasi menggunakan analisis Anda. |
    
</section>
- **Prompt terstruktur**: Gunakan tag XML seperti `<thinking>` dan `<answer>` untuk memisahkan penalaran dari jawaban akhir.
     <section title="Contoh: Menulis email donor (CoT terpandu terstruktur)">

        | Peran | Konten |
        | ---- | ------- |
        | Pengguna | Buat email yang dipersonalisasi untuk donor yang meminta kontribusi untuk program Care for Kids tahun ini.<br/><br/>Informasi program:<br/>\\{\{PROGRAM_DETAILS}}<br/>\</program><br/><br/>Informasi donor:<br/>\<donor>\{\{DONOR_DETAILS}}<br/>\</donor><br/><br/>Pikirkan sebelum Anda menulis email dalam tag \<thinking>. Pertama, pikirkan pesan apa yang mungkin menarik bagi donor ini mengingat riwayat donasi mereka dan kampanye mana yang telah mereka dukung di masa lalu. Kemudian, pikirkan aspek apa dari program Care for Kids yang akan menarik bagi mereka, mengingat riwayat mereka. Terakhir, tulis email donor yang dipersonalisasi dalam tag \<email>, menggunakan analisis Anda. |
    
</section>
    
### Contoh

  <section title="Contoh: Analisis keuangan tanpa pemikiran">

    Tanpa pemikiran langkah demi langkah, Claude memberikan rekomendasi yang tampak masuk akal tetapi kurang mendalam. Ini tidak mengukur hasil potensial atau mempertimbangkan kinerja pasar historis, yang sangat penting untuk membuat keputusan yang tepat.
    | Peran | Konten |
    | ---- | ------- |
    | Pengguna | Anda adalah penasihat keuangan. Seorang klien ingin berinvestasi \$10.000. Mereka dapat memilih antara dua opsi: A) Saham yang secara historis memberikan pengembalian 12% per tahun tetapi volatil, atau B) Obligasi yang menjamin pengembalian 6% per tahun. Klien membutuhkan uang dalam 5 tahun untuk uang muka rumah. Opsi mana yang Anda rekomendasikan? |
    | Asisten | Berdasarkan informasi yang diberikan, saya akan merekomendasikan opsi B, obligasi yang menjamin pengembalian 6% per tahun. Berikut alasannya:<br/><br/>1. Kepastian: Obligasi menawarkan pengembalian 6% per tahun yang dijamin, yang memberikan kepastian dalam perencanaan keuangan. Ini sangat penting ketika klien memiliki tujuan keuangan tertentu (uang muka) dengan jangka waktu tetap (5 tahun).<br/>2. Penghindaran risiko: Karena klien membutuhkan uang ini untuk acara kehidupan penting (membeli rumah), mereka mungkin memiliki toleransi risiko yang rendah. Volatilitas pasar saham dapat membahayakan rencana mereka jika ada penurunan mendekati waktu mereka membutuhkan dana.<br/>3. Jangka waktu: Dengan hanya 5 tahun, ada lebih sedikit waktu untuk pulih dari potensi penurunan pasar saham. Cakrawala investasi yang lebih lama (10+ tahun) umumnya lebih cocok untuk mengatasi volatilitas pasar saham.<br/><br/>Meskipun pengembalian historis saham sebesar 12% menarik, kinerja masa lalu tidak menjamin hasil di masa depan. Pengembalian 6% yang dijamin dari obligasi memastikan klien akan memiliki dana yang mereka butuhkan ketika saatnya membuat uang muka. |
  
</section>
  <section title="Contoh: Analisis keuangan dengan pemikiran">

    Dengan pemikiran langkah demi langkah, penasihat memberikan analisis yang jauh lebih kaya. Ini menghitung angka pasti untuk kedua skenario, mempertimbangkan volatilitas pasar historis, dan secara mendalam menganalisis toleransi risiko klien. Penalaran menyeluruh ini menghasilkan rekomendasi yang lebih percaya diri dan dapat dipertanggungjawabkan.
    | Peran | Konten |
    | ---- | ------- |
    | Pengguna | Anda adalah penasihat keuangan. Seorang klien ingin berinvestasi \$10.000. Mereka dapat memilih antara dua opsi: A) Saham yang secara historis memberikan pengembalian 12% per tahun tetapi volatil, atau B) Obligasi yang menjamin pengembalian 6% per tahun. Klien membutuhkan uang dalam 5 tahun untuk uang muka rumah. Opsi mana yang Anda rekomendasikan? Pikirkan langkah demi langkah. |
    | Asisten | Untuk menentukan opsi investasi terbaik untuk klien kami, saya akan mempertimbangkan beberapa faktor langkah demi langkah:<br/><br/>\<thinking><br/>1. Pahami tujuan dan jangka waktu klien:<br/>   - Tujuan: Uang muka untuk rumah<br/>   - Jangka waktu: 5 tahun<br/>   - Implikasi: Ini adalah tujuan keuangan jangka pendek dengan prioritas tinggi. Klien mungkin tidak dapat menahan risiko atau volatilitas yang signifikan.<br/><br/>2. Analisis Opsi A (Saham):<br/>   - Keuntungan: Pengembalian historis lebih tinggi (12% per tahun)<br/>   - Kerugian: Volatil (menyiratkan potensi keuntungan atau kerugian yang signifikan)<br/>   - Hitung potensi pengembalian 5 tahun:<br/>     - Kasus terbaik (12% per tahun): \$10.000 * (1.12)^5 ≈ \$17.623,42<br/>     - Kasus terburuk (kecelakaan pasar): Bisa kehilangan sebagian besar, misalnya kecelakaan 50% = \$5.000<br/><br/>3. Analisis Opsi B (Obligasi):<br/>   - Keuntungan: Pengembalian yang dijamin (6% per tahun)<br/>   - Kerugian: Pengembalian lebih rendah dibandingkan dengan kinerja saham historis<br/>   - Hitung pengembalian 5 tahun:<br/>     - Dijamin: \$10.000 * (1.06)^5 ≈ \$13.382,25<br/><br/>4. Pertimbangkan toleransi risiko:<br/>   - Tujuan adalah uang muka rumah (penting, bukan kebijaksanaan)<br/>   - Jangka waktu pendek (5 tahun) membatasi kemampuan untuk pulih dari penurunan pasar<br/>   - Kesimpulan: Klien mungkin memiliki toleransi risiko yang rendah<br/><br/>5. Perspektif historis:<br/>   - Saham 12% adalah historis, bukan dijamin<br/>   - Dalam periode 5 tahun, pasar saham dapat bervariasi liar:<br/>     - 2003-2007 (pra-krisis keuangan): S&P 500 naik ~82%<br/>     - 2007-2011 (selama krisis): S&P 500 turun ~2%<br/>   - Kesimpulan: Kinerja masa lalu tidak menjamin hasil di masa depan, terutama jangka pendek<br/><br/>6. Analisis akhir:<br/>   - Opsi A (Saham): Potensi pengembalian lebih tinggi tetapi risiko yang tidak dapat diterima untuk tidak memenuhi tujuan uang muka<br/>   - Opsi B (Obligasi): Dijamin untuk memenuhi ~80% dari skenario terbaik saham, 100% kepastian memiliki dana<br/>\</thinking><br/><br/>\<answer><br/>Saya merekomendasikan Opsi B, obligasi dengan pengembalian 6% per tahun yang dijamin. Meskipun pengembalian historis saham sebesar 12% menggoda, obligasi memastikan Anda akan memiliki \$13.382,25 dalam 5 tahun untuk uang muka rumah Anda. Mengingat pentingnya dan jangka waktu singkat dari tujuan Anda, volatilitas saham menimbulkan risiko yang tidak dapat diterima. Obligasi memberikan kepastian, yang sangat berharga untuk pencapaian keuangan yang sangat penting.<br/>\</answer> |
  
</section>

***

<CardGroup cols={3}>
  <Card title="Perpustakaan prompt" icon="link" href="/docs/id/resources/prompt-library/library">
    Dapatkan inspirasi dari pilihan prompt yang dikurasi untuk berbagai tugas dan kasus penggunaan.
  </Card>
  <Card title="Tutorial prompting GitHub" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    Tutorial yang penuh dengan contoh yang mencakup konsep prompt engineering yang ditemukan di dokumen kami.
  </Card>
  <Card title="Tutorial prompting Google Sheets" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    Versi yang lebih ringan dari tutorial prompt engineering kami melalui spreadsheet interaktif.
  </Card>
</CardGroup>