# Ferramenta de execução de código

Claude pode analisar dados, criar visualizações, realizar cálculos complexos, executar comandos do sistema, criar e editar arquivos e processar arquivos enviados diretamente na conversa da API.

---

Claude pode analisar dados, criar visualizações, realizar cálculos complexos, executar comandos do sistema, criar e editar arquivos e processar arquivos enviados diretamente na conversa da API.
A ferramenta de execução de código permite que Claude execute comandos Bash e manipule arquivos, incluindo escrever código, em um ambiente seguro e isolado.

<Note>
A ferramenta de execução de código está atualmente em beta público.

Para usar este recurso, adicione o cabeçalho beta `"code-execution-2025-08-25"` [beta header](/docs/pt-BR/api/beta-headers) às suas solicitações de API.
</Note>

## Compatibilidade de modelos

A ferramenta de execução de código está disponível nos seguintes modelos:

| Modelo | Versão da Ferramenta |
|-------|--------------|
| Claude Opus 4.5 (`claude-opus-4-5-20251101`) | `code_execution_20250825` |
| Claude Opus 4.1 (`claude-opus-4-1-20250805`) | `code_execution_20250825` |
| Claude Opus 4 (`claude-opus-4-20250514`) | `code_execution_20250825` |
| Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`) | `code_execution_20250825` |
| Claude Sonnet 4 (`claude-sonnet-4-20250514`) | `code_execution_20250825` |
| Claude Sonnet 3.7 (`claude-3-7-sonnet-20250219`) ([descontinuado](/docs/pt-BR/about-claude/model-deprecations)) | `code_execution_20250825` |
| Claude Haiku 4.5 (`claude-haiku-4-5-20251001`) | `code_execution_20250825` |
| Claude Haiku 3.5 (`claude-3-5-haiku-latest`) | `code_execution_20250825` |

<Note>
A versão atual `code_execution_20250825` suporta comandos Bash e operações de arquivo. Uma versão legada `code_execution_20250522` (apenas Python) também está disponível. Consulte [Atualizar para a versão mais recente da ferramenta](#upgrade-to-latest-tool-version) para detalhes de migração.
</Note>

<Warning>
Versões mais antigas da ferramenta não têm garantia de compatibilidade com versões mais recentes de modelos. Sempre use a versão da ferramenta que corresponde à versão do seu modelo.
</Warning>

## Início rápido

Aqui está um exemplo simples que pede a Claude para realizar um cálculo:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: code-execution-2025-08-25" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": "Calculate the mean and standard deviation of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
            }
        ],
        "tools": [{
            "type": "code_execution_20250825",
            "name": "code_execution"
        }]
    }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["code-execution-2025-08-25"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Calculate the mean and standard deviation of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)

print(response)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

async function main() {
  const response = await anthropic.beta.messages.create({
    model: "claude-sonnet-4-5",
    betas: ["code-execution-2025-08-25"],
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: "Calculate the mean and standard deviation of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
      }
    ],
    tools: [{
      type: "code_execution_20250825",
      name: "code_execution"
    }]
  });

  console.log(response);
}

main().catch(console.error);
```
</CodeGroup>

## Como funciona a execução de código

Quando você adiciona a ferramenta de execução de código à sua solicitação de API:

1. Claude avalia se a execução de código ajudaria a responder sua pergunta
2. A ferramenta fornece automaticamente a Claude as seguintes capacidades:
   - **Comandos Bash**: Execute comandos de shell para operações do sistema e gerenciamento de pacotes
   - **Operações de arquivo**: Crie, visualize e edite arquivos diretamente, incluindo escrever código
3. Claude pode usar qualquer combinação dessas capacidades em uma única solicitação
4. Todas as operações são executadas em um ambiente sandbox seguro
5. Claude fornece resultados com quaisquer gráficos gerados, cálculos ou análises

## Como usar a ferramenta

### Executar comandos Bash

Peça a Claude para verificar informações do sistema e instalar pacotes:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: code-execution-2025-08-25" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [{
            "role": "user",
            "content": "Check the Python version and list installed packages"
        }],
        "tools": [{
            "type": "code_execution_20250825",
            "name": "code_execution"
        }]
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["code-execution-2025-08-25"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Check the Python version and list installed packages"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  betas: ["code-execution-2025-08-25"],
  max_tokens: 4096,
  messages: [{
    role: "user",
    content: "Check the Python version and list installed packages"
  }],
  tools: [{
    type: "code_execution_20250825",
    name: "code_execution"
  }]
});
```
</CodeGroup>

### Criar e editar arquivos diretamente

Claude pode criar, visualizar e editar arquivos diretamente no sandbox usando as capacidades de manipulação de arquivo:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: code-execution-2025-08-25" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [{
            "role": "user",
            "content": "Create a config.yaml file with database settings, then update the port from 5432 to 3306"
        }],
        "tools": [{
            "type": "code_execution_20250825",
            "name": "code_execution"
        }]
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["code-execution-2025-08-25"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Create a config.yaml file with database settings, then update the port from 5432 to 3306"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  betas: ["code-execution-2025-08-25"],
  max_tokens: 4096,
  messages: [{
    role: "user",
    content: "Create a config.yaml file with database settings, then update the port from 5432 to 3306"
  }],
  tools: [{
    type: "code_execution_20250825",
    name: "code_execution"
  }]
});
```
</CodeGroup>

### Enviar e analisar seus próprios arquivos

Para analisar seus próprios arquivos de dados (CSV, Excel, imagens, etc.), envie-os via Files API e faça referência a eles em sua solicitação:

<Note>
Usar a Files API com Code Execution requer dois cabeçalhos beta: `"anthropic-beta": "code-execution-2025-08-25,files-api-2025-04-14"`
</Note>

O ambiente Python pode processar vários tipos de arquivo enviados via Files API, incluindo:

- CSV
- Excel (.xlsx, .xls)
- JSON
- XML
- Imagens (JPEG, PNG, GIF, WebP)
- Arquivos de texto (.txt, .md, .py, etc)

#### Enviar e analisar arquivos

1. **Envie seu arquivo** usando a [Files API](/docs/pt-BR/build-with-claude/files)
2. **Faça referência ao arquivo** em sua mensagem usando um bloco de conteúdo `container_upload`
3. **Inclua a ferramenta de execução de código** em sua solicitação de API

<CodeGroup>
```bash Shell
# Primeiro, envie um arquivo
curl https://api.anthropic.com/v1/files \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: files-api-2025-04-14" \
    --form 'file=@"data.csv"' \

# Depois use o file_id com execução de código
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: code-execution-2025-08-25,files-api-2025-04-14" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [{
            "role": "user",
            "content": [
                {"type": "text", "text": "Analyze this CSV data"},
                {"type": "container_upload", "file_id": "file_abc123"}
            ]
        }],
        "tools": [{
            "type": "code_execution_20250825",
            "name": "code_execution"
        }]
    }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

# Envie um arquivo
file_object = client.beta.files.upload(
    file=open("data.csv", "rb"),
)

# Use o file_id com execução de código
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["code-execution-2025-08-25", "files-api-2025-04-14"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": "Analyze this CSV data"},
            {"type": "container_upload", "file_id": file_object.id}
        ]
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';
import { createReadStream } from 'fs';

const anthropic = new Anthropic();

async function main() {
  // Envie um arquivo
  const fileObject = await anthropic.beta.files.create({
    file: createReadStream("data.csv"),
  });

  // Use o file_id com execução de código
  const response = await anthropic.beta.messages.create({
    model: "claude-sonnet-4-5",
    betas: ["code-execution-2025-08-25", "files-api-2025-04-14"],
    max_tokens: 4096,
    messages: [{
      role: "user",
      content: [
        { type: "text", text: "Analyze this CSV data" },
        { type: "container_upload", file_id: fileObject.id }
      ]
    }],
    tools: [{
      type: "code_execution_20250825",
      name: "code_execution"
    }]
  });

  console.log(response);
}

main().catch(console.error);
```
</CodeGroup>

#### Recuperar arquivos gerados

Quando Claude cria arquivos durante a execução de código, você pode recuperar esses arquivos usando a Files API:

<CodeGroup>
```python Python
from anthropic import Anthropic

# Inicialize o cliente
client = Anthropic()

# Solicite execução de código que cria arquivos
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["code-execution-2025-08-25", "files-api-2025-04-14"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Create a matplotlib visualization and save it as output.png"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)

# Extraia IDs de arquivo da resposta
def extract_file_ids(response):
    file_ids = []
    for item in response.content:
        if item.type == 'bash_code_execution_tool_result':
            content_item = item.content
            if content_item.type == 'bash_code_execution_result':
                for file in content_item.content:
                    if hasattr(file, 'file_id'):
                        file_ids.append(file.file_id)
    return file_ids

# Baixe os arquivos criados
for file_id in extract_file_ids(response):
    file_metadata = client.beta.files.retrieve_metadata(file_id)
    file_content = client.beta.files.download(file_id)
    file_content.write_to_file(file_metadata.filename)
    print(f"Downloaded: {file_metadata.filename}")
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';
import { writeFileSync } from 'fs';

// Inicialize o cliente
const anthropic = new Anthropic();

async function main() {
  // Solicite execução de código que cria arquivos
  const response = await anthropic.beta.messages.create({
    model: "claude-sonnet-4-5",
    betas: ["code-execution-2025-08-25", "files-api-2025-04-14"],
    max_tokens: 4096,
    messages: [{
      role: "user",
      content: "Create a matplotlib visualization and save it as output.png"
    }],
    tools: [{
      type: "code_execution_20250825",
      name: "code_execution"
    }]
  });

  // Extraia IDs de arquivo da resposta
  function extractFileIds(response: any): string[] {
    const fileIds: string[] = [];
    for (const item of response.content) {
      if (item.type === 'bash_code_execution_tool_result') {
        const contentItem = item.content;
        if (contentItem.type === 'bash_code_execution_result' && contentItem.content) {
          for (const file of contentItem.content) {
            fileIds.push(file.file_id);
          }
        }
      }
    }
    return fileIds;
  }

  // Baixe os arquivos criados
  const fileIds = extractFileIds(response);
  for (const fileId of fileIds) {
    const fileMetadata = await anthropic.beta.files.retrieveMetadata(fileId);
    const fileContent = await anthropic.beta.files.download(fileId);

    // Converta ReadableStream em Buffer e salve
    const chunks: Uint8Array[] = [];
    for await (const chunk of fileContent) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    writeFileSync(fileMetadata.filename, buffer);
    console.log(`Downloaded: ${fileMetadata.filename}`);
  }
}

main().catch(console.error);
```
</CodeGroup>

### Combinar operações

Um fluxo de trabalho complexo usando todas as capacidades:

<CodeGroup>
```bash Shell
# Primeiro, envie um arquivo
curl https://api.anthropic.com/v1/files \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: files-api-2025-04-14" \
    --form 'file=@"data.csv"' \
    > file_response.json

# Extraia file_id (usando jq)
FILE_ID=$(jq -r '.id' file_response.json)

# Depois use com execução de código
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: code-execution-2025-08-25,files-api-2025-04-14" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [{
            "role": "user",
            "content": [
                {
                    "type": "text", 
                    "text": "Analyze this CSV data: create a summary report, save visualizations, and create a README with the findings"
                },
                {
                    "type": "container_upload", 
                    "file_id": "'$FILE_ID'"
                }
            ]
        }],
        "tools": [{
            "type": "code_execution_20250825",
            "name": "code_execution"
        }]
    }'
```

```python Python
# Envie um arquivo
file_object = client.beta.files.upload(
    file=open("data.csv", "rb"),
)

# Use com execução de código
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["code-execution-2025-08-25", "files-api-2025-04-14"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": "Analyze this CSV data: create a summary report, save visualizations, and create a README with the findings"},
            {"type": "container_upload", "file_id": file_object.id}
        ]
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)

# Claude pode:
# 1. Usar bash para verificar tamanho do arquivo e visualizar dados
# 2. Usar text_editor para escrever código Python para analisar o CSV e criar visualizações
# 3. Usar bash para executar o código Python
# 4. Usar text_editor para criar um README.md com descobertas
# 5. Usar bash para organizar arquivos em um diretório de relatório
```

```typescript TypeScript
// Envie um arquivo
const fileObject = await anthropic.beta.files.create({
  file: createReadStream("data.csv"),
});

// Use com execução de código
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  betas: ["code-execution-2025-08-25", "files-api-2025-04-14"],
  max_tokens: 4096,
  messages: [{
    role: "user",
    content: [
      {type: "text", text: "Analyze this CSV data: create a summary report, save visualizations, and create a README with the findings"},
      {type: "container_upload", file_id: fileObject.id}
    ]
  }],
  tools: [{
    type: "code_execution_20250825",
    name: "code_execution"
  }]
});

// Claude pode:
// 1. Usar bash para verificar tamanho do arquivo e visualizar dados
// 2. Usar text_editor para escrever código Python para analisar o CSV e criar visualizações
// 3. Usar bash para executar o código Python
// 4. Usar text_editor para criar um README.md com descobertas
// 5. Usar bash para organizar arquivos em um diretório de relatório
```
</CodeGroup>

## Definição da ferramenta

A ferramenta de execução de código não requer parâmetros adicionais:

```json JSON
{
  "type": "code_execution_20250825",
  "name": "code_execution"
}
```

Quando esta ferramenta é fornecida, Claude ganha automaticamente acesso a duas sub-ferramentas:
- `bash_code_execution`: Execute comandos de shell
- `text_editor_code_execution`: Visualize, crie e edite arquivos, incluindo escrever código

## Formato de resposta

A ferramenta de execução de código pode retornar dois tipos de resultados dependendo da operação:

### Resposta de comando Bash

```json
{
  "type": "server_tool_use",
  "id": "srvtoolu_01B3C4D5E6F7G8H9I0J1K2L3",
  "name": "bash_code_execution",
  "input": {
    "command": "ls -la | head -5"
  }
},
{
  "type": "bash_code_execution_tool_result",
  "tool_use_id": "srvtoolu_01B3C4D5E6F7G8H9I0J1K2L3",
  "content": {
    "type": "bash_code_execution_result",
    "stdout": "total 24\ndrwxr-xr-x 2 user user 4096 Jan 1 12:00 .\ndrwxr-xr-x 3 user user 4096 Jan 1 11:00 ..\n-rw-r--r-- 1 user user  220 Jan 1 12:00 data.csv\n-rw-r--r-- 1 user user  180 Jan 1 12:00 config.json",
    "stderr": "",
    "return_code": 0
  }
}
```

### Respostas de operação de arquivo

**Visualizar arquivo:**
```json
{
  "type": "server_tool_use",
  "id": "srvtoolu_01C4D5E6F7G8H9I0J1K2L3M4",
  "name": "text_editor_code_execution",
  "input": {
    "command": "view",
    "path": "config.json"
  }
},
{
  "type": "text_editor_code_execution_tool_result",
  "tool_use_id": "srvtoolu_01C4D5E6F7G8H9I0J1K2L3M4",
  "content": {
    "type": "text_editor_code_execution_result",
    "file_type": "text",
    "content": "{\n  \"setting\": \"value\",\n  \"debug\": true\n}",
    "numLines": 4,
    "startLine": 1,
    "totalLines": 4
  }
}
```

**Criar arquivo:**
```json
{
  "type": "server_tool_use",
  "id": "srvtoolu_01D5E6F7G8H9I0J1K2L3M4N5",
  "name": "text_editor_code_execution",
  "input": {
    "command": "create",
    "path": "new_file.txt",
    "file_text": "Hello, World!"
  }
},
{
  "type": "text_editor_code_execution_tool_result",
  "tool_use_id": "srvtoolu_01D5E6F7G8H9I0J1K2L3M4N5",
  "content": {
    "type": "text_editor_code_execution_result",
    "is_file_update": false
  }
}
```

**Editar arquivo (str_replace):**
```json
{
  "type": "server_tool_use",
  "id": "srvtoolu_01E6F7G8H9I0J1K2L3M4N5O6",
  "name": "text_editor_code_execution",
  "input": {
    "command": "str_replace",
    "path": "config.json",
    "old_str": "\"debug\": true",
    "new_str": "\"debug\": false"
  }
},
{
  "type": "text_editor_code_execution_tool_result",
  "tool_use_id": "srvtoolu_01E6F7G8H9I0J1K2L3M4N5O6",
  "content": {
    "type": "text_editor_code_execution_result",
    "oldStart": 3,
    "oldLines": 1,
    "newStart": 3,
    "newLines": 1,
    "lines": ["-  \"debug\": true", "+  \"debug\": false"]
  }
}
```

### Resultados

Todos os resultados de execução incluem:
- `stdout`: Saída da execução bem-sucedida
- `stderr`: Mensagens de erro se a execução falhar
- `return_code`: 0 para sucesso, não-zero para falha

Campos adicionais para operações de arquivo:
- **Visualizar**: `file_type`, `content`, `numLines`, `startLine`, `totalLines`
- **Criar**: `is_file_update` (se o arquivo já existia)
- **Editar**: `oldStart`, `oldLines`, `newStart`, `newLines`, `lines` (formato diff)

### Erros

Cada tipo de ferramenta pode retornar erros específicos:

**Erros comuns (todas as ferramentas):**
```json
{
  "type": "bash_code_execution_tool_result",
  "tool_use_id": "srvtoolu_01VfmxgZ46TiHbmXgy928hQR",
  "content": {
    "type": "bash_code_execution_tool_result_error",
    "error_code": "unavailable"
  }
}
```

**Códigos de erro por tipo de ferramenta:**

| Ferramenta | Código de Erro | Descrição |
|------|-----------|-------------|
| Todas as ferramentas | `unavailable` | A ferramenta está temporariamente indisponível |
| Todas as ferramentas | `execution_time_exceeded` | A execução excedeu o limite máximo de tempo |
| Todas as ferramentas | `container_expired` | O container expirou e não está mais disponível |
| Todas as ferramentas | `invalid_tool_input` | Parâmetros inválidos fornecidos à ferramenta |
| Todas as ferramentas | `too_many_requests` | Limite de taxa excedido para uso da ferramenta |
| text_editor | `file_not_found` | Arquivo não existe (para operações de visualização/edição) |
| text_editor | `string_not_found` | O `old_str` não foi encontrado no arquivo (para str_replace) |

#### Motivo de parada `pause_turn`

A resposta pode incluir um motivo de parada `pause_turn`, que indica que a API pausou uma volta de longa duração. Você pode fornecer a resposta como está em uma solicitação subsequente para deixar Claude continuar sua volta, ou modificar o conteúdo se desejar interromper a conversa.

## Containers

A ferramenta de execução de código é executada em um ambiente containerizado seguro projetado especificamente para execução de código, com foco maior em Python.

### Ambiente de execução
- **Versão do Python**: 3.11.12
- **Sistema operacional**: Container baseado em Linux
- **Arquitetura**: x86_64 (AMD64)

### Limites de recursos
- **Memória**: 5GiB RAM
- **Espaço em disco**: 5GiB de armazenamento de workspace
- **CPU**: 1 CPU

### Rede e segurança
- **Acesso à Internet**: Completamente desabilitado por segurança
- **Conexões externas**: Nenhuma solicitação de rede de saída permitida
- **Isolamento de sandbox**: Isolamento completo do sistema host e outros containers
- **Acesso a arquivo**: Limitado apenas ao diretório de workspace
- **Escopo do workspace**: Como [Files](/docs/pt-BR/build-with-claude/files), containers são escopo do workspace da chave de API
- **Expiração**: Containers expiram 30 dias após a criação

### Bibliotecas pré-instaladas
O ambiente Python em sandbox inclui estas bibliotecas comumente usadas:
- **Ciência de Dados**: pandas, numpy, scipy, scikit-learn, statsmodels
- **Visualização**: matplotlib, seaborn
- **Processamento de Arquivo**: pyarrow, openpyxl, xlsxwriter, xlrd, pillow, python-pptx, python-docx, pypdf, pdfplumber, pypdfium2, pdf2image, pdfkit, tabula-py, reportlab[pycairo], Img2pdf
- **Matemática e Computação**: sympy, mpmath
- **Utilitários**: tqdm, python-dateutil, pytz, joblib, unzip, unrar, 7zip, bc, rg (ripgrep), fd, sqlite

## Reutilização de container

Você pode reutilizar um container existente em várias solicitações de API fornecendo o ID do container de uma resposta anterior.
Isso permite que você mantenha arquivos criados entre solicitações.

### Exemplo

<CodeGroup>
```python Python
import os
from anthropic import Anthropic

# Inicialize o cliente
client = Anthropic(
    api_key=os.getenv("ANTHROPIC_API_KEY")
)

# Primeira solicitação: Crie um arquivo com um número aleatório
response1 = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["code-execution-2025-08-25"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Write a file with a random number and save it to '/tmp/number.txt'"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)

# Extraia o ID do container da primeira resposta
container_id = response1.container.id

# Segunda solicitação: Reutilize o container para ler o arquivo
response2 = client.beta.messages.create(
    container=container_id,  # Reutilize o mesmo container
    model="claude-sonnet-4-5",
    betas=["code-execution-2025-08-25"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Read the number from '/tmp/number.txt' and calculate its square"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

async function main() {
  // Primeira solicitação: Crie um arquivo com um número aleatório
  const response1 = await anthropic.beta.messages.create({
    model: "claude-sonnet-4-5",
    betas: ["code-execution-2025-08-25"],
    max_tokens: 4096,
    messages: [{
      role: "user",
      content: "Write a file with a random number and save it to '/tmp/number.txt'"
    }],
    tools: [{
      type: "code_execution_20250825",
      name: "code_execution"
    }]
  });

  // Extraia o ID do container da primeira resposta
  const containerId = response1.container.id;

  // Segunda solicitação: Reutilize o container para ler o arquivo
  const response2 = await anthropic.beta.messages.create({
    container: containerId,  // Reutilize o mesmo container
    model: "claude-sonnet-4-5",
    betas: ["code-execution-2025-08-25"],
    max_tokens: 4096,
    messages: [{
      role: "user",
      content: "Read the number from '/tmp/number.txt' and calculate its square"
    }],
    tools: [{
      type: "code_execution_20250825",
      name: "code_execution"
    }]
  });

  console.log(response2.content);
}

main().catch(console.error);
```

```bash Shell
# Primeira solicitação: Crie um arquivo com um número aleatório
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: code-execution-2025-08-25" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [{
            "role": "user",
            "content": "Write a file with a random number and save it to \"/tmp/number.txt\""
        }],
        "tools": [{
            "type": "code_execution_20250825",
            "name": "code_execution"
        }]
    }' > response1.json

# Extraia o ID do container da resposta (usando jq)
CONTAINER_ID=$(jq -r '.container.id' response1.json)

# Segunda solicitação: Reutilize o container para ler o arquivo
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: code-execution-2025-08-25" \
    --header "content-type: application/json" \
    --data '{
        "container": "'$CONTAINER_ID'",
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [{
            "role": "user",
            "content": "Read the number from \"/tmp/number.txt\" and calculate its square"
        }],
        "tools": [{
            "type": "code_execution_20250825",
            "name": "code_execution"
        }]
    }'
```
</CodeGroup>

## Streaming

Com streaming habilitado, você receberá eventos de execução de código conforme ocorrem:

```javascript
event: content_block_start
data: {"type": "content_block_start", "index": 1, "content_block": {"type": "server_tool_use", "id": "srvtoolu_xyz789", "name": "code_execution"}}

// Execução de código transmitida
event: content_block_delta
data: {"type": "content_block_delta", "index": 1, "delta": {"type": "input_json_delta", "partial_json": "{\"code\":\"import pandas as pd\\ndf = pd.read_csv('data.csv')\\nprint(df.head())\"}"}}

// Pausa enquanto o código é executado

// Resultados de execução transmitidos
event: content_block_start
data: {"type": "content_block_start", "index": 2, "content_block": {"type": "code_execution_tool_result", "tool_use_id": "srvtoolu_xyz789", "content": {"stdout": "   A  B  C\n0  1  2  3\n1  4  5  6", "stderr": ""}}}
```

## Solicitações em lote

Você pode incluir a ferramenta de execução de código na [Messages Batches API](/docs/pt-BR/build-with-claude/batch-processing). Chamadas de ferramenta de execução de código através da Messages Batches API são precificadas da mesma forma que aquelas em solicitações regulares da Messages API.

## Uso e preços

Code execution tool usage is tracked separately from token usage. Execution time has a minimum of 5 minutes.
If files are included in the request, execution time is billed even if the tool is not used due to files being preloaded onto the container.

Each organization receives 50 free hours of usage with the code execution tool per day. Additional usage beyond the first 50 hours is billed at $0.05 per hour, per container.

## Atualizar para a versão mais recente da ferramenta

Ao atualizar para `code-execution-2025-08-25`, você ganha acesso a manipulação de arquivo e capacidades Bash, incluindo código em múltiplas linguagens. Não há diferença de preço.

### O que mudou

| Componente | Legado | Atual |
|-----------|------------------|----------------------------|
| Cabeçalho beta | `code-execution-2025-05-22` | `code-execution-2025-08-25` |
| Tipo de ferramenta | `code_execution_20250522` | `code_execution_20250825` |
| Capacidades | Apenas Python | Comandos Bash, operações de arquivo |
| Tipos de resposta | `code_execution_result` | `bash_code_execution_result`, `text_editor_code_execution_result` |

### Compatibilidade com versões anteriores

- Todo código Python de execução existente continua funcionando exatamente como antes
- Nenhuma alteração necessária para fluxos de trabalho existentes apenas em Python

### Etapas de atualização

Para atualizar, você precisa fazer as seguintes alterações em suas solicitações de API:

1. **Atualize o cabeçalho beta**:
   ```diff
   - "anthropic-beta": "code-execution-2025-05-22"
   + "anthropic-beta": "code-execution-2025-08-25"
   ```

2. **Atualize o tipo de ferramenta**:
   ```diff
   - "type": "code_execution_20250522"
   + "type": "code_execution_20250825"
   ```

3. **Revise o tratamento de resposta** (se analisar respostas programaticamente):
   - Os blocos anteriores para respostas de execução Python não serão mais enviados
   - Em vez disso, novos tipos de resposta para operações Bash e arquivo serão enviados (consulte a seção Formato de Resposta)

## Chamada de ferramenta programática

A ferramenta de execução de código alimenta [chamada de ferramenta programática](/docs/pt-BR/agents-and-tools/tool-use/programmatic-tool-calling), que permite que Claude escreva código que chama suas ferramentas personalizadas programaticamente dentro do container de execução. Isso permite fluxos de trabalho eficientes com múltiplas ferramentas, filtragem de dados antes de chegar ao contexto de Claude e lógica condicional complexa.

<CodeGroup>
```python Python
# Habilite chamada programática para suas ferramentas
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Get weather for 5 cities and find the warmest"
    }],
    tools=[
        {
            "type": "code_execution_20250825",
            "name": "code_execution"
        },
        {
            "name": "get_weather",
            "description": "Get weather for a city",
            "input_schema": {...},
            "allowed_callers": ["code_execution_20250825"]  # Habilite chamada programática
        }
    ]
)
```
</CodeGroup>

Saiba mais na [documentação de chamada de ferramenta programática](/docs/pt-BR/agents-and-tools/tool-use/programmatic-tool-calling).

## Usando execução de código com Agent Skills

A ferramenta de execução de código permite que Claude use [Agent Skills](/docs/pt-BR/agents-and-tools/agent-skills/overview). Skills são capacidades modulares consistindo de instruções, scripts e recursos que estendem a funcionalidade de Claude.

Saiba mais na [documentação de Agent Skills](/docs/pt-BR/agents-and-tools/agent-skills/overview) e [guia de API de Agent Skills](/docs/pt-BR/build-with-claude/skills-guide).