# Modellübersicht

Claude ist eine Familie hochmoderner großer Sprachmodelle, die von Anthropic entwickelt wurden. Dieser Leitfaden stellt unsere Modelle vor und vergleicht ihre Leistung.

---

## Auswahl eines Modells

Wenn Sie unsicher sind, welches Modell Sie verwenden sollen, empfehlen wir, mit **Claude Sonnet 4.5** zu beginnen. Es bietet die beste Balance zwischen Intelligenz, Geschwindigkeit und Kosten für die meisten Anwendungsfälle, mit außergewöhnlicher Leistung bei Codierungs- und agentengesteuerten Aufgaben.

Alle aktuellen Claude-Modelle unterstützen Text- und Bildeingaben, Textausgabe, mehrsprachige Funktionen und Vision. Modelle sind über die Anthropic API, AWS Bedrock und Google Vertex AI verfügbar.

Nachdem Sie ein Modell ausgewählt haben, [erfahren Sie, wie Sie Ihren ersten API-Aufruf tätigen](/docs/de/get-started).

### Vergleich der neuesten Modelle

| Feature | Claude Sonnet 4.5 | Claude Haiku 4.5 | Claude Opus 4.5 |
|:--------|:------------------|:-----------------|:----------------|
| **Beschreibung** | Unser intelligentes Modell für komplexe Agenten und Codierung | Unser schnellstes Modell mit nahezu Frontier-Intelligenz | Premium-Modell, das maximale Intelligenz mit praktischer Leistung kombiniert |
| **Claude API ID** | claude-sonnet-4-5-20250929 | claude-haiku-4-5-20251001 | claude-opus-4-5-20251101 |
| **Claude API Alias**<sup>1</sup> | claude-sonnet-4-5 | claude-haiku-4-5 | claude-opus-4-5 |
| **AWS Bedrock ID** | anthropic.claude-sonnet-4-5-20250929-v1:0 | anthropic.claude-haiku-4-5-20251001-v1:0 | anthropic.claude-opus-4-5-20251101-v1:0 |
| **GCP Vertex AI ID** | claude-sonnet-4-5@20250929 | claude-haiku-4-5@20251001 | claude-opus-4-5@20251101 |
| **Preisgestaltung**<sup>2</sup> | \$3 / Input MTok<br/>\$15 / Output MTok | \$1 / Input MTok<br/>\$5 / Output MTok | \$5 / Input MTok<br/>\$25 / Output MTok |
| **[Extended Thinking](/docs/de/build-with-claude/extended-thinking)** | Ja | Ja | Ja |
| **[Priority Tier](/docs/de/api/service-tiers)** | Ja | Ja | Ja |
| **Vergleichende Latenz** | Schnell | Am schnellsten | Moderat |
| **Kontextfenster** | <Tooltip tooltipContent="~150K Wörter \ ~680K Unicode-Zeichen">200K Token</Tooltip> / <br/> <Tooltip tooltipContent="~750K Wörter \ ~3,4M Unicode-Zeichen">1M Token</Tooltip> (Beta)<sup>3</sup> | <Tooltip tooltipContent="~150K Wörter \ ~680K Unicode-Zeichen">200K Token</Tooltip> | <Tooltip tooltipContent="~150K Wörter \ ~680K Unicode-Zeichen">200K Token</Tooltip> |
| **Max. Ausgabe** | 64K Token | 64K Token | 64K Token |
| **Zuverlässiger Wissensstichtag** | Jan 2025<sup>4</sup> | Feb 2025 | Mai 2025<sup>4</sup> |
| **Trainingsdaten-Stichtag** | Jul 2025 | Jul 2025 | Aug 2025 |

_<sup>1 - Aliase verweisen automatisch auf den neuesten Modell-Snapshot. Wenn wir neue Modell-Snapshots veröffentlichen, migrieren wir Aliase, um auf die neueste Version eines Modells zu verweisen, normalerweise innerhalb einer Woche nach der neuen Veröffentlichung. Während Aliase für Experimente nützlich sind, empfehlen wir, spezifische Modellversionen (z. B. `claude-sonnet-4-5-20250929`) in Produktionsanwendungen zu verwenden, um konsistentes Verhalten zu gewährleisten.</sup>_

_<sup>2 - Siehe unsere [Preisseite](/docs/de/about-claude/pricing) für vollständige Preisinformationen, einschließlich Batch-API-Rabatten, Prompt-Caching-Raten, Extended-Thinking-Kosten und Vision-Verarbeitungsgebühren.</sup>_

_<sup>3 - Claude Sonnet 4.5 unterstützt ein [1M-Token-Kontextfenster](/docs/de/build-with-claude/context-windows#1m-token-context-window) bei Verwendung des `context-1m-2025-08-07` Beta-Headers. [Long-Context-Preisgestaltung](/docs/de/about-claude/pricing#long-context-pricing) gilt für Anfragen, die 200K Token überschreiten.</sup>_

_<sup>4 - **Zuverlässiger Wissensstichtag** gibt das Datum an, bis zu dem das Wissen eines Modells am umfassendsten und zuverlässigsten ist. **Trainingsdaten-Stichtag** ist der breitere Datumsbereich der verwendeten Trainingsdaten. Zum Beispiel wurde Claude Sonnet 4.5 mit öffentlich verfügbaren Informationen bis Juli 2025 trainiert, aber sein Wissen ist am umfassendsten und zuverlässigsten bis Januar 2025. Weitere Informationen finden Sie im [Anthropic Transparency Hub](https://www.anthropic.com/transparency).</sup>_

<Note>Modelle mit demselben Snapshot-Datum (z. B. 20240620) sind auf allen Plattformen identisch und ändern sich nicht. Das Snapshot-Datum im Modellnamen gewährleistet Konsistenz und ermöglicht es Entwicklern, sich auf stabile Leistung in verschiedenen Umgebungen zu verlassen.</Note>

<Note>Ab **Claude Sonnet 4.5 und allen zukünftigen Modellen** bieten AWS Bedrock und Google Vertex AI zwei Endpunkt-Typen: **globale Endpunkte** (dynamisches Routing für maximale Verfügbarkeit) und **regionale Endpunkte** (garantiertes Daten-Routing durch spezifische geografische Regionen). Weitere Informationen finden Sie im [Abschnitt zur Preisgestaltung von Drittanbieter-Plattformen](/docs/de/about-claude/pricing#third-party-platform-pricing).</Note>

<section title="Legacy-Modelle">

Die folgenden Modelle sind noch verfügbar, aber wir empfehlen, zu aktuellen Modellen zu migrieren, um eine verbesserte Leistung zu erzielen:

| Feature | Claude Opus 4.1 | Claude Sonnet 4 | Claude Sonnet 3.7 | Claude Opus 4 | Claude Haiku 3.5 | Claude Haiku 3 |
|:--------|:----------------|:----------------|:------------------|:--------------|:-----------------|:---------------|
| **Claude API ID** | claude-opus-4-1-20250805 | claude-sonnet-4-20250514 | claude-3-7-sonnet-20250219 | claude-opus-4-20250514 | claude-3-5-haiku-20241022 | claude-3-haiku-20240307 |
| **Claude API Alias** | claude-opus-4-1 | claude-sonnet-4-0 | claude-3-7-sonnet-latest | claude-opus-4-0 | claude-3-5-haiku-latest | — |
| **AWS Bedrock ID** | anthropic.claude-opus-4-1-20250805-v1:0 | anthropic.claude-sonnet-4-20250514-v1:0 | anthropic.claude-3-7-sonnet-20250219-v1:0 | anthropic.claude-opus-4-20250514-v1:0 | anthropic.claude-3-5-haiku-20241022-v1:0 | anthropic.claude-3-haiku-20240307-v1:0 |
| **GCP Vertex AI ID** | claude-opus-4-1@20250805 | claude-sonnet-4@20250514 | claude-3-7-sonnet@20250219 | claude-opus-4@20250514 | claude-3-5-haiku@20241022 | claude-3-haiku@20240307 |
| **Preisgestaltung** | \$15 / Input MTok<br/>\$75 / Output MTok | \$3 / Input MTok<br/>\$15 / Output MTok | \$3 / Input MTok<br/>\$15 / Output MTok | \$15 / Input MTok<br/>\$75 / Output MTok | \$0,80 / Input MTok<br/>\$4 / Output MTok | \$0,25 / Input MTok<br/>\$1,25 / Output MTok |
| **[Extended Thinking](/docs/de/build-with-claude/extended-thinking)** | Ja | Ja | Ja | Ja | Nein | Nein |
| **[Priority Tier](/docs/de/api/service-tiers)** | Ja | Ja | Ja | Ja | Ja | Nein |
| **Vergleichende Latenz** | Moderat | Schnell | Schnell | Moderat | Am schnellsten | Schnell |
| **Kontextfenster** | <Tooltip tooltipContent="~150K Wörter \ ~680K Unicode-Zeichen">200K Token</Tooltip> | <Tooltip tooltipContent="~150K Wörter \ ~680K Unicode-Zeichen">200K Token</Tooltip> / <br/> <Tooltip tooltipContent="~750K Wörter \ ~3,4M Unicode-Zeichen">1M Token</Tooltip> (Beta)<sup>1</sup> | <Tooltip tooltipContent="~150K Wörter \ ~680K Unicode-Zeichen">200K Token</Tooltip> | <Tooltip tooltipContent="~150K Wörter \ ~680K Unicode-Zeichen">200K Token</Tooltip> | <Tooltip tooltipContent="~150K Wörter \ ~215K Unicode-Zeichen">200K Token</Tooltip> | <Tooltip tooltipContent="~150K Wörter \ ~680K Unicode-Zeichen">200K Token</Tooltip> |
| **Max. Ausgabe** | 32K Token | 64K Token | 64K Token / 128K Token (Beta)<sup>4</sup> | 32K Token | 8K Token | 4K Token |
| **Zuverlässiger Wissensstichtag** | Jan 2025<sup>2</sup> | Jan 2025<sup>2</sup> | Okt 2024<sup>2</sup> | Jan 2025<sup>2</sup> | <sup>3</sup> | <sup>3</sup> |
| **Trainingsdaten-Stichtag** | Mär 2025 | Mär 2025 | Nov 2024 | Mär 2025 | Jul 2024 | Aug 2023 |

_<sup>1 - Claude Sonnet 4 unterstützt ein [1M-Token-Kontextfenster](/docs/de/build-with-claude/context-windows#1m-token-context-window) bei Verwendung des `context-1m-2025-08-07` Beta-Headers. [Long-Context-Preisgestaltung](/docs/de/about-claude/pricing#long-context-pricing) gilt für Anfragen, die 200K Token überschreiten.</sup>_

_<sup>2 - **Zuverlässiger Wissensstichtag** gibt das Datum an, bis zu dem das Wissen eines Modells am umfassendsten und zuverlässigsten ist. **Trainingsdaten-Stichtag** ist der breitere Datumsbereich der verwendeten Trainingsdaten.</sup>_

_<sup>3 - Einige Haiku-Modelle haben ein einzelnes Trainingsdaten-Stichtag-Datum.</sup>_

_<sup>4 - Fügen Sie den Beta-Header `output-128k-2025-02-19` in Ihre API-Anfrage ein, um die maximale Ausgabe-Token-Länge auf 128K Token für Claude Sonnet 3.7 zu erhöhen. Wir empfehlen dringend, unsere [Streaming Messages API](/docs/de/build-with-claude/streaming) zu verwenden, um Timeouts bei der Generierung längerer Ausgaben zu vermeiden. Weitere Details finden Sie in unserer Anleitung zu [langen Anfragen](/docs/de/api/errors#long-requests).</sup>_

</section>

## Leistung von Eingabeaufforderungen und Ausgaben

Claude 4 Modelle zeichnen sich aus durch:
- **Leistung**: Top-Tier-Ergebnisse bei Reasoning, Codierung, mehrsprachigen Aufgaben, Long-Context-Verarbeitung, Ehrlichkeit und Bildverarbeitung. Weitere Informationen finden Sie im [Claude 4 Blog-Beitrag](http://www.anthropic.com/news/claude-4).
- **Ansprechende Antworten**: Claude-Modelle sind ideal für Anwendungen, die reichhaltige, menschenähnliche Interaktionen erfordern.

    - Wenn Sie prägnantere Antworten bevorzugen, können Sie Ihre Eingabeaufforderungen anpassen, um das Modell zur gewünschten Ausgabelänge zu führen. Weitere Informationen finden Sie in unseren [Prompt-Engineering-Leitfäden](/docs/de/build-with-claude/prompt-engineering).
    - Spezifische Best Practices für Claude 4 Prompting finden Sie in unserem [Claude 4 Best Practices Leitfaden](/docs/de/build-with-claude/prompt-engineering/claude-4-best-practices).
- **Ausgabequalität**: Bei der Migration von früheren Modellgenerationen zu Claude 4 können Sie größere Verbesserungen in der Gesamtleistung feststellen.

## Migration zu Claude 4.5

Wenn Sie derzeit Claude 3 Modelle verwenden, empfehlen wir, zu Claude 4.5 zu migrieren, um von verbesserter Intelligenz und erweiterten Funktionen zu profitieren. Detaillierte Migrationsanweisungen finden Sie unter [Migration zu Claude 4.5](/docs/de/about-claude/models/migrating-to-claude-4).

## Erste Schritte mit Claude

Wenn Sie bereit sind, zu erkunden, was Claude für Sie tun kann, lassen Sie uns eintauchen! Egal ob Sie ein Entwickler sind, der Claude in Ihre Anwendungen integrieren möchte, oder ein Benutzer, der die Kraft von KI aus erster Hand erleben möchte, wir haben alles für Sie.

<Note>Möchten Sie mit Claude chatten? Besuchen Sie [claude.ai](http://www.claude.ai)!</Note>

<CardGroup cols={3}>
  <Card title="Einführung in Claude" icon="check" href="/docs/de/intro">
    Erkunden Sie Claudes Funktionen und Entwicklungsfluss.
  </Card>
  <Card title="Schnellstart" icon="lightning" href="/docs/de/get-started">
    Erfahren Sie, wie Sie in wenigen Minuten Ihren ersten API-Aufruf tätigen.
  </Card>
  <Card title="Claude Console" icon="code" href="/">
    Erstellen und testen Sie leistungsstarke Eingabeaufforderungen direkt in Ihrem Browser.
  </Card>
</CardGroup>

Wenn Sie Fragen haben oder Unterstützung benötigen, zögern Sie nicht, unser [Support-Team](https://support.claude.com/) zu kontaktieren oder die [Discord-Community](https://www.anthropic.com/discord) zu konsultieren.