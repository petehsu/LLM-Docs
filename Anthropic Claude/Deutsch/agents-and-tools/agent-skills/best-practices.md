# Best Practices für die Skill-Erstellung

Erfahren Sie, wie Sie effektive Skills schreiben, die Claude entdecken und erfolgreich nutzen kann.

---

Gute Skills sind prägnant, gut strukturiert und wurden mit echter Nutzung getestet. Dieser Leitfaden bietet praktische Entscheidungshilfen, um Ihnen beim Schreiben von Skills zu helfen, die Claude entdecken und effektiv nutzen kann.

Für konzeptionelle Hintergrundinformationen zur Funktionsweise von Skills siehe die [Skills-Übersicht](/docs/de/agents-and-tools/agent-skills/overview).

## Kernprinzipien

### Prägnanz ist der Schlüssel

Das [Kontextfenster](/docs/de/build-with-claude/context-windows) ist ein öffentliches Gut. Ihr Skill teilt sich das Kontextfenster mit allem anderen, das Claude wissen muss, einschließlich:
- Der Systemaufforderung
- Der Gesprächsverlauf
- Der Metadaten anderer Skills
- Ihrer eigentlichen Anfrage

Nicht jeder Token in Ihrem Skill hat unmittelbare Kosten. Beim Start werden nur die Metadaten (Name und Beschreibung) aller Skills vorab geladen. Claude liest SKILL.md nur, wenn der Skill relevant wird, und liest zusätzliche Dateien nur bei Bedarf. Dennoch ist Prägnanz in SKILL.md wichtig: Sobald Claude es lädt, konkurriert jeder Token mit dem Gesprächsverlauf und anderen Kontexten.

**Standardannahme**: Claude ist bereits sehr intelligent

Fügen Sie nur Kontext hinzu, den Claude nicht bereits hat. Hinterfragen Sie jede Information:
- „Braucht Claude diese Erklärung wirklich?"
- „Kann ich davon ausgehen, dass Claude das weiß?"
- „Rechtfertigt dieser Absatz seine Token-Kosten?"

**Gutes Beispiel: Prägnant** (ungefähr 50 Token):
````markdown
## PDF-Text extrahieren

Verwenden Sie pdfplumber zur Textextraktion:

```python
import pdfplumber

with pdfplumber.open("file.pdf") as pdf:
    text = pdf.pages[0].extract_text()
```
````

**Schlechtes Beispiel: Zu ausführlich** (ungefähr 150 Token):
```markdown
## PDF-Text extrahieren

PDF (Portable Document Format) Dateien sind ein gängiges Dateiformat, das
Text, Bilder und andere Inhalte enthält. Um Text aus einer PDF zu extrahieren, müssen Sie
eine Bibliothek verwenden. Es gibt viele Bibliotheken für die PDF-Verarbeitung, aber wir
empfehlen pdfplumber, da es einfach zu verwenden ist und die meisten Fälle gut handhabt.
Zunächst müssen Sie es mit pip installieren. Dann können Sie den folgenden Code verwenden...
```

Die prägnante Version geht davon aus, dass Claude weiß, was PDFs sind und wie Bibliotheken funktionieren.

### Legen Sie angemessene Freiheitsgrade fest

Passen Sie die Spezifität an die Zerbrechlichkeit und Variabilität der Aufgabe an.

**Hohe Freiheit** (textbasierte Anweisungen):

Verwenden Sie, wenn:
- Mehrere Ansätze gültig sind
- Entscheidungen vom Kontext abhängen
- Heuristiken den Ansatz leiten

Beispiel:
```markdown
## Code-Review-Prozess

1. Analysieren Sie die Codestruktur und Organisation
2. Überprüfen Sie auf potenzielle Fehler oder Grenzfälle
3. Schlagen Sie Verbesserungen für Lesbarkeit und Wartbarkeit vor
4. Überprüfen Sie die Einhaltung von Projektkonventionen
```

**Mittlere Freiheit** (Pseudocode oder Skripte mit Parametern):

Verwenden Sie, wenn:
- Ein bevorzugtes Muster existiert
- Einige Variation akzeptabel ist
- Konfiguration das Verhalten beeinflusst

Beispiel:
````markdown
## Bericht generieren

Verwenden Sie diese Vorlage und passen Sie sie nach Bedarf an:

```python
def generate_report(data, format="markdown", include_charts=True):
    # Daten verarbeiten
    # Ausgabe im angegebenen Format generieren
    # Optional Visualisierungen einschließen
```
````

**Niedrige Freiheit** (spezifische Skripte, wenige oder keine Parameter):

Verwenden Sie, wenn:
- Operationen zerbrechlich und fehleranfällig sind
- Konsistenz kritisch ist
- Eine bestimmte Reihenfolge befolgt werden muss

Beispiel:
````markdown
## Datenbankmigrationen

Führen Sie genau dieses Skript aus:

```bash
python scripts/migrate.py --verify --backup
```

Ändern Sie den Befehl nicht und fügen Sie keine zusätzlichen Flags hinzu.
````

**Analogie**: Stellen Sie sich Claude als einen Roboter vor, der einen Weg erkundet:
- **Schmale Brücke mit Klippen auf beiden Seiten**: Es gibt nur einen sicheren Weg nach vorne. Geben Sie spezifische Schutzvorrichtungen und genaue Anweisungen (niedrige Freiheit). Beispiel: Datenbankmigrationen, die in genauer Reihenfolge ausgeführt werden müssen.
- **Offenes Feld ohne Gefahren**: Viele Wege führen zum Erfolg. Geben Sie eine allgemeine Richtung vor und vertrauen Sie Claude, den besten Weg zu finden (hohe Freiheit). Beispiel: Code-Reviews, bei denen der Kontext den besten Ansatz bestimmt.

### Testen Sie mit allen Modellen, die Sie verwenden möchten

Skills fungieren als Ergänzungen zu Modellen, daher hängt die Effektivität vom zugrunde liegenden Modell ab. Testen Sie Ihren Skill mit allen Modellen, die Sie verwenden möchten.

**Testüberlegungen nach Modell**:
- **Claude Haiku** (schnell, wirtschaftlich): Bietet der Skill ausreichend Anleitung?
- **Claude Sonnet** (ausgewogen): Ist der Skill klar und effizient?
- **Claude Opus** (leistungsstarkes Reasoning): Vermeidet der Skill Überexplizitheit?

Was perfekt für Opus funktioniert, könnte für Haiku mehr Details benötigen. Wenn Sie Ihren Skill über mehrere Modelle hinweg verwenden möchten, streben Sie nach Anweisungen, die gut mit allen funktionieren.

## Skill-Struktur

<Note>
**YAML-Frontmatter**: Das SKILL.md-Frontmatter erfordert zwei Felder:

`name`:
- Maximal 64 Zeichen
- Darf nur Kleinbuchstaben, Zahlen und Bindestriche enthalten
- Darf keine XML-Tags enthalten
- Darf keine reservierten Wörter enthalten: „anthropic", „claude"

`description`:
- Darf nicht leer sein
- Maximal 1024 Zeichen
- Darf keine XML-Tags enthalten
- Sollte beschreiben, was der Skill tut und wann er verwendet wird

Vollständige Details zur Skill-Struktur finden Sie in der [Skills-Übersicht](/docs/de/agents-and-tools/agent-skills/overview#skill-structure).
</Note>

### Benennungskonventionen

Verwenden Sie konsistente Benennungsmuster, um Skills leichter referenzierbar und diskutierbar zu machen. Wir empfehlen die Verwendung der **Gerundium-Form** (Verb + -ing) für Skill-Namen, da dies die Aktivität oder Fähigkeit, die der Skill bietet, klar beschreibt.

Denken Sie daran, dass das `name`-Feld nur Kleinbuchstaben, Zahlen und Bindestriche verwenden darf.

**Gute Benennungsbeispiele (Gerundium-Form)**:
- `processing-pdfs`
- `analyzing-spreadsheets`
- `managing-databases`
- `testing-code`
- `writing-documentation`

**Akzeptable Alternativen**:
- Nominalphrasen: `pdf-processing`, `spreadsheet-analysis`
- Aktionsorientiert: `process-pdfs`, `analyze-spreadsheets`

**Vermeiden Sie**:
- Vage Namen: `helper`, `utils`, `tools`
- Zu generisch: `documents`, `data`, `files`
- Reservierte Wörter: `anthropic-helper`, `claude-tools`
- Inkonsistente Muster in Ihrer Skill-Sammlung

Konsistente Benennungen erleichtern:
- Die Referenzierung von Skills in Dokumentation und Gesprächen
- Das Verständnis, was ein Skill auf einen Blick tut
- Die Organisation und Suche durch mehrere Skills
- Die Verwaltung einer professionellen, kohärenten Skill-Bibliothek

### Schreiben Sie effektive Beschreibungen

Das `description`-Feld ermöglicht die Skill-Entdeckung und sollte sowohl enthalten, was der Skill tut, als auch wann er verwendet wird.

<Warning>
**Schreiben Sie immer in der dritten Person**. Die Beschreibung wird in die Systemaufforderung eingefügt, und inkonsistente Perspektive kann zu Entdeckungsproblemen führen.

- **Gut:** „Verarbeitet Excel-Dateien und generiert Berichte"
- **Vermeiden:** „Ich kann Ihnen bei der Verarbeitung von Excel-Dateien helfen"
- **Vermeiden:** „Sie können dies verwenden, um Excel-Dateien zu verarbeiten"
</Warning>

**Seien Sie spezifisch und fügen Sie Schlüsselbegriffe ein**. Fügen Sie sowohl ein, was der Skill tut, als auch spezifische Auslöser/Kontexte für die Verwendung ein.

Jeder Skill hat genau ein Beschreibungsfeld. Die Beschreibung ist entscheidend für die Skill-Auswahl: Claude verwendet sie, um den richtigen Skill aus möglicherweise 100+ verfügbaren Skills auszuwählen. Ihre Beschreibung muss genug Details bieten, damit Claude weiß, wann dieser Skill ausgewählt werden soll, während der Rest von SKILL.md die Implementierungsdetails bietet.

Effektive Beispiele:

**PDF-Verarbeitungs-Skill:**
```yaml
description: Extrahiert Text und Tabellen aus PDF-Dateien, füllt Formulare aus, führt Dokumente zusammen. Verwenden Sie, wenn Sie mit PDF-Dateien arbeiten oder wenn der Benutzer PDFs, Formulare oder Dokumentextraktion erwähnt.
```

**Excel-Analyse-Skill:**
```yaml
description: Analysiert Excel-Tabellen, erstellt Pivot-Tabellen, generiert Diagramme. Verwenden Sie bei der Analyse von Excel-Dateien, Tabellen, tabellarischen Daten oder .xlsx-Dateien.
```

**Git Commit Helper Skill:**
```yaml
description: Generiert aussagekräftige Commit-Nachrichten durch Analyse von Git-Diffs. Verwenden Sie, wenn der Benutzer um Hilfe beim Schreiben von Commit-Nachrichten oder beim Überprüfen von bereitgestellten Änderungen bittet.
```

Vermeiden Sie vage Beschreibungen wie diese:

```yaml
description: Hilft bei Dokumenten
```
```yaml
description: Verarbeitet Daten
```
```yaml
description: Macht Dinge mit Dateien
```

### Progressive Disclosure-Muster

SKILL.md dient als Übersicht, die Claude auf Bedarf zu detaillierten Materialien verweist, ähnlich wie ein Inhaltsverzeichnis in einem Onboarding-Leitfaden. Eine Erklärung der Funktionsweise von Progressive Disclosure finden Sie unter [Wie Skills funktionieren](/docs/de/agents-and-tools/agent-skills/overview#how-skills-work) in der Übersicht.

**Praktische Anleitung:**
- Halten Sie den SKILL.md-Text unter 500 Zeilen für optimale Leistung
- Teilen Sie Inhalte in separate Dateien auf, wenn Sie sich diesem Limit nähern
- Verwenden Sie die folgenden Muster, um Anweisungen, Code und Ressourcen effektiv zu organisieren

#### Visuelle Übersicht: Von einfach zu komplex

Ein grundlegender Skill beginnt mit nur einer SKILL.md-Datei, die Metadaten und Anweisungen enthält:

![Einfache SKILL.md-Datei mit YAML-Frontmatter und Markdown-Text](/docs/images/agent-skills-simple-file.png)

Mit dem Wachstum Ihres Skills können Sie zusätzliche Inhalte bündeln, die Claude nur bei Bedarf lädt:

![Bündelung zusätzlicher Referenzdateien wie reference.md und forms.md.](/docs/images/agent-skills-bundling-content.png)

Die vollständige Skill-Verzeichnisstruktur könnte so aussehen:

```
pdf/
├── SKILL.md              # Hauptanweisungen (geladen, wenn ausgelöst)
├── FORMS.md              # Formularausfüll-Leitfaden (bei Bedarf geladen)
├── reference.md          # API-Referenz (bei Bedarf geladen)
├── examples.md           # Verwendungsbeispiele (bei Bedarf geladen)
└── scripts/
    ├── analyze_form.py   # Utility-Skript (ausgeführt, nicht geladen)
    ├── fill_form.py      # Formularausfüll-Skript
    └── validate.py       # Validierungsskript
```

#### Muster 1: Hochrangiger Leitfaden mit Referenzen

````markdown
---
name: pdf-processing
description: Extrahiert Text und Tabellen aus PDF-Dateien, füllt Formulare aus und führt Dokumente zusammen. Verwenden Sie, wenn Sie mit PDF-Dateien arbeiten oder wenn der Benutzer PDFs, Formulare oder Dokumentextraktion erwähnt.
---

# PDF-Verarbeitung

## Schnellstart

Extrahieren Sie Text mit pdfplumber:
```python
import pdfplumber
with pdfplumber.open("file.pdf") as pdf:
    text = pdf.pages[0].extract_text()
```

## Erweiterte Funktionen

**Formularausfüllung**: Siehe [FORMS.md](FORMS.md) für vollständigen Leitfaden
**API-Referenz**: Siehe [REFERENCE.md](REFERENCE.md) für alle Methoden
**Beispiele**: Siehe [EXAMPLES.md](EXAMPLES.md) für häufige Muster
````

Claude lädt FORMS.md, REFERENCE.md oder EXAMPLES.md nur bei Bedarf.

#### Muster 2: Domänenspezifische Organisation

Für Skills mit mehreren Domänen organisieren Sie Inhalte nach Domäne, um das Laden irrelevanter Kontexte zu vermeiden. Wenn ein Benutzer nach Verkaufsmetriken fragt, braucht Claude nur Verkaufs-bezogene Schemas zu lesen, nicht Finanz- oder Marketingdaten. Dies hält die Token-Nutzung niedrig und den Kontext fokussiert.

```
bigquery-skill/
├── SKILL.md (Übersicht und Navigation)
└── reference/
    ├── finance.md (Umsatz, ARR, Abrechnungsmetriken)
    ├── sales.md (Chancen, Pipeline)
    ├── product.md (API-Nutzung, Funktionen)
    └── marketing.md (Kampagnen, Attribution)
```

````markdown SKILL.md
# BigQuery-Datenanalyse

## Verfügbare Datensätze

**Finanzen**: Umsatz, ARR, Abrechnung → Siehe [reference/finance.md](reference/finance.md)
**Vertrieb**: Chancen, Pipeline, Konten → Siehe [reference/sales.md](reference/sales.md)
**Produkt**: API-Nutzung, Funktionen, Adoption → Siehe [reference/product.md](reference/product.md)
**Marketing**: Kampagnen, Attribution, E-Mail → Siehe [reference/marketing.md](reference/marketing.md)

## Schnellsuche

Finden Sie spezifische Metriken mit grep:

```bash
grep -i "revenue" reference/finance.md
grep -i "pipeline" reference/sales.md
grep -i "api usage" reference/product.md
```
````

#### Muster 3: Bedingte Details

Zeigen Sie grundlegende Inhalte an, verlinken Sie zu erweiterten Inhalten:

```markdown
# DOCX-Verarbeitung

## Dokumente erstellen

Verwenden Sie docx-js für neue Dokumente. Siehe [DOCX-JS.md](DOCX-JS.md).

## Dokumente bearbeiten

Für einfache Bearbeitungen ändern Sie das XML direkt.

**Für nachverfolgte Änderungen**: Siehe [REDLINING.md](REDLINING.md)
**Für OOXML-Details**: Siehe [OOXML.md](OOXML.md)
```

Claude liest REDLINING.md oder OOXML.md nur, wenn der Benutzer diese Funktionen benötigt.

### Vermeiden Sie tief verschachtelte Referenzen

Claude kann Dateien teilweise lesen, wenn sie von anderen referenzierten Dateien referenziert werden. Bei verschachtelten Referenzen könnte Claude Befehle wie `head -100` verwenden, um Inhalte in der Vorschau anzuzeigen, anstatt ganze Dateien zu lesen, was zu unvollständigen Informationen führt.

**Halten Sie Referenzen eine Ebene tief von SKILL.md**. Alle Referenzdateien sollten direkt von SKILL.md verlinken, um sicherzustellen, dass Claude vollständige Dateien liest, wenn nötig.

**Schlechtes Beispiel: Zu tief**:
```markdown
# SKILL.md
Siehe [advanced.md](advanced.md)...

# advanced.md
Siehe [details.md](details.md)...

# details.md
Hier sind die eigentlichen Informationen...
```

**Gutes Beispiel: Eine Ebene tief**:
```markdown
# SKILL.md

**Grundlegende Nutzung**: [Anweisungen in SKILL.md]
**Erweiterte Funktionen**: Siehe [advanced.md](advanced.md)
**API-Referenz**: Siehe [reference.md](reference.md)
**Beispiele**: Siehe [examples.md](examples.md)
```

### Strukturieren Sie längere Referenzdateien mit Inhaltsverzeichnis

Für Referenzdateien länger als 100 Zeilen fügen Sie oben ein Inhaltsverzeichnis ein. Dies stellt sicher, dass Claude den vollständigen Umfang der verfügbaren Informationen sieht, auch bei teilweisem Lesen.

**Beispiel**:
```markdown
# API-Referenz

## Inhaltsverzeichnis
- Authentifizierung und Setup
- Kernmethoden (erstellen, lesen, aktualisieren, löschen)
- Erweiterte Funktionen (Batch-Operationen, Webhooks)
- Fehlerbehandlungsmuster
- Codebeispiele

## Authentifizierung und Setup
...

## Kernmethoden
...
```

Claude kann dann die vollständige Datei lesen oder bei Bedarf zu bestimmten Abschnitten springen.

Weitere Details zur Funktionsweise dieser dateisystembasierten Architektur für Progressive Disclosure finden Sie im Abschnitt [Runtime-Umgebung](#runtime-environment) im Abschnitt Erweitert unten.

## Workflows und Feedback-Schleifen

### Verwenden Sie Workflows für komplexe Aufgaben

Unterteilen Sie komplexe Operationen in klare, sequenzielle Schritte. Für besonders komplexe Workflows stellen Sie eine Checkliste bereit, die Claude in seine Antwort kopieren und abhaken kann, während es fortschreitet.

**Beispiel 1: Forschungssynthese-Workflow** (für Skills ohne Code):

````markdown
## Forschungssynthese-Workflow

Kopieren Sie diese Checkliste und verfolgen Sie Ihren Fortschritt:

```
Forschungsfortschritt:
- [ ] Schritt 1: Alle Quelldokumente lesen
- [ ] Schritt 2: Schlüsselthemen identifizieren
- [ ] Schritt 3: Ansprüche kreuzen
- [ ] Schritt 4: Strukturierte Zusammenfassung erstellen
- [ ] Schritt 5: Zitate überprüfen
```

**Schritt 1: Alle Quelldokumente lesen**

Überprüfen Sie jedes Dokument im `sources/`-Verzeichnis. Notieren Sie die Hauptargumente und unterstützende Beweise.

**Schritt 2: Schlüsselthemen identifizieren**

Suchen Sie nach Mustern über Quellen hinweg. Welche Themen erscheinen wiederholt? Wo stimmen Quellen überein oder unterscheiden sich?

**Schritt 3: Ansprüche kreuzen**

Überprüfen Sie für jeden Hauptanspruch, dass er im Quellenmaterial erscheint. Notieren Sie, welche Quelle jeden Punkt unterstützt.

**Schritt 4: Strukturierte Zusammenfassung erstellen**

Organisieren Sie Erkenntnisse nach Thema. Fügen Sie ein:
- Hauptanspruch
- Unterstützende Beweise aus Quellen
- Widersprüchliche Standpunkte (falls vorhanden)

**Schritt 5: Zitate überprüfen**

Überprüfen Sie, dass jeder Anspruch auf das richtige Quelldokument verweist. Wenn Zitate unvollständig sind, kehren Sie zu Schritt 3 zurück.
````

Dieses Beispiel zeigt, wie Workflows auf Analyseaufgaben angewendet werden, die keinen Code erfordern. Das Checklisten-Muster funktioniert für jeden komplexen, mehrstufigen Prozess.

**Beispiel 2: PDF-Formularausfüll-Workflow** (für Skills mit Code):

````markdown
## PDF-Formularausfüll-Workflow

Kopieren Sie diese Checkliste und haken Sie Elemente ab, während Sie sie abschließen:

```
Aufgabenfortschritt:
- [ ] Schritt 1: Formular analysieren (analyze_form.py ausführen)
- [ ] Schritt 2: Feldmapping erstellen (fields.json bearbeiten)
- [ ] Schritt 3: Mapping validieren (validate_fields.py ausführen)
- [ ] Schritt 4: Formular ausfüllen (fill_form.py ausführen)
- [ ] Schritt 5: Ausgabe überprüfen (verify_output.py ausführen)
```

**Schritt 1: Formular analysieren**

Führen Sie aus: `python scripts/analyze_form.py input.pdf`

Dies extrahiert Formularfelder und ihre Positionen und speichert sie in `fields.json`.

**Schritt 2: Feldmapping erstellen**

Bearbeiten Sie `fields.json`, um Werte für jedes Feld hinzuzufügen.

**Schritt 3: Mapping validieren**

Führen Sie aus: `python scripts/validate_fields.py fields.json`

Beheben Sie alle Validierungsfehler, bevor Sie fortfahren.

**Schritt 4: Formular ausfüllen**

Führen Sie aus: `python scripts/fill_form.py input.pdf fields.json output.pdf`

**Schritt 5: Ausgabe überprüfen**

Führen Sie aus: `python scripts/verify_output.py output.pdf`

Wenn die Überprüfung fehlschlägt, kehren Sie zu Schritt 2 zurück.
````

Klare Schritte verhindern, dass Claude kritische Validierungen überspringt. Die Checkliste hilft sowohl Claude als auch Ihnen, den Fortschritt durch mehrstufige Workflows zu verfolgen.

### Implementieren Sie Feedback-Schleifen

**Häufiges Muster**: Validator ausführen → Fehler beheben → wiederholen

Dieses Muster verbessert die Ausgabequalität erheblich.

**Beispiel 1: Einhaltung des Stilhandbuchs** (für Skills ohne Code):

```markdown
## Inhaltsüberprüfungsprozess

1. Entwerfen Sie Ihren Inhalt nach den Richtlinien in STYLE_GUIDE.md
2. Überprüfen Sie anhand der Checkliste:
   - Überprüfen Sie die Konsistenz der Terminologie
   - Überprüfen Sie, dass Beispiele dem Standardformat folgen
   - Bestätigen Sie, dass alle erforderlichen Abschnitte vorhanden sind
3. Wenn Probleme gefunden werden:
   - Notieren Sie jedes Problem mit spezifischem Abschnittsverweis
   - Überarbeiten Sie den Inhalt
   - Überprüfen Sie die Checkliste erneut
4. Fahren Sie nur fort, wenn alle Anforderungen erfüllt sind
5. Finalisieren und speichern Sie das Dokument
```

Dies zeigt das Validierungsschleifen-Muster mit Referenzdokumenten anstelle von Skripten. Der „Validator" ist STYLE_GUIDE.md, und Claude führt die Überprüfung durch Lesen und Vergleichen durch.

**Beispiel 2: Dokumentenbearbeitungsprozess** (für Skills mit Code):

```markdown
## Dokumentenbearbeitungsprozess

1. Nehmen Sie Ihre Änderungen an `word/document.xml` vor
2. **Validieren Sie sofort**: `python ooxml/scripts/validate.py unpacked_dir/`
3. Wenn die Validierung fehlschlägt:
   - Überprüfen Sie die Fehlermeldung sorgfältig
   - Beheben Sie die Probleme im XML
   - Führen Sie die Validierung erneut aus
4. **Fahren Sie nur fort, wenn die Validierung erfolgreich ist**
5. Neuaufbau: `python ooxml/scripts/pack.py unpacked_dir/ output.docx`
6. Testen Sie das Ausgabedokument
```

Die Validierungsschleife erfasst Fehler früh.

## Inhaltsrichtlinien

### Vermeiden Sie zeitempfindliche Informationen

Fügen Sie keine Informationen ein, die veraltet werden:

**Schlechtes Beispiel: Zeitempfindlich** (wird falsch):
```markdown
Wenn Sie dies vor August 2025 tun, verwenden Sie die alte API.
Nach August 2025 verwenden Sie die neue API.
```

**Gutes Beispiel** (verwenden Sie den Abschnitt „alte Muster"):
```markdown
## Aktuelle Methode

Verwenden Sie den v2-API-Endpunkt: `api.example.com/v2/messages`

## Alte Muster

<details>
<summary>Legacy v1 API (veraltet 2025-08)</summary>

Die v1 API verwendete: `api.example.com/v1/messages`

Dieser Endpunkt wird nicht mehr unterstützt.
</details>
```

Der Abschnitt „alte Muster" bietet historischen Kontext, ohne den Hauptinhalt zu überladen.

### Verwenden Sie konsistente Terminologie

Wählen Sie einen Begriff und verwenden Sie ihn durchgehend im Skill:

**Gut - Konsistent**:
- Immer „API-Endpunkt"
- Immer „Feld"
- Immer „extrahieren"

**Schlecht - Inkonsistent**:
- Mischen Sie „API-Endpunkt", „URL", „API-Route", „Pfad"
- Mischen Sie „Feld", „Box", „Element", „Steuerelement"
- Mischen Sie „extrahieren", „ziehen", „abrufen", „abrufen"

Konsistenz hilft Claude, Anweisungen zu verstehen und zu befolgen.

## Häufige Muster

### Vorlagenmuster

Stellen Sie Vorlagen für das Ausgabeformat bereit. Passen Sie die Strenge an Ihre Anforderungen an.

**Für strenge Anforderungen** (wie API-Antworten oder Datenformate):

````markdown
## Berichtsstruktur

VERWENDEN Sie IMMER diese genaue Vorlagenstruktur:

```markdown
# [Analysetitel]

## Zusammenfassung
[Ein-Absatz-Übersicht der Schlüsselergebnisse]

## Schlüsselergebnisse
- Ergebnis 1 mit unterstützenden Daten
- Ergebnis 2 mit unterstützenden Daten
- Ergebnis 3 mit unterstützenden Daten

## Empfehlungen
1. Spezifische umsetzbare Empfehlung
2. Spezifische umsetzbare Empfehlung
```
````

**Für flexible Anleitung** (wenn Anpassung nützlich ist):

````markdown
## Berichtsstruktur

Hier ist ein sinnvolles Standardformat, aber verwenden Sie Ihr bestes Urteilsvermögen basierend auf der Analyse:

```markdown
# [Analysetitel]

## Zusammenfassung
[Übersicht]

## Schlüsselergebnisse
[Passen Sie Abschnitte basierend auf Ihren Erkenntnissen an]

## Empfehlungen
[Passen Sie an den spezifischen Kontext an]
```

Passen Sie Abschnitte nach Bedarf für den spezifischen Analystyp an.
````

### Beispielmuster

Für Skills, bei denen die Ausgabequalität davon abhängt, Beispiele zu sehen, stellen Sie Ein-/Ausgabe-Paare bereit, genau wie bei regulärem Prompting:

````markdown
## Commit-Nachrichtenformat

Generieren Sie Commit-Nachrichten nach diesen Beispielen:

**Beispiel 1:**
Eingabe: Benutzerauthentifizierung mit JWT-Token hinzugefügt
Ausgabe:
```
feat(auth): JWT-basierte Authentifizierung implementieren

Login-Endpunkt und Token-Validierungs-Middleware hinzufügen
```

**Beispiel 2:**
Eingabe: Fehler behoben, bei dem Daten in Berichten falsch angezeigt wurden
Ausgabe:
```
fix(reports): Datumsformatierung in Zeitzonen-Konvertierung korrigieren

Verwenden Sie durchgehend UTC-Zeitstempel bei der Berichtsgenerierung
```

**Beispiel 3:**
Eingabe: Abhängigkeiten aktualisiert und Fehlerbehandlung umgestaltet
Ausgabe:
```
chore: Abhängigkeiten aktualisieren und Fehlerbehandlung umgestalten

- Upgrade lodash auf 4.17.21
- Standardisieren Sie das Fehlerantwortformat über Endpunkte
```

Folgen Sie diesem Stil: type(scope): kurze Beschreibung, dann detaillierte Erklärung.
````

Beispiele helfen Claude, den gewünschten Stil und das Detaillierungsniveau klarer zu verstehen als nur Beschreibungen.

### Bedingtes Workflow-Muster

Führen Sie Claude durch Entscheidungspunkte:

```markdown
## Dokumentänderungsworkflow

1. Bestimmen Sie den Änderungstyp:

   **Neuen Inhalt erstellen?** → Folgen Sie dem Abschnitt „Erstellungs-Workflow" unten
   **Vorhandenen Inhalt bearbeiten?** → Folgen Sie dem Abschnitt „Bearbeitungs-Workflow" unten

2. Erstellungs-Workflow:
   - Verwenden Sie die docx-js-Bibliothek
   - Erstellen Sie das Dokument von Grund auf
   - Exportieren Sie in das .docx-Format

3. Bearbeitungs-Workflow:
   - Entpacken Sie das vorhandene Dokument
   - Ändern Sie das XML direkt
   - Validieren Sie nach jeder Änderung
   - Packen Sie erneut, wenn fertig
```

<Tip>
Wenn Workflows groß oder kompliziert werden mit vielen Schritten, erwägen Sie, sie in separate Dateien zu verschieben und teilen Sie Claude mit, die entsprechende Datei basierend auf der Aufgabe zu lesen.
</Tip>

## Bewertung und Iteration

### Erstellen Sie Bewertungen zuerst

**Erstellen Sie Bewertungen VOR dem Schreiben umfangreicher Dokumentation.** Dies stellt sicher, dass Ihr Skill echte Probleme löst, anstatt dokumentierte zu lösen.

**Bewertungsgesteuerte Entwicklung:**
1. **Lücken identifizieren**: Führen Sie Claude bei repräsentativen Aufgaben ohne Skill aus. Dokumentieren Sie spezifische Fehler oder fehlenden Kontext
2. **Bewertungen erstellen**: Erstellen Sie drei Szenarien, die diese Lücken testen
3. **Baseline etablieren**: Messen Sie Claudes Leistung ohne den Skill
4. **Minimale Anweisungen schreiben**: Erstellen Sie gerade genug Inhalt, um die Lücken zu schließen und Bewertungen zu bestehen
5. **Iterieren**: Führen Sie Bewertungen aus, vergleichen Sie mit der Baseline und verfeinern Sie

Dieser Ansatz stellt sicher, dass Sie echte Probleme lösen, anstatt Anforderungen zu antizipieren, die möglicherweise nie entstehen.

**Bewertungsstruktur**:
```json
{
  "skills": ["pdf-processing"],
  "query": "Extrahieren Sie den gesamten Text aus dieser PDF-Datei und speichern Sie ihn in output.txt",
  "files": ["test-files/document.pdf"],
  "expected_behavior": [
    "Liest die PDF-Datei erfolgreich mit einer geeigneten PDF-Verarbeitungsbibliothek oder einem Befehlszeilentool",
    "Extrahiert Textinhalte aus allen Seiten im Dokument ohne Seiten zu überspringen",
    "Speichert den extrahierten Text in einer Datei namens output.txt in einem klaren, lesbaren Format"
  ]
}
```

<Note>
Dieses Beispiel zeigt eine datengesteuerte Bewertung mit einer einfachen Test-Rubrik. Wir bieten derzeit keine integrierte Möglichkeit, diese Bewertungen auszuführen. Benutzer können ihr eigenes Bewertungssystem erstellen. Bewertungen sind Ihre Quelle der Wahrheit für die Messung der Skill-Effektivität.
</Note>

### Entwickeln Sie Skills iterativ mit Claude

Der effektivste Skill-Entwicklungsprozess beinhaltet Claude selbst. Arbeiten Sie mit einer Claude-Instanz („Claude A") zusammen, um einen Skill zu erstellen, der von anderen Instanzen („Claude B") verwendet wird. Claude A hilft Ihnen, Anweisungen zu entwerfen und zu verfeinern, während Claude B sie bei echten Aufgaben testet. Dies funktioniert, weil Claude-Modelle verstehen, wie man effektive Agent-Anweisungen schreibt und welche Informationen Agents benötigen.

**Erstellen eines neuen Skills:**

1. **Führen Sie eine Aufgabe ohne Skill aus**: Arbeiten Sie ein Problem mit Claude A mit normalem Prompting durch. Während Sie arbeiten, werden Sie natürlich Kontext bereitstellen, Vorlieben erklären und prozedurales Wissen teilen. Beachten Sie, welche Informationen Sie wiederholt bereitstellen.

2. **Identifizieren Sie das wiederverwendbare Muster**: Nach Abschluss der Aufgabe identifizieren Sie, welchen Kontext Sie bereitgestellt haben, der für ähnliche zukünftige Aufgaben nützlich wäre.

   **Beispiel**: Wenn Sie eine BigQuery-Analyse durchgearbeitet haben, könnten Sie Tabellennamen, Felddefinitionen, Filterregeln (wie „immer Test-Konten ausschließen") und häufige Abfragemuster bereitgestellt haben.

3. **Bitten Sie Claude A, einen Skill zu erstellen**: „Erstellen Sie einen Skill, der dieses BigQuery-Analysemuster erfasst, das wir gerade verwendet haben. Fügen Sie die Tabellenschemas, Benennungskonventionen und die Regel zum Filtern von Test-Konten ein."

   <Tip>
   Claude-Modelle verstehen das Skill-Format und die Struktur nativ. Sie benötigen keine speziellen System-Prompts oder einen „Writing Skills"-Skill, um Claude zum Erstellen von Skills zu bringen. Bitten Sie einfach Claude, einen Skill zu erstellen, und es wird ordnungsgemäß strukturierter SKILL.md-Inhalt mit angemessenem Frontmatter und Body-Inhalt generieren.
   </Tip>

4. **Überprüfen Sie auf Prägnanz**: Überprüfen Sie, dass Claude A keine unnötigen Erklärungen hinzugefügt hat. Fragen Sie: „Entfernen Sie die Erklärung darüber, was Win-Rate bedeutet – Claude weiß das bereits."

5. **Verbessern Sie die Informationsarchitektur**: Bitten Sie Claude A, den Inhalt effektiver zu organisieren. Zum Beispiel: „Organisieren Sie dies so, dass das Tabellenschema in einer separaten Referenzdatei ist. Wir könnten später mehr Tabellen hinzufügen."

6. **Testen Sie bei ähnlichen Aufgaben**: Verwenden Sie den Skill mit Claude B (eine frische Instanz mit geladenem Skill) bei verwandten Anwendungsfällen. Beobachten Sie, ob Claude B die richtige Information findet, Regeln korrekt anwendet und die Aufgabe erfolgreich handhabt.

7. **Iterieren Sie basierend auf Beobachtung**: Wenn Claude B kämpft oder etwas verpasst, kehren Sie zu Claude A mit Spezifika zurück: „Als Claude diesen Skill verwendete, vergaß es, nach Datum für Q4 zu filtern. Sollten wir einen Abschnitt über Datumfilterungsmuster hinzufügen?"

**Iterieren bei vorhandenen Skills:**

Das gleiche hierarchische Muster setzt sich fort, wenn Skills verbessert werden. Sie wechseln zwischen:
- **Arbeiten mit Claude A** (dem Experten, der hilft, den Skill zu verfeinern)
- **Testen mit Claude B** (dem Agent, der den Skill verwendet, um echte Arbeit zu leisten)
- **Beobachten des Verhaltens von Claude B** und Erkenntnisse zurück zu Claude A bringen

1. **Verwenden Sie den Skill in echten Workflows**: Geben Sie Claude B (mit geladenem Skill) echte Aufgaben, nicht Test-Szenarien

2. **Beobachten Sie das Verhalten von Claude B**: Notieren Sie, wo es kämpft, erfolgreich ist oder unerwartete Entscheidungen trifft

   **Beispielbeobachtung**: „Als ich Claude B um einen regionalen Verkaufsbericht bat, schrieb es die Abfrage, vergaß aber, Test-Konten zu filtern, obwohl der Skill diese Regel erwähnt."

3. **Kehren Sie zu Claude A für Verbesserungen zurück**: Teilen Sie die aktuelle SKILL.md und beschreiben Sie, was Sie beobachtet haben. Fragen Sie: „Ich bemerkte, dass Claude B vergaß, Test-Konten zu filtern, als ich um einen regionalen Bericht bat. Der Skill erwähnt Filterung, aber vielleicht ist es nicht prominent genug?"

4. **Überprüfen Sie Claudes A Vorschläge**: Claude A könnte vorschlagen, die Struktur zu reorganisieren, um Regeln prominenter zu machen, stärkere Sprache wie „MUSS filtern" anstelle von „immer filtern" zu verwenden, oder den Workflow-Abschnitt umzustrukturieren.

5. **Wenden Sie Änderungen an und testen Sie**: Aktualisieren Sie den Skill mit Claudes A Verfeinerungen und testen Sie dann erneut mit Claude B bei ähnlichen Anfragen

6. **Wiederholen Sie basierend auf Nutzung**: Fahren Sie mit diesem Beobachtungs-Verfeinerungs-Test-Zyklus fort, während Sie neue Szenarien begegnen. Jede Iteration verbessert den Skill basierend auf echtem Agent-Verhalten, nicht auf Annahmen.

**Sammeln Sie Team-Feedback:**

1. Teilen Sie Skills mit Teamkollegen und beobachten Sie ihre Nutzung
2. Fragen Sie: Wird der Skill wie erwartet aktiviert? Sind Anweisungen klar? Was fehlt?
3. Integrieren Sie Feedback, um blinde Flecken in Ihren eigenen Nutzungsmustern zu beheben

**Warum dieser Ansatz funktioniert**: Claude A versteht Agent-Anforderungen, Sie bieten Fachkompetenz, Claude B offenbart Lücken durch echte Nutzung, und iterative Verfeinerung verbessert Skills basierend auf beobachtetem Verhalten, nicht auf Annahmen.

### Beobachten Sie, wie Claude Skills navigiert

Während Sie Skills iterieren, achten Sie darauf, wie Claude sie in der Praxis tatsächlich nutzt. Achten Sie auf:

- **Unerwartete Explorationspfade**: Liest Claude Dateien in einer Reihenfolge, die Sie nicht erwartet haben? Dies könnte darauf hindeuten, dass Ihre Struktur nicht so intuitiv ist, wie Sie dachten
- **Verpasste Verbindungen**: Schlägt Claude fehl, Referenzen zu wichtigen Dateien zu folgen? Ihre Links könnten expliziter oder prominenter sein
- **Überabhängigkeit von bestimmten Abschnitten**: Wenn Claude wiederholt die gleiche Datei liest, sollten Sie erwägen, ob dieser Inhalt stattdessen in der Haupt-SKILL.md sein sollte
- **Ignorierter Inhalt**: Wenn Claude nie auf eine gebündelte Datei zugreift, könnte sie unnötig oder schlecht signalisiert in den Hauptanweisungen sein

Iterieren Sie basierend auf diesen Beobachtungen, nicht auf Annahmen. Der `name` und die `description` in den Metadaten Ihres Skills sind besonders kritisch. Claude verwendet diese, wenn er entscheidet, ob der Skill als Reaktion auf die aktuelle Aufgabe ausgelöst werden soll. Stellen Sie sicher, dass sie klar beschreiben, was der Skill tut und wann er verwendet werden sollte.

## Anti-Muster zu vermeiden

### Vermeiden Sie Windows-Pfade

Verwenden Sie immer Schrägstriche in Dateipfaden, auch unter Windows:

- ✓ **Gut**: `scripts/helper.py`, `reference/guide.md`
- ✗ **Vermeiden**: `scripts\helper.py`, `reference\guide.md`

Unix-Pfade funktionieren auf allen Plattformen, während Windows-Pfade auf Unix-Systemen Fehler verursachen.

### Vermeiden Sie zu viele Optionen

Präsentieren Sie nicht mehrere Ansätze, wenn nicht nötig:

````markdown
**Schlechtes Beispiel: Zu viele Wahlmöglichkeiten** (verwirrend):
„Sie können pypdf verwenden, oder pdfplumber, oder PyMuPDF, oder pdf2image, oder..."

**Gutes Beispiel: Geben Sie einen Standard an** (mit Fluchtweg):
„Verwenden Sie pdfplumber zur Textextraktion:
```python
import pdfplumber
```

Für gescannte PDFs, die OCR erfordern, verwenden Sie stattdessen pdf2image mit pytesseract."
````

## Erweitert: Skills mit ausführbarem Code

Die folgenden Abschnitte konzentrieren sich auf Skills, die ausführbare Skripte enthalten. Wenn Ihr Skill nur Markdown-Anweisungen verwendet, fahren Sie mit [Checkliste für effektive Skills](#checklist-for-effective-skills) fort.

### Lösen Sie, anstatt zu verschieben

Beim Schreiben von Skripten für Skills behandeln Sie Fehlerbedingungen, anstatt sie an Claude zu verschieben.

**Gutes Beispiel: Fehler explizit behandeln**:
```python
def process_file(path):
    """Verarbeiten Sie eine Datei und erstellen Sie sie, falls sie nicht existiert."""
    try:
        with open(path) as f:
            return f.read()
    except FileNotFoundError:
        # Erstellen Sie die Datei mit Standardinhalt, anstatt zu fehlschlagen
        print(f"Datei {path} nicht gefunden, erstelle Standard")
        with open(path, 'w') as f:
            f.write('')
        return ''
    except PermissionError:
        # Geben Sie eine Alternative an, anstatt zu fehlschlagen
        print(f"Kann nicht auf {path} zugreifen, verwende Standard")
        return ''
```

**Schlechtes Beispiel: Verschieben Sie an Claude**:
```python
def process_file(path):
    # Fehlschlag einfach und lassen Sie Claude es herausfinden
    return open(path).read()
```

Konfigurationsparameter sollten auch gerechtfertigt und dokumentiert werden, um „Voodoo-Konstanten" zu vermeiden (Outsterhouts Gesetz). Wenn Sie den richtigen Wert nicht kennen, wie wird Claude ihn bestimmen?

**Gutes Beispiel: Selbstdokumentierend**:
```python
# HTTP-Anfragen werden normalerweise innerhalb von 30 Sekunden abgeschlossen
# Längeres Timeout berücksichtigt langsame Verbindungen
REQUEST_TIMEOUT = 30

# Drei Versuche balancieren Zuverlässigkeit vs. Geschwindigkeit
# Die meisten intermittierenden Fehler werden beim zweiten Versuch behoben
MAX_RETRIES = 3
```

**Schlechtes Beispiel: Magische Zahlen**:
```python
TIMEOUT = 47  # Warum 47?
RETRIES = 5   # Warum 5?
```

### Stellen Sie Utility-Skripte bereit

Auch wenn Claude ein Skript schreiben könnte, vorgefertigte Skripte bieten Vorteile:

**Vorteile von Utility-Skripten**:
- Zuverlässiger als generierter Code
- Sparen Sie Token (kein Code muss in den Kontext aufgenommen werden)
- Sparen Sie Zeit (keine Code-Generierung erforderlich)
- Stellen Sie Konsistenz über Verwendungen hinweg sicher

![Bündelung ausführbarer Skripte neben Anweisungsdateien](/docs/images/agent-skills-executable-scripts.png)

Das obige Diagramm zeigt, wie ausführbare Skripte neben Anweisungsdateien funktionieren. Die Anweisungsdatei (forms.md) verweist auf das Skript, und Claude kann es ausführen, ohne seinen Inhalt in den Kontext zu laden.

**Wichtige Unterscheidung**: Machen Sie in Ihren Anweisungen klar, ob Claude:
- **Das Skript ausführen** (am häufigsten): „Führen Sie `analyze_form.py` aus, um Felder zu extrahieren"
- **Es als Referenz lesen** (für komplexe Logik): „Siehe `analyze_form.py` für den Feldextraktionsalgorithmus"

Für die meisten Utility-Skripte ist die Ausführung bevorzugt, da sie zuverlässiger und effizienter ist. Siehe den Abschnitt [Runtime-Umgebung](#runtime-environment) unten für Details zur Funktionsweise der Skriptausführung.

**Beispiel**:
````markdown
## Utility-Skripte

**analyze_form.py**: Extrahieren Sie alle Formularfelder aus PDF

```bash
python scripts/analyze_form.py input.pdf > fields.json
```

Ausgabeformat:
```json
{
  "field_name": {"type": "text", "x": 100, "y": 200},
  "signature": {"type": "sig", "x": 150, "y": 500}
}
```

**validate_boxes.py**: Überprüfen Sie auf überlappende Begrenzungsrahmen

```bash
python scripts/validate_boxes.py fields.json
# Gibt zurück: „OK" oder listet Konflikte auf
```

**fill_form.py**: Wenden Sie Feldwerte auf PDF an

```bash
python scripts/fill_form.py input.pdf fields.json output.pdf
```
````

### Verwenden Sie visuelle Analyse

Wenn Eingaben als Bilder gerendert werden können, lassen Sie Claude sie analysieren:

````markdown
## Formular-Layout-Analyse

1. Konvertieren Sie PDF in Bilder:
   ```bash
   python scripts/pdf_to_images.py form.pdf
   ```

2. Analysieren Sie jedes Seitenbild, um Formularfelder zu identifizieren
3. Claude kann Feldpositionen und -typen visuell sehen
````

<Note>
In diesem Beispiel müssten Sie das `pdf_to_images.py`-Skript schreiben.
</Note>

Claudes Vision-Fähigkeiten helfen beim Verständnis von Layouts und Strukturen.

### Erstellen Sie überprüfbare Zwischenergebnisse

Wenn Claude komplexe, offene Aufgaben ausführt, kann es Fehler machen. Das „Plan-Validierung-Ausführung"-Muster erfasst Fehler früh, indem Claude zuerst einen Plan in strukturiertem Format erstellt, dann diesen Plan mit einem Skript validiert, bevor er ihn ausführt.

**Beispiel**: Stellen Sie sich vor, Sie bitten Claude, 50 Formularfelder in einer PDF basierend auf einer Tabelle zu aktualisieren. Ohne Validierung könnte Claude auf nicht vorhandene Felder verweisen, widersprüchliche Werte erstellen, erforderliche Felder verpassen oder Updates falsch anwenden.

**Lösung**: Verwenden Sie das oben gezeigte Workflow-Muster (PDF-Formularausfüllung), aber fügen Sie eine Zwischendatei `changes.json` hinzu, die validiert wird, bevor Änderungen angewendet werden. Der Workflow wird zu: Analysieren → **Plandatei erstellen** → **Plan validieren** → Ausführen → Überprüfen.

**Warum dieses Muster funktioniert:**
- **Erfasst Fehler früh**: Validierung findet Probleme, bevor Änderungen angewendet werden
- **Maschinenverifizierbar**: Skripte bieten objektive Überprüfung
- **Reversible Planung**: Claude kann den Plan iterieren, ohne Originale zu berühren
- **Klares Debugging**: Fehlermeldungen zeigen auf spezifische Probleme

**Wann zu verwenden**: Batch-Operationen, destruktive Änderungen, komplexe Validierungsregeln, hochriskante Operationen.

**Implementierungstipp**: Machen Sie Validierungsskripte ausführlich mit spezifischen Fehlermeldungen wie „Feld ‚signature_date' nicht gefunden. Verfügbare Felder: customer_name, order_total, signature_date_signed", um Claude bei der Behebung von Problemen zu helfen.

### Paketabhängigkeiten

Skills laufen in der Code-Ausführungsumgebung mit plattformspezifischen Einschränkungen:

- **claude.ai**: Kann Pakete von npm und PyPI installieren und von GitHub-Repositories abrufen
- **Anthropic API**: Hat keinen Netzwerkzugriff und keine Runtime-Paketinstallation

Listen Sie erforderliche Pakete in Ihrem SKILL.md auf und überprüfen Sie, ob sie in der [Code-Ausführungs-Tool-Dokumentation](/docs/de/agents-and-tools/tool-use/code-execution-tool) verfügbar sind.

### Runtime-Umgebung

Skills laufen in einer Code-Ausführungsumgebung mit Dateisystemzugriff, Bash-Befehlen und Code-Ausführungsfähigkeiten. Für die konzeptionelle Erklärung dieser Architektur siehe [Die Skills-Architektur](/docs/de/agents-and-tools/agent-skills/overview#the-skills-architecture) in der Übersicht.

**Wie dies Ihre Erstellung beeinflusst:**

**Wie Claude auf Skills zugreift:**

1. **Metadaten vorab geladen**: Beim Start werden der Name und die Beschreibung aus dem YAML-Frontmatter aller Skills in die Systemaufforderung geladen
2. **Dateien bei Bedarf lesen**: Claude verwendet Bash-Read-Tools, um auf SKILL.md und andere Dateien aus dem Dateisystem zuzugreifen, wenn nötig
3. **Skripte effizient ausgeführt**: Utility-Skripte können über Bash ausgeführt werden, ohne ihren vollständigen Inhalt in den Kontext zu laden. Nur die Ausgabe des Skripts verbraucht Token
4. **Keine Kontextstrafe für große Dateien**: Referenzdateien, Daten oder Dokumentation verbrauchen keine Kontext-Token, bis sie tatsächlich gelesen werden

- **Dateipfade sind wichtig**: Claude navigiert Ihr Skill-Verzeichnis wie ein Dateisystem. Verwenden Sie Schrägstriche (`reference/guide.md`), nicht Backslashes
- **Benennen Sie Dateien aussagekräftig**: Verwenden Sie Namen, die Inhalte angeben: `form_validation_rules.md`, nicht `doc2.md`
- **Organisieren Sie für Entdeckung**: Strukturieren Sie Verzeichnisse nach Domäne oder Funktion
  - Gut: `reference/finance.md`, `reference/sales.md`
  - Schlecht: `docs/file1.md`, `docs/file2.md`
- **Bündeln Sie umfassende Ressourcen**: Fügen Sie vollständige API-Dokumente, umfangreiche Beispiele, große Datensätze ein; keine Kontextstrafe bis zum Zugriff
- **Bevorzugen Sie Skripte für deterministische Operationen**: Schreiben Sie `validate_form.py`, anstatt Claude zu bitten, Validierungscode zu generieren
- **Machen Sie die Ausführungsabsicht klar**:
  - „Führen Sie `analyze_form.py` aus, um Felder zu extrahieren" (ausführen)
  - „Siehe `analyze_form.py` für den Extraktionsalgorithmus" (als Referenz lesen)
- **Testen Sie Dateizugriffsmuster**: Überprüfen Sie, dass Claude Ihre Verzeichnisstruktur navigieren kann, indem Sie mit echten Anfragen testen

**Beispiel:**

```
bigquery-skill/
├── SKILL.md (Übersicht, verweist auf Referenzdateien)
└── reference/
    ├── finance.md (Umsatzmetriken)
    ├── sales.md (Pipeline-Daten)
    └── product.md (Nutzungsanalysen)
```

Wenn der Benutzer nach Umsatz fragt, liest Claude SKILL.md, sieht die Referenz zu `reference/finance.md` und ruft Bash auf, um nur diese Datei zu lesen. Die Dateien sales.md und product.md bleiben im Dateisystem und verbrauchen null Kontext-Token, bis sie benötigt werden. Dieses dateisystembasierte Modell ermöglicht Progressive Disclosure. Claude kann genau das navigieren und selektiv laden, das jede Aufgabe erfordert.

Vollständige Details zur technischen Architektur finden Sie unter [Wie Skills funktionieren](/docs/de/agents-and-tools/agent-skills/overview#how-skills-work) in der Skills-Übersicht.

### MCP-Tool-Referenzen

Wenn Ihr Skill MCP (Model Context Protocol) Tools verwendet, verwenden Sie immer vollständig qualifizierte Tool-Namen, um „Tool nicht gefunden"-Fehler zu vermeiden.

**Format**: `ServerName:tool_name`

**Beispiel**:
```markdown
Verwenden Sie das BigQuery:bigquery_schema Tool, um Tabellenschemas abzurufen.
Verwenden Sie das GitHub:create_issue Tool, um Probleme zu erstellen.
```

Wobei:
- `BigQuery` und `GitHub` MCP-Servernamen sind
- `bigquery_schema` und `create_issue` die Tool-Namen innerhalb dieser Server sind

Ohne das Server-Präfix kann Claude das Tool möglicherweise nicht finden, besonders wenn mehrere MCP-Server verfügbar sind.

### Nehmen Sie nicht an, dass Tools installiert sind

Nehmen Sie nicht an, dass Pakete verfügbar sind:

````markdown
**Schlechtes Beispiel: Nimmt Installation an**:
„Verwenden Sie die pdf-Bibliothek, um die Datei zu verarbeiten."

**Gutes Beispiel: Explizit über Abhängigkeiten**:
„Installieren Sie erforderliches Paket: `pip install pypdf`

Verwenden Sie es dann:
```python
from pypdf import PdfReader
reader = PdfReader("file.pdf")
```"
````

## Technische Hinweise

### YAML-Frontmatter-Anforderungen

Das SKILL.md-Frontmatter erfordert `name`- und `description`-Felder mit spezifischen Validierungsregeln:
- `name`: Maximal 64 Zeichen, nur Kleinbuchstaben/Zahlen/Bindestriche, keine XML-Tags, keine reservierten Wörter
- `description`: Maximal 1024 Zeichen, nicht leer, keine XML-Tags

Siehe die [Skills-Übersicht](/docs/de/agents-and-tools/agent-skills/overview#skill-structure) für vollständige Strukturdetails.

### Token-Budgets

Halten Sie den SKILL.md-Text unter 500 Zeilen für optimale Leistung. Wenn Ihr Inhalt diesen Wert überschreitet, teilen Sie ihn in separate Dateien auf, indem Sie die oben beschriebenen Progressive-Disclosure-Muster verwenden. Für Architekturdetails siehe die [Skills-Übersicht](/docs/de/agents-and-tools/agent-skills/overview#how-skills-work).

## Checkliste für effektive Skills

Überprüfen Sie vor dem Teilen eines Skills:

### Kernqualität
- [ ] Beschreibung ist spezifisch und enthält Schlüsselbegriffe
- [ ] Beschreibung enthält sowohl, was der Skill tut, als auch wann er verwendet wird
- [ ] SKILL.md-Text ist unter 500 Zeilen
- [ ] Zusätzliche Details sind in separaten Dateien (falls nötig)
- [ ] Keine zeitempfindlichen Informationen (oder im Abschnitt „alte Muster")
- [ ] Konsistente Terminologie durchgehend
- [ ] Beispiele sind konkret, nicht abstrakt
- [ ] Dateireferenzen sind eine Ebene tief
- [ ] Progressive Disclosure wird angemessen verwendet
- [ ] Workflows haben klare Schritte

### Code und Skripte
- [ ] Skripte lösen Probleme, anstatt an Claude zu verschieben
- [ ] Fehlerbehandlung ist explizit und hilfreich
- [ ] Keine „Voodoo-Konstanten" (alle Werte gerechtfertigt)
- [ ] Erforderliche Pakete in Anweisungen aufgelistet und als verfügbar überprüft
- [ ] Skripte haben klare Dokumentation
- [ ] Keine Windows-Pfade (alle Schrägstriche)
- [ ] Validierungs-/Überprüfungsschritte für kritische Operationen
- [ ] Feedback-Schleifen für qualitätskritische Aufgaben enthalten

### Testen
- [ ] Mindestens drei Bewertungen erstellt
- [ ] Mit Haiku, Sonnet und Opus getestet
- [ ] Mit echten Nutzungsszenarien getestet
- [ ] Team-Feedback integriert (falls zutreffend)

## Nächste Schritte

<CardGroup cols={2}>
  <Card
    title="Erste Schritte mit Agent Skills"
    icon="rocket"
    href="/docs/de/agents-and-tools/agent-skills/quickstart"
  >
    Erstellen Sie Ihren ersten Skill
  </Card>
  <Card
    title="Verwenden Sie Skills in Claude Code"
    icon="terminal"
    href="https://code.claude.com/docs/skills"
  >
    Erstellen und verwalten Sie Skills in Claude Code
  </Card>
  <Card
    title="Verwenden Sie Skills im Agent SDK"
    icon="cube"
    href="/docs/de/agent-sdk/skills"
  >
    Verwenden Sie Skills programmgesteuert in TypeScript und Python
  </Card>
  <Card
    title="Verwenden Sie Skills mit der API"
    icon="code"
    href="/docs/de/build-with-claude/skills-guide"
  >
    Laden Sie Skills programmgesteuert hoch und verwenden Sie sie
  </Card>
</CardGroup>