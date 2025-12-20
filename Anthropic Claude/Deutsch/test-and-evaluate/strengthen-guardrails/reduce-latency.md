# Latenz reduzieren

Lernen Sie, wie Sie die Latenz bei Claude-Modellen reduzieren können, einschließlich Modellauswahl, Prompt-Optimierung und Streaming-Techniken.

---

Latenz bezieht sich auf die Zeit, die das Modell benötigt, um einen Prompt zu verarbeiten und eine Ausgabe zu generieren. Die Latenz kann von verschiedenen Faktoren beeinflusst werden, wie der Größe des Modells, der Komplexität des Prompts und der zugrunde liegenden Infrastruktur, die das Modell und den Interaktionspunkt unterstützt.

<Note>
Es ist immer besser, zuerst einen Prompt zu entwickeln, der ohne Modell- oder Prompt-Beschränkungen gut funktioniert, und dann anschließend Strategien zur Latenzreduzierung auszuprobieren. Der Versuch, die Latenz vorzeitig zu reduzieren, könnte Sie daran hindern zu entdecken, wie Spitzenleistung aussieht.
</Note>

---

## Wie man Latenz misst

Bei der Diskussion über Latenz können Sie auf verschiedene Begriffe und Messungen stoßen:

- **Grundlatenz**: Dies ist die Zeit, die das Modell benötigt, um den Prompt zu verarbeiten und die Antwort zu generieren, ohne die Eingabe- und Ausgabe-Token pro Sekunde zu berücksichtigen. Es bietet eine allgemeine Vorstellung von der Geschwindigkeit des Modells.
- **Zeit bis zum ersten Token (TTFT)**: Diese Metrik misst die Zeit, die das Modell benötigt, um das erste Token der Antwort zu generieren, ab dem Zeitpunkt, an dem der Prompt gesendet wurde. Sie ist besonders relevant, wenn Sie Streaming verwenden (mehr dazu später) und Ihren Benutzern eine responsive Erfahrung bieten möchten.

Für ein tieferes Verständnis dieser Begriffe schauen Sie sich unser [Glossar](/docs/de/about-claude/glossary) an.

---

## Wie man Latenz reduziert

### 1. Das richtige Modell wählen

Eine der einfachsten Möglichkeiten, die Latenz zu reduzieren, ist die Auswahl des geeigneten Modells für Ihren Anwendungsfall. Anthropic bietet eine [Reihe von Modellen](/docs/de/about-claude/models/overview) mit unterschiedlichen Fähigkeiten und Leistungsmerkmalen. Berücksichtigen Sie Ihre spezifischen Anforderungen und wählen Sie das Modell, das am besten zu Ihren Bedürfnissen in Bezug auf Geschwindigkeit und Ausgabequalität passt.

Für geschwindigkeitskritische Anwendungen bietet **Claude Haiku 4.5** die schnellsten Antwortzeiten bei gleichzeitig hoher Intelligenz:

```python
import anthropic

client = anthropic.Anthropic()

# Für zeitkritische Anwendungen verwenden Sie Claude Haiku 4.5
message = client.messages.create(
    model="claude-haiku-4-5",
    max_tokens=100,
    messages=[{
        "role": "user",
        "content": "Fassen Sie dieses Kundenfeedback in 2 Sätzen zusammen: [Feedback-Text]"
    }]
)
```

Für weitere Details zu Modellmetriken siehe unsere [Modellübersicht](/docs/de/about-claude/models/overview) Seite.

### 2. Prompt- und Ausgabelänge optimieren

Minimieren Sie die Anzahl der Token sowohl in Ihrem Eingabe-Prompt als auch in der erwarteten Ausgabe, während Sie weiterhin eine hohe Leistung aufrechterhalten. Je weniger Token das Modell verarbeiten und generieren muss, desto schneller wird die Antwort sein.

Hier sind einige Tipps, die Ihnen helfen, Ihre Prompts und Ausgaben zu optimieren:

- **Seien Sie klar, aber prägnant**: Versuchen Sie, Ihre Absicht klar und prägnant im Prompt zu vermitteln. Vermeiden Sie unnötige Details oder redundante Informationen, während Sie im Hinterkopf behalten, dass [Claude Kontext fehlt](/docs/de/build-with-claude/prompt-engineering/be-clear-and-direct) zu Ihrem Anwendungsfall und möglicherweise nicht die beabsichtigten logischen Sprünge macht, wenn die Anweisungen unklar sind.
- **Bitten Sie um kürzere Antworten**: Bitten Sie Claude direkt, prägnant zu sein. Die Claude 3-Modellfamilie hat eine verbesserte Steuerbarkeit gegenüber früheren Generationen. Wenn Claude unerwünscht lange Ausgaben produziert, bitten Sie Claude, [seine Gesprächigkeit zu zügeln](/docs/de/build-with-claude/prompt-engineering/be-clear-and-direct).
  <Tip> Aufgrund der Art, wie LLMs [Token](/docs/de/about-claude/glossary#tokens) anstatt Wörter zählen, ist das Bitten um eine genaue Wortanzahl oder eine Wortanzahlbegrenzung nicht so effektive Strategie wie das Bitten um Absatz- oder Satzanzahlbegrenzungen.</Tip>
- **Setzen Sie angemessene Ausgabegrenzen**: Verwenden Sie den `max_tokens`-Parameter, um eine harte Grenze für die maximale Länge der generierten Antwort zu setzen. Dies verhindert, dass Claude übermäßig lange Ausgaben generiert.
  > **Hinweis**: Wenn die Antwort `max_tokens` Token erreicht, wird die Antwort abgeschnitten, möglicherweise mitten im Satz oder mitten im Wort, daher ist dies eine grobe Technik, die möglicherweise Nachbearbeitung erfordert und normalerweise am besten für Multiple-Choice- oder Kurzantwort-Antworten geeignet ist, bei denen die Antwort gleich am Anfang kommt.
- **Experimentieren Sie mit der Temperatur**: Der `temperature`-[Parameter](/docs/de/api/messages) steuert die Zufälligkeit der Ausgabe. Niedrigere Werte (z.B. 0,2) können manchmal zu fokussierteren und kürzeren Antworten führen, während höhere Werte (z.B. 0,8) zu vielfältigeren, aber möglicherweise längeren Ausgaben führen können.

Das richtige Gleichgewicht zwischen Prompt-Klarheit, Ausgabequalität und Token-Anzahl zu finden, kann einige Experimente erfordern.

### 3. Streaming nutzen

Streaming ist eine Funktion, die es dem Modell ermöglicht, mit dem Zurücksenden seiner Antwort zu beginnen, bevor die vollständige Ausgabe abgeschlossen ist. Dies kann die wahrgenommene Reaktionsfähigkeit Ihrer Anwendung erheblich verbessern, da Benutzer die Ausgabe des Modells in Echtzeit sehen können.

Mit aktiviertem Streaming können Sie die Ausgabe des Modells verarbeiten, während sie ankommt, Ihre Benutzeroberfläche aktualisieren oder andere Aufgaben parallel ausführen. Dies kann die Benutzererfahrung erheblich verbessern und Ihre Anwendung interaktiver und reaktionsfähiger erscheinen lassen.

Besuchen Sie [Streaming Messages](/docs/de/build-with-claude/streaming), um zu erfahren, wie Sie Streaming für Ihren Anwendungsfall implementieren können.