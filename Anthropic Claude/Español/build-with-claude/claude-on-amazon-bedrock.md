# Claude en Amazon Bedrock

Los modelos Claude de Anthropic ahora están disponibles de forma general a través de Amazon Bedrock.

---

Llamar a Claude a través de Bedrock difiere ligeramente de cómo llamarías a Claude cuando usas los SDK de cliente de Anthropic. Esta guía te guiará a través del proceso de completar una llamada a la API a Claude en Bedrock en Python o TypeScript.

Ten en cuenta que esta guía asume que ya te has registrado en una [cuenta de AWS](https://portal.aws.amazon.com/billing/signup) y has configurado el acceso programático.

## Instalar y configurar la AWS CLI

1. [Instala una versión de la AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html) en la versión `2.13.23` o más reciente
2. Configura tus credenciales de AWS usando el comando AWS configure (consulta [Configurar la AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)) o encuentra tus credenciales navegando a "Command line or programmatic access" dentro de tu panel de AWS y siguiendo las instrucciones en la ventana modal emergente.
3. Verifica que tus credenciales funcionan:

```bash Shell
aws sts get-caller-identity
```

## Instalar un SDK para acceder a Bedrock

Los [SDK de cliente](/docs/es/api/client-sdks) de Anthropic soportan Bedrock. También puedes usar un SDK de AWS como `boto3` directamente.

<CodeGroup>
  ```python Python
  pip install -U "anthropic[bedrock]"
  ```

  ```typescript TypeScript
  npm install @anthropic-ai/bedrock-sdk
  ```

  ```python Boto3 (Python)
  pip install boto3>=1.28.59
  ```
</CodeGroup>

## Accediendo a Bedrock

### Suscribirse a modelos de Anthropic

Ve a [AWS Console > Bedrock > Model Access](https://console.aws.amazon.com/bedrock/home?region=us-west-2#/modelaccess) y solicita acceso a los modelos de Anthropic. Ten en cuenta que la disponibilidad de modelos de Anthropic varía según la región. Consulta la [documentación de AWS](https://docs.aws.amazon.com/bedrock/latest/userguide/models-regions.html) para obtener la información más reciente.

#### IDs de modelo de API

| Modelo | ID de modelo base de Bedrock | `global` | `us` | `eu` | `jp` | `apac` |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| Claude Sonnet 4.5 | anthropic.claude-sonnet-4-5-20250929-v1:0 | Sí | Sí | Sí | Sí | No |
| Claude Sonnet 4 | anthropic.claude-sonnet-4-20250514-v1:0 | Sí | Sí | Sí | No | Sí |
| Claude Sonnet 3.7 <Tooltip tooltipContent="Deprecado a partir del 28 de octubre de 2025.">⚠️</Tooltip> | anthropic.claude-3-7-sonnet-20250219-v1:0 | No | Sí | Sí | No | Sí |
| Claude Opus 4.5 | anthropic.claude-opus-4-5-20251101-v1:0 | Sí | Sí | Sí | No | No |
| Claude Opus 4.1 | anthropic.claude-opus-4-1-20250805-v1:0 | No | Sí | No | No | No |
| Claude Opus 4 | anthropic.claude-opus-4-20250514-v1:0 | No | Sí | No | No | No |
| Claude Opus 3 <Tooltip tooltipContent="Deprecado a partir del 30 de junio de 2025.">⚠️</Tooltip> | anthropic.claude-3-opus-20240229-v1:0 | No | Sí | No | No | No |
| Claude Haiku 4.5 | anthropic.claude-haiku-4-5-20251001-v1:0 | Sí | Sí | Sí | No | No |
| Claude Haiku 3.5 | anthropic.claude-3-5-haiku-20241022-v1:0 | No | Sí | No | No | No |
| Claude Haiku 3 | anthropic.claude-3-haiku-20240307-v1:0 | No | Sí | Sí | No | Sí |

Para obtener más información sobre IDs de modelo regionales frente a globales, consulta la sección [Puntos finales globales frente a regionales](#global-vs-regional-endpoints) a continuación.

### Listar modelos disponibles

Los siguientes ejemplos muestran cómo imprimir una lista de todos los modelos de Claude disponibles a través de Bedrock:

<CodeGroup>
  ```bash AWS CLI
  aws bedrock list-foundation-models --region=us-west-2 --by-provider anthropic --query "modelSummaries[*].modelId"
  ```

  ```python Boto3 (Python)
  import boto3

  bedrock = boto3.client(service_name="bedrock")
  response = bedrock.list_foundation_models(byProvider="anthropic")

  for summary in response["modelSummaries"]:
      print(summary["modelId"])
  ```
</CodeGroup>

### Realizando solicitudes

Los siguientes ejemplos muestran cómo generar texto desde Claude en Bedrock:

<CodeGroup>
  ```python Python
  from anthropic import AnthropicBedrock

  client = AnthropicBedrock(
      # Autentica proporcionando las claves a continuación o usa los proveedores de credenciales de AWS predeterminados, como
      # usar ~/.aws/credentials o las variables de entorno "AWS_SECRET_ACCESS_KEY" y "AWS_ACCESS_KEY_ID".
      aws_access_key="<access key>",
      aws_secret_key="<secret key>",
      # Las credenciales temporales se pueden usar con aws_session_token.
      # Lee más en https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp.html.
      aws_session_token="<session_token>",
      # aws_region cambia la región de AWS a la que se realiza la solicitud. Por defecto, leemos AWS_REGION,
      # y si no está presente, por defecto es us-east-1. Ten en cuenta que no leemos ~/.aws/config para la región.
      aws_region="us-west-2",
  )

  message = client.messages.create(
      model="global.anthropic.claude-sonnet-4-5-20250929-v1:0",
      max_tokens=256,
      messages=[{"role": "user", "content": "Hello, world"}]
  )
  print(message.content)
  ```

  ```typescript TypeScript
  import AnthropicBedrock from '@anthropic-ai/bedrock-sdk';

  const client = new AnthropicBedrock({
    // Autentica proporcionando las claves a continuación o usa los proveedores de credenciales de AWS predeterminados, como
    // usar ~/.aws/credentials o las variables de entorno "AWS_SECRET_ACCESS_KEY" y "AWS_ACCESS_KEY_ID".
    awsAccessKey: '<access key>',
    awsSecretKey: '<secret key>',

    // Las credenciales temporales se pueden usar con awsSessionToken.
    // Lee más en https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp.html.
    awsSessionToken: '<session_token>',

    // awsRegion cambia la región de AWS a la que se realiza la solicitud. Por defecto, leemos AWS_REGION,
    // y si no está presente, por defecto es us-east-1. Ten en cuenta que no leemos ~/.aws/config para la región.
    awsRegion: 'us-west-2',
  });

  async function main() {
    const message = await client.messages.create({
      model: 'global.anthropic.claude-sonnet-4-5-20250929-v1:0',
      max_tokens: 256,
      messages: [{"role": "user", "content": "Hello, world"}]
    });
    console.log(message);
  }
  main().catch(console.error);
  ```

  ```python Boto3 (Python)
  import boto3
  import json

  bedrock = boto3.client(service_name="bedrock-runtime")
  body = json.dumps({
    "max_tokens": 256,
    "messages": [{"role": "user", "content": "Hello, world"}],
    "anthropic_version": "bedrock-2023-05-31"
  })

  response = bedrock.invoke_model(body=body, modelId="global.anthropic.claude-sonnet-4-5-20250929-v1:0")

  response_body = json.loads(response.get("body").read())
  print(response_body.get("content"))
  ```
</CodeGroup>

Consulta nuestros [SDK de cliente](/docs/es/api/client-sdks) para obtener más detalles, y la documentación oficial de Bedrock [aquí](https://docs.aws.amazon.com/bedrock/).

## Registro de actividad

Bedrock proporciona un [servicio de registro de invocación](https://docs.aws.amazon.com/bedrock/latest/userguide/model-invocation-logging.html) que permite a los clientes registrar los indicadores y completaciones asociados con tu uso.

Anthropic recomienda que registres tu actividad al menos en una base móvil de 30 días para entender tu actividad e investigar cualquier posible mal uso.

<Note>
Activar este servicio no le da a AWS ni a Anthropic acceso a tu contenido.
</Note>

## Soporte de características

Puedes encontrar todas las características actualmente soportadas en Bedrock [aquí](/docs/es/api/overview).

### Soporte de PDF en Bedrock

El soporte de PDF está disponible en Amazon Bedrock a través de la API Converse e InvokeModel API. Para obtener información detallada sobre las capacidades y limitaciones del procesamiento de PDF, consulta la [documentación de soporte de PDF](/docs/es/build-with-claude/pdf-support#amazon-bedrock-pdf-support).

**Consideraciones importantes para usuarios de la API Converse:**
- El análisis visual de PDF (gráficos, imágenes, diseños) requiere que las citas estén habilitadas
- Sin citas, solo está disponible la extracción de texto básica
- Para control total sin citas forzadas, usa la API InvokeModel

Para obtener más detalles sobre los dos modos de procesamiento de documentos y sus limitaciones, consulta la [guía de soporte de PDF](/docs/es/build-with-claude/pdf-support#amazon-bedrock-pdf-support).

### Ventana de contexto de 1M de tokens

Claude Sonnet 4 y 4.5 soportan la [ventana de contexto de 1M de tokens](/docs/es/build-with-claude/context-windows#1m-token-context-window) en Amazon Bedrock.

<Note>
La ventana de contexto de 1M de tokens está actualmente en beta. Para usar la ventana de contexto extendida, incluye el encabezado beta `context-1m-2025-08-07` en tus [solicitudes de API de Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-anthropic-claude-messages-request-response.html).
</Note>

## Puntos finales globales frente a regionales

A partir de **Claude Sonnet 4.5 y todos los modelos futuros**, Amazon Bedrock ofrece dos tipos de puntos finales:

- **Puntos finales globales**: Enrutamiento dinámico para máxima disponibilidad
- **Puntos finales regionales**: Enrutamiento de datos garantizado a través de regiones geográficas específicas

Los puntos finales regionales incluyen una prima de precios del 10% sobre los puntos finales globales.

<Note>
Esto se aplica solo a Claude Sonnet 4.5 y modelos futuros. Los modelos más antiguos (Claude Sonnet 4, Opus 4 y anteriores) mantienen sus estructuras de precios existentes.
</Note>

### Cuándo usar cada opción

**Puntos finales globales (recomendado):**
- Proporcionan máxima disponibilidad y tiempo de actividad
- Enrutan dinámicamente las solicitudes a regiones con capacidad disponible
- Sin prima de precios
- Mejor para aplicaciones donde la residencia de datos es flexible

**Puntos finales regionales (CRIS):**
- Enrutan el tráfico a través de regiones geográficas específicas
- Requerido para requisitos de residencia de datos y cumplimiento normativo
- Disponible para EE.UU., UE, Japón y Australia
- La prima de precios del 10% refleja los costos de infraestructura para capacidad regional dedicada

### Implementación

**Usando puntos finales globales (predeterminado para Sonnet 4.5 y 4):**

Los IDs de modelo para Claude Sonnet 4.5 y 4 ya incluyen el prefijo `global.`:

<CodeGroup>
```python Python
from anthropic import AnthropicBedrock

client = AnthropicBedrock(aws_region="us-west-2")

message = client.messages.create(
    model="global.anthropic.claude-sonnet-4-5-20250929-v1:0",
    max_tokens=256,
    messages=[{"role": "user", "content": "Hello, world"}]
)
```

```typescript TypeScript
import AnthropicBedrock from '@anthropic-ai/bedrock-sdk';

const client = new AnthropicBedrock({
  awsRegion: 'us-west-2',
});

const message = await client.messages.create({
  model: 'global.anthropic.claude-sonnet-4-5-20250929-v1:0',
  max_tokens: 256,
  messages: [{role: "user", content: "Hello, world"}]
});
```
</CodeGroup>

**Usando puntos finales regionales (CRIS):**

Para usar puntos finales regionales, elimina el prefijo `global.` del ID de modelo:

<CodeGroup>
```python Python
from anthropic import AnthropicBedrock

client = AnthropicBedrock(aws_region="us-west-2")

# Usando el punto final regional de EE.UU. (CRIS)
message = client.messages.create(
    model="anthropic.claude-sonnet-4-5-20250929-v1:0",  # Sin prefijo global.
    max_tokens=256,
    messages=[{"role": "user", "content": "Hello, world"}]
)
```

```typescript TypeScript
import AnthropicBedrock from '@anthropic-ai/bedrock-sdk';

const client = new AnthropicBedrock({
  awsRegion: 'us-west-2',
});

// Usando el punto final regional de EE.UU. (CRIS)
const message = await client.messages.create({
  model: 'anthropic.claude-sonnet-4-5-20250929-v1:0',  // Sin prefijo global.
  max_tokens: 256,
  messages: [{role: "user", content: "Hello, world"}]
});
```
</CodeGroup>

### Recursos adicionales

- **Precios de AWS Bedrock:** [aws.amazon.com/bedrock/pricing](https://aws.amazon.com/bedrock/pricing/)
- **Documentación de precios de AWS:** [Guía de precios de Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/bedrock-pricing.html)
- **Publicación de blog de AWS:** [Presentación de Claude Sonnet 4.5 en Amazon Bedrock](https://aws.amazon.com/blogs/aws/introducing-claude-sonnet-4-5-in-amazon-bedrock-anthropics-most-intelligent-model-best-for-coding-and-complex-agents/)
- **Detalles de precios de Anthropic:** [Documentación de precios](/docs/es/about-claude/pricing#third-party-platform-pricing)