# Computer-use-Tool

Claude kann mit Computerumgebungen über das Computer-use-Tool interagieren, das Screenshot-Funktionen und Maus-/Tastatursteuerung für autonome Desktop-Interaktion bietet.

---

Claude kann mit Computerumgebungen durch das Computer-use-Tool interagieren, das Screenshot-Funktionen und Maus-/Tastatursteuerung für autonome Desktop-Interaktion bietet.

<Note>
Computer use befindet sich derzeit in der Beta-Phase und erfordert einen [Beta-Header](/docs/de/api/beta-headers):
- `"computer-use-2025-11-24"` für Claude Opus 4.5
- `"computer-use-2025-01-24"` für Claude Sonnet 4.5, Haiku 4.5, Opus 4.1, Sonnet 4, Opus 4 und Sonnet 3.7 ([veraltet](/docs/de/about-claude/model-deprecations))
</Note>

## Übersicht

Computer use ist eine Beta-Funktion, die Claude die Interaktion mit Desktop-Umgebungen ermöglicht. Dieses Tool bietet:

- **Screenshot-Erfassung**: Sehen Sie, was derzeit auf dem Bildschirm angezeigt wird
- **Maussteuerung**: Klicken, ziehen und bewegen Sie den Cursor
- **Tastatureingabe**: Geben Sie Text ein und verwenden Sie Tastaturkürzel
- **Desktop-Automatisierung**: Interagieren Sie mit jeder Anwendung oder Schnittstelle

Während Computer use durch andere Tools wie Bash und Text-Editor für umfassendere Automatisierungs-Workflows erweitert werden kann, bezieht sich Computer use speziell auf die Fähigkeit des Computer-use-Tools, Desktop-Umgebungen zu sehen und zu steuern.

## Modellkompatibilität

Computer use ist für die folgenden Claude-Modelle verfügbar:

| Modell | Tool-Version | Beta-Flag |
|-------|--------------|-----------|
| Claude Opus 4.5 | `computer_20251124` | `computer-use-2025-11-24` |
| Alle anderen unterstützten Modelle | `computer_20250124` | `computer-use-2025-01-24` |

<Note>
Claude Opus 4.5 führt die `computer_20251124` Tool-Version mit neuen Funktionen ein, einschließlich der Zoom-Aktion zur detaillierten Inspektion von Bildschirmbereichen. Alle anderen Modelle (Sonnet 4.5, Haiku 4.5, Sonnet 4, Opus 4, Opus 4.1 und Sonnet 3.7) verwenden die `computer_20250124` Tool-Version.
</Note>

<Warning>
Ältere Tool-Versionen sind nicht garantiert abwärtskompatibel mit neueren Modellen. Verwenden Sie immer die Tool-Version, die Ihrer Modellversion entspricht.
</Warning>

## Sicherheitsaspekte

<Warning>
Computer use ist eine Beta-Funktion mit einzigartigen Risiken, die sich von Standard-API-Funktionen unterscheiden. Diese Risiken sind erhöht, wenn Sie mit dem Internet interagieren. Um Risiken zu minimieren, sollten Sie Vorsichtsmaßnahmen wie die folgenden in Betracht ziehen:

1. Verwenden Sie eine dedizierte virtuelle Maschine oder einen Container mit minimalen Berechtigungen, um direkte Systemangriffe oder Unfälle zu verhindern.
2. Vermeiden Sie es, dem Modell Zugriff auf sensible Daten wie Anmeldeinformationen zu geben, um Informationsdiebstahl zu verhindern.
3. Begrenzen Sie den Internetzugriff auf eine Whitelist von Domänen, um die Exposition gegenüber bösartigen Inhalten zu reduzieren.
4. Bitten Sie einen Menschen, Entscheidungen zu bestätigen, die zu bedeutsamen realen Konsequenzen führen könnten, sowie alle Aufgaben, die eine ausdrückliche Zustimmung erfordern, wie das Akzeptieren von Cookies, das Ausführen von Finanztransaktionen oder das Zustimmen zu Nutzungsbedingungen.

In einigen Fällen folgt Claude Befehlen in Inhalten, auch wenn diese den Anweisungen des Benutzers widersprechen. Beispielsweise können Claude-Anweisungen auf Webseiten oder in Bildern Anweisungen überschreiben oder Claude zu Fehlern führen. Wir empfehlen, Vorsichtsmaßnahmen zu treffen, um Claude von sensiblen Daten und Aktionen zu isolieren, um Risiken im Zusammenhang mit Prompt-Injection zu vermeiden.

Wir haben das Modell trainiert, um diesen Prompt-Injektionen zu widerstehen, und haben eine zusätzliche Schutzebene hinzugefügt. Wenn Sie unsere Computer-use-Tools verwenden, führen wir automatisch Klassifizierer auf Ihren Prompts aus, um potenzielle Instanzen von Prompt-Injektionen zu kennzeichnen. Wenn diese Klassifizierer potenzielle Prompt-Injektionen in Screenshots identifizieren, lenken sie das Modell automatisch dazu, vor dem Fortfahren mit der nächsten Aktion um Benutzerbestätigung zu bitten. Wir erkennen an, dass dieser zusätzliche Schutz nicht ideal für jeden Anwendungsfall ist (zum Beispiel Anwendungsfälle ohne einen Menschen in der Schleife), daher können Sie uns [kontaktieren](https://support.claude.com/en/), wenn Sie sich abmelden und ihn ausschalten möchten.

Wir empfehlen immer noch, Vorsichtsmaßnahmen zu treffen, um Claude von sensiblen Daten und Aktionen zu isolieren, um Risiken im Zusammenhang mit Prompt-Injection zu vermeiden.

Bitte informieren Sie Endbenutzer über relevante Risiken und erhalten Sie ihre Zustimmung, bevor Sie Computer use in Ihren eigenen Produkten aktivieren.

</Warning>

<Card
  title="Computer-use-Referenzimplementierung"
  icon="computer"
  href="https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo"
>

Beginnen Sie schnell mit unserer Computer-use-Referenzimplementierung, die eine Web-Schnittstelle, einen Docker-Container, Beispiel-Tool-Implementierungen und eine Agent-Schleife enthält.

**Hinweis:** Die Implementierung wurde aktualisiert, um neue Tools für beide Claude 4-Modelle und Claude Sonnet 3.7 einzuschließen. Stellen Sie sicher, dass Sie die neueste Version des Repositorys abrufen, um auf diese neuen Funktionen zuzugreifen.

</Card>

<Tip>
  Bitte verwenden Sie [dieses Formular](https://forms.gle/BT1hpBrqDPDUrCqo7), um
  Feedback zur Qualität der Modellreaktionen, der API selbst oder der Qualität
  der Dokumentation zu geben - wir können es kaum erwarten, von Ihnen zu hören!
</Tip>

## Schnellstart

So beginnen Sie mit Computer use:

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",  # oder ein anderes kompatibles Modell
    max_tokens=1024,
    tools=[
        {
          "type": "computer_20250124",
          "name": "computer",
          "display_width_px": 1024,
          "display_height_px": 768,
          "display_number": 1,
        },
        {
          "type": "text_editor_20250728",
          "name": "str_replace_based_edit_tool"
        },
        {
          "type": "bash_20250124",
          "name": "bash"
        }
    ],
    messages=[{"role": "user", "content": "Speichern Sie ein Bild einer Katze auf meinem Desktop."}],
    betas=["computer-use-2025-01-24"]
)
print(response)
```

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: computer-use-2025-01-24" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "tools": [
      {
        "type": "computer_20250124",
        "name": "computer",
        "display_width_px": 1024,
        "display_height_px": 768,
        "display_number": 1
      },
      {
        "type": "text_editor_20250728",
        "name": "str_replace_based_edit_tool"
      },
      {
        "type": "bash_20250124",
        "name": "bash"
      }
    ],
    "messages": [
      {
        "role": "user",
        "content": "Speichern Sie ein Bild einer Katze auf meinem Desktop."
      }
    ]
  }'
```
</CodeGroup>

<Note>
Ein Beta-Header ist nur für das Computer-use-Tool erforderlich.

Das obige Beispiel zeigt alle drei Tools, die zusammen verwendet werden, was den Beta-Header erfordert, da er das Computer-use-Tool enthält.
</Note>

---

## Wie Computer use funktioniert

<Steps>
  <Step
    title="1. Stellen Sie Claude das Computer-use-Tool und einen Benutzer-Prompt zur Verfügung"
    icon="tool"
  >
    - Fügen Sie das Computer-use-Tool (und optional andere Tools) zu Ihrer API-Anfrage hinzu.
    - Fügen Sie einen Benutzer-Prompt ein, der Desktop-Interaktion erfordert, z. B. „Speichern Sie ein Bild einer Katze auf meinem Desktop."
  </Step>
  <Step title="2. Claude entscheidet sich, das Computer-use-Tool zu verwenden" icon="wrench">
    - Claude bewertet, ob das Computer-use-Tool bei der Abfrage des Benutzers helfen kann.
    - Wenn ja, erstellt Claude eine ordnungsgemäß formatierte Tool-use-Anfrage.
    - Die API-Antwort hat einen `stop_reason` von `tool_use`, was Claudes Absicht signalisiert.
  </Step>
  <Step
    title="3. Tool-Eingabe extrahieren, das Tool auf einem Computer evaluieren und Ergebnisse zurückgeben"
    icon="computer"
  >
    - Extrahieren Sie auf Ihrer Seite den Tool-Namen und die Eingabe aus Claudes Anfrage.
    - Verwenden Sie das Tool auf einem Container oder einer virtuellen Maschine.
    - Setzen Sie das Gespräch mit einer neuen `user`-Nachricht fort, die einen `tool_result`-Inhaltsblock enthält.
  </Step>
  <Step
    title="4. Claude ruft weiterhin Computer-use-Tools auf, bis die Aufgabe abgeschlossen ist"
    icon="arrows-clockwise"
  >
    - Claude analysiert die Tool-Ergebnisse, um zu bestimmen, ob weitere Tool-Nutzung erforderlich ist oder die Aufgabe abgeschlossen wurde.
    - Wenn Claude entscheidet, dass es ein anderes Tool benötigt, antwortet es mit einem weiteren `tool_use` `stop_reason` und Sie sollten zu Schritt 3 zurückkehren.
    - Andernfalls erstellt es eine Textantwort für den Benutzer.
  </Step>
</Steps>

Wir bezeichnen die Wiederholung der Schritte 3 und 4 ohne Benutzereingabe als die „Agent-Schleife" - d. h. Claude antwortet mit einer Tool-use-Anfrage und Ihre Anwendung antwortet Claude mit den Ergebnissen der Evaluierung dieser Anfrage.

### Die Computerumgebung

Computer use erfordert eine sandboxed Computerumgebung, in der Claude sicher mit Anwendungen und dem Web interagieren kann. Diese Umgebung umfasst:

1. **Virtuelles Display**: Ein virtueller X11-Display-Server (mit Xvfb), der die Desktop-Schnittstelle rendert, die Claude durch Screenshots sehen wird und mit Maus-/Tastaturaktionen steuern wird.

2. **Desktop-Umgebung**: Eine leichte Benutzeroberfläche mit Window Manager (Mutter) und Panel (Tint2), die auf Linux läuft und eine konsistente grafische Schnittstelle für Claude bietet, mit der sie interagieren kann.

3. **Anwendungen**: Vorinstallierte Linux-Anwendungen wie Firefox, LibreOffice, Text-Editoren und Dateimanager, die Claude zur Erledigung von Aufgaben verwenden kann.

4. **Tool-Implementierungen**: Integrationscode, der Claudes abstrakte Tool-Anfragen (wie „Maus bewegen" oder „Screenshot machen") in tatsächliche Operationen in der virtuellen Umgebung übersetzt.

5. **Agent-Schleife**: Ein Programm, das die Kommunikation zwischen Claude und der Umgebung handhabt, Claudes Aktionen an die Umgebung sendet und die Ergebnisse (Screenshots, Befehlsausgaben) an Claude zurückgibt.

Wenn Sie Computer use verwenden, verbindet sich Claude nicht direkt mit dieser Umgebung. Stattdessen:

1. Empfängt Ihre Anwendung Claudes Tool-use-Anfragen
2. Übersetzt sie in Aktionen in Ihrer Computerumgebung
3. Erfasst die Ergebnisse (Screenshots, Befehlsausgaben usw.)
4. Gibt diese Ergebnisse an Claude zurück

Aus Sicherheits- und Isolierungsgründen wird die Referenzimplementierung in einem Docker-Container mit entsprechenden Port-Zuordnungen zum Anzeigen und Interagieren mit der Umgebung ausgeführt.

---

## Wie man Computer use implementiert

### Beginnen Sie mit unserer Referenzimplementierung

Wir haben eine [Referenzimplementierung](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo) erstellt, die alles enthält, was Sie benötigen, um schnell mit Computer use zu beginnen:

- Eine [containerisierte Umgebung](https://github.com/anthropics/anthropic-quickstarts/blob/main/computer-use-demo/Dockerfile), die für Computer use mit Claude geeignet ist
- Implementierungen der [Computer-use-Tools](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo/computer_use_demo/tools)
- Eine [Agent-Schleife](https://github.com/anthropics/anthropic-quickstarts/blob/main/computer-use-demo/computer_use_demo/loop.py), die mit der Claude API interagiert und die Computer-use-Tools ausführt
- Eine Web-Schnittstelle zur Interaktion mit dem Container, der Agent-Schleife und den Tools.

### Die Multi-Agent-Schleife verstehen

Der Kern von Computer use ist die „Agent-Schleife" - ein Zyklus, in dem Claude Tool-Aktionen anfordert, Ihre Anwendung diese ausführt und Ergebnisse an Claude zurückgibt. Hier ist ein vereinfachtes Beispiel:

```python
async def sampling_loop(
    *,
    model: str,
    messages: list[dict],
    api_key: str,
    max_tokens: int = 4096,
    tool_version: str,
    thinking_budget: int | None = None,
    max_iterations: int = 10,  # Iterationslimit hinzufügen, um Endlosschleifen zu verhindern
):
    """
    Eine einfache Agent-Schleife für Claude Computer-use-Interaktionen.

    Diese Funktion handhabt den Hin- und Herwechsel zwischen:
    1. Senden von Benutzernachrichten an Claude
    2. Claude fordert an, Tools zu verwenden
    3. Ihre App führt diese Tools aus
    4. Senden von Tool-Ergebnissen zurück an Claude
    """
    # Tools und API-Parameter einrichten
    client = Anthropic(api_key=api_key)
    beta_flag = "computer-use-2025-01-24" if "20250124" in tool_version else "computer-use-2024-10-22"

    # Tools konfigurieren - Sie sollten diese bereits an anderer Stelle initialisiert haben
    tools = [
        {"type": f"computer_{tool_version}", "name": "computer", "display_width_px": 1024, "display_height_px": 768},
        {"type": f"text_editor_{tool_version}", "name": "str_replace_editor"},
        {"type": f"bash_{tool_version}", "name": "bash"}
    ]

    # Hauptagent-Schleife (mit Iterationslimit, um Runaway-API-Kosten zu verhindern)
    iterations = 0
    while True and iterations < max_iterations:
        iterations += 1
        # Optionalen Thinking-Parameter einrichten (für Claude Sonnet 3.7)
        thinking = None
        if thinking_budget:
            thinking = {"type": "enabled", "budget_tokens": thinking_budget}

        # Claude API aufrufen
        response = client.beta.messages.create(
            model=model,
            max_tokens=max_tokens,
            messages=messages,
            tools=tools,
            betas=[beta_flag],
            thinking=thinking
        )

        # Claudes Antwort zur Gesprächshistorie hinzufügen
        response_content = response.content
        messages.append({"role": "assistant", "content": response_content})

        # Überprüfen, ob Claude Tools verwendet hat
        tool_results = []
        for block in response_content:
            if block.type == "tool_use":
                # In einer echten App würden Sie das Tool hier ausführen
                # Zum Beispiel: result = run_tool(block.name, block.input)
                result = {"result": "Tool erfolgreich ausgeführt"}

                # Formatieren Sie das Ergebnis für Claude
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": result
                })

        # Wenn keine Tools verwendet wurden, ist Claude fertig - geben Sie die endgültigen Nachrichten zurück
        if not tool_results:
            return messages

        # Tool-Ergebnisse zu Nachrichten für die nächste Iteration mit Claude hinzufügen
        messages.append({"role": "user", "content": tool_results})
```

Die Schleife wird fortgesetzt, bis Claude entweder ohne Anforderung von Tools antwortet (Aufgabenvollendung) oder das maximale Iterationslimit erreicht wird. Diese Schutzvorrichtung verhindert potenzielle Endlosschleifen, die zu unerwarteten API-Kosten führen könnten.

Wir empfehlen, die Referenzimplementierung auszuprobieren, bevor Sie den Rest dieser Dokumentation lesen.

### Optimieren Sie die Modellleistung mit Prompting

Hier sind einige Tipps, wie Sie die beste Qualität der Ausgaben erhalten:

1. Geben Sie einfache, gut definierte Aufgaben an und geben Sie explizite Anweisungen für jeden Schritt.
2. Claude geht manchmal von den Ergebnissen seiner Aktionen aus, ohne sie explizit zu überprüfen. Um dies zu verhindern, können Sie Claude mit `Nach jedem Schritt einen Screenshot machen und sorgfältig evaluieren, ob Sie das richtige Ergebnis erreicht haben. Zeigen Sie explizit Ihr Denken: „Ich habe Schritt X evaluiert..." Wenn nicht korrekt, versuchen Sie es erneut. Nur wenn Sie bestätigen, dass ein Schritt korrekt ausgeführt wurde, sollten Sie zum nächsten übergehen.` auffordern.
3. Einige UI-Elemente (wie Dropdown-Menüs und Scrollbalken) könnten für Claude schwierig zu manipulieren sein, wenn Mausbewegungen verwendet werden. Wenn Sie dies erleben, versuchen Sie, das Modell aufzufordern, Tastaturkürzel zu verwenden.
4. Für wiederholbare Aufgaben oder UI-Interaktionen fügen Sie Beispiel-Screenshots und Tool-Aufrufe erfolgreicher Ergebnisse in Ihren Prompt ein.
5. Wenn Sie das Modell anmelden müssen, geben Sie ihm den Benutzernamen und das Passwort in Ihrem Prompt in XML-Tags wie `<robot_credentials>` an. Die Verwendung von Computer use in Anwendungen, die Anmeldung erfordern, erhöht das Risiko schlechter Ergebnisse aufgrund von Prompt-Injection. Bitte lesen Sie unseren [Leitfaden zur Minderung von Prompt-Injektionen](/docs/de/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks), bevor Sie dem Modell Anmeldedaten geben.

<Tip>
  Wenn Sie wiederholt auf eine klare Reihe von Problemen stoßen oder im Voraus
  wissen, welche Aufgaben Claude erledigen muss, verwenden Sie den System-Prompt,
  um Claude explizite Tipps oder Anweisungen zu geben, wie die Aufgaben erfolgreich
  erledigt werden.
</Tip>

### System-Prompts

Wenn eines der von Anthropic definierten Tools über die Claude API angefordert wird, wird ein Computer-use-spezifischer System-Prompt generiert. Er ähnelt dem [Tool-use-System-Prompt](/docs/de/agents-and-tools/tool-use/implement-tool-use#tool-use-system-prompt), beginnt aber mit:

> Sie haben Zugriff auf eine Reihe von Funktionen, die Sie verwenden können, um die Frage des Benutzers zu beantworten. Dies umfasst Zugriff auf eine sandboxed Computerumgebung. Sie haben derzeit nicht die Möglichkeit, Dateien zu inspizieren oder mit externen Ressourcen zu interagieren, außer durch Aufrufen der folgenden Funktionen.

Wie bei der regulären Tool-Nutzung wird das vom Benutzer bereitgestellte `system_prompt`-Feld immer noch respektiert und bei der Konstruktion des kombinierten System-Prompts verwendet.

### Verfügbare Aktionen

Das Computer-use-Tool unterstützt diese Aktionen:

**Grundlegende Aktionen (alle Versionen)**
- **screenshot** - Erfassen Sie die aktuelle Anzeige
- **left_click** - Klicken Sie auf Koordinaten `[x, y]`
- **type** - Geben Sie eine Textzeichenfolge ein
- **key** - Drücken Sie eine Taste oder Tastenkombination (z. B. „ctrl+s")
- **mouse_move** - Bewegen Sie den Cursor zu Koordinaten

**Erweiterte Aktionen (`computer_20250124`)**
Verfügbar in Claude 4-Modellen und Claude Sonnet 3.7:
- **scroll** - Scrollen Sie in jede Richtung mit Mengensteuerung
- **left_click_drag** - Klicken und ziehen Sie zwischen Koordinaten
- **right_click**, **middle_click** - Zusätzliche Maustasten
- **double_click**, **triple_click** - Mehrfachklicks
- **left_mouse_down**, **left_mouse_up** - Feinkörnige Klicksteuerung
- **hold_key** - Halten Sie eine Taste gedrückt, während Sie andere Aktionen ausführen
- **wait** - Pausieren Sie zwischen Aktionen

**Erweiterte Aktionen (`computer_20251124`)**
Verfügbar in Claude Opus 4.5:
- Alle Aktionen von `computer_20250124`
- **zoom** - Sehen Sie einen bestimmten Bereich des Bildschirms in voller Auflösung. Erfordert `enable_zoom: true` in der Tool-Definition. Nimmt einen `region`-Parameter mit Koordinaten `[x1, y1, x2, y2]` an, die die obere linke und untere rechte Ecke des zu inspizierenden Bereichs definieren.

<section title="Beispielaktionen">

```json
// Screenshot machen
{
  "action": "screenshot"
}

// An Position klicken
{
  "action": "left_click",
  "coordinate": [500, 300]
}

// Text eingeben
{
  "action": "type",
  "text": "Hallo, Welt!"
}

// Nach unten scrollen (Claude 4/3.7)
{
  "action": "scroll",
  "coordinate": [500, 400],
  "scroll_direction": "down",
  "scroll_amount": 3
}

// In Region zoomen zur detaillierten Ansicht (Opus 4.5)
{
  "action": "zoom",
  "region": [100, 200, 400, 350]
}
```

</section>

### Tool-Parameter

| Parameter | Erforderlich | Beschreibung |
|-----------|----------|-------------|
| `type` | Ja | Tool-Version (`computer_20251124`, `computer_20250124` oder `computer_20241022`) |
| `name` | Ja | Muss „computer" sein |
| `display_width_px` | Ja | Anzeigebreite in Pixeln |
| `display_height_px` | Ja | Anzeigehöhe in Pixeln |
| `display_number` | Nein | Anzeigenummer für X11-Umgebungen |
| `enable_zoom` | Nein | Zoom-Aktion aktivieren (`computer_20251124` nur). Setzen Sie auf `true`, um Claude zu ermöglichen, in bestimmte Bildschirmbereiche zu zoomen. Standard: `false` |

<Note>
**Wichtig**: Das Computer-use-Tool muss explizit von Ihrer Anwendung ausgeführt werden - Claude kann es nicht direkt ausführen. Sie sind verantwortlich für die Implementierung der Screenshot-Erfassung, Mausbewegungen, Tastatureingaben und anderer Aktionen basierend auf Claudes Anfragen.
</Note>

### Aktivieren Sie die Thinking-Fähigkeit in Claude 4-Modellen und Claude Sonnet 3.7

Claude Sonnet 3.7 führte eine neue „Thinking"-Fähigkeit ein, die es Ihnen ermöglicht, den Denkprozess des Modells zu sehen, während es komplexe Aufgaben durcharbeitet. Diese Funktion hilft Ihnen zu verstehen, wie Claude ein Problem angeht, und kann besonders wertvoll zum Debuggen oder für Bildungszwecke sein.

Um Thinking zu aktivieren, fügen Sie einen `thinking`-Parameter zu Ihrer API-Anfrage hinzu:

```json
"thinking": {
  "type": "enabled",
  "budget_tokens": 1024
}
```

Der `budget_tokens`-Parameter gibt an, wie viele Token Claude zum Denken verwenden kann. Dies wird von Ihrem gesamten `max_tokens`-Budget abgezogen.

Wenn Thinking aktiviert ist, gibt Claude seinen Denkprozess als Teil der Antwort zurück, was Ihnen helfen kann:

1. Den Entscheidungsprozess des Modells zu verstehen
2. Potenzielle Probleme oder Missverständnisse zu identifizieren
3. Vom Ansatz von Claude zur Problemlösung zu lernen
4. Mehr Sichtbarkeit in komplexe mehrstufige Operationen zu erhalten

Hier ist ein Beispiel, wie die Thinking-Ausgabe aussehen könnte:

```
[Thinking]
Ich muss ein Bild einer Katze auf dem Desktop speichern. Lassen Sie mich dies in Schritte aufteilen:

1. Zuerst mache ich einen Screenshot, um zu sehen, was auf dem Desktop ist
2. Dann suche ich nach einem Webbrowser, um nach Katzenbildern zu suchen
3. Nach dem Finden eines geeigneten Bildes muss ich es auf dem Desktop speichern

Lassen Sie mich mit einem Screenshot beginnen, um zu sehen, was verfügbar ist...
```

### Computer use mit anderen Tools erweitern

Das Computer-use-Tool kann mit anderen Tools kombiniert werden, um leistungsfähigere Automatisierungs-Workflows zu erstellen. Dies ist besonders nützlich, wenn Sie:
- Systembefehle ausführen müssen ([Bash-Tool](/docs/de/agents-and-tools/tool-use/bash-tool))
- Konfigurationsdateien oder Skripte bearbeiten müssen ([Text-Editor-Tool](/docs/de/agents-and-tools/tool-use/text-editor-tool))
- Mit benutzerdefinierten APIs oder Diensten integrieren müssen (benutzerdefinierte Tools)

<CodeGroup>
  ```bash Shell
  curl https://api.anthropic.com/v1/messages \
    -H "content-type: application/json" \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "anthropic-beta: computer-use-2025-01-24" \
    -d '{
      "model": "claude-sonnet-4-5",
      "max_tokens": 2000,
      "tools": [
        {
          "type": "computer_20250124",
          "name": "computer",
          "display_width_px": 1024,
          "display_height_px": 768,
          "display_number": 1
        },
        {
          "type": "text_editor_20250728",
          "name": "str_replace_based_edit_tool"
        },
        {
          "type": "bash_20250124",
          "name": "bash"
        },
        {
          "name": "get_weather",
          "description": "Rufen Sie das aktuelle Wetter an einem bestimmten Ort ab",
          "input_schema": {
            "type": "object",
            "properties": {
              "location": {
                "type": "string",
                "description": "Die Stadt und der Staat, z. B. San Francisco, CA"
              },
              "unit": {
                "type": "string",
                "enum": ["celsius", "fahrenheit"],
                "description": "Die Temperatureinheit, entweder „celsius" oder „fahrenheit""
              }
            },
            "required": ["location"]
          }
        }
      ],
      "messages": [
        {
          "role": "user",
          "content": "Finden Sie Flüge von San Francisco zu einem Ort mit wärmerem Wetter."
        }
      ],
      "thinking": {
        "type": "enabled",
        "budget_tokens": 1024
      }
    }'
  ```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[
        {
          "type": "computer_20250124",
          "name": "computer",
          "display_width_px": 1024,
          "display_height_px": 768,
          "display_number": 1,
        },
        {
          "type": "text_editor_20250728",
          "name": "str_replace_based_edit_tool"
        },
        {
          "type": "bash_20250124",
          "name": "bash"
        },
        {
          "name": "get_weather",
          "description": "Rufen Sie das aktuelle Wetter an einem bestimmten Ort ab",
          "input_schema": {
            "type": "object",
            "properties": {
              "location": {
                "type": "string",
                "description": "Die Stadt und der Staat, z. B. San Francisco, CA"
              },
              "unit": {
                "type": "string",
                "enum": ["celsius", "fahrenheit"],
                "description": "Die Temperatureinheit, entweder „celsius" oder „fahrenheit""
              }
            },
            "required": ["location"]
          }
        },
    ],
    messages=[{"role": "user", "content": "Finden Sie Flüge von San Francisco zu einem Ort mit wärmerem Wetter."}],
    betas=["computer-use-2025-01-24"],
    thinking={"type": "enabled", "budget_tokens": 1024},
)
print(response)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const message = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: [
      {
        type: "computer_20250124",
        name: "computer",
        display_width_px: 1024,
        display_height_px: 768,
        display_number: 1,
      },
      {
        type: "text_editor_20250728",
        name: "str_replace_based_edit_tool"
      },
      {
        type: "bash_20250124",
        name: "bash"
      },
      {
        name: "get_weather",
        description: "Rufen Sie das aktuelle Wetter an einem bestimmten Ort ab",
        input_schema: {
          type: "object",
          properties: {
            location: {
              type: "string",
              description: "Die Stadt und der Staat, z. B. San Francisco, CA"
            },
            unit: {
              type: "string",
              enum: ["celsius", "fahrenheit"],
              description: "Die Temperatureinheit, entweder „celsius" oder „fahrenheit""
            }
          },
          required: ["location"]
        }
      },
  ],
  messages: [{ role: "user", content: "Finden Sie Flüge von San Francisco zu einem Ort mit wärmerem Wetter." }],
  betas: ["computer-use-2025-01-24"],
  thinking: { type: "enabled", budget_tokens: 1024 },
});
console.log(message);
```
```java Java
import java.util.List;
import java.util.Map;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.JsonValue;
import com.anthropic.models.beta.messages.BetaMessage;
import com.anthropic.models.beta.messages.MessageCreateParams;
import com.anthropic.models.beta.messages.BetaToolBash20250124;
import com.anthropic.models.beta.messages.BetaToolComputerUse20250124;
import com.anthropic.models.beta.messages.BetaToolTextEditor20250124;
import com.anthropic.models.beta.messages.BetaThinkingConfigEnabled;
import com.anthropic.models.beta.messages.BetaThinkingConfigParam;
import com.anthropic.models.beta.messages.BetaTool;

public class MultipleToolsExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        MessageCreateParams params = MessageCreateParams.builder()
                .model("claude-sonnet-4-5")
                .maxTokens(1024)
                .addTool(BetaToolComputerUse20250124.builder()
                        .displayWidthPx(1024)
                        .displayHeightPx(768)
                        .displayNumber(1)
                        .build())
                .addTool(BetaToolTextEditor20250124.builder()
                        .build())
                .addTool(BetaToolBash20250124.builder()
                        .build())
                .addTool(BetaTool.builder()
                        .name("get_weather")
                        .description("Rufen Sie das aktuelle Wetter an einem bestimmten Ort ab")
                        .inputSchema(BetaTool.InputSchema.builder()
                                .properties(
                                        JsonValue.from(
                                                Map.of(
                                                        "location", Map.of(
                                                                "type", "string",
                                                                "description", "Die Stadt und der Staat, z. B. San Francisco, CA"
                                                        ),
                                                        "unit", Map.of(
                                                                "type", "string",
                                                                "enum", List.of("celsius", "fahrenheit"),
                                                                "description", "Die Temperatureinheit, entweder „celsius" oder „fahrenheit""
                                                        )
                                                )
                                        ))
                                .build()
                        )
                        .build())
                .thinking(BetaThinkingConfigParam.ofEnabled(
                        BetaThinkingConfigEnabled.builder()
                                .budgetTokens(1024)
                                .build()
                ))
                .addUserMessage("Finden Sie Flüge von San Francisco zu einem Ort mit wärmerem Wetter.")
                .addBeta("computer-use-2025-01-24")
                .build();

        BetaMessage message = client.beta().messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>

### Erstellen Sie eine benutzerdefinierte Computernutzungsumgebung

Die [Referenzimplementierung](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo) soll Ihnen den Einstieg in die Computernutzung erleichtern. Sie enthält alle Komponenten, die Claude benötigt, um einen Computer zu nutzen. Sie können jedoch auch Ihre eigene Umgebung für die Computernutzung erstellen, die Ihren Anforderungen entspricht. Sie benötigen:

- Eine virtualisierte oder containerisierte Umgebung, die für die Computernutzung mit Claude geeignet ist
- Eine Implementierung von mindestens einem der von Anthropic definierten Computernutzungswerkzeuge
- Eine Agent-Schleife, die mit der Claude API interagiert und die `tool_use`-Ergebnisse mit Ihren Werkzeugimplementierungen ausführt
- Eine API oder Benutzeroberfläche, die Benutzereingaben ermöglicht, um die Agent-Schleife zu starten

#### Implementieren Sie das Computernutzungswerkzeug

Das Computernutzungswerkzeug wird als schemafreies Werkzeug implementiert. Bei der Verwendung dieses Werkzeugs müssen Sie kein Eingabeschema wie bei anderen Werkzeugen bereitstellen; das Schema ist in Claudes Modell integriert und kann nicht geändert werden.

<Steps>
  <Step title="Richten Sie Ihre Computerumgebung ein">
    Erstellen Sie eine virtuelle Anzeige oder verbinden Sie sich mit einer vorhandenen Anzeige, mit der Claude interagiert. Dies umfasst normalerweise die Einrichtung von Xvfb (X Virtual Framebuffer) oder ähnlicher Technologie.
  </Step>
  <Step title="Implementieren Sie Action-Handler">
    Erstellen Sie Funktionen, um jeden Action-Typ zu verarbeiten, den Claude anfordern könnte:
    ```python
    def handle_computer_action(action_type, params):
        if action_type == "screenshot":
            return capture_screenshot()
        elif action_type == "left_click":
            x, y = params["coordinate"]
            return click_at(x, y)
        elif action_type == "type":
            return type_text(params["text"])
        # ... handle other actions
    ```
  </Step>
  <Step title="Verarbeiten Sie Claudes Tool-Aufrufe">
    Extrahieren und führen Sie Tool-Aufrufe aus Claudes Antworten aus:
    ```python
    for content in response.content:
        if content.type == "tool_use":
            action = content.input["action"]
            result = handle_computer_action(action, content.input)
            
            # Return result to Claude
            tool_result = {
                "type": "tool_result",
                "tool_use_id": content.id,
                "content": result
            }
    ```
  </Step>
  <Step title="Implementieren Sie die Agent-Schleife">
    Erstellen Sie eine Schleife, die fortgesetzt wird, bis Claude die Aufgabe abgeschlossen hat:
    ```python
    while True:
        response = client.beta.messages.create(...)
        
        # Check if Claude used any tools
        tool_results = process_tool_calls(response)
        
        if not tool_results:
            # No more tool use, task complete
            break
            
        # Continue conversation with tool results
        messages.append({"role": "user", "content": tool_results})
    ```
  </Step>
</Steps>

#### Fehler behandeln

Bei der Implementierung des Computernutzungswerkzeugs können verschiedene Fehler auftreten. So behandeln Sie diese:

<section title="Screenshot-Erfassungsfehler">

Wenn die Screenshot-Erfassung fehlschlägt, geben Sie eine entsprechende Fehlermeldung zurück:

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Error: Failed to capture screenshot. Display may be locked or unavailable.",
      "is_error": true
    }
  ]
}
```

</section>

<section title="Ungültige Koordinaten">

Wenn Claude Koordinaten außerhalb der Anzeigebegrenzungen bereitstellt:

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Error: Coordinates (1200, 900) are outside display bounds (1024x768).",
      "is_error": true
    }
  ]
}
```

</section>

<section title="Action-Ausführungsfehler">

Wenn eine Action nicht ausgeführt werden kann:

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Error: Failed to perform click action. The application may be unresponsive.",
      "is_error": true
    }
  ]
}
```

</section>

#### Koordinatenskalierung für höhere Auflösungen verarbeiten

Die API beschränkt Bilder auf maximal 1568 Pixel auf der längsten Kante und ungefähr 1,15 Megapixel insgesamt (siehe [Bildgrößenänderung](/docs/de/build-with-claude/vision#evaluate-image-size) für Details). Beispielsweise wird ein 1512x982-Bildschirm auf ungefähr 1330x864 heruntergesampled. Claude analysiert dieses kleinere Bild und gibt Koordinaten in diesem Raum zurück, aber Ihr Werkzeug führt Klicks im ursprünglichen Bildschirmraum aus.

Dies kann dazu führen, dass Claudes Klickkoordinaten ihre Ziele verfehlen, es sei denn, Sie verarbeiten die Koordinatentransformation.

Um dies zu beheben, ändern Sie die Größe von Screenshots selbst und skalieren Sie Claudes Koordinaten zurück:

<CodeGroup>
```python Python
import math

def get_scale_factor(width, height):
    """Calculate scale factor to meet API constraints."""
    long_edge = max(width, height)
    total_pixels = width * height

    long_edge_scale = 1568 / long_edge
    total_pixels_scale = math.sqrt(1_150_000 / total_pixels)

    return min(1.0, long_edge_scale, total_pixels_scale)

# When capturing screenshot
scale = get_scale_factor(screen_width, screen_height)
scaled_width = int(screen_width * scale)
scaled_height = int(screen_height * scale)

# Resize image to scaled dimensions before sending to Claude
screenshot = capture_and_resize(scaled_width, scaled_height)

# When handling Claude's coordinates, scale them back up
def execute_click(x, y):
    screen_x = x / scale
    screen_y = y / scale
    perform_click(screen_x, screen_y)
```

```typescript TypeScript
const MAX_LONG_EDGE = 1568;
const MAX_PIXELS = 1_150_000;

function getScaleFactor(width: number, height: number): number {
  const longEdge = Math.max(width, height);
  const totalPixels = width * height;

  const longEdgeScale = MAX_LONG_EDGE / longEdge;
  const totalPixelsScale = Math.sqrt(MAX_PIXELS / totalPixels);

  return Math.min(1.0, longEdgeScale, totalPixelsScale);
}

// When capturing screenshot
const scale = getScaleFactor(screenWidth, screenHeight);
const scaledWidth = Math.floor(screenWidth * scale);
const scaledHeight = Math.floor(screenHeight * scale);

// Resize image to scaled dimensions before sending to Claude
const screenshot = captureAndResize(scaledWidth, scaledHeight);

// When handling Claude's coordinates, scale them back up
function executeClick(x: number, y: number): void {
  const screenX = x / scale;
  const screenY = y / scale;
  performClick(screenX, screenY);
}
```
</CodeGroup>

#### Befolgen Sie Best Practices für die Implementierung

<section title="Verwenden Sie eine angemessene Anzeigeauflösung">

Legen Sie Anzeigedimensionen fest, die Ihrem Anwendungsfall entsprechen und innerhalb der empfohlenen Grenzen liegen:
- Für allgemeine Desktop-Aufgaben: 1024x768 oder 1280x720
- Für Webanwendungen: 1280x800 oder 1366x768
- Vermeiden Sie Auflösungen über 1920x1080, um Leistungsprobleme zu vermeiden

</section>

<section title="Implementieren Sie ordnungsgemäße Screenshot-Verarbeitung">

Beim Zurückgeben von Screenshots an Claude:
- Codieren Sie Screenshots als Base64 PNG oder JPEG
- Erwägen Sie, große Screenshots zu komprimieren, um die Leistung zu verbessern
- Fügen Sie relevante Metadaten wie Zeitstempel oder Anzeigestatus ein
- Wenn Sie höhere Auflösungen verwenden, stellen Sie sicher, dass Koordinaten genau skaliert werden

</section>

<section title="Fügen Sie Action-Verzögerungen hinzu">

Einige Anwendungen benötigen Zeit, um auf Actions zu reagieren:
```python
def click_and_wait(x, y, wait_time=0.5):
    click_at(x, y)
    time.sleep(wait_time)  # Allow UI to update
```

</section>

<section title="Validieren Sie Actions vor der Ausführung">

Überprüfen Sie, dass angeforderte Actions sicher und gültig sind:
```python
def validate_action(action_type, params):
    if action_type == "left_click":
        x, y = params.get("coordinate", (0, 0))
        if not (0 <= x < display_width and 0 <= y < display_height):
            return False, "Coordinates out of bounds"
    return True, None
```

</section>

<section title="Protokollieren Sie Actions zum Debuggen">

Führen Sie ein Protokoll aller Actions zur Fehlerbehebung:
```python
import logging

def log_action(action_type, params, result):
    logging.info(f"Action: {action_type}, Params: {params}, Result: {result}")
```

</section>

---

## Verstehen Sie die Einschränkungen der Computernutzung

Die Computernutzungsfunktionalität befindet sich in der Beta-Phase. Während Claudes Fähigkeiten hochmodern sind, sollten Entwickler sich seiner Einschränkungen bewusst sein:

1. **Latenz**: Die aktuelle Computernutzungslatenz für Mensch-KI-Interaktionen kann im Vergleich zu regulären menschlich geleiteten Computeraktionen zu langsam sein. Wir empfehlen, sich auf Anwendungsfälle zu konzentrieren, bei denen Geschwindigkeit nicht kritisch ist (z. B. Hintergrund-Informationsbeschaffung, automatisierte Softwaretests) in vertrauenswürdigen Umgebungen.
2. **Genauigkeit und Zuverlässigkeit der Computervision**: Claude kann Fehler machen oder halluzinieren, wenn er spezifische Koordinaten ausgibt, während er Actions generiert. Claude Sonnet 3.7 führt die Thinking-Fähigkeit ein, die Ihnen helfen kann, die Überlegungen des Modells zu verstehen und potenzielle Probleme zu identifizieren.
3. **Genauigkeit und Zuverlässigkeit der Werkzeugauswahl**: Claude kann Fehler machen oder halluzinieren, wenn er Werkzeuge auswählt, während er Actions generiert, oder unerwartete Actions durchführt, um Probleme zu lösen. Darüber hinaus kann die Zuverlässigkeit niedriger sein, wenn Sie mit Nischen-Anwendungen oder mehreren Anwendungen gleichzeitig interagieren. Wir empfehlen, dass Benutzer das Modell sorgfältig auffordern, wenn sie komplexe Aufgaben anfordern.
4. **Scroll-Zuverlässigkeit**: Claude Sonnet 3.7 führte dedizierte Scroll-Actions mit Richtungssteuerung ein, die die Zuverlässigkeit verbessern. Das Modell kann jetzt explizit in jede Richtung (oben/unten/links/rechts) um einen bestimmten Betrag scrollen.
5. **Tabellenkalkulationsinteraktion**: Mausklicks für die Tabellenkalkulationsinteraktion haben sich in Claude Sonnet 3.7 mit der Hinzufügung von präziseren Maussteuerungsaktionen wie `left_mouse_down`, `left_mouse_up` und neuer Modifiziertastaturunterstützung verbessert. Die Zellauswahl kann zuverlässiger sein, indem Sie diese feinen Steuerungen verwenden und Modifiziertasten mit Klicks kombinieren.
6. **Kontoerstellung und Inhaltsgenerierung auf sozialen Medien und Kommunikationsplattformen**: Während Claude Websites besucht, begrenzen wir seine Fähigkeit, Konten zu erstellen oder Inhalte zu generieren und zu teilen oder sich anderweitig in Menschenimitationen auf Social-Media-Websites und -Plattformen zu engagieren. Wir können diese Fähigkeit in Zukunft aktualisieren.
7. **Anfälligkeiten**: Anfälligkeiten wie Jailbreaking oder Prompt-Injection können über Frontier-KI-Systeme bestehen bleiben, einschließlich der Beta-Computernutzungs-API. In einigen Fällen folgt Claude Befehlen, die in Inhalten gefunden werden, manchmal sogar im Konflikt mit den Anweisungen des Benutzers. Beispielsweise können Claude-Anweisungen auf Webseiten oder in Bildern Anweisungen außer Kraft setzen oder Claude dazu veranlassen, Fehler zu machen. Wir empfehlen:
   a. Beschränkung der Computernutzung auf vertrauenswürdige Umgebungen wie virtuelle Maschinen oder Container mit minimalen Berechtigungen
   b. Vermeidung der Gewährung von Computernutzungszugriff auf sensible Konten oder Daten ohne strenge Überwachung
   c. Informieren Sie Endbenutzer über relevante Risiken und erhalten Sie ihre Zustimmung, bevor Sie Computernutzungsfunktionen in Ihren Anwendungen aktivieren oder Berechtigungen anfordern
8. **Unangemessene oder illegale Aktionen**: Gemäß Anthropics Nutzungsbedingungen dürfen Sie die Computernutzung nicht verwenden, um gegen Gesetze oder unsere Acceptable Use Policy zu verstoßen.

Überprüfen und verifizieren Sie immer sorgfältig Claudes Computernutzungsaktionen und Protokolle. Verwenden Sie Claude nicht für Aufgaben, die perfekte Präzision oder sensible Benutzerinformationen ohne menschliche Überwachung erfordern.

---

## Preisgestaltung

Computer use follows the standard [tool use pricing](/docs/en/agents-and-tools/tool-use/overview#pricing). When using the computer use tool:

**System prompt overhead**: The computer use beta adds 466-499 tokens to the system prompt

**Computer use tool token usage**:
| Model | Input tokens per tool definition |
| ----- | -------------------------------- |
| Claude 4.x models | 735 tokens |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations)) | 735 tokens |

**Additional token consumption**:
- Screenshot images (see [Vision pricing](/docs/en/build-with-claude/vision))
- Tool execution results returned to Claude

<Note>
If you're also using bash or text editor tools alongside computer use, those tools have their own token costs as documented in their respective pages.
</Note>

## Nächste Schritte

<CardGroup cols={2}>
  <Card
    title="Referenzimplementierung"
    icon="github-logo"
    href="https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo"
  >
    Schneller Einstieg mit unserer vollständigen Docker-basierten Implementierung
  </Card>
  <Card
    title="Werkzeugdokumentation"
    icon="tool"
    href="/docs/de/agents-and-tools/tool-use/overview"
  >
    Erfahren Sie mehr über Tool-Nutzung und das Erstellen benutzerdefinierter Werkzeuge
  </Card>
</CardGroup>