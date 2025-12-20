# Outil de mémoire

L'outil de mémoire permet à Claude de stocker et récupérer des informations entre les conversations via un répertoire de fichiers de mémoire.

---

L'outil de mémoire permet à Claude de stocker et récupérer des informations entre les conversations via un répertoire de fichiers de mémoire. Claude peut créer, lire, mettre à jour et supprimer des fichiers qui persistent entre les sessions, ce qui lui permet de construire des connaissances au fil du temps sans garder tout dans la fenêtre de contexte.

L'outil de mémoire fonctionne côté client — vous contrôlez où et comment les données sont stockées via votre propre infrastructure.

<Note>
L'outil de mémoire est actuellement en version bêta. Pour l'activer, utilisez l'en-tête bêta `context-management-2025-06-27` dans vos requêtes API.

Veuillez nous contacter via notre [formulaire de retours](https://forms.gle/YXC2EKGMhjN1c4L88) pour partager vos commentaires sur cette fonctionnalité.
</Note>

## Cas d'usage

- Maintenir le contexte du projet entre plusieurs exécutions d'agent
- Apprendre des interactions, décisions et retours passés
- Construire des bases de connaissances au fil du temps
- Activer l'apprentissage entre conversations où Claude s'améliore dans les flux de travail récurrents

## Fonctionnement

Lorsqu'il est activé, Claude vérifie automatiquement son répertoire de mémoire avant de commencer les tâches. Claude peut créer, lire, mettre à jour et supprimer des fichiers dans le répertoire `/memories` pour stocker ce qu'il apprend en travaillant, puis référencer ces mémoires dans les futures conversations pour gérer des tâches similaires plus efficacement ou reprendre là où il s'était arrêté.

Puisqu'il s'agit d'un outil côté client, Claude effectue des appels d'outil pour exécuter les opérations de mémoire, et votre application exécute ces opérations localement. Cela vous donne un contrôle total sur où et comment la mémoire est stockée. Pour la sécurité, vous devriez restreindre toutes les opérations de mémoire au répertoire `/memories`.

### Exemple : Fonctionnement des appels d'outil de mémoire

Lorsque vous demandez à Claude d'aider avec une tâche, Claude vérifie automatiquement son répertoire de mémoire en premier. Voici à quoi ressemble une interaction typique :

**1. Demande de l'utilisateur :**
```
"Aide-moi à répondre à ce ticket de service client."
```

**2. Claude vérifie le répertoire de mémoire :**
```
"Je vais vous aider à répondre au ticket de service client. Laissez-moi vérifier ma mémoire pour tout contexte antérieur."
```

Claude appelle l'outil de mémoire :
```json
{
  "type": "tool_use",
  "id": "toolu_01C4D5E6F7G8H9I0J1K2L3M4",
  "name": "memory",
  "input": {
    "command": "view",
    "path": "/memories"
  }
}
```

**3. Votre application retourne le contenu du répertoire :**
```json
{
  "type": "tool_result",
  "tool_use_id": "toolu_01C4D5E6F7G8H9I0J1K2L3M4",
  "content": "Voici les fichiers et répertoires jusqu'à 2 niveaux de profondeur dans /memories, excluant les éléments cachés et node_modules:\n4.0K\t/memories\n1.5K\t/memories/customer_service_guidelines.xml\n2.0K\t/memories/refund_policies.xml"
}
```

**4. Claude lit les fichiers pertinents :**
```json
{
  "type": "tool_use",
  "id": "toolu_01D5E6F7G8H9I0J1K2L3M4N5",
  "name": "memory",
  "input": {
    "command": "view",
    "path": "/memories/customer_service_guidelines.xml"
  }
}
```

**5. Votre application retourne le contenu du fichier :**
```json
{
  "type": "tool_result",
  "tool_use_id": "toolu_01D5E6F7G8H9I0J1K2L3M4N5",
  "content": "Voici le contenu de /memories/customer_service_guidelines.xml avec les numéros de ligne:\n     1\t<guidelines>\n     2\t<addressing_customers>\n     3\t- Adressez-vous toujours aux clients par leur prénom\n     4\t- Utilisez un langage empathique\n..."
}
```

**6. Claude utilise la mémoire pour aider :**
```
"En fonction de vos directives de service client, je peux vous aider à rédiger une réponse. Veuillez partager les détails du ticket..."
```

## Modèles pris en charge

L'outil de mémoire est disponible sur :

- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)
- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)

## Mise en route

Pour utiliser l'outil de mémoire :

1. Incluez l'en-tête bêta `context-management-2025-06-27` dans vos requêtes API
2. Ajoutez l'outil de mémoire à votre requête
3. Implémentez des gestionnaires côté client pour les opérations de mémoire

<Note>
Pour gérer les opérations d'outil de mémoire dans votre application, vous devez implémenter des gestionnaires pour chaque commande de mémoire. Nos SDK fournissent des assistants d'outil de mémoire qui gèrent l'interface d'outil — vous pouvez créer une sous-classe de `BetaAbstractMemoryTool` (Python) ou utiliser `betaMemoryTool` (TypeScript) pour implémenter votre propre backend de mémoire (basé sur fichiers, base de données, stockage cloud, fichiers chiffrés, etc.).

Pour des exemples fonctionnels, voir :
- Python : [examples/memory/basic.py](https://github.com/anthropics/anthropic-sdk-python/blob/main/examples/memory/basic.py)
- TypeScript : [examples/tools-helpers-memory.ts](https://github.com/anthropics/anthropic-sdk-typescript/blob/main/examples/tools-helpers-memory.ts)
</Note>

## Utilisation basique

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 2048,
        "messages": [
            {
                "role": "user",
                "content": "I'\''m working on a Python web scraper that keeps crashing with a timeout error. Here'\''s the problematic function:\n\n```python\ndef fetch_page(url, retries=3):\n    for i in range(retries):\n        try:\n            response = requests.get(url, timeout=5)\n            return response.text\n        except requests.exceptions.Timeout:\n            if i == retries - 1:\n                raise\n            time.sleep(1)\n```\n\nPlease help me debug this."
            }
        ],
        "tools": [{
            "type": "memory_20250818",
            "name": "memory"
        }]
    }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

message = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=2048,
    messages=[
        {
            "role": "user",
            "content": "I'm working on a Python web scraper that keeps crashing with a timeout error. Here's the problematic function:\n\n```python\ndef fetch_page(url, retries=3):\n    for i in range(retries):\n        try:\n            response = requests.get(url, timeout=5)\n            return response.text\n        except requests.exceptions.Timeout:\n            if i == retries - 1:\n                raise\n            time.sleep(1)\n```\n\nPlease help me debug this."
        }
    ],
    tools=[{
        "type": "memory_20250818",
        "name": "memory"
    }],
    betas=["context-management-2025-06-27"]
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const message = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 2048,
  messages: [
    {
      role: "user",
      content: "I'm working on a Python web scraper that keeps crashing with a timeout error. Here's the problematic function:\n\n```python\ndef fetch_page(url, retries=3):\n    for i in range(retries):\n        try:\n            response = requests.get(url, timeout=5)\n            return response.text\n        except requests.exceptions.Timeout:\n            if i == retries - 1:\n                raise\n            time.sleep(1)\n```\n\nPlease help me debug this."
    }
  ],
  tools: [{
    type: "memory_20250818",
    name: "memory"
  }],
  betas: ["context-management-2025-06-27"]
});
```

</CodeGroup>

## Commandes d'outil

Votre implémentation côté client doit gérer ces commandes d'outil de mémoire. Bien que ces spécifications décrivent les comportements recommandés avec lesquels Claude est le plus familier, vous pouvez modifier votre implémentation et retourner des chaînes de caractères selon les besoins de votre cas d'usage.

### view
Affiche le contenu du répertoire ou le contenu du fichier avec des plages de lignes optionnelles :

```json
{
  "command": "view",
  "path": "/memories",
  "view_range": [1, 10]  // Optionnel : afficher des lignes spécifiques
}
```

#### Valeurs de retour

**Pour les répertoires :** Retournez une liste qui affiche les fichiers et répertoires avec leurs tailles :
```
Voici les fichiers et répertoires jusqu'à 2 niveaux de profondeur dans {path}, excluant les éléments cachés et node_modules :
{size}    {path}
{size}    {path}/{filename1}
{size}    {path}/{filename2}
```

- Liste les fichiers jusqu'à 2 niveaux de profondeur
- Affiche les tailles lisibles par l'homme (par exemple, `5.5K`, `1.2M`)
- Exclut les éléments cachés (fichiers commençant par `.`) et `node_modules`
- Utilise un caractère de tabulation entre la taille et le chemin

**Pour les fichiers :** Retournez le contenu du fichier avec un en-tête et des numéros de ligne :
```
Voici le contenu de {path} avec les numéros de ligne :
{line_numbers}{tab}{content}
```

Formatage des numéros de ligne :
- **Largeur** : 6 caractères, alignés à droite avec remplissage d'espaces
- **Séparateur** : Caractère de tabulation entre le numéro de ligne et le contenu
- **Indexation** : Indexée à partir de 1 (la première ligne est la ligne 1)
- **Limite de lignes** : Les fichiers avec plus de 999 999 lignes doivent retourner une erreur : `"File {path} exceeds maximum line limit of 999,999 lines."`

**Exemple de sortie :**
```
Voici le contenu de /memories/notes.txt avec les numéros de ligne :
     1	Hello World
     2	This is line two
    10	Line ten
   100	Line one hundred
```

#### Gestion des erreurs

- **Le fichier/répertoire n'existe pas** : `"The path {path} does not exist. Please provide a valid path."`

### create
Créer un nouveau fichier :

```json
{
  "command": "create",
  "path": "/memories/notes.txt",
  "file_text": "Meeting notes:\n- Discussed project timeline\n- Next steps defined\n"
}
```

#### Valeurs de retour

- **Succès** : `"File created successfully at: {path}"`

#### Gestion des erreurs

- **Le fichier existe déjà** : `"Error: File {path} already exists"`

### str_replace
Remplacer du texte dans un fichier :

```json
{
  "command": "str_replace",
  "path": "/memories/preferences.txt",
  "old_str": "Favorite color: blue",
  "new_str": "Favorite color: green"
}
```

#### Valeurs de retour

- **Succès** : `"The memory file has been edited."` suivi d'un extrait du fichier édité avec les numéros de ligne

#### Gestion des erreurs

- **Le fichier n'existe pas** : `"Error: The path {path} does not exist. Please provide a valid path."`
- **Texte non trouvé** : ``"No replacement was performed, old_str `{old_str}` did not appear verbatim in {path}."``
- **Texte en double** : Lorsque `old_str` apparaît plusieurs fois, retournez : ``"No replacement was performed. Multiple occurrences of old_str `{old_str}` in lines: {line_numbers}. Please ensure it is unique"``

#### Gestion des répertoires

Si le chemin est un répertoire, retournez une erreur "fichier n'existe pas".

### insert
Insérer du texte à une ligne spécifique :

```json
{
  "command": "insert",
  "path": "/memories/todo.txt",
  "insert_line": 2,
  "insert_text": "- Review memory tool documentation\n"
}
```

#### Valeurs de retour

- **Succès** : `"The file {path} has been edited."`

#### Gestion des erreurs

- **Le fichier n'existe pas** : `"Error: The path {path} does not exist"`
- **Numéro de ligne invalide** : ``"Error: Invalid `insert_line` parameter: {insert_line}. It should be within the range of lines of the file: [0, {n_lines}]"``

#### Gestion des répertoires

Si le chemin est un répertoire, retournez une erreur "fichier n'existe pas".

### delete
Supprimer un fichier ou un répertoire :

```json
{
  "command": "delete",
  "path": "/memories/old_file.txt"
}
```

#### Valeurs de retour

- **Succès** : `"Successfully deleted {path}"`

#### Gestion des erreurs

- **Le fichier/répertoire n'existe pas** : `"Error: The path {path} does not exist"`

#### Gestion des répertoires

Supprime le répertoire et tout son contenu de manière récursive.

### rename
Renommer ou déplacer un fichier/répertoire :

```json
{
  "command": "rename",
  "old_path": "/memories/draft.txt",
  "new_path": "/memories/final.txt"
}
```

#### Valeurs de retour

- **Succès** : `"Successfully renamed {old_path} to {new_path}"`

#### Gestion des erreurs

- **La source n'existe pas** : `"Error: The path {old_path} does not exist"`
- **La destination existe déjà** : Retournez une erreur (ne pas écraser) : `"Error: The destination {new_path} already exists"`

#### Gestion des répertoires

Renomme le répertoire.

## Conseils de formulation

Nous incluons automatiquement cette instruction dans l'invite système lorsque l'outil de mémoire est inclus :

```
IMPORTANT: ALWAYS VIEW YOUR MEMORY DIRECTORY BEFORE DOING ANYTHING ELSE.
MEMORY PROTOCOL:
1. Use the `view` command of your `memory` tool to check for earlier progress.
2. ... (work on the task) ...
     - As you make progress, record status / progress / thoughts etc in your memory.
ASSUME INTERRUPTION: Your context window might be reset at any moment, so you risk losing any progress that is not recorded in your memory directory.
```

Si vous observez Claude créant des fichiers de mémoire désorganisés, vous pouvez inclure cette instruction :

> Remarque : lors de la modification de votre dossier de mémoire, essayez toujours de maintenir son contenu à jour, cohérent et organisé. Vous pouvez renommer ou supprimer les fichiers qui ne sont plus pertinents. Ne créez pas de nouveaux fichiers à moins que cela ne soit nécessaire.

Vous pouvez également guider ce que Claude écrit en mémoire, par exemple, « Écrivez uniquement les informations pertinentes pour \<topic\> dans votre système de mémoire. »

## Considérations de sécurité

Voici les préoccupations de sécurité importantes lors de l'implémentation de votre magasin de mémoire :

### Informations sensibles
Claude refusera généralement d'écrire des informations sensibles dans les fichiers de mémoire. Cependant, vous voudrez peut-être implémenter une validation plus stricte qui supprime les informations potentiellement sensibles.

### Taille du stockage de fichiers de mémoire
Envisagez de suivre les tailles des fichiers de mémoire et d'empêcher les fichiers de devenir trop volumineux. Envisagez d'ajouter un nombre maximum de caractères que la commande de lecture de mémoire peut retourner, et laissez Claude paginer le contenu.

### Expiration de la mémoire
Envisagez d'effacer périodiquement les fichiers de mémoire qui n'ont pas été accédés pendant une période prolongée.

### Protection contre la traversée de répertoires

<Warning>
Les entrées de chemin malveillantes pourraient tenter d'accéder à des fichiers en dehors du répertoire `/memories`. Votre implémentation **DOIT** valider tous les chemins pour prévenir les attaques de traversée de répertoires.
</Warning>

Envisagez ces protections :

- Validez que tous les chemins commencent par `/memories`
- Résolvez les chemins à leur forme canonique et vérifiez qu'ils restent dans le répertoire de mémoire
- Rejetez les chemins contenant des séquences comme `../`, `..\\`, ou d'autres motifs de traversée
- Surveillez les séquences de traversée codées en URL (`%2e%2e%2f`)
- Utilisez les utilitaires de sécurité des chemins intégrés à votre langage (par exemple, `pathlib.Path.resolve()` et `relative_to()` de Python)

## Gestion des erreurs

L'outil de mémoire utilise des motifs de gestion des erreurs similaires à l'[outil d'éditeur de texte](/docs/fr/agents-and-tools/tool-use/text-editor-tool#handle-errors). Consultez les sections de commande d'outil individuelles ci-dessus pour les messages d'erreur détaillés et les comportements. Les erreurs courantes incluent fichier non trouvé, erreurs de permission, chemins invalides et correspondances de texte en double.

## Utilisation avec l'édition de contexte

L'outil de mémoire peut être combiné avec l'[édition de contexte](/docs/fr/build-with-claude/context-editing), qui efface automatiquement les anciens résultats d'outil lorsque le contexte de conversation dépasse un seuil configuré. Cette combinaison permet des flux de travail agentiques de longue durée qui dépasseraient autrement les limites de contexte.

### Fonctionnement ensemble

Lorsque l'édition de contexte est activée et que votre conversation approche du seuil d'effacement, Claude reçoit automatiquement une notification d'avertissement. Cela incite Claude à préserver toute information importante des résultats d'outil dans les fichiers de mémoire avant que ces résultats ne soient effacés de la fenêtre de contexte.

Après l'effacement des résultats d'outil, Claude peut récupérer les informations stockées à partir des fichiers de mémoire chaque fois que nécessaire, traitant effectivement la mémoire comme une extension de son contexte de travail. Cela permet à Claude de :

- Continuer les flux de travail complexes et multi-étapes sans perdre d'informations critiques
- Référencer les travaux et décisions passés même après la suppression des résultats d'outil
- Maintenir un contexte cohérent entre les conversations qui dépasseraient les limites de contexte typiques
- Construire une base de connaissances au fil du temps tout en gardant la fenêtre de contexte active gérable

### Exemple de flux de travail

Considérez un projet de refactorisation de code avec de nombreuses opérations de fichiers :

1. Claude effectue de nombreuses modifications de fichiers, générant de nombreux résultats d'outil
2. À mesure que le contexte augmente et approche de votre seuil, Claude reçoit un avertissement
3. Claude résume les modifications effectuées jusqu'à présent dans un fichier de mémoire (par exemple, `/memories/refactoring_progress.xml`)
4. L'édition de contexte efface automatiquement les résultats d'outil plus anciens
5. Claude continue à travailler, en référençant le fichier de mémoire lorsqu'il doit se rappeler quelles modifications ont déjà été effectuées
6. Le flux de travail peut continuer indéfiniment, Claude gérant à la fois le contexte actif et la mémoire persistante

### Configuration

Pour utiliser les deux fonctionnalités ensemble :

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[...],
    tools=[
        {
            "type": "memory_20250818",
            "name": "memory"
        },
        # Your other tools
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {
                    "type": "input_tokens",
                    "value": 100000
                },
                "keep": {
                    "type": "tool_uses",
                    "value": 3
                }
            }
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [...],
  tools: [
    {
      type: "memory_20250818",
      name: "memory"
    },
    // Your other tools
  ],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: 100000
        },
        keep: {
          type: "tool_uses",
          value: 3
        }
      }
    ]
  }
});
```

</CodeGroup>

Vous pouvez également exclure les appels d'outil de mémoire d'être effacés pour vous assurer que Claude a toujours accès aux opérations de mémoire récentes :

<CodeGroup>

```python Python
context_management={
    "edits": [
        {
            "type": "clear_tool_uses_20250919",
            "exclude_tools": ["memory"]
        }
    ]
}
```

```typescript TypeScript
context_management: {
  edits: [
    {
      type: "clear_tool_uses_20250919",
      exclude_tools: ["memory"]
    }
  ]
}
```

</CodeGroup>