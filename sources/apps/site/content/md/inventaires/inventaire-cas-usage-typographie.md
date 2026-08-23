# Inventaire des cas d'usage — Typographie (fondation)

> Miroir des inventaires de composants, adapté à une fondation : on inventorie les *usages du texte* chez les consommateurs, pas les variantes d'un atome. Premier inventaire d'une fondation — la v1.0.0 de TYPOGRAPHY-UX.md affirmait qu'il était sans objet ; ce fichier est la preuve du contraire (correction documentée dans DECISIONS.md). Les corrections issues du test sont marquées "couvert après test".

---

## 1. Par rôle de texte

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Titre de document (h1) | Le titre sémantique unique de la page | Couvert — règle du h1 unique, cas du hero décoratif tranché |
| Titres de section (h2-h4) | La structure navigable du contenu | Couvert (échelle + profondeur) |
| Niveaux profonds (h5-h6) | Documentation longue, spécifications | **Couvert après test** — la profondeur de hiérarchie manquait (4 échelons suffisent presque toujours, cf. GOV.UK) |
| Corps de texte | Lecture longue | Couvert (mesure, interligne, taille minimale) |
| Texte d'accroche / lead | Premier paragraphe mis en avant | **Non couvert actuellement** — GOV.UK a un style "lead" dédié (24px, une fois par page) ; ni règle ni token ici |
| Étiquette technique (label-mono) | Tokens, métadonnées, kickers | Couvert (rôle + casse + interlettrage) |
| Message d'erreur / d'état | Texte des tones | Couvert par INPUT-UX/ALERT-UX — la fondation fournit corps et graisse, les composants la sémantique |
| Code / données préformatées | Blocs techniques | Couvert partiellement (label-mono) — le bloc de code multiligne n'est traité nulle part |
| Chiffres alignés (montants, tables) | Comparaison verticale de nombres | **Non couvert actuellement** — chiffres tabulaires (Polaris), signalé dans "À approfondir" |
| Lien dans le texte courant | Souligné, couleur, visité | **Couvert par Link** — soulignement persistant dans le texte courant et état visité selon le contexte |

## 2. Par contexte d'intégration

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Page de contenu / documentation | Lecture longue, structure profonde | Couvert (mesure, interligne, hiérarchie) |
| Formulaire | Labels, hints, erreurs | Couvert (via INPUT-UX + taille minimale des inputs) |
| Table dense / dashboard | Petits corps, chiffres | Couvert partiellement (taille minimale) — chiffres tabulaires manquants |
| Hero / marketing | Display géant, accroche | Couvert (display ≠ h1, hiérarchie sémantique vs visuelle) |
| Modale / panneau étroit | Mesure naturellement contrainte | Couvert implicitement (la mesure est un max, pas un min) |
| Vitrine / spécimen | La typographie qui se montre elle-même | Couvert par la règle « niveau ≠ taille » (démo en span, jamais en headings) |

## 3. Par état / comportement dans le temps

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Chargement de police (FOUT/swap) | Texte en pile de secours puis bascule | **Couvert dès la première rédaction** — le prédicteur "état transitoire" du README a fonctionné en amont pour la première fois (4 occurrences avaient précédé) : fallback stacks + font-display: swap étaient dans la v1.0 |
| Zoom navigateur 200 % | Resize Text WCAG 1.4.4 | Couvert — le cœur du point débattu, test manuel documenté |
| Redimensionnement de fenêtre | Fluid type entre breakpoints | Couvert (clamp + garde-fou 2.5×) |
| Texte traduit (expansion ~30 %) | Allemand, finnois vs français | **Non couvert actuellement** — signalé dans "À approfondir", concerne aussi les composants |
| Contenu utilisateur imprévisible | Titres très longs, mots insécables | Couvert partiellement (troncature → CARD-UX, mesure) — le débordement de mot long (overflow-wrap) n'est pas traité |
| Préférences utilisateur (reduced motion, contraste élevé) | Les modes d'accessibilité système | **Non couvert actuellement** pour le texte (le contraste élevé forcé remplace les couleurs de tokens) |

## 4. Par plateforme / device

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Desktop | Cas de référence | Couvert |
| Mobile | Échelle fluide en bas de clamp, input ≥ 16px | **Couvert après test** — le zoom automatique iOS sur input < 16px manquait |
| Lecteur d'écran | Navigation par titres, text-transform vs caps tapées | Couvert (hiérarchie + casse) |
| RTL / scripts non latins | Mesure en ch, échelle latine | **Non couvert actuellement** — signalé |
| Impression | Corps en points, liens à expliciter | **Non couvert actuellement** — probablement hors périmètre produit, à trancher |

## 5. Par forme / emphase

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Interlignage titres vs corps | Serré en grand, aéré en courant | **Couvert après test** — absent de la première rédaction alors que les tokens existants (1.1 vs 1.6) encodaient déjà la règle sans la dire |
| Graisse comme canal de hiérarchie | Combinaison, jamais graisse seule | **Couvert après test** |
| Gras / italique dans le texte | Emphase locale | **Couvert après test** (parcimonie, jamais ensemble) |
| TOUT EN CAPITALES | Étiquettes brèves + interlettrage | **Couvert après test** — la valeur locale (8 %) est devenue une règle sourcée (5-12 %) |
| Alignement / justification | Fer à gauche, jamais justifié | **Couvert après test** |
| Troncature / line clamp | Texte coupé volontairement | Couvert par renvoi (CARD-UX fait autorité sur la troncature en carte) — la règle-limite "jamais sans accès au contenu complet" est posée |

## 6. Par enjeu / risque

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| vw seul → zoom inopérant | Exclusion des malvoyants | Couvert — risque critique n°1, sourcé et testé manuellement |
| h1 décoratif / sauts de niveaux | Outillage cassé (AT, SEO, sommaire) | Couvert (cas portfolio-landing documenté) |
| Fatigue de lecture (mesure, interligne, justifié) | Abandon silencieux de la lecture | Couvert |
| Layout shift au chargement de police | CLS, déplacement des cibles | Couvert (piles à métriques proches) |
| Inflation du gras | Plus aucune emphase ne porte | **Couvert après test** |

---

## Bilan du test de couverture

Sur 33 cas recensés, **10 étaient non couverts après la première rédaction** (v1.0.0) de TYPOGRAPHY-UX.md — ratio de trous cohérent avec la série (bouton 8/33, input 11/30, carte 9/41, alert 8/39) : **une fondation n'échappe pas à la statistique**, ce qui invalide l'argument "pas d'inventaire pour une fondation" de la v1.0.0.

**Les 6 trous jugés prioritaires ont été comblés en 1.1.0** (marqués "couvert après test") : interlignage, graisse/emphase, casse, alignement/justification, taille minimale + zoom iOS, profondeur de hiérarchie. Tous venaient du benchmark (GOV.UK, Carbon, Polaris) et de la littérature typographique (Butterick, WCAG 1.4.8) — c'est l'étape sautée en v1.0.0 qui les aurait attrapés d'emblée.

**Restent non couverts, par ordre de priorité suggérée** : texte d'accroche/lead (style GOV.UK, candidat token), chiffres tabulaires (bloquant pour de futures tables/dashboard), liens dans le texte (frontière composant à trancher), expansion de traduction, débordement de mots longs, contraste élevé forcé, RTL, impression. Aucun n'est critique en risque immédiat, tous sont signalés soit ici, soit dans "À approfondir".

**Ce que ce test ajoute sur la méthode** : (1) le prédicteur "état transitoire" a fonctionné *en amont* pour la première fois — le chargement de police était couvert dès la v1.0, comme le README le recommandait après la 4e occurrence ; (2) en revanche, sauter le benchmark s'est payé exactement comme la méthode le prévoyait — les 6 trous prioritaires étaient tous dans les sources standard. Les deux étapes sont indépendantes : l'une n'immunise pas contre l'absence de l'autre.
