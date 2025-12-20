# Outil bash

L'outil bash permet à Claude d'exécuter des commandes shell dans une session bash persistante, permettant les opérations système, l'exécution de scripts et l'automatisation en ligne de commande.

---

L'outil bash permet à Claude d'exécuter des commandes shell dans une session bash persistante, permettant les opérations système, l'exécution de scripts et l'automatisation en ligne de commande.

## Aperçu

L'outil bash fournit à Claude :
- Une session bash persistante qui maintient l'état
- La capacité d'exécuter n'importe quelle commande shell
- L'accès aux variables d'environnement et au répertoire de travail
- Les capacités de chaînage de commandes et de scripting

## Compatibilité des modèles

| Modèle | Version de l'outil |
|-------|--------------|
| Modèles Claude 4 et Sonnet 3.7 ([obsolète](/docs/fr/about-claude/model-deprecations)) | `bash_20250124` |

<Warning>
Les versions plus anciennes de l'outil ne sont pas garanties d'être rétro-compatibles avec les modèles plus récents. Utilisez toujours la version de l'outil qui correspond à votre version de modèle.
</Warning>

## Cas d'usage

- **Flux de travail de développement** : Exécuter des commandes de construction, des tests et des outils de développement
- **Automatisation système** : Exécuter des scripts, gérer les fichiers, automatiser les tâches
- **Traitement des données** : Traiter les fichiers, exécuter des scripts d'analyse, gérer les ensembles de données
- **Configuration de l'environnement** : Installer des packages, configurer les environnements

## Démarrage rapide

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[
        {
            "type": "bash_20250124",
            "name": "bash"
        }
    ],
    messages=[
        {"role": "user", "content": "List all Python files in the current directory."}
    ]
)
```

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "tools": [
      {
        "type": "bash_20250124",
        "name": "bash"
      }
    ],
    "messages": [
      {
        "role": "user",
        "content": "List all Python files in the current directory."
      }
    ]
  }'
```
</CodeGroup>

## Fonctionnement

L'outil bash maintient une session persistante :

1. Claude détermine quelle commande exécuter
2. Vous exécutez la commande dans un shell bash
3. Retournez la sortie (stdout et stderr) à Claude
4. L'état de la session persiste entre les commandes (variables d'environnement, répertoire de travail)

## Paramètres

| Paramètre | Requis | Description |
|-----------|----------|-------------|
| `command` | Oui* | La commande bash à exécuter |
| `restart` | Non | Définir à `true` pour redémarrer la session bash |

*Requis sauf si vous utilisez `restart`

<section title="Exemple d'utilisation">

```json
// Exécuter une commande
{
  "command": "ls -la *.py"
}

// Redémarrer la session
{
  "restart": true
}
```

</section>

## Exemple : Automatisation multi-étapes

Claude peut chaîner des commandes pour accomplir des tâches complexes :

```python
# Demande de l'utilisateur
"Install the requests library and create a simple Python script that fetches a joke from an API, then run it."

# L'outil de Claude utilise :
# 1. Installer le package
{"command": "pip install requests"}

# 2. Créer le script
{"command": "cat > fetch_joke.py << 'EOF'\nimport requests\nresponse = requests.get('https://official-joke-api.appspot.com/random_joke')\njoke = response.json()\nprint(f\"Setup: {joke['setup']}\")\nprint(f\"Punchline: {joke['punchline']}\")\nEOF"}

# 3. Exécuter le script
{"command": "python fetch_joke.py"}
```

La session maintient l'état entre les commandes, donc les fichiers créés à l'étape 2 sont disponibles à l'étape 3.

***

## Implémenter l'outil bash

L'outil bash est implémenté comme un outil sans schéma. Lors de l'utilisation de cet outil, vous n'avez pas besoin de fournir un schéma d'entrée comme avec d'autres outils ; le schéma est intégré au modèle de Claude et ne peut pas être modifié.

<Steps>
  <Step title="Configurer un environnement bash">
    Créez une session bash persistante avec laquelle Claude peut interagir :
    ```python
    import subprocess
    import threading
    import queue
    
    class BashSession:
        def __init__(self):
            self.process = subprocess.Popen(
                ['/bin/bash'],
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                bufsize=0
            )
            self.output_queue = queue.Queue()
            self.error_queue = queue.Queue()
            self._start_readers()
    ```
  </Step>
  <Step title="Gérer l'exécution des commandes">
    Créez une fonction pour exécuter les commandes et capturer la sortie :
    ```python
    def execute_command(self, command):
        # Envoyer la commande à bash
        self.process.stdin.write(command + '\n')
        self.process.stdin.flush()
        
        # Capturer la sortie avec délai d'attente
        output = self._read_output(timeout=10)
        return output
    ```
  </Step>
  <Step title="Traiter les appels d'outils de Claude">
    Extrayez et exécutez les commandes des réponses de Claude :
    ```python
    for content in response.content:
        if content.type == "tool_use" and content.name == "bash":
            if content.input.get("restart"):
                bash_session.restart()
                result = "Bash session restarted"
            else:
                command = content.input.get("command")
                result = bash_session.execute_command(command)
            
            # Retourner le résultat à Claude
            tool_result = {
                "type": "tool_result",
                "tool_use_id": content.id,
                "content": result
            }
    ```
  </Step>
  <Step title="Implémenter les mesures de sécurité">
    Ajoutez la validation et les restrictions :
    ```python
    def validate_command(command):
        # Bloquer les commandes dangereuses
        dangerous_patterns = ['rm -rf /', 'format', ':(){:|:&};:']
        for pattern in dangerous_patterns:
            if pattern in command:
                return False, f"Command contains dangerous pattern: {pattern}"
        
        # Ajouter plus de validation selon les besoins
        return True, None
    ```
  </Step>
</Steps>

### Gérer les erreurs

Lors de l'implémentation de l'outil bash, gérez divers scénarios d'erreur :

<section title="Délai d'attente d'exécution de la commande">

Si une commande prend trop de temps à s'exécuter :

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Error: Command timed out after 30 seconds",
      "is_error": true
    }
  ]
}
```

</section>

<section title="Commande non trouvée">

Si une commande n'existe pas :

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "bash: nonexistentcommand: command not found",
      "is_error": true
    }
  ]
}
```

</section>

<section title="Permission refusée">

S'il y a des problèmes de permission :

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "bash: /root/sensitive-file: Permission denied",
      "is_error": true
    }
  ]
}
```

</section>

### Suivre les meilleures pratiques d'implémentation

<section title="Utiliser les délais d'attente des commandes">

Implémentez les délais d'attente pour éviter les commandes qui se bloquent :
```python
def execute_with_timeout(command, timeout=30):
    try:
        result = subprocess.run(
            command, 
            shell=True, 
            capture_output=True, 
            text=True, 
            timeout=timeout
        )
        return result.stdout + result.stderr
    except subprocess.TimeoutExpired:
        return f"Command timed out after {timeout} seconds"
```

</section>

<section title="Maintenir l'état de la session">

Gardez la session bash persistante pour maintenir les variables d'environnement et le répertoire de travail :
```python
# Les commandes exécutées dans la même session maintiennent l'état
commands = [
    "cd /tmp",
    "echo 'Hello' > test.txt",
    "cat test.txt"  # Cela fonctionne parce que nous sommes toujours dans /tmp
]
```

</section>

<section title="Gérer les grandes sorties">

Tronquez les très grandes sorties pour éviter les problèmes de limite de jetons :
```python
def truncate_output(output, max_lines=100):
    lines = output.split('\n')
    if len(lines) > max_lines:
        truncated = '\n'.join(lines[:max_lines])
        return f"{truncated}\n\n... Output truncated ({len(lines)} total lines) ..."
    return output
```

</section>

<section title="Enregistrer toutes les commandes">

Conservez une piste d'audit des commandes exécutées :
```python
import logging

def log_command(command, output, user_id):
    logging.info(f"User {user_id} executed: {command}")
    logging.info(f"Output: {output[:200]}...")  # Enregistrer les 200 premiers caractères
```

</section>

<section title="Nettoyer les sorties">

Supprimez les informations sensibles des sorties de commande :
```python
def sanitize_output(output):
    # Supprimer les secrets ou identifiants potentiels
    import re
    # Exemple : Supprimer les identifiants AWS
    output = re.sub(r'aws_access_key_id\s*=\s*\S+', 'aws_access_key_id=***', output)
    output = re.sub(r'aws_secret_access_key\s*=\s*\S+', 'aws_secret_access_key=***', output)
    return output
```

</section>

## Sécurité

<Warning>
L'outil bash fournit un accès direct au système. Implémentez ces mesures de sécurité essentielles :
- Exécution dans des environnements isolés (Docker/VM)
- Implémentation du filtrage des commandes et des listes blanches
- Définition des limites de ressources (CPU, mémoire, disque)
- Enregistrement de toutes les commandes exécutées
</Warning>

### Recommandations clés
- Utilisez `ulimit` pour définir les contraintes de ressources
- Filtrez les commandes dangereuses (`sudo`, `rm -rf`, etc.)
- Exécutez avec des permissions utilisateur minimales
- Surveillez et enregistrez toute exécution de commande

## Tarification

The bash tool adds **245 input tokens** to your API calls.

Additional tokens are consumed by:
- Command outputs (stdout/stderr)
- Error messages
- Large file contents

Voir [tarification de l'utilisation des outils](/docs/fr/agents-and-tools/tool-use/overview#pricing) pour les détails complets de la tarification.

## Modèles courants

### Flux de travail de développement
- Exécuter des tests : `pytest && coverage report`
- Construire des projets : `npm install && npm run build`
- Opérations Git : `git status && git add . && git commit -m "message"`

### Opérations sur les fichiers
- Traiter les données : `wc -l *.csv && ls -lh *.csv`
- Rechercher des fichiers : `find . -name "*.py" | xargs grep "pattern"`
- Créer des sauvegardes : `tar -czf backup.tar.gz ./data`

### Tâches système
- Vérifier les ressources : `df -h && free -m`
- Gestion des processus : `ps aux | grep python`
- Configuration de l'environnement : `export PATH=$PATH:/new/path && echo $PATH`

## Limitations

- **Pas de commandes interactives** : Impossible de gérer `vim`, `less` ou les invites de mot de passe
- **Pas d'applications GUI** : Ligne de commande uniquement
- **Portée de la session** : Persiste dans la conversation, perdue entre les appels API
- **Limites de sortie** : Les grandes sorties peuvent être tronquées
- **Pas de streaming** : Les résultats retournés après la fin

## Combinaison avec d'autres outils

L'outil bash est plus puissant lorsqu'il est combiné avec l'[éditeur de texte](/docs/fr/agents-and-tools/tool-use/text-editor-tool) et d'autres outils.

## Étapes suivantes

<CardGroup cols={2}>
  <Card
    title="Aperçu de l'utilisation des outils"
    icon="tool"
    href="/docs/fr/agents-and-tools/tool-use/overview"
  >
    En savoir plus sur l'utilisation des outils avec Claude
  </Card>

  <Card
    title="Outil éditeur de texte"
    icon="file"
    href="/docs/fr/agents-and-tools/tool-use/text-editor-tool"
  >
    Afficher et modifier des fichiers texte avec Claude
  </Card>
</CardGroup>