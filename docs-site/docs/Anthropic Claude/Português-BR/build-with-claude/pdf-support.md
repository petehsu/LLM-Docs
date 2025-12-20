# Suporte a PDF

Processe PDFs com Claude. Extraia texto, analise gráficos e compreenda conteúdo visual de seus documentos.

---

Agora você pode perguntar ao Claude sobre qualquer texto, imagens, gráficos e tabelas em PDFs que você fornecer. Alguns casos de uso de exemplo:
- Analisar relatórios financeiros e compreender gráficos/tabelas
- Extrair informações-chave de documentos legais
- Assistência de tradução para documentos
- Converter informações de documentos em formatos estruturados

## Antes de começar

### Verificar requisitos de PDF
Claude funciona com qualquer PDF padrão. No entanto, você deve garantir que o tamanho da sua solicitação atenda a esses requisitos ao usar o suporte a PDF:

| Requisito | Limite |
|---|---|
| Tamanho máximo da solicitação | 32MB |
| Máximo de páginas por solicitação | 100 |
| Formato | PDF padrão (sem senhas/criptografia) |

Observe que ambos os limites se aplicam a todo o payload da solicitação, incluindo qualquer outro conteúdo enviado junto com os PDFs.

Como o suporte a PDF depende das capacidades de visão do Claude, está sujeito às mesmas [limitações e considerações](/docs/pt-BR/build-with-claude/vision#limitations) que outras tarefas de visão.

### Plataformas e modelos suportados

O suporte a PDF é atualmente suportado via acesso direto à API e Google Vertex AI. Todos os [modelos ativos](/docs/pt-BR/about-claude/models/overview) suportam processamento de PDF.

O suporte a PDF agora está disponível no Amazon Bedrock com as seguintes considerações:

### Suporte a PDF do Amazon Bedrock

Ao usar o suporte a PDF através da API Converse do Amazon Bedrock, existem dois modos distintos de processamento de documentos:

<Note>
**Importante**: Para acessar as capacidades completas de compreensão visual de PDF do Claude na API Converse, você deve habilitar citações. Sem citações habilitadas, a API volta para extração básica de texto apenas. Saiba mais sobre [trabalhar com citações](/docs/pt-BR/build-with-claude/citations).
</Note>

#### Modos de Processamento de Documentos

1. **Converse Document Chat** (Modo original - Extração de texto apenas)
   - Fornece extração básica de texto de PDFs
   - Não pode analisar imagens, gráficos ou layouts visuais dentro de PDFs
   - Usa aproximadamente 1.000 tokens para um PDF de 3 páginas
   - Usado automaticamente quando citações não estão habilitadas

2. **Claude PDF Chat** (Novo modo - Compreensão visual completa)
   - Fornece análise visual completa de PDFs
   - Pode compreender e analisar gráficos, diagramas, imagens e layouts visuais
   - Processa cada página como texto e imagem para compreensão abrangente
   - Usa aproximadamente 7.000 tokens para um PDF de 3 páginas
   - **Requer citações habilitadas** na API Converse

#### Limitações Principais

- **API Converse**: Análise visual de PDF requer citações habilitadas. Atualmente não há opção para usar análise visual sem citações (diferente da API InvokeModel).
- **API InvokeModel**: Fornece controle total sobre processamento de PDF sem citações forçadas.

#### Problemas Comuns

Se clientes relatarem que Claude não está vendo imagens ou gráficos em seus PDFs ao usar a API Converse, eles provavelmente precisam habilitar a flag de citações. Sem ela, Converse volta para extração básica de texto apenas.

<Note>
Esta é uma restrição conhecida com a API Converse que estamos trabalhando para resolver. Para aplicações que requerem análise visual de PDF sem citações, considere usar a API InvokeModel em vez disso.
</Note>

<Note>
Para arquivos não-PDF como .csv, .xlsx, .docx, .md, ou .txt, veja [Trabalhando com outros formatos de arquivo](/docs/pt-BR/build-with-claude/files#working-with-other-file-formats).
</Note>

***

## Processar PDFs com Claude

### Envie sua primeira solicitação de PDF
Vamos começar com um exemplo simples usando a API Messages. Você pode fornecer PDFs ao Claude de três maneiras:

1. Como uma referência de URL para um PDF hospedado online
2. Como um PDF codificado em base64 em blocos de conteúdo `document`  
3. Por um `file_id` da [API Files](/docs/pt-BR/build-with-claude/files)

#### Opção 1: Documento PDF baseado em URL

A abordagem mais simples é referenciar um PDF diretamente de uma URL:

<CodeGroup>
   ```bash Shell
    curl https://api.anthropic.com/v1/messages \
      -H "content-type: application/json" \
      -H "x-api-key: $ANTHROPIC_API_KEY" \
      -H "anthropic-version: 2023-06-01" \
      -d '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 1024,
        "messages": [{
            "role": "user",
            "content": [{
                "type": "document",
                "source": {
                    "type": "url",
                    "url": "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf"
                }
            },
            {
                "type": "text",
                "text": "Quais são as principais descobertas neste documento?"
            }]
        }]
    }'
    ```
    ```python Python
    import anthropic

    client = anthropic.Anthropic()
    message = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "document",
                        "source": {
                            "type": "url",
                            "url": "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf"
                        }
                    },
                    {
                        "type": "text",
                        "text": "Quais são as principais descobertas neste documento?"
                    }
                ]
            }
        ],
    )

    print(message.content)
    ```
    ```typescript TypeScript
    import Anthropic from '@anthropic-ai/sdk';

    const anthropic = new Anthropic();
    
    async function main() {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'document',
                source: {
                  type: 'url',
                  url: 'https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf',
                },
              },
              {
                type: 'text',
                text: 'Quais são as principais descobertas neste documento?',
              },
            ],
          },
        ],
      });
      
      console.log(response);
    }
    
    main();
    ```
    ```java Java
    import java.util.List;

    import com.anthropic.client.AnthropicClient;
    import com.anthropic.client.okhttp.AnthropicOkHttpClient;
    import com.anthropic.models.messages.MessageCreateParams;
    import com.anthropic.models.messages.*;

    public class PdfExample {
        public static void main(String[] args) {
            AnthropicClient client = AnthropicOkHttpClient.fromEnv();

            // Create document block with URL
            DocumentBlockParam documentParam = DocumentBlockParam.builder()
                    .urlPdfSource("https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf")
                    .build();

            // Create a message with document and text content blocks
            MessageCreateParams params = MessageCreateParams.builder()
                    .model(Model.CLAUDE_OPUS_4_20250514)
                    .maxTokens(1024)
                    .addUserMessageOfBlockParams(
                            List.of(
 ContentBlockParam.ofDocument(documentParam),
 ContentBlockParam.ofText(
 TextBlockParam.builder()
 .text("Quais são as principais descobertas neste documento?")
 .build()
 )
                            )
                    )
                    .build();

            Message message = client.messages().create(params);
            System.out.println(message.content());
        }
    }
    ```
</CodeGroup>

#### Opção 2: Documento PDF codificado em base64

Se você precisar enviar PDFs do seu sistema local ou quando uma URL não estiver disponível:

<CodeGroup>
    ```bash Shell
    # Método 1: Buscar e codificar um PDF remoto
    curl -s "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf" | base64 | tr -d '\n' > pdf_base64.txt

    # Método 2: Codificar um arquivo PDF local
    # base64 document.pdf | tr -d '\n' > pdf_base64.txt

    # Criar um arquivo de solicitação JSON usando o conteúdo pdf_base64.txt
    jq -n --rawfile PDF_BASE64 pdf_base64.txt '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 1024,
        "messages": [{
            "role": "user",
            "content": [{
                "type": "document",
                "source": {
                    "type": "base64",
                    "media_type": "application/pdf",
                    "data": $PDF_BASE64
                }
            },
            {
                "type": "text",
                "text": "Quais são as principais descobertas neste documento?"
            }]
        }]
    }' > request.json

    # Enviar a solicitação da API usando o arquivo JSON
    curl https://api.anthropic.com/v1/messages \
      -H "content-type: application/json" \
      -H "x-api-key: $ANTHROPIC_API_KEY" \
      -H "anthropic-version: 2023-06-01" \
      -d @request.json
    ```
    ```python Python
    import anthropic
    import base64
    import httpx

    # Primeiro, carregar e codificar o PDF 
    pdf_url = "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf"
    pdf_data = base64.standard_b64encode(httpx.get(pdf_url).content).decode("utf-8")

    # Alternativa: Carregar de um arquivo local
    # with open("document.pdf", "rb") as f:
    #     pdf_data = base64.standard_b64encode(f.read()).decode("utf-8")

    # Enviar para Claude usando codificação base64
    client = anthropic.Anthropic()
    message = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "document",
                        "source": {
                            "type": "base64",
                            "media_type": "application/pdf",
                            "data": pdf_data
                        }
                    },
                    {
                        "type": "text",
                        "text": "Quais são as principais descobertas neste documento?"
                    }
                ]
            }
        ],
    )

    print(message.content)
    ```
    ```typescript TypeScript
    import Anthropic from '@anthropic-ai/sdk';
    import fetch from 'node-fetch';
    import fs from 'fs';

    async function main() {
      // Método 1: Buscar e codificar um PDF remoto
      const pdfURL = "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf";
      const pdfResponse = await fetch(pdfURL);
      const arrayBuffer = await pdfResponse.arrayBuffer();
      const pdfBase64 = Buffer.from(arrayBuffer).toString('base64');
      
      // Método 2: Carregar de um arquivo local
      // const pdfBase64 = fs.readFileSync('document.pdf').toString('base64');
      
      // Enviar a solicitação da API com PDF codificado em base64
      const anthropic = new Anthropic();
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'document',
                source: {
                  type: 'base64',
                  media_type: 'application/pdf',
                  data: pdfBase64,
                },
              },
              {
                type: 'text',
                text: 'Quais são as principais descobertas neste documento?',
              },
            ],
          },
        ],
      });
      
      console.log(response);
    }
    
    main();
    ```

    ```java Java
    import java.io.IOException;
    import java.net.URI;
    import java.net.http.HttpClient;
    import java.net.http.HttpRequest;
    import java.net.http.HttpResponse;
    import java.util.Base64;
    import java.util.List;

    import com.anthropic.client.AnthropicClient;
    import com.anthropic.client.okhttp.AnthropicOkHttpClient;
    import com.anthropic.models.messages.ContentBlockParam;
    import com.anthropic.models.messages.DocumentBlockParam;
    import com.anthropic.models.messages.Message;
    import com.anthropic.models.messages.MessageCreateParams;
    import com.anthropic.models.messages.Model;
    import com.anthropic.models.messages.TextBlockParam;

    public class PdfExample {
        public static void main(String[] args) throws IOException, InterruptedException {
            AnthropicClient client = AnthropicOkHttpClient.fromEnv();

            // Método 1: Baixar e codificar um PDF remoto
            String pdfUrl = "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf";
            HttpClient httpClient = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(pdfUrl))
                    .GET()
                    .build();

            HttpResponse<byte[]> response = httpClient.send(request, HttpResponse.BodyHandlers.ofByteArray());
            String pdfBase64 = Base64.getEncoder().encodeToString(response.body());

            // Método 2: Carregar de um arquivo local
            // byte[] fileBytes = Files.readAllBytes(Path.of("document.pdf"));
            // String pdfBase64 = Base64.getEncoder().encodeToString(fileBytes);

            // Criar bloco de documento com dados base64
            DocumentBlockParam documentParam = DocumentBlockParam.builder()
                    .base64PdfSource(pdfBase64)
                    .build();

            // Criar uma mensagem com blocos de conteúdo de documento e texto
            MessageCreateParams params = MessageCreateParams.builder()
                    .model(Model.CLAUDE_OPUS_4_20250514)
                    .maxTokens(1024)
                    .addUserMessageOfBlockParams(
                            List.of(
 ContentBlockParam.ofDocument(documentParam),
 ContentBlockParam.ofText(TextBlockParam.builder().text("Quais são as principais descobertas neste documento?").build())
                            )
                    )
                    .build();

            Message message = client.messages().create(params);
            message.content().stream()
                    .flatMap(contentBlock -> contentBlock.text().stream())
                    .forEach(textBlock -> System.out.println(textBlock.text()));
        }
    }
    ```

</CodeGroup>

#### Opção 3: API Files

Para PDFs que você usará repetidamente, ou quando quiser evitar sobrecarga de codificação, use a [API Files](/docs/pt-BR/build-with-claude/files): 

<CodeGroup>
```bash Shell
# Primeiro, faça upload do seu PDF para a API Files
curl -X POST https://api.anthropic.com/v1/files \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  -F "file=@document.pdf"

# Então use o file_id retornado na sua mensagem
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  -d '{
    "model": "claude-sonnet-4-5", 
    "max_tokens": 1024,
    "messages": [{
      "role": "user",
      "content": [{
        "type": "document",
        "source": {
          "type": "file",
          "file_id": "file_abc123"
        }
      },
      {
        "type": "text",
        "text": "Quais são as principais descobertas neste documento?"
      }]
    }]
  }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

# Fazer upload do arquivo PDF
with open("document.pdf", "rb") as f:
    file_upload = client.beta.files.upload(file=("document.pdf", f, "application/pdf"))

# Usar o arquivo enviado em uma mensagem
message = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    betas=["files-api-2025-04-14"],
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "document",
                    "source": {
                        "type": "file",
                        "file_id": file_upload.id
                    }
                },
                {
                    "type": "text",
                    "text": "Quais são as principais descobertas neste documento?"
                }
            ]
        }
    ],
)

print(message.content)
```

```typescript TypeScript
import { Anthropic, toFile } from '@anthropic-ai/sdk';
import fs from 'fs';

const anthropic = new Anthropic();

async function main() {
  // Fazer upload do arquivo PDF
  const fileUpload = await anthropic.beta.files.upload({
    file: toFile(fs.createReadStream('document.pdf'), undefined, { type: 'application/pdf' })
  }, {
    betas: ['files-api-2025-04-14']
  });

  // Usar o arquivo enviado em uma mensagem
  const response = await anthropic.beta.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    betas: ['files-api-2025-04-14'],
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'document',
            source: {
              type: 'file',
              file_id: fileUpload.id
            }
          },
          {
            type: 'text',
            text: 'Quais são as principais descobertas neste documento?'
          }
        ]
      }
    ]
  });

  console.log(response);
}

main();
```

```java Java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.File;
import com.anthropic.models.files.FileUploadParams;
import com.anthropic.models.messages.*;

public class PdfFilesExample {
    public static void main(String[] args) throws IOException {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Fazer upload do arquivo PDF
        File file = client.beta().files().upload(FileUploadParams.builder()
                .file(Files.newInputStream(Path.of("document.pdf")))
                .build());

        // Usar o arquivo enviado em uma mensagem
        DocumentBlockParam documentParam = DocumentBlockParam.builder()
                .fileSource(file.id())
                .build();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                .addUserMessageOfBlockParams(
                        List.of(
 ContentBlockParam.ofDocument(documentParam),
 ContentBlockParam.ofText(
 TextBlockParam.builder()
 .text("Quais são as principais descobertas neste documento?")
 .build()
 )
                        )
                )
                .build();

        Message message = client.messages().create(params);
        System.out.println(message.content());
    }
}
```
</CodeGroup>

### Como funciona o suporte a PDF
Quando você envia um PDF para Claude, os seguintes passos ocorrem:
<Steps>
  <Step title="O sistema extrai o conteúdo do documento.">
    - O sistema converte cada página do documento em uma imagem.
    - O texto de cada página é extraído e fornecido junto com a imagem de cada página.
  </Step>
  <Step title="Claude analisa tanto o texto quanto as imagens para melhor compreender o documento.">
    - Documentos são fornecidos como uma combinação de texto e imagens para análise.
    - Isso permite que usuários peçam insights sobre elementos visuais de um PDF, como gráficos, diagramas e outro conteúdo não textual.
  </Step>
  <Step title="Claude responde, referenciando o conteúdo do PDF se relevante.">
    Claude pode referenciar tanto conteúdo textual quanto visual quando responde. Você pode melhorar ainda mais o desempenho integrando o suporte a PDF com:
    - **Cache de prompt**: Para melhorar o desempenho para análise repetida.
    - **Processamento em lote**: Para processamento de documentos de alto volume.
    - **Uso de ferramentas**: Para extrair informações específicas de documentos para uso como entradas de ferramentas.
  </Step>
</Steps>

### Estime seus custos
A contagem de tokens de um arquivo PDF depende do texto total extraído do documento, bem como do número de páginas:
- Custos de tokens de texto: Cada página normalmente usa 1.500-3.000 tokens por página dependendo da densidade do conteúdo. Preços padrão da API se aplicam sem taxas adicionais de PDF.
- Custos de tokens de imagem: Como cada página é convertida em uma imagem, os mesmos [cálculos de custo baseados em imagem](/docs/pt-BR/build-with-claude/vision#evaluate-image-size) são aplicados.

Você pode usar [contagem de tokens](/docs/pt-BR/build-with-claude/token-counting) para estimar custos para seus PDFs específicos.

***

## Otimizar processamento de PDF

### Melhorar desempenho
Siga essas melhores práticas para resultados ótimos:
- Coloque PDFs antes do texto em suas solicitações
- Use fontes padrão
- Garanta que o texto seja claro e legível
- Gire páginas para orientação vertical adequada
- Use números de página lógicos (do visualizador de PDF) em prompts
- Divida PDFs grandes em pedaços quando necessário
- Habilite cache de prompt para análise repetida

### Escalar sua implementação
Para processamento de alto volume, considere essas abordagens:

#### Use cache de prompt
Cache PDFs para melhorar desempenho em consultas repetidas:
<CodeGroup>
```bash Shell
# Criar um arquivo de solicitação JSON usando o conteúdo pdf_base64.txt
jq -n --rawfile PDF_BASE64 pdf_base64.txt '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [{
        "role": "user",
        "content": [{
            "type": "document",
            "source": {
                "type": "base64",
                "media_type": "application/pdf",
                "data": $PDF_BASE64
            },
            "cache_control": {
              "type": "ephemeral"
            }
        },
        {
            "type": "text",
            "text": "Qual modelo tem as maiores taxas de vitória de preferência humana em cada caso de uso?"
        }]
    }]
}' > request.json

# Então fazer a chamada da API usando o arquivo JSON
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d @request.json
```
```python Python
message = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "document",
                    "source": {
                        "type": "base64",
                        "media_type": "application/pdf",
                        "data": pdf_data
                    },
                    "cache_control": {"type": "ephemeral"}
                },
                {
                    "type": "text",
                    "text": "Analise este documento."
                }
            ]
        }
    ],
)
```

```typescript TypeScript
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 1024,
  messages: [
    {
      content: [
        {
          type: 'document',
          source: {
            media_type: 'application/pdf',
            type: 'base64',
            data: pdfBase64,
          },
          cache_control: { type: 'ephemeral' },
        },
        {
          type: 'text',
          text: 'Qual modelo tem as maiores taxas de vitória de preferência humana em cada caso de uso?',
        },
      ],
      role: 'user',
    },
  ],
});
console.log(response);
```

```java Java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.Base64PdfSource;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.ContentBlockParam;
import com.anthropic.models.messages.DocumentBlockParam;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;

public class MessagesDocumentExample {

    public static void main(String[] args) throws IOException {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Ler arquivo PDF como base64
        byte[] pdfBytes = Files.readAllBytes(Paths.get("pdf_base64.txt"));
        String pdfBase64 = new String(pdfBytes);

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                .addUserMessageOfBlockParams(List.of(
                        ContentBlockParam.ofDocument(
 DocumentBlockParam.builder()
 .source(Base64PdfSource.builder()
 .data(pdfBase64)
 .build())
 .cacheControl(CacheControlEphemeral.builder().build())
 .build()),
                        ContentBlockParam.ofText(
 TextBlockParam.builder()
 .text("Qual modelo tem as maiores taxas de vitória de preferência humana em cada caso de uso?")
 .build())
                ))
                .build();


        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>

#### Processar lotes de documentos
Use a API Message Batches para fluxos de trabalho de alto volume:
<CodeGroup>
```bash Shell
# Criar um arquivo de solicitação JSON usando o conteúdo pdf_base64.txt
jq -n --rawfile PDF_BASE64 pdf_base64.txt '
{
  "requests": [
      {
          "custom_id": "my-first-request",
          "params": {
              "model": "claude-sonnet-4-5",
              "max_tokens": 1024,
              "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "document",
                            "source": {
 "type": "base64",
 "media_type": "application/pdf",
 "data": $PDF_BASE64
                            }
                        },
                        {
                            "type": "text",
                            "text": "Qual modelo tem as maiores taxas de vitória de preferência humana em cada caso de uso?"
                        }
                    ]
                }
              ]
          }
      },
      {
          "custom_id": "my-second-request",
          "params": {
              "model": "claude-sonnet-4-5",
              "max_tokens": 1024,
              "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "document",
                            "source": {
 "type": "base64",
 "media_type": "application/pdf",
 "data": $PDF_BASE64
                            }
                        },
                        {
                            "type": "text",
                            "text": "Extraia 5 insights principais deste documento."
                        }
                    ]
                }
              ]
          }
      }
  ]
}
' > request.json

# Então fazer a chamada da API usando o arquivo JSON
curl https://api.anthropic.com/v1/messages/batches \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d @request.json
```
```python Python
message_batch = client.messages.batches.create(
    requests=[
        {
            "custom_id": "doc1",
            "params": {
                "model": "claude-sonnet-4-5",
                "max_tokens": 1024,
                "messages": [
                    {
                        "role": "user",
                        "content": [
                            {
 "type": "document",
 "source": {
 "type": "base64",
 "media_type": "application/pdf",
 "data": pdf_data
 }
                            },
                            {
 "type": "text",
 "text": "Resuma este documento."
                            }
                        ]
                    }
                ]
            }
        }
    ]
)
```

```typescript TypeScript
const response = await anthropic.messages.batches.create({
  requests: [
    {
      custom_id: 'my-first-request',
      params: {
        max_tokens: 1024,
        messages: [
          {
            content: [
              {
                type: 'document',
                source: {
                  media_type: 'application/pdf',
                  type: 'base64',
                  data: pdfBase64,
                },
              },
              {
                type: 'text',
                text: 'Qual modelo tem as maiores taxas de vitória de preferência humana em cada caso de uso?',
              },
            ],
            role: 'user',
          },
        ],
        model: 'claude-sonnet-4-5',
      },
    },
    {
      custom_id: 'my-second-request',
      params: {
        max_tokens: 1024,
        messages: [
          {
            content: [
              {
                type: 'document',
                source: {
                  media_type: 'application/pdf',
                  type: 'base64',
                  data: pdfBase64,
                },
              },
              {
                type: 'text',
                text: 'Extraia 5 insights principais deste documento.',
              },
            ],
            role: 'user',
          },
        ],
        model: 'claude-sonnet-4-5',
      },
    }
  ],
});
console.log(response);
```

```java Java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.*;
import com.anthropic.models.messages.batches.*;

public class MessagesBatchDocumentExample {

    public static void main(String[] args) throws IOException {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Ler arquivo PDF como base64
        byte[] pdfBytes = Files.readAllBytes(Paths.get("pdf_base64.txt"));
        String pdfBase64 = new String(pdfBytes);

        BatchCreateParams params = BatchCreateParams.builder()
                .addRequest(BatchCreateParams.Request.builder()
                        .customId("my-first-request")
                        .params(BatchCreateParams.Request.Params.builder()
 .model(Model.CLAUDE_OPUS_4_20250514)
 .maxTokens(1024)
 .addUserMessageOfBlockParams(List.of(
 ContentBlockParam.ofDocument(
 DocumentBlockParam.builder()
 .source(Base64PdfSource.builder()
 .data(pdfBase64)
 .build())
 .build()
 ),
 ContentBlockParam.ofText(
 TextBlockParam.builder()
 .text("Qual modelo tem as maiores taxas de vitória de preferência humana em cada caso de uso?")
 .build()
 )
 ))
 .build())
                        .build())
                .addRequest(BatchCreateParams.Request.builder()
                        .customId("my-second-request")
                        .params(BatchCreateParams.Request.Params.builder()
 .model(Model.CLAUDE_OPUS_4_20250514)
 .maxTokens(1024)
 .addUserMessageOfBlockParams(List.of(
 ContentBlockParam.ofDocument(
 DocumentBlockParam.builder()
 .source(Base64PdfSource.builder()
 .data(pdfBase64)
 .build())
 .build()
 ),
 ContentBlockParam.ofText(
 TextBlockParam.builder()
 .text("Extraia 5 insights principais deste documento.")
 .build()
 )
 ))
 .build())
                        .build())
                .build();

        MessageBatch batch = client.messages().batches().create(params);
        System.out.println(batch);
    }
}
```
</CodeGroup>

## Próximos passos

<CardGroup cols={2}>
  <Card
    title="Experimente exemplos de PDF"
    icon="file"
    href="https://github.com/anthropics/anthropic-cookbook/tree/main/multimodal"
  >
    Explore exemplos práticos de processamento de PDF em nossa receita de cookbook.
  </Card>

  <Card
    title="Ver referência da API"
    icon="code"
    href="/docs/pt-BR/api/messages"
  >
    Veja a documentação completa da API para suporte a PDF.
  </Card>
</CardGroup>