# Files API

---

Files API memungkinkan Anda mengunggah dan mengelola file untuk digunakan dengan Claude API tanpa perlu mengunggah ulang konten dengan setiap permintaan. Ini sangat berguna ketika menggunakan [alat eksekusi kode](/docs/id/agents-and-tools/tool-use/code-execution-tool) untuk menyediakan input (misalnya dataset dan dokumen) dan kemudian mengunduh output (misalnya bagan). Anda juga dapat menggunakan Files API untuk menghindari harus terus mengunggah ulang dokumen dan gambar yang sering digunakan di berbagai panggilan API. Anda dapat [menjelajahi referensi API secara langsung](/docs/id/api/files-create), selain panduan ini.

<Note>
Files API saat ini dalam versi beta. Silakan hubungi kami melalui [formulir umpan balik](https://forms.gle/tisHyierGwgN4DUE9) kami untuk berbagi pengalaman Anda dengan Files API.
</Note>

## Model yang didukung

Mereferensikan `file_id` dalam permintaan Messages didukung di semua model yang mendukung jenis file yang diberikan. Misalnya, [gambar](/docs/id/build-with-claude/vision) didukung di semua model Claude 3+, [PDF](/docs/id/build-with-claude/pdf-support) di semua model Claude 3.5+, dan [berbagai jenis file lainnya](/docs/id/agents-and-tools/tool-use/code-execution-tool#supported-file-types) untuk alat eksekusi kode di Claude 3.5 Haiku plus semua model Claude 3.7+.

Files API saat ini tidak didukung di Amazon Bedrock atau Google Vertex AI.

## Cara kerja Files API

Files API menyediakan pendekatan buat-sekali-gunakan-berkali-kali yang sederhana untuk bekerja dengan file:

- **Unggah file** ke penyimpanan aman kami dan terima `file_id` unik
- **Unduh file** yang dibuat dari skill atau alat eksekusi kode
- **Referensikan file** dalam permintaan [Messages](/docs/id/api/messages) menggunakan `file_id` alih-alih mengunggah ulang konten
- **Kelola file Anda** dengan operasi daftar, ambil, dan hapus

## Cara menggunakan Files API

<Note>
Untuk menggunakan Files API, Anda perlu menyertakan header fitur beta: `anthropic-beta: files-api-2025-04-14`.
</Note>

### Mengunggah file

Unggah file untuk direferensikan dalam panggilan API di masa depan:

<CodeGroup>
```bash Shell
curl -X POST https://api.anthropic.com/v1/files \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  -F "file=@/path/to/document.pdf"
```

```python Python
import anthropic

client = anthropic.Anthropic()
client.beta.files.upload(
  file=("document.pdf", open("/path/to/document.pdf", "rb"), "application/pdf"),
)
```

```typescript TypeScript
import Anthropic, { toFile } from '@anthropic-ai/sdk';
import fs from "fs";

const anthropic = new Anthropic();

await anthropic.beta.files.upload({
  file: await toFile(fs.createReadStream('/path/to/document.pdf'), undefined, { type: 'application/pdf' })
}, {
  betas: ['files-api-2025-04-14']
});
```
</CodeGroup>

Respons dari mengunggah file akan mencakup:

```json
{
  "id": "file_011CNha8iCJcU1wXNR6q4V8w",
  "type": "file",
  "filename": "document.pdf",
  "mime_type": "application/pdf",
  "size_bytes": 1024000,
  "created_at": "2025-01-01T00:00:00Z",
  "downloadable": false
}
```

### Menggunakan file dalam pesan

Setelah diunggah, referensikan file menggunakan `file_id`-nya:

<CodeGroup>
```bash Shell
curl -X POST https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "Please summarize this document for me."          
          },
          {
            "type": "document",
            "source": {
              "type": "file",
              "file_id": "file_011CNha8iCJcU1wXNR6q4V8w"
            }
          }
        ]
      }
    ]
  }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Please summarize this document for me."
                },
                {
                    "type": "document",
                    "source": {
                        "type": "file",
                        "file_id": "file_011CNha8iCJcU1wXNR6q4V8w"
                    }
                }
            ]
        }
    ],
    betas=["files-api-2025-04-14"],
)
print(response)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "Please summarize this document for me."
        },
        {
          type: "document",
          source: {
            type: "file",
            file_id: "file_011CNha8iCJcU1wXNR6q4V8w"
          }
        }
      ]
    }
  ],
  betas: ["files-api-2025-04-14"],
});

console.log(response);
```
</CodeGroup>

### Jenis file dan blok konten

Files API mendukung berbagai jenis file yang sesuai dengan jenis blok konten yang berbeda:

| Jenis File | Tipe MIME | Jenis Blok Konten | Kasus Penggunaan |
| :--- | :--- | :--- | :--- |
| PDF | `application/pdf` | `document` | Analisis teks, pemrosesan dokumen |
| Teks biasa | `text/plain` | `document` | Analisis teks, pemrosesan |
| Gambar | `image/jpeg`, `image/png`, `image/gif`, `image/webp` | `image` | Analisis gambar, tugas visual |
| [Dataset, lainnya](/docs/id/agents-and-tools/tool-use/code-execution-tool#supported-file-types) | Bervariasi | `container_upload` | Analisis data, buat visualisasi  |

### Bekerja dengan format file lainnya

Untuk jenis file yang tidak didukung sebagai blok `document` (.csv, .txt, .md, .docx, .xlsx), konversi file ke teks biasa, dan sertakan konten langsung dalam pesan Anda:

<CodeGroup>
```bash Shell
# Contoh: Membaca file teks dan mengirimnya sebagai teks biasa
# Catatan: Untuk file dengan karakter khusus, pertimbangkan pengkodean base64
TEXT_CONTENT=$(cat document.txt | jq -Rs .)

curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d @- <<EOF
{
  "model": "claude-sonnet-4-5",
  "max_tokens": 1024,
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "Here's the document content:\n\n${TEXT_CONTENT}\n\nPlease summarize this document."
        }
      ]
    }
  ]
}
EOF
```

```python Python
import pandas as pd
import anthropic

client = anthropic.Anthropic()

# Contoh: Membaca file CSV
df = pd.read_csv('data.csv')
csv_content = df.to_string()

# Kirim sebagai teks biasa dalam pesan
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": f"Here's the CSV data:\n\n{csv_content}\n\nPlease analyze this data."
                }
            ]
        }
    ]
)

print(response.content[0].text)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';
import fs from 'fs';

const anthropic = new Anthropic();

async function analyzeDocument() {
  // Contoh: Membaca file teks
  const textContent = fs.readFileSync('document.txt', 'utf-8');

  // Kirim sebagai teks biasa dalam pesan
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Here's the document content:\n\n${textContent}\n\nPlease summarize this document.`
          }
        ]
      }
    ]
  });

  console.log(response.content[0].text);
}

analyzeDocument();
```
</CodeGroup>

<Note>
Untuk file .docx yang berisi gambar, konversi ke format PDF terlebih dahulu, kemudian gunakan [dukungan PDF](/docs/id/build-with-claude/pdf-support) untuk memanfaatkan penguraian gambar bawaan. Ini memungkinkan penggunaan kutipan dari dokumen PDF.
</Note>

#### Blok dokumen

Untuk PDF dan file teks, gunakan blok konten `document`:

```json
{
  "type": "document",
  "source": {
    "type": "file",
    "file_id": "file_011CNha8iCJcU1wXNR6q4V8w"
  },
  "title": "Document Title", // Opsional
  "context": "Context about the document", // Opsional  
  "citations": {"enabled": true} // Opsional, mengaktifkan kutipan
}
```

#### Blok gambar

Untuk gambar, gunakan blok konten `image`:

```json
{
  "type": "image",
  "source": {
    "type": "file",
    "file_id": "file_011CPMxVD3fHLUhvTqtsQA5w"
  }
}
```

### Mengelola file

#### Daftar file

Ambil daftar file yang Anda unggah:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/files \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14"
```

```python Python
import anthropic

client = anthropic.Anthropic()
files = client.beta.files.list()
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();
const files = await anthropic.beta.files.list({
  betas: ['files-api-2025-04-14'],
});
```
</CodeGroup>

#### Dapatkan metadata file

Ambil informasi tentang file tertentu:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/files/file_011CNha8iCJcU1wXNR6q4V8w \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14"
```

```python Python
import anthropic

client = anthropic.Anthropic()
file = client.beta.files.retrieve_metadata("file_011CNha8iCJcU1wXNR6q4V8w")
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();
const file = await anthropic.beta.files.retrieveMetadata(
  "file_011CNha8iCJcU1wXNR6q4V8w",
  { betas: ['files-api-2025-04-14'] },
);
```
</CodeGroup>

#### Hapus file

Hapus file dari ruang kerja Anda:

<CodeGroup>
```bash Shell
curl -X DELETE https://api.anthropic.com/v1/files/file_011CNha8iCJcU1wXNR6q4V8w \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14"
```

```python Python
import anthropic

client = anthropic.Anthropic()
result = client.beta.files.delete("file_011CNha8iCJcU1wXNR6q4V8w")
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();
const result = await anthropic.beta.files.delete(
  "file_011CNha8iCJcU1wXNR6q4V8w",
  { betas: ['files-api-2025-04-14'] },
);
```
</CodeGroup>

### Mengunduh file

Unduh file yang telah dibuat oleh skill atau alat eksekusi kode:

<CodeGroup>
```bash Shell
curl -X GET "https://api.anthropic.com/v1/files/file_011CNha8iCJcU1wXNR6q4V8w/content" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  --output downloaded_file.txt
```

```python Python
import anthropic

client = anthropic.Anthropic()
file_content = client.beta.files.download("file_011CNha8iCJcU1wXNR6q4V8w")

# Simpan ke file
with open("downloaded_file.txt", "w") as f:
    f.write(file_content.decode('utf-8'))
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';
import fs from 'fs';

const anthropic = new Anthropic();

const fileContent = await anthropic.beta.files.download(
  "file_011CNha8iCJcU1wXNR6q4V8w",
  { betas: ['files-api-2025-04-14'] },
);

// Simpan ke file
fs.writeFileSync("downloaded_file.txt", fileContent);
```
</CodeGroup>

<Note>
Anda hanya dapat mengunduh file yang dibuat oleh [skill](/docs/id/build-with-claude/skills-guide) atau [alat eksekusi kode](/docs/id/agents-and-tools/tool-use/code-execution-tool). File yang Anda unggah tidak dapat diunduh.
</Note>

---

## Penyimpanan file dan batas

### Batas penyimpanan

- **Ukuran file maksimal:** 500 MB per file
- **Total penyimpanan:** 100 GB per organisasi

### Siklus hidup file

- File dibatasi pada ruang kerja kunci API. Kunci API lain dapat menggunakan file yang dibuat oleh kunci API lain apa pun yang terkait dengan ruang kerja yang sama
- File bertahan sampai Anda menghapusnya
- File yang dihapus tidak dapat dipulihkan
- File tidak dapat diakses melalui API segera setelah penghapusan, tetapi mungkin tetap ada dalam panggilan API `Messages` aktif dan penggunaan alat terkait
- File yang dihapus pengguna akan dihapus sesuai dengan [kebijakan retensi data](https://privacy.claude.com/en/articles/7996866-how-long-do-you-store-my-organization-s-data) kami.

---

## Penanganan kesalahan

Kesalahan umum saat menggunakan Files API meliputi:

- **File tidak ditemukan (404):** `file_id` yang ditentukan tidak ada atau Anda tidak memiliki akses ke file tersebut
- **Jenis file tidak valid (400):** Jenis file tidak cocok dengan jenis blok konten (misalnya, menggunakan file gambar dalam blok dokumen)
- **Melebihi ukuran jendela konteks (400):** File lebih besar dari ukuran jendela konteks (misalnya menggunakan file plaintext 500 MB dalam permintaan `/v1/messages`)
- **Nama file tidak valid (400):** Nama file tidak memenuhi persyaratan panjang (1-255 karakter) atau berisi karakter terlarang (`<`, `>`, `:`, `"`, `|`, `?`, `*`, `\`, `/`, atau karakter unicode 0-31)
- **File terlalu besar (413):** File melebihi batas 500 MB
- **Batas penyimpanan terlampaui (403):** Organisasi Anda telah mencapai batas penyimpanan 100 GB

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "File not found: file_011CNha8iCJcU1wXNR6q4V8w"
  }
}
```

## Penggunaan dan penagihan

Operasi File API **gratis**:
- Mengunggah file
- Mengunduh file
- Mendaftar file
- Mendapatkan metadata file  
- Menghapus file

Konten file yang digunakan dalam permintaan `Messages` ditagih sebagai token input. Anda hanya dapat mengunduh file yang dibuat oleh [skill](/docs/id/build-with-claude/skills-guide) atau [alat eksekusi kode](/docs/id/agents-and-tools/tool-use/code-execution-tool).

### Batas laju

Selama periode beta:
- Panggilan API terkait file dibatasi hingga sekitar 100 permintaan per menit
- [Hubungi kami](mailto:sales@anthropic.com) jika Anda memerlukan batas lebih tinggi untuk kasus penggunaan Anda