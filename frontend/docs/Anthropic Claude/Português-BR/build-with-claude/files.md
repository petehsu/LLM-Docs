# API de Arquivos

Faça upload e gerencie arquivos para usar com a API Claude sem fazer re-upload de conteúdo a cada solicitação.

---

A API de Arquivos permite que você faça upload e gerencie arquivos para usar com a API Claude sem fazer re-upload de conteúdo a cada solicitação. Isso é particularmente útil ao usar a [ferramenta de execução de código](/docs/pt-BR/agents-and-tools/tool-use/code-execution-tool) para fornecer entradas (por exemplo, conjuntos de dados e documentos) e depois baixar saídas (por exemplo, gráficos). Você também pode usar a API de Arquivos para evitar ter que fazer re-upload continuamente de documentos e imagens frequentemente usados em várias chamadas de API. Você pode [explorar a referência da API diretamente](/docs/pt-BR/api/files-create), além deste guia.

<Note>
A API de Arquivos está atualmente em beta. Entre em contato através do nosso [formulário de feedback](https://forms.gle/tisHyierGwgN4DUE9) para compartilhar sua experiência com a API de Arquivos.
</Note>

## Modelos suportados

Referenciar um `file_id` em uma solicitação de Mensagens é suportado em todos os modelos que suportam o tipo de arquivo fornecido. Por exemplo, [imagens](/docs/pt-BR/build-with-claude/vision) são suportadas em todos os modelos Claude 3+, [PDFs](/docs/pt-BR/build-with-claude/pdf-support) em todos os modelos Claude 3.5+, e [vários outros tipos de arquivo](/docs/pt-BR/agents-and-tools/tool-use/code-execution-tool#supported-file-types) para a ferramenta de execução de código em Claude 3.5 Haiku mais todos os modelos Claude 3.7+.

A API de Arquivos não é atualmente suportada no Amazon Bedrock ou Google Vertex AI.

## Como a API de Arquivos funciona

A API de Arquivos fornece uma abordagem simples de criar uma vez, usar muitas vezes para trabalhar com arquivos:

- **Faça upload de arquivos** para nosso armazenamento seguro e receba um `file_id` único
- **Baixe arquivos** que são criados a partir de skills ou da ferramenta de execução de código
- **Referencie arquivos** em solicitações de [Mensagens](/docs/pt-BR/api/messages) usando o `file_id` em vez de fazer re-upload de conteúdo
- **Gerencie seus arquivos** com operações de listagem, recuperação e exclusão

## Como usar a API de Arquivos

<Note>
Para usar a API de Arquivos, você precisará incluir o cabeçalho de recurso beta: `anthropic-beta: files-api-2025-04-14`.
</Note>

### Fazendo upload de um arquivo

Faça upload de um arquivo para ser referenciado em futuras chamadas de API:

<CodeGroup>
```bash Shell
curl -X POST https://api.anthropic.com/v1/files \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  -F "file=@/path/to/document.pdf"
```

```python Python
import anthropic

client = anthropic.Anthropic()
client.beta.files.upload(
  file=("document.pdf", open("/path/to/document.pdf", "rb"), "application/pdf"),
)
```

```typescript TypeScript
import Anthropic, { toFile } from '@anthropic-ai/sdk';
import fs from "fs";

const anthropic = new Anthropic();

await anthropic.beta.files.upload({
  file: await toFile(fs.createReadStream('/path/to/document.pdf'), undefined, { type: 'application/pdf' })
}, {
  betas: ['files-api-2025-04-14']
});
```
</CodeGroup>

A resposta do upload de um arquivo incluirá:

```json
{
  "id": "file_011CNha8iCJcU1wXNR6q4V8w",
  "type": "file",
  "filename": "document.pdf",
  "mime_type": "application/pdf",
  "size_bytes": 1024000,
  "created_at": "2025-01-01T00:00:00Z",
  "downloadable": false
}
```

### Usando um arquivo em mensagens

Uma vez enviado, referencie o arquivo usando seu `file_id`:

<CodeGroup>
```bash Shell
curl -X POST https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "Please summarize this document for me."          
          },
          {
            "type": "document",
            "source": {
              "type": "file",
              "file_id": "file_011CNha8iCJcU1wXNR6q4V8w"
            }
          }
        ]
      }
    ]
  }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Please summarize this document for me."
                },
                {
                    "type": "document",
                    "source": {
                        "type": "file",
                        "file_id": "file_011CNha8iCJcU1wXNR6q4V8w"
                    }
                }
            ]
        }
    ],
    betas=["files-api-2025-04-14"],
)
print(response)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "Please summarize this document for me."
        },
        {
          type: "document",
          source: {
            type: "file",
            file_id: "file_011CNha8iCJcU1wXNR6q4V8w"
          }
        }
      ]
    }
  ],
  betas: ["files-api-2025-04-14"],
});

console.log(response);
```
</CodeGroup>

### Tipos de arquivo e blocos de conteúdo

A API de Arquivos suporta diferentes tipos de arquivo que correspondem a diferentes tipos de bloco de conteúdo:

| Tipo de Arquivo | Tipo MIME | Tipo de Bloco de Conteúdo | Caso de Uso |
| :--- | :--- | :--- | :--- |
| PDF | `application/pdf` | `document` | Análise de texto, processamento de documentos |
| Texto simples | `text/plain` | `document` | Análise de texto, processamento |
| Imagens | `image/jpeg`, `image/png`, `image/gif`, `image/webp` | `image` | Análise de imagem, tarefas visuais |
| [Conjuntos de dados, outros](/docs/pt-BR/agents-and-tools/tool-use/code-execution-tool#supported-file-types) | Varia | `container_upload` | Analisar dados, criar visualizações  |

### Trabalhando com outros formatos de arquivo

Para tipos de arquivo que não são suportados como blocos `document` (.csv, .txt, .md, .docx, .xlsx), converta os arquivos para texto simples e inclua o conteúdo diretamente em sua mensagem:

<CodeGroup>
```bash Shell
# Exemplo: Lendo um arquivo de texto e enviando-o como texto simples
# Nota: Para arquivos com caracteres especiais, considere codificação base64
TEXT_CONTENT=$(cat document.txt | jq -Rs .)

curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d @- <<EOF
{
  "model": "claude-sonnet-4-5",
  "max_tokens": 1024,
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "Here's the document content:\n\n${TEXT_CONTENT}\n\nPlease summarize this document."
        }
      ]
    }
  ]
}
EOF
```

```python Python
import pandas as pd
import anthropic

client = anthropic.Anthropic()

# Exemplo: Lendo um arquivo CSV
df = pd.read_csv('data.csv')
csv_content = df.to_string()

# Enviar como texto simples na mensagem
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": f"Here's the CSV data:\n\n{csv_content}\n\nPlease analyze this data."
                }
            ]
        }
    ]
)

print(response.content[0].text)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';
import fs from 'fs';

const anthropic = new Anthropic();

async function analyzeDocument() {
  // Exemplo: Lendo um arquivo de texto
  const textContent = fs.readFileSync('document.txt', 'utf-8');

  // Enviar como texto simples na mensagem
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Here's the document content:\n\n${textContent}\n\nPlease summarize this document.`
          }
        ]
      }
    ]
  });

  console.log(response.content[0].text);
}

analyzeDocument();
```
</CodeGroup>

<Note>
Para arquivos .docx contendo imagens, converta-os para formato PDF primeiro, depois use [suporte a PDF](/docs/pt-BR/build-with-claude/pdf-support) para aproveitar a análise de imagem integrada. Isso permite usar citações do documento PDF.
</Note>

#### Blocos de documento

Para PDFs e arquivos de texto, use o bloco de conteúdo `document`:

```json
{
  "type": "document",
  "source": {
    "type": "file",
    "file_id": "file_011CNha8iCJcU1wXNR6q4V8w"
  },
  "title": "Document Title", // Opcional
  "context": "Context about the document", // Opcional  
  "citations": {"enabled": true} // Opcional, habilita citações
}
```

#### Blocos de imagem

Para imagens, use o bloco de conteúdo `image`:

```json
{
  "type": "image",
  "source": {
    "type": "file",
    "file_id": "file_011CPMxVD3fHLUhvTqtsQA5w"
  }
}
```

### Gerenciando arquivos

#### Listar arquivos

Recupere uma lista de seus arquivos enviados:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/files \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14"
```

```python Python
import anthropic

client = anthropic.Anthropic()
files = client.beta.files.list()
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();
const files = await anthropic.beta.files.list({
  betas: ['files-api-2025-04-14'],
});
```
</CodeGroup>

#### Obter metadados do arquivo

Recupere informações sobre um arquivo específico:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/files/file_011CNha8iCJcU1wXNR6q4V8w \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14"
```

```python Python
import anthropic

client = anthropic.Anthropic()
file = client.beta.files.retrieve_metadata("file_011CNha8iCJcU1wXNR6q4V8w")
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();
const file = await anthropic.beta.files.retrieveMetadata(
  "file_011CNha8iCJcU1wXNR6q4V8w",
  { betas: ['files-api-2025-04-14'] },
);
```
</CodeGroup>

#### Excluir um arquivo

Remova um arquivo de seu workspace:

<CodeGroup>
```bash Shell
curl -X DELETE https://api.anthropic.com/v1/files/file_011CNha8iCJcU1wXNR6q4V8w \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14"
```

```python Python
import anthropic

client = anthropic.Anthropic()
result = client.beta.files.delete("file_011CNha8iCJcU1wXNR6q4V8w")
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();
const result = await anthropic.beta.files.delete(
  "file_011CNha8iCJcU1wXNR6q4V8w",
  { betas: ['files-api-2025-04-14'] },
);
```
</CodeGroup>

### Baixando um arquivo

Baixe arquivos que foram criados por skills ou pela ferramenta de execução de código:

<CodeGroup>
```bash Shell
curl -X GET "https://api.anthropic.com/v1/files/file_011CNha8iCJcU1wXNR6q4V8w/content" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  --output downloaded_file.txt
```

```python Python
import anthropic

client = anthropic.Anthropic()
file_content = client.beta.files.download("file_011CNha8iCJcU1wXNR6q4V8w")

# Salvar em arquivo
with open("downloaded_file.txt", "w") as f:
    f.write(file_content.decode('utf-8'))
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';
import fs from 'fs';

const anthropic = new Anthropic();

const fileContent = await anthropic.beta.files.download(
  "file_011CNha8iCJcU1wXNR6q4V8w",
  { betas: ['files-api-2025-04-14'] },
);

// Salvar em arquivo
fs.writeFileSync("downloaded_file.txt", fileContent);
```
</CodeGroup>

<Note>
Você só pode baixar arquivos que foram criados por [skills](/docs/pt-BR/build-with-claude/skills-guide) ou pela [ferramenta de execução de código](/docs/pt-BR/agents-and-tools/tool-use/code-execution-tool). Arquivos que você enviou não podem ser baixados.
</Note>

---

## Armazenamento de arquivo e limites

### Limites de armazenamento

- **Tamanho máximo de arquivo:** 500 MB por arquivo
- **Armazenamento total:** 100 GB por organização

### Ciclo de vida do arquivo

- Os arquivos estão no escopo do workspace da chave de API. Outras chaves de API podem usar arquivos criados por qualquer outra chave de API associada ao mesmo workspace
- Os arquivos persistem até que você os exclua
- Arquivos excluídos não podem ser recuperados
- Os arquivos ficam inacessíveis via API logo após a exclusão, mas podem persistir em chamadas ativas da API de Mensagens e usos de ferramentas associados
- Os arquivos que os usuários excluem serão excluídos de acordo com nossa [política de retenção de dados](https://privacy.claude.com/en/articles/7996866-how-long-do-you-store-my-organization-s-data).

---

## Tratamento de erros

Erros comuns ao usar a API de Arquivos incluem:

- **Arquivo não encontrado (404):** O `file_id` especificado não existe ou você não tem acesso a ele
- **Tipo de arquivo inválido (400):** O tipo de arquivo não corresponde ao tipo de bloco de conteúdo (por exemplo, usar um arquivo de imagem em um bloco de documento)
- **Excede o tamanho da janela de contexto (400):** O arquivo é maior que o tamanho da janela de contexto (por exemplo, usar um arquivo de texto simples de 500 MB em uma solicitação `/v1/messages`)
- **Nome de arquivo inválido (400):** O nome do arquivo não atende aos requisitos de comprimento (1-255 caracteres) ou contém caracteres proibidos (`<`, `>`, `:`, `"`, `|`, `?`, `*`, `\`, `/`, ou caracteres unicode 0-31)
- **Arquivo muito grande (413):** O arquivo excede o limite de 500 MB
- **Limite de armazenamento excedido (403):** Sua organização atingiu o limite de armazenamento de 100 GB

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "File not found: file_011CNha8iCJcU1wXNR6q4V8w"
  }
}
```

## Uso e faturamento

As operações da API de Arquivo são **gratuitas**:
- Fazer upload de arquivos
- Baixar arquivos
- Listar arquivos
- Obter metadados do arquivo  
- Excluir arquivos

O conteúdo do arquivo usado em solicitações de `Messages` é cobrado como tokens de entrada. Você só pode baixar arquivos criados por [skills](/docs/pt-BR/build-with-claude/skills-guide) ou pela [ferramenta de execução de código](/docs/pt-BR/agents-and-tools/tool-use/code-execution-tool).

### Limites de taxa

Durante o período beta:
- As chamadas de API relacionadas a arquivos são limitadas a aproximadamente 100 solicitações por minuto
- [Entre em contato conosco](mailto:sales@anthropic.com) se você precisar de limites mais altos para seu caso de uso