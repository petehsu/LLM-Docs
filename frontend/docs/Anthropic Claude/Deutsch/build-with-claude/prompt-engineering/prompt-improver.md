# Verwenden Sie unseren Prompt-Verbesserer, um Ihre Prompts zu optimieren

---

<Note>
Unser Prompt-Verbesserer ist mit allen Claude-Modellen kompatibel, einschließlich derer mit erweiterten Denkfähigkeiten. Für Prompting-Tipps speziell für Modelle mit erweitertem Denken, siehe [hier](/docs/de/build-with-claude/extended-thinking).
</Note>

Der Prompt-Verbesserer hilft Ihnen, Ihre Prompts durch automatisierte Analyse und Verbesserung schnell zu iterieren und zu verbessern. Er eignet sich besonders gut für die Optimierung von Prompts für komplexe Aufgaben, die hohe Genauigkeit erfordern.

<Frame>
  ![Image](/docs/images/prompt_improver.png)
</Frame>

## Bevor Sie beginnen

Sie benötigen:
- Eine [Prompt-Vorlage](/docs/de/build-with-claude/prompt-engineering/prompt-templates-and-variables) zur Verbesserung
- Feedback zu aktuellen Problemen mit Claudes Ausgaben (optional, aber empfohlen)
- Beispieleingaben und ideale Ausgaben (optional, aber empfohlen)

## Wie der Prompt-Verbesserer funktioniert

Der Prompt-Verbesserer optimiert Ihre Prompts in 4 Schritten:

1. **Beispielidentifikation**: Lokalisiert und extrahiert Beispiele aus Ihrer Prompt-Vorlage
2. **Erster Entwurf**: Erstellt eine strukturierte Vorlage mit klaren Abschnitten und XML-Tags
3. **Verfeinerung der Gedankenkette**: Fügt detaillierte Denkanweisungen hinzu und verfeinert diese
4. **Beispielverbesserung**: Aktualisiert Beispiele, um den neuen Denkprozess zu demonstrieren

Sie können diese Schritte in Echtzeit im Verbesserungsmodal verfolgen.

<Frame>
  ![Image](/docs/images/prompt_improver_modal.png)
</Frame>

## Was Sie erhalten

Der Prompt-Verbesserer generiert Vorlagen mit:
- Detaillierten Anweisungen zur Gedankenkette, die Claudes Denkprozess leiten und typischerweise seine Leistung verbessern
- Klarer Organisation durch XML-Tags zur Trennung verschiedener Komponenten
- Standardisierter Beispielformatierung, die schrittweises Denken von der Eingabe zur Ausgabe demonstriert
- Strategischen Vorbelegungen, die Claudes erste Antworten lenken

<Note>
Während Beispiele in der Workbench-Benutzeroberfläche separat erscheinen, werden sie in der tatsächlichen API-Anfrage am Anfang der ersten Benutzernachricht eingefügt. Sehen Sie sich das Rohformat an, indem Sie auf "**\<\/\> Get Code**" klicken, oder fügen Sie Beispiele als Rohtext über das Beispielfeld ein.
</Note>

## Wie man den Prompt-Verbesserer verwendet

1. Reichen Sie Ihre Prompt-Vorlage ein
2. Fügen Sie Feedback zu Problemen mit Claudes aktuellen Ausgaben hinzu (z.B. "Zusammenfassungen sind zu grundlegend für Fachpublikum")
3. Fügen Sie Beispieleingaben und ideale Ausgaben hinzu
4. Überprüfen Sie den verbesserten Prompt

## Testbeispiele generieren

Sie haben noch keine Beispiele? Nutzen Sie unseren [Testfall-Generator](/docs/de/test-and-evaluate/eval-tool#creating-test-cases) um:
1. Beispieleingaben zu generieren
2. Claudes Antworten zu erhalten
3. Die Antworten entsprechend Ihrer idealen Ausgaben zu bearbeiten
4. Die überarbeiteten Beispiele Ihrem Prompt hinzuzufügen

## Wann der Prompt-Verbesserer verwendet werden sollte

Der Prompt-Verbesserer funktioniert am besten für:
- Komplexe Aufgaben, die detailliertes Denken erfordern
- Situationen, in denen Genauigkeit wichtiger ist als Geschwindigkeit
- Probleme, bei denen Claudes aktuelle Ausgaben erhebliche Verbesserungen benötigen

<Note>
Für latenz- oder kostenempfindliche Anwendungen sollten Sie einfachere Prompts in Betracht ziehen. Der Prompt-Verbesserer erstellt Vorlagen, die längere, gründlichere, aber langsamere Antworten produzieren.
</Note>

## Beispiel einer Verbesserung

Hier sehen Sie, wie der Prompt-Verbesserer einen einfachen Klassifizierungs-Prompt verbessert:

<section title="Ursprünglicher Prompt">

```
Identifiziere aus der folgenden Liste von Wikipedia-Artikeltiteln, aus welchem Artikel dieser Satz stammt.
Antworte nur mit dem Artikeltitel und nichts anderem.

Artikeltitel:
{{titles}}

Zu klassifizierender Satz:
{{sentence}}
```

</section>

<section title="Verbesserter Prompt">

```
Sie sind ein intelligentes Textklassifizierungssystem, das sich darauf spezialisiert hat, Sätze Wikipedia-Artikeltiteln zuzuordnen. Ihre Aufgabe ist es, zu identifizieren, zu welchem Wikipedia-Artikel ein gegebener Satz am wahrscheinlichsten gehört, basierend auf einer bereitgestellten Liste von Artikeltiteln.

Überprüfen Sie zunächst die folgende Liste von Wikipedia-Artikeltiteln:
<article_titles>
{{titles}}
</article_titles>

Betrachten Sie nun diesen zu klassifizierenden Satz:
<sentence_to_classify>
{{sentence}}
</sentence_to_classify>

Ihr Ziel ist es, zu bestimmen, welcher Artikeltitel aus der bereitgestellten Liste am besten zum gegebenen Satz passt. Folgen Sie diesen Schritten:

1. Listen Sie die Schlüsselkonzepte aus dem Satz auf
2. Vergleichen Sie jedes Schlüsselkonzept mit den Artikeltiteln
3. Ordnen Sie die 3 relevantesten Titel und erklären Sie, warum sie relevant sind
4. Wählen Sie den am besten geeigneten Artikeltitel, der den Inhalt des Satzes am besten umfasst oder sich darauf bezieht

Umschließen Sie Ihre Analyse mit <analysis>-Tags. Fügen Sie Folgendes ein:
- Liste der Schlüsselkonzepte aus dem Satz
- Vergleich jedes Schlüsselkonzepts mit den Artikeltiteln
- Ranking der 3 relevantesten Titel mit Erklärungen
- Ihre endgültige Wahl und Begründung

Geben Sie nach Ihrer Analyse Ihre endgültige Antwort: den einzelnen am besten geeigneten Wikipedia-Artikeltitel aus der Liste.

Geben Sie nur den gewählten Artikeltitel aus, ohne zusätzlichen Text oder Erklärung.
```

</section>

Beachten Sie, wie der verbesserte Prompt:
- Klare schrittweise Denkanweisungen hinzufügt
- XML-Tags zur Organisation des Inhalts verwendet
- Explizite Anforderungen an das Ausgabeformat bereitstellt
- Claude durch den Analyseprozess führt

## Fehlerbehebung

Häufige Probleme und Lösungen:

- **Beispiele erscheinen nicht in der Ausgabe**: Überprüfen Sie, ob die Beispiele korrekt mit XML-Tags formatiert sind und am Anfang der ersten Benutzernachricht erscheinen
- **Gedankenkette zu ausführlich**: Fügen Sie spezifische Anweisungen zur gewünschten Ausgabelänge und zum Detailgrad hinzu
- **Denkschritte passen nicht zu Ihren Anforderungen**: Modifizieren Sie den Schrittabschnitt entsprechend Ihrem spezifischen Anwendungsfall

***

## Nächste Schritte

<CardGroup cols={3}>
  <Card title="Prompt-Bibliothek" icon="link" href="/docs/de/resources/prompt-library/library">
    Lassen Sie sich von Beispiel-Prompts für verschiedene Aufgaben inspirieren.
  </Card>
  <Card title="GitHub Prompting-Tutorial" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    Lernen Sie Best Practices für Prompting mit unserem interaktiven Tutorial.
  </Card>
  <Card title="Testen Sie Ihre Prompts" icon="link" href="/docs/de/test-and-evaluate/eval-tool">
    Nutzen Sie unser Evaluierungstool, um Ihre verbesserten Prompts zu testen.
  </Card>
</CardGroup>