# Isi sebelumnya respons Claude untuk kontrol output yang lebih besar

Pelajari cara mengisi sebelumnya respons Claude untuk mengarahkan tindakannya, melewati pembukaan, dan memberlakukan format tertentu.

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

<Note>
Pengisian sebelumnya hanya tersedia untuk mode non-extended thinking. Saat ini tidak didukung dengan extended thinking.
</Note>

Saat menggunakan Claude, Anda memiliki kemampuan unik untuk memandu responsnya dengan mengisi sebelumnya pesan `Assistant`. Teknik yang kuat ini memungkinkan Anda untuk mengarahkan tindakan Claude, melewati pembukaan, memberlakukan format tertentu seperti JSON atau XML, dan bahkan membantu Claude mempertahankan konsistensi karakter dalam skenario bermain peran.

Dalam beberapa kasus di mana Claude tidak berkinerja seperti yang diharapkan, beberapa kalimat yang diisi sebelumnya dapat sangat meningkatkan kinerja Claude. Sedikit pengisian sebelumnya berjalan jauh!

## Cara mengisi sebelumnya respons Claude

Untuk mengisi sebelumnya, sertakan teks awal yang diinginkan dalam pesan `Assistant` (respons Claude akan berlanjut dari mana pesan `Assistant` berakhir):

```python
import anthropic

client = anthropic.Anthropic()
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "What is your favorite color?"},
        {"role": "assistant", "content": "As an AI assistant, I don't have a favorite color, But if I had to pick, it would be green because"}  # Prefill here
    ]
)
```

<Warning>
  Konten pengisian sebelumnya tidak dapat diakhiri dengan spasi kosong. Pengisian sebelumnya seperti `"As an AI assistant, I "` (dengan spasi di akhir) akan menghasilkan kesalahan.
</Warning>

### Contoh

#### Contoh 1: Mengontrol pemformatan output dan melewati pembukaan

<Tip>**Tip pengguna power**: Mengisi sebelumnya `{` memaksa Claude untuk melewati pembukaan dan langsung mengeluarkan objek JSON. Ini lebih bersih, lebih ringkas, dan lebih mudah untuk program diurai tanpa pemrosesan tambahan.
Untuk output JSON yang dijamin sesuai dengan skema tertentu, pertimbangkan menggunakan [Structured Outputs](/docs/id/build-with-claude/structured-outputs) alih-alih pengisian sebelumnya. Output terstruktur memastikan respons Claude selalu cocok dengan skema JSON yang Anda tentukan, menjadikannya ideal untuk aplikasi produksi yang memerlukan kepatuhan format yang ketat.</Tip>

    <section title="Contoh: Ekstraksi data terstruktur tanpa pengisian sebelumnya">

    | Peran | Konten |
    | ---- | ------- |
    | Pengguna | Ekstrak nama, ukuran, harga, dan warna dari deskripsi produk ini sebagai objek JSON:<br/><br/>\<description><br/>SmartHome Mini adalah asisten rumah pintar kompak yang tersedia dalam warna hitam atau putih hanya seharga \$49,99. Dengan lebar hanya 5 inci, memungkinkan Anda mengontrol lampu, termostat, dan perangkat terhubung lainnya melalui suara atau aplikasi—di mana pun Anda menempatkannya di rumah Anda. Hub kecil yang terjangkau ini membawa kontrol bebas tangan yang nyaman ke perangkat pintar Anda.<br/>\</description> |
    | Asisten | Berikut adalah informasi yang diekstrak dalam format JSON:<br/><br/>\`\`\`json<br/>\{<br/>  "name": "SmartHome Mini",<br/>  "size": "5 inches wide",<br/>  "price": "\$49.99",<br/>  "colors": ["black", "white"]<br/>\}<br/>\`\`\`<br/><br/>Saya telah mengekstrak detail berikut dari deskripsi produk:<br/>- **Nama**: SmartHome Mini<br/>- **Ukuran**: Lebar 5 inci<br/>- **Harga**: \$49,99<br/>- **Warna**: Tersedia dalam warna hitam dan putih<br/><br/>Objek JSON menyediakan format terstruktur yang mudah untuk program diurai dan digunakan. Beri tahu saya jika Anda memerlukan modifikasi atau memiliki pertanyaan lain! |
    
</section>

    <section title="Contoh: Ekstraksi data terstruktur dengan pengisian sebelumnya">

    | Peran | Konten |
    | ---- | ------- |
    | Pengguna | Ekstrak nama, ukuran, harga, dan warna dari deskripsi produk ini sebagai objek JSON:<br/><br/>\<description><br/>SmartHome Mini adalah asisten rumah pintar kompak yang tersedia dalam warna hitam atau putih hanya seharga \$49,99. Dengan lebar hanya 5 inci, memungkinkan Anda mengontrol lampu, termostat, dan perangkat terhubung lainnya melalui suara atau aplikasi—di mana pun Anda menempatkannya di rumah Anda. Hub kecil yang terjangkau ini membawa kontrol bebas tangan yang nyaman ke perangkat pintar Anda.<br/>\</description> |
    | Asisten (pengisian sebelumnya) | \{ |
    | Asisten (respons Claude) | "name": "SmartHome Mini",<br/>"size": "5 inches wide",<br/>"price": "\$49.99",<br/>"colors": [<br/>  "black",<br/>  "white"<br/>]<br/>\} |
    
</section>

#### Contoh 2: Mempertahankan karakter dalam skenario bermain peran

<Tip>**Tip bermain peran**: Mengisi sebelumnya `[ROLE_NAME]` yang diberi tanda kurung dapat mengingatkan Claude untuk tetap berkarakter, bahkan untuk percakapan yang lebih panjang dan kompleks. Ini sangat kuat ketika dikombinasikan dengan role prompting dalam parameter `system`.</Tip>

    <section title="Contoh: Mempertahankan karakter tanpa role prompting">

    | Peran | Konten |
    | ---- | ------- |
    | Pengguna (50 putaran percakapan dengan Claude "Sherlock Holmes") | Apa yang Anda deduksi tentang pemilik sepatu ini? \<image>muddy_shoe.jpg\</image> |
    | Asisten | Sebagai asisten AI, saya akan senang menganalisis gambar sepatu berlumpur seolah-olah Anda telah menyediakannya. Berikut adalah deduksi saya... |
    
</section>

    <section title="Contoh: Mempertahankan karakter dengan role prompting">

    | Peran | Konten |
    | ---- | ------- |
    | Pengguna (50 putaran percakapan dengan Claude "Sherlock Holmes") | Apa yang Anda deduksi tentang pemilik sepatu ini? <br/>\<image>muddy_shoe.jpg\</image> |
    | Asisten (pengisian sebelumnya) | [Sherlock Holmes] |
    | Asisten (respons Claude) | Ah, apa yang kita miliki di sini? Sebuah spesimen yang paling penasaran, Watson! Mari kita periksa sepatu ini dengan mata yang tajam. Lumpur, Anda lihat, bukan tanah London biasa, melainkan warna kemerahan yang khas dari tanah kaya besi yang hanya ditemukan di sekitar Hampstead Heath. Dan namun, keausan pada sol menunjukkan gaya berjalan yang lebih cocok untuk batu lapis Whitechapel daripada lereng lembut Heath.<br/><br/>Sekarang, perhatikan tali! Mereka diikat dengan simpul tertentu yang disukai oleh mereka yang berada dalam profesi medis—tanpa diragukan lagi kebiasaan yang diperoleh selama bertahun-tahun mengikat gaun bedah. Tetapi tanda goresan pada kotak jari kaki menceritakan kisah yang berbeda: mereka konsisten dengan gerakan menendang yang mungkin digunakan dalam seni bela diri, khususnya Baritsu.<br/><br/>Kami dapat menyimpulkan, kemudian, bahwa pemilik sepatu yang tidak ada adalah seorang dokter, mungkin seorang ahli bedah, yang tinggal di Whitechapel tetapi sering mengunjungi Hampstead Heath—mungkin untuk latihan Baritsu rahasia, jauh dari mata yang ingin tahu. Sebuah kasus yang paling menarik, Watson! Kami harus tergesa-gesa; permainannya dimulai! |
    
</section>

---

<CardGroup cols={3}>
  <Card title="Bekerja dengan Pesan" icon="messages" href="/docs/id/build-with-claude/working-with-messages">
    Lihat lebih banyak contoh pengisian sebelumnya dan pola Messages API lainnya.
  </Card>
  <Card title="Perpustakaan prompt" icon="link" href="/docs/id/resources/prompt-library/library">
    Dapatkan inspirasi dari pilihan prompt yang dikurasi untuk berbagai tugas dan kasus penggunaan.
  </Card>
  <Card title="Tutorial prompt GitHub" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    Tutorial yang penuh dengan contoh yang mencakup konsep prompt engineering yang ditemukan di dokumen kami.
  </Card>
  <Card title="Tutorial prompt Google Sheets" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    Versi yang lebih ringan dari tutorial prompt engineering kami melalui spreadsheet interaktif.
  </Card>
</CardGroup>