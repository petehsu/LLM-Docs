# Effort

Kontrol berapa banyak token yang digunakan Claude saat merespons dengan parameter effort, menukar antara kelengkapan respons dan efisiensi token.

---

Parameter effort memungkinkan Anda mengontrol seberapa bersemangat Claude dalam menghabiskan token saat merespons permintaan. Ini memberi Anda kemampuan untuk menukar antara kelengkapan respons dan efisiensi token, semuanya dengan satu model.

<Note>
  Parameter effort saat ini dalam beta dan hanya didukung oleh Claude Opus 4.5.

  Anda harus menyertakan [beta header](/docs/id/api/beta-headers) `effort-2025-11-24` saat menggunakan fitur ini.
</Note>

## Cara kerja effort

Secara default, Claude menggunakan effort maksimum—menghabiskan sebanyak token yang diperlukan untuk hasil terbaik yang mungkin. Dengan menurunkan tingkat effort, Anda dapat menginstruksikan Claude untuk lebih konservatif dengan penggunaan token, mengoptimalkan kecepatan dan biaya sambil menerima beberapa pengurangan dalam kemampuan.

<Tip>
Mengatur `effort` ke `"high"` menghasilkan perilaku yang persis sama dengan menghilangkan parameter `effort` sepenuhnya.
</Tip>

Parameter effort mempengaruhi **semua token** dalam respons, termasuk:

- Respons teks dan penjelasan
- Panggilan alat dan argumen fungsi
- Pemikiran yang diperluas (saat diaktifkan)

Pendekatan ini memiliki dua keuntungan utama:

1. Tidak memerlukan pemikiran untuk diaktifkan agar dapat menggunakannya.
2. Dapat mempengaruhi semua pengeluaran token termasuk panggilan alat. Misalnya, effort yang lebih rendah berarti Claude membuat lebih sedikit panggilan alat. Ini memberikan tingkat kontrol yang jauh lebih besar atas efisiensi.

### Tingkat effort

| Level    | Deskripsi                                                                                                                      | Kasus penggunaan umum                                                                      |
| -------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `high`   | Kemampuan maksimum. Claude menggunakan sebanyak token yang diperlukan untuk hasil terbaik yang mungkin. Setara dengan tidak mengatur parameter.  | Penalaran kompleks, masalah coding yang sulit, tugas agentic                           |
| `medium` | Pendekatan seimbang dengan penghematan token sedang. | Tugas agentic yang memerlukan keseimbangan kecepatan, biaya, dan kinerja                                                         |
| `low`    | Paling efisien. Penghematan token yang signifikan dengan beberapa pengurangan kemampuan. | Tugas yang lebih sederhana yang membutuhkan kecepatan terbaik dan biaya terendah, seperti subagents                     |

## Penggunaan dasar

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-opus-4-5-20251101",
    betas=["effort-2025-11-24"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Analyze the trade-offs between microservices and monolithic architectures"
    }],
    output_config={
        "effort": "medium"
    }
)

print(response.content[0].text)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.beta.messages.create({
  model: "claude-opus-4-5-20251101",
  betas: ["effort-2025-11-24"],
  max_tokens: 4096,
  messages: [{
    role: "user",
    content: "Analyze the trade-offs between microservices and monolithic architectures"
  }],
  output_config: {
    effort: "medium"
  }
});

console.log(response.content[0].text);
```

```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: effort-2025-11-24" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-opus-4-5-20251101",
        "max_tokens": 4096,
        "messages": [{
            "role": "user",
            "content": "Analyze the trade-offs between microservices and monolithic architectures"
        }],
        "output_config": {
            "effort": "medium"
        }
    }'
```

</CodeGroup>

## Kapan saya harus menyesuaikan parameter effort?

- Gunakan **high effort** (default) ketika Anda membutuhkan pekerjaan terbaik Claude—penalaran kompleks, analisis bernuansa, masalah coding yang sulit, atau tugas apa pun di mana kualitas adalah prioritas utama.
- Gunakan **medium effort** sebagai opsi seimbang ketika Anda menginginkan kinerja solid tanpa pengeluaran token penuh dari high effort.
- Gunakan **low effort** ketika Anda mengoptimalkan untuk kecepatan (karena Claude menjawab dengan lebih sedikit token) atau biaya—misalnya, tugas klasifikasi sederhana, pencarian cepat, atau kasus penggunaan volume tinggi di mana peningkatan kualitas marginal tidak membenarkan latensi atau pengeluaran tambahan.

## Effort dengan penggunaan alat

Saat menggunakan alat, parameter effort mempengaruhi penjelasan di sekitar panggilan alat dan panggilan alat itu sendiri. Tingkat effort yang lebih rendah cenderung:

- Menggabungkan beberapa operasi menjadi lebih sedikit panggilan alat
- Membuat lebih sedikit panggilan alat
- Melanjutkan langsung ke tindakan tanpa pembukaan
- Menggunakan pesan konfirmasi yang ringkas setelah penyelesaian

Tingkat effort yang lebih tinggi mungkin:

- Membuat lebih banyak panggilan alat
- Menjelaskan rencana sebelum mengambil tindakan
- Memberikan ringkasan perubahan yang terperinci
- Menyertakan komentar kode yang lebih komprehensif

## Effort dengan pemikiran yang diperluas

Parameter effort bekerja bersama dengan anggaran token pemikiran ketika pemikiran yang diperluas diaktifkan. Kedua kontrol ini melayani tujuan yang berbeda:

- **Parameter effort**: Mengontrol bagaimana Claude menghabiskan semua token—termasuk token pemikiran, respons teks, dan panggilan alat
- **Anggaran token pemikiran**: Menetapkan batas maksimum pada token pemikiran secara khusus

Parameter effort dapat digunakan dengan atau tanpa pemikiran yang diperluas diaktifkan. Ketika keduanya dikonfigurasi:

1. Pertama tentukan tingkat effort yang sesuai untuk tugas Anda
2. Kemudian atur anggaran token pemikiran berdasarkan kompleksitas tugas

Untuk kinerja terbaik pada tugas penalaran kompleks, gunakan high effort (default) dengan anggaran token pemikiran yang tinggi. Ini memungkinkan Claude untuk berpikir secara menyeluruh dan memberikan respons yang komprehensif.

## Praktik terbaik

1. **Mulai dengan high**: Gunakan tingkat effort yang lebih rendah untuk menukar kinerja dengan efisiensi token.
2. **Gunakan low untuk tugas yang sensitif terhadap kecepatan atau sederhana**: Ketika latensi penting atau tugas sederhana, low effort dapat secara signifikan mengurangi waktu respons dan biaya.
3. **Uji kasus penggunaan Anda**: Dampak tingkat effort bervariasi menurut jenis tugas. Evaluasi kinerja pada kasus penggunaan spesifik Anda sebelum menerapkan.
4. **Pertimbangkan effort dinamis**: Sesuaikan effort berdasarkan kompleksitas tugas. Kueri sederhana mungkin memerlukan low effort sementara coding agentic dan penalaran kompleks mendapat manfaat dari high effort.