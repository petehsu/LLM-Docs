# Utiliser des exemples (prompting multishot) pour guider le comportement de Claude

Apprenez à utiliser des exemples pour améliorer la précision et la cohérence des réponses de Claude grâce au prompting multishot.

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

Les exemples sont votre arme secrète pour obtenir de Claude exactement ce dont vous avez besoin. En fournissant quelques exemples bien conçus dans votre prompt, vous pouvez améliorer dramatiquement la précision, la cohérence et la qualité des résultats de Claude.
Cette technique, connue sous le nom de prompting few-shot ou multishot, est particulièrement efficace pour les tâches qui nécessitent des résultats structurés ou le respect de formats spécifiques.

<Tip>**Améliorez vos prompts** : Incluez 3-5 exemples diversifiés et pertinents pour montrer à Claude exactement ce que vous voulez. Plus d'exemples = meilleures performances, surtout pour les tâches complexes.</Tip>

## Pourquoi utiliser des exemples ?

- **Précision** : Les exemples réduisent les malentendus dans l'interprétation des instructions.
- **Cohérence** : Les exemples garantissent une structure et un style uniformes.
- **Performance** : Les exemples bien choisis renforcent la capacité de Claude à gérer les tâches complexes.

## Créer des exemples efficaces

Pour une efficacité maximale, assurez-vous que vos exemples sont :
- **Pertinents** : Vos exemples reflètent votre cas d'usage réel.
- **Diversifiés** : Vos exemples couvrent les cas limites et les défis potentiels, et varient suffisamment pour que Claude ne détecte pas involontairement des motifs non intentionnels.
- **Clairs** : Vos exemples sont enveloppés dans des balises `<example>` (si plusieurs, imbriquées dans des balises `<examples>`) pour la structure.

<Tip>Demandez à Claude d'évaluer vos exemples pour leur pertinence, leur diversité ou leur clarté. Ou demandez à Claude de générer plus d'exemples basés sur votre ensemble initial.</Tip>
<section title="Exemple : Analyser les commentaires des clients">

    Notez que dans la version « sans exemples », Claude ne liste pas plusieurs options pour chaque catégorie, malgré son analyse écrite indiquant qu'il y a plusieurs catégories pour certains commentaires. Il inclut également une longue explication alors que nous pourrions ne pas la vouloir.

    | Rôle | Sans exemples | Avec exemples |
    | --- | --- | --- |
    | Utilisateur | Analysez ce commentaire client et catégorisez les problèmes. Utilisez ces catégories : UI/UX, Performance, Feature Request, Integration, Pricing, et Other. Évaluez également le sentiment (Positive/Neutral/Negative) et la priorité (High/Medium/Low).<br/><br/>Voici le commentaire : \{\{FEEDBACK\}\} | Notre équipe CS est submergée par des commentaires non structurés. Votre tâche est d'analyser les commentaires et de catégoriser les problèmes pour nos équipes produit et ingénierie. Utilisez ces catégories : UI/UX, Performance, Feature Request, Integration, Pricing, et Other. Évaluez également le sentiment (Positive/Neutral/Negative) et la priorité (High/Medium/Low). Voici un exemple :<br/><br/>\<example><br/>Input: The new dashboard is a mess! It takes forever to load, and I can't find the export button. Fix this ASAP!<br/>Category: UI/UX, Performance<br/>Sentiment: Negative<br/>Priority: High\</example><br/><br/>Maintenant, analysez ce commentaire : \{\{FEEDBACK\}\} |
    | Assistant (réponse de Claude) | Voici l'analyse du commentaire client :<br/><br/>Issue: UI/UX<br/>Sentiment: Negative<br/>Priority: High<br/>Le client est frustré par la nouvelle conception du tableau de bord, qu'il trouve encombrée et lente à charger. Il signale spécifiquement le bouton « export » manquant, qui est probablement une fonctionnalité critique. Ce problème doit être résolu en tant que priorité élevée.<br/><br/>Issue: Integration<br/>Sentiment: Positive<br/>Priority: Medium<br/>Le client est satisfait de l'intégration Salesforce existante mais aimerait voir le support de Hubspot également. C'est une demande de fonctionnalité qui pourrait être envisagée pour une mise à jour produit future.<br/><br/>Issue: Pricing<br/>Sentiment: Negative<br/>Priority: High<br/>Le client trouve la tarification déraisonnable, surtout pour les fonctionnalités de base. Il menace de passer à un concurrent, donc c'est un problème de priorité élevée qui doit être examiné.<br/><br/>Issue: Performance<br/>Sentiment Negative<br/>Priority: High<br/>Le client rencontre des problèmes critiques avec l'application mobile, où les téléchargements de fichiers volumineux entraînent systématiquement des plantages. C'est un problème important qui affecte la capacité du client à utiliser le produit efficacement et doit être résolu en tant que priorité élevée.<br/><br/>Issue: UI/UX<br/>Sentiment: Positive<br/>Priority: Low<br/>Le client est globalement satisfait du produit, signalant spécifiquement l'interface utilisateur intuitive et l'excellent support client. C'est un commentaire positif qui ne nécessite aucune action immédiate. | Voici l'analyse du commentaire client :<br/><br/>1. The new dashboard is a mess! It takes forever to load, and I can't find the export button. Fix this ASAP!<br/>Category: UI/UX, Performance<br/>Sentiment: Negative<br/>Priority: High<br/><br/>2. Love the Salesforce integration! But it'd be great if you could add Hubspot too.<br/>Category: Integration, Feature Request<br/>Sentiment: Positive<br/>Priority: Medium<br/><br/>3. Your pricing is ridiculous! $99/mo for basic features? I'm switching to Competitor X.<br/>Category: Pricing<br/>Sentiment: Negative<br/>Priority: High<br/><br/>4. The mobile app keeps crashing when I try to upload large files (>50MB). This is critical for our field agents.<br/>Category: Performance<br/>Sentiment: Negative<br/>Priority: High<br/><br/>5. Overall, I'm happy with the product. The UI is intuitive, and the customer support is top-notch. Keep it up!<br/>Category: UI/UX, Other (Customer Support)<br/>Sentiment: Positive<br/>Priority: Low |

</section>

***

<CardGroup cols={3}>
  <Card title="Bibliothèque de prompts" icon="link" href="/docs/fr/resources/prompt-library/library">
    Inspirez-vous d'une sélection organisée de prompts pour diverses tâches et cas d'usage.
  </Card>
  <Card title="Tutoriel de prompting GitHub" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    Un tutoriel riche en exemples qui couvre les concepts d'ingénierie de prompts trouvés dans notre documentation.
  </Card>
  <Card title="Tutoriel de prompting Google Sheets" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    Une version plus légère de notre tutoriel d'ingénierie de prompts via une feuille de calcul interactive.
  </Card>
</CardGroup>