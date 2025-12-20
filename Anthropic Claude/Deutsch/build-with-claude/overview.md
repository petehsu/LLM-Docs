# Übersicht der Funktionen

Erkunden Sie die erweiterten Funktionen und Möglichkeiten von Claude.

---

## Kernfunktionen

Diese Funktionen erweitern Claudes grundlegende Fähigkeiten zur Verarbeitung, Analyse und Generierung von Inhalten in verschiedenen Formaten und Anwendungsfällen.

| Funktion | Beschreibung | Verfügbarkeit |
|---------|-------------|--------------|
| [1M Token-Kontextfenster](/docs/de/build-with-claude/context-windows#1m-token-context-window) | Ein erweitertes Kontextfenster, das es Ihnen ermöglicht, viel größere Dokumente zu verarbeiten, längere Gespräche zu führen und mit umfangreicheren Codebasen zu arbeiten. | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [Agent Skills](/docs/de/agents-and-tools/agent-skills/overview) | Erweitern Sie Claudes Fähigkeiten mit Skills. Verwenden Sie vorgefertigte Skills (PowerPoint, Excel, Word, PDF) oder erstellen Sie benutzerdefinierte Skills mit Anweisungen und Skripten. Skills verwenden progressive Offenlegung, um den Kontext effizient zu verwalten. | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [Batch-Verarbeitung](/docs/de/build-with-claude/batch-processing) | Verarbeiten Sie große Mengen von Anfragen asynchron, um Kosten zu sparen. Senden Sie Batches mit einer großen Anzahl von Abfragen pro Batch. Batch-API-Aufrufe kosten 50% weniger als Standard-API-Aufrufe. | <PlatformAvailability claudeApi bedrock vertexAi /> |
| [Zitate](/docs/de/build-with-claude/citations) | Verankern Sie Claudes Antworten in Quelldokumenten. Mit Zitaten kann Claude detaillierte Verweise auf die genauen Sätze und Passagen bereitstellen, die es zur Generierung von Antworten verwendet, was zu überprüfbareren und vertrauenswürdigeren Ausgaben führt. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Kontextbearbeitung](/docs/de/build-with-claude/context-editing) | Verwalten Sie automatisch den Gesprächskontext mit konfigurierbaren Strategien. Unterstützt das Löschen von Werkzeugergebnissen bei Annäherung an Token-Limits und die Verwaltung von Denkblöcken in erweiterten Denkgesprächen. | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [Aufwand](/docs/de/build-with-claude/effort) | Kontrollieren Sie, wie viele Token Claude bei der Antwort mit dem Aufwand-Parameter verwendet, und wägen Sie zwischen Antwortgründlichkeit und Token-Effizienz ab. | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [Erweitertes Denken](/docs/de/build-with-claude/extended-thinking) | Verbesserte Denkfähigkeiten für komplexe Aufgaben, die Transparenz in Claudes schrittweisen Denkprozess bieten, bevor die endgültige Antwort geliefert wird. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Files API](/docs/de/build-with-claude/files) | Laden Sie Dateien hoch und verwalten Sie sie, um sie mit Claude zu verwenden, ohne Inhalte bei jeder Anfrage erneut hochzuladen. Unterstützt PDFs, Bilder und Textdateien. | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [PDF-Unterstützung](/docs/de/build-with-claude/pdf-support) | Verarbeiten und analysieren Sie Text- und visuelle Inhalte aus PDF-Dokumenten. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Prompt-Caching (5m)](/docs/de/build-with-claude/prompt-caching) | Versorgen Sie Claude mit mehr Hintergrundwissen und Beispielausgaben, um Kosten und Latenz zu reduzieren. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Prompt-Caching (1h)](/docs/de/build-with-claude/prompt-caching#1-hour-cache-duration) | Erweiterte 1-Stunden-Cache-Dauer für weniger häufig zugegriffene, aber wichtige Kontexte, ergänzend zum Standard-5-Minuten-Cache. | <PlatformAvailability claudeApi azureAi /> |
| [Suchergebnisse](/docs/de/build-with-claude/search-results) | Aktivieren Sie natürliche Zitate für RAG-Anwendungen, indem Sie Suchergebnisse mit ordnungsgemäßer Quellenangabe bereitstellen. Erzielen Sie Web-Such-Qualitätszitate für benutzerdefinierte Wissensdatenbanken und Tools. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Strukturierte Ausgaben](/docs/de/build-with-claude/structured-outputs) | Garantieren Sie Schema-Konformität mit zwei Ansätzen: JSON-Ausgaben für strukturierte Datenreaktionen und striktes Tool-Verwenden für validierte Tool-Eingaben. Verfügbar auf Sonnet 4.5, Opus 4.1, Opus 4.5 und Haiku 4.5. | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [Token-Zählung](/docs/de/api/messages-count-tokens) | Die Token-Zählung ermöglicht es Ihnen, die Anzahl der Token in einer Nachricht zu bestimmen, bevor Sie sie an Claude senden, und hilft Ihnen, fundierte Entscheidungen über Ihre Prompts und Nutzung zu treffen. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Tool-Verwendung](/docs/de/agents-and-tools/tool-use/overview) | Ermöglichen Sie Claude, mit externen Tools und APIs zu interagieren, um eine größere Vielfalt von Aufgaben auszuführen. Eine Liste der unterstützten Tools finden Sie in [der Tools-Tabelle](#tools). | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |

## Tools

Diese Funktionen ermöglichen es Claude, mit externen Systemen zu interagieren, Code auszuführen und automatisierte Aufgaben durch verschiedene Tool-Schnittstellen auszuführen.

| Funktion | Beschreibung | Verfügbarkeit |
|---------|-------------|--------------|
| [Bash](/docs/de/agents-and-tools/tool-use/bash-tool) | Führen Sie Bash-Befehle und Skripte aus, um mit der Systemshell zu interagieren und Befehlszeilenoperationen auszuführen. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Code-Ausführung](/docs/de/agents-and-tools/tool-use/code-execution-tool) | Führen Sie Python-Code in einer isolierten Umgebung für erweiterte Datenanalyse aus. | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [Programmgesteuerte Tool-Aufrufe](/docs/de/agents-and-tools/tool-use/programmatic-tool-calling) | Ermöglichen Sie Claude, Ihre Tools programmgesteuert aus Code-Ausführungscontainern aufzurufen, um Latenz und Token-Verbrauch für Multi-Tool-Workflows zu reduzieren. | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [Computernutzung](/docs/de/agents-and-tools/tool-use/computer-use-tool) | Kontrollieren Sie Computerschnittstellen, indem Sie Screenshots aufnehmen und Maus- und Tastaturbefehle ausgeben. | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [Feingranulares Tool-Streaming](/docs/de/agents-and-tools/tool-use/fine-grained-tool-streaming) | Streamen Sie Tool-Verwendungsparameter ohne Pufferung/JSON-Validierung, um die Latenz beim Empfang großer Parameter zu reduzieren. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [MCP-Connector](/docs/de/agents-and-tools/mcp-connector) | Verbinden Sie sich direkt von der Messages API aus mit Remote-[MCP](/docs/de/mcp)-Servern, ohne einen separaten MCP-Client zu benötigen. | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [Speicher](/docs/de/agents-and-tools/tool-use/memory-tool) | Ermöglichen Sie Claude, Informationen über Gespräche hinweg zu speichern und abzurufen. Erstellen Sie Wissensdatenbanken im Laufe der Zeit, behalten Sie den Projektkontext bei und lernen Sie aus vergangenen Interaktionen. | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [Text-Editor](/docs/de/agents-and-tools/tool-use/text-editor-tool) | Erstellen und bearbeiten Sie Textdateien mit einer integrierten Text-Editor-Schnittstelle für Dateiverwaltungsaufgaben. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Tool-Suche](/docs/de/agents-and-tools/tool-use/tool-search-tool) | Skalieren Sie auf Tausende von Tools, indem Sie Tools dynamisch mit regex-basierter Suche bei Bedarf entdecken und laden, um die Kontextnutzung zu optimieren und die Tool-Auswahlgenauigkeit zu verbessern. | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [Web-Abruf](/docs/de/agents-and-tools/tool-use/web-fetch-tool) | Rufen Sie vollständige Inhalte von angegebenen Webseiten und PDF-Dokumenten für tiefgehende Analysen ab. | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [Web-Suche](/docs/de/agents-and-tools/tool-use/web-search-tool) | Ergänzen Sie Claudes umfassendes Wissen mit aktuellen, realen Daten aus dem gesamten Web. | <PlatformAvailability claudeApi vertexAi azureAi /> |