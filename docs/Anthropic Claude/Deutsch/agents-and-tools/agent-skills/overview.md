# Agent Skills

Agent Skills sind modulare Funktionen, die Claudes Funktionalität erweitern. Jede Skill verpackt Anweisungen, Metadaten und optionale Ressourcen (Skripte, Vorlagen), die Claude automatisch verwendet, wenn relevant.

---

## Warum Skills verwenden

Skills sind wiederverwendbare, dateisystembasierte Ressourcen, die Claude mit domänenspezifischer Expertise versorgen: Workflows, Kontext und Best Practices, die allgemeine Agenten in Spezialisten verwandeln. Im Gegensatz zu Prompts (Anweisungen auf Gesprächsebene für einmalige Aufgaben) werden Skills bei Bedarf geladen und eliminieren die Notwendigkeit, dieselbe Anleitung wiederholt über mehrere Gespräche hinweg bereitzustellen.

**Wichtigste Vorteile**:
- **Claude spezialisieren**: Passen Sie Funktionen für domänenspezifische Aufgaben an
- **Wiederholung reduzieren**: Erstellen Sie einmal, verwenden Sie automatisch
- **Funktionen kombinieren**: Kombinieren Sie Skills, um komplexe Workflows zu erstellen

<Note>
Für einen tieferen Einblick in die Architektur und reale Anwendungen von Agent Skills lesen Sie unseren Engineering-Blog: [Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills).
</Note>

## Skills verwenden

Anthropic bietet vorgefertigte Agent Skills für häufige Dokumentaufgaben (PowerPoint, Excel, Word, PDF), und Sie können Ihre eigenen benutzerdefinierten Skills erstellen. Beide funktionieren auf die gleiche Weise. Claude verwendet sie automatisch, wenn sie für Ihre Anfrage relevant sind.

**Vorgefertigte Agent Skills** sind für alle Benutzer auf claude.ai und über die Claude API verfügbar. Siehe den Abschnitt [Verfügbare Skills](#available-skills) unten für die vollständige Liste.

**Benutzerdefinierte Skills** ermöglichen es Ihnen, Domänenexpertise und Organisationswissen zu verpacken. Sie sind über Claudes Produkte verfügbar: Erstellen Sie sie in Claude Code, laden Sie sie über die API hoch, oder fügen Sie sie in den claude.ai-Einstellungen hinzu.

<Note>
**Erste Schritte:**
- Für vorgefertigte Agent Skills: Siehe das [Schnellstart-Tutorial](/docs/de/agents-and-tools/agent-skills/quickstart), um PowerPoint-, Excel-, Word- und PDF-Skills in der API zu verwenden
- Für benutzerdefinierte Skills: Siehe das [Agent Skills Cookbook](https://github.com/anthropics/claude-cookbooks/tree/main/skills), um zu erfahren, wie Sie Ihre eigenen Skills erstellen
</Note>

## Wie Skills funktionieren

Skills nutzen Claudes VM-Umgebung, um Funktionen bereitzustellen, die über das hinausgehen, was nur mit Prompts möglich ist. Claude läuft in einer virtuellen Maschine mit Dateisystemzugriff, was Skills ermöglicht, als Verzeichnisse zu existieren, die Anweisungen, ausführbaren Code und Referenzmaterialien enthalten, organisiert wie ein Onboarding-Leitfaden, den Sie für ein neues Teammitglied erstellen würden.

Diese dateisystembasierte Architektur ermöglicht **progressive Offenlegung**: Claude lädt Informationen in Phasen nach Bedarf, anstatt den Kontext im Voraus zu verbrauchen.

### Drei Arten von Skill-Inhalten, drei Ebenen des Ladens

Skills können drei Arten von Inhalten enthalten, die zu unterschiedlichen Zeiten geladen werden:

### Ebene 1: Metadaten (immer geladen)

**Inhaltstyp: Anweisungen**. Die YAML-Frontmatter der Skill bietet Erkennungsinformationen:

```yaml
---
name: pdf-processing
description: Extract text and tables from PDF files, fill forms, merge documents. Use when working with PDF files or when the user mentions PDFs, forms, or document extraction.
---
```

Claude lädt diese Metadaten beim Start und fügt sie in den System-Prompt ein. Dieser leichte Ansatz bedeutet, dass Sie viele Skills installieren können, ohne Kontextstrafe; Claude kennt nur jede Skill und wann sie verwendet werden soll.

### Ebene 2: Anweisungen (geladen wenn ausgelöst)

**Inhaltstyp: Anweisungen**. Der Hauptteil der SKILL.md enthält prozedurales Wissen: Workflows, Best Practices und Anleitung:

````markdown
# PDF Processing

## Quick start

Use pdfplumber to extract text from PDFs:

```python
import pdfplumber

with pdfplumber.open("document.pdf") as pdf:
    text = pdf.pages[0].extract_text()
```

For advanced form filling, see [FORMS.md](FORMS.md).
````

Wenn Sie etwas anfordern, das der Beschreibung einer Skill entspricht, liest Claude SKILL.md über Bash aus dem Dateisystem. Erst dann gelangt dieser Inhalt in das Kontextfenster.

### Ebene 3: Ressourcen und Code (geladen nach Bedarf)

**Inhaltstypen: Anweisungen, Code und Ressourcen**. Skills können zusätzliche Materialien bündeln:

```
pdf-skill/
├── SKILL.md (main instructions)
├── FORMS.md (form-filling guide)
├── REFERENCE.md (detailed API reference)
└── scripts/
    └── fill_form.py (utility script)
```

**Anweisungen**: Zusätzliche Markdown-Dateien (FORMS.md, REFERENCE.md) mit spezialisierter Anleitung und Workflows

**Code**: Ausführbare Skripte (fill_form.py, validate.py), die Claude über Bash ausführt; Skripte bieten deterministische Operationen ohne Kontextverbrauch

**Ressourcen**: Referenzmaterialien wie Datenbankschemas, API-Dokumentation, Vorlagen oder Beispiele

Claude greift auf diese Dateien nur zu, wenn sie referenziert werden. Das Dateisystemmodell bedeutet, dass jeder Inhaltstyp unterschiedliche Stärken hat: Anweisungen für flexible Anleitung, Code für Zuverlässigkeit, Ressourcen für faktische Nachschlagung.

| Ebene | Wann geladen | Token-Kosten | Inhalt |
|---|---|---|---|
| **Ebene 1: Metadaten** | Immer (beim Start) | ~100 Token pro Skill | `name` und `description` aus YAML-Frontmatter |
| **Ebene 2: Anweisungen** | Wenn Skill ausgelöst wird | Unter 5k Token | SKILL.md-Text mit Anweisungen und Anleitung |
| **Ebene 3+: Ressourcen** | Nach Bedarf | Praktisch unbegrenzt | Gebündelte Dateien, die über Bash ausgeführt werden, ohne Inhalte in den Kontext zu laden |

Progressive Offenlegung stellt sicher, dass nur relevante Inhalte zu jedem Zeitpunkt das Kontextfenster einnehmen.

### Die Skills-Architektur

Skills laufen in einer Code-Ausführungsumgebung, in der Claude Dateisystemzugriff, Bash-Befehle und Code-Ausführungsfunktionen hat. Stellen Sie es sich so vor: Skills existieren als Verzeichnisse auf einer virtuellen Maschine, und Claude interagiert mit ihnen mit denselben Bash-Befehlen, die Sie verwenden würden, um auf Ihrem Computer durch Dateien zu navigieren.

![Agent Skills Architecture - showing how Skills integrate with the agent's configuration and virtual machine](/docs/images/agent-skills-architecture.png)

**Wie Claude auf Skill-Inhalte zugreift:**

Wenn eine Skill ausgelöst wird, verwendet Claude Bash, um SKILL.md aus dem Dateisystem zu lesen und ihre Anweisungen in das Kontextfenster zu bringen. Wenn diese Anweisungen auf andere Dateien verweisen (wie FORMS.md oder ein Datenbankschema), liest Claude diese Dateien auch mit zusätzlichen Bash-Befehlen. Wenn Anweisungen ausführbare Skripte erwähnen, führt Claude sie über Bash aus und erhält nur die Ausgabe (der Skriptcode selbst gelangt nie in den Kontext).

**Was diese Architektur ermöglicht:**

**On-Demand-Dateizugriff**: Claude liest nur die Dateien, die für jede spezifische Aufgabe erforderlich sind. Eine Skill kann Dutzende von Referenzdateien enthalten, aber wenn Ihre Aufgabe nur das Verkaufsschema benötigt, lädt Claude nur diese eine Datei. Der Rest bleibt im Dateisystem und verbraucht null Token.

**Effiziente Skriptausführung**: Wenn Claude `validate_form.py` ausführt, wird der Code des Skripts nie in das Kontextfenster geladen. Nur die Ausgabe des Skripts (wie „Validierung bestanden" oder spezifische Fehlermeldungen) verbraucht Token. Dies macht Skripte viel effizienter als wenn Claude äquivalenten Code spontan generieren würde.

**Keine praktische Grenze für gebündelte Inhalte**: Da Dateien den Kontext nicht verbrauchen, bis sie zugegriffen werden, können Skills umfassende API-Dokumentation, große Datensätze, umfangreiche Beispiele oder alle erforderlichen Referenzmaterialien enthalten. Es gibt keine Kontextstrafe für gebündelte Inhalte, die nicht verwendet werden.

Dieses dateisystembasierte Modell ist das, was progressive Offenlegung möglich macht. Claude navigiert Ihre Skill wie Sie spezifische Abschnitte eines Onboarding-Leitfadens referenzieren würden, und greift genau auf das zu, was jede Aufgabe erfordert.

### Beispiel: Laden einer PDF-Verarbeitungs-Skill

Hier ist, wie Claude eine PDF-Verarbeitungs-Skill lädt und verwendet:

1. **Start**: System-Prompt enthält: `PDF Processing - Extract text and tables from PDF files, fill forms, merge documents`
2. **Benutzeranfrage**: „Extrahieren Sie den Text aus diesem PDF und fassen Sie ihn zusammen"
3. **Claude ruft auf**: `bash: read pdf-skill/SKILL.md` → Anweisungen in Kontext geladen
4. **Claude bestimmt**: Formularausfüllung ist nicht erforderlich, daher wird FORMS.md nicht gelesen
5. **Claude führt aus**: Verwendet Anweisungen aus SKILL.md, um die Aufgabe zu erledigen

![Skills loading into context window - showing the progressive loading of skill metadata and content](/docs/images/agent-skills-context-window.png)

Das Diagramm zeigt:
1. Standardzustand mit System-Prompt und Skill-Metadaten vorgeladen
2. Claude löst die Skill aus, indem er SKILL.md über Bash liest
3. Claude liest optional zusätzliche gebündelte Dateien wie FORMS.md nach Bedarf
4. Claude fährt mit der Aufgabe fort

Dieses dynamische Laden stellt sicher, dass nur relevante Skill-Inhalte das Kontextfenster einnehmen.

## Wo Skills funktionieren

Skills sind über Claudes Agent-Produkte verfügbar:

### Claude API

Die Claude API unterstützt sowohl vorgefertigte Agent Skills als auch benutzerdefinierte Skills. Beide funktionieren identisch: Geben Sie die relevante `skill_id` im `container`-Parameter zusammen mit dem Code-Ausführungs-Tool an.

**Voraussetzungen**: Die Verwendung von Skills über die API erfordert drei Beta-Header:
- `code-execution-2025-08-25` - Skills laufen im Code-Ausführungs-Container
- `skills-2025-10-02` - Aktiviert Skills-Funktionalität
- `files-api-2025-04-14` - Erforderlich zum Hochladen/Herunterladen von Dateien zum/vom Container

Verwenden Sie vorgefertigte Agent Skills, indem Sie ihre `skill_id` referenzieren (z. B. `pptx`, `xlsx`), oder erstellen und laden Sie Ihre eigenen über die Skills API (`/v1/skills`-Endpunkte) hoch. Benutzerdefinierte Skills werden organisationsweit geteilt.

Weitere Informationen finden Sie unter [Use Skills with the Claude API](/docs/de/build-with-claude/skills-guide).

### Claude Code

[Claude Code](https://code.claude.com/docs/overview) unterstützt nur benutzerdefinierte Skills.

**Benutzerdefinierte Skills**: Erstellen Sie Skills als Verzeichnisse mit SKILL.md-Dateien. Claude entdeckt und verwendet sie automatisch.

Benutzerdefinierte Skills in Claude Code sind dateisystembasiert und erfordern keine API-Uploads.

Weitere Informationen finden Sie unter [Use Skills in Claude Code](https://code.claude.com/docs/skills).

### Claude Agent SDK

Das [Claude Agent SDK](/docs/de/agent-sdk/overview) unterstützt benutzerdefinierte Skills durch dateisystembasierte Konfiguration.

**Benutzerdefinierte Skills**: Erstellen Sie Skills als Verzeichnisse mit SKILL.md-Dateien in `.claude/skills/`. Aktivieren Sie Skills, indem Sie `"Skill"` in Ihre `allowed_tools`-Konfiguration einbeziehen.

Skills im Agent SDK werden dann automatisch erkannt, wenn das SDK ausgeführt wird.

Weitere Informationen finden Sie unter [Agent Skills in the SDK](/docs/de/agent-sdk/skills).

### Claude.ai

[Claude.ai](https://claude.ai) unterstützt sowohl vorgefertigte Agent Skills als auch benutzerdefinierte Skills.

**Vorgefertigte Agent Skills**: Diese Skills funktionieren bereits im Hintergrund, wenn Sie Dokumente erstellen. Claude verwendet sie ohne erforderliches Setup.

**Benutzerdefinierte Skills**: Laden Sie Ihre eigenen Skills als ZIP-Dateien über Einstellungen > Funktionen hoch. Verfügbar auf Pro-, Max-, Team- und Enterprise-Plänen mit aktivierter Code-Ausführung. Benutzerdefinierte Skills sind individuell für jeden Benutzer; sie werden nicht organisationsweit geteilt und können nicht zentral von Administratoren verwaltet werden.

Weitere Informationen zur Verwendung von Skills in Claude.ai finden Sie in den folgenden Ressourcen im Claude Help Center:
- [What are Skills?](https://support.claude.com/en/articles/12512176-what-are-skills)
- [Using Skills in Claude](https://support.claude.com/en/articles/12512180-using-skills-in-claude)
- [How to create custom Skills](https://support.claude.com/en/articles/12512198-creating-custom-skills)
- [Tech Claude your way of working using Skills](https://support.claude.com/en/articles/12580051-teach-claude-your-way-of-working-using-skills)

## Skill-Struktur

Jede Skill erfordert eine `SKILL.md`-Datei mit YAML-Frontmatter:

```yaml
---
name: your-skill-name
description: Brief description of what this Skill does and when to use it
---

# Your Skill Name

## Instructions
[Clear, step-by-step guidance for Claude to follow]

## Examples
[Concrete examples of using this Skill]
```

**Erforderliche Felder**: `name` und `description`

**Feldanforderungen**:

`name`:
- Maximal 64 Zeichen
- Darf nur Kleinbuchstaben, Zahlen und Bindestriche enthalten
- Darf keine XML-Tags enthalten
- Darf keine reservierten Wörter enthalten: „anthropic", „claude"

`description`:
- Darf nicht leer sein
- Maximal 1024 Zeichen
- Darf keine XML-Tags enthalten

Die `description` sollte sowohl enthalten, was die Skill tut, als auch wann Claude sie verwenden sollte. Für vollständige Authoring-Anleitung siehe den [Best-Practices-Leitfaden](/docs/de/agents-and-tools/agent-skills/best-practices).

## Sicherheitsüberlegungen

Wir empfehlen dringend, Skills nur aus vertrauenswürdigen Quellen zu verwenden: solche, die Sie selbst erstellt haben oder von Anthropic erhalten haben. Skills bieten Claude neue Funktionen durch Anweisungen und Code, und während dies sie leistungsstark macht, bedeutet es auch, dass eine bösartige Skill Claude anweisen kann, Tools aufzurufen oder Code auf Weise auszuführen, die nicht dem angegebenen Zweck der Skill entsprechen.

<Warning>
Wenn Sie eine Skill aus einer nicht vertrauenswürdigen oder unbekannten Quelle verwenden müssen, üben Sie extreme Vorsicht aus und prüfen Sie sie gründlich vor der Verwendung. Je nachdem, welchen Zugriff Claude bei der Ausführung der Skill hat, könnten bösartige Skills zu Datenlecks, unbefugtem Systemzugriff oder anderen Sicherheitsrisiken führen.
</Warning>

**Wichtigste Sicherheitsüberlegungen**:
- **Gründlich prüfen**: Überprüfen Sie alle in der Skill gebündelten Dateien: SKILL.md, Skripte, Bilder und andere Ressourcen. Suchen Sie nach ungewöhnlichen Mustern wie unerwarteten Netzwerkaufrufen, Dateizugriffsmuster oder Operationen, die nicht dem angegebenen Zweck der Skill entsprechen
- **Externe Quellen sind riskant**: Skills, die Daten von externen URLs abrufen, bergen besonderes Risiko, da abgerufene Inhalte bösartige Anweisungen enthalten können. Selbst vertrauenswürdige Skills können kompromittiert werden, wenn sich ihre externen Abhängigkeiten im Laufe der Zeit ändern
- **Tool-Missbrauch**: Bösartige Skills können Tools (Dateivorgänge, Bash-Befehle, Code-Ausführung) auf schädliche Weise aufrufen
- **Datenlecks**: Skills mit Zugriff auf sensible Daten könnten so gestaltet sein, dass sie Informationen an externe Systeme lecken
- **Behandeln Sie es wie die Installation von Software**: Verwenden Sie Skills nur aus vertrauenswürdigen Quellen. Seien Sie besonders vorsichtig, wenn Sie Skills in Produktionssystemen mit Zugriff auf sensible Daten oder kritische Operationen integrieren

## Verfügbare Skills

### Vorgefertigte Agent Skills

Die folgenden vorgefertigten Agent Skills sind sofort verfügbar:

- **PowerPoint (pptx)**: Erstellen Sie Präsentationen, bearbeiten Sie Folien, analysieren Sie Präsentationsinhalte
- **Excel (xlsx)**: Erstellen Sie Tabellenkalkulationen, analysieren Sie Daten, generieren Sie Berichte mit Diagrammen
- **Word (docx)**: Erstellen Sie Dokumente, bearbeiten Sie Inhalte, formatieren Sie Text
- **PDF (pdf)**: Generieren Sie formatierte PDF-Dokumente und Berichte

Diese Skills sind auf der Claude API und claude.ai verfügbar. Siehe das [Schnellstart-Tutorial](/docs/de/agents-and-tools/agent-skills/quickstart), um sie in der API zu verwenden.

### Beispiele für benutzerdefinierte Skills

Für vollständige Beispiele von benutzerdefinierten Skills siehe das [Skills Cookbook](https://github.com/anthropics/claude-cookbooks/tree/main/skills).

## Einschränkungen und Beschränkungen

Das Verständnis dieser Einschränkungen hilft Ihnen, Ihre Skills-Bereitstellung effektiv zu planen.

### Verfügbarkeit über Oberflächen hinweg

**Benutzerdefinierte Skills werden nicht über Oberflächen synchronisiert**. Skills, die auf eine Oberfläche hochgeladen werden, sind nicht automatisch auf anderen verfügbar:

- Skills, die auf Claude.ai hochgeladen werden, müssen separat auf die API hochgeladen werden
- Skills, die über die API hochgeladen werden, sind auf Claude.ai nicht verfügbar
- Claude Code Skills sind dateisystembasiert und separat von Claude.ai und API

Sie müssen Skills separat für jede Oberfläche verwalten und hochladen, auf der Sie sie verwenden möchten.

### Freigabebereich

Skills haben je nach Verwendungsort unterschiedliche Freigabemodelle:
- **Claude.ai**: Nur einzelner Benutzer; jedes Teammitglied muss separat hochladen
- **Claude API**: Arbeitsbereich-weit; alle Arbeitsbereichsmitglieder können hochgeladene Skills zugreifen
- **Claude Code**: Persönlich (`~/.claude/skills/`) oder projektbasiert (`.claude/skills/`)

Claude.ai unterstützt derzeit keine zentralisierte Admin-Verwaltung oder organisationsweite Verteilung von benutzerdefinierten Skills.

### Laufzeitumgebungsbeschränkungen

Skills laufen im Code-Ausführungs-Container mit diesen Einschränkungen:

- **Kein Netzwerkzugriff**: Skills können keine externen API-Aufrufe tätigen oder auf das Internet zugreifen
- **Keine Laufzeit-Paketinstallation**: Nur vorinstallierte Pakete sind verfügbar. Sie können während der Ausführung keine neuen Pakete installieren.
- **Nur vorkonfigurierte Abhängigkeiten**: Überprüfen Sie die [Code-Ausführungs-Tool-Dokumentation](/docs/de/agents-and-tools/tool-use/code-execution-tool) für die Liste der verfügbaren Pakete

Planen Sie Ihre Skills, um innerhalb dieser Einschränkungen zu funktionieren.

## Nächste Schritte

<CardGroup cols={2}>
  <Card
    title="Erste Schritte mit Agent Skills"
    icon="graduation-cap"
    href="/docs/de/agents-and-tools/agent-skills/quickstart"
  >
    Erstellen Sie Ihre erste Skill
  </Card>
  <Card
    title="API-Leitfaden"
    icon="code"
    href="/docs/de/build-with-claude/skills-guide"
  >
    Verwenden Sie Skills mit der Claude API
  </Card>
  <Card
    title="Skills in Claude Code verwenden"
    icon="terminal"
    href="https://code.claude.com/docs/skills"
  >
    Erstellen und verwalten Sie benutzerdefinierte Skills in Claude Code
  </Card>
  <Card
    title="Skills im Agent SDK verwenden"
    icon="cube"
    href="/docs/de/agent-sdk/skills"
  >
    Verwenden Sie Skills programmgesteuert in TypeScript und Python
  </Card>
  <Card
    title="Authoring Best Practices"
    icon="lightbulb"
    href="/docs/de/agents-and-tools/agent-skills/best-practices"
  >
    Schreiben Sie Skills, die Claude effektiv verwenden kann
  </Card>
</CardGroup>