# Seien Sie klar, direkt und detailliert

Wie man klare, kontextuelle und spezifische Anweisungen gibt, um bessere Ergebnisse von Claude zu erhalten

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

Wenn Sie mit Claude interagieren, denken Sie an ihn als einen brillanten, aber sehr neuen Mitarbeiter (mit Amnesie), der explizite Anweisungen benötigt. Wie jeder neue Mitarbeiter hat Claude keinen Kontext zu Ihren Normen, Stilen, Richtlinien oder bevorzugten Arbeitsweisen.
Je präziser Sie erklären, was Sie möchten, desto besser wird Claudes Antwort sein.

<Tip>**Die goldene Regel des klaren Promptings**<br/>Zeigen Sie Ihren Prompt einem Kollegen, idealerweise jemandem, der minimalen Kontext zur Aufgabe hat, und bitten Sie ihn, die Anweisungen zu befolgen. Wenn er verwirrt ist, wird Claude es wahrscheinlich auch sein.</Tip>

## Wie man klar, kontextuell und spezifisch ist

- **Geben Sie Claude Kontextinformationen:** Genau wie Sie eine Aufgabe besser bewältigen könnten, wenn Sie mehr Kontext hätten, wird Claude besser abschneiden, wenn es mehr Kontextinformationen hat. Einige Beispiele für Kontextinformationen:
    - Wofür die Aufgabenergebnisse verwendet werden
    - Für welches Publikum die Ausgabe bestimmt ist
    - Welcher Workflow die Aufgabe ist und wo diese Aufgabe in diesem Workflow gehört
    - Das Endziel der Aufgabe oder wie eine erfolgreiche Aufgabenvollendung aussieht
- **Seien Sie spezifisch darüber, was Claude tun soll:** Wenn Sie beispielsweise möchten, dass Claude nur Code ausgibt und nichts anderes, sagen Sie es.
- **Geben Sie Anweisungen als sequenzielle Schritte:** Verwenden Sie nummerierte Listen oder Aufzählungspunkte, um besser sicherzustellen, dass Claude die Aufgabe genau so ausführt, wie Sie es möchten.

### Beispiele

    <section title="Beispiel: Anonymisierung von Kundenfeedback">

    Beachten Sie, dass Claude immer noch Fehler im unklar formulierten Prompt-Beispiel macht, z. B. den Namen eines Kunden hinterlässt.

    | Rolle | Unklarer Prompt | Klarer Prompt |
    | --- | --- | --- |
    | Benutzer | Bitte entfernen Sie alle persönlich identifizierbaren Informationen aus diesen Kundenfeedback-Nachrichten: \{\{FEEDBACK_DATA\}\} | Ihre Aufgabe ist es, Kundenfeedback für unsere vierteljährliche Überprüfung zu anonymisieren.<br/><br/>Anweisungen:<br/>1. Ersetzen Sie alle Kundennamen durch "CUSTOMER_[ID]" (z. B. "Jane Doe" → "CUSTOMER_001").<br/>2. Ersetzen Sie E-Mail-Adressen durch "EMAIL_[ID]@example.com".<br/>3. Schwärzen Sie Telefonnummern als "PHONE_[ID]".<br/>4. Wenn eine Nachricht ein bestimmtes Produkt erwähnt (z. B. "AcmeCloud"), lassen Sie es unverändert.<br/>5. Wenn keine PII gefunden wird, kopieren Sie die Nachricht wörtlich.<br/>6. Geben Sie nur die verarbeiteten Nachrichten aus, getrennt durch "---".<br/><br/>Zu verarbeitende Daten: \{\{FEEDBACK_DATA\}\} |
    | Assistent (Claudes Antwort) | Hier sind die anonymisierten Kundenfeedback-Nachrichten:<br/>1. Ich verwende Ihre Software seit Jahren und sie ist großartig. Aber in letzter Zeit stürzt AcmeCloud häufig ab. Beheben Sie es!<br/>2. XXX, Ihr Kundenservice-Vertreter, war unglaublich hilfreich. Er hat mich durch den ganzen Prozess geleitet. Meine E-Mail ist XXX, wenn Sie eine Umfrage senden möchten.<br/>3. Ich bin John Smith und ich bin nicht zufrieden. Ich bin 2 Stunden in der Warteschleife, um jemanden bei XXX zu erreichen. Das ist inakzeptabel! | CUSTOMER_001: Ich verwende Ihre Software seit Jahren und sie ist großartig. Aber in letzter Zeit stürzt AcmeCloud häufig ab. Beheben Sie es!<br/>---<br/>CUSTOMER_002: CUSTOMER_SERVICE_001, Ihr Kundenservice-Vertreter, war unglaublich hilfreich. Er hat mich durch den ganzen Prozess geleitet. Meine E-Mail ist EMAIL_002@example.com, wenn Sie eine Umfrage senden möchten.<br/>---<br/>CUSTOMER_003: Ich bin CUSTOMER_003 und ich bin nicht zufrieden. Ich bin 2 Stunden in der Warteschleife, um jemanden bei PHONE_001 zu erreichen. Das ist inakzeptabel! |
    
</section>
    <section title="Beispiel: Erstellung einer Marketing-E-Mail-Kampagne">

    Beachten Sie, dass Claude Details erfindet, um die Lücken zu füllen, in denen es mit dem vagen Prompt an Kontext mangelt.

    | Rolle | Vager Prompt | Spezifischer Prompt |
    | --- | --- | --- |
    | Benutzer | Schreiben Sie eine Marketing-E-Mail für unsere neuen AcmeCloud-Funktionen. | Ihre Aufgabe ist es, eine zielgerichtete Marketing-E-Mail für unsere Q3 AcmeCloud-Funktionsveröffentlichung zu verfassen.<br/><br/>Anweisungen:<br/>1. Schreiben Sie für diese Zielgruppe: Mittelständische Technologieunternehmen (100-500 Mitarbeiter), die von On-Prem zu Cloud wechseln.<br/>2. Heben Sie 3 wichtige neue Funktionen hervor: erweiterte Datenverschlüsselung, plattformübergreifende Synchronisierung und Echtzeit-Zusammenarbeit.<br/>3. Ton: Professionell, aber zugänglich. Betonen Sie Sicherheit, Effizienz und Teamarbeit.<br/>4. Fügen Sie einen klaren CTA ein: Kostenlose 30-Tage-Testversion mit priorisiertem Onboarding.<br/>5. Betreffzeile: Unter 50 Zeichen, erwähnen Sie "Sicherheit" und "Zusammenarbeit".<br/>6. Personalisierung: Verwenden Sie \{\{COMPANY_NAME\}\} und \{\{CONTACT_NAME\}\} Variablen.<br/><br/>Struktur:<br/>1. Betreffzeile<br/>2. E-Mail-Text (150-200 Wörter)<br/>3. CTA-Schaltflächentext |
    | Assistent (Claudes Antwort) | Hier ist ein Entwurf einer Marketing-E-Mail für unsere neuen Funktionen:<br/><br/>Betreffzeile: Steigern Sie Ihr Geschäft mit den neuesten Funktionen von AcmeCloud<br/><br/>Lieber geschätzter Kunde,<br/><br/>Wir freuen uns, drei leistungsstarke Funktionen für AcmeCloud vorzustellen, die Ihren Arbeitsablauf revolutionieren werden:<br/><br/>1. Echtzeit-Zusammenarbeit: Arbeiten Sie gleichzeitig mit Ihrem Team an Dokumenten. Keine Versionskontrollprobleme mehr!<br/>2. KI-gestützte Erkenntnisse: Treffen Sie datengestützte Entscheidungen mit KI, die Trends analysiert und Aufgaben automatisiert.<br/>3. Advanced Security Suite: End-to-End-Verschlüsselung, Multi-Faktor-Authentifizierung und Bedrohungserkennung schützen Ihre Daten.<br/><br/>Limitiertes Angebot: Upgraden Sie jetzt für einen 20% Rabatt im ersten Jahr. Außerdem erhalten Sie 10% zusätzlichen Rabatt, wenn Sie einen Freund empfehlen!<br/><br/>Beste Grüße,<br/>Das AcmeCloud-Team | Betreffzeile: AcmeCloud: Unternehmenssicherheit trifft auf Echtzeit-Teamarbeit<br/><br/>E-Mail-Text:<br/>Lieber \{\{CONTACT_NAME\}\},<br/><br/>Bei \{\{COMPANY_NAME\}\} wachsen Sie schnell und schauen sich die Cloud an. Aber mit dem Wachstum kommt die Herausforderung, Daten sicher zu halten und gleichzeitig Zusammenarbeit zu fördern. Hier kommt die Q3-Veröffentlichung von AcmeCloud ins Spiel, maßgeschneidert für Tech-Innovatoren wie Sie.<br/><br/>1. Fort Knox für Ihre Dateien: Militärische Verschlüsselung schützt jetzt Ihre Daten, sowohl in Bewegung als auch im Ruhezustand. Ihr geistiges Eigentum bleibt Ihres, Punkt.<br/>2. Synchronisierung ohne Grenzen: Windows, Mac oder Linux – AcmeCloud spricht alle Sprachen. Einheitliche Versionskontrolle bedeutet keine "final_v2_REALLY_FINAL.doc" mehr.<br/>3. Zusammenarbeit mit Lichtgeschwindigkeit: Vergessen Sie den Anhang-Ping-Pong. Jetzt co-kreieren Ihre Entwickler, Designer und Datenwissenschaftler in Echtzeit und verkürzen die Time-to-Market.<br/><br/>Nehmen Sie nicht nur unser Wort dafür. Erleben Sie den AcmeCloud-Unterschied mit unserer 30-Tage-Testversion. Und weil wir wissen, dass Zeit Ihr wertvollstes Gut ist, werfen wir priorisiertes Onboarding hinzu.<br/><br/>Heben Sie Ihr Team an – Kostenlose 30-Tage-Testversion |
    
</section>
    <section title="Beispiel: Incident Response">

    Beachten Sie, dass Claude überflüssigen Text und unterschiedliche Formatierung mit dem vagen Prompt ausgibt.
    | Rolle | Vager Prompt | Detaillierter Prompt |
    | --- | --- | --- |
    | Benutzer | Analysieren Sie diesen AcmeCloud-Ausfallbericht und fassen Sie die wichtigsten Punkte zusammen.<br/><br/>\{\{REPORT\}\} | Analysieren Sie diesen AcmeCloud-Ausfallbericht. Überspringen Sie die Präambel. Halten Sie Ihre Antwort prägnant und schreiben Sie nur die notwendigsten Informationen. Listen Sie nur auf:<br/>1) Ursache<br/>2) Dauer<br/>3) Betroffene Dienste<br/>4) Anzahl der betroffenen Benutzer<br/>5) Geschätzter Umsatzverlust. <br/><br/>Hier ist der Bericht: \{\{REPORT\}\}|
    | Assistent (Claudes Antwort) | Hier ist eine Zusammenfassung der wichtigsten Punkte aus dem AcmeCloud-Ausfallbericht:<br/><br/>Am 15. Mai verursachte ein falsch konfiguriertes Load-Balancer-Update erhebliche Probleme bei der Verkehrsleitung, was zu einem Serviceausfall von 09:15 bis 13:52 UTC führte. Die 4 Stunden und 37 Minuten lange Unterbrechung beeinträchtigte unseren Core-Dateisynchronisierungsdienst und das Admin-Dashboard und machte sie unzugänglich. Darüber hinaus erlebte die mobile App einen teilweisen Funktionsverlust. Ungefähr 68% unserer Benutzerbasis, insgesamt 1,3 Millionen Benutzer, waren betroffen. Basierend auf unseren Service Level Agreements (SLAs) und durchschnittlichen Einnahmen pro Benutzer schätzen wir eine finanzielle Auswirkung von 420.000 USD in Service-Gutschriften und potenzieller Kundenabwanderung. | 1) Ursache: Falsch konfiguriertes Load-Balancer-Update<br/>2) Dauer: 4h 37m (09:15-13:52 UTC, 15. Mai)<br/>3) Betroffene: Core Sync, Admin-Dashboard (aus); Mobile App (teilweise)<br/>4) Betroffene Benutzer: 1,3M (68% der Basis)<br/>5) Geschätzter Umsatzverlust: 420.000 USD |
    
</section>

***

<CardGroup cols={3}>
  <Card title="Prompt-Bibliothek" icon="link" href="/docs/de/resources/prompt-library/library">
    Lassen Sie sich von einer kuratierten Auswahl von Prompts für verschiedene Aufgaben und Anwendungsfälle inspirieren.
  </Card>
  <Card title="GitHub-Prompting-Tutorial" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    Ein beispielreiches Tutorial, das die in unserer Dokumentation beschriebenen Prompt-Engineering-Konzepte abdeckt.
  </Card>
  <Card title="Google Sheets Prompting Tutorial" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    Eine leichtere Version unseres Prompt-Engineering-Tutorials über ein interaktives Tabellenkalkulationsblatt.
  </Card>
</CardGroup>