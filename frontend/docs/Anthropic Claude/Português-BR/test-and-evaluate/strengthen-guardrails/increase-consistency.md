# Aumentar a consistência da saída

Como fazer as respostas do Claude mais consistentes

---

<Tip>
**Para conformidade garantida com esquema JSON**

Se você precisa que Claude sempre produza JSON válido que esteja em conformidade com um esquema específico, use [Structured Outputs](/docs/pt-BR/build-with-claude/structured-outputs) em vez das técnicas de engenharia de prompt abaixo. Structured outputs fornecem conformidade de esquema garantida e são especificamente projetados para este caso de uso.

As técnicas abaixo são úteis para consistência geral de saída ou quando você precisa de flexibilidade além de esquemas JSON rigorosos.
</Tip>

Aqui está como tornar as respostas do Claude mais consistentes:

## Especifique o formato de saída desejado
Defina com precisão seu formato de saída desejado usando JSON, XML ou modelos personalizados para que Claude entenda cada elemento de formatação de saída que você exige.

<section title="Exemplo: Padronizando feedback de clientes">

    | Role | Content |
    | ---- | ------- |
    | User | Você é uma IA de Insights de Clientes. Analise este feedback e produza em formato JSON com chaves: "sentiment" (positivo/negativo/neutro), "key_issues" (lista) e "action_items" (lista de dicts com "team" e "task").<br/><br/>"Sou um usuário leal há 3 anos, mas a atualização recente da interface é um desastre. Encontrar recursos básicos agora é uma caça ao tesouro. Além disso, o novo preço 'premium' é absurdo. Estou considerando mudar a menos que isso seja corrigido ASAP." |
    | Assistant | \{<br/>  "sentiment": "negative",<br/>  "key_issues": [<br/>    "Poor UI/UX in recent update",<br/>    "Difficulty finding basic features",<br/>    "Perceived high pricing (new 'premium' tier)"<br/>  ],<br/>  "action_items": [<br/>    \{<br/>      "team": "Product",<br/>      "task": "Conduct usability testing and iterate on UI based on findings"<br/>    \},<br/>    \{<br/>      "team": "UX",<br/>      "task": "Create a feature discovery guide or onboarding flow"<br/>    \},<br/>    \{<br/>      "team": "Marketing",<br/>      "task": "Review pricing strategy and communicate value proposition"<br/>    },<br/>    \{<br/>      "team": "Customer Success",<br/>      "task": "Reach out to user, offer concessions to prevent churn"<br/>    \}<br/>  ]<br/>\} |

</section>

## Preencha previamente a resposta do Claude
Preencha previamente o turno `Assistant` com seu formato desejado. Este truque contorna o preâmbulo amigável do Claude e impõe sua estrutura.

<section title="Exemplo: Relatório de vendas diário">

    | Role | Content |
    | ---- | ------- |
    | User | Você é uma IA perspicaz de Inteligência de Vendas. Gere o relatório de vendas de hoje.<br/><br/>Estruture o relatório assim:<br/><br/>\<report><br/>    \<summary><br/>        \<metric name="total_revenue">\$0.00\</metric><br/>        \<metric name="units_sold">0\</metric><br/>        \<metric name="avg_order_value">\$0.00\</metric><br/>    \</summary><br/>    \<top_products><br/>        \<br/>            \<name>Product Name\</name><br/>            \<revenue>\$0.00\</revenue><br/>            \<units>0\</units><br/>        \</product><br/>        ...<br/>    \</top_products><br/>    \<regional_performance><br/>        \<region><br/>            \<name>Region Name\</name><br/>            \<revenue>\$0.00\</revenue><br/>            \<growth>0.0%\</growth><br/>        \</region><br/>        ...<br/>    \</regional_performance><br/>    \<action_items><br/>        \<item>Action item.\</item><br/>        ...<br/>    \</action_items><br/>\</report> |
    | Assistant (prefill) | \<report><br/>    \<summary><br/>        \<metric name= |
    | Assistant | "total_revenue">\$842,567.00\</metric><br/>        \<metric name="units_sold">15,238\</metric><br/>        \<metric name="avg_order_value">\$55.29\</metric><br/>    \</summary><br/>    \<top_products><br/>        \<br/>            \<name>AcmeGuard Pro\</name><br/>            \<revenue>\$325,890.00\</revenue><br/>            \<units>3,621\</units><br/>        \</product><br/>        \<br/>            \<name>AcmeVault Enterprise\</name><br/>            \<revenue>\$254,400.00\</revenue><br/>            \<units>1,272\</units><br/>        \</product><br/>        \<br/>            \<name>AcmeBoost XL\</name><br/>            \<revenue>\$147,690.00\</revenue><br/>            \<units>4,923\</units><br/>        \</product><br/>    \</top_products><br/>    \<regional_performance><br/>        \<region><br/>            \<name>APAC\</name><br/>            \<revenue>\$258,960.00\</revenue><br/>            \<growth>12.8%\</growth><br/>        \</region><br/>        \<region><br/>            \<name>EMEA\</name><br/>            \<revenue>\$325,478.00\</revenue><br/>            \<growth>3.2%\</growth><br/>        \</region><br/>        \<region><br/>            \<name>Americas\</name><br/>            \<revenue>\$258,129.00\</revenue><br/>            \<growth>-2.1%\</growth><br/>        \</region><br/>    \</regional_performance><br/>    \<action_items><br/>        \<item>Investigate Americas revenue drop; schedule regional sales team meeting.\</item><br/>        \<item>Accelerate CloudGuard Pro rollout in APAC to capitalize on growth.\</item><br/>        \<item>Review NetBoost XL pricing; high volume but lower revenue.\</item><br/>    \</action_items><br/>\</report> |

</section>

## Restrinja com exemplos
Forneça exemplos de sua saída desejada. Isso treina a compreensão do Claude melhor do que instruções abstratas.

<section title="Exemplo: Gerando inteligência de mercado consistente">

    | Role | Content |
    | ---- | ------- |
    | User | Como uma IA de Inteligência de Mercado, sua tarefa é analisar dados sobre nossos concorrentes. Aqui estão nossos dados de concorrentes:<br/>\<data><br/>\{\{DATA}}<br/>\</data><br/><br/>Produza seguindo este formato de exemplo:<br/><br/>\<competitor><br/>  \<name>Rival Inc\</name><br/>  \<overview>Um resumo de 50 palavras.\</overview><br/>  \<swot><br/>    \<strengths>- Pontos de bala\</strengths><br/>    \<weaknesses>- Pontos de bala\</weaknesses><br/>    \<opportunities>- Pontos de bala\</opportunities><br/>    \<threats>- Pontos de bala\</threats><br/>  \</swot><br/>  \<strategy>Uma resposta estratégica de 30 palavras.\</strategy><br/>\</competitor><br/><br/>Agora, analise AcmeGiant e AcmeDataCo usando este formato. |
    | Assistant | \<competitor><br/>  \<name>AcmeGiant\</name><br/>  \<overview>Líder global de tecnologia com um vasto ecossistema de produtos de consumidor e empresa. Conhecido por inovação, marca forte e profundo bloqueio de cliente através de hardware, software e serviços integrados.\</overview><br/>  \<swot><br/>    \<strengths><br/>      - Orçamento massivo de P\&D alimenta inovação contínua<br/>      - Base de clientes leal e reconhecimento de marca poderoso<br/>      - Ecossistema de produtos sinérgico aumenta custos de mudança<br/>    \</strengths><br/>    \<weaknesses><br/>      - Preços altos podem afastar clientes sensíveis ao custo<br/>      - Lento para abordar necessidades de personalização específicas da empresa<br/>      - Preocupações com privacidade e escrutínio regulatório em múltiplos mercados<br/>    \</weaknesses><br/>    \<opportunities><br/>      - Demanda crescente por capacidades de IA e ML<br/>      - Expansão em mercados emergentes<br/>      - Aquisições para preencher lacunas de produtos ou talentos<br/>    \</opportunities><br/>    \<threats><br/>      - Ascensão rápida de concorrentes nativos da nuvem<br/>      - Processos antitruste e ações regulatórias<br/>      - Roubo de talentos por startups e concorrentes<br/>    \</threats><br/>  \</swot><br/>  \<strategy>Foque em nossa agilidade e personalização. Direcione a resposta lenta da TechGiant para empresas e problemas de privacidade em nosso marketing.\</strategy><br/>\</competitor><br/><br/>\<competitor><br/>  \<name>AcmeDataCo\</name><br/>  \<overview>Estrela em ascensão em análise de dados e visualização. Oferece ferramentas de BI intuitivas e de autoatendimento com modelo freemium, atraindo startups e equipes empresariais.\</overview><br/>  \<swot><br/>    \<strengths><br/>      - Interface amigável reduz necessidade de treinamento especializado<br/>      - Modelo freemium reduz barreira de entrada, impulsiona crescimento viral<br/>      - Forte ajuste de produto-mercado com ascensão de decisões orientadas por dados<br/>    \</strengths><br/>    \<weaknesses><br/>      - Análise avançada limitada em comparação com ferramentas de BI estabelecidas<br/>      - Problemas de escala relatados com conjuntos de dados muito grandes<br/>      - Dependente de infraestrutura de nuvem de terceiros (AWS)<br/>    \</weaknesses><br/>    \<opportunities><br/>      - Expansão em análise preditiva e insights orientados por IA<br/>      - Formação de alianças estratégicas com fornecedores de tecnologia complementar<br/>      - Painéis personalizáveis para soluções específicas do setor<br/>    \</opportunities><br/>    \<threats><br/>      - Saturação de mercado; muitos novos entrantes em BI de autoatendimento<br/>      - Gigantes de BI empresarial desenvolvendo ferramentas mais amigáveis<br/>      - Regulamentações de privacidade de dados aumentando complexidade de conformidade<br/>    \</threats><br/>  \</swot><br/>  \<strategy>Destaque nossos recursos robustos de empresa e governança de dados. Direcione contas com dificuldades nas limitações de escala da DataCo.\</strategy><br/>\</competitor> |

</section>

## Use recuperação para consistência contextual
Para tarefas que exigem contexto consistente (por exemplo, chatbots, bases de conhecimento), use recuperação para fundamentar as respostas do Claude em um conjunto de informações fixo.

<section title="Exemplo: Melhorando a consistência do suporte de TI">

    | Role | Content |
    | ---- | ------- |
    | User | Você é nossa IA de Suporte de TI que se baseia em dados da base de conhecimento. Aqui estão entradas de sua base de conhecimento:<br/><br/>\<kb><br/>  \<entry><br/>    \<id>1\</id><br/>    \<title>Redefinir senha do Active Directory\</title><br/>    \<content>1. Vá para password.ourcompany.com<br/>2. Digite seu nome de usuário<br/>3. Clique em "Esqueci a Senha"<br/>4. Siga as instruções de email\</content><br/>  \</entry><br/>  \<entry><br/>    \<id>2\</id><br/>    \<title>Conectar à VPN\</title><br/>    \<content>1. Instale GlobalProtect do centro de software<br/>2. Abra GlobalProtect, digite "vpn.ourcompany.com"<br/>3. Use credenciais de AD para fazer login\</content><br/>  \</entry><br/>\</kb><br/><br/>Ao ajudar usuários, sempre verifique a base de conhecimento primeiro. Responda neste formato:<br/><br/>\<response><br/>  \<kb_entry>Entrada da base de conhecimento usada\</kb_entry><br/>  \<answer>Sua resposta\</answer><br/>\</response> Escreva algumas perguntas de teste para você mesmo e responda-as usando a base de conhecimento, apenas para ter certeza de que você entende como usar a base de conhecimento corretamente. |
    | Assistant | Entendido. Usarei a base de conhecimento para respostas consistentes. Vamos testar com alguns cenários.<br/><br/>Usuário: Ei, não consigo fazer login no meu email. Acho que esqueci minha senha.<br/><br/>\<response><br/>  \<kb_entry>1: Redefinir senha do Active Directory\</entry><br/>  \<answer>Entendo que você está tendo dificuldade em fazer login no seu email devido a uma senha esquecida. Sem problemas, este é um problema comum. Para redefinir sua senha do Active Directory, que é usada para acesso ao email, siga estas etapas:<br/><br/>1. Vá para password.ourcompany.com<br/>2. Digite seu nome de usuário (igual ao seu endereço de email)<br/>3. Clique no link "Esqueci a Senha"<br/>4. Você receberá um email com instruções. Siga-as para redefinir sua senha.<br/><br/>Após redefinir, você deve conseguir fazer login no seu email. Avise-me se precisar de mais assistência.\</answer><br/>\</response><br/><br/>Usuário: Estou trabalhando em casa hoje. Como acesso recursos internos?<br/><br/>\<response><br/>  \<kb_entry>2: Conectar à VPN\</entry><br/>  \<answer>Ótima pergunta! Para acessar recursos internos enquanto trabalha em casa, você precisará se conectar à VPN (Rede Privada Virtual) da nossa empresa. Aqui está como configurar isso:<br/><br/>1. Primeiro, instale o cliente VPN GlobalProtect. Você pode encontrar isso em nosso centro de software.<br/>2. Depois de instalado, abra o aplicativo GlobalProtect.<br/>3. No campo de servidor, digite "vpn.ourcompany.com".<br/>4. Use suas credenciais do Active Directory (AD) para fazer login - o mesmo nome de usuário e senha que você usa para seu email.<br/><br/>Uma vez conectado, você terá acesso seguro a todos os recursos internos como se estivesse no escritório. Avise-me se encontrar algum problema durante a configuração.\</answer><br/>\</response> |

</section>

## Encadeie prompts para tarefas complexas
Divida tarefas complexas em subtarefas menores e consistentes. Cada subtarefa recebe a atenção total do Claude, reduzindo erros de inconsistência em fluxos de trabalho em escala.