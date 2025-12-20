# Migrasi ke Claude 4.5

Panduan lengkap untuk migrasi ke Claude 4.5 models dengan instruksi langkah demi langkah dan perubahan yang merusak yang jelas ditandai.

---

Panduan ini mencakup dua jalur migrasi utama ke model Claude 4.5:

- **Claude Sonnet 3.7 → Claude Sonnet 4.5**: Model paling cerdas kami dengan penalaran terbaik di kelasnya, kemampuan coding, dan agen yang berjalan lama
- **Claude Haiku 3.5 → Claude Haiku 4.5**: Model Haiku tercepat dan paling cerdas kami dengan performa mendekati frontier untuk aplikasi real-time dan pemrosesan cerdas volume tinggi

Kedua migrasi melibatkan perubahan yang merusak yang memerlukan pembaruan pada implementasi Anda. Panduan ini akan memandu Anda melalui setiap jalur migrasi dengan instruksi langkah demi langkah dan perubahan yang merusak yang jelas ditandai.

Sebelum memulai migrasi Anda, kami merekomendasikan untuk meninjau [Apa yang baru di Claude 4.5](/docs/id/about-claude/models/whats-new-claude-4-5) untuk memahami fitur dan kemampuan baru yang tersedia di model ini, termasuk extended thinking, kesadaran konteks, dan peningkatan perilaku.

## Migrasi dari Claude Sonnet 3.7 ke Claude Sonnet 4.5

Claude Sonnet 4.5 adalah model paling cerdas kami, menawarkan performa terbaik di kelasnya untuk penalaran, coding, dan agen otonomi yang berjalan lama. Migrasi ini mencakup beberapa perubahan yang merusak yang memerlukan pembaruan pada implementasi Anda.

### Langkah-langkah migrasi

1. **Perbarui nama model Anda:**
   ```python
   # Sebelumnya (Claude Sonnet 3.7)
   model="claude-3-7-sonnet-20250219"

   # Sesudahnya (Claude Sonnet 4.5)
   model="claude-sonnet-4-5-20250929"
   ```

2. **Perbarui parameter sampling**

   <Warning>
   Ini adalah perubahan yang merusak dari Claude Sonnet 3.7.
   </Warning>

   Gunakan hanya `temperature` ATAU `top_p`, bukan keduanya:

   ```python
   # Sebelumnya (Claude Sonnet 3.7) - Ini akan error di Sonnet 4.5
   response = client.messages.create(
       model="claude-3-7-sonnet-20250219",
       temperature=0.7,
       top_p=0.9,  # Tidak dapat menggunakan keduanya
       ...
   )

   # Sesudahnya (Claude Sonnet 4.5)
   response = client.messages.create(
       model="claude-sonnet-4-5-20250929",
       temperature=0.7,  # Gunakan temperature ATAU top_p, bukan keduanya
       ...
   )
   ```

3. **Tangani alasan penghentian `refusal` yang baru**

   Perbarui aplikasi Anda untuk [menangani alasan penghentian `refusal`](/docs/id/test-and-evaluate/strengthen-guardrails/handle-streaming-refusals):

   ```python
   response = client.messages.create(...)

   if response.stop_reason == "refusal":
       # Tangani penolakan dengan tepat
       pass
   ```

4. **Perbarui alat editor teks (jika berlaku)**

   <Warning>
   Ini adalah perubahan yang merusak dari Claude Sonnet 3.7.
   </Warning>

   Perbarui ke `text_editor_20250728` (type) dan `str_replace_based_edit_tool` (name). Hapus kode apa pun yang menggunakan perintah `undo_edit`.
   
   ```python
   # Sebelumnya (Claude Sonnet 3.7)
   tools=[{"type": "text_editor_20250124", "name": "str_replace_editor"}]

   # Sesudahnya (Claude Sonnet 4.5)
   tools=[{"type": "text_editor_20250728", "name": "str_replace_based_edit_tool"}]
   ```

   Lihat [dokumentasi alat editor teks](/docs/id/agents-and-tools/tool-use/text-editor-tool) untuk detail.

5. **Perbarui alat eksekusi kode (jika berlaku)**

   Tingkatkan ke `code_execution_20250825`. Versi legacy `code_execution_20250522` masih berfungsi tetapi tidak direkomendasikan. Lihat [dokumentasi alat eksekusi kode](/docs/id/agents-and-tools/tool-use/code-execution-tool#upgrade-to-latest-tool-version) untuk instruksi migrasi.

6. **Hapus header beta penggunaan alat yang efisien token**

   Penggunaan alat yang efisien token adalah fitur beta yang hanya berfungsi dengan Claude 3.7 Sonnet. Semua model Claude 4 memiliki penggunaan alat yang efisien token bawaan, jadi Anda tidak lagi harus menyertakan header beta.

   Hapus header beta `token-efficient-tools-2025-02-19` [beta header](/docs/id/api/beta-headers) dari permintaan Anda:

   ```python
   # Sebelumnya (Claude Sonnet 3.7)
   client.messages.create(
       model="claude-3-7-sonnet-20250219",
       betas=["token-efficient-tools-2025-02-19"],  # Hapus ini
       ...
   )

   # Sesudahnya (Claude Sonnet 4.5)
   client.messages.create(
       model="claude-sonnet-4-5-20250929",
       # Tidak ada header beta token-efficient-tools
       ...
   )
   ```

7. **Hapus header beta output yang diperpanjang**

   Header beta `output-128k-2025-02-19` [beta header](/docs/id/api/beta-headers) untuk output yang diperpanjang hanya tersedia di Claude Sonnet 3.7.

   Hapus header ini dari permintaan Anda:

   ```python
   # Sebelumnya (Claude Sonnet 3.7)
   client.messages.create(
       model="claude-3-7-sonnet-20250219",
       betas=["output-128k-2025-02-19"],  # Hapus ini
       ...
   )

   # Sesudahnya (Claude Sonnet 4.5)
   client.messages.create(
       model="claude-sonnet-4-5-20250929",
       # Tidak ada header beta output-128k
       ...
   )
   ```

8. **Perbarui prompt Anda untuk perubahan perilaku**

   Claude Sonnet 4.5 memiliki gaya komunikasi yang lebih ringkas dan langsung serta memerlukan arahan eksplisit. Tinjau [praktik terbaik prompt engineering Claude 4](/docs/id/build-with-claude/prompt-engineering/claude-4-best-practices) untuk panduan optimasi.

9. **Pertimbangkan untuk mengaktifkan extended thinking untuk tugas kompleks**

   Aktifkan [extended thinking](/docs/id/build-with-claude/extended-thinking) untuk peningkatan performa yang signifikan pada tugas coding dan penalaran (dinonaktifkan secara default):

   ```python
   response = client.messages.create(
       model="claude-sonnet-4-5-20250929",
       max_tokens=16000,
       thinking={"type": "enabled", "budget_tokens": 10000},
       messages=[...]
   )
   ```

   <Note>
   Extended thinking mempengaruhi efisiensi [prompt caching](/docs/id/build-with-claude/prompt-caching#caching-with-thinking-blocks).
   </Note>

10. **Uji implementasi Anda**

   Uji di lingkungan pengembangan sebelum menerapkan ke produksi untuk memastikan semua perubahan yang merusak ditangani dengan benar.

### Daftar periksa migrasi Sonnet 3.7 → 4.5

- [ ] Perbarui ID model ke `claude-sonnet-4-5-20250929`
- [ ] **MERUSAK**: Perbarui parameter sampling untuk menggunakan hanya `temperature` ATAU `top_p`, bukan keduanya
- [ ] Tangani alasan penghentian `refusal` yang baru di aplikasi Anda
- [ ] **MERUSAK**: Perbarui alat editor teks ke `text_editor_20250728` dan `str_replace_based_edit_tool` (jika berlaku)
- [ ] **MERUSAK**: Hapus kode apa pun yang menggunakan perintah `undo_edit` (jika berlaku)
- [ ] Perbarui alat eksekusi kode ke `code_execution_20250825` (jika berlaku)
- [ ] Hapus header beta `token-efficient-tools-2025-02-19` (jika berlaku)
- [ ] Hapus header beta `output-128k-2025-02-19` (jika berlaku)
- [ ] Tinjau dan perbarui prompt mengikuti [praktik terbaik Claude 4](/docs/id/build-with-claude/prompt-engineering/claude-4-best-practices)
- [ ] Pertimbangkan untuk mengaktifkan extended thinking untuk tugas penalaran kompleks
- [ ] Tangani alasan penghentian `model_context_window_exceeded` (spesifik Sonnet 4.5)
- [ ] Pertimbangkan untuk mengaktifkan alat memory untuk agen yang berjalan lama (beta)
- [ ] Pertimbangkan menggunakan pembersihan panggilan alat otomatis untuk pengeditan konteks (beta)
- [ ] Uji di lingkungan pengembangan sebelum penerapan produksi

### Fitur yang dihapus dari Claude Sonnet 3.7

- **Penggunaan alat yang efisien token**: Header beta `token-efficient-tools-2025-02-19` hanya berfungsi dengan Claude 3.7 Sonnet dan tidak didukung di model Claude 4 (lihat langkah 6)
- **Output yang diperpanjang**: Header beta `output-128k-2025-02-19` tidak didukung (lihat langkah 7)

Kedua header dapat disertakan dalam permintaan Claude 4 tetapi tidak akan memiliki efek.

## Migrasi dari Claude Haiku 3.5 ke Claude Haiku 4.5

Claude Haiku 4.5 adalah model Haiku tercepat dan paling cerdas kami dengan performa mendekati frontier, memberikan kualitas model premium dengan performa real-time untuk aplikasi interaktif dan pemrosesan cerdas volume tinggi. Migrasi ini mencakup beberapa perubahan yang merusak yang memerlukan pembaruan pada implementasi Anda.

Untuk gambaran lengkap tentang kemampuan baru, lihat [Apa yang baru di Claude 4.5](/docs/id/about-claude/models/whats-new-claude-4-5#key-improvements-in-haiku-4-5-over-haiku-3-5).

<Note>
Harga Haiku 4.5 $1 per juta token input, $5 per juta token output. Lihat [harga Claude](/docs/id/about-claude/pricing) untuk detail.
</Note>

### Langkah-langkah migrasi

1. **Perbarui nama model Anda:**
   ```python
   # Sebelumnya (Haiku 3.5)
   model="claude-3-5-haiku-20241022"

   # Sesudahnya (Haiku 4.5)
   model="claude-haiku-4-5-20251001"
   ```

2. **Perbarui versi alat (jika berlaku)**

   <Warning>
   Ini adalah perubahan yang merusak dari Claude Haiku 3.5.
   </Warning>

   Haiku 4.5 hanya mendukung versi alat terbaru:

   ```python
   # Sebelumnya (Haiku 3.5)
   tools=[{"type": "text_editor_20250124", "name": "str_replace_editor"}]

   # Sesudahnya (Haiku 4.5)
   tools=[{"type": "text_editor_20250728", "name": "str_replace_based_edit_tool"}]
   ```

   - **Editor teks**: Gunakan `text_editor_20250728` dan `str_replace_based_edit_tool`
   - **Eksekusi kode**: Gunakan `code_execution_20250825`
   - Hapus kode apa pun yang menggunakan perintah `undo_edit`

3. **Perbarui parameter sampling**

   <Warning>
   Ini adalah perubahan yang merusak dari Claude Haiku 3.5.
   </Warning>

   Gunakan hanya `temperature` ATAU `top_p`, bukan keduanya:

   ```python
   # Sebelumnya (Haiku 3.5) - Ini akan error di Haiku 4.5
   response = client.messages.create(
       model="claude-3-5-haiku-20241022",
       temperature=0.7,
       top_p=0.9,  # Tidak dapat menggunakan keduanya
       ...
   )

   # Sesudahnya (Haiku 4.5)
   response = client.messages.create(
       model="claude-haiku-4-5-20251001",
       temperature=0.7,  # Gunakan temperature ATAU top_p, bukan keduanya
       ...
   )
   ```

4. **Tinjau batas laju baru**

   Haiku 4.5 memiliki batas laju terpisah dari Haiku 3.5. Lihat [dokumentasi batas laju](/docs/id/api/rate-limits) untuk detail.

5. **Tangani alasan penghentian `refusal` yang baru**

   Perbarui aplikasi Anda untuk [menangani alasan penghentian refusal](/docs/id/test-and-evaluate/strengthen-guardrails/handle-streaming-refusals).

6. **Pertimbangkan untuk mengaktifkan extended thinking untuk tugas kompleks**

   Aktifkan [extended thinking](/docs/id/build-with-claude/extended-thinking) untuk peningkatan performa yang signifikan pada tugas coding dan penalaran (dinonaktifkan secara default):

   ```python
   response = client.messages.create(
       model="claude-haiku-4-5-20251001",
       max_tokens=16000,
       thinking={"type": "enabled", "budget_tokens": 5000},
       messages=[...]
   )
   ```
   <Note>
   Extended thinking mempengaruhi efisiensi [prompt caching](/docs/id/build-with-claude/prompt-caching#caching-with-thinking-blocks).
   </Note>

7. **Jelajahi kemampuan baru**

   Lihat [Apa yang baru di Claude 4.5](/docs/id/about-claude/models/whats-new-claude-4-5#key-improvements-in-haiku-4-5-over-haiku-3-5) untuk detail tentang kesadaran konteks, kapasitas output yang meningkat (64K token), kecerdasan yang lebih tinggi, dan kecepatan yang ditingkatkan.

8. **Uji implementasi Anda**

   Uji di lingkungan pengembangan sebelum menerapkan ke produksi untuk memastikan semua perubahan yang merusak ditangani dengan benar.

### Daftar periksa migrasi Haiku 3.5 → 4.5

- [ ] Perbarui ID model ke `claude-haiku-4-5-20251001`
- [ ] **MERUSAK**: Perbarui versi alat ke versi terbaru (misalnya, `text_editor_20250728`, `code_execution_20250825`) - versi legacy tidak didukung
- [ ] **MERUSAK**: Hapus kode apa pun yang menggunakan perintah `undo_edit` (jika berlaku)
- [ ] **MERUSAK**: Perbarui parameter sampling untuk menggunakan hanya `temperature` ATAU `top_p`, bukan keduanya
- [ ] Tinjau dan sesuaikan untuk batas laju baru (terpisah dari Haiku 3.5)
- [ ] Tangani alasan penghentian `refusal` yang baru di aplikasi Anda
- [ ] Pertimbangkan untuk mengaktifkan extended thinking untuk tugas penalaran kompleks (kemampuan baru)
- [ ] Manfaatkan kesadaran konteks untuk manajemen token yang lebih baik dalam sesi panjang
- [ ] Bersiaplah untuk respons yang lebih besar (output maksimal meningkat dari 8K menjadi 64K token)
- [ ] Tinjau dan perbarui prompt mengikuti [praktik terbaik Claude 4](/docs/id/build-with-claude/prompt-engineering/claude-4-best-practices)
- [ ] Uji di lingkungan pengembangan sebelum penerapan produksi

## Memilih antara Sonnet 4.5 dan Haiku 4.5

Baik Claude Sonnet 4.5 maupun Claude Haiku 4.5 adalah model Claude 4 yang kuat dengan kekuatan yang berbeda:

### Pilih Claude Sonnet 4.5 (paling cerdas) untuk:

- **Penalaran dan analisis kompleks**: Kecerdasan terbaik di kelasnya untuk tugas-tugas canggih
- **Agen otonomi yang berjalan lama**: Performa superior untuk agen yang bekerja secara independen untuk periode yang diperpanjang
- **Tugas coding tingkat lanjut**: Model coding terkuat kami dengan perencanaan tingkat lanjut dan rekayasa keamanan
- **Alur kerja konteks besar**: Manajemen konteks yang ditingkatkan dengan alat memory dan kemampuan pengeditan konteks
- **Tugas yang memerlukan kemampuan maksimal**: Ketika kecerdasan dan akurasi adalah prioritas utama

### Pilih Claude Haiku 4.5 (tercepat dan paling cerdas Haiku) untuk:

- **Aplikasi real-time**: Waktu respons cepat untuk pengalaman pengguna interaktif dengan performa mendekati frontier
- **Pemrosesan cerdas volume tinggi**: Kecerdasan yang hemat biaya dalam skala besar dengan kecepatan yang ditingkatkan
- **Penerapan sensitif biaya**: Performa mendekati frontier dengan harga yang lebih rendah
- **Arsitektur sub-agen**: Agen cepat dan cerdas untuk sistem multi-agen
- **Penggunaan komputer dalam skala besar**: Otomasi desktop dan browser otonomi yang hemat biaya
- **Tugas yang memerlukan kecepatan**: Ketika latensi rendah sangat penting sambil mempertahankan kecerdasan mendekati frontier

### Rekomendasi extended thinking

Model Claude 4, khususnya Sonnet dan Haiku 4.5, menunjukkan peningkatan performa yang signifikan ketika menggunakan [extended thinking](/docs/id/build-with-claude/extended-thinking) untuk tugas coding dan penalaran kompleks. Extended thinking **dinonaktifkan secara default** tetapi kami merekomendasikan untuk mengaktifkannya untuk pekerjaan yang menuntut.

**Penting**: Extended thinking mempengaruhi efisiensi [prompt caching](/docs/id/build-with-claude/prompt-caching#caching-with-thinking-blocks). Ketika konten non-tool-result ditambahkan ke percakapan, blok thinking dihapus dari cache, yang dapat meningkatkan biaya dalam percakapan multi-turn. Kami merekomendasikan untuk mengaktifkan thinking ketika manfaat performa melebihi trade-off caching.

## Skenario migrasi lainnya

Jalur migrasi utama yang tercakup di atas (Sonnet 3.7 → 4.5 dan Haiku 3.5 → 4.5) mewakili upgrade paling umum. Namun, Anda mungkin bermigrasi dari model Claude lain ke Claude 4.5. Bagian ini mencakup skenario tersebut.

### Migrasi dari Claude Sonnet 4 → Sonnet 4.5

**Perubahan yang merusak**: Tidak dapat menentukan baik `temperature` maupun `top_p` dalam permintaan yang sama.

Semua panggilan API lainnya akan berfungsi tanpa modifikasi. Perbarui ID model Anda dan sesuaikan parameter sampling jika diperlukan:

```python
# Sebelumnya (Claude Sonnet 4)
model="claude-sonnet-4-20250514"

# Sesudahnya (Claude Sonnet 4.5)
model="claude-sonnet-4-5-20250929"
```

### Migrasi dari Claude Opus 4.1 → Sonnet 4.5

**Tidak ada perubahan yang merusak.** Semua panggilan API akan berfungsi tanpa modifikasi.

Cukup perbarui ID model Anda:

```python
# Sebelumnya (Claude Opus 4.1)
model="claude-opus-4-1-20250805"

# Sesudahnya (Claude Sonnet 4.5)
model="claude-sonnet-4-5-20250929"
```

Claude Sonnet 4.5 adalah model paling cerdas kami dengan penalaran terbaik di kelasnya, coding, dan kemampuan agen yang berjalan lama. Ini menawarkan performa superior dibandingkan dengan Opus 4.1 untuk sebagian besar kasus penggunaan.

### Migrasi dari Claude Opus 4.1 → Opus 4.5

**Tidak ada perubahan yang merusak.** Semua panggilan API akan berfungsi tanpa modifikasi.

Cukup perbarui ID model Anda:

```python
# Sebelumnya (Claude Opus 4.1)
model="claude-opus-4-1-20250805"

# Sesudahnya (Claude Opus 4.5)
model="claude-opus-4-5-20251101"
```

Claude Opus 4.5 adalah model paling cerdas kami, menggabungkan kemampuan maksimal dengan performa praktis. Ini menampilkan peningkatan perubahan langkah dalam visi, coding, dan penggunaan komputer dengan harga yang lebih terjangkau daripada Opus 4.1. Ideal untuk tugas-tugas khusus yang kompleks dan rekayasa perangkat lunak profesional.

<Note>
Untuk basis kode dengan banyak referensi model, [plugin Claude Code](https://github.com/anthropics/claude-code/tree/main/plugins/claude-opus-4-5-migration) tersedia untuk mengotomatisasi migrasi ke Opus 4.5.
</Note>

### Migrasi antara model Claude 4.5

**Tidak ada perubahan yang merusak.** Semua panggilan API akan berfungsi tanpa modifikasi.

Cukup perbarui ID model Anda.

## Butuh bantuan?

- Periksa [dokumentasi API](/docs/id/api/overview) kami untuk spesifikasi terperinci
- Tinjau [kemampuan model](/docs/id/about-claude/models/overview) untuk perbandingan performa
- Tinjau [catatan rilis API](/docs/id/release-notes/api) untuk pembaruan API
- Hubungi dukungan jika Anda mengalami masalah apa pun selama migrasi