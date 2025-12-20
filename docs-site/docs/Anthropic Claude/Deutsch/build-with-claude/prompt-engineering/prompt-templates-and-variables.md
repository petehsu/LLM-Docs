# Prompt-Vorlagen und Variablen verwenden

---

Beim Bereitstellen einer LLM-basierten Anwendung mit Claude bestehen Ihre API-Aufrufe typischerweise aus zwei Arten von Inhalten:
- **Fester Inhalt:** Statische Anweisungen oder Kontext, die über mehrere Interaktionen hinweg konstant bleiben
- **Variabler Inhalt:** Dynamische Elemente, die sich mit jeder Anfrage oder Unterhaltung ändern, wie zum Beispiel:
    - Benutzereingaben
    - Abgerufene Inhalte für Retrieval-Augmented Generation (RAG)
    - Unterhaltungskontext wie Benutzerkontoverlauf
    - Systemgenerierte Daten wie Tool-Nutzungsergebnisse, die aus anderen unabhängigen Aufrufen an Claude eingespeist werden

Eine **Prompt-Vorlage** kombiniert diese festen und variablen Teile und verwendet Platzhalter für den dynamischen Inhalt. In der [Claude Console](/) werden diese Platzhalter mit **\{\{doppelten Klammern\}\}** gekennzeichnet, wodurch sie leicht identifizierbar sind und das schnelle Testen verschiedener Werte ermöglichen.

---

# Wann Prompt-Vorlagen und Variablen verwendet werden sollten
Sie sollten immer Prompt-Vorlagen und Variablen verwenden, wenn Sie erwarten, dass ein Teil Ihres Prompts in einem anderen Aufruf an Claude wiederholt wird (nur über die API oder die [Claude Console](/). [claude.ai](https://claude.ai/) unterstützt derzeit keine Prompt-Vorlagen oder Variablen).

Prompt-Vorlagen bieten mehrere Vorteile:
- **Konsistenz:** Gewährleisten Sie eine konsistente Struktur für Ihre Prompts über mehrere Interaktionen hinweg
- **Effizienz:** Tauschen Sie variablen Inhalt einfach aus, ohne den gesamten Prompt neu zu schreiben
- **Testbarkeit:** Testen Sie schnell verschiedene Eingaben und Grenzfälle, indem Sie nur den variablen Teil ändern
- **Skalierbarkeit:** Vereinfachen Sie das Prompt-Management, während Ihre Anwendung an Komplexität zunimmt
- **Versionskontrolle:** Verfolgen Sie Änderungen an Ihrer Prompt-Struktur im Laufe der Zeit einfach, indem Sie nur den Kernbereich Ihres Prompts im Auge behalten, getrennt von dynamischen Eingaben

Die [Claude Console](/) verwendet Prompt-Vorlagen und Variablen intensiv, um Funktionen und Tools für all das oben Genannte zu unterstützen, wie zum Beispiel mit dem:
- **[Prompt-Generator](/docs/de/build-with-claude/prompt-engineering/prompt-generator):** Entscheidet, welche Variablen Ihr Prompt benötigt, und schließt sie in die Vorlage ein, die er ausgibt
- **[Prompt-Verbesserer](/docs/de/build-with-claude/prompt-engineering/prompt-improver):** Nimmt Ihre bestehende Vorlage, einschließlich aller Variablen, und behält sie in der verbesserten Vorlage bei, die er ausgibt
- **[Evaluierungstool](/docs/de/test-and-evaluate/eval-tool):** Ermöglicht es Ihnen, Versionen Ihrer Prompts einfach zu testen, zu skalieren und zu verfolgen, indem die variablen und festen Teile Ihrer Prompt-Vorlage getrennt werden

---

# Beispiel einer Prompt-Vorlage

Betrachten wir eine einfache Anwendung, die englischen Text ins Spanische übersetzt. Der übersetzte Text wäre variabel, da Sie erwarten würden, dass sich dieser Text zwischen Benutzern oder Aufrufen an Claude ändert. Dieser übersetzte Text könnte dynamisch aus Datenbanken oder der Benutzereingabe abgerufen werden.

Für Ihre Übersetzungsapp könnten Sie also diese einfache Prompt-Vorlage verwenden:
```
Übersetze diesen Text vom Englischen ins Spanische: {{text}}
```

---

## Nächste Schritte

<CardGroup cols={2}>
  <Card title="Einen Prompt generieren" icon="link" href="/docs/de/build-with-claude/prompt-engineering/prompt-generator">
    Erfahren Sie mehr über den Prompt-Generator in der Claude Console und versuchen Sie sich daran, Claude einen Prompt für Sie generieren zu lassen.
  </Card>
  <Card title="XML-Tags anwenden" icon="link" href="/docs/de/build-with-claude/prompt-engineering/use-xml-tags">
    Wenn Sie Ihr Prompt-Variablen-Spiel verbessern möchten, umhüllen Sie sie mit XML-Tags.
  </Card>
  <Card title="Claude Console" icon="link" href="/">
    Schauen Sie sich die unzähligen Prompt-Entwicklungstools an, die in der Claude Console verfügbar sind.
  </Card>
</CardGroup>