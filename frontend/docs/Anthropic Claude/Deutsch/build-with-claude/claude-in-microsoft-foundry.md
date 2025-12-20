# Claude in Microsoft Foundry

Greifen Sie auf Claude-Modelle über Microsoft Foundry mit Azure-nativen Endpunkten und Authentifizierung zu.

---

Diese Anleitung führt Sie durch den Prozess der Einrichtung und der Durchführung von API-Aufrufen an Claude in Foundry in Python, TypeScript oder unter Verwendung direkter HTTP-Anfragen. Wenn Sie auf Claude in Foundry zugreifen können, werden Sie für die Claude-Nutzung im Microsoft Marketplace mit Ihrem Azure-Abonnement abgerechnet, sodass Sie auf Claudes neueste Funktionen zugreifen können und gleichzeitig die Kosten über Ihr Azure-Abonnement verwalten können.

Regionale Verfügbarkeit: Bei der Einführung ist Claude als Global Standard-Bereitstellungstyp in Foundry-Ressourcen verfügbar, wobei US DataZone bald verfügbar sein wird. Die Preisgestaltung für Claude im Microsoft Marketplace verwendet die Standard-API-Preisgestaltung von Anthropic. Besuchen Sie unsere [Preisseite](https://claude.com/pricing#api) für Details.

## Vorschau

In dieser Vorschau-Plattformintegration werden Claude-Modelle auf der Infrastruktur von Anthropic ausgeführt. Dies ist eine kommerzielle Integration für die Abrechnung und den Zugriff über Azure. Als unabhängiger Verarbeiter für Microsoft unterliegen Kunden, die Claude über Microsoft Foundry nutzen, den Datenschutzbestimmungen von Anthropic. Anthropic setzt sich weiterhin für seine branchenführenden Sicherheits- und Datenverpflichtungen ein, einschließlich der Verfügbarkeit von Null-Datenspeicherung.

## Voraussetzungen

Bevor Sie beginnen, stellen Sie sicher, dass Sie über Folgendes verfügen:

- Ein aktives Azure-Abonnement
- Zugriff auf [Foundry](https://ai.azure.com/)
- Die [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) installiert (optional, für die Ressourcenverwaltung)

## Installieren Sie ein SDK

Die [Client-SDKs](/docs/de/api/client-sdks) von Anthropic unterstützen Foundry über plattformspezifische Pakete.

```bash
# Python
pip install -U "anthropic"

# Typescript
npm install @anthropic-ai/foundry-sdk
```

## Bereitstellung

Foundry verwendet eine zweistufige Hierarchie: **Ressourcen** enthalten Ihre Sicherheits- und Abrechnungskonfiguration, während **Bereitstellungen** die Modellinstanzen sind, die Sie über die API aufrufen. Sie erstellen zunächst eine Foundry-Ressource und dann eine oder mehrere Claude-Bereitstellungen darin.

### Bereitstellung von Foundry-Ressourcen

Erstellen Sie eine Foundry-Ressource, die erforderlich ist, um Dienste in Azure zu nutzen und zu verwalten. Sie können diese Anweisungen befolgen, um eine [Foundry-Ressource](https://learn.microsoft.com/en-us/azure/ai-services/multi-service-resource?pivots=azportal#create-a-new-azure-ai-foundry-resource) zu erstellen. Alternativ können Sie mit der Erstellung eines [Foundry-Projekts](https://learn.microsoft.com/en-us/azure/ai-foundry/how-to/create-projects?tabs=ai-foundry) beginnen, was die Erstellung einer Foundry-Ressource beinhaltet.

So stellen Sie Ihre Ressource bereit:

1. Navigieren Sie zum [Foundry-Portal](https://ai.azure.com/)
2. Erstellen Sie eine neue Foundry-Ressource oder wählen Sie eine vorhandene aus
3. Konfigurieren Sie die Zugriffsverwaltung mit von Azure ausgegebenen API-Schlüsseln oder Entra ID für rollenbasierte Zugriffskontrolle
4. Konfigurieren Sie optional die Ressource so, dass sie Teil eines privaten Netzwerks (Azure Virtual Network) ist, um die Sicherheit zu erhöhen
5. Notieren Sie sich Ihren Ressourcennamen – Sie werden ihn als `{resource}` in API-Endpunkten verwenden (z. B. `https://{resource}.services.ai.azure.com/anthropic/v1/*`)

### Erstellen von Foundry-Bereitstellungen

Nach der Erstellung Ihrer Ressource stellen Sie ein Claude-Modell bereit, um es für API-Aufrufe verfügbar zu machen:

1. Navigieren Sie im Foundry-Portal zu Ihrer Ressource
2. Gehen Sie zu **Modelle + Endpunkte** und wählen Sie **+ Modell bereitstellen** > **Basismodell bereitstellen**
3. Suchen Sie nach einem Claude-Modell und wählen Sie es aus (z. B. `claude-sonnet-4-5`)
4. Konfigurieren Sie die Bereitstellungseinstellungen:
   - **Bereitstellungsname**: Standardmäßig die Modell-ID, aber Sie können sie anpassen (z. B. `my-claude-deployment`). Der Bereitstellungsname kann nach der Erstellung nicht mehr geändert werden.
   - **Bereitstellungstyp**: Wählen Sie Global Standard (empfohlen für Claude)
5. Wählen Sie **Bereitstellen** und warten Sie, bis die Bereitstellung abgeschlossen ist
6. Nach der Bereitstellung können Sie Ihre Endpunkt-URL und Schlüssel unter **Schlüssel und Endpunkt** finden

<Note>
  Der Bereitstellungsname, den Sie wählen, wird zum Wert, den Sie im `model`-Parameter Ihrer API-Anfragen übergeben. Sie können mehrere Bereitstellungen desselben Modells mit unterschiedlichen Namen erstellen, um separate Konfigurationen oder Ratenlimits zu verwalten.
</Note>

## Authentifizierung

Claude on Foundry unterstützt zwei Authentifizierungsmethoden: API-Schlüssel und Entra ID-Token. Beide Methoden verwenden Azure-gehostete Endpunkte im Format `https://{resource}.services.ai.azure.com/anthropic/v1/*`.

### API-Schlüssel-Authentifizierung

Nach der Bereitstellung Ihrer Foundry Claude-Ressource können Sie einen API-Schlüssel aus dem Foundry-Portal abrufen:

1. Navigieren Sie zu Ihrer Ressource im Foundry-Portal
2. Gehen Sie zum Abschnitt **Schlüssel und Endpunkt**
3. Kopieren Sie einen der bereitgestellten API-Schlüssel
4. Verwenden Sie entweder den `api-key`- oder `x-api-key`-Header in Ihren Anfragen, oder stellen Sie ihn dem SDK zur Verfügung

Die Python- und TypeScript-SDKs erfordern einen API-Schlüssel und entweder einen Ressourcennamen oder eine Basis-URL. Die SDKs lesen diese automatisch aus den folgenden Umgebungsvariablen, falls definiert:

- `ANTHROPIC_FOUNDRY_API_KEY` - Ihr API-Schlüssel
- `ANTHROPIC_FOUNDRY_RESOURCE` - Ihr Ressourcenname (z. B. `example-resource`)
- `ANTHROPIC_FOUNDRY_BASE_URL` - Alternative zum Ressourcennamen; die vollständige Basis-URL (z. B. `https://example-resource.services.ai.azure.com/anthropic/`)

<Note>
Die Parameter `resource` und `base_url` schließen sich gegenseitig aus. Geben Sie entweder den Ressourcennamen an (den das SDK verwendet, um die URL als `https://{resource}.services.ai.azure.com/anthropic/` zu konstruieren) oder die vollständige Basis-URL direkt.
</Note>

**Beispiel mit API-Schlüssel:**

<CodeGroup>
```python Python
import os
from anthropic import AnthropicFoundry

client = AnthropicFoundry(
    api_key=os.environ.get("ANTHROPIC_FOUNDRY_API_KEY"),
    resource='example-resource', # your resource name
)

message = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello!"}]
)
print(message.content)
```

```typescript TypeScript
import AnthropicFoundry from "@anthropic-ai/foundry-sdk";

const client = new AnthropicFoundry({
  apiKey: process.env.ANTHROPIC_FOUNDRY_API_KEY,
  resource: 'example-resource', // your resource name
});

const message = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Hello!" }],
});
console.log(message.content);
```

```bash Shell
curl https://{resource}.services.ai.azure.com/anthropic/v1/messages \
  -H "content-type: application/json" \
  -H "api-key: YOUR_AZURE_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'
```
</CodeGroup>

<Warning>
Halten Sie Ihre API-Schlüssel sicher. Committen Sie sie niemals in die Versionskontrolle und teilen Sie sie nicht öffentlich. Jeder, der Zugriff auf Ihren API-Schlüssel hat, kann Anfragen an Claude über Ihre Foundry-Ressource stellen.
</Warning>

## Microsoft Entra-Authentifizierung

Für verbesserte Sicherheit und zentralisierte Zugriffsverwaltung können Sie Entra ID-Token (ehemals Azure Active Directory) verwenden:

1. Aktivieren Sie die Entra-Authentifizierung für Ihre Foundry-Ressource
2. Rufen Sie ein Zugriffstoken von Entra ID ab
3. Verwenden Sie das Token im Header `Authorization: Bearer {TOKEN}`

**Beispiel mit Entra ID:**

<CodeGroup>
```python Python
import os
from anthropic import AnthropicFoundry
from azure.identity import DefaultAzureCredential, get_bearer_token_provider

# Get Azure Entra ID token using token provider pattern
token_provider = get_bearer_token_provider(
    DefaultAzureCredential(),
    "https://cognitiveservices.azure.com/.default"
)

# Create client with Entra ID authentication
client = AnthropicFoundry(
    resource='example-resource', # your resource name
    azure_ad_token_provider=token_provider  # Use token provider for Entra ID auth
)

# Make request
message = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello!"}]
)
print(message.content)
```

```typescript TypeScript
import AnthropicFoundry from "@anthropic-ai/foundry-sdk";
import {
  DefaultAzureCredential,
  getBearerTokenProvider,
} from "@azure/identity";

// Get Entra ID token using token provider pattern
const credential = new DefaultAzureCredential();
const tokenProvider = getBearerTokenProvider(
  credential,
  "https://cognitiveservices.azure.com/.default"
);

// Create client with Entra ID authentication
const client = new AnthropicFoundry({
  resource: 'example-resource', // your resource name
  azureADTokenProvider: tokenProvider, // Use token provider for Entra ID auth
});

// Make request
const message = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Hello!" }],
});
console.log(message.content);
```

```bash Shell
# Get Azure Entra ID token
ACCESS_TOKEN=$(az account get-access-token --resource https://cognitiveservices.azure.com --query accessToken -o tsv)

# Make request with token. Replace {resource} with your resource name
curl https://{resource}.services.ai.azure.com/anthropic/v1/messages \
  -H "content-type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'
```
</CodeGroup>

<Note>
Die Azure Entra ID-Authentifizierung ermöglicht es Ihnen, den Zugriff mit Azure RBAC zu verwalten, sich in die Identitätsverwaltung Ihrer Organisation zu integrieren und API-Schlüssel nicht manuell zu verwalten.
</Note>

## Korrelations-Request-IDs

Foundry enthält Request-Identifikatoren in HTTP-Antwortheadern zum Debuggen und Tracing. Wenn Sie den Support kontaktieren, geben Sie sowohl die `request-id`- als auch die `apim-request-id`-Werte an, um Teams dabei zu helfen, Ihre Anfrage schnell in beiden Anthropic- und Azure-Systemen zu lokalisieren und zu untersuchen.

## Unterstützte Funktionen

Claude on Foundry unterstützt die meisten leistungsstarken Funktionen von Claude. Sie können alle derzeit unterstützten Funktionen [hier](/docs/de/build-with-claude/overview) finden.

### Nicht unterstützte Funktionen

- Admin API (`/v1/organizations/*` Endpunkte)
- Models API (`/v1/models`)
- Message Batch API (`/v1/messages/batches`)

## API-Antworten

API-Antworten von Claude on Foundry folgen dem Standard-[Anthropic API-Antwortformat](/docs/de/api/messages). Dies beinhaltet das `usage`-Objekt in Antworttexten, das detaillierte Informationen zum Token-Verbrauch für Ihre Anfragen liefert. Das `usage`-Objekt ist über alle Plattformen hinweg konsistent (First-Party-API, Foundry, Amazon Bedrock und Google Vertex AI).

Weitere Informationen zu Antwortheadern, die spezifisch für Foundry sind, finden Sie im Abschnitt [Korrelations-Request-IDs](#correlation-request-ids).

## API-Modell-IDs und Bereitstellungen

Die folgenden Claude-Modelle sind über Foundry verfügbar. Die Modelle der neuesten Generation (Sonnet 4.5, Opus 4.1 und Haiku 4.5) bieten die fortschrittlichsten Funktionen:

| Modell             | Standard-Bereitstellungsname     |
| :----------------- | :------------------------------- |
| Claude Opus 4.5    | `claude-opus-4-5`                |
| Claude Sonnet 4.5  | `claude-sonnet-4-5`              |
| Claude Opus 4.1    | `claude-opus-4-1`                |
| Claude Haiku 4.5   | `claude-haiku-4-5`               |

Standardmäßig stimmen Bereitstellungsnamen mit den oben gezeigten Modell-IDs überein. Sie können jedoch benutzerdefinierte Bereitstellungen mit unterschiedlichen Namen im Foundry-Portal erstellen, um verschiedene Konfigurationen, Versionen oder Ratenlimits zu verwalten. Verwenden Sie den Bereitstellungsnamen (nicht unbedingt die Modell-ID) in Ihren API-Anfragen.

## Überwachung und Protokollierung

Azure bietet umfassende Überwachungs- und Protokollierungsfunktionen für Ihre Claude-Nutzung über Standard-Azure-Muster:

- **Azure Monitor**: Verfolgen Sie API-Nutzung, Latenz und Fehlerquoten
- **Azure Log Analytics**: Abfragen und Analyse von Request/Response-Protokollen
- **Cost Management**: Überwachen und prognostizieren Sie Kosten im Zusammenhang mit Claude-Nutzung

Anthropic empfiehlt, Ihre Aktivität mindestens auf einer 30-Tage-Rollbasis zu protokollieren, um Nutzungsmuster zu verstehen und potenzielle Probleme zu untersuchen.

<Note>
Die Protokollierungsdienste von Azure werden in Ihrem Azure-Abonnement konfiguriert. Das Aktivieren der Protokollierung gibt Microsoft oder Anthropic keinen Zugriff auf Ihren Inhalt über das hinaus, was für die Abrechnung und den Betrieb des Dienstes erforderlich ist.
</Note>

## Fehlerbehebung

### Authentifizierungsfehler

**Fehler**: `401 Unauthorized` oder `Invalid API key`

- **Lösung**: Überprüfen Sie, ob Ihr API-Schlüssel korrekt ist. Sie können einen neuen API-Schlüssel aus dem Azure-Portal unter **Schlüssel und Endpunkt** für Ihre Claude-Ressource abrufen.
- **Lösung**: Wenn Sie Azure Entra ID verwenden, stellen Sie sicher, dass Ihr Zugriffstoken gültig ist und nicht abgelaufen ist. Token laufen normalerweise nach 1 Stunde ab.

**Fehler**: `403 Forbidden`

- **Lösung**: Ihr Azure-Konto verfügt möglicherweise nicht über die erforderlichen Berechtigungen. Stellen Sie sicher, dass Ihnen die entsprechende Azure RBAC-Rolle zugewiesen ist (z. B. "Cognitive Services OpenAI User").

### Ratenlimitierung

**Fehler**: `429 Too Many Requests`

- **Lösung**: Sie haben Ihr Ratenlimit überschritten. Implementieren Sie exponentielles Backoff und Wiederholungslogik in Ihrer Anwendung.
- **Lösung**: Erwägen Sie, Ratenlimit-Erhöhungen über das Azure-Portal oder Azure-Support anzufordern.

#### Ratenlimit-Header

Foundry enthält nicht die Standard-Ratenlimit-Header von Anthropic (`anthropic-ratelimit-tokens-limit`, `anthropic-ratelimit-tokens-remaining`, `anthropic-ratelimit-tokens-reset`, `anthropic-ratelimit-input-tokens-limit`, `anthropic-ratelimit-input-tokens-remaining`, `anthropic-ratelimit-input-tokens-reset`, `anthropic-ratelimit-output-tokens-limit`, `anthropic-ratelimit-output-tokens-remaining` und `anthropic-ratelimit-output-tokens-reset`) in Antworten. Verwalten Sie die Ratenlimitierung stattdessen über die Überwachungstools von Azure.

### Modell- und Bereitstellungsfehler

**Fehler**: `Model not found` oder `Deployment not found`

- **Lösung**: Überprüfen Sie, ob Sie den korrekten Bereitstellungsnamen verwenden. Wenn Sie keine benutzerdefinierte Bereitstellung erstellt haben, verwenden Sie die Standard-Modell-ID (z. B. `claude-sonnet-4-5`).
- **Lösung**: Stellen Sie sicher, dass das Modell/die Bereitstellung in Ihrer Azure-Region verfügbar ist.

**Fehler**: `Invalid model parameter`

- **Lösung**: Der model-Parameter sollte Ihren Bereitstellungsnamen enthalten, der im Foundry-Portal angepasst werden kann. Überprüfen Sie, ob die Bereitstellung vorhanden ist und ordnungsgemäß konfiguriert ist.

## Zusätzliche Ressourcen

- **Foundry-Dokumentation**: [ai.azure.com/catalog](https://ai.azure.com/catalog/publishers/anthropic)
- **Azure-Preisgestaltung**: [azure.microsoft.com/en-us/pricing](https://azure.microsoft.com/en-us/pricing/)
- **Anthropic-Preisdetails**: [Preisdokumentation](/docs/de/about-claude/pricing#third-party-platform-pricing)
- **Authentifizierungsleitfaden**: Siehe den Abschnitt [Authentifizierung](#authentication) oben
- **Azure-Portal**: [portal.azure.com](https://portal.azure.com/)