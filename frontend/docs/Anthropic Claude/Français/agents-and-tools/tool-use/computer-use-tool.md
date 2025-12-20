# Outil de contrôle informatique

Claude peut interagir avec des environnements informatiques grâce à l'outil de contrôle informatique, qui offre des capacités de capture d'écran et un contrôle souris/clavier pour l'interaction autonome du bureau.

---

Claude peut interagir avec des environnements informatiques grâce à l'outil de contrôle informatique, qui offre des capacités de capture d'écran et un contrôle souris/clavier pour l'interaction autonome du bureau.

<Note>
Le contrôle informatique est actuellement en version bêta et nécessite un [en-tête bêta](/docs/fr/api/beta-headers) :
- `"computer-use-2025-11-24"` pour Claude Opus 4.5
- `"computer-use-2025-01-24"` pour Claude Sonnet 4.5, Haiku 4.5, Opus 4.1, Sonnet 4, Opus 4, et Sonnet 3.7 ([déprécié](/docs/fr/about-claude/model-deprecations))
</Note>

## Aperçu

Le contrôle informatique est une fonctionnalité bêta qui permet à Claude d'interagir avec des environnements de bureau. Cet outil offre :

- **Capture d'écran** : Voir ce qui s'affiche actuellement à l'écran
- **Contrôle de la souris** : Cliquer, faire glisser et déplacer le curseur
- **Entrée au clavier** : Taper du texte et utiliser les raccourcis clavier
- **Automatisation du bureau** : Interagir avec n'importe quelle application ou interface

Bien que le contrôle informatique puisse être augmenté avec d'autres outils comme bash et l'éditeur de texte pour des flux de travail d'automatisation plus complets, le contrôle informatique fait spécifiquement référence à la capacité de l'outil de contrôle informatique à voir et contrôler les environnements de bureau.

## Compatibilité des modèles

Le contrôle informatique est disponible pour les modèles Claude suivants :

| Modèle | Version de l'outil | Drapeau bêta |
|--------|-------------------|--------------|
| Claude Opus 4.5 | `computer_20251124` | `computer-use-2025-11-24` |
| Tous les autres modèles supportés | `computer_20250124` | `computer-use-2025-01-24` |

<Note>
Claude Opus 4.5 introduit la version d'outil `computer_20251124` avec de nouvelles capacités incluant l'action de zoom pour l'inspection détaillée des régions d'écran. Tous les autres modèles (Sonnet 4.5, Haiku 4.5, Sonnet 4, Opus 4, Opus 4.1, et Sonnet 3.7) utilisent la version d'outil `computer_20250124`.
</Note>

<Warning>
Les versions d'outil plus anciennes ne sont pas garanties d'être rétro-compatibles avec les modèles plus récents. Utilisez toujours la version d'outil qui correspond à votre version de modèle.
</Warning>

## Considérations de sécurité

<Warning>
Le contrôle informatique est une fonctionnalité bêta avec des risques uniques distincts des fonctionnalités API standard. Ces risques sont amplifiés lors de l'interaction avec Internet. Pour minimiser les risques, envisagez de prendre des précautions telles que :

1. Utilisez une machine virtuelle ou un conteneur dédié avec des privilèges minimaux pour prévenir les attaques système directes ou les accidents.
2. Évitez de donner au modèle accès à des données sensibles, telles que les informations de connexion de compte, pour prévenir le vol d'informations.
3. Limitez l'accès à Internet à une liste blanche de domaines pour réduire l'exposition au contenu malveillant.
4. Demandez à un humain de confirmer les décisions qui pourraient avoir des conséquences réelles significatives ainsi que toute tâche nécessitant un consentement affirmatif, comme accepter les cookies, exécuter des transactions financières ou accepter les conditions de service.

Dans certaines circonstances, Claude suivra les commandes trouvées dans le contenu même si cela entre en conflit avec les instructions de l'utilisateur. Par exemple, les instructions Claude sur les pages Web ou contenues dans les images peuvent remplacer les instructions ou amener Claude à faire des erreurs. Nous suggérons de prendre des précautions pour isoler Claude des données sensibles et des actions pour éviter les risques liés à l'injection de prompt.

Nous avons entraîné le modèle à résister à ces injections de prompt et avons ajouté une couche de défense supplémentaire. Si vous utilisez nos outils de contrôle informatique, nous exécuterons automatiquement des classificateurs sur vos prompts pour signaler les instances potentielles d'injections de prompt. Lorsque ces classificateurs identifient des injections de prompt potentielles dans les captures d'écran, ils orienteront automatiquement le modèle à demander la confirmation de l'utilisateur avant de procéder à l'action suivante. Nous reconnaissons que cette protection supplémentaire ne sera pas idéale pour tous les cas d'usage (par exemple, les cas d'usage sans humain dans la boucle), donc si vous souhaitez vous désabonner et l'désactiver, veuillez [nous contacter](https://support.claude.com/en/).

Nous suggérons toujours de prendre des précautions pour isoler Claude des données sensibles et des actions pour éviter les risques liés à l'injection de prompt.

Enfin, veuillez informer les utilisateurs finaux des risques pertinents et obtenir leur consentement avant d'activer le contrôle informatique dans vos propres produits.

</Warning>

<Card
  title="Implémentation de référence du contrôle informatique"
  icon="computer"
  href="https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo"
>

Commencez rapidement avec notre implémentation de référence du contrôle informatique qui inclut une interface Web, un conteneur Docker, des implémentations d'outils d'exemple et une boucle d'agent.

**Remarque :** L'implémentation a été mise à jour pour inclure de nouveaux outils pour les modèles Claude 4 et Claude Sonnet 3.7. Assurez-vous de récupérer la dernière version du dépôt pour accéder à ces nouvelles fonctionnalités.

</Card>

<Tip>
  Veuillez utiliser [ce formulaire](https://forms.gle/BT1hpBrqDPDUrCqo7) pour fournir
  des commentaires sur la qualité des réponses du modèle, l'API elle-même, ou la qualité
  de la documentation - nous avons hâte de vous entendre !
</Tip>

## Démarrage rapide

Voici comment commencer avec le contrôle informatique :

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",  # ou un autre modèle compatible
    max_tokens=1024,
    tools=[
        {
          "type": "computer_20250124",
          "name": "computer",
          "display_width_px": 1024,
          "display_height_px": 768,
          "display_number": 1,
        },
        {
          "type": "text_editor_20250728",
          "name": "str_replace_based_edit_tool"
        },
        {
          "type": "bash_20250124",
          "name": "bash"
        }
    ],
    messages=[{"role": "user", "content": "Save a picture of a cat to my desktop."}],
    betas=["computer-use-2025-01-24"]
)
print(response)
```

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: computer-use-2025-01-24" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "tools": [
      {
        "type": "computer_20250124",
        "name": "computer",
        "display_width_px": 1024,
        "display_height_px": 768,
        "display_number": 1
      },
      {
        "type": "text_editor_20250728",
        "name": "str_replace_based_edit_tool"
      },
      {
        "type": "bash_20250124",
        "name": "bash"
      }
    ],
    "messages": [
      {
        "role": "user",
        "content": "Save a picture of a cat to my desktop."
      }
    ]
  }'
```
</CodeGroup>

<Note>
Un en-tête bêta n'est requis que pour l'outil de contrôle informatique.

L'exemple ci-dessus montre les trois outils utilisés ensemble, ce qui nécessite l'en-tête bêta car il inclut l'outil de contrôle informatique.
</Note>

---

## Comment fonctionne le contrôle informatique

<Steps>
  <Step
    title="1. Fournir à Claude l'outil de contrôle informatique et une invite utilisateur"
    icon="tool"
  >
    - Ajoutez l'outil de contrôle informatique (et éventuellement d'autres outils) à votre demande API.
    - Incluez une invite utilisateur qui nécessite une interaction de bureau, par exemple, « Enregistrez une image d'un chat sur mon bureau. »
  </Step>
  <Step title="2. Claude décide d'utiliser l'outil de contrôle informatique" icon="wrench">
    - Claude évalue si l'outil de contrôle informatique peut aider avec la requête de l'utilisateur.
    - Si oui, Claude construit une demande d'utilisation d'outil correctement formatée.
    - La réponse API a un `stop_reason` de `tool_use`, signalant l'intention de Claude.
  </Step>
  <Step
    title="3. Extraire l'entrée de l'outil, évaluer l'outil sur un ordinateur et retourner les résultats"
    icon="computer"
  >
    - De votre côté, extrayez le nom et l'entrée de l'outil de la demande de Claude.
    - Utilisez l'outil sur un conteneur ou une machine virtuelle.
    - Continuez la conversation avec un nouveau message `user` contenant un bloc de contenu `tool_result`.
  </Step>
  <Step
    title="4. Claude continue à appeler les outils de contrôle informatique jusqu'à ce qu'il ait terminé la tâche"
    icon="arrows-clockwise"
  >
    - Claude analyse les résultats de l'outil pour déterminer si plus d'utilisation d'outil est nécessaire ou si la tâche a été complétée.
    - Si Claude décide qu'il a besoin d'un autre outil, il répond avec un autre `stop_reason` de `tool_use` et vous devriez revenir à l'étape 3.
    - Sinon, il formule une réponse textuelle à l'utilisateur.
  </Step>
</Steps>

Nous nous référons à la répétition des étapes 3 et 4 sans entrée utilisateur comme la « boucle d'agent » - c'est-à-dire Claude répondant avec une demande d'utilisation d'outil et votre application répondant à Claude avec les résultats de l'évaluation de cette demande.

### L'environnement informatique

Le contrôle informatique nécessite un environnement informatique en bac à sable où Claude peut interagir en toute sécurité avec les applications et le Web. Cet environnement comprend :

1. **Affichage virtuel** : Un serveur d'affichage X11 virtuel (utilisant Xvfb) qui rend l'interface de bureau que Claude verra via des captures d'écran et contrôlera avec des actions souris/clavier.

2. **Environnement de bureau** : Une interface utilisateur légère avec gestionnaire de fenêtres (Mutter) et panneau (Tint2) s'exécutant sur Linux, qui fournit une interface graphique cohérente pour que Claude interagisse.

3. **Applications** : Applications Linux pré-installées comme Firefox, LibreOffice, éditeurs de texte et gestionnaires de fichiers que Claude peut utiliser pour accomplir les tâches.

4. **Implémentations d'outils** : Code d'intégration qui traduit les demandes d'outils abstraits de Claude (comme « déplacer la souris » ou « prendre une capture d'écran ») en opérations réelles dans l'environnement virtuel.

5. **Boucle d'agent** : Un programme qui gère la communication entre Claude et l'environnement, envoyant les actions de Claude à l'environnement et retournant les résultats (captures d'écran, sorties de commande) à Claude.

Lorsque vous utilisez le contrôle informatique, Claude ne se connecte pas directement à cet environnement. Au lieu de cela, votre application :

1. Reçoit les demandes d'utilisation d'outil de Claude
2. Les traduit en actions dans votre environnement informatique
3. Capture les résultats (captures d'écran, sorties de commande, etc.)
4. Retourne ces résultats à Claude

Pour la sécurité et l'isolation, l'implémentation de référence exécute tout cela dans un conteneur Docker avec des mappages de port appropriés pour visualiser et interagir avec l'environnement.

---

## Comment implémenter le contrôle informatique

### Commencez par notre implémentation de référence

Nous avons construit une [implémentation de référence](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo) qui inclut tout ce dont vous avez besoin pour commencer rapidement avec le contrôle informatique :

- Un [environnement conteneurisé](https://github.com/anthropics/anthropic-quickstarts/blob/main/computer-use-demo/Dockerfile) adapté au contrôle informatique avec Claude
- Implémentations des [outils de contrôle informatique](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo/computer_use_demo/tools)
- Une [boucle d'agent](https://github.com/anthropics/anthropic-quickstarts/blob/main/computer-use-demo/computer_use_demo/loop.py) qui interagit avec l'API Claude et exécute les outils de contrôle informatique
- Une interface Web pour interagir avec le conteneur, la boucle d'agent et les outils.

### Comprendre la boucle multi-agent

Le cœur du contrôle informatique est la « boucle d'agent » - un cycle où Claude demande des actions d'outil, votre application les exécute et retourne les résultats à Claude. Voici un exemple simplifié :

```python
async def sampling_loop(
    *,
    model: str,
    messages: list[dict],
    api_key: str,
    max_tokens: int = 4096,
    tool_version: str,
    thinking_budget: int | None = None,
    max_iterations: int = 10,  # Ajouter une limite d'itération pour prévenir les boucles infinies
):
    """
    Une boucle d'agent simple pour les interactions de contrôle informatique Claude.

    Cette fonction gère l'aller-retour entre :
    1. Envoyer des messages utilisateur à Claude
    2. Claude demandant d'utiliser des outils
    3. Votre application exécutant ces outils
    4. Envoi des résultats de l'outil à Claude
    """
    # Configurer les outils et les paramètres API
    client = Anthropic(api_key=api_key)
    beta_flag = "computer-use-2025-01-24" if "20250124" in tool_version else "computer-use-2024-10-22"

    # Configurer les outils - vous devriez déjà les avoir initialisés ailleurs
    tools = [
        {"type": f"computer_{tool_version}", "name": "computer", "display_width_px": 1024, "display_height_px": 768},
        {"type": f"text_editor_{tool_version}", "name": "str_replace_editor"},
        {"type": f"bash_{tool_version}", "name": "bash"}
    ]

    # Boucle d'agent principale (avec limite d'itération pour prévenir les coûts API incontrôlés)
    iterations = 0
    while True and iterations < max_iterations:
        iterations += 1
        # Configurer le paramètre de réflexion optionnel (pour Claude Sonnet 3.7)
        thinking = None
        if thinking_budget:
            thinking = {"type": "enabled", "budget_tokens": thinking_budget}

        # Appeler l'API Claude
        response = client.beta.messages.create(
            model=model,
            max_tokens=max_tokens,
            messages=messages,
            tools=tools,
            betas=[beta_flag],
            thinking=thinking
        )

        # Ajouter la réponse de Claude à l'historique de conversation
        response_content = response.content
        messages.append({"role": "assistant", "content": response_content})

        # Vérifier si Claude a utilisé des outils
        tool_results = []
        for block in response_content:
            if block.type == "tool_use":
                # Dans une application réelle, vous exécuteriez l'outil ici
                # Par exemple : result = run_tool(block.name, block.input)
                result = {"result": "Tool executed successfully"}

                # Formater le résultat pour Claude
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": result
                })

        # Si aucun outil n'a été utilisé, Claude a terminé - retourner les messages finaux
        if not tool_results:
            return messages

        # Ajouter les résultats de l'outil aux messages pour la prochaine itération avec Claude
        messages.append({"role": "user", "content": tool_results})
```

La boucle continue jusqu'à ce que Claude réponde sans demander d'outils (achèvement de la tâche) ou que la limite d'itération maximale soit atteinte. Cette protection empêche les boucles infinies potentielles qui pourraient entraîner des coûts API inattendus.

Nous recommandons d'essayer l'implémentation de référence avant de lire le reste de cette documentation.

### Optimiser les performances du modèle avec les invites

Voici quelques conseils sur comment obtenir les meilleures sorties de qualité :

1. Spécifiez des tâches simples et bien définies et fournissez des instructions explicites pour chaque étape.
2. Claude suppose parfois les résultats de ses actions sans vérifier explicitement leurs résultats. Pour éviter cela, vous pouvez inviter Claude avec `Après chaque étape, prenez une capture d'écran et évaluez soigneusement si vous avez atteint le résultat souhaité. Montrez explicitement votre réflexion : « J'ai évalué l'étape X... » Si ce n'est pas correct, réessayez. Ce n'est que lorsque vous confirmez qu'une étape a été exécutée correctement que vous devez passer à la suivante.`
3. Certains éléments d'interface utilisateur (comme les listes déroulantes et les barres de défilement) pourraient être délicats pour Claude à manipuler en utilisant les mouvements de la souris. Si vous rencontrez cela, essayez d'inviter le modèle à utiliser les raccourcis clavier.
4. Pour les tâches répétables ou les interactions d'interface utilisateur, incluez des captures d'écran d'exemple et des appels d'outil de résultats réussis dans votre invite.
5. Si vous avez besoin que le modèle se connecte, fournissez-lui le nom d'utilisateur et le mot de passe dans votre invite à l'intérieur de balises xml comme `<robot_credentials>`. L'utilisation du contrôle informatique dans les applications qui nécessitent une connexion augmente le risque de mauvais résultats en raison de l'injection de prompt. Veuillez consulter notre [guide sur l'atténuation des injections de prompt](/docs/fr/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks) avant de fournir au modèle les identifiants de connexion.

<Tip>
  Si vous rencontrez à plusieurs reprises un ensemble clair de problèmes ou si vous connaissez à l'avance les tâches
  que Claude devra accomplir, utilisez l'invite système pour fournir à Claude des conseils explicites ou des instructions
  sur comment accomplir les tâches avec succès.
</Tip>

### Invites système

Lorsqu'un des outils définis par Anthropic est demandé via l'API Claude, une invite système spécifique au contrôle informatique est générée. Elle est similaire à l'[invite système d'utilisation d'outil](/docs/fr/agents-and-tools/tool-use/implement-tool-use#tool-use-system-prompt) mais commence par :

> Vous avez accès à un ensemble de fonctions que vous pouvez utiliser pour répondre à la question de l'utilisateur. Cela inclut l'accès à un environnement informatique en bac à sable. Vous n'avez actuellement pas la capacité d'inspecter les fichiers ou d'interagir avec les ressources externes, sauf en invoquant les fonctions ci-dessous.

Comme pour l'utilisation régulière d'outils, le champ `system_prompt` fourni par l'utilisateur est toujours respecté et utilisé dans la construction de l'invite système combinée.

### Actions disponibles

L'outil de contrôle informatique supporte ces actions :

**Actions de base (toutes les versions)**
- **screenshot** - Capturer l'affichage actuel
- **left_click** - Cliquer aux coordonnées `[x, y]`
- **type** - Taper une chaîne de texte
- **key** - Appuyer sur une touche ou une combinaison de touches (par exemple, « ctrl+s »)
- **mouse_move** - Déplacer le curseur aux coordonnées

**Actions améliorées (`computer_20250124`)**
Disponible dans les modèles Claude 4 et Claude Sonnet 3.7 :
- **scroll** - Faire défiler dans n'importe quelle direction avec contrôle de la quantité
- **left_click_drag** - Cliquer et faire glisser entre les coordonnées
- **right_click**, **middle_click** - Boutons de souris supplémentaires
- **double_click**, **triple_click** - Clics multiples
- **left_mouse_down**, **left_mouse_up** - Contrôle fin des clics
- **hold_key** - Maintenir une touche enfoncée tout en effectuant d'autres actions
- **wait** - Pause entre les actions

**Actions améliorées (`computer_20251124`)**
Disponible dans Claude Opus 4.5 :
- Toutes les actions de `computer_20250124`
- **zoom** - Afficher une région spécifique de l'écran à pleine résolution. Nécessite `enable_zoom: true` dans la définition de l'outil. Prend un paramètre `region` avec les coordonnées `[x1, y1, x2, y2]` définissant les coins supérieur gauche et inférieur droit de la zone à inspecter.

<section title="Exemples d'actions">

```json
// Prendre une capture d'écran
{
  "action": "screenshot"
}

// Cliquer à une position
{
  "action": "left_click",
  "coordinate": [500, 300]
}

// Taper du texte
{
  "action": "type",
  "text": "Hello, world!"
}

// Faire défiler vers le bas (Claude 4/3.7)
{
  "action": "scroll",
  "coordinate": [500, 400],
  "scroll_direction": "down",
  "scroll_amount": 3
}

// Zoomer pour afficher la région en détail (Opus 4.5)
{
  "action": "zoom",
  "region": [100, 200, 400, 350]
}
```

</section>

### Paramètres de l'outil

| Paramètre | Requis | Description |
|-----------|--------|-------------|
| `type` | Oui | Version de l'outil (`computer_20251124`, `computer_20250124`, ou `computer_20241022`) |
| `name` | Oui | Doit être « computer » |
| `display_width_px` | Oui | Largeur d'affichage en pixels |
| `display_height_px` | Oui | Hauteur d'affichage en pixels |
| `display_number` | Non | Numéro d'affichage pour les environnements X11 |
| `enable_zoom` | Non | Activer l'action de zoom (`computer_20251124` uniquement). Définir à `true` pour permettre à Claude de zoomer dans des régions d'écran spécifiques. Par défaut : `false` |

<Note>
**Important** : L'outil de contrôle informatique doit être explicitement exécuté par votre application - Claude ne peut pas l'exécuter directement. Vous êtes responsable de l'implémentation de la capture d'écran, des mouvements de souris, des entrées au clavier et d'autres actions en fonction des demandes de Claude.
</Note>

### Activer la capacité de réflexion dans les modèles Claude 4 et Claude Sonnet 3.7

Claude Sonnet 3.7 a introduit une nouvelle capacité de « réflexion » qui vous permet de voir le processus de raisonnement du modèle au fur et à mesure qu'il travaille sur des tâches complexes. Cette fonctionnalité vous aide à comprendre comment Claude aborde un problème et peut être particulièrement précieuse pour le débogage ou à des fins éducatives.

Pour activer la réflexion, ajoutez un paramètre `thinking` à votre demande API :

```json
"thinking": {
  "type": "enabled",
  "budget_tokens": 1024
}
```

Le paramètre `budget_tokens` spécifie combien de jetons Claude peut utiliser pour la réflexion. Ceci est soustrait de votre budget `max_tokens` global.

Lorsque la réflexion est activée, Claude retournera son processus de raisonnement dans le cadre de la réponse, ce qui peut vous aider à :

1. Comprendre le processus de prise de décision du modèle
2. Identifier les problèmes potentiels ou les idées fausses
3. Apprendre de l'approche de Claude à la résolution de problèmes
4. Obtenir plus de visibilité sur les opérations complexes multi-étapes

Voici un exemple de ce que la sortie de réflexion pourrait ressembler :

```
[Réflexion]
Je dois enregistrer une image d'un chat sur le bureau. Décomposons cela en étapes :

1. D'abord, je vais prendre une capture d'écran pour voir ce qui se trouve sur le bureau
2. Ensuite, je vais chercher un navigateur Web pour rechercher des images de chat
3. Après avoir trouvé une image appropriée, je devrai l'enregistrer sur le bureau

Commençons par prendre une capture d'écran pour voir ce qui est disponible...
```

### Augmenter le contrôle informatique avec d'autres outils

L'outil de contrôle informatique peut être combiné avec d'autres outils pour créer des flux de travail d'automatisation plus puissants. Ceci est particulièrement utile lorsque vous avez besoin de :
- Exécuter des commandes système ([outil bash](/docs/fr/agents-and-tools/tool-use/bash-tool))
- Éditer des fichiers de configuration ou des scripts ([outil éditeur de texte](/docs/fr/agents-and-tools/tool-use/text-editor-tool))
- Intégrer avec des API personnalisées ou des services (outils personnalisés)

<CodeGroup>
  ```bash Shell
  curl https://api.anthropic.com/v1/messages \
    -H "content-type: application/json" \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "anthropic-beta: computer-use-2025-01-24" \
    -d '{
      "model": "claude-sonnet-4-5",
      "max_tokens": 2000,
      "tools": [
        {
          "type": "computer_20250124",
          "name": "computer",
          "display_width_px": 1024,
          "display_height_px": 768,
          "display_number": 1
        },
        {
          "type": "text_editor_20250728",
          "name": "str_replace_based_edit_tool"
        },
        {
          "type": "bash_20250124",
          "name": "bash"
        },
        {
          "name": "get_weather",
          "description": "Get the current weather in a given location",
          "input_schema": {
            "type": "object",
            "properties": {
              "location": {
                "type": "string",
                "description": "The city and state, e.g. San Francisco, CA"
              },
              "unit": {
                "type": "string",
                "enum": ["celsius", "fahrenheit"],
                "description": "The unit of temperature, either 'celsius' or 'fahrenheit'"
              }
            },
            "required": ["location"]
          }
        }
      ],
      "messages": [
        {
          "role": "user",
          "content": "Find flights from San Francisco to a place with warmer weather."
        }
      ],
      "thinking": {
        "type": "enabled",
        "budget_tokens": 1024
      }
    }'
  ```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[
        {
          "type": "computer_20250124",
          "name": "computer",
          "display_width_px": 1024,
          "display_height_px": 768,
          "display_number": 1,
        },
        {
          "type": "text_editor_20250728",
          "name": "str_replace_based_edit_tool"
        },
        {
          "type": "bash_20250124",
          "name": "bash"
        },
        {
          "name": "get_weather",
          "description": "Get the current weather in a given location",
          "input_schema": {
            "type": "object",
            "properties": {
              "location": {
                "type": "string",
                "description": "The city and state, e.g. San Francisco, CA"
              },
              "unit": {
                "type": "string",
                "enum": ["celsius", "fahrenheit"],
                "description": "The unit of temperature, either 'celsius' or 'fahrenheit'"
              }
            },
            "required": ["location"]
          }
        },
    ],
    messages=[{"role": "user", "content": "Find flights from San Francisco to a place with warmer weather."}],
    betas=["computer-use-2025-01-24"],
    thinking={"type": "enabled", "budget_tokens": 1024},
)
print(response)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const message = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: [
      {
        type: "computer_20250124",
        name: "computer",
        display_width_px: 1024,
        display_height_px: 768,
        display_number: 1,
      },
      {
        type: "text_editor_20250728",
        name: "str_replace_based_edit_tool"
      },
      {
        type: "bash_20250124",
        name: "bash"
      },
      {
        name: "get_weather",
        description: "Get the current weather in a given location",
        input_schema: {
          type: "object",
          properties: {
            location: {
              type: "string",
              description: "The city and state, e.g. San Francisco, CA"
            },
            unit: {
              type: "string",
              enum: ["celsius", "fahrenheit"],
              description: "The unit of temperature, either 'celsius' or 'fahrenheit'"
            }
          },
          required: ["location"]
        }
      },
  ],
  messages: [{ role: "user", content: "Find flights from San Francisco to a place with warmer weather." }],
  betas: ["computer-use-2025-01-24"],
  thinking: { type: "enabled", budget_tokens: 1024 },
});
console.log(message);
```
```java Java
import java.util.List;
import java.util.Map;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.JsonValue;
import com.anthropic.models.beta.messages.BetaMessage;
import com.anthropic.models.beta.messages.MessageCreateParams;
import com.anthropic.models.beta.messages.BetaToolBash20250124;
import com.anthropic.models.beta.messages.BetaToolComputerUse20250124;
import com.anthropic.models.beta.messages.BetaToolTextEditor20250124;
import com.anthropic.models.beta.messages.BetaThinkingConfigEnabled;
import com.anthropic.models.beta.messages.BetaThinkingConfigParam;
import com.anthropic.models.beta.messages.BetaTool;

public class MultipleToolsExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        MessageCreateParams params = MessageCreateParams.builder()
                .model("claude-sonnet-4-5")
                .maxTokens(1024)
                .addTool(BetaToolComputerUse20250124.builder()
                        .displayWidthPx(1024)
                        .displayHeightPx(768)
                        .displayNumber(1)
                        .build())
                .addTool(BetaToolTextEditor20250124.builder()
                        .build())
                .addTool(BetaToolBash20250124.builder()
                        .build())
                .addTool(BetaTool.builder()
                        .name("get_weather")
                        .description("Get the current weather in a given location")
                        .inputSchema(BetaTool.InputSchema.builder()
                                .properties(
                                        JsonValue.from(
                                                Map.of(
                                                        "location", Map.of(
                                                                "type", "string",
                                                                "description", "The city and state, e.g. San Francisco, CA"
                                                        ),
                                                        "unit", Map.of(
                                                                "type", "string",
                                                                "enum", List.of("celsius", "fahrenheit"),
                                                                "description", "The unit of temperature, either 'celsius' or 'fahrenheit'"
                                                        )
                                                )
                                        ))
                                .build()
                        )
                        .build())
                .thinking(BetaThinkingConfigParam.ofEnabled(
                        BetaThinkingConfigEnabled.builder()
                                .budgetTokens(1024)
                                .build()
                ))
                .addUserMessage("Find flights from San Francisco to a place with warmer weather.")
                .addBeta("computer-use-2025-01-24")
                .build();

        BetaMessage message = client.beta().messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>

### Créer un environnement informatique personnalisé

L'[implémentation de référence](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo) est conçue pour vous aider à démarrer avec l'utilisation informatique. Elle inclut tous les composants nécessaires pour que Claude utilise un ordinateur. Cependant, vous pouvez créer votre propre environnement pour l'utilisation informatique selon vos besoins. Vous aurez besoin de :

- Un environnement virtualisé ou conteneurisé adapté à l'utilisation informatique avec Claude
- Une implémentation d'au moins l'un des outils d'utilisation informatique définis par Anthropic
- Une boucle d'agent qui interagit avec l'API Claude et exécute les résultats `tool_use` en utilisant vos implémentations d'outils
- Une API ou une interface utilisateur qui permet l'entrée de l'utilisateur pour démarrer la boucle d'agent

#### Implémenter l'outil d'utilisation informatique

L'outil d'utilisation informatique est implémenté en tant qu'outil sans schéma. Lors de l'utilisation de cet outil, vous n'avez pas besoin de fournir un schéma d'entrée comme avec d'autres outils ; le schéma est intégré au modèle Claude et ne peut pas être modifié.

<Steps>
  <Step title="Configurer votre environnement informatique">
    Créez un affichage virtuel ou connectez-vous à un affichage existant avec lequel Claude interagira. Cela implique généralement de configurer Xvfb (X Virtual Framebuffer) ou une technologie similaire.
  </Step>
  <Step title="Implémenter les gestionnaires d'actions">
    Créez des fonctions pour gérer chaque type d'action que Claude pourrait demander :
    ```python
    def handle_computer_action(action_type, params):
        if action_type == "screenshot":
            return capture_screenshot()
        elif action_type == "left_click":
            x, y = params["coordinate"]
            return click_at(x, y)
        elif action_type == "type":
            return type_text(params["text"])
        # ... handle other actions
    ```
  </Step>
  <Step title="Traiter les appels d'outils de Claude">
    Extrayez et exécutez les appels d'outils des réponses de Claude :
    ```python
    for content in response.content:
        if content.type == "tool_use":
            action = content.input["action"]
            result = handle_computer_action(action, content.input)
            
            # Return result to Claude
            tool_result = {
                "type": "tool_result",
                "tool_use_id": content.id,
                "content": result
            }
    ```
  </Step>
  <Step title="Implémenter la boucle d'agent">
    Créez une boucle qui continue jusqu'à ce que Claude termine la tâche :
    ```python
    while True:
        response = client.beta.messages.create(...)
        
        # Check if Claude used any tools
        tool_results = process_tool_calls(response)
        
        if not tool_results:
            # No more tool use, task complete
            break
            
        # Continue conversation with tool results
        messages.append({"role": "user", "content": tool_results})
    ```
  </Step>
</Steps>

#### Gérer les erreurs

Lors de l'implémentation de l'outil d'utilisation informatique, diverses erreurs peuvent survenir. Voici comment les gérer :

<section title="Échec de la capture d'écran">

Si la capture d'écran échoue, renvoyez un message d'erreur approprié :

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Error: Failed to capture screenshot. Display may be locked or unavailable.",
      "is_error": true
    }
  ]
}
```

</section>

<section title="Coordonnées invalides">

Si Claude fournit des coordonnées en dehors des limites de l'affichage :

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Error: Coordinates (1200, 900) are outside display bounds (1024x768).",
      "is_error": true
    }
  ]
}
```

</section>

<section title="Échec de l'exécution de l'action">

Si une action échoue à s'exécuter :

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Error: Failed to perform click action. The application may be unresponsive.",
      "is_error": true
    }
  ]
}
```

</section>

#### Gérer la mise à l'échelle des coordonnées pour les résolutions plus élevées

L'API limite les images à un maximum de 1568 pixels sur le bord le plus long et environ 1,15 mégapixels au total (voir [redimensionnement d'image](/docs/fr/build-with-claude/vision#evaluate-image-size) pour plus de détails). Par exemple, un écran 1512x982 est réduit à environ 1330x864. Claude analyse cette image plus petite et renvoie les coordonnées dans cet espace, mais votre outil exécute les clics dans l'espace d'écran d'origine.

Cela peut faire que les coordonnées de clic de Claude manquent leurs cibles à moins que vous ne gériez la transformation de coordonnées.

Pour corriger cela, redimensionnez vous-même les captures d'écran et augmentez les coordonnées de Claude :

<CodeGroup>
```python Python
import math

def get_scale_factor(width, height):
    """Calculate scale factor to meet API constraints."""
    long_edge = max(width, height)
    total_pixels = width * height

    long_edge_scale = 1568 / long_edge
    total_pixels_scale = math.sqrt(1_150_000 / total_pixels)

    return min(1.0, long_edge_scale, total_pixels_scale)

# When capturing screenshot
scale = get_scale_factor(screen_width, screen_height)
scaled_width = int(screen_width * scale)
scaled_height = int(screen_height * scale)

# Resize image to scaled dimensions before sending to Claude
screenshot = capture_and_resize(scaled_width, scaled_height)

# When handling Claude's coordinates, scale them back up
def execute_click(x, y):
    screen_x = x / scale
    screen_y = y / scale
    perform_click(screen_x, screen_y)
```

```typescript TypeScript
const MAX_LONG_EDGE = 1568;
const MAX_PIXELS = 1_150_000;

function getScaleFactor(width: number, height: number): number {
  const longEdge = Math.max(width, height);
  const totalPixels = width * height;

  const longEdgeScale = MAX_LONG_EDGE / longEdge;
  const totalPixelsScale = Math.sqrt(MAX_PIXELS / totalPixels);

  return Math.min(1.0, longEdgeScale, totalPixelsScale);
}

// When capturing screenshot
const scale = getScaleFactor(screenWidth, screenHeight);
const scaledWidth = Math.floor(screenWidth * scale);
const scaledHeight = Math.floor(screenHeight * scale);

// Resize image to scaled dimensions before sending to Claude
const screenshot = captureAndResize(scaledWidth, scaledHeight);

// When handling Claude's coordinates, scale them back up
function executeClick(x: number, y: number): void {
  const screenX = x / scale;
  const screenY = y / scale;
  performClick(screenX, screenY);
}
```
</CodeGroup>

#### Suivre les meilleures pratiques d'implémentation

<section title="Utiliser une résolution d'affichage appropriée">

Définissez les dimensions d'affichage qui correspondent à votre cas d'utilisation tout en restant dans les limites recommandées :
- Pour les tâches générales de bureau : 1024x768 ou 1280x720
- Pour les applications web : 1280x800 ou 1366x768
- Évitez les résolutions supérieures à 1920x1080 pour éviter les problèmes de performance

</section>

<section title="Implémenter une gestion appropriée des captures d'écran">

Lors du renvoi de captures d'écran à Claude :
- Encodez les captures d'écran en PNG ou JPEG base64
- Envisagez de compresser les grandes captures d'écran pour améliorer les performances
- Incluez les métadonnées pertinentes telles que l'horodatage ou l'état de l'affichage
- Si vous utilisez des résolutions plus élevées, assurez-vous que les coordonnées sont correctement mises à l'échelle

</section>

<section title="Ajouter des délais d'action">

Certaines applications ont besoin de temps pour répondre aux actions :
```python
def click_and_wait(x, y, wait_time=0.5):
    click_at(x, y)
    time.sleep(wait_time)  # Allow UI to update
```

</section>

<section title="Valider les actions avant l'exécution">

Vérifiez que les actions demandées sont sûres et valides :
```python
def validate_action(action_type, params):
    if action_type == "left_click":
        x, y = params.get("coordinate", (0, 0))
        if not (0 <= x < display_width and 0 <= y < display_height):
            return False, "Coordinates out of bounds"
    return True, None
```

</section>

<section title="Enregistrer les actions pour le débogage">

Conservez un journal de toutes les actions pour le dépannage :
```python
import logging

def log_action(action_type, params, result):
    logging.info(f"Action: {action_type}, Params: {params}, Result: {result}")
```

</section>

---

## Comprendre les limitations de l'utilisation informatique

La fonctionnalité d'utilisation informatique est en version bêta. Bien que les capacités de Claude soient à la pointe de la technologie, les développeurs doivent être conscients de ses limitations :

1. **Latence** : la latence actuelle de l'utilisation informatique pour les interactions humain-IA peut être trop lente par rapport aux actions informatiques régulières dirigées par l'homme. Nous recommandons de nous concentrer sur les cas d'utilisation où la vitesse n'est pas critique (par exemple, la collecte d'informations en arrière-plan, les tests de logiciels automatisés) dans des environnements de confiance.
2. **Précision et fiabilité de la vision par ordinateur** : Claude peut faire des erreurs ou halluciner lors de la sortie de coordonnées spécifiques lors de la génération d'actions. Claude Sonnet 3.7 introduit la capacité de réflexion qui peut vous aider à comprendre le raisonnement du modèle et à identifier les problèmes potentiels.
3. **Précision et fiabilité de la sélection d'outils** : Claude peut faire des erreurs ou halluciner lors de la sélection d'outils lors de la génération d'actions ou prendre des actions inattendues pour résoudre les problèmes. De plus, la fiabilité peut être inférieure lors de l'interaction avec des applications de niche ou plusieurs applications à la fois. Nous recommandons aux utilisateurs d'inviter le modèle avec soin lors de la demande de tâches complexes.
4. **Fiabilité du défilement** : Claude Sonnet 3.7 a introduit des actions de défilement dédiées avec contrôle directionnel qui améliore la fiabilité. Le modèle peut maintenant faire défiler explicitement dans n'importe quelle direction (haut/bas/gauche/droite) d'une quantité spécifiée.
5. **Interaction avec des feuilles de calcul** : Les clics de souris pour l'interaction avec des feuilles de calcul se sont améliorés dans Claude Sonnet 3.7 avec l'ajout d'actions de contrôle de souris plus précises comme `left_mouse_down`, `left_mouse_up` et le nouveau support des touches de modification. La sélection de cellules peut être plus fiable en utilisant ces contrôles granulaires et en combinant les touches de modification avec les clics.
6. **Création de compte et génération de contenu sur les plateformes sociales et de communication** : Bien que Claude visitera les sites Web, nous limitons sa capacité à créer des comptes ou à générer et partager du contenu ou à s'engager autrement dans l'usurpation d'identité sur les sites Web et plateformes de médias sociaux. Nous pouvons mettre à jour cette capacité à l'avenir.
7. **Vulnérabilités** : Les vulnérabilités telles que le jailbreaking ou l'injection d'invite peuvent persister dans les systèmes d'IA de pointe, y compris l'API d'utilisation informatique bêta. Dans certaines circonstances, Claude suivra les commandes trouvées dans le contenu, parfois même en conflit avec les instructions de l'utilisateur. Par exemple, les instructions Claude sur les pages Web ou contenues dans les images peuvent remplacer les instructions ou faire que Claude fasse des erreurs. Nous recommandons :
   a. Limiter l'utilisation informatique aux environnements de confiance tels que les machines virtuelles ou les conteneurs avec des privilèges minimaux
   b. Éviter de donner l'accès à l'utilisation informatique aux comptes ou données sensibles sans surveillance stricte
   c. Informer les utilisateurs finaux des risques pertinents et obtenir leur consentement avant d'activer ou de demander les autorisations nécessaires pour les fonctionnalités d'utilisation informatique dans vos applications
8. **Actions inappropriées ou illégales** : Conformément aux conditions de service d'Anthropic, vous ne devez pas utiliser l'utilisation informatique pour violer les lois ou notre politique d'utilisation acceptable.

Examinez et vérifiez toujours attentivement les actions et les journaux d'utilisation informatique de Claude. N'utilisez pas Claude pour les tâches nécessitant une précision parfaite ou des informations utilisateur sensibles sans surveillance humaine.

---

## Tarification

Computer use follows the standard [tool use pricing](/docs/en/agents-and-tools/tool-use/overview#pricing). When using the computer use tool:

**System prompt overhead**: The computer use beta adds 466-499 tokens to the system prompt

**Computer use tool token usage**:
| Model | Input tokens per tool definition |
| ----- | -------------------------------- |
| Claude 4.x models | 735 tokens |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations)) | 735 tokens |

**Additional token consumption**:
- Screenshot images (see [Vision pricing](/docs/en/build-with-claude/vision))
- Tool execution results returned to Claude

<Note>
If you're also using bash or text editor tools alongside computer use, those tools have their own token costs as documented in their respective pages.
</Note>

## Étapes suivantes

<CardGroup cols={2}>
  <Card
    title="Implémentation de référence"
    icon="github-logo"
    href="https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo"
  >
    Démarrez rapidement avec notre implémentation complète basée sur Docker
  </Card>
  <Card
    title="Documentation des outils"
    icon="tool"
    href="/docs/fr/agents-and-tools/tool-use/overview"
  >
    En savoir plus sur l'utilisation des outils et la création d'outils personnalisés
  </Card>
</CardGroup>