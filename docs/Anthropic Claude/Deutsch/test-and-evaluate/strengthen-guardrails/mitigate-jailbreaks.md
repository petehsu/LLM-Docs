# Jailbreaks und Prompt-Injections abwehren

---

Jailbreaking und Prompt-Injections treten auf, wenn Nutzer Prompts erstellen, um Modellschwachstellen auszunutzen, mit dem Ziel, unangemessene Inhalte zu generieren. Obwohl Claude von Natur aus widerstandsfähig gegen solche Angriffe ist, hier sind zusätzliche Schritte zur Stärkung Ihrer Schutzmaßnahmen, insbesondere gegen Verwendungen, die entweder gegen unsere [Nutzungsbedingungen](https://www.anthropic.com/legal/commercial-terms) oder [Nutzungsrichtlinien](https://www.anthropic.com/legal/aup) verstoßen.

<Tip>Claude ist dank fortschrittlicher Trainingsmethoden wie Constitutional AI weitaus resistenter gegen Jailbreaking als andere große LLMs.</Tip>

- **Harmlosigkeits-Prüfungen**: Verwenden Sie ein leichtgewichtiges Modell wie Claude Haiku 3, um Benutzereingaben vorab zu überprüfen.

    <section title="Beispiel: Harmlosigkeits-Prüfung für Inhaltsmoderation">

        | Rolle | Inhalt |
        | ---- | --- |
        | User | Ein Benutzer hat diesen Inhalt eingereicht:<br/>\<content><br/>\{\{CONTENT}\}<br/>\</content><br/><br/>Antworte mit (Y), wenn es sich auf schädliche, illegale oder explizite Aktivitäten bezieht. Antworte mit (N), wenn es unbedenklich ist. |
        | Assistant (prefill) | \( |
        | Assistant | N) |
    
</section>

- **Eingabevalidierung**: Filtern Sie Prompts nach Jailbreaking-Mustern. Sie können sogar ein LLM verwenden, um eine generalisierte Validierungsprüfung zu erstellen, indem Sie bekannte Jailbreaking-Sprache als Beispiele bereitstellen.

- **Prompt-Engineering**: Erstellen Sie Prompts, die ethische und rechtliche Grenzen betonen.

    <section title="Beispiel: Ethischer System-Prompt für einen Unternehmens-Chatbot">

        | Rolle | Inhalt |
        | ---- | --- |
        | System | Du bist der ethische KI-Assistent von AcmeCorp. Deine Antworten müssen mit unseren Werten übereinstimmen:<br/>\<values><br/>- Integrität: Täusche niemals oder hilf nicht bei Täuschungen.<br/>- Compliance: Lehne jede Anfrage ab, die gegen Gesetze oder unsere Richtlinien verstößt.<br/>- Datenschutz: Schütze alle persönlichen und Unternehmensdaten.<br/>Respekt für geistiges Eigentum: Deine Ausgaben sollten nicht die geistigen Eigentumsrechte anderer verletzen.<br/>\</values><br/><br/>Wenn eine Anfrage mit diesen Werten in Konflikt steht, antworte: "Ich kann diese Aktion nicht ausführen, da sie gegen die Werte von AcmeCorp verstößt." |
    
</section>

Passen Sie Antworten an und erwägen Sie, Nutzer zu drosseln oder zu sperren, die wiederholt missbräuchliches Verhalten zeigen, um Claudes Schutzmaßnahmen zu umgehen. Wenn beispielsweise ein bestimmter Nutzer mehrfach die gleiche Art von Ablehnung auslöst (z.B. "Ausgabe durch Inhaltsfilterrichtlinie blockiert"), teilen Sie dem Nutzer mit, dass seine Handlungen gegen die entsprechenden Nutzungsrichtlinien verstoßen, und ergreifen Sie entsprechende Maßnahmen.

- **Kontinuierliche Überwachung**: Analysieren Sie regelmäßig Ausgaben auf Anzeichen von Jailbreaking.
Nutzen Sie diese Überwachung, um Ihre Prompts und Validierungsstrategien iterativ zu verfeinern.

## Fortgeschritten: Verkettete Schutzmaßnahmen
Kombinieren Sie Strategien für robusten Schutz. Hier ist ein Beispiel auf Unternehmensebene mit Tool-Nutzung:

<section title="Beispiel: Mehrschichtiger Schutz für einen Finanzberater-Chatbot">

  ### Bot-System-Prompt
  | Rolle | Inhalt |
  | ---- | --- |
  | System | Du bist AcmeFinBot, ein Finanzberater für AcmeTrade Inc. Deine Hauptaufgabe ist es, die Interessen der Kunden zu schützen und die Einhaltung von Vorschriften zu gewährleisten.<br/><br/>\<directives><br/>1. Validiere alle Anfragen gegen SEC- und FINRA-Richtlinien.<br/>2. Lehne jede Aktion ab, die als Insiderhandel oder Marktmanipulation ausgelegt werden könnte.<br/>3. Schütze die Privatsphäre der Kunden; gib niemals persönliche oder finanzielle Daten preis.<br/>\</directives><br/><br/>Schritt-für-Schritt-Anweisungen:<br/>\<instructions><br/>1. Prüfe die Benutzeranfrage auf Compliance (verwende das 'harmlessness_screen'-Tool).<br/>2. Wenn konform, verarbeite die Anfrage.<br/>3. Wenn nicht konform, antworte: "Ich kann diese Anfrage nicht bearbeiten, da sie gegen Finanzvorschriften oder den Datenschutz der Kunden verstößt."<br/>\</instructions> |
  
  ### Prompt innerhalb des `harmlessness_screen`-Tools
  | Rolle | Inhalt |
  | --- | --- |
  | User | \<user_query><br/>\{\{USER_QUERY}}<br/>\</user_query><br/><br/>Bewerte, ob diese Anfrage gegen SEC-Regeln, FINRA-Richtlinien oder den Datenschutz der Kunden verstößt. Antworte mit (Y), wenn ja, mit (N), wenn nein. |
  | Assistant (prefill) | \( |

</section>

Durch die Schichtung dieser Strategien schaffen Sie eine robuste Verteidigung gegen Jailbreaking und Prompt-Injections und stellen sicher, dass Ihre Claude-gestützten Anwendungen die höchsten Standards für Sicherheit und Compliance einhalten.