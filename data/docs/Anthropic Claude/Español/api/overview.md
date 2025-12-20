# Descripción General de la API

La API de Claude es una API RESTful que proporciona acceso programático a los modelos de Claude. Aprende sobre autenticación, SDKs de cliente, límites de velocidad y más.

---

La API de Claude es una API RESTful en `https://api.anthropic.com` que proporciona acceso programático a los modelos de Claude. La API principal es la API de Mensajes (`POST /v1/messages`) para interacciones conversacionales.

<Note>
**¿Nuevo en Claude?** Comienza con [Primeros pasos](/docs/es/get-started) para requisitos previos y tu primera llamada a la API, o consulta [Trabajar con Mensajes](/docs/es/build-with-claude/working-with-messages) para patrones de solicitud/respuesta y ejemplos.
</Note>

## Requisitos previos

Para usar la API de Claude, necesitarás:

- Una [cuenta de Anthropic Console](https://console.anthropic.com)
- Una [clave de API](/settings/keys)

Para obtener instrucciones de configuración paso a paso, consulta [Primeros pasos](/docs/es/get-started).

## APIs disponibles

La API de Claude incluye las siguientes APIs:

**Disponibilidad General:**
- **[API de Mensajes](/docs/es/api/messages)**: Envía mensajes a Claude para interacciones conversacionales (`POST /v1/messages`)
- **[API de Lotes de Mensajes](/docs/es/api/creating-message-batches)**: Procesa grandes volúmenes de solicitudes de Mensajes de forma asincrónica con reducción de costos del 50% (`POST /v1/messages/batches`)
- **[API de Conteo de Tokens](/docs/es/api/messages-count-tokens)**: Cuenta tokens en un mensaje antes de enviar para gestionar costos y límites de velocidad (`POST /v1/messages/count_tokens`)
- **[API de Modelos](/docs/es/api/models-list)**: Lista los modelos de Claude disponibles y sus detalles (`GET /v1/models`)

**Beta:**
- **[API de Archivos](/docs/es/api/files-create)**: Carga y gestiona archivos para usar en múltiples llamadas a la API (`POST /v1/files`, `GET /v1/files`)
- **[API de Habilidades](/docs/es/api/skills/create-skill)**: Crea y gestiona habilidades personalizadas de agentes (`POST /v1/skills`, `GET /v1/skills`)

Para la referencia completa de la API con todos los puntos finales, parámetros y esquemas de respuesta, explora las páginas de referencia de la API listadas en la navegación. Para acceder a características beta, consulta [Encabezados beta](/docs/es/api/beta-headers).

## Autenticación

Todas las solicitudes a la API de Claude deben incluir estos encabezados:

| Encabezado | Valor | Requerido |
|--------|-------|----------|
| `x-api-key` | Tu clave de API de Console | Sí |
| `anthropic-version` | Versión de la API (p. ej., `2023-06-01`) | Sí |
| `content-type` | `application/json` | Sí |

Si estás usando los [SDKs de Cliente](#client-sdks), el SDK enviará estos encabezados automáticamente. Para detalles sobre el versionado de la API, consulta [Versiones de la API](/docs/es/api/versioning).

### Obtener Claves de API

La API está disponible a través de la [Consola](https://console.anthropic.com/) web. Puedes usar [Workbench](https://console.anthropic.com/workbench) para probar la API en el navegador y luego generar claves de API en [Configuración de Cuenta](https://console.anthropic.com/settings/keys). Usa [espacios de trabajo](https://console.anthropic.com/settings/workspaces) para segmentar tus claves de API y [controlar gastos](/docs/es/api/rate-limits) por caso de uso.

## SDKs de Cliente

Anthropic proporciona SDKs oficiales que simplifican la integración de la API manejando autenticación, formato de solicitud, manejo de errores y más.

**Beneficios**:
- Gestión automática de encabezados (x-api-key, anthropic-version, content-type)
- Manejo de solicitudes y respuestas type-safe
- Lógica de reintentos incorporada y manejo de errores
- Soporte de streaming
- Tiempos de espera de solicitud y gestión de conexiones

**Ejemplo** (Python):
```python
from anthropic import Anthropic

client = Anthropic()  # Lee ANTHROPIC_API_KEY del entorno
message = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello, Claude"}]
)
```

Para una lista de SDKs de cliente e instrucciones de instalación respectivas, consulta [SDKs de Cliente](/docs/es/api/client-sdks).

## API de Claude vs Plataformas de Terceros

Claude está disponible a través de la API directa de Anthropic y a través de plataformas asociadas. Elige según tu infraestructura, requisitos de cumplimiento y preferencias de precios.

### API de Claude

- **Acceso directo** a los últimos modelos y características primero
- **Facturación y soporte de Anthropic**
- **Mejor para**: Nuevas integraciones, acceso completo a características, relación directa con Anthropic

### APIs de Plataformas de Terceros

Accede a Claude a través de AWS, Google Cloud o Microsoft Azure:
- **Integrado** con facturación e IAM del proveedor de nube
- **Puede tener retrasos de características** o diferencias de la API directa
- **Mejor para**: Compromisos de nube existentes, requisitos de cumplimiento específicos, facturación de nube consolidada

| Plataforma | Proveedor | Documentación |
|----------|----------|---------------|
| Amazon Bedrock | AWS | [Claude en Amazon Bedrock](/docs/es/build-with-claude/claude-on-amazon-bedrock) |
| Vertex AI | Google Cloud | [Claude en Vertex AI](/docs/es/build-with-claude/claude-on-vertex-ai) |
| Azure AI | Microsoft Azure | [Claude en Azure AI](/docs/es/build-with-claude/claude-in-microsoft-foundry) |

<Note>
Para disponibilidad de características en todas las plataformas, consulta la [Descripción general de características](/docs/es/build-with-claude/overview).
</Note>

## Formato de Solicitud y Respuesta

### Límites de Tamaño de Solicitud

La API tiene diferentes tamaños máximos de solicitud dependiendo del punto final:

| Punto final | Tamaño Máximo |
|----------|--------------|
| Puntos finales estándar (Mensajes, Conteo de Tokens) | 32 MB |
| [API de Lotes](/docs/es/build-with-claude/batch-processing) | 256 MB |
| [API de Archivos](/docs/es/build-with-claude/files) | 500 MB |

Si excedes estos límites, recibirás un error `request_too_large` 413.

### Encabezados de Respuesta

La API de Claude incluye los siguientes encabezados en cada respuesta:

- `request-id`: Un identificador único global para la solicitud
- `anthropic-organization-id`: El ID de organización asociado con la clave de API utilizada en la solicitud

## Límites de Velocidad y Disponibilidad

### Límites de Velocidad

La API aplica límites de velocidad y límites de gastos para prevenir abusos y gestionar la capacidad. Los límites se organizan en niveles de uso que aumentan automáticamente a medida que usas la API. Cada nivel tiene:

- **Límites de gastos**: Costo máximo mensual para el uso de la API
- **Límites de velocidad**: Número máximo de solicitudes por minuto (RPM) y tokens por minuto (TPM)

Puedes ver los límites actuales de tu organización en la [Consola](/settings/limits). Para límites más altos o Priority Tier (niveles de servicio mejorados con gasto comprometido), contacta a ventas a través de la Consola.

Para información detallada sobre límites, niveles y el algoritmo de cubo de tokens utilizado para límites de velocidad, consulta [Límites de velocidad](/docs/es/api/rate-limits).

### Disponibilidad

La API de Claude está disponible en [muchos países y regiones](/docs/es/api/supported-regions) en todo el mundo. Consulta la página de regiones compatibles para confirmar la disponibilidad en tu ubicación.

## Ejemplo Básico

Aquí hay una solicitud mínima usando la API de Mensajes:

```bash
curl https://api.anthropic.com/v1/messages \
  --header "x-api-key: $ANTHROPIC_API_KEY" \
  --header "anthropic-version: 2023-06-01" \
  --header "content-type: application/json" \
  --data '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "Hello, Claude"}
    ]
  }'
```

**Respuesta:**
```json
{
  "id": "msg_01XFDUDYJgAACzvnptvVoYEL",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "Hello! How can I assist you today?"
    }
  ],
  "model": "claude-sonnet-4-5",
  "stop_reason": "end_turn",
  "usage": {
    "input_tokens": 12,
    "output_tokens": 8
  }
}
```

Para ejemplos completos y tutoriales, consulta [Primeros pasos](/docs/es/get-started) y [Trabajar con Mensajes](/docs/es/build-with-claude/working-with-messages).

## Próximos Pasos

<CardGroup cols={3}>
  <Card title="Primeros pasos" icon="rocket" href="/docs/es/get-started">
    Requisitos previos, tutorial paso a paso y ejemplos en múltiples idiomas
  </Card>
  <Card title="Trabajar con Mensajes" icon="message" href="/docs/es/build-with-claude/working-with-messages">
    Patrones de solicitud/respuesta, conversaciones multi-turno y mejores prácticas
  </Card>
  <Card title="Referencia de la API de Mensajes" icon="book" href="/docs/es/api/messages">
    Especificación completa de la API: parámetros, respuestas y códigos de error
  </Card>
  <Card title="SDKs de Cliente" icon="code" href="/docs/es/api/client-sdks">
    Guías de instalación para Python, TypeScript, Java, Go, C#, Ruby y PHP
  </Card>
  <Card title="Descripción general de características" icon="grid" href="/docs/es/build-with-claude/overview">
    Explora capacidades: almacenamiento en caché, visión, uso de herramientas, streaming y más
  </Card>
  <Card title="Límites de velocidad" icon="gauge" href="/docs/es/api/rate-limits">
    Niveles de uso, límites de gastos y limitación de velocidad con algoritmo de cubo de tokens
  </Card>
</CardGroup>