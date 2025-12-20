# Encadeie prompts complexos para um desempenho mais forte

Aprenda como quebrar tarefas complexas em subtarefas menores e gerenciáveis usando encadeamento de prompts para melhorar a precisão e clareza.

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

Ao trabalhar com tarefas complexas, Claude às vezes pode falhar se você tentar lidar com tudo em um único prompt. O encadeamento de pensamento (CoT) é ótimo, mas e se sua tarefa tiver múltiplas etapas distintas que cada uma exija pensamento aprofundado?

Entra o encadeamento de prompts: quebrar tarefas complexas em subtarefas menores e gerenciáveis.

## Por que encadear prompts?

1. **Precisão**: Cada subtarefa recebe toda a atenção de Claude, reduzindo erros.
2. **Clareza**: Subtarefas mais simples significam instruções e saídas mais claras.
3. **Rastreabilidade**: Identifique e corrija facilmente problemas em sua cadeia de prompts.

***

## Quando encadear prompts

Use encadeamento de prompts para tarefas com múltiplas etapas, como síntese de pesquisa, análise de documentos ou criação de conteúdo iterativa. Quando uma tarefa envolve múltiplas transformações, citações ou instruções, o encadeamento evita que Claude deixe de lado ou manipule mal as etapas.

**Lembre-se:** Cada elo na cadeia recebe toda a atenção de Claude!

<Tip>**Dica de depuração**: Se Claude perder uma etapa ou tiver desempenho ruim, isole essa etapa em seu próprio prompt. Isso permite que você ajuste as etapas problemáticas sem refazer toda a tarefa.</Tip>

***

## Como encadear prompts

1. **Identifique subtarefas**: Divida sua tarefa em etapas distintas e sequenciais.
2. **Estruture com XML para transições claras**: Use tags XML para passar saídas entre prompts.
3. **Tenha um objetivo de tarefa única**: Cada subtarefa deve ter um objetivo único e claro.
4. **Itere**: Refine subtarefas com base no desempenho de Claude.

### Exemplo de fluxos de trabalho encadeados:
- **Análise em múltiplas etapas**: Veja os exemplos legais e comerciais abaixo.
- **Pipelines de criação de conteúdo**: Pesquisa → Esboço → Rascunho → Edição → Formatação.
- **Processamento de dados**: Extrair → Transformar → Analisar → Visualizar.
- **Tomada de decisão**: Coletar informações → Listar opções → Analisar cada uma → Recomendar.
- **Loops de verificação**: Gerar conteúdo → Revisar → Refinar → Revisar novamente.

<Tip>**Dica de otimização**: Para tarefas com subtarefas independentes (como analisar múltiplos documentos), crie prompts separados e execute-os em paralelo para maior velocidade.</Tip>

### Avançado: Cadeias de autocorreção

Você pode encadear prompts para que Claude revise seu próprio trabalho! Isso detecta erros e refina saídas, especialmente para tarefas de alto risco.

  <section title="Exemplo: Resumo de pesquisa com autocorreção">

    #### Prompt 1
    | Função | Conteúdo |
    | ---- | ------- |
    | Usuário | Resuma este artigo de pesquisa médica.<br/><br/>\\{\{RESEARCH_PAPER}}\</paper><br/><br/>Concentre-se em metodologia, descobertas e implicações clínicas. |
    | Assistente<br/>\{\{SUMMARY}} | Metodologia: Ensaio clínico randomizado duplo-cego com 500 pacientes com diabetes tipo 2. Grupo A (n=250) recebeu um novo agonista duplo GLP-1/GIP; Grupo B (n=250) recebeu um agonista GLP-1 padrão. Ensaio de 24 semanas, desfecho primário: redução de HbA1c.<br/><br/>Descobertas:<br/>- Grupo A: redução média de HbA1c de 1,8%<br/>- Grupo B: redução média de HbA1c de 1,1%<br/>- 68% do Grupo A vs. 52% do Grupo B atingiram HbA1c \<7%<br/>- Grupo A: perda de peso média de 5,2kg<br/>- Grupo B: perda de peso média de 3,1kg<br/><br/>Segurança: Perfis de eventos adversos semelhantes, sem eventos sérios atribuídos ao tratamento.<br/><br/>Implicações Clínicas: O agonista duplo mostra controle glicêmico superior e perda de peso em comparação com a terapia padrão. Poderia ser uma mudança de jogo, especialmente para diabéticos obesos. |
    
    #### Prompt 2
    | Função | Conteúdo |
    | ---- | ------- |
    | Usuário | Sua tarefa é fornecer feedback sobre um resumo de artigo de pesquisa. Aqui está um resumo de um artigo de pesquisa médica:<br/>\<summary><br/>\{\{SUMMARY\}\}<br/>\</summary><br/><br/>Aqui está o artigo de pesquisa:<br/>\<br/>\{\{RESEARCH_PAPER\}\}<br/>\</paper><br/><br/>Revise este resumo quanto à precisão, clareza e completude em uma escala de A a F. |
    | Assistente<br/>\{\{FEEDBACK}} | 1. Precisão: A<br/>   - Relatou corretamente as estatísticas-chave: reduções de HbA1c, perda de peso.<br/>   - Anotou com precisão o perfil de segurança e a falta de eventos adversos sérios.<br/>   - A afirmação de "mudança de jogo" é justificada por resultados significativamente melhores.<br/><br/>2. Clareza: A-<br/>   - Conciso e bem estruturado com seções claras.<br/>   - Bom uso de linguagem comparativa (por exemplo, "acima de 3% do Q1") para contexto.<br/>   - Problema menor: Acrônimos como "RCT", "GLP-1" e "GIP" não definidos. Considere soletrar no primeiro uso.<br/><br/>3. Completude: B+<br/>   - Cobre todas as áreas solicitadas: metodologia, descobertas, implicações clínicas.<br/>   - Faltando: Características basais dos grupos (foram bem pareados?).<br/>   - Faltando: Qualquer desfecho secundário (por exemplo, pressão arterial, lipídios).<br/>   - Considere: Implicações de longo prazo ou necessidade de pesquisa adicional.<br/><br/>No geral, o resumo é preciso e claro, fornecendo insights-chave para uma compreensão rápida do estudo. Para elevar a A+, defina acrônimos, mencione estatísticas basais do grupo, observe quaisquer resultados secundários e toque brevemente na necessidade de estudos de longo prazo. |
    
     #### Prompt 3
    | Função | Conteúdo |
    | ---- | ------- |
    | Usuário | Sua tarefa é melhorar um resumo de artigo dado feedback. Aqui está o primeiro rascunho de um artigo de pesquisa médica:<br/>\<summary><br/>\{\{SUMMARY\}\}<br/>\</summary><br/><br/>Aqui está o artigo de pesquisa:<br/>\<br/>\{\{RESEARCH_PAPER\}\}<br/>\</paper><br/><br/>Aqui está o feedback:<br/>\<feedback><br/>\{\{FEEDBACK\}\}<br/>\</feedback><br/><br/>Atualize o resumo com base no feedback. |
    | Assistente | Metodologia: Ensaio clínico randomizado duplo-cego (RCT) com 500 pacientes com diabetes tipo 2. Grupo A (n=250) recebeu um novo agonista duplo peptídeo-1 semelhante ao glucagon/polipeptídio insulinotrópico dependente de glicose (GLP-1/GIP); Grupo B (n=250) recebeu um agonista GLP-1 padrão. O desfecho primário do ensaio de 24 semanas foi redução de HbA1c. Os grupos foram bem pareados para idade, IMC e HbA1c basal.<br/><br/>Descobertas:<br/>- Grupo A: redução média de HbA1c de 1,8%<br/>- Grupo B: redução média de HbA1c de 1,1%<br/>- 68% do Grupo A vs. 52% do Grupo B atingiram HbA1c \<7%<br/>- Grupo A: perda de peso média de 5,2kg<br/>- Grupo B: perda de peso média de 3,1kg<br/><br/>Os desfechos secundários mostraram melhorias na pressão arterial e perfis lipídicos para ambos os grupos, com o Grupo A mostrando resultados ligeiramente melhores.<br/><br/>Segurança: Perfis de eventos adversos semelhantes, sem eventos sérios atribuídos a nenhum dos tratamentos.<br/><br/>Implicações Clínicas: O agonista duplo GLP-1/GIP demonstra controle glicêmico superior e perda de peso em comparação com a terapia GLP-1 padrão. Esses resultados sugerem que poderia ser um avanço significativo, particularmente para diabéticos obesos. No entanto, estudos de longo prazo são necessários para confirmar a eficácia e segurança sustentadas, bem como investigar possíveis benefícios nos resultados cardiovasculares. |
  
</section>

***

## Exemplos

  <section title="Exemplo: Analisando um contrato legal (sem encadeamento)">

    Observe que Claude perde a instrução de fornecer mudanças propostas em seu rascunho de email.

    | Função | Conteúdo |
    | ---- | ------- |
    | Usuário | Você é nosso Diretor Jurídico. Revise este contrato SaaS quanto a riscos, focando em privacidade de dados, SLAs e limites de responsabilidade.<br/><br/>\<contract><br/>\{\{CONTRACT}}<br/>\</contract><br/><br/>Em seguida, redija um email para o fornecedor com suas preocupações e mudanças propostas. |
    | Assistente | Após revisar o contrato SaaS, identifiquei várias preocupações:<br/><br/>1. Privacidade de Dados (Seção 7):<br/>   - Problema: O fornecedor tem amplos direitos de usar dados do cliente para "melhoria de serviço".<br/>   - Risco: Poderia levar a compartilhamento de dados não autorizado ou monetização.<br/><br/>2. SLAs (Seção 5):<br/>   - Problema: Garantia de tempo de atividade de 99,5% está abaixo do padrão da indústria.<br/>   - Risco: Tempo de inatividade excessivo poderia impactar nossas operações.<br/><br/>3. Responsabilidade (Seção 9):<br/>   - Problema: Limite definido em 3 meses de taxas.<br/>   - Risco: Inadequado para possíveis violações de dados ou falhas de serviço.<br/><br/>Rascunho de email:<br/><br/>Caro \{\{VENDOR}},<br/><br/>Após revisar o acordo SaaS, temos preocupações:<br/><br/>1. Privacidade de Dados: Exigimos que nossos dados sejam usados apenas para prestação direta de serviços, não para ampla "melhoria de serviço". Por favor, altere a Seção 7.<br/><br/>2. SLAs: Tempo de atividade de 99,5% é insuficiente. Precisamos de 99,99% com penalidades claramente definidas. Por favor, revise a Seção 5.<br/><br/>3. Responsabilidade: O limite atual de 3 meses de taxas é inadequado. Propomos um limite de 12 meses de taxas, sem limite para violações de dados ou má conduta intencional.<br/><br/>Valorizamos nossa possível parceria e acreditamos que essas mudanças nos prepararão para o sucesso. Por favor, envie um acordo revisado.<br/><br/>Atenciosamente,<br/>\{\{CLO_NAME}} |
  
</section>

  <section title="Exemplo: Analisando um contrato legal (com encadeamento)">

    #### Prompt 1    
    | Função | Conteúdo |
    | ---- | ------- |
    | Usuário | Você é nosso Diretor Jurídico. Revise este contrato SaaS quanto a riscos, focando em privacidade de dados, SLAs e limites de responsabilidade.<br/><br/>\<contract><br/>\{\{CONTRACT}}<br/>\</contract><br/><br/>Produza suas descobertas em tags \<risks>. |
    | Assistente<br/>\{\{CONCERNS}} | 1. Privacidade de Dados (Seção 7):<br/>   - Problema: O fornecedor tem amplos direitos de usar dados do cliente para "melhoria de serviço".<br/>   - Risco: Poderia levar a compartilhamento de dados não autorizado ou monetização de dados do cliente.<br/>   - Impacto: Possível violação da confiança do cliente, multas regulatórias (GDPR, CCPA).<br/><br/>2. SLAs (Seção 5):<br/>   - Problema: Garantia de tempo de atividade de 99,5% está abaixo do padrão da indústria (tipicamente 99,99%).<br/>   - Risco: Até 43,8 horas de tempo de inatividade por ano vs. 52,6 minutos em 99,99%.<br/>   - Impacto: Interrupções operacionais, perda de receita, insatisfação do cliente.<br/><br/>3. Responsabilidade (Seção 9):<br/>   - Problema: Limite de responsabilidade definido em 3 meses de taxas.<br/>   - Risco: Inadequado para possíveis violações de dados, roubo de PI ou falhas de serviço prolongadas.<br/>   - Impacto: Compensação insuficiente para danos que poderiam exceder muito o limite, como ações coletivas ou multas regulatórias. |
    
    #### Prompt 2    
    | Função | Conteúdo |
    | ---- | ------- |
    | Usuário | Redija um email para um fornecedor de produto SaaS descrevendo as seguintes preocupações e propondo mudanças. Aqui estão as preocupações:<br/>\<concerns><br/>\{\{CONCERNS\}\}<br/>\</concerns><br/><br/>|
    | Assistente<br/>\{\{EMAIL}} | Caro \{\{VENDOR}},<br/><br/>Após uma revisão completa do acordo SaaS proposto, nossa equipe jurídica identificou várias preocupações de alta prioridade que devem ser abordadas antes de prosseguirmos:<br/><br/>1. Privacidade de Dados (Seção 7):<br/>   - Atual: Amplos direitos de usar dados do cliente para "melhoria de serviço".<br/>   - Preocupação: Possível compartilhamento de dados não autorizado ou monetização.<br/>   - Mudança Proposta: Limitar o uso de dados à prestação direta de serviços. Qualquer uso para melhoria, análise ou marketing deve ser opt-in, revogável e anonimizado.<br/><br/>2. SLAs (Seção 5):<br/>   - Atual: Garantia de tempo de atividade de 99,5%.<br/>   - Preocupação: Até 43,8 horas de tempo de inatividade por ano, arriscando interrupções operacionais.<br/>   - Mudança Proposta: Tempo de atividade de 99,99% com créditos de serviço em camadas. Por exemplo, crédito de 10% para \<99,99%, 25% para \<99,9%, 50% para \<99,5%.<br/><br/>3. Responsabilidade (Seção 9):<br/>   - Atual: Limite em 3 meses de taxas.<br/>   - Preocupação: Grosseiramente inadequado para violações de dados, roubo de PI ou interrupções prolongadas.<br/>   - Mudança Proposta: 12 meses de taxas para responsabilidade geral. Sem limite para violações de dados, má conduta intencional, infração de PI.<br/><br/>Essas mudanças são inegociáveis para nós. Elas se alinham com os padrões da indústria e nosso compromisso com segurança de dados, excelência operacional e responsabilidade fiduciária. Valorizamos o potencial de nossa parceria, e abordar essas questões estabelecerá uma base sólida.<br/><br/>Por favor, tenha sua equipe jurídica revisar e incorporar essas mudanças. Estamos felizes em discutir mais para garantir compreensão e acordo mútuos.<br/><br/>Atenciosamente,<br/>\{\{CLO_NAME}} |
    
    #### Prompt 3    
    | Função | Conteúdo |
    | ---- | ------- |
    | Usuário | Sua tarefa é revisar um email e fornecer feedback. Aqui está o email:<br/>\<email><br/>\{\{EMAIL\}\}<br/>\</email><br/><br/>Forneça feedback sobre tom, clareza e profissionalismo. |
    | Assistente | 1. Tom:<br/>   - Profissional e assertivo sem ser confrontacional.<br/>   - O uso de "inegociável" é forte mas justificado dada a criticidade dos problemas.<br/>   - Linguagem colaborativa ("valorizamos", "felizes em discutir") equilibra a firmeza, mantendo um tom construtivo.<br/><br/>2. Clareza:<br/>   - Estruturação excelente: estado atual, preocupação e mudança proposta para cada problema.<br/>   - Termos técnicos (por exemplo, "EBITDA", "créditos de serviço em camadas") são apropriados para um contexto B2B SaaS.<br/>   - Itens de ação são claros: equipe jurídica do fornecedor para revisar e incorporar mudanças.<br/><br/>3. Profissionalismo:<br/>   - Concentra-se no benefício mútuo e padrões da indústria, não apenas em nossas demandas.<br/>   - Menciona responsabilidades mais amplas (segurança de dados, excelência operacional, dever fiduciário), elevando a discussão.<br/>   - Oferece discussão adicional, mostrando compromisso em entender e resolver problemas.<br/><br/>No geral, o email atinge o equilíbrio certo entre assertividade e colaboração. Articula claramente nossas preocupações, propõe soluções específicas e mantém um tom profissional e orientado para parceria. Nenhuma revisão necessária; proceda com o envio. |
  
</section>
  <section title="Exemplo: Revisão de estratégia de multitenancy">

    #### Prompt 1    
    | Função | Conteúdo |
    | ---- | ------- |
    | Usuário | Como arquiteto sênior de soluções, revise e analise esta estratégia de multitenancy para nosso novo produto SaaS empresarial.<br/><br/>\<strategy><br/>\{\{STRATEGY}}<br/>\</strategy><br/><br/>Concentre-se em escalabilidade, segurança e custo-efetividade. |
    | Assistente<br/>\{\{ANALYSIS}} | 1. Escalabilidade:<br/>   + Fragmentação de banco de dados por locatário reduz contenção, suporta crescimento alto.<br/>   + Microsserviços permitem dimensionamento independente de componentes.<br/>   - Servidores de aplicativos compartilhados podem criar gargalo sob carga extrema.<br/>   - Nenhuma menção de auto-dimensionamento ou balanceamento de carga para camada de aplicativo.<br/><br/>2. Segurança:<br/>   + Isolamento de dados de locatário via fragmentação mitiga vazamentos de dados.<br/>   + JWT com expiração curta e tokens de atualização é a melhor prática da indústria.<br/>   - Nenhuma menção de criptografia (em repouso, em trânsito) ou gerenciamento de chaves.<br/>   - Estratégia de IAM carece de detalhes sobre funções, permissões ou RBAC.<br/><br/>3. Custo-efetividade:<br/>   + Servidores de aplicativos compartilhados reduzem custos de recursos ociosos.<br/>   + Funções sem servidor para tarefas infrequentes otimizam custos.<br/>   - Banco de dados por locatário poderia aumentar custos em escala vs. banco de dados multi-locatário otimizado.<br/>   - Nenhuma discussão de instâncias reservadas ou instâncias spot para economia de custos. |
    
    #### Prompt 2    
    | Função | Conteúdo |
    | ---- | ------- |
    | Usuário | Redija um documento de revisão de estratégia para liderança de engenharia com base nesta análise de uma estratégia de multitenancy.<br/><br/>\<strategy><br/>\{\{STRATEGY}}<br/>\</strategy><br/><br/>\<analysis><br/>\{\{ANALYSIS}}<br/>\</analysis><br/><br/>Inclua um resumo executivo, análise detalhada e recomendações. |
    | Assistente<br/>\{\{STRATEGY_DOC}} | # Revisão de Estratégia de Multitenancy: Produto SaaS Empresarial<br/><br/>## Resumo Executivo<br/>A estratégia proposta demonstra uma base sólida em princípios de escalabilidade e segurança, mas tem lacunas em detalhes de implementação. Excela em isolamento de dados e dimensionamento em nível de componente, mas carece de dimensionamento robusto de camada de aplicativo e medidas de segurança avançadas. Otimizações de custo estão presentes, mas podem falhar em alta escala. Com aprimoramentos direcionados, essa estratégia pode suportar efetivamente nossas ambições de SaaS empresarial.<br/><br/>## Análise Detalhada<br/><br/>### 1. Escalabilidade: B+<br/><br/>Pontos Fortes:<br/>- Fragmentação de banco de dados por locatário é excelente. Minimiza latência de consulta, suporta crescimento de dados alto e facilita dimensionamento contínuo por locatário.<br/>- Arquitetura de microsserviços permite dimensionar componentes individuais com base na demanda, crucial para lidar com cargas de trabalho empresariais diversas.<br/><br/>Pontos Fracos:<br/>- Servidores de aplicativos compartilhados arriscam se tornar um gargalo. Conforme a contagem de locatários e o tráfego crescem, estes poderiam degradar o desempenho em todos os locatários.<br/>- Ausência de auto-dimensionamento e balanceamento de carga para a camada de aplicativo é uma omissão crítica. Estes são essenciais para lidar com picos de tráfego sem sobre-provisionamento.<br/><br/>### 2. Segurança: B-<br/><br/>Pontos Fortes:<br/>- Bancos de dados fragmentados fornecem isolamento forte de dados de locatário, mitigando riscos de vazamentos de dados ou acesso não autorizado entre locatários.<br/>- JWT com expiração curta e tokens de atualização se alinham com as melhores práticas OWASP, reduzindo janelas de vulnerabilidade de token.<br/><br/>Pontos Fracos:<br/>- Nenhuma menção de criptografia de dados em repouso ou em trânsito (TLS 1.3). Isso é inegociável para dados empresariais.<br/>- Estratégia de gerenciamento de chaves está faltando. Como são gerenciadas e rotacionadas chaves de criptografia, segredos JWT e credenciais de BD?<br/>- IAM carece de profundidade. Precisamos de RBAC com funções bem definidas, controle de acesso baseado em atributos (ABAC) para permissões granulares e integração com provedores de identidade empresariais (SAML, OIDC).<br/><br/>### 3. Custo-efetividade: B<br/><br/>Pontos Fortes:<br/>- Servidores de aplicativos compartilhados reduzem custos de capacidade ociosa, bom para tráfego em estado estável.<br/>- Sem servidor para tarefas infrequentes (por exemplo, relatórios) é inteligente; pague apenas quando esses recursos são usados.<br/><br/>Pontos Fracos:<br/>- Bancos de dados por locatário podem não ser custo-efetivos em escala em comparação com um banco de dados multi-locatário bem projetado com particionamento robusto de dados.<br/>- Nenhuma menção de medidas de economia de custos como instâncias reservadas para cargas de trabalho previsíveis ou instâncias spot para tarefas tolerantes a falhas.<br/>- Falta de auto-dimensionamento de camada de aplicativo poderia levar a sobre-provisionamento, aumentando custos.<br/><br/>## Recomendações<br/><br/>1. **Resiliência de Camada de Aplicativo**: Implemente auto-dimensionamento com Kubernetes ou serviços nativos de nuvem (EKS, GKE). Implante em zonas de disponibilidade com CDN para ativos estáticos.<br/><br/>2. **Endurecimento de Segurança**:<br/>   a. Criptografe dados em repouso (AES-256) e em trânsito (TLS 1.3).<br/>   b. Use um KMS gerenciado (AWS KMS, GCP KMS) para gerenciamento de chaves.<br/>   c. Melhore IAM com RBAC, ABAC e SAML/OIDC para SSO empresarial.<br/><br/>3. **Otimização de Custos**:<br/>   a. Avalie banco de dados multi-locatário colunar (por exemplo, Snowflake) vs. fragmentação em escala.<br/>   b. Use instâncias reservadas para servidores de aplicativos, instâncias spot para cargas de trabalho não críticas.<br/>   c. Implemente monitoramento proativo e dimensionamento correto para evitar sobre-provisionamento.<br/><br/>4. **Prova de Conceito (PoC)**: Antes da implementação completa, conduza uma PoC com simulação de alta escala:<br/>   a. Teste banco de dados fragmentado vs. banco de dados multi-locatário otimizado para custo e desempenho.<br/>   b. Teste de carga da camada de aplicativo com tráfego simulado em nível empresarial.<br/>   c. Conduza auditoria de segurança de terceiros, focando em isolamento de dados e controles de acesso.<br/><br/>Com esses aprimoramentos, nossa estratégia de multi-tenancy será de nível empresarial: escalável, segura e custo-efetiva. A PoC validará nossas escolhas de design e instilará confiança em nossos clientes empresariais. |
    
    #### Prompt 3    
    | Função | Conteúdo |
    | ---- | ------- |
    | Usuário | Classifique este documento de revisão de estratégia quanto a clareza, acionabilidade e alinhamento com prioridades empresariais. <br/><br/>\<br/>\{\{PRIORITIES}}<br/>\</priorities><br/><br/>\<strategy_doc><br/>\{\{STRATEGY_DOC}}<br/>\</strategy_doc> |
    | Assistente | 1. Clareza: A<br/>   + Estrutura clara com Resumo Executivo, Análise Detalhada e Recomendações.<br/>   + Análise usa um sistema de classificação (B+, B-) para compreensão rápida de pontos fortes/fracos.<br/>   + Termos técnicos (RBAC, ABAC, TLS) são explicados ou contextualizados, ajudando liderança não técnica.<br/>   + Auxílios visuais (pontos de bala, indentação) melhoram legibilidade.<br/><br/>2. Acionabilidade: A-<br/>   + Recomendações são específicas e técnicas (por exemplo, "Implemente auto-dimensionamento com Kubernetes").<br/>   + Plano de PoC com objetivos claros fornece um roteiro.<br/>   + Faltando: Cronogramas, requisitos de recursos ou atribuições de equipe para cada recomendação.<br/>   + Considere: Adicione uma seção "Próximos Passos" com ações imediatas, funções e cronograma de alto nível.<br/><br/>3. Alinhamento Empresarial: A+<br/>   + Aborda diretamente prioridades empresariais:<br/>     - Escalabilidade: Discute lidar com picos de tráfego em nível empresarial.<br/>     - Segurança: Concentra-se em isolamento de dados, criptografia e IAM empresarial.<br/>     - Custo: Estratégias se alinham com FinOps empresarial (instâncias reservadas, dimensionamento correto).<br/>   + PoC com "simulação de alta escala" e auditoria de segurança mostra compromisso com qualidade de nível empresarial.<br/>   + Linguagem ressoa com preocupações empresariais: "risco inaceitável", "nível empresarial", "instila confiança".<br/><br/>No geral, o documento excela em clareza e alinhamento empresarial. A acionabilidade é forte, mas poderia ser elevada a A+ com uma seção "Próximos Passos". A profundidade técnica, acoplada com explicações claras, torna isso altamente efetivo para liderança técnica e não técnica. Ótimo trabalho! |
  
</section>

***

<CardGroup cols={3}>
  <Card title="Biblioteca de prompts" icon="link" href="/docs/pt-BR/resources/prompt-library/library">
    Obtenha inspiração de uma seleção curada de prompts para várias tarefas e casos de uso.
  </Card>
  <Card title="Tutorial de prompting do GitHub" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    Um tutorial repleto de exemplos que cobre os conceitos de engenharia de prompts encontrados em nossa documentação.
  </Card>
  <Card title="Tutorial de prompting do Google Sheets" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    Uma versão mais leve de nosso tutorial de engenharia de prompts via uma planilha interativa.
  </Card>
</CardGroup>