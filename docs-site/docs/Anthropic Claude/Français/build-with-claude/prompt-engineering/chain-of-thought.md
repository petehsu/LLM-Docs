# Laisser Claude réfléchir (incitation à la chaîne de pensée) pour améliorer les performances

Découvrez comment utiliser l'incitation à la chaîne de pensée pour améliorer les performances de Claude sur des tâches complexes.

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

Face à des tâches complexes comme la recherche, l'analyse ou la résolution de problèmes, donner à Claude l'espace pour réfléchir peut améliorer considérablement ses performances. Cette technique, connue sous le nom d'incitation à la chaîne de pensée (CoT), encourage Claude à décomposer les problèmes étape par étape, ce qui conduit à des résultats plus précis et nuancés.

## Avant de mettre en œuvre CoT

### Pourquoi laisser Claude réfléchir ?
- **Précision :** Parcourir les problèmes étape par étape réduit les erreurs, en particulier dans les mathématiques, la logique, l'analyse ou les tâches généralement complexes.
- **Cohérence :** La réflexion structurée conduit à des réponses plus cohésives et bien organisées.
- **Débogage :** Voir le processus de réflexion de Claude vous aide à identifier les endroits où les invites peuvent être peu claires.

### Pourquoi ne pas laisser Claude réfléchir ?
- L'augmentation de la longueur de la sortie peut affecter la latence.
- Toutes les tâches ne nécessitent pas une réflexion approfondie. Utilisez CoT judicieusement pour assurer le bon équilibre entre les performances et la latence.

<Tip>Utilisez CoT pour les tâches qu'un humain devrait réfléchir, comme les mathématiques complexes, l'analyse multi-étapes, la rédaction de documents complexes ou les décisions avec de nombreux facteurs.</Tip>

***

## Comment inciter à la réflexion

Les techniques de chaîne de pensée ci-dessous sont **ordonnées de la moins à la plus complexe**. Les méthodes moins complexes occupent moins d'espace dans la fenêtre de contexte, mais sont généralement aussi moins puissantes.

<Tip>**Conseil CoT** : Assurez-vous toujours que Claude produit sa réflexion. Sans produire son processus de réflexion, aucune réflexion ne se produit !</Tip>

- **Invite de base** : Incluez « Réfléchissez étape par étape » dans votre invite.
    - Manque de conseils sur *comment* réfléchir (ce qui n'est pas idéal si une tâche est très spécifique à votre application, cas d'usage ou organisation)
    <section title="Exemple : Rédaction d'e-mails aux donateurs (CoT de base)">

        | Rôle | Contenu |
        | ---- | ------- |
        | Utilisateur | Rédigez des e-mails personnalisés aux donateurs demandant des contributions au programme Care for Kids de cette année.<br/><br/>Informations sur le programme :<br/>\\{\{PROGRAM_DETAILS}}<br/>\</program><br/><br/>Informations sur le donateur :<br/>\<donor>\{\{DONOR_DETAILS}}<br/>\</donor><br/><br/>Réfléchissez étape par étape avant de rédiger l'e-mail. |
    
</section>
- **Invite guidée** : Décrivez les étapes spécifiques que Claude doit suivre dans son processus de réflexion.
    - Manque de structuration pour faciliter l'extraction et la séparation de la réponse de la réflexion.
    <section title="Exemple : Rédaction d'e-mails aux donateurs (CoT guidée)">

        | Rôle | Contenu |
        | ---- | ------- |
        | Utilisateur | Rédigez des e-mails personnalisés aux donateurs demandant des contributions au programme Care for Kids de cette année.<br/><br/>Informations sur le programme :<br/>\\{\{PROGRAM_DETAILS}}<br/>\</program><br/><br/>Informations sur le donateur :<br/>\<donor>\{\{DONOR_DETAILS}}<br/>\</donor><br/><br/>Réfléchissez avant de rédiger l'e-mail. D'abord, réfléchissez à la messagerie qui pourrait plaire à ce donateur compte tenu de son historique de dons et des campagnes qu'il a soutenues dans le passé. Ensuite, réfléchissez aux aspects du programme Care for Kids qui lui plairaient, compte tenu de son historique. Enfin, rédigez l'e-mail personnalisé au donateur en utilisant votre analyse. |
    
</section>
- **Invite structurée** : Utilisez des balises XML comme `<thinking>` et `<answer>` pour séparer le raisonnement de la réponse finale.
     <section title="Exemple : Rédaction d'e-mails aux donateurs (CoT guidée structurée)">

        | Rôle | Contenu |
        | ---- | ------- |
        | Utilisateur | Rédigez des e-mails personnalisés aux donateurs demandant des contributions au programme Care for Kids de cette année.<br/><br/>Informations sur le programme :<br/>\\{\{PROGRAM_DETAILS}}<br/>\</program><br/><br/>Informations sur le donateur :<br/>\<donor>\{\{DONOR_DETAILS}}<br/>\</donor><br/><br/>Réfléchissez avant de rédiger l'e-mail dans les balises \<thinking>. D'abord, réfléchissez à la messagerie qui pourrait plaire à ce donateur compte tenu de son historique de dons et des campagnes qu'il a soutenues dans le passé. Ensuite, réfléchissez aux aspects du programme Care for Kids qui lui plairaient, compte tenu de son historique. Enfin, rédigez l'e-mail personnalisé au donateur dans les balises \<email>, en utilisant votre analyse. |
    
</section>
    
### Exemples

  <section title="Exemple : Analyse financière sans réflexion">

    Sans réflexion étape par étape, Claude donne une recommandation qui semble raisonnable mais manque de profondeur. Il ne quantifie pas les résultats potentiels ni ne considère la performance historique du marché, qui sont essentiels pour prendre une décision éclairée.
    | Rôle | Contenu |
    | ---- | ------- |
    | Utilisateur | Vous êtes un conseiller financier. Un client souhaite investir 10 000 $. Il peut choisir entre deux options : A) Une action qui rapporte historiquement 12 % par an mais est volatile, ou B) Une obligation qui garantit 6 % par an. Le client a besoin de l'argent dans 5 ans pour un acompte sur une maison. Quelle option recommandez-vous ? |
    | Assistant | En fonction des informations fournies, je recommanderais l'option B, l'obligation qui garantit un rendement annuel de 6 %. Voici pourquoi :<br/><br/>1. Certitude : L'obligation offre un rendement annuel garanti de 6 %, ce qui assure la certitude dans la planification financière. C'est crucial lorsque le client a un objectif financier spécifique (acompte) avec un calendrier fixe (5 ans).<br/>2. Aversion au risque : Puisque le client a besoin de cet argent pour un événement important de sa vie (acheter une maison), il a probablement une faible tolérance au risque. La volatilité du marché boursier pourrait compromettre ses plans s'il y a une baisse proche du moment où il a besoin des fonds.<br/>3. Horizon temporel : Avec seulement 5 ans, il y a moins de temps pour se rétablir après les baisses potentielles du marché boursier. Les horizons d'investissement plus longs (10 ans ou plus) conviennent généralement mieux pour supporter la volatilité du marché boursier.<br/><br/>Bien que le rendement historique de 12 % de l'action soit attrayant, les performances passées ne garantissent pas les résultats futurs. Le rendement garanti de 6 % de l'obligation assure que le client aura les fonds dont il a besoin au moment de faire l'acompte. |
  
</section>
  <section title="Exemple : Analyse financière avec réflexion">

    Avec une réflexion étape par étape, le conseiller fournit une analyse beaucoup plus riche. Il calcule les chiffres exacts pour les deux scénarios, considère la volatilité historique du marché et analyse profondément la tolérance au risque du client. Ce raisonnement approfondi conduit à une recommandation plus confiante et justifiable.
    | Rôle | Contenu |
    | ---- | ------- |
    | Utilisateur | Vous êtes un conseiller financier. Un client souhaite investir 10 000 $. Il peut choisir entre deux options : A) Une action qui rapporte historiquement 12 % par an mais est volatile, ou B) Une obligation qui garantit 6 % par an. Le client a besoin de l'argent dans 5 ans pour un acompte sur une maison. Quelle option recommandez-vous ? Réfléchissez étape par étape. |
    | Assistant | Pour déterminer la meilleure option d'investissement pour notre client, je vais considérer plusieurs facteurs étape par étape :<br/><br/>\<thinking><br/>1. Comprendre l'objectif et le calendrier du client :<br/>   - Objectif : Acompte pour une maison<br/>   - Calendrier : 5 ans<br/>   - Implication : C'est un objectif financier à court terme et hautement prioritaire. Le client ne peut probablement pas se permettre un risque ou une volatilité significatifs.<br/><br/>2. Analyser l'option A (Action) :<br/>   - Avantage : Rendement historique plus élevé (12 % par an)<br/>   - Inconvénient : Volatilité (impliquant un potentiel de gains ou de pertes significatifs)<br/>   - Calculer le rendement potentiel sur 5 ans :<br/>     - Meilleur cas (12 % par an) : 10 000 $ * (1,12)^5 ≈ 17 623,42 $<br/>     - Pire cas (crash du marché) : Pourrait perdre une partie substantielle, par exemple, crash de 50 % = 5 000 $<br/><br/>3. Analyser l'option B (Obligation) :<br/>   - Avantage : Rendement garanti (6 % par an)<br/>   - Inconvénient : Rendement inférieur par rapport à la performance historique des actions<br/>   - Calculer le rendement sur 5 ans :<br/>     - Garanti : 10 000 $ * (1,06)^5 ≈ 13 382,25 $<br/><br/>4. Considérer la tolérance au risque :<br/>   - L'objectif est un acompte pour une maison (essentiel, pas discrétionnaire)<br/>   - Calendrier court (5 ans) limite la capacité à se rétablir après les baisses du marché<br/>   - Conclusion : Le client a probablement une faible tolérance au risque<br/><br/>5. Perspective historique :<br/>   - Le rendement de 12 % de l'action est historique, pas garanti<br/>   - Sur des périodes de 5 ans, le marché boursier peut varier énormément :<br/>     - 2003-2007 (avant la crise financière) : S&P 500 en hausse d'environ 82 %<br/>     - 2007-2011 (pendant la crise) : S&P 500 en baisse d'environ 2 %<br/>   - Conclusion : Les performances passées ne garantissent pas les résultats futurs, en particulier à court terme<br/><br/>6. Analyse finale :<br/>   - Option A (Action) : Rendement potentiel plus élevé mais risque inacceptable de ne pas atteindre l'objectif d'acompte<br/>   - Option B (Obligation) : Garantie d'atteindre environ 80 % du meilleur scénario d'action, 100 % de certitude d'avoir les fonds<br/>\</thinking><br/><br/>\<answer><br/>Je recommande l'option B, l'obligation avec un rendement annuel garanti de 6 %. Bien que le rendement historique de 12 % de l'action soit tentant, l'obligation assure que vous aurez 13 382,25 $ dans 5 ans pour votre acompte sur une maison. Compte tenu de l'importance et du court délai de votre objectif, la volatilité de l'action pose un risque inacceptable. L'obligation offre la certitude, qui est inestimable pour un jalon financier aussi crucial.<br/>\</answer> |
  
</section>

***

<CardGroup cols={3}>
  <Card title="Bibliothèque d'invites" icon="link" href="/docs/fr/resources/prompt-library/library">
    Inspirez-vous d'une sélection organisée d'invites pour diverses tâches et cas d'usage.
  </Card>
  <Card title="Tutoriel d'incitation GitHub" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    Un tutoriel riche en exemples qui couvre les concepts d'ingénierie d'invites trouvés dans notre documentation.
  </Card>
  <Card title="Tutoriel d'incitation Google Sheets" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    Une version plus légère de notre tutoriel d'ingénierie d'invites via une feuille de calcul interactive.
  </Card>
</CardGroup>