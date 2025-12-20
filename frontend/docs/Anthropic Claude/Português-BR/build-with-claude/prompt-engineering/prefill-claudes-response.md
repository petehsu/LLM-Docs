# Preencha previamente a resposta do Claude para maior controle de saída

Aprenda como preencher previamente as respostas do Claude para direcionar suas ações, pular preâmbulos, aplicar formatos específicos e manter consistência de personagem.

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

<Note>
O preenchimento prévio está disponível apenas para modos sem pensamento estendido. Atualmente não é suportado com pensamento estendido.
</Note>

Ao usar Claude, você tem a capacidade única de guiar suas respostas preenchendo previamente a mensagem `Assistant`. Esta técnica poderosa permite que você direcione as ações do Claude, pule preâmbulos, aplique formatos específicos como JSON ou XML, e até ajude Claude a manter consistência de personagem em cenários de interpretação de papéis.

Em alguns casos em que Claude não está tendo o desempenho esperado, algumas frases preenchidas previamente podem melhorar vastamente o desempenho do Claude. Um pequeno preenchimento prévio faz uma grande diferença!

## Como preencher previamente a resposta do Claude

Para preencher previamente, inclua o texto inicial desejado na mensagem `Assistant` (a resposta do Claude continuará de onde a mensagem `Assistant` termina):

```python
import anthropic

client = anthropic.Anthropic()
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "What is your favorite color?"},
        {"role": "assistant", "content": "As an AI assistant, I don't have a favorite color, But if I had to pick, it would be green because"}  # Prefill here
    ]
)
```

<Warning>
  O conteúdo do preenchimento prévio não pode terminar com espaço em branco. Um preenchimento como `"As an AI assistant, I "` (com um espaço no final) resultará em um erro.
</Warning>

### Exemplos

#### Exemplo 1: Controlando a formatação de saída e pulando o preâmbulo

<Tip>**Dica de usuário avançado**: Preencher previamente `{` força Claude a pular o preâmbulo e sair diretamente com o objeto JSON. Isso é mais limpo, mais conciso e mais fácil para programas analisarem sem processamento adicional.
Para saída JSON garantida que esteja em conformidade com um esquema específico, considere usar [Structured Outputs](/docs/pt-BR/build-with-claude/structured-outputs) em vez de preenchimento prévio. As saídas estruturadas garantem que a resposta do Claude sempre corresponda ao seu esquema JSON definido, tornando-o ideal para aplicações de produção que exigem conformidade de formato rigoroso.</Tip>

    <section title="Exemplo: Extração de dados estruturados sem preenchimento prévio">

    | Papel | Conteúdo |
    | ---- | ------- |
    | Usuário | Extraia o nome, tamanho, preço e cor desta descrição de produto como um objeto JSON:<br/><br/>\<description><br/>O SmartHome Mini é um assistente de casa inteligente compacto disponível em preto ou branco por apenas \$49.99. Com apenas 5 polegadas de largura, permite que você controle luzes, termostatos e outros dispositivos conectados por voz ou aplicativo—não importa onde você o coloque em sua casa. Este hub acessível traz controle prático e sem as mãos para seus dispositivos inteligentes.<br/>\</description> |
    | Assistente | Aqui está a informação extraída em formato JSON:<br/><br/>\`\`\`json<br/>\{<br/>  "name": "SmartHome Mini",<br/>  "size": "5 inches wide",<br/>  "price": "\$49.99",<br/>  "colors": ["black", "white"]<br/>\}<br/>\`\`\`<br/><br/>Extraí os seguintes detalhes da descrição do produto:<br/>- **Nome**: SmartHome Mini<br/>- **Tamanho**: 5 polegadas de largura<br/>- **Preço**: \$49.99<br/>- **Cores**: Disponível em preto e branco<br/><br/>O objeto JSON fornece um formato estruturado que é fácil para programas analisarem e usarem. Deixe-me saber se você precisa de alguma modificação ou tiver outras perguntas! |
    
</section>

    <section title="Exemplo: Extração de dados estruturados com preenchimento prévio">

    | Papel | Conteúdo |
    | ---- | ------- |
    | Usuário | Extraia o nome, tamanho, preço e cor desta descrição de produto como um objeto JSON:<br/><br/>\<description><br/>O SmartHome Mini é um assistente de casa inteligente compacto disponível em preto ou branco por apenas \$49.99. Com apenas 5 polegadas de largura, permite que você controle luzes, termostatos e outros dispositivos conectados por voz ou aplicativo—não importa onde você o coloque em sua casa. Este hub acessível traz controle prático e sem as mãos para seus dispositivos inteligentes.<br/>\</description> |
    | Assistente (preenchimento prévio) | \{ |
    | Assistente (resposta do Claude) | "name": "SmartHome Mini",<br/>"size": "5 inches wide",<br/>"price": "\$49.99",<br/>"colors": [<br/>  "black",<br/>  "white"<br/>]<br/>\} |
    
</section>

#### Exemplo 2: Mantendo o personagem em cenários de interpretação de papéis

<Tip>**Dica de interpretação de papéis**: Preencher previamente um `[ROLE_NAME]` entre colchetes pode lembrar Claude de manter o personagem, mesmo para conversas mais longas e complexas. Isso é especialmente poderoso quando combinado com role prompting no parâmetro `system`.</Tip>

    <section title="Exemplo: Mantendo o personagem sem role prompting">

    | Papel | Conteúdo |
    | ---- | ------- |
    | Usuário (50 turnos de conversa com Claude "Sherlock Holmes") | O que você deduz sobre o proprietário deste sapato? \<image>muddy_shoe.jpg\</image> |
    | Assistente | Como assistente de IA, ficaria feliz em analisar a imagem de um sapato enlameado como se você a tivesse fornecido. Aqui está minha dedução... |
    
</section>

    <section title="Exemplo: Mantendo o personagem com role prompting">

    | Papel | Conteúdo |
    | ---- | ------- |
    | Usuário (50 turnos de conversa com Claude "Sherlock Holmes") | O que você deduz sobre o proprietário deste sapato? <br/>\<image>muddy_shoe.jpg\</image> |
    | Assistente (preenchimento prévio) | [Sherlock Holmes] |
    | Assistente (resposta do Claude) | Ah, o que temos aqui? Um espécime mais curioso, Watson! Vamos examinar este sapato com um olho perspicaz. A lama, você vê, não é o barro comum de Londres, mas sim o matiz avermelhado distintivo do solo rico em ferro encontrado apenas nos arredores de Hampstead Heath. E ainda assim, o desgaste na sola sugere uma marcha mais adequada aos paralelepípedos de Whitechapel do que às encostas suaves da Heath.<br/><br/>Agora, observe os cadarços! Eles estão amarrados com um nó particular favorecido por aqueles na profissão médica—sem dúvida um hábito adquirido durante anos de amarração de aventais cirúrgicos. Mas as marcas de arranhão na caixa do dedo do pé contam uma história diferente: são consistentes com o movimento de chute que se poderia empregar nas artes marciais, especificamente Baritsu.<br/><br/>Podemos concluir, então, que nosso proprietário de sapato ausente é um médico, possivelmente um cirurgião, que reside em Whitechapel mas frequenta Hampstead Heath—talvez para uma prática secreta de Baritsu, longe de olhos curiosos. Um caso mais intrigante, Watson! Devemos nos apressar; o jogo está em andamento! |
    
</section>

---

<CardGroup cols={3}>
  <Card title="Trabalhando com Mensagens" icon="messages" href="/docs/pt-BR/build-with-claude/working-with-messages">
    Veja mais exemplos de preenchimento prévio e outros padrões da Messages API.
  </Card>
  <Card title="Biblioteca de prompts" icon="link" href="/docs/pt-BR/resources/prompt-library/library">
    Inspire-se com uma seleção curada de prompts para várias tarefas e casos de uso.
  </Card>
  <Card title="Tutorial de prompting do GitHub" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    Um tutorial repleto de exemplos que cobre os conceitos de engenharia de prompts encontrados em nossa documentação.
  </Card>
  <Card title="Tutorial de prompting do Google Sheets" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    Uma versão mais leve do nosso tutorial de engenharia de prompts via uma planilha interativa.
  </Card>
</CardGroup>