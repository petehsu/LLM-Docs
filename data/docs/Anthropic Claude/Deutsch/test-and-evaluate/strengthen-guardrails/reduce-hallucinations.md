# Halluzinationen reduzieren

---

Selbst die fortschrittlichsten Sprachmodelle wie Claude können manchmal Text generieren, der sachlich falsch oder inkonsistent mit dem gegebenen Kontext ist. Dieses Phänomen, bekannt als "Halluzination", kann die Zuverlässigkeit Ihrer KI-gestützten Lösungen beeinträchtigen.
Dieser Leitfaden wird Techniken zur Minimierung von Halluzinationen erkunden und sicherstellen, dass Claudes Ausgaben genau und vertrauenswürdig sind.

## Grundlegende Strategien zur Minimierung von Halluzinationen

- **Erlauben Sie Claude "Ich weiß es nicht" zu sagen:** Geben Sie Claude ausdrücklich die Erlaubnis, Unsicherheit einzugestehen. Diese einfache Technik kann falsche Informationen drastisch reduzieren.

<section title="Beispiel: Analyse eines Fusionen & Übernahmen Berichts">

| Rolle | Inhalt |
| ---- | --- |
| Benutzer | Analysieren Sie als unser M&A-Berater diesen Bericht über die potenzielle Übernahme von AcmeCo durch ExampleCorp.<br/><br/>\<report><br/>\{\{REPORT}}<br/>\</report><br/><br/>Konzentrieren Sie sich auf Finanzprognosen, Integrationsrisiken und regulatorische Hürden. Wenn Sie sich bei einem Aspekt unsicher sind oder wenn dem Bericht notwendige Informationen fehlen, sagen Sie "Ich habe nicht genügend Informationen, um dies zuverlässig zu beurteilen." |

</section>

- **Verwenden Sie direkte Zitate zur faktischen Fundierung:** Bei Aufgaben mit langen Dokumenten (>20K Token) bitten Sie Claude, zuerst wörtliche Zitate zu extrahieren, bevor es seine Aufgabe ausführt. Dies verankert seine Antworten im tatsächlichen Text und reduziert Halluzinationen.

<section title="Beispiel: Prüfung einer Datenschutzrichtlinie">

| Rolle | Inhalt |
| ---- | --- |
| Benutzer | Überprüfen Sie als unser Datenschutzbeauftragter diese aktualisierte Datenschutzrichtlinie auf DSGVO- und CCPA-Konformität.<br/>\<br/>\{\{POLICY}}<br/>\</policy><br/><br/>1. Extrahieren Sie exakte Zitate aus der Richtlinie, die für die DSGVO- und CCPA-Konformität am relevantesten sind. Wenn Sie keine relevanten Zitate finden können, geben Sie "Keine relevanten Zitate gefunden" an.<br/><br/>2. Verwenden Sie die Zitate, um die Konformität dieser Richtlinienabschnitte zu analysieren, indem Sie sich auf die nummerierten Zitate beziehen. Basieren Sie Ihre Analyse ausschließlich auf den extrahierten Zitaten. |

</section>

- **Mit Zitaten verifizieren**: Machen Sie Claudes Antworten überprüfbar, indem Sie es Zitate und Quellen für jede seiner Behauptungen angeben lassen. Sie können Claude auch jede Behauptung verifizieren lassen, indem es nach der Generierung einer Antwort ein unterstützendes Zitat findet. Wenn es kein Zitat finden kann, muss es die Behauptung zurückziehen.

<section title="Beispiel: Verfassen einer Pressemitteilung zu einem Produktstart">

| Rolle | Inhalt |
| ---- | --- |
| Benutzer | Verfassen Sie eine Pressemitteilung für unser neues Cybersecurity-Produkt, AcmeSecurity Pro, unter ausschließlicher Verwendung von Informationen aus diesen Produktbeschreibungen und Marktberichten.<br/>\<documents><br/>\{\{DOCUMENTS}}<br/>\</documents><br/><br/>Überprüfen Sie nach dem Verfassen jede Behauptung in Ihrer Pressemitteilung. Finden Sie für jede Behauptung ein direktes Zitat aus den Dokumenten, das diese unterstützt. Wenn Sie kein unterstützendes Zitat für eine Behauptung finden können, entfernen Sie diese Behauptung aus der Pressemitteilung und markieren Sie die Stelle, wo sie entfernt wurde, mit leeren [] Klammern. |

</section>

***

## Fortgeschrittene Techniken

- **Gedankenketten-Verifizierung**: Bitten Sie Claude, seine Gedankengänge Schritt für Schritt zu erklären, bevor es eine endgültige Antwort gibt. Dies kann fehlerhafte Logik oder Annahmen aufdecken.

- **Best-of-N-Verifizierung**: Führen Sie Claude mehrmals durch denselben Prompt und vergleichen Sie die Ausgaben. Inkonsistenzen zwischen den Ausgaben könnten auf Halluzinationen hinweisen.

- **Iterative Verfeinerung**: Verwenden Sie Claudes Ausgaben als Eingaben für Folge-Prompts und bitten Sie es, vorherige Aussagen zu überprüfen oder zu erweitern. Dies kann Inkonsistenzen aufdecken und korrigieren.

- **Einschränkung externen Wissens**: Weisen Sie Claude ausdrücklich an, nur Informationen aus bereitgestellten Dokumenten und nicht sein allgemeines Wissen zu verwenden.

<Note>Denken Sie daran, dass diese Techniken Halluzinationen zwar erheblich reduzieren, sie aber nicht vollständig eliminieren. Überprüfen Sie immer kritische Informationen, besonders bei wichtigen Entscheidungen.</Note>