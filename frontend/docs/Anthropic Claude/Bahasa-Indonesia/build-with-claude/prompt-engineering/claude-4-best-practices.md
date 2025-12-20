# Praktik terbaik prompting

Teknik prompt engineering spesifik untuk model Claude 4.x dengan panduan untuk Sonnet 4.5, Haiku 4.5, dan Opus 4.5.

---

Panduan ini menyediakan teknik prompt engineering spesifik untuk model Claude 4.x, dengan panduan khusus untuk Sonnet 4.5, Haiku 4.5, dan Opus 4.5. Model-model ini telah dilatih untuk mengikuti instruksi dengan lebih presisi dibandingkan generasi Claude sebelumnya.
<Tip>
  Untuk ikhtisar kemampuan baru Claude 4.5, lihat [Apa yang baru di Claude 4.5](/docs/id/about-claude/models/whats-new-claude-4-5). Untuk panduan migrasi dari model sebelumnya, lihat [Migrasi ke Claude 4.5](/docs/id/about-claude/models/migrating-to-claude-4).
</Tip>

## Prinsip umum

### Jadilah eksplisit dengan instruksi Anda

Model Claude 4.x merespons dengan baik terhadap instruksi yang jelas dan eksplisit. Menjadi spesifik tentang output yang diinginkan dapat membantu meningkatkan hasil. Pelanggan yang menginginkan perilaku "di atas dan seterusnya" dari model Claude sebelumnya mungkin perlu meminta perilaku ini dengan lebih eksplisit dengan model yang lebih baru.

<section title="Contoh: Membuat dasbor analitik">

**Kurang efektif:**
```text
Buat dasbor analitik
```

**Lebih efektif:**
```text
Buat dasbor analitik. Sertakan sebanyak mungkin fitur dan interaksi yang relevan. Melampaui dasar-dasar untuk membuat implementasi yang lengkap.
```

</section>

### Tambahkan konteks untuk meningkatkan kinerja

Memberikan konteks atau motivasi di balik instruksi Anda, seperti menjelaskan kepada Claude mengapa perilaku tersebut penting, dapat membantu model Claude 4.x lebih memahami tujuan Anda dan memberikan respons yang lebih tertarget.

<section title="Contoh: Preferensi pemformatan">

**Kurang efektif:**
```text
JANGAN PERNAH gunakan elipsis
```

**Lebih efektif:**
```text
Respons Anda akan dibaca oleh mesin text-to-speech, jadi jangan pernah gunakan elipsis karena mesin text-to-speech tidak akan tahu cara mengucapkannya.
```

</section>

Claude cukup pintar untuk menggeneralisasi dari penjelasan tersebut.

### Berhati-hatilah dengan contoh & detail

Model Claude 4.x memperhatikan detail dan contoh dengan cermat sebagai bagian dari kemampuan mengikuti instruksi yang presisi. Pastikan bahwa contoh Anda selaras dengan perilaku yang ingin Anda dorong dan meminimalkan perilaku yang ingin Anda hindari.

### Penalaran horizon panjang dan pelacakan status

Model Claude 4.5 unggul dalam tugas penalaran horizon panjang dengan kemampuan pelacakan status yang luar biasa. Model ini mempertahankan orientasi di seluruh sesi yang diperpanjang dengan fokus pada kemajuan inkremental—membuat kemajuan yang stabil pada beberapa hal sekaligus daripada mencoba melakukan semuanya sekaligus. Kemampuan ini terutama muncul di seluruh beberapa jendela konteks atau iterasi tugas, di mana Claude dapat bekerja pada tugas yang kompleks, menyimpan status, dan melanjutkan dengan jendela konteks yang segar.

#### Kesadaran konteks dan alur kerja multi-jendela

Model Claude 4.5 menampilkan [kesadaran konteks](/docs/id/build-with-claude/context-windows#context-awareness-in-claude-sonnet-4-5), memungkinkan model untuk melacak jendela konteks yang tersisa (yaitu "anggaran token") di seluruh percakapan. Ini memungkinkan Claude untuk menjalankan tugas dan mengelola konteks dengan lebih efektif dengan memahami berapa banyak ruang yang dimilikinya untuk bekerja.

**Mengelola batas konteks:**

Jika Anda menggunakan Claude dalam harness agen yang memadatkan konteks atau memungkinkan menyimpan konteks ke file eksternal (seperti di Claude Code), kami sarankan menambahkan informasi ini ke prompt Anda sehingga Claude dapat berperilaku sesuai. Jika tidak, Claude mungkin kadang-kadang secara alami mencoba membungkus pekerjaan saat mendekati batas konteks. Di bawah ini adalah contoh prompt:

```text Contoh prompt
Jendela konteks Anda akan secara otomatis dipadatkan saat mendekati batasnya, memungkinkan Anda untuk terus bekerja tanpa batas dari tempat Anda berhenti. Oleh karena itu, jangan hentikan tugas lebih awal karena kekhawatiran anggaran token. Saat Anda mendekati batas anggaran token, simpan kemajuan dan status saat ini ke memori sebelum jendela konteks menyegarkan. Selalu seproaktif dan otonom mungkin dan selesaikan tugas sepenuhnya, bahkan jika akhir anggaran Anda akan segera tiba. Jangan pernah secara artifisial menghentikan tugas apa pun lebih awal terlepas dari konteks yang tersisa.
```

[Alat memori](/docs/id/agents-and-tools/tool-use/memory-tool) berpasangan secara alami dengan kesadaran konteks untuk transisi konteks yang mulus.

#### Alur kerja multi-jendela konteks

Untuk tugas yang mencakup beberapa jendela konteks:

1. **Gunakan prompt yang berbeda untuk jendela konteks pertama**: Gunakan jendela konteks pertama untuk menyiapkan kerangka kerja (tulis tes, buat skrip setup), kemudian gunakan jendela konteks di masa depan untuk mengulangi daftar tugas.

2. **Buat model menulis tes dalam format terstruktur**: Minta Claude untuk membuat tes sebelum memulai pekerjaan dan lacak dalam format terstruktur (misalnya, `tests.json`). Ini menghasilkan kemampuan jangka panjang yang lebih baik untuk mengulangi. Ingatkan Claude tentang pentingnya tes: "Tidak dapat diterima untuk menghapus atau mengedit tes karena ini dapat menyebabkan fungsionalitas yang hilang atau bermasalah."

3. **Siapkan alat kualitas hidup**: Dorong Claude untuk membuat skrip setup (misalnya, `init.sh`) untuk memulai server dengan baik, menjalankan suite tes, dan linter. Ini mencegah pekerjaan berulang saat melanjutkan dari jendela konteks yang segar.

4. **Memulai dari awal vs pemadatan**: Ketika jendela konteks dihapus, pertimbangkan untuk memulai dengan jendela konteks yang benar-benar baru daripada menggunakan pemadatan. Model Claude 4.5 sangat efektif dalam menemukan status dari sistem file lokal. Dalam beberapa kasus, Anda mungkin ingin memanfaatkan ini daripada pemadatan. Jadilah preskriptif tentang cara memulainya:
   - "Panggil pwd; Anda hanya dapat membaca dan menulis file di direktori ini."
   - "Tinjau progress.txt, tests.json, dan git logs."
   - "Jalankan secara manual melalui tes integrasi fundamental sebelum melanjutkan untuk mengimplementasikan fitur baru."

5. **Sediakan alat verifikasi**: Seiring dengan bertambahnya panjang tugas otonom, Claude perlu memverifikasi kebenaran tanpa umpan balik manusia yang berkelanjutan. Alat seperti server Playwright MCP atau kemampuan penggunaan komputer untuk menguji UI sangat membantu.

6. **Dorong penggunaan konteks yang lengkap**: Minta Claude untuk menyelesaikan komponen secara efisien sebelum melanjutkan:

```text Contoh prompt
Ini adalah tugas yang sangat panjang, jadi mungkin bermanfaat untuk merencanakan pekerjaan Anda dengan jelas. Disarankan untuk menghabiskan seluruh konteks output Anda untuk mengerjakan tugas - pastikan saja Anda tidak kehabisan konteks dengan pekerjaan yang belum dikomit yang signifikan. Terus bekerja secara sistematis sampai Anda menyelesaikan tugas ini.
```

#### Praktik terbaik manajemen status

- **Gunakan format terstruktur untuk data status**: Saat melacak informasi terstruktur (seperti hasil tes atau status tugas), gunakan JSON atau format terstruktur lainnya untuk membantu Claude memahami persyaratan skema
- **Gunakan teks tidak terstruktur untuk catatan kemajuan**: Catatan kemajuan bentuk bebas bekerja dengan baik untuk melacak kemajuan umum dan konteks
- **Gunakan git untuk pelacakan status**: Git menyediakan log tentang apa yang telah dilakukan dan checkpoint yang dapat dipulihkan. Model Claude 4.5 berkinerja sangat baik dalam menggunakan git untuk melacak status di seluruh beberapa sesi.
- **Tekankan kemajuan inkremental**: Secara eksplisit minta Claude untuk melacak kemajuannya dan fokus pada pekerjaan inkremental

<section title="Contoh: Pelacakan status">

```json
// File status terstruktur (tests.json)
{
  "tests": [
    {"id": 1, "name": "authentication_flow", "status": "passing"},
    {"id": 2, "name": "user_management", "status": "failing"},
    {"id": 3, "name": "api_endpoints", "status": "not_started"}
  ],
  "total": 200,
  "passing": 150,
  "failing": 25,
  "not_started": 25
}
```

```text
// Catatan kemajuan (progress.txt)
Kemajuan Sesi 3:
- Memperbaiki validasi token autentikasi
- Memperbarui model pengguna untuk menangani kasus tepi
- Berikutnya: selidiki kegagalan tes user_management (tes #2)
- Catatan: Jangan hapus tes karena ini dapat menyebabkan fungsionalitas yang hilang
```

</section>

### Gaya komunikasi

Model Claude 4.5 memiliki gaya komunikasi yang lebih ringkas dan alami dibandingkan dengan model sebelumnya:

- **Lebih langsung dan berdasarkan fakta**: Memberikan laporan kemajuan berbasis fakta daripada pembaruan yang merayakan diri sendiri
- **Lebih percakapan**: Sedikit lebih lancar dan percakapan, kurang seperti mesin
- **Kurang bertele-tele**: Mungkin melewatkan ringkasan terperinci untuk efisiensi kecuali diminta sebaliknya

Gaya komunikasi ini secara akurat mencerminkan apa yang telah dicapai tanpa elaborasi yang tidak perlu.

## Panduan untuk situasi spesifik

### Seimbangkan verbositas

Model Claude 4.5 cenderung ke arah efisiensi dan mungkin melewatkan ringkasan verbal setelah panggilan alat, melompat langsung ke tindakan berikutnya. Meskipun ini menciptakan alur kerja yang efisien, Anda mungkin lebih suka visibilitas yang lebih besar ke dalam proses penalarannya.

Jika Anda ingin Claude memberikan pembaruan saat bekerja:

```text Contoh prompt
Setelah menyelesaikan tugas yang melibatkan penggunaan alat, berikan ringkasan cepat tentang pekerjaan yang telah Anda lakukan.
```

### Pola penggunaan alat

Model Claude 4.5 dilatih untuk mengikuti instruksi yang presisi dan mendapat manfaat dari arahan eksplisit untuk menggunakan alat tertentu. Jika Anda mengatakan "bisakah Anda menyarankan beberapa perubahan," kadang-kadang akan memberikan saran daripada mengimplementasikannya—bahkan jika membuat perubahan mungkin apa yang Anda maksudkan.

Agar Claude mengambil tindakan, jadilah lebih eksplisit:

<section title="Contoh: Instruksi eksplisit">

**Kurang efektif (Claude hanya akan menyarankan):**
```text
Bisakah Anda menyarankan beberapa perubahan untuk meningkatkan fungsi ini?
```

**Lebih efektif (Claude akan membuat perubahan):**
```text
Ubah fungsi ini untuk meningkatkan kinerjanya.
```

Atau:
```text
Buat pengeditan ini pada alur autentikasi.
```

</section>

Untuk membuat Claude lebih proaktif dalam mengambil tindakan secara default, Anda dapat menambahkan ini ke prompt sistem Anda:

```text Contoh prompt untuk tindakan proaktif
<default_to_action>
Secara default, implementasikan perubahan daripada hanya menyarankannya. Jika niat pengguna tidak jelas, simpulkan tindakan yang paling berguna dan lanjutkan, gunakan alat untuk menemukan detail yang hilang daripada menebak. Cobalah untuk menyimpulkan niat pengguna tentang apakah panggilan alat (misalnya pengeditan atau pembacaan file) dimaksudkan atau tidak, dan bertindak sesuai dengan itu.
</default_to_action>
```

Di sisi lain, jika Anda ingin model lebih ragu-ragu secara default, kurang cenderung melompat langsung ke implementasi, dan hanya mengambil tindakan jika diminta, Anda dapat mengarahkan perilaku ini dengan prompt seperti di bawah ini:

```text Contoh prompt untuk tindakan konservatif
<do_not_act_before_instructions>
Jangan melompat ke implementasi atau ubah file kecuali jelas diperintahkan untuk membuat perubahan. Ketika niat pengguna ambigu, default untuk memberikan informasi, melakukan penelitian, dan memberikan rekomendasi daripada mengambil tindakan. Hanya lanjutkan dengan pengeditan, modifikasi, atau implementasi ketika pengguna secara eksplisit memintanya.
</do_not_act_before_instructions>
```

### Penggunaan alat dan pemicu

Claude Opus 4.5 lebih responsif terhadap prompt sistem daripada model sebelumnya. Jika prompt Anda dirancang untuk mengurangi undertriggering pada alat atau keterampilan, Claude Opus 4.5 mungkin sekarang overtrigger. Solusinya adalah mengurangi bahasa yang agresif. Di mana Anda mungkin telah mengatakan "KRITIS: Anda HARUS menggunakan alat ini ketika...", Anda dapat menggunakan prompting yang lebih normal seperti "Gunakan alat ini ketika...".

### Kontrol format respons

Ada beberapa cara yang telah kami temukan sangat efektif dalam mengarahkan pemformatan output dalam model Claude 4.x:

1. **Katakan kepada Claude apa yang harus dilakukan daripada apa yang tidak boleh dilakukan**

   - Alih-alih: "Jangan gunakan markdown dalam respons Anda"
   - Coba: "Respons Anda harus terdiri dari paragraf prosa yang mengalir dengan mulus."

2. **Gunakan indikator format XML**

   - Coba: "Tulis bagian prosa respons Anda dalam tag \<smoothly_flowing_prose_paragraphs\>."

3. **Cocokkan gaya prompt Anda dengan output yang diinginkan**

   Gaya pemformatan yang digunakan dalam prompt Anda mungkin mempengaruhi gaya respons Claude. Jika Anda masih mengalami masalah steerability dengan pemformatan output, kami merekomendasikan sebaik mungkin mencocokkan gaya prompt Anda dengan gaya output yang diinginkan. Misalnya, menghapus markdown dari prompt Anda dapat mengurangi volume markdown dalam output.

4. **Gunakan prompt terperinci untuk preferensi pemformatan spesifik**

   Untuk kontrol lebih besar atas penggunaan markdown dan pemformatan, berikan panduan eksplisit:

```text Contoh prompt untuk meminimalkan markdown
<avoid_excessive_markdown_and_bullet_points>
Saat menulis laporan, dokumen, penjelasan teknis, analisis, atau konten bentuk panjang apa pun, tulis dalam prosa yang jelas dan mengalir menggunakan paragraf dan kalimat lengkap. Gunakan jeda paragraf standar untuk organisasi dan cadangkan markdown terutama untuk `inline code`, blok kode (```...```), dan heading sederhana (###, dan ###). Hindari menggunakan **bold** dan *italics*.

JANGAN gunakan daftar terurut (1. ...) atau daftar tidak terurut (*) kecuali : a) Anda menyajikan item yang benar-benar diskrit di mana format daftar adalah pilihan terbaik, atau b) pengguna secara eksplisit meminta daftar atau peringkat

Alih-alih membuat daftar item dengan bullet atau angka, gabungkan secara alami ke dalam kalimat. Panduan ini berlaku khususnya untuk penulisan teknis. Menggunakan prosa daripada pemformatan berlebihan akan meningkatkan kepuasan pengguna. JANGAN PERNAH menampilkan serangkaian poin bullet yang terlalu pendek.

Tujuan Anda adalah teks yang dapat dibaca dan mengalir yang memandu pembaca secara alami melalui ide-ide daripada memfragmentasi informasi menjadi poin-poin terisolasi.
</avoid_excessive_markdown_and_bullet_points>
```

### Penelitian dan pengumpulan informasi

Model Claude 4.5 menunjukkan kemampuan pencarian agen yang luar biasa dan dapat menemukan dan mensintesis informasi dari berbagai sumber secara efektif. Untuk hasil penelitian yang optimal:

1. **Berikan kriteria kesuksesan yang jelas**: Tentukan apa yang merupakan jawaban yang berhasil untuk pertanyaan penelitian Anda

2. **Dorong verifikasi sumber**: Minta Claude untuk memverifikasi informasi di berbagai sumber

3. **Untuk tugas penelitian yang kompleks, gunakan pendekatan terstruktur**:

```text Contoh prompt untuk penelitian kompleks
Cari informasi ini dengan cara yang terstruktur. Saat Anda mengumpulkan data, kembangkan beberapa hipotesis yang bersaing. Lacak tingkat kepercayaan Anda dalam catatan kemajuan untuk meningkatkan kalibrasi. Secara teratur mengkritik diri sendiri pendekatan dan rencana Anda. Perbarui file pohon hipotesis atau catatan penelitian untuk mempertahankan informasi dan memberikan transparansi. Pecahkan tugas penelitian kompleks ini secara sistematis.
```

Pendekatan terstruktur ini memungkinkan Claude untuk menemukan dan mensintesis hampir semua informasi dan secara iteratif mengkritik temuannya, terlepas dari ukuran corpus.

### Orkestrasi subagen

Model Claude 4.5 menunjukkan kemampuan orkestrasi subagen asli yang sangat ditingkatkan. Model-model ini dapat mengenali kapan tugas akan mendapat manfaat dari pendelegasian pekerjaan ke subagen khusus dan melakukannya secara proaktif tanpa memerlukan instruksi eksplisit.

Untuk memanfaatkan perilaku ini:

1. **Pastikan alat subagen yang terdefinisi dengan baik**: Memiliki alat subagen yang tersedia dan dijelaskan dalam definisi alat
2. **Biarkan Claude mengorkestrasi secara alami**: Claude akan mendelegasikan secara tepat tanpa instruksi eksplisit
3. **Sesuaikan konservatisme jika diperlukan**:

```text Contoh prompt untuk penggunaan subagen konservatif
Hanya delegasikan ke subagen ketika tugas jelas mendapat manfaat dari agen terpisah dengan jendela konteks baru.
```

### Pengetahuan diri model

Jika Anda ingin Claude mengidentifikasi dirinya dengan benar dalam aplikasi Anda atau menggunakan string API tertentu:

```text Contoh prompt untuk identitas model
Asisten adalah Claude, dibuat oleh Anthropic. Model saat ini adalah Claude Sonnet 4.5.
```

Untuk aplikasi bertenaga LLM yang perlu menentukan string model:

```text Contoh prompt untuk string model
Ketika LLM diperlukan, silakan default ke Claude Sonnet 4.5 kecuali pengguna meminta sebaliknya. String model yang tepat untuk Claude Sonnet 4.5 adalah claude-sonnet-4-5-20250929.
```

### Sensitivitas pemikiran

Ketika pemikiran yang diperpanjang dinonaktifkan, Claude Opus 4.5 sangat sensitif terhadap kata "think" dan variannya. Kami merekomendasikan mengganti "think" dengan kata-kata alternatif yang menyampaikan makna serupa, seperti "consider," "believe," dan "evaluate."

### Manfaatkan kemampuan pemikiran & pemikiran yang disisipi

Model Claude 4.x menawarkan kemampuan pemikiran yang dapat sangat membantu untuk tugas yang melibatkan refleksi setelah penggunaan alat atau penalaran multi-langkah yang kompleks. Anda dapat memandu pemikiran awal atau tersisipi untuk hasil yang lebih baik.

```text Contoh prompt
Setelah menerima hasil alat, hati-hati renungkan kualitasnya dan tentukan langkah optimal berikutnya sebelum melanjutkan. Gunakan pemikiran Anda untuk merencanakan dan mengulangi berdasarkan informasi baru ini, dan kemudian ambil tindakan terbaik berikutnya.
```

<Info>
  Untuk informasi lebih lanjut tentang kemampuan pemikiran, lihat [Pemikiran yang diperpanjang](/docs/id/build-with-claude/extended-thinking).
</Info>

### Pembuatan dokumen

Model Claude 4.5 unggul dalam membuat presentasi, animasi, dan dokumen visual. Model-model ini cocok atau melampaui Claude Opus 4.1 dalam domain ini, dengan sentuhan kreatif yang mengesankan dan mengikuti instruksi yang lebih kuat. Model-model ini menghasilkan output yang dipoles dan dapat digunakan pada percobaan pertama dalam sebagian besar kasus.

Untuk hasil terbaik dengan pembuatan dokumen:

```text Contoh prompt
Buat presentasi profesional tentang [topic]. Sertakan elemen desain yang bijaksana, hierarki visual, dan animasi yang menarik jika sesuai.
```

### Kemampuan visi yang ditingkatkan

Claude Opus 4.5 memiliki kemampuan visi yang ditingkatkan dibandingkan dengan model Claude sebelumnya. Berkinerja lebih baik pada tugas pemrosesan gambar dan ekstraksi data, terutama ketika ada beberapa gambar yang ada dalam konteks. Peningkatan ini terbawa ke penggunaan komputer, di mana model dapat lebih andal menafsirkan tangkapan layar dan elemen UI. Anda juga dapat menggunakan Claude Opus 4.5 untuk menganalisis video dengan memecahnya menjadi frame.

Satu teknik yang telah kami temukan efektif untuk lebih meningkatkan kinerja adalah memberikan Claude Opus 4.5 alat crop atau [skill](/docs/id/agents-and-tools/agent-skills/overview). Kami telah melihat peningkatan yang konsisten pada evaluasi gambar ketika Claude dapat "zoom" ke wilayah yang relevan dari gambar. Kami telah menyiapkan cookbook untuk alat crop [di sini](https://github.com/anthropics/claude-cookbooks/blob/main/multimodal/crop_tool.ipynb).

### Optimalkan pemanggilan alat paralel

Model Claude 4.x unggul dalam eksekusi alat paralel, dengan Sonnet 4.5 menjadi sangat agresif dalam menjalankan beberapa operasi secara bersamaan. Model Claude 4.x akan:

- Menjalankan beberapa pencarian spekulatif selama penelitian
- Membaca beberapa file sekaligus untuk membangun konteks lebih cepat
- Menjalankan perintah bash secara paralel (yang bahkan dapat membuat bottleneck kinerja sistem)

Perilaku ini mudah diarahkan. Meskipun model memiliki tingkat keberhasilan yang tinggi dalam pemanggilan alat paralel tanpa prompting, Anda dapat meningkatkan ini hingga ~100% atau menyesuaikan tingkat agresivitas:

```text Contoh prompt untuk efisiensi paralel maksimal
<use_parallel_tool_calls>
Jika Anda bermaksud memanggil beberapa alat dan tidak ada ketergantungan antara panggilan alat, buat semua panggilan alat independen secara paralel. Prioritaskan memanggil alat secara bersamaan kapan pun tindakan dapat dilakukan secara paralel daripada secara berurutan. Misalnya, saat membaca 3 file, jalankan 3 panggilan alat secara paralel untuk membaca ketiga file ke dalam konteks pada waktu yang sama. Maksimalkan penggunaan panggilan alat paralel jika memungkinkan untuk meningkatkan kecepatan dan efisiensi. Namun, jika beberapa panggilan alat bergantung pada panggilan sebelumnya untuk menginformasikan nilai dependen seperti parameter, JANGAN panggil alat ini secara paralel dan sebaliknya panggil secara berurutan. Jangan pernah gunakan placeholder atau tebak parameter yang hilang dalam panggilan alat.
</use_parallel_tool_calls>
```

```text Contoh prompt untuk mengurangi eksekusi paralel
Jalankan operasi secara berurutan dengan jeda singkat antara setiap langkah untuk memastikan stabilitas.
```

### Kurangi pembuatan file dalam pengkodean agen

Model Claude 4.x mungkin kadang-kadang membuat file baru untuk tujuan pengujian dan iterasi, terutama saat bekerja dengan kode. Pendekatan ini memungkinkan Claude untuk menggunakan file, terutama skrip python, sebagai 'scratchpad sementara' sebelum menyimpan output finalnya. Menggunakan file sementara dapat meningkatkan hasil terutama untuk kasus penggunaan pengkodean agen.

Jika Anda lebih suka meminimalkan pembuatan file baru bersih, Anda dapat menginstruksikan Claude untuk membersihkan setelah dirinya sendiri:

```text Contoh prompt
Jika Anda membuat file baru sementara, skrip, atau file pembantu untuk iterasi, bersihkan file ini dengan menghapusnya di akhir tugas.
```

### Keantusiasan berlebihan dan pembuatan file

Claude Opus 4.5 memiliki kecenderungan untuk over-engineer dengan membuat file tambahan, menambahkan abstraksi yang tidak perlu, atau membangun fleksibilitas yang tidak diminta. Jika Anda melihat perilaku yang tidak diinginkan ini, tambahkan prompting eksplisit untuk menjaga solusi tetap minimal.

Misalnya:

```text Contoh prompt untuk meminimalkan over-engineering
Hindari over-engineering. Hanya buat perubahan yang secara langsung diminta atau jelas diperlukan. Jaga solusi tetap sederhana dan terfokus.

Jangan tambahkan fitur, refactor kode, atau buat "perbaikan" di luar apa yang diminta. Perbaikan bug tidak perlu kode sekitarnya dibersihkan. Fitur sederhana tidak perlu konfigurabilitas tambahan.

Jangan tambahkan penanganan kesalahan, fallback, atau validasi untuk skenario yang tidak dapat terjadi. Percayai kode internal dan jaminan kerangka kerja. Hanya validasi di batas sistem (input pengguna, API eksternal). Jangan gunakan shim kompatibilitas mundur ketika Anda dapat mengubah kode.

Jangan buat pembantu, utilitas, atau abstraksi untuk operasi satu kali. Jangan desain untuk persyaratan masa depan hipotetis. Jumlah kompleksitas yang tepat adalah minimum yang diperlukan untuk tugas saat ini. Gunakan kembali abstraksi yang ada jika memungkinkan dan ikuti prinsip DRY.
```

### Desain frontend

Model Claude 4.x, khususnya Opus 4.5, unggul dalam membangun aplikasi web yang kompleks dan dunia nyata dengan desain frontend yang kuat. Namun, tanpa panduan, model dapat default ke pola generik yang menciptakan apa yang pengguna sebut estetika "AI slop". Untuk membuat frontend yang khas dan kreatif yang mengejutkan dan menyenangkan:

<Tip>
Untuk panduan terperinci tentang meningkatkan desain frontend, lihat posting blog kami tentang [meningkatkan desain frontend melalui skills](https://www.claude.com/blog/improving-frontend-design-through-skills).
</Tip>

Berikut adalah cuplikan prompt sistem yang dapat Anda gunakan untuk mendorong desain frontend yang lebih baik:

```text Contoh prompt untuk estetika frontend
<frontend_aesthetics>
Anda cenderung bertemu pada output generik, "on distribution". Dalam desain frontend, ini menciptakan apa yang pengguna sebut estetika "AI slop". Hindari ini: buat frontend yang kreatif dan khas yang mengejutkan dan menyenangkan.

Fokus pada:
- Tipografi: Pilih font yang indah, unik, dan menarik. Hindari font generik seperti Arial dan Inter; pilih sebaliknya pilihan yang khas yang meningkatkan estetika frontend.
- Warna & Tema: Berkomitmen pada estetika yang kohesif. Gunakan variabel CSS untuk konsistensi. Warna dominan dengan aksen tajam mengungguli palet yang takut, terdistribusi secara merata. Ambil inspirasi dari tema IDE dan estetika budaya.
- Gerakan: Gunakan animasi untuk efek dan micro-interactions. Prioritaskan solusi CSS-only untuk HTML. Gunakan Motion library untuk React jika tersedia. Fokus pada momen berdampak tinggi: satu pemuatan halaman yang terkoordinasi dengan baik dengan reveal yang terstagger (animation-delay) menciptakan lebih banyak kesenangan daripada micro-interactions yang tersebar.
- Latar Belakang: Ciptakan suasana dan kedalaman daripada default ke warna solid. Lapisan gradien CSS, gunakan pola geometris, atau tambahkan efek kontekstual yang cocok dengan estetika keseluruhan.

Hindari estetika AI yang dihasilkan secara generik:
- Keluarga font yang terlalu sering digunakan (Inter, Roboto, Arial, font sistem)
- Skema warna klise (terutama gradien ungu pada latar belakang putih)
- Tata letak dan pola komponen yang dapat diprediksi
- Desain cookie-cutter yang kurang karakter khusus konteks

Interpretasikan secara kreatif dan buat pilihan yang tidak terduga yang terasa benar-benar dirancang untuk konteks. Variasikan antara tema terang dan gelap, font yang berbeda, estetika yang berbeda. Anda masih cenderung bertemu pada pilihan umum (Space Grotesk, misalnya) di seluruh generasi. Hindari ini: sangat penting bahwa Anda berpikir di luar kotak!
</frontend_aesthetics>
```

Anda juga dapat merujuk ke skill lengkap [di sini](https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md).

### Hindari fokus pada lulus tes dan hard-coding

Model Claude 4.x kadang-kadang dapat fokus terlalu berat pada lulus tes dengan mengorbankan solusi yang lebih umum, atau dapat menggunakan workaround seperti skrip pembantu untuk refactoring kompleks daripada menggunakan alat standar secara langsung. Untuk mencegah perilaku ini dan memastikan solusi yang kuat dan dapat digeneralisasi:

```text Contoh prompt
Silakan tulis solusi berkualitas tinggi, tujuan umum menggunakan alat standar yang tersedia. Jangan buat skrip pembantu atau workaround untuk menyelesaikan tugas dengan lebih efisien. Implementasikan solusi yang bekerja dengan benar untuk semua input yang valid, bukan hanya kasus tes. Jangan hard-code nilai atau buat solusi yang hanya bekerja untuk input tes spesifik. Sebaliknya, implementasikan logika aktual yang menyelesaikan masalah secara umum.

Fokus pada pemahaman persyaratan masalah dan mengimplementasikan algoritma yang benar. Tes ada di sana untuk memverifikasi kebenaran, bukan untuk mendefinisikan solusi. Berikan implementasi yang berprinsi yang mengikuti praktik terbaik dan prinsip desain perangkat lunak.

Jika tugas tidak masuk akal atau tidak layak, atau jika ada tes yang salah, silakan beri tahu saya daripada bekerja di sekitarnya. Solusi harus kuat, dapat dipertahankan, dan dapat diperluas.
```

### Mendorong eksplorasi kode

Claude Opus 4.5 sangat mampu tetapi dapat terlalu konservatif saat menjelajahi kode. Jika Anda melihat model mengusulkan solusi tanpa melihat kode atau membuat asumsi tentang kode yang belum dibacanya, solusi terbaik adalah menambahkan instruksi eksplisit ke prompt. Claude Opus 4.5 adalah model paling dapat diarahkan kami hingga saat ini dan merespons dengan andal terhadap panduan langsung.

Misalnya:

```text Contoh prompt untuk eksplorasi kode
SELALU baca dan pahami file yang relevan sebelum mengusulkan pengeditan kode. Jangan spekulasi tentang kode yang belum Anda periksa. Jika pengguna mereferensikan file/path spesifik, Anda HARUS membuka dan memeriksanya sebelum menjelaskan atau mengusulkan perbaikan. Jadilah ketat dan gigih dalam mencari kode untuk fakta kunci. Tinjau secara menyeluruh gaya, konvensi, dan abstraksi dari basis kode sebelum mengimplementasikan fitur atau abstraksi baru.
```

### Meminimalkan halusinasi dalam pengkodean agen

Model Claude 4.x kurang rentan terhadap halusinasi dan memberikan jawaban yang lebih akurat, berdasarkan, dan cerdas berdasarkan kode. Untuk mendorong perilaku ini bahkan lebih dan meminimalkan halusinasi:

```text Contoh prompt
<investigate_before_answering>
Jangan pernah spekulasi tentang kode yang belum Anda buka. Jika pengguna mereferensikan file spesifik, Anda HARUS membaca file sebelum menjawab. Pastikan untuk menyelidiki dan membaca file yang relevan SEBELUM menjawab pertanyaan tentang basis kode. Jangan pernah membuat klaim tentang kode sebelum menyelidiki kecuali Anda yakin dengan jawaban yang benar - berikan jawaban yang berdasarkan dan bebas halusinasi.
</investigate_before_answering>
```

## Pertimbangan migrasi

Saat bermigrasi ke model Claude 4.5:

1. **Jadilah spesifik tentang perilaku yang diinginkan**: Pertimbangkan menjelaskan dengan tepat apa yang ingin Anda lihat dalam output.

2. **Bingkai instruksi Anda dengan modifier**: Menambahkan modifier yang mendorong Claude untuk meningkatkan kualitas dan detail outputnya dapat membantu membentuk kinerja Claude dengan lebih baik. Misalnya, alih-alih "Buat dasbor analitik", gunakan "Buat dasbor analitik. Sertakan sebanyak mungkin fitur dan interaksi yang relevan. Melampaui dasar-dasar untuk membuat implementasi yang lengkap."

3. **Minta fitur spesifik secara eksplisit**: Animasi dan elemen interaktif harus diminta secara eksplisit ketika diinginkan.