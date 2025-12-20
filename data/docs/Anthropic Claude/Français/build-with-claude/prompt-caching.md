# Mise en cache des invites

La mise en cache des invites est une fonctionnalité puissante qui optimise votre utilisation de l'API en vous permettant de reprendre à partir de préfixes spécifiques dans vos invites.

---

La mise en cache des invites est une fonctionnalité puissante qui optimise votre utilisation de l'API en vous permettant de reprendre à partir de préfixes spécifiques dans vos invites. Cette approche réduit considérablement le temps de traitement et les coûts pour les tâches répétitives ou les invites avec des éléments cohérents.

Voici un exemple de la façon d'implémenter la mise en cache des invites avec l'API Messages en utilisant un bloc `cache_control` :

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
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
      {
        "role": "user",
        "content": "Analyze the major themes in Pride and Prejudice."
      }
    ]
  }'

# Call the model again with the same inputs up to the cache checkpoint
curl https://api.anthropic.com/v1/messages # rest of input
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    system=[
      {
        "type": "text",
        "text": "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n",
      },
      {
        "type": "text",
        "text": "<the entire contents of 'Pride and Prejudice'>",
        "cache_control": {"type": "ephemeral"}
      }
    ],
    messages=[{"role": "user", "content": "Analyze the major themes in 'Pride and Prejudice'."}],
)
print(response.usage.model_dump_json())

# Call the model again with the same inputs up to the cache checkpoint
response = client.messages.create(.....)
print(response.usage.model_dump_json())
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  system: [
    {
      type: "text",
      text: "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n",
    },
    {
      type: "text",
      text: "<the entire contents of 'Pride and Prejudice'>",
      cache_control: { type: "ephemeral" }
    }
  ],
  messages: [
    {
      role: "user",
      content: "Analyze the major themes in 'Pride and Prejudice'."
    }
  ]
});
console.log(response.usage);

// Call the model again with the same inputs up to the cache checkpoint
const new_response = await client.messages.create(...)
console.log(new_response.usage);
```

```java Java
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;

public class PromptCachingExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                .systemOfTextBlockParams(List.of(
                        TextBlockParam.builder()
                                .text("You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n")
                                .build(),
                        TextBlockParam.builder()
                                .text("<the entire contents of 'Pride and Prejudice'>")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build()
                ))
                .addUserMessage("Analyze the major themes in 'Pride and Prejudice'.")
                .build();

        Message message = client.messages().create(params);
        System.out.println(message.usage());
    }
}
```
</CodeGroup>

```json JSON
{"cache_creation_input_tokens":188086,"cache_read_input_tokens":0,"input_tokens":21,"output_tokens":393}
{"cache_creation_input_tokens":0,"cache_read_input_tokens":188086,"input_tokens":21,"output_tokens":393}
```

Dans cet exemple, l'intégralité du texte de « Pride and Prejudice » est mise en cache à l'aide du paramètre `cache_control`. Cela permet de réutiliser ce texte volumineux sur plusieurs appels API sans le retraiter à chaque fois. La modification uniquement du message utilisateur vous permet de poser diverses questions sur le livre tout en utilisant le contenu mis en cache, ce qui entraîne des réponses plus rapides et une meilleure efficacité.

---

## Comment fonctionne la mise en cache des invites

Lorsque vous envoyez une demande avec la mise en cache des invites activée :

1. Le système vérifie si un préfixe d'invite, jusqu'à un point de rupture de cache spécifié, est déjà mis en cache à partir d'une requête récente.
2. S'il est trouvé, il utilise la version mise en cache, réduisant le temps de traitement et les coûts.
3. Sinon, il traite l'invite complète et met en cache le préfixe une fois que la réponse commence.

Ceci est particulièrement utile pour :
- Les invites avec de nombreux exemples
- De grandes quantités de contexte ou d'informations d'arrière-plan
- Les tâches répétitives avec des instructions cohérentes
- Les longues conversations multi-tours

Par défaut, le cache a une durée de vie de 5 minutes. Le cache est actualisé sans frais supplémentaires chaque fois que le contenu mis en cache est utilisé.

<Note>
Si vous trouvez que 5 minutes est trop court, Anthropic propose également une durée de cache d'1 heure [à un coût supplémentaire](#pricing).

Pour plus d'informations, consultez [Durée de cache d'1 heure](#1-hour-cache-duration).
</Note>

<Tip>
  **La mise en cache des invites met en cache le préfixe complet**

La mise en cache des invites référence l'invite complète - `tools`, `system` et `messages` (dans cet ordre) jusqu'à et y compris le bloc désigné avec `cache_control`.

</Tip>

---
## Tarification

La mise en cache des invites introduit une nouvelle structure tarifaire. Le tableau ci-dessous montre le prix par million de jetons pour chaque modèle pris en charge :

| Model             | Base Input Tokens | 5m Cache Writes | 1h Cache Writes | Cache Hits & Refreshes | Output Tokens |
|-------------------|-------------------|-----------------|-----------------|----------------------|---------------|
| Claude Opus 4.5   | $5 / MTok         | $6.25 / MTok    | $10 / MTok      | $0.50 / MTok | $25 / MTok    |
| Claude Opus 4.1   | $15 / MTok        | $18.75 / MTok   | $30 / MTok      | $1.50 / MTok | $75 / MTok    |
| Claude Opus 4     | $15 / MTok        | $18.75 / MTok   | $30 / MTok      | $1.50 / MTok | $75 / MTok    |
| Claude Sonnet 4.5   | $3 / MTok         | $3.75 / MTok    | $6 / MTok       | $0.30 / MTok | $15 / MTok    |
| Claude Sonnet 4   | $3 / MTok         | $3.75 / MTok    | $6 / MTok       | $0.30 / MTok | $15 / MTok    |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations)) | $3 / MTok         | $3.75 / MTok    | $6 / MTok       | $0.30 / MTok | $15 / MTok    |
| Claude Haiku 4.5  | $1 / MTok         | $1.25 / MTok    | $2 / MTok       | $0.10 / MTok | $5 / MTok     |
| Claude Haiku 3.5  | $0.80 / MTok      | $1 / MTok       | $1.6 / MTok     | $0.08 / MTok | $4 / MTok     |
| Claude Opus 3 ([deprecated](/docs/en/about-claude/model-deprecations))    | $15 / MTok        | $18.75 / MTok   | $30 / MTok      | $1.50 / MTok | $75 / MTok    |
| Claude Haiku 3    | $0.25 / MTok      | $0.30 / MTok    | $0.50 / MTok    | $0.03 / MTok | $1.25 / MTok  |

<Note>
Le tableau ci-dessus reflète les multiplicateurs de tarification suivants pour la mise en cache des invites :
- Les jetons d'écriture de cache de 5 minutes coûtent 1,25 fois le prix des jetons d'entrée de base
- Les jetons d'écriture de cache d'1 heure coûtent 2 fois le prix des jetons d'entrée de base
- Les jetons de lecture de cache coûtent 0,1 fois le prix des jetons d'entrée de base
</Note>

---
## Comment implémenter la mise en cache des invites

### Modèles pris en charge

La mise en cache des invites est actuellement prise en charge sur :
- Claude Opus 4.5
- Claude Opus 4.1
- Claude Opus 4
- Claude Sonnet 4.5
- Claude Sonnet 4
- Claude Sonnet 3.7 ([déprécié](/docs/fr/about-claude/model-deprecations))
- Claude Haiku 4.5
- Claude Haiku 3.5
- Claude Haiku 3
- Claude Opus 3 ([déprécié](/docs/fr/about-claude/model-deprecations))

### Structurer votre invite

Placez le contenu statique (définitions d'outils, instructions système, contexte, exemples) au début de votre invite. Marquez la fin du contenu réutilisable pour la mise en cache à l'aide du paramètre `cache_control`.

Les préfixes de cache sont créés dans l'ordre suivant : `tools`, `system`, puis `messages`. Cet ordre forme une hiérarchie où chaque niveau s'appuie sur les précédents.

#### Comment fonctionne la vérification automatique des préfixes

Vous pouvez utiliser un seul point de rupture de cache à la fin de votre contenu statique, et le système trouvera automatiquement la plus longue séquence de blocs mis en cache correspondants. Comprendre comment cela fonctionne vous aide à optimiser votre stratégie de mise en cache.

**Trois principes fondamentaux :**

1. **Les clés de cache sont cumulatives** : Lorsque vous mettez explicitement en cache un bloc avec `cache_control`, la clé de hachage du cache est générée en hachant tous les blocs précédents dans la conversation de manière séquentielle. Cela signifie que le cache pour chaque bloc dépend de tout le contenu qui l'a précédé.

2. **Vérification séquentielle rétroactive** : Le système vérifie les accès au cache en travaillant à rebours à partir de votre point de rupture explicite, en vérifiant chaque bloc précédent dans l'ordre inverse. Cela garantit que vous obtenez le plus long accès au cache possible.

3. **Fenêtre de rétroaction de 20 blocs** : Le système ne vérifie que jusqu'à 20 blocs avant chaque point de rupture `cache_control` explicite. Après avoir vérifié 20 blocs sans correspondance, il arrête la vérification et passe au point de rupture explicite suivant (le cas échéant).

**Exemple : Comprendre la fenêtre de rétroaction**

Considérez une conversation avec 30 blocs de contenu où vous définissez `cache_control` uniquement sur le bloc 30 :

- **Si vous envoyez le bloc 31 sans modifications aux blocs précédents** : Le système vérifie le bloc 30 (correspondance !). Vous obtenez un accès au cache au bloc 30, et seul le bloc 31 nécessite un traitement.

- **Si vous modifiez le bloc 25 et envoyez le bloc 31** : Le système vérifie à rebours du bloc 30 → 29 → 28... → 25 (pas de correspondance) → 24 (correspondance !). Puisque le bloc 24 n'a pas changé, vous obtenez un accès au cache au bloc 24, et seuls les blocs 25-30 nécessitent un retraitement.

- **Si vous modifiez le bloc 5 et envoyez le bloc 31** : Le système vérifie à rebours du bloc 30 → 29 → 28... → 11 (vérification #20). Après 20 vérifications sans trouver de correspondance, il arrête la recherche. Puisque le bloc 5 est au-delà de la fenêtre de 20 blocs, aucun accès au cache ne se produit et tous les blocs nécessitent un retraitement. Cependant, si vous aviez défini un point de rupture `cache_control` explicite sur le bloc 5, le système continuerait à vérifier à partir de ce point de rupture : bloc 5 (pas de correspondance) → bloc 4 (correspondance !). Cela permet un accès au cache au bloc 4, démontrant pourquoi vous devriez placer des points de rupture avant le contenu modifiable.

**Point clé** : Définissez toujours un point de rupture de cache explicite à la fin de votre conversation pour maximiser vos chances d'accès au cache. De plus, définissez des points de rupture juste avant les blocs de contenu qui pourraient être modifiables pour garantir que ces sections peuvent être mises en cache indépendamment.

#### Quand utiliser plusieurs points de rupture

Vous pouvez définir jusqu'à 4 points de rupture de cache si vous souhaitez :
- Mettre en cache différentes sections qui changent à des fréquences différentes (par exemple, les outils changent rarement, mais le contexte se met à jour quotidiennement)
- Avoir plus de contrôle sur exactement ce qui est mis en cache
- Assurer la mise en cache du contenu plus de 20 blocs avant votre point de rupture final
- Placer des points de rupture avant le contenu modifiable pour garantir les accès au cache même lorsque des modifications se produisent au-delà de la fenêtre de 20 blocs

<Note>
**Limitation importante** : Si votre invite a plus de 20 blocs de contenu avant votre point de rupture de cache, et que vous modifiez le contenu plus tôt que ces 20 blocs, vous n'obtiendrez pas d'accès au cache à moins d'ajouter des points de rupture explicites supplémentaires plus proches de ce contenu.
</Note>

### Limitations du cache
La longueur minimale d'invite pouvant être mise en cache est :
- 4096 jetons pour Claude Opus 4.5
- 1024 jetons pour Claude Opus 4.1, Claude Opus 4, Claude Sonnet 4.5, Claude Sonnet 4, Claude Sonnet 3.7 ([déprécié](/docs/fr/about-claude/model-deprecations)) et Claude Opus 3 ([déprécié](/docs/fr/about-claude/model-deprecations))
- 4096 jetons pour Claude Haiku 4.5
- 2048 jetons pour Claude Haiku 3.5 et Claude Haiku 3

Les invites plus courtes ne peuvent pas être mises en cache, même si elles sont marquées avec `cache_control`. Toute demande de mise en cache de moins que ce nombre de jetons sera traitée sans mise en cache. Pour voir si une invite a été mise en cache, consultez les [champs](/docs/fr/build-with-claude/prompt-caching#tracking-cache-performance) d'utilisation de la réponse.

Pour les demandes simultanées, notez qu'une entrée de cache ne devient disponible qu'après le début de la première réponse. Si vous avez besoin d'accès au cache pour les demandes parallèles, attendez la première réponse avant d'envoyer les demandes suivantes.

Actuellement, « ephemeral » est le seul type de cache pris en charge, qui a par défaut une durée de vie de 5 minutes.

### Comprendre les coûts des points de rupture de cache

**Les points de rupture de cache eux-mêmes n'ajoutent aucun coût.** Vous êtes facturé uniquement pour :
- **Écritures de cache** : Lorsque du nouveau contenu est écrit dans le cache (25 % de plus que les jetons d'entrée de base pour TTL de 5 minutes)
- **Lectures de cache** : Lorsque le contenu mis en cache est utilisé (10 % du prix des jetons d'entrée de base)
- **Jetons d'entrée réguliers** : Pour tout contenu non mis en cache

L'ajout de plus de points de rupture `cache_control` n'augmente pas vos coûts - vous payez toujours le même montant en fonction du contenu réellement mis en cache et lu. Les points de rupture vous donnent simplement le contrôle sur les sections qui peuvent être mises en cache indépendamment.

### Ce qui peut être mis en cache
La plupart des blocs de la demande peuvent être désignés pour la mise en cache avec `cache_control`. Cela inclut :

- Outils : Définitions d'outils dans le tableau `tools`
- Messages système : Blocs de contenu dans le tableau `system`
- Messages texte : Blocs de contenu dans le tableau `messages.content`, pour les tours utilisateur et assistant
- Images et documents : Blocs de contenu dans le tableau `messages.content`, dans les tours utilisateur
- Utilisation d'outils et résultats d'outils : Blocs de contenu dans le tableau `messages.content`, dans les tours utilisateur et assistant

Chacun de ces éléments peut être marqué avec `cache_control` pour activer la mise en cache pour cette partie de la demande.

### Ce qui ne peut pas être mis en cache
Bien que la plupart des blocs de demande puissent être mis en cache, il y a quelques exceptions :

- Les blocs de réflexion ne peuvent pas être mis en cache directement avec `cache_control`. Cependant, les blocs de réflexion PEUVENT être mis en cache avec d'autres contenus lorsqu'ils apparaissent dans les tours d'assistant précédents. Lorsqu'ils sont mis en cache de cette façon, ils COMPTENT comme des jetons d'entrée lorsqu'ils sont lus à partir du cache.
- Les blocs de sous-contenu (comme les [citations](/docs/fr/build-with-claude/citations)) eux-mêmes ne peuvent pas être mis en cache directement. À la place, mettez en cache le bloc de niveau supérieur.

    Dans le cas des citations, les blocs de contenu de document de niveau supérieur qui servent de matériel source pour les citations peuvent être mis en cache. Cela vous permet d'utiliser la mise en cache des invites avec les citations efficacement en mettant en cache les documents que les citations référenceront.
- Les blocs de texte vides ne peuvent pas être mis en cache.

### Ce qui invalide le cache

Les modifications du contenu mis en cache peuvent invalider une partie ou la totalité du cache.

Comme décrit dans [Structurer votre invite](#structuring-your-prompt), le cache suit la hiérarchie : `tools` → `system` → `messages`. Les modifications à chaque niveau invalident ce niveau et tous les niveaux suivants.

Le tableau suivant montre quelles parties du cache sont invalidées par différents types de modifications. ✘ indique que le cache est invalidé, tandis que ✓ indique que le cache reste valide.

| Ce qui change | Cache des outils | Cache système | Cache des messages | Impact |
|------------|------------------|---------------|----------------|-------------|
| **Définitions d'outils** | ✘ | ✘ | ✘ | La modification des définitions d'outils (noms, descriptions, paramètres) invalide l'intégralité du cache |
| **Basculement de recherche Web** | ✓ | ✘ | ✘ | L'activation/désactivation de la recherche Web modifie l'invite système |
| **Basculement des citations** | ✓ | ✘ | ✘ | L'activation/désactivation des citations modifie l'invite système |
| **Choix d'outil** | ✓ | ✓ | ✘ | Les modifications du paramètre `tool_choice` affectent uniquement les blocs de messages |
| **Images** | ✓ | ✓ | ✘ | L'ajout/suppression d'images n'importe où dans l'invite affecte les blocs de messages |
| **Paramètres de réflexion** | ✓ | ✓ | ✘ | Les modifications des paramètres de réflexion étendue (activation/désactivation, budget) affectent les blocs de messages |
| **Résultats non-outils transmis aux demandes de réflexion étendue** | ✓ | ✓ | ✘ | Lorsque des résultats non-outils sont transmis dans les demandes avec la réflexion étendue activée, tous les blocs de réflexion précédemment mis en cache sont supprimés du contexte, et tous les messages dans le contexte qui suivent ces blocs de réflexion sont supprimés du cache. Pour plus de détails, consultez [Mise en cache avec blocs de réflexion](#caching-with-thinking-blocks). |

### Suivi des performances du cache

Surveillez les performances du cache à l'aide de ces champs de réponse API, dans `usage` dans la réponse (ou événement `message_start` si [streaming](/docs/fr/build-with-claude/streaming)) :

- `cache_creation_input_tokens` : Nombre de jetons écrits dans le cache lors de la création d'une nouvelle entrée.
- `cache_read_input_tokens` : Nombre de jetons récupérés du cache pour cette demande.
- `input_tokens` : Nombre de jetons d'entrée qui n'ont pas été lus ou utilisés pour créer un cache (c'est-à-dire les jetons après le dernier point de rupture de cache).

<Note>
**Comprendre la répartition des jetons**

Le champ `input_tokens` représente uniquement les jetons qui viennent **après le dernier point de rupture de cache** dans votre demande - pas tous les jetons d'entrée que vous avez envoyés.

Pour calculer le total des jetons d'entrée :
```
total_input_tokens = cache_read_input_tokens + cache_creation_input_tokens + input_tokens
```

**Explication spatiale :**
- `cache_read_input_tokens` = jetons avant le point de rupture déjà mis en cache (lectures)
- `cache_creation_input_tokens` = jetons avant le point de rupture en cours de mise en cache maintenant (écritures)
- `input_tokens` = jetons après votre dernier point de rupture (non éligibles pour le cache)

**Exemple :** Si vous avez une demande avec 100 000 jetons de contenu mis en cache (lus à partir du cache), 0 jetons de nouveau contenu en cours de mise en cache, et 50 jetons dans votre message utilisateur (après le point de rupture de cache) :
- `cache_read_input_tokens` : 100 000
- `cache_creation_input_tokens` : 0
- `input_tokens` : 50
- **Total des jetons d'entrée traités** : 100 050 jetons

C'est important pour comprendre à la fois les coûts et les limites de débit, car `input_tokens` sera généralement beaucoup plus petit que votre entrée totale lors de l'utilisation efficace de la mise en cache.
</Note>

### Meilleures pratiques pour une mise en cache efficace

Pour optimiser les performances de la mise en cache des invites :

- Mettez en cache le contenu stable et réutilisable comme les instructions système, les informations d'arrière-plan, les grands contextes ou les définitions d'outils fréquentes.
- Placez le contenu mis en cache au début de l'invite pour de meilleures performances.
- Utilisez les points de rupture de cache de manière stratégique pour séparer différentes sections de préfixe pouvant être mises en cache.
- Définissez les points de rupture de cache à la fin des conversations et juste avant le contenu modifiable pour maximiser les taux d'accès au cache, en particulier lorsque vous travaillez avec des invites qui ont plus de 20 blocs de contenu.
- Analysez régulièrement les taux d'accès au cache et ajustez votre stratégie selon les besoins.

### Optimisation pour différents cas d'utilisation

Adaptez votre stratégie de mise en cache des invites à votre scénario :

- Agents conversationnels : Réduisez le coût et la latence pour les conversations prolongées, en particulier celles avec de longues instructions ou des documents téléchargés.
- Assistants de codage : Améliorez l'autocomplétion et les questions-réponses sur la base de code en gardant les sections pertinentes ou une version résumée de la base de code dans l'invite.
- Traitement de documents volumineux : Incorporez du matériel long complet, y compris des images, dans votre invite sans augmenter la latence de réponse.
- Ensembles d'instructions détaillées : Partagez des listes extensives d'instructions, de procédures et d'exemples pour affiner les réponses de Claude. Les développeurs incluent souvent un ou deux exemples dans l'invite, mais avec la mise en cache des invites, vous pouvez obtenir des performances encore meilleures en incluant 20+ exemples divers de réponses de haute qualité.
- Utilisation d'outils agentiques : Améliorez les performances pour les scénarios impliquant plusieurs appels d'outils et des modifications de code itératives, où chaque étape nécessite généralement un nouvel appel API.
- Parlez à des livres, des articles, de la documentation, des transcriptions de podcasts et d'autres contenus longs : Donnez vie à n'importe quelle base de connaissances en intégrant l'intégralité du ou des documents dans l'invite, et laissez les utilisateurs lui poser des questions.

### Dépannage des problèmes courants

Si vous rencontrez un comportement inattendu :

- Assurez-vous que les sections mises en cache sont identiques et marquées avec cache_control aux mêmes emplacements sur tous les appels
- Vérifiez que les appels sont effectués dans la durée de vie du cache (5 minutes par défaut)
- Vérifiez que `tool_choice` et l'utilisation des images restent cohérents entre les appels
- Validez que vous mettez en cache au moins le nombre minimum de jetons
- Le système vérifie automatiquement les accès au cache aux limites des blocs de contenu précédents (jusqu'à ~20 blocs avant votre point de rupture). Pour les invites avec plus de 20 blocs de contenu, vous devrez peut-être des paramètres `cache_control` supplémentaires plus tôt dans l'invite pour garantir que tout le contenu peut être mis en cache
- Vérifiez que les clés de vos blocs de contenu `tool_use` ont un ordre stable car certains langages (par exemple Swift, Go) randomisent l'ordre des clés lors de la conversion JSON, ce qui casse les caches

<Note>
Les modifications apportées à `tool_choice` ou la présence/absence d'images n'importe où dans l'invite invalideront le cache, nécessitant la création d'une nouvelle entrée de cache. Pour plus de détails sur l'invalidation du cache, consultez [Ce qui invalide le cache](#what-invalidates-the-cache).
</Note>

### Mise en cache avec blocs de réflexion

Lors de l'utilisation de la [réflexion étendue](/docs/fr/build-with-claude/extended-thinking) avec la mise en cache des invites, les blocs de réflexion ont un comportement spécial :

**Mise en cache automatique avec d'autres contenus** : Bien que les blocs de réflexion ne puissent pas être explicitement marqués avec `cache_control`, ils sont mis en cache dans le cadre du contenu de la demande lorsque vous effectuez des appels API ultérieurs avec les résultats des outils. Cela se produit généralement lors de l'utilisation d'outils lorsque vous transmettez les blocs de réflexion pour continuer la conversation.

**Comptage des jetons d'entrée** : Lorsque les blocs de réflexion sont lus à partir du cache, ils comptent comme des jetons d'entrée dans vos métriques d'utilisation. C'est important pour le calcul des coûts et la budgétisation des jetons.

**Modèles d'invalidation du cache** :
- Le cache reste valide lorsque seuls les résultats des outils sont fournis en tant que messages utilisateur
- Le cache est invalidé lorsque du contenu utilisateur non-résultat d'outil est ajouté, ce qui entraîne la suppression de tous les blocs de réflexion précédents
- Ce comportement de mise en cache se produit même sans marqueurs `cache_control` explicites

Pour plus de détails sur l'invalidation du cache, consultez [Ce qui invalide le cache](#what-invalidates-the-cache).

**Exemple avec utilisation d'outils** :
```
Request 1: User: "What's the weather in Paris?"
Response: [thinking_block_1] + [tool_use block 1]

Request 2:
User: ["What's the weather in Paris?"],
Assistant: [thinking_block_1] + [tool_use block 1],
User: [tool_result_1, cache=True]
Response: [thinking_block_2] + [text block 2]
# Request 2 caches its request content (not the response)
# The cache includes: user message, thinking_block_1, tool_use block 1, and tool_result_1

Request 3:
User: ["What's the weather in Paris?"],
Assistant: [thinking_block_1] + [tool_use block 1],
User: [tool_result_1, cache=True],
Assistant: [thinking_block_2] + [text block 2],
User: [Text response, cache=True]
# Non-tool-result user block causes all thinking blocks to be ignored
# This request is processed as if thinking blocks were never present
```

Lorsqu'un bloc utilisateur non-résultat d'outil est inclus, il désigne une nouvelle boucle d'assistant et tous les blocs de réflexion précédents sont supprimés du contexte.

Pour des informations plus détaillées, consultez la [documentation sur la réflexion étendue](/docs/fr/build-with-claude/extended-thinking#understanding-thinking-block-caching-behavior).

---
## Stockage et partage du cache

- **Isolation organisationnelle** : Les caches sont isolés entre les organisations. Différentes organisations ne partagent jamais les caches, même si elles utilisent des invites identiques.

- **Correspondance exacte** : Les accès au cache nécessitent une correspondance à 100 % des segments d'invite, y compris tout le texte et les images jusqu'à et y compris le bloc marqué avec le contrôle de cache.

- **Génération de jetons de sortie** : La mise en cache des invites n'a aucun effet sur la génération de jetons de sortie. La réponse que vous recevez sera identique à celle que vous obtiendriez si la mise en cache des invites n'était pas utilisée.

---
## Durée de cache d'1 heure

Si vous trouvez que 5 minutes est trop court, Anthropic propose également une durée de cache d'1 heure [à un coût supplémentaire](#pricing).

Pour utiliser le cache étendu, incluez `ttl` dans la définition `cache_control` comme ceci :
```json
"cache_control": {
    "type": "ephemeral",
    "ttl": "5m" | "1h"
}
```

La réponse inclura des informations de cache détaillées comme suit :
```json
{
    "usage": {
        "input_tokens": ...,
        "cache_read_input_tokens": ...,
        "cache_creation_input_tokens": ...,
        "output_tokens": ...,

        "cache_creation": {
            "ephemeral_5m_input_tokens": 456,
            "ephemeral_1h_input_tokens": 100,
        }
    }
}
```

Notez que le champ `cache_creation_input_tokens` actuel est égal à la somme des valeurs dans l'objet `cache_creation`.

### Quand utiliser le cache d'1 heure

Si vous avez des invites qui sont utilisées à un rythme régulier (c'est-à-dire des invites système qui sont utilisées plus fréquemment que toutes les 5 minutes), continuez à utiliser le cache de 5 minutes, car celui-ci continuera à être actualisé sans frais supplémentaires.

Le cache d'1 heure est mieux utilisé dans les scénarios suivants :
- Lorsque vous avez des invites qui sont probablement utilisées moins fréquemment que 5 minutes, mais plus fréquemment que toutes les heures. Par exemple, lorsqu'un agent secondaire agentique prendra plus de 5 minutes, ou lorsque vous stockez une longue conversation de chat avec un utilisateur et vous vous attendez généralement à ce que cet utilisateur ne réponde pas dans les 5 prochaines minutes.
- Lorsque la latence est importante et que vos invites de suivi peuvent être envoyées au-delà de 5 minutes.
- Lorsque vous souhaitez améliorer votre utilisation des limites de débit, car les accès au cache ne sont pas déduits de votre limite de débit.

<Note>
Le cache de 5 minutes et d'1 heure se comportent de la même manière en ce qui concerne la latence. Vous verrez généralement une amélioration du temps jusqu'au premier jeton pour les documents longs.
</Note>

### Mélanger différents TTL

Vous pouvez utiliser à la fois les contrôles de cache d'1 heure et de 5 minutes dans la même demande, mais avec une contrainte importante : Les entrées de cache avec un TTL plus long doivent apparaître avant les TTL plus courts (c'est-à-dire qu'une entrée de cache d'1 heure doit apparaître avant toute entrée de cache de 5 minutes).

Lors du mélange des TTL, nous déterminons trois emplacements de facturation dans votre invite :
1. Position `A` : Le nombre de jetons au plus haut accès au cache (ou 0 s'il n'y a pas d'accès).
2. Position `B` : Le nombre de jetons au plus haut bloc `cache_control` d'1 heure après `A` (ou égal à `A` s'il n'en existe pas).
3. Position `C` : Le nombre de jetons au dernier bloc `cache_control`.

<Note>
Si `B` et/ou `C` sont plus grands que `A`, ils seront nécessairement des accès manqués au cache, car `A` est le plus haut accès au cache.
</Note>

Vous serez facturé pour :
1. Jetons de lecture de cache pour `A`.
2. Jetons d'écriture de cache d'1 heure pour `(B - A)`.
3. Jetons d'écriture de cache de 5 minutes pour `(C - B)`.

Voici 3 exemples. Ceci représente les jetons d'entrée de 3 demandes, chacune ayant différents accès au cache et accès manqués au cache. Chacun a une tarification calculée différente, affichée dans les boîtes colorées, en conséquence.
![Diagramme de mélange des TTL](/docs/images/prompt-cache-mixed-ttl.svg)

---

## Exemples de mise en cache des invites

Pour vous aider à démarrer avec la mise en cache des invites, nous avons préparé un [carnet de recettes sur la mise en cache des invites](https://github.com/anthropics/anthropic-cookbook/blob/main/misc/prompt_caching.ipynb) avec des exemples détaillés et les meilleures pratiques.

Ci-dessous, nous avons inclus plusieurs extraits de code qui présentent différents modèles de mise en cache des invites. Ces exemples montrent comment implémenter la mise en cache dans différents scénarios, vous aidant à comprendre les applications pratiques de cette fonctionnalité :

<section title="Exemple de mise en cache de contexte volumineux">

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "system": [
        {
            "type": "text",
            "text": "You are an AI assistant tasked with analyzing legal documents."
        },
        {
            "type": "text",
            "text": "Here is the full text of a complex legal agreement: [Insert full text of a 50-page legal agreement here]",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    "messages": [
        {
            "role": "user",
            "content": "What are the key terms and conditions in this agreement?"
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
    system=[
        {
            "type": "text",
            "text": "You are an AI assistant tasked with analyzing legal documents."
        },
        {
            "type": "text",
            "text": "Here is the full text of a complex legal agreement: [Insert full text of a 50-page legal agreement here]",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        {
            "role": "user",
            "content": "What are the key terms and conditions in this agreement?"
        }
    ]
)
print(response.model_dump_json())
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  system: [
    {
        "type": "text",
        "text": "You are an AI assistant tasked with analyzing legal documents."
    },
    {
        "type": "text",
        "text": "Here is the full text of a complex legal agreement: [Insert full text of a 50-page legal agreement here]",
        "cache_control": {"type": "ephemeral"}
    }
  ],
  messages: [
    {
        "role": "user",
        "content": "What are the key terms and conditions in this agreement?"
    }
  ]
});
console.log(response);
```

```java Java
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;

public class LegalDocumentAnalysisExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                .systemOfTextBlockParams(List.of(
                        TextBlockParam.builder()
                                .text("You are an AI assistant tasked with analyzing legal documents.")
                                .build(),
                        TextBlockParam.builder()
                                .text("Here is the full text of a complex legal agreement: [Insert full text of a 50-page legal agreement here]")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build()
                ))
                .addUserMessage("What are the key terms and conditions in this agreement?")
                .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>
Cet exemple démontre l'utilisation basique de la mise en cache des invites, en mettant en cache le texte complet de l'accord juridique en tant que préfixe tout en gardant l'instruction utilisateur non mise en cache.

Pour la première demande :
- `input_tokens` : Nombre de jetons dans le message utilisateur uniquement
- `cache_creation_input_tokens` : Nombre de jetons dans l'intégralité du message système, y compris le document juridique
- `cache_read_input_tokens` : 0 (pas de succès de cache lors de la première demande)

Pour les demandes ultérieures au cours de la durée de vie du cache :
- `input_tokens` : Nombre de jetons dans le message utilisateur uniquement
- `cache_creation_input_tokens` : 0 (pas de nouvelle création de cache)
- `cache_read_input_tokens` : Nombre de jetons dans l'intégralité du message système mis en cache

</section>
<section title="Mise en cache des définitions d'outils">

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "tools": [
        {
            "name": "get_weather",
            "description": "Get the current weather in a given location",
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
                        "description": "The unit of temperature, either celsius or fahrenheit"
                    }
                },
                "required": ["location"]
            }
        },
        # many more tools
        {
            "name": "get_time",
            "description": "Get the current time in a given time zone",
            "input_schema": {
                "type": "object",
                "properties": {
                    "timezone": {
                        "type": "string",
                        "description": "The IANA time zone name, e.g. America/Los_Angeles"
                    }
                },
                "required": ["timezone"]
            },
            "cache_control": {"type": "ephemeral"}
        }
    ],
    "messages": [
        {
            "role": "user",
            "content": "What is the weather and time in New York?"
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
            "name": "get_weather",
            "description": "Get the current weather in a given location",
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
                "required": ["location"]
            },
        },
        # many more tools
        {
            "name": "get_time",
            "description": "Get the current time in a given time zone",
            "input_schema": {
                "type": "object",
                "properties": {
                    "timezone": {
                        "type": "string",
                        "description": "The IANA time zone name, e.g. America/Los_Angeles"
                    }
                },
                "required": ["timezone"]
            },
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        {
            "role": "user",
            "content": "What's the weather and time in New York?"
        }
    ]
)
print(response.model_dump_json())
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    tools=[
        {
            "name": "get_weather",
            "description": "Get the current weather in a given location",
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
                "required": ["location"]
            },
        },
        // many more tools
        {
            "name": "get_time",
            "description": "Get the current time in a given time zone",
            "input_schema": {
                "type": "object",
                "properties": {
                    "timezone": {
                        "type": "string",
                        "description": "The IANA time zone name, e.g. America/Los_Angeles"
                    }
                },
                "required": ["timezone"]
            },
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages: [
        {
            "role": "user",
            "content": "What's the weather and time in New York?"
        }
    ]
});
console.log(response);
```

```java Java
import java.util.List;
import java.util.Map;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.JsonValue;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.Tool;
import com.anthropic.models.messages.Tool.InputSchema;

public class ToolsWithCacheControlExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Weather tool schema
        InputSchema weatherSchema = InputSchema.builder()
                .properties(JsonValue.from(Map.of(
                        "location", Map.of(
                                "type", "string",
                                "description", "The city and state, e.g. San Francisco, CA"
                        ),
                        "unit", Map.of(
                                "type", "string",
                                "enum", List.of("celsius", "fahrenheit"),
                                "description", "The unit of temperature, either celsius or fahrenheit"
                        )
                )))
                .putAdditionalProperty("required", JsonValue.from(List.of("location")))
                .build();

        // Time tool schema
        InputSchema timeSchema = InputSchema.builder()
                .properties(JsonValue.from(Map.of(
                        "timezone", Map.of(
                                "type", "string",
                                "description", "The IANA time zone name, e.g. America/Los_Angeles"
                        )
                )))
                .putAdditionalProperty("required", JsonValue.from(List.of("timezone")))
                .build();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                .addTool(Tool.builder()
                        .name("get_weather")
                        .description("Get the current weather in a given location")
                        .inputSchema(weatherSchema)
                        .build())
                .addTool(Tool.builder()
                        .name("get_time")
                        .description("Get the current time in a given time zone")
                        .inputSchema(timeSchema)
                        .cacheControl(CacheControlEphemeral.builder().build())
                        .build())
                .addUserMessage("What is the weather and time in New York?")
                .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>

Dans cet exemple, nous démontrons la mise en cache des définitions d'outils.

Le paramètre `cache_control` est placé sur l'outil final (`get_time`) pour désigner tous les outils comme faisant partie du préfixe statique.

Cela signifie que toutes les définitions d'outils, y compris `get_weather` et tous les autres outils définis avant `get_time`, seront mis en cache en tant que préfixe unique.

Cette approche est utile lorsque vous avez un ensemble cohérent d'outils que vous souhaitez réutiliser sur plusieurs demandes sans les retraiter à chaque fois.

Pour la première demande :
- `input_tokens` : Nombre de jetons dans le message utilisateur
- `cache_creation_input_tokens` : Nombre de jetons dans toutes les définitions d'outils et l'invite système
- `cache_read_input_tokens` : 0 (pas de succès de cache lors de la première demande)

Pour les demandes ultérieures au cours de la durée de vie du cache :
- `input_tokens` : Nombre de jetons dans le message utilisateur
- `cache_creation_input_tokens` : 0 (pas de nouvelle création de cache)
- `cache_read_input_tokens` : Nombre de jetons dans toutes les définitions d'outils et l'invite système mises en cache

</section>

<section title="Poursuivre une conversation multi-tours">

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "system": [
        {
            "type": "text",
            "text": "...long system prompt",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Hello, can you tell me more about the solar system?",
                }
            ]
        },
        {
            "role": "assistant",
            "content": "Certainly! The solar system is the collection of celestial bodies that orbit our Sun. It consists of eight planets, numerous moons, asteroids, comets, and other objects. The planets, in order from closest to farthest from the Sun, are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet has its own unique characteristics and features. Is there a specific aspect of the solar system you would like to know more about?"
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Good to know."
                },
                {
                    "type": "text",
                    "text": "Tell me more about Mars.",
                    "cache_control": {"type": "ephemeral"}
                }
            ]
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
    system=[
        {
            "type": "text",
            "text": "...long system prompt",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        # ...long conversation so far
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Hello, can you tell me more about the solar system?",
                }
            ]
        },
        {
            "role": "assistant",
            "content": "Certainly! The solar system is the collection of celestial bodies that orbit our Sun. It consists of eight planets, numerous moons, asteroids, comets, and other objects. The planets, in order from closest to farthest from the Sun, are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet has its own unique characteristics and features. Is there a specific aspect of the solar system you'd like to know more about?"
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Good to know."
                },
                {
                    "type": "text",
                    "text": "Tell me more about Mars.",
                    "cache_control": {"type": "ephemeral"}
                }
            ]
        }
    ]
)
print(response.model_dump_json())
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    system=[
        {
            "type": "text",
            "text": "...long system prompt",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        // ...long conversation so far
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Hello, can you tell me more about the solar system?",
                }
            ]
        },
        {
            "role": "assistant",
            "content": "Certainly! The solar system is the collection of celestial bodies that orbit our Sun. It consists of eight planets, numerous moons, asteroids, comets, and other objects. The planets, in order from closest to farthest from the Sun, are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet has its own unique characteristics and features. Is there a specific aspect of the solar system you'd like to know more about?"
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Good to know."
                },
                {
                    "type": "text",
                    "text": "Tell me more about Mars.",
                    "cache_control": {"type": "ephemeral"}
                }
            ]
        }
    ]
});
console.log(response);
```

```java Java
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.ContentBlockParam;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;

public class ConversationWithCacheControlExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Create ephemeral system prompt
        TextBlockParam systemPrompt = TextBlockParam.builder()
                .text("...long system prompt")
                .cacheControl(CacheControlEphemeral.builder().build())
                .build();

        // Create message params
        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                .systemOfTextBlockParams(List.of(systemPrompt))
                // First user message (without cache control)
                .addUserMessage("Hello, can you tell me more about the solar system?")
                // Assistant response
                .addAssistantMessage("Certainly! The solar system is the collection of celestial bodies that orbit our Sun. It consists of eight planets, numerous moons, asteroids, comets, and other objects. The planets, in order from closest to farthest from the Sun, are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet has its own unique characteristics and features. Is there a specific aspect of the solar system you would like to know more about?")
                // Second user message (with cache control)
                .addUserMessageOfBlockParams(List.of(
                        ContentBlockParam.ofText(TextBlockParam.builder()
                                .text("Good to know.")
                                .build()),
                        ContentBlockParam.ofText(TextBlockParam.builder()
                                .text("Tell me more about Mars.")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build())
                ))
                .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>

Dans cet exemple, nous démontrons comment utiliser la mise en cache des invites dans une conversation multi-tours.

À chaque tour, nous marquons le bloc final du message final avec `cache_control` afin que la conversation puisse être progressivement mise en cache. Le système recherchera automatiquement et utilisera la plus longue séquence précédemment mise en cache de blocs pour les messages de suivi. C'est-à-dire que les blocs qui ont été précédemment marqués avec un bloc `cache_control` ne sont pas marqués ultérieurement, mais ils seront toujours considérés comme un succès de cache (et aussi un rafraîchissement de cache !) s'ils sont atteints dans les 5 minutes.

De plus, notez que le paramètre `cache_control` est placé sur le message système. Ceci est pour s'assurer que s'il est évincé du cache (après ne pas avoir été utilisé pendant plus de 5 minutes), il sera rajouté au cache lors de la prochaine demande.

Cette approche est utile pour maintenir le contexte dans les conversations en cours sans retraiter à plusieurs reprises les mêmes informations.

Lorsque ceci est configuré correctement, vous devriez voir ce qui suit dans la réponse d'utilisation de chaque demande :
- `input_tokens` : Nombre de jetons dans le nouveau message utilisateur (sera minimal)
- `cache_creation_input_tokens` : Nombre de jetons dans les nouveaux tours assistant et utilisateur
- `cache_read_input_tokens` : Nombre de jetons dans la conversation jusqu'au tour précédent

</section>

<section title="Tout mettre ensemble : Points de rupture de cache multiples">

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "tools": [
        {
            "name": "search_documents",
            "description": "Search through the knowledge base",
            "input_schema": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Search query"
                    }
                },
                "required": ["query"]
            }
        },
        {
            "name": "get_document",
            "description": "Retrieve a specific document by ID",
            "input_schema": {
                "type": "object",
                "properties": {
                    "doc_id": {
                        "type": "string",
                        "description": "Document ID"
                    }
                },
                "required": ["doc_id"]
            },
            "cache_control": {"type": "ephemeral"}
        }
    ],
    "system": [
        {
            "type": "text",
            "text": "You are a helpful research assistant with access to a document knowledge base.\n\n# Instructions\n- Always search for relevant documents before answering\n- Provide citations for your sources\n- Be objective and accurate in your responses\n- If multiple documents contain relevant information, synthesize them\n- Acknowledge when information is not available in the knowledge base",
            "cache_control": {"type": "ephemeral"}
        },
        {
            "type": "text",
            "text": "# Knowledge Base Context\n\nHere are the relevant documents for this conversation:\n\n## Document 1: Solar System Overview\nThe solar system consists of the Sun and all objects that orbit it...\n\n## Document 2: Planetary Characteristics\nEach planet has unique features. Mercury is the smallest planet...\n\n## Document 3: Mars Exploration\nMars has been a target of exploration for decades...\n\n[Additional documents...]",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    "messages": [
        {
            "role": "user",
            "content": "Can you search for information about Mars rovers?"
        },
        {
            "role": "assistant",
            "content": [
                {
                    "type": "tool_use",
                    "id": "tool_1",
                    "name": "search_documents",
                    "input": {"query": "Mars rovers"}
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "tool_result",
                    "tool_use_id": "tool_1",
                    "content": "Found 3 relevant documents: Document 3 (Mars Exploration), Document 7 (Rover Technology), Document 9 (Mission History)"
                }
            ]
        },
        {
            "role": "assistant",
            "content": [
                {
                    "type": "text",
                    "text": "I found 3 relevant documents about Mars rovers. Let me get more details from the Mars Exploration document."
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Yes, please tell me about the Perseverance rover specifically.",
                    "cache_control": {"type": "ephemeral"}
                }
            ]
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
            "name": "search_documents",
            "description": "Search through the knowledge base",
            "input_schema": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Search query"
                    }
                },
                "required": ["query"]
            }
        },
        {
            "name": "get_document",
            "description": "Retrieve a specific document by ID",
            "input_schema": {
                "type": "object",
                "properties": {
                    "doc_id": {
                        "type": "string",
                        "description": "Document ID"
                    }
                },
                "required": ["doc_id"]
            },
            "cache_control": {"type": "ephemeral"}
        }
    ],
    system=[
        {
            "type": "text",
            "text": "You are a helpful research assistant with access to a document knowledge base.\n\n# Instructions\n- Always search for relevant documents before answering\n- Provide citations for your sources\n- Be objective and accurate in your responses\n- If multiple documents contain relevant information, synthesize them\n- Acknowledge when information is not available in the knowledge base",
            "cache_control": {"type": "ephemeral"}
        },
        {
            "type": "text",
            "text": "# Knowledge Base Context\n\nHere are the relevant documents for this conversation:\n\n## Document 1: Solar System Overview\nThe solar system consists of the Sun and all objects that orbit it...\n\n## Document 2: Planetary Characteristics\nEach planet has unique features. Mercury is the smallest planet...\n\n## Document 3: Mars Exploration\nMars has been a target of exploration for decades...\n\n[Additional documents...]",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        {
            "role": "user",
            "content": "Can you search for information about Mars rovers?"
        },
        {
            "role": "assistant",
            "content": [
                {
                    "type": "tool_use",
                    "id": "tool_1",
                    "name": "search_documents",
                    "input": {"query": "Mars rovers"}
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "tool_result",
                    "tool_use_id": "tool_1",
                    "content": "Found 3 relevant documents: Document 3 (Mars Exploration), Document 7 (Rover Technology), Document 9 (Mission History)"
                }
            ]
        },
        {
            "role": "assistant",
            "content": [
                {
                    "type": "text",
                    "text": "I found 3 relevant documents about Mars rovers. Let me get more details from the Mars Exploration document."
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Yes, please tell me about the Perseverance rover specifically.",
                    "cache_control": {"type": "ephemeral"}
                }
            ]
        }
    ]
)
print(response.model_dump_json())
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    tools: [
        {
            name: "search_documents",
            description: "Search through the knowledge base",
            input_schema: {
                type: "object",
                properties: {
                    query: {
                        type: "string",
                        description: "Search query"
                    }
                },
                required: ["query"]
            }
        },
        {
            name: "get_document",
            description: "Retrieve a specific document by ID",
            input_schema: {
                type: "object",
                properties: {
                    doc_id: {
                        type: "string",
                        description: "Document ID"
                    }
                },
                required: ["doc_id"]
            },
            cache_control: { type: "ephemeral" }
        }
    ],
    system: [
        {
            type: "text",
            text: "You are a helpful research assistant with access to a document knowledge base.\n\n# Instructions\n- Always search for relevant documents before answering\n- Provide citations for your sources\n- Be objective and accurate in your responses\n- If multiple documents contain relevant information, synthesize them\n- Acknowledge when information is not available in the knowledge base",
            cache_control: { type: "ephemeral" }
        },
        {
            type: "text",
            text: "# Knowledge Base Context\n\nHere are the relevant documents for this conversation:\n\n## Document 1: Solar System Overview\nThe solar system consists of the Sun and all objects that orbit it...\n\n## Document 2: Planetary Characteristics\nEach planet has unique features. Mercury is the smallest planet...\n\n## Document 3: Mars Exploration\nMars has been a target of exploration for decades...\n\n[Additional documents...]",
            cache_control: { type: "ephemeral" }
        }
    ],
    messages: [
        {
            role: "user",
            content: "Can you search for information about Mars rovers?"
        },
        {
            role: "assistant",
            content: [
                {
                    type: "tool_use",
                    id: "tool_1",
                    name: "search_documents",
                    input: { query: "Mars rovers" }
                }
            ]
        },
        {
            role: "user",
            content: [
                {
                    type: "tool_result",
                    tool_use_id: "tool_1",
                    content: "Found 3 relevant documents: Document 3 (Mars Exploration), Document 7 (Rover Technology), Document 9 (Mission History)"
                }
            ]
        },
        {
            role: "assistant",
            content: [
                {
                    type: "text",
                    text: "I found 3 relevant documents about Mars rovers. Let me get more details from the Mars Exploration document."
                }
            ]
        },
        {
            role: "user",
            content: [
                {
                    type: "text",
                    text: "Yes, please tell me about the Perseverance rover specifically.",
                    cache_control: { type: "ephemeral" }
                }
            ]
        }
    ]
});
console.log(response);
```

```java Java
import java.util.List;
import java.util.Map;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.JsonValue;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.ContentBlockParam;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;
import com.anthropic.models.messages.Tool;
import com.anthropic.models.messages.Tool.InputSchema;
import com.anthropic.models.messages.ToolResultBlockParam;
import com.anthropic.models.messages.ToolUseBlockParam;

public class MultipleCacheBreakpointsExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Search tool schema
        InputSchema searchSchema = InputSchema.builder()
                .properties(JsonValue.from(Map.of(
                        "query", Map.of(
                                "type", "string",
                                "description", "Search query"
                        )
                )))
                .putAdditionalProperty("required", JsonValue.from(List.of("query")))
                .build();

        // Get document tool schema
        InputSchema getDocSchema = InputSchema.builder()
                .properties(JsonValue.from(Map.of(
                        "doc_id", Map.of(
                                "type", "string",
                                "description", "Document ID"
                        )
                )))
                .putAdditionalProperty("required", JsonValue.from(List.of("doc_id")))
                .build();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                // Tools with cache control on the last one
                .addTool(Tool.builder()
                        .name("search_documents")
                        .description("Search through the knowledge base")
                        .inputSchema(searchSchema)
                        .build())
                .addTool(Tool.builder()
                        .name("get_document")
                        .description("Retrieve a specific document by ID")
                        .inputSchema(getDocSchema)
                        .cacheControl(CacheControlEphemeral.builder().build())
                        .build())
                // System prompts with cache control on instructions and context separately
                .systemOfTextBlockParams(List.of(
                        TextBlockParam.builder()
                                .text("You are a helpful research assistant with access to a document knowledge base.\n\n# Instructions\n- Always search for relevant documents before answering\n- Provide citations for your sources\n- Be objective and accurate in your responses\n- If multiple documents contain relevant information, synthesize them\n- Acknowledge when information is not available in the knowledge base")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build(),
                        TextBlockParam.builder()
                                .text("# Knowledge Base Context\n\nHere are the relevant documents for this conversation:\n\n## Document 1: Solar System Overview\nThe solar system consists of the Sun and all objects that orbit it...\n\n## Document 2: Planetary Characteristics\nEach planet has unique features. Mercury is the smallest planet...\n\n## Document 3: Mars Exploration\nMars has been a target of exploration for decades...\n\n[Additional documents...]")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build()
                ))
                // Conversation history
                .addUserMessage("Can you search for information about Mars rovers?")
                .addAssistantMessageOfBlockParams(List.of(
                        ContentBlockParam.ofToolUse(ToolUseBlockParam.builder()
                                .id("tool_1")
                                .name("search_documents")
                                .input(JsonValue.from(Map.of("query", "Mars rovers")))
                                .build())
                ))
                .addUserMessageOfBlockParams(List.of(
                        ContentBlockParam.ofToolResult(ToolResultBlockParam.builder()
                                .toolUseId("tool_1")
                                .content("Found 3 relevant documents: Document 3 (Mars Exploration), Document 7 (Rover Technology), Document 9 (Mission History)")
                                .build())
                ))
                .addAssistantMessageOfBlockParams(List.of(
                        ContentBlockParam.ofText(TextBlockParam.builder()
                                .text("I found 3 relevant documents about Mars rovers. Let me get more details from the Mars Exploration document.")
                                .build())
                ))
                .addUserMessageOfBlockParams(List.of(
                        ContentBlockParam.ofText(TextBlockParam.builder()
                                .text("Yes, please tell me about the Perseverance rover specifically.")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build())
                ))
                .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>

Cet exemple complet démontre comment utiliser les 4 points de rupture de cache disponibles pour optimiser différentes parties de votre invite :

1. **Cache des outils** (point de rupture de cache 1) : Le paramètre `cache_control` sur la dernière définition d'outil met en cache toutes les définitions d'outils.

2. **Cache des instructions réutilisables** (point de rupture de cache 2) : Les instructions statiques dans l'invite système sont mises en cache séparément. Ces instructions changent rarement entre les demandes.

3. **Cache du contexte RAG** (point de rupture de cache 3) : Les documents de la base de connaissances sont mis en cache indépendamment, ce qui vous permet de mettre à jour les documents RAG sans invalider le cache des outils ou des instructions.

4. **Cache de l'historique de conversation** (point de rupture de cache 4) : La réponse de l'assistant est marquée avec `cache_control` pour activer la mise en cache progressive de la conversation au fur et à mesure qu'elle progresse.

Cette approche offre une flexibilité maximale :
- Si vous mettez à jour uniquement le message utilisateur final, les quatre segments de cache sont réutilisés
- Si vous mettez à jour les documents RAG mais conservez les mêmes outils et instructions, les deux premiers segments de cache sont réutilisés
- Si vous modifiez la conversation mais conservez les mêmes outils, instructions et documents, les trois premiers segments sont réutilisés
- Chaque point de rupture de cache peut être invalidé indépendamment en fonction de ce qui change dans votre application

Pour la première demande :
- `input_tokens` : Jetons dans le message utilisateur final
- `cache_creation_input_tokens` : Jetons dans tous les segments mis en cache (outils + instructions + documents RAG + historique de conversation)
- `cache_read_input_tokens` : 0 (pas de succès de cache)

Pour les demandes ultérieures avec uniquement un nouveau message utilisateur :
- `input_tokens` : Jetons dans le nouveau message utilisateur uniquement
- `cache_creation_input_tokens` : Tous les nouveaux jetons ajoutés à l'historique de conversation
- `cache_read_input_tokens` : Tous les jetons précédemment mis en cache (outils + instructions + documents RAG + conversation précédente)

Ce modèle est particulièrement puissant pour :
- Les applications RAG avec de grands contextes de documents
- Les systèmes d'agents qui utilisent plusieurs outils
- Les conversations longues qui doivent maintenir le contexte
- Les applications qui doivent optimiser différentes parties de l'invite indépendamment

</section>

---
## FAQ

  <section title="Ai-je besoin de plusieurs points de rupture de cache ou un seul à la fin suffit-il ?">

    **Dans la plupart des cas, un seul point de rupture de cache à la fin de votre contenu statique est suffisant.** Le système vérifie automatiquement les succès de cache à toutes les limites de blocs de contenu précédentes (jusqu'à 20 blocs avant votre point de rupture) et utilise la plus longue séquence correspondante de blocs mis en cache.

    Vous n'avez besoin de plusieurs points de rupture que si :
    - Vous avez plus de 20 blocs de contenu avant votre point de cache souhaité
    - Vous souhaitez mettre en cache des sections qui se mettent à jour à des fréquences différentes indépendamment
    - Vous avez besoin d'un contrôle explicite sur ce qui est mis en cache pour l'optimisation des coûts

    Exemple : Si vous avez des instructions système (rarement modifiées) et un contexte RAG (modifié quotidiennement), vous pourriez utiliser deux points de rupture pour les mettre en cache séparément.
  
</section>

  <section title="Les points de rupture de cache ajoutent-ils un coût supplémentaire ?">

    Non, les points de rupture de cache eux-mêmes sont gratuits. Vous ne payez que pour :
    - L'écriture de contenu dans le cache (25 % de plus que les jetons d'entrée de base pour un TTL de 5 minutes)
    - La lecture à partir du cache (10 % du prix des jetons d'entrée de base)
    - Les jetons d'entrée réguliers pour le contenu non mis en cache

    Le nombre de points de rupture n'affecte pas la tarification - seule la quantité de contenu mis en cache et lu compte.
  
</section>

  <section title="Comment calculer le nombre total de jetons d'entrée à partir des champs d'utilisation ?">

    La réponse d'utilisation inclut trois champs de jetons d'entrée distincts qui représentent ensemble votre entrée totale :

    ```
    total_input_tokens = cache_read_input_tokens + cache_creation_input_tokens + input_tokens
    ```

    - `cache_read_input_tokens` : Jetons récupérés du cache (tout avant les points de rupture de cache qui ont été mis en cache)
    - `cache_creation_input_tokens` : Nouveaux jetons en cours d'écriture dans le cache (aux points de rupture de cache)
    - `input_tokens` : Jetons **après le dernier point de rupture de cache** qui ne sont pas mis en cache

    **Important :** `input_tokens` ne représente PAS tous les jetons d'entrée - seulement la portion après votre dernier point de rupture de cache. Si vous avez du contenu mis en cache, `input_tokens` sera généralement beaucoup plus petit que votre entrée totale.

    **Exemple :** Avec un document de 200 000 jetons mis en cache et une question utilisateur de 50 jetons :
    - `cache_read_input_tokens` : 200 000
    - `cache_creation_input_tokens` : 0
    - `input_tokens` : 50
    - **Total** : 200 050 jetons

    Cette répartition est critique pour comprendre à la fois vos coûts et l'utilisation de votre limite de débit. Voir [Suivi des performances du cache](#tracking-cache-performance) pour plus de détails.
  
</section>

  <section title="Quelle est la durée de vie du cache ?">

    La durée de vie minimale par défaut du cache (TTL) est de 5 minutes. Cette durée de vie est actualisée chaque fois que le contenu mis en cache est utilisé.

    Si vous trouvez que 5 minutes est trop court, Anthropic propose également un [cache TTL d'1 heure](#1-hour-cache-duration).
  
</section>

  <section title="Combien de points de rupture de cache puis-je utiliser ?">

    Vous pouvez définir jusqu'à 4 points de rupture de cache (en utilisant les paramètres `cache_control`) dans votre invite.
  
</section>

  <section title="La mise en cache des invites est-elle disponible pour tous les modèles ?">

    Non, la mise en cache des invites n'est actuellement disponible que pour Claude Opus 4.5, Claude Opus 4.1, Claude Opus 4, Claude Sonnet 4.5, Claude Sonnet 4, Claude Sonnet 3.7 ([obsolète](/docs/fr/about-claude/model-deprecations)), Claude Haiku 4.5, Claude Haiku 3.5, Claude Haiku 3 et Claude Opus 3 ([obsolète](/docs/fr/about-claude/model-deprecations)).
  
</section>

  <section title="Comment fonctionne la mise en cache des invites avec la réflexion étendue ?">

    Les invites système mises en cache et les outils seront réutilisés lorsque les paramètres de réflexion changent. Cependant, les changements de réflexion (activation/désactivation ou changements de budget) invalideront les préfixes d'invite précédemment mis en cache avec le contenu des messages.

    Pour plus de détails sur l'invalidation du cache, voir [Ce qui invalide le cache](#what-invalidates-the-cache).

    Pour plus d'informations sur la réflexion étendue, y compris son interaction avec l'utilisation d'outils et la mise en cache des invites, voir la [documentation sur la réflexion étendue](/docs/fr/build-with-claude/extended-thinking#extended-thinking-and-prompt-caching).
  
</section>

  <section title="Comment activer la mise en cache des invites ?">

    Pour activer la mise en cache des invites, incluez au moins un point de rupture `cache_control` dans votre demande d'API.
  
</section>

  <section title="Puis-je utiliser la mise en cache des invites avec d'autres fonctionnalités d'API ?">

    Oui, la mise en cache des invites peut être utilisée aux côtés d'autres fonctionnalités d'API comme l'utilisation d'outils et les capacités de vision. Cependant, modifier la présence d'images dans une invite ou modifier les paramètres d'utilisation d'outils cassera le cache.

    Pour plus de détails sur l'invalidation du cache, voir [Ce qui invalide le cache](#what-invalidates-the-cache).
  
</section>

  <section title="Comment la mise en cache des invites affecte-t-elle la tarification ?">

    La mise en cache des invites introduit une nouvelle structure de tarification où les écritures de cache coûtent 25 % de plus que les jetons d'entrée de base, tandis que les succès de cache ne coûtent que 10 % du prix des jetons d'entrée de base.
  
</section>

  <section title="Puis-je effacer manuellement le cache ?">

    Actuellement, il n'existe aucun moyen d'effacer manuellement le cache. Les préfixes mis en cache expirent automatiquement après un minimum de 5 minutes d'inactivité.
  
</section>

  <section title="Comment puis-je suivre l'efficacité de ma stratégie de mise en cache ?">

    Vous pouvez surveiller les performances du cache en utilisant les champs `cache_creation_input_tokens` et `cache_read_input_tokens` dans la réponse de l'API.
  
</section>

  <section title="Qu'est-ce qui peut casser le cache ?">

    Voir [Ce qui invalide le cache](#what-invalidates-the-cache) pour plus de détails sur l'invalidation du cache, y compris une liste des changements qui nécessitent la création d'une nouvelle entrée de cache.
  
</section>

  <section title="Comment la mise en cache des invites gère-t-elle la confidentialité et la séparation des données ?">

La mise en cache des invites est conçue avec des mesures fortes de confidentialité et de séparation des données :

1. Les clés de cache sont générées en utilisant un hachage cryptographique des invites jusqu'au point de contrôle de cache. Cela signifie que seules les demandes avec des invites identiques peuvent accéder à un cache spécifique.

2. Les caches sont spécifiques à l'organisation. Les utilisateurs au sein de la même organisation peuvent accéder au même cache s'ils utilisent des invites identiques, mais les caches ne sont pas partagés entre différentes organisations, même pour des invites identiques.

3. Le mécanisme de mise en cache est conçu pour maintenir l'intégrité et la confidentialité de chaque conversation ou contexte unique.

4. Il est sûr d'utiliser `cache_control` n'importe où dans vos invites. Pour l'efficacité des coûts, il est préférable d'exclure les parties hautement variables (par exemple, l'entrée arbitraire de l'utilisateur) de la mise en cache.

Ces mesures garantissent que la mise en cache des invites maintient la confidentialité et la sécurité des données tout en offrant des avantages en matière de performances.
  
</section>
  <section title="Puis-je utiliser la mise en cache des invites avec l'API Batches ?">

    Oui, il est possible d'utiliser la mise en cache des invites avec vos demandes [API Batches](/docs/fr/build-with-claude/batch-processing). Cependant, comme les demandes de lot asynchrones peuvent être traitées simultanément et dans n'importe quel ordre, les succès de cache sont fournis sur la base du meilleur effort.

    Le [cache d'1 heure](#1-hour-cache-duration) peut aider à améliorer vos succès de cache. La façon la plus rentable de l'utiliser est la suivante :
    - Rassemblez un ensemble de demandes de messages qui ont un préfixe partagé.
    - Envoyez une demande de lot avec juste une seule demande qui a ce préfixe partagé et un bloc de cache d'1 heure. Cela sera écrit dans le cache d'1 heure.
    - Dès que c'est fait, soumettez le reste des demandes. Vous devrez surveiller le travail pour savoir quand il se termine.

    C'est généralement mieux que d'utiliser le cache de 5 minutes simplement parce qu'il est courant que les demandes de lot prennent entre 5 minutes et 1 heure pour se terminer. Nous envisageons des moyens d'améliorer ces taux de succès de cache et de rendre ce processus plus simple.
  
</section>
  <section title="Pourquoi je vois l'erreur `AttributeError: 'Beta' object has no attribute 'prompt_caching'` en Python ?">

  Cette erreur apparaît généralement lorsque vous avez mis à niveau votre SDK ou que vous utilisez des exemples de code obsolètes. La mise en cache des invites est maintenant généralement disponible, vous n'avez donc plus besoin du préfixe bêta. Au lieu de :
    <CodeGroup>
      ```python Python
      python client.beta.prompt_caching.messages.create(...)
      ```
    </CodeGroup>
    Utilisez simplement :
    <CodeGroup>
      ```python Python
      python client.messages.create(...)
      ```
    </CodeGroup>
  
</section>
  <section title="Pourquoi je vois 'TypeError: Cannot read properties of undefined (reading 'messages')'?">

  Cette erreur apparaît généralement lorsque vous avez mis à niveau votre SDK ou que vous utilisez des exemples de code obsolètes. La mise en cache des invites est maintenant généralement disponible, vous n'avez donc plus besoin du préfixe bêta. Au lieu de :

      ```typescript TypeScript
      client.beta.promptCaching.messages.create(...)
      ```

      Utilisez simplement :

      ```typescript
      client.messages.create(...)
      ```
  
</section>