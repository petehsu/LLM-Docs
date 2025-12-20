# Effort

Contrôlez le nombre de tokens que Claude utilise lors de la réponse avec le paramètre effort, en trouvant un équilibre entre la complétude de la réponse et l'efficacité des tokens.

---

Le paramètre effort vous permet de contrôler l'empressement de Claude à dépenser des tokens lors de la réponse aux demandes. Cela vous donne la possibilité de trouver un équilibre entre la complétude de la réponse et l'efficacité des tokens, le tout avec un seul modèle.

<Note>
  Le paramètre effort est actuellement en bêta et n'est pris en charge que par Claude Opus 4.5.

  Vous devez inclure l'[en-tête bêta](/docs/fr/api/beta-headers) `effort-2025-11-24` lors de l'utilisation de cette fonctionnalité.
</Note>

## Comment fonctionne l'effort

Par défaut, Claude utilise l'effort maximum—en dépensant autant de tokens que nécessaire pour le meilleur résultat possible. En abaissant le niveau d'effort, vous pouvez demander à Claude d'être plus conservateur avec l'utilisation des tokens, en optimisant pour la vitesse et le coût tout en acceptant une réduction de capacité.

<Tip>
Définir `effort` à `"high"` produit exactement le même comportement que d'omettre le paramètre `effort` entièrement.
</Tip>

Le paramètre effort affecte **tous les tokens** dans la réponse, y compris :

- Les réponses textuelles et les explications
- Les appels d'outils et les arguments de fonction
- La réflexion étendue (lorsqu'elle est activée)

Cette approche présente deux avantages majeurs :

1. Elle ne nécessite pas que la réflexion soit activée pour l'utiliser.
2. Elle peut affecter toutes les dépenses de tokens, y compris les appels d'outils. Par exemple, un effort inférieur signifierait que Claude effectue moins d'appels d'outils. Cela donne un bien plus grand degré de contrôle sur l'efficacité.

### Niveaux d'effort

| Niveau   | Description                                                                                                                      | Cas d'usage typique                                                                   |
| -------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `high`   | Capacité maximale. Claude utilise autant de tokens que nécessaire pour le meilleur résultat possible. Équivalent à ne pas définir le paramètre.  | Raisonnement complexe, problèmes de codage difficiles, tâches agentiques                           |
| `medium` | Approche équilibrée avec des économies de tokens modérées. | Tâches agentiques qui nécessitent un équilibre entre la vitesse, le coût et les performances                                                         |
| `low`    | Plus efficace. Économies de tokens importantes avec une réduction de capacité. | Tâches plus simples qui nécessitent la meilleure vitesse et les coûts les plus bas, comme les sous-agents                     |

## Utilisation de base

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-opus-4-5-20251101",
    betas=["effort-2025-11-24"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Analyze the trade-offs between microservices and monolithic architectures"
    }],
    output_config={
        "effort": "medium"
    }
)

print(response.content[0].text)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.beta.messages.create({
  model: "claude-opus-4-5-20251101",
  betas: ["effort-2025-11-24"],
  max_tokens: 4096,
  messages: [{
    role: "user",
    content: "Analyze the trade-offs between microservices and monolithic architectures"
  }],
  output_config: {
    effort: "medium"
  }
});

console.log(response.content[0].text);
```

```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: effort-2025-11-24" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-opus-4-5-20251101",
        "max_tokens": 4096,
        "messages": [{
            "role": "user",
            "content": "Analyze the trade-offs between microservices and monolithic architectures"
        }],
        "output_config": {
            "effort": "medium"
        }
    }'
```

</CodeGroup>

## Quand dois-je ajuster le paramètre effort ?

- Utilisez **high effort** (la valeur par défaut) lorsque vous avez besoin du meilleur travail de Claude—raisonnement complexe, analyse nuancée, problèmes de codage difficiles, ou toute tâche où la qualité est la priorité absolue.
- Utilisez **medium effort** comme option équilibrée lorsque vous voulez une performance solide sans la dépense complète de tokens de l'effort élevé.
- Utilisez **low effort** lorsque vous optimisez pour la vitesse (parce que Claude répond avec moins de tokens) ou le coût—par exemple, des tâches de classification simples, des recherches rapides, ou des cas d'usage à haut volume où les améliorations marginales de qualité ne justifient pas une latence ou une dépense supplémentaire.

## Effort avec l'utilisation d'outils

Lors de l'utilisation d'outils, le paramètre effort affecte à la fois les explications autour des appels d'outils et les appels d'outils eux-mêmes. Les niveaux d'effort inférieur ont tendance à :

- Combiner plusieurs opérations en moins d'appels d'outils
- Effectuer moins d'appels d'outils
- Procéder directement à l'action sans préambule
- Utiliser des messages de confirmation brefs après l'achèvement

Les niveaux d'effort supérieur peuvent :

- Effectuer plus d'appels d'outils
- Expliquer le plan avant de passer à l'action
- Fournir des résumés détaillés des modifications
- Inclure des commentaires de code plus complets

## Effort avec la réflexion étendue

Le paramètre effort fonctionne aux côtés du budget de tokens de réflexion lorsque la réflexion étendue est activée. Ces deux contrôles servent des objectifs différents :

- **Paramètre effort** : Contrôle la façon dont Claude dépense tous les tokens—y compris les tokens de réflexion, les réponses textuelles et les appels d'outils
- **Budget de tokens de réflexion** : Définit une limite maximale sur les tokens de réflexion spécifiquement

Le paramètre effort peut être utilisé avec ou sans la réflexion étendue activée. Lorsque les deux sont configurés :

1. Déterminez d'abord le niveau d'effort approprié pour votre tâche
2. Puis définissez le budget de tokens de réflexion en fonction de la complexité de la tâche

Pour les meilleures performances sur les tâches de raisonnement complexe, utilisez l'effort élevé (la valeur par défaut) avec un budget de tokens de réflexion élevé. Cela permet à Claude de réfléchir en profondeur et de fournir des réponses complètes.

## Meilleures pratiques

1. **Commencez par high** : Utilisez des niveaux d'effort inférieur pour troquer les performances contre l'efficacité des tokens.
2. **Utilisez low pour les tâches sensibles à la latence ou simples** : Lorsque la latence est importante ou que les tâches sont simples, l'effort faible peut réduire considérablement les temps de réponse et les coûts.
3. **Testez votre cas d'usage** : L'impact des niveaux d'effort varie selon le type de tâche. Évaluez les performances sur vos cas d'usage spécifiques avant de déployer.
4. **Considérez l'effort dynamique** : Ajustez l'effort en fonction de la complexité de la tâche. Les requêtes simples peuvent justifier un effort faible tandis que le codage agentique et le raisonnement complexe bénéficient d'un effort élevé.