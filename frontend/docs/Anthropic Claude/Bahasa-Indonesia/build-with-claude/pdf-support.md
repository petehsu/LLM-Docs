# Dukungan PDF

Proses PDF dengan Claude. Ekstrak teks, analisis grafik, dan pahami konten visual dari dokumen Anda.

---

Anda sekarang dapat bertanya kepada Claude tentang teks, gambar, grafik, dan tabel apa pun dalam PDF yang Anda berikan. Beberapa contoh kasus penggunaan:
- Menganalisis laporan keuangan dan memahami grafik/tabel
- Mengekstrak informasi kunci dari dokumen hukum
- Bantuan terjemahan untuk dokumen
- Mengonversi informasi dokumen ke dalam format terstruktur

## Sebelum Anda memulai

### Periksa persyaratan PDF
Claude bekerja dengan PDF standar apa pun. Namun, Anda harus memastikan ukuran permintaan Anda memenuhi persyaratan ini saat menggunakan dukungan PDF:

| Persyaratan | Batas |
|---|---|
| Ukuran permintaan maksimum | 32MB |
| Halaman maksimum per permintaan | 100 |
| Format | PDF standar (tanpa kata sandi/enkripsi) |

Harap dicatat bahwa kedua batas tersebut berlaku untuk seluruh payload permintaan, termasuk konten lain yang dikirim bersama PDF.

Karena dukungan PDF bergantung pada kemampuan visi Claude, ini tunduk pada [keterbatasan dan pertimbangan](/docs/id/build-with-claude/vision#limitations) yang sama seperti tugas visi lainnya.

### Platform dan model yang didukung

Dukungan PDF saat ini didukung melalui akses API langsung dan Google Vertex AI. Semua [model aktif](/docs/id/about-claude/models/overview) mendukung pemrosesan PDF.

Dukungan PDF sekarang tersedia di Amazon Bedrock dengan pertimbangan berikut:

### Dukungan PDF Amazon Bedrock

Saat menggunakan dukungan PDF melalui Converse API Amazon Bedrock, ada dua mode pemrosesan dokumen yang berbeda:

<Note>
**Penting**: Untuk mengakses kemampuan pemahaman PDF visual penuh Claude di Converse API, Anda harus mengaktifkan kutipan. Tanpa kutipan yang diaktifkan, API kembali ke ekstraksi teks dasar saja. Pelajari lebih lanjut tentang [bekerja dengan kutipan](/docs/id/build-with-claude/citations).
</Note>

#### Mode Pemrosesan Dokumen

1. **Converse Document Chat** (Mode asli - Ekstraksi teks saja)
   - Menyediakan ekstraksi teks dasar dari PDF
   - Tidak dapat menganalisis gambar, grafik, atau tata letak visual dalam PDF
   - Menggunakan sekitar 1.000 token untuk PDF 3 halaman
   - Otomatis digunakan ketika kutipan tidak diaktifkan

2. **Claude PDF Chat** (Mode baru - Pemahaman visual penuh)
   - Menyediakan analisis visual lengkap PDF
   - Dapat memahami dan menganalisis grafik, diagram, gambar, dan tata letak visual
   - Memproses setiap halaman sebagai teks dan gambar untuk pemahaman komprehensif
   - Menggunakan sekitar 7.000 token untuk PDF 3 halaman
   - **Memerlukan kutipan untuk diaktifkan** di Converse API

#### Keterbatasan Utama

- **Converse API**: Analisis PDF visual memerlukan kutipan untuk diaktifkan. Saat ini tidak ada opsi untuk menggunakan analisis visual tanpa kutipan (tidak seperti InvokeModel API).
- **InvokeModel API**: Memberikan kontrol penuh atas pemrosesan PDF tanpa kutipan yang dipaksakan.

#### Masalah Umum

Jika pelanggan melaporkan bahwa Claude tidak melihat gambar atau grafik dalam PDF mereka saat menggunakan Converse API, mereka kemungkinan perlu mengaktifkan flag kutipan. Tanpa itu, Converse kembali ke ekstraksi teks dasar saja.

<Note>
Ini adalah kendala yang diketahui dengan Converse API yang sedang kami kerjakan untuk diatasi. Untuk aplikasi yang memerlukan analisis PDF visual tanpa kutipan, pertimbangkan menggunakan InvokeModel API sebagai gantinya.
</Note>

<Note>
Untuk file non-PDF seperti .csv, .xlsx, .docx, .md, atau .txt, lihat [Bekerja dengan format file lain](/docs/id/build-with-claude/files#working-with-other-file-formats).
</Note>

***

## Proses PDF dengan Claude

### Kirim permintaan PDF pertama Anda
Mari mulai dengan contoh sederhana menggunakan Messages API. Anda dapat menyediakan PDF kepada Claude dengan tiga cara:

1. Sebagai referensi URL ke PDF yang dihosting online
2. Sebagai PDF yang dikodekan base64 dalam blok konten `document`  
3. Dengan `file_id` dari [Files API](/docs/id/build-with-claude/files)

#### Opsi 1: Dokumen PDF berbasis URL

Pendekatan paling sederhana adalah mereferensikan PDF langsung dari URL:

<CodeGroup>
   ```bash Shell
    curl https://api.anthropic.com/v1/messages \
      -H "content-type: application/json" \
      -H "x-api-key: $ANTHROPIC_API_KEY" \
      -H "anthropic-version: 2023-06-01" \
      -d '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 1024,
        "messages": [{
            "role": "user",
            "content": [{
                "type": "document",
                "source": {
                    "type": "url",
                    "url": "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf"
                }
            },
            {
                "type": "text",
                "text": "What are the key findings in this document?"
            }]
        }]
    }'
    ```
    ```python Python
    import anthropic

    client = anthropic.Anthropic()
    message = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "document",
                        "source": {
                            "type": "url",
                            "url": "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf"
                        }
                    },
                    {
                        "type": "text",
                        "text": "What are the key findings in this document?"
                    }
                ]
            }
        ],
    )

    print(message.content)
    ```
    ```typescript TypeScript
    import Anthropic from '@anthropic-ai/sdk';

    const anthropic = new Anthropic();
    
    async function main() {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'document',
                source: {
                  type: 'url',
                  url: 'https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf',
                },
              },
              {
                type: 'text',
                text: 'What are the key findings in this document?',
              },
            ],
          },
        ],
      });
      
      console.log(response);
    }
    
    main();
    ```
    ```java Java
    import java.util.List;

    import com.anthropic.client.AnthropicClient;
    import com.anthropic.client.okhttp.AnthropicOkHttpClient;
    import com.anthropic.models.messages.MessageCreateParams;
    import com.anthropic.models.messages.*;

    public class PdfExample {
        public static void main(String[] args) {
            AnthropicClient client = AnthropicOkHttpClient.fromEnv();

            // Create document block with URL
            DocumentBlockParam documentParam = DocumentBlockParam.builder()
                    .urlPdfSource("https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf")
                    .build();

            // Create a message with document and text content blocks
            MessageCreateParams params = MessageCreateParams.builder()
                    .model(Model.CLAUDE_OPUS_4_20250514)
                    .maxTokens(1024)
                    .addUserMessageOfBlockParams(
                            List.of(
 ContentBlockParam.ofDocument(documentParam),
 ContentBlockParam.ofText(
 TextBlockParam.builder()
 .text("What are the key findings in this document?")
 .build()
 )
                            )
                    )
                    .build();

            Message message = client.messages().create(params);
            System.out.println(message.content());
        }
    }
    ```
</CodeGroup>

#### Opsi 2: Dokumen PDF yang dikodekan Base64

Jika Anda perlu mengirim PDF dari sistem lokal Anda atau ketika URL tidak tersedia:

<CodeGroup>
    ```bash Shell
    # Method 1: Fetch and encode a remote PDF
    curl -s "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf" | base64 | tr -d '\n' > pdf_base64.txt

    # Method 2: Encode a local PDF file
    # base64 document.pdf | tr -d '\n' > pdf_base64.txt

    # Create a JSON request file using the pdf_base64.txt content
    jq -n --rawfile PDF_BASE64 pdf_base64.txt '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 1024,
        "messages": [{
            "role": "user",
            "content": [{
                "type": "document",
                "source": {
                    "type": "base64",
                    "media_type": "application/pdf",
                    "data": $PDF_BASE64
                }
            },
            {
                "type": "text",
                "text": "What are the key findings in this document?"
            }]
        }]
    }' > request.json

    # Send the API request using the JSON file
    curl https://api.anthropic.com/v1/messages \
      -H "content-type: application/json" \
      -H "x-api-key: $ANTHROPIC_API_KEY" \
      -H "anthropic-version: 2023-06-01" \
      -d @request.json
    ```
    ```python Python
    import anthropic
    import base64
    import httpx

    # First, load and encode the PDF 
    pdf_url = "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf"
    pdf_data = base64.standard_b64encode(httpx.get(pdf_url).content).decode("utf-8")

    # Alternative: Load from a local file
    # with open("document.pdf", "rb") as f:
    #     pdf_data = base64.standard_b64encode(f.read()).decode("utf-8")

    # Send to Claude using base64 encoding
    client = anthropic.Anthropic()
    message = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "document",
                        "source": {
                            "type": "base64",
                            "media_type": "application/pdf",
                            "data": pdf_data
                        }
                    },
                    {
                        "type": "text",
                        "text": "What are the key findings in this document?"
                    }
                ]
            }
        ],
    )

    print(message.content)
    ```
    ```typescript TypeScript
    import Anthropic from '@anthropic-ai/sdk';
    import fetch from 'node-fetch';
    import fs from 'fs';

    async function main() {
      // Method 1: Fetch and encode a remote PDF
      const pdfURL = "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf";
      const pdfResponse = await fetch(pdfURL);
      const arrayBuffer = await pdfResponse.arrayBuffer();
      const pdfBase64 = Buffer.from(arrayBuffer).toString('base64');
      
      // Method 2: Load from a local file
      // const pdfBase64 = fs.readFileSync('document.pdf').toString('base64');
      
      // Send the API request with base64-encoded PDF
      const anthropic = new Anthropic();
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'document',
                source: {
                  type: 'base64',
                  media_type: 'application/pdf',
                  data: pdfBase64,
                },
              },
              {
                type: 'text',
                text: 'What are the key findings in this document?',
              },
            ],
          },
        ],
      });
      
      console.log(response);
    }
    
    main();
    ```

    ```java Java
    import java.io.IOException;
    import java.net.URI;
    import java.net.http.HttpClient;
    import java.net.http.HttpRequest;
    import java.net.http.HttpResponse;
    import java.util.Base64;
    import java.util.List;

    import com.anthropic.client.AnthropicClient;
    import com.anthropic.client.okhttp.AnthropicOkHttpClient;
    import com.anthropic.models.messages.ContentBlockParam;
    import com.anthropic.models.messages.DocumentBlockParam;
    import com.anthropic.models.messages.Message;
    import com.anthropic.models.messages.MessageCreateParams;
    import com.anthropic.models.messages.Model;
    import com.anthropic.models.messages.TextBlockParam;

    public class PdfExample {
        public static void main(String[] args) throws IOException, InterruptedException {
            AnthropicClient client = AnthropicOkHttpClient.fromEnv();

            // Method 1: Download and encode a remote PDF
            String pdfUrl = "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf";
            HttpClient httpClient = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(pdfUrl))
                    .GET()
                    .build();

            HttpResponse<byte[]> response = httpClient.send(request, HttpResponse.BodyHandlers.ofByteArray());
            String pdfBase64 = Base64.getEncoder().encodeToString(response.body());

            // Method 2: Load from a local file
            // byte[] fileBytes = Files.readAllBytes(Path.of("document.pdf"));
            // String pdfBase64 = Base64.getEncoder().encodeToString(fileBytes);

            // Create document block with base64 data
            DocumentBlockParam documentParam = DocumentBlockParam.builder()
                    .base64PdfSource(pdfBase64)
                    .build();

            // Create a message with document and text content blocks
            MessageCreateParams params = MessageCreateParams.builder()
                    .model(Model.CLAUDE_OPUS_4_20250514)
                    .maxTokens(1024)
                    .addUserMessageOfBlockParams(
                            List.of(
 ContentBlockParam.ofDocument(documentParam),
 ContentBlockParam.ofText(TextBlockParam.builder().text("What are the key findings in this document?").build())
                            )
                    )
                    .build();

            Message message = client.messages().create(params);
            message.content().stream()
                    .flatMap(contentBlock -> contentBlock.text().stream())
                    .forEach(textBlock -> System.out.println(textBlock.text()));
        }
    }
    ```

</CodeGroup>

#### Opsi 3: Files API

Untuk PDF yang akan Anda gunakan berulang kali, atau ketika Anda ingin menghindari overhead encoding, gunakan [Files API](/docs/id/build-with-claude/files): 

<CodeGroup>
```bash Shell
# First, upload your PDF to the Files API
curl -X POST https://api.anthropic.com/v1/files \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  -F "file=@document.pdf"

# Then use the returned file_id in your message
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  -d '{
    "model": "claude-sonnet-4-5", 
    "max_tokens": 1024,
    "messages": [{
      "role": "user",
      "content": [{
        "type": "document",
        "source": {
          "type": "file",
          "file_id": "file_abc123"
        }
      },
      {
        "type": "text",
        "text": "What are the key findings in this document?"
      }]
    }]
  }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

# Upload the PDF file
with open("document.pdf", "rb") as f:
    file_upload = client.beta.files.upload(file=("document.pdf", f, "application/pdf"))

# Use the uploaded file in a message
message = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    betas=["files-api-2025-04-14"],
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "document",
                    "source": {
                        "type": "file",
                        "file_id": file_upload.id
                    }
                },
                {
                    "type": "text",
                    "text": "What are the key findings in this document?"
                }
            ]
        }
    ],
)

print(message.content)
```

```typescript TypeScript
import { Anthropic, toFile } from '@anthropic-ai/sdk';
import fs from 'fs';

const anthropic = new Anthropic();

async function main() {
  // Upload the PDF file
  const fileUpload = await anthropic.beta.files.upload({
    file: toFile(fs.createReadStream('document.pdf'), undefined, { type: 'application/pdf' })
  }, {
    betas: ['files-api-2025-04-14']
  });

  // Use the uploaded file in a message
  const response = await anthropic.beta.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    betas: ['files-api-2025-04-14'],
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'document',
            source: {
              type: 'file',
              file_id: fileUpload.id
            }
          },
          {
            type: 'text',
            text: 'What are the key findings in this document?'
          }
        ]
      }
    ]
  });

  console.log(response);
}

main();
```

```java Java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.File;
import com.anthropic.models.files.FileUploadParams;
import com.anthropic.models.messages.*;

public class PdfFilesExample {
    public static void main(String[] args) throws IOException {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Upload the PDF file
        File file = client.beta().files().upload(FileUploadParams.builder()
                .file(Files.newInputStream(Path.of("document.pdf")))
                .build());

        // Use the uploaded file in a message
        DocumentBlockParam documentParam = DocumentBlockParam.builder()
                .fileSource(file.id())
                .build();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                .addUserMessageOfBlockParams(
                        List.of(
 ContentBlockParam.ofDocument(documentParam),
 ContentBlockParam.ofText(
 TextBlockParam.builder()
 .text("What are the key findings in this document?")
 .build()
 )
                        )
                )
                .build();

        Message message = client.messages().create(params);
        System.out.println(message.content());
    }
}
```
</CodeGroup>

### Cara kerja dukungan PDF
Ketika Anda mengirim PDF ke Claude, langkah-langkah berikut terjadi:
<Steps>
  <Step title="Sistem mengekstrak konten dokumen.">
    - Sistem mengonversi setiap halaman dokumen menjadi gambar.
    - Teks dari setiap halaman diekstrak dan disediakan bersama gambar setiap halaman.
  </Step>
  <Step title="Claude menganalisis teks dan gambar untuk memahami dokumen dengan lebih baik.">
    - Dokumen disediakan sebagai kombinasi teks dan gambar untuk analisis.
    - Ini memungkinkan pengguna untuk meminta wawasan tentang elemen visual PDF, seperti grafik, diagram, dan konten non-tekstual lainnya.
  </Step>
  <Step title="Claude merespons, mereferensikan konten PDF jika relevan.">
    Claude dapat mereferensikan konten tekstual dan visual saat merespons. Anda dapat lebih meningkatkan kinerja dengan mengintegrasikan dukungan PDF dengan:
    - **Prompt caching**: Untuk meningkatkan kinerja untuk analisis berulang.
    - **Batch processing**: Untuk pemrosesan dokumen volume tinggi.
    - **Tool use**: Untuk mengekstrak informasi spesifik dari dokumen untuk digunakan sebagai input alat.
  </Step>
</Steps>

### Perkirakan biaya Anda
Jumlah token file PDF tergantung pada total teks yang diekstrak dari dokumen serta jumlah halaman:
- Biaya token teks: Setiap halaman biasanya menggunakan 1.500-3.000 token per halaman tergantung pada kepadatan konten. Harga API standar berlaku tanpa biaya PDF tambahan.
- Biaya token gambar: Karena setiap halaman dikonversi menjadi gambar, [perhitungan biaya berbasis gambar](/docs/id/build-with-claude/vision#evaluate-image-size) yang sama diterapkan.

Anda dapat menggunakan [penghitungan token](/docs/id/build-with-claude/token-counting) untuk memperkirakan biaya untuk PDF spesifik Anda.

***

## Optimalkan pemrosesan PDF

### Tingkatkan kinerja
Ikuti praktik terbaik ini untuk hasil optimal:
- Tempatkan PDF sebelum teks dalam permintaan Anda
- Gunakan font standar
- Pastikan teks jelas dan terbaca
- Putar halaman ke orientasi tegak yang tepat
- Gunakan nomor halaman logis (dari penampil PDF) dalam prompt
- Bagi PDF besar menjadi potongan-potongan bila diperlukan
- Aktifkan prompt caching untuk analisis berulang

### Skalakan implementasi Anda
Untuk pemrosesan volume tinggi, pertimbangkan pendekatan ini:

#### Gunakan prompt caching
Cache PDF untuk meningkatkan kinerja pada kueri berulang:
<CodeGroup>
```bash Shell
# Create a JSON request file using the pdf_base64.txt content
jq -n --rawfile PDF_BASE64 pdf_base64.txt '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [{
        "role": "user",
        "content": [{
            "type": "document",
            "source": {
                "type": "base64",
                "media_type": "application/pdf",
                "data": $PDF_BASE64
            },
            "cache_control": {
              "type": "ephemeral"
            }
        },
        {
            "type": "text",
            "text": "Which model has the highest human preference win rates across each use-case?"
        }]
    }]
}' > request.json

# Then make the API call using the JSON file
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d @request.json
```
```python Python
message = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "document",
                    "source": {
                        "type": "base64",
                        "media_type": "application/pdf",
                        "data": pdf_data
                    },
                    "cache_control": {"type": "ephemeral"}
                },
                {
                    "type": "text",
                    "text": "Analyze this document."
                }
            ]
        }
    ],
)
```

```typescript TypeScript
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 1024,
  messages: [
    {
      content: [
        {
          type: 'document',
          source: {
            media_type: 'application/pdf',
            type: 'base64',
            data: pdfBase64,
          },
          cache_control: { type: 'ephemeral' },
        },
        {
          type: 'text',
          text: 'Which model has the highest human preference win rates across each use-case?',
        },
      ],
      role: 'user',
    },
  ],
});
console.log(response);
```

```java Java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.Base64PdfSource;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.ContentBlockParam;
import com.anthropic.models.messages.DocumentBlockParam;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;

public class MessagesDocumentExample {

    public static void main(String[] args) throws IOException {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Read PDF file as base64
        byte[] pdfBytes = Files.readAllBytes(Paths.get("pdf_base64.txt"));
        String pdfBase64 = new String(pdfBytes);

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                .addUserMessageOfBlockParams(List.of(
                        ContentBlockParam.ofDocument(
 DocumentBlockParam.builder()
 .source(Base64PdfSource.builder()
 .data(pdfBase64)
 .build())
 .cacheControl(CacheControlEphemeral.builder().build())
 .build()),
                        ContentBlockParam.ofText(
 TextBlockParam.builder()
 .text("Which model has the highest human preference win rates across each use-case?")
 .build())
                ))
                .build();


        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>

#### Proses batch dokumen
Gunakan Message Batches API untuk alur kerja volume tinggi:
<CodeGroup>
```bash Shell
# Create a JSON request file using the pdf_base64.txt content
jq -n --rawfile PDF_BASE64 pdf_base64.txt '
{
  "requests": [
      {
          "custom_id": "my-first-request",
          "params": {
              "model": "claude-sonnet-4-5",
              "max_tokens": 1024,
              "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "document",
                            "source": {
 "type": "base64",
 "media_type": "application/pdf",
 "data": $PDF_BASE64
                            }
                        },
                        {
                            "type": "text",
                            "text": "Which model has the highest human preference win rates across each use-case?"
                        }
                    ]
                }
              ]
          }
      },
      {
          "custom_id": "my-second-request",
          "params": {
              "model": "claude-sonnet-4-5",
              "max_tokens": 1024,
              "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "document",
                            "source": {
 "type": "base64",
 "media_type": "application/pdf",
 "data": $PDF_BASE64
                            }
                        },
                        {
                            "type": "text",
                            "text": "Extract 5 key insights from this document."
                        }
                    ]
                }
              ]
          }
      }
  ]
}
' > request.json

# Then make the API call using the JSON file
curl https://api.anthropic.com/v1/messages/batches \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d @request.json
```
```python Python
message_batch = client.messages.batches.create(
    requests=[
        {
            "custom_id": "doc1",
            "params": {
                "model": "claude-sonnet-4-5",
                "max_tokens": 1024,
                "messages": [
                    {
                        "role": "user",
                        "content": [
                            {
 "type": "document",
 "source": {
 "type": "base64",
 "media_type": "application/pdf",
 "data": pdf_data
 }
                            },
                            {
 "type": "text",
 "text": "Summarize this document."
                            }
                        ]
                    }
                ]
            }
        }
    ]
)
```

```typescript TypeScript
const response = await anthropic.messages.batches.create({
  requests: [
    {
      custom_id: 'my-first-request',
      params: {
        max_tokens: 1024,
        messages: [
          {
            content: [
              {
                type: 'document',
                source: {
                  media_type: 'application/pdf',
                  type: 'base64',
                  data: pdfBase64,
                },
              },
              {
                type: 'text',
                text: 'Which model has the highest human preference win rates across each use-case?',
              },
            ],
            role: 'user',
          },
        ],
        model: 'claude-sonnet-4-5',
      },
    },
    {
      custom_id: 'my-second-request',
      params: {
        max_tokens: 1024,
        messages: [
          {
            content: [
              {
                type: 'document',
                source: {
                  media_type: 'application/pdf',
                  type: 'base64',
                  data: pdfBase64,
                },
              },
              {
                type: 'text',
                text: 'Extract 5 key insights from this document.',
              },
            ],
            role: 'user',
          },
        ],
        model: 'claude-sonnet-4-5',
      },
    }
  ],
});
console.log(response);
```

```java Java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.*;
import com.anthropic.models.messages.batches.*;

public class MessagesBatchDocumentExample {

    public static void main(String[] args) throws IOException {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Read PDF file as base64
        byte[] pdfBytes = Files.readAllBytes(Paths.get("pdf_base64.txt"));
        String pdfBase64 = new String(pdfBytes);

        BatchCreateParams params = BatchCreateParams.builder()
                .addRequest(BatchCreateParams.Request.builder()
                        .customId("my-first-request")
                        .params(BatchCreateParams.Request.Params.builder()
 .model(Model.CLAUDE_OPUS_4_20250514)
 .maxTokens(1024)
 .addUserMessageOfBlockParams(List.of(
 ContentBlockParam.ofDocument(
 DocumentBlockParam.builder()
 .source(Base64PdfSource.builder()
 .data(pdfBase64)
 .build())
 .build()
 ),
 ContentBlockParam.ofText(
 TextBlockParam.builder()
 .text("Which model has the highest human preference win rates across each use-case?")
 .build()
 )
 ))
 .build())
                        .build())
                .addRequest(BatchCreateParams.Request.builder()
                        .customId("my-second-request")
                        .params(BatchCreateParams.Request.Params.builder()
 .model(Model.CLAUDE_OPUS_4_20250514)
 .maxTokens(1024)
 .addUserMessageOfBlockParams(List.of(
 ContentBlockParam.ofDocument(
 DocumentBlockParam.builder()
 .source(Base64PdfSource.builder()
 .data(pdfBase64)
 .build())
 .build()
 ),
 ContentBlockParam.ofText(
 TextBlockParam.builder()
 .text("Extract 5 key insights from this document.")
 .build()
 )
 ))
 .build())
                        .build())
                .build();

        MessageBatch batch = client.messages().batches().create(params);
        System.out.println(batch);
    }
}
```
</CodeGroup>

## Langkah selanjutnya

<CardGroup cols={2}>
  <Card
    title="Coba contoh PDF"
    icon="file"
    href="https://github.com/anthropics/anthropic-cookbook/tree/main/multimodal"
  >
    Jelajahi contoh praktis pemrosesan PDF dalam resep cookbook kami.
  </Card>

  <Card
    title="Lihat referensi API"
    icon="code"
    href="/docs/id/api/messages"
  >
    Lihat dokumentasi API lengkap untuk dukungan PDF.
  </Card>
</CardGroup>