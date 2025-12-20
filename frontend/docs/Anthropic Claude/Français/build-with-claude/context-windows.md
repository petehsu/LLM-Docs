# Fenêtres de contexte

Comprendre comment les fenêtres de contexte fonctionnent avec Claude, y compris la pensée étendue et l'utilisation d'outils

---

## Comprendre la fenêtre de contexte

La « fenêtre de contexte » fait référence à la totalité de la quantité de texte qu'un modèle de langage peut consulter et référencer lors de la génération d'un nouveau texte, plus le nouveau texte qu'il génère. Ceci est différent du grand corpus de données sur lequel le modèle de langage a été entraîné, et représente plutôt une « mémoire de travail » pour le modèle. Une fenêtre de contexte plus grande permet au modèle de comprendre et de répondre à des invites plus complexes et plus longues, tandis qu'une fenêtre de contexte plus petite peut limiter la capacité du modèle à gérer des invites plus longues ou à maintenir la cohérence sur des conversations prolongées.

Le diagramme ci-dessous illustre le comportement standard de la fenêtre de contexte pour les demandes d'API<sup>1</sup> :

![Diagramme de la fenêtre de contexte](/docs/images/context-window.svg)

_<sup>1</sup>Pour les interfaces de chat, comme pour [claude.ai](https://claude.ai/), les fenêtres de contexte peuvent également être configurées sur un système roulant « premier entré, premier sorti »._

* **Accumulation progressive des jetons :** À mesure que la conversation progresse à travers les tours, chaque message utilisateur et réponse d'assistant s'accumulent dans la fenêtre de contexte. Les tours précédents sont préservés complètement.
* **Modèle de croissance linéaire :** L'utilisation du contexte croît linéairement à chaque tour, les tours précédents étant préservés complètement.
* **Capacité de 200K jetons :** La fenêtre de contexte totale disponible (200 000 jetons) représente la capacité maximale pour stocker l'historique des conversations et générer une nouvelle sortie à partir de Claude.
* **Flux entrée-sortie :** Chaque tour se compose de :
  - **Phase d'entrée :** Contient tout l'historique des conversations précédentes plus le message utilisateur actuel
  - **Phase de sortie :** Génère une réponse textuelle qui devient partie d'une entrée future

## La fenêtre de contexte avec la pensée étendue

Lors de l'utilisation de la [pensée étendue](/docs/fr/build-with-claude/extended-thinking), tous les jetons d'entrée et de sortie, y compris les jetons utilisés pour la pensée, comptent vers la limite de la fenêtre de contexte, avec quelques nuances dans les situations multi-tours.

Les jetons du budget de pensée sont un sous-ensemble de votre paramètre `max_tokens`, sont facturés comme des jetons de sortie et comptent vers les limites de débit.

Cependant, les blocs de pensée précédents sont automatiquement supprimés du calcul de la fenêtre de contexte par l'API Claude et ne font pas partie de l'historique des conversations que le modèle « voit » pour les tours suivants, préservant la capacité des jetons pour le contenu réel de la conversation.

Le diagramme ci-dessous démontre la gestion spécialisée des jetons lorsque la pensée étendue est activée :

![Diagramme de la fenêtre de contexte avec pensée étendue](/docs/images/context-window-thinking.svg)

* **Suppression de la pensée étendue :** Les blocs de pensée étendue (affichés en gris foncé) sont générés pendant la phase de sortie de chaque tour, **mais ne sont pas reportés comme jetons d'entrée pour les tours suivants**. Vous n'avez pas besoin de supprimer les blocs de pensée vous-même. L'API Claude le fait automatiquement pour vous si vous les renvoyez.
* **Détails de mise en œuvre technique :**
  - L'API exclut automatiquement les blocs de pensée des tours précédents lorsque vous les renvoyez dans le cadre de l'historique des conversations.
  - Les jetons de pensée étendue sont facturés comme des jetons de sortie une seule fois, lors de leur génération.
  - Le calcul effectif de la fenêtre de contexte devient : `context_window = (input_tokens - previous_thinking_tokens) + current_turn_tokens`.
  - Les jetons de pensée incluent à la fois les blocs `thinking` et les blocs `redacted_thinking`.

Cette architecture est efficace en termes de jetons et permet un raisonnement étendu sans gaspillage de jetons, car les blocs de pensée peuvent être substantiels en longueur.

<Note>
Vous pouvez en savoir plus sur la fenêtre de contexte et la pensée étendue dans notre [guide de pensée étendue](/docs/fr/build-with-claude/extended-thinking).
</Note>

## La fenêtre de contexte avec la pensée étendue et l'utilisation d'outils

Le diagramme ci-dessous illustre la gestion des jetons de la fenêtre de contexte lors de la combinaison de la pensée étendue avec l'utilisation d'outils :

![Diagramme de la fenêtre de contexte avec pensée étendue et utilisation d'outils](/docs/images/context-window-thinking-tools.svg)

<Steps>
  <Step title="Architecture du premier tour">
    - **Composants d'entrée :** Configuration des outils et message utilisateur
    - **Composants de sortie :** Pensée étendue + réponse textuelle + demande d'utilisation d'outil
    - **Calcul des jetons :** Tous les composants d'entrée et de sortie comptent vers la fenêtre de contexte, et tous les composants de sortie sont facturés comme des jetons de sortie.
  </Step>
  <Step title="Gestion des résultats d'outils (tour 2)">
    - **Composants d'entrée :** Chaque bloc du premier tour ainsi que le `tool_result`. Le bloc de pensée étendue **doit** être renvoyé avec les résultats d'outils correspondants. C'est le seul cas où vous **devez** renvoyer les blocs de pensée.
    - **Composants de sortie :** Après que les résultats d'outils ont été renvoyés à Claude, Claude répondra avec uniquement du texte (pas de pensée étendue supplémentaire jusqu'au prochain message `user`).
    - **Calcul des jetons :** Tous les composants d'entrée et de sortie comptent vers la fenêtre de contexte, et tous les composants de sortie sont facturés comme des jetons de sortie.
  </Step>
  <Step title="Troisième étape">
    - **Composants d'entrée :** Toutes les entrées et la sortie du tour précédent sont reportées à l'exception du bloc de pensée, qui peut être supprimé maintenant que Claude a terminé le cycle complet d'utilisation d'outils. L'API supprimera automatiquement le bloc de pensée pour vous si vous le renvoyez, ou vous pouvez le supprimer vous-même à ce stade. C'est également là où vous ajouteriez le prochain tour `User`.
    - **Composants de sortie :** Puisqu'il y a un nouveau tour `User` en dehors du cycle d'utilisation d'outils, Claude générera un nouveau bloc de pensée étendue et continuera à partir de là.
    - **Calcul des jetons :** Les jetons de pensée précédents sont automatiquement supprimés des calculs de la fenêtre de contexte. Tous les autres blocs précédents comptent toujours comme faisant partie de la fenêtre de jetons, et le bloc de pensée du tour `Assistant` actuel compte comme faisant partie de la fenêtre de contexte.
  </Step>
</Steps>

* **Considérations pour l'utilisation d'outils avec la pensée étendue :**
  - Lors de la publication des résultats d'outils, le bloc de pensée complet et non modifié qui accompagne cette demande d'outil spécifique (y compris les portions de signature/rédaction) doit être inclus.
  - Le calcul effectif de la fenêtre de contexte pour la pensée étendue avec utilisation d'outils devient : `context_window = input_tokens + current_turn_tokens`.
  - Le système utilise des signatures cryptographiques pour vérifier l'authenticité du bloc de pensée. Ne pas préserver les blocs de pensée lors de l'utilisation d'outils peut briser la continuité du raisonnement de Claude. Ainsi, si vous modifiez les blocs de pensée, l'API renverra une erreur.

<Note>
Les modèles Claude 4 prennent en charge la [pensée entrelacée](/docs/fr/build-with-claude/extended-thinking#interleaved-thinking), qui permet à Claude de penser entre les appels d'outils et de faire un raisonnement plus sophistiqué après réception des résultats d'outils.

Claude Sonnet 3.7 ne prend pas en charge la pensée entrelacée, il n'y a donc pas d'entrelacement de la pensée étendue et des appels d'outils sans un tour utilisateur non-`tool_result` entre les deux.

Pour plus d'informations sur l'utilisation d'outils avec la pensée étendue, consultez notre [guide de pensée étendue](/docs/fr/build-with-claude/extended-thinking#extended-thinking-with-tool-use).
</Note>

## Fenêtre de contexte de 1M de jetons

Claude Sonnet 4 et 4.5 prennent en charge une fenêtre de contexte d'un million de jetons. Cette fenêtre de contexte étendue vous permet de traiter des documents beaucoup plus volumineux, de maintenir des conversations plus longues et de travailler avec des bases de code plus étendues.

<Note>
La fenêtre de contexte de 1M jetons est actuellement en bêta pour les organisations dans le [niveau d'utilisation](/docs/fr/api/rate-limits) 4 et les organisations avec des limites de débit personnalisées. La fenêtre de contexte de 1M jetons n'est disponible que pour Claude Sonnet 4 et Sonnet 4.5.
</Note>

Pour utiliser la fenêtre de contexte de 1M jetons, incluez l'[en-tête bêta](/docs/fr/api/beta-headers) `context-1m-2025-08-07` dans vos demandes d'API :

<CodeGroup>

```python Python
from anthropic import Anthropic

client = Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Process this large document..."}
    ],
    betas=["context-1m-2025-08-07"]
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const msg = await anthropic.beta.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 1024,
  messages: [
    { role: 'user', content: 'Process this large document...' }
  ],
  betas: ['context-1m-2025-08-07']
});
```

```bash cURL
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: context-1m-2025-08-07" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "Process this large document..."}
    ]
  }'
```

</CodeGroup>

**Considérations importantes :**
- **Statut bêta** : Ceci est une fonctionnalité bêta sujette à modification. Les fonctionnalités et la tarification peuvent être modifiées ou supprimées dans les versions futures.
- **Exigence de niveau d'utilisation** : La fenêtre de contexte de 1M jetons est disponible pour les organisations au [niveau d'utilisation](/docs/fr/api/rate-limits) 4 et les organisations avec des limites de débit personnalisées. Les organisations de niveau inférieur doivent passer au niveau d'utilisation 4 pour accéder à cette fonctionnalité.
- **Disponibilité** : La fenêtre de contexte de 1M jetons est actuellement disponible sur l'API Claude, [Microsoft Foundry](/docs/fr/build-with-claude/claude-in-microsoft-foundry), [Amazon Bedrock](/docs/fr/build-with-claude/claude-on-amazon-bedrock) et [Google Cloud's Vertex AI](/docs/fr/build-with-claude/claude-on-vertex-ai).
- **Tarification** : Les demandes dépassant 200K jetons sont automatiquement facturées à des tarifs premium (2x entrée, 1,5x tarification de sortie). Consultez la [documentation de tarification](/docs/fr/about-claude/pricing#long-context-pricing) pour plus de détails.
- **Limites de débit** : Les demandes de contexte long ont des limites de débit dédiées. Consultez la [documentation des limites de débit](/docs/fr/api/rate-limits#long-context-rate-limits) pour plus de détails.
- **Considérations multimodales** : Lors du traitement d'un grand nombre d'images ou de PDF, soyez conscient que les fichiers peuvent varier dans l'utilisation des jetons. Lorsque vous associez une grande invite à un grand nombre d'images, vous pouvez atteindre les [limites de taille des demandes](/docs/fr/api/overview#request-size-limits).

## Sensibilisation au contexte dans Claude Sonnet 4.5 et Haiku 4.5

Claude Sonnet 4.5 et Claude Haiku 4.5 disposent de la **sensibilisation au contexte**, permettant à ces modèles de suivre leur fenêtre de contexte restante (c'est-à-dire « budget de jetons ») tout au long d'une conversation. Cela permet à Claude d'exécuter des tâches et de gérer le contexte plus efficacement en comprenant l'espace dont il dispose. Claude est nativement entraîné à utiliser ce contexte précisément pour persister dans la tâche jusqu'à la toute fin, plutôt que d'avoir à deviner combien de jetons restent. Pour un modèle, manquer de sensibilisation au contexte, c'est comme participer à un concours culinaire sans horloge. Les modèles Claude 4.5 changent cela en informant explicitement le modèle de son contexte restant, afin qu'il puisse tirer le maximum parti des jetons disponibles.

**Comment ça marche :**

Au début d'une conversation, Claude reçoit des informations sur sa fenêtre de contexte totale :

```
<budget:token_budget>200000</budget:token_budget>
```

Le budget est défini à 200K jetons (standard), 500K jetons (Claude.ai Enterprise) ou 1M jetons (bêta, pour les organisations éligibles).

Après chaque appel d'outil, Claude reçoit une mise à jour sur la capacité restante :

```
<system_warning>Token usage: 35000/200000; 165000 remaining</system_warning>
```

Cette sensibilisation aide Claude à déterminer la capacité restante pour le travail et permet une exécution plus efficace sur les tâches longues. Les jetons d'image sont inclus dans ces budgets.

**Avantages :**

La sensibilisation au contexte est particulièrement précieuse pour :
- Les sessions d'agent longues qui nécessitent une concentration soutenue
- Les flux de travail multi-fenêtres de contexte où les transitions d'état sont importantes
- Les tâches complexes nécessitant une gestion minutieuse des jetons

Pour des conseils de rédaction sur l'exploitation de la sensibilisation au contexte, consultez notre [guide des meilleures pratiques Claude 4](/docs/fr/build-with-claude/prompt-engineering/claude-4-best-practices#context-awareness-and-multi-window-workflows).

## Gestion de la fenêtre de contexte avec les modèles Claude plus récents

Dans les modèles Claude plus récents (à partir de Claude Sonnet 3.7), si la somme des jetons d'invite et des jetons de sortie dépasse la fenêtre de contexte du modèle, le système renverra une erreur de validation plutôt que de tronquer silencieusement le contexte. Ce changement fournit un comportement plus prévisible mais nécessite une gestion plus minutieuse des jetons.

Pour planifier votre utilisation des jetons et vous assurer que vous restez dans les limites de la fenêtre de contexte, vous pouvez utiliser l'[API de comptage des jetons](/docs/fr/build-with-claude/token-counting) pour estimer le nombre de jetons que vos messages utiliseront avant de les envoyer à Claude.

Consultez notre tableau de [comparaison des modèles](/docs/fr/about-claude/models/overview#model-comparison-table) pour une liste des tailles de fenêtre de contexte par modèle.

# Prochaines étapes
<CardGroup cols={2}>
  <Card title="Tableau de comparaison des modèles" icon="scales" href="/docs/fr/about-claude/models/overview#model-comparison-table">
    Consultez notre tableau de comparaison des modèles pour une liste des tailles de fenêtre de contexte et de la tarification des jetons d'entrée/sortie par modèle.
  </Card>
  <Card title="Aperçu de la pensée étendue" icon="settings" href="/docs/fr/build-with-claude/extended-thinking">
    En savoir plus sur le fonctionnement de la pensée étendue et comment l'implémenter aux côtés d'autres fonctionnalités telles que l'utilisation d'outils et la mise en cache des invites.
  </Card>
</CardGroup>