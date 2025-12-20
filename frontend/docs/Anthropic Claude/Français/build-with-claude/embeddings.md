# Embeddings

Les embeddings de texte sont des représentations numériques de texte qui permettent de mesurer la similarité sémantique. Ce guide présente les embeddings, leurs applications, et comment utiliser les modèles d'embedding pour des tâches comme la recherche, les recommandations, et la détection d'anomalies.

---

## Avant d'implémenter les embeddings

Lors de la sélection d'un fournisseur d'embeddings, il y a plusieurs facteurs que vous pouvez considérer selon vos besoins et préférences :

- Taille du jeu de données et spécificité du domaine : taille du jeu de données d'entraînement du modèle et sa pertinence par rapport au domaine que vous voulez intégrer. Des données plus importantes ou plus spécifiques au domaine produisent généralement de meilleurs embeddings dans le domaine
- Performance d'inférence : vitesse de recherche d'embedding et latence de bout en bout. C'est une considération particulièrement importante pour les déploiements de production à grande échelle
- Personnalisation : options pour la formation continue sur des données privées, ou la spécialisation de modèles pour des domaines très spécifiques. Cela peut améliorer les performances sur des vocabulaires uniques

## Comment obtenir des embeddings avec Anthropic

Anthropic n'offre pas son propre modèle d'embedding. Un fournisseur d'embeddings qui a une grande variété d'options et de capacités englobant toutes les considérations ci-dessus est Voyage AI.

Voyage AI fabrique des modèles d'embedding de pointe et offre des modèles personnalisés pour des domaines industriels spécifiques tels que la finance et la santé, ou des modèles sur mesure finement ajustés pour des clients individuels.

Le reste de ce guide concerne Voyage AI, mais nous vous encourageons à évaluer une variété de fournisseurs d'embeddings pour trouver la meilleure solution pour votre cas d'usage spécifique.

## Modèles disponibles

Voyage recommande d'utiliser les modèles d'embedding de texte suivants :

| Modèle | Longueur de contexte | Dimension d'embedding | Description |
| --- | --- | --- | --- |
| `voyage-3-large` | 32,000 | 1024 (par défaut), 256, 512, 2048 | La meilleure qualité de récupération généraliste et multilingue. Voir [article de blog](https://blog.voyageai.com/2025/01/07/voyage-3-large/) pour les détails. |
| `voyage-3.5` | 32,000 | 1024 (par défaut), 256, 512, 2048 | Optimisé pour la qualité de récupération généraliste et multilingue. Voir [article de blog](https://blog.voyageai.com/2025/05/20/voyage-3-5/) pour les détails. |
| `voyage-3.5-lite` | 32,000 | 1024 (par défaut), 256, 512, 2048 | Optimisé pour la latence et le coût. Voir [article de blog](https://blog.voyageai.com/2025/05/20/voyage-3-5/) pour les détails. |
| `voyage-code-3` | 32,000 | 1024 (par défaut), 256, 512, 2048 | Optimisé pour la récupération de **code**. Voir [article de blog](https://blog.voyageai.com/2024/12/04/voyage-code-3/) pour les détails. |
| `voyage-finance-2` | 32,000 | 1024 | Optimisé pour la récupération et RAG en **finance**. Voir [article de blog](https://blog.voyageai.com/2024/06/03/domain-specific-embeddings-finance-edition-voyage-finance-2/) pour les détails. |
| `voyage-law-2` | 16,000 | 1024 | Optimisé pour la récupération et RAG **juridique** et **long contexte**. Également amélioration des performances dans tous les domaines. Voir [article de blog](https://blog.voyageai.com/2024/04/15/domain-specific-embeddings-and-retrieval-legal-edition-voyage-law-2/) pour les détails. |

De plus, les modèles d'embedding multimodaux suivants sont recommandés :

| Modèle | Longueur de contexte | Dimension d'embedding | Description |
| --- | --- | --- | --- |
| `voyage-multimodal-3` | 32000 | 1024 | Modèle d'embedding multimodal riche qui peut vectoriser du texte entrelacé et des images riches en contenu, telles que des captures d'écran de PDF, diapositives, tableaux, figures, et plus. Voir [article de blog](https://blog.voyageai.com/2024/11/12/voyage-multimodal-3/) pour les détails. |

Besoin d'aide pour décider quel modèle d'embedding de texte utiliser ? Consultez la [FAQ](https://docs.voyageai.com/docs/faq#what-embedding-models-are-available-and-which-one-should-i-use&ref=anthropic).

## Commencer avec Voyage AI

Pour accéder aux embeddings Voyage :

1. Inscrivez-vous sur le site web de Voyage AI
2. Obtenez une clé API
3. Définissez la clé API comme variable d'environnement pour plus de commodité :

```bash
export VOYAGE_API_KEY="<votre clé secrète>"
```

Vous pouvez obtenir les embeddings soit en utilisant le package Python officiel [`voyageai`](https://github.com/voyage-ai/voyageai-python) ou les requêtes HTTP, comme décrit ci-dessous.

### Bibliothèque Python Voyage

Le package `voyageai` peut être installé en utilisant la commande suivante :

```bash
pip install -U voyageai
```

Ensuite, vous pouvez créer un objet client et commencer à l'utiliser pour intégrer vos textes :

```python
import voyageai

vo = voyageai.Client()
# Ceci utilisera automatiquement la variable d'environnement VOYAGE_API_KEY.
# Alternativement, vous pouvez utiliser vo = voyageai.Client(api_key="<votre clé secrète>")

texts = ["Texte d'exemple 1", "Texte d'exemple 2"]

result = vo.embed(texts, model="voyage-3.5", input_type="document")
print(result.embeddings[0])
print(result.embeddings[1])
```

`result.embeddings` sera une liste de deux vecteurs d'embedding, chacun contenant 1024 nombres à virgule flottante. Après avoir exécuté le code ci-dessus, les deux embeddings seront affichés à l'écran :

```
[-0.013131560757756233, 0.019828535616397858, ...]   # embedding pour "Texte d'exemple 1"
[-0.0069352793507277966, 0.020878976210951805, ...]  # embedding pour "Texte d'exemple 2"
```

Lors de la création des embeddings, vous pouvez spécifier quelques autres arguments à la fonction `embed()`.

Pour plus d'informations sur le package python Voyage, voir [la documentation Voyage](https://docs.voyageai.com/docs/embeddings#python-api).

### API HTTP Voyage

Vous pouvez également obtenir des embeddings en demandant l'API HTTP Voyage. Par exemple, vous pouvez envoyer une requête HTTP via la commande `curl` dans un terminal :

```bash
curl https://api.voyageai.com/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $VOYAGE_API_KEY" \
  -d '{
    "input": ["Texte d'exemple 1", "Texte d'exemple 2"],
    "model": "voyage-3.5"
  }'
```

La réponse que vous obtiendriez est un objet JSON contenant les embeddings et l'utilisation des tokens :

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

Pour plus d'informations sur l'API HTTP Voyage, voir [la documentation Voyage](https://docs.voyageai.com/reference/embeddings-api).

### AWS Marketplace

Les embeddings Voyage sont disponibles sur [AWS Marketplace](https://aws.amazon.com/marketplace/seller-profile?id=seller-snt4gb6fd7ljg). Les instructions pour accéder à Voyage sur AWS sont disponibles [ici](https://docs.voyageai.com/docs/aws-marketplace-model-package?ref=anthropic).

## Exemple de démarrage rapide

Maintenant que nous savons comment obtenir des embeddings, voyons un bref exemple.

Supposons que nous ayons un petit corpus de six documents à partir desquels récupérer

```python
documents = [
    "Le régime méditerranéen met l'accent sur le poisson, l'huile d'olive et les légumes, censé réduire les maladies chroniques.",
    "La photosynthèse chez les plantes convertit l'énergie lumineuse en glucose et produit de l'oxygène essentiel.",
    "Les innovations du 20e siècle, des radios aux smartphones, se sont centrées sur les avancées électroniques.",
    "Les rivières fournissent de l'eau, l'irrigation et l'habitat pour les espèces aquatiques, vitales pour les écosystèmes.",
    "La conférence téléphonique d'Apple pour discuter des résultats du quatrième trimestre fiscal et des mises à jour commerciales est prévue pour jeudi 2 novembre 2023 à 14h00 PT / 17h00 ET.",
    "Les œuvres de Shakespeare, comme 'Hamlet' et 'Le Songe d'une nuit d'été', perdurent dans la littérature."
]

```

Nous utiliserons d'abord Voyage pour convertir chacun d'eux en un vecteur d'embedding

```python
import voyageai

vo = voyageai.Client()

# Intégrer les documents
doc_embds = vo.embed(
    documents, model="voyage-3.5", input_type="document"
).embeddings
```

Les embeddings nous permettront de faire de la recherche / récupération sémantique dans l'espace vectoriel. Étant donné un exemple de requête,

```python
query = "Quand la conférence téléphonique d'Apple est-elle prévue ?"
```

nous la convertissons en embedding, et effectuons une recherche du plus proche voisin pour trouver le document le plus pertinent basé sur la distance dans l'espace d'embedding.

```python
import numpy as np

# Intégrer la requête
query_embd = vo.embed(
    [query], model="voyage-3.5", input_type="query"
).embeddings[0]

# Calculer la similarité
# Les embeddings Voyage sont normalisés à la longueur 1, donc le produit scalaire
# et la similarité cosinus sont identiques.
similarities = np.dot(doc_embds, query_embd)

retrieved_id = np.argmax(similarities)
print(documents[retrieved_id])
```

Notez que nous utilisons `input_type="document"` et `input_type="query"` pour intégrer le document et la requête, respectivement. Plus de spécifications peuvent être trouvées [ici](/docs/fr/build-with-claude/embeddings#voyage-python-package).

La sortie serait le 5e document, qui est effectivement le plus pertinent pour la requête :

```
La conférence téléphonique d'Apple pour discuter des résultats du quatrième trimestre fiscal et des mises à jour commerciales est prévue pour jeudi 2 novembre 2023 à 14h00 PT / 17h00 ET.
```

Si vous cherchez un ensemble détaillé de livres de recettes sur comment faire du RAG avec des embeddings, incluant les bases de données vectorielles, consultez notre [livre de recettes RAG](https://github.com/anthropics/anthropic-cookbook/blob/main/third_party/Pinecone/rag_using_pinecone.ipynb).

## FAQ

  <section title="Pourquoi les embeddings Voyage ont-ils une qualité supérieure ?">

    Les modèles d'embedding s'appuient sur de puissants réseaux de neurones pour capturer et compresser le contexte sémantique, similaire aux modèles génératifs. L'équipe de chercheurs en IA expérimentés de Voyage optimise chaque composant du processus d'embedding, incluant :
    - Architecture du modèle
    - Collecte de données
    - Fonctions de perte
    - Sélection d'optimiseur

    Apprenez-en plus sur l'approche technique de Voyage sur leur [blog](https://blog.voyageai.com/).
  
</section>

  <section title="Quels modèles d'embedding sont disponibles et lequel devrais-je utiliser ?">

    Pour l'embedding généraliste, nous recommandons :
    - `voyage-3-large` : Meilleure qualité
    - `voyage-3.5-lite` : Latence et coût les plus bas
    - `voyage-3.5` : Performance équilibrée avec qualité de récupération supérieure à un prix compétitif
    
    Pour la récupération, utilisez le paramètre `input_type` pour spécifier si le texte est de type requête ou document.

    Modèles spécifiques au domaine :

    - Tâches juridiques : `voyage-law-2`
    - Code et documentation de programmation : `voyage-code-3`
    - Tâches liées à la finance : `voyage-finance-2`
  
</section>

  <section title="Quelle fonction de similarité devrais-je utiliser ?">

    Vous pouvez utiliser les embeddings Voyage avec soit la similarité par produit scalaire, la similarité cosinus, ou la distance euclidienne. Une explication sur la similarité d'embedding peut être trouvée [ici](https://www.pinecone.io/learn/vector-similarity/).

    Les embeddings Voyage AI sont normalisés à la longueur 1, ce qui signifie que :

    - La similarité cosinus est équivalente à la similarité par produit scalaire, tandis que cette dernière peut être calculée plus rapidement.
    - La similarité cosinus et la distance euclidienne donneront des classements identiques.
  
</section>

  <section title="Quelle est la relation entre caractères, mots et tokens ?">

    Veuillez voir cette [page](https://docs.voyageai.com/docs/tokenization?ref=anthropic).
  
</section>

  <section title="Quand et comment devrais-je utiliser le paramètre input_type ?">

    Pour toutes les tâches de récupération et cas d'usage (par exemple, RAG), nous recommandons que le paramètre `input_type` soit utilisé pour spécifier si le texte d'entrée est une requête ou un document. N'omettez pas `input_type` ou ne définissez pas `input_type=None`. Spécifier si le texte d'entrée est une requête ou un document peut créer de meilleures représentations vectorielles denses pour la récupération, ce qui peut conduire à une meilleure qualité de récupération.

    Lors de l'utilisation du paramètre `input_type`, des invites spéciales sont ajoutées au début du texte d'entrée avant l'embedding. Spécifiquement :

    > 📘 **Invites associées avec `input_type`**
    > 
    > - Pour une requête, l'invite est "Represent the query for retrieving supporting documents: ".
    > - Pour un document, l'invite est "Represent the document for retrieval: ".
    > - Exemple
    >     - Quand `input_type="query"`, une requête comme "Quand la conférence téléphonique d'Apple est-elle prévue ?" deviendra "**Represent the query for retrieving supporting documents:** Quand la conférence téléphonique d'Apple est-elle prévue ?"
    >     - Quand `input_type="document"`, une requête comme "La conférence téléphonique d'Apple pour discuter des résultats du quatrième trimestre fiscal et des mises à jour commerciales est prévue pour jeudi 2 novembre 2023 à 14h00 PT / 17h00 ET." deviendra "**Represent the document for retrieval:** La conférence téléphonique d'Apple pour discuter des résultats du quatrième trimestre fiscal et des mises à jour commerciales est prévue pour jeudi 2 novembre 2023 à 14h00 PT / 17h00 ET."

    `voyage-large-2-instruct`, comme le nom le suggère, est entraîné pour être réactif aux instructions supplémentaires qui sont ajoutées au début du texte d'entrée. Pour la classification, le clustering, ou d'autres sous-tâches [MTEB](https://huggingface.co/mteb), veuillez utiliser les instructions [ici](https://github.com/voyage-ai/voyage-large-2-instruct).
  
</section>

  <section title="Quelles options de quantification sont disponibles ?">

    La quantification dans les embeddings convertit les valeurs haute précision, comme les nombres à virgule flottante simple précision 32 bits, vers des formats de précision inférieure tels que les entiers 8 bits ou les valeurs binaires 1 bit, réduisant le stockage, la mémoire et les coûts de 4x et 32x, respectivement. Les modèles Voyage supportés permettent la quantification en spécifiant le type de données de sortie avec le paramètre `output_dtype` :

    - `float` : Chaque embedding retourné est une liste de nombres à virgule flottante simple précision 32 bits (4 octets). C'est la valeur par défaut et fournit la plus haute précision / précision de récupération.
    - `int8` et `uint8` : Chaque embedding retourné est une liste d'entiers 8 bits (1 octet) allant de -128 à 127 et de 0 à 255, respectivement.
    - `binary` et `ubinary` : Chaque embedding retourné est une liste d'entiers 8 bits qui représentent des valeurs d'embedding quantifiées sur un bit, empaquetées en bits : `int8` pour `binary` et `uint8` pour `ubinary`. La longueur de la liste retournée d'entiers est 1/8 de la dimension réelle de l'embedding. Le type binaire utilise la méthode binaire décalée, sur laquelle vous pouvez en apprendre plus dans la FAQ ci-dessous.

    > **Exemple de quantification binaire**
    > 
    > Considérez les huit valeurs d'embedding suivantes : -0.03955078, 0.006214142, -0.07446289, -0.039001465, 0.0046463013, 0.00030612946, -0.08496094, et 0.03994751. Avec la quantification binaire, les valeurs inférieures ou égales à zéro seront quantifiées à un zéro binaire, et les valeurs positives à un un binaire, résultant en la séquence binaire suivante : 0, 1, 0, 0, 1, 1, 0, 1. Ces huit bits sont ensuite empaquetés en un seul entier 8 bits, 01001101 (avec le bit le plus à gauche comme bit le plus significatif).
    >   - `ubinary` : La séquence binaire est directement convertie et représentée comme l'entier non signé (`uint8`) 77.
    >   - `binary` : La séquence binaire est représentée comme l'entier signé (`int8`) -51, calculé en utilisant la méthode binaire décalée (77 - 128 = -51).
  
</section>

  <section title="Comment puis-je tronquer les embeddings Matryoshka ?">

    L'apprentissage Matryoshka crée des embeddings avec des représentations grossières à fines dans un seul vecteur. Les modèles Voyage, tels que `voyage-code-3`, qui supportent plusieurs dimensions de sortie génèrent de tels embeddings Matryoshka. Vous pouvez tronquer ces vecteurs en gardant le sous-ensemble principal des dimensions. Par exemple, le code Python suivant démontre comment tronquer des vecteurs 1024-dimensionnels à 256 dimensions :

    ```python
    import voyageai
    import numpy as np

    def embd_normalize(v: np.ndarray) -> np.ndarray:
        """
        Normaliser les lignes d'un tableau numpy 2D en vecteurs unitaires en divisant chaque ligne par sa
        norme euclidienne. Lève une ValueError si une ligne a une norme de zéro pour éviter la division par zéro.
        """
        row_norms = np.linalg.norm(v, axis=1, keepdims=True)
        if np.any(row_norms == 0):
            raise ValueError("Cannot normalize rows with a norm of zero.")
        return v / row_norms


    vo = voyageai.Client()

    # Générer des vecteurs voyage-code-3, qui par défaut sont des nombres à virgule flottante 1024-dimensionnels
    embd = vo.embed(['Texte d'exemple 1', 'Texte d'exemple 2'], model='voyage-code-3').embeddings

    # Définir une dimension plus courte
    short_dim = 256

    # Redimensionner et normaliser les vecteurs à une dimension plus courte
    resized_embd = embd_normalize(np.array(embd)[:, :short_dim]).tolist()
    ```
  
</section>

## Tarification

Visitez la [page de tarification](https://docs.voyageai.com/docs/pricing?ref=anthropic) de Voyage pour les détails de tarification les plus à jour.