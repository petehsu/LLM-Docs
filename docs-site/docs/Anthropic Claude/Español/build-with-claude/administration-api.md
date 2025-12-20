# Descripción general de la API de administración

Descripción general de la API de administración de Anthropic para gestionar miembros de la organización, espacios de trabajo y claves API

---

<Tip>
**The Admin API is unavailable for individual accounts.** To collaborate with teammates and add members, set up your organization in **Console → Settings → Organization**.
</Tip>

La [API de administración](/docs/es/api/admin) te permite gestionar programáticamente los recursos de tu organización, incluyendo miembros de la organización, espacios de trabajo y claves API. Esto proporciona control programático sobre tareas administrativas que de otro modo requerirían configuración manual en la [Consola Claude](/).

<Check>
  **La API de administración requiere acceso especial**

  La API de administración requiere una clave API de administración especial (que comienza con `sk-ant-admin...`) que difiere de las claves API estándar. Solo los miembros de la organización con el rol de administrador pueden provisionar claves API de administración a través de la Consola Claude.
</Check>

## Cómo funciona la API de administración

Cuando usas la API de administración:

1. Realizas solicitudes usando tu clave API de administración en el encabezado `x-api-key`
2. La API te permite gestionar:
   - Miembros de la organización y sus roles
   - Invitaciones de miembros de la organización
   - Espacios de trabajo y sus miembros
   - Claves API

Esto es útil para:
- Automatizar la incorporación/desincorporación de usuarios
- Gestionar programáticamente el acceso al espacio de trabajo
- Monitorear y gestionar el uso de claves API

## Roles y permisos de la organización

Hay cinco roles a nivel de organización. Consulta más detalles [aquí](https://support.claude.com/en/articles/10186004-api-console-roles-and-permissions).

| Rol | Permisos |
|------|-------------|
| user | Puede usar Workbench |
| claude_code_user | Puede usar Workbench y [Claude Code](https://code.claude.com/docs/en/overview) |
| developer | Puede usar Workbench y gestionar claves API |
| billing | Puede usar Workbench y gestionar detalles de facturación |
| admin | Puede hacer todo lo anterior, además de gestionar usuarios |

## Conceptos clave

### Miembros de la organización

Puedes [listar miembros de la organización](/docs/es/api/admin-api/users/get-user), actualizar roles de miembros y eliminar miembros.

<CodeGroup>
```bash Shell
# List organization members
curl "https://api.anthropic.com/v1/organizations/users?limit=10" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# Update member role
curl "https://api.anthropic.com/v1/organizations/users/{user_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{"role": "developer"}'

# Remove member
curl --request DELETE "https://api.anthropic.com/v1/organizations/users/{user_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"
```

</CodeGroup>

### Invitaciones de la organización

Puedes invitar usuarios a organizaciones y gestionar esas [invitaciones](/docs/es/api/admin-api/invites/get-invite).

<CodeGroup>

```bash Shell
# Create invite
curl --request POST "https://api.anthropic.com/v1/organizations/invites" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{
    "email": "newuser@domain.com",
    "role": "developer"
  }'

# List invites
curl "https://api.anthropic.com/v1/organizations/invites?limit=10" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# Delete invite
curl --request DELETE "https://api.anthropic.com/v1/organizations/invites/{invite_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"
```

</CodeGroup>

### Espacios de trabajo

Crea y gestiona [espacios de trabajo](/docs/es/api/admin-api/workspaces/get-workspace) ([consola](/settings/workspaces)) para organizar tus recursos:

<CodeGroup>

```bash Shell
# Create workspace
curl --request POST "https://api.anthropic.com/v1/organizations/workspaces" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{"name": "Production"}'

# List workspaces
curl "https://api.anthropic.com/v1/organizations/workspaces?limit=10&include_archived=false" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# Archive workspace
curl --request POST "https://api.anthropic.com/v1/organizations/workspaces/{workspace_id}/archive" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"
```

</CodeGroup>

### Miembros del espacio de trabajo

Gestiona [el acceso de usuarios a espacios de trabajo específicos](/docs/es/api/admin-api/workspace_members/get-workspace-member):

<CodeGroup>

```bash Shell
# Add member to workspace
curl --request POST "https://api.anthropic.com/v1/organizations/workspaces/{workspace_id}/members" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{
    "user_id": "user_xxx",
    "workspace_role": "workspace_developer"
  }'

# List workspace members
curl "https://api.anthropic.com/v1/organizations/workspaces/{workspace_id}/members?limit=10" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# Update member role
curl --request POST "https://api.anthropic.com/v1/organizations/workspaces/{workspace_id}/members/{user_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{
    "workspace_role": "workspace_admin"
  }'

# Remove member from workspace
curl --request DELETE "https://api.anthropic.com/v1/organizations/workspaces/{workspace_id}/members/{user_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"
```

</CodeGroup>

### Claves API

Monitorea y gestiona [claves API](/docs/es/api/admin-api/apikeys/get-api-key):

<CodeGroup>

```bash Shell
# List API keys
curl "https://api.anthropic.com/v1/organizations/api_keys?limit=10&status=active&workspace_id=wrkspc_xxx" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# Update API key
curl --request POST "https://api.anthropic.com/v1/organizations/api_keys/{api_key_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{
    "status": "inactive",
    "name": "New Key Name"
  }'
```

</CodeGroup>

## Acceso a la información de la organización

Obtén información sobre tu organización programáticamente con el punto final `/v1/organizations/me`.

Por ejemplo:

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

Este punto final es útil para determinar programáticamente a qué organización pertenece una clave API de administración.

Para obtener detalles completos de parámetros y esquemas de respuesta, consulta la [referencia de la API de información de la organización](/docs/es/api/admin-api/organization/get-me).

## Acceso a informes de uso y costo

Para acceder a informes de uso y costo de tu organización, utiliza los puntos finales de la API de uso y costo:

- El [**punto final de uso**](/docs/es/build-with-claude/usage-cost-api#usage-api) (`/v1/organizations/usage_report/messages`) proporciona datos de uso detallados, incluyendo conteos de tokens y métricas de solicitudes, agrupados por varias dimensiones como espacio de trabajo, usuario y modelo.
- El [**punto final de costo**](/docs/es/build-with-claude/usage-cost-api#cost-api) (`/v1/organizations/cost_report`) proporciona datos de costo asociados con el uso de tu organización, permitiéndote rastrear gastos y asignar costos por espacio de trabajo o descripción.

Estos puntos finales proporcionan información detallada sobre el uso de tu organización y los costos asociados.

## Acceso a análisis de Claude Code

Para organizaciones que utilizan Claude Code, la [**API de análisis de Claude Code**](/docs/es/build-with-claude/claude-code-analytics-api) proporciona métricas de productividad detalladas e información de uso:

- El [**punto final de análisis de Claude Code**](/docs/es/build-with-claude/claude-code-analytics-api) (`/v1/organizations/usage_report/claude_code`) proporciona métricas agregadas diarias para el uso de Claude Code, incluyendo sesiones, líneas de código, confirmaciones, solicitudes de extracción, estadísticas de uso de herramientas y datos de costo desglosados por usuario y modelo.

Esta API te permite rastrear la productividad de los desarrolladores, analizar la adopción de Claude Code y crear paneles personalizados para tu organización.

## Mejores prácticas

Para usar efectivamente la API de administración:

- Usa nombres y descripciones significativos para espacios de trabajo y claves API
- Implementa manejo de errores adecuado para operaciones fallidas
- Audita regularmente los roles y permisos de los miembros
- Limpia espacios de trabajo no utilizados e invitaciones expiradas
- Monitorea el uso de claves API y rota las claves periódicamente

## Preguntas frecuentes

<section title="¿Qué permisos se necesitan para usar la API de administración?">

Solo los miembros de la organización con el rol de administrador pueden usar la API de administración. También deben tener una clave API de administración especial (que comienza con `sk-ant-admin`).

</section>

<section title="¿Puedo crear nuevas claves API a través de la API de administración?">

No, las nuevas claves API solo se pueden crear a través de la Consola Claude por razones de seguridad. La API de administración solo puede gestionar claves API existentes.

</section>

<section title="¿Qué sucede con las claves API al eliminar un usuario?">

Las claves API persisten en su estado actual ya que están limitadas a la organización, no a usuarios individuales.

</section>

<section title="¿Se pueden eliminar administradores de la organización a través de la API?">

No, los miembros de la organización con el rol de administrador no se pueden eliminar a través de la API por razones de seguridad.

</section>

<section title="¿Cuánto tiempo duran las invitaciones de la organización?">

Las invitaciones de la organización expiran después de 21 días. Actualmente no hay forma de modificar este período de expiración.

</section>

<section title="¿Hay límites en los espacios de trabajo?">

Sí, puedes tener un máximo de 100 espacios de trabajo por organización. Los espacios de trabajo archivados no cuentan hacia este límite.

</section>

<section title="¿Qué es el espacio de trabajo predeterminado?">

Cada organización tiene un "espacio de trabajo predeterminado" que no se puede editar ni eliminar, y no tiene ID. Este espacio de trabajo no aparece en los puntos finales de lista de espacios de trabajo.

</section>

<section title="¿Cómo afectan los roles de la organización al acceso del espacio de trabajo?">

Los administradores de la organización obtienen automáticamente el rol `workspace_admin` en todos los espacios de trabajo. Los miembros de facturación de la organización obtienen automáticamente el rol `workspace_billing`. Los usuarios y desarrolladores de la organización deben agregarse manualmente a cada espacio de trabajo.

</section>

<section title="¿Qué roles se pueden asignar en espacios de trabajo?">

Los usuarios y desarrolladores de la organización pueden asignarse roles `workspace_admin`, `workspace_developer` o `workspace_user`. El rol `workspace_billing` no se puede asignar manualmente - se hereda de tener el rol de facturación de la organización.

</section>

<section title="¿Se pueden cambiar los roles de espacio de trabajo de los administradores o miembros de facturación de la organización?">

Solo los miembros de facturación de la organización pueden tener su rol de espacio de trabajo mejorado a un rol de administrador. De lo contrario, los administradores y miembros de facturación de la organización no pueden tener sus roles de espacio de trabajo cambiados ni ser eliminados de espacios de trabajo mientras mantengan esos roles de organización. El acceso al espacio de trabajo debe modificarse cambiando primero su rol de organización.

</section>

<section title="¿Qué sucede con el acceso al espacio de trabajo cuando cambian los roles de la organización?">

Si un administrador de la organización o miembro de facturación es degradado a usuario o desarrollador, pierden acceso a todos los espacios de trabajo excepto aquellos donde se les asignaron roles manualmente. Cuando los usuarios se promocionan a roles de administrador o facturación, obtienen acceso automático a todos los espacios de trabajo.

</section>