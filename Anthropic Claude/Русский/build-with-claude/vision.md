# Зрение

Возможности зрения Claude позволяют ему понимать и анализировать изображения, открывая захватывающие возможности для мультимодального взаимодействия.

---

Это руководство описывает, как работать с изображениями в Claude, включая лучшие практики, примеры кода и ограничения, которые следует учитывать.

---

## Как использовать зрение

Используйте возможности зрения Claude через:

- [claude.ai](https://claude.ai/). Загрузите изображение как файл или перетащите изображение прямо в окно чата.
- [Console Workbench](/workbench/). Кнопка для добавления изображений появляется в верхнем правом углу каждого блока сообщения пользователя.
- **Запрос API**. См. примеры в этом руководстве.

---

## Перед загрузкой

### Основы и ограничения

Вы можете включить несколько изображений в один запрос (до 20 для [claude.ai](https://claude.ai/) и 100 для запросов API). Claude будет анализировать все предоставленные изображения при формулировании своего ответа. Это может быть полезно для сравнения или противопоставления изображений.

Если вы отправите изображение размером более 8000x8000 пикселей, оно будет отклонено. Если вы отправите более 20 изображений в одном запросе API, это ограничение составляет 2000x2000 пикселей.

<Note>
Хотя API поддерживает 100 изображений на запрос, существует [ограничение размера запроса 32 МБ](/docs/ru/api/overview#request-size-limits) для стандартных конечных точек.
</Note>

### Оценка размера изображения

Для оптимальной производительности мы рекомендуем изменять размер изображений перед загрузкой, если они слишком большие. Если длинный край вашего изображения превышает 1568 пикселей или ваше изображение содержит более ~1600 токенов, оно сначала будет уменьшено, сохраняя соотношение сторон, пока не будет соответствовать ограничениям размера.

Если ваше входное изображение слишком большое и требует изменения размера, это увеличит задержку [time-to-first-token](/docs/ru/about-claude/glossary), не давая вам никакого дополнительного улучшения производительности модели. Очень маленькие изображения размером менее 200 пикселей с любой стороны могут снизить производительность.

<Tip>
  Чтобы улучшить [time-to-first-token](/docs/ru/about-claude/glossary), мы рекомендуем
  изменять размер изображений не более чем до 1,15 мегапикселей (и в пределах 1568 пикселей в
  обоих измерениях).
</Tip>

Вот таблица максимальных размеров изображений, принимаемых нашим API, которые не будут изменены для распространенных соотношений сторон. С Claude Sonnet 4.5 эти изображения используют примерно 1600 токенов и около $4,80 за 1000 изображений.

| Соотношение сторон | Размер изображения |
| ------------ | ------------ |
| 1&#58;1      | 1092x1092 px |
| 3&#58;4      | 951x1268 px  |
| 2&#58;3      | 896x1344 px  |
| 9&#58;16     | 819x1456 px  |
| 1&#58;2      | 784x1568 px  |

### Расчет стоимости изображения

Каждое изображение, которое вы включаете в запрос к Claude, учитывается в использовании токенов. Чтобы рассчитать приблизительную стоимость, умножьте приблизительное количество токенов изображения на [цену за токен модели](https://claude.com/pricing), которую вы используете.

Если ваше изображение не требует изменения размера, вы можете оценить количество используемых токенов с помощью этого алгоритма: `tokens = (width px * height px)/750`

Вот примеры приблизительной токенизации и стоимости для различных размеров изображений в пределах ограничений размера API на основе цены Claude Sonnet 4.5 в размере $3 за миллион входных токенов:

| Размер изображения                    | \# токенов | Стоимость / изображение | Стоимость / 1000 изображений |
| ----------------------------- | ------------ | ------------ | ---------------- |
| 200x200 px (0,04 мегапикселя)   | \~54         | \~$0,00016   | \~$0,16          |
| 1000x1000 px (1 мегапиксель)     | \~1334       | \~$0,004     | \~$4,00          |
| 1092x1092 px (1,19 мегапикселя) | \~1590       | \~$0,0048    | \~$4,80          |

### Обеспечение качества изображения

При предоставлении изображений Claude учитывайте следующее для получения наилучших результатов:

- **Формат изображения**: Используйте поддерживаемый формат изображения: JPEG, PNG, GIF или WebP.
- **Четкость изображения**: Убедитесь, что изображения четкие и не слишком размытые или пиксельные.
- **Текст**: Если изображение содержит важный текст, убедитесь, что он разборчив и не слишком мал. Избегайте обрезания ключевого визуального контекста только для увеличения текста.

---

## Примеры подсказок

Многие из [методов подсказок](/docs/ru/build-with-claude/prompt-engineering/overview), которые хорошо работают для текстовых взаимодействий с Claude, также могут быть применены к подсказкам на основе изображений.

Эти примеры демонстрируют лучшие практики структуры подсказок, включающих изображения.

<Tip>
  Как и при размещении запроса к документу, Claude работает лучше всего, когда изображения идут
  перед текстом. Изображения, размещенные после текста или чередующиеся с текстом, все еще будут
  работать хорошо, но если ваш вариант использования позволяет, мы рекомендуем структуру
  изображение-затем-текст.
</Tip>

### О примерах подсказок

Следующие примеры демонстрируют, как использовать возможности зрения Claude с использованием различных языков программирования и подходов. Вы можете предоставить изображения Claude тремя способами:

1. Как изображение, закодированное в base64, в блоках содержимого `image`
2. Как ссылка URL на изображение, размещенное в Интернете
3. Используя Files API (загрузить один раз, использовать несколько раз)

Примеры подсказок base64 используют эти переменные:

<CodeGroup>
```bash Shell
    # Для изображений на основе URL вы можете использовать URL непосредственно в вашем JSON запросе
    
    # Для изображений, закодированных в base64, вам нужно сначала закодировать изображение
    # Пример кодирования изображения в base64 в bash:
    BASE64_IMAGE_DATA=$(curl -s "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg" | base64)
    
    # Закодированные данные теперь можно использовать в ваших вызовах API
```

```python Python
import base64
import httpx

# Для изображений, закодированных в base64
image1_url = "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg"
image1_media_type = "image/jpeg"
image1_data = base64.standard_b64encode(httpx.get(image1_url).content).decode("utf-8")

image2_url = "https://upload.wikimedia.org/wikipedia/commons/b/b5/Iridescent.green.sweat.bee1.jpg"
image2_media_type = "image/jpeg"
image2_data = base64.standard_b64encode(httpx.get(image2_url).content).decode("utf-8")

# Для изображений на основе URL вы можете использовать URL непосредственно в ваших запросах
```

```typescript TypeScript
import axios from 'axios';

// Для изображений, закодированных в base64
async function getBase64Image(url: string): Promise<string> {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  return Buffer.from(response.data, 'binary').toString('base64');
}

// Использование
async function prepareImages() {
  const imageData = await getBase64Image('https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg');
  // Теперь вы можете использовать imageData в ваших вызовах API
}

// Для изображений на основе URL вы можете использовать URL непосредственно в ваших запросах
```

```java Java
import java.io.IOException;
import java.util.Base64;
import java.io.InputStream;
import java.net.URL;

public class ImageHandlingExample {

    public static void main(String[] args) throws IOException, InterruptedException {
        // Для изображений, закодированных в base64
        String image1Url = "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg";
        String image1MediaType = "image/jpeg";
        String image1Data = downloadAndEncodeImage(image1Url);

        String image2Url = "https://upload.wikimedia.org/wikipedia/commons/b/b5/Iridescent.green.sweat.bee1.jpg";
        String image2MediaType = "image/jpeg";
        String image2Data = downloadAndEncodeImage(image2Url);

        // Для изображений на основе URL вы можете использовать URL непосредственно в ваших запросах
    }

    private static String downloadAndEncodeImage(String imageUrl) throws IOException {
        try (InputStream inputStream = new URL(imageUrl).openStream()) {
            return Base64.getEncoder().encodeToString(inputStream.readAllBytes());
        }
    }

}
```
</CodeGroup>

Ниже приведены примеры того, как включить изображения в запрос Messages API, используя изображения, закодированные в base64, и ссылки на URL:

### Пример изображения, закодированного в base64

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

### Пример изображения на основе URL

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

### Пример Files API для изображений

Для изображений, которые вы будете использовать повторно или когда вы хотите избежать затрат на кодирование, используйте [Files API](/docs/ru/build-with-claude/files):

<CodeGroup>
```bash Shell
# Сначала загрузите ваше изображение в Files API
curl -X POST https://api.anthropic.com/v1/files \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  -F "file=@image.jpg"

# Затем используйте возвращенный file_id в вашем сообщении
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

# Загрузите файл изображения
with open("image.jpg", "rb") as f:
    file_upload = client.beta.files.upload(file=("image.jpg", f, "image/jpeg"))

# Используйте загруженный файл в сообщении
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
  // Загрузите файл изображения
  const fileUpload = await anthropic.beta.files.upload({
    file: toFile(fs.createReadStream('image.jpg'), undefined, { type: "image/jpeg" })
  }, {
    betas: ['files-api-2025-04-14']
  });

  // Используйте загруженный файл в сообщении
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

        // Загрузите файл изображения
        File file = client.beta().files().upload(FileUploadParams.builder()
                .file(Files.newInputStream(Path.of("image.jpg")))
                .build());

        // Используйте загруженный файл в сообщении
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

Дополнительные примеры кода и детали параметров см. в [примерах Messages API](/docs/ru/api/messages).

<section title="Пример: одно изображение">

Лучше всего размещать изображения раньше в подсказке, чем вопросы о них или инструкции для задач, которые их используют.

Попросите Claude описать одно изображение.

| Роль | Содержание                        |
| ---- | ------------------------------ |
| Пользователь | \[Изображение\] Опишите это изображение. |

<Tabs>
  <Tab title="Использование Base64">
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
  <Tab title="Использование URL">
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
<section title="Пример: несколько изображений">

В ситуациях, когда есть несколько изображений, представьте каждое изображение с помощью `Image 1:` и `Image 2:` и так далее. Вам не нужны разрывы строк между изображениями или между изображениями и подсказкой.

Попросите Claude описать различия между несколькими изображениями.
| Роль | Содержание |
| ---- | ------------------------------------------------------------------------- |
| Пользователь | Image 1: \[Изображение 1\] Image 2: \[Изображение 2\] Чем отличаются эти изображения? |

<Tabs>
  <Tab title="Использование Base64">
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
  <Tab title="Использование URL">
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
<section title="Пример: несколько изображений с системной подсказкой">

Попросите Claude описать различия между несколькими изображениями, дав ему системную подсказку о том, как отвечать.

| Содержание |                                                                           |
| ------- | ------------------------------------------------------------------------- |
| Система  | Отвечайте только на испанском языке.                                                  |
| Пользователь    | Image 1: \[Изображение 1\] Image 2: \[Изображение 2\] Чем отличаются эти изображения? |

<Tabs>
  <Tab title="Использование Base64">
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
  <Tab title="Использование URL">
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
<section title="Пример: четыре изображения в двух диалоговых ходах">

Возможности зрения Claude сияют в мультимодальных разговорах, которые смешивают изображения и текст. Вы можете иметь расширенные взаимные обмены с Claude, добавляя новые изображения или вопросы для уточнения в любой момент. Это позволяет использовать мощные рабочие процессы для итеративного анализа изображений, сравнения или объединения визуальных элементов с другими знаниями.

Попросите Claude противопоставить два изображения, а затем задайте вопрос для уточнения, сравнивая первые изображения с двумя новыми изображениями.
| Роль | Содержание |
| --------- | ------------------------------------------------------------------------------------ |
| Пользователь | Image 1: \[Изображение 1\] Image 2: \[Изображение 2\] Чем отличаются эти изображения? |
| Помощник | \[Ответ Claude\] |
| Пользователь | Image 1: \[Изображение 3\] Image 2: \[Изображение 4\] Похожи ли эти изображения на первые два? |
| Помощник | \[Ответ Claude\] |

При использовании API просто вставьте новые изображения в массив Messages в роли `user` как часть любой стандартной структуры [многоходового разговора](/docs/ru/api/messages).

</section>

---

## Ограничения

Хотя возможности понимания изображений Claude являются передовыми, есть некоторые ограничения, о которых следует знать:

- **Идентификация людей**: Claude [не может быть использован](https://www.anthropic.com/legal/aup) для идентификации (т. е. называния) людей на изображениях и будет отказываться это делать.
- **Точность**: Claude может галлюцинировать или делать ошибки при интерпретации низкокачественных, повернутых или очень маленьких изображений размером менее 200 пикселей.
- **Пространственное рассуждение**: Способности пространственного рассуждения Claude ограничены. Он может испытывать трудности с задачами, требующими точной локализации или макетов, такими как чтение циферблата аналоговых часов или описание точных позиций шахматных фигур.
- **Подсчет**: Claude может дать приблизительный подсчет объектов на изображении, но может быть не всегда точным, особенно с большим количеством маленьких объектов.
- **Изображения, созданные ИИ**: Claude не знает, является ли изображение созданным ИИ, и может быть неправ, если его спросить. Не полагайтесь на него для обнаружения поддельных или синтетических изображений.
- **Неприемлемое содержание**: Claude не будет обрабатывать неприемлемые или явные изображения, которые нарушают нашу [Политику приемлемого использования](https://www.anthropic.com/legal/aup).
- **Приложения здравоохранения**: Хотя Claude может анализировать общие медицинские изображения, он не предназначен для интерпретации сложных диагностических сканирований, таких как КТ или МРТ. Результаты Claude не должны рассматриваться как замена профессиональной медицинской консультации или диагностики.

Всегда тщательно проверяйте и верифицируйте интерпретации изображений Claude, особенно для высокорисковых вариантов использования. Не используйте Claude для задач, требующих идеальной точности или чувствительного анализа изображений без надзора человека.

---

## Часто задаваемые вопросы

  <section title="Какие форматы изображений поддерживает Claude?">

    Claude в настоящее время поддерживает форматы изображений JPEG, PNG, GIF и WebP, в частности:
    - `image/jpeg`
    - `image/png`
    - `image/gif`
    - `image/webp`
  
</section>

{" "}

<section title="Может ли Claude читать URL-адреса изображений?">

  Да, Claude теперь может обрабатывать изображения с URL-адресов с помощью блоков источников изображений URL в API.
  Просто используйте тип источника "url" вместо "base64" в ваших запросах API. 
  Пример:
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

  <section title="Есть ли ограничение на размер файла изображения, который я могу загрузить?">

    Да, есть ограничения:
    - API: максимум 5 МБ на одно изображение
    - claude.ai: максимум 10 МБ на одно изображение

    Изображения, превышающие эти ограничения, будут отклонены и вернут ошибку при использовании нашего API.

  
</section>

  <section title="Сколько изображений я могу включить в один запрос?">

    Ограничения на изображения:
    - Messages API: до 100 изображений на один запрос
    - claude.ai: до 20 изображений за один ход

    Запросы, превышающие эти ограничения, будут отклонены и вернут ошибку.

  
</section>

{" "}

<section title="Читает ли Claude метаданные изображений?">

  Нет, Claude не анализирует и не получает никакие метаданные из переданных ему изображений.

</section>

{" "}

<section title="Могу ли я удалить загруженные мною изображения?">

  Нет. Загрузки изображений являются временными и не сохраняются после завершения запроса API.
  Загруженные изображения автоматически удаляются после их обработки.

</section>

{" "}

<section title="Где я могу найти подробную информацию о конфиденциальности данных при загрузке изображений?">

  Пожалуйста, обратитесь к нашей странице политики конфиденциальности для получения информации о том, как мы обрабатываем
  загруженные изображения и другие данные. Мы не используем загруженные изображения для обучения наших
  моделей.

</section>

  <section title="Что если интерпретация изображения Claude кажется неправильной?">

    Если интерпретация изображения Claude кажется неправильной:
    1. Убедитесь, что изображение четкое, высокого качества и правильно ориентировано.
    2. Попробуйте методы инженерии подсказок для улучшения результатов.
    3. Если проблема сохраняется, отметьте результат в claude.ai (большой палец вверх/вниз) или свяжитесь с нашей командой поддержки.

    Ваша обратная связь помогает нам улучшаться!

  
</section>

  <section title="Может ли Claude генерировать или редактировать изображения?">

    Нет, Claude — это модель только для понимания изображений. Она может интерпретировать и анализировать изображения, но не может генерировать, создавать, редактировать, манипулировать или создавать изображения.
  
</section>

---

## Углубленное изучение видения

Готовы начать создавать с изображениями, используя Claude? Вот несколько полезных ресурсов:

- [Мультимодальный справочник](https://github.com/anthropics/anthropic-cookbook/tree/main/multimodal): Этот справочник содержит советы по [началу работы с изображениями](https://github.com/anthropics/anthropic-cookbook/blob/main/multimodal/getting%5Fstarted%5Fwith%5Fvision.ipynb) и [методы лучших практик](https://github.com/anthropics/anthropic-cookbook/blob/main/multimodal/best%5Fpractices%5Ffor%5Fvision.ipynb) для обеспечения наивысшего качества производительности с изображениями. Посмотрите, как вы можете эффективно подсказывать Claude с изображениями для выполнения задач, таких как [интерпретация и анализ диаграмм](https://github.com/anthropics/anthropic-cookbook/blob/main/multimodal/reading%5Fcharts%5Fgraphs%5Fpowerpoints.ipynb) или [извлечение содержимого из форм](https://github.com/anthropics/anthropic-cookbook/blob/main/multimodal/how%5Fto%5Ftranscribe%5Ftext.ipynb).
- [Справочник API](/docs/ru/api/messages): Посетите нашу документацию для Messages API, включая примеры [вызовов API с изображениями](/docs/ru/build-with-claude/working-with-messages#vision).

Если у вас есть какие-либо другие вопросы, не стесняйтесь обращаться к нашей [команде поддержки](https://support.claude.com/). Вы также можете присоединиться к нашему [сообществу разработчиков](https://www.anthropic.com/discord), чтобы общаться с другими создателями и получать помощь от экспертов Anthropic.