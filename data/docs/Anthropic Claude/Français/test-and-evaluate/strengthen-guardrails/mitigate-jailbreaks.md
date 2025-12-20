# Atténuer les jailbreaks et les injections de prompt

---

Les jailbreaks et les injections de prompt se produisent lorsque les utilisateurs élaborent des prompts pour exploiter les vulnérabilités du modèle, dans le but de générer du contenu inapproprié. Bien que Claude soit intrinsèquement résistant à de telles attaques, voici des étapes supplémentaires pour renforcer vos garde-fous, particulièrement contre les utilisations qui violent nos [Conditions d'utilisation](https://www.anthropic.com/legal/commercial-terms) ou notre [Politique d'utilisation](https://www.anthropic.com/legal/aup).

<Tip>Claude est beaucoup plus résistant aux jailbreaks que les autres grands LLM, grâce à des méthodes d'entraînement avancées comme l'IA Constitutionnelle.</Tip>

- **Filtres d'innocuité** : Utilisez un modèle léger comme Claude Haiku 3 pour pré-filtrer les entrées des utilisateurs.

    <section title="Exemple : Filtre d'innocuité pour la modération de contenu">

        | Rôle | Contenu |
        | ---- | --- |
        | User | Un utilisateur a soumis ce contenu :<br/>\<content><br/>\{\{CONTENT}\}<br/>\</content><br/><br/>Répondez par (Y) s'il fait référence à des activités nuisibles, illégales ou explicites. Répondez par (N) s'il est sûr. |
        | Assistant (prefill) | \( |
        | Assistant | N) |
    
</section>

- **Validation des entrées** : Filtrez les prompts pour détecter les modèles de jailbreaking. Vous pouvez même utiliser un LLM pour créer un filtre de validation généralisé en fournissant des exemples connus de langage de jailbreaking.

- **Ingénierie de prompt** : Élaborez des prompts qui mettent l'accent sur les limites éthiques et légales.

    <section title="Exemple : Prompt système éthique pour un chatbot d'entreprise">

        | Rôle | Contenu |
        | ---- | --- |
        | System | Vous êtes l'assistant IA éthique d'AcmeCorp. Vos réponses doivent s'aligner sur nos valeurs :<br/>\<values><br/>- Intégrité : Ne jamais tromper ou aider à la tromperie.<br/>- Conformité : Refuser toute demande qui viole les lois ou nos politiques.<br/>- Confidentialité : Protéger toutes les données personnelles et d'entreprise.<br/>Respect de la propriété intellectuelle : Vos productions ne doivent pas enfreindre les droits de propriété intellectuelle d'autrui.<br/>\</values><br/><br/>Si une demande entre en conflit avec ces valeurs, répondez : "Je ne peux pas effectuer cette action car elle va à l'encontre des valeurs d'AcmeCorp." |
    
</section>

Ajustez les réponses et envisagez de limiter ou de bannir les utilisateurs qui s'engagent de façon répétée dans un comportement abusif tentant de contourner les garde-fous de Claude. Par exemple, si un utilisateur particulier déclenche le même type de refus plusieurs fois (par exemple, "sortie bloquée par la politique de filtrage de contenu"), informez l'utilisateur que ses actions violent les politiques d'utilisation pertinentes et prenez des mesures en conséquence.

- **Surveillance continue** : Analysez régulièrement les sorties pour détecter les signes de jailbreaking.
Utilisez cette surveillance pour affiner itérativement vos prompts et stratégies de validation.

## Avancé : Protections en chaîne
Combinez les stratégies pour une protection robuste. Voici un exemple de niveau entreprise avec utilisation d'outils :

<section title="Exemple : Protection multicouche pour un chatbot de conseiller financier">

  ### Prompt système du bot
  | Rôle | Contenu |
  | ---- | --- |
  | System | Vous êtes AcmeFinBot, un conseiller financier pour AcmeTrade Inc. Votre directive principale est de protéger les intérêts des clients et de maintenir la conformité réglementaire.<br/><br/>\<directives><br/>1. Validez toutes les demandes par rapport aux directives de la SEC et de la FINRA.<br/>2. Refusez toute action qui pourrait être interprétée comme du délit d'initié ou de la manipulation de marché.<br/>3. Protégez la vie privée des clients ; ne divulguez jamais de données personnelles ou financières.<br/>\</directives><br/><br/>Instructions étape par étape :<br/>\<instructions><br/>1. Filtrez la requête de l'utilisateur pour la conformité (utilisez l'outil 'harmlessness_screen').<br/>2. Si conforme, traitez la requête.<br/>3. Si non conforme, répondez : "Je ne peux pas traiter cette demande car elle viole les réglementations financières ou la confidentialité du client."<br/>\</instructions> |
  
  ### Prompt dans l'outil `harmlessness_screen`
  | Rôle | Contenu |
  | --- | --- |
  | User | \<user_query><br/>\{\{USER_QUERY}}<br/>\</user_query><br/><br/>Évaluez si cette requête viole les règles de la SEC, les directives de la FINRA ou la confidentialité du client. Répondez (Y) si c'est le cas, (N) si ce n'est pas le cas. |
  | Assistant (prefill) | \( |

</section>

En superposant ces stratégies, vous créez une défense robuste contre les jailbreaks et les injections de prompt, garantissant que vos applications alimentées par Claude maintiennent les plus hauts standards de sécurité et de conformité.