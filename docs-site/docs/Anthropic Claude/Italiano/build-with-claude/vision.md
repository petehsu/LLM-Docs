# Visione

Le capacità di visione di Claude gli permettono di comprendere e analizzare le immagini, aprendo possibilità entusiasmanti per l'interazione multimodale.

---

Questa guida descrive come lavorare con le immagini in Claude, incluse le migliori pratiche, esempi di codice e limitazioni da tenere a mente.

---

## Come utilizzare la visione

Utilizza le capacità di visione di Claude tramite:

- [claude.ai](https://claude.ai/). Carica un'immagine come faresti con un file, o trascina e rilascia un'immagine direttamente nella finestra della chat.
- [Console Workbench](/workbench/). Un pulsante per aggiungere immagini appare in alto a destra di ogni blocco di messaggio dell'utente.
- **Richiesta API**. Vedi gli esempi in questa guida.

---

## Prima di caricare

### Nozioni di base e limiti

Puoi includere più immagini in una singola richiesta (fino a 20 per [claude.ai](https://claude.ai/) e 100 per richieste API). Claude analizzerà tutte le immagini fornite quando formula la sua risposta. Questo può essere utile per confrontare o contrastare le immagini.

Se invii un'immagine più grande di 8000x8000 px, verrà rifiutata. Se invii più di 20 immagini in una richiesta API, questo limite è 2000x2000 px.

<Note>
Sebbene l'API supporti 100 immagini per richiesta, esiste un [limite di dimensione della richiesta di 32MB](/docs/it/api/overview#request-size-limits) per gli endpoint standard.
</Note>

### Valuta la dimensione dell'immagine

Per prestazioni ottimali, consigliamo di ridimensionare le immagini prima di caricarle se sono troppo grandi. Se il bordo lungo della tua immagine è superiore a 1568 pixel, o la tua immagine è superiore a ~1.600 token, verrà prima ridimensionata, preservando le proporzioni, finché non rientra nei limiti di dimensione.

Se la tua immagine di input è troppo grande e deve essere ridimensionata, aumenterà la latenza del [time-to-first-token](/docs/it/about-claude/glossary), senza darti alcuna prestazione aggiuntiva del modello. Le immagini molto piccole sotto i 200 pixel su qualsiasi bordo possono degradare le prestazioni.

<Tip>
  Per migliorare il [time-to-first-token](/docs/it/about-claude/glossary), consigliamo
  di ridimensionare le immagini a non più di 1,15 megapixel (e entro 1568 pixel in
  entrambe le dimensioni).
</Tip>

Ecco una tabella delle dimensioni massime delle immagini accettate dalla nostra API che non verranno ridimensionate per i rapporti di aspetto comuni. Con Claude Sonnet 4.5, queste immagini utilizzano approssimativamente 1.600 token e circa $4,80/1K immagini.

| Rapporto di aspetto | Dimensione immagine |
| ------------------- | ------------------- |
| 1&#58;1             | 1092x1092 px        |
| 3&#58;4             | 951x1268 px         |
| 2&#58;3             | 896x1344 px         |
| 9&#58;16            | 819x1456 px         |
| 1&#58;2             | 784x1568 px         |

### Calcola i costi delle immagini

Ogni immagine che includi in una richiesta a Claude conta verso l'utilizzo dei tuoi token. Per calcolare il costo approssimativo, moltiplica il numero approssimativo di token dell'immagine per il [prezzo per token del modello](https://claude.com/pricing) che stai utilizzando.

Se la tua immagine non ha bisogno di essere ridimensionata, puoi stimare il numero di token utilizzati attraverso questo algoritmo: `tokens = (width px * height px)/750`

Ecco esempi di tokenizzazione approssimativa e costi per diverse dimensioni di immagini entro i vincoli di dimensione dell'API basati sul prezzo per token di Claude Sonnet 4.5 di $3 per milione di token di input:

| Dimensione immagine               | \# di token | Costo / immagine | Costo / 1K immagini |
| --------------------------------- | ----------- | ---------------- | ------------------- |
| 200x200 px(0,04 megapixel)        | \~54        | \~$0,00016       | \~$0,16             |
| 1000x1000 px(1 megapixel)         | \~1334      | \~$0,004         | \~$4,00             |
| 1092x1092 px(1,19 megapixel)      | \~1590      | \~$0,0048        | \~$4,80             |

### Garantire la qualità dell'immagine

Quando fornisci immagini a Claude, tieni presente quanto segue per i migliori risultati:

- **Formato immagine**: Utilizza un formato immagine supportato: JPEG, PNG, GIF o WebP.
- **Chiarezza immagine**: Assicurati che le immagini siano chiare e non troppo sfocate o pixelate.
- **Testo**: Se l'immagine contiene testo importante, assicurati che sia leggibile e non troppo piccolo. Evita di ritagliare il contesto visivo chiave solo per ingrandire il testo.

---

## Esempi di prompt

Molte delle [tecniche di prompt](/docs/it/build-with-claude/prompt-engineering/overview) che funzionano bene per le interazioni basate su testo con Claude possono essere applicate anche ai prompt basati su immagini.

Questi esempi dimostrano le migliori strutture di prompt che coinvolgono immagini.

<Tip>
  Proprio come con il posizionamento della query del documento, Claude funziona meglio quando le immagini vengono
  prima del testo. Le immagini posizionate dopo il testo o interpolate con il testo funzioneranno comunque bene,
  ma se il tuo caso d'uso lo consente, consigliamo una struttura immagine-poi-testo.
</Tip>

### Informazioni sugli esempi di prompt

I seguenti esempi dimostrano come utilizzare le capacità di visione di Claude utilizzando vari linguaggi di programmazione e approcci. Puoi fornire immagini a Claude in tre modi:

1. Come immagine codificata in base64 nei blocchi di contenuto `image`
2. Come riferimento URL a un'immagine ospitata online
3. Utilizzando l'API Files (carica una volta, usa più volte)

Gli esempi di prompt codificati in base64 utilizzano queste variabili:

<CodeGroup>
```bash Shell
    # Per le immagini basate su URL, puoi utilizzare l'URL direttamente nella tua richiesta JSON
    
    # Per le immagini codificate in base64, devi prima codificare l'immagine
    # Esempio di come codificare un'immagine in base64 in bash:
    BASE64_IMAGE_DATA=$(curl -s "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg" | base64)
    
    # I dati codificati possono ora essere utilizzati nelle tue chiamate API
```

```python Python
import base64
import httpx

# Per le immagini codificate in base64
image1_url = "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg"
image1_media_type = "image/jpeg"
image1_data = base64.standard_b64encode(httpx.get(image1_url).content).decode("utf-8")

image2_url = "https://upload.wikimedia.org/wikipedia/commons/b/b5/Iridescent.green.sweat.bee1.jpg"
image2_media_type = "image/jpeg"
image2_data = base64.standard_b64encode(httpx.get(image2_url).content).decode("utf-8")

# Per le immagini basate su URL, puoi utilizzare gli URL direttamente nelle tue richieste
```

```typescript TypeScript
import axios from 'axios';

// Per le immagini codificate in base64
async function getBase64Image(url: string): Promise<string> {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  return Buffer.from(response.data, 'binary').toString('base64');
}

// Utilizzo
async function prepareImages() {
  const imageData = await getBase64Image('https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg');
  // Ora puoi utilizzare imageData nelle tue chiamate API
}

// Per le immagini basate su URL, puoi utilizzare gli URL direttamente nelle tue richieste
```

```java Java
import java.io.IOException;
import java.util.Base64;
import java.io.InputStream;
import java.net.URL;

public class ImageHandlingExample {

    public static void main(String[] args) throws IOException, InterruptedException {
        // Per le immagini codificate in base64
        String image1Url = "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg";
        String image1MediaType = "image/jpeg";
        String image1Data = downloadAndEncodeImage(image1Url);

        String image2Url = "https://upload.wikimedia.org/wikipedia/commons/b/b5/Iridescent.green.sweat.bee1.jpg";
        String image2MediaType = "image/jpeg";
        String image2Data = downloadAndEncodeImage(image2Url);

        // Per le immagini basate su URL, puoi utilizzare gli URL direttamente nelle tue richieste
    }

    private static String downloadAndEncodeImage(String imageUrl) throws IOException {
        try (InputStream inputStream = new URL(imageUrl).openStream()) {
            return Base64.getEncoder().encodeToString(inputStream.readAllBytes());
        }
    }

}
```
</CodeGroup>

Di seguito sono riportati esempi di come includere immagini in una richiesta dell'API Messages utilizzando immagini codificate in base64 e riferimenti URL:

### Esempio di immagine codificata in base64

<CodeGroup>
    ```bash Shell
    curl https://api.anthropic.com/v1/messages \
      -H "x-api-key: $ANTHROPIC_API_KEY" \
      -H "anthropic-version: 2023-06-01" \
      -H "content-type: application/json" \
      -d '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 1024,
        "messages": [
          {
            "role": "user",
            "content": [
              {
                "type": "image",
                "source": {
                  "type": "base64",
                  "media_type": "image/jpeg",
                  "data": "'"$BASE64_IMAGE_DATA"'"
                }
              },
              {
                "type": "text",
                "text": "Describe this image."
              }
            ]
          }
        ]
      }'
    ```
    ```python Python
    import anthropic

    client = anthropic.Anthropic()
    message = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": image1_media_type,
                            "data": image1_data,
                        },
                    },
                    {
                        "type": "text",
                        "text": "Describe this image."
                    }
                ],
            }
        ],
    )
    print(message)
    ```
    ```typescript TypeScript
    import Anthropic from '@anthropic-ai/sdk';

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    async function main() {
      const message = await anthropic.messages.create({
        model: "claude-sonnet-4-5",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: "image/jpeg",
                  data: imageData, // Base64-encoded image data as string
                }
              },
              {
                type: "text",
                text: "Describe this image."
              }
            ]
          }
        ]
      });
      
      console.log(message);
    }

    main();
    ```

    ```java Java
    import java.io.IOException;
    import java.util.List;

    import com.anthropic.client.AnthropicClient;
    import com.anthropic.client.okhttp.AnthropicOkHttpClient;
    import com.anthropic.models.messages.*;

    public class VisionExample {
        public static void main(String[] args) throws IOException, InterruptedException {
            AnthropicClient client = AnthropicOkHttpClient.fromEnv();
            String imageData = ""; // // Base64-encoded image data as string

            List<ContentBlockParam> contentBlockParams = List.of(
                    ContentBlockParam.ofImage(
                            ImageBlockParam.builder()
                                    .source(Base64ImageSource.builder()
                                            .data(imageData)
                                            .build())
                                    .build()
                    ),
                    ContentBlockParam.ofText(TextBlockParam.builder()
                            .text("Describe this image.")
                            .build())
            );
            Message message = client.messages().create(
                    MessageCreateParams.builder()
                            .model(Model.CLAUDE_SONNET_4_5_LATEST)
                            .maxTokens(1024)
                            .addUserMessageOfBlockParams(contentBlockParams)
                            .build()
            );

            System.out.println(message);
        }
    }
    ```
</CodeGroup>

### Esempio di immagine basata su URL

<CodeGroup>
    ```bash Shell
    curl https://api.anthropic.com/v1/messages \
      -H "x-api-key: $ANTHROPIC_API_KEY" \
      -H "anthropic-version: 2023-06-01" \
      -H "content-type: application/json" \
      -d '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 1024,
        "messages": [
          {
            "role": "user",
            "content": [
              {
                "type": "image",
                "source": {
                  "type": "url",
                  "url": "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg"
                }
              },
              {
                "type": "text",
                "text": "Describe this image."
              }
            ]
          }
        ]
      }'
    ```
    ```python Python
    import anthropic

    client = anthropic.Anthropic()
    message = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "url",
                            "url": "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg",
                        },
                    },
                    {
                        "type": "text",
                        "text": "Describe this image."
                    }
                ],
            }
        ],
    )
    print(message)
    ```
    ```typescript TypeScript
    import Anthropic from '@anthropic-ai/sdk';

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    async function main() {
      const message = await anthropic.messages.create({
        model: "claude-sonnet-4-5",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "url",
                  url: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg"
                }
              },
              {
                type: "text",
                text: "Describe this image."
              }
            ]
          }
        ]
      });
      
      console.log(message);
    }

    main();
    ```
    ```java Java
    import java.io.IOException;
    import java.util.List;

    import com.anthropic.client.AnthropicClient;
    import com.anthropic.client.okhttp.AnthropicOkHttpClient;
    import com.anthropic.models.messages.*;

    public class VisionExample {

        public static void main(String[] args) throws IOException, InterruptedException {
            AnthropicClient client = AnthropicOkHttpClient.fromEnv();

            List<ContentBlockParam> contentBlockParams = List.of(
                    ContentBlockParam.ofImage(
                            ImageBlockParam.builder()
                                    .source(UrlImageSource.builder()
                                            .url("https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg")
                                            .build())
                                    .build()
                    ),
                    ContentBlockParam.ofText(TextBlockParam.builder()
                            .text("Describe this image.")
                            .build())
            );
            Message message = client.messages().create(
                    MessageCreateParams.builder()
                            .model(Model.CLAUDE_SONNET_4_5_LATEST)
                            .maxTokens(1024)
                            .addUserMessageOfBlockParams(contentBlockParams)
                            .build()
            );
            System.out.println(message);
        }
    }
    ```
</CodeGroup>

### Esempio di immagine dell'API Files

Per le immagini che utilizzerai ripetutamente o quando vuoi evitare il sovraccarico di codifica, utilizza l'[API Files](/docs/it/build-with-claude/files):

<CodeGroup>
```bash Shell
# Per prima cosa, carica la tua immagine nell'API Files
curl -X POST https://api.anthropic.com/v1/files \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  -F "file=@image.jpg"

# Quindi utilizza il file_id restituito nel tuo messaggio
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "image",
            "source": {
              "type": "file",
              "file_id": "file_abc123"
            }
          },
          {
            "type": "text",
            "text": "Describe this image."
          }
        ]
      }
    ]
  }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

# Carica il file immagine
with open("image.jpg", "rb") as f:
    file_upload = client.beta.files.upload(file=("image.jpg", f, "image/jpeg"))

# Utilizza il file caricato in un messaggio
message = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    betas=["files-api-2025-04-14"],
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {
                        "type": "file",
                        "file_id": file_upload.id
                    }
                },
                {
                    "type": "text",
                    "text": "Describe this image."
                }
            ]
        }
    ],
)

print(message.content)
```

```typescript TypeScript
import { Anthropic, toFile } from '@anthropic-ai/sdk';
import fs from 'fs';

const anthropic = new Anthropic();

async function main() {
  // Carica il file immagine
  const fileUpload = await anthropic.beta.files.upload({
    file: toFile(fs.createReadStream('image.jpg'), undefined, { type: "image/jpeg" })
  }, {
    betas: ['files-api-2025-04-14']
  });

  // Utilizza il file caricato in un messaggio
  const response = await anthropic.beta.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    betas: ['files-api-2025-04-14'],
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'file',
              file_id: fileUpload.id
            }
          },
          {
            type: 'text',
            text: 'Describe this image.'
          }
        ]
      }
    ]
  });

  console.log(response);
}

main();
```

```java Java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.File;
import com.anthropic.models.files.FileUploadParams;
import com.anthropic.models.messages.*;

public class ImageFilesExample {
    public static void main(String[] args) throws IOException {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Carica il file immagine
        File file = client.beta().files().upload(FileUploadParams.builder()
                .file(Files.newInputStream(Path.of("image.jpg")))
                .build());

        // Utilizza il file caricato in un messaggio
        ImageBlockParam imageParam = ImageBlockParam.builder()
                .fileSource(file.id())
                .build();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_SONNET_4_5_LATEST)
                .maxTokens(1024)
                .addUserMessageOfBlockParams(
                        List.of(
                                ContentBlockParam.ofImage(imageParam),
                                ContentBlockParam.ofText(
                                        TextBlockParam.builder()
                                                .text("Describe this image.")
                                                .build()
                                )
                        )
                )
                .build();

        Message message = client.messages().create(params);
        System.out.println(message.content());
    }
}
```
</CodeGroup>

Vedi [Esempi dell'API Messages](/docs/it/api/messages) per ulteriori esempi di codice e dettagli dei parametri.

<section title="Esempio: Un'immagine">

È meglio posizionare le immagini prima nel prompt rispetto alle domande su di esse o alle istruzioni per i compiti che le utilizzano.

Chiedi a Claude di descrivere un'immagine.

| Ruolo | Contenuto                      |
| ----- | ------------------------------ |
| User  | \[Image\] Describe this image. |

<Tabs>
  <Tab title="Using Base64">
    ```python Python
    message = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": image1_media_type,
                            "data": image1_data,
                        },
                    },
                    {
                        "type": "text",
                        "text": "Describe this image."
                    }
                ],
            }
        ],
    )
    ```
  </Tab>
  <Tab title="Using URL">
    ```python Python
    message = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "url",
                            "url": "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg",
                        },
                    },
                    {
                        "type": "text",
                        "text": "Describe this image."
                    }
                ],
            }
        ],
    )
    ```
  </Tab>
</Tabs>

</section>
<section title="Esempio: Più immagini">

In situazioni in cui ci sono più immagini, introduci ogni immagine con `Image 1:` e `Image 2:` e così via. Non hai bisogno di interruzioni di riga tra le immagini o tra le immagini e il prompt.

Chiedi a Claude di descrivere le differenze tra più immagini.
| Ruolo | Contenuto |
| ----- | --------- |
| User  | Image 1: \[Image 1\] Image 2: \[Image 2\] How are these images different? |

<Tabs>
  <Tab title="Using Base64">
    ```python Python
    message = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Image 1:"
                    },
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": image1_media_type,
                            "data": image1_data,
                        },
                    },
                    {
                        "type": "text",
                        "text": "Image 2:"
                    },
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": image2_media_type,
                            "data": image2_data,
                        },
                    },
                    {
                        "type": "text",
                        "text": "How are these images different?"
                    }
                ],
            }
        ],
    )
    ```
  </Tab>
  <Tab title="Using URL">
    ```python Python
    message = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Image 1:"
                    },
                    {
                        "type": "image",
                        "source": {
                            "type": "url",
                            "url": "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg",
                        },
                    },
                    {
                        "type": "text",
                        "text": "Image 2:"
                    },
                    {
                        "type": "image",
                        "source": {
                            "type": "url",
                            "url": "https://upload.wikimedia.org/wikipedia/commons/b/b5/Iridescent.green.sweat.bee1.jpg",
                        },
                    },
                    {
                        "type": "text",
                        "text": "How are these images different?"
                    }
                ],
            }
        ],
    )
    ```
  </Tab>
</Tabs>

</section>
<section title="Esempio: Più immagini con un prompt di sistema">

Chiedi a Claude di descrivere le differenze tra più immagini, mentre gli dai un prompt di sistema su come rispondere.

| Contenuto | |
| --------- | --------- |
| System    | Respond only in Spanish. |
| User      | Image 1: \[Image 1\] Image 2: \[Image 2\] How are these images different? |

<Tabs>
  <Tab title="Using Base64">
    ```python Python
    message = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1024,
        system="Respond only in Spanish.",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Image 1:"
                    },
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": image1_media_type,
                            "data": image1_data,
                        },
                    },
                    {
                        "type": "text",
                        "text": "Image 2:"
                    },
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": image2_media_type,
                            "data": image2_data,
                        },
                    },
                    {
                        "type": "text",
                        "text": "How are these images different?"
                    }
                ],
            }
        ],
    )
    ```
  </Tab>
  <Tab title="Using URL">
    ```python Python
    message = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1024,
        system="Respond only in Spanish.",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Image 1:"
                    },
                    {
                        "type": "image",
                        "source": {
                            "type": "url",
                            "url": "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg",
                        },
                    },
                    {
                        "type": "text",
                        "text": "Image 2:"
                    },
                    {
                        "type": "image",
                        "source": {
                            "type": "url",
                            "url": "https://upload.wikimedia.org/wikipedia/commons/b/b5/Iridescent.green.sweat.bee1.jpg",
                        },
                    },
                    {
                        "type": "text",
                        "text": "How are these images different?"
                    }
                ],
            }
        ],
    )
    ```
  </Tab>
</Tabs>

</section>
<section title="Esempio: Quattro immagini in due turni di conversazione">

Le capacità di visione di Claude brillano nelle conversazioni multimodali che mescolano immagini e testo. Puoi avere scambi lunghi e prolungati con Claude, aggiungendo nuove immagini o domande di follow-up in qualsiasi momento. Questo abilita potenti flussi di lavoro per l'analisi iterativa delle immagini, il confronto o la combinazione di elementi visivi con altre conoscenze.

Chiedi a Claude di contrastare due immagini, quindi poni una domanda di follow-up confrontando le prime immagini con due nuove immagini.
| Ruolo      | Contenuto |
| ---------- | --------- |
| User       | Image 1: \[Image 1\] Image 2: \[Image 2\] How are these images different? |
| Assistant  | \[Claude's response\] |
| User       | Image 1: \[Image 3\] Image 2: \[Image 4\] Are these images similar to the first two? |
| Assistant  | \[Claude's response\] |

Quando utilizzi l'API, inserisci semplicemente nuove immagini nell'array di Messages nel ruolo `user` come parte di qualsiasi struttura di [conversazione multiturn](/docs/it/api/messages) standard.

</section>

---

## Limitazioni

Sebbene le capacità di comprensione delle immagini di Claude siano all'avanguardia, ci sono alcune limitazioni di cui essere consapevoli:

- **Identificazione di persone**: Claude [non può essere utilizzato](https://www.anthropic.com/legal/aup) per identificare (cioè nominare) persone nelle immagini e rifiuterà di farlo.
- **Precisione**: Claude può allucinare o fare errori quando interpreta immagini di bassa qualità, ruotate o molto piccole sotto i 200 pixel.
- **Ragionamento spaziale**: Le capacità di ragionamento spaziale di Claude sono limitate. Potrebbe avere difficoltà con compiti che richiedono una localizzazione precisa o layout, come leggere il quadrante di un orologio analogico o descrivere le posizioni esatte dei pezzi degli scacchi.
- **Conteggio**: Claude può fornire conteggi approssimativi di oggetti in un'immagine ma potrebbe non essere sempre precisamente accurato, specialmente con grandi numeri di piccoli oggetti.
- **Immagini generate dall'IA**: Claude non sa se un'immagine è generata dall'IA e potrebbe essere impreciso se gli viene chiesto. Non fare affidamento su di esso per rilevare immagini false o sintetiche.
- **Contenuto inappropriato**: Claude non elaborerà immagini inappropriate o esplicite che violano la nostra [Politica di utilizzo accettabile](https://www.anthropic.com/legal/aup).
- **Applicazioni sanitarie**: Sebbene Claude possa analizzare immagini mediche generali, non è progettato per interpretare scansioni diagnostiche complesse come TC o risonanze magnetiche. Gli output di Claude non devono essere considerati un sostituto della consulenza medica professionale o della diagnosi.

Rivedi e verifica sempre attentamente le interpretazioni delle immagini di Claude, specialmente per i casi d'uso ad alto rischio. Non utilizzare Claude per compiti che richiedono una precisione perfetta o un'analisi di immagini sensibili senza supervisione umana.

---

## Domande Frequenti

  <section title="Quali tipi di file immagine supporta Claude?">

    Claude attualmente supporta i formati di immagine JPEG, PNG, GIF e WebP, nello specifico:
    - `image/jpeg`
    - `image/png`
    - `image/gif`
    - `image/webp`
  
</section>

{" "}

<section title="Claude può leggere gli URL delle immagini?">

  Sì, Claude può ora elaborare immagini da URL con i nostri blocchi di origine immagine URL nell'API.
  Utilizza semplicemente il tipo di origine "url" invece di "base64" nelle tue richieste API. 
  Esempio:
  ```json
  {
    "type": "image",
    "source": {
      "type": "url",
      "url": "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg"
    }
  }
  ```

</section>

  <section title="C'è un limite alla dimensione del file immagine che posso caricare?">

    Sì, ci sono limiti:
    - API: Massimo 5MB per immagine
    - claude.ai: Massimo 10MB per immagine

    Le immagini più grandi di questi limiti verranno rifiutate e restituiranno un errore quando si utilizza la nostra API.

  
</section>

  <section title="Quante immagini posso includere in una richiesta?">

    I limiti delle immagini sono:
    - Messages API: Fino a 100 immagini per richiesta
    - claude.ai: Fino a 20 immagini per turno

    Le richieste che superano questi limiti verranno rifiutate e restituiranno un errore.

  
</section>

{" "}

<section title="Claude legge i metadati delle immagini?">

  No, Claude non analizza né riceve alcun metadato dalle immagini passate ad esso.

</section>

{" "}

<section title="Posso eliminare le immagini che ho caricato?">

  No. I caricamenti di immagini sono effimeri e non vengono archiviati oltre la durata della richiesta API.
  Le immagini caricate vengono eliminate automaticamente dopo essere state elaborate.

</section>

{" "}

<section title="Dove posso trovare i dettagli sulla privacy dei dati per i caricamenti di immagini?">

  Consulta la nostra pagina sulla politica sulla privacy per informazioni su come gestiamo
  le immagini caricate e altri dati. Non utilizziamo le immagini caricate per addestrare i nostri
  modelli.

</section>

  <section title="E se l'interpretazione dell'immagine di Claude sembra sbagliata?">

    Se l'interpretazione dell'immagine di Claude sembra scorretta:
    1. Assicurati che l'immagine sia chiara, di alta qualità e correttamente orientata.
    2. Prova tecniche di prompt engineering per migliorare i risultati.
    3. Se il problema persiste, segnala l'output in claude.ai (pollice su/giù) o contatta il nostro team di supporto.

    Il tuo feedback ci aiuta a migliorare!

  
</section>

  <section title="Claude può generare o modificare immagini?">

    No, Claude è un modello di comprensione delle immagini solamente. Può interpretare e analizzare immagini, ma non può generare, produrre, modificare, manipolare o creare immagini.
  
</section>

---

## Approfondisci la visione

Pronto a iniziare a costruire con immagini usando Claude? Ecco alcune risorse utili:

- [Multimodal cookbook](https://github.com/anthropics/anthropic-cookbook/tree/main/multimodal): Questo cookbook contiene suggerimenti su [come iniziare con le immagini](https://github.com/anthropics/anthropic-cookbook/blob/main/multimodal/getting%5Fstarted%5Fwith%5Fvision.ipynb) e [tecniche di best practice](https://github.com/anthropics/anthropic-cookbook/blob/main/multimodal/best%5Fpractices%5Ffor%5Fvision.ipynb) per garantire le migliori prestazioni con le immagini. Scopri come puoi richiedere efficacemente a Claude con immagini per eseguire attività come [interpretare e analizzare grafici](https://github.com/anthropics/anthropic-cookbook/blob/main/multimodal/reading%5Fcharts%5Fgraphs%5Fpowerpoints.ipynb) o [estrarre contenuto dai moduli](https://github.com/anthropics/anthropic-cookbook/blob/main/multimodal/how%5Fto%5Ftranscribe%5Ftext.ipynb).
- [Riferimento API](/docs/it/api/messages): Visita la nostra documentazione per l'API Messages, inclusi gli esempi di [chiamate API che coinvolgono immagini](/docs/it/build-with-claude/working-with-messages#vision).

Se hai altre domande, non esitare a contattare il nostro [team di supporto](https://support.claude.com/). Puoi anche unirti alla nostra [comunità di sviluppatori](https://www.anthropic.com/discord) per connetterti con altri creatori e ottenere aiuto dagli esperti di Anthropic.