# Conector MCP

Conecte-se a servidores MCP remotos diretamente da API de Mensagens sem um cliente MCP separado

---

O recurso de conector do Model Context Protocol (MCP) do Claude permite que você se conecte a servidores MCP remotos diretamente da API de Mensagens sem um cliente MCP separado.

<Note>
  **Versão atual**: Este recurso requer o cabeçalho beta: `"anthropic-beta": "mcp-client-2025-11-20"`

  A versão anterior (`mcp-client-2025-04-04`) está descontinuada. Consulte a [documentação da versão descontinuada](#deprecated-version-mcp-client-2025-04-04) abaixo.
</Note>

## Recursos principais

- **Integração direta da API**: Conecte-se a servidores MCP sem implementar um cliente MCP
- **Suporte a chamadas de ferramentas**: Acesse ferramentas MCP através da API de Mensagens
- **Configuração flexível de ferramentas**: Ative todas as ferramentas, crie uma lista de permissões de ferramentas específicas ou crie uma lista de bloqueio de ferramentas indesejadas
- **Configuração por ferramenta**: Configure ferramentas individuais com configurações personalizadas
- **Autenticação OAuth**: Suporte para tokens Bearer OAuth para servidores autenticados
- **Múltiplos servidores**: Conecte-se a vários servidores MCP em uma única solicitação

## Limitações

- Do conjunto de recursos da [especificação MCP](https://modelcontextprotocol.io/introduction#explore-mcp), apenas [chamadas de ferramentas](https://modelcontextprotocol.io/docs/concepts/tools) são atualmente suportadas.
- O servidor deve ser exposto publicamente através de HTTP (suporta transportes HTTP Streamable e SSE). Servidores STDIO locais não podem ser conectados diretamente.
- O conector MCP não é atualmente suportado no Amazon Bedrock e Google Vertex.

## Usando o conector MCP na API de Mensagens

O conector MCP usa dois componentes:

1. **Definição do Servidor MCP** (array `mcp_servers`): Define detalhes de conexão do servidor (URL, autenticação)
2. **Conjunto de Ferramentas MCP** (array `tools`): Configura quais ferramentas ativar e como configurá-las

### Exemplo básico

Este exemplo ativa todas as ferramentas de um servidor MCP com configuração padrão:

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

## Configuração do servidor MCP

Cada servidor MCP no array `mcp_servers` define os detalhes de conexão:

```json
{
  "type": "url",
  "url": "https://example-server.modelcontextprotocol.io/sse",
  "name": "example-mcp",
  "authorization_token": "YOUR_TOKEN"
}
```

### Descrições de campos

| Propriedade | Tipo | Obrigatório | Descrição |
|----------|------|----------|-------------|
| `type` | string | Sim | Atualmente apenas "url" é suportado |
| `url` | string | Sim | A URL do servidor MCP. Deve começar com https:// |
| `name` | string | Sim | Um identificador único para este servidor MCP. Deve ser referenciado por exatamente um MCPToolset no array `tools`. |
| `authorization_token` | string | Não | Token de autorização OAuth se exigido pelo servidor MCP. Consulte a [especificação MCP](https://modelcontextprotocol.io/specification/2025-03-26/basic/authorization). |

## Configuração do conjunto de ferramentas MCP

O MCPToolset fica no array `tools` e configura quais ferramentas do servidor MCP estão ativadas e como devem ser configuradas.

### Estrutura básica

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

### Descrições de campos

| Propriedade | Tipo | Obrigatório | Descrição |
|----------|------|----------|-------------|
| `type` | string | Sim | Deve ser "mcp_toolset" |
| `mcp_server_name` | string | Sim | Deve corresponder a um nome de servidor definido no array `mcp_servers` |
| `default_config` | object | Não | Configuração padrão aplicada a todas as ferramentas neste conjunto. Configurações de ferramentas individuais em `configs` substituirão esses padrões. |
| `configs` | object | Não | Substituições de configuração por ferramenta. As chaves são nomes de ferramentas, os valores são objetos de configuração. |
| `cache_control` | object | Não | Configuração de ponto de interrupção de cache para este conjunto de ferramentas |

### Opções de configuração de ferramentas

Cada ferramenta (seja configurada em `default_config` ou em `configs`) suporta os seguintes campos:

| Propriedade | Tipo | Padrão | Descrição |
|----------|------|---------|-------------|
| `enabled` | boolean | `true` | Se esta ferramenta está ativada |
| `defer_loading` | boolean | `false` | Se verdadeiro, a descrição da ferramenta não é enviada ao modelo inicialmente. Usado com [Ferramenta de Busca de Ferramentas](/agents-and-tools/tool-search-tool). |

### Mesclagem de configuração

Os valores de configuração são mesclados com esta precedência (maior para menor):

1. Configurações específicas de ferramentas em `configs`
2. `default_config` no nível do conjunto
3. Padrões do sistema

Exemplo:

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

Resulta em:
- `search_events`: `enabled: false` (de configs), `defer_loading: true` (de default_config)
- Todas as outras ferramentas: `enabled: true` (padrão do sistema), `defer_loading: true` (de default_config)

## Padrões de configuração comuns

### Ativar todas as ferramentas com configuração padrão

O padrão mais simples - ativar todas as ferramentas de um servidor:

```json
{
  "type": "mcp_toolset",
  "mcp_server_name": "google-calendar-mcp",
}
```

### Lista de permissões - Ativar apenas ferramentas específicas

Defina `enabled: false` como padrão e, em seguida, ative explicitamente ferramentas específicas:

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

### Lista de bloqueio - Desativar ferramentas específicas

Ative todas as ferramentas por padrão e, em seguida, desative explicitamente ferramentas indesejadas:

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

### Misto - Lista de permissões com configuração por ferramenta

Combine lista de permissões com configuração personalizada para cada ferramenta:

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

Neste exemplo:
- `search_events` está ativado com `defer_loading: false`
- `list_events` está ativado com `defer_loading: true` (herdado de default_config)
- Todas as outras ferramentas estão desativadas

## Regras de validação

A API impõe estas regras de validação:

- **Servidor deve existir**: O `mcp_server_name` em um MCPToolset deve corresponder a um servidor definido no array `mcp_servers`
- **Servidor deve ser usado**: Cada servidor MCP definido em `mcp_servers` deve ser referenciado por exatamente um MCPToolset
- **Conjunto de ferramentas único por servidor**: Cada servidor MCP pode ser referenciado apenas por um MCPToolset
- **Nomes de ferramentas desconhecidos**: Se um nome de ferramenta em `configs` não existir no servidor MCP, um aviso de backend é registrado, mas nenhum erro é retornado (servidores MCP podem ter disponibilidade dinâmica de ferramentas)

## Tipos de conteúdo de resposta

Quando Claude usa ferramentas MCP, a resposta incluirá dois novos tipos de bloco de conteúdo:

### Bloco de Uso de Ferramenta MCP

```json
{
  "type": "mcp_tool_use",
  "id": "mcptoolu_014Q35RayjACSWkSj4X2yov1",
  "name": "echo",
  "server_name": "example-mcp",
  "input": { "param1": "value1", "param2": "value2" }
}
```

### Bloco de Resultado de Ferramenta MCP

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

## Múltiplos servidores MCP

Você pode conectar-se a vários servidores MCP incluindo múltiplas definições de servidor em `mcp_servers` e um MCPToolset correspondente para cada um no array `tools`:

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

## Autenticação

Para servidores MCP que exigem autenticação OAuth, você precisará obter um token de acesso. O beta do conector MCP suporta passar um parâmetro `authorization_token` na definição do servidor MCP.
Espera-se que os consumidores de API lidem com o fluxo OAuth e obtenham o token de acesso antes de fazer a chamada da API, bem como atualizar o token conforme necessário.

### Obtendo um token de acesso para testes

O inspetor MCP pode guiá-lo através do processo de obtenção de um token de acesso para fins de teste.

1. Execute o inspetor com o seguinte comando. Você precisa ter Node.js instalado em sua máquina.

   ```bash
   npx @modelcontextprotocol/inspector
   ```

2. Na barra lateral à esquerda, para "Tipo de transporte", selecione "SSE" ou "HTTP Streamable".
3. Digite a URL do servidor MCP.
4. Na área à direita, clique no botão "Abrir Configurações de Autenticação" após "Precisa configurar autenticação?".
5. Clique em "Fluxo OAuth Rápido" e autorize na tela OAuth.
6. Siga as etapas na seção "Progresso do Fluxo OAuth" do inspetor e clique em "Continuar" até atingir "Autenticação concluída".
7. Copie o valor `access_token`.
8. Cole-o no campo `authorization_token` em sua configuração de servidor MCP.

### Usando o token de acesso

Depois de obter um token de acesso usando qualquer um dos fluxos OAuth acima, você pode usá-lo em sua configuração de servidor MCP:

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

Para explicações detalhadas do fluxo OAuth, consulte a [seção de Autorização](https://modelcontextprotocol.io/docs/concepts/authentication) na especificação MCP.

## Guia de migração

Se você estiver usando o cabeçalho beta descontinuado `mcp-client-2025-04-04`, siga este guia para migrar para a nova versão.

### Principais mudanças

1. **Novo cabeçalho beta**: Mude de `mcp-client-2025-04-04` para `mcp-client-2025-11-20`
2. **Configuração de ferramentas movida**: A configuração de ferramentas agora fica no array `tools` como objetos MCPToolset, não na definição do servidor MCP
3. **Configuração mais flexível**: O novo padrão suporta lista de permissões, lista de bloqueio e configuração por ferramenta

### Etapas de migração

**Antes (descontinuado):**

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

**Depois (atual):**

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

### Padrões de migração comuns

| Padrão antigo | Novo padrão |
|-------------|-------------|
| Sem `tool_configuration` (todas as ferramentas ativadas) | MCPToolset sem `default_config` ou `configs` |
| `tool_configuration.enabled: false` | MCPToolset com `default_config.enabled: false` |
| `tool_configuration.allowed_tools: [...]` | MCPToolset com `default_config.enabled: false` e ferramentas específicas ativadas em `configs` |

## Versão descontinuada: mcp-client-2025-04-04

<Note type="warning">
  Esta versão está descontinuada. Por favor, migre para `mcp-client-2025-11-20` usando o [guia de migração](#migration-guide) acima.
</Note>

A versão anterior do conector MCP incluía configuração de ferramentas diretamente na definição do servidor MCP:

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

### Descrições de campos descontinuados

| Propriedade | Tipo | Descrição |
|----------|------|-------------|
| `tool_configuration` | object | **Descontinuado**: Use MCPToolset no array `tools` em vez disso |
| `tool_configuration.enabled` | boolean | **Descontinuado**: Use `default_config.enabled` em MCPToolset |
| `tool_configuration.allowed_tools` | array | **Descontinuado**: Use padrão de lista de permissões com `configs` em MCPToolset |