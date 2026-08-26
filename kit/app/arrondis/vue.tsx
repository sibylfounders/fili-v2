"use client";
import { useState } from "react";
import { RailDoc, useDocSections, type Sommaire } from "../rail";
import { PanneauCode } from "../apercu";
import { useAdaptation } from "../adaptation";
import { chaine, INTENTIONS, CHARTE, BORNES } from "../../derivation.mjs";
import "./arrondis.css";

/* ═══════════════════════════════════════════════════════════════════════
   PAGE ARRONDIS — gabarit « documentaire nu », même squelette que la page
   Rythme (pièce de référence kit-rythme-nu.html, verdict PARFAIT).
   Pièce libre jugée par l'Auteur le 25 août 2026 (« très mature »), puis
   versée ici : claude/livrables/kit-arrondis-nu.html. Migrée sur le
   registre unique le 25 août 2026 (les huit décisions, séance sur pièce).

   Deux étages (formule de contenu du 24 août) :
   · trois preuves mises en scène, chacune de nature différente et sur son
     propre objet — la fiche d'arrêt de Navette branchée sur la racine
     (situation), le labo du coin (variation), la liste fermée de la
     pilule (vocabulaire) ;
   · le répertoire — la chaîne selon l'intention, les pièges, les règles.

   Un geste de couleur par écran (CG3) : le point du titre, la scène verte
   de la première preuve ; la scène sombre du labo porte le vert et le
   rouge comme VERDICTS (décision d'Auteur, 25 août), pas comme décor.

   La famille des coins, telle que le registre la porte (décisions 2 et 3) :
   · la coque porte la racine (16 à la charte), ÷ 2 par niveau : coque,
     carte, ligne, marque — un conteneur prend le cran de sa PROFONDEUR,
     jamais de sa taille ;
   · la marge d'une surface ne descend jamais sous son coin ;
   · un composant prend le coin de la ligne : racine ÷ 4 (4 à la charte) —
     réglé par la racine du produit, jamais par l'écran ni la densité ;
   · la racine est bornée à 38 ; les coins ne glissent pas avec l'écran ;
   · la pilule est une forme réservée à une liste fermée.
   Les démos ne recopient aucune table : elles appellent chaine() du moteur
   (derivation.mjs) avec la racine du curseur ou l'intention choisie, et
   posent le résultat en variables --ar-* ; le chrome de la page, lui,
   consomme le registre.
   ═══════════════════════════════════════════════════════════════════════ */

const r1 = (v: number) => Math.round(v * 10) / 10;
const fmt = (v: number) => String(r1(v)).replace(".", ",");

/* Le socle de la chaîne pour des décisions d'entrée — typé localement,
   le moteur est du JavaScript. */
type Entrees = { base?: number; intervalle?: number; racine?: number };
type Socle = { r: number[]; rCtl: number; pad: number[]; gap: number[]; edge: number };
const socle = (e: Entrees): Socle => chaine(e) as Socle;
type Intention = { nom: string; base: number; intervalle: number; racine: number; note: string };
const INTENTS = INTENTIONS as Intention[];
const RACINE_MAX: number = BORNES.racine[1];

/* ── 01 · La fiche d'arrêt de Navette — un seul nombre, toute la chaîne.
   Panneau, carte, ligne, marque : coin ÷ 2 par profondeur ; marge de
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
      aria-label="Navette, fiche de l'arrêt Place des Tilleuls : un panneau, une carte de départs, trois lignes, deux boutons">
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
      {/* Les deux recalés portent une faute déclarée : intent="statement" */}
      <div className="ar-membre refuse" data-intent="statement">
        <div className="objet"><button className="ar-btn-pilule" type="button" tabIndex={-1} aria-disabled="true">Acheter un ticket</button></div>
        <div className="nom">un bouton — pas dans la liste</div>
      </div>
      <div className="ar-membre refuse" data-intent="statement">
        <div className="objet"><span className="ar-gelule">Correspondance ligne B vers Hôpital Nord</span></div>
        <div className="nom">deux lignes — une gélule</div>
      </div>
    </div>
  );
}

/* ── 04 · La chaîne selon l'intention — les préréglages du moteur, une
   seule table pour tout le kit (INTENTIONS), calculée par chaine(). ── */
function Chaine({ i }: { i: number }) {
  const t = INTENTS[i];
  const s = socle({ base: t.base, intervalle: t.intervalle, racine: t.racine });
  const lignes: [number, string, string][] = [
    [0, "le panneau, la fenêtre, le toast", "coque · la racine"],
    [1, "la carte dans le panneau", "carte · profondeur 2"],
    [2, "la ligne dans la carte", "ligne · profondeur 3"],
    [3, "la marque, la vignette, la puce", "marque · profondeur 4"],
  ];
  return (
    <div style={{ display: "grid", gap: "var(--gap-2-block)" }}>
      <div style={{ overflowX: "auto" }}>
        <table className="tableau ar-table">
          <thead><tr><th>Objet</th><th>Famille</th><th>Coin</th><th>Marge</th></tr></thead>
          <tbody>
            {lignes.map(([k, objet, famille]) => (
              <tr key={k}>
                <td><span className="ar-ex" style={{ borderTopLeftRadius: `${s.r[k]}px` }} />{objet}</td>
                <td>{famille}</td>
                <td className="mono">{fmt(s.r[k])}</td>
                <td className="mono">{k < 3 ? fmt(s.pad[k]) : "—"}</td>
              </tr>
            ))}
            <tr><td><span className="ar-ex" style={{ borderTopLeftRadius: `${s.rCtl}px` }} />bouton, champ, sélecteur</td><td>composant · le coin de la ligne</td><td className="mono">{fmt(s.rCtl)}</td><td className="mono">{fmt(s.pad[2])}</td></tr>
            <tr><td><span className="ar-ex" style={{ borderTopLeftRadius: "var(--r-pill)" }} />pastille, avatar, interrupteur, onglets</td><td>pilule · liste fermée</td><td className="mono">plein</td><td className="mono">—</td></tr>
            <tr><td><span className="ar-ex" />l&apos;angle droit</td><td>absent de l&apos;échelle</td><td className="mono">—</td><td className="mono">—</td></tr>
          </tbody>
        </table>
      </div>
      <span className="gd-legende">
        {t.nom} — base {t.base} · racine {t.racine} · intervalle {t.note} : coin ÷ 2 par profondeur · marge ÷ intervalle
        par profondeur, jamais sous le coin · composant = racine ÷ 4 · le coin ne glisse pas avec l&apos;écran
      </span>
    </div>
  );
}

/* ── 05 · L'adaptation — le même système, dans votre stack. Le normatif
   est la règle et le jeton : quatre coins de profondeur (r-1 … r-4), le
   coin du composant (r-ctl) et la pilule (r-pill) ; React, Angular ou
   HTML n'en sont que des consommateurs. ── */
const SNIPPETS: Record<string, Record<string, string>> = {
  React: {
    Tailwind: `// tailwind.config : theme.extend <- rhythm (tokens.tailwind.mjs)
// rounded-1 … rounded-4, rounded-ctl, rounded-pill — des variables, jamais des nombres
export function FicheArret({ enfants }) {
  return (
    <section className="rounded-t-1 py-pad-1-block px-pad-1-inline">   {/* le panneau : la coque, la racine */}
      <div className="rounded-2 py-pad-2-block px-pad-2-inline">          {/* la carte : un cran plus bas */}
        <div className="rounded-3 py-pad-3-block px-pad-3-inline">{enfants}</div>  {/* la ligne : encore un cran */}
      </div>
      <button className="rounded-ctl h-control">Itinéraire</button>  {/* le composant : le coin de la ligne */}
    </section>
  );
}`,
    shadcn: `// shadcn/ui lit UN rayon (--radius) et en dérive ses crans : on lui
// donne le coin du composant, la chaîne au-dessus reste la nôtre
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function FicheArret({ enfants }) {
  return (
    <section className="rounded-t-1 py-pad-1-block px-pad-1-inline">
      <Card className="rounded-2">
        <CardContent className="py-pad-2-block px-pad-2-inline">{enfants}</CardContent>
      </Card>
      <Button>Itinéraire</Button>   {/* rounded-md = var(--r-ctl) */}
    </section>
  );
}`,
    "HTML natif": `/* Le normatif : la règle et le jeton. Ce code n'est qu'un exemple. */
export function FicheArret({ enfants }) {
  return (
    <section className="panneau">
      <div className="carte"><div className="ligne">{enfants}</div></div>
      <button className="bouton">Itinéraire</button>
    </section>
  );
}

/* styles.css — la chaîne descend, le composant prend le coin de la ligne */
.panneau { border-radius: var(--r-1) var(--r-1) 0 0; padding: var(--pad-1-block) var(--pad-1-inline); }
.carte   { border-radius: var(--r-2); padding: var(--pad-2-block) var(--pad-2-inline); }
.ligne   { border-radius: var(--r-3); padding: var(--pad-3-block) var(--pad-3-inline); }
.bouton  { border-radius: var(--r-ctl); min-height: var(--control-height); }
.pastille{ border-radius: var(--r-pill); }         /* la pilule : une forme, pas un cran */`,
  },
  Angular: {
    Tailwind: `@Component({
  selector: "kit-fiche-arret",
  template: \`
    <section class="rounded-t-1 py-pad-1-block px-pad-1-inline">
      <div class="rounded-2 py-pad-2-block px-pad-2-inline">
        <div class="rounded-3 py-pad-3-block px-pad-3-inline"><ng-content /></div>
      </div>
      <button class="rounded-ctl h-control">Itinéraire</button>
    </section>\`,
})
export class FicheArret {}`,
    shadcn: `// spartan/ui porte l'esprit de shadcn côté Angular — mêmes classes,
// donc mêmes jetons : le --radius de shadcn reçoit --r-ctl pour le composant, la chaîne pour le reste
@Component({
  selector: "kit-fiche-arret",
  template: \`
    <section class="rounded-t-1 py-pad-1-block px-pad-1-inline">
      <hlm-card class="rounded-2"><div hlmCardContent><ng-content /></div></hlm-card>
      <button hlmBtn>Itinéraire</button>
    </section>\`,
})
export class FicheArret {}`,
    "HTML natif": `@Component({
  selector: "kit-fiche-arret",
  template: \`
    <section class="panneau">
      <div class="carte"><div class="ligne"><ng-content /></div></div>
      <button class="bouton">Itinéraire</button>
    </section>\`,
  styleUrl: "./fiche-arret.css", // var(--r-1) · var(--r-2) · var(--r-3) · var(--r-ctl)
})
export class FicheArret {}`,
  },
  HTML: {
    Tailwind: `<section class="rounded-t-1 py-pad-1-block px-pad-1-inline">
  <div class="rounded-2 py-pad-2-block px-pad-2-inline">
    <div class="rounded-3 py-pad-3-block px-pad-3-inline">Hôpital Nord · 2 min</div>
  </div>
  <button class="rounded-ctl h-control">Itinéraire</button>
</section>`,
    shadcn: `<!-- shadcn est une bibliothèque React : en HTML pur il n'en reste que
     ses classes Tailwind — rounded-md y résout notre --r-ctl -->
<section class="rounded-t-1 py-pad-1-block px-pad-1-inline">
  <div class="rounded-2 border bg-card py-pad-2-block px-pad-2-inline">…</div>
  <button class="rounded-md">Itinéraire</button>
</section>`,
    "HTML natif": `<link rel="stylesheet" href="kit/tokens.css" />

<section class="panneau">
  <div class="carte"><div class="ligne">Hôpital Nord · 2 min</div></div>
  <button class="bouton">Itinéraire</button>
</section>

<style>
  .panneau { border-radius: var(--r-1) var(--r-1) 0 0; padding: var(--pad-1-block) var(--pad-1-inline); }
  .carte   { border-radius: var(--r-2); padding: var(--pad-2-block) var(--pad-2-inline); }
  .ligne   { border-radius: var(--r-3); padding: var(--pad-3-block) var(--pad-3-inline); }
  .bouton  { border-radius: var(--r-ctl); }
</style>`,
  },
};

/* ── Les règles — dans les dépliants « Règles & sources » de leur preuve ── */
type Src = { t: string; h: string };
const DECISIONS: Src = { t: "Décisions du 25 août 2026, séance sur pièce", h: "#" };
const REGLES: { id: string; nom: string; titre: string; enonce: string; src: Src[] }[] = [
  { id: "a1", nom: "1", titre: "Le coin ne change jamais à l'état",
    enonce: "Propriété d'identité, pas d'état : aucun sélecteur de survol, focus, erreur ou sélection ne modifie un coin déclaré au repos.",
    src: [{ t: "RADIUS-UX 1.3.0 — R02", h: "#" }] },
  { id: "a2", nom: "2", titre: "Tout coin vient de la chaîne",
    enonce: "Chaque coin résout un cran de la chaîne — coque, carte, ligne, marque, ou le coin du composant ; aucune valeur en dur. Une racine, et tout descend.",
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
    enonce: "Le rayon plein est réservé à une liste énumérée — badge/pastille, avatar, piste de l'interrupteur, piste des onglets-pilule — et à rien d'autre ; jamais sur un contenu qui peut passer à la ligne. Toute entrée nouvelle est un arbitrage d'Auteur. Tension de source : chez Atlassian les badges prennent le petit coin — la liste d'ici est un parti pris d'identité.",
    src: [{ t: "RADIUS-UX 1.3.0 — R08", h: "#" }, { t: "Atlassian — Badge", h: "https://atlassian.design/components/badge/" }] },
  { id: "a8", nom: "8", titre: "Un jeton déclare ses consommateurs",
    enonce: "Chaque jeton de coin porte au moins un consommateur nommé : la coque, la carte, la ligne, la marque, le composant, la pilule.",
    src: [{ t: "RADIUS-UX 1.3.0 — R09", h: "#" }] },
  { id: "a9", nom: "9", titre: "L'angle droit n'a pas de jeton",
    enonce: "Rien n'est carré par défaut dans ce système — décision d'identité. Une racine nulle reste possible par arbitrage journalisé (intention « Technique ») ; ce n'est pas un cran, c'est une racine. La case à cocher reste anguleuse : exception dite.",
    src: [{ t: "RADIUS-UX 1.3.0 — R10", h: "#" }, { t: "Sibyl — la théorie, v2, §7", h: "#" }, DECISIONS] },
  { id: "a10", nom: "10", titre: "Conteneur ou composant, la question qui décide tout",
    enonce: "Un conteneur (carte, encart, fenêtre superposée, liste flottante, toast) prend le cran de sa profondeur, jamais de sa taille ; un composant prend le coin de la ligne — la racine divisée par quatre — qui suit la racine du produit et ne suit ni l'écran ni la densité ; la pilule est la liste fermée de la règle 7. Ni l'importance, ni l'état, ni le goût de l'écran n'entrent dans le choix.",
    src: [{ t: "RADIUS-UX 1.3.0 — R12", h: "#" }, { t: "Sibyl — la théorie, v2, §2 et §8", h: "#" }, DECISIONS] },
  { id: "pente", nom: "pente", titre: "Marge et coin, même pente",
    enonce: "La marge d'une surface ne descend jamais sous son coin : quand la racine grandit, la marge de la coque la rattrape et monte avec elle. C'est la seule façon dont un coin touche à un espace.",
    src: [{ t: "Relevé Coursue, 24 août 2026", h: "#" }, { t: "Sibyl — la théorie, v2, §1 « dégagement »", h: "#" }, DECISIONS] },
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

const SOMMAIRE: Sommaire = [
  ["profondeur", "01", "La profondeur"],
  ["coin", "02", "Le coin"],
  ["pilule", "03", "La pilule"],
  ["repertoire", "04", "Le répertoire"],
  ["adaptation", "05", "L'adaptation"],
];

export default function Vue() {
  const [racine, setRacine] = useState<number>(CHARTE.racine);
  const [ri, setRi] = useState(12);
  const [ecart, setEcart] = useState(12);
  const [intention, setIntention] = useState(1);
  const [fw, setFw] = useState<"React" | "Angular" | "HTML">("HTML");
  const { styl } = useAdaptation();
  const actifId = useDocSections("profondeur");
  const s = socle({ racine });
  const dL = ecart * Math.SQRT2, pct = ecart > 0 ? Math.round((dL / ecart - 1) * 100) : 0;

  return (
    <div className="gdoc-fond">
      <div className="gdoc">
        <RailDoc page="arrondis" titre="Fondation · Arrondis" sommaire={SOMMAIRE} actifId={actifId} pied="Chaîne ÷ 2 depuis la racine · composant = racine ÷ 4" />

        <main className="gdoc-contenu" id="contenu">

          <section className="gdoc-heros">
            <p className="kicker">Fondation · Les arrondis</p>
            <h1>Un coin ne se choisit pas, il se déduit<span className="point" aria-hidden="true" /></h1>
            <p className="chapo">
              Le coin d&apos;un objet dit ce qu&apos;il est et où il vit : un conteneur prend le
              coin de sa profondeur, un composant prend celui de la ligne, la pilule est une forme réservée.
              <b> Un seul nombre engendre toute la chaîne</b> — personne ne choisit plus un coin, et
              l&apos;écran n&apos;y touche pas.
            </p>
          </section>

          {/* ══════════ 01 · situation ══════════ */}
          <section className="gdoc-sec pose" id="profondeur">
            <div className="gdoc-sec-tete">
              <p className="kicker">01 · La profondeur</p>
              <h2>La profondeur choisit le coin, personne d&apos;autre</h2>
              <p className="sourd">Quand chaque écran choisit ses coins, deux cartes voisines ne se
              ressemblent plus. Ici, tout descend d&apos;un seul nombre : tourne la racine, le panneau,
              la carte, la ligne et la marque suivent, leur marge intérieure avec eux, et les boutons
              prennent le coin de la ligne. Poussée au bout, la racine fait monter la marge du panneau
              avec elle — c&apos;est pour ça qu&apos;elle a une borne.</p>
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
                niveau. » Le registre porte quatre coins de profondeur — la coque, la carte, la ligne,
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
              parallèles : dans le coin, l&apos;écart se creuse de 41 %. L&apos;œil l&apos;attrape avant de
              savoir le nommer — c&apos;est l&apos;oreille de la modale. Même intérieur, même écart ;
              seul le coin extérieur change.</p>
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
              <p className="sourd">Le rayon plein n&apos;a pas de valeur : il sature. Donné à n&apos;importe
              quoi, il fabrique des gélules et des boutons qui ressemblent à des étiquettes. Quatre
              objets de Navette y ont droit ; deux autres frappent à la porte.</p>
            </div>
            <div className="gdoc-corps">
              <figure className="gd-figure">
                <div className="banc pale">
                  <Planche />
                </div>
                <figcaption className="gd-legende">
                  quatre membres, pas un de plus · rayon plein · jamais sur un contenu qui peut passer à la ligne
                </figcaption>
              </figure>
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <Regles ids={["a7", "a3", "saturation"]} />
              </div></details>
            </div>
          </section>

          {/* ══════════ 04 · répertoire ══════════ */}
          <section className="gdoc-sec pose" id="repertoire">
            <div className="gdoc-sec-tete">
              <p className="kicker">04 · Le répertoire</p>
              <h2>Ce que la page n&apos;a pas mis en scène</h2>
              <p className="sourd">La chaîne complète selon l&apos;intention, les pièges connus, et les
              règles qui restent avec leurs sources.</p>
            </div>
            <div className="gdoc-corps">
              <div className="ar-bloc">
                <h3>La chaîne, selon l&apos;intention</h3>
                <div className="rang" style={{ gap: "var(--gap-3-inline)" }}>
                  {INTENTS.map((t, i) => (
                    <button key={t.nom} className={`bouton ${intention === i ? "on" : ""}`} onClick={() => setIntention(i)}>{t.nom}</button>
                  ))}
                </div>
                <Chaine i={intention} />
              </div>

              <div className="ar-bloc">
                <h3>Les pièges</h3>
                <div className="ar-pieges">
                  {([
                    ["Valeur en dur", "10 px", "Un coin qui n'est pas un cran ne bouge pas quand la racine bouge. Il est déjà faux demain.", "dur"],
                    ["Pourcentage", "50 %", "Un coin dérivé de la hauteur fabrique une pilule dès que le contenu grandit.", "pct"],
                    ["Voisins dépareillés", "4 et 8", "Un champ et un bouton de même taille, côte à côte, avec deux coins. L'œil lit deux systèmes.", "vois"],
                    ["Le survol arrondit", "4 → plein", "Le coin change avec l'état : l'objet change d'identité sous la main. Couleur, ombre, anneau disent l'état ; le coin, jamais.", "etat"],
                    ["Saturé", "24 sur 28 de haut", "Le coin dépasse la moitié du petit côté : une pilule qui n'a pas de passeport.", "sat"],
                    ["Dans l'arc", "marge 1 pour 12", "La marge intérieure vaut au moins trois dixièmes du coin, sinon le contenu entre dans l'arc.", "arc"],
                  ] as const).map(([titre, mesure, texte, fig]) => (
                    <div className="ar-piege" key={fig} data-intent="statement">
                      <h4>{titre} <span className="mono">{mesure}</span></h4>
                      <p>{texte}</p>
                      <div className="ar-piegefig">
                        {fig === "dur" && <span className="v-dur" />}
                        {fig === "pct" && <span className="v-pct" />}
                        {fig === "vois" && <span className="v-vois"><i /><b /></span>}
                        {fig === "etat" && <span className="v-etat"><i /><span className="fleche">→</span><b /></span>}
                        {fig === "sat" && <span className="v-sat" />}
                        {fig === "arc" && <span className="v-arc">14:02</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <Regles ids={["a1", "a2", "a3", "a4", "a8", "a9", "degagement", "saturation"]} />
                <p>Fonds : Décisions du 25 août 2026, séance sur pièce · RADIUS-UX 1.3.0 (R02 à R12) ·
                Sibyl — le système, la théorie v2 (août 2026) · Sibyl Scale, générateur, §1 et §8 ·
                W3C CSS Backgrounds and Borders, corner shaping · Atlassian Design System, Badge · WCAG 2.4.11.</p>
              </div></details>
            </div>
          </section>

          {/* ══════════ 05 · l'adaptation ══════════ */}
          <section className="gdoc-sec pose" id="adaptation">
            <div className="gdoc-sec-tete">
              <p className="kicker">05 · L&apos;adaptation</p>
              <h2>Le même système, dans votre stack</h2>
              <p className="sourd">Un système normatif enfermé dans un framework n&apos;est
              qu&apos;une bibliothèque. Ici le normatif vit dans la règle et le jeton — quatre
              coins de profondeur, le coin du composant et la pilule ; React, Angular ou HTML
              n&apos;en sont que des consommateurs.</p>
            </div>
            <div className="gdoc-corps">
              <PanneauCode langage={styl} outils={
                <>{(["HTML", "React", "Angular"] as const).map((f) => (
                  <button key={f} className={`bouton ${fw === f ? "on" : ""}`} onClick={() => setFw(f)}>{f}</button>
                ))}</>
              } code={SNIPPETS[fw][styl]} />
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <p>Le normatif, ici, c&apos;est <b>la règle et le jeton</b> — pas le code. Un seul
                registre porte six coins : quatre de profondeur (<code>--r-1</code> la coque,
                <code> --r-2</code> la carte, <code>--r-3</code> la ligne, <code>--r-4</code> la marque),
                le coin du composant (<code>--r-ctl</code>, qui est celui de la ligne) et la pilule
                (<code>--r-pill</code>, une forme, jamais un cran). Ils descendent tous de la racine et
                ne glissent pas avec l&apos;écran. La sortie Tailwind (<code>rounded-1</code> à
                <code> rounded-4</code>, <code>rounded-ctl</code>, <code>rounded-pill</code>) pointe sur
                les mêmes variables ; shadcn lit <code>--radius</code>, on lui donne <code>--r-ctl</code>.</p>
                <Regles ids={["a2", "a8"]} />
              </div></details>
            </div>
          </section>

          <footer className="gd-pied">
            <span>Gabarit «&nbsp;documentaire nu&nbsp;» — page Arrondis, 25&nbsp;août&nbsp;2026</span>
            <span>Chaîne ÷ 2 depuis la racine · marge jamais sous le coin · composant = racine ÷ 4 — Navette est une application fictive</span>
          </footer>

        </main>
      </div>
    </div>
  );
}
