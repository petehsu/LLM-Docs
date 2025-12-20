# Définir vos critères de réussite

---

La création d'une application réussie basée sur les LLM commence par une définition claire de vos critères de réussite. Comment saurez-vous quand votre application sera suffisamment bonne pour être publiée ?

Avoir des critères de réussite clairs garantit que vos efforts d'ingénierie et d'optimisation des prompts sont concentrés sur l'atteinte d'objectifs spécifiques et mesurables.

***

## Élaborer des critères solides

De bons critères de réussite sont :
- **Spécifiques** : Définissez clairement ce que vous voulez accomplir. Au lieu de "bonnes performances", précisez "classification précise des sentiments".
- **Mesurables** : Utilisez des métriques quantitatives ou des échelles qualitatives bien définies. Les chiffres apportent de la clarté et de l'évolutivité, mais les mesures qualitatives peuvent être précieuses si elles sont appliquées de manière cohérente *avec* des mesures quantitatives.
    - Même des sujets "flous" comme l'éthique et la sécurité peuvent être quantifiés :
        |      | Critères de sécurité                |
        | ---- | --- |
        | Mauvais  | Sorties sécurisées                   |
        | Bon | Moins de 0,1 % des sorties sur 10 000 essais signalées pour toxicité par notre filtre de contenu. | 
    <section title="Exemples de métriques et méthodes de mesure">

        **Métriques quantitatives** :
            - Spécifiques à la tâche : score F1, score BLEU, perplexité
            - Génériques : Précision, exactitude, rappel
            - Opérationnelles : Temps de réponse (ms), disponibilité (%)

        **Méthodes quantitatives** :
            - Tests A/B : Comparer les performances par rapport à un modèle de référence ou une version antérieure.
            - Retour utilisateur : Mesures implicites comme les taux d'achèvement des tâches.
            - Analyse des cas limites : Pourcentage de cas limites traités sans erreurs.

        **Échelles qualitatives** :
            - Échelles de Likert : "Évaluez la cohérence de 1 (absurde) à 5 (parfaitement logique)"
            - Grilles d'experts : Linguistes évaluant la qualité de traduction selon des critères définis        
    
</section>
- **Atteignables** : Basez vos objectifs sur les références du secteur, les expériences antérieures, la recherche en IA ou les connaissances d'experts. Vos métriques de réussite ne doivent pas être irréalistes par rapport aux capacités actuelles des modèles de pointe.
- **Pertinents** : Alignez vos critères sur l'objectif de votre application et les besoins des utilisateurs. Une forte précision des citations peut être cruciale pour les applications médicales mais moins importante pour les chatbots occasionnels.

<section title="Exemple de critères de fidélité pour l'analyse de sentiment">

    |      | Critères |
    | ---- | --- |
    | Mauvais  | Le modèle doit bien classifier les sentiments                    |
    | Bon | Notre modèle d'analyse de sentiment doit atteindre un score F1 d'au moins 0,85 (Mesurable, Spécifique) sur un ensemble de test indépendant* de 10 000 tweets divers (Pertinent), ce qui représente une amélioration de 5 % par rapport à notre référence actuelle (Atteignable). |

    **Plus d'informations sur les ensembles de test indépendants dans la section suivante*

</section>

***

## Critères de réussite courants à considérer

Voici quelques critères qui pourraient être importants pour votre cas d'utilisation. Cette liste n'est pas exhaustive.

  <section title="Fidélité à la tâche">

    Dans quelle mesure le modèle doit-il bien performer sur la tâche ? Vous devrez peut-être également considérer la gestion des cas limites, comme la performance du modèle sur des entrées rares ou difficiles.
  
</section>
  <section title="Cohérence">

    À quel point les réponses du modèle doivent-elles être similaires pour des types d'entrée similaires ? Si un utilisateur pose la même question deux fois, quelle est l'importance d'obtenir des réponses sémantiquement similaires ?
  
</section>
  <section title="Pertinence et cohérence">

    Dans quelle mesure le modèle répond-il directement aux questions ou instructions de l'utilisateur ? Quelle est l'importance que l'information soit présentée de manière logique et facile à suivre ?
  
</section>
  <section title="Ton et style">

    Dans quelle mesure le style de sortie du modèle correspond-il aux attentes ? À quel point son langage est-il approprié pour le public cible ?
  
</section>
  <section title="Préservation de la confidentialité">

    Quelle est une métrique de réussite pour la façon dont le modèle traite les informations personnelles ou sensibles ? Peut-il suivre les instructions de ne pas utiliser ou partager certains détails ?
  
</section>
  <section title="Utilisation du contexte">

    Avec quelle efficacité le modèle utilise-t-il le contexte fourni ? Dans quelle mesure fait-il référence et s'appuie-t-il sur les informations données dans son historique ?
  
</section>
  <section title="Latence">

    Quel est le temps de réponse acceptable pour le modèle ? Cela dépendra des exigences en temps réel de votre application et des attentes des utilisateurs.
  
</section>
  <section title="Prix">

    Quel est votre budget pour faire fonctionner le modèle ? Tenez compte de facteurs comme le coût par appel API, la taille du modèle et la fréquence d'utilisation.
  
</section>

La plupart des cas d'utilisation nécessiteront une évaluation multidimensionnelle selon plusieurs critères de réussite.

<section title="Exemple de critères multidimensionnels pour l'analyse de sentiment">

    |      | Critères |
    | ---- | --- |
    | Mauvais  | Le modèle doit bien classifier les sentiments                    |
    | Bon | Sur un ensemble de test indépendant de 10 000 tweets divers, notre modèle d'analyse de sentiment doit atteindre :<br/>- un score F1 d'au moins 0,85<br/>- 99,5 % des sorties sont non toxiques<br/>- 90 % des erreurs causeraient un inconvénient, pas une erreur grave*<br/>- 95 % des temps de réponse < 200 ms |

    **En réalité, nous définirions également ce que signifient "inconvénient" et "grave".*

</section>

***

## Prochaines étapes

<CardGroup cols={2}>
  <Card title="Réfléchir aux critères" icon="link" href="https://claude.ai/">
    Réfléchissez aux critères de réussite pour votre cas d'utilisation avec Claude sur claude.ai.<br/><br/>**Astuce** : Déposez cette page dans le chat comme guide pour Claude !
  </Card>
  <Card title="Concevoir des évaluations" icon="link" href="/docs/fr/be-clear-direct">
    Apprenez à créer des ensembles de tests solides pour évaluer les performances de Claude par rapport à vos critères.
  </Card>
</CardGroup>