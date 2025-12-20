# Erste Schritte mit Agent Skills in der API

Erfahren Sie, wie Sie Agent Skills verwenden, um in weniger als 10 Minuten Dokumente mit der Claude API zu erstellen.

---

Dieses Tutorial zeigt Ihnen, wie Sie Agent Skills verwenden, um eine PowerPoint-Präsentation zu erstellen. Sie erfahren, wie Sie Skills aktivieren, eine einfache Anfrage stellen und auf die generierte Datei zugreifen.

## Voraussetzungen

- [Anthropic API-Schlüssel](/settings/keys)
- Python 3.7+ oder curl installiert
- Grundlegende Vertrautheit mit API-Anfragen

## Was sind Agent Skills?

Vorgefertigte Agent Skills erweitern Claudes Fähigkeiten um spezialisierte Expertise für Aufgaben wie das Erstellen von Dokumenten, das Analysieren von Daten und die Verarbeitung von Dateien. Anthropic stellt die folgenden vorgefertigten Agent Skills in der API zur Verfügung:

- **PowerPoint (pptx)**: Erstellen und Bearbeiten von Präsentationen
- **Excel (xlsx)**: Erstellen und Analysieren von Tabellenkalkulationen
- **Word (docx)**: Erstellen und Bearbeiten von Dokumenten
- **PDF (pdf)**: Generieren von PDF-Dokumenten

<Note>
**Möchten Sie benutzerdefinierte Skills erstellen?** Siehe das [Agent Skills Cookbook](https://github.com/anthropics/claude-cookbooks/tree/main/skills) für Beispiele zum Erstellen Ihrer eigenen Skills mit domänenspezifischer Expertise.
</Note>

## Schritt 1: Verfügbare Skills auflisten

Zunächst schauen wir uns an, welche Skills verfügbar sind. Wir verwenden die Skills API, um alle von Anthropic verwalteten Skills aufzulisten:

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# Von Anthropic verwaltete Skills auflisten
skills = client.beta.skills.list(
    source="anthropic",
    betas=["skills-2025-10-02"]
)

for skill in skills.data:
    print(f"{skill.id}: {skill.display_title}")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

// Von Anthropic verwaltete Skills auflisten
const skills = await client.beta.skills.list({
  source: 'anthropic',
  betas: ['skills-2025-10-02']
});

for (const skill of skills.data) {
  console.log(`${skill.id}: ${skill.display_title}`);
}
```

```bash Shell
curl "https://api.anthropic.com/v1/skills?source=anthropic" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: skills-2025-10-02"
```
</CodeGroup>

Sie sehen die folgenden Skills: `pptx`, `xlsx`, `docx` und `pdf`.

Diese API gibt die Metadaten jedes Skills zurück: seinen Namen und seine Beschreibung. Claude lädt diese Metadaten beim Start, um zu wissen, welche Skills verfügbar sind. Dies ist die erste Ebene der **progressiven Offenlegung**, bei der Claude Skills entdeckt, ohne ihre vollständigen Anweisungen noch zu laden.

## Schritt 2: Eine Präsentation erstellen

Jetzt verwenden wir den PowerPoint Skill, um eine Präsentation über erneuerbare Energien zu erstellen. Wir geben Skills mit dem Parameter `container` in der Messages API an:

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# Erstelle eine Nachricht mit dem PowerPoint Skill
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    betas=["code-execution-2025-08-25", "skills-2025-10-02"],
    container={
        "skills": [
            {
                "type": "anthropic",
                "skill_id": "pptx",
                "version": "latest"
            }
        ]
    },
    messages=[{
        "role": "user",
        "content": "Create a presentation about renewable energy with 5 slides"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)

print(response.content)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

// Erstelle eine Nachricht mit dem PowerPoint Skill
const response = await client.beta.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 4096,
  betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
  container: {
    skills: [
      {
        type: 'anthropic',
        skill_id: 'pptx',
        version: 'latest'
      }
    ]
  },
  messages: [{
    role: 'user',
    content: 'Create a presentation about renewable energy with 5 slides'
  }],
  tools: [{
    type: 'code_execution_20250825',
    name: 'code_execution'
  }]
});

console.log(response.content);
```

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5-20250929",
    "max_tokens": 4096,
    "container": {
      "skills": [
        {
          "type": "anthropic",
          "skill_id": "pptx",
          "version": "latest"
        }
      ]
    },
    "messages": [{
      "role": "user",
      "content": "Create a presentation about renewable energy with 5 slides"
    }],
    "tools": [{
      "type": "code_execution_20250825",
      "name": "code_execution"
    }]
  }'
```
</CodeGroup>

Lassen Sie uns aufschlüsseln, was jeder Teil tut:

- **`container.skills`**: Gibt an, welche Skills Claude verwenden kann
- **`type: "anthropic"`**: Zeigt an, dass dies ein von Anthropic verwalteter Skill ist
- **`skill_id: "pptx"`**: Der PowerPoint Skill-Bezeichner
- **`version: "latest"`**: Die Skill-Version auf die zuletzt veröffentlichte Version gesetzt
- **`tools`**: Aktiviert die Code-Ausführung (erforderlich für Skills)
- **Beta-Header**: `code-execution-2025-08-25` und `skills-2025-10-02`

Wenn Sie diese Anfrage stellen, ordnet Claude Ihre Aufgabe automatisch dem relevanten Skill zu. Da Sie um eine Präsentation gebeten haben, stellt Claude fest, dass der PowerPoint Skill relevant ist, und lädt seine vollständigen Anweisungen: die zweite Ebene der progressiven Offenlegung. Dann führt Claude den Code des Skills aus, um Ihre Präsentation zu erstellen.

## Schritt 3: Die erstellte Datei herunterladen

Die Präsentation wurde im Code-Ausführungs-Container erstellt und als Datei gespeichert. Die Antwort enthält eine Dateireferenz mit einer Datei-ID. Extrahieren Sie die Datei-ID und laden Sie sie mit der Files API herunter:

<CodeGroup>
```python Python
# Extrahiere die Datei-ID aus der Antwort
file_id = None
for block in response.content:
    if block.type == 'tool_use' and block.name == 'code_execution':
        # Die Datei-ID befindet sich im Tool-Ergebnis
        for result_block in block.content:
            if hasattr(result_block, 'file_id'):
                file_id = result_block.file_id
                break

if file_id:
    # Lade die Datei herunter
    file_content = client.beta.files.download(
        file_id=file_id,
        betas=["files-api-2025-04-14"]
    )

    # Speichere auf der Festplatte
    with open("renewable_energy.pptx", "wb") as f:
        file_content.write_to_file(f.name)

    print(f"Presentation saved to renewable_energy.pptx")
```

```typescript TypeScript
// Extrahiere die Datei-ID aus der Antwort
let fileId: string | null = null;
for (const block of response.content) {
  if (block.type === 'tool_use' && block.name === 'code_execution') {
    // Die Datei-ID befindet sich im Tool-Ergebnis
    for (const resultBlock of block.content) {
      if ('file_id' in resultBlock) {
        fileId = resultBlock.file_id;
        break;
      }
    }
  }
}

if (fileId) {
  // Lade die Datei herunter
  const fileContent = await client.beta.files.download(fileId, {
    betas: ['files-api-2025-04-14']
  });

  // Speichere auf der Festplatte
  const fs = require('fs');
  fs.writeFileSync('renewable_energy.pptx', Buffer.from(await fileContent.arrayBuffer()));

  console.log('Presentation saved to renewable_energy.pptx');
}
```

```bash Shell
# Extrahiere file_id aus der Antwort (mit jq)
FILE_ID=$(echo "$RESPONSE" | jq -r '.content[] | select(.type=="tool_use" and .name=="code_execution") | .content[] | select(.file_id) | .file_id')

# Lade die Datei herunter
curl "https://api.anthropic.com/v1/files/$FILE_ID/content" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  --output renewable_energy.pptx

echo "Presentation saved to renewable_energy.pptx"
```
</CodeGroup>

<Note>
Für vollständige Details zur Arbeit mit generierten Dateien siehe die [Dokumentation des Code-Ausführungs-Tools](/docs/de/agents-and-tools/tool-use/code-execution-tool#retrieve-generated-files).
</Note>

## Probieren Sie weitere Beispiele aus

Jetzt, da Sie Ihr erstes Dokument mit Skills erstellt haben, versuchen Sie diese Variationen:

### Erstelle eine Tabellenkalkulation

<CodeGroup>
```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    betas=["code-execution-2025-08-25", "skills-2025-10-02"],
    container={
        "skills": [
            {
                "type": "anthropic",
                "skill_id": "xlsx",
                "version": "latest"
            }
        ]
    },
    messages=[{
        "role": "user",
        "content": "Create a quarterly sales tracking spreadsheet with sample data"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)
```

```typescript TypeScript
const response = await client.beta.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 4096,
  betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
  container: {
    skills: [
      {
        type: 'anthropic',
        skill_id: 'xlsx',
        version: 'latest'
      }
    ]
  },
  messages: [{
    role: 'user',
    content: 'Create a quarterly sales tracking spreadsheet with sample data'
  }],
  tools: [{
    type: 'code_execution_20250825',
    name: 'code_execution'
  }]
});
```

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5-20250929",
    "max_tokens": 4096,
    "container": {
      "skills": [
        {
          "type": "anthropic",
          "skill_id": "xlsx",
          "version": "latest"
        }
      ]
    },
    "messages": [{
      "role": "user",
      "content": "Create a quarterly sales tracking spreadsheet with sample data"
    }],
    "tools": [{
      "type": "code_execution_20250825",
      "name": "code_execution"
    }]
  }'
```
</CodeGroup>

### Erstelle ein Word-Dokument

<CodeGroup>
```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    betas=["code-execution-2025-08-25", "skills-2025-10-02"],
    container={
        "skills": [
            {
                "type": "anthropic",
                "skill_id": "docx",
                "version": "latest"
            }
        ]
    },
    messages=[{
        "role": "user",
        "content": "Write a 2-page report on the benefits of renewable energy"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)
```

```typescript TypeScript
const response = await client.beta.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 4096,
  betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
  container: {
    skills: [
      {
        type: 'anthropic',
        skill_id: 'docx',
        version: 'latest'
      }
    ]
  },
  messages: [{
    role: 'user',
    content: 'Write a 2-page report on the benefits of renewable energy'
  }],
  tools: [{
    type: 'code_execution_20250825',
    name: 'code_execution'
  }]
});
```

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5-20250929",
    "max_tokens": 4096,
    "container": {
      "skills": [
        {
          "type": "anthropic",
          "skill_id": "docx",
          "version": "latest"
        }
      ]
    },
    "messages": [{
      "role": "user",
      "content": "Write a 2-page report on the benefits of renewable energy"
    }],
    "tools": [{
      "type": "code_execution_20250825",
      "name": "code_execution"
    }]
  }'
```
</CodeGroup>

### Generiere ein PDF

<CodeGroup>
```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    betas=["code-execution-2025-08-25", "skills-2025-10-02"],
    container={
        "skills": [
            {
                "type": "anthropic",
                "skill_id": "pdf",
                "version": "latest"
            }
        ]
    },
    messages=[{
        "role": "user",
        "content": "Generate a PDF invoice template"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)
```

```typescript TypeScript
const response = await client.beta.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 4096,
  betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
  container: {
    skills: [
      {
        type: 'anthropic',
        skill_id: 'pdf',
        version: 'latest'
      }
    ]
  },
  messages: [{
    role: 'user',
    content: 'Generate a PDF invoice template'
  }],
  tools: [{
    type: 'code_execution_20250825',
    name: 'code_execution'
  }]
});
```

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5-20250929",
    "max_tokens": 4096,
    "container": {
      "skills": [
        {
          "type": "anthropic",
          "skill_id": "pdf",
          "version": "latest"
        }
      ]
    },
    "messages": [{
      "role": "user",
      "content": "Generate a PDF invoice template"
    }],
    "tools": [{
      "type": "code_execution_20250825",
      "name": "code_execution"
    }]
  }'
```
</CodeGroup>

## Nächste Schritte

Jetzt, da Sie vorgefertigte Agent Skills verwendet haben, können Sie:

<CardGroup cols={2}>
  <Card
    title="API-Leitfaden"
    icon="book"
    href="/docs/de/build-with-claude/skills-guide"
  >
    Verwenden Sie Skills mit der Claude API
  </Card>
  <Card
    title="Benutzerdefinierte Skills erstellen"
    icon="code"
    href="/docs/de/api/skills/create-skill"
  >
    Laden Sie Ihre eigenen Skills für spezialisierte Aufgaben hoch
  </Card>
  <Card
    title="Authoring-Leitfaden"
    icon="edit"
    href="/docs/de/agents-and-tools/agent-skills/best-practices"
  >
    Erfahren Sie Best Practices zum Schreiben effektiver Skills
  </Card>
  <Card
    title="Verwenden Sie Skills in Claude Code"
    icon="terminal"
    href="https://code.claude.com/docs/skills"
  >
    Erfahren Sie mehr über Skills in Claude Code
  </Card>
  <Card
    title="Verwenden Sie Skills im Agent SDK"
    icon="cube"
    href="/docs/de/agent-sdk/skills"
  >
    Verwenden Sie Skills programmgesteuert in TypeScript und Python
  </Card>
  <Card
    title="Agent Skills Cookbook"
    icon="book"
    href="https://github.com/anthropics/anthropic-cookbook/blob/main/skills/README.md"
  >
    Erkunden Sie Beispiel-Skills und Implementierungsmuster
  </Card>
</CardGroup>