# Reducir las alucinaciones

---

Incluso los modelos de lenguaje más avanzados, como Claude, pueden a veces generar texto que es factualmente incorrecto o inconsistente con el contexto dado. Este fenómeno, conocido como "alucinación", puede socavar la fiabilidad de sus soluciones impulsadas por IA.
Esta guía explorará técnicas para minimizar las alucinaciones y asegurar que las salidas de Claude sean precisas y confiables.

## Estrategias básicas para minimizar las alucinaciones

- **Permitir que Claude diga "No lo sé":** Dar explícitamente permiso a Claude para admitir incertidumbre. Esta simple técnica puede reducir drásticamente la información falsa.

<section title="Ejemplo: Analizando un informe de fusiones y adquisiciones">

| Rol | Contenido |
| ---- | --- |
| Usuario | Como nuestro asesor de fusiones y adquisiciones, analiza este informe sobre la potencial adquisición de AcmeCo por ExampleCorp.<br/><br/>\<report><br/>\{\{REPORT}}<br/>\</report><br/><br/>Concéntrate en las proyecciones financieras, riesgos de integración y obstáculos regulatorios. Si no estás seguro sobre algún aspecto o si el informe carece de la información necesaria, di "No tengo suficiente información para evaluar esto con confianza." |

</section>

- **Usar citas directas para fundamentación factual:** Para tareas que involucran documentos largos (>20K tokens), pide a Claude que extraiga citas textuales primero antes de realizar su tarea. Esto fundamenta sus respuestas en el texto real, reduciendo las alucinaciones.

<section title="Ejemplo: Auditando una política de privacidad de datos">

| Rol | Contenido |
| ---- | --- |
| Usuario | Como nuestro Oficial de Protección de Datos, revisa esta política de privacidad actualizada para el cumplimiento de GDPR y CCPA.<br/>\<br/>\{\{POLICY}}<br/>\</policy><br/><br/>1. Extrae citas exactas de la política que sean más relevantes para el cumplimiento de GDPR y CCPA. Si no puedes encontrar citas relevantes, indica "No se encontraron citas relevantes."<br/><br/>2. Usa las citas para analizar el cumplimiento de estas secciones de la política, haciendo referencia a las citas por número. Basa tu análisis únicamente en las citas extraídas. |

</section>

- **Verificar con citaciones**: Haz que la respuesta de Claude sea auditable haciendo que cite frases y fuentes para cada una de sus afirmaciones. También puedes hacer que Claude verifique cada afirmación encontrando una cita de respaldo después de generar una respuesta. Si no puede encontrar una cita, debe retractar la afirmación.

<section title="Ejemplo: Redactando un comunicado de prensa sobre el lanzamiento de un producto">

| Rol | Contenido |
| ---- | --- |
| Usuario | Redacta un comunicado de prensa para nuestro nuevo producto de ciberseguridad, AcmeSecurity Pro, usando solo información de estos informes de producto y reportes de mercado.<br/>\<documents><br/>\{\{DOCUMENTS}}<br/>\</documents><br/><br/>Después de redactar, revisa cada afirmación en tu comunicado de prensa. Para cada afirmación, encuentra una cita directa de los documentos que la respalde. Si no puedes encontrar una cita de respaldo para una afirmación, elimina esa afirmación del comunicado de prensa y marca donde fue eliminada con corchetes vacíos []. |

</section>

***

## Técnicas avanzadas

- **Verificación de cadena de pensamiento**: Pide a Claude que explique su razonamiento paso a paso antes de dar una respuesta final. Esto puede revelar lógica o suposiciones defectuosas.

- **Verificación mejor de N**: Ejecuta Claude con el mismo prompt múltiples veces y compara las salidas. Las inconsistencias entre las salidas podrían indicar alucinaciones.

- **Refinamiento iterativo**: Usa las salidas de Claude como entradas para prompts de seguimiento, pidiéndole que verifique o expanda declaraciones previas. Esto puede detectar y corregir inconsistencias.

- **Restricción de conocimiento externo**: Instruye explícitamente a Claude para que use solo información de los documentos proporcionados y no su conocimiento general.

<Note>Recuerda que, si bien estas técnicas reducen significativamente las alucinaciones, no las eliminan por completo. Siempre valida la información crítica, especialmente para decisiones de alto riesgo.</Note>