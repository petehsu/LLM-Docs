# Verwenden Sie XML-Tags zur Strukturierung Ihrer Prompts

Verwenden Sie XML-Tags zur Strukturierung Ihrer Prompts

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

Wenn Ihre Prompts mehrere Komponenten wie Kontext, Anweisungen und Beispiele enthalten, können XML-Tags ein Game-Changer sein. Sie helfen Claude, Ihre Prompts genauer zu analysieren, was zu höherwertigen Ausgaben führt.

<Tip>**XML-Tipp**: Verwenden Sie Tags wie `<instructions>`, `<example>` und `<formatting>`, um verschiedene Teile Ihres Prompts klar zu trennen. Dies verhindert, dass Claude Anweisungen mit Beispielen oder Kontext verwechselt.</Tip>

## Warum XML-Tags verwenden?

- **Klarheit:** Trennen Sie verschiedene Teile Ihres Prompts klar und stellen Sie sicher, dass Ihr Prompt gut strukturiert ist.
- **Genauigkeit:** Reduzieren Sie Fehler, die dadurch entstehen, dass Claude Teile Ihres Prompts falsch interpretiert.
- **Flexibilität:** Finden, fügen, entfernen oder ändern Sie Teile Ihres Prompts einfach, ohne alles neu zu schreiben.
- **Parsebarkeit:** Wenn Claude XML-Tags in seiner Ausgabe verwendet, ist es einfacher, bestimmte Teile seiner Antwort durch Nachbearbeitung zu extrahieren.

<Note>Es gibt keine kanonischen "besten" XML-Tags, mit denen Claude speziell trainiert wurde, obwohl wir empfehlen, dass Ihre Tag-Namen zu den Informationen passen, die sie umgeben.</Note>

***

## Best Practices für Tagging

1. **Seien Sie konsistent**: Verwenden Sie die gleichen Tag-Namen in Ihren Prompts und beziehen Sie sich auf diese Tag-Namen, wenn Sie über den Inhalt sprechen (z. B. `Using the contract in <contract> tags...`).
2. **Verschachteln Sie Tags**: Sie sollten Tags `<outer><inner></inner></outer>` für hierarchische Inhalte verschachteln.

<Tip>**Power-User-Tipp**: Kombinieren Sie XML-Tags mit anderen Techniken wie Multishot-Prompting (`<examples>`) oder Chain of Thought (`<thinking>`, `<answer>`). Dies erzeugt super-strukturierte, hochperformante Prompts.</Tip>

### Beispiele

  <section title="Beispiel: Generierung von Finanzberichten">

    Ohne XML-Tags missversteht Claude die Aufgabe und generiert einen Bericht, der nicht der erforderlichen Struktur oder dem Ton entspricht. Nach der Substitution besteht auch die Möglichkeit, dass Claude nicht versteht, wo ein Abschnitt (wie das Q1-Berichtbeispiel) endet und ein anderer beginnt.

    | Rolle | Ohne XML-Tags | Mit XML-Tags |
    | ---- | ----------- | ------------- |
    | Benutzer | Du bist ein Finanzanalyst bei AcmeCorp. Erstelle einen Q2-Finanzbericht für unsere Investoren. Füge Abschnitte zu Umsatzwachstum, Gewinnmargen und Cashflow ein, ähnlich wie in diesem Beispiel aus dem letzten Jahr: \{\{Q1_REPORT\}\}. Verwende Datenpunkte aus diesem Tabellenkalkulationsblatt: \{\{SPREADSHEET_DATA\}\}. Der Bericht sollte äußerst prägnant, präzise, professionell und in Listenformat sein. Er sollte sowohl Stärken als auch Verbesserungsbereiche hervorheben. | Du bist ein Finanzanalyst bei AcmeCorp. Erstelle einen Q2-Finanzbericht für unsere Investoren.<br/><br/>AcmeCorp ist ein B2B-SaaS-Unternehmen. Unsere Investoren schätzen Transparenz und umsetzbare Erkenntnisse.<br/><br/>Verwende diese Daten für deinen Bericht:\<data>\{\{SPREADSHEET_DATA\}\}\</data><br/><br/>\<instructions><br/>1. Füge Abschnitte ein: Umsatzwachstum, Gewinnmargen, Cashflow.<br/>2. Hebe Stärken und Verbesserungsbereiche hervor.<br/>\</instructions><br/><br/>Halte deinen Ton prägnant und professionell. Folge dieser Struktur:<br/>\<formatting_example>\{\{Q1_REPORT\}\}\</formatting_example> |
    | Assistent | Q2-Finanzbericht für AcmeCorp-Investoren<br/><br/>Liebe geschätzte Investoren,<br/><br/>Ich freue mich, unseren Q2-Finanzbericht zu präsentieren, der AcmeCorps kontinuierliches Wachstum und Widerstandsfähigkeit auf dem B2B-SaaS-Markt zeigt.<br/><br/>1. Umsatzwachstum:<br/>Unser Q2-Umsatz erreichte 15,2 Millionen Dollar, ein Anstieg von 22% im Jahresvergleich. Dieses Wachstum wird hauptsächlich durch eine 30%ige Expansion unserer Enterprise-Kundenbasis angetrieben. Unser KMU-Segment verzeichnete jedoch einen leichten Rückgang von 5%, den wir durch gezielte Marketinginitiativen im Q3 beheben möchten.<br/><br/>2. Gewinnmargen:<br/>Die Bruttomarge verbesserte sich auf 72% (3% Anstieg gegenüber Q1) aufgrund von Infrastrukturoptimierungen. Die EBITDA-Marge sank jedoch auf 18% (2% Rückgang), da wir stark in F&E für unsere kommenden KI-gesteuerten Funktionen investierten.<br/><br/>3. Cashflow:<br/>Der operative Cashflow bleibt mit 4,1 Millionen Dollar stark. Unsere Barreserven belaufen sich auf 28 Millionen Dollar und bieten eine Laufzeit von 15 Monaten bei aktuellem Burn Rate. Wir verzeichneten einen Anstieg der Kundenakquisitionskosten um 20%, den wir durch effizientere Verkaufsstrategien angehen.<br/><br/>Zusammenfassend bleiben AcmeCorps Kernfinanzen robust. Wir balancieren Wachstumsinvestitionen mit umsichtiger Cashverwaltung. Unser Fokus für Q3 wird die Revitalisierung des KMU-Wachstums und die Optimierung der Verkaufseffizienz sein.<br/><br/>Danke für Ihr fortgesetztes Vertrauen.<br/><br/>Mit freundlichen Grüßen,<br/>CFO, AcmeCorp | Q2-Finanzbericht für AcmeCorp-Investoren\</output><br/><br/>Umsatzwachstum:<br/>- Q2-Umsatz: 15,2 Millionen Dollar (22% YoY ↑)<br/>- Enterprise-Kunden: 30% ↑<br/>- KMU-Segment: 5% ↓<br/>  Maßnahme: Gezieltes Q3-Marketing<br/><br/>Gewinnmargen:<br/>- Bruttomarge: 72% (3% ↑ gegenüber Q1)<br/>  Grund: Infrastrukturoptimierungen<br/>- EBITDA-Marge: 18% (2% ↓)<br/>  Grund: F&E-Investition in KI-Funktionen<br/><br/>Cashflow:<br/>- Operativer Cashflow: 4,1 Millionen Dollar (stark)<br/>- Barreserven: 28 Millionen Dollar (15-Monats-Laufzeit)<br/>- Kundenakquisitionskosten: 20% ↑<br/>  Maßnahme: Verkaufsstrategien optimieren<br/><br/>Ausblick:<br/>- Kernfinanzen: Robust<br/>- Q3-Fokus: KMU revitalisieren, Verkauf optimieren<br/><br/>Das Management bleibt dem Ausgleich von Wachstumsinvestitionen mit finanzieller Disziplin verpflichtet. |
  
</section>
  <section title="Beispiel: Analyse von Rechtsverträgen">

    Ohne XML-Tags ist Claudes Analyse unorganisiert und übersieht wichtige Punkte. Mit Tags bietet es eine strukturierte, gründliche Analyse, auf die ein Rechtsteam einwirken kann.

    | Rolle | Ohne XML-Tags | Mit XML-Tags |
    | ---- | ----------- | ------------- |
    | Benutzer | Analysiere diese Softwarelizenzvereinbarung auf potenzielle Risiken und Haftungen: \{\{CONTRACT\}\}. Konzentriere dich auf Schadloshaltung, Haftungsbeschränkung und Bestimmungen zum geistigen Eigentum. Beachte auch ungewöhnliche oder besorgniserregende Bedingungen. Hier ist unser Standardvertrag als Referenz: \{\{STANDARD_CONTRACT\}\}. Gib eine Zusammenfassung der Ergebnisse und Empfehlungen für unser Rechtsteam. | Analysiere diese Softwarelizenzvereinbarung auf rechtliche Risiken und Haftungen.<br/><br/>Wir sind ein multinationaler Konzern, der diese Vereinbarung für unsere Kern-Dateninfrastruktur in Betracht zieht.<br/><br/>\<agreement><br/>\{\{CONTRACT\}\}\</agreement><br/><br/>Dies ist unser Standardvertrag als Referenz:<br/>\<standard_contract>\{\{STANDARD_CONTRACT\}\}\</standard_contract><br/><br/>\<instructions><br/>1. Analysiere diese Klauseln:<br/>   - Schadloshaltung<br/>   - Haftungsbeschränkung<br/>   - Geistiges Eigentum<br/><br/>2. Beachte ungewöhnliche oder besorgniserregende Bedingungen.<br/><br/>3. Vergleiche mit unserem Standardvertrag.<br/><br/>4. Fasse Ergebnisse in \<findings> Tags zusammen.<br/><br/>5. Liste umsetzbare Empfehlungen in \<recommendations> Tags auf.\</instructions> |
    | Assistent | Die bereitgestellte Softwarelizenzvereinbarung weist mehrere besorgniserregende Aspekte auf. Die Schadloshaltungsklausel ist übermäßig breit und könnte uns erheblichen Haftungen aussetzen. Der Haftungsbeschränkungsabschnitt begrenzt Schadensersatz auf lediglich 500 Dollar, was für unsere Nutzung auf Unternehmensebene unzureichend ist. Bezüglich des geistigen Eigentums gewährt die Vereinbarung dem Anbieter Miteigentum an allen Änderungen oder Integrationen, die wir erstellen.<br/><br/>Zusammenfassend ist diese Vereinbarung nicht in unserem besten Interesse. Sie setzt uns unnötigen Risiken aus, begrenzt unsere Möglichkeiten im Falle von Ausfällen und gefährdet unsere Rechte am geistigen Eigentum. Ich empfehle, diese Bedingungen neu zu verhandeln oder alternative Anbieter zu suchen. | \<findings><br/>1. Schadloshaltung (Klausel 8):<br/>   - Problem: Übermäßig breit. Wir halten den Anbieter schadlos gegen "alle und jegliche Ansprüche", die sich aus unserer Nutzung ergeben.<br/>   - Risiko: Könnte uns haftbar machen, auch für Fahrlässigkeit oder Produktmängel des Anbieters.<br/>   - Abweichung: Unser Standard begrenzt die Schadloshaltung auf Ansprüche, die sich aus unserer Verletzung der Vereinbarung ergeben.<br/><br/>2. Haftungsbeschränkung (Klausel 9):<br/>   - Problem: Begrenzt alle Schadensersätze auf 500 Dollar, einschließlich direkter Schäden.<br/>   - Risiko: Grob unzureichend für Unternehmensnutzung. Ein kritischer Fehler könnte Millionen kosten.<br/>   - Abweichung: Unser Standard erlaubt direkte Schadensersätze bis zu 12 Monaten der gezahlten Gebühren.<br/><br/>3. Geistiges Eigentum (Klausel 12):<br/>   - Problem: Gewährt dem Anbieter Miteigentum an unseren Änderungen/Integrationen.<br/>   - Risiko: Der Anbieter könnte unsere proprietären Algorithmen oder Datenerkenntnisse nutzen oder verkaufen.<br/>   - Abweichung: Unser Standard behält vollständiges Eigentum an unserer Arbeit.<br/><br/>4. Ungewöhnliche Bedingungen:<br/>   - Klausel 5.3: Der Anbieter kann unsere Nutzungsdaten für "jeden Zweck" verwenden.<br/>   - Klausel 7.2: Der Anbieter kann "aus Gründen der Zweckmäßigkeit" mit nur 7 Tagen Kündigungsfrist kündigen.<br/>   - Klausel 11: Keine Gewährleistungen jeglicher Art, auch nicht für grundlegende Marktgängigkeit.<br/>\</findings><br/><br/>\<recommendations><br/>1. Lehne diese Vereinbarung ab. Die Risiken überwiegen die Vorteile für ein Unternehmen bei weitem.<br/>2. Mache einen Gegenvorschlag:<br/>   - Schadloshaltung: Begrenzen auf Ansprüche, die sich aus unserer Verletzung der Vereinbarung ergeben.<br/>   - Haftung: Begrenzen auf 12 Monate Gebühren für direkte Schäden; verhandeln für indirekte.<br/>   - Geistiges Eigentum: Vollständiges Eigentum an unseren Änderungen/Integrationen.<br/>   - Datennutzung: Beschränken auf Serviceverbesserung nur.<br/>   - Kündigung: Mindestens 90 Tage Kündigungsfrist; nur aus wichtigem Grund.<br/>   - Gewährleistungen: Fordern Sie grundlegende Marktgängigkeit und Eignung für den Zweck.<br/>3. Wenn der Anbieter ablehnt, erkunden Sie alternative Anbieter oder interne Lösungen.<br/>4. Beauftragen Sie Rechtsbeistand für Vertragsverhandlungen angesichts der hohen Einsätze.<br/>\</recommendations> |
  
</section>

***

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