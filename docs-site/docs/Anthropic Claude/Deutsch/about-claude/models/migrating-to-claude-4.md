# Migration zu Claude 4.5

Migrieren Sie zu Claude 4.5-Modellen mit Schritt-für-Schritt-Anleitung und Breaking Changes

---

Dieses Handbuch behandelt zwei wichtige Migrationspfade zu Claude 4.5-Modellen:

- **Claude Sonnet 3.7 → Claude Sonnet 4.5**: Unser intelligentestes Modell mit erstklassigen Fähigkeiten in Reasoning, Coding und langfristigen Agent-Funktionen
- **Claude Haiku 3.5 → Claude Haiku 4.5**: Unser schnellstes und intelligentestes Haiku-Modell mit nahezu Frontier-Performance für Echtzeitanwendungen und hochvolumige intelligente Verarbeitung

Beide Migrationen beinhalten Breaking Changes, die Aktualisierungen Ihrer Implementierung erfordern. Dieses Handbuch führt Sie durch jeden Migrationspfad mit Schritt-für-Schritt-Anleitung und deutlich gekennzeichneten Breaking Changes.

Bevor Sie mit der Migration beginnen, empfehlen wir, [Was ist neu in Claude 4.5](/docs/de/about-claude/models/whats-new-claude-4-5) zu lesen, um die neuen Funktionen und Möglichkeiten dieser Modelle zu verstehen, einschließlich Extended Thinking, Context Awareness und Verhaltensverbesserungen.

## Migration von Claude Sonnet 3.7 zu Claude Sonnet 4.5

Claude Sonnet 4.5 ist unser intelligentestes Modell und bietet erstklassige Performance für Reasoning, Coding und langfristig autonome Agents. Diese Migration beinhaltet mehrere Breaking Changes, die Aktualisierungen Ihrer Implementierung erfordern.

### Migrationsschritte

1. **Aktualisieren Sie Ihren Modellnamen:**
   ```python
   # Before (Claude Sonnet 3.7)
   model="claude-3-7-sonnet-20250219"

   # After (Claude Sonnet 4.5)
   model="claude-sonnet-4-5-20250929"
   ```

2. **Aktualisieren Sie Sampling-Parameter**

   <Warning>
   Dies ist eine Breaking Change von Claude Sonnet 3.7.
   </Warning>

   Verwenden Sie nur `temperature` ODER `top_p`, nicht beide:

   ```python
   # Before (Claude Sonnet 3.7) - Dies führt zu einem Fehler in Sonnet 4.5
   response = client.messages.create(
       model="claude-3-7-sonnet-20250219",
       temperature=0.7,
       top_p=0.9,  # Kann nicht beide verwenden
       ...
   )

   # After (Claude Sonnet 4.5)
   response = client.messages.create(
       model="claude-sonnet-4-5-20250929",
       temperature=0.7,  # Verwenden Sie temperature ODER top_p, nicht beide
       ...
   )
   ```

3. **Behandeln Sie den neuen `refusal` Stop Reason**

   Aktualisieren Sie Ihre Anwendung, um [refusal Stop Reasons zu behandeln](/docs/de/test-and-evaluate/strengthen-guardrails/handle-streaming-refusals):

   ```python
   response = client.messages.create(...)

   if response.stop_reason == "refusal":
       # Behandeln Sie die Ablehnung angemessen
       pass
   ```

4. **Aktualisieren Sie das Text-Editor-Tool (falls zutreffend)**

   <Warning>
   Dies ist eine Breaking Change von Claude Sonnet 3.7.
   </Warning>

   Aktualisieren Sie auf `text_editor_20250728` (type) und `str_replace_based_edit_tool` (name). Entfernen Sie jeden Code, der den `undo_edit` Befehl verwendet.
   
   ```python
   # Before (Claude Sonnet 3.7)
   tools=[{"type": "text_editor_20250124", "name": "str_replace_editor"}]

   # After (Claude Sonnet 4.5)
   tools=[{"type": "text_editor_20250728", "name": "str_replace_based_edit_tool"}]
   ```

   Siehe [Text-Editor-Tool-Dokumentation](/docs/de/agents-and-tools/tool-use/text-editor-tool) für Details.

5. **Aktualisieren Sie das Code-Execution-Tool (falls zutreffend)**

   Aktualisieren Sie auf `code_execution_20250825`. Die Legacy-Version `code_execution_20250522` funktioniert noch, wird aber nicht empfohlen. Siehe [Code-Execution-Tool-Dokumentation](/docs/de/agents-and-tools/tool-use/code-execution-tool#upgrade-to-latest-tool-version) für Migrationsinstruktionen.

6. **Entfernen Sie den Token-effizienten Tool-Use-Beta-Header**

   Token-effizienter Tool-Use ist eine Beta-Funktion, die nur mit Claude 3.7 Sonnet funktioniert. Alle Claude 4-Modelle haben eingebauten Token-effizienten Tool-Use, daher sollten Sie den Beta-Header nicht mehr einbeziehen.

   Entfernen Sie den `token-efficient-tools-2025-02-19` [Beta-Header](/docs/de/api/beta-headers) aus Ihren Anfragen:

   ```python
   # Before (Claude Sonnet 3.7)
   client.messages.create(
       model="claude-3-7-sonnet-20250219",
       betas=["token-efficient-tools-2025-02-19"],  # Entfernen Sie dies
       ...
   )

   # After (Claude Sonnet 4.5)
   client.messages.create(
       model="claude-sonnet-4-5-20250929",
       # Kein Token-effizienter-Tools-Beta-Header
       ...
   )
   ```

7. **Entfernen Sie den Extended-Output-Beta-Header**

   Der `output-128k-2025-02-19` [Beta-Header](/docs/de/api/beta-headers) für Extended Output ist nur in Claude Sonnet 3.7 verfügbar.

   Entfernen Sie diesen Header aus Ihren Anfragen:

   ```python
   # Before (Claude Sonnet 3.7)
   client.messages.create(
       model="claude-3-7-sonnet-20250219",
       betas=["output-128k-2025-02-19"],  # Entfernen Sie dies
       ...
   )

   # After (Claude Sonnet 4.5)
   client.messages.create(
       model="claude-sonnet-4-5-20250929",
       # Kein Output-128k-Beta-Header
       ...
   )
   ```

8. **Aktualisieren Sie Ihre Prompts für Verhaltensänderungen**

   Claude Sonnet 4.5 hat einen prägnanten, direkten Kommunikationsstil und erfordert explizite Anleitung. Lesen Sie [Claude 4 Prompt-Engineering Best Practices](/docs/de/build-with-claude/prompt-engineering/claude-4-best-practices) für Optimierungsleitfaden.

9. **Erwägen Sie die Aktivierung von Extended Thinking für komplexe Aufgaben**

   Aktivieren Sie [Extended Thinking](/docs/de/build-with-claude/extended-thinking) für erhebliche Leistungsverbesserungen bei Coding- und Reasoning-Aufgaben (standardmäßig deaktiviert):

   ```python
   response = client.messages.create(
       model="claude-sonnet-4-5-20250929",
       max_tokens=16000,
       thinking={"type": "enabled", "budget_tokens": 10000},
       messages=[...]
   )
   ```

   <Note>
   Extended Thinking beeinflusst die [Prompt-Caching](/docs/de/build-with-claude/prompt-caching#caching-with-thinking-blocks)-Effizienz.
   </Note>

10. **Testen Sie Ihre Implementierung**

   Testen Sie in einer Entwicklungsumgebung, bevor Sie in der Produktion bereitstellen, um sicherzustellen, dass alle Breaking Changes ordnungsgemäß behandelt werden.

### Sonnet 3.7 → 4.5 Migrations-Checkliste

- [ ] Aktualisieren Sie die Modell-ID auf `claude-sonnet-4-5-20250929`
- [ ] **BREAKING**: Aktualisieren Sie Sampling-Parameter, um nur `temperature` ODER `top_p` zu verwenden, nicht beide
- [ ] Behandeln Sie den neuen `refusal` Stop Reason in Ihrer Anwendung
- [ ] **BREAKING**: Aktualisieren Sie das Text-Editor-Tool auf `text_editor_20250728` und `str_replace_based_edit_tool` (falls zutreffend)
- [ ] **BREAKING**: Entfernen Sie jeden Code, der den `undo_edit` Befehl verwendet (falls zutreffend)
- [ ] Aktualisieren Sie das Code-Execution-Tool auf `code_execution_20250825` (falls zutreffend)
- [ ] Entfernen Sie den `token-efficient-tools-2025-02-19` Beta-Header (falls zutreffend)
- [ ] Entfernen Sie den `output-128k-2025-02-19` Beta-Header (falls zutreffend)
- [ ] Überprüfen und aktualisieren Sie Prompts gemäß [Claude 4 Best Practices](/docs/de/build-with-claude/prompt-engineering/claude-4-best-practices)
- [ ] Erwägen Sie die Aktivierung von Extended Thinking für komplexe Reasoning-Aufgaben
- [ ] Behandeln Sie den `model_context_window_exceeded` Stop Reason (Sonnet 4.5 spezifisch)
- [ ] Erwägen Sie die Aktivierung des Memory-Tools für langfristige Agents (Beta)
- [ ] Erwägen Sie die Verwendung von automatischem Tool-Call-Clearing für Context-Bearbeitung (Beta)
- [ ] Testen Sie in der Entwicklungsumgebung vor der Produktionsbereitstellung

### Funktionen, die aus Claude Sonnet 3.7 entfernt wurden

- **Token-effizienter Tool-Use**: Der `token-efficient-tools-2025-02-19` Beta-Header funktioniert nur mit Claude 3.7 Sonnet und wird in Claude 4-Modellen nicht unterstützt (siehe Schritt 6)
- **Extended Output**: Der `output-128k-2025-02-19` Beta-Header wird nicht unterstützt (siehe Schritt 7)

Beide Header können in Claude 4-Anfragen eingebunden werden, haben aber keine Auswirkung.

## Migration von Claude Haiku 3.5 zu Claude Haiku 4.5

Claude Haiku 4.5 ist unser schnellstes und intelligentestes Haiku-Modell mit nahezu Frontier-Performance und bietet Premium-Modellqualität mit Echtzeitperformance für interaktive Anwendungen und hochvolumige intelligente Verarbeitung. Diese Migration beinhaltet mehrere Breaking Changes, die Aktualisierungen Ihrer Implementierung erfordern.

Für einen vollständigen Überblick über neue Funktionen siehe [Was ist neu in Claude 4.5](/docs/de/about-claude/models/whats-new-claude-4-5#key-improvements-in-haiku-4-5-over-haiku-3-5).

<Note>
Haiku 4.5 Preisgestaltung $1 pro Million Input-Token, $5 pro Million Output-Token. Siehe [Claude Preisgestaltung](/docs/de/about-claude/pricing) für Details.
</Note>

### Migrationsschritte

1. **Aktualisieren Sie Ihren Modellnamen:**
   ```python
   # Before (Haiku 3.5)
   model="claude-3-5-haiku-20241022"

   # After (Haiku 4.5)
   model="claude-haiku-4-5-20251001"
   ```

2. **Aktualisieren Sie Tool-Versionen (falls zutreffend)**

   <Warning>
   Dies ist eine Breaking Change von Claude Haiku 3.5.
   </Warning>

   Haiku 4.5 unterstützt nur die neuesten Tool-Versionen:

   ```python
   # Before (Haiku 3.5)
   tools=[{"type": "text_editor_20250124", "name": "str_replace_editor"}]

   # After (Haiku 4.5)
   tools=[{"type": "text_editor_20250728", "name": "str_replace_based_edit_tool"}]
   ```

   - **Text-Editor**: Verwenden Sie `text_editor_20250728` und `str_replace_based_edit_tool`
   - **Code-Execution**: Verwenden Sie `code_execution_20250825`
   - Entfernen Sie jeden Code, der den `undo_edit` Befehl verwendet

3. **Aktualisieren Sie Sampling-Parameter**

   <Warning>
   Dies ist eine Breaking Change von Claude Haiku 3.5.
   </Warning>

   Verwenden Sie nur `temperature` ODER `top_p`, nicht beide:

   ```python
   # Before (Haiku 3.5) - Dies führt zu einem Fehler in Haiku 4.5
   response = client.messages.create(
       model="claude-3-5-haiku-20241022",
       temperature=0.7,
       top_p=0.9,  # Kann nicht beide verwenden
       ...
   )

   # After (Haiku 4.5)
   response = client.messages.create(
       model="claude-haiku-4-5-20251001",
       temperature=0.7,  # Verwenden Sie temperature ODER top_p, nicht beide
       ...
   )
   ```

4. **Überprüfen Sie neue Rate Limits**

   Haiku 4.5 hat separate Rate Limits von Haiku 3.5. Siehe [Rate Limits Dokumentation](/docs/de/api/rate-limits) für Details.

5. **Behandeln Sie den neuen `refusal` Stop Reason**

   Aktualisieren Sie Ihre Anwendung, um [Refusal Stop Reasons zu behandeln](/docs/de/test-and-evaluate/strengthen-guardrails/handle-streaming-refusals).

6. **Erwägen Sie die Aktivierung von Extended Thinking für komplexe Aufgaben**

   Aktivieren Sie [Extended Thinking](/docs/de/build-with-claude/extended-thinking) für erhebliche Leistungsverbesserungen bei Coding- und Reasoning-Aufgaben (standardmäßig deaktiviert):

   ```python
   response = client.messages.create(
       model="claude-haiku-4-5-20251001",
       max_tokens=16000,
       thinking={"type": "enabled", "budget_tokens": 5000},
       messages=[...]
   )
   ```
   <Note>
   Extended Thinking beeinflusst die [Prompt-Caching](/docs/de/build-with-claude/prompt-caching#caching-with-thinking-blocks)-Effizienz.
   </Note>

7. **Erkunden Sie neue Funktionen**

   Siehe [Was ist neu in Claude 4.5](/docs/de/about-claude/models/whats-new-claude-4-5#key-improvements-in-haiku-4-5-over-haiku-3-5) für Details zu Context Awareness, erhöhter Output-Kapazität (64K Token), höherer Intelligenz und verbesserter Geschwindigkeit.

8. **Testen Sie Ihre Implementierung**

   Testen Sie in einer Entwicklungsumgebung, bevor Sie in der Produktion bereitstellen, um sicherzustellen, dass alle Breaking Changes ordnungsgemäß behandelt werden.

### Haiku 3.5 → 4.5 Migrations-Checkliste

- [ ] Aktualisieren Sie die Modell-ID auf `claude-haiku-4-5-20251001`
- [ ] **BREAKING**: Aktualisieren Sie Tool-Versionen auf die neuesten (z.B. `text_editor_20250728`, `code_execution_20250825`) - Legacy-Versionen werden nicht unterstützt
- [ ] **BREAKING**: Entfernen Sie jeden Code, der den `undo_edit` Befehl verwendet (falls zutreffend)
- [ ] **BREAKING**: Aktualisieren Sie Sampling-Parameter, um nur `temperature` ODER `top_p` zu verwenden, nicht beide
- [ ] Überprüfen und passen Sie sich an neue Rate Limits an (getrennt von Haiku 3.5)
- [ ] Behandeln Sie den neuen `refusal` Stop Reason in Ihrer Anwendung
- [ ] Erwägen Sie die Aktivierung von Extended Thinking für komplexe Reasoning-Aufgaben (neue Funktion)
- [ ] Nutzen Sie Context Awareness für besseres Token-Management in langen Sessions
- [ ] Bereiten Sie sich auf größere Responses vor (maximale Output erhöht von 8K auf 64K Token)
- [ ] Überprüfen und aktualisieren Sie Prompts gemäß [Claude 4 Best Practices](/docs/de/build-with-claude/prompt-engineering/claude-4-best-practices)
- [ ] Testen Sie in der Entwicklungsumgebung vor der Produktionsbereitstellung

## Wahl zwischen Sonnet 4.5 und Haiku 4.5

Sowohl Claude Sonnet 4.5 als auch Claude Haiku 4.5 sind leistungsstarke Claude 4-Modelle mit unterschiedlichen Stärken:

### Wählen Sie Claude Sonnet 4.5 (am intelligentesten) für:

- **Komplexes Reasoning und Analyse**: Erstklassige Intelligenz für anspruchsvolle Aufgaben
- **Langfristig autonome Agents**: Überlegene Performance für Agents, die unabhängig für längere Zeit arbeiten
- **Fortgeschrittene Coding-Aufgaben**: Unser stärkstes Coding-Modell mit fortgeschrittener Planung und Security Engineering
- **Große Context-Workflows**: Verbessertes Context-Management mit Memory-Tool und Context-Bearbeitungsfunktionen
- **Aufgaben, die maximale Fähigkeit erfordern**: Wenn Intelligenz und Genauigkeit die obersten Prioritäten sind

### Wählen Sie Claude Haiku 4.5 (schnellstes und intelligentestes Haiku) für:

- **Echtzeitanwendungen**: Schnelle Antwortzeiten für interaktive Benutzererfahrungen mit nahezu Frontier-Performance
- **Hochvolumige intelligente Verarbeitung**: Kosteneffektive Intelligenz im großen Maßstab mit verbesserter Geschwindigkeit
- **Kostensensitive Bereitstellungen**: Nahezu Frontier-Performance zu niedrigeren Preispunkten
- **Sub-Agent-Architekturen**: Schnelle, intelligente Agents für Multi-Agent-Systeme
- **Computer-Use im großen Maßstab**: Kosteneffektive autonome Desktop- und Browser-Automatisierung
- **Aufgaben, die Geschwindigkeit erfordern**: Wenn niedrige Latenz kritisch ist und gleichzeitig nahezu Frontier-Intelligenz erhalten bleibt

### Extended Thinking Empfehlungen

Claude 4-Modelle, besonders Sonnet und Haiku 4.5, zeigen erhebliche Leistungsverbesserungen bei Verwendung von [Extended Thinking](/docs/de/build-with-claude/extended-thinking) für Coding- und komplexe Reasoning-Aufgaben. Extended Thinking ist **standardmäßig deaktiviert**, aber wir empfehlen, es für anspruchsvolle Arbeiten zu aktivieren.

**Wichtig**: Extended Thinking beeinflusst die [Prompt-Caching](/docs/de/build-with-claude/prompt-caching#caching-with-thinking-blocks)-Effizienz. Wenn nicht-Tool-Result-Inhalte zu einer Konversation hinzugefügt werden, werden Thinking-Blöcke aus dem Cache entfernt, was die Kosten in Multi-Turn-Konversationen erhöhen kann. Wir empfehlen, Thinking zu aktivieren, wenn die Leistungsvorteile den Caching-Kompromiss überwiegen.

## Andere Migrations-Szenarien

Die oben behandelten primären Migrationspfade (Sonnet 3.7 → 4.5 und Haiku 3.5 → 4.5) stellen die häufigsten Upgrades dar. Sie können jedoch von anderen Claude-Modellen zu Claude 4.5 migrieren. Dieser Abschnitt behandelt diese Szenarien.

### Migration von Claude Sonnet 4 → Sonnet 4.5

**Breaking Change**: Können nicht sowohl `temperature` als auch `top_p` in derselben Anfrage angeben.

Alle anderen API-Aufrufe funktionieren ohne Änderung. Aktualisieren Sie Ihre Modell-ID und passen Sie Sampling-Parameter bei Bedarf an:

```python
# Before (Claude Sonnet 4)
model="claude-sonnet-4-20250514"

# After (Claude Sonnet 4.5)
model="claude-sonnet-4-5-20250929"
```

### Migration von Claude Opus 4.1 → Sonnet 4.5

**Keine Breaking Changes.** Alle API-Aufrufe funktionieren ohne Änderung.

Aktualisieren Sie einfach Ihre Modell-ID:

```python
# Before (Claude Opus 4.1)
model="claude-opus-4-1-20250805"

# After (Claude Sonnet 4.5)
model="claude-sonnet-4-5-20250929"
```

Claude Sonnet 4.5 ist unser intelligentestes Modell mit erstklassigen Fähigkeiten in Reasoning, Coding und langfristigen Agent-Funktionen. Es bietet überlegene Performance im Vergleich zu Opus 4.1 für die meisten Anwendungsfälle.

### Migration von Claude Opus 4.1 → Opus 4.5

**Keine Breaking Changes.** Alle API-Aufrufe funktionieren ohne Änderung.

Aktualisieren Sie einfach Ihre Modell-ID:

```python
# Before (Claude Opus 4.1)
model="claude-opus-4-1-20250805"

# After (Claude Opus 4.5)
model="claude-opus-4-5-20251101"
```

Claude Opus 4.5 ist unser intelligentestes Modell und kombiniert maximale Fähigkeit mit praktischer Performance. Es bietet Schritt-für-Schritt-Verbesserungen in Vision, Coding und Computer-Use zu einem zugänglicheren Preis als Opus 4.1. Ideal für komplexe spezialisierte Aufgaben und professionelle Software-Engineering.

<Note>
Für Codebases mit vielen Modellreferenzen ist ein [Claude Code Plugin](https://github.com/anthropics/claude-code/tree/main/plugins/claude-opus-4-5-migration) verfügbar, um die Migration zu Opus 4.5 zu automatisieren.
</Note>

### Migration zwischen Claude 4.5-Modellen

**Keine Breaking Changes.** Alle API-Aufrufe funktionieren ohne Änderung.

Aktualisieren Sie einfach Ihre Modell-ID.

## Benötigen Sie Hilfe?

- Überprüfen Sie unsere [API-Dokumentation](/docs/de/api/overview) für detaillierte Spezifikationen
- Überprüfen Sie [Modell-Fähigkeiten](/docs/de/about-claude/models/overview) für Performance-Vergleiche
- Überprüfen Sie [API-Versionshinweise](/docs/de/release-notes/api) für API-Updates
- Kontaktieren Sie den Support, wenn Sie während der Migration auf Probleme stoßen