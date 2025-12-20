# Seja claro, direto e detalhado

Como ser claro, contextual e específico ao interagir com Claude

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

Ao interagir com Claude, pense nele como um funcionário brilhante mas muito novo (com amnésia) que precisa de instruções explícitas. Como qualquer funcionário novo, Claude não tem contexto sobre suas normas, estilos, diretrizes ou formas preferidas de trabalho.
Quanto mais precisamente você explicar o que deseja, melhor será a resposta de Claude.

<Tip>**A regra de ouro da prompting clara**<br/>Mostre seu prompt a um colega, idealmente alguém que tenha contexto mínimo sobre a tarefa, e peça-lhe que siga as instruções. Se ele ficar confuso, Claude provavelmente também ficará.</Tip>

## Como ser claro, contextual e específico

- **Forneça a Claude informações contextuais:** Assim como você pode ter um desempenho melhor em uma tarefa se soubesse mais contexto, Claude terá um desempenho melhor se tiver mais informações contextuais. Alguns exemplos de informações contextuais:
    - Para que os resultados da tarefa serão usados
    - Qual é o público-alvo da saída
    - Qual fluxo de trabalho a tarefa faz parte e onde essa tarefa se encaixa nesse fluxo de trabalho
    - O objetivo final da tarefa, ou como é o sucesso na conclusão da tarefa
- **Seja específico sobre o que você quer que Claude faça:** Por exemplo, se você quer que Claude produza apenas código e nada mais, diga isso.
- **Forneça instruções como etapas sequenciais:** Use listas numeradas ou pontos de bala para garantir melhor que Claude execute a tarefa exatamente da forma que você deseja.

### Exemplos

    <section title="Exemplo: Anonimizando feedback de clientes">

    Observe que Claude ainda comete erros no exemplo de prompting pouco claro, como deixar o nome de um cliente.

    | Função | Prompt Pouco Claro | Prompt Claro |
    | --- | --- | --- |
    | Usuário | Por favor, remova todas as informações de identificação pessoal dessas mensagens de feedback de clientes: \{\{FEEDBACK_DATA\}\} | Sua tarefa é anonimizar feedback de clientes para nossa revisão trimestral.<br/><br/>Instruções:<br/>1. Substitua todos os nomes de clientes por "CLIENTE_[ID]" (por exemplo, "Jane Doe" → "CLIENTE_001").<br/>2. Substitua endereços de email por "EMAIL_[ID]@example.com".<br/>3. Redija números de telefone como "TELEFONE_[ID]".<br/>4. Se uma mensagem mencionar um produto específico (por exemplo, "AcmeCloud"), deixe intacto.<br/>5. Se nenhuma PII for encontrada, copie a mensagem literalmente.<br/>6. Produza apenas as mensagens processadas, separadas por "---".<br/><br/>Dados a processar: \{\{FEEDBACK_DATA\}\} |
    | Assistente (resposta de Claude) | Aqui estão as mensagens de feedback de clientes anonimizadas:<br/>1. Estou usando seu software há anos e tem sido ótimo. Mas ultimamente, AcmeCloud tem travado muito. Corrija!<br/>2. XXX, seu representante de atendimento ao cliente, foi incrivelmente útil. Ele me guiou por todo o processo. Meu email é XXX se você quiser enviar uma pesquisa.<br/>3. Sou John Smith e não estou feliz. Estou aguardando há 2 horas tentando alcançar alguém em XXX. Isso é inaceitável! | CLIENTE_001: Estou usando seu software há anos e tem sido ótimo. Mas ultimamente, AcmeCloud tem travado muito. Corrija!<br/>---<br/>CLIENTE_002: CLIENTE_SERVICO_001, seu representante de atendimento ao cliente, foi incrivelmente útil. Ele me guiou por todo o processo. Meu email é EMAIL_002@example.com se você quiser enviar uma pesquisa.<br/>---<br/>CLIENTE_003: Sou CLIENTE_003 e não estou feliz. Estou aguardando há 2 horas tentando alcançar alguém em TELEFONE_001. Isso é inaceitável! |
    
</section>
    <section title="Exemplo: Criando uma campanha de email de marketing">

    Observe que Claude inventa detalhes para preencher as lacunas onde falta contexto com o prompt vago.

    | Função | Prompt Vago | Prompt Específico |
    | --- | --- | --- |
    | Usuário | Escreva um email de marketing para nossas novas funcionalidades do AcmeCloud. | Sua tarefa é criar um email de marketing direcionado para nosso lançamento de funcionalidades do AcmeCloud no Q3.<br/><br/>Instruções:<br/>1. Escreva para este público-alvo: Empresas de tecnologia de médio porte (100-500 funcionários) atualizando de on-prem para nuvem.<br/>2. Destaque 3 funcionalidades principais novas: criptografia de dados avançada, sincronização multiplataforma e colaboração em tempo real.<br/>3. Tom: Profissional mas acessível. Enfatize segurança, eficiência e trabalho em equipe.<br/>4. Inclua um CTA claro: Avaliação gratuita de 30 dias com onboarding prioritário.<br/>5. Linha de assunto: Menos de 50 caracteres, mencione "segurança" e "colaboração".<br/>6. Personalização: Use variáveis \{\{COMPANY_NAME\}\} e \{\{CONTACT_NAME\}\}.<br/><br/>Estrutura:<br/>1. Linha de assunto<br/>2. Corpo do email (150-200 palavras)<br/>3. Texto do botão CTA |
    | Assistente (resposta de Claude) | Aqui está um rascunho de email de marketing para nossas novas funcionalidades:<br/><br/>Assunto: Impulsione Seu Negócio com as Últimas Funcionalidades do AcmeCloud<br/><br/>Caro Cliente Valioso,<br/><br/>Estamos entusiasmados em apresentar três funcionalidades poderosas do AcmeCloud que revolucionarão seu fluxo de trabalho:<br/><br/>1. Colaboração em Tempo Real: Trabalhe em documentos simultaneamente com sua equipe. Sem mais problemas de controle de versão!<br/>2. Insights Alimentados por IA: Tome decisões baseadas em dados com IA que analisa tendências e automatiza tarefas.<br/>3. Suite de Segurança Avançada: Criptografia de ponta a ponta, autenticação multifator e detecção de ameaças mantêm seus dados seguros.<br/><br/>Oferta Limitada: Atualize agora para um desconto de 20% no primeiro ano. Além disso, indique um amigo para 10% de desconto adicional!<br/><br/>Atenciosamente,<br/>Equipe AcmeCloud | Linha de assunto: AcmeCloud: Segurança empresarial encontra trabalho em equipe em tempo real<br/><br/>Corpo do email:<br/>Caro \{\{CONTACT_NAME\}\},<br/><br/>Em \{\{COMPANY_NAME\}\}, você está crescendo rapidamente e de olho na nuvem. Mas com o crescimento vem o desafio de manter os dados seguros enquanto promove colaboração. É aí que entra o lançamento do Q3 do AcmeCloud, feito sob medida para inovadores de tecnologia como você.<br/><br/>1. Fort Knox para Seus Arquivos: Criptografia de nível militar agora protege seus dados, tanto em movimento quanto em repouso. Sua propriedade intelectual permanece sua, ponto final.<br/>2. Sincronização Sem Fronteiras: Windows, Mac ou Linux—AcmeCloud fala todas as linguagens. Controle de versão unificado significa sem mais "final_v2_REALMENTE_FINAL.doc".<br/>3. Colabore na Velocidade da Luz: Abandone o ping-pong de anexos. Agora seus desenvolvedores, designers e cientistas de dados co-criam em tempo real, reduzindo o tempo de colocação no mercado.<br/><br/>Não acredite apenas em nossa palavra. Experimente a diferença do AcmeCloud com nossa avaliação de 30 dias. E porque sabemos que o tempo é seu ativo mais precioso, estamos oferecendo onboarding prioritário.<br/><br/>Eleve Sua Equipe Agora - Avaliação Gratuita de 30 Dias |
    
</section>
    <section title="Exemplo: Resposta a incidentes">

    Observe que Claude produz texto supérfluo e formatação diferente com o prompt vago.
    | Função | Prompt Vago | Prompt Detalhado |
    | --- | --- | --- |
    | Usuário | Analise este relatório de interrupção do AcmeCloud e resuma os pontos-chave.<br/><br/>\{\{REPORT\}\} | Analise este relatório de interrupção do AcmeCloud. Pule o preâmbulo. Mantenha sua resposta concisa e escreva apenas as informações absolutamente necessárias. Liste apenas:<br/>1) Causa<br/>2) Duração<br/>3) Serviços impactados<br/>4) Número de usuários afetados<br/>5) Perda de receita estimada. <br/><br/>Aqui está o relatório: \{\{REPORT\}\}|
    | Assistente (resposta de Claude) | Aqui está um resumo dos pontos-chave do relatório de interrupção do AcmeCloud:<br/><br/>Em 15 de maio, uma atualização de balanceador de carga mal configurada causou problemas significativos de roteamento de tráfego, resultando em uma interrupção de serviço de 09:15 a 13:52 UTC. A interrupção de 4 horas e 37 minutos impactou nosso serviço principal de sincronização de arquivos e painel de administração, tornando-os inacessíveis. Além disso, o aplicativo móvel experimentou perda parcial de funcionalidade. Aproximadamente 68% de nossa base de usuários, totalizando 1,3 milhão de usuários, foram afetados. Com base em nossos Acordos de Nível de Serviço (SLAs) e receita média por usuário, estimamos um impacto financeiro de $420.000 em créditos de serviço e possível churn de clientes. | 1) Causa: Atualização de balanceador de carga mal configurada<br/>2) Duração: 4h 37m (09:15-13:52 UTC, 15 de maio)<br/>3) Impactado: Sincronização principal, painel de administração (inativo); aplicativo móvel (parcial)<br/>4) Usuários afetados: 1,3M (68% da base)<br/>5) Perda de receita est.: $420.000 |
    
</section>

***

<CardGroup cols={3}>
  <Card title="Biblioteca de prompts" icon="link" href="/docs/pt-BR/resources/prompt-library/library">
    Inspire-se com uma seleção curada de prompts para várias tarefas e casos de uso.
  </Card>
  <Card title="Tutorial de prompting do GitHub" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    Um tutorial repleto de exemplos que cobre os conceitos de engenharia de prompts encontrados em nossa documentação.
  </Card>
  <Card title="Tutorial de prompting do Google Sheets" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    Uma versão mais leve de nosso tutorial de engenharia de prompts por meio de uma planilha interativa.
  </Card>
</CardGroup>