"use client";
import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import { Preview } from "../preview";
import { Bands, Band, Demo, DemoSides, DemoSide, ListRules, PanelRegistry } from "../levels";
import type { LineList, LineCode } from "../levels";
import { RailDoc, useDocSections, type Toc } from "../rail";
import { chain, tokens, aWidth, AXES, CHARTER, WIDTH_MIN, WIDTH_MAX, WEIGHT } from "../../derivation.mjs";

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
   · LA GRAISSE (05) — section à part, décision d'Auteur du 8 septembre
     2026 (d'après le relevé de la vidéo « The 80% of UI Design –
     Typography ») : une seule taille suffit (la liste au corps unique,
     cassable d'un geste), et deux fonds, deux graisses (le même paragraphe
     sur clair et sur sombre, l'écart au curseur — le nombre est à poser à
     l'œil par l'Auteur). Les trois preuves du dessus ne bougent pas.
   · LE RÉPERTOIRE (06) — une seule section, au titre de la page (8 sept.
     2026, plus de queue commune aux six pages) : les six dérives en bandes,
     les treize règles en liste avec leur colonne « où ça se vérifie », les
     tokens. Les pièces viennent d'etages.tsx ; l'assemblage est à la page.

   L'extrait prêt à coller et sa bascule HTML / React / Angular ont été
   retirés le 2 septembre : un extrait vieillit et se met à mentir dès que
   le composant bouge. Le normatif, c'est la règle et le token.

   Les styles propres à la page vivent dans typo.css. Le contenu ne perd
   rien : toutes les règles et toutes les casses restent.
   ═══════════════════════════════════════════════════════════════════════ */

/* Le registre, lu dans le moteur — jamais recopié. Le moteur est en
   JavaScript : on nomme ici la forme d'un token pour le TypeScript strict. */
type Token = { axis: string | null; base: number; bottom?: number; top?: number; css: string };
const REGISTRY = tokens(chain()) as unknown as Record<string, Token>;
const RATIO: number = CHARTER.intervalHeadings;
const SLIDE: number = AXES.type.max;
const SCREEN_MIN: number = WIDTH_MIN;
const SCREEN_MAX: number = WIDTH_MAX;

/* Un nombre en français, sans « ,0 » : une décimale pour les pixels, deux pour un rapport. */
const fr = (v: number) => String(Math.round(v * 10) / 10).replace(".", ",");
const fr2 = (v: number) => String(Math.round(v * 100) / 100).replace(".", ",");
const bounds = (name: string) => `${fr(REGISTRY[`font-size-${name}`].bottom!)}→${fr(REGISTRY[`font-size-${name}`].top!)} px`;

/* Les huit crans, du haut de l'échelle au bas : deux titres du site, six
   crans de texte. Chaque rangée de l'échelle est rendue PAR son token. */
/* Les deux titres du site glissent avec l'écran entre deux crans de la chaîne
   (intention d'auteur déclarée, 25 août) : ils se rendent par leur alias --doc-*,
   et leur fiche dit les deux crans-bornes. */
const STEPS: { name: string; record: string; token: string; bounds: string }[] = [
  { name: "cover", record: "couverture · titre du site", token: "var(--doc-cover)", bounds: `${fr(REGISTRY["font-size-section"].bottom!)}→${fr(REGISTRY["font-size-cover-max"].top!)} px · glisse avec l'écran` },
  { name: "section", record: "section · titre du site", token: "var(--doc-section)", bounds: `${fr(REGISTRY["font-size-h1"].bottom!)}→${fr(REGISTRY["font-size-section"].top!)} px · glisse avec l'écran` },
  { name: "display", record: "display", token: "var(--font-size-display)", bounds: bounds("display") },
  { name: "h1", record: "h1", token: "var(--font-size-h1)", bounds: bounds("h1") },
  { name: "h2", record: "h2", token: "var(--font-size-h2)", bounds: bounds("h2") },
  { name: "h3", record: "h3", token: "var(--font-size-h3)", bounds: bounds("h3") },
];

/* Le corps, tel que le moteur le pose : 16 × l'axe de largeur, jamais
   sous 16. Le zoom du lecteur rétrécit la fenêtre en pixels CSS puis
   agrandit tout — c'est ce que fait le navigateur, et c'est pour ça que
   le vw seul échoue (T3) : sa part d'écran ne bouge pas, le texte non plus. */
const BODY: number = REGISTRY["font-size-body"].base;
function bodyPx(widthScreen: number, zoom: number, vwSingle: boolean): number {
  if (vwSingle) return aWidth(BODY, "type", widthScreen, BODY); /* casse : tout en vw, le zoom ne mord plus */
  return aWidth(BODY, "type", widthScreen / zoom, BODY) * zoom;
}

/* La largeur réelle de l'écran, observée — les démos vivent dessus. */
function useWidthScreen(): number {
  const [l, setL] = useState(0);
  useEffect(() => {
    const read = () => setL(document.documentElement.clientWidth);
    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);
  return l;
}

const DECISIONS = { t: "Décisions du 25 août 2026, séance sur pièce", h: "#" };

const RULES: { id: string; name: string; heading: string; statement: string; why?: string; div?: string; src: { t: string; h: string }[] }[] = [
  { id: "p01", name: "principe", heading: "Le sens et la lisibilité sont deux décisions séparées",
    statement: "Le niveau d'un titre suit la structure du contenu ; sa taille suit le design. Un h2 peut légitimement être rendu plus petit qu'un h3 — aucune des deux décisions ne se prend à la place de l'autre.",
    src: [{ t: "GOV.UK — Typography", h: "https://design-system.service.gov.uk/styles/typography/" }, { t: "MDN — Heading elements", h: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements" }] },
  { id: "t1", name: "T1", heading: "Jamais de saut de niveau",
    statement: "Les niveaux de titre se suivent sans saut — un h2 n'est jamais suivi directement d'un h4.",
    why: "Un saut casse l'arbre que le lecteur d'écran parcourt : l'utilisateur conclut à du contenu manquant. Aucun bénéfice en échange.",
    src: [{ t: "WCAG 1.3.1 — techniques WAI", h: "https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html" }] },
  { id: "g1", name: "G1", heading: "Exactement un h1 par page",
    statement: "Ni deux, ni zéro : le h1 est le titre du document, pas le plus gros texte de la page.",
    why: "Le référencement lit le h1 comme le sujet de la page — l'absence coûte autant que la duplication. Déjà tenu par un garde-fou automatique.",
    src: [{ t: "MDN — Heading elements", h: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements" }] },
  { id: "t2", name: "T2", heading: "La taille glisse",
    statement: "Les tailles varient continûment entre deux bornes selon la largeur — pas de paliers de media queries. La variation vit dans le token, jamais dans un écran.",
    why: "C'est le jumeau typographique du rythme : si chaque écran redéfinissait ses corps, le système n'existerait plus. Un régime est une mise en page, jamais une échelle.",
    src: [{ t: "Smashing — Fluid Type (2023)", h: "https://www.smashingmagazine.com/2023/11/addressing-accessibility-concerns-fluid-type/" }, DECISIONS] },
  { id: "t3", name: "T3", heading: "Le zoom garde ses droits",
    statement: "Jamais de taille en unités d'écran seules (vw). Toute taille fluide porte une part rem dans ses trois parties : minimum, préférée, maximum.",
    why: "L'utilisateur zoome, la fenêtre ne bouge pas : un texte en vw seul ne grandit pas. Échec d'accessibilité silencieux — invisible en test standard, bloquant pour qui dépend du zoom.",
    src: [{ t: "WCAG 1.4.4 — Resize Text", h: "https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html" }, { t: "Roselli — Responsive Type and Zoom", h: "https://adrianroselli.com/2019/12/responsive-type-and-zoom.html" }] },
  { id: "t4", name: "T4", heading: "Un seul rapport, un seul curseur",
    statement: `Chaque cran vaut le précédent × ${fr2(RATIO)}, du petit à l'affiche et jusqu'aux titres du site. Toute l'échelle glisse d'un même facteur avec la largeur — × ${fr2(SLIDE)} entre ${SCREEN_MIN} et ${SCREEN_MAX} px — et aucun cran ne s'étire seul.`,
    why: "Un cran étiré à part casse la hiérarchie qu'il devait servir ; un glissement doux garde ses 200 % de zoom sur toutes les largeurs. Et même conforme, on teste au zoom réel, pas à la formule.",
    src: [{ t: "Smashing — Fluid Type (2023)", h: "https://www.smashingmagazine.com/2023/11/addressing-accessibility-concerns-fluid-type/" }, DECISIONS] },
  { id: "t5", name: "T5", heading: "Qui glisse se borne",
    statement: "Tout bloc de texte courant porte une largeur maximale exprimée en ch — jamais en pixels. La règle exige la borne ; la valeur exacte reste un choix du système, documenté.",
    why: "Sans borne, la taille monte en butée pendant que la ligne s'allonge : la fluidité dégrade la lecture qu'elle devait servir. Les plages publiées divergent (45–75 Bringhurst, 40–60 Material) — on cite les sources comme motif, jamais comme exigence.",
    div: "Une max-width de 65ch laisse passer plus de 65 caractères : ch mesure la chasse du « 0 », pas la moyenne. D'où la mesure au rendu plutôt que la confiance en la déclaration.",
    src: [{ t: "Butterick — Practical Typography", h: "https://practicaltypography.com/summary-of-key-rules.html" }, { t: "MDN — CSS length units", h: "https://developer.mozilla.org/en-US/docs/Web/CSS/length" }] },
  { id: "t6", name: "T6", heading: "Le texte courant respire à 1,5 minimum",
    statement: "Interlignage d'au moins 1,5 fois le corps pour le texte de lecture ; les grands corps ont le droit de serrer.",
    why: "C'est le pont promis par la fondation rythme : l'espace entre les lignes fait plus pour la lisibilité que le choix de la font.",
    src: [{ t: "WCAG 1.4.8 — Visual Presentation", h: "https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html" }, { t: "MDN — line-height", h: "https://developer.mozilla.org/en-US/docs/Web/CSS/line-height" }] },
  { id: "t7", name: "T7", heading: "Le demi-gras porte les titres, jamais le texte long",
    statement: "Aucun bloc de texte long en demi-gras ; aucune graisse plus fine que la standard sous le corps courant.",
    why: "Un paragraphe entier appuyé n'a plus d'emphase du tout ; la finesse en petit corps dégrade le contraste réel du trait, même quand la couleur passe les seuils.",
    src: [{ t: "IBM Carbon — Typography", h: "https://carbondesignsystem.com/elements/typography/overview/" }] },
  { id: "t8", name: "T8", heading: "Les capitales : brèves, espacées, jamais tapées",
    statement: "Casse haute réservée aux étiquettes courtes, avec 5 à 12 % d'interlettrage, appliquée par la feuille de style — le contenu source reste en casse normale.",
    why: "Les capitales, dessinées pour ouvrir des phrases, se serrent sans interlettrage — et la silhouette de mot disparaît sur du texte courant.",
    src: [{ t: "Butterick — Practical Typography", h: "https://practicaltypography.com/summary-of-key-rules.html" }, { t: "MDN — text-transform", h: "https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform" }] },
  { id: "t9", name: "T9", heading: "Fer à gauche, jamais justifié, centré réservé",
    statement: "Début de ligne aligné par défaut ; aucun texte d'interface justifié ; le centrage est réservé aux titres courts, jamais à un paragraphe.",
    div: "Les études empiriques sur la justification sont non concluantes. La règle tient sur WCAG 1.4.8 et sur les rivières d'espace sans césure fiable. Dit, pas caché.",
    src: [{ t: "WCAG 1.4.8 — Visual Presentation", h: "https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html" }] },
  { id: "t10", name: "T10", heading: "Jamais sous l'équivalent 16 px",
    statement: `Le texte courant ne descend jamais sous 16 px d'équivalent, en rem — les champs de saisie non plus. Le corps vaut 16 × l'axe de largeur, borné par le bas : sur l'écran le plus étroit il fait 16, jamais ${fr(BODY * AXES.type.min)}. Le petit cran (${fr(REGISTRY["font-size-small"].base)}) est une étiquette, jamais du texte courant.`,
    why: "Sous 16 px, Safari iOS zoome la page entière au focus d'un champ. Comportement de plateforme, pas décision esthétique — et un corps qui glisse sous son plancher le franchit sans que personne ne le voie.",
    src: [{ t: "CSS-Tricks — 16px form zoom", h: "https://css-tricks.com/16px-or-larger-text-prevents-ios-form-zoom/" }, { t: "MDN — font-size", h: "https://developer.mozilla.org/en-US/docs/Web/CSS/font-size" }, DECISIONS] },
  { id: "t11", name: "T11", heading: "La font déclarée est la font livrée",
    statement: "Toute font déclarée est appariée à un fichier versé au dépôt, au nom strictement identique, avec sa pile de secours. Aucun nom orphelin.",
    why: "Un nom qui ne correspond pas ne produit aucune erreur : il produit un produit entier en font système — et rien, nulle part, ne le signale.",
    div: "Les fonts de ce kit sont livrées avec lui : Geist, et JetBrains Mono pour le code.",
    src: [{ t: "Règle interne du système", h: "#" }] },
  { id: "t12", name: "T12", heading: "Le calage se déclare, il ne se tape pas",
    statement: "Le haut d'un texte se cale sur la hauteur de ses capitales, son bas sur sa ligne de base, et cela se déclare. Aucune marge négative, aucun décalage vertical posé à l'œil pour rattraper l'air d'une ligne.",
    why: "Le navigateur ajoute la moitié de l'interligne au-dessus et au-dessous de chaque ligne, et la font réserve déjà de la place pour les accents et les jambages. Un texte est donc centré au calcul et décentré à l'œil : la même valeur d'espace, posée des quatre côtés, n'en paraît jamais une.",
    div: "Aucune source ne dit à partir de quel écart le décalage devient une faute, et aucun grand système n'a tranché. Ce qui se vérifie ici n'est donc pas un montant : c'est la provenance du calage.",
    src: [{ t: "CSS Inline Layout 3 — text-box-trim", h: "https://drafts.csswg.org/css-inline-3/#text-box-trim" }, { t: "MDN — text-box-trim", h: "https://developer.mozilla.org/en-US/docs/Web/CSS/text-box-trim" }, { t: "Chrome — CSS text-box-trim", h: "https://developer.chrome.com/blog/css-text-box-trim" }] },
  { id: "t13", name: "T13", heading: "Une seule taille peut porter une hiérarchie",
    statement: "Dans une liste, une carte, une ligne d'interface, le corps peut rester unique : la hiérarchie se fait par la graisse et par l'encre — jamais par la graisse seule, jamais par l'encre seule. On ne monte le corps qu'après avoir épuisé ces deux leviers.",
    why: "Chaque taille ajoutée est un cran de plus à tenir, et une interface dense n'en supporte pas six. La graisse et l'encre séparent sans agrandir — et la taille reste disponible pour ce qui doit vraiment dominer.",
    src: [{ t: "Sajid — The 80% of UI Design : Typography (2024)", h: "https://www.youtube.com/watch?v=9-oefwZ6Z74" }, { t: "IBM Carbon — Typography", h: "https://carbondesignsystem.com/elements/typography/overview/" }, { t: "Décision d'Auteur du 8 septembre 2026", h: "#" }] },
  { id: "t14", name: "T14", heading: "Deux fonds, deux graisses",
    statement: `Chaque token de graisse résout une valeur en clair et une en sombre, et la sombre n'est jamais plus lourde que la claire. Aujourd'hui l'écart vaut ${WEIGHT.gapDark} pour tous les rôles : c'est une valeur de départ, à poser à l'œil.`,
    why: "Le blanc sur noir rayonne dans l'œil : à graisse égale, il paraît plus gros et plus serré que le noir sur blanc. À l'impression c'est l'inverse — l'encre bave et le blanc s'amincit. Cette règle est écrite pour l'écran.",
    div: "Aucune source ne chiffre l'écart : seule la direction est publiée. Le nombre est un arbitrage d'Auteur, et il est dit comme tel — sur cette page, au curseur.",
    src: [{ t: "Google Fonts Knowledge — Glossaire", h: "https://fonts.google.com/knowledge/glossary" }, { t: "Décision d'Auteur du 8 septembre 2026", h: "#" }] },
];

function Rules({ ids }: { ids: string[] }) {
  return (
    <div style={{ display: "grid", gap: "var(--gap-1-block)" }}>
      {ids.map((id) => RULES.find((r) => r.id === id)!).map((r) => (
        <div key={r.id} style={{ display: "grid", gap: "var(--gap-3-block)", maxWidth: "var(--measure)" }}>
          <b style={{ color: "var(--text-primary)" }}><span className="badge">{r.name}</span> {r.heading}</b>
          <span>{r.statement}</span>
          {r.why && <span className="muted">{r.why}</span>}
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
const TEXT_MEASURE =
  "L'œil ne lit pas des lettres : il saute de groupe en groupe, et chaque " +
  "saut se paie au retour à la ligne. Trop longue, la ligne le perd — il " +
  "relit la même phrase ; trop courte, elle l'essouffle. La bonne mesure " +
  "rend ce prix invisible, et personne ne la remarque : c'est toute sa gloire.";

type KeyInstance = "short" | "right" | "sans";

/* Le verdict n'est PAS décidé par le bouton : il est lu sur la ligne
   réellement rendue, à la largeur réelle du cadre (verdict d'Auteur,
   2 septembre — « en responsive ça n'est pas une erreur sur mobile »).
   Sur un cadre étroit, l'absence de borne ne produit aucune faute : c'est
   l'écran qui borne la ligne. Dire « erreur » là serait mentir, et la page
   qui documente l'honnêteté ne peut pas se le permettre. */
function LineMeasured({ instance, maxW }: { instance: KeyInstance; maxW?: string }) {
  const [n, setN] = useState(0);
  const [boundInside, setBoundInside] = useState(true);
  const [crossed, setCrossed] = useState(false);
  const [constrained, setConstrained] = useState(true);
  const [p, setP] = useState<HTMLParagraphElement | null>(null);
  const [z, setZ] = useState<HTMLSpanElement | null>(null);
  const [track, setTrack] = useState<HTMLDivElement | null>(null);
  const [bound, setBound] = useState<HTMLSpanElement | null>(null);
  useEffect(() => {
    if (!p || !z || !track || !bound) return;
    const read = () => {
      const wide = p.getBoundingClientRect().width;
      const upto = bound.getBoundingClientRect().width;
      const ch = z.getBoundingClientRect().width / 20;
      if (ch > 0) setN(Math.round(wide / ch));
      /* Le trait et le verdict lisent la MÊME chose : la largeur du bloc de
         texte comparée à celle de la borne. Un seuil en nombre de caractères
         les faisait diverger — la ligne franchissait le trait pendant que le
         badge disait encore que tout allait bien (verdict d'Auteur,
         2 septembre). Le compte de caractères reste affiché, mais il ne juge
         plus : ch mesure la chasse du « 0 », pas la moyenne (divergence T5). */
      const frame = track.getBoundingClientRect().width;
      setBoundInside(upto < frame - 1);
      setCrossed(wide > upto + 1);
      /* La largeur choisie mord-elle vraiment ? Sur un cadre étroit, une
         borne plus large que le cadre ne décide plus rien : c'est l'écran
         qui coupe la ligne. Dire « trop court » là serait le même mensonge
         que « sans borne » sur mobile. */
      setConstrained(wide < frame - 1);
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(p); ro.observe(track);
    return () => ro.disconnect();
  }, [p, z, track, bound]);

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
  const screen = { state: "", muted: false, verdict: "L’écran suffit" };
  const says = instance === "short"
    ? (constrained ? { state: "ko", muted: true, verdict: "Trop court" } : screen)
    : instance === "right"
      ? (boundInside ? { state: "good", muted: false, verdict: "Juste" } : screen)
      : (crossed ? { state: "ko", muted: true, verdict: "Trop long" } : screen);

  return (
    <div className={`gd-measure ${says.muted ? "mute" : ""}`}>
      <span className="gd-measure-says">
        <span className={`badge ${says.state}`}>{says.verdict}</span>
        <span className="mono muted">≈ {n} caractères par ligne</span>
      </span>
      {/* La borne du registre, rendue visible. Sans ce trait, « juste » et
          « sans borne » se ressemblent dès que le cadre est étroit : l'écart
          de largeur est trop petit pour se voir. Le trait transforme cet
          écart en FRANCHISSEMENT — et un franchissement, ça se voit. Quand
          la borne tombe hors du cadre, le trait s'efface : il n'a plus rien
          à dire, et il mentirait collé au bord. */}
      <div className="gd-measure-track" ref={setTrack}>
        <span ref={setBound} className={`gd-measure-bound ${boundInside ? "" : "off"}`} aria-hidden="true">
          <b>la borne</b>
        </span>
        <p ref={setP} style={{ maxWidth: maxW, width: maxW ? undefined : "100%" }}>
          <span ref={setZ} aria-hidden style={{ position: "absolute", visibility: "hidden", whiteSpace: "pre" }}>00000000000000000000</span>
          {TEXT_MEASURE}
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
const INSTANCE = [
  { key: "short", name: "Trop court", maxW: "28ch" },
  { key: "right", name: "Juste", maxW: "var(--measure)" },
  { key: "sans", name: "Sans borne", maxW: undefined },
] as const;
/* hors chaîne : la largeur maximale du cadre de cette démonstration — une
   mesure d'écran simulé, pas une distance du kit */
const FRAME_MEASURE = 1100;

function MeasureInFrame() {
  const [key, setKey] = useState<KeyInstance>("right");
  const instance = INSTANCE.find((c) => c.key === key)!;
  return (
    <Preview
      ceiling={FRAME_MEASURE}
      background="plain"
      tools={<>
        <span className="mono muted">La largeur du texte :</span>
        {INSTANCE.map((c) => (
          <button key={c.key} className={`button ${key === c.key ? "on" : ""}`}
            aria-pressed={key === c.key} onClick={() => setKey(c.key)}>{c.name}</button>
        ))}
      </>}
      children={() => <LineMeasured key={instance.key} instance={instance.key} maxW={instance.maxW} />}
      foot={<span className="gd-caption">Le pointillé est la borne :
        la faute n&apos;apparaît qu&apos;en s&apos;élargissant.</span>}
    />
  );
}

/* ── RÉPERTOIRE — l'arbre des titres, compact. En encre ; le rouge à la
   faute. Un niveau = une marge de card, par imbrication : jamais un
   multiplicateur. ── */
function Indent({ levels, children }: { levels: number; children: ReactNode }) {
  let n: ReactNode = children;
  for (let i = 0; i < levels; i++) n = <div className="gd-tree-level">{n}</div>;
  return <>{n}</>;
}

function Tree({ jump }: { jump: boolean }) {
  const ranks: [string, number, boolean][] = jump
    ? [["h1 · Le dossier", 0, false], ["h2 · Première partie", 1, false], ["h4 · Un détail", 3, true], ["h2 · Deuxième partie", 1, false]]
    : [["h1 · Le dossier", 0, false], ["h2 · Première partie", 1, false], ["h3 · Sous-partie", 2, false], ["h2 · Deuxième partie", 1, false]];
  return (
    <div className="gd-tree">
      {jump && (
        <Indent levels={2}>
          <div className="gd-tree-note">h3 manquant — le lecteur d&apos;écran conclut à du contenu disparu</div>
        </Indent>
      )}
      {ranks.map(([txt, depth, ko]) => (
        <Indent key={txt} levels={depth}>
          <div className={`gd-tree-rank ${ko ? "ko" : ""}`}>{txt}</div>
        </Indent>
      ))}
    </div>
  );
}

/* ── Étage « en liste » — ce qu'aucune image ne prouve. Chaque ligne dit
   où elle se vérifie : dans le code, sur l'écran allumé, ou nulle part. ── */
const LIST: LineList[] = [
  { name: "Le sens et la lisibilité sont deux décisions séparées",
    says: "Le niveau d'un titre suit la structure du contenu ; sa taille suit le design. Un h2 rendu plus petit qu'un h3 est légitime — aucune des deux décisions ne se prend à la place de l'autre.",
    or: "nulle part — décision d'Auteur", tone: "author" },
  { name: "Exactement un h1 par page",
    says: "Ni deux, ni zéro : le h1 est le titre du document, pas le plus gros texte de la page. L'absence coûte autant que la duplication.",
    or: "dans le code" },
  { name: "La font déclarée est la font livrée",
    says: "Toute font déclarée est appariée à un fichier versé au dépôt, au nom strictement identique, avec sa pile de secours. Un nom orphelin ne produit aucune erreur : juste un produit entier en font système.",
    or: "dans le code" },
  { name: "La taille glisse, jamais par paliers",
    says: "Les tailles varient continûment entre deux bornes selon la largeur, et la variation vit dans la définition du token. Aucun écran ne redéfinit un corps.",
    or: "dans le code" },
  { name: "Un seul rapport, un seul curseur",
    says: "Chaque cran vaut le précédent multiplié par le même intervalle, et toute l'échelle glisse d'un même facteur avec la largeur. Aucun cran ne s'étire tout seul.",
    or: "dans le code" },
  { name: "Qui glisse se borne",
    says: "Tout bloc de texte courant porte une largeur maximale exprimée en ch, jamais en pixels. La règle exige la borne ; la valeur exacte reste un choix du système, documenté.",
    or: "dans le code" },
  { name: "Le texte courant respire à 1,5 minimum",
    says: "Interlignage d'au moins une fois et demie le corps pour le texte de lecture ; les grands corps, eux, ont le droit de serrer.",
    or: "sur l'écran allumé", tone: "render" },
  { name: "Le centrage reste aux titres courts",
    says: "Début de ligne aligné par défaut, aucun texte d'interface justifié, et le centrage réservé aux titres brefs — jamais un paragraphe.",
    or: "sur l'écran allumé", tone: "render" },
  { name: "L'ancienne façon d'écrire le calage est refusée",
    says: "Les anciens noms de la propriété ne déclenchent aucune erreur : ils ne font rien, en silence. Et c'est l'éditeur de maquettes qui les produit encore — le copier-coller depuis la maquette est le chemin par lequel la faute entre.",
    or: "dans le code" },
  { name: "On rogne par rôle, jamais par composant",
    says: "Un rôle de texte est calé partout ou nulle part. Deux titres de même rôle, l'un calé l'autre non, c'est deux systèmes d'espacement dans le même écran — et plus aucun moyen de dire lequel fait foi.",
    or: "dans le code" },
  { name: "Une seule taille peut porter une hiérarchie",
    says: "Le corps peut rester unique dans une liste ou une carte : la graisse et l'encre séparent les éléments sans les agrandir. On ne monte le corps qu'après avoir épuisé ces deux leviers.",
    or: "sur l'écran allumé", tone: "render" },
  { name: "Deux fonds, deux graisses",
    says: "Chaque token de graisse porte une valeur en clair et une en sombre, et la sombre n'est jamais plus lourde. L'écart est le même pour tous les rôles ; il se lit dans le fichier des tokens.",
    or: "dans le code" },
  { name: "La pile de secours est calée sur la font livrée",
    says: "Tant que la font n'est pas arrivée, le texte se peint dans la police système. Si ses mesures diffèrent, tout saute à la bascule — et le calage se recalcule sur les mauvaises.",
    or: "dans le code" },
];

/* ── Étage « dans le code » — les tailles sont LUES dans le registre
   calculé, jamais recopiées : si l'échelle bouge, ce tableau bouge. ── */
const CODE: LineCode[] = [
  { rule: "Le corps courant",
    written: <><span className="cs-kw">font-size</span>: <span className="cs-var">var(--font-size-body)</span></>,
    product: bounds("body"), note: "seize pixels sur l'écran le plus étroit — le plancher ne se franchit jamais" },
  { rule: "L'air entre les lignes",
    written: <><span className="cs-kw">line-height</span>: <span className="cs-var">var(--leading-body)</span></>,
    product: "l'air du texte courant", note: "au moins une fois et demie le corps" },
  { rule: "La largeur d'un bloc de texte",
    written: <><span className="cs-kw">max-width</span>: <span className="cs-var">var(--measure)</span></>,
    product: "la ligne se borne", note: "en ch, jamais en pixels" },
  { rule: "Un titre de niveau 2",
    written: <><span className="cs-kw">font-size</span>: <span className="cs-var">var(--font-size-h2)</span></>,
    product: bounds("h2"), note: "le cran précédent × l'intervalle, avec du rem dans chaque borne" },
  { rule: "L'affiche", fallback: true,
    written: <><span className="cs-kw">font-size</span>: <span className="cs-var">var(--font-size-display)</span></>,
    product: bounds("display"), note: "le haut de l'échelle du texte" },
  { rule: "L'étiquette", fallback: true,
    written: <><span className="cs-kw">font-size</span>: <span className="cs-var">var(--font-size-small)</span></>,
    product: bounds("small"), note: "une étiquette, jamais du texte courant" },
  { rule: "Les capitales", fallback: true,
    written: <><span className="cs-kw">text-transform</span>: <span className="cs-var">uppercase</span></>,
    product: "posées par le style", note: "le texte source garde sa casse — les lecteurs d'écran lisent l'original" },
  { rule: "L'interlettrage de l'étiquette", fallback: true,
    written: <><span className="cs-kw">letter-spacing</span>: <span className="cs-var">var(--tracking-label)</span></>,
    product: "les capitales respirent", note: "sans lui, la casse haute se serre et le mot perd sa silhouette" },
  { rule: "La graisse du titre", fallback: true,
    written: <><span className="cs-kw">font-weight</span>: <span className="cs-var">var(--weight-heading)</span></>,
    product: `${WEIGHT.roles.heading} en clair · ${WEIGHT.dark("heading")} en sombre`, note: "réservée aux titres — un paragraphe entier appuyé n'appuie plus rien" },
  { rule: "La graisse du courant", fallback: true,
    written: <><span className="cs-kw">font-weight</span>: <span className="cs-var">var(--weight-body)</span></>,
    product: `${WEIGHT.roles.body} en clair · ${WEIGHT.dark("body")} en sombre`, note: "le même écart pour chaque rôle — le blanc sur noir paraît plus gros" },
  { rule: "La font qui lit", fallback: true,
    written: <><span className="cs-kw">font-family</span>: <span className="cs-var">var(--font-sans)</span></>,
    product: "Geist, livrée avec le kit", note: "le nom déclaré correspond à un fichier versé au dépôt" },
  { rule: "L'air des titres", fallback: true,
    written: <><span className="cs-kw">line-height</span>: <span className="cs-var">var(--leading-heading)</span></>,
    product: "les grands corps serrent", note: "la règle de 1,5 protège la lecture longue, pas une affiche" },
];

const TOC: Toc = [
  ["fonts", "01", "Les fonts"],
  ["range", "02", "L'échelle"],
  ["measure", "03", "La mesure"],
  ["gazette", "04", "La gazette"],
  ["weight", "05", "La graisse"],
  ["registry", "06", "Le registre"],
];

/* ── LE CALAGE — la même valeur d'espace, des quatre côtés ──────────────
   Au repos, le texte est calé sur ses capitales et sur sa ligne de base :
   la valeur écrite est celle qu'on voit. Cassée, la carte laisse revenir
   l'air de la ligne, et le haut cesse d'être égal aux côtés.
   Le nombre affiché est MESURÉ sur la page rendue, jamais déclaré : un
   témoin de la hauteur des capitales, posé sur la ligne de base, donne le
   haut des lettres à même la font livrée. */
function CardAligned({ broken }: { broken: boolean }) {
  const card = useRef<HTMLDivElement>(null);
  const capital = useRef<HTMLSpanElement>(null);
  const [top, setTop] = useState(0);
  const [side, setSide] = useState(0);
  const [onCard, setOnCard] = useState(true);

  useEffect(() => {
    setOnCard(typeof CSS !== "undefined" && CSS.supports("text-box-trim", "trim-both"));
  }, []);

  useEffect(() => {
    const measureIt = () => {
      const c = card.current, k = capital.current;
      if (!c || !k) return;
      setTop(k.getBoundingClientRect().top - c.getBoundingClientRect().top);
      /* le côté se mesure comme le haut : depuis le bord extérieur de la
         carte, trait du cadre compris — sinon on compare deux choses qui
         ne partent pas du même endroit. */
      const st = getComputedStyle(c);
      setSide(parseFloat(st.paddingLeft) + parseFloat(st.borderLeftWidth));
    };
    measureIt();
    /* la font livrée arrive après la première peinture : on remesure quand elle est là */
    if (typeof document !== "undefined" && document.fonts) void document.fonts.ready.then(measureIt);
    window.addEventListener("resize", measureIt);
    return () => window.removeEventListener("resize", measureIt);
  }, [broken]);

  return (
    <div className="tp-scene">
      <div ref={card} className={`tp-alignment ${broken ? "broken" : ""}`}
        data-intent={broken ? "statement" : undefined}>
        <p>
          <span ref={capital} className="tp-witness" aria-hidden="true" />
          Coursue — départs du soir
        </p>
      </div>
      {!onCard
        ? <span className="badge">votre navigateur ne sait pas encore caler le texte — la démo ne peut rien montrer ici</span>
        : broken
          ? <span className="badge ko">le haut mesure {fr(top)} px là où les côtés en font {fr(side)} — la valeur écrite n&apos;est plus celle qu&apos;on voit</span>
          : <span className="mono muted">haut {fr(top)} px · côtés {fr(side)} px — une seule valeur, des quatre côtés</span>}
    </div>
  );
}

/* ── 05 · LA GRAISSE — section à part (décision d'Auteur, 8 septembre 2026).
   Deux objets. La LISTE AU CORPS UNIQUE : nom, sous-titre, bouton, tout au
   même corps ; la hiérarchie tient par la graisse et l'encre, et « égaliser »
   la fait tomber sous les yeux. Les graisses sont LUES dans le moteur
   (GRAISSE), jamais recopiées. Puis DEUX FONDS, DEUX GRAISSES : le même
   paragraphe sur clair et sur sombre ; le versant sombre est un vrai thème
   sombre (data-theme), et son token de graisse est allégé de l'écart du
   registre — le curseur le fait varier pour que l'Auteur pose le nombre à
   l'œil. « La même graisse » est la casse : le blanc sur noir pèse plus. ── */
const SUBS = [
  { name: "L'atelier du samedi", sub: "3 nouvelles vidéos · cette semaine", tracking: true },
  { name: "Cartes & boussoles", sub: "en direct dans 2 h", tracking: false },
  { name: "Le marbre", sub: "dernière vidéo il y a 5 jours", tracking: false },
];

function ListBodyUnique({ equal }: { equal: boolean }) {
  return (
    <div className={`tp-subs ${equal ? "equal" : ""}`} data-intent={equal ? "statement" : undefined}>
      {SUBS.map((a, i) => (
        <div className="tp-sub" key={a.name}>
          <span className={`tp-sub-avatar a${i + 1}`} aria-hidden="true" />
          <div className="tp-sub-who">
            <span className="tp-sub-name">{a.name}</span>
            <span className="tp-sub-sub">{a.sub}</span>
          </div>
          {/* un bouton dessiné, pas réel : la liste est un spécimen, elle n'abonne personne */}
          <span className={`tp-sub-button ${a.tracking ? "tracking" : ""}`} aria-hidden="true">{a.tracking ? "Abonné" : "S'abonner"}</span>
        </div>
      ))}
    </div>
  );
}

const TEXT_BACKGROUNDS =
  "Le même paragraphe, la même font, le même corps. Seul le fond change — et " +
  "avec lui le poids que l'œil donne aux lettres. Le blanc sur noir rayonne : " +
  "il paraît plus gros, plus serré, et la ligne semble appuyer. Le kit " +
  "l'allège d'un écart, le même pour chaque rôle.";

/* hors chaîne : la course du curseur — jusqu'où l'Auteur peut allonger l'écart pour juger, par pas de 10 sur l'axe de la font */
const GAP_MAX = 120;
const GAP_INCREMENT = 10;

function TwoBackgrounds({ identical, gap, onGap }: { identical: boolean; gap: number; onGap: (v: number) => void }) {
  const light = WEIGHT.roles.body;
  const dark = identical ? light : light - gap;
  return (
    <div className="tp-backgrounds-scene">
      <div className="tp-backgrounds">
        {/* le versant clair est un VRAI thème clair, même quand la page est en sombre : deux fonds, pas un fond et la page */}
        <div className="tp-background light" data-theme="light">
          <p>{TEXT_BACKGROUNDS}</p>
          <span className="mono muted">fond clair · {light}</span>
        </div>
        {/* le versant sombre est un VRAI thème sombre : ses encres, son fond, et son token de graisse.
            Le curseur ne repeint que ce token, ici — le registre, lui, garde son écart. */}
        <div className="tp-background black" data-theme="dark" data-intent={identical ? "statement" : undefined}
          style={{ ["--weight-body" as string]: dark } as CSSProperties}>
          <p>{TEXT_BACKGROUNDS}</p>
          {identical
            ? <span className="badge ko">fond sombre · {dark} — même poids qu&apos;en clair, il pèse plus</span>
            : <span className="mono muted">fond sombre · {dark} ({light} − {gap})</span>}
        </div>
      </div>
      <div className="tp-wheel">
        <label htmlFor="tp-gap">Compensation sombre</label>
        <input type="range" id="tp-gap" min={0} max={GAP_MAX} step={GAP_INCREMENT} value={gap}
          disabled={identical} onChange={(e) => onGap(+e.target.value)} />
        <output htmlFor="tp-gap" className="mono">−{identical ? 0 : gap}{gap === WEIGHT.gapDark && !identical ? " · registre" : ""}</output>
      </div>
    </div>
  );
}

export default function View() {
  /* preuves */
  const [badName, setBadName] = useState(false);
  const [justif, setJustif] = useState(false);
  const [tight, setTight] = useState(false);
  /* répertoire */
  const [zoom, setZoom] = useState(2); /* le zoom est ALLUMÉ d'entrée : la démo montre ce qui doit tenir sous zoom, pas l'état de repos (verdict d'Auteur, 31 août) */
  /* l'action du cadre REJOUE le zoom : les deux côtés repartent de ×1 au même instant, puis passent à ×2 */
  const replayZoom = () => { setZoom(1); requestAnimationFrame(() => requestAnimationFrame(() => setZoom(2))); };
  /* la graisse (05) */
  const [equal, setEqual] = useState(false);
  const [identical, setIdentical] = useState(false);
  const [gap, setGap] = useState<number>(WEIGHT.gapDark);
  const activeId = useDocSections("fonts");
  const widthScreen = useWidthScreen();
  const body = widthScreen > 0 ? bodyPx(widthScreen, zoom, false) : BODY;
  const bodyVw = widthScreen > 0 ? bodyPx(widthScreen, zoom, true) : BODY; /* casse : tout en vw, le zoom ne mord plus */

  return (
    <div className="gdoc-background">
      <div className="gdoc">
        <RailDoc page="typo" heading="Fondation · Typographie" toc={TOC} activeId={activeId} foot="Geist · JetBrains Mono — livrées avec le kit" />

        <main className="gdoc-content" id="content">

          <section className="gdoc-hero">
            <p className="kicker">La typographie</p>
            <h1>Vous êtes en train de lire la démonstration<span className="point" aria-hidden="true" /></h1>
            <p className="lede">
              Personne ne remarque une bonne typographie — c&apos;est même à ça qu&apos;on
              la reconnaît. Le corps, la ligne, l&apos;air, les capitales : tout ça
              travaille pendant que vous lisez, et vous n&apos;y pensez pas une seconde.
              <b>Cette page fait le contraire : elle montre le travail.</b>
            </p>
          </section>

          {/* ═══ PREUVE 1 · VOCABULAIRE — les fonts ═══ */}
          <section className="gdoc-sec set" id="fonts">
            <div className="gdoc-sec-head">
              <p className="kicker">01 · Les fonts</p>
              <h2>Deux fonts suffisent</h2>
              <p className="muted">Chaque font qu&apos;on ajoute est une décision de plus à tenir pendant
              des années, et personne n&apos;a jamais remercié un produit d&apos;en avoir six.
              Le kit en garde deux : une qui lit, une qui chiffre. Le titre, le texte
              courant, l&apos;étiquette, le code — chacun a son réglage, décidé une fois.
              Une font déclarée sous un nom qui n&apos;existe pas ne lève aucune erreur :
              le produit entier passe en font système, en silence.</p>
            </div>
            <div className="gdoc-body">
              <div className="rank">
                <button className={`button broken ${badName ? "on" : ""}`} onClick={() => setBadName(!badName)}>
                  {badName ? "Réparer le nom" : "Casser : déclarer « Geist Text »"}
                </button>
                {badName && (
                  <span className="badge ko">nom orphelin — font système, en silence</span>
                )}
              </div>
              <figure className="gd-figure" style={{ width: "100%" }}>
                {/* casse : « Geist Text » n'existe pas — la pile de secours prend la main, en silence */}
                <div className="gd-voice" data-intent={badName ? "statement" : undefined} style={badName ? { fontFamily: '"Geist Text", ui-sans-serif, system-ui, sans-serif' } : undefined}>
                  <div className="gd-vblock primary">
                    <span className="gd-vglyph" aria-hidden="true">Aa</span>
                    <div className="gd-vwho"><b>Geist</b><span>400 · 500 · 600</span></div>
                  </div>
                  <div className="gd-vblock dark">
                    <span className="gd-vglyph" aria-hidden="true">01</span>
                    <div className="gd-vwho"><b>JetBrains Mono</b><span>400 · 600</span></div>
                  </div>
                </div>
                <figcaption className="gd-caption">
                  une font qui lit, une font qui chiffre — livrées avec le kit, au nom près
                </figcaption>
              </figure>
              <div className="gd-costumes" data-intent={badName ? "statement" : undefined} style={badName ? { fontFamily: '"Geist Text", ui-sans-serif, system-ui, sans-serif' } : undefined}>
                <div className="gd-costume">
                  <span className="role">Le titre</span>
                  <span className="spec heading">Il porte la page, brièvement</span>
                  <span className="record">Geist 600 · -0,02em</span>
                </div>
                <div className="gd-costume">
                  <span className="role">Le courant</span>
                  <span className="spec">Il se lit longtemps sans se faire remarquer</span>
                  <span className="record">Geist 400 · 1,6</span>
                </div>
                <div className="gd-costume">
                  <span className="role">L&apos;étiquette</span>
                  <span className="spec label">Brève, espacée, jamais tapée</span>
                  <span className="record">Geist 500 · +0,08em</span>
                </div>
                <div className="gd-costume">
                  <span className="role">Le code</span>
                  <span className="spec code">chaque_chiffre = même_largeur;</span>
                  <span className="record">Mono 400 · tabular</span>
                </div>
              </div>
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <Rules ids={["t11", "t7"]} />
              </div></details>
            </div>
          </section>

          {/* ═══ RÉPERTOIRE — l'échelle : les huit crans du registre, en vrai ═══
              Chaque rangée est rendue PAR son token ; les bornes en légende
              sont calculées par le moteur, jamais recopiées. Huit crans : six
              pour le texte, deux pour les titres du site — des h5/h6 récurrents
              signalent une structure à réorganiser, pas un cran à ajouter. */}
          <section className="gdoc-sec set" id="range">
            <div className="gdoc-sec-head">
              <p className="kicker">02 · L&apos;échelle</p>
              <h2>Chaque taille vaut la précédente, un peu plus grande</h2>
              <p className="muted">Tout ce que vous lisez ici sort de huit crans et d&apos;un seul
              rapport : chaque cran vaut le précédent, un peu plus grand, toujours du même
              pas. Six servent le texte, du petit à l&apos;affiche ; les deux derniers sont
              les titres du site. Un seul curseur les fait glisser ensemble avec la largeur
              de l&apos;écran, et le corps ne descend jamais sous son plancher. L&apos;échelle
              s&apos;arrête là : le jour où il vous faut un neuvième cran, c&apos;est la
              structure qu&apos;il faut revoir, pas l&apos;échelle qu&apos;il faut rallonger.</p>
            </div>
            <div className="gdoc-body">
              <figure className="gd-figure" style={{ width: "100%", justifyItems: "start" }}>
                <div className="gd-range">
                  {STEPS.map(({ name, record, token, bounds: b }) => (
                    <div key={name} className="gd-gstep">
                      <span className="record">{record} · {b}</span>
                      <span className="spec" style={{ fontSize: token }}>Aucune taille n&apos;est posée à l&apos;œil.</span>
                    </div>
                  ))}
                  <div className="gd-gstep">
                    <span className="record">corps · {bounds("body")} · 1,6</span>
                    <span className="spec current" style={{ fontSize: "var(--font-size-body)" }}>Le corps porte
                    le poids quotidien du système : notes, lecture longue, champs de
                    saisie. Posé à seize pixels au plus bas avec un interlignage détendu,
                    il reste discret, lisible et reconnaissable.</span>
                  </div>
                  <div className="gd-gstep">
                    <span className="record">petit · {bounds("small")} · étiquette seulement</span>
                    <span className="spec label" style={{ fontSize: "var(--font-size-small)" }}>Jamais du texte courant — une étiquette, brève et espacée.</span>
                  </div>
                </div>
                {/* Une légende tient en UNE ligne : personne ne lit six clauses en
                    petit corps (verdict d'Auteur, 2 septembre). Le détail descend
                    dans le dépliant, qui est fait pour ça. */}
                <figcaption className="gd-caption" style={{ textAlign: "left" }}>
                  chaque cran vaut le précédent × {fr2(RATIO)} — et toute l&apos;échelle glisse avec l&apos;écran
                </figcaption>
              </figure>
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <p>Les bornes affichées sont <b>calculées</b>, jamais recopiées : le bas à
                {" "}{SCREEN_MIN} px d&apos;écran, le haut à {SCREEN_MAX}. Entre les deux, toute
                l&apos;échelle glisse d&apos;un même facteur — × {fr2(SLIDE)} — et chaque
                borne porte du rem, pour que le zoom du lecteur garde la main. Les deux titres
                du site, eux, glissent entre deux crans de la chaîne : c&apos;est une intention
                d&apos;auteur, déclarée. Les titres se serrent à 1,2 ; le corps respire à 1,6.</p>
                <Rules ids={["t2", "t4"]} />
              </div></details>
            </div>
          </section>

          {/* ═══ PREUVE 2 · VARIATION — la mesure ═══ */}
          <section className="gdoc-sec set" id="measure">
            <div className="gdoc-sec-head">
              <p className="kicker">03 · La mesure</p>
              <h2>Avant la taille, c&apos;est la largeur qui décide</h2>
              <p className="muted">Même texte, même corps, même interligne : seule la largeur change. Une seule des trois se lit sans effort — les
              deux autres fatiguent en quelques lignes. Et le compteur ne fait pas
              confiance à la déclaration : il mesure la ligne réelle, dans le cadre rendu.</p>
            </div>
            <div className="gdoc-body">
              <MeasureInFrame />
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <Rules ids={["t5", "t6"]} />
              </div></details>
            </div>
          </section>

          {/* ═══ PREUVE 3 · OBJET EN SITUATION — la gazette ═══ */}
          <section className="gdoc-sec set" id="gazette">
            <div className="gdoc-sec-head">
              <p className="kicker">04 · La gazette</p>
              <h2>Personne n&apos;a réglé un seul titre à la main</h2>
              <p className="muted">Un spécimen de font, tout le monde peut en faire un joli. Le vrai
              test, c&apos;est un objet réel qui tient debout sans qu&apos;on aille régler
              chaque titre à la main. Cette gazette est composée par les règles, et rien
              d&apos;autre. Une règle cassée, et la page ment aussitôt.</p>
            </div>
            <div className="gdoc-body">
              <div className="rank">
                <button className={`button broken ${justif ? "on" : ""}`} onClick={() => { setJustif(!justif); if (!justif) setTight(false); }}>
                  {justif ? "Réparer le fer" : "Casser : justifier"}
                </button>
                <button className={`button broken ${tight ? "on" : ""}`} onClick={() => { setTight(!tight); if (!tight) setJustif(false); }}>
                  {tight ? "Rendre l'air" : "Casser : étouffer l'interligne"}
                </button>
                {(justif || tight) && (
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
                <div className="bench dark">
                  <div className={`gazette ${justif ? "j-broken" : ""} ${tight ? "i-broken" : ""}`} data-intent={justif || tight ? "statement" : undefined}>
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
                <figcaption className="gd-caption">
                  fer à gauche · corps ≥ 16 px · interligne 1,6 ·
                  mesure bornée en ch · capitales espacées, jamais tapées
                </figcaption>
              </figure>
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <Rules ids={["t9", "t8", "t10"]} />
              </div></details>
            </div>
          </section>

          {/* ═══ 05 · LA GRAISSE — section à part (décision d'Auteur, 8 septembre 2026) ═══ */}
          <section className="gdoc-sec set" id="weight">
            <div className="gdoc-sec-head">
              <p className="kicker">05 · La graisse</p>
              <h2>La taille ne fait pas la hiérarchie</h2>
              <p className="muted">Même corps. Trois poids, deux encres.</p>
            </div>
            <div className="gdoc-body">
              <div className="rank">
                <button className={`button broken ${equal ? "on" : ""}`} onClick={() => setEqual(!equal)}>
                  {equal ? "Rendre les poids" : "Égaliser les poids"}
                </button>
                {equal && <span className="badge ko">même poids, même encre — plus rien ne se distingue</span>}
              </div>
              <figure className="gd-figure" style={{ width: "100%" }}>
                <ListBodyUnique equal={equal} />
                <figcaption className="gd-caption">
                  un seul corps · nom {WEIGHT.roles.heading} · sous-titre {WEIGHT.roles.body}, encre seconde · bouton {WEIGHT.roles.label}
                </figcaption>
              </figure>

              <h3 className="tp-sub-heading">Le blanc sur noir pèse plus</h3>
              <p className="muted" style={{ maxWidth: "var(--measure)" }}>Même paragraphe, même corps. En sombre,
              chaque poids est allégé du même écart.</p>
              <div className="rank">
                <button className={`button broken ${identical ? "on" : ""}`} onClick={() => setIdentical(!identical)}>
                  {identical ? "Rendre la compensation" : "Même poids sur les deux fonds"}
                </button>
              </div>
              <figure className="gd-figure" style={{ width: "100%" }}>
                <TwoBackgrounds identical={identical} gap={gap} onGap={setGap} />
                <figcaption className="gd-caption">
                  le registre allège de {WEIGHT.gapDark} — valeur de départ, à poser à l&apos;œil
                </figcaption>
              </figure>
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <Rules ids={["t13", "t14", "t7"]} />
              </div></details>
            </div>
          </section>

          {/* ═══ LE RÉPERTOIRE — une seule section, à la typographie : les six
              dérives en bandes (#casser), les règles qui se vérifient ailleurs
              (#invisibles), les tokens (#code). Les pièces viennent d'etages.tsx ;
              leur assemblage et leur titre sont ceux de cette page (8 sept. 2026). ═══ */}
          <section className="gdoc-sec set" id="registry">
            <div className="gdoc-sec-head">
              <p className="kicker">06 · Le registre</p>
              <h2>Ce que la typographie règle sans qu&apos;on la voie</h2>
              <p className="muted">Six dérives ordinaires qu&apos;aucun outil ne signale, treize
              règles qui se vérifient dans le code ou à l&apos;écran allumé, et les tokens
              qui les portent. Les lignes marquées « décision d&apos;Auteur » sont des
              réglages du kit, pas des lois de la lecture.</p>
            </div>
            <div className="gdoc-body">
              <div className="doc-piece" id="wreck">
                <div className="doc-piece-head">
                  <h3>Six dérives sans message d&apos;erreur</h3>
                  <p className="muted">Chacune se commet pour de vrai sur la scène, puis se répare.
                  Le coût n&apos;apparaît qu&apos;à l&apos;usage : au zoom, au lecteur d&apos;écran,
                  au téléphone.</p>
                </div>
              <Bands>
                <Band level={4} name="Le zoom du lecteur" side="du rem dans chaque borne" bare
                  says="Un lecteur agrandit le texte : la fenêtre, elle, ne bouge pas. Une taille exprimée en part d&apos;écran seule ne grandit donc pas d&apos;un pixel. L&apos;échec est silencieux — invisible en test standard, bloquant pour qui dépend du zoom."
                  rules={<Rules ids={["t3"]} />}>
                  <Demo situation="Un lecteur règle son navigateur à 200 %"
                    action={{ label: "Agrandir le texte", onClick: replayZoom }}
                    caption={`corps du moteur à ${fr(widthScreen)} px de large : ${fr(bodyPx(widthScreen, 1, false))} px au repos, ${fr(body)} px sous zoom — lus sur le rendu`}>
                    <DemoSides>
                      <DemoSide ok={false} verdict="La part d'écran seule ne gagne pas un pixel">
                        <div className="tp-scene">
                          {/* casse : tout en vw, le zoom ne mord plus — le corps calculé à la largeur réelle, sans le zoom */}
                          <span className="tp-zoom-text" style={{ fontSize: `${bodyVw}px`, lineHeight: "var(--leading-body)" }}>
                            Portez ce vieux whisky au juge blond qui fume
                          </span>
                          <span className="badge ko">zoom ×{zoom} — et pas un pixel gagné</span>
                        </div>
                      </DemoSide>
                      <DemoSide ok verdict="Le rem suit le zoom : le corps double">
                        <div className="tp-scene">
                          {/* le corps calculé par le moteur à la largeur réelle de l'écran, sous le zoom — le nombre est vrai, pas posé */}
                          <span className="tp-zoom-text" style={{ fontSize: `${body}px`, lineHeight: "var(--leading-body)" }}>
                            Portez ce vieux whisky au juge blond qui fume
                          </span>
                          <span className="mono muted">corps = {fr(body)} px</span>
                        </div>
                      </DemoSide>
                    </DemoSides>
                  </Demo>
                </Band>

                <Band level={4} name="Le saut de niveau" side="un niveau à la fois" bare
                  says="Les niveaux de titre se suivent sans saut. Un h2 suivi directement d&apos;un h4 casse l&apos;arbre que le lecteur d&apos;écran parcourt : l&apos;utilisateur en conclut qu&apos;il manque du contenu. Aucun bénéfice en échange."
                  rules={<Rules ids={["t1", "p01"]} />}>
                  <Demo situation="Le plan d'un dossier, lu par un lecteur d'écran">
                    <DemoSides>
                      <DemoSide ok={false} verdict="h2 puis h4 : un niveau manque"><Tree jump /></DemoSide>
                      <DemoSide ok verdict="h2, h3, h4 : chaque niveau à sa place"><Tree jump={false} /></DemoSide>
                    </DemoSides>
                  </Demo>
                </Band>

                <Band level={4} name="La graisse" side="les titres, jamais le texte long" bare
                  says="Quand tout est important, plus rien ne l&apos;est. Un paragraphe entier en demi-gras n&apos;appuie plus rien du tout — et la graisse fine sous le corps courant dégrade le trait, même quand la couleur passe les seuils."
                  rules={<Rules ids={["t7"]} />}>
                  <Demo situation="Un paragraphe de texte courant">
                    <DemoSides>
                      <DemoSide ok={false} verdict="Tout en demi-gras : plus rien ne ressort">
                        <div className="tp-scene">
                          <p style={{ fontWeight: 600 }}>Un texte long en demi-gras
                          n&apos;appuie plus rien : quand tout est important, rien ne l&apos;est. Le
                          demi-gras appartient aux titres.</p>
                          <span className="badge ko">tout le paragraphe en demi-gras — il n&apos;y a plus rien à mettre en avant</span>
                        </div>
                      </DemoSide>
                      <DemoSide ok verdict="Le corps courant à 400, la graisse aux titres">
                        <div className="tp-scene">
                          <p style={{ fontWeight: 400 }}>Un texte long en demi-gras
                          n&apos;appuie plus rien : quand tout est important, rien ne l&apos;est. Le
                          demi-gras appartient aux titres.</p>
                        </div>
                      </DemoSide>
                    </DemoSides>
                  </Demo>
                </Band>

                <Band level={4} name="Les capitales" side="brèves, espacées, jamais tapées" bare
                  says="Les capitales ont été dessinées pour ouvrir une phrase, pas pour en porter quatre. Sur du texte courant, elles effacent la silhouette des mots : l&apos;œil se met à épeler au lieu de lire."
                  rules={<Rules ids={["t8"]} />}>
                  <Demo situation="Le même paragraphe, tapé en capitales ou non">
                    <DemoSides>
                      <DemoSide ok={false} verdict="En capitales, la silhouette des mots a disparu">
                        <div className="tp-scene">
                          <p style={{ textTransform: "uppercase" }}>Les capitales sur
                          du texte courant effacent la silhouette des mots — l&apos;œil épelle au lieu
                          de lire. Ici elles restent aux étiquettes brèves, espacées, posées par le
                          style.</p>
                          <span className="badge ko">capitales sur du texte courant — l&apos;œil épelle</span>
                        </div>
                      </DemoSide>
                      <DemoSide ok verdict="En bas de casse, l'œil lit des formes">
                        <div className="tp-scene">
                          <p>Les capitales sur
                          du texte courant effacent la silhouette des mots — l&apos;œil épelle au lieu
                          de lire. Ici elles restent aux étiquettes brèves, espacées, posées par le
                          style.</p>
                        </div>
                      </DemoSide>
                    </DemoSides>
                  </Demo>
                </Band>

                <Band level={4} name="Les 16 px du champ" side="jamais sous le plancher" bare
                  says="Sous seize pixels, Safari sur iPhone zoome la page entière dès qu&apos;on touche le champ. Ce n&apos;est pas une préférence esthétique, c&apos;est un comportement de plateforme — et il suffit d&apos;un champ pour l&apos;attraper."
                  rules={<Rules ids={["t10"]} />}>
                  <Demo situation="Un champ de formulaire, touché sur un iPhone">
                    <DemoSides>
                      <DemoSide ok={false} verdict="À 14 px, Safari zoome la page entière au focus">
                        <div className="tp-scene field">
                          <span className="field-box">
                            {/* casse : un champ sous 16 px — 14 px en dur, à dessein ; Safari iOS zoome la page au focus */}
                            <input readOnly value="prenom@exemple.fr" style={{ fontSize: "0.875rem" }} />
                          </span>
                          <span className="badge ko">14 px — Safari iOS zoomera la page au focus</span>
                        </div>
                      </DemoSide>
                      <DemoSide ok verdict="Au corps du kit, 16 px et plus : rien ne bouge">
                        <div className="tp-scene field">
                          <span className="field-box">{/* l'enveloppe porte le halo de focus : un champ natif n'a pas de pseudo-éléments */}
                            <input readOnly value="prenom@exemple.fr" style={{ fontSize: "var(--font-size-body)" }} />
                          </span>
                        </div>
                      </DemoSide>
                    </DemoSides>
                  </Demo>
                </Band>

                <Band level={4} name="Le calage du texte" side="calé sur les capitales et la ligne de base" bare
                  says="Le navigateur ajoute la moitié de l&apos;interligne au-dessus et au-dessous de chaque ligne, et la font réserve déjà de la place pour les accents et les jambages. Un texte est donc centré au calcul et décentré à l&apos;œil : la même valeur d&apos;espace, posée des quatre côtés, n&apos;en paraît jamais une."
                  rules={<Rules ids={["t12"]} />}>
                  <Demo situation="Une carte, son titre posé à la même distance des quatre bords">
                    <DemoSides>
                      <DemoSide ok={false} verdict="L'air de la ligne revient : le haut n'est plus celui qu'on voit"><CardAligned broken /></DemoSide>
                      <DemoSide ok verdict="Calé sur les capitales : le haut vaut les côtés"><CardAligned broken={false} /></DemoSide>
                    </DemoSides>
                  </Demo>
                </Band>
              </Bands>
              </div>

              <div className="doc-piece" id="invisibles">
                <div className="doc-piece-head">
                  <h3>Treize règles, et où chacune se vérifie</h3>
                  <p className="muted">Certaines règles ne se photographient pas. Elles se
                  vérifient dans le code, sur l&apos;écran allumé, ou nulle part — et alors
                  elles s&apos;assument comme un choix, daté.</p>
                </div>
                <ListRules lines={LIST} />
                <details className="prov"><summary>Règles &amp; sources</summary><div>
                  <Rules ids={["p01", "g1", "t11", "t2", "t4", "t5", "t6", "t9"]} />
                </div></details>
              </div>

              <div className="doc-piece" id="code">
                <div className="doc-piece-head">
                  <h3>Les tokens</h3>
                  <p className="muted">Ce qui fait foi, c&apos;est la règle et le token — pas
                  l&apos;extrait de code, qui vieillit et finit par mentir. Chaque valeur
                  ci-dessous est lue dans le registre du moment.</p>
                </div>
                <PanelRegistry lines={CODE} />
              </div>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
