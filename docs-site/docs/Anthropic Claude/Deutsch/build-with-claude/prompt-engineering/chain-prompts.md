# Komplexe Prompts verketten für bessere Leistung

Erfahren Sie, wie Sie komplexe Aufgaben durch Prompt-Verkettung in kleinere, verwaltbare Schritte aufteilen, um die Genauigkeit und Klarheit zu verbessern.

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

Bei der Arbeit mit komplexen Aufgaben kann Claude manchmal scheitern, wenn Sie versuchen, alles in einem einzigen Prompt zu bewältigen. Chain of Thought (CoT) Prompting ist großartig, aber was ist, wenn Ihre Aufgabe mehrere unterschiedliche Schritte hat, die jeweils tiefgreifendes Denken erfordern?

Hier kommt Prompt-Verkettung ins Spiel: das Aufteilen komplexer Aufgaben in kleinere, verwaltbare Teilaufgaben.

## Warum Prompts verketten?

1. **Genauigkeit**: Jede Teilaufgabe erhält Claudes volle Aufmerksamkeit, was Fehler reduziert.
2. **Klarheit**: Einfachere Teilaufgaben bedeuten klarere Anweisungen und Ausgaben.
3. **Rückverfolgbarkeit**: Probleme in Ihrer Prompt-Kette lassen sich leicht identifizieren und beheben.

***

## Wann sollten Sie Prompts verketten?

Verwenden Sie Prompt-Verkettung für mehrstufige Aufgaben wie Forschungssynthese, Dokumentenanalyse oder iterative Inhaltserstellung. Wenn eine Aufgabe mehrere Transformationen, Zitate oder Anweisungen beinhaltet, verhindert die Verkettung, dass Claude Schritte übersieht oder falsch handhabt.

**Denken Sie daran:** Jedes Glied in der Kette erhält Claudes volle Aufmerksamkeit!

<Tip>**Debugging-Tipp**: Wenn Claude einen Schritt übersieht oder schlecht abschneidet, isolieren Sie diesen Schritt in seinem eigenen Prompt. Dies ermöglicht es Ihnen, problematische Schritte zu optimieren, ohne die gesamte Aufgabe zu wiederholen.</Tip>

***

## Wie man Prompts verkettet

1. **Teilaufgaben identifizieren**: Teilen Sie Ihre Aufgabe in unterschiedliche, sequenzielle Schritte auf.
2. **Mit XML für klare Übergaben strukturieren**: Verwenden Sie XML-Tags, um Ausgaben zwischen Prompts zu übergeben.
3. **Ein Ziel pro Aufgabe haben**: Jede Teilaufgabe sollte ein einzelnes, klares Ziel haben.
4. **Iterieren**: Verfeinern Sie Teilaufgaben basierend auf Claudes Leistung.

### Beispiele für verkettete Workflows:
- **Mehrstufige Analyse**: Siehe die rechtlichen und geschäftlichen Beispiele unten.
- **Content-Creation-Pipelines**: Recherche → Gliederung → Entwurf → Bearbeitung → Formatierung.
- **Datenverarbeitung**: Extrahieren → Transformieren → Analysieren → Visualisieren.
- **Entscheidungsfindung**: Informationen sammeln → Optionen auflisten → Jede analysieren → Empfehlen.
- **Überprüfungsschleifen**: Inhalt generieren → Überprüfen → Verfeinern → Erneut überprüfen.

<Tip>**Optimierungstipp**: Für Aufgaben mit unabhängigen Teilaufgaben (wie das Analysieren mehrerer Dokumente) erstellen Sie separate Prompts und führen Sie diese parallel aus, um schneller zu sein.</Tip>

### Erweitert: Selbstkorrektur-Ketten

Sie können Prompts verketten, damit Claude seine eigene Arbeit überprüft! Dies erfasst Fehler und verfeinert Ausgaben, besonders bei hochriskanten Aufgaben.

  <section title="Beispiel: Selbstkorrigierende Forschungszusammenfassung">

    #### Prompt 1
    | Rolle | Inhalt |
    | ---- | ------- |
    | Benutzer | Fassen Sie dieses medizinische Forschungspapier zusammen.<br/><br/>\\{\{RESEARCH_PAPER}}\</paper><br/><br/>Konzentrieren Sie sich auf Methodik, Ergebnisse und klinische Implikationen. |
    | Assistent<br/>\{\{SUMMARY}} | Methodik: Doppelblinde RCT mit 500 Typ-2-Diabetes-Patienten. Gruppe A (n=250) erhielt einen neuartigen GLP-1/GIP-Dual-Agonisten; Gruppe B (n=250) erhielt einen Standard-GLP-1-Agonisten. 24-Wochen-Studie, primärer Endpunkt: HbA1c-Reduktion.<br/><br/>Ergebnisse:<br/>- Gruppe A: 1,8% durchschnittliche HbA1c-Reduktion<br/>- Gruppe B: 1,1% durchschnittliche HbA1c-Reduktion<br/>- 68% der Gruppe A vs. 52% der Gruppe B erreichten HbA1c \<7%<br/>- Gruppe A: 5,2 kg durchschnittlicher Gewichtsverlust<br/>- Gruppe B: 3,1 kg durchschnittlicher Gewichtsverlust<br/><br/>Sicherheit: Ähnliche Nebenwirkungsprofile, keine schwerwiegenden Ereignisse, die der Behandlung zugeordnet werden.<br/><br/>Klinische Implikationen: Der Dual-Agonist zeigt eine überlegene glykämische Kontrolle und Gewichtsverlust im Vergleich zur Standardtherapie. Könnte ein Game-Changer sein, besonders für übergewichtige Diabetiker. |
    
    #### Prompt 2
    | Rolle | Inhalt |
    | ---- | ------- |
    | Benutzer | Ihre Aufgabe ist es, Feedback zu einer Zusammenfassung eines Forschungspapiers zu geben. Hier ist eine Zusammenfassung eines medizinischen Forschungspapiers:<br/>\<summary><br/>\{\{SUMMARY\}\}<br/>\</summary><br/><br/>Hier ist das Forschungspapier:<br/>\<br/>\{\{RESEARCH_PAPER\}\}<br/>\</paper><br/><br/>Überprüfen Sie diese Zusammenfassung auf Genauigkeit, Klarheit und Vollständigkeit auf einer Skala von A bis F. |
    | Assistent<br/>\{\{FEEDBACK}} | 1. Genauigkeit: A<br/>   - Korrekt gemeldete Schlüsselstatistiken: HbA1c-Reduktionen, Gewichtsverlust.<br/>   - Genau vermerkt Sicherheitsprofil und Fehlen schwerwiegender Nebenwirkungen.<br/>   - Behauptung eines "Game-Changers" ist durch signifikant bessere Ergebnisse gerechtfertigt.<br/><br/>2. Klarheit: A-<br/>   - Prägnant und gut strukturiert mit klaren Abschnitten.<br/>   - Gute Verwendung von Vergleichssprache (z.B. "um 3% von Q1") für Kontext.<br/>   - Kleineres Problem: Akronyme wie "RCT", "GLP-1" und "GIP" sind nicht definiert. Erwägen Sie, die erste Verwendung auszuschreiben.<br/><br/>3. Vollständigkeit: B+<br/>   - Deckt alle angeforderten Bereiche ab: Methodik, Ergebnisse, klinische Implikationen.<br/>   - Fehlend: Baseline-Charakteristiken der Gruppen (waren sie gut abgestimmt?).<br/>   - Fehlend: Alle sekundären Endpunkte (z.B. Blutdruck, Lipide).<br/>   - Überlegung: Langzeitimplikationen oder Bedarf für weitere Forschung.<br/><br/>Insgesamt ist die Zusammenfassung genau und klar und bietet wichtige Erkenntnisse für ein schnelles Verständnis der Studie. Um auf A+ zu erheben, definieren Sie Akronyme, erwähnen Sie Baseline-Statistiken der Gruppe, notieren Sie sekundäre Ergebnisse und berühren Sie kurz den Bedarf für Langzeitstudien. |
    
     #### Prompt 3
    | Rolle | Inhalt |
    | ---- | ------- |
    | Benutzer | Ihre Aufgabe ist es, eine Papierzusammenfassung basierend auf Feedback zu verbessern. Hier ist der erste Entwurf eines medizinischen Forschungspapiers:<br/>\<summary><br/>\{\{SUMMARY\}\}<br/>\</summary><br/><br/>Hier ist das Forschungspapier:<br/>\<br/>\{\{RESEARCH_PAPER\}\}<br/>\</paper><br/><br/>Hier ist das Feedback:<br/>\<feedback><br/>\{\{FEEDBACK\}\}<br/>\</feedback><br/><br/>Aktualisieren Sie die Zusammenfassung basierend auf dem Feedback. |
    | Assistent | Methodik: Doppelblinde randomisierte kontrollierte Studie (RCT) mit 500 Typ-2-Diabetes-Patienten. Gruppe A (n=250) erhielt einen neuartigen Glucagon-ähnlichen Peptid-1/Glucose-abhängigen Insulinotropen Polypeptid (GLP-1/GIP) Dual-Agonisten; Gruppe B (n=250) erhielt einen Standard-GLP-1-Agonisten. Der primäre Endpunkt der 24-Wochen-Studie war die HbA1c-Reduktion. Die Gruppen waren gut abgestimmt für Alter, BMI und Baseline-HbA1c.<br/><br/>Ergebnisse:<br/>- Gruppe A: 1,8% durchschnittliche HbA1c-Reduktion<br/>- Gruppe B: 1,1% durchschnittliche HbA1c-Reduktion<br/>- 68% der Gruppe A vs. 52% der Gruppe B erreichten HbA1c \<7%<br/>- Gruppe A: 5,2 kg durchschnittlicher Gewichtsverlust<br/>- Gruppe B: 3,1 kg durchschnittlicher Gewichtsverlust<br/><br/>Sekundäre Endpunkte zeigten Verbesserungen bei Blutdruck und Lipidprofilen für beide Gruppen, wobei Gruppe A leicht bessere Ergebnisse zeigte.<br/><br/>Sicherheit: Ähnliche Nebenwirkungsprofile, ohne schwerwiegende Ereignisse, die einer der beiden Behandlungen zugeordnet werden.<br/><br/>Klinische Implikationen: Der Dual-GLP-1/GIP-Agonist zeigt überlegene glykämische Kontrolle und Gewichtsverlust im Vergleich zur Standard-GLP-1-Therapie. Diese Ergebnisse deuten darauf hin, dass es ein bedeutender Fortschritt sein könnte, besonders für übergewichtige Diabetiker. Allerdings sind längerfristige Studien erforderlich, um anhaltende Wirksamkeit und Sicherheit zu bestätigen, sowie um potenzielle Vorteile bei kardiovaskulären Ergebnissen zu untersuchen. |
  
</section>

***

## Beispiele

  <section title="Beispiel: Analyse eines Rechtsdokuments (ohne Verkettung)">

    Beachten Sie, dass Claude die Anweisung übersieht, vorgeschlagene Änderungen in seinem E-Mail-Entwurf bereitzustellen.

    | Rolle | Inhalt |
    | ---- | ------- |
    | Benutzer | Sie sind unser Chief Legal Officer. Überprüfen Sie diesen SaaS-Vertrag auf Risiken und konzentrieren Sie sich auf Datenschutz, SLAs und Haftungsgrenzen.<br/><br/>\<contract><br/>\{\{CONTRACT}}<br/>\</contract><br/><br/>Verfassen Sie dann eine E-Mail an den Anbieter mit Ihren Bedenken und vorgeschlagenen Änderungen. |
    | Assistent | Nach der Überprüfung des SaaS-Vertrags habe ich mehrere Bedenken identifiziert:<br/><br/>1. Datenschutz (Abschnitt 7):<br/>   - Problem: Der Anbieter hat umfangreiche Rechte, Kundendaten für "Serviceverbesserung" zu nutzen.<br/>   - Risiko: Könnte zu unbefugter Datenfreigabe oder Monetarisierung führen.<br/><br/>2. SLAs (Abschnitt 5):<br/>   - Problem: 99,5% Verfügbarkeitsgarantie liegt unter dem Industriestandard.<br/>   - Risiko: Übermäßige Ausfallzeiten könnten unsere Operationen beeinträchtigen.<br/><br/>3. Haftung (Abschnitt 9):<br/>   - Problem: Grenze auf 3 Monate Gebühren festgelegt.<br/>   - Risiko: Unzureichend für potenzielle Datenverletzungen oder Serviceausfälle.<br/><br/>E-Mail-Entwurf:<br/><br/>Liebe/r \{\{VENDOR}},<br/><br/>Nach der Überprüfung der SaaS-Vereinbarung haben wir Bedenken:<br/><br/>1. Datenschutz: Wir verlangen, dass unsere Daten nur für die direkte Servicebereitstellung verwendet werden, nicht für breite "Serviceverbesserung". Bitte ändern Sie Abschnitt 7.<br/><br/>2. SLAs: 99,5% Verfügbarkeit ist unzureichend. Wir benötigen 99,99% mit klar definierten Strafen. Bitte überarbeiten Sie Abschnitt 5.<br/><br/>3. Haftung: Die aktuelle Grenze von 3 Monaten Gebühren ist unzureichend. Wir schlagen eine Grenze von 12 Monaten Gebühren vor, ohne Grenze für Datenverletzungen oder vorsätzliches Fehlverhalten.<br/><br/>Wir schätzen unsere potenzielle Partnerschaft und glauben, dass diese Änderungen uns zum Erfolg verhelfen. Bitte senden Sie einen überarbeiteten Vertrag.<br/><br/>Mit freundlichen Grüßen,<br/>\{\{CLO_NAME}} |
  
</section>

  <section title="Beispiel: Analyse eines Rechtsdokuments (mit Verkettung)">

    #### Prompt 1    
    | Rolle | Inhalt |
    | ---- | ------- |
    | Benutzer | Sie sind unser Chief Legal Officer. Überprüfen Sie diesen SaaS-Vertrag auf Risiken und konzentrieren Sie sich auf Datenschutz, SLAs und Haftungsgrenzen.<br/><br/>\<contract><br/>\{\{CONTRACT}}<br/>\</contract><br/><br/>Geben Sie Ihre Erkenntnisse in \<risks> Tags aus. |
    | Assistent<br/>\{\{CONCERNS}} | 1. Datenschutz (Abschnitt 7):<br/>   - Problem: Der Anbieter hat umfangreiche Rechte, Kundendaten für "Serviceverbesserung" zu nutzen.<br/>   - Risiko: Könnte zu unbefugter Datenfreigabe oder Monetarisierung von Kundendaten führen.<br/>   - Auswirkung: Potenzieller Vertrauensbruch mit Kunden, behördliche Geldstrafen (GDPR, CCPA).<br/><br/>2. SLAs (Abschnitt 5):<br/>   - Problem: 99,5% Verfügbarkeitsgarantie liegt unter dem Industriestandard (typischerweise 99,99%).<br/>   - Risiko: Bis zu 43,8 Stunden Ausfallzeit pro Jahr vs. 52,6 Minuten bei 99,99%.<br/>   - Auswirkung: Betriebliche Störungen, Umsatzverluste, Kundenunzufriedenheit.<br/><br/>3. Haftung (Abschnitt 9):<br/>   - Problem: Haftungsgrenze auf 3 Monate Gebühren festgelegt.<br/>   - Risiko: Unzureichend für potenzielle Datenverletzungen, IP-Diebstahl oder längere Serviceausfälle.<br/>   - Auswirkung: Unzureichende Entschädigung für Schäden, die die Grenze weit übersteigen könnten, wie Sammelklagen oder behördliche Geldstrafen. |
    
    #### Prompt 2    
    | Rolle | Inhalt |
    | ---- | ------- |
    | Benutzer | Verfassen Sie eine E-Mail an einen SaaS-Produktanbieter, die die folgenden Bedenken aufzeigt und Änderungen vorschlägt. Hier sind die Bedenken:<br/>\<concerns><br/>\{\{CONCERNS\}\}<br/>\</concerns><br/><br/>|
    | Assistent<br/>\{\{EMAIL}} | Liebe/r \{\{VENDOR}},<br/><br/>Nach einer gründlichen Überprüfung der vorgeschlagenen SaaS-Vereinbarung hat unser Rechtsteam mehrere hochpriorisierte Bedenken identifiziert, die behoben werden müssen, bevor wir fortfahren können:<br/><br/>1. Datenschutz (Abschnitt 7):<br/>   - Aktuell: Umfangreiche Rechte zur Nutzung von Kundendaten für "Serviceverbesserung".<br/>   - Bedenken: Potenzielle unbefugte Datenfreigabe oder Monetarisierung.<br/>   - Vorgeschlagene Änderung: Beschränken Sie die Datennutzung auf direkte Servicebereitstellung. Jede Nutzung für Verbesserung, Analytik oder Marketing muss opt-in, widerrufbar und anonymisiert sein.<br/><br/>2. SLAs (Abschnitt 5):<br/>   - Aktuell: 99,5% Verfügbarkeitsgarantie.<br/>   - Bedenken: Bis zu 43,8 Stunden Ausfallzeit pro Jahr, was betriebliche Störungen riskiert.<br/>   - Vorgeschlagene Änderung: 99,99% Verfügbarkeit mit gestaffelten Servicegutschriften. Z.B. 10% Gutschrift für \<99,99%, 25% für \<99,9%, 50% für \<99,5%.<br/><br/>3. Haftung (Abschnitt 9):<br/>   - Aktuell: Grenze bei 3 Monaten Gebühren.<br/>   - Bedenken: Grob unzureichend für Datenverletzungen, IP-Diebstahl oder längere Ausfälle.<br/>   - Vorgeschlagene Änderung: 12 Monate Gebühren für allgemeine Haftung. Unbegrenzt für Datenverletzungen, vorsätzliches Fehlverhalten, IP-Verletzung.<br/><br/>Diese Änderungen sind für uns nicht verhandelbar. Sie entsprechen Industriestandards und unserem Engagement für Datensicherheit, operative Exzellenz und treuhänderische Verantwortung. Wir schätzen das Potenzial unserer Partnerschaft, und die Behebung dieser Punkte wird eine starke Grundlage schaffen.<br/><br/>Bitte lassen Sie Ihr Rechtsteam diese Änderungen überprüfen und einarbeiten. Wir sind gerne bereit, weitere Diskussionen zu führen, um gegenseitiges Verständnis und Vereinbarung zu gewährleisten.<br/><br/>Mit freundlichen Grüßen,<br/>\{\{CLO_NAME}} |
    
    #### Prompt 3    
    | Rolle | Inhalt |
    | ---- | ------- |
    | Benutzer | Ihre Aufgabe ist es, eine E-Mail zu überprüfen und Feedback zu geben. Hier ist die E-Mail:<br/>\<email><br/>\{\{EMAIL\}\}<br/>\</email><br/><br/>Geben Sie Feedback zu Ton, Klarheit und Professionalität. |
    | Assistent | 1. Ton:<br/>   - Professionell und selbstbewusst, ohne konfrontativ zu sein.<br/>   - Die Verwendung von "nicht verhandelbar" ist stark, aber angesichts der Kritikalität der Probleme gerechtfertigt.<br/>   - Kooperative Sprache ("wir schätzen", "gerne bereit") balanciert die Festigkeit und bewahrt einen konstruktiven Ton.<br/><br/>2. Klarheit:<br/>   - Ausgezeichnete Strukturierung: Aktueller Zustand, Bedenken und vorgeschlagene Änderung für jedes Problem.<br/>   - Technische Begriffe (z.B. "EBITDA", "gestaffelte Servicegutschriften") sind für einen B2B-SaaS-Kontext angemessen.<br/>   - Aktionselemente sind klar: Rechtsteam des Anbieters soll Änderungen überprüfen und einarbeiten.<br/><br/>3. Professionalität:<br/>   - Konzentriert sich auf gegenseitigen Nutzen und Industriestandards, nicht nur auf unsere Anforderungen.<br/>   - Erwähnt breitere Verantwortungen (Datensicherheit, operative Exzellenz, treuhänderische Pflicht) und hebt die Diskussion an.<br/>   - Bietet weitere Diskussionen an und zeigt Engagement für Verständnis und Problemlösung.<br/><br/>Insgesamt schlägt die E-Mail die richtige Balance zwischen Selbstbewusstsein und Zusammenarbeit. Sie artikuliert klar unsere Bedenken, schlägt spezifische Lösungen vor und bewahrt einen professionellen, partnerschaftsorientierten Ton. Keine Überarbeitungen erforderlich; fahren Sie mit dem Versand fort. |
  
</section>
  <section title="Beispiel: Überprüfung der Multitenancy-Strategie">

    #### Prompt 1    
    | Rolle | Inhalt |
    | ---- | ------- |
    | Benutzer | Als Senior Solutions Architect überprüfen und analysieren Sie diese Multitenancy-Strategie für unser neues Enterprise-SaaS-Produkt.<br/><br/>\<strategy><br/>\{\{STRATEGY}}<br/>\</strategy><br/><br/>Konzentrieren Sie sich auf Skalierbarkeit, Sicherheit und Kosteneffizienz. |
    | Assistent<br/>\{\{ANALYSIS}} | 1. Skalierbarkeit:<br/>   + Datenbank-Sharding nach Mandant reduziert Contention und unterstützt hohes Wachstum.<br/>   + Microservices ermöglichen unabhängige Skalierung von Komponenten.<br/>   - Gemeinsame App-Server könnten unter extremer Last zum Engpass werden.<br/>   - Keine Erwähnung von Auto-Scaling oder Load Balancing für App-Tier.<br/><br/>2. Sicherheit:<br/>   + Tenant-Datenisolation durch Sharding mindert Datenlecks.<br/>   + JWT mit kurzer Gültigkeitsdauer und Refresh-Tokens ist Best Practice der Industrie.<br/>   - Keine Erwähnung von Verschlüsselung (im Ruhezustand, in Transit) oder Schlüsselverwaltung.<br/>   - IAM-Strategie mangelt es an Details zu Rollen, Berechtigungen oder RBAC.<br/><br/>3. Kosteneffizienz:<br/>   + Gemeinsame App-Server reduzieren Kosten für untätige Ressourcen.<br/>   + Serverless-Funktionen für seltene Aufgaben optimieren Kosten.<br/>   - Pro-Tenant-DB könnte Kosten bei Skalierung erhöhen vs. optimierte Multi-Tenant-DB.<br/>   - Keine Diskussion über reservierte Instanzen oder Spot-Instanzen zur Kosteneinsparung. |
    
    #### Prompt 2    
    | Rolle | Inhalt |
    | ---- | ------- |
    | Benutzer | Verfassen Sie ein Strategieüberprüfungsdokument für die technische Leitung basierend auf dieser Analyse einer Multitenancy-Strategie.<br/><br/>\<strategy><br/>\{\{STRATEGY}}<br/>\</strategy><br/><br/>\<analysis><br/>\{\{ANALYSIS}}<br/>\</analysis><br/><br/>Fügen Sie eine Executive Summary, detaillierte Analyse und Empfehlungen ein. |
    | Assistent<br/>\{\{STRATEGY_DOC}} | # Überprüfung der Multitenancy-Strategie: SaaS-Enterprise-Produkt<br/><br/>## Executive Summary<br/>Die vorgeschlagene Strategie zeigt eine solide Grundlage in Skalierbarkeits- und Sicherheitsprinzipien, weist aber Lücken in den Implementierungsdetails auf. Sie zeichnet sich durch Datenisolation und Skalierung auf Komponentenebene aus, mangelt es aber an robuster Skalierung auf App-Tier-Ebene und fortgeschrittenen Sicherheitsmaßnahmen. Kostenoptimierungen sind vorhanden, könnten aber bei hoher Skalierung scheitern. Mit gezielten Verbesserungen kann diese Strategie unsere Enterprise-SaaS-Ambitionen effektiv unterstützen.<br/><br/>## Detaillierte Analyse<br/><br/>### 1. Skalierbarkeit: B+<br/><br/>Stärken:<br/>- Datenbank-Sharding nach Mandant ist ausgezeichnet. Es minimiert Abfragelatenz, unterstützt hohes Datenwachstum und ermöglicht nahtlose Pro-Mandant-Skalierung.<br/>- Microservices-Architektur ermöglicht Skalierung einzelner Komponenten basierend auf Nachfrage, entscheidend für die Handhabung vielfältiger Enterprise-Workloads.<br/><br/>Schwächen:<br/>- Gemeinsame Anwendungsserver riskieren, zum Engpass zu werden. Mit zunehmender Mandantenzahl und Traffic könnten diese die Leistung über alle Mandanten hinweg beeinträchtigen.<br/>- Das Fehlen von Auto-Scaling und Load Balancing für die App-Tier ist ein kritisches Versehen. Diese sind essentiell für die Handhabung von Traffic-Spitzen ohne Überbereitstellung.<br/><br/>### 2. Sicherheit: B-<br/><br/>Stärken:<br/>- Sharded Databases bieten starke Tenant-Datenisolation und mindern Risiken von Datenlecks oder unbefugtem Zugriff zwischen Mandanten.<br/>- JWT mit kurzer Gültigkeitsdauer und Refresh-Tokens entsprechen OWASP-Best-Practices und reduzieren Token-Anfälligkeitsfenster.<br/><br/>Schwächen:<br/>- Keine Erwähnung von Datenverschlüsselung im Ruhezustand oder in Transit (TLS 1.3). Dies ist nicht verhandelbar für Enterprise-Daten.<br/>- Schlüsselverwaltungsstrategie fehlt. Wie werden Verschlüsselungsschlüssel, JWT-Geheimnisse und DB-Anmeldedaten verwaltet und rotiert?<br/>- IAM mangelt es an Tiefe. Wir benötigen RBAC mit gut definierten Rollen, attributbasierte Zugriffskontrolle (ABAC) für granulare Berechtigungen und Integration mit Enterprise-Identitätsanbietern (SAML, OIDC).<br/><br/>### 3. Kosteneffizienz: B<br/><br/>Stärken:<br/>- Gemeinsame App-Server reduzieren Kosten für untätige Kapazität, gut für stabilen Traffic.<br/>- Serverless für seltene Aufgaben (z.B. Berichterstattung) ist klug; zahlen Sie nur, wenn diese Ressourcen verwendet werden.<br/><br/>Schwächen:<br/>- Pro-Tenant-Datenbanken könnten bei Skalierung nicht kosteneffektiv sein im Vergleich zu einer gut gestalteten Multi-Tenant-Datenbank mit robuster Datenpartitionierung.<br/>- Keine Erwähnung von Kosteneinsparungsmaßnahmen wie reservierte Instanzen für vorhersehbare Workloads oder Spot-Instanzen für fehlertolerante Aufgaben.<br/>- Mangel an Auto-Scaling auf App-Tier könnte zu Überbereitstellung führen und Kosten erhöhen.<br/><br/>## Empfehlungen<br/><br/>1. **App-Tier-Resilienz**: Implementieren Sie Auto-Scaling mit Kubernetes oder Cloud-nativen Services (EKS, GKE). Stellen Sie über Verfügbarkeitszonen bereit mit einem CDN für statische Assets.<br/><br/>2. **Sicherheitshärtung**:<br/>   a. Verschlüsseln Sie Daten im Ruhezustand (AES-256) und in Transit (TLS 1.3).<br/>   b. Verwenden Sie einen verwalteten KMS (AWS KMS, GCP KMS) für Schlüsselverwaltung.<br/>   c. Verbessern Sie IAM mit RBAC, ABAC und SAML/OIDC für Enterprise-SSO.<br/><br/>3. **Kostenoptimierung**:<br/>   a. Evaluieren Sie spaltenorientierte Multi-Tenant-DB (z.B. Snowflake) vs. Sharding bei Skalierung.<br/>   b. Verwenden Sie reservierte Instanzen für App-Server, Spot-Instanzen für nicht-kritische Workloads.<br/>   c. Implementieren Sie proaktive Überwachung und Größenanpassung, um Überbereitstellung zu vermeiden.<br/><br/>4. **Proof of Concept (PoC)**: Vor vollständiger Implementierung führen Sie einen PoC mit hochskalierbarer Simulation durch:<br/>   a. Testen Sie Sharded DB vs. optimierte Multi-Tenant-DB auf Kosten und Leistung.<br/>   b. Stress-testen Sie App-Tier mit simuliertem Enterprise-Level-Traffic-Spitzen.<br/>   c. Führen Sie Sicherheitsprüfung durch Dritte durch, konzentriert auf Datenisolation und Zugriffskontrolle.<br/><br/>Mit diesen Verbesserungen wird unsere Multi-Tenancy-Strategie Enterprise-Grade sein: skalierbar, sicher und kosteneffektiv. Der PoC wird unsere Designentscheidungen validieren und Vertrauen in unsere Enterprise-Kunden instillieren. |
    
    #### Prompt 3    
    | Rolle | Inhalt |
    | ---- | ------- |
    | Benutzer | Bewerten Sie dieses Strategieüberprüfungsdokument auf Klarheit, Umsetzbarkeit und Ausrichtung mit Enterprise-Prioritäten. <br/><br/>\<br/>\{\{PRIORITIES}}<br/>\</priorities><br/><br/>\<strategy_doc><br/>\{\{STRATEGY_DOC}}<br/>\</strategy_doc> |
    | Assistent | 1. Klarheit: A<br/>   + Klare Struktur mit Executive Summary, Detaillierter Analyse und Empfehlungen.<br/>   + Analyse verwendet ein Bewertungssystem (B+, B-) für schnelle Erfassung von Stärken/Schwächen.<br/>   + Technische Begriffe (RBAC, ABAC, TLS) sind erklärt oder kontextualisiert und helfen nicht-technischer Leitung.<br/>   + Visuelle Hilfsmittel (Aufzählungspunkte, Einrückung) verbessern Lesbarkeit.<br/><br/>2. Umsetzbarkeit: A-<br/>   + Empfehlungen sind spezifisch und technisch (z.B. "Implementieren Sie Auto-Scaling mit Kubernetes").<br/>   + PoC-Plan mit klaren Zielen bietet eine Roadmap.<br/>   + Fehlend: Zeitpläne, Ressourcenbedarfe oder Teamzuweisungen für jede Empfehlung.<br/>   + Überlegung: Fügen Sie einen "Nächste Schritte"-Abschnitt mit unmittelbaren Maßnahmen, Rollen und hochrangigem Zeitplan hinzu.<br/><br/>3. Enterprise-Ausrichtung: A+<br/>   + Adressiert direkt Enterprise-Prioritäten:<br/>     - Skalierbarkeit: Diskutiert Handhabung von Enterprise-Level-Traffic-Spitzen.<br/>     - Sicherheit: Konzentriert sich auf Datenisolation, Verschlüsselung und Enterprise-IAM.<br/>     - Kosten: Strategien entsprechen Enterprise-FinOps (reservierte Instanzen, Größenanpassung).<br/>   + PoC mit "hochskalierter Simulation" und Sicherheitsprüfung zeigt Engagement für Enterprise-Grade-Qualität.<br/>   + Sprache resoniert mit Enterprise-Bedenken: "nicht verhandelbar", "Enterprise-Grade", "Vertrauen instillieren".<br/><br/>Insgesamt zeichnet sich das Dokument durch Klarheit und Enterprise-Ausrichtung aus. Die Umsetzbarkeit ist stark, könnte aber auf A+ erhöht werden mit einem "Nächste Schritte"-Abschnitt. Die technische Tiefe, gekoppelt mit klaren Erklärungen, macht dies hocheffektiv für sowohl technische als auch nicht-technische Leitung. Großartig! |
  
</section>

***

<CardGroup cols={3}>
  <Card title="Prompt-Bibliothek" icon="link" href="/docs/de/resources/prompt-library/library">
    Lassen Sie sich von einer kuratierten Auswahl von Prompts für verschiedene Aufgaben und Anwendungsfälle inspirieren.
  </Card>
  <Card title="GitHub-Prompting-Tutorial" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    Ein beispielreiches Tutorial, das die in unserer Dokumentation gefundenen Prompt-Engineering-Konzepte abdeckt.
  </Card>
  <Card title="Google Sheets Prompting-Tutorial" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    Eine leichtere Version unseres Prompt-Engineering-Tutorials über ein interaktives Tabellenkalkulationsblatt.
  </Card>
</CardGroup>