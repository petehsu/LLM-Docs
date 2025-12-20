# Support multilingue

Claude excelle dans les tâches multilingues, maintenant une forte performance cross-linguale par rapport à l'anglais.

---

## Aperçu

Claude démontre des capacités multilingues robustes, avec une performance particulièrement forte dans les tâches zero-shot dans plusieurs langues. Le modèle maintient une performance relative cohérente dans les langues largement parlées et les langues à ressources limitées, ce qui en fait un choix fiable pour les applications multilingues.

Notez que Claude est capable dans de nombreuses langues au-delà de celles évaluées ci-dessous. Nous vous encourageons à tester avec toutes les langues pertinentes pour vos cas d'usage spécifiques.

## Données de performance

Ci-dessous se trouvent les scores d'évaluation zero-shot chain-of-thought pour Claude 4, Claude 3.7 Sonnet et les modèles Claude 3.5 dans différentes langues, affichés en pourcentage relatif à la performance en anglais (100%) :

| Langue | Claude Opus 4<sup>1</sup> | Claude Sonnet 4<sup>1</sup> | Claude Sonnet 3.7 ([deprecated](/docs/fr/about-claude/model-deprecations))<sup>1</sup> | Claude Haiku 3.5|
|---|---|---|---|---|
| Anglais (baseline, fixé à 100%) | 100% | 100% | 100% | 100% |
| Espagnol | 98.0% | 97.5% | 97.6% | 94.6% |
| Portugais (Brésil) | 97.3% | 97.2% | 97.3% | 94.6% |
| Italien | 97.5% | 97.3% | 97.2% | 95.0% |
| Français | 97.7% | 97.1% | 96.9% | 95.3% |
| Indonésien | 97.2% | 96.2% | 96.3% | 91.2% |
| Allemand | 97.1% | 94.7% | 96.2% | 92.5% |
| Arabe | 96.9% | 96.1% | 95.4% | 84.7% |
| Chinois (Simplifié) | 96.7% | 95.9% | 95.3% | 90.9% |
| Coréen | 96.4% | 95.9% | 95.2% | 89.1% |
| Japonais | 96.2% | 95.6% | 95.0% | 90.8% |
| Hindi | 96.7% | 95.8% | 94.2% | 80.1% |
| Bengali | 95.2% | 94.4% | 92.4% | 72.9% |
| Swahili | 89.5% | 87.1% | 89.2% | 64.7% |
| Yoruba | 78.9% | 76.4% | 76.7% | 46.1% |

<sup>1</sup> Avec [extended thinking](/docs/fr/build-with-claude/extended-thinking).

<Note>
Ces métriques sont basées sur les ensembles de tests MMLU (Massive Multitask Language Understanding) en anglais qui ont été traduits dans 14 langues supplémentaires par des traducteurs humains professionnels, comme documenté dans le [référentiel simple-evals d'OpenAI](https://github.com/openai/simple-evals/blob/main/multilingual_mmlu_benchmark_results.md). L'utilisation de traducteurs humains pour cette évaluation garantit des traductions de haute qualité, particulièrement importante pour les langues disposant de moins de ressources numériques.
</Note>

***

## Meilleures pratiques

Lorsque vous travaillez avec du contenu multilingue :

1. **Fournir un contexte linguistique clair** : Bien que Claude puisse détecter automatiquement la langue cible, énoncer explicitement la langue d'entrée/sortie souhaitée améliore la fiabilité. Pour une fluidité améliorée, vous pouvez inviter Claude à utiliser « un langage idiomatique comme s'il était un locuteur natif ».
2. **Utiliser des scripts natifs** : Soumettez le texte dans son script natif plutôt que sa translittération pour des résultats optimaux
3. **Considérer le contexte culturel** : Une communication efficace nécessite souvent une sensibilisation culturelle et régionale au-delà de la simple traduction

Nous vous suggérons également de suivre nos [directives générales d'ingénierie des invites](/docs/fr/build-with-claude/prompt-engineering/overview) pour mieux améliorer la performance de Claude.

***

## Considérations relatives au support linguistique

- Claude traite l'entrée et génère la sortie dans la plupart des langues mondiales qui utilisent des caractères Unicode standard
- La performance varie selon la langue, avec des capacités particulièrement fortes dans les langues largement parlées
- Même dans les langues disposant de moins de ressources numériques, Claude maintient des capacités significatives

<CardGroup cols={2}>
  <Card title="Guide d'ingénierie des invites" icon="edit" href="/docs/fr/build-with-claude/prompt-engineering/overview">
    Maîtrisez l'art de la création d'invites pour tirer le meilleur parti de Claude.
  </Card>
  <Card title="Bibliothèque d'invites" icon="books" href="/docs/fr/resources/prompt-library">
    Trouvez un large éventail d'invites pré-créées pour diverses tâches et industries. Parfait pour l'inspiration ou les démarrages rapides.
  </Card>
</CardGroup>