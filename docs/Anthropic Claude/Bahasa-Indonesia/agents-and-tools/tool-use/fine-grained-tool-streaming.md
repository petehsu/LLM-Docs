# Streaming alat berbutir halus

Penggunaan alat sekarang mendukung streaming berbutir halus untuk nilai parameter, mengurangi latensi untuk mulai menerima parameter besar.

---

Penggunaan alat sekarang mendukung [streaming](/docs/id/build-with-claude/streaming) berbutir halus untuk nilai parameter. Ini memungkinkan pengembang untuk melakukan streaming parameter penggunaan alat tanpa buffering / validasi JSON, mengurangi latensi untuk mulai menerima parameter besar.

Streaming alat berbutir halus tersedia melalui Claude API, AWS Bedrock, Google Cloud's Vertex AI, dan Microsoft Foundry.

<Note>
Streaming alat berbutir halus adalah fitur beta. Pastikan untuk mengevaluasi respons Anda sebelum menggunakannya dalam produksi. 

Silakan gunakan [formulir ini](https://forms.gle/D4Fjr7GvQRzfTZT96) untuk memberikan umpan balik tentang kualitas respons model, API itu sendiri, atau kualitas dokumentasi—kami tidak sabar mendengar dari Anda!
</Note>

<Warning>
Saat menggunakan streaming alat berbutir halus, Anda mungkin berpotensi menerima input JSON yang tidak valid atau sebagian. Pastikan untuk mempertimbangkan kasus-kasus tepi ini dalam kode Anda.
</Warning>

## Cara menggunakan streaming alat berbutir halus

Untuk menggunakan fitur beta ini, cukup tambahkan header beta `fine-grained-tool-streaming-2025-05-14` ke permintaan penggunaan alat dan aktifkan streaming.

Berikut adalah contoh cara menggunakan streaming alat berbutir halus dengan API:

<CodeGroup>

  ```bash Shell
  curl https://api.anthropic.com/v1/messages \
    -H "content-type: application/json" \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "anthropic-beta: fine-grained-tool-streaming-2025-05-14" \
    -d '{
      "model": "claude-sonnet-4-5",
      "max_tokens": 65536,
      "tools": [
        {
          "name": "make_file",
          "description": "Write text to a file",
          "input_schema": {
            "type": "object",
            "properties": {
              "filename": {
                "type": "string",
                "description": "The filename to write text to"
              },
              "lines_of_text": {
                "type": "array",
                "description": "An array of lines of text to write to the file"
              }
            },
            "required": ["filename", "lines_of_text"]
          }
        }
      ],
      "messages": [
        {
          "role": "user",
          "content": "Can you write a long poem and make a file called poem.txt?"
        }
      ],
      "stream": true
    }' | jq '.usage'
  ```

  ```python Python
  import anthropic

  client = anthropic.Anthropic()

  response = client.beta.messages.stream(
      max_tokens=65536,
      model="claude-sonnet-4-5",
      tools=[{
        "name": "make_file",
        "description": "Write text to a file",
        "input_schema": {
          "type": "object",
          "properties": {
            "filename": {
              "type": "string",
              "description": "The filename to write text to"
            },
            "lines_of_text": {
              "type": "array",
              "description": "An array of lines of text to write to the file"
            }
          },
          "required": ["filename", "lines_of_text"]
        }
      }],
      messages=[{
        "role": "user",
        "content": "Can you write a long poem and make a file called poem.txt?"
      }],
      betas=["fine-grained-tool-streaming-2025-05-14"]
  )

  print(response.usage)
  ```

  ```typescript TypeScript
  import Anthropic from '@anthropic-ai/sdk';

  const anthropic = new Anthropic();

  const message = await anthropic.beta.messages.stream({
    model: "claude-sonnet-4-5",
    max_tokens: 65536,
    tools: [{
      "name": "make_file",
      "description": "Write text to a file",
      "input_schema": {
        "type": "object",
        "properties": {
          "filename": {
            "type": "string",
            "description": "The filename to write text to"
          },
          "lines_of_text": {
            "type": "array",
            "description": "An array of lines of text to write to the file"
          }
        },
        "required": ["filename", "lines_of_text"]
      }
    }],
    messages: [{ 
      role: "user", 
      content: "Can you write a long poem and make a file called poem.txt?" 
    }],
    betas: ["fine-grained-tool-streaming-2025-05-14"]
  });

  console.log(message.usage);
  ```
</CodeGroup>

Dalam contoh ini, streaming alat berbutir halus memungkinkan Claude untuk melakukan streaming baris-baris puisi panjang ke dalam panggilan alat `make_file` tanpa buffering untuk memvalidasi apakah parameter `lines_of_text` adalah JSON yang valid. Ini berarti Anda dapat melihat parameter stream saat tiba, tanpa harus menunggu seluruh parameter untuk buffer dan validasi.

<Note>
Dengan streaming alat berbutir halus, chunk penggunaan alat mulai streaming lebih cepat, dan sering kali lebih panjang dan mengandung lebih sedikit jeda kata. Ini disebabkan oleh perbedaan dalam perilaku chunking.

Contoh: 

Tanpa streaming berbutir halus (penundaan 15 detik):
```
Chunk 1: '{"'
Chunk 2: 'query": "Ty'
Chunk 3: 'peScri'
Chunk 4: 'pt 5.0 5.1 '
Chunk 5: '5.2 5'
Chunk 6: '.3'
Chunk 8: ' new f'
Chunk 9: 'eatur'
...
```

Dengan streaming berbutir halus (penundaan 3 detik):
```
Chunk 1: '{"query": "TypeScript 5.0 5.1 5.2 5.3'
Chunk 2: ' new features comparison'
```
</Note>

<Warning>
Karena streaming berbutir halus mengirim parameter tanpa buffering atau validasi JSON, tidak ada jaminan bahwa stream yang dihasilkan akan selesai dalam string JSON yang valid.
Khususnya, jika [alasan berhenti](/docs/id/build-with-claude/handling-stop-reasons) `max_tokens` tercapai, stream mungkin berakhir di tengah parameter dan mungkin tidak lengkap. Anda umumnya harus menulis dukungan khusus untuk menangani saat `max_tokens` tercapai.
</Warning>

## Menangani JSON tidak valid dalam respons alat

Saat menggunakan streaming alat berbutir halus, Anda mungkin menerima JSON yang tidak valid atau tidak lengkap dari model. Jika Anda perlu mengirimkan JSON yang tidak valid ini kembali ke model dalam blok respons kesalahan, Anda dapat membungkusnya dalam objek JSON untuk memastikan penanganan yang tepat (dengan kunci yang masuk akal). Sebagai contoh:

```json
{
  "INVALID_JSON": "<your invalid json string>"
}
```

Pendekatan ini membantu model memahami bahwa konten adalah JSON yang tidak valid sambil mempertahankan data yang salah format asli untuk tujuan debugging.

<Note>
Saat membungkus JSON yang tidak valid, pastikan untuk dengan benar meloloskan tanda kutip atau karakter khusus apa pun dalam string JSON yang tidak valid untuk mempertahankan struktur JSON yang valid dalam objek wrapper.
</Note>