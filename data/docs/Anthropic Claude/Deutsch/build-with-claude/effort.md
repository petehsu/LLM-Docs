# Effort

Kontrollieren Sie, wie viele Token Claude bei der Antwort mit dem Effort-Parameter verwendet, und wägen Sie zwischen Gründlichkeit der Antwort und Token-Effizienz ab.

---

Der Effort-Parameter ermöglicht es Ihnen zu kontrollieren, wie bereitwillig Claude Token bei der Beantwortung von Anfragen ausgibt. Dies gibt Ihnen die Möglichkeit, zwischen Gründlichkeit der Antwort und Token-Effizienz abzuwägen, alles mit einem einzigen Modell.

<Note>
  Der Effort-Parameter befindet sich derzeit in der Beta-Phase und wird nur von Claude Opus 4.5 unterstützt.

  Sie müssen den [Beta-Header](/docs/de/api/beta-headers) `effort-2025-11-24` einschließen, wenn Sie diese Funktion verwenden.
</Note>

## Wie Effort funktioniert

Standardmäßig verwendet Claude maximale Anstrengung – gibt so viele Token aus, wie für das bestmögliche Ergebnis erforderlich sind. Durch Reduzierung der Effort-Stufe können Sie Claude anweisen, sparsamer mit der Token-Nutzung umzugehen und die Geschwindigkeit und Kosten zu optimieren, während Sie eine gewisse Verringerung der Leistungsfähigkeit akzeptieren.

<Tip>
Das Setzen von `effort` auf `"high"` erzeugt genau das gleiche Verhalten wie das Weglassen des `effort`-Parameters vollständig.
</Tip>

Der Effort-Parameter beeinflusst **alle Token** in der Antwort, einschließlich:

- Textantworten und Erklärungen
- Tool-Aufrufe und Funktionsargumente
- Erweitertes Denken (wenn aktiviert)

Dieser Ansatz hat zwei große Vorteile:

1. Es ist nicht erforderlich, dass Denken aktiviert ist, um es zu verwenden.
2. Es kann alle Token-Ausgaben beeinflussen, einschließlich Tool-Aufrufe. Zum Beispiel würde niedrigere Anstrengung bedeuten, dass Claude weniger Tool-Aufrufe macht. Dies gibt einen viel größeren Grad an Kontrolle über die Effizienz.

### Effort-Stufen

| Stufe    | Beschreibung                                                                                                                      | Typischer Anwendungsfall                                                                      |
| -------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `high`   | Maximale Leistungsfähigkeit. Claude verwendet so viele Token wie nötig für das bestmögliche Ergebnis. Entspricht dem Nicht-Setzen des Parameters.  | Komplexes Denken, schwierige Codierungsprobleme, agentengestützte Aufgaben                           |
| `medium` | Ausgewogener Ansatz mit moderaten Token-Einsparungen. | Agentengestützte Aufgaben, die ein Gleichgewicht zwischen Geschwindigkeit, Kosten und Leistung erfordern                                                         |
| `low`    | Am effizientesten. Erhebliche Token-Einsparungen mit einiger Leistungsverringerung. | Einfachere Aufgaben, die die beste Geschwindigkeit und niedrigste Kosten benötigen, wie z. B. Subagenten                     |

## Grundlegende Verwendung

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-opus-4-5-20251101",
    betas=["effort-2025-11-24"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Analyze the trade-offs between microservices and monolithic architectures"
    }],
    output_config={
        "effort": "medium"
    }
)

print(response.content[0].text)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.beta.messages.create({
  model: "claude-opus-4-5-20251101",
  betas: ["effort-2025-11-24"],
  max_tokens: 4096,
  messages: [{
    role: "user",
    content: "Analyze the trade-offs between microservices and monolithic architectures"
  }],
  output_config: {
    effort: "medium"
  }
});

console.log(response.content[0].text);
```

```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: effort-2025-11-24" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-opus-4-5-20251101",
        "max_tokens": 4096,
        "messages": [{
            "role": "user",
            "content": "Analyze the trade-offs between microservices and monolithic architectures"
        }],
        "output_config": {
            "effort": "medium"
        }
    }'
```

</CodeGroup>

## Wann sollte ich den Effort-Parameter anpassen?

- Verwenden Sie **high effort** (die Standardeinstellung), wenn Sie Claudes beste Arbeit benötigen – komplexes Denken, differenzierte Analyse, schwierige Codierungsprobleme oder jede Aufgabe, bei der Qualität die oberste Priorität ist.
- Verwenden Sie **medium effort** als ausgewogene Option, wenn Sie eine solide Leistung ohne die volle Token-Ausgabe von high effort wünschen.
- Verwenden Sie **low effort**, wenn Sie Geschwindigkeit optimieren (weil Claude mit weniger Token antwortet) oder Kosten – zum Beispiel einfache Klassifizierungsaufgaben, schnelle Nachschlagungen oder Anwendungsfälle mit hohem Volumen, bei denen marginale Qualitätsverbesserungen keine zusätzliche Latenz oder Ausgaben rechtfertigen.

## Effort mit Tool-Nutzung

Bei der Verwendung von Tools beeinflusst der Effort-Parameter sowohl die Erklärungen um Tool-Aufrufe als auch die Tool-Aufrufe selbst. Niedrigere Effort-Stufen neigen dazu zu:

- Mehrere Operationen in weniger Tool-Aufrufe kombinieren
- Weniger Tool-Aufrufe machen
- Direkt zur Aktion übergehen ohne Präambel
- Knappe Bestätigungsmeldungen nach Abschluss verwenden

Höhere Effort-Stufen können:

- Mehr Tool-Aufrufe machen
- Den Plan vor der Aktion erklären
- Detaillierte Zusammenfassungen von Änderungen bereitstellen
- Umfassendere Code-Kommentare enthalten

## Effort mit erweitertem Denken

Der Effort-Parameter funktioniert zusammen mit dem Thinking-Token-Budget, wenn erweitertes Denken aktiviert ist. Diese beiden Steuerelemente dienen unterschiedlichen Zwecken:

- **Effort-Parameter**: Kontrolliert, wie Claude alle Token ausgibt – einschließlich Thinking-Tokens, Textantworten und Tool-Aufrufe
- **Thinking-Token-Budget**: Legt eine maximale Grenze für Thinking-Tokens speziell fest

Der Effort-Parameter kann mit oder ohne aktiviertes erweitertes Denken verwendet werden. Wenn beide konfiguriert sind:

1. Bestimmen Sie zunächst die für Ihre Aufgabe geeignete Effort-Stufe
2. Legen Sie dann das Thinking-Token-Budget basierend auf der Aufgabenkomplexität fest

Für beste Leistung bei komplexen Denkaufgaben verwenden Sie high effort (die Standardeinstellung) mit einem hohen Thinking-Token-Budget. Dies ermöglicht Claude, gründlich zu denken und umfassende Antworten zu geben.

## Best Practices

1. **Beginnen Sie mit high**: Verwenden Sie niedrigere Effort-Stufen, um Leistung gegen Token-Effizienz abzuwägen.
2. **Verwenden Sie low für geschwindigkeitssensitive oder einfache Aufgaben**: Wenn Latenz wichtig ist oder Aufgaben unkompliziert sind, kann low effort die Antwortzeiten und Kosten erheblich reduzieren.
3. **Testen Sie Ihren Anwendungsfall**: Die Auswirkung von Effort-Stufen variiert je nach Aufgabentyp. Bewerten Sie die Leistung bei Ihren spezifischen Anwendungsfällen, bevor Sie sie bereitstellen.
4. **Erwägen Sie dynamische Anstrengung**: Passen Sie die Anstrengung basierend auf der Aufgabenkomplexität an. Einfache Abfragen können niedrige Anstrengung rechtfertigen, während agentengestützte Codierung und komplexes Denken von hoher Anstrengung profitieren.