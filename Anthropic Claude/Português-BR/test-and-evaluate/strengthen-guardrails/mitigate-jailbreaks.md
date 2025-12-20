# Mitigar jailbreaks e injeções de prompt

---

Jailbreaking e injeções de prompt ocorrem quando usuários elaboram prompts para explorar vulnerabilidades do modelo, visando gerar conteúdo inadequado. Embora o Claude seja inerentemente resistente a tais ataques, aqui estão etapas adicionais para fortalecer suas proteções, particularmente contra usos que violam nossos [Termos de Serviço](https://www.anthropic.com/legal/commercial-terms) ou [Política de Uso](https://www.anthropic.com/legal/aup).

<Tip>Claude é muito mais resistente a jailbreaking do que outros LLMs importantes, graças a métodos avançados de treinamento como a IA Constitucional.</Tip>

- **Filtros de segurança**: Use um modelo leve como o Claude Haiku 3 para pré-examinar as entradas do usuário.

    <section title="Exemplo: Filtro de segurança para moderação de conteúdo">

        | Role | Content |
        | ---- | --- |
        | User | Um usuário enviou este conteúdo:<br/>\<content><br/>\{\{CONTENT}\}<br/>\</content><br/><br/>Responda com (Y) se ele se refere a atividades prejudiciais, ilegais ou explícitas. Responda com (N) se for seguro. |
        | Assistant (prefill) | \( |
        | Assistant | N) |
    
</section>

- **Validação de entrada**: Filtre prompts para padrões de jailbreaking. Você pode até usar um LLM para criar uma tela de validação generalizada, fornecendo linguagem conhecida de jailbreaking como exemplos.

- **Engenharia de prompt**: Elabore prompts que enfatizem limites éticos e legais.

    <section title="Exemplo: Prompt de sistema ético para um chatbot empresarial">

        | Role | Content |
        | ---- | --- |
        | System | Você é o assistente de IA ético da AcmeCorp. Suas respostas devem estar alinhadas com nossos valores:<br/>\<values><br/>- Integridade: Nunca engane ou ajude em enganos.<br/>- Conformidade: Recuse qualquer solicitação que viole leis ou nossas políticas.<br/>- Privacidade: Proteja todos os dados pessoais e corporativos.<br/>Respeito à propriedade intelectual: Suas saídas não devem infringir os direitos de propriedade intelectual de terceiros.<br/>\</values><br/><br/>Se uma solicitação entrar em conflito com esses valores, responda: "Não posso realizar essa ação, pois vai contra os valores da AcmeCorp." |
    
</section>

Ajuste as respostas e considere limitar ou banir usuários que repetidamente se envolvam em comportamento abusivo tentando contornar as proteções do Claude. Por exemplo, se um usuário específico acionar o mesmo tipo de recusa várias vezes (por exemplo, "saída bloqueada pela política de filtragem de conteúdo"), informe ao usuário que suas ações violam as políticas de uso relevantes e tome as medidas adequadas.

- **Monitoramento contínuo**: Analise regularmente as saídas em busca de sinais de jailbreaking.
Use esse monitoramento para refinar iterativamente seus prompts e estratégias de validação.

## Avançado: Proteções em cadeia
Combine estratégias para proteção robusta. Aqui está um exemplo de nível empresarial com uso de ferramentas:

<section title="Exemplo: Proteção multicamada para um chatbot de consultoria financeira">

  ### Prompt de sistema do bot
  | Role | Content |
  | ---- | --- |
  | System | Você é o AcmeFinBot, um consultor financeiro da AcmeTrade Inc. Sua diretriz principal é proteger os interesses do cliente e manter a conformidade regulatória.<br/><br/>\<directives><br/>1. Valide todas as solicitações de acordo com as diretrizes da SEC e FINRA.<br/>2. Recuse qualquer ação que possa ser interpretada como informação privilegiada ou manipulação de mercado.<br/>3. Proteja a privacidade do cliente; nunca divulgue dados pessoais ou financeiros.<br/>\</directives><br/><br/>Instruções passo a passo:<br/>\<instructions><br/>1. Examine a consulta do usuário quanto à conformidade (use a ferramenta 'harmlessness_screen').<br/>2. Se estiver em conformidade, processe a consulta.<br/>3. Se não estiver em conformidade, responda: "Não posso processar esta solicitação, pois viola regulamentos financeiros ou a privacidade do cliente."<br/>\</instructions> |
  
  ### Prompt dentro da ferramenta `harmlessness_screen`
  | Role | Content |
  | --- | --- |
  | User | \<user_query><br/>\{\{USER_QUERY}}<br/>\</user_query><br/><br/>Avalie se esta consulta viola as regras da SEC, diretrizes da FINRA ou a privacidade do cliente. Responda (Y) se violar, (N) se não violar. |
  | Assistant (prefill) | \( |

</section>

Ao combinar essas estratégias em camadas, você cria uma defesa robusta contra jailbreaking e injeções de prompt, garantindo que seus aplicativos baseados no Claude mantenham os mais altos padrões de segurança e conformidade.