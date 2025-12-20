# Outil d'éditeur de texte

Claude peut utiliser un outil d'éditeur de texte défini par Anthropic pour afficher et modifier des fichiers texte, vous aidant à déboguer, corriger et améliorer votre code ou d'autres documents texte.

---

Claude peut utiliser un outil d'éditeur de texte défini par Anthropic pour afficher et modifier des fichiers texte, vous aidant à déboguer, corriger et améliorer votre code ou d'autres documents texte. Cela permet à Claude d'interagir directement avec vos fichiers, en fournissant une assistance pratique plutôt que de simplement suggérer des modifications.

## Compatibilité des modèles

| Modèle | Version de l'outil |
|-------|--------------|
| Modèles Claude 4.x | `text_editor_20250728` |
| Claude Sonnet 3.7 ([obsolète](/docs/fr/about-claude/model-deprecations)) | `text_editor_20250124` |

<Warning>
L'outil `text_editor_20250728` pour les modèles Claude 4 n'inclut pas la commande `undo_edit`. Si vous avez besoin de cette fonctionnalité, vous devrez utiliser Claude Sonnet 3.7 ([obsolète](/docs/fr/about-claude/model-deprecations)).
</Warning>

<Warning>
Les versions antérieures de l'outil ne sont pas garanties d'être rétro-compatibles avec les modèles plus récents. Utilisez toujours la version de l'outil qui correspond à votre version de modèle.
</Warning>

## Quand utiliser l'outil d'éditeur de texte

Voici quelques exemples de cas d'utilisation de l'outil d'éditeur de texte :
- **Débogage de code** : Demandez à Claude d'identifier et de corriger les bogues dans votre code, des erreurs de syntaxe aux problèmes de logique.
- **Refactorisation de code** : Laissez Claude améliorer la structure, la lisibilité et les performances de votre code grâce à des modifications ciblées.
- **Génération de documentation** : Demandez à Claude d'ajouter des docstrings, des commentaires ou des fichiers README à votre base de code.
- **Création de tests** : Demandez à Claude de créer des tests unitaires pour votre code en fonction de sa compréhension de l'implémentation.

## Utiliser l'outil d'éditeur de texte

<Tabs>
<Tab title="Claude 4">
Fournissez l'outil d'éditeur de texte (nommé `str_replace_based_edit_tool`) à Claude en utilisant l'API Messages.

Vous pouvez éventuellement spécifier un paramètre `max_characters` pour contrôler la troncature lors de la visualisation de fichiers volumineux.

<Note>
`max_characters` est compatible uniquement avec `text_editor_20250728` et les versions ultérieures de l'outil d'éditeur de texte.
</Note>

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "tools": [
      {
        "type": "text_editor_20250728",
        "name": "str_replace_based_edit_tool",
        "max_characters": 10000
      }
    ],
    "messages": [
      {
        "role": "user",
        "content": "There'\''s a syntax error in my primes.py file. Can you help me fix it?"
      }
    ]
  }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[
        {
            "type": "text_editor_20250728",
            "name": "str_replace_based_edit_tool",
            "max_characters": 10000
        }
    ],
    messages=[
        {
            "role": "user", 
            "content": "There's a syntax error in my primes.py file. Can you help me fix it?"
        }
    ]
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const response = await anthropic.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: [
    {
      type: "text_editor_20250728",
      name: "str_replace_based_edit_tool",
      max_characters: 10000
    }
  ],
  messages: [
    {
      role: "user",
      content: "There's a syntax error in my primes.py file. Can you help me fix it?"
    }
  ]
});
```

```java Java
import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.ToolStrReplaceBasedEditTool20250728;

public class TextEditorToolExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        ToolStrReplaceBasedEditTool20250728 editorTool = ToolStrReplaceBasedEditTool20250728.builder()
                .build();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_SONNET_4_0)
                .maxTokens(1024)
                .addTool(editorTool)
                .addUserMessage("There's a syntax error in my primes.py file. Can you help me fix it?")
                .build();

        Message message = client.messages().create(params);
    }
}
```
</CodeGroup>
</Tab>
<Tab title="Claude Sonnet 3.7">
Fournissez l'outil d'éditeur de texte (nommé `str_replace_editor`) à Claude en utilisant l'API Messages :
<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-3-7-sonnet-20250219",
    "max_tokens": 1024,
    "tools": [
      {
        "type": "text_editor_20250124",
        "name": "str_replace_editor"
      }
    ],
    "messages": [
      {
        "role": "user",
        "content": "There'\''s a syntax error in my primes.py file. Can you help me fix it?"
      }
    ]
  }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-3-7-sonnet-20250219",
    max_tokens=1024,
    tools=[
        {
            "type": "text_editor_20250124",
            "name": "str_replace_editor"
        }
    ],
    messages=[
        {
            "role": "user", 
            "content": "There's a syntax error in my primes.py file. Can you help me fix it?"
        }
    ]
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const response = await anthropic.messages.create({
  model: "claude-3-7-sonnet-20250219",
  max_tokens: 1024,
  tools: [
    {
      type: "text_editor_20250124",
      name: "str_replace_editor"
    }
  ],
  messages: [
    {
      role: "user",
      content: "There's a syntax error in my primes.py file. Can you help me fix it?"
    }
  ]
});
```

```java Java
import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.ToolTextEditor20250124;

public class TextEditorToolExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        ToolTextEditor20250124 editorTool = ToolTextEditor20250124.builder()
                .build();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_3_7_SONNET_LATEST)
                .maxTokens(1024)
                .addTool(editorTool)
                .addUserMessage("There's a syntax error in my primes.py file. Can you help me fix it?")
                .build();

        Message message = client.messages().create(params);
    }
}
```
</CodeGroup>
</Tab>
</Tabs>

L'outil d'éditeur de texte peut être utilisé de la manière suivante :

<Steps>
  <Step title="Fournissez à Claude l'outil d'éditeur de texte et une invite utilisateur">
    - Incluez l'outil d'éditeur de texte dans votre demande d'API
    - Fournissez une invite utilisateur qui peut nécessiter d'examiner ou de modifier des fichiers, comme « Pouvez-vous corriger l'erreur de syntaxe dans mon code ? »
  </Step>
  <Step title="Claude utilise l'outil pour examiner les fichiers ou répertoires">
    - Claude évalue ce qu'il doit examiner et utilise la commande `view` pour examiner le contenu des fichiers ou lister le contenu des répertoires
    - La réponse de l'API contiendra un bloc de contenu `tool_use` avec la commande `view`
  </Step>
  <Step title="Exécutez la commande view et retournez les résultats">
    - Extrayez le chemin du fichier ou du répertoire de la demande d'utilisation d'outil de Claude
    - Lisez le contenu du fichier ou listez le contenu du répertoire
    - Si un paramètre `max_characters` a été spécifié dans la configuration de l'outil, tronquez le contenu du fichier à cette longueur
    - Retournez les résultats à Claude en continuant la conversation avec un nouveau message `user` contenant un bloc de contenu `tool_result`
  </Step>
  <Step title="Claude utilise l'outil pour modifier les fichiers">
    - Après avoir examiné le fichier ou le répertoire, Claude peut utiliser une commande telle que `str_replace` pour effectuer des modifications ou `insert` pour ajouter du texte à un numéro de ligne spécifique.
    - Si Claude utilise la commande `str_replace`, Claude construit une demande d'utilisation d'outil correctement formatée avec l'ancien texte et le nouveau texte pour le remplacer
  </Step>
  <Step title="Exécutez la modification et retournez les résultats">
    - Extrayez le chemin du fichier, l'ancien texte et le nouveau texte de la demande d'utilisation d'outil de Claude
    - Effectuez le remplacement de texte dans le fichier
    - Retournez les résultats à Claude
  </Step>
  <Step title="Claude fournit son analyse et son explication">
    - Après avoir examiné et possiblement modifié les fichiers, Claude fournit une explication complète de ce qu'il a trouvé et des modifications qu'il a apportées
  </Step>
</Steps>

### Commandes de l'outil d'éditeur de texte

L'outil d'éditeur de texte prend en charge plusieurs commandes pour afficher et modifier des fichiers :

#### view

La commande `view` permet à Claude d'examiner le contenu d'un fichier ou de lister le contenu d'un répertoire. Elle peut lire l'intégralité du fichier ou une plage spécifique de lignes.

Paramètres :
- `command` : Doit être « view »
- `path` : Le chemin du fichier ou du répertoire à afficher
- `view_range` (optionnel) : Un tableau de deux entiers spécifiant les numéros de ligne de début et de fin à afficher. Les numéros de ligne sont indexés à partir de 1, et -1 pour la ligne de fin signifie lire jusqu'à la fin du fichier. Ce paramètre s'applique uniquement lors de l'affichage de fichiers, pas de répertoires.

<section title="Exemples de commandes view">

```json
// Exemple pour afficher un fichier
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "str_replace_editor",
  "input": {
    "command": "view",
    "path": "primes.py"
  }
}

// Exemple pour afficher un répertoire
{
  "type": "tool_use",
  "id": "toolu_02B19r91rw91mr917835mr9",
  "name": "str_replace_editor",
  "input": {
    "command": "view",
    "path": "src/"
  }
}
```

</section>

#### str_replace

La commande `str_replace` permet à Claude de remplacer une chaîne spécifique dans un fichier par une nouvelle chaîne. Ceci est utilisé pour effectuer des modifications précises.

Paramètres :
- `command` : Doit être « str_replace »
- `path` : Le chemin du fichier à modifier
- `old_str` : Le texte à remplacer (doit correspondre exactement, y compris les espaces et l'indentation)
- `new_str` : Le nouveau texte à insérer à la place de l'ancien texte

<section title="Exemple de commande str_replace">

```json
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "str_replace_editor",
  "input": {
    "command": "str_replace",
    "path": "primes.py",
    "old_str": "for num in range(2, limit + 1)",
    "new_str": "for num in range(2, limit + 1):"
  }
}
```

</section>

#### create

La commande `create` permet à Claude de créer un nouveau fichier avec le contenu spécifié.

Paramètres :
- `command` : Doit être « create »
- `path` : Le chemin où le nouveau fichier doit être créé
- `file_text` : Le contenu à écrire dans le nouveau fichier

<section title="Exemple de commande create">

```json
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "str_replace_editor",
  "input": {
    "command": "create",
    "path": "test_primes.py",
    "file_text": "import unittest\nimport primes\n\nclass TestPrimes(unittest.TestCase):\n    def test_is_prime(self):\n        self.assertTrue(primes.is_prime(2))\n        self.assertTrue(primes.is_prime(3))\n        self.assertFalse(primes.is_prime(4))\n\nif __name__ == '__main__':\n    unittest.main()"
  }
}
```

</section>

#### insert

La commande `insert` permet à Claude d'insérer du texte à un emplacement spécifique dans un fichier.

Paramètres :
- `command` : Doit être « insert »
- `path` : Le chemin du fichier à modifier
- `insert_line` : Le numéro de ligne après lequel insérer le texte (0 pour le début du fichier)
- `new_str` : Le texte à insérer

<section title="Exemple de commande insert">

```json
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "str_replace_editor",
  "input": {
    "command": "insert",
    "path": "primes.py",
    "insert_line": 0,
    "new_str": "\"\"\"Module for working with prime numbers.\n\nThis module provides functions to check if a number is prime\nand to generate a list of prime numbers up to a given limit.\n\"\"\"\n"
  }
}
```

</section>

#### undo_edit

La commande `undo_edit` permet à Claude d'annuler la dernière modification apportée à un fichier.

<Note>
Cette commande est disponible uniquement dans Claude Sonnet 3.7 ([obsolète](/docs/fr/about-claude/model-deprecations)). Elle n'est pas prise en charge dans les modèles Claude 4 utilisant le `text_editor_20250728`.
</Note>

Paramètres :
- `command` : Doit être « undo_edit »
- `path` : Le chemin du fichier dont la dernière modification doit être annulée

<section title="Exemple de commande undo_edit">

```json
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "str_replace_editor",
  "input": {
    "command": "undo_edit",
    "path": "primes.py"
  }
}
```

</section>

### Exemple : Correction d'une erreur de syntaxe avec l'outil d'éditeur de texte

<Tabs>
<Tab title="Claude 4">

Cet exemple montre comment les modèles Claude 4 utilisent l'outil d'éditeur de texte pour corriger une erreur de syntaxe dans un fichier Python.

Tout d'abord, votre application fournit à Claude l'outil d'éditeur de texte et une invite pour corriger une erreur de syntaxe :

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "tools": [
      {
        "type": "text_editor_20250728",
        "name": "str_replace_based_edit_tool"
      }
    ],
    "messages": [
      {
        "role": "user",
        "content": "There'\''s a syntax error in my primes.py file. Can you help me fix it?"
      }
    ]
  }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[
        {
            "type": "text_editor_20250728",
            "name": "str_replace_based_edit_tool"
        }
    ],
    messages=[
        {
            "role": "user", 
            "content": "There's a syntax error in my primes.py file. Can you help me fix it?"
        }
    ]
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const response = await anthropic.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: [
    {
      type: "text_editor_20250728",
      name: "str_replace_based_edit_tool"
    }
  ],
  messages: [
    {
      role: "user",
      content: "There's a syntax error in my primes.py file. Can you help me fix it?"
    }
  ]
});
```

```java Java
import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.ToolStrReplaceBasedEditTool20250728;

public class TextEditorToolExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        ToolStrReplaceBasedEditTool20250728 editorTool = ToolStrReplaceBasedEditTool20250728.builder()
                .build();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_SONNET_4_0)
                .maxTokens(1024)
                .addTool(editorTool)
                .addUserMessage("There's a syntax error in my primes.py file. Can you help me fix it?")
                .build();

        Message message = client.messages().create(params);
    }
}
```
</CodeGroup>

Claude utilisera d'abord l'outil d'éditeur de texte pour afficher le fichier :

```json
{
  "id": "msg_01XAbCDeFgHiJkLmNoPQrStU",
  "model": "claude-sonnet-4-5",
  "stop_reason": "tool_use",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "I'll help you fix the syntax error in your primes.py file. First, let me take a look at the file to identify the issue."
    },
    {
      "type": "tool_use",
      "id": "toolu_01AbCdEfGhIjKlMnOpQrStU",
      "name": "str_replace_based_edit_tool",
      "input": {
        "command": "view",
        "path": "primes.py"
      }
    }
  ]
}
```

Votre application doit ensuite lire le fichier et retourner son contenu à Claude :

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "tools": [
      {
        "type": "text_editor_20250728",
        "name": "str_replace_based_edit_tool"
      }
    ],
    "messages": [
      {
        "role": "user",
        "content": "There'\''s a syntax error in my primes.py file. Can you help me fix it?"
      },
      {
            "role": "assistant",
            "content": [
                {
                    "type": "text",
                    "text": "I'\''ll help you fix the syntax error in your primes.py file. First, let me take a look at the file to identify the issue."
                },
                {
                    "type": "tool_use",
                    "id": "toolu_01AbCdEfGhIjKlMnOpQrStU",
                    "name": "str_replace_based_edit_tool",
                    "input": {
                        "command": "view",
                        "path": "primes.py"
                    }
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "tool_result",
                    "tool_use_id": "toolu_01AbCdEfGhIjKlMnOpQrStU",
                    "content": "1: def is_prime(n):\n2:     \"\"\"Check if a number is prime.\"\"\"\n3:     if n <= 1:\n4:         return False\n5:     if n <= 3:\n6:         return True\n7:     if n % 2 == 0 or n % 3 == 0:\n8:         return False\n9:     i = 5\n10:     while i * i <= n:\n11:         if n % i == 0 or n % (i + 2) == 0:\n12:             return False\n13:         i += 6\n14:     return True\n15: \n16: def get_primes(limit):\n17:     \"\"\"Generate a list of prime numbers up to the given limit.\"\"\"\n18:     primes = []\n19:     for num in range(2, limit + 1)\n20:         if is_prime(num):\n21:             primes.append(num)\n22:     return primes\n23: \n24: def main():\n25:     \"\"\"Main function to demonstrate prime number generation.\"\"\"\n26:     limit = 100\n27:     prime_list = get_primes(limit)\n28:     print(f\"Prime numbers up to {limit}:\")\n29:     print(prime_list)\n30:     print(f\"Found {len(prime_list)} prime numbers.\")\n31: \n32: if __name__ == \"__main__\":\n33:     main()"
                }
            ]
        }
    ]
  }'
```

```python Python
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[
        {
            "type": "text_editor_20250728",
            "name": "str_replace_based_edit_tool"
        }
    ],
    messages=[
        {
            "role": "user", 
            "content": "There's a syntax error in my primes.py file. Can you help me fix it?"
        },
        {
            "role": "assistant",
            "content": [
                {
                    "type": "text",
                    "text": "I'll help you fix the syntax error in your primes.py file. First, let me take a look at the file to identify the issue."
                },
                {
                    "type": "tool_use",
                    "id": "toolu_01AbCdEfGhIjKlMnOpQrStU",
                    "name": "str_replace_based_edit_tool",
                    "input": {
                        "command": "view",
                        "path": "primes.py"
                    }
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "tool_result",
                    "tool_use_id": "toolu_01AbCdEfGhIjKlMnOpQrStU",
                    "content": "1: def is_prime(n):\n2:     \"\"\"Check if a number is prime.\"\"\"\n3:     if n <= 1:\n4:         return False\n5:     if n <= 3:\n6:         return True\n7:     if n % 2 == 0 or n % 3 == 0:\n8:         return False\n9:     i = 5\n10:     while i * i <= n:\n11:         if n % i == 0 or n % (i + 2) == 0:\n12:             return False\n13:         i += 6\n14:     return True\n15: \n16: def get_primes(limit):\n17:     \"\"\"Generate a list of prime numbers up to the given limit.\"\"\"\n18:     primes = []\n19:     for num in range(2, limit + 1)\n20:         if is_prime(num):\n21:             primes.append(num)\n22:     return primes\n23: \n24: def main():\n25:     \"\"\"Main function to demonstrate prime number generation.\"\"\"\n26:     limit = 100\n27:     prime_list = get_primes(limit)\n28:     print(f\"Prime numbers up to {limit}:\")\n29:     print(prime_list)\n30:     print(f\"Found {len(prime_list)} prime numbers.\")\n31: \n32: if __name__ == \"__main__\":\n33:     main()"
                }
            ]
        }
    ]
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const response = await anthropic.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: [
    {
      type: "text_editor_20250728",
      name: "str_replace_based_edit_tool"
    }
  ],
  messages: [
    {
      role: "user",
      content: "There's a syntax error in my primes.py file. Can you help me fix it?"
    },
    {
      role: "assistant",
      content: [
          {
              type: "text",
              text: "I'll help you fix the syntax error in your primes.py file. First, let me take a look at the file to identify the issue."
          },
          {
              type: "tool_use",
              id: "toolu_01AbCdEfGhIjKlMnOpQrStU",
              name: "str_replace_based_edit_tool",
              input: {
                  command: "view",
                  path: "primes.py"
              }
          }
      ]
    },
    {
      role: "user",
      content: [
          {
              type: "tool_result",
              tool_use_id: "toolu_01AbCdEfGhIjKlMnOpQrStU",
              content: "1: def is_prime(n):\n2:     \"\"\"Check if a number is prime.\"\"\"\n3:     if n <= 1:\n4:         return False\n5:     if n <= 3:\n6:         return True\n7:     if n % 2 == 0 or n % 3 == 0:\n8:         return False\n9:     i = 5\n10:     while i * i <= n:\n11:         if n % i == 0 or n % (i + 2) == 0:\n12:             return False\n13:         i += 6\n14:     return True\n15: \n16: def get_primes(limit):\n17:     \"\"\"Generate a list of prime numbers up to the given limit.\"\"\"\n18:     primes = []\n19:     for num in range(2, limit + 1)\n20:         if is_prime(num):\n21:             primes.append(num)\n22:     return primes\n23: \n24: def main():\n25:     \"\"\"Main function to demonstrate prime number generation.\"\"\"\n26:     limit = 100\n27:     prime_list = get_primes(limit)\n28:     print(f\"Prime numbers up to {limit}:\")\n29:     print(prime_list)\n30:     print(f\"Found {len(prime_list)} prime numbers.\")\n31: \n32: if __name__ == \"__main__\":\n33:     main()"
          }
      ]
    }
  ]
});
```

```java Java
import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.ToolStrReplaceBasedEditTool20250728;

public class TextEditorToolExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        ToolStrReplaceBasedEditTool20250728 editorTool = ToolStrReplaceBasedEditTool20250728.builder()
            .build();

        MessageCreateParams params = MessageCreateParams.builder()
            .model(Model.CLAUDE_SONNET_4_0)
            .maxTokens(1024)
            .addTool(editorTool)
            .addUserMessage("There's a syntax error in my primes.py file. Can you help me fix it?")
            .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>

<Tip>
**Numéros de ligne**

Dans l'exemple ci-dessus, le résultat de l'outil `view` inclut le contenu du fichier avec des numéros de ligne ajoutés au début de chaque ligne (par exemple, « 1: def is_prime(n): »). Les numéros de ligne ne sont pas obligatoires, mais ils sont essentiels pour utiliser avec succès le paramètre `view_range` pour examiner des sections spécifiques de fichiers et le paramètre `insert_line` pour ajouter du contenu à des emplacements précis.
</Tip>

Claude identifiera l'erreur de syntaxe et utilisera la commande `str_replace` pour la corriger :

```json
{
  "id": "msg_01VwXyZAbCdEfGhIjKlMnO",
  "model": "claude-sonnet-4-5",
  "stop_reason": "tool_use",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "I found the syntax error in your primes.py file. In the `get_primes` function, there is a missing colon (:) at the end of the for loop line. Let me fix that for you."
    },
    {
      "type": "tool_use",
      "id": "toolu_01PqRsTuVwXyZAbCdEfGh",
      "name": "str_replace_based_edit_tool",
      "input": {
        "command": "str_replace",
        "path": "primes.py",
        "old_str": "    for num in range(2, limit + 1)",
        "new_str": "    for num in range(2, limit + 1):"
      }
    }
  ]
}
```

Votre application doit ensuite effectuer la modification et retourner le résultat :

<CodeGroup>
```python Python
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[
        {
            "type": "text_editor_20250728",
            "name": "str_replace_based_edit_tool"
        }
    ],
    messages=[
        # Previous messages...
        {
            "role": "assistant",
            "content": [
                {
                    "type": "text",
                    "text": "I found the syntax error in your primes.py file. In the `get_primes` function, there is a missing colon (:) at the end of the for loop line. Let me fix that for you."
                },
                {
                    "type": "tool_use",
                    "id": "toolu_01PqRsTuVwXyZAbCdEfGh",
                    "name": "str_replace_based_edit_tool",
                    "input": {
                        "command": "str_replace",
                        "path": "primes.py",
                        "old_str": "    for num in range(2, limit + 1)",
                        "new_str": "    for num in range(2, limit + 1):"
                    }
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "tool_result",
                    "tool_use_id": "toolu_01PqRsTuVwXyZAbCdEfGh",
                    "content": "Successfully replaced text at exactly one location."
                }
            ]
        }
    ]
)
```

```typescript TypeScript
const response = await anthropic.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: [
    {
      type: "text_editor_20250728",
      name: "str_replace_based_edit_tool"
    }
  ],
  messages: [
    // Previous messages...
    {
      role: "assistant",
      content: [
        {
          type: "text",
          text: "I found the syntax error in your primes.py file. In the `get_primes` function, there is a missing colon (:) at the end of the for loop line. Let me fix that for you."
        },
        {
          type: "tool_use",
          id: "toolu_01PqRsTuVwXyZAbCdEfGh",
          name: "str_replace_based_edit_tool",
          input: {
            command: "str_replace",
            path: "primes.py",
            old_str: "    for num in range(2, limit + 1)",
            new_str: "    for num in range(2, limit + 1):"
          }
        }
      ]
    },
    {
      role: "user",
      content: [
        {
          type: "tool_result",
          tool_use_id: "toolu_01PqRsTuVwXyZAbCdEfGh",
          content: "Successfully replaced text at exactly one location."
        }
      ]
    }
  ]
});
```

```java Java
import java.util.List;
import java.util.Map;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.JsonValue;
import com.anthropic.models.messages.ContentBlockParam;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.MessageParam;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;
import com.anthropic.models.messages.ToolResultBlockParam;
import com.anthropic.models.messages.ToolStrReplaceBasedEditTool20250728;
import com.anthropic.models.messages.ToolUseBlockParam;

public class TextEditorConversationExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_SONNET_4_0)
                .maxTokens(1024)
                .addTool(ToolStrReplaceBasedEditTool20250728.builder()
                        .build())
                // Previous messages would go here
                .addAssistantMessageOfBlockParams(
                        List.of(
                                ContentBlockParam.ofText(TextBlockParam.builder()
                                        .text("I found the syntax error in your primes.py file. In the `get_primes` function, there is a missing colon (:) at the end of the for loop line. Let me fix that for you.")
                                        .build()),
                                ContentBlockParam.ofToolUse(ToolUseBlockParam.builder()
                                        .id("toolu_01PqRsTuVwXyZAbCdEfGh")
                                        .name("str_replace_based_edit_tool")
                                        .input(JsonValue.from(Map.of(
                                                "command", "str_replace",
                                                "path", "primes.py",
                                                "old_str", "    for num in range(2, limit + 1)",
                                                "new_str", "    for num in range(2, limit + 1):"
                                        )))
                                        .build()
                                )
                        )
                )
                .addUserMessageOfBlockParams(List.of(
                        ContentBlockParam.ofToolResult(ToolResultBlockParam.builder()
                                .toolUseId("toolu_01PqRsTuVwXyZAbCdEfGh")
                                .content("Successfully replaced text at exactly one location.")
                                .build()
                        )
                ))
                .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>

Enfin, Claude fournira une explication complète de la correction :

```json
{
  "id": "msg_01IjKlMnOpQrStUvWxYzAb",
  "model": "claude-sonnet-4-5",
  "stop_reason": "end_turn",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "I've fixed the syntax error in your primes.py file. The issue was in the `get_primes` function at line 19. There was a missing colon (:) at the end of the for loop line.\n\nHere's what I changed:\n\nFrom:\n```python\nfor num in range(2, limit + 1)\n```\n\nTo:\n```python\nfor num in range(2, limit + 1):\n```\n\nIn Python, a colon is required at the end of statements that start a new code block, such as for loops, if statements, function definitions, etc. Without the colon, Python raises a syntax error because it doesn't know where the code block begins.\n\nYour code should now run correctly. The function will properly generate a list of prime numbers up to the specified limit."
    }
  ]
}
```
</Tab>

<Tab title="Claude Sonnet 3.7">
Cet exemple montre comment Claude Sonnet 3.7 utilise l'outil d'éditeur de texte pour corriger une erreur de syntaxe dans un fichier Python.

Tout d'abord, votre application fournit à Claude l'outil d'éditeur de texte et une invite pour corriger une erreur de syntaxe :

```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-3-7-sonnet-20250219",
    max_tokens=1024,
    tools=[
        {
            "type": "text_editor_20250124",
            "name": "str_replace_editor"
        }
    ],
    messages=[
        {
            "role": "user", 
            "content": "There's a syntax error in my primes.py file. Can you help me fix it?"
        }
    ]
)

print(response)
```

<Note>
Les exemples Claude Sonnet 3.7 suivent le même format que les exemples Claude 4 ci-dessus, utilisant les mêmes appels d'outil et réponses mais avec le type d'outil `text_editor_20250124` et le nom `str_replace_editor`.
</Note>
</Tab>
</Tabs>

***

## Implémenter l'outil éditeur de texte

L'outil éditeur de texte est implémenté en tant qu'outil sans schéma. Lorsque vous utilisez cet outil, vous n'avez pas besoin de fournir un schéma d'entrée comme avec d'autres outils ; le schéma est intégré au modèle de Claude et ne peut pas être modifié.

Le type d'outil dépend de la version du modèle :
- **Claude 4** : `type: "text_editor_20250728"`
- **Claude Sonnet 3.7** : `type: "text_editor_20250124"`

<Steps>
  <Step title="Initialiser votre implémentation d'éditeur">
    Créez des fonctions d'aide pour gérer les opérations de fichiers comme la lecture, l'écriture et la modification de fichiers. Envisagez d'implémenter une fonctionnalité de sauvegarde pour récupérer les erreurs.
  </Step>
  <Step title="Gérer les appels d'outil d'éditeur">
    Créez une fonction qui traite les appels d'outil de Claude en fonction du type de commande :
    ```python
    def handle_editor_tool(tool_call, model_version):
        input_params = tool_call.input
        command = input_params.get('command', '')
        file_path = input_params.get('path', '')
        
        if command == 'view':
            # Read and return file contents
            pass
        elif command == 'str_replace':
            # Replace text in file
            pass
        elif command == 'create':
            # Create new file
            pass
        elif command == 'insert':
            # Insert text at location
            pass
        elif command == 'undo_edit':
            # Check if it's a Claude 4 model
            if 'str_replace_based_edit_tool' in model_version:
                return {"error": "undo_edit command is not supported in Claude 4"}
            # Restore from backup for Claude 3.7
            pass
    ```
  </Step>
  <Step title="Implémenter les mesures de sécurité">
    Ajoutez des vérifications de validation et de sécurité :
    - Validez les chemins de fichiers pour prévenir la traversée de répertoires
    - Créez des sauvegardes avant d'apporter des modifications
    - Gérez les erreurs avec élégance
    - Implémentez des vérifications de permissions
  </Step>
  <Step title="Traiter les réponses de Claude">
    Extrayez et gérez les appels d'outil des réponses de Claude :
    ```python
    # Process tool use in Claude's response
    for content in response.content:
        if content.type == "tool_use":
            # Execute the tool based on command
            result = handle_editor_tool(content)
            
            # Return result to Claude
            tool_result = {
                "type": "tool_result",
                "tool_use_id": content.id,
                "content": result
            }
    ```
  </Step>
</Steps>

<Warning>
Lors de l'implémentation de l'outil éditeur de texte, gardez à l'esprit :

1. **Sécurité** : L'outil a accès à votre système de fichiers local, donc implémentez des mesures de sécurité appropriées.
2. **Sauvegarde** : Créez toujours des sauvegardes avant d'autoriser les modifications de fichiers importants.
3. **Validation** : Validez toutes les entrées pour prévenir les modifications involontaires.
4. **Correspondance unique** : Assurez-vous que les remplacements correspondent exactement à un seul emplacement pour éviter les modifications involontaires.
</Warning>

### Gérer les erreurs

Lors de l'utilisation de l'outil éditeur de texte, diverses erreurs peuvent survenir. Voici des conseils sur la façon de les gérer :

<section title="Fichier non trouvé">

Si Claude essaie d'afficher ou de modifier un fichier qui n'existe pas, renvoyez un message d'erreur approprié dans le `tool_result` :

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Error: File not found",
      "is_error": true
    }
  ]
}
```

</section>

<section title="Correspondances multiples pour le remplacement">

Si la commande `str_replace` de Claude correspond à plusieurs emplacements dans le fichier, renvoyez un message d'erreur approprié :

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Error: Found 3 matches for replacement text. Please provide more context to make a unique match.",
      "is_error": true
    }
  ]
}
```

</section>

<section title="Aucune correspondance pour le remplacement">

Si la commande `str_replace` de Claude ne correspond à aucun texte du fichier, renvoyez un message d'erreur approprié :

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Error: No match found for replacement. Please check your text and try again.",
      "is_error": true
    }
  ]
}
```

</section>

<section title="Erreurs de permission">

S'il y a des problèmes de permission pour créer, lire ou modifier des fichiers, renvoyez un message d'erreur approprié :

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Error: Permission denied. Cannot write to file.",
      "is_error": true
    }
  ]
}
```

</section>

### Suivre les meilleures pratiques d'implémentation

<section title="Fournir un contexte clair">

Lorsque vous demandez à Claude de corriger ou de modifier du code, soyez précis sur les fichiers qui doivent être examinés ou les problèmes qui doivent être résolus. Un contexte clair aide Claude à identifier les bons fichiers et à apporter les modifications appropriées.

**Invite moins utile** : « Pouvez-vous corriger mon code ? »

**Meilleure invite** : « Il y a une erreur de syntaxe dans mon fichier primes.py qui l'empêche de s'exécuter. Pouvez-vous la corriger ? »

</section>

<section title="Être explicite sur les chemins de fichiers">

Spécifiez clairement les chemins de fichiers si nécessaire, surtout si vous travaillez avec plusieurs fichiers ou des fichiers dans différents répertoires.

**Invite moins utile** : « Examinez mon fichier d'aide »

**Meilleure invite** : « Pouvez-vous vérifier mon fichier utils/helpers.py pour tout problème de performance ? »

</section>

<section title="Créer des sauvegardes avant la modification">

Implémentez un système de sauvegarde dans votre application qui crée des copies de fichiers avant d'autoriser Claude à les modifier, en particulier pour le code important ou en production.

```python
def backup_file(file_path):
    """Create a backup of a file before editing."""
    backup_path = f"{file_path}.backup"
    if os.path.exists(file_path):
        with open(file_path, 'r') as src, open(backup_path, 'w') as dst:
            dst.write(src.read())
```

</section>

<section title="Gérer le remplacement de texte unique avec soin">

La commande `str_replace` nécessite une correspondance exacte du texte à remplacer. Votre application doit s'assurer qu'il y a exactement une correspondance pour l'ancien texte ou fournir des messages d'erreur appropriés.
```python
def safe_replace(file_path, old_text, new_text):
    """Replace text only if there's exactly one match."""
    with open(file_path, 'r') as f:
        content = f.read()
    
    count = content.count(old_text)
    if count == 0:
        return "Error: No match found"
    elif count > 1:
        return f"Error: Found {count} matches"
    else:
        new_content = content.replace(old_text, new_text)
        with open(file_path, 'w') as f:
            f.write(new_content)
        return "Successfully replaced text"
```

</section>

<section title="Vérifier les modifications">

Après que Claude ait apporté des modifications à un fichier, vérifiez les modifications en exécutant des tests ou en vérifiant que le code fonctionne toujours comme prévu.
```python
def verify_changes(file_path):
    """Run tests or checks after making changes."""
    try:
        # For Python files, check for syntax errors
        if file_path.endswith('.py'):
            import ast
            with open(file_path, 'r') as f:
                ast.parse(f.read())
            return "Syntax check passed"
    except Exception as e:
        return f"Verification failed: {str(e)}"
```

</section>

---

## Tarification et utilisation des jetons

The text editor tool uses the same pricing structure as other tools used with Claude. It follows the standard input and output token pricing based on the Claude model you're using.

In addition to the base tokens, the following additional input tokens are needed for the text editor tool:

| Tool | Additional input tokens |
| ----------------------------------------- | --------------------------------------- |
| `text_editor_20250429` (Claude 4.x) | 700 tokens |
| `text_editor_20250124` (Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations))) | 700 tokens |

Pour plus d'informations détaillées sur la tarification des outils, consultez [Tarification de l'utilisation des outils](/docs/fr/agents-and-tools/tool-use/overview#pricing).

## Intégrer l'outil éditeur de texte avec d'autres outils

L'outil éditeur de texte peut être utilisé aux côtés d'autres outils Claude. Lors de la combinaison d'outils, assurez-vous que :
- La version de l'outil correspond au modèle que vous utilisez
- Vous tenez compte de l'utilisation supplémentaire de jetons pour tous les outils inclus dans votre demande

## Journal des modifications

| Date | Version | Modifications |
| ---- | ------- | ------- |
| 28 juillet 2025 | `text_editor_20250728` | Publication d'un outil éditeur de texte mis à jour qui corrige certains problèmes et ajoute un paramètre `max_characters` optionnel. Il est par ailleurs identique à `text_editor_20250429`. |
| 29 avril 2025 | `text_editor_20250429` | Publication de l'outil éditeur de texte pour Claude 4. Cette version supprime la commande `undo_edit` mais maintient toutes les autres capacités. Le nom de l'outil a été mis à jour pour refléter son architecture basée sur str_replace. |
| 13 mars 2025 | `text_editor_20250124` | Introduction de la documentation autonome de l'outil éditeur de texte. Cette version est optimisée pour Claude Sonnet 3.7 mais a des capacités identiques à la version précédente. |
| 22 octobre 2024 | `text_editor_20241022` | Publication initiale de l'outil éditeur de texte avec Claude Sonnet 3.5 ([retiré](/docs/fr/about-claude/model-deprecations)). Fournit des capacités pour afficher, créer et modifier des fichiers via les commandes `view`, `create`, `str_replace`, `insert` et `undo_edit`. |

## Prochaines étapes

Voici quelques idées sur la façon d'utiliser l'outil éditeur de texte de manière plus pratique et puissante :

- **Intégrer à votre flux de travail de développement** : Intégrez l'outil éditeur de texte dans vos outils de développement ou votre IDE
- **Créer un système d'examen du code** : Demandez à Claude d'examiner votre code et d'apporter des améliorations
- **Créer un assistant de débogage** : Créez un système où Claude peut vous aider à diagnostiquer et corriger les problèmes de votre code
- **Implémenter la conversion de format de fichier** : Laissez Claude vous aider à convertir des fichiers d'un format à un autre
- **Automatiser la documentation** : Configurez des flux de travail pour que Claude documente automatiquement votre code

À mesure que vous créez des applications avec l'outil éditeur de texte, nous sommes impatients de voir comment vous exploitez les capacités de Claude pour améliorer votre flux de travail de développement et votre productivité.

<CardGroup cols={3}>
  <Card
    title="Aperçu de l'utilisation des outils"
    icon="wrench"
    href="/docs/fr/agents-and-tools/tool-use/overview"
  >
    Découvrez comment implémenter des flux de travail d'outils pour une utilisation avec Claude.
  </Card>

  <Card
    title="Outil Bash"
    icon="terminal"
    href="/docs/fr/agents-and-tools/tool-use/bash-tool"
  >
    Exécutez des commandes shell avec Claude.
  </Card>
</CardGroup>