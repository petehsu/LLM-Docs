# Sorties structurées

Obtenir des résultats JSON validés à partir de flux de travail d'agents

---

Les sorties structurées contraignent les réponses de Claude à suivre un schéma spécifique, garantissant une sortie valide et analysable pour le traitement en aval. Deux fonctionnalités complémentaires sont disponibles :

- **Sorties JSON** (`output_format`) : Obtenir la réponse de Claude dans un format JSON spécifique
- **Utilisation stricte des outils** (`strict: true`) : Garantir la validation du schéma sur les noms et entrées des outils

Ces fonctionnalités peuvent être utilisées indépendamment ou ensemble dans la même requête.

<Note>
Les sorties structurées sont actuellement disponibles en tant que fonctionnalité bêta publique dans l'API Claude pour Claude Sonnet 4.5, Claude Opus 4.1, Claude Opus 4.5 et Claude Haiku 4.5.

Pour utiliser la fonctionnalité, définissez l'[en-tête bêta](/docs/fr/api/beta-headers) `structured-outputs-2025-11-13`.
</Note>

<Tip>
Partagez vos commentaires en utilisant ce [formulaire](https://forms.gle/BFnYc6iCkWoRzFgk7).
</Tip>

## Pourquoi utiliser les sorties structurées

Sans sorties structurées, Claude peut générer des réponses JSON mal formées ou des entrées d'outils invalides qui cassent vos applications. Même avec un invite soigneux, vous pouvez rencontrer :
- Des erreurs d'analyse dues à une syntaxe JSON invalide
- Des champs obligatoires manquants
- Des types de données incohérents
- Des violations de schéma nécessitant une gestion des erreurs et des tentatives

Les sorties structurées garantissent des réponses conformes au schéma grâce au décodage contraint :
- **Toujours valide** : Plus d'erreurs `JSON.parse()`
- **Type sûr** : Types de champs garantis et champs obligatoires
- **Fiable** : Aucune tentative nécessaire pour les violations de schéma

## Sorties JSON

Les sorties JSON contrôlent le format de réponse de Claude, garantissant que Claude retourne un JSON valide correspondant à votre schéma. Utilisez les sorties JSON quand vous avez besoin de :

- Contrôler le format de réponse de Claude
- Extraire des données à partir d'images ou de texte
- Générer des rapports structurés
- Formater les réponses API

### Démarrage rapide

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: structured-outputs-2025-11-13" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {
        "role": "user",
        "content": "Extract the key information from this email: John Smith (john@example.com) is interested in our Enterprise plan and wants to schedule a demo for next Tuesday at 2pm."
      }
    ],
    "output_format": {
      "type": "json_schema",
      "schema": {
        "type": "object",
        "properties": {
          "name": {"type": "string"},
          "email": {"type": "string"},
          "plan_interest": {"type": "string"},
          "demo_requested": {"type": "boolean"}
        },
        "required": ["name", "email", "plan_interest", "demo_requested"],
        "additionalProperties": false
      }
    }
  }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    betas=["structured-outputs-2025-11-13"],
    messages=[
        {
            "role": "user",
            "content": "Extract the key information from this email: John Smith (john@example.com) is interested in our Enterprise plan and wants to schedule a demo for next Tuesday at 2pm."
        }
    ],
    output_format={
        "type": "json_schema",
        "schema": {
            "type": "object",
            "properties": {
                "name": {"type": "string"},
                "email": {"type": "string"},
                "plan_interest": {"type": "string"},
                "demo_requested": {"type": "boolean"}
            },
            "required": ["name", "email", "plan_interest", "demo_requested"],
            "additionalProperties": False
        }
    }
)
print(response.content[0].text)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const response = await client.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  betas: ["structured-outputs-2025-11-13"],
  messages: [
    {
      role: "user",
      content: "Extract the key information from this email: John Smith (john@example.com) is interested in our Enterprise plan and wants to schedule a demo for next Tuesday at 2pm."
    }
  ],
  output_format: {
    type: "json_schema",
    schema: {
      type: "object",
      properties: {
        name: { type: "string" },
        email: { type: "string" },
        plan_interest: { type: "string" },
        demo_requested: { type: "boolean" }
      },
      required: ["name", "email", "plan_interest", "demo_requested"],
      additionalProperties: false
    }
  }
});
console.log(response.content[0].text);
```

</CodeGroup>

**Format de réponse :** JSON valide correspondant à votre schéma dans `response.content[0].text`

```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "plan_interest": "Enterprise",
  "demo_requested": true
}
```

### Comment cela fonctionne

<Steps>
  <Step title="Définir votre schéma JSON">
    Créez un schéma JSON qui décrit la structure que vous voulez que Claude suive. Le schéma utilise le format JSON Schema standard avec certaines limitations (voir [Limitations du schéma JSON](#limitations-du-schéma-json)).
  </Step>
  <Step title="Ajouter le paramètre output_format">
    Incluez le paramètre `output_format` dans votre requête API avec `type: "json_schema"` et votre définition de schéma.
  </Step>
  <Step title="Inclure l'en-tête bêta">
    Ajoutez l'en-tête `anthropic-beta: structured-outputs-2025-11-13` à votre requête.
  </Step>
  <Step title="Analyser la réponse">
    La réponse de Claude sera un JSON valide correspondant à votre schéma, retourné dans `response.content[0].text`.
  </Step>
</Steps>

### Travailler avec les sorties JSON dans les SDK

Les SDK Python et TypeScript fournissent des assistants qui facilitent le travail avec les sorties JSON, y compris la transformation de schéma, la validation automatique et l'intégration avec les bibliothèques de schéma populaires.

#### Utiliser Pydantic et Zod

Pour les développeurs Python et TypeScript, vous pouvez utiliser des outils familiers de définition de schéma comme Pydantic et Zod au lieu d'écrire des schémas JSON bruts.

<CodeGroup>

```python Python
from pydantic import BaseModel
from anthropic import Anthropic, transform_schema

class ContactInfo(BaseModel):
    name: str
    email: str
    plan_interest: str
    demo_requested: bool

client = Anthropic()

# With .create() - requires transform_schema()
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    betas=["structured-outputs-2025-11-13"],
    messages=[
        {
            "role": "user",
            "content": "Extract the key information from this email: John Smith (john@example.com) is interested in our Enterprise plan and wants to schedule a demo for next Tuesday at 2pm."
        }
    ],
    output_format={
        "type": "json_schema",
        "schema": transform_schema(ContactInfo),
    }
)

print(response.content[0].text)

# With .parse() - can pass Pydantic model directly
response = client.beta.messages.parse(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    betas=["structured-outputs-2025-11-13"],
    messages=[
        {
            "role": "user",
            "content": "Extract the key information from this email: John Smith (john@example.com) is interested in our Enterprise plan and wants to schedule a demo for next Tuesday at 2pm."
        }
    ],
    output_format=ContactInfo,
)

print(response.parsed_output)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod';

const ContactInfoSchema = z.object({
  name: z.string(),
  email: z.string(),
  plan_interest: z.string(),
  demo_requested: z.boolean(),
});

const client = new Anthropic();

const response = await client.beta.messages.parse({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  betas: ["structured-outputs-2025-11-13"],
  messages: [
    {
      role: "user",
      content: "Extract the key information from this email: John Smith (john@example.com) is interested in our Enterprise plan and wants to schedule a demo for next Tuesday at 2pm."
    }
  ],
  output_format: betaZodOutputFormat(ContactInfoSchema),
});

// Automatically parsed and validated
console.log(response.parsed_output);
```

</CodeGroup>

#### Méthodes spécifiques au SDK

**Python : `client.beta.messages.parse()` (Recommandé)**

La méthode `parse()` transforme automatiquement votre modèle Pydantic, valide la réponse et retourne un attribut `parsed_output`.

<Note>
La méthode `parse()` est disponible sur `client.beta.messages`, pas sur `client.messages`.
</Note>

<section title="Exemple d'utilisation">

```python
from pydantic import BaseModel
import anthropic

class ContactInfo(BaseModel):
    name: str
    email: str
    plan_interest: str

client = anthropic.Anthropic()

response = client.beta.messages.parse(
    model="claude-sonnet-4-5",
    betas=["structured-outputs-2025-11-13"],
    max_tokens=1024,
    messages=[{"role": "user", "content": "..."}],
    output_format=ContactInfo,
)

# Access the parsed output directly
contact = response.parsed_output
print(contact.name, contact.email)
```

</section>

**Python : Assistant `transform_schema()`**

Pour quand vous avez besoin de transformer manuellement les schémas avant d'envoyer, ou quand vous voulez modifier un schéma généré par Pydantic. Contrairement à `client.beta.messages.parse()`, qui transforme les schémas fournis automatiquement, cela vous donne le schéma transformé pour que vous puissiez le personnaliser davantage.

<section title="Exemple d'utilisation">

```python
from anthropic import transform_schema
from pydantic import TypeAdapter

# First convert Pydantic model to JSON schema, then transform
schema = TypeAdapter(ContactInfo).json_schema()
schema = transform_schema(schema)
# Modify schema if needed
schema["properties"]["custom_field"] = {"type": "string"}

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["structured-outputs-2025-11-13"],
    max_tokens=1024,
    output_format=schema,
    messages=[{"role": "user", "content": "..."}],
)
```

</section>

#### Comment fonctionne la transformation du SDK

Les SDK Python et TypeScript transforment automatiquement les schémas avec des fonctionnalités non supportées :

1. **Supprimer les contraintes non supportées** (par exemple, `minimum`, `maximum`, `minLength`, `maxLength`)
2. **Mettre à jour les descriptions** avec les informations de contrainte (par exemple, « Doit être au moins 100 »), quand la contrainte n'est pas directement supportée avec les sorties structurées
3. **Ajouter `additionalProperties: false`** à tous les objets
4. **Filtrer les formats de chaîne** à la liste supportée uniquement
5. **Valider les réponses** par rapport à votre schéma original (avec toutes les contraintes)

Cela signifie que Claude reçoit un schéma simplifié, mais votre code applique toujours toutes les contraintes grâce à la validation.

**Exemple :** Un champ Pydantic avec `minimum: 100` devient un entier simple dans le schéma envoyé, mais la description est mise à jour à « Doit être au moins 100 », et le SDK valide la réponse par rapport à la contrainte d'origine.

### Cas d'utilisation courants

<section title="Extraction de données">

Extraire des données structurées à partir de texte non structuré :

<CodeGroup>

```python Python
from pydantic import BaseModel
from typing import List

class Invoice(BaseModel):
    invoice_number: str
    date: str
    total_amount: float
    line_items: List[dict]
    customer_name: str

response = client.beta.messages.parse(
    model="claude-sonnet-4-5",
    betas=["structured-outputs-2025-11-13"],
    output_format=Invoice,
    messages=[{"role": "user", "content": f"Extract invoice data from: {invoice_text}"}]
)
```

```typescript TypeScript
import { z } from 'zod';

const InvoiceSchema = z.object({
  invoice_number: z.string(),
  date: z.string(),
  total_amount: z.number(),
  line_items: z.array(z.record(z.any())),
  customer_name: z.string(),
});

const response = await client.beta.messages.parse({
  model: "claude-sonnet-4-5",
  betas: ["structured-outputs-2025-11-13"],
  output_format: InvoiceSchema,
  messages: [{"role": "user", "content": `Extract invoice data from: ${invoiceText}`}]
});
```

</CodeGroup>

</section>

<section title="Classification">

Classer le contenu avec des catégories structurées :

<CodeGroup>

```python Python
from pydantic import BaseModel
from typing import List

class Classification(BaseModel):
    category: str
    confidence: float
    tags: List[str]
    sentiment: str

response = client.beta.messages.parse(
    model="claude-sonnet-4-5",
    betas=["structured-outputs-2025-11-13"],
    output_format=Classification,
    messages=[{"role": "user", "content": f"Classify this feedback: {feedback_text}"}]
)
```

```typescript TypeScript
import { z } from 'zod';

const ClassificationSchema = z.object({
  category: z.string(),
  confidence: z.number(),
  tags: z.array(z.string()),
  sentiment: z.string(),
});

const response = await client.beta.messages.parse({
  model: "claude-sonnet-4-5",
  betas: ["structured-outputs-2025-11-13"],
  output_format: ClassificationSchema,
  messages: [{"role": "user", "content": `Classify this feedback: ${feedbackText}`}]
});
```

</CodeGroup>

</section>

<section title="Formatage des réponses API">

Générer des réponses prêtes pour l'API :

<CodeGroup>

```python Python
from pydantic import BaseModel
from typing import List, Optional

class APIResponse(BaseModel):
    status: str
    data: dict
    errors: Optional[List[dict]]
    metadata: dict

response = client.beta.messages.parse(
    model="claude-sonnet-4-5",
    betas=["structured-outputs-2025-11-13"],
    output_format=APIResponse,
    messages=[{"role": "user", "content": "Process this request: ..."}]
)
```

```typescript TypeScript
import { z } from 'zod';

const APIResponseSchema = z.object({
  status: z.string(),
  data: z.record(z.any()),
  errors: z.array(z.record(z.any())).optional(),
  metadata: z.record(z.any()),
});

const response = await client.beta.messages.parse({
  model: "claude-sonnet-4-5",
  betas: ["structured-outputs-2025-11-13"],
  output_format: APIResponseSchema,
  messages: [{"role": "user", "content": "Process this request: ..."}]
});
```

</CodeGroup>

</section>

## Utilisation stricte des outils

L'utilisation stricte des outils valide les paramètres des outils, garantissant que Claude appelle vos fonctions avec des arguments correctement typés. Utilisez l'utilisation stricte des outils quand vous avez besoin de :

- Valider les paramètres des outils
- Construire des flux de travail d'agents
- Assurer des appels de fonction type-sûrs
- Gérer des outils complexes avec des propriétés imbriquées

### Pourquoi l'utilisation stricte des outils est importante pour les agents

La construction de systèmes d'agents fiables nécessite une conformité de schéma garantie. Sans le mode strict, Claude pourrait retourner des types incompatibles (`"2"` au lieu de `2`) ou des champs obligatoires manquants, cassant vos fonctions et causant des erreurs d'exécution.

L'utilisation stricte des outils garantit des paramètres type-sûrs :
- Les fonctions reçoivent des arguments correctement typés à chaque fois
- Pas besoin de valider et de réessayer les appels d'outils
- Les agents prêts pour la production qui fonctionnent de manière cohérente à grande échelle

Par exemple, supposons qu'un système de réservation ait besoin de `passengers: int`. Sans le mode strict, Claude pourrait fournir `passengers: "two"` ou `passengers: "2"`. Avec `strict: true`, la réponse contiendra toujours `passengers: 2`.

### Démarrage rapide

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: structured-outputs-2025-11-13" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "What is the weather in San Francisco?"}
    ],
    "tools": [{
      "name": "get_weather",
      "description": "Get the current weather in a given location",
      "strict": true,
      "input_schema": {
        "type": "object",
        "properties": {
          "location": {
            "type": "string",
            "description": "The city and state, e.g. San Francisco, CA"
          },
          "unit": {
            "type": "string",
            "enum": ["celsius", "fahrenheit"]
          }
        },
        "required": ["location"],
        "additionalProperties": false
      }
    }]
  }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    betas=["structured-outputs-2025-11-13"],
    messages=[
        {"role": "user", "content": "What's the weather like in San Francisco?"}
    ],
    tools=[
        {
            "name": "get_weather",
            "description": "Get the current weather in a given location",
            "strict": True,  # Enable strict mode
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "The city and state, e.g. San Francisco, CA"
                    },
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"],
                        "description": "The unit of temperature, either 'celsius' or 'fahrenheit'"
                    }
                },
                "required": ["location"],
                "additionalProperties": False
            }
        }
    ]
)
print(response.content)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const response = await client.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  betas: ["structured-outputs-2025-11-13"],
  messages: [
    {
      role: "user",
      content: "What's the weather like in San Francisco?"
    }
  ],
  tools: [{
    name: "get_weather",
    description: "Get the current weather in a given location",
    strict: true,  // Enable strict mode
    input_schema: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "The city and state, e.g. San Francisco, CA"
        },
        unit: {
          type: "string",
          enum: ["celsius", "fahrenheit"]
        }
      },
      required: ["location"],
      additionalProperties: false
    }
  }]
});
console.log(response.content);
```

</CodeGroup>

**Format de réponse :** Blocs d'utilisation d'outils avec entrées validées dans `response.content[x].input`

```json
{
  "type": "tool_use",
  "name": "get_weather",
  "input": {
    "location": "San Francisco, CA"
  }
}
```

**Garanties :**
- L'`input` de l'outil suit strictement l'`input_schema`
- Le `name` de l'outil est toujours valide (à partir des outils fournis ou des outils serveur)

### Comment cela fonctionne

<Steps>
  <Step title="Définir votre schéma d'outil">
    Créez un schéma JSON pour l'`input_schema` de votre outil. Le schéma utilise le format JSON Schema standard avec certaines limitations (voir [Limitations du schéma JSON](#limitations-du-schéma-json)).
  </Step>
  <Step title="Ajouter strict: true">
    Définissez `"strict": true` comme propriété de niveau supérieur dans votre définition d'outil, à côté de `name`, `description` et `input_schema`.
  </Step>
  <Step title="Inclure l'en-tête bêta">
    Ajoutez l'en-tête `anthropic-beta: structured-outputs-2025-11-13` à votre requête.
  </Step>
  <Step title="Gérer les appels d'outils">
    Quand Claude utilise l'outil, le champ `input` dans le bloc tool_use suivra strictement votre `input_schema`, et le `name` sera toujours valide.
  </Step>
</Steps>

### Cas d'utilisation courants

<section title="Entrées d'outils validées">

Assurer que les paramètres d'outil correspondent exactement à votre schéma :

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["structured-outputs-2025-11-13"],
    messages=[{"role": "user", "content": "Search for flights to Tokyo"}],
    tools=[{
        "name": "search_flights",
        "strict": True,
        "input_schema": {
            "type": "object",
            "properties": {
                "destination": {"type": "string"},
                "departure_date": {"type": "string", "format": "date"},
                "passengers": {"type": "integer", "enum": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
            },
            "required": ["destination", "departure_date"],
            "additionalProperties": False
        }
    }]
)
```

```typescript TypeScript
const response = await client.beta.messages.create({
  model: "claude-sonnet-4-5",
  betas: ["structured-outputs-2025-11-13"],
  messages: [{"role": "user", "content": "Search for flights to Tokyo"}],
  tools: [{
    name: "search_flights",
    strict: true,
    input_schema: {
      type: "object",
      properties: {
        destination: {type: "string"},
        departure_date: {type: "string", format: "date"},
        passengers: {type: "integer", enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
      },
      required: ["destination", "departure_date"],
      additionalProperties: false
    }
  }]
});
```

</CodeGroup>

</section>

<section title="Flux de travail d'agent avec plusieurs outils validés">

Construire des agents multi-étapes fiables avec des paramètres d'outils garantis :

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["structured-outputs-2025-11-13"],
    messages=[{"role": "user", "content": "Help me plan a trip to Paris for 2 people"}],
    tools=[
        {
            "name": "search_flights",
            "strict": True,
            "input_schema": {
                "type": "object",
                "properties": {
                    "origin": {"type": "string"},
                    "destination": {"type": "string"},
                    "departure_date": {"type": "string", "format": "date"},
                    "travelers": {"type": "integer", "enum": [1, 2, 3, 4, 5, 6]}
                },
                "required": ["origin", "destination", "departure_date"],
                "additionalProperties": False
            }
        },
        {
            "name": "search_hotels",
            "strict": True,
            "input_schema": {
                "type": "object",
                "properties": {
                    "city": {"type": "string"},
                    "check_in": {"type": "string", "format": "date"},
                    "guests": {"type": "integer", "enum": [1, 2, 3, 4]}
                },
                "required": ["city", "check_in"],
                "additionalProperties": False
            }
        }
    ]
)
```

```typescript TypeScript
const response = await client.beta.messages.create({
  model: "claude-sonnet-4-5",
  betas: ["structured-outputs-2025-11-13"],
  messages: [{"role": "user", "content": "Help me plan a trip to Paris for 2 people"}],
  tools: [
    {
      name: "search_flights",
      strict: true,
      input_schema: {
        type: "object",
        properties: {
          origin: {type: "string"},
          destination: {type: "string"},
          departure_date: {type: "string", format: "date"},
          travelers: {type: "integer", enum: [1, 2, 3, 4, 5, 6]}
        },
        required: ["origin", "destination", "departure_date"],
        additionalProperties: false
      }
    },
    {
      name: "search_hotels",
      strict: true,
      input_schema: {
        type: "object",
        properties: {
          city: {type: "string"},
          check_in: {type: "string", format: "date"},
          guests: {type: "integer", enum: [1, 2, 3, 4]}
        },
        required: ["city", "check_in"],
        additionalProperties: false
      }
    }
  ]
});
```

</CodeGroup>

</section>

## Utiliser les deux fonctionnalités ensemble

Les sorties JSON et l'utilisation stricte des outils résolvent des problèmes différents et peuvent être utilisées ensemble :

- **Sorties JSON** contrôlent le format de réponse de Claude (ce que Claude dit)
- **Utilisation stricte des outils** valide les paramètres des outils (comment Claude appelle vos fonctions)

Combinées, Claude peut appeler des outils avec des paramètres garantis valides ET retourner des réponses JSON structurées. Ceci est utile pour les flux de travail d'agents où vous avez besoin à la fois d'appels d'outils fiables et de sorties finales structurées.

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["structured-outputs-2025-11-13"],
    max_tokens=1024,
    messages=[{"role": "user", "content": "Help me plan a trip to Paris for next month"}],
    # JSON outputs: structured response format
    output_format={
        "type": "json_schema",
        "schema": {
            "type": "object",
            "properties": {
                "summary": {"type": "string"},
                "next_steps": {"type": "array", "items": {"type": "string"}}
            },
            "required": ["summary", "next_steps"],
            "additionalProperties": False
        }
    },
    # Strict tool use: guaranteed tool parameters
    tools=[{
        "name": "search_flights",
        "strict": True,
        "input_schema": {
            "type": "object",
            "properties": {
                "destination": {"type": "string"},
                "date": {"type": "string", "format": "date"}
            },
            "required": ["destination", "date"],
            "additionalProperties": False
        }
    }]
)
```

```typescript TypeScript
const response = await client.beta.messages.create({
  model: "claude-sonnet-4-5",
  betas: ["structured-outputs-2025-11-13"],
  max_tokens: 1024,
  messages: [{ role: "user", content: "Help me plan a trip to Paris for next month" }],
  // JSON outputs: structured response format
  output_format: {
    type: "json_schema",
    schema: {
      type: "object",
      properties: {
        summary: { type: "string" },
        next_steps: { type: "array", items: { type: "string" } }
      },
      required: ["summary", "next_steps"],
      additionalProperties: false
    }
  },
  // Strict tool use: guaranteed tool parameters
  tools: [{
    name: "search_flights",
    strict: true,
    input_schema: {
      type: "object",
      properties: {
        destination: { type: "string" },
        date: { type: "string", format: "date" }
      },
      required: ["destination", "date"],
      additionalProperties: false
    }
  }]
});
```

</CodeGroup>

## Considérations importantes

### Compilation de grammaire et mise en cache

Les sorties structurées utilisent l'échantillonnage contraint avec des artefacts de grammaire compilés. Cela introduit certaines caractéristiques de performance à connaître :

- **Latence de la première requête** : La première fois que vous utilisez un schéma spécifique, il y aura une latence supplémentaire pendant que la grammaire est compilée
- **Mise en cache automatique** : Les grammaires compilées sont mises en cache pendant 24 heures à partir de la dernière utilisation, ce qui rend les requêtes suivantes beaucoup plus rapides
- **Invalidation du cache** : Le cache est invalidé si vous modifiez :
  - La structure du schéma JSON
  - L'ensemble des outils dans votre requête (lors de l'utilisation à la fois des sorties structurées et de l'utilisation d'outils)
  - Changer uniquement les champs `name` ou `description` n'invalide pas le cache

### Modification d'invite et coûts en jetons

Lors de l'utilisation de sorties structurées, Claude reçoit automatiquement une invite système supplémentaire expliquant le format de sortie attendu. Cela signifie :

- Votre nombre de jetons d'entrée sera légèrement plus élevé
- L'invite injectée vous coûte des jetons comme toute autre invite système
- Changer le paramètre `output_format` invalidera tout [cache d'invite](/docs/fr/build-with-claude/prompt-caching) pour ce fil de conversation

### Limitations du schéma JSON

Les sorties structurées supportent le schéma JSON standard avec certaines limitations. Les sorties JSON et l'utilisation stricte des outils partagent ces limitations.

<section title="Fonctionnalités supportées">

- Tous les types de base : object, array, string, integer, number, boolean, null
- `enum` (chaînes, nombres, booléens ou nulls uniquement - pas de types complexes)
- `const`
- `anyOf` et `allOf` (avec limitations - `allOf` avec `$ref` non supporté)
- `$ref`, `$def` et `definitions` (`$ref` externe non supporté)
- Propriété `default` pour tous les types supportés
- `required` et `additionalProperties` (doit être défini à `false` pour les objets)
- Formats de chaîne : `date-time`, `time`, `date`, `duration`, `email`, `hostname`, `uri`, `ipv4`, `ipv6`, `uuid`
- `minItems` de tableau (seules les valeurs 0 et 1 sont supportées)

</section>

<section title="Non supporté">

- Schémas récursifs
- Types complexes dans les énumérations
- `$ref` externe (par exemple, `'$ref': 'http://...'`)
- Contraintes numériques (`minimum`, `maximum`, `multipleOf`, etc.)
- Contraintes de chaîne (`minLength`, `maxLength`)
- Contraintes de tableau au-delà de `minItems` de 0 ou 1
- `additionalProperties` défini à autre chose que `false`

Si vous utilisez une fonctionnalité non supportée, vous recevrez une erreur 400 avec des détails.

</section>

<section title="Support des motifs (regex)">

**Fonctionnalités regex supportées :**
- Correspondance complète (`^...$`) et correspondance partielle
- Quantificateurs : `*`, `+`, `?`, cas simples `{n,m}`
- Classes de caractères : `[]`, `.`, `\d`, `\w`, `\s`
- Groupes : `(...)`

**NON supporté :**
- Références arrière aux groupes (par exemple, `\1`, `\2`)
- Assertions lookahead/lookbehind (par exemple, `(?=...)`, `(?!...)`)
- Limites de mots : `\b`, `\B`
- Quantificateurs `{n,m}` complexes avec grandes plages

Les motifs regex simples fonctionnent bien. Les motifs complexes peuvent entraîner des erreurs 400.

</section>

<Tip>
Les SDK Python et TypeScript peuvent transformer automatiquement les schémas avec des fonctionnalités non supportées en les supprimant et en ajoutant des contraintes aux descriptions de champs. Voir [Méthodes spécifiques au SDK](#méthodes-spécifiques-au-sdk) pour les détails.
</Tip>

### Sorties invalides

Bien que les sorties structurées garantissent la conformité au schéma dans la plupart des cas, il existe des scénarios où la sortie peut ne pas correspondre à votre schéma :

**Refus** (`stop_reason: "refusal"`)

Claude maintient ses propriétés de sécurité et d'utilité même lors de l'utilisation de sorties structurées. Si Claude refuse une requête pour des raisons de sécurité :

- La réponse aura `stop_reason: "refusal"`
- Vous recevrez un code de statut 200
- Vous serez facturé pour les jetons générés
- La sortie peut ne pas correspondre à votre schéma car le message de refus prend précédence sur les contraintes de schéma

**Limite de jetons atteinte** (`stop_reason: "max_tokens"`)

Si la réponse est coupée en raison du dépassement de la limite `max_tokens` :

- La réponse aura `stop_reason: "max_tokens"`
- La sortie peut être incomplète et ne pas correspondre à votre schéma
- Réessayez avec une valeur `max_tokens` plus élevée pour obtenir la sortie structurée complète

### Erreurs de validation de schéma

Si votre schéma utilise des fonctionnalités non supportées ou est trop complexe, vous recevrez une erreur 400 :

**« Trop de définitions récursives dans le schéma »**
- Cause : Le schéma a des définitions récursives excessives ou cycliques
- Solution : Simplifier la structure du schéma, réduire la profondeur d'imbrication

**« Le schéma est trop complexe »**
- Cause : Le schéma dépasse les limites de complexité
- Solution : Diviser en schémas plus petits, simplifier la structure ou réduire le nombre d'outils marqués comme `strict: true`

Pour les problèmes persistants avec des schémas valides, [contactez le support](https://support.claude.com/en/articles/9015913-how-to-get-support) avec votre définition de schéma.

## Compatibilité des fonctionnalités

**Fonctionne avec :**
- **[Traitement par lots](/docs/fr/build-with-claude/batch-processing)** : Traiter les sorties structurées à grande échelle avec une réduction de 50 %
- **[Comptage de jetons](/docs/fr/build-with-claude/token-counting)** : Compter les jetons sans compilation
- **[Streaming](/docs/fr/build-with-claude/streaming)** : Diffuser les sorties structurées comme les réponses normales
- **Utilisation combinée** : Utiliser les sorties JSON (`output_format`) et l'utilisation stricte des outils (`strict: true`) ensemble dans la même requête

**Incompatible avec :**
- **[Citations](/docs/fr/build-with-claude/citations)** : Les citations nécessitent d'entrelacer les blocs de citations avec du texte, ce qui entre en conflit avec les contraintes strictes du schéma JSON. Retourne une erreur 400 si les citations sont activées avec `output_format`.
- **[Préfillage de message](/docs/fr/build-with-claude/prompt-engineering/prefill-claudes-response)** : Incompatible avec les sorties JSON

<Tip>
**Portée de la grammaire** : Les grammaires s'appliquent uniquement à la sortie directe de Claude, pas aux appels d'utilisation d'outils, aux résultats d'outils ou aux balises de réflexion (lors de l'utilisation de [Réflexion étendue](/docs/fr/build-with-claude/extended-thinking)). L'état de la grammaire se réinitialise entre les sections, permettant à Claude de réfléchir librement tout en produisant une sortie structurée dans la réponse finale.
</Tip>