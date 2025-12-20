# Elegir el modelo correcto

Seleccionar el modelo Claude óptimo para tu aplicación implica equilibrar tres consideraciones clave: capacidades, velocidad y costo. Esta guía te ayuda a tomar una decisión informada basada en tus requisitos específicos.

---

## Establecer criterios clave

Al elegir un modelo Claude, recomendamos evaluar primero estos factores:
- **Capacidades:** ¿Qué características o capacidades específicas necesitará el modelo para cumplir con tus necesidades?
- **Velocidad:** ¿Con qué rapidez necesita responder el modelo en tu aplicación?
- **Costo:** ¿Cuál es tu presupuesto tanto para desarrollo como para uso en producción?

Conocer estas respuestas de antemano hará que sea mucho más fácil reducir las opciones y decidir qué modelo usar.

***

## Elige el mejor modelo para comenzar

Hay dos enfoques generales que puedes usar para comenzar a probar qué modelo Claude funciona mejor para tus necesidades.

### Opción 1: Comenzar con un modelo rápido y rentable

Para muchas aplicaciones, comenzar con un modelo más rápido y rentable como Claude Haiku 4.5 puede ser el enfoque óptimo:

1. Comienza la implementación con Claude Haiku 4.5
2. Prueba tu caso de uso a fondo
3. Evalúa si el rendimiento cumple con tus requisitos
4. Actualiza solo si es necesario para brechas de capacidad específicas

Este enfoque permite una iteración rápida, costos de desarrollo más bajos y a menudo es suficiente para muchas aplicaciones comunes. Este enfoque es mejor para:
- Prototipado e desarrollo inicial
- Aplicaciones con requisitos de latencia ajustados
- Implementaciones sensibles al costo
- Tareas de alto volumen y directas

### Opción 2: Comenzar con el modelo más capaz

Para tareas complejas donde la inteligencia y las capacidades avanzadas son primordiales, es posible que desees comenzar con el modelo más capaz y luego considerar optimizar a modelos más eficientes más adelante:

1. Implementa con Claude Sonnet 4.5
2. Optimiza tus indicaciones para estos modelos
3. Evalúa si el rendimiento cumple con tus requisitos
4. Considera aumentar la eficiencia degradando la inteligencia con el tiempo con mayor optimización del flujo de trabajo

Este enfoque es mejor para:
- Tareas de razonamiento complejo
- Aplicaciones científicas o matemáticas
- Tareas que requieren comprensión matizada
- Aplicaciones donde la precisión supera las consideraciones de costo
- Codificación avanzada

## Matriz de selección de modelos

| Cuando necesitas... | Recomendamos comenzar con... | Casos de uso de ejemplo |
|------------------|-------------------|-------------------|
| Mejor modelo para agentes complejos y codificación, inteligencia más alta en la mayoría de tareas, orquestación superior de herramientas para tareas autónomas de larga duración | Claude Sonnet 4.5 | Agentes de codificación autónoma, automatización de ciberseguridad, análisis financiero complejo, tareas de investigación de varias horas, marcos de múltiples agentes |
| Inteligencia máxima con rendimiento práctico para tareas especializadas complejas | Claude Opus 4.5 | Ingeniería de software profesional, agentes avanzados para tareas de oficina, uso de computadora y navegador a escala, aplicaciones de visión de cambio de paso |
| Inteligencia y razonamiento excepcionales para tareas especializadas complejas | Claude Opus 4.1 | Refactorización de base de código altamente compleja, escritura creativa matizada, análisis científico especializado |
| Rendimiento casi fronterizo con velocidad ultrarrápida y pensamiento extendido - nuestro modelo Haiku más rápido e inteligente al precio más económico | Claude Haiku 4.5 | Aplicaciones en tiempo real, procesamiento inteligente de alto volumen, implementaciones sensibles al costo que requieren razonamiento sólido, tareas de subagentos |

***

## Decide si actualizar o cambiar modelos

Para determinar si necesitas actualizar o cambiar modelos, debes:
1. [Crear pruebas de referencia](/docs/es/test-and-evaluate/develop-tests) específicas para tu caso de uso - tener un buen conjunto de evaluación es el paso más importante en el proceso
2. Probar con tus indicaciones y datos reales
3. Comparar el rendimiento entre modelos para:
   - Precisión de respuestas
   - Calidad de respuesta
   - Manejo de casos extremos
4. Sopesar los compromisos de rendimiento y costo

## Próximos pasos

<CardGroup cols={3}>
  <Card title="Gráfico de comparación de modelos" icon="settings" href="/docs/es/about-claude/models/overview">
    Ver especificaciones detalladas y precios para los últimos modelos Claude
  </Card>
  <Card title="Novedades en Claude 4.5" icon="sparkle" href="/docs/es/about-claude/models/whats-new-claude-4-5">
    Explora las últimas mejoras en los modelos Claude 4.5
  </Card>
  <Card title="Comienza a construir" icon="code" href="/docs/es/get-started">
    Comienza con tu primera llamada API
  </Card>
</CardGroup>