# Conector MCP

Conecta a servidores MCP remotos directamente desde la API de Mensajes sin un cliente MCP separado

---

La característica de conector del Protocolo de Contexto de Modelo (MCP) de Claude te permite conectarte a servidores MCP remotos directamente desde la API de Mensajes sin un cliente MCP separado.

<Note>
  **Versión actual**: Esta característica requiere el encabezado beta: `"anthropic-beta": "mcp-client-2025-11-20"`

  La versión anterior (`mcp-client-2025-04-04`) está deprecada. Consulta la [documentación de la versión deprecada](#deprecated-version-mcp-client-2025-04-04) a continuación.
</Note>

## Características principales

- **Integración directa de API**: Conecta a servidores MCP sin implementar un cliente MCP
- **Soporte de llamadas de herramientas**: Accede a herramientas MCP a través de la API de Mensajes
- **Configuración flexible de herramientas**: Habilita todas las herramientas, lista blanca de herramientas específicas o lista negra de herramientas no deseadas
- **Configuración por herramienta**: Configura herramientas individuales con configuraciones personalizadas
- **Autenticación OAuth**: Soporte para tokens Bearer de OAuth para servidores autenticados
- **Múltiples servidores**: Conecta a múltiples servidores MCP en una única solicitud

## Limitaciones

- Del conjunto de características de la [especificación MCP](https://modelcontextprotocol.io/introduction#explore-mcp), solo se admiten actualmente [llamadas de herramientas](https://modelcontextprotocol.io/docs/concepts/tools).
- El servidor debe estar expuesto públicamente a través de HTTP (admite tanto transportes HTTP Streamable como SSE). Los servidores STDIO locales no se pueden conectar directamente.
- El conector MCP actualmente no es compatible con Amazon Bedrock y Google Vertex.

## Uso del conector MCP en la API de Mensajes

El conector MCP utiliza dos componentes:

1. **Definición del servidor MCP** (matriz `mcp_servers`): Define los detalles de conexión del servidor (URL, autenticación)
2. **Conjunto de herramientas MCP** (matriz `tools`): Configura qué herramientas habilitar y cómo configurarlas

### Ejemplo básico

Este ejemplo habilita todas las herramientas de un servidor MCP con configuración predeterminada:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: mcp-client-2025-11-20" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1000,
    "messages": [{"role": "user", "content": "What tools do you have available?"}],
    "mcp_servers": [
      {
        "type": "url",
        "url": "https://example-server.modelcontextprotocol.io/sse",
        "name": "example-mcp",
        "authorization_token": "YOUR_TOKEN"
      }
    ],
    "tools": [
      {
        "type": "mcp_toolset",
        "mcp_server_name": "example-mcp"
      }
    ]
  }'
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1000,
  messages: [
    {
      role: "user",
      content: "What tools do you have available?",
    },
  ],
  mcp_servers: [
    {
      type: "url",
      url: "https://example-server.modelcontextprotocol.io/sse",
      name: "example-mcp",
      authorization_token: "YOUR_TOKEN",
    },
  ],
  tools: [
    {
      type: "mcp_toolset",
      mcp_server_name: "example-mcp",
    },
  ],
  betas: ["mcp-client-2025-11-20"],
});
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1000,
    messages=[{
        "role": "user",
        "content": "What tools do you have available?"
    }],
    mcp_servers=[{
        "type": "url",
        "url": "https://mcp.example.com/sse",
        "name": "example-mcp",
        "authorization_token": "YOUR_TOKEN"
    }],
    tools=[{
        "type": "mcp_toolset",
        "mcp_server_name": "example-mcp"
    }],
    betas=["mcp-client-2025-11-20"]
)
```
</CodeGroup>

## Configuración del servidor MCP

Cada servidor MCP en la matriz `mcp_servers` define los detalles de conexión:

```json
{
  "type": "url",
  "url": "https://example-server.modelcontextprotocol.io/sse",
  "name": "example-mcp",
  "authorization_token": "YOUR_TOKEN"
}
```

### Descripciones de campos

| Propiedad | Tipo | Requerido | Descripción |
|----------|------|----------|-------------|
| `type` | string | Sí | Actualmente solo se admite "url" |
| `url` | string | Sí | La URL del servidor MCP. Debe comenzar con https:// |
| `name` | string | Sí | Un identificador único para este servidor MCP. Debe ser referenciado por exactamente un MCPToolset en la matriz `tools`. |
| `authorization_token` | string | No | Token de autorización OAuth si es requerido por el servidor MCP. Consulta la [especificación MCP](https://modelcontextprotocol.io/specification/2025-03-26/basic/authorization). |

## Configuración del conjunto de herramientas MCP

El MCPToolset vive en la matriz `tools` y configura qué herramientas del servidor MCP están habilitadas y cómo deben configurarse.

### Estructura básica

```json
{
  "type": "mcp_toolset",
  "mcp_server_name": "example-mcp",
  "default_config": {
    "enabled": true,
    "defer_loading": false
  },
  "configs": {
    "specific_tool_name": {
      "enabled": true,
      "defer_loading": true
    }
  }
}
```

### Descripciones de campos

| Propiedad | Tipo | Requerido | Descripción |
|----------|------|----------|-------------|
| `type` | string | Sí | Debe ser "mcp_toolset" |
| `mcp_server_name` | string | Sí | Debe coincidir con un nombre de servidor definido en la matriz `mcp_servers` |
| `default_config` | object | No | Configuración predeterminada aplicada a todas las herramientas en este conjunto. Las configuraciones de herramientas individuales en `configs` anularán estos valores predeterminados. |
| `configs` | object | No | Anulaciones de configuración por herramienta. Las claves son nombres de herramientas, los valores son objetos de configuración. |
| `cache_control` | object | No | Configuración del punto de ruptura de caché para este conjunto de herramientas |

### Opciones de configuración de herramientas

Cada herramienta (ya sea configurada en `default_config` o en `configs`) admite los siguientes campos:

| Propiedad | Tipo | Predeterminado | Descripción |
|----------|------|---------|-------------|
| `enabled` | boolean | `true` | Si esta herramienta está habilitada |
| `defer_loading` | boolean | `false` | Si es verdadero, la descripción de la herramienta no se envía al modelo inicialmente. Se utiliza con [Herramienta de búsqueda de herramientas](/agents-and-tools/tool-search-tool). |

### Fusión de configuración

Los valores de configuración se fusionan con esta precedencia (mayor a menor):

1. Configuraciones específicas de herramientas en `configs`
2. `default_config` a nivel de conjunto
3. Valores predeterminados del sistema

Ejemplo:

```json
{
  "type": "mcp_toolset",
  "mcp_server_name": "google-calendar-mcp",
  "default_config": {
    "defer_loading": true
  },
  "configs": {
    "search_events": {
      "enabled": false
    }
  }
}
```

Resulta en:
- `search_events`: `enabled: false` (de configs), `defer_loading: true` (de default_config)
- Todas las otras herramientas: `enabled: true` (valor predeterminado del sistema), `defer_loading: true` (de default_config)

## Patrones de configuración comunes

### Habilitar todas las herramientas con configuración predeterminada

El patrón más simple - habilita todas las herramientas de un servidor:

```json
{
  "type": "mcp_toolset",
  "mcp_server_name": "google-calendar-mcp",
}
```

### Lista blanca - Habilitar solo herramientas específicas

Establece `enabled: false` como predeterminado, luego habilita explícitamente herramientas específicas:

```json
{
  "type": "mcp_toolset",
  "mcp_server_name": "google-calendar-mcp",
  "default_config": {
    "enabled": false
  },
  "configs": {
    "search_events": {
      "enabled": true
    },
    "create_event": {
      "enabled": true
    }
  }
}
```

### Lista negra - Deshabilitar herramientas específicas

Habilita todas las herramientas de forma predeterminada, luego deshabilita explícitamente herramientas no deseadas:

```json
{
  "type": "mcp_toolset",
  "mcp_server_name": "google-calendar-mcp",
  "configs": {
    "delete_all_events": {
      "enabled": false
    },
    "share_calendar_publicly": {
      "enabled": false
    }
  }
}
```

### Mixto - Lista blanca con configuración por herramienta

Combina lista blanca con configuración personalizada para cada herramienta:

```json
{
  "type": "mcp_toolset",
  "mcp_server_name": "google-calendar-mcp",
  "default_config": {
    "enabled": false,
    "defer_loading": true
  },
  "configs": {
    "search_events": {
      "enabled": true,
      "defer_loading": false
    },
    "list_events": {
      "enabled": true
    }
  }
}
```

En este ejemplo:
- `search_events` está habilitado con `defer_loading: false`
- `list_events` está habilitado con `defer_loading: true` (heredado de default_config)
- Todas las otras herramientas están deshabilitadas

## Reglas de validación

La API aplica estas reglas de validación:

- **El servidor debe existir**: El `mcp_server_name` en un MCPToolset debe coincidir con un servidor definido en la matriz `mcp_servers`
- **El servidor debe ser utilizado**: Cada servidor MCP definido en `mcp_servers` debe ser referenciado por exactamente un MCPToolset
- **Conjunto de herramientas único por servidor**: Cada servidor MCP solo puede ser referenciado por un MCPToolset
- **Nombres de herramientas desconocidos**: Si un nombre de herramienta en `configs` no existe en el servidor MCP, se registra una advertencia de backend pero no se devuelve ningún error (los servidores MCP pueden tener disponibilidad de herramientas dinámica)

## Tipos de contenido de respuesta

Cuando Claude utiliza herramientas MCP, la respuesta incluirá dos nuevos tipos de bloques de contenido:

### Bloque de uso de herramienta MCP

```json
{
  "type": "mcp_tool_use",
  "id": "mcptoolu_014Q35RayjACSWkSj4X2yov1",
  "name": "echo",
  "server_name": "example-mcp",
  "input": { "param1": "value1", "param2": "value2" }
}
```

### Bloque de resultado de herramienta MCP

```json
{
  "type": "mcp_tool_result",
  "tool_use_id": "mcptoolu_014Q35RayjACSWkSj4X2yov1",
  "is_error": false,
  "content": [
    {
      "type": "text",
      "text": "Hello"
    }
  ]
}
```

## Múltiples servidores MCP

Puedes conectarte a múltiples servidores MCP incluyendo múltiples definiciones de servidor en `mcp_servers` y un MCPToolset correspondiente para cada uno en la matriz `tools`:

```json
{
  "model": "claude-sonnet-4-5",
  "max_tokens": 1000,
  "messages": [
    {
      "role": "user",
      "content": "Use tools from both mcp-server-1 and mcp-server-2 to complete this task"
    }
  ],
  "mcp_servers": [
    {
      "type": "url",
      "url": "https://mcp.example1.com/sse",
      "name": "mcp-server-1",
      "authorization_token": "TOKEN1"
    },
    {
      "type": "url",
      "url": "https://mcp.example2.com/sse",
      "name": "mcp-server-2",
      "authorization_token": "TOKEN2"
    }
  ],
  "tools": [
    {
      "type": "mcp_toolset",
      "mcp_server_name": "mcp-server-1"
    },
    {
      "type": "mcp_toolset",
      "mcp_server_name": "mcp-server-2",
      "default_config": {
        "defer_loading": true
      }
    }
  ]
}
```

## Autenticación

Para servidores MCP que requieren autenticación OAuth, necesitarás obtener un token de acceso. El beta del conector MCP admite pasar un parámetro `authorization_token` en la definición del servidor MCP.
Se espera que los consumidores de API manejen el flujo OAuth y obtengan el token de acceso antes de hacer la llamada a la API, así como actualizar el token según sea necesario.

### Obtener un token de acceso para pruebas

El inspector MCP puede guiarte a través del proceso de obtener un token de acceso para propósitos de prueba.

1. Ejecuta el inspector con el siguiente comando. Necesitas tener Node.js instalado en tu máquina.

   ```bash
   npx @modelcontextprotocol/inspector
   ```

2. En la barra lateral a la izquierda, para "Tipo de transporte", selecciona "SSE" o "HTTP Streamable".
3. Ingresa la URL del servidor MCP.
4. En el área derecha, haz clic en el botón "Abrir configuración de autenticación" después de "¿Necesitas configurar la autenticación?".
5. Haz clic en "Flujo OAuth rápido" y autoriza en la pantalla de OAuth.
6. Sigue los pasos en la sección "Progreso del flujo OAuth" del inspector y haz clic en "Continuar" hasta que llegues a "Autenticación completada".
7. Copia el valor de `access_token`.
8. Pégalo en el campo `authorization_token` en tu configuración del servidor MCP.

### Usar el token de acceso

Una vez que hayas obtenido un token de acceso usando cualquiera de los flujos OAuth anteriores, puedes usarlo en tu configuración del servidor MCP:

```json
{
  "mcp_servers": [
    {
      "type": "url",
      "url": "https://example-server.modelcontextprotocol.io/sse",
      "name": "authenticated-server",
      "authorization_token": "YOUR_ACCESS_TOKEN_HERE"
    }
  ]
}
```

Para explicaciones detalladas del flujo OAuth, consulta la [sección de Autorización](https://modelcontextprotocol.io/docs/concepts/authentication) en la especificación MCP.

## Guía de migración

Si estás usando el encabezado beta deprecado `mcp-client-2025-04-04`, sigue esta guía para migrar a la nueva versión.

### Cambios clave

1. **Nuevo encabezado beta**: Cambia de `mcp-client-2025-04-04` a `mcp-client-2025-11-20`
2. **Configuración de herramientas movida**: La configuración de herramientas ahora vive en la matriz `tools` como objetos MCPToolset, no en la definición del servidor MCP
3. **Configuración más flexible**: El nuevo patrón admite lista blanca, lista negra y configuración por herramienta

### Pasos de migración

**Antes (deprecado):**

```json
{
  "model": "claude-sonnet-4-5",
  "max_tokens": 1000,
  "messages": [...],
  "mcp_servers": [
    {
      "type": "url",
      "url": "https://mcp.example.com/sse",
      "name": "example-mcp",
      "authorization_token": "YOUR_TOKEN",
      "tool_configuration": {
        "enabled": true,
        "allowed_tools": ["tool1", "tool2"]
      }
    }
  ]
}
```

**Después (actual):**

```json
{
  "model": "claude-sonnet-4-5",
  "max_tokens": 1000,
  "messages": [...],
  "mcp_servers": [
    {
      "type": "url",
      "url": "https://mcp.example.com/sse",
      "name": "example-mcp",
      "authorization_token": "YOUR_TOKEN"
    }
  ],
  "tools": [
    {
      "type": "mcp_toolset",
      "mcp_server_name": "example-mcp",
      "default_config": {
        "enabled": false
      },
      "configs": {
        "tool1": {
          "enabled": true
        },
        "tool2": {
          "enabled": true
        }
      }
    }
  ]
}
```

### Patrones de migración comunes

| Patrón antiguo | Patrón nuevo |
|-------------|-------------|
| Sin `tool_configuration` (todas las herramientas habilitadas) | MCPToolset sin `default_config` o `configs` |
| `tool_configuration.enabled: false` | MCPToolset con `default_config.enabled: false` |
| `tool_configuration.allowed_tools: [...]` | MCPToolset con `default_config.enabled: false` y herramientas específicas habilitadas en `configs` |

## Versión deprecada: mcp-client-2025-04-04

<Note type="warning">
  Esta versión está deprecada. Por favor migra a `mcp-client-2025-11-20` usando la [guía de migración](#migration-guide) anterior.
</Note>

La versión anterior del conector MCP incluía la configuración de herramientas directamente en la definición del servidor MCP:

```json
{
  "mcp_servers": [
    {
      "type": "url",
      "url": "https://example-server.modelcontextprotocol.io/sse",
      "name": "example-mcp",
      "authorization_token": "YOUR_TOKEN",
      "tool_configuration": {
        "enabled": true,
        "allowed_tools": ["example_tool_1", "example_tool_2"]
      }
    }
  ]
}
```

### Descripciones de campos deprecados

| Propiedad | Tipo | Descripción |
|----------|------|-------------|
| `tool_configuration` | object | **Deprecado**: Usa MCPToolset en la matriz `tools` en su lugar |
| `tool_configuration.enabled` | boolean | **Deprecado**: Usa `default_config.enabled` en MCPToolset |
| `tool_configuration.allowed_tools` | array | **Deprecado**: Usa patrón de lista blanca con `configs` en MCPToolset |