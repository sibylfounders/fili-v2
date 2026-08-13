# Inventaire des cas d'usage — Accordion (disclosure)

> Checklist de couverture pour `ACCORDION-UX.md`.

---

## 1. Par usage

| Cas d'usage | Description | Statut |
|---|---|---|
| Groupes de navigation | Replier les sections du rail de nav | Couvert (usage moteur) |
| FAQ | Questions/réponses dépliables | Couvert |
| Réglages avancés | Cacher les options rares jusqu'au besoin | Couvert |
| Révéler un détail (disclosure seul) | Un seul en-tête + une région | Couvert |

## 2. Par comportement d'ouverture

| Cas d'usage | Description | Statut |
|---|---|---|
| Multi-ouvert | Plusieurs sections ouvertes à la fois | Couvert (défaut) |
| Single-open | Ouvrir une section referme les autres | Couvert (option, jamais imposée) |
| État conservé | Le contenu masqué n'est pas détruit | Couvert |

## 3. Par contenu de la région

| Cas d'usage | Description | Statut |
|---|---|---|
| Liens | Une région qui contient des liens de nav | Couvert (renvoi link) |
| Formulaire | Champs révélés à la demande | Couvert ; ne jamais voler le focus |
| Superposé (modal) | Un contenu qui recouvre et piège | hors périmètre — c'est `overlay`, pas un accordion |
