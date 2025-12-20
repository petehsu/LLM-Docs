# Füllen Sie Claudes Antwort vor, um die Ausgabekontrolle zu verbessern

Lernen Sie, wie Sie Claudes Antworten durch Prefilling steuern können, um Preambles zu überspringen, spezifische Formate durchzusetzen und die Zeichenkonsistenz in Rollenspiel-Szenarien zu wahren.

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

<Note>
Prefilling ist nur für Nicht-Extended-Thinking-Modi verfügbar. Es wird derzeit nicht mit Extended Thinking unterstützt.
</Note>

Bei der Verwendung von Claude haben Sie die einzigartige Möglichkeit, seine Antworten durch Prefilling der `Assistant`-Nachricht zu steuern. Diese leistungsstarke Technik ermöglicht es Ihnen, Claudes Aktionen zu lenken, Preambles zu überspringen, spezifische Formate wie JSON oder XML durchzusetzen und Claude sogar dabei zu helfen, die Zeichenkonsistenz in Rollenspiel-Szenarien zu wahren.

In einigen Fällen, in denen Claude nicht wie erwartet funktioniert, können einige vorgefüllte Sätze Claudes Leistung erheblich verbessern. Ein wenig Prefilling geht einen langen Weg!

## So füllen Sie Claudes Antwort vor

Um vorzufüllen, fügen Sie den gewünschten Anfangstext in die `Assistant`-Nachricht ein (Claudes Antwort wird von dort aus fortgesetzt, wo die `Assistant`-Nachricht endet):

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
  Der Prefill-Inhalt darf nicht mit nachgelagerten Leerzeichen enden. Ein Prefill wie `"As an AI assistant, I "` (mit einem Leerzeichen am Ende) führt zu einem Fehler.
</Warning>

### Beispiele

#### Beispiel 1: Steuerung der Ausgabeformatierung und Überspringen der Preamble

<Tip>**Power-User-Tipp**: Das Prefilling von `{` zwingt Claude, die Preamble zu überspringen und das JSON-Objekt direkt auszugeben. Dies ist sauberer, prägnanter und leichter für Programme zu analysieren, ohne zusätzliche Verarbeitung. Für garantierte JSON-Ausgabe, die einem bestimmten Schema entspricht, sollten Sie stattdessen [Structured Outputs](/docs/de/build-with-claude/structured-outputs) verwenden. Structured Outputs stellen sicher, dass Claudes Antwort immer Ihrem definierten JSON-Schema entspricht, was ideal für Produktionsanwendungen ist, die strikte Formatkonformität erfordern.</Tip>

    <section title="Beispiel: Strukturierte Datenextraktion ohne Prefilling">

    | Rolle | Inhalt |
    | ---- | ------- |
    | Benutzer | Extrahieren Sie den Namen, die Größe, den Preis und die Farbe aus dieser Produktbeschreibung als JSON-Objekt:<br/><br/>\<description><br/>Der SmartHome Mini ist ein kompakter Smart-Home-Assistent, der in Schwarz oder Weiß für nur \$49,99 erhältlich ist. Mit nur 5 Zoll Breite können Sie Lichter, Thermostate und andere verbundene Geräte per Sprache oder App steuern – egal wo Sie ihn in Ihrem Zuhause platzieren. Dieser erschwingliche kleine Hub bringt bequeme freihändige Steuerung zu Ihren Smart-Geräten.<br/>\</description> |
    | Assistent | Hier sind die extrahierten Informationen im JSON-Format:<br/><br/>\`\`\`json<br/>\{<br/>  "name": "SmartHome Mini",<br/>  "size": "5 inches wide",<br/>  "price": "\$49.99",<br/>  "colors": ["black", "white"]<br/>\}<br/>\`\`\`<br/><br/>Ich habe die folgenden Details aus der Produktbeschreibung extrahiert:<br/>- **Name**: SmartHome Mini<br/>- **Größe**: 5 Zoll breit<br/>- **Preis**: \$49,99<br/>- **Farben**: Erhältlich in Schwarz und Weiß<br/><br/>Das JSON-Objekt bietet ein strukturiertes Format, das Programme leicht analysieren und verwenden können. Lassen Sie mich wissen, wenn Sie Änderungen benötigen oder weitere Fragen haben! |
    
</section>

    <section title="Beispiel: Strukturierte Datenextraktion mit Prefilling">

    | Rolle | Inhalt |
    | ---- | ------- |
    | Benutzer | Extrahieren Sie den Namen, die Größe, den Preis und die Farbe aus dieser Produktbeschreibung als JSON-Objekt:<br/><br/>\<description><br/>Der SmartHome Mini ist ein kompakter Smart-Home-Assistent, der in Schwarz oder Weiß für nur \$49,99 erhältlich ist. Mit nur 5 Zoll Breite können Sie Lichter, Thermostate und andere verbundene Geräte per Sprache oder App steuern – egal wo Sie ihn in Ihrem Zuhause platzieren. Dieser erschwingliche kleine Hub bringt bequeme freihändige Steuerung zu Ihren Smart-Geräten.<br/>\</description> |
    | Assistent (Prefill) | \{ |
    | Assistent (Claudes Antwort) | "name": "SmartHome Mini",<br/>"size": "5 inches wide",<br/>"price": "\$49.99",<br/>"colors": [<br/>  "black",<br/>  "white"<br/>]<br/>\} |
    
</section>

#### Beispiel 2: Beibehaltung des Charakters in Rollenspiel-Szenarien

<Tip>**Rollenspiel-Tipp**: Das Prefilling eines eingeklammerten `[ROLE_NAME]` kann Claude daran erinnern, in der Rolle zu bleiben, auch bei längeren und komplexeren Gesprächen. Dies ist besonders wirksam, wenn es mit Role Prompting im `system`-Parameter kombiniert wird.</Tip>

    <section title="Beispiel: Beibehaltung des Charakters ohne Role Prompting">

    | Rolle | Inhalt |
    | ---- | ------- |
    | Benutzer (50 Gesprächsrunden mit „Sherlock Holmes" Claude) | Was schließen Sie über den Besitzer dieses Schuhs? \<image>muddy_shoe.jpg\</image> |
    | Assistent | Als KI-Assistent würde ich mich freuen, das Bild eines schlammigen Schuhs so zu analysieren, als hätten Sie es bereitgestellt. Hier ist meine Deduktion... |
    
</section>

    <section title="Beispiel: Beibehaltung des Charakters mit Role Prompting">

    | Rolle | Inhalt |
    | ---- | ------- |
    | Benutzer (50 Gesprächsrunden mit „Sherlock Holmes" Claude) | Was schließen Sie über den Besitzer dieses Schuhs? <br/>\<image>muddy_shoe.jpg\</image> |
    | Assistent (Prefill) | [Sherlock Holmes] |
    | Assistent (Claudes Antwort) | Ah, was haben wir denn hier? Ein äußerst neugieriges Exemplar, Watson! Lassen Sie uns diesen Schuh mit einem scharfsinnigen Auge untersuchen. Der Schlamm, sehen Sie, ist nicht Ihr gewöhnlicher Londoner Ton, sondern vielmehr der charakteristische rötliche Farbton des eisenreichen Bodens, der nur in der Umgebung von Hampstead Heath zu finden ist. Und doch deuten die Verschleißspuren auf der Sohle auf einen Gang hin, der eher zu den Kopfsteinpflastern von Whitechapel passt als zu den sanften Hängen der Heath.<br/><br/>Beachten Sie nun die Schnürsenkel! Sie sind mit einem besonderen Knoten gebunden, der von denen in der medizinischen Profession bevorzugt wird – zweifellos eine Gewohnheit, die sich über Jahre des Bindens von Operationskitteln entwickelt hat. Aber die Kratzer auf der Zehenbox erzählen eine andere Geschichte: Sie sind konsistent mit der Tritttechnik, die man in den Kampfkünsten anwenden könnte, speziell Baritsu.<br/><br/>Wir können daher schließen, dass unser abwesender Schuhbesitzer ein Arzt ist, möglicherweise ein Chirurg, der in Whitechapel wohnt, aber häufig Hampstead Heath besucht – vielleicht für ein geheimes Baritsu-Training, weg von neugierigen Blicken. Ein äußerst faszinierender Fall, Watson! Wir müssen uns beeilen; das Spiel ist im Gange! |
    
</section>

---

<CardGroup cols={3}>
  <Card title="Arbeiten mit Nachrichten" icon="messages" href="/docs/de/build-with-claude/working-with-messages">
    Weitere Beispiele für Prefill und andere Messages API-Muster.
  </Card>
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