---
sujet: adaptive
type: principe
resume: "Architecture adaptative : la page répond au viewport et à l'environnement ; le composant réutilisable répond à l'espace réel de son conteneur"
requires: []
selon-contexte: []
---
# RULES — Principe adaptatif (compilé, condensé)

> Généré depuis `principles/adaptive/ADAPTIVE-UX.md` (v1.1.0) et `ADAPTIVE-UI.md` (v1.1.0).
> La source fait autorité. Ne pas éditer à la main.

## Principe

- **La fenêtre définit la page ; le conteneur définit le composant.**
- Structure globale, navigation et régions de page → viewport / layout global.
- Disposition, densité et divulgation internes d'un composant réutilisable → espace réellement
  disponible dans son conteneur.
- Préférences et capacités (`prefers-reduced-motion`, `forced-colors`, impression, couleur,
  hover/pointer) → Media Queries.

## Choix du mécanisme

| Cause | Outil |
|---|---|
| largeur disponible du composant | Size Container Query |
| structure globale de la page | Media Query ou layout fluide |
| préférence / capacité | Media Query |
| retour à la ligne suffisant | Grid/Flex et tailles intrinsèques, sans seuil |

- Container Query par défaut seulement quand la largeur du composant **cause un changement d'état**.
- Ne pas remplacer un layout intrinsèque qui fonctionne par des seuils.

## États et seuils

- Noms : `compact`, `regular`, `expanded` — jamais mobile/tablet/desktop.
- Seuil dérivé du contenu : basculer quand labels, actions ou structure cessent de tenir, pas à un
  breakpoint d'appareil copié.
- Les seuils peuvent différer entre composants. Limiter leur nombre aux changements structurels réels.
- CSS de base = plus petit état viable ; les états plus riches sont une amélioration progressive.

## Ce qui peut changer

- disposition interne, densité, espacements, informations secondaires, regroupement accessible
  d'actions secondaires ;
- longueur d'un libellé seulement si une alternative validée et un nom accessible complet existent.

## Ce qui ne change jamais

- nature de l'action/navigation, priorité réelle, information nécessaire pour décider, nom
  accessible, risque, erreur ou obligation légale ;
- ordre DOM si l'ordre de lecture ou de focus se dégrade ;
- disponibilité d'une fonction essentielle.

## Implémentation

```css
.region {
  container-type: inline-size;
  container-name: component-region;
}

@container component-region (min-width: 30rem) {
  .component { /* état regular/expanded */ }
}
```

- Préférer `inline-size` quand seule la largeur logique pilote.
- Nommer le conteneur en cas d'imbrication.
- Seuil dans le fichier du composant, avec sa justification ; pas de breakpoint global supplémentaire.
- Ne pas exposer une prop React si CSS peut calculer l'état à partir de l'espace.

## Tests obligatoires

- même viewport, conteneur étroit puis large ;
- contenu court, long et traduit ; zoom et texte accru ;
- juste avant/sur/après chaque seuil ;
- clavier, toucher, sans hover ; focus et valeur conservés après bascule ;
- conteneurs imbriqués ; état compact utilisable sans règles `@container`.
