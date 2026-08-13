# Inventaire des cas d'usage — Input (champ de saisie)

> Miroir de `inventaire-cas-usage-bouton.md`, construit après coup pour rattraper l'écart de méthode entre les deux composants. Sert de checklist de couverture pour `INPUT-UX.md`, pas de contenu à lire en soi.

---

## 1. Par type de champ

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Texte simple | Nom, titre, texte libre court | Cas de référence, le plus documenté |
| Email | Adresse email | Type HTML natif, clavier adapté mobile |
| Mot de passe | Saisie masquée | Toggle de visibilité, gestionnaires de mots de passe |
| Numérique | Montant, quantité, âge | Clavier numérique mobile, pas seulement `type=number` (piège des flèches indésirables) |
| Téléphone | Numéro de téléphone | Format international, indicatif pays |
| Recherche | Requête de recherche | Type `search` natif, bouton clear |
| Texte long (textarea) | Message, description, commentaire | Compteur de caractères, redimensionnement |
| Date | Date unique ou plage | Souvent couplé à un date picker, pas un simple texte |
| URL | Lien web | Validation de format spécifique |
| Fichier | Upload de document/image | Hors du périmètre texte pur, comportement très différent |

## 2. Par conteneur / contexte d'intégration

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Dans un formulaire | Cas de référence | Déjà couvert en détail dans INPUT-UX.md |
| Dans une table (édition inline) | Modification directe d'une cellule | Déjà couvert |
| Barre de recherche (header/nav) | Recherche globale du produit | Déjà couvert |
| Dans une modale | Saisie contextuelle à une action | **Non couvert actuellement** |
| Filtre (liste, dashboard) | Affiner un résultat affiché | **Non couvert actuellement** |
| Formulaire multi-étapes | Un champ parmi plusieurs écrans séquentiels | **Non couvert actuellement** |
| Champ de commentaire/réponse | Saisie sociale, souvent avec bouton d'envoi séparé | **Non couvert actuellement** |

## 3. Par état / comportement dans le temps

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Validation on blur | Cas de référence | Déjà couvert en détail |
| Validation temps réel (débounce) | Champs à fort risque de format | Déjà couvert |
| Autocomplete / suggestions | Propositions pendant la saisie | **Non couvert actuellement** |
| Validation asynchrone (ex: dispo d'un username) | Attente d'une réponse serveur pendant la saisie | **Non couvert actuellement** — recoupe pourtant le "loading state" déjà documenté côté bouton |
| Autosave | Sauvegarde silencieuse sans action explicite | **Non couvert actuellement** |
| Verrouillé après soumission (readonly) | Empêcher la modification post-validation | Mentionné comme state dans INPUT-UI.md, jamais expliqué côté UX |

## 4. Par plateforme / device

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Desktop clavier | Saisie précise, tabulation | Implicite, jamais explicité |
| Mobile clavier virtuel adapté | Le type détermine le clavier affiché | Déjà couvert (type de champ) |
| Accessibilité vocale/lecteur d'écran | Label lié, annonce des erreurs | Déjà couvert côté UI |
| Autofill / gestionnaire de mots de passe navigateur | Remplissage automatique par le navigateur | **Non couvert actuellement** — pourtant risque réel de conflit visuel (style d'autofill du navigateur qui casse le design) |

## 5. Par contenu / forme visuelle

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Label top fixe | Cas de référence | Déjà couvert |
| Label flottant (floating label) | Le label rétrécit et se déplace au focus | **Non couvert actuellement** — alternative fréquente au label fixe, jamais tranchée |
| Icône leading/trailing dans le champ | Icône de contexte (loupe, cadenas) | **Non couvert actuellement** |
| Prefix / suffix | Symbole, unité | Déjà couvert |
| Compteur de caractères | Limite de saisie | Déjà couvert |
| Bouton clear | Effacement rapide | Déjà couvert |
| Champs connectés (ex: select + input) | Deux composants visuellement fusionnés | **Non couvert actuellement** |

## 6. Par enjeu business / risque

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Champ de paiement (carte bancaire) | Numéro de carte, CVV | **Non couvert actuellement** — risque de sécurité et de conformité (PCI-DSS), enjeu réel absent du fichier |
| Champ de mot de passe | Sécurité du compte | Mentionné comme "à approfondir" dans INPUT-UX.md, jamais traité |
| Données personnelles sensibles | RGPD, données de santé, etc. | **Non couvert actuellement** |
| Recherche critique pour le produit | Ex: recherche e-commerce, moteur de résultat | **Non couvert actuellement** |

---

## Bilan du test de couverture

Sur 30 cas recensés, **11 sont explicitement non couverts** par INPUT-UX.md dans son état actuel — un ratio de trous comparable à celui trouvé sur le bouton lors du premier test de couverture équivalent (à l'époque : 8 absents sur 33).

**Les 3 manques qui semblent les plus prioritaires**, par analogie avec la logique de priorisation déjà utilisée pour le bouton (risque élevé + faible couverture ailleurs) :
1. **Champ de mot de passe** — déjà signalé comme "à approfondir" dans INPUT-UX.md, mais jamais traité malgré un risque de sécurité réel
2. **Champ de paiement** — absent alors que c'est un des champs à plus fort enjeu de toute l'interface
3. **Autofill navigateur** — risque concret et fréquent (le style natif du navigateur qui casse le design system), jamais mentionné

**Ce que ce test confirme sur la méthode elle-même** : construire une doc à partir de benchmarks externes (ce qu'on a fait pour l'input) et construire une doc à partir d'un inventaire de cas d'usage vérifié après coup (ce qu'on a fait pour le bouton) donnent des couvertures différentes, pas interchangeables — les benchmarks trouvent ce que d'autres systèmes documentent déjà bien (helper text, compteur...), l'inventaire trouve ce qui est spécifique à l'usage réel du produit, indépendamment de ce que documentent les autres (recherche critique, paiement). Les deux méthodes sont complémentaires, aucune ne remplace l'autre.
