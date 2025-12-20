# Claude auf Amazon Bedrock

Anthropic's Claude-Modelle sind jetzt allgemein über Amazon Bedrock verfügbar.

---

Das Aufrufen von Claude über Bedrock unterscheidet sich geringfügig davon, wie Sie Claude bei Verwendung von Anthropic's Client-SDKs aufrufen würden. Diese Anleitung führt Sie durch den Prozess des Abschlusses eines API-Aufrufs an Claude auf Bedrock in Python oder TypeScript.

Beachten Sie, dass diese Anleitung davon ausgeht, dass Sie sich bereits für ein [AWS-Konto](https://portal.aws.amazon.com/billing/signup) angemeldet haben und den programmatischen Zugriff konfiguriert haben.

## Installieren und Konfigurieren der AWS CLI

1. [Installieren Sie eine Version der AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html) in Version `2.13.23` oder neuer
2. Konfigurieren Sie Ihre AWS-Anmeldedaten mit dem AWS-Konfigurationsbefehl (siehe [Konfigurieren der AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)) oder suchen Sie Ihre Anmeldedaten, indem Sie in Ihrem AWS-Dashboard zu „Befehlszeilen- oder programmatischer Zugriff" navigieren und den Anweisungen im Popup-Modal folgen.
3. Überprüfen Sie, dass Ihre Anmeldedaten funktionieren:

```bash Shell
aws sts get-caller-identity
```

## Installieren Sie ein SDK für den Zugriff auf Bedrock

Anthropic's [Client-SDKs](/docs/de/api/client-sdks) unterstützen Bedrock. Sie können auch direkt ein AWS SDK wie `boto3` verwenden.

<CodeGroup>
  ```python Python
  pip install -U "anthropic[bedrock]"
  ```

  ```typescript TypeScript
  npm install @anthropic-ai/bedrock-sdk
  ```

  ```python Boto3 (Python)
  pip install boto3>=1.28.59
  ```
</CodeGroup>

## Zugriff auf Bedrock

### Abonnieren Sie Anthropic-Modelle

Gehen Sie zur [AWS Console > Bedrock > Model Access](https://console.aws.amazon.com/bedrock/home?region=us-west-2#/modelaccess) und fordern Sie Zugriff auf Anthropic-Modelle an. Beachten Sie, dass die Verfügbarkeit von Anthropic-Modellen je nach Region unterschiedlich ist. Siehe [AWS-Dokumentation](https://docs.aws.amazon.com/bedrock/latest/userguide/models-regions.html) für die neuesten Informationen.

#### API-Modell-IDs

| Modell | Basis-Bedrock-Modell-ID | `global` | `us` | `eu` | `jp` | `apac` |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| Claude Sonnet 4.5 | anthropic.claude-sonnet-4-5-20250929-v1:0 | Ja | Ja | Ja | Ja | Nein |
| Claude Sonnet 4 | anthropic.claude-sonnet-4-20250514-v1:0 | Ja | Ja | Ja | Nein | Ja |
| Claude Sonnet 3.7 <Tooltip tooltipContent="Veraltet seit 28. Oktober 2025.">⚠️</Tooltip> | anthropic.claude-3-7-sonnet-20250219-v1:0 | Nein | Ja | Ja | Nein | Ja |
| Claude Opus 4.5 | anthropic.claude-opus-4-5-20251101-v1:0 | Ja | Ja | Ja | Nein | Nein |
| Claude Opus 4.1 | anthropic.claude-opus-4-1-20250805-v1:0 | Nein | Ja | Nein | Nein | Nein |
| Claude Opus 4 | anthropic.claude-opus-4-20250514-v1:0 | Nein | Ja | Nein | Nein | Nein |
| Claude Opus 3 <Tooltip tooltipContent="Veraltet seit 30. Juni 2025.">⚠️</Tooltip> | anthropic.claude-3-opus-20240229-v1:0 | Nein | Ja | Nein | Nein | Nein |
| Claude Haiku 4.5 | anthropic.claude-haiku-4-5-20251001-v1:0 | Ja | Ja | Ja | Nein | Nein |
| Claude Haiku 3.5 | anthropic.claude-3-5-haiku-20241022-v1:0 | Nein | Ja | Nein | Nein | Nein |
| Claude Haiku 3 | anthropic.claude-3-haiku-20240307-v1:0 | Nein | Ja | Ja | Nein | Ja |

Weitere Informationen zu regionalen und globalen Modell-IDs finden Sie im Abschnitt [Globale vs. regionale Endpunkte](#global-vs-regional-endpoints) unten.

### Verfügbare Modelle auflisten

Die folgenden Beispiele zeigen, wie Sie eine Liste aller Claude-Modelle ausgeben, die über Bedrock verfügbar sind:

<CodeGroup>
  ```bash AWS CLI
  aws bedrock list-foundation-models --region=us-west-2 --by-provider anthropic --query "modelSummaries[*].modelId"
  ```

  ```python Boto3 (Python)
  import boto3

  bedrock = boto3.client(service_name="bedrock")
  response = bedrock.list_foundation_models(byProvider="anthropic")

  for summary in response["modelSummaries"]:
      print(summary["modelId"])
  ```
</CodeGroup>

### Anfragen stellen

Die folgenden Beispiele zeigen, wie Sie Text von Claude auf Bedrock generieren:

<CodeGroup>
  ```python Python
  from anthropic import AnthropicBedrock

  client = AnthropicBedrock(
      # Authentifizieren Sie sich, indem Sie die folgenden Schlüssel bereitstellen oder verwenden Sie die Standard-AWS-Anmeldeinformationsanbieter, wie z. B.
      # Verwendung von ~/.aws/credentials oder den Umgebungsvariablen "AWS_SECRET_ACCESS_KEY" und "AWS_ACCESS_KEY_ID".
      aws_access_key="<access key>",
      aws_secret_key="<secret key>",
      # Temporäre Anmeldedaten können mit aws_session_token verwendet werden.
      # Weitere Informationen finden Sie unter https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp.html.
      aws_session_token="<session_token>",
      # aws_region ändert die AWS-Region, an die die Anfrage gestellt wird. Standardmäßig lesen wir AWS_REGION,
      # und falls nicht vorhanden, verwenden wir standardmäßig us-east-1. Beachten Sie, dass wir ~/.aws/config nicht für die Region lesen.
      aws_region="us-west-2",
  )

  message = client.messages.create(
      model="global.anthropic.claude-sonnet-4-5-20250929-v1:0",
      max_tokens=256,
      messages=[{"role": "user", "content": "Hello, world"}]
  )
  print(message.content)
  ```

  ```typescript TypeScript
  import AnthropicBedrock from '@anthropic-ai/bedrock-sdk';

  const client = new AnthropicBedrock({
    // Authentifizieren Sie sich, indem Sie die folgenden Schlüssel bereitstellen oder verwenden Sie die Standard-AWS-Anmeldeinformationsanbieter, wie z. B.
    // Verwendung von ~/.aws/credentials oder den Umgebungsvariablen "AWS_SECRET_ACCESS_KEY" und "AWS_ACCESS_KEY_ID".
    awsAccessKey: '<access key>',
    awsSecretKey: '<secret key>',

    // Temporäre Anmeldedaten können mit awsSessionToken verwendet werden.
    // Weitere Informationen finden Sie unter https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp.html.
    awsSessionToken: '<session_token>',

    // awsRegion ändert die AWS-Region, an die die Anfrage gestellt wird. Standardmäßig lesen wir AWS_REGION,
    // und falls nicht vorhanden, verwenden wir standardmäßig us-east-1. Beachten Sie, dass wir ~/.aws/config nicht für die Region lesen.
    awsRegion: 'us-west-2',
  });

  async function main() {
    const message = await client.messages.create({
      model: 'global.anthropic.claude-sonnet-4-5-20250929-v1:0',
      max_tokens: 256,
      messages: [{"role": "user", "content": "Hello, world"}]
    });
    console.log(message);
  }
  main().catch(console.error);
  ```

  ```python Boto3 (Python)
  import boto3
  import json

  bedrock = boto3.client(service_name="bedrock-runtime")
  body = json.dumps({
    "max_tokens": 256,
    "messages": [{"role": "user", "content": "Hello, world"}],
    "anthropic_version": "bedrock-2023-05-31"
  })

  response = bedrock.invoke_model(body=body, modelId="global.anthropic.claude-sonnet-4-5-20250929-v1:0")

  response_body = json.loads(response.get("body").read())
  print(response_body.get("content"))
  ```
</CodeGroup>

Weitere Informationen finden Sie in unseren [Client-SDKs](/docs/de/api/client-sdks) und in der offiziellen Bedrock-Dokumentation [hier](https://docs.aws.amazon.com/bedrock/).

## Aktivitätsprotokollierung

Bedrock bietet einen [Invocation-Logging-Service](https://docs.aws.amazon.com/bedrock/latest/userguide/model-invocation-logging.html), mit dem Kunden die Eingabeaufforderungen und Vervollständigungen protokollieren können, die mit Ihrer Nutzung verbunden sind.

Anthropic empfiehlt, dass Sie Ihre Aktivität mindestens auf einer 30-Tage-Rollbasis protokollieren, um Ihre Aktivität zu verstehen und mögliche Missbräuche zu untersuchen.

<Note>
Das Aktivieren dieses Services gibt AWS oder Anthropic keinen Zugriff auf Ihre Inhalte.
</Note>

## Funktionsunterstützung
Sie können alle derzeit auf Bedrock unterstützten Funktionen [hier](/docs/de/api/overview) finden.

### PDF-Unterstützung auf Bedrock

Die PDF-Unterstützung ist auf Amazon Bedrock sowohl über die Converse API als auch über die InvokeModel API verfügbar. Detaillierte Informationen zu PDF-Verarbeitungsfunktionen und Einschränkungen finden Sie in der [PDF-Unterstützungsdokumentation](/docs/de/build-with-claude/pdf-support#amazon-bedrock-pdf-support).

**Wichtige Überlegungen für Converse API-Benutzer:**
- Die visuelle PDF-Analyse (Diagramme, Bilder, Layouts) erfordert, dass Zitate aktiviert sind
- Ohne Zitate ist nur die grundlegende Textextraktion verfügbar
- Für vollständige Kontrolle ohne erzwungene Zitate verwenden Sie die InvokeModel API

Weitere Informationen zu den beiden Dokumentverarbeitungsmodi und ihren Einschränkungen finden Sie im [PDF-Unterstützungsleitfaden](/docs/de/build-with-claude/pdf-support#amazon-bedrock-pdf-support).

### 1M-Token-Kontextfenster

Claude Sonnet 4 und 4.5 unterstützen das [1M-Token-Kontextfenster](/docs/de/build-with-claude/context-windows#1m-token-context-window) auf Amazon Bedrock.

<Note>
Das 1M-Token-Kontextfenster befindet sich derzeit in der Beta-Phase. Um das erweiterte Kontextfenster zu verwenden, fügen Sie den `context-1m-2025-08-07` Beta-Header in Ihre [Bedrock API-Anfragen](https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-anthropic-claude-messages-request-response.html) ein.
</Note>

## Globale vs. regionale Endpunkte

Ab **Claude Sonnet 4.5 und allen zukünftigen Modellen** bietet Amazon Bedrock zwei Endpunkttypen:

- **Globale Endpunkte**: Dynamisches Routing für maximale Verfügbarkeit
- **Regionale Endpunkte**: Garantiertes Daten-Routing durch spezifische geografische Regionen

Regionale Endpunkte beinhalten einen 10%-Preisaufschlag gegenüber globalen Endpunkten.

<Note>
Dies gilt nur für Claude Sonnet 4.5 und zukünftige Modelle. Ältere Modelle (Claude Sonnet 4, Opus 4 und früher) behalten ihre bestehenden Preisstrukturen bei.
</Note>

### Wann sollte man jede Option verwenden

**Globale Endpunkte (empfohlen):**
- Bieten maximale Verfügbarkeit und Betriebszeit
- Leiten Anfragen dynamisch zu Regionen mit verfügbarer Kapazität weiter
- Kein Preisaufschlag
- Am besten für Anwendungen, bei denen die Datenresidenz flexibel ist

**Regionale Endpunkte (CRIS):**
- Leiten Datenverkehr durch spezifische geografische Regionen weiter
- Erforderlich für Datenresidenz- und Compliance-Anforderungen
- Verfügbar für USA, EU, Japan und Australien
- 10%-Preisaufschlag spiegelt Infrastrukturkosten für dedizierte regionale Kapazität wider

### Implementierung

**Verwendung globaler Endpunkte (Standard für Sonnet 4.5 und 4):**

Die Modell-IDs für Claude Sonnet 4.5 und 4 enthalten bereits das `global.` Präfix:

<CodeGroup>
```python Python
from anthropic import AnthropicBedrock

client = AnthropicBedrock(aws_region="us-west-2")

message = client.messages.create(
    model="global.anthropic.claude-sonnet-4-5-20250929-v1:0",
    max_tokens=256,
    messages=[{"role": "user", "content": "Hello, world"}]
)
```

```typescript TypeScript
import AnthropicBedrock from '@anthropic-ai/bedrock-sdk';

const client = new AnthropicBedrock({
  awsRegion: 'us-west-2',
});

const message = await client.messages.create({
  model: 'global.anthropic.claude-sonnet-4-5-20250929-v1:0',
  max_tokens: 256,
  messages: [{role: "user", content: "Hello, world"}]
});
```
</CodeGroup>

**Verwendung regionaler Endpunkte (CRIS):**

Um regionale Endpunkte zu verwenden, entfernen Sie das `global.` Präfix aus der Modell-ID:

<CodeGroup>
```python Python
from anthropic import AnthropicBedrock

client = AnthropicBedrock(aws_region="us-west-2")

# Verwendung des US-Regionalendpunkts (CRIS)
message = client.messages.create(
    model="anthropic.claude-sonnet-4-5-20250929-v1:0",  # Kein global. Präfix
    max_tokens=256,
    messages=[{"role": "user", "content": "Hello, world"}]
)
```

```typescript TypeScript
import AnthropicBedrock from '@anthropic-ai/bedrock-sdk';

const client = new AnthropicBedrock({
  awsRegion: 'us-west-2',
});

// Verwendung des US-Regionalendpunkts (CRIS)
const message = await client.messages.create({
  model: 'anthropic.claude-sonnet-4-5-20250929-v1:0',  // Kein global. Präfix
  max_tokens: 256,
  messages: [{role: "user", content: "Hello, world"}]
});
```
</CodeGroup>

### Zusätzliche Ressourcen

- **AWS Bedrock-Preisgestaltung:** [aws.amazon.com/bedrock/pricing](https://aws.amazon.com/bedrock/pricing/)
- **AWS-Preisgestaltungsdokumentation:** [Bedrock-Preisgestaltungsleitfaden](https://docs.aws.amazon.com/bedrock/latest/userguide/bedrock-pricing.html)
- **AWS-Blogbeitrag:** [Introducing Claude Sonnet 4.5 in Amazon Bedrock](https://aws.amazon.com/blogs/aws/introducing-claude-sonnet-4-5-in-amazon-bedrock-anthropics-most-intelligent-model-best-for-coding-and-complex-agents/)
- **Anthropic-Preisgestaltungsdetails:** [Preisgestaltungsdokumentation](/docs/de/about-claude/pricing#third-party-platform-pricing)