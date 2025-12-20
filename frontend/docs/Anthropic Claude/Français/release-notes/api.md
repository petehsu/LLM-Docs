# Plateforme Claude Developer

Mises à jour de la Plateforme Claude Developer, y compris l'API Claude, les SDK clients et la Console Claude.

---

<Tip>
Pour les notes de version sur Claude Apps, consultez les [Notes de version pour Claude Apps dans le Centre d'aide Claude](https://support.claude.com/en/articles/12138966-release-notes).

Pour les mises à jour de Claude Code, consultez le [CHANGELOG.md complet](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md) dans le référentiel `claude-code`.
</Tip>

### 4 décembre 2025
- Les [sorties structurées](/docs/fr/build-with-claude/structured-outputs) supportent maintenant Claude Haiku 4.5.

### 24 novembre 2025
- Nous avons lancé [Claude Opus 4.5](https://www.anthropic.com/news/claude-opus-4-5), notre modèle le plus intelligent combinant la capacité maximale avec des performances pratiques. Idéal pour les tâches spécialisées complexes, l'ingénierie logicielle professionnelle et les agents avancés. Offre des améliorations majeures en vision, codage et utilisation informatique à un prix plus accessible que les modèles Opus précédents. En savoir plus dans notre [documentation Modèles et tarification](/docs/fr/about-claude/models).
- Nous avons lancé l'[appel d'outils programmatique](/docs/fr/agents-and-tools/tool-use/programmatic-tool-calling) en bêta publique, permettant à Claude d'appeler des outils à partir de l'exécution de code pour réduire la latence et l'utilisation de jetons dans les flux de travail multi-outils.
- Nous avons lancé l'[outil de recherche d'outils](/docs/fr/agents-and-tools/tool-use/tool-search-tool) en bêta publique, permettant à Claude de découvrir et charger dynamiquement des outils à la demande à partir de grands catalogues d'outils.
- Nous avons lancé le [paramètre effort](/docs/fr/build-with-claude/effort) en bêta publique pour Claude Opus 4.5, vous permettant de contrôler l'utilisation des jetons en échangeant entre la complétude et l'efficacité des réponses.
- Nous avons ajouté la [compaction côté client](/docs/fr/build-with-claude/context-editing#client-side-compaction-sdk) à nos SDK Python et TypeScript, gérant automatiquement le contexte de conversation par résumé lors de l'utilisation de `tool_runner`.

### 21 novembre 2025
- Les blocs de contenu des résultats de recherche sont maintenant généralement disponibles sur Amazon Bedrock. En savoir plus dans notre [documentation des résultats de recherche](/docs/fr/build-with-claude/search-results).

### 19 novembre 2025
- Nous avons lancé une **nouvelle plateforme de documentation** à [platform.claude.com/docs](https://platform.claude.com/docs). Notre documentation vit maintenant côte à côte avec la Console Claude, offrant une expérience développeur unifiée. Le site de documentation précédent à docs.claude.com redirigera vers le nouvel emplacement.

### 18 novembre 2025
- Nous avons lancé **Claude dans Microsoft Foundry**, apportant les modèles Claude aux clients Azure avec la facturation Azure et l'authentification OAuth. Accédez à l'API Messages complète incluant la réflexion étendue, la mise en cache des invites (5 minutes et 1 heure), le support PDF, l'API Files, les compétences d'agent et l'utilisation d'outils. En savoir plus dans notre [documentation Microsoft Foundry](/docs/fr/build-with-claude/claude-in-microsoft-foundry).

### 14 novembre 2025
- Nous avons lancé les [sorties structurées](/docs/fr/build-with-claude/structured-outputs) en bêta publique, fournissant une conformité de schéma garantie pour les réponses de Claude. Utilisez les sorties JSON pour les réponses de données structurées ou l'utilisation d'outils stricte pour les entrées d'outils validées. Disponible pour Claude Sonnet 4.5 et Claude Opus 4.1. Pour activer, utilisez l'en-tête bêta `structured-outputs-2025-11-13`.

### 28 octobre 2025
- Nous avons annoncé l'obsolescence du modèle Claude Sonnet 3.7. En savoir plus dans [notre documentation](/docs/fr/about-claude/model-deprecations).
- Nous avons retiré les modèles Claude Sonnet 3.5. Toutes les demandes à ces modèles retourneront maintenant une erreur.
- Nous avons étendu l'édition de contexte avec l'effacement des blocs de réflexion (`clear_thinking_20251015`), permettant la gestion automatique des blocs de réflexion. En savoir plus dans notre [documentation d'édition de contexte](/docs/fr/build-with-claude/context-editing).

### 16 octobre 2025
- Nous avons lancé [Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) (`skills-2025-10-02` bêta), une nouvelle façon d'étendre les capacités de Claude. Les compétences sont des dossiers organisés d'instructions, de scripts et de ressources que Claude charge dynamiquement pour effectuer des tâches spécialisées. La version initiale comprend :
  - **Compétences gérées par Anthropic** : Compétences pré-construites pour travailler avec les fichiers PowerPoint (.pptx), Excel (.xlsx), Word (.docx) et PDF
  - **Compétences personnalisées** : Téléchargez vos propres compétences via l'API Skills (`/v1/skills` points de terminaison) pour empaqueter l'expertise de domaine et les flux de travail organisationnels
  - Les compétences nécessitent que l'[outil d'exécution de code](/docs/fr/agents-and-tools/tool-use/code-execution-tool) soit activé
  - En savoir plus dans notre [documentation Agent Skills](/docs/fr/agents-and-tools/agent-skills/overview) et [référence API](/docs/fr/api/skills/create-skill)

### 15 octobre 2025
- Nous avons lancé [Claude Haiku 4.5](https://www.anthropic.com/news/claude-haiku-4-5), notre modèle Haiku le plus rapide et le plus intelligent avec des performances proches de la frontière. Idéal pour les applications en temps réel, le traitement à haut volume et les déploiements sensibles aux coûts nécessitant un raisonnement solide. En savoir plus dans notre [documentation Modèles et tarification](/docs/fr/about-claude/models).

### 29 septembre 2025
- Nous avons lancé [Claude Sonnet 4.5](https://www.anthropic.com/news/claude-sonnet-4-5), notre meilleur modèle pour les agents complexes et le codage, avec l'intelligence la plus élevée dans la plupart des tâches. En savoir plus dans [Nouveautés de Claude 4.5](/docs/fr/about-claude/models/whats-new-claude-4-5).
- Nous avons introduit la [tarification des points de terminaison mondiaux](/docs/fr/about-claude/pricing#third-party-platform-pricing) pour AWS Bedrock et Google Vertex AI. La tarification de l'API Claude (1P) n'est pas affectée.
- Nous avons introduit une nouvelle raison d'arrêt `model_context_window_exceeded` qui vous permet de demander le maximum de jetons possible sans calculer la taille d'entrée. En savoir plus dans notre [documentation de gestion des raisons d'arrêt](/docs/fr/build-with-claude/handling-stop-reasons).
- Nous avons lancé l'outil de mémoire en bêta, permettant à Claude de stocker et de consulter les informations dans les conversations. En savoir plus dans notre [documentation de l'outil de mémoire](/docs/fr/agents-and-tools/tool-use/memory-tool).
- Nous avons lancé l'édition de contexte en bêta, fournissant des stratégies pour gérer automatiquement le contexte de conversation. La version initiale supporte l'effacement des résultats et appels d'outils plus anciens lors de l'approche des limites de jetons. En savoir plus dans notre [documentation d'édition de contexte](/docs/fr/build-with-claude/context-editing).

### 17 septembre 2025
- Nous avons lancé les assistants d'outils en bêta pour les SDK Python et TypeScript, simplifiant la création et l'exécution d'outils avec la validation d'entrée de type sûr et un exécuteur d'outils pour la gestion automatisée des outils dans les conversations. Pour plus de détails, consultez la documentation pour [le SDK Python](https://github.com/anthropics/anthropic-sdk-python/blob/main/tools.md) et [le SDK TypeScript](https://github.com/anthropics/anthropic-sdk-typescript/blob/main/helpers.md#tool-helpers).

### 16 septembre 2025
- Nous avons unifié nos offres de développeurs sous la marque Claude. Vous devriez voir les noms et URL mis à jour sur notre plateforme et documentation, mais **nos interfaces de développeur resteront les mêmes**. Voici quelques changements notables :
  - Console Anthropic ([console.anthropic.com](https://console.anthropic.com)) → Console Claude ([platform.claude.com](https://platform.claude.com)). La console sera disponible aux deux URL jusqu'au 16 décembre 2025. Après cette date, [console.anthropic.com](https://console.anthropic.com) redirigera automatiquement vers [platform.claude.com](https://platform.claude.com).
  - Docs Anthropic ([docs.claude.com](https://docs.claude.com)) → Docs Claude ([docs.claude.com](https://docs.claude.com))
  - Centre d'aide Anthropic ([support.claude.com](https://support.claude.com)) → Centre d'aide Claude ([support.claude.com](https://support.claude.com))
  - Les points de terminaison API, en-têtes, variables d'environnement et SDK restent les mêmes. Vos intégrations existantes continueront de fonctionner sans aucun changement.

### 10 septembre 2025
- Nous avons lancé l'outil de récupération web en bêta, permettant à Claude de récupérer le contenu complet des pages web et documents PDF spécifiés. En savoir plus dans notre [documentation de l'outil de récupération web](/docs/fr/agents-and-tools/tool-use/web-fetch-tool).
- Nous avons lancé l'[API Claude Code Analytics](/docs/fr/build-with-claude/claude-code-analytics-api), permettant aux organisations d'accéder par programmation aux métriques d'utilisation quotidiennes agrégées pour Claude Code, y compris les métriques de productivité, les statistiques d'utilisation des outils et les données de coûts.

### 8 septembre 2025
- Nous avons lancé une version bêta du [SDK C#](https://github.com/anthropics/anthropic-sdk-csharp).

### 5 septembre 2025
- Nous avons lancé les [graphiques de limite de débit](/docs/fr/api/rate-limits#monitoring-your-rate-limits-in-the-console) dans la page [Utilisation](https://console.anthropic.com/settings/usage) de la Console, vous permettant de surveiller votre utilisation de limite de débit API et les taux de mise en cache au fil du temps.

### 3 septembre 2025
- Nous avons lancé le support des documents citables dans les résultats d'outils côté client. En savoir plus dans notre [documentation d'utilisation d'outils](/docs/fr/agents-and-tools/tool-use/implement-tool-use).

### 2 septembre 2025
- Nous avons lancé la v2 de l'[outil d'exécution de code](/docs/fr/agents-and-tools/tool-use/code-execution-tool) en bêta publique, remplaçant l'outil original réservé à Python par l'exécution de commandes Bash et les capacités de manipulation de fichiers directes, y compris l'écriture de code dans d'autres langages.

### 27 août 2025
- Nous avons lancé une version bêta du [SDK PHP](https://github.com/anthropics/anthropic-sdk-php).

### 26 août 2025
- Nous avons augmenté les limites de débit sur la [fenêtre de contexte de 1M jetons](/docs/fr/build-with-claude/context-windows#1m-token-context-window) pour Claude Sonnet 4 sur l'API Claude. Pour plus d'informations, consultez [Limites de débit de contexte long](/docs/fr/api/rate-limits#long-context-rate-limits).
- La fenêtre de contexte de 1m jeton est maintenant disponible sur Google Cloud's Vertex AI. Pour plus d'informations, consultez [Claude sur Vertex AI](/docs/fr/build-with-claude/claude-on-vertex-ai).

### 19 août 2025
- Les ID de demande sont maintenant inclus directement dans les corps de réponse d'erreur aux côtés de l'en-tête `request-id` existant. En savoir plus dans notre [documentation des erreurs](/docs/fr/api/errors#error-shapes).

### 18 août 2025
- Nous avons lancé l'[API Utilisation et coûts](/docs/fr/build-with-claude/usage-cost-api), permettant aux administrateurs de surveiller par programmation les données d'utilisation et de coûts de leur organisation.
- Nous avons ajouté un nouveau point de terminaison à l'API Admin pour récupérer les informations d'organisation. Pour plus de détails, consultez la [référence API Admin Organisation Info](/docs/fr/api/admin-api/organization/get-me).

### 13 août 2025
- Nous avons annoncé l'obsolescence des modèles Claude Sonnet 3.5 (`claude-3-5-sonnet-20240620` et `claude-3-5-sonnet-20241022`). Ces modèles seront retirés le 28 octobre 2025. Nous recommandons de migrer vers Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`) pour des performances et capacités améliorées. En savoir plus dans la [documentation des obsolescences de modèles](/docs/fr/about-claude/model-deprecations).
- La durée de cache d'une heure pour la mise en cache des invites est maintenant généralement disponible. Vous pouvez maintenant utiliser le TTL de cache étendu sans en-tête bêta. En savoir plus dans notre [documentation de mise en cache des invites](/docs/fr/build-with-claude/prompt-caching#1-hour-cache-duration).

### 12 août 2025
- Nous avons lancé le support bêta pour une [fenêtre de contexte de 1M jetons](/docs/fr/build-with-claude/context-windows#1m-token-context-window) dans Claude Sonnet 4 sur l'API Claude et Amazon Bedrock.

### 11 août 2025
- Certains clients pourraient rencontrer des erreurs 429 (`rate_limit_error`) [erreurs](/docs/fr/api/errors) suite à une augmentation nette de l'utilisation de l'API en raison des limites d'accélération sur l'API. Auparavant, les erreurs 529 (`overloaded_error`) se produiraient dans des scénarios similaires.

### 8 août 2025
- Les blocs de contenu des résultats de recherche sont maintenant généralement disponibles sur l'API Claude et Google Cloud's Vertex AI. Cette fonctionnalité permet les citations naturelles pour les applications RAG avec une attribution de source appropriée. L'en-tête bêta `search-results-2025-06-09` n'est plus requis. En savoir plus dans notre [documentation des résultats de recherche](/docs/fr/build-with-claude/search-results).

### 5 août 2025
- Nous avons lancé [Claude Opus 4.1](https://www.anthropic.com/news/claude-opus-4-1), une mise à jour progressive de Claude Opus 4 avec des capacités améliorées et des améliorations de performance.<sup>*</sup> En savoir plus dans notre [documentation Modèles et tarification](/docs/fr/about-claude/models).

_<sup>* - Opus 4.1 ne permet pas de spécifier à la fois les paramètres `temperature` et `top_p`. Veuillez n'en utiliser qu'un. </sup>_

### 28 juillet 2025
- Nous avons lancé `text_editor_20250728`, un outil d'édition de texte mis à jour qui corrige certains problèmes des versions précédentes et ajoute un paramètre optionnel `max_characters` qui vous permet de contrôler la longueur de troncature lors de la visualisation de fichiers volumineux.

### 24 juillet 2025
- Nous avons augmenté les [limites de débit](/docs/fr/api/rate-limits) pour Claude Opus 4 sur l'API Claude pour vous donner plus de capacité pour construire et mettre à l'échelle avec Claude. Pour les clients avec [limites de débit de niveau d'utilisation 1-4](/docs/fr/api/rate-limits#rate-limits), ces changements s'appliquent immédiatement à votre compte - aucune action requise.

### 21 juillet 2025
- Nous avons retiré les modèles Claude 2.0, Claude 2.1 et Claude Sonnet 3. Toutes les demandes à ces modèles retourneront maintenant une erreur. En savoir plus dans [notre documentation](/docs/fr/about-claude/model-deprecations).

### 17 juillet 2025
- Nous avons augmenté les [limites de débit](/docs/fr/api/rate-limits) pour Claude Sonnet 4 sur l'API Claude pour vous donner plus de capacité pour construire et mettre à l'échelle avec Claude. Pour les clients avec [limites de débit de niveau d'utilisation 1-4](/docs/fr/api/rate-limits#rate-limits), ces changements s'appliquent immédiatement à votre compte - aucune action requise.

### 3 juillet 2025
- Nous avons lancé les blocs de contenu des résultats de recherche en bêta, permettant les citations naturelles pour les applications RAG. Les outils peuvent maintenant retourner les résultats de recherche avec une attribution de source appropriée, et Claude citera automatiquement ces sources dans ses réponses - correspondant à la qualité de citation de la recherche web. Cela élimine le besoin de contournements de documents dans les applications de base de connaissances personnalisées. En savoir plus dans notre [documentation des résultats de recherche](/docs/fr/build-with-claude/search-results). Pour activer cette fonctionnalité, utilisez l'en-tête bêta `search-results-2025-06-09`.

### 30 juin 2025
- Nous avons annoncé l'obsolescence du modèle Claude Opus 3. En savoir plus dans [notre documentation](/docs/fr/about-claude/model-deprecations).

### 23 juin 2025
- Les utilisateurs de la console avec le rôle Développeur peuvent maintenant accéder à la page [Coûts](https://console.anthropic.com/settings/cost). Auparavant, le rôle Développeur permettait l'accès à la page [Utilisation](https://console.anthropic.com/settings/usage), mais pas à la page Coûts.

### 11 juin 2025
- Nous avons lancé le [streaming d'outils à granularité fine](/docs/fr/agents-and-tools/tool-use/fine-grained-tool-streaming) en bêta publique, une fonctionnalité qui permet à Claude de diffuser les paramètres d'utilisation d'outils sans mise en mémoire tampon / validation JSON. Pour activer le streaming d'outils à granularité fine, utilisez l'[en-tête bêta](/docs/fr/api/beta-headers) `fine-grained-tool-streaming-2025-05-14`.

### 22 mai 2025
- Nous avons lancé [Claude Opus 4 et Claude Sonnet 4](http://www.anthropic.com/news/claude-4), nos derniers modèles avec capacités de réflexion étendue. En savoir plus dans notre [documentation Modèles et tarification](/docs/fr/about-claude/models).
- Le comportement par défaut de la [réflexion étendue](/docs/fr/build-with-claude/extended-thinking) dans les modèles Claude 4 retourne un résumé du processus de réflexion complet de Claude, avec la réflexion complète chiffrée et retournée dans le champ `signature` de la sortie du bloc `thinking`.
- Nous avons lancé la [réflexion entrelacée](/docs/fr/build-with-claude/extended-thinking#interleaved-thinking) en bêta publique, une fonctionnalité qui permet à Claude de réfléchir entre les appels d'outils. Pour activer la réflexion entrelacée, utilisez l'[en-tête bêta](/docs/fr/api/beta-headers) `interleaved-thinking-2025-05-14`.
- Nous avons lancé l'[API Files](/docs/fr/build-with-claude/files) en bêta publique, vous permettant de télécharger des fichiers et de les référencer dans l'API Messages et l'outil d'exécution de code.
- Nous avons lancé l'[outil d'exécution de code](/docs/fr/agents-and-tools/tool-use/code-execution-tool) en bêta publique, un outil qui permet à Claude d'exécuter du code Python dans un environnement sécurisé et isolé.
- Nous avons lancé le [connecteur MCP](/docs/fr/agents-and-tools/mcp-connector) en bêta publique, une fonctionnalité qui vous permet de vous connecter à des serveurs MCP distants directement à partir de l'API Messages.
- Pour augmenter la qualité des réponses et diminuer les erreurs d'outils, nous avons changé la valeur par défaut du paramètre `top_p` [échantillonnage nucleus](https://en.wikipedia.org/wiki/Top-p_sampling) dans l'API Messages de 0.999 à 0.99 pour tous les modèles. Pour revenir à ce changement, définissez `top_p` à 0.999.
    De plus, lorsque la réflexion étendue est activée, vous pouvez maintenant définir `top_p` à des valeurs entre 0.95 et 1.
- Nous avons déplacé notre [SDK Go](https://github.com/anthropics/anthropic-sdk-go) de bêta à GA.
- Nous avons inclus la granularité au niveau des minutes et des heures à la page [Utilisation](https://console.anthropic.com/settings/usage) de la Console aux côtés des taux d'erreur 429 sur la page Utilisation.

### 21 mai 2025
- Nous avons déplacé notre [SDK Ruby](https://github.com/anthropics/anthropic-sdk-ruby) de bêta à GA.

### 7 mai 2025
- Nous avons lancé un outil de recherche web dans l'API, permettant à Claude d'accéder aux informations à jour du web. En savoir plus dans notre [documentation de l'outil de recherche web](/docs/fr/agents-and-tools/tool-use/web-search-tool).

### 1er mai 2025
- Le contrôle du cache doit maintenant être spécifié directement dans le bloc `content` parent de `tool_result` et `document.source`. Pour la compatibilité rétroactive, si le contrôle du cache est détecté sur le dernier bloc dans `tool_result.content` ou `document.source.content`, il sera automatiquement appliqué au bloc parent à la place. Le contrôle du cache sur tout autre bloc dans `tool_result.content` et `document.source.content` entraînera une erreur de validation.

### 9 avril 2025
- Nous avons lancé une version bêta du [SDK Ruby](https://github.com/anthropics/anthropic-sdk-ruby)

### 31 mars 2025
- Nous avons déplacé notre [SDK Java](https://github.com/anthropics/anthropic-sdk-java) de bêta à GA.
- Nous avons déplacé notre [SDK Go](https://github.com/anthropics/anthropic-sdk-go) d'alpha à bêta.

### 27 février 2025
- Nous avons ajouté les blocs de source URL pour les images et les PDF dans l'API Messages. Vous pouvez maintenant référencer les images et les PDF directement via URL au lieu de devoir les encoder en base64. En savoir plus dans notre [documentation de vision](/docs/fr/build-with-claude/vision) et [documentation de support PDF](/docs/fr/build-with-claude/pdf-support).
- Nous avons ajouté le support pour une option `none` au paramètre `tool_choice` dans l'API Messages qui empêche Claude d'appeler des outils. De plus, vous n'êtes plus obligé de fournir des `tools` lors de l'inclusion de blocs `tool_use` et `tool_result`.
- Nous avons lancé un point de terminaison API compatible OpenAI, vous permettant de tester les modèles Claude en changeant simplement votre clé API, URL de base et nom de modèle dans les intégrations OpenAI existantes. Cette couche de compatibilité supporte la fonctionnalité principale des complétions de chat. En savoir plus dans notre [documentation de compatibilité SDK OpenAI](/docs/fr/api/openai-sdk).

### 24 février 2025
- Nous avons lancé [Claude Sonnet 3.7](http://www.anthropic.com/news/claude-3-7-sonnet), notre modèle le plus intelligent à ce jour. Claude Sonnet 3.7 peut produire des réponses quasi-instantanées ou montrer sa réflexion étendue étape par étape. Un modèle, deux façons de penser. En savoir plus sur tous les modèles Claude dans notre [documentation Modèles et tarification](/docs/fr/about-claude/models).
- Nous avons ajouté le support de la vision à Claude Haiku 3.5, permettant au modèle d'analyser et de comprendre les images.
- Nous avons lancé une implémentation d'utilisation d'outils efficace en jetons, améliorant les performances globales lors de l'utilisation d'outils avec Claude. En savoir plus dans notre [documentation d'utilisation d'outils](/docs/fr/agents-and-tools/tool-use/overview).
- Nous avons changé la température par défaut dans la [Console](https://console.anthropic.com/workbench) pour les nouvelles invites de 0 à 1 pour la cohérence avec la température par défaut dans l'API. Les invites enregistrées existantes sont inchangées.
- Nous avons lancé les versions mises à jour de nos outils qui découplent les outils d'édition de texte et bash du système d'invite d'utilisation informatique :
  - `bash_20250124` : Même fonctionnalité que la version précédente mais indépendante de l'utilisation informatique. Ne nécessite pas d'en-tête bêta.
  - `text_editor_20250124` : Même fonctionnalité que la version précédente mais indépendante de l'utilisation informatique. Ne nécessite pas d'en-tête bêta.
  - `computer_20250124` : Outil d'utilisation informatique mis à jour avec les nouvelles options de commande incluant "hold_key", "left_mouse_down", "left_mouse_up", "scroll", "triple_click" et "wait". Cet outil nécessite l'en-tête anthropic-beta "computer-use-2025-01-24".
  En savoir plus dans notre [documentation d'utilisation d'outils](/docs/fr/agents-and-tools/tool-use/overview).

### 10 février 2025
- Nous avons ajouté l'en-tête de réponse `anthropic-organization-id` à toutes les réponses API. Cet en-tête fournit l'ID d'organisation associé à la clé API utilisée dans la demande.

### 31 janvier 2025

- Nous avons déplacé notre [SDK Java](https://github.com/anthropics/anthropic-sdk-java) d'alpha à bêta.

### 23 janvier 2025

- Nous avons lancé la capacité de citations dans l'API, permettant à Claude de fournir l'attribution de source pour les informations. En savoir plus dans notre [documentation des citations](/docs/fr/build-with-claude/citations).
- Nous avons ajouté le support pour les documents en texte brut et les documents de contenu personnalisé dans l'API Messages.

### 21 janvier 2025

- Nous avons annoncé l'obsolescence des modèles Claude 2, Claude 2.1 et Claude Sonnet 3. En savoir plus dans [notre documentation](/docs/fr/about-claude/model-deprecations).

### 15 janvier 2025

- Nous avons mis à jour la [mise en cache des invites](/docs/fr/build-with-claude/prompt-caching) pour être plus facile à utiliser. Maintenant, lorsque vous définissez un point de rupture de cache, nous lirons automatiquement à partir de votre plus long préfixe précédemment mis en cache.
- Vous pouvez maintenant mettre des paroles dans la bouche de Claude lors de l'utilisation d'outils.

### 10 janvier 2025

- Nous avons optimisé le support pour la [mise en cache des invites dans l'API Message Batches](/docs/fr/build-with-claude/batch-processing#using-prompt-caching-with-message-batches) pour améliorer le taux de succès du cache.

### 19 décembre 2024

- Nous avons ajouté le support pour un [point de terminaison de suppression](/docs/fr/api/deleting-message-batches) dans l'API Message Batches

### 17 décembre 2024
Les fonctionnalités suivantes sont maintenant généralement disponibles dans l'API Claude :

- [API Modèles](/docs/fr/api/models-list) : Interrogez les modèles disponibles, validez les ID de modèles et résolvez les [alias de modèles](/docs/fr/about-claude/models#model-names) à leurs ID de modèles canoniques.
- [API Message Batches](/docs/fr/build-with-claude/batch-processing) : Traitez de grands lots de messages de manière asynchrone à 50 % du coût API standard.
- [API Token Counting](/docs/fr/build-with-claude/token-counting) : Calculez les comptes de jetons pour les Messages avant de les envoyer à Claude.
- [Mise en cache des invites](/docs/fr/build-with-claude/prompt-caching) : Réduisez les coûts jusqu'à 90 % et la latence jusqu'à 80 % en mettant en cache et en réutilisant le contenu des invites.
- [Support PDF](/docs/fr/build-with-claude/pdf-support) : Traitez les PDF pour analyser le contenu textuel et visuel dans les documents.

Nous avons également lancé de nouveaux SDK officiels :
- [SDK Java](https://github.com/anthropics/anthropic-sdk-java) (alpha)
- [SDK Go](https://github.com/anthropics/anthropic-sdk-go) (alpha)

### 4 décembre 2024

- Nous avons ajouté la capacité de grouper par clé API aux pages [Utilisation](https://console.anthropic.com/settings/usage) et [Coûts](https://console.anthropic.com/settings/cost) de la [Console Développeur](https://console.anthropic.com)
- Nous avons ajouté deux nouvelles colonnes **Dernière utilisation** et **Coûts** et la capacité de trier par n'importe quelle colonne dans la page [Clés API](https://console.anthropic.com/settings/keys) de la [Console Développeur](https://console.anthropic.com)

### 21 novembre 2024

- Nous avons lancé l'[API Admin](/docs/fr/build-with-claude/administration-api), permettant aux utilisateurs de gérer par programmation les ressources de leur organisation.

### 20 novembre 2024

- Nous avons mis à jour nos limites de débit pour l'API Messages. Nous avons remplacé la limite de débit des jetons par minute par les nouvelles limites de débit des jetons d'entrée et de sortie par minute. En savoir plus dans notre [documentation](/docs/fr/api/rate-limits).
- Nous avons ajouté le support pour l'[utilisation d'outils](/docs/fr/agents-and-tools/tool-use/overview) dans le [Workbench](https://console.anthropic.com/workbench).

### 13 novembre 2024

- Nous avons ajouté le support PDF pour tous les modèles Claude Sonnet 3.5. En savoir plus dans notre [documentation](/docs/fr/build-with-claude/pdf-support).

### 6 novembre 2024

- Nous avons retiré les modèles Claude 1 et Instant. En savoir plus dans [notre documentation](/docs/fr/about-claude/model-deprecations).

### 4 novembre 2024

- [Claude Haiku 3.5](https://www.anthropic.com/claude/haiku) est maintenant disponible sur l'API Claude en tant que modèle texte uniquement.

### 1er novembre 2024

- Nous avons ajouté le support PDF pour une utilisation avec le nouveau Claude Sonnet 3.5. En savoir plus dans notre [documentation](/docs/fr/build-with-claude/pdf-support).
- Nous avons également ajouté le token counting, qui vous permet de déterminer le nombre total de jetons dans un Message, avant de l'envoyer à Claude. En savoir plus dans notre [documentation](/docs/fr/build-with-claude/token-counting).

### 22 octobre 2024

- Nous avons ajouté les outils d'utilisation informatique définis par Anthropic à notre API pour une utilisation avec le nouveau Claude Sonnet 3.5. En savoir plus dans notre [documentation](/docs/fr/agents-and-tools/tool-use/computer-use-tool).
- Claude Sonnet 3.5, notre modèle le plus intelligent à ce jour, vient de recevoir une mise à niveau et est maintenant disponible sur l'API Claude. En savoir plus [ici](https://www.anthropic.com/claude/sonnet).

### 8 octobre 2024

- L'API Message Batches est maintenant disponible en bêta. Traitez de grands lots de requêtes de manière asynchrone dans l'API Claude pour 50 % moins cher. En savoir plus dans notre [documentation](/docs/fr/build-with-claude/batch-processing).
- Nous avons assoupli les restrictions sur l'ordre des tours `user`/`assistant` dans notre API Messages. Les messages `user`/`assistant` consécutifs seront combinés en un seul message au lieu de générer une erreur, et nous n'exigeons plus que le premier message d'entrée soit un message `user`.
- Nous avons déprécié les plans Build et Scale en faveur d'une suite de fonctionnalités standard (anciennement appelée Build), ainsi que des fonctionnalités supplémentaires disponibles via les ventes. En savoir plus [ici](https://claude.com/platform/api).

### 3 octobre 2024

- Nous avons ajouté la capacité de désactiver l'utilisation d'outils parallèles dans l'API. Définissez `disable_parallel_tool_use: true` dans le champ `tool_choice` pour assurer que Claude utilise au maximum un outil. En savoir plus dans notre [documentation](/docs/fr/agents-and-tools/tool-use/implement-tool-use#parallel-tool-use).

### 10 septembre 2024

- Nous avons ajouté les espaces de travail à la [Console Développeur](https://console.anthropic.com). Les espaces de travail vous permettent de définir des limites de dépenses ou de débit personnalisées, de grouper les clés API, de suivre l'utilisation par projet et de contrôler l'accès avec les rôles d'utilisateur. En savoir plus dans notre [article de blog](https://www.anthropic.com/news/workspaces).

### 4 septembre 2024

- Nous avons annoncé l'obsolescence des modèles Claude 1. En savoir plus dans [notre documentation](/docs/fr/about-claude/model-deprecations).

### 22 août 2024

- Nous avons ajouté le support pour l'utilisation du SDK dans les navigateurs en retournant les en-têtes CORS dans les réponses API. Définissez `dangerouslyAllowBrowser: true` dans l'instanciation du SDK pour activer cette fonctionnalité.

### 19 août 2024

- Nous avons déplacé les sorties de 8 192 jetons de bêta à la disponibilité générale pour Claude Sonnet 3.5.

### 14 août 2024

- La [mise en cache des invites](/docs/fr/build-with-claude/prompt-caching) est maintenant disponible en tant que fonctionnalité bêta dans l'API Claude. Mettez en cache et réutilisez les invites pour réduire la latence jusqu'à 80 % et les coûts jusqu'à 90 %.

### 15 juillet 2024

- Générez des sorties jusqu'à 8 192 jetons de longueur à partir de Claude Sonnet 3.5 avec le nouvel en-tête `anthropic-beta: max-tokens-3-5-sonnet-2024-07-15`.

### 9 juillet 2024

- Générez automatiquement des cas de test pour vos invites en utilisant Claude dans la [Console Développeur](https://console.anthropic.com).
- Comparez les sorties de différentes invites côte à côte dans le nouveau mode de comparaison de sortie dans la [Console Développeur](https://console.anthropic.com).

### 27 juin 2024

- Consultez l'utilisation de l'API et la facturation ventilées par montant en dollars, nombre de jetons et clés API dans les nouveaux onglets [Utilisation](https://console.anthropic.com/settings/usage) et [Coûts](https://console.anthropic.com/settings/cost) dans la [Console Développeur](https://console.anthropic.com).
- Consultez vos limites de débit API actuelles dans le nouvel onglet [Limites de débit](https://console.anthropic.com/settings/limits) dans la [Console Développeur](https://console.anthropic.com).

### 20 juin 2024

- [Claude Sonnet 3.5](http://anthropic.com/news/claude-3-5-sonnet), notre modèle le plus intelligent à ce jour, est maintenant généralement disponible sur l'API Claude, Amazon Bedrock et Google Vertex AI.

### 30 mai 2024

- L'[utilisation d'outils](/docs/fr/agents-and-tools/tool-use/overview) est maintenant généralement disponible sur l'API Claude, Amazon Bedrock et Google Vertex AI.

### 10 mai 2024

- Notre outil de générateur d'invites est maintenant disponible dans la [Console Développeur](https://console.anthropic.com). Prompt Generator facilite la guidance de Claude pour générer des invites de haute qualité adaptées à vos tâches spécifiques. En savoir plus dans notre [article de blog](https://www.anthropic.com/news/prompt-generator).