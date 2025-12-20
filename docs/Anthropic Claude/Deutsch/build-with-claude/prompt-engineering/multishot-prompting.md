# Verwenden Sie Beispiele (Multishot-Prompting), um Claudes Verhalten zu lenken

Erfahren Sie, wie Sie Few-Shot- und Multishot-Prompting-Techniken einsetzen, um Claude zu präziseren und konsistenteren Ausgaben zu führen.

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

Beispiele sind Ihr Geheimtipp, um Claude genau das generieren zu lassen, was Sie brauchen. Durch das Bereitstellen einiger gut durchdachter Beispiele in Ihrem Prompt können Sie die Genauigkeit, Konsistenz und Qualität von Claudes Ausgaben dramatisch verbessern.
Diese Technik, bekannt als Few-Shot- oder Multishot-Prompting, ist besonders wirksam für Aufgaben, die strukturierte Ausgaben oder die Einhaltung spezifischer Formate erfordern.

<Tip>**Verbessern Sie Ihre Prompts**: Fügen Sie 3-5 vielfältige, relevante Beispiele ein, um Claude genau zu zeigen, was Sie möchten. Mehr Beispiele = bessere Leistung, besonders bei komplexen Aufgaben.</Tip>

## Warum Beispiele verwenden?

- **Genauigkeit**: Beispiele reduzieren Missinterpretationen von Anweisungen.
- **Konsistenz**: Beispiele erzwingen eine einheitliche Struktur und einen einheitlichen Stil.
- **Leistung**: Gut gewählte Beispiele verbessern Claudes Fähigkeit, komplexe Aufgaben zu bewältigen.

## Effektive Beispiele erstellen

Für maximale Effektivität sollten Ihre Beispiele folgende Eigenschaften haben:
- **Relevant**: Ihre Beispiele spiegeln Ihren tatsächlichen Anwendungsfall wider.
- **Vielfältig**: Ihre Beispiele decken Grenzfälle und potenzielle Herausforderungen ab und unterscheiden sich genug, damit Claude nicht versehentlich unbeabsichtigte Muster aufgreift.
- **Klar**: Ihre Beispiele sind in `<example>`-Tags (falls mehrere, verschachtelt in `<examples>`-Tags) zur Strukturierung eingebunden.

<Tip>Bitten Sie Claude, Ihre Beispiele auf Relevanz, Vielfalt oder Klarheit zu bewerten. Oder lassen Sie Claude weitere Beispiele basierend auf Ihrem ursprünglichen Satz generieren.</Tip>
<section title="Beispiel: Analyse von Kundenfeedback">

    Beachten Sie, dass Claude in der Version „ohne Beispiele" nicht mehrere Optionen für jede Kategorie auflistet, obwohl die schriftliche Analyse anzeigt, dass es mehrere Kategorien für bestimmtes Feedback gibt. Es enthält auch eine lange Erklärung, wenn wir diese möglicherweise nicht möchten.

    | Rolle | Ohne Beispiele | Mit Beispielen |
    | --- | --- | --- |
    | Benutzer | Analysieren Sie dieses Kundenfeedback und kategorisieren Sie die Probleme. Verwenden Sie diese Kategorien: UI/UX, Performance, Feature Request, Integration, Pricing und Other. Bewerten Sie auch die Stimmung (Positive/Neutral/Negative) und Priorität (High/Medium/Low).<br/><br/>Hier ist das Feedback: \{\{FEEDBACK\}\} | Unser CS-Team ist von unstrukturiertem Feedback überfordert. Ihre Aufgabe ist es, Feedback zu analysieren und Probleme für unsere Produkt- und Engineering-Teams zu kategorisieren. Verwenden Sie diese Kategorien: UI/UX, Performance, Feature Request, Integration, Pricing und Other. Bewerten Sie auch die Stimmung (Positive/Neutral/Negative) und Priorität (High/Medium/Low). Hier ist ein Beispiel:<br/><br/>\<example><br/>Input: Das neue Dashboard ist ein Durcheinander! Es dauert ewig zu laden, und ich kann die Export-Schaltfläche nicht finden. Beheben Sie dies sofort!<br/>Category: UI/UX, Performance<br/>Sentiment: Negative<br/>Priority: High\</example><br/><br/>Analysieren Sie nun dieses Feedback: \{\{FEEDBACK\}\} |
    | Assistent (Claudes Antwort) | Hier ist die Analyse des Kundenfeedbacks:<br/><br/>Issue: UI/UX<br/>Sentiment: Negative<br/>Priority: High<br/>Der Kunde ist frustriert über das neue Dashboard-Design, das er als unübersichtlich und langsam beim Laden empfindet. Er weist speziell auf die fehlende „Export"-Schaltfläche hin, die wahrscheinlich eine kritische Funktion ist. Dieses Problem muss mit hoher Priorität behoben werden.<br/><br/>Issue: Integration<br/>Sentiment: Positive<br/>Priority: Medium<br/>Der Kunde ist mit der bestehenden Salesforce-Integration zufrieden, möchte aber auch Unterstützung für Hubspot sehen. Dies ist eine Feature-Anfrage, die für ein zukünftiges Produkt-Update in Betracht gezogen werden könnte.<br/><br/>Issue: Pricing<br/>Sentiment: Negative<br/>Priority: High<br/>Der Kunde findet die Preisgestaltung unvernünftig, besonders für die grundlegenden Funktionen. Er droht, zu einem Konkurrenten zu wechseln, daher ist dies ein Problem mit hoher Priorität, das überprüft werden muss.<br/><br/>Issue: Performance<br/>Sentiment Negative<br/>Priority: High<br/>Der Kunde hat kritische Probleme mit der mobilen App, bei der große Datei-Uploads konsistent zu Abstürzen führen. Dies ist ein erhebliches Problem, das die Fähigkeit des Kunden beeinträchtigt, das Produkt effektiv zu nutzen, und sollte mit hoher Priorität behoben werden.<br/><br/>Issue: UI/UX<br/>Sentiment: Positive<br/>Priority: Low<br/>Der Kunde ist insgesamt mit dem Produkt zufrieden und hebt speziell die intuitive Benutzeroberfläche und den ausgezeichneten Kundensupport hervor. Dies ist positives Feedback, das keine sofortige Maßnahme erfordert. | Hier ist die Analyse des Kundenfeedbacks:<br/><br/>1. Das neue Dashboard ist ein Durcheinander! Es dauert ewig zu laden, und ich kann die Export-Schaltfläche nicht finden. Beheben Sie dies sofort!<br/>Category: UI/UX, Performance<br/>Sentiment: Negative<br/>Priority: High<br/><br/>2. Liebe die Salesforce-Integration! Aber es wäre großartig, wenn Sie auch Hubspot hinzufügen könnten.<br/>Category: Integration, Feature Request<br/>Sentiment: Positive<br/>Priority: Medium<br/><br/>3. Ihre Preisgestaltung ist lächerlich! 99 $/Monat für grundlegende Funktionen? Ich wechsle zu Competitor X.<br/>Category: Pricing<br/>Sentiment: Negative<br/>Priority: High<br/><br/>4. Die mobile App stürzt ständig ab, wenn ich versuche, große Dateien (>50MB) hochzuladen. Dies ist kritisch für unsere Außendienstmitarbeiter.<br/>Category: Performance<br/>Sentiment: Negative<br/>Priority: High<br/><br/>5. Insgesamt bin ich mit dem Produkt zufrieden. Die Benutzeroberfläche ist intuitiv, und der Kundensupport ist erstklassig. Macht weiter so!<br/>Category: UI/UX, Other (Customer Support)<br/>Sentiment: Positive<br/>Priority: Low |

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