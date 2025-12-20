# Support PDF

Traitez des PDF avec Claude. Extrayez du texte, analysez des graphiques et comprenez le contenu visuel de vos documents.

---

Vous pouvez maintenant interroger Claude sur n'importe quel texte, images, graphiques et tableaux dans les PDF que vous fournissez. Quelques exemples d'utilisation :
- Analyser des rapports financiers et comprendre les graphiques/tableaux
- Extraire des informations clés de documents juridiques
- Assistance à la traduction pour les documents
- Convertir les informations de documents en formats structurés

## Avant de commencer

### Vérifiez les exigences PDF
Claude fonctionne avec n'importe quel PDF standard. Cependant, vous devez vous assurer que la taille de votre demande respecte ces exigences lors de l'utilisation du support PDF :

| Exigence | Limite |
|---|---|
| Taille maximale de demande | 32MB |
| Pages maximales par demande | 100 |
| Format | PDF standard (pas de mots de passe/chiffrement) |

Veuillez noter que les deux limites s'appliquent à l'ensemble de la charge utile de la demande, y compris tout autre contenu envoyé avec les PDF.

Étant donné que le support PDF s'appuie sur les capacités de vision de Claude, il est soumis aux mêmes [limitations et considérations](/docs/fr/build-with-claude/vision#limitations) que les autres tâches de vision.

### Plateformes et modèles pris en charge

Le support PDF est actuellement pris en charge via l'accès direct à l'API et Google Vertex AI. Tous les [modèles actifs](/docs/fr/about-claude/models/overview) prennent en charge le traitement PDF.

Le support PDF est maintenant disponible sur Amazon Bedrock avec les considérations suivantes :

### Support PDF Amazon Bedrock

Lors de l'utilisation du support PDF via l'API Converse d'Amazon Bedrock, il existe deux modes distincts de traitement de documents :

<Note>
**Important** : Pour accéder aux capacités complètes de compréhension visuelle PDF de Claude dans l'API Converse, vous devez activer les citations. Sans les citations activées, l'API revient à l'extraction de texte de base uniquement. En savoir plus sur [travailler avec les citations](/docs/fr/build-with-claude/citations).
</Note>

#### Modes de traitement de documents

1. **Chat de document Converse** (Mode original - Extraction de texte uniquement)
   - Fournit une extraction de texte de base à partir des PDF
   - Ne peut pas analyser les images, graphiques ou mises en page visuelles dans les PDF
   - Utilise environ 1 000 jetons pour un PDF de 3 pages
   - Automatiquement utilisé lorsque les citations ne sont pas activées

2. **Chat PDF Claude** (Nouveau mode - Compréhension visuelle complète)
   - Fournit une analyse visuelle complète des PDF
   - Peut comprendre et analyser les graphiques, diagrammes, images et mises en page visuelles
   - Traite chaque page à la fois comme texte et image pour une compréhension complète
   - Utilise environ 7 000 jetons pour un PDF de 3 pages
   - **Nécessite que les citations soient activées** dans l'API Converse

#### Limitations clés

- **API Converse** : L'analyse visuelle PDF nécessite que les citations soient activées. Il n'y a actuellement aucune option pour utiliser l'analyse visuelle sans citations (contrairement à l'API InvokeModel).
- **API InvokeModel** : Fournit un contrôle complet sur le traitement PDF sans citations forcées.

#### Problèmes courants

Si les clients signalent que Claude ne voit pas les images ou graphiques dans leurs PDF lors de l'utilisation de l'API Converse, ils doivent probablement activer le flag des citations. Sans cela, Converse revient à l'extraction de texte de base uniquement.

<Note>
Il s'agit d'une contrainte connue avec l'API Converse que nous travaillons à résoudre. Pour les applications qui nécessitent une analyse visuelle PDF sans citations, envisagez d'utiliser l'API InvokeModel à la place.
</Note>

<Note>
Pour les fichiers non-PDF comme .csv, .xlsx, .docx, .md, ou .txt, voir [Travailler avec d'autres formats de fichiers](/docs/fr/build-with-claude/files#working-with-other-file-formats).
</Note>

***

## Traiter des PDF avec Claude

### Envoyez votre première demande PDF
Commençons par un exemple simple utilisant l'API Messages. Vous pouvez fournir des PDF à Claude de trois façons :

1. Comme une référence URL vers un PDF hébergé en ligne
2. Comme un PDF encodé en base64 dans des blocs de contenu `document`  
3. Par un `file_id` de l'[API Files](/docs/fr/build-with-claude/files)

#### Option 1 : Document PDF basé sur URL

L'approche la plus simple est de référencer un PDF directement depuis une URL :

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
                "text": "Quelles sont les principales conclusions de ce document ?"
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
                        "text": "Quelles sont les principales conclusions de ce document ?"
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
                text: 'Quelles sont les principales conclusions de ce document ?',
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
 .text("Quelles sont les principales conclusions de ce document ?")
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

#### Option 2 : Document PDF encodé en Base64

Si vous devez envoyer des PDF depuis votre système local ou lorsqu'une URL n'est pas disponible :

<CodeGroup>
    ```bash Shell
    # Méthode 1 : Récupérer et encoder un PDF distant
    curl -s "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf" | base64 | tr -d '\n' > pdf_base64.txt

    # Méthode 2 : Encoder un fichier PDF local
    # base64 document.pdf | tr -d '\n' > pdf_base64.txt

    # Créer un fichier de demande JSON utilisant le contenu pdf_base64.txt
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
                "text": "Quelles sont les principales conclusions de ce document ?"
            }]
        }]
    }' > request.json

    # Envoyer la demande API en utilisant le fichier JSON
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

    # D'abord, charger et encoder le PDF 
    pdf_url = "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf"
    pdf_data = base64.standard_b64encode(httpx.get(pdf_url).content).decode("utf-8")

    # Alternative : Charger depuis un fichier local
    # with open("document.pdf", "rb") as f:
    #     pdf_data = base64.standard_b64encode(f.read()).decode("utf-8")

    # Envoyer à Claude en utilisant l'encodage base64
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
                        "text": "Quelles sont les principales conclusions de ce document ?"
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
      // Méthode 1 : Récupérer et encoder un PDF distant
      const pdfURL = "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf";
      const pdfResponse = await fetch(pdfURL);
      const arrayBuffer = await pdfResponse.arrayBuffer();
      const pdfBase64 = Buffer.from(arrayBuffer).toString('base64');
      
      // Méthode 2 : Charger depuis un fichier local
      // const pdfBase64 = fs.readFileSync('document.pdf').toString('base64');
      
      // Envoyer la demande API avec le PDF encodé en base64
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
                text: 'Quelles sont les principales conclusions de ce document ?',
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

            // Méthode 1 : Télécharger et encoder un PDF distant
            String pdfUrl = "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf";
            HttpClient httpClient = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(pdfUrl))
                    .GET()
                    .build();

            HttpResponse<byte[]> response = httpClient.send(request, HttpResponse.BodyHandlers.ofByteArray());
            String pdfBase64 = Base64.getEncoder().encodeToString(response.body());

            // Méthode 2 : Charger depuis un fichier local
            // byte[] fileBytes = Files.readAllBytes(Path.of("document.pdf"));
            // String pdfBase64 = Base64.getEncoder().encodeToString(fileBytes);

            // Créer un bloc de document avec des données base64
            DocumentBlockParam documentParam = DocumentBlockParam.builder()
                    .base64PdfSource(pdfBase64)
                    .build();

            // Créer un message avec des blocs de contenu document et texte
            MessageCreateParams params = MessageCreateParams.builder()
                    .model(Model.CLAUDE_OPUS_4_20250514)
                    .maxTokens(1024)
                    .addUserMessageOfBlockParams(
                            List.of(
 ContentBlockParam.ofDocument(documentParam),
 ContentBlockParam.ofText(TextBlockParam.builder().text("Quelles sont les principales conclusions de ce document ?").build())
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

#### Option 3 : API Files

Pour les PDF que vous utiliserez de manière répétée, ou lorsque vous voulez éviter la surcharge d'encodage, utilisez l'[API Files](/docs/fr/build-with-claude/files) : 

<CodeGroup>
```bash Shell
# D'abord, téléchargez votre PDF vers l'API Files
curl -X POST https://api.anthropic.com/v1/files \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  -F "file=@document.pdf"

# Puis utilisez le file_id retourné dans votre message
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
        "text": "Quelles sont les principales conclusions de ce document ?"
      }]
    }]
  }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

# Télécharger le fichier PDF
with open("document.pdf", "rb") as f:
    file_upload = client.beta.files.upload(file=("document.pdf", f, "application/pdf"))

# Utiliser le fichier téléchargé dans un message
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
                    "text": "Quelles sont les principales conclusions de ce document ?"
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
  // Télécharger le fichier PDF
  const fileUpload = await anthropic.beta.files.upload({
    file: toFile(fs.createReadStream('document.pdf'), undefined, { type: 'application/pdf' })
  }, {
    betas: ['files-api-2025-04-14']
  });

  // Utiliser le fichier téléchargé dans un message
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
            text: 'Quelles sont les principales conclusions de ce document ?'
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

        // Télécharger le fichier PDF
        File file = client.beta().files().upload(FileUploadParams.builder()
                .file(Files.newInputStream(Path.of("document.pdf")))
                .build());

        // Utiliser le fichier téléchargé dans un message
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
 .text("Quelles sont les principales conclusions de ce document ?")
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

### Comment fonctionne le support PDF
Lorsque vous envoyez un PDF à Claude, les étapes suivantes se produisent :
<Steps>
  <Step title="Le système extrait le contenu du document.">
    - Le système convertit chaque page du document en image.
    - Le texte de chaque page est extrait et fourni avec l'image de chaque page.
  </Step>
  <Step title="Claude analyse à la fois le texte et les images pour mieux comprendre le document.">
    - Les documents sont fournis comme une combinaison de texte et d'images pour l'analyse.
    - Cela permet aux utilisateurs de demander des insights sur les éléments visuels d'un PDF, tels que les graphiques, diagrammes et autres contenus non textuels.
  </Step>
  <Step title="Claude répond, en référençant le contenu du PDF si pertinent.">
    Claude peut référencer à la fois le contenu textuel et visuel lorsqu'il répond. Vous pouvez améliorer davantage les performances en intégrant le support PDF avec :
    - **Mise en cache des prompts** : Pour améliorer les performances pour l'analyse répétée.
    - **Traitement par lots** : Pour le traitement de documents à haut volume.
    - **Utilisation d'outils** : Pour extraire des informations spécifiques des documents à utiliser comme entrées d'outils.
  </Step>
</Steps>

### Estimez vos coûts
Le nombre de jetons d'un fichier PDF dépend du texte total extrait du document ainsi que du nombre de pages :
- Coûts des jetons de texte : Chaque page utilise généralement 1 500-3 000 jetons par page selon la densité du contenu. La tarification API standard s'applique sans frais PDF supplémentaires.
- Coûts des jetons d'image : Étant donné que chaque page est convertie en image, les mêmes [calculs de coût basés sur l'image](/docs/fr/build-with-claude/vision#evaluate-image-size) sont appliqués.

Vous pouvez utiliser le [comptage de jetons](/docs/fr/build-with-claude/token-counting) pour estimer les coûts pour vos PDF spécifiques.

***

## Optimiser le traitement PDF

### Améliorer les performances
Suivez ces meilleures pratiques pour des résultats optimaux :
- Placez les PDF avant le texte dans vos demandes
- Utilisez des polices standard
- Assurez-vous que le texte est clair et lisible
- Faites pivoter les pages vers l'orientation droite appropriée
- Utilisez des numéros de page logiques (du visualiseur PDF) dans les prompts
- Divisez les gros PDF en morceaux si nécessaire
- Activez la mise en cache des prompts pour l'analyse répétée

### Mettre à l'échelle votre implémentation
Pour le traitement à haut volume, considérez ces approches :

#### Utiliser la mise en cache des prompts
Mettez en cache les PDF pour améliorer les performances sur les requêtes répétées :
<CodeGroup>
```bash Shell
# Créer un fichier de demande JSON utilisant le contenu pdf_base64.txt
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
            "text": "Quel modèle a les taux de victoire de préférence humaine les plus élevés dans chaque cas d'usage ?"
        }]
    }]
}' > request.json

# Puis faire l'appel API en utilisant le fichier JSON
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
                    "text": "Analysez ce document."
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
          text: 'Quel modèle a les taux de victoire de préférence humaine les plus élevés dans chaque cas d\'usage ?',
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

        // Lire le fichier PDF en base64
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
 .text("Quel modèle a les taux de victoire de préférence humaine les plus élevés dans chaque cas d'usage ?")
 .build())
                ))
                .build();


        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>

#### Traiter des lots de documents
Utilisez l'API Message Batches pour les flux de travail à haut volume :
<CodeGroup>
```bash Shell
# Créer un fichier de demande JSON utilisant le contenu pdf_base64.txt
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
                            "text": "Quel modèle a les taux de victoire de préférence humaine les plus élevés dans chaque cas d'usage ?"
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
                            "text": "Extrayez 5 insights clés de ce document."
                        }
                    ]
                }
              ]
          }
      }
  ]
}
' > request.json

# Puis faire l'appel API en utilisant le fichier JSON
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
 "text": "Résumez ce document."
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
                text: 'Quel modèle a les taux de victoire de préférence humaine les plus élevés dans chaque cas d\'usage ?',
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
                text: 'Extrayez 5 insights clés de ce document.',
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

        // Lire le fichier PDF en base64
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
 .text("Quel modèle a les taux de victoire de préférence humaine les plus élevés dans chaque cas d'usage ?")
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
 .text("Extrayez 5 insights clés de ce document.")
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

## Prochaines étapes

<CardGroup cols={2}>
  <Card
    title="Essayez les exemples PDF"
    icon="file"
    href="https://github.com/anthropics/anthropic-cookbook/tree/main/multimodal"
  >
    Explorez des exemples pratiques de traitement PDF dans notre recette de livre de cuisine.
  </Card>

  <Card
    title="Voir la référence API"
    icon="code"
    href="/docs/fr/api/messages"
  >
    Voir la documentation API complète pour le support PDF.
  </Card>
</CardGroup>