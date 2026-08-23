# Inventaire des cas d'usage — Voix & ton (fondation)

> Miroir des inventaires de fondations, adapté à une fondation de **contenu** : on inventorie les *moments d'écriture* du produit — chaque endroit où un mot est adressé à l'utilisateur — pas les variantes d'un atome. Sert de checklist au test de couverture de `VOICE-UX.md`. La couche UX porte les principes (voix constante, ton variable) ; la couche UI porte le lexique et les mécaniques (`VOICE-UI.md`). Les gabarits de wording déjà écrits dans BUTTON, INPUT, ALERT et FORM restent la propriété de ces fichiers — cette fondation les **consolide et les nomme**, elle ne les déplace pas.
>
> Particularité : contrairement aux 8 autres fondations, celle-ci a **deux natures de « ton »**. Le ton varie selon l'*état émotionnel* de l'utilisateur (erreur ≠ succès) — c'est le quasi-axe de la fondation, inventorié en section 4.

---

## 1. Par type de message

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Libellé d'action (bouton) | Verbe + objet, décrit la conséquence | Couvert par renvoi — BUTTON-UX (§ Wording) fait autorité ; VOICE consolide la règle « verbe qui décrit le bénéfice » |
| Titre / en-tête | Titre de page, de section, de carte | Couvert — sentence case, un seul h1 (renvoi TYPOGRAPHY pour la hiérarchie, VOICE pour la casse et la formulation) |
| Label de champ | Nom du champ de saisie | Couvert par renvoi — INPUT ; VOICE fixe la casse et la concision |
| Texte d'aide (helper) | Aide persistante sous le label, avant saisie | Couvert par renvoi — INPUT (§ Contenu additionnel) ; VOICE : guide, n'ordonne pas |
| Message d'erreur | Ce qui a échoué + pourquoi + comment corriger | Couvert par renvoi — INPUT (mono-champ) et ALERT (global) ; VOICE fixe le **ton** (calme, jamais blâmer) et le gabarit |
| Message de succès | Confirmation d'une action réussie | Couvert — bref, factuel, sans sur-célébration (écho MOTION « pas de célébration ») |
| Avertissement / info | État qui mérite attention sans être une erreur | Couvert par renvoi — ALERT (tones warning/info) ; VOICE : le mot porte le sens que la couleur ne porte pas seule |
| État vide (empty state) | Zone sans contenu (première visite, aucun résultat) | Couvert — oriente vers l'action, distingue « vide » de « rien trouvé » (renvoi CARD empty state) |
| Chargement / attente | Texte pendant un traitement | Couvert par renvoi — MOTION (skeleton/spinner) fournit le visuel, VOICE le mot (« Enregistrement… ») |
| Confirmation destructive | Demande avant une action irréversible | Couvert — nomme la conséquence exacte, le bouton dit l'action (renvoi BUTTON destructive, la friction se calibre au coût) |
| Consentement / mentions | Cases à cocher légales, consentement | **Partiellement couvert** — VOICE fixe la clarté ; le fond juridique est hors périmètre (renvoi FORM-sensitive-data) |
| Onboarding / premier usage | Aide au tout premier contact | Couvert par renvoi — contextuel, pas préalable (LAWS : Paradox of the Active User) |

## 2. Par composant consommateur

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Bouton (BUTTON-UX) | Libellés d'action | Couvert par renvoi — BUTTON garde l'autorité sur le wording de ses libellés |
| Input (INPUT-UX) | Labels, helper, messages d'erreur mono-champ | Couvert par renvoi — INPUT garde l'autorité ; VOICE fournit ton + mécaniques |
| Alert (ALERT-UX) | Messages d'état (les 4 tones) | Couvert par renvoi — ALERT garde l'autorité sur le contenu par tone |
| Form (FORM-UX) | Résumé d'erreurs, statuts de soumission | Couvert par renvoi — FORM orchestre, VOICE fixe le ton du cycle idle→succès/erreur |
| Card (CARD-UX) | Empty state, titres | Couvert par renvoi |
| Contenu de page (marketing, doc) | Prose, landing, articles | **Partiellement couvert** — VOICE pose la voix ; le registre marketing (plus expressif) est une frontière à trancher si le produit ajoute ces surfaces |

## 3. Par mécanique d'écriture (couche UI)

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Capitalisation | Sentence case vs Title Case vs CAPITALES | Couvert — VOICE-UI : sentence case par défaut (GOV.UK/Polaris), CAPITALES réservées aux étiquettes `typography.label` |
| Ponctuation | Point final sur les libellés courts, deux-points, points de suspension | Couvert — VOICE-UI : pas de point sur un libellé/label court ; « … » pour une action qui ouvre une suite |
| Nombres | Chiffres vs lettres, séparateurs de milliers, unités | Couvert — VOICE-UI : chiffres pour les données (GOV.UK), format localisé |
| Dates et heures | Format long/court, absolu vs relatif | Couvert — VOICE-UI : format explicite, éviter l'ambigu JJ/MM vs MM/JJ ; relatif borné |
| Abréviations, jargon, acronymes | Termes techniques, sigles | Couvert — VOICE-UX : plain language, développer à la première occurrence |
| Longueur / troncature | Libellés qui débordent, ellipsis | Couvert par renvoi — `measure.reading-max` (TYPOGRAPHY) pour la prose ; VOICE-UI pour les libellés |

## 4. Par état émotionnel de l'utilisateur (le quasi-axe : le ton varie)

| Cas d'usage | Ton attendu | Particularité de contexte |
|---|---|---|
| Routine / neutre | Clair, direct, discret | Couvert — la voix par défaut |
| Erreur de l'utilisateur | Calme, sans blâme, orienté solution | Couvert — jamais « vous avez fait une erreur » ; dire quoi corriger (Peak-End : soigner le pic négatif) |
| Erreur système / panne | Honnête, responsabilisant côté produit, rassurant | Couvert — le produit assume (« Nous n'avons pas pu enregistrer »), propose une suite |
| Action destructive | Direct, factuel, conséquence nommée | Couvert — pas d'euphémisme, pas de sur-dramatisation |
| Succès | Bref, factuel, sans sur-célébration | Couvert — écho au registre productif (pas d'euphorie, pas de « Bravo ! ») |
| Attente | Rassurant, informatif sur ce qui se passe | Couvert par renvoi (MOTION pour le visuel) |
| Vide / démarrage | Encourageant, orienté première action | Couvert |

## 5. Par plateforme, accessibilité et internationalisation

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Lecteur d'écran | Textes alternatifs, aria-label, texte de lien signifiant | Couvert par renvoi — le mot est le canal fiable (COLOR 1.4.1, MOTION aria) ; VOICE : liens jamais « cliquez ici » (WCAG 2.4.4) |
| Niveau de lecture | Complexité du vocabulaire et des phrases | **Partiellement couvert** — VOICE pose « plain language » ; **trou** : aucun niveau cible chiffré fixé (WCAG 3.1.5, AAA) |
| Traduction / longueur | L'allemand s'allonge ~30 %, le mot bouge | Couvert (règle) / **non implémenté** — ne jamais concaténer des fragments, ne pas coder la longueur en dur ; produit monolingue à ce jour |
| Sens de lecture (RTL) | Arabe, hébreu — miroir de la mise en page | **Non couvert** — même statut que dark mode : décision produit non prise, signalé |
| Ambiguïté culturelle / ton | Humour, familiarité, idiomes intraduisibles | Couvert — VOICE-UX : registre sobre, éviter idiomes et humour qui ne franchissent pas les langues |

## 6. Par enjeu / risque

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Message qui blâme l'utilisateur | « Vous avez saisi une valeur invalide » | Couvert — règle cardinale : ne jamais blâmer |
| Erreur générique non actionnable | « Une erreur est survenue » sans suite | Couvert — gabarit quoi/pourquoi/comment (INPUT) ; VOICE l'exige aussi côté global |
| Information portée par le style seul | Erreur en rouge sans le mot « Erreur » | Couvert par renvoi — le mot est le canal redondant (COLOR/INPUT) |
| Jargon interne exposé à l'utilisateur | Codes d'erreur, termes techniques bruts | Couvert — traduire en langage humain, garder le code technique pour le support/log |
| Incohérence de vocabulaire | « Supprimer » ici, « Effacer » là, « Retirer » ailleurs | Couvert — VOICE-UI : lexique contrôlé, un concept = un mot |
| Voix qui change de personnalité entre écrans | Formel puis familier sans raison | Couvert — la voix est **constante**, seul le ton varie |
| Sur-promesse marketing dans l'UI produit | « Magique », « instantané », « sans effort » | Couvert — registre productif, pas de superlatif creux |

---

## Bilan du test de couverture

Sur **38 cas recensés**, **6 sont non ou partiellement couverts** après la première rédaction — ratio conforme à la série des fondations (8/33, 9/31, 10/33…) : niveau de lecture cible non chiffré (WCAG 3.1.5), RTL (décision produit non prise), traduction non implémentée (produit monolingue), registre marketing/contenu de page (frontière à trancher), consentement juridique (hors périmètre), sur-promesse marketing (traité en règle, sans surface consommatrice encore).

**Comblés en 1.0.0 (avant livraison, écrits d'office dans VOICE-UX)** : la règle cardinale « ne jamais blâmer », le quasi-axe du ton par état émotionnel (section 4 — l'équivalent du « ton varie » que la fondation seule fait apparaître), le mot comme canal fiable (renvoi transversal COLOR/MOTION), le principe voix-constante/ton-variable.

**Ce que ce test ajoute sur la méthode** : le prédicteur « état transitoire » **s'applique enfin littéralement** — le ton d'attente, le ton de résolution, le message qui remplace temporairement un autre (l'erreur remplace le helper, INPUT) sont des états d'écriture, pas des états visuels. Écrits d'office. Et comme pour les autres fondations, le trou-type reste le **contexte pas encore né** (RTL, multilingue, surface marketing) — rendu visible par des positions explicites plutôt que des silences. Nouveau constat propre au contenu : une grande part des cas est **« couvert par renvoi »** — le wording appartient aux composants (BUTTON, INPUT, ALERT), la fondation ne fait que le nommer et l'unifier ; c'est le pendant écriture de ce que COLOR fait pour les valeurs (la fondation consolide, les consommateurs gardent l'autorité sur leur usage).
