# Citações

---

Claude é capaz de fornecer citações detalhadas ao responder perguntas sobre documentos, ajudando você a rastrear e verificar fontes de informação nas respostas.

Todos os [modelos ativos](/docs/pt-BR/about-claude/models/overview) suportam citações, com exceção do Haiku 3.

<Warning>
*Citações com Claude Sonnet 3.7*

Claude Sonnet 3.7 pode ser menos propenso a fazer citações comparado a outros modelos Claude sem instruções mais explícitas do usuário. Ao usar citações com Claude Sonnet 3.7, recomendamos incluir instruções adicionais no turno do `user`, como `"Use citações para apoiar sua resposta."` por exemplo.

Também observamos que quando o modelo é solicitado a estruturar sua resposta, é improvável que use citações a menos que seja explicitamente instruído a usar citações dentro desse formato. Por exemplo, se o modelo for solicitado a usar tags `<result>` em sua resposta, você deve adicionar algo como `"Sempre use citações em sua resposta, mesmo dentro das tags <result>."`
</Warning>
<Tip>
  Por favor, compartilhe seu feedback e sugestões sobre o recurso de citações usando este [formulário](https://forms.gle/9n9hSrKnKe3rpowH9).
</Tip>

Aqui está um exemplo de como usar citações com a API Messages:

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "document",
            "source": {
              "type": "text",
              "media_type": "text/plain",
              "data": "The grass is green. The sky is blue."
            },
            "title": "My Document",
            "context": "This is a trustworthy document.",
            "citations": {"enabled": true}
          },
          {
            "type": "text",
            "text": "What color is the grass and sky?"
          }
        ]
      }
    ]
  }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "document",
                    "source": {
                        "type": "text",
                        "media_type": "text/plain",
                        "data": "The grass is green. The sky is blue."
                    },
                    "title": "My Document",
                    "context": "This is a trustworthy document.",
                    "citations": {"enabled": True}
                },
                {
                    "type": "text",
                    "text": "What color is the grass and sky?"
                }
            ]
        }
    ]
)
print(response)
```

```java Java
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.*;

public class DocumentExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        PlainTextSource source = PlainTextSource.builder()
                .data("The grass is green. The sky is blue.")
                .build();

        DocumentBlockParam documentParam = DocumentBlockParam.builder()
                .source(source)
                .title("My Document")
                .context("This is a trustworthy document.")
                .citations(CitationsConfigParam.builder().enabled(true).build())
                .build();
        
        TextBlockParam textBlockParam = TextBlockParam.builder()
                .text("What color is the grass and sky?")
                .build();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_SONNET_4_20250514)
                .maxTokens(1024)
                .addUserMessageOfBlockParams(List.of(ContentBlockParam.ofDocument(documentParam), ContentBlockParam.ofText(textBlockParam)))
                .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```

</CodeGroup>

<Tip>
**Comparação com abordagens baseadas em prompt**

Em comparação com soluções de citações baseadas em prompt, o recurso de citações tem as seguintes vantagens:
- **Economia de custos:** Se sua abordagem baseada em prompt pede ao Claude para produzir citações diretas, você pode ver economia de custos devido ao fato de que `cited_text` não conta para seus tokens de saída. 
- **Melhor confiabilidade de citação:** Como analisamos citações nos respectivos formatos de resposta mencionados acima e extraímos `cited_text`, as citações são garantidas de conter ponteiros válidos para os documentos fornecidos.
- **Qualidade de citação aprimorada:** Em nossas avaliações, descobrimos que o recurso de citações é significativamente mais propenso a citar as citações mais relevantes de documentos em comparação com abordagens puramente baseadas em prompt.
</Tip>

---

## Como as citações funcionam

Integre citações com Claude nestes passos:

<Steps>
  <Step title="Forneça documento(s) e habilite citações">
    - Inclua documentos em qualquer um dos formatos suportados: [PDFs](#pdf-documents), [texto simples](#plain-text-documents), ou documentos de [conteúdo personalizado](#custom-content-documents)
    - Defina `citations.enabled=true` em cada um de seus documentos. Atualmente, as citações devem ser habilitadas em todos ou nenhum dos documentos dentro de uma solicitação.
    - Note que apenas citações de texto são atualmente suportadas e citações de imagem ainda não são possíveis.  
  </Step>
  <Step title="Documentos são processados">
    - O conteúdo dos documentos é "fragmentado" para definir a granularidade mínima de possíveis citações. Por exemplo, fragmentação de sentenças permitiria ao Claude citar uma única sentença ou encadear múltiplas sentenças consecutivas para citar um parágrafo (ou mais longo)!
      - **Para PDFs:** O texto é extraído conforme descrito em [Suporte a PDF](/docs/pt-BR/build-with-claude/pdf-support) e o conteúdo é fragmentado em sentenças. Citar imagens de PDFs não é atualmente suportado. 
      - **Para documentos de texto simples:** O conteúdo é fragmentado em sentenças que podem ser citadas. 
      - **Para documentos de conteúdo personalizado:** Seus blocos de conteúdo fornecidos são usados como estão e nenhuma fragmentação adicional é feita. 
  </Step>
  <Step title="Claude fornece resposta citada">
    - As respostas podem agora incluir múltiplos blocos de texto onde cada bloco de texto pode conter uma afirmação que Claude está fazendo e uma lista de citações que apoiam a afirmação.
    - As citações referenciam localizações específicas em documentos fonte. O formato dessas citações depende do tipo de documento sendo citado. 
      - **Para PDFs:** as citações incluirão o intervalo de números de página (indexado em 1).
      - **Para documentos de texto simples:** As citações incluirão o intervalo de índice de caracteres (indexado em 0). 
      - **Para documentos de conteúdo personalizado:** As citações incluirão o intervalo de índice de bloco de conteúdo (indexado em 0) correspondente à lista de conteúdo original fornecida. 
    - Índices de documento são fornecidos para indicar a fonte de referência e são indexados em 0 de acordo com a lista de todos os documentos em sua solicitação original. 
  </Step>
</Steps>

<Tip>
  **Fragmentação automática vs conteúdo personalizado**

  Por padrão, documentos de texto simples e PDF são automaticamente fragmentados em sentenças. Se você precisar de mais controle sobre a granularidade de citação (por exemplo, para marcadores ou transcrições), use documentos de conteúdo personalizado em vez disso. Veja [Tipos de Documento](#document-types) para mais detalhes.

  Por exemplo, se você quiser que Claude seja capaz de citar sentenças específicas de seus fragmentos RAG, você deve colocar cada fragmento RAG em um documento de texto simples. Caso contrário, se você não quiser que nenhuma fragmentação adicional seja feita, ou se você quiser personalizar qualquer fragmentação adicional, você pode colocar fragmentos RAG em documento(s) de conteúdo personalizado.
</Tip>

### Conteúdo citável vs não citável

- Texto encontrado dentro do conteúdo `source` de um documento pode ser citado.
- `title` e `context` são campos opcionais que serão passados para o modelo mas não usados para conteúdo citado. 
- `title` é limitado em comprimento então você pode achar o campo `context` útil para armazenar qualquer metadado de documento como texto ou json stringificado. 

### Índices de citação
- Índices de documento são indexados em 0 da lista de todos os blocos de conteúdo de documento na solicitação (abrangendo todas as mensagens). 
- Índices de caracteres são indexados em 0 com índices finais exclusivos. 
- Números de página são indexados em 1 com números de página finais exclusivos. 
- Índices de bloco de conteúdo são indexados em 0 com índices finais exclusivos da lista `content` fornecida no documento de conteúdo personalizado. 

### Custos de token
- Habilitar citações incorre em um ligeiro aumento nos tokens de entrada devido a adições de prompt do sistema e fragmentação de documento. 
- No entanto, o recurso de citações é muito eficiente com tokens de saída. Por baixo dos panos, o modelo está produzindo citações em um formato padronizado que são então analisadas em texto citado e índices de localização de documento. O campo `cited_text` é fornecido por conveniência e não conta para tokens de saída. 
- Quando passado de volta em turnos de conversa subsequentes, `cited_text` também não é contado para tokens de entrada. 

### Compatibilidade de recursos 
Citações funciona em conjunto com outros recursos da API incluindo [cache de prompt](/docs/pt-BR/build-with-claude/prompt-caching), [contagem de tokens](/docs/pt-BR/build-with-claude/token-counting) e [processamento em lote](/docs/pt-BR/build-with-claude/batch-processing).

#### Usando Cache de Prompt com Citações

Citações e cache de prompt podem ser usados juntos efetivamente.

Os blocos de citação gerados nas respostas não podem ser cacheados diretamente, mas os documentos fonte que eles referenciam podem ser cacheados. Para otimizar o desempenho, aplique `cache_control` aos seus blocos de conteúdo de documento de nível superior.

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# Conteúdo de documento longo (por exemplo, documentação técnica)
long_document = "Este é um documento muito longo com milhares de palavras..." + " ... " * 1000  # Comprimento mínimo cacheável

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "document",
                    "source": {
                        "type": "text",
                        "media_type": "text/plain",
                        "data": long_document
                    },
                    "citations": {"enabled": True},
                    "cache_control": {"type": "ephemeral"}  # Cachear o conteúdo do documento
                },
                {
                    "type": "text",
                    "text": "O que este documento diz sobre recursos da API?"
                }
            ]
        }
    ]
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

// Conteúdo de documento longo (por exemplo, documentação técnica)
const longDocument = "Este é um documento muito longo com milhares de palavras..." + " ... ".repeat(1000);  // Comprimento mínimo cacheável

const response = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: [
        {
          type: "document",
          source: {
            type: "text",
            media_type: "text/plain",
            data: longDocument
          },
          citations: { enabled: true },
          cache_control: { type: "ephemeral" }  // Cachear o conteúdo do documento
        },
        {
          type: "text",
          text: "O que este documento diz sobre recursos da API?"
        }
      ]
    }
  ]
});
```

```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "document",
                    "source": {
                        "type": "text",
                        "media_type": "text/plain",
                        "data": "Este é um documento muito longo com milhares de palavras..."
                    },
                    "citations": {"enabled": true},
                    "cache_control": {"type": "ephemeral"}
                },
                {
                    "type": "text",
                    "text": "O que este documento diz sobre recursos da API?"
                }
            ]
        }
    ]
}'
```
</CodeGroup>

Neste exemplo:
- O conteúdo do documento é cacheado usando `cache_control` no bloco do documento
- Citações são habilitadas no documento
- Claude pode gerar respostas com citações enquanto se beneficia do conteúdo do documento cacheado
- Solicitações subsequentes usando o mesmo documento se beneficiarão do conteúdo cacheado

## Tipos de Documento

### Escolhendo um tipo de documento

Suportamos três tipos de documento para citações. Documentos podem ser fornecidos diretamente na mensagem (base64, texto, ou URL) ou carregados via [API Files](/docs/pt-BR/build-with-claude/files) e referenciados por `file_id`:

| Tipo | Melhor para | Fragmentação | Formato de citação |
| :--- | :--- | :--- | :--- |
| Texto simples | Documentos de texto simples, prosa | Sentença | Índices de caracteres (indexado em 0) |
| PDF | Arquivos PDF com conteúdo de texto | Sentença | Números de página (indexado em 1) |
| Conteúdo personalizado | Listas, transcrições, formatação especial, citações mais granulares | Nenhuma fragmentação adicional | Índices de bloco (indexado em 0) |

<Note>
Arquivos .csv, .xlsx, .docx, .md, e .txt não são suportados como blocos de documento. Converta estes para texto simples e inclua diretamente no conteúdo da mensagem. Veja [Trabalhando com outros formatos de arquivo](/docs/pt-BR/build-with-claude/files#working-with-other-file-formats).
</Note>

### Documentos de texto simples

Documentos de texto simples são automaticamente fragmentados em sentenças. Você pode fornecê-los inline ou por referência com seu `file_id`:

<Tabs>
<Tab title="Texto inline">
```python
{
    "type": "document",
    "source": {
        "type": "text",
        "media_type": "text/plain",
        "data": "Conteúdo de texto simples..."
    },
    "title": "Título do Documento", # opcional
    "context": "Contexto sobre o documento que não será citado", # opcional
    "citations": {"enabled": True}
}
```
</Tab>
<Tab title="API Files">
```python
{
    "type": "document",
    "source": {
        "type": "file",
        "file_id": "file_011CNvxoj286tYUAZFiZMf1U"
    },
    "title": "Título do Documento", # opcional
    "context": "Contexto sobre o documento que não será citado", # opcional
    "citations": {"enabled": True}
}
```
</Tab>
</Tabs>

<section title="Exemplo de citação de texto simples">

```python
{
    "type": "char_location",
    "cited_text": "O texto exato sendo citado", # não conta para tokens de saída
    "document_index": 0,
    "document_title": "Título do Documento",
    "start_char_index": 0,    # indexado em 0
    "end_char_index": 50      # exclusivo
}
```

</section>

### Documentos PDF 

Documentos PDF podem ser fornecidos como dados codificados em base64 ou por `file_id`. O texto do PDF é extraído e fragmentado em sentenças. Como citações de imagem ainda não são suportadas, PDFs que são digitalizações de documentos e não contêm texto extraível não serão citáveis.

<Tabs>
<Tab title="Base64">
```python
{
    "type": "document",
    "source": {
        "type": "base64",
        "media_type": "application/pdf",
        "data": base64_encoded_pdf_data
    },
    "title": "Título do Documento", # opcional
    "context": "Contexto sobre o documento que não será citado", # opcional
    "citations": {"enabled": True}
}
```
</Tab>
<Tab title="API Files">
```python
{
    "type": "document",
    "source": {
        "type": "file",
        "file_id": "file_011CNvxoj286tYUAZFiZMf1U"
    },
    "title": "Título do Documento", # opcional
    "context": "Contexto sobre o documento que não será citado", # opcional
    "citations": {"enabled": True}
}
```
</Tab>
</Tabs>

<section title="Exemplo de citação PDF">

```python
{
    "type": "page_location",
    "cited_text": "O texto exato sendo citado", # não conta para tokens de saída
    "document_index": 0,     
    "document_title": "Título do Documento", 
    "start_page_number": 1,  # indexado em 1
    "end_page_number": 2     # exclusivo
}
```

</section>

### Documentos de conteúdo personalizado

Documentos de conteúdo personalizado dão a você controle sobre a granularidade de citação. Nenhuma fragmentação adicional é feita e fragmentos são fornecidos ao modelo de acordo com os blocos de conteúdo fornecidos.

```python
{
    "type": "document",
    "source": {
        "type": "content",
        "content": [
            {"type": "text", "text": "Primeiro fragmento"},
            {"type": "text", "text": "Segundo fragmento"}
        ]
    },
    "title": "Título do Documento", # opcional
    "context": "Contexto sobre o documento que não será citado", # opcional
    "citations": {"enabled": True}
}
```

<section title="Exemplo de citação">

```python
{
    "type": "content_block_location",
    "cited_text": "O texto exato sendo citado", # não conta para tokens de saída
    "document_index": 0,
    "document_title": "Título do Documento",
    "start_block_index": 0,   # indexado em 0
    "end_block_index": 1      # exclusivo
}
```

</section>

---

## Estrutura de Resposta

Quando citações são habilitadas, as respostas incluem múltiplos blocos de texto com citações:

```python
{
    "content": [
        {
            "type": "text",
            "text": "De acordo com o documento, "
        },
        {
            "type": "text",
            "text": "a grama é verde",
            "citations": [{
                "type": "char_location",
                "cited_text": "A grama é verde.",
                "document_index": 0,
                "document_title": "Documento de Exemplo",
                "start_char_index": 0,
                "end_char_index": 20
            }]
        },
        {
            "type": "text",
            "text": " e "
        },
        {
            "type": "text",
            "text": "o céu é azul",
            "citations": [{
                "type": "char_location",
                "cited_text": "O céu é azul.",
                "document_index": 0,
                "document_title": "Documento de Exemplo",
                "start_char_index": 20,
                "end_char_index": 36
            }]
        },
        {
            "type": "text",
            "text": ". Informação da página 5 afirma que ",
        },
        {
            "type": "text",
            "text": "água é essencial",
            "citations": [{
                "type": "page_location",
                "cited_text": "Água é essencial para a vida.",
                "document_index": 1,
                "document_title": "Documento PDF",
                "start_page_number": 5,
                "end_page_number": 6
            }]
        },
        {
            "type": "text",
            "text": ". O documento personalizado menciona ",
        },
        {
            "type": "text",
            "text": "descobertas importantes",
            "citations": [{
                "type": "content_block_location",
                "cited_text": "Estas são descobertas importantes.",
                "document_index": 2,
                "document_title": "Documento de Conteúdo Personalizado",
                "start_block_index": 0,
                "end_block_index": 1
            }]
        }
    ]
}
```

### Suporte a Streaming

Para respostas de streaming, adicionamos um tipo `citations_delta` que contém uma única citação para ser adicionada à lista `citations` no bloco de conteúdo `text` atual.

<section title="Exemplo de eventos de streaming">

```python
event: message_start
data: {"type": "message_start", ...}

event: content_block_start
data: {"type": "content_block_start", "index": 0, ...}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, 
       "delta": {"type": "text_delta", "text": "De acordo com..."}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0,
       "delta": {"type": "citations_delta", 
                 "citation": {
                     "type": "char_location",
                     "cited_text": "...",
                     "document_index": 0,
                     ...
                 }}}

event: content_block_stop
data: {"type": "content_block_stop", "index": 0}

event: message_stop
data: {"type": "message_stop"}
```

</section>