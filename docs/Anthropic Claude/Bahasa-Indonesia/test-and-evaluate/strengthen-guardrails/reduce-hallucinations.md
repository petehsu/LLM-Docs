# Mengurangi halusinasi

---

Bahkan model bahasa paling canggih seperti Claude terkadang dapat menghasilkan teks yang secara faktual tidak benar atau tidak konsisten dengan konteks yang diberikan. Fenomena ini, yang dikenal sebagai "halusinasi," dapat merusak keandalan solusi berbasis AI Anda.
Panduan ini akan mengeksplorasi teknik-teknik untuk meminimalkan halusinasi dan memastikan output Claude akurat dan dapat dipercaya.

## Strategi dasar minimalisasi halusinasi

- **Izinkan Claude untuk mengatakan "Saya tidak tahu":** Berikan izin secara eksplisit kepada Claude untuk mengakui ketidakpastian. Teknik sederhana ini dapat secara drastis mengurangi informasi yang salah.

<section title="Contoh: Menganalisis laporan merger & akuisisi">

| Peran | Konten |
| ---- | --- |
| Pengguna | Sebagai penasihat M&A kami, analisis laporan ini tentang potensi akuisisi AcmeCo oleh ExampleCorp.<br/><br/>\<report><br/>\{\{REPORT}}<br/>\</report><br/><br/>Fokus pada proyeksi keuangan, risiko integrasi, dan hambatan regulasi. Jika Anda tidak yakin tentang aspek apa pun atau jika laporan tidak memiliki informasi yang diperlukan, katakan "Saya tidak memiliki cukup informasi untuk menilai ini dengan yakin." |

</section>

- **Gunakan kutipan langsung untuk landasan faktual:** Untuk tugas yang melibatkan dokumen panjang (>20K token), minta Claude untuk mengekstrak kutipan kata demi kata terlebih dahulu sebelum melakukan tugasnya. Ini mendasarkan responnya pada teks yang sebenarnya, mengurangi halusinasi.

<section title="Contoh: Mengaudit kebijakan privasi data">

| Peran | Konten |
| ---- | --- |
| Pengguna | Sebagai Petugas Perlindungan Data kami, tinjau kebijakan privasi yang diperbarui ini untuk kepatuhan GDPR dan CCPA.<br/>\<br/>\{\{POLICY}}<br/>\</policy><br/><br/>1. Ekstrak kutipan tepat dari kebijakan yang paling relevan dengan kepatuhan GDPR dan CCPA. Jika Anda tidak dapat menemukan kutipan yang relevan, nyatakan "Tidak ditemukan kutipan yang relevan."<br/><br/>2. Gunakan kutipan tersebut untuk menganalisis kepatuhan bagian kebijakan ini, dengan merujuk pada kutipan berdasarkan nomor. Hanya dasarkan analisis Anda pada kutipan yang diekstrak. |

</section>

- **Verifikasi dengan kutipan**: Buat respons Claude dapat diaudit dengan memintanya mengutip kutipan dan sumber untuk setiap klaimnya. Anda juga dapat meminta Claude memverifikasi setiap klaim dengan mencari kutipan pendukung setelah menghasilkan respons. Jika tidak dapat menemukan kutipan, ia harus menarik kembali klaim tersebut.

<section title="Contoh: Menyusun siaran pers tentang peluncuran produk">

| Peran | Konten |
| ---- | --- |
| Pengguna | Susun siaran pers untuk produk keamanan siber baru kami, AcmeSecurity Pro, hanya menggunakan informasi dari ringkasan produk dan laporan pasar ini.<br/>\<documents><br/>\{\{DOCUMENTS}}<br/>\</documents><br/><br/>Setelah menyusun, tinjau setiap klaim dalam siaran pers Anda. Untuk setiap klaim, temukan kutipan langsung dari dokumen yang mendukungnya. Jika Anda tidak dapat menemukan kutipan pendukung untuk suatu klaim, hapus klaim tersebut dari siaran pers dan tandai tempat penghapusannya dengan tanda kurung kosong []. |

</section>

***

## Teknik lanjutan

- **Verifikasi rantai pemikiran**: Minta Claude untuk menjelaskan penalarannya langkah demi langkah sebelum memberikan jawaban akhir. Ini dapat mengungkap logika atau asumsi yang salah.

- **Verifikasi Best-of-N**: Jalankan Claude melalui prompt yang sama beberapa kali dan bandingkan outputnya. Inkonsistensi antar output bisa mengindikasikan halusinasi.

- **Penyempurnaan iteratif**: Gunakan output Claude sebagai input untuk prompt lanjutan, memintanya untuk memverifikasi atau memperluas pernyataan sebelumnya. Ini dapat menangkap dan mengoreksi inkonsistensi.

- **Pembatasan pengetahuan eksternal**: Secara eksplisit instruksikan Claude untuk hanya menggunakan informasi dari dokumen yang disediakan dan bukan pengetahuan umumnya.

<Note>Ingat, meskipun teknik-teknik ini secara signifikan mengurangi halusinasi, mereka tidak sepenuhnya menghilangkannya. Selalu validasi informasi penting, terutama untuk keputusan berisiko tinggi.</Note>