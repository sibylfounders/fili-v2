"use client";
import { useState } from "react";
import { RailDoc, useDocSections, type Toc } from "../rail";
import { Bands, Band, ListRules, PanelRegistry } from "../levels";
import type { LineList, LineCode } from "../levels";
import { chain, CHARTER, BOUNDS } from "../../derivation.mjs";
import "./rounded.css";

/* ═══════════════════════════════════════════════════════════════════════
   PAGE ARRONDIS — gabarit « documentaire nu ». Pièce libre jugée par
   l'Auteur le 25 août 2026 (« très mature »), migrée sur le registre
   unique le 25 août, passée à la voix d'Auteur et au gabarit des étages
   le 2 septembre.

   · LES PREUVES (01 à 03) — sans gabarit, c'est la part de séduction et
     elle diffère d'une page à l'autre : LA PROFONDEUR (situation — la
     fiche d'arrêt de Navette branchée sur la racine), LE COIN (variation
     — le labo du coin intérieur), LA PILULE (vocabulaire — la liste
     fermée). Leur FORME est conservée ; seul leur texte a été repris.
   · LE RÉPERTOIRE (04) — une seule section au titre de la page (8 sept.
     2026, plus de queue commune) : le registre des six coins, les six
     pièges en bandes (le juste au repos, la faute au curseur), la liste
     des règles qu'aucune image ne prouve. Pièces d'etages.tsx.

   Ce qui a quitté la page le 2 septembre : le sélecteur de six types de
   produit et sa table. Il réglait la même chose que les trois densités de
   la page Rythme — la base — et deux commandes qui règlent la même chose
   à deux endroits perdent le lecteur. L'extrait prêt à coller et sa
   bascule HTML / React / Angular sont retirés aussi.

   La famille des coins, telle que le registre la porte (décisions 2 et 3) :
   · le container porte la racine (16 à la charte), ÷ 2 par niveau —
     container, card, row, marque : un container prend le cran de sa
     PROFONDEUR, jamais de sa taille ;
   · la marge d'une surface ne descend jamais sous son coin ;
   · un composant prend le coin de la row : racine ÷ 4 — réglé par la
     racine du produit, jamais par l'écran ni la densité ;
   · la racine est bornée à 38 ; les coins ne glissent pas avec l'écran ;
   · la pilule est une forme réservée à une liste fermée.

   Les démos ne recopient aucune table : elles appellent chaine() du moteur
   avec la racine du curseur, et posent le résultat en variables --ar-*.
   Les styles propres à la page vivent dans arrondis.css.
   ═══════════════════════════════════════════════════════════════════════ */

const r1 = (v: number) => Math.round(v * 10) / 10;
const fmt = (v: number) => String(r1(v)).replace(".", ",");

/* Le socle de la chaîne pour des décisions d'entrée — typé localement,
   le moteur est du JavaScript. */
type Entries = { base?: number; interval?: number; root?: number };
type Foundation = { r: number[]; rCtl: number; pad: number[]; gap: number[]; edge: number };
const foundation = (e: Entries): Foundation => chain(e) as Foundation;
const ROOT_MAX: number = BOUNDS.root[1];

/* ── 01 · La fiche d'arrêt de Navette — un seul nombre, toute la chaîne.
   Container, card, row, marque : coin ÷ 2 par profondeur ; marge de
   profondeur, qui ne descend jamais sous le coin ; l'espace entre deux
   frères vaut leur marge. Les boutons sont des composants : le coin de
   la ligne, racine ÷ 4. ── */
function Tram() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h12v11H6zM8 15v3M16 15v3M9 8h6" /></svg>
  );
}
function RecordShuttle({ root }: { root: number }) {
  const s = foundation({ root });
  const style = {
    "--ar-r1": `${s.r[0]}px`, "--ar-r2": `${s.r[1]}px`, "--ar-r3": `${s.r[2]}px`, "--ar-r4": `${s.r[3]}px`,
    "--ar-rctl": `${s.rCtl}px`,
    "--ar-p1": `${s.pad[0]}px`, "--ar-p2": `${s.pad[1]}px`, "--ar-p3": `${s.pad[2]}px`,
    "--ar-g1": `${s.gap[0]}px`, "--ar-g2": `${s.gap[1]}px`, "--ar-g3": `${s.gap[2]}px`, "--ar-g4": `${s.gap[3]}px`,
  } as React.CSSProperties;
  return (
    <div className="ar-phone" style={style} role="img"
      aria-label="Navette, fiche de l'arrêt Place des Tilleuls : un container, une card de départs, trois rows, deux boutons">
      <div className="ar-screen">
        <div className="ar-background" aria-hidden="true"><div className="bar" /><div className="bar c" /><div className="plan" /></div>
        <div className="ar-veil" aria-hidden="true" />
        <div className="ar-panel">
          <div className="handle" aria-hidden="true" />
          <div>
            {/* un décor, pas un titre de la page : l'arbre des titres reste h1 → h2 → h3 → h4 (T1) */}
            <div className="ar-heading-record">Place des Tilleuls</div>
            <div className="sub">Arrêt · direction Hôpital Nord</div>
          </div>
          <div className="ar-card">
            <div className="heading">Prochains départs</div>
            {([["Hôpital Nord", "2 min"], ["Hôpital Nord", "9 min"], ["Gare", "14 min"]] as const).map(([d, t], i) => (
              <div className="ar-line" key={i}><span className="ar-brand"><Tram /></span><span className="dest">{d}</span><span className="t">{t}</span></div>
            ))}
          </div>
          <div className="ar-actions">
            <button className="tr-btn first ar-btn" type="button" tabIndex={-1}>Itinéraire</button>
            <button className="tr-btn ar-btn" type="button" tabIndex={-1}>Enregistrer</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 02 · Le labo du coin — repris du générateur Sibyl Scale (§1).
   Deux coins, le même intérieur et le même écart ; seul l'extérieur
   change. 1 unité = 3,2 px du dessin. Seul le coin haut-gauche existe :
   les surfaces se prolongent loin hors du cadre. ── */
// hors chaîne : la géométrie du dessin, en unités du viewBox — pas des pixels CSS
const DRAWING = { k: 3.2, ox: 64, oy: 48, W: 340, H: 260, measure: 14, measureSmall: 12, arc: 4, stroke: 1.5 };
function Corner({ Ro, ri, E, ok }: { Ro: number; ri: number; E: number; ok: boolean }) {
  const { k, ox, oy, W, H } = DRAWING;
  const Rk = Ro * k, rk = ri * k, Ek = E * k;
  /* Les surfaces du labo suivent le thème : le parent en encre secondaire,
     l'enfant en encre claire, les mesures en encre / en fond (retour d'Auteur).
     Verdicts : vert = le juste, rouge = la faute — ceux du système, la scène
     étant déclarée en thème sombre (7 septembre). */
  const hue = ok ? "var(--success)" : "var(--danger)";
  const a = ox + Rk - Rk / Math.SQRT2, b = ox + Ek + rk - rk / Math.SQRT2;
  const d = (b - a) * Math.SQRT2 / k;
  const mono = "var(--font-mono)";
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img"
      aria-label={ok ? "Le coin extérieur vaut le coin intérieur plus l'écart : les deux arcs sont parallèles"
                     : "Le coin extérieur porte le même rayon que le coin intérieur : l'écart se creuse dans la diagonale"}>
      <rect x="0" y="0" width={W} height={H} fill="var(--bg)" />
      {/* le parent : un gris qui tient devant l'encre claire de l'enfant — sur la scène de nuit, c'est le cran tertiaire (retour d'Auteur, 7 septembre : le gris second y était trop clair) */}
      <rect x={ox} y={oy} width="2000" height="2000" rx={Rk} fill="var(--text-tertiary)" />
      <rect x={ox + Ek} y={oy + Ek} width="2000" height="2000" rx={rk} fill="var(--text-primary)" />
      <path d={`M${ox + Rk} ${oy} A ${Rk} ${Rk} 0 0 0 ${ox} ${oy + Rk}`} stroke={hue} strokeWidth={DRAWING.arc} fill="none" strokeLinecap="round" />
      <line x1={a} y1={oy + (a - ox)} x2={b} y2={oy + (b - ox)} stroke={hue} strokeWidth={DRAWING.stroke} />
      <text x={ox - 10} y={oy + Rk * 0.55 + 5} textAnchor="end" fontSize={DRAWING.measure} fontWeight="600" fontFamily={mono} fill={hue}>{Ro}</text>
      <text x={ox + Ek + rk + 6} y={oy + Ek + rk + 5} fontSize={DRAWING.measure} fontWeight="600" fontFamily={mono} fill="var(--bg)">{ri}</text>
      {E > 0 && <text x={W - 10} y={oy + Ek / 2 + 5} textAnchor="end" fontSize={DRAWING.measureSmall} fontWeight="600" fontFamily={mono} fill="var(--text-primary)">{E}</text>}
      <text x={(a + b) / 2 + 12} y={oy + ((a + b) / 2 - ox) - 8} fontSize={DRAWING.measureSmall} fontWeight="600" fontFamily={mono} fill={hue}>{fmt(d)}</text>
    </svg>
  );
}

/* ── 03 · Les quatre membres de la pilule, et deux recalés ── */
function Board() {
  const [on, setOn] = useState(true);
  const [tab, setTab] = useState(0);
  return (
    <div className="ar-board">
      <div className="ar-member">
        <div className="object"><span className="ar-dot" aria-label="Ligne B">B</span><span className="ar-dot seven" aria-label="Ligne 7">7</span></div>
        <div className="name">la pastille de ligne</div>
      </div>
      <div className="ar-member">
        <div className="object"><span className="ar-avatar" role="img" aria-label="Malik Oyelaran, abonné">MO</span></div>
        <div className="name">l&apos;avatar de l&apos;abonné</div>
      </div>
      <div className="ar-member">
        <div className="object">
          <button className="ar-inter" type="button" role="switch" aria-checked={on} onClick={() => setOn(!on)}>
            <span className="ar-sr">Trajets accessibles</span>
          </button>
          <span className="ar-interlab">Trajets accessibles</span>
        </div>
        <div className="name">la piste de l&apos;interrupteur</div>
      </div>
      <div className="ar-member">
        <div className="object">
          <div className="ar-tabs" role="tablist" aria-label="Sens">
            {["Départs", "Arrivées"].map((t, i) => (
              <button key={t} type="button" role="tab" aria-selected={tab === i} tabIndex={tab === i ? 0 : -1} onClick={() => setTab(i)}>{t}</button>
            ))}
          </div>
        </div>
        <div className="name">la piste des onglets</div>
      </div>
      {/* Les deux recalés portent une faute déclarée : intent="statement".
          Leur légende DIT la faute au lieu de la constater : « pas dans la
          liste » n'apprenait rien à qui n'a pas la liste en tête. Et elle
          ne compte pas les lignes — le texte en prend deux ou trois selon
          la largeur, « plusieurs » reste vrai partout. */}
      {/* Le bouton n'est plus un recalé : personne ne l'interdit — Material 3
          en fait la forme par défaut de ses boutons, Apple recommande la
          capsule. La faute documentée est ailleurs, et M3 la nomme : c'est
          le bouton SANS fond plein qui se confond avec une puce. Le même
          mot, deux fois, et une seule chose change. */}
      <div className="ar-member pair">
        <div className="object">
          <span className="ar-trial">
            {/* Une mise en garde, pas une faute : le bouton doux est permis,
                il est seulement risqué court et mal entouré. */}
            <span className="verdict attention" aria-hidden="true">⚠</span>
            <button className="ar-btn-pill soft" type="button" tabIndex={-1} aria-disabled="true">Payer</button>
          </span>
          <span className="ar-trial">
            <span className="verdict good" aria-hidden="true">✓</span>
            <button className="ar-btn-pill" type="button" tabIndex={-1} aria-disabled="true">Payer</button>
          </span>
        </div>
        <div className="name">en pilule et sans fond plein, un bouton court se confond avec une puce</div>
      </div>
      <div className="ar-member refused" data-intent="statement">
        <div className="object"><span className="ar-capsule">Correspondance ligne B vers Hôpital Nord</span></div>
        <div className="name">plusieurs lignes — une gélule</div>
      </div>
    </div>
  );
}

/* La table « la chaîne selon l'intention » et son sélecteur de six types de
   produit sont retirés le 2 septembre 2026 (verdict d'Auteur) : ils réglaient
   la même chose que les trois densités de la page Rythme — la base — et deux
   commandes qui règlent la même chose à deux endroits perdent le lecteur. Le
   registre des six coins vit désormais dans l'étage « dans le code ». */


/* ── Les règles — dans les dépliants « Règles & sources » de leur preuve ── */
type Src = { t: string; h: string };
const DECISIONS: Src = { t: "Décisions du 25 août 2026, séance sur pièce", h: "#" };
const RULES: { id: string; name: string; heading: string; statement: string; src: Src[] }[] = [
  { id: "a1", name: "1", heading: "Le coin ne change jamais à l'état",
    statement: "Propriété d'identité, pas d'état : aucun sélecteur de survol, focus, erreur ou sélection ne modifie un coin déclaré au repos.",
    src: [{ t: "RADIUS-UX 1.3.0 — R02", h: "#" }] },
  { id: "a2", name: "2", heading: "Tout coin vient de la chaîne",
    statement: "Chaque coin résout un cran de la chaîne — container, card, row, marque, ou le coin du composant ; aucune valeur en dur. Une racine, et tout descend.",
    src: [{ t: "RADIUS-UX 1.3.0 — R03", h: "#" }, DECISIONS] },
  { id: "a3", name: "3", heading: "Jamais un pourcentage, jamais un calcul",
    statement: "Le coin est un cran choisi, jamais dérivé d'un pourcentage ni d'une fraction de la hauteur — la dérive proportionnelle fabrique des pilules accidentelles.",
    src: [{ t: "RADIUS-UX 1.3.0 — R04", h: "#" }] },
  { id: "a4", name: "4", heading: "Même taille, même courbure",
    statement: "Deux contrôles de même taille voisins dans une même composition partagent le même cran — celui du composant. Dépend du registre des composants typés.",
    src: [{ t: "RADIUS-UX 1.3.0 — R05", h: "#" }] },
  { id: "a5", name: "5", heading: "Les coins imbriqués sont concentriques",
    statement: "Un coin intérieur n'est jamais plus rond que le coin extérieur qui le contient ; il vit dans la bande extérieur − écart ≤ intérieur ≤ extérieur. La concentricité est le plancher, le coin du parent le plafond ; la chaîne ÷ 2 choisit dans la bande. La contrainte s'affaiblit avec la distance : loin du bord, un objet flottant reprend son coin propre.",
    src: [{ t: "RADIUS-UX 1.3.0 — R06", h: "#" }, { t: "W3C — CSS Backgrounds and Borders, corner shaping", h: "https://www.w3.org/TR/css-backgrounds-3/#corner-shaping" }, { t: "Sibyl — la théorie, v2, §1", h: "#" }, DECISIONS] },
  { id: "a6", name: "6", heading: "L'anneau de focus, concentrique inversé",
    statement: "Posé à l'extérieur d'un composant, l'anneau prend le coin du composant augmenté de son écart — ce que fait outline-offset tout seul.",
    src: [{ t: "RADIUS-UX 1.3.0 — R07", h: "#" }, { t: "WCAG 2.4.11 — Focus Appearance", h: "https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html" }] },
  { id: "a7", name: "7", heading: "La pilule est une liste fermée",
    statement: "Le rayon plein est réservé à une liste énumérée — badge/pastille, avatar, piste de l'interrupteur, piste des onglets-pilule — et jamais sur un contenu qui peut passer à la ligne. Toute entrée nouvelle est un arbitrage d'Auteur. Un bouton, lui, n'est pas interdit de pilule : personne ne l'interdit, Material 3 en fait même la forme par défaut de ses boutons et Apple recommande la capsule. Il la porte alors AVEC son fond plein — c'est l'absence de conteneur, pas le rayon, qui le fait passer pour une puce, et d'autant plus s'il est court et voisin d'éléments qui lui ressemblent. Tensions de source : chez Atlassian les badges prennent le petit coin ; chez Fluent 2 la pilule désigne les tags et le rectangle les boutons — exactement l'inverse de Material 3. La liste d'ici est un parti pris d'identité, pas une vérité du métier.",
    src: [{ t: "RADIUS-UX 1.3.0 — R08", h: "#" }, { t: "Atlassian — Badge", h: "https://atlassian.design/components/badge/" },
      { t: "Material 3 — Buttons (« Consider using a filled or tonal button instead »)", h: "https://m3.material.io/components/buttons/guidelines" },
      { t: "Apple HIG — Buttons (« prefer circular or capsule-shape buttons »)", h: "https://developer.apple.com/design/human-interface-guidelines/buttons" },
      { t: "Fluent 2 — Shapes (la pilule pour les tags, le rectangle pour les boutons)", h: "https://fluent2.microsoft.design/shapes" }] },
  { id: "a8", name: "8", heading: "Un jeton déclare ses consommateurs",
    statement: "Chaque jeton de coin porte au moins un consommateur nommé : le container, la card, la row, la marque, le composant, la pilule.",
    src: [{ t: "RADIUS-UX 1.3.0 — R09", h: "#" }] },
  { id: "a9", name: "9", heading: "L'angle droit n'a pas de jeton",
    statement: "Rien n'est carré par défaut dans ce système — décision d'identité. Une racine nulle reste possible par arbitrage journalisé (intention « Technique ») ; ce n'est pas un cran, c'est une racine. La case à cocher reste anguleuse : exception dite.",
    src: [{ t: "RADIUS-UX 1.3.0 — R10", h: "#" }, { t: "Sibyl — la théorie, v2, §7", h: "#" }, DECISIONS] },
  { id: "a10", name: "10", heading: "Conteneur ou composant, la question qui décide tout",
    statement: "Un container (card, encart, fenêtre superposée, liste flottante, toast) prend le cran de sa profondeur, jamais de sa taille ; un composant prend le coin de la row — la racine divisée par quatre — qui suit la racine du produit et ne suit ni l'écran ni la densité ; la pilule est la liste fermée de la règle 7. Ni l'importance, ni l'état, ni le goût de l'écran n'entrent dans le choix.",
    src: [{ t: "RADIUS-UX 1.3.0 — R12", h: "#" }, { t: "Sibyl — la théorie, v2, §2 et §8", h: "#" }, DECISIONS] },
  { id: "slope", name: "pente", heading: "Marge et coin, même pente",
    statement: "La marge d'une surface ne descend jamais sous son coin : quand la racine grandit, la marge du container la rattrape et monte avec elle. C'est la seule façon dont un coin touche à un espace.",
    src: [{ t: "Relevé d'application, 24 août 2026", h: "#" }, { t: "Sibyl — la théorie, v2, §1 « dégagement »", h: "#" }, DECISIONS] },
  { id: "clearance", name: "candidate", heading: "Le dégagement d'angle",
    statement: "Marge intérieure ≥ 0,293 × coin, sinon le contenu entre dans l'arc. Seule raison légitime de gonfler une marge avec l'arrondi, en largeur uniquement.",
    src: [{ t: "Sibyl — la théorie, v2, §1", h: "#" }, { t: "Moteur des neuf invariants — i3", h: "#" }] },
  { id: "saturation", name: "candidate", heading: "La saturation",
    statement: "Un coin ne dépasse jamais la moitié du petit côté ; au-delà, il s'écrase et la surface devient une pilule sans l'avoir demandé. La racine elle-même est bornée à 38 : au-delà, la marge qui suit le coin change l'écran — le panneau n'a plus de place pour son contenu.",
    src: [{ t: "Sibyl — la théorie, v2, §1", h: "#" }, { t: "Moteur des neuf invariants — i4", h: "#" }, DECISIONS] },
];
function Rules({ ids }: { ids: string[] }) {
  return (
    <div style={{ display: "grid", gap: "var(--gap-1-block)" }}>
      {ids.map((id) => RULES.find((r) => r.id === id)!).map((r) => (
        <div key={r.id} style={{ display: "grid", gap: "var(--gap-3-block)", maxWidth: "var(--measure)" }}>
          <b style={{ color: "var(--text-primary)" }}><span className="badge">{r.name === "candidate" ? "candidate" : r.name === "slope" ? "slope" : `règle ${r.name}`}</span> {r.heading}</b>
          <span>{r.statement}</span>
          <span style={{ fontSize: "var(--font-size-small)" }}>Sources : {r.src.map((sc, i) => (
            <span key={sc.t}>{i > 0 && " · "}{sc.h === "#" ? sc.t : <a href={sc.h}>{sc.t}</a>}</span>
          ))}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Un réglage de scène : un curseur, une valeur ── */
function Dial({ id, label, min, max, step, value, onChange }: {
  id: string; label: string; min: number; max: number; step: number; value: number; onChange: (v: number) => void;
}) {
  return (
    <span className="ar-dial">
      <label htmlFor={id}>{label}</label>
      <input type="range" id={id} min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} />
      <output htmlFor={id}>{value}</output>
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   LES SIX PIÈGES — plan de preuves validé par l'Auteur le 2 septembre 2026,
   après trois reproches sur la première version :
   · les objets de démonstration n'avaient pas de traitement à eux et
     disparaissaient sur leur scène ;
   · la faute était cachée derrière un clic, si bien que le juste et le
     faux ne cohabitaient jamais ;
   · deux pièges — le pourcentage, la saturation — ne PEUVENT PAS se
     montrer sur une figure immobile : leur faute n'existe qu'en mouvement.

   D'où trois principes, tenus par les six scènes :
   1. Le juste et le faux sont côte à côte, en permanence. Rien derrière un
      clic : une faute d'arrondi ne se voit jamais sur un objet isolé.
   2. La commande, quand il y en a une, ne bascule pas entre juste et faux —
      elle fait bouger LA VARIABLE qui révèle la faute (la racine, la
      longueur du texte, la hauteur). C'est le mouvement qui démontre.
   3. Les objets portent un traitement à eux — fond de page et filet — parce
      qu'ici la FORME est le sujet : un objet sans contour est un fantôme.
   ══════════════════════════════════════════════════════════════════════ */

/* Le couple juste / faux : deux objets et ce qu'ils disent d'eux-mêmes. */
function Duo({ right, wrong, saysRight, saysWrong }: {
  right: React.ReactNode; wrong: React.ReactNode; saysRight: string; saysWrong: string;
}) {
  return (
    <div className="ar-duo">
      <div className="ar-duo-one">
        {right}
        <span className="mono ar-duo-says">{saysRight}</span>
      </div>
      <div className="ar-duo-one" data-intent="statement">
        {wrong}
        <span className="mono ar-duo-says ko">{saysWrong}</span>
      </div>
    </div>
  );
}

/* 1 · La valeur en dur — la racine bouge, l'une suit, l'autre reste. */
const HARD = 10; /* hors chaîne : la valeur écrite à la main, le sujet de la démonstration */
function TrapHard() {
  const [r, setR] = useState<number>(CHARTER.root);
  const s = foundation({ root: r });
  return (
    <div className="ar-scene">
      <Dial id="ar-p-hard" label="La racine du produit" min={0} max={ROOT_MAX} step={2} value={r} onChange={setR} />
      <Duo
        right={<span className="ar-obj ar-obj-box" style={{ borderRadius: `${s.r[1]}px` }} />}
        wrong={<span className="ar-obj ar-obj-box" style={{ borderRadius: `${HARD}px` }} />}
        saysRight={`le cran de la card — ${fmt(s.r[1])} px`}
        saysWrong={`${HARD} px, écrits à la main`}
      />
    </div>
  );
}

/* 2 · Le pourcentage — le texte s'allonge, la faute apparaît. */
const WORDS = ["Nouveau", "sur", "votre", "ligne", "de", "ce", "matin"];
function TrapPct() {
  const [n, setN] = useState(2);
  const text = WORDS.slice(0, n).join(" ");
  return (
    <div className="ar-scene">
      <Dial id="ar-p-pct" label="La longueur du texte" min={1} max={WORDS.length} step={1} value={n} onChange={setN} />
      <Duo
        right={<span className="ar-obj ar-obj-label">{text}</span>}
        wrong={<span className="ar-obj ar-obj-label" style={{ borderRadius: "50%" }}>{text}</span>}
        saysRight="le cran du composant"
        saysWrong="50 % de la hauteur"
      />
    </div>
  );
}

/* 3 · Les voisins dépareillés — deux rangées, l'œil tranche seul. */
function Row({ cornerButton }: { cornerButton: string }) {
  return (
    <span className="ar-row">
      <span className="ar-obj ar-obj-field">prenom@exemple.fr</span>
      <span className="ar-obj ar-obj-button" style={{ borderRadius: cornerButton }}>Envoyer</span>
    </span>
  );
}
function TrapNeighbors() {
  return (
    <div className="ar-scene">
      <Duo
        right={<Row cornerButton="var(--r-ctl)" />}
        wrong={<Row cornerButton="var(--r-2)" />}
        saysRight="le même cran pour les deux"
        saysWrong="deux crans dans la même rangée"
      />
    </div>
  );
}

/* 4 · Le survol qui arrondit — la faute, c'est vous qui la provoquez. */
function TrapState() {
  return (
    <div className="ar-scene">
      <Duo
        right={<button type="button" className="ar-obj ar-obj-button">Enregistrer</button>}
        wrong={<button type="button" className="ar-obj ar-obj-button ar-obj-soft">Enregistrer</button>}
        saysRight="survolez : le coin ne bouge pas"
        saysWrong="survolez : le coin change"
      />
    </div>
  );
}

/* 5 · Le coin saturé — un seuil qu'on franchit sans le décider. */
const CORNER_SAT = 24; /* hors chaîne : le coin de la démonstration, celui qui va saturer */
function TrapSaturated() {
  const [h, setH] = useState(56);
  const saturated = CORNER_SAT > h / 2;
  return (
    <div className="ar-scene">
      <Dial id="ar-p-sat" label="La hauteur de la boîte" min={20} max={72} step={2} value={h} onChange={setH} />
      <Duo
        right={<span className="ar-obj ar-obj-box" style={{ height: `${h}px`, borderRadius: "var(--r-ctl)" }} />}
        wrong={<span className="ar-obj ar-obj-box" style={{ height: `${h}px`, borderRadius: `${CORNER_SAT}px` }} />}
        saysRight="le cran du composant"
        saysWrong={`coin ${CORNER_SAT} sur ${h} de haut`}
      />
      {/* Le verdict se LIT sur la scène : le coin sature dès qu'il dépasse la
          moitié du petit côté. Il n'est pas décrété par un bouton. */}
      <span className={`badge ${saturated ? "ko" : "good"}`}>
        {saturated ? "le coin a dépassé la moitié de la hauteur — la boîte est devenue une pilule" : "le coin tient sous la moitié de la hauteur"}
      </span>
    </div>
  );
}

/* 6 · Le contenu dans l'arc — la courbe mange le texte. */
function TrapArc() {
  return (
    <div className="ar-scene">
      <Duo
        right={<span className="ar-obj ar-obj-arc">14:02</span>}
        wrong={<span className="ar-obj ar-obj-arc ar-obj-tight">14:02</span>}
        saysRight="la marge respecte la courbe"
        saysWrong="une marge d'un pixel pour un coin de douze"
      />
    </div>
  );
}

const TRAPS: { key: string; name: string; side: string; says: string; rules: string[]; scene: React.ReactNode }[] = [
  { key: "hard", name: "La valeur en dur", side: "la racine bouge, elle non",
    says: "Un coin qui n'est pas un cran ne bouge pas quand la racine bouge. Il a l'air juste aujourd'hui, et il est déjà faux demain — le jour où le produit change de racine, lui seul restera en arrière. Dès que la racine bouge, les deux se séparent.",
    rules: ["a2", "a8"], scene: <TrapHard /> },
  { key: "pct", name: "Le pourcentage", side: "la faute dort jusqu'au contenu",
    says: "Un coin dérivé de la hauteur ne se voit pas tant que le texte est court. Le texte s'allonge, et la forme se met à fondre toute seule — personne n'aura vu venir la gélule.",
    rules: ["a3"], scene: <TrapPct /> },
  { key: "vois", name: "Les voisins dépareillés", side: "deux crans dans une rangée",
    says: "Un champ et un bouton de même taille, côte à côte, avec deux coins différents. L'œil lit deux systèmes dans la même rangée, et personne ne sait dire lequel est le bon.",
    rules: ["a4", "a10"], scene: <TrapNeighbors /> },
  { key: "state", name: "Le survol qui arrondit", side: "le coin dit l'identité",
    says: "La couleur, l'ombre et l'anneau sont là pour dire l'état. Le coin, lui, dit ce que l'objet EST — s'il change sous la main, l'objet change d'identité en cours de route. Les deux boutons répondent au survol ; un seul reste lui-même.",
    rules: ["a1"], scene: <TrapState /> },
  { key: "sat", name: "Le coin saturé", side: "un seuil, pas une pente",
    says: "Au-delà de la moitié du petit côté, le coin s'écrase et la surface devient une pilule sans l'avoir demandé. La hauteur descend, et il y a un moment exact où ça bascule.",
    rules: ["saturation", "a7"], scene: <TrapSaturated /> },
  { key: "arc", name: "Le contenu dans l'arc", side: "marge ≥ trois dixièmes du coin",
    says: "La marge intérieure vaut au moins trois dixièmes du coin, sinon le texte entre dans la courbe. C'est la seule raison légitime de gonfler une marge à cause d'un arrondi.",
    rules: ["clearance", "slope"], scene: <TrapArc /> },
];

/* ── Étage « en liste » — ce qu'aucune image ne prouve. ── */
const LIST: LineList[] = [
  { name: "Conteneur ou composant, la question qui décide tout",
    says: "Un conteneur prend le cran de sa profondeur, jamais celui de sa taille ; un composant prend le coin de la ligne. Ni l'importance, ni l'état, ni le goût de l'écran n'entrent dans le choix.",
    or: "dans le code" },
  { name: "Tout coin vient de la chaîne",
    says: "Chaque coin résout un cran — le container, la card, la row, la marque, ou le coin du composant. Aucune valeur en dur : une racine, et tout descend.",
    or: "dans le code" },
  { name: "Un jeton déclare ses consommateurs",
    says: "Chaque jeton de coin porte au moins un consommateur nommé. Un cran que rien ne consomme sort du registre.",
    or: "dans le code" },
  { name: "L'angle droit n'a pas de jeton",
    says: "Rien n'est carré par défaut dans ce système — c'est une décision d'identité. Une racine nulle reste possible par arbitrage écrit ; ce n'est pas un cran, c'est une racine. La case à cocher reste anguleuse : exception dite.",
    or: "nulle part — décision d'Auteur", tone: "author" },
  { name: "Les coins ne suivent ni l'écran ni la densité",
    says: "Un coin est réglé par la racine du produit. Les marges, les espaces, le texte et la cible glissent avec la largeur ; les coins, non — un coin qui change avec l'écran change la marque.",
    or: "sur l'écran allumé", tone: "render" },
  { name: "Marge et coin, même pente",
    says: "La marge d'une surface ne descend jamais sous son coin : quand la racine grandit, la marge du container la rattrape et monte avec elle. C'est la seule façon dont un coin touche à un espace.",
    or: "dans le code" },
  { name: "L'anneau de focus est concentrique, à l'envers",
    says: "Posé à l'extérieur d'un composant, l'anneau prend le coin du composant augmenté de son écart — ce que le navigateur fait tout seul quand on le laisse faire.",
    or: "sur l'écran allumé", tone: "render" },
];

/* ── Étage « dans le code » — les valeurs sont LUES dans le registre calculé
   à la charte, jamais recopiées : si la racine bouge, ce tableau bouge. ── */
const REGISTRY = foundation({});
const CODE: LineCode[] = [
  { rule: "Le container",
    written: <><span className="cs-kw">border-radius</span>: <span className="cs-var">var(--r-1)</span></>,
    product: fmt(REGISTRY.r[0]) + " px", note: "la racine du produit — le cran le plus haut de la chaîne" },
  { rule: "La card, dans le container",
    written: <><span className="cs-kw">border-radius</span>: <span className="cs-var">var(--r-2)</span></>,
    product: fmt(REGISTRY.r[1]) + " px", note: "la racine divisée par deux" },
  { rule: "La row, dans la card",
    written: <><span className="cs-kw">border-radius</span>: <span className="cs-var">var(--r-3)</span></>,
    product: fmt(REGISTRY.r[2]) + " px", note: "encore divisée par deux — un enfant n'est jamais plus rond que son parent" },
  { rule: "Un bouton, un champ, un sélecteur",
    written: <><span className="cs-kw">border-radius</span>: <span className="cs-var">var(--r-ctl)</span></>,
    product: fmt(REGISTRY.rCtl) + " px", note: "le coin de la row : un composant ne prend pas le cran de sa taille" },
  { rule: "La marque, la vignette, la puce", fallback: true,
    written: <><span className="cs-kw">border-radius</span>: <span className="cs-var">var(--r-4)</span></>,
    product: fmt(REGISTRY.r[3]) + " px", note: "le dernier cran de la chaîne" },
  { rule: "La pastille, l'avatar, l'interrupteur", fallback: true,
    written: <><span className="cs-kw">border-radius</span>: <span className="cs-var">var(--r-pill)</span></>,
    product: "plein", note: "une forme réservée à une liste fermée, jamais un cran de la chaîne" },
  { rule: "La marge qui va avec le coin", fallback: true,
    written: <><span className="cs-kw">padding</span>: <span className="cs-var">var(--pad-2-block) var(--pad-2-inline)</span></>,
    product: fmt(REGISTRY.pad[1]) + " px", note: "elle ne descend jamais sous le coin de sa surface" },
  { rule: "L'angle droit", fallback: true,
    written: <><span className="cs-kw">border-radius</span>: <span className="cs-var">0</span></>,
    product: "aucun jeton", note: "rien n'est carré par défaut ici — une racine nulle est une racine, pas un cran" },
  { rule: "La racine du produit", fallback: true,
    written: <><span className="cs-kw">--r-1</span>: <span className="cs-var">{fmt(CHARTER.root)}px</span></>,
    product: "toute la chaîne se recalcule", note: "un seul nombre engendre les six coins ; il est borné à " + fmt(ROOT_MAX) },
];

const TOC: Toc = [
  ["depth", "01", "La profondeur"],
  ["corner", "02", "Le coin"],
  ["pill", "03", "La pilule"],
  ["registry", "04", "Le registre"],
];

export default function View() {
  const [root, setRoot] = useState<number>(CHARTER.root);
  const [ri, setRi] = useState(12);
  const [gap, setGap] = useState(12);
  const activeId = useDocSections("depth");
  const s = foundation({ root });
  const dL = gap * Math.SQRT2, pct = gap > 0 ? Math.round((dL / gap - 1) * 100) : 0;

  return (
    <div className="gdoc-background">
      <div className="gdoc">
        <RailDoc page="arrondis" heading="Fondation · Arrondis" toc={TOC} activeId={activeId} foot="Chaîne ÷ 2 depuis la racine · composant = racine ÷ 4" />

        <main className="gdoc-content" id="content">

          <section className="gdoc-hero">
            <p className="kicker">Les arrondis</p>
            <h1>Un seul nombre dessine tous les coins de cette page<span className="point" aria-hidden="true" /></h1>
            <p className="lede">
              Trois personnes qui arrondissent le même bouton donnent trois valeurs,
              et aucune ne sait dire pourquoi la sienne. Le coin n&apos;est pourtant
              pas une affaire de goût — il dit ce qu&apos;un objet <b>est</b> et où il vit. Un
              container prend le coin de sa profondeur, un composant celui de la row, et la pilule
              est une forme réservée à quelques objets nommés. Tout ça descend d&apos;un seul
              nombre, et l&apos;écran n&apos;y touche jamais.
            </p>
          </section>

          {/* ══════════ 01 · situation ══════════ */}
          <section className="gdoc-sec set" id="depth">
            <div className="gdoc-sec-head">
              <p className="kicker">01 · La profondeur</p>
              <h2>La profondeur choisit le coin, personne d&apos;autre</h2>
              <p className="muted">Quand chaque écran choisit ses coins, deux cards voisines finissent
              par ne plus se ressembler — et personne ne sait à quel moment ça a dérapé. Quand la
              racine bouge, le container, la card, la row et la marque suivent d&apos;un bloc, leurs marges
              avec eux, et les boutons prennent le coin de la row. Au bout de sa course, la marge du
              container monte avec elle : c&apos;est exactement pour ça qu&apos;elle a une borne.</p>
            </div>
            <div className="gdoc-body">
              <figure className="gd-figure">
                <div className="bench primary">
                  <Dial id="ar-root" label="Racine" min={0} max={ROOT_MAX} step={2} value={root} onChange={setRoot} />
                  <RecordShuttle root={root} />
                </div>
                <figcaption className="gd-caption">
                  panneau r{fmt(s.r[0])} marge {fmt(s.pad[0])} · carte r{fmt(s.r[1])} marge {fmt(s.pad[1])} · ligne r{fmt(s.r[2])} marge {fmt(s.pad[2])} ·
                  marque r{fmt(s.r[3])} · boutons r{fmt(s.rCtl)} = racine ÷ 4 · espaces {fmt(s.gap[0])} · {fmt(s.gap[1])} · {fmt(s.gap[2])} —
                  le coin divise par deux à chaque profondeur, la marge ne descend jamais sous le coin,
                  le coin ne glisse pas avec l&apos;écran
                </figcaption>
              </figure>
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <p>« On ne choisit jamais un coin : la profondeur le choisit, divisé par deux à chaque
                niveau. » Le registre porte quatre coins de profondeur — le container, la card, la row,
                la marque — et le coin du composant, qui est celui de la ligne : le bouton, le champ,
                le sélecteur le prennent tel quel. Une racine, tout descend ; l&apos;écran et la
                densité n&apos;y touchent pas.</p>
                <Rules ids={["a10", "slope", "a2", "a8", "a9"]} />
              </div></details>
            </div>
          </section>

          {/* ══════════ 02 · variation ══════════ */}
          <section className="gdoc-sec set" id="corner">
            <div className="gdoc-sec-head">
              <p className="kicker">02 · Le coin</p>
              <h2>Un coin intérieur épouse celui qui le contient</h2>
              <p className="muted">Deux arrondis identiques séparés par un espace ne sont jamais
              parallèles : dans l&apos;angle, l&apos;écart se creuse de moitié. Tout le monde l&apos;a
              déjà vu sans savoir le nommer — c&apos;est cette petite oreille disgracieuse au coin
              des fenêtres. Ici, le contenu et l&apos;écart ne bougent pas : seul le coin extérieur
              change, jusqu&apos;au moment où l&apos;intérieur redevient parallèle.</p>
            </div>
            <div className="gdoc-body">
              <figure className="gd-figure">
                {/* La scène de nuit (verdict d'Auteur, 7 septembre) : fond noir,
                    et les verdicts par le système — plus une couleur écrite. */}
                <div className="bench black" data-theme="dark">
                  <div className="ar-dials">
                    <Dial id="ar-ri" label="Coin intérieur" min={4} max={36} step={1} value={ri} onChange={setRi} />
                    <Dial id="ar-gap" label="Écart" min={0} max={24} step={1} value={gap} onChange={setGap} />
                  </div>
                  <div className="ar-lab">
                    <div className="ar-corner">
                      <div className="heading"><span className="verdict ko">✗</span><span>extérieur = intérieur</span></div>
                      <Corner Ro={ri} ri={ri} E={gap} ok={false} />
                    </div>
                    <div className="ar-corner">
                      <div className="heading"><span className="verdict good">✓</span><span>extérieur = intérieur + écart</span></div>
                      <Corner Ro={ri + gap} ri={ri} E={gap} ok />
                    </div>
                  </div>
                </div>
                <figcaption className="gd-caption">
                  intérieur {ri} · écart {gap} — extérieur égal, {ri} : l&apos;écart dans la diagonale monte
                  à {fmt(dL)}{gap > 0 ? ` (+${pct} %)` : ""} · extérieur {ri + gap} : il reste {gap} partout
                </figcaption>
              </figure>
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <p>Le fait : deux coins égaux séparés d&apos;un écart <i>e</i> s&apos;éloignent de <i>e</i> × √2
                dans la diagonale. La chaîne ÷ 2 choisit dans la bande ; le labo montre son plancher,
                la concentricité exacte.</p>
                <Rules ids={["a5", "a6"]} />
              </div></details>
            </div>
          </section>

          {/* ══════════ 03 · vocabulaire ══════════ */}
          <section className="gdoc-sec set" id="pill">
            <div className="gdoc-sec-head">
              <p className="kicker">03 · La pilule</p>
              <h2>La pilule est un passeport, pas un cran</h2>
              <p className="muted">Le rayon plein n&apos;a pas de valeur : il sature, c&apos;est tout ou
              rien. Quatre objets y ont droit chez Navette, et la liste est fermée — un cinquième
              frappe à la porte et n&apos;entrera pas, parce qu&apos;un texte qui passe à la ligne
              se transforme en gélule. Le dernier cas n&apos;est pas une faute de forme du tout :
              <b>un bouton a le droit d&apos;être en pilule</b>, Material 3 et Apple en font même
              leur forme par défaut. Ce qui le fait passer pour une puce, c&apos;est l&apos;absence
              de fond plein, pas le rayon.</p>
            </div>
            <div className="gdoc-body">
              <figure className="gd-figure">
                <div className="bench pale">
                  <Board />
                </div>
                <figcaption className="gd-caption">
                  quatre membres, pas un de plus · rayon plein · jamais sur un contenu qui peut passer à la ligne ·
                  un bouton en pilule garde son fond plein
                </figcaption>
              </figure>
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <Rules ids={["a7", "a3", "saturation"]} />
              </div></details>
            </div>
          </section>

          {/* ═══ LE RÉPERTOIRE — une seule section, aux arrondis (8 sept. 2026) :
              dans l'ordre commun aux six pages (verdict d'Auteur, 8 sept.) : les six
              pièges au curseur (#wreck, en h4 : ici rien ne se casse d'un clic, une
              faute d'arrondi ne se voit qu'en mouvement), les règles qui se vérifient
              ailleurs (#invisibles), puis les six coins du registre (#code — un seul
              nombre, six valeurs). ═══ */}
          <section className="gdoc-sec set" id="registry">
            <div className="gdoc-sec-head">
              <p className="kicker">04 · Le registre</p>
              <h2>Un seul nombre, six coins — et six façons de les perdre</h2>
              <p className="muted">Six pièges ordinaires qu&apos;aucun outil ne signale, révélés par leur
              curseur ; les règles qui ne se photographient pas ; et les six coins que la racine
              engendre, lus dans le registre. Les lignes marquées « décision d&apos;Auteur » sont des
              réglages du kit, pas des lois de la forme.</p>
            </div>
            <div className="gdoc-body">
              <div className="doc-piece" id="wreck">
                <div className="doc-piece-head">
                  <h3>Six pièges, révélés par leur curseur</h3>
                  <p className="muted">Une faute d&apos;arrondi ne se voit jamais sur un objet seul et
                  immobile. Elle apparaît quand la racine tourne, quand le texte s&apos;allonge,
                  quand la hauteur baisse — et les deux objets se séparent.</p>
                </div>
                <Bands>
                  {TRAPS.map((p) => (
                    <Band key={p.key} level={4} name={p.name} side={p.side} says={p.says}
                      rules={<Rules ids={p.rules} />}>
                      {p.scene}
                    </Band>
                  ))}
                </Bands>
              </div>

              <div className="doc-piece" id="invisibles">
                <div className="doc-piece-head">
                  <h3>Les règles qui ne se photographient pas</h3>
                  <p className="muted">Elles se vérifient dans le code, sur l&apos;écran allumé, ou
                  nulle part — et alors elles s&apos;assument comme un choix, daté.</p>
                </div>
                <ListRules lines={LIST} />
                <details className="prov"><summary>Règles &amp; sources</summary><div>
                  <Rules ids={["a10", "a2", "a8", "a9", "slope", "a6"]} />
                </div></details>
              </div>

              <div className="doc-piece" id="code">
                <div className="doc-piece-head">
                  <h3>Les six coins</h3>
                  <p className="muted">Chaque valeur est lue dans le registre calculé à la charte,
                  jamais recopiée : si la racine bouge, la table bouge. La sortie Tailwind pointe
                  sur les mêmes variables, et shadcn lit une seule racine, à qui on donne le coin
                  du composant.</p>
                </div>
                <PanelRegistry lines={CODE} />
                <details className="prov"><summary>Règles &amp; sources</summary><div>
                  <Rules ids={["a2", "a8"]} />
                </div></details>
              </div>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
