# Appel d'outils programmatique

Permettez à Claude d'appeler vos outils programmatiquement dans un conteneur d'exécution de code, réduisant la latence et la consommation de jetons pour les flux de travail multi-outils.

---

L'appel d'outils programmatique permet à Claude d'écrire du code qui appelle vos outils programmatiquement dans un conteneur [d'exécution de code](/docs/fr/agents-and-tools/tool-use/code-execution-tool), plutôt que de nécessiter des allers-retours à travers le modèle pour chaque invocation d'outil. Cela réduit la latence pour les flux de travail multi-outils et diminue la consommation de jetons en permettant à Claude de filtrer ou de traiter les données avant qu'elles n'atteignent la fenêtre de contexte du modèle.

<Note>
L'appel d'outils programmatique est actuellement en bêta publique.

Pour utiliser cette fonctionnalité, ajoutez l'en-tête bêta `"advanced-tool-use-2025-11-20"` [beta header](/docs/fr/api/beta-headers) à vos requêtes API.

Cette fonctionnalité nécessite que l'outil d'exécution de code soit activé.
</Note>

## Compatibilité des modèles

L'appel d'outils programmatique est disponible sur les modèles suivants :

| Modèle | Version de l'outil |
|-------|--------------|
| Claude Opus 4.5 (`claude-opus-4-5-20251101`) | `code_execution_20250825` |
| Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`) | `code_execution_20250825` |

<Warning>
L'appel d'outils programmatique est disponible via l'API Claude et Microsoft Foundry.
</Warning>

## Démarrage rapide

Voici un exemple simple où Claude interroge programmatiquement une base de données plusieurs fois et agrège les résultats :

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: advanced-tool-use-2025-11-20" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": "Query sales data for the West, East, and Central regions, then tell me which region had the highest revenue"
            }
        ],
        "tools": [
            {
                "type": "code_execution_20250825",
                "name": "code_execution"
            },
            {
                "name": "query_database",
                "description": "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "sql": {
                            "type": "string",
                            "description": "SQL query to execute"
                        }
                    },
                    "required": ["sql"]
                },
                "allowed_callers": ["code_execution_20250825"]
            }
        ]
    }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Query sales data for the West, East, and Central regions, then tell me which region had the highest revenue"
    }],
    tools=[
        {
            "type": "code_execution_20250825",
            "name": "code_execution"
        },
        {
            "name": "query_database",
            "description": "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
            "input_schema": {
                "type": "object",
                "properties": {
                    "sql": {
                        "type": "string",
                        "description": "SQL query to execute"
                    }
                },
                "required": ["sql"]
            },
            "allowed_callers": ["code_execution_20250825"]
        }
    ]
)

print(response)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

async function main() {
  const response = await anthropic.beta.messages.create({
    model: "claude-sonnet-4-5",
    betas: ["advanced-tool-use-2025-11-20"],
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: "Query sales data for the West, East, and Central regions, then tell me which region had the highest revenue"
      }
    ],
    tools: [
      {
        type: "code_execution_20250825",
        name: "code_execution"
      },
      {
        name: "query_database",
        description: "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
        input_schema: {
          type: "object",
          properties: {
            sql: {
              type: "string",
              description: "SQL query to execute"
            }
          },
          required: ["sql"]
        },
        allowed_callers: ["code_execution_20250825"]
      }
    ]
  });

  console.log(response);
}

main().catch(console.error);
```
</CodeGroup>

## Comment fonctionne l'appel d'outils programmatique

Lorsque vous configurez un outil pour être appelable à partir de l'exécution de code et que Claude décide d'utiliser cet outil :

1. Claude écrit du code Python qui invoque l'outil en tant que fonction, incluant potentiellement plusieurs appels d'outils et une logique de pré/post-traitement
2. Claude exécute ce code dans un conteneur en bac à sable via l'exécution de code
3. Lorsqu'une fonction d'outil est appelée, l'exécution de code s'interrompt et l'API retourne un bloc `tool_use`
4. Vous fournissez le résultat de l'outil, et l'exécution de code continue (les résultats intermédiaires ne sont pas chargés dans la fenêtre de contexte de Claude)
5. Une fois que l'exécution de code est terminée, Claude reçoit la sortie finale et continue à travailler sur la tâche

Cette approche est particulièrement utile pour :
- **Traitement de grandes données** : Filtrer ou agréger les résultats des outils avant qu'ils n'atteignent le contexte de Claude
- **Flux de travail multi-étapes** : Économiser des jetons et de la latence en appelant les outils en série ou en boucle sans échantillonner Claude entre les appels d'outils
- **Logique conditionnelle** : Prendre des décisions basées sur les résultats intermédiaires des outils

<Note>
Les outils personnalisés sont convertis en fonctions Python asynchrones pour supporter l'appel parallèle d'outils. Lorsque Claude écrit du code qui appelle vos outils, il utilise `await` (par exemple, `result = await query_database("<sql>")`) et inclut automatiquement la fonction wrapper asynchrone appropriée.

Le wrapper asynchrone est omis des exemples de code dans cette documentation pour plus de clarté.
</Note>

## Concepts clés

### Le champ `allowed_callers`

Le champ `allowed_callers` spécifie quels contextes peuvent invoquer un outil :

```json
{
  "name": "query_database",
  "description": "Execute a SQL query against the database",
  "input_schema": {...},
  "allowed_callers": ["code_execution_20250825"]
}
```

**Valeurs possibles :**
- `["direct"]` - Seul Claude peut appeler cet outil directement (par défaut si omis)
- `["code_execution_20250825"]` - Appelable uniquement à partir de l'exécution de code
- `["direct", "code_execution_20250825"]` - Appelable à la fois directement et à partir de l'exécution de code

<Tip>
Nous recommandons de choisir soit `["direct"]` soit `["code_execution_20250825"]` pour chaque outil plutôt que d'activer les deux, car cela fournit une orientation plus claire à Claude sur la meilleure façon d'utiliser l'outil.
</Tip>

### Le champ `caller` dans les réponses

Chaque bloc d'utilisation d'outil inclut un champ `caller` indiquant comment il a été invoqué :

**Invocation directe (utilisation d'outil traditionnelle) :**
```json
{
  "type": "tool_use",
  "id": "toolu_abc123",
  "name": "query_database",
  "input": {"sql": "<sql>"},
  "caller": {"type": "direct"}
}
```

**Invocation programmatique :**
```json
{
  "type": "tool_use",
  "id": "toolu_xyz789",
  "name": "query_database",
  "input": {"sql": "<sql>"},
  "caller": {
    "type": "code_execution_20250825",
    "tool_id": "srvtoolu_abc123"
  }
}
```

Le `tool_id` référence l'outil d'exécution de code qui a effectué l'appel programmatique.

### Cycle de vie du conteneur

L'appel d'outils programmatique utilise les mêmes conteneurs que l'exécution de code :

- **Création de conteneur** : Un nouveau conteneur est créé pour chaque session sauf si vous en réutilisez un existant
- **Expiration** : Les conteneurs expirent après environ 4,5 minutes d'inactivité (sujet à modification)
- **ID du conteneur** : Retourné dans les réponses via le champ `container`
- **Réutilisation** : Passez l'ID du conteneur pour maintenir l'état entre les requêtes

<Warning>
Lorsqu'un outil est appelé programmatiquement et que le conteneur attend votre résultat d'outil, vous devez répondre avant que le conteneur n'expire. Surveillez le champ `expires_at`. Si le conteneur expire, Claude peut traiter l'appel d'outil comme expiré et le réessayer.
</Warning>

## Flux de travail exemple

Voici comment fonctionne un flux complet d'appel d'outils programmatique :

### Étape 1 : Requête initiale

Envoyez une requête avec l'exécution de code et un outil qui permet l'appel programmatique. Pour activer l'appel programmatique, ajoutez le champ `allowed_callers` à votre définition d'outil.

<Note>
Fournissez des descriptions détaillées du format de sortie de votre outil dans la description de l'outil. Si vous spécifiez que l'outil retourne du JSON, Claude tentera de désérialiser et de traiter le résultat dans le code. Plus vous fournissez de détails sur le schéma de sortie, mieux Claude peut gérer la réponse programmatiquement.
</Note>

<CodeGroup>
```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Query customer purchase history from the last quarter and identify our top 5 customers by revenue"
    }],
    tools=[
        {
            "type": "code_execution_20250825",
            "name": "code_execution"
        },
        {
            "name": "query_database",
            "description": "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
            "input_schema": {...},
            "allowed_callers": ["code_execution_20250825"]
        }
    ]
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  betas: ["advanced-tool-use-2025-11-20"],
  max_tokens: 4096,
  messages: [{
    role: "user",
    content: "Query customer purchase history from the last quarter and identify our top 5 customers by revenue"
  }],
  tools: [
    {
      type: "code_execution_20250825",
      name: "code_execution"
    },
    {
      name: "query_database",
      description: "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
      input_schema: {...},
      allowed_callers: ["code_execution_20250825"]
    }
  ]
});
```
</CodeGroup>

### Étape 2 : Réponse API avec appel d'outil

Claude écrit du code qui appelle votre outil. L'API s'interrompt et retourne :

```json
{
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "I'll query the purchase history and analyze the results."
    },
    {
      "type": "server_tool_use",
      "id": "srvtoolu_abc123",
      "name": "code_execution",
      "input": {
        "code": "results = await query_database('<sql>')\ntop_customers = sorted(results, key=lambda x: x['revenue'], reverse=True)[:5]\nprint(f'Top 5 customers: {top_customers}')"
      }
    },
    {
      "type": "tool_use",
      "id": "toolu_def456",
      "name": "query_database",
      "input": {"sql": "<sql>"},
      "caller": {
        "type": "code_execution_20250825",
        "tool_id": "srvtoolu_abc123"
      }
    }
  ],
  "container": {
    "id": "container_xyz789",
    "expires_at": "2025-01-15T14:30:00Z"
  },
  "stop_reason": "tool_use"
}
```

### Étape 3 : Fournir le résultat de l'outil

Incluez l'historique complet de la conversation plus votre résultat d'outil :

<CodeGroup>
```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=4096,
    container="container_xyz789",  # Reuse the container
    messages=[
        {"role": "user", "content": "Query customer purchase history from the last quarter and identify our top 5 customers by revenue"},
        {
            "role": "assistant",
            "content": [
                {"type": "text", "text": "I'll query the purchase history and analyze the results."},
                {
                    "type": "server_tool_use",
                    "id": "srvtoolu_abc123",
                    "name": "code_execution",
                    "input": {"code": "..."}
                },
                {
                    "type": "tool_use",
                    "id": "toolu_def456",
                    "name": "query_database",
                    "input": {"sql": "<sql>"},
                    "caller": {
                        "type": "code_execution_20250825",
                        "tool_id": "srvtoolu_abc123"
                    }
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "tool_result",
                    "tool_use_id": "toolu_def456",
                    "content": "[{\"customer_id\": \"C1\", \"revenue\": 45000}, {\"customer_id\": \"C2\", \"revenue\": 38000}, ...]"
                }
            ]
        }
    ],
    tools=[...]
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  betas: ["advanced-tool-use-2025-11-20"],
  max_tokens: 4096,
  container: "container_xyz789",  // Reuse the container
  messages: [
    { role: "user", content: "Query customer purchase history from the last quarter and identify our top 5 customers by revenue" },
    {
      role: "assistant",
      content: [
        { type: "text", text: "I'll query the purchase history and analyze the results." },
        {
          type: "server_tool_use",
          id: "srvtoolu_abc123",
          name: "code_execution",
          input: { code: "..." }
        },
        {
          type: "tool_use",
          id: "toolu_def456",
          name: "query_database",
          input: { sql: "<sql>" },
          caller: {
            type: "code_execution_20250825",
            tool_id: "srvtoolu_abc123"
          }
        }
      ]
    },
    {
      role: "user",
      content: [
        {
          type: "tool_result",
          tool_use_id: "toolu_def456",
          content: "[{\"customer_id\": \"C1\", \"revenue\": 45000}, {\"customer_id\": \"C2\", \"revenue\": 38000}, ...]"
        }
      ]
    }
  ],
  tools: [...]
});
```
</CodeGroup>

### Étape 4 : Appel d'outil suivant ou achèvement

L'exécution du code continue et traite les résultats. Si des appels d'outils supplémentaires sont nécessaires, répétez l'étape 3 jusqu'à ce que tous les appels d'outils soient satisfaits.

### Étape 5 : Réponse finale

Une fois que l'exécution du code est terminée, Claude fournit la réponse finale :

```json
{
  "content": [
    {
      "type": "code_execution_tool_result",
      "tool_use_id": "srvtoolu_abc123",
      "content": {
        "type": "code_execution_result",
        "stdout": "Top 5 customers by revenue:\n1. Customer C1: $45,000\n2. Customer C2: $38,000\n3. Customer C5: $32,000\n4. Customer C8: $28,500\n5. Customer C3: $24,000",
        "stderr": "",
        "return_code": 0,
        "content": []
      }
    },
    {
      "type": "text",
      "text": "I've analyzed the purchase history from last quarter. Your top 5 customers generated $167,500 in total revenue, with Customer C1 leading at $45,000."
    }
  ],
  "stop_reason": "end_turn"
}
```

## Modèles avancés

### Traitement par lots avec boucles

Claude peut écrire du code qui traite efficacement plusieurs éléments :

```python
# async wrapper omitted for clarity
regions = ["West", "East", "Central", "North", "South"]
results = {}
for region in regions:
    data = await query_database(f"<sql for {region}>")
    results[region] = sum(row["revenue"] for row in data)

# Process results programmatically
top_region = max(results.items(), key=lambda x: x[1])
print(f"Top region: {top_region[0]} with ${top_region[1]:,} in revenue")
```

Ce modèle :
- Réduit les allers-retours du modèle de N (un par région) à 1
- Traite les grands ensembles de résultats programmatiquement avant de retourner à Claude
- Économise les jetons en retournant uniquement les conclusions agrégées au lieu des données brutes

### Arrêt anticipé

Claude peut arrêter le traitement dès que les critères de succès sont atteints :

```python
# async wrapper omitted for clarity
endpoints = ["us-east", "eu-west", "apac"]
for endpoint in endpoints:
    status = await check_health(endpoint)
    if status == "healthy":
        print(f"Found healthy endpoint: {endpoint}")
        break  # Stop early, don't check remaining
```

### Sélection conditionnelle d'outils

```python
# async wrapper omitted for clarity
file_info = await get_file_info(path)
if file_info["size"] < 10000:
    content = await read_full_file(path)
else:
    content = await read_file_summary(path)
print(content)
```

### Filtrage des données

```python
# async wrapper omitted for clarity
logs = await fetch_logs(server_id)
errors = [log for log in logs if "ERROR" in log]
print(f"Found {len(errors)} errors")
for error in errors[-10:]:  # Only return last 10 errors
    print(error)
```

## Format de réponse

### Appel d'outil programmatique

Lorsque l'exécution de code appelle un outil :

```json
{
  "type": "tool_use",
  "id": "toolu_abc123",
  "name": "query_database",
  "input": {"sql": "<sql>"},
  "caller": {
    "type": "code_execution_20250825",
    "tool_id": "srvtoolu_xyz789"
  }
}
```

### Gestion des résultats d'outils

Votre résultat d'outil est retourné au code en cours d'exécution :

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_abc123",
      "content": "[{\"customer_id\": \"C1\", \"revenue\": 45000, \"orders\": 23}, {\"customer_id\": \"C2\", \"revenue\": 38000, \"orders\": 18}, ...]"
    }
  ]
}
```

### Achèvement de l'exécution du code

Lorsque tous les appels d'outils sont satisfaits et que le code est terminé :

```json
{
  "type": "code_execution_tool_result",
  "tool_use_id": "srvtoolu_xyz789",
  "content": {
    "type": "code_execution_result",
    "stdout": "Analysis complete. Top 5 customers identified from 847 total records.",
    "stderr": "",
    "return_code": 0,
    "content": []
  }
}
```

## Gestion des erreurs

### Erreurs courantes

| Erreur | Description | Solution |
|-------|-------------|----------|
| `invalid_tool_input` | L'entrée de l'outil ne correspond pas au schéma | Validez le input_schema de votre outil |
| `tool_not_allowed` | L'outil ne permet pas le type d'appelant demandé | Vérifiez que `allowed_callers` inclut les bons contextes |
| `missing_beta_header` | En-tête bêta PTC non fourni | Ajoutez les deux en-têtes bêta à votre requête |

### Expiration du conteneur pendant l'appel d'outil

Si votre outil prend trop de temps pour répondre, l'exécution du code recevra une `TimeoutError`. Claude le voit dans stderr et réessayera généralement :

```json
{
  "type": "code_execution_tool_result",
  "tool_use_id": "srvtoolu_abc123",
  "content": {
    "type": "code_execution_result",
    "stdout": "",
    "stderr": "TimeoutError: Calling tool ['query_database'] timed out.",
    "return_code": 0,
    "content": []
  }
}
```

Pour éviter les délais d'expiration :
- Surveillez le champ `expires_at` dans les réponses
- Implémentez des délais d'expiration pour l'exécution de votre outil
- Envisagez de diviser les opérations longues en morceaux plus petits

### Erreurs d'exécution d'outil

Si votre outil retourne une erreur :

```python
# Provide error information in the tool result
{
    "type": "tool_result",
    "tool_use_id": "toolu_abc123",
    "content": "Error: Query timeout - table lock exceeded 30 seconds"
}
```

Le code de Claude recevra cette erreur et peut la gérer de manière appropriée.

## Contraintes et limitations

### Incompatibilités de fonctionnalités

- **Sorties structurées** : Les outils avec `strict: true` ne sont pas supportés avec l'appel programmatique
- **Choix d'outil** : Vous ne pouvez pas forcer l'appel programmatique d'un outil spécifique via `tool_choice`
- **Utilisation parallèle d'outils** : `disable_parallel_tool_use: true` n'est pas supporté avec l'appel programmatique

### Restrictions d'outils

Les outils suivants ne peuvent actuellement pas être appelés programmatiquement, mais le support peut être ajouté dans les versions futures :

- Recherche web
- Récupération web
- Outils fournis par un [connecteur MCP](/docs/fr/agents-and-tools/mcp-connector)

### Restrictions de formatage des messages

Lors de la réponse aux appels d'outils programmatiques, il existe des exigences strictes de formatage :

**Réponses contenant uniquement des résultats d'outils** : S'il y a des appels d'outils programmatiques en attente de résultats, votre message de réponse doit contenir **uniquement** des blocs `tool_result`. Vous ne pouvez pas inclure de contenu textuel, même après les résultats des outils.

```json
// ❌ INVALIDE - Impossible d'inclure du texte lors de la réponse aux appels d'outils programmatiques
{
  "role": "user",
  "content": [
    {"type": "tool_result", "tool_use_id": "toolu_01", "content": "[{\"customer_id\": \"C1\", \"revenue\": 45000}]"},
    {"type": "text", "text": "What should I do next?"}  // This will cause an error
  ]
}

// ✅ VALIDE - Uniquement les résultats d'outils lors de la réponse aux appels d'outils programmatiques
{
  "role": "user",
  "content": [
    {"type": "tool_result", "tool_use_id": "toolu_01", "content": "[{\"customer_id\": \"C1\", \"revenue\": 45000}]"}
  ]
}
```

Cette restriction s'applique uniquement lors de la réponse aux appels d'outils programmatiques (exécution de code). Pour les appels d'outils côté client réguliers, vous pouvez inclure du contenu textuel après les résultats des outils.

### Limites de débit

Les appels d'outils programmatiques sont soumis aux mêmes limites de débit que les appels d'outils réguliers. Chaque appel d'outil à partir de l'exécution de code compte comme une invocation distincte.

### Validez les résultats des outils avant utilisation

Lors de l'implémentation d'outils personnalisés qui seront appelés programmatiquement :

- **Les résultats des outils sont retournés sous forme de chaînes** : Ils peuvent contenir n'importe quel contenu, y compris des extraits de code ou des commandes exécutables qui peuvent être traités par l'environnement d'exécution.
- **Validez les résultats des outils externes** : Si votre outil retourne des données de sources externes ou accepte des entrées utilisateur, soyez conscient des risques d'injection de code si la sortie sera interprétée ou exécutée en tant que code.

## Efficacité des jetons

L'appel d'outils programmatique peut réduire considérablement la consommation de jetons :

- **Les résultats des outils des appels programmatiques ne sont pas ajoutés au contexte de Claude** - seule la sortie finale du code l'est
- **Le traitement intermédiaire se fait dans le code** - le filtrage, l'agrégation, etc. ne consomment pas de jetons du modèle
- **Plusieurs appels d'outils dans une exécution de code** - réduit les frais généraux par rapport aux tours de modèle séparés

Par exemple, appeler 10 outils directement utilise ~10x les jetons d'appeler les outils programmatiquement et retourner un résumé.

## Utilisation et tarification

L'appel d'outils programmatique utilise la même tarification que l'exécution de code. Consultez la [tarification de l'exécution de code](/docs/fr/agents-and-tools/tool-use/code-execution-tool#usage-and-pricing) pour plus de détails.

<Note>
Comptage des jetons pour les appels d'outils programmatiques : Les résultats des outils des invocations programmatiques ne comptent pas vers votre utilisation de jetons d'entrée/sortie. Seul le résultat final de l'exécution du code et la réponse de Claude comptent.
</Note>

## Meilleures pratiques

### Conception d'outils

- **Fournissez des descriptions de sortie détaillées** : Puisque Claude désérialise les résultats des outils dans le code, documentez clairement le format (structure JSON, types de champs, etc.)
- **Retournez des données structurées** : JSON ou d'autres formats facilement analysables fonctionnent mieux pour le traitement programmatique
- **Gardez les réponses concises** : Retournez uniquement les données nécessaires pour minimiser les frais généraux de traitement

### Quand utiliser l'appel programmatique

**Bons cas d'usage :**
- Traitement de grands ensembles de données où vous n'avez besoin que d'agrégats ou de résumés
- Flux de travail multi-étapes avec 3+ appels d'outils dépendants
- Opérations nécessitant le filtrage, le tri ou la transformation des résultats des outils
- Tâches où les données intermédiaires ne doivent pas influencer le raisonnement de Claude
- Opérations parallèles sur de nombreux éléments (par exemple, vérifier 50 points de terminaison)

**Cas d'usage moins idéaux :**
- Appels d'outils uniques avec des réponses simples
- Outils qui nécessitent un retour utilisateur immédiat
- Opérations très rapides où les frais généraux de l'exécution du code dépasseraient le bénéfice

### Optimisation des performances

- **Réutilisez les conteneurs** lors de la création de plusieurs requêtes connexes pour maintenir l'état
- **Regroupez les opérations similaires** dans une seule exécution de code si possible

## Dépannage

### Problèmes courants

**Erreur "Tool not allowed"**
- Vérifiez que votre définition d'outil inclut `"allowed_callers": ["code_execution_20250825"]`
- Vérifiez que vous utilisez les bons en-têtes bêta

**Expiration du conteneur**
- Assurez-vous de répondre aux appels d'outils dans la durée de vie du conteneur (~4,5 minutes)
- Surveillez le champ `expires_at` dans les réponses
- Envisagez d'implémenter une exécution d'outil plus rapide

**Problèmes d'en-tête bêta**
- Vous avez besoin de l'en-tête : `"advanced-tool-use-2025-11-20"`

**Le résultat de l'outil n'est pas analysé correctement**
- Assurez-vous que votre outil retourne des données de chaîne que Claude peut désérialiser
- Fournissez une documentation claire du format de sortie dans la description de votre outil

### Conseils de débogage

1. **Enregistrez tous les appels d'outils et les résultats** pour suivre le flux
2. **Vérifiez le champ `caller`** pour confirmer l'invocation programmatique
3. **Surveillez les ID de conteneur** pour assurer une réutilisation appropriée
4. **Testez les outils indépendamment** avant d'activer l'appel programmatique

## Pourquoi l'appel d'outils programmatique fonctionne

L'entraînement de Claude inclut une exposition extensive au code, ce qui le rend efficace pour raisonner et enchaîner les appels de fonction. Lorsque les outils sont présentés comme des fonctions appelables dans un environnement d'exécution de code, Claude peut exploiter cette force pour :

- **Raisonner naturellement sur la composition d'outils** : Enchaîner les opérations et gérer les dépendances aussi naturellement que d'écrire n'importe quel code Python
- **Traiter efficacement les grands résultats** : Filtrer les grandes sorties d'outils, extraire uniquement les données pertinentes, ou écrire les résultats intermédiaires dans des fichiers avant de retourner des résumés à la fenêtre de contexte
- **Réduire considérablement la latence** : Éliminer les frais généraux de ré-échantillonnage de Claude entre chaque appel d'outil dans les flux de travail multi-étapes

Cette approche permet des flux de travail qui seraient impraticables avec l'utilisation d'outils traditionnelle—comme le traitement de fichiers de plus de 1M jetons—en permettant à Claude de travailler avec les données programmatiquement plutôt que de charger tout dans le contexte de conversation.

## Implémentations alternatives

L'appel d'outils programmatique est un modèle généralisable qui peut être implémenté en dehors de l'exécution de code gérée d'Anthropic. Voici un aperçu des approches :

### Exécution directe côté client

Fournissez à Claude un outil d'exécution de code et décrivez les fonctions disponibles dans cet environnement. Lorsque Claude invoque l'outil avec du code, votre application l'exécute localement où ces fonctions sont définies.

**Avantages :**
- Simple à implémenter avec une réarchitecture minimale
- Contrôle total sur l'environnement et les instructions

**Inconvénients :**
- Exécute du code non fiable en dehors d'un bac à sable
- Les invocations d'outils peuvent être des vecteurs d'injection de code

**À utiliser quand :** Votre application peut exécuter en toute sécurité du code arbitraire, vous voulez une solution simple, et l'offre gérée d'Anthropic ne correspond pas à vos besoins.

### Exécution en bac à sable auto-gérée

Même approche du point de vue de Claude, mais le code s'exécute dans un conteneur en bac à sable avec des restrictions de sécurité (par exemple, pas d'accès réseau sortant). Si vos outils nécessitent des ressources externes, vous aurez besoin d'un protocole pour exécuter les appels d'outils en dehors du bac à sable.

**Avantages :**
- Appel d'outils programmatique sûr sur votre propre infrastructure
- Contrôle total sur l'environnement d'exécution

**Inconvénients :**
- Complexe à construire et à maintenir
- Nécessite de gérer à la fois l'infrastructure et la communication inter-processus

**À utiliser quand :** La sécurité est critique et la solution gérée d'Anthropic ne correspond pas à vos exigences.

### Exécution gérée par Anthropic

L'appel d'outils programmatique d'Anthropic est une version gérée de l'exécution en bac à sable avec un environnement Python opinionné accordé pour Claude. Anthropic gère la gestion des conteneurs, l'exécution du code et la communication sécurisée d'invocation d'outils.

**Avantages :**
- Sûr et sécurisé par défaut
- Facile à activer avec une configuration minimale
- Environnement et instructions optimisés pour Claude

Nous recommandons d'utiliser la solution gérée d'Anthropic si vous utilisez l'API Claude.

## Fonctionnalités connexes

<CardGroup cols={2}>
  <Card title="Code Execution Tool" icon="code" href="/docs/fr/agents-and-tools/tool-use/code-execution-tool">
    Découvrez la capacité d'exécution de code sous-jacente qui alimente l'appel d'outils programmatique.
  </Card>
  <Card title="Tool Use Overview" icon="wrench" href="/docs/fr/agents-and-tools/tool-use/overview">
    Comprenez les principes fondamentaux de l'utilisation d'outils avec Claude.
  </Card>
  <Card title="Implement Tool Use" icon="hammer" href="/docs/fr/agents-and-tools/tool-use/implement-tool-use">
    Guide étape par étape pour implémenter des outils.
  </Card>
</CardGroup>