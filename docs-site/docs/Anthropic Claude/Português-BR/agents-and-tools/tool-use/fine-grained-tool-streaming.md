# Streaming de ferramentas de granularidade fina

Streaming de ferramentas de granularidade fina para valores de parâmetros

---

O uso de ferramentas agora suporta [streaming](/docs/pt-BR/build-with-claude/streaming) de granularidade fina para valores de parâmetros. Isso permite que os desenvolvedores façam streaming dos parâmetros de uso de ferramentas sem buffering / validação JSON, reduzindo a latência para começar a receber parâmetros grandes.

O streaming de ferramentas de granularidade fina está disponível via Claude API, AWS Bedrock, Google Cloud's Vertex AI e Microsoft Foundry.

<Note>
O streaming de ferramentas de granularidade fina é um recurso beta. Certifique-se de avaliar suas respostas antes de usá-lo em produção.

Use [este formulário](https://forms.gle/D4Fjr7GvQRzfTZT96) para fornecer feedback sobre a qualidade das respostas do modelo, a API em si ou a qualidade da documentação — mal podemos esperar para ouvir você!
</Note>

<Warning>
Ao usar streaming de ferramentas de granularidade fina, você pode potencialmente receber entradas JSON inválidas ou parciais. Certifique-se de levar em conta esses casos extremos em seu código.
</Warning>

## Como usar streaming de ferramentas de granularidade fina

Para usar este recurso beta, simplesmente adicione o cabeçalho beta `fine-grained-tool-streaming-2025-05-14` a uma solicitação de uso de ferramentas e ative o streaming.

Aqui está um exemplo de como usar streaming de ferramentas de granularidade fina com a API:

<CodeGroup>

  ```bash Shell
  curl https://api.anthropic.com/v1/messages \
    -H "content-type: application/json" \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "anthropic-beta: fine-grained-tool-streaming-2025-05-14" \
    -d '{
      "model": "claude-sonnet-4-5",
      "max_tokens": 65536,
      "tools": [
        {
          "name": "make_file",
          "description": "Write text to a file",
          "input_schema": {
            "type": "object",
            "properties": {
              "filename": {
                "type": "string",
                "description": "The filename to write text to"
              },
              "lines_of_text": {
                "type": "array",
                "description": "An array of lines of text to write to the file"
              }
            },
            "required": ["filename", "lines_of_text"]
          }
        }
      ],
      "messages": [
        {
          "role": "user",
          "content": "Can you write a long poem and make a file called poem.txt?"
        }
      ],
      "stream": true
    }' | jq '.usage'
  ```

  ```python Python
  import anthropic

  client = anthropic.Anthropic()

  response = client.beta.messages.stream(
      max_tokens=65536,
      model="claude-sonnet-4-5",
      tools=[{
        "name": "make_file",
        "description": "Write text to a file",
        "input_schema": {
          "type": "object",
          "properties": {
            "filename": {
              "type": "string",
              "description": "The filename to write text to"
            },
            "lines_of_text": {
              "type": "array",
              "description": "An array of lines of text to write to the file"
            }
          },
          "required": ["filename", "lines_of_text"]
        }
      }],
      messages=[{
        "role": "user",
        "content": "Can you write a long poem and make a file called poem.txt?"
      }],
      betas=["fine-grained-tool-streaming-2025-05-14"]
  )

  print(response.usage)
  ```

  ```typescript TypeScript
  import Anthropic from '@anthropic-ai/sdk';

  const anthropic = new Anthropic();

  const message = await anthropic.beta.messages.stream({
    model: "claude-sonnet-4-5",
    max_tokens: 65536,
    tools: [{
      "name": "make_file",
      "description": "Write text to a file",
      "input_schema": {
        "type": "object",
        "properties": {
          "filename": {
            "type": "string",
            "description": "The filename to write text to"
          },
          "lines_of_text": {
            "type": "array",
            "description": "An array of lines of text to write to the file"
          }
        },
        "required": ["filename", "lines_of_text"]
      }
    }],
    messages: [{ 
      role: "user", 
      content: "Can you write a long poem and make a file called poem.txt?" 
    }],
    betas: ["fine-grained-tool-streaming-2025-05-14"]
  });

  console.log(message.usage);
  ```
</CodeGroup>

Neste exemplo, o streaming de ferramentas de granularidade fina permite que Claude faça streaming das linhas de um poema longo para a chamada de ferramenta `make_file` sem buffering para validar se o parâmetro `lines_of_text` é um JSON válido. Isso significa que você pode ver o parâmetro fazer streaming conforme chega, sem ter que esperar que todo o parâmetro seja armazenado em buffer e validado.

<Note>
Com streaming de ferramentas de granularidade fina, os chunks de uso de ferramentas começam a fazer streaming mais rapidamente e geralmente são mais longos e contêm menos quebras de palavra. Isso se deve a diferenças no comportamento de chunking.

Exemplo:

Sem streaming de granularidade fina (atraso de 15s):
```
Chunk 1: '{"'
Chunk 2: 'query": "Ty'
Chunk 3: 'peScri'
Chunk 4: 'pt 5.0 5.1 '
Chunk 5: '5.2 5'
Chunk 6: '.3'
Chunk 8: ' new f'
Chunk 9: 'eatur'
...
```

Com streaming de granularidade fina (atraso de 3s):
```
Chunk 1: '{"query": "TypeScript 5.0 5.1 5.2 5.3'
Chunk 2: ' new features comparison'
```
</Note>

<Warning>
Como o streaming de granularidade fina envia parâmetros sem buffering ou validação JSON, não há garantia de que o stream resultante será concluído em uma string JSON válida.
Particularmente, se a [razão de parada](/docs/pt-BR/build-with-claude/handling-stop-reasons) `max_tokens` for atingida, o stream pode terminar no meio de um parâmetro e pode estar incompleto. Geralmente, você terá que escrever suporte específico para lidar com quando `max_tokens` é atingido.
</Warning>

## Tratamento de JSON inválido em respostas de ferramentas

Ao usar streaming de ferramentas de granularidade fina, você pode receber JSON inválido ou incompleto do modelo. Se você precisar passar este JSON inválido de volta para o modelo em um bloco de resposta de erro, você pode envolvê-lo em um objeto JSON para garantir o tratamento adequado (com uma chave razoável). Por exemplo:

```json
{
  "INVALID_JSON": "<your invalid json string>"
}
```

Esta abordagem ajuda o modelo a entender que o conteúdo é JSON inválido enquanto preserva os dados malformados originais para fins de depuração.

<Note>
Ao envolver JSON inválido, certifique-se de escapar adequadamente todas as aspas ou caracteres especiais na string JSON inválida para manter a estrutura JSON válida no objeto wrapper.
</Note>