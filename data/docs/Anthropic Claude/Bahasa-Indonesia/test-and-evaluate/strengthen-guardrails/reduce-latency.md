# Mengurangi latensi

Pelajari cara mengurangi latensi dalam aplikasi Claude Anda melalui pemilihan model yang tepat, optimisasi prompt, dan streaming.

---

Latensi mengacu pada waktu yang dibutuhkan model untuk memproses prompt dan menghasilkan output. Latensi dapat dipengaruhi oleh berbagai faktor, seperti ukuran model, kompleksitas prompt, dan infrastruktur yang mendasari model dan titik interaksi.

<Note>
Selalu lebih baik untuk terlebih dahulu merekayasa prompt yang bekerja dengan baik tanpa batasan model atau prompt, dan kemudian mencoba strategi pengurangan latensi setelahnya. Mencoba mengurangi latensi terlalu dini mungkin mencegah Anda menemukan seperti apa performa terbaik itu.
</Note>

---

## Cara mengukur latensi

Ketika membahas latensi, Anda mungkin menemukan beberapa istilah dan pengukuran:

- **Latensi dasar**: Ini adalah waktu yang dibutuhkan model untuk memproses prompt dan menghasilkan respons, tanpa mempertimbangkan token input dan output per detik. Ini memberikan gambaran umum tentang kecepatan model.
- **Waktu ke token pertama (TTFT)**: Metrik ini mengukur waktu yang dibutuhkan model untuk menghasilkan token pertama dari respons, dari saat prompt dikirim. Ini sangat relevan ketika Anda menggunakan streaming (lebih lanjut tentang itu nanti) dan ingin memberikan pengalaman yang responsif kepada pengguna Anda.

Untuk pemahaman yang lebih mendalam tentang istilah-istilah ini, lihat [glosarium](/docs/id/about-claude/glossary) kami.

---

## Cara mengurangi latensi

### 1. Pilih model yang tepat

Salah satu cara paling langsung untuk mengurangi latensi adalah memilih model yang sesuai untuk kasus penggunaan Anda. Anthropic menawarkan [berbagai model](/docs/id/about-claude/models/overview) dengan kemampuan dan karakteristik performa yang berbeda. Pertimbangkan kebutuhan spesifik Anda dan pilih model yang paling sesuai dengan kebutuhan Anda dalam hal kecepatan dan kualitas output.

Untuk aplikasi yang kritis terhadap kecepatan, **Claude Haiku 4.5** menawarkan waktu respons tercepat sambil mempertahankan kecerdasan tinggi:

```python
import anthropic

client = anthropic.Anthropic()

# Untuk aplikasi yang sensitif terhadap waktu, gunakan Claude Haiku 4.5
message = client.messages.create(
    model="claude-haiku-4-5",
    max_tokens=100,
    messages=[{
        "role": "user",
        "content": "Ringkas umpan balik pelanggan ini dalam 2 kalimat: [teks umpan balik]"
    }]
)
```

Untuk detail lebih lanjut tentang metrik model, lihat halaman [ikhtisar model](/docs/id/about-claude/models/overview) kami.

### 2. Optimalkan panjang prompt dan output

Minimalkan jumlah token dalam prompt input dan output yang diharapkan, sambil tetap mempertahankan performa tinggi. Semakin sedikit token yang harus diproses dan dihasilkan model, semakin cepat responsnya.

Berikut beberapa tips untuk membantu Anda mengoptimalkan prompt dan output:

- **Jelas tapi ringkas**: Bertujuan untuk menyampaikan maksud Anda dengan jelas dan ringkas dalam prompt. Hindari detail yang tidak perlu atau informasi yang berlebihan, sambil mengingat bahwa [claude kekurangan konteks](/docs/id/build-with-claude/prompt-engineering/be-clear-and-direct) tentang kasus penggunaan Anda dan mungkin tidak membuat lompatan logika yang dimaksudkan jika instruksi tidak jelas.
- **Minta respons yang lebih pendek**: Minta Claude secara langsung untuk ringkas. Keluarga model Claude 3 memiliki kemampuan pengarahan yang lebih baik dibandingkan generasi sebelumnya. Jika Claude mengeluarkan panjang yang tidak diinginkan, minta Claude untuk [mengurangi kecerewetannya](/docs/id/build-with-claude/prompt-engineering/be-clear-and-direct).
  <Tip> Karena cara LLM menghitung [token](/docs/id/about-claude/glossary#tokens) alih-alih kata, meminta jumlah kata yang tepat atau batas jumlah kata tidak seefektif strategi meminta batas jumlah paragraf atau kalimat.</Tip>
- **Tetapkan batas output yang sesuai**: Gunakan parameter `max_tokens` untuk menetapkan batas keras pada panjang maksimum respons yang dihasilkan. Ini mencegah Claude menghasilkan output yang terlalu panjang.
  > **Catatan**: Ketika respons mencapai `max_tokens` token, respons akan terpotong, mungkin di tengah kalimat atau di tengah kata, jadi ini adalah teknik kasar yang mungkin memerlukan pasca-pemrosesan dan biasanya paling sesuai untuk respons pilihan ganda atau jawaban pendek di mana jawabannya langsung muncul di awal.
- **Bereksperimen dengan temperature**: [Parameter](/docs/id/api/messages) `temperature` mengontrol keacakan output. Nilai yang lebih rendah (misalnya, 0.2) kadang-kadang dapat menghasilkan respons yang lebih fokus dan lebih pendek, sementara nilai yang lebih tinggi (misalnya, 0.8) mungkin menghasilkan output yang lebih beragam tetapi berpotensi lebih panjang.

Menemukan keseimbangan yang tepat antara kejelasan prompt, kualitas output, dan jumlah token mungkin memerlukan beberapa eksperimen.

### 3. Manfaatkan streaming

Streaming adalah fitur yang memungkinkan model mulai mengirim kembali responsnya sebelum output penuh selesai. Ini dapat secara signifikan meningkatkan responsivitas yang dirasakan dari aplikasi Anda, karena pengguna dapat melihat output model secara real-time.

Dengan streaming diaktifkan, Anda dapat memproses output model saat tiba, memperbarui antarmuka pengguna atau melakukan tugas lain secara paralel. Ini dapat sangat meningkatkan pengalaman pengguna dan membuat aplikasi Anda terasa lebih interaktif dan responsif.

Kunjungi [streaming Messages](/docs/id/build-with-claude/streaming) untuk mempelajari tentang bagaimana Anda dapat mengimplementasikan streaming untuk kasus penggunaan Anda.