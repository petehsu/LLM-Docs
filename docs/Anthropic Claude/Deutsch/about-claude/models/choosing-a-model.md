# Das richtige Modell wählen

Die Auswahl des optimalen Claude-Modells für Ihre Anwendung erfordert das Abwägen von drei Schlüsselüberlegungen: Funktionen, Geschwindigkeit und Kosten. Dieser Leitfaden hilft Ihnen, eine fundierte Entscheidung basierend auf Ihren spezifischen Anforderungen zu treffen.

---

## Schlüsselkriterien festlegen

Bei der Auswahl eines Claude-Modells empfehlen wir, zunächst diese Faktoren zu bewerten:
- **Funktionen:** Welche spezifischen Funktionen oder Fähigkeiten muss das Modell haben, um Ihre Anforderungen zu erfüllen?
- **Geschwindigkeit:** Wie schnell muss das Modell in Ihrer Anwendung reagieren?
- **Kosten:** Wie ist Ihr Budget für Entwicklungs- und Produktionsnutzung?

Wenn Sie diese Antworten im Voraus kennen, wird es viel einfacher, die Auswahl einzugrenzen und zu entscheiden, welches Modell verwendet werden soll.

***

## Wählen Sie das beste Modell zum Starten

Es gibt zwei allgemeine Ansätze, die Sie verwenden können, um zu testen, welches Claude-Modell am besten für Ihre Anforderungen geeignet ist.

### Option 1: Mit einem schnellen, kostengünstigen Modell starten

Für viele Anwendungen kann der Start mit einem schnelleren, kostengünstigeren Modell wie Claude Haiku 4.5 der optimale Ansatz sein:

1. Beginnen Sie die Implementierung mit Claude Haiku 4.5
2. Testen Sie Ihren Anwendungsfall gründlich
3. Bewerten Sie, ob die Leistung Ihre Anforderungen erfüllt
4. Führen Sie ein Upgrade nur durch, wenn dies für spezifische Funktionslücken erforderlich ist

Dieser Ansatz ermöglicht schnelle Iterationen, niedrigere Entwicklungskosten und ist oft für viele häufige Anwendungen ausreichend. Dieser Ansatz ist am besten für:
- Erste Prototypisierung und Entwicklung
- Anwendungen mit strikten Latenzanforderungen
- Kostensensitive Implementierungen
- Hochvolumige, unkomplizierte Aufgaben

### Option 2: Mit dem leistungsfähigsten Modell starten

Für komplexe Aufgaben, bei denen Intelligenz und fortgeschrittene Funktionen von größter Bedeutung sind, möchten Sie möglicherweise mit dem leistungsfähigsten Modell beginnen und dann später erwägen, zu effizienteren Modellen zu optimieren:

1. Implementieren Sie mit Claude Sonnet 4.5
2. Optimieren Sie Ihre Prompts für diese Modelle
3. Bewerten Sie, ob die Leistung Ihre Anforderungen erfüllt
4. Erwägen Sie, die Effizienz durch Herabstufung der Intelligenz im Laufe der Zeit mit größerer Workflow-Optimierung zu verbessern

Dieser Ansatz ist am besten für:
- Komplexe Reasoning-Aufgaben
- Wissenschaftliche oder mathematische Anwendungen
- Aufgaben, die nuanciertes Verständnis erfordern
- Anwendungen, bei denen Genauigkeit wichtiger ist als Kosten
- Fortgeschrittenes Coding

## Modellauswahlmatrix

| Wenn Sie benötigen... | Wir empfehlen, mit... zu beginnen | Beispiel-Anwendungsfälle |
|------------------|-------------------|-------------------|
| Bestes Modell für komplexe Agenten und Coding, höchste Intelligenz bei den meisten Aufgaben, überlegene Tool-Orchestrierung für langfristige autonome Aufgaben | Claude Sonnet 4.5 | Autonome Coding-Agenten, Cybersecurity-Automatisierung, komplexe Finanzanalyse, mehrstündige Forschungsaufgaben, Multi-Agent-Frameworks |
| Maximale Intelligenz mit praktischer Leistung für komplexe spezialisierte Aufgaben | Claude Opus 4.5 | Professionelle Softwareentwicklung, fortgeschrittene Agenten für Büroaufgaben, Computer- und Browsernutzung im großen Maßstab, Sprunghafte Vision-Anwendungen |
| Außergewöhnliche Intelligenz und Reasoning für spezialisierte komplexe Aufgaben | Claude Opus 4.1 | Hochkomplexe Codebase-Umgestaltung, nuanciertes kreatives Schreiben, spezialisierte wissenschaftliche Analyse |
| Nahezu Frontier-Leistung mit blitzschneller Geschwindigkeit und erweitertem Denken - unser schnellstes und intelligentestes Haiku-Modell zum wirtschaftlichsten Preis | Claude Haiku 4.5 | Echtzeit-Anwendungen, hochvolumige intelligente Verarbeitung, kostensensitive Bereitstellungen mit starkem Reasoning, Sub-Agent-Aufgaben |

***

## Entscheiden Sie, ob Sie ein Upgrade durchführen oder Modelle wechseln möchten

Um festzustellen, ob Sie ein Upgrade durchführen oder Modelle wechseln müssen, sollten Sie:
1. [Benchmark-Tests erstellen](/docs/de/test-and-evaluate/develop-tests), die spezifisch für Ihren Anwendungsfall gelten - ein guter Evaluierungssatz ist der wichtigste Schritt im Prozess
2. Mit Ihren tatsächlichen Prompts und Daten testen
3. Die Leistung über Modelle hinweg vergleichen für:
   - Genauigkeit der Antworten
   - Qualität der Antworten
   - Behandlung von Grenzfällen
4. Leistungs- und Kostenabwägungen berücksichtigen

## Nächste Schritte

<CardGroup cols={3}>
  <Card title="Modellvergleichstabelle" icon="settings" href="/docs/de/about-claude/models/overview">
    Siehe detaillierte Spezifikationen und Preise für die neuesten Claude-Modelle
  </Card>
  <Card title="Neuerungen in Claude 4.5" icon="sparkle" href="/docs/de/about-claude/models/whats-new-claude-4-5">
    Erkunden Sie die neuesten Verbesserungen in Claude 4.5-Modellen
  </Card>
  <Card title="Beginnen Sie mit der Entwicklung" icon="code" href="/docs/de/get-started">
    Beginnen Sie mit Ihrem ersten API-Aufruf
  </Card>
</CardGroup>