# Ferramenta de uso de computador

Claude pode interagir com ambientes de computador através da ferramenta de uso de computador, que fornece capacidades de captura de tela e controle de mouse/teclado para interação autônoma de desktop.

---

Claude pode interagir com ambientes de computador através da ferramenta de uso de computador, que fornece capacidades de captura de tela e controle de mouse/teclado para interação autônoma de desktop.

<Note>
O uso de computador está atualmente em beta e requer um [cabeçalho beta](/docs/pt-BR/api/beta-headers):
- `"computer-use-2025-11-24"` para Claude Opus 4.5
- `"computer-use-2025-01-24"` para Claude Sonnet 4.5, Haiku 4.5, Opus 4.1, Sonnet 4, Opus 4, e Sonnet 3.7 ([descontinuado](/docs/pt-BR/about-claude/model-deprecations))
</Note>

## Visão geral

O uso de computador é um recurso beta que permite que Claude interaja com ambientes de desktop. Esta ferramenta fornece:

- **Captura de tela**: Veja o que está sendo exibido na tela no momento
- **Controle de mouse**: Clique, arraste e mova o cursor
- **Entrada de teclado**: Digite texto e use atalhos de teclado
- **Automação de desktop**: Interaja com qualquer aplicativo ou interface

Embora o uso de computador possa ser aumentado com outras ferramentas como bash e editor de texto para fluxos de trabalho de automação mais abrangentes, o uso de computador especificamente se refere à capacidade da ferramenta de uso de computador de ver e controlar ambientes de desktop.

## Compatibilidade de modelo

O uso de computador está disponível para os seguintes modelos Claude:

| Modelo | Versão da Ferramenta | Sinalizador Beta |
|-------|--------------|-----------|
| Claude Opus 4.5 | `computer_20251124` | `computer-use-2025-11-24` |
| Todos os outros modelos suportados | `computer_20250124` | `computer-use-2025-01-24` |

<Note>
Claude Opus 4.5 introduz a versão de ferramenta `computer_20251124` com novas capacidades incluindo a ação de zoom para inspeção detalhada de regiões de tela. Todos os outros modelos (Sonnet 4.5, Haiku 4.5, Sonnet 4, Opus 4, Opus 4.1, e Sonnet 3.7) usam a versão de ferramenta `computer_20250124`.
</Note>

<Warning>
Versões de ferramenta mais antigas não são garantidas como compatíveis com versões mais recentes de modelos. Sempre use a versão de ferramenta que corresponde à sua versão de modelo.
</Warning>

## Considerações de segurança

<Warning>
O uso de computador é um recurso beta com riscos únicos distintos dos recursos padrão da API. Esses riscos são aumentados ao interagir com a internet. Para minimizar riscos, considere tomar precauções como:

1. Use uma máquina virtual dedicada ou contêiner com privilégios mínimos para evitar ataques diretos ao sistema ou acidentes.
2. Evite dar ao modelo acesso a dados sensíveis, como informações de login de conta, para evitar roubo de informações.
3. Limite o acesso à internet a uma lista de permissões de domínios para reduzir a exposição a conteúdo malicioso.
4. Peça a um humano para confirmar decisões que possam resultar em consequências significativas no mundo real, bem como qualquer tarefa que exija consentimento afirmativo, como aceitar cookies, executar transações financeiras ou concordar com termos de serviço.

Em algumas circunstâncias, Claude seguirá comandos encontrados em conteúdo mesmo que conflitem com as instruções do usuário. Por exemplo, instruções Claude em páginas da web ou contidas em imagens podem substituir instruções ou fazer com que Claude cometa erros. Sugerimos tomar precauções para isolar Claude de dados sensíveis e ações para evitar riscos relacionados a injeção de prompt.

Treinamos o modelo para resistir a essas injeções de prompt e adicionamos uma camada extra de defesa. Se você usar nossas ferramentas de uso de computador, executaremos automaticamente classificadores em seus prompts para sinalizar possíveis instâncias de injeção de prompt. Quando esses classificadores identificam possíveis injeções de prompt em capturas de tela, eles automaticamente direcionam o modelo a pedir confirmação do usuário antes de prosseguir com a próxima ação. Reconhecemos que essa proteção extra não será ideal para todos os casos de uso (por exemplo, casos de uso sem um humano no loop), então se você gostaria de desativar e desligar, por favor [entre em contato conosco](https://support.claude.com/en/).

Ainda sugerimos tomar precauções para isolar Claude de dados sensíveis e ações para evitar riscos relacionados a injeção de prompt.

Finalmente, por favor informe aos usuários finais os riscos relevantes e obtenha seu consentimento antes de ativar o uso de computador em seus próprios produtos.

</Warning>

<Card
  title="Implementação de referência de uso de computador"
  icon="computer"
  href="https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo"
>

Comece rapidamente com nossa implementação de referência de uso de computador que inclui uma interface web, contêiner Docker, implementações de ferramentas de exemplo, e um loop de agente.

**Nota:** A implementação foi atualizada para incluir novas ferramentas para ambos os modelos Claude 4 e Claude Sonnet 3.7. Certifique-se de fazer pull da versão mais recente do repositório para acessar esses novos recursos.

</Card>

<Tip>
  Por favor use [este formulário](https://forms.gle/BT1hpBrqDPDUrCqo7) para fornecer
  feedback sobre a qualidade das respostas do modelo, a API em si, ou a qualidade
  da documentação - não podemos esperar para ouvir você!
</Tip>

## Início rápido

Aqui está como começar com o uso de computador:

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",  # ou outro modelo compatível
    max_tokens=1024,
    tools=[
        {
          "type": "computer_20250124",
          "name": "computer",
          "display_width_px": 1024,
          "display_height_px": 768,
          "display_number": 1,
        },
        {
          "type": "text_editor_20250728",
          "name": "str_replace_based_edit_tool"
        },
        {
          "type": "bash_20250124",
          "name": "bash"
        }
    ],
    messages=[{"role": "user", "content": "Save a picture of a cat to my desktop."}],
    betas=["computer-use-2025-01-24"]
)
print(response)
```

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: computer-use-2025-01-24" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "tools": [
      {
        "type": "computer_20250124",
        "name": "computer",
        "display_width_px": 1024,
        "display_height_px": 768,
        "display_number": 1
      },
      {
        "type": "text_editor_20250728",
        "name": "str_replace_based_edit_tool"
      },
      {
        "type": "bash_20250124",
        "name": "bash"
      }
    ],
    "messages": [
      {
        "role": "user",
        "content": "Save a picture of a cat to my desktop."
      }
    ]
  }'
```
</CodeGroup>

<Note>
Um cabeçalho beta é necessário apenas para a ferramenta de uso de computador.

O exemplo acima mostra todas as três ferramentas sendo usadas juntas, o que requer o cabeçalho beta porque inclui a ferramenta de uso de computador.
</Note>

---

## Como funciona o uso de computador

<Steps>
  <Step
    title="1. Forneça a Claude a ferramenta de uso de computador e um prompt do usuário"
    icon="tool"
  >
    - Adicione a ferramenta de uso de computador (e opcionalmente outras ferramentas) à sua solicitação de API.
    - Inclua um prompt do usuário que exija interação de desktop, por exemplo, "Salve uma imagem de um gato na minha área de trabalho."
  </Step>
  <Step title="2. Claude decide usar a ferramenta de uso de computador" icon="wrench">
    - Claude avalia se a ferramenta de uso de computador pode ajudar com a consulta do usuário.
    - Se sim, Claude constrói uma solicitação de uso de ferramenta adequadamente formatada.
    - A resposta da API tem um `stop_reason` de `tool_use`, sinalizando a intenção de Claude.
  </Step>
  <Step
    title="3. Extraia a entrada da ferramenta, avalie a ferramenta em um computador e retorne os resultados"
    icon="computer"
  >
    - Do seu lado, extraia o nome da ferramenta e a entrada da solicitação de Claude.
    - Use a ferramenta em um contêiner ou Máquina Virtual.
    - Continue a conversa com uma nova mensagem `user` contendo um bloco de conteúdo `tool_result`.
  </Step>
  <Step
    title="4. Claude continua chamando ferramentas de uso de computador até completar a tarefa"
    icon="arrows-clockwise"
  >
    - Claude analisa os resultados da ferramenta para determinar se mais uso de ferramenta é necessário ou a tarefa foi concluída.
    - Se Claude decidir que precisa de outra ferramenta, ele responde com outro `stop_reason` de `tool_use` e você deve retornar ao passo 3.
    - Caso contrário, ele elabora uma resposta de texto para o usuário.
  </Step>
</Steps>

Nos referimos à repetição dos passos 3 e 4 sem entrada do usuário como o "loop de agente" - ou seja, Claude respondendo com uma solicitação de uso de ferramenta e sua aplicação respondendo a Claude com os resultados da avaliação dessa solicitação.

### O ambiente de computação

O uso de computador requer um ambiente de computação em sandbox onde Claude pode interagir com segurança com aplicativos e a web. Este ambiente inclui:

1. **Exibição virtual**: Um servidor de exibição X11 virtual (usando Xvfb) que renderiza a interface de desktop que Claude verá através de capturas de tela e controlará com ações de mouse/teclado.

2. **Ambiente de desktop**: Uma interface de usuário leve com gerenciador de janelas (Mutter) e painel (Tint2) em execução no Linux, que fornece uma interface gráfica consistente para Claude interagir.

3. **Aplicativos**: Aplicativos Linux pré-instalados como Firefox, LibreOffice, editores de texto e gerenciadores de arquivos que Claude pode usar para completar tarefas.

4. **Implementações de ferramentas**: Código de integração que traduz solicitações de ferramentas abstratas de Claude (como "mover mouse" ou "tirar captura de tela") em operações reais no ambiente virtual.

5. **Loop de agente**: Um programa que lida com a comunicação entre Claude e o ambiente, enviando as ações de Claude para o ambiente e retornando os resultados (capturas de tela, saídas de comando) de volta para Claude.

Quando você usa o uso de computador, Claude não se conecta diretamente a este ambiente. Em vez disso, sua aplicação:

1. Recebe solicitações de uso de ferramenta de Claude
2. As traduz em ações em seu ambiente de computação
3. Captura os resultados (capturas de tela, saídas de comando, etc.)
4. Retorna esses resultados para Claude

Para segurança e isolamento, a implementação de referência executa tudo isso dentro de um contêiner Docker com mapeamentos de porta apropriados para visualizar e interagir com o ambiente.

---

## Como implementar o uso de computador

### Comece com nossa implementação de referência

Construímos uma [implementação de referência](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo) que inclui tudo o que você precisa para começar rapidamente com o uso de computador:

- Um [ambiente containerizado](https://github.com/anthropics/anthropic-quickstarts/blob/main/computer-use-demo/Dockerfile) adequado para uso de computador com Claude
- Implementações das [ferramentas de uso de computador](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo/computer_use_demo/tools)
- Um [loop de agente](https://github.com/anthropics/anthropic-quickstarts/blob/main/computer-use-demo/computer_use_demo/loop.py) que interage com a API Claude e executa as ferramentas de uso de computador
- Uma interface web para interagir com o contêiner, loop de agente e ferramentas.

### Entendendo o loop multi-agente

O núcleo do uso de computador é o "loop de agente" - um ciclo onde Claude solicita ações de ferramenta, sua aplicação as executa e retorna resultados para Claude. Aqui está um exemplo simplificado:

```python
async def sampling_loop(
    *,
    model: str,
    messages: list[dict],
    api_key: str,
    max_tokens: int = 4096,
    tool_version: str,
    thinking_budget: int | None = None,
    max_iterations: int = 10,  # Adicione limite de iteração para evitar loops infinitos
):
    """
    Um loop de agente simples para interações de uso de computador Claude.

    Esta função lida com a troca entre:
    1. Enviar mensagens do usuário para Claude
    2. Claude solicitando usar ferramentas
    3. Sua aplicação executando essas ferramentas
    4. Enviar resultados de ferramentas de volta para Claude
    """
    # Configure ferramentas e parâmetros de API
    client = Anthropic(api_key=api_key)
    beta_flag = "computer-use-2025-01-24" if "20250124" in tool_version else "computer-use-2024-10-22"

    # Configure ferramentas - você já deve ter estas inicializadas em outro lugar
    tools = [
        {"type": f"computer_{tool_version}", "name": "computer", "display_width_px": 1024, "display_height_px": 768},
        {"type": f"text_editor_{tool_version}", "name": "str_replace_editor"},
        {"type": f"bash_{tool_version}", "name": "bash"}
    ]

    # Loop de agente principal (com limite de iteração para evitar custos de API descontrolados)
    iterations = 0
    while True and iterations < max_iterations:
        iterations += 1
        # Configure parâmetro de pensamento opcional (para Claude Sonnet 3.7)
        thinking = None
        if thinking_budget:
            thinking = {"type": "enabled", "budget_tokens": thinking_budget}

        # Chame a API Claude
        response = client.beta.messages.create(
            model=model,
            max_tokens=max_tokens,
            messages=messages,
            tools=tools,
            betas=[beta_flag],
            thinking=thinking
        )

        # Adicione a resposta de Claude ao histórico de conversa
        response_content = response.content
        messages.append({"role": "assistant", "content": response_content})

        # Verifique se Claude usou alguma ferramenta
        tool_results = []
        for block in response_content:
            if block.type == "tool_use":
                # Em uma aplicação real, você executaria a ferramenta aqui
                # Por exemplo: result = run_tool(block.name, block.input)
                result = {"result": "Tool executed successfully"}

                # Formate o resultado para Claude
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": result
                })

        # Se nenhuma ferramenta foi usada, Claude terminou - retorne as mensagens finais
        if not tool_results:
            return messages

        # Adicione resultados de ferramentas às mensagens para a próxima iteração com Claude
        messages.append({"role": "user", "content": tool_results})
```

O loop continua até que Claude responda sem solicitar nenhuma ferramenta (conclusão da tarefa) ou o limite máximo de iteração seja atingido. Esta proteção evita possíveis loops infinitos que poderiam resultar em custos de API inesperados.

Recomendamos tentar a implementação de referência antes de ler o resto desta documentação.

### Otimize o desempenho do modelo com prompting

Aqui estão algumas dicas sobre como obter as melhores saídas de qualidade:

1. Especifique tarefas simples e bem definidas e forneça instruções explícitas para cada etapa.
2. Claude às vezes assume resultados de suas ações sem verificar explicitamente seus resultados. Para evitar isso, você pode fazer prompt de Claude com `After each step, take a screenshot and carefully evaluate if you have achieved the right outcome. Explicitly show your thinking: "I have evaluated step X..." If not correct, try again. Only when you confirm a step was executed correctly should you move on to the next one.`
3. Alguns elementos de interface do usuário (como dropdowns e barras de rolagem) podem ser complicados para Claude manipular usando movimentos de mouse. Se você experimentar isso, tente fazer prompt do modelo para usar atalhos de teclado.
4. Para tarefas repetíveis ou interações de interface do usuário, inclua capturas de tela de exemplo e chamadas de ferramentas de resultados bem-sucedidos em seu prompt.
5. Se você precisar que o modelo faça login, forneça o nome de usuário e senha em seu prompt dentro de tags xml como `<robot_credentials>`. Usar o uso de computador dentro de aplicativos que exigem login aumenta o risco de resultados ruins como resultado de injeção de prompt. Por favor, revise nosso [guia sobre mitigação de injeções de prompt](/docs/pt-BR/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks) antes de fornecer ao modelo credenciais de login.

<Tip>
  Se você encontrar repetidamente um conjunto claro de problemas ou souber com antecedência as tarefas
  que Claude precisará completar, use o prompt do sistema para fornecer a Claude
  dicas explícitas ou instruções sobre como fazer as tarefas com sucesso.
</Tip>

### Prompts do sistema

Quando uma das ferramentas definidas pela Anthropic é solicitada através da API Claude, um prompt do sistema específico de uso de computador é gerado. É semelhante ao [prompt do sistema de uso de ferramenta](/docs/pt-BR/agents-and-tools/tool-use/implement-tool-use#tool-use-system-prompt) mas começa com:

> You have access to a set of functions you can use to answer the user's question. This includes access to a sandboxed computing environment. You do NOT currently have the ability to inspect files or interact with external resources, except by invoking the below functions.

Como com o uso regular de ferramentas, o campo `system_prompt` fornecido pelo usuário ainda é respeitado e usado na construção do prompt do sistema combinado.

### Ações disponíveis

A ferramenta de uso de computador suporta estas ações:

**Ações básicas (todas as versões)**
- **screenshot** - Capture a exibição atual
- **left_click** - Clique nas coordenadas `[x, y]`
- **type** - Digite string de texto
- **key** - Pressione tecla ou combinação de teclas (por exemplo, "ctrl+s")
- **mouse_move** - Mova o cursor para coordenadas

**Ações aprimoradas (`computer_20250124`)**
Disponível em modelos Claude 4 e Claude Sonnet 3.7:
- **scroll** - Role em qualquer direção com controle de quantidade
- **left_click_drag** - Clique e arraste entre coordenadas
- **right_click**, **middle_click** - Botões de mouse adicionais
- **double_click**, **triple_click** - Múltiplos cliques
- **left_mouse_down**, **left_mouse_up** - Controle de clique refinado
- **hold_key** - Mantenha uma tecla pressionada enquanto realiza outras ações
- **wait** - Pause entre ações

**Ações aprimoradas (`computer_20251124`)**
Disponível em Claude Opus 4.5:
- Todas as ações de `computer_20250124`
- **zoom** - Veja uma região específica da tela em resolução completa. Requer `enable_zoom: true` na definição da ferramenta. Leva um parâmetro `region` com coordenadas `[x1, y1, x2, y2]` definindo os cantos superior esquerdo e inferior direito da área a inspecionar.

<section title="Ações de exemplo">

```json
// Tire uma captura de tela
{
  "action": "screenshot"
}

// Clique na posição
{
  "action": "left_click",
  "coordinate": [500, 300]
}

// Digite texto
{
  "action": "type",
  "text": "Hello, world!"
}

// Role para baixo (Claude 4/3.7)
{
  "action": "scroll",
  "coordinate": [500, 400],
  "scroll_direction": "down",
  "scroll_amount": 3
}

// Zoom para visualizar região em detalhes (Opus 4.5)
{
  "action": "zoom",
  "region": [100, 200, 400, 350]
}
```

</section>

### Parâmetros da ferramenta

| Parâmetro | Obrigatório | Descrição |
|-----------|----------|-------------|
| `type` | Sim | Versão da ferramenta (`computer_20251124`, `computer_20250124`, ou `computer_20241022`) |
| `name` | Sim | Deve ser "computer" |
| `display_width_px` | Sim | Largura da exibição em pixels |
| `display_height_px` | Sim | Altura da exibição em pixels |
| `display_number` | Não | Número de exibição para ambientes X11 |
| `enable_zoom` | Não | Ativar ação de zoom (`computer_20251124` apenas). Defina como `true` para permitir que Claude faça zoom em regiões específicas da tela. Padrão: `false` |

<Note>
**Importante**: A ferramenta de uso de computador deve ser explicitamente executada por sua aplicação - Claude não pode executá-la diretamente. Você é responsável por implementar a captura de tela, movimentos de mouse, entradas de teclado e outras ações com base nas solicitações de Claude.
</Note>

### Ativar capacidade de pensamento em modelos Claude 4 e Claude Sonnet 3.7

Claude Sonnet 3.7 introduziu uma nova capacidade de "pensamento" que permite que você veja o processo de raciocínio do modelo conforme ele trabalha através de tarefas complexas. Este recurso ajuda você a entender como Claude está abordando um problema e pode ser particularmente valioso para depuração ou fins educacionais.

Para ativar o pensamento, adicione um parâmetro `thinking` à sua solicitação de API:

```json
"thinking": {
  "type": "enabled",
  "budget_tokens": 1024
}
```

O parâmetro `budget_tokens` especifica quantos tokens Claude pode usar para pensamento. Isto é subtraído do seu orçamento geral de `max_tokens`.

Quando o pensamento está ativado, Claude retornará seu processo de raciocínio como parte da resposta, o que pode ajudá-lo a:

1. Entender o processo de tomada de decisão do modelo
2. Identificar possíveis problemas ou conceitos errados
3. Aprender com a abordagem de Claude para resolução de problemas
4. Obter mais visibilidade em operações complexas de múltiplas etapas

Aqui está um exemplo de como a saída de pensamento pode parecer:

```
[Thinking]
Preciso salvar uma imagem de um gato na área de trabalho. Deixe-me dividir isso em etapas:

1. Primeiro, vou tirar uma captura de tela para ver o que está na área de trabalho
2. Então vou procurar um navegador web para procurar imagens de gatos
3. Depois de encontrar uma imagem adequada, vou precisar salvá-la na área de trabalho

Deixe-me começar tirando uma captura de tela para ver o que está disponível...
```

### Aumentando o uso de computador com outras ferramentas

A ferramenta de uso de computador pode ser combinada com outras ferramentas para criar fluxos de trabalho de automação mais poderosos. Isto é particularmente útil quando você precisa:
- Executar comandos do sistema ([ferramenta bash](/docs/pt-BR/agents-and-tools/tool-use/bash-tool))
- Editar arquivos de configuração ou scripts ([ferramenta de editor de texto](/docs/pt-BR/agents-and-tools/tool-use/text-editor-tool))
- Integrar com APIs personalizadas ou serviços (ferramentas personalizadas)

<CodeGroup>
  ```bash Shell
  curl https://api.anthropic.com/v1/messages \
    -H "content-type: application/json" \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "anthropic-beta: computer-use-2025-01-24" \
    -d '{
      "model": "claude-sonnet-4-5",
      "max_tokens": 2000,
      "tools": [
        {
          "type": "computer_20250124",
          "name": "computer",
          "display_width_px": 1024,
          "display_height_px": 768,
          "display_number": 1
        },
        {
          "type": "text_editor_20250728",
          "name": "str_replace_based_edit_tool"
        },
        {
          "type": "bash_20250124",
          "name": "bash"
        },
        {
          "name": "get_weather",
          "description": "Get the current weather in a given location",
          "input_schema": {
            "type": "object",
            "properties": {
              "location": {
                "type": "string",
                "description": "The city and state, e.g. San Francisco, CA"
              },
              "unit": {
                "type": "string",
                "enum": ["celsius", "fahrenheit"],
                "description": "The unit of temperature, either 'celsius' or 'fahrenheit'"
              }
            },
            "required": ["location"]
          }
        }
      ],
      "messages": [
        {
          "role": "user",
          "content": "Find flights from San Francisco to a place with warmer weather."
        }
      ],
      "thinking": {
        "type": "enabled",
        "budget_tokens": 1024
      }
    }'
  ```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[
        {
          "type": "computer_20250124",
          "name": "computer",
          "display_width_px": 1024,
          "display_height_px": 768,
          "display_number": 1,
        },
        {
          "type": "text_editor_20250728",
          "name": "str_replace_based_edit_tool"
        },
        {
          "type": "bash_20250124",
          "name": "bash"
        },
        {
          "name": "get_weather",
          "description": "Get the current weather in a given location",
          "input_schema": {
            "type": "object",
            "properties": {
              "location": {
                "type": "string",
                "description": "The city and state, e.g. San Francisco, CA"
              },
              "unit": {
                "type": "string",
                "enum": ["celsius", "fahrenheit"],
                "description": "The unit of temperature, either 'celsius' or 'fahrenheit'"
              }
            },
            "required": ["location"]
          }
        },
    ],
    messages=[{"role": "user", "content": "Find flights from San Francisco to a place with warmer weather."}],
    betas=["computer-use-2025-01-24"],
    thinking={"type": "enabled", "budget_tokens": 1024},
)
print(response)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const message = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: [
      {
        type: "computer_20250124",
        name: "computer",
        display_width_px: 1024,
        display_height_px: 768,
        display_number: 1,
      },
      {
        type: "text_editor_20250728",
        name: "str_replace_based_edit_tool"
      },
      {
        type: "bash_20250124",
        name: "bash"
      },
      {
        name: "get_weather",
        description: "Get the current weather in a given location",
        input_schema: {
          type: "object",
          properties: {
            location: {
              type: "string",
              description: "The city and state, e.g. San Francisco, CA"
            },
            unit: {
              type: "string",
              enum: ["celsius", "fahrenheit"],
              description: "The unit of temperature, either 'celsius' or 'fahrenheit'"
            }
          },
          required: ["location"]
        }
      },
  ],
  messages: [{ role: "user", content: "Find flights from San Francisco to a place with warmer weather." }],
  betas: ["computer-use-2025-01-24"],
  thinking: { type: "enabled", budget_tokens: 1024 },
});
console.log(message);
```
```java Java
import java.util.List;
import java.util.Map;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.JsonValue;
import com.anthropic.models.beta.messages.BetaMessage;
import com.anthropic.models.beta.messages.MessageCreateParams;
import com.anthropic.models.beta.messages.BetaToolBash20250124;
import com.anthropic.models.beta.messages.BetaToolComputerUse20250124;
import com.anthropic.models.beta.messages.BetaToolTextEditor20250124;
import com.anthropic.models.beta.messages.BetaThinkingConfigEnabled;
import com.anthropic.models.beta.messages.BetaThinkingConfigParam;
import com.anthropic.models.beta.messages.BetaTool;

public class MultipleToolsExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        MessageCreateParams params = MessageCreateParams.builder()
                .model("claude-sonnet-4-5")
                .maxTokens(1024)
                .addTool(BetaToolComputerUse20250124.builder()
                        .displayWidthPx(1024)
                        .displayHeightPx(768)
                        .displayNumber(1)
                        .build())
                .addTool(BetaToolTextEditor20250124.builder()
                        .build())
                .addTool(BetaToolBash20250124.builder()
                        .build())
                .addTool(BetaTool.builder()
                        .name("get_weather")
                        .description("Get the current weather in a given location")
                        .inputSchema(BetaTool.InputSchema.builder()
                                .properties(
                                        JsonValue.from(
                                                Map.of(
                                                        "location", Map.of(
                                                                "type", "string",
                                                                "description", "The city and state, e.g. San Francisco, CA"
                                                        ),
                                                        "unit", Map.of(
                                                                "type", "string",
                                                                "enum", List.of("celsius", "fahrenheit"),
                                                                "description", "The unit of temperature, either 'celsius' or 'fahrenheit'"
                                                        )
                                                )
                                        ))
                                .build()
                        )
                        .build())
                .thinking(BetaThinkingConfigParam.ofEnabled(
                        BetaThinkingConfigEnabled.builder()
                                .budgetTokens(1024)
                                .build()
                ))
                .addUserMessage("Find flights from San Francisco to a place with warmer weather.")
                .addBeta("computer-use-2025-01-24")
                .build();

        BetaMessage message = client.beta().messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>

### Construir um ambiente de uso de computador personalizado

A [implementação de referência](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo) foi desenvolvida para ajudá-lo a começar com o uso de computador. Ela inclui todos os componentes necessários para que Claude use um computador. No entanto, você pode construir seu próprio ambiente para uso de computador de acordo com suas necessidades. Você precisará de:

- Um ambiente virtualizado ou containerizado adequado para uso de computador com Claude
- Uma implementação de pelo menos uma das ferramentas de uso de computador definidas pela Anthropic
- Um loop de agente que interage com a API Claude e executa os resultados de `tool_use` usando suas implementações de ferramentas
- Uma API ou interface que permita entrada do usuário para iniciar o loop do agente

#### Implementar a ferramenta de uso de computador

A ferramenta de uso de computador é implementada como uma ferramenta sem esquema. Ao usar esta ferramenta, você não precisa fornecer um esquema de entrada como com outras ferramentas; o esquema é integrado ao modelo Claude e não pode ser modificado.

<Steps>
  <Step title="Configurar seu ambiente de computação">
    Crie um display virtual ou conecte-se a um display existente com o qual Claude interagirá. Isso normalmente envolve configurar Xvfb (X Virtual Framebuffer) ou tecnologia similar.
  </Step>
  <Step title="Implementar manipuladores de ação">
    Crie funções para lidar com cada tipo de ação que Claude pode solicitar:
    ```python
    def handle_computer_action(action_type, params):
        if action_type == "screenshot":
            return capture_screenshot()
        elif action_type == "left_click":
            x, y = params["coordinate"]
            return click_at(x, y)
        elif action_type == "type":
            return type_text(params["text"])
        # ... lidar com outras ações
    ```
  </Step>
  <Step title="Processar chamadas de ferramenta do Claude">
    Extraia e execute chamadas de ferramenta das respostas do Claude:
    ```python
    for content in response.content:
        if content.type == "tool_use":
            action = content.input["action"]
            result = handle_computer_action(action, content.input)
            
            # Retornar resultado para Claude
            tool_result = {
                "type": "tool_result",
                "tool_use_id": content.id,
                "content": result
            }
    ```
  </Step>
  <Step title="Implementar o loop do agente">
    Crie um loop que continua até Claude completar a tarefa:
    ```python
    while True:
        response = client.beta.messages.create(...)
        
        # Verificar se Claude usou alguma ferramenta
        tool_results = process_tool_calls(response)
        
        if not tool_results:
            # Sem mais uso de ferramenta, tarefa concluída
            break
            
        # Continuar conversa com resultados de ferramenta
        messages.append({"role": "user", "content": tool_results})
    ```
  </Step>
</Steps>

#### Lidar com erros

Ao implementar a ferramenta de uso de computador, vários erros podem ocorrer. Aqui está como lidar com eles:

<section title="Falha na captura de screenshot">

Se a captura de screenshot falhar, retorne uma mensagem de erro apropriada:

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Error: Failed to capture screenshot. Display may be locked or unavailable.",
      "is_error": true
    }
  ]
}
```

</section>

<section title="Coordenadas inválidas">

Se Claude fornecer coordenadas fora dos limites do display:

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Error: Coordinates (1200, 900) are outside display bounds (1024x768).",
      "is_error": true
    }
  ]
}
```

</section>

<section title="Falha na execução de ação">

Se uma ação falhar na execução:

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Error: Failed to perform click action. The application may be unresponsive.",
      "is_error": true
    }
  ]
}
```

</section>

#### Lidar com dimensionamento de coordenadas para resoluções mais altas

A API restringe imagens a um máximo de 1568 pixels na borda mais longa e aproximadamente 1,15 megapixels no total (veja [redimensionamento de imagem](/docs/pt-BR/build-with-claude/vision#evaluate-image-size) para detalhes). Por exemplo, uma tela de 1512x982 é reduzida para aproximadamente 1330x864. Claude analisa essa imagem menor e retorna coordenadas nesse espaço, mas sua ferramenta executa cliques no espaço de tela original.

Isso pode fazer com que as coordenadas de clique do Claude percam seus alvos, a menos que você lide com a transformação de coordenadas.

Para corrigir isso, redimensione screenshots você mesmo e dimensione as coordenadas do Claude de volta:

<CodeGroup>
```python Python
import math

def get_scale_factor(width, height):
    """Calcular fator de escala para atender às restrições da API."""
    long_edge = max(width, height)
    total_pixels = width * height

    long_edge_scale = 1568 / long_edge
    total_pixels_scale = math.sqrt(1_150_000 / total_pixels)

    return min(1.0, long_edge_scale, total_pixels_scale)

# Ao capturar screenshot
scale = get_scale_factor(screen_width, screen_height)
scaled_width = int(screen_width * scale)
scaled_height = int(screen_height * scale)

# Redimensionar imagem para dimensões dimensionadas antes de enviar para Claude
screenshot = capture_and_resize(scaled_width, scaled_height)

# Ao lidar com as coordenadas do Claude, dimensione-as de volta
def execute_click(x, y):
    screen_x = x / scale
    screen_y = y / scale
    perform_click(screen_x, screen_y)
```

```typescript TypeScript
const MAX_LONG_EDGE = 1568;
const MAX_PIXELS = 1_150_000;

function getScaleFactor(width: number, height: number): number {
  const longEdge = Math.max(width, height);
  const totalPixels = width * height;

  const longEdgeScale = MAX_LONG_EDGE / longEdge;
  const totalPixelsScale = Math.sqrt(MAX_PIXELS / totalPixels);

  return Math.min(1.0, longEdgeScale, totalPixelsScale);
}

// Ao capturar screenshot
const scale = getScaleFactor(screenWidth, screenHeight);
const scaledWidth = Math.floor(screenWidth * scale);
const scaledHeight = Math.floor(screenHeight * scale);

// Redimensionar imagem para dimensões dimensionadas antes de enviar para Claude
const screenshot = captureAndResize(scaledWidth, scaledHeight);

// Ao lidar com as coordenadas do Claude, dimensione-as de volta
function executeClick(x: number, y: number): void {
  const screenX = x / scale;
  const screenY = y / scale;
  performClick(screenX, screenY);
}
```
</CodeGroup>

#### Seguir as melhores práticas de implementação

<section title="Usar resolução de display apropriada">

Defina dimensões de display que correspondam ao seu caso de uso enquanto permanecem dentro dos limites recomendados:
- Para tarefas gerais de desktop: 1024x768 ou 1280x720
- Para aplicações web: 1280x800 ou 1366x768
- Evite resoluções acima de 1920x1080 para evitar problemas de desempenho

</section>

<section title="Implementar manipulação apropriada de screenshot">

Ao retornar screenshots para Claude:
- Codifique screenshots como PNG ou JPEG em base64
- Considere comprimir screenshots grandes para melhorar o desempenho
- Inclua metadados relevantes como timestamp ou estado do display
- Se usar resoluções mais altas, certifique-se de que as coordenadas sejam dimensionadas com precisão

</section>

<section title="Adicionar atrasos de ação">

Algumas aplicações precisam de tempo para responder a ações:
```python
def click_and_wait(x, y, wait_time=0.5):
    click_at(x, y)
    time.sleep(wait_time)  # Permitir que a UI seja atualizada
```

</section>

<section title="Validar ações antes da execução">

Verifique se as ações solicitadas são seguras e válidas:
```python
def validate_action(action_type, params):
    if action_type == "left_click":
        x, y = params.get("coordinate", (0, 0))
        if not (0 <= x < display_width and 0 <= y < display_height):
            return False, "Coordinates out of bounds"
    return True, None
```

</section>

<section title="Registrar ações para depuração">

Mantenha um registro de todas as ações para solução de problemas:
```python
import logging

def log_action(action_type, params, result):
    logging.info(f"Action: {action_type}, Params: {params}, Result: {result}")
```

</section>

---

## Entender as limitações do uso de computador

A funcionalidade de uso de computador está em beta. Embora as capacidades do Claude sejam de ponta, os desenvolvedores devem estar cientes de suas limitações:

1. **Latência**: a latência atual de uso de computador para interações humano-IA pode ser muito lenta em comparação com ações de computador direcionadas por humanos regulares. Recomendamos focar em casos de uso onde a velocidade não é crítica (por exemplo, coleta de informações em segundo plano, testes automatizados de software) em ambientes confiáveis.
2. **Precisão e confiabilidade da visão computacional**: Claude pode cometer erros ou alucinar ao gerar coordenadas específicas enquanto gera ações. Claude Sonnet 3.7 introduz a capacidade de pensamento que pode ajudá-lo a entender o raciocínio do modelo e identificar possíveis problemas.
3. **Precisão e confiabilidade da seleção de ferramentas**: Claude pode cometer erros ou alucinar ao selecionar ferramentas enquanto gera ações ou tomar ações inesperadas para resolver problemas. Além disso, a confiabilidade pode ser menor ao interagir com aplicações de nicho ou múltiplas aplicações ao mesmo tempo. Recomendamos que os usuários solicitem o modelo com cuidado ao solicitar tarefas complexas.
4. **Confiabilidade de rolagem**: Claude Sonnet 3.7 introduziu ações de rolagem dedicadas com controle de direção que melhora a confiabilidade. O modelo agora pode rolar explicitamente em qualquer direção (para cima/para baixo/esquerda/direita) por uma quantidade especificada.
5. **Interação com planilhas**: Cliques do mouse para interação com planilhas melhoraram no Claude Sonnet 3.7 com a adição de ações de controle de mouse mais precisas como `left_mouse_down`, `left_mouse_up` e novo suporte a teclas modificadoras. A seleção de células pode ser mais confiável usando esses controles granulares e combinando teclas modificadoras com cliques.
6. **Criação de conta e geração de conteúdo em plataformas sociais e de comunicação**: Embora Claude visite sites, estamos limitando sua capacidade de criar contas ou gerar e compartilhar conteúdo ou de outra forma se envolver em representação humana em sites e plataformas de mídia social. Podemos atualizar essa capacidade no futuro.
7. **Vulnerabilidades**: Vulnerabilidades como jailbreaking ou injeção de prompt podem persistir em sistemas de IA de fronteira, incluindo a API beta de uso de computador. Em algumas circunstâncias, Claude seguirá comandos encontrados em conteúdo, às vezes até em conflito com as instruções do usuário. Por exemplo, instruções do Claude em páginas da web ou contidas em imagens podem substituir instruções ou fazer com que Claude cometa erros. Recomendamos:
   a. Limitar o uso de computador a ambientes confiáveis, como máquinas virtuais ou contêineres com privilégios mínimos
   b. Evitar dar acesso de uso de computador a contas ou dados sensíveis sem supervisão rigorosa
   c. Informar os usuários finais sobre riscos relevantes e obter seu consentimento antes de ativar ou solicitar permissões necessárias para recursos de uso de computador em seus aplicativos
8. **Ações inadequadas ou ilegais**: De acordo com os termos de serviço da Anthropic, você não deve usar o uso de computador para violar nenhuma lei ou nossa Política de Uso Aceitável.

Sempre revise e verifique cuidadosamente as ações e logs de uso de computador do Claude. Não use Claude para tarefas que exigem precisão perfeita ou informações sensíveis do usuário sem supervisão humana.

---

## Preços

Computer use follows the standard [tool use pricing](/docs/en/agents-and-tools/tool-use/overview#pricing). When using the computer use tool:

**System prompt overhead**: The computer use beta adds 466-499 tokens to the system prompt

**Computer use tool token usage**:
| Model | Input tokens per tool definition |
| ----- | -------------------------------- |
| Claude 4.x models | 735 tokens |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations)) | 735 tokens |

**Additional token consumption**:
- Screenshot images (see [Vision pricing](/docs/en/build-with-claude/vision))
- Tool execution results returned to Claude

<Note>
If you're also using bash or text editor tools alongside computer use, those tools have their own token costs as documented in their respective pages.
</Note>

## Próximas etapas

<CardGroup cols={2}>
  <Card
    title="Implementação de referência"
    icon="github-logo"
    href="https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo"
  >
    Comece rapidamente com nossa implementação completa baseada em Docker
  </Card>
  <Card
    title="Documentação da ferramenta"
    icon="tool"
    href="/docs/pt-BR/agents-and-tools/tool-use/overview"
  >
    Saiba mais sobre uso de ferramentas e criação de ferramentas personalizadas
  </Card>
</CardGroup>