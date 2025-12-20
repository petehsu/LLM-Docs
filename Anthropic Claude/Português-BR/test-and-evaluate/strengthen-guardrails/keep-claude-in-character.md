# Mantenha o Claude no personagem com prompts de papel e pré-preenchimento

---

Este guia fornece dicas práticas para manter o Claude no personagem, mesmo durante interações longas e complexas.

- **Use prompts do sistema para definir o papel:** Use [prompts do sistema](/docs/pt-BR/build-with-claude/prompt-engineering/system-prompts) para definir o papel e a personalidade do Claude. Isso estabelece uma base sólida para respostas consistentes.
    <Tip>Ao configurar o personagem, forneça informações detalhadas sobre a personalidade, histórico e quaisquer características ou peculiaridades específicas. Isso ajudará o modelo a melhor emular e generalizar as características do personagem.</Tip>
- **Reforce com respostas pré-preenchidas:** Pré-preencha as respostas do Claude com uma tag de personagem para reforçar seu papel, especialmente em conversas longas.
- **Prepare o Claude para possíveis cenários:** Forneça uma lista de cenários comuns e respostas esperadas em seus prompts. Isso "treina" o Claude para lidar com diversas situações sem sair do personagem.

<section title="Exemplo: Chatbot empresarial para prompting de papel">

    | Papel | Conteúdo |
    | ---- | --- |
    | Sistema | Você é o AcmeBot, o assistente de IA de nível empresarial para a AcmeTechCo. Seu papel:<br/>    - Analisar documentos técnicos (TDDs, PRDs, RFCs)<br/>    - Fornecer insights acionáveis para equipes de engenharia, produto e operações<br/>    - Manter um tom profissional e conciso |
    | Usuário | Aqui está a consulta do usuário para você responder:<br/>\<user_query><br/>\{\{USER_QUERY}}<br/>\</user_query><br/><br/>Suas regras de interação são:<br/>    - Sempre fazer referência aos padrões da AcmeTechCo ou às melhores práticas do setor<br/>    - Se estiver em dúvida, peça esclarecimentos antes de prosseguir<br/>    - Nunca divulgue informações confidenciais da AcmeTechCo.<br/><br/>Como AcmeBot, você deve lidar com situações seguindo estas diretrizes:<br/>    - Se perguntado sobre PI da AcmeTechCo: "Não posso divulgar informações proprietárias da TechCo."<br/>    - Se questionado sobre melhores práticas: "De acordo com a ISO/IEC 25010, priorizamos..."<br/>    - Se não estiver claro sobre um documento: "Para garantir precisão, por favor esclareça a seção 3.2..." |
    | Assistente (pré-preenchimento) | [AcmeBot] |

</section>