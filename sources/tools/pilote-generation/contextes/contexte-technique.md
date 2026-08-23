# Contexte technique (identique dans toutes les conditions)

Tu produis un fichier React (.jsx) utilisant le package `@fili/react`. Informations strictement techniques :

## Composants disponibles (import nommé depuis '@fili/react')

Accordion, Alert, AppLayout, AppShell, Button, Card, CardGroup, CompactButton, Container, DeleteButton, Divider, Drawer, Input, Link, Modal, Nav, SkipLink, Select, SubmitButton, Switch, Tabs, Toast.

## API des composants principaux

- `Button` — rend un `<button>`. Props : `style` = `'filled' | 'stroke' | 'lighter' | 'ghost'` (défaut `'filled'`), `tone` = `'primary' | 'neutral' | 'destructive'` (défaut `'primary'`), `size` = `'sm' | 'md' | 'lg'` (défaut `'md'`), `iconOnly` (booléen), `disabled`, `onClick`, `asChild`.
- `Link` — rend un `<a>`. Props : `href` (requis), `asChild`.
- `Card` — surface de contenu. Props : `mode` = `'static' | 'clickable' | 'selectable' | 'expandable'` (défaut `'static'`), `density` = `'comfortable' | 'compact'`. Enfants libres.
- `CardGroup` — grille de cartes. Enfants : des `Card`.
- `Input` — champ de saisie avec label. Props : `label`, `type`, `required`, `helperText`, `error`.
- `Select`, `Switch` — contrôles de choix, API analogue à Input (`label`, …).
- `SubmitButton` — bouton de soumission de formulaire (gère l'état d'envoi).
- `CompactButton` — bouton compact à icône pour espaces contraints. Props : `aria-label` (requis), `icon`.
- `Alert` — message d'état. Props : `tone`, `title`.
- `Modal`, `Drawer`, `Toast`, `Tabs`, `Nav`, `Accordion` — API standard (open/onClose, etc.).

## Contraintes techniques

- Un seul fichier, JSX valide, un composant exporté par défaut.
- Icônes : `import { NomIcone } from '@fili/react/icons'` (noms libres plausibles).
- Le style visuel est porté par les composants du package ; classes utilitaires possibles pour la mise en page (`flex`, `grid`, `gap-*`, `p-*`…).
- Les handlers peuvent être des stubs (`() => {}` ou `console.log`).
