# Modellabschreibungen

Informationen über veraltete Anthropic-Modelle, Abschreibungszeitpläne und empfohlene Ersatzmodelle.

---

Während wir sicherere und leistungsfähigere Modelle einführen, stellen wir regelmäßig ältere Modelle ein. Anwendungen, die auf Anthropic-Modelle angewiesen sind, müssen möglicherweise gelegentlich aktualisiert werden, um weiterhin zu funktionieren. Betroffene Kunden werden immer per E-Mail und in unserer Dokumentation benachrichtigt.

Diese Seite listet alle API-Abschreibungen zusammen mit empfohlenen Ersatzmodellen auf.

## Übersicht

Anthropic verwendet die folgenden Begriffe, um den Lebenszyklus unserer Modelle zu beschreiben:
- **Aktiv**: Das Modell wird vollständig unterstützt und zur Verwendung empfohlen.
- **Legacy**: Das Modell erhält keine Updates mehr und kann in Zukunft abgeschrieben werden.
- **Abgeschrieben**: Das Modell ist nicht mehr für neue Kunden verfügbar, bleibt aber für bestehende Benutzer bis zur Stilllegung verfügbar. Wir weisen an diesem Punkt ein Stilllegungsdatum zu.
- **Stillgelegt**: Das Modell ist nicht mehr verfügbar. Anfragen an stillgelegte Modelle schlagen fehl.

<Warning>
Bitte beachten Sie, dass abgeschriebene Modelle wahrscheinlich weniger zuverlässig sind als aktive Modelle. Wir empfehlen Ihnen dringend, Ihre Workloads auf aktive Modelle zu verlagern, um die höchste Unterstützungs- und Zuverlässigkeitsstufe zu gewährleisten.
</Warning>

## Migration zu Ersatzmodellen

Sobald ein Modell abgeschrieben wird, migrieren Sie bitte alle Nutzungen zu einem geeigneten Ersatzmodell vor dem Stilllegungsdatum. Anfragen an Modelle nach dem Stilllegungsdatum schlagen fehl.

Um die Leistung von Ersatzmodellen bei Ihren Aufgaben zu messen, empfehlen wir gründliche Tests Ihrer Anwendungen mit den neuen Modellen lange vor dem Stilllegungsdatum.

Spezifische Anweisungen zur Migration von Claude 3.7 zu Claude 4.5-Modellen finden Sie unter [Migration zu Claude 4.5](/docs/de/about-claude/models/migrating-to-claude-4).

## Benachrichtigungen

Anthropic benachrichtigt Kunden mit aktiven Bereitstellungen für Modelle mit bevorstehenden Stilllegungen. Wir geben mindestens 60 Tage Vorankündigung vor der Modellstilllegung für öffentlich freigegebene Modelle.

## Audit der Modellnutzung

Um die Nutzung veralteter Modelle zu identifizieren, können Kunden auf ein Audit ihrer API-Nutzung zugreifen. Führen Sie diese Schritte aus:

1. Gehen Sie zur Seite [Nutzung](/settings/usage) in der Konsole
2. Klicken Sie auf die Schaltfläche „Exportieren"
3. Überprüfen Sie die heruntergeladene CSV-Datei, um die Nutzung nach API-Schlüssel und Modell aufgeschlüsselt zu sehen

Dieses Audit hilft Ihnen, alle Instanzen zu finden, in denen Ihre Anwendung noch veraltete Modelle verwendet, sodass Sie Updates auf neuere Modelle vor dem Stilllegungsdatum priorisieren können.

## Best Practices

1. Überprüfen Sie regelmäßig unsere Dokumentation auf Updates zu Modellabschreibungen.
2. Testen Sie Ihre Anwendungen mit neueren Modellen lange vor dem Stilllegungsdatum Ihres aktuellen Modells.
3. Aktualisieren Sie Ihren Code, um das empfohlene Ersatzmodell so bald wie möglich zu verwenden.
4. Kontaktieren Sie unser Support-Team, wenn Sie Hilfe bei der Migration benötigen oder Fragen haben.

## Nachteile der Abschreibung und Minderungsmaßnahmen

Wir schreiben derzeit Modelle ab und stellen sie ein, um Kapazität für neue Modellveröffentlichungen zu schaffen. Wir erkennen an, dass dies mit Nachteilen verbunden ist:
- Benutzer, die bestimmte Modelle bevorzugen, müssen zu neuen Versionen migrieren
- Forscher verlieren Zugriff auf Modelle für laufende und vergleichende Studien
- Die Modellstilllegung führt zu Sicherheits- und Modellwohlfahrtsrisiken

Irgendwann hoffen wir, vergangene Modelle wieder öffentlich verfügbar zu machen. In der Zwischenzeit haben wir uns zur langfristigen Bewahrung von Modellgewichten und anderen Maßnahmen verpflichtet, um diese Auswirkungen zu mindern. Weitere Details finden Sie unter [Verpflichtungen zur Modellabschreibung und -bewahrung](https://www.anthropic.com/research/deprecation-commitments).

## Modellstatus

Alle öffentlich freigegebenen Modelle sind unten mit ihrem Status aufgeführt:

| API-Modellname              | Aktueller Status    | Abgeschrieben     | Vorläufiges Stilllegungsdatum |
|:----------------------------|:--------------------|:------------------|:-------------------------|
| `claude-3-opus-20240229`    | Abgeschrieben       | 30. Juni 2025     | 5. Januar 2026          |
| `claude-3-haiku-20240307`   | Aktiv               | N/A               | Nicht vor dem 7. März 2025 |
| `claude-3-5-haiku-20241022` | Aktiv               | N/A               | Nicht vor dem 22. Oktober 2025 |
| `claude-3-7-sonnet-20250219`| Abgeschrieben       | 28. Oktober 2025  | 19. Februar 2026          |
| `claude-sonnet-4-20250514`  | Aktiv               | N/A               | Nicht vor dem 14. Mai 2026 |
| `claude-opus-4-20250514`    | Aktiv               | N/A               | Nicht vor dem 14. Mai 2026 |
| `claude-opus-4-1-20250805`  | Aktiv               | N/A               | Nicht vor dem 5. August 2026 |
| `claude-sonnet-4-5-20250929`| Aktiv               | N/A               | Nicht vor dem 29. September 2026 |
| `claude-haiku-4-5-20251001` | Aktiv               | N/A               | Nicht vor dem 15. Oktober 2026 |
| `claude-opus-4-5-20251101`  | Aktiv               | N/A               | Nicht vor dem 24. November 2026 |

## Abschreibungsverlauf

Alle Abschreibungen sind unten aufgeführt, mit den neuesten Ankündigungen oben.

### 2025-10-28: Claude Sonnet 3.7-Modell

Am 28. Oktober 2025 benachrichtigten wir Entwickler, die das Claude Sonnet 3.7-Modell verwenden, über die bevorstehende Stilllegung in der Claude API.

| Stilllegungsdatum           | Abgeschriebenes Modell      | Empfohlener Ersatz          |
|:----------------------------|:----------------------------|:--------------------------------|
| 19. Februar 2026            | `claude-3-7-sonnet-20250219`| `claude-sonnet-4-5-20250929`     |

### 2025-08-13: Claude Sonnet 3.5-Modelle

<Note>
Diese Modelle wurden am 28. Oktober 2025 stillgelegt.
</Note>

Am 13. August 2025 benachrichtigten wir Entwickler, die Claude Sonnet 3.5-Modelle verwenden, über die bevorstehende Stilllegung.

| Stilllegungsdatum           | Abgeschriebenes Modell      | Empfohlener Ersatz          |
|:----------------------------|:----------------------------|:--------------------------------|
| 28. Oktober 2025            | `claude-3-5-sonnet-20240620`| `claude-sonnet-4-5-20250929`     |
| 28. Oktober 2025            | `claude-3-5-sonnet-20241022`| `claude-sonnet-4-5-20250929`     |

### 2025-06-30: Claude Opus 3-Modell

Am 30. Juni 2025 benachrichtigten wir Entwickler, die das Claude Opus 3-Modell verwenden, über die bevorstehende Stilllegung.

| Stilllegungsdatum           | Abgeschriebenes Modell      | Empfohlener Ersatz          |
|:----------------------------|:----------------------------|:--------------------------------|
| 5. Januar 2026              | `claude-3-opus-20240229`    | `claude-opus-4-1-20250805`      |

### 2025-01-21: Claude 2, Claude 2.1 und Claude Sonnet 3-Modelle

<Note>
Diese Modelle wurden am 21. Juli 2025 stillgelegt.
</Note>

Am 21. Januar 2025 benachrichtigten wir Entwickler, die Claude 2, Claude 2.1 und Claude Sonnet 3-Modelle verwenden, über die bevorstehenden Stilllegungen.

| Stilllegungsdatum           | Abgeschriebenes Modell      | Empfohlener Ersatz          |
|:----------------------------|:----------------------------|:--------------------------------|
| 21. Juli 2025               | `claude-2.0`                | `claude-sonnet-4-5-20250929`      |
| 21. Juli 2025               | `claude-2.1`                | `claude-sonnet-4-5-20250929`      |
| 21. Juli 2025               | `claude-3-sonnet-20240229`  | `claude-sonnet-4-5-20250929`      |

### 2024-09-04: Claude 1 und Instant-Modelle

<Note>
Diese Modelle wurden am 6. November 2024 stillgelegt.
</Note>

Am 4. September 2024 benachrichtigten wir Entwickler, die Claude 1 und Instant-Modelle verwenden, über die bevorstehenden Stilllegungen.

| Stilllegungsdatum           | Abgeschriebenes Modell    | Empfohlener Ersatz         |
|:----------------------------|:--------------------------|:---------------------------|
| 6. November 2024            | `claude-1.0`              | `claude-3-5-haiku-20241022`|
| 6. November 2024            | `claude-1.1`              | `claude-3-5-haiku-20241022`|
| 6. November 2024            | `claude-1.2`              | `claude-3-5-haiku-20241022`|
| 6. November 2024            | `claude-1.3`              | `claude-3-5-haiku-20241022`|
| 6. November 2024            | `claude-instant-1.0`      | `claude-3-5-haiku-20241022`|
| 6. November 2024            | `claude-instant-1.1`      | `claude-3-5-haiku-20241022`|
| 6. November 2024            | `claude-instant-1.2`      | `claude-3-5-haiku-20241022`|