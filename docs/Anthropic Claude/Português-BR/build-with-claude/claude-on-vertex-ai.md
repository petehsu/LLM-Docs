# Claude no Vertex AI

Os modelos Claude da Anthropic agora estão geralmente disponíveis através do [Vertex AI](https://cloud.google.com/vertex-ai).

---

A API do Vertex para acessar Claude é quase idêntica à [API de Mensagens](/docs/pt-BR/api/messages) e suporta todas as mesmas opções, com duas diferenças principais:

* No Vertex, `model` não é passado no corpo da solicitação. Em vez disso, é especificado na URL do endpoint do Google Cloud.
* No Vertex, `anthropic_version` é passado no corpo da solicitação (em vez de como um cabeçalho), e deve ser definido para o valor `vertex-2023-10-16`.

O Vertex também é suportado pelos [SDKs de cliente](/docs/pt-BR/api/client-sdks) oficiais da Anthropic. Este guia o orientará através do processo de fazer uma solicitação ao Claude no Vertex AI em Python ou TypeScript.

Observe que este guia pressupõe que você já tenha um projeto GCP que possa usar o Vertex AI. Consulte [usando os modelos Claude 3 da Anthropic](https://cloud.google.com/vertex-ai/generative-ai/docs/partner-models/use-claude) para obter mais informações sobre a configuração necessária, bem como um passo a passo completo.

## Instale um SDK para acessar o Vertex AI

Primeiro, instale o [SDK de cliente](/docs/pt-BR/api/client-sdks) da Anthropic para a linguagem de sua escolha.

<CodeGroup>
  ```python Python
  pip install -U google-cloud-aiplatform "anthropic[vertex]"
  ```

  ```typescript TypeScript
  npm install @anthropic-ai/vertex-sdk
  ```
</CodeGroup>

## Acessando o Vertex AI

### Disponibilidade de Modelos

Observe que a disponibilidade do modelo Anthropic varia por região. Procure por "Claude" no [Vertex AI Model Garden](https://cloud.google.com/model-garden) ou acesse [Usar Claude 3](https://cloud.google.com/vertex-ai/generative-ai/docs/partner-models/use-claude) para obter as informações mais recentes.

#### IDs de modelo da API

| Modelo                          | ID do modelo da API do Vertex AI |
| ------------------------------ | ------------------------ |
| Claude Sonnet 4.5              | claude-sonnet-4-5@20250929 |
| Claude Sonnet 4                | claude-sonnet-4@20250514 |
| Claude Sonnet 3.7 <Tooltip tooltipContent="Descontinuado a partir de 28 de outubro de 2025.">⚠️</Tooltip> | claude-3-7-sonnet@20250219 |
| Claude Opus 4.5                | claude-opus-4-5@20251101 |
| Claude Opus 4.1                | claude-opus-4-1@20250805 |
| Claude Opus 4                  | claude-opus-4@20250514   |
| Claude Opus 3 <Tooltip tooltipContent="Descontinuado a partir de 30 de junho de 2025.">⚠️</Tooltip> | claude-3-opus@20240229   |
| Claude Haiku 4.5               | claude-haiku-4-5@20251001 |
| Claude Haiku 3.5               | claude-3-5-haiku@20241022 |
| Claude Haiku 3                 | claude-3-haiku@20240307  |

### Fazendo solicitações

Antes de executar solicitações, você pode precisar executar `gcloud auth application-default login` para autenticar com o GCP.

O exemplo a seguir mostra como gerar texto do Claude no Vertex AI:
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

Consulte nossos [SDKs de cliente](/docs/pt-BR/api/client-sdks) e a [documentação oficial do Vertex AI](https://cloud.google.com/vertex-ai/docs) para obter mais detalhes.

## Registro de atividades

O Vertex fornece um [serviço de registro de solicitação-resposta](https://cloud.google.com/vertex-ai/generative-ai/docs/multimodal/request-response-logging) que permite aos clientes registrar os prompts e conclusões associados ao seu uso.

A Anthropic recomenda que você registre sua atividade em pelo menos uma base móvel de 30 dias para entender sua atividade e investigar qualquer possível uso indevido.

<Note>
Ativar este serviço não dá ao Google ou à Anthropic nenhum acesso ao seu conteúdo.
</Note>

## Suporte de recursos
Você pode encontrar todos os recursos atualmente suportados no Vertex [aqui](/docs/pt-BR/api/overview).

## Endpoints globais vs regionais

A partir de **Claude Sonnet 4.5 e todos os modelos futuros**, o Google Vertex AI oferece dois tipos de endpoint:

- **Endpoints globais**: Roteamento dinâmico para máxima disponibilidade
- **Endpoints regionais**: Roteamento de dados garantido através de regiões geográficas específicas

Os endpoints regionais incluem um prêmio de preço de 10% sobre os endpoints globais.

<Note>
Isto se aplica apenas ao Claude Sonnet 4.5 e modelos futuros. Modelos mais antigos (Claude Sonnet 4, Opus 4 e anteriores) mantêm suas estruturas de preço existentes.
</Note>

### Quando usar cada opção

**Endpoints globais (recomendado):**
- Fornecem máxima disponibilidade e tempo de atividade
- Roteiam dinamicamente solicitações para regiões com capacidade disponível
- Sem prêmio de preço
- Melhor para aplicações onde a residência de dados é flexível
- Suporta apenas tráfego de pagamento conforme o uso (throughput provisionado requer endpoints regionais)

**Endpoints regionais:**
- Roteiam tráfego através de regiões geográficas específicas
- Necessários para requisitos de residência de dados e conformidade
- Suportam tráfego de pagamento conforme o uso e throughput provisionado
- Prêmio de preço de 10% reflete custos de infraestrutura para capacidade regional dedicada

### Implementação

**Usando endpoints globais (recomendado):**

Defina o parâmetro `region` para `"global"` ao inicializar o cliente:

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

**Usando endpoints regionais:**

Especifique uma região específica como `"us-east1"` ou `"europe-west1"`:

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

### Recursos adicionais

- **Preços do Google Vertex AI:** [cloud.google.com/vertex-ai/generative-ai/pricing](https://cloud.google.com/vertex-ai/generative-ai/pricing)
- **Documentação dos modelos Claude:** [Claude no Vertex AI](https://cloud.google.com/vertex-ai/generative-ai/docs/partner-models/claude)
- **Postagem do blog do Google:** [Endpoint global para modelos Claude](https://cloud.google.com/blog/products/ai-machine-learning/global-endpoint-for-claude-models-generally-available-on-vertex-ai)
- **Detalhes de preço da Anthropic:** [Documentação de preços](/docs/pt-BR/about-claude/pricing#third-party-platform-pricing)