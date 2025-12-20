# Migrer vers Claude Agent SDK

Guide de migration des SDK TypeScript et Python de Claude Code vers Claude Agent SDK

---

## Aperçu

Le SDK Claude Code a été renommé en **Claude Agent SDK** et sa documentation a été réorganisée. Ce changement reflète les capacités plus larges du SDK pour construire des agents IA au-delà des simples tâches de codage.

## Ce qui a changé

| Aspect                   | Ancien                      | Nouveau                          |
| :----------------------- | :-------------------------- | :------------------------------- |
| **Nom du package (TS/JS)** | `@anthropic-ai/claude-code` | `@anthropic-ai/claude-agent-sdk` |
| **Package Python**       | `claude-code-sdk`           | `claude-agent-sdk`               |
| **Emplacement de la documentation** | Documentation Claude Code | Guide API → Section Agent SDK |

<Note>
**Modifications de la documentation :** La documentation d'Agent SDK a été déplacée de la documentation Claude Code vers le Guide API dans une section dédiée [Agent SDK](/docs/fr/agent-sdk/overview). La documentation Claude Code se concentre maintenant sur l'outil CLI et les fonctionnalités d'automatisation.
</Note>

## Étapes de migration

### Pour les projets TypeScript/JavaScript

**1. Désinstallez l'ancien package :**

```bash
npm uninstall @anthropic-ai/claude-code
```

**2. Installez le nouveau package :**

```bash
npm install @anthropic-ai/claude-agent-sdk
```

**3. Mettez à jour vos imports :**

Modifiez tous les imports de `@anthropic-ai/claude-code` vers `@anthropic-ai/claude-agent-sdk` :

```typescript
// Avant
import { query, tool, createSdkMcpServer } from "@anthropic-ai/claude-code";

// Après
import {
  query,
  tool,
  createSdkMcpServer,
} from "@anthropic-ai/claude-agent-sdk";
```

**4. Mettez à jour les dépendances package.json :**

Si vous avez le package listé dans votre `package.json`, mettez-le à jour :

```json
// Avant
{
  "dependencies": {
    "@anthropic-ai/claude-code": "^1.0.0"
  }
}

// Après
{
  "dependencies": {
    "@anthropic-ai/claude-agent-sdk": "^0.1.0"
  }
}
```

C'est tout ! Aucune autre modification de code n'est requise.

### Pour les projets Python

**1. Désinstallez l'ancien package :**

```bash
pip uninstall claude-code-sdk
```

**2. Installez le nouveau package :**

```bash
pip install claude-agent-sdk
```

**3. Mettez à jour vos imports :**

Modifiez tous les imports de `claude_code_sdk` vers `claude_agent_sdk` :

```python
# Avant
from claude_code_sdk import query, ClaudeCodeOptions

# Après
from claude_agent_sdk import query, ClaudeAgentOptions
```

**4. Mettez à jour les noms de types :**

Modifiez `ClaudeCodeOptions` en `ClaudeAgentOptions` :

```python
# Avant
from claude_agent_sdk import query, ClaudeCodeOptions

options = ClaudeCodeOptions(
    model="claude-sonnet-4-5"
)

# Après
from claude_agent_sdk import query, ClaudeAgentOptions

options = ClaudeAgentOptions(
    model="claude-sonnet-4-5"
)
```

**5. Consultez les [modifications incompatibles](#breaking-changes)**

Effectuez les modifications de code nécessaires pour terminer la migration.

## Modifications incompatibles

<Warning>
Pour améliorer l'isolation et la configuration explicite, Claude Agent SDK v0.1.0 introduit des modifications incompatibles pour les utilisateurs migrant depuis Claude Code SDK. Consultez attentivement cette section avant de migrer.
</Warning>

### Python : ClaudeCodeOptions renommé en ClaudeAgentOptions

**Ce qui a changé :** Le type SDK Python `ClaudeCodeOptions` a été renommé en `ClaudeAgentOptions`.

**Migration :**

```python
# AVANT (v0.0.x)
from claude_agent_sdk import query, ClaudeCodeOptions

options = ClaudeCodeOptions(
    model="claude-sonnet-4-5",
    permission_mode="acceptEdits"
)

# APRÈS (v0.1.0)
from claude_agent_sdk import query, ClaudeAgentOptions

options = ClaudeAgentOptions(
    model="claude-sonnet-4-5",
    permission_mode="acceptEdits"
)
```

**Pourquoi ce changement :** Le nom du type correspond maintenant à la marque « Claude Agent SDK » et assure la cohérence dans les conventions de nommage du SDK.

### L'invite système n'est plus définie par défaut

**Ce qui a changé :** Le SDK n'utilise plus l'invite système de Claude Code par défaut.

**Migration :**

<CodeGroup>

```typescript TypeScript
// AVANT (v0.0.x) - Utilisait l'invite système de Claude Code par défaut
const result = query({ prompt: "Hello" });

// APRÈS (v0.1.0) - Utilise une invite système vide par défaut
// Pour obtenir l'ancien comportement, demandez explicitement le préréglage de Claude Code :
const result = query({
  prompt: "Hello",
  options: {
    systemPrompt: { type: "preset", preset: "claude_code" }
  }
});

// Ou utilisez une invite système personnalisée :
const result = query({
  prompt: "Hello",
  options: {
    systemPrompt: "You are a helpful coding assistant"
  }
});
```

```python Python
# AVANT (v0.0.x) - Utilisait l'invite système de Claude Code par défaut
async for message in query(prompt="Hello"):
    print(message)

# APRÈS (v0.1.0) - Utilise une invite système vide par défaut
# Pour obtenir l'ancien comportement, demandez explicitement le préréglage de Claude Code :
from claude_agent_sdk import query, ClaudeAgentOptions

async for message in query(
    prompt="Hello",
    options=ClaudeAgentOptions(
        system_prompt={"type": "preset", "preset": "claude_code"}  # Utiliser le préréglage
    )
):
    print(message)

# Ou utilisez une invite système personnalisée :
async for message in query(
    prompt="Hello",
    options=ClaudeAgentOptions(
        system_prompt="You are a helpful coding assistant"
    )
):
    print(message)
```

</CodeGroup>

**Pourquoi ce changement :** Offre un meilleur contrôle et une meilleure isolation pour les applications SDK. Vous pouvez maintenant construire des agents avec un comportement personnalisé sans hériter des instructions axées sur l'interface CLI de Claude Code.

### Les sources de paramètres ne sont plus chargées par défaut

**Ce qui a changé :** Le SDK ne lit plus les paramètres du système de fichiers (CLAUDE.md, settings.json, commandes slash, etc.) par défaut.

**Migration :**

<CodeGroup>

```typescript TypeScript
// AVANT (v0.0.x) - Chargeait tous les paramètres automatiquement
const result = query({ prompt: "Hello" });
// Lirait à partir de :
// - ~/.claude/settings.json (utilisateur)
// - .claude/settings.json (projet)
// - .claude/settings.local.json (local)
// - Fichiers CLAUDE.md
// - Commandes slash personnalisées

// APRÈS (v0.1.0) - Aucun paramètre chargé par défaut
// Pour obtenir l'ancien comportement :
const result = query({
  prompt: "Hello",
  options: {
    settingSources: ["user", "project", "local"]
  }
});

// Ou charger uniquement des sources spécifiques :
const result = query({
  prompt: "Hello",
  options: {
    settingSources: ["project"]  // Uniquement les paramètres du projet
  }
});
```

```python Python
# AVANT (v0.0.x) - Chargeait tous les paramètres automatiquement
async for message in query(prompt="Hello"):
    print(message)
# Lirait à partir de :
# - ~/.claude/settings.json (utilisateur)
# - .claude/settings.json (projet)
# - .claude/settings.local.json (local)
# - Fichiers CLAUDE.md
# - Commandes slash personnalisées

# APRÈS (v0.1.0) - Aucun paramètre chargé par défaut
# Pour obtenir l'ancien comportement :
from claude_agent_sdk import query, ClaudeAgentOptions

async for message in query(
    prompt="Hello",
    options=ClaudeAgentOptions(
        setting_sources=["user", "project", "local"]
    )
):
    print(message)

# Ou charger uniquement des sources spécifiques :
async for message in query(
    prompt="Hello",
    options=ClaudeAgentOptions(
        setting_sources=["project"]  # Uniquement les paramètres du projet
    )
):
    print(message)
```

</CodeGroup>

**Pourquoi ce changement :** Garantit que les applications SDK ont un comportement prévisible indépendant des configurations du système de fichiers local. C'est particulièrement important pour :
- **Environnements CI/CD** - Comportement cohérent sans personnalisations locales
- **Applications déployées** - Aucune dépendance aux paramètres du système de fichiers
- **Tests** - Environnements de test isolés
- **Systèmes multi-locataires** - Empêcher les fuites de paramètres entre utilisateurs

<Note>
**Compatibilité rétroactive :** Si votre application dépendait des paramètres du système de fichiers (commandes slash personnalisées, instructions CLAUDE.md, etc.), ajoutez `settingSources: ['user', 'project', 'local']` à vos options.
</Note>

## Pourquoi ce changement de nom ?

Le SDK Claude Code a été conçu à l'origine pour les tâches de codage, mais il a évolué en un cadre puissant pour construire tous les types d'agents IA. Le nouveau nom « Claude Agent SDK » reflète mieux ses capacités :

- Construire des agents métier (assistants juridiques, conseillers financiers, support client)
- Créer des agents de codage spécialisés (bots SRE, examinateurs de sécurité, agents d'examen de code)
- Développer des agents personnalisés pour n'importe quel domaine avec utilisation d'outils, intégration MCP, et plus

## Obtenir de l'aide

Si vous rencontrez des problèmes lors de la migration :

**Pour TypeScript/JavaScript :**

1. Vérifiez que tous les imports sont mis à jour pour utiliser `@anthropic-ai/claude-agent-sdk`
2. Vérifiez que votre package.json a le nouveau nom de package
3. Exécutez `npm install` pour vous assurer que les dépendances sont mises à jour

**Pour Python :**

1. Vérifiez que tous les imports sont mis à jour pour utiliser `claude_agent_sdk`
2. Vérifiez que votre requirements.txt ou pyproject.toml a le nouveau nom de package
3. Exécutez `pip install claude-agent-sdk` pour vous assurer que le package est installé

## Prochaines étapes

- Explorez l'[Aperçu d'Agent SDK](/docs/fr/agent-sdk/overview) pour en savoir plus sur les fonctionnalités disponibles
- Consultez la [Référence SDK TypeScript](/docs/fr/agent-sdk/typescript) pour la documentation détaillée de l'API
- Consultez la [Référence SDK Python](/docs/fr/agent-sdk/python) pour la documentation spécifique à Python
- Découvrez les [Outils personnalisés](/docs/fr/agent-sdk/custom-tools) et l'[Intégration MCP](/docs/fr/agent-sdk/mcp)