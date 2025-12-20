# Claude auf Vertex AI

Die Claude-Modelle von Anthropic sind jetzt allgemein über [Vertex AI](https://cloud.google.com/vertex-ai) verfügbar.

---

Die Vertex API für den Zugriff auf Claude ist fast identisch mit der [Messages API](/docs/de/api/messages) und unterstützt alle gleichen Optionen, mit zwei wichtigen Unterschieden:

* In Vertex wird `model` nicht im Request-Body übergeben. Stattdessen wird es in der Google Cloud Endpoint-URL angegeben.
* In Vertex wird `anthropic_version` im Request-Body übergeben (nicht als Header), und muss auf den Wert `vertex-2023-10-16` gesetzt werden.

Vertex wird auch von Anthropics offiziellen [Client SDKs](/docs/de/api/client-sdks) unterstützt. Dieser Leitfaden führt Sie durch den Prozess, eine Anfrage an Claude auf Vertex AI entweder in Python oder TypeScript zu stellen.

Beachten Sie, dass dieser Leitfaden davon ausgeht, dass Sie bereits ein GCP-Projekt haben, das Vertex AI verwenden kann. Weitere Informationen zur erforderlichen Einrichtung sowie eine vollständige Anleitung finden Sie unter [Verwendung der Claude 3 Modelle von Anthropic](https://cloud.google.com/vertex-ai/generative-ai/docs/partner-models/use-claude).

## Installieren Sie ein SDK für den Zugriff auf Vertex AI

Installieren Sie zunächst das [Client SDK](/docs/de/api/client-sdks) von Anthropic für Ihre Sprache der Wahl.

<CodeGroup>
  ```python Python
  pip install -U google-cloud-aiplatform "anthropic[vertex]"
  ```

  ```typescript TypeScript
  npm install @anthropic-ai/vertex-sdk
  ```
</CodeGroup>

## Zugriff auf Vertex AI

### Modellverfügbarkeit

Beachten Sie, dass die Verfügbarkeit von Anthropic-Modellen je nach Region variiert. Suchen Sie nach "Claude" im [Vertex AI Model Garden](https://cloud.google.com/model-garden) oder gehen Sie zu [Claude 3 verwenden](https://cloud.google.com/vertex-ai/generative-ai/docs/partner-models/use-claude) für die neuesten Informationen.

#### API-Modell-IDs

| Modell                          | Vertex AI API-Modell-ID |
| ------------------------------ | ------------------------ |
| Claude Sonnet 4.5              | claude-sonnet-4-5@20250929 |
| Claude Sonnet 4                | claude-sonnet-4@20250514 |
| Claude Sonnet 3.7 <Tooltip tooltipContent="Veraltet seit 28. Oktober 2025.">⚠️</Tooltip> | claude-3-7-sonnet@20250219 |
| Claude Opus 4.5                | claude-opus-4-5@20251101 |
| Claude Opus 4.1                | claude-opus-4-1@20250805 |
| Claude Opus 4                  | claude-opus-4@20250514   |
| Claude Opus 3 <Tooltip tooltipContent="Veraltet seit 30. Juni 2025.">⚠️</Tooltip> | claude-3-opus@20240229   |
| Claude Haiku 4.5               | claude-haiku-4-5@20251001 |
| Claude Haiku 3.5               | claude-3-5-haiku@20241022 |
| Claude Haiku 3                 | claude-3-haiku@20240307  |

### Anfragen stellen

Bevor Sie Anfragen ausführen, müssen Sie möglicherweise `gcloud auth application-default login` ausführen, um sich bei GCP zu authentifizieren.

Das folgende Beispiel zeigt, wie Sie Text von Claude auf Vertex AI generieren:
<CodeGroup>

  ```python Python
  from anthropic import AnthropicVertex

  project_id = "MY_PROJECT_ID"
  region = "global"

  client = AnthropicVertex(project_id=project_id, region=region)

  message = client.messages.create(
      model="claude-sonnet-4-5@20250929",
      max_tokens=100,
      messages=[
          {
              "role": "user",
              "content": "Hey Claude!",
          }
      ],
  )
  print(message)
  ```

  ```typescript TypeScript
  import { AnthropicVertex } from '@anthropic-ai/vertex-sdk';

  const projectId = 'MY_PROJECT_ID';
  const region = 'global';

  // Goes through the standard `google-auth-library` flow.
  const client = new AnthropicVertex({
    projectId,
    region,
  });

  async function main() {
    const result = await client.messages.create({
      model: 'claude-sonnet-4-5@20250929',
      max_tokens: 100,
      messages: [
        {
          role: 'user',
          content: 'Hey Claude!',
        },
      ],
    });
    console.log(JSON.stringify(result, null, 2));
  }

  main();
  ```

  ```bash Shell
  MODEL_ID=claude-sonnet-4-5@20250929
  LOCATION=global
  PROJECT_ID=MY_PROJECT_ID

  curl \
  -X POST \
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  -H "Content-Type: application/json" \
  https://$LOCATION-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/anthropic/models/${MODEL_ID}:streamRawPredict -d \
  '{
    "anthropic_version": "vertex-2023-10-16",
    "messages": [{
      "role": "user",
      "content": "Hey Claude!"
    }],
    "max_tokens": 100,
  }'
  ```
</CodeGroup>

Weitere Details finden Sie in unseren [Client SDKs](/docs/de/api/client-sdks) und der offiziellen [Vertex AI Dokumentation](https://cloud.google.com/vertex-ai/docs).

## Aktivitätsprotokollierung

Vertex bietet einen [Request-Response-Protokollierungsdienst](https://cloud.google.com/vertex-ai/generative-ai/docs/multimodal/request-response-logging), mit dem Kunden die Prompts und Completions Ihrer Nutzung protokollieren können.

Anthropic empfiehlt, dass Sie Ihre Aktivität mindestens auf einer 30-Tage-Rollbasis protokollieren, um Ihre Aktivität zu verstehen und mögliche Missbräuche zu untersuchen.

<Note>
Das Aktivieren dieses Dienstes gibt Google oder Anthropic keinen Zugriff auf Ihre Inhalte.
</Note>

## Funktionsunterstützung
Sie können alle derzeit auf Vertex unterstützten Funktionen [hier](/docs/de/api/overview) finden.

## Globale vs. regionale Endpoints

Ab **Claude Sonnet 4.5 und allen zukünftigen Modellen** bietet Google Vertex AI zwei Endpoint-Typen:

- **Globale Endpoints**: Dynamisches Routing für maximale Verfügbarkeit
- **Regionale Endpoints**: Garantiertes Daten-Routing durch spezifische geografische Regionen

Regionale Endpoints beinhalten einen 10%-Preisaufschlag gegenüber globalen Endpoints.

<Note>
Dies gilt nur für Claude Sonnet 4.5 und zukünftige Modelle. Ältere Modelle (Claude Sonnet 4, Opus 4 und früher) behalten ihre bestehenden Preisstrukturen bei.
</Note>

### Wann sollte man jede Option verwenden

**Globale Endpoints (empfohlen):**
- Bieten maximale Verfügbarkeit und Betriebszeit
- Leiten Anfragen dynamisch an Regionen mit verfügbarer Kapazität weiter
- Kein Preisaufschlag
- Beste Option für Anwendungen, bei denen Datenresidenz flexibel ist
- Unterstützt nur Pay-as-you-go-Traffic (bereitgestellter Durchsatz erfordert regionale Endpoints)

**Regionale Endpoints:**
- Leiten Traffic durch spezifische geografische Regionen weiter
- Erforderlich für Datenresidenz und Compliance-Anforderungen
- Unterstützen sowohl Pay-as-you-go als auch bereitgestellten Durchsatz
- 10%-Preisaufschlag spiegelt Infrastrukturkosten für dedizierte regionale Kapazität wider

### Implementierung

**Verwendung von globalen Endpoints (empfohlen):**

Setzen Sie den `region`-Parameter auf `"global"` beim Initialisieren des Clients:

<CodeGroup>
```python Python
from anthropic import AnthropicVertex

project_id = "MY_PROJECT_ID"
region = "global"

client = AnthropicVertex(project_id=project_id, region=region)

message = client.messages.create(
    model="claude-sonnet-4-5@20250929",
    max_tokens=100,
    messages=[
        {
            "role": "user",
            "content": "Hey Claude!",
        }
    ],
)
print(message)
```

```typescript TypeScript
import { AnthropicVertex } from '@anthropic-ai/vertex-sdk';

const projectId = 'MY_PROJECT_ID';
const region = 'global';

const client = new AnthropicVertex({
  projectId,
  region,
});

const result = await client.messages.create({
  model: 'claude-sonnet-4-5@20250929',
  max_tokens: 100,
  messages: [
    {
      role: 'user',
      content: 'Hey Claude!',
    },
  ],
});
```
</CodeGroup>

**Verwendung von regionalen Endpoints:**

Geben Sie eine spezifische Region wie `"us-east1"` oder `"europe-west1"` an:

<CodeGroup>
```python Python
from anthropic import AnthropicVertex

project_id = "MY_PROJECT_ID"
region = "us-east1"  # Specify a specific region

client = AnthropicVertex(project_id=project_id, region=region)

message = client.messages.create(
    model="claude-sonnet-4-5@20250929",
    max_tokens=100,
    messages=[
        {
            "role": "user",
            "content": "Hey Claude!",
        }
    ],
)
print(message)
```

```typescript TypeScript
import { AnthropicVertex } from '@anthropic-ai/vertex-sdk';

const projectId = 'MY_PROJECT_ID';
const region = 'us-east1';  // Specify a specific region

const client = new AnthropicVertex({
  projectId,
  region,
});

const result = await client.messages.create({
  model: 'claude-sonnet-4-5@20250929',
  max_tokens: 100,
  messages: [
    {
      role: 'user',
      content: 'Hey Claude!',
    },
  ],
});
```
</CodeGroup>

### Zusätzliche Ressourcen

- **Google Vertex AI Preisgestaltung:** [cloud.google.com/vertex-ai/generative-ai/pricing](https://cloud.google.com/vertex-ai/generative-ai/pricing)
- **Claude-Modelle Dokumentation:** [Claude auf Vertex AI](https://cloud.google.com/vertex-ai/generative-ai/docs/partner-models/claude)
- **Google Blog-Beitrag:** [Globaler Endpoint für Claude-Modelle](https://cloud.google.com/blog/products/ai-machine-learning/global-endpoint-for-claude-models-generally-available-on-vertex-ai)
- **Anthropic Preisdetails:** [Preisdokumentation](/docs/de/about-claude/pricing#third-party-platform-pricing)