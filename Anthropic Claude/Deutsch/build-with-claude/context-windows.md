# Kontextfenster

Verstehen Sie, wie Kontextfenster funktionieren und wie Sie sie effektiv mit Claude nutzen können.

---

## Das Kontextfenster verstehen

Das „Kontextfenster" bezieht sich auf die Gesamtmenge des Textes, auf den ein Sprachmodell zurückblicken und verweisen kann, wenn es neuen Text generiert, plus den neuen Text, den es generiert. Dies unterscheidet sich vom großen Datenbestand, auf dem das Sprachmodell trainiert wurde, und stellt stattdessen einen „Arbeitsspeicher" für das Modell dar. Ein größeres Kontextfenster ermöglicht es dem Modell, komplexere und längere Eingabeaufforderungen zu verstehen und darauf zu reagieren, während ein kleineres Kontextfenster die Fähigkeit des Modells, längere Eingabeaufforderungen zu verarbeiten oder die Kohärenz über längere Konversationen hinweg zu bewahren, einschränken kann.

Das folgende Diagramm zeigt das standardmäßige Kontextfensterverhalten für API-Anfragen<sup>1</sup>:

![Kontextfenster-Diagramm](/docs/images/context-window.svg)

_<sup>1</sup>Für Chat-Schnittstellen, wie z. B. für [claude.ai](https://claude.ai/), können Kontextfenster auch auf einem rollierenden „First-In-First-Out"-System eingerichtet werden._

* **Progressive Token-Akkumulation:** Mit dem Fortschreiten der Konversation durch Turns sammeln sich jede Benutzernachricht und jede Assistentenantwort im Kontextfenster an. Vorherige Turns werden vollständig beibehalten.
* **Lineares Wachstumsmuster:** Die Kontextnutzung wächst linear mit jedem Turn, wobei vorherige Turns vollständig beibehalten werden.
* **200K-Token-Kapazität:** Das verfügbare Gesamtkontextfenster (200.000 Token) stellt die maximale Kapazität zum Speichern von Konversationsverlauf und zum Generieren neuer Ausgaben von Claude dar.
* **Input-Output-Fluss:** Jeder Turn besteht aus:
  - **Input-Phase:** Enthält den gesamten vorherigen Konversationsverlauf plus die aktuelle Benutzernachricht
  - **Output-Phase:** Generiert eine Textantwort, die Teil einer zukünftigen Eingabe wird

## Das Kontextfenster mit erweitertem Denken

Bei Verwendung von [erweitertem Denken](/docs/de/build-with-claude/extended-thinking) zählen alle Input- und Output-Token, einschließlich der Token, die zum Denken verwendet werden, zum Kontextfensterlimit, mit einigen Nuancen in Multi-Turn-Situationen.

Die Denk-Budget-Token sind eine Teilmenge Ihres `max_tokens`-Parameters, werden als Output-Token abgerechnet und zählen zu den Ratenlimits.

Allerdings werden vorherige Denk-Blöcke automatisch von der Claude-API aus der Kontextfensterberechnung entfernt und sind nicht Teil des Konversationsverlaufs, den das Modell für nachfolgende Turns „sieht", wodurch Token-Kapazität für tatsächliche Konversationsinhalte erhalten bleibt.

Das folgende Diagramm zeigt die spezialisierte Token-Verwaltung, wenn erweitertes Denken aktiviert ist:

![Kontextfenster-Diagramm mit erweitertem Denken](/docs/images/context-window-thinking.svg)

* **Entfernen von erweitertem Denken:** Blöcke mit erweitertem Denken (in dunkelgrau dargestellt) werden während der Output-Phase jedes Turns generiert, **werden aber nicht als Input-Token für nachfolgende Turns weitergeleitet**. Sie müssen die Denk-Blöcke nicht selbst entfernen. Die Claude-API macht dies automatisch für Sie, wenn Sie sie zurückgeben.
* **Technische Implementierungsdetails:**
  - Die API schließt automatisch Denk-Blöcke aus vorherigen Turns aus, wenn Sie diese als Teil des Konversationsverlaufs zurückgeben.
  - Token für erweitertes Denken werden nur einmal als Output-Token abgerechnet, während ihrer Generierung.
  - Die effektive Kontextfensterberechnung wird zu: `context_window = (input_tokens - previous_thinking_tokens) + current_turn_tokens`.
  - Denk-Token umfassen sowohl `thinking`-Blöcke als auch `redacted_thinking`-Blöcke.

Diese Architektur ist Token-effizient und ermöglicht umfangreiches Denken ohne Token-Verschwendung, da Denk-Blöcke erhebliche Länge haben können.

<Note>
Sie können mehr über das Kontextfenster und erweitertes Denken in unserem [Leitfaden zum erweiterten Denken](/docs/de/build-with-claude/extended-thinking) lesen.
</Note>

## Das Kontextfenster mit erweitertem Denken und Tool-Nutzung

Das folgende Diagramm zeigt die Kontextfenster-Token-Verwaltung beim Kombinieren von erweitertem Denken mit Tool-Nutzung:

![Kontextfenster-Diagramm mit erweitertem Denken und Tool-Nutzung](/docs/images/context-window-thinking-tools.svg)

<Steps>
  <Step title="Architektur des ersten Turns">
    - **Input-Komponenten:** Tools-Konfiguration und Benutzernachricht
    - **Output-Komponenten:** Erweitertes Denken + Textantwort + Tool-Nutzungsanfrage
    - **Token-Berechnung:** Alle Input- und Output-Komponenten zählen zum Kontextfenster, und alle Output-Komponenten werden als Output-Token abgerechnet.
  </Step>
  <Step title="Tool-Ergebnis-Handling (Turn 2)">
    - **Input-Komponenten:** Jeder Block aus dem ersten Turn sowie das `tool_result`. Der Denk-Block mit erweitertem Denken **muss** mit den entsprechenden Tool-Ergebnissen zurückgegeben werden. Dies ist der einzige Fall, in dem Sie **Denk-Blöcke zurückgeben müssen**.
    - **Output-Komponenten:** Nachdem Tool-Ergebnisse an Claude zurückgegeben wurden, antwortet Claude nur mit Text (kein zusätzliches erweitertes Denken bis zur nächsten `user`-Nachricht).
    - **Token-Berechnung:** Alle Input- und Output-Komponenten zählen zum Kontextfenster, und alle Output-Komponenten werden als Output-Token abgerechnet.
  </Step>
  <Step title="Dritter Schritt">
    - **Input-Komponenten:** Alle Eingaben und die Ausgabe aus dem vorherigen Turn werden weitergeleitet, mit Ausnahme des Denk-Blocks, der jetzt gelöscht werden kann, nachdem Claude den gesamten Tool-Nutzungs-Zyklus abgeschlossen hat. Die API entfernt den Denk-Block automatisch für Sie, wenn Sie ihn zurückgeben, oder Sie können ihn in dieser Phase selbst löschen. Dies ist auch der Ort, an dem Sie den nächsten `User`-Turn hinzufügen würden.
    - **Output-Komponenten:** Da es einen neuen `User`-Turn außerhalb des Tool-Nutzungs-Zyklus gibt, generiert Claude einen neuen Denk-Block mit erweitertem Denken und setzt von dort aus fort.
    - **Token-Berechnung:** Vorherige Denk-Token werden automatisch aus Kontextfensterberechnungen entfernt. Alle anderen vorherigen Blöcke zählen immer noch als Teil des Token-Fensters, und der Denk-Block im aktuellen `Assistant`-Turn zählt als Teil des Kontextfensters.
  </Step>
</Steps>

* **Überlegungen zur Tool-Nutzung mit erweitertem Denken:**
  - Beim Posten von Tool-Ergebnissen muss der gesamte unveränderte Denk-Block, der diese spezifische Tool-Anfrage begleitet (einschließlich Signatur-/redigierten Teilen), enthalten sein.
  - Die effektive Kontextfensterberechnung für erweitertes Denken mit Tool-Nutzung wird zu: `context_window = input_tokens + current_turn_tokens`.
  - Das System verwendet kryptografische Signaturen, um die Authentizität von Denk-Blöcken zu überprüfen. Das Versäumnis, Denk-Blöcke während der Tool-Nutzung zu bewahren, kann Claudes Denk-Kontinuität unterbrechen. Wenn Sie also Denk-Blöcke ändern, gibt die API einen Fehler zurück.

<Note>
Claude 4-Modelle unterstützen [verschachteltes Denken](/docs/de/build-with-claude/extended-thinking#interleaved-thinking), das es Claude ermöglicht, zwischen Tool-Aufrufen zu denken und nach dem Empfang von Tool-Ergebnissen anspruchsvolleres Denken durchzuführen.

Claude Sonnet 3.7 unterstützt kein verschachteltes Denken, daher gibt es keine Verschachtelung von erweitertem Denken und Tool-Aufrufen ohne einen nicht-`tool_result`-User-Turn dazwischen.

Weitere Informationen zur Verwendung von Tools mit erweitertem Denken finden Sie in unserem [Leitfaden zum erweiterten Denken](/docs/de/build-with-claude/extended-thinking#extended-thinking-with-tool-use).
</Note>

## 1M-Token-Kontextfenster

Claude Sonnet 4 und 4.5 unterstützen ein 1-Million-Token-Kontextfenster. Dieses erweiterte Kontextfenster ermöglicht es Ihnen, viel größere Dokumente zu verarbeiten, längere Konversationen zu führen und mit umfangreicheren Codebasen zu arbeiten.

<Note>
Das 1M-Token-Kontextfenster befindet sich derzeit in der Beta-Phase für Organisationen in [Nutzungsstufe](/docs/de/api/rate-limits) 4 und Organisationen mit benutzerdefinierten Ratenlimits. Das 1M-Token-Kontextfenster ist nur für Claude Sonnet 4 und Sonnet 4.5 verfügbar.
</Note>

Um das 1M-Token-Kontextfenster zu verwenden, fügen Sie den `context-1m-2025-08-07` [Beta-Header](/docs/de/api/beta-headers) in Ihre API-Anfragen ein:

<CodeGroup>

```python Python
from anthropic import Anthropic

client = Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Process this large document..."}
    ],
    betas=["context-1m-2025-08-07"]
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const msg = await anthropic.beta.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 1024,
  messages: [
    { role: 'user', content: 'Process this large document...' }
  ],
  betas: ['context-1m-2025-08-07']
});
```

```bash cURL
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: context-1m-2025-08-07" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "Process this large document..."}
    ]
  }'
```

</CodeGroup>

**Wichtige Überlegungen:**
- **Beta-Status**: Dies ist eine Beta-Funktion, die Änderungen unterliegt. Funktionen und Preise können in zukünftigen Versionen geändert oder entfernt werden.
- **Anforderung an Nutzungsstufe**: Das 1M-Token-Kontextfenster ist für Organisationen in [Nutzungsstufe](/docs/de/api/rate-limits) 4 und Organisationen mit benutzerdefinierten Ratenlimits verfügbar. Organisationen mit niedrigerer Stufe müssen auf Nutzungsstufe 4 aufsteigen, um auf diese Funktion zuzugreifen.
- **Verfügbarkeit**: Das 1M-Token-Kontextfenster ist derzeit auf der Claude-API, [Microsoft Foundry](/docs/de/build-with-claude/claude-in-microsoft-foundry), [Amazon Bedrock](/docs/de/build-with-claude/claude-on-amazon-bedrock) und [Google Cloud's Vertex AI](/docs/de/build-with-claude/claude-on-vertex-ai) verfügbar.
- **Preisgestaltung**: Anfragen, die 200K Token überschreiten, werden automatisch zu Premium-Sätzen abgerechnet (2x Input, 1,5x Output-Preise). Weitere Informationen finden Sie in der [Preisdokumentation](/docs/de/about-claude/pricing#long-context-pricing).
- **Ratenlimits**: Anfragen mit langem Kontext haben dedizierte Ratenlimits. Weitere Informationen finden Sie in der [Ratenlimit-Dokumentation](/docs/de/api/rate-limits#long-context-rate-limits).
- **Multimodale Überlegungen**: Beachten Sie bei der Verarbeitung einer großen Anzahl von Bildern oder PDFs, dass die Dateien in der Token-Nutzung variieren können. Wenn Sie eine große Eingabeaufforderung mit einer großen Anzahl von Bildern kombinieren, können Sie auf [Anfragegrößenlimits](/docs/de/api/overview#request-size-limits) stoßen.

## Kontextbewusstsein in Claude Sonnet 4.5 und Haiku 4.5

Claude Sonnet 4.5 und Claude Haiku 4.5 verfügen über **Kontextbewusstsein**, das es diesen Modellen ermöglicht, ihr verbleibendes Kontextfenster (d. h. „Token-Budget") während einer Konversation zu verfolgen. Dies ermöglicht es Claude, Aufgaben auszuführen und den Kontext effektiver zu verwalten, indem es versteht, wie viel Platz es zur Verfügung hat. Claude ist nativ darauf trainiert, dieses Kontextbewusstsein genau zu nutzen, um bei der Aufgabe bis zum sehr Ende zu bleiben, anstatt raten zu müssen, wie viele Token verbleiben. Für ein Modell ist das Fehlen von Kontextbewusstsein wie das Antreten in einer Kochshow ohne Uhr. Claude 4.5-Modelle ändern dies, indem sie das Modell explizit über sein verbleibendes Kontextfenster informieren, damit es die verfügbaren Token maximal nutzen kann.

**So funktioniert es:**

Zu Beginn einer Konversation erhält Claude Informationen über sein Gesamtkontextfenster:

```
<budget:token_budget>200000</budget:token_budget>
```

Das Budget ist auf 200K Token (Standard), 500K Token (Claude.ai Enterprise) oder 1M Token (Beta, für berechtigte Organisationen) eingestellt.

Nach jedem Tool-Aufruf erhält Claude eine Aktualisierung der verbleibenden Kapazität:

```
<system_warning>Token usage: 35000/200000; 165000 remaining</system_warning>
```

Dieses Bewusstsein hilft Claude zu bestimmen, wie viel Kapazität für die Arbeit verbleibt, und ermöglicht eine effektivere Ausführung bei langfristigen Aufgaben. Bild-Token sind in diesen Budgets enthalten.

**Vorteile:**

Kontextbewusstsein ist besonders wertvoll für:
- Langfristige Agent-Sitzungen, die anhaltende Aufmerksamkeit erfordern
- Multi-Kontextfenster-Workflows, bei denen Zustandsübergänge wichtig sind
- Komplexe Aufgaben, die sorgfältige Token-Verwaltung erfordern

Für Eingabeaufforderungs-Leitlinien zur Nutzung von Kontextbewusstsein siehe unseren [Claude 4 Best Practices Guide](/docs/de/build-with-claude/prompt-engineering/claude-4-best-practices#context-awareness-and-multi-window-workflows).

## Kontextfenster-Verwaltung mit neueren Claude-Modellen

Bei neueren Claude-Modellen (ab Claude Sonnet 3.7) gibt das System einen Validierungsfehler zurück, wenn die Summe von Eingabe-Token und Ausgabe-Token das Kontextfenster des Modells überschreitet, anstatt den Kontext stillschweigend zu kürzen. Diese Änderung bietet vorhersagbareres Verhalten, erfordert aber sorgfältigere Token-Verwaltung.

Um Ihre Token-Nutzung zu planen und sicherzustellen, dass Sie innerhalb der Kontextfensterlimits bleiben, können Sie die [Token-Counting-API](/docs/de/build-with-claude/token-counting) verwenden, um zu schätzen, wie viele Token Ihre Nachrichten verwenden werden, bevor Sie sie an Claude senden.

Siehe unsere [Modellvergleich](/docs/de/about-claude/models/overview#model-comparison-table)-Tabelle für eine Liste der Kontextfenstergrößen nach Modell.

# Nächste Schritte
<CardGroup cols={2}>
  <Card title="Modellvergleichstabelle" icon="scales" href="/docs/de/about-claude/models/overview#model-comparison-table">
    Siehe unsere Modellvergleichstabelle für eine Liste der Kontextfenstergrößen und Input-/Output-Token-Preise nach Modell.
  </Card>
  <Card title="Übersicht über erweitertes Denken" icon="settings" href="/docs/de/build-with-claude/extended-thinking">
    Erfahren Sie mehr darüber, wie erweitertes Denken funktioniert und wie Sie es zusammen mit anderen Funktionen wie Tool-Nutzung und Prompt-Caching implementieren.
  </Card>
</CardGroup>