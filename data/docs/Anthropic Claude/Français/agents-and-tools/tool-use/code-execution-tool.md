# Outil d'exécution de code

Claude peut analyser des données, créer des visualisations, effectuer des calculs complexes, exécuter des commandes système, créer et modifier des fichiers, et traiter les fichiers téléchargés directement dans la conversation API.

---

Claude peut analyser des données, créer des visualisations, effectuer des calculs complexes, exécuter des commandes système, créer et modifier des fichiers, et traiter les fichiers téléchargés directement dans la conversation API.
L'outil d'exécution de code permet à Claude d'exécuter des commandes Bash et de manipuler des fichiers, y compris l'écriture de code, dans un environnement sécurisé et isolé.

<Note>
L'outil d'exécution de code est actuellement en bêta publique.

Pour utiliser cette fonctionnalité, ajoutez l'en-tête bêta `"code-execution-2025-08-25"` [beta header](/docs/fr/api/beta-headers) à vos requêtes API.
</Note>

## Compatibilité des modèles

L'outil d'exécution de code est disponible sur les modèles suivants :

| Modèle | Version de l'outil |
|-------|--------------|
| Claude Opus 4.5 (`claude-opus-4-5-20251101`) | `code_execution_20250825` |
| Claude Opus 4.1 (`claude-opus-4-1-20250805`) | `code_execution_20250825` |
| Claude Opus 4 (`claude-opus-4-20250514`) | `code_execution_20250825` |
| Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`) | `code_execution_20250825` |
| Claude Sonnet 4 (`claude-sonnet-4-20250514`) | `code_execution_20250825` |
| Claude Sonnet 3.7 (`claude-3-7-sonnet-20250219`) ([deprecated](/docs/fr/about-claude/model-deprecations)) | `code_execution_20250825` |
| Claude Haiku 4.5 (`claude-haiku-4-5-20251001`) | `code_execution_20250825` |
| Claude Haiku 3.5 (`claude-3-5-haiku-latest`) | `code_execution_20250825` |

<Note>
La version actuelle `code_execution_20250825` prend en charge les commandes Bash et les opérations de fichiers. Une version héritée `code_execution_20250522` (Python uniquement) est également disponible. Voir [Upgrade to latest tool version](#upgrade-to-latest-tool-version) pour les détails de migration.
</Note>

<Warning>
Les versions d'outils plus anciennes ne sont pas garanties d'être rétro-compatibles avec les modèles plus récents. Utilisez toujours la version de l'outil qui correspond à votre version de modèle.
</Warning>

## Démarrage rapide

Voici un exemple simple qui demande à Claude d'effectuer un calcul :

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: code-execution-2025-08-25" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": "Calculate the mean and standard deviation of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
            }
        ],
        "tools": [{
            "type": "code_execution_20250825",
            "name": "code_execution"
        }]
    }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["code-execution-2025-08-25"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Calculate the mean and standard deviation of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)

print(response)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

async function main() {
  const response = await anthropic.beta.messages.create({
    model: "claude-sonnet-4-5",
    betas: ["code-execution-2025-08-25"],
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: "Calculate the mean and standard deviation of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
      }
    ],
    tools: [{
      type: "code_execution_20250825",
      name: "code_execution"
    }]
  });

  console.log(response);
}

main().catch(console.error);
```
</CodeGroup>

## Fonctionnement de l'exécution de code

Lorsque vous ajoutez l'outil d'exécution de code à votre requête API :

1. Claude évalue si l'exécution de code aiderait à répondre à votre question
2. L'outil fournit automatiquement à Claude les capacités suivantes :
   - **Commandes Bash** : Exécuter des commandes shell pour les opérations système et la gestion des paquets
   - **Opérations de fichiers** : Créer, afficher et modifier des fichiers directement, y compris l'écriture de code
3. Claude peut utiliser n'importe quelle combinaison de ces capacités dans une seule requête
4. Toutes les opérations s'exécutent dans un environnement sandbox sécurisé
5. Claude fournit les résultats avec tous les graphiques générés, calculs ou analyses

## Comment utiliser l'outil

### Exécuter des commandes Bash

Demandez à Claude de vérifier les informations système et d'installer des paquets :

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: code-execution-2025-08-25" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [{
            "role": "user",
            "content": "Check the Python version and list installed packages"
        }],
        "tools": [{
            "type": "code_execution_20250825",
            "name": "code_execution"
        }]
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["code-execution-2025-08-25"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Check the Python version and list installed packages"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  betas: ["code-execution-2025-08-25"],
  max_tokens: 4096,
  messages: [{
    role: "user",
    content: "Check the Python version and list installed packages"
  }],
  tools: [{
    type: "code_execution_20250825",
    name: "code_execution"
  }]
});
```
</CodeGroup>

### Créer et modifier des fichiers directement

Claude peut créer, afficher et modifier des fichiers directement dans le sandbox en utilisant les capacités de manipulation de fichiers :

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: code-execution-2025-08-25" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [{
            "role": "user",
            "content": "Create a config.yaml file with database settings, then update the port from 5432 to 3306"
        }],
        "tools": [{
            "type": "code_execution_20250825",
            "name": "code_execution"
        }]
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["code-execution-2025-08-25"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Create a config.yaml file with database settings, then update the port from 5432 to 3306"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  betas: ["code-execution-2025-08-25"],
  max_tokens: 4096,
  messages: [{
    role: "user",
    content: "Create a config.yaml file with database settings, then update the port from 5432 to 3306"
  }],
  tools: [{
    type: "code_execution_20250825",
    name: "code_execution"
  }]
});
```
</CodeGroup>

### Télécharger et analyser vos propres fichiers

Pour analyser vos propres fichiers de données (CSV, Excel, images, etc.), téléchargez-les via l'API Files et référencez-les dans votre requête :

<Note>
L'utilisation de l'API Files avec Code Execution nécessite deux en-têtes bêta : `"anthropic-beta": "code-execution-2025-08-25,files-api-2025-04-14"`
</Note>

L'environnement Python peut traiter divers types de fichiers téléchargés via l'API Files, notamment :

- CSV
- Excel (.xlsx, .xls)
- JSON
- XML
- Images (JPEG, PNG, GIF, WebP)
- Fichiers texte (.txt, .md, .py, etc)

#### Télécharger et analyser des fichiers

1. **Téléchargez votre fichier** en utilisant l'[API Files](/docs/fr/build-with-claude/files)
2. **Référencez le fichier** dans votre message en utilisant un bloc de contenu `container_upload`
3. **Incluez l'outil d'exécution de code** dans votre requête API

<CodeGroup>
```bash Shell
# First, upload a file
curl https://api.anthropic.com/v1/files \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: files-api-2025-04-14" \
    --form 'file=@"data.csv"' \

# Then use the file_id with code execution
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: code-execution-2025-08-25,files-api-2025-04-14" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [{
            "role": "user",
            "content": [
                {"type": "text", "text": "Analyze this CSV data"},
                {"type": "container_upload", "file_id": "file_abc123"}
            ]
        }],
        "tools": [{
            "type": "code_execution_20250825",
            "name": "code_execution"
        }]
    }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

# Upload a file
file_object = client.beta.files.upload(
    file=open("data.csv", "rb"),
)

# Use the file_id with code execution
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["code-execution-2025-08-25", "files-api-2025-04-14"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": "Analyze this CSV data"},
            {"type": "container_upload", "file_id": file_object.id}
        ]
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';
import { createReadStream } from 'fs';

const anthropic = new Anthropic();

async function main() {
  // Upload a file
  const fileObject = await anthropic.beta.files.create({
    file: createReadStream("data.csv"),
  });

  // Use the file_id with code execution
  const response = await anthropic.beta.messages.create({
    model: "claude-sonnet-4-5",
    betas: ["code-execution-2025-08-25", "files-api-2025-04-14"],
    max_tokens: 4096,
    messages: [{
      role: "user",
      content: [
        { type: "text", text: "Analyze this CSV data" },
        { type: "container_upload", file_id: fileObject.id }
      ]
    }],
    tools: [{
      type: "code_execution_20250825",
      name: "code_execution"
    }]
  });

  console.log(response);
}

main().catch(console.error);
```
</CodeGroup>

#### Récupérer les fichiers générés

Lorsque Claude crée des fichiers lors de l'exécution du code, vous pouvez récupérer ces fichiers en utilisant l'API Files :

<CodeGroup>
```python Python
from anthropic import Anthropic

# Initialize the client
client = Anthropic()

# Request code execution that creates files
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["code-execution-2025-08-25", "files-api-2025-04-14"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Create a matplotlib visualization and save it as output.png"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)

# Extract file IDs from the response
def extract_file_ids(response):
    file_ids = []
    for item in response.content:
        if item.type == 'bash_code_execution_tool_result':
            content_item = item.content
            if content_item.type == 'bash_code_execution_result':
                for file in content_item.content:
                    if hasattr(file, 'file_id'):
                        file_ids.append(file.file_id)
    return file_ids

# Download the created files
for file_id in extract_file_ids(response):
    file_metadata = client.beta.files.retrieve_metadata(file_id)
    file_content = client.beta.files.download(file_id)
    file_content.write_to_file(file_metadata.filename)
    print(f"Downloaded: {file_metadata.filename}")
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';
import { writeFileSync } from 'fs';

// Initialize the client
const anthropic = new Anthropic();

async function main() {
  // Request code execution that creates files
  const response = await anthropic.beta.messages.create({
    model: "claude-sonnet-4-5",
    betas: ["code-execution-2025-08-25", "files-api-2025-04-14"],
    max_tokens: 4096,
    messages: [{
      role: "user",
      content: "Create a matplotlib visualization and save it as output.png"
    }],
    tools: [{
      type: "code_execution_20250825",
      name: "code_execution"
    }]
  });

  // Extract file IDs from the response
  function extractFileIds(response: any): string[] {
    const fileIds: string[] = [];
    for (const item of response.content) {
      if (item.type === 'bash_code_execution_tool_result') {
        const contentItem = item.content;
        if (contentItem.type === 'bash_code_execution_result' && contentItem.content) {
          for (const file of contentItem.content) {
            fileIds.push(file.file_id);
          }
        }
      }
    }
    return fileIds;
  }

  // Download the created files
  const fileIds = extractFileIds(response);
  for (const fileId of fileIds) {
    const fileMetadata = await anthropic.beta.files.retrieveMetadata(fileId);
    const fileContent = await anthropic.beta.files.download(fileId);

    // Convert ReadableStream to Buffer and save
    const chunks: Uint8Array[] = [];
    for await (const chunk of fileContent) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    writeFileSync(fileMetadata.filename, buffer);
    console.log(`Downloaded: ${fileMetadata.filename}`);
  }
}

main().catch(console.error);
```
</CodeGroup>

### Combiner les opérations

Un flux de travail complexe utilisant toutes les capacités :

<CodeGroup>
```bash Shell
# First, upload a file
curl https://api.anthropic.com/v1/files \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: files-api-2025-04-14" \
    --form 'file=@"data.csv"' \
    > file_response.json

# Extract file_id (using jq)
FILE_ID=$(jq -r '.id' file_response.json)

# Then use it with code execution
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: code-execution-2025-08-25,files-api-2025-04-14" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [{
            "role": "user",
            "content": [
                {
                    "type": "text", 
                    "text": "Analyze this CSV data: create a summary report, save visualizations, and create a README with the findings"
                },
                {
                    "type": "container_upload", 
                    "file_id": "'$FILE_ID'"
                }
            ]
        }],
        "tools": [{
            "type": "code_execution_20250825",
            "name": "code_execution"
        }]
    }'
```

```python Python
# Upload a file
file_object = client.beta.files.upload(
    file=open("data.csv", "rb"),
)

# Use it with code execution
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["code-execution-2025-08-25", "files-api-2025-04-14"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": "Analyze this CSV data: create a summary report, save visualizations, and create a README with the findings"},
            {"type": "container_upload", "file_id": file_object.id}
        ]
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)

# Claude might:
# 1. Use bash to check file size and preview data
# 2. Use text_editor to write Python code to analyze the CSV and create visualizations
# 3. Use bash to run the Python code
# 4. Use text_editor to create a README.md with findings
# 5. Use bash to organize files into a report directory
```

```typescript TypeScript
// Upload a file
const fileObject = await anthropic.beta.files.create({
  file: createReadStream("data.csv"),
});

// Use it with code execution
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  betas: ["code-execution-2025-08-25", "files-api-2025-04-14"],
  max_tokens: 4096,
  messages: [{
    role: "user",
    content: [
      {type: "text", text: "Analyze this CSV data: create a summary report, save visualizations, and create a README with the findings"},
      {type: "container_upload", file_id: fileObject.id}
    ]
  }],
  tools: [{
    type: "code_execution_20250825",
    name: "code_execution"
  }]
});

// Claude might:
// 1. Use bash to check file size and preview data
// 2. Use text_editor to write Python code to analyze the CSV and create visualizations
// 3. Use bash to run the Python code
// 4. Use text_editor to create a README.md with findings
// 5. Use bash to organize files into a report directory
```
</CodeGroup>

## Définition de l'outil

L'outil d'exécution de code ne nécessite aucun paramètre supplémentaire :

```json JSON
{
  "type": "code_execution_20250825",
  "name": "code_execution"
}
```

Lorsque cet outil est fourni, Claude accède automatiquement à deux sous-outils :
- `bash_code_execution` : Exécuter des commandes shell
- `text_editor_code_execution` : Afficher, créer et modifier des fichiers, y compris l'écriture de code

## Format de réponse

L'outil d'exécution de code peut retourner deux types de résultats selon l'opération :

### Réponse de commande Bash

```json
{
  "type": "server_tool_use",
  "id": "srvtoolu_01B3C4D5E6F7G8H9I0J1K2L3",
  "name": "bash_code_execution",
  "input": {
    "command": "ls -la | head -5"
  }
},
{
  "type": "bash_code_execution_tool_result",
  "tool_use_id": "srvtoolu_01B3C4D5E6F7G8H9I0J1K2L3",
  "content": {
    "type": "bash_code_execution_result",
    "stdout": "total 24\ndrwxr-xr-x 2 user user 4096 Jan 1 12:00 .\ndrwxr-xr-x 3 user user 4096 Jan 1 11:00 ..\n-rw-r--r-- 1 user user  220 Jan 1 12:00 data.csv\n-rw-r--r-- 1 user user  180 Jan 1 12:00 config.json",
    "stderr": "",
    "return_code": 0
  }
}
```

### Réponses d'opération de fichier

**Afficher le fichier :**
```json
{
  "type": "server_tool_use",
  "id": "srvtoolu_01C4D5E6F7G8H9I0J1K2L3M4",
  "name": "text_editor_code_execution",
  "input": {
    "command": "view",
    "path": "config.json"
  }
},
{
  "type": "text_editor_code_execution_tool_result",
  "tool_use_id": "srvtoolu_01C4D5E6F7G8H9I0J1K2L3M4",
  "content": {
    "type": "text_editor_code_execution_result",
    "file_type": "text",
    "content": "{\n  \"setting\": \"value\",\n  \"debug\": true\n}",
    "numLines": 4,
    "startLine": 1,
    "totalLines": 4
  }
}
```

**Créer un fichier :**
```json
{
  "type": "server_tool_use",
  "id": "srvtoolu_01D5E6F7G8H9I0J1K2L3M4N5",
  "name": "text_editor_code_execution",
  "input": {
    "command": "create",
    "path": "new_file.txt",
    "file_text": "Hello, World!"
  }
},
{
  "type": "text_editor_code_execution_tool_result",
  "tool_use_id": "srvtoolu_01D5E6F7G8H9I0J1K2L3M4N5",
  "content": {
    "type": "text_editor_code_execution_result",
    "is_file_update": false
  }
}
```

**Modifier un fichier (str_replace) :**
```json
{
  "type": "server_tool_use",
  "id": "srvtoolu_01E6F7G8H9I0J1K2L3M4N5O6",
  "name": "text_editor_code_execution",
  "input": {
    "command": "str_replace",
    "path": "config.json",
    "old_str": "\"debug\": true",
    "new_str": "\"debug\": false"
  }
},
{
  "type": "text_editor_code_execution_tool_result",
  "tool_use_id": "srvtoolu_01E6F7G8H9I0J1K2L3M4N5O6",
  "content": {
    "type": "text_editor_code_execution_result",
    "oldStart": 3,
    "oldLines": 1,
    "newStart": 3,
    "newLines": 1,
    "lines": ["-  \"debug\": true", "+  \"debug\": false"]
  }
}
```

### Résultats

Tous les résultats d'exécution incluent :
- `stdout` : Sortie de l'exécution réussie
- `stderr` : Messages d'erreur si l'exécution échoue
- `return_code` : 0 pour le succès, non-zéro pour l'échec

Champs supplémentaires pour les opérations de fichiers :
- **Afficher** : `file_type`, `content`, `numLines`, `startLine`, `totalLines`
- **Créer** : `is_file_update` (si le fichier existait déjà)
- **Modifier** : `oldStart`, `oldLines`, `newStart`, `newLines`, `lines` (format diff)

### Erreurs

Chaque type d'outil peut retourner des erreurs spécifiques :

**Erreurs courantes (tous les outils) :**
```json
{
  "type": "bash_code_execution_tool_result",
  "tool_use_id": "srvtoolu_01VfmxgZ46TiHbmXgy928hQR",
  "content": {
    "type": "bash_code_execution_tool_result_error",
    "error_code": "unavailable"
  }
}
```

**Codes d'erreur par type d'outil :**

| Outil | Code d'erreur | Description |
|------|-----------|-------------|
| Tous les outils | `unavailable` | L'outil est temporairement indisponible |
| Tous les outils | `execution_time_exceeded` | L'exécution a dépassé la limite de temps maximale |
| Tous les outils | `container_expired` | Le conteneur a expiré et n'est plus disponible |
| Tous les outils | `invalid_tool_input` | Paramètres invalides fournis à l'outil |
| Tous les outils | `too_many_requests` | Limite de débit dépassée pour l'utilisation de l'outil |
| text_editor | `file_not_found` | Le fichier n'existe pas (pour les opérations view/edit) |
| text_editor | `string_not_found` | Le `old_str` n'a pas été trouvé dans le fichier (pour str_replace) |

#### Raison d'arrêt `pause_turn`

La réponse peut inclure une raison d'arrêt `pause_turn`, qui indique que l'API a mis en pause un tour de longue durée. Vous pouvez fournir la réponse telle quelle dans une requête ultérieure pour laisser Claude continuer son tour, ou modifier le contenu si vous souhaitez interrompre la conversation.

## Conteneurs

L'outil d'exécution de code s'exécute dans un environnement conteneurisé sécurisé conçu spécifiquement pour l'exécution de code, avec un accent plus élevé sur Python.

### Environnement d'exécution
- **Version Python** : 3.11.12
- **Système d'exploitation** : Conteneur basé sur Linux
- **Architecture** : x86_64 (AMD64)

### Limites de ressources
- **Mémoire** : 5 GiB de RAM
- **Espace disque** : 5 GiB de stockage d'espace de travail
- **CPU** : 1 CPU

### Réseau et sécurité
- **Accès Internet** : Complètement désactivé pour la sécurité
- **Connexions externes** : Aucune requête réseau sortante autorisée
- **Isolation du sandbox** : Isolation complète du système hôte et des autres conteneurs
- **Accès aux fichiers** : Limité au répertoire d'espace de travail uniquement
- **Portée de l'espace de travail** : Comme [Files](/docs/fr/build-with-claude/files), les conteneurs sont limités à l'espace de travail de la clé API
- **Expiration** : Les conteneurs expirent 30 jours après leur création

### Bibliothèques pré-installées
L'environnement Python en sandbox inclut ces bibliothèques couramment utilisées :
- **Science des données** : pandas, numpy, scipy, scikit-learn, statsmodels
- **Visualisation** : matplotlib, seaborn
- **Traitement de fichiers** : pyarrow, openpyxl, xlsxwriter, xlrd, pillow, python-pptx, python-docx, pypdf, pdfplumber, pypdfium2, pdf2image, pdfkit, tabula-py, reportlab[pycairo], Img2pdf
- **Mathématiques et calcul** : sympy, mpmath
- **Utilitaires** : tqdm, python-dateutil, pytz, joblib, unzip, unrar, 7zip, bc, rg (ripgrep), fd, sqlite

## Réutilisation de conteneur

Vous pouvez réutiliser un conteneur existant dans plusieurs requêtes API en fournissant l'ID du conteneur à partir d'une réponse précédente.
Cela vous permet de maintenir les fichiers créés entre les requêtes.

### Exemple

<CodeGroup>
```python Python
import os
from anthropic import Anthropic

# Initialize the client
client = Anthropic(
    api_key=os.getenv("ANTHROPIC_API_KEY")
)

# First request: Create a file with a random number
response1 = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["code-execution-2025-08-25"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Write a file with a random number and save it to '/tmp/number.txt'"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)

# Extract the container ID from the first response
container_id = response1.container.id

# Second request: Reuse the container to read the file
response2 = client.beta.messages.create(
    container=container_id,  # Reuse the same container
    model="claude-sonnet-4-5",
    betas=["code-execution-2025-08-25"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Read the number from '/tmp/number.txt' and calculate its square"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

async function main() {
  // First request: Create a file with a random number
  const response1 = await anthropic.beta.messages.create({
    model: "claude-sonnet-4-5",
    betas: ["code-execution-2025-08-25"],
    max_tokens: 4096,
    messages: [{
      role: "user",
      content: "Write a file with a random number and save it to '/tmp/number.txt'"
    }],
    tools: [{
      type: "code_execution_20250825",
      name: "code_execution"
    }]
  });

  // Extract the container ID from the first response
  const containerId = response1.container.id;

  // Second request: Reuse the container to read the file
  const response2 = await anthropic.beta.messages.create({
    container: containerId,  // Reuse the same container
    model: "claude-sonnet-4-5",
    betas: ["code-execution-2025-08-25"],
    max_tokens: 4096,
    messages: [{
      role: "user",
      content: "Read the number from '/tmp/number.txt' and calculate its square"
    }],
    tools: [{
      type: "code_execution_20250825",
      name: "code_execution"
    }]
  });

  console.log(response2.content);
}

main().catch(console.error);
```

```bash Shell
# First request: Create a file with a random number
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: code-execution-2025-08-25" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [{
            "role": "user",
            "content": "Write a file with a random number and save it to \"/tmp/number.txt\""
        }],
        "tools": [{
            "type": "code_execution_20250825",
            "name": "code_execution"
        }]
    }' > response1.json

# Extract container ID from the response (using jq)
CONTAINER_ID=$(jq -r '.container.id' response1.json)

# Second request: Reuse the container to read the file
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: code-execution-2025-08-25" \
    --header "content-type: application/json" \
    --data '{
        "container": "'$CONTAINER_ID'",
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [{
            "role": "user",
            "content": "Read the number from \"/tmp/number.txt\" and calculate its square"
        }],
        "tools": [{
            "type": "code_execution_20250825",
            "name": "code_execution"
        }]
    }'
```
</CodeGroup>

## Streaming

Avec le streaming activé, vous recevrez les événements d'exécution de code au fur et à mesure qu'ils se produisent :

```javascript
event: content_block_start
data: {"type": "content_block_start", "index": 1, "content_block": {"type": "server_tool_use", "id": "srvtoolu_xyz789", "name": "code_execution"}}

// Code execution streamed
event: content_block_delta
data: {"type": "content_block_delta", "index": 1, "delta": {"type": "input_json_delta", "partial_json": "{\"code\":\"import pandas as pd\\ndf = pd.read_csv('data.csv')\\nprint(df.head())\"}"}}

// Pause while code executes

// Execution results streamed
event: content_block_start
data: {"type": "content_block_start", "index": 2, "content_block": {"type": "code_execution_tool_result", "tool_use_id": "srvtoolu_xyz789", "content": {"stdout": "   A  B  C\n0  1  2  3\n1  4  5  6", "stderr": ""}}}
```

## Requêtes par lot

Vous pouvez inclure l'outil d'exécution de code dans l'[API Messages Batches](/docs/fr/build-with-claude/batch-processing). Les appels d'outil d'exécution de code via l'API Messages Batches sont facturés de la même manière que ceux dans les requêtes API Messages régulières.

## Utilisation et tarification

Code execution tool usage is tracked separately from token usage. Execution time has a minimum of 5 minutes.
If files are included in the request, execution time is billed even if the tool is not used due to files being preloaded onto the container.

Each organization receives 50 free hours of usage with the code execution tool per day. Additional usage beyond the first 50 hours is billed at $0.05 per hour, per container.

## Mettre à jour vers la dernière version de l'outil

En mettant à jour vers `code-execution-2025-08-25`, vous accédez à la manipulation de fichiers et aux capacités Bash, y compris le code dans plusieurs langages. Il n'y a pas de différence de prix.

### Ce qui a changé

| Composant | Hérité | Actuel |
|-----------|------------------|----------------------------|
| En-tête bêta | `code-execution-2025-05-22` | `code-execution-2025-08-25` |
| Type d'outil | `code_execution_20250522` | `code_execution_20250825` |
| Capacités | Python uniquement | Commandes Bash, opérations de fichiers |
| Types de réponse | `code_execution_result` | `bash_code_execution_result`, `text_editor_code_execution_result` |

### Rétro-compatibilité

- Tout le code Python d'exécution existant continue de fonctionner exactement comme avant
- Aucune modification requise pour les flux de travail existants Python uniquement

### Étapes de mise à jour

Pour mettre à jour, vous devez apporter les modifications suivantes dans vos requêtes API :

1. **Mettez à jour l'en-tête bêta** :
   ```diff
   - "anthropic-beta": "code-execution-2025-05-22"
   + "anthropic-beta": "code-execution-2025-08-25"
   ```

2. **Mettez à jour le type d'outil** :
   ```diff
   - "type": "code_execution_20250522"
   + "type": "code_execution_20250825"
   ```

3. **Examinez la gestion des réponses** (si vous analysez les réponses par programmation) :
   - Les blocs précédents pour les réponses d'exécution Python ne seront plus envoyés
   - À la place, les nouveaux types de réponse pour les opérations Bash et de fichiers seront envoyés (voir la section Format de réponse)

## Appel d'outil programmatique

L'outil d'exécution de code alimente l'[appel d'outil programmatique](/docs/fr/agents-and-tools/tool-use/programmatic-tool-calling), qui permet à Claude d'écrire du code qui appelle vos outils personnalisés par programmation dans le conteneur d'exécution. Cela permet des flux de travail multi-outils efficaces, le filtrage des données avant d'atteindre le contexte de Claude, et la logique conditionnelle complexe.

<CodeGroup>
```python Python
# Enable programmatic calling for your tools
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Get weather for 5 cities and find the warmest"
    }],
    tools=[
        {
            "type": "code_execution_20250825",
            "name": "code_execution"
        },
        {
            "name": "get_weather",
            "description": "Get weather for a city",
            "input_schema": {...},
            "allowed_callers": ["code_execution_20250825"]  # Enable programmatic calling
        }
    ]
)
```
</CodeGroup>

En savoir plus dans la [documentation sur l'appel d'outil programmatique](/docs/fr/agents-and-tools/tool-use/programmatic-tool-calling).

## Utilisation de l'exécution de code avec Agent Skills

L'outil d'exécution de code permet à Claude d'utiliser les [Agent Skills](/docs/fr/agents-and-tools/agent-skills/overview). Les compétences sont des capacités modulaires composées d'instructions, de scripts et de ressources qui étendent les fonctionnalités de Claude.

En savoir plus dans la [documentation Agent Skills](/docs/fr/agents-and-tools/agent-skills/overview) et le [guide API Agent Skills](/docs/fr/build-with-claude/skills-guide).