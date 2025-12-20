# Aperçu de l'ingénierie des invites

Guide complet sur l'ingénierie des invites pour optimiser les performances de Claude

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

## Avant l'ingénierie des invites

Ce guide suppose que vous avez :
1. Une définition claire des critères de succès pour votre cas d'usage
2. Des moyens de tester empiriquement par rapport à ces critères
3. Un premier brouillon d'invite que vous souhaitez améliorer

Si ce n'est pas le cas, nous vous suggérons vivement de consacrer du temps à établir cela d'abord. Consultez [Définir vos critères de succès](/docs/fr/test-and-evaluate/define-success) et [Créer des évaluations empiriques solides](/docs/fr/test-and-evaluate/develop-tests) pour obtenir des conseils et des orientations.

<Card title="Générateur d'invites" icon="link" href="/dashboard">
  Vous n'avez pas de premier brouillon d'invite ? Essayez le générateur d'invites dans la Claude Console !
</Card>

***

## Quand faire de l'ingénierie des invites

  Ce guide se concentre sur les critères de succès qui sont contrôlables par l'ingénierie des invites.
  Tous les critères de succès ou les évaluations défaillantes ne sont pas mieux résolus par l'ingénierie des invites. Par exemple, la latence et le coût peuvent parfois être plus facilement améliorés en sélectionnant un modèle différent.

<section title="Invites vs. ajustement fin">

  L'ingénierie des invites est beaucoup plus rapide que d'autres méthodes de contrôle du comportement du modèle, comme l'ajustement fin, et peut souvent produire des sauts de performance en beaucoup moins de temps. Voici quelques raisons de considérer l'ingénierie des invites plutôt que l'ajustement fin :<br/>
  - **Efficacité des ressources** : L'ajustement fin nécessite des GPU haut de gamme et une mémoire importante, tandis que l'ingénierie des invites ne nécessite que des entrées texte, ce qui la rend beaucoup plus économe en ressources.
  - **Rentabilité** : Pour les services d'IA basés sur le cloud, l'ajustement fin entraîne des coûts importants. L'ingénierie des invites utilise le modèle de base, qui est généralement moins cher.
  - **Maintien des mises à jour du modèle** : Lorsque les fournisseurs mettent à jour les modèles, les versions ajustées finement pourraient nécessiter un réentraînement. Les invites fonctionnent généralement d'une version à l'autre sans modifications.
  - **Gain de temps** : L'ajustement fin peut prendre des heures ou même des jours. En revanche, l'ingénierie des invites fournit des résultats quasi instantanés, permettant une résolution rapide des problèmes.
  - **Besoins de données minimaux** : L'ajustement fin nécessite des données substantielles spécifiques à la tâche et étiquetées, qui peuvent être rares ou coûteuses. L'ingénierie des invites fonctionne avec un apprentissage peu nombreux ou même zéro.
  - **Flexibilité et itération rapide** : Essayez rapidement diverses approches, affinez les invites et voyez les résultats immédiatement. Cette expérimentation rapide est difficile avec l'ajustement fin.
  - **Adaptation au domaine** : Adaptez facilement les modèles à de nouveaux domaines en fournissant un contexte spécifique au domaine dans les invites, sans réentraînement.
  - **Améliorations de la compréhension** : L'ingénierie des invites est beaucoup plus efficace que l'ajustement fin pour aider les modèles à mieux comprendre et utiliser le contenu externe tel que les documents récupérés
  - **Préserve les connaissances générales** : L'ajustement fin risque l'oubli catastrophique, où le modèle perd les connaissances générales. L'ingénierie des invites maintient les capacités générales du modèle.
  - **Transparence** : Les invites sont lisibles par l'homme, montrant exactement quelles informations le modèle reçoit. Cette transparence aide à la compréhension et au débogage.

</section>

***

## Comment faire de l'ingénierie des invites

Les pages d'ingénierie des invites de cette section ont été organisées des techniques les plus largement efficaces aux techniques plus spécialisées. Lors du dépannage des performances, nous vous suggérons d'essayer ces techniques dans l'ordre, bien que l'impact réel de chaque technique dépendra de votre cas d'usage.
1. [Générateur d'invites](/docs/fr/build-with-claude/prompt-engineering/prompt-generator)
2. [Soyez clair et direct](/docs/fr/build-with-claude/prompt-engineering/be-clear-and-direct)
3. [Utilisez des exemples (multishot)](/docs/fr/build-with-claude/prompt-engineering/multishot-prompting)
4. [Laissez Claude réfléchir (chaîne de pensée)](/docs/fr/build-with-claude/prompt-engineering/chain-of-thought)
5. [Utilisez des balises XML](/docs/fr/build-with-claude/prompt-engineering/use-xml-tags)
6. [Donnez un rôle à Claude (invites système)](/docs/fr/build-with-claude/prompt-engineering/system-prompts)
7. [Préremplissez la réponse de Claude](/docs/fr/build-with-claude/prompt-engineering/prefill-claudes-response)
8. [Enchaînez les invites complexes](/docs/fr/build-with-claude/prompt-engineering/chain-prompts)
9. [Conseils pour le contexte long](/docs/fr/build-with-claude/prompt-engineering/long-context-tips)

***

## Tutoriel d'ingénierie des invites

Si vous êtes un apprenant interactif, vous pouvez plutôt plonger dans nos tutoriels interactifs !

<CardGroup cols={2}>
  <Card title="Tutoriel de prompting GitHub" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    Un tutoriel rempli d'exemples qui couvre les concepts d'ingénierie des invites trouvés dans notre documentation.
  </Card>
  <Card title="Tutoriel de prompting Google Sheets" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    Une version plus légère de notre tutoriel d'ingénierie des invites via une feuille de calcul interactive.
  </Card>
</CardGroup>