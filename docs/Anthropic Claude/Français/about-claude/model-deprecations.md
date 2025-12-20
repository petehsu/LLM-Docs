# Dépréciations de modèles

Informations sur les dépréciations de modèles Anthropic, les remplacements recommandés et les dates de retrait.

---

À mesure que nous lançons des modèles plus sûrs et plus performants, nous retirons régulièrement les anciens modèles. Les applications qui dépendent des modèles Anthropic peuvent nécessiter des mises à jour occasionnelles pour continuer à fonctionner. Les clients concernés seront toujours notifiés par e-mail et dans notre documentation.

Cette page répertorie toutes les dépréciations d'API, ainsi que les remplacements recommandés.

## Aperçu

Anthropic utilise les termes suivants pour décrire le cycle de vie de nos modèles :
- **Actif** : Le modèle est entièrement pris en charge et recommandé pour une utilisation.
- **Hérité** : Le modèle ne recevra plus de mises à jour et peut être déprécié à l'avenir.
- **Déprécié** : Le modèle n'est plus disponible pour les nouveaux clients mais reste disponible pour les utilisateurs existants jusqu'au retrait. Nous attribuons une date de retrait à ce stade.
- **Retiré** : Le modèle n'est plus disponible pour une utilisation. Les demandes aux modèles retirés échoueront.

<Warning>
Veuillez noter que les modèles dépréciés sont susceptibles d'être moins fiables que les modèles actifs. Nous vous exhortons à migrer vos charges de travail vers des modèles actifs pour maintenir le plus haut niveau de support et de fiabilité.
</Warning>

## Migration vers les remplacements

Une fois qu'un modèle est déprécié, veuillez migrer toute utilisation vers un remplacement approprié avant la date de retrait. Les demandes aux modèles après la date de retrait échoueront.

Pour vous aider à mesurer les performances des modèles de remplacement sur vos tâches, nous recommandons des tests approfondis de vos applications avec les nouveaux modèles bien avant la date de retrait.

Pour des instructions spécifiques sur la migration de Claude 3.7 vers les modèles Claude 4.5, consultez [Migration vers Claude 4.5](/docs/fr/about-claude/models/migrating-to-claude-4).

## Notifications

Anthropic notifie les clients ayant des déploiements actifs pour les modèles avec des retraits à venir. Nous fournissons au moins 60 jours de préavis avant le retrait du modèle pour les modèles publiquement disponibles.

## Audit de l'utilisation des modèles

Pour aider à identifier l'utilisation de modèles dépréciés, les clients peuvent accéder à un audit de leur utilisation d'API. Suivez ces étapes :

1. Allez à la page [Utilisation](/settings/usage) dans Console
2. Cliquez sur le bouton « Exporter »
3. Examinez le CSV téléchargé pour voir l'utilisation ventilée par clé API et modèle

Cet audit vous aidera à localiser les instances où votre application utilise toujours des modèles dépréciés, vous permettant de prioriser les mises à jour vers les modèles plus récents avant la date de retrait.

## Bonnes pratiques

1. Vérifiez régulièrement notre documentation pour les mises à jour sur les dépréciations de modèles.
2. Testez vos applications avec les modèles plus récents bien avant la date de retrait de votre modèle actuel.
3. Mettez à jour votre code pour utiliser le modèle de remplacement recommandé dès que possible.
4. Contactez notre équipe d'assistance si vous avez besoin d'aide pour la migration ou si vous avez des questions.

## Inconvénients de la dépréciation et atténuations

Nous dépréciions actuellement et retirons les modèles pour assurer la capacité des nouvelles versions de modèles. Nous reconnaissons que cela comporte des inconvénients :
- Les utilisateurs qui apprécient des modèles spécifiques doivent migrer vers de nouvelles versions
- Les chercheurs perdent l'accès aux modèles pour les études en cours et comparatives
- Le retrait du modèle introduit des risques liés à la sécurité et au bien-être du modèle

À un moment donné, nous espérons rendre les modèles passés à nouveau disponibles publiquement. En attendant, nous nous sommes engagés à la préservation à long terme des poids des modèles et à d'autres mesures pour aider à atténuer ces impacts. Pour plus de détails, consultez [Engagements sur la dépréciation et la préservation des modèles](https://www.anthropic.com/research/deprecation-commitments).

## État du modèle

Tous les modèles publiquement disponibles sont répertoriés ci-dessous avec leur état :

| Nom du modèle API           | État actuel         | Déprécié          | Date de retrait provisoire |
|:----------------------------|:--------------------|:------------------|:-------------------------|
| `claude-3-opus-20240229`    | Déprécié            | 30 juin 2025      | 5 janvier 2026           |
| `claude-3-haiku-20240307`   | Actif               | N/A               | Pas avant le 7 mars 2025 |
| `claude-3-5-haiku-20241022` | Actif               | N/A               | Pas avant le 22 octobre 2025 |
| `claude-3-7-sonnet-20250219`| Déprécié            | 28 octobre 2025   | 19 février 2026          |
| `claude-sonnet-4-20250514`  | Actif               | N/A               | Pas avant le 14 mai 2026 |
| `claude-opus-4-20250514`    | Actif               | N/A               | Pas avant le 14 mai 2026 |
| `claude-opus-4-1-20250805`  | Actif               | N/A               | Pas avant le 5 août 2026 |
| `claude-sonnet-4-5-20250929`| Actif               | N/A               | Pas avant le 29 septembre 2026 |
| `claude-haiku-4-5-20251001` | Actif               | N/A               | Pas avant le 15 octobre 2026 |
| `claude-opus-4-5-20251101`  | Actif               | N/A               | Pas avant le 24 novembre 2026 |

## Historique des dépréciations

Toutes les dépréciations sont répertoriées ci-dessous, avec les annonces les plus récentes en haut.

### 2025-10-28 : Modèle Claude Sonnet 3.7

Le 28 octobre 2025, nous avons notifié les développeurs utilisant le modèle Claude Sonnet 3.7 de son prochain retrait sur l'API Claude.

| Date de retrait             | Modèle déprécié             | Remplacement recommandé      |
|:----------------------------|:----------------------------|:--------------------------------|
| 19 février 2026             | `claude-3-7-sonnet-20250219`| `claude-sonnet-4-5-20250929`     |

### 2025-08-13 : Modèles Claude Sonnet 3.5

<Note>
Ces modèles ont été retirés le 28 octobre 2025.
</Note>

Le 13 août 2025, nous avons notifié les développeurs utilisant les modèles Claude Sonnet 3.5 de leur prochain retrait.

| Date de retrait             | Modèle déprécié             | Remplacement recommandé      |
|:----------------------------|:----------------------------|:--------------------------------|
| 28 octobre 2025             | `claude-3-5-sonnet-20240620`| `claude-sonnet-4-5-20250929`     |
| 28 octobre 2025             | `claude-3-5-sonnet-20241022`| `claude-sonnet-4-5-20250929`     |

### 2025-06-30 : Modèle Claude Opus 3

Le 30 juin 2025, nous avons notifié les développeurs utilisant le modèle Claude Opus 3 de son prochain retrait.

| Date de retrait             | Modèle déprécié             | Remplacement recommandé      |
|:----------------------------|:----------------------------|:--------------------------------|
| 5 janvier 2026              | `claude-3-opus-20240229`    | `claude-opus-4-1-20250805`      |

### 2025-01-21 : Modèles Claude 2, Claude 2.1 et Claude Sonnet 3

<Note>
Ces modèles ont été retirés le 21 juillet 2025.
</Note>

Le 21 janvier 2025, nous avons notifié les développeurs utilisant les modèles Claude 2, Claude 2.1 et Claude Sonnet 3 de leurs prochains retraits.

| Date de retrait             | Modèle déprécié             | Remplacement recommandé      |
|:----------------------------|:----------------------------|:--------------------------------|
| 21 juillet 2025             | `claude-2.0`                | `claude-sonnet-4-5-20250929`      |
| 21 juillet 2025             | `claude-2.1`                | `claude-sonnet-4-5-20250929`      |
| 21 juillet 2025             | `claude-3-sonnet-20240229`  | `claude-sonnet-4-5-20250929`      |

### 2024-09-04 : Modèles Claude 1 et Instant

<Note>
Ces modèles ont été retirés le 6 novembre 2024.
</Note>

Le 4 septembre 2024, nous avons notifié les développeurs utilisant les modèles Claude 1 et Instant de leurs prochains retraits.

| Date de retrait             | Modèle déprécié           | Remplacement recommandé    |
|:----------------------------|:--------------------------|:---------------------------|
| 6 novembre 2024             | `claude-1.0`              | `claude-3-5-haiku-20241022`|
| 6 novembre 2024             | `claude-1.1`              | `claude-3-5-haiku-20241022`|
| 6 novembre 2024             | `claude-1.2`              | `claude-3-5-haiku-20241022`|
| 6 novembre 2024             | `claude-1.3`              | `claude-3-5-haiku-20241022`|
| 6 novembre 2024             | `claude-instant-1.0`      | `claude-3-5-haiku-20241022`|
| 6 novembre 2024             | `claude-instant-1.1`      | `claude-3-5-haiku-20241022`|
| 6 novembre 2024             | `claude-instant-1.2`      | `claude-3-5-haiku-20241022`|