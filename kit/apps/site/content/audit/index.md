# Design System Audit

Site séparé de la documentation Design System MD. Il confronte un corpus observé à un instantané versionné des règles sans devenir une seconde source de vérité.

Le mode par défaut est désormais **l’audit standard** : tous les écrans sont balayés, puis seuls les signaux et leurs étapes liées sont approfondis. Le mode rapide sert à orienter une première décision ; le mode complet reste réservé aux démonstrations nécessitant une chaîne de preuve et une baseline.

## Principe directeur : une plus-value réelle

Chaque élément visible doit aider une personne à comprendre un problème, prendre une décision, appliquer une correction ou éviter une régression. Le reste demeure dans le dossier de preuve destiné à l’IA, ou disparaît.

Une nouvelle fonctionnalité ne doit pas être ajoutée parce qu’elle est techniquement possible. Elle doit annoncer le besoin qu’elle résout et le signal observable qui permettra de vérifier son utilité. Une promesse de gain de temps, de qualité ou de confiance reste une hypothèse tant qu’elle n’a pas été mesurée sur un usage réel.

Pour un produit web responsive, la collecte et la restitution suivent un ordre mobile-first : problèmes présents sur mobile et desktop, problèmes mobiles, puis problèmes propres au desktop. Chaque finding porte un `view_context` parmi `both`, `mobile`, `desktop` et `unknown`. Ce champ décrit où le problème existe, pas seulement les captures utilisées pour le démontrer. Une vue mobile utilisée comme contre-exemple d’un défaut desktop ne transforme donc pas ce défaut en problème commun aux deux formats. `mobile` et `desktop` signifient « uniquement dans le corpus observé » ; une comparaison absente reste `unknown`.

La vue `Flow` est optionnelle. Elle n’est générée que lorsqu’au moins un finding porte `scope: "flow"`, c’est-à-dire lorsqu’un problème vient de la séquence, du parcours ou d’un comportement transversal démontré sur plusieurs états plutôt que d’un écran isolé. Son diagnostic, son explication et sa recommandation utilisent uniquement ces findings transversaux ; les corrections locales restent sur leurs pages.

La vue `Blocs partagés` suit la même logique pour l'axe transverse du gabarit. Elle n'est générée que lorsqu'au moins un finding porte `scope: "layout"` : un problème qui vit dans un bloc commun rendu à l'identique sur plusieurs écrans (en-tête, pied de page, bannière, navigation). Ces findings déclarent leur `block`, ne s'attribuent à aucune page et ne gonflent pas le décompte « pages à modifier » — une correction unique vaut pour tout le site. Le critère d'attribution est strict (même bloc, même source, une seule correction), pour ne pas absorber un défaut simplement répété (`screen`) ou un défaut de séquence (`flow`).

## Carte du dossier

Chaque dossier a un rôle unique :

- `data/studies/<id>/` : la vérité versionnée de chaque étude — `manifest.json` (provenance, état des preuves, instantané des règles), `preregistration.json` (question, corpus et comparaison gelés avant la collecte), `baseline.json` (audit témoin gelé avant le chargement des règles), `observations.json` (faits observés, inférences séparées, références de preuve), `findings.json` (confrontation entre observations et règles), `scorecard.json`, `measurements.json`, `annotations.json`, `run.json`. Le sous-dossier `snapshot/` contient la **copie gelée** des règles utilisées par l’étude : les empreintes du manifeste pointent dessus, plus jamais sur le `dist/` vivant — une release de MD ne casse plus rétroactivement les études (défaut corrigé le 2026-07-21, contenus historiques retrouvés dans le dépôt et l’installation de test du 17/07).
- `private/` : captures d’écran (`evidence/`) et sessions de run (`sessions/`), exclues de Git.
- `private-view/` : build privé illustré, ignoré par Git et régénérable à volonté (`build.js --private`). Ne rien y éditer à la main.
- `public/` : build public sans capture, committé ; la CI vérifie sa fraîcheur.
- `reports/` : rapports datés (audit produit, contre-audit, retours réels, `reports/VALIDATION.md` régénéré).
- `tools/` : `validate.js` (chaîne de preuve), `build.js` (génère public et private-view), `check-site.js` (fichiers, liens, ancres, absence de captures privées), `register-evidence.js` (empreinte les captures après crawl), `audit.js` (point d’entrée init/register/mark/usage/finish, standard par défaut), `fast-audit.js` (moteur interne), `test.js` (suite complète).
- `archive/` : documents ponctuels terminés (dont `RECRAWL-COSMOS.md`, la consigne du recrawl Chrome dans Mobbin).

### Pourquoi cinq fichiers protocole à la racine

Chaque étude gèle par empreinte SHA-256 le protocole qu’elle a suivi, et `validate.js` échoue si l’un de ces fichiers bouge ou change : ils sont immobiles par construction, pas par négligence.

- **Courants** — les seuls que les outils utilisent pour toute nouvelle étude : `FAST-PROTOCOL-1.1.md` (audit rapide) et `STANDARD-PROTOCOL-1.1.md` (audit standard, mode par défaut).
- **Restitution (couche de lecture)** — `RESTITUTION-1.0.md` (verdict d’abord, traçabilité en annexe) et `GLOSSAIRE-RESTITUTION-1.0.md` (langue des livrables) régissent tout rapport destiné à un humain (`reports/`, synthèses remises). Documents courants, non gelés par les études ; le site public n’y est pas encore branché.
- **Gelés pour les études historiques** : `PROTOCOL.md` (mode complet — cosmos-creation-account, passion-courtage-contact, strava-ios-onboarding-complete), `FAST-PROTOCOL.md` (strava-ios-onboarding), `STANDARD-PROTOCOL.md` (strava-ios-onboarding-standard).

La triplication du corpus Strava (3 études × 18 captures dans `private/evidence/`) est volontaire : même parcours audité sous les trois modes pour les comparer.

## Commandes

### Audit rapide — orientation

```sh
node audit/tools/audit.js init mon-audit --mode fast \
  --title "Création de compte" \
  --product "Mon produit" \
  --url "https://exemple.test"

# Après dépôt des captures
node audit/tools/audit.js register mon-audit

# Après rédaction de observations.json et findings.json
node audit/tools/audit.js finish mon-audit
```

Le crawl ne remplit plus de transcription détaillée. Si l’index privé reste vide, les images présentes sont inventoriées automatiquement. `finish` produit la synthèse, les notes, l’instantané des seules règles utilisées, les deux builds et le rapport de validation.

### Audit standard — recommandé

Le protocole `STANDARD-PROTOCOL-1.1.md` impose un premier passage sur tous les écrans, un second passage ciblé et un arrêt lorsque l’analyse n’ajoute plus d’action étayée. Il ne nécessite ni audit témoin ni recherche exhaustive des états absents.

```sh
node audit/tools/audit.js init mon-audit-standard --mode standard \
  --title "Création de compte" \
  --product "Mon produit" \
  --url "https://exemple.test"

# Déposer le corpus, puis enregistrer le temps des phases réellement réalisées
node audit/tools/audit.js register mon-audit-standard
node audit/tools/audit.js mark mon-audit-standard analysis

# Lorsque le fournisseur expose son usage, sans jamais estimer les valeurs absentes
node audit/tools/audit.js usage mon-audit-standard \
  --provider "Claude" \
  --input-tokens 12000 \
  --output-tokens 3000

node audit/tools/audit.js finish mon-audit-standard
```

Chaque nouvelle étude créée par cet outil possède un `run.json` versionnable : phases mesurées, tokens, coût déclaré et valeurs `null` lorsqu’elles ne sont pas fournies.

### Outils communs et mode complet

```sh
node audit/tools/validate.js
node audit/tools/build.js
node audit/tools/build.js --private
node audit/tools/test.js
```

Le build normal écrit dans `audit/public/` et refuse toute capture privée. Le build `--private` écrit dans `audit/private-view/`, dossier ignoré par Git, et relie les captures enregistrées aux décisions, recommandations et observations concernées.

Le build refuse de présenter une étude comme « prouvée » si ses pièces de preuve ou son audit témoin manquent.

`test.js` reconstruit les deux sites puis contrôle les compteurs humains, la nature des prompts, le statut des baselines et l’absence de captures privées dans le build public.

En mode rapide, aucune preuve de plus-value incrémentale n’est revendiquée : l’absence volontaire de baseline est déclarée dans le manifeste et les findings portent `incremental_value: "unproven"`.

La vue principale est volontairement courte : elle n’affiche que les problèmes observables et prioritaires. Les pages sans problème restent silencieuses. Les constats conformes, les hypothèses non observables et les données techniques restent dans le dossier de preuve et ne génèrent aucun prompt.

La note globale chiffrée a été **retirée volontairement** de l’interface : une note agrégée disait moins que les compteurs par thème et donnait une fausse impression de mesure. Les entrées de notation (`scorecard.json`) restent validées et versionnées ; elles alimentent les compteurs par thème, mais aucun score agrégé n’est affiché.

La synthèse générée par `audit.js finish` suit un contrat vérifié par `test.js` : `actions` liste les corrections et tests (`A01…`) puis les points à vérifier (`V01…`, kind `check`), et `verify_before_deciding` répète ces derniers comme vue filtrée, avec les mêmes identifiants.

## Statut de l'étude Cosmos

L'étude initiale de Claude a été importée comme **transcription rétrospective non vérifiée**. Les captures, le manifeste de collecte et le protocole pré-enregistré n'ont pas été conservés. Le site expose ce manque au lieu de le masquer.

Un nouveau passage dans Mobbin est nécessaire pour promouvoir l'étude au statut `evidence_complete`.
