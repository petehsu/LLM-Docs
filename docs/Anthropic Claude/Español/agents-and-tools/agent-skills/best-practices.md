# Mejores prácticas para la creación de Skills

Aprende cómo escribir Skills efectivos que Claude pueda descubrir y utilizar exitosamente.

---

Los buenos Skills son concisos, bien estructurados y probados con uso real. Esta guía proporciona decisiones prácticas de autoría para ayudarte a escribir Skills que Claude pueda descubrir y utilizar efectivamente.

Para obtener información conceptual sobre cómo funcionan los Skills, consulta la [descripción general de Skills](/docs/es/agents-and-tools/agent-skills/overview).

## Principios fundamentales

### La concisión es clave

La [ventana de contexto](/docs/es/build-with-claude/context-windows) es un bien público. Tu Skill comparte la ventana de contexto con todo lo demás que Claude necesita saber, incluyendo:
- El prompt del sistema
- Historial de conversación
- Metadatos de otros Skills
- Tu solicitud real

No todos los tokens en tu Skill tienen un costo inmediato. Al inicio, solo los metadatos (nombre y descripción) de todos los Skills se precargan. Claude lee SKILL.md solo cuando el Skill se vuelve relevante, y lee archivos adicionales solo según sea necesario. Sin embargo, ser conciso en SKILL.md sigue siendo importante: una vez que Claude lo carga, cada token compite con el historial de conversación y otro contexto.

**Suposición predeterminada**: Claude ya es muy inteligente

Solo agrega contexto que Claude no tenga. Cuestiona cada pieza de información:
- "¿Claude realmente necesita esta explicación?"
- "¿Puedo asumir que Claude sabe esto?"
- "¿Este párrafo justifica su costo en tokens?"

**Buen ejemplo: Conciso** (aproximadamente 50 tokens):
````markdown
## Extraer texto de PDF

Usa pdfplumber para extracción de texto:

```python
import pdfplumber

with pdfplumber.open("file.pdf") as pdf:
    text = pdf.pages[0].extract_text()
```
````

**Mal ejemplo: Demasiado verboso** (aproximadamente 150 tokens):
```markdown
## Extraer texto de PDF

PDF (Formato de Documento Portátil) son archivos en un formato común que contiene
texto, imágenes y otro contenido. Para extraer texto de un PDF, necesitarás
usar una biblioteca. Hay muchas bibliotecas disponibles para procesamiento de PDF, pero
recomendamos pdfplumber porque es fácil de usar y maneja la mayoría de casos bien.
Primero, necesitarás instalarla usando pip. Luego puedes usar el código a continuación...
```

La versión concisa asume que Claude sabe qué son los PDFs y cómo funcionan las bibliotecas.

### Establece grados de libertad apropiados

Haz coincidir el nivel de especificidad con la fragilidad y variabilidad de la tarea.

**Alta libertad** (instrucciones basadas en texto):

Úsalo cuando:
- Múltiples enfoques son válidos
- Las decisiones dependen del contexto
- Las heurísticas guían el enfoque

Ejemplo:
```markdown
## Proceso de revisión de código

1. Analiza la estructura y organización del código
2. Verifica posibles errores o casos extremos
3. Sugiere mejoras para legibilidad y mantenibilidad
4. Verifica la adherencia a las convenciones del proyecto
```

**Libertad media** (pseudocódigo o scripts con parámetros):

Úsalo cuando:
- Existe un patrón preferido
- Alguna variación es aceptable
- La configuración afecta el comportamiento

Ejemplo:
````markdown
## Generar informe

Usa esta plantilla y personaliza según sea necesario:

```python
def generate_report(data, format="markdown", include_charts=True):
    # Procesar datos
    # Generar salida en formato especificado
    # Opcionalmente incluir visualizaciones
```
````

**Baja libertad** (scripts específicos, pocos o ningún parámetro):

Úsalo cuando:
- Las operaciones son frágiles y propensas a errores
- La consistencia es crítica
- Se debe seguir una secuencia específica

Ejemplo:
````markdown
## Migración de base de datos

Ejecuta exactamente este script:

```bash
python scripts/migrate.py --verify --backup
```

No modifiques el comando ni agregues banderas adicionales.
````

**Analogía**: Piensa en Claude como un robot explorando un camino:
- **Puente estrecho con acantilados a ambos lados**: Solo hay una forma segura de avanzar. Proporciona barandillas específicas e instrucciones exactas (baja libertad). Ejemplo: migraciones de base de datos que deben ejecutarse en secuencia exacta.
- **Campo abierto sin peligros**: Muchos caminos llevan al éxito. Da dirección general y confía en que Claude encontrará la mejor ruta (alta libertad). Ejemplo: revisiones de código donde el contexto determina el mejor enfoque.

### Prueba con todos los modelos que planeas usar

Los Skills actúan como adiciones a los modelos, por lo que la efectividad depende del modelo subyacente. Prueba tu Skill con todos los modelos que planeas usar.

**Consideraciones de prueba por modelo**:
- **Claude Haiku** (rápido, económico): ¿El Skill proporciona suficiente orientación?
- **Claude Sonnet** (equilibrado): ¿El Skill es claro y eficiente?
- **Claude Opus** (razonamiento poderoso): ¿El Skill evita sobre-explicar?

Lo que funciona perfectamente para Opus podría necesitar más detalle para Haiku. Si planeas usar tu Skill en múltiples modelos, apunta a instrucciones que funcionen bien con todos ellos.

## Estructura del Skill

<Note>
**Frontmatter YAML**: El frontmatter de SKILL.md requiere dos campos:

`name`:
- Máximo 64 caracteres
- Debe contener solo letras minúsculas, números y guiones
- No puede contener etiquetas XML
- No puede contener palabras reservadas: "anthropic", "claude"

`description`:
- Debe ser no vacío
- Máximo 1024 caracteres
- No puede contener etiquetas XML
- Debe describir qué hace el Skill y cuándo usarlo

Para detalles completos de la estructura del Skill, consulta la [descripción general de Skills](/docs/es/agents-and-tools/agent-skills/overview#skill-structure).
</Note>

### Convenciones de nomenclatura

Usa patrones de nomenclatura consistentes para que los Skills sean más fáciles de referenciar y discutir. Recomendamos usar **forma de gerundio** (verbo + -ing) para nombres de Skills, ya que esto describe claramente la actividad o capacidad que proporciona el Skill.

Recuerda que el campo `name` debe usar solo letras minúsculas, números y guiones.

**Buenos ejemplos de nomenclatura (forma de gerundio)**:
- `processing-pdfs`
- `analyzing-spreadsheets`
- `managing-databases`
- `testing-code`
- `writing-documentation`

**Alternativas aceptables**:
- Frases nominales: `pdf-processing`, `spreadsheet-analysis`
- Orientado a acciones: `process-pdfs`, `analyze-spreadsheets`

**Evita**:
- Nombres vagos: `helper`, `utils`, `tools`
- Demasiado genéricos: `documents`, `data`, `files`
- Palabras reservadas: `anthropic-helper`, `claude-tools`
- Patrones inconsistentes dentro de tu colección de skills

La nomenclatura consistente facilita:
- Referenciar Skills en documentación y conversaciones
- Entender qué hace un Skill de un vistazo
- Organizar y buscar a través de múltiples Skills
- Mantener una biblioteca de skills profesional y cohesiva

### Escribir descripciones efectivas

El campo `description` permite el descubrimiento de Skills e incluye tanto qué hace el Skill como cuándo usarlo.

<Warning>
**Siempre escribe en tercera persona**. La descripción se inyecta en el prompt del sistema, y el punto de vista inconsistente puede causar problemas de descubrimiento.

- **Bueno:** "Procesa archivos de Excel y genera informes"
- **Evita:** "Puedo ayudarte a procesar archivos de Excel"
- **Evita:** "Puedes usar esto para procesar archivos de Excel"
</Warning>

**Sé específico e incluye términos clave**. Incluye tanto qué hace el Skill como desencadenantes/contextos específicos para cuándo usarlo.

Cada Skill tiene exactamente un campo de descripción. La descripción es crítica para la selección de skills: Claude la usa para elegir el Skill correcto de potencialmente 100+ Skills disponibles. Tu descripción debe proporcionar suficiente detalle para que Claude sepa cuándo seleccionar este Skill, mientras que el resto de SKILL.md proporciona los detalles de implementación.

Ejemplos efectivos:

**Skill de procesamiento de PDF:**
```yaml
description: Extrae texto y tablas de archivos PDF, completa formularios, fusiona documentos. Úsalo cuando trabajes con archivos PDF o cuando el usuario mencione PDFs, formularios o extracción de documentos.
```

**Skill de análisis de Excel:**
```yaml
description: Analiza hojas de cálculo de Excel, crea tablas dinámicas, genera gráficos. Úsalo cuando analices archivos de Excel, hojas de cálculo, datos tabulares o archivos .xlsx.
```

**Skill de ayudante de commit de Git:**
```yaml
description: Genera mensajes de commit descriptivos analizando diffs de git. Úsalo cuando el usuario pida ayuda escribiendo mensajes de commit o revisando cambios preparados.
```

Evita descripciones vagas como estas:

```yaml
description: Ayuda con documentos
```
```yaml
description: Procesa datos
```
```yaml
description: Hace cosas con archivos
```

### Patrones de divulgación progresiva

SKILL.md sirve como una descripción general que apunta a Claude a materiales detallados según sea necesario, como una tabla de contenidos en una guía de incorporación. Para una explicación de cómo funciona la divulgación progresiva, consulta [Cómo funcionan los Skills](/docs/es/agents-and-tools/agent-skills/overview#how-skills-work) en la descripción general.

**Orientación práctica:**
- Mantén el cuerpo de SKILL.md bajo 500 líneas para un rendimiento óptimo
- Divide el contenido en archivos separados cuando te acerques a este límite
- Usa los patrones a continuación para organizar instrucciones, código y recursos de manera efectiva

#### Descripción visual: De simple a complejo

Un Skill básico comienza con solo un archivo SKILL.md que contiene metadatos e instrucciones:

![Archivo SKILL.md simple mostrando frontmatter YAML y cuerpo markdown](/docs/images/agent-skills-simple-file.png)

A medida que tu Skill crece, puedes agrupar contenido adicional que Claude carga solo cuando sea necesario:

![Agrupación de archivos de referencia adicionales como reference.md y forms.md.](/docs/images/agent-skills-bundling-content.png)

La estructura completa del directorio de Skill podría verse así:

```
pdf/
├── SKILL.md              # Instrucciones principales (cargadas cuando se activan)
├── FORMS.md              # Guía de llenado de formularios (cargada según sea necesario)
├── reference.md          # Referencia de API (cargada según sea necesario)
├── examples.md           # Ejemplos de uso (cargados según sea necesario)
└── scripts/
    ├── analyze_form.py   # Script de utilidad (ejecutado, no cargado)
    ├── fill_form.py      # Script de llenado de formularios
    └── validate.py       # Script de validación
```

#### Patrón 1: Guía de alto nivel con referencias

````markdown
---
name: pdf-processing
description: Extrae texto y tablas de archivos PDF, completa formularios y fusiona documentos. Úsalo cuando trabajes con archivos PDF o cuando el usuario mencione PDFs, formularios o extracción de documentos.
---

# Procesamiento de PDF

## Inicio rápido

Extrae texto con pdfplumber:
```python
import pdfplumber
with pdfplumber.open("file.pdf") as pdf:
    text = pdf.pages[0].extract_text()
```

## Características avanzadas

**Llenado de formularios**: Consulta [FORMS.md](FORMS.md) para la guía completa
**Referencia de API**: Consulta [REFERENCE.md](REFERENCE.md) para todos los métodos
**Ejemplos**: Consulta [EXAMPLES.md](EXAMPLES.md) para patrones comunes
````

Claude carga FORMS.md, REFERENCE.md o EXAMPLES.md solo cuando sea necesario.

#### Patrón 2: Organización específica del dominio

Para Skills con múltiples dominios, organiza el contenido por dominio para evitar cargar contexto irrelevante. Cuando un usuario pregunta sobre métricas de ventas, Claude solo necesita leer esquemas relacionados con ventas, no datos de finanzas o marketing. Esto mantiene el uso de tokens bajo y el contexto enfocado.

```
bigquery-skill/
├── SKILL.md (descripción general y navegación)
└── reference/
    ├── finance.md (ingresos, métricas de facturación)
    ├── sales.md (oportunidades, pipeline)
    ├── product.md (uso de API, características)
    └── marketing.md (campañas, atribución)
```

````markdown SKILL.md
# Análisis de datos de BigQuery

## Conjuntos de datos disponibles

**Finanzas**: Ingresos, ARR, facturación → Consulta [reference/finance.md](reference/finance.md)
**Ventas**: Oportunidades, pipeline, cuentas → Consulta [reference/sales.md](reference/sales.md)
**Producto**: Uso de API, características, adopción → Consulta [reference/product.md](reference/product.md)
**Marketing**: Campañas, atribución, correo electrónico → Consulta [reference/marketing.md](reference/marketing.md)

## Búsqueda rápida

Encuentra métricas específicas usando grep:

```bash
grep -i "revenue" reference/finance.md
grep -i "pipeline" reference/sales.md
grep -i "api usage" reference/product.md
```
````

#### Patrón 3: Detalles condicionales

Muestra contenido básico, vincula a contenido avanzado:

```markdown
# Procesamiento de DOCX

## Crear documentos

Usa docx-js para nuevos documentos. Consulta [DOCX-JS.md](DOCX-JS.md).

## Editar documentos

Para ediciones simples, modifica el XML directamente.

**Para cambios rastreados**: Consulta [REDLINING.md](REDLINING.md)
**Para detalles de OOXML**: Consulta [OOXML.md](OOXML.md)
```

Claude lee REDLINING.md u OOXML.md solo cuando el usuario necesita esas características.

### Evita referencias profundamente anidadas

Claude puede leer parcialmente archivos cuando se hace referencia a ellos desde otros archivos referenciados. Al encontrar referencias anidadas, Claude podría usar comandos como `head -100` para obtener una vista previa del contenido en lugar de leer archivos completos, resultando en información incompleta.

**Mantén referencias un nivel de profundidad desde SKILL.md**. Todos los archivos de referencia deben vincularse directamente desde SKILL.md para asegurar que Claude lea archivos completos cuando sea necesario.

**Mal ejemplo: Demasiado profundo**:
```markdown
# SKILL.md
Consulta [advanced.md](advanced.md)...

# advanced.md
Consulta [details.md](details.md)...

# details.md
Aquí está la información real...
```

**Buen ejemplo: Un nivel de profundidad**:
```markdown
# SKILL.md

**Uso básico**: [instrucciones en SKILL.md]
**Características avanzadas**: Consulta [advanced.md](advanced.md)
**Referencia de API**: Consulta [reference.md](reference.md)
**Ejemplos**: Consulta [examples.md](examples.md)
```

### Estructura archivos de referencia más largos con tabla de contenidos

Para archivos de referencia más largos que 100 líneas, incluye una tabla de contenidos en la parte superior. Esto asegura que Claude pueda ver el alcance completo de la información disponible incluso cuando obtiene una vista previa con lecturas parciales.

**Ejemplo**:
```markdown
# Referencia de API

## Contenidos
- Autenticación y configuración
- Métodos principales (crear, leer, actualizar, eliminar)
- Características avanzadas (operaciones por lotes, webhooks)
- Patrones de manejo de errores
- Ejemplos de código

## Autenticación y configuración
...

## Métodos principales
...
```

Claude puede entonces leer el archivo completo o saltar a secciones específicas según sea necesario.

Para detalles sobre cómo esta arquitectura basada en el sistema de archivos habilita la divulgación progresiva, consulta la sección [Entorno de ejecución](#runtime-environment) en la sección Avanzado a continuación.

## Flujos de trabajo y bucles de retroalimentación

### Usa flujos de trabajo para tareas complejas

Divide operaciones complejas en pasos claros y secuenciales. Para flujos de trabajo particularmente complejos, proporciona una lista de verificación que Claude pueda copiar en su respuesta y marcar a medida que avanza.

**Ejemplo 1: Flujo de trabajo de síntesis de investigación** (para Skills sin código):

````markdown
## Flujo de trabajo de síntesis de investigación

Copia esta lista de verificación y rastrea tu progreso:

```
Progreso de investigación:
- [ ] Paso 1: Leer todos los documentos fuente
- [ ] Paso 2: Identificar temas clave
- [ ] Paso 3: Hacer referencias cruzadas de afirmaciones
- [ ] Paso 4: Crear resumen estructurado
- [ ] Paso 5: Verificar citas
```

**Paso 1: Leer todos los documentos fuente**

Revisa cada documento en el directorio `sources/`. Anota los argumentos principales y la evidencia de apoyo.

**Paso 2: Identificar temas clave**

Busca patrones en todas las fuentes. ¿Qué temas aparecen repetidamente? ¿Dónde están de acuerdo o en desacuerdo las fuentes?

**Paso 3: Hacer referencias cruzadas de afirmaciones**

Para cada afirmación importante, verifica que aparezca en el material fuente. Anota qué fuente apoya cada punto.

**Paso 4: Crear resumen estructurado**

Organiza los hallazgos por tema. Incluye:
- Afirmación principal
- Evidencia de apoyo de fuentes
- Puntos de vista conflictivos (si los hay)

**Paso 5: Verificar citas**

Verifica que cada afirmación haga referencia al documento fuente correcto. Si las citas están incompletas, vuelve al Paso 3.
````

Este ejemplo muestra cómo los flujos de trabajo se aplican a tareas de análisis que no requieren código. El patrón de lista de verificación funciona para cualquier proceso complejo de múltiples pasos.

**Ejemplo 2: Flujo de trabajo de llenado de formularios PDF** (para Skills con código):

````markdown
## Flujo de trabajo de llenado de formularios PDF

Copia esta lista de verificación y marca elementos a medida que los completes:

```
Progreso de tarea:
- [ ] Paso 1: Analizar el formulario (ejecutar analyze_form.py)
- [ ] Paso 2: Crear mapeo de campos (editar fields.json)
- [ ] Paso 3: Validar mapeo (ejecutar validate_fields.py)
- [ ] Paso 4: Llenar el formulario (ejecutar fill_form.py)
- [ ] Paso 5: Verificar salida (ejecutar verify_output.py)
```

**Paso 1: Analizar el formulario**

Ejecuta: `python scripts/analyze_form.py input.pdf`

Esto extrae campos de formulario y sus ubicaciones, guardando en `fields.json`.

**Paso 2: Crear mapeo de campos**

Edita `fields.json` para agregar valores para cada campo.

**Paso 3: Validar mapeo**

Ejecuta: `python scripts/validate_fields.py fields.json`

Corrige cualquier error de validación antes de continuar.

**Paso 4: Llenar el formulario**

Ejecuta: `python scripts/fill_form.py input.pdf fields.json output.pdf`

**Paso 5: Verificar salida**

Ejecuta: `python scripts/verify_output.py output.pdf`

Si la verificación falla, vuelve al Paso 2.
````

Los pasos claros evitan que Claude omita validación crítica. La lista de verificación ayuda tanto a Claude como a ti a rastrear el progreso a través de flujos de trabajo de múltiples pasos.

### Implementa bucles de retroalimentación

**Patrón común**: Ejecutar validador → corregir errores → repetir

Este patrón mejora enormemente la calidad de salida.

**Ejemplo 1: Cumplimiento de guía de estilo** (para Skills sin código):

```markdown
## Proceso de revisión de contenido

1. Redacta tu contenido siguiendo las directrices en STYLE_GUIDE.md
2. Revisa contra la lista de verificación:
   - Verifica consistencia de terminología
   - Verifica que los ejemplos sigan el formato estándar
   - Confirma que todas las secciones requeridas estén presentes
3. Si se encuentran problemas:
   - Anota cada problema con referencia de sección específica
   - Revisa el contenido
   - Revisa la lista de verificación nuevamente
4. Solo procede cuando se cumplan todos los requisitos
5. Finaliza y guarda el documento
```

Esto muestra el patrón de bucle de validación usando documentos de referencia en lugar de scripts. El "validador" es STYLE_GUIDE.md, y Claude realiza la verificación leyendo y comparando.

**Ejemplo 2: Proceso de edición de documentos** (para Skills con código):

```markdown
## Proceso de edición de documentos

1. Realiza tus ediciones en `word/document.xml`
2. **Valida inmediatamente**: `python ooxml/scripts/validate.py unpacked_dir/`
3. Si la validación falla:
   - Revisa el mensaje de error cuidadosamente
   - Corrige los problemas en el XML
   - Ejecuta la validación nuevamente
4. **Solo procede cuando la validación pase**
5. Reconstruye: `python ooxml/scripts/pack.py unpacked_dir/ output.docx`
6. Prueba el documento de salida
```

El bucle de validación detecta errores temprano.

## Directrices de contenido

### Evita información sensible al tiempo

No incluyas información que se volverá obsoleta:

**Mal ejemplo: Sensible al tiempo** (se volverá incorrecto):
```markdown
Si estás haciendo esto antes de agosto de 2025, usa la API antigua.
Después de agosto de 2025, usa la nueva API.
```

**Buen ejemplo** (usa sección "patrones antiguos"):
```markdown
## Método actual

Usa el endpoint de API v2: `api.example.com/v2/messages`

## Patrones antiguos

<details>
<summary>API v1 heredada (deprecada 2025-08)</summary>

La API v1 usaba: `api.example.com/v1/messages`

Este endpoint ya no es compatible.
</details>
```

La sección de patrones antiguos proporciona contexto histórico sin saturar el contenido principal.

### Usa terminología consistente

Elige un término y úsalo en todo el Skill:

**Bueno - Consistente**:
- Siempre "endpoint de API"
- Siempre "campo"
- Siempre "extraer"

**Malo - Inconsistente**:
- Mezcla "endpoint de API", "URL", "ruta de API", "ruta"
- Mezcla "campo", "caja", "elemento", "control"
- Mezcla "extraer", "tirar", "obtener", "recuperar"

La consistencia ayuda a Claude a entender y seguir instrucciones.

## Patrones comunes

### Patrón de plantilla

Proporciona plantillas para formato de salida. Haz coincidir el nivel de rigidez con tus necesidades.

**Para requisitos estrictos** (como respuestas de API o formatos de datos):

````markdown
## Estructura del informe

SIEMPRE usa esta estructura de plantilla exacta:

```markdown
# [Título del análisis]

## Resumen ejecutivo
[Descripción general de un párrafo de hallazgos clave]

## Hallazgos clave
- Hallazgo 1 con datos de apoyo
- Hallazgo 2 con datos de apoyo
- Hallazgo 3 con datos de apoyo

## Recomendaciones
1. Recomendación accionable específica
2. Recomendación accionable específica
```
````

**Para orientación flexible** (cuando la adaptación es útil):

````markdown
## Estructura del informe

Aquí hay un formato predeterminado sensato, pero usa tu mejor criterio basado en el análisis:

```markdown
# [Título del análisis]

## Resumen ejecutivo
[Descripción general]

## Hallazgos clave
[Adapta secciones basadas en lo que descubras]

## Recomendaciones
[Personaliza al contexto específico]
```

Ajusta secciones según sea necesario para el tipo de análisis específico.
````

### Patrón de ejemplos

Para Skills donde la calidad de salida depende de ver ejemplos, proporciona pares entrada/salida tal como lo harías en prompting regular:

````markdown
## Formato de mensaje de commit

Genera mensajes de commit siguiendo estos ejemplos:

**Ejemplo 1:**
Entrada: Agregó autenticación de usuario con tokens JWT
Salida:
```
feat(auth): implementar autenticación basada en JWT

Agregar endpoint de inicio de sesión y middleware de validación de token
```

**Ejemplo 2:**
Entrada: Corregido error donde las fechas se mostraban incorrectamente en informes
Salida:
```
fix(reports): corregir formato de fecha en conversión de zona horaria

Usar timestamps UTC consistentemente en toda la generación de informes
```

**Ejemplo 3:**
Entrada: Dependencias actualizadas y manejo de errores refactorizado
Salida:
```
chore: actualizar dependencias y refactorizar manejo de errores

- Actualizar lodash a 4.17.21
- Estandarizar formato de respuesta de error en todos los endpoints
```

Sigue este estilo: tipo(alcance): descripción breve, luego explicación detallada.
````

Los ejemplos ayudan a Claude a entender el estilo deseado y el nivel de detalle más claramente que las descripciones solas.

### Patrón de flujo de trabajo condicional

Guía a Claude a través de puntos de decisión:

```markdown
## Flujo de trabajo de modificación de documentos

1. Determina el tipo de modificación:

   **¿Creando contenido nuevo?** → Sigue "Flujo de trabajo de creación" a continuación
   **¿Editando contenido existente?** → Sigue "Flujo de trabajo de edición" a continuación

2. Flujo de trabajo de creación:
   - Usa biblioteca docx-js
   - Construye documento desde cero
   - Exporta a formato .docx

3. Flujo de trabajo de edición:
   - Desempaqueta documento existente
   - Modifica XML directamente
   - Valida después de cada cambio
   - Reempaqueta cuando esté completo
```

<Tip>
Si los flujos de trabajo se vuelven grandes o complicados con muchos pasos, considera empujarlos a archivos separados e indica a Claude que lea el archivo apropiado basado en la tarea en cuestión.
</Tip>

## Evaluación e iteración

### Construye evaluaciones primero

**Crea evaluaciones ANTES de escribir documentación extensa.** Esto asegura que tu Skill resuelva problemas reales en lugar de documentar los imaginados.

**Desarrollo impulsado por evaluación:**
1. **Identifica brechas**: Ejecuta Claude en tareas representativas sin un Skill. Documenta fallos específicos o contexto faltante
2. **Crea evaluaciones**: Construye tres escenarios que prueben estas brechas
3. **Establece línea base**: Mide el desempeño de Claude sin el Skill
4. **Escribe instrucciones mínimas**: Crea solo suficiente contenido para abordar las brechas y pasar evaluaciones
5. **Itera**: Ejecuta evaluaciones, compara contra línea base, y refina

Este enfoque asegura que estés resolviendo problemas reales en lugar de anticipar requisitos que nunca se materializarán.

**Estructura de evaluación**:
```json
{
  "skills": ["pdf-processing"],
  "query": "Extrae todo el texto de este archivo PDF y guárdalo en output.txt",
  "files": ["test-files/document.pdf"],
  "expected_behavior": [
    "Lee exitosamente el archivo PDF usando una biblioteca de procesamiento de PDF apropiada o herramienta de línea de comandos",
    "Extrae contenido de texto de todas las páginas en el documento sin perder ninguna página",
    "Guarda el texto extraído en un archivo llamado output.txt en un formato claro y legible"
  ]
}
```

<Note>
Este ejemplo demuestra una evaluación impulsada por datos con una rúbrica de prueba simple. Actualmente no proporcionamos una forma integrada de ejecutar estas evaluaciones. Los usuarios pueden crear su propio sistema de evaluación. Las evaluaciones son tu fuente de verdad para medir la efectividad del Skill.
</Note>

### Desarrolla Skills iterativamente con Claude

El proceso más efectivo de desarrollo de Skill implica a Claude mismo. Trabaja con una instancia de Claude ("Claude A") para crear un Skill que será usado por otras instancias ("Claude B"). Claude A te ayuda a diseñar y refinar instrucciones, mientras que Claude B las prueba en tareas reales. Esto funciona porque los modelos Claude entienden tanto cómo escribir instrucciones efectivas de agentes como qué información necesitan los agentes.

**Creando un nuevo Skill:**

1. **Completa una tarea sin un Skill**: Trabaja a través de un problema con Claude A usando prompting normal. Mientras trabajas, naturalmente proporcionarás contexto, explicarás preferencias y compartirás conocimiento procedural. Nota qué información proporcionas repetidamente.

2. **Identifica el patrón reutilizable**: Después de completar la tarea, identifica qué contexto proporcionaste que sería útil para tareas futuras similares.

   **Ejemplo**: Si trabajaste a través de un análisis de BigQuery, podrías haber proporcionado nombres de tablas, definiciones de campos, reglas de filtrado (como "siempre excluir cuentas de prueba"), y patrones de consulta comunes.

3. **Pide a Claude A que cree un Skill**: "Crea un Skill que capture este patrón de análisis de BigQuery que acabamos de usar. Incluye los esquemas de tabla, convenciones de nomenclatura, y la regla sobre filtrado de cuentas de prueba."

   <Tip>
   Los modelos Claude entienden el formato y estructura del Skill nativamente. No necesitas prompts del sistema especiales o un "skill de escritura de skills" para que Claude ayude a crear Skills. Simplemente pide a Claude que cree un Skill y generará contenido SKILL.md adecuadamente estructurado con frontmatter y contenido del cuerpo apropiados.
   </Tip>

4. **Revisa por concisión**: Verifica que Claude A no haya agregado explicaciones innecesarias. Pregunta: "Elimina la explicación sobre qué significa tasa de ganancia - Claude ya sabe eso."

5. **Mejora la arquitectura de información**: Pide a Claude A que organice el contenido más efectivamente. Por ejemplo: "Organiza esto para que el esquema de tabla esté en un archivo de referencia separado. Podríamos agregar más tablas más tarde."

6. **Prueba en tareas similares**: Usa el Skill con Claude B (una instancia nueva con el Skill cargado) en casos de uso relacionados. Observa si Claude B encuentra la información correcta, aplica reglas correctamente, y maneja la tarea exitosamente.

7. **Itera basado en observación**: Si Claude B lucha o pierde algo, vuelve a Claude A con especificidades: "Cuando Claude usó este Skill, olvidó filtrar por fecha para Q4. ¿Deberíamos agregar una sección sobre patrones de filtrado de fecha?"

**Iterando en Skills existentes:**

El mismo patrón jerárquico continúa cuando se mejoran Skills. Alternas entre:
- **Trabajar con Claude A** (el experto que ayuda a refinar el Skill)
- **Probar con Claude B** (el agente usando el Skill para realizar trabajo real)
- **Observar el comportamiento de Claude B** y traer insights de vuelta a Claude A

1. **Usa el Skill en flujos de trabajo reales**: Dale a Claude B (con el Skill cargado) tareas reales, no escenarios de prueba

2. **Observa el comportamiento de Claude B**: Anota dónde lucha, tiene éxito, o hace elecciones inesperadas

   **Ejemplo de observación**: "Cuando pedí a Claude B un informe de ventas regional, escribió la consulta pero olvidó filtrar cuentas de prueba, incluso aunque el Skill menciona esta regla."

3. **Vuelve a Claude A para mejoras**: Comparte el SKILL.md actual y describe lo que observaste. Pregunta: "Noté que Claude B olvidó filtrar cuentas de prueba cuando pedí un informe regional. El Skill menciona filtrado, ¿pero quizás no es lo suficientemente prominente?"

4. **Revisa las sugerencias de Claude A**: Claude A podría sugerir reorganizar para hacer reglas más prominentes, usar lenguaje más fuerte como "DEBE filtrar" en lugar de "siempre filtrar", o reestructurar la sección de flujo de trabajo.

5. **Aplica y prueba cambios**: Actualiza el Skill con los refinamientos de Claude A, luego prueba nuevamente con Claude B en solicitudes similares

6. **Repite basado en uso**: Continúa este ciclo de observar-refinar-probar a medida que encuentres nuevos escenarios. Cada iteración mejora el Skill basado en comportamiento real del agente, no suposiciones.

**Recopilando retroalimentación del equipo:**

1. Comparte Skills con compañeros de equipo y observa su uso
2. Pregunta: ¿Se activa el Skill cuando se espera? ¿Son claras las instrucciones? ¿Qué falta?
3. Incorpora retroalimentación para abordar puntos ciegos en tus propios patrones de uso

**Por qué funciona este enfoque**: Claude A entiende necesidades de agentes, tú proporcionas experiencia de dominio, Claude B revela brechas a través de uso real, y refinamiento iterativo mejora Skills basado en comportamiento observado en lugar de suposiciones.

### Observa cómo Claude navega Skills

A medida que iteras en Skills, presta atención a cómo Claude realmente los usa en la práctica. Observa:

- **Rutas de exploración inesperadas**: ¿Lee Claude archivos en un orden que no anticipaste? Esto podría indicar que tu estructura no es tan intuitiva como pensaste
- **Conexiones perdidas**: ¿Falla Claude en seguir referencias a archivos importantes? Tus enlaces podrían necesitar ser más explícitos o prominentes
- **Dependencia excesiva de ciertas secciones**: Si Claude lee repetidamente el mismo archivo, considera si ese contenido debería estar en el SKILL.md principal en lugar de
- **Contenido ignorado**: Si Claude nunca accede a un archivo agrupado, podría ser innecesario o mal señalizado en las instrucciones principales

Itera basado en estas observaciones en lugar de suposiciones. El 'name' y 'description' en los metadatos de tu Skill son particularmente críticos. Claude los usa cuando decide si activar el Skill en respuesta a la tarea actual. Asegúrate de que describan claramente qué hace el Skill y cuándo debe usarse.

## Anti-patrones a evitar

### Evita rutas de estilo Windows

Siempre usa barras diagonales en rutas de archivo, incluso en Windows:

- ✓ **Bueno**: `scripts/helper.py`, `reference/guide.md`
- ✗ **Evita**: `scripts\helper.py`, `reference\guide.md`

Las rutas de estilo Unix funcionan en todas las plataformas, mientras que las rutas de estilo Windows causan errores en sistemas Unix.

### Evita ofrecer demasiadas opciones

No presentes múltiples enfoques a menos que sea necesario:

````markdown
**Mal ejemplo: Demasiadas opciones** (confuso):
"Puedes usar pypdf, o pdfplumber, o PyMuPDF, o pdf2image, o..."

**Buen ejemplo: Proporciona un predeterminado** (con escape hatch):
"Usa pdfplumber para extracción de texto:
```python
import pdfplumber
```

Para PDFs escaneados que requieren OCR, usa pdf2image con pytesseract en su lugar."
````

## Avanzado: Skills con código ejecutable

Las secciones a continuación se enfocan en Skills que incluyen scripts ejecutables. Si tu Skill usa solo instrucciones markdown, salta a [Lista de verificación para Skills efectivos](#checklist-for-effective-skills).

### Resuelve, no eludas

Al escribir scripts para Skills, maneja condiciones de error en lugar de eludir a Claude.

**Buen ejemplo: Maneja errores explícitamente**:
```python
def process_file(path):
    """Procesa un archivo, creándolo si no existe."""
    try:
        with open(path) as f:
            return f.read()
    except FileNotFoundError:
        # Crea archivo con contenido predeterminado en lugar de fallar
        print(f"Archivo {path} no encontrado, creando predeterminado")
        with open(path, 'w') as f:
            f.write('')
        return ''
    except PermissionError:
        # Proporciona alternativa en lugar de fallar
        print(f"No se puede acceder a {path}, usando predeterminado")
        return ''
```

**Mal ejemplo: Elude a Claude**:
```python
def process_file(path):
    # Solo falla y deja que Claude lo resuelva
    return open(path).read()
```

Los parámetros de configuración también deben justificarse y documentarse para evitar "constantes vudú" (ley de Ousterhout). Si no sabes el valor correcto, ¿cómo determinará Claude?

**Buen ejemplo: Auto-documentado**:
```python
# Las solicitudes HTTP típicamente se completan dentro de 30 segundos
# Un timeout más largo cuenta para conexiones lentas
REQUEST_TIMEOUT = 30

# Tres reintentos equilibra confiabilidad vs velocidad
# La mayoría de fallos intermitentes se resuelven en el segundo reintento
MAX_RETRIES = 3
```

**Mal ejemplo: Números mágicos**:
```python
TIMEOUT = 47  # ¿Por qué 47?
RETRIES = 5   # ¿Por qué 5?
```

### Proporciona scripts de utilidad

Incluso si Claude pudiera escribir un script, los scripts prefabricados ofrecen ventajas:

**Beneficios de scripts de utilidad**:
- Más confiables que código generado
- Ahorran tokens (no necesitas incluir código en contexto)
- Ahorran tiempo (no se requiere generación de código)
- Aseguran consistencia en todos los usos

![Agrupación de scripts ejecutables junto a archivos de instrucción](/docs/images/agent-skills-executable-scripts.png)

El diagrama anterior muestra cómo los scripts ejecutables funcionan junto a archivos de instrucción. El archivo de instrucción (forms.md) hace referencia al script, y Claude puede ejecutarlo sin cargar su contenido en contexto.

**Distinción importante**: Aclara en tus instrucciones si Claude debe:
- **Ejecutar el script** (más común): "Ejecuta `analyze_form.py` para extraer campos"
- **Leerlo como referencia** (para lógica compleja): "Consulta `analyze_form.py` para el algoritmo de extracción de campos"

Para la mayoría de scripts de utilidad, la ejecución es preferida porque es más confiable y eficiente. Consulta la sección [Entorno de ejecución](#runtime-environment) a continuación para detalles sobre cómo funciona la ejecución de scripts.

**Ejemplo**:
````markdown
## Scripts de utilidad

**analyze_form.py**: Extrae todos los campos de formulario de PDF

```bash
python scripts/analyze_form.py input.pdf > fields.json
```

Formato de salida:
```json
{
  "field_name": {"type": "text", "x": 100, "y": 200},
  "signature": {"type": "sig", "x": 150, "y": 500}
}
```

**validate_boxes.py**: Verifica cajas de delimitación superpuestas

```bash
python scripts/validate_boxes.py fields.json
# Retorna: "OK" o lista conflictos
```

**fill_form.py**: Aplica valores de campo a PDF

```bash
python scripts/fill_form.py input.pdf fields.json output.pdf
```
````

### Usa análisis visual

Cuando las entradas pueden renderizarse como imágenes, haz que Claude las analice:

````markdown
## Análisis de diseño de formulario

1. Convierte PDF a imágenes:
   ```bash
   python scripts/pdf_to_images.py form.pdf
   ```

2. Analiza cada imagen de página para identificar campos de formulario
3. Claude puede ver ubicaciones y tipos de campos visualmente
````

<Note>
En este ejemplo, necesitarías escribir el script `pdf_to_images.py`.
</Note>

Las capacidades de visión de Claude ayudan a entender diseños y estructuras.

### Crea salidas intermedias verificables

Cuando Claude realiza tareas complejas y abiertas, puede cometer errores. El patrón "plan-validar-ejecutar" detecta errores temprano al hacer que Claude primero cree un plan en formato estructurado, luego valide ese plan con un script antes de ejecutarlo.

**Ejemplo**: Imagina pedir a Claude que actualice 50 campos de formulario en un PDF basado en una hoja de cálculo. Sin validación, Claude podría hacer referencia a campos inexistentes, crear valores conflictivos, perder campos requeridos, o aplicar actualizaciones incorrectamente.

**Solución**: Usa el patrón de flujo de trabajo mostrado arriba (llenado de formularios PDF), pero agrega un archivo intermedio `changes.json` que se valida antes de aplicar cambios. El flujo de trabajo se convierte en: analizar → **crear archivo de plan** → **validar plan** → ejecutar → verificar.

**Por qué funciona este patrón:**
- **Detecta errores temprano**: La validación encuentra problemas antes de que se apliquen cambios
- **Verificable por máquina**: Los scripts proporcionan verificación objetiva
- **Planificación reversible**: Claude puede iterar en el plan sin tocar originales
- **Depuración clara**: Los mensajes de error apuntan a problemas específicos

**Cuándo usar**: Operaciones por lotes, cambios destructivos, reglas de validación complejas, operaciones de alto riesgo.

**Consejo de implementación**: Haz scripts de validación verbosos con mensajes de error específicos como "Campo 'signature_date' no encontrado. Campos disponibles: customer_name, order_total, signature_date_signed" para ayudar a Claude a corregir problemas.

### Empaqueta dependencias

Los Skills se ejecutan en el entorno de ejecución de código con limitaciones específicas de plataforma:

- **claude.ai**: Puede instalar paquetes de npm y PyPI y extraer de repositorios de GitHub
- **API de Anthropic**: No tiene acceso a red y sin instalación de paquetes en tiempo de ejecución

Lista paquetes requeridos en tu SKILL.md y verifica que estén disponibles en la [documentación de herramienta de ejecución de código](/docs/es/agents-and-tools/tool-use/code-execution-tool).

### Entorno de ejecución

Los Skills se ejecutan en un entorno de ejecución de código con acceso al sistema de archivos, comandos bash, y capacidades de ejecución de código. Para la explicación conceptual de esta arquitectura, consulta [La arquitectura de Skills](/docs/es/agents-and-tools/agent-skills/overview#the-skills-architecture) en la descripción general.

**Cómo esto afecta tu autoría:**

**Cómo Claude accede a Skills:**

1. **Metadatos precargados**: Al inicio, el nombre y descripción del frontmatter YAML de todos los Skills se cargan en el prompt del sistema
2. **Archivos leídos bajo demanda**: Claude usa herramientas bash Read para acceder a SKILL.md y otros archivos del sistema de archivos cuando sea necesario
3. **Scripts ejecutados eficientemente**: Los scripts de utilidad pueden ejecutarse vía bash sin cargar su contenido completo en contexto. Solo la salida del script consume tokens
4. **Sin penalización de contexto para archivos grandes**: Archivos de referencia, datos, o documentación no consumen tokens de contexto hasta que se lean realmente

- **Las rutas de archivo importan**: Claude navega tu directorio de skill como un sistema de archivos. Usa barras diagonales (`reference/guide.md`), no barras invertidas
- **Nombra archivos descriptivamente**: Usa nombres que indiquen contenido: `form_validation_rules.md`, no `doc2.md`
- **Organiza para descubrimiento**: Estructura directorios por dominio o característica
  - Bueno: `reference/finance.md`, `reference/sales.md`
  - Malo: `docs/file1.md`, `docs/file2.md`
- **Agrupa recursos completos**: Incluye documentos de API completos, ejemplos extensos, conjuntos de datos grandes; sin penalización de contexto hasta que se acceda
- **Prefiere scripts para operaciones deterministas**: Escribe `validate_form.py` en lugar de pedir a Claude que genere código de validación
- **Aclara la intención de ejecución**:
  - "Ejecuta `analyze_form.py` para extraer campos" (ejecutar)
  - "Consulta `analyze_form.py` para el algoritmo de extracción" (leer como referencia)
- **Prueba patrones de acceso a archivos**: Verifica que Claude pueda navegar tu estructura de directorio probando con solicitudes reales

**Ejemplo:**

```
bigquery-skill/
├── SKILL.md (descripción general, apunta a archivos de referencia)
└── reference/
    ├── finance.md (métricas de ingresos)
    ├── sales.md (datos de pipeline)
    └── product.md (análisis de uso)
```

Cuando el usuario pregunta sobre ingresos, Claude lee SKILL.md, ve la referencia a `reference/finance.md`, e invoca bash para leer solo ese archivo. Los archivos sales.md y product.md permanecen en el sistema de archivos, consumiendo cero tokens de contexto hasta que sea necesario. Este modelo basado en el sistema de archivos es lo que habilita la divulgación progresiva. Claude puede navegar y cargar selectivamente exactamente lo que cada tarea requiere.

Para detalles técnicos completos sobre la arquitectura, consulta [Cómo funcionan los Skills](/docs/es/agents-and-tools/agent-skills/overview#how-skills-work) en la descripción general de Skills.

### Referencias de herramientas MCP

Si tu Skill usa herramientas MCP (Model Context Protocol), siempre usa nombres de herramientas completamente calificados para evitar errores "herramienta no encontrada".

**Formato**: `ServerName:tool_name`

**Ejemplo**:
```markdown
Usa la herramienta BigQuery:bigquery_schema para recuperar esquemas de tabla.
Usa la herramienta GitHub:create_issue para crear problemas.
```

Donde:
- `BigQuery` y `GitHub` son nombres de servidor MCP
- `bigquery_schema` y `create_issue` son los nombres de herramientas dentro de esos servidores

Sin el prefijo del servidor, Claude puede fallar en localizar la herramienta, especialmente cuando múltiples servidores MCP están disponibles.

### Evita asumir que las herramientas están instaladas

No asumas que los paquetes están disponibles:

````markdown
**Mal ejemplo: Asume instalación**:
"Usa la biblioteca pdf para procesar el archivo."

**Buen ejemplo: Explícito sobre dependencias**:
"Instala paquete requerido: `pip install pypdf`

Luego úsalo:
```python
from pypdf import PdfReader
reader = PdfReader("file.pdf")
```"
````

## Notas técnicas

### Requisitos de frontmatter YAML

El frontmatter de SKILL.md requiere campos `name` y `description` con reglas de validación específicas:
- `name`: Máximo 64 caracteres, solo letras minúsculas/números/guiones, sin etiquetas XML, sin palabras reservadas
- `description`: Máximo 1024 caracteres, no vacío, sin etiquetas XML

Consulta la [descripción general de Skills](/docs/es/agents-and-tools/agent-skills/overview#skill-structure) para detalles completos de estructura.

### Presupuestos de tokens

Mantén el cuerpo de SKILL.md bajo 500 líneas para un rendimiento óptimo. Si tu contenido excede esto, divídelo en archivos separados usando los patrones de divulgación progresiva descritos anteriormente. Para detalles arquitectónicos, consulta la [descripción general de Skills](/docs/es/agents-and-tools/agent-skills/overview#how-skills-work).

## Lista de verificación para Skills efectivos

Antes de compartir un Skill, verifica:

### Calidad central
- [ ] La descripción es específica e incluye términos clave
- [ ] La descripción incluye tanto qué hace el Skill como cuándo usarlo
- [ ] El cuerpo de SKILL.md está bajo 500 líneas
- [ ] Los detalles adicionales están en archivos separados (si es necesario)
- [ ] Sin información sensible al tiempo (o en sección "patrones antiguos")
- [ ] Terminología consistente en todo
- [ ] Los ejemplos son concretos, no abstractos
- [ ] Las referencias de archivo están un nivel de profundidad
- [ ] La divulgación progresiva se usa apropiadamente
- [ ] Los flujos de trabajo tienen pasos claros

### Código y scripts
- [ ] Los scripts resuelven problemas en lugar de eludir a Claude
- [ ] El manejo de errores es explícito y útil
- [ ] Sin "constantes vudú" (todos los valores justificados)
- [ ] Paquetes requeridos listados en instrucciones y verificados como disponibles
- [ ] Los scripts tienen documentación clara
- [ ] Sin rutas de estilo Windows (todas barras diagonales)
- [ ] Pasos de validación/verificación para operaciones críticas
- [ ] Bucles de retroalimentación incluidos para tareas críticas de calidad

### Pruebas
- [ ] Al menos tres evaluaciones creadas
- [ ] Probado con Haiku, Sonnet y Opus
- [ ] Probado con escenarios de uso real
- [ ] Retroalimentación del equipo incorporada (si aplica)

## Próximos pasos

<CardGroup cols={2}>
  <Card
    title="Comienza con Agent Skills"
    icon="rocket"
    href="/docs/es/agents-and-tools/agent-skills/quickstart"
  >
    Crea tu primer Skill
  </Card>
  <Card
    title="Usa Skills en Claude Code"
    icon="terminal"
    href="https://code.claude.com/docs/skills"
  >
    Crea y gestiona Skills en Claude Code
  </Card>
  <Card
    title="Usa Skills en el Agent SDK"
    icon="cube"
    href="/docs/es/agent-sdk/skills"
  >
    Usa Skills programáticamente en TypeScript y Python
  </Card>
  <Card
    title="Usa Skills con la API"
    icon="code"
    href="/docs/es/build-with-claude/skills-guide"
  >
    Carga y usa Skills programáticamente
  </Card>
</CardGroup>