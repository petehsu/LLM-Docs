# Connecteur MCP

Connectez directement à des serveurs MCP distants via l'API Messages sans client MCP séparé

---

La fonctionnalité de connecteur Model Context Protocol (MCP) de Claude vous permet de vous connecter à des serveurs MCP distants directement à partir de l'API Messages sans client MCP séparé.

<Note>
  **Version actuelle** : Cette fonctionnalité nécessite l'en-tête bêta : `"anthropic-beta": "mcp-client-2025-11-20"`

  La version précédente (`mcp-client-2025-04-04`) est dépréciée. Consultez la [documentation de la version dépréciée](#deprecated-version-mcp-client-2025-04-04) ci-dessous.
</Note>

## Fonctionnalités clés

- **Intégration API directe** : Connectez-vous à des serveurs MCP sans implémenter un client MCP
- **Support des appels d'outils** : Accédez aux outils MCP via l'API Messages
- **Configuration flexible des outils** : Activez tous les outils, créez une liste blanche d'outils spécifiques ou créez une liste noire d'outils indésirables
- **Configuration par outil** : Configurez les outils individuels avec des paramètres personnalisés
- **Authentification OAuth** : Support des jetons Bearer OAuth pour les serveurs authentifiés
- **Serveurs multiples** : Connectez-vous à plusieurs serveurs MCP dans une seule requête

## Limitations

- De l'ensemble des fonctionnalités de la [spécification MCP](https://modelcontextprotocol.io/introduction#explore-mcp), seuls les [appels d'outils](https://modelcontextprotocol.io/docs/concepts/tools) sont actuellement pris en charge.
- Le serveur doit être exposé publiquement via HTTP (supporte à la fois les transports HTTP Streamable et SSE). Les serveurs STDIO locaux ne peuvent pas être connectés directement.
- Le connecteur MCP n'est actuellement pas pris en charge sur Amazon Bedrock et Google Vertex.

## Utilisation du connecteur MCP dans l'API Messages

Le connecteur MCP utilise deux composants :

1. **Définition du serveur MCP** (tableau `mcp_servers`) : Définit les détails de connexion au serveur (URL, authentification)
2. **Ensemble d'outils MCP** (tableau `tools`) : Configure les outils à activer et comment les configurer

### Exemple basique

Cet exemple active tous les outils d'un serveur MCP avec la configuration par défaut :

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: mcp-client-2025-11-20" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1000,
    "messages": [{"role": "user", "content": "What tools do you have available?"}],
    "mcp_servers": [
      {
        "type": "url",
        "url": "https://example-server.modelcontextprotocol.io/sse",
        "name": "example-mcp",
        "authorization_token": "YOUR_TOKEN"
      }
    ],
    "tools": [
      {
        "type": "mcp_toolset",
        "mcp_server_name": "example-mcp"
      }
    ]
  }'
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1000,
  messages: [
    {
      role: "user",
      content: "What tools do you have available?",
    },
  ],
  mcp_servers: [
    {
      type: "url",
      url: "https://example-server.modelcontextprotocol.io/sse",
      name: "example-mcp",
      authorization_token: "YOUR_TOKEN",
    },
  ],
  tools: [
    {
      type: "mcp_toolset",
      mcp_server_name: "example-mcp",
    },
  ],
  betas: ["mcp-client-2025-11-20"],
});
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1000,
    messages=[{
        "role": "user",
        "content": "What tools do you have available?"
    }],
    mcp_servers=[{
        "type": "url",
        "url": "https://mcp.example.com/sse",
        "name": "example-mcp",
        "authorization_token": "YOUR_TOKEN"
    }],
    tools=[{
        "type": "mcp_toolset",
        "mcp_server_name": "example-mcp"
    }],
    betas=["mcp-client-2025-11-20"]
)
```
</CodeGroup>

## Configuration du serveur MCP

Chaque serveur MCP dans le tableau `mcp_servers` définit les détails de connexion :

```json
{
  "type": "url",
  "url": "https://example-server.modelcontextprotocol.io/sse",
  "name": "example-mcp",
  "authorization_token": "YOUR_TOKEN"
}
```

### Descriptions des champs

| Propriété | Type | Requis | Description |
|----------|------|--------|-------------|
| `type` | string | Oui | Actuellement, seul "url" est pris en charge |
| `url` | string | Oui | L'URL du serveur MCP. Doit commencer par https:// |
| `name` | string | Oui | Un identifiant unique pour ce serveur MCP. Doit être référencé par exactement un MCPToolset dans le tableau `tools`. |
| `authorization_token` | string | Non | Jeton d'autorisation OAuth si requis par le serveur MCP. Consultez la [spécification MCP](https://modelcontextprotocol.io/specification/2025-03-26/basic/authorization). |

## Configuration de l'ensemble d'outils MCP

L'MCPToolset se trouve dans le tableau `tools` et configure les outils du serveur MCP qui sont activés et comment ils doivent être configurés.

### Structure basique

```json
{
  "type": "mcp_toolset",
  "mcp_server_name": "example-mcp",
  "default_config": {
    "enabled": true,
    "defer_loading": false
  },
  "configs": {
    "specific_tool_name": {
      "enabled": true,
      "defer_loading": true
    }
  }
}
```

### Descriptions des champs

| Propriété | Type | Requis | Description |
|----------|------|--------|-------------|
| `type` | string | Oui | Doit être "mcp_toolset" |
| `mcp_server_name` | string | Oui | Doit correspondre à un nom de serveur défini dans le tableau `mcp_servers` |
| `default_config` | object | Non | Configuration par défaut appliquée à tous les outils de cet ensemble. Les configurations d'outils individuels dans `configs` remplaceront ces valeurs par défaut. |
| `configs` | object | Non | Remplacements de configuration par outil. Les clés sont les noms d'outils, les valeurs sont des objets de configuration. |
| `cache_control` | object | Non | Configuration du point d'arrêt du cache pour cet ensemble d'outils |

### Options de configuration des outils

Chaque outil (qu'il soit configuré dans `default_config` ou dans `configs`) prend en charge les champs suivants :

| Propriété | Type | Par défaut | Description |
|----------|------|-----------|-------------|
| `enabled` | boolean | `true` | Si cet outil est activé |
| `defer_loading` | boolean | `false` | Si true, la description de l'outil n'est pas envoyée au modèle initialement. Utilisé avec [Tool Search Tool](/docs/fr/agents-and-tools/tool-search-tool). |

### Fusion de configuration

Les valeurs de configuration fusionnent avec cette priorité (la plus élevée à la plus basse) :

1. Paramètres spécifiques à l'outil dans `configs`
2. `default_config` au niveau de l'ensemble
3. Valeurs par défaut du système

Exemple :

```json
{
  "type": "mcp_toolset",
  "mcp_server_name": "google-calendar-mcp",
  "default_config": {
    "defer_loading": true
  },
  "configs": {
    "search_events": {
      "enabled": false
    }
  }
}
```

Résultat :
- `search_events` : `enabled: false` (de configs), `defer_loading: true` (de default_config)
- Tous les autres outils : `enabled: true` (valeur par défaut du système), `defer_loading: true` (de default_config)

## Modèles de configuration courants

### Activer tous les outils avec la configuration par défaut

Le modèle le plus simple - activez tous les outils d'un serveur :

```json
{
  "type": "mcp_toolset",
  "mcp_server_name": "google-calendar-mcp",
}
```

### Liste blanche - Activer uniquement des outils spécifiques

Définissez `enabled: false` comme valeur par défaut, puis activez explicitement des outils spécifiques :

```json
{
  "type": "mcp_toolset",
  "mcp_server_name": "google-calendar-mcp",
  "default_config": {
    "enabled": false
  },
  "configs": {
    "search_events": {
      "enabled": true
    },
    "create_event": {
      "enabled": true
    }
  }
}
```

### Liste noire - Désactiver des outils spécifiques

Activez tous les outils par défaut, puis désactivez explicitement les outils indésirables :

```json
{
  "type": "mcp_toolset",
  "mcp_server_name": "google-calendar-mcp",
  "configs": {
    "delete_all_events": {
      "enabled": false
    },
    "share_calendar_publicly": {
      "enabled": false
    }
  }
}
```

### Mixte - Liste blanche avec configuration par outil

Combinez la liste blanche avec une configuration personnalisée pour chaque outil :

```json
{
  "type": "mcp_toolset",
  "mcp_server_name": "google-calendar-mcp",
  "default_config": {
    "enabled": false,
    "defer_loading": true
  },
  "configs": {
    "search_events": {
      "enabled": true,
      "defer_loading": false
    },
    "list_events": {
      "enabled": true
    }
  }
}
```

Dans cet exemple :
- `search_events` est activé avec `defer_loading: false`
- `list_events` est activé avec `defer_loading: true` (hérité de default_config)
- Tous les autres outils sont désactivés

## Règles de validation

L'API applique ces règles de validation :

- **Le serveur doit exister** : Le `mcp_server_name` dans un MCPToolset doit correspondre à un serveur défini dans le tableau `mcp_servers`
- **Le serveur doit être utilisé** : Chaque serveur MCP défini dans `mcp_servers` doit être référencé par exactement un MCPToolset
- **Ensemble d'outils unique par serveur** : Chaque serveur MCP ne peut être référencé que par un seul MCPToolset
- **Noms d'outils inconnus** : Si un nom d'outil dans `configs` n'existe pas sur le serveur MCP, un avertissement backend est enregistré mais aucune erreur n'est retournée (les serveurs MCP peuvent avoir une disponibilité d'outils dynamique)

## Types de contenu de réponse

Lorsque Claude utilise des outils MCP, la réponse inclura deux nouveaux types de blocs de contenu :

### Bloc d'utilisation d'outil MCP

```json
{
  "type": "mcp_tool_use",
  "id": "mcptoolu_014Q35RayjACSWkSj4X2yov1",
  "name": "echo",
  "server_name": "example-mcp",
  "input": { "param1": "value1", "param2": "value2" }
}
```

### Bloc de résultat d'outil MCP

```json
{
  "type": "mcp_tool_result",
  "tool_use_id": "mcptoolu_014Q35RayjACSWkSj4X2yov1",
  "is_error": false,
  "content": [
    {
      "type": "text",
      "text": "Hello"
    }
  ]
}
```

## Serveurs MCP multiples

Vous pouvez vous connecter à plusieurs serveurs MCP en incluant plusieurs définitions de serveur dans `mcp_servers` et un MCPToolset correspondant pour chacun dans le tableau `tools` :

```json
{
  "model": "claude-sonnet-4-5",
  "max_tokens": 1000,
  "messages": [
    {
      "role": "user",
      "content": "Use tools from both mcp-server-1 and mcp-server-2 to complete this task"
    }
  ],
  "mcp_servers": [
    {
      "type": "url",
      "url": "https://mcp.example1.com/sse",
      "name": "mcp-server-1",
      "authorization_token": "TOKEN1"
    },
    {
      "type": "url",
      "url": "https://mcp.example2.com/sse",
      "name": "mcp-server-2",
      "authorization_token": "TOKEN2"
    }
  ],
  "tools": [
    {
      "type": "mcp_toolset",
      "mcp_server_name": "mcp-server-1"
    },
    {
      "type": "mcp_toolset",
      "mcp_server_name": "mcp-server-2",
      "default_config": {
        "defer_loading": true
      }
    }
  ]
}
```

## Authentification

Pour les serveurs MCP qui nécessitent une authentification OAuth, vous devrez obtenir un jeton d'accès. Le bêta du connecteur MCP prend en charge le passage d'un paramètre `authorization_token` dans la définition du serveur MCP.
Les consommateurs d'API sont censés gérer le flux OAuth et obtenir le jeton d'accès avant d'effectuer l'appel API, ainsi que d'actualiser le jeton selon les besoins.

### Obtention d'un jeton d'accès pour les tests

L'inspecteur MCP peut vous guider tout au long du processus d'obtention d'un jeton d'accès à des fins de test.

1. Exécutez l'inspecteur avec la commande suivante. Vous devez avoir Node.js installé sur votre machine.

   ```bash
   npx @modelcontextprotocol/inspector
   ```

2. Dans la barre latérale de gauche, pour "Type de transport", sélectionnez soit "SSE" soit "Streamable HTTP".
3. Entrez l'URL du serveur MCP.
4. Dans la zone de droite, cliquez sur le bouton "Open Auth Settings" après "Need to configure authentication?".
5. Cliquez sur "Quick OAuth Flow" et autorisez sur l'écran OAuth.
6. Suivez les étapes de la section "OAuth Flow Progress" de l'inspecteur et cliquez sur "Continue" jusqu'à atteindre "Authentication complete".
7. Copiez la valeur `access_token`.
8. Collez-la dans le champ `authorization_token` de votre configuration de serveur MCP.

### Utilisation du jeton d'accès

Une fois que vous avez obtenu un jeton d'accès en utilisant l'un des flux OAuth ci-dessus, vous pouvez l'utiliser dans votre configuration de serveur MCP :

```json
{
  "mcp_servers": [
    {
      "type": "url",
      "url": "https://example-server.modelcontextprotocol.io/sse",
      "name": "authenticated-server",
      "authorization_token": "YOUR_ACCESS_TOKEN_HERE"
    }
  ]
}
```

Pour des explications détaillées du flux OAuth, consultez la [section Autorisation](https://modelcontextprotocol.io/docs/concepts/authentication) dans la spécification MCP.

## Guide de migration

Si vous utilisez l'en-tête bêta dépréciée `mcp-client-2025-04-04`, suivez ce guide pour migrer vers la nouvelle version.

### Changements clés

1. **Nouvel en-tête bêta** : Passez de `mcp-client-2025-04-04` à `mcp-client-2025-11-20`
2. **Configuration des outils déplacée** : La configuration des outils se trouve maintenant dans le tableau `tools` en tant qu'objets MCPToolset, et non dans la définition du serveur MCP
3. **Configuration plus flexible** : Le nouveau modèle prend en charge la liste blanche, la liste noire et la configuration par outil

### Étapes de migration

**Avant (dépréciée) :**

```json
{
  "model": "claude-sonnet-4-5",
  "max_tokens": 1000,
  "messages": [...],
  "mcp_servers": [
    {
      "type": "url",
      "url": "https://mcp.example.com/sse",
      "name": "example-mcp",
      "authorization_token": "YOUR_TOKEN",
      "tool_configuration": {
        "enabled": true,
        "allowed_tools": ["tool1", "tool2"]
      }
    }
  ]
}
```

**Après (actuelle) :**

```json
{
  "model": "claude-sonnet-4-5",
  "max_tokens": 1000,
  "messages": [...],
  "mcp_servers": [
    {
      "type": "url",
      "url": "https://mcp.example.com/sse",
      "name": "example-mcp",
      "authorization_token": "YOUR_TOKEN"
    }
  ],
  "tools": [
    {
      "type": "mcp_toolset",
      "mcp_server_name": "example-mcp",
      "default_config": {
        "enabled": false
      },
      "configs": {
        "tool1": {
          "enabled": true
        },
        "tool2": {
          "enabled": true
        }
      }
    }
  ]
}
```

### Modèles de migration courants

| Ancien modèle | Nouveau modèle |
|-------------|-------------|
| Pas de `tool_configuration` (tous les outils activés) | MCPToolset sans `default_config` ou `configs` |
| `tool_configuration.enabled: false` | MCPToolset avec `default_config.enabled: false` |
| `tool_configuration.allowed_tools: [...]` | MCPToolset avec `default_config.enabled: false` et outils spécifiques activés dans `configs` |

## Version dépréciée : mcp-client-2025-04-04

<Note type="warning">
  Cette version est dépréciée. Veuillez migrer vers `mcp-client-2025-11-20` en utilisant le [guide de migration](#migration-guide) ci-dessus.
</Note>

La version précédente du connecteur MCP incluait la configuration des outils directement dans la définition du serveur MCP :

```json
{
  "mcp_servers": [
    {
      "type": "url",
      "url": "https://example-server.modelcontextprotocol.io/sse",
      "name": "example-mcp",
      "authorization_token": "YOUR_TOKEN",
      "tool_configuration": {
        "enabled": true,
        "allowed_tools": ["example_tool_1", "example_tool_2"]
      }
    }
  ]
}
```

### Descriptions des champs dépréciés

| Propriété | Type | Description |
|----------|------|-------------|
| `tool_configuration` | object | **Dépréciée** : Utilisez MCPToolset dans le tableau `tools` à la place |
| `tool_configuration.enabled` | boolean | **Dépréciée** : Utilisez `default_config.enabled` dans MCPToolset |
| `tool_configuration.allowed_tools` | array | **Dépréciée** : Utilisez le modèle de liste blanche avec `configs` dans MCPToolset |