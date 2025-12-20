# Dicas de prompting com contexto longo

Aprenda a aproveitar a janela de contexto estendida do Claude para tarefas complexas e ricas em dados.

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

A janela de contexto estendida do Claude (200K tokens para modelos Claude 3) permite lidar com tarefas complexas e ricas em dados. Este guia ajudará você a aproveitar esse poder de forma eficaz.

## Dicas essenciais para prompts com contexto longo

- **Coloque dados longos no topo**: Coloque seus documentos longos e entradas (~20K+ tokens) perto do topo do seu prompt, acima de sua consulta, instruções e exemplos. Isso pode melhorar significativamente o desempenho do Claude em todos os modelos.

    <Note>Consultas no final podem melhorar a qualidade da resposta em até 30% em testes, especialmente com entradas complexas e multi-documentos.</Note>

- **Estruture o conteúdo do documento e metadados com tags XML**: Ao usar vários documentos, envolva cada documento em tags `<document>` com subtags `<document_content>` e `<source>` (e outros metadados) para maior clareza.

    <section title="Exemplo de estrutura multi-documento">

    ```xml
    <documents>
      <document index="1">
        <source>annual_report_2023.pdf</source>
        <document_content>
          {{ANNUAL_REPORT}}
        </document_content>
      </document>
      <document index="2">
        <source>competitor_analysis_q2.xlsx</source>
        <document_content>
          {{COMPETITOR_ANALYSIS}}
        </document_content>
      </document>
    </documents>

    Analyze the annual report and competitor analysis. Identify strategic advantages and recommend Q3 focus areas.
    ```
    
</section>

- **Fundamente respostas em citações**: Para tarefas com documentos longos, peça ao Claude para citar partes relevantes dos documentos primeiro antes de realizar sua tarefa. Isso ajuda Claude a cortar o "ruído" do resto do conteúdo do documento.

    <section title="Exemplo de extração de citações">

    ```xml
    You are an AI physician's assistant. Your task is to help doctors diagnose possible patient illnesses.

    <documents>
      <document index="1">
        <source>patient_symptoms.txt</source>
        <document_content>
          {{PATIENT_SYMPTOMS}}
        </document_content>
      </document>
      <document index="2">
        <source>patient_records.txt</source>
        <document_content>
          {{PATIENT_RECORDS}}
        </document_content>
      </document>
      <document index="3">
        <source>patient01_appt_history.txt</source>
        <document_content>
          {{PATIENT01_APPOINTMENT_HISTORY}}
        </document_content>
      </document>
    </documents>

    Find quotes from the patient records and appointment history that are relevant to diagnosing the patient's reported symptoms. Place these in <quotes> tags. Then, based on these quotes, list all information that would help the doctor diagnose the patient's symptoms. Place your diagnostic information in <info> tags.
    ```
    
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
    Uma versão mais leve do nosso tutorial de engenharia de prompts por meio de uma planilha interativa.
  </Card>
</CardGroup>