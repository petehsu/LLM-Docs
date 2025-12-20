# Réduire les hallucinations

---

Même les modèles de langage les plus avancés, comme Claude, peuvent parfois générer du texte qui est factuellement incorrect ou incohérent avec le contexte donné. Ce phénomène, connu sous le nom d'"hallucination", peut compromettre la fiabilité de vos solutions basées sur l'IA.
Ce guide explorera les techniques pour minimiser les hallucinations et garantir que les résultats de Claude sont précis et fiables.

## Stratégies de base pour minimiser les hallucinations

- **Permettre à Claude de dire "Je ne sais pas" :** Donnez explicitement à Claude la permission d'admettre son incertitude. Cette technique simple peut considérablement réduire les fausses informations.

<section title="Exemple : Analyse d'un rapport de fusion et acquisition">

| Rôle | Contenu |
| ---- | --- |
| Utilisateur | En tant que conseiller en F&A, analysez ce rapport sur l'acquisition potentielle d'AcmeCo par ExampleCorp.<br/><br/>\<report><br/>\{\{REPORT}}<br/>\</report><br/><br/>Concentrez-vous sur les projections financières, les risques d'intégration et les obstacles réglementaires. Si vous n'êtes pas sûr d'un aspect ou si le rapport manque d'informations nécessaires, dites "Je n'ai pas assez d'informations pour évaluer cela avec confiance." |

</section>

- **Utiliser des citations directes pour l'ancrage factuel :** Pour les tâches impliquant de longs documents (>20K tokens), demandez à Claude d'extraire d'abord des citations mot pour mot avant d'effectuer sa tâche. Cela ancre ses réponses dans le texte réel, réduisant les hallucinations.

<section title="Exemple : Audit d'une politique de confidentialité des données">

| Rôle | Contenu |
| ---- | --- |
| Utilisateur | En tant que Délégué à la Protection des Données, examinez cette politique de confidentialité mise à jour pour la conformité au RGPD et au CCPA.<br/>\<br/>\{\{POLICY}}<br/>\</policy><br/><br/>1. Extrayez les citations exactes de la politique qui sont les plus pertinentes pour la conformité au RGPD et au CCPA. Si vous ne trouvez pas de citations pertinentes, indiquez "Aucune citation pertinente trouvée."<br/><br/>2. Utilisez les citations pour analyser la conformité de ces sections de la politique, en faisant référence aux citations par numéro. Basez votre analyse uniquement sur les citations extraites. |

</section>

- **Vérifier avec des citations** : Rendez la réponse de Claude vérifiable en lui faisant citer des extraits et des sources pour chacune de ses affirmations. Vous pouvez également faire vérifier par Claude chaque affirmation en trouvant une citation à l'appui après avoir généré une réponse. S'il ne peut pas trouver de citation, il doit retirer l'affirmation.

<section title="Exemple : Rédaction d'un communiqué de presse sur le lancement d'un produit">

| Rôle | Contenu |
| ---- | --- |
| Utilisateur | Rédigez un communiqué de presse pour notre nouveau produit de cybersécurité, AcmeSecurity Pro, en utilisant uniquement les informations de ces documents d'information sur le produit et rapports de marché.<br/>\<documents><br/>\{\{DOCUMENTS}}<br/>\</documents><br/><br/>Après la rédaction, examinez chaque affirmation dans votre communiqué de presse. Pour chaque affirmation, trouvez une citation directe des documents qui la soutient. Si vous ne pouvez pas trouver de citation à l'appui d'une affirmation, supprimez cette affirmation du communiqué de presse et marquez l'endroit où elle a été supprimée avec des crochets vides []. |

</section>

***

## Techniques avancées

- **Vérification par chaîne de pensée** : Demandez à Claude d'expliquer son raisonnement étape par étape avant de donner une réponse finale. Cela peut révéler une logique ou des hypothèses erronées.

- **Vérification Best-of-N** : Exécutez Claude avec le même prompt plusieurs fois et comparez les résultats. Les incohérences entre les résultats pourraient indiquer des hallucinations.

- **Raffinement itératif** : Utilisez les sorties de Claude comme entrées pour des prompts de suivi, en lui demandant de vérifier ou d'approfondir les déclarations précédentes. Cela peut détecter et corriger les incohérences.

- **Restriction des connaissances externes** : Demandez explicitement à Claude de n'utiliser que les informations des documents fournis et non ses connaissances générales.

<Note>Rappelez-vous que, bien que ces techniques réduisent considérablement les hallucinations, elles ne les éliminent pas complètement. Validez toujours les informations critiques, en particulier pour les décisions à enjeux élevés.</Note>