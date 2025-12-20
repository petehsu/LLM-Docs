# Memilih model yang tepat

Memilih model Claude yang optimal untuk aplikasi Anda melibatkan penyeimbangan tiga pertimbangan utama: kemampuan, kecepatan, dan biaya. Panduan ini membantu Anda membuat keputusan berdasarkan informasi sesuai dengan kebutuhan spesifik Anda.

---

## Tetapkan kriteria utama

Saat memilih model Claude, kami merekomendasikan untuk terlebih dahulu mengevaluasi faktor-faktor berikut:
- **Kemampuan:** Fitur atau kemampuan spesifik apa yang akan Anda butuhkan dari model untuk memenuhi kebutuhan Anda?
- **Kecepatan:** Seberapa cepat model perlu merespons dalam aplikasi Anda?
- **Biaya:** Berapa anggaran Anda untuk penggunaan pengembangan dan produksi?

Mengetahui jawaban ini sebelumnya akan membuat penyempitan dan keputusan model mana yang akan digunakan menjadi jauh lebih mudah.

***

## Pilih model terbaik untuk memulai

Ada dua pendekatan umum yang dapat Anda gunakan untuk mulai menguji model Claude mana yang paling sesuai dengan kebutuhan Anda.

### Opsi 1: Mulai dengan model yang cepat dan hemat biaya

Untuk banyak aplikasi, memulai dengan model yang lebih cepat dan hemat biaya seperti Claude Haiku 4.5 dapat menjadi pendekatan yang optimal:

1. Mulai implementasi dengan Claude Haiku 4.5
2. Uji kasus penggunaan Anda secara menyeluruh
3. Evaluasi apakah kinerja memenuhi persyaratan Anda
4. Tingkatkan hanya jika diperlukan untuk kesenjangan kemampuan tertentu

Pendekatan ini memungkinkan iterasi cepat, biaya pengembangan lebih rendah, dan sering kali cukup untuk banyak aplikasi umum. Pendekatan ini terbaik untuk:
- Pembuatan prototipe dan pengembangan awal
- Aplikasi dengan persyaratan latensi ketat
- Implementasi yang sensitif terhadap biaya
- Tugas-tugas bervolume tinggi yang sederhana

### Opsi 2: Mulai dengan model yang paling mampu

Untuk tugas-tugas kompleks di mana kecerdasan dan kemampuan lanjutan adalah yang terpenting, Anda mungkin ingin memulai dengan model yang paling mampu dan kemudian mempertimbangkan optimasi ke model yang lebih efisien di kemudian hari:

1. Implementasikan dengan Claude Sonnet 4.5
2. Optimalkan prompt Anda untuk model-model ini
3. Evaluasi apakah kinerja memenuhi persyaratan Anda
4. Pertimbangkan peningkatan efisiensi dengan menurunkan kecerdasan seiring waktu dengan optimasi alur kerja yang lebih besar

Pendekatan ini terbaik untuk:
- Tugas penalaran kompleks
- Aplikasi ilmiah atau matematika
- Tugas yang memerlukan pemahaman bernuansa
- Aplikasi di mana akurasi lebih penting daripada pertimbangan biaya
- Pengkodean lanjutan

## Matriks pemilihan model

| Ketika Anda membutuhkan... | Kami merekomendasikan untuk memulai dengan... | Contoh kasus penggunaan |
|------------------|-------------------|-------------------|
| Model terbaik untuk agen kompleks dan pengkodean, kecerdasan tertinggi di sebagian besar tugas, orkestrasi alat superior untuk tugas otonom jangka panjang | Claude Sonnet 4.5 | Agen pengkodean otonom, otomasi keamanan siber, analisis keuangan kompleks, tugas penelitian multi-jam, kerangka kerja multi-agen |
| Kecerdasan maksimal dengan kinerja praktis untuk tugas khusus kompleks | Claude Opus 4.5 | Rekayasa perangkat lunak profesional, agen lanjutan untuk tugas kantor, penggunaan komputer dan browser dalam skala besar, aplikasi visi perubahan langkah |
| Kecerdasan dan penalaran luar biasa untuk tugas khusus kompleks | Claude Opus 4.1 | Refaktorisasi basis kode yang sangat kompleks, penulisan kreatif bernuansa, analisis ilmiah khusus |
| Kinerja mendekati perbatasan dengan kecepatan kilat dan pemikiran yang diperpanjang - model Haiku kami yang tercepat dan paling cerdas dengan harga paling ekonomis | Claude Haiku 4.5 | Aplikasi real-time, pemrosesan cerdas bervolume tinggi, penerapan sensitif biaya yang memerlukan penalaran kuat, tugas sub-agen |

***

## Tentukan apakah akan meningkatkan atau mengubah model

Untuk menentukan apakah Anda perlu meningkatkan atau mengubah model, Anda harus:
1. [Buat tes benchmark](/docs/id/test-and-evaluate/develop-tests) khusus untuk kasus penggunaan Anda - memiliki set evaluasi yang baik adalah langkah paling penting dalam proses
2. Uji dengan prompt dan data aktual Anda
3. Bandingkan kinerja di seluruh model untuk:
   - Akurasi respons
   - Kualitas respons
   - Penanganan kasus tepi
4. Pertimbangkan pertukaran kinerja dan biaya

## Langkah berikutnya

<CardGroup cols={3}>
  <Card title="Bagan perbandingan model" icon="settings" href="/docs/id/about-claude/models/overview">
    Lihat spesifikasi terperinci dan harga untuk model Claude terbaru
  </Card>
  <Card title="Apa yang baru di Claude 4.5" icon="sparkle" href="/docs/id/about-claude/models/whats-new-claude-4-5">
    Jelajahi peningkatan terbaru dalam model Claude 4.5
  </Card>
  <Card title="Mulai membangun" icon="code" href="/docs/id/get-started">
    Mulai dengan panggilan API pertama Anda
  </Card>
</CardGroup>