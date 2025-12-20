# Démarrage rapide

Commencez avec le SDK Agent Python ou TypeScript pour créer des agents IA qui fonctionnent de manière autonome

---

Utilisez le SDK Agent pour créer un agent IA qui lit votre code, trouve les bugs et les corrige, tout sans intervention manuelle.

**Ce que vous allez faire :**
1. Configurer un projet avec le SDK Agent
2. Créer un fichier avec du code bugué
3. Exécuter un agent qui trouve et corrige automatiquement les bugs

## Prérequis

- **Node.js 18+** ou **Python 3.10+**
- Un **compte Anthropic** ([inscrivez-vous ici](https://console.anthropic.com/))

## Configuration

<Steps>
  <Step title="Installer Claude Code">
    Le SDK Agent utilise Claude Code comme runtime. Installez-le pour votre plateforme :

    <Tabs>
      <Tab title="macOS/Linux/WSL">
        ```bash
        curl -fsSL https://claude.ai/install.sh | bash
        ```
      </Tab>
      <Tab title="Homebrew">
        ```bash
        brew install --cask claude-code
        ```
      </Tab>
      <Tab title="npm">
        ```bash
        npm install -g @anthropic-ai/claude-code
        ```
      </Tab>
    </Tabs>

    Après avoir installé Claude Code sur votre machine, exécutez `claude` dans votre terminal et suivez les invites pour vous authentifier. Le SDK utilisera cette authentification automatiquement.

    <Tip>
    Pour plus d'informations sur l'installation de Claude Code, consultez [Configuration de Claude Code](https://docs.anthropic.com/en/docs/claude-code/setup).
    </Tip>
  </Step>

  <Step title="Créer un dossier de projet">
    Créez un nouveau répertoire pour ce démarrage rapide :

    ```bash
    mkdir my-agent && cd my-agent
    ```

    Pour vos propres projets, vous pouvez exécuter le SDK à partir de n'importe quel dossier ; il aura accès aux fichiers de ce répertoire et de ses sous-répertoires par défaut.
  </Step>

  <Step title="Installer le SDK">
    Installez le package SDK Agent pour votre langage :

    <Tabs>
      <Tab title="TypeScript">
        ```bash
        npm install @anthropic-ai/claude-agent-sdk
        ```
      </Tab>
      <Tab title="Python (uv)">
        [uv](https://docs.astral.sh/uv/) est un gestionnaire de paquets Python rapide qui gère automatiquement les environnements virtuels :
        ```bash
        uv init && uv add claude-agent-sdk
        ```
      </Tab>
      <Tab title="Python (pip)">
        Créez d'abord un environnement virtuel, puis installez :
        ```bash
        python3 -m venv .venv && source .venv/bin/activate
        pip3 install claude-agent-sdk
        ```
      </Tab>
    </Tabs>
  </Step>

  <Step title="Définir votre clé API">
    Si vous avez déjà authentifié Claude Code (en exécutant `claude` dans votre terminal), le SDK utilise cette authentification automatiquement.

    Sinon, vous avez besoin d'une clé API, que vous pouvez obtenir à partir de la [Console Anthropic](https://console.anthropic.com/).

    Créez un fichier `.env` dans votre répertoire de projet et stockez-y la clé API :

    ```bash
    ANTHROPIC_API_KEY=your-api-key
    ```

    <Note>
    **Utilisez Amazon Bedrock, Google Vertex AI ou Microsoft Azure ?** Consultez les guides de configuration pour [Bedrock](https://code.claude.com/docs/en/amazon-bedrock), [Vertex AI](https://code.claude.com/docs/en/google-vertex-ai), ou [Azure AI Foundry](https://code.claude.com/docs/en/azure-ai-foundry).

    Sauf approbation préalable, nous n'autorisons pas les développeurs tiers à proposer la connexion Claude.ai ou les limites de débit pour leurs produits, y compris les agents construits sur le SDK Agent Claude. Veuillez plutôt utiliser les méthodes d'authentification par clé API décrites dans ce document.
    </Note>
  </Step>
</Steps>

## Créer un fichier bugué

Ce démarrage rapide vous guide dans la création d'un agent capable de trouver et corriger les bugs dans le code. D'abord, vous avez besoin d'un fichier avec quelques bugs intentionnels pour que l'agent les corrige. Créez `utils.py` dans le répertoire `my-agent` et collez le code suivant :

```python
def calculate_average(numbers):
    total = 0
    for num in numbers:
        total += num
    return total / len(numbers)

def get_user_name(user):
    return user["name"].upper()
```

Ce code a deux bugs :
1. `calculate_average([])` plante avec une division par zéro
2. `get_user_name(None)` plante avec une TypeError

## Construire un agent qui trouve et corrige les bugs

Créez `agent.py` si vous utilisez le SDK Python, ou `agent.ts` pour TypeScript :

<CodeGroup>
```python Python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions, AssistantMessage, ResultMessage

async def main():
    # Agentic loop: streams messages as Claude works
    async for message in query(
        prompt="Review utils.py for bugs that would cause crashes. Fix any issues you find.",
        options=ClaudeAgentOptions(
            allowed_tools=["Read", "Edit", "Glob"],  # Tools Claude can use
            permission_mode="acceptEdits"            # Auto-approve file edits
        )
    ):
        # Print human-readable output
        if isinstance(message, AssistantMessage):
            for block in message.content:
                if hasattr(block, "text"):
                    print(block.text)              # Claude's reasoning
                elif hasattr(block, "name"):
                    print(f"Tool: {block.name}")   # Tool being called
        elif isinstance(message, ResultMessage):
            print(f"Done: {message.subtype}")      # Final result

asyncio.run(main())
```

```typescript TypeScript
import { query } from "@anthropic-ai/claude-agent-sdk";

// Agentic loop: streams messages as Claude works
for await (const message of query({
  prompt: "Review utils.py for bugs that would cause crashes. Fix any issues you find.",
  options: {
    allowedTools: ["Read", "Edit", "Glob"],  // Tools Claude can use
    permissionMode: "acceptEdits"            // Auto-approve file edits
  }
})) {
  // Print human-readable output
  if (message.type === "assistant" && message.message?.content) {
    for (const block of message.message.content) {
      if ("text" in block) {
        console.log(block.text);             // Claude's reasoning
      } else if ("name" in block) {
        console.log(`Tool: ${block.name}`);  // Tool being called
      }
    }
  } else if (message.type === "result") {
    console.log(`Done: ${message.subtype}`); // Final result
  }
}
```
</CodeGroup>

Ce code a trois parties principales :

1. **`query`** : le point d'entrée principal qui crée la boucle agentic. Il retourne un itérateur asynchrone, donc vous utilisez `async for` pour diffuser les messages au fur et à mesure que Claude travaille. Consultez l'API complète dans la référence du SDK [Python](/docs/fr/agent-sdk/python#query) ou [TypeScript](/docs/fr/agent-sdk/typescript#query).

2. **`prompt`** : ce que vous voulez que Claude fasse. Claude détermine les outils à utiliser en fonction de la tâche.

3. **`options`** : configuration de l'agent. Cet exemple utilise `allowedTools` pour restreindre Claude à `Read`, `Edit` et `Glob`, et `permissionMode: "acceptEdits"` pour approuver automatiquement les modifications de fichiers. Les autres options incluent `systemPrompt`, `mcpServers`, et plus. Consultez toutes les options pour [Python](/docs/fr/agent-sdk/python#claudeagentoptions) ou [TypeScript](/docs/fr/agent-sdk/typescript#claudeagentoptions).

La boucle `async for` continue de s'exécuter tandis que Claude réfléchit, appelle des outils, observe les résultats et décide quoi faire ensuite. Chaque itération produit un message : le raisonnement de Claude, un appel d'outil, un résultat d'outil, ou le résultat final. Le SDK gère l'orchestration (exécution des outils, gestion du contexte, tentatives) afin que vous consommiez simplement le flux. La boucle se termine lorsque Claude termine la tâche ou rencontre une erreur.

La gestion des messages à l'intérieur de la boucle filtre pour obtenir une sortie lisible par l'homme. Sans filtrage, vous verriez des objets de message bruts incluant l'initialisation du système et l'état interne, ce qui est utile pour le débogage mais bruyant autrement.

<Note>
Cet exemple utilise la diffusion en continu pour afficher la progression en temps réel. Si vous n'avez pas besoin de sortie en direct (par exemple, pour les tâches en arrière-plan ou les pipelines CI), vous pouvez collecter tous les messages à la fois. Consultez [Mode diffusion en continu vs mode à tour unique](/docs/fr/agent-sdk/streaming-vs-single-mode) pour plus de détails.
</Note>

### Exécuter votre agent

Votre agent est prêt. Exécutez-le avec la commande suivante :

<CodeGroup>
```bash Python
python3 agent.py
```

```bash TypeScript
npx tsx agent.ts
```
</CodeGroup>

Après l'exécution, vérifiez `utils.py`. Vous verrez du code défensif gérant les listes vides et les utilisateurs nuls. Votre agent a autonomement :

1. **Lu** `utils.py` pour comprendre le code
2. **Analysé** la logique et identifié les cas limites qui causeraient un plantage
3. **Modifié** le fichier pour ajouter une gestion d'erreur appropriée

C'est ce qui rend le SDK Agent différent : Claude exécute les outils directement au lieu de vous demander de les implémenter.

<Note>
Si vous voyez « Claude Code not found », [installez Claude Code](#installer-claude-code) et redémarrez votre terminal. Pour « API key not found », [définissez votre clé API](#définir-votre-clé-api). Consultez le [guide complet de dépannage](https://docs.anthropic.com/en/docs/claude-code/troubleshooting) pour plus d'aide.
</Note>

### Essayer d'autres invites

Maintenant que votre agent est configuré, essayez quelques invites différentes :

- `"Add docstrings to all functions in utils.py"`
- `"Add type hints to all functions in utils.py"`
- `"Create a README.md documenting the functions in utils.py"`

### Personnaliser votre agent

Vous pouvez modifier le comportement de votre agent en changeant les options. Voici quelques exemples :

**Ajouter la capacité de recherche web :**

<CodeGroup>
```python Python
options=ClaudeAgentOptions(
    allowed_tools=["Read", "Edit", "Glob", "WebSearch"],
    permission_mode="acceptEdits"
)
```

```typescript TypeScript
options: {
  allowedTools: ["Read", "Edit", "Glob", "WebSearch"],
  permissionMode: "acceptEdits"
}
```
</CodeGroup>

**Donner à Claude une invite système personnalisée :**

<CodeGroup>
```python Python
options=ClaudeAgentOptions(
    allowed_tools=["Read", "Edit", "Glob"],
    permission_mode="acceptEdits",
    system_prompt="You are a senior Python developer. Always follow PEP 8 style guidelines."
)
```

```typescript TypeScript
options: {
  allowedTools: ["Read", "Edit", "Glob"],
  permissionMode: "acceptEdits",
  systemPrompt: "You are a senior Python developer. Always follow PEP 8 style guidelines."
}
```
</CodeGroup>

**Exécuter des commandes dans le terminal :**

<CodeGroup>
```python Python
options=ClaudeAgentOptions(
    allowed_tools=["Read", "Edit", "Glob", "Bash"],
    permission_mode="acceptEdits"
)
```

```typescript TypeScript
options: {
  allowedTools: ["Read", "Edit", "Glob", "Bash"],
  permissionMode: "acceptEdits"
}
```
</CodeGroup>

Avec `Bash` activé, essayez : `"Write unit tests for utils.py, run them, and fix any failures"`

## Concepts clés

**Les outils** contrôlent ce que votre agent peut faire :

| Outils | Ce que l'agent peut faire |
|-------|----------------------|
| `Read`, `Glob`, `Grep` | Analyse en lecture seule |
| `Read`, `Edit`, `Glob` | Analyser et modifier le code |
| `Read`, `Edit`, `Bash`, `Glob`, `Grep` | Automatisation complète |

**Les modes de permission** contrôlent le niveau de surveillance humaine que vous souhaitez :

| Mode | Comportement | Cas d'usage |
|------|----------|----------|
| `acceptEdits` | Approuve automatiquement les modifications de fichiers, demande d'autres actions | Flux de travail de développement de confiance |
| `bypassPermissions` | S'exécute sans invites | Pipelines CI/CD, automatisation |
| `default` | Nécessite un rappel `canUseTool` pour gérer l'approbation | Flux d'approbation personnalisés |

L'exemple ci-dessus utilise le mode `acceptEdits`, qui approuve automatiquement les opérations de fichiers afin que l'agent puisse s'exécuter sans invites interactives. Si vous souhaitez inviter les utilisateurs à approuver, utilisez le mode `default` et fournissez un rappel [`canUseTool`](/docs/fr/agent-sdk/permissions#canusetool) qui collecte l'entrée de l'utilisateur. Pour plus de contrôle, consultez [Permissions](/docs/fr/agent-sdk/permissions).

## Étapes suivantes

Maintenant que vous avez créé votre premier agent, apprenez comment étendre ses capacités et l'adapter à votre cas d'usage :

- **[Permissions](/docs/fr/agent-sdk/permissions)** : contrôlez ce que votre agent peut faire et quand il a besoin d'approbation
- **[Hooks](/docs/fr/agent-sdk/hooks)** : exécutez du code personnalisé avant ou après les appels d'outils
- **[Sessions](/docs/fr/agent-sdk/sessions)** : créez des agents multi-tours qui maintiennent le contexte
- **[Serveurs MCP](/docs/fr/agent-sdk/mcp)** : connectez-vous à des bases de données, navigateurs, API et autres systèmes externes
- **[Hébergement](/docs/fr/agent-sdk/hosting)** : déployez des agents sur Docker, cloud et CI/CD
- **[Agents d'exemple](https://github.com/anthropics/claude-agent-sdk-demos)** : consultez des exemples complets : assistant e-mail, agent de recherche, et plus