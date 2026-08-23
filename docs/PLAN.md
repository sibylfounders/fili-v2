# Le plan

> **Où on va.** Ce fichier répond à une question que les deux autres ne posent
> pas : `system-map.md` dit où on en est, `journal.md` dit pourquoi on en est là,
> celui-ci dit ce qu'on fait ensuite et dans quel ordre.
>
> **Arrêté le 23 août 2026** — validation d'Auteur du « cap du kit ». Le plan
> précédent (arrêté le 11 août, relevé le 12) vit dans l'historique du dépôt ;
> rien n'en est supprimé, tout se rouvre par une entrée de journal. Ce fichier
> se réécrit quand la direction change, et ce changement passe par une entrée
> de journal.

---

## Le cap

**Le kit se reconstruit par les notions mères — Principes, Langages,
Fondations — dans le kit existant.** Composants et patterns sont **gelés**
jusqu'au verrou des fondations : toute reprise anticipée serait une rupture
déclarée, jamais un glissement.

**L'identité du kit** : chaque élément d'interface montre les lois qui l'ont
construit — identifiants cliquables, énoncé en clair, source et arbitrage
datés, playground qui montre la règle en action, theming qui prouve qu'elle
tient sous réglages. Pas un design system de plus : un design system qui
montre ses raisons.

---

## L'ordre

### Phase 1 · Typographie & Rythme — les deux fondations à écrire

Les seules familles sans paquet de reprise. Pour chacune : inventaire, puis
règles sur papier au moule V2 (énoncé, mesure décidable sans contexte, test
esquissé, dépendance dite), présentées une par une à l'Auteur, verdict à
chaque fois. La typographie part de ses trois verdicts de ménage et des
sources déjà arbitrées ; le rythme part de l'Échelle Semantic Rhythm, qui
fait foi.

### Phase 2 · Les quatre paquets écrits entrent au corpus

Arrondis, tactile, couleur, bordures — famille par famille, avec leurs
exécutions commandées (la remontée du gris pâle au registre, la correction
des superposés) et la tenue (l'entrée bordures au journal). La carte des
écarts du 23 août fait foi sur le détail.

### Phase 3 · Les cinq familles restantes

Surfaces, élévation, grille, iconographie, superpositions — même mécanique.
L'ordre interne se choisit au fil de l'eau.

### Phase 4 · Le verrou, puis les composants

Fondations complètes et verrouillées → reprise des composants et patterns
un à un, chacun naissant avec sa fiche « les lois qui m'ont construit »,
spécifiée en langage de règles avant d'être implémentée.

### ∥ Le fil continu : l'atelier

Theming et playground suivent chaque phase : chaque fondation reprise devient
aussitôt visible et réglable dans l'atelier. Le registre des composants typés
et l'instrument de rendu gardent leurs threads propres ; les règles qui en
dépendent portent « refus de statuer » en attendant, comme écrit dans les
paquets.

---

## La doctrine d'agnosticisme

**Le normatif, c'est la règle et le jeton. Toute implémentation n'est qu'un
exemple.** Les règles vivent en markdown avec leurs identifiants stables ;
les jetons sortent d'un seul calcul vers plusieurs cibles (CSS, Tailwind,
Figma — d'autres peuvent naître). Les composants React du site sont une
implémentation de démonstration, jamais la référence : un portage futur
n'invalide rien, parce que rien de normatif ne vit dans le code d'exemple.
La spec est la vérité, le code la démontre.

---

## Ce que ce plan ne décide pas

Le nommage du code (français, choix d'identité — un passage aux conventions
du marché serait son propre chantier, sur décision d'Auteur) · le sort du
site public et des deux branches GitHub · la forme exacte des fiches de lois
(se dessine au premier composant de la phase 4) · l'ordre interne de la
phase 3.

---

## L'ordre des dépendances

La phase 2 peut s'intercaler dans la phase 1 (matière déjà validée, familles
indépendantes). La phase 3 suit. La phase 4 dépend de toutes les autres.
L'atelier avance en parallèle de tout.
