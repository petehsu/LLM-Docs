# Darle un rol a Claude con un system prompt

Aprende cómo usar el parámetro system para darle a Claude un rol específico y mejorar dramáticamente su rendimiento.

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

Al usar Claude, puedes mejorar dramáticamente su rendimiento usando el parámetro `system` para darle un rol. Esta técnica, conocida como role prompting, es la forma más poderosa de usar system prompts con Claude.

¡El rol correcto puede convertir a Claude de un asistente general en tu experto de dominio virtual!

<Tip>**Consejos de system prompt**: Usa el parámetro `system` para establecer el rol de Claude. Pon todo lo demás, como instrucciones específicas de tareas, en el turno del `user` en su lugar.</Tip>

## ¿Por qué usar role prompting?

- **Precisión mejorada:** En escenarios complejos como análisis legal o modelado financiero, el role prompting puede mejorar significativamente el rendimiento de Claude.
- **Tono personalizado:** Ya sea que necesites la brevedad de un CFO o el estilo de un redactor publicitario, el role prompting ajusta el estilo de comunicación de Claude.
- **Enfoque mejorado:** Al establecer el contexto del rol, Claude se mantiene más dentro de los límites de los requisitos específicos de tu tarea.

***

## Cómo darle un rol a Claude

Usa el parámetro `system` en la [Messages API](/docs/es/api/messages) para establecer el rol de Claude:

```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=2048,
    system="You are a seasoned data scientist at a Fortune 500 company.", # <-- role prompt
    messages=[
        {"role": "user", "content": "Analyze this dataset for anomalies: <dataset>{{DATASET}}</dataset>"}
    ]
)

print(response.content)
```

<Tip>**Consejo de role prompting**: ¡Experimenta con roles! Un `data scientist` podría ver diferentes insights que un `marketing strategist` para los mismos datos. Un `data scientist specializing in customer insight analysis for Fortune 500 companies` podría producir resultados diferentes aún.</Tip>

***

## Ejemplos

### Ejemplo 1: Análisis de contrato legal
Sin un rol, Claude podría perder problemas críticos:

<section title="Análisis de contrato legal sin role prompting">

| Rol | Contenido |
| ---- | ------- |
| Usuario | Analiza este acuerdo de licencia de software para riesgos potenciales:<br/>\<contract><br/>\{\{CONTRACT\}\}<br/>\</contract><br/><br/>Enfócate en indemnización, responsabilidad y propiedad intelectual. |
| Asistente | Aquí hay un resumen de los puntos clave en el acuerdo de licencia de software:<br/><br/>1. Indemnización (Sección 8):<br/>   - Indemnizamos al proveedor contra reclamaciones que surjan de nuestro uso.<br/><br/>2. Limitación de Responsabilidad (Sección 9):<br/>   - Daños limitados a \$500.<br/><br/>3. Propiedad Intelectual (Sección 12):<br/>   - Retenemos la propiedad de nuestras modificaciones.<br/><br/>En general, el acuerdo parece estándar. Las cláusulas de indemnización y responsabilidad son típicas, y mantenemos nuestros derechos de propiedad intelectual. |

</section>

Con un rol, Claude detecta problemas críticos que podrían costar millones:

<section title="Análisis de contrato legal con role prompting">

| Rol | Contenido |
| ---- | ------- |
| Usuario | Eres el Consejero General de una empresa tecnológica Fortune 500. Estamos considerando este acuerdo de licencia de software para nuestra infraestructura de datos central:<br/>\<contract><br/>\{\{CONTRACT\}\}<br/>\</contract><br/><br/>Analízalo para riesgos potenciales, enfocándote en indemnización, responsabilidad y propiedad intelectual. Da tu opinión profesional. |
| Asistente | He revisado el acuerdo de licencia de software, y tengo preocupaciones serias que podrían exponer a nuestra empresa a riesgos significativos:<br/><br/>1. Indemnización (Sección 8):<br/>   - Problema Crítico: Indemnizamos al proveedor contra "cualquier y todas las reclamaciones" que surjan de nuestro uso.<br/>   - Riesgo: Esto podría hacernos responsables incluso por negligencia del proveedor o defectos del producto.<br/>   - Recomendación: Rechazar. Limita nuestra indemnidad a reclamaciones que surjan de nuestra violación del acuerdo.<br/><br/>2. Limitación de Responsabilidad (Sección 9):<br/>   - Problema Crítico: Daños limitados a \$500, incluyendo daños directos.<br/>   - Riesgo: Completamente inadecuado. Una falla crítica en nuestra infraestructura de datos podría costarnos millones en ingresos perdidos y daño reputacional.<br/>   - Recomendación: Rechazar. Negocia un límite de 12 meses de honorarios para daños directos, y excepciones para brechas de datos.<br/><br/>3. Propiedad Intelectual (Sección 12):<br/>   - Problema Crítico: El proveedor obtiene propiedad conjunta de nuestras modificaciones e integraciones.<br/>   - Riesgo: Podrían usar o vender nuestros algoritmos propietarios o insights de datos a competidores.<br/>   - Recomendación: Rechazar. Debemos retener la propiedad total de nuestro trabajo.<br/><br/>Opinión Profesional: No firmes este acuerdo. Es extremadamente desfavorable y nos expone a niveles inaceptables de riesgo. Si el proveedor se niega a renegociar estos términos, te recomiendo fuertemente explorar proveedores alternativos o acelerar nuestra solución interna. Los costos potenciales de proceder con este acuerdo superan con creces cualquier ganancia a corto plazo. |

</section>

### Ejemplo 2: Análisis financiero
Sin un rol, el análisis de Claude carece de profundidad:

<section title="Análisis financiero sin role prompting">

| Rol | Contenido |
| ---- | ------- |
| Usuario | Analiza este conjunto de datos de nuestras finanzas del Q2:<br/>\<data><br/>\{\{FINANCIALS\}\}<br/>\</data><br/><br/>Destaca tendencias clave y recomienda acciones. |
| Asistente | Aquí hay un resumen de tus finanzas del Q2:<br/><br/>1. Ingresos: \$15.2M, arriba 22% YoY. La base de clientes empresariales creció 30%.<br/>2. Margen Bruto: 72%, arriba 3% desde Q1.<br/>3. Margen EBITDA: 18%, abajo 2% debido a inversiones en I+D.<br/>4. Flujo de Caja: \$4.1M operativo, \$28M en reservas.<br/><br/>En general, las finanzas se ven sólidas con crecimiento de ingresos y márgenes saludables. El aumento del gasto en I+D está impactando la rentabilidad pero podría dar frutos a largo plazo. Mantén el curso actual. |

</section>

Con un rol, Claude entrega insights accionables:

<section title="Análisis financiero con role prompting">

| Rol | Contenido |
| ---- | ------- |
| Usuario | Eres el CFO de una empresa B2B SaaS de alto crecimiento. Estamos en una junta directiva discutiendo nuestras finanzas del Q2:<br/>\<data><br/>\{\{FINANCIALS\}\}<br/>\</data><br/><br/>Analiza tendencias clave, señala preocupaciones y recomienda acciones estratégicas. Nuestros inversores quieren crecimiento agresivo pero desconfían de nuestra tasa de quema. |
| Asistente | Miembros de la junta, aquí está mi análisis de nuestras finanzas del Q2:<br/><br/>1. Ingresos (\$15.2M, +22% YoY):<br/>   - Insight: El crecimiento empresarial (+30%) está superando el crecimiento general.<br/>   - Alerta: El segmento de PYMES disminuyó 5%.<br/>   - Acción: Reasigna 20% del presupuesto de marketing de PYMES a ventas empresariales. Encarga al producto simplificar la incorporación de PYMES.<br/><br/>2. Márgenes (Bruto: 72%, +3% QoQ; EBITDA: 18%, -2% QoQ):<br/>   - Insight: Las optimizaciones de infraestructura mejoraron los márgenes brutos.<br/>   - Alerta: El gasto en I+D en características de IA afectó el EBITDA.<br/>   - Acción: Sin cambios. Nuestra hoja de ruta de IA es crítica para la retención empresarial.<br/><br/>3. Efectivo (\$4.1M OCF, \$28M reservas):<br/>   - Insight: 15 meses de pista a la tasa de quema actual.<br/>   - Alerta: CAC arriba 20%, erosionando LTV/CAC.<br/>   - Acción: Congela contrataciones no esenciales. Implementa análisis de embudo de ventas para reducir CAC 15% en Q3.<br/><br/>Postura Estratégica: Estamos navegando entre crecimiento y quema. El enfoque empresarial es nuestro motor de crecimiento—invierte allí. Pero vigila la rotación de PYMES; podría filtrarse hacia empresas. Nuestra apuesta de IA es sólida, pero debemos convertirla a ARR para Q4, o cortamos I+D 30%.<br/><br/>En resumen: Duplica el enfoque en empresas, simplifica PYMES, optimiza ventas y monetiza IA. ¿Preguntas? |

</section>

---

<CardGroup cols={3}>
  <Card title="Librería de prompts" icon="link" href="/docs/es/resources/prompt-library/library">
    Inspírate con una selección curada de prompts para varias tareas y casos de uso.
  </Card>
  <Card title="Tutorial de prompting de GitHub" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    Un tutorial lleno de ejemplos que cubre los conceptos de ingeniería de prompts encontrados en nuestros documentos.
  </Card>
  <Card title="Tutorial de prompting de Google Sheets" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    Una versión más ligera de nuestro tutorial de ingeniería de prompts a través de una hoja de cálculo interactiva.
  </Card>
</CardGroup>