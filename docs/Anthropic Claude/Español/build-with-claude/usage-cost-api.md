# API de Uso y Costo

Accede programáticamente a los datos de uso de API y costo de tu organización con la API de Administración de Uso y Costo.

---

<Tip>
**The Admin API is unavailable for individual accounts.** To collaborate with teammates and add members, set up your organization in **Console → Settings → Organization**.
</Tip>

La API de Administración de Uso y Costo proporciona acceso programático y granular a datos históricos de uso de API y costo para tu organización. Estos datos son similares a la información disponible en las páginas de [Uso](/usage) y [Costo](/cost) de la Consola de Claude.

Esta API te permite monitorear, analizar y optimizar mejor tus implementaciones de Claude:

* **Seguimiento Preciso de Uso:** Obtén conteos exactos de tokens y patrones de uso en lugar de depender únicamente del conteo de tokens de respuesta
* **Reconciliación de Costos:** Coincide registros internos con la facturación de Anthropic para equipos de finanzas y contabilidad
* **Rendimiento del producto y mejora:** Monitorea el rendimiento del producto mientras mides si los cambios en el sistema lo han mejorado, o configura alertas
* **Optimización de [límite de velocidad](/docs/es/api/rate-limits) y [Nivel de Prioridad](/docs/es/api/service-tiers#get-started-with-priority-tier):** Optimiza características como [almacenamiento en caché de prompts](/docs/es/build-with-claude/prompt-caching) o prompts específicos para aprovechar al máximo tu capacidad asignada, o compra capacidad dedicada.
* **Análisis Avanzado:** Realiza análisis de datos más profundos que los disponibles en la Consola

<Check>
  **Se requiere clave de API de Administración**
  
  Esta API es parte de la [API de Administración](/docs/es/build-with-claude/administration-api). Estos endpoints requieren una clave de API de Administración (que comienza con `sk-ant-admin...`) que difiere de las claves de API estándar. Solo los miembros de la organización con rol de administrador pueden provisionar claves de API de Administración a través de la [Consola de Claude](/settings/admin-keys).
</Check>

## Soluciones de socios

Las plataformas de observabilidad líderes ofrecen integraciones listas para usar para monitorear tu uso de API de Claude y costo, sin necesidad de escribir código personalizado. Estas integraciones proporcionan paneles, alertas y análisis para ayudarte a gestionar tu uso de API de manera efectiva.

<CardGroup cols={3}>
  <Card title="CloudZero" icon="chart" href="https://docs.cloudzero.com/docs/connections-anthropic">
    Plataforma de inteligencia en la nube para rastrear y pronosticar costos
  </Card>
  <Card title="Datadog" icon="chart" href="https://docs.datadoghq.com/integrations/anthropic/">
    Observabilidad de LLM con rastreo y monitoreo automáticos
  </Card>
  <Card title="Grafana Cloud" icon="chart" href="https://grafana.com/docs/grafana-cloud/monitor-infrastructure/integrations/integration-reference/integration-anthropic/">
    Integración sin agente para observabilidad fácil de LLM con paneles y alertas listos para usar
  </Card>
  <Card title="Honeycomb" icon="polygon" href="https://docs.honeycomb.io/integrations/anthropic-usage-monitoring/">
    Consultas avanzadas y visualización a través de OpenTelemetry
  </Card>
  <Card title="Vantage" icon="chart" href="https://docs.vantage.sh/connecting_anthropic">
    Plataforma FinOps para observabilidad de costo y uso de LLM
  </Card>
</CardGroup>

## Inicio rápido

Obtén el uso diario de tu organización para los últimos 7 días:

```bash
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-08T00:00:00Z&\
ending_at=2025-01-15T00:00:00Z&\
bucket_width=1d" \
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

## API de Uso

Rastrea el consumo de tokens en toda tu organización con desgloses detallados por modelo, espacio de trabajo y nivel de servicio con el endpoint `/v1/organizations/usage_report/messages`.

### Conceptos clave

- **Buckets de tiempo**: Agrega datos de uso en intervalos fijos (`1m`, `1h`, o `1d`)
- **Seguimiento de tokens**: Mide tokens de entrada sin caché, entrada en caché, creación de caché y tokens de salida
- **Filtrado y agrupación**: Filtra por clave de API, espacio de trabajo, modelo, nivel de servicio o ventana de contexto, y agrupa resultados por estas dimensiones
- **Uso de herramientas del servidor**: Rastrea el uso de herramientas del lado del servidor como búsqueda web

Para detalles completos de parámetros y esquemas de respuesta, consulta la [referencia de API de Uso](/docs/es/api/admin-api/usage-cost/get-messages-usage-report).

### Ejemplos básicos

#### Uso diario por modelo

```bash
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-01T00:00:00Z&\
ending_at=2025-01-08T00:00:00Z&\
group_by[]=model&\
bucket_width=1d" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

#### Uso por hora con filtrado

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

#### Filtra el uso por claves de API y espacios de trabajo

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
Para recuperar los IDs de clave de API de tu organización, usa el endpoint [Listar Claves de API](/docs/es/api/admin-api/apikeys/list-api-keys).

Para recuperar los IDs de espacio de trabajo de tu organización, usa el endpoint [Listar Espacios de Trabajo](/docs/es/api/admin-api/workspaces/list-workspaces), o encuentra los IDs de espacio de trabajo de tu organización en la Consola de Anthropic.
</Tip>

### Límites de granularidad de tiempo

| Granularidad | Límite Predeterminado | Límite Máximo | Caso de Uso |
|-------------|---------------|---------------|----------|
| `1m` | 60 buckets | 1440 buckets | Monitoreo en tiempo real |
| `1h` | 24 buckets | 168 buckets | Patrones diarios |
| `1d` | 7 buckets | 31 buckets | Reportes semanales/mensuales |

## API de Costo

Recupera desgloses de costo a nivel de servicio en USD con el endpoint `/v1/organizations/cost_report`.

### Conceptos clave

- **Moneda**: Todos los costos en USD, reportados como cadenas decimales en unidades más bajas (centavos)
- **Tipos de costo**: Rastrea costos de uso de tokens, búsqueda web y ejecución de código
- **Agrupación**: Agrupa costos por espacio de trabajo o descripción para desgloses detallados
- **Buckets de tiempo**: Solo granularidad diaria (`1d`)

Para detalles completos de parámetros y esquemas de respuesta, consulta la [referencia de API de Costo](/docs/es/api/admin-api/usage-cost/get-cost-report).

<Warning>
  Los costos del Nivel de Prioridad utilizan un modelo de facturación diferente y no se incluyen en el endpoint de costo. Rastrea el uso del Nivel de Prioridad a través del endpoint de uso en su lugar.
</Warning>

### Ejemplo básico

```bash
curl "https://api.anthropic.com/v1/organizations/cost_report?\
starting_at=2025-01-01T00:00:00Z&\
ending_at=2025-01-31T00:00:00Z&\
group_by[]=workspace_id&\
group_by[]=description" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

## Paginación

Ambos endpoints soportan paginación para conjuntos de datos grandes:

1. Realiza tu solicitud inicial
2. Si `has_more` es `true`, usa el valor `next_page` en tu siguiente solicitud
3. Continúa hasta que `has_more` sea `false`

```bash
# Primera solicitud
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-01T00:00:00Z&\
ending_at=2025-01-31T00:00:00Z&\
limit=7" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"

# La respuesta incluye: "has_more": true, "next_page": "page_xyz..."

# Siguiente solicitud con paginación
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-01T00:00:00Z&\
ending_at=2025-01-31T00:00:00Z&\
limit=7&\
page=page_xyz..." \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

## Casos de uso comunes

Explora implementaciones detalladas en [anthropic-cookbook](https://github.com/anthropics/anthropic-cookbook):

- **Reportes de uso diario**: Rastrea tendencias de consumo de tokens
- **Atribución de costos**: Asigna gastos por espacio de trabajo para devoluciones de cargo
- **Eficiencia de caché**: Mide y optimiza el almacenamiento en caché de prompts
- **Monitoreo de presupuesto**: Configura alertas para umbrales de gasto
- **Exportación CSV**: Genera reportes para equipos de finanzas

## Preguntas frecuentes

### ¿Qué tan frescos son los datos?
Los datos de uso y costo típicamente aparecen dentro de 5 minutos después de la finalización de la solicitud de API, aunque los retrasos ocasionalmente pueden ser más largos.

### ¿Cuál es la frecuencia de sondeo recomendada?
La API soporta sondeo una vez por minuto para uso sostenido. Para ráfagas cortas (por ejemplo, descargar datos paginados), el sondeo más frecuente es aceptable. Almacena en caché los resultados para paneles que necesitan actualizaciones frecuentes.

### ¿Cómo rastro el uso de ejecución de código?
Los costos de ejecución de código aparecen en el endpoint de costo agrupados bajo `Code Execution Usage` en el campo de descripción. La ejecución de código no se incluye en el endpoint de uso.

### ¿Cómo rastro el uso del Nivel de Prioridad?
Filtra o agrupa por `service_tier` en el endpoint de uso y busca el valor `priority`. Los costos del Nivel de Prioridad no están disponibles en el endpoint de costo.

### ¿Qué sucede con el uso de Workbench?
El uso de API desde Workbench no está asociado con una clave de API, por lo que `api_key_id` será `null` incluso cuando se agrupe por esa dimensión.

### ¿Cómo se representa el espacio de trabajo predeterminado?
El uso y los costos atribuidos al espacio de trabajo predeterminado tienen un valor `null` para `workspace_id`.

### ¿Cómo obtengo desgloses de costo por usuario para Claude Code?

Usa la [API de Análisis de Claude Code](/docs/es/build-with-claude/claude-code-analytics-api), que proporciona costos estimados por usuario y métricas de productividad sin las limitaciones de rendimiento de desglosar costos por muchas claves de API. Para uso general de API con muchas claves, usa la [API de Uso](#usage-api) para rastrear el consumo de tokens como un proxy de costo.

## Ver también
Las APIs de Uso y Costo se pueden usar para ayudarte a entregar una mejor experiencia para tus usuarios, ayudarte a gestionar costos y preservar tu límite de velocidad. Aprende más sobre algunas de estas otras características:

- [Descripción general de API de Administración](/docs/es/build-with-claude/administration-api)
- [Referencia de API de Administración](/docs/es/api/admin)
- [Precios](/docs/es/about-claude/pricing)
- [Almacenamiento en caché de prompts](/docs/es/build-with-claude/prompt-caching) - Optimiza costos con almacenamiento en caché
- [Procesamiento por lotes](/docs/es/build-with-claude/batch-processing) - 50% de descuento en solicitudes por lotes
- [Límites de velocidad](/docs/es/api/rate-limits) - Comprende los niveles de uso