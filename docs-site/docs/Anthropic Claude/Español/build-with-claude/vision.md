# Visión

Las capacidades de visión de Claude le permiten comprender y analizar imágenes, abriendo posibilidades emocionantes para la interacción multimodal.

---

Esta guía describe cómo trabajar con imágenes en Claude, incluyendo mejores prácticas, ejemplos de código y limitaciones a tener en cuenta.

---

## Cómo usar visión

Usa las capacidades de visión de Claude a través de:

- [claude.ai](https://claude.ai/). Carga una imagen como lo harías con un archivo, o arrastra y suelta una imagen directamente en la ventana de chat.
- El [Workbench de Consola](/workbench/). Un botón para agregar imágenes aparece en la esquina superior derecha de cada bloque de mensaje del Usuario.
- **Solicitud de API**. Consulta los ejemplos en esta guía.

---

## Antes de cargar

### Conceptos básicos y límites

Puedes incluir múltiples imágenes en una sola solicitud (hasta 20 para [claude.ai](https://claude.ai/) y 100 para solicitudes de API). Claude analizará todas las imágenes proporcionadas al formular su respuesta. Esto puede ser útil para comparar o contrastar imágenes.

Si envías una imagen más grande que 8000x8000 px, será rechazada. Si envías más de 20 imágenes en una solicitud de API, este límite es de 2000x2000 px.

<Note>
Aunque la API admite 100 imágenes por solicitud, hay un [límite de tamaño de solicitud de 32MB](/docs/es/api/overview#request-size-limits) para puntos finales estándar.
</Note>

### Evaluar el tamaño de la imagen

Para un rendimiento óptimo, recomendamos cambiar el tamaño de las imágenes antes de cargarlas si son demasiado grandes. Si el borde largo de tu imagen tiene más de 1568 píxeles, o tu imagen tiene más de ~1,600 tokens, primero se reducirá, preservando la relación de aspecto, hasta que esté dentro de los límites de tamaño.

Si tu imagen de entrada es demasiado grande y necesita ser redimensionada, aumentará la latencia del [tiempo hasta el primer token](/docs/es/about-claude/glossary), sin darte ningún rendimiento de modelo adicional. Las imágenes muy pequeñas menores a 200 píxeles en cualquier borde dado pueden degradar el rendimiento.

<Tip>
  Para mejorar el [tiempo hasta el primer token](/docs/es/about-claude/glossary), recomendamos
  cambiar el tamaño de las imágenes a no más de 1.15 megapíxeles (y dentro de 1568 píxeles en
  ambas dimensiones).
</Tip>

Aquí hay una tabla de tamaños máximos de imagen aceptados por nuestra API que no serán redimensionados para relaciones de aspecto comunes. Con Claude Sonnet 4.5, estas imágenes utilizan aproximadamente 1,600 tokens y alrededor de $4.80/1K imágenes.

| Relación de aspecto | Tamaño de imagen |
| ------------------- | ---------------- |
| 1&#58;1             | 1092x1092 px     |
| 3&#58;4             | 951x1268 px      |
| 2&#58;3             | 896x1344 px      |
| 9&#58;16            | 819x1456 px      |
| 1&#58;2             | 784x1568 px      |

### Calcular costos de imagen

Cada imagen que incluyas en una solicitud a Claude cuenta hacia tu uso de tokens. Para calcular el costo aproximado, multiplica el número aproximado de tokens de imagen por el [precio por token del modelo](https://claude.com/pricing) que estés usando.

Si tu imagen no necesita ser redimensionada, puedes estimar el número de tokens utilizados a través de este algoritmo: `tokens = (ancho px * alto px)/750`

Aquí hay ejemplos de tokenización aproximada y costos para diferentes tamaños de imagen dentro de las restricciones de tamaño de nuestra API basados en el precio por token de Claude Sonnet 4.5 de $3 por millón de tokens de entrada:

| Tamaño de imagen              | \# de Tokens | Costo / imagen | Costo / 1K imágenes |
| ----------------------------- | ------------ | -------------- | ------------------- |
| 200x200 px(0.04 megapíxeles)  | \~54         | \~$0.00016     | \~$0.16             |
| 1000x1000 px(1 megapíxel)     | \~1334       | \~$0.004       | \~$4.00             |
| 1092x1092 px(1.19 megapíxeles)| \~1590       | \~$0.0048      | \~$4.80             |

### Asegurar la calidad de la imagen

Al proporcionar imágenes a Claude, ten en cuenta lo siguiente para obtener los mejores resultados:

- **Formato de imagen**: Usa un formato de imagen compatible: JPEG, PNG, GIF o WebP.
- **Claridad de imagen**: Asegúrate de que las imágenes sean claras y no demasiado borrosas o pixeladas.
- **Texto**: Si la imagen contiene texto importante, asegúrate de que sea legible y no demasiado pequeño. Evita recortar el contexto visual clave solo para ampliar el texto.

---

## Ejemplos de prompts

Muchas de las [técnicas de prompting](/docs/es/build-with-claude/prompt-engineering/overview) que funcionan bien para interacciones basadas en texto con Claude también se pueden aplicar a prompts basados en imágenes.

Estos ejemplos demuestran estructuras de prompts de mejores prácticas que involucran imágenes.

<Tip>
  Al igual que con la colocación de consulta de documentos, Claude funciona mejor cuando las imágenes vienen
  antes del texto. Las imágenes colocadas después del texto o interpoladas con texto seguirán funcionando bien, pero si tu caso de uso lo permite, recomendamos una
  estructura de imagen-luego-texto.
</Tip>

### Acerca de los ejemplos de prompts

Los siguientes ejemplos demuestran cómo usar las capacidades de visión de Claude usando varios lenguajes de programación y enfoques. Puedes proporcionar imágenes a Claude de tres formas:

1. Como una imagen codificada en base64 en bloques de contenido `image`
2. Como una referencia de URL a una imagen alojada en línea
3. Usando la API de Archivos (cargar una vez, usar múltiples veces)

Los prompts de ejemplo base64 utilizan estas variables:

<CodeGroup>
```bash Shell
    # Para imágenes basadas en URL, puedes usar la URL directamente en tu solicitud JSON
    
    # Para imágenes codificadas en base64, primero necesitas codificar la imagen
    # Ejemplo de cómo codificar una imagen a base64 en bash:
    BASE64_IMAGE_DATA=$(curl -s "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg" | base64)
    
    # Los datos codificados ahora se pueden usar en tus llamadas de API
```

```python Python
import base64
import httpx

# Para imágenes codificadas en base64
image1_url = "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg"
image1_media_type = "image/jpeg"
image1_data = base64.standard_b64encode(httpx.get(image1_url).content).decode("utf-8")

image2_url = "https://upload.wikimedia.org/wikipedia/commons/b/b5/Iridescent.green.sweat.bee1.jpg"
image2_media_type = "image/jpeg"
image2_data = base64.standard_b64encode(httpx.get(image2_url).content).decode("utf-8")

# Para imágenes basadas en URL, puedes usar las URLs directamente en tus solicitudes
```

```typescript TypeScript
import axios from 'axios';

// Para imágenes codificadas en base64
async function getBase64Image(url: string): Promise<string> {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  return Buffer.from(response.data, 'binary').toString('base64');
}

// Uso
async function prepareImages() {
  const imageData = await getBase64Image('https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg');
  // Ahora puedes usar imageData en tus llamadas de API
}

// Para imágenes basadas en URL, puedes usar las URLs directamente en tus solicitudes
```

```java Java
import java.io.IOException;
import java.util.Base64;
import java.io.InputStream;
import java.net.URL;

public class ImageHandlingExample {

    public static void main(String[] args) throws IOException, InterruptedException {
        // Para imágenes codificadas en base64
        String image1Url = "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg";
        String image1MediaType = "image/jpeg";
        String image1Data = downloadAndEncodeImage(image1Url);

        String image2Url = "https://upload.wikimedia.org/wikipedia/commons/b/b5/Iridescent.green.sweat.bee1.jpg";
        String image2MediaType = "image/jpeg";
        String image2Data = downloadAndEncodeImage(image2Url);

        // Para imágenes basadas en URL, puedes usar las URLs directamente en tus solicitudes
    }

    private static String downloadAndEncodeImage(String imageUrl) throws IOException {
        try (InputStream inputStream = new URL(imageUrl).openStream()) {
            return Base64.getEncoder().encodeToString(inputStream.readAllBytes());
        }
    }

}
```
</CodeGroup>

A continuación se muestran ejemplos de cómo incluir imágenes en una solicitud de API de Mensajes usando imágenes codificadas en base64 y referencias de URL:

### Ejemplo de imagen codificada en base64

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

### Ejemplo de imagen basada en URL

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

### Ejemplo de imagen de API de Archivos

Para imágenes que usarás repetidamente o cuando quieras evitar la sobrecarga de codificación, usa la [API de Archivos](/docs/es/build-with-claude/files):

<CodeGroup>
```bash Shell
# Primero, carga tu imagen a la API de Archivos
curl -X POST https://api.anthropic.com/v1/files \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  -F "file=@image.jpg"

# Luego usa el file_id devuelto en tu mensaje
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

# Carga el archivo de imagen
with open("image.jpg", "rb") as f:
    file_upload = client.beta.files.upload(file=("image.jpg", f, "image/jpeg"))

# Usa el archivo cargado en un mensaje
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
  // Carga el archivo de imagen
  const fileUpload = await anthropic.beta.files.upload({
    file: toFile(fs.createReadStream('image.jpg'), undefined, { type: "image/jpeg" })
  }, {
    betas: ['files-api-2025-04-14']
  });

  // Usa el archivo cargado en un mensaje
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

        // Carga el archivo de imagen
        File file = client.beta().files().upload(FileUploadParams.builder()
                .file(Files.newInputStream(Path.of("image.jpg")))
                .build());

        // Usa el archivo cargado en un mensaje
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

Consulta [ejemplos de API de Mensajes](/docs/es/api/messages) para más código de ejemplo y detalles de parámetros.

<section title="Ejemplo: Una imagen">

Es mejor colocar imágenes más temprano en el prompt que preguntas sobre ellas o instrucciones para tareas que las usan.

Pide a Claude que describa una imagen.

| Rol  | Contenido                      |
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
<section title="Ejemplo: Múltiples imágenes">

En situaciones donde hay múltiples imágenes, introduce cada imagen con `Image 1:` e `Image 2:` y así sucesivamente. No necesitas saltos de línea entre imágenes o entre imágenes y el prompt.

Pide a Claude que describa las diferencias entre múltiples imágenes.
| Rol  | Contenido |
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
<section title="Ejemplo: Múltiples imágenes con un prompt del sistema">

Pide a Claude que describa las diferencias entre múltiples imágenes, mientras le das un prompt del sistema sobre cómo responder.

| Contenido |                                                                           |
| --------- | --------- |
| System    | Respond only in Spanish.                                                  |
| User      | Image 1: \[Image 1\] Image 2: \[Image 2\] How are these images different? |

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
<section title="Ejemplo: Cuatro imágenes en dos turnos de conversación">

Las capacidades de visión de Claude brillan en conversaciones multimodales que mezclan imágenes y texto. Puedes tener intercambios prolongados de ida y vuelta con Claude, agregando nuevas imágenes o preguntas de seguimiento en cualquier momento. Esto permite flujos de trabajo poderosos para análisis iterativo de imágenes, comparación o combinación de elementos visuales con otro conocimiento.

Pide a Claude que contraste dos imágenes, luego haz una pregunta de seguimiento comparando las primeras imágenes con dos imágenes nuevas.
| Rol       | Contenido |
| --------- | --------- |
| User      | Image 1: \[Image 1\] Image 2: \[Image 2\] How are these images different? |
| Assistant | \[Claude's response\] |
| User      | Image 1: \[Image 3\] Image 2: \[Image 4\] Are these images similar to the first two? |
| Assistant | \[Claude's response\] |

Cuando uses la API, simplemente inserta nuevas imágenes en el array de Mensajes en el rol `user` como parte de cualquier estructura de [conversación multiturn](/docs/es/api/messages) estándar.

</section>

---

## Limitaciones

Aunque las capacidades de comprensión de imágenes de Claude son de vanguardia, hay algunas limitaciones a tener en cuenta:

- **Identificación de personas**: Claude [no puede ser usado](https://www.anthropic.com/legal/aup) para identificar (es decir, nombrar) personas en imágenes y se negará a hacerlo.
- **Precisión**: Claude puede alucinar o cometer errores al interpretar imágenes de baja calidad, rotadas o muy pequeñas menores a 200 píxeles.
- **Razonamiento espacial**: Las capacidades de razonamiento espacial de Claude son limitadas. Puede tener dificultades con tareas que requieren localización precisa o diseños, como leer la cara de un reloj analógico o describir posiciones exactas de piezas de ajedrez.
- **Conteo**: Claude puede dar conteos aproximados de objetos en una imagen pero puede no ser siempre precisamente exacto, especialmente con grandes números de objetos pequeños.
- **Imágenes generadas por IA**: Claude no sabe si una imagen es generada por IA y puede ser incorrecto si se le pregunta. No confíes en él para detectar imágenes falsas o sintéticas.
- **Contenido inapropiado**: Claude no procesará imágenes inapropiadas o explícitas que violen nuestra [Política de Uso Aceptable](https://www.anthropic.com/legal/aup).
- **Aplicaciones de atención médica**: Aunque Claude puede analizar imágenes médicas generales, no está diseñado para interpretar escaneos de diagnóstico complejos como CTs o RMNs. Los resultados de Claude no deben considerarse un sustituto del consejo médico profesional o diagnóstico.

Siempre revisa y verifica cuidadosamente las interpretaciones de imágenes de Claude, especialmente para casos de uso de alto riesgo. No uses Claude para tareas que requieran precisión perfecta o análisis de imágenes sensibles sin supervisión humana.

---

## Preguntas frecuentes

  <section title="¿Qué tipos de archivo de imagen admite Claude?">

    Claude actualmente admite formatos de imagen JPEG, PNG, GIF y WebP, específicamente:
    - `image/jpeg`
    - `image/png`
    - `image/gif`
    - `image/webp`
  
</section>

{" "}

<section title="¿Puede Claude leer URLs de imágenes?">

  Sí, Claude ahora puede procesar imágenes desde URLs con nuestros bloques de fuente de imagen URL en la API.
  Simplemente usa el tipo de fuente "url" en lugar de "base64" en tus solicitudes de API. 
  Ejemplo:
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

  <section title="¿Hay un límite para el tamaño del archivo de imagen que puedo cargar?">

    Sí, hay límites:
    - API: Máximo 5MB por imagen
    - claude.ai: Máximo 10MB por imagen

    Las imágenes más grandes que estos límites serán rechazadas y devolverán un error al usar nuestra API.

  
</section>

  <section title="¿Cuántas imágenes puedo incluir en una solicitud?">

    Los límites de imagen son:
    - Messages API: Hasta 100 imágenes por solicitud
    - claude.ai: Hasta 20 imágenes por turno

    Las solicitudes que excedan estos límites serán rechazadas y devolverán un error.

  
</section>

{" "}

<section title="¿Lee Claude los metadatos de la imagen?">

  No, Claude no analiza ni recibe ningún metadato de las imágenes que se le pasan.

</section>

{" "}

<section title="¿Puedo eliminar las imágenes que he cargado?">

  No. Las cargas de imágenes son efímeras y no se almacenan más allá de la duración de la solicitud de API.
  Las imágenes cargadas se eliminan automáticamente después de haber sido procesadas.

</section>

{" "}

<section title="¿Dónde puedo encontrar detalles sobre la privacidad de datos para cargas de imágenes?">

  Consulta nuestra página de política de privacidad para obtener información sobre cómo manejamos
  las imágenes cargadas y otros datos. No utilizamos imágenes cargadas para entrenar nuestros
  modelos.

</section>

  <section title="¿Qué pasa si la interpretación de imagen de Claude parece incorrecta?">

    Si la interpretación de imagen de Claude parece incorrecta:
    1. Asegúrate de que la imagen sea clara, de alta calidad y esté correctamente orientada.
    2. Intenta técnicas de ingeniería de prompts para mejorar los resultados.
    3. Si el problema persiste, marca la salida en claude.ai (pulgar hacia arriba/abajo) o contacta a nuestro equipo de soporte.

    ¡Tu retroalimentación nos ayuda a mejorar!

  
</section>

  <section title="¿Puede Claude generar o editar imágenes?">

    No, Claude es un modelo de comprensión de imágenes únicamente. Puede interpretar y analizar imágenes, pero no puede generar, producir, editar, manipular o crear imágenes.
  
</section>

---

## Profundiza en visión

¿Listo para comenzar a construir con imágenes usando Claude? Aquí hay algunos recursos útiles:

- [Multimodal cookbook](https://github.com/anthropics/anthropic-cookbook/tree/main/multimodal): Este cookbook tiene consejos sobre [cómo comenzar con imágenes](https://github.com/anthropics/anthropic-cookbook/blob/main/multimodal/getting%5Fstarted%5Fwith%5Fvision.ipynb) y [técnicas de mejores prácticas](https://github.com/anthropics/anthropic-cookbook/blob/main/multimodal/best%5Fpractices%5Ffor%5Fvision.ipynb) para asegurar el rendimiento de la más alta calidad con imágenes. Mira cómo puedes indicar efectivamente a Claude con imágenes para llevar a cabo tareas como [interpretar y analizar gráficos](https://github.com/anthropics/anthropic-cookbook/blob/main/multimodal/reading%5Fcharts%5Fgraphs%5Fpowerpoints.ipynb) o [extraer contenido de formularios](https://github.com/anthropics/anthropic-cookbook/blob/main/multimodal/how%5Fto%5Ftranscribe%5Ftext.ipynb).
- [Referencia de API](/docs/es/api/messages): Visita nuestra documentación para la Messages API, incluyendo ejemplos de [llamadas de API que involucran imágenes](/docs/es/build-with-claude/working-with-messages#vision).

Si tienes otras preguntas, no dudes en comunicarte con nuestro [equipo de soporte](https://support.claude.com/). También puedes unirte a nuestra [comunidad de desarrolladores](https://www.anthropic.com/discord) para conectar con otros creadores y obtener ayuda de expertos de Anthropic.