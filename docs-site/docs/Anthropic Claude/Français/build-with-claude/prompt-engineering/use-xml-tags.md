# Utilisez des balises XML pour structurer vos invites

Utilisez des balises XML pour structurer vos invites et améliorer la qualité des réponses de Claude

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

Lorsque vos invites impliquent plusieurs composants comme le contexte, les instructions et les exemples, les balises XML peuvent être un véritable atout. Elles aident Claude à analyser vos invites plus précisément, ce qui conduit à des résultats de meilleure qualité.

<Tip>**Conseil XML** : Utilisez des balises comme `<instructions>`, `<example>` et `<formatting>` pour séparer clairement les différentes parties de votre invite. Cela empêche Claude de confondre les instructions avec les exemples ou le contexte.</Tip>

## Pourquoi utiliser des balises XML ?

- **Clarté :** Séparez clairement les différentes parties de votre invite et assurez-vous que votre invite est bien structurée.
- **Précision :** Réduisez les erreurs causées par une mauvaise interprétation de parties de votre invite par Claude.
- **Flexibilité :** Trouvez, ajoutez, supprimez ou modifiez facilement des parties de votre invite sans tout réécrire.
- **Analysabilité :** Faire en sorte que Claude utilise des balises XML dans sa sortie facilite l'extraction de parties spécifiques de sa réponse par post-traitement.

<Note>Il n'existe pas de balises XML « canoniques » sur lesquelles Claude a été entraîné en particulier, bien que nous recommandions que vos noms de balises aient du sens par rapport aux informations qu'elles entourent.</Note>

***

## Meilleures pratiques de balisage

1. **Soyez cohérent** : Utilisez les mêmes noms de balises tout au long de vos invites, et référencez ces noms de balises lorsque vous parlez du contenu (par exemple, `En utilisant le contrat dans les balises <contract>...`).
2. **Imbriquez les balises** : Vous devez imbriquer les balises `<outer><inner></inner></outer>` pour le contenu hiérarchique.

<Tip>**Conseil pour utilisateurs avancés** : Combinez les balises XML avec d'autres techniques comme l'invite multi-coups (`<examples>`) ou la chaîne de pensée (`<thinking>`, `<answer>`). Cela crée des invites super structurées et hautement performantes.</Tip>

### Exemples

  <section title="Exemple : Générer des rapports financiers">

    Sans balises XML, Claude comprend mal la tâche et génère un rapport qui ne correspond pas à la structure ou au ton requis. Après substitution, il y a aussi une chance que Claude comprenne mal où une section (comme l'exemple de rapport Q1) s'arrête et où une autre commence.

    | Rôle | Sans balises XML | Avec balises XML |
    | ---- | ----------- | ------------- |
    | Utilisateur | Vous êtes un analyste financier chez AcmeCorp. Générez un rapport financier Q2 pour nos investisseurs. Incluez des sections sur la Croissance des Revenus, les Marges Bénéficiaires et les Flux de Trésorerie, comme dans cet exemple de l'année dernière : \{\{Q1_REPORT\}\}. Utilisez les points de données de cette feuille de calcul : \{\{SPREADSHEET_DATA\}\}. Le rapport doit être extrêmement concis, direct, professionnel et en format liste. Il doit mettre en évidence à la fois les forces et les domaines à améliorer. | Vous êtes un analyste financier chez AcmeCorp. Générez un rapport financier Q2 pour nos investisseurs.<br/><br/>AcmeCorp est une entreprise B2B SaaS. Nos investisseurs apprécient la transparence et les informations exploitables.<br/><br/>Utilisez ces données pour votre rapport :\<data>\{\{SPREADSHEET_DATA\}\}\</data><br/><br/>\<instructions><br/>1. Incluez les sections : Croissance des Revenus, Marges Bénéficiaires, Flux de Trésorerie.<br/>2. Mettez en évidence les forces et les domaines à améliorer.<br/>\</instructions><br/><br/>Adoptez un ton concis et professionnel. Suivez cette structure :<br/>\<formatting_example>\{\{Q1_REPORT\}\}\</formatting_example> |
    | Assistant | Rapport Financier Q2 pour les Investisseurs d'AcmeCorp<br/><br/>Chers Investisseurs Estimés,<br/><br/>Je suis heureux de vous présenter notre rapport financier Q2, mettant en évidence la croissance continue et la résilience d'AcmeCorp sur le marché B2B SaaS.<br/><br/>1. Croissance des Revenus :<br/>Notre revenu Q2 a atteint 15,2 M$, une augmentation de 22% en glissement annuel. Cette croissance est principalement due à une expansion de 30% de notre base de clients d'entreprise. Cependant, notre segment PME a connu un léger déclin de 5%, que nous visons à résoudre par le biais d'initiatives de marketing ciblées au Q3.<br/><br/>2. Marges Bénéficiaires :<br/>La marge brute s'est améliorée à 72% (en hausse de 3% par rapport au Q1) grâce aux optimisations d'infrastructure. La marge EBITDA, cependant, a baissé à 18% (en baisse de 2%) car nous avons investi massivement en R&D pour nos prochaines fonctionnalités basées sur l'IA.<br/><br/>3. Flux de Trésorerie :<br/>Le flux de trésorerie d'exploitation reste solide à 4,1 M$. Nos réserves de trésorerie s'élèvent à 28 M$, offrant une autonomie de 15 mois au taux de combustion actuel. Nous avons constaté une augmentation de 20% des coûts d'acquisition de clients, que nous résolvons par des stratégies de vente plus efficaces.<br/><br/>En résumé, les finances de base d'AcmeCorp restent robustes. Nous équilibrons les investissements de croissance avec une gestion prudente de la trésorerie. Notre focus pour le Q3 sera de revitaliser la croissance des PME et d'optimiser l'efficacité des ventes.<br/><br/>Merci pour votre confiance continue.<br/><br/>Cordialement,<br/>Directeur Financier, AcmeCorp | Rapport Financier Q2 pour les Investisseurs d'AcmeCorp\</output><br/><br/>Croissance des Revenus :<br/>- Revenu Q2 : 15,2 M$ (22% en glissement annuel ↑)<br/>- Clients d'entreprise : 30% ↑<br/>- Segment PME : 5% ↓<br/>  Action : Marketing ciblé Q3<br/><br/>Marges Bénéficiaires :<br/>- Marge brute : 72% (3% ↑ par rapport au Q1)<br/>  Raison : Optimisations d'infrastructure<br/>- Marge EBITDA : 18% (2% ↓)<br/>  Raison : Investissement en R&D pour les fonctionnalités IA<br/><br/>Flux de Trésorerie :<br/>- Flux de trésorerie d'exploitation : 4,1 M$ (solide)<br/>- Réserves de trésorerie : 28 M$ (autonomie de 15 mois)<br/>- Coût d'acquisition de clients : 20% ↑<br/>  Action : Optimiser les stratégies de vente<br/><br/>Perspectives :<br/>- Finances de base : Robustes<br/>- Focus Q3 : Revitaliser les PME, optimiser les ventes<br/><br/>La direction reste engagée à équilibrer les investissements de croissance avec la discipline financière. |
  
</section>
  <section title="Exemple : Analyse de contrat juridique">

    Sans balises XML, l'analyse de Claude est désorganisée et manque des points clés. Avec les balises, elle fournit une analyse structurée et approfondie sur laquelle une équipe juridique peut agir.

    | Rôle | Sans balises XML | Avec balises XML |
    | ---- | ----------- | ------------- |
    | Utilisateur | Analysez cet accord de licence logicielle pour les risques et responsabilités potentiels : \{\{CONTRACT\}\}. Concentrez-vous sur les clauses d'indemnisation, de limitation de responsabilité et de propriété intellectuelle. Notez également tous les termes inhabituels ou préoccupants. Voici notre contrat standard à titre de référence : \{\{STANDARD_CONTRACT\}\}. Donnez un résumé des conclusions et des recommandations pour notre équipe juridique. | Analysez cet accord de licence logicielle pour les risques et responsabilités juridiques.<br/><br/>Nous sommes une entreprise multinationale envisageant cet accord pour notre infrastructure de données essentielles.<br/><br/>\<agreement><br/>\{\{CONTRACT\}\}\</agreement><br/><br/>Voici notre contrat standard à titre de référence :<br/>\<standard_contract>\{\{STANDARD_CONTRACT\}\}\</standard_contract><br/><br/>\<instructions><br/>1. Analysez ces clauses :<br/>   - Indemnisation<br/>   - Limitation de responsabilité<br/>   - Propriété intellectuelle<br/><br/>2. Notez les termes inhabituels ou préoccupants.<br/><br/>3. Comparez avec notre contrat standard.<br/><br/>4. Résumez les conclusions dans les balises \<findings>.<br/><br/>5. Listez les recommandations exploitables dans les balises \<recommendations>.\</instructions> |
    | Assistant | L'accord de licence logicielle fourni présente plusieurs aspects préoccupants. La clause d'indemnisation est excessivement large, nous exposant potentiellement à des responsabilités importantes. La section de limitation de responsabilité plafonne les dommages à seulement 500$, ce qui est inadéquat pour notre utilisation au niveau entreprise. Concernant la propriété intellectuelle, l'accord accorde au fournisseur la copropriété de toute modification ou intégration que nous créons.<br/><br/>En résumé, cet accord n'est pas dans notre intérêt. Il nous expose à des risques indus, limite notre recours en cas de défaillance et compromet nos droits de propriété intellectuelle. Je recommande de renégocier ces termes ou de chercher des fournisseurs alternatifs. | \<findings><br/>1. Indemnisation (Clause 8) :<br/>   - Problème : Excessivement large. Nous indemnisons le fournisseur contre « tous les sinistres » découlant de notre utilisation.<br/>   - Risque : Pourrait nous tenir responsables même de la négligence ou des défauts du produit du fournisseur.<br/>   - Écart : Notre standard limite l'indemnité aux sinistres découlant de notre violation de l'accord.<br/><br/>2. Limitation de Responsabilité (Clause 9) :<br/>   - Problème : Plafonne tous les dommages à 500$, y compris les dommages directs.<br/>   - Risque : Grossièrement inadéquat pour une utilisation d'entreprise. Une défaillance critique pourrait coûter des millions.<br/>   - Écart : Notre standard permet les dommages directs jusqu'à 12 mois de frais payés.<br/><br/>3. Propriété Intellectuelle (Clause 12) :<br/>   - Problème : Accorde au fournisseur la copropriété de nos modifications/intégrations.<br/>   - Risque : Le fournisseur pourrait utiliser ou vendre nos algorithmes propriétaires ou nos informations sur les données.<br/>   - Écart : Notre standard conserve la propriété complète de notre travail.<br/><br/>4. Termes Inhabituels :<br/>   - Clause 5.3 : Le fournisseur peut utiliser nos données d'utilisation à « toute fin ».<br/>   - Clause 7.2 : Le fournisseur peut résilier pour « convenance » avec seulement 7 jours de préavis.<br/>   - Clause 11 : Aucune garantie d'aucune sorte, même pour la commercialité de base.<br/>\</findings><br/><br/>\<recommendations><br/>1. Rejetez cet accord. Les risques dépassent largement les avantages pour une entreprise.<br/>2. Proposez une contre-offre :<br/>   - Indemnisation : Limitez aux sinistres découlant de notre violation de l'accord.<br/>   - Responsabilité : Plafonnez à 12 mois de frais pour les dommages directs ; négociez pour les dommages indirects.<br/>   - Propriété Intellectuelle : Propriété complète de nos modifications/intégrations.<br/>   - Utilisation des Données : Limitez à l'amélioration du service uniquement.<br/>   - Résiliation : Minimum 90 jours de préavis ; uniquement pour cause.<br/>   - Garanties : Exigez la commercialité de base et l'adéquation à l'usage.<br/>3. Si le fournisseur refuse, explorez les fournisseurs alternatifs ou les solutions internes.<br/>4. Engagez un conseil juridique pour la négociation de contrat compte tenu des enjeux élevés.<br/>\</recommendations> |
  
</section>

***

<CardGroup cols={3}>
  <Card title="Bibliothèque d'invites" icon="link" href="/docs/fr/resources/prompt-library/library">
    Inspirez-vous d'une sélection organisée d'invites pour diverses tâches et cas d'usage.
  </Card>
  <Card title="Tutoriel de prompting GitHub" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    Un tutoriel riche en exemples qui couvre les concepts d'ingénierie d'invites trouvés dans notre documentation.
  </Card>
  <Card title="Tutoriel de prompting Google Sheets" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    Une version plus légère de notre tutoriel d'ingénierie d'invites via une feuille de calcul interactive.
  </Card>
</CardGroup>