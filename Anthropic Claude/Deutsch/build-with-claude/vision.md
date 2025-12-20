# Vision

Claudes Vision-Funktionen ermöglichen es, Bilder zu verstehen und zu analysieren, was aufregende Möglichkeiten für multimodale Interaktion eröffnet.

---

Diese Anleitung beschreibt, wie man mit Bildern in Claude arbeitet, einschließlich Best Practices, Codebeispiele und Einschränkungen, die zu beachten sind.

---

## So verwenden Sie Vision

Nutzen Sie Claudes Vision-Funktionen über:

- [claude.ai](https://claude.ai/). Laden Sie ein Bild wie eine Datei hoch, oder ziehen Sie ein Bild direkt in das Chat-Fenster.
- Die [Console Workbench](/workbench/). Eine Schaltfläche zum Hinzufügen von Bildern erscheint oben rechts in jedem Benutzernachrichtenblock.
- **API-Anfrage**. Siehe die Beispiele in dieser Anleitung.

---

## Bevor Sie hochladen

### Grundlagen und Limits

Sie können mehrere Bilder in einer einzelnen Anfrage einschließen (bis zu 20 für [claude.ai](https://claude.ai/) und 100 für API-Anfragen). Claude analysiert alle bereitgestellten Bilder bei der Formulierung seiner Antwort. Dies kann hilfreich sein, um Bilder zu vergleichen oder gegenüberzustellen.

Wenn Sie ein Bild größer als 8000x8000 px einreichen, wird es abgelehnt. Wenn Sie mehr als 20 Bilder in einer API-Anfrage einreichen, beträgt dieses Limit 2000x2000 px.

<Note>
Während die API 100 Bilder pro Anfrage unterstützt, gibt es ein [32-MB-Anfragegrößenlimit](/docs/de/api/overview#request-size-limits) für Standard-Endpunkte.
</Note>

### Bildgröße bewerten

Für optimale Leistung empfehlen wir, Bilder vor dem Hochladen zu verkleinern, wenn sie zu groß sind. Wenn die lange Kante Ihres Bildes mehr als 1568 Pixel beträgt oder Ihr Bild mehr als ~1.600 Token hat, wird es zunächst herunterskaliert, wobei das Seitenverhältnis beibehalten wird, bis es innerhalb der Größenlimits liegt.

Wenn Ihr Eingabebild zu groß ist und verkleinert werden muss, erhöht dies die Latenz von [time-to-first-token](/docs/de/about-claude/glossary), ohne Ihnen eine zusätzliche Modellleistung zu geben. Sehr kleine Bilder unter 200 Pixeln auf einer beliebigen Kante können die Leistung beeinträchtigen.

<Tip>
  Um [time-to-first-token](/docs/de/about-claude/glossary) zu verbessern, empfehlen wir,
  Bilder auf nicht mehr als 1,15 Megapixel zu verkleinern (und innerhalb von 1568 Pixeln in
  beiden Dimensionen).
</Tip>

Hier ist eine Tabelle der maximalen Bildgrößen, die von unserer API akzeptiert werden und nicht für gängige Seitenverhältnisse verkleinert werden. Mit Claude Sonnet 4.5 verwenden diese Bilder ungefähr 1.600 Token und kosten etwa 4,80 $/1K Bilder.

| Seitenverhältnis | Bildgröße    |
| --------------- | ------------ |
| 1&#58;1         | 1092x1092 px |
| 3&#58;4         | 951x1268 px  |
| 2&#58;3         | 896x1344 px  |
| 9&#58;16        | 819x1456 px  |
| 1&#58;2         | 784x1568 px  |

### Bildkosten berechnen

Jedes Bild, das Sie in eine Anfrage an Claude einschließen, zählt zu Ihrer Token-Nutzung. Um die ungefähren Kosten zu berechnen, multiplizieren Sie die ungefähre Anzahl der Bild-Token mit dem [Pro-Token-Preis des Modells](https://claude.com/pricing), das Sie verwenden.

Wenn Ihr Bild nicht verkleinert werden muss, können Sie die Anzahl der verwendeten Token durch diesen Algorithmus schätzen: `tokens = (width px * height px)/750`

Hier sind Beispiele für ungefähre Tokenisierung und Kosten für verschiedene Bildgrößen innerhalb der Größenlimits unserer API basierend auf dem Claude Sonnet 4.5 Pro-Token-Preis von 3 $ pro Million Input-Token:

| Bildgröße                      | Anzahl Token | Kosten / Bild | Kosten / 1K Bilder |
| ------------------------------ | ------------ | ------------- | ------------------ |
| 200x200 px (0,04 Megapixel)    | \~54         | \~0,00016 $   | \~0,16 $           |
| 1000x1000 px (1 Megapixel)     | \~1334       | \~0,004 $     | \~4,00 $           |
| 1092x1092 px (1,19 Megapixel)  | \~1590       | \~0,0048 $    | \~4,80 $           |

### Bildqualität sicherstellen

Beachten Sie beim Bereitstellen von Bildern für Claude Folgendes, um die besten Ergebnisse zu erzielen:

- **Bildformat**: Verwenden Sie ein unterstütztes Bildformat: JPEG, PNG, GIF oder WebP.
- **Bildklarheit**: Stellen Sie sicher, dass Bilder klar sind und nicht zu verschwommen oder pixelig sind.
- **Text**: Wenn das Bild wichtigen Text enthält, stellen Sie sicher, dass er lesbar ist und nicht zu klein ist. Vermeiden Sie es, wichtigen visuellen Kontext auszuschneiden, nur um den Text zu vergrößern.

---

## Prompt-Beispiele

Viele der [Prompting-Techniken](/docs/de/build-with-claude/prompt-engineering/overview), die gut für textbasierte Interaktionen mit Claude funktionieren, können auch auf bildbasierte Prompts angewendet werden.

Diese Beispiele demonstrieren Best-Practice-Prompt-Strukturen mit Bildern.

<Tip>
  Wie bei der Platzierung von Dokument-Abfragen funktioniert Claude am besten, wenn Bilder
  vor Text kommen. Bilder, die nach Text platziert oder mit Text vermischt sind, funktionieren immer noch
  gut, aber wenn Ihr Anwendungsfall es zulässt, empfehlen wir eine Bild-dann-Text-
  Struktur.
</Tip>

### Über die Prompt-Beispiele

Die folgenden Beispiele zeigen, wie Sie Claudes Vision-Funktionen mit verschiedenen Programmiersprachen und Ansätzen verwenden. Sie können Bilder an Claude auf drei Arten bereitstellen:

1. Als base64-codiertes Bild in `image` Content-Blöcken
2. Als URL-Referenz zu einem online gehosteten Bild
3. Mit der Files API (einmal hochladen, mehrfach verwenden)

Die base64-Beispiel-Prompts verwenden diese Variablen:

<CodeGroup>
```bash Shell
    # Für URL-basierte Bilder können Sie die URL direkt in Ihrer JSON-Anfrage verwenden
    
    # Für base64-codierte Bilder müssen Sie das Bild zuerst codieren
    # Beispiel zum Codieren eines Bildes zu base64 in bash:
    BASE64_IMAGE_DATA=$(curl -s "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg" | base64)
    
    # Die codierten Daten können jetzt in Ihren API-Aufrufen verwendet werden
```

```python Python
import base64
import httpx

# Für base64-codierte Bilder
image1_url = "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg"
image1_media_type = "image/jpeg"
image1_data = base64.standard_b64encode(httpx.get(image1_url).content).decode("utf-8")

image2_url = "https://upload.wikimedia.org/wikipedia/commons/b/b5/Iridescent.green.sweat.bee1.jpg"
image2_media_type = "image/jpeg"
image2_data = base64.standard_b64encode(httpx.get(image2_url).content).decode("utf-8")

# Für URL-basierte Bilder können Sie die URLs direkt in Ihren Anfragen verwenden
```

```typescript TypeScript
import axios from 'axios';

// Für base64-codierte Bilder
async function getBase64Image(url: string): Promise<string> {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  return Buffer.from(response.data, 'binary').toString('base64');
}

// Verwendung
async function prepareImages() {
  const imageData = await getBase64Image('https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg');
  // Jetzt können Sie imageData in Ihren API-Aufrufen verwenden
}

// Für URL-basierte Bilder können Sie die URLs direkt in Ihren Anfragen verwenden
```

```java Java
import java.io.IOException;
import java.util.Base64;
import java.io.InputStream;
import java.net.URL;

public class ImageHandlingExample {

    public static void main(String[] args) throws IOException, InterruptedException {
        // Für base64-codierte Bilder
        String image1Url = "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg";
        String image1MediaType = "image/jpeg";
        String image1Data = downloadAndEncodeImage(image1Url);

        String image2Url = "https://upload.wikimedia.org/wikipedia/commons/b/b5/Iridescent.green.sweat.bee1.jpg";
        String image2MediaType = "image/jpeg";
        String image2Data = downloadAndEncodeImage(image2Url);

        // Für URL-basierte Bilder können Sie die URLs direkt in Ihren Anfragen verwenden
    }

    private static String downloadAndEncodeImage(String imageUrl) throws IOException {
        try (InputStream inputStream = new URL(imageUrl).openStream()) {
            return Base64.getEncoder().encodeToString(inputStream.readAllBytes());
        }
    }

}
```
</CodeGroup>

Nachfolgend finden Sie Beispiele für die Einbeziehung von Bildern in eine Messages API-Anfrage mit base64-codierten Bildern und URL-Referenzen:

### Base64-codiertes Bildbeispiel

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

### URL-basiertes Bildbeispiel

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

### Files API-Bildbeispiel

Für Bilder, die Sie wiederholt verwenden, oder wenn Sie Codierungsaufwand vermeiden möchten, verwenden Sie die [Files API](/docs/de/build-with-claude/files):

<CodeGroup>
```bash Shell
# Laden Sie Ihr Bild zuerst in die Files API hoch
curl -X POST https://api.anthropic.com/v1/files \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  -F "file=@image.jpg"

# Verwenden Sie dann die zurückgegebene file_id in Ihrer Nachricht
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

# Laden Sie die Bilddatei hoch
with open("image.jpg", "rb") as f:
    file_upload = client.beta.files.upload(file=("image.jpg", f, "image/jpeg"))

# Verwenden Sie die hochgeladene Datei in einer Nachricht
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
  // Laden Sie die Bilddatei hoch
  const fileUpload = await anthropic.beta.files.upload({
    file: toFile(fs.createReadStream('image.jpg'), undefined, { type: "image/jpeg" })
  }, {
    betas: ['files-api-2025-04-14']
  });

  // Verwenden Sie die hochgeladene Datei in einer Nachricht
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

        // Laden Sie die Bilddatei hoch
        File file = client.beta().files().upload(FileUploadParams.builder()
                .file(Files.newInputStream(Path.of("image.jpg")))
                .build());

        // Verwenden Sie die hochgeladene Datei in einer Nachricht
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

Weitere Codebeispiele und Parameterdetails finden Sie unter [Messages API-Beispiele](/docs/de/api/messages).

<section title="Beispiel: Ein Bild">

Es ist am besten, Bilder früher im Prompt zu platzieren als Fragen dazu oder Anweisungen für Aufgaben, die sie verwenden.

Bitten Sie Claude, ein Bild zu beschreiben.

| Rolle | Inhalt                         |
| ----- | ------------------------------ |
| User  | \[Bild\] Beschreiben Sie dieses Bild. |

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
<section title="Beispiel: Mehrere Bilder">

In Situationen mit mehreren Bildern führen Sie jedes Bild mit `Bild 1:` und `Bild 2:` usw. ein. Sie benötigen keine Zeilenumbrüche zwischen Bildern oder zwischen Bildern und dem Prompt.

Bitten Sie Claude, die Unterschiede zwischen mehreren Bildern zu beschreiben.
| Rolle | Inhalt |
| ----- | -------------------------------------------------------------------- |
| User  | Bild 1: \[Bild 1\] Bild 2: \[Bild 2\] Wie unterscheiden sich diese Bilder? |

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
<section title="Beispiel: Mehrere Bilder mit einem System-Prompt">

Bitten Sie Claude, die Unterschiede zwischen mehreren Bildern zu beschreiben, während Sie ihm einen System-Prompt für die Antwort geben.

| Inhalt | |
| ------ | -------------------------------------------------------------------- |
| System | Antworten Sie nur auf Spanisch. |
| User   | Bild 1: \[Bild 1\] Bild 2: \[Bild 2\] Wie unterscheiden sich diese Bilder? |

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
<section title="Beispiel: Vier Bilder über zwei Gesprächsrunden">

Claudes Vision-Funktionen glänzen in multimodalen Gesprächen, die Bilder und Text vermischen. Sie können längere Hin- und Herbewegungen mit Claude führen und jederzeit neue Bilder oder Folgefragen hinzufügen. Dies ermöglicht leistungsstarke Workflows für iterative Bildanalyse, Vergleich oder Kombination von Bildern mit anderen Kenntnissen.

Bitten Sie Claude, zwei Bilder gegenüberzustellen, und stellen Sie dann eine Folgefrage, die die ersten Bilder mit zwei neuen Bildern vergleicht.
| Rolle      | Inhalt |
| ---------- | -------------------------------------------------------------------- |
| User       | Bild 1: \[Bild 1\] Bild 2: \[Bild 2\] Wie unterscheiden sich diese Bilder? |
| Assistant  | \[Claudes Antwort\] |
| User       | Bild 1: \[Bild 3\] Bild 2: \[Bild 4\] Sind diese Bilder ähnlich wie die ersten beiden? |
| Assistant  | \[Claudes Antwort\] |

Bei Verwendung der API fügen Sie einfach neue Bilder in das Array von Messages in der `user` Rolle als Teil einer standardmäßigen [Multiturn-Konversation](/docs/de/api/messages) Struktur ein.

</section>

---

## Einschränkungen

Obwohl Claudes Bildverständnisfähigkeiten hochmodern sind, gibt es einige Einschränkungen zu beachten:

- **Personenerkennung**: Claude [kann nicht verwendet werden](https://www.anthropic.com/legal/aup), um Personen in Bildern zu identifizieren (d. h. zu benennen), und wird sich weigern, dies zu tun.
- **Genauigkeit**: Claude kann halluzinieren oder Fehler machen, wenn er Bilder mit niedriger Qualität, gedrehte oder sehr kleine Bilder unter 200 Pixeln interpretiert.
- **Räumliches Denken**: Claudes Fähigkeiten zum räumlichen Denken sind begrenzt. Es kann bei Aufgaben Schwierigkeiten haben, die präzise Lokalisierung oder Layouts erfordern, wie das Lesen eines analogen Ziffernblatts oder die Beschreibung exakter Positionen von Schachfiguren.
- **Zählen**: Claude kann ungefähre Anzahlen von Objekten in einem Bild angeben, ist aber möglicherweise nicht immer präzise genau, besonders bei großen Mengen kleiner Objekte.
- **KI-generierte Bilder**: Claude weiß nicht, ob ein Bild KI-generiert ist, und kann falsch liegen, wenn er gefragt wird. Verlassen Sie sich nicht darauf, um gefälschte oder synthetische Bilder zu erkennen.
- **Unangemessene Inhalte**: Claude wird unangemessene oder explizite Bilder, die gegen unsere [Acceptable Use Policy](https://www.anthropic.com/legal/aup) verstoßen, nicht verarbeiten.
- **Gesundheitsanwendungen**: Während Claude allgemeine medizinische Bilder analysieren kann, ist es nicht dafür ausgelegt, komplexe diagnostische Scans wie CTs oder MRTs zu interpretieren. Claudes Ausgaben sollten nicht als Ersatz für professionelle medizinische Beratung oder Diagnose angesehen werden.

Überprüfen und verifizieren Sie immer sorgfältig Claudes Bildinterpretationen, besonders bei hochriskanten Anwendungsfällen. Verwenden Sie Claude nicht für Aufgaben, die perfekte Präzision erfordern, oder für sensible Bildanalysen ohne menschliche Aufsicht.

---

## Häufig gestellte Fragen

  <section title="Welche Bilddateitypen unterstützt Claude?">

    Claude unterstützt derzeit die Bilddateiformate JPEG, PNG, GIF und WebP, speziell:
    - `image/jpeg`
    - `image/png`
    - `image/gif`
    - `image/webp`
  
</section>

{" "}

<section title="Kann Claude Bild-URLs lesen?">

  Ja, Claude kann jetzt Bilder von URLs mit unseren URL-Bildquellen-Blöcken in der API verarbeiten.
  Verwenden Sie einfach den "url"-Quellentyp anstelle von "base64" in Ihren API-Anfragen. 
  Beispiel:
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

  <section title="Gibt es eine Grenze für die Bilddateigröße, die ich hochladen kann?">

    Ja, es gibt Grenzen:
    - API: Maximal 5 MB pro Bild
    - claude.ai: Maximal 10 MB pro Bild

    Bilder, die diese Grenzen überschreiten, werden abgelehnt und geben einen Fehler zurück, wenn Sie unsere API verwenden.

  
</section>

  <section title="Wie viele Bilder kann ich in einer Anfrage einbinden?">

    Die Bildgrenzen sind:
    - Messages API: Bis zu 100 Bilder pro Anfrage
    - claude.ai: Bis zu 20 Bilder pro Durchgang

    Anfragen, die diese Grenzen überschreiten, werden abgelehnt und geben einen Fehler zurück.

  
</section>

{" "}

<section title="Liest Claude Bildmetadaten?">

  Nein, Claude analysiert oder empfängt keine Metadaten von Bildern, die an ihn übergeben werden.

</section>

{" "}

<section title="Kann ich hochgeladene Bilder löschen?">

  Nein. Bild-Uploads sind kurzlebig und werden nicht über die Dauer der API-Anfrage hinaus gespeichert. Hochgeladene Bilder werden automatisch gelöscht, nachdem sie verarbeitet wurden.

</section>

{" "}

<section title="Wo finde ich Details zum Datenschutz für Bild-Uploads?">

  Bitte beachten Sie unsere Datenschutzrichtlinienseite für Informationen darüber, wie wir hochgeladene Bilder und andere Daten verarbeiten. Wir verwenden hochgeladene Bilder nicht zum Trainieren unserer Modelle.

</section>

  <section title="Was ist, wenn Claudes Bildinterpretation falsch zu sein scheint?">

    Wenn Claudes Bildinterpretation falsch zu sein scheint:
    1. Stellen Sie sicher, dass das Bild klar, hochwertig und korrekt ausgerichtet ist.
    2. Versuchen Sie Prompt-Engineering-Techniken, um die Ergebnisse zu verbessern.
    3. Wenn das Problem weiterhin besteht, kennzeichnen Sie die Ausgabe in claude.ai (Daumen hoch/runter) oder kontaktieren Sie unser Support-Team.

    Ihr Feedback hilft uns, uns zu verbessern!

  
</section>

  <section title="Kann Claude Bilder generieren oder bearbeiten?">

    Nein, Claude ist ein reines Bildverständnismodell. Es kann Bilder interpretieren und analysieren, aber es kann keine Bilder generieren, erstellen, bearbeiten, manipulieren oder erzeugen.
  
</section>

---

## Tiefer in Vision eintauchen

Bereit, mit Bildern mit Claude zu bauen? Hier sind einige hilfreiche Ressourcen:

- [Multimodales Kochbuch](https://github.com/anthropics/anthropic-cookbook/tree/main/multimodal): Dieses Kochbuch enthält Tipps zum [Einstieg in Bilder](https://github.com/anthropics/anthropic-cookbook/blob/main/multimodal/getting%5Fstarted%5Fwith%5Fvision.ipynb) und [Best-Practice-Techniken](https://github.com/anthropics/anthropic-cookbook/blob/main/multimodal/best%5Fpractices%5Ffor%5Fvision.ipynb), um die höchste Qualitätsleistung mit Bildern zu gewährleisten. Sehen Sie, wie Sie Claude effektiv mit Bildern auffordern können, um Aufgaben wie [Interpretation und Analyse von Diagrammen](https://github.com/anthropics/anthropic-cookbook/blob/main/multimodal/reading%5Fcharts%5Fgraphs%5Fpowerpoints.ipynb) oder [Extrahieren von Inhalten aus Formularen](https://github.com/anthropics/anthropic-cookbook/blob/main/multimodal/how%5Fto%5Ftranscribe%5Ftext.ipynb) auszuführen.
- [API-Referenz](/docs/de/api/messages): Besuchen Sie unsere Dokumentation für die Messages API, einschließlich Beispiel-[API-Aufrufe mit Bildern](/docs/de/build-with-claude/working-with-messages#vision).

Wenn Sie weitere Fragen haben, können Sie sich gerne an unser [Support-Team](https://support.claude.com/) wenden. Sie können auch unserer [Entwickler-Community](https://www.anthropic.com/discord) beitreten, um sich mit anderen Kreativen zu verbinden und Hilfe von Anthropic-Experten zu erhalten.