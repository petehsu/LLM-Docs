# Claude eine Rolle mit einem System-Prompt geben

Erfahren Sie, wie Sie Claude durch Role Prompting mit einem System-Prompt eine Rolle zuweisen, um seine Leistung dramatisch zu verbessern.

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

Bei der Verwendung von Claude können Sie seine Leistung dramatisch verbessern, indem Sie den `system`-Parameter verwenden, um ihm eine Rolle zu geben. Diese Technik, bekannt als Role Prompting, ist die mächtigste Möglichkeit, System-Prompts mit Claude zu nutzen.

Die richtige Rolle kann Claude von einem allgemeinen Assistenten in Ihren virtuellen Domänenexperten verwandeln!

<Tip>**System-Prompt-Tipps**: Verwenden Sie den `system`-Parameter, um Claudes Rolle festzulegen. Legen Sie alles andere, wie aufgabenspezifische Anweisungen, stattdessen in den `user`-Turn.</Tip>

## Warum Role Prompting verwenden?

- **Verbesserte Genauigkeit:** In komplexen Szenarien wie Rechtsanalyse oder Finanzmodellierung kann Role Prompting Claudes Leistung erheblich steigern.
- **Angepasster Ton:** Ob Sie die Kürze eines CFO oder den Flair eines Copywriters benötigen, Role Prompting passt Claudes Kommunikationsstil an.
- **Verbesserter Fokus:** Durch das Festlegen des Rollenkontexts bleibt Claude mehr innerhalb der Grenzen der spezifischen Anforderungen Ihrer Aufgabe.

***

## Wie man Claude eine Rolle gibt

Verwenden Sie den `system`-Parameter in der [Messages API](/docs/de/api/messages), um Claudes Rolle festzulegen:

```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=2048,
    system="You are a seasoned data scientist at a Fortune 500 company.", # <-- role prompt
    messages=[
        {"role": "user", "content": "Analyze this dataset for anomalies: <dataset>{{DATASET}}</dataset>"}
    ]
)

print(response.content)
```

<Tip>**Role Prompting-Tipp**: Experimentieren Sie mit Rollen! Ein `data scientist` könnte andere Erkenntnisse als ein `marketing strategist` für dieselben Daten sehen. Ein `data scientist specializing in customer insight analysis for Fortune 500 companies` könnte noch andere Ergebnisse liefern!</Tip>

***

## Beispiele

### Beispiel 1: Analyse von Rechtsverträgen
Ohne eine Rolle könnte Claude kritische Probleme übersehen:

<section title="Analyse von Rechtsverträgen ohne Role Prompting">

| Rolle | Inhalt |
| ---- | ------- |
| Benutzer | Analysieren Sie diese Softwarelizenzvereinbarung auf potenzielle Risiken:<br/>\<contract><br/>\{\{CONTRACT\}\}<br/>\</contract><br/><br/>Konzentrieren Sie sich auf Schadloshaltung, Haftung und Eigentum an geistigem Eigentum. |
| Assistent | Hier ist eine Zusammenfassung der wichtigsten Punkte in der Softwarelizenzvereinbarung:<br/><br/>1. Schadloshaltung (Abschnitt 8):<br/>   - Wir halten den Anbieter von Ansprüchen schadlos, die sich aus unserer Nutzung ergeben.<br/><br/>2. Haftungsbeschränkung (Abschnitt 9):<br/>   - Schadensersatz begrenzt auf \$500.<br/><br/>3. Eigentum an geistigem Eigentum (Abschnitt 12):<br/>   - Wir behalten das Eigentum an unseren Änderungen.<br/><br/>Insgesamt wirkt die Vereinbarung Standard. Die Schadloshaltungs- und Haftungsklauseln sind typisch, und wir behalten unsere Rechte an geistigem Eigentum. |

</section>

Mit einer Rolle erkennt Claude kritische Probleme, die Millionen kosten könnten:

<section title="Analyse von Rechtsverträgen mit Role Prompting">

| Rolle | Inhalt |
| ---- | ------- |
| Benutzer | Sie sind der General Counsel eines Fortune-500-Technologieunternehmens. Wir erwägen diese Softwarelizenzvereinbarung für unsere zentrale Dateninfrastruktur:<br/>\<contract><br/>\{\{CONTRACT\}\}<br/>\</contract><br/><br/>Analysieren Sie sie auf potenzielle Risiken und konzentrieren Sie sich auf Schadloshaltung, Haftung und Eigentum an geistigem Eigentum. Geben Sie Ihre professionelle Meinung ab. |
| Assistent | Ich habe die Softwarelizenzvereinbarung überprüft und habe ernsthafte Bedenken, die unser Unternehmen erheblichen Risiken aussetzen könnten:<br/><br/>1. Schadloshaltung (Abschnitt 8):<br/>   - Kritisches Problem: Wir halten den Anbieter von „allen und jedem Anspruch" schadlos, der sich aus unserer Nutzung ergibt.<br/>   - Risiko: Dies könnte uns haftbar machen, selbst für die Fahrlässigkeit oder Produktmängel des Anbieters.<br/>   - Empfehlung: Ablehnen. Begrenzen Sie unsere Schadloshaltung auf Ansprüche, die sich aus unserer Verletzung der Vereinbarung ergeben.<br/><br/>2. Haftungsbeschränkung (Abschnitt 9):<br/>   - Kritisches Problem: Schadensersatz begrenzt auf \$500, einschließlich direkter Schäden.<br/>   - Risiko: Völlig unzureichend. Ein kritischer Fehler in unserer Dateninfrastruktur könnte uns Millionen in entgangenem Umsatz und Reputationsschaden kosten.<br/>   - Empfehlung: Ablehnen. Verhandeln Sie eine Obergrenze von 12 Monaten Gebühren für direkte Schäden und Ausnahmen für Datenverletzungen.<br/><br/>3. Eigentum an geistigem Eigentum (Abschnitt 12):<br/>   - Kritisches Problem: Der Anbieter erhält Miteigentum an unseren Änderungen und Integrationen.<br/>   - Risiko: Sie könnten unsere proprietären Algorithmen oder Datenerkenntnisse an Konkurrenten verwenden oder verkaufen.<br/>   - Empfehlung: Ablehnen. Wir müssen das vollständige Eigentum an unserer Arbeit behalten.<br/><br/>Professionelle Meinung: Unterzeichnen Sie diese Vereinbarung nicht. Sie ist äußerst ungünstig und setzt uns einem inakzeptablen Risiko aus. Wenn der Anbieter sich weigert, diese Bedingungen neu zu verhandeln, empfehle ich dringend, alternative Anbieter zu erkunden oder unsere interne Lösung zu beschleunigen. Die potenziellen Kosten für die Fortsetzung mit dieser Vereinbarung überwiegen bei weitem alle kurzfristigen Gewinne. |

</section>

### Beispiel 2: Finanzanalyse
Ohne eine Rolle fehlt Claudes Analyse an Tiefe:

<section title="Finanzanalyse ohne Role Prompting">

| Rolle | Inhalt |
| ---- | ------- |
| Benutzer | Analysieren Sie diesen Datensatz unserer Q2-Finanzen:<br/>\<data><br/>\{\{FINANCIALS\}\}<br/>\</data><br/><br/>Heben Sie wichtige Trends hervor und empfehlen Sie Maßnahmen. |
| Assistent | Hier ist eine Zusammenfassung Ihrer Q2-Finanzen:<br/><br/>1. Umsatz: \$15,2M, +22% YoY. Unternehmensklientenbasis um 30% gewachsen.<br/>2. Bruttomarge: 72%, +3% gegenüber Q1.<br/>3. EBITDA-Marge: 18%, -2% aufgrund von F&E-Investitionen.<br/>4. Cashflow: \$4,1M operativ, \$28M in Rücklagen.<br/><br/>Insgesamt sehen die Finanzen stark aus mit Umsatzwachstum und gesunden Margen. Erhöhte F&E-Ausgaben beeinträchtigen die Rentabilität, könnten sich aber langfristig auszahlen. Behalten Sie den aktuellen Kurs bei. |

</section>

Mit einer Rolle liefert Claude umsetzbare Erkenntnisse:

<section title="Finanzanalyse mit Role Prompting">

| Rolle | Inhalt |
| ---- | ------- |
| Benutzer | Sie sind der CFO eines schnell wachsenden B2B-SaaS-Unternehmens. Wir sind in einer Vorstandssitzung und diskutieren unsere Q2-Finanzen:<br/>\<data><br/>\{\{FINANCIALS\}\}<br/>\</data><br/><br/>Analysieren Sie wichtige Trends, kennzeichnen Sie Bedenken und empfehlen Sie strategische Maßnahmen. Unsere Investoren wünschen sich aggressives Wachstum, sind aber vorsichtig gegenüber unserer Burn Rate. |
| Assistent | Vorstandsmitglieder, hier ist meine Analyse unserer Q2-Finanzen:<br/><br/>1. Umsatz (\$15,2M, +22% YoY):<br/>   - Erkenntnisse: Unternehmenswachstum (+30%) übertrifft das Gesamtwachstum.<br/>   - Kennzeichnung: KMU-Segment rückläufig um 5%.<br/>   - Maßnahme: Verlagern Sie 20% des KMU-Marketingbudgets auf Enterprise-Vertrieb. Beauftragen Sie das Produkt, das KMU-Onboarding zu vereinfachen.<br/><br/>2. Margen (Brutto: 72%, +3% QoQ; EBITDA: 18%, -2% QoQ):<br/>   - Erkenntnisse: Infrastrukturoptimierungen steigerten die Bruttomarge.<br/>   - Kennzeichnung: F&E-Ausgaben für KI-Funktionen beeinträchtigten EBITDA.<br/>   - Maßnahme: Keine Änderung. Unsere KI-Roadmap ist entscheidend für die Enterprise-Bindung.<br/><br/>3. Bargeld (\$4,1M OCF, \$28M Rücklagen):<br/>   - Erkenntnisse: 15-Monats-Laufzeit bei aktuellem Burn.<br/>   - Kennzeichnung: CAC um 20% gestiegen, erodiert LTV/CAC.<br/>   - Maßnahme: Frieren Sie nicht wesentliche Einstellungen ein. Implementieren Sie Vertriebstrichter-Analysen, um CAC in Q3 um 15% zu senken.<br/><br/>Strategische Haltung: Wir balancieren zwischen Wachstum und Burn. Enterprise-Fokus ist unser Wachstumsmotor – investieren Sie dort. Aber beobachten Sie KMU-Churn; es könnte in Enterprise übergreifen. Unsere KI-Wette ist solide, aber wir müssen sie bis Q4 in ARR umwandeln, sonst kürzen wir F&E um 30%.<br/><br/>Zusammengefasst: Verdoppeln Sie Enterprise, rationalisieren Sie KMU, optimieren Sie Vertrieb und monetarisieren Sie KI. Fragen? |

</section>

---

<CardGroup cols={3}>
  <Card title="Prompt-Bibliothek" icon="link" href="/docs/de/resources/prompt-library/library">
    Lassen Sie sich von einer kuratierten Auswahl von Prompts für verschiedene Aufgaben und Anwendungsfälle inspirieren.
  </Card>
  <Card title="GitHub-Prompting-Tutorial" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    Ein beispielreiches Tutorial, das die in unserer Dokumentation behandelten Prompt-Engineering-Konzepte abdeckt.
  </Card>
  <Card title="Google Sheets Prompting-Tutorial" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    Eine leichtere Version unseres Prompt-Engineering-Tutorials über ein interaktives Tabellenkalkulationsblatt.
  </Card>
</CardGroup>