# Protocole du composant manquant — version 1.0.0 (2026-07-29)

> Ce que fait un agent (ou un humain) quand le composant dont il a besoin n'existe pas
> dans `@fili/react`. Les sites consommateurs **révèlent** les manques ; ils ne les
> comblent jamais silencieusement. Ce protocole prolonge la Méthode (étape 1 : cadrage,
> test de transposition, frontières) côté kit.

## L'ordre obligatoire

1. **Réutiliser** — chercher l'équivalent dans le manifeste (`packages/react/src/manifest/`)
   et le catalogue. Beaucoup de « manques » sont des composants mal nommés ailleurs :
   un « sheet » est un Drawer ancré top/bottom ; un « menu » est un Dropdown ; une
   « checkbox à effet immédiat » est un Switch.
2. **Composer** — vérifier si des composants existants couvrent le besoin par composition
   (les recettes du catalogue : Form = Input+Select+Button+Alert ; Collection =
   CardGroup+Card+Link…).
3. **Qualifier** — déterminer la nature du besoin :
   - un **composant** (responsabilité réutilisable, API propre) ;
   - un **pattern** (orchestration de composants existants) ;
   - une **variation** d'un composant (nouvel axe ou nouvelle valeur) ;
   - un **élément local** (spécifique à une page, sans vocation à être partagé) ;
   - une **fonctionnalité métier** (jamais un composant du kit) ;
   - un simple **exemple** (à montrer dans l'atelier, pas à publier).
4. **Proposer** — produire une fiche de manque (modèle ci-dessous).
5. **Faire valider** — aucune API publique ne naît sans arbitrage d'Aurélien. En attendant,
   l'implémentation locale est tolérée si elle est marquée `/* FILI-MANQUE: <slug> */`
   (le validateur de consommation la recense au lieu de la sanctionner).
6. **Créer la tranche verticale complète** (ci-dessous) une fois validé.
7. **Publier** — le site consommateur bascule sur la version officielle et supprime
   l'implémentation locale.

## La fiche de manque

À déposer dans `content/md/inventaires/manques/<slug>.md` :

```markdown
# Manque : <nom pressenti>
- Besoin rencontré :
- Contexte réel (page, produit, capture) :
- Fréquence prévisible :
- Autres consommateurs possibles :
- Composants proches et pourquoi ils ne suffisent pas :
- Pourquoi la composition existante ne suffit pas :
- Responsabilité proposée (une phrase) :
- Limites (ce que le composant ne fera PAS) :
- Anatomie :
- API candidate (axes du Contract uniquement) :
- Tokens nécessaires (rôles existants d'abord) :
- Langages concernés (interaction, débordement…) :
- Règles accessibles :
- Comportement adaptatif :
- Coût de maintenance estimé :
- Risque de doublon :
- Recommandation : local / composition / pattern / variation / nouveau composant
```

## Interdictions

Un agent ne doit jamais :

- créer un composant public pour un seul cas hypothétique ;
- ajouter un composant directement dans un site consommateur puis le laisser diverger ;
- écrire la documentation sans le composant, ni le composant sans la documentation ;
- ajouter une prop uniquement pour reproduire un détail graphique local ;
- créer une valeur de token sans propriétaire (toute valeur entre par DESIGN.md ou
  tokens.source.mjs avec sa justification) ;
- appeler « composant » une fonctionnalité métier complète.

## La tranche verticale obligatoire

Après validation, un composant public n'existe que si tout ceci est livré :

```
Besoin réel → Doctrine UX → Doctrine UI → Cas d'usage (inventaire) → Manifeste
→ Tokens nécessaires → Composant @fili/react → Atelier → Exemple canonique compilable
→ Tests visuels → Tests d'API et d'accessibilité → Catalogue distribué aux agents
```

Si une couche manque, le composant entre avec `status: "experimental"` dans le manifeste :
il n'est **pas** proposé automatiquement aux agents par le catalogue, et le validateur
de manifeste signale la dette à chaque build. Le précédent à ne pas reproduire :
CardGroup est né dans `apps/site` puis a été promu — la promotion a marché, mais la
période de divergence silencieuse est exactement ce que ce protocole supprime.
