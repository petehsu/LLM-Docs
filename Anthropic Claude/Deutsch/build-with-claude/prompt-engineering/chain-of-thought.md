# Lassen Sie Claude denken (Chain-of-Thought-Prompting) um die Leistung zu verbessern

Erfahren Sie, wie Sie Claude durch Chain-of-Thought-Prompting dazu ermutigen, Probleme schrittweise zu durchdenken und damit die Genauigkeit und Qualität der Ausgaben zu verbessern.

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

Wenn Sie mit komplexen Aufgaben wie Forschung, Analyse oder Problemlösung konfrontiert sind, kann Claude durch Raum zum Denken dramatisch bessere Ergebnisse liefern. Diese Technik, bekannt als Chain-of-Thought (CoT) Prompting, ermutigt Claude, Probleme schrittweise zu zerlegen, was zu genaueren und differenzierteren Ausgaben führt.

## Vor der Implementierung von CoT

### Warum Claude denken lassen?
- **Genauigkeit:** Das schrittweise Durcharbeiten von Problemen reduziert Fehler, besonders bei Mathematik, Logik, Analyse oder allgemein komplexen Aufgaben.
- **Kohärenz:** Strukturiertes Denken führt zu kohärenteren, besser organisierten Antworten.
- **Debugging:** Das Sehen von Claudes Gedankenprozess hilft Ihnen, Stellen zu identifizieren, an denen Prompts möglicherweise unklar sind.

### Warum Claude nicht denken lassen?
- Erhöhte Ausgabelänge kann sich auf die Latenz auswirken.
- Nicht alle Aufgaben erfordern tiefes Denken. Verwenden Sie CoT mit Bedacht, um das richtige Gleichgewicht zwischen Leistung und Latenz zu gewährleisten.

<Tip>Verwenden Sie CoT für Aufgaben, die ein Mensch durchdenken müsste, wie komplexe Mathematik, mehrstufige Analysen, das Schreiben komplexer Dokumente oder Entscheidungen mit vielen Faktoren.</Tip>

***

## Wie man zum Denken auffordert

Die unten aufgeführten Chain-of-Thought-Techniken sind **von der am wenigsten bis zur am meisten komplexen geordnet**. Weniger komplexe Methoden benötigen weniger Platz im Kontextfenster, sind aber auch allgemein weniger leistungsstark.

<Tip>**CoT-Tipp**: Lassen Sie Claude sein Denken immer ausgeben. Ohne die Ausgabe des Gedankenprozesses findet kein Denken statt!</Tip>

- **Grundlegender Prompt**: Fügen Sie "Denken Sie schrittweise" in Ihren Prompt ein.
    - Mangelt es an Anleitung, *wie* man denkt (was besonders nicht ideal ist, wenn eine Aufgabe sehr spezifisch für Ihre App, Ihren Anwendungsfall oder Ihre Organisation ist)
    <section title="Beispiel: Schreiben von Spender-E-Mails (grundlegendes CoT)">

        | Rolle | Inhalt |
        | ---- | ------- |
        | Benutzer | Verfassen Sie personalisierte E-Mails an Spender, in denen Sie um Beiträge zum diesjährigen Care for Kids-Programm bitten.<br/><br/>Programminformationen:<br/>\\{\{PROGRAM_DETAILS}}<br/>\</program><br/><br/>Spenderinformationen:<br/>\<donor>\{\{DONOR_DETAILS}}<br/>\</donor><br/><br/>Denken Sie schrittweise, bevor Sie die E-Mail schreiben. |
    
</section>
- **Gesteuerter Prompt**: Skizzieren Sie spezifische Schritte, die Claude in seinem Denkprozess befolgen soll.
    - Mangelt es an Strukturierung, um es einfach zu machen, die Antwort vom Denken zu trennen und zu extrahieren.
    <section title="Beispiel: Schreiben von Spender-E-Mails (gesteuertes CoT)">

        | Rolle | Inhalt |
        | ---- | ------- |
        | Benutzer | Verfassen Sie personalisierte E-Mails an Spender, in denen Sie um Beiträge zum diesjährigen Care for Kids-Programm bitten.<br/><br/>Programminformationen:<br/>\\{\{PROGRAM_DETAILS}}<br/>\</program><br/><br/>Spenderinformationen:<br/>\<donor>\{\{DONOR_DETAILS}}<br/>\</donor><br/><br/>Denken Sie, bevor Sie die E-Mail schreiben. Überlegen Sie zunächst, welche Botschaft diesen Spender angesichts seiner Spendenverlauf und der Kampagnen, die er unterstützt hat, ansprechen könnte. Überlegen Sie dann, welche Aspekte des Care for Kids-Programms ihn angesichts seiner Geschichte ansprechen würden. Schreiben Sie abschließend die personalisierte Spender-E-Mail mit Ihrer Analyse. |
    
</section>
- **Strukturierter Prompt**: Verwenden Sie XML-Tags wie `<thinking>` und `<answer>`, um das Denken von der endgültigen Antwort zu trennen.
     <section title="Beispiel: Schreiben von Spender-E-Mails (strukturiertes gesteuertes CoT)">

        | Rolle | Inhalt |
        | ---- | ------- |
        | Benutzer | Verfassen Sie personalisierte E-Mails an Spender, in denen Sie um Beiträge zum diesjährigen Care for Kids-Programm bitten.<br/><br/>Programminformationen:<br/>\\{\{PROGRAM_DETAILS}}<br/>\</program><br/><br/>Spenderinformationen:<br/>\<donor>\{\{DONOR_DETAILS}}<br/>\</donor><br/><br/>Denken Sie, bevor Sie die E-Mail in \<thinking>-Tags schreiben. Überlegen Sie zunächst, welche Botschaft diesen Spender angesichts seiner Spendenverlauf und der Kampagnen, die er unterstützt hat, ansprechen könnte. Überlegen Sie dann, welche Aspekte des Care for Kids-Programms ihn angesichts seiner Geschichte ansprechen würden. Schreiben Sie abschließend die personalisierte Spender-E-Mail in \<email>-Tags mit Ihrer Analyse. |
    
</section>
    
### Beispiele

  <section title="Beispiel: Finanzanalyse ohne Denken">

    Ohne schrittweises Denken gibt Claude eine Empfehlung, die vernünftig erscheint, aber an Tiefe mangelt. Es quantifiziert nicht die möglichen Ergebnisse oder berücksichtigt die historische Marktleistung, die für eine fundierte Entscheidung entscheidend sind.
    | Rolle | Inhalt |
    | ---- | ------- |
    | Benutzer | Sie sind ein Finanzberater. Ein Kunde möchte 10.000 $ investieren. Er kann zwischen zwei Optionen wählen: A) Eine Aktie, die historisch 12% pro Jahr zurückgibt, aber volatil ist, oder B) Eine Anleihe, die 6% pro Jahr garantiert. Der Kunde benötigt das Geld in 5 Jahren für eine Anzahlung auf ein Haus. Welche Option empfehlen Sie? |
    | Assistent | Basierend auf den bereitgestellten Informationen würde ich Option B, die Anleihe mit einer garantierten jährlichen Rendite von 6%, empfehlen. Hier ist der Grund:<br/><br/>1. Sicherheit: Die Anleihe bietet eine garantierte jährliche Rendite von 6%, die Sicherheit in der Finanzplanung bietet. Dies ist entscheidend, wenn der Kunde ein spezifisches Finanzziel (Anzahlung) mit einem festen Zeitrahmen (5 Jahre) hat.<br/>2. Risikoaversion: Da der Kunde dieses Geld für ein wichtiges Lebensereignis (Hauskauf) benötigt, hat er wahrscheinlich eine niedrige Risikotoleranz. Die Volatilität des Aktienmarktes könnte seine Pläne gefährden, wenn es kurz vor dem Zeitpunkt, an dem er die Mittel benötigt, zu einem Abschwung kommt.<br/>3. Zeithorizont: Mit nur 5 Jahren gibt es weniger Zeit, um sich von möglichen Aktienmärkte-Abschwüngen zu erholen. Längere Anlagehorizonte (10+ Jahre) sind allgemein besser geeignet, um Aktienmarktvolatilität zu bewältigen.<br/><br/>Während die historische Rendite von 12% der Aktie attraktiv ist, garantiert die Vergangenheit nicht die Zukunft. Die garantierte 6% der Anleihe stellt sicher, dass der Kunde die Mittel hat, die er benötigt, wenn es Zeit ist, die Anzahlung zu leisten. |
  
</section>
  <section title="Beispiel: Finanzanalyse mit Denken">

    Mit schrittweisem Denken bietet der Berater eine viel reichhaltigere Analyse. Er berechnet genaue Zahlen für beide Szenarien, berücksichtigt die historische Marktvolatilität und analysiert tiefgreifend die Risikotoleranz des Kunden. Dieses gründliche Denken führt zu einer selbstbewussteren und nachvollziehbareren Empfehlung.
    | Rolle | Inhalt |
    | ---- | ------- |
    | Benutzer | Sie sind ein Finanzberater. Ein Kunde möchte 10.000 $ investieren. Er kann zwischen zwei Optionen wählen: A) Eine Aktie, die historisch 12% pro Jahr zurückgibt, aber volatil ist, oder B) Eine Anleihe, die 6% pro Jahr garantiert. Der Kunde benötigt das Geld in 5 Jahren für eine Anzahlung auf ein Haus. Welche Option empfehlen Sie? Denken Sie schrittweise. |
    | Assistent | Um die beste Anlageoption für unseren Kunden zu bestimmen, werde ich mehrere Faktoren schrittweise berücksichtigen:<br/><br/>\<thinking><br/>1. Verstehen Sie das Ziel und den Zeitrahmen des Kunden:<br/>   - Ziel: Anzahlung für ein Haus<br/>   - Zeitrahmen: 5 Jahre<br/>   - Implikation: Dies ist ein kurzfristiges, hochpriorisiertes Finanzziel. Der Kunde kann sich wahrscheinlich keine signifikante Risiko- oder Volatilität leisten.<br/><br/>2. Analysieren Sie Option A (Aktie):<br/>   - Pro: Höhere historische Rendite (12% pro Jahr)<br/>   - Nachteil: Volatil (was auf Potenzial für signifikante Gewinne oder Verluste hindeutet)<br/>   - Berechnen Sie die mögliche 5-Jahres-Rendite:<br/>     - Bester Fall (12% pro Jahr): 10.000 $ * (1,12)^5 ≈ 17.623,42 $<br/>     - Schlechtester Fall (Marktcrash): Könnte einen großen Teil verlieren, z.B. 50% Crash = 5.000 $<br/><br/>3. Analysieren Sie Option B (Anleihe):<br/>   - Pro: Garantierte Rendite (6% pro Jahr)<br/>   - Nachteil: Niedrigere Rendite im Vergleich zur historischen Aktienleistung<br/>   - Berechnen Sie die 5-Jahres-Rendite:<br/>     - Garantiert: 10.000 $ * (1,06)^5 ≈ 13.382,25 $<br/><br/>4. Berücksichtigen Sie die Risikotoleranz:<br/>   - Ziel ist eine Hausanzahlung (wesentlich, nicht diskretionär)<br/>   - Kurzer Zeitrahmen (5 Jahre) begrenzt die Fähigkeit, sich von Marktabschwüngen zu erholen<br/>   - Schlussfolgerung: Kunde hat wahrscheinlich niedrige Risikotoleranz<br/><br/>5. Historische Perspektive:<br/>   - Die 12% der Aktie sind historisch, nicht garantiert<br/>   - In 5-Jahres-Perioden kann der Aktienmarkt stark variieren:<br/>     - 2003-2007 (vor der Finanzkrise): S&P 500 um ~82% gestiegen<br/>     - 2007-2011 (während der Krise): S&P 500 um ~2% gefallen<br/>   - Schlussfolgerung: Die Vergangenheit garantiert nicht die Zukunft, besonders kurzfristig<br/><br/>6. Endgültige Analyse:<br/>   - Option A (Aktie): Höhere potenzielle Rendite, aber inakzeptables Risiko, das Ziel der Anzahlung nicht zu erreichen<br/>   - Option B (Anleihe): Garantiert ~80% des besten Szenarios der Aktie, 100% Sicherheit, Mittel zu haben<br/>\</thinking><br/><br/>\<answer><br/>Ich empfehle Option B, die Anleihe mit einer garantierten jährlichen Rendite von 6%. Während die historische Rendite von 12% der Aktie verlockend ist, stellt die Anleihe sicher, dass Sie in 5 Jahren 13.382,25 $ für Ihre Hausanzahlung haben. Angesichts der Wichtigkeit und des kurzen Zeitrahmens Ihres Ziels stellt die Volatilität der Aktie ein inakzeptables Risiko dar. Die Anleihe bietet Sicherheit, die für einen so entscheidenden finanziellen Meilenstein von unschätzbarem Wert ist.<br/>\</answer> |
  
</section>

***

<CardGroup cols={3}>
  <Card title="Prompt-Bibliothek" icon="link" href="/docs/de/resources/prompt-library/library">
    Lassen Sie sich von einer kuratierten Auswahl von Prompts für verschiedene Aufgaben und Anwendungsfälle inspirieren.
  </Card>
  <Card title="GitHub-Prompting-Tutorial" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    Ein beispielreiches Tutorial, das die Prompt-Engineering-Konzepte aus unserer Dokumentation abdeckt.
  </Card>
  <Card title="Google Sheets Prompting-Tutorial" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    Eine leichtere Version unseres Prompt-Engineering-Tutorials über ein interaktives Tabellenkalkulationsblatt.
  </Card>
</CardGroup>