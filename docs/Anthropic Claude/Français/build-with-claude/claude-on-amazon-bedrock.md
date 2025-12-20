# Claude sur Amazon Bedrock

Les modèles Claude d'Anthropic sont désormais généralement disponibles via Amazon Bedrock.

---

L'appel de Claude via Bedrock diffère légèrement de la façon dont vous appelleriez Claude en utilisant les SDK clients d'Anthropic. Ce guide vous guidera tout au long du processus de réalisation d'un appel API à Claude sur Bedrock en Python ou TypeScript.

Notez que ce guide suppose que vous vous êtes déjà inscrit pour un [compte AWS](https://portal.aws.amazon.com/billing/signup) et que vous avez configuré l'accès par programmation.

## Installer et configurer l'AWS CLI

1. [Installez une version de l'AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html) version `2.13.23` ou plus récente
2. Configurez vos identifiants AWS en utilisant la commande AWS configure (voir [Configurer l'AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)) ou trouvez vos identifiants en naviguant vers « Command line or programmatic access » dans votre tableau de bord AWS et en suivant les instructions dans la fenêtre modale contextuelle.
3. Vérifiez que vos identifiants fonctionnent :

```bash Shell
aws sts get-caller-identity
```

## Installer un SDK pour accéder à Bedrock

Les [SDK clients](/docs/fr/api/client-sdks) d'Anthropic supportent Bedrock. Vous pouvez également utiliser directement un SDK AWS comme `boto3`.

<CodeGroup>
  ```python Python
  pip install -U "anthropic[bedrock]"
  ```

  ```typescript TypeScript
  npm install @anthropic-ai/bedrock-sdk
  ```

  ```python Boto3 (Python)
  pip install boto3>=1.28.59
  ```
</CodeGroup>

## Accéder à Bedrock

### S'abonner aux modèles Anthropic

Allez à [AWS Console > Bedrock > Model Access](https://console.aws.amazon.com/bedrock/home?region=us-west-2#/modelaccess) et demandez l'accès aux modèles Anthropic. Notez que la disponibilité des modèles Anthropic varie selon la région. Consultez la [documentation AWS](https://docs.aws.amazon.com/bedrock/latest/userguide/models-regions.html) pour les dernières informations.

#### ID de modèle API

| Modèle | ID de modèle Bedrock de base | `global` | `us` | `eu` | `jp` | `apac` |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| Claude Sonnet 4.5 | anthropic.claude-sonnet-4-5-20250929-v1:0 | Oui | Oui | Oui | Oui | Non |
| Claude Sonnet 4 | anthropic.claude-sonnet-4-20250514-v1:0 | Oui | Oui | Oui | Non | Oui |
| Claude Sonnet 3.7 <Tooltip tooltipContent="Déprécié depuis le 28 octobre 2025.">⚠️</Tooltip> | anthropic.claude-3-7-sonnet-20250219-v1:0 | Non | Oui | Oui | Non | Oui |
| Claude Opus 4.5 | anthropic.claude-opus-4-5-20251101-v1:0 | Oui | Oui | Oui | Non | Non |
| Claude Opus 4.1 | anthropic.claude-opus-4-1-20250805-v1:0 | Non | Oui | Non | Non | Non |
| Claude Opus 4 | anthropic.claude-opus-4-20250514-v1:0 | Non | Oui | Non | Non | Non |
| Claude Opus 3 <Tooltip tooltipContent="Déprécié depuis le 30 juin 2025.">⚠️</Tooltip> | anthropic.claude-3-opus-20240229-v1:0 | Non | Oui | Non | Non | Non |
| Claude Haiku 4.5 | anthropic.claude-haiku-4-5-20251001-v1:0 | Oui | Oui | Oui | Non | Non |
| Claude Haiku 3.5 | anthropic.claude-3-5-haiku-20241022-v1:0 | Non | Oui | Non | Non | Non |
| Claude Haiku 3 | anthropic.claude-3-haiku-20240307-v1:0 | Non | Oui | Oui | Non | Oui |

Pour plus d'informations sur les ID de modèle régionaux par rapport aux ID mondiaux, consultez la section [Points de terminaison mondiaux par rapport aux points de terminaison régionaux](#global-vs-regional-endpoints) ci-dessous.

### Lister les modèles disponibles

Les exemples suivants montrent comment imprimer une liste de tous les modèles Claude disponibles via Bedrock :

<CodeGroup>
  ```bash AWS CLI
  aws bedrock list-foundation-models --region=us-west-2 --by-provider anthropic --query "modelSummaries[*].modelId"
  ```

  ```python Boto3 (Python)
  import boto3

  bedrock = boto3.client(service_name="bedrock")
  response = bedrock.list_foundation_models(byProvider="anthropic")

  for summary in response["modelSummaries"]:
      print(summary["modelId"])
  ```
</CodeGroup>

### Effectuer des demandes

Les exemples suivants montrent comment générer du texte à partir de Claude sur Bedrock :

<CodeGroup>
  ```python Python
  from anthropic import AnthropicBedrock

  client = AnthropicBedrock(
      # Authentifiez-vous en fournissant les clés ci-dessous ou utilisez les fournisseurs d'identifiants AWS par défaut, tels que
      # l'utilisation de ~/.aws/credentials ou les variables d'environnement "AWS_SECRET_ACCESS_KEY" et "AWS_ACCESS_KEY_ID".
      aws_access_key="<access key>",
      aws_secret_key="<secret key>",
      # Les identifiants temporaires peuvent être utilisés avec aws_session_token.
      # En savoir plus sur https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp.html.
      aws_session_token="<session_token>",
      # aws_region change la région AWS vers laquelle la demande est effectuée. Par défaut, nous lisons AWS_REGION,
      # et si ce n'est pas présent, nous utilisons par défaut us-east-1. Notez que nous ne lisons pas ~/.aws/config pour la région.
      aws_region="us-west-2",
  )

  message = client.messages.create(
      model="global.anthropic.claude-sonnet-4-5-20250929-v1:0",
      max_tokens=256,
      messages=[{"role": "user", "content": "Hello, world"}]
  )
  print(message.content)
  ```

  ```typescript TypeScript
  import AnthropicBedrock from '@anthropic-ai/bedrock-sdk';

  const client = new AnthropicBedrock({
    // Authentifiez-vous en fournissant les clés ci-dessous ou utilisez les fournisseurs d'identifiants AWS par défaut, tels que
    // l'utilisation de ~/.aws/credentials ou les variables d'environnement "AWS_SECRET_ACCESS_KEY" et "AWS_ACCESS_KEY_ID".
    awsAccessKey: '<access key>',
    awsSecretKey: '<secret key>',

    // Les identifiants temporaires peuvent être utilisés avec awsSessionToken.
    // En savoir plus sur https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp.html.
    awsSessionToken: '<session_token>',

    // awsRegion change la région AWS vers laquelle la demande est effectuée. Par défaut, nous lisons AWS_REGION,
    // et si ce n'est pas présent, nous utilisons par défaut us-east-1. Notez que nous ne lisons pas ~/.aws/config pour la région.
    awsRegion: 'us-west-2',
  });

  async function main() {
    const message = await client.messages.create({
      model: 'global.anthropic.claude-sonnet-4-5-20250929-v1:0',
      max_tokens: 256,
      messages: [{"role": "user", "content": "Hello, world"}]
    });
    console.log(message);
  }
  main().catch(console.error);
  ```

  ```python Boto3 (Python)
  import boto3
  import json

  bedrock = boto3.client(service_name="bedrock-runtime")
  body = json.dumps({
    "max_tokens": 256,
    "messages": [{"role": "user", "content": "Hello, world"}],
    "anthropic_version": "bedrock-2023-05-31"
  })

  response = bedrock.invoke_model(body=body, modelId="global.anthropic.claude-sonnet-4-5-20250929-v1:0")

  response_body = json.loads(response.get("body").read())
  print(response_body.get("content"))
  ```
</CodeGroup>

Consultez nos [SDK clients](/docs/fr/api/client-sdks) pour plus de détails, et la documentation officielle de Bedrock [ici](https://docs.aws.amazon.com/bedrock/).

## Journalisation des activités

Bedrock fournit un [service de journalisation des invocations](https://docs.aws.amazon.com/bedrock/latest/userguide/model-invocation-logging.html) qui permet aux clients de journaliser les invites et les complétions associées à votre utilisation.

Anthropic recommande que vous journalisiez votre activité sur au moins une base glissante de 30 jours afin de comprendre votre activité et d'enquêter sur tout abus potentiel.

<Note>
L'activation de ce service ne donne à AWS ou à Anthropic aucun accès à votre contenu.
</Note>

## Support des fonctionnalités
Vous pouvez trouver toutes les fonctionnalités actuellement supportées sur Bedrock [ici](/docs/fr/api/overview).

### Support PDF sur Bedrock

Le support PDF est disponible sur Amazon Bedrock via l'API Converse et l'API InvokeModel. Pour des informations détaillées sur les capacités et les limitations du traitement PDF, consultez la [documentation de support PDF](/docs/fr/build-with-claude/pdf-support#amazon-bedrock-pdf-support).

**Considérations importantes pour les utilisateurs de l'API Converse :**
- L'analyse visuelle des PDF (graphiques, images, mises en page) nécessite que les citations soient activées
- Sans citations, seule l'extraction de texte de base est disponible
- Pour un contrôle total sans citations forcées, utilisez l'API InvokeModel

Pour plus de détails sur les deux modes de traitement des documents et leurs limitations, consultez le [guide de support PDF](/docs/fr/build-with-claude/pdf-support#amazon-bedrock-pdf-support).

### Fenêtre de contexte de 1M de jetons

Claude Sonnet 4 et 4.5 supportent la [fenêtre de contexte de 1M de jetons](/docs/fr/build-with-claude/context-windows#1m-token-context-window) sur Amazon Bedrock.

<Note>
La fenêtre de contexte de 1M de jetons est actuellement en version bêta. Pour utiliser la fenêtre de contexte étendue, incluez l'en-tête bêta `context-1m-2025-08-07` dans vos [demandes d'API Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-anthropic-claude-messages-request-response.html).
</Note>

## Points de terminaison mondiaux par rapport aux points de terminaison régionaux

À partir de **Claude Sonnet 4.5 et tous les modèles futurs**, Amazon Bedrock offre deux types de points de terminaison :

- **Points de terminaison mondiaux** : Routage dynamique pour une disponibilité maximale
- **Points de terminaison régionaux** : Routage de données garanti via des régions géographiques spécifiques

Les points de terminaison régionaux incluent une prime tarifaire de 10 % par rapport aux points de terminaison mondiaux.

<Note>
Ceci s'applique uniquement à Claude Sonnet 4.5 et aux modèles futurs. Les anciens modèles (Claude Sonnet 4, Opus 4 et antérieurs) conservent leurs structures tarifaires existantes.
</Note>

### Quand utiliser chaque option

**Points de terminaison mondiaux (recommandé) :**
- Fournissent une disponibilité et un temps d'activité maximaux
- Acheminent dynamiquement les demandes vers les régions avec capacité disponible
- Aucune prime tarifaire
- Idéal pour les applications où la résidence des données est flexible

**Points de terminaison régionaux (CRIS) :**
- Acheminent le trafic via des régions géographiques spécifiques
- Requis pour les exigences de résidence des données et de conformité
- Disponible pour les États-Unis, l'UE, le Japon et l'Australie
- Prime tarifaire de 10 % reflétant les coûts d'infrastructure pour la capacité régionale dédiée

### Implémentation

**Utilisation des points de terminaison mondiaux (par défaut pour Sonnet 4.5 et 4) :**

Les ID de modèle pour Claude Sonnet 4.5 et 4 incluent déjà le préfixe `global.` :

<CodeGroup>
```python Python
from anthropic import AnthropicBedrock

client = AnthropicBedrock(aws_region="us-west-2")

message = client.messages.create(
    model="global.anthropic.claude-sonnet-4-5-20250929-v1:0",
    max_tokens=256,
    messages=[{"role": "user", "content": "Hello, world"}]
)
```

```typescript TypeScript
import AnthropicBedrock from '@anthropic-ai/bedrock-sdk';

const client = new AnthropicBedrock({
  awsRegion: 'us-west-2',
});

const message = await client.messages.create({
  model: 'global.anthropic.claude-sonnet-4-5-20250929-v1:0',
  max_tokens: 256,
  messages: [{role: "user", content: "Hello, world"}]
});
```
</CodeGroup>

**Utilisation des points de terminaison régionaux (CRIS) :**

Pour utiliser les points de terminaison régionaux, supprimez le préfixe `global.` de l'ID de modèle :

<CodeGroup>
```python Python
from anthropic import AnthropicBedrock

client = AnthropicBedrock(aws_region="us-west-2")

# Utilisation du point de terminaison régional US (CRIS)
message = client.messages.create(
    model="anthropic.claude-sonnet-4-5-20250929-v1:0",  # Pas de préfixe global.
    max_tokens=256,
    messages=[{"role": "user", "content": "Hello, world"}]
)
```

```typescript TypeScript
import AnthropicBedrock from '@anthropic-ai/bedrock-sdk';

const client = new AnthropicBedrock({
  awsRegion: 'us-west-2',
});

// Utilisation du point de terminaison régional US (CRIS)
const message = await client.messages.create({
  model: 'anthropic.claude-sonnet-4-5-20250929-v1:0',  // Pas de préfixe global.
  max_tokens: 256,
  messages: [{role: "user", content: "Hello, world"}]
});
```
</CodeGroup>

### Ressources supplémentaires

- **Tarification AWS Bedrock :** [aws.amazon.com/bedrock/pricing](https://aws.amazon.com/bedrock/pricing/)
- **Documentation de tarification AWS :** [Guide de tarification Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/bedrock-pricing.html)
- **Article de blog AWS :** [Introducing Claude Sonnet 4.5 in Amazon Bedrock](https://aws.amazon.com/blogs/aws/introducing-claude-sonnet-4-5-in-amazon-bedrock-anthropics-most-intelligent-model-best-for-coding-and-complex-agents/)
- **Détails de tarification Anthropic :** [Documentation de tarification](/docs/fr/about-claude/pricing#third-party-platform-pricing)