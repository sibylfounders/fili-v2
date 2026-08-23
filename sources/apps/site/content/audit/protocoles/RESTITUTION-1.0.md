# Restitution — gabarit de lecture (v1.0)

> Comment un audit se donne à lire. Ce document régit la **couche de lecture** de tout livrable
> destiné à un humain (rapports `reports/`, synthèses, exports remis à un client). Il ne modifie
> aucun protocole de collecte ni de preuve : les protocoles gelés restent gelés, ce gabarit
> s'applique *après* eux, au moment d'écrire ce que quelqu'un va lire.

## Le principe

Un audit produit deux choses de nature différente : un **jugement** (est-ce ok, à quel degré, que
faire) et une **preuve** (ce qui a été observé, quelle règle, quelle source, quelle confiance).
Le lecteur veut le jugement ; la preuve n'existe que pour qu'il puisse le contester. Tout document
qui présente la preuve comme couche de lecture échoue — la charge cognitive fait abandonner avant
la première décision.

D'où le contrat : **verdict d'abord, traçabilité en annexe.** Jamais l'inverse, jamais mélangés.

## Structure de la couche de lecture

Dans cet ordre, sans section optionnelle avant l'annexe :

1. **Le verdict** — une ligne : ok ou pas, à quel degré, où ça pèche. Échelle à trois positions par constat : 🔴 à corriger · 🟠 à alléger ou discuter · 🟢 à garder. Le verdict global compte les positions (« 1 rouge, 4 orange ») au lieu d'agréger une note — la note chiffrée a été retirée volontairement de l'interface d'audit, la même décision s'applique ici.
2. **Deux à trois points à retenir** — hiérarchisés, chacun en trois temps : le fait, pourquoi c'est grave (ou bien), la propriété à atteindre. Si l'IA a déjà résolu le point, dire *ce qui a été fait* au lieu de *ce qu'il faut faire*.
3. **La table écran-par-écran** (ou étape-par-étape) — une ligne par écran : verdict, le problème en une phrase, quoi faire en une phrase. Une ligne ⚪ pour ce qui n'a pas pu être observé.
4. **Ce qui est bien fait** — court, réel, copiable. Un audit qui ne sait pas dire ce qui est juste n'est pas crédible sur ce qui est faux.
5. **Les variantes ou le chemin de sortie** — si le format s'y prête : ce qu'on gagne, ce qu'on paie.
6. **L'annexe de traçabilité** — le format complet par constat (observé, principe cité en toutes lettres, confiance, sévérité, propriétaire, recommandation), présentée pour ce qu'elle est : « on y descend depuis un verdict qu'on veut contester ou sourcer, on ne la lit pas de bout en bout ».

## La langue

La couche de lecture suit `GLOSSAIRE-RESTITUTION-1.0.md` : anglicismes de métier gardés tels quels,
jargon interne traduit en langue d'usage, aucune métaphore maison sans définition. L'annexe et les
RULES gardent le vocabulaire exact du système — c'est leur rôle.

## Ce que ce gabarit ne couvre pas (encore)

La synthèse affichée par le site d'audit (`audit/public`) est générée par `tools/build.js` depuis
les études ; l'aligner sur ce gabarit est une évolution du générateur, à mener comme telle —
ce document n'impose rien au site tant que ce branchement n'a pas été décidé et fait.

---

*v1.0 — 2026-07-21. Origine : retour d'usage sur l'audit de décisions Strava (un lecteur senior UX
ne pouvait pas utiliser le format traçabilité-en-couche-de-lecture). Document courant, non gelé par
les études ; toute évolution incrémente la version dans le nom du fichier.*
