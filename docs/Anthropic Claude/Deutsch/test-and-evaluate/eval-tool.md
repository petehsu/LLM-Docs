# Verwendung des Evaluierungs-Tools

Die [Claude Console](/dashboard) verfügt über ein **Evaluierungs-Tool**, mit dem Sie Ihre Prompts unter verschiedenen Szenarien testen können.

---

## Zugriff auf die Evaluierungs-Funktion

Um mit dem Evaluierungs-Tool zu beginnen:

1. Öffnen Sie die Claude Console und navigieren Sie zum Prompt-Editor.
2. Nachdem Sie Ihren Prompt verfasst haben, suchen Sie nach dem 'Evaluieren'-Tab oben auf dem Bildschirm.

![Zugriff auf die Evaluierungs-Funktion](/docs/images/access_evaluate.png)

<Tip>
Stellen Sie sicher, dass Ihr Prompt mindestens 1-2 dynamische Variablen mit der doppelten geschweiften Klammer-Syntax enthält: \{\{variable\}\}. Dies ist erforderlich für die Erstellung von Evaluierungs-Testsets.
</Tip>

## Generierung von Prompts

Die Console bietet einen eingebauten [Prompt-Generator](/docs/de/build-with-claude/prompt-engineering/prompt-generator), der von Claude Opus 4.1 betrieben wird:

<Steps>
  <Step title="Klicken Sie auf 'Prompt Generieren'">
    Das Klicken auf das 'Prompt Generieren'-Hilfstool öffnet ein Modal, in dem Sie Ihre Aufgabeninformationen eingeben können.
  </Step>
  <Step title="Beschreiben Sie Ihre Aufgabe">
    Beschreiben Sie Ihre gewünschte Aufgabe (z.B. "Eingehende Kundensupport-Anfragen triagieren") mit so viel oder so wenig Detail, wie Sie möchten. Je mehr Kontext Sie einbeziehen, desto mehr kann Claude seinen generierten Prompt an Ihre spezifischen Bedürfnisse anpassen.
  </Step>
  <Step title="Generieren Sie Ihren Prompt">
    Das Klicken auf den orangenen 'Prompt Generieren'-Button unten lässt Claude einen hochwertigen Prompt für Sie generieren. Sie können diese Prompts dann mit dem Evaluierungs-Bildschirm in der Console weiter verbessern.
  </Step>
</Steps>

Diese Funktion macht es einfacher, Prompts mit der entsprechenden Variablen-Syntax für die Evaluierung zu erstellen.

![Prompt-Generator](/docs/images/promptgenerator.png)

## Erstellung von Testfällen

Wenn Sie auf den Evaluierungs-Bildschirm zugreifen, haben Sie mehrere Optionen zur Erstellung von Testfällen:

1. Klicken Sie auf den '+ Zeile hinzufügen'-Button unten links, um manuell einen Fall hinzuzufügen.
2. Verwenden Sie die 'Testfall Generieren'-Funktion, um Claude automatisch Testfälle für Sie generieren zu lassen.
3. Importieren Sie Testfälle aus einer CSV-Datei.

Um die 'Testfall Generieren'-Funktion zu verwenden:

<Steps>
  <Step title="Klicken Sie auf 'Testfall Generieren'">
    Claude wird Testfälle für Sie generieren, eine Zeile nach der anderen für jedes Mal, wenn Sie den Button klicken.
  </Step>
  <Step title="Generierungslogik bearbeiten (optional)">
    Sie können auch die Testfall-Generierungslogik bearbeiten, indem Sie auf den Pfeil-Dropdown rechts neben dem 'Testfall Generieren'-Button klicken, dann auf 'Generierungslogik anzeigen' oben im Variablen-Fenster, das sich öffnet. Möglicherweise müssen Sie auf 'Generieren' oben rechts in diesem Fenster klicken, um die anfängliche Generierungslogik zu füllen.
    
    Das Bearbeiten ermöglicht es Ihnen, die Testfälle, die Claude generiert, mit größerer Präzision und Spezifität anzupassen und fein abzustimmen.
  </Step>
</Steps>

Hier ist ein Beispiel eines gefüllten Evaluierungs-Bildschirms mit mehreren Testfällen:

![Gefüllter Evaluierungs-Bildschirm](/docs/images/eval_populated.png)

<Note>
Wenn Sie Ihren ursprünglichen Prompt-Text aktualisieren, können Sie die gesamte Evaluierungs-Suite gegen den neuen Prompt erneut ausführen, um zu sehen, wie sich Änderungen auf die Leistung über alle Testfälle hinweg auswirken.
</Note>

## Tipps für effektive Evaluierung

<section title="Prompt-Struktur für Evaluierung">

Um das Beste aus dem Evaluierungs-Tool herauszuholen, strukturieren Sie Ihre Prompts mit klaren Eingabe- und Ausgabeformaten. Zum Beispiel:

```
In dieser Aufgabe werden Sie eine süße einsätzige Geschichte generieren, die zwei Elemente einbezieht: eine Farbe und ein Geräusch.
Die Farbe, die in die Geschichte einbezogen werden soll, ist:
<color>
{{COLOR}}
</color>
Das Geräusch, das in die Geschichte einbezogen werden soll, ist:
<sound>
{{SOUND}}
</sound>
Hier sind die Schritte zur Generierung der Geschichte:
1. Denken Sie an ein Objekt, Tier oder eine Szene, die häufig mit der angegebenen Farbe assoziiert wird. Zum Beispiel, wenn die Farbe "blau" ist, könnten Sie an den Himmel, das Meer oder einen Blauvogel denken.
2. Stellen Sie sich eine einfache Handlung, ein Ereignis oder eine Szene vor, die das farbige Objekt/Tier/die Szene, die Sie identifiziert haben, und das angegebene Geräusch einbezieht. Zum Beispiel, wenn die Farbe "blau" ist und das Geräusch "pfeifen", könnten Sie sich einen Blauvogel vorstellen, der eine Melodie pfeift.
3. Beschreiben Sie die Handlung, das Ereignis oder die Szene, die Sie sich vorgestellt haben, in einem einzigen, prägnanten Satz. Konzentrieren Sie sich darauf, den Satz süß, evokativ und fantasievoll zu gestalten. Zum Beispiel: "Ein fröhlicher Blauvogel pfiff eine muntere Melodie, während er durch den azurblauen Himmel schwebte."
Bitte halten Sie Ihre Geschichte auf nur einen Satz. Zielen Sie darauf ab, diesen Satz so charmant und ansprechend wie möglich zu gestalten, während Sie die gegebene Farbe und das Geräusch natürlich einbeziehen.
Schreiben Sie Ihre vollendete einsätzige Geschichte in <story>-Tags.

```

Diese Struktur macht es einfach, Eingaben (\{\{COLOR\}\} und \{\{SOUND\}\}) zu variieren und Ausgaben konsistent zu evaluieren.

</section>

<Tip>
Verwenden Sie das 'Prompt generieren'-Hilfstool in der Console, um schnell Prompts mit der entsprechenden Variablen-Syntax für die Evaluierung zu erstellen.
</Tip>

## Verstehen und Vergleichen von Ergebnissen

Das Evaluierungs-Tool bietet mehrere Funktionen, um Ihnen bei der Verfeinerung Ihrer Prompts zu helfen:

1. **Seite-an-Seite-Vergleich**: Vergleichen Sie die Ausgaben von zwei oder mehr Prompts, um schnell die Auswirkungen Ihrer Änderungen zu sehen.
2. **Qualitätsbewertung**: Bewerten Sie die Antwortqualität auf einer 5-Punkte-Skala, um Verbesserungen in der Antwortqualität pro Prompt zu verfolgen.
3. **Prompt-Versionierung**: Erstellen Sie neue Versionen Ihres Prompts und führen Sie die Test-Suite erneut aus, um schnell zu iterieren und Ergebnisse zu verbessern.

Durch die Überprüfung der Ergebnisse über Testfälle hinweg und den Vergleich verschiedener Prompt-Versionen können Sie Muster erkennen und informierte Anpassungen an Ihrem Prompt effizienter vornehmen.

Beginnen Sie heute mit der Evaluierung Ihrer Prompts, um robustere KI-Anwendungen mit Claude zu erstellen!