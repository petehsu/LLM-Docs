# Usage and Cost API

Programmatischer Zugriff auf die API-Nutzungs- und Kostendaten Ihrer Organisation mit der Usage & Cost Admin API.

---

<Tip>
**The Admin API is unavailable for individual accounts.** To collaborate with teammates and add members, set up your organization in **Console → Settings → Organization**.
</Tip>

Die Usage & Cost Admin API bietet programmatischen und granularen Zugriff auf historische API-Nutzungs- und Kostendaten für Ihre Organisation. Diese Daten ähneln den Informationen, die auf den Seiten [Usage](/usage) und [Cost](/cost) der Claude Console verfügbar sind.

Diese API ermöglicht es Ihnen, Ihre Claude-Implementierungen besser zu überwachen, zu analysieren und zu optimieren:

* **Genaue Nutzungsverfolgung:** Erhalten Sie präzise Token-Zählungen und Nutzungsmuster, anstatt sich nur auf die Zählung von Antwort-Tokens zu verlassen
* **Kostenabstimmung:** Gleichen Sie interne Aufzeichnungen mit der Anthropic-Abrechnung für Finanz- und Buchhaltungsteams ab
* **Produktleistung und Verbesserung:** Überwachen Sie die Produktleistung und messen Sie, ob Änderungen am System diese verbessert haben, oder richten Sie Benachrichtigungen ein
* **[Rate Limit](/docs/de/api/rate-limits) und [Priority Tier](/docs/de/api/service-tiers#get-started-with-priority-tier) Optimierung:** Optimieren Sie Funktionen wie [Prompt Caching](/docs/de/build-with-claude/prompt-caching) oder spezifische Prompts, um das Beste aus Ihrer zugewiesenen Kapazität herauszuholen, oder kaufen Sie dedizierte Kapazität.
* **Erweiterte Analyse:** Führen Sie tiefere Datenanalysen durch als in der Console verfügbar

<Check>
  **Admin API-Schlüssel erforderlich**
  
  Diese API ist Teil der [Admin API](/docs/de/build-with-claude/administration-api). Diese Endpunkte erfordern einen Admin API-Schlüssel (beginnend mit `sk-ant-admin...`), der sich von Standard-API-Schlüsseln unterscheidet. Nur Organisationsmitglieder mit der Admin-Rolle können Admin API-Schlüssel über die [Claude Console](/settings/admin-keys) bereitstellen.
</Check>

## Partner-Lösungen

Führende Observability-Plattformen bieten einsatzbereite Integrationen zur Überwachung Ihrer Claude API-Nutzung und -Kosten, ohne benutzerdefinierten Code zu schreiben. Diese Integrationen bieten Dashboards, Benachrichtigungen und Analysen, um Ihre API-Nutzung effektiv zu verwalten.

<CardGroup cols={3}>
  <Card title="CloudZero" icon="chart" href="https://docs.cloudzero.com/docs/connections-anthropic">
    Cloud-Intelligenzplattform zur Verfolgung und Prognose von Kosten
  </Card>
  <Card title="Datadog" icon="chart" href="https://docs.datadoghq.com/integrations/anthropic/">
    LLM-Observability mit automatischer Verfolgung und Überwachung
  </Card>
  <Card title="Grafana Cloud" icon="chart" href="https://grafana.com/docs/grafana-cloud/monitor-infrastructure/integrations/integration-reference/integration-anthropic/">
    Agentlose Integration für einfache LLM-Observability mit vorkonfigurierten Dashboards und Benachrichtigungen
  </Card>
  <Card title="Honeycomb" icon="polygon" href="https://docs.honeycomb.io/integrations/anthropic-usage-monitoring/">
    Erweiterte Abfragen und Visualisierung über OpenTelemetry
  </Card>
  <Card title="Vantage" icon="chart" href="https://docs.vantage.sh/connecting_anthropic">
    FinOps-Plattform für LLM-Kosten- und Nutzungsobservability
  </Card>
</CardGroup>

## Schnellstart

Rufen Sie die tägliche Nutzung Ihrer Organisation der letzten 7 Tage ab:

```bash
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-08T00:00:00Z&\
ending_at=2025-01-15T00:00:00Z&\
bucket_width=1d" \
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

## Usage API

Verfolgen Sie den Token-Verbrauch in Ihrer Organisation mit detaillierten Aufschlüsselungen nach Modell, Workspace und Service Tier mit dem Endpunkt `/v1/organizations/usage_report/messages`.

### Wichtige Konzepte

- **Zeitbuckets**: Aggregieren Sie Nutzungsdaten in festen Intervallen (`1m`, `1h` oder `1d`)
- **Token-Verfolgung**: Messen Sie unkachedierte Eingabe, gecachte Eingabe, Cache-Erstellung und Ausgabe-Tokens
- **Filterung & Gruppierung**: Filtern Sie nach API-Schlüssel, Workspace, Modell, Service Tier oder Kontextfenster und gruppieren Sie Ergebnisse nach diesen Dimensionen
- **Server-Tool-Nutzung**: Verfolgen Sie die Nutzung von serverseitigen Tools wie Web-Suche

Für vollständige Parameterdetails und Response-Schemas siehe die [Usage API-Referenz](/docs/de/api/admin-api/usage-cost/get-messages-usage-report).

### Grundlegende Beispiele

#### Tägliche Nutzung nach Modell

```bash
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-01T00:00:00Z&\
ending_at=2025-01-08T00:00:00Z&\
group_by[]=model&\
bucket_width=1d" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

#### Stündliche Nutzung mit Filterung

```bash
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-15T00:00:00Z&\
ending_at=2025-01-15T23:59:59Z&\
models[]=claude-sonnet-4-5-20250929&\
service_tiers[]=batch&\
context_window[]=0-200k&\
bucket_width=1h" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

#### Nutzung nach API-Schlüsseln und Workspaces filtern

```bash
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-01T00:00:00Z&\
ending_at=2025-01-08T00:00:00Z&\
api_key_ids[]=apikey_01Rj2N8SVvo6BePZj99NhmiT&\
api_key_ids[]=apikey_01ABC123DEF456GHI789JKL&\
workspace_ids[]=wrkspc_01JwQvzr7rXLA5AGx3HKfFUJ&\
workspace_ids[]=wrkspc_01XYZ789ABC123DEF456MNO&\
bucket_width=1d" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

<Tip>
Um die API-Schlüssel-IDs Ihrer Organisation abzurufen, verwenden Sie den Endpunkt [List API Keys](/docs/de/api/admin-api/apikeys/list-api-keys).

Um die Workspace-IDs Ihrer Organisation abzurufen, verwenden Sie den Endpunkt [List Workspaces](/docs/de/api/admin-api/workspaces/list-workspaces) oder finden Sie die Workspace-IDs Ihrer Organisation in der Anthropic Console.
</Tip>

### Zeitgranularitätsgrenzen

| Granularität | Standardlimit | Maximales Limit | Anwendungsfall |
|-------------|---------------|---------------|----------|
| `1m` | 60 Buckets | 1440 Buckets | Echtzeit-Überwachung |
| `1h` | 24 Buckets | 168 Buckets | Tägliche Muster |
| `1d` | 7 Buckets | 31 Buckets | Wöchentliche/monatliche Berichte |

## Cost API

Rufen Sie Service-Level-Kostenaufschlüsselungen in USD mit dem Endpunkt `/v1/organizations/cost_report` ab.

### Wichtige Konzepte

- **Währung**: Alle Kosten in USD, als Dezimalzeichenfolgen in kleinsten Einheiten (Cent) angegeben
- **Kostentypen**: Verfolgen Sie Token-Nutzung, Web-Suche und Code-Ausführungskosten
- **Gruppierung**: Gruppieren Sie Kosten nach Workspace oder Beschreibung für detaillierte Aufschlüsselungen
- **Zeitbuckets**: Nur tägliche Granularität (`1d`)

Für vollständige Parameterdetails und Response-Schemas siehe die [Cost API-Referenz](/docs/de/api/admin-api/usage-cost/get-cost-report).

<Warning>
  Priority Tier-Kosten verwenden ein anderes Abrechnungsmodell und sind nicht im Cost-Endpunkt enthalten. Verfolgen Sie die Priority Tier-Nutzung stattdessen über den Usage-Endpunkt.
</Warning>

### Grundlegendes Beispiel

```bash
curl "https://api.anthropic.com/v1/organizations/cost_report?\
starting_at=2025-01-01T00:00:00Z&\
ending_at=2025-01-31T00:00:00Z&\
group_by[]=workspace_id&\
group_by[]=description" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

## Pagination

Beide Endpunkte unterstützen Pagination für große Datensätze:

1. Stellen Sie Ihre erste Anfrage
2. Wenn `has_more` `true` ist, verwenden Sie den Wert `next_page` in Ihrer nächsten Anfrage
3. Fahren Sie fort, bis `has_more` `false` ist

```bash
# Erste Anfrage
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-01T00:00:00Z&\
ending_at=2025-01-31T00:00:00Z&\
limit=7" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"

# Response enthält: "has_more": true, "next_page": "page_xyz..."

# Nächste Anfrage mit Pagination
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-01T00:00:00Z&\
ending_at=2025-01-31T00:00:00Z&\
limit=7&\
page=page_xyz..." \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

## Häufige Anwendungsfälle

Erkunden Sie detaillierte Implementierungen in [anthropic-cookbook](https://github.com/anthropics/anthropic-cookbook):

- **Tägliche Nutzungsberichte**: Verfolgen Sie Token-Verbrauchstrends
- **Kostenzuordnung**: Ordnen Sie Ausgaben nach Workspace für Rückbelastungen zu
- **Cache-Effizienz**: Messen und optimieren Sie Prompt Caching
- **Budget-Überwachung**: Richten Sie Benachrichtigungen für Ausgabenschwellen ein
- **CSV-Export**: Generieren Sie Berichte für Finanzteams

## Häufig gestellte Fragen

### Wie aktuell sind die Daten?
Nutzungs- und Kostendaten erscheinen normalerweise innerhalb von 5 Minuten nach Abschluss der API-Anfrage, obwohl Verzögerungen gelegentlich länger sein können.

### Wie häufig sollte ich abfragen?
Die API unterstützt Abfragen einmal pro Minute für kontinuierliche Nutzung. Für kurze Bursts (z. B. das Herunterladen paginierter Daten) ist häufigeres Abfragen akzeptabel. Zwischenspeichern Sie Ergebnisse für Dashboards, die häufige Aktualisierungen benötigen.

### Wie verfolge ich die Code-Ausführungsnutzung?
Code-Ausführungskosten erscheinen im Cost-Endpunkt, gruppiert unter `Code Execution Usage` im Beschreibungsfeld. Code-Ausführung ist nicht im Usage-Endpunkt enthalten.

### Wie verfolge ich die Priority Tier-Nutzung?
Filtern oder gruppieren Sie nach `service_tier` im Usage-Endpunkt und suchen Sie nach dem Wert `priority`. Priority Tier-Kosten sind nicht im Cost-Endpunkt verfügbar.

### Was passiert mit der Workbench-Nutzung?
API-Nutzung aus der Workbench ist nicht mit einem API-Schlüssel verknüpft, daher ist `api_key_id` `null`, auch wenn Sie nach dieser Dimension gruppieren.

### Wie wird der Standard-Workspace dargestellt?
Nutzung und Kosten, die dem Standard-Workspace zugeordnet sind, haben einen `null`-Wert für `workspace_id`.

### Wie erhalte ich Kostenaufschlüsselungen pro Benutzer für Claude Code?

Verwenden Sie die [Claude Code Analytics API](/docs/de/build-with-claude/claude-code-analytics-api), die geschätzte Kosten pro Benutzer und Produktivitätsmetriken ohne die Leistungsbeschränkungen der Kostenaufschlüsselung nach vielen API-Schlüsseln bietet. Für allgemeine API-Nutzung mit vielen Schlüsseln verwenden Sie die [Usage API](#usage-api), um den Token-Verbrauch als Kosten-Proxy zu verfolgen.

## Siehe auch
Die Usage und Cost APIs können verwendet werden, um Ihren Benutzern ein besseres Erlebnis zu bieten, Ihre Kosten zu verwalten und Ihr Rate Limit zu bewahren. Erfahren Sie mehr über einige dieser anderen Funktionen:

- [Admin API Übersicht](/docs/de/build-with-claude/administration-api)
- [Admin API Referenz](/docs/de/api/admin)
- [Preisgestaltung](/docs/de/about-claude/pricing)
- [Prompt Caching](/docs/de/build-with-claude/prompt-caching) - Optimieren Sie Kosten mit Caching
- [Batch-Verarbeitung](/docs/de/build-with-claude/batch-processing) - 50% Rabatt auf Batch-Anfragen
- [Rate Limits](/docs/de/api/rate-limits) - Verstehen Sie Nutzungsstufen