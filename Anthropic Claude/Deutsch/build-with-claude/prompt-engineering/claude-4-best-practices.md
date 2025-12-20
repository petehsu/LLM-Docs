# Best Practices für Prompting

Spezifische Prompt-Engineering-Techniken für Claude 4.x Modelle mit Anleitung für Sonnet 4.5, Haiku 4.5 und Opus 4.5.

---

Dieser Leitfaden bietet spezifische Prompt-Engineering-Techniken für Claude 4.x Modelle mit spezifischer Anleitung für Sonnet 4.5, Haiku 4.5 und Opus 4.5. Diese Modelle wurden für präzisere Befolgung von Anweisungen trainiert als frühere Generationen von Claude Modellen.
<Tip>
  Einen Überblick über die neuen Funktionen von Claude 4.5 finden Sie unter [Was ist neu in Claude 4.5](/docs/de/about-claude/models/whats-new-claude-4-5). Für Migrationsleitfäden von früheren Modellen siehe [Migration zu Claude 4.5](/docs/de/about-claude/models/migrating-to-claude-4).
</Tip>

## Allgemeine Prinzipien

### Seien Sie explizit mit Ihren Anweisungen

Claude 4.x Modelle reagieren gut auf klare, explizite Anweisungen. Wenn Sie spezifisch sind, was Sie als Ausgabe wünschen, kann dies die Ergebnisse verbessern. Kunden, die das „über das Hinausgehen" Verhalten von früheren Claude Modellen wünschen, müssen diese Verhaltensweisen bei neueren Modellen möglicherweise expliziter anfordern.

<section title="Beispiel: Erstellen eines Analytics-Dashboards">

**Weniger effektiv:**
```text
Erstelle ein Analytics-Dashboard
```

**Effektiver:**
```text
Erstelle ein Analytics-Dashboard. Füge so viele relevante Funktionen und Interaktionen wie möglich ein. Gehe über die Grundlagen hinaus, um eine vollständig ausgestattete Implementierung zu erstellen.
```

</section>

### Fügen Sie Kontext hinzu, um die Leistung zu verbessern

Das Bereitstellen von Kontext oder Motivation hinter Ihren Anweisungen, wie z. B. das Erklären gegenüber Claude, warum ein solches Verhalten wichtig ist, kann Claude 4.x Modellen helfen, Ihre Ziele besser zu verstehen und gezielere Antworten zu liefern.

<section title="Beispiel: Formatierungspräferenzen">

**Weniger effektiv:**
```text
NIEMALS Auslassungspunkte verwenden
```

**Effektiver:**
```text
Ihre Antwort wird von einer Text-zu-Sprache-Engine vorgelesen, daher verwenden Sie niemals Auslassungspunkte, da die Text-zu-Sprache-Engine nicht weiß, wie sie auszusprechen sind.
```

</section>

Claude ist intelligent genug, um aus der Erklärung zu verallgemeinern.

### Seien Sie wachsam mit Beispielen und Details

Claude 4.x Modelle achten genau auf Details und Beispiele als Teil ihrer präzisen Befolgungsfähigkeiten von Anweisungen. Stellen Sie sicher, dass Ihre Beispiele mit den Verhaltensweisen übereinstimmen, die Sie fördern möchten, und minimieren Sie Verhaltensweisen, die Sie vermeiden möchten.

### Langfristige Überlegungen und Zustandsverfolgung

Claude 4.5 Modelle zeichnen sich durch langfristige Überlegungsaufgaben mit außergewöhnlichen Zustandsverfolgungsfähigkeiten aus. Es behält die Orientierung über erweiterte Sitzungen hinweg, indem es sich auf inkrementelle Fortschritte konzentriert – stetige Fortschritte bei einigen wenigen Dingen gleichzeitig, anstatt alles auf einmal zu versuchen. Diese Fähigkeit entsteht besonders über mehrere Kontextfenster oder Aufgabenwiederkehrungen hinweg, wo Claude an einer komplexen Aufgabe arbeiten, den Zustand speichern und mit einem frischen Kontextfenster fortfahren kann.

#### Kontextbewusstsein und Multi-Window-Workflows

Claude 4.5 Modelle verfügen über [Kontextbewusstsein](/docs/de/build-with-claude/context-windows#context-awareness-in-claude-sonnet-4-5), das es dem Modell ermöglicht, sein verbleibendes Kontextfenster (d. h. „Token-Budget") während eines Gesprächs zu verfolgen. Dies ermöglicht Claude, Aufgaben effektiver auszuführen und Kontext zu verwalten, indem es versteht, wie viel Platz es zum Arbeiten hat.

**Verwalten von Kontextlimits:**

Wenn Sie Claude in einem Agent-Harness verwenden, der Kontext komprimiert oder das Speichern von Kontext in externen Dateien ermöglicht (wie in Claude Code), empfehlen wir, diese Informationen zu Ihrem Prompt hinzuzufügen, damit Claude entsprechend handeln kann. Andernfalls kann Claude manchmal natürlich versuchen, die Arbeit zu beenden, wenn es sich dem Kontextlimit nähert. Hier ist ein Beispiel-Prompt:

```text Beispiel-Prompt
Ihr Kontextfenster wird automatisch komprimiert, wenn es sich seinem Limit nähert, sodass Sie unbegrenzt von dort aus weitermachen können, wo Sie aufgehört haben. Daher sollten Sie Aufgaben nicht vorzeitig aufgrund von Token-Budget-Bedenken beenden. Wenn Sie sich Ihrem Token-Budget-Limit nähern, speichern Sie Ihren aktuellen Fortschritt und Zustand im Speicher, bevor das Kontextfenster aktualisiert wird. Seien Sie immer so hartnäckig und autonom wie möglich und führen Sie Aufgaben vollständig aus, auch wenn das Ende Ihres Budgets näher rückt. Beenden Sie niemals künstlich eine Aufgabe vorzeitig, unabhängig vom verbleibenden Kontext.
```

Das [Memory-Tool](/docs/de/agents-and-tools/tool-use/memory-tool) passt natürlich zum Kontextbewusstsein für nahtlose Kontextübergänge.

#### Multi-Kontextfenster-Workflows

Für Aufgaben, die sich über mehrere Kontextfenster erstrecken:

1. **Verwenden Sie einen anderen Prompt für das allererste Kontextfenster**: Verwenden Sie das erste Kontextfenster, um ein Framework einzurichten (Tests schreiben, Setup-Skripte erstellen), und verwenden Sie dann zukünftige Kontextfenster, um eine Todo-Liste zu durchlaufen.

2. **Lassen Sie das Modell Tests in einem strukturierten Format schreiben**: Bitten Sie Claude, Tests zu erstellen, bevor Sie mit der Arbeit beginnen, und verfolgen Sie sie in einem strukturierten Format (z. B. `tests.json`). Dies führt zu besserer langfristiger Fähigkeit zur Iteration. Erinnern Sie Claude an die Wichtigkeit von Tests: „Es ist inakzeptabel, Tests zu entfernen oder zu bearbeiten, da dies zu fehlender oder fehlerhafter Funktionalität führen könnte."

3. **Richten Sie Quality-of-Life-Tools ein**: Ermutigen Sie Claude, Setup-Skripte zu erstellen (z. B. `init.sh`), um Server elegant zu starten, Test-Suites und Linter auszuführen. Dies verhindert wiederholte Arbeit beim Fortfahren von einem frischen Kontextfenster.

4. **Neu starten vs. Komprimieren**: Wenn ein Kontextfenster gelöscht wird, erwägen Sie, mit einem brandneuen Kontextfenster zu beginnen, anstatt Komprimierung zu verwenden. Claude 4.5 Modelle sind äußerst effektiv darin, den Zustand aus dem lokalen Dateisystem zu entdecken. In einigen Fällen möchten Sie dies möglicherweise der Komprimierung vorziehen. Seien Sie präskriptiv darüber, wie es beginnen sollte:
   - „Rufen Sie pwd auf; Sie können nur Dateien in diesem Verzeichnis lesen und schreiben."
   - „Überprüfen Sie progress.txt, tests.json und die Git-Logs."
   - „Führen Sie manuell einen grundlegenden Integrationtest durch, bevor Sie mit der Implementierung neuer Funktionen fortfahren."

5. **Bereitstellen von Verifizierungstools**: Mit zunehmender Länge autonomer Aufgaben muss Claude die Korrektheit ohne kontinuierliches menschliches Feedback überprüfen. Tools wie Playwright MCP Server oder Computer-Use-Funktionen zum Testen von UIs sind hilfreich.

6. **Ermutigen Sie die vollständige Nutzung des Kontexts**: Fordern Sie Claude auf, Komponenten effizient zu vervollständigen, bevor Sie fortfahren:

```text Beispiel-Prompt
Dies ist eine sehr lange Aufgabe, daher kann es vorteilhaft sein, Ihre Arbeit klar zu planen. Es wird empfohlen, Ihren gesamten Ausgabekontext für die Aufgabe zu verwenden – stellen Sie einfach sicher, dass Sie nicht mit erheblicher nicht committeter Arbeit den Kontext verlaufen. Arbeiten Sie systematisch weiter, bis Sie diese Aufgabe abgeschlossen haben.
```

#### Best Practices für Zustandsverwaltung

- **Verwenden Sie strukturierte Formate für Zustandsdaten**: Wenn Sie strukturierte Informationen verfolgen (wie Testergebnisse oder Aufgabenstatus), verwenden Sie JSON oder andere strukturierte Formate, um Claude zu helfen, Schemaanforderungen zu verstehen
- **Verwenden Sie unstrukturierten Text für Fortschrittsnotizen**: Freiformige Fortschrittsnotizen funktionieren gut zum Verfolgen des allgemeinen Fortschritts und Kontexts
- **Verwenden Sie Git für Zustandsverfolgung**: Git bietet ein Protokoll darüber, was getan wurde, und Kontrollpunkte, die wiederhergestellt werden können. Claude 4.5 Modelle funktionieren besonders gut bei der Verwendung von Git zur Zustandsverfolgung über mehrere Sitzungen hinweg.
- **Betonen Sie inkrementelle Fortschritte**: Bitten Sie Claude explizit, seinen Fortschritt zu verfolgen und sich auf inkrementelle Arbeit zu konzentrieren

<section title="Beispiel: Zustandsverfolgung">

```json
// Strukturierte Zustandsdatei (tests.json)
{
  "tests": [
    {"id": 1, "name": "authentication_flow", "status": "passing"},
    {"id": 2, "name": "user_management", "status": "failing"},
    {"id": 3, "name": "api_endpoints", "status": "not_started"}
  ],
  "total": 200,
  "passing": 150,
  "failing": 25,
  "not_started": 25
}
```

```text
// Fortschrittsnotizen (progress.txt)
Fortschritt in Sitzung 3:
- Authentifizierungs-Token-Validierung behoben
- Benutzermodell aktualisiert, um Grenzfälle zu behandeln
- Nächstes: Fehler bei user_management-Tests untersuchen (Test #2)
- Hinweis: Tests nicht entfernen, da dies zu fehlender Funktionalität führen könnte
```

</section>

### Kommunikationsstil

Claude 4.5 Modelle haben einen prägnanten und natürlicheren Kommunikationsstil im Vergleich zu früheren Modellen:

- **Direkter und fundierter**: Bietet faktengestützte Fortschrittsberichte anstelle von selbstverherrlichenden Updates
- **Konversationeller**: Etwas fließender und umgangssprachlicher, weniger maschinenhaft
- **Weniger ausschweifend**: Kann detaillierte Zusammenfassungen aus Effizienzgründen überspringen, es sei denn, es wird anders angefordert

Dieser Kommunikationsstil spiegelt genau wider, was erreicht wurde, ohne unnötige Ausführlichkeit.

## Anleitung für spezifische Situationen

### Verbosität ausgleichen

Claude 4.5 Modelle neigen zur Effizienz und können verbale Zusammenfassungen nach Tool-Aufrufen überspringen und direkt zur nächsten Aktion springen. Während dies einen optimierten Workflow schafft, möchten Sie möglicherweise mehr Sichtbarkeit in seinen Denkprozess haben.

Wenn Sie möchten, dass Claude Updates während der Arbeit bereitstellt:

```text Beispiel-Prompt
Geben Sie nach Abschluss einer Aufgabe, die Tool-Nutzung beinhaltet, eine kurze Zusammenfassung der geleisteten Arbeit.
```

### Tool-Nutzungsmuster

Claude 4.5 Modelle sind für präzise Befolgung von Anweisungen trainiert und profitieren von expliziter Anweisung, spezifische Tools zu verwenden. Wenn Sie sagen „kannst du einige Änderungen vorschlagen", wird es manchmal nur Vorschläge machen, anstatt sie umzusetzen – auch wenn Änderungen vornehmen das sein könnte, was Sie beabsichtigt haben.

Damit Claude Maßnahmen ergreift, seien Sie expliziter:

<section title="Beispiel: Explizite Anweisungen">

**Weniger effektiv (Claude wird nur Vorschläge machen):**
```text
Kannst du einige Änderungen vorschlagen, um diese Funktion zu verbessern?
```

**Effektiver (Claude wird die Änderungen vornehmen):**
```text
Ändere diese Funktion, um ihre Leistung zu verbessern.
```

Oder:
```text
Nimm diese Änderungen am Authentifizierungsfluss vor.
```

</section>

Um Claude proaktiver bei der Ergreifung von Maßnahmen zu machen, können Sie dies zu Ihrem System-Prompt hinzufügen:

```text Beispiel-Prompt für proaktive Maßnahmen
<default_to_action>
Standardmäßig Änderungen implementieren, anstatt nur Vorschläge zu machen. Wenn die Absicht des Benutzers unklar ist, leiten Sie die wahrscheinlich nützlichste Aktion ab und fahren Sie fort, indem Sie Tools verwenden, um fehlende Details zu entdecken, anstatt zu raten. Versuchen Sie, die Absicht des Benutzers darüber abzuleiten, ob ein Tool-Aufruf (z. B. Dateibearbeitung oder Lesevorgänge) beabsichtigt ist oder nicht, und handeln Sie entsprechend.
</default_to_action>
```

Andererseits, wenn Sie möchten, dass das Modell standardmäßig zögerlicher ist, weniger geneigt, direkt in Implementierungen zu springen, und nur Maßnahmen ergreift, wenn es angefordert wird, können Sie dieses Verhalten mit einem Prompt wie dem folgenden steuern:

```text Beispiel-Prompt für konservative Maßnahmen
Springen Sie nicht in Implementierung oder Änderungsdateien, es sei denn, Sie werden klar angewiesen, Änderungen vorzunehmen. Wenn die Absicht des Benutzers mehrdeutig ist, geben Sie standardmäßig Informationen, führen Sie Recherchen durch und geben Sie Empfehlungen, anstatt Maßnahmen zu ergreifen. Fahren Sie nur mit Bearbeitungen, Änderungen oder Implementierungen fort, wenn der Benutzer sie explizit anfordert.
</do_not_act_before_instructions>
```

### Tool-Nutzung und Auslösung

Claude Opus 4.5 reagiert stärker auf den System-Prompt als frühere Modelle. Wenn Ihre Prompts darauf ausgelegt waren, die Unterauslösung von Tools oder Fähigkeiten zu reduzieren, kann Claude Opus 4.5 jetzt überauslösen. Die Lösung besteht darin, die aggressive Sprache zu reduzieren. Wo Sie möglicherweise „KRITISCH: Sie MÜSSEN dieses Tool verwenden, wenn..." gesagt haben, können Sie normalere Prompting wie „Verwenden Sie dieses Tool, wenn..." verwenden.

### Steuern Sie das Format von Antworten

Es gibt einige Wege, die wir besonders effektiv gefunden haben, um die Ausgabeformatierung in Claude 4.x Modellen zu steuern:

1. **Sagen Sie Claude, was zu tun ist, anstatt was nicht zu tun**

   - Statt: „Verwenden Sie kein Markdown in Ihrer Antwort"
   - Versuchen Sie: „Ihre Antwort sollte aus fließenden Prosa-Absätzen bestehen."

2. **Verwenden Sie XML-Format-Indikatoren**

   - Versuchen Sie: „Schreiben Sie die Prosa-Abschnitte Ihrer Antwort in \<smoothly_flowing_prose_paragraphs\> Tags."

3. **Passen Sie Ihren Prompt-Stil an den gewünschten Ausgabestil an**

   Der Formatierungsstil, der in Ihrem Prompt verwendet wird, kann Claudes Antwortstil beeinflussen. Wenn Sie immer noch Steuerbarkeitsprobleme mit der Ausgabeformatierung haben, empfehlen wir, Ihren Prompt-Stil so gut wie möglich an Ihren gewünschten Ausgabestil anzupassen. Zum Beispiel kann das Entfernen von Markdown aus Ihrem Prompt die Menge an Markdown in der Ausgabe reduzieren.

4. **Verwenden Sie detaillierte Prompts für spezifische Formatierungspräferenzen**

   Für mehr Kontrolle über Markdown und Formatierungsnutzung geben Sie explizite Anleitung:

```text Beispiel-Prompt zur Minimierung von Markdown
<avoid_excessive_markdown_and_bullet_points>
Beim Schreiben von Berichten, Dokumenten, technischen Erklärungen, Analysen oder anderen längeren Inhalten schreiben Sie in klarer, fließender Prosa mit vollständigen Absätzen und Sätzen. Verwenden Sie Standard-Absatzumbrüche zur Organisation und reservieren Sie Markdown hauptsächlich für `Inline-Code`, Code-Blöcke (```...```) und einfache Überschriften (###, und ###). Vermeiden Sie die Verwendung von **Fett** und *Kursiv*.

VERWENDEN Sie KEINE nummerierten Listen (1. ...) oder ungeordneten Listen (*), es sei denn: a) Sie präsentieren wirklich diskrete Elemente, bei denen ein Listenformat die beste Option ist, oder b) der Benutzer fordert explizit eine Liste oder Rangfolge an

Anstatt Elemente mit Aufzählungszeichen oder Nummern aufzulisten, integrieren Sie sie natürlich in Sätze. Diese Anleitung gilt besonders für technisches Schreiben. Die Verwendung von Prosa anstelle von übermäßiger Formatierung verbessert die Benutzerzufriedenheit. GEBEN Sie NIEMALS eine Reihe von übermäßig kurzen Aufzählungspunkten aus.

Ihr Ziel ist lesbarer, fließender Text, der den Leser natürlich durch Ideen führt, anstatt Informationen in isolierte Punkte zu fragmentieren.
</avoid_excessive_markdown_and_bullet_points>
```

### Recherche und Informationsbeschaffung

Claude 4.5 Modelle zeigen außergewöhnliche agentengestützte Suchfähigkeiten und können Informationen aus mehreren Quellen effektiv finden und synthetisieren. Für optimale Rechercheergebnisse:

1. **Geben Sie klare Erfolgskriterien an**: Definieren Sie, was eine erfolgreiche Antwort auf Ihre Forschungsfrage ausmacht

2. **Ermutigen Sie zur Quellenverifikation**: Bitten Sie Claude, Informationen über mehrere Quellen hinweg zu überprüfen

3. **Verwenden Sie für komplexe Forschungsaufgaben einen strukturierten Ansatz**:

```text Beispiel-Prompt für komplexe Recherche
Suchen Sie nach diesen Informationen auf strukturierte Weise. Während Sie Daten sammeln, entwickeln Sie mehrere konkurrierende Hypothesen. Verfolgen Sie Ihre Vertrauensstufen in Ihren Fortschrittsnotizen, um die Kalibrierung zu verbessern. Kritisieren Sie regelmäßig Ihren Ansatz und planen Sie selbst. Aktualisieren Sie eine Hypothesenbaumstruktur oder Forschungsnotizen-Datei, um Informationen zu persistieren und Transparenz zu bieten. Unterteilen Sie diese komplexe Forschungsaufgabe systematisch.
```

Dieser strukturierte Ansatz ermöglicht es Claude, praktisch jede Information zu finden und zu synthetisieren und seine Erkenntnisse iterativ zu kritisieren, unabhängig von der Größe des Corpus.

### Subagent-Orchestrierung

Claude 4.5 Modelle zeigen erheblich verbesserte native Subagent-Orchestrierungsfähigkeiten. Diese Modelle können erkennen, wenn Aufgaben von der Delegierung von Arbeit an spezialisierte Subagenten profitieren würden, und tun dies proaktiv ohne explizite Anweisung.

Um dieses Verhalten zu nutzen:

1. **Stellen Sie gut definierte Subagent-Tools sicher**: Haben Sie Subagent-Tools verfügbar und in Tool-Definitionen beschrieben
2. **Lassen Sie Claude natürlich orchestrieren**: Claude wird ohne explizite Anweisung angemessen delegieren
3. **Passen Sie die Konservativität an, falls erforderlich**:

```text Beispiel-Prompt für konservative Subagent-Nutzung
Delegieren Sie nur an Subagenten, wenn die Aufgabe klar von einem separaten Agenten mit einem neuen Kontextfenster profitiert.
```

### Modell-Selbstkenntnis

Wenn Sie möchten, dass Claude sich selbst in Ihrer Anwendung korrekt identifiziert oder spezifische API-Strings verwendet:

```text Beispiel-Prompt für Modellidentität
Der Assistent ist Claude, erstellt von Anthropic. Das aktuelle Modell ist Claude Sonnet 4.5.
```

Für LLM-gestützte Apps, die Modell-Strings angeben müssen:

```text Beispiel-Prompt für Modell-String
Wenn ein LLM benötigt wird, verwenden Sie standardmäßig Claude Sonnet 4.5, es sei denn, der Benutzer fordert etwas anderes an. Der genaue Modell-String für Claude Sonnet 4.5 ist claude-sonnet-4-5-20250929.
```

### Denk-Sensitivität

Wenn erweitertes Denken deaktiviert ist, ist Claude Opus 4.5 besonders empfindlich gegenüber dem Wort „denken" und seinen Varianten. Wir empfehlen, „denken" durch alternative Wörter zu ersetzen, die eine ähnliche Bedeutung vermitteln, wie z. B. „erwägen", „glauben" und „bewerten".

### Nutzen Sie Denk- und verschachtelte Denk-Fähigkeiten

Claude 4.x Modelle bieten Denk-Fähigkeiten, die besonders hilfreich für Aufgaben sein können, die Reflexion nach Tool-Nutzung oder komplexes mehrstufiges Denken beinhalten. Sie können sein anfängliches oder verschachteltes Denken für bessere Ergebnisse lenken.

```text Beispiel-Prompt
Nachdem Sie Tool-Ergebnisse erhalten haben, reflektieren Sie sorgfältig über ihre Qualität und bestimmen Sie die optimalen nächsten Schritte, bevor Sie fortfahren. Verwenden Sie Ihr Denken, um basierend auf diesen neuen Informationen zu planen und zu iterieren, und ergreifen Sie dann die beste nächste Aktion.
```

<Info>
  Weitere Informationen zu Denk-Fähigkeiten finden Sie unter [Erweitertes Denken](/docs/de/build-with-claude/extended-thinking).
</Info>

### Dokumentenerstellung

Claude 4.5 Modelle zeichnen sich durch die Erstellung von Präsentationen, Animationen und visuellen Dokumenten aus. Diese Modelle entsprechen oder übertreffen Claude Opus 4.1 in diesem Bereich, mit beeindruckender kreativer Flair und stärkerer Befolgung von Anweisungen. Die Modelle produzieren in den meisten Fällen beim ersten Versuch polierte, nutzbare Ausgaben.

Für beste Ergebnisse bei der Dokumentenerstellung:

```text Beispiel-Prompt
Erstelle eine professionelle Präsentation zu [topic]. Füge durchdachte Designelemente, visuelle Hierarchie und ansprechende Animationen ein, wo angemessen.
```

### Verbesserte Vision-Fähigkeiten

Claude Opus 4.5 hat verbesserte Vision-Fähigkeiten im Vergleich zu früheren Claude Modellen. Es funktioniert besser bei Bildverarbeitungs- und Datenextraktionsaufgaben, besonders wenn mehrere Bilder im Kontext vorhanden sind. Diese Verbesserungen übertragen sich auf Computer-Nutzung, wo das Modell Screenshots und UI-Elemente zuverlässiger interpretieren kann. Sie können Claude Opus 4.5 auch verwenden, um Videos zu analysieren, indem Sie sie in Frames aufteilen.

Eine Technik, die wir als effektiv befunden haben, um die Leistung weiter zu steigern, ist, Claude Opus 4.5 ein Crop-Tool oder [Skill](/docs/de/agents-and-tools/agent-skills/overview) zu geben. Wir haben konsistente Verbesserungen bei Bildbewertungen gesehen, wenn Claude in der Lage ist, in relevante Regionen eines Bildes zu „zoomen". Wir haben ein Cookbook für das Crop-Tool [hier](https://github.com/anthropics/claude-cookbooks/blob/main/multimodal/crop_tool.ipynb) zusammengestellt.

### Optimieren Sie parallele Tool-Aufrufe

Claude 4.x Modelle zeichnen sich durch parallele Tool-Ausführung aus, wobei Sonnet 4.5 besonders aggressiv bei der Auslösung mehrerer Operationen gleichzeitig ist. Claude 4.x Modelle werden:

- Mehrere spekulative Suchen während der Recherche durchführen
- Mehrere Dateien gleichzeitig lesen, um Kontext schneller aufzubauen
- Bash-Befehle parallel ausführen (was sogar die Systemleistung bremsen kann)

Dieses Verhalten ist leicht steuerbar. Während das Modell ohne Prompting eine hohe Erfolgsquote bei parallelen Tool-Aufrufen hat, können Sie dies auf ~100% erhöhen oder die Aggressivität anpassen:

```text Beispiel-Prompt für maximale parallele Effizienz
<use_parallel_tool_calls>
Wenn Sie mehrere Tools aufrufen möchten und es keine Abhängigkeiten zwischen den Tool-Aufrufen gibt, führen Sie alle unabhängigen Tool-Aufrufe parallel aus. Priorisieren Sie das gleichzeitige Aufrufen von Tools, wann immer die Aktionen parallel durchgeführt werden können, anstatt sequenziell. Zum Beispiel, wenn Sie 3 Dateien lesen, führen Sie 3 Tool-Aufrufe parallel aus, um alle 3 Dateien gleichzeitig in den Kontext zu lesen. Maximieren Sie die Nutzung paralleler Tool-Aufrufe, wo möglich, um Geschwindigkeit und Effizienz zu erhöhen. Wenn jedoch einige Tool-Aufrufe von vorherigen Aufrufen abhängen, um abhängige Werte wie die Parameter zu informieren, rufen Sie diese Tools NICHT parallel auf und rufen Sie sie stattdessen sequenziell auf. Verwenden Sie niemals Platzhalter oder raten Sie fehlende Parameter in Tool-Aufrufen.
</use_parallel_tool_calls>
```

```text Beispiel-Prompt zur Reduzierung paralleler Ausführung
Führen Sie Operationen sequenziell mit kurzen Pausen zwischen jedem Schritt aus, um Stabilität zu gewährleisten.
```

### Reduzieren Sie die Dateierstellung in agentengestütztem Coding

Claude 4.x Modelle können manchmal neue Dateien für Test- und Iterationszwecke erstellen, besonders wenn mit Code gearbeitet wird. Dieser Ansatz ermöglicht es Claude, Dateien, besonders Python-Skripte, als „temporären Notizblock" zu verwenden, bevor die endgültige Ausgabe gespeichert wird. Die Verwendung temporärer Dateien kann die Ergebnisse besonders für agentengestützte Coding-Anwendungsfälle verbessern.

Wenn Sie die Erstellung neuer Nettodateien minimieren möchten, können Sie Claude anweisen, nach sich selbst aufzuräumen:

```text Beispiel-Prompt
Wenn Sie temporäre neue Dateien, Skripte oder Hilfsdateien zur Iteration erstellen, räumen Sie diese Dateien auf, indem Sie sie am Ende der Aufgabe entfernen.
```

### Übereifrigkeit und Dateierstellung

Claude Opus 4.5 hat eine Tendenz, zu überengineeren, indem es zusätzliche Dateien erstellt, unnötige Abstraktionen hinzufügt oder Flexibilität aufbaut, die nicht angefordert wurde. Wenn Sie dieses unerwünschte Verhalten sehen, fügen Sie explizites Prompting hinzu, um Lösungen minimal zu halten.

Zum Beispiel:

```text Beispiel-Prompt zur Minimierung von Überengineering
Vermeiden Sie Überengineering. Nehmen Sie nur Änderungen vor, die direkt angefordert oder eindeutig notwendig sind. Halten Sie Lösungen einfach und fokussiert.

Fügen Sie keine Funktionen hinzu, refaktorieren Sie keinen Code und machen Sie keine „Verbesserungen" über das Angeforderte hinaus. Eine Fehlerbehebung erfordert keine Bereinigung des umgebenden Codes. Eine einfache Funktion benötigt keine zusätzliche Konfigurierbarkeit.

Fügen Sie keine Fehlerbehandlung, Fallbacks oder Validierung für Szenarien hinzu, die nicht auftreten können. Vertrauen Sie internen Code- und Framework-Garantien. Validieren Sie nur an Systemgrenzen (Benutzereingabe, externe APIs). Verwenden Sie keine Rückwärtskompatibilität-Shims, wenn Sie einfach den Code ändern können.

Erstellen Sie keine Helfer, Dienstprogramme oder Abstraktionen für einmalige Operationen. Entwerfen Sie nicht für hypothetische zukünftige Anforderungen. Die richtige Menge an Komplexität ist das Minimum, das für die aktuelle Aufgabe erforderlich ist. Verwenden Sie vorhandene Abstraktionen wieder, wo möglich, und folgen Sie dem DRY-Prinzip.
```

### Frontend-Design

Claude 4.x Modelle, besonders Opus 4.5, zeichnen sich durch die Erstellung komplexer, realer Web-Anwendungen mit starkem Frontend-Design aus. Ohne Anleitung können Modelle jedoch auf generische Muster zurückgreifen, die das schaffen, was Benutzer die „AI Slop"-Ästhetik nennen. Um charakteristische, kreative Frontends zu erstellen, die überraschen und erfreuen:

<Tip>
Einen detaillierten Leitfaden zur Verbesserung des Frontend-Designs finden Sie in unserem Blog-Beitrag über [Verbesserung des Frontend-Designs durch Skills](https://www.claude.com/blog/improving-frontend-design-through-skills).
</Tip>

Hier ist ein System-Prompt-Snippet, das Sie verwenden können, um besseres Frontend-Design zu fördern:

```text Beispiel-Prompt für Frontend-Ästhetik
<frontend_aesthetics>
Sie neigen dazu, gegen generische, „auf Verteilung" Ausgaben zu konvergieren. Im Frontend-Design schafft dies das, was Benutzer die „AI Slop"-Ästhetik nennen. Vermeiden Sie dies: erstellen Sie kreative, charakteristische Frontends, die überraschen und erfreuen.

Konzentrieren Sie sich auf:
- Typografie: Wählen Sie Schriftarten, die schön, einzigartig und interessant sind. Vermeiden Sie generische Schriftarten wie Arial und Inter; entscheiden Sie sich stattdessen für charakteristische Wahlen, die die Ästhetik des Frontends erheben.
- Farbe & Thema: Verpflichten Sie sich zu einer kohärenten Ästhetik. Verwenden Sie CSS-Variablen für Konsistenz. Dominante Farben mit scharfen Akzenten übertreffen ängstliche, gleichmäßig verteilte Paletten. Ziehen Sie Inspiration aus IDE-Themen und kulturellen Ästhetiken.
- Bewegung: Verwenden Sie Animationen für Effekte und Mikro-Interaktionen. Priorisieren Sie CSS-only-Lösungen für HTML. Verwenden Sie Motion-Bibliothek für React, wenn verfügbar. Konzentrieren Sie sich auf hochwertige Momente: ein gut orchestriertes Seitenladevorgang mit gestaffelten Offenbarungen (animation-delay) schafft mehr Freude als verstreute Mikro-Interaktionen.
- Hintergründe: Schaffen Sie Atmosphäre und Tiefe, anstatt auf Vollfarben zurückzugreifen. Schichten Sie CSS-Gradienten, verwenden Sie geometrische Muster oder fügen Sie kontextuelle Effekte hinzu, die der Gesamtästhetik entsprechen.

Vermeiden Sie generische KI-generierte Ästhetiken:
- Übernutzte Schriftfamilien (Inter, Roboto, Arial, Systemschriftarten)
- Klischeehafte Farbschemen (besonders lila Gradienten auf weißem Hintergrund)
- Vorhersehbare Layouts und Komponentenmuster
- Standardisiertes Design, dem kontextspezifischer Charakter fehlt

Interpretieren Sie kreativ und treffen Sie unerwartete Wahlen, die sich für den Kontext genuinely entworfen anfühlen. Variieren Sie zwischen hellen und dunklen Themen, verschiedenen Schriftarten, verschiedenen Ästhetiken. Sie neigen immer noch dazu, in Generationen auf gemeinsame Wahlen zu konvergieren (zum Beispiel Space Grotesk). Vermeiden Sie dies: es ist kritisch, dass Sie außerhalb der Box denken!
</frontend_aesthetics>
```

Sie können auch auf die vollständige Skill [hier](https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md) verweisen.

### Vermeiden Sie die Fokussierung auf das Bestehen von Tests und Hard-Coding

Claude 4.x Modelle können sich manchmal zu sehr auf das Bestehen von Tests konzentrieren, auf Kosten allgemeinerer Lösungen, oder können Workarounds wie Hilfsskripte für komplexe Refaktorierung verwenden, anstatt Standard-Tools direkt zu verwenden. Um dieses Verhalten zu verhindern und robuste, verallgemeinerbare Lösungen sicherzustellen:

```text Beispiel-Prompt
Bitte schreiben Sie eine hochwertige, allgemeine Lösung mit den verfügbaren Standard-Tools. Erstellen Sie keine Hilfsskripte oder Workarounds, um die Aufgabe effizienter zu erfüllen. Implementieren Sie eine Lösung, die für alle gültigen Eingaben korrekt funktioniert, nicht nur für die Testfälle. Hardcodieren Sie keine Werte und erstellen Sie keine Lösungen, die nur für spezifische Test-Eingaben funktionieren. Implementieren Sie stattdessen die tatsächliche Logik, die das Problem allgemein löst.

Konzentrieren Sie sich auf das Verständnis der Problemanforderungen und die Implementierung des korrekten Algorithmus. Tests sind da, um Korrektheit zu überprüfen, nicht um die Lösung zu definieren. Geben Sie eine prinzipielle Implementierung, die Best Practices und Software-Design-Prinzipien befolgt.

Wenn die Aufgabe unvernünftig oder nicht machbar ist, oder wenn einer der Tests falsch ist, informieren Sie mich bitte, anstatt sie zu umgehen. Die Lösung sollte robust, wartbar und erweiterbar sein.
```

### Ermutigung zur Code-Erkundung

Claude Opus 4.5 ist hochgradig fähig, kann aber übermäßig konservativ sein, wenn es um Code-Erkundung geht. Wenn Sie bemerken, dass das Modell Lösungen vorschlägt, ohne den Code zu betrachten, oder Annahmen über Code macht, den es nicht gelesen hat, ist die beste Lösung, explizite Anweisungen zum Prompt hinzuzufügen. Claude Opus 4.5 ist unser steuerbarstes Modell bis heute und reagiert zuverlässig auf direkte Anleitung.

Zum Beispiel:

```text Beispiel-Prompt für Code-Erkundung
LESEN und verstehen Sie IMMER relevante Dateien, bevor Sie Code-Bearbeitungen vorschlagen. Spekulieren Sie nicht über Code, den Sie nicht inspiziert haben. Wenn der Benutzer auf eine spezifische Datei/einen Pfad verweist, MÜSSEN Sie diese öffnen und inspizieren, bevor Sie Fixes erklären oder vorschlagen. Seien Sie rigoros und hartnäckig bei der Suche nach Schlüsselfakten im Code. Überprüfen Sie gründlich den Stil, die Konventionen und die Abstraktionen der Codebasis, bevor Sie neue Funktionen oder Abstraktionen implementieren.
```

### Minimierung von Halluzinationen in agentengestütztem Coding

Claude 4.x Modelle sind weniger anfällig für Halluzinationen und geben genauere, fundierte, intelligente Antworten basierend auf dem Code. Um dieses Verhalten noch mehr zu fördern und Halluzinationen zu minimieren:

```text Beispiel-Prompt
<investigate_before_answering>
Spekulieren Sie niemals über Code, den Sie nicht geöffnet haben. Wenn der Benutzer auf eine spezifische Datei verweist, MÜSSEN Sie die Datei lesen, bevor Sie antworten. Stellen Sie sicher, dass Sie relevante Dateien UNTERSUCHEN und LESEN, bevor Sie Fragen zur Codebasis beantworten. Machen Sie niemals Aussagen über Code, bevor Sie untersuchen, es sei denn, Sie sind sicher, dass die Antwort korrekt ist – geben Sie fundierte und halluzinationsfreie Antworten.
</investigate_before_answering>
```

## Migrationsbedingungen

Bei der Migration zu Claude 4.5 Modellen:

1. **Seien Sie spezifisch über das gewünschte Verhalten**: Erwägen Sie, genau zu beschreiben, was Sie in der Ausgabe sehen möchten.

2. **Rahmen Sie Ihre Anweisungen mit Modifikatoren**: Das Hinzufügen von Modifikatoren, die Claude ermutigen, die Qualität und Detail seiner Ausgabe zu erhöhen, kann Claudes Leistung besser gestalten. Zum Beispiel, anstatt „Erstelle ein Analytics-Dashboard", verwenden Sie „Erstelle ein Analytics-Dashboard. Füge so viele relevante Funktionen und Interaktionen wie möglich ein. Gehe über die Grundlagen hinaus, um eine vollständig ausgestattete Implementierung zu erstellen."

3. **Fordern Sie spezifische Funktionen explizit an**: Animationen und interaktive Elemente sollten explizit angefordert werden, wenn gewünscht.