# Jendela konteks

Memahami jendela konteks dan bagaimana token dikelola dalam percakapan multi-putaran dengan Claude

---

## Memahami jendela konteks

"Jendela konteks" mengacu pada seluruh jumlah teks yang dapat dilihat dan direferensikan oleh model bahasa saat menghasilkan teks baru ditambah teks baru yang dihasilkannya. Ini berbeda dari corpus data besar tempat model bahasa dilatih, dan sebaliknya mewakili "memori kerja" untuk model. Jendela konteks yang lebih besar memungkinkan model untuk memahami dan merespons prompt yang lebih kompleks dan panjang, sementara jendela konteks yang lebih kecil dapat membatasi kemampuan model untuk menangani prompt yang lebih panjang atau mempertahankan koherensi selama percakapan yang diperpanjang.

Diagram di bawah mengilustrasikan perilaku jendela konteks standar untuk permintaan API<sup>1</sup>:

![Context window diagram](/docs/images/context-window.svg)

_<sup>1</sup>Untuk antarmuka obrolan, seperti untuk [claude.ai](https://claude.ai/), jendela konteks juga dapat diatur pada sistem "first in, first out" yang bergulir._

* **Akumulasi token progresif:** Saat percakapan maju melalui putaran, setiap pesan pengguna dan respons asisten terakumulasi dalam jendela konteks. Putaran sebelumnya dipertahankan sepenuhnya.
* **Pola pertumbuhan linier:** Penggunaan konteks tumbuh secara linier dengan setiap putaran, dengan putaran sebelumnya dipertahankan sepenuhnya.
* **Kapasitas token 200K:** Jendela konteks total yang tersedia (200.000 token) mewakili kapasitas maksimum untuk menyimpan riwayat percakapan dan menghasilkan output baru dari Claude.
* **Aliran input-output:** Setiap putaran terdiri dari:
  - **Fase input:** Berisi semua riwayat percakapan sebelumnya ditambah pesan pengguna saat ini
  - **Fase output:** Menghasilkan respons teks yang menjadi bagian dari input di masa depan

## Jendela konteks dengan pemikiran yang diperpanjang

Saat menggunakan [pemikiran yang diperpanjang](/docs/id/build-with-claude/extended-thinking), semua token input dan output, termasuk token yang digunakan untuk pemikiran, dihitung terhadap batas jendela konteks, dengan beberapa nuansa dalam situasi multi-putaran.

Token anggaran pemikiran adalah subset dari parameter `max_tokens` Anda, ditagih sebagai token output, dan dihitung terhadap batas laju.

Namun, blok pemikiran sebelumnya secara otomatis dilepas dari perhitungan jendela konteks oleh API Claude dan bukan bagian dari riwayat percakapan yang "dilihat" model untuk putaran berikutnya, melestarikan kapasitas token untuk konten percakapan aktual.

Diagram di bawah mendemonstrasikan manajemen token khusus saat pemikiran yang diperpanjang diaktifkan:

![Context window diagram with extended thinking](/docs/images/context-window-thinking.svg)

* **Melepas pemikiran yang diperpanjang:** Blok pemikiran yang diperpanjang (ditampilkan dalam abu-abu gelap) dihasilkan selama fase output setiap putaran, **tetapi tidak dibawa maju sebagai token input untuk putaran berikutnya**. Anda tidak perlu melepas blok pemikiran sendiri. API Claude secara otomatis melakukan ini untuk Anda jika Anda mengirimnya kembali.
* **Detail implementasi teknis:**
  - API secara otomatis mengecualikan blok pemikiran dari putaran sebelumnya saat Anda mengirimnya kembali sebagai bagian dari riwayat percakapan.
  - Token pemikiran yang diperpanjang ditagih sebagai token output hanya sekali, selama generasinya.
  - Perhitungan jendela konteks yang efektif menjadi: `context_window = (input_tokens - previous_thinking_tokens) + current_turn_tokens`.
  - Token pemikiran mencakup blok `thinking` dan blok `redacted_thinking`.

Arsitektur ini hemat token dan memungkinkan penalaran ekstensif tanpa pemborosan token, karena blok pemikiran dapat memiliki panjang yang substansial.

<Note>
Anda dapat membaca lebih lanjut tentang jendela konteks dan pemikiran yang diperpanjang dalam [panduan pemikiran yang diperpanjang](/docs/id/build-with-claude/extended-thinking) kami.
</Note>

## Jendela konteks dengan pemikiran yang diperpanjang dan penggunaan alat

Diagram di bawah mengilustrasikan manajemen token jendela konteks saat menggabungkan pemikiran yang diperpanjang dengan penggunaan alat:

![Context window diagram with extended thinking and tool use](/docs/images/context-window-thinking-tools.svg)

<Steps>
  <Step title="Arsitektur putaran pertama">
    - **Komponen input:** Konfigurasi alat dan pesan pengguna
    - **Komponen output:** Pemikiran yang diperpanjang + respons teks + permintaan penggunaan alat
    - **Perhitungan token:** Semua komponen input dan output dihitung terhadap jendela konteks, dan semua komponen output ditagih sebagai token output.
  </Step>
  <Step title="Penanganan hasil alat (putaran 2)">
    - **Komponen input:** Setiap blok di putaran pertama serta `tool_result`. Blok pemikiran yang diperpanjang **harus** dikembalikan dengan hasil alat yang sesuai. Ini adalah satu-satunya kasus di mana Anda **harus** mengembalikan blok pemikiran.
    - **Komponen output:** Setelah hasil alat telah dilewatkan kembali ke Claude, Claude akan merespons hanya dengan teks (tidak ada pemikiran yang diperpanjang tambahan sampai pesan `user` berikutnya).
    - **Perhitungan token:** Semua komponen input dan output dihitung terhadap jendela konteks, dan semua komponen output ditagih sebagai token output.
  </Step>
  <Step title="Langkah Ketiga">
    - **Komponen input:** Semua input dan output dari putaran sebelumnya dibawa maju dengan pengecualian blok pemikiran, yang dapat dijatuhkan sekarang bahwa Claude telah menyelesaikan seluruh siklus penggunaan alat. API akan secara otomatis melepas blok pemikiran untuk Anda jika Anda mengirimnya kembali, atau Anda dapat merasa bebas untuk melepasnya sendiri pada tahap ini. Ini juga di mana Anda akan menambahkan putaran `User` berikutnya.
    - **Komponen output:** Karena ada putaran `User` baru di luar siklus penggunaan alat, Claude akan menghasilkan blok pemikiran yang diperpanjang baru dan melanjutkan dari sana.
    - **Perhitungan token:** Token pemikiran sebelumnya secara otomatis dilepas dari perhitungan jendela konteks. Semua blok sebelumnya lainnya masih dihitung sebagai bagian dari jendela token, dan blok pemikiran di putaran `Assistant` saat ini dihitung sebagai bagian dari jendela konteks. 
  </Step>
</Steps>

* **Pertimbangan untuk penggunaan alat dengan pemikiran yang diperpanjang:**
  - Saat memposting hasil alat, seluruh blok pemikiran yang tidak dimodifikasi yang menyertai permintaan alat spesifik itu (termasuk bagian tanda tangan/redaksi) harus disertakan.
  - Perhitungan jendela konteks yang efektif untuk pemikiran yang diperpanjang dengan penggunaan alat menjadi: `context_window = input_tokens + current_turn_tokens`.
  - Sistem menggunakan tanda tangan kriptografi untuk memverifikasi keaslian blok pemikiran. Gagal melestarikan blok pemikiran selama penggunaan alat dapat mengganggu kontinuitas penalaran Claude. Jadi, jika Anda memodifikasi blok pemikiran, API akan mengembalikan kesalahan.

<Note>
Model Claude 4 mendukung [pemikiran yang disisipi](/docs/id/build-with-claude/extended-thinking#interleaved-thinking), yang memungkinkan Claude untuk berpikir di antara panggilan alat dan melakukan penalaran yang lebih canggih setelah menerima hasil alat.

Claude Sonnet 3.7 tidak mendukung pemikiran yang disisipi, jadi tidak ada penyisipan pemikiran yang diperpanjang dan panggilan alat tanpa putaran pengguna non-`tool_result` di antaranya.

Untuk informasi lebih lanjut tentang menggunakan alat dengan pemikiran yang diperpanjang, lihat [panduan pemikiran yang diperpanjang](/docs/id/build-with-claude/extended-thinking#extended-thinking-with-tool-use) kami.
</Note>

## Jendela konteks token 1M

Claude Sonnet 4 dan 4.5 mendukung jendela konteks token 1 juta. Jendela konteks yang diperpanjang ini memungkinkan Anda memproses dokumen yang jauh lebih besar, mempertahankan percakapan yang lebih panjang, dan bekerja dengan basis kode yang lebih ekstensif.

<Note>
Jendela konteks token 1M saat ini dalam beta untuk organisasi di [tingkat penggunaan](/docs/id/api/rate-limits) 4 dan organisasi dengan batas laju khusus. Jendela konteks token 1M hanya tersedia untuk Claude Sonnet 4 dan Sonnet 4.5.
</Note>

Untuk menggunakan jendela konteks token 1M, sertakan [header beta](/docs/id/api/beta-headers) `context-1m-2025-08-07` dalam permintaan API Anda:

<CodeGroup>

```python Python
from anthropic import Anthropic

client = Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Process this large document..."}
    ],
    betas=["context-1m-2025-08-07"]
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const msg = await anthropic.beta.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 1024,
  messages: [
    { role: 'user', content: 'Process this large document...' }
  ],
  betas: ['context-1m-2025-08-07']
});
```

```bash cURL
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: context-1m-2025-08-07" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "Process this large document..."}
    ]
  }'
```

</CodeGroup>

**Pertimbangan penting:**
- **Status beta**: Ini adalah fitur beta yang dapat berubah. Fitur dan harga dapat dimodifikasi atau dihapus dalam rilis mendatang.
- **Persyaratan tingkat penggunaan**: Jendela konteks token 1M tersedia untuk organisasi di [tingkat penggunaan](/docs/id/api/rate-limits) 4 dan organisasi dengan batas laju khusus. Organisasi tingkat lebih rendah harus maju ke tingkat penggunaan 4 untuk mengakses fitur ini.
- **Ketersediaan**: Jendela konteks token 1M saat ini tersedia di Claude API, [Microsoft Foundry](/docs/id/build-with-claude/claude-in-microsoft-foundry), [Amazon Bedrock](/docs/id/build-with-claude/claude-on-amazon-bedrock), dan [Google Cloud's Vertex AI](/docs/id/build-with-claude/claude-on-vertex-ai). 
- **Harga**: Permintaan yang melebihi 200K token secara otomatis dikenakan biaya dengan tarif premium (2x input, 1,5x output pricing). Lihat [dokumentasi harga](/docs/id/about-claude/pricing#long-context-pricing) untuk detail.
- **Batas laju**: Permintaan konteks panjang memiliki batas laju khusus. Lihat [dokumentasi batas laju](/docs/id/api/rate-limits#long-context-rate-limits) untuk detail.
- **Pertimbangan multimodal**: Saat memproses sejumlah besar gambar atau pdf, perhatikan bahwa file dapat bervariasi dalam penggunaan token. Saat memasangkan prompt besar dengan sejumlah besar gambar, Anda mungkin mencapai [batas ukuran permintaan](/docs/id/api/overview#request-size-limits).

## Kesadaran konteks di Claude Sonnet 4.5 dan Haiku 4.5

Claude Sonnet 4.5 dan Claude Haiku 4.5 menampilkan **kesadaran konteks**, memungkinkan model ini untuk melacak jendela konteks sisa mereka (yaitu "anggaran token") sepanjang percakapan. Ini memungkinkan Claude untuk menjalankan tugas dan mengelola konteks lebih efektif dengan memahami berapa banyak ruang yang tersedia untuk dikerjakan. Claude secara alami dilatih untuk menggunakan konteks ini dengan tepat untuk bertahan dalam tugas hingga akhir, daripada harus menebak berapa banyak token yang tersisa. Bagi model, kurangnya kesadaran konteks seperti berkompetisi dalam acara memasak tanpa jam. Model Claude 4.5 mengubah ini dengan secara eksplisit menginformasikan model tentang konteks sisanya, sehingga dapat memanfaatkan token yang tersedia secara maksimal. 

**Cara kerjanya:**

Di awal percakapan, Claude menerima informasi tentang jendela konteks totalnya:

```
<budget:token_budget>200000</budget:token_budget>
```

Anggaran diatur ke 200K token (standar), 500K token (Claude.ai Enterprise), atau 1M token (beta, untuk organisasi yang memenuhi syarat).

Setelah setiap panggilan alat, Claude menerima pembaruan tentang kapasitas sisa:

```
<system_warning>Token usage: 35000/200000; 165000 remaining</system_warning>
```

Kesadaran ini membantu Claude menentukan berapa banyak kapasitas yang tersisa untuk pekerjaan dan memungkinkan eksekusi yang lebih efektif pada tugas yang berjalan lama. Token gambar disertakan dalam anggaran ini.

**Manfaat:**

Kesadaran konteks sangat berharga untuk:
- Sesi agen yang berjalan lama yang memerlukan fokus berkelanjutan
- Alur kerja multi-jendela-konteks di mana transisi status penting
- Tugas kompleks yang memerlukan manajemen token yang cermat

Untuk panduan prompt tentang memanfaatkan kesadaran konteks, lihat [panduan praktik terbaik Claude 4](/docs/id/build-with-claude/prompt-engineering/claude-4-best-practices#context-awareness-and-multi-window-workflows) kami.

## Manajemen jendela konteks dengan model Claude yang lebih baru

Dalam model Claude yang lebih baru (mulai dari Claude Sonnet 3.7), jika jumlah token prompt dan token output melebihi jendela konteks model, sistem akan mengembalikan kesalahan validasi daripada secara diam-diam memotong konteks. Perubahan ini memberikan perilaku yang lebih dapat diprediksi tetapi memerlukan manajemen token yang lebih hati-hati.

Untuk merencanakan penggunaan token Anda dan memastikan Anda tetap dalam batas jendela konteks, Anda dapat menggunakan [API penghitungan token](/docs/id/build-with-claude/token-counting) untuk memperkirakan berapa banyak token yang akan digunakan pesan Anda sebelum mengirimnya ke Claude.

Lihat tabel [perbandingan model](/docs/id/about-claude/models/overview#model-comparison-table) kami untuk daftar ukuran jendela konteks menurut model.

# Langkah berikutnya
<CardGroup cols={2}>
  <Card title="Tabel perbandingan model" icon="scales" href="/docs/id/about-claude/models/overview#model-comparison-table">
    Lihat tabel perbandingan model kami untuk daftar ukuran jendela konteks dan harga token input / output menurut model.
  </Card>
  <Card title="Gambaran umum pemikiran yang diperpanjang" icon="settings" href="/docs/id/build-with-claude/extended-thinking">
    Pelajari lebih lanjut tentang cara kerja pemikiran yang diperpanjang dan cara mengimplementasikannya bersama fitur lain seperti penggunaan alat dan penyimpanan prompt.
  </Card>
</CardGroup>