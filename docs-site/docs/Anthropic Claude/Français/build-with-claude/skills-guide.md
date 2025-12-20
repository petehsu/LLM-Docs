# Utilisation des compétences d'agent avec l'API

Apprenez à utiliser les compétences d'agent pour étendre les capacités de Claude via l'API.

---

Les compétences d'agent étendent les capacités de Claude par le biais de dossiers organisés contenant des instructions, des scripts et des ressources. Ce guide vous montre comment utiliser à la fois les compétences prédéfinies et personnalisées avec l'API Claude.

<Note>
Pour la référence API complète incluant les schémas de requête/réponse et tous les paramètres, consultez :
- [Référence API de gestion des compétences](/docs/fr/api/skills/list-skills) - Opérations CRUD pour les compétences
- [Référence API des versions de compétences](/docs/fr/api/skills/list-skill-versions) - Gestion des versions
</Note>

## Liens rapides

<CardGroup cols={2}>
  <Card
    title="Commencer avec les compétences d'agent"
    icon="rocket"
    href="/docs/fr/agents-and-tools/agent-skills/quickstart"
  >
    Créez votre première compétence
  </Card>
  <Card
    title="Créer des compétences personnalisées"
    icon="hammer"
    href="/docs/fr/agents-and-tools/agent-skills/best-practices"
  >
    Meilleures pratiques pour la création de compétences
  </Card>
</CardGroup>

## Aperçu

<Note>
Pour une analyse approfondie de l'architecture et des applications réelles des compétences d'agent, lisez notre blog d'ingénierie : [Équiper les agents pour le monde réel avec les compétences d'agent](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills).
</Note>

Les compétences s'intègrent à l'API Messages via l'outil d'exécution de code. Que vous utilisiez des compétences prédéfinies gérées par Anthropic ou des compétences personnalisées que vous avez téléchargées, la forme d'intégration est identique—les deux nécessitent l'exécution de code et utilisent la même structure `container`.

### Utilisation des compétences

Les compétences s'intègrent de manière identique dans l'API Messages indépendamment de la source. Vous spécifiez les compétences dans le paramètre `container` avec un `skill_id`, un `type` et une `version` optionnelle, et elles s'exécutent dans l'environnement d'exécution de code.

**Vous pouvez utiliser des compétences de deux sources :**

| Aspect | Compétences Anthropic | Compétences personnalisées |
|---|---|---|
| **Valeur de type** | `anthropic` | `custom` |
| **IDs de compétence** | Noms courts : `pptx`, `xlsx`, `docx`, `pdf` | Générés : `skill_01AbCdEfGhIjKlMnOpQrStUv` |
| **Format de version** | Basé sur la date : `20251013` ou `latest` | Timestamp d'époque : `1759178010641129` ou `latest` |
| **Gestion** | Prédéfinies et maintenues par Anthropic | Téléchargées et gérées via [API Skills](/docs/fr/api/skills/create-skill) |
| **Disponibilité** | Disponibles pour tous les utilisateurs | Privées pour votre espace de travail |

Les deux sources de compétences sont renvoyées par le [point de terminaison List Skills](/docs/fr/api/skills/list-skills) (utilisez le paramètre `source` pour filtrer). La forme d'intégration et l'environnement d'exécution sont identiques—la seule différence est la provenance des compétences et leur gestion.

### Prérequis

Pour utiliser les compétences, vous avez besoin de :

1. **Clé API Anthropic** de la [Console](/settings/keys)
2. **En-têtes bêta** :
   - `code-execution-2025-08-25` - Active l'exécution de code (requis pour les compétences)
   - `skills-2025-10-02` - Active l'API Skills
   - `files-api-2025-04-14` - Pour télécharger/télécharger des fichiers vers/depuis le conteneur
3. **Outil d'exécution de code** activé dans vos requêtes

---

## Utilisation des compétences dans Messages

### Paramètre Container

Les compétences sont spécifiées à l'aide du paramètre `container` dans l'API Messages. Vous pouvez inclure jusqu'à 8 compétences par requête.

La structure est identique pour les compétences Anthropic et personnalisées—spécifiez le `type` et le `skill_id` requis, et incluez éventuellement `version` pour épingler une version spécifique :

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    betas=["code-execution-2025-08-25", "skills-2025-10-02"],
    container={
        "skills": [
            {
                "type": "anthropic",
                "skill_id": "pptx",
                "version": "latest"
            }
        ]
    },
    messages=[{
        "role": "user",
        "content": "Create a presentation about renewable energy"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.beta.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 4096,
  betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
  container: {
    skills: [
      {
        type: 'anthropic',
        skill_id: 'pptx',
        version: 'latest'
      }
    ]
  },
  messages: [{
    role: 'user',
    content: 'Create a presentation about renewable energy'
  }],
  tools: [{
    type: 'code_execution_20250825',
    name: 'code_execution'
  }]
});
```

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5-20250929",
    "max_tokens": 4096,
    "container": {
      "skills": [
        {
          "type": "anthropic",
          "skill_id": "pptx",
          "version": "latest"
        }
      ]
    },
    "messages": [{
      "role": "user",
      "content": "Create a presentation about renewable energy"
    }],
    "tools": [{
      "type": "code_execution_20250825",
      "name": "code_execution"
    }]
  }'
```
</CodeGroup>

### Téléchargement des fichiers générés

Lorsque les compétences créent des documents (Excel, PowerPoint, PDF, Word), elles retournent des attributs `file_id` dans la réponse. Vous devez utiliser l'API Files pour télécharger ces fichiers.

**Comment cela fonctionne :**
1. Les compétences créent des fichiers lors de l'exécution du code
2. La réponse inclut `file_id` pour chaque fichier créé
3. Utilisez l'API Files pour télécharger le contenu du fichier réel
4. Enregistrez localement ou traitez selon les besoins

**Exemple : Créer et télécharger un fichier Excel**

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# Step 1: Use a Skill to create a file
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    betas=["code-execution-2025-08-25", "skills-2025-10-02"],
    container={
        "skills": [
            {"type": "anthropic", "skill_id": "xlsx", "version": "latest"}
        ]
    },
    messages=[{
        "role": "user",
        "content": "Create an Excel file with a simple budget spreadsheet"
    }],
    tools=[{"type": "code_execution_20250825", "name": "code_execution"}]
)

# Step 2: Extract file IDs from the response
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

# Step 3: Download the file using Files API
for file_id in extract_file_ids(response):
    file_metadata = client.beta.files.retrieve_metadata(
        file_id=file_id,
        betas=["files-api-2025-04-14"]
    )
    file_content = client.beta.files.download(
        file_id=file_id,
        betas=["files-api-2025-04-14"]
    )

    # Step 4: Save to disk
    file_content.write_to_file(file_metadata.filename)
    print(f"Downloaded: {file_metadata.filename}")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

// Step 1: Use a Skill to create a file
const response = await client.beta.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 4096,
  betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
  container: {
    skills: [
      {type: 'anthropic', skill_id: 'xlsx', version: 'latest'}
    ]
  },
  messages: [{
    role: 'user',
    content: 'Create an Excel file with a simple budget spreadsheet'
  }],
  tools: [{type: 'code_execution_20250825', name: 'code_execution'}]
});

// Step 2: Extract file IDs from the response
function extractFileIds(response: any): string[] {
  const fileIds: string[] = [];
  for (const item of response.content) {
    if (item.type === 'bash_code_execution_tool_result') {
      const contentItem = item.content;
      if (contentItem.type === 'bash_code_execution_result') {
        for (const file of contentItem.content) {
          if ('file_id' in file) {
            fileIds.push(file.file_id);
          }
        }
      }
    }
  }
  return fileIds;
}

// Step 3: Download the file using Files API
const fs = require('fs');
for (const fileId of extractFileIds(response)) {
  const fileMetadata = await client.beta.files.retrieve_metadata(fileId, {
    betas: ['files-api-2025-04-14']
  });
  const fileContent = await client.beta.files.download(fileId, {
    betas: ['files-api-2025-04-14']
  });

  // Step 4: Save to disk
  fs.writeFileSync(fileMetadata.filename, Buffer.from(await fileContent.arrayBuffer()));
  console.log(`Downloaded: ${fileMetadata.filename}`);
}
```

```bash Shell
# Step 1: Use a Skill to create a file
RESPONSE=$(curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5-20250929",
    "max_tokens": 4096,
    "container": {
      "skills": [
        {"type": "anthropic", "skill_id": "xlsx", "version": "latest"}
      ]
    },
    "messages": [{
      "role": "user",
      "content": "Create an Excel file with a simple budget spreadsheet"
    }],
    "tools": [{
      "type": "code_execution_20250825",
      "name": "code_execution"
    }]
  }')

# Step 2: Extract file_id from response (using jq)
FILE_ID=$(echo "$RESPONSE" | jq -r '.content[] | select(.type=="bash_code_execution_tool_result") | .content | select(.type=="bash_code_execution_result") | .content[] | select(.file_id) | .file_id')

# Step 3: Get filename from metadata
FILENAME=$(curl "https://api.anthropic.com/v1/files/$FILE_ID" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" | jq -r '.filename')

# Step 4: Download the file using Files API
curl "https://api.anthropic.com/v1/files/$FILE_ID/content" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  --output "$FILENAME"

echo "Downloaded: $FILENAME"
```
</CodeGroup>

**Opérations supplémentaires de l'API Files :**

<CodeGroup>
```python Python
# Get file metadata
file_info = client.beta.files.retrieve_metadata(
    file_id=file_id,
    betas=["files-api-2025-04-14"]
)
print(f"Filename: {file_info.filename}, Size: {file_info.size_bytes} bytes")

# List all files
files = client.beta.files.list(betas=["files-api-2025-04-14"])
for file in files.data:
    print(f"{file.filename} - {file.created_at}")

# Delete a file
client.beta.files.delete(
    file_id=file_id,
    betas=["files-api-2025-04-14"]
)
```

```typescript TypeScript
// Get file metadata
const fileInfo = await client.beta.files.retrieve_metadata(fileId, {
  betas: ['files-api-2025-04-14']
});
console.log(`Filename: ${fileInfo.filename}, Size: ${fileInfo.size_bytes} bytes`);

// List all files
const files = await client.beta.files.list({
  betas: ['files-api-2025-04-14']
});
for (const file of files.data) {
  console.log(`${file.filename} - ${file.created_at}`);
}

// Delete a file
await client.beta.files.delete(fileId, {
  betas: ['files-api-2025-04-14']
});
```

```bash Shell
# Get file metadata
curl "https://api.anthropic.com/v1/files/$FILE_ID" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14"

# List all files
curl "https://api.anthropic.com/v1/files" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14"

# Delete a file
curl -X DELETE "https://api.anthropic.com/v1/files/$FILE_ID" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14"
```
</CodeGroup>

<Note>
Pour plus de détails sur l'API Files, consultez la [documentation de l'API Files](/docs/fr/api/files-content).
</Note>

### Conversations multi-tours

Réutilisez le même conteneur sur plusieurs messages en spécifiant l'ID du conteneur :

<CodeGroup>
```python Python
# First request creates container
response1 = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    betas=["code-execution-2025-08-25", "skills-2025-10-02"],
    container={
        "skills": [
            {"type": "anthropic", "skill_id": "xlsx", "version": "latest"}
        ]
    },
    messages=[{"role": "user", "content": "Analyze this sales data"}],
    tools=[{"type": "code_execution_20250825", "name": "code_execution"}]
)

# Continue conversation with same container
messages = [
    {"role": "user", "content": "Analyze this sales data"},
    {"role": "assistant", "content": response1.content},
    {"role": "user", "content": "What was the total revenue?"}
]

response2 = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    betas=["code-execution-2025-08-25", "skills-2025-10-02"],
    container={
        "id": response1.container.id,  # Reuse container
        "skills": [
            {"type": "anthropic", "skill_id": "xlsx", "version": "latest"}
        ]
    },
    messages=messages,
    tools=[{"type": "code_execution_20250825", "name": "code_execution"}]
)
```

```typescript TypeScript
// First request creates container
const response1 = await client.beta.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 4096,
  betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
  container: {
    skills: [
      {type: 'anthropic', skill_id: 'xlsx', version: 'latest'}
    ]
  },
  messages: [{role: 'user', content: 'Analyze this sales data'}],
  tools: [{type: 'code_execution_20250825', name: 'code_execution'}]
});

// Continue conversation with same container
const messages = [
  {role: 'user', content: 'Analyze this sales data'},
  {role: 'assistant', content: response1.content},
  {role: 'user', content: 'What was the total revenue?'}
];

const response2 = await client.beta.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 4096,
  betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
  container: {
    id: response1.container.id,  // Reuse container
    skills: [
      {type: 'anthropic', skill_id: 'xlsx', version: 'latest'}
    ]
  },
  messages,
  tools: [{type: 'code_execution_20250825', name: 'code_execution'}]
});
```
</CodeGroup>

### Opérations de longue durée

Les compétences peuvent effectuer des opérations qui nécessitent plusieurs tours. Gérez les raisons d'arrêt `pause_turn` :

<CodeGroup>
```python Python
messages = [{"role": "user", "content": "Process this large dataset"}]
max_retries = 10

response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    betas=["code-execution-2025-08-25", "skills-2025-10-02"],
    container={
        "skills": [
            {"type": "custom", "skill_id": "skill_01AbCdEfGhIjKlMnOpQrStUv", "version": "latest"}
        ]
    },
    messages=messages,
    tools=[{"type": "code_execution_20250825", "name": "code_execution"}]
)

# Handle pause_turn for long operations
for i in range(max_retries):
    if response.stop_reason != "pause_turn":
        break

    messages.append({"role": "assistant", "content": response.content})
    response = client.beta.messages.create(
        model="claude-sonnet-4-5-20250929",
        max_tokens=4096,
        betas=["code-execution-2025-08-25", "skills-2025-10-02"],
        container={
            "id": response.container.id,
            "skills": [
                {"type": "custom", "skill_id": "skill_01AbCdEfGhIjKlMnOpQrStUv", "version": "latest"}
            ]
        },
        messages=messages,
        tools=[{"type": "code_execution_20250825", "name": "code_execution"}]
    )
```

```typescript TypeScript
let messages = [{role: 'user' as const, content: 'Process this large dataset'}];
const maxRetries = 10;

let response = await client.beta.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 4096,
  betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
  container: {
    skills: [
      {type: 'custom', skill_id: 'skill_01AbCdEfGhIjKlMnOpQrStUv', version: 'latest'}
    ]
  },
  messages,
  tools: [{type: 'code_execution_20250825', name: 'code_execution'}]
});

// Handle pause_turn for long operations
for (let i = 0; i < maxRetries; i++) {
  if (response.stop_reason !== 'pause_turn') {
    break;
  }

  messages.push({role: 'assistant', content: response.content});
  response = await client.beta.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 4096,
    betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
    container: {
      id: response.container.id,
      skills: [
        {type: 'custom', skill_id: 'skill_01AbCdEfGhIjKlMnOpQrStUv', version: 'latest'}
      ]
    },
    messages,
    tools: [{type: 'code_execution_20250825', name: 'code_execution'}]
  });
}
```

```bash Shell
# Initial request
RESPONSE=$(curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5-20250929",
    "max_tokens": 4096,
    "container": {
      "skills": [
        {
          "type": "custom",
          "skill_id": "skill_01AbCdEfGhIjKlMnOpQrStUv",
          "version": "latest"
        }
      ]
    },
    "messages": [{
      "role": "user",
      "content": "Process this large dataset"
    }],
    "tools": [{
      "type": "code_execution_20250825",
      "name": "code_execution"
    }]
  }')

# Check stop_reason and handle pause_turn in a loop
STOP_REASON=$(echo "$RESPONSE" | jq -r '.stop_reason')
CONTAINER_ID=$(echo "$RESPONSE" | jq -r '.container.id')

while [ "$STOP_REASON" = "pause_turn" ]; do
  # Continue with same container
  RESPONSE=$(curl https://api.anthropic.com/v1/messages \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02" \
    -H "content-type: application/json" \
    -d "{
      \"model\": \"claude-sonnet-4-5-20250929\",
      \"max_tokens\": 4096,
      \"container\": {
        \"id\": \"$CONTAINER_ID\",
        \"skills\": [{
          \"type\": \"custom\",
          \"skill_id\": \"skill_01AbCdEfGhIjKlMnOpQrStUv\",
          \"version\": \"latest\"
        }]
      },
      \"messages\": [/* include conversation history */],
      \"tools\": [{
        \"type\": \"code_execution_20250825\",
        \"name\": \"code_execution\"
      }]
    }")

  STOP_REASON=$(echo "$RESPONSE" | jq -r '.stop_reason')
done
```
</CodeGroup>

<Note>
La réponse peut inclure une raison d'arrêt `pause_turn`, qui indique que l'API a mis en pause une opération de compétence de longue durée. Vous pouvez fournir la réponse telle quelle dans une requête ultérieure pour laisser Claude continuer son tour, ou modifier le contenu si vous souhaitez interrompre la conversation et fournir des conseils supplémentaires.
</Note>

### Utilisation de plusieurs compétences

Combinez plusieurs compétences dans une seule requête pour gérer des flux de travail complexes :

<CodeGroup>
```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    betas=["code-execution-2025-08-25", "skills-2025-10-02"],
    container={
        "skills": [
            {
                "type": "anthropic",
                "skill_id": "xlsx",
                "version": "latest"
            },
            {
                "type": "anthropic",
                "skill_id": "pptx",
                "version": "latest"
            },
            {
                "type": "custom",
                "skill_id": "skill_01AbCdEfGhIjKlMnOpQrStUv",
                "version": "latest"
            }
        ]
    },
    messages=[{
        "role": "user",
        "content": "Analyze sales data and create a presentation"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)
```

```typescript TypeScript
const response = await client.beta.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 4096,
  betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
  container: {
    skills: [
      {
        type: 'anthropic',
        skill_id: 'xlsx',
        version: 'latest'
      },
      {
        type: 'anthropic',
        skill_id: 'pptx',
        version: 'latest'
      },
      {
        type: 'custom',
        skill_id: 'skill_01AbCdEfGhIjKlMnOpQrStUv',
        version: 'latest'
      }
    ]
  },
  messages: [{
    role: 'user',
    content: 'Analyze sales data and create a presentation'
  }],
  tools: [{
    type: 'code_execution_20250825',
    name: 'code_execution'
  }]
});
```

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5-20250929",
    "max_tokens": 4096,
    "container": {
      "skills": [
        {
          "type": "anthropic",
          "skill_id": "xlsx",
          "version": "latest"
        },
        {
          "type": "anthropic",
          "skill_id": "pptx",
          "version": "latest"
        },
        {
          "type": "custom",
          "skill_id": "skill_01AbCdEfGhIjKlMnOpQrStUv",
          "version": "latest"
        }
      ]
    },
    "messages": [{
      "role": "user",
      "content": "Analyze sales data and create a presentation"
    }],
    "tools": [{
      "type": "code_execution_20250825",
      "name": "code_execution"
    }]
  }'
```
</CodeGroup>

---

## Gestion des compétences personnalisées

### Créer une compétence

Téléchargez votre compétence personnalisée pour la rendre disponible dans votre espace de travail. Vous pouvez télécharger en utilisant soit un chemin de répertoire, soit des objets de fichier individuels.

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# Option 1: Using files_from_dir helper (Python only, recommended)
from anthropic.lib import files_from_dir

skill = client.beta.skills.create(
    display_title="Financial Analysis",
    files=files_from_dir("/path/to/financial_analysis_skill"),
    betas=["skills-2025-10-02"]
)

# Option 2: Using a zip file
skill = client.beta.skills.create(
    display_title="Financial Analysis",
    files=[("skill.zip", open("financial_analysis_skill.zip", "rb"))],
    betas=["skills-2025-10-02"]
)

# Option 3: Using file tuples (filename, file_content, mime_type)
skill = client.beta.skills.create(
    display_title="Financial Analysis",
    files=[
        ("financial_skill/SKILL.md", open("financial_skill/SKILL.md", "rb"), "text/markdown"),
        ("financial_skill/analyze.py", open("financial_skill/analyze.py", "rb"), "text/x-python"),
    ],
    betas=["skills-2025-10-02"]
)

print(f"Created skill: {skill.id}")
print(f"Latest version: {skill.latest_version}")
```

```typescript TypeScript
import Anthropic, { toFile } from '@anthropic-ai/sdk';
import fs from 'fs';

const client = new Anthropic();

// Option 1: Using a zip file
const skill = await client.beta.skills.create({
  displayTitle: 'Financial Analysis',
  files: [
    await toFile(
      fs.createReadStream('financial_analysis_skill.zip'),
      'skill.zip'
    )
  ],
  betas: ['skills-2025-10-02']
});

// Option 2: Using individual file objects
const skill = await client.beta.skills.create({
  displayTitle: 'Financial Analysis',
  files: [
    await toFile(
      fs.createReadStream('financial_skill/SKILL.md'),
      'financial_skill/SKILL.md',
      { type: 'text/markdown' }
    ),
    await toFile(
      fs.createReadStream('financial_skill/analyze.py'),
      'financial_skill/analyze.py',
      { type: 'text/x-python' }
    ),
  ],
  betas: ['skills-2025-10-02']
});

console.log(`Created skill: ${skill.id}`);
console.log(`Latest version: ${skill.latest_version}`);
```

```bash Shell
curl -X POST "https://api.anthropic.com/v1/skills" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: skills-2025-10-02" \
  -F "display_title=Financial Analysis" \
  -F "files[]=@financial_skill/SKILL.md;filename=financial_skill/SKILL.md" \
  -F "files[]=@financial_skill/analyze.py;filename=financial_skill/analyze.py"
```
</CodeGroup>

**Exigences :**
- Doit inclure un fichier SKILL.md au niveau supérieur
- Tous les fichiers doivent spécifier un répertoire racine commun dans leurs chemins
- La taille totale du téléchargement doit être inférieure à 8 Mo
- Exigences du frontmatter YAML :
  - `name` : Maximum 64 caractères, lettres minuscules/chiffres/tirets uniquement, pas de balises XML, pas de mots réservés (« anthropic », « claude »)
  - `description` : Maximum 1024 caractères, non vide, pas de balises XML

Pour les schémas complets de requête/réponse, consultez la [référence API Create Skill](/docs/fr/api/skills/create-skill).

### Lister les compétences

Récupérez toutes les compétences disponibles pour votre espace de travail, y compris les compétences prédéfinies Anthropic et vos compétences personnalisées. Utilisez le paramètre `source` pour filtrer par type de compétence :

<CodeGroup>
```python Python
# List all Skills
skills = client.beta.skills.list(
    betas=["skills-2025-10-02"]
)

for skill in skills.data:
    print(f"{skill.id}: {skill.display_title} (source: {skill.source})")

# List only custom Skills
custom_skills = client.beta.skills.list(
    source="custom",
    betas=["skills-2025-10-02"]
)
```

```typescript TypeScript
// List all Skills
const skills = await client.beta.skills.list({
  betas: ['skills-2025-10-02']
});

for (const skill of skills.data) {
  console.log(`${skill.id}: ${skill.display_title} (source: ${skill.source})`);
}

// List only custom Skills
const customSkills = await client.beta.skills.list({
  source: 'custom',
  betas: ['skills-2025-10-02']
});
```

```bash Shell
# List all Skills
curl "https://api.anthropic.com/v1/skills" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: skills-2025-10-02"

# List only custom Skills
curl "https://api.anthropic.com/v1/skills?source=custom" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: skills-2025-10-02"
```
</CodeGroup>

Consultez la [référence API List Skills](/docs/fr/api/skills/list-skills) pour les options de pagination et de filtrage.

### Récupérer une compétence

Obtenez des détails sur une compétence spécifique :

<CodeGroup>
```python Python
skill = client.beta.skills.retrieve(
    skill_id="skill_01AbCdEfGhIjKlMnOpQrStUv",
    betas=["skills-2025-10-02"]
)

print(f"Skill: {skill.display_title}")
print(f"Latest version: {skill.latest_version}")
print(f"Created: {skill.created_at}")
```

```typescript TypeScript
const skill = await client.beta.skills.retrieve(
  'skill_01AbCdEfGhIjKlMnOpQrStUv',
  { betas: ['skills-2025-10-02'] }
);

console.log(`Skill: ${skill.display_title}`);
console.log(`Latest version: ${skill.latest_version}`);
console.log(`Created: ${skill.created_at}`);
```

```bash Shell
curl "https://api.anthropic.com/v1/skills/skill_01AbCdEfGhIjKlMnOpQrStUv" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: skills-2025-10-02"
```
</CodeGroup>

### Supprimer une compétence

Pour supprimer une compétence, vous devez d'abord supprimer toutes ses versions :

<CodeGroup>
```python Python
# Step 1: Delete all versions
versions = client.beta.skills.versions.list(
    skill_id="skill_01AbCdEfGhIjKlMnOpQrStUv",
    betas=["skills-2025-10-02"]
)

for version in versions.data:
    client.beta.skills.versions.delete(
        skill_id="skill_01AbCdEfGhIjKlMnOpQrStUv",
        version=version.version,
        betas=["skills-2025-10-02"]
    )

# Step 2: Delete the Skill
client.beta.skills.delete(
    skill_id="skill_01AbCdEfGhIjKlMnOpQrStUv",
    betas=["skills-2025-10-02"]
)
```

```typescript TypeScript
// Step 1: Delete all versions
const versions = await client.beta.skills.versions.list(
  'skill_01AbCdEfGhIjKlMnOpQrStUv',
  { betas: ['skills-2025-10-02'] }
);

for (const version of versions.data) {
  await client.beta.skills.versions.delete(
    'skill_01AbCdEfGhIjKlMnOpQrStUv',
    version.version,
    { betas: ['skills-2025-10-02'] }
  );
}

// Step 2: Delete the Skill
await client.beta.skills.delete(
  'skill_01AbCdEfGhIjKlMnOpQrStUv',
  { betas: ['skills-2025-10-02'] }
);
```

```bash Shell
# Delete all versions first, then delete the Skill
curl -X DELETE "https://api.anthropic.com/v1/skills/skill_01AbCdEfGhIjKlMnOpQrStUv" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: skills-2025-10-02"
```
</CodeGroup>

Toute tentative de suppression d'une compétence avec des versions existantes retournera une erreur 400.

### Versioning

Les compétences prennent en charge le versioning pour gérer les mises à jour en toute sécurité :

**Compétences gérées par Anthropic** :
- Les versions utilisent le format de date : `20251013`
- Les nouvelles versions sont publiées au fur et à mesure que les mises à jour sont effectuées
- Spécifiez les versions exactes pour la stabilité

**Compétences personnalisées** :
- Timestamps d'époque générés automatiquement : `1759178010641129`
- Utilisez `"latest"` pour toujours obtenir la version la plus récente
- Créez de nouvelles versions lors de la mise à jour des fichiers de compétence

<CodeGroup>
```python Python
# Create a new version
from anthropic.lib import files_from_dir

new_version = client.beta.skills.versions.create(
    skill_id="skill_01AbCdEfGhIjKlMnOpQrStUv",
    files=files_from_dir("/path/to/updated_skill"),
    betas=["skills-2025-10-02"]
)

# Use specific version
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    betas=["code-execution-2025-08-25", "skills-2025-10-02"],
    container={
        "skills": [{
            "type": "custom",
            "skill_id": "skill_01AbCdEfGhIjKlMnOpQrStUv",
            "version": new_version.version
        }]
    },
    messages=[{"role": "user", "content": "Use updated Skill"}],
    tools=[{"type": "code_execution_20250825", "name": "code_execution"}]
)

# Use latest version
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    betas=["code-execution-2025-08-25", "skills-2025-10-02"],
    container={
        "skills": [{
            "type": "custom",
            "skill_id": "skill_01AbCdEfGhIjKlMnOpQrStUv",
            "version": "latest"
        }]
    },
    messages=[{"role": "user", "content": "Use latest Skill version"}],
    tools=[{"type": "code_execution_20250825", "name": "code_execution"}]
)
```

```typescript TypeScript
// Create a new version using a zip file
const fs = require('fs');

const newVersion = await client.beta.skills.versions.create(
  'skill_01AbCdEfGhIjKlMnOpQrStUv',
  {
    files: [
      fs.createReadStream('updated_skill.zip')
    ],
    betas: ['skills-2025-10-02']
  }
);

// Use specific version
const response = await client.beta.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 4096,
  betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
  container: {
    skills: [{
      type: 'custom',
      skill_id: 'skill_01AbCdEfGhIjKlMnOpQrStUv',
      version: newVersion.version
    }]
  },
  messages: [{role: 'user', content: 'Use updated Skill'}],
  tools: [{type: 'code_execution_20250825', name: 'code_execution'}]
});

// Use latest version
const response = await client.beta.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 4096,
  betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
  container: {
    skills: [{
      type: 'custom',
      skill_id: 'skill_01AbCdEfGhIjKlMnOpQrStUv',
      version: 'latest'
    }]
  },
  messages: [{role: 'user', content: 'Use latest Skill version'}],
  tools: [{type: 'code_execution_20250825', name: 'code_execution'}]
});
```

```bash Shell
# Create a new version
NEW_VERSION=$(curl -X POST "https://api.anthropic.com/v1/skills/skill_01AbCdEfGhIjKlMnOpQrStUv/versions" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: skills-2025-10-02" \
  -F "files[]=@updated_skill/SKILL.md;filename=updated_skill/SKILL.md")

VERSION_NUMBER=$(echo "$NEW_VERSION" | jq -r '.version')

# Use specific version
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02" \
  -H "content-type: application/json" \
  -d "{
    \"model\": \"claude-sonnet-4-5-20250929\",
    \"max_tokens\": 4096,
    \"container\": {
      \"skills\": [{
        \"type\": \"custom\",
        \"skill_id\": \"skill_01AbCdEfGhIjKlMnOpQrStUv\",
        \"version\": \"$VERSION_NUMBER\"
      }]
    },
    \"messages\": [{\"role\": \"user\", \"content\": \"Use updated Skill\"}],
    \"tools\": [{\"type\": \"code_execution_20250825\", \"name\": \"code_execution\"}]
  }"

# Use latest version
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5-20250929",
    "max_tokens": 4096,
    "container": {
      "skills": [{
        "type": "custom",
        "skill_id": "skill_01AbCdEfGhIjKlMnOpQrStUv",
        "version": "latest"
      }]
    },
    "messages": [{"role": "user", "content": "Use latest Skill version"}],
    "tools": [{"type": "code_execution_20250825", "name": "code_execution"}]
  }'
```
</CodeGroup>

Consultez la [référence API Create Skill Version](/docs/fr/api/skills/create-skill-version) pour plus de détails.

---

## Comment les compétences sont chargées

Lorsque vous spécifiez des compétences dans un conteneur :

1. **Découverte des métadonnées** : Claude voit les métadonnées de chaque compétence (nom, description) dans l'invite système
2. **Chargement des fichiers** : Les fichiers de compétence sont copiés dans le conteneur à `/skills/{directory}/`
3. **Utilisation automatique** : Claude charge et utilise automatiquement les compétences lorsqu'elles sont pertinentes pour votre demande
4. **Composition** : Plusieurs compétences se composent ensemble pour des flux de travail complexes

L'architecture de divulgation progressive garantit une utilisation efficace du contexte—Claude ne charge les instructions complètes de compétence que lorsque cela est nécessaire.

---

## Cas d'utilisation

### Compétences organisationnelles

**Marque et communications**
- Appliquer le formatage spécifique à l'entreprise (couleurs, polices, mises en page) aux documents
- Générer des communications suivant les modèles organisationnels
- Assurer la cohérence des directives de marque dans tous les résultats

**Gestion de projet**
- Structurer les notes avec des formats spécifiques à l'entreprise (OKRs, journaux de décision)
- Générer des tâches suivant les conventions de l'équipe
- Créer des récapitulatifs de réunion et des mises à jour de statut standardisés

**Opérations commerciales**
- Créer des rapports, propositions et analyses conformes à l'entreprise
- Exécuter des procédures analytiques spécifiques à l'entreprise
- Générer des modèles financiers suivant les modèles organisationnels

### Compétences personnelles

**Création de contenu**
- Modèles de document personnalisés
- Formatage et style spécialisés
- Génération de contenu spécifique au domaine

**Analyse de données**
- Pipelines de traitement de données personnalisés
- Modèles de visualisation spécialisés
- Méthodes analytiques spécifiques à l'industrie

**Développement et automatisation**
- Modèles de génération de code
- Cadres de test
- Flux de travail de déploiement

### Exemple : Modélisation financière

Combinez les compétences Excel et d'analyse DCF personnalisée :

<CodeGroup>
```python Python
# Create custom DCF analysis Skill
from anthropic.lib import files_from_dir

dcf_skill = client.beta.skills.create(
    display_title="DCF Analysis",
    files=files_from_dir("/path/to/dcf_skill"),
    betas=["skills-2025-10-02"]
)

# Use with Excel to create financial model
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    betas=["code-execution-2025-08-25", "skills-2025-10-02"],
    container={
        "skills": [
            {"type": "anthropic", "skill_id": "xlsx", "version": "latest"},
            {"type": "custom", "skill_id": dcf_skill.id, "version": "latest"}
        ]
    },
    messages=[{
        "role": "user",
        "content": "Build a DCF valuation model for a SaaS company with the attached financials"
    }],
    tools=[{"type": "code_execution_20250825", "name": "code_execution"}]
)
```

```typescript TypeScript
// Create custom DCF analysis Skill
import { toFile } from '@anthropic-ai/sdk';
import fs from 'fs';

const dcfSkill = await client.beta.skills.create({
  displayTitle: 'DCF Analysis',
  files: [
    await toFile(fs.createReadStream('dcf_skill.zip'), 'skill.zip')
  ],
  betas: ['skills-2025-10-02']
});

// Use with Excel to create financial model
const response = await client.beta.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 4096,
  betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
  container: {
    skills: [
      {type: 'anthropic', skill_id: 'xlsx', version: 'latest'},
      {type: 'custom', skill_id: dcfSkill.id, version: 'latest'}
    ]
  },
  messages: [{
    role: 'user',
    content: 'Build a DCF valuation model for a SaaS company with the attached financials'
  }],
  tools: [{type: 'code_execution_20250825', name: 'code_execution'}]
});
```

```bash Shell
# Create custom DCF analysis Skill
DCF_SKILL=$(curl -X POST "https://api.anthropic.com/v1/skills" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: skills-2025-10-02" \
  -F "display_title=DCF Analysis" \
  -F "files[]=@dcf_skill/SKILL.md;filename=dcf_skill/SKILL.md")

DCF_SKILL_ID=$(echo "$DCF_SKILL" | jq -r '.id')

# Use with Excel to create financial model
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02" \
  -H "content-type: application/json" \
  -d "{
    \"model\": \"claude-sonnet-4-5-20250929\",
    \"max_tokens\": 4096,
    \"container\": {
      \"skills\": [
        {
          \"type\": \"anthropic\",
          \"skill_id\": \"xlsx\",
          \"version\": \"latest\"
        },
        {
          \"type\": \"custom\",
          \"skill_id\": \"$DCF_SKILL_ID\",
          \"version\": \"latest\"
        }
      ]
    },
    \"messages\": [{
      \"role\": \"user\",
      \"content\": \"Build a DCF valuation model for a SaaS company with the attached financials\"
    }],
    \"tools\": [{
      \"type\": \"code_execution_20250825\",
      \"name\": \"code_execution\"
    }]
  }"
```
</CodeGroup>

---

## Limites et contraintes

### Limites de requête
- **Nombre maximum de compétences par requête** : 8
- **Taille maximale du téléchargement de compétence** : 8 Mo (tous les fichiers combinés)
- **Exigences du frontmatter YAML** :
  - `name` : Maximum 64 caractères, lettres minuscules/chiffres/tirets uniquement, pas de balises XML, pas de mots réservés
  - `description` : Maximum 1024 caractères, non vide, pas de balises XML

### Contraintes d'environnement
Les compétences s'exécutent dans le conteneur d'exécution de code avec ces limitations :
- **Pas d'accès réseau** - Impossible de faire des appels API externes
- **Pas d'installation de paquets d'exécution** - Seuls les paquets préinstallés disponibles
- **Environnement isolé** - Chaque requête obtient un conteneur frais

Consultez la [documentation de l'outil d'exécution de code](/docs/fr/agents-and-tools/tool-use/code-execution-tool) pour les paquets disponibles.

---

## Meilleures pratiques

### Quand utiliser plusieurs compétences

Combinez les compétences lorsque les tâches impliquent plusieurs types de documents ou domaines :

**Bons cas d'utilisation :**
- Analyse de données (Excel) + création de présentation (PowerPoint)
- Génération de rapport (Word) + export en PDF
- Logique de domaine personnalisée + génération de document

**À éviter :**
- Inclure des compétences inutilisées (affecte les performances)

### Stratégie de gestion des versions

**Pour la production :**
```python
# Pin to specific versions for stability
container={
    "skills": [{
        "type": "custom",
        "skill_id": "skill_01AbCdEfGhIjKlMnOpQrStUv",
        "version": "1759178010641129"  # Specific version
    }]
}
```

**Pour le développement :**
```python
# Use latest for active development
container={
    "skills": [{
        "type": "custom",
        "skill_id": "skill_01AbCdEfGhIjKlMnOpQrStUv",
        "version": "latest"  # Always get newest
    }]
}
```

### Considérations relatives à la mise en cache des invites

Lors de l'utilisation de la mise en cache des invites, notez que la modification de la liste des compétences dans votre conteneur cassera le cache :

<CodeGroup>
```python Python
# First request creates cache
response1 = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    betas=["code-execution-2025-08-25", "skills-2025-10-02", "prompt-caching-2024-07-31"],
    container={
        "skills": [
            {"type": "anthropic", "skill_id": "xlsx", "version": "latest"}
        ]
    },
    messages=[{"role": "user", "content": "Analyze sales data"}],
    tools=[{"type": "code_execution_20250825", "name": "code_execution"}]
)

# Adding/removing Skills breaks cache
response2 = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    betas=["code-execution-2025-08-25", "skills-2025-10-02", "prompt-caching-2024-07-31"],
    container={
        "skills": [
            {"type": "anthropic", "skill_id": "xlsx", "version": "latest"},
            {"type": "anthropic", "skill_id": "pptx", "version": "latest"}  # Cache miss
        ]
    },
    messages=[{"role": "user", "content": "Create a presentation"}],
    tools=[{"type": "code_execution_20250825", "name": "code_execution"}]
)
```

```typescript TypeScript
// First request creates cache
const response1 = await client.beta.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 4096,
  betas: ['code-execution-2025-08-25', 'skills-2025-10-02', 'prompt-caching-2024-07-31'],
  container: {
    skills: [
      {type: 'anthropic', skill_id: 'xlsx', version: 'latest'}
    ]
  },
  messages: [{role: 'user', content: 'Analyze sales data'}],
  tools: [{type: 'code_execution_20250825', name: 'code_execution'}]
});

// Adding/removing Skills breaks cache
const response2 = await client.beta.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 4096,
  betas: ['code-execution-2025-08-25', 'skills-2025-10-02', 'prompt-caching-2024-07-31'],
  container: {
    skills: [
      {type: 'anthropic', skill_id: 'xlsx', version: 'latest'},
      {type: 'anthropic', skill_id: 'pptx', version: 'latest'}  // Cache miss
    ]
  },
  messages: [{role: 'user', content: 'Create a presentation'}],
  tools: [{type: 'code_execution_20250825', name: 'code_execution'}]
});
```

```bash Shell
# First request creates cache
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02,prompt-caching-2024-07-31" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5-20250929",
    "max_tokens": 4096,
    "container": {
      "skills": [
        {"type": "anthropic", "skill_id": "xlsx", "version": "latest"}
      ]
    },
    "messages": [{"role": "user", "content": "Analyze sales data"}],
    "tools": [{"type": "code_execution_20250825", "name": "code_execution"}]
  }'

# Adding/removing Skills breaks cache
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02,prompt-caching-2024-07-31" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5-20250929",
    "max_tokens": 4096,
    "container": {
      "skills": [
        {"type": "anthropic", "skill_id": "xlsx", "version": "latest"},
        {"type": "anthropic", "skill_id": "pptx", "version": "latest"}
      ]
    },
    "messages": [{"role": "user", "content": "Create a presentation"}],
    "tools": [{"type": "code_execution_20250825", "name": "code_execution"}]
  }'
```
</CodeGroup>

Pour les meilleures performances de mise en cache, gardez votre liste de compétences cohérente entre les requêtes.

### Gestion des erreurs

Gérez les erreurs liées aux compétences avec élégance :

<CodeGroup>
```python Python
try:
    response = client.beta.messages.create(
        model="claude-sonnet-4-5-20250929",
        max_tokens=4096,
        betas=["code-execution-2025-08-25", "skills-2025-10-02"],
        container={
            "skills": [
                {"type": "custom", "skill_id": "skill_01AbCdEfGhIjKlMnOpQrStUv", "version": "latest"}
            ]
        },
        messages=[{"role": "user", "content": "Process data"}],
        tools=[{"type": "code_execution_20250825", "name": "code_execution"}]
    )
except anthropic.BadRequestError as e:
    if "skill" in str(e):
        print(f"Skill error: {e}")
        # Handle skill-specific errors
    else:
        raise
```

```typescript TypeScript
try {
  const response = await client.beta.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 4096,
    betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
    container: {
      skills: [
        {type: 'custom', skill_id: 'skill_01AbCdEfGhIjKlMnOpQrStUv', version: 'latest'}
      ]
    },
    messages: [{role: 'user', content: 'Process data'}],
    tools: [{type: 'code_execution_20250825', name: 'code_execution'}]
  });
} catch (error) {
  if (error instanceof Anthropic.BadRequestError && error.message.includes('skill')) {
    console.error(`Skill error: ${error.message}`);
    // Handle skill-specific errors
  } else {
    throw error;
  }
}
```
</CodeGroup>

---

## Étapes suivantes

<CardGroup cols={2}>
  <Card
    title="Référence API"
    icon="book"
    href="/docs/fr/api/skills/create-skill"
  >
    Référence API complète avec tous les points de terminaison
  </Card>
  <Card
    title="Guide de création"
    icon="edit"
    href="/docs/fr/agents-and-tools/agent-skills/best-practices"
  >
    Meilleures pratiques pour écrire des compétences efficaces
  </Card>
  <Card
    title="Outil d'exécution de code"
    icon="terminal"
    href="/docs/fr/agents-and-tools/tool-use/code-execution-tool"
  >
    En savoir plus sur l'environnement d'exécution de code
  </Card>
</CardGroup>