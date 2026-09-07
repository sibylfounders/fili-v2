"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Apercu } from "../apercu";
import { Bandes, Bande, ListeRegles, PanneauRegistre } from "../etages";
import type { LigneListe, LigneCode } from "../etages";
import { RailDoc, useDocSections, type Sommaire } from "../rail";
import { chaine, jetons, aLargeur, AXES, CHARTE, LARGEUR_MIN, LARGEUR_MAX } from "../../derivation.mjs";

/* ═══════════════════════════════════════════════════════════════════════
   PAGE TYPOGRAPHIE — contenu natif (24 août 2026, reprise après verdict
   d'Auteur : « t'as adapté le contenu existant au lieu de proposer un
   contenu original »). Migrée sur la chaîne le 25 août (huit décisions) :
   tout chiffre affiché est CALCULÉ par kit/derivation.mjs, jamais recopié.
   Passée à la voix d'Auteur et au gabarit des étages le 2 septembre.

   · LES PREUVES (01 à 04) — sans gabarit, c'est la part de séduction et
     elle diffère d'une page à l'autre : LES FONTS (vocabulaire — deux
     fonts, quatre rôles, la casse du nom orphelin), L'ÉCHELLE
     (huit crans lus dans le moteur), LA MESURE (variation — même texte,
     seule la largeur change, comptée sur la page rendue), LA GAZETTE
     (objet en situation, cassable d'un geste). Leur FORME est conservée ;
     seul leur texte est passé à la voix (verdict d'Auteur, 2 septembre).
   · LES TROIS ÉTAGES (05 à 07) — au gabarit commun d'etages.tsx, comme
     Rythme, la pièce de référence : les règles qu'on peut casser (six
     bandes), celles qu'on ne peut pas montrer (la liste et sa colonne
     « où ça se vérifie »), et le registre des jetons.

   L'extrait prêt à coller et sa bascule HTML / React / Angular ont été
   retirés le 2 septembre : un extrait vieillit et se met à mentir dès que
   le composant bouge. Le normatif, c'est la règle et le jeton.

   Les styles propres à la page vivent dans typo.css. Le contenu ne perd
   rien : toutes les règles et toutes les casses restent.
   ═══════════════════════════════════════════════════════════════════════ */

/* Le registre, lu dans le moteur — jamais recopié. Le moteur est en
   JavaScript : on nomme ici la forme d'un jeton pour le TypeScript strict. */
type Jeton = { axe: string | null; base: number; bas?: number; haut?: number; css: string };
const REGISTRE = jetons(chaine()) as unknown as Record<string, Jeton>;
const RAPPORT: number = CHARTE.intervalleTitres;
const GLISSEMENT: number = AXES.type.max;
const ECRAN_MIN: number = LARGEUR_MIN;
const ECRAN_MAX: number = LARGEUR_MAX;

/* Un nombre en français, sans « ,0 » : une décimale pour les pixels, deux pour un rapport. */
const fr = (v: number) => String(Math.round(v * 10) / 10).replace(".", ",");
const fr2 = (v: number) => String(Math.round(v * 100) / 100).replace(".", ",");
const bornes = (nom: string) => `${fr(REGISTRE[`font-size-${nom}`].bas!)}→${fr(REGISTRE[`font-size-${nom}`].haut!)} px`;

/* Les huit crans, du haut de l'échelle au bas : deux titres du site, six
   crans de texte. Chaque rangée de l'échelle est rendue PAR son jeton. */
/* Les deux titres du site glissent avec l'écran entre deux crans de la chaîne
   (intention d'auteur déclarée, 25 août) : ils se rendent par leur alias --doc-*,
   et leur fiche dit les deux crans-bornes. */
const CRANS: { nom: string; fiche: string; jeton: string; bornes: string }[] = [
  { nom: "cover", fiche: "couverture · titre du site", jeton: "var(--doc-cover)", bornes: `${fr(REGISTRE["font-size-section"].bas!)}→${fr(REGISTRE["font-size-cover-max"].haut!)} px · glisse avec l'écran` },
  { nom: "section", fiche: "section · titre du site", jeton: "var(--doc-section)", bornes: `${fr(REGISTRE["font-size-h1"].bas!)}→${fr(REGISTRE["font-size-section"].haut!)} px · glisse avec l'écran` },
  { nom: "display", fiche: "affiche", jeton: "var(--font-size-display)", bornes: bornes("display") },
  { nom: "h1", fiche: "h1", jeton: "var(--font-size-h1)", bornes: bornes("h1") },
  { nom: "h2", fiche: "h2", jeton: "var(--font-size-h2)", bornes: bornes("h2") },
  { nom: "h3", fiche: "h3", jeton: "var(--font-size-h3)", bornes: bornes("h3") },
];

/* Le corps, tel que le moteur le pose : 16 × l'axe de largeur, jamais
   sous 16. Le zoom du lecteur rétrécit la fenêtre en pixels CSS puis
   agrandit tout — c'est ce que fait le navigateur, et c'est pour ça que
   le vw seul échoue (T3) : sa part d'écran ne bouge pas, le texte non plus. */
const CORPS: number = REGISTRE["font-size-body"].base;
function corpsPx(largeurEcran: number, zoom: number, vwSeul: boolean): number {
  if (vwSeul) return aLargeur(CORPS, "type", largeurEcran, CORPS); /* casse : tout en vw, le zoom ne mord plus */
  return aLargeur(CORPS, "type", largeurEcran / zoom, CORPS) * zoom;
}

/* La largeur réelle de l'écran, observée — les démos vivent dessus. */
function useLargeurEcran(): number {
  const [l, setL] = useState(0);
  useEffect(() => {
    const lire = () => setL(document.documentElement.clientWidth);
    lire();
    window.addEventListener("resize", lire);
    return () => window.removeEventListener("resize", lire);
  }, []);
  return l;
}

const DECISIONS = { t: "Décisions du 25 août 2026, séance sur pièce", h: "#" };

const REGLES: { id: string; nom: string; titre: string; enonce: string; pourquoi?: string; div?: string; src: { t: string; h: string }[] }[] = [
  { id: "p01", nom: "principe", titre: "Le sens et la lisibilité sont deux décisions séparées",
    enonce: "Le niveau d'un titre suit la structure du contenu ; sa taille suit le design. Un h2 peut légitimement être rendu plus petit qu'un h3 — aucune des deux décisions ne se prend à la place de l'autre.",
    src: [{ t: "GOV.UK — Typography", h: "https://design-system.service.gov.uk/styles/typography/" }, { t: "MDN — Heading elements", h: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements" }] },
  { id: "t1", nom: "T1", titre: "Jamais de saut de niveau",
    enonce: "Les niveaux de titre se suivent sans saut — un h2 n'est jamais suivi directement d'un h4.",
    pourquoi: "Un saut casse l'arbre que le lecteur d'écran parcourt : l'utilisateur conclut à du contenu manquant. Aucun bénéfice en échange.",
    src: [{ t: "WCAG 1.3.1 — techniques WAI", h: "https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html" }] },
  { id: "g1", nom: "G1", titre: "Exactement un h1 par page",
    enonce: "Ni deux, ni zéro : le h1 est le titre du document, pas le plus gros texte de la page.",
    pourquoi: "Le référencement lit le h1 comme le sujet de la page — l'absence coûte autant que la duplication. Déjà tenu par un garde-fou automatique.",
    src: [{ t: "MDN — Heading elements", h: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements" }] },
  { id: "t2", nom: "T2", titre: "La taille glisse",
    enonce: "Les tailles varient continûment entre deux bornes selon la largeur — pas de paliers de media queries. La variation vit dans le jeton, jamais dans un écran.",
    pourquoi: "C'est le jumeau typographique du rythme : si chaque écran redéfinissait ses corps, le système n'existerait plus. Un régime est une mise en page, jamais une échelle.",
    src: [{ t: "Smashing — Fluid Type (2023)", h: "https://www.smashingmagazine.com/2023/11/addressing-accessibility-concerns-fluid-type/" }, DECISIONS] },
  { id: "t3", nom: "T3", titre: "Le zoom garde ses droits",
    enonce: "Jamais de taille en unités d'écran seules (vw). Toute taille fluide porte une part rem dans ses trois parties : minimum, préférée, maximum.",
    pourquoi: "L'utilisateur zoome, la fenêtre ne bouge pas : un texte en vw seul ne grandit pas. Échec d'accessibilité silencieux — invisible en test standard, bloquant pour qui dépend du zoom.",
    src: [{ t: "WCAG 1.4.4 — Resize Text", h: "https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html" }, { t: "Roselli — Responsive Type and Zoom", h: "https://adrianroselli.com/2019/12/responsive-type-and-zoom.html" }] },
  { id: "t4", nom: "T4", titre: "Un seul rapport, un seul curseur",
    enonce: `Chaque cran vaut le précédent × ${fr2(RAPPORT)}, du petit à l'affiche et jusqu'aux titres du site. Toute l'échelle glisse d'un même facteur avec la largeur — × ${fr2(GLISSEMENT)} entre ${ECRAN_MIN} et ${ECRAN_MAX} px — et aucun cran ne s'étire seul.`,
    pourquoi: "Un cran étiré à part casse la hiérarchie qu'il devait servir ; un glissement doux garde ses 200 % de zoom sur toutes les largeurs. Et même conforme, on teste au zoom réel, pas à la formule.",
    src: [{ t: "Smashing — Fluid Type (2023)", h: "https://www.smashingmagazine.com/2023/11/addressing-accessibility-concerns-fluid-type/" }, DECISIONS] },
  { id: "t5", nom: "T5", titre: "Qui glisse se borne",
    enonce: "Tout bloc de texte courant porte une largeur maximale exprimée en ch — jamais en pixels. La règle exige la borne ; la valeur exacte reste un choix du système, documenté.",
    pourquoi: "Sans borne, la taille monte en butée pendant que la ligne s'allonge : la fluidité dégrade la lecture qu'elle devait servir. Les plages publiées divergent (45–75 Bringhurst, 40–60 Material) — on cite les sources comme motif, jamais comme exigence.",
    div: "Une max-width de 65ch laisse passer plus de 65 caractères : ch mesure la chasse du « 0 », pas la moyenne. D'où la mesure au rendu plutôt que la confiance en la déclaration.",
    src: [{ t: "Butterick — Practical Typography", h: "https://practicaltypography.com/summary-of-key-rules.html" }, { t: "MDN — CSS length units", h: "https://developer.mozilla.org/en-US/docs/Web/CSS/length" }] },
  { id: "t6", nom: "T6", titre: "Le texte courant respire à 1,5 minimum",
    enonce: "Interlignage d'au moins 1,5 fois le corps pour le texte de lecture ; les grands corps ont le droit de serrer.",
    pourquoi: "C'est le pont promis par la fondation rythme : l'espace entre les lignes fait plus pour la lisibilité que le choix de la font.",
    src: [{ t: "WCAG 1.4.8 — Visual Presentation", h: "https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html" }, { t: "MDN — line-height", h: "https://developer.mozilla.org/en-US/docs/Web/CSS/line-height" }] },
  { id: "t7", nom: "T7", titre: "Le demi-gras porte les titres, jamais le texte long",
    enonce: "Aucun bloc de texte long en demi-gras ; aucune graisse plus fine que la standard sous le corps courant.",
    pourquoi: "Un paragraphe entier appuyé n'a plus d'emphase du tout ; la finesse en petit corps dégrade le contraste réel du trait, même quand la couleur passe les seuils.",
    src: [{ t: "IBM Carbon — Typography", h: "https://carbondesignsystem.com/elements/typography/overview/" }] },
  { id: "t8", nom: "T8", titre: "Les capitales : brèves, espacées, jamais tapées",
    enonce: "Casse haute réservée aux étiquettes courtes, avec 5 à 12 % d'interlettrage, appliquée par la feuille de style — le contenu source reste en casse normale.",
    pourquoi: "Les capitales, dessinées pour ouvrir des phrases, se serrent sans interlettrage — et la silhouette de mot disparaît sur du texte courant.",
    src: [{ t: "Butterick — Practical Typography", h: "https://practicaltypography.com/summary-of-key-rules.html" }, { t: "MDN — text-transform", h: "https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform" }] },
  { id: "t9", nom: "T9", titre: "Fer à gauche, jamais justifié, centré réservé",
    enonce: "Début de ligne aligné par défaut ; aucun texte d'interface justifié ; le centrage est réservé aux titres courts, jamais à un paragraphe.",
    div: "Les études empiriques sur la justification sont non concluantes. La règle tient sur WCAG 1.4.8 et sur les rivières d'espace sans césure fiable. Dit, pas caché.",
    src: [{ t: "WCAG 1.4.8 — Visual Presentation", h: "https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html" }] },
  { id: "t10", nom: "T10", titre: "Jamais sous l'équivalent 16 px",
    enonce: `Le texte courant ne descend jamais sous 16 px d'équivalent, en rem — les champs de saisie non plus. Le corps vaut 16 × l'axe de largeur, borné par le bas : sur l'écran le plus étroit il fait 16, jamais ${fr(CORPS * AXES.type.min)}. Le petit cran (${fr(REGISTRE["font-size-small"].base)}) est une étiquette, jamais du texte courant.`,
    pourquoi: "Sous 16 px, Safari iOS zoome la page entière au focus d'un champ. Comportement de plateforme, pas décision esthétique — et un corps qui glisse sous son plancher le franchit sans que personne ne le voie.",
    src: [{ t: "CSS-Tricks — 16px form zoom", h: "https://css-tricks.com/16px-or-larger-text-prevents-ios-form-zoom/" }, { t: "MDN — font-size", h: "https://developer.mozilla.org/en-US/docs/Web/CSS/font-size" }, DECISIONS] },
  { id: "t11", nom: "T11", titre: "La font déclarée est la font livrée",
    enonce: "Toute font déclarée est appariée à un fichier versé au dépôt, au nom strictement identique, avec sa pile de secours. Aucun nom orphelin.",
    pourquoi: "Un nom qui ne correspond pas ne produit aucune erreur : il produit un produit entier en font système — et rien, nulle part, ne le signale.",
    div: "Les fonts de ce kit sont livrées avec lui : Geist, et JetBrains Mono pour le code.",
    src: [{ t: "Règle interne du système", h: "#" }] },
  { id: "t12", nom: "T12", titre: "Le calage se déclare, il ne se tape pas",
    enonce: "Le haut d'un texte se cale sur la hauteur de ses capitales, son bas sur sa ligne de base, et cela se déclare. Aucune marge négative, aucun décalage vertical posé à l'œil pour rattraper l'air d'une ligne.",
    pourquoi: "Le navigateur ajoute la moitié de l'interligne au-dessus et au-dessous de chaque ligne, et la font réserve déjà de la place pour les accents et les jambages. Un texte est donc centré au calcul et décentré à l'œil : la même valeur d'espace, posée des quatre côtés, n'en paraît jamais une.",
    div: "Aucune source ne dit à partir de quel écart le décalage devient une faute, et aucun grand système n'a tranché. Ce qui se vérifie ici n'est donc pas un montant : c'est la provenance du calage.",
    src: [{ t: "CSS Inline Layout 3 — text-box-trim", h: "https://drafts.csswg.org/css-inline-3/#text-box-trim" }, { t: "MDN — text-box-trim", h: "https://developer.mozilla.org/en-US/docs/Web/CSS/text-box-trim" }, { t: "Chrome — CSS text-box-trim", h: "https://developer.chrome.com/blog/css-text-box-trim" }] },
];

function Regles({ ids }: { ids: string[] }) {
  return (
    <div style={{ display: "grid", gap: "var(--gap-1-block)" }}>
      {ids.map((id) => REGLES.find((r) => r.id === id)!).map((r) => (
        <div key={r.id} style={{ display: "grid", gap: "var(--gap-3-block)", maxWidth: "var(--measure)" }}>
          <b style={{ color: "var(--text-primary)" }}><span className="badge">{r.nom}</span> {r.titre}</b>
          <span>{r.enonce}</span>
          {r.pourquoi && <span className="sourd">{r.pourquoi}</span>}
          {r.div && <div className="divergence" style={{ fontSize: "var(--font-size-small)" }}>{r.div}</div>}
          <span style={{ fontSize: "var(--font-size-small)" }}>Sources : {r.src.map((sc, i) => (
            <span key={sc.t}>{i > 0 && " · "}{sc.h === "#" ? sc.t : <a href={sc.h}>{sc.t}</a>}</span>
          ))}</span>
        </div>
      ))}
    </div>
  );
}

/* ── PREUVE 02 — la mesure, comptée sur la page rendue.
   Même texte partout : seule la largeur change. ── */
const TEXTE_MESURE =
  "L'œil ne lit pas des lettres : il saute de groupe en groupe, et chaque " +
  "saut se paie au retour à la ligne. Trop longue, la ligne le perd — il " +
  "relit la même phrase ; trop courte, elle l'essouffle. La bonne mesure " +
  "rend ce prix invisible, et personne ne la remarque : c'est toute sa gloire.";

type CleCas = "court" | "juste" | "sans";

/* Le verdict n'est PAS décidé par le bouton : il est lu sur la ligne
   réellement rendue, à la largeur réelle du cadre (verdict d'Auteur,
   2 septembre — « en responsive ça n'est pas une erreur sur mobile »).
   Sur un cadre étroit, l'absence de borne ne produit aucune faute : c'est
   l'écran qui borne la ligne. Dire « erreur » là serait mentir, et la page
   qui documente l'honnêteté ne peut pas se le permettre. */
function LigneMesuree({ cas, maxW }: { cas: CleCas; maxW?: string }) {
  const [n, setN] = useState(0);
  const [borneDedans, setBorneDedans] = useState(true);
  const [franchie, setFranchie] = useState(false);
  const [contrainte, setContrainte] = useState(true);
  const [p, setP] = useState<HTMLParagraphElement | null>(null);
  const [z, setZ] = useState<HTMLSpanElement | null>(null);
  const [piste, setPiste] = useState<HTMLDivElement | null>(null);
  const [borne, setBorne] = useState<HTMLSpanElement | null>(null);
  useEffect(() => {
    if (!p || !z || !piste || !borne) return;
    const lire = () => {
      const large = p.getBoundingClientRect().width;
      const jusqua = borne.getBoundingClientRect().width;
      const ch = z.getBoundingClientRect().width / 20;
      if (ch > 0) setN(Math.round(large / ch));
      /* Le trait et le verdict lisent la MÊME chose : la largeur du bloc de
         texte comparée à celle de la borne. Un seuil en nombre de caractères
         les faisait diverger — la ligne franchissait le trait pendant que le
         badge disait encore que tout allait bien (verdict d'Auteur,
         2 septembre). Le compte de caractères reste affiché, mais il ne juge
         plus : ch mesure la chasse du « 0 », pas la moyenne (divergence T5). */
      const cadre = piste.getBoundingClientRect().width;
      setBorneDedans(jusqua < cadre - 1);
      setFranchie(large > jusqua + 1);
      /* La largeur choisie mord-elle vraiment ? Sur un cadre étroit, une
         borne plus large que le cadre ne décide plus rien : c'est l'écran
         qui coupe la ligne. Dire « trop court » là serait le même mensonge
         que « sans borne » sur mobile. */
      setContrainte(large < cadre - 1);
    };
    lire();
    const ro = new ResizeObserver(lire);
    ro.observe(p); ro.observe(piste);
    return () => ro.disconnect();
  }, [p, z, piste, borne]);

  /* Le verdict tient en deux mots (verdict d’Auteur, 2 septembre : « je
     préfère juste trop long »). L’explication vit déjà dans la colonne de
     gauche et dans la légende ; la répéter dans la pastille, c’est faire
     lire trois fois la même chose. Le compte de caractères, lui, reste —
     mais à côté de la pastille, en sourdine : il mesure, il ne juge pas.
     « L’écran suffit » est le même verdict pour les TROIS cas, et c’est
     juste : dès que la largeur choisie est plus large que le cadre, elle ne
     décide plus rien — c’est l’écran qui tient la ligne, qu’on ait demandé
     28 ch, la mesure du registre, ou rien du tout. Sur un cadre de 320 px
     les trois boutons donnent la même ligne, et la page doit le dire au
     lieu de faire semblant de juger. */
  const ecran = { etat: "", sourd: false, verdict: "L’écran suffit" };
  const dit = cas === "court"
    ? (contrainte ? { etat: "ko", sourd: true, verdict: "Trop court" } : ecran)
    : cas === "juste"
      ? (borneDedans ? { etat: "bon", sourd: false, verdict: "Juste" } : ecran)
      : (franchie ? { etat: "ko", sourd: true, verdict: "Trop long" } : ecran);

  return (
    <div className={`gd-mesure ${dit.sourd ? "sourdine" : ""}`}>
      <span className="gd-mesure-dit">
        <span className={`badge ${dit.etat}`}>{dit.verdict}</span>
        <span className="mono sourd">≈ {n} caractères par ligne</span>
      </span>
      {/* La borne du registre, rendue visible. Sans ce trait, « juste » et
          « sans borne » se ressemblent dès que le cadre est étroit : l'écart
          de largeur est trop petit pour se voir. Le trait transforme cet
          écart en FRANCHISSEMENT — et un franchissement, ça se voit. Quand
          la borne tombe hors du cadre, le trait s'efface : il n'a plus rien
          à dire, et il mentirait collé au bord. */}
      <div className="gd-mesure-piste" ref={setPiste}>
        <span ref={setBorne} className={`gd-mesure-borne ${borneDedans ? "" : "hors"}`} aria-hidden="true">
          <b>la borne</b>
        </span>
        <p ref={setP} style={{ maxWidth: maxW, width: maxW ? undefined : "100%" }}>
          <span ref={setZ} aria-hidden style={{ position: "absolute", visibility: "hidden", whiteSpace: "pre" }}>00000000000000000000</span>
          {TEXTE_MESURE}
        </p>
      </div>
    </div>
  );
}

/* ── PREUVE 02 — la mesure, dans un cadre à poignée (verdict d'Auteur,
   2 septembre : « c'est trop haut »). Les trois largeurs ne s'empilent
   plus : trois boutons, un cas à la fois, et la section tient sur un
   écran. Le cadre apporte ce que la pile ne montrait pas : la largeur est
   une VARIABLE, et le même réglage est juste ou fautif selon elle. Les
   trois boutons ne décident donc que la largeur du texte — le verdict,
   lui, se lit sur la ligne rendue (voir LigneMesuree). ── */
const CAS = [
  { cle: "court", nom: "Trop court", maxW: "28ch" },
  { cle: "juste", nom: "Juste", maxW: "var(--measure)" },
  { cle: "sans", nom: "Sans borne", maxW: undefined },
] as const;
/* hors chaîne : la largeur maximale du cadre de cette démonstration — une
   mesure d'écran simulé, pas une distance du kit */
const CADRE_MESURE = 1100;

function MesureEnCadre() {
  const [cle, setCle] = useState<CleCas>("juste");
  const cas = CAS.find((c) => c.cle === cle)!;
  return (
    <Apercu
      plafond={CADRE_MESURE}
      fond="uni"
      outils={<>
        <span className="mono sourd">La largeur du texte :</span>
        {CAS.map((c) => (
          <button key={c.cle} className={`bouton ${cle === c.cle ? "on" : ""}`}
            aria-pressed={cle === c.cle} onClick={() => setCle(c.cle)}>{c.nom}</button>
        ))}
      </>}
      enfants={() => <LigneMesuree key={cas.cle} cas={cas.cle} maxW={cas.maxW} />}
      pied={<span className="gd-legende">Le pointillé est la borne. Tirez la poignée :
        la faute n&apos;apparaît qu&apos;en s&apos;élargissant.</span>}
    />
  );
}

/* ── RÉPERTOIRE — l'arbre des titres, compact. En encre ; le rouge à la
   faute. Un niveau = une marge de card, par imbrication : jamais un
   multiplicateur. ── */
function Retrait({ niveaux, children }: { niveaux: number; children: ReactNode }) {
  let n: ReactNode = children;
  for (let i = 0; i < niveaux; i++) n = <div className="gd-arbre-niveau">{n}</div>;
  return <>{n}</>;
}

function Arbre({ saut }: { saut: boolean }) {
  const rangs: [string, number, boolean][] = saut
    ? [["h1 · Le dossier", 0, false], ["h2 · Première partie", 1, false], ["h4 · Un détail", 3, true], ["h2 · Deuxième partie", 1, false]]
    : [["h1 · Le dossier", 0, false], ["h2 · Première partie", 1, false], ["h3 · Sous-partie", 2, false], ["h2 · Deuxième partie", 1, false]];
  return (
    <div className="gd-arbre">
      {saut && (
        <Retrait niveaux={2}>
          <div className="gd-arbre-note">h3 manquant — le lecteur d&apos;écran conclut à du contenu disparu</div>
        </Retrait>
      )}
      {rangs.map(([txt, prof, ko]) => (
        <Retrait key={txt} niveaux={prof}>
          <div className={`gd-arbre-rang ${ko ? "ko" : ""}`}>{txt}</div>
        </Retrait>
      ))}
    </div>
  );
}

/* ── Étage « en liste » — ce qu'aucune image ne prouve. Chaque ligne dit
   où elle se vérifie : dans le code, sur l'écran allumé, ou nulle part. ── */
const LISTE: LigneListe[] = [
  { nom: "Le sens et la lisibilité sont deux décisions séparées",
    dit: "Le niveau d'un titre suit la structure du contenu ; sa taille suit le design. Un h2 rendu plus petit qu'un h3 est légitime — aucune des deux décisions ne se prend à la place de l'autre.",
    ou: "nulle part — décision d'Auteur", ton: "auteur" },
  { nom: "Exactement un h1 par page",
    dit: "Ni deux, ni zéro : le h1 est le titre du document, pas le plus gros texte de la page. L'absence coûte autant que la duplication.",
    ou: "dans le code" },
  { nom: "La font déclarée est la font livrée",
    dit: "Toute font déclarée est appariée à un fichier versé au dépôt, au nom strictement identique, avec sa pile de secours. Un nom orphelin ne produit aucune erreur : juste un produit entier en font système.",
    ou: "dans le code" },
  { nom: "La taille glisse, jamais par paliers",
    dit: "Les tailles varient continûment entre deux bornes selon la largeur, et la variation vit dans la définition du jeton. Aucun écran ne redéfinit un corps.",
    ou: "dans le code" },
  { nom: "Un seul rapport, un seul curseur",
    dit: "Chaque cran vaut le précédent multiplié par le même intervalle, et toute l'échelle glisse d'un même facteur avec la largeur. Aucun cran ne s'étire tout seul.",
    ou: "dans le code" },
  { nom: "Qui glisse se borne",
    dit: "Tout bloc de texte courant porte une largeur maximale exprimée en ch, jamais en pixels. La règle exige la borne ; la valeur exacte reste un choix du système, documenté.",
    ou: "dans le code" },
  { nom: "Le texte courant respire à 1,5 minimum",
    dit: "Interlignage d'au moins une fois et demie le corps pour le texte de lecture ; les grands corps, eux, ont le droit de serrer.",
    ou: "sur l'écran allumé", ton: "rendu" },
  { nom: "Le centrage reste aux titres courts",
    dit: "Début de ligne aligné par défaut, aucun texte d'interface justifié, et le centrage réservé aux titres brefs — jamais un paragraphe.",
    ou: "sur l'écran allumé", ton: "rendu" },
  { nom: "L'ancienne façon d'écrire le calage est refusée",
    dit: "Les anciens noms de la propriété ne déclenchent aucune erreur : ils ne font rien, en silence. Et c'est l'éditeur de maquettes qui les produit encore — le copier-coller depuis la maquette est le chemin par lequel la faute entre.",
    ou: "dans le code" },
  { nom: "On rogne par rôle, jamais par composant",
    dit: "Un rôle de texte est calé partout ou nulle part. Deux titres de même rôle, l'un calé l'autre non, c'est deux systèmes d'espacement dans le même écran — et plus aucun moyen de dire lequel fait foi.",
    ou: "dans le code" },
  { nom: "La pile de secours est calée sur la font livrée",
    dit: "Tant que la font n'est pas arrivée, le texte se peint dans la police système. Si ses mesures diffèrent, tout saute à la bascule — et le calage se recalcule sur les mauvaises.",
    ou: "dans le code" },
];

/* ── Étage « dans le code » — les tailles sont LUES dans le registre
   calculé, jamais recopiées : si l'échelle bouge, ce tableau bouge. ── */
const CODE: LigneCode[] = [
  { regle: "Le corps courant",
    ecrit: <><span className="cs-kw">font-size</span>: <span className="cs-var">var(--font-size-body)</span></>,
    produit: bornes("body"), note: "seize pixels sur l'écran le plus étroit — le plancher ne se franchit jamais" },
  { regle: "L'air entre les lignes",
    ecrit: <><span className="cs-kw">line-height</span>: <span className="cs-var">var(--leading-body)</span></>,
    produit: "l'air du texte courant", note: "au moins une fois et demie le corps" },
  { regle: "La largeur d'un bloc de texte",
    ecrit: <><span className="cs-kw">max-width</span>: <span className="cs-var">var(--measure)</span></>,
    produit: "la ligne se borne", note: "en ch, jamais en pixels" },
  { regle: "Un titre de niveau 2",
    ecrit: <><span className="cs-kw">font-size</span>: <span className="cs-var">var(--font-size-h2)</span></>,
    produit: bornes("h2"), note: "le cran précédent × l'intervalle, avec du rem dans chaque borne" },
  { regle: "L'affiche", repli: true,
    ecrit: <><span className="cs-kw">font-size</span>: <span className="cs-var">var(--font-size-display)</span></>,
    produit: bornes("display"), note: "le haut de l'échelle du texte" },
  { regle: "L'étiquette", repli: true,
    ecrit: <><span className="cs-kw">font-size</span>: <span className="cs-var">var(--font-size-small)</span></>,
    produit: bornes("small"), note: "une étiquette, jamais du texte courant" },
  { regle: "Les capitales", repli: true,
    ecrit: <><span className="cs-kw">text-transform</span>: <span className="cs-var">uppercase</span></>,
    produit: "posées par le style", note: "le texte source garde sa casse — les lecteurs d'écran lisent l'original" },
  { regle: "L'interlettrage de l'étiquette", repli: true,
    ecrit: <><span className="cs-kw">letter-spacing</span>: <span className="cs-var">var(--tracking-label)</span></>,
    produit: "les capitales respirent", note: "sans lui, la casse haute se serre et le mot perd sa silhouette" },
  { regle: "Le demi-gras", repli: true,
    ecrit: <><span className="cs-kw">font-weight</span>: <span className="cs-var">600</span></>,
    produit: "réservé aux titres", note: "un paragraphe entier appuyé n'appuie plus rien" },
  { regle: "La font qui lit", repli: true,
    ecrit: <><span className="cs-kw">font-family</span>: <span className="cs-var">var(--font-sans)</span></>,
    produit: "Geist, livrée avec le kit", note: "le nom déclaré correspond à un fichier versé au dépôt" },
  { regle: "L'air des titres", repli: true,
    ecrit: <><span className="cs-kw">line-height</span>: <span className="cs-var">var(--leading-heading)</span></>,
    produit: "les grands corps serrent", note: "la règle de 1,5 protège la lecture longue, pas une affiche" },
];

const SOMMAIRE: Sommaire = [
  ["fonts", "01", "Les fonts"],
  ["gamme", "02", "L'échelle"],
  ["mesure", "03", "La mesure"],
  ["gazette", "04", "La gazette"],
  ["casser", "05", "Les règles qu'on peut casser"],
  ["invisibles", "06", "Les règles qu'on ne peut pas montrer"],
  ["code", "07", "Dans le code"],
];

/* ── LE CALAGE — la même valeur d'espace, des quatre côtés ──────────────
   Au repos, le texte est calé sur ses capitales et sur sa ligne de base :
   la valeur écrite est celle qu'on voit. Cassée, la carte laisse revenir
   l'air de la ligne, et le haut cesse d'être égal aux côtés.
   Le nombre affiché est MESURÉ sur la page rendue, jamais déclaré : un
   témoin de la hauteur des capitales, posé sur la ligne de base, donne le
   haut des lettres à même la font livrée. */
function CarteCalee({ casse }: { casse: boolean }) {
  const carte = useRef<HTMLDivElement>(null);
  const capitale = useRef<HTMLSpanElement>(null);
  const [haut, setHaut] = useState(0);
  const [cote, setCote] = useState(0);
  const [surCarte, setSurCarte] = useState(true);

  useEffect(() => {
    setSurCarte(typeof CSS !== "undefined" && CSS.supports("text-box-trim", "trim-both"));
  }, []);

  useEffect(() => {
    const mesurer = () => {
      const c = carte.current, k = capitale.current;
      if (!c || !k) return;
      setHaut(k.getBoundingClientRect().top - c.getBoundingClientRect().top);
      /* le côté se mesure comme le haut : depuis le bord extérieur de la
         carte, trait du cadre compris — sinon on compare deux choses qui
         ne partent pas du même endroit. */
      const st = getComputedStyle(c);
      setCote(parseFloat(st.paddingLeft) + parseFloat(st.borderLeftWidth));
    };
    mesurer();
    /* la font livrée arrive après la première peinture : on remesure quand elle est là */
    if (typeof document !== "undefined" && document.fonts) void document.fonts.ready.then(mesurer);
    window.addEventListener("resize", mesurer);
    return () => window.removeEventListener("resize", mesurer);
  }, [casse]);

  return (
    <div className="tp-scene">
      <div ref={carte} className={`tp-calage ${casse ? "casse" : ""}`}
        data-intent={casse ? "statement" : undefined}>
        <p>
          <span ref={capitale} className="tp-temoin" aria-hidden="true" />
          Coursue — départs du soir
        </p>
      </div>
      {!surCarte
        ? <span className="badge">votre navigateur ne sait pas encore caler le texte — la démo ne peut rien montrer ici</span>
        : casse
          ? <span className="badge ko">le haut mesure {fr(haut)} px là où les côtés en font {fr(cote)} — la valeur écrite n&apos;est plus celle qu&apos;on voit</span>
          : <span className="mono sourd">haut {fr(haut)} px · côtés {fr(cote)} px — une seule valeur, des quatre côtés</span>}
    </div>
  );
}

export default function Vue() {
  /* preuves */
  const [mauvaisNom, setMauvaisNom] = useState(false);
  const [justif, setJustif] = useState(false);
  const [serre, setSerre] = useState(false);
  /* répertoire */
  const [zoom, setZoom] = useState(2); /* le zoom est ALLUMÉ d'entrée : la démo montre ce qui doit tenir sous zoom, pas l'état de repos (verdict d'Auteur, 31 août) */
  const [vwSeul, setVwSeul] = useState(false);
  const [saut, setSaut] = useState(false);
  const [gras, setGras] = useState(false);
  const [tape, setTape] = useState(false);
  const [petit, setPetit] = useState(false);
  const [calage, setCalage] = useState(false);
  const actifId = useDocSections("fonts");
  const largeurEcran = useLargeurEcran();
  const corps = largeurEcran > 0 ? corpsPx(largeurEcran, zoom, vwSeul) : CORPS;

  return (
    <div className="gdoc-fond">
      <div className="gdoc">
        <RailDoc page="typo" titre="Fondation · Typographie" sommaire={SOMMAIRE} actifId={actifId} pied="Geist · JetBrains Mono — livrées avec le kit" />

        <main className="gdoc-contenu" id="contenu">

          <section className="gdoc-heros">
            <p className="kicker">La typographie</p>
            <h1>Vous êtes en train de lire la démonstration<span className="point" aria-hidden="true" /></h1>
            <p className="chapo">
              Personne ne remarque une bonne typographie — c&apos;est même à ça qu&apos;on
              la reconnaît. Le corps, la ligne, l&apos;air, les capitales : tout ça
              travaille pendant que vous lisez, et vous n&apos;y pensez pas une seconde.
              <b>Cette page fait le contraire : elle montre le travail.</b>
            </p>
          </section>

          {/* ═══ PREUVE 1 · VOCABULAIRE — les fonts ═══ */}
          <section className="gdoc-sec pose" id="fonts">
            <div className="gdoc-sec-tete">
              <p className="kicker">01 · Les fonts</p>
              <h2>Deux fonts suffisent</h2>
              <p className="sourd">Chaque font qu&apos;on ajoute est une décision de plus à tenir pendant
              des années, et personne n&apos;a jamais remercié un produit d&apos;en avoir six.
              Le kit en garde deux : une qui lit, une qui chiffre. Le titre, le texte
              courant, l&apos;étiquette, le code — chacun a son réglage, décidé une fois.
              Essayez le bouton : déclarez une font qui n&apos;existe pas, et vous vous
              retrouvez en font système sans qu&apos;une seule erreur ne s&apos;affiche.</p>
            </div>
            <div className="gdoc-corps">
              <div className="rang">
                <button className={`bouton casse ${mauvaisNom ? "on" : ""}`} onClick={() => setMauvaisNom(!mauvaisNom)}>
                  {mauvaisNom ? "Réparer le nom" : "Casser : déclarer « Geist Text »"}
                </button>
                {mauvaisNom && (
                  <span className="badge ko">nom orphelin — font système, en silence</span>
                )}
              </div>
              <figure className="gd-figure" style={{ width: "100%" }}>
                {/* casse : « Geist Text » n'existe pas — la pile de secours prend la main, en silence */}
                <div className="gd-voix" data-intent={mauvaisNom ? "statement" : undefined} style={mauvaisNom ? { fontFamily: '"Geist Text", ui-sans-serif, system-ui, sans-serif' } : undefined}>
                  <div className="gd-vbloc primaire">
                    <span className="gd-vglyphe" aria-hidden="true">Aa</span>
                    <div className="gd-vqui"><b>Geist</b><span>400 · 500 · 600</span></div>
                  </div>
                  <div className="gd-vbloc sombre">
                    <span className="gd-vglyphe" aria-hidden="true">01</span>
                    <div className="gd-vqui"><b>JetBrains Mono</b><span>400 · 600</span></div>
                  </div>
                </div>
                <figcaption className="gd-legende">
                  une font qui lit, une font qui chiffre — livrées avec le kit, au nom près
                </figcaption>
              </figure>
              <div className="gd-costumes" data-intent={mauvaisNom ? "statement" : undefined} style={mauvaisNom ? { fontFamily: '"Geist Text", ui-sans-serif, system-ui, sans-serif' } : undefined}>
                <div className="gd-costume">
                  <span className="role">Le titre</span>
                  <span className="spec titre">Il porte la page, brièvement</span>
                  <span className="fiche">Geist 600 · -0,02em</span>
                </div>
                <div className="gd-costume">
                  <span className="role">Le courant</span>
                  <span className="spec">Il se lit longtemps sans se faire remarquer</span>
                  <span className="fiche">Geist 400 · 1,6</span>
                </div>
                <div className="gd-costume">
                  <span className="role">L&apos;étiquette</span>
                  <span className="spec etiquette">Brève, espacée, jamais tapée</span>
                  <span className="fiche">Geist 500 · +0,08em</span>
                </div>
                <div className="gd-costume">
                  <span className="role">Le code</span>
                  <span className="spec code">chaque_chiffre = même_largeur;</span>
                  <span className="fiche">Mono 400 · tabular</span>
                </div>
              </div>
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <Regles ids={["t11", "t7"]} />
              </div></details>
            </div>
          </section>

          {/* ═══ RÉPERTOIRE — l'échelle : les huit crans du registre, en vrai ═══
              Chaque rangée est rendue PAR son jeton ; les bornes en légende
              sont calculées par le moteur, jamais recopiées. Huit crans : six
              pour le texte, deux pour les titres du site — des h5/h6 récurrents
              signalent une structure à réorganiser, pas un cran à ajouter. */}
          <section className="gdoc-sec pose" id="gamme">
            <div className="gdoc-sec-tete">
              <p className="kicker">02 · L&apos;échelle</p>
              <h2>Chaque taille vaut la précédente, un peu plus grande</h2>
              <p className="sourd">Tout ce que vous lisez ici sort de huit crans et d&apos;un seul
              rapport : chaque cran vaut le précédent, un peu plus grand, toujours du même
              pas. Six servent le texte, du petit à l&apos;affiche ; les deux derniers sont
              les titres du site. Un seul curseur les fait glisser ensemble avec la largeur
              de l&apos;écran, et le corps ne descend jamais sous son plancher. L&apos;échelle
              s&apos;arrête là : le jour où il vous faut un neuvième cran, c&apos;est la
              structure qu&apos;il faut revoir, pas l&apos;échelle qu&apos;il faut rallonger.</p>
            </div>
            <div className="gdoc-corps">
              <figure className="gd-figure" style={{ width: "100%", justifyItems: "start" }}>
                <div className="gd-gamme">
                  {CRANS.map(({ nom, fiche, jeton, bornes: b }) => (
                    <div key={nom} className="gd-gcran">
                      <span className="fiche">{fiche} · {b}</span>
                      <span className="spec" style={{ fontSize: jeton }}>Aucune taille n&apos;est posée à l&apos;œil.</span>
                    </div>
                  ))}
                  <div className="gd-gcran">
                    <span className="fiche">corps · {bornes("body")} · 1,6</span>
                    <span className="spec courant" style={{ fontSize: "var(--font-size-body)" }}>Le corps porte
                    le poids quotidien du système : notes, lecture longue, champs de
                    saisie. Posé à seize pixels au plus bas avec un interlignage détendu,
                    il reste discret, lisible et reconnaissable.</span>
                  </div>
                  <div className="gd-gcran">
                    <span className="fiche">petit · {bornes("small")} · étiquette seulement</span>
                    <span className="spec etiquette" style={{ fontSize: "var(--font-size-small)" }}>Jamais du texte courant — une étiquette, brève et espacée.</span>
                  </div>
                </div>
                {/* Une légende tient en UNE ligne : personne ne lit six clauses en
                    petit corps (verdict d'Auteur, 2 septembre). Le détail descend
                    dans le dépliant, qui est fait pour ça. */}
                <figcaption className="gd-legende" style={{ textAlign: "left" }}>
                  chaque cran vaut le précédent × {fr2(RAPPORT)} — et toute l&apos;échelle glisse avec l&apos;écran
                </figcaption>
              </figure>
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <p>Les bornes affichées sont <b>calculées</b>, jamais recopiées : le bas à
                {" "}{ECRAN_MIN} px d&apos;écran, le haut à {ECRAN_MAX}. Entre les deux, toute
                l&apos;échelle glisse d&apos;un même facteur — × {fr2(GLISSEMENT)} — et chaque
                borne porte du rem, pour que le zoom du lecteur garde la main. Les deux titres
                du site, eux, glissent entre deux crans de la chaîne : c&apos;est une intention
                d&apos;auteur, déclarée. Les titres se serrent à 1,2 ; le corps respire à 1,6.</p>
                <Regles ids={["t2", "t4"]} />
              </div></details>
            </div>
          </section>

          {/* ═══ PREUVE 2 · VARIATION — la mesure ═══ */}
          <section className="gdoc-sec pose" id="mesure">
            <div className="gdoc-sec-tete">
              <p className="kicker">03 · La mesure</p>
              <h2>Avant la taille, c&apos;est la largeur qui décide</h2>
              <p className="sourd">Même texte, même corps, même interligne : vous ne changez que la largeur. Une seule des trois se lit sans effort — les
              deux autres vous fatiguent en quelques lignes. Et le compteur ne fait pas
              confiance à la déclaration : il mesure la ligne réelle, dans le cadre que vous
              avez sous les yeux.</p>
            </div>
            <div className="gdoc-corps">
              <MesureEnCadre />
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <Regles ids={["t5", "t6"]} />
              </div></details>
            </div>
          </section>

          {/* ═══ PREUVE 3 · OBJET EN SITUATION — la gazette ═══ */}
          <section className="gdoc-sec pose" id="gazette">
            <div className="gdoc-sec-tete">
              <p className="kicker">04 · La gazette</p>
              <h2>Personne n&apos;a réglé un seul titre à la main</h2>
              <p className="sourd">Un spécimen de font, tout le monde peut en faire un joli. Le vrai
              test, c&apos;est un objet réel qui tient debout sans qu&apos;on aille régler
              chaque titre à la main. Cette gazette est composée par les règles, et rien
              d&apos;autre. Cassez-en une, puis relisez : la page ment aussitôt.</p>
            </div>
            <div className="gdoc-corps">
              <div className="rang">
                <button className={`bouton casse ${justif ? "on" : ""}`} onClick={() => { setJustif(!justif); if (!justif) setSerre(false); }}>
                  {justif ? "Réparer le fer" : "Casser : justifier"}
                </button>
                <button className={`bouton casse ${serre ? "on" : ""}`} onClick={() => { setSerre(!serre); if (!serre) setJustif(false); }}>
                  {serre ? "Rendre l'air" : "Casser : étouffer l'interligne"}
                </button>
                {(justif || serre) && (
                  <span className="badge ko">
                    {justif ? "Justifié — rivières d'espace, retour de ligne irrégulier" : "Étouffé — interligne 1,15, sous le plancher de 1,5"}
                  </span>
                )}
              </div>
              <figure className="gd-figure">
                {/* Essai du 2 septembre : la gazette est posée sur une terre sombre
                      plutôt que sur le voile gris. Une feuille de papier se lit comme
                      une feuille quand ce qui l'entoure n'est pas, lui aussi, du
                      papier. « sombre » est une variante déjà déclarée du banc — pas
                      une couleur nouvelle. */}
                <div className="banc sombre">
                  <div className={`gazette ${justif ? "j-cassee" : ""} ${serre ? "i-cassee" : ""}`} data-intent={justif || serre ? "statement" : undefined}>
                    <p className="gz-mast" aria-hidden="true">La Gazette du Kit</p>
                    <p className="gz-date">Nº 11 — vingt-cinq août — deux pages</p>
                    <p className="gz-head">Le rédacteur en chef supprime neuf familles de
                    caractères, la salle respire</p>
                    <p className="gz-lede">Il n&apos;en garde que deux — une qui lit, une qui
                    chiffre — et personne, à ce jour, n&apos;a remarqué qu&apos;il en manquait.</p>
                    <div className="gz-cols">
                      <p>La décision est tombée un lundi : chaque titre porterait le
                      demi-gras, jamais les paragraphes, et le courant ne descendrait
                      plus jamais sous son corps de lecture. Les protestations attendues
                      n&apos;eurent pas lieu.</p>
                      <p>Au marbre, on note que les lignes tiennent leur largeur — assez
                      pour ne pas essouffler l&apos;œil, jamais assez pour l&apos;égarer — et que
                      l&apos;air entre elles reste incompressible, quoi qu&apos;en dise le chef de
                      fabrication.</p>
                      <p>Les capitales, elles, n&apos;apparaissent plus qu&apos;en étiquettes
                      brèves et espacées, posées par la feuille de style ; le texte
                      source garde sa casse, et les lecteurs d&apos;écran lui en savent gré.</p>
                      <p>«&nbsp;On ne remarque plus la typographie&nbsp;», déplorait un
                      abonné. C&apos;est, répond la rédaction, très exactement le but.</p>
                    </div>
                    <p className="gz-note">Les titres de cette gazette sont dessinés, pas
                    réels : la page garde son unique h1.</p>
                  </div>
                </div>
                <figcaption className="gd-legende">
                  fer à gauche · corps ≥ 16 px · interligne 1,6 ·
                  mesure bornée en ch · capitales espacées, jamais tapées
                </figcaption>
              </figure>
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <Regles ids={["t9", "t8", "t10"]} />
              </div></details>
            </div>
          </section>

          {/* ── Les trois étages du dessous, au gabarit commun (etages.tsx) ── */}
          <section className="gdoc-sec pose" id="casser">
            <div className="gdoc-sec-tete">
              <p className="kicker">05 · Les règles qu&apos;on peut casser</p>
              <h2>Voyez ce qui se passe quand la règle saute</h2>
              <p className="sourd">Six dérives ordinaires, et pas une seule ne déclenche
              d&apos;erreur nulle part — c&apos;est précisément ce qui les rend coûteuses. Le bouton « Casser » ne dessine pas la faute, il la commet pour de
              vrai — puis la répare.</p>
            </div>
            <div className="gdoc-corps">
              <Bandes>
                <Bande nom="Le zoom du lecteur" cote="du rem dans chaque borne"
                  dit="Un lecteur agrandit le texte : la fenêtre, elle, ne bouge pas. Une taille exprimée en part d&apos;écran seule ne grandit donc pas d&apos;un pixel. L&apos;échec est silencieux — invisible en test standard, bloquant pour qui dépend du zoom."
                  casse={vwSeul} surCasse={setVwSeul}
                  libelleCasse="Casser : la part d&apos;écran seule"
                  regles={<Regles ids={["t3"]} />}>
                  <div className="tp-scene">
                    <button type="button" className={`bouton ${zoom === 2 ? "on" : ""}`}
                      aria-pressed={zoom === 2} onClick={() => setZoom(zoom === 2 ? 1 : 2)}>
                      Zoom ×2
                    </button>
                    {/* le corps calculé par le moteur à la largeur réelle de l'écran — le nombre est vrai, pas posé */}
                    <span data-intent={vwSeul ? "statement" : undefined}
                      style={{ fontSize: `${corps}px`, lineHeight: "var(--leading-body)" }}>
                      Portez ce vieux whisky au juge blond qui fume
                    </span>
                    {vwSeul && zoom > 1
                      ? <span className="badge ko">zoom ×{zoom} — et pas un pixel gagné</span>
                      : <span className="mono sourd">corps = {fr(corps)} px</span>}
                  </div>
                </Bande>

                <Bande nom="Le saut de niveau" cote="un niveau à la fois"
                  dit="Les niveaux de titre se suivent sans saut. Un h2 suivi directement d&apos;un h4 casse l&apos;arbre que le lecteur d&apos;écran parcourt : l&apos;utilisateur en conclut qu&apos;il manque du contenu. Aucun bénéfice en échange."
                  casse={saut} surCasse={setSaut}
                  regles={<Regles ids={["t1", "p01"]} />}>
                  <Arbre saut={saut} />
                </Bande>

                <Bande nom="La graisse" cote="les titres, jamais le texte long"
                  dit="Quand tout est important, plus rien ne l&apos;est. Un paragraphe entier en demi-gras n&apos;appuie plus rien du tout — et la graisse fine sous le corps courant dégrade le trait, même quand la couleur passe les seuils."
                  casse={gras} surCasse={setGras}
                  regles={<Regles ids={["t7"]} />}>
                  <div className="tp-scene">
                    <p data-intent={gras ? "statement" : undefined}
                      style={{ fontWeight: gras ? 600 : 400 }}>Un texte long en demi-gras
                    n&apos;appuie plus rien : quand tout est important, rien ne l&apos;est. Le
                    demi-gras appartient aux titres — ce paragraphe vient de vous le prouver.</p>
                    {gras && <span className="badge ko">tout le paragraphe en demi-gras — il n&apos;y a plus rien à mettre en avant</span>}
                  </div>
                </Bande>

                <Bande nom="Les capitales" cote="brèves, espacées, jamais tapées"
                  dit="Les capitales ont été dessinées pour ouvrir une phrase, pas pour en porter quatre. Sur du texte courant, elles effacent la silhouette des mots : l&apos;œil se met à épeler au lieu de lire."
                  casse={tape} surCasse={setTape}
                  regles={<Regles ids={["t8"]} />}>
                  <div className="tp-scene">
                    <p data-intent={tape ? "statement" : undefined}
                      style={tape ? { textTransform: "uppercase" } : undefined}>Les capitales sur
                    du texte courant effacent la silhouette des mots — l&apos;œil épelle au lieu
                    de lire. Ici elles restent aux étiquettes brèves, espacées, posées par le
                    style.</p>
                    {tape && <span className="badge ko">capitales sur du texte courant — la silhouette des mots a disparu</span>}
                  </div>
                </Bande>

                <Bande nom="Les 16 px du champ" cote="jamais sous le plancher"
                  dit="Sous seize pixels, Safari sur iPhone zoome la page entière dès qu&apos;on touche le champ. Ce n&apos;est pas une préférence esthétique, c&apos;est un comportement de plateforme — et il suffit d&apos;un champ pour l&apos;attraper."
                  casse={petit} surCasse={setPetit}
                  regles={<Regles ids={["t10"]} />}>
                  <div className="tp-scene champ">
                    {/* casse : un champ sous 16 px — 14 px en dur, à dessein ; Safari iOS zoome la page au focus */}
                    <span className="champ-boite">{/* l'enveloppe porte le halo de focus : un champ natif n'a pas de pseudo-éléments */}
                      <input readOnly value="prenom@exemple.fr" data-intent={petit ? "statement" : undefined}
                        style={{ fontSize: petit ? "0.875rem" : "var(--font-size-body)" }} />
                    </span>
                    {petit && <span className="badge ko">14 px — Safari iOS zoomera la page au focus</span>}
                  </div>
                </Bande>

                <Bande nom="Le calage du texte" cote="calé sur les capitales et la ligne de base"
                  dit="Le navigateur ajoute la moitié de l&apos;interligne au-dessus et au-dessous de chaque ligne, et la font réserve déjà de la place pour les accents et les jambages. Un texte est donc centré au calcul et décentré à l&apos;œil : la même valeur d&apos;espace, posée des quatre côtés, n&apos;en paraît jamais une."
                  casse={calage} surCasse={setCalage}
                  libelleCasse="Casser : laisser revenir l&apos;air"
                  regles={<Regles ids={["t12"]} />}>
                  <CarteCalee casse={calage} />
                </Bande>
              </Bandes>
            </div>
          </section>

          <section className="gdoc-sec pose" id="invisibles">
            <div className="gdoc-sec-tete">
              <p className="kicker">06 · Les règles qu&apos;on ne peut pas montrer</p>
              <h2>Elles se vérifient ailleurs — et on vous dit où</h2>
              <p className="sourd">Certaines règles ne se photographient pas. Elles se
              vérifient dans le code, à l&apos;écran allumé, ou nulle part du tout.</p>
            </div>
            <div className="gdoc-corps">
              <ListeRegles lignes={LISTE} />
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <Regles ids={["p01", "g1", "t11", "t2", "t4", "t5", "t6", "t9"]} />
              </div></details>
            </div>
          </section>

          <section className="gdoc-sec pose" id="code">
            <div className="gdoc-sec-tete">
              <p className="kicker">07 · Dans le code</p>
              <h2>Le même système, dans votre stack</h2>
            </div>
            <div className="gdoc-corps">
              <PanneauRegistre lignes={CODE} />
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <p><b>Ce qui remplace l&apos;extrait.</b> La page proposait un article prêt à
                coller, avec une bascule HTML / React / Angular. On l&apos;a retiré : un
                extrait vieillit, et le jour où le composant bouge il se met à mentir sans
                prévenir. Le jeton, lui, reste vrai. Ce qui fait foi ici, c&apos;est <b>la
                règle et le jeton</b> — pas le code. React, Angular ou HTML n&apos;en sont
                que des consommateurs.</p>
              </div></details>
            </div>
          </section>

          <footer className="gd-pied">
            <span>Cette page obéit aux règles qu&apos;elle raconte</span>
            <span>Toutes les règles sont dépliables ci-dessus</span>
          </footer>

        </main>
      </div>
    </div>
  );
}
