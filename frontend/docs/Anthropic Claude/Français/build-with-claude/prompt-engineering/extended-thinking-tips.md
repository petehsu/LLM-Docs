# Conseils pour la réflexion étendue

---

Ce guide fournit des stratégies et techniques avancées pour tirer le meilleur parti des fonctionnalités de réflexion étendue de Claude. La réflexion étendue permet à Claude de résoudre des problèmes complexes étape par étape, améliorant les performances sur les tâches difficiles.

Voir [Modèles de réflexion étendue](/docs/fr/about-claude/models/extended-thinking-models) pour des conseils sur quand utiliser la réflexion étendue.

## Avant de commencer

Ce guide présuppose que vous avez déjà décidé d'utiliser le mode de réflexion étendue et que vous avez consulté nos étapes de base sur [comment commencer avec la réflexion étendue](/docs/fr/about-claude/models/extended-thinking-models#getting-started-with-extended-thinking-models) ainsi que notre [guide d'implémentation de la réflexion étendue](/docs/fr/build-with-claude/extended-thinking).

### Considérations techniques pour la réflexion étendue

- Les jetons de réflexion ont un budget minimum de 1024 jetons. Nous recommandons de commencer avec le budget de réflexion minimum et d'augmenter progressivement pour ajuster selon vos besoins et la complexité de la tâche.
- Pour les charges de travail où le budget de réflexion optimal est supérieur à 32K, nous recommandons d'utiliser le [traitement par lots](/docs/fr/build-with-claude/batch-processing) pour éviter les problèmes de réseau. Les requêtes poussant le modèle à réfléchir au-delà de 32K jetons causent des requêtes de longue durée qui pourraient se heurter aux délais d'expiration du système et aux limites de connexions ouvertes.
- La réflexion étendue fonctionne mieux en anglais, bien que les sorties finales puissent être dans [n'importe quelle langue que Claude supporte](/docs/fr/build-with-claude/multilingual-support).
- Si vous avez besoin de réflexion en dessous du budget minimum, nous recommandons d'utiliser le mode standard, avec la réflexion désactivée, avec l'incitation traditionnelle de chaîne de pensée avec des balises XML (comme `<thinking>`). Voir [incitation de chaîne de pensée](/docs/fr/build-with-claude/prompt-engineering/chain-of-thought).

## Techniques d'incitation pour la réflexion étendue

### Utilisez d'abord des instructions générales, puis dépannez avec des instructions plus détaillées étape par étape

Claude fonctionne souvent mieux avec des instructions de haut niveau pour simplement réfléchir profondément à une tâche plutôt qu'avec des conseils prescriptifs étape par étape. La créativité du modèle dans l'approche des problèmes peut dépasser la capacité d'un humain à prescrire le processus de réflexion optimal.

Par exemple, au lieu de :

<CodeGroup>
```text User
Réfléchissez à ce problème de mathématiques étape par étape :
1. D'abord, identifiez les variables
2. Ensuite, établissez l'équation
3. Puis, résolvez pour x
...
```
</CodeGroup>

Considérez :

<CodeGroup>
```text User
Veuillez réfléchir à ce problème de mathématiques de manière approfondie et très détaillée.
Considérez plusieurs approches et montrez votre raisonnement complet.
Essayez différentes méthodes si votre première approche ne fonctionne pas.
```
/>
</CodeGroup>

<TryInConsoleButton
  userPrompt={
    `Veuillez réfléchir à ce problème de mathématiques de manière approfondie et très détaillée.
Considérez plusieurs approches et montrez votre raisonnement complet.
Essayez différentes méthodes si votre première approche ne fonctionne pas.`
  }
  thinkingBudgetTokens={16000}
>
  Essayer dans la Console
</TryInConsoleButton>

Cela dit, Claude peut toujours suivre efficacement des étapes d'exécution structurées complexes lorsque nécessaire. Le modèle peut gérer des listes encore plus longues avec des instructions plus complexes que les versions précédentes. Nous recommandons de commencer avec des instructions plus généralisées, puis de lire la sortie de réflexion de Claude et d'itérer pour fournir des instructions plus spécifiques pour orienter sa réflexion à partir de là.

### Incitation multishot avec réflexion étendue

L'[incitation multishot](/docs/fr/build-with-claude/prompt-engineering/multishot-prompting) fonctionne bien avec la réflexion étendue. Lorsque vous fournissez à Claude des exemples de comment réfléchir aux problèmes, il suivra des modèles de raisonnement similaires dans ses blocs de réflexion étendue.

Vous pouvez inclure des exemples few-shot dans votre incitation dans des scénarios de réflexion étendue en utilisant des balises XML comme `<thinking>` ou `<scratchpad>` pour indiquer des modèles canoniques de réflexion étendue dans ces exemples.

Claude généralisera le modèle au processus de réflexion étendue formel. Cependant, il est possible que vous obteniez de meilleurs résultats en donnant à Claude la liberté de réfléchir de la manière qu'il juge la meilleure.

Exemple :

<CodeGroup>
```text User
Je vais vous montrer comment résoudre un problème de mathématiques, puis je veux que vous en résolviez un similaire.

Problème 1 : Combien font 15% de 80 ?

<thinking>
Pour trouver 15% de 80 :
1. Convertir 15% en décimal : 15% = 0,15
2. Multiplier : 0,15 × 80 = 12
</thinking>

La réponse est 12.

Maintenant résolvez celui-ci :
Problème 2 : Combien font 35% de 240 ?
```
/>
</CodeGroup>

<TryInConsoleButton
  userPrompt={
    `Je vais vous montrer comment résoudre un problème de mathématiques, puis je veux que vous en résolviez un similaire.

Problème 1 : Combien font 15% de 80 ?

<thinking>
Pour trouver 15% de 80 :
1. Convertir 15% en décimal : 15% = 0,15
2. Multiplier : 0,15 × 80 = 12
</thinking>

La réponse est 12.

Maintenant résolvez celui-ci :
Problème 2 : Combien font 35% de 240 ?`
  }
  thinkingBudgetTokens={16000} 
>
  Essayer dans la Console
</TryInConsoleButton>

### Maximiser le suivi d'instructions avec la réflexion étendue
Claude montre un suivi d'instructions considérablement amélioré lorsque la réflexion étendue est activée. Le modèle typiquement :
1. Raisonne sur les instructions à l'intérieur du bloc de réflexion étendue
2. Exécute ces instructions dans la réponse

Pour maximiser le suivi d'instructions :
- Soyez clair et spécifique sur ce que vous voulez
- Pour des instructions complexes, considérez les diviser en étapes numérotées que Claude devrait suivre méthodiquement
- Accordez à Claude suffisamment de budget pour traiter complètement les instructions dans sa réflexion étendue

### Utiliser la réflexion étendue pour déboguer et orienter le comportement de Claude
Vous pouvez utiliser la sortie de réflexion de Claude pour déboguer la logique de Claude, bien que cette méthode ne soit pas toujours parfaitement fiable.

Pour faire le meilleur usage de cette méthodologie, nous recommandons les conseils suivants :
- Nous ne recommandons pas de repasser la réflexion étendue de Claude dans le bloc de texte utilisateur, car cela n'améliore pas les performances et peut en fait dégrader les résultats.
- Le préremplissage de la réflexion étendue est explicitement interdit, et modifier manuellement le texte de sortie du modèle qui suit son bloc de réflexion va probablement dégrader les résultats en raison de la confusion du modèle.

Lorsque la réflexion étendue est désactivée, le [préremplissage](/docs/fr/build-with-claude/prompt-engineering/prefill-claudes-response) de texte de réponse `assistant` standard est toujours autorisé.

<Note>
Parfois Claude peut répéter sa réflexion étendue dans le texte de sortie assistant. Si vous voulez une réponse propre, instruisez Claude de ne pas répéter sa réflexion étendue et de seulement sortir la réponse.
</Note>

### Tirer le meilleur parti des sorties longues et de la réflexion de forme longue

Pour les cas d'usage de génération de jeux de données, essayez des incitations telles que "Veuillez créer un tableau extrêmement détaillé de..." pour générer des jeux de données complets.

Pour des cas d'usage tels que la génération de contenu détaillé où vous pourriez vouloir générer des blocs de réflexion étendue plus longs et des réponses plus détaillées, essayez ces conseils :
- Augmentez à la fois la longueur maximale de réflexion étendue ET demandez explicitement des sorties plus longues
- Pour des sorties très longues (20 000+ mots), demandez un plan détaillé avec des comptes de mots jusqu'au niveau du paragraphe. Puis demandez à Claude d'indexer ses paragraphes au plan et de maintenir les comptes de mots spécifiés

<Warning>
Nous ne recommandons pas de pousser Claude à sortir plus de jetons pour le plaisir de sortir des jetons. Plutôt, nous vous encourageons à commencer avec un petit budget de réflexion et à augmenter selon les besoins pour trouver les paramètres optimaux pour votre cas d'usage.
</Warning>

Voici des exemples de cas d'usage où Claude excelle grâce à une réflexion étendue plus longue :

  <section title="Problèmes STEM complexes">

    Les problèmes STEM complexes nécessitent que Claude construise des modèles mentaux, applique des connaissances spécialisées, et travaille à travers des étapes logiques séquentielles—des processus qui bénéficient d'un temps de raisonnement plus long.
    
    <Tabs>
      <Tab title="Incitation standard">
        <CodeGroup>
        ```text User
        Écrivez un script python pour une balle jaune rebondissante dans un carré,
        assurez-vous de gérer correctement la détection de collision.
        Faites tourner lentement le carré.
        ```
        />
        </CodeGroup>
        
        <TryInConsoleButton
          userPrompt={
            `Écrivez un script python pour une balle jaune rebondissante dans un carré,
assurez-vous de gérer correctement la détection de collision.
Faites tourner lentement le carré.`
          }
          thinkingBudgetTokens={16000}
        >
          Essayer dans la Console
        </TryInConsoleButton>
        <Note>
        Cette tâche plus simple résulte typiquement en seulement quelques secondes de temps de réflexion.
        </Note>
      </Tab>
      <Tab title="Incitation améliorée">
        <CodeGroup>
        ```text User
        Écrivez un script Python pour une balle jaune rebondissante dans un tesseract,
        en vous assurant de gérer correctement la détection de collision.
        Faites tourner lentement le tesseract.
        Assurez-vous que la balle reste dans le tesseract.
        ```
        />
        </CodeGroup>
        
        <TryInConsoleButton
          userPrompt={
            `Écrivez un script Python pour une balle jaune rebondissante dans un tesseract,
en vous assurant de gérer correctement la détection de collision.
Faites tourner lentement le tesseract.
Assurez-vous que la balle reste dans le tesseract.`
          }
          thinkingBudgetTokens={16000}
        >
          Essayer dans la Console
        </TryInConsoleButton>
        <Note>
        Ce défi complexe de visualisation 4D tire le meilleur parti du temps de réflexion étendue long car Claude travaille à travers la complexité mathématique et de programmation.
        </Note>
      </Tab>
    </Tabs>
  
</section>
  
  <section title="Problèmes d'optimisation sous contraintes">

    L'optimisation sous contraintes défie Claude à satisfaire plusieurs exigences concurrentes simultanément, ce qui est mieux accompli en permettant un temps de réflexion étendue long pour que le modèle puisse aborder méthodiquement chaque contrainte.
    
    <Tabs>
      <Tab title="Incitation standard">
        <CodeGroup>
        ```text User
        Planifiez des vacances d'une semaine au Japon.
        ```
        />
        </CodeGroup>
        
        <TryInConsoleButton
          userPrompt="Planifiez des vacances d'une semaine au Japon."
          thinkingBudgetTokens={16000}
        >
          Essayer dans la Console
        </TryInConsoleButton>
        <Note>
        Cette demande ouverte résulte typiquement en seulement quelques secondes de temps de réflexion.
        </Note>
      </Tab>
      <Tab title="Incitation améliorée">
        <CodeGroup>
        ```text User
        Planifiez un voyage de 7 jours au Japon avec les contraintes suivantes :
        - Budget de 2 500 $
        - Doit inclure Tokyo et Kyoto
        - Besoin d'accommoder un régime végétarien
        - Préférence pour les expériences culturelles plutôt que le shopping
        - Doit inclure une journée de randonnée
        - Pas plus de 2 heures de voyage entre les lieux par jour
        - Besoin de temps libre chaque après-midi pour des appels vers la maison
        - Doit éviter les foules autant que possible
        ```
        />
        </CodeGroup>
        
        <TryInConsoleButton
          userPrompt={
            `Planifiez un voyage de 7 jours au Japon avec les contraintes suivantes :
- Budget de 2 500 $
- Doit inclure Tokyo et Kyoto
- Besoin d'accommoder un régime végétarien
- Préférence pour les expériences culturelles plutôt que le shopping
- Doit inclure une journée de randonnée
- Pas plus de 2 heures de voyage entre les lieux par jour
- Besoin de temps libre chaque après-midi pour des appels vers la maison
- Doit éviter les foules autant que possible`
          }
          thinkingBudgetTokens={16000}
        >
          Essayer dans la Console
        </TryInConsoleButton>
        <Note>
        Avec plusieurs contraintes à équilibrer, Claude fonctionnera naturellement mieux lorsqu'on lui donne plus d'espace pour réfléchir à comment satisfaire toutes les exigences de manière optimale.
        </Note>
      </Tab>
    </Tabs>
  
</section>
  
  <section title="Cadres de réflexion">

    Les cadres de réflexion structurés donnent à Claude une méthodologie explicite à suivre, ce qui peut fonctionner mieux lorsque Claude dispose d'un long espace de réflexion étendue pour suivre chaque étape.
    
    <Tabs>
      <Tab title="Incitation standard">
        <CodeGroup>
        ```text User
        Développez une stratégie complète pour Microsoft
        entrant sur le marché de la médecine personnalisée d'ici 2027.
        ```
        />
        </CodeGroup>
        
        <TryInConsoleButton
          userPrompt={
            `Développez une stratégie complète pour Microsoft
entrant sur le marché de la médecine personnalisée d'ici 2027.`
          }
          thinkingBudgetTokens={16000}
        >
          Essayer dans la Console
        </TryInConsoleButton>
        <Note>
        Cette question stratégique large résulte typiquement en seulement quelques secondes de temps de réflexion.
        </Note>
      </Tab>
      <Tab title="Incitation améliorée">
        <CodeGroup>
        ```text User
        Développez une stratégie complète pour Microsoft entrant
        sur le marché de la médecine personnalisée d'ici 2027.
        
        Commencez par :
        1. Un canevas de Stratégie Océan Bleu
        2. Appliquez les Cinq Forces de Porter pour identifier les pressions concurrentielles
        
        Ensuite, menez un exercice de planification de scénarios avec quatre
        futurs distincts basés sur des variables réglementaires et technologiques.
        
        Pour chaque scénario :
        - Développez des réponses stratégiques en utilisant la Matrice d'Ansoff
        
        Enfin, appliquez le cadre des Trois Horizons pour :
        - Cartographier le chemin de transition
        - Identifier les innovations potentiellement disruptives à chaque étape
        ```
        />
        </CodeGroup>
        
        <TryInConsoleButton
          userPrompt={
            `Développez une stratégie complète pour Microsoft entrant
sur le marché de la médecine personnalisée d'ici 2027.

Commencez par :
1. Un canevas de Stratégie Océan Bleu
2. Appliquez les Cinq Forces de Porter pour identifier les pressions concurrentielles

Ensuite, menez un exercice de planification de scénarios avec quatre
futurs distincts basés sur des variables réglementaires et technologiques.

Pour chaque scénario :
- Développez des réponses stratégiques en utilisant la Matrice d'Ansoff

Enfin, appliquez le cadre des Trois Horizons pour :
- Cartographier le chemin de transition
- Identifier les innovations potentiellement disruptives à chaque étape`
          }
          thinkingBudgetTokens={16000}
        >
          Essayer dans la Console
        </TryInConsoleButton>
        <Note>
        En spécifiant plusieurs cadres analytiques qui doivent être appliqués séquentiellement, le temps de réflexion augmente naturellement car Claude travaille à travers chaque cadre méthodiquement.
        </Note>
      </Tab>
    </Tabs>
  
</section>

### Faire réfléchir Claude et vérifier son travail pour une cohérence améliorée et une gestion d'erreurs
Vous pouvez utiliser une incitation en langage naturel simple pour améliorer la cohérence et réduire les erreurs :
1. Demandez à Claude de vérifier son travail avec un test simple avant de déclarer une tâche terminée
2. Instruisez le modèle d'analyser si son étape précédente a atteint le résultat attendu
3. Pour les tâches de codage, demandez à Claude de passer en revue les cas de test dans sa réflexion étendue

Exemple :

<CodeGroup>
```text User
Écrivez une fonction pour calculer la factorielle d'un nombre.
Avant de terminer, veuillez vérifier votre solution avec des cas de test pour :
- n=0
- n=1
- n=5
- n=10
Et corrigez tous les problèmes que vous trouvez.
```
/>
</CodeGroup>

<TryInConsoleButton
  userPrompt={
    `Écrivez une fonction pour calculer la factorielle d'un nombre.
Avant de terminer, veuillez vérifier votre solution avec des cas de test pour :
- n=0
- n=1
- n=5
- n=10
Et corrigez tous les problèmes que vous trouvez.`
  }
  thinkingBudgetTokens={16000}
>
  Essayer dans la Console
</TryInConsoleButton>

## Prochaines étapes

<CardGroup>
  <Card title="Livre de recettes de réflexion étendue" icon="book" href="https://github.com/anthropics/anthropic-cookbook/tree/main/extended_thinking">
    Explorez des exemples pratiques de réflexion étendue dans notre livre de recettes.
  </Card>
  <Card title="Guide de réflexion étendue" icon="code" href="/docs/fr/build-with-claude/extended-thinking">
    Voir la documentation technique complète pour implémenter la réflexion étendue.
  </Card>
</CardGroup>