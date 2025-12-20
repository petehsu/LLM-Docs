# Claude no Microsoft Foundry

Acesse modelos Claude através do Microsoft Foundry com endpoints nativos do Azure e autenticação.

---

Este guia o orientará no processo de configuração e realização de chamadas de API para Claude no Foundry em Python, TypeScript ou usando solicitações HTTP diretas. Quando você conseguir acessar Claude no Foundry, você será cobrado pelo uso de Claude no Microsoft Marketplace com sua assinatura do Azure, permitindo que você acesse os recursos mais recentes do Claude enquanto gerencia custos através de sua assinatura do Azure.

Disponibilidade regional: No lançamento, Claude está disponível como um tipo de implantação Global Standard em recursos Foundry com US DataZone em breve. O preço do Claude no Microsoft Marketplace usa o preço padrão da API da Anthropic. Visite nossa [página de preços](https://claude.com/pricing#api) para detalhes.

## Visualização

Nesta integração de plataforma de visualização, os modelos Claude são executados na infraestrutura da Anthropic. Esta é uma integração comercial para faturamento e acesso através do Azure. Como processador independente para a Microsoft, os clientes que usam Claude através do Microsoft Foundry estão sujeitos aos termos de uso de dados da Anthropic. A Anthropic continua a fornecer seus compromissos de segurança e dados líderes do setor, incluindo disponibilidade de retenção zero de dados.

## Pré-requisitos

Antes de começar, certifique-se de que você tem:

- Uma assinatura ativa do Azure
- Acesso ao [Foundry](https://ai.azure.com/)
- A [CLI do Azure](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) instalada (opcional, para gerenciamento de recursos)

## Instalar um SDK

Os [SDKs de cliente](/docs/pt-BR/api/client-sdks) da Anthropic suportam Foundry através de pacotes específicos da plataforma.

```bash
# Python
pip install -U "anthropic"

# Typescript
npm install @anthropic-ai/foundry-sdk
```

## Provisionamento

Foundry usa uma hierarquia de dois níveis: **recursos** contêm sua configuração de segurança e faturamento, enquanto **implantações** são as instâncias de modelo que você chama via API. Você primeiro criará um recurso Foundry e depois criará uma ou mais implantações Claude dentro dele.

### Provisionando recursos Foundry

Crie um recurso Foundry, que é necessário para usar e gerenciar serviços no Azure. Você pode seguir estas instruções para criar um [recurso Foundry](https://learn.microsoft.com/en-us/azure/ai-services/multi-service-resource?pivots=azportal#create-a-new-azure-ai-foundry-resource). Alternativamente, você pode começar criando um [projeto Foundry](https://learn.microsoft.com/en-us/azure/ai-foundry/how-to/create-projects?tabs=ai-foundry), que envolve criar um recurso Foundry.

Para provisionar seu recurso:

1. Navegue até o [portal Foundry](https://ai.azure.com/)
2. Crie um novo recurso Foundry ou selecione um existente
3. Configure o gerenciamento de acesso usando chaves de API emitidas pelo Azure ou Entra ID para controle de acesso baseado em função
4. Opcionalmente, configure o recurso para fazer parte de uma rede privada (Rede Virtual do Azure) para segurança aprimorada
5. Anote o nome do seu recurso—você o usará como `{resource}` nos endpoints da API (por exemplo, `https://{resource}.services.ai.azure.com/anthropic/v1/*`)

### Criando implantações Foundry

Após criar seu recurso, implante um modelo Claude para disponibilizá-lo para chamadas de API:

1. No portal Foundry, navegue até seu recurso
2. Vá para **Modelos + endpoints** e selecione **+ Implantar modelo** > **Implantar modelo base**
3. Procure e selecione um modelo Claude (por exemplo, `claude-sonnet-4-5`)
4. Configure as configurações de implantação:
   - **Nome da implantação**: Padrão é o ID do modelo, mas você pode personalizá-lo (por exemplo, `my-claude-deployment`). O nome da implantação não pode ser alterado após sua criação.
   - **Tipo de implantação**: Selecione Global Standard (recomendado para Claude)
5. Selecione **Implantar** e aguarde a conclusão do provisionamento
6. Após a implantação, você pode encontrar a URL do seu endpoint e as chaves em **Chaves e Endpoint**

<Note>
  O nome da implantação que você escolher se torna o valor que você passa no parâmetro `model` de suas solicitações de API. Você pode criar múltiplas implantações do mesmo modelo com nomes diferentes para gerenciar configurações separadas ou limites de taxa.
</Note>

## Autenticação

Claude no Foundry suporta dois métodos de autenticação: chaves de API e tokens Entra ID. Ambos os métodos usam endpoints hospedados no Azure no formato `https://{resource}.services.ai.azure.com/anthropic/v1/*`.

### Autenticação por chave de API

Após provisionar seu recurso Claude Foundry, você pode obter uma chave de API no portal Foundry:

1. Navegue até seu recurso no portal Foundry
2. Vá para a seção **Chaves e Endpoint**
3. Copie uma das chaves de API fornecidas
4. Use o cabeçalho `api-key` ou `x-api-key` em suas solicitações, ou forneça-o ao SDK

Os SDKs Python e TypeScript requerem uma chave de API e um nome de recurso ou URL base. Os SDKs lerão automaticamente esses valores das seguintes variáveis de ambiente se estiverem definidas:

- `ANTHROPIC_FOUNDRY_API_KEY` - Sua chave de API
- `ANTHROPIC_FOUNDRY_RESOURCE` - Seu nome de recurso (por exemplo, `example-resource`)
- `ANTHROPIC_FOUNDRY_BASE_URL` - Alternativa ao nome do recurso; a URL base completa (por exemplo, `https://example-resource.services.ai.azure.com/anthropic/`)

<Note>
Os parâmetros `resource` e `base_url` são mutuamente exclusivos. Forneça o nome do recurso (que o SDK usa para construir a URL como `https://{resource}.services.ai.azure.com/anthropic/`) ou a URL base completa diretamente.
</Note>

**Exemplo usando chave de API:**

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
Mantenha suas chaves de API seguras. Nunca as confirme no controle de versão ou as compartilhe publicamente. Qualquer pessoa com acesso à sua chave de API pode fazer solicitações para Claude através de seu recurso Foundry.
</Warning>

## Autenticação Microsoft Entra

Para segurança aprimorada e gerenciamento centralizado de acesso, você pode usar tokens Entra ID (anteriormente Azure Active Directory):

1. Ative a autenticação Entra para seu recurso Foundry
2. Obtenha um token de acesso do Entra ID
3. Use o token no cabeçalho `Authorization: Bearer {TOKEN}`

**Exemplo usando Entra ID:**

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
A autenticação Azure Entra ID permite que você gerencie o acesso usando Azure RBAC, integre com o gerenciamento de identidade da sua organização e evite gerenciar chaves de API manualmente.
</Note>

## IDs de solicitação de correlação

Foundry inclui identificadores de solicitação nos cabeçalhos de resposta HTTP para depuração e rastreamento. Ao entrar em contato com o suporte, forneça os valores `request-id` e `apim-request-id` para ajudar as equipes a localizar e investigar rapidamente sua solicitação em ambos os sistemas Anthropic e Azure.

## Recursos suportados

Claude no Foundry suporta a maioria dos poderosos recursos do Claude. Você pode encontrar todos os recursos atualmente suportados [aqui](/docs/pt-BR/build-with-claude/overview).

### Recursos não suportados

- Admin API (endpoints `/v1/organizations/*`)
- Models API (`/v1/models`)
- Message Batch API (`/v1/messages/batches`)

## Respostas de API

As respostas de API do Claude no Foundry seguem o [formato de resposta padrão da API Anthropic](/docs/pt-BR/api/messages). Isso inclui o objeto `usage` nos corpos de resposta, que fornece informações detalhadas de consumo de tokens para suas solicitações. O objeto `usage` é consistente em todas as plataformas (API de primeira parte, Foundry, Amazon Bedrock e Google Vertex AI).

Para detalhes sobre cabeçalhos de resposta específicos do Foundry, consulte a [seção de IDs de solicitação de correlação](#correlation-request-ids).

## IDs de modelo de API e implantações

Os seguintes modelos Claude estão disponíveis através do Foundry. Os modelos de geração mais recente (Sonnet 4.5, Opus 4.1 e Haiku 4.5) oferecem os recursos mais avançados:

| Modelo            | Nome de Implantação Padrão   |
| :---------------- | :-------------------------- |
| Claude Opus 4.5   | `claude-opus-4-5`  |
| Claude Sonnet 4.5 | `claude-sonnet-4-5`         |
| Claude Opus 4.1   | `claude-opus-4-1`           |
| Claude Haiku 4.5  | `claude-haiku-4-5`          |

Por padrão, os nomes de implantação correspondem aos IDs de modelo mostrados acima. No entanto, você pode criar implantações personalizadas com nomes diferentes no portal Foundry para gerenciar diferentes configurações, versões ou limites de taxa. Use o nome da implantação (não necessariamente o ID do modelo) em suas solicitações de API.

## Monitoramento e registro

O Azure fornece recursos abrangentes de monitoramento e registro para seu uso de Claude através de padrões padrão do Azure:

- **Azure Monitor**: Rastreie uso de API, latência e taxas de erro
- **Azure Log Analytics**: Consulte e analise logs de solicitação/resposta
- **Gerenciamento de Custos**: Monitore e preveja custos associados ao uso de Claude

A Anthropic recomenda registrar sua atividade em pelo menos uma base móvel de 30 dias para entender padrões de uso e investigar possíveis problemas.

<Note>
Os serviços de registro do Azure são configurados dentro de sua assinatura do Azure. Habilitar o registro não fornece à Microsoft ou à Anthropic acesso ao seu conteúdo além do necessário para faturamento e operação do serviço.
</Note>

## Solução de problemas

### Erros de autenticação

**Erro**: `401 Unauthorized` ou `Invalid API key`

- **Solução**: Verifique se sua chave de API está correta. Você pode obter uma nova chave de API no portal do Azure em **Chaves e Endpoint** para seu recurso Claude.
- **Solução**: Se estiver usando Azure Entra ID, certifique-se de que seu token de acesso é válido e não expirou. Os tokens normalmente expiram após 1 hora.

**Erro**: `403 Forbidden`

- **Solução**: Sua conta do Azure pode não ter as permissões necessárias. Certifique-se de ter a função Azure RBAC apropriada atribuída (por exemplo, "Cognitive Services OpenAI User").

### Limitação de taxa

**Erro**: `429 Too Many Requests`

- **Solução**: Você excedeu seu limite de taxa. Implemente lógica de backoff exponencial e repetição em sua aplicação.
- **Solução**: Considere solicitar aumentos de limite de taxa através do portal do Azure ou suporte do Azure.

#### Cabeçalhos de limite de taxa

Foundry não inclui os cabeçalhos de limite de taxa padrão da Anthropic (`anthropic-ratelimit-tokens-limit`, `anthropic-ratelimit-tokens-remaining`, `anthropic-ratelimit-tokens-reset`, `anthropic-ratelimit-input-tokens-limit`, `anthropic-ratelimit-input-tokens-remaining`, `anthropic-ratelimit-input-tokens-reset`, `anthropic-ratelimit-output-tokens-limit`, `anthropic-ratelimit-output-tokens-remaining` e `anthropic-ratelimit-output-tokens-reset`) nas respostas. Gerencie a limitação de taxa através das ferramentas de monitoramento do Azure.

### Erros de modelo e implantação

**Erro**: `Model not found` ou `Deployment not found`

- **Solução**: Verifique se você está usando o nome de implantação correto. Se você não criou uma implantação personalizada, use o ID do modelo padrão (por exemplo, `claude-sonnet-4-5`).
- **Solução**: Certifique-se de que o modelo/implantação está disponível em sua região do Azure.

**Erro**: `Invalid model parameter`

- **Solução**: O parâmetro model deve conter seu nome de implantação, que pode ser personalizado no portal Foundry. Verifique se a implantação existe e está configurada corretamente.

## Recursos adicionais

- **Documentação Foundry**: [ai.azure.com/catalog](https://ai.azure.com/catalog/publishers/anthropic)
- **Preços do Azure**: [azure.microsoft.com/en-us/pricing](https://azure.microsoft.com/en-us/pricing/)
- **Detalhes de preços da Anthropic**: [Documentação de preços](/docs/pt-BR/about-claude/pricing#third-party-platform-pricing)
- **Guia de autenticação**: Consulte a [seção de autenticação](#authentication) acima
- **Portal do Azure**: [portal.azure.com](https://portal.azure.com/)