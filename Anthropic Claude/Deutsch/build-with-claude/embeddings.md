# Embeddings

Text-Embeddings sind numerische Darstellungen von Text, die es ermöglichen, semantische Ähnlichkeit zu messen. Dieser Leitfaden führt in Embeddings, ihre Anwendungen und die Verwendung von Embedding-Modellen für Aufgaben wie Suche, Empfehlungen und Anomalieerkennung ein.

---

## Vor der Implementierung von Embeddings

Bei der Auswahl eines Embeddings-Anbieters gibt es mehrere Faktoren, die Sie je nach Ihren Bedürfnissen und Präferenzen berücksichtigen können:

- Datensatzgröße & Domänenspezifität: Größe des Modell-Trainingsdatensatzes und seine Relevanz für die Domäne, die Sie einbetten möchten. Größere oder domänenspezifischere Daten erzeugen im Allgemeinen bessere domäneninterne Embeddings
- Inferenz-Performance: Geschwindigkeit der Embedding-Suche und End-to-End-Latenz. Dies ist eine besonders wichtige Überlegung für groß angelegte Produktionsbereitstellungen
- Anpassung: Optionen für fortgesetztes Training auf privaten Daten oder Spezialisierung von Modellen für sehr spezifische Domänen. Dies kann die Leistung bei einzigartigen Vokabularen verbessern

## Wie man Embeddings mit Anthropic erhält

Anthropic bietet kein eigenes Embedding-Modell an. Ein Embeddings-Anbieter, der eine große Vielfalt an Optionen und Fähigkeiten hat, die alle oben genannten Überlegungen umfassen, ist Voyage AI.

Voyage AI erstellt hochmoderne Embedding-Modelle und bietet angepasste Modelle für spezifische Industriedomänen wie Finanzen und Gesundheitswesen oder maßgeschneiderte fein abgestimmte Modelle für einzelne Kunden.

Der Rest dieses Leitfadens ist für Voyage AI, aber wir ermutigen Sie, eine Vielzahl von Embeddings-Anbietern zu bewerten, um die beste Lösung für Ihren spezifischen Anwendungsfall zu finden.

## Verfügbare Modelle

Voyage empfiehlt die Verwendung der folgenden Text-Embedding-Modelle:

| Modell | Kontextlänge | Embedding-Dimension | Beschreibung |
| --- | --- | --- | --- |
| `voyage-3-large` | 32.000 | 1024 (Standard), 256, 512, 2048 | Die beste allgemeine und mehrsprachige Retrieval-Qualität. Siehe [Blog-Post](https://blog.voyageai.com/2025/01/07/voyage-3-large/) für Details. |
| `voyage-3.5` | 32.000 | 1024 (Standard), 256, 512, 2048 | Optimiert für allgemeine und mehrsprachige Retrieval-Qualität. Siehe [Blog-Post](https://blog.voyageai.com/2025/05/20/voyage-3-5/) für Details. |
| `voyage-3.5-lite` | 32.000 | 1024 (Standard), 256, 512, 2048 | Optimiert für Latenz und Kosten. Siehe [Blog-Post](https://blog.voyageai.com/2025/05/20/voyage-3-5/) für Details. |
| `voyage-code-3` | 32.000 | 1024 (Standard), 256, 512, 2048 | Optimiert für **Code**-Retrieval. Siehe [Blog-Post](https://blog.voyageai.com/2024/12/04/voyage-code-3/) für Details. |
| `voyage-finance-2` | 32.000 | 1024 | Optimiert für **Finanz**-Retrieval und RAG. Siehe [Blog-Post](https://blog.voyageai.com/2024/06/03/domain-specific-embeddings-finance-edition-voyage-finance-2/) für Details. |
| `voyage-law-2` | 16.000 | 1024 | Optimiert für **rechtliche** und **lange Kontext**-Retrieval und RAG. Auch verbesserte Leistung in allen Domänen. Siehe [Blog-Post](https://blog.voyageai.com/2024/04/15/domain-specific-embeddings-and-retrieval-legal-edition-voyage-law-2/) für Details. |

Zusätzlich werden die folgenden multimodalen Embedding-Modelle empfohlen:

| Modell | Kontextlänge | Embedding-Dimension | Beschreibung |
| --- | --- | --- | --- |
| `voyage-multimodal-3` | 32000 | 1024 | Reichhaltiges multimodales Embedding-Modell, das verschachtelten Text und inhaltsreiche Bilder wie Screenshots von PDFs, Folien, Tabellen, Abbildungen und mehr vektorisieren kann. Siehe [Blog-Post](https://blog.voyageai.com/2024/11/12/voyage-multimodal-3/) für Details. |

Benötigen Sie Hilfe bei der Entscheidung, welches Text-Embedding-Modell Sie verwenden sollen? Schauen Sie sich die [FAQ](https://docs.voyageai.com/docs/faq#what-embedding-models-are-available-and-which-one-should-i-use&ref=anthropic) an.

## Erste Schritte mit Voyage AI

Um auf Voyage-Embeddings zuzugreifen:

1. Registrieren Sie sich auf der Website von Voyage AI
2. Erhalten Sie einen API-Schlüssel
3. Setzen Sie den API-Schlüssel als Umgebungsvariable für die Bequemlichkeit:

```bash
export VOYAGE_API_KEY="<your secret key>"
```

Sie können die Embeddings entweder mit dem offiziellen [`voyageai` Python-Paket](https://github.com/voyage-ai/voyageai-python) oder HTTP-Anfragen erhalten, wie unten beschrieben.

### Voyage Python-Bibliothek

Das `voyageai`-Paket kann mit dem folgenden Befehl installiert werden:

```bash
pip install -U voyageai
```

Dann können Sie ein Client-Objekt erstellen und es verwenden, um Ihre Texte einzubetten:

```python
import voyageai

vo = voyageai.Client()
# Dies wird automatisch die Umgebungsvariable VOYAGE_API_KEY verwenden.
# Alternativ können Sie vo = voyageai.Client(api_key="<your secret key>") verwenden

texts = ["Beispieltext 1", "Beispieltext 2"]

result = vo.embed(texts, model="voyage-3.5", input_type="document")
print(result.embeddings[0])
print(result.embeddings[1])
```

`result.embeddings` wird eine Liste von zwei Embedding-Vektoren sein, die jeweils 1024 Gleitkommazahlen enthalten. Nach dem Ausführen des obigen Codes werden die beiden Embeddings auf dem Bildschirm ausgegeben:

```
[-0.013131560757756233, 0.019828535616397858, ...]   # embedding für "Beispieltext 1"
[-0.0069352793507277966, 0.020878976210951805, ...]  # embedding für "Beispieltext 2"
```

Beim Erstellen der Embeddings können Sie einige andere Argumente für die `embed()`-Funktion angeben.

Für weitere Informationen zum Voyage Python-Paket siehe [die Voyage-Dokumentation](https://docs.voyageai.com/docs/embeddings#python-api).

### Voyage HTTP API

Sie können auch Embeddings erhalten, indem Sie die Voyage HTTP API anfordern. Zum Beispiel können Sie eine HTTP-Anfrage über den `curl`-Befehl in einem Terminal senden:

```bash
curl https://api.voyageai.com/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $VOYAGE_API_KEY" \
  -d '{
    "input": ["Beispieltext 1", "Beispieltext 2"],
    "model": "voyage-3.5"
  }'
```

Die Antwort, die Sie erhalten würden, ist ein JSON-Objekt, das die Embeddings und die Token-Nutzung enthält:

```json
{
  "object": "list",
  "data": [
    {
      "embedding": [-0.013131560757756233, 0.019828535616397858, ...],
      "index": 0
    },
    {
      "embedding": [-0.0069352793507277966, 0.020878976210951805, ...],
      "index": 1
    }
  ],
  "model": "voyage-3.5",
  "usage": {
    "total_tokens": 10
  }
}

```

Für weitere Informationen zur Voyage HTTP API siehe [die Voyage-Dokumentation](https://docs.voyageai.com/reference/embeddings-api).

### AWS Marketplace

Voyage-Embeddings sind auf dem [AWS Marketplace](https://aws.amazon.com/marketplace/seller-profile?id=seller-snt4gb6fd7ljg) verfügbar. Anweisungen für den Zugang zu Voyage auf AWS sind [hier](https://docs.voyageai.com/docs/aws-marketplace-model-package?ref=anthropic) verfügbar.

## Schnellstart-Beispiel

Jetzt, da wir wissen, wie man Embeddings erhält, schauen wir uns ein kurzes Beispiel an.

Angenommen, wir haben ein kleines Korpus von sechs Dokumenten, aus denen wir abrufen können

```python
documents = [
    "Die Mittelmeerdiät betont Fisch, Olivenöl und Gemüse, von denen angenommen wird, dass sie chronische Krankheiten reduzieren.",
    "Photosynthese in Pflanzen wandelt Lichtenergie in Glukose um und produziert essentiellen Sauerstoff.",
    "Innovationen des 20. Jahrhunderts, von Radios bis zu Smartphones, konzentrierten sich auf elektronische Fortschritte.",
    "Flüsse liefern Wasser, Bewässerung und Lebensraum für Wasserarten, die für Ökosysteme lebenswichtig sind.",
    "Apples Telefonkonferenz zur Diskussion der Ergebnisse des vierten Geschäftsquartals und Geschäftsupdates ist für Donnerstag, den 2. November 2023 um 14:00 Uhr PT / 17:00 Uhr ET geplant.",
    "Shakespeares Werke, wie 'Hamlet' und 'Ein Sommernachtstraum', bestehen in der Literatur fort."
]

```

Wir werden zuerst Voyage verwenden, um jedes von ihnen in einen Embedding-Vektor umzuwandeln

```python
import voyageai

vo = voyageai.Client()

# Einbetten der Dokumente
doc_embds = vo.embed(
    documents, model="voyage-3.5", input_type="document"
).embeddings
```

Die Embeddings ermöglichen es uns, semantische Suche / Retrieval im Vektorraum durchzuführen. Bei einer Beispielabfrage,

```python
query = "Wann ist Apples Telefonkonferenz geplant?"
```

wandeln wir sie in ein Embedding um und führen eine Nächste-Nachbarn-Suche durch, um das relevanteste Dokument basierend auf der Entfernung im Embedding-Raum zu finden.

```python
import numpy as np

# Einbetten der Abfrage
query_embd = vo.embed(
    [query], model="voyage-3.5", input_type="query"
).embeddings[0]

# Berechnen der Ähnlichkeit
# Voyage-Embeddings sind auf Länge 1 normalisiert, daher sind Skalarprodukt
# und Kosinus-Ähnlichkeit dasselbe.
similarities = np.dot(doc_embds, query_embd)

retrieved_id = np.argmax(similarities)
print(documents[retrieved_id])
```

Beachten Sie, dass wir `input_type="document"` und `input_type="query"` für das Einbetten des Dokuments bzw. der Abfrage verwenden. Weitere Spezifikationen finden Sie [hier](/docs/de/build-with-claude/embeddings#voyage-python-package).

Die Ausgabe wäre das 5. Dokument, das tatsächlich am relevantesten für die Abfrage ist:

```
Apples Telefonkonferenz zur Diskussion der Ergebnisse des vierten Geschäftsquartals und Geschäftsupdates ist für Donnerstag, den 2. November 2023 um 14:00 Uhr PT / 17:00 Uhr ET geplant.
```

Wenn Sie nach einem detaillierten Satz von Kochbüchern suchen, wie man RAG mit Embeddings macht, einschließlich Vektordatenbanken, schauen Sie sich unser [RAG-Kochbuch](https://github.com/anthropics/anthropic-cookbook/blob/main/third_party/Pinecone/rag_using_pinecone.ipynb) an.

## FAQ

  <section title="Warum haben Voyage-Embeddings überlegene Qualität?">

    Embedding-Modelle basieren auf leistungsstarken neuronalen Netzwerken, um semantischen Kontext zu erfassen und zu komprimieren, ähnlich wie generative Modelle. Voyages Team erfahrener KI-Forscher optimiert jede Komponente des Embedding-Prozesses, einschließlich:
    - Modellarchitektur 
    - Datensammlung
    - Verlustfunktionen
    - Optimierer-Auswahl

    Erfahren Sie mehr über Voyages technischen Ansatz in ihrem [Blog](https://blog.voyageai.com/).
  
</section>

  <section title="Welche Embedding-Modelle sind verfügbar und welches sollte ich verwenden?">

    Für allgemeine Embedding-Zwecke empfehlen wir:
    - `voyage-3-large`: Beste Qualität
    - `voyage-3.5-lite`: Niedrigste Latenz und Kosten
    - `voyage-3.5`: Ausgewogene Leistung mit überlegener Retrieval-Qualität zu einem wettbewerbsfähigen Preis
    
    Für Retrieval verwenden Sie den `input_type`-Parameter, um anzugeben, ob der Text eine Abfrage oder ein Dokumenttyp ist.

    Domänenspezifische Modelle:

    - Rechtliche Aufgaben: `voyage-law-2`
    - Code und Programmierdokumentation: `voyage-code-3`
    - Finanzbezogene Aufgaben: `voyage-finance-2`
  
</section>

  <section title="Welche Ähnlichkeitsfunktion sollte ich verwenden?">

    Sie können Voyage-Embeddings mit Skalarprodukt-Ähnlichkeit, Kosinus-Ähnlichkeit oder euklidischer Entfernung verwenden. Eine Erklärung zur Embedding-Ähnlichkeit finden Sie [hier](https://www.pinecone.io/learn/vector-similarity/).

    Voyage AI-Embeddings sind auf Länge 1 normalisiert, was bedeutet, dass:

    - Kosinus-Ähnlichkeit ist äquivalent zur Skalarprodukt-Ähnlichkeit, während letztere schneller berechnet werden kann.
    - Kosinus-Ähnlichkeit und euklidische Entfernung führen zu identischen Rankings.
  
</section>

  <section title="Was ist die Beziehung zwischen Zeichen, Wörtern und Token?">

    Bitte sehen Sie sich diese [Seite](https://docs.voyageai.com/docs/tokenization?ref=anthropic) an.
  
</section>

  <section title="Wann und wie sollte ich den input_type-Parameter verwenden?">

    Für alle Retrieval-Aufgaben und Anwendungsfälle (z.B. RAG) empfehlen wir, dass der `input_type`-Parameter verwendet wird, um anzugeben, ob der Eingabetext eine Abfrage oder ein Dokument ist. Lassen Sie `input_type` nicht weg oder setzen Sie `input_type=None`. Die Angabe, ob Eingabetext eine Abfrage oder ein Dokument ist, kann bessere dichte Vektordarstellungen für Retrieval erstellen, was zu besserer Retrieval-Qualität führen kann.

    Bei Verwendung des `input_type`-Parameters werden spezielle Prompts dem Eingabetext vor dem Einbetten vorangestellt. Spezifisch:

    > 📘 **Prompts im Zusammenhang mit `input_type`**
    > 
    > - Für eine Abfrage lautet der Prompt "Represent the query for retrieving supporting documents: ".
    > - Für ein Dokument lautet der Prompt "Represent the document for retrieval: ".
    > - Beispiel
    >     - Wenn `input_type="query"`, wird eine Abfrage wie "Wann ist Apples Telefonkonferenz geplant?" zu "**Represent the query for retrieving supporting documents:** Wann ist Apples Telefonkonferenz geplant?"
    >     - Wenn `input_type="document"`, wird eine Abfrage wie "Apples Telefonkonferenz zur Diskussion der Ergebnisse des vierten Geschäftsquartals und Geschäftsupdates ist für Donnerstag, den 2. November 2023 um 14:00 Uhr PT / 17:00 Uhr ET geplant." zu "**Represent the document for retrieval:** Apples Telefonkonferenz zur Diskussion der Ergebnisse des vierten Geschäftsquartals und Geschäftsupdates ist für Donnerstag, den 2. November 2023 um 14:00 Uhr PT / 17:00 Uhr ET geplant."

    `voyage-large-2-instruct`, wie der Name schon sagt, ist darauf trainiert, auf zusätzliche Anweisungen zu reagieren, die dem Eingabetext vorangestellt werden. Für Klassifikation, Clustering oder andere [MTEB](https://huggingface.co/mteb)-Unteraufgaben verwenden Sie bitte die Anweisungen [hier](https://github.com/voyage-ai/voyage-large-2-instruct).
  
</section>

  <section title="Welche Quantisierungsoptionen sind verfügbar?">

    Quantisierung in Embeddings wandelt hochpräzise Werte, wie 32-Bit-Einzelpräzisions-Gleitkommazahlen, in niedrigere Präzisionsformate wie 8-Bit-Ganzzahlen oder 1-Bit-Binärwerte um, wodurch Speicher, Arbeitsspeicher und Kosten um das 4-fache bzw. 32-fache reduziert werden. Unterstützte Voyage-Modelle ermöglichen Quantisierung durch Angabe des Ausgabedatentyps mit dem `output_dtype`-Parameter:

    - `float`: Jedes zurückgegebene Embedding ist eine Liste von 32-Bit (4-Byte) Einzelpräzisions-Gleitkommazahlen. Dies ist der Standard und bietet die höchste Präzision / Retrieval-Genauigkeit.
    - `int8` und `uint8`: Jedes zurückgegebene Embedding ist eine Liste von 8-Bit (1-Byte) Ganzzahlen im Bereich von -128 bis 127 bzw. 0 bis 255.
    - `binary` und `ubinary`: Jedes zurückgegebene Embedding ist eine Liste von 8-Bit-Ganzzahlen, die bit-gepackte, quantisierte Ein-Bit-Embedding-Werte darstellen: `int8` für `binary` und `uint8` für `ubinary`. Die Länge der zurückgegebenen Liste von Ganzzahlen beträgt 1/8 der tatsächlichen Dimension des Embeddings. Der binäre Typ verwendet die Offset-Binär-Methode, über die Sie mehr in der FAQ unten erfahren können.

    > **Beispiel für binäre Quantisierung**
    > 
    > Betrachten Sie die folgenden acht Embedding-Werte: -0.03955078, 0.006214142, -0.07446289, -0.039001465, 0.0046463013, 0.00030612946, -0.08496094 und 0.03994751. Mit binärer Quantisierung werden Werte kleiner oder gleich null zu einer binären Null quantisiert und positive Werte zu einer binären Eins, was zu der folgenden binären Sequenz führt: 0, 1, 0, 0, 1, 1, 0, 1. Diese acht Bits werden dann in eine einzige 8-Bit-Ganzzahl gepackt, 01001101 (mit dem linkesten Bit als dem signifikantesten Bit).
    >   - `ubinary`: Die binäre Sequenz wird direkt umgewandelt und als vorzeichenlose Ganzzahl (`uint8`) 77 dargestellt.
    >   - `binary`: Die binäre Sequenz wird als vorzeichenbehaftete Ganzzahl (`int8`) -51 dargestellt, berechnet mit der Offset-Binär-Methode (77 - 128 = -51).
  
</section>

  <section title="Wie kann ich Matryoshka-Embeddings kürzen?">

    Matryoshka-Lernen erstellt Embeddings mit grob-zu-fein Darstellungen innerhalb eines einzigen Vektors. Voyage-Modelle, wie `voyage-code-3`, die mehrere Ausgabedimensionen unterstützen, generieren solche Matryoshka-Embeddings. Sie können diese Vektoren kürzen, indem Sie die führende Teilmenge von Dimensionen behalten. Zum Beispiel zeigt der folgende Python-Code, wie man 1024-dimensionale Vektoren auf 256 Dimensionen kürzt:

    ```python
    import voyageai
    import numpy as np

    def embd_normalize(v: np.ndarray) -> np.ndarray:
         
        """
        Normalisiert die Zeilen eines 2D-numpy-Arrays zu Einheitsvektoren, indem jede Zeile durch ihre euklidische
        Norm geteilt wird. Löst einen ValueError aus, wenn eine Zeile eine Norm von null hat, um Division durch null zu verhindern.
        """
        row_norms = np.linalg.norm(v, axis=1, keepdims=True)
        if np.any(row_norms == 0):
            raise ValueError("Kann Zeilen mit einer Norm von null nicht normalisieren.")
        return v / row_norms


    vo = voyageai.Client()

    # Generiere voyage-code-3-Vektoren, die standardmäßig 1024-dimensionale Gleitkommazahlen sind
    embd = vo.embed(['Beispieltext 1', 'Beispieltext 2'], model='voyage-code-3').embeddings

    # Setze kürzere Dimension
    short_dim = 256

    # Größe ändern und Vektoren auf kürzere Dimension normalisieren
    resized_embd = embd_normalize(np.array(embd)[:, :short_dim]).tolist()
    ```
  
</section>

## Preise

Besuchen Sie Voyages [Preisseite](https://docs.voyageai.com/docs/pricing?ref=anthropic) für die aktuellsten Preisdetails.