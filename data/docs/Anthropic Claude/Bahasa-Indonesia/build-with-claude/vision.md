# Visi

Kemampuan visi Claude memungkinkannya untuk memahami dan menganalisis gambar, membuka kemungkinan menarik untuk interaksi multimodal.

---

Panduan ini menjelaskan cara bekerja dengan gambar di Claude, termasuk praktik terbaik, contoh kode, dan keterbatasan yang perlu diingat.

---

## Cara menggunakan visi

Gunakan kemampuan visi Claude melalui:

- [claude.ai](https://claude.ai/). Unggah gambar seperti yang Anda lakukan dengan file, atau seret dan lepaskan gambar langsung ke jendela obrolan.
- [Console Workbench](/workbench/). Tombol untuk menambahkan gambar muncul di sudut kanan atas setiap blok pesan Pengguna.
- **Permintaan API**. Lihat contoh dalam panduan ini.

---

## Sebelum Anda mengunggah

### Dasar dan Batas

Anda dapat menyertakan beberapa gambar dalam satu permintaan (hingga 20 untuk [claude.ai](https://claude.ai/) dan 100 untuk permintaan API). Claude akan menganalisis semua gambar yang disediakan saat merumuskan responsnya. Ini dapat membantu untuk membandingkan atau membedakan gambar.

Jika Anda mengirimkan gambar yang lebih besar dari 8000x8000 px, gambar akan ditolak. Jika Anda mengirimkan lebih dari 20 gambar dalam satu permintaan API, batas ini adalah 2000x2000 px.

<Note>
Meskipun API mendukung 100 gambar per permintaan, ada [batas ukuran permintaan 32MB](/docs/id/api/overview#request-size-limits) untuk titik akhir standar.
</Note>

### Evaluasi ukuran gambar

Untuk kinerja optimal, kami merekomendasikan mengubah ukuran gambar sebelum mengunggah jika gambar terlalu besar. Jika tepi panjang gambar Anda lebih dari 1568 piksel, atau gambar Anda lebih dari ~1.600 token, gambar akan terlebih dahulu diperkecil, mempertahankan rasio aspek, hingga berada dalam batas ukuran.

Jika gambar input Anda terlalu besar dan perlu diubah ukurannya, ini akan meningkatkan latensi [time-to-first-token](/docs/id/about-claude/glossary), tanpa memberikan Anda kinerja model tambahan. Gambar yang sangat kecil di bawah 200 piksel di tepi mana pun dapat menurunkan kinerja.

<Tip>
  Untuk meningkatkan [time-to-first-token](/docs/id/about-claude/glossary), kami merekomendasikan
  mengubah ukuran gambar menjadi tidak lebih dari 1,15 megapiksel (dan dalam 1568 piksel di
  kedua dimensi).
</Tip>

Berikut adalah tabel ukuran gambar maksimum yang diterima oleh API kami yang tidak akan diubah ukurannya untuk rasio aspek umum. Dengan Claude Sonnet 4.5, gambar-gambar ini menggunakan sekitar 1.600 token dan sekitar $4,80/1K gambar.

| Rasio aspek | Ukuran gambar |
| ----------- | ------------- |
| 1&#58;1     | 1092x1092 px  |
| 3&#58;4     | 951x1268 px   |
| 2&#58;3     | 896x1344 px   |
| 9&#58;16    | 819x1456 px   |
| 1&#58;2     | 784x1568 px   |

### Hitung biaya gambar

Setiap gambar yang Anda sertakan dalam permintaan ke Claude dihitung terhadap penggunaan token Anda. Untuk menghitung biaya perkiraan, kalikan jumlah token gambar perkiraan dengan [harga per-token model](https://claude.com/pricing) yang Anda gunakan.

Jika gambar Anda tidak perlu diubah ukurannya, Anda dapat memperkirakan jumlah token yang digunakan melalui algoritma ini: `tokens = (width px * height px)/750`

Berikut adalah contoh tokenisasi perkiraan dan biaya untuk ukuran gambar berbeda dalam batasan ukuran API kami berdasarkan harga per-token Claude Sonnet 4.5 sebesar $3 per juta token input:

| Ukuran gambar                 | \# Token   | Biaya / gambar | Biaya / 1K gambar |
| ----------------------------- | ---------- | -------------- | ----------------- |
| 200x200 px(0,04 megapiksel)   | \~54       | \~$0,00016     | \~$0,16           |
| 1000x1000 px(1 megapiksel)    | \~1334     | \~$0,004       | \~$4,00           |
| 1092x1092 px(1,19 megapiksel) | \~1590     | \~$0,0048      | \~$4,80           |

### Memastikan kualitas gambar

Saat memberikan gambar kepada Claude, perhatikan hal berikut untuk hasil terbaik:

- **Format gambar**: Gunakan format gambar yang didukung: JPEG, PNG, GIF, atau WebP.
- **Kejelasan gambar**: Pastikan gambar jelas dan tidak terlalu buram atau pikselasi.
- **Teks**: Jika gambar berisi teks penting, pastikan teks dapat dibaca dan tidak terlalu kecil. Hindari memotong konteks visual kunci hanya untuk memperbesar teks.

---

## Contoh prompt

Banyak dari [teknik prompting](/docs/id/build-with-claude/prompt-engineering/overview) yang bekerja dengan baik untuk interaksi berbasis teks dengan Claude juga dapat diterapkan pada prompt berbasis gambar.

Contoh-contoh ini mendemonstrasikan struktur prompt praktik terbaik yang melibatkan gambar.

<Tip>
  Sama seperti dengan penempatan dokumen-kueri, Claude bekerja paling baik ketika gambar datang
  sebelum teks. Gambar yang ditempatkan setelah teks atau diinterpolasi dengan teks masih akan
  berkinerja baik, tetapi jika kasus penggunaan Anda memungkinkan, kami merekomendasikan
  struktur gambar-kemudian-teks.
</Tip>

### Tentang contoh prompt

Contoh-contoh berikut mendemonstrasikan cara menggunakan kemampuan visi Claude menggunakan berbagai bahasa pemrograman dan pendekatan. Anda dapat memberikan gambar kepada Claude dengan tiga cara:

1. Sebagai gambar yang dikodekan base64 dalam blok konten `image`
2. Sebagai referensi URL ke gambar yang dihosting online
3. Menggunakan Files API (unggah sekali, gunakan berkali-kali)

Prompt contoh base64 menggunakan variabel-variabel ini:

<CodeGroup>
```bash Shell
    # Untuk gambar berbasis URL, Anda dapat menggunakan URL langsung dalam permintaan JSON Anda
    
    # Untuk gambar yang dikodekan base64, Anda perlu terlebih dahulu mengenkode gambar
    # Contoh cara mengenkode gambar ke base64 di bash:
    BASE64_IMAGE_DATA=$(curl -s "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg" | base64)
    
    # Data yang dikodekan sekarang dapat digunakan dalam panggilan API Anda
```

```python Python
import base64
import httpx

# Untuk gambar yang dikodekan base64
image1_url = "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg"
image1_media_type = "image/jpeg"
image1_data = base64.standard_b64encode(httpx.get(image1_url).content).decode("utf-8")

image2_url = "https://upload.wikimedia.org/wikipedia/commons/b/b5/Iridescent.green.sweat.bee1.jpg"
image2_media_type = "image/jpeg"
image2_data = base64.standard_b64encode(httpx.get(image2_url).content).decode("utf-8")

# Untuk gambar berbasis URL, Anda dapat menggunakan URL langsung dalam permintaan Anda
```

```typescript TypeScript
import axios from 'axios';

// Untuk gambar yang dikodekan base64
async function getBase64Image(url: string): Promise<string> {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  return Buffer.from(response.data, 'binary').toString('base64');
}

// Penggunaan
async function prepareImages() {
  const imageData = await getBase64Image('https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg');
  // Sekarang Anda dapat menggunakan imageData dalam panggilan API Anda
}

// Untuk gambar berbasis URL, Anda dapat menggunakan URL langsung dalam permintaan Anda
```

```java Java
import java.io.IOException;
import java.util.Base64;
import java.io.InputStream;
import java.net.URL;

public class ImageHandlingExample {

    public static void main(String[] args) throws IOException, InterruptedException {
        // Untuk gambar yang dikodekan base64
        String image1Url = "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg";
        String image1MediaType = "image/jpeg";
        String image1Data = downloadAndEncodeImage(image1Url);

        String image2Url = "https://upload.wikimedia.org/wikipedia/commons/b/b5/Iridescent.green.sweat.bee1.jpg";
        String image2MediaType = "image/jpeg";
        String image2Data = downloadAndEncodeImage(image2Url);

        // Untuk gambar berbasis URL, Anda dapat menggunakan URL langsung dalam permintaan Anda
    }

    private static String downloadAndEncodeImage(String imageUrl) throws IOException {
        try (InputStream inputStream = new URL(imageUrl).openStream()) {
            return Base64.getEncoder().encodeToString(inputStream.readAllBytes());
        }
    }

}
```
</CodeGroup>

Di bawah ini adalah contoh cara menyertakan gambar dalam permintaan Messages API menggunakan gambar yang dikodekan base64 dan referensi URL:

### Contoh gambar yang dikodekan base64

<CodeGroup>
    ```bash Shell
    curl https://api.anthropic.com/v1/messages \
      -H "x-api-key: $ANTHROPIC_API_KEY" \
      -H "anthropic-version: 2023-06-01" \
      -H "content-type: application/json" \
      -d '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 1024,
        "messages": [
          {
            "role": "user",
            "content": [
              {
                "type": "image",
                "source": {
                  "type": "base64",
                  "media_type": "image/jpeg",
                  "data": "'"$BASE64_IMAGE_DATA"'"
                }
              },
              {
                "type": "text",
                "text": "Describe this image."
              }
            ]
          }
        ]
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
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": image1_media_type,
                            "data": image1_data,
                        },
                    },
                    {
                        "type": "text",
                        "text": "Describe this image."
                    }
                ],
            }
        ],
    )
    print(message)
    ```
    ```typescript TypeScript
    import Anthropic from '@anthropic-ai/sdk';

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    async function main() {
      const message = await anthropic.messages.create({
        model: "claude-sonnet-4-5",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: "image/jpeg",
                  data: imageData, // Base64-encoded image data as string
                }
              },
              {
                type: "text",
                text: "Describe this image."
              }
            ]
          }
        ]
      });
      
      console.log(message);
    }

    main();
    ```

    ```java Java
    import java.io.IOException;
    import java.util.List;

    import com.anthropic.client.AnthropicClient;
    import com.anthropic.client.okhttp.AnthropicOkHttpClient;
    import com.anthropic.models.messages.*;

    public class VisionExample {
        public static void main(String[] args) throws IOException, InterruptedException {
            AnthropicClient client = AnthropicOkHttpClient.fromEnv();
            String imageData = ""; // // Base64-encoded image data as string

            List<ContentBlockParam> contentBlockParams = List.of(
                    ContentBlockParam.ofImage(
                            ImageBlockParam.builder()
                                    .source(Base64ImageSource.builder()
                                            .data(imageData)
                                            .build())
                                    .build()
                    ),
                    ContentBlockParam.ofText(TextBlockParam.builder()
                            .text("Describe this image.")
                            .build())
            );
            Message message = client.messages().create(
                    MessageCreateParams.builder()
                            .model(Model.CLAUDE_SONNET_4_5_LATEST)
                            .maxTokens(1024)
                            .addUserMessageOfBlockParams(contentBlockParams)
                            .build()
            );

            System.out.println(message);
        }
    }
    ```
</CodeGroup>

### Contoh gambar berbasis URL

<CodeGroup>
    ```bash Shell
    curl https://api.anthropic.com/v1/messages \
      -H "x-api-key: $ANTHROPIC_API_KEY" \
      -H "anthropic-version: 2023-06-01" \
      -H "content-type: application/json" \
      -d '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 1024,
        "messages": [
          {
            "role": "user",
            "content": [
              {
                "type": "image",
                "source": {
                  "type": "url",
                  "url": "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg"
                }
              },
              {
                "type": "text",
                "text": "Describe this image."
              }
            ]
          }
        ]
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
                        "type": "image",
                        "source": {
                            "type": "url",
                            "url": "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg",
                        },
                    },
                    {
                        "type": "text",
                        "text": "Describe this image."
                    }
                ],
            }
        ],
    )
    print(message)
    ```
    ```typescript TypeScript
    import Anthropic from '@anthropic-ai/sdk';

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    async function main() {
      const message = await anthropic.messages.create({
        model: "claude-sonnet-4-5",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "url",
                  url: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg"
                }
              },
              {
                type: "text",
                text: "Describe this image."
              }
            ]
          }
        ]
      });
      
      console.log(message);
    }

    main();
    ```
    ```java Java
    import java.io.IOException;
    import java.util.List;

    import com.anthropic.client.AnthropicClient;
    import com.anthropic.client.okhttp.AnthropicOkHttpClient;
    import com.anthropic.models.messages.*;

    public class VisionExample {

        public static void main(String[] args) throws IOException, InterruptedException {
            AnthropicClient client = AnthropicOkHttpClient.fromEnv();

            List<ContentBlockParam> contentBlockParams = List.of(
                    ContentBlockParam.ofImage(
                            ImageBlockParam.builder()
                                    .source(UrlImageSource.builder()
                                            .url("https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg")
                                            .build())
                                    .build()
                    ),
                    ContentBlockParam.ofText(TextBlockParam.builder()
                            .text("Describe this image.")
                            .build())
            );
            Message message = client.messages().create(
                    MessageCreateParams.builder()
                            .model(Model.CLAUDE_SONNET_4_5_LATEST)
                            .maxTokens(1024)
                            .addUserMessageOfBlockParams(contentBlockParams)
                            .build()
            );
            System.out.println(message);
        }
    }
    ```
</CodeGroup>

### Contoh gambar Files API

Untuk gambar yang akan Anda gunakan berulang kali atau ketika Anda ingin menghindari overhead pengodean, gunakan [Files API](/docs/id/build-with-claude/files):

<CodeGroup>
```bash Shell
# Pertama, unggah gambar Anda ke Files API
curl -X POST https://api.anthropic.com/v1/files \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  -F "file=@image.jpg"

# Kemudian gunakan file_id yang dikembalikan dalam pesan Anda
curl https://api.anthropic.com/v1/messages \
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
            "type": "image",
            "source": {
              "type": "file",
              "file_id": "file_abc123"
            }
          },
          {
            "type": "text",
            "text": "Describe this image."
          }
        ]
      }
    ]
  }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

# Unggah file gambar
with open("image.jpg", "rb") as f:
    file_upload = client.beta.files.upload(file=("image.jpg", f, "image/jpeg"))

# Gunakan file yang diunggah dalam pesan
message = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    betas=["files-api-2025-04-14"],
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {
                        "type": "file",
                        "file_id": file_upload.id
                    }
                },
                {
                    "type": "text",
                    "text": "Describe this image."
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
  // Unggah file gambar
  const fileUpload = await anthropic.beta.files.upload({
    file: toFile(fs.createReadStream('image.jpg'), undefined, { type: "image/jpeg" })
  }, {
    betas: ['files-api-2025-04-14']
  });

  // Gunakan file yang diunggah dalam pesan
  const response = await anthropic.beta.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    betas: ['files-api-2025-04-14'],
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'file',
              file_id: fileUpload.id
            }
          },
          {
            type: 'text',
            text: 'Describe this image.'
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

public class ImageFilesExample {
    public static void main(String[] args) throws IOException {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Unggah file gambar
        File file = client.beta().files().upload(FileUploadParams.builder()
                .file(Files.newInputStream(Path.of("image.jpg")))
                .build());

        // Gunakan file yang diunggah dalam pesan
        ImageBlockParam imageParam = ImageBlockParam.builder()
                .fileSource(file.id())
                .build();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_SONNET_4_5_LATEST)
                .maxTokens(1024)
                .addUserMessageOfBlockParams(
                        List.of(
                                ContentBlockParam.ofImage(imageParam),
                                ContentBlockParam.ofText(
                                        TextBlockParam.builder()
                                                .text("Describe this image.")
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

Lihat [contoh Messages API](/docs/id/api/messages) untuk lebih banyak contoh kode dan detail parameter.

<section title="Contoh: Satu gambar">

Sebaiknya tempatkan gambar lebih awal dalam prompt daripada pertanyaan tentang gambar atau instruksi untuk tugas yang menggunakannya.

Minta Claude untuk mendeskripsikan satu gambar.

| Peran | Konten                         |
| ---- | ------------------------------ |
| User | \[Image\] Describe this image. |

<Tabs>
  <Tab title="Using Base64">
    ```python Python
    message = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": image1_media_type,
                            "data": image1_data,
                        },
                    },
                    {
                        "type": "text",
                        "text": "Describe this image."
                    }
                ],
            }
        ],
    )
    ```
  </Tab>
  <Tab title="Using URL">
    ```python Python
    message = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "url",
                            "url": "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg",
                        },
                    },
                    {
                        "type": "text",
                        "text": "Describe this image."
                    }
                ],
            }
        ],
    )
    ```
  </Tab>
</Tabs>

</section>
<section title="Contoh: Beberapa gambar">

Dalam situasi di mana ada beberapa gambar, perkenalkan setiap gambar dengan `Image 1:` dan `Image 2:` dan seterusnya. Anda tidak perlu baris baru antara gambar atau antara gambar dan prompt.

Minta Claude untuk mendeskripsikan perbedaan antara beberapa gambar.
| Peran | Konten |
| ---- | --------- |
| User | Image 1: \[Image 1\] Image 2: \[Image 2\] How are these images different? |

<Tabs>
  <Tab title="Using Base64">
    ```python Python
    message = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Image 1:"
                    },
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": image1_media_type,
                            "data": image1_data,
                        },
                    },
                    {
                        "type": "text",
                        "text": "Image 2:"
                    },
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": image2_media_type,
                            "data": image2_data,
                        },
                    },
                    {
                        "type": "text",
                        "text": "How are these images different?"
                    }
                ],
            }
        ],
    )
    ```
  </Tab>
  <Tab title="Using URL">
    ```python Python
    message = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Image 1:"
                    },
                    {
                        "type": "image",
                        "source": {
                            "type": "url",
                            "url": "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg",
                        },
                    },
                    {
                        "type": "text",
                        "text": "Image 2:"
                    },
                    {
                        "type": "image",
                        "source": {
                            "type": "url",
                            "url": "https://upload.wikimedia.org/wikipedia/commons/b/b5/Iridescent.green.sweat.bee1.jpg",
                        },
                    },
                    {
                        "type": "text",
                        "text": "How are these images different?"
                    }
                ],
            }
        ],
    )
    ```
  </Tab>
</Tabs>

</section>
<section title="Contoh: Beberapa gambar dengan system prompt">

Minta Claude untuk mendeskripsikan perbedaan antara beberapa gambar, sambil memberikannya system prompt untuk cara merespons.

| Konten | |
| ------- | --------- |
| System  | Respond only in Spanish. |
| User    | Image 1: \[Image 1\] Image 2: \[Image 2\] How are these images different? |

<Tabs>
  <Tab title="Using Base64">
    ```python Python
    message = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1024,
        system="Respond only in Spanish.",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Image 1:"
                    },
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": image1_media_type,
                            "data": image1_data,
                        },
                    },
                    {
                        "type": "text",
                        "text": "Image 2:"
                    },
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": image2_media_type,
                            "data": image2_data,
                        },
                    },
                    {
                        "type": "text",
                        "text": "How are these images different?"
                    }
                ],
            }
        ],
    )
    ```
  </Tab>
  <Tab title="Using URL">
    ```python Python
    message = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1024,
        system="Respond only in Spanish.",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Image 1:"
                    },
                    {
                        "type": "image",
                        "source": {
                            "type": "url",
                            "url": "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg",
                        },
                    },
                    {
                        "type": "text",
                        "text": "Image 2:"
                    },
                    {
                        "type": "image",
                        "source": {
                            "type": "url",
                            "url": "https://upload.wikimedia.org/wikipedia/commons/b/b5/Iridescent.green.sweat.bee1.jpg",
                        },
                    },
                    {
                        "type": "text",
                        "text": "How are these images different?"
                    }
                ],
            }
        ],
    )
    ```
  </Tab>
</Tabs>

</section>
<section title="Contoh: Empat gambar di dua giliran percakapan">

Kemampuan visi Claude bersinar dalam percakapan multimodal yang mencampur gambar dan teks. Anda dapat memiliki pertukaran bolak-balik yang diperpanjang dengan Claude, menambahkan gambar baru atau pertanyaan tindak lanjut kapan saja. Ini memungkinkan alur kerja yang kuat untuk analisis gambar iteratif, perbandingan, atau menggabungkan visual dengan pengetahuan lain.

Minta Claude untuk membedakan dua gambar, kemudian ajukan pertanyaan tindak lanjut membandingkan gambar pertama dengan dua gambar baru.
| Peran | Konten |
| --------- | --------- |
| User | Image 1: \[Image 1\] Image 2: \[Image 2\] How are these images different? |
| Assistant | \[Claude's response\] |
| User | Image 1: \[Image 3\] Image 2: \[Image 4\] Are these images similar to the first two? |
| Assistant | \[Claude's response\] |

Saat menggunakan API, cukup masukkan gambar baru ke dalam array Pesan dalam peran `user` sebagai bagian dari struktur [percakapan multiturn](/docs/id/api/messages) standar.

</section>

---

## Keterbatasan

Meskipun kemampuan pemahaman gambar Claude canggih, ada beberapa keterbatasan yang perlu diperhatikan:

- **Identifikasi orang**: Claude [tidak dapat digunakan](https://www.anthropic.com/legal/aup) untuk mengidentifikasi (yaitu, menyebutkan nama) orang dalam gambar dan akan menolak untuk melakukannya.
- **Akurasi**: Claude mungkin mengalami halusinasi atau membuat kesalahan saat menafsirkan gambar berkualitas rendah, diputar, atau sangat kecil di bawah 200 piksel.
- **Penalaran spasial**: Kemampuan penalaran spasial Claude terbatas. Mungkin kesulitan dengan tugas yang memerlukan lokalisasi presisi atau tata letak, seperti membaca wajah jam analog atau mendeskripsikan posisi pion catur yang tepat.
- **Penghitungan**: Claude dapat memberikan perkiraan jumlah objek dalam gambar tetapi mungkin tidak selalu akurat, terutama dengan jumlah besar objek kecil.
- **Gambar yang dihasilkan AI**: Claude tidak tahu apakah gambar dihasilkan AI dan mungkin salah jika ditanya. Jangan andalkan untuk mendeteksi gambar palsu atau sintetis.
- **Konten yang tidak pantas**: Claude tidak akan memproses gambar yang tidak pantas atau eksplisit yang melanggar [Kebijakan Penggunaan Yang Dapat Diterima](https://www.anthropic.com/legal/aup) kami.
- **Aplikasi kesehatan**: Meskipun Claude dapat menganalisis gambar medis umum, Claude tidak dirancang untuk menafsirkan pemindaian diagnostik kompleks seperti CT atau MRI. Output Claude tidak boleh dianggap sebagai pengganti saran atau diagnosis medis profesional.

Selalu tinjau dan verifikasi interpretasi gambar Claude dengan hati-hati, terutama untuk kasus penggunaan yang berisiko tinggi. Jangan gunakan Claude untuk tugas yang memerlukan presisi sempurna atau analisis gambar sensitif tanpa pengawasan manusia.

---

## FAQ

  <section title="Format file gambar apa yang didukung Claude?">

    Claude saat ini mendukung format gambar JPEG, PNG, GIF, dan WebP, khususnya:
    - `image/jpeg`
    - `image/png`
    - `image/gif`
    - `image/webp`
  
</section>

{" "}

<section title="Bisakah Claude membaca URL gambar?">

  Ya, Claude sekarang dapat memproses gambar dari URL dengan blok sumber gambar URL kami di API.
  Cukup gunakan tipe sumber "url" alih-alih "base64" dalam permintaan API Anda. 
  Contoh:
  ```json
  {
    "type": "image",
    "source": {
      "type": "url",
      "url": "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg"
    }
  }
  ```

</section>

  <section title="Apakah ada batasan ukuran file gambar yang dapat saya unggah?">

    Ya, ada batasan:
    - API: Maksimal 5MB per gambar
    - claude.ai: Maksimal 10MB per gambar

    Gambar yang lebih besar dari batasan ini akan ditolak dan mengembalikan kesalahan saat menggunakan API kami.

  
</section>

  <section title="Berapa banyak gambar yang dapat saya sertakan dalam satu permintaan?">

    Batasan gambar adalah:
    - Messages API: Hingga 100 gambar per permintaan
    - claude.ai: Hingga 20 gambar per giliran

    Permintaan yang melebihi batasan ini akan ditolak dan mengembalikan kesalahan.

  
</section>

{" "}

<section title="Apakah Claude membaca metadata gambar?">

  Tidak, Claude tidak mengurai atau menerima metadata apa pun dari gambar yang diteruskan kepadanya.

</section>

{" "}

<section title="Bisakah saya menghapus gambar yang telah saya unggah?">

  Tidak. Unggahan gambar bersifat sementara dan tidak disimpan di luar durasi permintaan API.
  Gambar yang diunggah secara otomatis dihapus setelah diproses.

</section>

{" "}

<section title="Di mana saya dapat menemukan detail tentang privasi data untuk unggahan gambar?">

  Silakan lihat halaman kebijakan privasi kami untuk informasi tentang cara kami menangani
  gambar yang diunggah dan data lainnya. Kami tidak menggunakan gambar yang diunggah untuk melatih
  model kami.

</section>

  <section title="Bagaimana jika interpretasi gambar Claude tampak salah?">

    Jika interpretasi gambar Claude tampak tidak benar:
    1. Pastikan gambar jelas, berkualitas tinggi, dan berorientasi dengan benar.
    2. Coba teknik prompt engineering untuk meningkatkan hasil.
    3. Jika masalah berlanjut, tandai output di claude.ai (jempol ke atas/bawah) atau hubungi tim dukungan kami.

    Umpan balik Anda membantu kami meningkatkan!

  
</section>

  <section title="Bisakah Claude menghasilkan atau mengedit gambar?">

    Tidak, Claude adalah model pemahaman gambar saja. Ini dapat menginterpretasi dan menganalisis gambar, tetapi tidak dapat menghasilkan, memproduksi, mengedit, memanipulasi, atau membuat gambar.
  
</section>

---

## Pelajari lebih dalam tentang visi

Siap mulai membangun dengan gambar menggunakan Claude? Berikut adalah beberapa sumber daya yang berguna:

- [Multimodal cookbook](https://github.com/anthropics/anthropic-cookbook/tree/main/multimodal): Buku resep ini memiliki tips tentang [memulai dengan gambar](https://github.com/anthropics/anthropic-cookbook/blob/main/multimodal/getting%5Fstarted%5Fwith%5Fvision.ipynb) dan [teknik praktik terbaik](https://github.com/anthropics/anthropic-cookbook/blob/main/multimodal/best%5Fpractices%5Ffor%5Fvision.ipynb) untuk memastikan kinerja berkualitas tertinggi dengan gambar. Lihat bagaimana Anda dapat secara efektif memberi prompt Claude dengan gambar untuk melakukan tugas seperti [menginterpretasi dan menganalisis bagan](https://github.com/anthropics/anthropic-cookbook/blob/main/multimodal/reading%5Fcharts%5Fgraphs%5Fpowerpoints.ipynb) atau [mengekstrak konten dari formulir](https://github.com/anthropics/anthropic-cookbook/blob/main/multimodal/how%5Fto%5Ftranscribe%5Ftext.ipynb).
- [Referensi API](/docs/id/api/messages): Kunjungi dokumentasi kami untuk Messages API, termasuk contoh [panggilan API yang melibatkan gambar](/docs/id/build-with-claude/working-with-messages#vision).

Jika Anda memiliki pertanyaan lain, jangan ragu untuk menghubungi [tim dukungan](https://support.claude.com/) kami. Anda juga dapat bergabung dengan [komunitas pengembang](https://www.anthropic.com/discord) kami untuk terhubung dengan kreator lain dan mendapatkan bantuan dari para ahli Anthropic.