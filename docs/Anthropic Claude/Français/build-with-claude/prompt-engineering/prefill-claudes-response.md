# Préremplissez la réponse de Claude pour un meilleur contrôle de la sortie

Apprenez à préremplir les réponses de Claude pour diriger ses actions, ignorer les préambules, appliquer des formats spécifiques et maintenir la cohérence des rôles.

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

<Note>
Le préremplissage n'est disponible que pour les modes sans réflexion étendue. Il n'est actuellement pas pris en charge avec la réflexion étendue.
</Note>

Lorsque vous utilisez Claude, vous avez la capacité unique de guider ses réponses en préremplissant le message `Assistant`. Cette technique puissante vous permet de diriger les actions de Claude, d'ignorer les préambules, d'appliquer des formats spécifiques comme JSON ou XML, et même d'aider Claude à maintenir la cohérence des rôles dans les scénarios de jeu de rôle.

Dans certains cas où Claude ne fonctionne pas comme prévu, quelques phrases préremplies peuvent considérablement améliorer les performances de Claude. Un peu de préremplissage fait une grande différence !

## Comment préremplir la réponse de Claude

Pour préremplir, incluez le texte initial souhaité dans le message `Assistant` (la réponse de Claude continuera à partir du point où le message `Assistant` s'arrête) :

```python
import anthropic

client = anthropic.Anthropic()
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "What is your favorite color?"},
        {"role": "assistant", "content": "As an AI assistant, I don't have a favorite color, But if I had to pick, it would be green because"}  # Prefill here
    ]
)
```

<Warning>
  Le contenu du préremplissage ne peut pas se terminer par des espaces blancs. Un préremplissage comme `"As an AI assistant, I "` (avec un espace à la fin) entraînera une erreur.
</Warning>

### Exemples

#### Exemple 1 : Contrôler le formatage de la sortie et ignorer le préambule

<Tip>**Conseil pour les utilisateurs avancés** : Le préremplissage de `{` force Claude à ignorer le préambule et à produire directement l'objet JSON. C'est plus propre, plus concis et plus facile pour les programmes à analyser sans traitement supplémentaire.
Pour une sortie JSON garantie qui se conforme à un schéma spécifique, envisagez d'utiliser [Structured Outputs](/docs/fr/build-with-claude/structured-outputs) au lieu du préremplissage. Les sorties structurées garantissent que la réponse de Claude correspond toujours à votre schéma JSON défini, ce qui la rend idéale pour les applications de production qui nécessitent une conformité stricte du format.</Tip>

    <section title="Exemple : Extraction de données structurées sans préremplissage">

    | Rôle | Contenu |
    | ---- | ------- |
    | Utilisateur | Extrayez le nom, la taille, le prix et la couleur de cette description de produit sous forme d'objet JSON :<br/><br/>\<description><br/>Le SmartHome Mini est un assistant domotique compact disponible en noir ou blanc pour seulement \$49.99. Avec une largeur de seulement 5 pouces, il vous permet de contrôler les lumières, les thermostats et autres appareils connectés par la voix ou l'application, peu importe où vous le placez dans votre maison. Ce petit hub abordable apporte un contrôle pratique sans les mains à vos appareils intelligents.<br/>\</description> |
    | Assistant | Voici les informations extraites au format JSON :<br/><br/>\`\`\`json<br/>\{<br/>  "name": "SmartHome Mini",<br/>  "size": "5 inches wide",<br/>  "price": "\$49.99",<br/>  "colors": ["black", "white"]<br/>\}<br/>\`\`\`<br/><br/>J'ai extrait les détails suivants de la description du produit :<br/>- **Nom** : SmartHome Mini<br/>- **Taille** : 5 pouces de largeur<br/>- **Prix** : \$49.99<br/>- **Couleurs** : Disponible en noir et blanc<br/><br/>L'objet JSON fournit un format structuré qui est facile pour les programmes à analyser et à utiliser. Faites-moi savoir si vous avez besoin de modifications ou si vous avez d'autres questions ! |
    
</section>

    <section title="Exemple : Extraction de données structurées avec préremplissage">

    | Rôle | Contenu |
    | ---- | ------- |
    | Utilisateur | Extrayez le nom, la taille, le prix et la couleur de cette description de produit sous forme d'objet JSON :<br/><br/>\<description><br/>Le SmartHome Mini est un assistant domotique compact disponible en noir ou blanc pour seulement \$49.99. Avec une largeur de seulement 5 pouces, il vous permet de contrôler les lumières, les thermostats et autres appareils connectés par la voix ou l'application, peu importe où vous le placez dans votre maison. Ce petit hub abordable apporte un contrôle pratique sans les mains à vos appareils intelligents.<br/>\</description> |
    | Assistant (préremplissage) | \{ |
    | Assistant (réponse de Claude) | "name": "SmartHome Mini",<br/>"size": "5 inches wide",<br/>"price": "\$49.99",<br/>"colors": [<br/>  "black",<br/>  "white"<br/>]<br/>\} |
    
</section>

#### Exemple 2 : Maintenir le personnage dans les scénarios de jeu de rôle

<Tip>**Conseil de jeu de rôle** : Le préremplissage d'un `[ROLE_NAME]` entre crochets peut rappeler à Claude de rester dans le rôle, même pour les conversations plus longues et plus complexes. C'est particulièrement puissant lorsqu'il est combiné avec le rôle prompting dans le paramètre `system`.</Tip>

    <section title="Exemple : Maintenir le personnage sans rôle prompting">

    | Rôle | Contenu |
    | ---- | ------- |
    | Utilisateur (50 tours de conversation avec Claude « Sherlock Holmes ») | Que déduisez-vous du propriétaire de cette chaussure ? \<image>muddy_shoe.jpg\</image> |
    | Assistant | En tant qu'assistant IA, je serais heureux d'analyser l'image d'une chaussure boueuse comme si vous l'aviez fournie. Voici ma déduction... |
    
</section>

    <section title="Exemple : Maintenir le personnage avec rôle prompting">

    | Rôle | Contenu |
    | ---- | ------- |
    | Utilisateur (50 tours de conversation avec Claude « Sherlock Holmes ») | Que déduisez-vous du propriétaire de cette chaussure ? <br/>\<image>muddy_shoe.jpg\</image> |
    | Assistant (préremplissage) | [Sherlock Holmes] |
    | Assistant (réponse de Claude) | Ah, qu'avons-nous ici ? Un spécimen des plus curieux, Watson ! Examinons cette chaussure avec un œil discernant. La boue, voyez-vous, n'est pas l'argile commune de Londres, mais plutôt la teinte rougeâtre distinctive du sol riche en fer que l'on ne trouve que dans les environs de Hampstead Heath. Et pourtant, l'usure de la semelle suggère une démarche plus adaptée aux pavés de Whitechapel qu'aux pentes douces de la Heath.<br/><br/>Maintenant, observez les lacets ! Ils sont noués avec un nœud particulier favori de ceux de la profession médicale—sans doute une habitude acquise au cours d'années à nouer des blouses chirurgicales. Mais les marques d'usure sur la boîte à orteils racontent une histoire différente : elles sont cohérentes avec le mouvement de coup de pied que l'on pourrait employer dans les arts martiaux, spécifiquement le Baritsu.<br/><br/>Nous pouvons conclure, alors, que notre propriétaire de chaussure absent est un médecin, peut-être un chirurgien, qui réside à Whitechapel mais fréquente Hampstead Heath—peut-être pour une pratique secrète du Baritsu, loin des regards indiscrets. Une affaire des plus intrigantes, Watson ! Nous devons nous dépêcher ; le jeu est lancé ! |
    
</section>

---

<CardGroup cols={3}>
  <Card title="Travailler avec les Messages" icon="messages" href="/docs/fr/build-with-claude/working-with-messages">
    Voir plus d'exemples de préremplissage et d'autres modèles d'API Messages.
  </Card>
  <Card title="Bibliothèque de prompts" icon="link" href="/docs/fr/resources/prompt-library/library">
    Inspirez-vous d'une sélection organisée de prompts pour diverses tâches et cas d'usage.
  </Card>
  <Card title="Tutoriel de prompting GitHub" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    Un tutoriel rempli d'exemples qui couvre les concepts d'ingénierie des prompts trouvés dans notre documentation.
  </Card>
  <Card title="Tutoriel de prompting Google Sheets" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    Une version plus légère de notre tutoriel d'ingénierie des prompts via une feuille de calcul interactive.
  </Card>
</CardGroup>