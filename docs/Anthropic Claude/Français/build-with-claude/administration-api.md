# Aperçu de l'API Admin

Gérez programmatiquement les ressources de votre organisation, notamment les membres, les espaces de travail et les clés API.

---

<Tip>
**The Admin API is unavailable for individual accounts.** To collaborate with teammates and add members, set up your organization in **Console → Settings → Organization**.
</Tip>

L'[API Admin](/docs/fr/api/admin) vous permet de gérer programmatiquement les ressources de votre organisation, notamment les membres de l'organisation, les espaces de travail et les clés API. Cela fournit un contrôle programmatique sur les tâches administratives qui nécessiteraient autrement une configuration manuelle dans la [Console Claude](/).

<Check>
  **L'API Admin nécessite un accès spécial**

  L'API Admin nécessite une clé API Admin spéciale (commençant par `sk-ant-admin...`) qui diffère des clés API standard. Seuls les membres de l'organisation ayant le rôle d'administrateur peuvent provisionner les clés API Admin via la Console Claude.
</Check>

## Comment fonctionne l'API Admin

Lorsque vous utilisez l'API Admin :

1. Vous effectuez des requêtes en utilisant votre clé API Admin dans l'en-tête `x-api-key`
2. L'API vous permet de gérer :
   - Les membres de l'organisation et leurs rôles
   - Les invitations des membres de l'organisation
   - Les espaces de travail et leurs membres
   - Les clés API

Ceci est utile pour :
- Automatiser l'intégration/suppression des utilisateurs
- Gérer programmatiquement l'accès à l'espace de travail
- Surveiller et gérer l'utilisation des clés API

## Rôles et permissions au niveau de l'organisation

Il y a cinq rôles au niveau de l'organisation. Voir plus de détails [ici](https://support.claude.com/en/articles/10186004-api-console-roles-and-permissions).

| Rôle | Permissions |
|------|-------------|
| user | Peut utiliser Workbench |
| claude_code_user | Peut utiliser Workbench et [Claude Code](https://code.claude.com/docs/en/overview) |
| developer | Peut utiliser Workbench et gérer les clés API |
| billing | Peut utiliser Workbench et gérer les détails de facturation |
| admin | Peut faire tout ce qui précède, plus gérer les utilisateurs |

## Concepts clés

### Membres de l'organisation

Vous pouvez lister les [membres de l'organisation](/docs/fr/api/admin-api/users/get-user), mettre à jour les rôles des membres et supprimer des membres.

<CodeGroup>
```bash Shell
# Lister les membres de l'organisation
curl "https://api.anthropic.com/v1/organizations/users?limit=10" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# Mettre à jour le rôle du membre
curl "https://api.anthropic.com/v1/organizations/users/{user_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{"role": "developer"}'

# Supprimer le membre
curl --request DELETE "https://api.anthropic.com/v1/organizations/users/{user_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"
```

</CodeGroup>

### Invitations de l'organisation

Vous pouvez inviter des utilisateurs aux organisations et gérer ces [invitations](/docs/fr/api/admin-api/invites/get-invite).

<CodeGroup>

```bash Shell
# Créer une invitation
curl --request POST "https://api.anthropic.com/v1/organizations/invites" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{
    "email": "newuser@domain.com",
    "role": "developer"
  }'

# Lister les invitations
curl "https://api.anthropic.com/v1/organizations/invites?limit=10" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# Supprimer l'invitation
curl --request DELETE "https://api.anthropic.com/v1/organizations/invites/{invite_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"
```

</CodeGroup>

### Espaces de travail

Créez et gérez les [espaces de travail](/docs/fr/api/admin-api/workspaces/get-workspace) ([console](/settings/workspaces)) pour organiser vos ressources :

<CodeGroup>

```bash Shell
# Créer un espace de travail
curl --request POST "https://api.anthropic.com/v1/organizations/workspaces" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{"name": "Production"}'

# Lister les espaces de travail
curl "https://api.anthropic.com/v1/organizations/workspaces?limit=10&include_archived=false" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# Archiver l'espace de travail
curl --request POST "https://api.anthropic.com/v1/organizations/workspaces/{workspace_id}/archive" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"
```

</CodeGroup>

### Membres de l'espace de travail

Gérez l'[accès des utilisateurs à des espaces de travail spécifiques](/docs/fr/api/admin-api/workspace_members/get-workspace-member) :

<CodeGroup>

```bash Shell
# Ajouter un membre à l'espace de travail
curl --request POST "https://api.anthropic.com/v1/organizations/workspaces/{workspace_id}/members" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{
    "user_id": "user_xxx",
    "workspace_role": "workspace_developer"
  }'

# Lister les membres de l'espace de travail
curl "https://api.anthropic.com/v1/organizations/workspaces/{workspace_id}/members?limit=10" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# Mettre à jour le rôle du membre
curl --request POST "https://api.anthropic.com/v1/organizations/workspaces/{workspace_id}/members/{user_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{
    "workspace_role": "workspace_admin"
  }'

# Supprimer un membre de l'espace de travail
curl --request DELETE "https://api.anthropic.com/v1/organizations/workspaces/{workspace_id}/members/{user_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"
```

</CodeGroup>

### Clés API

Surveillez et gérez les [clés API](/docs/fr/api/admin-api/apikeys/get-api-key) :

<CodeGroup>

```bash Shell
# Lister les clés API
curl "https://api.anthropic.com/v1/organizations/api_keys?limit=10&status=active&workspace_id=wrkspc_xxx" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# Mettre à jour la clé API
curl --request POST "https://api.anthropic.com/v1/organizations/api_keys/{api_key_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{
    "status": "inactive",
    "name": "New Key Name"
  }'
```

</CodeGroup>

## Accès aux informations de l'organisation

Obtenez des informations sur votre organisation programmatiquement avec le point de terminaison `/v1/organizations/me`.

Par exemple :

```bash
curl "https://api.anthropic.com/v1/organizations/me" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

```json
{
  "id": "12345678-1234-5678-1234-567812345678",
  "type": "organization",
  "name": "Organization Name"
}
```

Ce point de terminaison est utile pour déterminer programmatiquement à quelle organisation appartient une clé API Admin.

Pour les détails complets des paramètres et les schémas de réponse, consultez la [référence de l'API Informations sur l'organisation](/docs/fr/api/admin-api/organization/get-me).

## Accès aux rapports d'utilisation et de coûts

Pour accéder aux rapports d'utilisation et de coûts de votre organisation, utilisez les points de terminaison de l'API Utilisation et Coûts :

- Le [**point de terminaison Utilisation**](/docs/fr/build-with-claude/usage-cost-api#usage-api) (`/v1/organizations/usage_report/messages`) fournit des données d'utilisation détaillées, notamment les décomptes de jetons et les métriques de requête, regroupées par diverses dimensions telles que l'espace de travail, l'utilisateur et le modèle.
- Le [**point de terminaison Coûts**](/docs/fr/build-with-claude/usage-cost-api#cost-api) (`/v1/organizations/cost_report`) fournit les données de coûts associées à l'utilisation de votre organisation, vous permettant de suivre les dépenses et d'allouer les coûts par espace de travail ou description.

Ces points de terminaison fournissent des informations détaillées sur l'utilisation de votre organisation et les coûts associés.

## Accès aux analyses Claude Code

Pour les organisations utilisant Claude Code, l'[**API Claude Code Analytics**](/docs/fr/build-with-claude/claude-code-analytics-api) fournit des métriques de productivité détaillées et des informations d'utilisation :

- Le [**point de terminaison Claude Code Analytics**](/docs/fr/build-with-claude/claude-code-analytics-api) (`/v1/organizations/usage_report/claude_code`) fournit des métriques agrégées quotidiennement pour l'utilisation de Claude Code, notamment les sessions, les lignes de code, les commits, les demandes de tirage, les statistiques d'utilisation des outils et les données de coûts ventilées par utilisateur et modèle.

Cette API vous permet de suivre la productivité des développeurs, d'analyser l'adoption de Claude Code et de créer des tableaux de bord personnalisés pour votre organisation.

## Bonnes pratiques

Pour utiliser efficacement l'API Admin :

- Utilisez des noms et des descriptions significatifs pour les espaces de travail et les clés API
- Implémentez une gestion appropriée des erreurs pour les opérations échouées
- Auditez régulièrement les rôles et les permissions des membres
- Nettoyez les espaces de travail inutilisés et les invitations expirées
- Surveillez l'utilisation des clés API et renouvelez les clés périodiquement

## FAQ

<section title="Quelles permissions sont nécessaires pour utiliser l'API Admin ?">

Seuls les membres de l'organisation ayant le rôle d'administrateur peuvent utiliser l'API Admin. Ils doivent également avoir une clé API Admin spéciale (commençant par `sk-ant-admin`).

</section>

<section title="Puis-je créer de nouvelles clés API via l'API Admin ?">

Non, les nouvelles clés API ne peuvent être créées que via la Console Claude pour des raisons de sécurité. L'API Admin ne peut que gérer les clés API existantes.

</section>

<section title="Que se passe-t-il pour les clés API lors de la suppression d'un utilisateur ?">

Les clés API persistent dans leur état actuel car elles sont limitées à l'organisation, pas aux utilisateurs individuels.

</section>

<section title="Les administrateurs de l'organisation peuvent-ils être supprimés via l'API ?">

Non, les membres de l'organisation ayant le rôle d'administrateur ne peuvent pas être supprimés via l'API pour des raisons de sécurité.

</section>

<section title="Combien de temps durent les invitations de l'organisation ?">

Les invitations de l'organisation expirent après 21 jours. Il n'y a actuellement aucun moyen de modifier cette période d'expiration.

</section>

<section title="Y a-t-il des limites sur les espaces de travail ?">

Oui, vous pouvez avoir un maximum de 100 espaces de travail par organisation. Les espaces de travail archivés ne comptent pas vers cette limite.

</section>

<section title="Qu'est-ce que l'espace de travail par défaut ?">

Chaque organisation a un « espace de travail par défaut » qui ne peut pas être modifié ou supprimé et n'a pas d'ID. Cet espace de travail n'apparaît pas dans les points de terminaison de liste des espaces de travail.

</section>

<section title="Comment les rôles de l'organisation affectent-ils l'accès à l'espace de travail ?">

Les administrateurs de l'organisation obtiennent automatiquement le rôle `workspace_admin` pour tous les espaces de travail. Les membres de facturation de l'organisation obtiennent automatiquement le rôle `workspace_billing`. Les utilisateurs et développeurs de l'organisation doivent être ajoutés manuellement à chaque espace de travail.

</section>

<section title="Quels rôles peuvent être attribués dans les espaces de travail ?">

Les utilisateurs et développeurs de l'organisation peuvent se voir attribuer les rôles `workspace_admin`, `workspace_developer` ou `workspace_user`. Le rôle `workspace_billing` ne peut pas être attribué manuellement - il est hérité du fait d'avoir le rôle `billing` de l'organisation.

</section>

<section title="Les rôles d'espace de travail des administrateurs ou des membres de facturation de l'organisation peuvent-ils être modifiés ?">

Seuls les membres de facturation de l'organisation peuvent voir leur rôle d'espace de travail amélioré à un rôle d'administrateur. Sinon, les administrateurs et les membres de facturation de l'organisation ne peuvent pas avoir leurs rôles d'espace de travail modifiés ou être supprimés des espaces de travail tant qu'ils détiennent ces rôles d'organisation. L'accès à l'espace de travail doit être modifié en changeant d'abord leur rôle d'organisation.

</section>

<section title="Que se passe-t-il pour l'accès à l'espace de travail lorsque les rôles de l'organisation changent ?">

Si un administrateur ou un membre de facturation de l'organisation est rétrogradé en utilisateur ou développeur, il perd l'accès à tous les espaces de travail sauf ceux où des rôles lui ont été attribués manuellement. Lorsque les utilisateurs sont promus aux rôles d'administrateur ou de facturation, ils obtiennent un accès automatique à tous les espaces de travail.

</section>