# API Files

L'API Files vous permet de télécharger et de gérer des fichiers à utiliser avec l'API Claude sans avoir à retélécharger le contenu à chaque demande.

---

L'API Files vous permet de télécharger et de gérer des fichiers à utiliser avec l'API Claude sans avoir à retélécharger le contenu à chaque demande. Ceci est particulièrement utile lors de l'utilisation de l'[outil d'exécution de code](/docs/fr/agents-and-tools/tool-use/code-execution-tool) pour fournir des entrées (par exemple, des ensembles de données et des documents) puis télécharger des sorties (par exemple, des graphiques). Vous pouvez également utiliser l'API Files pour éviter de devoir retélécharger continuellement des documents et des images fréquemment utilisés sur plusieurs appels API. Vous pouvez [explorer la référence API directement](/docs/fr/api/files-create), en plus de ce guide.

<Note>
L'API Files est actuellement en version bêta. Veuillez nous contacter via notre [formulaire de commentaires](https://forms.gle/tisHyierGwgN4DUE9) pour partager votre expérience avec l'API Files.
</Note>

## Modèles pris en charge

Le référencement d'un `file_id` dans une demande Messages est pris en charge dans tous les modèles qui prennent en charge le type de fichier donné. Par exemple, les [images](/docs/fr/build-with-claude/vision) sont prises en charge dans tous les modèles Claude 3+, les [PDF](/docs/fr/build-with-claude/pdf-support) dans tous les modèles Claude 3.5+, et [divers autres types de fichiers](/docs/fr/agents-and-tools/tool-use/code-execution-tool#supported-file-types) pour l'outil d'exécution de code dans Claude 3.5 Haiku plus tous les modèles Claude 3.7+.

L'API Files n'est actuellement pas prise en charge sur Amazon Bedrock ou Google Vertex AI.

## Comment fonctionne l'API Files

L'API Files fournit une approche simple de création unique et d'utilisation multiple pour travailler avec des fichiers :

- **Télécharger des fichiers** vers notre stockage sécurisé et recevoir un `file_id` unique
- **Télécharger des fichiers** qui sont créés à partir de compétences ou de l'outil d'exécution de code
- **Référencer des fichiers** dans les demandes [Messages](/docs/fr/api/messages) en utilisant le `file_id` au lieu de retélécharger le contenu
- **Gérer vos fichiers** avec les opérations de liste, de récupération et de suppression

## Comment utiliser l'API Files

<Note>
Pour utiliser l'API Files, vous devez inclure l'en-tête de fonction bêta : `anthropic-beta: files-api-2025-04-14`.
</Note>

### Télécharger un fichier

Téléchargez un fichier à référencer dans les appels API futurs :

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

La réponse du téléchargement d'un fichier inclura :

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

### Utiliser un fichier dans les messages

Une fois téléchargé, référencez le fichier en utilisant son `file_id` :

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

### Types de fichiers et blocs de contenu

L'API Files prend en charge différents types de fichiers qui correspondent à différents types de blocs de contenu :

| Type de fichier | Type MIME | Type de bloc de contenu | Cas d'utilisation |
| :--- | :--- | :--- | :--- |
| PDF | `application/pdf` | `document` | Analyse de texte, traitement de documents |
| Texte brut | `text/plain` | `document` | Analyse de texte, traitement |
| Images | `image/jpeg`, `image/png`, `image/gif`, `image/webp` | `image` | Analyse d'images, tâches visuelles |
| [Ensembles de données, autres](/docs/fr/agents-and-tools/tool-use/code-execution-tool#supported-file-types) | Varie | `container_upload` | Analyser les données, créer des visualisations  |

### Travailler avec d'autres formats de fichiers

Pour les types de fichiers qui ne sont pas pris en charge en tant que blocs `document` (.csv, .txt, .md, .docx, .xlsx), convertissez les fichiers en texte brut et incluez le contenu directement dans votre message :

<CodeGroup>
```bash Shell
# Exemple : Lecture d'un fichier texte et envoi en tant que texte brut
# Remarque : Pour les fichiers avec des caractères spéciaux, envisagez l'encodage base64
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

# Exemple : Lecture d'un fichier CSV
df = pd.read_csv('data.csv')
csv_content = df.to_string()

# Envoyer en tant que texte brut dans le message
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
  // Exemple : Lecture d'un fichier texte
  const textContent = fs.readFileSync('document.txt', 'utf-8');

  // Envoyer en tant que texte brut dans le message
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
Pour les fichiers .docx contenant des images, convertissez-les d'abord au format PDF, puis utilisez la [prise en charge des PDF](/docs/fr/build-with-claude/pdf-support) pour tirer parti de l'analyse d'images intégrée. Cela permet d'utiliser les citations du document PDF.
</Note>

#### Blocs de documents

Pour les PDF et les fichiers texte, utilisez le bloc de contenu `document` :

```json
{
  "type": "document",
  "source": {
    "type": "file",
    "file_id": "file_011CNha8iCJcU1wXNR6q4V8w"
  },
  "title": "Document Title", // Optionnel
  "context": "Context about the document", // Optionnel  
  "citations": {"enabled": true} // Optionnel, active les citations
}
```

#### Blocs d'images

Pour les images, utilisez le bloc de contenu `image` :

```json
{
  "type": "image",
  "source": {
    "type": "file",
    "file_id": "file_011CPMxVD3fHLUhvTqtsQA5w"
  }
}
```

### Gérer les fichiers

#### Lister les fichiers

Récupérez une liste de vos fichiers téléchargés :

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

#### Obtenir les métadonnées du fichier

Récupérez les informations sur un fichier spécifique :

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

#### Supprimer un fichier

Supprimez un fichier de votre espace de travail :

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

### Télécharger un fichier

Téléchargez les fichiers qui ont été créés par des compétences ou l'outil d'exécution de code :

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

# Enregistrer dans un fichier
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

// Enregistrer dans un fichier
fs.writeFileSync("downloaded_file.txt", fileContent);
```
</CodeGroup>

<Note>
Vous ne pouvez télécharger que les fichiers qui ont été créés par des [compétences](/docs/fr/build-with-claude/skills-guide) ou l'[outil d'exécution de code](/docs/fr/agents-and-tools/tool-use/code-execution-tool). Les fichiers que vous avez téléchargés ne peuvent pas être téléchargés.
</Note>

---

## Stockage des fichiers et limites

### Limites de stockage

- **Taille maximale du fichier :** 500 Mo par fichier
- **Stockage total :** 100 Go par organisation

### Cycle de vie des fichiers

- Les fichiers sont limités à l'espace de travail de la clé API. D'autres clés API peuvent utiliser les fichiers créés par n'importe quelle autre clé API associée au même espace de travail
- Les fichiers persistent jusqu'à ce que vous les supprimiez
- Les fichiers supprimés ne peuvent pas être récupérés
- Les fichiers sont inaccessibles via l'API peu de temps après la suppression, mais ils peuvent persister dans les appels API Messages actifs et les utilisations d'outils associées
- Les fichiers que les utilisateurs suppriment seront supprimés conformément à notre [politique de rétention des données](https://privacy.claude.com/en/articles/7996866-how-long-do-you-store-my-organization-s-data).

---

## Gestion des erreurs

Les erreurs courantes lors de l'utilisation de l'API Files incluent :

- **Fichier non trouvé (404) :** Le `file_id` spécifié n'existe pas ou vous n'y avez pas accès
- **Type de fichier invalide (400) :** Le type de fichier ne correspond pas au type de bloc de contenu (par exemple, utiliser un fichier image dans un bloc de document)
- **Dépasse la taille de la fenêtre de contexte (400) :** Le fichier est plus grand que la taille de la fenêtre de contexte (par exemple, utiliser un fichier texte brut de 500 Mo dans une demande `/v1/messages`)
- **Nom de fichier invalide (400) :** Le nom de fichier ne respecte pas les exigences de longueur (1-255 caractères) ou contient des caractères interdits (`<`, `>`, `:`, `"`, `|`, `?`, `*`, `\`, `/`, ou caractères unicode 0-31)
- **Fichier trop volumineux (413) :** Le fichier dépasse la limite de 500 Mo
- **Limite de stockage dépassée (403) :** Votre organisation a atteint la limite de stockage de 100 Go

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "File not found: file_011CNha8iCJcU1wXNR6q4V8w"
  }
}
```

## Utilisation et facturation

Les opérations de l'API Files sont **gratuites** :
- Télécharger des fichiers
- Télécharger des fichiers
- Lister les fichiers
- Obtenir les métadonnées du fichier  
- Supprimer des fichiers

Le contenu des fichiers utilisé dans les demandes `Messages` est facturé en tant que jetons d'entrée. Vous ne pouvez télécharger que les fichiers créés par des [compétences](/docs/fr/build-with-claude/skills-guide) ou l'[outil d'exécution de code](/docs/fr/agents-and-tools/tool-use/code-execution-tool).

### Limites de débit

Pendant la période bêta :
- Les appels API liés aux fichiers sont limités à environ 100 demandes par minute
- [Contactez-nous](mailto:sales@anthropic.com) si vous avez besoin de limites plus élevées pour votre cas d'utilisation