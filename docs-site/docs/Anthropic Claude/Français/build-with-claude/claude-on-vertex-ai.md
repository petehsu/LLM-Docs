# Claude sur Vertex AI

Les modèles Claude d'Anthropic sont désormais généralement disponibles via [Vertex AI](https://cloud.google.com/vertex-ai).

---

L'API Vertex pour accéder à Claude est presque identique à l'[API Messages](/docs/fr/api/messages) et prend en charge toutes les mêmes options, avec deux différences clés :

* Dans Vertex, `model` n'est pas transmis dans le corps de la requête. Au lieu de cela, il est spécifié dans l'URL du point de terminaison Google Cloud.
* Dans Vertex, `anthropic_version` est transmis dans le corps de la requête (plutôt que comme en-tête), et doit être défini sur la valeur `vertex-2023-10-16`.

Vertex est également pris en charge par les [SDK clients](/docs/fr/api/client-sdks) officiels d'Anthropic. Ce guide vous guidera tout au long du processus de création d'une requête à Claude sur Vertex AI en Python ou TypeScript.

Notez que ce guide suppose que vous disposez déjà d'un projet GCP capable d'utiliser Vertex AI. Consultez [utilisation des modèles Claude 3 d'Anthropic](https://cloud.google.com/vertex-ai/generative-ai/docs/partner-models/use-claude) pour plus d'informations sur la configuration requise, ainsi qu'une procédure pas à pas complète.

## Installer un SDK pour accéder à Vertex AI

Tout d'abord, installez le [SDK client](/docs/fr/api/client-sdks) d'Anthropic pour le langage de votre choix.

<CodeGroup>
  ```python Python
  pip install -U google-cloud-aiplatform "anthropic[vertex]"
  ```

  ```typescript TypeScript
  npm install @anthropic-ai/vertex-sdk
  ```
</CodeGroup>

## Accès à Vertex AI

### Disponibilité des modèles

Notez que la disponibilité des modèles Anthropic varie selon la région. Recherchez « Claude » dans le [Vertex AI Model Garden](https://cloud.google.com/model-garden) ou accédez à [Utiliser Claude 3](https://cloud.google.com/vertex-ai/generative-ai/docs/partner-models/use-claude) pour les dernières informations.

#### ID de modèle API

| Modèle                          | ID de modèle API Vertex AI |
| ------------------------------ | ------------------------ |
| Claude Sonnet 4.5              | claude-sonnet-4-5@20250929 |
| Claude Sonnet 4                | claude-sonnet-4@20250514 |
| Claude Sonnet 3.7 <Tooltip tooltipContent="Déprécié depuis le 28 octobre 2025.">⚠️</Tooltip> | claude-3-7-sonnet@20250219 |
| Claude Opus 4.5                | claude-opus-4-5@20251101 |
| Claude Opus 4.1                | claude-opus-4-1@20250805 |
| Claude Opus 4                  | claude-opus-4@20250514   |
| Claude Opus 3 <Tooltip tooltipContent="Déprécié depuis le 30 juin 2025.">⚠️</Tooltip> | claude-3-opus@20240229   |
| Claude Haiku 4.5               | claude-haiku-4-5@20251001 |
| Claude Haiku 3.5               | claude-3-5-haiku@20241022 |
| Claude Haiku 3                 | claude-3-haiku@20240307  |

### Effectuer des requêtes

Avant d'exécuter des requêtes, vous devrez peut-être exécuter `gcloud auth application-default login` pour vous authentifier auprès de GCP.

L'exemple suivant montre comment générer du texte à partir de Claude sur Vertex AI :
<CodeGroup>

  ```python Python
  from anthropic import AnthropicVertex

  project_id = "MY_PROJECT_ID"
  region = "global"

  client = AnthropicVertex(project_id=project_id, region=region)

  message = client.messages.create(
      model="claude-sonnet-4-5@20250929",
      max_tokens=100,
      messages=[
          {
              "role": "user",
              "content": "Hey Claude!",
          }
      ],
  )
  print(message)
  ```

  ```typescript TypeScript
  import { AnthropicVertex } from '@anthropic-ai/vertex-sdk';

  const projectId = 'MY_PROJECT_ID';
  const region = 'global';

  // Goes through the standard `google-auth-library` flow.
  const client = new AnthropicVertex({
    projectId,
    region,
  });

  async function main() {
    const result = await client.messages.create({
      model: 'claude-sonnet-4-5@20250929',
      max_tokens: 100,
      messages: [
        {
          role: 'user',
          content: 'Hey Claude!',
        },
      ],
    });
    console.log(JSON.stringify(result, null, 2));
  }

  main();
  ```

  ```bash Shell
  MODEL_ID=claude-sonnet-4-5@20250929
  LOCATION=global
  PROJECT_ID=MY_PROJECT_ID

  curl \
  -X POST \
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  -H "Content-Type: application/json" \
  https://$LOCATION-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/anthropic/models/${MODEL_ID}:streamRawPredict -d \
  '{
    "anthropic_version": "vertex-2023-10-16",
    "messages": [{
      "role": "user",
      "content": "Hey Claude!"
    }],
    "max_tokens": 100,
  }'
  ```
</CodeGroup>

Consultez nos [SDK clients](/docs/fr/api/client-sdks) et la [documentation officielle Vertex AI](https://cloud.google.com/vertex-ai/docs) pour plus de détails.

## Journalisation des activités

Vertex fournit un [service de journalisation des requêtes-réponses](https://cloud.google.com/vertex-ai/generative-ai/docs/multimodal/request-response-logging) qui permet aux clients de journaliser les invites et les complétions associées à votre utilisation.

Anthropic recommande que vous journalisiez votre activité sur au moins une base glissante de 30 jours afin de comprendre votre activité et d'enquêter sur tout abus potentiel.

<Note>
L'activation de ce service ne donne à Google ni à Anthropic aucun accès à votre contenu.
</Note>

## Support des fonctionnalités
Vous pouvez trouver toutes les fonctionnalités actuellement prises en charge sur Vertex [ici](/docs/fr/api/overview).

## Points de terminaison mondiaux par rapport aux points de terminaison régionaux

À partir de **Claude Sonnet 4.5 et tous les modèles futurs**, Google Vertex AI offre deux types de points de terminaison :

- **Points de terminaison mondiaux** : Routage dynamique pour une disponibilité maximale
- **Points de terminaison régionaux** : Routage des données garanti via des régions géographiques spécifiques

Les points de terminaison régionaux incluent une prime tarifaire de 10 % par rapport aux points de terminaison mondiaux.

<Note>
Ceci s'applique uniquement à Claude Sonnet 4.5 et aux modèles futurs. Les anciens modèles (Claude Sonnet 4, Opus 4 et antérieurs) conservent leurs structures tarifaires existantes.
</Note>

### Quand utiliser chaque option

**Points de terminaison mondiaux (recommandé) :**
- Fournissent une disponibilité et un temps de fonctionnement maximaux
- Acheminent dynamiquement les requêtes vers les régions disposant de capacité disponible
- Aucune prime tarifaire
- Idéal pour les applications où la résidence des données est flexible
- Prend en charge uniquement le trafic à l'usage (le débit provisionné nécessite des points de terminaison régionaux)

**Points de terminaison régionaux :**
- Acheminent le trafic via des régions géographiques spécifiques
- Requis pour les exigences de résidence des données et de conformité
- Prennent en charge le trafic à l'usage et le débit provisionné
- La prime tarifaire de 10 % reflète les coûts d'infrastructure pour la capacité régionale dédiée

### Implémentation

**Utilisation des points de terminaison mondiaux (recommandé) :**

Définissez le paramètre `region` sur `"global"` lors de l'initialisation du client :

<CodeGroup>
```python Python
from anthropic import AnthropicVertex

project_id = "MY_PROJECT_ID"
region = "global"

client = AnthropicVertex(project_id=project_id, region=region)

message = client.messages.create(
    model="claude-sonnet-4-5@20250929",
    max_tokens=100,
    messages=[
        {
            "role": "user",
            "content": "Hey Claude!",
        }
    ],
)
print(message)
```

```typescript TypeScript
import { AnthropicVertex } from '@anthropic-ai/vertex-sdk';

const projectId = 'MY_PROJECT_ID';
const region = 'global';

const client = new AnthropicVertex({
  projectId,
  region,
});

const result = await client.messages.create({
  model: 'claude-sonnet-4-5@20250929',
  max_tokens: 100,
  messages: [
    {
      role: 'user',
      content: 'Hey Claude!',
    },
  ],
});
```
</CodeGroup>

**Utilisation des points de terminaison régionaux :**

Spécifiez une région spécifique comme `"us-east1"` ou `"europe-west1"` :

<CodeGroup>
```python Python
from anthropic import AnthropicVertex

project_id = "MY_PROJECT_ID"
region = "us-east1"  # Specify a specific region

client = AnthropicVertex(project_id=project_id, region=region)

message = client.messages.create(
    model="claude-sonnet-4-5@20250929",
    max_tokens=100,
    messages=[
        {
            "role": "user",
            "content": "Hey Claude!",
        }
    ],
)
print(message)
```

```typescript TypeScript
import { AnthropicVertex } from '@anthropic-ai/vertex-sdk';

const projectId = 'MY_PROJECT_ID';
const region = 'us-east1';  // Specify a specific region

const client = new AnthropicVertex({
  projectId,
  region,
});

const result = await client.messages.create({
  model: 'claude-sonnet-4-5@20250929',
  max_tokens: 100,
  messages: [
    {
      role: 'user',
      content: 'Hey Claude!',
    },
  ],
});
```
</CodeGroup>

### Ressources supplémentaires

- **Tarification Google Vertex AI :** [cloud.google.com/vertex-ai/generative-ai/pricing](https://cloud.google.com/vertex-ai/generative-ai/pricing)
- **Documentation des modèles Claude :** [Claude sur Vertex AI](https://cloud.google.com/vertex-ai/generative-ai/docs/partner-models/claude)
- **Article de blog Google :** [Point de terminaison mondial pour les modèles Claude](https://cloud.google.com/blog/products/ai-machine-learning/global-endpoint-for-claude-models-generally-available-on-vertex-ai)
- **Détails de tarification Anthropic :** [Documentation de tarification](/docs/fr/about-claude/pricing#third-party-platform-pricing)