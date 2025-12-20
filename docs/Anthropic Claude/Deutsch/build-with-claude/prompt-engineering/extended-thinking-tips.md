# Tipps für erweiterte Denkprozesse

---

Dieser Leitfaden bietet fortgeschrittene Strategien und Techniken, um das Beste aus Claudes erweiterten Denkfunktionen herauszuholen. Erweiterte Denkprozesse ermöglichen es Claude, komplexe Probleme Schritt für Schritt zu durchdenken und die Leistung bei schwierigen Aufgaben zu verbessern.

Siehe [Modelle für erweiterte Denkprozesse](/docs/de/about-claude/models/extended-thinking-models) für Anleitungen zur Entscheidung, wann erweiterte Denkprozesse verwendet werden sollten.

## Bevor Sie beginnen

Dieser Leitfaden setzt voraus, dass Sie bereits entschieden haben, den erweiterten Denkmodus zu verwenden und unsere grundlegenden Schritte zu [den ersten Schritten mit erweiterten Denkmodellen](/docs/de/about-claude/models/extended-thinking-models#getting-started-with-extended-thinking-models) sowie unseren [Implementierungsleitfaden für erweiterte Denkprozesse](/docs/de/build-with-claude/extended-thinking) überprüft haben.

### Technische Überlegungen für erweiterte Denkprozesse

- Denktoken haben ein Mindestbudget von 1024 Token. Wir empfehlen, dass Sie mit dem minimalen Denkbudget beginnen und schrittweise erhöhen, um basierend auf Ihren Bedürfnissen und der Aufgabenkomplexität anzupassen.
- Für Arbeitslasten, bei denen das optimale Denkbudget über 32K liegt, empfehlen wir die Verwendung von [Batch-Verarbeitung](/docs/de/build-with-claude/batch-processing), um Netzwerkprobleme zu vermeiden. Anfragen, die das Modell dazu bringen, über 32K Token zu denken, verursachen lang laufende Anfragen, die möglicherweise gegen System-Timeouts und offene Verbindungslimits stoßen.
- Erweiterte Denkprozesse funktionieren am besten auf Englisch, obwohl finale Ausgaben in [jeder von Claude unterstützten Sprache](/docs/de/build-with-claude/multilingual-support) erfolgen können.
- Wenn Sie Denkprozesse unter dem Mindestbudget benötigen, empfehlen wir die Verwendung des Standardmodus mit ausgeschaltetem Denken und traditionellem Chain-of-Thought-Prompting mit XML-Tags (wie `<thinking>`). Siehe [Chain-of-Thought-Prompting](/docs/de/build-with-claude/prompt-engineering/chain-of-thought).

## Prompting-Techniken für erweiterte Denkprozesse

### Verwenden Sie zuerst allgemeine Anweisungen, dann beheben Sie Probleme mit schrittweiseren Anweisungen

Claude funktioniert oft besser mit allgemeinen Anweisungen, einfach tief über eine Aufgabe nachzudenken, anstatt mit schrittweisen präskriptiven Anleitungen. Die Kreativität des Modells bei der Problemlösung kann die Fähigkeit eines Menschen übertreffen, den optimalen Denkprozess vorzuschreiben.

Zum Beispiel, anstatt:

<CodeGroup>
```text User
Denken Sie dieses Mathematikproblem Schritt für Schritt durch:
1. Identifizieren Sie zuerst die Variablen
2. Dann stellen Sie die Gleichung auf
3. Als nächstes lösen Sie nach x auf
...
```
</CodeGroup>

Erwägen Sie:

<CodeGroup>
```text User
Bitte denken Sie gründlich und sehr detailliert über dieses Mathematikproblem nach.
Betrachten Sie mehrere Ansätze und zeigen Sie Ihre vollständige Argumentation.
Probieren Sie verschiedene Methoden aus, wenn Ihr erster Ansatz nicht funktioniert.
```
/>
</CodeGroup>

<TryInConsoleButton
  userPrompt={
    `Bitte denken Sie gründlich und sehr detailliert über dieses Mathematikproblem nach.
Betrachten Sie mehrere Ansätze und zeigen Sie Ihre vollständige Argumentation.
Probieren Sie verschiedene Methoden aus, wenn Ihr erster Ansatz nicht funktioniert.`
  }
  thinkingBudgetTokens={16000}
>
  In Konsole ausprobieren
</TryInConsoleButton>

Dennoch kann Claude bei Bedarf immer noch komplexe strukturierte Ausführungsschritte effektiv befolgen. Das Modell kann sogar längere Listen mit komplexeren Anweisungen als frühere Versionen handhaben. Wir empfehlen, dass Sie mit allgemeineren Anweisungen beginnen, dann Claudes Denkausgabe lesen und iterieren, um spezifischere Anweisungen zu geben, um sein Denken von dort aus zu lenken.

### Multishot-Prompting mit erweiterten Denkprozessen

[Multishot-Prompting](/docs/de/build-with-claude/prompt-engineering/multishot-prompting) funktioniert gut mit erweiterten Denkprozessen. Wenn Sie Claude Beispiele dafür geben, wie Probleme durchdacht werden sollen, wird es ähnliche Argumentationsmuster in seinen erweiterten Denkblöcken befolgen.

Sie können Few-Shot-Beispiele in Ihren Prompt in erweiterten Denkszenarien einbeziehen, indem Sie XML-Tags wie `<thinking>` oder `<scratchpad>` verwenden, um kanonische Muster erweiterten Denkens in diesen Beispielen anzuzeigen.

Claude wird das Muster auf den formalen erweiterten Denkprozess verallgemeinern. Es ist jedoch möglich, dass Sie bessere Ergebnisse erzielen, wenn Sie Claude freie Hand lassen, auf die Weise zu denken, die es für am besten hält.

Beispiel:

<CodeGroup>
```text User
Ich werde Ihnen zeigen, wie man ein Mathematikproblem löst, dann möchte ich, dass Sie ein ähnliches lösen.

Problem 1: Was sind 15% von 80?

<thinking>
Um 15% von 80 zu finden:
1. Wandeln Sie 15% in eine Dezimalzahl um: 15% = 0,15
2. Multiplizieren Sie: 0,15 × 80 = 12
</thinking>

Die Antwort ist 12.

Lösen Sie jetzt dieses:
Problem 2: Was sind 35% von 240?
```
/>
</CodeGroup>

<TryInConsoleButton
  userPrompt={
    `Ich werde Ihnen zeigen, wie man ein Mathematikproblem löst, dann möchte ich, dass Sie ein ähnliches lösen.

Problem 1: Was sind 15% von 80?

<thinking>
Um 15% von 80 zu finden:
1. Wandeln Sie 15% in eine Dezimalzahl um: 15% = 0,15
2. Multiplizieren Sie: 0,15 × 80 = 12
</thinking>

Die Antwort ist 12.

Lösen Sie jetzt dieses:
Problem 2: Was sind 35% von 240?`
  }
  thinkingBudgetTokens={16000} 
>
  In Konsole ausprobieren
</TryInConsoleButton>

### Maximierung der Anweisungsbefolgung mit erweiterten Denkprozessen
Claude zeigt deutlich verbesserte Anweisungsbefolgung, wenn erweiterte Denkprozesse aktiviert sind. Das Modell:
1. Denkt über Anweisungen im erweiterten Denkblock nach
2. Führt diese Anweisungen in der Antwort aus

Um die Anweisungsbefolgung zu maximieren:
- Seien Sie klar und spezifisch über das, was Sie wollen
- Für komplexe Anweisungen erwägen Sie, diese in nummerierte Schritte aufzuteilen, die Claude methodisch durcharbeiten sollte
- Geben Sie Claude genügend Budget, um die Anweisungen vollständig in seinem erweiterten Denken zu verarbeiten

### Verwendung erweiterten Denkens zum Debuggen und Lenken von Claudes Verhalten
Sie können Claudes Denkausgabe verwenden, um Claudes Logik zu debuggen, obwohl diese Methode nicht immer perfekt zuverlässig ist.

Um das Beste aus dieser Methodik zu machen, empfehlen wir die folgenden Tipps:
- Wir empfehlen nicht, Claudes erweiterte Denkprozesse im Benutzertextblock zurückzugeben, da dies die Leistung nicht verbessert und tatsächlich die Ergebnisse verschlechtern kann.
- Das Vorfüllen erweiterten Denkens ist ausdrücklich nicht erlaubt, und das manuelle Ändern des Ausgabetexts des Modells, der seinem Denkblock folgt, wird wahrscheinlich die Ergebnisse aufgrund von Modellverwirrung verschlechtern.

Wenn erweiterte Denkprozesse ausgeschaltet sind, ist das standardmäßige `assistant`-Antworttext-[Prefill](/docs/de/build-with-claude/prompt-engineering/prefill-claudes-response) immer noch erlaubt.

<Note>
Manchmal kann Claude seine erweiterten Denkprozesse im Assistenten-Ausgabetext wiederholen. Wenn Sie eine saubere Antwort wollen, weisen Sie Claude an, seine erweiterten Denkprozesse nicht zu wiederholen und nur die Antwort auszugeben.
</Note>

### Das Beste aus langen Ausgaben und langformigen Denkprozessen machen

Für Datensatz-Generierungsanwendungsfälle versuchen Sie Prompts wie "Bitte erstellen Sie eine extrem detaillierte Tabelle von..." zur Generierung umfassender Datensätze.

Für Anwendungsfälle wie detaillierte Inhaltsgenerierung, bei denen Sie möglicherweise längere erweiterte Denkblöcke und detailliertere Antworten generieren möchten, versuchen Sie diese Tipps:
- Erhöhen Sie sowohl die maximale erweiterte Denklänge UND bitten Sie explizit um längere Ausgaben
- Für sehr lange Ausgaben (20.000+ Wörter) fordern Sie eine detaillierte Gliederung mit Wortzahlen bis zur Absatzebene an. Dann bitten Sie Claude, seine Absätze zur Gliederung zu indizieren und die angegebenen Wortzahlen einzuhalten

<Warning>
Wir empfehlen nicht, dass Sie Claude dazu drängen, mehr Token um der Token willen auszugeben. Vielmehr ermutigen wir Sie, mit einem kleinen Denkbudget zu beginnen und bei Bedarf zu erhöhen, um die optimalen Einstellungen für Ihren Anwendungsfall zu finden.
</Warning>

Hier sind Beispiel-Anwendungsfälle, bei denen Claude aufgrund längerer erweiterter Denkprozesse hervorragend abschneidet:

  <section title="Komplexe STEM-Probleme">

    Komplexe STEM-Probleme erfordern, dass Claude mentale Modelle aufbaut, spezialisiertes Wissen anwendet und sequenzielle logische Schritte durcharbeitet – Prozesse, die von längerer Denkzeit profitieren.
    
    <Tabs>
      <Tab title="Standard-Prompt">
        <CodeGroup>
        ```text User
        Schreiben Sie ein Python-Skript für einen springenden gelben Ball in einem Quadrat,
        stellen Sie sicher, dass die Kollisionserkennung ordnungsgemäß behandelt wird.
        Lassen Sie das Quadrat sich langsam drehen.
        ```
        />
        </CodeGroup>
        
        <TryInConsoleButton
          userPrompt={
            `Schreiben Sie ein Python-Skript für einen springenden gelben Ball in einem Quadrat,
stellen Sie sicher, dass die Kollisionserkennung ordnungsgemäß behandelt wird.
Lassen Sie das Quadrat sich langsam drehen.`
          }
          thinkingBudgetTokens={16000}
        >
          In Konsole ausprobieren
        </TryInConsoleButton>
        <Note>
        Diese einfachere Aufgabe führt typischerweise zu nur etwa wenigen Sekunden Denkzeit.
        </Note>
      </Tab>
      <Tab title="Verbesserter Prompt">
        <CodeGroup>
        ```text User
        Schreiben Sie ein Python-Skript für einen springenden gelben Ball in einem Tesserakt,
        stellen Sie sicher, dass die Kollisionserkennung ordnungsgemäß behandelt wird.
        Lassen Sie den Tesserakt sich langsam drehen.
        Stellen Sie sicher, dass der Ball im Tesserakt bleibt.
        ```
        />
        </CodeGroup>
        
        <TryInConsoleButton
          userPrompt={
            `Schreiben Sie ein Python-Skript für einen springenden gelben Ball in einem Tesserakt,
stellen Sie sicher, dass die Kollisionserkennung ordnungsgemäß behandelt wird.
Lassen Sie den Tesserakt sich langsam drehen.
Stellen Sie sicher, dass der Ball im Tesserakt bleibt.`
          }
          thinkingBudgetTokens={16000}
        >
          In Konsole ausprobieren
        </TryInConsoleButton>
        <Note>
        Diese komplexe 4D-Visualisierungsherausforderung nutzt die lange erweiterte Denkzeit am besten, da Claude die mathematische und programmiertechnische Komplexität durcharbeitet.
        </Note>
      </Tab>
    </Tabs>
  
</section>
  
  <section title="Constraint-Optimierungsprobleme">

    Constraint-Optimierung fordert Claude heraus, mehrere konkurrierende Anforderungen gleichzeitig zu erfüllen, was am besten erreicht wird, wenn lange erweiterte Denkzeit zugelassen wird, damit das Modell jede Einschränkung methodisch angehen kann.
    
    <Tabs>
      <Tab title="Standard-Prompt">
        <CodeGroup>
        ```text User
        Planen Sie einen einwöchigen Urlaub nach Japan.
        ```
        />
        </CodeGroup>
        
        <TryInConsoleButton
          userPrompt="Planen Sie einen einwöchigen Urlaub nach Japan."
          thinkingBudgetTokens={16000}
        >
          In Konsole ausprobieren
        </TryInConsoleButton>
        <Note>
        Diese offene Anfrage führt typischerweise zu nur etwa wenigen Sekunden Denkzeit.
        </Note>
      </Tab>
      <Tab title="Verbesserter Prompt">
        <CodeGroup>
        ```text User
        Planen Sie eine 7-tägige Reise nach Japan mit den folgenden Einschränkungen:
        - Budget von 2.500 $
        - Muss Tokyo und Kyoto einschließen
        - Muss vegetarische Ernährung berücksichtigen
        - Präferenz für kulturelle Erfahrungen über Einkaufen
        - Muss einen Tag Wandern einschließen
        - Nicht mehr als 2 Stunden Reisezeit zwischen Orten pro Tag
        - Braucht jeden Nachmittag freie Zeit für Anrufe nach Hause
        - Muss Menschenmengen wo möglich vermeiden
        ```
        />
        </CodeGroup>
        
        <TryInConsoleButton
          userPrompt={
            `Planen Sie eine 7-tägige Reise nach Japan mit den folgenden Einschränkungen:
- Budget von 2.500 $
- Muss Tokyo und Kyoto einschließen
- Muss vegetarische Ernährung berücksichtigen
- Präferenz für kulturelle Erfahrungen über Einkaufen
- Muss einen Tag Wandern einschließen
- Nicht mehr als 2 Stunden Reisezeit zwischen Orten pro Tag
- Braucht jeden Nachmittag freie Zeit für Anrufe nach Hause
- Muss Menschenmengen wo möglich vermeiden`
          }
          thinkingBudgetTokens={16000}
        >
          In Konsole ausprobieren
        </TryInConsoleButton>
        <Note>
        Mit mehreren zu balancierenden Einschränkungen wird Claude natürlich am besten funktionieren, wenn ihm mehr Raum gegeben wird, zu durchdenken, wie alle Anforderungen optimal erfüllt werden können.
        </Note>
      </Tab>
    </Tabs>
  
</section>
  
  <section title="Denkrahmen">

    Strukturierte Denkrahmen geben Claude eine explizite Methodik zu befolgen, was am besten funktionieren kann, wenn Claude langen erweiterten Denkraum gegeben wird, um jeden Schritt zu befolgen.
    
    <Tabs>
      <Tab title="Standard-Prompt">
        <CodeGroup>
        ```text User
        Entwickeln Sie eine umfassende Strategie für Microsoft
        zum Eintritt in den personalisierten Medizinmarkt bis 2027.
        ```
        />
        </CodeGroup>
        
        <TryInConsoleButton
          userPrompt={
            `Entwickeln Sie eine umfassende Strategie für Microsoft
zum Eintritt in den personalisierten Medizinmarkt bis 2027.`
          }
          thinkingBudgetTokens={16000}
        >
          In Konsole ausprobieren
        </TryInConsoleButton>
        <Note>
        Diese breite strategische Frage führt typischerweise zu nur etwa wenigen Sekunden Denkzeit.
        </Note>
      </Tab>
      <Tab title="Verbesserter Prompt">
        <CodeGroup>
        ```text User
        Entwickeln Sie eine umfassende Strategie für Microsoft zum Eintritt
        in den personalisierten Medizinmarkt bis 2027.
        
        Beginnen Sie mit:
        1. Einer Blue Ocean Strategy-Leinwand
        2. Wenden Sie Porters Five Forces an, um Wettbewerbsdruck zu identifizieren
        
        Als nächstes führen Sie eine Szenarioplanungsübung mit vier
        verschiedenen Zukünften basierend auf regulatorischen und technologischen Variablen durch.
        
        Für jedes Szenario:
        - Entwickeln Sie strategische Antworten mit der Ansoff-Matrix
        
        Schließlich wenden Sie das Three Horizons-Framework an, um:
        - Den Übergangspfad zu kartieren
        - Potenzielle disruptive Innovationen in jeder Phase zu identifizieren
        ```
        />
        </CodeGroup>
        
        <TryInConsoleButton
          userPrompt={
            `Entwickeln Sie eine umfassende Strategie für Microsoft zum Eintritt
in den personalisierten Medizinmarkt bis 2027.

Beginnen Sie mit:
1. Einer Blue Ocean Strategy-Leinwand
2. Wenden Sie Porters Five Forces an, um Wettbewerbsdruck zu identifizieren

Als nächstes führen Sie eine Szenarioplanungsübung mit vier
verschiedenen Zukünften basierend auf regulatorischen und technologischen Variablen durch.

Für jedes Szenario:
- Entwickeln Sie strategische Antworten mit der Ansoff-Matrix

Schließlich wenden Sie das Three Horizons-Framework an, um:
- Den Übergangspfad zu kartieren
- Potenzielle disruptive Innovationen in jeder Phase zu identifizieren`
          }
          thinkingBudgetTokens={16000}
        >
          In Konsole ausprobieren
        </TryInConsoleButton>
        <Note>
        Durch die Spezifizierung mehrerer analytischer Frameworks, die sequenziell angewendet werden müssen, erhöht sich die Denkzeit natürlich, da Claude jedes Framework methodisch durcharbeitet.
        </Note>
      </Tab>
    </Tabs>
  
</section>

### Lassen Sie Claude über seine Arbeit reflektieren und sie überprüfen für verbesserte Konsistenz und Fehlerbehandlung
Sie können einfaches natürlichsprachliches Prompting verwenden, um Konsistenz zu verbessern und Fehler zu reduzieren:
1. Bitten Sie Claude, seine Arbeit mit einem einfachen Test zu überprüfen, bevor es eine Aufgabe als abgeschlossen erklärt
2. Weisen Sie das Modell an zu analysieren, ob sein vorheriger Schritt das erwartete Ergebnis erreicht hat
3. Für Programmieraufgaben bitten Sie Claude, Testfälle in seinem erweiterten Denken durchzugehen

Beispiel:

<CodeGroup>
```text User
Schreiben Sie eine Funktion zur Berechnung der Fakultät einer Zahl.
Bevor Sie fertig sind, überprüfen Sie bitte Ihre Lösung mit Testfällen für:
- n=0
- n=1
- n=5
- n=10
Und beheben Sie alle Probleme, die Sie finden.
```
/>
</CodeGroup>

<TryInConsoleButton
  userPrompt={
    `Schreiben Sie eine Funktion zur Berechnung der Fakultät einer Zahl.
Bevor Sie fertig sind, überprüfen Sie bitte Ihre Lösung mit Testfällen für:
- n=0
- n=1
- n=5
- n=10
Und beheben Sie alle Probleme, die Sie finden.`
  }
  thinkingBudgetTokens={16000}
>
  In Konsole ausprobieren
</TryInConsoleButton>

## Nächste Schritte

<CardGroup>
  <Card title="Kochbuch für erweiterte Denkprozesse" icon="book" href="https://github.com/anthropics/anthropic-cookbook/tree/main/extended_thinking">
    Erkunden Sie praktische Beispiele erweiterter Denkprozesse in unserem Kochbuch.
  </Card>
  <Card title="Leitfaden für erweiterte Denkprozesse" icon="code" href="/docs/de/build-with-claude/extended-thinking">
    Sehen Sie die vollständige technische Dokumentation zur Implementierung erweiterter Denkprozesse.
  </Card>
</CardGroup>