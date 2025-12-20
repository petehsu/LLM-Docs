# Augmenter la cohérence des résultats

Augmenter la cohérence des résultats

---

<Tip>
**Pour une conformité garantie au schéma JSON**

Si vous avez besoin que Claude produise toujours un JSON valide conforme à un schéma spécifique, utilisez [Structured Outputs](/docs/fr/build-with-claude/structured-outputs) au lieu des techniques d'ingénierie de prompt ci-dessous. Les sorties structurées garantissent la conformité au schéma et sont spécifiquement conçues pour ce cas d'usage.

Les techniques ci-dessous sont utiles pour la cohérence générale des résultats ou lorsque vous avez besoin de flexibilité au-delà des schémas JSON stricts.
</Tip>

Voici comment rendre les réponses de Claude plus cohérentes :

## Spécifier le format de sortie souhaité
Définissez précisément votre format de sortie souhaité en utilisant JSON, XML ou des modèles personnalisés afin que Claude comprenne chaque élément de formatage de sortie que vous exigez.

<section title="Exemple : Standardiser les commentaires des clients">

    | Rôle | Contenu |
    | ---- | ------- |
    | Utilisateur | Vous êtes une IA Customer Insights. Analysez ce commentaire et produisez au format JSON avec les clés : « sentiment » (positif/négatif/neutre), « key_issues » (liste) et « action_items » (liste de dictionnaires avec « team » et « task »).<br/><br/>« Je suis un utilisateur fidèle depuis 3 ans, mais la récente mise à jour de l'interface utilisateur est un désastre. Trouver les fonctionnalités de base est maintenant une chasse au trésor. De plus, la nouvelle tarification « premium » est exorbitante. Je envisage de changer à moins que ce ne soit corrigé rapidement. » |
    | Assistant | \{<br/>  "sentiment": "negative",<br/>  "key_issues": [<br/>    "Poor UI/UX in recent update",<br/>    "Difficulty finding basic features",<br/>    "Perceived high pricing (new 'premium' tier)"<br/>  ],<br/>  "action_items": [<br/>    \{<br/>      "team": "Product",<br/>      "task": "Conduct usability testing and iterate on UI based on findings"<br/>    \},<br/>    \{<br/>      "team": "UX",<br/>      "task": "Create a feature discovery guide or onboarding flow"<br/>    \},<br/>    \{<br/>      "team": "Marketing",<br/>      "task": "Review pricing strategy and communicate value proposition"<br/>    },<br/>    \{<br/>      "team": "Customer Success",<br/>      "task": "Reach out to user, offer concessions to prevent churn"<br/>    \}<br/>  ]<br/>\} |

</section>

## Pré-remplir la réponse de Claude
Pré-remplissez le tour `Assistant` avec votre format souhaité. Cette astuce contourne le préambule amical de Claude et applique votre structure.

<section title="Exemple : Rapport de ventes quotidien">

    | Rôle | Contenu |
    | ---- | ------- |
    | Utilisateur | Vous êtes une IA Sales Intelligence perspicace. Générez le rapport de ventes d'aujourd'hui.<br/><br/>Structurez le rapport comme ceci :<br/><br/>\<report><br/>    \<summary><br/>        \<metric name="total_revenue">\$0.00\</metric><br/>        \<metric name="units_sold">0\</metric><br/>        \<metric name="avg_order_value">\$0.00\</metric><br/>    \</summary><br/>    \<top_products><br/>        \<br/>            \<name>Product Name\</name><br/>            \<revenue>\$0.00\</revenue><br/>            \<units>0\</units><br/>        \</product><br/>        ...<br/>    \</top_products><br/>    \<regional_performance><br/>        \<region><br/>            \<name>Region Name\</name><br/>            \<revenue>\$0.00\</revenue><br/>            \<growth>0.0%\</growth><br/>        \</region><br/>        ...<br/>    \</regional_performance><br/>    \<action_items><br/>        \<item>Action item.\</item><br/>        ...<br/>    \</action_items><br/>\</report> |
    | Assistant (pré-remplissage) | \<report><br/>    \<summary><br/>        \<metric name= |
    | Assistant | "total_revenue">\$842,567.00\</metric><br/>        \<metric name="units_sold">15,238\</metric><br/>        \<metric name="avg_order_value">\$55.29\</metric><br/>    \</summary><br/>    \<top_products><br/>        \<br/>            \<name>AcmeGuard Pro\</name><br/>            \<revenue>\$325,890.00\</revenue><br/>            \<units>3,621\</units><br/>        \</product><br/>        \<br/>            \<name>AcmeVault Enterprise\</name><br/>            \<revenue>\$254,400.00\</revenue><br/>            \<units>1,272\</units><br/>        \</product><br/>        \<br/>            \<name>AcmeBoost XL\</name><br/>            \<revenue>\$147,690.00\</revenue><br/>            \<units>4,923\</units><br/>        \</product><br/>    \</top_products><br/>    \<regional_performance><br/>        \<region><br/>            \<name>APAC\</name><br/>            \<revenue>\$258,960.00\</revenue><br/>            \<growth>12.8%\</growth><br/>        \</region><br/>        \<region><br/>            \<name>EMEA\</name><br/>            \<revenue>\$325,478.00\</revenue><br/>            \<growth>3.2%\</growth><br/>        \</region><br/>        \<region><br/>            \<name>Americas\</name><br/>            \<revenue>\$258,129.00\</revenue><br/>            \<growth>-2.1%\</growth><br/>        \</region><br/>    \</regional_performance><br/>    \<action_items><br/>        \<item>Investigate Americas revenue drop; schedule regional sales team meeting.\</item><br/>        \<item>Accelerate CloudGuard Pro rollout in APAC to capitalize on growth.\</item><br/>        \<item>Review NetBoost XL pricing; high volume but lower revenue.\</item><br/>    \</action_items><br/>\</report> |

</section>

## Contraindre avec des exemples
Fournissez des exemples de votre sortie souhaitée. Cela entraîne la compréhension de Claude mieux que les instructions abstraites.

<section title="Exemple : Générer une intelligence de marché cohérente">

    | Rôle | Contenu |
    | ---- | ------- |
    | Utilisateur | En tant qu'IA Market Intelligence, votre tâche est d'analyser les données sur nos concurrents. Voici nos données de concurrents :<br/>\<data><br/>\{\{DATA}}<br/>\</data><br/><br/>Produisez en suivant ce format d'exemple :<br/><br/>\<competitor><br/>  \<name>Rival Inc\</name><br/>  \<overview>A 50-word summary.\</overview><br/>  \<swot><br/>    \<strengths>- Bullet points\</strengths><br/>    \<weaknesses>- Bullet points\</weaknesses><br/>    \<opportunities>- Bullet points\</opportunities><br/>    \<threats>- Bullet points\</threats><br/>  \</swot><br/>  \<strategy>A 30-word strategic response.\</strategy><br/>\</competitor><br/><br/>Maintenant, analysez AcmeGiant et AcmeDataCo en utilisant ce format. |
    | Assistant | \<competitor><br/>  \<name>AcmeGiant\</name><br/>  \<overview>Global tech leader with a vast ecosystem of consumer and enterprise products. Known for innovation, strong brand, and deep customer lock-in through integrated hardware, software, and services.\</overview><br/>  \<swot><br/>    \<strengths><br/>      - Massive R\&D budget fuels continuous innovation<br/>      - Loyal customer base and powerful brand recognition<br/>      - Synergistic product ecosystem increases switching costs<br/>    \</strengths><br/>    \<weaknesses><br/>      - High prices may deter cost-sensitive customers<br/>      - Slow to address enterprise-specific customization needs<br/>      - Privacy concerns and regulatory scrutiny in multiple markets<br/>    \</weaknesses><br/>    \<opportunities><br/>      - Growing demand for AI and ML capabilities<br/>      - Expansion into emerging markets<br/>      - Acquisitions to fill product or talent gaps<br/>    \</opportunities><br/>    \<threats><br/>      - Rapid rise of cloud-native competitors<br/>      - Antitrust lawsuits and regulatory actions<br/>      - Talent poaching by startups and competitors<br/>    \</threats><br/>  \</swot><br/>  \<strategy>Focus on our agility and customization. Target TechGiant's slow enterprise response and privacy issues in our marketing.\</strategy><br/>\</competitor><br/><br/>\<competitor><br/>  \<name>AcmeDataCo\</name><br/>  \<overview>Rising star in data analytics and visualization. Offers intuitive, self-service BI tools with a freemium model, appealing to startups and enterprise teams alike.\</overview><br/>  \<swot><br/>    \<strengths><br/>      - User-friendly interface reduces need for specialized training<br/>      - Freemium model lowers barrier to entry, drives viral growth<br/>      - Strong product-market fit with rise of data-driven decisions<br/>    \</strengths><br/>    \<weaknesses><br/>      - Limited advanced analytics compared to established BI tools<br/>      - Scaling issues reported with very large datasets<br/>      - Dependent on third-party cloud infrastructure (AWS)<br/>    \</weaknesses><br/>    \<opportunities><br/>      - Expanding into predictive analytics and AI-driven insights<br/>      - Forming strategic alliances with complementary tech vendors<br/>      - Customizable dashboards for industry-specific solutions<br/>    \</opportunities><br/>    \<threats><br/>      - Market saturation; many new entrants in self-service BI<br/>      - Enterprise BI giants developing more user-friendly tools<br/>      - Data privacy regulations increasing compliance complexity<br/>    \</threats><br/>  \</swot><br/>  \<strategy>Highlight our robust enterprise features and data governance. Target accounts struggling with DataCo's scale limitations.\</strategy><br/>\</competitor> |

</section>

## Utiliser la récupération pour la cohérence contextuelle
Pour les tâches nécessitant un contexte cohérent (par exemple, chatbots, bases de connaissances), utilisez la récupération pour ancrer les réponses de Claude dans un ensemble d'informations fixe.

<section title="Exemple : Améliorer la cohérence du support informatique">

    | Rôle | Contenu |
    | ---- | ------- |
    | Utilisateur | Vous êtes notre IA IT Support qui s'appuie sur les données de la base de connaissances. Voici les entrées de votre base de connaissances :<br/><br/>\<kb><br/>  \<entry><br/>    \<id>1\</id><br/>    \<title>Reset Active Directory password\</title><br/>    \<content>1. Go to password.ourcompany.com<br/>2. Enter your username<br/>3. Click "Forgot Password"<br/>4. Follow email instructions\</content><br/>  \</entry><br/>  \<entry><br/>    \<id>2\</id><br/>    \<title>Connect to VPN\</title><br/>    \<content>1. Install GlobalProtect from software center<br/>2. Open GlobalProtect, enter "vpn.ourcompany.com"<br/>3. Use AD credentials to log in\</content><br/>  \</entry><br/>\</kb><br/><br/>Lorsque vous aidez les utilisateurs, consultez toujours la base de connaissances en premier. Répondez dans ce format :<br/><br/>\<response><br/>  \<kb_entry>Knowledge base entry used\</kb_entry><br/>  \<answer>Your response\</answer><br/>\</response> Écrivez quelques questions de test pour vous-même et répondez-y en utilisant la base de connaissances, juste pour vous assurer que vous comprenez comment utiliser correctement la base de connaissances. |
    | Assistant | Understood. I'll use the knowledge base for consistent responses. Let's test with a couple of scenarios.<br/><br/>User: Hey, I can't log into my email. I think I forgot my password.<br/><br/>\<response><br/>  \<kb_entry>1: Reset Active Directory password\</entry><br/>  \<answer>I understand you're having trouble logging into your email due to a forgotten password. No worries, this is a common issue. To reset your Active Directory password, which is used for email access, follow these steps:<br/><br/>1. Go to password.ourcompany.com<br/>2. Enter your username (same as your email address)<br/>3. Click on the "Forgot Password" link<br/>4. You'll receive an email with instructions. Follow them to reset your password.<br/><br/>After resetting, you should be able to log into your email. Let me know if you need any further assistance.\</answer><br/>\</response><br/><br/>User: I'm working from home today. How do I access internal resources?<br/><br/>\<response><br/>  \<kb_entry>2: Connect to VPN\</entry><br/>  \<answer>Great question! To access internal resources while working from home, you'll need to connect to our company VPN (Virtual Private Network). Here's how to set that up:<br/><br/>1. First, install the GlobalProtect VPN client. You can find this in our software center.<br/>2. Once installed, open the GlobalProtect application.<br/>3. In the server field, enter "vpn.ourcompany.com".<br/>4. Use your Active Directory (AD) credentials to log in - the same username and password you use for your email.<br/><br/>Once connected, you'll have secure access to all internal resources as if you were in the office. Let me know if you run into any issues during setup.\</answer><br/>\</response> |

</section>

## Enchaîner les prompts pour les tâches complexes
Décomposez les tâches complexes en sous-tâches plus petites et cohérentes. Chaque sous-tâche reçoit toute l'attention de Claude, réduisant les erreurs d'incohérence dans les flux de travail à grande échelle.