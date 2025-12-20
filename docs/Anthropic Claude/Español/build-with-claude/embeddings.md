# Embeddings

Los embeddings de texto son representaciones numéricas del texto que permiten medir la similitud semántica. Esta guía introduce los embeddings, sus aplicaciones y cómo usar modelos de embedding para tareas como búsqueda, recomendaciones y detección de anomalías.

---

## Antes de implementar embeddings

Al seleccionar un proveedor de embeddings, hay varios factores que puedes considerar dependiendo de tus necesidades y preferencias:

- Tamaño del conjunto de datos y especificidad del dominio: tamaño del conjunto de datos de entrenamiento del modelo y su relevancia para el dominio que deseas embebir. Los datos más grandes o más específicos del dominio generalmente producen mejores embeddings dentro del dominio
- Rendimiento de inferencia: velocidad de búsqueda de embeddings y latencia de extremo a extremo. Esta es una consideración particularmente importante para implementaciones de producción a gran escala
- Personalización: opciones para entrenamiento continuo en datos privados, o especialización de modelos para dominios muy específicos. Esto puede mejorar el rendimiento en vocabularios únicos

## Cómo obtener embeddings con Anthropic

Anthropic no ofrece su propio modelo de embedding. Un proveedor de embeddings que tiene una amplia variedad de opciones y capacidades que abarcan todas las consideraciones anteriores es Voyage AI.

Voyage AI crea modelos de embedding de vanguardia y ofrece modelos personalizados para dominios industriales específicos como finanzas y atención médica, o modelos ajustados a medida para clientes individuales.

El resto de esta guía es para Voyage AI, pero te animamos a evaluar una variedad de proveedores de embeddings para encontrar el mejor ajuste para tu caso de uso específico.

## Modelos Disponibles

Voyage recomienda usar los siguientes modelos de embedding de texto:

| Modelo | Longitud de Contexto | Dimensión de Embedding | Descripción |
| --- | --- | --- | --- |
| `voyage-3-large` | 32,000 | 1024 (predeterminado), 256, 512, 2048 | La mejor calidad de recuperación general y multilingüe. Ver [publicación del blog](https://blog.voyageai.com/2025/01/07/voyage-3-large/) para detalles. |
| `voyage-3.5` | 32,000 | 1024 (predeterminado), 256, 512, 2048 | Optimizado para calidad de recuperación general y multilingüe. Ver [publicación del blog](https://blog.voyageai.com/2025/05/20/voyage-3-5/) para detalles. |
| `voyage-3.5-lite` | 32,000 | 1024 (predeterminado), 256, 512, 2048 | Optimizado para latencia y costo. Ver [publicación del blog](https://blog.voyageai.com/2025/05/20/voyage-3-5/) para detalles. |
| `voyage-code-3` | 32,000 | 1024 (predeterminado), 256, 512, 2048 | Optimizado para recuperación de **código**. Ver [publicación del blog](https://blog.voyageai.com/2024/12/04/voyage-code-3/) para detalles. |
| `voyage-finance-2` | 32,000 | 1024 | Optimizado para recuperación y RAG de **finanzas**. Ver [publicación del blog](https://blog.voyageai.com/2024/06/03/domain-specific-embeddings-finance-edition-voyage-finance-2/) para detalles. |
| `voyage-law-2` | 16,000 | 1024 | Optimizado para recuperación y RAG **legal** y de **contexto largo**. También mejoró el rendimiento en todos los dominios. Ver [publicación del blog](https://blog.voyageai.com/2024/04/15/domain-specific-embeddings-and-retrieval-legal-edition-voyage-law-2/) para detalles. |

Adicionalmente, se recomiendan los siguientes modelos de embedding multimodal:

| Modelo | Longitud de Contexto | Dimensión de Embedding | Descripción |
| --- | --- | --- | --- |
| `voyage-multimodal-3` | 32000 | 1024 | Modelo de embedding multimodal rico que puede vectorizar texto intercalado e imágenes ricas en contenido, como capturas de pantalla de PDFs, diapositivas, tablas, figuras y más. Ver [publicación del blog](https://blog.voyageai.com/2024/11/12/voyage-multimodal-3/) para detalles. |

¿Necesitas ayuda para decidir qué modelo de embedding de texto usar? Consulta las [FAQ](https://docs.voyageai.com/docs/faq#what-embedding-models-are-available-and-which-one-should-i-use&ref=anthropic).

## Comenzando con Voyage AI

Para acceder a los embeddings de Voyage:

1. Regístrate en el sitio web de Voyage AI
2. Obtén una clave API
3. Establece la clave API como una variable de entorno para conveniencia:

```bash
export VOYAGE_API_KEY="<tu clave secreta>"
```

Puedes obtener los embeddings usando el paquete oficial de Python [`voyageai`](https://github.com/voyage-ai/voyageai-python) o solicitudes HTTP, como se describe a continuación.

### Biblioteca Python de Voyage

El paquete `voyageai` se puede instalar usando el siguiente comando:

```bash
pip install -U voyageai
```

Luego, puedes crear un objeto cliente y comenzar a usarlo para embebir tus textos:

```python
import voyageai

vo = voyageai.Client()
# Esto usará automáticamente la variable de entorno VOYAGE_API_KEY.
# Alternativamente, puedes usar vo = voyageai.Client(api_key="<tu clave secreta>")

texts = ["Texto de muestra 1", "Texto de muestra 2"]

result = vo.embed(texts, model="voyage-3.5", input_type="document")
print(result.embeddings[0])
print(result.embeddings[1])
```

`result.embeddings` será una lista de dos vectores de embedding, cada uno conteniendo 1024 números de punto flotante. Después de ejecutar el código anterior, los dos embeddings se imprimirán en la pantalla:

```
[-0.013131560757756233, 0.019828535616397858, ...]   # embedding para "Texto de muestra 1"
[-0.0069352793507277966, 0.020878976210951805, ...]  # embedding para "Texto de muestra 2"
```

Al crear los embeddings, puedes especificar algunos otros argumentos para la función `embed()`.

Para más información sobre el paquete Python de Voyage, consulta [la documentación de Voyage](https://docs.voyageai.com/docs/embeddings#python-api).

### API HTTP de Voyage

También puedes obtener embeddings solicitando la API HTTP de Voyage. Por ejemplo, puedes enviar una solicitud HTTP a través del comando `curl` en una terminal:

```bash
curl https://api.voyageai.com/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $VOYAGE_API_KEY" \
  -d '{
    "input": ["Texto de muestra 1", "Texto de muestra 2"],
    "model": "voyage-3.5"
  }'
```

La respuesta que obtendrías es un objeto JSON que contiene los embeddings y el uso de tokens:

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

Para más información sobre la API HTTP de Voyage, consulta [la documentación de Voyage](https://docs.voyageai.com/reference/embeddings-api).

### AWS Marketplace

Los embeddings de Voyage están disponibles en [AWS Marketplace](https://aws.amazon.com/marketplace/seller-profile?id=seller-snt4gb6fd7ljg). Las instrucciones para acceder a Voyage en AWS están disponibles [aquí](https://docs.voyageai.com/docs/aws-marketplace-model-package?ref=anthropic).

## Ejemplo de inicio rápido

Ahora que sabemos cómo obtener embeddings, veamos un breve ejemplo.

Supongamos que tenemos un pequeño corpus de seis documentos de los cuales recuperar

```python
documents = [
    "La dieta mediterránea enfatiza el pescado, el aceite de oliva y las verduras, se cree que reduce las enfermedades crónicas.",
    "La fotosíntesis en las plantas convierte la energía lumínica en glucosa y produce oxígeno esencial.",
    "Las innovaciones del siglo XX, desde radios hasta teléfonos inteligentes, se centraron en avances electrónicos.",
    "Los ríos proporcionan agua, irrigación y hábitat para especies acuáticas, vitales para los ecosistemas.",
    "La llamada de conferencia de Apple para discutir los resultados del cuarto trimestre fiscal y actualizaciones comerciales está programada para el jueves 2 de noviembre de 2023 a las 2:00 p.m. PT / 5:00 p.m. ET.",
    "Las obras de Shakespeare, como 'Hamlet' y 'Sueño de una noche de verano,' perduran en la literatura."
]

```

Primero usaremos Voyage para convertir cada uno de ellos en un vector de embedding

```python
import voyageai

vo = voyageai.Client()

# Embebir los documentos
doc_embds = vo.embed(
    documents, model="voyage-3.5", input_type="document"
).embeddings
```

Los embeddings nos permitirán hacer búsqueda semántica / recuperación en el espacio vectorial. Dada una consulta de ejemplo,

```python
query = "¿Cuándo está programada la llamada de conferencia de Apple?"
```

la convertimos en un embedding, y realizamos una búsqueda de vecino más cercano para encontrar el documento más relevante basado en la distancia en el espacio de embedding.

```python
import numpy as np

# Embebir la consulta
query_embd = vo.embed(
    [query], model="voyage-3.5", input_type="query"
).embeddings[0]

# Calcular la similitud
# Los embeddings de Voyage están normalizados a longitud 1, por lo tanto el producto punto
# y la similitud coseno son lo mismo.
similarities = np.dot(doc_embds, query_embd)

retrieved_id = np.argmax(similarities)
print(documents[retrieved_id])
```

Nota que usamos `input_type="document"` e `input_type="query"` para embebir el documento y la consulta, respectivamente. Más especificación se puede encontrar [aquí](/docs/es/build-with-claude/embeddings#voyage-python-package).

La salida sería el 5º documento, que es efectivamente el más relevante para la consulta:

```
La llamada de conferencia de Apple para discutir los resultados del cuarto trimestre fiscal y actualizaciones comerciales está programada para el jueves 2 de noviembre de 2023 a las 2:00 p.m. PT / 5:00 p.m. ET.
```

Si estás buscando un conjunto detallado de libros de cocina sobre cómo hacer RAG con embeddings, incluyendo bases de datos vectoriales, consulta nuestro [libro de cocina RAG](https://github.com/anthropics/anthropic-cookbook/blob/main/third_party/Pinecone/rag_using_pinecone.ipynb).

## FAQ

  <section title="¿Por qué los embeddings de Voyage tienen calidad superior?">

    Los modelos de embedding dependen de redes neuronales poderosas para capturar y comprimir el contexto semántico, similar a los modelos generativos. El equipo de investigadores de IA experimentados de Voyage optimiza cada componente del proceso de embedding, incluyendo:
    - Arquitectura del modelo
    - Recolección de datos
    - Funciones de pérdida
    - Selección de optimizador

    Aprende más sobre el enfoque técnico de Voyage en su [blog](https://blog.voyageai.com/).
  
</section>

  <section title="¿Qué modelos de embedding están disponibles y cuál debería usar?">

    Para embedding de propósito general, recomendamos:
    - `voyage-3-large`: Mejor calidad
    - `voyage-3.5-lite`: Menor latencia y costo
    - `voyage-3.5`: Rendimiento equilibrado con calidad de recuperación superior a un punto de precio competitivo
    
    Para recuperación, usa el parámetro `input_type` para especificar si el texto es de tipo consulta o documento.

    Modelos específicos de dominio:

    - Tareas legales: `voyage-law-2`
    - Código y documentación de programación: `voyage-code-3`
    - Tareas relacionadas con finanzas: `voyage-finance-2`
  
</section>

  <section title="¿Qué función de similitud debería usar?">

    Puedes usar embeddings de Voyage con similitud de producto punto, similitud coseno o distancia euclidiana. Una explicación sobre similitud de embedding se puede encontrar [aquí](https://www.pinecone.io/learn/vector-similarity/).

    Los embeddings de Voyage AI están normalizados a longitud 1, lo que significa que:

    - La similitud coseno es equivalente a la similitud de producto punto, mientras que la última se puede calcular más rápidamente.
    - La similitud coseno y la distancia euclidiana resultarán en clasificaciones idénticas.
  
</section>

  <section title="¿Cuál es la relación entre caracteres, palabras y tokens?">

    Por favor consulta esta [página](https://docs.voyageai.com/docs/tokenization?ref=anthropic).
  
</section>

  <section title="¿Cuándo y cómo debería usar el parámetro input_type?">

    Para todas las tareas de recuperación y casos de uso (ej., RAG), recomendamos que el parámetro `input_type` se use para especificar si el texto de entrada es una consulta o documento. No omitas `input_type` o establezcas `input_type=None`. Especificar si el texto de entrada es una consulta o documento puede crear mejores representaciones vectoriales densas para recuperación, lo que puede llevar a mejor calidad de recuperación.

    Al usar el parámetro `input_type`, se anteponen prompts especiales al texto de entrada antes del embedding. Específicamente:

    > 📘 **Prompts asociados con `input_type`**
    > 
    > - Para una consulta, el prompt es "Representa la consulta para recuperar documentos de apoyo: ".
    > - Para un documento, el prompt es "Representa el documento para recuperación: ".
    > - Ejemplo
    >     - Cuando `input_type="query"`, una consulta como "¿Cuándo está programada la llamada de conferencia de Apple?" se convertirá en "**Representa la consulta para recuperar documentos de apoyo:** ¿Cuándo está programada la llamada de conferencia de Apple?"
    >     - Cuando `input_type="document"`, una consulta como "La llamada de conferencia de Apple para discutir los resultados del cuarto trimestre fiscal y actualizaciones comerciales está programada para el jueves 2 de noviembre de 2023 a las 2:00 p.m. PT / 5:00 p.m. ET." se convertirá en "**Representa el documento para recuperación:** La llamada de conferencia de Apple para discutir los resultados del cuarto trimestre fiscal y actualizaciones comerciales está programada para el jueves 2 de noviembre de 2023 a las 2:00 p.m. PT / 5:00 p.m. ET."

    `voyage-large-2-instruct`, como sugiere el nombre, está entrenado para ser responsivo a instrucciones adicionales que se anteponen al texto de entrada. Para clasificación, agrupamiento u otras subtareas de [MTEB](https://huggingface.co/mteb), por favor usa las instrucciones [aquí](https://github.com/voyage-ai/voyage-large-2-instruct).
  
</section>

  <section title="¿Qué opciones de cuantización están disponibles?">

    La cuantización en embeddings convierte valores de alta precisión, como números de punto flotante de precisión simple de 32 bits, a formatos de menor precisión como enteros de 8 bits o valores binarios de 1 bit, reduciendo el almacenamiento, memoria y costos en 4x y 32x, respectivamente. Los modelos de Voyage compatibles habilitan la cuantización especificando el tipo de datos de salida con el parámetro `output_dtype`:

    - `float`: Cada embedding devuelto es una lista de números de punto flotante de precisión simple de 32 bits (4 bytes). Este es el predeterminado y proporciona la mayor precisión / exactitud de recuperación.
    - `int8` y `uint8`: Cada embedding devuelto es una lista de enteros de 8 bits (1 byte) que van de -128 a 127 y de 0 a 255, respectivamente.
    - `binary` y `ubinary`: Cada embedding devuelto es una lista de enteros de 8 bits que representan valores de embedding cuantizados de un solo bit empaquetados en bits: `int8` para `binary` y `uint8` para `ubinary`. La longitud de la lista devuelta de enteros es 1/8 de la dimensión real del embedding. El tipo binario usa el método binario de desplazamiento, sobre el cual puedes aprender más en las FAQ a continuación.

    > **Ejemplo de cuantización binaria**
    > 
    > Considera los siguientes ocho valores de embedding: -0.03955078, 0.006214142, -0.07446289, -0.039001465, 0.0046463013, 0.00030612946, -0.08496094, y 0.03994751. Con cuantización binaria, los valores menores o iguales a cero serán cuantizados a un cero binario, y los valores positivos a un uno binario, resultando en la siguiente secuencia binaria: 0, 1, 0, 0, 1, 1, 0, 1. Estos ocho bits se empaquetan luego en un solo entero de 8 bits, 01001101 (con el bit más a la izquierda como el bit más significativo).
    >   - `ubinary`: La secuencia binaria se convierte directamente y se representa como el entero sin signo (`uint8`) 77.
    >   - `binary`: La secuencia binaria se representa como el entero con signo (`int8`) -51, calculado usando el método binario de desplazamiento (77 - 128 = -51).
  
</section>

  <section title="¿Cómo puedo truncar embeddings Matryoshka?">

    El aprendizaje Matryoshka crea embeddings con representaciones de grueso a fino dentro de un solo vector. Los modelos de Voyage, como `voyage-code-3`, que soportan múltiples dimensiones de salida generan tales embeddings Matryoshka. Puedes truncar estos vectores manteniendo el subconjunto principal de dimensiones. Por ejemplo, el siguiente código Python demuestra cómo truncar vectores de 1024 dimensiones a 256 dimensiones:

    ```python
    import voyageai
    import numpy as np

    def embd_normalize(v: np.ndarray) -> np.ndarray:
        """
        Normaliza las filas de un array numpy 2D a vectores unitarios dividiendo cada fila por su
        norma euclidiana. Lanza un ValueError si alguna fila tiene una norma de cero para prevenir división por cero.
        """
        row_norms = np.linalg.norm(v, axis=1, keepdims=True)
        if np.any(row_norms == 0):
            raise ValueError("No se pueden normalizar filas con una norma de cero.")
        return v / row_norms


    vo = voyageai.Client()

    # Generar vectores voyage-code-3, que por defecto son números de punto flotante de 1024 dimensiones
    embd = vo.embed(['Texto de muestra 1', 'Texto de muestra 2'], model='voyage-code-3').embeddings

    # Establecer dimensión más corta
    short_dim = 256

    # Redimensionar y normalizar vectores a dimensión más corta
    resized_embd = embd_normalize(np.array(embd)[:, :short_dim]).tolist()
    ```
  
</section>

## Precios

Visita la [página de precios](https://docs.voyageai.com/docs/pricing?ref=anthropic) de Voyage para los detalles de precios más actualizados.