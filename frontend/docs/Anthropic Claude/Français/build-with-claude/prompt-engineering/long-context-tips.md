# Conseils pour les invites avec contexte long

Conseils pour tirer parti efficacement de la fenêtre de contexte étendue de Claude pour les tâches complexes et riches en données.

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

La fenêtre de contexte étendue de Claude (200K tokens pour les modèles Claude 3) permet de gérer des tâches complexes et riches en données. Ce guide vous aidera à exploiter cette puissance efficacement.

## Conseils essentiels pour les invites avec contexte long

- **Placez les données longues en haut** : Placez vos longs documents et entrées (~20K+ tokens) près du haut de votre invite, au-dessus de votre requête, instructions et exemples. Cela peut améliorer significativement les performances de Claude sur tous les modèles.

    <Note>Les requêtes à la fin peuvent améliorer la qualité des réponses jusqu'à 30% dans les tests, en particulier avec des entrées complexes et multi-documents.</Note>

- **Structurez le contenu et les métadonnées des documents avec des balises XML** : Lorsque vous utilisez plusieurs documents, enveloppez chaque document dans des balises `<document>` avec des sous-balises `<document_content>` et `<source>` (et d'autres métadonnées) pour plus de clarté.

    <section title="Exemple de structure multi-documents">

    ```xml
    <documents>
      <document index="1">
        <source>annual_report_2023.pdf</source>
        <document_content>
          {{ANNUAL_REPORT}}
        </document_content>
      </document>
      <document index="2">
        <source>competitor_analysis_q2.xlsx</source>
        <document_content>
          {{COMPETITOR_ANALYSIS}}
        </document_content>
      </document>
    </documents>

    Analysez le rapport annuel et l'analyse concurrentielle. Identifiez les avantages stratégiques et recommandez les domaines de focus pour le Q3.
    ```
    
</section>

- **Ancrez les réponses dans des citations** : Pour les tâches de longs documents, demandez à Claude de citer d'abord les parties pertinentes des documents avant de mener à bien sa tâche. Cela aide Claude à traverser le « bruit » du reste du contenu du document.

    <section title="Exemple d'extraction de citations">

    ```xml
    Vous êtes un assistant médecin IA. Votre tâche est d'aider les médecins à diagnostiquer les maladies possibles des patients.

    <documents>
      <document index="1">
        <source>patient_symptoms.txt</source>
        <document_content>
          {{PATIENT_SYMPTOMS}}
        </document_content>
      </document>
      <document index="2">
        <source>patient_records.txt</source>
        <document_content>
          {{PATIENT_RECORDS}}
        </document_content>
      </document>
      <document index="3">
        <source>patient01_appt_history.txt</source>
        <document_content>
          {{PATIENT01_APPOINTMENT_HISTORY}}
        </document_content>
      </document>
    </documents>

    Trouvez des citations des dossiers patients et de l'historique des rendez-vous qui sont pertinentes pour diagnostiquer les symptômes signalés par le patient. Placez-les dans des balises <quotes>. Ensuite, en fonction de ces citations, énumérez toutes les informations qui aideraient le médecin à diagnostiquer les symptômes du patient. Placez vos informations diagnostiques dans des balises <info>.
    ```
    
</section>

***

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