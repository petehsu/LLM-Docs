# Meilleures pratiques de prompting

Techniques spécifiques d'ingénierie de prompts pour les modèles Claude 4.x, avec des conseils pour Sonnet 4.5, Haiku 4.5 et Opus 4.5.

---

Ce guide fournit des techniques spécifiques d'ingénierie de prompts pour les modèles Claude 4.x, avec des conseils spécifiques pour Sonnet 4.5, Haiku 4.5 et Opus 4.5. Ces modèles ont été entraînés pour suivre les instructions de manière plus précise que les générations précédentes de modèles Claude.
<Tip>
  Pour un aperçu des nouvelles capacités de Claude 4.5, consultez [Quoi de neuf dans Claude 4.5](/docs/fr/about-claude/models/whats-new-claude-4-5). Pour des conseils de migration depuis les modèles précédents, consultez [Migration vers Claude 4.5](/docs/fr/about-claude/models/migrating-to-claude-4).
</Tip>

## Principes généraux

### Soyez explicite dans vos instructions

Les modèles Claude 4.x réagissent bien aux instructions claires et explicites. Être spécifique sur votre résultat souhaité peut aider à améliorer les résultats. Les clients qui souhaitent le comportement « au-delà des attentes » des modèles Claude précédents pourraient avoir besoin de demander plus explicitement ces comportements avec les nouveaux modèles.

<section title="Exemple : Créer un tableau de bord analytique">

**Moins efficace :**
```text
Créer un tableau de bord analytique
```

**Plus efficace :**
```text
Créer un tableau de bord analytique. Incluez autant de fonctionnalités et d'interactions pertinentes que possible. Allez au-delà des bases pour créer une implémentation complète.
```

</section>

### Ajoutez du contexte pour améliorer les performances

Fournir du contexte ou une motivation derrière vos instructions, comme expliquer à Claude pourquoi ce comportement est important, peut aider les modèles Claude 4.x à mieux comprendre vos objectifs et à fournir des réponses plus ciblées.

<section title="Exemple : Préférences de formatage">

**Moins efficace :**
```text
N'UTILISEZ JAMAIS de points de suspension
```

**Plus efficace :**
```text
Votre réponse sera lue à haute voix par un moteur de synthèse vocale, donc n'utilisez jamais de points de suspension car le moteur de synthèse vocale ne saura pas comment les prononcer.
```

</section>

Claude est assez intelligent pour généraliser à partir de l'explication.

### Soyez vigilant avec les exemples et les détails

Les modèles Claude 4.x accordent une attention particulière aux détails et aux exemples dans le cadre de leurs capacités précises de suivi des instructions. Assurez-vous que vos exemples s'alignent avec les comportements que vous souhaitez encourager et minimisez les comportements que vous souhaitez éviter.

### Raisonnement à long horizon et suivi d'état

Les modèles Claude 4.5 excellent dans les tâches de raisonnement à long horizon avec des capacités exceptionnelles de suivi d'état. Il maintient son orientation sur des sessions étendues en se concentrant sur les progrès progressifs, en faisant des avancées régulières sur quelques choses à la fois plutôt que de tenter tout à la fois. Cette capacité émerge particulièrement sur plusieurs fenêtres de contexte ou itérations de tâches, où Claude peut travailler sur une tâche complexe, sauvegarder l'état et continuer avec une fenêtre de contexte nouvelle.

#### Conscience du contexte et flux de travail multi-fenêtres

Les modèles Claude 4.5 disposent de la [conscience du contexte](/docs/fr/build-with-claude/context-windows#context-awareness-in-claude-sonnet-4-5), permettant au modèle de suivre sa fenêtre de contexte restante (c'est-à-dire son « budget de tokens ») tout au long d'une conversation. Cela permet à Claude d'exécuter des tâches et de gérer le contexte plus efficacement en comprenant l'espace dont il dispose pour travailler.

**Gestion des limites de contexte :**

Si vous utilisez Claude dans un harnais d'agent qui compacte le contexte ou permet de sauvegarder le contexte dans des fichiers externes (comme dans Claude Code), nous vous suggérons d'ajouter cette information à votre prompt afin que Claude puisse se comporter en conséquence. Sinon, Claude pourrait parfois essayer naturellement de terminer le travail à mesure qu'il approche de la limite de contexte. Voici un exemple de prompt :

```text Exemple de prompt
Votre fenêtre de contexte sera automatiquement compactée à mesure qu'elle approche de sa limite, ce qui vous permettra de continuer à travailler indéfiniment à partir de là où vous vous êtes arrêté. Par conséquent, n'arrêtez pas les tâches plus tôt en raison de préoccupations concernant le budget de tokens. À mesure que vous approchez de votre limite de budget de tokens, sauvegardez votre progression actuelle et votre état en mémoire avant que la fenêtre de contexte ne s'actualise. Soyez toujours aussi persistant et autonome que possible et complétez les tâches entièrement, même si la fin de votre budget approche. N'arrêtez jamais artificiellement une tâche plus tôt quel que soit le contexte restant.
```

L'[outil mémoire](/docs/fr/agents-and-tools/tool-use/memory-tool) s'associe naturellement à la conscience du contexte pour des transitions de contexte transparentes.

#### Flux de travail multi-fenêtres de contexte

Pour les tâches s'étendant sur plusieurs fenêtres de contexte :

1. **Utilisez un prompt différent pour la toute première fenêtre de contexte** : Utilisez la première fenêtre de contexte pour mettre en place un cadre (écrire des tests, créer des scripts de configuration), puis utilisez les futures fenêtres de contexte pour itérer sur une liste de tâches.

2. **Demandez au modèle d'écrire des tests dans un format structuré** : Demandez à Claude de créer des tests avant de commencer le travail et de les suivre dans un format structuré (par exemple, `tests.json`). Cela conduit à une meilleure capacité à long terme à itérer. Rappelez à Claude l'importance des tests : « Il est inacceptable de supprimer ou de modifier des tests car cela pourrait entraîner des fonctionnalités manquantes ou défectueuses. »

3. **Configurez des outils de qualité de vie** : Encouragez Claude à créer des scripts de configuration (par exemple, `init.sh`) pour démarrer gracieusement les serveurs, exécuter les suites de tests et les linters. Cela évite les travaux répétés lors de la continuation à partir d'une nouvelle fenêtre de contexte.

4. **Recommencer à zéro ou compacter** : Lorsqu'une fenêtre de contexte est effacée, envisagez de recommencer avec une toute nouvelle fenêtre de contexte plutôt que d'utiliser la compaction. Les modèles Claude 4.5 sont extrêmement efficaces pour découvrir l'état à partir du système de fichiers local. Dans certains cas, vous pourriez vouloir tirer parti de cela plutôt que de la compaction. Soyez prescriptif sur la façon dont il devrait commencer :
   - « Appelez pwd ; vous ne pouvez lire et écrire des fichiers que dans ce répertoire. »
   - « Examinez progress.txt, tests.json et les journaux git. »
   - « Exécutez manuellement un test d'intégration fondamental avant de passer à la mise en œuvre de nouvelles fonctionnalités. »

5. **Fournissez des outils de vérification** : À mesure que la longueur des tâches autonomes augmente, Claude doit vérifier l'exactitude sans retour continu de l'utilisateur. Des outils comme le serveur Playwright MCP ou les capacités d'utilisation informatique pour tester les interfaces utilisateur sont utiles.

6. **Encouragez l'utilisation complète du contexte** : Invitez Claude à compléter efficacement les composants avant de passer à autre chose :

```text Exemple de prompt
Ceci est une tâche très longue, il peut donc être bénéfique de planifier clairement votre travail. Il est encouragé de dépenser tout votre contexte de sortie sur la tâche - assurez-vous simplement de ne pas manquer de contexte avec un travail important non validé. Continuez à travailler systématiquement jusqu'à ce que vous ayez complété cette tâche.
```

#### Meilleures pratiques de gestion d'état

- **Utilisez des formats structurés pour les données d'état** : Lors du suivi d'informations structurées (comme les résultats de tests ou l'état des tâches), utilisez JSON ou d'autres formats structurés pour aider Claude à comprendre les exigences de schéma
- **Utilisez du texte non structuré pour les notes de progression** : Les notes de progression en forme libre fonctionnent bien pour suivre la progression générale et le contexte
- **Utilisez git pour le suivi d'état** : Git fournit un journal de ce qui a été fait et des points de contrôle qui peuvent être restaurés. Les modèles Claude 4.5 fonctionnent particulièrement bien en utilisant git pour suivre l'état sur plusieurs sessions.
- **Mettez l'accent sur la progression progressive** : Demandez explicitement à Claude de suivre sa progression et de se concentrer sur le travail progressif

<section title="Exemple : Suivi d'état">

```json
// Fichier d'état structuré (tests.json)
{
  "tests": [
    {"id": 1, "name": "authentication_flow", "status": "passing"},
    {"id": 2, "name": "user_management", "status": "failing"},
    {"id": 3, "name": "api_endpoints", "status": "not_started"}
  ],
  "total": 200,
  "passing": 150,
  "failing": 25,
  "not_started": 25
}
```

```text
// Notes de progression (progress.txt)
Progression de la session 3 :
- Correction de la validation du jeton d'authentification
- Mise à jour du modèle utilisateur pour gérer les cas limites
- Suivant : enquêter sur les échecs du test user_management (test #2)
- Remarque : Ne supprimez pas les tests car cela pourrait entraîner des fonctionnalités manquantes
```

</section>

### Style de communication

Les modèles Claude 4.5 ont un style de communication plus concis et naturel par rapport aux modèles précédents :

- **Plus direct et ancré** : Fournit des rapports de progression basés sur les faits plutôt que des mises à jour auto-congratulatoires
- **Plus conversationnel** : Légèrement plus fluide et familier, moins mécanique
- **Moins verbeux** : Peut ignorer les résumés détaillés pour l'efficacité sauf si demandé autrement

Ce style de communication reflète fidèlement ce qui a été réalisé sans élaboration inutile.

## Conseils pour des situations spécifiques

### Équilibrez la verbosité

Les modèles Claude 4.5 tendent vers l'efficacité et peuvent ignorer les résumés verbaux après les appels d'outils, passant directement à l'action suivante. Bien que cela crée un flux de travail rationalisé, vous pourriez préférer plus de visibilité sur son processus de raisonnement.

Si vous souhaitez que Claude fournisse des mises à jour au fur et à mesure qu'il travaille :

```text Exemple de prompt
Après avoir complété une tâche impliquant l'utilisation d'outils, fournissez un résumé rapide du travail que vous avez effectué.
```

### Modèles d'utilisation d'outils

Les modèles Claude 4.5 sont entraînés pour un suivi précis des instructions et bénéficient d'une direction explicite pour utiliser des outils spécifiques. Si vous dites « pouvez-vous suggérer quelques modifications », il fournira parfois des suggestions plutôt que de les mettre en œuvre, même si faire des modifications pourrait être ce que vous aviez l'intention.

Pour que Claude agisse, soyez plus explicite :

<section title="Exemple : Instructions explicites">

**Moins efficace (Claude ne fera que suggérer) :**
```text
Pouvez-vous suggérer quelques modifications pour améliorer cette fonction ?
```

**Plus efficace (Claude fera les modifications) :**
```text
Modifiez cette fonction pour améliorer ses performances.
```

Ou :
```text
Apportez ces modifications au flux d'authentification.
```

</section>

Pour rendre Claude plus proactif dans la prise de mesures par défaut, vous pouvez ajouter ceci à votre prompt système :

```text Exemple de prompt pour une action proactive
<default_to_action>
Par défaut, implémentez les modifications plutôt que de seulement les suggérer. Si l'intention de l'utilisateur n'est pas claire, déduisez l'action la plus utile probable et procédez, en utilisant les outils pour découvrir les détails manquants au lieu de deviner. Essayez de déduire l'intention de l'utilisateur concernant qu'un appel d'outil (par exemple, modification ou lecture de fichier) est prévu ou non, et agissez en conséquence.
</default_to_action>
```

D'autre part, si vous souhaitez que le modèle soit plus hésitant par défaut, moins enclin à se lancer directement dans les implémentations, et ne prenne des mesures que si demandé, vous pouvez orienter ce comportement avec un prompt comme celui-ci :

```text Exemple de prompt pour une action conservatrice
<do_not_act_before_instructions>
Ne vous lancez pas dans l'implémentation ou la modification de fichiers sauf si clairement invité à apporter des modifications. Lorsque l'intention de l'utilisateur est ambiguë, préférez fournir des informations, faire des recherches et fournir des recommandations plutôt que de prendre des mesures. Procédez uniquement avec les modifications, les ajustements ou les implémentations lorsque l'utilisateur les demande explicitement.
</do_not_act_before_instructions>
```

### Utilisation d'outils et déclenchement

Claude Opus 4.5 est plus réactif au prompt système que les modèles précédents. Si vos prompts ont été conçus pour réduire le sous-déclenchement sur les outils ou les compétences, Claude Opus 4.5 pourrait maintenant sur-déclencher. La solution est de réduire tout langage agressif. Là où vous auriez pu dire « CRITIQUE : Vous DEVEZ utiliser cet outil quand... », vous pouvez utiliser un prompting plus normal comme « Utilisez cet outil quand... ».

### Contrôlez le format des réponses

Il y a quelques façons que nous avons trouvées particulièrement efficaces pour orienter le formatage de sortie dans les modèles Claude 4.x :

1. **Dites à Claude quoi faire au lieu de quoi ne pas faire**

   - Au lieu de : « N'utilisez pas de markdown dans votre réponse »
   - Essayez : « Votre réponse doit être composée de paragraphes de prose fluides. »

2. **Utilisez des indicateurs de format XML**

   - Essayez : « Écrivez les sections de prose de votre réponse dans les balises \<smoothly_flowing_prose_paragraphs\>. »

3. **Faites correspondre le style de votre prompt au résultat souhaité**

   Le style de formatage utilisé dans votre prompt peut influencer le style de réponse de Claude. Si vous rencontrez toujours des problèmes de stéérabilité avec le formatage de sortie, nous recommandons autant que possible de faire correspondre le style de votre prompt à votre style de résultat souhaité. Par exemple, supprimer le markdown de votre prompt peut réduire le volume de markdown dans la sortie.

4. **Utilisez des prompts détaillés pour des préférences de formatage spécifiques**

   Pour plus de contrôle sur l'utilisation du markdown et du formatage, fournissez des conseils explicites :

```text Exemple de prompt pour minimiser le markdown
<avoid_excessive_markdown_and_bullet_points>
Lors de la rédaction de rapports, de documents, d'explications techniques, d'analyses ou de tout contenu long, écrivez en prose claire et fluide en utilisant des paragraphes et des phrases complets. Utilisez des sauts de paragraphe standard pour l'organisation et réservez le markdown principalement pour le `code en ligne`, les blocs de code (```...```), et les titres simples (###, et ###). Évitez d'utiliser **gras** et *italiques*.

N'UTILISEZ PAS de listes ordonnées (1. ...) ou de listes non ordonnées (*) sauf : a) vous présentez des éléments vraiment discrets où un format de liste est la meilleure option, ou b) l'utilisateur demande explicitement une liste ou un classement

Au lieu de lister les éléments avec des puces ou des numéros, incorporez-les naturellement dans les phrases. Ce conseil s'applique particulièrement à la rédaction technique. Utiliser de la prose au lieu d'un formatage excessif améliorera la satisfaction de l'utilisateur. NE PRODUISEZ JAMAIS une série de points de balle excessivement courts.

Votre objectif est un texte lisible et fluide qui guide le lecteur naturellement à travers les idées plutôt que de fragmenter les informations en points isolés.
</avoid_excessive_markdown_and_bullet_points>
```

### Recherche et collecte d'informations

Les modèles Claude 4.5 démontrent des capacités de recherche agentive exceptionnelles et peuvent trouver et synthétiser efficacement les informations provenant de plusieurs sources. Pour des résultats de recherche optimaux :

1. **Fournissez des critères de succès clairs** : Définissez ce qui constitue une réponse réussie à votre question de recherche

2. **Encouragez la vérification des sources** : Demandez à Claude de vérifier les informations sur plusieurs sources

3. **Pour les tâches de recherche complexes, utilisez une approche structurée** :

```text Exemple de prompt pour une recherche complexe
Recherchez ces informations de manière structurée. Au fur et à mesure que vous collectez des données, développez plusieurs hypothèses concurrentes. Suivez vos niveaux de confiance dans vos notes de progression pour améliorer l'étalonnage. Critiquez régulièrement votre approche et votre plan. Mettez à jour un fichier d'arbre d'hypothèses ou de notes de recherche pour persister les informations et fournir la transparence. Décomposez cette tâche de recherche complexe systématiquement.
```

Cette approche structurée permet à Claude de trouver et de synthétiser pratiquement n'importe quel élément d'information et de critiquer itérativement ses conclusions, peu importe la taille du corpus.

### Orchestration de sous-agents

Les modèles Claude 4.5 démontrent des capacités d'orchestration de sous-agents natives considérablement améliorées. Ces modèles peuvent reconnaître quand les tâches bénéficieraient de la délégation du travail à des sous-agents spécialisés et le font de manière proactive sans nécessiter d'instructions explicites.

Pour tirer parti de ce comportement :

1. **Assurez-vous que les outils de sous-agents sont bien définis** : Ayez des outils de sous-agents disponibles et décrits dans les définitions d'outils
2. **Laissez Claude orchestrer naturellement** : Claude déléguera de manière appropriée sans instruction explicite
3. **Ajustez la conservatisme si nécessaire** :

```text Exemple de prompt pour une utilisation conservatrice de sous-agents
Déléguez aux sous-agents uniquement lorsque la tâche bénéficie clairement d'un agent séparé avec une nouvelle fenêtre de contexte.
```

### Connaissance de soi du modèle

Si vous souhaitez que Claude s'identifie correctement dans votre application ou utilise des chaînes API spécifiques :

```text Exemple de prompt pour l'identité du modèle
L'assistant est Claude, créé par Anthropic. Le modèle actuel est Claude Sonnet 4.5.
```

Pour les applications alimentées par LLM qui doivent spécifier des chaînes de modèle :

```text Exemple de prompt pour la chaîne de modèle
Lorsqu'un LLM est nécessaire, veuillez utiliser par défaut Claude Sonnet 4.5 sauf si l'utilisateur demande autrement. La chaîne de modèle exacte pour Claude Sonnet 4.5 est claude-sonnet-4-5-20250929.
```

### Sensibilité à la réflexion

Lorsque la réflexion étendue est désactivée, Claude Opus 4.5 est particulièrement sensible au mot « think » et à ses variantes. Nous recommandons de remplacer « think » par des mots alternatifs qui véhiculent un sens similaire, tels que « consider », « believe » et « evaluate ».

### Tirez parti des capacités de réflexion et de réflexion entrelacée

Les modèles Claude 4.x offrent des capacités de réflexion qui peuvent être particulièrement utiles pour les tâches impliquant une réflexion après l'utilisation d'outils ou un raisonnement multi-étapes complexe. Vous pouvez guider sa réflexion initiale ou entrelacée pour de meilleurs résultats.

```text Exemple de prompt
Après avoir reçu les résultats des outils, réfléchissez attentivement à leur qualité et déterminez les étapes suivantes optimales avant de procéder. Utilisez votre réflexion pour planifier et itérer en fonction de ces nouvelles informations, puis prenez la meilleure action suivante.
```

<Info>
  Pour plus d'informations sur les capacités de réflexion, consultez [Réflexion étendue](/docs/fr/build-with-claude/extended-thinking).
</Info>

### Création de documents

Les modèles Claude 4.5 excellent dans la création de présentations, d'animations et de documents visuels. Ces modèles correspondent ou dépassent Claude Opus 4.1 dans ce domaine, avec un flair créatif impressionnant et un suivi d'instructions plus fort. Les modèles produisent une sortie polie et utilisable du premier coup dans la plupart des cas.

Pour de meilleurs résultats avec la création de documents :

```text Exemple de prompt
Créez une présentation professionnelle sur [sujet]. Incluez des éléments de conception réfléchis, une hiérarchie visuelle et des animations engageantes le cas échéant.
```

### Capacités de vision améliorées

Claude Opus 4.5 a des capacités de vision améliorées par rapport aux modèles Claude précédents. Il fonctionne mieux sur les tâches de traitement d'images et d'extraction de données, particulièrement lorsqu'il y a plusieurs images présentes dans le contexte. Ces améliorations se reportent sur l'utilisation informatique, où le modèle peut interpréter plus fiablement les captures d'écran et les éléments d'interface utilisateur. Vous pouvez également utiliser Claude Opus 4.5 pour analyser les vidéos en les divisant en images.

Une technique que nous avons trouvée efficace pour améliorer davantage les performances est de donner à Claude Opus 4.5 un outil de recadrage ou une [compétence](/docs/fr/agents-and-tools/agent-skills/overview). Nous avons observé une amélioration constante sur les évaluations d'images lorsque Claude est capable de « zoomer » sur les régions pertinentes d'une image. Nous avons rassemblé un livre de recettes pour l'outil de recadrage [ici](https://github.com/anthropics/claude-cookbooks/blob/main/multimodal/crop_tool.ipynb).

### Optimisez l'appel d'outils parallèles

Les modèles Claude 4.x excellent dans l'exécution d'outils parallèles, Sonnet 4.5 étant particulièrement agressif dans le lancement de plusieurs opérations simultanément. Les modèles Claude 4.x vont :

- Exécuter plusieurs recherches spéculatives lors de la recherche
- Lire plusieurs fichiers à la fois pour construire le contexte plus rapidement
- Exécuter les commandes bash en parallèle (ce qui peut même créer un goulot d'étranglement des performances du système)

Ce comportement est facilement orientable. Bien que le modèle ait un taux de réussite élevé dans l'appel d'outils parallèles sans prompting, vous pouvez augmenter cela à ~100% ou ajuster le niveau d'agressivité :

```text Exemple de prompt pour l'efficacité parallèle maximale
<use_parallel_tool_calls>
Si vous avez l'intention d'appeler plusieurs outils et qu'il n'y a pas de dépendances entre les appels d'outils, faites tous les appels d'outils indépendants en parallèle. Privilégiez l'appel d'outils simultanément chaque fois que les actions peuvent être effectuées en parallèle plutôt que séquentiellement. Par exemple, lors de la lecture de 3 fichiers, exécutez 3 appels d'outils en parallèle pour lire les 3 fichiers dans le contexte en même temps. Maximisez l'utilisation des appels d'outils parallèles si possible pour augmenter la vitesse et l'efficacité. Cependant, si certains appels d'outils dépendent des appels précédents pour informer les valeurs dépendantes comme les paramètres, N'APPELEZ PAS ces outils en parallèle et appelez-les plutôt séquentiellement. N'utilisez jamais de placeholders ou ne devinez pas les paramètres manquants dans les appels d'outils.
</use_parallel_tool_calls>
```

```text Exemple de prompt pour réduire l'exécution parallèle
Exécutez les opérations séquentiellement avec de brèves pauses entre chaque étape pour assurer la stabilité.
```

### Réduisez la création de fichiers dans le codage agentif

Les modèles Claude 4.x peuvent parfois créer de nouveaux fichiers à des fins de test et d'itération, particulièrement lorsqu'ils travaillent avec du code. Cette approche permet à Claude d'utiliser des fichiers, en particulier des scripts python, comme un « bloc-notes temporaire » avant de sauvegarder sa sortie finale. L'utilisation de fichiers temporaires peut améliorer les résultats particulièrement pour les cas d'utilisation de codage agentif.

Si vous préférez minimiser la création nette de nouveaux fichiers, vous pouvez instruire Claude de nettoyer après lui :

```text Exemple de prompt
Si vous créez des fichiers temporaires, des scripts ou des fichiers d'aide pour l'itération, nettoyez ces fichiers en les supprimant à la fin de la tâche.
```

### Surempressement et création de fichiers

Claude Opus 4.5 a une tendance à sur-concevoir en créant des fichiers supplémentaires, en ajoutant des abstractions inutiles ou en construisant de la flexibilité qui n'a pas été demandée. Si vous voyez ce comportement indésirable, ajoutez un prompting explicite pour garder les solutions minimales.

Par exemple :

```text Exemple de prompt pour minimiser la sur-conception
Évitez la sur-conception. Apportez uniquement les modifications directement demandées ou clairement nécessaires. Gardez les solutions simples et ciblées.

N'ajoutez pas de fonctionnalités, ne refactorisez pas le code ou ne faites pas « d'améliorations » au-delà de ce qui a été demandé. Une correction de bug n'a pas besoin que le code environnant soit nettoyé. Une fonctionnalité simple n'a pas besoin de configurabilité supplémentaire.

N'ajoutez pas de gestion d'erreurs, de solutions de secours ou de validation pour les scénarios qui ne peuvent pas se produire. Faites confiance aux garanties du code interne et du framework. Validez uniquement aux limites du système (entrée utilisateur, API externes). N'utilisez pas de shims de compatibilité rétroactive lorsque vous pouvez simplement modifier le code.

Ne créez pas d'aides, d'utilitaires ou d'abstractions pour les opérations ponctuelles. Ne concevez pas pour les exigences futures hypothétiques. La bonne quantité de complexité est le minimum nécessaire pour la tâche actuelle. Réutilisez les abstractions existantes si possible et suivez le principe DRY.
```

### Conception frontale

Les modèles Claude 4.x, particulièrement Opus 4.5, excellent dans la construction d'applications web complexes et réelles avec une forte conception frontale. Cependant, sans conseils, les modèles peuvent par défaut converger vers des modèles génériques qui créent ce que les utilisateurs appellent l'esthétique « AI slop ». Pour créer des frontales distinctives et créatives qui surprennent et ravissent :

<Tip>
Pour un guide détaillé sur l'amélioration de la conception frontale, consultez notre article de blog sur [l'amélioration de la conception frontale par le biais de compétences](https://www.claude.com/blog/improving-frontend-design-through-skills).
</Tip>

Voici un extrait de prompt système que vous pouvez utiliser pour encourager une meilleure conception frontale :

```text Exemple de prompt pour l'esthétique frontale
<frontend_aesthetics>
Vous avez tendance à converger vers des résultats génériques « sur distribution ». Dans la conception frontale, cela crée ce que les utilisateurs appellent l'esthétique « AI slop ». Évitez cela : créez des frontales créatives et distinctives qui surprennent et ravissent.

Concentrez-vous sur :
- Typographie : Choisissez des polices qui sont belles, uniques et intéressantes. Évitez les polices génériques comme Arial et Inter ; optez plutôt pour des choix distinctifs qui élèvent l'esthétique de la frontale.
- Couleur et thème : Engagez-vous dans une esthétique cohésive. Utilisez les variables CSS pour la cohérence. Les couleurs dominantes avec des accents nets surpassent les palettes timides et uniformément distribuées. Tirez l'inspiration des thèmes IDE et des esthétiques culturelles.
- Mouvement : Utilisez les animations pour les effets et les micro-interactions. Privilégiez les solutions CSS uniquement pour HTML. Utilisez la bibliothèque Motion pour React si disponible. Concentrez-vous sur les moments à fort impact : un chargement de page bien orchestré avec des révélations échelonnées (animation-delay) crée plus de délice que des micro-interactions dispersées.
- Arrière-plans : Créez l'atmosphère et la profondeur plutôt que de vous en tenir aux couleurs unies. Superposez les dégradés CSS, utilisez des motifs géométriques ou ajoutez des effets contextuels qui correspondent à l'esthétique générale.

Évitez les esthétiques génériques générées par l'IA :
- Familles de polices surutilisées (Inter, Roboto, Arial, polices système)
- Schémas de couleurs clichés (particulièrement les dégradés violets sur les arrière-plans blancs)
- Mises en page et modèles de composants prévisibles
- Conception générique qui manque de caractère spécifique au contexte

Interprétez de manière créative et faites des choix inattendus qui semblent véritablement conçus pour le contexte. Variez entre les thèmes clairs et sombres, les différentes polices, les différentes esthétiques. Vous avez toujours tendance à converger sur des choix communs (Space Grotesk, par exemple) entre les générations. Évitez cela : il est critique que vous pensiez en dehors des sentiers battus !
</frontend_aesthetics>
```

Vous pouvez également consulter la compétence complète [ici](https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md).

### Évitez de vous concentrer sur la réussite des tests et le codage en dur

Les modèles Claude 4.x peuvent parfois se concentrer trop fortement sur la réussite des tests au détriment de solutions plus générales, ou peuvent utiliser des contournements comme des scripts d'aide pour les refactorisations complexes au lieu d'utiliser les outils standard directement. Pour prévenir ce comportement et assurer des solutions robustes et généralisables :

```text Exemple de prompt
Veuillez écrire une solution de haute qualité et à usage général en utilisant les outils standard disponibles. Ne créez pas de scripts d'aide ou de contournements pour accomplir la tâche plus efficacement. Implémentez une solution qui fonctionne correctement pour toutes les entrées valides, pas seulement les cas de test. Ne codez pas en dur les valeurs ou ne créez pas de solutions qui ne fonctionnent que pour des entrées de test spécifiques. Au lieu de cela, implémentez la logique réelle qui résout le problème de manière générale.

Concentrez-vous sur la compréhension des exigences du problème et la mise en œuvre de l'algorithme correct. Les tests sont là pour vérifier l'exactitude, pas pour définir la solution. Fournissez une implémentation fondée qui suit les meilleures pratiques et les principes de conception logicielle.

Si la tâche est déraisonnable ou irréalisable, ou si l'un des tests est incorrect, veuillez m'en informer plutôt que de les contourner. La solution doit être robuste, maintenable et extensible.
```

### Encourager l'exploration du code

Claude Opus 4.5 est très capable mais peut être trop conservateur lors de l'exploration du code. Si vous remarquez que le modèle propose des solutions sans regarder le code ou en faisant des hypothèses sur le code qu'il n'a pas lu, la meilleure solution est d'ajouter des instructions explicites au prompt. Claude Opus 4.5 est notre modèle le plus orientable à ce jour et répond de manière fiable aux conseils directs.

Par exemple :

```text Exemple de prompt pour l'exploration du code
LISEZ TOUJOURS et comprenez les fichiers pertinents avant de proposer des modifications de code. Ne spéculez pas sur le code que vous n'avez pas inspecté. Si l'utilisateur référence un fichier/chemin spécifique, vous DEVEZ l'ouvrir et l'inspecter avant d'expliquer ou de proposer des corrections. Soyez rigoureux et persistant dans la recherche du code pour les faits clés. Examinez attentivement le style, les conventions et les abstractions de la base de code avant de mettre en œuvre de nouvelles fonctionnalités ou abstractions.
```

### Minimiser les hallucinations dans le codage agentif

Les modèles Claude 4.x sont moins sujets aux hallucinations et donnent des réponses plus précises, fondées et intelligentes basées sur le code. Pour encourager ce comportement encore plus et minimiser les hallucinations :

```text Exemple de prompt
<investigate_before_answering>
Ne spéculez jamais sur le code que vous n'avez pas ouvert. Si l'utilisateur référence un fichier spécifique, vous DEVEZ lire le fichier avant de répondre. Assurez-vous d'enquêter et de lire les fichiers pertinents AVANT de répondre aux questions sur la base de code. Ne faites jamais de réclamations sur le code avant d'enquêter sauf si vous êtes certain de la bonne réponse - donnez des réponses fondées et sans hallucinations.
</investigate_before_answering>
```

## Considérations de migration

Lors de la migration vers les modèles Claude 4.5 :

1. **Soyez spécifique sur le comportement souhaité** : Envisagez de décrire exactement ce que vous aimeriez voir dans la sortie.

2. **Encadrez vos instructions avec des modificateurs** : Ajouter des modificateurs qui encouragent Claude à augmenter la qualité et le détail de sa sortie peut aider à mieux façonner les performances de Claude. Par exemple, au lieu de « Créer un tableau de bord analytique », utilisez « Créer un tableau de bord analytique. Incluez autant de fonctionnalités et d'interactions pertinentes que possible. Allez au-delà des bases pour créer une implémentation complète. »

3. **Demandez des fonctionnalités spécifiques explicitement** : Les animations et les éléments interactifs doivent être demandés explicitement si souhaités.