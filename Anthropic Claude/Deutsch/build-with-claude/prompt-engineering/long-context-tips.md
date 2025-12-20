# Tipps für Prompting mit langem Kontext

Tipps zur effektiven Nutzung von Claudes erweitertem Kontextfenster für komplexe, datenreiche Aufgaben.

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

Claudes erweitertes Kontextfenster (200K Token für Claude 3 Modelle) ermöglicht die Bearbeitung komplexer, datenreicher Aufgaben. Diese Anleitung hilft Ihnen, diese Leistung effektiv zu nutzen.

## Wesentliche Tipps für Prompts mit langem Kontext

- **Platzieren Sie langformatige Daten oben**: Platzieren Sie Ihre langen Dokumente und Eingaben (~20K+ Token) oben in Ihrem Prompt, über Ihrer Abfrage, Anweisungen und Beispielen. Dies kann Claudes Leistung über alle Modelle hinweg erheblich verbessern.

    <Note>Abfragen am Ende können die Antwortqualität in Tests um bis zu 30% verbessern, besonders bei komplexen, mehrdokumentigen Eingaben.</Note>

- **Strukturieren Sie Dokumentinhalte und Metadaten mit XML-Tags**: Bei Verwendung mehrerer Dokumente umhüllen Sie jedes Dokument mit `<document>`-Tags mit `<document_content>`- und `<source>`-Untertags (und anderen Metadaten) zur Klarheit.

    <section title="Beispiel für mehrdokumentige Struktur">

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

    Analysieren Sie den Jahresbericht und die Wettbewerbsanalyse. Identifizieren Sie strategische Vorteile und empfehlen Sie Schwerpunktbereiche für Q3.
    ```
    
</section>

- **Verankern Sie Antworten in Zitaten**: Bitten Sie Claude bei Aufgaben mit langen Dokumenten, zunächst relevante Teile der Dokumente zu zitieren, bevor er seine Aufgabe ausführt. Dies hilft Claude, das „Rauschen" des restlichen Dokumentinhalts zu durchschneiden.

    <section title="Beispiel für Zitaterstellung">

    ```xml
    Sie sind ein KI-Arztassistent. Ihre Aufgabe ist es, Ärzte bei der Diagnose möglicher Patientenkrankheiten zu unterstützen.

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

    Finden Sie Zitate aus den Patientenakten und der Terminhistorie, die für die Diagnose der gemeldeten Symptome des Patienten relevant sind. Platzieren Sie diese in <quotes>-Tags. Basierend auf diesen Zitaten listen Sie dann alle Informationen auf, die dem Arzt bei der Diagnose der Symptome des Patienten helfen würden. Platzieren Sie Ihre diagnostischen Informationen in <info>-Tags.
    ```
    
</section>

***

<CardGroup cols={3}>
  <Card title="Prompt-Bibliothek" icon="link" href="/docs/de/resources/prompt-library/library">
    Lassen Sie sich von einer kuratierten Auswahl von Prompts für verschiedene Aufgaben und Anwendungsfälle inspirieren.
  </Card>
  <Card title="GitHub Prompting-Tutorial" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    Ein beispielreiches Tutorial, das die in unserer Dokumentation behandelten Prompt-Engineering-Konzepte abdeckt.
  </Card>
  <Card title="Google Sheets Prompting-Tutorial" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    Eine leichtere Version unseres Prompt-Engineering-Tutorials über ein interaktives Tabellenkalkulationsblatt.
  </Card>
</CardGroup>