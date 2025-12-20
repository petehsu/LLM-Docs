# Admin API-Übersicht

Verwalten Sie Ihre Organisationsressourcen programmgesteuert mit der Admin API, einschließlich Organisationsmitgliedern, Arbeitsbereichen und API-Schlüsseln.

---

<Tip>
**The Admin API is unavailable for individual accounts.** To collaborate with teammates and add members, set up your organization in **Console → Settings → Organization**.
</Tip>

Die [Admin API](/docs/de/api/admin) ermöglicht es Ihnen, die Ressourcen Ihrer Organisation programmgesteuert zu verwalten, einschließlich Organisationsmitgliedern, Arbeitsbereichen und API-Schlüsseln. Dies bietet programmgesteuerte Kontrolle über administrative Aufgaben, die sonst manuelle Konfiguration in der [Claude Console](/) erfordern würden.

<Check>
  **Die Admin API erfordert speziellen Zugriff**

  Die Admin API erfordert einen speziellen Admin API-Schlüssel (beginnend mit `sk-ant-admin...`), der sich von Standard-API-Schlüsseln unterscheidet. Nur Organisationsmitglieder mit der Admin-Rolle können Admin API-Schlüssel über die Claude Console bereitstellen.
</Check>

## Funktionsweise der Admin API

Wenn Sie die Admin API verwenden:

1. Sie stellen Anfragen mit Ihrem Admin API-Schlüssel im Header `x-api-key`
2. Die API ermöglicht es Ihnen, Folgendes zu verwalten:
   - Organisationsmitglieder und ihre Rollen
   - Einladungen für Organisationsmitglieder
   - Arbeitsbereiche und ihre Mitglieder
   - API-Schlüssel

Dies ist nützlich für:
- Automatisierung des Benutzer-Onboarding/Offboarding
- Programmgesteuerte Verwaltung des Arbeitsbereichszugriffs
- Überwachung und Verwaltung der API-Schlüsselnutzung

## Organisationsrollen und Berechtigungen

Es gibt fünf Rollen auf Organisationsebene. Weitere Details finden Sie [hier](https://support.claude.com/en/articles/10186004-api-console-roles-and-permissions).

| Rolle | Berechtigungen |
|------|-------------|
| user | Kann Workbench verwenden |
| claude_code_user | Kann Workbench und [Claude Code](https://code.claude.com/docs/en/overview) verwenden |
| developer | Kann Workbench verwenden und API-Schlüssel verwalten |
| billing | Kann Workbench verwenden und Abrechnungsdetails verwalten |
| admin | Kann alles oben Genannte tun und Benutzer verwalten |

## Wichtige Konzepte

### Organisationsmitglieder

Sie können [Organisationsmitglieder](/docs/de/api/admin-api/users/get-user) auflisten, Mitgliederrollen aktualisieren und Mitglieder entfernen.

<CodeGroup>
```bash Shell
# Organisationsmitglieder auflisten
curl "https://api.anthropic.com/v1/organizations/users?limit=10" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# Mitgliederrolle aktualisieren
curl "https://api.anthropic.com/v1/organizations/users/{user_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{"role": "developer"}'

# Mitglied entfernen
curl --request DELETE "https://api.anthropic.com/v1/organizations/users/{user_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"
```

</CodeGroup>

### Organisationseinladungen

Sie können Benutzer zu Organisationen einladen und diese [Einladungen](/docs/de/api/admin-api/invites/get-invite) verwalten.

<CodeGroup>

```bash Shell
# Einladung erstellen
curl --request POST "https://api.anthropic.com/v1/organizations/invites" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{
    "email": "newuser@domain.com",
    "role": "developer"
  }'

# Einladungen auflisten
curl "https://api.anthropic.com/v1/organizations/invites?limit=10" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# Einladung löschen
curl --request DELETE "https://api.anthropic.com/v1/organizations/invites/{invite_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"
```

</CodeGroup>

### Arbeitsbereiche

Erstellen und verwalten Sie [Arbeitsbereiche](/docs/de/api/admin-api/workspaces/get-workspace) ([Konsole](/settings/workspaces)), um Ihre Ressourcen zu organisieren:

<CodeGroup>

```bash Shell
# Arbeitsbereich erstellen
curl --request POST "https://api.anthropic.com/v1/organizations/workspaces" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{"name": "Production"}'

# Arbeitsbereiche auflisten
curl "https://api.anthropic.com/v1/organizations/workspaces?limit=10&include_archived=false" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# Arbeitsbereich archivieren
curl --request POST "https://api.anthropic.com/v1/organizations/workspaces/{workspace_id}/archive" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"
```

</CodeGroup>

### Arbeitsbereichsmitglieder

Verwalten Sie [Benutzerzugriff auf bestimmte Arbeitsbereiche](/docs/de/api/admin-api/workspace_members/get-workspace-member):

<CodeGroup>

```bash Shell
# Mitglied zum Arbeitsbereich hinzufügen
curl --request POST "https://api.anthropic.com/v1/organizations/workspaces/{workspace_id}/members" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{
    "user_id": "user_xxx",
    "workspace_role": "workspace_developer"
  }'

# Arbeitsbereichsmitglieder auflisten
curl "https://api.anthropic.com/v1/organizations/workspaces/{workspace_id}/members?limit=10" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# Mitgliederrolle aktualisieren
curl --request POST "https://api.anthropic.com/v1/organizations/workspaces/{workspace_id}/members/{user_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{
    "workspace_role": "workspace_admin"
  }'

# Mitglied aus Arbeitsbereich entfernen
curl --request DELETE "https://api.anthropic.com/v1/organizations/workspaces/{workspace_id}/members/{user_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"
```

</CodeGroup>

### API-Schlüssel

Überwachen und verwalten Sie [API-Schlüssel](/docs/de/api/admin-api/apikeys/get-api-key):

<CodeGroup>

```bash Shell
# API-Schlüssel auflisten
curl "https://api.anthropic.com/v1/organizations/api_keys?limit=10&status=active&workspace_id=wrkspc_xxx" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# API-Schlüssel aktualisieren
curl --request POST "https://api.anthropic.com/v1/organizations/api_keys/{api_key_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{
    "status": "inactive",
    "name": "New Key Name"
  }'
```

</CodeGroup>

## Zugriff auf Organisationsinformationen

Rufen Sie Informationen über Ihre Organisation programmgesteuert mit dem Endpunkt `/v1/organizations/me` ab.

Beispiel:

```bash
curl "https://api.anthropic.com/v1/organizations/me" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

```json
{
  "id": "12345678-1234-5678-1234-567812345678",
  "type": "organization",
  "name": "Organization Name"
}
```

Dieser Endpunkt ist nützlich, um programmgesteuert zu bestimmen, zu welcher Organisation ein Admin API-Schlüssel gehört.

Für vollständige Parameterdetails und Antwortschemas siehe die [Organisationsinformationen API-Referenz](/docs/de/api/admin-api/organization/get-me).

## Zugriff auf Nutzungs- und Kostenberichte

Um auf Nutzungs- und Kostenberichte für Ihre Organisation zuzugreifen, verwenden Sie die Nutzungs- und Kosten-API-Endpunkte:

- Der [**Nutzungsendpunkt**](/docs/de/build-with-claude/usage-cost-api#usage-api) (`/v1/organizations/usage_report/messages`) bietet detaillierte Nutzungsdaten, einschließlich Token-Zählungen und Anfragemetriken, gruppiert nach verschiedenen Dimensionen wie Arbeitsbereich, Benutzer und Modell.
- Der [**Kostenendpunkt**](/docs/de/build-with-claude/usage-cost-api#cost-api) (`/v1/organizations/cost_report`) bietet Kostendaten, die mit der Nutzung Ihrer Organisation verbunden sind, und ermöglicht es Ihnen, Ausgaben zu verfolgen und Kosten nach Arbeitsbereich oder Beschreibung zuzuordnen.

Diese Endpunkte bieten detaillierte Einblicke in die Nutzung Ihrer Organisation und die damit verbundenen Kosten.

## Zugriff auf Claude Code-Analysen

Für Organisationen, die Claude Code verwenden, bietet die [**Claude Code Analytics API**](/docs/de/build-with-claude/claude-code-analytics-api) detaillierte Produktivitätsmetriken und Nutzungseinblicke:

- Der [**Claude Code Analytics-Endpunkt**](/docs/de/build-with-claude/claude-code-analytics-api) (`/v1/organizations/usage_report/claude_code`) bietet täglich aggregierte Metriken für die Claude Code-Nutzung, einschließlich Sitzungen, Codezeilen, Commits, Pull Requests, Tool-Nutzungsstatistiken und Kostendaten, aufgeschlüsselt nach Benutzer und Modell.

Diese API ermöglicht es Ihnen, die Entwicklerproduktivität zu verfolgen, die Claude Code-Einführung zu analysieren und benutzerdefinierte Dashboards für Ihre Organisation zu erstellen.

## Best Practices

Um die Admin API effektiv zu nutzen:

- Verwenden Sie aussagekräftige Namen und Beschreibungen für Arbeitsbereiche und API-Schlüssel
- Implementieren Sie ordnungsgemäße Fehlerbehandlung für fehlgeschlagene Operationen
- Überprüfen Sie regelmäßig Mitgliederrollen und Berechtigungen
- Bereinigen Sie ungenutzte Arbeitsbereiche und abgelaufene Einladungen
- Überwachen Sie die API-Schlüsselnutzung und rotieren Sie Schlüssel regelmäßig

## Häufig gestellte Fragen

<section title="Welche Berechtigungen sind erforderlich, um die Admin API zu verwenden?">

Nur Organisationsmitglieder mit der Admin-Rolle können die Admin API verwenden. Sie müssen auch einen speziellen Admin API-Schlüssel haben (beginnend mit `sk-ant-admin`).

</section>

<section title="Kann ich neue API-Schlüssel über die Admin API erstellen?">

Nein, neue API-Schlüssel können aus Sicherheitsgründen nur über die Claude Console erstellt werden. Die Admin API kann nur vorhandene API-Schlüssel verwalten.

</section>

<section title="Was passiert mit API-Schlüsseln beim Entfernen eines Benutzers?">

API-Schlüssel bleiben in ihrem aktuellen Zustand erhalten, da sie auf die Organisation beschränkt sind, nicht auf einzelne Benutzer.

</section>

<section title="Können Organisationsadministratoren über die API entfernt werden?">

Nein, Organisationsmitglieder mit der Admin-Rolle können aus Sicherheitsgründen nicht über die API entfernt werden.

</section>

<section title="Wie lange sind Organisationseinladungen gültig?">

Organisationseinladungen verfallen nach 21 Tagen. Es gibt derzeit keine Möglichkeit, diesen Ablaufzeitraum zu ändern.

</section>

<section title="Gibt es Limits für Arbeitsbereiche?">

Ja, Sie können maximal 100 Arbeitsbereiche pro Organisation haben. Archivierte Arbeitsbereiche zählen nicht zu diesem Limit.

</section>

<section title="Was ist der Standard-Arbeitsbereich?">

Jede Organisation hat einen „Standard-Arbeitsbereich", der nicht bearbeitet oder entfernt werden kann und keine ID hat. Dieser Arbeitsbereich wird nicht in Arbeitsbereichs-List-Endpunkten angezeigt.

</section>

<section title="Wie beeinflussen Organisationsrollen den Arbeitsbereichszugriff?">

Organisationsadministratoren erhalten automatisch die Rolle `workspace_admin` für alle Arbeitsbereiche. Organisationsmitglieder mit Abrechnungsrolle erhalten automatisch die Rolle `workspace_billing`. Organisationsbenutzer und Entwickler müssen manuell zu jedem Arbeitsbereich hinzugefügt werden.

</section>

<section title="Welche Rollen können in Arbeitsbereichen zugewiesen werden?">

Organisationsbenutzer und Entwickler können die Rollen `workspace_admin`, `workspace_developer` oder `workspace_user` zugewiesen bekommen. Die Rolle `workspace_billing` kann nicht manuell zugewiesen werden – sie wird von der Organisationsrolle `billing` geerbt.

</section>

<section title="Können die Arbeitsbereichsrollen von Organisationsadministratoren oder Abrechnungsmitgliedern geändert werden?">

Nur Organisationsmitglieder mit Abrechnungsrolle können ihre Arbeitsbereichsrolle auf eine Admin-Rolle erhöht bekommen. Andernfalls können die Arbeitsbereichsrollen von Organisationsadministratoren und Abrechnungsmitgliedern nicht geändert werden und sie können nicht aus Arbeitsbereichen entfernt werden, während sie diese Organisationsrollen innehaben. Ihr Arbeitsbereichszugriff muss durch Änderung ihrer Organisationsrolle geändert werden.

</section>

<section title="Was passiert mit dem Arbeitsbereichszugriff, wenn sich Organisationsrollen ändern?">

Wenn ein Organisationsadministrator oder Abrechnungsmitglied zu Benutzer oder Entwickler herabgestuft wird, verliert es den Zugriff auf alle Arbeitsbereiche außer denjenigen, denen es manuell Rollen zugewiesen bekam. Wenn Benutzer zu Admin- oder Abrechnungsrollen befördert werden, erhalten sie automatischen Zugriff auf alle Arbeitsbereiche.

</section>