# @fili/react — Icônes

Jeu d'icônes React au trait (idiome Lucide : viewBox 24×24, `stroke` 2, bouts/jointures arrondis),
toutes en `currentColor`. L'icône **hérite la couleur du texte parent** — donc le `tone` d'un Button,
le rôle `icon-*` d'un contexte, etc. — et se dimensionne sur les crans de la fondation iconographie.

## Usage

```tsx
import { ArrowRight, Search, Trash } from "@fili/react";

<Search />                    {/* 20px (icon.md) par défaut, currentColor */}
<Search size={16} />          {/* icon.sm — contextes denses */}
<Trash size={24} />           {/* icon.lg — zones aérées */}
<ArrowRight className="text-error-base" />  {/* la couleur suit le texte */}
```

Dans un composant :

```tsx
import { Button, ArrowRight } from "@fili/react";

<Button.Root style="filled" tone="primary">
  Continuer
  <Button.Icon><ArrowRight /></Button.Icon>
</Button.Root>
```

## Règles (fondation iconographie, DS-MD)

- **Tailles** : `16` (sm, dense/inline), `20` (md, défaut — apparié au corps 16px), `24` (lg, aéré).
  Jamais une taille libre : `size` prend un cran, pas une valeur arbitraire.
- **Couleur** : toujours `currentColor`. Ne pas coder une couleur en dur sur l'icône.
- **Accessibilité** : `aria-hidden` par défaut (décorative). Pour une icône **porteuse de sens**
  (bouton icône seule), c'est le conteneur qui porte le `aria-label` — cf. `Button` / `CompactButton`.

## Étendre le jeu

```tsx
import { createIcon } from "@fili/react";
export const Sparkle = createIcon("Sparkle", <path d="M12 3v18M3 12h18" />);
```

## Note sur la provenance

Ce ne sont pas les fichiers officiels Lucide (dépendance non installable dans l'environnement de build)
mais des glyphes maison à la même grammaire visuelle. L'API (`<Icon size=… />`, `currentColor`) est
identique à Lucide-react : un remplacement ultérieur par le vrai paquet ne change pas le code appelant.
