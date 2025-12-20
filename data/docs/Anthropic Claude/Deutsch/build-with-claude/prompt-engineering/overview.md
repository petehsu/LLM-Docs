# Übersicht über Prompt Engineering

Erfahren Sie, wie Sie Ihre Prompts optimieren können, um bessere Ergebnisse von Claude zu erhalten.

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

## Vor dem Prompt Engineering

Diese Anleitung setzt voraus, dass Sie:
1. Eine klare Definition der Erfolgskriterien für Ihren Anwendungsfall haben
2. Einige Möglichkeiten haben, um empirisch gegen diese Kriterien zu testen
3. Einen ersten Entwurf eines Prompts haben, den Sie verbessern möchten

Falls nicht, empfehlen wir Ihnen dringend, Zeit damit zu verbringen, dies zunächst zu etablieren. Schauen Sie sich [Definieren Sie Ihre Erfolgskriterien](/docs/de/test-and-evaluate/define-success) und [Erstellen Sie starke empirische Evaluierungen](/docs/de/test-and-evaluate/develop-tests) für Tipps und Anleitungen an.

<Card title="Prompt-Generator" icon="link" href="/dashboard">
  Haben Sie keinen ersten Entwurf eines Prompts? Probieren Sie den Prompt-Generator in der Claude Console aus!
</Card>

***

## Wann Sie Prompt Engineering durchführen sollten

  Diese Anleitung konzentriert sich auf Erfolgskriterien, die durch Prompt Engineering kontrollierbar sind.
  Nicht jedes Erfolgskriterium oder fehlgeschlagene Evaluierung wird am besten durch Prompt Engineering gelöst. Zum Beispiel können Latenz und Kosten manchmal leichter durch die Auswahl eines anderen Modells verbessert werden.

<section title="Prompting vs. Finetuning">

  Prompt Engineering ist viel schneller als andere Methoden zur Kontrolle des Modellverhaltens, wie Finetuning, und kann oft zu großen Leistungssteigerungen in viel kürzerer Zeit führen. Hier sind einige Gründe, Prompt Engineering gegenüber Finetuning in Betracht zu ziehen:<br/>
  - **Ressourceneffizienz**: Finetuning erfordert High-End-GPUs und großen Speicher, während Prompt Engineering nur Texteingaben benötigt, was es viel ressourcenfreundlicher macht.
  - **Kosteneffektivität**: Bei Cloud-basierten KI-Diensten entstehen durch Finetuning erhebliche Kosten. Prompt Engineering nutzt das Basismodell, das typischerweise günstiger ist.
  - **Modellaktualisierungen beibehalten**: Wenn Anbieter Modelle aktualisieren, müssen feinabgestimmte Versionen möglicherweise neu trainiert werden. Prompts funktionieren normalerweise über Versionen hinweg ohne Änderungen.
  - **Zeitsparend**: Finetuning kann Stunden oder sogar Tage dauern. Im Gegensatz dazu bietet Prompt Engineering nahezu sofortige Ergebnisse und ermöglicht schnelle Problemlösung.
  - **Minimale Datenanforderungen**: Finetuning benötigt umfangreiche aufgabenspezifische, gekennzeichnete Daten, die knapp oder teuer sein können. Prompt Engineering funktioniert mit Few-Shot oder sogar Zero-Shot-Lernen.
  - **Flexibilität und schnelle Iteration**: Probieren Sie schnell verschiedene Ansätze aus, passen Sie Prompts an und sehen Sie sofortige Ergebnisse. Diese schnelle Experimentation ist mit Finetuning schwierig.
  - **Domänenanpassung**: Passen Sie Modelle einfach an neue Domänen an, indem Sie domänenspezifischen Kontext in Prompts bereitstellen, ohne neu zu trainieren.
  - **Verbesserungen des Verständnisses**: Prompt Engineering ist viel effektiver als Finetuning, um Modellen zu helfen, externe Inhalte wie abgerufene Dokumente besser zu verstehen und zu nutzen.
  - **Bewahrt allgemeines Wissen**: Finetuning riskiert katastrophales Vergessen, bei dem das Modell allgemeines Wissen verliert. Prompt Engineering behält die breiten Fähigkeiten des Modells bei.
  - **Transparenz**: Prompts sind für Menschen lesbar und zeigen genau, welche Informationen das Modell erhält. Diese Transparenz hilft beim Verständnis und Debuggen.

</section>

***

## Wie Sie Prompt Engineering durchführen

Die Prompt-Engineering-Seiten in diesem Abschnitt wurden von den am weitesten verbreiteten Techniken zu spezialisierteren Techniken organisiert. Bei der Fehlerbehebung von Leistungsproblemen empfehlen wir, diese Techniken der Reihe nach auszuprobieren, obwohl die tatsächliche Auswirkung jeder Technik von Ihrem Anwendungsfall abhängt.
1. [Prompt-Generator](/docs/de/build-with-claude/prompt-engineering/prompt-generator)
2. [Seien Sie klar und direkt](/docs/de/build-with-claude/prompt-engineering/be-clear-and-direct)
3. [Verwenden Sie Beispiele (Multishot)](/docs/de/build-with-claude/prompt-engineering/multishot-prompting)
4. [Lassen Sie Claude denken (Chain of Thought)](/docs/de/build-with-claude/prompt-engineering/chain-of-thought)
5. [Verwenden Sie XML-Tags](/docs/de/build-with-claude/prompt-engineering/use-xml-tags)
6. [Geben Sie Claude eine Rolle (Systemprompts)](/docs/de/build-with-claude/prompt-engineering/system-prompts)
7. [Füllen Sie Claudes Antwort aus](/docs/de/build-with-claude/prompt-engineering/prefill-claudes-response)
8. [Verketten Sie komplexe Prompts](/docs/de/build-with-claude/prompt-engineering/chain-prompts)
9. [Tipps für lange Kontexte](/docs/de/build-with-claude/prompt-engineering/long-context-tips)

***

## Prompt-Engineering-Tutorial

Wenn Sie ein interaktiver Lerner sind, können Sie stattdessen in unsere interaktiven Tutorials eintauchen!

<CardGroup cols={2}>
  <Card title="GitHub Prompting-Tutorial" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    Ein beispielreiches Tutorial, das die Prompt-Engineering-Konzepte aus unserer Dokumentation behandelt.
  </Card>
  <Card title="Google Sheets Prompting-Tutorial" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    Eine leichtere Version unseres Prompt-Engineering-Tutorials über ein interaktives Tabellenkalkulationsblatt.
  </Card>
</CardGroup>