# Bonnes pratiques de création de Skills

Apprenez à rédiger des Skills efficaces que Claude peut découvrir et utiliser avec succès.

---

Les bons Skills sont concis, bien structurés et testés avec une utilisation réelle. Ce guide fournit des décisions pratiques de rédaction pour vous aider à créer des Skills que Claude peut découvrir et utiliser efficacement.

Pour des informations conceptuelles sur le fonctionnement des Skills, consultez la [présentation des Skills](/docs/fr/agents-and-tools/agent-skills/overview).

## Principes fondamentaux

### La concision est essentielle

La [fenêtre de contexte](/docs/fr/build-with-claude/context-windows) est un bien public. Votre Skill partage la fenêtre de contexte avec tout ce que Claude doit savoir, notamment :
- L'invite système
- L'historique de la conversation
- Les métadonnées d'autres Skills
- Votre demande réelle

Chaque token de votre Skill n'a pas un coût immédiat. Au démarrage, seules les métadonnées (nom et description) de tous les Skills sont pré-chargées. Claude lit SKILL.md uniquement lorsque le Skill devient pertinent, et lit les fichiers supplémentaires uniquement si nécessaire. Cependant, être concis dans SKILL.md reste important : une fois que Claude le charge, chaque token entre en concurrence avec l'historique de la conversation et d'autres contextes.

**Hypothèse par défaut** : Claude est déjà très intelligent

Ajoutez uniquement le contexte que Claude n'a pas déjà. Remettez en question chaque information :
- « Claude a-t-il vraiment besoin de cette explication ? »
- « Puis-je supposer que Claude le sait ? »
- « Ce paragraphe justifie-t-il son coût en tokens ? »

**Bon exemple : Concis** (environ 50 tokens) :
````markdown
## Extraire le texte d'un PDF

Utilisez pdfplumber pour l'extraction de texte :

```python
import pdfplumber

with pdfplumber.open("file.pdf") as pdf:
    text = pdf.pages[0].extract_text()
```
````

**Mauvais exemple : Trop verbeux** (environ 150 tokens) :
```markdown
## Extraire le texte d'un PDF

PDF (Portable Document Format) est un format de fichier courant qui contient
du texte, des images et d'autres contenus. Pour extraire du texte d'un PDF, vous devrez
utiliser une bibliothèque. Il existe de nombreuses bibliothèques disponibles pour le traitement des PDF, mais nous
recommandons pdfplumber car elle est facile à utiliser et gère bien la plupart des cas.
D'abord, vous devrez l'installer en utilisant pip. Ensuite, vous pouvez utiliser le code ci-dessous...
```

La version concise suppose que Claude sait ce que sont les PDF et comment fonctionnent les bibliothèques.

### Définir des degrés de liberté appropriés

Adaptez le niveau de spécificité à la fragilité et à la variabilité de la tâche.

**Haute liberté** (instructions basées sur du texte) :

À utiliser quand :
- Plusieurs approches sont valides
- Les décisions dépendent du contexte
- Les heuristiques guident l'approche

Exemple :
```markdown
## Processus d'examen du code

1. Analyser la structure et l'organisation du code
2. Vérifier les bugs potentiels ou les cas limites
3. Suggérer des améliorations pour la lisibilité et la maintenabilité
4. Vérifier le respect des conventions du projet
```

**Liberté moyenne** (pseudocode ou scripts avec paramètres) :

À utiliser quand :
- Un modèle préféré existe
- Une certaine variation est acceptable
- La configuration affecte le comportement

Exemple :
````markdown
## Générer un rapport

Utilisez ce modèle et personnalisez-le selon vos besoins :

```python
def generate_report(data, format="markdown", include_charts=True):
    # Traiter les données
    # Générer la sortie au format spécifié
    # Inclure optionnellement des visualisations
```
````

**Basse liberté** (scripts spécifiques, peu ou pas de paramètres) :

À utiliser quand :
- Les opérations sont fragiles et sujettes aux erreurs
- La cohérence est critique
- Une séquence spécifique doit être suivie

Exemple :
````markdown
## Migration de base de données

Exécutez exactement ce script :

```bash
python scripts/migrate.py --verify --backup
```

Ne modifiez pas la commande et n'ajoutez pas de drapeaux supplémentaires.
````

**Analogie** : Pensez à Claude comme un robot explorant un chemin :
- **Pont étroit avec des falaises de chaque côté** : Il n'y a qu'une seule voie sûre. Fournissez des garde-fous spécifiques et des instructions exactes (basse liberté). Exemple : les migrations de base de données qui doivent s'exécuter dans une séquence exacte.
- **Champ ouvert sans dangers** : De nombreux chemins mènent au succès. Donnez une direction générale et faites confiance à Claude pour trouver la meilleure route (haute liberté). Exemple : les examens de code où le contexte détermine la meilleure approche.

### Tester avec tous les modèles que vous prévoyez d'utiliser

Les Skills agissent comme des additions aux modèles, donc l'efficacité dépend du modèle sous-jacent. Testez votre Skill avec tous les modèles que vous prévoyez d'utiliser.

**Considérations de test par modèle** :
- **Claude Haiku** (rapide, économique) : Le Skill fournit-il suffisamment de conseils ?
- **Claude Sonnet** (équilibré) : Le Skill est-il clair et efficace ?
- **Claude Opus** (raisonnement puissant) : Le Skill évite-t-il les sur-explications ?

Ce qui fonctionne parfaitement pour Opus pourrait nécessiter plus de détails pour Haiku. Si vous prévoyez d'utiliser votre Skill sur plusieurs modèles, visez des instructions qui fonctionnent bien avec tous.

## Structure du Skill

<Note>
**Frontmatter YAML** : Le frontmatter SKILL.md nécessite deux champs :

`name` :
- Maximum 64 caractères
- Doit contenir uniquement des lettres minuscules, des chiffres et des tirets
- Ne peut pas contenir de balises XML
- Ne peut pas contenir de mots réservés : « anthropic », « claude »

`description` :
- Doit être non vide
- Maximum 1024 caractères
- Ne peut pas contenir de balises XML
- Doit décrire ce que fait le Skill et quand l'utiliser

Pour les détails complets de la structure du Skill, consultez la [présentation des Skills](/docs/fr/agents-and-tools/agent-skills/overview#skill-structure).
</Note>

### Conventions de nommage

Utilisez des modèles de nommage cohérents pour faciliter la référence et la discussion des Skills. Nous recommandons d'utiliser la **forme gérondive** (verbe + -ing) pour les noms de Skills, car cela décrit clairement l'activité ou la capacité que le Skill fournit.

N'oubliez pas que le champ `name` doit utiliser uniquement des lettres minuscules, des chiffres et des tirets.

**Bons exemples de nommage (forme gérondive)** :
- `processing-pdfs`
- `analyzing-spreadsheets`
- `managing-databases`
- `testing-code`
- `writing-documentation`

**Alternatives acceptables** :
- Syntagmes nominaux : `pdf-processing`, `spreadsheet-analysis`
- Orientés vers l'action : `process-pdfs`, `analyze-spreadsheets`

**À éviter** :
- Noms vagues : `helper`, `utils`, `tools`
- Trop génériques : `documents`, `data`, `files`
- Mots réservés : `anthropic-helper`, `claude-tools`
- Modèles incohérents dans votre collection de skills

Un nommage cohérent facilite :
- La référence aux Skills dans la documentation et les conversations
- La compréhension de ce qu'un Skill fait en un coup d'œil
- L'organisation et la recherche dans plusieurs Skills
- La maintenance d'une bibliothèque de skills professionnelle et cohésive

### Rédiger des descriptions efficaces

Le champ `description` permet la découverte du Skill et doit inclure à la fois ce que fait le Skill et quand l'utiliser.

<Warning>
**Écrivez toujours à la troisième personne**. La description est injectée dans l'invite système, et une perspective incohérente peut causer des problèmes de découverte.

- **Bon :** « Traite les fichiers Excel et génère des rapports »
- **À éviter :** « Je peux vous aider à traiter les fichiers Excel »
- **À éviter :** « Vous pouvez utiliser ceci pour traiter les fichiers Excel »
</Warning>

**Soyez spécifique et incluez les termes clés**. Incluez à la fois ce que fait le Skill et les déclencheurs/contextes spécifiques pour quand l'utiliser.

Chaque Skill a exactement un champ de description. La description est critique pour la sélection du Skill : Claude l'utilise pour choisir le bon Skill parmi potentiellement 100+ Skills disponibles. Votre description doit fournir suffisamment de détails pour que Claude sache quand sélectionner ce Skill, tandis que le reste de SKILL.md fournit les détails d'implémentation.

Exemples efficaces :

**Skill de traitement PDF :**
```yaml
description: Extrait le texte et les tableaux des fichiers PDF, remplit les formulaires, fusionne les documents. À utiliser lors du travail avec des fichiers PDF ou lorsque l'utilisateur mentionne les PDF, les formulaires ou l'extraction de documents.
```

**Skill d'analyse Excel :**
```yaml
description: Analyse les feuilles de calcul Excel, crée des tableaux croisés dynamiques, génère des graphiques. À utiliser lors de l'analyse de fichiers Excel, de feuilles de calcul, de données tabulaires ou de fichiers .xlsx.
```

**Skill d'aide à la validation Git :**
```yaml
description: Génère des messages de validation descriptifs en analysant les diffs git. À utiliser lorsque l'utilisateur demande de l'aide pour rédiger des messages de validation ou pour examiner les modifications en attente.
```

Évitez les descriptions vagues comme celles-ci :

```yaml
description: Aide avec les documents
```
```yaml
description: Traite les données
```
```yaml
description: Fait des choses avec les fichiers
```

### Modèles de divulgation progressive

SKILL.md sert de présentation qui pointe Claude vers des matériaux détaillés selon les besoins, comme une table des matières dans un guide d'intégration. Pour une explication du fonctionnement de la divulgation progressive, consultez [Comment fonctionnent les Skills](/docs/fr/agents-and-tools/agent-skills/overview#how-skills-work) dans la présentation.

**Conseils pratiques :**
- Gardez le corps de SKILL.md sous 500 lignes pour des performances optimales
- Divisez le contenu en fichiers séparés lorsque vous approchez cette limite
- Utilisez les modèles ci-dessous pour organiser efficacement les instructions, le code et les ressources

#### Aperçu visuel : Du simple au complexe

Un Skill basique commence par un seul fichier SKILL.md contenant les métadonnées et les instructions :

![Fichier SKILL.md simple montrant le frontmatter YAML et le corps markdown](/docs/images/agent-skills-simple-file.png)

À mesure que votre Skill grandit, vous pouvez regrouper du contenu supplémentaire que Claude charge uniquement si nécessaire :

![Regroupement de fichiers de référence supplémentaires comme reference.md et forms.md.](/docs/images/agent-skills-bundling-content.png)

La structure complète du répertoire du Skill pourrait ressembler à ceci :

```
pdf/
├── SKILL.md              # Instructions principales (chargées lorsque déclenchées)
├── FORMS.md              # Guide de remplissage de formulaires (chargé selon les besoins)
├── reference.md          # Référence API (chargée selon les besoins)
├── examples.md           # Exemples d'utilisation (chargés selon les besoins)
└── scripts/
    ├── analyze_form.py   # Script utilitaire (exécuté, non chargé)
    ├── fill_form.py      # Script de remplissage de formulaires
    └── validate.py       # Script de validation
```

#### Modèle 1 : Guide de haut niveau avec références

````markdown
---
name: pdf-processing
description: Extrait le texte et les tableaux des fichiers PDF, remplit les formulaires et fusionne les documents. À utiliser lors du travail avec des fichiers PDF ou lorsque l'utilisateur mentionne les PDF, les formulaires ou l'extraction de documents.
---

# Traitement PDF

## Démarrage rapide

Extrayez le texte avec pdfplumber :
```python
import pdfplumber
with pdfplumber.open("file.pdf") as pdf:
    text = pdf.pages[0].extract_text()
```

## Fonctionnalités avancées

**Remplissage de formulaires** : Consultez [FORMS.md](FORMS.md) pour le guide complet
**Référence API** : Consultez [REFERENCE.md](REFERENCE.md) pour toutes les méthodes
**Exemples** : Consultez [EXAMPLES.md](EXAMPLES.md) pour les modèles courants
````

Claude charge FORMS.md, REFERENCE.md ou EXAMPLES.md uniquement si nécessaire.

#### Modèle 2 : Organisation spécifique au domaine

Pour les Skills avec plusieurs domaines, organisez le contenu par domaine pour éviter de charger un contexte non pertinent. Lorsqu'un utilisateur demande des métriques de ventes, Claude n'a besoin de lire que les schémas liés aux ventes, pas les données financières ou marketing. Cela maintient l'utilisation des tokens faible et le contexte concentré.

```
bigquery-skill/
├── SKILL.md (aperçu et navigation)
└── reference/
    ├── finance.md (revenus, métriques de facturation)
    ├── sales.md (opportunités, pipeline)
    ├── product.md (utilisation API, fonctionnalités)
    └── marketing.md (campagnes, attribution)
```

````markdown SKILL.md
# Analyse de données BigQuery

## Ensembles de données disponibles

**Finance** : Revenus, ARR, facturation → Consultez [reference/finance.md](reference/finance.md)
**Ventes** : Opportunités, pipeline, comptes → Consultez [reference/sales.md](reference/sales.md)
**Produit** : Utilisation API, fonctionnalités, adoption → Consultez [reference/product.md](reference/product.md)
**Marketing** : Campagnes, attribution, email → Consultez [reference/marketing.md](reference/marketing.md)

## Recherche rapide

Trouvez des métriques spécifiques en utilisant grep :

```bash
grep -i "revenue" reference/finance.md
grep -i "pipeline" reference/sales.md
grep -i "api usage" reference/product.md
```
````

#### Modèle 3 : Détails conditionnels

Montrez le contenu de base, liez au contenu avancé :

```markdown
# Traitement DOCX

## Créer des documents

Utilisez docx-js pour les nouveaux documents. Consultez [DOCX-JS.md](DOCX-JS.md).

## Éditer des documents

Pour les modifications simples, modifiez directement le XML.

**Pour les modifications suivies** : Consultez [REDLINING.md](REDLINING.md)
**Pour les détails OOXML** : Consultez [OOXML.md](OOXML.md)
```

Claude lit REDLINING.md ou OOXML.md uniquement lorsque l'utilisateur a besoin de ces fonctionnalités.

### Éviter les références profondément imbriquées

Claude peut lire partiellement les fichiers lorsqu'ils sont référencés à partir d'autres fichiers référencés. Lorsqu'il rencontre des références imbriquées, Claude pourrait utiliser des commandes comme `head -100` pour prévisualiser le contenu plutôt que de lire des fichiers entiers, ce qui entraîne des informations incomplètes.

**Gardez les références à un niveau de profondeur à partir de SKILL.md**. Tous les fichiers de référence doivent être liés directement à partir de SKILL.md pour assurer que Claude lit les fichiers complets si nécessaire.

**Mauvais exemple : Trop profond** :
```markdown
# SKILL.md
Consultez [advanced.md](advanced.md)...

# advanced.md
Consultez [details.md](details.md)...

# details.md
Voici l'information réelle...
```

**Bon exemple : Un niveau de profondeur** :
```markdown
# SKILL.md

**Utilisation de base** : [instructions dans SKILL.md]
**Fonctionnalités avancées** : Consultez [advanced.md](advanced.md)
**Référence API** : Consultez [reference.md](reference.md)
**Exemples** : Consultez [examples.md](examples.md)
```

### Structurer les fichiers de référence plus longs avec une table des matières

Pour les fichiers de référence de plus de 100 lignes, incluez une table des matières en haut. Cela assure que Claude peut voir l'étendue complète des informations disponibles même lors de la prévisualisation avec des lectures partielles.

**Exemple** :
```markdown
# Référence API

## Contenu
- Authentification et configuration
- Méthodes principales (créer, lire, mettre à jour, supprimer)
- Fonctionnalités avancées (opérations par lot, webhooks)
- Modèles de gestion des erreurs
- Exemples de code

## Authentification et configuration
...

## Méthodes principales
...
```

Claude peut alors lire le fichier complet ou accéder à des sections spécifiques selon les besoins.

Pour plus de détails sur la façon dont cette architecture basée sur le système de fichiers permet la divulgation progressive, consultez la section [Environnement d'exécution](#runtime-environment) dans la section Avancé ci-dessous.

## Flux de travail et boucles de rétroaction

### Utiliser les flux de travail pour les tâches complexes

Divisez les opérations complexes en étapes claires et séquentielles. Pour les flux de travail particulièrement complexes, fournissez une liste de contrôle que Claude peut copier dans sa réponse et cocher au fur et à mesure de sa progression.

**Exemple 1 : Flux de travail de synthèse de recherche** (pour les Skills sans code) :

````markdown
## Flux de travail de synthèse de recherche

Copiez cette liste de contrôle et suivez votre progression :

```
Progression de la recherche :
- [ ] Étape 1 : Lire tous les documents sources
- [ ] Étape 2 : Identifier les thèmes clés
- [ ] Étape 3 : Recouper les affirmations
- [ ] Étape 4 : Créer un résumé structuré
- [ ] Étape 5 : Vérifier les citations
```

**Étape 1 : Lire tous les documents sources**

Examinez chaque document du répertoire `sources/`. Notez les arguments principaux et les preuves à l'appui.

**Étape 2 : Identifier les thèmes clés**

Recherchez des modèles dans les sources. Quels thèmes apparaissent à plusieurs reprises ? Où les sources sont-elles d'accord ou en désaccord ?

**Étape 3 : Recouper les affirmations**

Pour chaque affirmation majeure, vérifiez qu'elle apparaît dans le matériel source. Notez quelle source soutient chaque point.

**Étape 4 : Créer un résumé structuré**

Organisez les résultats par thème. Incluez :
- Affirmation principale
- Preuves à l'appui des sources
- Points de vue conflictuels (le cas échéant)

**Étape 5 : Vérifier les citations**

Vérifiez que chaque affirmation référence le document source correct. Si les citations sont incomplètes, retournez à l'étape 3.
````

Cet exemple montre comment les flux de travail s'appliquent aux tâches d'analyse qui ne nécessitent pas de code. Le modèle de liste de contrôle fonctionne pour tout processus complexe et multi-étapes.

**Exemple 2 : Flux de travail de remplissage de formulaire PDF** (pour les Skills avec code) :

````markdown
## Flux de travail de remplissage de formulaire PDF

Copiez cette liste de contrôle et cochez les éléments au fur et à mesure que vous les complétez :

```
Progression de la tâche :
- [ ] Étape 1 : Analyser le formulaire (exécuter analyze_form.py)
- [ ] Étape 2 : Créer un mappage de champs (éditer fields.json)
- [ ] Étape 3 : Valider le mappage (exécuter validate_fields.py)
- [ ] Étape 4 : Remplir le formulaire (exécuter fill_form.py)
- [ ] Étape 5 : Vérifier la sortie (exécuter verify_output.py)
```

**Étape 1 : Analyser le formulaire**

Exécutez : `python scripts/analyze_form.py input.pdf`

Cela extrait les champs du formulaire et leurs emplacements, en les enregistrant dans `fields.json`.

**Étape 2 : Créer un mappage de champs**

Éditez `fields.json` pour ajouter des valeurs pour chaque champ.

**Étape 3 : Valider le mappage**

Exécutez : `python scripts/validate_fields.py fields.json`

Corrigez les erreurs de validation avant de continuer.

**Étape 4 : Remplir le formulaire**

Exécutez : `python scripts/fill_form.py input.pdf fields.json output.pdf`

**Étape 5 : Vérifier la sortie**

Exécutez : `python scripts/verify_output.py output.pdf`

Si la vérification échoue, retournez à l'étape 2.
````

Des étapes claires empêchent Claude de sauter la validation critique. La liste de contrôle aide à la fois Claude et vous à suivre la progression à travers les flux de travail multi-étapes.

### Implémenter des boucles de rétroaction

**Modèle courant** : Exécuter le validateur → corriger les erreurs → répéter

Ce modèle améliore considérablement la qualité de la sortie.

**Exemple 1 : Conformité au guide de style** (pour les Skills sans code) :

```markdown
## Processus d'examen du contenu

1. Rédigez votre contenu en suivant les directives du STYLE_GUIDE.md
2. Examinez par rapport à la liste de contrôle :
   - Vérifier la cohérence de la terminologie
   - Vérifier que les exemples suivent le format standard
   - Confirmer que toutes les sections requises sont présentes
3. Si des problèmes sont trouvés :
   - Notez chaque problème avec une référence de section spécifique
   - Révisez le contenu
   - Examinez à nouveau la liste de contrôle
4. Procédez uniquement lorsque toutes les exigences sont satisfaites
5. Finalisez et enregistrez le document
```

Cela montre le modèle de boucle de validation utilisant des documents de référence au lieu de scripts. Le « validateur » est STYLE_GUIDE.md, et Claude effectue la vérification en lisant et en comparant.

**Exemple 2 : Processus d'édition de document** (pour les Skills avec code) :

```markdown
## Processus d'édition de document

1. Effectuez vos modifications dans `word/document.xml`
2. **Validez immédiatement** : `python ooxml/scripts/validate.py unpacked_dir/`
3. Si la validation échoue :
   - Examinez attentivement le message d'erreur
   - Corrigez les problèmes dans le XML
   - Exécutez à nouveau la validation
4. **Procédez uniquement lorsque la validation réussit**
5. Reconstruisez : `python ooxml/scripts/pack.py unpacked_dir/ output.docx`
6. Testez le document de sortie
```

La boucle de validation détecte les erreurs tôt.

## Directives de contenu

### Éviter les informations sensibles au temps

N'incluez pas d'informations qui deviendront obsolètes :

**Mauvais exemple : Sensible au temps** (deviendra incorrect) :
```markdown
Si vous faites cela avant août 2025, utilisez l'ancienne API.
Après août 2025, utilisez la nouvelle API.
```

**Bon exemple** (utiliser la section « anciens modèles ») :
```markdown
## Méthode actuelle

Utilisez le point de terminaison de l'API v2 : `api.example.com/v2/messages`

## Anciens modèles

<details>
<summary>API v1 héritée (dépréciée 2025-08)</summary>

L'API v1 utilisait : `api.example.com/v1/messages`

Ce point de terminaison n'est plus pris en charge.
</details>
```

La section des anciens modèles fournit un contexte historique sans encombrer le contenu principal.

### Utiliser une terminologie cohérente

Choisissez un terme et utilisez-le dans tout le Skill :

**Bon - Cohérent** :
- Toujours « point de terminaison API »
- Toujours « champ »
- Toujours « extraire »

**Mauvais - Incohérent** :
- Mélanger « point de terminaison API », « URL », « route API », « chemin »
- Mélanger « champ », « boîte », « élément », « contrôle »
- Mélanger « extraire », « tirer », « obtenir », « récupérer »

La cohérence aide Claude à comprendre et à suivre les instructions.

## Modèles courants

### Modèle de modèle

Fournissez des modèles pour le format de sortie. Adaptez le niveau de rigueur à vos besoins.

**Pour les exigences strictes** (comme les réponses API ou les formats de données) :

````markdown
## Structure du rapport

UTILISEZ TOUJOURS cette structure de modèle exacte :

```markdown
# [Titre de l'analyse]

## Résumé exécutif
[Aperçu d'une phrase des résultats clés]

## Résultats clés
- Résultat 1 avec données de soutien
- Résultat 2 avec données de soutien
- Résultat 3 avec données de soutien

## Recommandations
1. Recommandation spécifique et exploitable
2. Recommandation spécifique et exploitable
```
````

**Pour les conseils flexibles** (lorsque l'adaptation est utile) :

````markdown
## Structure du rapport

Voici un format par défaut sensé, mais utilisez votre meilleur jugement en fonction de l'analyse :

```markdown
# [Titre de l'analyse]

## Résumé exécutif
[Aperçu]

## Résultats clés
[Adaptez les sections en fonction de ce que vous découvrez]

## Recommandations
[Adaptez au contexte spécifique]
```

Ajustez les sections selon les besoins pour le type d'analyse spécifique.
````

### Modèle d'exemples

Pour les Skills où la qualité de la sortie dépend de la visualisation d'exemples, fournissez des paires entrée/sortie tout comme dans les invites régulières :

````markdown
## Format du message de validation

Générez des messages de validation en suivant ces exemples :

**Exemple 1 :**
Entrée : Ajout de l'authentification utilisateur avec des jetons JWT
Sortie :
```
feat(auth): implement JWT-based authentication

Add login endpoint and token validation middleware
```

**Exemple 2 :**
Entrée : Correction d'un bug où les dates s'affichaient incorrectement dans les rapports
Sortie :
```
fix(reports): correct date formatting in timezone conversion

Use UTC timestamps consistently across report generation
```

**Exemple 3 :**
Entrée : Mise à jour des dépendances et refactorisation de la gestion des erreurs
Sortie :
```
chore: update dependencies and refactor error handling

- Upgrade lodash to 4.17.21
- Standardize error response format across endpoints
```

Suivez ce style : type(scope): description brève, puis explication détaillée.
````

Les exemples aident Claude à comprendre le style et le niveau de détail souhaités plus clairement que les descriptions seules.

### Modèle de flux de travail conditionnel

Guidez Claude à travers les points de décision :

```markdown
## Flux de travail de modification de document

1. Déterminez le type de modification :

   **Créer du nouveau contenu ?** → Suivez le « Flux de travail de création » ci-dessous
   **Éditer du contenu existant ?** → Suivez le « Flux de travail d'édition » ci-dessous

2. Flux de travail de création :
   - Utilisez la bibliothèque docx-js
   - Construisez le document à partir de zéro
   - Exportez au format .docx

3. Flux de travail d'édition :
   - Décompressez le document existant
   - Modifiez directement le XML
   - Validez après chaque modification
   - Recompressez une fois terminé
```

<Tip>
Si les flux de travail deviennent volumineux ou compliqués avec de nombreuses étapes, envisagez de les placer dans des fichiers séparés et dites à Claude de lire le fichier approprié en fonction de la tâche à accomplir.
</Tip>

## Évaluation et itération

### Construire les évaluations en premier

**Créez les évaluations AVANT de rédiger une documentation extensive.** Cela assure que votre Skill résout des problèmes réels plutôt que de documenter des problèmes imaginaires.

**Développement piloté par l'évaluation :**
1. **Identifier les lacunes** : Exécutez Claude sur des tâches représentatives sans Skill. Documentez les défaillances spécifiques ou le contexte manquant
2. **Créer des évaluations** : Construisez trois scénarios qui testent ces lacunes
3. **Établir une ligne de base** : Mesurez les performances de Claude sans le Skill
4. **Rédiger des instructions minimales** : Créez juste assez de contenu pour combler les lacunes et réussir les évaluations
5. **Itérer** : Exécutez les évaluations, comparez par rapport à la ligne de base et affinez

Cette approche assure que vous résolvez des problèmes réels plutôt que d'anticiper des exigences qui ne se matérialiseront peut-être jamais.

**Structure d'évaluation** :
```json
{
  "skills": ["pdf-processing"],
  "query": "Extrayez tout le texte de ce fichier PDF et enregistrez-le dans output.txt",
  "files": ["test-files/document.pdf"],
  "expected_behavior": [
    "Lit avec succès le fichier PDF en utilisant une bibliothèque appropriée de traitement PDF ou un outil de ligne de commande",
    "Extrait le contenu textuel de toutes les pages du document sans manquer aucune page",
    "Enregistre le texte extrait dans un fichier nommé output.txt dans un format clair et lisible"
  ]
}
```

<Note>
Cet exemple démontre une évaluation pilotée par les données avec une rubrique de test simple. Nous ne fournissons actuellement pas de moyen intégré d'exécuter ces évaluations. Les utilisateurs peuvent créer leur propre système d'évaluation. Les évaluations sont votre source de vérité pour mesurer l'efficacité du Skill.
</Note>

### Développer les Skills de manière itérative avec Claude

Le processus de développement de Skill le plus efficace implique Claude lui-même. Travaillez avec une instance de Claude (« Claude A ») pour créer un Skill qui sera utilisé par d'autres instances (« Claude B »). Claude A vous aide à concevoir et affiner les instructions, tandis que Claude B les teste dans des tâches réelles. Cela fonctionne parce que les modèles Claude comprennent à la fois comment rédiger des instructions d'agent efficaces et quelles informations les agents ont besoin.

**Créer un nouveau Skill :**

1. **Complétez une tâche sans Skill** : Travaillez sur un problème avec Claude A en utilisant des invites normales. Au fur et à mesure, vous fournirez naturellement du contexte, expliquerez les préférences et partagerez des connaissances procédurales. Remarquez quelles informations vous fournissez à plusieurs reprises.

2. **Identifiez le modèle réutilisable** : Après avoir complété la tâche, identifiez le contexte que vous avez fourni qui serait utile pour des tâches futures similaires.

   **Exemple** : Si vous avez travaillé sur une analyse BigQuery, vous auriez pu fournir les noms de tables, les définitions de champs, les règles de filtrage (comme « toujours exclure les comptes de test ») et les modèles de requête courants.

3. **Demandez à Claude A de créer un Skill** : « Créez un Skill qui capture ce modèle d'analyse BigQuery que nous venons d'utiliser. Incluez les schémas de table, les conventions de nommage et la règle concernant le filtrage des comptes de test. »

   <Tip>
   Les modèles Claude comprennent le format et la structure du Skill de manière native. Vous n'avez pas besoin d'invites système spéciales ou d'un « skill de rédaction de skills » pour que Claude crée des Skills. Demandez simplement à Claude de créer un Skill et il générera un contenu SKILL.md correctement structuré avec un frontmatter et un contenu appropriés.
   </Tip>

4. **Examinez la concision** : Vérifiez que Claude A n'a pas ajouté d'explications inutiles. Demandez : « Supprimez l'explication sur ce que signifie le taux de victoire - Claude le sait déjà. »

5. **Améliorez l'architecture de l'information** : Demandez à Claude A d'organiser le contenu plus efficacement. Par exemple : « Organisez ceci pour que le schéma de table soit dans un fichier de référence séparé. Nous pourrions ajouter plus de tables plus tard. »

6. **Testez sur des tâches similaires** : Utilisez le Skill avec Claude B (une nouvelle instance avec le Skill chargé) sur des cas d'utilisation connexes. Observez si Claude B trouve les bonnes informations, applique les règles correctement et gère la tâche avec succès.

7. **Itérez en fonction de l'observation** : Si Claude B a du mal ou omet quelque chose, retournez à Claude A avec des détails : « Lorsque Claude a utilisé ce Skill, il a oublié de filtrer par date pour le Q4. Devrions-nous ajouter une section sur les modèles de filtrage par date ? »

**Itérer sur les Skills existants :**

Le même modèle hiérarchique continue lors de l'amélioration des Skills. Vous alternez entre :
- **Travailler avec Claude A** (l'expert qui aide à affiner le Skill)
- **Tester avec Claude B** (l'agent utilisant le Skill pour effectuer un travail réel)
- **Observer le comportement de Claude B** et apporter des insights à Claude A

1. **Utilisez le Skill dans les flux de travail réels** : Donnez à Claude B (avec le Skill chargé) des tâches réelles, pas des scénarios de test

2. **Observez le comportement de Claude B** : Notez où il a du mal, réussit ou fait des choix inattendus

   **Exemple d'observation** : « Lorsque j'ai demandé à Claude B un rapport de ventes régional, il a écrit la requête mais a oublié de filtrer les comptes de test, même si le Skill mentionne cette règle. »

3. **Retournez à Claude A pour les améliorations** : Partagez le SKILL.md actuel et décrivez ce que vous avez observé. Demandez : « J'ai remarqué que Claude B a oublié de filtrer les comptes de test lorsque j'ai demandé un rapport régional. Le Skill mentionne le filtrage, mais peut-être que ce n'est pas assez en évidence ? »

4. **Examinez les suggestions de Claude A** : Claude A pourrait suggérer de réorganiser pour rendre les règles plus évidentes, d'utiliser un langage plus fort comme « DOIT filtrer » au lieu de « toujours filtrer », ou de restructurer la section du flux de travail.

5. **Appliquez et testez les modifications** : Mettez à jour le Skill avec les raffinements de Claude A, puis testez à nouveau avec Claude B sur des demandes similaires

6. **Répétez en fonction de l'utilisation** : Continuez ce cycle d'observation-raffinement-test à mesure que vous rencontrez de nouveaux scénarios. Chaque itération améliore le Skill en fonction du comportement réel de l'agent, pas des hypothèses.

**Recueillir les commentaires de l'équipe :**

1. Partagez les Skills avec les coéquipiers et observez leur utilisation
2. Demandez : Le Skill s'active-t-il comme prévu ? Les instructions sont-elles claires ? Qu'est-ce qui manque ?
3. Incorporez les commentaires pour résoudre les points aveugles dans vos propres modèles d'utilisation

**Pourquoi cette approche fonctionne** : Claude A comprend les besoins des agents, vous fournissez l'expertise du domaine, Claude B révèle les lacunes par l'utilisation réelle, et l'affinement itératif améliore les Skills en fonction du comportement observé plutôt que des hypothèses.

### Observez comment Claude navigue dans les Skills

À mesure que vous itérez sur les Skills, prêtez attention à la façon dont Claude les utilise réellement en pratique. Observez :

- **Chemins d'exploration inattendus** : Claude lit-il les fichiers dans un ordre que vous n'aviez pas anticipé ? Cela pourrait indiquer que votre structure n'est pas aussi intuitive que vous le pensiez
- **Connexions manquées** : Claude échoue-t-il à suivre les références vers des fichiers importants ? Vos liens pourraient avoir besoin d'être plus explicites ou en évidence
- **Surreliance sur certaines sections** : Si Claude lit à plusieurs reprises le même fichier, envisagez si ce contenu devrait être dans le SKILL.md principal à la place
- **Contenu ignoré** : Si Claude n'accède jamais à un fichier regroupé, il pourrait être inutile ou mal signalé dans les instructions principales

Itérez en fonction de ces observations plutôt que des hypothèses. Le « name » et la « description » dans les métadonnées de votre Skill sont particulièrement critiques. Claude les utilise pour décider s'il faut déclencher le Skill en réponse à la tâche actuelle. Assurez-vous qu'ils décrivent clairement ce que fait le Skill et quand il doit être utilisé.

## Anti-modèles à éviter

### Éviter les chemins de style Windows

Utilisez toujours des barres obliques dans les chemins de fichiers, même sous Windows :

- ✓ **Bon** : `scripts/helper.py`, `reference/guide.md`
- ✗ **À éviter** : `scripts\helper.py`, `reference\guide.md`

Les chemins de style Unix fonctionnent sur toutes les plates-formes, tandis que les chemins de style Windows causent des erreurs sur les systèmes Unix.

### Éviter d'offrir trop d'options

Ne présentez plusieurs approches que si nécessaire :

````markdown
**Mauvais exemple : Trop de choix** (confus) :
« Vous pouvez utiliser pypdf, ou pdfplumber, ou PyMuPDF, ou pdf2image, ou... »

**Bon exemple : Fournir une valeur par défaut** (avec échappatoire) :
« Utilisez pdfplumber pour l'extraction de texte :
```python
import pdfplumber
```

Pour les PDF numérisés nécessitant l'OCR, utilisez pdf2image avec pytesseract à la place. »
````

## Avancé : Skills avec code exécutable

Les sections ci-dessous se concentrent sur les Skills qui incluent des scripts exécutables. Si votre Skill utilise uniquement des instructions markdown, passez à [Liste de contrôle pour les Skills efficaces](#checklist-for-effective-skills).

### Résoudre, ne pas esquiver

Lors de la rédaction de scripts pour les Skills, gérez les conditions d'erreur plutôt que de les esquiver vers Claude.

**Bon exemple : Gérer les erreurs explicitement** :
```python
def process_file(path):
    """Traiter un fichier, le créer s'il n'existe pas."""
    try:
        with open(path) as f:
            return f.read()
    except FileNotFoundError:
        # Créer le fichier avec le contenu par défaut au lieu d'échouer
        print(f"Fichier {path} non trouvé, création par défaut")
        with open(path, 'w') as f:
            f.write('')
        return ''
    except PermissionError:
        # Fournir une alternative au lieu d'échouer
        print(f"Impossible d'accéder à {path}, utilisation de la valeur par défaut")
        return ''
```

**Mauvais exemple : Esquiver vers Claude** :
```python
def process_file(path):
    # Échouer simplement et laisser Claude comprendre
    return open(path).read()
```

Les paramètres de configuration doivent également être justifiés et documentés pour éviter les « constantes vaudou » (loi d'Ousterhout). Si vous ne connaissez pas la bonne valeur, comment Claude la déterminera-t-il ?

**Bon exemple : Auto-documenté** :
```python
# Les requêtes HTTP se terminent généralement en 30 secondes
# Un délai d'expiration plus long tient compte des connexions lentes
REQUEST_TIMEOUT = 30

# Trois tentatives équilibrent la fiabilité et la vitesse
# La plupart des défaillances intermittentes se résolvent à la deuxième tentative
MAX_RETRIES = 3
```

**Mauvais exemple : Nombres magiques** :
```python
TIMEOUT = 47  # Pourquoi 47 ?
RETRIES = 5   # Pourquoi 5 ?
```

### Fournir des scripts utilitaires

Même si Claude pourrait écrire un script, les scripts pré-faits offrent des avantages :

**Avantages des scripts utilitaires** :
- Plus fiables que le code généré
- Économiser les tokens (pas besoin d'inclure le code dans le contexte)
- Économiser du temps (pas de génération de code requise)
- Assurer la cohérence entre les utilisations

![Regroupement de scripts exécutables aux côtés des fichiers d'instructions](/docs/images/agent-skills-executable-scripts.png)

Le diagramme ci-dessus montre comment les scripts exécutables fonctionnent aux côtés des fichiers d'instructions. Le fichier d'instructions (forms.md) référence le script, et Claude peut l'exécuter sans charger son contenu dans le contexte.

**Distinction importante** : Clarifiez dans vos instructions si Claude doit :
- **Exécuter le script** (plus courant) : « Exécutez `analyze_form.py` pour extraire les champs »
- **Le lire comme référence** (pour la logique complexe) : « Consultez `analyze_form.py` pour l'algorithme d'extraction de champs »

Pour la plupart des scripts utilitaires, l'exécution est préférable car elle est plus fiable et efficace. Consultez la section [Environnement d'exécution](#runtime-environment) ci-dessous pour plus de détails sur le fonctionnement de l'exécution de scripts.

**Exemple** :
````markdown
## Scripts utilitaires

**analyze_form.py** : Extraire tous les champs du formulaire du PDF

```bash
python scripts/analyze_form.py input.pdf > fields.json
```

Format de sortie :
```json
{
  "field_name": {"type": "text", "x": 100, "y": 200},
  "signature": {"type": "sig", "x": 150, "y": 500}
}
```

**validate_boxes.py** : Vérifier les boîtes de délimitation qui se chevauchent

```bash
python scripts/validate_boxes.py fields.json
# Retourne : « OK » ou liste les conflits
```

**fill_form.py** : Appliquer les valeurs de champ au PDF

```bash
python scripts/fill_form.py input.pdf fields.json output.pdf
```
````

### Utiliser l'analyse visuelle

Lorsque les entrées peuvent être rendues sous forme d'images, demandez à Claude de les analyser :

````markdown
## Analyse de la disposition du formulaire

1. Convertir le PDF en images :
   ```bash
   python scripts/pdf_to_images.py form.pdf
   ```

2. Analyser chaque image de page pour identifier les champs du formulaire
3. Claude peut voir les emplacements et les types de champs visuellement
````

<Note>
Dans cet exemple, vous devriez écrire le script `pdf_to_images.py`.
</Note>

Les capacités de vision de Claude aident à comprendre les mises en page et les structures.

### Créer des sorties intermédiaires vérifiables

Lorsque Claude effectue des tâches complexes et ouvertes, il peut faire des erreurs. Le modèle « plan-valider-exécuter » détecte les erreurs tôt en demandant à Claude de d'abord créer un plan dans un format structuré, puis de valider ce plan avec un script avant de l'exécuter.

**Exemple** : Imaginez demander à Claude de mettre à jour 50 champs de formulaire dans un PDF en fonction d'une feuille de calcul. Sans validation, Claude pourrait référencer des champs inexistants, créer des valeurs conflictuelles, manquer les champs requis ou appliquer les mises à jour incorrectement.

**Solution** : Utilisez le modèle de flux de travail montré ci-dessus (remplissage de formulaire PDF), mais ajoutez un fichier intermédiaire `changes.json` qui est validé avant d'appliquer les modifications. Le flux de travail devient : analyser → **créer un fichier de plan** → **valider le plan** → exécuter → vérifier.

**Pourquoi ce modèle fonctionne :**
- **Détecte les erreurs tôt** : La validation trouve les problèmes avant que les modifications ne soient appliquées
- **Vérifiable par machine** : Les scripts fournissent une vérification objective
- **Planification réversible** : Claude peut itérer sur le plan sans toucher aux originaux
- **Débogage clair** : Les messages d'erreur pointent vers des problèmes spécifiques

**Quand l'utiliser** : Opérations par lot, modifications destructrices, règles de validation complexes, opérations à enjeux élevés.

**Conseil d'implémentation** : Rendez les scripts de validation verbeux avec des messages d'erreur spécifiques comme « Le champ 'signature_date' n'a pas été trouvé. Champs disponibles : customer_name, order_total, signature_date_signed » pour aider Claude à corriger les problèmes.

### Dépendances de package

Les Skills s'exécutent dans l'environnement d'exécution du code avec des limitations spécifiques à la plate-forme :

- **claude.ai** : Peut installer des packages à partir de npm et PyPI et extraire des référentiels GitHub
- **API Anthropic** : N'a pas d'accès réseau et pas d'installation de package d'exécution

Listez les packages requis dans votre SKILL.md et vérifiez qu'ils sont disponibles dans la [documentation de l'outil d'exécution du code](/docs/fr/agents-and-tools/tool-use/code-execution-tool).

### Environnement d'exécution

Les Skills s'exécutent dans un environnement d'exécution du code avec accès au système de fichiers, commandes bash et capacités d'exécution du code. Pour l'explication conceptuelle de cette architecture, consultez [L'architecture des Skills](/docs/fr/agents-and-tools/agent-skills/overview#the-skills-architecture) dans la présentation.

**Comment cela affecte votre rédaction :**

**Comment Claude accède aux Skills :**

1. **Métadonnées pré-chargées** : Au démarrage, le nom et la description du frontmatter YAML de tous les Skills sont chargés dans l'invite système
2. **Fichiers lus à la demande** : Claude utilise les outils de lecture bash pour accéder à SKILL.md et à d'autres fichiers du système de fichiers si nécessaire
3. **Scripts exécutés efficacement** : Les scripts utilitaires peuvent être exécutés via bash sans charger leur contenu complet dans le contexte. Seule la sortie du script consomme des tokens
4. **Pas de pénalité de contexte pour les fichiers volumineux** : Les fichiers de référence, les données ou la documentation ne consomment pas de tokens de contexte jusqu'à ce qu'ils soient réellement lus

- **Les chemins de fichiers sont importants** : Claude navigue dans votre répertoire de skills comme un système de fichiers. Utilisez des barres obliques (`reference/guide.md`), pas des barres obliques inverses
- **Nommez les fichiers de manière descriptive** : Utilisez des noms qui indiquent le contenu : `form_validation_rules.md`, pas `doc2.md`
- **Organisez pour la découverte** : Structurez les répertoires par domaine ou fonctionnalité
  - Bon : `reference/finance.md`, `reference/sales.md`
  - Mauvais : `docs/file1.md`, `docs/file2.md`
- **Regroupez les ressources complètes** : Incluez la documentation API complète, des exemples étendus, de grands ensembles de données ; pas de pénalité de contexte jusqu'à l'accès
- **Préférez les scripts pour les opérations déterministes** : Écrivez `validate_form.py` plutôt que de demander à Claude de générer du code de validation
- **Clarifiez l'intention d'exécution** :
  - « Exécutez `analyze_form.py` pour extraire les champs » (exécuter)
  - « Consultez `analyze_form.py` pour l'algorithme d'extraction » (lire comme référence)
- **Testez les modèles d'accès aux fichiers** : Vérifiez que Claude peut naviguer dans votre structure de répertoire en testant avec des demandes réelles

**Exemple :**

```
bigquery-skill/
├── SKILL.md (aperçu, pointe vers les fichiers de référence)
└── reference/
    ├── finance.md (métriques de revenus)
    ├── sales.md (données de pipeline)
    └── product.md (analyse d'utilisation)
```

Lorsque l'utilisateur demande des revenus, Claude lit SKILL.md, voit la référence à `reference/finance.md`, et invoque bash pour lire uniquement ce fichier. Les fichiers sales.md et product.md restent sur le système de fichiers, consommant zéro tokens de contexte jusqu'à ce qu'ils soient nécessaires. Ce modèle basé sur le système de fichiers est ce qui permet la divulgation progressive. Claude peut naviguer et charger sélectivement exactement ce que chaque tâche nécessite.

Pour les détails techniques complets sur l'architecture, consultez [Comment fonctionnent les Skills](/docs/fr/agents-and-tools/agent-skills/overview#how-skills-work) dans la présentation des Skills.

### Références d'outils MCP

Si votre Skill utilise des outils MCP (Model Context Protocol), utilisez toujours les noms d'outils complètement qualifiés pour éviter les erreurs « outil non trouvé ».

**Format** : `ServerName:tool_name`

**Exemple** :
```markdown
Utilisez l'outil BigQuery:bigquery_schema pour récupérer les schémas de table.
Utilisez l'outil GitHub:create_issue pour créer des problèmes.
```

Où :
- `BigQuery` et `GitHub` sont les noms des serveurs MCP
- `bigquery_schema` et `create_issue` sont les noms des outils dans ces serveurs

Sans le préfixe du serveur, Claude peut échouer à localiser l'outil, surtout lorsque plusieurs serveurs MCP sont disponibles.

### Éviter de supposer que les outils sont installés

Ne supposez pas que les packages sont disponibles :

````markdown
**Mauvais exemple : Suppose l'installation** :
« Utilisez la bibliothèque pdf pour traiter le fichier. »

**Bon exemple : Explicite sur les dépendances** :
« Installez le package requis : `pip install pypdf`

Ensuite, utilisez-le :
```python
from pypdf import PdfReader
reader = PdfReader("file.pdf")
```"
````

## Notes techniques

### Exigences du frontmatter YAML

Le frontmatter SKILL.md nécessite les champs `name` et `description` avec des règles de validation spécifiques :
- `name` : Maximum 64 caractères, lettres minuscules/chiffres/tirets uniquement, pas de balises XML, pas de mots réservés
- `description` : Maximum 1024 caractères, non vide, pas de balises XML

Consultez la [présentation des Skills](/docs/fr/agents-and-tools/agent-skills/overview#skill-structure) pour les détails complets de la structure.

### Budgets de tokens

Gardez le corps de SKILL.md sous 500 lignes pour des performances optimales. Si votre contenu dépasse cela, divisez-le en fichiers séparés en utilisant les modèles de divulgation progressive décrits précédemment. Pour les détails architecturaux, consultez la [présentation des Skills](/docs/fr/agents-and-tools/agent-skills/overview#how-skills-work).

## Liste de contrôle pour les Skills efficaces

Avant de partager un Skill, vérifiez :

### Qualité de base
- [ ] La description est spécifique et inclut les termes clés
- [ ] La description inclut à la fois ce que fait le Skill et quand l'utiliser
- [ ] Le corps de SKILL.md est sous 500 lignes
- [ ] Les détails supplémentaires sont dans des fichiers séparés (si nécessaire)
- [ ] Pas d'informations sensibles au temps (ou dans la section « anciens modèles »)
- [ ] Terminologie cohérente dans tout le document
- [ ] Les exemples sont concrets, pas abstraits
- [ ] Les références de fichiers sont à un niveau de profondeur
- [ ] La divulgation progressive est utilisée de manière appropriée
- [ ] Les flux de travail ont des étapes claires

### Code et scripts
- [ ] Les scripts résolvent les problèmes plutôt que de les esquiver vers Claude
- [ ] La gestion des erreurs est explicite et utile
- [ ] Pas de « constantes vaudou » (toutes les valeurs justifiées)
- [ ] Les packages requis sont listés dans les instructions et vérifiés comme disponibles
- [ ] Les scripts ont une documentation claire
- [ ] Pas de chemins de style Windows (toutes les barres obliques)
- [ ] Les étapes de validation/vérification pour les opérations critiques
- [ ] Les boucles de rétroaction incluses pour les tâches critiques pour la qualité

### Test
- [ ] Au moins trois évaluations créées
- [ ] Testé avec Haiku, Sonnet et Opus
- [ ] Testé avec des scénarios d'utilisation réels
- [ ] Les commentaires de l'équipe incorporés (le cas échéant)

## Prochaines étapes

<CardGroup cols={2}>
  <Card
    title="Commencer avec les Agent Skills"
    icon="rocket"
    href="/docs/fr/agents-and-tools/agent-skills/quickstart"
  >
    Créez votre premier Skill
  </Card>
  <Card
    title="Utiliser les Skills dans Claude Code"
    icon="terminal"
    href="https://code.claude.com/docs/skills"
  >
    Créer et gérer les Skills dans Claude Code
  </Card>
  <Card
    title="Utiliser les Skills dans l'Agent SDK"
    icon="cube"
    href="/docs/fr/agent-sdk/skills"
  >
    Utiliser les Skills de manière programmatique en TypeScript et Python
  </Card>
  <Card
    title="Utiliser les Skills avec l'API"
    icon="code"
    href="/docs/fr/build-with-claude/skills-guide"
  >
    Télécharger et utiliser les Skills de manière programmatique
  </Card>
</CardGroup>