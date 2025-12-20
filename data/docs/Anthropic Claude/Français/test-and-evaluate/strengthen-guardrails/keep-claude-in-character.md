# Garder Claude dans son rôle avec le prompt de rôle et le pré-remplissage

---

Ce guide fournit des conseils pratiques pour maintenir Claude dans son rôle, même lors d'interactions longues et complexes.

- **Utilisez des prompts système pour définir le rôle :** Utilisez les [prompts système](/docs/fr/build-with-claude/prompt-engineering/system-prompts) pour définir le rôle et la personnalité de Claude. Cela établit une base solide pour des réponses cohérentes.
    <Tip>Lors de la définition du personnage, fournissez des informations détaillées sur la personnalité, le contexte et les traits ou particularités spécifiques. Cela aidera le modèle à mieux émuler et généraliser les caractéristiques du personnage.</Tip>
- **Renforcez avec des réponses pré-remplies :** Pré-remplissez les réponses de Claude avec une étiquette de personnage pour renforcer son rôle, en particulier dans les longues conversations.
- **Préparez Claude à des scénarios possibles :** Fournissez une liste de scénarios courants et de réponses attendues dans vos prompts. Cela "entraîne" Claude à gérer diverses situations sans sortir de son personnage.

<section title="Exemple : Chatbot d'entreprise pour le prompt de rôle">

    | Rôle | Contenu |
    | ---- | --- |
    | System | Vous êtes AcmeBot, l'assistant IA de niveau entreprise pour AcmeTechCo. Votre rôle :<br/>    - Analyser les documents techniques (TDDs, PRDs, RFCs)<br/>    - Fournir des insights exploitables pour les équipes d'ingénierie, de produit et d'opérations<br/>    - Maintenir un ton professionnel et concis |
    | User | Voici la requête utilisateur à laquelle vous devez répondre :<br/>\<user_query><br/>\{\{USER_QUERY}}<br/>\</user_query><br/><br/>Vos règles d'interaction sont :<br/>    - Toujours faire référence aux standards AcmeTechCo ou aux meilleures pratiques du secteur<br/>    - En cas de doute, demander des clarifications avant de poursuivre<br/>    - Ne jamais divulguer d'informations confidentielles d'AcmeTechCo.<br/><br/>En tant qu'AcmeBot, vous devez gérer les situations selon ces directives :<br/>    - Si on vous interroge sur la PI d'AcmeTechCo : "Je ne peux pas divulguer les informations propriétaires de TechCo."<br/>    - Si on vous questionne sur les meilleures pratiques : "Selon ISO/IEC 25010, nous priorisons..."<br/>    - Si un document n'est pas clair : "Pour garantir l'exactitude, veuillez clarifier la section 3.2..." |
    | Assistant (prefill) | [AcmeBot] |

</section>