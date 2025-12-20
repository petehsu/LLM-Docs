# Claude no Amazon Bedrock

Os modelos Claude da Anthropic agora estão disponíveis em geral através do Amazon Bedrock.

---

Chamar Claude através do Bedrock difere ligeiramente de como você chamaria Claude ao usar os SDKs de cliente da Anthropic. Este guia o orientará no processo de completar uma chamada de API para Claude no Bedrock em Python ou TypeScript.

Observe que este guia assume que você já se inscreveu em uma [conta AWS](https://portal.aws.amazon.com/billing/signup) e configurou acesso programático.

## Instalar e configurar a AWS CLI

1. [Instale uma versão da AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html) na versão `2.13.23` ou mais recente
2. Configure suas credenciais AWS usando o comando AWS configure (veja [Configurar a AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)) ou encontre suas credenciais navegando para "Command line or programmatic access" no seu painel AWS e seguindo as instruções no modal popup.
3. Verifique se suas credenciais estão funcionando:

```bash Shell
aws sts get-caller-identity
```

## Instalar um SDK para acessar Bedrock

Os [SDKs de cliente](/docs/pt-BR/api/client-sdks) da Anthropic suportam Bedrock. Você também pode usar um SDK AWS como `boto3` diretamente.

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

## Acessando Bedrock

### Inscrever-se em modelos Anthropic

Vá para [AWS Console > Bedrock > Model Access](https://console.aws.amazon.com/bedrock/home?region=us-west-2#/modelaccess) e solicite acesso aos modelos Anthropic. Observe que a disponibilidade do modelo Anthropic varia por região. Veja [documentação AWS](https://docs.aws.amazon.com/bedrock/latest/userguide/models-regions.html) para informações mais recentes.

#### IDs de modelo de API

| Modelo | ID de modelo base do Bedrock | `global` | `us` | `eu` | `jp` | `apac` |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| Claude Sonnet 4.5 | anthropic.claude-sonnet-4-5-20250929-v1:0 | Sim | Sim | Sim | Sim | Não |
| Claude Sonnet 4 | anthropic.claude-sonnet-4-20250514-v1:0 | Sim | Sim | Sim | Não | Sim |
| Claude Sonnet 3.7 <Tooltip tooltipContent="Descontinuado a partir de 28 de outubro de 2025.">⚠️</Tooltip> | anthropic.claude-3-7-sonnet-20250219-v1:0 | Não | Sim | Sim | Não | Sim |
| Claude Opus 4.5 | anthropic.claude-opus-4-5-20251101-v1:0 | Sim | Sim | Sim | Não | Não |
| Claude Opus 4.1 | anthropic.claude-opus-4-1-20250805-v1:0 | Não | Sim | Não | Não | Não |
| Claude Opus 4 | anthropic.claude-opus-4-20250514-v1:0 | Não | Sim | Não | Não | Não |
| Claude Opus 3 <Tooltip tooltipContent="Descontinuado a partir de 30 de junho de 2025.">⚠️</Tooltip> | anthropic.claude-3-opus-20240229-v1:0 | Não | Sim | Não | Não | Não |
| Claude Haiku 4.5 | anthropic.claude-haiku-4-5-20251001-v1:0 | Sim | Sim | Sim | Não | Não |
| Claude Haiku 3.5 | anthropic.claude-3-5-haiku-20241022-v1:0 | Não | Sim | Não | Não | Não |
| Claude Haiku 3 | anthropic.claude-3-haiku-20240307-v1:0 | Não | Sim | Sim | Não | Sim |

Para mais informações sobre IDs de modelo regional vs global, veja a seção [Global vs regional endpoints](#global-vs-regional-endpoints) abaixo.

### Listar modelos disponíveis

Os exemplos a seguir mostram como imprimir uma lista de todos os modelos Claude disponíveis através do Bedrock:

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

### Fazendo requisições

Os exemplos a seguir mostram como gerar texto a partir de Claude no Bedrock:

<CodeGroup>
  ```python Python
  from anthropic import AnthropicBedrock

  client = AnthropicBedrock(
      # Autentique fornecendo as chaves abaixo ou use os provedores de credenciais AWS padrão, como
      # usando ~/.aws/credentials ou as variáveis de ambiente "AWS_SECRET_ACCESS_KEY" e "AWS_ACCESS_KEY_ID".
      aws_access_key="<access key>",
      aws_secret_key="<secret key>",
      # Credenciais temporárias podem ser usadas com aws_session_token.
      # Leia mais em https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp.html.
      aws_session_token="<session_token>",
      # aws_region muda a região aws para a qual a requisição é feita. Por padrão, lemos AWS_REGION,
      # e se isso não estiver presente, usamos como padrão us-east-1. Observe que não lemos ~/.aws/config para a região.
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
    // Autentique fornecendo as chaves abaixo ou use os provedores de credenciais AWS padrão, como
    // usando ~/.aws/credentials ou as variáveis de ambiente "AWS_SECRET_ACCESS_KEY" e "AWS_ACCESS_KEY_ID".
    awsAccessKey: '<access key>',
    awsSecretKey: '<secret key>',

    // Credenciais temporárias podem ser usadas com awsSessionToken.
    // Leia mais em https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp.html.
    awsSessionToken: '<session_token>',

    // awsRegion muda a região aws para a qual a requisição é feita. Por padrão, lemos AWS_REGION,
    // e se isso não estiver presente, usamos como padrão us-east-1. Observe que não lemos ~/.aws/config para a região.
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

Veja nossos [SDKs de cliente](/docs/pt-BR/api/client-sdks) para mais detalhes, e a documentação oficial do Bedrock [aqui](https://docs.aws.amazon.com/bedrock/).

## Registro de atividade

Bedrock fornece um [serviço de registro de invocação](https://docs.aws.amazon.com/bedrock/latest/userguide/model-invocation-logging.html) que permite aos clientes registrar os prompts e conclusões associados ao seu uso.

Anthropic recomenda que você registre sua atividade em pelo menos uma base móvel de 30 dias para entender sua atividade e investigar qualquer possível uso indevido.

<Note>
Ativar este serviço não dá à AWS ou à Anthropic nenhum acesso ao seu conteúdo.
</Note>

## Suporte de recursos
Você pode encontrar todos os recursos atualmente suportados no Bedrock [aqui](/docs/pt-BR/api/overview).

### Suporte a PDF no Bedrock

O suporte a PDF está disponível no Amazon Bedrock através da API Converse e da API InvokeModel. Para informações detalhadas sobre recursos e limitações de processamento de PDF, veja a [documentação de suporte a PDF](/docs/pt-BR/build-with-claude/pdf-support#amazon-bedrock-pdf-support).

**Considerações importantes para usuários da API Converse:**
- A análise visual de PDF (gráficos, imagens, layouts) requer que as citações sejam ativadas
- Sem citações, apenas a extração básica de texto está disponível
- Para controle total sem citações forçadas, use a API InvokeModel

Para mais detalhes sobre os dois modos de processamento de documentos e suas limitações, consulte o [guia de suporte a PDF](/docs/pt-BR/build-with-claude/pdf-support#amazon-bedrock-pdf-support).

### Janela de contexto de 1M de tokens

Claude Sonnet 4 e 4.5 suportam a [janela de contexto de 1M de tokens](/docs/pt-BR/build-with-claude/context-windows#1m-token-context-window) no Amazon Bedrock.

<Note>
A janela de contexto de 1M de tokens está atualmente em beta. Para usar a janela de contexto estendida, inclua o cabeçalho beta `context-1m-2025-08-07` em suas [requisições da API Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-anthropic-claude-messages-request-response.html).
</Note>

## Global vs regional endpoints

Começando com **Claude Sonnet 4.5 e todos os modelos futuros**, Amazon Bedrock oferece dois tipos de endpoint:

- **Global endpoints**: Roteamento dinâmico para máxima disponibilidade
- **Regional endpoints**: Roteamento de dados garantido através de regiões geográficas específicas

Os endpoints regionais incluem um prêmio de preço de 10% sobre os endpoints globais.

<Note>
Isso se aplica apenas ao Claude Sonnet 4.5 e modelos futuros. Modelos mais antigos (Claude Sonnet 4, Opus 4 e anteriores) mantêm suas estruturas de preço existentes.
</Note>

### Quando usar cada opção

**Global endpoints (recomendado):**
- Fornecem máxima disponibilidade e tempo de atividade
- Roteiam dinamicamente requisições para regiões com capacidade disponível
- Sem prêmio de preço
- Melhor para aplicações onde a residência de dados é flexível

**Regional endpoints (CRIS):**
- Roteiam tráfego através de regiões geográficas específicas
- Necessários para requisitos de residência de dados e conformidade
- Disponíveis para US, EU, Japão e Austrália
- Prêmio de preço de 10% reflete custos de infraestrutura para capacidade regional dedicada

### Implementação

**Usando global endpoints (padrão para Sonnet 4.5 e 4):**

Os IDs de modelo para Claude Sonnet 4.5 e 4 já incluem o prefixo `global.`:

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

**Usando regional endpoints (CRIS):**

Para usar endpoints regionais, remova o prefixo `global.` do ID do modelo:

<CodeGroup>
```python Python
from anthropic import AnthropicBedrock

client = AnthropicBedrock(aws_region="us-west-2")

# Usando endpoint regional US (CRIS)
message = client.messages.create(
    model="anthropic.claude-sonnet-4-5-20250929-v1:0",  # Sem prefixo global.
    max_tokens=256,
    messages=[{"role": "user", "content": "Hello, world"}]
)
```

```typescript TypeScript
import AnthropicBedrock from '@anthropic-ai/bedrock-sdk';

const client = new AnthropicBedrock({
  awsRegion: 'us-west-2',
});

// Usando endpoint regional US (CRIS)
const message = await client.messages.create({
  model: 'anthropic.claude-sonnet-4-5-20250929-v1:0',  // Sem prefixo global.
  max_tokens: 256,
  messages: [{role: "user", content: "Hello, world"}]
});
```
</CodeGroup>

### Recursos adicionais

- **Preço do AWS Bedrock:** [aws.amazon.com/bedrock/pricing](https://aws.amazon.com/bedrock/pricing/)
- **Documentação de preço da AWS:** [Guia de preço do Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/bedrock-pricing.html)
- **Post do blog AWS:** [Apresentando Claude Sonnet 4.5 no Amazon Bedrock](https://aws.amazon.com/blogs/aws/introducing-claude-sonnet-4-5-in-amazon-bedrock-anthropics-most-intelligent-model-best-for-coding-and-complex-agents/)
- **Detalhes de preço da Anthropic:** [Documentação de preço](/docs/pt-BR/about-claude/pricing#third-party-platform-pricing)