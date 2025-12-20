# Réduction de la latence

Guide pour réduire la latence lors de l'utilisation des modèles Claude

---

La latence fait référence au temps nécessaire au modèle pour traiter une invite et générer une sortie. La latence peut être influencée par divers facteurs, tels que la taille du modèle, la complexité de l'invite et l'infrastructure sous-jacente supportant le modèle et le point d'interaction.

<Note>
Il est toujours préférable d'abord d'ingénier une invite qui fonctionne bien sans contraintes de modèle ou d'invite, puis d'essayer les stratégies de réduction de latence par la suite. Essayer de réduire la latence prématurément pourrait vous empêcher de découvrir à quoi ressemble une performance optimale.
</Note>

---

## Comment mesurer la latence

Lorsque vous discutez de latence, vous pouvez rencontrer plusieurs termes et mesures :

- **Latence de base** : C'est le temps pris par le modèle pour traiter l'invite et générer la réponse, sans considérer les jetons d'entrée et de sortie par seconde. Cela fournit une idée générale de la vitesse du modèle.
- **Temps jusqu'au premier jeton (TTFT)** : Cette métrique mesure le temps nécessaire au modèle pour générer le premier jeton de la réponse, à partir du moment où l'invite a été envoyée. C'est particulièrement pertinent lorsque vous utilisez le streaming (plus d'informations à ce sujet plus tard) et que vous voulez fournir une expérience réactive à vos utilisateurs.

Pour une compréhension plus approfondie de ces termes, consultez notre [glossaire](/docs/fr/about-claude/glossary).

---

## Comment réduire la latence

### 1. Choisir le bon modèle

L'une des façons les plus directes de réduire la latence est de sélectionner le modèle approprié pour votre cas d'usage. Anthropic offre une [gamme de modèles](/docs/fr/about-claude/models/overview) avec différentes capacités et caractéristiques de performance. Considérez vos exigences spécifiques et choisissez le modèle qui correspond le mieux à vos besoins en termes de vitesse et de qualité de sortie.

Pour les applications critiques en vitesse, **Claude Haiku 4.5** offre les temps de réponse les plus rapides tout en maintenant une intelligence élevée :

```python
import anthropic

client = anthropic.Anthropic()

# Pour les applications sensibles au temps, utilisez Claude Haiku 4.5
message = client.messages.create(
    model="claude-haiku-4-5",
    max_tokens=100,
    messages=[{
        "role": "user",
        "content": "Résumez ce retour client en 2 phrases : [texte du retour]"
    }]
)
```

Pour plus de détails sur les métriques des modèles, consultez notre page [aperçu des modèles](/docs/fr/about-claude/models/overview).

### 2. Optimiser la longueur de l'invite et de la sortie

Minimisez le nombre de jetons dans votre invite d'entrée et la sortie attendue, tout en maintenant une performance élevée. Moins le modèle a de jetons à traiter et générer, plus la réponse sera rapide.

Voici quelques conseils pour vous aider à optimiser vos invites et sorties :

- **Soyez clair mais concis** : Visez à transmettre votre intention clairement et de manière concise dans l'invite. Évitez les détails inutiles ou les informations redondantes, tout en gardant à l'esprit que [claude manque de contexte](/docs/fr/build-with-claude/prompt-engineering/be-clear-and-direct) sur votre cas d'usage et pourrait ne pas faire les bonds logiques prévus si les instructions ne sont pas claires.
- **Demandez des réponses plus courtes** : Demandez directement à Claude d'être concis. La famille de modèles Claude 3 a une dirigeabilité améliorée par rapport aux générations précédentes. Si Claude produit une longueur non désirée, demandez à Claude de [freiner son bavardage](/docs/fr/build-with-claude/prompt-engineering/be-clear-and-direct).
  <Tip> En raison de la façon dont les LLM comptent les [jetons](/docs/fr/about-claude/glossary#tokens) au lieu des mots, demander un nombre exact de mots ou une limite de nombre de mots n'est pas une stratégie aussi efficace que de demander des limites de nombre de paragraphes ou de phrases.</Tip>
- **Définissez des limites de sortie appropriées** : Utilisez le paramètre `max_tokens` pour définir une limite stricte sur la longueur maximale de la réponse générée. Cela empêche Claude de générer des sorties trop longues.
  > **Note** : Lorsque la réponse atteint `max_tokens` jetons, la réponse sera coupée, peut-être au milieu d'une phrase ou d'un mot, donc c'est une technique brutale qui peut nécessiter un post-traitement et est généralement plus appropriée pour les réponses à choix multiples ou courtes où la réponse vient directement au début.
- **Expérimentez avec la température** : Le [paramètre](/docs/fr/api/messages) `temperature` contrôle le caractère aléatoire de la sortie. Des valeurs plus basses (par exemple, 0,2) peuvent parfois conduire à des réponses plus ciblées et plus courtes, tandis que des valeurs plus élevées (par exemple, 0,8) peuvent résulter en des sorties plus diverses mais potentiellement plus longues.

Trouver le bon équilibre entre la clarté de l'invite, la qualité de la sortie et le nombre de jetons peut nécessiter quelques expérimentations.

### 3. Tirer parti du streaming

Le streaming est une fonctionnalité qui permet au modèle de commencer à renvoyer sa réponse avant que la sortie complète soit terminée. Cela peut considérablement améliorer la réactivité perçue de votre application, car les utilisateurs peuvent voir la sortie du modèle en temps réel.

Avec le streaming activé, vous pouvez traiter la sortie du modèle au fur et à mesure qu'elle arrive, en mettant à jour votre interface utilisateur ou en effectuant d'autres tâches en parallèle. Cela peut grandement améliorer l'expérience utilisateur et rendre votre application plus interactive et réactive.

Visitez [streaming Messages](/docs/fr/build-with-claude/streaming) pour apprendre comment vous pouvez implémenter le streaming pour votre cas d'usage.