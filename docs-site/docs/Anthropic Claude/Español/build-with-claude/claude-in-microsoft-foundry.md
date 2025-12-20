# Claude en Microsoft Foundry

Accede a los modelos de Claude a través de Microsoft Foundry con puntos finales nativos de Azure y autenticación.

---

Esta guía te llevará a través del proceso de configuración y realización de llamadas a la API de Claude en Foundry en Python, TypeScript, o usando solicitudes HTTP directas. Cuando puedas acceder a Claude en Foundry, se te facturará por el uso de Claude en Microsoft Marketplace con tu suscripción de Azure, lo que te permite acceder a las últimas capacidades de Claude mientras administras costos a través de tu suscripción de Azure.

Disponibilidad regional: En el lanzamiento, Claude está disponible como tipo de implementación Global Standard en recursos de Foundry con US DataZone próximamente. Los precios de Claude en Microsoft Marketplace utilizan los precios estándar de la API de Anthropic. Visita nuestra [página de precios](https://claude.com/pricing#api) para más detalles.

## Vista previa

En esta integración de plataforma de vista previa, los modelos de Claude se ejecutan en la infraestructura de Anthropic. Esta es una integración comercial para facturación y acceso a través de Azure. Como procesador independiente para Microsoft, los clientes que utilizan Claude a través de Microsoft Foundry están sujetos a los términos de uso de datos de Anthropic. Anthropic continúa proporcionando sus compromisos líderes en la industria de seguridad y datos, incluida la disponibilidad de retención cero de datos.

## Requisitos previos

Antes de comenzar, asegúrate de tener:

- Una suscripción activa de Azure
- Acceso a [Foundry](https://ai.azure.com/)
- La [CLI de Azure](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) instalada (opcional, para la gestión de recursos)

## Instalar un SDK

Los [SDK de cliente](/docs/es/api/client-sdks) de Anthropic admiten Foundry a través de paquetes específicos de la plataforma.

```bash
# Python
pip install -U "anthropic"

# Typescript
npm install @anthropic-ai/foundry-sdk
```

## Aprovisionamiento

Foundry utiliza una jerarquía de dos niveles: los **recursos** contienen tu configuración de seguridad y facturación, mientras que las **implementaciones** son las instancias del modelo a las que llamas a través de la API. Primero crearás un recurso de Foundry, luego crearás una o más implementaciones de Claude dentro de él.

### Aprovisionamiento de recursos de Foundry

Crea un recurso de Foundry, que es necesario para usar y administrar servicios en Azure. Puedes seguir estas instrucciones para crear un [recurso de Foundry](https://learn.microsoft.com/en-us/azure/ai-services/multi-service-resource?pivots=azportal#create-a-new-azure-ai-foundry-resource). Alternativamente, puedes comenzar creando un [proyecto de Foundry](https://learn.microsoft.com/en-us/azure/ai-foundry/how-to/create-projects?tabs=ai-foundry), que implica crear un recurso de Foundry.

Para aprovisionar tu recurso:

1. Navega al [portal de Foundry](https://ai.azure.com/)
2. Crea un nuevo recurso de Foundry o selecciona uno existente
3. Configura la gestión de acceso usando claves de API emitidas por Azure o Entra ID para control de acceso basado en roles
4. Opcionalmente, configura el recurso para que sea parte de una red privada (Red Virtual de Azure) para mayor seguridad
5. Anota el nombre de tu recurso: lo usarás como `{resource}` en los puntos finales de la API (por ejemplo, `https://{resource}.services.ai.azure.com/anthropic/v1/*`)

### Creación de implementaciones de Foundry

Después de crear tu recurso, implementa un modelo de Claude para que esté disponible para llamadas a la API:

1. En el portal de Foundry, navega a tu recurso
2. Ve a **Modelos + puntos finales** y selecciona **+ Implementar modelo** > **Implementar modelo base**
3. Busca y selecciona un modelo de Claude (por ejemplo, `claude-sonnet-4-5`)
4. Configura los ajustes de implementación:
   - **Nombre de implementación**: Por defecto es el ID del modelo, pero puedes personalizarlo (por ejemplo, `my-claude-deployment`). El nombre de la implementación no se puede cambiar después de haber sido creado.
   - **Tipo de implementación**: Selecciona Global Standard (recomendado para Claude)
5. Selecciona **Implementar** y espera a que se complete el aprovisionamiento
6. Una vez implementado, puedes encontrar tu URL de punto final y claves bajo **Claves y Punto final**

<Note>
  El nombre de implementación que elijas se convierte en el valor que pasas en el parámetro `model` de tus solicitudes de API. Puedes crear múltiples implementaciones del mismo modelo con diferentes nombres para administrar configuraciones separadas o límites de velocidad.
</Note>

## Autenticación

Claude en Foundry admite dos métodos de autenticación: claves de API y tokens de Entra ID. Ambos métodos utilizan puntos finales alojados en Azure en el formato `https://{resource}.services.ai.azure.com/anthropic/v1/*`.

### Autenticación con clave de API

Después de aprovisionar tu recurso de Claude en Foundry, puedes obtener una clave de API desde el portal de Foundry:

1. Navega a tu recurso en el portal de Foundry
2. Ve a la sección **Claves y Punto final**
3. Copia una de las claves de API proporcionadas
4. Usa el encabezado `api-key` o `x-api-key` en tus solicitudes, o proporciónalo al SDK

Los SDK de Python y TypeScript requieren una clave de API y un nombre de recurso o URL base. Los SDK leerán automáticamente estos valores de las siguientes variables de entorno si están definidas:

- `ANTHROPIC_FOUNDRY_API_KEY` - Tu clave de API
- `ANTHROPIC_FOUNDRY_RESOURCE` - El nombre de tu recurso (por ejemplo, `example-resource`)
- `ANTHROPIC_FOUNDRY_BASE_URL` - Alternativa al nombre del recurso; la URL base completa (por ejemplo, `https://example-resource.services.ai.azure.com/anthropic/`)

<Note>
Los parámetros `resource` y `base_url` son mutuamente excluyentes. Proporciona el nombre del recurso (que el SDK usa para construir la URL como `https://{resource}.services.ai.azure.com/anthropic/`) o la URL base completa directamente.
</Note>

**Ejemplo usando clave de API:**

<CodeGroup>
```python Python
import os
from anthropic import AnthropicFoundry

client = AnthropicFoundry(
    api_key=os.environ.get("ANTHROPIC_FOUNDRY_API_KEY"),
    resource='example-resource', # your resource name
)

message = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello!"}]
)
print(message.content)
```

```typescript TypeScript
import AnthropicFoundry from "@anthropic-ai/foundry-sdk";

const client = new AnthropicFoundry({
  apiKey: process.env.ANTHROPIC_FOUNDRY_API_KEY,
  resource: 'example-resource', // your resource name
});

const message = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Hello!" }],
});
console.log(message.content);
```

```bash Shell
curl https://{resource}.services.ai.azure.com/anthropic/v1/messages \
  -H "content-type: application/json" \
  -H "api-key: YOUR_AZURE_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'
```
</CodeGroup>

<Warning>
Mantén tus claves de API seguras. Nunca las confirmes en el control de versiones ni las compartas públicamente. Cualquiera que tenga acceso a tu clave de API puede hacer solicitudes a Claude a través de tu recurso de Foundry.
</Warning>

## Autenticación de Microsoft Entra

Para mayor seguridad y gestión centralizada del acceso, puedes usar tokens de Entra ID (anteriormente Azure Active Directory):

1. Habilita la autenticación de Entra para tu recurso de Foundry
2. Obtén un token de acceso de Entra ID
3. Usa el token en el encabezado `Authorization: Bearer {TOKEN}`

**Ejemplo usando Entra ID:**

<CodeGroup>
```python Python
import os
from anthropic import AnthropicFoundry
from azure.identity import DefaultAzureCredential, get_bearer_token_provider

# Get Azure Entra ID token using token provider pattern
token_provider = get_bearer_token_provider(
    DefaultAzureCredential(),
    "https://cognitiveservices.azure.com/.default"
)

# Create client with Entra ID authentication
client = AnthropicFoundry(
    resource='example-resource', # your resource name
    azure_ad_token_provider=token_provider  # Use token provider for Entra ID auth
)

# Make request
message = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello!"}]
)
print(message.content)
```

```typescript TypeScript
import AnthropicFoundry from "@anthropic-ai/foundry-sdk";
import {
  DefaultAzureCredential,
  getBearerTokenProvider,
} from "@azure/identity";

// Get Entra ID token using token provider pattern
const credential = new DefaultAzureCredential();
const tokenProvider = getBearerTokenProvider(
  credential,
  "https://cognitiveservices.azure.com/.default"
);

// Create client with Entra ID authentication
const client = new AnthropicFoundry({
  resource: 'example-resource', // your resource name
  azureADTokenProvider: tokenProvider, // Use token provider for Entra ID auth
});

// Make request
const message = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Hello!" }],
});
console.log(message.content);
```

```bash Shell
# Get Azure Entra ID token
ACCESS_TOKEN=$(az account get-access-token --resource https://cognitiveservices.azure.com --query accessToken -o tsv)

# Make request with token. Replace {resource} with your resource name
curl https://{resource}.services.ai.azure.com/anthropic/v1/messages \
  -H "content-type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'
```
</CodeGroup>

<Note>
La autenticación de Azure Entra ID te permite administrar el acceso usando Azure RBAC, integrar con la gestión de identidades de tu organización y evitar administrar claves de API manualmente.
</Note>

## IDs de solicitud de correlación

Foundry incluye identificadores de solicitud en los encabezados de respuesta HTTP para depuración y rastreo. Cuando contactes con soporte, proporciona tanto los valores `request-id` como `apim-request-id` para ayudar a los equipos a localizar e investigar rápidamente tu solicitud en los sistemas de Anthropic y Azure.

## Características admitidas

Claude en Foundry admite la mayoría de las poderosas características de Claude. Puedes encontrar todas las características actualmente admitidas [aquí](/docs/es/build-with-claude/overview).

### Características no admitidas

- API de administración (puntos finales `/v1/organizations/*`)
- API de modelos (`/v1/models`)
- API de lotes de mensajes (`/v1/messages/batches`)

## Respuestas de API

Las respuestas de API de Claude en Foundry siguen el [formato de respuesta estándar de la API de Anthropic](/docs/es/api/messages). Esto incluye el objeto `usage` en los cuerpos de respuesta, que proporciona información detallada sobre el consumo de tokens para tus solicitudes. El objeto `usage` es consistente en todas las plataformas (API de primera parte, Foundry, Amazon Bedrock y Google Vertex AI).

Para más detalles sobre los encabezados de respuesta específicos de Foundry, consulta la [sección de IDs de solicitud de correlación](#correlation-request-ids).

## IDs de modelo de API e implementaciones

Los siguientes modelos de Claude están disponibles a través de Foundry. Los modelos de última generación (Sonnet 4.5, Opus 4.1 y Haiku 4.5) ofrecen las capacidades más avanzadas:

| Modelo             | Nombre de implementación predeterminado     |
| :----------------- | :------------------------------------------ |
| Claude Opus 4.5    | `claude-opus-4-5`                          |
| Claude Sonnet 4.5  | `claude-sonnet-4-5`                        |
| Claude Opus 4.1    | `claude-opus-4-1`                          |
| Claude Haiku 4.5   | `claude-haiku-4-5`                         |

Por defecto, los nombres de implementación coinciden con los IDs de modelo mostrados arriba. Sin embargo, puedes crear implementaciones personalizadas con diferentes nombres en el portal de Foundry para administrar diferentes configuraciones, versiones o límites de velocidad. Usa el nombre de implementación (no necesariamente el ID del modelo) en tus solicitudes de API.

## Monitoreo y registro

Azure proporciona capacidades integrales de monitoreo y registro para tu uso de Claude a través de patrones estándar de Azure:

- **Azure Monitor**: Realiza un seguimiento del uso de API, latencia y tasas de error
- **Azure Log Analytics**: Consulta y analiza registros de solicitudes/respuestas
- **Gestión de costos**: Monitorea y pronostica costos asociados con el uso de Claude

Anthropic recomienda registrar tu actividad en al menos una base móvil de 30 días para entender los patrones de uso e investigar cualquier problema potencial.

<Note>
Los servicios de registro de Azure se configuran dentro de tu suscripción de Azure. Habilitar el registro no proporciona a Microsoft o Anthropic acceso a tu contenido más allá de lo necesario para la facturación y operación del servicio.
</Note>

## Solución de problemas

### Errores de autenticación

**Error**: `401 Unauthorized` o `Invalid API key`

- **Solución**: Verifica que tu clave de API sea correcta. Puedes obtener una nueva clave de API desde el portal de Azure bajo **Claves y Punto final** para tu recurso de Claude.
- **Solución**: Si usas Azure Entra ID, asegúrate de que tu token de acceso sea válido y no haya expirado. Los tokens típicamente expiran después de 1 hora.

**Error**: `403 Forbidden`

- **Solución**: Tu cuenta de Azure puede carecer de los permisos necesarios. Asegúrate de tener el rol de Azure RBAC apropiado asignado (por ejemplo, "Cognitive Services OpenAI User").

### Limitación de velocidad

**Error**: `429 Too Many Requests`

- **Solución**: Has excedido tu límite de velocidad. Implementa lógica de retroceso exponencial y reintentos en tu aplicación.
- **Solución**: Considera solicitar aumentos de límite de velocidad a través del portal de Azure o soporte de Azure.

#### Encabezados de límite de velocidad

Foundry no incluye los encabezados de límite de velocidad estándar de Anthropic (`anthropic-ratelimit-tokens-limit`, `anthropic-ratelimit-tokens-remaining`, `anthropic-ratelimit-tokens-reset`, `anthropic-ratelimit-input-tokens-limit`, `anthropic-ratelimit-input-tokens-remaining`, `anthropic-ratelimit-input-tokens-reset`, `anthropic-ratelimit-output-tokens-limit`, `anthropic-ratelimit-output-tokens-remaining` y `anthropic-ratelimit-output-tokens-reset`) en respuestas. Administra la limitación de velocidad a través de las herramientas de monitoreo de Azure en su lugar.

### Errores de modelo e implementación

**Error**: `Model not found` o `Deployment not found`

- **Solución**: Verifica que estés usando el nombre de implementación correcto. Si no has creado una implementación personalizada, usa el ID del modelo predeterminado (por ejemplo, `claude-sonnet-4-5`).
- **Solución**: Asegúrate de que el modelo/implementación esté disponible en tu región de Azure.

**Error**: `Invalid model parameter`

- **Solución**: El parámetro del modelo debe contener el nombre de tu implementación, que se puede personalizar en el portal de Foundry. Verifica que la implementación exista y esté correctamente configurada.

## Recursos adicionales

- **Documentación de Foundry**: [ai.azure.com/catalog](https://ai.azure.com/catalog/publishers/anthropic)
- **Precios de Azure**: [azure.microsoft.com/en-us/pricing](https://azure.microsoft.com/en-us/pricing/)
- **Detalles de precios de Anthropic**: [Documentación de precios](/docs/es/about-claude/pricing#third-party-platform-pricing)
- **Guía de autenticación**: Consulta la [sección de autenticación](#authentication) arriba
- **Portal de Azure**: [portal.azure.com](https://portal.azure.com/)