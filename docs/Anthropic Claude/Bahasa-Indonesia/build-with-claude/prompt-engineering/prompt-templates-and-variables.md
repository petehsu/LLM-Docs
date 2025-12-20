# Gunakan template prompt dan variabel

---

Ketika menerapkan aplikasi berbasis LLM dengan Claude, panggilan API Anda biasanya akan terdiri dari dua jenis konten:
- **Konten tetap:** Instruksi atau konteks statis yang tetap konstan di berbagai interaksi
- **Konten variabel:** Elemen dinamis yang berubah dengan setiap permintaan atau percakapan, seperti:
    - Input pengguna
    - Konten yang diambil untuk Retrieval-Augmented Generation (RAG)
    - Konteks percakapan seperti riwayat akun pengguna
    - Data yang dihasilkan sistem seperti hasil penggunaan alat yang dimasukkan dari panggilan independen lain ke Claude

**Template prompt** menggabungkan bagian tetap dan variabel ini, menggunakan placeholder untuk konten dinamis. Di [Claude Console](/), placeholder ini dilambangkan dengan **\{\{tanda kurung ganda\}\}**, membuatnya mudah diidentifikasi dan memungkinkan pengujian cepat nilai yang berbeda.

---

# Kapan menggunakan template prompt dan variabel
Anda harus selalu menggunakan template prompt dan variabel ketika Anda mengharapkan bagian mana pun dari prompt Anda akan diulang dalam panggilan lain ke Claude (hanya melalui API atau [Claude Console](/). [claude.ai](https://claude.ai/) saat ini tidak mendukung template prompt atau variabel).

Template prompt menawarkan beberapa manfaat:
- **Konsistensi:** Memastikan struktur yang konsisten untuk prompt Anda di berbagai interaksi
- **Efisiensi:** Mudah mengganti konten variabel tanpa menulis ulang seluruh prompt
- **Kemampuan pengujian:** Cepat menguji input dan kasus tepi yang berbeda dengan hanya mengubah bagian variabel
- **Skalabilitas:** Menyederhanakan manajemen prompt saat aplikasi Anda berkembang dalam kompleksitas
- **Kontrol versi:** Mudah melacak perubahan pada struktur prompt Anda dari waktu ke waktu dengan hanya memantau bagian inti prompt Anda, terpisah dari input dinamis

[Claude Console](/) sangat menggunakan template prompt dan variabel untuk mendukung fitur dan alat untuk semua hal di atas, seperti dengan:
- **[Generator prompt](/docs/id/build-with-claude/prompt-engineering/prompt-generator):** Memutuskan variabel apa yang dibutuhkan prompt Anda dan memasukkannya dalam template yang dihasilkan
- **[Peningkat prompt](/docs/id/build-with-claude/prompt-engineering/prompt-improver):** Mengambil template yang sudah ada, termasuk semua variabel, dan mempertahankannya dalam template yang ditingkatkan yang dihasilkan
- **[Alat evaluasi](/docs/id/test-and-evaluate/eval-tool):** Memungkinkan Anda untuk dengan mudah menguji, menskalakan, dan melacak versi prompt Anda dengan memisahkan bagian variabel dan tetap dari template prompt Anda

---

# Contoh template prompt

Mari kita pertimbangkan aplikasi sederhana yang menerjemahkan teks bahasa Inggris ke bahasa Spanyol. Teks yang diterjemahkan akan menjadi variabel karena Anda akan mengharapkan teks ini berubah antara pengguna atau panggilan ke Claude. Teks yang diterjemahkan ini dapat diambil secara dinamis dari database atau input pengguna.

Jadi, untuk aplikasi terjemahan Anda, Anda mungkin menggunakan template prompt sederhana ini:
```
Translate this text from English to Spanish: {{text}}
```

---

## Langkah selanjutnya

<CardGroup cols={2}>
  <Card title="Generate a prompt" icon="link" href="/docs/id/build-with-claude/prompt-engineering/prompt-generator">
    Pelajari tentang generator prompt di Claude Console dan coba tangan Anda untuk membuat Claude menghasilkan prompt untuk Anda.
  </Card>
  <Card title="Apply XML tags" icon="link" href="/docs/id/build-with-claude/prompt-engineering/use-xml-tags">
    Jika Anda ingin meningkatkan permainan variabel prompt Anda, bungkus mereka dalam tag XML.
  </Card>
  <Card title="Claude Console" icon="link" href="/">
    Lihat berbagai alat pengembangan prompt yang tersedia di Claude Console.
  </Card>
</CardGroup>