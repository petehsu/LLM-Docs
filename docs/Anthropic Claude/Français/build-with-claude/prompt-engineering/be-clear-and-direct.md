# Soyez clair, direct et détaillé

Comment communiquer clairement avec Claude pour obtenir les meilleurs résultats

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

Lorsque vous interagissez avec Claude, pensez à lui comme à un employé brillant mais tout nouveau (atteint d'amnésie) qui a besoin d'instructions explicites. Comme tout nouvel employé, Claude n'a pas de contexte sur vos normes, vos styles, vos directives ou vos façons préférées de travailler.
Plus vous expliquez précisément ce que vous voulez, meilleure sera la réponse de Claude.

<Tip>**La règle d'or de la formulation claire**<br/>Montrez votre invite à un collègue, idéalement quelqu'un qui a un contexte minimal sur la tâche, et demandez-lui de suivre les instructions. S'il est confus, Claude le sera probablement aussi.</Tip>

## Comment être clair, contextuel et spécifique

- **Donnez à Claude des informations contextuelles :** Tout comme vous pourriez mieux performer dans une tâche si vous aviez plus de contexte, Claude performera mieux s'il dispose de plus d'informations contextuelles. Voici quelques exemples d'informations contextuelles :
    - À quoi serviront les résultats de la tâche
    - À quel public la sortie est destinée
    - À quel flux de travail la tâche appartient et où cette tâche s'inscrit dans ce flux
    - L'objectif final de la tâche, ou à quoi ressemble une tâche complétée avec succès
- **Soyez spécifique sur ce que vous voulez que Claude fasse :** Par exemple, si vous voulez que Claude ne produise que du code et rien d'autre, dites-le.
- **Fournissez les instructions sous forme d'étapes séquentielles :** Utilisez des listes numérotées ou des puces pour mieux vous assurer que Claude exécute la tâche exactement comme vous le souhaitez.

### Exemples

    <section title="Exemple : Anonymiser les commentaires des clients">

    Remarquez que Claude commet toujours des erreurs dans l'exemple d'invite peu claire, comme laisser le nom d'un client.

    | Rôle | Invite peu claire | Invite claire |
    | --- | --- | --- |
    | Utilisateur | Veuillez supprimer toutes les informations d'identification personnelle de ces messages de commentaires clients : \{\{FEEDBACK_DATA\}\} | Votre tâche est d'anonymiser les commentaires des clients pour notre examen trimestriel.<br/><br/>Instructions :<br/>1. Remplacez tous les noms de clients par « CUSTOMER_[ID] » (par exemple, « Jane Doe » → « CUSTOMER_001 »).<br/>2. Remplacez les adresses e-mail par « EMAIL_[ID]@example.com ».<br/>3. Masquez les numéros de téléphone par « PHONE_[ID] ».<br/>4. Si un message mentionne un produit spécifique (par exemple, « AcmeCloud »), laissez-le intact.<br/>5. Si aucune PII n'est trouvée, copiez le message tel quel.<br/>6. Produisez uniquement les messages traités, séparés par « --- ».<br/><br/>Données à traiter : \{\{FEEDBACK_DATA\}\} |
    | Assistant (réponse de Claude) | Voici les messages de commentaires clients anonymisés :<br/>1. J'utilise votre logiciel depuis des années, et c'est formidable. Mais récemment, AcmeCloud s'est écrasé beaucoup. Réparez-le !<br/>2. XXX, votre représentant du service client, a été incroyablement utile. Il m'a guidé tout au long du processus. Mon e-mail est XXX si vous voulez envoyer une enquête.<br/>3. Je suis John Smith, et je ne suis pas satisfait. J'ai attendu 2 heures pour joindre quelqu'un à XXX. C'est inacceptable ! | CUSTOMER_001 : J'utilise votre logiciel depuis des années, et c'est formidable. Mais récemment, AcmeCloud s'est écrasé beaucoup. Réparez-le !<br/>---<br/>CUSTOMER_002 : CUSTOMER_SERVICE_001, votre représentant du service client, a été incroyablement utile. Il m'a guidé tout au long du processus. Mon e-mail est EMAIL_002@example.com si vous voulez envoyer une enquête.<br/>---<br/>CUSTOMER_003 : Je suis CUSTOMER_003, et je ne suis pas satisfait. J'ai attendu 2 heures pour joindre quelqu'un à PHONE_001. C'est inacceptable ! |
    
</section>
    <section title="Exemple : Créer une campagne d'e-mail marketing">

    Remarquez que Claude invente des détails pour combler les lacunes où il manque de contexte avec l'invite vague.

    | Rôle | Invite vague | Invite spécifique |
    | --- | --- | --- |
    | Utilisateur | Écrivez un e-mail marketing pour nos nouvelles fonctionnalités AcmeCloud. | Votre tâche est de rédiger un e-mail marketing ciblé pour notre version de fonctionnalités AcmeCloud du Q3.<br/><br/>Instructions :<br/>1. Écrivez pour ce public cible : Entreprises technologiques de taille moyenne (100-500 employés) passant du sur site au cloud.<br/>2. Mettez en évidence 3 nouvelles fonctionnalités clés : chiffrement de données avancé, synchronisation multiplateforme et collaboration en temps réel.<br/>3. Ton : Professionnel mais accessible. Mettez l'accent sur la sécurité, l'efficacité et le travail d'équipe.<br/>4. Incluez un appel à l'action clair : Essai gratuit de 30 jours avec intégration prioritaire.<br/>5. Ligne d'objet : Moins de 50 caractères, mentionnez « sécurité » et « collaboration ».<br/>6. Personnalisation : Utilisez les variables \{\{COMPANY_NAME\}\} et \{\{CONTACT_NAME\}\}.<br/><br/>Structure :<br/>1. Ligne d'objet<br/>2. Corps de l'e-mail (150-200 mots)<br/>3. Texte du bouton d'appel à l'action |
    | Assistant (réponse de Claude) | Voici un brouillon d'e-mail marketing pour nos nouvelles fonctionnalités :<br/><br/>Objet : Boostez votre entreprise avec les dernières fonctionnalités d'AcmeCloud<br/><br/>Cher client estimé,<br/><br/>Nous sommes heureux de présenter trois fonctionnalités puissantes pour AcmeCloud qui révolutionneront votre flux de travail :<br/><br/>1. Collaboration en temps réel : Travaillez sur des documents simultanément avec votre équipe. Plus de problèmes de contrôle de version !<br/>2. Insights alimentés par l'IA : Prenez des décisions basées sur les données avec l'IA qui analyse les tendances et automatise les tâches.<br/>3. Suite de sécurité avancée : Le chiffrement de bout en bout, l'authentification multifacteur et la détection des menaces gardent vos données en sécurité.<br/><br/>Offre limitée : Mettez à niveau maintenant pour une réduction de 20 % la première année. De plus, parrainez un ami pour 10 % de réduction supplémentaire !<br/><br/>Cordialement,<br/>L'équipe AcmeCloud | Ligne d'objet : AcmeCloud : La sécurité d'entreprise rencontre le travail d'équipe en temps réel<br/><br/>Corps de l'e-mail :<br/>Cher \{\{CONTACT_NAME\}\},<br/><br/>Chez \{\{COMPANY_NAME\}\}, vous grandissez rapidement et envisagez le cloud. Mais avec la croissance vient le défi de maintenir les données sécurisées tout en favorisant la collaboration. C'est là que la version Q3 d'AcmeCloud intervient, conçue sur mesure pour les innovateurs technologiques comme vous.<br/><br/>1. Fort Knox pour vos fichiers : Le chiffrement de qualité militaire protège maintenant vos données, en mouvement et au repos. Votre propriété intellectuelle reste la vôtre, point final.<br/>2. Synchronisation sans frontières : Windows, Mac ou Linux—AcmeCloud parle toutes les langues. Le contrôle de version unifié signifie plus de « final_v2_REALLY_FINAL.doc ».<br/>3. Collaborez à la vitesse de la lumière : Abandonnez le ping-pong des pièces jointes. Maintenant, vos développeurs, designers et data scientists co-créent en temps réel, réduisant le délai de mise sur le marché.<br/><br/>Ne nous croyez pas sur parole. Découvrez la différence AcmeCloud avec notre essai de 30 jours. Et parce que nous savons que le temps est votre bien le plus précieux, nous offrons l'intégration prioritaire.<br/><br/>Élevez votre équipe maintenant - Essai gratuit de 30 jours |
    
</section>
    <section title="Exemple : Réponse aux incidents">

    Remarquez que Claude produit du texte superflu et un formatage différent avec l'invite vague.
    | Rôle | Invite vague | Invite détaillée |
    | --- | --- | --- |
    | Utilisateur | Analysez ce rapport de panne AcmeCloud et résumez les points clés.<br/><br/>\{\{REPORT\}\} | Analysez ce rapport de panne AcmeCloud. Ignorez le préambule. Gardez votre réponse concise et écrivez uniquement les informations essentielles. Listez uniquement :<br/>1) Cause<br/>2) Durée<br/>3) Services impactés<br/>4) Nombre d'utilisateurs affectés<br/>5) Perte de revenus estimée. <br/><br/>Voici le rapport : \{\{REPORT\}\}|
    | Assistant (réponse de Claude) | Voici un résumé des points clés du rapport de panne AcmeCloud :<br/><br/>Le 15 mai, une mise à jour du répartiteur de charge mal configurée a causé des problèmes importants de routage du trafic, entraînant une panne de service de 09:15 à 13:52 UTC. L'interruption de 4 heures et 37 minutes a impacté notre service de synchronisation de fichiers principal et notre tableau de bord d'administration, les rendant inaccessibles. De plus, l'application mobile a connu une perte de fonctionnalité partielle. Environ 68 % de notre base d'utilisateurs, totalisant 1,3 million d'utilisateurs, ont été affectés. Basé sur nos accords de niveau de service (SLA) et le revenu moyen par utilisateur, nous estimons un impact financier de 420 000 $ en crédits de service et en perte potentielle de clients. | 1) Cause : Mise à jour du répartiteur de charge mal configurée<br/>2) Durée : 4h 37m (09:15-13:52 UTC, 15 mai)<br/>3) Impactés : Synchronisation principale, tableau de bord d'administration (arrêtés) ; application mobile (partielle)<br/>4) Utilisateurs affectés : 1,3M (68 % de la base)<br/>5) Perte de revenus estimée : 420 000 $ |
    
</section>

***

<CardGroup cols={3}>
  <Card title="Bibliothèque d'invites" icon="link" href="/docs/fr/resources/prompt-library/library">
    Inspirez-vous d'une sélection organisée d'invites pour diverses tâches et cas d'usage.
  </Card>
  <Card title="Tutoriel de prompting GitHub" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    Un tutoriel riche en exemples qui couvre les concepts d'ingénierie d'invites trouvés dans notre documentation.
  </Card>
  <Card title="Tutoriel de prompting Google Sheets" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    Une version plus légère de notre tutoriel d'ingénierie d'invites via une feuille de calcul interactive.
  </Card>
</CardGroup>