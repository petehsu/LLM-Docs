# Deprecaciones de modelos

Información sobre deprecaciones de modelos de Anthropic, fechas de retiro y modelos de reemplazo recomendados.

---

A medida que lanzamos modelos más seguros y capaces, retiramos regularmente modelos más antiguos. Las aplicaciones que dependen de modelos de Anthropic pueden necesitar actualizaciones ocasionales para seguir funcionando. Los clientes afectados siempre serán notificados por correo electrónico y en nuestra documentación.

Esta página enumera todas las deprecaciones de API, junto con los reemplazos recomendados.

## Descripción general

Anthropic utiliza los siguientes términos para describir el ciclo de vida de nuestros modelos:
- **Activo**: El modelo es totalmente compatible y se recomienda su uso.
- **Heredado**: El modelo ya no recibirá actualizaciones y puede ser deprecado en el futuro.
- **Deprecado**: El modelo ya no está disponible para nuevos clientes pero continúa estando disponible para usuarios existentes hasta su retiro. Asignamos una fecha de retiro en este punto.
- **Retirado**: El modelo ya no está disponible para su uso. Las solicitudes a modelos retirados fallarán.

<Warning>
Tenga en cuenta que los modelos deprecados probablemente sean menos confiables que los modelos activos. Le instamos a que traslade las cargas de trabajo a modelos activos para mantener el nivel más alto de soporte y confiabilidad.
</Warning>

## Migración a reemplazos

Una vez que un modelo es deprecado, migre todo el uso a un reemplazo adecuado antes de la fecha de retiro. Las solicitudes a modelos posteriores a la fecha de retiro fallarán.

Para ayudar a medir el rendimiento de los modelos de reemplazo en sus tareas, recomendamos pruebas exhaustivas de sus aplicaciones con los nuevos modelos bien antes de la fecha de retiro.

Para obtener instrucciones específicas sobre la migración de Claude 3.7 a modelos Claude 4.5, consulte [Migración a Claude 4.5](/docs/es/about-claude/models/migrating-to-claude-4).

## Notificaciones

Anthropic notifica a los clientes con implementaciones activas para modelos con retiros próximos. Proporcionamos al menos 60 días de aviso antes del retiro del modelo para modelos lanzados públicamente.

## Auditoría del uso del modelo

Para ayudar a identificar el uso de modelos deprecados, los clientes pueden acceder a una auditoría de su uso de API. Siga estos pasos:

1. Vaya a la página [Uso](/settings/usage) en Console
2. Haga clic en el botón "Exportar"
3. Revise el CSV descargado para ver el uso desglosado por clave de API y modelo

Esta auditoría le ayudará a localizar cualquier instancia donde su aplicación aún esté utilizando modelos deprecados, permitiéndole priorizar actualizaciones a modelos más nuevos antes de la fecha de retiro.

## Mejores prácticas

1. Revise regularmente nuestra documentación para obtener actualizaciones sobre deprecaciones de modelos.
2. Pruebe sus aplicaciones con modelos más nuevos bien antes de la fecha de retiro de su modelo actual.
3. Actualice su código para usar el modelo de reemplazo recomendado lo antes posible.
4. Póngase en contacto con nuestro equipo de soporte si necesita ayuda con la migración o tiene alguna pregunta.

## Desventajas de la deprecación y mitigaciones

Actualmente deprecamos y retiramos modelos para garantizar capacidad para nuevos lanzamientos de modelos. Reconocemos que esto tiene desventajas:
- Los usuarios que valoran modelos específicos deben migrar a nuevas versiones
- Los investigadores pierden acceso a modelos para estudios continuos y comparativos
- El retiro del modelo introduce riesgos relacionados con la seguridad y el bienestar del modelo

En algún momento, esperamos volver a poner los modelos anteriores a disposición del público. Mientras tanto, nos hemos comprometido a la preservación a largo plazo de los pesos del modelo y otras medidas para ayudar a mitigar estos impactos. Para más detalles, consulte [Compromisos sobre Deprecación y Preservación de Modelos](https://www.anthropic.com/research/deprecation-commitments).

## Estado del modelo

Todos los modelos lanzados públicamente se enumeran a continuación con su estado:

| Nombre del Modelo API       | Estado Actual       | Deprecado         | Fecha de Retiro Tentativa |
|:----------------------------|:--------------------|:------------------|:-------------------------|
| `claude-3-opus-20240229`    | Deprecado           | 30 de junio de 2025     | 5 de enero de 2026          |
| `claude-3-haiku-20240307`   | Activo              | N/A               | No antes del 7 de marzo de 2025 |
| `claude-3-5-haiku-20241022` | Activo              | N/A               | No antes del 22 de octubre de 2025 |
| `claude-3-7-sonnet-20250219`| Deprecado           | 28 de octubre de 2025  | 19 de febrero de 2026          |
| `claude-sonnet-4-20250514`  | Activo              | N/A               | No antes del 14 de mayo de 2026 |
| `claude-opus-4-20250514`    | Activo              | N/A               | No antes del 14 de mayo de 2026 |
| `claude-opus-4-1-20250805`  | Activo              | N/A               | No antes del 5 de agosto de 2026 |
| `claude-sonnet-4-5-20250929`| Activo              | N/A               | No antes del 29 de septiembre de 2026 |
| `claude-haiku-4-5-20251001` | Activo              | N/A               | No antes del 15 de octubre de 2026 |
| `claude-opus-4-5-20251101`  | Activo              | N/A               | No antes del 24 de noviembre de 2026 |

## Historial de deprecación

Todas las deprecaciones se enumeran a continuación, con los anuncios más recientes en la parte superior.

### 2025-10-28: Modelo Claude Sonnet 3.7

El 28 de octubre de 2025, notificamos a los desarrolladores que utilizan el modelo Claude Sonnet 3.7 sobre su próximo retiro en la API de Claude.

| Fecha de Retiro             | Modelo Deprecado            | Reemplazo Recomendado         |
|:----------------------------|:----------------------------|:--------------------------------|
| 19 de febrero de 2026           | `claude-3-7-sonnet-20250219`| `claude-sonnet-4-5-20250929`     |

### 2025-08-13: Modelos Claude Sonnet 3.5

<Note>
Estos modelos fueron retirados el 28 de octubre de 2025.
</Note>

El 13 de agosto de 2025, notificamos a los desarrolladores que utilizan modelos Claude Sonnet 3.5 sobre su próximo retiro.

| Fecha de Retiro             | Modelo Deprecado            | Reemplazo Recomendado         |
|:----------------------------|:----------------------------|:--------------------------------|
| 28 de octubre de 2025            | `claude-3-5-sonnet-20240620`| `claude-sonnet-4-5-20250929`     |
| 28 de octubre de 2025            | `claude-3-5-sonnet-20241022`| `claude-sonnet-4-5-20250929`     |

### 2025-06-30: Modelo Claude Opus 3

El 30 de junio de 2025, notificamos a los desarrolladores que utilizan el modelo Claude Opus 3 sobre su próximo retiro.

| Fecha de Retiro             | Modelo Deprecado            | Reemplazo Recomendado         |
|:----------------------------|:----------------------------|:--------------------------------|
| 5 de enero de 2026             | `claude-3-opus-20240229`    | `claude-opus-4-1-20250805`      |

### 2025-01-21: Modelos Claude 2, Claude 2.1 y Claude Sonnet 3

<Note>
Estos modelos fueron retirados el 21 de julio de 2025.
</Note>

El 21 de enero de 2025, notificamos a los desarrolladores que utilizan modelos Claude 2, Claude 2.1 y Claude Sonnet 3 sobre sus próximos retiros.

| Fecha de Retiro             | Modelo Deprecado            | Reemplazo Recomendado         |
|:----------------------------|:----------------------------|:--------------------------------|
| 21 de julio de 2025               | `claude-2.0`                | `claude-sonnet-4-5-20250929`      |
| 21 de julio de 2025               | `claude-2.1`                | `claude-sonnet-4-5-20250929`      |
| 21 de julio de 2025               | `claude-3-sonnet-20240229`  | `claude-sonnet-4-5-20250929`      |

### 2024-09-04: Modelos Claude 1 e Instant

<Note>
Estos modelos fueron retirados el 6 de noviembre de 2024.
</Note>

El 4 de septiembre de 2024, notificamos a los desarrolladores que utilizan modelos Claude 1 e Instant sobre sus próximos retiros.

| Fecha de Retiro             | Modelo Deprecado          | Reemplazo Recomendado    |
|:----------------------------|:--------------------------|:---------------------------|
| 6 de noviembre de 2024            | `claude-1.0`              | `claude-3-5-haiku-20241022`|
| 6 de noviembre de 2024            | `claude-1.1`              | `claude-3-5-haiku-20241022`|
| 6 de noviembre de 2024            | `claude-1.2`              | `claude-3-5-haiku-20241022`|
| 6 de noviembre de 2024            | `claude-1.3`              | `claude-3-5-haiku-20241022`|
| 6 de noviembre de 2024            | `claude-instant-1.0`      | `claude-3-5-haiku-20241022`|
| 6 de noviembre de 2024            | `claude-instant-1.1`      | `claude-3-5-haiku-20241022`|
| 6 de noviembre de 2024            | `claude-instant-1.2`      | `claude-3-5-haiku-20241022`|