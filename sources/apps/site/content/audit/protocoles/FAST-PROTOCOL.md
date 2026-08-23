# Protocole d’audit rapide v1.0.0

Ce profil est le mode normal de Design System Audit. Il vise une première correction visible en moins de deux minutes et un audit principal utilisable en quelques minutes. Le protocole approfondi reste disponible dans `PROTOCOL.md` lorsqu’il faut démontrer scientifiquement la plus-value du référentiel.

## Ce que l’audit rapide cherche à produire

Uniquement ce dont une équipe produit a besoin pour agir :

- l’écran concerné ;
- ce qui ne fonctionne pas ;
- pourquoi cela pose problème ;
- ce qu’il faut modifier ;
- la règle utile, lorsqu’elle apporte quelque chose ;
- un prompt applicable dans le projet produit.

Les conformités, les hypothèses non vérifiables et les détails de méthode ne sont pas transformés en findings. Ils ne doivent pas ralentir ni encombrer la restitution.

## 1. Collecte courte

Capturer le parcours principal réellement accessible, dans son ordre naturel :

1. une capture complète par écran distinct ;
2. un état alternatif uniquement s’il apparaît pendant le parcours ou si l’utilisateur l’a explicitement demandé ;
3. aucun inventaire systématique des états serveur, reprise, erreur, clavier ou lecteur d’écran ;
4. aucun texte visible, fait ou inférence à transcrire pendant le crawl ;
5. aucune capture répétée lorsqu’elle n’apporte pas de différence utile.

Le crawl s’arrête lorsque la tâche principale aboutit ou bloque. Ce qui n’a pas été observé reste simplement hors périmètre.

Les images sont déposées dans `audit/private/evidence/<study-id>/`, idéalement sous les noms `E001.png`, `E002.png`… Un `evidence-index.json` minimal suffit :

```json
{
  "browser": "Chrome",
  "source": "Prototype local",
  "records": [
    { "file": "E001.png", "screen_label": "Formulaire vide" },
    { "file": "E002.png", "screen_label": "Erreur après envoi" }
  ]
}
```

Si `records` est vide, l’outil inventorie automatiquement les images présentes. Les identifiants, séquences, dates et empreintes sont calculés localement.

## 2. Analyse unique

Il n’y a ni pré-enregistrement ni audit témoin dans ce profil. Le référentiel est chargé une seule fois, uniquement pour les familles de règles déclenchées par les écrans observés.

Analyser les captures en lot, dans l’ordre du flow. Ne créer un finding que si les trois conditions suivantes sont réunies :

1. un problème ou une tension est visible dans une pièce identifiée ;
2. son impact peut être expliqué en français courant ;
3. une correction, un test ou un arbitrage concret peut être proposé.

Il n’existe pas de quota de recommandations. L’analyse s’arrête lorsqu’aucun nouveau problème actionnable n’apparaît.

## 3. Données minimales à écrire

L’agent ne renseigne que deux fichiers.

### `observations.json`

Une observation par écran utile : `id`, `sequence`, `label`, `facts`, `inferences`, `confidence`, `evidence_ids`. Un seul fait précis peut suffire. Ne pas recopier tout le texte de l’écran.

### `findings.json`

Un finding par problème :

- `id`, `title`, `observation_ids` ;
- `status` parmi `contradicted`, `partial` ou `tension` ;
- les quatre confiances ;
- `rule_refs` limitées aux règles réellement utilisées ;
- `conclusion`, `recommendation`, `success_criterion` ;
- `classification` parmi `corriger`, `tester`, `verifier`, `arbitrage_humain` ;
- `primary_category`, `secondary_categories`, `severity` ;
- `incremental_value: "unproven"` puisqu’aucune baseline n’est produite.

Un bloc optionnel `summary` peut fournir `headline` et `explanation`. Sinon, l’outil génère une synthèse factuelle à partir des findings.

Les fichiers `executive.json`, `scorecard.json`, le manifeste, les empreintes de règles et les builds sont produits ou complétés automatiquement par `fast-audit.js finish`.

## 4. Restitution progressive

Les données peuvent être enregistrées et reconstruites après chaque lot. Une page sans problème ne produit aucun commentaire. La navigation humaine n’affiche par défaut que les pages nécessitant une modification.

## 5. Passage au mode approfondi

Utiliser `PROTOCOL.md` seulement si la question porte sur :

- la mesure de la plus-value propre au référentiel ;
- une comparaison expérimentale avec audit témoin ;
- un audit de conformité exhaustif ;
- des états négatifs, serveur ou technologies d’assistance devant être systématiquement vérifiés ;
- une publication nécessitant une chaîne de preuve complète pré-enregistrée.

Un audit rapide ne doit jamais revendiquer une couverture exhaustive ni une plus-value incrémentale chiffrée.
