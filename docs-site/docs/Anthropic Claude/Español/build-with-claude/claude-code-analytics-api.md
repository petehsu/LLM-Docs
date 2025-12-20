# API de Análisis de Claude Code

Accede programáticamente a las métricas de análisis de uso de Claude Code de tu organización y métricas de productividad con la API de Administración de Análisis de Claude Code.

---

<Tip>
**The Admin API is unavailable for individual accounts.** To collaborate with teammates and add members, set up your organization in **Console → Settings → Organization**.
</Tip>

La API de Análisis de Claude Code de Administración proporciona acceso programático a métricas de uso diarias agregadas para usuarios de Claude Code, permitiendo a las organizaciones analizar la productividad de los desarrolladores y crear paneles personalizados. Esta API cierra la brecha entre nuestro [panel de Análisis](/claude-code) básico y la integración compleja de OpenTelemetry.

Esta API te permite monitorear, analizar y optimizar mejor tu adopción de Claude Code:

* **Análisis de Productividad de Desarrolladores:** Rastrear sesiones, líneas de código añadidas/eliminadas, commits y solicitudes de extracción creadas usando Claude Code
* **Métricas de Uso de Herramientas:** Monitorear tasas de aceptación y rechazo para diferentes herramientas de Claude Code (Edit, Write, NotebookEdit)
* **Análisis de Costos:** Ver costos estimados y uso de tokens desglosados por modelo de Claude
* **Reportes Personalizados:** Exportar datos para crear paneles ejecutivos e informes para equipos de gestión
* **Justificación de Uso:** Proporcionar métricas para justificar y expandir la adopción de Claude Code internamente

<Check>
  **Clave API de Administración requerida**
  
  Esta API es parte de la [API de Administración](/docs/es/build-with-claude/administration-api). Estos endpoints requieren una clave API de Administración (comenzando con `sk-ant-admin...`) que difiere de las claves API estándar. Solo los miembros de la organización con el rol de administrador pueden provisionar claves API de Administración a través de la [Consola de Claude](/settings/admin-keys).
</Check>

## Inicio rápido

Obtén los análisis de Claude Code de tu organización para un día específico:

```bash
curl "https://api.anthropic.com/v1/organizations/usage_report/claude_code?\
starting_at=2025-09-08&\
limit=20" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

<Tip>
  **Establece un encabezado User-Agent para integraciones**
  
  Si estás construyendo una integración, establece tu encabezado User-Agent para ayudarnos a entender los patrones de uso:
  ```
  User-Agent: YourApp/1.0.0 (https://yourapp.com)
  ```
</Tip>

## API de Análisis de Claude Code

Rastrear el uso de Claude Code, métricas de productividad y actividad de desarrolladores en tu organización con el endpoint `/v1/organizations/usage_report/claude_code`.

### Conceptos clave

- **Agregación diaria**: Devuelve métricas para un único día especificado por el parámetro `starting_at`
- **Datos a nivel de usuario**: Cada registro representa la actividad de un usuario para el día especificado
- **Métricas de productividad**: Rastrear sesiones, líneas de código, commits, solicitudes de extracción y uso de herramientas
- **Datos de token y costo**: Monitorear uso y costos estimados desglosados por modelo de Claude
- **Paginación basada en cursor**: Manejar grandes conjuntos de datos con paginación estable usando cursores opacos
- **Actualización de datos**: Las métricas están disponibles con un retraso de hasta 1 hora para consistencia

Para detalles completos de parámetros y esquemas de respuesta, consulta la [referencia de la API de Análisis de Claude Code](/docs/es/api/admin-api/claude-code/get-claude-code-usage-report).

### Ejemplos básicos

#### Obtener análisis para un día específico

```bash
curl "https://api.anthropic.com/v1/organizations/usage_report/claude_code?\
starting_at=2025-09-08" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

#### Obtener análisis con paginación

```bash
# Primera solicitud
curl "https://api.anthropic.com/v1/organizations/usage_report/claude_code?\
starting_at=2025-09-08&\
limit=20" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"

# Solicitud posterior usando cursor de la respuesta
curl "https://api.anthropic.com/v1/organizations/usage_report/claude_code?\
starting_at=2025-09-08&\
page=page_MjAyNS0wNS0xNFQwMDowMDowMFo=" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

### Parámetros de solicitud

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|----------|-------------|
| `starting_at` | string | Sí | Fecha UTC en formato YYYY-MM-DD. Devuelve métricas solo para este día |
| `limit` | integer | No | Número de registros por página (predeterminado: 20, máximo: 1000) |
| `page` | string | No | Token de cursor opaco del campo `next_page` de la respuesta anterior |

### Métricas disponibles

Cada registro de respuesta contiene las siguientes métricas para un único usuario en un único día:

#### Dimensiones
- **date**: Fecha en formato RFC 3339 (marca de tiempo UTC)
- **actor**: El usuario o clave API que realizó las acciones de Claude Code (ya sea `user_actor` con `email_address` o `api_actor` con `api_key_name`)
- **organization_id**: UUID de la organización
- **customer_type**: Tipo de cuenta de cliente (`api` para clientes de API, `subscription` para clientes de Pro/Team)
- **terminal_type**: Tipo de terminal o entorno donde se utilizó Claude Code (por ejemplo, `vscode`, `iTerm.app`, `tmux`)

#### Métricas principales
- **num_sessions**: Número de sesiones distintas de Claude Code iniciadas por este actor
- **lines_of_code.added**: Número total de líneas de código añadidas en todos los archivos por Claude Code
- **lines_of_code.removed**: Número total de líneas de código eliminadas en todos los archivos por Claude Code
- **commits_by_claude_code**: Número de commits de git creados a través de la funcionalidad de commit de Claude Code
- **pull_requests_by_claude_code**: Número de solicitudes de extracción creadas a través de la funcionalidad de PR de Claude Code

#### Métricas de acciones de herramientas
Desglose de tasas de aceptación y rechazo de acciones de herramientas por tipo de herramienta:
- **edit_tool.accepted/rejected**: Número de propuestas de herramienta Edit que el usuario aceptó/rechazó
- **write_tool.accepted/rejected**: Número de propuestas de herramienta Write que el usuario aceptó/rechazó
- **notebook_edit_tool.accepted/rejected**: Número de propuestas de herramienta NotebookEdit que el usuario aceptó/rechazó

#### Desglose de modelo
Para cada modelo de Claude utilizado:
- **model**: Identificador del modelo de Claude (por ejemplo, `claude-sonnet-4-5-20250929`)
- **tokens.input/output**: Conteos de tokens de entrada y salida para este modelo
- **tokens.cache_read/cache_creation**: Uso de tokens relacionados con caché para este modelo
- **estimated_cost.amount**: Costo estimado en centavos USD para este modelo
- **estimated_cost.currency**: Código de moneda para el monto del costo (actualmente siempre `USD`)

### Estructura de respuesta

La API devuelve datos en el siguiente formato:

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

## Paginación

La API admite paginación basada en cursor para organizaciones con grandes números de usuarios:

1. Realiza tu solicitud inicial con parámetro `limit` opcional
2. Si `has_more` es `true` en la respuesta, usa el valor `next_page` en tu siguiente solicitud
3. Continúa hasta que `has_more` sea `false`

El cursor codifica la posición del último registro y asegura paginación estable incluso cuando llegan nuevos datos. Cada sesión de paginación mantiene un límite de datos consistente para asegurar que no pierdas ni dupliques registros.

## Casos de uso comunes

- **Paneles ejecutivos**: Crear informes de alto nivel mostrando el impacto de Claude Code en la velocidad de desarrollo
- **Comparación de herramientas de IA**: Exportar métricas para comparar Claude Code con otras herramientas de codificación de IA como Copilot y Cursor
- **Análisis de productividad de desarrolladores**: Rastrear métricas de productividad individual y de equipo a lo largo del tiempo
- **Seguimiento y asignación de costos**: Monitorear patrones de gasto y asignar costos por equipo o proyecto
- **Monitoreo de adopción**: Identificar qué equipos y usuarios obtienen más valor de Claude Code
- **Justificación de ROI**: Proporcionar métricas concretas para justificar y expandir la adopción de Claude Code internamente

## Preguntas frecuentes

### ¿Qué tan frescos son los datos de análisis?
Los datos de análisis de Claude Code típicamente aparecen dentro de 1 hora de completar la actividad del usuario. Para asegurar resultados de paginación consistentes, solo se incluyen datos más antiguos que 1 hora en las respuestas.

### ¿Puedo obtener métricas en tiempo real?
No, esta API proporciona solo métricas diarias agregadas. Para monitoreo en tiempo real, considera usar la [integración de OpenTelemetry](https://code.claude.com/docs/es/monitoring-usage).

### ¿Cómo se identifican los usuarios en los datos?
Los usuarios se identifican a través del campo `actor` de dos formas:
- **`user_actor`**: Contiene `email_address` para usuarios que se autentican a través de OAuth (más común)
- **`api_actor`**: Contiene `api_key_name` para usuarios que se autentican a través de clave API

El campo `customer_type` indica si el uso es de clientes `api` (API PAYG) o clientes `subscription` (planes Pro/Team).

### ¿Cuál es el período de retención de datos?
Los datos históricos de análisis de Claude Code se retienen y son accesibles a través de la API. No hay un período de eliminación especificado para estos datos.

### ¿Qué implementaciones de Claude Code son compatibles?
Esta API solo rastrea el uso de Claude Code en la API de Claude (1ª parte). El uso en Amazon Bedrock, Google Vertex AI u otras plataformas de terceros no se incluye.

### ¿Cuál es el costo de usar esta API?
La API de Análisis de Claude Code es gratuita para todas las organizaciones con acceso a la API de Administración.

### ¿Cómo calculo las tasas de aceptación de herramientas?
Tasa de aceptación de herramientas = `accepted / (accepted + rejected)` para cada tipo de herramienta. Por ejemplo, si la herramienta de edición muestra 45 aceptadas y 5 rechazadas, la tasa de aceptación es del 90%.

### ¿Qué zona horaria se usa para el parámetro de fecha?
Todas las fechas están en UTC. El parámetro `starting_at` debe estar en formato YYYY-MM-DD y representa la medianoche UTC para ese día.

## Ver también

La API de Análisis de Claude Code te ayuda a entender y optimizar el flujo de trabajo de desarrollo de tu equipo. Aprende más sobre características relacionadas:

- [Descripción general de la API de Administración](/docs/es/build-with-claude/administration-api)
- [Referencia de la API de Administración](/docs/es/api/admin)
- [Panel de Análisis de Claude Code](/claude-code)
- [API de Uso y Costo](/docs/es/build-with-claude/usage-cost-api) - Rastrear el uso de API en todos los servicios de Anthropic
- [Gestión de identidad y acceso](https://code.claude.com/docs/es/iam)
- [Monitoreo de uso con OpenTelemetry](https://code.claude.com/docs/es/monitoring-usage) para métricas personalizadas y alertas