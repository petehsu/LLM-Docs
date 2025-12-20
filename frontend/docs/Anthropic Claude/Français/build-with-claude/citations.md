# Citations

Claude est capable de fournir des citations détaillées lors de la réponse à des questions sur des documents, vous aidant à suivre et vérifier les sources d'information dans les réponses.

---

Claude est capable de fournir des citations détaillées lors de la réponse à des questions sur des documents, vous aidant à suivre et vérifier les sources d'information dans les réponses.

Tous les [modèles actifs](/docs/fr/about-claude/models/overview) prennent en charge les citations, à l'exception de Haiku 3.

<Warning>
*Citations avec Claude Sonnet 3.7*

Claude Sonnet 3.7 peut être moins susceptible de faire des citations par rapport aux autres modèles Claude sans instructions plus explicites de la part de l'utilisateur. Lors de l'utilisation de citations avec Claude Sonnet 3.7, nous recommandons d'inclure des instructions supplémentaires dans le tour `user`, comme `"Utilisez des citations pour étayer votre réponse."` par exemple.

Nous avons également observé que lorsque le modèle est invité à structurer sa réponse, il est peu probable qu'il utilise des citations à moins qu'on ne lui dise explicitement d'utiliser des citations dans ce format. Par exemple, si le modèle est invité à utiliser des balises `<result>` dans sa réponse, vous devriez ajouter quelque chose comme `"Utilisez toujours des citations dans votre réponse, même dans les balises <result>."`
</Warning>
<Tip>
  Veuillez partager vos commentaires et suggestions sur la fonctionnalité de citations en utilisant ce [formulaire](https://forms.gle/9n9hSrKnKe3rpowH9).
</Tip>

Voici un exemple de comment utiliser les citations avec l'API Messages :

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "document",
            "source": {
              "type": "text",
              "media_type": "text/plain",
              "data": "The grass is green. The sky is blue."
            },
            "title": "My Document",
            "context": "This is a trustworthy document.",
            "citations": {"enabled": true}
          },
          {
            "type": "text",
            "text": "What color is the grass and sky?"
          }
        ]
      }
    ]
  }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "document",
                    "source": {
                        "type": "text",
                        "media_type": "text/plain",
                        "data": "The grass is green. The sky is blue."
                    },
                    "title": "My Document",
                    "context": "This is a trustworthy document.",
                    "citations": {"enabled": True}
                },
                {
                    "type": "text",
                    "text": "What color is the grass and sky?"
                }
            ]
        }
    ]
)
print(response)
```

```java Java
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.*;

public class DocumentExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        PlainTextSource source = PlainTextSource.builder()
                .data("The grass is green. The sky is blue.")
                .build();

        DocumentBlockParam documentParam = DocumentBlockParam.builder()
                .source(source)
                .title("My Document")
                .context("This is a trustworthy document.")
                .citations(CitationsConfigParam.builder().enabled(true).build())
                .build();
        
        TextBlockParam textBlockParam = TextBlockParam.builder()
                .text("What color is the grass and sky?")
                .build();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_SONNET_4_20250514)
                .maxTokens(1024)
                .addUserMessageOfBlockParams(List.of(ContentBlockParam.ofDocument(documentParam), ContentBlockParam.ofText(textBlockParam)))
                .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```

</CodeGroup>

<Tip>
**Comparaison avec les approches basées sur les invites**

En comparaison avec les solutions de citations basées sur les invites, la fonctionnalité de citations présente les avantages suivants :
- **Économies de coûts :** Si votre approche basée sur les invites demande à Claude de produire des citations directes, vous pourriez voir des économies de coûts dues au fait que `cited_text` ne compte pas dans vos jetons de sortie.
- **Meilleure fiabilité des citations :** Parce que nous analysons les citations dans les formats de réponse respectifs mentionnés ci-dessus et extrayons `cited_text`, les citations sont garanties de contenir des pointeurs valides vers les documents fournis.
- **Qualité améliorée des citations :** Dans nos évaluations, nous avons trouvé que la fonctionnalité de citations est significativement plus susceptible de citer les citations les plus pertinentes des documents par rapport aux approches purement basées sur les invites.
</Tip>

---

## Comment fonctionnent les citations

Intégrez les citations avec Claude en suivant ces étapes :

<Steps>
  <Step title="Fournir le(s) document(s) et activer les citations">
    - Incluez des documents dans l'un des formats pris en charge : [PDFs](#pdf-documents), [texte brut](#plain-text-documents), ou documents de [contenu personnalisé](#custom-content-documents)
    - Définissez `citations.enabled=true` sur chacun de vos documents. Actuellement, les citations doivent être activées sur tous ou aucun des documents dans une requête.
    - Notez que seules les citations de texte sont actuellement prises en charge et les citations d'images ne sont pas encore possibles.
  </Step>
  <Step title="Les documents sont traités">
    - Le contenu des documents est "découpé" afin de définir la granularité minimale des citations possibles. Par exemple, le découpage par phrases permettrait à Claude de citer une seule phrase ou d'enchaîner plusieurs phrases consécutives pour citer un paragraphe (ou plus long) !
      - **Pour les PDFs :** Le texte est extrait comme décrit dans [Support PDF](/docs/fr/build-with-claude/pdf-support) et le contenu est découpé en phrases. Citer des images à partir de PDFs n'est actuellement pas pris en charge.
      - **Pour les documents de texte brut :** Le contenu est découpé en phrases qui peuvent être citées.
      - **Pour les documents de contenu personnalisé :** Vos blocs de contenu fournis sont utilisés tels quels et aucun découpage supplémentaire n'est effectué.
  </Step>
  <Step title="Claude fournit une réponse citée">
    - Les réponses peuvent maintenant inclure plusieurs blocs de texte où chaque bloc de texte peut contenir une affirmation que Claude fait et une liste de citations qui soutiennent l'affirmation.
    - Les citations référencent des emplacements spécifiques dans les documents sources. Le format de ces citations dépend du type de document cité.
      - **Pour les PDFs :** les citations incluront la plage de numéros de page (indexée à partir de 1).
      - **Pour les documents de texte brut :** Les citations incluront la plage d'indices de caractères (indexée à partir de 0).
      - **Pour les documents de contenu personnalisé :** Les citations incluront la plage d'indices de blocs de contenu (indexée à partir de 0) correspondant à la liste de contenu originale fournie.
    - Les indices de documents sont fournis pour indiquer la source de référence et sont indexés à partir de 0 selon la liste de tous les documents dans votre requête originale.
  </Step>
</Steps>

<Tip>
  **Découpage automatique vs contenu personnalisé**

  Par défaut, les documents de texte brut et PDF sont automatiquement découpés en phrases. Si vous avez besoin de plus de contrôle sur la granularité des citations (par exemple, pour les puces ou les transcriptions), utilisez plutôt des documents de contenu personnalisé. Voir [Types de documents](#document-types) pour plus de détails.

  Par exemple, si vous voulez que Claude soit capable de citer des phrases spécifiques de vos chunks RAG, vous devriez mettre chaque chunk RAG dans un document de texte brut. Sinon, si vous ne voulez pas qu'un découpage supplémentaire soit effectué, ou si vous voulez personnaliser tout découpage supplémentaire, vous pouvez mettre les chunks RAG dans un ou des documents de contenu personnalisé.
</Tip>

### Contenu citable vs non-citable

- Le texte trouvé dans le contenu `source` d'un document peut être cité.
- `title` et `context` sont des champs optionnels qui seront transmis au modèle mais ne seront pas utilisés pour le contenu cité.
- `title` est limité en longueur, vous pourriez donc trouver le champ `context` utile pour stocker toutes les métadonnées de document sous forme de texte ou de json stringifié.

### Indices de citation
- Les indices de documents sont indexés à partir de 0 à partir de la liste de tous les blocs de contenu de document dans la requête (s'étendant sur tous les messages).
- Les indices de caractères sont indexés à partir de 0 avec des indices de fin exclusifs.
- Les numéros de page sont indexés à partir de 1 avec des numéros de page de fin exclusifs.
- Les indices de blocs de contenu sont indexés à partir de 0 avec des indices de fin exclusifs à partir de la liste `content` fournie dans le document de contenu personnalisé.

### Coûts des jetons
- L'activation des citations entraîne une légère augmentation des jetons d'entrée due aux ajouts d'invites système et au découpage des documents.
- Cependant, la fonctionnalité de citations est très efficace avec les jetons de sortie. Sous le capot, le modèle produit des citations dans un format standardisé qui sont ensuite analysées en texte cité et indices d'emplacement de document. Le champ `cited_text` est fourni pour la commodité et ne compte pas dans les jetons de sortie.
- Lorsqu'il est transmis dans les tours de conversation suivants, `cited_text` n'est également pas compté dans les jetons d'entrée.

### Compatibilité des fonctionnalités
Les citations fonctionnent en conjonction avec d'autres fonctionnalités de l'API, notamment [la mise en cache d'invites](/docs/fr/build-with-claude/prompt-caching), [le comptage de jetons](/docs/fr/build-with-claude/token-counting) et [le traitement par lots](/docs/fr/build-with-claude/batch-processing).

#### Utilisation de la mise en cache d'invites avec les citations

Les citations et la mise en cache d'invites peuvent être utilisées ensemble efficacement.

Les blocs de citation générés dans les réponses ne peuvent pas être mis en cache directement, mais les documents sources qu'ils référencent peuvent être mis en cache. Pour optimiser les performances, appliquez `cache_control` à vos blocs de contenu de document de niveau supérieur.

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# Contenu de document long (par exemple, documentation technique)
long_document = "Ceci est un document très long avec des milliers de mots..." + " ... " * 1000  # Longueur minimale cachable

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "document",
                    "source": {
                        "type": "text",
                        "media_type": "text/plain",
                        "data": long_document
                    },
                    "citations": {"enabled": True},
                    "cache_control": {"type": "ephemeral"}  # Mettre en cache le contenu du document
                },
                {
                    "type": "text",
                    "text": "Que dit ce document sur les fonctionnalités de l'API ?"
                }
            ]
        }
    ]
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

// Contenu de document long (par exemple, documentation technique)
const longDocument = "Ceci est un document très long avec des milliers de mots..." + " ... ".repeat(1000);  // Longueur minimale cachable

const response = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: [
        {
          type: "document",
          source: {
            type: "text",
            media_type: "text/plain",
            data: longDocument
          },
          citations: { enabled: true },
          cache_control: { type: "ephemeral" }  // Mettre en cache le contenu du document
        },
        {
          type: "text",
          text: "Que dit ce document sur les fonctionnalités de l'API ?"
        }
      ]
    }
  ]
});
```

```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "document",
                    "source": {
                        "type": "text",
                        "media_type": "text/plain",
                        "data": "Ceci est un document très long avec des milliers de mots..."
                    },
                    "citations": {"enabled": true},
                    "cache_control": {"type": "ephemeral"}
                },
                {
                    "type": "text",
                    "text": "Que dit ce document sur les fonctionnalités de l'API ?"
                }
            ]
        }
    ]
}'
```
</CodeGroup>

Dans cet exemple :
- Le contenu du document est mis en cache en utilisant `cache_control` sur le bloc de document
- Les citations sont activées sur le document
- Claude peut générer des réponses avec des citations tout en bénéficiant du contenu de document mis en cache
- Les requêtes suivantes utilisant le même document bénéficieront du contenu mis en cache

## Types de documents

### Choisir un type de document

Nous prenons en charge trois types de documents pour les citations. Les documents peuvent être fournis directement dans le message (base64, texte ou URL) ou téléchargés via l'[API Files](/docs/fr/build-with-claude/files) et référencés par `file_id` :

| Type | Idéal pour | Découpage | Format de citation |
| :--- | :--- | :--- | :--- |
| Texte brut | Documents texte simples, prose | Phrase | Indices de caractères (indexés à partir de 0) |
| PDF | Fichiers PDF avec contenu texte | Phrase | Numéros de page (indexés à partir de 1) |
| Contenu personnalisé | Listes, transcriptions, formatage spécial, citations plus granulaires | Aucun découpage supplémentaire | Indices de blocs (indexés à partir de 0) |

<Note>
Les fichiers .csv, .xlsx, .docx, .md et .txt ne sont pas pris en charge comme blocs de document. Convertissez-les en texte brut et incluez-les directement dans le contenu du message. Voir [Travailler avec d'autres formats de fichiers](/docs/fr/build-with-claude/files#working-with-other-file-formats).
</Note>

### Documents de texte brut

Les documents de texte brut sont automatiquement découpés en phrases. Vous pouvez les fournir en ligne ou par référence avec leur `file_id` :

<Tabs>
<Tab title="Texte en ligne">
```python
{
    "type": "document",
    "source": {
        "type": "text",
        "media_type": "text/plain",
        "data": "Contenu de texte brut..."
    },
    "title": "Titre du document", # optionnel
    "context": "Contexte sur le document qui ne sera pas cité", # optionnel
    "citations": {"enabled": True}
}
```
</Tab>
<Tab title="API Files">
```python
{
    "type": "document",
    "source": {
        "type": "file",
        "file_id": "file_011CNvxoj286tYUAZFiZMf1U"
    },
    "title": "Titre du document", # optionnel
    "context": "Contexte sur le document qui ne sera pas cité", # optionnel
    "citations": {"enabled": True}
}
```
</Tab>
</Tabs>

<section title="Exemple de citation de texte brut">

```python
{
    "type": "char_location",
    "cited_text": "Le texte exact étant cité", # ne compte pas dans les jetons de sortie
    "document_index": 0,
    "document_title": "Titre du document",
    "start_char_index": 0,    # indexé à partir de 0
    "end_char_index": 50      # exclusif
}
```

</section>

### Documents PDF

Les documents PDF peuvent être fournis sous forme de données encodées en base64 ou par `file_id`. Le texte PDF est extrait et découpé en phrases. Comme les citations d'images ne sont pas encore prises en charge, les PDFs qui sont des scans de documents et ne contiennent pas de texte extractible ne seront pas citables.

<Tabs>
<Tab title="Base64">
```python
{
    "type": "document",
    "source": {
        "type": "base64",
        "media_type": "application/pdf",
        "data": base64_encoded_pdf_data
    },
    "title": "Titre du document", # optionnel
    "context": "Contexte sur le document qui ne sera pas cité", # optionnel
    "citations": {"enabled": True}
}
```
</Tab>
<Tab title="API Files">
```python
{
    "type": "document",
    "source": {
        "type": "file",
        "file_id": "file_011CNvxoj286tYUAZFiZMf1U"
    },
    "title": "Titre du document", # optionnel
    "context": "Contexte sur le document qui ne sera pas cité", # optionnel
    "citations": {"enabled": True}
}
```
</Tab>
</Tabs>

<section title="Exemple de citation PDF">

```python
{
    "type": "page_location",
    "cited_text": "Le texte exact étant cité", # ne compte pas dans les jetons de sortie
    "document_index": 0,     
    "document_title": "Titre du document", 
    "start_page_number": 1,  # indexé à partir de 1
    "end_page_number": 2     # exclusif
}
```

</section>

### Documents de contenu personnalisé

Les documents de contenu personnalisé vous donnent le contrôle sur la granularité des citations. Aucun découpage supplémentaire n'est effectué et les chunks sont fournis au modèle selon les blocs de contenu fournis.

```python
{
    "type": "document",
    "source": {
        "type": "content",
        "content": [
            {"type": "text", "text": "Premier chunk"},
            {"type": "text", "text": "Deuxième chunk"}
        ]
    },
    "title": "Titre du document", # optionnel
    "context": "Contexte sur le document qui ne sera pas cité", # optionnel
    "citations": {"enabled": True}
}
```

<section title="Exemple de citation">

```python
{
    "type": "content_block_location",
    "cited_text": "Le texte exact étant cité", # ne compte pas dans les jetons de sortie
    "document_index": 0,
    "document_title": "Titre du document",
    "start_block_index": 0,   # indexé à partir de 0
    "end_block_index": 1      # exclusif
}
```

</section>

---

## Structure de réponse

Lorsque les citations sont activées, les réponses incluent plusieurs blocs de texte avec des citations :

```python
{
    "content": [
        {
            "type": "text",
            "text": "Selon le document, "
        },
        {
            "type": "text",
            "text": "l'herbe est verte",
            "citations": [{
                "type": "char_location",
                "cited_text": "L'herbe est verte.",
                "document_index": 0,
                "document_title": "Document d'exemple",
                "start_char_index": 0,
                "end_char_index": 20
            }]
        },
        {
            "type": "text",
            "text": " et "
        },
        {
            "type": "text",
            "text": "le ciel est bleu",
            "citations": [{
                "type": "char_location",
                "cited_text": "Le ciel est bleu.",
                "document_index": 0,
                "document_title": "Document d'exemple",
                "start_char_index": 20,
                "end_char_index": 36
            }]
        },
        {
            "type": "text",
            "text": ". Les informations de la page 5 indiquent que ",
        },
        {
            "type": "text",
            "text": "l'eau est essentielle",
            "citations": [{
                "type": "page_location",
                "cited_text": "L'eau est essentielle à la vie.",
                "document_index": 1,
                "document_title": "Document PDF",
                "start_page_number": 5,
                "end_page_number": 6
            }]
        },
        {
            "type": "text",
            "text": ". Le document personnalisé mentionne ",
        },
        {
            "type": "text",
            "text": "des découvertes importantes",
            "citations": [{
                "type": "content_block_location",
                "cited_text": "Ce sont des découvertes importantes.",
                "document_index": 2,
                "document_title": "Document de contenu personnalisé",
                "start_block_index": 0,
                "end_block_index": 1
            }]
        }
    ]
}
```

### Support de streaming

Pour les réponses en streaming, nous avons ajouté un type `citations_delta` qui contient une seule citation à ajouter à la liste `citations` sur le bloc de contenu `text` actuel.

<section title="Exemple d'événements de streaming">

```python
event: message_start
data: {"type": "message_start", ...}

event: content_block_start
data: {"type": "content_block_start", "index": 0, ...}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, 
       "delta": {"type": "text_delta", "text": "Selon..."}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0,
       "delta": {"type": "citations_delta", 
                 "citation": {
                     "type": "char_location",
                     "cited_text": "...",
                     "document_index": 0,
                     ...
                 }}}

event: content_block_stop
data: {"type": "content_block_stop", "index": 0}

event: message_stop
data: {"type": "message_stop"}
```

</section>