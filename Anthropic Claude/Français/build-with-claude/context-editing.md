# Édition du contexte

Gérez automatiquement le contexte de la conversation à mesure qu'il se développe avec l'édition du contexte.

---

## Aperçu

L'édition du contexte vous permet de gérer automatiquement le contexte de la conversation à mesure qu'il se développe, vous aidant à optimiser les coûts et à rester dans les limites de la fenêtre de contexte. Vous pouvez utiliser des stratégies API côté serveur, des fonctionnalités SDK côté client, ou les deux ensemble.

| Approche | Où elle s'exécute | Stratégies | Comment cela fonctionne |
|----------|---------------|------------|--------------|
| **Côté serveur** | API | Effacement des résultats d'outils (`clear_tool_uses_20250919`)<br/>Effacement des blocs de réflexion (`clear_thinking_20251015`) | Appliqué avant que l'invite n'atteigne Claude. Efface le contenu spécifique de l'historique de conversation. Chaque stratégie peut être configurée indépendamment. |
| **Côté client** | SDK | Compaction | Disponible dans les [SDK Python et TypeScript](/docs/fr/api/client-sdks) lors de l'utilisation de [`tool_runner`](/docs/fr/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta). Génère un résumé et remplace l'historique complet de la conversation. Voir [Compaction](#client-side-compaction-sdk) ci-dessous. |

## Stratégies côté serveur

<Note>
L'édition du contexte est actuellement en version bêta avec support pour l'effacement des résultats d'outils et l'effacement des blocs de réflexion. Pour l'activer, utilisez l'en-tête bêta `context-management-2025-06-27` dans vos demandes API.

Veuillez nous contacter via notre [formulaire de commentaires](https://forms.gle/YXC2EKGMhjN1c4L88) pour partager vos commentaires sur cette fonctionnalité.
</Note>

### Effacement des résultats d'outils

La stratégie `clear_tool_uses_20250919` efface les résultats d'outils lorsque le contexte de la conversation dépasse votre seuil configuré. Lorsqu'elle est activée, l'API efface automatiquement les résultats d'outils les plus anciens dans l'ordre chronologique, en les remplaçant par un texte d'espace réservé pour laisser Claude savoir que le résultat de l'outil a été supprimé. Par défaut, seuls les résultats d'outils sont effacés. Vous pouvez éventuellement effacer à la fois les résultats d'outils et les appels d'outils (les paramètres d'utilisation d'outils) en définissant `clear_tool_inputs` sur true.

### Effacement des blocs de réflexion

La stratégie `clear_thinking_20251015` gère les blocs `thinking` dans les conversations lorsque la réflexion étendue est activée. Cette stratégie efface automatiquement les blocs de réflexion plus anciens des tours précédents.

<Tip>
**Comportement par défaut** : Lorsque la réflexion étendue est activée sans configurer la stratégie `clear_thinking_20251015`, l'API conserve automatiquement uniquement les blocs de réflexion du dernier tour d'assistant (équivalent à `keep: {type: "thinking_turns", value: 1}`).

Pour maximiser les accès au cache, conservez tous les blocs de réflexion en définissant `keep: "all"`.
</Tip>

<Note>
Un tour de conversation d'assistant peut inclure plusieurs blocs de contenu (par exemple lors de l'utilisation d'outils) et plusieurs blocs de réflexion (par exemple avec [réflexion entrelacée](/docs/fr/build-with-claude/extended-thinking#interleaved-thinking)).
</Note>

<Tip>
**L'édition du contexte se fait côté serveur**

L'édition du contexte est appliquée **côté serveur** avant que l'invite n'atteigne Claude. Votre application cliente maintient l'historique complet et non modifié de la conversation — vous n'avez pas besoin de synchroniser l'état de votre client avec la version éditée. Continuez à gérer votre historique complet de conversation localement comme vous le feriez normalement.
</Tip>

<Tip>
**Édition du contexte et mise en cache des invites**

L'interaction de l'édition du contexte avec la [mise en cache des invites](/docs/fr/build-with-claude/prompt-caching) varie selon la stratégie :

- **Effacement des résultats d'outils** : Invalide les préfixes d'invite mis en cache lorsque le contenu est effacé. Pour tenir compte de cela, nous recommandons d'effacer suffisamment de jetons pour que l'invalidation du cache en vaille la peine. Utilisez le paramètre `clear_at_least` pour assurer qu'un nombre minimum de jetons est effacé à chaque fois. Vous encourrez des coûts d'écriture en cache chaque fois que le contenu est effacé, mais les demandes ultérieures peuvent réutiliser le préfixe nouvellement mis en cache.

- **Effacement des blocs de réflexion** : Lorsque les blocs de réflexion sont **conservés** dans le contexte (non effacés), le cache d'invite est préservé, permettant les accès au cache et réduisant les coûts des jetons d'entrée. Lorsque les blocs de réflexion sont **effacés**, le cache est invalidé au point où l'effacement se produit. Configurez le paramètre `keep` selon que vous souhaitez prioriser les performances du cache ou la disponibilité de la fenêtre de contexte.
</Tip>

## Modèles pris en charge

L'édition du contexte est disponible sur :

- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)
- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)

## Utilisation de l'effacement des résultats d'outils

Le moyen le plus simple d'activer l'effacement des résultats d'outils est de spécifier uniquement le type de stratégie, car toutes les autres [options de configuration](#configuration-options-for-tool-result-clearing) utiliseront leurs valeurs par défaut :

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": "Search for recent developments in AI"
            }
        ],
        "tools": [
            {
                "type": "web_search_20250305",
                "name": "web_search"
            }
        ],
        "context_management": {
            "edits": [
                {"type": "clear_tool_uses_20250919"}
            ]
        }
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Search for recent developments in AI"
        }
    ],
    tools=[
        {
            "type": "web_search_20250305",
            "name": "web_search"
        }
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {"type": "clear_tool_uses_20250919"}
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
  messages: [
    {
      role: "user",
      content: "Search for recent developments in AI"
    }
  ],
  tools: [
    {
      type: "web_search_20250305",
      name: "web_search"
    }
  ],
  context_management: {
    edits: [
      { type: "clear_tool_uses_20250919" }
    ]
  },
  betas: ["context-management-2025-06-27"]
});
```

</CodeGroup>

### Configuration avancée

Vous pouvez personnaliser le comportement de l'effacement des résultats d'outils avec des paramètres supplémentaires :

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": "Create a simple command line calculator app using Python"
            }
        ],
        "tools": [
            {
                "type": "text_editor_20250728",
                "name": "str_replace_based_edit_tool",
                "max_characters": 10000
            },
            {
                "type": "web_search_20250305",
                "name": "web_search",
                "max_uses": 3
            }
        ],
        "context_management": {
            "edits": [
                {
                    "type": "clear_tool_uses_20250919",
                    "trigger": {
                        "type": "input_tokens",
                        "value": 30000
                    },
                    "keep": {
                        "type": "tool_uses",
                        "value": 3
                    },
                    "clear_at_least": {
                        "type": "input_tokens",
                        "value": 5000
                    },
                    "exclude_tools": ["web_search"]
                }
            ]
        }
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Create a simple command line calculator app using Python"
        }
    ],
    tools=[
        {
            "type": "text_editor_20250728",
            "name": "str_replace_based_edit_tool",
            "max_characters": 10000
        },
        {
            "type": "web_search_20250305",
            "name": "web_search",
            "max_uses": 3
        }
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_tool_uses_20250919",
                # Trigger clearing when threshold is exceeded
                "trigger": {
                    "type": "input_tokens",
                    "value": 30000
                },
                # Number of tool uses to keep after clearing
                "keep": {
                    "type": "tool_uses",
                    "value": 3
                },
                # Optional: Clear at least this many tokens
                "clear_at_least": {
                    "type": "input_tokens",
                    "value": 5000
                },
                # Exclude these tools from being cleared
                "exclude_tools": ["web_search"]
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
  messages: [
    {
      role: "user",
      content: "Create a simple command line calculator app using Python"
    }
  ],
  tools: [
    {
      type: "text_editor_20250728",
      name: "str_replace_based_edit_tool",
      max_characters: 10000
    },
    {
      type: "web_search_20250305",
      name: "web_search",
      max_uses: 3
    }
  ],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_tool_uses_20250919",
        // Trigger clearing when threshold is exceeded
        trigger: {
          type: "input_tokens",
          value: 30000
        },
        // Number of tool uses to keep after clearing
        keep: {
          type: "tool_uses",
          value: 3
        },
        // Optional: Clear at least this many tokens
        clear_at_least: {
          type: "input_tokens",
          value: 5000
        },
        // Exclude these tools from being cleared
        exclude_tools: ["web_search"]
      }
    ]
  }
});
```

</CodeGroup>

## Aperçu

La modification du contexte vous permet de gérer automatiquement le contexte de la conversation à mesure qu'il se développe, vous aidant à optimiser les coûts et à rester dans les limites de la fenêtre de contexte. Vous pouvez utiliser des stratégies API côté serveur, des fonctionnalités SDK côté client, ou les deux ensemble.

| Approche | Où elle s'exécute | Stratégies | Comment cela fonctionne |
|----------|---------------|------------|--------------|
| **Côté serveur** | API | Effacement des résultats d'outils (`clear_tool_uses_20250919`)<br/>Effacement des blocs de réflexion (`clear_thinking_20251015`) | Appliqué avant que l'invite n'atteigne Claude. Efface le contenu spécifique de l'historique de conversation. Chaque stratégie peut être configurée indépendamment. |
| **Côté client** | SDK | Compaction | Disponible dans les [SDK Python et TypeScript](/docs/fr/api/client-sdks) lors de l'utilisation de [`tool_runner`](/docs/fr/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta). Génère un résumé et remplace l'historique complet de la conversation. Voir [Compaction](#client-side-compaction-sdk) ci-dessous. |

## Stratégies côté serveur

<Note>
La modification du contexte est actuellement en version bêta avec support pour l'effacement des résultats d'outils et l'effacement des blocs de réflexion. Pour l'activer, utilisez l'en-tête bêta `context-management-2025-06-27` dans vos demandes API.

Veuillez nous contacter via notre [formulaire de commentaires](https://forms.gle/YXC2EKGMhjN1c4L88) pour partager vos commentaires sur cette fonctionnalité.
</Note>

### Effacement des résultats d'outils

La stratégie `clear_tool_uses_20250919` efface les résultats d'outils lorsque le contexte de la conversation dépasse votre seuil configuré. Lorsqu'elle est activée, l'API efface automatiquement les résultats d'outils les plus anciens dans l'ordre chronologique, en les remplaçant par un texte d'espace réservé pour informer Claude que le résultat de l'outil a été supprimé. Par défaut, seuls les résultats d'outils sont effacés. Vous pouvez éventuellement effacer à la fois les résultats d'outils et les appels d'outils (les paramètres d'utilisation d'outils) en définissant `clear_tool_inputs` sur true.

### Effacement des blocs de réflexion

La stratégie `clear_thinking_20251015` gère les blocs `thinking` dans les conversations lorsque la réflexion étendue est activée. Cette stratégie efface automatiquement les blocs de réflexion plus anciens des tours précédents.

<Tip>
**Comportement par défaut** : Lorsque la réflexion étendue est activée sans configurer la stratégie `clear_thinking_20251015`, l'API conserve automatiquement uniquement les blocs de réflexion du dernier tour d'assistant (équivalent à `keep: {type: "thinking_turns", value: 1}`).

Pour maximiser les accès au cache, conservez tous les blocs de réflexion en définissant `keep: "all"`.
</Tip>

<Note>
Un tour de conversation d'assistant peut inclure plusieurs blocs de contenu (par exemple lors de l'utilisation d'outils) et plusieurs blocs de réflexion (par exemple avec la [réflexion entrelacée](/docs/fr/build-with-claude/extended-thinking#interleaved-thinking)).
</Note>

<Tip>
**La modification du contexte se fait côté serveur**

La modification du contexte est appliquée **côté serveur** avant que l'invite n'atteigne Claude. Votre application cliente maintient l'historique complet et non modifié de la conversation—vous n'avez pas besoin de synchroniser l'état de votre client avec la version modifiée. Continuez à gérer votre historique complet de conversation localement comme vous le feriez normalement.
</Tip>

<Tip>
**Modification du contexte et mise en cache des invites**

L'interaction de la modification du contexte avec la [mise en cache des invites](/docs/fr/build-with-claude/prompt-caching) varie selon la stratégie :

- **Effacement des résultats d'outils** : Invalide les préfixes d'invite mis en cache lorsque le contenu est effacé. Pour tenir compte de cela, nous recommandons d'effacer suffisamment de jetons pour que l'invalidation du cache en vaille la peine. Utilisez le paramètre `clear_at_least` pour garantir qu'un nombre minimum de jetons est effacé à chaque fois. Vous engagerez des coûts d'écriture de cache chaque fois que le contenu est effacé, mais les demandes ultérieures peuvent réutiliser le préfixe nouvellement mis en cache.

- **Effacement des blocs de réflexion** : Lorsque les blocs de réflexion sont **conservés** dans le contexte (non effacés), le cache d'invite est préservé, permettant les accès au cache et réduisant les coûts des jetons d'entrée. Lorsque les blocs de réflexion sont **effacés**, le cache est invalidé au point où l'effacement se produit. Configurez le paramètre `keep` selon que vous souhaitez prioriser les performances du cache ou la disponibilité de la fenêtre de contexte.
</Tip>

## Modèles pris en charge

La modification du contexte est disponible sur :

- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)
- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)

## Utilisation de l'effacement des résultats d'outils

Le moyen le plus simple d'activer l'effacement des résultats d'outils est de spécifier uniquement le type de stratégie, car toutes les autres [options de configuration](#configuration-options-for-tool-result-clearing) utiliseront leurs valeurs par défaut :

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": "Search for recent developments in AI"
            }
        ],
        "tools": [
            {
                "type": "web_search_20250305",
                "name": "web_search"
            }
        ],
        "context_management": {
            "edits": [
                {"type": "clear_tool_uses_20250919"}
            ]
        }
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Search for recent developments in AI"
        }
    ],
    tools=[
        {
            "type": "web_search_20250305",
            "name": "web_search"
        }
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {"type": "clear_tool_uses_20250919"}
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
  messages: [
    {
      role: "user",
      content: "Search for recent developments in AI"
    }
  ],
  tools: [
    {
      type: "web_search_20250305",
      name: "web_search"
    }
  ],
  context_management: {
    edits: [
      { type: "clear_tool_uses_20250919" }
    ]
  },
  betas: ["context-management-2025-06-27"]
});
```

</CodeGroup>

### Configuration avancée

Vous pouvez personnaliser le comportement d'effacement des résultats d'outils avec des paramètres supplémentaires :

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": "Create a simple command line calculator app using Python"
            }
        ],
        "tools": [
            {
                "type": "text_editor_20250728",
                "name": "str_replace_based_edit_tool",
                "max_characters": 10000
            },
            {
                "type": "web_search_20250305",
                "name": "web_search",
                "max_uses": 3
            }
        ],
        "context_management": {
            "edits": [
                {
                    "type": "clear_tool_uses_20250919",
                    "trigger": {
                        "type": "input_tokens",
                        "value": 30000
                    },
                    "keep": {
                        "type": "tool_uses",
                        "value": 3
                    },
                    "clear_at_least": {
                        "type": "input_tokens",
                        "value": 5000
                    },
                    "exclude_tools": ["web_search"]
                }
            ]
        }
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Create a simple command line calculator app using Python"
        }
    ],
    tools=[
        {
            "type": "text_editor_20250728",
            "name": "str_replace_based_edit_tool",
            "max_characters": 10000
        },
        {
            "type": "web_search_20250305",
            "name": "web_search",
            "max_uses": 3
        }
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_tool_uses_20250919",
                # Trigger clearing when threshold is exceeded
                "trigger": {
                    "type": "input_tokens",
                    "value": 30000
                },
                # Number of tool uses to keep after clearing
                "keep": {
                    "type": "tool_uses",
                    "value": 3
                },
                # Optional: Clear at least this many tokens
                "clear_at_least": {
                    "type": "input_tokens",
                    "value": 5000
                },
                # Exclude these tools from being cleared
                "exclude_tools": ["web_search"]
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
  messages: [
    {
      role: "user",
      content: "Create a simple command line calculator app using Python"
    }
  ],
  tools: [
    {
      type: "text_editor_20250728",
      name: "str_replace_based_edit_tool",
      max_characters: 10000
    },
    {
      type: "web_search_20250305",
      name: "web_search",
      max_uses: 3
    }
  ],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_tool_uses_20250919",
        // Trigger clearing when threshold is exceeded
        trigger: {
          type: "input_tokens",
          value: 30000
        },
        // Number of tool uses to keep after clearing
        keep: {
          type: "tool_uses",
          value: 3
        },
        // Optional: Clear at least this many tokens
        clear_at_least: {
          type: "input_tokens",
          value: 5000
        },
        // Exclude these tools from being cleared
        exclude_tools: ["web_search"]
      }
    ]
  }
});
```

</CodeGroup>

## Utilisation de l'effacement des blocs de réflexion

Activez l'effacement des blocs de réflexion pour gérer efficacement le contexte et la mise en cache des invites lorsque la réflexion étendue est activée :

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5-20250929",
        "max_tokens": 1024,
        "messages": [...],
        "thinking": {
            "type": "enabled",
            "budget_tokens": 10000
        },
        "context_management": {
            "edits": [
                {
                    "type": "clear_thinking_20251015",
                    "keep": {
                        "type": "thinking_turns",
                        "value": 2
                    }
                }
            ]
        }
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[...],
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_thinking_20251015",
                "keep": {
                    "type": "thinking_turns",
                    "value": 2
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
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  messages: [...],
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_thinking_20251015",
        keep: {
          type: "thinking_turns",
          value: 2
        }
      }
    ]
  }
});
```

</CodeGroup>

### Options de configuration pour l'effacement des blocs de réflexion

La stratégie `clear_thinking_20251015` prend en charge la configuration suivante :

| Option de configuration | Par défaut | Description |
|---------------------|---------|-------------|
| `keep` | `{type: "thinking_turns", value: 1}` | Définit le nombre de tours d'assistant récents avec blocs de réflexion à conserver. Utilisez `{type: "thinking_turns", value: N}` où N doit être > 0 pour conserver les N derniers tours, ou `"all"` pour conserver tous les blocs de réflexion. |

**Exemples de configurations :**

```json
// Conserver les blocs de réflexion des 3 derniers tours d'assistant
{
  "type": "clear_thinking_20251015",
  "keep": {
    "type": "thinking_turns",
    "value": 3
  }
}

// Conserver tous les blocs de réflexion (maximise les accès au cache)
{
  "type": "clear_thinking_20251015",
  "keep": "all"
}
```

### Options de configuration pour l'effacement des blocs de réflexion

La stratégie `clear_thinking_20251015` prend en charge la configuration suivante :

| Option de configuration | Par défaut | Description |
|---------------------|---------|-------------|
| `keep` | `{type: "thinking_turns", value: 1}` | Définit le nombre de tours d'assistant récents avec blocs de réflexion à conserver. Utilisez `{type: "thinking_turns", value: N}` où N doit être > 0 pour conserver les N derniers tours, ou `"all"` pour conserver tous les blocs de réflexion. |

**Exemples de configurations :**

```json
// Conserver les blocs de réflexion des 3 derniers tours d'assistant
{
  "type": "clear_thinking_20251015",
  "keep": {
    "type": "thinking_turns",
    "value": 3
  }
}

// Conserver tous les blocs de réflexion (maximise les accès au cache)
{
  "type": "clear_thinking_20251015",
  "keep": "all"
}
```

### Combinaison de stratégies

Vous pouvez utiliser à la fois l'effacement des blocs de réflexion et l'effacement des résultats d'outils ensemble :

<Note>
Lors de l'utilisation de plusieurs stratégies, la stratégie `clear_thinking_20251015` doit être listée en premier dans le tableau `edits`.
</Note>

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[...],
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    tools=[...],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_thinking_20251015",
                "keep": {
                    "type": "thinking_turns",
                    "value": 2
                }
            },
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {
                    "type": "input_tokens",
                    "value": 50000
                },
                "keep": {
                    "type": "tool_uses",
                    "value": 5
                }
            }
        ]
    }
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  messages: [...],
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  tools: [...],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_thinking_20251015",
        keep: {
          type: "thinking_turns",
          value: 2
        }
      },
      {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: 50000
        },
        keep: {
          type: "tool_uses",
          value: 5
        }
      }
    ]
  }
});
```

</CodeGroup>

### Options de configuration pour l'effacement des blocs de réflexion

La stratégie `clear_thinking_20251015` prend en charge la configuration suivante :

| Option de configuration | Par défaut | Description |
|---------------------|---------|-------------|
| `keep` | `{type: "thinking_turns", value: 1}` | Définit le nombre de tours d'assistant récents avec blocs de réflexion à conserver. Utilisez `{type: "thinking_turns", value: N}` où N doit être > 0 pour conserver les N derniers tours, ou `"all"` pour conserver tous les blocs de réflexion. |

**Exemples de configurations :**

```json
// Conserver les blocs de réflexion des 3 derniers tours d'assistant
{
  "type": "clear_thinking_20251015",
  "keep": {
    "type": "thinking_turns",
    "value": 3
  }
}

// Conserver tous les blocs de réflexion (maximise les accès au cache)
{
  "type": "clear_thinking_20251015",
  "keep": "all"
}
```

### Combinaison de stratégies

Vous pouvez utiliser à la fois l'effacement des blocs de réflexion et l'effacement des résultats d'outils ensemble :

<Note>
Lors de l'utilisation de plusieurs stratégies, la stratégie `clear_thinking_20251015` doit être listée en premier dans le tableau `edits`.
</Note>

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[...],
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    tools=[...],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_thinking_20251015",
                "keep": {
                    "type": "thinking_turns",
                    "value": 2
                }
            },
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {
                    "type": "input_tokens",
                    "value": 50000
                },
                "keep": {
                    "type": "tool_uses",
                    "value": 5
                }
            }
        ]
    }
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  messages: [...],
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  tools: [...],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_thinking_20251015",
        keep: {
          type: "thinking_turns",
          value: 2
        }
      },
      {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: 50000
        },
        keep: {
          type: "tool_uses",
          value: 5
        }
      }
    ]
  }
});
```

</CodeGroup>

## Options de configuration pour l'effacement des résultats d'outils

| Option de configuration | Par défaut | Description |
|---------------------|---------|-------------|
| `trigger` | 100 000 jetons d'entrée | Définit quand la stratégie de modification du contexte s'active. Une fois que l'invite dépasse ce seuil, l'effacement commencera. Vous pouvez spécifier cette valeur en `input_tokens` ou `tool_uses`. |
| `keep` | 3 utilisations d'outils | Définit le nombre de paires récentes d'utilisation/résultat d'outils à conserver après l'effacement. L'API supprime d'abord les interactions d'outils les plus anciennes, en préservant les plus récentes. |
| `clear_at_least` | Aucun | Garantit qu'un nombre minimum de jetons est effacé chaque fois que la stratégie s'active. Si l'API ne peut pas effacer au moins le montant spécifié, la stratégie ne sera pas appliquée. Cela aide à déterminer si l'effacement du contexte vaut la peine de casser votre cache d'invite. |
| `exclude_tools` | Aucun | Liste des noms d'outils dont les utilisations et résultats d'outils ne doivent jamais être effacés. Utile pour préserver le contexte important. |
| `clear_tool_inputs` | `false` | Contrôle si les paramètres d'appel d'outil sont effacés avec les résultats d'outils. Par défaut, seuls les résultats d'outils sont effacés tout en gardant les appels d'outils originaux de Claude visibles. |

### Options de configuration pour l'effacement des blocs de réflexion

La stratégie `clear_thinking_20251015` prend en charge la configuration suivante :

| Option de configuration | Par défaut | Description |
|---------------------|---------|-------------|
| `keep` | `{type: "thinking_turns", value: 1}` | Définit le nombre de tours d'assistant récents avec blocs de réflexion à conserver. Utilisez `{type: "thinking_turns", value: N}` où N doit être > 0 pour conserver les N derniers tours, ou `"all"` pour conserver tous les blocs de réflexion. |

**Exemples de configurations :**

```json
// Conserver les blocs de réflexion des 3 derniers tours d'assistant
{
  "type": "clear_thinking_20251015",
  "keep": {
    "type": "thinking_turns",
    "value": 3
  }
}

// Conserver tous les blocs de réflexion (maximise les accès au cache)
{
  "type": "clear_thinking_20251015",
  "keep": "all"
}
```

### Combinaison de stratégies

Vous pouvez utiliser à la fois l'effacement des blocs de réflexion et l'effacement des résultats d'outils ensemble :

<Note>
Lors de l'utilisation de plusieurs stratégies, la stratégie `clear_thinking_20251015` doit être listée en premier dans le tableau `edits`.
</Note>

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[...],
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    tools=[...],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_thinking_20251015",
                "keep": {
                    "type": "thinking_turns",
                    "value": 2
                }
            },
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {
                    "type": "input_tokens",
                    "value": 50000
                },
                "keep": {
                    "type": "tool_uses",
                    "value": 5
                }
            }
        ]
    }
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  messages: [...],
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  tools: [...],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_thinking_20251015",
        keep: {
          type: "thinking_turns",
          value: 2
        }
      },
      {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: 50000
        },
        keep: {
          type: "tool_uses",
          value: 5
        }
      }
    ]
  }
});
```

</CodeGroup>

## Options de configuration pour l'effacement des résultats d'outils

| Option de configuration | Par défaut | Description |
|---------------------|---------|-------------|
| `trigger` | 100 000 jetons d'entrée | Définit quand la stratégie de modification du contexte s'active. Une fois que l'invite dépasse ce seuil, l'effacement commencera. Vous pouvez spécifier cette valeur en `input_tokens` ou `tool_uses`. |
| `keep` | 3 utilisations d'outils | Définit le nombre de paires récentes d'utilisation/résultat d'outils à conserver après l'effacement. L'API supprime d'abord les interactions d'outils les plus anciennes, en préservant les plus récentes. |
| `clear_at_least` | Aucun | Garantit qu'un nombre minimum de jetons est effacé chaque fois que la stratégie s'active. Si l'API ne peut pas effacer au moins le montant spécifié, la stratégie ne sera pas appliquée. Cela aide à déterminer si l'effacement du contexte vaut la peine de casser votre cache d'invite. |
| `exclude_tools` | Aucun | Liste des noms d'outils dont les utilisations et résultats d'outils ne doivent jamais être effacés. Utile pour préserver le contexte important. |
| `clear_tool_inputs` | `false` | Contrôle si les paramètres d'appel d'outil sont effacés avec les résultats d'outils. Par défaut, seuls les résultats d'outils sont effacés tout en gardant les appels d'outils originaux de Claude visibles. |

## Réponse de modification du contexte

Vous pouvez voir quelles modifications de contexte ont été appliquées à votre demande en utilisant le champ de réponse `context_management`, ainsi que des statistiques utiles sur le contenu et les jetons d'entrée effacés.

```json Response
{
    "id": "msg_013Zva2CMHLNnXjNJJKqJ2EF",
    "type": "message",
    "role": "assistant",
    "content": [...],
    "usage": {...},
    "context_management": {
        "applied_edits": [
            // When using `clear_thinking_20251015`
            {
                "type": "clear_thinking_20251015",
                "cleared_thinking_turns": 3,
                "cleared_input_tokens": 15000
            },
            // When using `clear_tool_uses_20250919`
            {
                "type": "clear_tool_uses_20250919",
                "cleared_tool_uses": 8,
                "cleared_input_tokens": 50000
            }
        ]
    }
}
```

Pour les réponses en streaming, les modifications de contexte seront incluses dans l'événement final `message_delta` :

```json Streaming Response
{
    "type": "message_delta",
    "delta": {
        "stop_reason": "end_turn",
        "stop_sequence": null
    },
    "usage": {
        "output_tokens": 1024
    },
    "context_management": {
        "applied_edits": [...]
    }
}
```

### Options de configuration pour l'effacement des blocs de réflexion

La stratégie `clear_thinking_20251015` prend en charge la configuration suivante :

| Option de configuration | Par défaut | Description |
|---------------------|---------|-------------|
| `keep` | `{type: "thinking_turns", value: 1}` | Définit le nombre de tours d'assistant récents avec des blocs de réflexion à conserver. Utilisez `{type: "thinking_turns", value: N}` où N doit être > 0 pour conserver les N derniers tours, ou `"all"` pour conserver tous les blocs de réflexion. |

**Exemples de configurations :**

```json
// Conserver les blocs de réflexion des 3 derniers tours d'assistant
{
  "type": "clear_thinking_20251015",
  "keep": {
    "type": "thinking_turns",
    "value": 3
  }
}

// Conserver tous les blocs de réflexion (maximise les accès au cache)
{
  "type": "clear_thinking_20251015",
  "keep": "all"
}
```

### Combinaison de stratégies

Vous pouvez utiliser à la fois l'effacement des blocs de réflexion et l'effacement des résultats d'outils ensemble :

<Note>
Lors de l'utilisation de plusieurs stratégies, la stratégie `clear_thinking_20251015` doit être listée en premier dans le tableau `edits`.
</Note>

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[...],
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    tools=[...],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_thinking_20251015",
                "keep": {
                    "type": "thinking_turns",
                    "value": 2
                }
            },
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {
                    "type": "input_tokens",
                    "value": 50000
                },
                "keep": {
                    "type": "tool_uses",
                    "value": 5
                }
            }
        ]
    }
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  messages: [...],
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  tools: [...],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_thinking_20251015",
        keep: {
          type: "thinking_turns",
          value: 2
        }
      },
      {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: 50000
        },
        keep: {
          type: "tool_uses",
          value: 5
        }
      }
    ]
  }
});
```

</CodeGroup>

## Options de configuration pour l'effacement des résultats d'outils

| Option de configuration | Par défaut | Description |
|---------------------|---------|-------------|
| `trigger` | 100 000 jetons d'entrée | Définit quand la stratégie d'édition de contexte s'active. Une fois que l'invite dépasse ce seuil, l'effacement commence. Vous pouvez spécifier cette valeur en `input_tokens` ou `tool_uses`. |
| `keep` | 3 utilisations d'outils | Définit le nombre de paires récentes d'utilisation/résultat d'outils à conserver après l'effacement. L'API supprime d'abord les interactions d'outils les plus anciennes, en préservant les plus récentes. |
| `clear_at_least` | Aucun | Garantit qu'un nombre minimum de jetons est effacé chaque fois que la stratégie s'active. Si l'API ne peut pas effacer au moins le montant spécifié, la stratégie ne sera pas appliquée. Cela aide à déterminer si l'effacement de contexte vaut la peine de casser votre cache d'invite. |
| `exclude_tools` | Aucun | Liste des noms d'outils dont les utilisations et résultats d'outils ne doivent jamais être effacés. Utile pour préserver un contexte important. |
| `clear_tool_inputs` | `false` | Contrôle si les paramètres d'appel d'outil sont effacés avec les résultats d'outils. Par défaut, seuls les résultats d'outils sont effacés tandis que les appels d'outils originaux de Claude restent visibles. |

## Réponse d'édition de contexte

Vous pouvez voir quelles éditions de contexte ont été appliquées à votre demande en utilisant le champ de réponse `context_management`, ainsi que des statistiques utiles sur le contenu et les jetons d'entrée effacés.

```json Response
{
    "id": "msg_013Zva2CMHLNnXjNJJKqJ2EF",
    "type": "message",
    "role": "assistant",
    "content": [...],
    "usage": {...},
    "context_management": {
        "applied_edits": [
            // Lors de l'utilisation de `clear_thinking_20251015`
            {
                "type": "clear_thinking_20251015",
                "cleared_thinking_turns": 3,
                "cleared_input_tokens": 15000
            },
            // Lors de l'utilisation de `clear_tool_uses_20250919`
            {
                "type": "clear_tool_uses_20250919",
                "cleared_tool_uses": 8,
                "cleared_input_tokens": 50000
            }
        ]
    }
}
```

Pour les réponses en streaming, les éditions de contexte seront incluses dans l'événement final `message_delta` :

```json Streaming Response
{
    "type": "message_delta",
    "delta": {
        "stop_reason": "end_turn",
        "stop_sequence": null
    },
    "usage": {
        "output_tokens": 1024
    },
    "context_management": {
        "applied_edits": [...]
    }
}
```

## Comptage des jetons

Le point de terminaison [comptage des jetons](/docs/fr/build-with-claude/token-counting) prend en charge la gestion du contexte, ce qui vous permet de prévisualiser le nombre de jetons que votre invite utilisera après l'application de l'édition de contexte.

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages/count_tokens \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "messages": [
            {
                "role": "user",
                "content": "Continue our conversation..."
            }
        ],
        "tools": [...],
        "context_management": {
            "edits": [
                {
                    "type": "clear_tool_uses_20250919",
                    "trigger": {
                        "type": "input_tokens",
                        "value": 30000
                    },
                    "keep": {
                        "type": "tool_uses",
                        "value": 5
                    }
                }
            ]
        }
    }'
```

```python Python
response = client.beta.messages.count_tokens(
    model="claude-sonnet-4-5",
    messages=[
        {
            "role": "user",
            "content": "Continue our conversation..."
        }
    ],
    tools=[...],  # Your tool definitions
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {
                    "type": "input_tokens",
                    "value": 30000
                },
                "keep": {
                    "type": "tool_uses",
                    "value": 5
                }
            }
        ]
    }
)

print(f"Original tokens: {response.context_management['original_input_tokens']}")
print(f"After clearing: {response.input_tokens}")
print(f"Savings: {response.context_management['original_input_tokens'] - response.input_tokens} tokens")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.countTokens({
  model: "claude-sonnet-4-5",
  messages: [
    {
      role: "user",
      content: "Continue our conversation..."
    }
  ],
  tools: [...],  // Your tool definitions
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: 30000
        },
        keep: {
          type: "tool_uses",
          value: 5
        }
      }
    ]
  }
});

console.log(`Original tokens: ${response.context_management?.original_input_tokens}`);
console.log(`After clearing: ${response.input_tokens}`);
console.log(`Savings: ${(response.context_management?.original_input_tokens || 0) - response.input_tokens} tokens`);
```
</CodeGroup>

```json Response
{
    "input_tokens": 25000,
    "context_management": {
        "original_input_tokens": 70000
    }
}
```

La réponse affiche à la fois le nombre final de jetons après l'application de la gestion du contexte (`input_tokens`) et le nombre original de jetons avant tout effacement (`original_input_tokens`).

## Utilisation avec l'outil Mémoire

L'édition de contexte peut être combinée avec l'[outil mémoire](/docs/fr/agents-and-tools/tool-use/memory-tool). Lorsque votre contexte de conversation approche du seuil d'effacement configuré, Claude reçoit un avertissement automatique pour préserver les informations importantes. Cela permet à Claude d'enregistrer les résultats d'outils ou le contexte dans ses fichiers mémoire avant qu'ils ne soient effacés de l'historique de conversation.

Cette combinaison vous permet de :

- **Préserver le contexte important** : Claude peut écrire les informations essentielles des résultats d'outils dans les fichiers mémoire avant que ces résultats ne soient effacés
- **Maintenir les flux de travail de longue durée** : Activer les flux de travail d'agent qui dépasseraient autrement les limites de contexte en déchargeant les informations vers un stockage persistant
- **Accéder aux informations à la demande** : Claude peut rechercher les informations précédemment effacées à partir des fichiers mémoire si nécessaire, plutôt que de tout conserver dans la fenêtre de contexte active

Par exemple, dans un flux de travail d'édition de fichiers où Claude effectue de nombreuses opérations, Claude peut résumer les modifications terminées dans les fichiers mémoire à mesure que le contexte augmente. Lorsque les résultats d'outils sont effacés, Claude conserve l'accès à ces informations via son système de mémoire et peut continuer à travailler efficacement.

Pour utiliser les deux fonctionnalités ensemble, activez-les dans votre demande d'API :

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
            {"type": "clear_tool_uses_20250919"}
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
      { type: "clear_tool_uses_20250919" }
    ]
  }
});
```

</CodeGroup>

## Compaction côté client (SDK)

<Note>
La compaction est disponible dans les [SDK Python et TypeScript](/docs/fr/api/client-sdks) lors de l'utilisation de la [méthode `tool_runner`](/docs/fr/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta).
</Note>

La compaction est une fonctionnalité du SDK qui gère automatiquement le contexte de conversation en générant des résumés lorsque l'utilisation des jetons devient trop importante. Contrairement aux stratégies d'édition de contexte côté serveur qui effacent le contenu, la compaction demande à Claude de résumer l'historique de conversation, puis remplace l'historique complet par ce résumé. Cela permet à Claude de continuer à travailler sur des tâches de longue durée qui dépasseraient autrement la [fenêtre de contexte](/docs/fr/build-with-claude/context-windows).

### Fonctionnement de la compaction

Lorsque la compaction est activée, le SDK surveille l'utilisation des jetons après chaque réponse du modèle :

1. **Vérification du seuil** : Le SDK calcule le total des jetons comme `input_tokens + cache_creation_input_tokens + cache_read_input_tokens + output_tokens`
2. **Génération du résumé** : Lorsque le seuil est dépassé, une demande de résumé est injectée comme un tour utilisateur, et Claude génère un résumé structuré enveloppé dans des balises `<summary></summary>`
3. **Remplacement du contexte** : Le SDK extrait le résumé et remplace l'historique complet des messages par celui-ci
4. **Continuation** : La conversation reprend à partir du résumé, Claude reprenant là où il s'était arrêté

### Utilisation de la compaction

Ajoutez `compaction_control` à votre appel `tool_runner` :

<CodeGroup>

```python Python
import anthropic

client = anthropic.Anthropic()

runner = client.beta.messages.tool_runner(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    tools=[...],
    messages=[
        {
            "role": "user",
            "content": "Analyze all the files in this directory and write a summary report."
        }
    ],
    compaction_control={
        "enabled": True,
        "context_token_threshold": 100000
    }
)

for message in runner:
    print(f"Tokens used: {message.usage.input_tokens}")

final = runner.until_done()
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const runner = client.beta.messages.toolRunner({
    model: 'claude-sonnet-4-5',
    max_tokens: 4096,
    tools: [...],
    messages: [
        {
            role: 'user',
            content: 'Analyze all the files in this directory and write a summary report.'
        }
    ],
    compactionControl: {
        enabled: true,
        contextTokenThreshold: 100000
    }
});

for await (const message of runner) {
    console.log('Tokens used:', message.usage.input_tokens);
}

const finalMessage = await runner.runUntilDone();
```

</CodeGroup>

#### Ce qui se passe pendant la compaction

À mesure que la conversation grandit, l'historique des messages s'accumule :

**Avant la compaction (approchant 100k jetons) :**
```json
[
  { "role": "user", "content": "Analyze all files and write a report..." },
  { "role": "assistant", "content": "I'll help. Let me start by reading..." },
  { "role": "user", "content": [{ "type": "tool_result", "tool_use_id": "...", "content": "..." }] },
  { "role": "assistant", "content": "Based on file1.txt, I see..." },
  { "role": "user", "content": [{ "type": "tool_result", "tool_use_id": "...", "content": "..." }] },
  { "role": "assistant", "content": "After analyzing file2.txt..." },
  // ... 50 more exchanges like this ...
]
```

Lorsque les jetons dépassent le seuil, le SDK injecte une demande de résumé et Claude génère un résumé. L'historique entier est ensuite remplacé :

**Après la compaction (retour à ~2-3k jetons) :**
```json
[
  {
    "role": "assistant",
    "content": "# Task Overview\nThe user requested analysis of directory files to produce a summary report...\n\n# Current State\nAnalyzed 52 files across 3 subdirectories. Key findings documented in report.md...\n\n# Important Discoveries\n- Configuration files use YAML format\n- Found 3 deprecated dependencies\n- Test coverage at 67%\n\n# Next Steps\n1. Analyze remaining files in /src/legacy\n2. Complete final report sections...\n\n# Context to Preserve\nUser prefers markdown format with executive summary first..."
  }
]
```

Claude continue à travailler à partir de ce résumé comme s'il s'agissait de l'historique de conversation original.

### Options de configuration

| Paramètre | Type | Requis | Par défaut | Description |
|-----------|------|----------|---------|-------------|
| `enabled` | booléen | Oui | - | Si la compaction automatique est activée |
| `context_token_threshold` | nombre | Non | 100 000 | Nombre de jetons auquel la compaction se déclenche |
| `model` | chaîne | Non | Même modèle que le modèle principal | Modèle à utiliser pour générer les résumés |
| `summary_prompt` | chaîne | Non | Voir ci-dessous | Invite personnalisée pour la génération de résumé |

#### Choix d'un seuil de jetons

Le seuil détermine quand la compaction se produit. Un seuil inférieur signifie des compactions plus fréquentes avec des fenêtres de contexte plus petites. Un seuil plus élevé permet plus de contexte mais risque d'atteindre les limites.

<CodeGroup>

```python Python
# Compaction plus fréquente pour les scénarios à mémoire limitée
compaction_control={
    "enabled": True,
    "context_token_threshold": 50000
}

# Compaction moins fréquente lorsque vous avez besoin de plus de contexte
compaction_control={
    "enabled": True,
    "context_token_threshold": 150000
}
```

```typescript TypeScript
// Compaction plus fréquente pour les scénarios à mémoire limitée
compactionControl: {
    enabled: true,
    contextTokenThreshold: 50000
}

// Compaction moins fréquente lorsque vous avez besoin de plus de contexte
compactionControl: {
    enabled: true,
    contextTokenThreshold: 150000
}
```

</CodeGroup>

#### Utilisation d'un modèle différent pour les résumés

Vous pouvez utiliser un modèle plus rapide ou moins cher pour générer les résumés :

<CodeGroup>

```python Python
compaction_control={
    "enabled": True,
    "context_token_threshold": 100000,
    "model": "claude-haiku-4-5"
}
```

```typescript TypeScript
compactionControl: {
    enabled: true,
    contextTokenThreshold: 100000,
    model: 'claude-haiku-4-5'
}
```

</CodeGroup>

#### Invites de résumé personnalisées

Vous pouvez fournir une invite personnalisée pour les besoins spécifiques au domaine. Votre invite doit demander à Claude d'envelopper son résumé dans des balises `<summary></summary>`.

<CodeGroup>

```python Python
compaction_control={
    "enabled": True,
    "context_token_threshold": 100000,
    "summary_prompt": """Summarize the research conducted so far, including:
- Sources consulted and key findings
- Questions answered and remaining unknowns
- Recommended next steps

Wrap your summary in <summary></summary> tags."""
}
```

```typescript TypeScript
compactionControl: {
    enabled: true,
    contextTokenThreshold: 100000,
    summaryPrompt: `Summarize the research conducted so far, including:
- Sources consulted and key findings
- Questions answered and remaining unknowns
- Recommended next steps

Wrap your summary in <summary></summary> tags.`
}
```

</CodeGroup>

## Utilisation avec l'outil Memory

La modification du contexte peut être combinée avec l'[outil memory](/docs/fr/agents-and-tools/tool-use/memory-tool). Lorsque votre contexte de conversation approche du seuil d'effacement configuré, Claude reçoit un avertissement automatique pour préserver les informations importantes. Cela permet à Claude d'enregistrer les résultats des outils ou le contexte dans ses fichiers mémoire avant qu'ils ne soient effacés de l'historique de conversation.

Cette combinaison vous permet de :

- **Préserver le contexte important** : Claude peut écrire les informations essentielles des résultats des outils dans les fichiers mémoire avant que ces résultats ne soient effacés
- **Maintenir les flux de travail de longue durée** : Activer les flux de travail d'agent qui dépasseraient autrement les limites de contexte en déchargeant les informations vers un stockage persistant
- **Accéder aux informations à la demande** : Claude peut rechercher les informations précédemment effacées dans les fichiers mémoire si nécessaire, plutôt que de conserver tout dans la fenêtre de contexte active

Par exemple, dans un flux de travail d'édition de fichiers où Claude effectue de nombreuses opérations, Claude peut résumer les modifications terminées dans les fichiers mémoire à mesure que le contexte augmente. Lorsque les résultats des outils sont effacés, Claude conserve l'accès à ces informations via son système de mémoire et peut continuer à travailler efficacement.

Pour utiliser les deux fonctionnalités ensemble, activez-les dans votre requête API :

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
            {"type": "clear_tool_uses_20250919"}
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
      { type: "clear_tool_uses_20250919" }
    ]
  }
});
```

</CodeGroup>

## Compaction côté client (SDK)

<Note>
La compaction est disponible dans les [SDK Python et TypeScript](/docs/fr/api/client-sdks) lors de l'utilisation de la [méthode `tool_runner`](/docs/fr/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta).
</Note>

La compaction est une fonctionnalité du SDK qui gère automatiquement le contexte de conversation en générant des résumés lorsque l'utilisation des jetons devient trop importante. Contrairement aux stratégies de modification du contexte côté serveur qui effacent le contenu, la compaction demande à Claude de résumer l'historique de conversation, puis remplace l'historique complet par ce résumé. Cela permet à Claude de continuer à travailler sur des tâches de longue durée qui dépasseraient autrement la [fenêtre de contexte](/docs/fr/build-with-claude/context-windows).

### Fonctionnement de la compaction

Lorsque la compaction est activée, le SDK surveille l'utilisation des jetons après chaque réponse du modèle :

1. **Vérification du seuil** : Le SDK calcule le total des jetons comme `input_tokens + cache_creation_input_tokens + cache_read_input_tokens + output_tokens`
2. **Génération du résumé** : Lorsque le seuil est dépassé, une invite de résumé est injectée comme un tour utilisateur, et Claude génère un résumé structuré enveloppé dans des balises `<summary></summary>`
3. **Remplacement du contexte** : Le SDK extrait le résumé et remplace l'intégralité de l'historique des messages par celui-ci
4. **Continuation** : La conversation reprend à partir du résumé, Claude reprenant là où il s'était arrêté

### Utilisation de la compaction

Ajoutez `compaction_control` à votre appel `tool_runner` :

<CodeGroup>

```python Python
import anthropic

client = anthropic.Anthropic()

runner = client.beta.messages.tool_runner(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    tools=[...],
    messages=[
        {
            "role": "user",
            "content": "Analyze all the files in this directory and write a summary report."
        }
    ],
    compaction_control={
        "enabled": True,
        "context_token_threshold": 100000
    }
)

for message in runner:
    print(f"Tokens used: {message.usage.input_tokens}")

final = runner.until_done()
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const runner = client.beta.messages.toolRunner({
    model: 'claude-sonnet-4-5',
    max_tokens: 4096,
    tools: [...],
    messages: [
        {
            role: 'user',
            content: 'Analyze all the files in this directory and write a summary report.'
        }
    ],
    compactionControl: {
        enabled: true,
        contextTokenThreshold: 100000
    }
});

for await (const message of runner) {
    console.log('Tokens used:', message.usage.input_tokens);
}

const finalMessage = await runner.runUntilDone();
```

</CodeGroup>

#### Ce qui se passe pendant la compaction

À mesure que la conversation se développe, l'historique des messages s'accumule :

**Avant la compaction (approchant 100k jetons) :**
```json
[
  { "role": "user", "content": "Analyze all files and write a report..." },
  { "role": "assistant", "content": "I'll help. Let me start by reading..." },
  { "role": "user", "content": [{ "type": "tool_result", "tool_use_id": "...", "content": "..." }] },
  { "role": "assistant", "content": "Based on file1.txt, I see..." },
  { "role": "user", "content": [{ "type": "tool_result", "tool_use_id": "...", "content": "..." }] },
  { "role": "assistant", "content": "After analyzing file2.txt..." },
  // ... 50 more exchanges like this ...
]
```

Lorsque les jetons dépassent le seuil, le SDK injecte une demande de résumé et Claude génère un résumé. L'intégralité de l'historique est ensuite remplacée :

**Après la compaction (retour à ~2-3k jetons) :**
```json
[
  {
    "role": "assistant",
    "content": "# Task Overview\nThe user requested analysis of directory files to produce a summary report...\n\n# Current State\nAnalyzed 52 files across 3 subdirectories. Key findings documented in report.md...\n\n# Important Discoveries\n- Configuration files use YAML format\n- Found 3 deprecated dependencies\n- Test coverage at 67%\n\n# Next Steps\n1. Analyze remaining files in /src/legacy\n2. Complete final report sections...\n\n# Context to Preserve\nUser prefers markdown format with executive summary first..."
  }
]
```

Claude continue à travailler à partir de ce résumé comme s'il s'agissait de l'historique de conversation original.

### Options de configuration

| Paramètre | Type | Requis | Défaut | Description |
|-----------|------|--------|--------|-------------|
| `enabled` | boolean | Oui | - | Activer ou non la compaction automatique |
| `context_token_threshold` | number | Non | 100,000 | Nombre de jetons auquel la compaction se déclenche |
| `model` | string | Non | Même que le modèle principal | Modèle à utiliser pour générer les résumés |
| `summary_prompt` | string | Non | Voir ci-dessous | Invite personnalisée pour la génération de résumé |

#### Choix d'un seuil de jetons

Le seuil détermine quand la compaction se produit. Un seuil inférieur signifie des compactions plus fréquentes avec des fenêtres de contexte plus petites. Un seuil plus élevé permet plus de contexte mais risque d'atteindre les limites.

<CodeGroup>

```python Python
# More frequent compaction for memory-constrained scenarios
compaction_control={
    "enabled": True,
    "context_token_threshold": 50000
}

# Less frequent compaction when you need more context
compaction_control={
    "enabled": True,
    "context_token_threshold": 150000
}
```

```typescript TypeScript
// More frequent compaction for memory-constrained scenarios
compactionControl: {
    enabled: true,
    contextTokenThreshold: 50000
}

// Less frequent compaction when you need more context
compactionControl: {
    enabled: true,
    contextTokenThreshold: 150000
}
```

</CodeGroup>

#### Utilisation d'un modèle différent pour les résumés

Vous pouvez utiliser un modèle plus rapide ou moins cher pour générer les résumés :

<CodeGroup>

```python Python
compaction_control={
    "enabled": True,
    "context_token_threshold": 100000,
    "model": "claude-haiku-4-5"
}
```

```typescript TypeScript
compactionControl: {
    enabled: true,
    contextTokenThreshold: 100000,
    model: 'claude-haiku-4-5'
}
```

</CodeGroup>

#### Invites de résumé personnalisées

Vous pouvez fournir une invite personnalisée pour des besoins spécifiques au domaine. Votre invite doit demander à Claude d'envelopper son résumé dans des balises `<summary></summary>`.

<CodeGroup>

```python Python
compaction_control={
    "enabled": True,
    "context_token_threshold": 100000,
    "summary_prompt": """Summarize the research conducted so far, including:
- Sources consulted and key findings
- Questions answered and remaining unknowns
- Recommended next steps

Wrap your summary in <summary></summary> tags."""
}
```

```typescript TypeScript
compactionControl: {
    enabled: true,
    contextTokenThreshold: 100000,
    summaryPrompt: `Summarize the research conducted so far, including:
- Sources consulted and key findings
- Questions answered and remaining unknowns
- Recommended next steps

Wrap your summary in <summary></summary> tags.`
}
```

</CodeGroup>

### Invite de résumé par défaut

L'invite de résumé intégrée demande à Claude de créer un résumé de continuation structuré incluant :

1. **Aperçu de la tâche** : La demande principale de l'utilisateur, les critères de succès et les contraintes
2. **État actuel** : Ce qui a été complété, les fichiers modifiés et les artefacts produits
3. **Découvertes importantes** : Les contraintes techniques, les décisions prises, les erreurs résolues et les approches échouées
4. **Étapes suivantes** : Les actions spécifiques nécessaires, les blocages et l'ordre de priorité
5. **Contexte à préserver** : Les préférences de l'utilisateur, les détails spécifiques au domaine et les engagements pris

Cette structure permet à Claude de reprendre le travail efficacement sans perdre le contexte important ou répéter les erreurs.

<section title="Afficher l'invite par défaut complète">

```
You have been working on the task described above but have not yet completed it. Write a continuation summary that will allow you (or another instance of yourself) to resume work efficiently in a future context window where the conversation history will be replaced with this summary. Your summary should be structured, concise, and actionable. Include:

1. Task Overview
The user's core request and success criteria
Any clarifications or constraints they specified

2. Current State
What has been completed so far
Files created, modified, or analyzed (with paths if relevant)
Key outputs or artifacts produced

3. Important Discoveries
Technical constraints or requirements uncovered
Decisions made and their rationale
Errors encountered and how they were resolved
What approaches were tried that didn't work (and why)

4. Next Steps
Specific actions needed to complete the task
Any blockers or open questions to resolve
Priority order if multiple steps remain

5. Context to Preserve
User preferences or style requirements
Domain-specific details that aren't obvious
Any promises made to the user

Be concise but complete—err on the side of including information that would prevent duplicate work or repeated mistakes. Write in a way that enables immediate resumption of the task.

Wrap your summary in <summary></summary> tags.
```

</section>

### Limitations

#### Outils côté serveur

<Warning>
La compaction nécessite une considération particulière lors de l'utilisation d'outils côté serveur tels que la [recherche web](/docs/fr/agents-and-tools/tool-use/web-search-tool) ou la [récupération web](/docs/fr/agents-and-tools/tool-use/web-fetch-tool).
</Warning>

Lors de l'utilisation d'outils côté serveur, le SDK peut calculer incorrectement l'utilisation des jetons, ce qui entraîne le déclenchement de la compaction au mauvais moment.

Par exemple, après une opération de recherche web, la réponse de l'API pourrait afficher :

```json
{
  "usage": {
    "input_tokens": 63000,
    "cache_read_input_tokens": 270000,
    "output_tokens": 1400
  }
}
```

Le SDK calcule l'utilisation totale comme 63 000 + 270 000 = 333 000 jetons. Cependant, la valeur `cache_read_input_tokens` inclut les lectures accumulées de plusieurs appels API internes effectués par l'outil côté serveur, et non votre contexte de conversation réel. Votre longueur de contexte réelle pourrait être seulement les 63 000 `input_tokens`, mais le SDK voit 333k et déclenche la compaction prématurément.

**Solutions de contournement :**

- Utilisez le point de terminaison de [comptage des jetons](/docs/fr/build-with-claude/token-counting) pour obtenir la longueur de contexte exacte
- Évitez la compaction lors de l'utilisation extensive d'outils côté serveur

#### Cas limites d'utilisation des outils

Lorsque la compaction est déclenchée alors qu'une réponse d'utilisation d'outil est en attente, le SDK supprime le bloc d'utilisation d'outil de l'historique des messages avant de générer le résumé. Claude réémettrait l'appel d'outil après la reprise à partir du résumé si nécessaire.

### Limitations

#### Outils côté serveur

<Warning>
La compaction nécessite une considération particulière lors de l'utilisation d'outils côté serveur tels que la [recherche web](/docs/fr/agents-and-tools/tool-use/web-search-tool) ou la [récupération web](/docs/fr/agents-and-tools/tool-use/web-fetch-tool).
</Warning>

Lors de l'utilisation d'outils côté serveur, le SDK peut calculer incorrectement l'utilisation des jetons, ce qui entraîne le déclenchement de la compaction au mauvais moment.

Par exemple, après une opération de recherche web, la réponse de l'API pourrait afficher :

```json
{
  "usage": {
    "input_tokens": 63000,
    "cache_read_input_tokens": 270000,
    "output_tokens": 1400
  }
}
```

Le SDK calcule l'utilisation totale comme 63 000 + 270 000 = 333 000 jetons. Cependant, la valeur `cache_read_input_tokens` inclut les lectures accumulées de plusieurs appels API internes effectués par l'outil côté serveur, et non votre contexte de conversation réel. Votre longueur de contexte réelle pourrait être seulement les 63 000 `input_tokens`, mais le SDK voit 333k et déclenche la compaction prématurément.

**Solutions de contournement :**

- Utilisez le point de terminaison de [comptage des jetons](/docs/fr/build-with-claude/token-counting) pour obtenir la longueur de contexte exacte
- Évitez la compaction lors de l'utilisation extensive d'outils côté serveur

#### Cas limites d'utilisation des outils

Lorsque la compaction est déclenchée alors qu'une réponse d'utilisation d'outil est en attente, le SDK supprime le bloc d'utilisation d'outil de l'historique des messages avant de générer le résumé. Claude réémettrait l'appel d'outil après la reprise à partir du résumé si nécessaire.

### Surveillance de la compaction

Activez la journalisation pour suivre quand la compaction se produit :

<CodeGroup>

```python Python
import logging

logging.basicConfig(level=logging.INFO)
logging.getLogger("anthropic.lib.tools").setLevel(logging.INFO)

# Logs will show:
# INFO: Token usage 105000 has exceeded the threshold of 100000. Performing compaction.
# INFO: Compaction complete. New token usage: 2500
```

```typescript TypeScript
// The SDK logs compaction events to the console
// You'll see messages like:
// Token usage 105000 has exceeded the threshold of 100000. Performing compaction.
// Compaction complete. New token usage: 2500
```

</CodeGroup>

### Limitations

#### Outils côté serveur

<Warning>
La compaction nécessite une considération particulière lors de l'utilisation d'outils côté serveur tels que la [recherche web](/docs/fr/agents-and-tools/tool-use/web-search-tool) ou la [récupération web](/docs/fr/agents-and-tools/tool-use/web-fetch-tool).
</Warning>

Lors de l'utilisation d'outils côté serveur, le SDK peut calculer incorrectement l'utilisation des jetons, ce qui entraîne le déclenchement de la compaction au mauvais moment.

Par exemple, après une opération de recherche web, la réponse de l'API pourrait afficher :

```json
{
  "usage": {
    "input_tokens": 63000,
    "cache_read_input_tokens": 270000,
    "output_tokens": 1400
  }
}
```

Le SDK calcule l'utilisation totale comme 63 000 + 270 000 = 333 000 jetons. Cependant, la valeur `cache_read_input_tokens` inclut les lectures accumulées de plusieurs appels API internes effectués par l'outil côté serveur, et non votre contexte de conversation réel. Votre longueur de contexte réelle pourrait être seulement les 63 000 `input_tokens`, mais le SDK voit 333k et déclenche la compaction prématurément.

**Solutions de contournement :**

- Utilisez le point de terminaison de [comptage des jetons](/docs/fr/build-with-claude/token-counting) pour obtenir la longueur de contexte exacte
- Évitez la compaction lors de l'utilisation extensive d'outils côté serveur

#### Cas limites d'utilisation des outils

Lorsque la compaction est déclenchée alors qu'une réponse d'utilisation d'outil est en attente, le SDK supprime le bloc d'utilisation d'outil de l'historique des messages avant de générer le résumé. Claude réémettrait l'appel d'outil après la reprise à partir du résumé si nécessaire.

### Surveillance de la compaction

Activez la journalisation pour suivre quand la compaction se produit :

<CodeGroup>

```python Python
import logging

logging.basicConfig(level=logging.INFO)
logging.getLogger("anthropic.lib.tools").setLevel(logging.INFO)

# Logs will show:
# INFO: Token usage 105000 has exceeded the threshold of 100000. Performing compaction.
# INFO: Compaction complete. New token usage: 2500
```

```typescript TypeScript
// The SDK logs compaction events to the console
// You'll see messages like:
// Token usage 105000 has exceeded the threshold of 100000. Performing compaction.
// Compaction complete. New token usage: 2500
```

</CodeGroup>

### Quand utiliser la compaction

**Bons cas d'usage :**

- Les tâches d'agent de longue durée qui traitent de nombreux fichiers ou sources de données
- Les flux de travail de recherche qui accumulent de grandes quantités d'informations
- Les tâches multi-étapes avec des progrès clairs et mesurables
- Les tâches qui produisent des artefacts (fichiers, rapports) qui persistent en dehors de la conversation

**Cas d'usage moins idéaux :**

- Les tâches nécessitant un rappel précis des détails de la conversation précoce
- Les flux de travail utilisant des outils côté serveur de manière extensive
- Les tâches qui doivent maintenir un état exact sur de nombreuses variables