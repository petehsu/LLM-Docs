# Prompt-Caching

Prompt-Caching ist eine leistungsstarke Funktion, die Ihre API-Nutzung optimiert, indem Sie von bestimmten Präfixen in Ihren Prompts fortfahren können.

---

Prompt-Caching ist eine leistungsstarke Funktion, die Ihre API-Nutzung optimiert, indem Sie von bestimmten Präfixen in Ihren Prompts fortfahren können. Dieser Ansatz reduziert die Verarbeitungszeit und Kosten für wiederholte Aufgaben oder Prompts mit konsistenten Elementen erheblich.

Hier ist ein Beispiel für die Implementierung von Prompt-Caching mit der Messages API unter Verwendung eines `cache_control`-Blocks:

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "system": [
      {
        "type": "text",
        "text": "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n"
      },
      {
        "type": "text",
        "text": "<the entire contents of Pride and Prejudice>",
        "cache_control": {"type": "ephemeral"}
      }
    ],
    "messages": [
      {
        "role": "user",
        "content": "Analyze the major themes in Pride and Prejudice."
      }
    ]
  }'

# Call the model again with the same inputs up to the cache checkpoint
curl https://api.anthropic.com/v1/messages # rest of input
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    system=[
      {
        "type": "text",
        "text": "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n",
      },
      {
        "type": "text",
        "text": "<the entire contents of 'Pride and Prejudice'>",
        "cache_control": {"type": "ephemeral"}
      }
    ],
    messages=[{"role": "user", "content": "Analyze the major themes in 'Pride and Prejudice'."}],
)
print(response.usage.model_dump_json())

# Call the model again with the same inputs up to the cache checkpoint
response = client.messages.create(.....)
print(response.usage.model_dump_json())
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  system: [
    {
      type: "text",
      text: "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n",
    },
    {
      type: "text",
      text: "<the entire contents of 'Pride and Prejudice'>",
      cache_control: { type: "ephemeral" }
    }
  ],
  messages: [
    {
      role: "user",
      content: "Analyze the major themes in 'Pride and Prejudice'."
    }
  ]
});
console.log(response.usage);

// Call the model again with the same inputs up to the cache checkpoint
const new_response = await client.messages.create(...)
console.log(new_response.usage);
```

```java Java
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;

public class PromptCachingExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                .systemOfTextBlockParams(List.of(
                        TextBlockParam.builder()
                                .text("You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n")
                                .build(),
                        TextBlockParam.builder()
                                .text("<the entire contents of 'Pride and Prejudice'>")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build()
                ))
                .addUserMessage("Analyze the major themes in 'Pride and Prejudice'.")
                .build();

        Message message = client.messages().create(params);
        System.out.println(message.usage());
    }
}
```
</CodeGroup>

```json JSON
{"cache_creation_input_tokens":188086,"cache_read_input_tokens":0,"input_tokens":21,"output_tokens":393}
{"cache_creation_input_tokens":0,"cache_read_input_tokens":188086,"input_tokens":21,"output_tokens":393}
```

In diesem Beispiel wird der gesamte Text von „Pride and Prejudice" mit dem `cache_control`-Parameter zwischengespeichert. Dies ermöglicht die Wiederverwendung dieses großen Textes über mehrere API-Aufrufe hinweg, ohne ihn jedes Mal neu zu verarbeiten. Durch das Ändern nur der Benutzernachricht können Sie verschiedene Fragen zum Buch stellen und dabei den zwischengespeicherten Inhalt nutzen, was zu schnelleren Antworten und verbesserter Effizienz führt.

---

## Wie Prompt-Caching funktioniert

Wenn Sie eine Anfrage mit aktiviertem Prompt-Caching senden:

1. Das System prüft, ob ein Prompt-Präfix bis zu einem angegebenen Cache-Haltepunkt bereits aus einer kürzlichen Abfrage zwischengespeichert ist.
2. Falls gefunden, wird die zwischengespeicherte Version verwendet, was die Verarbeitungszeit und Kosten reduziert.
3. Andernfalls wird der vollständige Prompt verarbeitet und das Präfix zwischengespeichert, sobald die Antwort beginnt.

Dies ist besonders nützlich für:
- Prompts mit vielen Beispielen
- Große Mengen an Kontext oder Hintergrundinformationen
- Wiederholte Aufgaben mit konsistenten Anweisungen
- Lange mehrteilige Gespräche

Standardmäßig hat der Cache eine Lebensdauer von 5 Minuten. Der Cache wird jedes Mal kostenlos aktualisiert, wenn der zwischengespeicherte Inhalt verwendet wird.

<Note>
Wenn Sie feststellen, dass 5 Minuten zu kurz sind, bietet Anthropic auch eine Cache-Dauer von 1 Stunde [gegen zusätzliche Kosten](#pricing) an.

Weitere Informationen finden Sie unter [Cache-Dauer von 1 Stunde](#1-hour-cache-duration).
</Note>

<Tip>
  **Prompt-Caching speichert das vollständige Präfix zwischen**

Prompt-Caching verweist auf den gesamten Prompt - `tools`, `system` und `messages` (in dieser Reihenfolge) bis zu und einschließlich des Blocks, der mit `cache_control` gekennzeichnet ist.

</Tip>

---
## Preisgestaltung

Prompt-Caching führt eine neue Preisstruktur ein. Die folgende Tabelle zeigt den Preis pro Million Token für jedes unterstützte Modell:

| Model             | Base Input Tokens | 5m Cache Writes | 1h Cache Writes | Cache Hits & Refreshes | Output Tokens |
|-------------------|-------------------|-----------------|-----------------|----------------------|---------------|
| Claude Opus 4.5   | $5 / MTok         | $6.25 / MTok    | $10 / MTok      | $0.50 / MTok | $25 / MTok    |
| Claude Opus 4.1   | $15 / MTok        | $18.75 / MTok   | $30 / MTok      | $1.50 / MTok | $75 / MTok    |
| Claude Opus 4     | $15 / MTok        | $18.75 / MTok   | $30 / MTok      | $1.50 / MTok | $75 / MTok    |
| Claude Sonnet 4.5   | $3 / MTok         | $3.75 / MTok    | $6 / MTok       | $0.30 / MTok | $15 / MTok    |
| Claude Sonnet 4   | $3 / MTok         | $3.75 / MTok    | $6 / MTok       | $0.30 / MTok | $15 / MTok    |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations)) | $3 / MTok         | $3.75 / MTok    | $6 / MTok       | $0.30 / MTok | $15 / MTok    |
| Claude Haiku 4.5  | $1 / MTok         | $1.25 / MTok    | $2 / MTok       | $0.10 / MTok | $5 / MTok     |
| Claude Haiku 3.5  | $0.80 / MTok      | $1 / MTok       | $1.6 / MTok     | $0.08 / MTok | $4 / MTok     |
| Claude Opus 3 ([deprecated](/docs/en/about-claude/model-deprecations))    | $15 / MTok        | $18.75 / MTok   | $30 / MTok      | $1.50 / MTok | $75 / MTok    |
| Claude Haiku 3    | $0.25 / MTok      | $0.30 / MTok    | $0.50 / MTok    | $0.03 / MTok | $1.25 / MTok  |

<Note>
Die obige Tabelle spiegelt die folgenden Preismultiplikatoren für Prompt-Caching wider:
- 5-Minuten-Cache-Schreib-Token kosten das 1,25-fache des Basis-Eingabe-Token-Preises
- 1-Stunden-Cache-Schreib-Token kosten das 2-fache des Basis-Eingabe-Token-Preises
- Cache-Lese-Token kosten das 0,1-fache des Basis-Eingabe-Token-Preises
</Note>

---
## Wie man Prompt-Caching implementiert

### Unterstützte Modelle

Prompt-Caching wird derzeit unterstützt auf:
- Claude Opus 4.5
- Claude Opus 4.1
- Claude Opus 4
- Claude Sonnet 4.5
- Claude Sonnet 4
- Claude Sonnet 3.7 ([veraltet](/docs/de/about-claude/model-deprecations))
- Claude Haiku 4.5
- Claude Haiku 3.5
- Claude Haiku 3
- Claude Opus 3 ([veraltet](/docs/de/about-claude/model-deprecations))

### Strukturierung Ihres Prompts

Platzieren Sie statische Inhalte (Tool-Definitionen, Systemanweisungen, Kontext, Beispiele) am Anfang Ihres Prompts. Markieren Sie das Ende des wiederverwendbaren Inhalts zum Zwischenspeichern mit dem `cache_control`-Parameter.

Cache-Präfixe werden in der folgenden Reihenfolge erstellt: `tools`, `system`, dann `messages`. Diese Reihenfolge bildet eine Hierarchie, in der jede Ebene auf den vorherigen aufbaut.

#### Wie die automatische Präfix-Überprüfung funktioniert

Sie können nur einen Cache-Haltepunkt am Ende Ihres statischen Inhalts verwenden, und das System findet automatisch die längste übereinstimmende Sequenz von zwischengespeicherten Blöcken. Das Verständnis, wie dies funktioniert, hilft Ihnen, Ihre Caching-Strategie zu optimieren.

**Drei Kernprinzipien:**

1. **Cache-Schlüssel sind kumulativ**: Wenn Sie einen Block explizit mit `cache_control` zwischenspeichern, wird der Cache-Hash-Schlüssel durch Hashing aller vorherigen Blöcke in der Konversation nacheinander generiert. Dies bedeutet, dass der Cache für jeden Block von allen Inhalten abhängt, die davor kamen.

2. **Rückwärts sequenzielle Überprüfung**: Das System prüft auf Cache-Treffer, indem es rückwärts von Ihrem expliziten Haltepunkt arbeitet und jeden vorherigen Block in umgekehrter Reihenfolge überprüft. Dies stellt sicher, dass Sie den längstmöglichen Cache-Treffer erhalten.

3. **20-Block-Lookback-Fenster**: Das System prüft nur bis zu 20 Blöcke vor jedem expliziten `cache_control`-Haltepunkt. Nach 20 Überprüfungen ohne Treffer stoppt es die Überprüfung und wechselt zum nächsten expliziten Haltepunkt (falls vorhanden).

**Beispiel: Das Lookback-Fenster verstehen**

Betrachten Sie ein Gespräch mit 30 Inhaltsblöcken, bei dem Sie `cache_control` nur auf Block 30 setzen:

- **Wenn Sie Block 31 ohne Änderungen an vorherigen Blöcken senden**: Das System prüft Block 30 (Treffer!). Sie erhalten einen Cache-Treffer bei Block 30, und nur Block 31 muss verarbeitet werden.

- **Wenn Sie Block 25 ändern und Block 31 senden**: Das System prüft rückwärts von Block 30 → 29 → 28... → 25 (kein Treffer) → 24 (Treffer!). Da Block 24 nicht geändert wurde, erhalten Sie einen Cache-Treffer bei Block 24, und nur die Blöcke 25-30 müssen neu verarbeitet werden.

- **Wenn Sie Block 5 ändern und Block 31 senden**: Das System prüft rückwärts von Block 30 → 29 → 28... → 11 (Überprüfung #20). Nach 20 Überprüfungen ohne Treffer stoppt es die Suche. Da Block 5 außerhalb des 20-Block-Fensters liegt, tritt kein Cache-Treffer auf und alle Blöcke müssen neu verarbeitet werden. Wenn Sie jedoch einen expliziten `cache_control`-Haltepunkt auf Block 5 gesetzt hätten, würde das System weiterhin von diesem Haltepunkt aus prüfen: Block 5 (kein Treffer) → Block 4 (Treffer!). Dies ermöglicht einen Cache-Treffer bei Block 4, was zeigt, warum Sie Haltepunkte vor bearbeitbarem Inhalt platzieren sollten.

**Wichtigste Erkenntnis**: Setzen Sie immer einen expliziten Cache-Haltepunkt am Ende Ihres Gesprächs, um Ihre Chancen auf Cache-Treffer zu maximieren. Setzen Sie zusätzlich Haltepunkte direkt vor Inhaltsblöcke, die bearbeitet werden könnten, um sicherzustellen, dass diese Abschnitte unabhängig zwischengespeichert werden können.

#### Wann mehrere Haltepunkte verwendet werden sollten

Sie können bis zu 4 Cache-Haltepunkte definieren, wenn Sie möchten:
- Verschiedene Abschnitte zwischenspeichern, die sich mit unterschiedlichen Häufigkeiten ändern (z. B. Tools ändern sich selten, aber der Kontext wird täglich aktualisiert)
- Mehr Kontrolle darüber haben, was genau zwischengespeichert wird
- Caching für Inhalte sicherstellen, die mehr als 20 Blöcke vor Ihrem endgültigen Haltepunkt liegen
- Haltepunkte vor bearbeitbarem Inhalt platzieren, um Cache-Treffer zu garantieren, auch wenn Änderungen außerhalb des 20-Block-Fensters auftreten

<Note>
**Wichtige Einschränkung**: Wenn Ihr Prompt mehr als 20 Inhaltsblöcke vor Ihrem Cache-Haltepunkt hat und Sie Inhalte ändern, die früher als diese 20 Blöcke liegen, erhalten Sie keinen Cache-Treffer, es sei denn, Sie fügen zusätzliche explizite Haltepunkte näher an diesem Inhalt hinzu.
</Note>

### Cache-Einschränkungen
Die minimale zwischenspeicherbare Prompt-Länge beträgt:
- 4096 Token für Claude Opus 4.5
- 1024 Token für Claude Opus 4.1, Claude Opus 4, Claude Sonnet 4.5, Claude Sonnet 4, Claude Sonnet 3.7 ([veraltet](/docs/de/about-claude/model-deprecations)) und Claude Opus 3 ([veraltet](/docs/de/about-claude/model-deprecations))
- 4096 Token für Claude Haiku 4.5
- 2048 Token für Claude Haiku 3.5 und Claude Haiku 3

Kürzere Prompts können nicht zwischengespeichert werden, auch wenn sie mit `cache_control` gekennzeichnet sind. Alle Anfragen zum Zwischenspeichern von weniger als dieser Anzahl von Token werden ohne Caching verarbeitet. Um zu sehen, ob ein Prompt zwischengespeichert wurde, siehe die Antwort-Nutzungs-[Felder](/docs/de/build-with-claude/prompt-caching#tracking-cache-performance).

Beachten Sie bei gleichzeitigen Anfragen, dass ein Cache-Eintrag erst verfügbar wird, nachdem die erste Antwort beginnt. Wenn Sie Cache-Treffer für parallele Anfragen benötigen, warten Sie auf die erste Antwort, bevor Sie nachfolgende Anfragen senden.

Derzeit ist „ephemeral" der einzige unterstützte Cache-Typ, der standardmäßig eine Lebensdauer von 5 Minuten hat.

### Cache-Haltepunkt-Kosten verstehen

**Cache-Haltepunkte selbst verursachen keine Kosten.** Sie werden nur berechnet für:
- **Cache-Schreibvorgänge**: Wenn neuer Inhalt in den Cache geschrieben wird (25% mehr als Basis-Eingabe-Token für 5-Minuten-TTL)
- **Cache-Lesevorgänge**: Wenn zwischengespeicherter Inhalt verwendet wird (10% des Basis-Eingabe-Token-Preises)
- **Reguläre Eingabe-Token**: Für alle nicht zwischengespeicherten Inhalte

Das Hinzufügen weiterer `cache_control`-Haltepunkte erhöht Ihre Kosten nicht - Sie zahlen immer noch den gleichen Betrag basierend auf dem Inhalt, der tatsächlich zwischengespeichert und gelesen wird. Die Haltepunkte geben Ihnen einfach die Kontrolle darüber, welche Abschnitte unabhängig zwischengespeichert werden können.

### Was zwischengespeichert werden kann
Die meisten Blöcke in der Anfrage können mit `cache_control` zum Zwischenspeichern gekennzeichnet werden. Dies umfasst:

- Tools: Tool-Definitionen im `tools`-Array
- Systemnachrichten: Inhaltsblöcke im `system`-Array
- Textnachrichten: Inhaltsblöcke im `messages.content`-Array, sowohl für Benutzer- als auch für Assistent-Turns
- Bilder & Dokumente: Inhaltsblöcke im `messages.content`-Array, in Benutzer-Turns
- Tool-Nutzung und Tool-Ergebnisse: Inhaltsblöcke im `messages.content`-Array, sowohl in Benutzer- als auch in Assistent-Turns

Jedes dieser Elemente kann mit `cache_control` gekennzeichnet werden, um das Zwischenspeichern für diesen Teil der Anfrage zu aktivieren.

### Was nicht zwischengespeichert werden kann
Während die meisten Anfrage-Blöcke zwischengespeichert werden können, gibt es einige Ausnahmen:

- Thinking-Blöcke können nicht direkt mit `cache_control` zwischengespeichert werden. Thinking-Blöcke KÖNNEN jedoch zusammen mit anderen Inhalten zwischengespeichert werden, wenn sie in vorherigen Assistent-Turns erscheinen. Wenn sie auf diese Weise zwischengespeichert werden, zählen sie als Eingabe-Token, wenn sie aus dem Cache gelesen werden.
- Sub-Content-Blöcke (wie [Zitate](/docs/de/build-with-claude/citations)) können nicht direkt zwischengespeichert werden. Speichern Sie stattdessen den Top-Level-Block zwischen.

    Im Fall von Zitaten können die Top-Level-Dokumentinhalts-Blöcke, die als Quellmaterial für Zitate dienen, zwischengespeichert werden. Dies ermöglicht es Ihnen, Prompt-Caching effektiv mit Zitaten zu verwenden, indem Sie die Dokumente zwischenspeichern, auf die Zitate verweisen.
- Leere Textblöcke können nicht zwischengespeichert werden.

### Was den Cache ungültig macht

Änderungen an zwischengespeicherten Inhalten können einen Teil oder den gesamten Cache ungültig machen.

Wie in [Strukturierung Ihres Prompts](#structuring-your-prompt) beschrieben, folgt der Cache der Hierarchie: `tools` → `system` → `messages`. Änderungen auf jeder Ebene machen diese Ebene und alle nachfolgenden Ebenen ungültig.

Die folgende Tabelle zeigt, welche Teile des Cache durch verschiedene Arten von Änderungen ungültig gemacht werden. ✘ zeigt an, dass der Cache ungültig gemacht wird, während ✓ anzeigt, dass der Cache gültig bleibt.

| Was sich ändert | Tools-Cache | System-Cache | Messages-Cache | Auswirkung |
|------------|------------------|---------------|----------------|-------------|
| **Tool-Definitionen** | ✘ | ✘ | ✘ | Das Ändern von Tool-Definitionen (Namen, Beschreibungen, Parameter) macht den gesamten Cache ungültig |
| **Web-Suche-Umschalter** | ✓ | ✘ | ✘ | Das Aktivieren/Deaktivieren der Web-Suche ändert den System-Prompt |
| **Zitate-Umschalter** | ✓ | ✘ | ✘ | Das Aktivieren/Deaktivieren von Zitaten ändert den System-Prompt |
| **Tool-Auswahl** | ✓ | ✓ | ✘ | Änderungen am `tool_choice`-Parameter beeinflussen nur Message-Blöcke |
| **Bilder** | ✓ | ✓ | ✘ | Das Hinzufügen/Entfernen von Bildern überall im Prompt beeinflußt Message-Blöcke |
| **Thinking-Parameter** | ✓ | ✓ | ✘ | Änderungen an Extended-Thinking-Einstellungen (Aktivieren/Deaktivieren, Budget) beeinflussen Message-Blöcke |
| **Nicht-Tool-Ergebnisse, die an Extended-Thinking-Anfragen übergeben werden** | ✓ | ✓ | ✘ | Wenn Nicht-Tool-Ergebnisse in Anfragen übergeben werden, während Extended Thinking aktiviert ist, werden alle zuvor zwischengespeicherten Thinking-Blöcke aus dem Kontext entfernt, und alle Messages im Kontext, die diesen Thinking-Blöcken folgen, werden aus dem Cache entfernt. Weitere Details finden Sie unter [Caching mit Thinking-Blöcken](#caching-with-thinking-blocks). |

### Cache-Leistung verfolgen

Überwachen Sie die Cache-Leistung mit diesen API-Antwortfeldern, innerhalb von `usage` in der Antwort (oder `message_start`-Ereignis bei [Streaming](/docs/de/build-with-claude/streaming)):

- `cache_creation_input_tokens`: Anzahl der Token, die beim Erstellen eines neuen Eintrags in den Cache geschrieben werden.
- `cache_read_input_tokens`: Anzahl der Token, die für diese Anfrage aus dem Cache abgerufen werden.
- `input_tokens`: Anzahl der Eingabe-Token, die nicht aus dem Cache gelesen oder zum Erstellen eines Cache verwendet wurden (d. h. Token nach dem letzten Cache-Haltepunkt).

<Note>
**Token-Aufschlüsselung verstehen**

Das Feld `input_tokens` stellt nur die Token dar, die **nach dem letzten Cache-Haltepunkt** in Ihrer Anfrage kommen - nicht alle Eingabe-Token, die Sie gesendet haben.

Um die Gesamteingabe-Token zu berechnen:
```
total_input_tokens = cache_read_input_tokens + cache_creation_input_tokens + input_tokens
```

**Räumliche Erklärung:**
- `cache_read_input_tokens` = Token vor dem Haltepunkt bereits zwischengespeichert (Lesevorgänge)
- `cache_creation_input_tokens` = Token vor dem Haltepunkt, die jetzt zwischengespeichert werden (Schreibvorgänge)
- `input_tokens` = Token nach Ihrem letzten Haltepunkt (nicht für Cache berechtigt)

**Beispiel:** Wenn Sie eine Anfrage mit 100.000 Token zwischengespeichertem Inhalt (aus dem Cache gelesen), 0 Token neuem Inhalt, der zwischengespeichert wird, und 50 Token in Ihrer Benutzernachricht (nach dem Cache-Haltepunkt) haben:
- `cache_read_input_tokens`: 100.000
- `cache_creation_input_tokens`: 0
- `input_tokens`: 50
- **Gesamte verarbeitete Eingabe-Token**: 100.050 Token

Dies ist wichtig, um sowohl Kosten als auch Ratenlimits zu verstehen, da `input_tokens` bei effektiver Nutzung von Caching typischerweise viel kleiner als Ihre Gesamteingabe ist.
</Note>

### Best Practices für effektives Caching

Um die Prompt-Caching-Leistung zu optimieren:

- Speichern Sie stabile, wiederverwendbare Inhalte wie Systemanweisungen, Hintergrundinformationen, große Kontexte oder häufige Tool-Definitionen zwischen.
- Platzieren Sie zwischengespeicherte Inhalte am Anfang des Prompts für beste Leistung.
- Verwenden Sie Cache-Haltepunkte strategisch, um verschiedene zwischenspeicherbare Präfix-Abschnitte zu trennen.
- Setzen Sie Cache-Haltepunkte am Ende von Gesprächen und direkt vor bearbeitbarem Inhalt, um Cache-Trefferquoten zu maximieren, besonders wenn Sie mit Prompts arbeiten, die mehr als 20 Inhaltsblöcke haben.
- Analysieren Sie regelmäßig Cache-Trefferquoten und passen Sie Ihre Strategie nach Bedarf an.

### Optimierung für verschiedene Anwendungsfälle

Passen Sie Ihre Prompt-Caching-Strategie an Ihr Szenario an:

- Konversations-Agenten: Reduzieren Sie Kosten und Latenz für erweiterte Gespräche, besonders solche mit langen Anweisungen oder hochgeladenen Dokumenten.
- Coding-Assistenten: Verbessern Sie Autovervollständigung und Codebase-Q&A, indem Sie relevante Abschnitte oder eine zusammengefasste Version der Codebase im Prompt behalten.
- Große Dokumentenverarbeitung: Integrieren Sie vollständiges Langform-Material einschließlich Bilder in Ihren Prompt, ohne die Antwortlatenz zu erhöhen.
- Detaillierte Anweisungssätze: Teilen Sie umfangreiche Listen von Anweisungen, Verfahren und Beispielen, um Claudes Antworten zu verfeinern. Entwickler fügen normalerweise ein oder zwei Beispiele in den Prompt ein, aber mit Prompt-Caching können Sie noch bessere Leistung erzielen, indem Sie 20+ vielfältige Beispiele von hochwertigen Antworten einbeziehen.
- Agentic Tool-Nutzung: Verbessern Sie die Leistung für Szenarien mit mehreren Tool-Aufrufen und iterativen Code-Änderungen, bei denen jeder Schritt normalerweise einen neuen API-Aufruf erfordert.
- Sprechen Sie mit Büchern, Papieren, Dokumentation, Podcast-Transkripten und anderen Langform-Inhalten: Bringen Sie jede Wissensbasis zum Leben, indem Sie das/die gesamte(n) Dokument(e) in den Prompt einbetten und Benutzer es/sie befragen lassen.

### Behebung häufiger Probleme

Wenn Sie unerwartet Verhalten erleben:

- Stellen Sie sicher, dass zwischengespeicherte Abschnitte identisch sind und `cache_control` an den gleichen Stellen über Aufrufe hinweg gekennzeichnet sind
- Überprüfen Sie, dass Aufrufe innerhalb der Cache-Lebensdauer (standardmäßig 5 Minuten) erfolgen
- Überprüfen Sie, dass `tool_choice` und Bildnutzung zwischen Aufrufen konsistent bleiben
- Validieren Sie, dass Sie mindestens die minimale Anzahl von Token zwischenspeichern
- Das System prüft automatisch auf Cache-Treffer bei vorherigen Inhaltsblock-Grenzen (bis zu ~20 Blöcke vor Ihrem Haltepunkt). Für Prompts mit mehr als 20 Inhaltsblöcken benötigen Sie möglicherweise zusätzliche `cache_control`-Parameter früher im Prompt, um sicherzustellen, dass alle Inhalte zwischengespeichert werden können
- Überprüfen Sie, dass die Schlüssel in Ihren `tool_use`-Inhaltsblöcken eine stabile Reihenfolge haben, da einige Sprachen (z. B. Swift, Go) die Schlüsselreihenfolge während der JSON-Konvertierung randomisieren und Caches unterbrechen

<Note>
Änderungen an `tool_choice` oder dem Vorhandensein/Fehlen von Bildern überall im Prompt machen den Cache ungültig und erfordern die Erstellung eines neuen Cache-Eintrags. Weitere Details zur Cache-Ungültigmachung finden Sie unter [Was den Cache ungültig macht](#what-invalidates-the-cache).
</Note>

### Caching mit Thinking-Blöcken

Bei Verwendung von [Extended Thinking](/docs/de/build-with-claude/extended-thinking) mit Prompt-Caching haben Thinking-Blöcke ein spezielles Verhalten:

**Automatisches Caching zusammen mit anderen Inhalten**: Während Thinking-Blöcke nicht explizit mit `cache_control` gekennzeichnet werden können, werden sie als Teil des Anfrageinhalts zwischengespeichert, wenn Sie nachfolgende API-Aufrufe mit Tool-Ergebnissen tätigen. Dies geschieht häufig während der Tool-Nutzung, wenn Sie Thinking-Blöcke zurückgeben, um das Gespräch fortzusetzen.

**Eingabe-Token-Zählung**: Wenn Thinking-Blöcke aus dem Cache gelesen werden, zählen sie als Eingabe-Token in Ihren Nutzungsmetriken. Dies ist wichtig für die Kostenberechnung und Token-Budgetierung.

**Cache-Ungültigmachungsmuster**:
- Der Cache bleibt gültig, wenn nur Tool-Ergebnisse als Benutzernachrichten bereitgestellt werden
- Der Cache wird ungültig gemacht, wenn Nicht-Tool-Ergebnis-Benutzerinhalte hinzugefügt werden, was dazu führt, dass alle vorherigen Thinking-Blöcke entfernt werden
- Dieses Caching-Verhalten tritt auch ohne explizite `cache_control`-Markierungen auf

Weitere Details zur Cache-Ungültigmachung finden Sie unter [Was den Cache ungültig macht](#what-invalidates-the-cache).

**Beispiel mit Tool-Nutzung**:
```
Request 1: User: "What's the weather in Paris?"
Response: [thinking_block_1] + [tool_use block 1]

Request 2:
User: ["What's the weather in Paris?"],
Assistant: [thinking_block_1] + [tool_use block 1],
User: [tool_result_1, cache=True]
Response: [thinking_block_2] + [text block 2]
# Request 2 caches its request content (not the response)
# The cache includes: user message, thinking_block_1, tool_use block 1, and tool_result_1

Request 3:
User: ["What's the weather in Paris?"],
Assistant: [thinking_block_1] + [tool_use block 1],
User: [tool_result_1, cache=True],
Assistant: [thinking_block_2] + [text block 2],
User: [Text response, cache=True]
# Non-tool-result user block causes all thinking blocks to be ignored
# This request is processed as if thinking blocks were never present
```

Wenn ein Nicht-Tool-Ergebnis-Benutzerblock enthalten ist, kennzeichnet er eine neue Assistent-Schleife und alle vorherigen Thinking-Blöcke werden aus dem Kontext entfernt.

Weitere detaillierte Informationen finden Sie in der [Extended-Thinking-Dokumentation](/docs/de/build-with-claude/extended-thinking#understanding-thinking-block-caching-behavior).

---
## Cache-Speicherung und -Freigabe

- **Organisations-Isolation**: Caches sind zwischen Organisationen isoliert. Verschiedene Organisationen teilen sich niemals Caches, auch wenn sie identische Prompts verwenden.

- **Exakte Übereinstimmung**: Cache-Treffer erfordern 100% identische Prompt-Segmente, einschließlich aller Texte und Bilder bis zu und einschließlich des Blocks, der mit Cache-Kontrolle gekennzeichnet ist.

- **Ausgabe-Token-Generierung**: Prompt-Caching hat keine Auswirkung auf die Ausgabe-Token-Generierung. Die Antwort, die Sie erhalten, ist identisch mit dem, was Sie erhalten würden, wenn Prompt-Caching nicht verwendet würde.

---
## Cache-Dauer von 1 Stunde

Wenn Sie feststellen, dass 5 Minuten zu kurz sind, bietet Anthropic auch eine Cache-Dauer von 1 Stunde [gegen zusätzliche Kosten](#pricing) an.

Um den erweiterten Cache zu verwenden, fügen Sie `ttl` in die `cache_control`-Definition wie folgt ein:
```json
"cache_control": {
    "type": "ephemeral",
    "ttl": "5m" | "1h"
}
```

Die Antwort enthält detaillierte Cache-Informationen wie die folgende:
```json
{
    "usage": {
        "input_tokens": ...,
        "cache_read_input_tokens": ...,
        "cache_creation_input_tokens": ...,
        "output_tokens": ...,

        "cache_creation": {
            "ephemeral_5m_input_tokens": 456,
            "ephemeral_1h_input_tokens": 100,
        }
    }
}
```

Beachten Sie, dass das aktuelle Feld `cache_creation_input_tokens` der Summe der Werte im Objekt `cache_creation` entspricht.

### Wann der 1-Stunden-Cache verwendet werden sollte

Wenn Sie Prompts haben, die regelmäßig verwendet werden (d. h. System-Prompts, die häufiger als alle 5 Minuten verwendet werden), verwenden Sie weiterhin den 5-Minuten-Cache, da dieser kostenlos weiterhin aktualisiert wird.

Der 1-Stunden-Cache wird am besten in den folgenden Szenarien verwendet:
- Wenn Sie Prompts haben, die wahrscheinlich seltener als alle 5 Minuten, aber häufiger als jede Stunde verwendet werden. Zum Beispiel, wenn ein agentic Side-Agent länger als 5 Minuten dauert, oder wenn Sie ein langes Chat-Gespräch mit einem Benutzer speichern und Sie generell erwarten, dass dieser Benutzer möglicherweise nicht in den nächsten 5 Minuten antwortet.
- Wenn Latenz wichtig ist und Ihre nachfolgenden Prompts möglicherweise über 5 Minuten hinaus gesendet werden.
- Wenn Sie Ihre Ratenlimit-Auslastung verbessern möchten, da Cache-Treffer nicht gegen Ihr Ratenlimit abgezogen werden.

<Note>
Der 5-Minuten- und 1-Stunden-Cache verhalten sich gleich in Bezug auf Latenz. Sie werden generell verbessertes Time-to-First-Token für lange Dokumente sehen.
</Note>

### Mischen verschiedener TTLs

Sie können sowohl 1-Stunden- als auch 5-Minuten-Cache-Kontrollen in der gleichen Anfrage verwenden, aber mit einer wichtigen Einschränkung: Cache-Einträge mit längerer TTL müssen vor kürzeren TTLs erscheinen (d. h. ein 1-Stunden-Cache-Eintrag muss vor allen 5-Minuten-Cache-Einträgen erscheinen).

Beim Mischen von TTLs bestimmen wir drei Abrechnungspositionen in Ihrem Prompt:
1. Position `A`: Die Token-Anzahl beim höchsten Cache-Treffer (oder 0, wenn keine Treffer).
2. Position `B`: Die Token-Anzahl beim höchsten 1-Stunden-`cache_control`-Block nach `A` (oder gleich `A`, wenn keine vorhanden sind).
3. Position `C`: Die Token-Anzahl beim letzten `cache_control`-Block.

<Note>
Wenn `B` und/oder `C` größer als `A` sind, werden sie notwendigerweise Cache-Fehlschläge sein, da `A` der höchste Cache-Treffer ist.
</Note>

Sie werden berechnet für:
1. Cache-Lese-Token für `A`.
2. 1-Stunden-Cache-Schreib-Token für `(B - A)`.
3. 5-Minuten-Cache-Schreib-Token für `(C - B)`.

Hier sind 3 Beispiele. Dies zeigt die Eingabe-Token von 3 Anfragen, von denen jede unterschiedliche Cache-Treffer und Cache-Fehlschläge hat. Jede hat eine unterschiedliche berechnete Preisgestaltung, die in den farbigen Kästchen angezeigt wird.
![Mischen von TTLs Diagramm](/docs/images/prompt-cache-mixed-ttl.svg)

---

## Prompt-Caching-Beispiele

Um Ihnen den Einstieg in das Prompt-Caching zu erleichtern, haben wir ein [Prompt-Caching-Kochbuch](https://github.com/anthropics/anthropic-cookbook/blob/main/misc/prompt_caching.ipynb) mit detaillierten Beispielen und Best Practices vorbereitet.

Nachfolgend haben wir mehrere Code-Snippets eingefügt, die verschiedene Prompt-Caching-Muster zeigen. Diese Beispiele demonstrieren, wie Sie Caching in verschiedenen Szenarien implementieren und helfen Ihnen, die praktischen Anwendungen dieser Funktion zu verstehen:

<section title="Beispiel für großes Kontext-Caching">

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "system": [
        {
            "type": "text",
            "text": "You are an AI assistant tasked with analyzing legal documents."
        },
        {
            "type": "text",
            "text": "Here is the full text of a complex legal agreement: [Insert full text of a 50-page legal agreement here]",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    "messages": [
        {
            "role": "user",
            "content": "What are the key terms and conditions in this agreement?"
        }
    ]
}'
```

```python Python
import anthropic
client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": "You are an AI assistant tasked with analyzing legal documents."
        },
        {
            "type": "text",
            "text": "Here is the full text of a complex legal agreement: [Insert full text of a 50-page legal agreement here]",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        {
            "role": "user",
            "content": "What are the key terms and conditions in this agreement?"
        }
    ]
)
print(response.model_dump_json())
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  system: [
    {
        "type": "text",
        "text": "You are an AI assistant tasked with analyzing legal documents."
    },
    {
        "type": "text",
        "text": "Here is the full text of a complex legal agreement: [Insert full text of a 50-page legal agreement here]",
        "cache_control": {"type": "ephemeral"}
    }
  ],
  messages: [
    {
        "role": "user",
        "content": "What are the key terms and conditions in this agreement?"
    }
  ]
});
console.log(response);
```

```java Java
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;

public class LegalDocumentAnalysisExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                .systemOfTextBlockParams(List.of(
                        TextBlockParam.builder()
                                .text("You are an AI assistant tasked with analyzing legal documents.")
                                .build(),
                        TextBlockParam.builder()
                                .text("Here is the full text of a complex legal agreement: [Insert full text of a 50-page legal agreement here]")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build()
                ))
                .addUserMessage("What are the key terms and conditions in this agreement?")
                .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>
Dieses Beispiel demonstriert die grundlegende Verwendung von Prompt-Caching, wobei der vollständige Text der Rechtsvereinbarung als Präfix zwischengespeichert wird, während die Benutzeranweisung nicht zwischengespeichert wird.

Für die erste Anfrage:
- `input_tokens`: Anzahl der Token in der Benutzernachricht nur
- `cache_creation_input_tokens`: Anzahl der Token in der gesamten Systemnachricht, einschließlich des Rechtsdokuments
- `cache_read_input_tokens`: 0 (kein Cache-Hit bei der ersten Anfrage)

Für nachfolgende Anfragen innerhalb der Cache-Lebensdauer:
- `input_tokens`: Anzahl der Token in der Benutzernachricht nur
- `cache_creation_input_tokens`: 0 (keine neue Cache-Erstellung)
- `cache_read_input_tokens`: Anzahl der Token in der gesamten zwischengespeicherten Systemnachricht

</section>
<section title="Caching von Tool-Definitionen">

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "tools": [
        {
            "name": "get_weather",
            "description": "Get the current weather in a given location",
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "The city and state, e.g. San Francisco, CA"
                    },
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"],
                        "description": "The unit of temperature, either celsius or fahrenheit"
                    }
                },
                "required": ["location"]
            }
        },
        # many more tools
        {
            "name": "get_time",
            "description": "Get the current time in a given time zone",
            "input_schema": {
                "type": "object",
                "properties": {
                    "timezone": {
                        "type": "string",
                        "description": "The IANA time zone name, e.g. America/Los_Angeles"
                    }
                },
                "required": ["timezone"]
            },
            "cache_control": {"type": "ephemeral"}
        }
    ],
    "messages": [
        {
            "role": "user",
            "content": "What is the weather and time in New York?"
        }
    ]
}'
```

```python Python
import anthropic
client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[
        {
            "name": "get_weather",
            "description": "Get the current weather in a given location",
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "The city and state, e.g. San Francisco, CA"
                    },
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"],
                        "description": "The unit of temperature, either 'celsius' or 'fahrenheit'"
                    }
                },
                "required": ["location"]
            },
        },
        # many more tools
        {
            "name": "get_time",
            "description": "Get the current time in a given time zone",
            "input_schema": {
                "type": "object",
                "properties": {
                    "timezone": {
                        "type": "string",
                        "description": "The IANA time zone name, e.g. America/Los_Angeles"
                    }
                },
                "required": ["timezone"]
            },
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        {
            "role": "user",
            "content": "What's the weather and time in New York?"
        }
    ]
)
print(response.model_dump_json())
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    tools=[
        {
            "name": "get_weather",
            "description": "Get the current weather in a given location",
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "The city and state, e.g. San Francisco, CA"
                    },
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"],
                        "description": "The unit of temperature, either 'celsius' or 'fahrenheit'"
                    }
                },
                "required": ["location"]
            },
        },
        // many more tools
        {
            "name": "get_time",
            "description": "Get the current time in a given time zone",
            "input_schema": {
                "type": "object",
                "properties": {
                    "timezone": {
                        "type": "string",
                        "description": "The IANA time zone name, e.g. America/Los_Angeles"
                    }
                },
                "required": ["timezone"]
            },
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages: [
        {
            "role": "user",
            "content": "What's the weather and time in New York?"
        }
    ]
});
console.log(response);
```

```java Java
import java.util.List;
import java.util.Map;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.JsonValue;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.Tool;
import com.anthropic.models.messages.Tool.InputSchema;

public class ToolsWithCacheControlExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Weather tool schema
        InputSchema weatherSchema = InputSchema.builder()
                .properties(JsonValue.from(Map.of(
                        "location", Map.of(
                                "type", "string",
                                "description", "The city and state, e.g. San Francisco, CA"
                        ),
                        "unit", Map.of(
                                "type", "string",
                                "enum", List.of("celsius", "fahrenheit"),
                                "description", "The unit of temperature, either celsius or fahrenheit"
                        )
                )))
                .putAdditionalProperty("required", JsonValue.from(List.of("location")))
                .build();

        // Time tool schema
        InputSchema timeSchema = InputSchema.builder()
                .properties(JsonValue.from(Map.of(
                        "timezone", Map.of(
                                "type", "string",
                                "description", "The IANA time zone name, e.g. America/Los_Angeles"
                        )
                )))
                .putAdditionalProperty("required", JsonValue.from(List.of("timezone")))
                .build();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                .addTool(Tool.builder()
                        .name("get_weather")
                        .description("Get the current weather in a given location")
                        .inputSchema(weatherSchema)
                        .build())
                .addTool(Tool.builder()
                        .name("get_time")
                        .description("Get the current time in a given time zone")
                        .inputSchema(timeSchema)
                        .cacheControl(CacheControlEphemeral.builder().build())
                        .build())
                .addUserMessage("What is the weather and time in New York?")
                .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>

In diesem Beispiel demonstrieren wir das Caching von Tool-Definitionen.

Der `cache_control`-Parameter wird auf das letzte Tool (`get_time`) platziert, um alle Tools als Teil des statischen Präfix zu kennzeichnen.

Dies bedeutet, dass alle Tool-Definitionen, einschließlich `get_weather` und aller anderen Tools, die vor `get_time` definiert sind, als ein einzelnes Präfix zwischengespeichert werden.

Dieser Ansatz ist nützlich, wenn Sie einen konsistenten Satz von Tools haben, den Sie über mehrere Anfragen hinweg wiederverwenden möchten, ohne sie jedes Mal neu zu verarbeiten.

Für die erste Anfrage:
- `input_tokens`: Anzahl der Token in der Benutzernachricht
- `cache_creation_input_tokens`: Anzahl der Token in allen Tool-Definitionen und Systemaufforderung
- `cache_read_input_tokens`: 0 (kein Cache-Hit bei der ersten Anfrage)

Für nachfolgende Anfragen innerhalb der Cache-Lebensdauer:
- `input_tokens`: Anzahl der Token in der Benutzernachricht
- `cache_creation_input_tokens`: 0 (keine neue Cache-Erstellung)
- `cache_read_input_tokens`: Anzahl der Token in allen zwischengespeicherten Tool-Definitionen und Systemaufforderung

</section>

<section title="Fortsetzung einer mehrteiligen Konversation">

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "system": [
        {
            "type": "text",
            "text": "...long system prompt",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Hello, can you tell me more about the solar system?",
                }
            ]
        },
        {
            "role": "assistant",
            "content": "Certainly! The solar system is the collection of celestial bodies that orbit our Sun. It consists of eight planets, numerous moons, asteroids, comets, and other objects. The planets, in order from closest to farthest from the Sun, are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet has its own unique characteristics and features. Is there a specific aspect of the solar system you would like to know more about?"
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Good to know."
                },
                {
                    "type": "text",
                    "text": "Tell me more about Mars.",
                    "cache_control": {"type": "ephemeral"}
                }
            ]
        }
    ]
}'
```

```python Python
import anthropic
client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": "...long system prompt",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        # ...long conversation so far
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Hello, can you tell me more about the solar system?",
                }
            ]
        },
        {
            "role": "assistant",
            "content": "Certainly! The solar system is the collection of celestial bodies that orbit our Sun. It consists of eight planets, numerous moons, asteroids, comets, and other objects. The planets, in order from closest to farthest from the Sun, are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet has its own unique characteristics and features. Is there a specific aspect of the solar system you'd like to know more about?"
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Good to know."
                },
                {
                    "type": "text",
                    "text": "Tell me more about Mars.",
                    "cache_control": {"type": "ephemeral"}
                }
            ]
        }
    ]
)
print(response.model_dump_json())
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    system=[
        {
            "type": "text",
            "text": "...long system prompt",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        // ...long conversation so far
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Hello, can you tell me more about the solar system?",
                }
            ]
        },
        {
            "role": "assistant",
            "content": "Certainly! The solar system is the collection of celestial bodies that orbit our Sun. It consists of eight planets, numerous moons, asteroids, comets, and other objects. The planets, in order from closest to farthest from the Sun, are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet has its own unique characteristics and features. Is there a specific aspect of the solar system you'd like to know more about?"
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Good to know."
                },
                {
                    "type": "text",
                    "text": "Tell me more about Mars.",
                    "cache_control": {"type": "ephemeral"}
                }
            ]
        }
    ]
});
console.log(response);
```

```java Java
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.ContentBlockParam;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;

public class ConversationWithCacheControlExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Create ephemeral system prompt
        TextBlockParam systemPrompt = TextBlockParam.builder()
                .text("...long system prompt")
                .cacheControl(CacheControlEphemeral.builder().build())
                .build();

        // Create message params
        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                .systemOfTextBlockParams(List.of(systemPrompt))
                // First user message (without cache control)
                .addUserMessage("Hello, can you tell me more about the solar system?")
                // Assistant response
                .addAssistantMessage("Certainly! The solar system is the collection of celestial bodies that orbit our Sun. It consists of eight planets, numerous moons, asteroids, comets, and other objects. The planets, in order from closest to farthest from the Sun, are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet has its own unique characteristics and features. Is there a specific aspect of the solar system you would like to know more about?")
                // Second user message (with cache control)
                .addUserMessageOfBlockParams(List.of(
                        ContentBlockParam.ofText(TextBlockParam.builder()
                                .text("Good to know.")
                                .build()),
                        ContentBlockParam.ofText(TextBlockParam.builder()
                                .text("Tell me more about Mars.")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build())
                ))
                .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>

In diesem Beispiel demonstrieren wir, wie Sie Prompt-Caching in einer mehrteiligen Konversation verwenden.

Während jeder Runde markieren wir den letzten Block der letzten Nachricht mit `cache_control`, damit die Konversation inkrementell zwischengespeichert werden kann. Das System sucht automatisch nach der längsten zuvor zwischengespeicherten Sequenz von Blöcken für Folgeanfragen. Das heißt, Blöcke, die zuvor mit einem `cache_control`-Block markiert wurden, werden später nicht mit diesem markiert, aber sie werden dennoch als Cache-Hit (und auch als Cache-Aktualisierung!) berücksichtigt, wenn sie innerhalb von 5 Minuten getroffen werden.

Beachten Sie außerdem, dass der `cache_control`-Parameter auf der Systemnachricht platziert wird. Dies soll sicherstellen, dass die Systemnachricht, falls sie aus dem Cache entfernt wird (nachdem sie mehr als 5 Minuten lang nicht verwendet wurde), bei der nächsten Anfrage wieder in den Cache aufgenommen wird.

Dieser Ansatz ist nützlich, um den Kontext in laufenden Konversationen beizubehalten, ohne dieselben Informationen wiederholt zu verarbeiten.

Wenn dies richtig eingerichtet ist, sollten Sie in der Nutzungsantwort jeder Anfrage Folgendes sehen:
- `input_tokens`: Anzahl der Token in der neuen Benutzernachricht (wird minimal sein)
- `cache_creation_input_tokens`: Anzahl der Token in den neuen Assistent- und Benutzer-Runden
- `cache_read_input_tokens`: Anzahl der Token in der Konversation bis zur vorherigen Runde

</section>

<section title="Alles zusammen: Mehrere Cache-Breakpoints">

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "tools": [
        {
            "name": "search_documents",
            "description": "Search through the knowledge base",
            "input_schema": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Search query"
                    }
                },
                "required": ["query"]
            }
        },
        {
            "name": "get_document",
            "description": "Retrieve a specific document by ID",
            "input_schema": {
                "type": "object",
                "properties": {
                    "doc_id": {
                        "type": "string",
                        "description": "Document ID"
                    }
                },
                "required": ["doc_id"]
            },
            "cache_control": {"type": "ephemeral"}
        }
    ],
    "system": [
        {
            "type": "text",
            "text": "You are a helpful research assistant with access to a document knowledge base.\n\n# Instructions\n- Always search for relevant documents before answering\n- Provide citations for your sources\n- Be objective and accurate in your responses\n- If multiple documents contain relevant information, synthesize them\n- Acknowledge when information is not available in the knowledge base",
            "cache_control": {"type": "ephemeral"}
        },
        {
            "type": "text",
            "text": "# Knowledge Base Context\n\nHere are the relevant documents for this conversation:\n\n## Document 1: Solar System Overview\nThe solar system consists of the Sun and all objects that orbit it...\n\n## Document 2: Planetary Characteristics\nEach planet has unique features. Mercury is the smallest planet...\n\n## Document 3: Mars Exploration\nMars has been a target of exploration for decades...\n\n[Additional documents...]",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    "messages": [
        {
            "role": "user",
            "content": "Can you search for information about Mars rovers?"
        },
        {
            "role": "assistant",
            "content": [
                {
                    "type": "tool_use",
                    "id": "tool_1",
                    "name": "search_documents",
                    "input": {"query": "Mars rovers"}
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "tool_result",
                    "tool_use_id": "tool_1",
                    "content": "Found 3 relevant documents: Document 3 (Mars Exploration), Document 7 (Rover Technology), Document 9 (Mission History)"
                }
            ]
        },
        {
            "role": "assistant",
            "content": [
                {
                    "type": "text",
                    "text": "I found 3 relevant documents about Mars rovers. Let me get more details from the Mars Exploration document."
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Yes, please tell me about the Perseverance rover specifically.",
                    "cache_control": {"type": "ephemeral"}
                }
            ]
        }
    ]
}'
```

```python Python
import anthropic
client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[
        {
            "name": "search_documents",
            "description": "Search through the knowledge base",
            "input_schema": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Search query"
                    }
                },
                "required": ["query"]
            }
        },
        {
            "name": "get_document",
            "description": "Retrieve a specific document by ID",
            "input_schema": {
                "type": "object",
                "properties": {
                    "doc_id": {
                        "type": "string",
                        "description": "Document ID"
                    }
                },
                "required": ["doc_id"]
            },
            "cache_control": {"type": "ephemeral"}
        }
    ],
    system=[
        {
            "type": "text",
            "text": "You are a helpful research assistant with access to a document knowledge base.\n\n# Instructions\n- Always search for relevant documents before answering\n- Provide citations for your sources\n- Be objective and accurate in your responses\n- If multiple documents contain relevant information, synthesize them\n- Acknowledge when information is not available in the knowledge base",
            "cache_control": {"type": "ephemeral"}
        },
        {
            "type": "text",
            "text": "# Knowledge Base Context\n\nHere are the relevant documents for this conversation:\n\n## Document 1: Solar System Overview\nThe solar system consists of the Sun and all objects that orbit it...\n\n## Document 2: Planetary Characteristics\nEach planet has unique features. Mercury is the smallest planet...\n\n## Document 3: Mars Exploration\nMars has been a target of exploration for decades...\n\n[Additional documents...]",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        {
            "role": "user",
            "content": "Can you search for information about Mars rovers?"
        },
        {
            "role": "assistant",
            "content": [
                {
                    "type": "tool_use",
                    "id": "tool_1",
                    "name": "search_documents",
                    "input": {"query": "Mars rovers"}
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "tool_result",
                    "tool_use_id": "tool_1",
                    "content": "Found 3 relevant documents: Document 3 (Mars Exploration), Document 7 (Rover Technology), Document 9 (Mission History)"
                }
            ]
        },
        {
            "role": "assistant",
            "content": [
                {
                    "type": "text",
                    "text": "I found 3 relevant documents about Mars rovers. Let me get more details from the Mars Exploration document."
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Yes, please tell me about the Perseverance rover specifically.",
                    "cache_control": {"type": "ephemeral"}
                }
            ]
        }
    ]
)
print(response.model_dump_json())
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    tools: [
        {
            name: "search_documents",
            description: "Search through the knowledge base",
            input_schema: {
                type: "object",
                properties: {
                    query: {
                        type: "string",
                        description: "Search query"
                    }
                },
                required: ["query"]
            }
        },
        {
            name: "get_document",
            description: "Retrieve a specific document by ID",
            input_schema: {
                type: "object",
                properties: {
                    doc_id: {
                        type: "string",
                        description: "Document ID"
                    }
                },
                required: ["doc_id"]
            },
            cache_control: { type: "ephemeral" }
        }
    ],
    system: [
        {
            type: "text",
            text: "You are a helpful research assistant with access to a document knowledge base.\n\n# Instructions\n- Always search for relevant documents before answering\n- Provide citations for your sources\n- Be objective and accurate in your responses\n- If multiple documents contain relevant information, synthesize them\n- Acknowledge when information is not available in the knowledge base",
            cache_control: { type: "ephemeral" }
        },
        {
            type: "text",
            text: "# Knowledge Base Context\n\nHere are the relevant documents for this conversation:\n\n## Document 1: Solar System Overview\nThe solar system consists of the Sun and all objects that orbit it...\n\n## Document 2: Planetary Characteristics\nEach planet has unique features. Mercury is the smallest planet...\n\n## Document 3: Mars Exploration\nMars has been a target of exploration for decades...\n\n[Additional documents...]",
            cache_control: { type: "ephemeral" }
        }
    ],
    messages: [
        {
            role: "user",
            content: "Can you search for information about Mars rovers?"
        },
        {
            role: "assistant",
            content: [
                {
                    type: "tool_use",
                    id: "tool_1",
                    name: "search_documents",
                    input: { query: "Mars rovers" }
                }
            ]
        },
        {
            role: "user",
            content: [
                {
                    type: "tool_result",
                    tool_use_id: "tool_1",
                    content: "Found 3 relevant documents: Document 3 (Mars Exploration), Document 7 (Rover Technology), Document 9 (Mission History)"
                }
            ]
        },
        {
            role: "assistant",
            content: [
                {
                    type: "text",
                    text: "I found 3 relevant documents about Mars rovers. Let me get more details from the Mars Exploration document."
                }
            ]
        },
        {
            role: "user",
            content: [
                {
                    type: "text",
                    text: "Yes, please tell me about the Perseverance rover specifically.",
                    cache_control: { type: "ephemeral" }
                }
            ]
        }
    ]
});
console.log(response);
```

```java Java
import java.util.List;
import java.util.Map;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.JsonValue;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.ContentBlockParam;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;
import com.anthropic.models.messages.Tool;
import com.anthropic.models.messages.Tool.InputSchema;
import com.anthropic.models.messages.ToolResultBlockParam;
import com.anthropic.models.messages.ToolUseBlockParam;

public class MultipleCacheBreakpointsExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Search tool schema
        InputSchema searchSchema = InputSchema.builder()
                .properties(JsonValue.from(Map.of(
                        "query", Map.of(
                                "type", "string",
                                "description", "Search query"
                        )
                )))
                .putAdditionalProperty("required", JsonValue.from(List.of("query")))
                .build();

        // Get document tool schema
        InputSchema getDocSchema = InputSchema.builder()
                .properties(JsonValue.from(Map.of(
                        "doc_id", Map.of(
                                "type", "string",
                                "description", "Document ID"
                        )
                )))
                .putAdditionalProperty("required", JsonValue.from(List.of("doc_id")))
                .build();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                // Tools with cache control on the last one
                .addTool(Tool.builder()
                        .name("search_documents")
                        .description("Search through the knowledge base")
                        .inputSchema(searchSchema)
                        .build())
                .addTool(Tool.builder()
                        .name("get_document")
                        .description("Retrieve a specific document by ID")
                        .inputSchema(getDocSchema)
                        .cacheControl(CacheControlEphemeral.builder().build())
                        .build())
                // System prompts with cache control on instructions and context separately
                .systemOfTextBlockParams(List.of(
                        TextBlockParam.builder()
                                .text("You are a helpful research assistant with access to a document knowledge base.\n\n# Instructions\n- Always search for relevant documents before answering\n- Provide citations for your sources\n- Be objective and accurate in your responses\n- If multiple documents contain relevant information, synthesize them\n- Acknowledge when information is not available in the knowledge base")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build(),
                        TextBlockParam.builder()
                                .text("# Knowledge Base Context\n\nHere are the relevant documents for this conversation:\n\n## Document 1: Solar System Overview\nThe solar system consists of the Sun and all objects that orbit it...\n\n## Document 2: Planetary Characteristics\nEach planet has unique features. Mercury is the smallest planet...\n\n## Document 3: Mars Exploration\nMars has been a target of exploration for decades...\n\n[Additional documents...]")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build()
                ))
                // Conversation history
                .addUserMessage("Can you search for information about Mars rovers?")
                .addAssistantMessageOfBlockParams(List.of(
                        ContentBlockParam.ofToolUse(ToolUseBlockParam.builder()
                                .id("tool_1")
                                .name("search_documents")
                                .input(JsonValue.from(Map.of("query", "Mars rovers")))
                                .build())
                ))
                .addUserMessageOfBlockParams(List.of(
                        ContentBlockParam.ofToolResult(ToolResultBlockParam.builder()
                                .toolUseId("tool_1")
                                .content("Found 3 relevant documents: Document 3 (Mars Exploration), Document 7 (Rover Technology), Document 9 (Mission History)")
                                .build())
                ))
                .addAssistantMessageOfBlockParams(List.of(
                        ContentBlockParam.ofText(TextBlockParam.builder()
                                .text("I found 3 relevant documents about Mars rovers. Let me get more details from the Mars Exploration document.")
                                .build())
                ))
                .addUserMessageOfBlockParams(List.of(
                        ContentBlockParam.ofText(TextBlockParam.builder()
                                .text("Yes, please tell me about the Perseverance rover specifically.")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build())
                ))
                .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>

Dieses umfassende Beispiel demonstriert, wie Sie alle 4 verfügbaren Cache-Breakpoints verwenden, um verschiedene Teile Ihrer Aufforderung zu optimieren:

1. **Tools-Cache** (Cache-Breakpoint 1): Der `cache_control`-Parameter auf der letzten Tool-Definition speichert alle Tool-Definitionen zwischen.

2. **Cache für wiederverwendbare Anweisungen** (Cache-Breakpoint 2): Die statischen Anweisungen in der Systemaufforderung werden separat zwischengespeichert. Diese Anweisungen ändern sich selten zwischen Anfragen.

3. **RAG-Kontext-Cache** (Cache-Breakpoint 3): Die Wissensdatenbank-Dokumente werden unabhängig zwischengespeichert, sodass Sie die RAG-Dokumente aktualisieren können, ohne den Cache für Tools oder Anweisungen zu ungültig zu machen.

4. **Konversationsverlauf-Cache** (Cache-Breakpoint 4): Die Antwort des Assistenten wird mit `cache_control` markiert, um inkrementelles Caching der Konversation während ihres Fortschritts zu ermöglichen.

Dieser Ansatz bietet maximale Flexibilität:
- Wenn Sie nur die letzte Benutzernachricht aktualisieren, werden alle vier Cache-Segmente wiederverwendet
- Wenn Sie die RAG-Dokumente aktualisieren, aber die gleichen Tools und Anweisungen behalten, werden die ersten zwei Cache-Segmente wiederverwendet
- Wenn Sie die Konversation ändern, aber die gleichen Tools, Anweisungen und Dokumente behalten, werden die ersten drei Segmente wiederverwendet
- Jeder Cache-Breakpoint kann unabhängig ungültig gemacht werden, basierend darauf, was sich in Ihrer Anwendung ändert

Für die erste Anfrage:
- `input_tokens`: Token in der letzten Benutzernachricht
- `cache_creation_input_tokens`: Token in allen zwischengespeicherten Segmenten (Tools + Anweisungen + RAG-Dokumente + Konversationsverlauf)
- `cache_read_input_tokens`: 0 (keine Cache-Hits)

Für nachfolgende Anfragen mit nur einer neuen Benutzernachricht:
- `input_tokens`: Token in der neuen Benutzernachricht nur
- `cache_creation_input_tokens`: Alle neuen Token, die zum Konversationsverlauf hinzugefügt werden
- `cache_read_input_tokens`: Alle zuvor zwischengespeicherten Token (Tools + Anweisungen + RAG-Dokumente + vorherige Konversation)

Dieses Muster ist besonders leistungsstark für:
- RAG-Anwendungen mit großen Dokumentkontexten
- Agent-Systeme, die mehrere Tools verwenden
- Langfristige Konversationen, die Kontext beibehalten müssen
- Anwendungen, die verschiedene Teile der Aufforderung unabhängig optimieren müssen

</section>

---
## Häufig gestellte Fragen

  <section title="Benötige ich mehrere Cache-Breakpoints oder ist einer am Ende ausreichend?">

    **In den meisten Fällen ist ein einzelner Cache-Breakpoint am Ende Ihres statischen Inhalts ausreichend.** Das System sucht automatisch nach Cache-Hits an allen vorherigen Inhaltsblock-Grenzen (bis zu 20 Blöcke vor Ihrem Breakpoint) und verwendet die längste übereinstimmende Sequenz von zwischengespeicherten Blöcken.

    Sie benötigen mehrere Breakpoints nur, wenn:
    - Sie mehr als 20 Inhaltsblöcke vor Ihrem gewünschten Cache-Punkt haben
    - Sie Abschnitte zwischengespeichert möchten, die sich mit unterschiedlichen Häufigkeiten ändern
    - Sie explizite Kontrolle darüber benötigen, was für die Kostenoptimierung zwischengespeichert wird

    Beispiel: Wenn Sie Systemaufforderungen (ändern sich selten) und RAG-Kontext (ändert sich täglich) haben, könnten Sie zwei Breakpoints verwenden, um sie separat zwischengespeichert zu halten.
  
</section>

  <section title="Verursachen Cache-Breakpoints zusätzliche Kosten?">

    Nein, Cache-Breakpoints selbst sind kostenlos. Sie zahlen nur für:
    - Schreiben von Inhalten in den Cache (25% mehr als Basis-Input-Token für 5-Minuten-TTL)
    - Lesen aus dem Cache (10% des Basis-Input-Token-Preises)
    - Reguläre Input-Token für nicht zwischengespeicherte Inhalte

    Die Anzahl der Breakpoints beeinflusst die Preisgestaltung nicht - nur die Menge des zwischengespeicherten und gelesenen Inhalts ist relevant.
  
</section>

  <section title="Wie berechne ich die Gesamtzahl der Input-Token aus den Nutzungsfeldern?">

    Die Nutzungsantwort enthält drei separate Input-Token-Felder, die zusammen Ihren Gesamteingabe darstellen:

    ```
    total_input_tokens = cache_read_input_tokens + cache_creation_input_tokens + input_tokens
    ```

    - `cache_read_input_tokens`: Token, die aus dem Cache abgerufen werden (alles vor Cache-Breakpoints, das zwischengespeichert wurde)
    - `cache_creation_input_tokens`: Neue Token, die in den Cache geschrieben werden (an Cache-Breakpoints)
    - `input_tokens`: Token **nach dem letzten Cache-Breakpoint**, die nicht zwischengespeichert sind

    **Wichtig:** `input_tokens` stellt NICHT alle Input-Token dar - nur den Teil nach Ihrem letzten Cache-Breakpoint. Wenn Sie zwischengespeicherte Inhalte haben, wird `input_tokens` typischerweise viel kleiner sein als Ihre Gesamteingabe.

    **Beispiel:** Mit einem zwischengespeicherten 200K-Token-Dokument und einer 50-Token-Benutzerfrage:
    - `cache_read_input_tokens`: 200.000
    - `cache_creation_input_tokens`: 0
    - `input_tokens`: 50
    - **Gesamt**: 200.050 Token

    Diese Aufschlüsselung ist entscheidend für das Verständnis sowohl Ihrer Kosten als auch Ihrer Rate-Limit-Nutzung. Weitere Informationen finden Sie unter [Tracking cache performance](#tracking-cache-performance).
  
</section>

  <section title="Wie lange ist die Cache-Lebensdauer?">

    Die Standard-Mindestlebensdauer (TTL) des Caches beträgt 5 Minuten. Diese Lebensdauer wird jedes Mal aktualisiert, wenn der zwischengespeicherte Inhalt verwendet wird.

    Wenn Sie feststellen, dass 5 Minuten zu kurz sind, bietet Anthropic auch eine [1-Stunden-Cache-TTL](#1-hour-cache-duration).
  
</section>

  <section title="Wie viele Cache-Breakpoints kann ich verwenden?">

    Sie können bis zu 4 Cache-Breakpoints (mit `cache_control`-Parametern) in Ihrer Aufforderung definieren.
  
</section>

  <section title="Ist Prompt-Caching für alle Modelle verfügbar?">

    Nein, Prompt-Caching ist derzeit nur für Claude Opus 4.5, Claude Opus 4.1, Claude Opus 4, Claude Sonnet 4.5, Claude Sonnet 4, Claude Sonnet 3.7 ([veraltet](/docs/de/about-claude/model-deprecations)), Claude Haiku 4.5, Claude Haiku 3.5, Claude Haiku 3 und Claude Opus 3 ([veraltet](/docs/de/about-claude/model-deprecations)) verfügbar.
  
</section>

  <section title="Wie funktioniert Prompt-Caching mit erweitertem Denken?">

    Zwischengespeicherte Systemaufforderungen und Tools werden wiederverwendet, wenn sich die Denkparameter ändern. Allerdings werden Denkänderungen (Aktivieren/Deaktivieren oder Budgetänderungen) zuvor zwischengespeicherte Aufforderungspräfixe mit Nachrichteninhalten ungültig machen.

    Weitere Details zur Cache-Ungültigmachung finden Sie unter [What invalidates the cache](#what-invalidates-the-cache).

    Weitere Informationen zum erweiterten Denken, einschließlich seiner Interaktion mit Tool-Verwendung und Prompt-Caching, finden Sie in der [Dokumentation zum erweiterten Denken](/docs/de/build-with-claude/extended-thinking#extended-thinking-and-prompt-caching).
  
</section>

  <section title="Wie aktiviere ich Prompt-Caching?">

    Um Prompt-Caching zu aktivieren, fügen Sie mindestens einen `cache_control`-Breakpoint in Ihre API-Anfrage ein.
  
</section>

  <section title="Kann ich Prompt-Caching mit anderen API-Funktionen verwenden?">

    Ja, Prompt-Caching kann zusammen mit anderen API-Funktionen wie Tool-Verwendung und Vision-Funktionen verwendet werden. Allerdings wird der Cache unterbrochen, wenn Sie ändern, ob Bilder in einer Aufforderung vorhanden sind, oder wenn Sie Tool-Verwendungseinstellungen ändern.

    Weitere Details zur Cache-Ungültigmachung finden Sie unter [What invalidates the cache](#what-invalidates-the-cache).
  
</section>

  <section title="Wie beeinflusst Prompt-Caching die Preisgestaltung?">

    Prompt-Caching führt eine neue Preisstruktur ein, bei der Cache-Schreibvorgänge 25% mehr kosten als Basis-Input-Token, während Cache-Hits nur 10% des Basis-Input-Token-Preises kosten.
  
</section>

  <section title="Kann ich den Cache manuell löschen?">

    Derzeit gibt es keine Möglichkeit, den Cache manuell zu löschen. Zwischengespeicherte Präfixe verfallen automatisch nach einer Mindestdauer von 5 Minuten Inaktivität.
  
</section>

  <section title="Wie kann ich die Effektivität meiner Caching-Strategie verfolgen?">

    Sie können die Cache-Leistung mithilfe der Felder `cache_creation_input_tokens` und `cache_read_input_tokens` in der API-Antwort überwachen.
  
</section>

  <section title="Was kann den Cache unterbrechen?">

    Weitere Details zur Cache-Ungültigmachung finden Sie unter [What invalidates the cache](#what-invalidates-the-cache), einschließlich einer Liste von Änderungen, die das Erstellen eines neuen Cache-Eintrags erfordern.
  
</section>

  <section title="Wie behandelt Prompt-Caching Datenschutz und Datentrennung?">

Prompt-Caching ist mit starken Datenschutz- und Datentrennung-Maßnahmen konzipiert:

1. Cache-Schlüssel werden mithilfe eines kryptografischen Hash der Aufforderungen bis zum Cache-Kontrollpunkt generiert. Dies bedeutet, dass nur Anfragen mit identischen Aufforderungen auf einen bestimmten Cache zugreifen können.

2. Caches sind organisationsspezifisch. Benutzer innerhalb derselben Organisation können auf denselben Cache zugreifen, wenn sie identische Aufforderungen verwenden, aber Caches werden nicht über verschiedene Organisationen hinweg geteilt, auch nicht für identische Aufforderungen.

3. Der Caching-Mechanismus ist so konzipiert, dass die Integrität und der Datenschutz jedes eindeutigen Gesprächs oder Kontexts gewährleistet werden.

4. Es ist sicher, `cache_control` überall in Ihren Aufforderungen zu verwenden. Für Kosteneffizienz ist es besser, hochvariable Teile (z. B. beliebige Eingaben des Benutzers) vom Caching auszuschließen.

Diese Maßnahmen stellen sicher, dass Prompt-Caching den Datenschutz und die Sicherheit aufrechterhält und gleichzeitig Leistungsvorteile bietet.
  
</section>
  <section title="Kann ich Prompt-Caching mit der Batches-API verwenden?">

    Ja, es ist möglich, Prompt-Caching mit Ihren [Batches-API](/docs/de/build-with-claude/batch-processing)-Anfragen zu verwenden. Da asynchrone Batch-Anfragen jedoch gleichzeitig und in beliebiger Reihenfolge verarbeitet werden können, werden Cache-Hits auf Best-Effort-Basis bereitgestellt.

    Der [1-Stunden-Cache](#1-hour-cache-duration) kann Ihre Cache-Hits verbessern. Die kostengünstigste Verwendungsweise ist die folgende:
    - Sammeln Sie einen Satz von Nachrichtenanfragen, die ein gemeinsames Präfix haben.
    - Senden Sie eine Batch-Anfrage mit nur einer Anfrage, die dieses gemeinsame Präfix und einen 1-Stunden-Cache-Block hat. Dies wird in den 1-Stunden-Cache geschrieben.
    - Sobald dies abgeschlossen ist, senden Sie die restlichen Anfragen. Sie müssen den Job überwachen, um zu wissen, wann er abgeschlossen ist.

    Dies ist typischerweise besser als die Verwendung des 5-Minuten-Caches, einfach weil es üblich ist, dass Batch-Anfragen zwischen 5 Minuten und 1 Stunde dauern. Wir erwägen Möglichkeiten, diese Cache-Hit-Raten zu verbessern und diesen Prozess unkomplizierter zu gestalten.
  
</section>
  <section title="Warum sehe ich den Fehler `AttributeError: 'Beta' object has no attribute 'prompt_caching'` in Python?">

  Dieser Fehler tritt typischerweise auf, wenn Sie Ihr SDK aktualisiert haben oder veraltete Code-Beispiele verwenden. Prompt-Caching ist jetzt allgemein verfügbar, daher benötigen Sie das Beta-Präfix nicht mehr. Anstelle von:
    <CodeGroup>
      ```python Python
      python client.beta.prompt_caching.messages.create(...)
      ```
    </CodeGroup>
    Verwenden Sie einfach:
    <CodeGroup>
      ```python Python
      python client.messages.create(...)
      ```
    </CodeGroup>
  
</section>
  <section title="Warum sehe ich 'TypeError: Cannot read properties of undefined (reading 'messages')'?">

  Dieser Fehler tritt typischerweise auf, wenn Sie Ihr SDK aktualisiert haben oder veraltete Code-Beispiele verwenden. Prompt-Caching ist jetzt allgemein verfügbar, daher benötigen Sie das Beta-Präfix nicht mehr. Anstelle von:

      ```typescript TypeScript
      client.beta.promptCaching.messages.create(...)
      ```

      Verwenden Sie einfach:

      ```typescript
      client.messages.create(...)
      ```
  
</section>