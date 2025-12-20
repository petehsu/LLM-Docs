# Visão

As capacidades de visão do Claude permitem que ele compreenda e analise imagens, abrindo possibilidades empolgantes para interação multimodal.

---

Este guia descreve como trabalhar com imagens no Claude, incluindo melhores práticas, exemplos de código e limitações a serem consideradas.

---

## Como usar visão

Use as capacidades de visão do Claude através de:

- [claude.ai](https://claude.ai/). Carregue uma imagem como faria com um arquivo, ou arraste e solte uma imagem diretamente na janela de chat.
- O [Console Workbench](/workbench/). Um botão para adicionar imagens aparece no canto superior direito de cada bloco de mensagem do Usuário.
- **Requisição de API**. Veja os exemplos neste guia.

---

## Antes de fazer upload

### Noções básicas e limites

Você pode incluir múltiplas imagens em uma única requisição (até 20 para [claude.ai](https://claude.ai/) e 100 para requisições de API). Claude analisará todas as imagens fornecidas ao formular sua resposta. Isso pode ser útil para comparar ou contrastar imagens.

Se você enviar uma imagem maior que 8000x8000 px, ela será rejeitada. Se você enviar mais de 20 imagens em uma requisição de API, este limite é 2000x2000 px.

<Note>
Embora a API suporte 100 imagens por requisição, há um [limite de tamanho de requisição de 32MB](/docs/pt-BR/api/overview#request-size-limits) para endpoints padrão.
</Note>

### Avaliar tamanho da imagem

Para desempenho ideal, recomendamos redimensionar imagens antes de fazer upload se forem muito grandes. Se a borda longa da sua imagem tiver mais de 1568 pixels, ou sua imagem tiver mais de ~1.600 tokens, ela será primeiro reduzida, preservando a proporção de aspecto, até estar dentro dos limites de tamanho.

Se sua imagem de entrada for muito grande e precisar ser redimensionada, isso aumentará a latência do [time-to-first-token](/docs/pt-BR/about-claude/glossary), sem lhe dar nenhum desempenho adicional do modelo. Imagens muito pequenas com menos de 200 pixels em qualquer borda podem degradar o desempenho.

<Tip>
  Para melhorar o [time-to-first-token](/docs/pt-BR/about-claude/glossary), recomendamos
  redimensionar imagens para no máximo 1,15 megapixels (e dentro de 1568 pixels em
  ambas as dimensões).
</Tip>

Aqui está uma tabela dos tamanhos máximos de imagem aceitos pela nossa API que não serão redimensionados para proporções de aspecto comuns. Com Claude Sonnet 4.5, essas imagens usam aproximadamente 1.600 tokens e cerca de $4,80/1K imagens.

| Proporção de aspecto | Tamanho da imagem |
| -------------------- | ----------------- |
| 1&#58;1              | 1092x1092 px      |
| 3&#58;4              | 951x1268 px       |
| 2&#58;3              | 896x1344 px       |
| 9&#58;16             | 819x1456 px       |
| 1&#58;2              | 784x1568 px       |

### Calcular custos de imagem

Cada imagem que você inclui em uma requisição ao Claude conta para seu uso de tokens. Para calcular o custo aproximado, multiplique o número aproximado de tokens de imagem pelo [preço por token do modelo](https://claude.com/pricing) que você está usando.

Se sua imagem não precisar ser redimensionada, você pode estimar o número de tokens usados através deste algoritmo: `tokens = (width px * height px)/750`

Aqui estão exemplos de tokenização aproximada e custos para diferentes tamanhos de imagem dentro das restrições de tamanho da nossa API com base no preço por token do Claude Sonnet 4.5 de $3 por milhão de tokens de entrada:

| Tamanho da imagem                | \# de Tokens | Custo / imagem | Custo / 1K imagens |
| -------------------------------- | ------------ | -------------- | ------------------ |
| 200x200 px(0,04 megapixels)      | \~54         | \~$0,00016     | \~$0,16            |
| 1000x1000 px(1 megapixel)        | \~1334       | \~$0,004       | \~$4,00            |
| 1092x1092 px(1,19 megapixels)    | \~1590       | \~$0,0048      | \~$4,80            |

### Garantindo qualidade de imagem

Ao fornecer imagens ao Claude, tenha em mente o seguinte para melhores resultados:

- **Formato de imagem**: Use um formato de imagem suportado: JPEG, PNG, GIF ou WebP.
- **Clareza da imagem**: Certifique-se de que as imagens são claras e não muito desfocadas ou pixeladas.
- **Texto**: Se a imagem contiver texto importante, certifique-se de que é legível e não muito pequeno. Evite cortar o contexto visual chave apenas para ampliar o texto.

---

## Exemplos de prompt

Muitas das [técnicas de prompting](/docs/pt-BR/build-with-claude/prompt-engineering/overview) que funcionam bem para interações baseadas em texto com Claude também podem ser aplicadas a prompts baseados em imagem.

Estes exemplos demonstram estruturas de prompt de melhores práticas envolvendo imagens.

<Tip>
  Assim como com posicionamento de documento-consulta, Claude funciona melhor quando as imagens vêm
  antes do texto. Imagens colocadas após texto ou interpoladas com texto ainda funcionarão bem,
  mas se seu caso de uso permitir, recomendamos uma estrutura imagem-depois-texto.
</Tip>

### Sobre os exemplos de prompt

Os exemplos a seguir demonstram como usar as capacidades de visão do Claude usando várias linguagens de programação e abordagens. Você pode fornecer imagens ao Claude de três maneiras:

1. Como uma imagem codificada em base64 em blocos de conteúdo `image`
2. Como uma referência de URL para uma imagem hospedada online
3. Usando a Files API (fazer upload uma vez, usar múltiplas vezes)

Os prompts de exemplo base64 usam estas variáveis:

<CodeGroup>
```bash Shell
    # Para imagens baseadas em URL, você pode usar a URL diretamente em sua requisição JSON
    
    # Para imagens codificadas em base64, você precisa primeiro codificar a imagem
    # Exemplo de como codificar uma imagem para base64 em bash:
    BASE64_IMAGE_DATA=$(curl -s "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg" | base64)
    
    # Os dados codificados agora podem ser usados em suas chamadas de API
```

```python Python
import base64
import httpx

# Para imagens codificadas em base64
image1_url = "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg"
image1_media_type = "image/jpeg"
image1_data = base64.standard_b64encode(httpx.get(image1_url).content).decode("utf-8")

image2_url = "https://upload.wikimedia.org/wikipedia/commons/b/b5/Iridescent.green.sweat.bee1.jpg"
image2_media_type = "image/jpeg"
image2_data = base64.standard_b64encode(httpx.get(image2_url).content).decode("utf-8")

# Para imagens baseadas em URL, você pode usar as URLs diretamente em suas requisições
```

```typescript TypeScript
import axios from 'axios';

// Para imagens codificadas em base64
async function getBase64Image(url: string): Promise<string> {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  return Buffer.from(response.data, 'binary').toString('base64');
}

// Uso
async function prepareImages() {
  const imageData = await getBase64Image('https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg');
  // Agora você pode usar imageData em suas chamadas de API
}

// Para imagens baseadas em URL, você pode usar as URLs diretamente em suas requisições
```

```java Java
import java.io.IOException;
import java.util.Base64;
import java.io.InputStream;
import java.net.URL;

public class ImageHandlingExample {

    public static void main(String[] args) throws IOException, InterruptedException {
        // Para imagens codificadas em base64
        String image1Url = "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg";
        String image1MediaType = "image/jpeg";
        String image1Data = downloadAndEncodeImage(image1Url);

        String image2Url = "https://upload.wikimedia.org/wikipedia/commons/b/b5/Iridescent.green.sweat.bee1.jpg";
        String image2MediaType = "image/jpeg";
        String image2Data = downloadAndEncodeImage(image2Url);

        // Para imagens baseadas em URL, você pode usar as URLs diretamente em suas requisições
    }

    private static String downloadAndEncodeImage(String imageUrl) throws IOException {
        try (InputStream inputStream = new URL(imageUrl).openStream()) {
            return Base64.getEncoder().encodeToString(inputStream.readAllBytes());
        }
    }

}
```
</CodeGroup>

Abaixo estão exemplos de como incluir imagens em uma requisição da Messages API usando imagens codificadas em base64 e referências de URL:

### Exemplo de imagem codificada em base64

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

### Exemplo de imagem baseada em URL

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

### Exemplo de imagem da Files API

Para imagens que você usará repetidamente ou quando quiser evitar sobrecarga de codificação, use a [Files API](/docs/pt-BR/build-with-claude/files):

<CodeGroup>
```bash Shell
# Primeiro, faça upload de sua imagem para a Files API
curl -X POST https://api.anthropic.com/v1/files \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  -F "file=@image.jpg"

# Então use o file_id retornado em sua mensagem
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

# Faça upload do arquivo de imagem
with open("image.jpg", "rb") as f:
    file_upload = client.beta.files.upload(file=("image.jpg", f, "image/jpeg"))

# Use o arquivo enviado em uma mensagem
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
  // Faça upload do arquivo de imagem
  const fileUpload = await anthropic.beta.files.upload({
    file: toFile(fs.createReadStream('image.jpg'), undefined, { type: "image/jpeg" })
  }, {
    betas: ['files-api-2025-04-14']
  });

  // Use o arquivo enviado em uma mensagem
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

        // Faça upload do arquivo de imagem
        File file = client.beta().files().upload(FileUploadParams.builder()
                .file(Files.newInputStream(Path.of("image.jpg")))
                .build());

        // Use o arquivo enviado em uma mensagem
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

Veja [exemplos da Messages API](/docs/pt-BR/api/messages) para mais código de exemplo e detalhes de parâmetros.

<section title="Exemplo: Uma imagem">

É melhor colocar imagens mais cedo no prompt do que perguntas sobre elas ou instruções para tarefas que as usam.

Peça ao Claude para descrever uma imagem.

| Função | Conteúdo                       |
| ------ | ------------------------------ |
| Usuário | \[Imagem\] Descreva esta imagem. |

<Tabs>
  <Tab title="Usando Base64">
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
  <Tab title="Usando URL">
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
<section title="Exemplo: Múltiplas imagens">

Em situações onde há múltiplas imagens, introduza cada imagem com `Imagem 1:` e `Imagem 2:` e assim por diante. Você não precisa de quebras de linha entre imagens ou entre imagens e o prompt.

Peça ao Claude para descrever as diferenças entre múltiplas imagens.
| Função | Conteúdo |
| ------ | ----------------------------------------------------------------- |
| Usuário | Imagem 1: \[Imagem 1\] Imagem 2: \[Imagem 2\] Como essas imagens são diferentes? |

<Tabs>
  <Tab title="Usando Base64">
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
  <Tab title="Usando URL">
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
<section title="Exemplo: Múltiplas imagens com um prompt de sistema">

Peça ao Claude para descrever as diferenças entre múltiplas imagens, enquanto lhe dá um prompt de sistema para como responder.

| Conteúdo |                                                                           |
| -------- | ----------------------------------------------------------------- |
| Sistema  | Responda apenas em espanhol.                                                  |
| Usuário    | Imagem 1: \[Imagem 1\] Imagem 2: \[Imagem 2\] Como essas imagens são diferentes? |

<Tabs>
  <Tab title="Usando Base64">
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
  <Tab title="Usando URL">
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
<section title="Exemplo: Quatro imagens em dois turnos de conversa">

As capacidades de visão do Claude brilham em conversas multimodais que misturam imagens e texto. Você pode ter trocas longas e contínuas com Claude, adicionando novas imagens ou perguntas de acompanhamento em qualquer ponto. Isso permite fluxos de trabalho poderosos para análise iterativa de imagens, comparação ou combinação de visuais com outro conhecimento.

Peça ao Claude para contrastar duas imagens, depois faça uma pergunta de acompanhamento comparando as primeiras imagens com duas novas imagens.
| Função | Conteúdo |
| --------- | ----------------------------------------------------------------- |
| Usuário | Imagem 1: \[Imagem 1\] Imagem 2: \[Imagem 2\] Como essas imagens são diferentes? |
| Assistente | \[Resposta do Claude\] |
| Usuário | Imagem 1: \[Imagem 3\] Imagem 2: \[Imagem 4\] Essas imagens são semelhantes às duas primeiras? |
| Assistente | \[Resposta do Claude\] |

Ao usar a API, simplesmente insira novas imagens no array de Mensagens na função `user` como parte de qualquer estrutura padrão de [conversa multiturn](/docs/pt-BR/api/messages).

</section>

---

## Limitações

Embora as capacidades de compreensão de imagem do Claude sejam de ponta, há algumas limitações a serem consideradas:

- **Identificação de pessoas**: Claude [não pode ser usado](https://www.anthropic.com/legal/aup) para identificar (ou seja, nomear) pessoas em imagens e se recusará a fazer isso.
- **Precisão**: Claude pode alucinar ou cometer erros ao interpretar imagens de baixa qualidade, rotacionadas ou muito pequenas com menos de 200 pixels.
- **Raciocínio espacial**: As capacidades de raciocínio espacial do Claude são limitadas. Pode ter dificuldade com tarefas que exigem localização precisa ou layouts, como ler o rosto de um relógio analógico ou descrever posições exatas de peças de xadrez.
- **Contagem**: Claude pode dar contagens aproximadas de objetos em uma imagem, mas pode não ser sempre precisamente preciso, especialmente com grandes números de objetos pequenos.
- **Imagens geradas por IA**: Claude não sabe se uma imagem é gerada por IA e pode estar incorreto se perguntado. Não confie nele para detectar imagens falsas ou sintéticas.
- **Conteúdo inadequado**: Claude não processará imagens inadequadas ou explícitas que violem nossa [Política de Uso Aceitável](https://www.anthropic.com/legal/aup).
- **Aplicações de saúde**: Embora Claude possa analisar imagens médicas gerais, não foi projetado para interpretar varreduras diagnósticas complexas como CTs ou MRIs. Os resultados do Claude não devem ser considerados um substituto para aconselhamento ou diagnóstico médico profissional.

Sempre revise e verifique cuidadosamente as interpretações de imagem do Claude, especialmente para casos de uso de alto risco. Não use Claude para tarefas que exigem precisão perfeita ou análise de imagem sensível sem supervisão humana.

---

## Perguntas Frequentes

  <section title="Quais tipos de arquivo de imagem Claude suporta?">

    Claude atualmente suporta formatos de imagem JPEG, PNG, GIF e WebP, especificamente:
    - `image/jpeg`
    - `image/png`
    - `image/gif`
    - `image/webp`
  
</section>

{" "}

<section title="Claude pode ler URLs de imagens?">

  Sim, Claude agora pode processar imagens de URLs com nossos blocos de fonte de imagem URL na API.
  Simplesmente use o tipo de fonte "url" em vez de "base64" em suas solicitações de API. 
  Exemplo:
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

  <section title="Existe um limite para o tamanho do arquivo de imagem que posso fazer upload?">

    Sim, existem limites:
    - API: Máximo 5MB por imagem
    - claude.ai: Máximo 10MB por imagem

    Imagens maiores que esses limites serão rejeitadas e retornarão um erro ao usar nossa API.

  
</section>

  <section title="Quantas imagens posso incluir em uma solicitação?">

    Os limites de imagem são:
    - Messages API: Até 100 imagens por solicitação
    - claude.ai: Até 20 imagens por turno

    Solicitações que excedem esses limites serão rejeitadas e retornarão um erro.

  
</section>

{" "}

<section title="Claude lê metadados de imagem?">

  Não, Claude não analisa nem recebe nenhum metadado das imagens passadas para ele.

</section>

{" "}

<section title="Posso deletar imagens que fiz upload?">

  Não. Os uploads de imagem são efêmeros e não são armazenados além da duração da solicitação de API.
  As imagens carregadas são automaticamente deletadas após serem processadas.

</section>

{" "}

<section title="Onde posso encontrar detalhes sobre privacidade de dados para uploads de imagem?">

  Consulte nossa página de política de privacidade para obter informações sobre como lidamos
  com imagens carregadas e outros dados. Não usamos imagens carregadas para treinar nossos
  modelos.

</section>

  <section title="E se a interpretação de imagem do Claude parecer errada?">

    Se a interpretação de imagem do Claude parecer incorreta:
    1. Certifique-se de que a imagem é clara, de alta qualidade e está orientada corretamente.
    2. Tente técnicas de engenharia de prompt para melhorar os resultados.
    3. Se o problema persistir, sinalize a saída em claude.ai (polegar para cima/para baixo) ou entre em contato com nossa equipe de suporte.

    Seu feedback nos ajuda a melhorar!

  
</section>

  <section title="Claude pode gerar ou editar imagens?">

    Não, Claude é apenas um modelo de compreensão de imagem. Ele pode interpretar e analisar imagens, mas não pode gerar, produzir, editar, manipular ou criar imagens.
  
</section>

---

## Aprofunde-se na visão

Pronto para começar a construir com imagens usando Claude? Aqui estão alguns recursos úteis:

- [Multimodal cookbook](https://github.com/anthropics/anthropic-cookbook/tree/main/multimodal): Este cookbook tem dicas sobre [como começar com imagens](https://github.com/anthropics/anthropic-cookbook/blob/main/multimodal/getting%5Fstarted%5Fwith%5Fvision.ipynb) e [técnicas de melhores práticas](https://github.com/anthropics/anthropic-cookbook/blob/main/multimodal/best%5Fpractices%5Ffor%5Fvision.ipynb) para garantir o melhor desempenho com imagens. Veja como você pode fazer prompt efetivamente do Claude com imagens para realizar tarefas como [interpretar e analisar gráficos](https://github.com/anthropics/anthropic-cookbook/blob/main/multimodal/reading%5Fcharts%5Fgraphs%5Fpowerpoints.ipynb) ou [extrair conteúdo de formulários](https://github.com/anthropics/anthropic-cookbook/blob/main/multimodal/how%5Fto%5Ftranscribe%5Ftext.ipynb).
- [Referência de API](/docs/pt-BR/api/messages): Visite nossa documentação para a Messages API, incluindo exemplos de [chamadas de API envolvendo imagens](/docs/pt-BR/build-with-claude/working-with-messages#vision).

Se você tiver outras dúvidas, sinta-se à vontade para entrar em contato com nossa [equipe de suporte](https://support.claude.com/). Você também pode se juntar à nossa [comunidade de desenvolvedores](https://www.anthropic.com/discord) para se conectar com outros criadores e obter ajuda de especialistas da Anthropic.