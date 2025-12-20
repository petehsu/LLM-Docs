# Traitement par lots

Traitez efficacement de grands volumes de requêtes avec l'API Message Batches pour un traitement asynchrone et des économies de coûts de 50%.

---

Le traitement par lots est une approche puissante pour gérer efficacement de grands volumes de requêtes. Au lieu de traiter les requêtes une par une avec des réponses immédiates, le traitement par lots vous permet de soumettre plusieurs requêtes ensemble pour un traitement asynchrone. Ce modèle est particulièrement utile lorsque :

- Vous devez traiter de grands volumes de données
- Les réponses immédiates ne sont pas requises
- Vous souhaitez optimiser l'efficacité des coûts
- Vous exécutez des évaluations ou des analyses à grande échelle

L'API Message Batches est notre première implémentation de ce modèle.

---

# API Message Batches

L'API Message Batches est un moyen puissant et rentable de traiter de manière asynchrone de grands volumes de requêtes [Messages](/docs/fr/api/messages). Cette approche convient bien aux tâches qui ne nécessitent pas de réponses immédiates, la plupart des lots se terminant en moins d'une heure tout en réduisant les coûts de 50 % et en augmentant le débit.

Vous pouvez [explorer la référence API directement](/docs/fr/api/creating-message-batches), en plus de ce guide.

## Comment fonctionne l'API Message Batches

Lorsque vous envoyez une requête à l'API Message Batches :

1. Le système crée un nouveau Message Batch avec les requêtes Messages fournies.
2. Le lot est ensuite traité de manière asynchrone, chaque requête étant traitée indépendamment.
3. Vous pouvez interroger l'état du lot et récupérer les résultats une fois le traitement terminé pour toutes les requêtes.

Ceci est particulièrement utile pour les opérations en masse qui ne nécessitent pas de résultats immédiats, telles que :
- Évaluations à grande échelle : Traitez efficacement des milliers de cas de test.
- Modération de contenu : Analysez de manière asynchrone de grands volumes de contenu généré par les utilisateurs.
- Analyse de données : Générez des informations ou des résumés pour de grands ensembles de données.
- Génération de contenu en masse : Créez de grandes quantités de texte à diverses fins (par exemple, descriptions de produits, résumés d'articles).

### Limitations des lots
- Un Message Batch est limité à 100 000 requêtes Messages ou 256 Mo de taille, selon ce qui est atteint en premier.
- Nous traitons chaque lot aussi rapidement que possible, la plupart des lots se terminant en moins d'une heure. Vous pourrez accéder aux résultats du lot une fois que tous les messages seront terminés ou après 24 heures, selon ce qui arrive en premier. Les lots expireront si le traitement ne se termine pas dans les 24 heures.
- Les résultats des lots sont disponibles pendant 29 jours après la création. Après cela, vous pouvez toujours afficher le Batch, mais ses résultats ne seront plus disponibles pour téléchargement.
- Les lots sont limités à un [Workspace](/settings/workspaces). Vous pouvez afficher tous les lots—et leurs résultats—qui ont été créés dans le Workspace auquel appartient votre clé API.
- Les limites de débit s'appliquent à la fois aux requêtes HTTP de l'API Batches et au nombre de requêtes dans un lot en attente de traitement. Voir [Limites de débit de l'API Message Batches](/docs/fr/api/rate-limits#message-batches-api). De plus, nous pouvons ralentir le traitement en fonction de la demande actuelle et de votre volume de requêtes. Dans ce cas, vous pouvez voir plus de requêtes expirer après 24 heures.
- En raison du débit élevé et du traitement concurrent, les lots peuvent légèrement dépasser la [limite de dépenses](/settings/limits) configurée de votre Workspace.

### Modèles pris en charge

Tous les [modèles actifs](/docs/fr/about-claude/models/overview) prennent en charge l'API Message Batches.

### Ce qui peut être traité par lots
Toute requête que vous pouvez faire à l'API Messages peut être incluse dans un lot. Cela inclut :

- Vision
- Utilisation d'outils
- Messages système
- Conversations multi-tours
- Toutes les fonctionnalités bêta

Puisque chaque requête du lot est traitée indépendamment, vous pouvez mélanger différents types de requêtes dans un seul lot.

<Tip>
Puisque les lots peuvent prendre plus de 5 minutes à traiter, envisagez d'utiliser la [durée du cache d'une heure](/docs/fr/build-with-claude/prompt-caching#1-hour-cache-duration) avec la mise en cache des invites pour de meilleurs taux de succès du cache lors du traitement des lots avec un contexte partagé.
</Tip>

---
## Tarification

L'API Batches offre des économies de coûts importantes. Tous les usages sont facturés à 50 % des prix standard de l'API.

| Model             | Batch input      | Batch output    |
|-------------------|------------------|-----------------|
| Claude Opus 4.5     | $2.50 / MTok     | $12.50 / MTok   |
| Claude Opus 4.1     | $7.50 / MTok     | $37.50 / MTok   |
| Claude Opus 4     | $7.50 / MTok     | $37.50 / MTok   |
| Claude Sonnet 4.5   | $1.50 / MTok     | $7.50 / MTok    |
| Claude Sonnet 4   | $1.50 / MTok     | $7.50 / MTok    |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations)) | $1.50 / MTok     | $7.50 / MTok    |
| Claude Haiku 4.5  | $0.50 / MTok     | $2.50 / MTok    |
| Claude Haiku 3.5  | $0.40 / MTok     | $2 / MTok       |
| Claude Opus 3 ([deprecated](/docs/en/about-claude/model-deprecations))  | $7.50 / MTok     | $37.50 / MTok   |
| Claude Haiku 3    | $0.125 / MTok    | $0.625 / MTok   |

---
## Comment utiliser l'API Message Batches

### Préparez et créez votre lot

Un Message Batch est composé d'une liste de requêtes pour créer un Message. La forme d'une requête individuelle comprend :
- Un `custom_id` unique pour identifier la requête Messages
- Un objet `params` avec les paramètres standard de l'[API Messages](/docs/fr/api/messages)

Vous pouvez [créer un lot](/docs/fr/api/creating-message-batches) en passant cette liste dans le paramètre `requests` :

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages/batches \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "requests": [
        {
            "custom_id": "my-first-request",
            "params": {
                "model": "claude-sonnet-4-5",
                "max_tokens": 1024,
                "messages": [
                    {"role": "user", "content": "Hello, world"}
                ]
            }
        },
        {
            "custom_id": "my-second-request",
            "params": {
                "model": "claude-sonnet-4-5",
                "max_tokens": 1024,
                "messages": [
                    {"role": "user", "content": "Hi again, friend"}
                ]
            }
        }
    ]
}'
```

```python Python
import anthropic
from anthropic.types.message_create_params import MessageCreateParamsNonStreaming
from anthropic.types.messages.batch_create_params import Request

client = anthropic.Anthropic()

message_batch = client.messages.batches.create(
    requests=[
        Request(
            custom_id="my-first-request",
            params=MessageCreateParamsNonStreaming(
                model="claude-sonnet-4-5",
                max_tokens=1024,
                messages=[{
                    "role": "user",
                    "content": "Hello, world",
                }]
            )
        ),
        Request(
            custom_id="my-second-request",
            params=MessageCreateParamsNonStreaming(
                model="claude-sonnet-4-5",
                max_tokens=1024,
                messages=[{
                    "role": "user",
                    "content": "Hi again, friend",
                }]
            )
        )
    ]
)

print(message_batch)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const messageBatch = await anthropic.messages.batches.create({
  requests: [{
    custom_id: "my-first-request",
    params: {
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      messages: [
        {"role": "user", "content": "Hello, world"}
      ]
    }
  }, {
    custom_id: "my-second-request",
    params: {
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      messages: [
        {"role": "user", "content": "Hi again, friend"}
      ]
    }
  }]
});

console.log(messageBatch)
```

```java Java
import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.batches.*;

public class BatchExample {
    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        BatchCreateParams params = BatchCreateParams.builder()
            .addRequest(BatchCreateParams.Request.builder()
                .customId("my-first-request")
                .params(BatchCreateParams.Request.Params.builder()
                    .model(Model.CLAUDE_OPUS_4_0)
                    .maxTokens(1024)
                    .addUserMessage("Hello, world")
                    .build())
                .build())
            .addRequest(BatchCreateParams.Request.builder()
                .customId("my-second-request")
                .params(BatchCreateParams.Request.Params.builder()
                    .model(Model.CLAUDE_OPUS_4_0)
                    .maxTokens(1024)
                    .addUserMessage("Hi again, friend")
                    .build())
                .build())
            .build();

        MessageBatch messageBatch = client.messages().batches().create(params);

        System.out.println(messageBatch);
    }
}
```

</CodeGroup>

Dans cet exemple, deux requêtes distinctes sont traitées par lots ensemble pour un traitement asynchrone. Chaque requête a un `custom_id` unique et contient les paramètres standard que vous utiliseriez pour un appel à l'API Messages.

<Tip>
  **Testez vos requêtes de lot avec l'API Messages**

La validation de l'objet `params` pour chaque requête de message est effectuée de manière asynchrone, et les erreurs de validation sont renvoyées une fois le traitement de l'ensemble du lot terminé. Vous pouvez vous assurer que vous construisez votre entrée correctement en vérifiant d'abord la forme de votre requête avec l'[API Messages](/docs/fr/api/messages).
</Tip>

Lorsqu'un lot est créé pour la première fois, la réponse aura un statut de traitement de `in_progress`.

```json JSON
{
  "id": "msgbatch_01HkcTjaV5uDC8jWR4ZsDV8d",
  "type": "message_batch",
  "processing_status": "in_progress",
  "request_counts": {
    "processing": 2,
    "succeeded": 0,
    "errored": 0,
    "canceled": 0,
    "expired": 0
  },
  "ended_at": null,
  "created_at": "2024-09-24T18:37:24.100435Z",
  "expires_at": "2024-09-25T18:37:24.100435Z",
  "cancel_initiated_at": null,
  "results_url": null
}
```

### Suivi de votre lot

Le champ `processing_status` du Message Batch indique l'étape du traitement du lot. Il commence par `in_progress`, puis se met à jour à `ended` une fois que toutes les requêtes du lot ont terminé le traitement et que les résultats sont prêts. Vous pouvez surveiller l'état de votre lot en visitant la [Console](/settings/workspaces/default/batches), ou en utilisant le [point de terminaison de récupération](/docs/fr/api/retrieving-message-batches).

#### Interrogation de l'achèvement du Message Batch

Pour interroger un Message Batch, vous aurez besoin de son `id`, qui est fourni dans la réponse lors de la création d'un lot ou en listant les lots. Vous pouvez implémenter une boucle d'interrogation qui vérifie périodiquement l'état du lot jusqu'à ce que le traitement soit terminé :

<CodeGroup>
```python Python
import anthropic
import time

client = anthropic.Anthropic()

message_batch = None
while True:
    message_batch = client.messages.batches.retrieve(
        MESSAGE_BATCH_ID
    )
    if message_batch.processing_status == "ended":
        break

    print(f"Batch {MESSAGE_BATCH_ID} is still processing...")
    time.sleep(60)
print(message_batch)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

let messageBatch;
while (true) {
  messageBatch = await anthropic.messages.batches.retrieve(
    MESSAGE_BATCH_ID
  );
  if (messageBatch.processing_status === 'ended') {
    break;
  }

  console.log(`Batch ${messageBatch} is still processing... waiting`);
  await new Promise(resolve => setTimeout(resolve, 60_000));
}
console.log(messageBatch);
```

```bash Shell
#!/bin/sh

until [[ $(curl -s "https://api.anthropic.com/v1/messages/batches/$MESSAGE_BATCH_ID" \
          --header "x-api-key: $ANTHROPIC_API_KEY" \
          --header "anthropic-version: 2023-06-01" \
          | grep -o '"processing_status":[[:space:]]*"[^"]*"' \
          | cut -d'"' -f4) == "ended" ]]; do
    echo "Batch $MESSAGE_BATCH_ID is still processing..."
    sleep 60
done

echo "Batch $MESSAGE_BATCH_ID has finished processing"
```
</CodeGroup>

### Listage de tous les Message Batches

Vous pouvez lister tous les Message Batches dans votre Workspace en utilisant le [point de terminaison de liste](/docs/fr/api/listing-message-batches). L'API prend en charge la pagination, en récupérant automatiquement les pages supplémentaires selon les besoins :

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# Récupère automatiquement plus de pages selon les besoins.
for message_batch in client.messages.batches.list(
    limit=20
):
    print(message_batch)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

// Récupère automatiquement plus de pages selon les besoins.
for await (const messageBatch of anthropic.messages.batches.list({
  limit: 20
})) {
  console.log(messageBatch);
}
```

```bash Shell
#!/bin/sh

if ! command -v jq &> /dev/null; then
    echo "Error: This script requires jq. Please install it first."
    exit 1
fi

BASE_URL="https://api.anthropic.com/v1/messages/batches"

has_more=true
after_id=""

while [ "$has_more" = true ]; do
    # Construct URL with after_id if it exists
    if [ -n "$after_id" ]; then
        url="${BASE_URL}?limit=20&after_id=${after_id}"
    else
        url="$BASE_URL?limit=20"
    fi

    response=$(curl -s "$url" \
              --header "x-api-key: $ANTHROPIC_API_KEY" \
              --header "anthropic-version: 2023-06-01")

    # Extract values using jq
    has_more=$(echo "$response" | jq -r '.has_more')
    after_id=$(echo "$response" | jq -r '.last_id')

    # Process and print each entry in the data array
    echo "$response" | jq -c '.data[]' | while read -r entry; do
        echo "$entry" | jq '.'
    done
done
```

```java Java
import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.batches.*;

public class BatchListExample {
    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Récupère automatiquement plus de pages selon les besoins
        for (MessageBatch messageBatch : client.messages().batches().list(
                BatchListParams.builder()
                        .limit(20)
                        .build()
        )) {
            System.out.println(messageBatch);
        }
    }
}
```
</CodeGroup>

### Récupération des résultats du lot

Une fois le traitement du lot terminé, chaque requête Messages du lot aura un résultat. Il y a 4 types de résultats :

| Type de résultat | Description |
|-------------|-------------|
| `succeeded` | La requête a réussi. Inclut le résultat du message. |
| `errored`   | La requête a rencontré une erreur et un message n'a pas été créé. Les erreurs possibles incluent les requêtes invalides et les erreurs internes du serveur. Vous ne serez pas facturé pour ces requêtes. |
| `canceled`  | L'utilisateur a annulé le lot avant que cette requête puisse être envoyée au modèle. Vous ne serez pas facturé pour ces requêtes. |
| `expired`   | Le lot a atteint son expiration de 24 heures avant que cette requête puisse être envoyée au modèle. Vous ne serez pas facturé pour ces requêtes. |

Vous verrez un aperçu de vos résultats avec le `request_counts` du lot, qui montre combien de requêtes ont atteint chacun de ces quatre états.

Les résultats du lot sont disponibles pour téléchargement à la propriété `results_url` sur le Message Batch, et si la permission de l'organisation le permet, dans la Console. En raison de la taille potentiellement importante des résultats, il est recommandé de [diffuser les résultats](/docs/fr/api/retrieving-message-batch-results) plutôt que de les télécharger tous à la fois.

<CodeGroup>

```bash Shell
#!/bin/sh
curl "https://api.anthropic.com/v1/messages/batches/msgbatch_01HkcTjaV5uDC8jWR4ZsDV8d" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_API_KEY" \
  | grep -o '"results_url":[[:space:]]*"[^"]*"' \
  | cut -d'"' -f4 \
  | while read -r url; do
    curl -s "$url" \
      --header "anthropic-version: 2023-06-01" \
      --header "x-api-key: $ANTHROPIC_API_KEY" \
      | sed 's/}{/}\n{/g' \
      | while IFS= read -r line
    do
      result_type=$(echo "$line" | sed -n 's/.*"result":[[:space:]]*{[[:space:]]*"type":[[:space:]]*"\([^"]*\)".*/\1/p')
      custom_id=$(echo "$line" | sed -n 's/.*"custom_id":[[:space:]]*"\([^"]*\)".*/\1/p')
      error_type=$(echo "$line" | sed -n 's/.*"error":[[:space:]]*{[[:space:]]*"type":[[:space:]]*"\([^"]*\)".*/\1/p')

      case "$result_type" in
        "succeeded")
          echo "Success! $custom_id"
          ;;
        "errored")
          if [ "$error_type" = "invalid_request" ]; then
            # Request body must be fixed before re-sending request
            echo "Validation error: $custom_id"
          else
            # Request can be retried directly
            echo "Server error: $custom_id"
          fi
          ;;
        "expired")
          echo "Expired: $line"
          ;;
      esac
    done
  done

```
```python Python
import anthropic

client = anthropic.Anthropic()

# Diffuse le fichier de résultats en chunks efficaces en mémoire, en traitant un à la fois
for result in client.messages.batches.results(
    "msgbatch_01HkcTjaV5uDC8jWR4ZsDV8d",
):
    match result.result.type:
        case "succeeded":
            print(f"Success! {result.custom_id}")
        case "errored":
            if result.result.error.type == "invalid_request":
                # Request body must be fixed before re-sending request
                print(f"Validation error {result.custom_id}")
            else:
                # Request can be retried directly
                print(f"Server error {result.custom_id}")
        case "expired":
            print(f"Request expired {result.custom_id}")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

// Diffuse le fichier de résultats en chunks efficaces en mémoire, en traitant un à la fois
for await (const result of await anthropic.messages.batches.results(
    "msgbatch_01HkcTjaV5uDC8jWR4ZsDV8d"
)) {
  switch (result.result.type) {
    case 'succeeded':
      console.log(`Success! ${result.custom_id}`);
      break;
    case 'errored':
      if (result.result.error.type == "invalid_request") {
        // Request body must be fixed before re-sending request
        console.log(`Validation error: ${result.custom_id}`);
      } else {
        // Request can be retried directly
        console.log(`Server error: ${result.custom_id}`);
      }
      break;
    case 'expired':
      console.log(`Request expired: ${result.custom_id}`);
      break;
  }
}
```

```java Java
import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.http.StreamResponse;
import com.anthropic.models.messages.batches.MessageBatchIndividualResponse;
import com.anthropic.models.messages.batches.BatchResultsParams;

public class BatchResultsExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Diffuse le fichier de résultats en chunks efficaces en mémoire, en traitant un à la fois
        try (StreamResponse<MessageBatchIndividualResponse> streamResponse = client.messages()
                .batches()
                .resultsStreaming(
                        BatchResultsParams.builder()
                                .messageBatchId("msgbatch_01HkcTjaV5uDC8jWR4ZsDV8d")
                                .build())) {

            streamResponse.stream().forEach(result -> {
                if (result.result().isSucceeded()) {
                    System.out.println("Success! " + result.customId());
                } else if (result.result().isErrored()) {
                    if (result.result().asErrored().error().error().isInvalidRequestError()) {
                        // Request body must be fixed before re-sending request
                        System.out.println("Validation error: " + result.customId());
                    } else {
                        // Request can be retried directly
                        System.out.println("Server error: " + result.customId());
                    }
                } else if (result.result().isExpired()) {
                    System.out.println("Request expired: " + result.customId());
                }
            });
        }
    }
}
```

</CodeGroup>

Les résultats seront au format `.jsonl`, où chaque ligne est un objet JSON valide représentant le résultat d'une seule requête dans le Message Batch. Pour chaque résultat diffusé, vous pouvez faire quelque chose de différent selon son `custom_id` et son type de résultat. Voici un exemple d'ensemble de résultats :

```json .jsonl file
{"custom_id":"my-second-request","result":{"type":"succeeded","message":{"id":"msg_014VwiXbi91y3JMjcpyGBHX5","type":"message","role":"assistant","model":"claude-sonnet-4-5-20250929","content":[{"type":"text","text":"Hello again! It's nice to see you. How can I assist you today? Is there anything specific you'd like to chat about or any questions you have?"}],"stop_reason":"end_turn","stop_sequence":null,"usage":{"input_tokens":11,"output_tokens":36}}}}
{"custom_id":"my-first-request","result":{"type":"succeeded","message":{"id":"msg_01FqfsLoHwgeFbguDgpz48m7","type":"message","role":"assistant","model":"claude-sonnet-4-5-20250929","content":[{"type":"text","text":"Hello! How can I assist you today? Feel free to ask me any questions or let me know if there's anything you'd like to chat about."}],"stop_reason":"end_turn","stop_sequence":null,"usage":{"input_tokens":10,"output_tokens":34}}}}
```

Si votre résultat a une erreur, son `result.error` sera défini sur notre [forme d'erreur](/docs/fr/api/errors#error-shapes) standard.

<Tip>
  **Les résultats des lots peuvent ne pas correspondre à l'ordre d'entrée**

Les résultats des lots peuvent être renvoyés dans n'importe quel ordre et peuvent ne pas correspondre à l'ordre des requêtes lors de la création du lot. Dans l'exemple ci-dessus, le résultat de la deuxième requête du lot est renvoyé avant le premier. Pour faire correspondre correctement les résultats à leurs requêtes correspondantes, utilisez toujours le champ `custom_id`.
</Tip>

### Annulation d'un Message Batch

Vous pouvez annuler un Message Batch qui est actuellement en traitement en utilisant le [point de terminaison d'annulation](/docs/fr/api/canceling-message-batches). Immédiatement après l'annulation, le `processing_status` d'un lot sera `canceling`. Vous pouvez utiliser la même technique d'interrogation décrite ci-dessus pour attendre que l'annulation soit finalisée. Les lots annulés se terminent avec un statut de `ended` et peuvent contenir des résultats partiels pour les requêtes qui ont été traitées avant l'annulation.

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

message_batch = client.messages.batches.cancel(
    MESSAGE_BATCH_ID,
)
print(message_batch)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const messageBatch = await anthropic.messages.batches.cancel(
    MESSAGE_BATCH_ID
);
console.log(messageBatch);
```

```bash Shell
#!/bin/sh
curl --request POST https://api.anthropic.com/v1/messages/batches/$MESSAGE_BATCH_ID/cancel \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01"
```

```java Java
import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.batches.*;

public class BatchCancelExample {
    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        MessageBatch messageBatch = client.messages().batches().cancel(
                BatchCancelParams.builder()
                        .messageBatchId(MESSAGE_BATCH_ID)
                        .build()
        );
        System.out.println(messageBatch);
    }
}
```
</CodeGroup>

La réponse affichera le lot dans un état `canceling` :

```json JSON
{
  "id": "msgbatch_013Zva2CMHLNnXjNJJKqJ2EF",
  "type": "message_batch",
  "processing_status": "canceling",
  "request_counts": {
    "processing": 2,
    "succeeded": 0,
    "errored": 0,
    "canceled": 0,
    "expired": 0
  },
  "ended_at": null,
  "created_at": "2024-09-24T18:37:24.100435Z",
  "expires_at": "2024-09-25T18:37:24.100435Z",
  "cancel_initiated_at": "2024-09-24T18:39:03.114875Z",
  "results_url": null
}
```

### Utilisation de la mise en cache des invites avec Message Batches

L'API Message Batches prend en charge la mise en cache des invites, ce qui vous permet de réduire potentiellement les coûts et le temps de traitement pour les demandes par lot. Les remises tarifaires de la mise en cache des invites et de Message Batches peuvent s'accumuler, offrant des économies de coûts encore plus importantes lorsque les deux fonctionnalités sont utilisées ensemble. Cependant, comme les demandes par lot sont traitées de manière asynchrone et concurrente, les accès au cache sont fournis sur la base du meilleur effort. Les utilisateurs connaissent généralement des taux d'accès au cache allant de 30 % à 98 %, selon leurs modèles de trafic.

Pour maximiser la probabilité d'accès au cache dans vos demandes par lot :

1. Incluez des blocs `cache_control` identiques dans chaque demande Message au sein de votre lot
2. Maintenez un flux régulier de demandes pour empêcher les entrées du cache d'expirer après leur durée de vie de 5 minutes
3. Structurez vos demandes pour partager autant de contenu mis en cache que possible

Exemple d'implémentation de la mise en cache des invites dans un lot :

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages/batches \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "requests": [
        {
            "custom_id": "my-first-request",
            "params": {
                "model": "claude-sonnet-4-5",
                "max_tokens": 1024,
                "system": [
                    {
                        "type": "text",
                        "text": "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n"
                    },
                    {
                        "type": "text",
                        "text": "<the entire contents of Pride and Prejudice>",
                        "cache_control": {"type": "ephemeral"}
                    }
                ],
                "messages": [
                    {"role": "user", "content": "Analyze the major themes in Pride and Prejudice."}
                ]
            }
        },
        {
            "custom_id": "my-second-request",
            "params": {
                "model": "claude-sonnet-4-5",
                "max_tokens": 1024,
                "system": [
                    {
                        "type": "text",
                        "text": "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n"
                    },
                    {
                        "type": "text",
                        "text": "<the entire contents of Pride and Prejudice>",
                        "cache_control": {"type": "ephemeral"}
                    }
                ],
                "messages": [
                    {"role": "user", "content": "Write a summary of Pride and Prejudice."}
                ]
            }
        }
    ]
}'
```

```python Python
import anthropic
from anthropic.types.message_create_params import MessageCreateParamsNonStreaming
from anthropic.types.messages.batch_create_params import Request

client = anthropic.Anthropic()

message_batch = client.messages.batches.create(
    requests=[
        Request(
            custom_id="my-first-request",
            params=MessageCreateParamsNonStreaming(
                model="claude-sonnet-4-5",
                max_tokens=1024,
                system=[
                    {
                        "type": "text",
                        "text": "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n"
                    },
                    {
                        "type": "text",
                        "text": "<the entire contents of Pride and Prejudice>",
                        "cache_control": {"type": "ephemeral"}
                    }
                ],
                messages=[{
                    "role": "user",
                    "content": "Analyze the major themes in Pride and Prejudice."
                }]
            )
        ),
        Request(
            custom_id="my-second-request",
            params=MessageCreateParamsNonStreaming(
                model="claude-sonnet-4-5",
                max_tokens=1024,
                system=[
                    {
                        "type": "text",
                        "text": "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n"
                    },
                    {
                        "type": "text",
                        "text": "<the entire contents of Pride and Prejudice>",
                        "cache_control": {"type": "ephemeral"}
                    }
                ],
                messages=[{
                    "role": "user",
                    "content": "Write a summary of Pride and Prejudice."
                }]
            )
        )
    ]
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const messageBatch = await anthropic.messages.batches.create({
  requests: [{
    custom_id: "my-first-request",
    params: {
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      system: [
        {
          type: "text",
          text: "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n"
        },
        {
          type: "text",
          text: "<the entire contents of Pride and Prejudice>",
          cache_control: {type: "ephemeral"}
        }
      ],
      messages: [
        {"role": "user", "content": "Analyze the major themes in Pride and Prejudice."}
      ]
    }
  }, {
    custom_id: "my-second-request",
    params: {
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      system: [
        {
          type: "text",
          text: "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n"
        },
        {
          type: "text",
          text: "<the entire contents of Pride and Prejudice>",
          cache_control: {type: "ephemeral"}
        }
      ],
      messages: [
        {"role": "user", "content": "Write a summary of Pride and Prejudice."}
      ]
    }
  }]
});
```

```java Java
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;
import com.anthropic.models.messages.batches.*;

public class BatchExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        BatchCreateParams createParams = BatchCreateParams.builder()
                .addRequest(BatchCreateParams.Request.builder()
                        .customId("my-first-request")
                        .params(BatchCreateParams.Request.Params.builder()
                                .model(Model.CLAUDE_OPUS_4_0)
                                .maxTokens(1024)
                                .systemOfTextBlockParams(List.of(
                                        TextBlockParam.builder()
                                                .text("You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n")
                                                .build(),
                                        TextBlockParam.builder()
                                                .text("<the entire contents of Pride and Prejudice>")
                                                .cacheControl(CacheControlEphemeral.builder().build())
                                                .build()
                                ))
                                .addUserMessage("Analyze the major themes in Pride and Prejudice.")
                                .build())
                        .build())
                .addRequest(BatchCreateParams.Request.builder()
                        .customId("my-second-request")
                        .params(BatchCreateParams.Request.Params.builder()
                                .model(Model.CLAUDE_OPUS_4_0)
                                .maxTokens(1024)
                                .systemOfTextBlockParams(List.of(
                                        TextBlockParam.builder()
                                                .text("You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n")
                                                .build(),
                                        TextBlockParam.builder()
                                                .text("<the entire contents of Pride and Prejudice>")
                                                .cacheControl(CacheControlEphemeral.builder().build())
                                                .build()
                                ))
                                .addUserMessage("Write a summary of Pride and Prejudice.")
                                .build())
                        .build())
                .build();

        MessageBatch messageBatch = client.messages().batches().create(createParams);
    }
}
```

</CodeGroup>

Dans cet exemple, les deux demandes du lot incluent des messages système identiques et le texte complet de Pride and Prejudice marqué avec `cache_control` pour augmenter la probabilité d'accès au cache.

### Meilleures pratiques pour un traitement par lot efficace

Pour tirer le meilleur parti de l'API Batches :

- Surveillez régulièrement l'état du traitement par lot et implémentez une logique de nouvelle tentative appropriée pour les demandes échouées.
- Utilisez des valeurs `custom_id` significatives pour faire correspondre facilement les résultats aux demandes, car l'ordre n'est pas garanti.
- Envisagez de diviser les très grands ensembles de données en plusieurs lots pour une meilleure gérabilité.
- Effectuez un essai à blanc d'une seule forme de demande avec l'API Messages pour éviter les erreurs de validation.

### Dépannage des problèmes courants

En cas de comportement inattendu :

- Vérifiez que la taille totale de la demande par lot ne dépasse pas 256 Mo. Si la taille de la demande est trop grande, vous pouvez obtenir une erreur 413 `request_too_large`.
- Vérifiez que vous utilisez des [modèles pris en charge](#supported-models) pour toutes les demandes du lot.
- Assurez-vous que chaque demande du lot a un `custom_id` unique.
- Assurez-vous qu'il s'est écoulé moins de 29 jours depuis le moment du `created_at` du lot (pas du temps `ended_at` du traitement). Si plus de 29 jours se sont écoulés, les résultats ne seront plus visibles.
- Confirmez que le lot n'a pas été annulé.

Notez que l'échec d'une demande dans un lot n'affecte pas le traitement des autres demandes.

---
## Stockage et confidentialité des lots

- **Isolation de l'espace de travail** : Les lots sont isolés dans l'espace de travail dans lequel ils sont créés. Ils ne peuvent être accessibles que par les clés API associées à cet espace de travail, ou par les utilisateurs ayant la permission de consulter les lots de l'espace de travail dans la Console.

- **Disponibilité des résultats** : Les résultats des lots sont disponibles pendant 29 jours après la création du lot, ce qui laisse amplement de temps pour la récupération et le traitement.

---
## FAQ

  <section title="Combien de temps faut-il pour traiter un lot ?">

    Les lots peuvent prendre jusqu'à 24 heures pour être traités, mais beaucoup se termineront plus tôt. Le temps de traitement réel dépend de la taille du lot, de la demande actuelle et de votre volume de demandes. Il est possible qu'un lot expire et ne se termine pas dans les 24 heures.
  
</section>

  <section title="L'API Batches est-elle disponible pour tous les modèles ?">

    Voir [ci-dessus](#supported-models) pour la liste des modèles pris en charge.
  
</section>

  <section title="Puis-je utiliser l'API Message Batches avec d'autres fonctionnalités de l'API ?">

    Oui, l'API Message Batches prend en charge toutes les fonctionnalités disponibles dans l'API Messages, y compris les fonctionnalités bêta. Cependant, la diffusion en continu n'est pas prise en charge pour les demandes par lot.
  
</section>

  <section title="Comment l'API Message Batches affecte-t-elle la tarification ?">

    L'API Message Batches offre une réduction de 50 % sur tous les usages par rapport aux prix standard de l'API. Cela s'applique aux jetons d'entrée, aux jetons de sortie et à tous les jetons spéciaux. Pour plus d'informations sur la tarification, visitez notre [page de tarification](https://claude.com/pricing#anthropic-api).
  
</section>

  <section title="Puis-je mettre à jour un lot après sa soumission ?">

    Non, une fois qu'un lot a été soumis, il ne peut pas être modifié. Si vous devez apporter des modifications, vous devez annuler le lot actuel et en soumettre un nouveau. Notez que l'annulation peut ne pas prendre effet immédiatement.
  
</section>

  <section title="Y a-t-il des limites de débit pour l'API Message Batches et interagissent-elles avec les limites de débit de l'API Messages ?">

    L'API Message Batches a des limites de débit basées sur les requêtes HTTP en plus des limites sur le nombre de demandes nécessitant un traitement. Voir [Limites de débit de l'API Message Batches](/docs/fr/api/rate-limits#message-batches-api). L'utilisation de l'API Batches n'affecte pas les limites de débit de l'API Messages.
  
</section>

  <section title="Comment gérer les erreurs dans mes demandes par lot ?">

    Lorsque vous récupérez les résultats, chaque demande aura un champ `result` indiquant si elle a `succeeded`, `errored`, a été `canceled`, ou a `expired`. Pour les résultats `errored`, des informations d'erreur supplémentaires seront fournies. Consultez l'objet de réponse d'erreur dans la [référence API](/docs/fr/api/creating-message-batches).
  
</section>

  <section title="Comment l'API Message Batches gère-t-elle la confidentialité et la séparation des données ?">

    L'API Message Batches est conçue avec des mesures fortes de confidentialité et de séparation des données :

    1. Les lots et leurs résultats sont isolés dans l'espace de travail dans lequel ils ont été créés. Cela signifie qu'ils ne peuvent être accessibles que par les clés API du même espace de travail.
    2. Chaque demande au sein d'un lot est traitée indépendamment, sans fuite de données entre les demandes.
    3. Les résultats ne sont disponibles que pendant une durée limitée (29 jours) et suivent notre [politique de rétention des données](https://support.claude.com/en/articles/7996866-how-long-do-you-store-personal-data).
    4. Le téléchargement des résultats des lots dans la Console peut être désactivé au niveau de l'organisation ou par espace de travail.
  
</section>

  <section title="Puis-je utiliser la mise en cache des invites dans l'API Message Batches ?">

    Oui, il est possible d'utiliser la mise en cache des invites avec l'API Message Batches. Cependant, comme les demandes par lot asynchrones peuvent être traitées simultanément et dans n'importe quel ordre, les accès au cache sont fournis sur la base du meilleur effort.
  
</section>