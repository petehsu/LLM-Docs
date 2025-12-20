# Claude Developer Platform

Aktualisierungen der Claude Developer Platform, einschließlich der Claude API, Client-SDKs und der Claude Console.

---

<Tip>
Informationen zu Versionshinweisen für Claude Apps finden Sie unter [Versionshinweise für Claude Apps im Claude Help Center](https://support.claude.com/en/articles/12138966-release-notes).

Informationen zu Updates für Claude Code finden Sie in der [vollständigen CHANGELOG.md](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md) im Repository `claude-code`.
</Tip>

### 4. Dezember 2025
- [Strukturierte Ausgaben](/docs/de/build-with-claude/structured-outputs) unterstützen jetzt Claude Haiku 4.5.

### 24. November 2025
- Wir haben [Claude Opus 4.5](https://www.anthropic.com/news/claude-opus-4-5) gestartet, unser intelligentestes Modell, das maximale Leistung mit praktischer Effizienz kombiniert. Ideal für komplexe spezialisierte Aufgaben, professionelle Softwareentwicklung und fortgeschrittene Agenten. Bietet Sprungverbesserungen bei Vision, Coding und Computer Use zu einem zugänglicheren Preis als frühere Opus-Modelle. Weitere Informationen finden Sie in unserer [Dokumentation zu Modellen & Preisen](/docs/de/about-claude/models).
- Wir haben [programmatisches Tool-Aufrufen](/docs/de/agents-and-tools/tool-use/programmatic-tool-calling) in der öffentlichen Beta gestartet, das Claude ermöglicht, Tools aus der Code-Ausführung heraus aufzurufen, um Latenz und Token-Nutzung in Multi-Tool-Workflows zu reduzieren.
- Wir haben das [Tool-Suchtool](/docs/de/agents-and-tools/tool-use/tool-search-tool) in der öffentlichen Beta gestartet, das Claude ermöglicht, Tools dynamisch zu entdecken und bei Bedarf aus großen Tool-Katalogen zu laden.
- Wir haben den [Effort-Parameter](/docs/de/build-with-claude/effort) in der öffentlichen Beta für Claude Opus 4.5 gestartet, mit dem Sie die Token-Nutzung steuern können, indem Sie zwischen Antwortgründlichkeit und Effizienz abwägen.
- Wir haben [Client-seitige Komprimierung](/docs/de/build-with-claude/context-editing#client-side-compaction-sdk) zu unseren Python- und TypeScript-SDKs hinzugefügt, die automatisch den Gesprächskontext durch Zusammenfassung verwalten, wenn Sie `tool_runner` verwenden.

### 21. November 2025
- Sucherergebnis-Inhaltsblöcke sind jetzt allgemein auf Amazon Bedrock verfügbar. Weitere Informationen finden Sie in unserer [Dokumentation zu Suchergebnissen](/docs/de/build-with-claude/search-results).

### 19. November 2025
- Wir haben eine **neue Dokumentationsplattform** unter [platform.claude.com/docs](https://platform.claude.com/docs) gestartet. Unsere Dokumentation befindet sich jetzt neben der Claude Console und bietet eine einheitliche Entwicklererfahrung. Die vorherige Dokumentationsseite unter docs.claude.com wird auf den neuen Standort weitergeleitet.

### 18. November 2025
- Wir haben **Claude in Microsoft Foundry** gestartet und bringen Claude-Modelle zu Azure-Kunden mit Azure-Abrechnung und OAuth-Authentifizierung. Greifen Sie auf die vollständige Messages API zu, einschließlich erweitertes Denken, Prompt-Caching (5-Minuten und 1-Stunde), PDF-Unterstützung, Files API, Agent Skills und Tool-Nutzung. Weitere Informationen finden Sie in unserer [Dokumentation zu Microsoft Foundry](/docs/de/build-with-claude/claude-in-microsoft-foundry).

### 14. November 2025
- Wir haben [strukturierte Ausgaben](/docs/de/build-with-claude/structured-outputs) in der öffentlichen Beta gestartet und bieten garantierte Schema-Konformität für Antworten von Claude. Verwenden Sie JSON-Ausgaben für strukturierte Datenausgaben oder striktes Tool-Verwenden für validierte Tool-Eingaben. Verfügbar für Claude Sonnet 4.5 und Claude Opus 4.1. Verwenden Sie zum Aktivieren den Beta-Header `structured-outputs-2025-11-13`.

### 28. Oktober 2025
- Wir kündigten die Einstellung des Claude Sonnet 3.7-Modells an. Weitere Informationen finden Sie in [unserer Dokumentation](/docs/de/about-claude/model-deprecations).
- Wir haben die Claude Sonnet 3.5-Modelle eingestellt. Alle Anfragen an diese Modelle geben jetzt einen Fehler zurück.
- Wir haben die Kontextbearbeitung mit Thinking-Block-Löschen (`clear_thinking_20251015`) erweitert, was die automatische Verwaltung von Thinking-Blöcken ermöglicht. Weitere Informationen finden Sie in unserer [Dokumentation zur Kontextbearbeitung](/docs/de/build-with-claude/context-editing).

### 16. Oktober 2025
- Wir haben [Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) (`skills-2025-10-02` Beta) gestartet, eine neue Möglichkeit, die Fähigkeiten von Claude zu erweitern. Skills sind organisierte Ordner mit Anweisungen, Skripten und Ressourcen, die Claude dynamisch lädt, um spezialisierte Aufgaben auszuführen. Die erste Version umfasst:
  - **Von Anthropic verwaltete Skills**: Vorgefertigte Skills für die Arbeit mit PowerPoint (.pptx), Excel (.xlsx), Word (.docx) und PDF-Dateien
  - **Benutzerdefinierte Skills**: Laden Sie Ihre eigenen Skills über die Skills API (`/v1/skills` Endpunkte) hoch, um Fachwissen und Organisationsworkflows zu verpacken
  - Skills erfordern, dass das [Code-Ausführungstool](/docs/de/agents-and-tools/tool-use/code-execution-tool) aktiviert ist
  - Weitere Informationen finden Sie in unserer [Dokumentation zu Agent Skills](/docs/de/agents-and-tools/agent-skills/overview) und [API-Referenz](/docs/de/api/skills/create-skill)

### 15. Oktober 2025
- Wir haben [Claude Haiku 4.5](https://www.anthropic.com/news/claude-haiku-4-5) gestartet, unser schnellstes und intelligentestes Haiku-Modell mit nahezu Frontier-Leistung. Ideal für Echtzeitanwendungen, Hochvolumen-Verarbeitung und kostensensitive Bereitstellungen, die starke Argumentation erfordern. Weitere Informationen finden Sie in unserer [Dokumentation zu Modellen & Preisen](/docs/de/about-claude/models).

### 29. September 2025
- Wir haben [Claude Sonnet 4.5](https://www.anthropic.com/news/claude-sonnet-4-5) gestartet, unser bestes Modell für komplexe Agenten und Coding mit der höchsten Intelligenz bei den meisten Aufgaben. Weitere Informationen finden Sie unter [Neuerungen in Claude 4.5](/docs/de/about-claude/models/whats-new-claude-4-5).
- Wir haben [globale Endpunkt-Preisgestaltung](/docs/de/about-claude/pricing#third-party-platform-pricing) für AWS Bedrock und Google Vertex AI eingeführt. Die Claude API (1P) Preisgestaltung ist nicht betroffen.
- Wir haben einen neuen Stop-Grund `model_context_window_exceeded` eingeführt, mit dem Sie die maximale Anzahl von Tokens anfordern können, ohne die Eingabegröße zu berechnen. Weitere Informationen finden Sie in unserer [Dokumentation zum Umgang mit Stop-Gründen](/docs/de/build-with-claude/handling-stop-reasons).
- Wir haben das Memory-Tool in Beta gestartet, das Claude ermöglicht, Informationen über Gespräche hinweg zu speichern und zu konsultieren. Weitere Informationen finden Sie in unserer [Dokumentation zum Memory-Tool](/docs/de/agents-and-tools/tool-use/memory-tool).
- Wir haben die Kontextbearbeitung in Beta gestartet und bieten Strategien zur automatischen Verwaltung des Gesprächskontexts. Die erste Version unterstützt das Löschen älterer Tool-Ergebnisse und -Aufrufe bei Annäherung an Token-Limits. Weitere Informationen finden Sie in unserer [Dokumentation zur Kontextbearbeitung](/docs/de/build-with-claude/context-editing).

### 17. September 2025
- Wir haben Tool-Helfer in Beta für die Python- und TypeScript-SDKs gestartet und vereinfachen die Tool-Erstellung und -Ausführung mit typsicherer Eingabevalidierung und einem Tool-Runner für automatisierte Tool-Handhabung in Gesprächen. Weitere Informationen finden Sie in der Dokumentation für das [Python SDK](https://github.com/anthropics/anthropic-sdk-python/blob/main/tools.md) und das [TypeScript SDK](https://github.com/anthropics/anthropic-sdk-typescript/blob/main/helpers.md#tool-helpers).

### 16. September 2025
- Wir haben unsere Entwicklerangebote unter der Claude-Marke vereinheitlicht. Sie sollten aktualisierte Benennungen und URLs auf unserer Plattform und in unserer Dokumentation sehen, aber **unsere Entwicklerschnittstellen bleiben gleich**. Hier sind einige bemerkenswerte Änderungen:
  - Anthropic Console ([console.anthropic.com](https://console.anthropic.com)) → Claude Console ([platform.claude.com](https://platform.claude.com)). Die Console ist bis zum 16. Dezember 2025 unter beiden URLs verfügbar. Nach diesem Datum wird [console.anthropic.com](https://console.anthropic.com) automatisch zu [platform.claude.com](https://platform.claude.com) weitergeleitet.
  - Anthropic Docs ([docs.claude.com](https://docs.claude.com)) → Claude Docs ([docs.claude.com](https://docs.claude.com))
  - Anthropic Help Center ([support.claude.com](https://support.claude.com)) → Claude Help Center ([support.claude.com](https://support.claude.com))
  - API-Endpunkte, Header, Umgebungsvariablen und SDKs bleiben gleich. Ihre bestehenden Integrationen funktionieren weiterhin ohne Änderungen.

### 10. September 2025
- Wir haben das Web-Fetch-Tool in Beta gestartet, das Claude ermöglicht, vollständige Inhalte von angegebenen Webseiten und PDF-Dokumenten abzurufen. Weitere Informationen finden Sie in unserer [Dokumentation zum Web-Fetch-Tool](/docs/de/agents-and-tools/tool-use/web-fetch-tool).
- Wir haben die [Claude Code Analytics API](/docs/de/build-with-claude/claude-code-analytics-api) gestartet, die Organisationen ermöglicht, programmgesteuert auf tägliche aggregierte Nutzungsmetriken für Claude Code zuzugreifen, einschließlich Produktivitätsmetriken, Tool-Nutzungsstatistiken und Kostendaten.

### 8. September 2025
- Wir haben eine Beta-Version des [C# SDK](https://github.com/anthropics/anthropic-sdk-csharp) gestartet.

### 5. September 2025
- Wir haben [Rate-Limit-Diagramme](/docs/de/api/rate-limits#monitoring-your-rate-limits-in-the-console) auf der Console-Seite [Nutzung](https://console.anthropic.com/settings/usage) gestartet, mit denen Sie Ihre API-Rate-Limit-Nutzung und Caching-Raten im Laufe der Zeit überwachen können.

### 3. September 2025
- Wir haben Unterstützung für zitierbare Dokumente in Client-seitigen Tool-Ergebnissen gestartet. Weitere Informationen finden Sie in unserer [Dokumentation zur Tool-Nutzung](/docs/de/agents-and-tools/tool-use/implement-tool-use).

### 2. September 2025
- Wir haben v2 des [Code-Ausführungstools](/docs/de/agents-and-tools/tool-use/code-execution-tool) in der öffentlichen Beta gestartet und ersetzen das ursprüngliche Python-only-Tool durch Bash-Befehlsausführung und direkte Dateiverwaltungsfunktionen, einschließlich des Schreibens von Code in anderen Sprachen.

### 27. August 2025
- Wir haben eine Beta-Version des [PHP SDK](https://github.com/anthropics/anthropic-sdk-php) gestartet.

### 26. August 2025
- Wir haben die Rate Limits für das [1M-Token-Kontextfenster](/docs/de/build-with-claude/context-windows#1m-token-context-window) für Claude Sonnet 4 auf der Claude API erhöht. Weitere Informationen finden Sie unter [Rate Limits für lange Kontexte](/docs/de/api/rate-limits#long-context-rate-limits).
- Das 1M-Token-Kontextfenster ist jetzt auf Google Cloud's Vertex AI verfügbar. Weitere Informationen finden Sie unter [Claude auf Vertex AI](/docs/de/build-with-claude/claude-on-vertex-ai).

### 19. August 2025
- Request-IDs sind jetzt direkt in Error-Response-Bodies neben dem bestehenden `request-id`-Header enthalten. Weitere Informationen finden Sie in unserer [Error-Dokumentation](/docs/de/api/errors#error-shapes).

### 18. August 2025
- Wir haben die [Usage & Cost API](/docs/de/build-with-claude/usage-cost-api) veröffentlicht, die Administratoren ermöglicht, die Nutzungs- und Kostendaten ihrer Organisation programmgesteuert zu überwachen.
- Wir haben einen neuen Endpunkt zur Admin API hinzugefügt, um Organisationsinformationen abzurufen. Weitere Informationen finden Sie in der [Referenz zur Organization Info Admin API](/docs/de/api/admin-api/organization/get-me).

### 13. August 2025
- Wir kündigten die Einstellung der Claude Sonnet 3.5-Modelle (`claude-3-5-sonnet-20240620` und `claude-3-5-sonnet-20241022`) an. Diese Modelle werden am 28. Oktober 2025 eingestellt. Wir empfehlen die Migration zu Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`) für verbesserte Leistung und Funktionen. Weitere Informationen finden Sie in der [Dokumentation zu Modell-Einstellungen](/docs/de/about-claude/model-deprecations).
- Die 1-Stunden-Cache-Dauer für Prompt-Caching ist jetzt allgemein verfügbar. Sie können jetzt die erweiterte Cache-TTL ohne Beta-Header verwenden. Weitere Informationen finden Sie in unserer [Dokumentation zum Prompt-Caching](/docs/de/build-with-claude/prompt-caching#1-hour-cache-duration).

### 12. August 2025
- Wir haben Beta-Unterstützung für ein [1M-Token-Kontextfenster](/docs/de/build-with-claude/context-windows#1m-token-context-window) in Claude Sonnet 4 auf der Claude API und Amazon Bedrock gestartet.

### 11. August 2025
- Einige Kunden könnten auf 429 (`rate_limit_error`) [Fehler](/docs/de/api/errors) stoßen, die einer starken Steigerung der API-Nutzung aufgrund von Beschleunigungslimits auf der API folgen. Zuvor würden in ähnlichen Szenarien 529 (`overloaded_error`) Fehler auftreten.

### 8. August 2025
- Sucherergebnis-Inhaltsblöcke sind jetzt allgemein auf der Claude API und Google Cloud's Vertex AI verfügbar. Diese Funktion ermöglicht natürliche Zitationen für RAG-Anwendungen mit ordnungsgemäßer Quellenattribution. Der Beta-Header `search-results-2025-06-09` ist nicht mehr erforderlich. Weitere Informationen finden Sie in unserer [Dokumentation zu Suchergebnissen](/docs/de/build-with-claude/search-results).

### 5. August 2025
- Wir haben [Claude Opus 4.1](https://www.anthropic.com/news/claude-opus-4-1) gestartet, ein inkrementelles Update zu Claude Opus 4 mit erweiterten Funktionen und Leistungsverbesserungen.<sup>*</sup> Weitere Informationen finden Sie in unserer [Dokumentation zu Modellen & Preisen](/docs/de/about-claude/models).

_<sup>* - Opus 4.1 erlaubt nicht, dass sowohl `temperature` als auch `top_p` Parameter angegeben werden. Bitte verwenden Sie nur einen. </sup>_

### 28. Juli 2025
- Wir haben `text_editor_20250728` veröffentlicht, ein aktualisiertes Text-Editor-Tool, das einige Probleme aus den vorherigen Versionen behebt und einen optionalen `max_characters`-Parameter hinzufügt, mit dem Sie die Abschneidungslänge beim Anzeigen großer Dateien steuern können.

### 24. Juli 2025
- Wir haben [Rate Limits](/docs/de/api/rate-limits) für Claude Opus 4 auf der Claude API erhöht, um Ihnen mehr Kapazität zum Erstellen und Skalieren mit Claude zu geben. Für Kunden mit [Nutzungsstufe 1-4 Rate Limits](/docs/de/api/rate-limits#rate-limits) gelten diese Änderungen sofort für Ihr Konto - keine Aktion erforderlich.

### 21. Juli 2025
- Wir haben die Claude 2.0-, Claude 2.1- und Claude Sonnet 3-Modelle eingestellt. Alle Anfragen an diese Modelle geben jetzt einen Fehler zurück. Weitere Informationen finden Sie in [unserer Dokumentation](/docs/de/about-claude/model-deprecations).

### 17. Juli 2025
- Wir haben [Rate Limits](/docs/de/api/rate-limits) für Claude Sonnet 4 auf der Claude API erhöht, um Ihnen mehr Kapazität zum Erstellen und Skalieren mit Claude zu geben. Für Kunden mit [Nutzungsstufe 1-4 Rate Limits](/docs/de/api/rate-limits#rate-limits) gelten diese Änderungen sofort für Ihr Konto - keine Aktion erforderlich.

### 3. Juli 2025
- Wir haben Sucherergebnis-Inhaltsblöcke in Beta gestartet und ermöglichen natürliche Zitationen für RAG-Anwendungen. Tools können jetzt Suchergebnisse mit ordnungsgemäßer Quellenattribution zurückgeben, und Claude wird diese Quellen automatisch in seinen Antworten zitieren - was der Zitierqualität der Websuche entspricht. Dies beseitigt die Notwendigkeit für Dokumentumgehungen in benutzerdefinierten Knowledge-Base-Anwendungen. Weitere Informationen finden Sie in unserer [Dokumentation zu Suchergebnissen](/docs/de/build-with-claude/search-results). Um diese Funktion zu aktivieren, verwenden Sie den Beta-Header `search-results-2025-06-09`.

### 30. Juni 2025
- Wir kündigten die Einstellung des Claude Opus 3-Modells an. Weitere Informationen finden Sie in [unserer Dokumentation](/docs/de/about-claude/model-deprecations).

### 23. Juni 2025
- Console-Benutzer mit der Rolle "Developer" können jetzt auf die Seite [Kosten](https://console.anthropic.com/settings/cost) zugreifen. Zuvor ermöglichte die Rolle "Developer" den Zugriff auf die Seite [Nutzung](https://console.anthropic.com/settings/usage), aber nicht auf die Seite "Kosten".

### 11. Juni 2025
- Wir haben [Fine-Grained Tool Streaming](/docs/de/agents-and-tools/tool-use/fine-grained-tool-streaming) in der öffentlichen Beta gestartet, eine Funktion, die Claude ermöglicht, Tool-Use-Parameter ohne Pufferung / JSON-Validierung zu streamen. Um Fine-Grained Tool Streaming zu aktivieren, verwenden Sie den [Beta-Header](/docs/de/api/beta-headers) `fine-grained-tool-streaming-2025-05-14`.

### 22. Mai 2025
- Wir haben [Claude Opus 4 und Claude Sonnet 4](http://www.anthropic.com/news/claude-4) gestartet, unsere neuesten Modelle mit erweiterten Denkfähigkeiten. Weitere Informationen finden Sie in unserer [Dokumentation zu Modellen & Preisen](/docs/de/about-claude/models).
- Das Standardverhalten des [erweiterten Denkens](/docs/de/build-with-claude/extended-thinking) in Claude 4-Modellen gibt eine Zusammenfassung des vollständigen Denkprozesses von Claude zurück, wobei das vollständige Denken verschlüsselt und im `signature`-Feld der `thinking`-Block-Ausgabe zurückgegeben wird.
- Wir haben [verschachteltes Denken](/docs/de/build-with-claude/extended-thinking#interleaved-thinking) in der öffentlichen Beta gestartet, eine Funktion, die Claude ermöglicht, zwischen Tool-Aufrufen zu denken. Um verschachteltes Denken zu aktivieren, verwenden Sie den [Beta-Header](/docs/de/api/beta-headers) `interleaved-thinking-2025-05-14`.
- Wir haben die [Files API](/docs/de/build-with-claude/files) in der öffentlichen Beta gestartet, die es Ihnen ermöglicht, Dateien hochzuladen und sie in der Messages API und dem Code-Ausführungstool zu referenzieren.
- Wir haben das [Code-Ausführungstool](/docs/de/agents-and-tools/tool-use/code-execution-tool) in der öffentlichen Beta gestartet, ein Tool, das Claude ermöglicht, Python-Code in einer sicheren, isolierten Umgebung auszuführen.
- Wir haben den [MCP-Connector](/docs/de/agents-and-tools/mcp-connector) in der öffentlichen Beta gestartet, eine Funktion, die es Ihnen ermöglicht, sich direkt von der Messages API aus mit Remote-MCP-Servern zu verbinden.
- Um die Antwortqualität zu erhöhen und Tool-Fehler zu verringern, haben wir den Standardwert für den `top_p` [Nucleus Sampling](https://en.wikipedia.org/wiki/Top-p_sampling)-Parameter in der Messages API von 0.999 auf 0.99 für alle Modelle geändert. Um diese Änderung rückgängig zu machen, setzen Sie `top_p` auf 0.999.
    Zusätzlich können Sie, wenn erweitertes Denken aktiviert ist, `top_p` jetzt auf Werte zwischen 0.95 und 1 setzen.
- Wir haben unser [Go SDK](https://github.com/anthropics/anthropic-sdk-go) von Beta zu GA verschoben.
- Wir haben Minuten- und Stunden-Granularität zur Seite [Nutzung](https://console.anthropic.com/settings/usage) der Console neben 429-Fehlerraten auf der Nutzungsseite hinzugefügt.

### 21. Mai 2025
- Wir haben unser [Ruby SDK](https://github.com/anthropics/anthropic-sdk-ruby) von Beta zu GA verschoben.

### 7. Mai 2025
- Wir haben ein Web-Suchtool in der API gestartet, das Claude ermöglicht, auf aktuelle Informationen aus dem Web zuzugreifen. Weitere Informationen finden Sie in unserer [Dokumentation zum Web-Suchtool](/docs/de/agents-and-tools/tool-use/web-search-tool).

### 1. Mai 2025
- Cache-Kontrolle muss jetzt direkt im übergeordneten `content`-Block von `tool_result` und `document.source` angegeben werden. Für Rückwärtskompatibilität wird die Cache-Kontrolle, falls sie im letzten Block in `tool_result.content` oder `document.source.content` erkannt wird, automatisch stattdessen auf den übergeordneten Block angewendet. Cache-Kontrolle auf anderen Blöcken innerhalb von `tool_result.content` und `document.source.content` führt zu einem Validierungsfehler.

### 9. April 2025
- Wir haben eine Beta-Version des [Ruby SDK](https://github.com/anthropics/anthropic-sdk-ruby) gestartet

### 31. März 2025
- Wir haben unser [Java SDK](https://github.com/anthropics/anthropic-sdk-java) von Beta zu GA verschoben.
- Wir haben unser [Go SDK](https://github.com/anthropics/anthropic-sdk-go) von Alpha zu Beta verschoben.

### 27. Februar 2025
- Wir haben URL-Quellenblöcke für Bilder und PDFs in der Messages API hinzugefügt. Sie können jetzt direkt auf Bilder und PDFs über URL verweisen, anstatt sie Base64-kodieren zu müssen. Weitere Informationen finden Sie in unserer [Vision-Dokumentation](/docs/de/build-with-claude/vision) und [Dokumentation zur PDF-Unterstützung](/docs/de/build-with-claude/pdf-support).
- Wir haben Unterstützung für eine `none`-Option zum `tool_choice`-Parameter in der Messages API hinzugefügt, die Claude daran hindert, Tools aufzurufen. Zusätzlich müssen Sie keine `tools` mehr bereitstellen, wenn Sie `tool_use` und `tool_result`-Blöcke einschließen.
- Wir haben einen OpenAI-kompatiblen API-Endpunkt gestartet, mit dem Sie Claude-Modelle testen können, indem Sie nur Ihren API-Schlüssel, die Basis-URL und den Modellnamen in bestehenden OpenAI-Integrationen ändern. Diese Kompatibilitätsschicht unterstützt Kern-Chat-Completions-Funktionalität. Weitere Informationen finden Sie in unserer [Dokumentation zur OpenAI SDK-Kompatibilität](/docs/de/api/openai-sdk).

### 24. Februar 2025
- Wir haben [Claude Sonnet 3.7](http://www.anthropic.com/news/claude-3-7-sonnet) gestartet, unser intelligentestes Modell bisher. Claude Sonnet 3.7 kann nahezu sofortige Antworten liefern oder sein erweitertes Denken Schritt für Schritt zeigen. Ein Modell, zwei Denkweisen. Weitere Informationen zu allen Claude-Modellen finden Sie in unserer [Dokumentation zu Modellen & Preisen](/docs/de/about-claude/models).
- Wir haben Vision-Unterstützung zu Claude Haiku 3.5 hinzugefügt, was dem Modell ermöglicht, Bilder zu analysieren und zu verstehen.
- Wir haben eine Token-effiziente Tool-Use-Implementierung veröffentlicht, die die Gesamtleistung bei der Verwendung von Tools mit Claude verbessert. Weitere Informationen finden Sie in unserer [Dokumentation zur Tool-Nutzung](/docs/de/agents-and-tools/tool-use/overview).
- Wir haben die Standardtemperatur in der [Console](https://console.anthropic.com/workbench) für neue Prompts von 0 auf 1 geändert, um Konsistenz mit der Standardtemperatur in der API zu gewährleisten. Bestehende gespeicherte Prompts sind unverändert.
- Wir haben aktualisierte Versionen unserer Tools veröffentlicht, die das Text-Edit- und Bash-Tool vom Computer-Use-System-Prompt entkoppeln:
  - `bash_20250124`: Gleiche Funktionalität wie die vorherige Version, aber unabhängig von Computer Use. Erfordert keinen Beta-Header.
  - `text_editor_20250124`: Gleiche Funktionalität wie die vorherige Version, aber unabhängig von Computer Use. Erfordert keinen Beta-Header.
  - `computer_20250124`: Aktualisiertes Computer-Use-Tool mit neuen Befehlsoptionen einschließlich "hold_key", "left_mouse_down", "left_mouse_up", "scroll", "triple_click" und "wait". Dieses Tool erfordert den "computer-use-2025-01-24" anthropic-beta Header.
  Weitere Informationen finden Sie in unserer [Dokumentation zur Tool-Nutzung](/docs/de/agents-and-tools/tool-use/overview).

### 10. Februar 2025
- Wir haben den `anthropic-organization-id`-Response-Header zu allen API-Antworten hinzugefügt. Dieser Header stellt die Organisations-ID bereit, die dem in der Anfrage verwendeten API-Schlüssel zugeordnet ist.

### 31. Januar 2025

- Wir haben unser [Java SDK](https://github.com/anthropics/anthropic-sdk-java) von Alpha zu Beta verschoben.

### 23. Januar 2025

- Wir haben die Zitierungsfähigkeit in der API gestartet, die Claude ermöglicht, Quellenattribution für Informationen bereitzustellen. Weitere Informationen finden Sie in unserer [Dokumentation zu Zitierungen](/docs/de/build-with-claude/citations).
- Wir haben Unterstützung für Nur-Text-Dokumente und benutzerdefinierte Inhaltsdokumente in der Messages API hinzugefügt.

### 21. Januar 2025

- Wir kündigten die Einstellung der Claude 2-, Claude 2.1- und Claude Sonnet 3-Modelle an. Weitere Informationen finden Sie in [unserer Dokumentation](/docs/de/about-claude/model-deprecations).

### 15. Januar 2025

- Wir haben [Prompt-Caching](/docs/de/build-with-claude/prompt-caching) aktualisiert, um es einfacher zu verwenden. Jetzt, wenn Sie einen Cache-Breakpoint setzen, lesen wir automatisch aus Ihrem längsten zuvor zwischengespeicherten Präfix.
- Sie können jetzt Wörter in Claudes Mund legen, wenn Sie Tools verwenden.

### 10. Januar 2025

- Wir haben die Unterstützung für [Prompt-Caching in der Message Batches API](/docs/de/build-with-claude/batch-processing#using-prompt-caching-with-message-batches) optimiert, um die Cache-Hit-Rate zu verbessern.

### 19. Dezember 2024

- Wir haben Unterstützung für einen [Delete-Endpunkt](/docs/de/api/deleting-message-batches) in der Message Batches API hinzugefügt

### 17. Dezember 2024
Die folgenden Funktionen sind jetzt allgemein in der Claude API verfügbar:

- [Models API](/docs/de/api/models-list): Verfügbare Modelle abfragen, Modell-IDs validieren und [Modell-Aliase](/docs/de/about-claude/models#model-names) in ihre kanonischen Modell-IDs auflösen.
- [Message Batches API](/docs/de/build-with-claude/batch-processing): Verarbeiten Sie große Batches von Nachrichten asynchron zu 50% der Standard-API-Kosten.
- [Token Counting API](/docs/de/build-with-claude/token-counting): Berechnen Sie Token-Zählungen für Nachrichten, bevor Sie sie an Claude senden.
- [Prompt Caching](/docs/de/build-with-claude/prompt-caching): Reduzieren Sie Kosten um bis zu 90% und Latenz um bis zu 80%, indem Sie Prompt-Inhalte zwischenspeichern und wiederverwenden.
- [PDF-Unterstützung](/docs/de/build-with-claude/pdf-support): Verarbeiten Sie PDFs, um sowohl Text- als auch visuelle Inhalte in Dokumenten zu analysieren.

Wir haben auch neue offizielle SDKs veröffentlicht:
- [Java SDK](https://github.com/anthropics/anthropic-sdk-java) (Alpha)
- [Go SDK](https://github.com/anthropics/anthropic-sdk-go) (Alpha)

### 4. Dezember 2024

- Wir haben die Möglichkeit hinzugefügt, nach API-Schlüssel auf den Seiten [Nutzung](https://console.anthropic.com/settings/usage) und [Kosten](https://console.anthropic.com/settings/cost) der [Developer Console](https://console.anthropic.com) zu gruppieren
- Wir haben zwei neue Spalten **Zuletzt verwendet am** und **Kosten** sowie die Möglichkeit hinzugefügt, nach einer beliebigen Spalte auf der Seite [API-Schlüssel](https://console.anthropic.com/settings/keys) der [Developer Console](https://console.anthropic.com) zu sortieren

### 21. November 2024

- Wir haben die [Admin API](/docs/de/build-with-claude/administration-api) veröffentlicht, die Benutzern ermöglicht, die Ressourcen ihrer Organisation programmgesteuert zu verwalten.

### 20. November 2024

- Wir haben unsere Rate Limits für die Messages API aktualisiert. Wir haben das Tokens-pro-Minute-Rate-Limit durch neue Input- und Output-Tokens-pro-Minute-Rate-Limits ersetzt. Weitere Informationen finden Sie in unserer [Dokumentation](/docs/de/api/rate-limits).
- Wir haben Unterstützung für [Tool-Nutzung](/docs/de/agents-and-tools/tool-use/overview) in der [Workbench](https://console.anthropic.com/workbench) hinzugefügt.

### 13. November 2024

- Wir haben PDF-Unterstützung für alle Claude Sonnet 3.5-Modelle hinzugefügt. Weitere Informationen finden Sie in unserer [Dokumentation](/docs/de/build-with-claude/pdf-support).

### 6. November 2024

- Wir haben die Claude 1- und Instant-Modelle eingestellt. Weitere Informationen finden Sie in [unserer Dokumentation](/docs/de/about-claude/model-deprecations).

### 4. November 2024

- [Claude Haiku 3.5](https://www.anthropic.com/claude/haiku) ist jetzt auf der Claude API als Nur-Text-Modell verfügbar.

### 1. November 2024

- Wir haben PDF-Unterstützung zur Verwendung mit dem neuen Claude Sonnet 3.5 hinzugefügt. Weitere Informationen finden Sie in unserer [Dokumentation](/docs/de/build-with-claude/pdf-support).
- Wir haben auch Token-Zählung hinzugefügt, mit der Sie die Gesamtzahl der Tokens in einer Nachricht bestimmen können, bevor Sie sie an Claude senden. Weitere Informationen finden Sie in unserer [Dokumentation](/docs/de/build-with-claude/token-counting).

### 22. Oktober 2024

- Wir haben von Anthropic definierte Computer-Use-Tools zu unserer API zur Verwendung mit dem neuen Claude Sonnet 3.5 hinzugefügt. Weitere Informationen finden Sie in unserer [Dokumentation](/docs/de/agents-and-tools/tool-use/computer-use-tool).
- Claude Sonnet 3.5, unser intelligentestes Modell bisher, hat gerade ein Upgrade erhalten und ist jetzt auf der Claude API verfügbar. Weitere Informationen finden Sie [hier](https://www.anthropic.com/claude/sonnet).

### 8. Oktober 2024

- Die Message Batches API ist jetzt in Beta verfügbar. Verarbeiten Sie große Batches von Abfragen asynchron in der Claude API zu 50% weniger Kosten. Weitere Informationen finden Sie in unserer [Dokumentation](/docs/de/build-with-claude/batch-processing).
- Wir haben die Einschränkungen für die Reihenfolge von `user`/`assistant`-Turns in unserer Messages API gelockert. Aufeinanderfolgende `user`/`assistant`-Nachrichten werden in eine einzelne Nachricht kombiniert, anstatt einen Fehler zu verursachen, und wir erfordern nicht mehr, dass die erste Eingabenachricht eine `user`-Nachricht ist.
- Wir haben die Build- und Scale-Pläne zugunsten einer Standard-Funktionssuite (früher als Build bezeichnet) sowie zusätzlicher Funktionen, die über den Vertrieb verfügbar sind, eingestellt. Weitere Informationen finden Sie [hier](https://claude.com/platform/api).

### 3. Oktober 2024

- Wir haben die Möglichkeit hinzugefügt, parallele Tool-Nutzung in der API zu deaktivieren. Setzen Sie `disable_parallel_tool_use: true` im `tool_choice`-Feld, um sicherzustellen, dass Claude höchstens ein Tool verwendet. Weitere Informationen finden Sie in unserer [Dokumentation](/docs/de/agents-and-tools/tool-use/implement-tool-use#parallel-tool-use).

### 10. September 2024

- Wir haben Workspaces zur [Developer Console](https://console.anthropic.com) hinzugefügt. Workspaces ermöglichen es Ihnen, benutzerdefinierte Ausgaben- oder Rate Limits festzulegen, API-Schlüssel zu gruppieren, Nutzung nach Projekt zu verfolgen und den Zugriff mit Benutzerrollen zu steuern. Weitere Informationen finden Sie in unserem [Blog-Beitrag](https://www.anthropic.com/news/workspaces).

### 4. September 2024

- Wir kündigten die Einstellung der Claude 1-Modelle an. Weitere Informationen finden Sie in [unserer Dokumentation](/docs/de/about-claude/model-deprecations).

### 22. August 2024

- Wir haben Unterstützung für die Verwendung des SDK in Browsern hinzugefügt, indem wir CORS-Header in den API-Antworten zurückgeben. Setzen Sie `dangerouslyAllowBrowser: true` in der SDK-Instanziierung, um diese Funktion zu aktivieren.

### 19. August 2024

- Wir haben 8.192-Token-Ausgaben von Beta zu allgemeiner Verfügbarkeit für Claude Sonnet 3.5 verschoben.

### 14. August 2024

- [Prompt-Caching](/docs/de/build-with-claude/prompt-caching) ist jetzt als Beta-Funktion in der Claude API verfügbar. Zwischenspeichern und verwenden Sie Prompts erneut, um Latenz um bis zu 80% und Kosten um bis zu 90% zu reduzieren.

### 15. Juli 2024

- Generieren Sie Ausgaben bis zu 8.192 Tokens Länge von Claude Sonnet 3.5 mit dem neuen `anthropic-beta: max-tokens-3-5-sonnet-2024-07-15` Header.

### 9. Juli 2024

- Generieren Sie automatisch Testfälle für Ihre Prompts mit Claude in der [Developer Console](https://console.anthropic.com).
- Vergleichen Sie die Ausgaben verschiedener Prompts nebeneinander im neuen Output-Vergleichsmodus in der [Developer Console](https://console.anthropic.com).

### 27. Juni 2024

- Sehen Sie die API-Nutzung und Abrechnung aufgeschlüsselt nach Dollarbetrag, Token-Zählung und API-Schlüsseln in den neuen Registerkarten [Nutzung](https://console.anthropic.com/settings/usage) und [Kosten](https://console.anthropic.com/settings/cost) in der [Developer Console](https://console.anthropic.com).
- Sehen Sie Ihre aktuellen API-Rate-Limits in der neuen Registerkarte [Rate Limits](https://console.anthropic.com/settings/limits) in der [Developer Console](https://console.anthropic.com).

### 20. Juni 2024

- [Claude Sonnet 3.5](http://anthropic.com/news/claude-3-5-sonnet), unser intelligentestes Modell bisher, ist jetzt allgemein über die Claude API, Amazon Bedrock und Google Vertex AI verfügbar.

### 30. Mai 2024

- [Tool-Nutzung](/docs/de/agents-and-tools/tool-use/overview) ist jetzt allgemein über die Claude API, Amazon Bedrock und Google Vertex AI verfügbar.

### 10. Mai 2024

- Unser Prompt-Generator-Tool ist jetzt in der [Developer Console](https://console.anthropic.com) verfügbar. Prompt Generator macht es einfach, Claude zu führen, um hochwertige Prompts zu generieren, die auf Ihre spezifischen Aufgaben zugeschnitten sind. Weitere Informationen finden Sie in unserem [Blog-Beitrag](https://www.anthropic.com/news/prompt-generator).