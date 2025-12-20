# Embeddings

Embeddings de texto são representações numéricas de texto que permitem medir similaridade semântica. Este guia apresenta embeddings, suas aplicações e como usar modelos de embedding para tarefas como busca, recomendações e detecção de anomalias.

---

## Antes de implementar embeddings

Ao selecionar um provedor de embeddings, há vários fatores que você pode considerar dependendo de suas necessidades e preferências:

- Tamanho do conjunto de dados e especificidade do domínio: tamanho do conjunto de dados de treinamento do modelo e sua relevância para o domínio que você deseja incorporar. Dados maiores ou mais específicos do domínio geralmente produzem melhores embeddings no domínio
- Desempenho de inferência: velocidade de busca de embedding e latência de ponta a ponta. Esta é uma consideração particularmente importante para implantações de produção em larga escala
- Personalização: opções para treinamento continuado em dados privados, ou especialização de modelos para domínios muito específicos. Isso pode melhorar o desempenho em vocabulários únicos

## Como obter embeddings com Anthropic

A Anthropic não oferece seu próprio modelo de embedding. Um provedor de embeddings que tem uma ampla variedade de opções e capacidades abrangendo todas as considerações acima é a Voyage AI.

A Voyage AI cria modelos de embedding de última geração e oferece modelos personalizados para domínios industriais específicos como finanças e saúde, ou modelos ajustados sob medida para clientes individuais.

O restante deste guia é para Voyage AI, mas encorajamos você a avaliar uma variedade de fornecedores de embeddings para encontrar o melhor ajuste para seu caso de uso específico.

## Modelos Disponíveis

A Voyage recomenda usar os seguintes modelos de embedding de texto:

| Modelo | Comprimento do Contexto | Dimensão do Embedding | Descrição |
| --- | --- | --- | --- |
| `voyage-3-large` | 32,000 | 1024 (padrão), 256, 512, 2048 | A melhor qualidade de recuperação geral e multilíngue. Veja [post do blog](https://blog.voyageai.com/2025/01/07/voyage-3-large/) para detalhes. |
| `voyage-3.5` | 32,000 | 1024 (padrão), 256, 512, 2048 | Otimizado para qualidade de recuperação geral e multilíngue. Veja [post do blog](https://blog.voyageai.com/2025/05/20/voyage-3-5/) para detalhes. |
| `voyage-3.5-lite` | 32,000 | 1024 (padrão), 256, 512, 2048 | Otimizado para latência e custo. Veja [post do blog](https://blog.voyageai.com/2025/05/20/voyage-3-5/) para detalhes. |
| `voyage-code-3` | 32,000 | 1024 (padrão), 256, 512, 2048 | Otimizado para recuperação de **código**. Veja [post do blog](https://blog.voyageai.com/2024/12/04/voyage-code-3/) para detalhes. |
| `voyage-finance-2` | 32,000 | 1024 | Otimizado para recuperação e RAG de **finanças**. Veja [post do blog](https://blog.voyageai.com/2024/06/03/domain-specific-embeddings-finance-edition-voyage-finance-2/) para detalhes. |
| `voyage-law-2` | 16,000 | 1024 | Otimizado para recuperação e RAG **jurídico** e de **contexto longo**. Também melhorou o desempenho em todos os domínios. Veja [post do blog](https://blog.voyageai.com/2024/04/15/domain-specific-embeddings-and-retrieval-legal-edition-voyage-law-2/) para detalhes. |

Além disso, os seguintes modelos de embedding multimodal são recomendados:

| Modelo | Comprimento do Contexto | Dimensão do Embedding | Descrição |
| --- | --- | --- | --- |
| `voyage-multimodal-3` | 32000 | 1024 | Modelo de embedding multimodal rico que pode vetorizar texto intercalado e imagens ricas em conteúdo, como capturas de tela de PDFs, slides, tabelas, figuras e muito mais. Veja [post do blog](https://blog.voyageai.com/2024/11/12/voyage-multimodal-3/) para detalhes. |

Precisa de ajuda para decidir qual modelo de embedding de texto usar? Confira o [FAQ](https://docs.voyageai.com/docs/faq#what-embedding-models-are-available-and-which-one-should-i-use&ref=anthropic).

## Começando com Voyage AI

Para acessar embeddings Voyage:

1. Inscreva-se no site da Voyage AI
2. Obtenha uma chave de API
3. Defina a chave de API como uma variável de ambiente para conveniência:

```bash
export VOYAGE_API_KEY="<sua chave secreta>"
```

Você pode obter os embeddings usando o [pacote Python oficial `voyageai`](https://github.com/voyage-ai/voyageai-python) ou solicitações HTTP, conforme descrito abaixo.

### Biblioteca Python Voyage

O pacote `voyageai` pode ser instalado usando o seguinte comando:

```bash
pip install -U voyageai
```

Em seguida, você pode criar um objeto cliente e começar a usá-lo para incorporar seus textos:

```python
import voyageai

vo = voyageai.Client()
# Isso usará automaticamente a variável de ambiente VOYAGE_API_KEY.
# Alternativamente, você pode usar vo = voyageai.Client(api_key="<sua chave secreta>")

texts = ["Texto de exemplo 1", "Texto de exemplo 2"]

result = vo.embed(texts, model="voyage-3.5", input_type="document")
print(result.embeddings[0])
print(result.embeddings[1])
```

`result.embeddings` será uma lista de dois vetores de embedding, cada um contendo 1024 números de ponto flutuante. Após executar o código acima, os dois embeddings serão impressos na tela:

```
[-0.013131560757756233, 0.019828535616397858, ...]   # embedding para "Texto de exemplo 1"
[-0.0069352793507277966, 0.020878976210951805, ...]  # embedding para "Texto de exemplo 2"
```

Ao criar os embeddings, você pode especificar alguns outros argumentos para a função `embed()`.

Para mais informações sobre o pacote python Voyage, veja [a documentação Voyage](https://docs.voyageai.com/docs/embeddings#python-api).

### API HTTP Voyage

Você também pode obter embeddings solicitando a API HTTP Voyage. Por exemplo, você pode enviar uma solicitação HTTP através do comando `curl` em um terminal:

```bash
curl https://api.voyageai.com/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $VOYAGE_API_KEY" \
  -d '{
    "input": ["Texto de exemplo 1", "Texto de exemplo 2"],
    "model": "voyage-3.5"
  }'
```

A resposta que você obteria é um objeto JSON contendo os embeddings e o uso de tokens:

```json
{
  "object": "list",
  "data": [
    {
      "embedding": [-0.013131560757756233, 0.019828535616397858, ...],
      "index": 0
    },
    {
      "embedding": [-0.0069352793507277966, 0.020878976210951805, ...],
      "index": 1
    }
  ],
  "model": "voyage-3.5",
  "usage": {
    "total_tokens": 10
  }
}

```

Para mais informações sobre a API HTTP Voyage, veja [a documentação Voyage](https://docs.voyageai.com/reference/embeddings-api).

### AWS Marketplace

Embeddings Voyage estão disponíveis no [AWS Marketplace](https://aws.amazon.com/marketplace/seller-profile?id=seller-snt4gb6fd7ljg). Instruções para acessar Voyage na AWS estão disponíveis [aqui](https://docs.voyageai.com/docs/aws-marketplace-model-package?ref=anthropic).

## Exemplo de início rápido

Agora que sabemos como obter embeddings, vamos ver um exemplo breve.

Suponha que temos um pequeno corpus de seis documentos para recuperar

```python
documents = [
    "A dieta mediterrânea enfatiza peixe, azeite de oliva e vegetais, acreditada para reduzir doenças crônicas.",
    "A fotossíntese nas plantas converte energia luminosa em glicose e produz oxigênio essencial.",
    "Inovações do século 20, de rádios a smartphones, centraram-se em avanços eletrônicos.",
    "Rios fornecem água, irrigação e habitat para espécies aquáticas, vitais para ecossistemas.",
    "A conferência telefônica da Apple para discutir os resultados do quarto trimestre fiscal e atualizações de negócios está agendada para quinta-feira, 2 de novembro de 2023 às 14:00 PT / 17:00 ET.",
    "As obras de Shakespeare, como 'Hamlet' e 'Sonho de uma Noite de Verão,' perduram na literatura."
]

```

Primeiro usaremos Voyage para converter cada um deles em um vetor de embedding

```python
import voyageai

vo = voyageai.Client()

# Incorporar os documentos
doc_embds = vo.embed(
    documents, model="voyage-3.5", input_type="document"
).embeddings
```

Os embeddings nos permitirão fazer busca semântica / recuperação no espaço vetorial. Dada uma consulta de exemplo,

```python
query = "Quando está agendada a conferência telefônica da Apple?"
```

nós a convertemos em um embedding, e conduzimos uma busca de vizinho mais próximo para encontrar o documento mais relevante baseado na distância no espaço de embedding.

```python
import numpy as np

# Incorporar a consulta
query_embd = vo.embed(
    [query], model="voyage-3.5", input_type="query"
).embeddings[0]

# Calcular a similaridade
# Embeddings Voyage são normalizados para comprimento 1, portanto produto escalar
# e similaridade de cosseno são os mesmos.
similarities = np.dot(doc_embds, query_embd)

retrieved_id = np.argmax(similarities)
print(documents[retrieved_id])
```

Note que usamos `input_type="document"` e `input_type="query"` para incorporar o documento e consulta, respectivamente. Mais especificação pode ser encontrada [aqui](/docs/pt-BR/build-with-claude/embeddings#voyage-python-package).

A saída seria o 5º documento, que é de fato o mais relevante para a consulta:

```
A conferência telefônica da Apple para discutir os resultados do quarto trimestre fiscal e atualizações de negócios está agendada para quinta-feira, 2 de novembro de 2023 às 14:00 PT / 17:00 ET.
```

Se você está procurando por um conjunto detalhado de livros de receitas sobre como fazer RAG com embeddings, incluindo bancos de dados vetoriais, confira nosso [livro de receitas RAG](https://github.com/anthropics/anthropic-cookbook/blob/main/third_party/Pinecone/rag_using_pinecone.ipynb).

## FAQ

  <section title="Por que os embeddings Voyage têm qualidade superior?">

    Modelos de embedding dependem de redes neurais poderosas para capturar e comprimir contexto semântico, similar a modelos generativos. A equipe de pesquisadores de IA experientes da Voyage otimiza cada componente do processo de embedding, incluindo:
    - Arquitetura do modelo
    - Coleta de dados
    - Funções de perda
    - Seleção de otimizador

    Saiba mais sobre a abordagem técnica da Voyage em seu [blog](https://blog.voyageai.com/).
  
</section>

  <section title="Quais modelos de embedding estão disponíveis e qual devo usar?">

    Para embedding de propósito geral, recomendamos:
    - `voyage-3-large`: Melhor qualidade
    - `voyage-3.5-lite`: Menor latência e custo
    - `voyage-3.5`: Desempenho equilibrado com qualidade de recuperação superior a um ponto de preço competitivo
    
    Para recuperação, use o parâmetro `input_type` para especificar se o texto é um tipo de consulta ou documento.

    Modelos específicos de domínio:

    - Tarefas jurídicas: `voyage-law-2`
    - Código e documentação de programação: `voyage-code-3`
    - Tarefas relacionadas a finanças: `voyage-finance-2`
  
</section>

  <section title="Qual função de similaridade devo usar?">

    Você pode usar embeddings Voyage com similaridade de produto escalar, similaridade de cosseno ou distância euclidiana. Uma explicação sobre similaridade de embedding pode ser encontrada [aqui](https://www.pinecone.io/learn/vector-similarity/).

    Embeddings Voyage AI são normalizados para comprimento 1, o que significa que:

    - Similaridade de cosseno é equivalente à similaridade de produto escalar, enquanto a última pode ser computada mais rapidamente.
    - Similaridade de cosseno e distância euclidiana resultarão em classificações idênticas.
  
</section>

  <section title="Qual é a relação entre caracteres, palavras e tokens?">

    Por favor, veja esta [página](https://docs.voyageai.com/docs/tokenization?ref=anthropic).
  
</section>

  <section title="Quando e como devo usar o parâmetro input_type?">

    Para todas as tarefas de recuperação e casos de uso (por exemplo, RAG), recomendamos que o parâmetro `input_type` seja usado para especificar se o texto de entrada é uma consulta ou documento. Não omita `input_type` ou defina `input_type=None`. Especificar se o texto de entrada é uma consulta ou documento pode criar melhores representações de vetor denso para recuperação, o que pode levar a melhor qualidade de recuperação.

    Ao usar o parâmetro `input_type`, prompts especiais são anexados ao texto de entrada antes da incorporação. Especificamente:

    > 📘 **Prompts associados com `input_type`**
    > 
    > - Para uma consulta, o prompt é "Represente a consulta para recuperar documentos de apoio: ".
    > - Para um documento, o prompt é "Represente o documento para recuperação: ".
    > - Exemplo
    >     - Quando `input_type="query"`, uma consulta como "Quando está agendada a conferência telefônica da Apple?" se tornará "**Represente a consulta para recuperar documentos de apoio:** Quando está agendada a conferência telefônica da Apple?"
    >     - Quando `input_type="document"`, uma consulta como "A conferência telefônica da Apple para discutir os resultados do quarto trimestre fiscal e atualizações de negócios está agendada para quinta-feira, 2 de novembro de 2023 às 14:00 PT / 17:00 ET." se tornará "**Represente o documento para recuperação:** A conferência telefônica da Apple para discutir os resultados do quarto trimestre fiscal e atualizações de negócios está agendada para quinta-feira, 2 de novembro de 2023 às 14:00 PT / 17:00 ET."

    `voyage-large-2-instruct`, como o nome sugere, é treinado para ser responsivo a instruções adicionais que são anexadas ao texto de entrada. Para classificação, agrupamento ou outras subtarefas [MTEB](https://huggingface.co/mteb), por favor use as instruções [aqui](https://github.com/voyage-ai/voyage-large-2-instruct).
  
</section>

  <section title="Quais opções de quantização estão disponíveis?">

    Quantização em embeddings converte valores de alta precisão, como números de ponto flutuante de precisão simples de 32 bits, para formatos de menor precisão como inteiros de 8 bits ou valores binários de 1 bit, reduzindo armazenamento, memória e custos em 4x e 32x, respectivamente. Modelos Voyage suportados habilitam quantização especificando o tipo de dados de saída com o parâmetro `output_dtype`:

    - `float`: Cada embedding retornado é uma lista de números de ponto flutuante de precisão simples de 32 bits (4 bytes). Este é o padrão e fornece a maior precisão / precisão de recuperação.
    - `int8` e `uint8`: Cada embedding retornado é uma lista de inteiros de 8 bits (1 byte) variando de -128 a 127 e 0 a 255, respectivamente.
    - `binary` e `ubinary`: Cada embedding retornado é uma lista de inteiros de 8 bits que representam valores de embedding quantizados de um bit empacotados em bits: `int8` para `binary` e `uint8` para `ubinary`. O comprimento da lista retornada de inteiros é 1/8 da dimensão real do embedding. O tipo binário usa o método binário de deslocamento, sobre o qual você pode aprender mais no FAQ abaixo.

    > **Exemplo de quantização binária**
    > 
    > Considere os seguintes oito valores de embedding: -0.03955078, 0.006214142, -0.07446289, -0.039001465, 0.0046463013, 0.00030612946, -0.08496094, e 0.03994751. Com quantização binária, valores menores ou iguais a zero serão quantizados para um zero binário, e valores positivos para um um binário, resultando na seguinte sequência binária: 0, 1, 0, 0, 1, 1, 0, 1. Estes oito bits são então empacotados em um único inteiro de 8 bits, 01001101 (com o bit mais à esquerda como o bit mais significativo).
    >   - `ubinary`: A sequência binária é diretamente convertida e representada como o inteiro sem sinal (`uint8`) 77.
    >   - `binary`: A sequência binária é representada como o inteiro com sinal (`int8`) -51, calculado usando o método binário de deslocamento (77 - 128 = -51).
  
</section>

  <section title="Como posso truncar embeddings Matryoshka?">

    Aprendizado Matryoshka cria embeddings com representações grossas a finas dentro de um único vetor. Modelos Voyage, como `voyage-code-3`, que suportam múltiplas dimensões de saída geram tais embeddings Matryoshka. Você pode truncar esses vetores mantendo o subconjunto principal de dimensões. Por exemplo, o seguinte código Python demonstra como truncar vetores de 1024 dimensões para 256 dimensões:

    ```python
    import voyageai
    import numpy as np

    def embd_normalize(v: np.ndarray) -> np.ndarray:
        """
        Normalizar as linhas de um array numpy 2D para vetores unitários dividindo cada linha por sua
        norma euclidiana. Levanta um ValueError se qualquer linha tiver uma norma de zero para prevenir divisão por zero.
        """
        row_norms = np.linalg.norm(v, axis=1, keepdims=True)
        if np.any(row_norms == 0):
            raise ValueError("Não é possível normalizar linhas com uma norma de zero.")
        return v / row_norms


    vo = voyageai.Client()

    # Gerar vetores voyage-code-3, que por padrão são números de ponto flutuante de 1024 dimensões
    embd = vo.embed(['Texto de exemplo 1', 'Texto de exemplo 2'], model='voyage-code-3').embeddings

    # Definir dimensão mais curta
    short_dim = 256

    # Redimensionar e normalizar vetores para dimensão mais curta
    resized_embd = embd_normalize(np.array(embd)[:, :short_dim]).tolist()
    ```
  
</section>

## Preços

Visite a [página de preços](https://docs.voyageai.com/docs/pricing?ref=anthropic) da Voyage para os detalhes de preços mais atualizados.