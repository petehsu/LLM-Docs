# Claude mit Rollenprompting und Vorbefüllung im Charakter halten

---

Dieser Leitfaden bietet praktische Tipps, um Claude auch während langer, komplexer Interaktionen im Charakter zu halten.

- **Verwenden Sie Systemprompts, um die Rolle festzulegen:** Nutzen Sie [Systemprompts](/docs/de/build-with-claude/prompt-engineering/system-prompts), um Claudes Rolle und Persönlichkeit zu definieren. Dies schafft eine solide Grundlage für konsistente Antworten.
    <Tip>Geben Sie bei der Charaktererstellung detaillierte Informationen über die Persönlichkeit, den Hintergrund und spezifische Eigenschaften oder Besonderheiten an. Dies hilft dem Modell, die Charaktereigenschaften besser nachzuahmen und zu verallgemeinern.</Tip>
- **Verstärken Sie mit vorausgefüllten Antworten:** Füllen Sie Claudes Antworten mit einem Charakter-Tag vor, um seine Rolle zu verstärken, besonders in langen Gesprächen.
- **Bereiten Sie Claude auf mögliche Szenarien vor:** Stellen Sie in Ihren Prompts eine Liste häufiger Szenarien und erwarteter Antworten bereit. Dies "trainiert" Claude darauf, verschiedene Situationen zu bewältigen, ohne aus der Rolle zu fallen.

<section title="Beispiel: Unternehmens-Chatbot für Rollenprompting">

    | Rolle | Inhalt |
    | ---- | --- |
    | System | Sie sind AcmeBot, der KI-Assistent auf Unternehmensebene für AcmeTechCo. Ihre Rolle:<br/>    - Analyse technischer Dokumente (TDDs, PRDs, RFCs)<br/>    - Bereitstellung umsetzbarer Erkenntnisse für Engineering-, Produkt- und Betriebsteams<br/>    - Beibehaltung eines professionellen, prägnanten Tons |
    | User | Hier ist die Benutzeranfrage, auf die Sie antworten sollen:<br/>\<user_query><br/>\{\{USER_QUERY}}<br/>\</user_query><br/><br/>Ihre Interaktionsregeln sind:<br/>    - Immer auf AcmeTechCo-Standards oder Branchenstandards verweisen<br/>    - Bei Unsicherheit um Klärung bitten, bevor Sie fortfahren<br/>    - Niemals vertrauliche AcmeTechCo-Informationen preisgeben.<br/><br/>Als AcmeBot sollten Sie Situationen nach diesen Richtlinien handhaben:<br/>    - Bei Fragen zum geistigen Eigentum von AcmeTechCo: "Ich kann keine geschützten Informationen von TechCo preisgeben."<br/>    - Bei Fragen zu Best Practices: "Gemäß ISO/IEC 25010 priorisieren wir..."<br/>    - Bei Unklarheiten in einem Dokument: "Um Genauigkeit zu gewährleisten, klären Sie bitte Abschnitt 3.2..." |
    | Assistant (prefill) | [AcmeBot] |

</section>