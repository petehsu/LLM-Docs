# Streaming fin des outils

Le streaming fin des paramètres d'outils réduit la latence pour commencer à recevoir de grands paramètres.

---

L'utilisation d'outils supporte maintenant le [streaming](/docs/fr/build-with-claude/streaming) fin des valeurs de paramètres. Cela permet aux développeurs de diffuser les paramètres d'utilisation d'outils sans mise en mémoire tampon / validation JSON, réduisant la latence pour commencer à recevoir de grands paramètres.

Le streaming fin des outils est disponible via l'API Claude, AWS Bedrock, Google Cloud's Vertex AI, et Microsoft Foundry.

<Note>
Le streaming fin des outils est une fonctionnalité bêta. Veuillez vous assurer d'évaluer vos réponses avant de l'utiliser en production.

Veuillez utiliser [ce formulaire](https://forms.gle/D4Fjr7GvQRzfTZT96) pour fournir des commentaires sur la qualité des réponses du modèle, l'API elle-même, ou la qualité de la documentation—nous avons hâte d'avoir de vos nouvelles !
</Note>

<Warning>
Lors de l'utilisation du streaming fin des outils, vous pouvez potentiellement recevoir des entrées JSON invalides ou partielles. Veuillez vous assurer de tenir compte de ces cas limites dans votre code.
</Warning>

## Comment utiliser le streaming fin des outils

Pour utiliser cette fonctionnalité bêta, ajoutez simplement l'en-tête bêta `fine-grained-tool-streaming-2025-05-14` à une demande d'utilisation d'outil et activez le streaming.

Voici un exemple de la façon d'utiliser le streaming fin des outils avec l'API :

<CodeGroup>

  ```bash Shell
  curl https://api.anthropic.com/v1/messages \
    -H "content-type: application/json" \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "anthropic-beta: fine-grained-tool-streaming-2025-05-14" \
    -d '{
      "model": "claude-sonnet-4-5",
      "max_tokens": 65536,
      "tools": [
        {
          "name": "make_file",
          "description": "Write text to a file",
          "input_schema": {
            "type": "object",
            "properties": {
              "filename": {
                "type": "string",
                "description": "The filename to write text to"
              },
              "lines_of_text": {
                "type": "array",
                "description": "An array of lines of text to write to the file"
              }
            },
            "required": ["filename", "lines_of_text"]
          }
        }
      ],
      "messages": [
        {
          "role": "user",
          "content": "Can you write a long poem and make a file called poem.txt?"
        }
      ],
      "stream": true
    }' | jq '.usage'
  ```

  ```python Python
  import anthropic

  client = anthropic.Anthropic()

  response = client.beta.messages.stream(
      max_tokens=65536,
      model="claude-sonnet-4-5",
      tools=[{
        "name": "make_file",
        "description": "Write text to a file",
        "input_schema": {
          "type": "object",
          "properties": {
            "filename": {
              "type": "string",
              "description": "The filename to write text to"
            },
            "lines_of_text": {
              "type": "array",
              "description": "An array of lines of text to write to the file"
            }
          },
          "required": ["filename", "lines_of_text"]
        }
      }],
      messages=[{
        "role": "user",
        "content": "Can you write a long poem and make a file called poem.txt?"
      }],
      betas=["fine-grained-tool-streaming-2025-05-14"]
  )

  print(response.usage)
  ```

  ```typescript TypeScript
  import Anthropic from '@anthropic-ai/sdk';

  const anthropic = new Anthropic();

  const message = await anthropic.beta.messages.stream({
    model: "claude-sonnet-4-5",
    max_tokens: 65536,
    tools: [{
      "name": "make_file",
      "description": "Write text to a file",
      "input_schema": {
        "type": "object",
        "properties": {
          "filename": {
            "type": "string",
            "description": "The filename to write text to"
          },
          "lines_of_text": {
            "type": "array",
            "description": "An array of lines of text to write to the file"
          }
        },
        "required": ["filename", "lines_of_text"]
      }
    }],
    messages: [{ 
      role: "user", 
      content: "Can you write a long poem and make a file called poem.txt?" 
    }],
    betas: ["fine-grained-tool-streaming-2025-05-14"]
  });

  console.log(message.usage);
  ```
</CodeGroup>

Dans cet exemple, le streaming fin des outils permet à Claude de diffuser les lignes d'un long poème dans l'appel d'outil `make_file` sans mise en mémoire tampon pour valider si le paramètre `lines_of_text` est un JSON valide. Cela signifie que vous pouvez voir le flux de paramètres à mesure qu'il arrive, sans avoir à attendre que le paramètre entier soit mis en mémoire tampon et validé.

<Note>
Avec le streaming fin des outils, les chunks d'utilisation d'outils commencent à être diffusés plus rapidement, et sont souvent plus longs et contiennent moins de coupures de mots. Ceci est dû aux différences dans le comportement du chunking.

Exemple :

Sans streaming fin (délai de 15s) :
```
Chunk 1: '{"'
Chunk 2: 'query": "Ty'
Chunk 3: 'peScri'
Chunk 4: 'pt 5.0 5.1 '
Chunk 5: '5.2 5'
Chunk 6: '.3'
Chunk 8: ' new f'
Chunk 9: 'eatur'
...
```

Avec streaming fin (délai de 3s) :
```
Chunk 1: '{"query": "TypeScript 5.0 5.1 5.2 5.3'
Chunk 2: ' new features comparison'
```
</Note>

<Warning>
Parce que le streaming fin envoie les paramètres sans mise en mémoire tampon ou validation JSON, il n'y a aucune garantie que le flux résultant se terminera dans une chaîne JSON valide.
En particulier, si la [raison d'arrêt](/docs/fr/build-with-claude/handling-stop-reasons) `max_tokens` est atteinte, le flux peut s'arrêter au milieu d'un paramètre et peut être incomplet. Vous devrez généralement écrire un support spécifique pour gérer le moment où `max_tokens` est atteint.
</Warning>

## Gestion du JSON invalide dans les réponses des outils

Lors de l'utilisation du streaming fin des outils, vous pouvez recevoir du JSON invalide ou incomplet du modèle. Si vous devez renvoyer ce JSON invalide au modèle dans un bloc de réponse d'erreur, vous pouvez l'envelopper dans un objet JSON pour assurer un traitement approprié (avec une clé raisonnable). Par exemple :

```json
{
  "INVALID_JSON": "<your invalid json string>"
}
```

Cette approche aide le modèle à comprendre que le contenu est un JSON invalide tout en préservant les données malformées d'origine à des fins de débogage.

<Note>
Lors de l'enveloppe du JSON invalide, assurez-vous d'échapper correctement les guillemets ou les caractères spéciaux dans la chaîne JSON invalide pour maintenir une structure JSON valide dans l'objet wrapper.
</Note>