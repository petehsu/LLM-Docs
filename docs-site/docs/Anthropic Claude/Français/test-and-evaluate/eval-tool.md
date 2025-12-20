# Utilisation de l'outil d'évaluation

La [Console Claude](/dashboard) dispose d'un **outil d'évaluation** qui vous permet de tester vos prompts sous différents scénarios.

---

## Accès à la fonctionnalité d'évaluation

Pour commencer avec l'outil d'évaluation :

1. Ouvrez la Console Claude et naviguez vers l'éditeur de prompts.
2. Après avoir composé votre prompt, recherchez l'onglet 'Evaluate' en haut de l'écran.

![Accès à la fonctionnalité d'évaluation](/docs/images/access_evaluate.png)

<Tip>
Assurez-vous que votre prompt inclut au moins 1-2 variables dynamiques en utilisant la syntaxe à double accolades : \{\{variable\}\}. Ceci est requis pour créer des ensembles de tests d'évaluation.
</Tip>

## Génération de prompts

La Console offre un [générateur de prompts](/docs/fr/build-with-claude/prompt-engineering/prompt-generator) intégré alimenté par Claude Opus 4.1 :

<Steps>
  <Step title="Cliquez sur 'Generate Prompt'">
    Cliquer sur l'outil d'aide 'Generate Prompt' ouvrira une fenêtre modale qui vous permet de saisir les informations de votre tâche.
  </Step>
  <Step title="Décrivez votre tâche">
    Décrivez votre tâche souhaitée (par exemple, "Trier les demandes de support client entrant") avec autant ou aussi peu de détails que vous le souhaitez. Plus vous incluez de contexte, plus Claude peut adapter son prompt généré à vos besoins spécifiques.
  </Step>
  <Step title="Générez votre prompt">
    Cliquer sur le bouton orange 'Generate Prompt' en bas fera que Claude génère un prompt de haute qualité pour vous. Vous pouvez ensuite améliorer davantage ces prompts en utilisant l'écran d'évaluation dans la Console.
  </Step>
</Steps>

Cette fonctionnalité facilite la création de prompts avec la syntaxe de variable appropriée pour l'évaluation.

![Générateur de prompts](/docs/images/promptgenerator.png)

## Création de cas de test

Lorsque vous accédez à l'écran d'évaluation, vous avez plusieurs options pour créer des cas de test :

1. Cliquez sur le bouton '+ Add Row' en bas à gauche pour ajouter manuellement un cas.
2. Utilisez la fonctionnalité 'Generate Test Case' pour que Claude génère automatiquement des cas de test pour vous.
3. Importez des cas de test à partir d'un fichier CSV.

Pour utiliser la fonctionnalité 'Generate Test Case' :

<Steps>
  <Step title="Cliquez sur 'Generate Test Case'">
    Claude générera des cas de test pour vous, une ligne à la fois pour chaque fois que vous cliquez sur le bouton.
  </Step>
  <Step title="Modifiez la logique de génération (optionnel)">
    Vous pouvez également modifier la logique de génération de cas de test en cliquant sur la flèche déroulante à droite du bouton 'Generate Test Case', puis sur 'Show generation logic' en haut de la fenêtre Variables qui apparaît. Vous devrez peut-être cliquer sur `Generate' en haut à droite de cette fenêtre pour remplir la logique de génération initiale.
    
    Modifier ceci vous permet de personnaliser et d'affiner les cas de test que Claude génère avec une plus grande précision et spécificité.
  </Step>
</Steps>

Voici un exemple d'un écran d'évaluation rempli avec plusieurs cas de test :

![Écran d'évaluation rempli](/docs/images/eval_populated.png)

<Note>
Si vous mettez à jour votre texte de prompt original, vous pouvez relancer toute la suite d'évaluation contre le nouveau prompt pour voir comment les changements affectent les performances sur tous les cas de test.
</Note>

## Conseils pour une évaluation efficace

<section title="Structure de prompt pour l'évaluation">

Pour tirer le meilleur parti de l'outil d'évaluation, structurez vos prompts avec des formats d'entrée et de sortie clairs. Par exemple :

```
Dans cette tâche, vous allez générer une histoire mignonne d'une phrase qui incorpore deux éléments : une couleur et un son.
La couleur à inclure dans l'histoire est :
<color>
{{COLOR}}
</color>
Le son à inclure dans l'histoire est :
<sound>
{{SOUND}}
</sound>
Voici les étapes pour générer l'histoire :
1. Pensez à un objet, animal, ou scène qui est communément associé avec la couleur fournie. Par exemple, si la couleur est "bleu", vous pourriez penser au ciel, à l'océan, ou à un oiseau bleu.
2. Imaginez une action simple, un événement ou une scène impliquant l'objet/animal/scène coloré que vous avez identifié et le son fourni. Par exemple, si la couleur est "bleu" et le son est "sifflement", vous pourriez imaginer un oiseau bleu sifflant une mélodie.
3. Décrivez l'action, l'événement ou la scène que vous avez imaginé en une seule phrase concise. Concentrez-vous sur rendre la phrase mignonne, évocatrice et imaginative. Par exemple : "Un oiseau bleu joyeux sifflait une mélodie joyeuse en planant dans le ciel azur."
Veuillez garder votre histoire à une seule phrase seulement. Visez à rendre cette phrase aussi charmante et engageante que possible tout en incorporant naturellement la couleur et le son donnés.
Écrivez votre histoire complète d'une phrase à l'intérieur des balises <story>.

```

Cette structure facilite la variation des entrées (\{\{COLOR\}\} et \{\{SOUND\}\}) et l'évaluation cohérente des sorties.

</section>

<Tip>
Utilisez l'outil d'aide 'Generate a prompt' dans la Console pour créer rapidement des prompts avec la syntaxe de variable appropriée pour l'évaluation.
</Tip>

## Comprendre et comparer les résultats

L'outil d'évaluation offre plusieurs fonctionnalités pour vous aider à affiner vos prompts :

1. **Comparaison côte à côte** : Comparez les sorties de deux ou plusieurs prompts pour voir rapidement l'impact de vos changements.
2. **Notation de qualité** : Notez la qualité des réponses sur une échelle de 5 points pour suivre les améliorations de la qualité des réponses par prompt.
3. **Versioning de prompts** : Créez de nouvelles versions de votre prompt et relancez la suite de tests pour itérer rapidement et améliorer les résultats.

En examinant les résultats à travers les cas de test et en comparant différentes versions de prompts, vous pouvez repérer des modèles et faire des ajustements éclairés à votre prompt plus efficacement.

Commencez à évaluer vos prompts aujourd'hui pour construire des applications IA plus robustes avec Claude !