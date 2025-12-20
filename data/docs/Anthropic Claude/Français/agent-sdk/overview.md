# Aperçu du SDK Agent

Construisez des agents IA de production avec Claude Code en tant que bibliothèque

---

<Note>
Le SDK Claude Code a été renommé en SDK Claude Agent. Si vous migrez depuis l'ancien SDK, consultez le [Guide de migration](/docs/fr/agent-sdk/migration-guide).
</Note>

Construisez des agents IA qui lisent autonomement des fichiers, exécutent des commandes, recherchent sur le web, modifient du code, et bien plus. Le SDK Agent vous donne les mêmes outils, boucle d'agent et gestion du contexte qui alimentent Claude Code, programmable en Python et TypeScript.

<CodeGroup>
```python Python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions

async def main():
    async for message in query(
        prompt="Find and fix the bug in auth.py",
        options=ClaudeAgentOptions(allowed_tools=["Read", "Edit", "Bash"])
    ):
        print(message)  # Claude reads the file, finds the bug, edits it

asyncio.run(main())
```

```typescript TypeScript
import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "Find and fix the bug in auth.py",
  options: { allowedTools: ["Read", "Edit", "Bash"] }
})) {
  console.log(message);  // Claude reads the file, finds the bug, edits it
}
```
</CodeGroup>

Le SDK Agent inclut des outils intégrés pour lire des fichiers, exécuter des commandes et modifier du code, afin que votre agent puisse commencer à travailler immédiatement sans que vous ayez besoin d'implémenter l'exécution des outils. Plongez dans le guide de démarrage rapide ou explorez des agents réels construits avec le SDK :

<CardGroup cols={2}>
  <Card title="Guide de démarrage rapide" icon="play" href="/docs/fr/agent-sdk/quickstart">
    Construisez un agent de correction de bugs en quelques minutes
  </Card>
  <Card title="Agents d'exemple" icon="star" href="https://github.com/anthropics/claude-agent-sdk-demos">
    Assistant email, agent de recherche, et plus
  </Card>
</CardGroup>

## Capacités

Tout ce qui rend Claude Code puissant est disponible dans le SDK :

<Tabs>
  <Tab title="Outils intégrés">
    Votre agent peut lire des fichiers, exécuter des commandes et rechercher des bases de code prêtes à l'emploi. Les outils clés incluent :

    | Outil | Ce qu'il fait |
    |------|--------------|
    | **Read** | Lire n'importe quel fichier dans le répertoire de travail |
    | **Write** | Créer de nouveaux fichiers |
    | **Edit** | Effectuer des modifications précises aux fichiers existants |
    | **Bash** | Exécuter des commandes de terminal, des scripts, des opérations git |
    | **Glob** | Trouver des fichiers par motif (`**/*.ts`, `src/**/*.py`) |
    | **Grep** | Rechercher le contenu des fichiers avec regex |
    | **WebSearch** | Rechercher sur le web pour obtenir des informations actuelles |
    | **WebFetch** | Récupérer et analyser le contenu des pages web |

    Cet exemple crée un agent qui recherche les commentaires TODO dans votre base de code :

    <CodeGroup>
    ```python Python
    import asyncio
    from claude_agent_sdk import query, ClaudeAgentOptions

    async def main():
        async for message in query(
            prompt="Find all TODO comments and create a summary",
            options=ClaudeAgentOptions(allowed_tools=["Read", "Glob", "Grep"])
        ):
            print(message)

    asyncio.run(main())
    ```

    ```typescript TypeScript
    import { query } from "@anthropic-ai/claude-agent-sdk";

    for await (const message of query({
      prompt: "Find all TODO comments and create a summary",
      options: { allowedTools: ["Read", "Glob", "Grep"] }
    })) {
      console.log(message);
    }
    ```
    </CodeGroup>

  </Tab>
  <Tab title="Hooks">
    Exécutez du code personnalisé à des points clés du cycle de vie de l'agent. Les hooks peuvent exécuter des commandes shell ou des scripts personnalisés pour valider, enregistrer, bloquer ou transformer le comportement de l'agent.

    **Hooks disponibles :** `PreToolUse`, `PostToolUse`, `Stop`, `SessionStart`, `SessionEnd`, `UserPromptSubmit`, et plus.

    Cet exemple enregistre tous les changements de fichiers dans un fichier d'audit :

    <CodeGroup>
    ```python Python
    import asyncio
    from claude_agent_sdk import query, ClaudeAgentOptions

    async def main():
        async for message in query(
            prompt="Suggest improvements to utils.py",
            options=ClaudeAgentOptions(
                permission_mode="acceptEdits",
                hooks={
                    "PostToolUse": [{
                        "matcher": "Edit|Write",
                        "hooks": [{"type": "command", "command": "echo \"$(date): file modified\" >> ./audit.log"}]
                    }]
                }
            )
        ):
            print(message)

    asyncio.run(main())
    ```

    ```typescript TypeScript
    import { query } from "@anthropic-ai/claude-agent-sdk";

    for await (const message of query({
      prompt: "Suggest improvements to utils.py",
      options: {
        permissionMode: "acceptEdits",
        hooks: {
          PostToolUse: [{
            matcher: "Edit|Write",
            hooks: [{ type: "command", command: "echo \"$(date): file modified\" >> ./audit.log" }]
          }]
        }
      }
    })) {
      console.log(message);
    }
    ```
    </CodeGroup>

    [En savoir plus sur les hooks →](/docs/fr/agent-sdk/hooks)
  </Tab>
  <Tab title="Sous-agents">
    Générez des agents spécialisés pour gérer des sous-tâches ciblées. Votre agent principal délègue le travail, et les sous-agents rapportent les résultats.

    Activez l'outil `Task` pour permettre à Claude de générer des sous-agents quand il décide qu'une tâche est suffisamment complexe pour bénéficier de la délégation. Claude détermine automatiquement quand utiliser les sous-agents en fonction de la complexité de la tâche.

    <CodeGroup>
    ```python Python
    import asyncio
    from claude_agent_sdk import query, ClaudeAgentOptions

    async def main():
        async for message in query(
            prompt="Analyze this codebase for security vulnerabilities",
            options=ClaudeAgentOptions(allowed_tools=["Read", "Glob", "Grep", "Task"])
        ):
            print(message)

    asyncio.run(main())
    ```

    ```typescript TypeScript
    import { query } from "@anthropic-ai/claude-agent-sdk";

    for await (const message of query({
      prompt: "Analyze this codebase for security vulnerabilities",
      options: {
        allowedTools: ["Read", "Glob", "Grep", "Task"]
      }
    })) {
      console.log(message);
    }
    ```
    </CodeGroup>

    Vous pouvez également définir des types d'agents personnalisés avec l'option `agents` pour des modèles de délégation plus spécialisés.

    [En savoir plus sur les sous-agents →](/docs/fr/agent-sdk/subagents)
  </Tab>
  <Tab title="MCP">
    Connectez-vous à des systèmes externes via le Model Context Protocol : bases de données, navigateurs, API, et [des centaines d'autres](https://github.com/modelcontextprotocol/servers).

    Cet exemple connecte le [serveur Playwright MCP](https://github.com/microsoft/playwright-mcp) pour donner à votre agent des capacités d'automatisation de navigateur :

    <CodeGroup>
    ```python Python
    import asyncio
    from claude_agent_sdk import query, ClaudeAgentOptions

    async def main():
        async for message in query(
            prompt="Open example.com and describe what you see",
            options=ClaudeAgentOptions(
                mcp_servers={
                    "playwright": {"command": "npx", "args": ["@playwright/mcp@latest"]}
                }
            )
        ):
            print(message)

    asyncio.run(main())
    ```

    ```typescript TypeScript
    import { query } from "@anthropic-ai/claude-agent-sdk";

    for await (const message of query({
      prompt: "Open example.com and describe what you see",
      options: {
        mcpServers: {
          playwright: { command: "npx", args: ["@playwright/mcp@latest"] }
        }
      }
    })) {
      console.log(message);
    }
    ```
    </CodeGroup>

    [En savoir plus sur MCP →](/docs/fr/agent-sdk/mcp)
  </Tab>
  <Tab title="Permissions">
    Contrôlez exactement quels outils votre agent peut utiliser. Autorisez les opérations sûres, bloquez les opérations dangereuses, ou exigez une approbation pour les actions sensibles.

    Cet exemple crée un agent en lecture seule qui peut analyser mais pas modifier le code :

    <CodeGroup>
    ```python Python
    import asyncio
    from claude_agent_sdk import query, ClaudeAgentOptions

    async def main():
        async for message in query(
            prompt="Review this code for best practices",
            options=ClaudeAgentOptions(
                allowed_tools=["Read", "Glob", "Grep"],
                permission_mode="bypassPermissions"
            )
        ):
            print(message)

    asyncio.run(main())
    ```

    ```typescript TypeScript
    import { query } from "@anthropic-ai/claude-agent-sdk";

    for await (const message of query({
      prompt: "Review this code for best practices",
      options: {
        allowedTools: ["Read", "Glob", "Grep"],
        permissionMode: "bypassPermissions"
      }
    })) {
      console.log(message);
    }
    ```
    </CodeGroup>

    [En savoir plus sur les permissions →](/docs/fr/agent-sdk/permissions)
  </Tab>
  <Tab title="Sessions">
    Maintenez le contexte sur plusieurs échanges. Claude se souvient des fichiers lus, de l'analyse effectuée et de l'historique de la conversation. Reprenez les sessions plus tard, ou divisez-les pour explorer différentes approches.

    Cet exemple capture l'ID de session de la première requête, puis reprend pour continuer avec le contexte complet :

    <CodeGroup>
    ```python Python
    import asyncio
    from claude_agent_sdk import query, ClaudeAgentOptions

    async def main():
        session_id = None

        # First query: capture the session ID
        async for message in query(
            prompt="Read the authentication module",
            options=ClaudeAgentOptions(allowed_tools=["Read", "Glob"])
        ):
            if hasattr(message, 'subtype') and message.subtype == 'init':
                session_id = message.data.get('session_id')

        # Resume with full context from the first query
        async for message in query(
            prompt="Now find all places that call it",  # "it" = auth module
            options=ClaudeAgentOptions(resume=session_id)
        ):
            pass

    asyncio.run(main())
    ```

    ```typescript TypeScript
    import { query } from "@anthropic-ai/claude-agent-sdk";

    let sessionId: string | undefined;

    // First query: capture the session ID
    for await (const message of query({
      prompt: "Read the authentication module",
      options: { allowedTools: ["Read", "Glob"] }
    })) {
      if (message.type === "system" && message.subtype === "init") {
        sessionId = message.session_id;
      }
    }

    // Resume with full context from the first query
    for await (const message of query({
      prompt: "Now find all places that call it",  // "it" = auth module
      options: { resume: sessionId }
    })) {
      // Process messages...
    }
    ```
    </CodeGroup>

    [En savoir plus sur les sessions →](/docs/fr/agent-sdk/sessions)
  </Tab>
</Tabs>

### Fonctionnalités de Claude Code

Le SDK supporte également la configuration basée sur le système de fichiers de Claude Code. Pour utiliser ces fonctionnalités, définissez `setting_sources=["project"]` (Python) ou `settingSources: ['project']` (TypeScript) dans vos options.

| Fonctionnalité | Description | Emplacement |
|---------|-------------|----------|
| [Skills](/docs/fr/agent-sdk/skills) | Capacités spécialisées définies en Markdown | `.claude/skills/SKILL.md` |
| [Slash commands](/docs/fr/agent-sdk/slash-commands) | Commandes personnalisées pour les tâches courantes | `.claude/commands/*.md` |
| [Memory](/docs/fr/agent-sdk/modifying-system-prompts) | Contexte du projet et instructions | `CLAUDE.md` ou `.claude/CLAUDE.md` |
| [Plugins](/docs/fr/agent-sdk/plugins) | Étendez avec des commandes personnalisées, des agents et des serveurs MCP | Programmatique via l'option `plugins` |

## Commencer

<Steps>
  <Step title="Installer Claude Code">
    Le SDK utilise Claude Code comme son runtime :

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

    Consultez [Configuration de Claude Code](https://docs.anthropic.com/en/docs/claude-code/setup) pour Windows et d'autres options.
  </Step>
  <Step title="Installer le SDK">
    <Tabs>
      <Tab title="TypeScript">
        ```bash
        npm install @anthropic-ai/claude-agent-sdk
        ```
      </Tab>
      <Tab title="Python">
        ```bash
        pip install claude-agent-sdk
        ```
      </Tab>
    </Tabs>
  </Step>
  <Step title="Définir votre clé API">
    ```bash
    export ANTHROPIC_API_KEY=your-api-key
    ```
    Obtenez votre clé à partir de la [Console](https://console.anthropic.com/).

    Le SDK supporte également l'authentification via des fournisseurs d'API tiers :

    - **Amazon Bedrock** : Définissez la variable d'environnement `CLAUDE_CODE_USE_BEDROCK=1` et configurez les identifiants AWS
    - **Google Vertex AI** : Définissez la variable d'environnement `CLAUDE_CODE_USE_VERTEX=1` et configurez les identifiants Google Cloud
    - **Microsoft Foundry** : Définissez la variable d'environnement `CLAUDE_CODE_USE_FOUNDRY=1` et configurez les identifiants Azure

    <Note>
    Sauf approbation préalable, nous n'autorisons pas les développeurs tiers à offrir la connexion Claude.ai ou les limites de débit pour leurs produits, y compris les agents construits sur le SDK Claude Agent. Veuillez utiliser les méthodes d'authentification par clé API décrites dans ce document à la place.
    </Note>
  </Step>
  <Step title="Exécuter votre premier agent">
    Cet exemple crée un agent qui liste les fichiers dans votre répertoire courant en utilisant les outils intégrés.

    <CodeGroup>
    ```python Python
    import asyncio
    from claude_agent_sdk import query, ClaudeAgentOptions

    async def main():
        async for message in query(
            prompt="What files are in this directory?",
            options=ClaudeAgentOptions(allowed_tools=["Bash", "Glob"])
        ):
            print(message)

    asyncio.run(main())
    ```

    ```typescript TypeScript
    import { query } from "@anthropic-ai/claude-agent-sdk";

    for await (const message of query({
      prompt: "What files are in this directory?",
      options: { allowedTools: ["Bash", "Glob"] },
    })) {
      console.log(message);
    }
    ```
    </CodeGroup>
  </Step>
</Steps>

**Prêt à construire ?** Suivez le [Guide de démarrage rapide](/docs/fr/agent-sdk/quickstart) pour créer un agent qui trouve et corrige les bugs en quelques minutes.

## Comparer le SDK Agent à d'autres outils Claude

La plateforme Claude offre plusieurs façons de construire avec Claude. Voici comment le SDK Agent s'intègre :

<Tabs>
  <Tab title="SDK Agent vs SDK Client">
    Le [SDK Client Anthropic](/docs/fr/api/client-sdks) vous donne un accès direct à l'API : vous envoyez des invites et implémentez vous-même l'exécution des outils. Le **SDK Agent** vous donne Claude avec l'exécution des outils intégrée.

    Avec le SDK Client, vous implémentez une boucle d'outils. Avec le SDK Agent, Claude la gère :

    <CodeGroup>
    ```python Python
    # Client SDK: You implement the tool loop
    response = client.messages.create(...)
    while response.stop_reason == "tool_use":
        result = your_tool_executor(response.tool_use)
        response = client.messages.create(tool_result=result, ...)

    # Agent SDK: Claude handles tools autonomously
    async for message in query(prompt="Fix the bug in auth.py"):
        print(message)
    ```

    ```typescript TypeScript
    // Client SDK: You implement the tool loop
    let response = await client.messages.create({...});
    while (response.stop_reason === "tool_use") {
      const result = yourToolExecutor(response.tool_use);
      response = await client.messages.create({ tool_result: result, ... });
    }

    // Agent SDK: Claude handles tools autonomously
    for await (const message of query({ prompt: "Fix the bug in auth.py" })) {
      console.log(message);
    }
    ```
    </CodeGroup>
  </Tab>
  <Tab title="SDK Agent vs CLI Claude Code">
    Mêmes capacités, interface différente :

    | Cas d'usage | Meilleur choix |
    |----------|-------------|
    | Développement interactif | CLI |
    | Pipelines CI/CD | SDK |
    | Applications personnalisées | SDK |
    | Tâches ponctuelles | CLI |
    | Automatisation en production | SDK |

    De nombreuses équipes utilisent les deux : CLI pour le développement quotidien, SDK pour la production. Les flux de travail se traduisent directement entre eux.
  </Tab>
</Tabs>

## Journal des modifications

Consultez le journal des modifications complet pour les mises à jour du SDK, les corrections de bugs et les nouvelles fonctionnalités :

- **SDK TypeScript** : [Voir CHANGELOG.md](https://github.com/anthropics/claude-agent-sdk-typescript/blob/main/CHANGELOG.md)
- **SDK Python** : [Voir CHANGELOG.md](https://github.com/anthropics/claude-agent-sdk-python/blob/main/CHANGELOG.md)

## Signaler les bugs

Si vous rencontrez des bugs ou des problèmes avec le SDK Agent :

- **SDK TypeScript** : [Signaler les problèmes sur GitHub](https://github.com/anthropics/claude-agent-sdk-typescript/issues)
- **SDK Python** : [Signaler les problèmes sur GitHub](https://github.com/anthropics/claude-agent-sdk-python/issues)

## Directives de marque

Pour les partenaires intégrant le SDK Claude Agent, l'utilisation de la marque Claude est facultative. Lors de la référence à Claude dans votre produit :

**Autorisé :**
- « Claude Agent » (préféré pour les menus déroulants)
- « Claude » (quand déjà dans un menu étiqueté « Agents »)
- « {YourAgentName} Powered by Claude » (si vous avez un nom d'agent existant)

**Non autorisé :**
- « Claude Code » ou « Claude Code Agent »
- Art ASCII ou éléments visuels de marque Claude Code qui imitent Claude Code

Votre produit doit maintenir sa propre marque et ne pas sembler être Claude Code ou un produit Anthropic. Pour des questions sur la conformité de la marque, contactez notre [équipe commerciale](https://www.anthropic.com/contact-sales).

## Licence et conditions

L'utilisation du SDK Claude Agent est régie par les [Conditions commerciales d'Anthropic](https://www.anthropic.com/legal/commercial-terms), y compris lorsque vous l'utilisez pour alimenter des produits et services que vous mettez à disposition de vos propres clients et utilisateurs finaux, sauf dans la mesure où un composant ou une dépendance spécifique est couvert par une licence différente comme indiqué dans le fichier LICENSE de ce composant.

## Prochaines étapes

<CardGroup cols={2}>
  <Card title="Guide de démarrage rapide" icon="play" href="/docs/fr/agent-sdk/quickstart">
    Construisez un agent qui trouve et corrige les bugs en quelques minutes
  </Card>
  <Card title="Agents d'exemple" icon="star" href="https://github.com/anthropics/claude-agent-sdk-demos">
    Assistant email, agent de recherche, et plus
  </Card>
  <Card title="SDK TypeScript" icon="code" href="/docs/fr/agent-sdk/typescript">
    Référence API TypeScript complète et exemples
  </Card>
  <Card title="SDK Python" icon="code" href="/docs/fr/agent-sdk/python">
    Référence API Python complète et exemples
  </Card>
</CardGroup>