# Donner un rôle à Claude avec une invite système

Apprenez à utiliser le paramètre système pour donner un rôle à Claude et améliorer considérablement ses performances.

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

Lorsque vous utilisez Claude, vous pouvez améliorer considérablement ses performances en utilisant le paramètre `system` pour lui donner un rôle. Cette technique, connue sous le nom d'invite de rôle, est le moyen le plus puissant d'utiliser les invites système avec Claude.

Le bon rôle peut transformer Claude d'un assistant généraliste en votre expert de domaine virtuel !

<Tip>**Conseils pour les invites système** : Utilisez le paramètre `system` pour définir le rôle de Claude. Mettez tout le reste, comme les instructions spécifiques à la tâche, dans le tour `user` à la place.</Tip>

## Pourquoi utiliser l'invite de rôle ?

- **Précision améliorée :** Dans les scénarios complexes comme l'analyse juridique ou la modélisation financière, l'invite de rôle peut considérablement améliorer les performances de Claude.
- **Ton adapté :** Que vous ayez besoin de la concision d'un PDG ou du flair d'un rédacteur publicitaire, l'invite de rôle ajuste le style de communication de Claude.
- **Concentration améliorée :** En définissant le contexte du rôle, Claude reste davantage dans les limites des exigences spécifiques de votre tâche.

***

## Comment donner un rôle à Claude

Utilisez le paramètre `system` dans l'[API Messages](/docs/fr/api/messages) pour définir le rôle de Claude :

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

<Tip>**Conseil sur l'invite de rôle** : Expérimentez avec les rôles ! Un `data scientist` pourrait voir des perspectives différentes qu'un `marketing strategist` pour les mêmes données. Un `data scientist specializing in customer insight analysis for Fortune 500 companies` pourrait donner des résultats encore différents !</Tip>

***

## Exemples

### Exemple 1 : Analyse de contrats juridiques
Sans rôle, Claude pourrait manquer des problèmes critiques :

<section title="Analyse de contrats juridiques sans invite de rôle">

| Rôle | Contenu |
| ---- | ------- |
| User | Analysez cet accord de licence logicielle pour les risques potentiels :<br/>\<contract><br/>\{\{CONTRACT\}\}<br/>\</contract><br/><br/>Concentrez-vous sur l'indemnisation, la responsabilité et la propriété intellectuelle. |
| Assistant | Voici un résumé des points clés de l'accord de licence logicielle :<br/><br/>1. Indemnisation (Section 8) :<br/>   - Nous indemnisons le fournisseur contre les réclamations découlant de notre utilisation.<br/><br/>2. Limitation de responsabilité (Section 9) :<br/>   - Les dommages sont plafonnés à \$500.<br/><br/>3. Propriété intellectuelle (Section 12) :<br/>   - Nous conservons la propriété de nos modifications.<br/><br/>Dans l'ensemble, l'accord semble standard. Les clauses d'indemnisation et de responsabilité sont typiques, et nous conservons nos droits de propriété intellectuelle. |

</section>

Avec un rôle, Claude détecte les problèmes critiques qui pourraient coûter des millions :

<section title="Analyse de contrats juridiques avec invite de rôle">

| Rôle | Contenu |
| ---- | ------- |
| User | Vous êtes le Conseiller général d'une grande entreprise technologique du Fortune 500. Nous envisageons cet accord de licence logicielle pour notre infrastructure de données principale :<br/>\<contract><br/>\{\{CONTRACT\}\}<br/>\</contract><br/><br/>Analysez-le pour les risques potentiels, en vous concentrant sur l'indemnisation, la responsabilité et la propriété intellectuelle. Donnez votre avis professionnel. |
| Assistant | J'ai examiné l'accord de licence logicielle, et j'ai de graves préoccupations qui pourraient exposer notre entreprise à des risques importants :<br/><br/>1. Indemnisation (Section 8) :<br/>   - Problème critique : Nous indemnisons le fournisseur contre « toute réclamation » découlant de notre utilisation.<br/>   - Risque : Cela pourrait nous rendre responsables même de la négligence du fournisseur ou des défauts du produit.<br/>   - Recommandation : Rejeter. Limiter notre indemnité aux réclamations découlant de notre violation de l'accord.<br/><br/>2. Limitation de responsabilité (Section 9) :<br/>   - Problème critique : Les dommages sont plafonnés à \$500, y compris les dommages directs.<br/>   - Risque : Grossièrement inadéquat. Une défaillance critique de notre infrastructure de données pourrait nous coûter des millions en perte de revenus et dommages à la réputation.<br/>   - Recommandation : Rejeter. Négocier un plafond de 12 mois de frais pour les dommages directs, et des exclusions pour les violations de données.<br/><br/>3. Propriété intellectuelle (Section 12) :<br/>   - Problème critique : Le fournisseur obtient la propriété conjointe de nos modifications et intégrations.<br/>   - Risque : Il pourrait utiliser ou vendre nos algorithmes propriétaires ou nos perspectives de données à des concurrents.<br/>   - Recommandation : Rejeter. Nous devons conserver la propriété complète de notre travail.<br/><br/>Avis professionnel : Ne signez pas cet accord. Il est extrêmement défavorable et nous expose à des niveaux de risque inacceptables. Si le fournisseur refuse de renégocier ces conditions, je vous conseille vivement d'explorer des fournisseurs alternatifs ou d'accélérer notre solution interne. Les coûts potentiels de la poursuite de cet accord dépassent de loin les gains à court terme. |

</section>

### Exemple 2 : Analyse financière
Sans rôle, l'analyse de Claude manque de profondeur :

<section title="Analyse financière sans invite de rôle">

| Rôle | Contenu |
| ---- | ------- |
| User | Analysez cet ensemble de données de nos finances du Q2 :<br/>\<data><br/>\{\{FINANCIALS\}\}<br/>\</data><br/><br/>Mettez en évidence les tendances clés et recommandez des actions. |
| Assistant | Voici un résumé de vos finances du Q2 :<br/><br/>1. Revenus : \$15,2M, en hausse de 22 % en glissement annuel. La base de clients d'entreprise a augmenté de 30 %.<br/>2. Marge brute : 72 %, en hausse de 3 % par rapport au Q1.<br/>3. Marge EBITDA : 18 %, en baisse de 2 % en raison des investissements en R&D.<br/>4. Flux de trésorerie : \$4,1M d'exploitation, \$28M en réserves.<br/><br/>Dans l'ensemble, les finances semblent solides avec une croissance des revenus et des marges saines. L'augmentation des dépenses en R&D affecte la rentabilité mais pourrait être rentable à long terme. Maintenez le cap actuel. |

</section>

Avec un rôle, Claude fournit des perspectives exploitables :

<section title="Analyse financière avec invite de rôle">

| Rôle | Contenu |
| ---- | ------- |
| User | Vous êtes le PDG d'une entreprise SaaS B2B à croissance rapide. Nous sommes dans une réunion du conseil d'administration discutant de nos finances du Q2 :<br/>\<data><br/>\{\{FINANCIALS\}\}<br/>\</data><br/><br/>Analysez les tendances clés, signalez les préoccupations et recommandez des actions stratégiques. Nos investisseurs veulent une croissance agressive mais sont prudents quant à notre taux de combustion. |
| Assistant | Mesdames et messieurs du conseil, voici mon analyse de nos finances du Q2 :<br/><br/>1. Revenus (\$15,2M, +22 % en glissement annuel) :<br/>   - Perspective : La croissance des entreprises (+30 %) dépasse la croissance globale.<br/>   - Alerte : Le segment des PME a diminué de 5 %.<br/>   - Action : Réaffecter 20 % du budget marketing des PME aux ventes d'entreprise. Demander au produit de simplifier l'intégration des PME.<br/><br/>2. Marges (Brute : 72 %, +3 % en glissement trimestriel ; EBITDA : 18 %, -2 % en glissement trimestriel) :<br/>   - Perspective : Les optimisations d'infrastructure ont augmenté les marges brutes.<br/>   - Alerte : Les dépenses en R&D sur les fonctionnalités d'IA ont endommagé l'EBITDA.<br/>   - Action : Aucun changement. Notre feuille de route IA est critique pour la fidélité des entreprises.<br/><br/>3. Trésorerie (\$4,1M OCF, \$28M en réserves) :<br/>   - Perspective : Autonomie de 15 mois au taux de combustion actuel.<br/>   - Alerte : CAC en hausse de 20 %, érodant LTV/CAC.<br/>   - Action : Geler les embauches non essentielles. Mettre en œuvre l'analyse d'entonnoir de vente pour réduire le CAC de 15 % au Q3.<br/><br/>Position stratégique : Nous naviguons entre la croissance et la combustion. L'orientation vers les entreprises est notre moteur de croissance—investissez-y. Mais surveillez le taux de désabonnement des PME ; il pourrait s'étendre aux entreprises. Notre pari sur l'IA est judicieux, mais nous devons le convertir en ARR d'ici le Q4, sinon nous réduisons la R&D de 30 %.<br/><br/>En résumé : Doublez les efforts sur les entreprises, rationalisez les PME, optimisez les ventes et monétisez l'IA. Des questions ? |

</section>

---

<CardGroup cols={3}>
  <Card title="Bibliothèque d'invites" icon="link" href="/docs/fr/resources/prompt-library/library">
    Inspirez-vous d'une sélection organisée d'invites pour diverses tâches et cas d'usage.
  </Card>
  <Card title="Tutoriel GitHub sur les invites" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    Un tutoriel riche en exemples qui couvre les concepts d'ingénierie d'invites trouvés dans notre documentation.
  </Card>
  <Card title="Tutoriel Google Sheets sur les invites" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    Une version plus légère de notre tutoriel d'ingénierie d'invites via une feuille de calcul interactive.
  </Card>
</CardGroup>