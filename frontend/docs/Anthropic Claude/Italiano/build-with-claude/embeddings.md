# Embeddings

Gli embeddings di testo sono rappresentazioni numeriche del testo che consentono di misurare la similarità semantica. Questa guida introduce gli embeddings, le loro applicazioni e come utilizzare i modelli di embedding per compiti come ricerca, raccomandazioni e rilevamento di anomalie.

---

## Prima di implementare gli embeddings

Quando si seleziona un provider di embeddings, ci sono diversi fattori che puoi considerare a seconda delle tue esigenze e preferenze:

- Dimensione del dataset e specificità del dominio: dimensione del dataset di addestramento del modello e la sua rilevanza per il dominio che vuoi incorporare. Dati più grandi o più specifici del dominio generalmente producono embeddings migliori nel dominio
- Prestazioni di inferenza: velocità di ricerca degli embeddings e latenza end-to-end. Questa è una considerazione particolarmente importante per implementazioni di produzione su larga scala
- Personalizzazione: opzioni per l'addestramento continuo su dati privati, o specializzazione di modelli per domini molto specifici. Questo può migliorare le prestazioni su vocabolari unici

## Come ottenere embeddings con Anthropic

Anthropic non offre il proprio modello di embedding. Un provider di embeddings che ha un'ampia varietà di opzioni e capacità che comprende tutte le considerazioni sopra menzionate è Voyage AI.

Voyage AI crea modelli di embedding all'avanguardia e offre modelli personalizzati per domini industriali specifici come finanza e sanità, o modelli fine-tuned su misura per singoli clienti.

Il resto di questa guida è per Voyage AI, ma ti incoraggiamo a valutare una varietà di fornitori di embeddings per trovare la soluzione migliore per il tuo caso d'uso specifico.

## Modelli Disponibili

Voyage raccomanda di utilizzare i seguenti modelli di embedding di testo:

| Modello | Lunghezza del Contesto | Dimensione dell'Embedding | Descrizione |
| --- | --- | --- | --- |
| `voyage-3-large` | 32,000 | 1024 (predefinito), 256, 512, 2048 | La migliore qualità di recupero generale e multilingue. Vedi [post del blog](https://blog.voyageai.com/2025/01/07/voyage-3-large/) per i dettagli. |
| `voyage-3.5` | 32,000 | 1024 (predefinito), 256, 512, 2048 | Ottimizzato per la qualità di recupero generale e multilingue. Vedi [post del blog](https://blog.voyageai.com/2025/05/20/voyage-3-5/) per i dettagli. |
| `voyage-3.5-lite` | 32,000 | 1024 (predefinito), 256, 512, 2048 | Ottimizzato per latenza e costo. Vedi [post del blog](https://blog.voyageai.com/2025/05/20/voyage-3-5/) per i dettagli. |
| `voyage-code-3` | 32,000 | 1024 (predefinito), 256, 512, 2048 | Ottimizzato per il recupero di **codice**. Vedi [post del blog](https://blog.voyageai.com/2024/12/04/voyage-code-3/) per i dettagli. |
| `voyage-finance-2` | 32,000 | 1024 | Ottimizzato per il recupero e RAG in ambito **finanziario**. Vedi [post del blog](https://blog.voyageai.com/2024/06/03/domain-specific-embeddings-finance-edition-voyage-finance-2/) per i dettagli. |
| `voyage-law-2` | 16,000 | 1024 | Ottimizzato per il recupero e RAG **legale** e **a contesto lungo**. Anche prestazioni migliorate in tutti i domini. Vedi [post del blog](https://blog.voyageai.com/2024/04/15/domain-specific-embeddings-and-retrieval-legal-edition-voyage-law-2/) per i dettagli. |

Inoltre, sono raccomandati i seguenti modelli di embedding multimodali:

| Modello | Lunghezza del Contesto | Dimensione dell'Embedding | Descrizione |
| --- | --- | --- | --- |
| `voyage-multimodal-3` | 32000 | 1024 | Modello di embedding multimodale ricco che può vettorializzare testo interlacciato e immagini ricche di contenuto, come screenshot di PDF, slide, tabelle, figure e altro. Vedi [post del blog](https://blog.voyageai.com/2024/11/12/voyage-multimodal-3/) per i dettagli. |

Hai bisogno di aiuto per decidere quale modello di embedding di testo utilizzare? Consulta le [FAQ](https://docs.voyageai.com/docs/faq#what-embedding-models-are-available-and-which-one-should-i-use&ref=anthropic).

## Iniziare con Voyage AI

Per accedere agli embeddings di Voyage:

1. Registrati sul sito web di Voyage AI
2. Ottieni una chiave API
3. Imposta la chiave API come variabile d'ambiente per comodità:

```bash
export VOYAGE_API_KEY="<la tua chiave segreta>"
```

Puoi ottenere gli embeddings utilizzando il [pacchetto Python `voyageai` ufficiale](https://github.com/voyage-ai/voyageai-python) o richieste HTTP, come descritto di seguito.

### Libreria Python di Voyage

Il pacchetto `voyageai` può essere installato utilizzando il seguente comando:

```bash
pip install -U voyageai
```

Quindi, puoi creare un oggetto client e iniziare a usarlo per incorporare i tuoi testi:

```python
import voyageai

vo = voyageai.Client()
# Questo utilizzerà automaticamente la variabile d'ambiente VOYAGE_API_KEY.
# In alternativa, puoi usare vo = voyageai.Client(api_key="<la tua chiave segreta>")

texts = ["Testo di esempio 1", "Testo di esempio 2"]

result = vo.embed(texts, model="voyage-3.5", input_type="document")
print(result.embeddings[0])
print(result.embeddings[1])
```

`result.embeddings` sarà una lista di due vettori di embedding, ciascuno contenente 1024 numeri in virgola mobile. Dopo aver eseguito il codice sopra, i due embeddings verranno stampati sullo schermo:

```
[-0.013131560757756233, 0.019828535616397858, ...]   # embedding per "Testo di esempio 1"
[-0.0069352793507277966, 0.020878976210951805, ...]  # embedding per "Testo di esempio 2"
```

Quando crei gli embeddings, puoi specificare alcuni altri argomenti alla funzione `embed()`.

Per maggiori informazioni sul pacchetto Python di Voyage, vedi [la documentazione di Voyage](https://docs.voyageai.com/docs/embeddings#python-api).

### API HTTP di Voyage

Puoi anche ottenere embeddings richiedendo l'API HTTP di Voyage. Ad esempio, puoi inviare una richiesta HTTP attraverso il comando `curl` in un terminale:

```bash
curl https://api.voyageai.com/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $VOYAGE_API_KEY" \
  -d '{
    "input": ["Testo di esempio 1", "Testo di esempio 2"],
    "model": "voyage-3.5"
  }'
```

La risposta che otterresti è un oggetto JSON contenente gli embeddings e l'utilizzo dei token:

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

Per maggiori informazioni sull'API HTTP di Voyage, vedi [la documentazione di Voyage](https://docs.voyageai.com/reference/embeddings-api).

### AWS Marketplace

Gli embeddings di Voyage sono disponibili su [AWS Marketplace](https://aws.amazon.com/marketplace/seller-profile?id=seller-snt4gb6fd7ljg). Le istruzioni per accedere a Voyage su AWS sono disponibili [qui](https://docs.voyageai.com/docs/aws-marketplace-model-package?ref=anthropic).

## Esempio di avvio rapido

Ora che sappiamo come ottenere gli embeddings, vediamo un breve esempio.

Supponiamo di avere un piccolo corpus di sei documenti da cui recuperare

```python
documents = [
    "La dieta mediterranea enfatizza pesce, olio d'oliva e verdure, ritenuta in grado di ridurre le malattie croniche.",
    "La fotosintesi nelle piante converte l'energia luminosa in glucosio e produce ossigeno essenziale.",
    "Le innovazioni del XX secolo, dalle radio agli smartphone, si sono concentrate sui progressi elettronici.",
    "I fiumi forniscono acqua, irrigazione e habitat per le specie acquatiche, vitali per gli ecosistemi.",
    "La conference call di Apple per discutere i risultati del quarto trimestre fiscale e gli aggiornamenti aziendali è programmata per giovedì 2 novembre 2023 alle 14:00 PT / 17:00 ET.",
    "Le opere di Shakespeare, come 'Amleto' e 'Sogno di una notte di mezza estate,' perdurano nella letteratura."
]

```

Utilizzeremo prima Voyage per convertire ciascuno di essi in un vettore di embedding

```python
import voyageai

vo = voyageai.Client()

# Incorpora i documenti
doc_embds = vo.embed(
    documents, model="voyage-3.5", input_type="document"
).embeddings
```

Gli embeddings ci permetteranno di fare ricerca semantica / recupero nello spazio vettoriale. Data una query di esempio,

```python
query = "Quando è programmata la conference call di Apple?"
```

la convertiamo in un embedding, e conduciamo una ricerca del vicino più prossimo per trovare il documento più rilevante basato sulla distanza nello spazio degli embeddings.

```python
import numpy as np

# Incorpora la query
query_embd = vo.embed(
    [query], model="voyage-3.5", input_type="query"
).embeddings[0]

# Calcola la similarità
# Gli embeddings di Voyage sono normalizzati a lunghezza 1, quindi il prodotto scalare
# e la similarità del coseno sono la stessa cosa.
similarities = np.dot(doc_embds, query_embd)

retrieved_id = np.argmax(similarities)
print(documents[retrieved_id])
```

Nota che utilizziamo `input_type="document"` e `input_type="query"` per incorporare rispettivamente il documento e la query. Maggiori specifiche possono essere trovate [qui](/docs/it/build-with-claude/embeddings#voyage-python-package).

L'output sarebbe il 5° documento, che è infatti il più rilevante per la query:

```
La conference call di Apple per discutere i risultati del quarto trimestre fiscale e gli aggiornamenti aziendali è programmata per giovedì 2 novembre 2023 alle 14:00 PT / 17:00 ET.
```

Se stai cercando un set dettagliato di cookbook su come fare RAG con gli embeddings, inclusi i database vettoriali, consulta il nostro [cookbook RAG](https://github.com/anthropics/anthropic-cookbook/blob/main/third_party/Pinecone/rag_using_pinecone.ipynb).

## FAQ

  <section title="Perché gli embeddings di Voyage hanno una qualità superiore?">

    I modelli di embedding si basano su potenti reti neurali per catturare e comprimere il contesto semantico, simili ai modelli generativi. Il team di ricercatori AI esperti di Voyage ottimizza ogni componente del processo di embedding, inclusi:
    - Architettura del modello 
    - Raccolta dati
    - Funzioni di perdita
    - Selezione dell'ottimizzatore

    Scopri di più sull'approccio tecnico di Voyage sul loro [blog](https://blog.voyageai.com/).
  
</section>

  <section title="Quali modelli di embedding sono disponibili e quale dovrei usare?">

    Per embedding di uso generale, raccomandiamo:
    - `voyage-3-large`: Migliore qualità
    - `voyage-3.5-lite`: Latenza e costo più bassi
    - `voyage-3.5`: Prestazioni bilanciate con qualità di recupero superiore a un punto di prezzo competitivo 
    
    Per il recupero, usa il parametro `input_type` per specificare se il testo è di tipo query o documento.

    Modelli specifici per dominio:

    - Compiti legali: `voyage-law-2`
    - Codice e documentazione di programmazione: `voyage-code-3`
    - Compiti relativi alla finanza: `voyage-finance-2`
  
</section>

  <section title="Quale funzione di similarità dovrei usare?">

    Puoi usare gli embeddings di Voyage con similarità del prodotto scalare, similarità del coseno, o distanza euclidea. Una spiegazione sulla similarità degli embeddings può essere trovata [qui](https://www.pinecone.io/learn/vector-similarity/).

    Gli embeddings di Voyage AI sono normalizzati a lunghezza 1, il che significa che:

    - La similarità del coseno è equivalente alla similarità del prodotto scalare, mentre quest'ultima può essere calcolata più rapidamente.
    - La similarità del coseno e la distanza euclidea risulteranno in classifiche identiche.
  
</section>

  <section title="Qual è la relazione tra caratteri, parole e token?">

    Si prega di vedere questa [pagina](https://docs.voyageai.com/docs/tokenization?ref=anthropic).
  
</section>

  <section title="Quando e come dovrei usare il parametro input_type?">

    Per tutti i compiti di recupero e casi d'uso (ad es., RAG), raccomandiamo che il parametro `input_type` sia utilizzato per specificare se il testo di input è una query o un documento. Non omettere `input_type` o impostare `input_type=None`. Specificare se il testo di input è una query o un documento può creare migliori rappresentazioni vettoriali dense per il recupero, il che può portare a una migliore qualità di recupero.

    Quando si utilizza il parametro `input_type`, prompt speciali vengono anteposti al testo di input prima dell'embedding. Specificamente:

    > 📘 **Prompt associati con `input_type`**
    > 
    > - Per una query, il prompt è "Represent the query for retrieving supporting documents: ".
    > - Per un documento, il prompt è "Represent the document for retrieval: ".
    > - Esempio
    >     - Quando `input_type="query"`, una query come "Quando è programmata la conference call di Apple?" diventerà "**Represent the query for retrieving supporting documents:** Quando è programmata la conference call di Apple?"
    >     - Quando `input_type="document"`, una query come "La conference call di Apple per discutere i risultati del quarto trimestre fiscale e gli aggiornamenti aziendali è programmata per giovedì 2 novembre 2023 alle 14:00 PT / 17:00 ET." diventerà "**Represent the document for retrieval:** La conference call di Apple per discutere i risultati del quarto trimestre fiscale e gli aggiornamenti aziendali è programmata per giovedì 2 novembre 2023 alle 14:00 PT / 17:00 ET."

    `voyage-large-2-instruct`, come suggerisce il nome, è addestrato per essere reattivo a istruzioni aggiuntive che vengono anteposte al testo di input. Per classificazione, clustering, o altri sotto-compiti [MTEB](https://huggingface.co/mteb), si prega di utilizzare le istruzioni [qui](https://github.com/voyage-ai/voyage-large-2-instruct).
  
</section>

  <section title="Quali opzioni di quantizzazione sono disponibili?">

    La quantizzazione negli embeddings converte valori ad alta precisione, come numeri in virgola mobile a singola precisione a 32 bit, in formati a precisione inferiore come interi a 8 bit o valori binari a 1 bit, riducendo lo storage, la memoria e i costi rispettivamente di 4x e 32x. I modelli Voyage supportati abilitano la quantizzazione specificando il tipo di dati di output con il parametro `output_dtype`:

    - `float`: Ogni embedding restituito è una lista di numeri in virgola mobile a singola precisione a 32 bit (4 byte). Questo è il predefinito e fornisce la massima precisione / accuratezza di recupero.
    - `int8` e `uint8`: Ogni embedding restituito è una lista di interi a 8 bit (1 byte) che vanno da -128 a 127 e da 0 a 255, rispettivamente.
    - `binary` e `ubinary`: Ogni embedding restituito è una lista di interi a 8 bit che rappresentano valori di embedding quantizzati a singolo bit impaccati in bit: `int8` per `binary` e `uint8` per `ubinary`. La lunghezza della lista restituita di interi è 1/8 della dimensione effettiva dell'embedding. Il tipo binario utilizza il metodo binario offset, di cui puoi saperne di più nelle FAQ qui sotto.

    > **Esempio di quantizzazione binaria**
    > 
    > Considera i seguenti otto valori di embedding: -0.03955078, 0.006214142, -0.07446289, -0.039001465, 0.0046463013, 0.00030612946, -0.08496094, e 0.03994751. Con la quantizzazione binaria, i valori minori o uguali a zero saranno quantizzati a uno zero binario, e i valori positivi a un uno binario, risultando nella seguente sequenza binaria: 0, 1, 0, 0, 1, 1, 0, 1. Questi otto bit vengono poi impaccati in un singolo intero a 8 bit, 01001101 (con il bit più a sinistra come bit più significativo).
    >   - `ubinary`: La sequenza binaria viene direttamente convertita e rappresentata come l'intero senza segno (`uint8`) 77.
    >   - `binary`: La sequenza binaria viene rappresentata come l'intero con segno (`int8`) -51, calcolato utilizzando il metodo binario offset (77 - 128 = -51).
  
</section>

  <section title="Come posso troncare gli embeddings Matryoshka?">

    L'apprendimento Matryoshka crea embeddings con rappresentazioni da grossolane a fini all'interno di un singolo vettore. I modelli Voyage, come `voyage-code-3`, che supportano multiple dimensioni di output generano tali embeddings Matryoshka. Puoi troncare questi vettori mantenendo il sottoinsieme iniziale di dimensioni. Ad esempio, il seguente codice Python dimostra come troncare vettori a 1024 dimensioni a 256 dimensioni:

    ```python
    import voyageai
    import numpy as np

    def embd_normalize(v: np.ndarray) -> np.ndarray:
        """
        Normalizza le righe di un array numpy 2D a vettori unitari dividendo ogni riga per la sua
        norma euclidea. Solleva un ValueError se qualche riga ha una norma di zero per prevenire la divisione per zero.
        """
        row_norms = np.linalg.norm(v, axis=1, keepdims=True)
        if np.any(row_norms == 0):
            raise ValueError("Impossibile normalizzare righe con una norma di zero.")
        return v / row_norms


    vo = voyageai.Client()

    # Genera vettori voyage-code-3, che per default sono numeri in virgola mobile a 1024 dimensioni
    embd = vo.embed(['Testo di esempio 1', 'Testo di esempio 2'], model='voyage-code-3').embeddings

    # Imposta dimensione più corta
    short_dim = 256

    # Ridimensiona e normalizza i vettori a dimensione più corta
    resized_embd = embd_normalize(np.array(embd)[:, :short_dim]).tolist()
    ```
  
</section>

## Prezzi

Visita la [pagina dei prezzi](https://docs.voyageai.com/docs/pricing?ref=anthropic) di Voyage per i dettagli sui prezzi più aggiornati.