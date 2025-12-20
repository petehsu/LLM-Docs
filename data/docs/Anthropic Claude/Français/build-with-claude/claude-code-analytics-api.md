# API d'analyse Claude Code

Accédez par programmation aux analyses d'utilisation de Claude Code de votre organisation et aux métriques de productivité avec l'API Admin d'analyse Claude Code.

---

<Tip>
**The Admin API is unavailable for individual accounts.** To collaborate with teammates and add members, set up your organization in **Console → Settings → Organization**.
</Tip>

L'API Admin d'analyse Claude Code fournit un accès programmatique aux métriques d'utilisation quotidiennes agrégées pour les utilisateurs de Claude Code, permettant aux organisations d'analyser la productivité des développeurs et de créer des tableaux de bord personnalisés. Cette API comble le fossé entre notre [tableau de bord Analytics](/claude-code) basique et l'intégration OpenTelemetry complexe.

Cette API vous permet de mieux surveiller, analyser et optimiser votre adoption de Claude Code :

* **Analyse de la productivité des développeurs :** Suivez les sessions, les lignes de code ajoutées/supprimées, les commits et les demandes de fusion créées à l'aide de Claude Code
* **Métriques d'utilisation des outils :** Surveillez les taux d'acceptation et de rejet pour différents outils Claude Code (Edit, Write, NotebookEdit)
* **Analyse des coûts :** Consultez les coûts estimés et l'utilisation des jetons ventilés par modèle Claude
* **Rapports personnalisés :** Exportez les données pour créer des tableaux de bord exécutifs et des rapports pour les équipes de direction
* **Justification de l'utilisation :** Fournissez des métriques pour justifier et étendre l'adoption de Claude Code en interne

<Check>
  **Clé API Admin requise**
  
  Cette API fait partie de l'[API Admin](/docs/fr/build-with-claude/administration-api). Ces points de terminaison nécessitent une clé API Admin (commençant par `sk-ant-admin...`) qui diffère des clés API standard. Seuls les membres de l'organisation ayant le rôle d'administrateur peuvent provisionner les clés API Admin via la [Console Claude](/settings/admin-keys).
</Check>

## Démarrage rapide

Obtenez les analyses Claude Code de votre organisation pour un jour spécifique :

```bash
curl "https://api.anthropic.com/v1/organizations/usage_report/claude_code?\
starting_at=2025-09-08&\
limit=20" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

<Tip>
  **Définissez un en-tête User-Agent pour les intégrations**
  
  Si vous créez une intégration, définissez votre en-tête User-Agent pour nous aider à comprendre les modèles d'utilisation :
  ```
  User-Agent: YourApp/1.0.0 (https://yourapp.com)
  ```
</Tip>

## API d'analyse Claude Code

Suivez l'utilisation de Claude Code, les métriques de productivité et l'activité des développeurs dans votre organisation avec le point de terminaison `/v1/organizations/usage_report/claude_code`.

### Concepts clés

- **Agrégation quotidienne** : Retourne les métriques pour un seul jour spécifié par le paramètre `starting_at`
- **Données au niveau utilisateur** : Chaque enregistrement représente l'activité d'un utilisateur pour le jour spécifié
- **Métriques de productivité** : Suivez les sessions, les lignes de code, les commits, les demandes de fusion et l'utilisation des outils
- **Données de jetons et de coûts** : Surveillez l'utilisation et les coûts estimés ventilés par modèle Claude
- **Pagination basée sur les curseurs** : Gérez les grands ensembles de données avec une pagination stable utilisant des curseurs opaques
- **Fraîcheur des données** : Les métriques sont disponibles avec un délai pouvant aller jusqu'à 1 heure pour la cohérence

Pour les détails complets des paramètres et les schémas de réponse, consultez la [référence de l'API d'analyse Claude Code](/docs/fr/api/admin-api/claude-code/get-claude-code-usage-report).

### Exemples de base

#### Obtenir les analyses pour un jour spécifique

```bash
curl "https://api.anthropic.com/v1/organizations/usage_report/claude_code?\
starting_at=2025-09-08" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

#### Obtenir les analyses avec pagination

```bash
# Première requête
curl "https://api.anthropic.com/v1/organizations/usage_report/claude_code?\
starting_at=2025-09-08&\
limit=20" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"

# Requête suivante utilisant le curseur de la réponse
curl "https://api.anthropic.com/v1/organizations/usage_report/claude_code?\
starting_at=2025-09-08&\
page=page_MjAyNS0wNS0xNFQwMDowMDowMFo=" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

### Paramètres de requête

| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `starting_at` | string | Oui | Date UTC au format YYYY-MM-DD. Retourne les métriques pour ce seul jour |
| `limit` | integer | Non | Nombre d'enregistrements par page (par défaut : 20, max : 1000) |
| `page` | string | Non | Jeton de curseur opaque du champ `next_page` de la réponse précédente |

### Métriques disponibles

Chaque enregistrement de réponse contient les métriques suivantes pour un seul utilisateur sur un seul jour :

#### Dimensions
- **date** : Date au format RFC 3339 (horodatage UTC)
- **actor** : L'utilisateur ou la clé API qui a effectué les actions Claude Code (soit `user_actor` avec `email_address`, soit `api_actor` avec `api_key_name`)
- **organization_id** : UUID de l'organisation
- **customer_type** : Type de compte client (`api` pour les clients API, `subscription` pour les clients Pro/Team)
- **terminal_type** : Type de terminal ou d'environnement où Claude Code a été utilisé (par exemple, `vscode`, `iTerm.app`, `tmux`)

#### Métriques principales
- **num_sessions** : Nombre de sessions Claude Code distinctes initiées par cet acteur
- **lines_of_code.added** : Nombre total de lignes de code ajoutées dans tous les fichiers par Claude Code
- **lines_of_code.removed** : Nombre total de lignes de code supprimées dans tous les fichiers par Claude Code
- **commits_by_claude_code** : Nombre de commits git créés via la fonctionnalité de commit de Claude Code
- **pull_requests_by_claude_code** : Nombre de demandes de fusion créées via la fonctionnalité PR de Claude Code

#### Métriques d'action des outils
Ventilation des taux d'acceptation et de rejet des actions des outils par type d'outil :
- **edit_tool.accepted/rejected** : Nombre de propositions d'outil Edit que l'utilisateur a acceptées/rejetées
- **write_tool.accepted/rejected** : Nombre de propositions d'outil Write que l'utilisateur a acceptées/rejetées
- **notebook_edit_tool.accepted/rejected** : Nombre de propositions d'outil NotebookEdit que l'utilisateur a acceptées/rejetées

#### Ventilation par modèle
Pour chaque modèle Claude utilisé :
- **model** : Identifiant du modèle Claude (par exemple, `claude-sonnet-4-5-20250929`)
- **tokens.input/output** : Nombre de jetons d'entrée et de sortie pour ce modèle
- **tokens.cache_read/cache_creation** : Utilisation des jetons liée au cache pour ce modèle
- **estimated_cost.amount** : Coût estimé en cents USD pour ce modèle
- **estimated_cost.currency** : Code de devise pour le montant du coût (actuellement toujours `USD`)

### Structure de la réponse

L'API retourne les données au format suivant :

```json
{
  "data": [
    {
      "date": "2025-09-01T00:00:00Z",
      "actor": {
        "type": "user_actor",
        "email_address": "developer@company.com"
      },
      "organization_id": "dc9f6c26-b22c-4831-8d01-0446bada88f1",
      "customer_type": "api",
      "terminal_type": "vscode",
      "core_metrics": {
        "num_sessions": 5,
        "lines_of_code": {
          "added": 1543,
          "removed": 892
        },
        "commits_by_claude_code": 12,
        "pull_requests_by_claude_code": 2
      },
      "tool_actions": {
        "edit_tool": {
          "accepted": 45,
          "rejected": 5
        },
        "multi_edit_tool": {
          "accepted": 12,
          "rejected": 2
        },
        "write_tool": {
          "accepted": 8,
          "rejected": 1
        },
        "notebook_edit_tool": {
          "accepted": 3,
          "rejected": 0
        }
      },
      "model_breakdown": [
        {
          "model": "claude-sonnet-4-5-20250929",
          "tokens": {
            "input": 100000,
            "output": 35000,
            "cache_read": 10000,
            "cache_creation": 5000
          },
          "estimated_cost": {
            "currency": "USD",
            "amount": 1025
          }
        }
      ]
    }
  ],
  "has_more": false,
  "next_page": null
}
```

## Pagination

L'API prend en charge la pagination basée sur les curseurs pour les organisations ayant un grand nombre d'utilisateurs :

1. Effectuez votre requête initiale avec le paramètre `limit` optionnel
2. Si `has_more` est `true` dans la réponse, utilisez la valeur `next_page` dans votre requête suivante
3. Continuez jusqu'à ce que `has_more` soit `false`

Le curseur encode la position du dernier enregistrement et assure une pagination stable même à mesure que de nouvelles données arrivent. Chaque session de pagination maintient une limite de données cohérente pour garantir que vous ne manquez ou ne dupliquez pas d'enregistrements.

## Cas d'utilisation courants

- **Tableaux de bord exécutifs** : Créez des rapports de haut niveau montrant l'impact de Claude Code sur la vélocité de développement
- **Comparaison des outils IA** : Exportez les métriques pour comparer Claude Code avec d'autres outils de codage IA comme Copilot et Cursor
- **Analyse de la productivité des développeurs** : Suivez les métriques de productivité individuelles et d'équipe au fil du temps
- **Suivi et allocation des coûts** : Surveillez les modèles de dépenses et allouez les coûts par équipe ou projet
- **Surveillance de l'adoption** : Identifiez les équipes et les utilisateurs qui tirent le plus de valeur de Claude Code
- **Justification du ROI** : Fournissez des métriques concrètes pour justifier et étendre l'adoption de Claude Code en interne

## Questions fréquemment posées

### Quelle est la fraîcheur des données d'analyse ?
Les données d'analyse Claude Code apparaissent généralement dans l'heure suivant la fin de l'activité de l'utilisateur. Pour assurer des résultats de pagination cohérents, seules les données antérieures à 1 heure sont incluses dans les réponses.

### Puis-je obtenir des métriques en temps réel ?
Non, cette API fournit uniquement des métriques quotidiennes agrégées. Pour la surveillance en temps réel, envisagez d'utiliser l'[intégration OpenTelemetry](https://code.claude.com/docs/en/monitoring-usage).

### Comment les utilisateurs sont-ils identifiés dans les données ?
Les utilisateurs sont identifiés via le champ `actor` de deux façons :
- **`user_actor`** : Contient `email_address` pour les utilisateurs qui s'authentifient via OAuth (le plus courant)
- **`api_actor`** : Contient `api_key_name` pour les utilisateurs qui s'authentifient via clé API

Le champ `customer_type` indique si l'utilisation provient de clients `api` (API PAYG) ou de clients `subscription` (plans Pro/Team).

### Quelle est la période de rétention des données ?
Les données historiques d'analyse Claude Code sont conservées et accessibles via l'API. Il n'y a pas de période de suppression spécifiée pour ces données.

### Quels déploiements Claude Code sont pris en charge ?
Cette API suit uniquement l'utilisation de Claude Code sur l'API Claude (1ère partie). L'utilisation sur Amazon Bedrock, Google Vertex AI ou d'autres plates-formes tierces n'est pas incluse.

### Quel est le coût d'utilisation de cette API ?
L'API d'analyse Claude Code est gratuite pour toutes les organisations ayant accès à l'API Admin.

### Comment calculer les taux d'acceptation des outils ?
Taux d'acceptation des outils = `accepted / (accepted + rejected)` pour chaque type d'outil. Par exemple, si l'outil d'édition affiche 45 acceptés et 5 rejetés, le taux d'acceptation est de 90 %.

### Quel fuseau horaire est utilisé pour le paramètre de date ?
Toutes les dates sont en UTC. Le paramètre `starting_at` doit être au format YYYY-MM-DD et représente minuit UTC pour ce jour.

## Voir aussi

L'API d'analyse Claude Code vous aide à comprendre et à optimiser le flux de travail de développement de votre équipe. En savoir plus sur les fonctionnalités connexes :

- [Aperçu de l'API Admin](/docs/fr/build-with-claude/administration-api)
- [Référence de l'API Admin](/docs/fr/api/admin)
- [Tableau de bord d'analyse Claude Code](/claude-code)
- [API d'utilisation et de coûts](/docs/fr/build-with-claude/usage-cost-api) - Suivez l'utilisation de l'API sur tous les services Anthropic
- [Gestion des identités et des accès](https://code.claude.com/docs/en/iam)
- [Surveillance de l'utilisation avec OpenTelemetry](https://code.claude.com/docs/en/monitoring-usage) pour les métriques personnalisées et les alertes