# Gunakan perbaikan prompt kami untuk mengoptimalkan prompt Anda

Gunakan perbaikan prompt kami untuk mengoptimalkan prompt Anda

---

<Note>
Perbaikan prompt kami kompatibel dengan semua model Claude, termasuk yang memiliki kemampuan pemikiran diperluas. Untuk tips prompting khusus untuk model pemikiran diperluas, lihat [di sini](/docs/id/build-with-claude/extended-thinking).
</Note>

Perbaikan prompt membantu Anda dengan cepat melakukan iterasi dan meningkatkan prompt Anda melalui analisis dan peningkatan otomatis. Ini unggul dalam membuat prompt lebih kuat untuk tugas-tugas kompleks yang memerlukan akurasi tinggi.

<Frame>
  ![Image](/docs/images/prompt_improver.png)
</Frame>

## Sebelum Anda mulai

Anda memerlukan:
- [Template prompt](/docs/id/build-with-claude/prompt-engineering/prompt-templates-and-variables) untuk diperbaiki
- Umpan balik tentang masalah saat ini dengan output Claude (opsional tetapi disarankan)
- Contoh input dan output ideal (opsional tetapi disarankan)

## Cara kerja perbaikan prompt

Perbaikan prompt meningkatkan prompt Anda dalam 4 langkah:

1. **Identifikasi contoh**: Menemukan dan mengekstrak contoh dari template prompt Anda
2. **Draf awal**: Membuat template terstruktur dengan bagian yang jelas dan tag XML
3. **Penyempurnaan rantai pemikiran**: Menambahkan dan menyempurnakan instruksi penalaran yang detail
4. **Peningkatan contoh**: Memperbarui contoh untuk mendemonstrasikan proses penalaran yang baru

Anda dapat menyaksikan langkah-langkah ini terjadi secara real-time dalam modal perbaikan.

## Apa yang Anda dapatkan

Perbaikan prompt menghasilkan template dengan:
- Instruksi rantai pemikiran yang detail yang memandu proses penalaran Claude dan biasanya meningkatkan performanya
- Organisasi yang jelas menggunakan tag XML untuk memisahkan komponen yang berbeda
- Format contoh yang standar yang mendemonstrasikan penalaran langkah demi langkah dari input ke output
- Prefill strategis yang memandu respons awal Claude

<Note>
Meskipun contoh muncul secara terpisah dalam UI Workbench, mereka disertakan di awal pesan pengguna pertama dalam panggilan API yang sebenarnya. Lihat format mentah dengan mengklik "**\<\/\> Get Code**" atau masukkan contoh sebagai teks mentah melalui kotak Examples.
</Note>

## Cara menggunakan perbaikan prompt

1. Kirimkan template prompt Anda
2. Tambahkan umpan balik tentang masalah dengan output Claude saat ini (misalnya, "ringkasan terlalu dasar untuk audiens ahli")
3. Sertakan contoh input dan output ideal
4. Tinjau prompt yang telah diperbaiki

## Menghasilkan contoh tes

Belum memiliki contoh? Gunakan [Generator Kasus Tes](/docs/id/test-and-evaluate/eval-tool#creating-test-cases) kami untuk:
1. Menghasilkan input sampel
2. Mendapatkan respons Claude
3. Mengedit respons agar sesuai dengan output ideal Anda
4. Menambahkan contoh yang telah dipoles ke prompt Anda

## Kapan menggunakan perbaikan prompt

Perbaikan prompt bekerja paling baik untuk:
- Tugas kompleks yang memerlukan penalaran detail
- Situasi di mana akurasi lebih penting daripada kecepatan
- Masalah di mana output Claude saat ini memerlukan perbaikan signifikan

<Note>
Untuk aplikasi yang sensitif terhadap latensi atau biaya, pertimbangkan untuk menggunakan prompt yang lebih sederhana. Perbaikan prompt membuat template yang menghasilkan respons yang lebih panjang, lebih menyeluruh, tetapi lebih lambat.
</Note>

## Contoh perbaikan

Berikut cara perbaikan prompt meningkatkan prompt klasifikasi dasar:

<section title="Prompt asli">

```
Dari daftar judul artikel Wikipedia berikut, identifikasi artikel mana yang menjadi asal kalimat ini.
Respons hanya dengan judul artikel dan tidak ada yang lain.

Judul artikel:
{{titles}}

Kalimat untuk diklasifikasi:
{{sentence}}
```

</section>

<section title="Prompt yang diperbaiki">

```
Anda adalah sistem klasifikasi teks cerdas yang mengkhususkan diri dalam mencocokkan kalimat dengan judul artikel Wikipedia. Tugas Anda adalah mengidentifikasi artikel Wikipedia mana yang kemungkinan besar menjadi asal kalimat yang diberikan, berdasarkan daftar judul artikel yang disediakan.

Pertama, tinjau daftar judul artikel Wikipedia berikut:
<article_titles>
{{titles}}
</article_titles>

Sekarang, pertimbangkan kalimat ini yang perlu diklasifikasi:
<sentence_to_classify>
{{sentence}}
</sentence_to_classify>

Tujuan Anda adalah menentukan judul artikel mana dari daftar yang disediakan yang paling cocok dengan kalimat yang diberikan. Ikuti langkah-langkah berikut:

1. Daftarkan konsep kunci dari kalimat
2. Bandingkan setiap konsep kunci dengan judul artikel
3. Rangking 3 judul paling relevan teratas dan jelaskan mengapa mereka relevan
4. Pilih judul artikel yang paling tepat yang paling mencakup atau berkaitan dengan konten kalimat

Bungkus analisis Anda dalam tag <analysis>. Sertakan hal-hal berikut:
- Daftar konsep kunci dari kalimat
- Perbandingan setiap konsep kunci dengan judul artikel
- Peringkat 3 judul paling relevan teratas dengan penjelasan
- Pilihan akhir dan alasan Anda

Setelah analisis Anda, berikan jawaban akhir Anda: satu judul artikel Wikipedia yang paling tepat dari daftar.

Output hanya judul artikel yang dipilih, tanpa teks atau penjelasan tambahan.
```

</section>

Perhatikan bagaimana prompt yang diperbaiki:
- Menambahkan instruksi penalaran langkah demi langkah yang jelas
- Menggunakan tag XML untuk mengorganisir konten
- Memberikan persyaratan format output yang eksplisit
- Memandu Claude melalui proses analisis

## Pemecahan masalah

Masalah umum dan solusi:

- **Contoh tidak muncul dalam output**: Periksa bahwa contoh diformat dengan benar dengan tag XML dan muncul di awal pesan pengguna pertama
- **Rantai pemikiran terlalu bertele-tele**: Tambahkan instruksi spesifik tentang panjang output yang diinginkan dan tingkat detail
- **Langkah penalaran tidak sesuai dengan kebutuhan Anda**: Modifikasi bagian langkah agar sesuai dengan kasus penggunaan spesifik Anda

***

## Langkah selanjutnya

<CardGroup cols={3}>
  <Card title="Perpustakaan prompt" icon="link" href="/docs/id/resources/prompt-library/library">
    Dapatkan inspirasi dari contoh prompt untuk berbagai tugas.
  </Card>
  <Card title="Tutorial prompting GitHub" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    Pelajari praktik terbaik prompting dengan tutorial interaktif kami.
  </Card>
  <Card title="Tes prompt Anda" icon="link" href="/docs/id/test-and-evaluate/eval-tool">
    Gunakan alat evaluasi kami untuk menguji prompt yang telah diperbaiki.
  </Card>
</CardGroup>