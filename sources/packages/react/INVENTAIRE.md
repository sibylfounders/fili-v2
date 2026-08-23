# Inventaire de référence — `@fili/react`

> Photographie exhaustive du kit au 2026-07-29 (commit c1cb201 + chantier cohérence).
> Ce fichier est le **constat** ; la source machine-readable qui a vocation à le remplacer
> vit dans `packages/react/src/manifest/`. Quand les deux divergent, le manifeste fait foi
> pour l'API, ce fichier pour l'historique des écarts relevés.

## Chiffres

| Mesure | Valeur |
|---|---|
| Composants exportés du baril `@fili/react` | 27 / 27 dossiers (aucun marqué interne ou expérimental) |
| Composants `@fili/charts` | 12 (7 charts + 5 widgets) |
| Paire doctrinale UX/UI propre | 11 (accordion, alert, button, card, input, link, modal, select, switch, tabs, toast) |
| Couverts par un pattern ou une fondation seulement | 9 (card-group→COLLECTION, container→GRID, delete-button→BUTTON§E-motion, divider→BORDER, drawer→OVERLAY, dropdown→OVERLAY, nav/skip-link/toc→NAVIGATION, submit-button→BUTTON+FORM) |
| Sans doctrine du tout | 4 (app-layout, app-shell, skeleton, theme-toggle) + les 12 de charts |
| Présents dans l'atelier | 26/27 react (manque app-shell) + 8/12 charts (manquent Sparkline, ChartFrame, ProgressCircle, UsageSummary) |
| Avec extrait de code dans l'atelier | tous les présents (chaîne `code()` écrite à la main, non compilée) |
| Avec matrice d'états formalisée en doctrine | 6 (card, link, modal, switch, tabs, toast) |
| Avec tests (unitaires, E2E, visuels) | **0** |

## Table par composant

Statut : `public` = exporté du baril et assumé. `public-mort` = exporté mais sans consommateur.
`expressif` = couche E-motion (portage assumé). Axes : seuls les axes de variation publics sont listés
(défaut souligné par `*`).

| Composant | Statut | Catégorie | Axes publics (défaut*) | Doctrine | Atelier | Écarts relevés |
|---|---|---|---|---|---|---|
| Accordion | public | contenu | type single/multiple* ; Header level 2-6 (3*) | ACCORDION 1.0.0/1.0.0 | oui (statique) | — |
| Alert | public | message | tone info*/success/warning/danger ; live | ALERT 1.4.0/1.4.0 | oui | focus Close en `outline-primary` (≠ accent) — corrigé chantier cohérence |
| AppLayout | public | gabarit | variant default*/docs ; collapsible ; nombreux slots | **aucune** | oui | z-index 40 en dur ; text-[10-13px] arbitraires ; rounded-full vs rounded-pill |
| AppShell | public-mort | gabarit | — (3 régions) | aucune | **non** | zéro usage dans apps/site ; candidat statut `interne` (primitive sous AppLayout) |
| Brand | public | identité | asChild | aucune (verrou décrit dans NAVIGATION) | oui (statique) | — |
| Button | public | contrôle | variant filled*/stroke/lighter/ghost (ex-`style`, alias déprécié) ; tone primary*/neutral/destructive ; size sm/md*/lg ; iconOnly ; loading | BUTTON 1.9.0/1.6.2 | oui | doctrine annonçait tone `warning` inexistant (retiré — arbitrage 2026-07-29) ; focus ring accordé au ton (unifié accent — arbitrage 2026-07-29) |
| Card | public | surface | mode static*/clickable/selectable/expandable ; density comfortable*/compact ; selected ; loading ; Media ratio | CARD 1.4.1/1.5.2 | oui | z-[1] arbitraires ; doctrine CARD pas encore réalignée sur le mode transversal (lot 29/07) |
| CardGroup | public | collection (pattern) | cols 1-4/auto* ; density comfortable*/compact ; mode ; separated ; outlined ; solo ; proximity ; loading ; label — enfants = de VRAIES Card (l'API CardGroup.Card est supprimée, 2026-07-30) | COLLECTION 1.0.2/1.0.0 | oui | dette CSS historique résorbée avec le rétablissement des frontières (les affleurements d'item vivent dans card.css, tokenisés) |
| CompactButton | public | contrôle | variant (lighter*) ; tone (neutral*) ; size sm/md* ; fullRadius ; loading | dérivé BUTTON | oui | mêmes écarts focus que Button (corrigés) |
| Container | public | gabarit | size narrow/default*/wide/full | fondation GRID | oui | — |
| DeleteButton | expressif | contrôle | size sm/md/lg* ; libellés | BUTTON §E-motion (point ouvert) | oui | #030712/#fff/rgba pressé en dur (motifs relief partagés) |
| Divider | public | structure | orientation ; decorative | fondation BORDER | oui (statique) | — |
| Drawer | public | superposé | side start*/end/top/bottom ; effect overlay*/push ; depth ; size narrow/default/wide/full (double lecture) | fondation OVERLAY, **pas de paire propre** | oui | atelier réimplémente à la main la logique effect/size du composant ; drawer.css `#030712` en dur |
| Dropdown | public | superposé | Content side/align auto* ; Item icon/checked/closeOnClick ; Inline | fondation OVERLAY, **pas de paire propre** | oui | items sans ring (fond glissant — divergence documentée) ; max-w-[18rem] dupliqué |
| Input | public | champ | size sm/md*/lg ; status default*/error/success/warning ; clearable ; sous-composants Password/Search/Number/Textarea | INPUT 1.7.1/1.6.0 | oui | doctrine dit encore `tone`/`neutral` (API renommée 2026-07-29) ; focus `:focus` + 2px en dur (corrigé :focus-visible + tokens) ; l'atelier simule une prop `type` qui n'existe pas sous cette forme |
| Link | public | contrôle | context inline/standalone*/navigation ; current | LINK 1.1.0/1.1.0 | oui | — (1er consommateur accent, conforme BORDER) |
| Modal | public | superposé | size narrow*/default/wide ; placement ; enterFrom ; dismissOnScrim | MODAL 1.0.0/1.0.1 | oui | doctrine dit « deux crans » ; le code a `wide` (doctrine en retard) |
| Nav | public | navigation | Root label ; Link current | NAVIGATION 1.0.0 | oui (statique) | — |
| Select | public | champ | options/value/onValueChange ; variant default*/ghost ; size sm/md*/lg ; native ; loading | SELECT 1.0.0/1.0.0 | oui | fiche muette sur `variant` ; max-w-[18rem] dupliqué |
| Skeleton | public | affichage | variant block*/text/circle ; width/height/lines | **aucune mention** | oui | composant né du lot 29/07, doctrine à écrire |
| SkipLink | public | navigation | href ; children | NAVIGATION | oui (statique) | — |
| SubmitButton | expressif | contrôle | size sm/md/lg* ; libellés | BUTTON + FORM (S21) | oui | `rgba(79,70,229,.35)` = indigo en dur (≠ var(--primary)) ; motifs relief dupliqués |
| Switch | public | champ | checked ; size sm/md*/lg ; label ; loading | SWITCH 1.0.0/1.0.0 | oui | `bg-neutral-200` palette Tailwind par défaut (corrigé chantier cohérence) |
| Tabs | public | navigation | variant line*/pill ; activation auto*/manual ; keepMounted | TABS 1.0.0/1.0.0 | oui | p-[3px] arbitraire ; z-[1] |
| ThemeToggle | public | contrôle | checked ; size sm/md*/lg ; label ; loading | **aucune mention** | oui (checked non pilotable) | focus `var(--primary)` + 2px en dur (corrigé accent + tokens) ; radius/ombre/font-size en dur |
| Toast | public | message | tone info/success/warning/danger/neutral* ; closing auto*/close/timer ; Provider placement | TOAST 1.0.1/1.1.0 | oui | doctrine affirme « pas de tone neutre » (renommage reverse→neutral 29/07 non répercuté) ; z-index 60 en dur ; focus outline-primary (corrigé) |
| TableOfContents | public | navigation | items ; label | NAVIGATION | oui (statique) | — |

## Ce que l'inventaire fait remonter

1. **Un composant sans doctrine** : AppLayout, AppShell, Skeleton, ThemeToggle (+charts). À doter
   ou à requalifier (AppShell → interne).
2. **Une doctrine sans composant** : aucune — mais deux fondations (OVERLAY) portent seules
   Drawer/Dropdown qui mériteraient leur paire.
3. **API documentée mais inexistante** : tone `warning` (Button, retiré de la doctrine),
   `tone`/`neutral` sur Input (renommé `status`/`default`), « deux crans » de Modal (le code a `wide`),
   « pas de tone neutre » de Toast (le code a `neutral`), script `tools/test-rendu.js` cité par
   BUTTON-UI mais absent du dépôt.
4. **Non exposé dans l'atelier** : AppShell ; Sparkline, ChartFrame, ProgressCircle, UsageSummary.
5. **Variables absentes** : `--border-focus-width`/`--border-focus-offset` (card-group.css) —
   les vrais noms sont `--focus-width`/`--focus-offset`.
6. **Recréation de comportements transversaux** : le trio relief posé/pressé (button/relief.css,
   delete-button.css, submit-button.css — trois alphas différents pour la même ombre pressée),
   le focus ring recomposé de 4 façons, `#030712`/`#fff` au lieu des tokens, z-index 40/60 hors
   échelle, rounded-full vs rounded-pill.

## Distribution aux agents (constat au 29/07)

Le paquet livré (`build/design-system-md.plugin`, empaqueté depuis `tools/plugin/rules/`) était
**figé au 26/07** : 6 fiches sur 11 en retard de version sur les sources (button, card, input,
alert, link, toast), dont RULES-button proposant le tone `warning`. `dist/build` et `dist/audit`
étaient à jour. Le paquet ne contient aucun contrat d'implémentation (imports, props, défauts) —
c'est l'objet du catalogue dérivé du manifeste (chantier cohérence).
