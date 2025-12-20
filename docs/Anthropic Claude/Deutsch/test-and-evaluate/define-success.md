# Definieren Sie Ihre Erfolgskriterien

---

Der Aufbau einer erfolgreichen LLM-basierten Anwendung beginnt mit der klaren Definition Ihrer Erfolgskriterien. Wie werden Sie wissen, wann Ihre Anwendung gut genug ist, um sie zu veröffentlichen?

Klare Erfolgskriterien stellen sicher, dass Ihre Bemühungen im Prompt Engineering und bei der Optimierung darauf ausgerichtet sind, spezifische, messbare Ziele zu erreichen.

***

## Starke Kriterien entwickeln

Gute Erfolgskriterien sind:
- **Spezifisch**: Definieren Sie klar, was Sie erreichen möchten. Statt "guter Leistung" spezifizieren Sie "präzise Stimmungsklassifizierung".
- **Messbar**: Verwenden Sie quantitative Metriken oder klar definierte qualitative Skalen. Zahlen bieten Klarheit und Skalierbarkeit, aber qualitative Maßnahmen können wertvoll sein, wenn sie konsequent *zusammen* mit quantitativen Maßnahmen angewendet werden.
    - Selbst "unscharfe" Themen wie Ethik und Sicherheit können quantifiziert werden:
        |      | Sicherheitskriterien                |
        | ---- | --- |
        | Schlecht  | Sichere Ausgaben                   |
        | Gut | Weniger als 0,1% der Ausgaben aus 10.000 Versuchen werden von unserem Inhaltsfilter wegen Toxizität markiert. | 
    <section title="Beispielmetriken und Messmethoden">

        **Quantitative Metriken**:
            - Aufgabenspezifisch: F1-Score, BLEU-Score, Perplexität
            - Generisch: Genauigkeit, Präzision, Recall
            - Operativ: Antwortzeit (ms), Betriebszeit (%)

        **Quantitative Methoden**:
            - A/B-Tests: Vergleich der Leistung mit einem Basismodell oder einer früheren Version.
            - Nutzerfeedback: Implizite Messungen wie Aufgabenabschlussraten.
            - Randfall-Analyse: Prozentsatz der Randfälle, die ohne Fehler behandelt werden.

        **Qualitative Skalen**:
            - Likert-Skalen: "Bewerten Sie die Kohärenz von 1 (unsinnig) bis 5 (perfekt logisch)"
            - Expertenrubriken: Linguisten bewerten die Übersetzungsqualität nach definierten Kriterien        
    
</section>
- **Erreichbar**: Basieren Sie Ihre Ziele auf Branchenbenchmarks, früheren Experimenten, KI-Forschung oder Expertenwissen. Ihre Erfolgsmetriken sollten nicht unrealistisch für die aktuellen Fähigkeiten von Spitzenmodellen sein.
- **Relevant**: Richten Sie Ihre Kriterien an dem Zweck Ihrer Anwendung und den Bedürfnissen der Nutzer aus. Eine starke Zitiergenauigkeit könnte für medizinische Apps entscheidend sein, aber weniger wichtig für Casual-Chatbots.

<section title="Beispiel für Aufgabentreukriterien bei der Stimmungsanalyse">

    |      | Kriterien |
    | ---- | --- |
    | Schlecht  | Das Modell sollte Stimmungen gut klassifizieren                    |
    | Gut | Unser Stimmungsanalysemodell sollte einen F1-Score von mindestens 0,85 (Messbar, Spezifisch) auf einem zurückgehaltenen Testset* von 10.000 verschiedenen Twitter-Beiträgen (Relevant) erreichen, was eine Verbesserung von 5% gegenüber unserer aktuellen Baseline darstellt (Erreichbar). |

    **Mehr zu zurückgehaltenen Testsets im nächsten Abschnitt*

</section>

***

## Häufige Erfolgskriterien, die zu berücksichtigen sind

Hier sind einige Kriterien, die für Ihren Anwendungsfall wichtig sein könnten. Diese Liste ist nicht erschöpfend.

  <section title="Aufgabentreue">

    Wie gut muss das Modell die Aufgabe erfüllen? Möglicherweise müssen Sie auch den Umgang mit Randfällen berücksichtigen, z.B. wie gut das Modell mit seltenen oder herausfordernden Eingaben umgehen muss.
  
</section>
  <section title="Konsistenz">

    Wie ähnlich müssen die Antworten des Modells für ähnliche Arten von Eingaben sein? Wenn ein Benutzer die gleiche Frage zweimal stellt, wie wichtig ist es, dass er semantisch ähnliche Antworten erhält?
  
</section>
  <section title="Relevanz und Kohärenz">

    Wie gut geht das Modell direkt auf die Fragen oder Anweisungen des Benutzers ein? Wie wichtig ist es, dass die Informationen logisch und leicht verständlich präsentiert werden?
  
</section>
  <section title="Ton und Stil">

    Wie gut passt der Ausgabestil des Modells zu den Erwartungen? Wie angemessen ist seine Sprache für die Zielgruppe?
  
</section>
  <section title="Datenschutz">

    Was ist eine erfolgreiche Metrik dafür, wie das Modell mit persönlichen oder sensiblen Informationen umgeht? Kann es Anweisungen befolgen, bestimmte Details nicht zu verwenden oder zu teilen?
  
</section>
  <section title="Kontextnutzung">

    Wie effektiv nutzt das Modell den bereitgestellten Kontext? Wie gut bezieht es sich auf Informationen aus seiner Historie und baut darauf auf?
  
</section>
  <section title="Latenz">

    Was ist die akzeptable Antwortzeit für das Modell? Dies hängt von den Echtzeit-Anforderungen Ihrer Anwendung und den Erwartungen der Benutzer ab.
  
</section>
  <section title="Preis">

    Was ist Ihr Budget für den Betrieb des Modells? Berücksichtigen Sie Faktoren wie die Kosten pro API-Aufruf, die Größe des Modells und die Nutzungshäufigkeit.
  
</section>

Die meisten Anwendungsfälle erfordern eine mehrdimensionale Bewertung anhand mehrerer Erfolgskriterien.

<section title="Beispiel für mehrdimensionale Kriterien bei der Stimmungsanalyse">

    |      | Kriterien |
    | ---- | --- |
    | Schlecht  | Das Modell sollte Stimmungen gut klassifizieren                    |
    | Gut | Auf einem zurückgehaltenen Testset von 10.000 verschiedenen Twitter-Beiträgen sollte unser Stimmungsanalysemodell Folgendes erreichen:<br/>- einen F1-Score von mindestens 0,85<br/>- 99,5% der Ausgaben sind nicht toxisch<br/>- 90% der Fehler würden nur Unannehmlichkeiten verursachen, keine schwerwiegenden Fehler*<br/>- 95% Antwortzeit < 200ms |

    **In der Realität würden wir auch definieren, was "Unannehmlichkeiten" und "schwerwiegend" bedeutet.*

</section>

***

## Nächste Schritte

<CardGroup cols={2}>
  <Card title="Kriterien brainstormen" icon="link" href="https://claude.ai/">
    Brainstormen Sie Erfolgskriterien für Ihren Anwendungsfall mit Claude auf claude.ai.<br/><br/>**Tipp**: Fügen Sie diese Seite in den Chat ein als Leitfaden für Claude!
  </Card>
  <Card title="Evaluationen entwerfen" icon="link" href="/docs/de/be-clear-direct">
    Lernen Sie, starke Testsets zu erstellen, um Claudes Leistung anhand Ihrer Kriterien zu messen.
  </Card>
</CardGroup>