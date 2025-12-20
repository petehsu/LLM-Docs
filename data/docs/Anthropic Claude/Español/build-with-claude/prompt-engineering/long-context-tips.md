# Consejos para prompts de contexto largo

Consejos para aprovechar eficazmente la ventana de contexto extendido de Claude

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

La ventana de contexto extendida de Claude (200K tokens para modelos Claude 3) permite manejar tareas complejas y ricas en datos. Esta guía te ayudará a aprovechar este poder de manera efectiva.

## Consejos esenciales para prompts de contexto largo

- **Coloca datos de formato largo en la parte superior**: Coloca tus documentos largos e inputs (~20K+ tokens) cerca de la parte superior de tu prompt, por encima de tu consulta, instrucciones y ejemplos. Esto puede mejorar significativamente el rendimiento de Claude en todos los modelos.

    <Note>Las consultas al final pueden mejorar la calidad de la respuesta hasta un 30% en pruebas, especialmente con inputs complejos de múltiples documentos.</Note>

- **Estructura el contenido del documento y los metadatos con etiquetas XML**: Cuando uses múltiples documentos, envuelve cada documento en etiquetas `<document>` con subetiquetas `<document_content>` y `<source>` (y otros metadatos) para mayor claridad.

    <section title="Ejemplo de estructura multi-documento">

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

- **Fundamenta las respuestas en citas**: Para tareas de documentos largos, pide a Claude que cite primero las partes relevantes de los documentos antes de llevar a cabo su tarea. Esto ayuda a Claude a atravesar el "ruido" del resto del contenido del documento.

    <section title="Ejemplo de extracción de citas">

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
  <Card title="Biblioteca de prompts" icon="link" href="/docs/es/resources/prompt-library/library">
    Inspírate con una selección curada de prompts para varias tareas y casos de uso.
  </Card>
  <Card title="Tutorial de prompting de GitHub" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    Un tutorial lleno de ejemplos que cubre los conceptos de ingeniería de prompts encontrados en nuestra documentación.
  </Card>
  <Card title="Tutorial de prompting de Google Sheets" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    Una versión más ligera de nuestro tutorial de ingeniería de prompts a través de una hoja de cálculo interactiva.
  </Card>
</CardGroup>