# Utilisez notre améliorateur de prompts pour optimiser vos prompts

---

<Note>
Notre améliorateur de prompts est compatible avec tous les modèles Claude, y compris ceux avec des capacités de réflexion étendue. Pour des conseils de prompting spécifiques aux modèles de réflexion étendue, voir [ici](/docs/fr/build-with-claude/extended-thinking).
</Note>

L'améliorateur de prompts vous aide à itérer rapidement et à améliorer vos prompts grâce à une analyse et une amélioration automatisées. Il excelle à rendre les prompts plus robustes pour les tâches complexes qui nécessitent une grande précision.

<Frame>
  ![Image](/docs/images/prompt_improver.png)
</Frame>

## Avant de commencer

Vous aurez besoin de :
- Un [modèle de prompt](/docs/fr/build-with-claude/prompt-engineering/prompt-templates-and-variables) à améliorer
- Des commentaires sur les problèmes actuels avec les sorties de Claude (optionnel mais recommandé)
- Des exemples d'entrées et de sorties idéales (optionnel mais recommandé)

## Comment fonctionne l'améliorateur de prompts

L'améliorateur de prompts améliore vos prompts en 4 étapes :

1. **Identification d'exemples** : Localise et extrait les exemples de votre modèle de prompt
2. **Brouillon initial** : Crée un modèle structuré avec des sections claires et des balises XML
3. **Raffinement de la chaîne de pensée** : Ajoute et affine des instructions de raisonnement détaillées
4. **Amélioration des exemples** : Met à jour les exemples pour démontrer le nouveau processus de raisonnement

Vous pouvez regarder ces étapes se dérouler en temps réel dans la fenêtre d'amélioration.

## Ce que vous obtenez

L'améliorateur de prompts génère des modèles avec :
- Des instructions détaillées de chaîne de pensée qui guident le processus de raisonnement de Claude et améliorent généralement ses performances
- Une organisation claire utilisant des balises XML pour séparer les différents composants
- Un formatage d'exemples standardisé qui démontre le raisonnement étape par étape de l'entrée à la sortie
- Des pré-remplissages stratégiques qui guident les réponses initiales de Claude

<Note>
Bien que les exemples apparaissent séparément dans l'interface utilisateur du Workbench, ils sont inclus au début du premier message utilisateur dans l'appel API réel. Visualisez le format brut en cliquant sur "**\<\/\> Get Code**" ou insérez les exemples comme texte brut via la boîte Exemples.
</Note>

## Comment utiliser l'améliorateur de prompts

1. Soumettez votre modèle de prompt
2. Ajoutez des commentaires sur les problèmes avec les sorties actuelles de Claude (par exemple, "les résumés sont trop basiques pour des audiences expertes")
3. Incluez des exemples d'entrées et de sorties idéales
4. Examinez le prompt amélioré

## Générer des exemples de test

Vous n'avez pas encore d'exemples ? Utilisez notre [Générateur de cas de test](/docs/fr/test-and-evaluate/eval-tool#creating-test-cases) pour :
1. Générer des entrées d'exemple
2. Obtenir les réponses de Claude
3. Modifier les réponses pour qu'elles correspondent à vos sorties idéales
4. Ajouter les exemples peaufinés à votre prompt

## Quand utiliser l'améliorateur de prompts

L'améliorateur de prompts fonctionne mieux pour :
- Les tâches complexes nécessitant un raisonnement détaillé
- Les situations où la précision est plus importante que la vitesse
- Les problèmes où les sorties actuelles de Claude nécessitent une amélioration significative

<Note>
Pour les applications sensibles à la latence ou au coût, considérez l'utilisation de prompts plus simples. L'améliorateur de prompts crée des modèles qui produisent des réponses plus longues, plus approfondies, mais plus lentes.
</Note>

## Exemple d'amélioration

Voici comment l'améliorateur de prompts améliore un prompt de classification de base :

<section title="Prompt original">

```
À partir de la liste suivante de titres d'articles Wikipedia, identifiez de quel article cette phrase provient.
Répondez avec seulement le titre de l'article et rien d'autre.

Titres d'articles :
{{titles}}

Phrase à classifier :
{{sentence}}
```

</section>

<section title="Prompt amélioré">

```
Vous êtes un système de classification de texte intelligent spécialisé dans la correspondance de phrases avec des titres d'articles Wikipedia. Votre tâche est d'identifier à quel article Wikipedia une phrase donnée appartient le plus probablement, basé sur une liste fournie de titres d'articles.

D'abord, examinez la liste suivante de titres d'articles Wikipedia :
<article_titles>
{{titles}}
</article_titles>

Maintenant, considérez cette phrase qui doit être classifiée :
<sentence_to_classify>
{{sentence}}
</sentence_to_classify>

Votre objectif est de déterminer quel titre d'article de la liste fournie correspond le mieux à la phrase donnée. Suivez ces étapes :

1. Listez les concepts clés de la phrase
2. Comparez chaque concept clé avec les titres d'articles
3. Classez les 3 titres les plus pertinents et expliquez pourquoi ils sont pertinents
4. Sélectionnez le titre d'article le plus approprié qui englobe ou se rapporte le mieux au contenu de la phrase

Enveloppez votre analyse dans des balises <analysis>. Incluez ce qui suit :
- Liste des concepts clés de la phrase
- Comparaison de chaque concept clé avec les titres d'articles
- Classement des 3 titres les plus pertinents avec des explications
- Votre choix final et votre raisonnement

Après votre analyse, fournissez votre réponse finale : le titre d'article Wikipedia unique le plus approprié de la liste.

Sortez seulement le titre d'article choisi, sans texte ou explication supplémentaire.
```

</section>

Remarquez comment le prompt amélioré :
- Ajoute des instructions de raisonnement claires étape par étape
- Utilise des balises XML pour organiser le contenu
- Fournit des exigences explicites de formatage de sortie
- Guide Claude à travers le processus d'analyse

## Dépannage

Problèmes courants et solutions :

- **Les exemples n'apparaissent pas dans la sortie** : Vérifiez que les exemples sont correctement formatés avec des balises XML et apparaissent au début du premier message utilisateur
- **La chaîne de pensée trop verbeuse** : Ajoutez des instructions spécifiques sur la longueur de sortie désirée et le niveau de détail
- **Les étapes de raisonnement ne correspondent pas à vos besoins** : Modifiez la section des étapes pour correspondre à votre cas d'usage spécifique

***

## Prochaines étapes

<CardGroup cols={3}>
  <Card title="Bibliothèque de prompts" icon="link" href="/docs/fr/resources/prompt-library/library">
    Inspirez-vous d'exemples de prompts pour diverses tâches.
  </Card>
  <Card title="Tutoriel de prompting GitHub" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    Apprenez les meilleures pratiques de prompting avec notre tutoriel interactif.
  </Card>
  <Card title="Testez vos prompts" icon="link" href="/docs/fr/test-and-evaluate/eval-tool">
    Utilisez notre outil d'évaluation pour tester vos prompts améliorés.
  </Card>
</CardGroup>