# Tarification

Découvrez la structure tarifaire d'Anthropic pour les modèles et les fonctionnalités

---

Cette page fournit des informations tarifaires détaillées pour les modèles et les fonctionnalités d'Anthropic. Tous les prix sont en USD.

Pour les informations tarifaires les plus actuelles, veuillez visiter [claude.com/pricing](https://claude.com/pricing).

## Tarification des modèles

Le tableau suivant montre la tarification de tous les modèles Claude selon différents niveaux d'utilisation :

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
MTok = Millions de tokens. La colonne « Base Input Tokens » affiche la tarification d'entrée standard, « Cache Writes » et « Cache Hits » sont spécifiques à la [mise en cache des invites](/docs/fr/build-with-claude/prompt-caching), et « Output Tokens » affiche la tarification de sortie. La mise en cache des invites offre des durées de cache de 5 minutes (par défaut) et 1 heure pour optimiser les coûts selon les cas d'utilisation.

Le tableau ci-dessus reflète les multiplicateurs de tarification suivants pour la mise en cache des invites :
- Les tokens d'écriture de cache de 5 minutes coûtent 1,25 fois le prix des tokens d'entrée de base
- Les tokens d'écriture de cache d'1 heure coûtent 2 fois le prix des tokens d'entrée de base
- Les tokens de lecture de cache coûtent 0,1 fois le prix des tokens d'entrée de base
</Note>

## Tarification des plateformes tierces

Les modèles Claude sont disponibles sur [AWS Bedrock](/docs/fr/build-with-claude/claude-on-amazon-bedrock), [Google Vertex AI](/docs/fr/build-with-claude/claude-on-vertex-ai) et [Microsoft Foundry](/docs/fr/build-with-claude/claude-in-microsoft-foundry). Pour la tarification officielle, visitez :
- [Tarification AWS Bedrock](https://aws.amazon.com/bedrock/pricing/)
- [Tarification Google Vertex AI](https://cloud.google.com/vertex-ai/generative-ai/pricing)
- [Tarification Microsoft Foundry](https://azure.microsoft.com/en-us/pricing/details/ai-foundry/#pricing)

<Note>
**Tarification des points de terminaison régionaux pour les modèles Claude 4.5 et versions ultérieures**

À partir de Claude Sonnet 4.5 et Haiku 4.5, AWS Bedrock et Google Vertex AI offrent deux types de points de terminaison :
- **Points de terminaison mondiaux** : Routage dynamique entre les régions pour une disponibilité maximale
- **Points de terminaison régionaux** : Routage des données garanti dans des régions géographiques spécifiques

Les points de terminaison régionaux incluent une prime de 10 % par rapport aux points de terminaison mondiaux. **L'API Claude (1P) est mondiale par défaut et n'est pas affectée par ce changement.** L'API Claude est mondiale uniquement (équivalente à l'offre de point de terminaison mondial et à la tarification d'autres fournisseurs).

**Portée** : Cette structure tarifaire s'applique à Claude Sonnet 4.5, Haiku 4.5 et à tous les modèles futurs. Les modèles antérieurs (Claude Sonnet 4, Opus 4 et les versions antérieures) conservent leur tarification existante.

Pour les détails de mise en œuvre et les exemples de code :
- [Points de terminaison mondiaux et régionaux AWS Bedrock](/docs/fr/build-with-claude/claude-on-amazon-bedrock#global-vs-regional-endpoints)
- [Points de terminaison mondiaux et régionaux Google Vertex AI](/docs/fr/build-with-claude/claude-on-vertex-ai#global-vs-regional-endpoints)
</Note>

## Tarification spécifique aux fonctionnalités

### Traitement par lots

L'API Batch permet le traitement asynchrone de grands volumes de requêtes avec une réduction de 50 % sur les tokens d'entrée et de sortie.

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

Pour plus d'informations sur le traitement par lots, consultez notre [documentation sur le traitement par lots](/docs/fr/build-with-claude/batch-processing).

### Tarification du contexte long

Lors de l'utilisation de Claude Sonnet 4 ou Sonnet 4.5 avec la [fenêtre de contexte de 1M tokens activée](/docs/fr/build-with-claude/context-windows#1m-token-context-window), les requêtes qui dépassent 200K tokens d'entrée sont automatiquement facturées aux tarifs premium du contexte long :

<Note>
La fenêtre de contexte de 1M tokens est actuellement en version bêta pour les organisations au [niveau d'utilisation](/docs/fr/api/rate-limits) 4 et les organisations avec des limites de débit personnalisées. La fenêtre de contexte de 1M tokens n'est disponible que pour Claude Sonnet 4 et Sonnet 4.5.
</Note>

| ≤ 200K tokens d'entrée | > 200K tokens d'entrée |
|-----------------------------------|-------------------------------------|
| Entrée : 3 $ / MTok | Entrée : 6 $ / MTok |
| Sortie : 15 $ / MTok | Sortie : 22,50 $ / MTok |

La tarification du contexte long s'ajoute à d'autres modificateurs de tarification :
- La [réduction de 50 % de l'API Batch](#traitement-par-lots) s'applique à la tarification du contexte long
- Les [multiplicateurs de mise en cache des invites](#tarification-des-modèles) s'appliquent en plus de la tarification du contexte long

<Note>
Même avec l'indicateur bêta activé, les requêtes avec moins de 200K tokens d'entrée sont facturées aux tarifs standard. Si votre requête dépasse 200K tokens d'entrée, tous les tokens sont facturés à la tarification premium.

Le seuil de 200K est basé uniquement sur les tokens d'entrée (y compris les lectures/écritures de cache). Le nombre de tokens de sortie n'affecte pas la sélection du niveau de tarification, bien que les tokens de sortie soient facturés au tarif plus élevé lorsque le seuil d'entrée est dépassé.
</Note>

Pour vérifier si votre requête API a été facturée aux tarifs de la fenêtre de contexte 1M, examinez l'objet `usage` dans la réponse API :

```json
{
  "usage": {
    "input_tokens": 250000,
    "cache_creation_input_tokens": 0,
    "cache_read_input_tokens": 0,
    "output_tokens": 500
  }
}
```

Calculez le nombre total de tokens d'entrée en additionnant :
- `input_tokens`
- `cache_creation_input_tokens` (si vous utilisez la mise en cache des invites)
- `cache_read_input_tokens` (si vous utilisez la mise en cache des invites)

Si le total dépasse 200 000 tokens, la requête entière a été facturée aux tarifs du contexte 1M.

Pour plus d'informations sur l'objet `usage`, consultez la [documentation de réponse API](/docs/fr/api/messages#response-usage).

### Tarification de l'utilisation d'outils

Tool use requests are priced based on:
1. The total number of input tokens sent to the model (including in the `tools` parameter)
2. The number of output tokens generated
3. For server-side tools, additional usage-based pricing (e.g., web search charges per search performed)

Client-side tools are priced the same as any other Claude API request, while server-side tools may incur additional charges based on their specific usage.

The additional tokens from tool use come from:

- The `tools` parameter in API requests (tool names, descriptions, and schemas)
- `tool_use` content blocks in API requests and responses
- `tool_result` content blocks in API requests

When you use `tools`, we also automatically include a special system prompt for the model which enables tool use. The number of tool use tokens required for each model are listed below (excluding the additional tokens listed above). Note that the table assumes at least 1 tool is provided. If no `tools` are provided, then a tool choice of `none` uses 0 additional system prompt tokens.

| Model                    | Tool choice                                          | Tool use system prompt token count          |
|--------------------------|------------------------------------------------------|---------------------------------------------|
| Claude Opus 4.5            | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Opus 4.1            | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Opus 4            | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Sonnet 4.5          | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Sonnet 4          | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations))        | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Haiku 4.5         | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Haiku 3.5         | `auto`, `none`<hr />`any`, `tool`   | 264 tokens<hr />340 tokens |
| Claude Opus 3 ([deprecated](/docs/en/about-claude/model-deprecations))            | `auto`, `none`<hr />`any`, `tool`   | 530 tokens<hr />281 tokens |
| Claude Sonnet 3          | `auto`, `none`<hr />`any`, `tool`   | 159 tokens<hr />235 tokens |
| Claude Haiku 3           | `auto`, `none`<hr />`any`, `tool`   | 264 tokens<hr />340 tokens |

These token counts are added to your normal input and output tokens to calculate the total cost of a request.

Pour les prix actuels par modèle, reportez-vous à notre section [tarification des modèles](#tarification-des-modèles) ci-dessus.

Pour plus d'informations sur la mise en œuvre et les meilleures pratiques de l'utilisation d'outils, consultez notre [documentation sur l'utilisation d'outils](/docs/fr/agents-and-tools/tool-use/overview).

### Tarification d'outils spécifiques

#### Outil Bash

The bash tool adds **245 input tokens** to your API calls.

Additional tokens are consumed by:
- Command outputs (stdout/stderr)
- Error messages
- Large file contents

Consultez la [tarification de l'utilisation d'outils](#tarification-de-lutilisation-doutils) pour les détails tarifaires complets.

#### Outil d'exécution de code

Code execution tool usage is tracked separately from token usage. Execution time has a minimum of 5 minutes.
If files are included in the request, execution time is billed even if the tool is not used due to files being preloaded onto the container.

Each organization receives 50 free hours of usage with the code execution tool per day. Additional usage beyond the first 50 hours is billed at $0.05 per hour, per container.

#### Outil d'éditeur de texte

The text editor tool uses the same pricing structure as other tools used with Claude. It follows the standard input and output token pricing based on the Claude model you're using.

In addition to the base tokens, the following additional input tokens are needed for the text editor tool:

| Tool | Additional input tokens |
| ----------------------------------------- | --------------------------------------- |
| `text_editor_20250429` (Claude 4.x) | 700 tokens |
| `text_editor_20250124` (Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations))) | 700 tokens |

Consultez la [tarification de l'utilisation d'outils](#tarification-de-lutilisation-doutils) pour les détails tarifaires complets.

#### Outil de recherche web

Web search usage is charged in addition to token usage:

```json
"usage": {
  "input_tokens": 105,
  "output_tokens": 6039,
  "cache_read_input_tokens": 7123,
  "cache_creation_input_tokens": 7345,
  "server_tool_use": {
    "web_search_requests": 1
  }
}
```

Web search is available on the Claude API for **$10 per 1,000 searches**, plus standard token costs for search-generated content. Web search results retrieved throughout a conversation are counted as input tokens, in search iterations executed during a single turn and in subsequent conversation turns.

Each web search counts as one use, regardless of the number of results returned. If an error occurs during web search, the web search will not be billed.

#### Outil de récupération web

Web fetch usage has **no additional charges** beyond standard token costs:

```json
"usage": {
  "input_tokens": 25039,
  "output_tokens": 931,
  "cache_read_input_tokens": 0,
  "cache_creation_input_tokens": 0,
  "server_tool_use": {
    "web_fetch_requests": 1
  }
}
```

The web fetch tool is available on the Claude API at **no additional cost**. You only pay standard token costs for the fetched content that becomes part of your conversation context.

To protect against inadvertently fetching large content that would consume excessive tokens, use the `max_content_tokens` parameter to set appropriate limits based on your use case and budget considerations.

Example token usage for typical content:
- Average web page (10KB): ~2,500 tokens
- Large documentation page (100KB): ~25,000 tokens  
- Research paper PDF (500KB): ~125,000 tokens

#### Outil d'utilisation informatique

Computer use follows the standard [tool use pricing](/docs/en/agents-and-tools/tool-use/overview#pricing). When using the computer use tool:

**System prompt overhead**: The computer use beta adds 466-499 tokens to the system prompt

**Computer use tool token usage**:
| Model | Input tokens per tool definition |
| ----- | -------------------------------- |
| Claude 4.x models | 735 tokens |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations)) | 735 tokens |

**Additional token consumption**:
- Screenshot images (see [Vision pricing](/docs/en/build-with-claude/vision))
- Tool execution results returned to Claude

<Note>
If you're also using bash or text editor tools alongside computer use, those tools have their own token costs as documented in their respective pages.
</Note>

## Exemples de tarification des cas d'utilisation d'agents

Comprendre la tarification des applications d'agents est crucial lors de la création avec Claude. Ces exemples du monde réel peuvent vous aider à estimer les coûts pour différents modèles d'agents.

### Exemple d'agent d'assistance à la clientèle

Lors de la création d'un agent d'assistance à la clientèle, voici comment les coûts pourraient se décomposer :

<Note>
  Exemple de calcul pour le traitement de 10 000 tickets d'assistance :
  - Environ 3 700 tokens par conversation
  - Utilisation de Claude Sonnet 4.5 à 3 $/MTok d'entrée, 15 $/MTok de sortie
  - Coût total : environ 22,20 $ pour 10 000 tickets
</Note>

Pour une explication détaillée de ce calcul, consultez notre [guide d'agent d'assistance à la clientèle](/docs/fr/about-claude/use-case-guides/customer-support-chat).

### Tarification générale du flux de travail d'agent

Pour les architectures d'agents plus complexes avec plusieurs étapes :

1. **Traitement des requêtes initiales**
   - Entrée typique : 500-1 000 tokens
   - Coût de traitement : environ 0,003 $ par requête

2. **Récupération de la mémoire et du contexte**
   - Contexte récupéré : 2 000-5 000 tokens
   - Coût par récupération : environ 0,015 $ par opération

3. **Planification et exécution des actions**
   - Tokens de planification : 1 000-2 000
   - Retour d'exécution : 500-1 000
   - Coût combiné : environ 0,045 $ par action

Pour un guide complet sur les modèles de tarification des agents, consultez notre [guide des cas d'utilisation d'agents](/docs/fr/about-claude/use-case-guides).

### Stratégies d'optimisation des coûts

Lors de la création d'agents avec Claude :

1. **Utilisez les modèles appropriés** : Choisissez Haiku pour les tâches simples, Sonnet pour le raisonnement complexe
2. **Implémentez la mise en cache des invites** : Réduisez les coûts pour le contexte répété
3. **Opérations par lots** : Utilisez l'API Batch pour les tâches non sensibles au temps
4. **Surveillez les modèles d'utilisation** : Suivez la consommation de tokens pour identifier les opportunités d'optimisation

<Tip>
  Pour les applications d'agents à haut volume, envisagez de contacter notre [équipe de ventes d'entreprise](https://claude.com/contact-sales) pour des arrangements tarifaires personnalisés.
</Tip>

## Considérations tarifaires supplémentaires

### Limites de débit

Les limites de débit varient selon le niveau d'utilisation et affectent le nombre de requêtes que vous pouvez effectuer :

- **Niveau 1** : Utilisation au niveau d'entrée avec des limites de base
- **Niveau 2** : Limites accrues pour les applications en croissance
- **Niveau 3** : Limites plus élevées pour les applications établies
- **Niveau 4** : Limites standard maximales
- **Entreprise** : Limites personnalisées disponibles

Pour des informations détaillées sur les limites de débit, consultez notre [documentation sur les limites de débit](/docs/fr/api/rate-limits).

Pour des limites de débit plus élevées ou des arrangements tarifaires personnalisés, [contactez notre équipe de ventes](https://claude.com/contact-sales).

### Remises sur volume

Des remises sur volume peuvent être disponibles pour les utilisateurs à haut volume. Celles-ci sont négociées au cas par cas.

- Les niveaux standard utilisent la tarification indiquée ci-dessus
- Les clients d'entreprise peuvent [contacter les ventes](mailto:sales@anthropic.com) pour une tarification personnalisée
- Des remises académiques et de recherche peuvent être disponibles

### Tarification d'entreprise

Pour les clients d'entreprise ayant des besoins spécifiques :

- Limites de débit personnalisées
- Remises sur volume
- Support dédié
- Conditions personnalisées

Contactez notre équipe de ventes à [sales@anthropic.com](mailto:sales@anthropic.com) ou via la [Console Claude](/settings/limits) pour discuter des options de tarification d'entreprise.

## Facturation et paiement

- La facturation est calculée mensuellement en fonction de l'utilisation réelle
- Les paiements sont traités en USD
- Options de carte de crédit et de facturation disponibles
- Suivi de l'utilisation disponible dans la [Console Claude](/)

## Questions fréquemment posées

**Comment l'utilisation des tokens est-elle calculée ?**

Les tokens sont des morceaux de texte que les modèles traitent. En règle générale, 1 token représente environ 4 caractères ou 0,75 mots en anglais. Le nombre exact varie selon la langue et le type de contenu.

**Y a-t-il des niveaux gratuits ou des essais ?**

Les nouveaux utilisateurs reçoivent une petite quantité de crédits gratuits pour tester l'API. [Contactez les ventes](mailto:sales@anthropic.com) pour obtenir des informations sur les essais prolongés pour l'évaluation d'entreprise.

**Comment les remises s'empilent-elles ?**

Les remises de l'API Batch et de la mise en cache des invites peuvent être combinées. Par exemple, l'utilisation des deux fonctionnalités ensemble offre des économies de coûts importantes par rapport aux appels API standard.

**Quels modes de paiement sont acceptés ?**

Nous acceptons les principales cartes de crédit pour les comptes standard. Les clients d'entreprise peuvent organiser la facturation et d'autres modes de paiement.

Pour des questions supplémentaires sur la tarification, contactez [support@anthropic.com](mailto:support@anthropic.com).