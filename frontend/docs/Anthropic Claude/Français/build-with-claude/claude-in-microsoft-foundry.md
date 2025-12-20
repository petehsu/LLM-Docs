# Claude dans Microsoft Foundry

Accédez aux modèles Claude via Microsoft Foundry avec des points de terminaison natifs Azure et l'authentification.

---

Ce guide vous expliquera comment configurer et effectuer des appels API à Claude dans Foundry en Python, TypeScript ou en utilisant des requêtes HTTP directes. Lorsque vous pouvez accéder à Claude dans Foundry, vous serez facturé pour l'utilisation de Claude sur la Place de marché Microsoft avec votre abonnement Azure, ce qui vous permet d'accéder aux dernières capacités de Claude tout en gérant les coûts via votre abonnement Azure.

Disponibilité régionale : Au lancement, Claude est disponible en tant que type de déploiement Global Standard dans les ressources Foundry avec la zone de données US à venir bientôt. La tarification de Claude sur la Place de marché Microsoft utilise la tarification API standard d'Anthropic. Visitez notre [page de tarification](https://claude.com/pricing#api) pour plus de détails.

## Aperçu

Dans cette intégration de plateforme en aperçu, les modèles Claude s'exécutent sur l'infrastructure d'Anthropic. Il s'agit d'une intégration commerciale pour la facturation et l'accès via Azure. En tant que processeur indépendant pour Microsoft, les clients utilisant Claude via Microsoft Foundry sont soumis aux conditions d'utilisation des données d'Anthropic. Anthropic continue de fournir ses engagements en matière de sécurité et de données de premier plan, y compris la disponibilité de zéro rétention de données.

## Conditions préalables

Avant de commencer, assurez-vous que vous disposez de :

- Un abonnement Azure actif
- Accès à [Foundry](https://ai.azure.com/)
- L'[interface de ligne de commande Azure](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) installée (facultatif, pour la gestion des ressources)

## Installer un SDK

Les [SDK clients](/docs/fr/api/client-sdks) d'Anthropic prennent en charge Foundry via des packages spécifiques à la plateforme.

```bash
# Python
pip install -U "anthropic"

# Typescript
npm install @anthropic-ai/foundry-sdk
```

## Approvisionnement

Foundry utilise une hiérarchie à deux niveaux : les **ressources** contiennent votre configuration de sécurité et de facturation, tandis que les **déploiements** sont les instances de modèle que vous appelez via l'API. Vous créerez d'abord une ressource Foundry, puis créerez un ou plusieurs déploiements Claude dans celle-ci.

### Approvisionnement des ressources Foundry

Créez une ressource Foundry, qui est requise pour utiliser et gérer les services dans Azure. Vous pouvez suivre ces instructions pour créer une [ressource Foundry](https://learn.microsoft.com/en-us/azure/ai-services/multi-service-resource?pivots=azportal#create-a-new-azure-ai-foundry-resource). Vous pouvez également commencer par créer un [projet Foundry](https://learn.microsoft.com/en-us/azure/ai-foundry/how-to/create-projects?tabs=ai-foundry), ce qui implique de créer une ressource Foundry.

Pour approvisionner votre ressource :

1. Accédez au [portail Foundry](https://ai.azure.com/)
2. Créez une nouvelle ressource Foundry ou sélectionnez-en une existante
3. Configurez la gestion des accès à l'aide de clés API émises par Azure ou d'Entra ID pour le contrôle d'accès basé sur les rôles
4. Configurez éventuellement la ressource pour faire partie d'un réseau privé (réseau virtuel Azure) pour une sécurité renforcée
5. Notez le nom de votre ressource : vous l'utiliserez comme `{resource}` dans les points de terminaison API (par exemple, `https://{resource}.services.ai.azure.com/anthropic/v1/*`)

### Création de déploiements Foundry

Après avoir créé votre ressource, déployez un modèle Claude pour le rendre disponible pour les appels API :

1. Dans le portail Foundry, accédez à votre ressource
2. Allez à **Modèles + points de terminaison** et sélectionnez **+ Déployer le modèle** > **Déployer le modèle de base**
3. Recherchez et sélectionnez un modèle Claude (par exemple, `claude-sonnet-4-5`)
4. Configurez les paramètres de déploiement :
   - **Nom du déploiement** : Par défaut, il correspond à l'ID du modèle, mais vous pouvez le personnaliser (par exemple, `my-claude-deployment`). Le nom du déploiement ne peut pas être modifié après sa création.
   - **Type de déploiement** : Sélectionnez Global Standard (recommandé pour Claude)
5. Sélectionnez **Déployer** et attendez que l'approvisionnement soit terminé
6. Une fois déployé, vous pouvez trouver l'URL de votre point de terminaison et les clés sous **Clés et point de terminaison**

<Note>
  Le nom du déploiement que vous choisissez devient la valeur que vous transmettez dans le paramètre `model` de vos requêtes API. Vous pouvez créer plusieurs déploiements du même modèle avec des noms différents pour gérer des configurations ou des limites de débit séparées.
</Note>

## Authentification

Claude sur Foundry prend en charge deux méthodes d'authentification : les clés API et les jetons Entra ID. Les deux méthodes utilisent des points de terminaison hébergés par Azure au format `https://{resource}.services.ai.azure.com/anthropic/v1/*`.

### Authentification par clé API

Après avoir approvisionné votre ressource Claude Foundry, vous pouvez obtenir une clé API à partir du portail Foundry :

1. Accédez à votre ressource dans le portail Foundry
2. Allez à la section **Clés et point de terminaison**
3. Copiez l'une des clés API fournies
4. Utilisez l'en-tête `api-key` ou `x-api-key` dans vos requêtes, ou fournissez-le au SDK

Les SDK Python et TypeScript nécessitent une clé API et soit un nom de ressource, soit une URL de base. Les SDK liront automatiquement ces éléments à partir des variables d'environnement suivantes s'ils sont définis :

- `ANTHROPIC_FOUNDRY_API_KEY` - Votre clé API
- `ANTHROPIC_FOUNDRY_RESOURCE` - Le nom de votre ressource (par exemple, `example-resource`)
- `ANTHROPIC_FOUNDRY_BASE_URL` - Alternative au nom de la ressource ; l'URL de base complète (par exemple, `https://example-resource.services.ai.azure.com/anthropic/`)

<Note>
Les paramètres `resource` et `base_url` s'excluent mutuellement. Fournissez soit le nom de la ressource (que le SDK utilise pour construire l'URL comme `https://{resource}.services.ai.azure.com/anthropic/`) soit l'URL de base complète directement.
</Note>

**Exemple utilisant une clé API :**

<CodeGroup>
```python Python
import os
from anthropic import AnthropicFoundry

client = AnthropicFoundry(
    api_key=os.environ.get("ANTHROPIC_FOUNDRY_API_KEY"),
    resource='example-resource', # your resource name
)

message = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello!"}]
)
print(message.content)
```

```typescript TypeScript
import AnthropicFoundry from "@anthropic-ai/foundry-sdk";

const client = new AnthropicFoundry({
  apiKey: process.env.ANTHROPIC_FOUNDRY_API_KEY,
  resource: 'example-resource', // your resource name
});

const message = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Hello!" }],
});
console.log(message.content);
```

```bash Shell
curl https://{resource}.services.ai.azure.com/anthropic/v1/messages \
  -H "content-type: application/json" \
  -H "api-key: YOUR_AZURE_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'
```
</CodeGroup>

<Warning>
Gardez vos clés API sécurisées. Ne les validez jamais dans le contrôle de version et ne les partagez pas publiquement. Toute personne ayant accès à votre clé API peut faire des requêtes à Claude via votre ressource Foundry.
</Warning>

## Authentification Microsoft Entra

Pour une sécurité renforcée et une gestion centralisée des accès, vous pouvez utiliser les jetons Entra ID (anciennement Azure Active Directory) :

1. Activez l'authentification Entra pour votre ressource Foundry
2. Obtenez un jeton d'accès à partir d'Entra ID
3. Utilisez le jeton dans l'en-tête `Authorization: Bearer {TOKEN}`

**Exemple utilisant Entra ID :**

<CodeGroup>
```python Python
import os
from anthropic import AnthropicFoundry
from azure.identity import DefaultAzureCredential, get_bearer_token_provider

# Get Azure Entra ID token using token provider pattern
token_provider = get_bearer_token_provider(
    DefaultAzureCredential(),
    "https://cognitiveservices.azure.com/.default"
)

# Create client with Entra ID authentication
client = AnthropicFoundry(
    resource='example-resource', # your resource name
    azure_ad_token_provider=token_provider  # Use token provider for Entra ID auth
)

# Make request
message = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello!"}]
)
print(message.content)
```

```typescript TypeScript
import AnthropicFoundry from "@anthropic-ai/foundry-sdk";
import {
  DefaultAzureCredential,
  getBearerTokenProvider,
} from "@azure/identity";

// Get Entra ID token using token provider pattern
const credential = new DefaultAzureCredential();
const tokenProvider = getBearerTokenProvider(
  credential,
  "https://cognitiveservices.azure.com/.default"
);

// Create client with Entra ID authentication
const client = new AnthropicFoundry({
  resource: 'example-resource', // your resource name
  azureADTokenProvider: tokenProvider, // Use token provider for Entra ID auth
});

// Make request
const message = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Hello!" }],
});
console.log(message.content);
```

```bash Shell
# Get Azure Entra ID token
ACCESS_TOKEN=$(az account get-access-token --resource https://cognitiveservices.azure.com --query accessToken -o tsv)

# Make request with token. Replace {resource} with your resource name
curl https://{resource}.services.ai.azure.com/anthropic/v1/messages \
  -H "content-type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'
```
</CodeGroup>

<Note>
L'authentification Azure Entra ID vous permet de gérer l'accès à l'aide d'Azure RBAC, d'intégrer la gestion des identités de votre organisation et d'éviter de gérer manuellement les clés API.
</Note>

## ID de requête de corrélation

Foundry inclut des identifiants de requête dans les en-têtes de réponse HTTP pour le débogage et le suivi. Lorsque vous contactez le support, fournissez les valeurs `request-id` et `apim-request-id` pour aider les équipes à localiser et enquêter rapidement sur votre requête dans les systèmes Anthropic et Azure.

## Fonctionnalités prises en charge

Claude sur Foundry prend en charge la plupart des puissantes fonctionnalités de Claude. Vous pouvez trouver toutes les fonctionnalités actuellement prises en charge [ici](/docs/fr/build-with-claude/overview).

### Fonctionnalités non prises en charge

- Admin API (points de terminaison `/v1/organizations/*`)
- Models API (`/v1/models`)
- Message Batch API (`/v1/messages/batches`)

## Réponses API

Les réponses API de Claude sur Foundry suivent le [format de réponse API Anthropic](/docs/fr/api/messages) standard. Cela inclut l'objet `usage` dans les corps de réponse, qui fournit des informations détaillées sur la consommation de jetons pour vos requêtes. L'objet `usage` est cohérent sur toutes les plateformes (API propriétaire, Foundry, Amazon Bedrock et Google Vertex AI).

Pour plus de détails sur les en-têtes de réponse spécifiques à Foundry, consultez la [section des ID de requête de corrélation](#correlation-request-ids).

## ID de modèle API et déploiements

Les modèles Claude suivants sont disponibles via Foundry. Les modèles de dernière génération (Sonnet 4.5, Opus 4.1 et Haiku 4.5) offrent les capacités les plus avancées :

| Modèle            | Nom de déploiement par défaut |
| :---------------- | :---------------------------- |
| Claude Opus 4.5   | `claude-opus-4-5`             |
| Claude Sonnet 4.5 | `claude-sonnet-4-5`           |
| Claude Opus 4.1   | `claude-opus-4-1`             |
| Claude Haiku 4.5  | `claude-haiku-4-5`            |

Par défaut, les noms de déploiement correspondent aux ID de modèle affichés ci-dessus. Cependant, vous pouvez créer des déploiements personnalisés avec des noms différents dans le portail Foundry pour gérer différentes configurations, versions ou limites de débit. Utilisez le nom du déploiement (pas nécessairement l'ID du modèle) dans vos requêtes API.

## Surveillance et journalisation

Azure fournit des capacités complètes de surveillance et de journalisation pour votre utilisation de Claude via des modèles Azure standard :

- **Azure Monitor** : Suivez l'utilisation de l'API, la latence et les taux d'erreur
- **Azure Log Analytics** : Interrogez et analysez les journaux de requête/réponse
- **Gestion des coûts** : Surveillez et prévoyez les coûts associés à l'utilisation de Claude

Anthropic recommande de journaliser votre activité sur au moins une base de 30 jours glissants pour comprendre les modèles d'utilisation et enquêter sur les problèmes potentiels.

<Note>
Les services de journalisation d'Azure sont configurés dans votre abonnement Azure. L'activation de la journalisation ne donne pas à Microsoft ou à Anthropic accès à votre contenu au-delà de ce qui est nécessaire pour la facturation et l'exploitation du service.
</Note>

## Dépannage

### Erreurs d'authentification

**Erreur** : `401 Unauthorized` ou `Invalid API key`

- **Solution** : Vérifiez que votre clé API est correcte. Vous pouvez obtenir une nouvelle clé API à partir du portail Azure sous **Clés et point de terminaison** pour votre ressource Claude.
- **Solution** : Si vous utilisez Azure Entra ID, assurez-vous que votre jeton d'accès est valide et n'a pas expiré. Les jetons expirent généralement après 1 heure.

**Erreur** : `403 Forbidden`

- **Solution** : Votre compte Azure peut ne pas disposer des autorisations nécessaires. Assurez-vous que vous avez le rôle Azure RBAC approprié assigné (par exemple, « Cognitive Services OpenAI User »).

### Limitation de débit

**Erreur** : `429 Too Many Requests`

- **Solution** : Vous avez dépassé votre limite de débit. Implémentez une logique de backoff exponentiel et de nouvelle tentative dans votre application.
- **Solution** : Envisagez de demander des augmentations de limite de débit via le portail Azure ou le support Azure.

#### En-têtes de limite de débit

Foundry n'inclut pas les en-têtes de limite de débit standard d'Anthropic (`anthropic-ratelimit-tokens-limit`, `anthropic-ratelimit-tokens-remaining`, `anthropic-ratelimit-tokens-reset`, `anthropic-ratelimit-input-tokens-limit`, `anthropic-ratelimit-input-tokens-remaining`, `anthropic-ratelimit-input-tokens-reset`, `anthropic-ratelimit-output-tokens-limit`, `anthropic-ratelimit-output-tokens-remaining` et `anthropic-ratelimit-output-tokens-reset`) dans les réponses. Gérez la limitation de débit via les outils de surveillance d'Azure à la place.

### Erreurs de modèle et de déploiement

**Erreur** : `Model not found` ou `Deployment not found`

- **Solution** : Vérifiez que vous utilisez le nom de déploiement correct. Si vous n'avez pas créé de déploiement personnalisé, utilisez l'ID de modèle par défaut (par exemple, `claude-sonnet-4-5`).
- **Solution** : Assurez-vous que le modèle/déploiement est disponible dans votre région Azure.

**Erreur** : `Invalid model parameter`

- **Solution** : Le paramètre model doit contenir le nom de votre déploiement, qui peut être personnalisé dans le portail Foundry. Vérifiez que le déploiement existe et est correctement configuré.

## Ressources supplémentaires

- **Documentation Foundry** : [ai.azure.com/catalog](https://ai.azure.com/catalog/publishers/anthropic)
- **Tarification Azure** : [azure.microsoft.com/en-us/pricing](https://azure.microsoft.com/en-us/pricing/)
- **Détails de tarification Anthropic** : [Documentation de tarification](/docs/fr/about-claude/pricing#third-party-platform-pricing)
- **Guide d'authentification** : Consultez la [section d'authentification](#authentication) ci-dessus
- **Portail Azure** : [portal.azure.com](https://portal.azure.com/)