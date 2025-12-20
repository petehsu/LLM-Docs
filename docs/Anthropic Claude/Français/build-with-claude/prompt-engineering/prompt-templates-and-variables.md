# Utiliser des modèles de prompts et des variables

---

Lors du déploiement d'une application basée sur un LLM avec Claude, vos appels API consisteront généralement en deux types de contenu :
- **Contenu fixe :** Instructions statiques ou contexte qui restent constants à travers plusieurs interactions
- **Contenu variable :** Éléments dynamiques qui changent à chaque requête ou conversation, tels que :
    - Entrées utilisateur
    - Contenu récupéré pour la Génération Augmentée par Récupération (RAG)
    - Contexte de conversation tel que l'historique du compte utilisateur
    - Données générées par le système telles que les résultats d'utilisation d'outils alimentés par d'autres appels indépendants à Claude

Un **modèle de prompt** combine ces parties fixes et variables, en utilisant des espaces réservés pour le contenu dynamique. Dans la [Console Claude](/), ces espaces réservés sont désignés par **\{\{doubles crochets\}\}**, les rendant facilement identifiables et permettant un test rapide de différentes valeurs.

---

# Quand utiliser des modèles de prompts et des variables
Vous devriez toujours utiliser des modèles de prompts et des variables lorsque vous vous attendez à ce qu'une partie de votre prompt soit répétée dans un autre appel à Claude (uniquement via l'API ou la [Console Claude](/). [claude.ai](https://claude.ai/) ne prend actuellement pas en charge les modèles de prompts ou les variables).

Les modèles de prompts offrent plusieurs avantages :
- **Cohérence :** Assurer une structure cohérente pour vos prompts à travers plusieurs interactions
- **Efficacité :** Échanger facilement le contenu variable sans réécrire l'ensemble du prompt
- **Testabilité :** Tester rapidement différentes entrées et cas limites en ne changeant que la partie variable
- **Évolutivité :** Simplifier la gestion des prompts à mesure que votre application gagne en complexité
- **Contrôle de version :** Suivre facilement les changements de votre structure de prompt au fil du temps en ne gardant un œil que sur la partie centrale de votre prompt, séparée des entrées dynamiques

La [Console Claude](/) utilise largement les modèles de prompts et les variables afin de prendre en charge les fonctionnalités et outils pour tout ce qui précède, comme avec :
- **[Générateur de prompts](/docs/fr/build-with-claude/prompt-engineering/prompt-generator) :** Décide quelles variables votre prompt nécessite et les inclut dans le modèle qu'il produit
- **[Améliorateur de prompts](/docs/fr/build-with-claude/prompt-engineering/prompt-improver) :** Prend votre modèle existant, y compris toutes les variables, et les maintient dans le modèle amélioré qu'il produit
- **[Outil d'évaluation](/docs/fr/test-and-evaluate/eval-tool) :** Vous permet de tester, mettre à l'échelle et suivre facilement les versions de vos prompts en séparant les parties variables et fixes de votre modèle de prompt

---

# Exemple de modèle de prompt

Considérons une application simple qui traduit du texte anglais vers l'espagnol. Le texte traduit serait variable puisque vous vous attendriez à ce que ce texte change entre les utilisateurs ou les appels à Claude. Ce texte traduit pourrait être récupéré dynamiquement depuis des bases de données ou l'entrée de l'utilisateur.

Ainsi, pour votre application de traduction, vous pourriez utiliser ce modèle de prompt simple :
```
Traduisez ce texte de l'anglais vers l'espagnol : {{text}}
```

---

## Prochaines étapes

<CardGroup cols={2}>
  <Card title="Générer un prompt" icon="link" href="/docs/fr/build-with-claude/prompt-engineering/prompt-generator">
    Apprenez-en plus sur le générateur de prompts dans la Console Claude et essayez de faire générer un prompt par Claude.
  </Card>
  <Card title="Appliquer des balises XML" icon="link" href="/docs/fr/build-with-claude/prompt-engineering/use-xml-tags">
    Si vous voulez améliorer votre jeu de variables de prompt, enveloppez-les dans des balises XML.
  </Card>
  <Card title="Console Claude" icon="link" href="/">
    Découvrez la myriade d'outils de développement de prompts disponibles dans la Console Claude.
  </Card>
</CardGroup>