# Claude Code Analytics API

Programmatischer Zugriff auf die Claude Code-Nutzungsanalysen und Produktivitätsmetriken Ihrer Organisation mit der Claude Code Analytics Admin API.

---

<Tip>
**The Admin API is unavailable for individual accounts.** To collaborate with teammates and add members, set up your organization in **Console → Settings → Organization**.
</Tip>

Die Claude Code Analytics Admin API bietet programmatischen Zugriff auf täglich aggregierte Nutzungsmetriken für Claude Code-Benutzer und ermöglicht es Organisationen, die Entwicklerproduktivität zu analysieren und benutzerdefinierte Dashboards zu erstellen. Diese API überbrückt die Lücke zwischen unserem grundlegenden [Analytics-Dashboard](/claude-code) und der komplexen OpenTelemetry-Integration.

Diese API ermöglicht es Ihnen, Ihre Claude Code-Einführung besser zu überwachen, zu analysieren und zu optimieren:

* **Analyse der Entwicklerproduktivität:** Verfolgen Sie Sitzungen, hinzugefügte/entfernte Codezeilen, Commits und Pull Requests, die mit Claude Code erstellt wurden
* **Tool-Nutzungsmetriken:** Überwachen Sie Akzeptanz- und Ablehnungsquoten für verschiedene Claude Code-Tools (Edit, Write, NotebookEdit)
* **Kostenanalyse:** Zeigen Sie geschätzte Kosten und Token-Nutzung aufgeschlüsselt nach Claude-Modell an
* **Benutzerdefinierte Berichte:** Exportieren Sie Daten, um Executive Dashboards und Berichte für Managementteams zu erstellen
* **Nutzungsbegründung:** Stellen Sie Metriken bereit, um die Claude Code-Einführung intern zu rechtfertigen und zu erweitern

<Check>
  **Admin API-Schlüssel erforderlich**
  
  Diese API ist Teil der [Admin API](/docs/de/build-with-claude/administration-api). Diese Endpunkte erfordern einen Admin API-Schlüssel (beginnend mit `sk-ant-admin...`), der sich von Standard-API-Schlüsseln unterscheidet. Nur Organisationsmitglieder mit der Admin-Rolle können Admin API-Schlüssel über die [Claude Console](/settings/admin-keys) bereitstellen.
</Check>

## Schnellstart

Rufen Sie die Claude Code-Analysen Ihrer Organisation für einen bestimmten Tag ab:

```bash
curl "https://api.anthropic.com/v1/organizations/usage_report/claude_code?\
starting_at=2025-09-08&\
limit=20" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

<Tip>
  **Setzen Sie einen User-Agent-Header für Integrationen**
  
  Wenn Sie eine Integration erstellen, setzen Sie Ihren User-Agent-Header, um uns zu helfen, Nutzungsmuster zu verstehen:
  ```
  User-Agent: YourApp/1.0.0 (https://yourapp.com)
  ```
</Tip>

## Claude Code Analytics API

Verfolgen Sie die Claude Code-Nutzung, Produktivitätsmetriken und Entwickleraktivitäten in Ihrer Organisation mit dem Endpunkt `/v1/organizations/usage_report/claude_code`.

### Wichtige Konzepte

- **Tägliche Aggregation**: Gibt Metriken für einen einzelnen Tag zurück, der durch den Parameter `starting_at` angegeben wird
- **Benutzerdaten**: Jeder Datensatz stellt die Aktivität eines Benutzers für den angegebenen Tag dar
- **Produktivitätsmetriken**: Verfolgen Sie Sitzungen, Codezeilen, Commits, Pull Requests und Tool-Nutzung
- **Token- und Kostendaten**: Überwachen Sie die Nutzung und geschätzten Kosten aufgeschlüsselt nach Claude-Modell
- **Cursor-basierte Paginierung**: Verwalten Sie große Datensätze mit stabiler Paginierung mithilfe undurchsichtiger Cursor
- **Datenfrieschheit**: Metriken sind mit bis zu 1 Stunde Verzögerung für Konsistenz verfügbar

Für vollständige Parameterdetails und Response-Schemas siehe die [Claude Code Analytics API-Referenz](/docs/de/api/admin-api/claude-code/get-claude-code-usage-report).

### Grundlegende Beispiele

#### Rufen Sie Analysen für einen bestimmten Tag ab

```bash
curl "https://api.anthropic.com/v1/organizations/usage_report/claude_code?\
starting_at=2025-09-08" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

#### Rufen Sie Analysen mit Paginierung ab

```bash
# Erste Anfrage
curl "https://api.anthropic.com/v1/organizations/usage_report/claude_code?\
starting_at=2025-09-08&\
limit=20" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"

# Nachfolgende Anfrage mit Cursor aus der Antwort
curl "https://api.anthropic.com/v1/organizations/usage_report/claude_code?\
starting_at=2025-09-08&\
page=page_MjAyNS0wNS0xNFQwMDowMDowMFo=" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

### Anfrageparameter

| Parameter | Typ | Erforderlich | Beschreibung |
|-----------|------|----------|-------------|
| `starting_at` | string | Ja | UTC-Datum im Format YYYY-MM-DD. Gibt Metriken nur für diesen einzelnen Tag zurück |
| `limit` | integer | Nein | Anzahl der Datensätze pro Seite (Standard: 20, Max: 1000) |
| `page` | string | Nein | Undurchsichtiges Cursor-Token aus dem Feld `next_page` der vorherigen Antwort |

### Verfügbare Metriken

Jeder Response-Datensatz enthält die folgenden Metriken für einen einzelnen Benutzer an einem einzelnen Tag:

#### Dimensionen
- **date**: Datum im RFC 3339-Format (UTC-Zeitstempel)
- **actor**: Der Benutzer oder API-Schlüssel, der die Claude Code-Aktionen durchgeführt hat (entweder `user_actor` mit `email_address` oder `api_actor` mit `api_key_name`)
- **organization_id**: Organisations-UUID
- **customer_type**: Typ des Kundenkontos (`api` für API-Kunden, `subscription` für Pro/Team-Kunden)
- **terminal_type**: Typ des Terminals oder der Umgebung, in der Claude Code verwendet wurde (z. B. `vscode`, `iTerm.app`, `tmux`)

#### Kernmetriken
- **num_sessions**: Anzahl der unterschiedlichen Claude Code-Sitzungen, die von diesem Actor initiiert wurden
- **lines_of_code.added**: Gesamtzahl der Codezeilen, die von Claude Code über alle Dateien hinweg hinzugefügt wurden
- **lines_of_code.removed**: Gesamtzahl der Codezeilen, die von Claude Code über alle Dateien hinweg entfernt wurden
- **commits_by_claude_code**: Anzahl der Git-Commits, die über die Commit-Funktionalität von Claude Code erstellt wurden
- **pull_requests_by_claude_code**: Anzahl der Pull Requests, die über die PR-Funktionalität von Claude Code erstellt wurden

#### Tool-Aktionsmetriken
Aufschlüsselung der Akzeptanz- und Ablehnungsquoten für Tool-Aktionen nach Tool-Typ:
- **edit_tool.accepted/rejected**: Anzahl der Edit-Tool-Vorschläge, die der Benutzer akzeptiert/abgelehnt hat
- **write_tool.accepted/rejected**: Anzahl der Write-Tool-Vorschläge, die der Benutzer akzeptiert/abgelehnt hat
- **notebook_edit_tool.accepted/rejected**: Anzahl der NotebookEdit-Tool-Vorschläge, die der Benutzer akzeptiert/abgelehnt hat

#### Modellaufschlüsselung
Für jedes verwendete Claude-Modell:
- **model**: Claude-Modellkennung (z. B. `claude-sonnet-4-5-20250929`)
- **tokens.input/output**: Input- und Output-Token-Zählungen für dieses Modell
- **tokens.cache_read/cache_creation**: Cache-bezogene Token-Nutzung für dieses Modell
- **estimated_cost.amount**: Geschätzte Kosten in Cent USD für dieses Modell
- **estimated_cost.currency**: Währungscode für den Kostenbetrag (derzeit immer `USD`)

### Response-Struktur

Die API gibt Daten im folgenden Format zurück:

```json
{
  "data": [
    {
      "date": "2025-09-01T00:00:00Z",
      "actor": {
        "type": "user_actor",
        "email_address": "developer@company.com"
      },
      "organization_id": "dc9f6c26-b22c-4831-8d01-0446bada88f1",
      "customer_type": "api",
      "terminal_type": "vscode",
      "core_metrics": {
        "num_sessions": 5,
        "lines_of_code": {
          "added": 1543,
          "removed": 892
        },
        "commits_by_claude_code": 12,
        "pull_requests_by_claude_code": 2
      },
      "tool_actions": {
        "edit_tool": {
          "accepted": 45,
          "rejected": 5
        },
        "multi_edit_tool": {
          "accepted": 12,
          "rejected": 2
        },
        "write_tool": {
          "accepted": 8,
          "rejected": 1
        },
        "notebook_edit_tool": {
          "accepted": 3,
          "rejected": 0
        }
      },
      "model_breakdown": [
        {
          "model": "claude-sonnet-4-5-20250929",
          "tokens": {
            "input": 100000,
            "output": 35000,
            "cache_read": 10000,
            "cache_creation": 5000
          },
          "estimated_cost": {
            "currency": "USD",
            "amount": 1025
          }
        }
      ]
    }
  ],
  "has_more": false,
  "next_page": null
}
```

## Paginierung

Die API unterstützt cursor-basierte Paginierung für Organisationen mit großen Benutzeranzahlen:

1. Stellen Sie Ihre erste Anfrage mit optionalem Parameter `limit`
2. Wenn `has_more` in der Antwort `true` ist, verwenden Sie den Wert `next_page` in Ihrer nächsten Anfrage
3. Fahren Sie fort, bis `has_more` `false` ist

Der Cursor kodiert die Position des letzten Datensatzes und gewährleistet stabile Paginierung, auch wenn neue Daten eintreffen. Jede Paginierungssitzung behält eine konsistente Datengrenze bei, um sicherzustellen, dass Sie keine Datensätze verpassen oder duplizieren.

## Häufige Anwendungsfälle

- **Executive Dashboards**: Erstellen Sie hochrangige Berichte, die die Auswirkungen von Claude Code auf die Entwicklungsgeschwindigkeit zeigen
- **Vergleich von KI-Tools**: Exportieren Sie Metriken, um Claude Code mit anderen KI-Codierungstools wie Copilot und Cursor zu vergleichen
- **Analyse der Entwicklerproduktivität**: Verfolgen Sie die Produktivitätsmetriken einzelner Entwickler und Teams im Laufe der Zeit
- **Kostenverfolgung und -zuweisung**: Überwachen Sie Ausgabenmuster und weisen Sie Kosten nach Team oder Projekt zu
- **Überwachung der Einführung**: Identifizieren Sie, welche Teams und Benutzer den größten Nutzen aus Claude Code ziehen
- **ROI-Begründung**: Stellen Sie konkrete Metriken bereit, um die Claude Code-Einführung intern zu rechtfertigen und zu erweitern

## Häufig gestellte Fragen

### Wie aktuell sind die Analysedaten?
Claude Code-Analysedaten erscheinen normalerweise innerhalb von 1 Stunde nach Abschluss der Benutzeraktivität. Um konsistente Paginierungsergebnisse zu gewährleisten, sind nur Daten älter als 1 Stunde in den Antworten enthalten.

### Kann ich Echtzeit-Metriken abrufen?
Nein, diese API bietet nur täglich aggregierte Metriken. Für Echtzeit-Überwachung sollten Sie die [OpenTelemetry-Integration](https://code.claude.com/docs/en/monitoring-usage) in Betracht ziehen.

### Wie werden Benutzer in den Daten identifiziert?
Benutzer werden durch das Feld `actor` auf zwei Arten identifiziert:
- **`user_actor`**: Enthält `email_address` für Benutzer, die sich über OAuth authentifizieren (am häufigsten)
- **`api_actor`**: Enthält `api_key_name` für Benutzer, die sich über API-Schlüssel authentifizieren

Das Feld `customer_type` gibt an, ob die Nutzung von `api`-Kunden (API PAYG) oder `subscription`-Kunden (Pro/Team-Pläne) stammt.

### Wie lange werden Daten aufbewahrt?
Historische Claude Code-Analysedaten werden aufbewahrt und sind über die API zugänglich. Es gibt keinen festgelegten Löschzeitraum für diese Daten.

### Welche Claude Code-Bereitstellungen werden unterstützt?
Diese API verfolgt nur die Claude Code-Nutzung auf der Claude API (1st Party). Die Nutzung auf Amazon Bedrock, Google Vertex AI oder anderen Drittanbieter-Plattformen ist nicht enthalten.

### Was kostet die Nutzung dieser API?
Die Claude Code Analytics API ist kostenlos für alle Organisationen mit Zugriff auf die Admin API.

### Wie berechne ich Tool-Akzeptanzquoten?
Tool-Akzeptanzquote = `accepted / (accepted + rejected)` für jeden Tool-Typ. Wenn das Edit-Tool beispielsweise 45 akzeptiert und 5 abgelehnt zeigt, beträgt die Akzeptanzquote 90%.

### Welche Zeitzone wird für den date-Parameter verwendet?
Alle Daten sind in UTC. Der Parameter `starting_at` sollte im Format YYYY-MM-DD vorliegen und stellt UTC-Mitternacht für diesen Tag dar.

## Siehe auch

Die Claude Code Analytics API hilft Ihnen, den Entwicklungs-Workflow Ihres Teams zu verstehen und zu optimieren. Erfahren Sie mehr über verwandte Funktionen:

- [Admin API-Übersicht](/docs/de/build-with-claude/administration-api)
- [Admin API-Referenz](/docs/de/api/admin)
- [Claude Code Analytics Dashboard](/claude-code)
- [Usage and Cost API](/docs/de/build-with-claude/usage-cost-api) - Verfolgen Sie die API-Nutzung über alle Anthropic-Dienste
- [Identity and Access Management](https://code.claude.com/docs/en/iam)
- [Überwachung der Nutzung mit OpenTelemetry](https://code.claude.com/docs/en/monitoring-usage) für benutzerdefinierte Metriken und Warnungen