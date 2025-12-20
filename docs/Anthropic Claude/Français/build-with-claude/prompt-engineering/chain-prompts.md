# Enchaîner les invites complexes pour une meilleure performance

Apprenez à décomposer les tâches complexes en sous-tâches gérables en utilisant l'enchaînement d'invites pour améliorer la précision et la clarté.

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

Lorsque vous travaillez sur des tâches complexes, Claude peut parfois échouer si vous essayez de tout gérer dans une seule invite. L'enchaînement de la pensée (CoT) est excellent, mais que faire si votre tâche comporte plusieurs étapes distinctes qui nécessitent chacune une réflexion approfondie ?

Voici l'enchaînement d'invites : décomposer les tâches complexes en sous-tâches plus petites et gérables.

## Pourquoi enchaîner les invites ?

1. **Précision** : Chaque sous-tâche reçoit toute l'attention de Claude, réduisant les erreurs.
2. **Clarté** : Les sous-tâches plus simples signifient des instructions et des résultats plus clairs.
3. **Traçabilité** : Identifiez et corrigez facilement les problèmes dans votre chaîne d'invites.

***

## Quand enchaîner les invites

Utilisez l'enchaînement d'invites pour les tâches multi-étapes comme la synthèse de recherche, l'analyse de documents ou la création de contenu itérative. Lorsqu'une tâche implique plusieurs transformations, citations ou instructions, l'enchaînement empêche Claude de sauter ou de mal gérer les étapes.

**Rappelez-vous :** Chaque maillon de la chaîne reçoit toute l'attention de Claude !

<Tip>**Conseil de débogage** : Si Claude oublie une étape ou fonctionne mal, isolez cette étape dans sa propre invite. Cela vous permet d'affiner les étapes problématiques sans refaire la tâche entière.</Tip>

***

## Comment enchaîner les invites

1. **Identifiez les sous-tâches** : Décomposez votre tâche en étapes distinctes et séquentielles.
2. **Structurez avec XML pour des transitions claires** : Utilisez des balises XML pour transmettre les résultats entre les invites.
3. **Ayez un objectif à tâche unique** : Chaque sous-tâche doit avoir un objectif unique et clair.
4. **Itérez** : Affinez les sous-tâches en fonction de la performance de Claude.

### Exemples de flux de travail enchaînés :
- **Analyse multi-étapes** : Voir les exemples juridiques et commerciaux ci-dessous.
- **Pipelines de création de contenu** : Recherche → Esquisse → Brouillon → Édition → Formatage.
- **Traitement des données** : Extraction → Transformation → Analyse → Visualisation.
- **Prise de décision** : Recueillir des informations → Énumérer les options → Analyser chacune → Recommander.
- **Boucles de vérification** : Générer du contenu → Examiner → Affiner → Réexaminer.

<Tip>**Conseil d'optimisation** : Pour les tâches avec des sous-tâches indépendantes (comme l'analyse de plusieurs documents), créez des invites séparées et exécutez-les en parallèle pour plus de rapidité.</Tip>

### Avancé : Chaînes d'auto-correction

Vous pouvez enchaîner les invites pour que Claude examine son propre travail ! Cela détecte les erreurs et affine les résultats, en particulier pour les tâches critiques.

  <section title="Exemple : Résumé de recherche auto-correcteur">

    #### Invite 1
    | Rôle | Contenu |
    | ---- | ------- |
    | Utilisateur | Résumez cet article de recherche médicale.<br/><br/>\\{\{RESEARCH_PAPER}}\</paper><br/><br/>Concentrez-vous sur la méthodologie, les résultats et les implications cliniques. |
    | Assistant<br/>\{\{SUMMARY}} | Méthodologie : Essai contrôlé randomisé en double aveugle avec 500 patients atteints de diabète de type 2. Le groupe A (n=250) a reçu un nouvel agoniste dual GLP-1/GIP ; le groupe B (n=250) a reçu un agoniste GLP-1 standard. Essai de 24 semaines, critère d'évaluation principal : réduction de l'HbA1c.<br/><br/>Résultats :<br/>- Groupe A : réduction moyenne de l'HbA1c de 1,8 %<br/>- Groupe B : réduction moyenne de l'HbA1c de 1,1 %<br/>- 68 % du groupe A contre 52 % du groupe B ont atteint un HbA1c \<7 %<br/>- Groupe A : perte de poids moyenne de 5,2 kg<br/>- Groupe B : perte de poids moyenne de 3,1 kg<br/><br/>Sécurité : Profils d'événements indésirables similaires, aucun événement grave attribué au traitement.<br/><br/>Implications cliniques : L'agoniste dual montre un contrôle glycémique et une perte de poids supérieurs par rapport à la thérapie standard. Pourrait être un tournant, en particulier pour les diabétiques obèses. |
    
    #### Invite 2
    | Rôle | Contenu |
    | ---- | ------- |
    | Utilisateur | Votre tâche est de fournir des commentaires sur un résumé d'article de recherche. Voici un résumé d'un article de recherche médicale :<br/>\<summary><br/>\{\{SUMMARY\}\}<br/>\</summary><br/><br/>Voici l'article de recherche :<br/>\<br/>\{\{RESEARCH_PAPER\}\}<br/>\</paper><br/><br/>Examinez ce résumé pour l'exactitude, la clarté et l'exhaustivité sur une échelle de notation A-F. |
    | Assistant<br/>\{\{FEEDBACK}} | 1. Exactitude : A<br/>   - Statistiques clés correctement rapportées : réductions d'HbA1c, perte de poids.<br/>   - Profil de sécurité noté avec précision et absence d'événements indésirables graves.<br/>   - L'affirmation de « tournant » est justifiée par des résultats nettement meilleurs.<br/><br/>2. Clarté : A-<br/>   - Concis et bien structuré avec des sections claires.<br/>   - Bon usage du langage comparatif (par exemple, « en hausse de 3 % par rapport au T1 ») pour le contexte.<br/>   - Problème mineur : Les acronymes comme « RCT », « GLP-1 » et « GIP » ne sont pas définis. Envisagez d'épeler la première utilisation.<br/><br/>3. Exhaustivité : B+<br/>   - Couvre tous les domaines demandés : méthodologie, résultats, implications cliniques.<br/>   - Manquant : Caractéristiques de base des groupes (étaient-ils bien appariés ?).<br/>   - Manquant : Tout critère d'évaluation secondaire (par exemple, tension artérielle, lipides).<br/>   - À considérer : Implications à long terme ou besoin de recherches supplémentaires.<br/><br/>Dans l'ensemble, le résumé est exact et clair, fournissant des informations clés pour une compréhension rapide de l'étude. Pour atteindre A+, définissez les acronymes, mentionnez les statistiques de base des groupes, notez les résultats secondaires et abordez brièvement le besoin d'études à long terme. |
    
     #### Invite 3
    | Rôle | Contenu |
    | ---- | ------- |
    | Utilisateur | Votre tâche est d'améliorer un résumé d'article en fonction des commentaires. Voici le premier brouillon d'un article de recherche médicale :<br/>\<summary><br/>\{\{SUMMARY\}\}<br/>\</summary><br/><br/>Voici l'article de recherche :<br/>\<br/>\{\{RESEARCH_PAPER\}\}<br/>\</paper><br/><br/>Voici les commentaires :<br/>\<feedback><br/>\{\{FEEDBACK\}\}<br/>\</feedback><br/><br/>Mettez à jour le résumé en fonction des commentaires. |
    | Assistant | Méthodologie : Essai contrôlé randomisé en double aveugle (RCT) avec 500 patients atteints de diabète de type 2. Le groupe A (n=250) a reçu un nouvel agoniste dual glucagon-like peptide-1/polypeptide insulinotrope dépendant du glucose (GLP-1/GIP) ; le groupe B (n=250) a reçu un agoniste GLP-1 standard. Le critère d'évaluation principal de l'essai de 24 semaines était la réduction de l'HbA1c. Les groupes étaient bien appariés pour l'âge, l'IMC et l'HbA1c de base.<br/><br/>Résultats :<br/>- Groupe A : réduction moyenne de l'HbA1c de 1,8 %<br/>- Groupe B : réduction moyenne de l'HbA1c de 1,1 %<br/>- 68 % du groupe A contre 52 % du groupe B ont atteint un HbA1c \<7 %<br/>- Groupe A : perte de poids moyenne de 5,2 kg<br/>- Groupe B : perte de poids moyenne de 3,1 kg<br/><br/>Les critères d'évaluation secondaires ont montré des améliorations de la tension artérielle et des profils lipidiques pour les deux groupes, le groupe A montrant des résultats légèrement meilleurs.<br/><br/>Sécurité : Profils d'événements indésirables similaires, sans événements graves attribués à l'un ou l'autre traitement.<br/><br/>Implications cliniques : L'agoniste dual GLP-1/GIP démontre un contrôle glycémique et une perte de poids supérieurs par rapport à la thérapie GLP-1 standard. Ces résultats suggèrent qu'il pourrait s'agir d'une avancée significative, en particulier pour les diabétiques obèses. Cependant, des études à plus long terme sont nécessaires pour confirmer l'efficacité et la sécurité durables, ainsi que pour étudier les avantages potentiels sur les résultats cardiovasculaires. |
  
</section>

***

## Exemples

  <section title="Exemple : Analyser un contrat juridique (sans enchaînement)">

    Notez que Claude oublie l'instruction de fournir les modifications proposées dans son brouillon d'e-mail.

    | Rôle | Contenu |
    | ---- | ------- |
    | Utilisateur | Vous êtes notre directeur juridique en chef. Examinez ce contrat SaaS pour les risques, en mettant l'accent sur la confidentialité des données, les SLA et les plafonds de responsabilité.<br/><br/>\<contract><br/>\{\{CONTRACT}}<br/>\</contract><br/><br/>Rédigez ensuite un e-mail au fournisseur avec vos préoccupations et les modifications proposées. |
    | Assistant | Après examen du contrat SaaS, j'ai identifié plusieurs préoccupations :<br/><br/>1. Confidentialité des données (Section 7) :<br/>   - Problème : Le fournisseur a des droits larges pour utiliser les données des clients pour « l'amélioration des services ».<br/>   - Risque : Pourrait entraîner un partage de données non autorisé ou une monétisation.<br/><br/>2. SLA (Section 5) :<br/>   - Problème : La garantie de disponibilité de 99,5 % est inférieure à la norme de l'industrie.<br/>   - Risque : Les temps d'arrêt excessifs pourraient affecter nos opérations.<br/><br/>3. Responsabilité (Section 9) :<br/>   - Problème : Le plafond est fixé à 3 mois de frais.<br/>   - Risque : Inadéquat pour les violations de données potentielles ou les défaillances de service.<br/><br/>Brouillon d'e-mail :<br/><br/>Cher \{\{VENDOR}},<br/><br/>Après examen de l'accord SaaS, nous avons des préoccupations :<br/><br/>1. Confidentialité des données : Nous exigeons que nos données ne soient utilisées que pour la fourniture directe de services, pas pour une large « amélioration des services ». Veuillez modifier la section 7.<br/><br/>2. SLA : Une disponibilité de 99,5 % est insuffisante. Nous avons besoin de 99,99 % avec des pénalités clairement définies. Veuillez réviser la section 5.<br/><br/>3. Responsabilité : Le plafond actuel de 3 mois de frais est inadéquat. Nous proposons un plafond de 12 mois de frais, sans plafond pour les violations de données ou la faute intentionnelle.<br/><br/>Nous valorisons notre partenariat potentiel et croyons que ces modifications nous mettront en position de réussite. Veuillez envoyer un accord révisé.<br/><br/>Cordialement,<br/>\{\{CLO_NAME}} |
  
</section>

  <section title="Exemple : Analyser un contrat juridique (avec enchaînement)">

    #### Invite 1    
    | Rôle | Contenu |
    | ---- | ------- |
    | Utilisateur | Vous êtes notre directeur juridique en chef. Examinez ce contrat SaaS pour les risques, en mettant l'accent sur la confidentialité des données, les SLA et les plafonds de responsabilité.<br/><br/>\<contract><br/>\{\{CONTRACT}}<br/>\</contract><br/><br/>Affichez vos conclusions dans les balises \<risks>. |
    | Assistant<br/>\{\{CONCERNS}} | 1. Confidentialité des données (Section 7) :<br/>   - Problème : Le fournisseur a des droits larges pour utiliser les données des clients pour « l'amélioration des services ».<br/>   - Risque : Pourrait entraîner un partage de données non autorisé ou une monétisation des données des clients.<br/>   - Impact : Violation potentielle de la confiance des clients, amendes réglementaires (RGPD, CCPA).<br/><br/>2. SLA (Section 5) :<br/>   - Problème : La garantie de disponibilité de 99,5 % est inférieure à la norme de l'industrie (généralement 99,99 %).<br/>   - Risque : Jusqu'à 43,8 heures de temps d'arrêt par an contre 52,6 minutes à 99,99 %.<br/>   - Impact : Perturbations opérationnelles, perte de revenus, insatisfaction des clients.<br/><br/>3. Responsabilité (Section 9) :<br/>   - Problème : Le plafond de responsabilité est fixé à 3 mois de frais.<br/>   - Risque : Inadéquat pour les violations de données potentielles, le vol de propriété intellectuelle ou les défaillances de service prolongées.<br/>   - Impact : Compensation insuffisante pour les dommages qui pourraient dépasser largement le plafond, comme les recours collectifs ou les amendes réglementaires. |
    
    #### Invite 2    
    | Rôle | Contenu |
    | ---- | ------- |
    | Utilisateur | Rédigez un e-mail à un fournisseur de produits SaaS décrivant les préoccupations suivantes et proposant des modifications. Voici les préoccupations :<br/>\<concerns><br/>\{\{CONCERNS\}\}<br/>\</concerns><br/><br/>|
    | Assistant<br/>\{\{EMAIL}} | Cher \{\{VENDOR}},<br/><br/>Après un examen approfondi de l'accord SaaS proposé, notre équipe juridique a identifié plusieurs préoccupations hautement prioritaires qui doivent être abordées avant que nous puissions procéder :<br/><br/>1. Confidentialité des données (Section 7) :<br/>   - Actuel : Droits larges pour utiliser les données des clients pour « l'amélioration des services ».<br/>   - Préoccupation : Partage de données potentiellement non autorisé ou monétisation.<br/>   - Modification proposée : Limiter l'utilisation des données à la fourniture directe de services. Toute utilisation pour l'amélioration, l'analyse ou le marketing doit être volontaire, révocable et anonymisée.<br/><br/>2. SLA (Section 5) :<br/>   - Actuel : Garantie de disponibilité de 99,5 %.<br/>   - Préoccupation : Jusqu'à 43,8 heures de temps d'arrêt par an, risquant des perturbations opérationnelles.<br/>   - Modification proposée : Disponibilité de 99,99 % avec crédits de service échelonnés. Par exemple, crédit de 10 % pour \<99,99 %, 25 % pour \<99,9 %, 50 % pour \<99,5 %.<br/><br/>3. Responsabilité (Section 9) :<br/>   - Actuel : Plafond à 3 mois de frais.<br/>   - Préoccupation : Grossièrement inadéquat pour les violations de données, le vol de propriété intellectuelle ou les pannes prolongées.<br/>   - Modification proposée : 12 mois de frais pour la responsabilité générale. Sans plafond pour les violations de données, la faute intentionnelle, la violation de propriété intellectuelle.<br/><br/>Ces modifications sont non négociables pour nous. Elles s'alignent sur les normes de l'industrie et notre engagement envers la sécurité des données, l'excellence opérationnelle et la responsabilité fiduciaire. Nous valorisons le potentiel de notre partenariat, et les aborder établira une base solide.<br/><br/>Veuillez faire examiner et incorporer ces modifications par votre équipe juridique. Nous sommes heureux de discuter davantage pour assurer une compréhension et un accord mutuels.<br/><br/>Cordialement,<br/>\{\{CLO_NAME}} |
    
    #### Invite 3    
    | Rôle | Contenu |
    | ---- | ------- |
    | Utilisateur | Votre tâche est d'examiner un e-mail et de fournir des commentaires. Voici l'e-mail :<br/>\<email><br/>\{\{EMAIL\}\}<br/>\</email><br/><br/>Donnez des commentaires sur le ton, la clarté et le professionnalisme. |
    | Assistant | 1. Ton :<br/>   - Professionnel et affirmatif sans être confrontationnel.<br/>   - L'utilisation de « non négociable » est forte mais justifiée compte tenu de la criticité des problèmes.<br/>   - Le langage collaboratif (« nous valorisons », « heureux de discuter ») équilibre la fermeté, maintenant un ton constructif.<br/><br/>2. Clarté :<br/>   - Excellente structuration : État actuel, préoccupation et modification proposée pour chaque problème.<br/>   - Les termes techniques (par exemple, « EBITDA », « crédits de service échelonnés ») sont appropriés pour un contexte SaaS B2B.<br/>   - Les éléments d'action sont clairs : l'équipe juridique du fournisseur doit examiner et incorporer les modifications.<br/><br/>3. Professionnalisme :<br/>   - Se concentre sur les avantages mutuels et les normes de l'industrie, pas seulement sur nos demandes.<br/>   - Mentionne les responsabilités plus larges (sécurité des données, excellence opérationnelle, devoir fiduciaire), élevant la discussion.<br/>   - Offre une discussion supplémentaire, montrant l'engagement à comprendre et résoudre les problèmes.<br/><br/>Dans l'ensemble, l'e-mail trouve le bon équilibre entre affirmation et collaboration. Il articule clairement nos préoccupations, propose des solutions spécifiques et maintient un ton professionnel et orienté vers le partenariat. Aucune révision nécessaire ; procédez à l'envoi. |
  
</section>
  <section title="Exemple : Examen de la stratégie de multi-location">

    #### Invite 1    
    | Rôle | Contenu |
    | ---- | ------- |
    | Utilisateur | En tant qu'architecte de solutions senior, examinez et analysez cette stratégie de multi-location pour notre nouveau produit SaaS d'entreprise.<br/><br/>\<strategy><br/>\{\{STRATEGY}}<br/>\</strategy><br/><br/>Concentrez-vous sur l'évolutivité, la sécurité et la rentabilité. |
    | Assistant<br/>\{\{ANALYSIS}} | 1. Évolutivité :<br/>   + Le partitionnement de la base de données par locataire réduit la contention, supporte la croissance élevée.<br/>   + Les microservices permettent la mise à l'échelle indépendante des composants.<br/>   - Les serveurs d'applications partagés pourraient créer un goulot d'étranglement sous une charge extrême.<br/>   - Aucune mention de la mise à l'échelle automatique ou de l'équilibrage de charge pour la couche d'application.<br/><br/>2. Sécurité :<br/>   + L'isolation des données des locataires via le partitionnement atténue les fuites de données.<br/>   + JWT avec expiration courte et jetons d'actualisation est une meilleure pratique de l'industrie.<br/>   - Aucune mention du chiffrement (au repos, en transit) ou de la gestion des clés.<br/>   - La stratégie IAM manque de détails sur les rôles, les permissions ou le RBAC.<br/><br/>3. Rentabilité :<br/>   + Les serveurs d'applications partagés réduisent les coûts de ressources inactives.<br/>   + Les fonctions sans serveur pour les tâches peu fréquentes optimisent les coûts.<br/>   - La base de données par locataire pourrait augmenter les coûts à grande échelle par rapport à une base de données multi-location optimisée.<br/>   - Aucune discussion sur les instances réservées ou les instances spot pour les économies de coûts. |
    
    #### Invite 2    
    | Rôle | Contenu |
    | ---- | ------- |
    | Utilisateur | Rédigez un document d'examen de stratégie pour la direction de l'ingénierie basé sur cette analyse d'une stratégie de multi-location.<br/><br/>\<strategy><br/>\{\{STRATEGY}}<br/>\</strategy><br/><br/>\<analysis><br/>\{\{ANALYSIS}}<br/>\</analysis><br/><br/>Incluez un résumé exécutif, une analyse détaillée et des recommandations. |
    | Assistant<br/>\{\{STRATEGY_DOC}} | # Examen de la stratégie de multi-location : Produit SaaS d'entreprise<br/><br/>## Résumé exécutif<br/>La stratégie proposée démontre une base solide dans les principes d'évolutivité et de sécurité, mais présente des lacunes dans les détails de mise en œuvre. Elle excelle dans l'isolation des données et la mise à l'échelle au niveau des composants, mais manque d'une mise à l'échelle robuste de la couche d'application et de mesures de sécurité avancées. Les optimisations de coûts sont présentes mais pourraient faiblir à grande échelle. Avec des améliorations ciblées, cette stratégie peut efficacement soutenir nos ambitions SaaS d'entreprise.<br/><br/>## Analyse détaillée<br/><br/>### 1. Évolutivité : B+<br/><br/>Forces :<br/>- Le partitionnement de la base de données par locataire est excellent. Il minimise la latence des requêtes, supporte la croissance élevée des données et facilite la mise à l'échelle transparente par locataire.<br/>- L'architecture des microservices permet la mise à l'échelle des composants individuels en fonction de la demande, cruciale pour gérer les charges de travail d'entreprise diverses.<br/><br/>Faiblesses :<br/>- Les serveurs d'applications partagés risquent de devenir un goulot d'étranglement. À mesure que le nombre de locataires et le trafic augmentent, ceux-ci pourraient dégrader les performances pour tous les locataires.<br/>- L'absence de mise à l'échelle automatique et d'équilibrage de charge pour la couche d'application est une omission critique. Ceux-ci sont essentiels pour gérer les pics de trafic sans surprovisionnement.<br/><br/>### 2. Sécurité : B-<br/><br/>Forces :<br/>- Les bases de données partitionnées fournissent une forte isolation des données des locataires, atténuant les risques de fuites de données ou d'accès non autorisé entre locataires.<br/>- JWT avec expiration courte et jetons d'actualisation s'alignent sur les meilleures pratiques OWASP, réduisant les fenêtres de vulnérabilité des jetons.<br/><br/>Faiblesses :<br/>- Aucune mention du chiffrement des données au repos ou en transit (TLS 1.3). C'est non négociable pour les données d'entreprise.<br/>- La stratégie de gestion des clés est manquante. Comment les clés de chiffrement, les secrets JWT et les identifiants de base de données sont-ils gérés et renouvelés ?<br/>- L'IAM manque de profondeur. Nous avons besoin du RBAC avec des rôles bien définis, du contrôle d'accès basé sur les attributs (ABAC) pour les permissions granulaires et de l'intégration avec les fournisseurs d'identité d'entreprise (SAML, OIDC).<br/><br/>### 3. Rentabilité : B<br/><br/>Forces :<br/>- Les serveurs d'applications partagés réduisent les coûts de capacité inactifs, bons pour le trafic en régime permanent.<br/>- Sans serveur pour les tâches peu fréquentes (par exemple, rapports) est intelligent ; payez uniquement lorsque ces ressources sont utilisées.<br/><br/>Faiblesses :<br/>- Les bases de données par locataire peuvent ne pas être rentables à grande échelle par rapport à une base de données multi-location bien conçue avec un partitionnement de données robuste.<br/>- Aucune mention de mesures d'économie de coûts comme les instances réservées pour les charges de travail prévisibles ou les instances spot pour les tâches tolérantes aux pannes.<br/>- L'absence de mise à l'échelle automatique de la couche d'application pourrait entraîner un surprovisionnement, augmentant les coûts.<br/><br/>## Recommandations<br/><br/>1. **Résilience de la couche d'application** : Implémentez la mise à l'échelle automatique avec Kubernetes ou les services natifs du cloud (EKS, GKE). Déployez sur les zones de disponibilité avec un CDN pour les actifs statiques.<br/><br/>2. **Renforcement de la sécurité** :<br/>   a. Chiffrez les données au repos (AES-256) et en transit (TLS 1.3).<br/>   b. Utilisez un KMS géré (AWS KMS, GCP KMS) pour la gestion des clés.<br/>   c. Améliorez l'IAM avec RBAC, ABAC et SAML/OIDC pour l'authentification unique d'entreprise.<br/><br/>3. **Optimisation des coûts** :<br/>   a. Évaluez la base de données multi-location colonnaire (par exemple, Snowflake) par rapport au partitionnement à grande échelle.<br/>   b. Utilisez les instances réservées pour les serveurs d'applications, les instances spot pour les charges de travail non critiques.<br/>   c. Implémentez la surveillance proactive et le dimensionnement correct pour éviter le surprovisionnement.<br/><br/>4. **Preuve de concept (PoC)** : Avant la mise en œuvre complète, menez une PoC avec une simulation à grande échelle :<br/>   a. Testez la base de données partitionnée par rapport à la base de données multi-location optimisée pour le coût et les performances.<br/>   b. Testez la couche d'application avec un trafic simulé au niveau de l'entreprise.<br/>   c. Menez un audit de sécurité tiers, en mettant l'accent sur l'isolation des données et les contrôles d'accès.<br/><br/>Avec ces améliorations, notre stratégie de multi-location sera de niveau entreprise : évolutive, sécurisée et rentable. La PoC validera nos choix de conception et instillera la confiance dans nos clients d'entreprise. |
    
    #### Invite 3    
    | Rôle | Contenu |
    | ---- | ------- |
    | Utilisateur | Notez ce document d'examen de stratégie pour la clarté, l'actionnabilité et l'alignement avec les priorités d'entreprise. <br/><br/>\<br/>\{\{PRIORITIES}}<br/>\</priorities><br/><br/>\<strategy_doc><br/>\{\{STRATEGY_DOC}}<br/>\</strategy_doc> |
    | Assistant | 1. Clarté : A<br/>   + Structure claire avec résumé exécutif, analyse détaillée et recommandations.<br/>   + L'analyse utilise un système de notation (B+, B-) pour une compréhension rapide des forces/faiblesses.<br/>   + Les termes techniques (RBAC, ABAC, TLS) sont expliqués ou contextualisés, aidant la direction non technique.<br/>   + Les aides visuelles (puces, indentation) améliorent la lisibilité.<br/><br/>2. Actionnabilité : A-<br/>   + Les recommandations sont spécifiques et techniques (par exemple, « Implémentez la mise à l'échelle automatique avec Kubernetes »).<br/>   + Le plan PoC avec des objectifs clairs fournit une feuille de route.<br/>   + Manquant : Calendriers, exigences en ressources ou affectations d'équipe pour chaque recommandation.<br/>   + À considérer : Ajoutez une section « Prochaines étapes » avec les actions immédiates, les rôles et un calendrier de haut niveau.<br/><br/>3. Alignement d'entreprise : A+<br/>   + Aborde directement les priorités d'entreprise :<br/>     - Évolutivité : Discute de la gestion des pics de trafic au niveau de l'entreprise.<br/>     - Sécurité : Se concentre sur l'isolation des données, le chiffrement et l'IAM d'entreprise.<br/>     - Coût : Les stratégies s'alignent sur FinOps d'entreprise (instances réservées, dimensionnement correct).<br/>   + PoC avec « simulation à grande échelle » et audit de sécurité montre l'engagement envers la qualité de niveau entreprise.<br/>   + Le langage résonne avec les préoccupations d'entreprise : « risque inacceptable », « de niveau entreprise », « instiller la confiance ».<br/><br/>Dans l'ensemble, le document excelle en clarté et en alignement d'entreprise. L'actionnabilité est forte mais pourrait être élevée à A+ avec une section « Prochaines étapes ». La profondeur technique, couplée à des explications claires, rend cela très efficace pour la direction technique et non technique. Excellent travail ! |
  
</section>

***

<CardGroup cols={3}>
  <Card title="Bibliothèque d'invites" icon="link" href="/docs/fr/resources/prompt-library/library">
    Inspirez-vous d'une sélection organisée d'invites pour diverses tâches et cas d'usage.
  </Card>
  <Card title="Tutoriel d'invite GitHub" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    Un tutoriel riche en exemples qui couvre les concepts d'ingénierie d'invites trouvés dans notre documentation.
  </Card>
  <Card title="Tutoriel d'invite Google Sheets" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    Une version plus légère de notre tutoriel d'ingénierie d'invites via une feuille de calcul interactive.
  </Card>
</CardGroup>