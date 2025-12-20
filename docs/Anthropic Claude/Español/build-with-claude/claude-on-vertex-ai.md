# Claude en Vertex AI

Los modelos Claude de Anthropic ahora están disponibles de forma general a través de [Vertex AI](https://cloud.google.com/vertex-ai).

---

La API de Vertex para acceder a Claude es casi idéntica a la [API de Mensajes](/docs/es/api/messages) y admite todas las mismas opciones, con dos diferencias clave:

* En Vertex, `model` no se pasa en el cuerpo de la solicitud. En su lugar, se especifica en la URL del punto de conexión de Google Cloud.
* En Vertex, `anthropic_version` se pasa en el cuerpo de la solicitud (en lugar de como encabezado), y debe establecerse en el valor `vertex-2023-10-16`.

Vertex también es compatible con los [SDK de cliente](/docs/es/api/client-sdks) oficiales de Anthropic. Esta guía te guiará a través del proceso de realizar una solicitud a Claude en Vertex AI en Python o TypeScript.

Ten en cuenta que esta guía asume que ya tienes un proyecto de GCP que puede usar Vertex AI. Consulta [usar los modelos Claude 3 de Anthropic](https://cloud.google.com/vertex-ai/generative-ai/docs/partner-models/use-claude) para obtener más información sobre la configuración requerida, así como un tutorial completo.

## Instala un SDK para acceder a Vertex AI

Primero, instala el [SDK de cliente](/docs/es/api/client-sdks) de Anthropic para tu lenguaje de programación preferido.

<CodeGroup>
  ```python Python
  pip install -U google-cloud-aiplatform "anthropic[vertex]"
  ```

  ```typescript TypeScript
  npm install @anthropic-ai/vertex-sdk
  ```
</CodeGroup>

## Acceso a Vertex AI

### Disponibilidad de modelos

Ten en cuenta que la disponibilidad del modelo Anthropic varía según la región. Busca "Claude" en el [Vertex AI Model Garden](https://cloud.google.com/model-garden) o ve a [Usar Claude 3](https://cloud.google.com/vertex-ai/generative-ai/docs/partner-models/use-claude) para obtener la información más reciente.

#### ID de modelo de la API

| Modelo                          | ID de modelo de la API de Vertex AI |
| ------------------------------ | ------------------------ |
| Claude Sonnet 4.5              | claude-sonnet-4-5@20250929 |
| Claude Sonnet 4                | claude-sonnet-4@20250514 |
| Claude Sonnet 3.7 <Tooltip tooltipContent="Obsoleto a partir del 28 de octubre de 2025.">⚠️</Tooltip> | claude-3-7-sonnet@20250219 |
| Claude Opus 4.5                | claude-opus-4-5@20251101 |
| Claude Opus 4.1                | claude-opus-4-1@20250805 |
| Claude Opus 4                  | claude-opus-4@20250514   |
| Claude Opus 3 <Tooltip tooltipContent="Obsoleto a partir del 30 de junio de 2025.">⚠️</Tooltip> | claude-3-opus@20240229   |
| Claude Haiku 4.5               | claude-haiku-4-5@20251001 |
| Claude Haiku 3.5               | claude-3-5-haiku@20241022 |
| Claude Haiku 3                 | claude-3-haiku@20240307  |

### Realizar solicitudes

Antes de ejecutar solicitudes, es posible que debas ejecutar `gcloud auth application-default login` para autenticarte con GCP.

Los siguientes ejemplos muestran cómo generar texto desde Claude en Vertex AI:
<CodeGroup>

  ```python Python
  from anthropic import AnthropicVertex

  project_id = "MY_PROJECT_ID"
  region = "global"

  client = AnthropicVertex(project_id=project_id, region=region)

  message = client.messages.create(
      model="claude-sonnet-4-5@20250929",
      max_tokens=100,
      messages=[
          {
              "role": "user",
              "content": "Hey Claude!",
          }
      ],
  )
  print(message)
  ```

  ```typescript TypeScript
  import { AnthropicVertex } from '@anthropic-ai/vertex-sdk';

  const projectId = 'MY_PROJECT_ID';
  const region = 'global';

  // Goes through the standard `google-auth-library` flow.
  const client = new AnthropicVertex({
    projectId,
    region,
  });

  async function main() {
    const result = await client.messages.create({
      model: 'claude-sonnet-4-5@20250929',
      max_tokens: 100,
      messages: [
        {
          role: 'user',
          content: 'Hey Claude!',
        },
      ],
    });
    console.log(JSON.stringify(result, null, 2));
  }

  main();
  ```

  ```bash Shell
  MODEL_ID=claude-sonnet-4-5@20250929
  LOCATION=global
  PROJECT_ID=MY_PROJECT_ID

  curl \
  -X POST \
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  -H "Content-Type: application/json" \
  https://$LOCATION-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/anthropic/models/${MODEL_ID}:streamRawPredict -d \
  '{
    "anthropic_version": "vertex-2023-10-16",
    "messages": [{
      "role": "user",
      "content": "Hey Claude!"
    }],
    "max_tokens": 100,
  }'
  ```
</CodeGroup>

Consulta nuestros [SDK de cliente](/docs/es/api/client-sdks) y la [documentación oficial de Vertex AI](https://cloud.google.com/vertex-ai/docs) para obtener más detalles.

## Registro de actividad

Vertex proporciona un [servicio de registro de solicitud-respuesta](https://cloud.google.com/vertex-ai/generative-ai/docs/multimodal/request-response-logging) que permite a los clientes registrar los mensajes y completaciones asociados con tu uso.

Anthropic recomienda que registres tu actividad al menos en una base móvil de 30 días para comprender tu actividad e investigar cualquier posible mal uso.

<Note>
Activar este servicio no le da a Google ni a Anthropic acceso a tu contenido.
</Note>

## Compatibilidad de características
Puedes encontrar todas las características actualmente compatibles en Vertex [aquí](/docs/es/api/overview).

## Puntos de conexión globales frente a regionales

A partir de **Claude Sonnet 4.5 y todos los modelos futuros**, Google Vertex AI ofrece dos tipos de puntos de conexión:

- **Puntos de conexión globales**: Enrutamiento dinámico para máxima disponibilidad
- **Puntos de conexión regionales**: Enrutamiento de datos garantizado a través de regiones geográficas específicas

Los puntos de conexión regionales incluyen una prima de precios del 10% sobre los puntos de conexión globales.

<Note>
Esto se aplica solo a Claude Sonnet 4.5 y modelos futuros. Los modelos más antiguos (Claude Sonnet 4, Opus 4 y anteriores) mantienen sus estructuras de precios existentes.
</Note>

### Cuándo usar cada opción

**Puntos de conexión globales (recomendado):**
- Proporcionan máxima disponibilidad y tiempo de actividad
- Enrutan dinámicamente las solicitudes a regiones con capacidad disponible
- Sin prima de precios
- Mejor para aplicaciones donde la residencia de datos es flexible
- Solo admite tráfico de pago por uso (el rendimiento aprovisionado requiere puntos de conexión regionales)

**Puntos de conexión regionales:**
- Enrutan el tráfico a través de regiones geográficas específicas
- Requerido para requisitos de residencia de datos y cumplimiento normativo
- Admiten tanto tráfico de pago por uso como rendimiento aprovisionado
- La prima de precios del 10% refleja los costos de infraestructura para capacidad regional dedicada

### Implementación

**Usando puntos de conexión globales (recomendado):**

Establece el parámetro `region` en `"global"` al inicializar el cliente:

<CodeGroup>
```python Python
from anthropic import AnthropicVertex

project_id = "MY_PROJECT_ID"
region = "global"

client = AnthropicVertex(project_id=project_id, region=region)

message = client.messages.create(
    model="claude-sonnet-4-5@20250929",
    max_tokens=100,
    messages=[
        {
            "role": "user",
            "content": "Hey Claude!",
        }
    ],
)
print(message)
```

```typescript TypeScript
import { AnthropicVertex } from '@anthropic-ai/vertex-sdk';

const projectId = 'MY_PROJECT_ID';
const region = 'global';

const client = new AnthropicVertex({
  projectId,
  region,
});

const result = await client.messages.create({
  model: 'claude-sonnet-4-5@20250929',
  max_tokens: 100,
  messages: [
    {
      role: 'user',
      content: 'Hey Claude!',
    },
  ],
});
```
</CodeGroup>

**Usando puntos de conexión regionales:**

Especifica una región específica como `"us-east1"` o `"europe-west1"`:

<CodeGroup>
```python Python
from anthropic import AnthropicVertex

project_id = "MY_PROJECT_ID"
region = "us-east1"  # Specify a specific region

client = AnthropicVertex(project_id=project_id, region=region)

message = client.messages.create(
    model="claude-sonnet-4-5@20250929",
    max_tokens=100,
    messages=[
        {
            "role": "user",
            "content": "Hey Claude!",
        }
    ],
)
print(message)
```

```typescript TypeScript
import { AnthropicVertex } from '@anthropic-ai/vertex-sdk';

const projectId = 'MY_PROJECT_ID';
const region = 'us-east1';  // Specify a specific region

const client = new AnthropicVertex({
  projectId,
  region,
});

const result = await client.messages.create({
  model: 'claude-sonnet-4-5@20250929',
  max_tokens: 100,
  messages: [
    {
      role: 'user',
      content: 'Hey Claude!',
    },
  ],
});
```
</CodeGroup>

### Recursos adicionales

- **Precios de Google Vertex AI:** [cloud.google.com/vertex-ai/generative-ai/pricing](https://cloud.google.com/vertex-ai/generative-ai/pricing)
- **Documentación de modelos Claude:** [Claude en Vertex AI](https://cloud.google.com/vertex-ai/generative-ai/docs/partner-models/claude)
- **Publicación del blog de Google:** [Punto de conexión global para modelos Claude](https://cloud.google.com/blog/products/ai-machine-learning/global-endpoint-for-claude-models-generally-available-on-vertex-ai)
- **Detalles de precios de Anthropic:** [Documentación de precios](/docs/es/about-claude/pricing#third-party-platform-pricing)