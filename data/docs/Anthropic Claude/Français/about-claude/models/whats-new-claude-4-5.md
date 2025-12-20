# Nouveautés de Claude 4.5

Découvrez les trois nouveaux modèles Claude 4.5 : Opus 4.5, Sonnet 4.5 et Haiku 4.5, avec des améliorations majeures en intelligence, codage et capacités d'agent.

---

Claude 4.5 introduit trois modèles conçus pour différents cas d'usage :

- **Claude Opus 4.5** : Notre modèle le plus intelligent combinant la capacité maximale avec des performances pratiques. Dispose d'un point de prix plus accessible que les modèles Opus précédents. Disponible avec une fenêtre de contexte de 200k tokens.
- **Claude Sonnet 4.5** : Notre meilleur modèle pour les agents complexes et le codage, avec l'intelligence la plus élevée sur la plupart des tâches. Disponible avec une fenêtre de contexte de 200k et 1M (bêta) tokens.
- **Claude Haiku 4.5** : Notre modèle Haiku le plus rapide et le plus intelligent avec des performances proches de la frontière. Disponible avec une fenêtre de contexte de 200k tokens.

## Améliorations clés dans Opus 4.5 par rapport à Opus 4.1

### Intelligence maximale

Claude Opus 4.5 représente notre modèle le plus intelligent, combinant la capacité maximale avec des performances pratiques. Il offre des améliorations majeures dans le raisonnement, le codage et les tâches de résolution de problèmes complexes tout en maintenant les résultats de haute qualité attendus de la famille Opus.

### Paramètre d'effort

Claude Opus 4.5 est le seul modèle qui supporte le [paramètre d'effort](/docs/fr/build-with-claude/effort), vous permettant de contrôler combien de tokens Claude utilise lors de la réponse. Cela vous donne la possibilité de faire un compromis entre la complétude de la réponse et l'efficacité des tokens avec un seul modèle.

Le paramètre d'effort affecte tous les tokens de la réponse, y compris les réponses texte, les appels d'outils et la réflexion étendue. Vous pouvez choisir entre :
- **Effort élevé** : Complétude maximale pour l'analyse complexe et les explications détaillées
- **Effort moyen** : Approche équilibrée pour la plupart des cas d'usage en production
- **Effort faible** : Réponses les plus efficaces en tokens pour l'automatisation à haut volume

### Excellence en utilisation informatique

Claude Opus 4.5 introduit des [capacités d'utilisation informatique améliorées](/docs/fr/agents-and-tools/tool-use/computer-use-tool) avec une nouvelle action de zoom qui permet l'inspection détaillée de régions d'écran spécifiques à pleine résolution. Cela permet à Claude d'examiner les éléments d'interface utilisateur à grain fin, le texte petit et les informations visuelles détaillées qui pourraient être peu clairs dans les captures d'écran standard.

La capacité de zoom est particulièrement utile pour :
- Inspecter les petits éléments et contrôles d'interface utilisateur
- Lire les petits caractères ou le texte détaillé
- Analyser les interfaces complexes avec des informations denses
- Vérifier les détails visuels précis avant de prendre des actions

### Performance pratique

Claude Opus 4.5 offre une intelligence de premier plan à un [point de prix plus accessible](/docs/fr/about-claude/pricing) que les modèles Opus précédents, rendant les capacités d'IA avancées disponibles pour une gamme plus large d'applications et de cas d'usage.

### Préservation des blocs de réflexion

Claude Opus 4.5 [préserve automatiquement tous les blocs de réflexion précédents](/docs/fr/build-with-claude/extended-thinking#thinking-block-preservation-in-claude-opus-4-5) tout au long des conversations, maintenant la continuité du raisonnement dans les interactions multi-tours étendues et les sessions d'utilisation d'outils. Cela garantit que Claude peut efficacement exploiter son historique de raisonnement complet lorsqu'il travaille sur des tâches complexes et longues.

## Améliorations clés dans Sonnet 4.5 par rapport à Sonnet 4

### Excellence en codage

Claude Sonnet 4.5 est notre meilleur modèle de codage à ce jour, avec des améliorations significatives dans tout le cycle de vie du développement :

- **Performance SWE-bench Verified** : État de l'art avancé sur les benchmarks de codage
- **Planification et conception de système améliorées** : Meilleures décisions architecturales et organisation du code
- **Ingénierie de sécurité améliorée** : Pratiques de sécurité plus robustes et détection des vulnérabilités
- **Meilleure adhérence aux instructions** : Respect plus précis des spécifications et exigences de codage

<Note>
Claude Sonnet 4.5 fonctionne significativement mieux sur les tâches de codage lorsque la [réflexion étendue](/docs/fr/build-with-claude/extended-thinking) est activée. La réflexion étendue est désactivée par défaut, mais nous recommandons de l'activer pour le travail de codage complexe. Soyez conscient que la réflexion étendue impacte l'[efficacité de la mise en cache des invites](/docs/fr/build-with-claude/prompt-caching#caching-with-thinking-blocks). Consultez le [guide de migration](/docs/fr/about-claude/models/migrating-to-claude-4#extended-thinking-recommendations) pour les détails de configuration.
</Note>

### Capacités d'agent

Claude Sonnet 4.5 introduit des avancées majeures dans les capacités d'agent :

- **Opération autonome étendue** : Sonnet 4.5 peut travailler indépendamment pendant des heures tout en maintenant la clarté et la concentration sur les progrès progressifs. Le modèle fait des avancées régulières sur quelques tâches à la fois plutôt que de tenter tout à la fois. Il fournit des mises à jour de progrès basées sur les faits qui reflètent avec précision ce qui a été réalisé.
- **Conscience du contexte** : Claude suit maintenant son utilisation de tokens tout au long des conversations, recevant des mises à jour après chaque appel d'outil. Cette conscience aide à prévenir l'abandon prématuré de tâches et permet une exécution plus efficace sur les tâches longues. Consultez [Conscience du contexte](/docs/fr/build-with-claude/context-windows#context-awareness-in-claude-sonnet-4-5) pour les détails techniques et [les conseils de prompting](/docs/fr/build-with-claude/prompt-engineering/claude-4-best-practices#context-awareness-and-multi-window-workflows).
- **Utilisation d'outils améliorée** : Le modèle utilise plus efficacement les appels d'outils parallèles, lançant plusieurs recherches spéculatives simultanément lors de la recherche et lisant plusieurs fichiers à la fois pour construire le contexte plus rapidement. La coordination améliorée entre plusieurs outils et sources d'information permet au modèle d'exploiter efficacement un large éventail de capacités dans les flux de travail de recherche et de codage agentiques.
- **Gestion du contexte avancée** : Sonnet 4.5 maintient un suivi d'état exceptionnel dans les fichiers externes, préservant l'orientation vers les objectifs entre les sessions. Combiné avec une utilisation plus efficace de la fenêtre de contexte et nos nouvelles fonctionnalités d'API de gestion du contexte, le modèle gère de manière optimale les informations dans les sessions étendues pour maintenir la cohérence au fil du temps.

<Note>La conscience du contexte est disponible dans Claude Sonnet 4, Sonnet 4.5, Haiku 4.5, Opus 4, Opus 4.1 et Opus 4.5.</Note>

### Style de communication et d'interaction

Claude Sonnet 4.5 a une approche de communication affinée qui est concise, directe et naturelle. Il fournit des mises à jour de progrès basées sur les faits et peut ignorer les résumés verbeux après les appels d'outils pour maintenir l'élan du flux de travail (bien que cela puisse être ajusté avec le prompting).

Pour des conseils détaillés sur le travail avec ce style de communication, consultez les [meilleures pratiques Claude 4](/docs/fr/build-with-claude/prompt-engineering/claude-4-best-practices).

### Génération de contenu créatif

Claude Sonnet 4.5 excelle dans les tâches de contenu créatif :

- **Présentations et animations** : Égale ou dépasse Claude Opus 4.1 et Opus 4.5 pour créer des diapositives et du contenu visuel
- **Flair créatif** : Produit une sortie polie et professionnelle avec un suivi d'instruction fort
- **Qualité au premier essai** : Génère du contenu utilisable et bien conçu aux premières tentatives

## Améliorations clés dans Haiku 4.5 par rapport à Haiku 3.5

Claude Haiku 4.5 représente un saut transformateur pour la famille de modèles Haiku, apportant des capacités de frontière à notre classe de modèle la plus rapide :

### Intelligence proche de la frontière avec une vitesse éclair

Claude Haiku 4.5 offre des performances proches de la frontière correspondant à Sonnet 4 à un coût significativement inférieur et une vitesse plus rapide :

- **Intelligence proche de la frontière** : Correspond aux performances de Sonnet 4 dans le raisonnement, le codage et les tâches complexes
- **Vitesse améliorée** : Plus de deux fois la vitesse de Sonnet 4, avec des optimisations pour les tokens de sortie par seconde (OTPS)
- **Rapport coût-performance optimal** : Intelligence proche de la frontière à un tiers du coût, idéale pour les déploiements à haut volume

### Capacités de réflexion étendue

Claude Haiku 4.5 est le **premier modèle Haiku** à supporter la réflexion étendue, apportant des capacités de raisonnement avancées à la famille Haiku :

- **Raisonnement à vitesse** : Accès au processus de raisonnement interne de Claude pour la résolution de problèmes complexes
- **Résumé de réflexion** : Sortie de réflexion résumée pour les déploiements prêts pour la production
- **Réflexion entrelacée** : Réfléchir entre les appels d'outils pour des flux de travail multi-étapes plus sophistiqués
- **Contrôle du budget** : Configurez les budgets de tokens de réflexion pour équilibrer la profondeur du raisonnement avec la vitesse

La réflexion étendue doit être activée explicitement en ajoutant un paramètre `thinking` à vos demandes d'API. Consultez la [documentation de réflexion étendue](/docs/fr/build-with-claude/extended-thinking) pour les détails de mise en œuvre.

<Note>
Claude Haiku 4.5 fonctionne significativement mieux sur les tâches de codage et de raisonnement lorsque la [réflexion étendue](/docs/fr/build-with-claude/extended-thinking) est activée. La réflexion étendue est désactivée par défaut, mais nous recommandons de l'activer pour la résolution de problèmes complexes, le travail de codage et le raisonnement multi-étapes. Soyez conscient que la réflexion étendue impacte l'[efficacité de la mise en cache des invites](/docs/fr/build-with-claude/prompt-caching#caching-with-thinking-blocks). Consultez le [guide de migration](/docs/fr/about-claude/models/migrating-to-claude-4#extended-thinking-recommendations) pour les détails de configuration.
</Note>

<Note>Disponible dans Claude Sonnet 3.7, Sonnet 4, Sonnet 4.5, Haiku 4.5, Opus 4, Opus 4.1 et Opus 4.5.</Note>

### Conscience du contexte

Claude Haiku 4.5 dispose de la **conscience du contexte**, permettant au modèle de suivre sa fenêtre de contexte restante tout au long d'une conversation :

- **Suivi du budget de tokens** : Claude reçoit des mises à jour en temps réel sur la capacité de contexte restante après chaque appel d'outil
- **Meilleure persistance des tâches** : Le modèle peut exécuter les tâches plus efficacement en comprenant l'espace de travail disponible
- **Flux de travail multi-fenêtres de contexte** : Gestion améliorée des transitions d'état dans les sessions étendues

C'est le premier modèle Haiku avec des capacités de conscience du contexte natives. Pour des conseils de prompting, consultez les [meilleures pratiques Claude 4](/docs/fr/build-with-claude/prompt-engineering/claude-4-best-practices#context-awareness-and-multi-window-workflows).

<Note>Disponible dans Claude Sonnet 4, Sonnet 4.5, Haiku 4.5, Opus 4, Opus 4.1 et Opus 4.5.</Note>

### Codage fort et utilisation d'outils

Claude Haiku 4.5 offre des capacités de codage robustes attendues des modèles Claude modernes :

- **Compétence en codage** : Performances fortes dans la génération de code, le débogage et les tâches de refactorisation
- **Support complet des outils** : Compatible avec tous les outils Claude 4 y compris bash, exécution de code, éditeur de texte, recherche web et utilisation informatique
- **Utilisation informatique améliorée** : Optimisée pour l'interaction autonome du bureau et les flux de travail d'automatisation du navigateur
- **Exécution d'outils parallèles** : Coordination efficace entre plusieurs outils pour les flux de travail complexes

Haiku 4.5 est conçu pour les cas d'usage qui exigent à la fois l'intelligence et l'efficacité :

- **Applications en temps réel** : Temps de réponse rapides pour les expériences utilisateur interactives
- **Traitement à haut volume** : Intelligence rentable pour les déploiements à grande échelle
- **Implémentations de niveau gratuit** : Qualité de modèle premium à un prix accessible
- **Architectures de sous-agents** : Agents rapides et intelligents pour les systèmes multi-agents
- **Utilisation informatique à l'échelle** : Automatisation autonome du bureau et du navigateur rentable

## Nouvelles fonctionnalités d'API

### Appel d'outils programmatique (Bêta)

L'[appel d'outils programmatique](/docs/fr/agents-and-tools/tool-use/programmatic-tool-calling) permet à Claude d'écrire du code qui appelle vos outils de manière programmatique dans un conteneur d'exécution de code, plutôt que de nécessiter des allers-retours à travers le modèle pour chaque invocation d'outil. Cela réduit considérablement la latence pour les flux de travail multi-outils et diminue la consommation de tokens en permettant à Claude de filtrer ou traiter les données avant qu'elles n'atteignent la fenêtre de contexte du modèle.

```python
tools=[
    {
        "type": "code_execution_20250825",
        "name": "code_execution"
    },
    {
        "name": "query_database",
        "description": "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
        "input_schema": {...},
        "allowed_callers": ["code_execution_20250825"]  # Enable programmatic calling
    }
]
```

Avantages clés :
- **Latence réduite** : Éliminer les allers-retours du modèle entre les appels d'outils
- **Efficacité des tokens** : Traiter et filtrer les résultats des outils de manière programmatique avant de revenir à Claude
- **Flux de travail complexes** : Supporter les boucles, la logique conditionnelle et le traitement par lots

<Note>Disponible dans Claude Opus 4.5 et Claude Sonnet 4.5. Nécessite l'[en-tête bêta](/docs/fr/api/beta-headers) : `advanced-tool-use-2025-11-20`</Note>

### Outil de recherche d'outils (Bêta)

L'[outil de recherche d'outils](/docs/fr/agents-and-tools/tool-use/tool-search-tool) permet à Claude de travailler avec des centaines ou des milliers d'outils en les découvrant et les chargeant dynamiquement à la demande. Au lieu de charger toutes les définitions d'outils dans la fenêtre de contexte dès le départ, Claude recherche votre catalogue d'outils et charge uniquement les outils dont il a besoin.

Deux variantes de recherche sont disponibles :
- **Regex** (`tool_search_tool_regex_20251119`) : Claude construit des motifs regex pour rechercher les noms, descriptions et arguments des outils
- **BM25** (`tool_search_tool_bm25_20251119`) : Claude utilise des requêtes en langage naturel pour rechercher des outils

```python
tools=[
    {
        "type": "tool_search_tool_regex_20251119",
        "name": "tool_search_tool_regex"
    },
    {
        "name": "get_weather",
        "description": "Get the weather at a specific location",
        "input_schema": {...},
        "defer_loading": True  # Load on-demand via search
    }
]
```

Cette approche résout deux défis critiques :
- **Efficacité du contexte** : Économiser 10-20K tokens en ne chargeant pas toutes les définitions d'outils dès le départ
- **Précision de la sélection d'outils** : Maintenir une haute précision même avec 100+ outils disponibles

<Note>Disponible dans Claude Opus 4.5 et Claude Sonnet 4.5. Nécessite l'[en-tête bêta](/docs/fr/api/beta-headers) : `advanced-tool-use-2025-11-20`</Note>

### Paramètre d'effort (Bêta)

Le [paramètre d'effort](/docs/fr/build-with-claude/effort) vous permet de contrôler combien de tokens Claude utilise lors de la réponse, en faisant un compromis entre la complétude de la réponse et l'efficacité des tokens :

```python
response = client.beta.messages.create(
    model="claude-opus-4-5-20251101",
    betas=["effort-2025-11-24"],
    max_tokens=4096,
    messages=[{"role": "user", "content": "..."}],
    output_config={
        "effort": "medium"  # "low", "medium", or "high"
    }
)
```

Le paramètre d'effort affecte tous les tokens de la réponse, y compris les réponses texte, les appels d'outils et la réflexion étendue. Les niveaux d'effort inférieur produisent des réponses plus concises avec des explications minimales, tandis que l'effort supérieur fournit un raisonnement détaillé et des réponses complètes.

<Note>Disponible exclusivement dans Claude Opus 4.5. Nécessite l'[en-tête bêta](/docs/fr/api/beta-headers) : `effort-2025-11-24`</Note>

### Exemples d'utilisation d'outils (Bêta)

Les [exemples d'utilisation d'outils](/docs/fr/agents-and-tools/tool-use/implement-tool-use#providing-tool-use-examples) vous permettent de fournir des exemples concrets d'entrées d'outils valides pour aider Claude à comprendre comment utiliser vos outils plus efficacement. Ceci est particulièrement utile pour les outils complexes avec des objets imbriqués, des paramètres optionnels ou des entrées sensibles au format.

```python
tools=[
    {
        "name": "get_weather",
        "description": "Get the current weather in a given location",
        "input_schema": {...},
        "input_examples": [
            {
                "location": "San Francisco, CA",
                "unit": "fahrenheit"
            },
            {
                "location": "Tokyo, Japan",
                "unit": "celsius"
            },
            {
                "location": "New York, NY"  # Demonstrates optional 'unit' parameter
            }
        ]
    }
]
```

Les exemples sont inclus dans l'invite aux côtés de votre schéma d'outil, montrant à Claude des motifs concrets pour les appels d'outils bien formés. Chaque exemple doit être valide selon le `input_schema` de l'outil.

<Note>Disponible dans Claude Sonnet 4.5, Haiku 4.5, Opus 4.5, Opus 4.1 et Opus 4. Nécessite l'[en-tête bêta](/docs/fr/api/beta-headers) : `advanced-tool-use-2025-11-20`.</Note>

### Outil de mémoire (Bêta)

Le nouvel [outil de mémoire](/docs/fr/agents-and-tools/tool-use/memory-tool) permet à Claude de stocker et récupérer des informations en dehors de la fenêtre de contexte :

```python
tools=[
    {
        "type": "memory_20250818",
        "name": "memory"
    }
]
```

Cela permet :
- Construire des bases de connaissances au fil du temps
- Maintenir l'état du projet entre les sessions
- Préserver un contexte effectivement illimité grâce au stockage basé sur fichiers

<Note>Disponible dans Claude Sonnet 4, Sonnet 4.5, Haiku 4.5, Opus 4, Opus 4.1 et Opus 4.5. Nécessite l'[en-tête bêta](/docs/fr/api/beta-headers) : `context-management-2025-06-27`</Note>

### Édition du contexte

Utilisez l'[édition du contexte](/docs/fr/build-with-claude/context-editing) pour la gestion intelligente du contexte grâce à l'effacement automatique des appels d'outils :

```python
response = client.beta.messages.create(
    betas=["context-management-2025-06-27"],
    model="claude-sonnet-4-5",  # or claude-haiku-4-5
    max_tokens=4096,
    messages=[{"role": "user", "content": "..."}],
    context_management={
        "edits": [
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {"type": "input_tokens", "value": 500},
                "keep": {"type": "tool_uses", "value": 2},
                "clear_at_least": {"type": "input_tokens", "value": 100}
            }
        ]
    },
    tools=[...]
)
```

Cette fonctionnalité supprime automatiquement les appels d'outils et les résultats plus anciens lorsqu'on approche des limites de tokens, aidant à gérer le contexte dans les sessions d'agents longues.

<Note>Disponible dans Claude Sonnet 4, Sonnet 4.5, Haiku 4.5, Opus 4, Opus 4.1 et Opus 4.5. Nécessite l'[en-tête bêta](/docs/fr/api/beta-headers) : `context-management-2025-06-27`</Note>

### Raisons d'arrêt améliorées

Les modèles Claude 4.5 introduisent une nouvelle raison d'arrêt `model_context_window_exceeded` qui indique explicitement quand la génération s'est arrêtée en raison du dépassement de la limite de la fenêtre de contexte, plutôt que de la limite `max_tokens` demandée. Cela facilite la gestion des limites de fenêtre de contexte dans la logique de votre application.

```json
{
  "stop_reason": "model_context_window_exceeded",
  "usage": {
    "input_tokens": 150000,
    "output_tokens": 49950
  }
}
```

### Gestion améliorée des paramètres d'outils

Les modèles Claude 4.5 incluent une correction de bug qui préserve le formatage intentionnel dans les paramètres de chaîne d'appel d'outil. Auparavant, les sauts de ligne à la fin des paramètres de chaîne étaient parfois incorrectement supprimés. Cette correction garantit que les outils nécessitant un formatage précis (comme les éditeurs de texte) reçoivent les paramètres exactement comme prévu.

<Note>
Ceci est une amélioration en arrière-plan sans modifications d'API requises. Cependant, les outils avec des paramètres de chaîne peuvent maintenant recevoir des valeurs avec des sauts de ligne à la fin qui ont été précédemment supprimés.
</Note>

**Exemple :**

```json
// Avant : Saut de ligne final accidentellement supprimé
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "edit_todo",
  "input": {
    "file": "todo.txt",
    "contents": "1. Chop onions.\n2. ???\n3. Profit"
  }
}

// Après : Saut de ligne à la fin préservé comme prévu
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "edit_todo",
  "input": {
    "file": "todo.txt",
    "contents": "1. Chop onions.\n2. ???\n3. Profit\n"
  }
}
```

### Optimisations du nombre de tokens

Les modèles Claude 4.5 incluent des optimisations automatiques pour améliorer les performances du modèle. Ces optimisations peuvent ajouter de petites quantités de tokens aux demandes, mais **vous ne serez pas facturé pour ces tokens ajoutés par le système**.

## Fonctionnalités introduites dans Claude 4

Les fonctionnalités suivantes ont été introduites dans Claude 4 et sont disponibles dans tous les modèles Claude 4, y compris Claude Sonnet 4.5 et Claude Haiku 4.5.

### Nouvelle raison d'arrêt de refus

Les modèles Claude 4 introduisent une nouvelle raison d'arrêt `refusal` pour le contenu que le modèle refuse de générer pour des raisons de sécurité :

```json
{
  "id": "msg_014XEDjypDjFzgKVWdFUXxZP",
  "type": "message",
  "role": "assistant",
  "model": "claude-sonnet-4-5",
  "content": [{"type": "text", "text": "I would be happy to assist you. You can "}],
  "stop_reason": "refusal",
  "stop_sequence": null,
  "usage": {
    "input_tokens": 564,
    "cache_creation_input_tokens": 0,
    "cache_read_input_tokens": 0,
    "output_tokens": 22
  }
}
```

Lors de l'utilisation des modèles Claude 4, vous devez mettre à jour votre application pour [gérer les raisons d'arrêt `refusal`](/docs/fr/test-and-evaluate/strengthen-guardrails/handle-streaming-refusals).

### Réflexion résumée

Avec la réflexion étendue activée, l'API Messages pour les modèles Claude 4 retourne un résumé du processus de réflexion complet de Claude. La réflexion résumée fournit tous les avantages en intelligence de la réflexion étendue, tout en prévenant les abus.

Bien que l'API soit cohérente entre les modèles Claude 3.7 et 4, les réponses en streaming pour la réflexion étendue pourraient revenir dans un motif de livraison « fragmenté », avec des délais possibles entre les événements de streaming.

<Note>
La résumé est traitée par un modèle différent de celui que vous ciblez dans vos demandes. Le modèle de réflexion ne voit pas la sortie résumée.
</Note>

Pour plus d'informations, consultez la [documentation de réflexion étendue](/docs/fr/build-with-claude/extended-thinking#summarized-thinking).

### Réflexion entrelacée

Les modèles Claude 4 supportent l'entrelacement de l'utilisation d'outils avec la réflexion étendue, permettant des conversations plus naturelles où les utilisations d'outils et les réponses peuvent être mélangées avec des messages réguliers.

<Note>
La réflexion entrelacée est en bêta. Pour activer la réflexion entrelacée, ajoutez l'[en-tête bêta](/docs/fr/api/beta-headers) `interleaved-thinking-2025-05-14` à votre demande d'API.
</Note>

Pour plus d'informations, consultez la [documentation de réflexion étendue](/docs/fr/build-with-claude/extended-thinking#interleaved-thinking).

### Différences comportementales

Les modèles Claude 4 ont des changements comportementaux notables qui peuvent affecter la façon dont vous structurez les invites :

#### Changements de style de communication

- **Plus concis et direct** : Les modèles Claude 4 communiquent plus efficacement, avec moins d'explications verbales
- **Ton plus naturel** : Les réponses sont légèrement plus conversationnelles et moins mécaniques
- **Axé sur l'efficacité** : Peut ignorer les résumés détaillés après avoir complété les actions pour maintenir l'élan du flux de travail (vous pouvez demander plus de détails si nécessaire)

#### Suivi des instructions

Les modèles Claude 4 sont entraînés pour un suivi précis des instructions et nécessitent une direction plus explicite :

- **Soyez explicite sur les actions** : Utilisez un langage direct comme « Apportez ces modifications » ou « Implémentez cette fonctionnalité » plutôt que « Pouvez-vous suggérer des modifications » si vous voulez que Claude agisse
- **Énoncez clairement les comportements souhaités** : Claude suivra les instructions avec précision, donc être spécifique sur ce que vous voulez aide à obtenir de meilleurs résultats

Pour des conseils complets sur le travail avec ces modèles, consultez les [meilleures pratiques de prompt engineering Claude 4](/docs/fr/build-with-claude/prompt-engineering/claude-4-best-practices).

### Outil d'éditeur de texte mis à jour

L'outil d'éditeur de texte a été mis à jour pour les modèles Claude 4 avec les modifications suivantes :

- **Type d'outil** : `text_editor_20250728`
- **Nom de l'outil** : `str_replace_based_edit_tool`
- La commande `undo_edit` n'est plus supportée

<Note>
L'outil d'éditeur de texte `str_replace_editor` reste le même pour Claude Sonnet 3.7.
</Note>

Si vous migrez depuis Claude Sonnet 3.7 et utilisez l'outil d'éditeur de texte :

```python
# Claude Sonnet 3.7
tools=[
    {
        "type": "text_editor_20250124",
        "name": "str_replace_editor"
    }
]

# Claude 4 models
tools=[
    {
        "type": "text_editor_20250728",
        "name": "str_replace_based_edit_tool"
    }
]
```

Pour plus d'informations, consultez la [documentation de l'outil d'éditeur de texte](/docs/fr/agents-and-tools/tool-use/text-editor-tool).

### Outil d'exécution de code mis à jour

Si vous utilisez l'outil d'exécution de code, assurez-vous d'utiliser la dernière version `code_execution_20250825`, qui ajoute les commandes Bash et les capacités de manipulation de fichiers.

La version héritée `code_execution_20250522` (Python uniquement) est toujours disponible mais non recommandée pour les nouvelles implémentations.

Pour les instructions de migration, consultez la [documentation de l'outil d'exécution de code](/docs/fr/agents-and-tools/tool-use/code-execution-tool#upgrade-to-latest-tool-version).

## Tarification et disponibilité

### Tarification

Les modèles Claude 4.5 maintiennent une tarification compétitive :

| Modèle | Entrée | Sortie |
|--------|--------|--------|
| Claude Opus 4.5 | 5 $ par million de tokens | 25 $ par million de tokens |
| Claude Sonnet 4.5 | 3 $ par million de tokens | 15 $ par million de tokens |
| Claude Haiku 4.5 | 1 $ par million de tokens | 5 $ par million de tokens |

Pour plus de détails, consultez la [documentation de tarification](/docs/fr/about-claude/pricing).

### Tarification des plateformes tierces

À partir des modèles Claude 4.5 (Opus 4.5, Sonnet 4.5 et Haiku 4.5), AWS Bedrock et Google Vertex AI offrent deux types de points de terminaison :

- **Points de terminaison globaux** : Routage dynamique pour une disponibilité maximale
- **Points de terminaison régionaux** : Routage de données garanti via des régions géographiques spécifiques avec une **prime de tarification de 10%**

**Cette tarification régionale s'applique à tous les modèles Claude 4.5 : Opus 4.5, Sonnet 4.5 et Haiku 4.5.**

**L'API Claude (1P) est globale par défaut et n'est pas affectée par ce changement.** L'API Claude est globale uniquement (équivalente à l'offre et à la tarification du point de terminaison global d'autres fournisseurs).

Pour les détails de mise en œuvre et les conseils de migration :
- [Points de terminaison globaux vs régionaux AWS Bedrock](/docs/fr/build-with-claude/claude-on-amazon-bedrock#global-vs-regional-endpoints)
- [Points de terminaison globaux vs régionaux Google Vertex AI](/docs/fr/build-with-claude/claude-on-vertex-ai#global-vs-regional-endpoints)

### Disponibilité

Les modèles Claude 4.5 sont disponibles sur :

| Modèle | API Claude | Amazon Bedrock | Google Cloud Vertex AI |
|--------|-----------|----------------|------------------------|
| Claude Opus 4.5 | `claude-opus-4-5-20251101` | `anthropic.claude-opus-4-5-20251101-v1:0` | `claude-opus-4-5@20251101` |
| Claude Sonnet 4.5 | `claude-sonnet-4-5-20250929` | `anthropic.claude-sonnet-4-5-20250929-v1:0` | `claude-sonnet-4-5@20250929` |
| Claude Haiku 4.5 | `claude-haiku-4-5-20251001` | `anthropic.claude-haiku-4-5-20251001-v1:0` | `claude-haiku-4-5@20251001` |

Également disponible via les plateformes Claude.ai et Claude Code.

## Guide de migration

Les changements de rupture et les exigences de migration varient selon le modèle à partir duquel vous effectuez la mise à niveau. Pour des instructions de migration détaillées, y compris des guides étape par étape, les changements de rupture et les listes de contrôle de migration, consultez [Migration vers Claude 4.5](/docs/fr/about-claude/models/migrating-to-claude-4).

Le guide de migration couvre les scénarios suivants :
- **Claude Sonnet 3.7 → Sonnet 4.5** : Chemin de migration complet avec changements de rupture
- **Claude Haiku 3.5 → Haiku 4.5** : Chemin de migration complet avec changements de rupture
- **Claude Sonnet 4 → Sonnet 4.5** : Mise à niveau rapide avec changements minimaux
- **Claude Opus 4.1 → Sonnet 4.5** : Mise à niveau transparente sans changements de rupture
- **Claude Opus 4.1 → Opus 4.5** : Mise à niveau transparente sans changements de rupture
- **Claude Opus 4.5 → Sonnet 4.5** : Rétrogradation transparente sans changements de rupture

## Prochaines étapes

<CardGroup cols={3}>
  <Card title="Meilleures pratiques" icon="lightbulb" href="/docs/fr/build-with-claude/prompt-engineering/claude-4-best-practices">
    Apprenez les techniques de prompt engineering pour les modèles Claude 4.5
  </Card>
  <Card title="Aperçu du modèle" icon="table" href="/docs/fr/about-claude/models/overview">
    Comparez les modèles Claude 4.5 avec d'autres modèles Claude
  </Card>
  <Card title="Guide de migration" icon="arrow-right-arrow-left" href="/docs/fr/about-claude/models/migrating-to-claude-4">
    Mettez à niveau à partir des modèles précédents
  </Card>
</CardGroup>