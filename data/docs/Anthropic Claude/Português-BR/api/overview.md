# Visão Geral da API

A API Claude é uma API RESTful que fornece acesso programático aos modelos Claude. A API principal é a Messages API para interações conversacionais.

---

A API Claude é uma API RESTful em `https://api.anthropic.com` que fornece acesso programático aos modelos Claude. A API principal é a Messages API (`POST /v1/messages`) para interações conversacionais.

<Note>
**Novo no Claude?** Comece com [Primeiros passos](/docs/pt-BR/get-started) para pré-requisitos e sua primeira chamada de API, ou veja [Trabalhando com Mensagens](/docs/pt-BR/build-with-claude/working-with-messages) para padrões de solicitação/resposta e exemplos.
</Note>

## Pré-requisitos

Para usar a API Claude, você precisará de:

- Uma conta [Anthropic Console](https://console.anthropic.com)
- Uma [chave de API](/settings/keys)

Para instruções de configuração passo a passo, veja [Primeiros passos](/docs/pt-BR/get-started).

## APIs Disponíveis

A API Claude inclui as seguintes APIs:

**Disponibilidade Geral:**
- **[Messages API](/docs/pt-BR/api/messages)**: Envie mensagens para Claude para interações conversacionais (`POST /v1/messages`)
- **[Message Batches API](/docs/pt-BR/api/creating-message-batches)**: Processe grandes volumes de solicitações de Messages de forma assíncrona com redução de custo de 50% (`POST /v1/messages/batches`)
- **[Token Counting API](/docs/pt-BR/api/messages-count-tokens)**: Conte tokens em uma mensagem antes de enviar para gerenciar custos e limites de taxa (`POST /v1/messages/count_tokens`)
- **[Models API](/docs/pt-BR/api/models-list)**: Liste modelos Claude disponíveis e seus detalhes (`GET /v1/models`)

**Beta:**
- **[Files API](/docs/pt-BR/api/files-create)**: Carregue e gerencie arquivos para uso em múltiplas chamadas de API (`POST /v1/files`, `GET /v1/files`)
- **[Skills API](/docs/pt-BR/api/skills/create-skill)**: Crie e gerencie habilidades de agente personalizadas (`POST /v1/skills`, `GET /v1/skills`)

Para a referência completa da API com todos os endpoints, parâmetros e esquemas de resposta, explore as páginas de referência da API listadas na navegação. Para acessar recursos beta, veja [Cabeçalhos beta](/docs/pt-BR/api/beta-headers).

## Autenticação

Todas as solicitações para a API Claude devem incluir estes cabeçalhos:

| Cabeçalho | Valor | Obrigatório |
|--------|-------|----------|
| `x-api-key` | Sua chave de API do Console | Sim |
| `anthropic-version` | Versão da API (por exemplo, `2023-06-01`) | Sim |
| `content-type` | `application/json` | Sim |

Se você estiver usando os [Client SDKs](#client-sdks), o SDK enviará esses cabeçalhos automaticamente. Para detalhes de versionamento de API, veja [Versões de API](/docs/pt-BR/api/versioning).

### Obtendo Chaves de API

A API é disponibilizada através do [Console](https://console.anthropic.com/) web. Você pode usar o [Workbench](https://console.anthropic.com/workbench) para experimentar a API no navegador e depois gerar chaves de API em [Configurações de Conta](https://console.anthropic.com/settings/keys). Use [espaços de trabalho](https://console.anthropic.com/settings/workspaces) para segmentar suas chaves de API e [controlar gastos](/docs/pt-BR/api/rate-limits) por caso de uso.

## Client SDKs

Anthropic fornece SDKs oficiais que simplificam a integração de API ao lidar com autenticação, formatação de solicitação, tratamento de erros e muito mais.

**Benefícios**:
- Gerenciamento automático de cabeçalhos (x-api-key, anthropic-version, content-type)
- Tratamento de solicitação e resposta com segurança de tipo
- Lógica de repetição integrada e tratamento de erros
- Suporte a streaming
- Timeouts de solicitação e gerenciamento de conexão

**Exemplo** (Python):
```python
from anthropic import Anthropic

client = Anthropic()  # Lê ANTHROPIC_API_KEY do ambiente
message = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello, Claude"}]
)
```

Para uma lista de client SDKs e suas respectivas instruções de instalação, veja [Client SDKs](/docs/pt-BR/api/client-sdks).

## Claude API vs Plataformas de Terceiros

Claude está disponível através da API direta da Anthropic e através de plataformas parceiras. Escolha com base em sua infraestrutura, requisitos de conformidade e preferências de preços.

### Claude API

- **Acesso direto** aos modelos e recursos mais recentes primeiro
- **Faturamento e suporte da Anthropic**
- **Melhor para**: Novas integrações, acesso completo a recursos, relacionamento direto com Anthropic

### APIs de Plataforma de Terceiros

Acesse Claude através de AWS, Google Cloud ou Microsoft Azure:
- **Integrado** com faturamento e IAM do provedor de nuvem
- **Pode ter atrasos de recursos** ou diferenças da API direta
- **Melhor para**: Compromissos de nuvem existentes, requisitos de conformidade específicos, faturamento de nuvem consolidado

| Plataforma | Provedor | Documentação |
|----------|----------|---------------|
| Amazon Bedrock | AWS | [Claude no Amazon Bedrock](/docs/pt-BR/build-with-claude/claude-on-amazon-bedrock) |
| Vertex AI | Google Cloud | [Claude no Vertex AI](/docs/pt-BR/build-with-claude/claude-on-vertex-ai) |
| Azure AI | Microsoft Azure | [Claude no Azure AI](/docs/pt-BR/build-with-claude/claude-in-microsoft-foundry) |

<Note>
Para disponibilidade de recursos em plataformas, veja a [Visão geral de recursos](/docs/pt-BR/build-with-claude/overview).
</Note>

## Formato de Solicitação e Resposta

### Limites de Tamanho de Solicitação

A API tem diferentes tamanhos máximos de solicitação dependendo do endpoint:

| Endpoint | Tamanho Máximo |
|----------|--------------|
| Endpoints padrão (Messages, Token Counting) | 32 MB |
| [Batch API](/docs/pt-BR/build-with-claude/batch-processing) | 256 MB |
| [Files API](/docs/pt-BR/build-with-claude/files) | 500 MB |

Se você exceder esses limites, receberá um erro 413 `request_too_large`.

### Cabeçalhos de Resposta

A API Claude inclui os seguintes cabeçalhos em cada resposta:

- `request-id`: Um identificador globalmente único para a solicitação
- `anthropic-organization-id`: O ID da organização associado à chave de API usada na solicitação

## Limites de Taxa e Disponibilidade

### Limites de Taxa

A API impõe limites de taxa e limites de gastos para prevenir abuso e gerenciar capacidade. Os limites são organizados em camadas de uso que aumentam automaticamente conforme você usa a API. Cada camada tem:

- **Limites de gastos**: Custo máximo mensal para uso da API
- **Limites de taxa**: Número máximo de solicitações por minuto (RPM) e tokens por minuto (TPM)

Você pode visualizar os limites atuais de sua organização no [Console](/settings/limits). Para limites mais altos ou Priority Tier (níveis de serviço aprimorados com gastos comprometidos), entre em contato com vendas através do Console.

Para informações detalhadas sobre limites, camadas e o algoritmo de bucket de tokens usado para limitação de taxa, veja [Limites de taxa](/docs/pt-BR/api/rate-limits).

### Disponibilidade

A API Claude está disponível em [muitos países e regiões](/docs/pt-BR/api/supported-regions) em todo o mundo. Verifique a página de regiões suportadas para confirmar a disponibilidade em sua localização.

## Exemplo Básico

Aqui está uma solicitação mínima usando a Messages API:

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

**Resposta:**
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

Para exemplos completos e tutoriais, veja [Primeiros passos](/docs/pt-BR/get-started) e [Trabalhando com Mensagens](/docs/pt-BR/build-with-claude/working-with-messages).

## Próximos Passos

<CardGroup cols={3}>
  <Card title="Primeiros passos" icon="rocket" href="/docs/pt-BR/get-started">
    Pré-requisitos, tutorial passo a passo e exemplos em múltiplas linguagens
  </Card>
  <Card title="Trabalhando com Mensagens" icon="message" href="/docs/pt-BR/build-with-claude/working-with-messages">
    Padrões de solicitação/resposta, conversas multi-turno e melhores práticas
  </Card>
  <Card title="Referência da Messages API" icon="book" href="/docs/pt-BR/api/messages">
    Especificação completa da API: parâmetros, respostas e códigos de erro
  </Card>
  <Card title="Client SDKs" icon="code" href="/docs/pt-BR/api/client-sdks">
    Guias de instalação para Python, TypeScript, Java, Go, C#, Ruby e PHP
  </Card>
  <Card title="Visão geral de recursos" icon="grid" href="/docs/pt-BR/build-with-claude/overview">
    Explore capacidades: cache, visão, uso de ferramentas, streaming e muito mais
  </Card>
  <Card title="Limites de taxa" icon="gauge" href="/docs/pt-BR/api/rate-limits">
    Camadas de uso, limites de gastos e limitação de taxa com algoritmo de bucket de tokens
  </Card>
</CardGroup>