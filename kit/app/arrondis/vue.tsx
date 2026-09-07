"use client";
import { useState } from "react";
import { RailDoc, useDocSections, type Sommaire } from "../rail";
import { Bandes, Bande, ListeRegles, PanneauRegistre } from "../etages";
import type { LigneListe, LigneCode } from "../etages";
import { chaine, CHARTE, BORNES } from "../../derivation.mjs";
import "./arrondis.css";

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
   · LES TROIS ÉTAGES (04 à 06) — au gabarit commun d'etages.tsx, comme
     Rythme, Typo et Couleur : les six pièges deviennent six bandes qui
     montrent le juste au repos et commettent la faute au clic ; la liste
     des règles qu'aucune image ne prouve ; le registre des six coins.

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
type Entrees = { base?: number; intervalle?: number; racine?: number };
type Socle = { r: number[]; rCtl: number; pad: number[]; gap: number[]; edge: number };
const socle = (e: Entrees): Socle => chaine(e) as Socle;
const RACINE_MAX: number = BORNES.racine[1];

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
function FicheNavette({ racine }: { racine: number }) {
  const s = socle({ racine });
  const style = {
    "--ar-r1": `${s.r[0]}px`, "--ar-r2": `${s.r[1]}px`, "--ar-r3": `${s.r[2]}px`, "--ar-r4": `${s.r[3]}px`,
    "--ar-rctl": `${s.rCtl}px`,
    "--ar-p1": `${s.pad[0]}px`, "--ar-p2": `${s.pad[1]}px`, "--ar-p3": `${s.pad[2]}px`,
    "--ar-g1": `${s.gap[0]}px`, "--ar-g2": `${s.gap[1]}px`, "--ar-g3": `${s.gap[2]}px`, "--ar-g4": `${s.gap[3]}px`,
  } as React.CSSProperties;
  return (
    <div className="ar-tel" style={style} role="img"
      aria-label="Navette, fiche de l'arrêt Place des Tilleuls : un container, une card de départs, trois rows, deux boutons">
      <div className="ar-ecran">
        <div className="ar-fond" aria-hidden="true"><div className="barre" /><div className="barre c" /><div className="plan" /></div>
        <div className="ar-voile" aria-hidden="true" />
        <div className="ar-panneau">
          <div className="poignee" aria-hidden="true" />
          <div>
            <h4>Place des Tilleuls</h4>
            <div className="sous">Arrêt · direction Hôpital Nord</div>
          </div>
          <div className="ar-carte">
            <div className="titre">Prochains départs</div>
            {([["Hôpital Nord", "2 min"], ["Hôpital Nord", "9 min"], ["Gare", "14 min"]] as const).map(([d, t], i) => (
              <div className="ar-ligne" key={i}><span className="ar-marque"><Tram /></span><span className="dest">{d}</span><span className="t">{t}</span></div>
            ))}
          </div>
          <div className="ar-actions">
            <button className="tr-btn premier ar-btn" type="button" tabIndex={-1}>Itinéraire</button>
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
const DESSIN = { k: 3.2, ox: 64, oy: 48, W: 340, H: 260, mesure: 14, mesurePetite: 12, arc: 4, trait: 1.5 };
function Coin({ Ro, ri, E, ok }: { Ro: number; ri: number; E: number; ok: boolean }) {
  const { k, ox, oy, W, H } = DESSIN;
  const Rk = Ro * k, rk = ri * k, Ek = E * k;
  /* Les surfaces du labo suivent le thème : le parent en encre secondaire,
     l'enfant en surface, les mesures en encre / en fond (retour d'Auteur).
     Verdicts : vert = le juste, rouge = la faute — valeurs fixes, les
     jetons danger/success de la charte sont trop sombres sur cette scène. */
  const teinte = ok ? "#4ADE80" : "#F87171";
  const a = ox + Rk - Rk / Math.SQRT2, b = ox + Ek + rk - rk / Math.SQRT2;
  const d = (b - a) * Math.SQRT2 / k;
  const mono = "var(--font-mono)";
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img"
      aria-label={ok ? "Le coin extérieur vaut le coin intérieur plus l'écart : les deux arcs sont parallèles"
                     : "Le coin extérieur porte le même rayon que le coin intérieur : l'écart se creuse dans la diagonale"}>
      <rect x="0" y="0" width={W} height={H} fill="var(--code-bg)" />
      <rect x={ox} y={oy} width="2000" height="2000" rx={Rk} fill="var(--text-secondary)" />
      <rect x={ox + Ek} y={oy + Ek} width="2000" height="2000" rx={rk} fill="var(--surface)" />
      <path d={`M${ox + Rk} ${oy} A ${Rk} ${Rk} 0 0 0 ${ox} ${oy + Rk}`} stroke={teinte} strokeWidth={DESSIN.arc} fill="none" strokeLinecap="round" />
      <line x1={a} y1={oy + (a - ox)} x2={b} y2={oy + (b - ox)} stroke={teinte} strokeWidth={DESSIN.trait} />
      <text x={ox - 10} y={oy + Rk * 0.55 + 5} textAnchor="end" fontSize={DESSIN.mesure} fontWeight="600" fontFamily={mono} fill={teinte}>{Ro}</text>
      <text x={ox + Ek + rk + 6} y={oy + Ek + rk + 5} fontSize={DESSIN.mesure} fontWeight="600" fontFamily={mono} fill="var(--text-primary)">{ri}</text>
      {E > 0 && <text x={W - 10} y={oy + Ek / 2 + 5} textAnchor="end" fontSize={DESSIN.mesurePetite} fontWeight="600" fontFamily={mono} fill="var(--bg)">{E}</text>}
      <text x={(a + b) / 2 + 12} y={oy + ((a + b) / 2 - ox) - 8} fontSize={DESSIN.mesurePetite} fontWeight="600" fontFamily={mono} fill={teinte}>{fmt(d)}</text>
    </svg>
  );
}

/* ── 03 · Les quatre membres de la pilule, et deux recalés ── */
function Planche() {
  const [on, setOn] = useState(true);
  const [onglet, setOnglet] = useState(0);
  return (
    <div className="ar-planche">
      <div className="ar-membre">
        <div className="objet"><span className="ar-pastille" aria-label="Ligne B">B</span><span className="ar-pastille sept" aria-label="Ligne 7">7</span></div>
        <div className="nom">la pastille de ligne</div>
      </div>
      <div className="ar-membre">
        <div className="objet"><span className="ar-avatar" role="img" aria-label="Malik Oyelaran, abonné">MO</span></div>
        <div className="nom">l&apos;avatar de l&apos;abonné</div>
      </div>
      <div className="ar-membre">
        <div className="objet">
          <button className="ar-inter" type="button" role="switch" aria-checked={on} onClick={() => setOn(!on)}>
            <span className="ar-sr">Trajets accessibles</span>
          </button>
          <span className="ar-interlab">Trajets accessibles</span>
        </div>
        <div className="nom">la piste de l&apos;interrupteur</div>
      </div>
      <div className="ar-membre">
        <div className="objet">
          <div className="ar-onglets" role="tablist" aria-label="Sens">
            {["Départs", "Arrivées"].map((t, i) => (
              <button key={t} type="button" role="tab" aria-selected={onglet === i} tabIndex={onglet === i ? 0 : -1} onClick={() => setOnglet(i)}>{t}</button>
            ))}
          </div>
        </div>
        <div className="nom">la piste des onglets</div>
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
      <div className="ar-membre paire">
        <div className="objet">
          <span className="ar-essai">
            {/* Une mise en garde, pas une faute : le bouton doux est permis,
                il est seulement risqué court et mal entouré. */}
            <span className="verdict attention" aria-hidden="true">⚠</span>
            <button className="ar-btn-pilule doux" type="button" tabIndex={-1} aria-disabled="true">Payer</button>
          </span>
          <span className="ar-essai">
            <span className="verdict bon" aria-hidden="true">✓</span>
            <button className="ar-btn-pilule" type="button" tabIndex={-1} aria-disabled="true">Payer</button>
          </span>
        </div>
        <div className="nom">en pilule et sans fond plein, un bouton court se confond avec une puce</div>
      </div>
      <div className="ar-membre refuse" data-intent="statement">
        <div className="objet"><span className="ar-gelule">Correspondance ligne B vers Hôpital Nord</span></div>
        <div className="nom">plusieurs lignes — une gélule</div>
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
const REGLES: { id: string; nom: string; titre: string; enonce: string; src: Src[] }[] = [
  { id: "a1", nom: "1", titre: "Le coin ne change jamais à l'état",
    enonce: "Propriété d'identité, pas d'état : aucun sélecteur de survol, focus, erreur ou sélection ne modifie un coin déclaré au repos.",
    src: [{ t: "RADIUS-UX 1.3.0 — R02", h: "#" }] },
  { id: "a2", nom: "2", titre: "Tout coin vient de la chaîne",
    enonce: "Chaque coin résout un cran de la chaîne — container, card, row, marque, ou le coin du composant ; aucune valeur en dur. Une racine, et tout descend.",
    src: [{ t: "RADIUS-UX 1.3.0 — R03", h: "#" }, DECISIONS] },
  { id: "a3", nom: "3", titre: "Jamais un pourcentage, jamais un calcul",
    enonce: "Le coin est un cran choisi, jamais dérivé d'un pourcentage ni d'une fraction de la hauteur — la dérive proportionnelle fabrique des pilules accidentelles.",
    src: [{ t: "RADIUS-UX 1.3.0 — R04", h: "#" }] },
  { id: "a4", nom: "4", titre: "Même taille, même courbure",
    enonce: "Deux contrôles de même taille voisins dans une même composition partagent le même cran — celui du composant. Dépend du registre des composants typés.",
    src: [{ t: "RADIUS-UX 1.3.0 — R05", h: "#" }] },
  { id: "a5", nom: "5", titre: "Les coins imbriqués sont concentriques",
    enonce: "Un coin intérieur n'est jamais plus rond que le coin extérieur qui le contient ; il vit dans la bande extérieur − écart ≤ intérieur ≤ extérieur. La concentricité est le plancher, le coin du parent le plafond ; la chaîne ÷ 2 choisit dans la bande. La contrainte s'affaiblit avec la distance : loin du bord, un objet flottant reprend son coin propre.",
    src: [{ t: "RADIUS-UX 1.3.0 — R06", h: "#" }, { t: "W3C — CSS Backgrounds and Borders, corner shaping", h: "https://www.w3.org/TR/css-backgrounds-3/#corner-shaping" }, { t: "Sibyl — la théorie, v2, §1", h: "#" }, DECISIONS] },
  { id: "a6", nom: "6", titre: "L'anneau de focus, concentrique inversé",
    enonce: "Posé à l'extérieur d'un composant, l'anneau prend le coin du composant augmenté de son écart — ce que fait outline-offset tout seul.",
    src: [{ t: "RADIUS-UX 1.3.0 — R07", h: "#" }, { t: "WCAG 2.4.11 — Focus Appearance", h: "https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html" }] },
  { id: "a7", nom: "7", titre: "La pilule est une liste fermée",
    enonce: "Le rayon plein est réservé à une liste énumérée — badge/pastille, avatar, piste de l'interrupteur, piste des onglets-pilule — et jamais sur un contenu qui peut passer à la ligne. Toute entrée nouvelle est un arbitrage d'Auteur. Un bouton, lui, n'est pas interdit de pilule : personne ne l'interdit, Material 3 en fait même la forme par défaut de ses boutons et Apple recommande la capsule. Il la porte alors AVEC son fond plein — c'est l'absence de conteneur, pas le rayon, qui le fait passer pour une puce, et d'autant plus s'il est court et voisin d'éléments qui lui ressemblent. Tensions de source : chez Atlassian les badges prennent le petit coin ; chez Fluent 2 la pilule désigne les tags et le rectangle les boutons — exactement l'inverse de Material 3. La liste d'ici est un parti pris d'identité, pas une vérité du métier.",
    src: [{ t: "RADIUS-UX 1.3.0 — R08", h: "#" }, { t: "Atlassian — Badge", h: "https://atlassian.design/components/badge/" },
      { t: "Material 3 — Buttons (« Consider using a filled or tonal button instead »)", h: "https://m3.material.io/components/buttons/guidelines" },
      { t: "Apple HIG — Buttons (« prefer circular or capsule-shape buttons »)", h: "https://developer.apple.com/design/human-interface-guidelines/buttons" },
      { t: "Fluent 2 — Shapes (la pilule pour les tags, le rectangle pour les boutons)", h: "https://fluent2.microsoft.design/shapes" }] },
  { id: "a8", nom: "8", titre: "Un jeton déclare ses consommateurs",
    enonce: "Chaque jeton de coin porte au moins un consommateur nommé : le container, la card, la row, la marque, le composant, la pilule.",
    src: [{ t: "RADIUS-UX 1.3.0 — R09", h: "#" }] },
  { id: "a9", nom: "9", titre: "L'angle droit n'a pas de jeton",
    enonce: "Rien n'est carré par défaut dans ce système — décision d'identité. Une racine nulle reste possible par arbitrage journalisé (intention « Technique ») ; ce n'est pas un cran, c'est une racine. La case à cocher reste anguleuse : exception dite.",
    src: [{ t: "RADIUS-UX 1.3.0 — R10", h: "#" }, { t: "Sibyl — la théorie, v2, §7", h: "#" }, DECISIONS] },
  { id: "a10", nom: "10", titre: "Conteneur ou composant, la question qui décide tout",
    enonce: "Un container (card, encart, fenêtre superposée, liste flottante, toast) prend le cran de sa profondeur, jamais de sa taille ; un composant prend le coin de la row — la racine divisée par quatre — qui suit la racine du produit et ne suit ni l'écran ni la densité ; la pilule est la liste fermée de la règle 7. Ni l'importance, ni l'état, ni le goût de l'écran n'entrent dans le choix.",
    src: [{ t: "RADIUS-UX 1.3.0 — R12", h: "#" }, { t: "Sibyl — la théorie, v2, §2 et §8", h: "#" }, DECISIONS] },
  { id: "pente", nom: "pente", titre: "Marge et coin, même pente",
    enonce: "La marge d'une surface ne descend jamais sous son coin : quand la racine grandit, la marge du container la rattrape et monte avec elle. C'est la seule façon dont un coin touche à un espace.",
    src: [{ t: "Relevé d'application, 24 août 2026", h: "#" }, { t: "Sibyl — la théorie, v2, §1 « dégagement »", h: "#" }, DECISIONS] },
  { id: "degagement", nom: "candidate", titre: "Le dégagement d'angle",
    enonce: "Marge intérieure ≥ 0,293 × coin, sinon le contenu entre dans l'arc. Seule raison légitime de gonfler une marge avec l'arrondi, en largeur uniquement.",
    src: [{ t: "Sibyl — la théorie, v2, §1", h: "#" }, { t: "Moteur des neuf invariants — i3", h: "#" }] },
  { id: "saturation", nom: "candidate", titre: "La saturation",
    enonce: "Un coin ne dépasse jamais la moitié du petit côté ; au-delà, il s'écrase et la surface devient une pilule sans l'avoir demandé. La racine elle-même est bornée à 38 : au-delà, la marge qui suit le coin change l'écran — le panneau n'a plus de place pour son contenu.",
    src: [{ t: "Sibyl — la théorie, v2, §1", h: "#" }, { t: "Moteur des neuf invariants — i4", h: "#" }, DECISIONS] },
];
function Regles({ ids }: { ids: string[] }) {
  return (
    <div style={{ display: "grid", gap: "var(--gap-1-block)" }}>
      {ids.map((id) => REGLES.find((r) => r.id === id)!).map((r) => (
        <div key={r.id} style={{ display: "grid", gap: "var(--gap-3-block)", maxWidth: "var(--measure)" }}>
          <b style={{ color: "var(--text-primary)" }}><span className="badge">{r.nom === "candidate" ? "candidate" : r.nom === "pente" ? "pente" : `règle ${r.nom}`}</span> {r.titre}</b>
          <span>{r.enonce}</span>
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
function Duo({ juste, faux, ditJuste, ditFaux }: {
  juste: React.ReactNode; faux: React.ReactNode; ditJuste: string; ditFaux: string;
}) {
  return (
    <div className="ar-duo">
      <div className="ar-duo-un">
        {juste}
        <span className="mono ar-duo-dit">{ditJuste}</span>
      </div>
      <div className="ar-duo-un" data-intent="statement">
        {faux}
        <span className="mono ar-duo-dit ko">{ditFaux}</span>
      </div>
    </div>
  );
}

/* 1 · La valeur en dur — la racine bouge, l'une suit, l'autre reste. */
const DUR = 10; /* hors chaîne : la valeur écrite à la main, le sujet de la démonstration */
function PiegeDur() {
  const [r, setR] = useState<number>(CHARTE.racine);
  const s = socle({ racine: r });
  return (
    <div className="ar-scene">
      <Dial id="ar-p-dur" label="La racine du produit" min={0} max={RACINE_MAX} step={2} value={r} onChange={setR} />
      <Duo
        juste={<span className="ar-obj ar-obj-boite" style={{ borderRadius: `${s.r[1]}px` }} />}
        faux={<span className="ar-obj ar-obj-boite" style={{ borderRadius: `${DUR}px` }} />}
        ditJuste={`le cran de la card — ${fmt(s.r[1])} px`}
        ditFaux={`${DUR} px, écrits à la main`}
      />
    </div>
  );
}

/* 2 · Le pourcentage — le texte s'allonge, la faute apparaît. */
const MOTS = ["Nouveau", "sur", "votre", "ligne", "de", "ce", "matin"];
function PiegePct() {
  const [n, setN] = useState(2);
  const texte = MOTS.slice(0, n).join(" ");
  return (
    <div className="ar-scene">
      <Dial id="ar-p-pct" label="La longueur du texte" min={1} max={MOTS.length} step={1} value={n} onChange={setN} />
      <Duo
        juste={<span className="ar-obj ar-obj-etiq">{texte}</span>}
        faux={<span className="ar-obj ar-obj-etiq" style={{ borderRadius: "50%" }}>{texte}</span>}
        ditJuste="le cran du composant"
        ditFaux="50 % de la hauteur"
      />
    </div>
  );
}

/* 3 · Les voisins dépareillés — deux rangées, l'œil tranche seul. */
function Rangee({ coinBouton }: { coinBouton: string }) {
  return (
    <span className="ar-rangee">
      <span className="ar-obj ar-obj-champ">prenom@exemple.fr</span>
      <span className="ar-obj ar-obj-bouton" style={{ borderRadius: coinBouton }}>Envoyer</span>
    </span>
  );
}
function PiegeVoisins() {
  return (
    <div className="ar-scene">
      <Duo
        juste={<Rangee coinBouton="var(--r-ctl)" />}
        faux={<Rangee coinBouton="var(--r-2)" />}
        ditJuste="le même cran pour les deux"
        ditFaux="deux crans dans la même rangée"
      />
    </div>
  );
}

/* 4 · Le survol qui arrondit — la faute, c'est vous qui la provoquez. */
function PiegeEtat() {
  return (
    <div className="ar-scene">
      <Duo
        juste={<button type="button" className="ar-obj ar-obj-bouton">Enregistrer</button>}
        faux={<button type="button" className="ar-obj ar-obj-bouton ar-obj-mou">Enregistrer</button>}
        ditJuste="survolez : le coin ne bouge pas"
        ditFaux="survolez : le coin change"
      />
    </div>
  );
}

/* 5 · Le coin saturé — un seuil qu'on franchit sans le décider. */
const COIN_SAT = 24; /* hors chaîne : le coin de la démonstration, celui qui va saturer */
function PiegeSature() {
  const [h, setH] = useState(56);
  const sature = COIN_SAT > h / 2;
  return (
    <div className="ar-scene">
      <Dial id="ar-p-sat" label="La hauteur de la boîte" min={20} max={72} step={2} value={h} onChange={setH} />
      <Duo
        juste={<span className="ar-obj ar-obj-boite" style={{ height: `${h}px`, borderRadius: "var(--r-ctl)" }} />}
        faux={<span className="ar-obj ar-obj-boite" style={{ height: `${h}px`, borderRadius: `${COIN_SAT}px` }} />}
        ditJuste="le cran du composant"
        ditFaux={`coin ${COIN_SAT} sur ${h} de haut`}
      />
      {/* Le verdict se LIT sur la scène : le coin sature dès qu'il dépasse la
          moitié du petit côté. Il n'est pas décrété par un bouton. */}
      <span className={`badge ${sature ? "ko" : "bon"}`}>
        {sature ? "le coin a dépassé la moitié de la hauteur — la boîte est devenue une pilule" : "le coin tient sous la moitié de la hauteur"}
      </span>
    </div>
  );
}

/* 6 · Le contenu dans l'arc — la courbe mange le texte. */
function PiegeArc() {
  return (
    <div className="ar-scene">
      <Duo
        juste={<span className="ar-obj ar-obj-arc">14:02</span>}
        faux={<span className="ar-obj ar-obj-arc ar-obj-serre">14:02</span>}
        ditJuste="la marge respecte la courbe"
        ditFaux="une marge d'un pixel pour un coin de douze"
      />
    </div>
  );
}

const PIEGES: { cle: string; nom: string; cote: string; dit: string; regles: string[]; scene: React.ReactNode }[] = [
  { cle: "dur", nom: "La valeur en dur", cote: "la racine bouge, elle non",
    dit: "Un coin qui n'est pas un cran ne bouge pas quand la racine bouge. Il a l'air juste aujourd'hui, et il est déjà faux demain — le jour où le produit change de racine, lui seul restera en arrière. Tournez la racine et regardez-les se séparer.",
    regles: ["a2", "a8"], scene: <PiegeDur /> },
  { cle: "pct", nom: "Le pourcentage", cote: "la faute dort jusqu'au contenu",
    dit: "Un coin dérivé de la hauteur ne se voit pas tant que le texte est court. Allongez-le : la forme se met à fondre toute seule, et personne n'aura vu venir la gélule.",
    regles: ["a3"], scene: <PiegePct /> },
  { cle: "vois", nom: "Les voisins dépareillés", cote: "deux crans dans une rangée",
    dit: "Un champ et un bouton de même taille, côte à côte, avec deux coins différents. L'œil lit deux systèmes dans la même rangée, et personne ne sait dire lequel est le bon.",
    regles: ["a4", "a10"], scene: <PiegeVoisins /> },
  { cle: "etat", nom: "Le survol qui arrondit", cote: "le coin dit l'identité",
    dit: "La couleur, l'ombre et l'anneau sont là pour dire l'état. Le coin, lui, dit ce que l'objet EST — s'il change sous la main, l'objet change d'identité en cours de route. Passez la souris sur les deux boutons.",
    regles: ["a1"], scene: <PiegeEtat /> },
  { cle: "sat", nom: "Le coin saturé", cote: "un seuil, pas une pente",
    dit: "Au-delà de la moitié du petit côté, le coin s'écrase et la surface devient une pilule sans l'avoir demandé. Réduisez la hauteur : vous verrez le moment exact où ça bascule.",
    regles: ["saturation", "a7"], scene: <PiegeSature /> },
  { cle: "arc", nom: "Le contenu dans l'arc", cote: "marge ≥ trois dixièmes du coin",
    dit: "La marge intérieure vaut au moins trois dixièmes du coin, sinon le texte entre dans la courbe. C'est la seule raison légitime de gonfler une marge à cause d'un arrondi.",
    regles: ["degagement", "pente"], scene: <PiegeArc /> },
];

/* ── Étage « en liste » — ce qu'aucune image ne prouve. ── */
const LISTE: LigneListe[] = [
  { nom: "Conteneur ou composant, la question qui décide tout",
    dit: "Un conteneur prend le cran de sa profondeur, jamais celui de sa taille ; un composant prend le coin de la ligne. Ni l'importance, ni l'état, ni le goût de l'écran n'entrent dans le choix.",
    ou: "dans le code" },
  { nom: "Tout coin vient de la chaîne",
    dit: "Chaque coin résout un cran — le container, la card, la row, la marque, ou le coin du composant. Aucune valeur en dur : une racine, et tout descend.",
    ou: "dans le code" },
  { nom: "Un jeton déclare ses consommateurs",
    dit: "Chaque jeton de coin porte au moins un consommateur nommé. Un cran que rien ne consomme sort du registre.",
    ou: "dans le code" },
  { nom: "L'angle droit n'a pas de jeton",
    dit: "Rien n'est carré par défaut dans ce système — c'est une décision d'identité. Une racine nulle reste possible par arbitrage écrit ; ce n'est pas un cran, c'est une racine. La case à cocher reste anguleuse : exception dite.",
    ou: "nulle part — décision d'Auteur", ton: "auteur" },
  { nom: "Les coins ne suivent ni l'écran ni la densité",
    dit: "Un coin est réglé par la racine du produit. Les marges, les espaces, le texte et la cible glissent avec la largeur ; les coins, non — un coin qui change avec l'écran change la marque.",
    ou: "sur l'écran allumé", ton: "rendu" },
  { nom: "Marge et coin, même pente",
    dit: "La marge d'une surface ne descend jamais sous son coin : quand la racine grandit, la marge du container la rattrape et monte avec elle. C'est la seule façon dont un coin touche à un espace.",
    ou: "dans le code" },
  { nom: "L'anneau de focus est concentrique, à l'envers",
    dit: "Posé à l'extérieur d'un composant, l'anneau prend le coin du composant augmenté de son écart — ce que le navigateur fait tout seul quand on le laisse faire.",
    ou: "sur l'écran allumé", ton: "rendu" },
];

/* ── Étage « dans le code » — les valeurs sont LUES dans le registre calculé
   à la charte, jamais recopiées : si la racine bouge, ce tableau bouge. ── */
const REGISTRE = socle({});
const CODE: LigneCode[] = [
  { regle: "Le container",
    ecrit: <><span className="cs-kw">border-radius</span>: <span className="cs-var">var(--r-1)</span></>,
    produit: fmt(REGISTRE.r[0]) + " px", note: "la racine du produit — le cran le plus haut de la chaîne" },
  { regle: "La card, dans le container",
    ecrit: <><span className="cs-kw">border-radius</span>: <span className="cs-var">var(--r-2)</span></>,
    produit: fmt(REGISTRE.r[1]) + " px", note: "la racine divisée par deux" },
  { regle: "La row, dans la card",
    ecrit: <><span className="cs-kw">border-radius</span>: <span className="cs-var">var(--r-3)</span></>,
    produit: fmt(REGISTRE.r[2]) + " px", note: "encore divisée par deux — un enfant n'est jamais plus rond que son parent" },
  { regle: "Un bouton, un champ, un sélecteur",
    ecrit: <><span className="cs-kw">border-radius</span>: <span className="cs-var">var(--r-ctl)</span></>,
    produit: fmt(REGISTRE.rCtl) + " px", note: "le coin de la row : un composant ne prend pas le cran de sa taille" },
  { regle: "La marque, la vignette, la puce", repli: true,
    ecrit: <><span className="cs-kw">border-radius</span>: <span className="cs-var">var(--r-4)</span></>,
    produit: fmt(REGISTRE.r[3]) + " px", note: "le dernier cran de la chaîne" },
  { regle: "La pastille, l'avatar, l'interrupteur", repli: true,
    ecrit: <><span className="cs-kw">border-radius</span>: <span className="cs-var">var(--r-pill)</span></>,
    produit: "plein", note: "une forme réservée à une liste fermée, jamais un cran de la chaîne" },
  { regle: "La marge qui va avec le coin", repli: true,
    ecrit: <><span className="cs-kw">padding</span>: <span className="cs-var">var(--pad-2-block) var(--pad-2-inline)</span></>,
    produit: fmt(REGISTRE.pad[1]) + " px", note: "elle ne descend jamais sous le coin de sa surface" },
  { regle: "L'angle droit", repli: true,
    ecrit: <><span className="cs-kw">border-radius</span>: <span className="cs-var">0</span></>,
    produit: "aucun jeton", note: "rien n'est carré par défaut ici — une racine nulle est une racine, pas un cran" },
  { regle: "La racine du produit", repli: true,
    ecrit: <><span className="cs-kw">--r-1</span>: <span className="cs-var">{fmt(CHARTE.racine)}px</span></>,
    produit: "toute la chaîne se recalcule", note: "un seul nombre engendre les six coins ; il est borné à " + fmt(RACINE_MAX) },
];

const SOMMAIRE: Sommaire = [
  ["profondeur", "01", "La profondeur"],
  ["coin", "02", "Le coin"],
  ["pilule", "03", "La pilule"],
  ["casser", "04", "Les règles qu'on peut casser"],
  ["invisibles", "05", "Les règles qu'on ne peut pas montrer"],
  ["code", "06", "Dans le code"],
];

export default function Vue() {
  const [racine, setRacine] = useState<number>(CHARTE.racine);
  const [ri, setRi] = useState(12);
  const [ecart, setEcart] = useState(12);
  const actifId = useDocSections("profondeur");
  const s = socle({ racine });
  const dL = ecart * Math.SQRT2, pct = ecart > 0 ? Math.round((dL / ecart - 1) * 100) : 0;

  return (
    <div className="gdoc-fond">
      <div className="gdoc">
        <RailDoc page="arrondis" titre="Fondation · Arrondis" sommaire={SOMMAIRE} actifId={actifId} pied="Chaîne ÷ 2 depuis la racine · composant = racine ÷ 4" />

        <main className="gdoc-contenu" id="contenu">

          <section className="gdoc-heros">
            <p className="kicker">Les arrondis</p>
            <h1>Un seul nombre dessine tous les coins de cette page<span className="point" aria-hidden="true" /></h1>
            <p className="chapo">
              Demandez à trois personnes d&apos;arrondir le même bouton : vous aurez
              trois valeurs, et aucune ne saura dire pourquoi la sienne. Le coin n&apos;est pourtant
              pas une affaire de goût — il dit ce qu&apos;un objet <b>est</b> et où il vit. Un
              container prend le coin de sa profondeur, un composant celui de la row, et la pilule
              est une forme réservée à quelques objets nommés. Tout ça descend d&apos;un seul
              nombre, et l&apos;écran n&apos;y touche jamais.
            </p>
          </section>

          {/* ══════════ 01 · situation ══════════ */}
          <section className="gdoc-sec pose" id="profondeur">
            <div className="gdoc-sec-tete">
              <p className="kicker">01 · La profondeur</p>
              <h2>La profondeur choisit le coin, personne d&apos;autre</h2>
              <p className="sourd">Quand chaque écran choisit ses coins, deux cards voisines finissent
              par ne plus se ressembler — et personne ne sait à quel moment ça a dérapé. Tournez la
              racine : le container, la card, la row et la marque suivent d&apos;un bloc, leurs marges
              avec eux, et les boutons prennent le coin de la row. Poussez-la au bout, et vous verrez
              la marge du container monter avec elle : c&apos;est exactement pour ça qu&apos;elle a
              une borne.</p>
            </div>
            <div className="gdoc-corps">
              <figure className="gd-figure">
                <div className="banc primaire">
                  <Dial id="ar-racine" label="Racine" min={0} max={RACINE_MAX} step={2} value={racine} onChange={setRacine} />
                  <FicheNavette racine={racine} />
                </div>
                <figcaption className="gd-legende">
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
                <Regles ids={["a10", "pente", "a2", "a8", "a9"]} />
              </div></details>
            </div>
          </section>

          {/* ══════════ 02 · variation ══════════ */}
          <section className="gdoc-sec pose" id="coin">
            <div className="gdoc-sec-tete">
              <p className="kicker">02 · Le coin</p>
              <h2>Un coin intérieur épouse celui qui le contient</h2>
              <p className="sourd">Deux arrondis identiques séparés par un espace ne sont jamais
              parallèles : dans l&apos;angle, l&apos;écart se creuse de moitié. Vous l&apos;avez
              déjà vu sans savoir le nommer — c&apos;est cette petite oreille disgracieuse au coin
              des fenêtres. Ici, le contenu et l&apos;écart ne bougent pas : seul le coin extérieur
              change, et vous voyez le moment où l&apos;intérieur redevient parallèle.</p>
            </div>
            <div className="gdoc-corps">
              <figure className="gd-figure">
                <div className="banc sombre">
                  <div className="ar-dials">
                    <Dial id="ar-ri" label="Coin intérieur" min={4} max={36} step={1} value={ri} onChange={setRi} />
                    <Dial id="ar-ecart" label="Écart" min={0} max={24} step={1} value={ecart} onChange={setEcart} />
                  </div>
                  <div className="ar-labo">
                    <div className="ar-coin">
                      <div className="titre"><span className="verdict ko">✗</span><span>extérieur = intérieur</span></div>
                      <Coin Ro={ri} ri={ri} E={ecart} ok={false} />
                    </div>
                    <div className="ar-coin">
                      <div className="titre"><span className="verdict bon">✓</span><span>extérieur = intérieur + écart</span></div>
                      <Coin Ro={ri + ecart} ri={ri} E={ecart} ok />
                    </div>
                  </div>
                </div>
                <figcaption className="gd-legende">
                  intérieur {ri} · écart {ecart} — à gauche, extérieur {ri} : l&apos;écart dans la diagonale monte
                  à {fmt(dL)}{ecart > 0 ? ` (+${pct} %)` : ""} · à droite, extérieur {ri + ecart} : il reste {ecart} partout
                </figcaption>
              </figure>
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <p>Le fait : deux coins égaux séparés d&apos;un écart <i>e</i> s&apos;éloignent de <i>e</i> × √2
                dans la diagonale. La chaîne ÷ 2 choisit dans la bande ; le labo montre son plancher,
                la concentricité exacte.</p>
                <Regles ids={["a5", "a6"]} />
              </div></details>
            </div>
          </section>

          {/* ══════════ 03 · vocabulaire ══════════ */}
          <section className="gdoc-sec pose" id="pilule">
            <div className="gdoc-sec-tete">
              <p className="kicker">03 · La pilule</p>
              <h2>La pilule est un passeport, pas un cran</h2>
              <p className="sourd">Le rayon plein n&apos;a pas de valeur : il sature, c&apos;est tout ou
              rien. Quatre objets y ont droit chez Navette, et la liste est fermée — un cinquième
              frappe à la porte et n&apos;entrera pas, parce qu&apos;un texte qui passe à la ligne
              se transforme en gélule. Le dernier cas n&apos;est pas une faute de forme du tout :
              <b>un bouton a le droit d&apos;être en pilule</b>, Material 3 et Apple en font même
              leur forme par défaut. Ce qui le fait passer pour une puce, c&apos;est l&apos;absence
              de fond plein, pas le rayon.</p>
            </div>
            <div className="gdoc-corps">
              <figure className="gd-figure">
                <div className="banc pale">
                  <Planche />
                </div>
                <figcaption className="gd-legende">
                  quatre membres, pas un de plus · rayon plein · jamais sur un contenu qui peut passer à la ligne ·
                  un bouton en pilule garde son fond plein
                </figcaption>
              </figure>
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <Regles ids={["a7", "a3", "saturation"]} />
              </div></details>
            </div>
          </section>

          {/* ══════════ 04 · répertoire ══════════ */}
          {/* ── Les trois étages du dessous, au gabarit commun (etages.tsx) ── */}
          <section className="gdoc-sec pose" id="casser">
            <div className="gdoc-sec-tete">
              <p className="kicker">04 · Les règles qu&apos;on peut casser</p>
              <h2>Voyez ce qui se passe quand la règle saute</h2>
              <p className="sourd">Six pièges ordinaires, et pas un seul ne déclenche d&apos;erreur
              nulle part — c&apos;est ce qui les rend coûteux. Ici, rien ne se
              casse d&apos;un clic : une faute d&apos;arrondi ne se voit jamais sur un objet seul et
              immobile. Ce sont les curseurs qui la révèlent — tournez la racine, allongez le texte,
              baissez la hauteur, et regardez les deux objets se séparer.</p>
            </div>
            <div className="gdoc-corps">
              <Bandes>
                {PIEGES.map((p) => (
                  <Bande key={p.cle} nom={p.nom} cote={p.cote} dit={p.dit}
                    regles={<Regles ids={p.regles} />}>
                    {p.scene}
                  </Bande>
                ))}
              </Bandes>
            </div>
          </section>

          <section className="gdoc-sec pose" id="invisibles">
            <div className="gdoc-sec-tete">
              <p className="kicker">05 · Les règles qu&apos;on ne peut pas montrer</p>
              <h2>Elles se vérifient ailleurs — et on vous dit où</h2>
              <p className="sourd">Certaines règles ne se photographient pas. Elles se vérifient
              dans le code, à l&apos;écran allumé, ou nulle part du tout.</p>
            </div>
            <div className="gdoc-corps">
              <ListeRegles lignes={LISTE} />
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <Regles ids={["a10", "a2", "a8", "a9", "pente", "a6"]} />
              </div></details>
            </div>
          </section>

          <section className="gdoc-sec pose" id="code">
            <div className="gdoc-sec-tete">
              <p className="kicker">06 · Dans le code</p>
              <h2>Le même système, dans votre stack</h2>
            </div>
            <div className="gdoc-corps">
              <PanneauRegistre lignes={CODE} />
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <p><b>Ce qui remplace l&apos;extrait.</b> La page proposait un composant prêt à
                coller, avec une bascule HTML / React / Angular. On l&apos;a retiré : un extrait
                vieillit, et le jour où le composant bouge il se met à mentir sans prévenir. Le
                jeton, lui, reste vrai. Ce qui fait foi ici, c&apos;est <b>la règle et le
                jeton</b> — pas le code. La sortie Tailwind pointe sur les mêmes variables, et
                shadcn lit une seule racine, à qui on donne le coin du composant.</p>
                <p><b>Ce qui a quitté cette page.</b> Un sélecteur proposait de rejouer toute la
                chaîne selon six types de produit. Il réglait la même chose que les trois
                densités de la page Rythme — la base — et deux boutons qui règlent la même chose
                à deux endroits différents perdent le lecteur. Le sujet « on peut régler le
                système pour un autre produit » appartient au moteur, pas aux arrondis.</p>
                <Regles ids={["a2", "a8"]} />
              </div></details>
            </div>
          </section>

          <footer className="gd-pied">
            <span>Cette page obéit aux règles qu&apos;elle raconte</span>
            <span>Un seul nombre, six coins · Navette est une application fictive</span>
          </footer>

        </main>
      </div>
    </div>
  );
}
