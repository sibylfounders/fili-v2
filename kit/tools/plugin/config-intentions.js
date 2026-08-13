// config-intentions.js — SOURCE UNIQUE de la table d'intentions, du socle universel et du
// hors-périmètre. Consommée par genere-routeur.js (génération du paquet) ET par
// tools/pilote-generation/assemble-contextes.js (harnais du test — comparaison des membres
// exacts des bundles via reports/bundles.json). Toute évolution éditoriale se fait ICI.
'use strict';

// ---------------------------------------------------------------------------
// INTENTIONS — la partie éditoriale (à faire évoluer quand un sujet apparaît)
// `sujets` : sujets chargés explicitement (leurs `requires` sont résolus automatiquement).
// `fondations` : matières et vocabulaires de construction quasi certains pour cette intention.
// `langages` : grammaires de sens quasi certaines pour cette intention.
// `principes` : obligations ou raisonnements transversaux propres à l'intention.
// `note` : compléments conditionnels, affichés tels quels dans la table.
// Les extensions (type: extension) ne se déclarent JAMAIS ici — elles se chargent via la
// colonne « Selon contexte » du sujet dont elles dépendent (extension-de), pas par intention.
// `kit` + `kitComposants` : le contrat d'implémentation @fili/react de l'intention —
// KIT-<kit>.md est GÉNÉRÉ depuis packages/react/manifest.json (genere-catalogue.js) et ne se
// charge QUE si le produit construit avec @fili/react (les règles de conception, elles,
// valent pour tout produit).
// ---------------------------------------------------------------------------
const INTENTIONS = [
  {
    intention: 'Formulaire',
    // Contrat d'implémentation @fili/react (KIT-<slug>.md, généré du manifeste) :
    kit: 'formulaire', kitComposants: ['Input', 'Select', 'Switch', 'Button', 'CompactButton', 'Alert'],
    declencheurs: 'login / connexion, contact, checkout, réglages — toute page dont le cœur est une saisie isolée',
    // select et switch sont des contrôles de saisie au même titre que input : un formulaire porte
    // des choix et des bascules aussi souvent que des champs texte (ajoutés le 2026-07-27).
    sujets: ['form', 'select', 'switch'],
    fondations: ['color', 'spacing', 'typography', 'border', 'grid', 'touch'],
    langages: ['emotion', 'motion', 'voice'],
    // validation : le protocole de la chaîne verdict → état → message → résumé → soumission.
    // Il n'est PAS au socle universel (une page de contenu n'a rien à valider) : il est chargé
    // par les intentions qui portent réellement des contrôles de formulaire (2026-07-30).
    principes: ['validation'],
    note: '+ extensions form-* si le contexte les exige (étapes, validation async, champs conditionnels, autosave, erreurs serveur détaillées, données sensibles, succès partiel) ; emotion UNIQUEMENT sur le moment de réussite d\'un envoi/soumission (moment mérité, budget de rareté — cf. RULES-emotion)',
  },
  {
    intention: 'Collection',
    // Contrat d'implémentation @fili/react (KIT-<slug>.md, généré du manifeste) :
    kit: 'collection', kitComposants: ['CardGroup', 'Card', 'Button', 'Link', 'Skeleton'],
    declencheurs: 'dashboard, liste, grille de cartes, galerie, résultats de recherche',
    sujets: ['collection'],
    fondations: ['color', 'spacing', 'typography', 'elevation', 'grid', 'touch'],
    langages: ['motion'],
    principes: [],
    note: '+ iconography si icônes ; card et button tirés via les requires du pattern collection',
  },
  {
    intention: 'Page de contenu',
    // Contrat d'implémentation @fili/react (KIT-<slug>.md, généré du manifeste) :
    kit: 'contenu', kitComposants: ['Container', 'Tabs', 'Link', 'Chip', 'Card', 'Accordion', 'Divider'],
    declencheurs: 'article, landing, page marketing, documentation, à-propos',
    // tabs : une page documentaire découpe régulièrement un même objet en vues exclusives.
    // chip : le renvoi compact en nuée des contextes denses (promotion 2026-07-29, protocole).
    sujets: ['tabs', 'chip'],
    fondations: ['typography', 'color', 'spacing', 'grid'],
    langages: ['voice'],
    principes: [],
    note: '+ button si CTA, + card si sections en cartes',
  },
  {
    intention: 'Feedback',
    // Contrat d'implémentation @fili/react (KIT-<slug>.md, généré du manifeste) :
    kit: 'feedback', kitComposants: ['Alert', 'Toast', 'Button', 'CompactButton'],
    declencheurs: "notification, message d'état, bannière, confirmation, erreur globale",
    sujets: ['alert', 'toast'],
    fondations: ['color', 'iconography', 'touch'],
    langages: ['emotion', 'motion', 'voice'],
    principes: ['adaptive'],
    note: "+ button si l'alert/le toast porte une action ; emotion seulement sur un moment de réussite/accomplissement mérité (budget de rareté — cf. RULES-emotion) ; toast jamais seul porteur d'une condition qui dure (cf. RULES-toast)",
  },
  {
    intention: 'Création de compte',
    // Contrat d'implémentation @fili/react (KIT-<slug>.md, généré du manifeste) :
    kit: 'creation-compte', kitComposants: ['Input', 'Button', 'Alert', 'Link'],
    declencheurs: 'inscription, sign-up, « créer un compte », écran d\'enregistrement',
    sujets: ['creation-compte'],
    fondations: ['color', 'spacing', 'typography', 'border', 'grid', 'touch'],
    langages: ['motion', 'voice'],
    principes: ['validation'],
    note: '+ extensions creation-compte-* selon le contexte (vérification e-mail, SSO/social, force du mot de passe, e-mail déjà utilisé, consentement) ; form/input/button/alert tirés via requires',
  },
  {
    // Le bandeau de consentement est un flow à part entière (CONSENTEMENT 1.1.0) : il n'invente
    // aucun objet visuel, il décide s'il faut interrompre et impose la symétrie des deux issues.
    // Il ne se confond pas avec l'extension creation-compte-consentement, qui traite l'acceptation
    // des CGU à l'inscription — autre moment, autre propriétaire (ajouté le 2026-07-27).
    intention: 'Consentement',
    // Contrat d'implémentation @fili/react (KIT-<slug>.md, généré du manifeste) :
    kit: 'consentement', kitComposants: ['Alert', 'Button', 'Link'],
    declencheurs: "bandeau cookies, gestion des traceurs, préférences de confidentialité, « gérer mes choix », page cookies",
    sujets: ['consentement'],
    fondations: ['color', 'spacing', 'typography', 'border', 'radius', 'grid', 'touch'],
    langages: ['voice', 'motion'],
    principes: ['accessibility', 'validation'],
    note: "alert, button et voice tirés via les requires ; navigation pour le lien permanent en pied de page ; overlay/modal UNIQUEMENT si le bandeau devient modal, ce qui n'est pas le défaut",
  },
  {
    // Le shell applicatif est déjà une réalité de la doctrine — GRID 1.2.0 a tokenisé ses rails
    // et son point de bascule (grid.rail-nav, grid.rail-tools, breakpoint.tablet). Il lui manquait
    // seulement sa porte d'entrée dans le routeur : navigation n'était joignable par aucune
    // intention (ajouté le 2026-07-27).
    intention: 'Cadre applicatif',
    // Contrat d'implémentation @fili/react (KIT-<slug>.md, généré du manifeste) :
    kit: 'cadre-applicatif', kitComposants: ['AppLayout', 'Nav', 'Brand', 'SkipLink', 'TableOfContents', 'Tabs', 'ThemeToggle', 'Container', 'Drawer'],
    declencheurs: "shell d'application, rail ou barre de navigation, menu latéral, en-tête de site, découpage d'un écran en vues",
    sujets: ['navigation', 'tabs'],
    fondations: ['color', 'spacing', 'typography', 'grid', 'elevation', 'touch'],
    langages: ['motion', 'voice'],
    principes: ['adaptive'],
    note: 'link et accordion tirés via les requires de navigation ; overlay dès que le rail passe en off-canvas sous breakpoint.tablet',
  },
  {
    intention: 'Superposé modal',
    // Contrat d'implémentation @fili/react (KIT-<slug>.md, généré du manifeste) :
    kit: 'superpose', kitComposants: ['Modal', 'Drawer', 'Dropdown', 'Button', 'CompactButton'],
    declencheurs: "modale de confirmation, « confirmer la suppression », dialogue de saisie courte, panneau de détail superposé, drawer",
    sujets: ['modal'],
    fondations: ['color', 'spacing', 'typography', 'elevation', 'grid', 'touch'],
    langages: ['motion', 'voice'],
    principes: [],
    note: "+ button dès que la modale porte des actions, + form si elle porte une saisie ; overlay tiré via les requires de modal — c'est lui qui porte scrim, z-index, piège de focus et scroll-lock",
  },
];

// Sujets connus comme HORS périmètre (frontière documentée ou jamais traités) :
// affichés dans le protocole pour que l'agent s'arrête au lieu d'improviser.
const HORS_PERIMETRE = 'table, datepicker, popover'; // toast retiré le 2026-07-21 (RULES-toast) ; modale retirée le 2026-07-26 (RULES-modal, intention « Superposé modal ») ; popover ajouté — cité comme frontière par overlay et modal, jamais traité

// Sujets du SOCLE UNIVERSEL : chargés d'office avec le routeur pour TOUTE intention.
// accessibility : contrat d'accessibilité universel, compilé mais companion:none (2026-07-14).
const SOCLE_SUJETS = {
  accessibility: 'principe',
  interaction: 'langage',
  adaptive: 'principe',
  'cognitive-load': 'principe', // contrat de charge cognitive, même modèle qu'accessibility (2026-07-21)
  performance: 'principe', // contrat des attentes (performance perçue), même modèle (2026-07-21)
};

module.exports = { INTENTIONS, SOCLE_SUJETS, HORS_PERIMETRE };
