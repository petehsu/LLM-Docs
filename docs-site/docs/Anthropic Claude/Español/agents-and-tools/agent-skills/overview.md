# Habilidades del Agente

Las Habilidades del Agente son capacidades modulares que extienden la funcionalidad de Claude. Cada Habilidad empaqueta instrucciones, metadatos y recursos opcionales (scripts, plantillas) que Claude utiliza automáticamente cuando es relevante.

---

## Por qué usar Habilidades

Las Habilidades son recursos reutilizables basados en el sistema de archivos que proporcionan a Claude experiencia específica del dominio: flujos de trabajo, contexto y mejores prácticas que transforman agentes de propósito general en especialistas. A diferencia de los prompts (instrucciones a nivel de conversación para tareas puntuales), las Habilidades se cargan bajo demanda y eliminan la necesidad de proporcionar repetidamente la misma orientación en múltiples conversaciones.

**Beneficios clave**:
- **Especializar Claude**: Adaptar capacidades para tareas específicas del dominio
- **Reducir repetición**: Crear una vez, usar automáticamente
- **Componer capacidades**: Combinar Habilidades para construir flujos de trabajo complejos

<Note>
Para un análisis profundo de la arquitectura y aplicaciones del mundo real de las Habilidades del Agente, lee nuestro blog de ingeniería: [Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills).
</Note>

## Usar Habilidades

Anthropic proporciona Habilidades del Agente precompiladas para tareas comunes de documentos (PowerPoint, Excel, Word, PDF), y puedes crear tus propias Habilidades personalizadas. Ambas funcionan de la misma manera. Claude las utiliza automáticamente cuando son relevantes para tu solicitud.

**Las Habilidades del Agente precompiladas** están disponibles para todos los usuarios en claude.ai y a través de la API de Claude. Consulta la sección [Habilidades disponibles](#available-skills) a continuación para obtener la lista completa.

**Las Habilidades personalizadas** te permiten empaquetar experiencia del dominio y conocimiento organizacional. Están disponibles en todos los productos de Claude: créalas en Claude Code, cárgalas a través de la API, o agrégalas en la configuración de claude.ai.

<Note>
**Comenzar:**
- Para Habilidades del Agente precompiladas: Consulta el [tutorial de inicio rápido](/docs/es/agents-and-tools/agent-skills/quickstart) para comenzar a usar las habilidades de PowerPoint, Excel, Word y PDF en la API
- Para Habilidades personalizadas: Consulta el [Libro de recetas de Habilidades del Agente](https://github.com/anthropics/claude-cookbooks/tree/main/skills) para aprender cómo crear tus propias Habilidades
</Note>

## Cómo funcionan las Habilidades

Las Habilidades aprovechan el entorno de VM de Claude para proporcionar capacidades más allá de lo que es posible solo con prompts. Claude opera en una máquina virtual con acceso al sistema de archivos, lo que permite que las Habilidades existan como directorios que contienen instrucciones, código ejecutable y materiales de referencia, organizados como una guía de incorporación que crearías para un nuevo miembro del equipo.

Esta arquitectura basada en el sistema de archivos permite **divulgación progresiva**: Claude carga información en etapas según sea necesario, en lugar de consumir contexto por adelantado.

### Tres tipos de contenido de Habilidad, tres niveles de carga

Las Habilidades pueden contener tres tipos de contenido, cada uno cargado en diferentes momentos:

### Nivel 1: Metadatos (siempre cargados)

**Tipo de contenido: Instrucciones**. El frontmatter YAML de la Habilidad proporciona información de descubrimiento:

```yaml
---
name: pdf-processing
description: Extract text and tables from PDF files, fill forms, merge documents. Use when working with PDF files or when the user mentions PDFs, forms, or document extraction.
---
```

Claude carga estos metadatos al inicio e los incluye en el prompt del sistema. Este enfoque ligero significa que puedes instalar muchas Habilidades sin penalización de contexto; Claude solo sabe que cada Habilidad existe y cuándo usarla.

### Nivel 2: Instrucciones (cargadas cuando se activan)

**Tipo de contenido: Instrucciones**. El cuerpo principal de SKILL.md contiene conocimiento procedural: flujos de trabajo, mejores prácticas y orientación:

````markdown
# PDF Processing

## Quick start

Use pdfplumber to extract text from PDFs:

```python
import pdfplumber

with pdfplumber.open("document.pdf") as pdf:
    text = pdf.pages[0].extract_text()
```

For advanced form filling, see [FORMS.md](FORMS.md).
````

Cuando solicitas algo que coincide con la descripción de una Habilidad, Claude lee SKILL.md del sistema de archivos a través de bash. Solo entonces este contenido entra en la ventana de contexto.

### Nivel 3: Recursos y código (cargados según sea necesario)

**Tipos de contenido: Instrucciones, código y recursos**. Las Habilidades pueden agrupar materiales adicionales:

```
pdf-skill/
├── SKILL.md (main instructions)
├── FORMS.md (form-filling guide)
├── REFERENCE.md (detailed API reference)
└── scripts/
    └── fill_form.py (utility script)
```

**Instrucciones**: Archivos markdown adicionales (FORMS.md, REFERENCE.md) que contienen orientación especializada y flujos de trabajo

**Código**: Scripts ejecutables (fill_form.py, validate.py) que Claude ejecuta a través de bash; los scripts proporcionan operaciones deterministas sin consumir contexto

**Recursos**: Materiales de referencia como esquemas de bases de datos, documentación de API, plantillas o ejemplos

Claude accede a estos archivos solo cuando se hace referencia a ellos. El modelo de sistema de archivos significa que cada tipo de contenido tiene diferentes fortalezas: instrucciones para orientación flexible, código para confiabilidad, recursos para búsqueda de hechos.

| Nivel | Cuándo se carga | Costo de tokens | Contenido |
|---|---|---|---|
| **Nivel 1: Metadatos** | Siempre (al inicio) | ~100 tokens por Habilidad | `name` y `description` del frontmatter YAML |
| **Nivel 2: Instrucciones** | Cuando se activa la Habilidad | Menos de 5k tokens | Cuerpo de SKILL.md con instrucciones y orientación |
| **Nivel 3+: Recursos** | Según sea necesario | Efectivamente ilimitado | Archivos agrupados ejecutados a través de bash sin cargar contenidos en contexto |

La divulgación progresiva asegura que solo el contenido relevante ocupe la ventana de contexto en cualquier momento dado.

### La arquitectura de Habilidades

Las Habilidades se ejecutan en un entorno de ejecución de código donde Claude tiene acceso al sistema de archivos, comandos bash y capacidades de ejecución de código. Piénsalo así: las Habilidades existen como directorios en una máquina virtual, y Claude interactúa con ellas usando los mismos comandos bash que usarías para navegar archivos en tu computadora.

![Agent Skills Architecture - showing how Skills integrate with the agent's configuration and virtual machine](/docs/images/agent-skills-architecture.png)

**Cómo Claude accede al contenido de Habilidad:**

Cuando se activa una Habilidad, Claude usa bash para leer SKILL.md del sistema de archivos, trayendo sus instrucciones a la ventana de contexto. Si esas instrucciones hacen referencia a otros archivos (como FORMS.md o un esquema de base de datos), Claude también lee esos archivos usando comandos bash adicionales. Cuando las instrucciones mencionan scripts ejecutables, Claude los ejecuta a través de bash y recibe solo la salida (el código del script nunca entra en contexto).

**Lo que esta arquitectura permite:**

**Acceso a archivos bajo demanda**: Claude lee solo los archivos necesarios para cada tarea específica. Una Habilidad puede incluir docenas de archivos de referencia, pero si tu tarea solo necesita el esquema de ventas, Claude carga solo ese archivo. El resto permanece en el sistema de archivos consumiendo cero tokens.

**Ejecución eficiente de scripts**: Cuando Claude ejecuta `validate_form.py`, el código del script nunca se carga en la ventana de contexto. Solo la salida del script (como "Validation passed" o mensajes de error específicos) consume tokens. Esto hace que los scripts sean mucho más eficientes que hacer que Claude genere código equivalente sobre la marcha.

**Sin límite práctico en contenido agrupado**: Porque los archivos no consumen contexto hasta que se accede a ellos, las Habilidades pueden incluir documentación completa de API, conjuntos de datos grandes, ejemplos extensos, o cualquier material de referencia que necesites. No hay penalización de contexto para contenido agrupado que no se usa.

Este modelo basado en el sistema de archivos es lo que hace que funcione la divulgación progresiva. Claude navega tu Habilidad como harías referencia a secciones específicas de una guía de incorporación, accediendo exactamente a lo que cada tarea requiere.

### Ejemplo: Cargando una habilidad de procesamiento de PDF

Aquí está cómo Claude carga y usa una habilidad de procesamiento de PDF:

1. **Inicio**: El prompt del sistema incluye: `PDF Processing - Extract text and tables from PDF files, fill forms, merge documents`
2. **Solicitud del usuario**: "Extract the text from this PDF and summarize it"
3. **Claude invoca**: `bash: read pdf-skill/SKILL.md` → Instrucciones cargadas en contexto
4. **Claude determina**: El llenado de formularios no es necesario, por lo que FORMS.md no se lee
5. **Claude ejecuta**: Usa instrucciones de SKILL.md para completar la tarea

![Skills loading into context window - showing the progressive loading of skill metadata and content](/docs/images/agent-skills-context-window.png)

El diagrama muestra:
1. Estado predeterminado con prompt del sistema y metadatos de habilidad precargados
2. Claude activa la habilidad leyendo SKILL.md a través de bash
3. Claude opcionalmente lee archivos agrupados adicionales como FORMS.md según sea necesario
4. Claude procede con la tarea

Esta carga dinámica asegura que solo el contenido de habilidad relevante ocupe la ventana de contexto.

## Dónde funcionan las Habilidades

Las Habilidades están disponibles en todos los productos de agentes de Claude:

### Claude API

La API de Claude admite tanto Habilidades del Agente precompiladas como Habilidades personalizadas. Ambas funcionan de manera idéntica: especifica el `skill_id` relevante en el parámetro `container` junto con la herramienta de ejecución de código.

**Requisitos previos**: El uso de Habilidades a través de la API requiere tres encabezados beta:
- `code-execution-2025-08-25` - Las Habilidades se ejecutan en el contenedor de ejecución de código
- `skills-2025-10-02` - Habilita la funcionalidad de Habilidades
- `files-api-2025-04-14` - Requerido para cargar/descargar archivos hacia/desde el contenedor

Usa Habilidades del Agente precompiladas haciendo referencia a su `skill_id` (por ejemplo, `pptx`, `xlsx`), o crea y carga las tuyas propias a través de la API de Habilidades (puntos finales `/v1/skills`). Las Habilidades personalizadas se comparten en toda la organización.

Para obtener más información, consulta [Usar Habilidades con la API de Claude](/docs/es/build-with-claude/skills-guide).

### Claude Code

[Claude Code](https://code.claude.com/docs/overview) admite solo Habilidades personalizadas.

**Habilidades personalizadas**: Crea Habilidades como directorios con archivos SKILL.md. Claude las descubre y las utiliza automáticamente.

Las Habilidades personalizadas en Claude Code se basan en el sistema de archivos y no requieren cargas de API.

Para obtener más información, consulta [Usar Habilidades en Claude Code](https://code.claude.com/docs/skills).

### Claude Agent SDK

El [Claude Agent SDK](/docs/es/agent-sdk/overview) admite Habilidades personalizadas a través de configuración basada en el sistema de archivos.

**Habilidades personalizadas**: Crea Habilidades como directorios con archivos SKILL.md en `.claude/skills/`. Habilita las Habilidades incluyendo `"Skill"` en tu configuración `allowed_tools`.

Las Habilidades en el Agent SDK se descubren automáticamente cuando se ejecuta el SDK.

Para obtener más información, consulta [Habilidades del Agente en el SDK](/docs/es/agent-sdk/skills).

### Claude.ai

[Claude.ai](https://claude.ai) admite tanto Habilidades del Agente precompiladas como Habilidades personalizadas.

**Habilidades del Agente precompiladas**: Estas Habilidades ya están funcionando detrás de escenas cuando creas documentos. Claude las utiliza sin requerir ninguna configuración.

**Habilidades personalizadas**: Carga tus propias Habilidades como archivos zip a través de Configuración > Características. Disponible en planes Pro, Max, Team y Enterprise con ejecución de código habilitada. Las Habilidades personalizadas son individuales para cada usuario; no se comparten en toda la organización y no pueden ser administradas centralmente por administradores.

Para obtener más información sobre el uso de Habilidades en Claude.ai, consulta los siguientes recursos en el Centro de Ayuda de Claude:
- [What are Skills?](https://support.claude.com/en/articles/12512176-what-are-skills)
- [Using Skills in Claude](https://support.claude.com/en/articles/12512180-using-skills-in-claude)
- [How to create custom Skills](https://support.claude.com/en/articles/12512198-creating-custom-skills)
- [Tech Claude your way of working using Skills](https://support.claude.com/en/articles/12580051-teach-claude-your-way-of-working-using-skills)

## Estructura de Habilidad

Cada Habilidad requiere un archivo `SKILL.md` con frontmatter YAML:

```yaml
---
name: your-skill-name
description: Brief description of what this Skill does and when to use it
---

# Your Skill Name

## Instructions
[Clear, step-by-step guidance for Claude to follow]

## Examples
[Concrete examples of using this Skill]
```

**Campos requeridos**: `name` y `description`

**Requisitos de campo**:

`name`:
- Máximo 64 caracteres
- Debe contener solo letras minúsculas, números y guiones
- No puede contener etiquetas XML
- No puede contener palabras reservadas: "anthropic", "claude"

`description`:
- Debe ser no vacío
- Máximo 1024 caracteres
- No puede contener etiquetas XML

La `description` debe incluir tanto qué hace la Habilidad como cuándo Claude debe usarla. Para obtener orientación completa de autoría, consulta la [guía de mejores prácticas](/docs/es/agents-and-tools/agent-skills/best-practices).

## Consideraciones de seguridad

Recomendamos encarecidamente usar Habilidades solo de fuentes confiables: aquellas que creaste tú mismo u obtuviste de Anthropic. Las Habilidades proporcionan a Claude nuevas capacidades a través de instrucciones y código, y aunque esto las hace poderosas, también significa que una Habilidad maliciosa puede dirigir a Claude a invocar herramientas o ejecutar código de formas que no coincidan con el propósito declarado de la Habilidad.

<Warning>
Si debes usar una Habilidad de una fuente desconocida o no confiable, ejerce una cautela extrema y audítala minuciosamente antes de usarla. Dependiendo de qué acceso tenga Claude al ejecutar la Habilidad, las Habilidades maliciosas podrían llevar a exfiltración de datos, acceso no autorizado al sistema u otros riesgos de seguridad.
</Warning>

**Consideraciones clave de seguridad**:
- **Auditar minuciosamente**: Revisa todos los archivos agrupados en la Habilidad: SKILL.md, scripts, imágenes y otros recursos. Busca patrones inusuales como llamadas de red inesperadas, patrones de acceso a archivos u operaciones que no coincidan con el propósito declarado de la Habilidad
- **Las fuentes externas son riesgosas**: Las Habilidades que obtienen datos de URLs externas presentan un riesgo particular, ya que el contenido obtenido puede contener instrucciones maliciosas. Incluso las Habilidades confiables pueden ser comprometidas si sus dependencias externas cambian con el tiempo
- **Mal uso de herramientas**: Las Habilidades maliciosas pueden invocar herramientas (operaciones de archivos, comandos bash, ejecución de código) de formas dañinas
- **Exposición de datos**: Las Habilidades con acceso a datos sensibles podrían estar diseñadas para filtrar información a sistemas externos
- **Tratar como instalar software**: Solo usa Habilidades de fuentes confiables. Ten especial cuidado al integrar Habilidades en sistemas de producción con acceso a datos sensibles u operaciones críticas

## Habilidades disponibles

### Habilidades del Agente precompiladas

Las siguientes Habilidades del Agente precompiladas están disponibles para uso inmediato:

- **PowerPoint (pptx)**: Crear presentaciones, editar diapositivas, analizar contenido de presentaciones
- **Excel (xlsx)**: Crear hojas de cálculo, analizar datos, generar informes con gráficos
- **Word (docx)**: Crear documentos, editar contenido, formatear texto
- **PDF (pdf)**: Generar documentos PDF formateados e informes

Estas Habilidades están disponibles en la API de Claude y claude.ai. Consulta el [tutorial de inicio rápido](/docs/es/agents-and-tools/agent-skills/quickstart) para comenzar a usarlas en la API.

### Ejemplos de Habilidades personalizadas

Para ejemplos completos de Habilidades personalizadas, consulta el [libro de recetas de Habilidades](https://github.com/anthropics/claude-cookbooks/tree/main/skills).

## Limitaciones y restricciones

Entender estas limitaciones te ayuda a planificar tu implementación de Habilidades de manera efectiva.

### Disponibilidad entre superficies

**Las Habilidades personalizadas no se sincronizan entre superficies**. Las Habilidades cargadas en una superficie no están automáticamente disponibles en otras:

- Las Habilidades cargadas en Claude.ai deben cargarse por separado en la API
- Las Habilidades cargadas a través de la API no están disponibles en Claude.ai
- Las Habilidades de Claude Code se basan en el sistema de archivos y son separadas de Claude.ai y la API

Necesitarás administrar y cargar Habilidades por separado para cada superficie donde quieras usarlas.

### Alcance de compartición

Las Habilidades tienen diferentes modelos de compartición dependiendo de dónde las uses:
- **Claude.ai**: Solo usuario individual; cada miembro del equipo debe cargar por separado
- **API de Claude**: En todo el espacio de trabajo; todos los miembros del espacio de trabajo pueden acceder a las Habilidades cargadas
- **Claude Code**: Personal (`~/.claude/skills/`) o basado en proyecto (`.claude/skills/`)

Claude.ai actualmente no admite administración centralizada de administrador ni distribución en toda la organización de Habilidades personalizadas.

### Restricciones del entorno de ejecución

Las Habilidades se ejecutan en el contenedor de ejecución de código con estas limitaciones:

- **Sin acceso a la red**: Las Habilidades no pueden hacer llamadas de API externas ni acceder a Internet
- **Sin instalación de paquetes en tiempo de ejecución**: Solo están disponibles los paquetes preinstalados. No puedes instalar nuevos paquetes durante la ejecución.
- **Solo dependencias preconfiguradas**: Consulta la [documentación de la herramienta de ejecución de código](/docs/es/agents-and-tools/tool-use/code-execution-tool) para obtener la lista de paquetes disponibles

Planifica tus Habilidades para que funcionen dentro de estas restricciones.

## Próximos pasos

<CardGroup cols={2}>
  <Card
    title="Comenzar con Habilidades del Agente"
    icon="graduation-cap"
    href="/docs/es/agents-and-tools/agent-skills/quickstart"
  >
    Crea tu primera Habilidad
  </Card>
  <Card
    title="Guía de API"
    icon="code"
    href="/docs/es/build-with-claude/skills-guide"
  >
    Usar Habilidades con la API de Claude
  </Card>
  <Card
    title="Usar Habilidades en Claude Code"
    icon="terminal"
    href="https://code.claude.com/docs/skills"
  >
    Crear y administrar Habilidades personalizadas en Claude Code
  </Card>
  <Card
    title="Usar Habilidades en el Agent SDK"
    icon="cube"
    href="/docs/es/agent-sdk/skills"
  >
    Usar Habilidades programáticamente en TypeScript y Python
  </Card>
  <Card
    title="Mejores prácticas de autoría"
    icon="lightbulb"
    href="/docs/es/agents-and-tools/agent-skills/best-practices"
  >
    Escribir Habilidades que Claude pueda usar efectivamente
  </Card>
</CardGroup>