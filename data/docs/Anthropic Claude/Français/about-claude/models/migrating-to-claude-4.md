# Migration vers Claude 4.5

Guide complet pour migrer vers Claude 4.5, couvrant les chemins de migration de Claude Sonnet 3.7 et Claude Haiku 3.5 avec des instructions étape par étape et des changements majeurs clairement marqués.

---

Ce guide couvre deux chemins de migration clés vers les modèles Claude 4.5 :

- **Claude Sonnet 3.7 → Claude Sonnet 4.5** : Notre modèle le plus intelligent avec les meilleures capacités de raisonnement, de codage et d'agents autonomes longue durée
- **Claude Haiku 3.5 → Claude Haiku 4.5** : Notre modèle Haiku le plus rapide et le plus intelligent avec des performances proches de la frontière pour les applications en temps réel et le traitement intelligent à haut volume

Les deux migrations impliquent des changements majeurs qui nécessitent des mises à jour de votre implémentation. Ce guide vous guidera à travers chaque chemin de migration avec des instructions étape par étape et des changements majeurs clairement marqués.

Avant de commencer votre migration, nous vous recommandons de consulter [Quoi de neuf dans Claude 4.5](/docs/fr/about-claude/models/whats-new-claude-4-5) pour comprendre les nouvelles fonctionnalités et capacités disponibles dans ces modèles, y compris la réflexion étendue, la conscience du contexte et les améliorations comportementales.

## Migration de Claude Sonnet 3.7 vers Claude Sonnet 4.5

Claude Sonnet 4.5 est notre modèle le plus intelligent, offrant des performances de classe mondiale pour le raisonnement, le codage et les agents autonomes longue durée. Cette migration inclut plusieurs changements majeurs qui nécessitent des mises à jour de votre implémentation.

### Étapes de migration

1. **Mettez à jour le nom de votre modèle :**
   ```python
   # Avant (Claude Sonnet 3.7)
   model="claude-3-7-sonnet-20250219"

   # Après (Claude Sonnet 4.5)
   model="claude-sonnet-4-5-20250929"
   ```

2. **Mettez à jour les paramètres d'échantillonnage**

   <Warning>
   Ceci est un changement majeur par rapport à Claude Sonnet 3.7.
   </Warning>

   Utilisez uniquement `temperature` OU `top_p`, pas les deux :

   ```python
   # Avant (Claude Sonnet 3.7) - Cela génèrera une erreur dans Sonnet 4.5
   response = client.messages.create(
       model="claude-3-7-sonnet-20250219",
       temperature=0.7,
       top_p=0.9,  # Impossible d'utiliser les deux
       ...
   )

   # Après (Claude Sonnet 4.5)
   response = client.messages.create(
       model="claude-sonnet-4-5-20250929",
       temperature=0.7,  # Utilisez temperature OU top_p, pas les deux
       ...
   )
   ```

3. **Gérez la nouvelle raison d'arrêt `refusal`**

   Mettez à jour votre application pour [gérer les raisons d'arrêt `refusal`](/docs/fr/test-and-evaluate/strengthen-guardrails/handle-streaming-refusals) :

   ```python
   response = client.messages.create(...)

   if response.stop_reason == "refusal":
       # Gérez le refus de manière appropriée
       pass
   ```

4. **Mettez à jour l'outil d'édition de texte (le cas échéant)**

   <Warning>
   Ceci est un changement majeur par rapport à Claude Sonnet 3.7.
   </Warning>

   Mettez à jour vers `text_editor_20250728` (type) et `str_replace_based_edit_tool` (nom). Supprimez tout code utilisant la commande `undo_edit`.
   
   ```python
   # Avant (Claude Sonnet 3.7)
   tools=[{"type": "text_editor_20250124", "name": "str_replace_editor"}]

   # Après (Claude Sonnet 4.5)
   tools=[{"type": "text_editor_20250728", "name": "str_replace_based_edit_tool"}]
   ```

   Consultez la [documentation de l'outil d'édition de texte](/docs/fr/agents-and-tools/tool-use/text-editor-tool) pour plus de détails.

5. **Mettez à jour l'outil d'exécution de code (le cas échéant)**

   Mettez à niveau vers `code_execution_20250825`. La version héritée `code_execution_20250522` fonctionne toujours mais n'est pas recommandée. Consultez la [documentation de l'outil d'exécution de code](/docs/fr/agents-and-tools/tool-use/code-execution-tool#upgrade-to-latest-tool-version) pour les instructions de migration.

6. **Supprimez l'en-tête bêta d'utilisation d'outils efficace en tokens**

   L'utilisation d'outils efficace en tokens est une fonctionnalité bêta qui ne fonctionne qu'avec Claude 3.7 Sonnet. Tous les modèles Claude 4 ont une utilisation d'outils efficace en tokens intégrée, vous ne devriez donc plus inclure l'en-tête bêta.

   Supprimez l'[en-tête bêta](/docs/fr/api/beta-headers) `token-efficient-tools-2025-02-19` de vos requêtes :

   ```python
   # Avant (Claude Sonnet 3.7)
   client.messages.create(
       model="claude-3-7-sonnet-20250219",
       betas=["token-efficient-tools-2025-02-19"],  # Supprimez ceci
       ...
   )

   # Après (Claude Sonnet 4.5)
   client.messages.create(
       model="claude-sonnet-4-5-20250929",
       # Pas d'en-tête bêta token-efficient-tools
       ...
   )
   ```

7. **Supprimez l'en-tête bêta de sortie étendue**

   L'[en-tête bêta](/docs/fr/api/beta-headers) `output-128k-2025-02-19` pour la sortie étendue n'est disponible que dans Claude Sonnet 3.7.

   Supprimez cet en-tête de vos requêtes :

   ```python
   # Avant (Claude Sonnet 3.7)
   client.messages.create(
       model="claude-3-7-sonnet-20250219",
       betas=["output-128k-2025-02-19"],  # Supprimez ceci
       ...
   )

   # Après (Claude Sonnet 4.5)
   client.messages.create(
       model="claude-sonnet-4-5-20250929",
       # Pas d'en-tête bêta output-128k
       ...
   )
   ```

8. **Mettez à jour vos invites pour les changements comportementaux**

   Claude Sonnet 4.5 a un style de communication plus concis et direct et nécessite une direction explicite. Consultez les [meilleures pratiques d'ingénierie d'invite Claude 4](/docs/fr/build-with-claude/prompt-engineering/claude-4-best-practices) pour des conseils d'optimisation.

9. **Envisagez d'activer la réflexion étendue pour les tâches complexes**

   Activez la [réflexion étendue](/docs/fr/build-with-claude/extended-thinking) pour des améliorations significatives de performance sur les tâches de codage et de raisonnement (désactivée par défaut) :

   ```python
   response = client.messages.create(
       model="claude-sonnet-4-5-20250929",
       max_tokens=16000,
       thinking={"type": "enabled", "budget_tokens": 10000},
       messages=[...]
   )
   ```

   <Note>
   La réflexion étendue impacte l'efficacité de la [mise en cache des invites](/docs/fr/build-with-claude/prompt-caching#caching-with-thinking-blocks).
   </Note>

10. **Testez votre implémentation**

   Testez dans un environnement de développement avant de déployer en production pour vous assurer que tous les changements majeurs sont correctement gérés.

### Liste de contrôle de migration Sonnet 3.7 → 4.5

- [ ] Mettez à jour l'ID du modèle vers `claude-sonnet-4-5-20250929`
- [ ] **CHANGEMENT MAJEUR** : Mettez à jour les paramètres d'échantillonnage pour utiliser uniquement `temperature` OU `top_p`, pas les deux
- [ ] Gérez la nouvelle raison d'arrêt `refusal` dans votre application
- [ ] **CHANGEMENT MAJEUR** : Mettez à jour l'outil d'édition de texte vers `text_editor_20250728` et `str_replace_based_edit_tool` (le cas échéant)
- [ ] **CHANGEMENT MAJEUR** : Supprimez tout code utilisant la commande `undo_edit` (le cas échéant)
- [ ] Mettez à jour l'outil d'exécution de code vers `code_execution_20250825` (le cas échéant)
- [ ] Supprimez l'en-tête bêta `token-efficient-tools-2025-02-19` (le cas échéant)
- [ ] Supprimez l'en-tête bêta `output-128k-2025-02-19` (le cas échéant)
- [ ] Examinez et mettez à jour les invites en suivant les [meilleures pratiques Claude 4](/docs/fr/build-with-claude/prompt-engineering/claude-4-best-practices)
- [ ] Envisagez d'activer la réflexion étendue pour les tâches de raisonnement complexe
- [ ] Gérez la raison d'arrêt `model_context_window_exceeded` (spécifique à Sonnet 4.5)
- [ ] Envisagez d'activer l'outil de mémoire pour les agents longue durée (bêta)
- [ ] Envisagez d'utiliser l'effacement automatique des appels d'outils pour l'édition de contexte (bêta)
- [ ] Testez dans l'environnement de développement avant le déploiement en production

### Fonctionnalités supprimées de Claude Sonnet 3.7

- **Utilisation d'outils efficace en tokens** : L'en-tête bêta `token-efficient-tools-2025-02-19` ne fonctionne qu'avec Claude 3.7 Sonnet et n'est pas supporté dans les modèles Claude 4 (voir étape 6)
- **Sortie étendue** : L'en-tête bêta `output-128k-2025-02-19` n'est pas supporté (voir étape 7)

Les deux en-têtes peuvent être inclus dans les requêtes Claude 4 mais n'auront aucun effet.

## Migration de Claude Haiku 3.5 vers Claude Haiku 4.5

Claude Haiku 4.5 est notre modèle Haiku le plus rapide et le plus intelligent avec des performances proches de la frontière, offrant une qualité de modèle premium avec des performances en temps réel pour les applications interactives et le traitement intelligent à haut volume. Cette migration inclut plusieurs changements majeurs qui nécessitent des mises à jour de votre implémentation.

Pour un aperçu complet des nouvelles capacités, consultez [Quoi de neuf dans Claude 4.5](/docs/fr/about-claude/models/whats-new-claude-4-5#key-improvements-in-haiku-4-5-over-haiku-3-5).

<Note>
Tarification de Haiku 4.5 : 1 $ par million de tokens d'entrée, 5 $ par million de tokens de sortie. Consultez la [tarification Claude](/docs/fr/about-claude/pricing) pour plus de détails.
</Note>

### Étapes de migration

1. **Mettez à jour le nom de votre modèle :**
   ```python
   # Avant (Haiku 3.5)
   model="claude-3-5-haiku-20241022"

   # Après (Haiku 4.5)
   model="claude-haiku-4-5-20251001"
   ```

2. **Mettez à jour les versions des outils (le cas échéant)**

   <Warning>
   Ceci est un changement majeur par rapport à Claude Haiku 3.5.
   </Warning>

   Haiku 4.5 ne supporte que les dernières versions des outils :

   ```python
   # Avant (Haiku 3.5)
   tools=[{"type": "text_editor_20250124", "name": "str_replace_editor"}]

   # Après (Haiku 4.5)
   tools=[{"type": "text_editor_20250728", "name": "str_replace_based_edit_tool"}]
   ```

   - **Éditeur de texte** : Utilisez `text_editor_20250728` et `str_replace_based_edit_tool`
   - **Exécution de code** : Utilisez `code_execution_20250825`
   - Supprimez tout code utilisant la commande `undo_edit`

3. **Mettez à jour les paramètres d'échantillonnage**

   <Warning>
   Ceci est un changement majeur par rapport à Claude Haiku 3.5.
   </Warning>

   Utilisez uniquement `temperature` OU `top_p`, pas les deux :

   ```python
   # Avant (Haiku 3.5) - Cela génèrera une erreur dans Haiku 4.5
   response = client.messages.create(
       model="claude-3-5-haiku-20241022",
       temperature=0.7,
       top_p=0.9,  # Impossible d'utiliser les deux
       ...
   )

   # Après (Haiku 4.5)
   response = client.messages.create(
       model="claude-haiku-4-5-20251001",
       temperature=0.7,  # Utilisez temperature OU top_p, pas les deux
       ...
   )
   ```

4. **Examinez les nouvelles limites de débit**

   Haiku 4.5 a des limites de débit distinctes de Haiku 3.5. Consultez la [documentation des limites de débit](/docs/fr/api/rate-limits) pour plus de détails.

5. **Gérez la nouvelle raison d'arrêt `refusal`**

   Mettez à jour votre application pour [gérer les raisons d'arrêt refusal](/docs/fr/test-and-evaluate/strengthen-guardrails/handle-streaming-refusals).

6. **Envisagez d'activer la réflexion étendue pour les tâches complexes**

   Activez la [réflexion étendue](/docs/fr/build-with-claude/extended-thinking) pour des améliorations significatives de performance sur les tâches de codage et de raisonnement (désactivée par défaut) :

   ```python
   response = client.messages.create(
       model="claude-haiku-4-5-20251001",
       max_tokens=16000,
       thinking={"type": "enabled", "budget_tokens": 5000},
       messages=[...]
   )
   ```
   <Note>
   La réflexion étendue impacte l'efficacité de la [mise en cache des invites](/docs/fr/build-with-claude/prompt-caching#caching-with-thinking-blocks).
   </Note>

7. **Explorez les nouvelles capacités**

   Consultez [Quoi de neuf dans Claude 4.5](/docs/fr/about-claude/models/whats-new-claude-4-5#key-improvements-in-haiku-4-5-over-haiku-3-5) pour plus de détails sur la conscience du contexte, la capacité de sortie augmentée (64K tokens), l'intelligence supérieure et la vitesse améliorée.

8. **Testez votre implémentation**

   Testez dans un environnement de développement avant de déployer en production pour vous assurer que tous les changements majeurs sont correctement gérés.

### Liste de contrôle de migration Haiku 3.5 → 4.5

- [ ] Mettez à jour l'ID du modèle vers `claude-haiku-4-5-20251001`
- [ ] **CHANGEMENT MAJEUR** : Mettez à jour les versions des outils vers les dernières (par exemple, `text_editor_20250728`, `code_execution_20250825`) - les versions héritées ne sont pas supportées
- [ ] **CHANGEMENT MAJEUR** : Supprimez tout code utilisant la commande `undo_edit` (le cas échéant)
- [ ] **CHANGEMENT MAJEUR** : Mettez à jour les paramètres d'échantillonnage pour utiliser uniquement `temperature` OU `top_p`, pas les deux
- [ ] Examinez et ajustez pour les nouvelles limites de débit (distinctes de Haiku 3.5)
- [ ] Gérez la nouvelle raison d'arrêt `refusal` dans votre application
- [ ] Envisagez d'activer la réflexion étendue pour les tâches de raisonnement complexe (nouvelle capacité)
- [ ] Exploitez la conscience du contexte pour une meilleure gestion des tokens dans les sessions longues
- [ ] Préparez-vous pour les réponses plus grandes (sortie maximale augmentée de 8K à 64K tokens)
- [ ] Examinez et mettez à jour les invites en suivant les [meilleures pratiques Claude 4](/docs/fr/build-with-claude/prompt-engineering/claude-4-best-practices)
- [ ] Testez dans l'environnement de développement avant le déploiement en production

## Choisir entre Sonnet 4.5 et Haiku 4.5

Claude Sonnet 4.5 et Claude Haiku 4.5 sont tous deux des modèles Claude 4 puissants avec des forces différentes :

### Choisissez Claude Sonnet 4.5 (le plus intelligent) pour :

- **Raisonnement et analyse complexes** : Intelligence de classe mondiale pour les tâches sophistiquées
- **Agents autonomes longue durée** : Performance supérieure pour les agents travaillant indépendamment pendant des périodes prolongées
- **Tâches de codage avancées** : Notre modèle de codage le plus fort avec planification avancée et ingénierie de sécurité
- **Flux de travail avec contexte volumineux** : Gestion de contexte améliorée avec outil de mémoire et capacités d'édition de contexte
- **Tâches nécessitant une capacité maximale** : Quand l'intelligence et la précision sont les priorités principales

### Choisissez Claude Haiku 4.5 (le plus rapide et le plus intelligent Haiku) pour :

- **Applications en temps réel** : Temps de réponse rapides pour les expériences utilisateur interactives avec des performances proches de la frontière
- **Traitement intelligent à haut volume** : Intelligence rentable à grande échelle avec vitesse améliorée
- **Déploiements sensibles aux coûts** : Performances proches de la frontière à des prix plus bas
- **Architectures de sous-agents** : Agents rapides et intelligents pour les systèmes multi-agents
- **Utilisation d'ordinateur à grande échelle** : Automatisation rentable du bureau et du navigateur
- **Tâches nécessitant de la vitesse** : Quand la faible latence est critique tout en maintenant une intelligence proche de la frontière

### Recommandations de réflexion étendue

Les modèles Claude 4, en particulier Sonnet et Haiku 4.5, montrent des améliorations significatives de performance lors de l'utilisation de la [réflexion étendue](/docs/fr/build-with-claude/extended-thinking) pour les tâches de codage et de raisonnement complexe. La réflexion étendue est **désactivée par défaut** mais nous recommandons de l'activer pour les travaux exigeants.

**Important** : La réflexion étendue impacte l'efficacité de la [mise en cache des invites](/docs/fr/build-with-claude/prompt-caching#caching-with-thinking-blocks). Quand du contenu non-résultat d'outil est ajouté à une conversation, les blocs de réflexion sont supprimés du cache, ce qui peut augmenter les coûts dans les conversations multi-tours. Nous recommandons d'activer la réflexion quand les avantages de performance surpassent le compromis de mise en cache.

## Autres scénarios de migration

Les chemins de migration principaux couverts ci-dessus (Sonnet 3.7 → 4.5 et Haiku 3.5 → 4.5) représentent les mises à niveau les plus courantes. Cependant, vous pouvez migrer d'autres modèles Claude vers Claude 4.5. Cette section couvre ces scénarios.

### Migration de Claude Sonnet 4 → Sonnet 4.5

**Changement majeur** : Impossible de spécifier à la fois `temperature` et `top_p` dans la même requête.

Tous les autres appels API fonctionneront sans modification. Mettez à jour votre ID de modèle et ajustez les paramètres d'échantillonnage si nécessaire :

```python
# Avant (Claude Sonnet 4)
model="claude-sonnet-4-20250514"

# Après (Claude Sonnet 4.5)
model="claude-sonnet-4-5-20250929"
```

### Migration de Claude Opus 4.1 → Sonnet 4.5

**Pas de changements majeurs.** Tous les appels API fonctionneront sans modification.

Mettez simplement à jour votre ID de modèle :

```python
# Avant (Claude Opus 4.1)
model="claude-opus-4-1-20250805"

# Après (Claude Sonnet 4.5)
model="claude-sonnet-4-5-20250929"
```

Claude Sonnet 4.5 est notre modèle le plus intelligent avec les meilleures capacités de raisonnement, de codage et d'agents autonomes longue durée. Il offre une performance supérieure par rapport à Opus 4.1 pour la plupart des cas d'usage.

### Migration de Claude Opus 4.1 → Opus 4.5

**Pas de changements majeurs.** Tous les appels API fonctionneront sans modification.

Mettez simplement à jour votre ID de modèle :

```python
# Avant (Claude Opus 4.1)
model="claude-opus-4-1-20250805"

# Après (Claude Opus 4.5)
model="claude-opus-4-5-20251101"
```

Claude Opus 4.5 est notre modèle le plus intelligent, combinant la capacité maximale avec une performance pratique. Il présente des améliorations majeures en vision, codage et utilisation d'ordinateur à un prix plus accessible qu'Opus 4.1. Idéal pour les tâches spécialisées complexes et l'ingénierie logicielle professionnelle.

<Note>
Pour les bases de code avec de nombreuses références de modèles, un [plugin Claude Code](https://github.com/anthropics/claude-code/tree/main/plugins/claude-opus-4-5-migration) est disponible pour automatiser la migration vers Opus 4.5.
</Note>

### Migration entre les modèles Claude 4.5

**Pas de changements majeurs.** Tous les appels API fonctionneront sans modification.

Mettez simplement à jour votre ID de modèle.

## Besoin d'aide ?

- Consultez notre [documentation API](/docs/fr/api/overview) pour les spécifications détaillées
- Examinez les [capacités des modèles](/docs/fr/about-claude/models/overview) pour les comparaisons de performance
- Examinez les [notes de version API](/docs/fr/release-notes/api) pour les mises à jour API
- Contactez le support si vous rencontrez des problèmes lors de la migration