# Compétences d'Agent

Les Compétences d'Agent sont des capacités modulaires qui étendent les fonctionnalités de Claude. Chaque Compétence regroupe des instructions, des métadonnées et des ressources optionnelles (scripts, modèles) que Claude utilise automatiquement quand c'est pertinent.

---

## Pourquoi utiliser les Compétences

Les Compétences sont des ressources réutilisables basées sur le système de fichiers qui fournissent à Claude une expertise spécifique au domaine : des flux de travail, du contexte et des bonnes pratiques qui transforment les agents polyvalents en spécialistes. Contrairement aux invites (instructions au niveau de la conversation pour des tâches ponctuelles), les Compétences se chargent à la demande et éliminent le besoin de fournir à plusieurs reprises les mêmes conseils dans plusieurs conversations.

**Avantages clés** :
- **Spécialiser Claude** : Adapter les capacités pour des tâches spécifiques au domaine
- **Réduire la répétition** : Créer une fois, utiliser automatiquement
- **Composer les capacités** : Combiner les Compétences pour construire des flux de travail complexes

<Note>
Pour une analyse approfondie de l'architecture et des applications réelles des Compétences d'Agent, lisez notre blog d'ingénierie : [Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills).
</Note>

## Utiliser les Compétences

Anthropic fournit des Compétences d'Agent pré-construites pour les tâches courantes de documents (PowerPoint, Excel, Word, PDF), et vous pouvez créer vos propres Compétences personnalisées. Les deux fonctionnent de la même manière. Claude les utilise automatiquement quand c'est pertinent pour votre demande.

**Les Compétences d'Agent pré-construites** sont disponibles pour tous les utilisateurs sur claude.ai et via l'API Claude. Consultez la section [Compétences disponibles](#available-skills) ci-dessous pour la liste complète.

**Les Compétences personnalisées** vous permettent de regrouper l'expertise du domaine et les connaissances organisationnelles. Elles sont disponibles dans tous les produits de Claude : créez-les dans Claude Code, téléchargez-les via l'API ou ajoutez-les dans les paramètres de claude.ai.

<Note>
**Commencer** :
- Pour les Compétences d'Agent pré-construites : Consultez le [tutoriel de démarrage rapide](/docs/fr/agents-and-tools/agent-skills/quickstart) pour commencer à utiliser les compétences PowerPoint, Excel, Word et PDF dans l'API
- Pour les Compétences personnalisées : Consultez le [Agent Skills Cookbook](https://github.com/anthropics/claude-cookbooks/tree/main/skills) pour apprendre à créer vos propres Compétences
</Note>

## Comment fonctionnent les Compétences

Les Compétences exploitent l'environnement VM de Claude pour fournir des capacités au-delà de ce qui est possible avec les invites seules. Claude fonctionne dans une machine virtuelle avec accès au système de fichiers, permettant aux Compétences d'exister en tant que répertoires contenant des instructions, du code exécutable et des matériaux de référence, organisés comme un guide d'intégration que vous créeriez pour un nouveau membre de l'équipe.

Cette architecture basée sur le système de fichiers permet la **divulgation progressive** : Claude charge les informations par étapes selon les besoins, plutôt que de consommer le contexte à l'avance.

### Trois types de contenu de Compétence, trois niveaux de chargement

Les Compétences peuvent contenir trois types de contenu, chacun chargé à des moments différents :

### Niveau 1 : Métadonnées (toujours chargées)

**Type de contenu : Instructions**. Le préambule YAML de la Compétence fournit des informations de découverte :

```yaml
---
name: pdf-processing
description: Extract text and tables from PDF files, fill forms, merge documents. Use when working with PDF files or when the user mentions PDFs, forms, or document extraction.
---
```

Claude charge ces métadonnées au démarrage et les inclut dans l'invite système. Cette approche légère signifie que vous pouvez installer de nombreuses Compétences sans pénalité de contexte ; Claude sait seulement que chaque Compétence existe et quand l'utiliser.

### Niveau 2 : Instructions (chargées quand déclenchées)

**Type de contenu : Instructions**. Le corps principal de SKILL.md contient des connaissances procédurales : des flux de travail, des bonnes pratiques et des conseils :

````markdown
# PDF Processing

## Quick start

Use pdfplumber to extract text from PDFs:

```python
import pdfplumber

with pdfplumber.open("document.pdf") as pdf:
    text = pdf.pages[0].extract_text()
```

For advanced form filling, see [FORMS.md](FORMS.md).
````

Quand vous demandez quelque chose qui correspond à la description d'une Compétence, Claude lit SKILL.md à partir du système de fichiers via bash. C'est seulement alors que ce contenu entre dans la fenêtre de contexte.

### Niveau 3 : Ressources et code (chargés selon les besoins)

**Types de contenu : Instructions, code et ressources**. Les Compétences peuvent regrouper des matériaux supplémentaires :

```
pdf-skill/
├── SKILL.md (main instructions)
├── FORMS.md (form-filling guide)
├── REFERENCE.md (detailed API reference)
└── scripts/
    └── fill_form.py (utility script)
```

**Instructions** : Fichiers markdown supplémentaires (FORMS.md, REFERENCE.md) contenant des conseils spécialisés et des flux de travail

**Code** : Scripts exécutables (fill_form.py, validate.py) que Claude exécute via bash ; les scripts fournissent des opérations déterministes sans consommer de contexte

**Ressources** : Matériaux de référence comme les schémas de base de données, la documentation API, les modèles ou les exemples

Claude accède à ces fichiers uniquement quand ils sont référencés. Le modèle de système de fichiers signifie que chaque type de contenu a des forces différentes : les instructions pour les conseils flexibles, le code pour la fiabilité, les ressources pour la recherche factuelle.

| Niveau | Quand chargé | Coût en jetons | Contenu |
|---|---|---|---|
| **Niveau 1 : Métadonnées** | Toujours (au démarrage) | ~100 jetons par Compétence | `name` et `description` du préambule YAML |
| **Niveau 2 : Instructions** | Quand la Compétence est déclenchée | Moins de 5k jetons | Corps de SKILL.md avec instructions et conseils |
| **Niveau 3+ : Ressources** | Selon les besoins | Effectivement illimité | Fichiers regroupés exécutés via bash sans charger les contenus dans le contexte |

La divulgation progressive garantit que seul le contenu pertinent occupe la fenêtre de contexte à tout moment.

### L'architecture des Compétences

Les Compétences s'exécutent dans un environnement d'exécution de code où Claude a accès au système de fichiers, aux commandes bash et aux capacités d'exécution de code. Pensez-y ainsi : les Compétences existent en tant que répertoires sur une machine virtuelle, et Claude interagit avec elles en utilisant les mêmes commandes bash que vous utiliseriez pour naviguer dans les fichiers sur votre ordinateur.

![Agent Skills Architecture - showing how Skills integrate with the agent's configuration and virtual machine](/docs/images/agent-skills-architecture.png)

**Comment Claude accède au contenu de la Compétence :**

Quand une Compétence est déclenchée, Claude utilise bash pour lire SKILL.md à partir du système de fichiers, apportant ses instructions dans la fenêtre de contexte. Si ces instructions font référence à d'autres fichiers (comme FORMS.md ou un schéma de base de données), Claude lit également ces fichiers en utilisant des commandes bash supplémentaires. Quand les instructions mentionnent des scripts exécutables, Claude les exécute via bash et reçoit uniquement la sortie (le code du script lui-même n'entre jamais dans le contexte).

**Ce que cette architecture permet :**

**Accès aux fichiers à la demande** : Claude lit uniquement les fichiers nécessaires pour chaque tâche spécifique. Une Compétence peut inclure des dizaines de fichiers de référence, mais si votre tâche n'a besoin que du schéma de ventes, Claude charge uniquement ce fichier. Le reste reste sur le système de fichiers consommant zéro jetons.

**Exécution efficace des scripts** : Quand Claude exécute `validate_form.py`, le code du script ne se charge jamais dans la fenêtre de contexte. Seule la sortie du script (comme "Validation passed" ou des messages d'erreur spécifiques) consomme des jetons. Cela rend les scripts beaucoup plus efficaces que d'avoir Claude générer du code équivalent à la volée.

**Pas de limite pratique sur le contenu regroupé** : Parce que les fichiers ne consomment pas de contexte jusqu'à ce qu'ils soient accédés, les Compétences peuvent inclure une documentation API complète, de grands ensembles de données, des exemples étendus ou tout matériel de référence dont vous avez besoin. Il n'y a pas de pénalité de contexte pour le contenu regroupé qui n'est pas utilisé.

Ce modèle basé sur le système de fichiers est ce qui rend la divulgation progressive possible. Claude navigue dans votre Compétence comme vous référenceriez des sections spécifiques d'un guide d'intégration, accédant exactement à ce que chaque tâche nécessite.

### Exemple : Chargement d'une compétence de traitement PDF

Voici comment Claude charge et utilise une compétence de traitement PDF :

1. **Démarrage** : L'invite système inclut : `PDF Processing - Extract text and tables from PDF files, fill forms, merge documents`
2. **Demande de l'utilisateur** : "Extract the text from this PDF and summarize it"
3. **Claude invoque** : `bash: read pdf-skill/SKILL.md` → Instructions chargées dans le contexte
4. **Claude détermine** : Le remplissage de formulaire n'est pas nécessaire, donc FORMS.md n'est pas lu
5. **Claude exécute** : Utilise les instructions de SKILL.md pour accomplir la tâche

![Skills loading into context window - showing the progressive loading of skill metadata and content](/docs/images/agent-skills-context-window.png)

Le diagramme montre :
1. État par défaut avec l'invite système et les métadonnées de compétence pré-chargées
2. Claude déclenche la compétence en lisant SKILL.md via bash
3. Claude lit éventuellement des fichiers regroupés supplémentaires comme FORMS.md selon les besoins
4. Claude procède à la tâche

Ce chargement dynamique garantit que seul le contenu de compétence pertinent occupe la fenêtre de contexte.

## Où fonctionnent les Compétences

Les Compétences sont disponibles dans tous les produits d'agent de Claude :

### API Claude

L'API Claude supporte à la fois les Compétences d'Agent pré-construites et les Compétences personnalisées. Les deux fonctionnent de manière identique : spécifiez le `skill_id` pertinent dans le paramètre `container` ainsi que l'outil d'exécution de code.

**Prérequis** : L'utilisation des Compétences via l'API nécessite trois en-têtes bêta :
- `code-execution-2025-08-25` - Les Compétences s'exécutent dans le conteneur d'exécution de code
- `skills-2025-10-02` - Active la fonctionnalité Compétences
- `files-api-2025-04-14` - Requis pour télécharger/télécharger des fichiers vers/depuis le conteneur

Utilisez les Compétences d'Agent pré-construites en référençant leur `skill_id` (par exemple, `pptx`, `xlsx`), ou créez et téléchargez les vôtres via l'API des Compétences (points de terminaison `/v1/skills`). Les Compétences personnalisées sont partagées à l'échelle de l'organisation.

Pour en savoir plus, consultez [Utiliser les Compétences avec l'API Claude](/docs/fr/build-with-claude/skills-guide).

### Claude Code

[Claude Code](https://code.claude.com/docs/overview) supporte uniquement les Compétences personnalisées.

**Compétences personnalisées** : Créez les Compétences en tant que répertoires avec des fichiers SKILL.md. Claude les découvre et les utilise automatiquement.

Les Compétences personnalisées dans Claude Code sont basées sur le système de fichiers et ne nécessitent pas de téléchargements API.

Pour en savoir plus, consultez [Utiliser les Compétences dans Claude Code](https://code.claude.com/docs/skills).

### Agent SDK Claude

Le [Claude Agent SDK](/docs/fr/agent-sdk/overview) supporte les Compétences personnalisées via une configuration basée sur le système de fichiers.

**Compétences personnalisées** : Créez les Compétences en tant que répertoires avec des fichiers SKILL.md dans `.claude/skills/`. Activez les Compétences en incluant `"Skill"` dans votre configuration `allowed_tools`.

Les Compétences dans l'Agent SDK sont alors automatiquement découvertes quand le SDK s'exécute.

Pour en savoir plus, consultez [Compétences d'Agent dans le SDK](/docs/fr/agent-sdk/skills).

### Claude.ai

[Claude.ai](https://claude.ai) supporte à la fois les Compétences d'Agent pré-construites et les Compétences personnalisées.

**Compétences d'Agent pré-construites** : Ces Compétences fonctionnent déjà en arrière-plan quand vous créez des documents. Claude les utilise sans nécessiter de configuration.

**Compétences personnalisées** : Téléchargez vos propres Compétences en tant que fichiers zip via Paramètres > Fonctionnalités. Disponible sur les plans Pro, Max, Team et Enterprise avec l'exécution de code activée. Les Compétences personnalisées sont individuelles pour chaque utilisateur ; elles ne sont pas partagées à l'échelle de l'organisation et ne peuvent pas être gérées de manière centralisée par les administrateurs.

Pour en savoir plus sur l'utilisation des Compétences dans Claude.ai, consultez les ressources suivantes dans le Centre d'aide Claude :
- [What are Skills?](https://support.claude.com/en/articles/12512176-what-are-skills)
- [Using Skills in Claude](https://support.claude.com/en/articles/12512180-using-skills-in-claude)
- [How to create custom Skills](https://support.claude.com/en/articles/12512198-creating-custom-skills)
- [Tech Claude your way of working using Skills](https://support.claude.com/en/articles/12580051-teach-claude-your-way-of-working-using-skills)

## Structure de la Compétence

Chaque Compétence nécessite un fichier `SKILL.md` avec un préambule YAML :

```yaml
---
name: your-skill-name
description: Brief description of what this Skill does and when to use it
---

# Your Skill Name

## Instructions
[Clear, step-by-step guidance for Claude to follow]

## Examples
[Concrete examples of using this Skill]
```

**Champs obligatoires** : `name` et `description`

**Exigences des champs** :

`name` :
- Maximum 64 caractères
- Doit contenir uniquement des lettres minuscules, des chiffres et des tirets
- Ne peut pas contenir de balises XML
- Ne peut pas contenir de mots réservés : "anthropic", "claude"

`description` :
- Doit être non vide
- Maximum 1024 caractères
- Ne peut pas contenir de balises XML

La `description` doit inclure à la fois ce que fait la Compétence et quand Claude devrait l'utiliser. Pour des conseils complets sur la création, consultez le [guide des bonnes pratiques](/docs/fr/agents-and-tools/agent-skills/best-practices).

## Considérations de sécurité

Nous vous recommandons vivement d'utiliser les Compétences uniquement à partir de sources de confiance : celles que vous avez créées vous-même ou obtenues d'Anthropic. Les Compétences fournissent à Claude de nouvelles capacités par le biais d'instructions et de code, et bien que cela les rend puissantes, cela signifie également qu'une Compétence malveillante peut diriger Claude pour invoquer des outils ou exécuter du code d'une manière qui ne correspond pas à l'objectif déclaré de la Compétence.

<Warning>
Si vous devez utiliser une Compétence d'une source non fiable ou inconnue, exercez une extrême prudence et auditez-la complètement avant utilisation. Selon l'accès que Claude a lors de l'exécution de la Compétence, les Compétences malveillantes pourraient entraîner une exfiltration de données, un accès système non autorisé ou d'autres risques de sécurité.
</Warning>

**Considérations clés de sécurité** :
- **Auditer complètement** : Examinez tous les fichiers regroupés dans la Compétence : SKILL.md, scripts, images et autres ressources. Recherchez des modèles inhabituels comme des appels réseau inattendus, des modèles d'accès aux fichiers ou des opérations qui ne correspondent pas à l'objectif déclaré de la Compétence
- **Les sources externes sont risquées** : Les Compétences qui récupèrent des données à partir d'URL externes posent un risque particulier, car le contenu récupéré peut contenir des instructions malveillantes. Même les Compétences fiables peuvent être compromises si leurs dépendances externes changent au fil du temps
- **Mauvaise utilisation des outils** : Les Compétences malveillantes peuvent invoquer des outils (opérations sur les fichiers, commandes bash, exécution de code) de manière nuisible
- **Exposition des données** : Les Compétences ayant accès à des données sensibles pourraient être conçues pour divulguer des informations à des systèmes externes
- **Traiter comme l'installation de logiciels** : Utilisez uniquement les Compétences de sources de confiance. Soyez particulièrement prudent lors de l'intégration de Compétences dans des systèmes de production ayant accès à des données sensibles ou à des opérations critiques

## Compétences disponibles

### Compétences d'Agent pré-construites

Les Compétences d'Agent pré-construites suivantes sont disponibles pour une utilisation immédiate :

- **PowerPoint (pptx)** : Créer des présentations, modifier des diapositives, analyser le contenu des présentations
- **Excel (xlsx)** : Créer des feuilles de calcul, analyser des données, générer des rapports avec des graphiques
- **Word (docx)** : Créer des documents, modifier le contenu, formater le texte
- **PDF (pdf)** : Générer des documents PDF formatés et des rapports

Ces Compétences sont disponibles sur l'API Claude et claude.ai. Consultez le [tutoriel de démarrage rapide](/docs/fr/agents-and-tools/agent-skills/quickstart) pour commencer à les utiliser dans l'API.

### Exemples de Compétences personnalisées

Pour des exemples complets de Compétences personnalisées, consultez le [Skills cookbook](https://github.com/anthropics/claude-cookbooks/tree/main/skills).

## Limitations et contraintes

Comprendre ces limitations vous aide à planifier efficacement le déploiement de vos Compétences.

### Disponibilité entre les surfaces

**Les Compétences personnalisées ne se synchronisent pas entre les surfaces**. Les Compétences téléchargées sur une surface ne sont pas automatiquement disponibles sur les autres :

- Les Compétences téléchargées sur Claude.ai doivent être téléchargées séparément sur l'API
- Les Compétences téléchargées via l'API ne sont pas disponibles sur Claude.ai
- Les Compétences Claude Code sont basées sur le système de fichiers et séparées de Claude.ai et de l'API

Vous devrez gérer et télécharger les Compétences séparément pour chaque surface où vous souhaitez les utiliser.

### Portée du partage

Les Compétences ont des modèles de partage différents selon l'endroit où vous les utilisez :
- **Claude.ai** : Utilisateur individuel uniquement ; chaque membre de l'équipe doit télécharger séparément
- **API Claude** : À l'échelle de l'espace de travail ; tous les membres de l'espace de travail peuvent accéder aux Compétences téléchargées
- **Claude Code** : Personnel (`~/.claude/skills/`) ou basé sur le projet (`.claude/skills/`)

Claude.ai ne supporte actuellement pas la gestion centralisée par l'administrateur ou la distribution à l'échelle de l'organisation des Compétences personnalisées.

### Contraintes de l'environnement d'exécution

Les Compétences s'exécutent dans le conteneur d'exécution de code avec ces limitations :

- **Pas d'accès réseau** : Les Compétences ne peuvent pas effectuer d'appels API externes ou accéder à Internet
- **Pas d'installation de packages à l'exécution** : Seuls les packages pré-installés sont disponibles. Vous ne pouvez pas installer de nouveaux packages lors de l'exécution.
- **Dépendances pré-configurées uniquement** : Consultez la [documentation de l'outil d'exécution de code](/docs/fr/agents-and-tools/tool-use/code-execution-tool) pour la liste des packages disponibles

Planifiez vos Compétences pour fonctionner dans ces contraintes.

## Prochaines étapes

<CardGroup cols={2}>
  <Card
    title="Commencer avec les Compétences d'Agent"
    icon="graduation-cap"
    href="/docs/fr/agents-and-tools/agent-skills/quickstart"
  >
    Créer votre première Compétence
  </Card>
  <Card
    title="Guide API"
    icon="code"
    href="/docs/fr/build-with-claude/skills-guide"
  >
    Utiliser les Compétences avec l'API Claude
  </Card>
  <Card
    title="Utiliser les Compétences dans Claude Code"
    icon="terminal"
    href="https://code.claude.com/docs/skills"
  >
    Créer et gérer les Compétences personnalisées dans Claude Code
  </Card>
  <Card
    title="Utiliser les Compétences dans l'Agent SDK"
    icon="cube"
    href="/docs/fr/agent-sdk/skills"
  >
    Utiliser les Compétences par programmation en TypeScript et Python
  </Card>
  <Card
    title="Bonnes pratiques de création"
    icon="lightbulb"
    href="/docs/fr/agents-and-tools/agent-skills/best-practices"
  >
    Écrire des Compétences que Claude peut utiliser efficacement
  </Card>
</CardGroup>