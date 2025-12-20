# Aperçu des modèles

Claude est une famille de modèles de langage de pointe développés par Anthropic. Ce guide présente nos modèles et compare leurs performances.

---

## Choisir un modèle

Si vous ne savez pas quel modèle utiliser, nous vous recommandons de commencer par **Claude Sonnet 4.5**. Il offre le meilleur équilibre entre intelligence, vitesse et coût pour la plupart des cas d'usage, avec des performances exceptionnelles en codage et tâches agentiques.

Tous les modèles Claude actuels prennent en charge l'entrée de texte et d'images, la sortie de texte, les capacités multilingues et la vision. Les modèles sont disponibles via l'API Anthropic, AWS Bedrock et Google Vertex AI.

Une fois que vous avez choisi un modèle, [apprenez comment faire votre premier appel API](/docs/fr/get-started).

### Comparaison des derniers modèles

| Fonctionnalité | Claude Sonnet 4.5 | Claude Haiku 4.5 | Claude Opus 4.5 |
|:--------|:------------------|:-----------------|:----------------|
| **Description** | Notre modèle intelligent pour les agents complexes et le codage | Notre modèle le plus rapide avec une intelligence quasi-frontière | Modèle premium combinant l'intelligence maximale avec des performances pratiques |
| **Claude API ID** | claude-sonnet-4-5-20250929 | claude-haiku-4-5-20251001 | claude-opus-4-5-20251101 |
| **Claude API alias**<sup>1</sup> | claude-sonnet-4-5 | claude-haiku-4-5 | claude-opus-4-5 |
| **AWS Bedrock ID** | anthropic.claude-sonnet-4-5-20250929-v1:0 | anthropic.claude-haiku-4-5-20251001-v1:0 | anthropic.claude-opus-4-5-20251101-v1:0 |
| **GCP Vertex AI ID** | claude-sonnet-4-5@20250929 | claude-haiku-4-5@20251001 | claude-opus-4-5@20251101 |
| **Tarification**<sup>2</sup> | \$3 / input MTok<br/>\$15 / output MTok | \$1 / input MTok<br/>\$5 / output MTok | \$5 / input MTok<br/>\$25 / output MTok |
| **[Extended thinking](/docs/fr/build-with-claude/extended-thinking)** | Oui | Oui | Oui |
| **[Priority Tier](/docs/fr/api/service-tiers)** | Oui | Oui | Oui |
| **Latence comparative** | Rapide | La plus rapide | Modérée |
| **Fenêtre de contexte** | <Tooltip tooltipContent="~150K words \ ~680K unicode characters">200K tokens</Tooltip> / <br/> <Tooltip tooltipContent="~750K words \ ~3.4M unicode characters">1M tokens</Tooltip> (beta)<sup>3</sup> | <Tooltip tooltipContent="~150K words \ ~680K unicode characters">200K tokens</Tooltip> | <Tooltip tooltipContent="~150K words \ ~680K unicode characters">200K tokens</Tooltip> |
| **Sortie maximale** | 64K tokens | 64K tokens | 64K tokens |
| **Cutoff de connaissance fiable** | Jan 2025<sup>4</sup> | Feb 2025 | May 2025<sup>4</sup> |
| **Cutoff des données d'entraînement** | Jul 2025 | Jul 2025 | Aug 2025 |

_<sup>1 - Les alias pointent automatiquement vers le snapshot de modèle le plus récent. Lorsque nous publions de nouveaux snapshots de modèle, nous migrons les alias pour pointer vers la version la plus récente d'un modèle, généralement dans une semaine suivant la nouvelle version. Bien que les alias soient utiles pour l'expérimentation, nous recommandons d'utiliser des versions de modèle spécifiques (par exemple, `claude-sonnet-4-5-20250929`) dans les applications de production pour assurer un comportement cohérent.</sup>_

_<sup>2 - Consultez notre [page de tarification](/docs/fr/about-claude/pricing) pour les informations de tarification complètes, y compris les remises de l'API batch, les taux de mise en cache des prompts, les coûts de la réflexion étendue et les frais de traitement de la vision.</sup>_

_<sup>3 - Claude Sonnet 4.5 prend en charge une [fenêtre de contexte de 1M tokens](/docs/fr/build-with-claude/context-windows#1m-token-context-window) lors de l'utilisation de l'en-tête beta `context-1m-2025-08-07`. La [tarification du contexte long](/docs/fr/about-claude/pricing#long-context-pricing) s'applique aux demandes dépassant 200K tokens.</sup>_

_<sup>4 - **Cutoff de connaissance fiable** indique la date jusqu'à laquelle les connaissances d'un modèle sont les plus étendues et fiables. **Cutoff des données d'entraînement** est la plage de dates plus large des données d'entraînement utilisées. Par exemple, Claude Sonnet 4.5 a été entraîné sur des informations publiquement disponibles jusqu'en juillet 2025, mais ses connaissances sont les plus étendues et fiables jusqu'en janvier 2025. Pour plus d'informations, consultez [le Transparency Hub d'Anthropic](https://www.anthropic.com/transparency).</sup>_

<Note>Les modèles avec la même date de snapshot (par exemple, 20240620) sont identiques sur toutes les plateformes et ne changent pas. La date du snapshot dans le nom du modèle assure la cohérence et permet aux développeurs de compter sur des performances stables dans différents environnements.</Note>

<Note>À partir de **Claude Sonnet 4.5 et tous les modèles futurs**, AWS Bedrock et Google Vertex AI offrent deux types de points de terminaison : **points de terminaison globaux** (routage dynamique pour une disponibilité maximale) et **points de terminaison régionaux** (routage de données garanti via des régions géographiques spécifiques). Pour plus d'informations, consultez la [section de tarification des plateformes tierces](/docs/fr/about-claude/pricing#third-party-platform-pricing).</Note>

<section title="Modèles hérités">

Les modèles suivants sont toujours disponibles, mais nous recommandons de migrer vers les modèles actuels pour améliorer les performances :

| Fonctionnalité | Claude Opus 4.1 | Claude Sonnet 4 | Claude Sonnet 3.7 | Claude Opus 4 | Claude Haiku 3.5 | Claude Haiku 3 |
|:--------|:----------------|:----------------|:------------------|:--------------|:-----------------|:---------------|
| **Claude API ID** | claude-opus-4-1-20250805 | claude-sonnet-4-20250514 | claude-3-7-sonnet-20250219 | claude-opus-4-20250514 | claude-3-5-haiku-20241022 | claude-3-haiku-20240307 |
| **Claude API alias** | claude-opus-4-1 | claude-sonnet-4-0 | claude-3-7-sonnet-latest | claude-opus-4-0 | claude-3-5-haiku-latest | — |
| **AWS Bedrock ID** | anthropic.claude-opus-4-1-20250805-v1:0 | anthropic.claude-sonnet-4-20250514-v1:0 | anthropic.claude-3-7-sonnet-20250219-v1:0 | anthropic.claude-opus-4-20250514-v1:0 | anthropic.claude-3-5-haiku-20241022-v1:0 | anthropic.claude-3-haiku-20240307-v1:0 |
| **GCP Vertex AI ID** | claude-opus-4-1@20250805 | claude-sonnet-4@20250514 | claude-3-7-sonnet@20250219 | claude-opus-4@20250514 | claude-3-5-haiku@20241022 | claude-3-haiku@20240307 |
| **Tarification** | \$15 / input MTok<br/>\$75 / output MTok | \$3 / input MTok<br/>\$15 / output MTok | \$3 / input MTok<br/>\$15 / output MTok | \$15 / input MTok<br/>\$75 / output MTok | \$0.80 / input MTok<br/>\$4 / output MTok | \$0.25 / input MTok<br/>\$1.25 / output MTok |
| **[Extended thinking](/docs/fr/build-with-claude/extended-thinking)** | Oui | Oui | Oui | Oui | Non | Non |
| **[Priority Tier](/docs/fr/api/service-tiers)** | Oui | Oui | Oui | Oui | Oui | Non |
| **Latence comparative** | Modérée | Rapide | Rapide | Modérée | La plus rapide | Rapide |
| **Fenêtre de contexte** | <Tooltip tooltipContent="~150K words \ ~680K unicode characters">200K tokens</Tooltip> | <Tooltip tooltipContent="~150K words \ ~680K unicode characters">200K tokens</Tooltip> / <br/> <Tooltip tooltipContent="~750K words \ ~3.4M unicode characters">1M tokens</Tooltip> (beta)<sup>1</sup> | <Tooltip tooltipContent="~150K words \ ~680K unicode characters">200K tokens</Tooltip> | <Tooltip tooltipContent="~150K words \ ~680K unicode characters">200K tokens</Tooltip> | <Tooltip tooltipContent="~150K words \ ~215K unicode characters">200K tokens</Tooltip> | <Tooltip tooltipContent="~150K words \ ~680K unicode characters">200K tokens</Tooltip> |
| **Sortie maximale** | 32K tokens | 64K tokens | 64K tokens / 128K tokens (beta)<sup>4</sup> | 32K tokens | 8K tokens | 4K tokens |
| **Cutoff de connaissance fiable** | Jan 2025<sup>2</sup> | Jan 2025<sup>2</sup> | Oct 2024<sup>2</sup> | Jan 2025<sup>2</sup> | <sup>3</sup> | <sup>3</sup> |
| **Cutoff des données d'entraînement** | Mar 2025 | Mar 2025 | Nov 2024 | Mar 2025 | Jul 2024 | Aug 2023 |

_<sup>1 - Claude Sonnet 4 prend en charge une [fenêtre de contexte de 1M tokens](/docs/fr/build-with-claude/context-windows#1m-token-context-window) lors de l'utilisation de l'en-tête beta `context-1m-2025-08-07`. La [tarification du contexte long](/docs/fr/about-claude/pricing#long-context-pricing) s'applique aux demandes dépassant 200K tokens.</sup>_

_<sup>2 - **Cutoff de connaissance fiable** indique la date jusqu'à laquelle les connaissances d'un modèle sont les plus étendues et fiables. **Cutoff des données d'entraînement** est la plage de dates plus large des données d'entraînement utilisées.</sup>_

_<sup>3 - Certains modèles Haiku ont une seule date de cutoff des données d'entraînement.</sup>_

_<sup>4 - Incluez l'en-tête beta `output-128k-2025-02-19` dans votre demande API pour augmenter la longueur maximale du token de sortie à 128K tokens pour Claude Sonnet 3.7. Nous suggérons fortement d'utiliser notre [API Messages en streaming](/docs/fr/build-with-claude/streaming) pour éviter les délais d'expiration lors de la génération de sorties plus longues. Consultez nos conseils sur les [demandes longues](/docs/fr/api/errors#long-requests) pour plus de détails.</sup>_

</section>

## Performance des prompts et des sorties

Les modèles Claude 4 excellent dans :
- **Performance** : Résultats de premier ordre en raisonnement, codage, tâches multilingues, gestion du contexte long, honnêteté et traitement d'images. Consultez le [billet de blog Claude 4](http://www.anthropic.com/news/claude-4) pour plus d'informations.
- **Réponses engageantes** : Les modèles Claude sont idéaux pour les applications qui nécessitent des interactions riches et humaines.

    - Si vous préférez des réponses plus concises, vous pouvez ajuster vos prompts pour guider le modèle vers la longueur de sortie souhaitée. Consultez nos [guides d'ingénierie des prompts](/docs/fr/build-with-claude/prompt-engineering) pour plus de détails.
    - Pour les meilleures pratiques spécifiques de prompting Claude 4, consultez notre [guide des meilleures pratiques Claude 4](/docs/fr/build-with-claude/prompt-engineering/claude-4-best-practices).
- **Qualité de sortie** : Lors de la migration des générations de modèles précédentes vers Claude 4, vous pouvez remarquer des améliorations plus importantes dans les performances globales.

## Migration vers Claude 4.5

Si vous utilisez actuellement des modèles Claude 3, nous recommandons de migrer vers Claude 4.5 pour profiter de l'intelligence améliorée et des capacités renforcées. Pour des instructions de migration détaillées, consultez [Migration vers Claude 4.5](/docs/fr/about-claude/models/migrating-to-claude-4).

## Commencer avec Claude

Si vous êtes prêt à commencer à explorer ce que Claude peut faire pour vous, plongeons-y ! Que vous soyez un développeur cherchant à intégrer Claude dans vos applications ou un utilisateur souhaitant expérimenter la puissance de l'IA en première personne, nous avons ce qu'il vous faut.

<Note>Vous cherchez à discuter avec Claude ? Visitez [claude.ai](http://www.claude.ai) !</Note>

<CardGroup cols={3}>
  <Card title="Introduction à Claude" icon="check" href="/docs/fr/intro">
    Explorez les capacités de Claude et le flux de développement.
  </Card>
  <Card title="Démarrage rapide" icon="lightning" href="/docs/fr/get-started">
    Apprenez comment faire votre premier appel API en quelques minutes.
  </Card>
  <Card title="Claude Console" icon="code" href="/">
    Créez et testez des prompts puissants directement dans votre navigateur.
  </Card>
</CardGroup>

Si vous avez des questions ou avez besoin d'assistance, n'hésitez pas à contacter notre [équipe d'assistance](https://support.claude.com/) ou consultez la [communauté Discord](https://www.anthropic.com/discord).