# Mehrsprachige Unterstützung

Claude zeichnet sich bei Aufgaben in mehreren Sprachen aus und behält eine starke sprachübergreifende Leistung im Vergleich zu Englisch bei.

---

## Übersicht

Claude zeigt robuste mehrsprachige Fähigkeiten mit besonders starker Leistung bei Zero-Shot-Aufgaben über verschiedene Sprachen hinweg. Das Modell behält eine konsistente relative Leistung sowohl über weit verbreitete als auch über Sprachen mit weniger Ressourcen hinweg bei, was es zu einer zuverlässigen Wahl für mehrsprachige Anwendungen macht.

Beachten Sie, dass Claude in vielen Sprachen über die unten aufgeführten Benchmarks hinaus fähig ist. Wir empfehlen, Tests mit allen Sprachen durchzuführen, die für Ihre spezifischen Anwendungsfälle relevant sind.

## Leistungsdaten

Nachfolgend finden Sie die Zero-Shot-Chain-of-Thought-Bewertungsergebnisse für Claude 4, Claude 3.7 Sonnet und Claude 3.5-Modelle über verschiedene Sprachen hinweg, dargestellt als Prozentsatz relativ zur englischen Leistung (100%):

| Sprache | Claude Opus 4<sup>1</sup> | Claude Sonnet 4<sup>1</sup> | Claude Sonnet 3.7 ([veraltet](/docs/de/about-claude/model-deprecations))<sup>1</sup> | Claude Haiku 3.5|
|---|---|---|---|---|
| Englisch (Baseline, auf 100% festgelegt) | 100% | 100% | 100% | 100% |
| Spanisch | 98,0% | 97,5% | 97,6% | 94,6% |
| Portugiesisch (Brasilien) | 97,3% | 97,2% | 97,3% | 94,6% |
| Italienisch | 97,5% | 97,3% | 97,2% | 95,0% |
| Französisch | 97,7% | 97,1% | 96,9% | 95,3% |
| Indonesisch | 97,2% | 96,2% | 96,3% | 91,2% |
| Deutsch | 97,1% | 94,7% | 96,2% | 92,5% |
| Arabisch | 96,9% | 96,1% | 95,4% | 84,7% |
| Chinesisch (vereinfacht) | 96,7% | 95,9% | 95,3% | 90,9% |
| Koreanisch | 96,4% | 95,9% | 95,2% | 89,1% |
| Japanisch | 96,2% | 95,6% | 95,0% | 90,8% |
| Hindi | 96,7% | 95,8% | 94,2% | 80,1% |
| Bengalisch | 95,2% | 94,4% | 92,4% | 72,9% |
| Suaheli | 89,5% | 87,1% | 89,2% | 64,7% |
| Yoruba | 78,9% | 76,4% | 76,7% | 46,1% |

<sup>1</sup> Mit [erweitertem Denken](/docs/de/build-with-claude/extended-thinking).

<Note>
Diese Metriken basieren auf [MMLU (Massive Multitask Language Understanding)](https://en.wikipedia.org/wiki/MMLU) englischen Testsets, die von professionellen menschlichen Übersetzern in 14 zusätzliche Sprachen übersetzt wurden, wie in [OpenAIs Simple-Evals-Repository](https://github.com/openai/simple-evals/blob/main/multilingual_mmlu_benchmark_results.md) dokumentiert. Die Verwendung von menschlichen Übersetzern für diese Bewertung gewährleistet hochwertige Übersetzungen, besonders wichtig für Sprachen mit weniger digitalen Ressourcen.
</Note>

***

## Best Practices

Bei der Arbeit mit mehrsprachigen Inhalten:

1. **Geben Sie einen klaren Sprachkontext an**: Obwohl Claude die Zielsprache automatisch erkennen kann, verbessert die explizite Angabe der gewünschten Ein-/Ausgabesprache die Zuverlässigkeit. Für verbesserte Flüssigkeit können Sie Claude auffordern, „idiomatische Sprache zu verwenden, als wäre es ein Muttersprachler."
2. **Verwenden Sie native Schriftsysteme**: Reichen Sie Text in seinem nativen Schriftsystem ein, anstatt ihn zu transliterieren, um optimale Ergebnisse zu erzielen
3. **Berücksichtigen Sie den kulturellen Kontext**: Effektive Kommunikation erfordert oft kulturelles und regionales Bewusstsein über reine Übersetzung hinaus

Wir empfehlen auch, unsere allgemeinen [Richtlinien zur Prompt-Entwicklung](/docs/de/build-with-claude/prompt-engineering/overview) zu befolgen, um die Leistung von Claude weiter zu verbessern.

***

## Überlegungen zur Sprachunterstützung

- Claude verarbeitet Eingaben und generiert Ausgaben in den meisten Weltsprachen, die Standard-Unicode-Zeichen verwenden
- Die Leistung variiert je nach Sprache, mit besonders starken Fähigkeiten in weit verbreiteten Sprachen
- Auch in Sprachen mit weniger digitalen Ressourcen behält Claude aussagekräftige Fähigkeiten bei

<CardGroup cols={2}>
  <Card title="Prompt-Engineering-Leitfaden" icon="edit" href="/docs/de/build-with-claude/prompt-engineering/overview">
    Beherrschen Sie die Kunst der Prompt-Gestaltung, um das Beste aus Claude herauszuholen.
  </Card>
  <Card title="Prompt-Bibliothek" icon="books" href="/docs/de/resources/prompt-library">
    Finden Sie eine breite Palette von vorgefertigten Prompts für verschiedene Aufgaben und Branchen. Perfekt für Inspiration oder schnelle Starts.
  </Card>
</CardGroup>