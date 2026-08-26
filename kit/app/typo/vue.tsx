"use client";
import { useEffect, useState, type ReactNode } from "react";
import { PanneauCode } from "../apercu";
import { useAdaptation } from "../adaptation";
import { RailDoc, useDocSections, type Sommaire } from "../rail";
import { chaine, jetons, aLargeur, AXES, CHARTE, LARGEUR_MIN, LARGEUR_MAX } from "../../derivation.mjs";

/* ═══════════════════════════════════════════════════════════════════════
   PAGE TYPOGRAPHIE — contenu natif (24 août, reprise après verdict
   d'Auteur : « t'as adapté le contenu existant au lieu de proposer un
   contenu original »). La formule s'applique en deux étages :

   · ÉTAGE 1 — trois preuves, trois natures, sur la terre natale de la
     typographie : LES VOIX (vocabulaire — deux familles, quatre
     costumes, la casse T11 du nom orphelin), LA MESURE (variation —
     même texte, seule la largeur change, comptée sur la page rendue),
     LA GAZETTE (objet en situation — un imprimé composé par les règles,
     cassable d'un geste).
   · ÉTAGE 2 — le répertoire : l'échelle (huit crans, lus dans le
     moteur), les garde-fous en grille compacte (zoom, saut de niveau,
     graisse, capitales, 16 px) et l'adaptation.

   Migrée sur la chaîne le 25 août 2026 (huit décisions, séance sur
   pièce) : plus une table recopiée — tout chiffre affiché est calculé
   par kit/derivation.mjs ; plus un ancien jeton — marges, espaces,
   coins et crans de texte portent les noms du registre. Les styles
   propres à la page vivent dans typo.css.

   Le contenu ne perd rien : les onze règles et toutes les casses
   restent — elles changent de maison, jamais de fond.
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
    pourquoi: "C'est le pont promis par la fondation rythme : l'espace entre les lignes fait plus pour la lisibilité que le choix de la police.",
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
  { id: "t11", nom: "T11", titre: "La fonte déclarée est la fonte livrée",
    enonce: "Toute famille déclarée est appariée à un fichier versé au dépôt, au nom strictement identique, avec sa pile de secours. Aucun nom orphelin.",
    pourquoi: "Un nom qui ne correspond pas ne produit aucune erreur : il produit un produit entier en police système — et rien, nulle part, ne le signale.",
    div: "Les familles de ce kit sont livrées avec lui : Geist, et JetBrains Mono pour le code.",
    src: [{ t: "Règle interne du système", h: "#" }] },
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

function LigneMesuree({ maxW, sourdine, verdict, libelle, etat }: { maxW?: string; sourdine?: boolean; verdict: string; libelle: string; etat: "bon" | "ko" }) {
  const [n, setN] = useState(0);
  const [p, setP] = useState<HTMLParagraphElement | null>(null);
  const [z, setZ] = useState<HTMLSpanElement | null>(null);
  useEffect(() => {
    if (!p || !z) return;
    const lire = () => {
      const w = p.getBoundingClientRect().width;
      const ch = z.getBoundingClientRect().width / 20;
      if (ch > 0) setN(Math.round(w / ch));
    };
    lire();
    const ro = new ResizeObserver(lire);
    ro.observe(p);
    return () => ro.disconnect();
  }, [p, z]);
  return (
    <div className={`gd-mesure ${sourdine ? "sourdine" : ""}`}>
      <span className={`badge ${etat}`}>{verdict} · ≈ {n} caractères par ligne — {libelle}</span>
      <p ref={setP} style={{ maxWidth: maxW, width: maxW ? undefined : "100%" }}>
        <span ref={setZ} aria-hidden style={{ position: "absolute", visibility: "hidden", whiteSpace: "pre" }}>00000000000000000000</span>
        {TEXTE_MESURE}
      </p>
    </div>
  );
}

/* ── RÉPERTOIRE — l'arbre des titres, compact. En encre ; le rouge à la
   faute. Un niveau = une marge de carte, par imbrication : jamais un
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

const SNIPPETS: Record<string, Record<string, string>> = {
  React: {
    Tailwind: `// tailwind.config : theme.extend <- typography (tokens.tailwind.mjs)
// chaque classe résout var(--font-size-…) — un thème littéral sortirait ARRONDI
export function Article({ surtitre, titre, enfants }) {
  return (
    <article className="font-sans text-body leading-body max-w-measure">
      <p className="text-small tracking-label uppercase">{surtitre}</p>
      <h2 className="text-h2 leading-heading font-semibold">{titre}</h2>
      {enfants}
    </article>
  );
}`,
    shadcn: `// shadcn/ui vit sur Tailwind — la typo du système passe par les mêmes classes
import { Card, CardContent } from "@/components/ui/card";

export function Article({ surtitre, titre, enfants }) {
  return (
    <Card>
      <CardContent className="font-sans text-body leading-body max-w-measure">
        <p className="text-small tracking-label uppercase">{surtitre}</p>
        <h2 className="text-h2 leading-heading font-semibold">{titre}</h2>
        {enfants}
      </CardContent>
    </Card>
  );
}`,
    "HTML natif": `/* Le normatif : la règle et le jeton. Ce code n'est qu'un exemple. */
export function Article({ surtitre, titre, enfants }) {
  return (
    <article className="texte-courant">
      <p className="etiquette">{surtitre}</p>
      <h2 className="titre-2">{titre}</h2>
      {enfants}
    </article>
  );
}

/* styles.css — tout sort des jetons, rien en dur */
.texte-courant {
  font: 400 var(--font-size-body) / var(--leading-body) var(--font-sans);
  max-width: var(--measure);           /* T5 : qui glisse se borne */
}
.titre-2 {
  font-size: var(--font-size-h2);      /* T2/T3 : clamp() avec du rem partout */
  line-height: var(--leading-heading);
  font-weight: 600;                    /* T7 : le demi-gras porte les titres */
}
.etiquette {
  font-size: var(--font-size-small);   /* T10 : le petit cran, étiquette seulement */
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;           /* T8 : par le style, jamais tapées */
}`,
  },
  Angular: {
    Tailwind: `@Component({
  selector: "kit-article",
  template: \`
    <article class="font-sans text-body leading-body max-w-measure">
      <p class="text-small tracking-label uppercase">{{ surtitre }}</p>
      <h2 class="text-h2 leading-heading font-semibold">{{ titre }}</h2>
      <ng-content />
    </article>\`,
})
export class Article { @Input() surtitre = ""; @Input() titre = ""; }`,
    shadcn: `// côté Angular, l'esprit shadcn vit dans spartan/ui — mêmes classes Tailwind
@Component({
  selector: "kit-article",
  template: \`
    <hlm-card>
      <div hlmCardContent class="font-sans text-body leading-body max-w-measure">
        <p class="text-small tracking-label uppercase">{{ surtitre }}</p>
        <h2 class="text-h2 leading-heading font-semibold">{{ titre }}</h2>
        <ng-content />
      </div>
    </hlm-card>\`,
})
export class Article { @Input() surtitre = ""; @Input() titre = ""; }`,
    "HTML natif": `@Component({
  selector: "kit-article",
  template: \`
    <article class="texte-courant">
      <p class="etiquette">{{ surtitre }}</p>
      <h2 class="titre-2">{{ titre }}</h2>
      <ng-content />
    </article>\`,
  styleUrl: "./article.css", // mêmes classes : var(--font-size-body), var(--font-size-small), var(--measure)…
})
export class Article { @Input() surtitre = ""; @Input() titre = ""; }`,
  },
  HTML: {
    Tailwind: `<article class="font-sans text-body leading-body max-w-measure">
  <p class="text-small tracking-label uppercase">Le surtitre</p>
  <h2 class="text-h2 leading-heading font-semibold">Le titre</h2>
  <p>Les classes résolvent les jetons — le système reste le même.</p>
</article>`,
    shadcn: `<!-- shadcn est une bibliothèque React : en HTML pur il n'en reste que
     l'essentiel — ses classes Tailwind, qui résolvent nos jetons -->
<article class="font-sans text-body leading-body max-w-measure border bg-card">
  <p class="text-small tracking-label uppercase">Le surtitre</p>
  <h2 class="text-h2 leading-heading font-semibold">Le titre</h2>
</article>`,
    "HTML natif": `<link rel="stylesheet" href="kit/tokens.css" />
<link rel="stylesheet" href="kit/fontes.css" /><!-- T11 : fontes livrées -->

<article class="texte-courant">
  <p class="etiquette">Le surtitre</p>
  <h2 class="titre-2">Le titre</h2>
  <p>Le corps courant — jamais sous 16 px, borné en ch, interligne 1,6.</p>
</article>`,
  },
};

const SOMMAIRE: Sommaire = [
  ["voix", "01", "Les voix"],
  ["gamme", "02", "L'échelle"],
  ["mesure", "03", "La mesure"],
  ["gazette", "04", "La gazette"],
  ["garde", "05", "Les garde-fous"],
  ["adaptation", "06", "L'adaptation"],
];

export default function Vue() {
  /* preuves */
  const [mauvaisNom, setMauvaisNom] = useState(false);
  const [justif, setJustif] = useState(false);
  const [serre, setSerre] = useState(false);
  /* répertoire */
  const [zoom, setZoom] = useState(1);
  const [vwSeul, setVwSeul] = useState(false);
  const [saut, setSaut] = useState(false);
  const [gras, setGras] = useState(false);
  const [tape, setTape] = useState(false);
  const [petit, setPetit] = useState(false);
  const [fw, setFw] = useState<"React" | "Angular" | "HTML">("HTML");
  const { styl } = useAdaptation();
  const actifId = useDocSections("voix");
  const largeurEcran = useLargeurEcran();
  const corps = largeurEcran > 0 ? corpsPx(largeurEcran, zoom, vwSeul) : CORPS;

  return (
    <div className="gdoc-fond">
      <div className="gdoc">
        <RailDoc page="typo" titre="Fondation · Typographie" sommaire={SOMMAIRE} actifId={actifId} pied="Geist · JetBrains Mono — livrées avec le kit" />

        <main className="gdoc-contenu" id="contenu">

          <section className="gdoc-heros">
            <p className="kicker">Fondation · La typographie</p>
            <h1>Chaque lettre de cette page sait pourquoi<span className="point" aria-hidden="true" /></h1>
            <p className="chapo">
              Onze règles composent ce que vous êtes en train de lire — le corps, la
              ligne, l&apos;air, les capitales. <b>Aucune ne se montre : elles se
              lisent.</b> Plus bas, une gazette les met à l&apos;épreuve et se casse
              d&apos;un geste ; sous chaque banc d&apos;essai, «&nbsp;Règles &amp;
              sources&nbsp;» se déplie.
            </p>
          </section>

          {/* ═══ PREUVE 1 · VOCABULAIRE — les voix ═══ */}
          <section className="gdoc-sec pose" id="voix">
            <div className="gdoc-sec-tete">
              <p className="kicker">01 · Les voix</p>
              <h2>Deux voix suffisent</h2>
              <p className="sourd">Chaque famille de plus est une décision de plus à tenir
              pendant des années. Le kit parle avec une voix qui lit et une voix qui
              chiffre — et chaque rôle porte un costume, un seul. La casse du nom
              orphelin montre le risque : déclarez une fonte qui n&apos;existe pas,
              et vous lisez la police système sans qu&apos;aucune erreur ne s&apos;affiche.</p>
            </div>
            <div className="gdoc-corps">
              <div className="rang">
                <button className={`bouton casse ${mauvaisNom ? "on" : ""}`} onClick={() => setMauvaisNom(!mauvaisNom)}>
                  {mauvaisNom ? "Réparer le nom" : "Casser : déclarer « Geist Text »"}
                </button>
                {mauvaisNom && (
                  <span className="badge ko">nom orphelin — police système, en silence</span>
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
                  une voix qui lit, une voix qui chiffre — livrées avec le kit, au nom près
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
              <h2>Huit crans, un seul rapport</h2>
              <p className="sourd">Toute la page que vous lisez sort de huit crans et
              d&apos;un seul rapport : chaque cran vaut le précédent, un peu plus grand,
              toujours du même pas. Six servent le texte, du petit à l&apos;affiche ; les
              deux derniers sont les titres du site. Un seul curseur les fait glisser
              ensemble avec la largeur de l&apos;écran — et le corps ne descend jamais
              sous son plancher. L&apos;échelle s&apos;arrête là où une structure devrait
              être réorganisée plutôt qu&apos;habillée.</p>
            </div>
            <div className="gdoc-corps">
              <figure className="gd-figure" style={{ width: "100%", justifyItems: "start" }}>
                <div className="gd-gamme">
                  {CRANS.map(({ nom, fiche, jeton, bornes: b }) => (
                    <div key={nom} className="gd-gcran">
                      <span className="fiche">{fiche} · {b}</span>
                      <span className="spec" style={{ fontSize: jeton }}>Rien qui ne soit un token.</span>
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
                <figcaption className="gd-legende" style={{ textAlign: "left" }}>
                  bornes calculées, bas à {ECRAN_MIN} px, haut à {ECRAN_MAX} px · chaque cran vaut
                  le précédent × {fr2(RAPPORT)} · l&apos;échelle glisse de × {fr2(GLISSEMENT)} entre {ECRAN_MIN} et {ECRAN_MAX} ·
                  les deux titres du site glissent avec l&apos;écran entre deux crans de la chaîne — une intention d&apos;auteur, déclarée ·
                  du rem dans chaque borne, le zoom garde la main · titres serrés à 1,2 — corps à 1,6
                </figcaption>
              </figure>
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <Regles ids={["t2", "t4"]} />
              </div></details>
            </div>
          </section>

          {/* ═══ PREUVE 2 · VARIATION — la mesure ═══ */}
          <section className="gdoc-sec pose" id="mesure">
            <div className="gdoc-sec-tete">
              <p className="kicker">03 · La mesure</p>
              <h2>La lisibilité est une largeur avant d&apos;être une taille</h2>
              <p className="sourd">Lisez : même texte, même corps, même interligne —
              seule la largeur change. Le compteur lit la ligne réelle sur la page
              rendue, jamais la déclaration.</p>
            </div>
            <div className="gdoc-corps">
              <div className="gd-mesures">
                <LigneMesuree maxW="28ch" sourdine etat="ko" verdict="Trop court" libelle="l'œil s'essouffle" />
                <LigneMesuree maxW="var(--measure)" etat="bon" verdict="Juste" libelle="la borne du registre" />
                <LigneMesuree sourdine etat="ko" verdict="Sans borne" libelle="la ligne suit l'écran, sans jamais s'arrêter" />
              </div>
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <Regles ids={["t5", "t6"]} />
              </div></details>
            </div>
          </section>

          {/* ═══ PREUVE 3 · OBJET EN SITUATION — la gazette ═══ */}
          <section className="gdoc-sec pose" id="gazette">
            <div className="gdoc-sec-tete">
              <p className="kicker">04 · La gazette</p>
              <h2>Un imprimé composé sans une seule décision locale</h2>
              <p className="sourd">Le vrai test d&apos;une typographie n&apos;est pas un
              spécimen : c&apos;est un objet réel qui tient sans réglage au cas par cas.
              Celui-ci est composé par les règles — cassez-en une, et lisez la page
              mentir.</p>
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
                <div className="banc voile">
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

          {/* ═══ RÉPERTOIRE — les garde-fous, en grille compacte ═══ */}
          <section className="gdoc-sec pose" id="garde">
            <div className="gdoc-sec-tete">
              <p className="kicker">05 · Les garde-fous</p>
              <h2>Le reste du corpus, faute par faute</h2>
              <p className="sourd">Cinq dérives ordinaires, et aucune ne produit
              d&apos;erreur nulle part — c&apos;est bien le problème. Chaque carte porte la
              règle qui l&apos;arrête, et le moyen de la voir échouer.</p>
            </div>
            <div className="gdoc-corps">
              <div className="gd-gardes">
                <div className="carte">
                  <div className="rang" style={{ justifyContent: "space-between" }}>
                    <span className="mono sourd">Le zoom du lecteur</span>
                    <span className="rang">
                      {[1, 2].map((z) => (
                        <button key={z} className={`bouton ${zoom === z ? "on" : ""}`} onClick={() => setZoom(z)}>×{z}</button>
                      ))}
                      <button className={`bouton casse ${vwSeul ? "on" : ""}`} onClick={() => setVwSeul(!vwSeul)}>{vwSeul ? "Réparer" : "Casser : vw seul"}</button>
                    </span>
                  </div>
                  <div style={{ display: "grid", gap: "var(--gap-3-block)" }}>
                    {/* le corps calculé par le moteur à la largeur réelle de l'écran — le nombre est vrai, pas posé */}
                    <span data-intent={vwSeul ? "statement" : undefined} style={{ fontSize: `${corps}px`, lineHeight: "var(--leading-body)" }}>
                      Portez ce vieux whisky au juge blond qui fume
                    </span>
                    {vwSeul && zoom > 1 ? (
                      <span className="badge ko">zoom ×{zoom} — et pas un pixel gagné</span>
                    ) : (
                      <span className="mono sourd">corps = {fr(corps)} px</span>
                    )}
                  </div>
                </div>
                <div className="carte">
                  <div className="rang" style={{ justifyContent: "space-between" }}>
                    <span className="mono sourd">Le saut de niveau</span>
                    <button className={`bouton casse ${saut ? "on" : ""}`} onClick={() => setSaut(!saut)}>{saut ? "Réparer" : "Casser"}</button>
                  </div>
                  <Arbre saut={saut} />
                </div>
                <div className="carte">
                  <div className="rang" style={{ justifyContent: "space-between" }}>
                    <span className="mono sourd">La graisse</span>
                    <button className={`bouton casse ${gras ? "on" : ""}`} onClick={() => setGras(!gras)}>{gras ? "Réparer" : "Casser"}</button>
                  </div>
                  <p data-intent={gras ? "statement" : undefined} style={{ fontWeight: gras ? 600 : 400 }}>Un texte long en demi-gras n&apos;appuie
                  plus rien : quand tout est important, rien ne l&apos;est. Le demi-gras appartient
                  aux titres — ce paragraphe vient de vous le prouver.</p>
                </div>
                <div className="carte">
                  <div className="rang" style={{ justifyContent: "space-between" }}>
                    <span className="mono sourd">Les capitales</span>
                    <button className={`bouton casse ${tape ? "on" : ""}`} onClick={() => setTape(!tape)}>{tape ? "Réparer" : "Casser"}</button>
                  </div>
                  <p data-intent={tape ? "statement" : undefined} style={tape ? { textTransform: "uppercase" } : undefined}>Les capitales sur du
                  texte courant effacent la silhouette des mots — l&apos;œil épelle au lieu de lire.
                  Ici elles restent aux étiquettes brèves, espacées, posées par le style.</p>
                </div>
                <div className="carte">
                  <div className="rang" style={{ justifyContent: "space-between" }}>
                    <span className="mono sourd">Les 16 px du champ</span>
                    <button className={`bouton casse ${petit ? "on" : ""}`} onClick={() => setPetit(!petit)}>{petit ? "Réparer" : "Casser"}</button>
                  </div>
                  <div className="champ">
                    {/* casse : un champ sous 16 px — 14 px en dur, à dessein ; Safari iOS zoome la page au focus */}
                    <input readOnly value="prenom@exemple.fr" data-intent={petit ? "statement" : undefined} style={{ fontSize: petit ? "0.875rem" : "var(--font-size-body)" }} />
                    {petit && <span className="badge ko">14 px — Safari iOS zoomera la page au focus</span>}
                  </div>
                </div>
              </div>
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <Regles ids={["p01", "t1", "g1", "t3"]} />
              </div></details>
            </div>
          </section>

          {/* ═══ RÉPERTOIRE — l'adaptation ═══ */}
          <section className="gdoc-sec pose" id="adaptation">
            <div className="gdoc-sec-tete">
              <p className="kicker">06 · L&apos;adaptation</p>
              <h2>Le même système, dans votre stack</h2>
              <p className="sourd">Un système normatif enfermé dans un framework n&apos;est
              qu&apos;une bibliothèque. Ici le normatif vit dans la règle et le jeton ; React,
              Angular ou HTML n&apos;en sont que des consommateurs — le même système, traduit.</p>
            </div>
            <div className="gdoc-corps">
              <PanneauCode langage={styl} outils={
                <>{(["HTML", "React", "Angular"] as const).map((f) => (
                  <button key={f} className={`bouton ${fw === f ? "on" : ""}`} onClick={() => setFw(f)}>{f}</button>
                ))}</>
              } code={SNIPPETS[fw][styl]} />
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <p>Le normatif, c&apos;est <b>la règle et le jeton</b> — pas le code. Un seul jeu de
                jetons produit des variables CSS natives et une sortie Tailwind jumelle ; React,
                Angular ou HTML n&apos;en sont que des consommateurs.</p>
              </div></details>
            </div>
          </section>

          <footer className="gd-pied">
            <span>Cette page est composée par les règles qu&apos;elle documente</span>
            <span>Onze règles — toutes dépliables ci-dessus</span>
          </footer>

        </main>
      </div>
    </div>
  );
}
