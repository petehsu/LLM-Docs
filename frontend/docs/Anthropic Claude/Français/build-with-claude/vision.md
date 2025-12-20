# Vision

Les capacités de vision de Claude lui permettent de comprendre et d'analyser des images, ouvrant des possibilités passionnantes pour l'interaction multimodale.

---

Ce guide décrit comment travailler avec des images dans Claude, y compris les meilleures pratiques, des exemples de code et les limitations à garder à l'esprit.

---

## Comment utiliser la vision

Utilisez les capacités de vision de Claude via :

- [claude.ai](https://claude.ai/). Téléchargez une image comme vous le feriez pour un fichier, ou glissez-déposez une image directement dans la fenêtre de chat.
- Le [Console Workbench](/workbench/). Un bouton pour ajouter des images apparaît en haut à droite de chaque bloc de message utilisateur.
- **Requête API**. Voir les exemples dans ce guide.

---

## Avant de télécharger

### Bases et limites

Vous pouvez inclure plusieurs images dans une seule requête (jusqu'à 20 pour [claude.ai](https://claude.ai/) et 100 pour les requêtes API). Claude analysera toutes les images fournies lors de la formulation de sa réponse. Cela peut être utile pour comparer ou contraster des images.

Si vous soumettez une image plus grande que 8000x8000 px, elle sera rejetée. Si vous soumettez plus de 20 images dans une requête API, cette limite est de 2000x2000 px.

<Note>
Bien que l'API supporte 100 images par requête, il existe une [limite de taille de requête de 32 Mo](/docs/fr/api/overview#request-size-limits) pour les points de terminaison standard.
</Note>

### Évaluer la taille de l'image

Pour des performances optimales, nous recommandons de redimensionner les images avant de les télécharger si elles sont trop grandes. Si le bord long de votre image dépasse 1568 pixels, ou si votre image dépasse environ 1 600 tokens, elle sera d'abord réduite, en préservant le rapport d'aspect, jusqu'à ce qu'elle soit dans les limites de taille.

Si votre image d'entrée est trop grande et doit être redimensionnée, cela augmentera la latence du [time-to-first-token](/docs/fr/about-claude/glossary), sans vous donner de performance de modèle supplémentaire. Les très petites images de moins de 200 pixels sur un bord donné peuvent dégrader les performances.

<Tip>
  Pour améliorer le [time-to-first-token](/docs/fr/about-claude/glossary), nous recommandons
  de redimensionner les images à pas plus de 1,15 mégapixels (et dans 1568 pixels dans
  les deux dimensions).
</Tip>

Voici un tableau des tailles d'image maximales acceptées par notre API qui ne seront pas redimensionnées pour les rapports d'aspect courants. Avec Claude Sonnet 4.5, ces images utilisent environ 1 600 tokens et environ 4,80 $/1 000 images.

| Rapport d'aspect | Taille de l'image |
| ------------ | ------------ |
| 1&#58;1      | 1092x1092 px |
| 3&#58;4      | 951x1268 px  |
| 2&#58;3      | 896x1344 px  |
| 9&#58;16     | 819x1456 px  |
| 1&#58;2      | 784x1568 px  |

### Calculer les coûts des images

Chaque image que vous incluez dans une requête à Claude compte dans votre utilisation de tokens. Pour calculer le coût approximatif, multipliez le nombre approximatif de tokens d'image par le [prix par token du modèle](https://claude.com/pricing) que vous utilisez.

Si votre image n'a pas besoin d'être redimensionnée, vous pouvez estimer le nombre de tokens utilisés via cet algorithme : `tokens = (width px * height px)/750`

Voici des exemples de tokenisation approximative et de coûts pour différentes tailles d'image dans les contraintes de taille de notre API basées sur le prix par token de Claude Sonnet 4.5 de 3 $ par million de tokens d'entrée :

| Taille de l'image                    | Nombre de tokens | Coût / image | Coût / 1 000 images |
| ----------------------------- | ------------ | ------------ | ---------------- |
| 200x200 px(0,04 mégapixels)   | \~54         | \~0,00016 $   | \~0,16 $          |
| 1000x1000 px(1 mégapixel)     | \~1334       | \~0,004 $     | \~4,00 $          |
| 1092x1092 px(1,19 mégapixels) | \~1590       | \~0,0048 $    | \~4,80 $          |

### Assurer la qualité de l'image

Lorsque vous fournissez des images à Claude, gardez à l'esprit les points suivants pour de meilleurs résultats :

- **Format d'image** : Utilisez un format d'image supporté : JPEG, PNG, GIF ou WebP.
- **Clarté de l'image** : Assurez-vous que les images sont claires et pas trop floues ou pixelisées.
- **Texte** : Si l'image contient du texte important, assurez-vous qu'il est lisible et pas trop petit. Évitez de recadrer le contexte visuel clé juste pour agrandir le texte.

---

## Exemples de prompts

Beaucoup des [techniques de prompting](/docs/fr/build-with-claude/prompt-engineering/overview) qui fonctionnent bien pour les interactions textuelles avec Claude peuvent également être appliquées aux prompts basés sur des images.

Ces exemples démontrent les meilleures structures de prompts impliquant des images.

<Tip>
  Tout comme avec le placement de requête de document, Claude fonctionne mieux lorsque les images viennent
  avant le texte. Les images placées après le texte ou interpolées avec le texte fonctionneront toujours bien,
  mais si votre cas d'usage le permet, nous recommandons une structure image-puis-texte.
</Tip>

### À propos des exemples de prompts

Les exemples suivants démontrent comment utiliser les capacités de vision de Claude en utilisant divers langages de programmation et approches. Vous pouvez fournir des images à Claude de trois façons :

1. Comme une image codée en base64 dans les blocs de contenu `image`
2. Comme une référence URL à une image hébergée en ligne
3. En utilisant l'API Files (télécharger une fois, utiliser plusieurs fois)

Les exemples de prompts en base64 utilisent ces variables :

<CodeGroup>
```bash Shell
    # Pour les images basées sur URL, vous pouvez utiliser l'URL directement dans votre requête JSON
    
    # Pour les images codées en base64, vous devez d'abord encoder l'image
    # Exemple de comment encoder une image en base64 dans bash :
    BASE64_IMAGE_DATA=$(curl -s "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg" | base64)
    
    # Les données encodées peuvent maintenant être utilisées dans vos appels API
```

```python Python
import base64
import httpx

# Pour les images codées en base64
image1_url = "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg"
image1_media_type = "image/jpeg"
image1_data = base64.standard_b64encode(httpx.get(image1_url).content).decode("utf-8")

image2_url = "https://upload.wikimedia.org/wikipedia/commons/b/b5/Iridescent.green.sweat.bee1.jpg"
image2_media_type = "image/jpeg"
image2_data = base64.standard_b64encode(httpx.get(image2_url).content).decode("utf-8")

# Pour les images basées sur URL, vous pouvez utiliser les URL directement dans vos requêtes
```

```typescript TypeScript
import axios from 'axios';

// Pour les images codées en base64
async function getBase64Image(url: string): Promise<string> {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  return Buffer.from(response.data, 'binary').toString('base64');
}

// Utilisation
async function prepareImages() {
  const imageData = await getBase64Image('https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg');
  // Maintenant vous pouvez utiliser imageData dans vos appels API
}

// Pour les images basées sur URL, vous pouvez utiliser les URL directement dans vos requêtes
```

```java Java
import java.io.IOException;
import java.util.Base64;
import java.io.InputStream;
import java.net.URL;

public class ImageHandlingExample {

    public static void main(String[] args) throws IOException, InterruptedException {
        // Pour les images codées en base64
        String image1Url = "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg";
        String image1MediaType = "image/jpeg";
        String image1Data = downloadAndEncodeImage(image1Url);

        String image2Url = "https://upload.wikimedia.org/wikipedia/commons/b/b5/Iridescent.green.sweat.bee1.jpg";
        String image2MediaType = "image/jpeg";
        String image2Data = downloadAndEncodeImage(image2Url);

        // Pour les images basées sur URL, vous pouvez utiliser les URL directement dans vos requêtes
    }

    private static String downloadAndEncodeImage(String imageUrl) throws IOException {
        try (InputStream inputStream = new URL(imageUrl).openStream()) {
            return Base64.getEncoder().encodeToString(inputStream.readAllBytes());
        }
    }

}
```
</CodeGroup>

Voici des exemples de comment inclure des images dans une requête Messages API en utilisant des images codées en base64 et des références URL :

### Exemple d'image codée en base64

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

### Exemple d'image basée sur URL

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

### Exemple d'image avec l'API Files

Pour les images que vous utiliserez à plusieurs reprises ou lorsque vous voulez éviter les frais d'encodage, utilisez l'[API Files](/docs/fr/build-with-claude/files) :

<CodeGroup>
```bash Shell
# D'abord, téléchargez votre image vers l'API Files
curl -X POST https://api.anthropic.com/v1/files \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  -F "file=@image.jpg"

# Ensuite, utilisez le file_id retourné dans votre message
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

# Téléchargez le fichier image
with open("image.jpg", "rb") as f:
    file_upload = client.beta.files.upload(file=("image.jpg", f, "image/jpeg"))

# Utilisez le fichier téléchargé dans un message
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
  // Téléchargez le fichier image
  const fileUpload = await anthropic.beta.files.upload({
    file: toFile(fs.createReadStream('image.jpg'), undefined, { type: "image/jpeg" })
  }, {
    betas: ['files-api-2025-04-14']
  });

  // Utilisez le fichier téléchargé dans un message
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

        // Téléchargez le fichier image
        File file = client.beta().files().upload(FileUploadParams.builder()
                .file(Files.newInputStream(Path.of("image.jpg")))
                .build());

        // Utilisez le fichier téléchargé dans un message
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

Voir [Exemples de l'API Messages](/docs/fr/api/messages) pour plus d'exemples de code et de détails sur les paramètres.

<section title="Exemple : Une image">

Il est préférable de placer les images plus tôt dans le prompt que les questions à leur sujet ou les instructions pour les tâches qui les utilisent.

Demandez à Claude de décrire une image.

| Rôle | Contenu                        |
| ---- | ------------------------------ |
| Utilisateur | \[Image\] Describe this image. |

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
<section title="Exemple : Plusieurs images">

Dans les situations où il y a plusieurs images, présentez chaque image avec `Image 1:` et `Image 2:` et ainsi de suite. Vous n'avez pas besoin de sauts de ligne entre les images ou entre les images et le prompt.

Demandez à Claude de décrire les différences entre plusieurs images.
| Rôle | Contenu |
| ---- | ------------------------------------------------------------------------- |
| Utilisateur | Image 1: \[Image 1\] Image 2: \[Image 2\] How are these images different? |

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
<section title="Exemple : Plusieurs images avec un system prompt">

Demandez à Claude de décrire les différences entre plusieurs images, tout en lui donnant un system prompt pour comment répondre.

| Contenu |                                                                           |
| ------- | ------------------------------------------------------------------------- |
| Système  | Respond only in Spanish.                                                  |
| Utilisateur    | Image 1: \[Image 1\] Image 2: \[Image 2\] How are these images different? |

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
<section title="Exemple : Quatre images sur deux tours de conversation">

Les capacités de vision de Claude brillent dans les conversations multimodales qui mélangent images et texte. Vous pouvez avoir des échanges prolongés et bidirectionnels avec Claude, en ajoutant de nouvelles images ou des questions de suivi à tout moment. Cela permet des flux de travail puissants pour l'analyse itérative d'images, la comparaison ou la combinaison de visuels avec d'autres connaissances.

Demandez à Claude de contraster deux images, puis posez une question de suivi comparant les premières images à deux nouvelles images.
| Rôle | Contenu |
| --------- | ------------------------------------------------------------------------------------ |
| Utilisateur | Image 1: \[Image 1\] Image 2: \[Image 2\] How are these images different? |
| Assistant | \[Claude's response\] |
| Utilisateur | Image 1: \[Image 3\] Image 2: \[Image 4\] Are these images similar to the first two? |
| Assistant | \[Claude's response\] |

Lors de l'utilisation de l'API, insérez simplement de nouvelles images dans le tableau de Messages dans le rôle `user` dans le cadre de toute structure de [conversation multitour](/docs/fr/api/messages) standard.

</section>

---

## Limitations

Bien que les capacités de compréhension d'images de Claude soient à la pointe de la technologie, il y a quelques limitations à connaître :

- **Identification des personnes** : Claude [ne peut pas être utilisé](https://www.anthropic.com/legal/aup) pour identifier (c'est-à-dire nommer) les personnes dans les images et refusera de le faire.
- **Précision** : Claude peut halluciner ou faire des erreurs lors de l'interprétation d'images de faible qualité, tournées ou très petites de moins de 200 pixels.
- **Raisonnement spatial** : Les capacités de raisonnement spatial de Claude sont limitées. Il peut avoir du mal avec les tâches nécessitant une localisation précise ou des mises en page, comme lire le cadran d'une horloge analogique ou décrire les positions exactes des pièces d'échecs.
- **Comptage** : Claude peut donner des comptages approximatifs d'objets dans une image mais peut ne pas toujours être précis, en particulier avec de grands nombres de petits objets.
- **Images générées par l'IA** : Claude ne sait pas si une image est générée par l'IA et peut se tromper si on lui demande. Ne vous fiez pas à lui pour détecter les images fausses ou synthétiques.
- **Contenu inapproprié** : Claude ne traitera pas les images inappropriées ou explicites qui violent notre [Politique d'utilisation acceptable](https://www.anthropic.com/legal/aup).
- **Applications de santé** : Bien que Claude puisse analyser des images médicales générales, il n'est pas conçu pour interpréter des scans diagnostiques complexes tels que les tomodensitométries ou les IRM. Les résultats de Claude ne doivent pas être considérés comme un substitut aux conseils ou diagnostics médicaux professionnels.

Examinez toujours attentivement et vérifiez les interprétations d'images de Claude, en particulier pour les cas d'usage à enjeux élevés. N'utilisez pas Claude pour les tâches nécessitant une précision parfaite ou l'analyse d'images sensibles sans surveillance humaine.

---

## FAQ

  <section title="Quels types de fichiers image Claude supporte-t-il ?">

    Claude supporte actuellement les formats d'image JPEG, PNG, GIF et WebP, spécifiquement :
    - `image/jpeg`
    - `image/png`
    - `image/gif`
    - `image/webp`
  
</section>

{" "}

<section title="Claude peut-il lire les URL d'images ?">

  Oui, Claude peut maintenant traiter les images à partir d'URL avec nos blocs de source d'image URL dans l'API.
  Utilisez simplement le type de source « url » au lieu de « base64 » dans vos requêtes API. 
  Exemple :
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

  <section title="Y a-t-il une limite à la taille du fichier image que je peux télécharger ?">

    Oui, il y a des limites :
    - API : Maximum 5 Mo par image
    - claude.ai : Maximum 10 Mo par image

    Les images dépassant ces limites seront rejetées et retourneront une erreur lors de l'utilisation de notre API.

  
</section>

  <section title="Combien d'images puis-je inclure dans une seule requête ?">

    Les limites d'image sont :
    - Messages API : Jusqu'à 100 images par requête
    - claude.ai : Jusqu'à 20 images par tour

    Les requêtes dépassant ces limites seront rejetées et retourneront une erreur.

  
</section>

{" "}

<section title="Claude lit-il les métadonnées d'image ?">

  Non, Claude n'analyse pas et ne reçoit aucune métadonnée des images qui lui sont transmises.

</section>

{" "}

<section title="Puis-je supprimer les images que j'ai téléchargées ?">

  Non. Les téléchargements d'images sont éphémères et ne sont pas stockés au-delà de la durée de la requête API.
  Les images téléchargées sont automatiquement supprimées après leur traitement.

</section>

{" "}

<section title="Où puis-je trouver des détails sur la confidentialité des données pour les téléchargements d'images ?">

  Veuillez consulter notre page de politique de confidentialité pour obtenir des informations sur la façon dont nous traitons
  les images téléchargées et autres données. Nous n'utilisons pas les images téléchargées pour entraîner nos
  modèles.

</section>

  <section title="Et si l'interprétation d'image de Claude semble incorrecte ?">

    Si l'interprétation d'image de Claude semble incorrecte :
    1. Assurez-vous que l'image est claire, de haute qualité et correctement orientée.
    2. Essayez des techniques d'ingénierie de prompt pour améliorer les résultats.
    3. Si le problème persiste, signalez la sortie dans claude.ai (pouces vers le haut/bas) ou contactez notre équipe d'assistance.

    Vos commentaires nous aident à nous améliorer !

  
</section>

  <section title="Claude peut-il générer ou modifier des images ?">

    Non, Claude est un modèle de compréhension d'image uniquement. Il peut interpréter et analyser les images, mais il ne peut pas générer, produire, modifier, manipuler ou créer des images.
  
</section>

---

## Approfondissez votre compréhension de la vision

Prêt à commencer à construire avec des images en utilisant Claude ? Voici quelques ressources utiles :

- [Multimodal cookbook](https://github.com/anthropics/anthropic-cookbook/tree/main/multimodal) : Ce cookbook contient des conseils sur [la prise en main des images](https://github.com/anthropics/anthropic-cookbook/blob/main/multimodal/getting%5Fstarted%5Fwith%5Fvision.ipynb) et [les techniques de bonnes pratiques](https://github.com/anthropics/anthropic-cookbook/blob/main/multimodal/best%5Fpractices%5Ffor%5Fvision.ipynb) pour assurer les meilleures performances avec les images. Découvrez comment vous pouvez inviter efficacement Claude avec des images pour effectuer des tâches telles que [l'interprétation et l'analyse de graphiques](https://github.com/anthropics/anthropic-cookbook/blob/main/multimodal/reading%5Fcharts%5Fgraphs%5Fpowerpoints.ipynb) ou [l'extraction de contenu à partir de formulaires](https://github.com/anthropics/anthropic-cookbook/blob/main/multimodal/how%5Fto%5Ftranscribe%5Ftext.ipynb).
- [Référence API](/docs/fr/api/messages) : Visitez notre documentation pour l'API Messages, y compris des exemples [d'appels API impliquant des images](/docs/fr/build-with-claude/working-with-messages#vision).

Si vous avez d'autres questions, n'hésitez pas à contacter notre [équipe d'assistance](https://support.claude.com/). Vous pouvez également rejoindre notre [communauté de développeurs](https://www.anthropic.com/discord) pour vous connecter avec d'autres créateurs et obtenir de l'aide d'experts Anthropic.