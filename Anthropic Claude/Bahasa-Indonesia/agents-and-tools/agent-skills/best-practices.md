# Praktik terbaik pembuatan Skill

Pelajari cara menulis Skill yang efektif yang dapat ditemukan dan digunakan oleh Claude dengan sukses.

---

Skill yang baik adalah ringkas, terstruktur dengan baik, dan diuji dengan penggunaan nyata. Panduan ini menyediakan keputusan penulisan praktis untuk membantu Anda menulis Skill yang dapat ditemukan dan digunakan oleh Claude secara efektif.

Untuk latar belakang konseptual tentang cara kerja Skill, lihat [ringkasan Skill](/docs/id/agents-and-tools/agent-skills/overview).

## Prinsip inti

### Ringkas adalah kunci

[Jendela konteks](/docs/id/build-with-claude/context-windows) adalah barang publik. Skill Anda berbagi jendela konteks dengan semua hal lain yang perlu diketahui Claude, termasuk:
- Prompt sistem
- Riwayat percakapan
- Metadata Skill lain
- Permintaan aktual Anda

Tidak setiap token dalam Skill Anda memiliki biaya langsung. Saat startup, hanya metadata (nama dan deskripsi) dari semua Skill yang dimuat sebelumnya. Claude membaca SKILL.md hanya ketika Skill menjadi relevan, dan membaca file tambahan hanya sesuai kebutuhan. Namun, menjadi ringkas dalam SKILL.md tetap penting: setelah Claude memuatnya, setiap token bersaing dengan riwayat percakapan dan konteks lainnya.

**Asumsi default**: Claude sudah sangat pintar

Hanya tambahkan konteks yang tidak dimiliki Claude. Tantang setiap informasi:
- "Apakah Claude benar-benar membutuhkan penjelasan ini?"
- "Bisakah saya menganggap Claude mengetahui ini?"
- "Apakah paragraf ini membenarkan biaya tokennya?"

**Contoh baik: Ringkas** (sekitar 50 token):
````markdown
## Ekstrak teks PDF

Gunakan pdfplumber untuk ekstraksi teks:

```python
import pdfplumber

with pdfplumber.open("file.pdf") as pdf:
    text = pdf.pages[0].extract_text()
```
````

**Contoh buruk: Terlalu bertele-tele** (sekitar 150 token):
```markdown
## Ekstrak teks PDF

PDF (Portable Document Format) adalah format file umum yang berisi
teks, gambar, dan konten lainnya. Untuk mengekstrak teks dari PDF, Anda perlu
menggunakan perpustakaan. Ada banyak perpustakaan yang tersedia untuk pemrosesan PDF, tetapi kami
merekomendasikan pdfplumber karena mudah digunakan dan menangani sebagian besar kasus dengan baik.
Pertama, Anda perlu menginstalnya menggunakan pip. Kemudian Anda dapat menggunakan kode di bawah ini...
```

Versi ringkas menganggap Claude mengetahui apa itu PDF dan cara kerja perpustakaan.

### Tetapkan tingkat kebebasan yang sesuai

Cocokkan tingkat spesifisitas dengan kerapuhan dan variabilitas tugas.

**Kebebasan tinggi** (instruksi berbasis teks):

Gunakan ketika:
- Beberapa pendekatan valid
- Keputusan bergantung pada konteks
- Heuristik memandu pendekatan

Contoh:
```markdown
## Proses tinjauan kode

1. Analisis struktur dan organisasi kode
2. Periksa potensi bug atau kasus tepi
3. Sarankan perbaikan untuk keterbacaan dan pemeliharaan
4. Verifikasi kepatuhan terhadap konvensi proyek
```

**Kebebasan sedang** (pseudocode atau skrip dengan parameter):

Gunakan ketika:
- Pola yang disukai ada
- Beberapa variasi dapat diterima
- Konfigurasi mempengaruhi perilaku

Contoh:
````markdown
## Buat laporan

Gunakan template ini dan sesuaikan sesuai kebutuhan:

```python
def generate_report(data, format="markdown", include_charts=True):
    # Proses data
    # Buat output dalam format yang ditentukan
    # Secara opsional sertakan visualisasi
```
````

**Kebebasan rendah** (skrip spesifik, beberapa atau tanpa parameter):

Gunakan ketika:
- Operasi rapuh dan rentan kesalahan
- Konsistensi sangat penting
- Urutan spesifik harus diikuti

Contoh:
````markdown
## Migrasi database

Jalankan skrip ini dengan tepat:

```bash
python scripts/migrate.py --verify --backup
```

Jangan ubah perintah atau tambahkan flag tambahan.
````

**Analogi**: Pikirkan Claude sebagai robot yang menjelajahi jalan:
- **Jembatan sempit dengan tebing di kedua sisi**: Hanya ada satu cara yang aman untuk maju. Berikan pagar pembatas spesifik dan instruksi tepat (kebebasan rendah). Contoh: migrasi database yang harus berjalan dalam urutan yang tepat.
- **Lapangan terbuka tanpa bahaya**: Banyak jalan menuju kesuksesan. Berikan arah umum dan percayai Claude untuk menemukan rute terbaik (kebebasan tinggi). Contoh: tinjauan kode di mana konteks menentukan pendekatan terbaik.

### Uji dengan semua model yang Anda rencanakan untuk digunakan

Skill bertindak sebagai tambahan untuk model, jadi efektivitas bergantung pada model yang mendasarinya. Uji Skill Anda dengan semua model yang Anda rencanakan untuk digunakan.

**Pertimbangan pengujian menurut model**:
- **Claude Haiku** (cepat, ekonomis): Apakah Skill memberikan cukup panduan?
- **Claude Sonnet** (seimbang): Apakah Skill jelas dan efisien?
- **Claude Opus** (penalaran kuat): Apakah Skill menghindari penjelasan berlebihan?

Apa yang bekerja sempurna untuk Opus mungkin memerlukan lebih banyak detail untuk Haiku. Jika Anda merencanakan untuk menggunakan Skill Anda di beberapa model, targetkan instruksi yang bekerja dengan baik untuk semua model.

## Struktur Skill

<Note>
**Frontmatter YAML**: Frontmatter SKILL.md memerlukan dua bidang:

`name`:
- Maksimal 64 karakter
- Harus hanya berisi huruf kecil, angka, dan tanda hubung
- Tidak dapat berisi tag XML
- Tidak dapat berisi kata-kata yang dicadangkan: "anthropic", "claude"

`description`:
- Harus tidak kosong
- Maksimal 1024 karakter
- Tidak dapat berisi tag XML
- Harus menjelaskan apa yang dilakukan Skill dan kapan menggunakannya

Untuk detail struktur Skill lengkap, lihat [ringkasan Skill](/docs/id/agents-and-tools/agent-skills/overview#skill-structure).
</Note>

### Konvensi penamaan

Gunakan pola penamaan yang konsisten untuk membuat Skill lebih mudah direferensikan dan didiskusikan. Kami merekomendasikan menggunakan **bentuk gerund** (kata kerja + -ing) untuk nama Skill, karena ini dengan jelas menjelaskan aktivitas atau kemampuan yang disediakan Skill.

Ingat bahwa bidang `name` harus menggunakan hanya huruf kecil, angka, dan tanda hubung.

**Contoh penamaan baik (bentuk gerund)**:
- `processing-pdfs`
- `analyzing-spreadsheets`
- `managing-databases`
- `testing-code`
- `writing-documentation`

**Alternatif yang dapat diterima**:
- Frasa nomina: `pdf-processing`, `spreadsheet-analysis`
- Berorientasi pada tindakan: `process-pdfs`, `analyze-spreadsheets`

**Hindari**:
- Nama yang tidak jelas: `helper`, `utils`, `tools`
- Terlalu umum: `documents`, `data`, `files`
- Kata-kata yang dicadangkan: `anthropic-helper`, `claude-tools`
- Pola yang tidak konsisten dalam koleksi skill Anda

Penamaan yang konsisten memudahkan untuk:
- Mereferensikan Skill dalam dokumentasi dan percakapan
- Memahami apa yang dilakukan Skill sekilas
- Mengorganisir dan mencari melalui beberapa Skill
- Mempertahankan perpustakaan skill yang profesional dan kohesif

### Menulis deskripsi yang efektif

Bidang `description` memungkinkan penemuan Skill dan harus mencakup apa yang dilakukan Skill dan kapan menggunakannya.

<Warning>
**Selalu tulis dalam orang ketiga**. Deskripsi disuntikkan ke dalam prompt sistem, dan sudut pandang yang tidak konsisten dapat menyebabkan masalah penemuan.

- **Baik:** "Memproses file Excel dan menghasilkan laporan"
- **Hindari:** "Saya dapat membantu Anda memproses file Excel"
- **Hindari:** "Anda dapat menggunakan ini untuk memproses file Excel"
</Warning>

**Jadilah spesifik dan sertakan istilah kunci**. Sertakan apa yang dilakukan Skill dan pemicu/konteks spesifik untuk kapan menggunakannya.

Setiap Skill memiliki tepat satu bidang deskripsi. Deskripsi sangat penting untuk pemilihan skill: Claude menggunakannya untuk memilih Skill yang tepat dari 100+ Skill yang tersedia. Deskripsi Anda harus memberikan cukup detail agar Claude tahu kapan memilih Skill ini, sementara sisa SKILL.md menyediakan detail implementasi.

Contoh yang efektif:

**Skill pemrosesan PDF:**
```yaml
description: Ekstrak teks dan tabel dari file PDF, isi formulir, gabungkan dokumen. Gunakan saat bekerja dengan file PDF atau ketika pengguna menyebutkan PDF, formulir, atau ekstraksi dokumen.
```

**Skill analisis Excel:**
```yaml
description: Analisis spreadsheet Excel, buat tabel pivot, buat bagan. Gunakan saat menganalisis file Excel, spreadsheet, data tabel, atau file .xlsx.
```

**Skill pembantu Git Commit:**
```yaml
description: Buat pesan commit deskriptif dengan menganalisis git diff. Gunakan ketika pengguna meminta bantuan menulis pesan commit atau meninjau perubahan yang dipentingkan.
```

Hindari deskripsi yang tidak jelas seperti ini:

```yaml
description: Membantu dengan dokumen
```
```yaml
description: Memproses data
```
```yaml
description: Melakukan hal-hal dengan file
```

### Pola pengungkapan progresif

SKILL.md berfungsi sebagai ikhtisar yang menunjukkan Claude ke materi terperinci sesuai kebutuhan, seperti daftar isi dalam panduan orientasi. Untuk penjelasan tentang cara kerja pengungkapan progresif, lihat [Cara kerja Skill](/docs/id/agents-and-tools/agent-skills/overview#how-skills-work) dalam ringkasan.

**Panduan praktis:**
- Jaga badan SKILL.md di bawah 500 baris untuk kinerja optimal
- Pisahkan konten ke file terpisah saat mendekati batas ini
- Gunakan pola di bawah untuk mengorganisir instruksi, kode, dan sumber daya secara efektif

#### Ikhtisar visual: Dari sederhana hingga kompleks

Skill dasar dimulai dengan hanya file SKILL.md yang berisi metadata dan instruksi:

![File SKILL.md sederhana menunjukkan frontmatter YAML dan badan markdown](/docs/images/agent-skills-simple-file.png)

Saat Skill Anda berkembang, Anda dapat membundel konten tambahan yang Claude muat hanya saat diperlukan:

![Membundel file referensi tambahan seperti reference.md dan forms.md.](/docs/images/agent-skills-bundling-content.png)

Struktur direktori Skill lengkap mungkin terlihat seperti ini:

```
pdf/
├── SKILL.md              # Instruksi utama (dimuat saat dipicu)
├── FORMS.md              # Panduan pengisian formulir (dimuat sesuai kebutuhan)
├── reference.md          # Referensi API (dimuat sesuai kebutuhan)
├── examples.md           # Contoh penggunaan (dimuat sesuai kebutuhan)
└── scripts/
    ├── analyze_form.py   # Skrip utilitas (dieksekusi, tidak dimuat)
    ├── fill_form.py      # Skrip pengisian formulir
    └── validate.py       # Skrip validasi
```

#### Pola 1: Panduan tingkat tinggi dengan referensi

````markdown
---
name: pdf-processing
description: Mengekstrak teks dan tabel dari file PDF, mengisi formulir, dan menggabungkan dokumen. Gunakan saat bekerja dengan file PDF atau ketika pengguna menyebutkan PDF, formulir, atau ekstraksi dokumen.
---

# Pemrosesan PDF

## Mulai cepat

Ekstrak teks dengan pdfplumber:
```python
import pdfplumber
with pdfplumber.open("file.pdf") as pdf:
    text = pdf.pages[0].extract_text()
```

## Fitur lanjutan

**Pengisian formulir**: Lihat [FORMS.md](FORMS.md) untuk panduan lengkap
**Referensi API**: Lihat [REFERENCE.md](REFERENCE.md) untuk semua metode
**Contoh**: Lihat [EXAMPLES.md](EXAMPLES.md) untuk pola umum
````

Claude memuat FORMS.md, REFERENCE.md, atau EXAMPLES.md hanya saat diperlukan.

#### Pola 2: Organisasi khusus domain

Untuk Skill dengan beberapa domain, atur konten menurut domain untuk menghindari memuat konteks yang tidak relevan. Ketika pengguna menanyakan metrik penjualan, Claude hanya perlu membaca skema terkait penjualan, bukan data keuangan atau pemasaran. Ini menjaga penggunaan token rendah dan konteks terfokus.

```
bigquery-skill/
├── SKILL.md (ikhtisar dan navigasi)
└── reference/
    ├── finance.md (pendapatan, metrik penagihan)
    ├── sales.md (peluang, pipeline)
    ├── product.md (penggunaan API, fitur)
    └── marketing.md (kampanye, atribusi)
```

````markdown SKILL.md
# Analisis Data BigQuery

## Dataset yang tersedia

**Keuangan**: Pendapatan, ARR, penagihan → Lihat [reference/finance.md](reference/finance.md)
**Penjualan**: Peluang, pipeline, akun → Lihat [reference/sales.md](reference/sales.md)
**Produk**: Penggunaan API, fitur, adopsi → Lihat [reference/product.md](reference/product.md)
**Pemasaran**: Kampanye, atribusi, email → Lihat [reference/marketing.md](reference/marketing.md)

## Pencarian cepat

Temukan metrik spesifik menggunakan grep:

```bash
grep -i "revenue" reference/finance.md
grep -i "pipeline" reference/sales.md
grep -i "api usage" reference/product.md
```
````

#### Pola 3: Detail bersyarat

Tampilkan konten dasar, tautkan ke konten lanjutan:

```markdown
# Pemrosesan DOCX

## Membuat dokumen

Gunakan docx-js untuk dokumen baru. Lihat [DOCX-JS.md](DOCX-JS.md).

## Mengedit dokumen

Untuk pengeditan sederhana, ubah XML secara langsung.

**Untuk perubahan terlacak**: Lihat [REDLINING.md](REDLINING.md)
**Untuk detail OOXML**: Lihat [OOXML.md](OOXML.md)
```

Claude membaca REDLINING.md atau OOXML.md hanya ketika pengguna memerlukan fitur tersebut.

### Hindari referensi yang sangat bersarang

Claude mungkin membaca sebagian file ketika direferensikan dari file yang direferensikan lainnya. Saat menghadapi referensi bersarang, Claude mungkin menggunakan perintah seperti `head -100` untuk melihat pratinjau konten daripada membaca seluruh file, menghasilkan informasi yang tidak lengkap.

**Jaga referensi satu level dalam dari SKILL.md**. Semua file referensi harus tautkan langsung dari SKILL.md untuk memastikan Claude membaca file lengkap saat diperlukan.

**Contoh buruk: Terlalu dalam**:
```markdown
# SKILL.md
Lihat [advanced.md](advanced.md)...

# advanced.md
Lihat [details.md](details.md)...

# details.md
Berikut informasi aktualnya...
```

**Contoh baik: Satu level dalam**:
```markdown
# SKILL.md

**Penggunaan dasar**: [instruksi dalam SKILL.md]
**Fitur lanjutan**: Lihat [advanced.md](advanced.md)
**Referensi API**: Lihat [reference.md](reference.md)
**Contoh**: Lihat [examples.md](examples.md)
```

### Struktur file referensi yang lebih panjang dengan daftar isi

Untuk file referensi yang lebih panjang dari 100 baris, sertakan daftar isi di bagian atas. Ini memastikan Claude dapat melihat cakupan lengkap informasi yang tersedia bahkan saat melihat pratinjau dengan pembacaan sebagian.

**Contoh**:
```markdown
# Referensi API

## Isi
- Autentikasi dan pengaturan
- Metode inti (buat, baca, perbarui, hapus)
- Fitur lanjutan (operasi batch, webhook)
- Pola penanganan kesalahan
- Contoh kode

## Autentikasi dan pengaturan
...

## Metode inti
...
```

Claude kemudian dapat membaca file lengkap atau melompat ke bagian spesifik sesuai kebutuhan.

Untuk detail tentang bagaimana arsitektur berbasis filesystem ini memungkinkan pengungkapan progresif, lihat bagian [Lingkungan runtime](#runtime-environment) di bagian Lanjutan di bawah.

## Alur kerja dan loop umpan balik

### Gunakan alur kerja untuk tugas kompleks

Pecahkan operasi kompleks menjadi langkah-langkah yang jelas dan berurutan. Untuk alur kerja yang sangat kompleks, berikan daftar periksa yang dapat disalin Claude ke dalam responsnya dan dicentang saat maju.

**Contoh 1: Alur kerja sintesis penelitian** (untuk Skill tanpa kode):

````markdown
## Alur kerja sintesis penelitian

Salin daftar periksa ini dan lacak kemajuan Anda:

```
Kemajuan Penelitian:
- [ ] Langkah 1: Baca semua dokumen sumber
- [ ] Langkah 2: Identifikasi tema kunci
- [ ] Langkah 3: Referensi silang klaim
- [ ] Langkah 4: Buat ringkasan terstruktur
- [ ] Langkah 5: Verifikasi kutipan
```

**Langkah 1: Baca semua dokumen sumber**

Tinjau setiap dokumen di direktori `sources/`. Catat argumen utama dan bukti pendukung.

**Langkah 2: Identifikasi tema kunci**

Cari pola di seluruh sumber. Tema apa yang muncul berulang kali? Di mana sumber setuju atau tidak setuju?

**Langkah 3: Referensi silang klaim**

Untuk setiap klaim utama, verifikasi muncul dalam materi sumber. Catat sumber mana yang mendukung setiap poin.

**Langkah 4: Buat ringkasan terstruktur**

Atur temuan menurut tema. Sertakan:
- Klaim utama
- Bukti pendukung dari sumber
- Sudut pandang yang bertentangan (jika ada)

**Langkah 5: Verifikasi kutipan**

Periksa bahwa setiap klaim mereferensikan dokumen sumber yang benar. Jika kutipan tidak lengkap, kembali ke Langkah 3.
````

Contoh ini menunjukkan bagaimana alur kerja berlaku untuk tugas analisis yang tidak memerlukan kode. Pola daftar periksa bekerja untuk proses multi-langkah yang kompleks.

**Contoh 2: Alur kerja pengisian formulir PDF** (untuk Skill dengan kode):

````markdown
## Alur kerja pengisian formulir PDF

Salin daftar periksa ini dan centang item saat Anda menyelesaikannya:

```
Kemajuan Tugas:
- [ ] Langkah 1: Analisis formulir (jalankan analyze_form.py)
- [ ] Langkah 2: Buat pemetaan bidang (edit fields.json)
- [ ] Langkah 3: Validasi pemetaan (jalankan validate_fields.py)
- [ ] Langkah 4: Isi formulir (jalankan fill_form.py)
- [ ] Langkah 5: Verifikasi output (jalankan verify_output.py)
```

**Langkah 1: Analisis formulir**

Jalankan: `python scripts/analyze_form.py input.pdf`

Ini mengekstrak bidang formulir dan lokasinya, menyimpan ke `fields.json`.

**Langkah 2: Buat pemetaan bidang**

Edit `fields.json` untuk menambahkan nilai untuk setiap bidang.

**Langkah 3: Validasi pemetaan**

Jalankan: `python scripts/validate_fields.py fields.json`

Perbaiki kesalahan validasi apa pun sebelum melanjutkan.

**Langkah 4: Isi formulir**

Jalankan: `python scripts/fill_form.py input.pdf fields.json output.pdf`

**Langkah 5: Verifikasi output**

Jalankan: `python scripts/verify_output.py output.pdf`

Jika verifikasi gagal, kembali ke Langkah 2.
````

Langkah-langkah yang jelas mencegah Claude melewatkan validasi kritis. Daftar periksa membantu Claude dan Anda melacak kemajuan melalui alur kerja multi-langkah.

### Implementasikan loop umpan balik

**Pola umum**: Jalankan validator → perbaiki kesalahan → ulangi

Pola ini sangat meningkatkan kualitas output.

**Contoh 1: Kepatuhan panduan gaya** (untuk Skill tanpa kode):

```markdown
## Proses tinjauan konten

1. Buat draf konten Anda mengikuti panduan dalam STYLE_GUIDE.md
2. Tinjau terhadap daftar periksa:
   - Periksa konsistensi terminologi
   - Verifikasi contoh mengikuti format standar
   - Konfirmasi semua bagian yang diperlukan ada
3. Jika masalah ditemukan:
   - Catat setiap masalah dengan referensi bagian spesifik
   - Revisi konten
   - Tinjau daftar periksa lagi
4. Hanya lanjutkan ketika semua persyaratan terpenuhi
5. Finalisasi dan simpan dokumen
```

Ini menunjukkan pola loop validasi menggunakan dokumen referensi daripada skrip. "Validator" adalah STYLE_GUIDE.md, dan Claude melakukan pemeriksaan dengan membaca dan membandingkan.

**Contoh 2: Proses pengeditan dokumen** (untuk Skill dengan kode):

```markdown
## Proses pengeditan dokumen

1. Buat pengeditan Anda ke `word/document.xml`
2. **Validasi segera**: `python ooxml/scripts/validate.py unpacked_dir/`
3. Jika validasi gagal:
   - Tinjau pesan kesalahan dengan hati-hati
   - Perbaiki masalah dalam XML
   - Jalankan validasi lagi
4. **Hanya lanjutkan ketika validasi lulus**
5. Bangun kembali: `python ooxml/scripts/pack.py unpacked_dir/ output.docx`
6. Uji dokumen output
```

Loop validasi menangkap kesalahan lebih awal.

## Panduan konten

### Hindari informasi sensitif waktu

Jangan sertakan informasi yang akan ketinggalan zaman:

**Contoh buruk: Sensitif waktu** (akan menjadi salah):
```markdown
Jika Anda melakukan ini sebelum Agustus 2025, gunakan API lama.
Setelah Agustus 2025, gunakan API baru.
```

**Contoh baik** (gunakan bagian "pola lama"):
```markdown
## Metode saat ini

Gunakan endpoint API v2: `api.example.com/v2/messages`

## Pola lama

<details>
<summary>API v1 warisan (tidak digunakan lagi 2025-08)</summary>

API v1 menggunakan: `api.example.com/v1/messages`

Endpoint ini tidak lagi didukung.
</details>
```

Bagian pola lama menyediakan konteks historis tanpa mengacaukan konten utama.

### Gunakan terminologi yang konsisten

Pilih satu istilah dan gunakan di seluruh Skill:

**Baik - Konsisten**:
- Selalu "endpoint API"
- Selalu "bidang"
- Selalu "ekstrak"

**Buruk - Tidak konsisten**:
- Campur "endpoint API", "URL", "rute API", "jalur"
- Campur "bidang", "kotak", "elemen", "kontrol"
- Campur "ekstrak", "tarik", "dapatkan", "ambil"

Konsistensi membantu Claude memahami dan mengikuti instruksi.

## Pola umum

### Pola template

Berikan template untuk format output. Cocokkan tingkat ketatnya dengan kebutuhan Anda.

**Untuk persyaratan ketat** (seperti respons API atau format data):

````markdown
## Struktur laporan

SELALU gunakan struktur template yang tepat ini:

```markdown
# [Judul Analisis]

## Ringkasan eksekutif
[Ikhtisar satu paragraf tentang temuan kunci]

## Temuan kunci
- Temuan 1 dengan data pendukung
- Temuan 2 dengan data pendukung
- Temuan 3 dengan data pendukung

## Rekomendasi
1. Rekomendasi yang dapat ditindaklanjuti secara spesifik
2. Rekomendasi yang dapat ditindaklanjuti secara spesifik
```
````

**Untuk panduan fleksibel** (ketika adaptasi berguna):

````markdown
## Struktur laporan

Berikut adalah format default yang masuk akal, tetapi gunakan penilaian terbaik Anda berdasarkan analisis:

```markdown
# [Judul Analisis]

## Ringkasan eksekutif
[Ikhtisar]

## Temuan kunci
[Sesuaikan bagian berdasarkan apa yang Anda temukan]

## Rekomendasi
[Sesuaikan dengan konteks spesifik]
```

Sesuaikan bagian sesuai kebutuhan untuk jenis analisis spesifik.
````

### Pola contoh

Untuk Skill di mana kualitas output bergantung pada melihat contoh, berikan pasangan input/output seperti dalam prompting reguler:

````markdown
## Format pesan commit

Buat pesan commit mengikuti contoh ini:

**Contoh 1:**
Input: Menambahkan autentikasi pengguna dengan token JWT
Output:
```
feat(auth): implementasikan autentikasi berbasis JWT

Tambahkan endpoint login dan middleware validasi token
```

**Contoh 2:**
Input: Memperbaiki bug di mana tanggal ditampilkan salah dalam laporan
Output:
```
fix(reports): perbaiki pemformatan tanggal dalam konversi zona waktu

Gunakan stempel waktu UTC secara konsisten di seluruh pembuatan laporan
```

**Contoh 3:**
Input: Memperbarui dependensi dan refaktor penanganan kesalahan
Output:
```
chore: perbarui dependensi dan refaktor penanganan kesalahan

- Tingkatkan lodash ke 4.17.21
- Standardisasi format respons kesalahan di seluruh endpoint
```

Ikuti gaya ini: type(scope): deskripsi singkat, kemudian penjelasan terperinci.
````

Contoh membantu Claude memahami gaya yang diinginkan dan tingkat detail lebih jelas daripada deskripsi saja.

### Pola alur kerja bersyarat

Panduan Claude melalui titik keputusan:

```markdown
## Alur kerja modifikasi dokumen

1. Tentukan jenis modifikasi:

   **Membuat konten baru?** → Ikuti "Alur kerja pembuatan" di bawah
   **Mengedit konten yang ada?** → Ikuti "Alur kerja pengeditan" di bawah

2. Alur kerja pembuatan:
   - Gunakan perpustakaan docx-js
   - Bangun dokumen dari awal
   - Ekspor ke format .docx

3. Alur kerja pengeditan:
   - Buka paket dokumen yang ada
   - Ubah XML secara langsung
   - Validasi setelah setiap perubahan
   - Paket kembali saat selesai
```

<Tip>
Jika alur kerja menjadi besar atau rumit dengan banyak langkah, pertimbangkan untuk mendorongnya ke file terpisah dan beri tahu Claude untuk membaca file yang sesuai berdasarkan tugas.
</Tip>

## Evaluasi dan iterasi

### Bangun evaluasi terlebih dahulu

**Buat evaluasi SEBELUM menulis dokumentasi yang luas.** Ini memastikan Skill Anda menyelesaikan masalah nyata daripada mendokumentasikan masalah yang dibayangkan.

**Pengembangan yang didorong evaluasi:**
1. **Identifikasi kesenjangan**: Jalankan Claude pada tugas representatif tanpa Skill. Dokumentasikan kegagalan spesifik atau konteks yang hilang
2. **Buat evaluasi**: Bangun tiga skenario yang menguji kesenjangan ini
3. **Tetapkan baseline**: Ukur kinerja Claude tanpa Skill
4. **Tulis instruksi minimal**: Buat cukup konten untuk mengatasi kesenjangan dan lulus evaluasi
5. **Iterasi**: Jalankan evaluasi, bandingkan dengan baseline, dan perbaiki

Pendekatan ini memastikan Anda menyelesaikan masalah aktual daripada mengantisipasi persyaratan yang mungkin tidak pernah terwujud.

**Struktur evaluasi**:
```json
{
  "skills": ["pdf-processing"],
  "query": "Ekstrak semua teks dari file PDF ini dan simpan ke output.txt",
  "files": ["test-files/document.pdf"],
  "expected_behavior": [
    "Berhasil membaca file PDF menggunakan perpustakaan pemrosesan PDF yang sesuai atau alat baris perintah",
    "Mengekstrak konten teks dari semua halaman dalam dokumen tanpa melewatkan halaman apa pun",
    "Menyimpan teks yang diekstrak ke file bernama output.txt dalam format yang jelas dan dapat dibaca"
  ]
}
```

<Note>
Contoh ini menunjukkan evaluasi berbasis data dengan rubrik pengujian sederhana. Kami saat ini tidak menyediakan cara bawaan untuk menjalankan evaluasi ini. Pengguna dapat membuat sistem evaluasi mereka sendiri. Evaluasi adalah sumber kebenaran Anda untuk mengukur efektivitas Skill.
</Note>

### Kembangkan Skill secara iteratif dengan Claude

Proses pengembangan Skill yang paling efektif melibatkan Claude itu sendiri. Bekerja dengan satu instance Claude ("Claude A") untuk membuat Skill yang akan digunakan oleh instance lain ("Claude B"). Claude A membantu Anda merancang dan menyempurnakan instruksi, sementara Claude B mengujinya dalam tugas nyata. Ini bekerja karena model Claude memahami cara menulis instruksi agen yang efektif dan informasi apa yang dibutuhkan agen.

**Membuat Skill baru:**

1. **Selesaikan tugas tanpa Skill**: Bekerja melalui masalah dengan Claude A menggunakan prompting normal. Saat Anda bekerja, Anda secara alami akan memberikan konteks, menjelaskan preferensi, dan berbagi pengetahuan prosedural. Perhatikan informasi apa yang Anda berikan berulang kali.

2. **Identifikasi pola yang dapat digunakan kembali**: Setelah menyelesaikan tugas, identifikasi konteks apa yang Anda berikan yang akan berguna untuk tugas serupa di masa depan.

   **Contoh**: Jika Anda bekerja melalui analisis BigQuery, Anda mungkin telah memberikan nama tabel, definisi bidang, aturan penyaringan (seperti "selalu kecualikan akun uji"), dan pola kueri umum.

3. **Minta Claude A membuat Skill**: "Buat Skill yang menangkap pola analisis BigQuery yang baru saja kami gunakan. Sertakan skema tabel, konvensi penamaan, dan aturan tentang menyaring akun uji."

   <Tip>
   Model Claude memahami format dan struktur Skill secara asli. Anda tidak memerlukan prompt sistem khusus atau "skill penulisan" untuk membuat Claude membuat Skill. Cukup minta Claude membuat Skill dan itu akan menghasilkan konten SKILL.md yang terstruktur dengan baik dengan frontmatter dan konten badan yang sesuai.
   </Tip>

4. **Tinjau untuk keringkasan**: Periksa bahwa Claude A tidak menambahkan penjelasan yang tidak perlu. Tanya: "Hapus penjelasan tentang apa arti tingkat kemenangan - Claude sudah tahu itu."

5. **Tingkatkan arsitektur informasi**: Minta Claude A mengorganisir konten lebih efektif. Misalnya: "Atur ini sehingga skema tabel berada di file referensi terpisah. Kami mungkin menambahkan lebih banyak tabel nanti."

6. **Uji pada tugas serupa**: Gunakan Skill dengan Claude B (instance segar dengan Skill dimuat) pada kasus penggunaan terkait. Amati apakah Claude B menemukan informasi yang tepat, menerapkan aturan dengan benar, dan menangani tugas dengan sukses.

7. **Iterasi berdasarkan pengamatan**: Jika Claude B berjuang atau melewatkan sesuatu, kembali ke Claude A dengan spesifik: "Ketika Claude menggunakan Skill ini, itu lupa menyaring berdasarkan tanggal untuk Q4. Haruskah kami menambahkan bagian tentang pola penyaringan tanggal?"

**Iterasi pada Skill yang ada:**

Pola hierarki yang sama berlanjut saat meningkatkan Skill. Anda berganti-ganti antara:
- **Bekerja dengan Claude A** (ahli yang membantu menyempurnakan Skill)
- **Pengujian dengan Claude B** (agen menggunakan Skill untuk melakukan pekerjaan nyata)
- **Mengamati perilaku Claude B** dan membawa wawasan kembali ke Claude A

1. **Gunakan Skill dalam alur kerja nyata**: Berikan Claude B (dengan Skill dimuat) tugas aktual, bukan skenario uji

2. **Amati perilaku Claude B**: Catat di mana itu berjuang, berhasil, atau membuat pilihan yang tidak terduga

   **Contoh pengamatan**: "Ketika saya meminta Claude B untuk laporan penjualan regional, itu menulis kueri tetapi lupa menyaring akun uji, meskipun Skill menyebutkan aturan ini."

3. **Kembali ke Claude A untuk perbaikan**: Bagikan SKILL.md saat ini dan jelaskan apa yang Anda amati. Tanya: "Saya perhatikan Claude B lupa menyaring akun uji saat saya meminta laporan regional. Skill menyebutkan penyaringan, tetapi mungkin tidak cukup menonjol?"

4. **Tinjau saran Claude A**: Claude A mungkin menyarankan reorganisasi untuk membuat aturan lebih menonjol, menggunakan bahasa yang lebih kuat seperti "HARUS menyaring" daripada "selalu menyaring", atau merestruktur bagian alur kerja.

5. **Terapkan dan uji perubahan**: Perbarui Skill dengan penyempurnaan Claude A, kemudian uji lagi dengan Claude B pada permintaan serupa

6. **Ulangi berdasarkan penggunaan**: Lanjutkan siklus amati-perbaiki-uji saat Anda menghadapi skenario baru. Setiap iterasi meningkatkan Skill berdasarkan perilaku agen nyata, bukan asumsi.

**Mengumpulkan umpan balik tim:**

1. Bagikan Skill dengan rekan kerja dan amati penggunaan mereka
2. Tanya: Apakah Skill diaktifkan saat diharapkan? Apakah instruksi jelas? Apa yang hilang?
3. Gabungkan umpan balik untuk mengatasi titik buta dalam pola penggunaan Anda sendiri

**Mengapa pendekatan ini bekerja**: Claude A memahami kebutuhan agen, Anda memberikan keahlian domain, Claude B mengungkapkan kesenjangan melalui penggunaan nyata, dan penyempurnaan iteratif meningkatkan Skill berdasarkan perilaku yang diamati daripada asumsi.

### Amati bagaimana Claude menavigasi Skill

Saat Anda mengulangi Skill, perhatikan bagaimana Claude benar-benar menggunakannya dalam praktik. Perhatikan:

- **Jalur eksplorasi yang tidak terduga**: Apakah Claude membaca file dalam urutan yang tidak Anda antisipasi? Ini mungkin menunjukkan struktur Anda tidak seintuitif yang Anda pikir
- **Koneksi yang terlewat**: Apakah Claude gagal mengikuti referensi ke file penting? Tautan Anda mungkin perlu lebih eksplisit atau menonjol
- **Ketergantungan berlebihan pada bagian tertentu**: Jika Claude berulang kali membaca file yang sama, pertimbangkan apakah konten itu harus berada di SKILL.md utama
- **Konten yang diabaikan**: Jika Claude tidak pernah mengakses file bundel, itu mungkin tidak perlu atau sinyal buruk dalam instruksi utama

Iterasi berdasarkan pengamatan ini daripada asumsi. Bidang 'name' dan 'description' dalam metadata Skill Anda sangat penting. Claude menggunakan ini saat memutuskan apakah akan memicu Skill sebagai respons terhadap tugas saat ini. Pastikan mereka dengan jelas menjelaskan apa yang dilakukan Skill dan kapan harus digunakan.

## Anti-pola untuk dihindari

### Hindari jalur gaya Windows

Selalu gunakan garis miring ke depan dalam jalur file, bahkan di Windows:

- ✓ **Baik**: `scripts/helper.py`, `reference/guide.md`
- ✗ **Hindari**: `scripts\helper.py`, `reference\guide.md`

Jalur gaya Unix bekerja di semua platform, sementara jalur gaya Windows menyebabkan kesalahan pada sistem Unix.

### Hindari menawarkan terlalu banyak pilihan

Jangan presentasikan beberapa pendekatan kecuali diperlukan:

````markdown
**Contoh buruk: Terlalu banyak pilihan** (membingungkan):
"Anda dapat menggunakan pypdf, atau pdfplumber, atau PyMuPDF, atau pdf2image, atau..."

**Contoh baik: Berikan default** (dengan jalan keluar):
"Gunakan pdfplumber untuk ekstraksi teks:
```python
import pdfplumber
```

Untuk PDF yang dipindai memerlukan OCR, gunakan pdf2image dengan pytesseract sebagai gantinya."
````

## Lanjutan: Skill dengan kode yang dapat dieksekusi

Bagian di bawah ini fokus pada Skill yang mencakup skrip yang dapat dieksekusi. Jika Skill Anda hanya menggunakan instruksi markdown, lewati ke [Daftar periksa untuk Skill yang efektif](#checklist-for-effective-skills).

### Selesaikan, jangan hindari

Saat menulis skrip untuk Skill, tangani kondisi kesalahan daripada menghindarinya.

**Contoh baik: Tangani kesalahan secara eksplisit**:
```python
def process_file(path):
    """Proses file, buatnya jika tidak ada."""
    try:
        with open(path) as f:
            return f.read()
    except FileNotFoundError:
        # Buat file dengan konten default daripada gagal
        print(f"File {path} tidak ditemukan, membuat default")
        with open(path, 'w') as f:
            f.write('')
        return ''
    except PermissionError:
        # Berikan alternatif daripada gagal
        print(f"Tidak dapat mengakses {path}, menggunakan default")
        return ''
```

**Contoh buruk: Hindari ke Claude**:
```python
def process_file(path):
    # Hanya gagal dan biarkan Claude mencari tahu
    return open(path).read()
```

Parameter konfigurasi juga harus dibenarkan dan didokumentasikan untuk menghindari "konstanta sihir" (hukum Ousterhout). Jika Anda tidak tahu nilai yang tepat, bagaimana Claude menentukannya?

**Contoh baik: Terdokumentasi sendiri**:
```python
# Permintaan HTTP biasanya selesai dalam 30 detik
# Timeout lebih lama menjelaskan koneksi lambat
REQUEST_TIMEOUT = 30

# Tiga percobaan menyeimbangkan keandalan vs kecepatan
# Sebagian besar kegagalan intermiten diselesaikan pada percobaan kedua
MAX_RETRIES = 3
```

**Contoh buruk: Angka ajaib**:
```python
TIMEOUT = 47  # Mengapa 47?
RETRIES = 5   # Mengapa 5?
```

### Berikan skrip utilitas

Bahkan jika Claude bisa menulis skrip, skrip yang sudah dibuat menawarkan keuntungan:

**Manfaat skrip utilitas**:
- Lebih andal daripada kode yang dihasilkan
- Hemat token (tidak perlu menyertakan kode dalam konteks)
- Hemat waktu (tidak ada pembuatan kode yang diperlukan)
- Pastikan konsistensi di seluruh penggunaan

![Membundel skrip yang dapat dieksekusi bersama file instruksi](/docs/images/agent-skills-executable-scripts.png)

Diagram di atas menunjukkan bagaimana skrip yang dapat dieksekusi bekerja bersama file instruksi. File instruksi (forms.md) mereferensikan skrip, dan Claude dapat menjalankannya tanpa memuat isinya ke dalam konteks.

**Perbedaan penting**: Buat jelas dalam instruksi Anda apakah Claude harus:
- **Jalankan skrip** (paling umum): "Jalankan `analyze_form.py` untuk mengekstrak bidang"
- **Baca sebagai referensi** (untuk logika kompleks): "Lihat `analyze_form.py` untuk algoritma ekstraksi bidang"

Untuk sebagian besar skrip utilitas, eksekusi lebih disukai karena lebih andal dan efisien. Lihat bagian [Lingkungan runtime](#runtime-environment) di bawah untuk detail tentang cara kerja eksekusi skrip.

**Contoh**:
````markdown
## Skrip utilitas

**analyze_form.py**: Ekstrak semua bidang formulir dari PDF

```bash
python scripts/analyze_form.py input.pdf > fields.json
```

Format output:
```json
{
  "field_name": {"type": "text", "x": 100, "y": 200},
  "signature": {"type": "sig", "x": 150, "y": 500}
}
```

**validate_boxes.py**: Periksa kotak pembatas yang tumpang tindih

```bash
python scripts/validate_boxes.py fields.json
# Mengembalikan: "OK" atau daftar konflik
```

**fill_form.py**: Terapkan nilai bidang ke PDF

```bash
python scripts/fill_form.py input.pdf fields.json output.pdf
```
````

### Gunakan analisis visual

Ketika input dapat dirender sebagai gambar, buat Claude menganalisisnya:

````markdown
## Analisis tata letak formulir

1. Konversi PDF ke gambar:
   ```bash
   python scripts/pdf_to_images.py form.pdf
   ```

2. Analisis setiap gambar halaman untuk mengidentifikasi bidang formulir
3. Claude dapat melihat lokasi dan jenis bidang secara visual
````

<Note>
Dalam contoh ini, Anda perlu menulis skrip `pdf_to_images.py`.
</Note>

Kemampuan visi Claude membantu memahami tata letak dan struktur.

### Buat output antara yang dapat diverifikasi

Ketika Claude melakukan tugas yang kompleks dan terbuka, itu bisa membuat kesalahan. Pola "rencana-validasi-eksekusi" menangkap kesalahan lebih awal dengan membuat Claude terlebih dahulu membuat rencana dalam format terstruktur, kemudian memvalidasi rencana itu dengan skrip sebelum menjalankannya.

**Contoh**: Bayangkan meminta Claude untuk memperbarui 50 bidang formulir dalam PDF berdasarkan spreadsheet. Tanpa validasi, Claude mungkin mereferensikan bidang yang tidak ada, membuat nilai yang bertentangan, melewatkan bidang yang diperlukan, atau menerapkan pembaruan secara tidak benar.

**Solusi**: Gunakan pola alur kerja yang ditunjukkan di atas (pengisian formulir PDF), tetapi tambahkan file `changes.json` antara yang divalidasi sebelum menerapkan perubahan. Alur kerja menjadi: analisis → **buat file rencana** → **validasi rencana** → jalankan → verifikasi.

**Mengapa pola ini bekerja:**
- **Menangkap kesalahan lebih awal**: Validasi menemukan masalah sebelum perubahan diterapkan
- **Dapat diverifikasi mesin**: Skrip memberikan verifikasi objektif
- **Perencanaan yang dapat dibalik**: Claude dapat mengulangi rencana tanpa menyentuh asli
- **Debugging yang jelas**: Pesan kesalahan menunjuk ke masalah spesifik

**Kapan menggunakan**: Operasi batch, perubahan destruktif, aturan validasi kompleks, operasi berisiko tinggi.

**Tip implementasi**: Buat skrip validasi verbose dengan pesan kesalahan spesifik seperti "Bidang 'signature_date' tidak ditemukan. Bidang yang tersedia: customer_name, order_total, signature_date_signed" untuk membantu Claude memperbaiki masalah.

### Paket dependensi

Skill berjalan di lingkungan eksekusi kode dengan batasan khusus platform:

- **claude.ai**: Dapat menginstal paket dari npm dan PyPI serta menarik dari repositori GitHub
- **Anthropic API**: Tidak memiliki akses jaringan dan tidak ada instalasi paket runtime

Daftar paket yang diperlukan dalam SKILL.md Anda dan verifikasi tersedia di [dokumentasi alat eksekusi kode](/docs/id/agents-and-tools/tool-use/code-execution-tool).

### Lingkungan runtime

Skill berjalan di lingkungan eksekusi kode dengan akses filesystem, perintah bash, dan kemampuan eksekusi kode. Untuk penjelasan konseptual arsitektur ini, lihat [Arsitektur Skill](/docs/id/agents-and-tools/agent-skills/overview#the-skills-architecture) dalam ringkasan.

**Bagaimana ini mempengaruhi penulisan Anda:**

**Bagaimana Claude mengakses Skill:**

1. **Metadata dimuat sebelumnya**: Saat startup, nama dan deskripsi dari frontmatter YAML semua Skill dimuat ke dalam prompt sistem
2. **File dibaca sesuai permintaan**: Claude menggunakan alat Read bash untuk mengakses SKILL.md dan file lain dari filesystem saat diperlukan
3. **Skrip dieksekusi secara efisien**: Skrip utilitas dapat dieksekusi melalui bash tanpa memuat konten lengkapnya ke dalam konteks. Hanya output skrip yang menggunakan token
4. **Tidak ada penalti konteks untuk file besar**: File referensi, data, atau dokumentasi tidak menggunakan token konteks sampai benar-benar dibaca

- **Jalur file penting**: Claude menavigasi direktori skill Anda seperti filesystem. Gunakan garis miring ke depan (`reference/guide.md`), bukan garis miring terbalik
- **Beri nama file secara deskriptif**: Gunakan nama yang menunjukkan konten: `form_validation_rules.md`, bukan `doc2.md`
- **Atur untuk penemuan**: Struktur direktori menurut domain atau fitur
  - Baik: `reference/finance.md`, `reference/sales.md`
  - Buruk: `docs/file1.md`, `docs/file2.md`
- **Bundel sumber daya komprehensif**: Sertakan dokumen API lengkap, contoh luas, dataset besar; tidak ada penalti konteks sampai diakses
- **Lebih suka skrip untuk operasi deterministik**: Tulis `validate_form.py` daripada meminta Claude menghasilkan kode validasi
- **Buat niat eksekusi jelas**:
  - "Jalankan `analyze_form.py` untuk mengekstrak bidang" (jalankan)
  - "Lihat `analyze_form.py` untuk algoritma ekstraksi" (baca sebagai referensi)
- **Uji pola akses file**: Verifikasi Claude dapat menavigasi struktur direktori Anda dengan menguji dengan permintaan nyata

**Contoh:**

```
bigquery-skill/
├── SKILL.md (ikhtisar, menunjuk ke file referensi)
└── reference/
    ├── finance.md (metrik pendapatan)
    ├── sales.md (data pipeline)
    └── product.md (analitik penggunaan)
```

Ketika pengguna menanyakan tentang pendapatan, Claude membaca SKILL.md, melihat referensi ke `reference/finance.md`, dan memanggil bash untuk membaca hanya file itu. File sales.md dan product.md tetap di filesystem, menggunakan nol token konteks sampai diperlukan. Model berbasis filesystem ini adalah apa yang memungkinkan pengungkapan progresif. Claude dapat menavigasi dan secara selektif memuat tepat apa yang diperlukan setiap tugas.

Untuk detail lengkap tentang arsitektur teknis, lihat [Cara kerja Skill](/docs/id/agents-and-tools/agent-skills/overview#how-skills-work) dalam ringkasan Skill.

### Referensi alat MCP

Jika Skill Anda menggunakan alat MCP (Model Context Protocol), selalu gunakan nama alat yang sepenuhnya memenuhi syarat untuk menghindari kesalahan "alat tidak ditemukan".

**Format**: `ServerName:tool_name`

**Contoh**:
```markdown
Gunakan alat BigQuery:bigquery_schema untuk mengambil skema tabel.
Gunakan alat GitHub:create_issue untuk membuat masalah.
```

Di mana:
- `BigQuery` dan `GitHub` adalah nama server MCP
- `bigquery_schema` dan `create_issue` adalah nama alat dalam server tersebut

Tanpa awalan server, Claude mungkin gagal menemukan alat, terutama ketika beberapa server MCP tersedia.

### Hindari menganggap alat diinstal

Jangan asumsikan paket tersedia:

````markdown
**Contoh buruk: Menganggap instalasi**:
"Gunakan perpustakaan pdf untuk memproses file."

**Contoh baik: Eksplisit tentang dependensi**:
"Instal paket yang diperlukan: `pip install pypdf`

Kemudian gunakan:
```python
from pypdf import PdfReader
reader = PdfReader("file.pdf")
```"
````

## Catatan teknis

### Persyaratan frontmatter YAML

Frontmatter SKILL.md memerlukan bidang `name` dan `description` dengan aturan validasi spesifik:
- `name`: Maksimal 64 karakter, hanya huruf kecil/angka/tanda hubung, tidak ada tag XML, tidak ada kata-kata yang dicadangkan
- `description`: Maksimal 1024 karakter, tidak kosong, tidak ada tag XML

Lihat [ringkasan Skill](/docs/id/agents-and-tools/agent-skills/overview#skill-structure) untuk detail struktur lengkap.

### Anggaran token

Jaga badan SKILL.md di bawah 500 baris untuk kinerja optimal. Jika konten Anda melebihi ini, pisahkan ke file terpisah menggunakan pola pengungkapan progresif yang dijelaskan sebelumnya. Untuk detail arsitektur, lihat [ringkasan Skill](/docs/id/agents-and-tools/agent-skills/overview#how-skills-work).

## Daftar periksa untuk Skill yang efektif

Sebelum berbagi Skill, verifikasi:

### Kualitas inti
- [ ] Deskripsi spesifik dan mencakup istilah kunci
- [ ] Deskripsi mencakup apa yang dilakukan Skill dan kapan menggunakannya
- [ ] Badan SKILL.md di bawah 500 baris
- [ ] Detail tambahan dalam file terpisah (jika diperlukan)
- [ ] Tidak ada informasi sensitif waktu (atau di bagian "pola lama")
- [ ] Terminologi konsisten di seluruh
- [ ] Contoh konkret, bukan abstrak
- [ ] Referensi file satu level dalam
- [ ] Pengungkapan progresif digunakan dengan tepat
- [ ] Alur kerja memiliki langkah-langkah yang jelas

### Kode dan skrip
- [ ] Skrip menyelesaikan masalah daripada menghindarinya
- [ ] Penanganan kesalahan eksplisit dan membantu
- [ ] Tidak ada "konstanta sihir" (semua nilai dibenarkan)
- [ ] Paket yang diperlukan tercantum dalam instruksi dan diverifikasi tersedia
- [ ] Skrip memiliki dokumentasi yang jelas
- [ ] Tidak ada jalur gaya Windows (semua garis miring ke depan)
- [ ] Langkah validasi/verifikasi untuk operasi kritis
- [ ] Loop umpan balik disertakan untuk tugas yang penting kualitasnya

### Pengujian
- [ ] Setidaknya tiga evaluasi dibuat
- [ ] Diuji dengan Haiku, Sonnet, dan Opus
- [ ] Diuji dengan skenario penggunaan nyata
- [ ] Umpan balik tim digabungkan (jika berlaku)

## Langkah berikutnya

<CardGroup cols={2}>
  <Card
    title="Mulai dengan Agent Skills"
    icon="rocket"
    href="/docs/id/agents-and-tools/agent-skills/quickstart"
  >
    Buat Skill pertama Anda
  </Card>
  <Card
    title="Gunakan Skills dalam Claude Code"
    icon="terminal"
    href="https://code.claude.com/docs/skills"
  >
    Buat dan kelola Skills dalam Claude Code
  </Card>
  <Card
    title="Gunakan Skills dalam Agent SDK"
    icon="cube"
    href="/docs/id/agent-sdk/skills"
  >
    Gunakan Skills secara terprogram dalam TypeScript dan Python
  </Card>
  <Card
    title="Gunakan Skills dengan API"
    icon="code"
    href="/docs/id/build-with-claude/skills-guide"
  >
    Unggah dan gunakan Skills secara terprogram
  </Card>
</CardGroup>