# Tips pemikiran diperpanjang

Panduan lanjutan untuk memaksimalkan fitur pemikiran diperpanjang Claude dengan strategi dan teknik yang efektif.

---

Panduan ini menyediakan strategi dan teknik lanjutan untuk memaksimalkan fitur pemikiran diperpanjang Claude. Pemikiran diperpanjang memungkinkan Claude untuk mengatasi masalah kompleks langkah demi langkah, meningkatkan kinerja pada tugas-tugas sulit.

Lihat [Model pemikiran diperpanjang](/docs/id/about-claude/models/extended-thinking-models) untuk panduan dalam memutuskan kapan menggunakan pemikiran diperpanjang.

## Sebelum memulai

Panduan ini mengasumsikan bahwa Anda telah memutuskan untuk menggunakan mode pemikiran diperpanjang dan telah meninjau langkah-langkah dasar kami tentang [cara memulai dengan pemikiran diperpanjang](/docs/id/about-claude/models/extended-thinking-models#getting-started-with-extended-thinking-models) serta [panduan implementasi pemikiran diperpanjang](/docs/id/build-with-claude/extended-thinking) kami.

### Pertimbangan teknis untuk pemikiran diperpanjang

- Token pemikiran memiliki anggaran minimum 1024 token. Kami merekomendasikan Anda memulai dengan anggaran pemikiran minimum dan meningkatkan secara bertahap untuk menyesuaikan berdasarkan kebutuhan dan kompleksitas tugas Anda.
- Untuk beban kerja di mana anggaran pemikiran optimal di atas 32K, kami merekomendasikan Anda menggunakan [pemrosesan batch](/docs/id/build-with-claude/batch-processing) untuk menghindari masalah jaringan. Permintaan yang mendorong model untuk berpikir di atas 32K token menyebabkan permintaan yang berjalan lama yang mungkin mengalami timeout sistem dan batas koneksi terbuka.
- Pemikiran diperpanjang berkinerja terbaik dalam bahasa Inggris, meskipun output akhir dapat dalam [bahasa apa pun yang didukung Claude](/docs/id/build-with-claude/multilingual-support).
- Jika Anda memerlukan pemikiran di bawah anggaran minimum, kami merekomendasikan menggunakan mode standar, dengan pemikiran dimatikan, dengan prompting chain-of-thought tradisional dengan tag XML (seperti `<thinking>`). Lihat [prompting chain of thought](/docs/id/build-with-claude/prompt-engineering/chain-of-thought).

## Teknik prompting untuk pemikiran diperpanjang

### Gunakan instruksi umum terlebih dahulu, kemudian troubleshoot dengan instruksi langkah demi langkah yang lebih detail

Claude sering berkinerja lebih baik dengan instruksi tingkat tinggi untuk hanya berpikir mendalam tentang suatu tugas daripada panduan preskriptif langkah demi langkah. Kreativitas model dalam mendekati masalah mungkin melebihi kemampuan manusia untuk meresepkan proses pemikiran yang optimal.

Misalnya, alih-alih:

<CodeGroup>
```text User
Pikirkan masalah matematika ini langkah demi langkah:
1. Pertama, identifikasi variabel
2. Kemudian, susun persamaan
3. Selanjutnya, selesaikan untuk x
...
```
</CodeGroup>

Pertimbangkan:

<CodeGroup>
```text User
Tolong pikirkan masalah matematika ini secara menyeluruh dan sangat detail.
Pertimbangkan beberapa pendekatan dan tunjukkan penalaran lengkap Anda.
Coba metode yang berbeda jika pendekatan pertama Anda tidak berhasil.
```
/>
</CodeGroup>

<TryInConsoleButton
  userPrompt={
    `Tolong pikirkan masalah matematika ini secara menyeluruh dan sangat detail.
Pertimbangkan beberapa pendekatan dan tunjukkan penalaran lengkap Anda.
Coba metode yang berbeda jika pendekatan pertama Anda tidak berhasil.`
  }
  thinkingBudgetTokens={16000}
>
  Coba di Console
</TryInConsoleButton>

Meskipun demikian, Claude masih dapat mengikuti langkah-langkah eksekusi terstruktur yang kompleks ketika diperlukan. Model dapat menangani daftar yang lebih panjang dengan instruksi yang lebih kompleks daripada versi sebelumnya. Kami merekomendasikan Anda memulai dengan instruksi yang lebih umum, kemudian membaca output pemikiran Claude dan beriterasi untuk memberikan instruksi yang lebih spesifik untuk mengarahkan pemikirannya dari sana.

### Multishot prompting dengan pemikiran diperpanjang

[Multishot prompting](/docs/id/build-with-claude/prompt-engineering/multishot-prompting) bekerja dengan baik dengan pemikiran diperpanjang. Ketika Anda memberikan Claude contoh cara berpikir melalui masalah, ia akan mengikuti pola penalaran serupa dalam blok pemikiran diperpanjangnya.

Anda dapat menyertakan contoh few-shot dalam prompt Anda dalam skenario pemikiran diperpanjang dengan menggunakan tag XML seperti `<thinking>` atau `<scratchpad>` untuk menunjukkan pola kanonik pemikiran diperpanjang dalam contoh tersebut.

Claude akan menggeneralisasi pola ke proses pemikiran diperpanjang formal. Namun, mungkin Anda akan mendapatkan hasil yang lebih baik dengan memberikan Claude kebebasan untuk berpikir dengan cara yang dianggapnya terbaik.

Contoh:

<CodeGroup>
```text User
Saya akan menunjukkan cara menyelesaikan masalah matematika, kemudian saya ingin Anda menyelesaikan yang serupa.

Masalah 1: Berapa 15% dari 80?

<thinking>
Untuk mencari 15% dari 80:
1. Ubah 15% menjadi desimal: 15% = 0,15
2. Kalikan: 0,15 × 80 = 12
</thinking>

Jawabannya adalah 12.

Sekarang selesaikan yang ini:
Masalah 2: Berapa 35% dari 240?
```
/>
</CodeGroup>

<TryInConsoleButton
  userPrompt={
    `Saya akan menunjukkan cara menyelesaikan masalah matematika, kemudian saya ingin Anda menyelesaikan yang serupa.

Masalah 1: Berapa 15% dari 80?

<thinking>
Untuk mencari 15% dari 80:
1. Ubah 15% menjadi desimal: 15% = 0,15
2. Kalikan: 0,15 × 80 = 12
</thinking>

Jawabannya adalah 12.

Sekarang selesaikan yang ini:
Masalah 2: Berapa 35% dari 240?`
  }
  thinkingBudgetTokens={16000} 
>
  Coba di Console
</TryInConsoleButton>

### Memaksimalkan mengikuti instruksi dengan pemikiran diperpanjang
Claude menunjukkan peningkatan signifikan dalam mengikuti instruksi ketika pemikiran diperpanjang diaktifkan. Model biasanya:
1. Bernalar tentang instruksi di dalam blok pemikiran diperpanjang
2. Mengeksekusi instruksi tersebut dalam respons

Untuk memaksimalkan mengikuti instruksi:
- Jelas dan spesifik tentang apa yang Anda inginkan
- Untuk instruksi kompleks, pertimbangkan untuk memecahnya menjadi langkah-langkah bernomor yang harus dikerjakan Claude secara metodis
- Berikan Claude anggaran yang cukup untuk memproses instruksi sepenuhnya dalam pemikiran diperpanjangnya

### Menggunakan pemikiran diperpanjang untuk debug dan mengarahkan perilaku Claude
Anda dapat menggunakan output pemikiran Claude untuk debug logika Claude, meskipun metode ini tidak selalu dapat diandalkan dengan sempurna.

Untuk memanfaatkan metodologi ini dengan sebaik-baiknya, kami merekomendasikan tips berikut:
- Kami tidak merekomendasikan mengirimkan kembali pemikiran diperpanjang Claude dalam blok teks pengguna, karena ini tidak meningkatkan kinerja dan mungkin benar-benar menurunkan hasil.
- Prefilling pemikiran diperpanjang secara eksplisit tidak diizinkan, dan mengubah teks output model secara manual yang mengikuti blok pemikirannya kemungkinan akan menurunkan hasil karena kebingungan model.

Ketika pemikiran diperpanjang dimatikan, [prefill](/docs/id/build-with-claude/prompt-engineering/prefill-claudes-response) teks respons `assistant` standar masih diizinkan.

<Note>
Terkadang Claude mungkin mengulangi pemikiran diperpanjangnya dalam teks output assistant. Jika Anda menginginkan respons yang bersih, instruksikan Claude untuk tidak mengulangi pemikiran diperpanjangnya dan hanya mengeluarkan jawaban.
</Note>

### Memanfaatkan output panjang dan pemikiran bentuk panjang dengan sebaik-baiknya

Untuk kasus penggunaan generasi dataset, coba prompt seperti "Tolong buat tabel yang sangat detail tentang..." untuk menghasilkan dataset yang komprehensif.

Untuk kasus penggunaan seperti generasi konten detail di mana Anda mungkin ingin menghasilkan blok pemikiran diperpanjang yang lebih panjang dan respons yang lebih detail, coba tips ini:
- Tingkatkan panjang pemikiran diperpanjang maksimum DAN secara eksplisit minta output yang lebih panjang
- Untuk output yang sangat panjang (20.000+ kata), minta outline detail dengan jumlah kata hingga tingkat paragraf. Kemudian minta Claude untuk mengindeks paragrafnya ke outline dan mempertahankan jumlah kata yang ditentukan

<Warning>
Kami tidak merekomendasikan Anda mendorong Claude untuk mengeluarkan lebih banyak token demi mengeluarkan token. Sebaliknya, kami mendorong Anda untuk memulai dengan anggaran pemikiran kecil dan meningkatkan sesuai kebutuhan untuk menemukan pengaturan optimal untuk kasus penggunaan Anda.
</Warning>

Berikut adalah contoh kasus penggunaan di mana Claude unggul karena pemikiran diperpanjang yang lebih panjang:

  <section title="Masalah STEM kompleks">

    Masalah STEM kompleks memerlukan Claude untuk membangun model mental, menerapkan pengetahuan khusus, dan bekerja melalui langkah-langkah logis berurutan—proses yang mendapat manfaat dari waktu penalaran yang lebih lama.
    
    <Tabs>
      <Tab title="Prompt standar">
        <CodeGroup>
        ```text User
        Tulis skrip python untuk bola kuning yang memantul dalam persegi,
        pastikan untuk menangani deteksi tabrakan dengan benar.
        Buat persegi berputar perlahan.
        ```
        />
        </CodeGroup>
        
        <TryInConsoleButton
          userPrompt={
            `Tulis skrip python untuk bola kuning yang memantul dalam persegi,
pastikan untuk menangani deteksi tabrakan dengan benar.
Buat persegi berputar perlahan.`
          }
          thinkingBudgetTokens={16000}
        >
          Coba di Console
        </TryInConsoleButton>
        <Note>
        Tugas yang lebih sederhana ini biasanya menghasilkan hanya sekitar beberapa detik waktu berpikir.
        </Note>
      </Tab>
      <Tab title="Prompt yang ditingkatkan">
        <CodeGroup>
        ```text User
        Tulis skrip Python untuk bola kuning yang memantul dalam tesseract,
        pastikan untuk menangani deteksi tabrakan dengan benar.
        Buat tesseract berputar perlahan.
        Pastikan bola tetap dalam tesseract.
        ```
        />
        </CodeGroup>
        
        <TryInConsoleButton
          userPrompt={
            `Tulis skrip Python untuk bola kuning yang memantul dalam tesseract,
pastikan untuk menangani deteksi tabrakan dengan benar.
Buat tesseract berputar perlahan.
Pastikan bola tetap dalam tesseract.`
          }
          thinkingBudgetTokens={16000}
        >
          Coba di Console
        </TryInConsoleButton>
        <Note>
        Tantangan visualisasi 4D yang kompleks ini memanfaatkan waktu pemikiran diperpanjang yang panjang dengan sebaik-baiknya saat Claude bekerja melalui kompleksitas matematika dan pemrograman.
        </Note>
      </Tab>
    </Tabs>
  
</section>
  
  <section title="Masalah optimisasi kendala">

    Optimisasi kendala menantang Claude untuk memenuhi beberapa persyaratan yang bersaing secara bersamaan, yang paling baik dicapai ketika memungkinkan waktu pemikiran diperpanjang yang panjang sehingga model dapat secara metodis mengatasi setiap kendala.
    
    <Tabs>
      <Tab title="Prompt standar">
        <CodeGroup>
        ```text User
        Rencanakan liburan seminggu ke Jepang.
        ```
        />
        </CodeGroup>
        
        <TryInConsoleButton
          userPrompt="Rencanakan liburan seminggu ke Jepang."
          thinkingBudgetTokens={16000}
        >
          Coba di Console
        </TryInConsoleButton>
        <Note>
        Permintaan terbuka ini biasanya menghasilkan hanya sekitar beberapa detik waktu berpikir.
        </Note>
      </Tab>
      <Tab title="Prompt yang ditingkatkan">
        <CodeGroup>
        ```text User
        Rencanakan perjalanan 7 hari ke Jepang dengan kendala berikut:
        - Anggaran $2.500
        - Harus mencakup Tokyo dan Kyoto
        - Perlu mengakomodasi diet vegetarian
        - Preferensi untuk pengalaman budaya daripada berbelanja
        - Harus mencakup satu hari hiking
        - Tidak lebih dari 2 jam perjalanan antar lokasi per hari
        - Perlu waktu luang setiap sore untuk panggilan kembali ke rumah
        - Harus menghindari keramaian jika memungkinkan
        ```
        />
        </CodeGroup>
        
        <TryInConsoleButton
          userPrompt={
            `Rencanakan perjalanan 7 hari ke Jepang dengan kendala berikut:
- Anggaran $2.500
- Harus mencakup Tokyo dan Kyoto
- Perlu mengakomodasi diet vegetarian
- Preferensi untuk pengalaman budaya daripada berbelanja
- Harus mencakup satu hari hiking
- Tidak lebih dari 2 jam perjalanan antar lokasi per hari
- Perlu waktu luang setiap sore untuk panggilan kembali ke rumah
- Harus menghindari keramaian jika memungkinkan`
          }
          thinkingBudgetTokens={16000}
        >
          Coba di Console
        </TryInConsoleButton>
        <Note>
        Dengan beberapa kendala untuk diseimbangkan, Claude secara alami akan berkinerja terbaik ketika diberi lebih banyak ruang untuk memikirkan cara memenuhi semua persyaratan secara optimal.
        </Note>
      </Tab>
    </Tabs>
  
</section>
  
  <section title="Kerangka pemikiran">

    Kerangka pemikiran terstruktur memberikan Claude metodologi eksplisit untuk diikuti, yang mungkin bekerja terbaik ketika Claude diberi ruang pemikiran diperpanjang yang panjang untuk mengikuti setiap langkah.
    
    <Tabs>
      <Tab title="Prompt standar">
        <CodeGroup>
        ```text User
        Kembangkan strategi komprehensif untuk Microsoft
        memasuki pasar obat yang dipersonalisasi pada tahun 2027.
        ```
        />
        </CodeGroup>
        
        <TryInConsoleButton
          userPrompt={
            `Kembangkan strategi komprehensif untuk Microsoft
memasuki pasar obat yang dipersonalisasi pada tahun 2027.`
          }
          thinkingBudgetTokens={16000}
        >
          Coba di Console
        </TryInConsoleButton>
        <Note>
        Pertanyaan strategis luas ini biasanya menghasilkan hanya sekitar beberapa detik waktu berpikir.
        </Note>
      </Tab>
      <Tab title="Prompt yang ditingkatkan">
        <CodeGroup>
        ```text User
        Kembangkan strategi komprehensif untuk Microsoft memasuki
        pasar obat yang dipersonalisasi pada tahun 2027.
        
        Mulai dengan:
        1. Kanvas Strategi Blue Ocean
        2. Terapkan Lima Kekuatan Porter untuk mengidentifikasi tekanan kompetitif
        
        Selanjutnya, lakukan latihan perencanaan skenario dengan empat
        masa depan yang berbeda berdasarkan variabel regulasi dan teknologi.
        
        Untuk setiap skenario:
        - Kembangkan respons strategis menggunakan Matriks Ansoff
        
        Akhirnya, terapkan kerangka Tiga Horizon untuk:
        - Memetakan jalur transisi
        - Mengidentifikasi inovasi disruptif potensial di setiap tahap
        ```
        />
        </CodeGroup>
        
        <TryInConsoleButton
          userPrompt={
            `Kembangkan strategi komprehensif untuk Microsoft memasuki
pasar obat yang dipersonalisasi pada tahun 2027.

Mulai dengan:
1. Kanvas Strategi Blue Ocean
2. Terapkan Lima Kekuatan Porter untuk mengidentifikasi tekanan kompetitif

Selanjutnya, lakukan latihan perencanaan skenario dengan empat
masa depan yang berbeda berdasarkan variabel regulasi dan teknologi.

Untuk setiap skenario:
- Kembangkan respons strategis menggunakan Matriks Ansoff

Akhirnya, terapkan kerangka Tiga Horizon untuk:
- Memetakan jalur transisi
- Mengidentifikasi inovasi disruptif potensial di setiap tahap`
          }
          thinkingBudgetTokens={16000}
        >
          Coba di Console
        </TryInConsoleButton>
        <Note>
        Dengan menentukan beberapa kerangka analitis yang harus diterapkan secara berurutan, waktu berpikir secara alami meningkat saat Claude bekerja melalui setiap kerangka secara metodis.
        </Note>
      </Tab>
    </Tabs>
  
</section>

### Minta Claude merefleksikan dan memeriksa pekerjaannya untuk meningkatkan konsistensi dan penanganan kesalahan
Anda dapat menggunakan prompting bahasa alami sederhana untuk meningkatkan konsistensi dan mengurangi kesalahan:
1. Minta Claude untuk memverifikasi pekerjaannya dengan tes sederhana sebelum menyatakan tugas selesai
2. Instruksikan model untuk menganalisis apakah langkah sebelumnya mencapai hasil yang diharapkan
3. Untuk tugas coding, minta Claude untuk menjalankan kasus uji dalam pemikiran diperpanjangnya

Contoh:

<CodeGroup>
```text User
Tulis fungsi untuk menghitung faktorial dari suatu angka.
Sebelum Anda selesai, tolong verifikasi solusi Anda dengan kasus uji untuk:
- n=0
- n=1
- n=5
- n=10
Dan perbaiki masalah apa pun yang Anda temukan.
```
/>
</CodeGroup>

<TryInConsoleButton
  userPrompt={
    `Tulis fungsi untuk menghitung faktorial dari suatu angka.
Sebelum Anda selesai, tolong verifikasi solusi Anda dengan kasus uji untuk:
- n=0
- n=1
- n=5
- n=10
Dan perbaiki masalah apa pun yang Anda temukan.`
  }
  thinkingBudgetTokens={16000}
>
  Coba di Console
</TryInConsoleButton>

## Langkah selanjutnya

<CardGroup>
  <Card title="Cookbook pemikiran diperpanjang" icon="book" href="https://github.com/anthropics/anthropic-cookbook/tree/main/extended_thinking">
    Jelajahi contoh praktis pemikiran diperpanjang dalam cookbook kami.
  </Card>
  <Card title="Panduan pemikiran diperpanjang" icon="code" href="/docs/id/build-with-claude/extended-thinking">
    Lihat dokumentasi teknis lengkap untuk mengimplementasikan pemikiran diperpanjang.
  </Card>
</CardGroup>