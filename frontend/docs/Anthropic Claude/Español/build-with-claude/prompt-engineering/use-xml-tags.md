# Usa etiquetas XML para estructurar tus indicaciones

Aprende cómo usar etiquetas XML para estructurar tus indicaciones de manera clara y efectiva, mejorando la precisión y calidad de las respuestas de Claude.

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

Cuando tus indicaciones involucran múltiples componentes como contexto, instrucciones y ejemplos, las etiquetas XML pueden ser un cambio radical. Ayudan a Claude a analizar tus indicaciones con mayor precisión, lo que lleva a resultados de mayor calidad.

<Tip>**Consejo XML**: Usa etiquetas como `<instructions>`, `<example>` y `<formatting>` para separar claramente diferentes partes de tu indicación. Esto evita que Claude confunda instrucciones con ejemplos o contexto.</Tip>

## ¿Por qué usar etiquetas XML?

- **Claridad:** Separa claramente diferentes partes de tu indicación y asegúrate de que tu indicación esté bien estructurada.
- **Precisión:** Reduce errores causados por Claude malinterpretando partes de tu indicación.
- **Flexibilidad:** Encuentra, añade, elimina o modifica fácilmente partes de tu indicación sin reescribir todo.
- **Parseabilidad:** Hacer que Claude use etiquetas XML en su salida facilita la extracción de partes específicas de su respuesta mediante post-procesamiento.

<Note>No hay etiquetas XML canónicas "mejores" con las que Claude haya sido entrenado en particular, aunque recomendamos que los nombres de tus etiquetas tengan sentido con la información que rodean.</Note>

***

## Mejores prácticas de etiquetado

1. **Sé consistente**: Usa los mismos nombres de etiquetas en todas tus indicaciones y refiere a esos nombres de etiquetas cuando hables sobre el contenido (por ejemplo, `Usando el contrato en etiquetas <contract>...`).
2. **Anida etiquetas**: Debes anidar etiquetas `<outer><inner></inner></outer>` para contenido jerárquico.

<Tip>**Consejo para usuarios avanzados**: Combina etiquetas XML con otras técnicas como indicaciones multishot (`<examples>`) o cadena de pensamiento (`<thinking>`, `<answer>`). Esto crea indicaciones súper estructuradas y de alto rendimiento.</Tip>

### Ejemplos

  <section title="Ejemplo: Generación de informes financieros">

    Sin etiquetas XML, Claude malentiende la tarea y genera un informe que no coincide con la estructura o tono requerido. Después de la sustitución, también existe la posibilidad de que Claude malentienda dónde termina una sección (como el ejemplo del informe Q1) y comienza otra.

    | Rol | Sin etiquetas XML | Con etiquetas XML |
    | ---- | ----------- | ------------- |
    | Usuario | Eres un analista financiero en AcmeCorp. Genera un informe financiero Q2 para nuestros inversores. Incluye secciones sobre Crecimiento de Ingresos, Márgenes de Ganancia y Flujo de Efectivo, como con este ejemplo del año pasado: \{\{Q1_REPORT\}\}. Usa puntos de datos de esta hoja de cálculo: \{\{SPREADSHEET_DATA\}\}. El informe debe ser extremadamente conciso, directo, profesional y en formato de lista. Debe destacar tanto fortalezas como áreas de mejora. | Eres un analista financiero en AcmeCorp. Genera un informe financiero Q2 para nuestros inversores.<br/><br/>AcmeCorp es una empresa B2B SaaS. Nuestros inversores valoran la transparencia y los conocimientos accionables.<br/><br/>Usa estos datos para tu informe:\<data>\{\{SPREADSHEET_DATA\}\}\</data><br/><br/>\<instructions><br/>1. Incluye secciones: Crecimiento de Ingresos, Márgenes de Ganancia, Flujo de Efectivo.<br/>2. Destaca fortalezas y áreas de mejora.<br/>\</instructions><br/><br/>Haz tu tono conciso y profesional. Sigue esta estructura:<br/>\<formatting_example>\{\{Q1_REPORT\}\}\</formatting_example> |
    | Asistente | Informe Financiero Q2 para Inversores de AcmeCorp<br/><br/>Estimados Inversores,<br/><br/>Me complace presentar nuestro informe financiero Q2, mostrando el crecimiento continuo y la resiliencia de AcmeCorp en el mercado B2B SaaS.<br/><br/>1. Crecimiento de Ingresos:<br/>Nuestros ingresos Q2 alcanzaron \$15.2M, un aumento YoY del 22%. Este crecimiento es impulsado principalmente por una expansión del 30% en nuestra base de clientes empresariales. Sin embargo, nuestro segmento de PYMES vio una ligera caída del 5%, que pretendemos abordar mediante iniciativas de marketing dirigidas en Q3.<br/><br/>2. Márgenes de Ganancia:<br/>El margen bruto mejoró al 72% (3% más que Q1) debido a optimizaciones de infraestructura. El margen EBITDA, sin embargo, bajó al 18% (2% menos) ya que invertimos fuertemente en I+D para nuestras próximas características impulsadas por IA.<br/><br/>3. Flujo de Efectivo:<br/>El flujo de efectivo operativo se mantiene fuerte en \$4.1M. Nuestras reservas de efectivo se sitúan en \$28M, proporcionando una pista de 15 meses a la tasa de quema actual. Vimos un aumento del 20% en los costos de adquisición de clientes, que estamos abordando mediante estrategias de ventas más eficientes.<br/><br/>En resumen, los datos financieros principales de AcmeCorp se mantienen sólidos. Estamos equilibrando inversiones de crecimiento con una gestión prudente del efectivo. Nuestro enfoque para Q3 será revitalizar el crecimiento de PYMES y optimizar la eficiencia de ventas.<br/><br/>Gracias por tu confianza continua.<br/><br/>Atentamente,<br/>CFO, AcmeCorp | Informe Financiero Q2 para Inversores de AcmeCorp\</output><br/><br/>Crecimiento de Ingresos:<br/>- Ingresos Q2: \$15.2M (22% YoY ↑)<br/>- Clientes empresariales: 30% ↑<br/>- Segmento PYMES: 5% ↓<br/>  Acción: Marketing dirigido Q3<br/><br/>Márgenes de Ganancia:<br/>- Margen bruto: 72% (3% ↑ desde Q1)<br/>  Razón: Optimizaciones de infraestructura<br/>- Margen EBITDA: 18% (2% ↓)<br/>  Razón: Inversión en I+D en características de IA<br/><br/>Flujo de Efectivo:<br/>- Flujo de efectivo operativo: \$4.1M (fuerte)<br/>- Reservas de efectivo: \$28M (pista de 15 meses)<br/>- Costo de adquisición de clientes: 20% ↑<br/>  Acción: Optimizar estrategias de ventas<br/><br/>Perspectiva:<br/>- Datos financieros principales: Sólidos<br/>- Enfoque Q3: Revitalizar PYMES, optimizar ventas<br/><br/>La administración se mantiene comprometida a equilibrar inversiones de crecimiento con disciplina financiera. |
  
</section>
  <section title="Ejemplo: Análisis de contrato legal">

    Sin etiquetas XML, el análisis de Claude es desorganizado y pierde puntos clave. Con etiquetas, proporciona un análisis estructurado y exhaustivo en el que un equipo legal puede actuar.

    | Rol | Sin etiquetas XML | Con etiquetas XML |
    | ---- | ----------- | ------------- |
    | Usuario | Analiza este acuerdo de licencia de software para identificar riesgos potenciales y responsabilidades: \{\{CONTRACT\}\}. Enfócate en cláusulas de indemnización, limitación de responsabilidad y propiedad intelectual. También, nota cualquier término inusual o preocupante. Aquí está nuestro contrato estándar como referencia: \{\{STANDARD_CONTRACT\}\}. Proporciona un resumen de hallazgos y recomendaciones para nuestro equipo legal. | Analiza este acuerdo de licencia de software para riesgos legales y responsabilidades.<br/><br/>Somos una empresa multinacional considerando este acuerdo para nuestra infraestructura de datos principal.<br/><br/>\<agreement><br/>\{\{CONTRACT\}\}\</agreement><br/><br/>Este es nuestro contrato estándar como referencia:<br/>\<standard_contract>\{\{STANDARD_CONTRACT\}\}\</standard_contract><br/><br/>\<instructions><br/>1. Analiza estas cláusulas:<br/>   - Indemnización<br/>   - Limitación de responsabilidad<br/>   - Propiedad intelectual<br/><br/>2. Nota términos inusuales o preocupantes.<br/><br/>3. Compara con nuestro contrato estándar.<br/><br/>4. Resume hallazgos en etiquetas \<findings>.<br/><br/>5. Lista recomendaciones accionables en etiquetas \<recommendations>.\</instructions> |
    | Asistente | El acuerdo de licencia de software proporcionado presenta varios aspectos preocupantes. La cláusula de indemnización es demasiado amplia, exponiéndonos potencialmente a responsabilidades significativas. La sección de limitación de responsabilidad limita los daños a apenas \$500, lo cual es inadecuado para nuestro uso a nivel empresarial. Con respecto a la propiedad intelectual, el acuerdo otorga al proveedor propiedad conjunta de cualquier modificación o integración que creemos.<br/><br/>En resumen, este acuerdo no está en nuestro mejor interés. Nos expone a riesgos indebidos, limita nuestro recurso en caso de fallas y compromete nuestros derechos de propiedad intelectual. Recomiendo renegociar estos términos o buscar proveedores alternativos. | \<findings><br/>1. Indemnización (Cláusula 8):<br/>   - Problema: Demasiado amplia. Indemnizamos al proveedor contra "cualquier y todos los reclamos" que surjan de nuestro uso.<br/>   - Riesgo: Podría hacernos responsables incluso por negligencia del proveedor o defectos del producto.<br/>   - Desviación: Nuestro estándar limita la indemnidad a reclamos que surjan de nuestra violación del acuerdo.<br/><br/>2. Limitación de Responsabilidad (Cláusula 9):<br/>   - Problema: Limita todos los daños a \$500, incluyendo daños directos.<br/>   - Riesgo: Completamente inadecuado para uso empresarial. Una falla crítica podría costar millones.<br/>   - Desviación: Nuestro estándar permite daños directos hasta 12 meses de honorarios pagados.<br/><br/>3. Propiedad Intelectual (Cláusula 12):<br/>   - Problema: Otorga al proveedor propiedad conjunta de nuestras modificaciones/integraciones.<br/>   - Riesgo: El proveedor podría usar o vender nuestros algoritmos propietarios o conocimientos de datos.<br/>   - Desviación: Nuestro estándar retiene propiedad total de nuestro trabajo.<br/><br/>4. Términos Inusuales:<br/>   - Cláusula 5.3: El proveedor puede usar nuestros datos de uso para "cualquier propósito".<br/>   - Cláusula 7.2: El proveedor puede rescindir por "conveniencia" con solo 7 días de aviso.<br/>   - Cláusula 11: Sin garantías de ningún tipo, ni siquiera para comerciabilidad básica.<br/>\</findings><br/><br/>\<recommendations><br/>1. Rechaza este acuerdo. Los riesgos superan ampliamente los beneficios para una empresa.<br/>2. Contra-propone:<br/>   - Indemnización: Limita a reclamos que surjan de nuestra violación del acuerdo.<br/>   - Responsabilidad: Limita a 12 meses de honorarios para daños directos; negocia para daños indirectos.<br/>   - Propiedad Intelectual: Propiedad total de nuestras modificaciones/integraciones.<br/>   - Uso de Datos: Restringe a mejora del servicio solamente.<br/>   - Rescisión: Mínimo 90 días de aviso; solo por causa.<br/>   - Garantías: Exige comerciabilidad básica y aptitud para propósito.<br/>3. Si el proveedor se niega, explora proveedores alternativos o soluciones internas.<br/>4. Involucra asesoramiento legal para negociación de contrato dadas las altas apuestas.<br/>\</recommendations> |
  
</section>

***

<CardGroup cols={3}>
  <Card title="Biblioteca de indicaciones" icon="link" href="/docs/es/resources/prompt-library/library">
    Inspírate con una selección curada de indicaciones para varias tareas y casos de uso.
  </Card>
  <Card title="Tutorial de indicaciones de GitHub" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    Un tutorial lleno de ejemplos que cubre los conceptos de ingeniería de indicaciones encontrados en nuestra documentación.
  </Card>
  <Card title="Tutorial de indicaciones de Google Sheets" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    Una versión más ligera de nuestro tutorial de ingeniería de indicaciones a través de una hoja de cálculo interactiva.
  </Card>
</CardGroup>