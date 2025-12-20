# API d'utilisation et de coûts

Accédez par programmation aux données d'utilisation et de coûts de l'API de votre organisation avec l'API Admin d'utilisation et de coûts.

---

<Tip>
**The Admin API is unavailable for individual accounts.** To collaborate with teammates and add members, set up your organization in **Console → Settings → Organization**.
</Tip>

L'API Admin d'utilisation et de coûts fournit un accès programmatique et granulaire aux données historiques d'utilisation et de coûts de l'API pour votre organisation. Ces données sont similaires aux informations disponibles dans les pages [Utilisation](/usage) et [Coûts](/cost) de la Claude Console.

Cette API vous permet de mieux surveiller, analyser et optimiser vos implémentations Claude :

* **Suivi précis de l'utilisation :** Obtenez des comptages de jetons précis et des modèles d'utilisation au lieu de vous fier uniquement au comptage des jetons de réponse
* **Réconciliation des coûts :** Faites correspondre les enregistrements internes avec la facturation Anthropic pour les équipes financières et comptables
* **Performance et amélioration des produits :** Surveillez la performance des produits tout en mesurant si les modifications du système l'ont améliorée, ou configurez des alertes
* **Optimisation des [limites de débit](/docs/fr/api/rate-limits) et du [niveau de priorité](/docs/fr/api/service-tiers#get-started-with-priority-tier) :** Optimisez des fonctionnalités comme la [mise en cache des invites](/docs/fr/build-with-claude/prompt-caching) ou des invites spécifiques pour tirer le meilleur parti de votre capacité allouée, ou achetez une capacité dédiée.
* **Analyse avancée :** Effectuez une analyse de données plus approfondie que celle disponible dans Console

<Check>
  **Clé API Admin requise**
  
  Cette API fait partie de l'[API Admin](/docs/fr/build-with-claude/administration-api). Ces points de terminaison nécessitent une clé API Admin (commençant par `sk-ant-admin...`) qui diffère des clés API standard. Seuls les membres de l'organisation ayant le rôle d'administrateur peuvent provisionner les clés API Admin via la [Claude Console](/settings/admin-keys).
</Check>

## Solutions partenaires

Les principales plateformes d'observabilité offrent des intégrations prêtes à l'emploi pour surveiller votre utilisation et vos coûts de l'API Claude, sans écrire de code personnalisé. Ces intégrations fournissent des tableaux de bord, des alertes et des analyses pour vous aider à gérer efficacement votre utilisation de l'API.

<CardGroup cols={3}>
  <Card title="CloudZero" icon="chart" href="https://docs.cloudzero.com/docs/connections-anthropic">
    Plateforme d'intelligence cloud pour le suivi et la prévision des coûts
  </Card>
  <Card title="Datadog" icon="chart" href="https://docs.datadoghq.com/integrations/anthropic/">
    Observabilité LLM avec traçage et surveillance automatiques
  </Card>
  <Card title="Grafana Cloud" icon="chart" href="https://grafana.com/docs/grafana-cloud/monitor-infrastructure/integrations/integration-reference/integration-anthropic/">
    Intégration sans agent pour une observabilité LLM facile avec des tableaux de bord et des alertes prêts à l'emploi
  </Card>
  <Card title="Honeycomb" icon="polygon" href="https://docs.honeycomb.io/integrations/anthropic-usage-monitoring/">
    Requêtes avancées et visualisation via OpenTelemetry
  </Card>
  <Card title="Vantage" icon="chart" href="https://docs.vantage.sh/connecting_anthropic">
    Plateforme FinOps pour l'observabilité des coûts et de l'utilisation des LLM
  </Card>
</CardGroup>

## Démarrage rapide

Obtenez l'utilisation quotidienne de votre organisation pour les 7 derniers jours :

```bash
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-08T00:00:00Z&\
ending_at=2025-01-15T00:00:00Z&\
bucket_width=1d" \
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

## API d'utilisation

Suivez la consommation de jetons dans votre organisation avec des ventilations détaillées par modèle, espace de travail et niveau de service avec le point de terminaison `/v1/organizations/usage_report/messages`.

### Concepts clés

- **Buckets temporels** : Agrégez les données d'utilisation à intervalles fixes (`1m`, `1h` ou `1d`)
- **Suivi des jetons** : Mesurez les jetons d'entrée non mis en cache, les jetons d'entrée mis en cache, la création de cache et les jetons de sortie
- **Filtrage et regroupement** : Filtrez par clé API, espace de travail, modèle, niveau de service ou fenêtre contextuelle, et regroupez les résultats selon ces dimensions
- **Utilisation des outils serveur** : Suivez l'utilisation des outils côté serveur comme la recherche web

Pour les détails complets des paramètres et les schémas de réponse, consultez la [référence de l'API d'utilisation](/docs/fr/api/admin-api/usage-cost/get-messages-usage-report).

### Exemples de base

#### Utilisation quotidienne par modèle

```bash
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-01T00:00:00Z&\
ending_at=2025-01-08T00:00:00Z&\
group_by[]=model&\
bucket_width=1d" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

#### Utilisation horaire avec filtrage

```bash
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-15T00:00:00Z&\
ending_at=2025-01-15T23:59:59Z&\
models[]=claude-sonnet-4-5-20250929&\
service_tiers[]=batch&\
context_window[]=0-200k&\
bucket_width=1h" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

#### Filtrer l'utilisation par clés API et espaces de travail

```bash
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-01T00:00:00Z&\
ending_at=2025-01-08T00:00:00Z&\
api_key_ids[]=apikey_01Rj2N8SVvo6BePZj99NhmiT&\
api_key_ids[]=apikey_01ABC123DEF456GHI789JKL&\
workspace_ids[]=wrkspc_01JwQvzr7rXLA5AGx3HKfFUJ&\
workspace_ids[]=wrkspc_01XYZ789ABC123DEF456MNO&\
bucket_width=1d" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

<Tip>
Pour récupérer les ID de clés API de votre organisation, utilisez le point de terminaison [List API Keys](/docs/fr/api/admin-api/apikeys/list-api-keys).

Pour récupérer les ID d'espaces de travail de votre organisation, utilisez le point de terminaison [List Workspaces](/docs/fr/api/admin-api/workspaces/list-workspaces), ou trouvez les ID d'espaces de travail de votre organisation dans la Console Anthropic.
</Tip>

### Limites de granularité temporelle

| Granularité | Limite par défaut | Limite maximale | Cas d'utilisation |
|-------------|-------------------|-----------------|-------------------|
| `1m` | 60 buckets | 1440 buckets | Surveillance en temps réel |
| `1h` | 24 buckets | 168 buckets | Modèles quotidiens |
| `1d` | 7 buckets | 31 buckets | Rapports hebdomadaires/mensuels |

## API de coûts

Récupérez les ventilations des coûts au niveau du service en USD avec le point de terminaison `/v1/organizations/cost_report`.

### Concepts clés

- **Devise** : Tous les coûts en USD, rapportés sous forme de chaînes décimales dans les unités les plus basses (centimes)
- **Types de coûts** : Suivez les coûts d'utilisation des jetons, de recherche web et d'exécution de code
- **Regroupement** : Regroupez les coûts par espace de travail ou description pour des ventilations détaillées
- **Buckets temporels** : Granularité quotidienne uniquement (`1d`)

Pour les détails complets des paramètres et les schémas de réponse, consultez la [référence de l'API de coûts](/docs/fr/api/admin-api/usage-cost/get-cost-report).

<Warning>
  Les coûts du niveau de priorité utilisent un modèle de facturation différent et ne sont pas inclus dans le point de terminaison des coûts. Suivez l'utilisation du niveau de priorité via le point de terminaison d'utilisation à la place.
</Warning>

### Exemple de base

```bash
curl "https://api.anthropic.com/v1/organizations/cost_report?\
starting_at=2025-01-01T00:00:00Z&\
ending_at=2025-01-31T00:00:00Z&\
group_by[]=workspace_id&\
group_by[]=description" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

## Pagination

Les deux points de terminaison prennent en charge la pagination pour les grands ensembles de données :

1. Effectuez votre demande initiale
2. Si `has_more` est `true`, utilisez la valeur `next_page` dans votre demande suivante
3. Continuez jusqu'à ce que `has_more` soit `false`

```bash
# Première demande
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-01T00:00:00Z&\
ending_at=2025-01-31T00:00:00Z&\
limit=7" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"

# La réponse inclut : "has_more": true, "next_page": "page_xyz..."

# Demande suivante avec pagination
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-01T00:00:00Z&\
ending_at=2025-01-31T00:00:00Z&\
limit=7&\
page=page_xyz..." \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

## Cas d'utilisation courants

Explorez les implémentations détaillées dans [anthropic-cookbook](https://github.com/anthropics/anthropic-cookbook) :

- **Rapports d'utilisation quotidiens** : Suivez les tendances de consommation de jetons
- **Attribution des coûts** : Allouez les dépenses par espace de travail pour les rétrofacturations
- **Efficacité du cache** : Mesurez et optimisez la mise en cache des invites
- **Surveillance du budget** : Configurez des alertes pour les seuils de dépenses
- **Export CSV** : Générez des rapports pour les équipes financières

## Questions fréquemment posées

### Quelle est la fraîcheur des données ?
Les données d'utilisation et de coûts apparaissent généralement dans les 5 minutes suivant l'achèvement de la demande d'API, bien que les délais puissent occasionnellement être plus longs.

### Quelle est la fréquence d'interrogation recommandée ?
L'API prend en charge l'interrogation une fois par minute pour une utilisation soutenue. Pour les rafales courtes (par exemple, le téléchargement de données paginées), une interrogation plus fréquente est acceptable. Mettez en cache les résultats pour les tableaux de bord qui nécessitent des mises à jour fréquentes.

### Comment puis-je suivre l'utilisation de l'exécution de code ?
Les coûts d'exécution de code apparaissent dans le point de terminaison des coûts regroupés sous `Code Execution Usage` dans le champ description. L'exécution de code n'est pas incluse dans le point de terminaison d'utilisation.

### Comment puis-je suivre l'utilisation du niveau de priorité ?
Filtrez ou regroupez par `service_tier` dans le point de terminaison d'utilisation et recherchez la valeur `priority`. Les coûts du niveau de priorité ne sont pas disponibles dans le point de terminaison des coûts.

### Que se passe-t-il avec l'utilisation de Workbench ?
L'utilisation de l'API à partir de Workbench n'est pas associée à une clé API, donc `api_key_id` sera `null` même lors du regroupement par cette dimension.

### Comment l'espace de travail par défaut est-il représenté ?
L'utilisation et les coûts attribués à l'espace de travail par défaut ont une valeur `null` pour `workspace_id`.

### Comment puis-je obtenir des ventilations des coûts par utilisateur pour Claude Code ?

Utilisez l'[API Claude Code Analytics](/docs/fr/build-with-claude/claude-code-analytics-api), qui fournit les coûts estimés par utilisateur et les métriques de productivité sans les limitations de performance liées à la ventilation des coûts par de nombreuses clés API. Pour l'utilisation générale de l'API avec de nombreuses clés, utilisez l'[API d'utilisation](#usage-api) pour suivre la consommation de jetons comme proxy de coûts.

## Voir aussi
Les API d'utilisation et de coûts peuvent être utilisées pour vous aider à offrir une meilleure expérience à vos utilisateurs, vous aider à gérer les coûts et préserver votre limite de débit. En savoir plus sur certaines de ces autres fonctionnalités :

- [Aperçu de l'API Admin](/docs/fr/build-with-claude/administration-api)
- [Référence de l'API Admin](/docs/fr/api/admin)
- [Tarification](/docs/fr/about-claude/pricing)
- [Mise en cache des invites](/docs/fr/build-with-claude/prompt-caching) - Optimisez les coûts avec la mise en cache
- [Traitement par lots](/docs/fr/build-with-claude/batch-processing) - Réduction de 50 % sur les demandes par lots
- [Limites de débit](/docs/fr/api/rate-limits) - Comprendre les niveaux d'utilisation