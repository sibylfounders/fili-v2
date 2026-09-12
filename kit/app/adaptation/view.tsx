"use client";

import { useEffect, useRef, useState } from "react";
import { RailDoc, useDocSections, type Toc } from "../rail";
import { Demo, DemoScene, ListRules, PanelRegistry } from "../levels";
import type { LineList, LineCode } from "../levels";
import { Preview } from "../preview";
import { ADAPTATION, POSTURE } from "../../derivation.mjs";
import "./adaptive.css";

/* ══════════════════════════════════════════════════════════════════════
   /adaptation — six preuves sur un banc, puis le répertoire au gabarit des
   autres pages. Versée le 9 septembre 2026 depuis le témoin de la doctrine
   du même jour (Auteur : « 3 c'est le minimum ») : la visée, le seuil,
   l'étirement, la hauteur, les segments, les plans. Aucune règle n'est
   acquise (⚪) : ni mesure décidable au banc, ni piégée, ni séance. Les
   valeurs sont LUES au moteur (ADAPTATION), jamais recopiées ; les surfaces
   du banc ne suivent pas la fenêtre — chacune a sa propre largeur, et
   l'interface qu'elle contient ne connaît qu'elle.
   ══════════════════════════════════════════════════════════════════════ */
const TOC: Toc = [
  ["aim", "01", "La visée"],
  ["threshold", "02", "Le seuil"],
  ["stretch", "03", "L'étirement"],
  ["height", "04", "La hauteur"],
  ["segments", "05", "Les segments"],
  ["planes", "06", "Les plans"],
  ["registry", "07", "Le registre"],
  ["code", "08", "Le code"],
];
const W = ADAPTATION.work;
const REM = 16; /* la racine du navigateur : les surfaces du banc se disent en px, les seuils en rem */
const rem = (px: number) => px / REM;
const dec = (v: number) => String(Math.round(v * 10) / 10).replace(".", ",");
const THRESHOLD_TWO = ADAPTATION.threshold(W.list.rem, W.sheet.rem); /* 17 + 1,5 + 26 */
const THRESHOLD_PROSE = ADAPTATION.threshold(W.prose.rem, W.context.rem); /* 34 + 1,5 + 16 */

/* ── Les règles et leurs sources, lues sous chaque preuve ── */
type Src = { t: string; h: string };
const DOCTRINE: Src = { t: "Doctrine d'adaptation du 9 septembre 2026 (témoin, six scènes)", h: "#" };
const V1: Src = { t: "V1 — principe adaptatif : « le composant répond à l'espace réel de son conteneur »", h: "#" };
const PRINCIPLE: Src = { t: "Principe d'Auteur du 10 septembre 2026 — « Fili conçoit pour des postures, pas pour des tailles d'écran »", h: "#" };
const APPLE_DUO: Src = { t: "Apple, HIG — Designing for iPhone Duo", h: "https://developer.apple.com/design/human-interface-guidelines/designing-for-iphone-duo" };
const APPLE_POSE: Src = { t: "Apple, Tech Talk — Strike a pose with adaptive layouts on iPhone Duo", h: "https://developer.apple.com/videos/play/tech-talks/111463/" };
const ANDROID_FOLD: Src = { t: "Android Developers — Make your app fold aware (FoldingFeature : state, orientation, occlusionType)", h: "https://developer.android.com/develop/adaptive-apps/guides/foldables/make-your-app-fold-aware" };
const ANDROID_LEARN: Src = { t: "Android Developers — Learn about foldables (postures tabletop et book, continuité)", h: "https://developer.android.com/guide/topics/large-screens/learn-about-foldables" };
const ANDROID_SIZE: Src = { t: "Android Developers — Use window size classes (« not intended for isTablet-type logic »)", h: "https://developer.android.com/develop/ui/compose/layouts/adaptive/use-window-size-classes" };
const SAMSUNG_FLEX: Src = { t: "Samsung Developers, One UI — Designing for foldables : Flex mode", h: "https://developer.samsung.com/one-ui/foldable-and-largescreen/foldable-excl-flex.html" };
const SAMSUNG_CONT: Src = { t: "Samsung Developers, Galaxy Z — App continuity", h: "https://developer.samsung.com/galaxy-z/app-continuity.html" };
const W3C_POSTURE: Src = { t: "W3C — Device Posture API (folded / continuous)", h: "https://www.w3.org/TR/device-posture/" };
const MDN_SEGMENTS: Src = { t: "MDN — Viewport Segments API (horizontal-viewport-segments, env(viewport-segment-*))", h: "https://developer.mozilla.org/en-US/docs/Web/API/Viewport_segments_API" };
const MS_DUAL: Src = { t: "Microsoft Learn — Introduction to dual-screen devices (Surface Duo : la couture, dual-portrait / dual-landscape)", h: "https://learn.microsoft.com/en-us/dual-screen/introduction" };
const RULES: { id: string; name: string; heading: string; statement: string; src: Src[] }[] = [
  { id: "z1", name: "1", heading: "On compte des zones, pas des pixels",
    statement: "Une zone est une chose sur laquelle on travaille sans en perdre une autre de vue. Une interface ne s'adapte pas à un appareil : elle s'adapte au nombre de zones qui tiennent en même temps.",
    src: [DOCTRINE] },
  { id: "z2", name: "2", heading: "Une zone existe quand elle atteint sa largeur de travail",
    statement: "Le seuil est calculé depuis le contenu — une somme de largeurs de travail — jamais décrété. Pas de demi-zone : sous sa largeur, la zone n'existe pas du tout.",
    src: [DOCTRINE, V1] },
  { id: "z3", name: "3", heading: "Plus de place ne donne jamais plus grand",
    statement: "La place gagnée a trois emplois : plus de contenu, moins d'étapes, ou du blanc assumé. Le texte ne dépasse jamais sa mesure.",
    src: [DOCTRINE] },
  { id: "z4", name: "4", heading: "La visée décide des cibles, la place décide de la structure",
    statement: "Deux décisions séparées. La précision — doigt ou pointeur — règle les cibles et la densité ; rien d'essentiel ne vit derrière le survol. La moitié « précision » est déjà une règle du tactile (T6).",
    src: [DOCTRINE, { t: "Reprise tactile, T6 — le régime du pointeur se déclare", h: "#" }] },
  { id: "z5", name: "5", heading: "Une zone qui apparaît ne fait jamais reculer",
    statement: "Ce que l'utilisateur regardait reste à sa place, et une seule chose change de structure à la fois. Revenir à une posture rend exactement ce qu'on y avait laissé.",
    src: [DOCTRINE, SAMSUNG_CONT, ANDROID_LEARN] },
  { id: "z6", name: "6", heading: "On ne change de structure que pour supprimer une étape",
    statement: "Le reste est un changement gratuit, payé en apprentissage.",
    src: [DOCTRINE] },
  { id: "p1", name: "P1", heading: "La place se mesure par segments continus",
    statement: "Un pli, une barre système, une découpe coupent la place. Une zone ne traverse jamais une coupure : elle tient dans un segment, ou le segment suivant en accueille une autre.",
    src: [DOCTRINE, MDN_SEGMENTS, ANDROID_FOLD, MS_DUAL] },
  { id: "p3", name: "P3", heading: "Une frontière choisie se négocie, une frontière imposée prime",
    statement: "La frontière choisie se place où les largeurs de travail la font tomber, et peut être décentrée. La frontière imposée est médiane, orientée par la tenue : quand elle apparaît, la composition se recale dessus — aucune zone ne la traverse. Chaque plan de l'appareil entrouvert a le format de l'écran fermé.",
    src: [DOCTRINE, ANDROID_LEARN, APPLE_POSE, SAMSUNG_FLEX] },
  { id: "v3", name: "V3", heading: "Un composant de saisie suit les mains, pas la place",
    statement: "Entier tant que sa largeur tient dans la portée des pouces ; au-delà, il se scinde et ses moitiés rejoignent les bords — seul objet qui ait le droit de traverser une frontière. Le clavier est une couche au-dessus, ancrée aux mains : il recouvre, il ne prend pas de place.",
    src: [DOCTRINE, APPLE_POSE, SAMSUNG_FLEX] },
  { id: "s1", name: "S1", heading: "Fili conçoit pour des postures, pas pour des tailles d'écran",
    statement: "Une interface s'adapte à la situation d'usage de sa surface, pas simplement à sa taille. Le raisonnement va de l'état physique à l'orientation, de l'orientation à la posture, de la posture aux règles d'adaptation, et seulement alors à la composition — jamais de l'angle au layout. Les angles sont des seuils d'état, pas des points de rupture : personne ne dessine 45° ni 137°. Fermé et ouvert n'utilisent pas le même écran : l'extérieur n'est jamais un écran qui grandit, c'est un changement de surface active. Les dimensions restent une variable de composition, parmi d'autres.",
    src: [PRINCIPLE, APPLE_DUO, ANDROID_FOLD, W3C_POSTURE, ANDROID_SIZE] },
  { id: "s2", name: "S2", heading: "Le designer écrit les règles qui survivent aux changements de posture, pas une collection d'écrans",
    statement: "Ce qui est prioritaire, ce qui reste ensemble, ce qui peut se séparer, ce qui peut changer de surface, ce qui peut être réorganisé, ce qui ne traverse jamais une frontière physique, les relations entre les parties, les rôles que les surfaces peuvent prendre. Fili confronte ces lois à la situation réelle de la surface et produit la composition. Quatre postures aujourd'hui — Mobile, Livre, Laptop, Tablet — : un vocabulaire, pas une liste définitive.",
    src: [PRINCIPLE, APPLE_DUO, APPLE_POSE, SAMSUNG_FLEX] },
  { id: "h1", name: "H1", heading: "Un panneau suit la hauteur",
    statement: "Une feuille et une modale sont des aveux de manque de place : sous le plancher, elles redeviennent une page. Une confirmation destructive reste bloquante quelle que soit la place — elle n'était pas là pour économiser de l'espace.",
    src: [DOCTRINE, { t: "Protocole K4 — hauteur de référence 568 px", h: "#" }] },
];
function Rules({ ids }: { ids: string[] }) {
  return (
    <div className="ad-rules">
      {ids.map((id) => RULES.find((r) => r.id === id)!).map((r) => (
        <div key={r.id} className="ad-rule">
          <b><span className="badge">règle {r.name}</span> {r.heading}</b>
          <span>{r.statement}</span>
          <span className="ad-rule-src muted">Sources : {r.src.map((sc, i) => (
            <span key={sc.t}>{i > 0 && " · "}{sc.h === "#" ? sc.t : <a href={sc.h}>{sc.t}</a>}</span>
          ))}</span>
        </div>
      ))}
    </div>
  );
}

/* ── La maquette d'application (objet imité) : une liste d'interventions, une fiche ── */
type Row = { name: string; meta: string; sub?: string; tone?: "urgent" | "done"; on?: boolean };
const ROWS: Row[] = [
  { name: "Chaufferie B — fuite circuit", meta: "08:30", sub: "Site Nord · L. Meyer", tone: "urgent", on: true },
  { name: "Ascenseur 2 — visite annuelle", meta: "10:15", sub: "Tour Ouest · R. Diaz" },
  { name: "Groupe froid — filtre", meta: "11:00", sub: "Site Nord · L. Meyer" },
  { name: "Éclairage parking niveau -2", meta: "13:45", sub: "Tour Ouest · A. Bonnet", tone: "done" },
  { name: "Portail livraison — capteur", meta: "15:00", sub: "Site Nord · R. Diaz" },
  { name: "CTA hall — courroie", meta: "16:20", sub: "Tour Ouest · L. Meyer" },
  { name: "Détection incendie — test", meta: "17:00", sub: "Site Nord · A. Bonnet" },
  { name: "Adoucisseur — sel", meta: "17:30", sub: "Tour Ouest · R. Diaz" },
  { name: "Vidéo hall — caméra 4", meta: "18:00", sub: "Site Nord · L. Meyer" },
  { name: "Onduleur — autonomie", meta: "18:20", sub: "Tour Ouest · A. Bonnet" },
  { name: "Sas Nord — badge", meta: "18:45", sub: "Site Nord · R. Diaz" },
  { name: "Plomberie R+3 — siphon", meta: "19:10", sub: "Tour Ouest · L. Meyer" },
];
function List({ rows = ROWS, sub, act, className = "" }: { rows?: Row[]; sub?: boolean; act?: boolean; className?: string }) {
  return (
    <div className={`ad-list ${className}`}>
      {rows.map((r) => (
        <div key={r.name} className={`ad-row ${r.tone ?? ""} ${r.on ? "on" : ""}`}>
          <span className="ad-dot" aria-hidden="true" />
          <span className="ad-name">{r.name}</span>
          {act && <span className="ad-act" aria-hidden="true">Assigner</span>}
          <span className="ad-meta">{r.meta}</span>
          {sub && r.sub && <span className="ad-sub">{r.sub}</span>}
        </div>
      ))}
    </div>
  );
}
function Sheet({ back, short }: { back?: boolean; short?: boolean }) {
  return (
    <div className="ad-sheet">
      {back && <span className="ad-back">← Toutes les interventions</span>}
      <b className="ad-h">Chaufferie B — fuite circuit primaire</b>
      <span className="ad-ref">INT-2418 · signalée 07:52 · urgente</span>
      <div className="ad-fields">
        <div className="ad-field"><small>Site</small><span>Nord — sous-sol 1</span></div>
        <div className="ad-field"><small>Créneau</small><span>08:30 – 10:00</span></div>
        <div className="ad-field"><small>Technicien</small><span>L. Meyer</span></div>
        <div className="ad-field"><small>Pièce</small><span>Vanne 3 voies DN40</span></div>
      </div>
      <p className="ad-text">{short
        ? "Perte de pression relevée sur le circuit primaire depuis la nuit. Isoler avant intervention, le secours reste sur la chaufferie A."
        : "Perte de pression relevée sur le circuit primaire depuis la nuit. Appoint automatique déclenché quatre fois. Isoler le circuit avant intervention, le secours reste sur la chaufferie A."}</p>
      <div className="ad-actions">
        <span className="button on">Démarrer</span>
        <span className="button">Réassigner</span>
      </div>
    </div>
  );
}

/* ── 01 · La visée : deux surfaces de même largeur, deux interfaces ── */
function AimDemo() {
  const finger = useRef<HTMLDivElement>(null), pointer = useRef<HTMLDivElement>(null);
  const [read, setRead] = useState<{ w: number; a: number; b: number } | null>(null);
  useEffect(() => {
    const count = (el: HTMLDivElement | null) => {
      const list = el?.querySelector(".ad-list"); if (!list) return 0;
      const box = list.getBoundingClientRect();
      return Array.from(list.querySelectorAll(".ad-row")).filter((r) => { const b = r.getBoundingClientRect(); return b.top >= box.top - 1 && b.bottom <= box.bottom + 1; }).length;
    };
    const measure = () => setRead({ w: Math.round(finger.current?.getBoundingClientRect().width ?? 0), a: count(finger.current), b: count(pointer.current) });
    measure();
    const ro = new ResizeObserver(measure);
    if (finger.current) ro.observe(finger.current);
    return () => ro.disconnect();
  }, []);
  return (
    <Demo situation="Deux surfaces de même largeur : une tablette tenue au doigt, une fenêtre menée au pointeur"
      caption={read ? `${read.w} px chacune · ${read.a} lignes visibles au doigt, ${read.b} au pointeur · même nombre de zones, pas la même densité` : "même nombre de zones, pas la même densité"}>
      <div className="demo-stage">
        <div className="ad-pair">
          <div className="ad-fixed">
            <div className="ad-fixed-head"><b>Tablette portrait — au doigt</b><span className="mono">cible 48 px</span></div>
            <div className="ad-bench" ref={finger}>
              <div className="ad-app ad-finger" role="img" aria-label="La même application au doigt : lignes hautes, une action par ligne, navigation en barre basse">
                <div className="ad-bar"><b>Interventions</b><span className="button">Filtrer</span></div>
                <div className="ad-body" style={{ flexDirection: "column" }}>
                  <List rows={ROWS.slice(0, 7)} sub className="ad-fill" />
                  <div className="ad-tabs"><span className="on"><i />Jour</span><span><i />Sites</span><span><i />Équipes</span><span><i />Moi</span></div>
                </div>
              </div>
            </div>
            <p className="ad-note">une action par ligne, toujours visible · navigation en barre basse</p>
          </div>
          <div className="ad-fixed">
            <div className="ad-fixed-head"><b>Fenêtre desktop — au pointeur</b><span className="mono">cible 32 px</span></div>
            <div className="ad-bench" ref={pointer}>
              <div className="ad-app ad-pointer" role="img" aria-label="La même application au pointeur : lignes serrées, l'action secondaire au survol, navigation en rail">
                <div className="ad-bar"><b>Interventions</b><span className="button">Filtrer</span></div>
                <div className="ad-body">
                  <div className="ad-rail"><i className="on" /><i /><i /><i /></div>
                  <List rows={ROWS} act className="ad-fill" />
                </div>
              </div>
            </div>
            <p className="ad-note">l&apos;action secondaire se révèle au survol, elle reste au menu · navigation en rail</p>
          </div>
        </div>
      </div>
    </Demo>
  );
}

/* ── 02 · Le seuil : la deuxième zone arrive quand il y en a assez ── */
function ThresholdDemo() {
  const [w, setW] = useState(560);
  const place = rem(w);
  const two = place >= THRESHOLD_TWO;
  const lack = THRESHOLD_TWO - place;
  return (
    <Preview situation="Une liste et une fiche : la liste n'apparaît que quand sa place est entière" background="plain"
      onWidth={setW}
      children={() => (
        <div className="ad-cq" style={{ "--ad-sheet": `${W.sheet.rem}rem` } as React.CSSProperties}>
          <div className="ad-two" role="img" aria-label="Une fiche d'intervention ; à sa gauche, la zone de la liste n'existe que quand la place atteint sa largeur de travail">
            <div className="ad-left">
              <div className="ad-ghost" aria-hidden="true"><span className="t">Zone liste</span><span className="m">{two ? "" : `manque ${dec(lack)} rem`}</span></div>
              <List rows={ROWS.slice(0, 8)} />
            </div>
            <Sheet back />
          </div>
        </div>
      )}
      foot={`place ${dec(place)} rem · liste ${W.list.rem} + gouttière ${dec(ADAPTATION.gutter)} + fiche ${W.sheet.rem} = ${dec(THRESHOLD_TWO)} rem · ${two ? `deux zones : la liste garde ses ${W.list.rem} à 20 rem, la place gagnée va à la fiche` : `une zone — il manque ${dec(lack)} rem à la liste`}`}
    />
  );
}

/* ── 03 · L'étirement : plus de place ne veut jamais dire plus grand ── */
const PROSE = "Perte de pression relevée sur le circuit primaire depuis la nuit. L'appoint automatique s'est déclenché quatre fois entre 2 h et 6 h. Isoler le circuit avant intervention ; le secours reste assuré par la chaufferie A pendant toute la durée des travaux.";
function StretchDemo() {
  const [w, setW] = useState(780);
  const a = useRef<HTMLParagraphElement>(null), b = useRef<HTMLParagraphElement>(null);
  const [chars, setChars] = useState<[number, number] | null>(null);
  useEffect(() => {
    /* la largeur d'un caractère, lue sur la police de la scène */
    const ch = (el: HTMLElement) => { const s = document.createElement("span"); s.textContent = "0000000000"; s.style.cssText = "position:absolute;visibility:hidden;white-space:pre"; s.style.font = getComputedStyle(el).font; el.appendChild(s); const v = s.offsetWidth / 10; s.remove(); return v; };
    const measure = () => { if (a.current && b.current) setChars([Math.round(a.current.clientWidth / ch(a.current)), Math.round(b.current.clientWidth / ch(b.current))]); };
    measure();
    const ro = new ResizeObserver(measure);
    if (a.current) ro.observe(a.current); if (b.current) ro.observe(b.current);
    return () => ro.disconnect();
  }, [w]);
  return (
    <Preview situation="Le même texte, la même surface, une seule poignée : en haut la place grandit les objets, en bas elle en montre plus"
      start={780} onWidth={setW}
      children={() => (
        <div className="ad-cq">
          <div className="ad-mirror">
            <div className="ad-mi grows demo-single bad" data-intent="statement">
              <p className="demo-verdict"><span aria-hidden="true">✗</span><span>Ce qui grandit : le titre suit la place, la ligne s&apos;allonge</span><span className="ad-count">{chars ? `${chars[0]} caractères par ligne` : ""}</span></p>
              <b className="ad-h">Chaufferie B — fuite circuit primaire</b>
              <p className="ad-text" ref={a}>{PROSE}</p>
            </div>
            <div className="ad-mi shows demo-single good">
              <div className="ad-mi-head">
                <p className="demo-verdict"><span aria-hidden="true">✓</span><span>Ce qui en montre plus : la mesure tient, la place ouvre une colonne</span><span className="ad-count">{chars ? `${chars[1]} caractères par ligne` : ""}</span></p>
              </div>
              <div>
                <b className="ad-h">Chaufferie B — fuite circuit primaire</b>
                <p className="ad-text" ref={b}>{PROSE}</p>
              </div>
              <div className="ad-extra">
                <div className="ad-field"><small>Dernier relevé</small><span>1,4 bar — 06:12</span></div>
                <div className="ad-field"><small>Appoints</small><span>4 depuis minuit</span></div>
                <div className="ad-field"><small>Contrat</small><span>P2 — sous 4 h</span></div>
                <div className="ad-field"><small>Historique</small><span>2 interventions en 90 j</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
      foot={`place ${dec(rem(w))} rem · la colonne de contexte s'ouvre à ${W.prose.rem} + ${dec(ADAPTATION.gutter)} + ${W.context.rem} = ${dec(THRESHOLD_PROSE)} rem · la mesure du texte ne bouge pas`}
    />
  );
}

/* ── 04 · La hauteur : la feuille redevient page sous le plancher ── */
const H_TALL = 560, H_SQUASHED = 300; /* hors chaîne : la fenêtre debout, puis écrasée — en px (retour d'Auteur, 10 septembre : un bouton, pas une poignée) */
function HeightDemo() {
  const [squashed, setSquashed] = useState(false);
  const h = squashed ? H_SQUASHED : H_TALL;
  const full = rem(h) <= ADAPTATION.floorHeight;
  return (
    <Demo situation="Une fenêtre étroite qu'on écrase : la largeur ne bouge pas, la hauteur s'effondre"
      action={{ label: "Écraser", back: "Rétablir", active: squashed, onClick: () => setSquashed(!squashed) }}
      caption={`hauteur ${dec(rem(h))} rem · ${h} px · plancher ${ADAPTATION.floorHeight} rem`}>
      <DemoScene ok={null} verdict={full ? "Page pleine : sous le plancher, la feuille n'est plus une feuille" : "Feuille : la hauteur le permet, le fond reste visible"}>
        <div className="ad-tall">
          <div className="ad-tall-frame" style={{ height: `${h}px` }}>
            <div className="ad-app" role="img" aria-label="Une feuille de réassignation posée sur une liste ; quand la hauteur descend sous le plancher, elle prend toute la page">
              <div className="ad-bar"><b>Interventions</b><span className="ad-state">{full ? "page pleine" : "feuille"}</span></div>
              <div className="ad-body">
                <div className="ad-bg">
                  {ROWS.slice(1, 4).map((r) => <div key={r.name} className="ad-row" style={{ border: 0 }}><span className="ad-dot" /><span className="ad-name">{r.name}</span><span className="ad-meta">{r.meta}</span></div>)}
                </div>
                <div className="ad-veil" />
                <div className="ad-sheetpanel">
                  <div className="ad-grip" />
                  <b className="ad-h">Réassigner l&apos;intervention</b>
                  <span className="ad-ref">INT-2418 · Chaufferie B</span>
                  <div className="ad-fields one">
                    <div className="ad-field"><small>Technicien actuel</small><span>L. Meyer</span></div>
                    <div className="ad-field"><small>Disponible</small><span>R. Diaz — 09:00</span></div>
                  </div>
                  <div className="ad-actions"><span className="button on">Confirmer</span><span className="button">Annuler</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DemoScene>
    </Demo>
  );
}

/* ── 05 · Les segments : un pliable, trois postures ── */
type Posture = "closed" | "open" | "shared";
const FOLD = 10; /* hors chaîne : la charnière, en px */
function SegmentsDemo() {
  const [posture, setPosture] = useState<Posture>("open");
  const [blind, setBlind] = useState(false);
  const chassis = useRef<HTMLDivElement>(null);
  const [total, setTotal] = useState(1000);
  useEffect(() => {
    const el = chassis.current; if (!el) return;
    const read = () => setTotal(el.getBoundingClientRect().width);
    read(); const ro = new ResizeObserver(read); ro.observe(el); return () => ro.disconnect();
  }, []);
  const open = posture === "open";
  const segment = Math.round((total - FOLD) / 2);
  const two = open && rem(segment) >= W.list.rem && rem(segment) >= W.sheet.rem;
  const verdict = !open
    ? (posture === "shared" ? `${Math.round(segment)} px d'un seul tenant : la fiche seule — la même place qu'un grand téléphone, la même interface` : `Un seul segment de ${Math.round(total)} px : la fiche seule, la liste derrière le retour`)
    : blind ? "La charnière coupe la fiche : des champs à cheval sur le pli — la place existait, elle n'était pas continue"
    : "Deux segments, deux zones : la liste à gauche, la fiche à droite, le pli fait la gouttière";
  const choose = (p: Posture) => { setPosture(p); setBlind(false); };
  return (
    <Demo situation="Un pliable, une liste et une fiche : fermé, ouvert, ouvert mais partagé avec une autre application"
      action={open ? { label: "Ignorer le pli", back: "Respecter le pli", active: blind, onClick: () => setBlind(!blind) } : undefined}
      bar={<span className="demo-seg" role="group" aria-label="Posture de l'appareil">
        <span className="mono muted">Posture</span>
        {([["closed", "Fermé"], ["open", "Ouvert"], ["shared", "Ouvert, partagé"]] as const).map(([k, l]) => (
          <button key={k} type="button" className={`button ${posture === k ? "on" : ""}`} aria-pressed={posture === k} onClick={() => choose(k)}>{l}</button>
        ))}
      </span>}
      caption={open ? `place ${Math.round(total)} px · deux segments de ${segment} px` : posture === "shared" ? `place ${segment} px · un segment, le pli borde l'application` : `place ${Math.round(total)} px · un segment`}>
      <DemoScene ok={open && blind ? false : true} verdict={verdict}>
        <div className="ad-chassis-wrap">
          <div ref={chassis} className="ad-chassis" data-state={posture} role="img" aria-label="Un pliable dans trois postures ; la liste et la fiche se répartissent sur les segments continus de l'écran">
            <div className="ad-zone">
              <div className={`ad-duo ${two ? "two" : ""} ${two && blind ? "blind" : ""}`}
                style={{ "--ad-left": `${segment}px`, "--ad-right": `${segment + FOLD}px`, "--ad-sheet": `${W.sheet.rem}rem` } as React.CSSProperties}>
                <List rows={ROWS.slice(0, 6)} />
                <Sheet back short />
              </div>
            </div>
            <div className="ad-other" aria-hidden="true"><span className="t">Autre application</span><i /><i className="c" /><i className="d" /><i className="c" /><i /></div>
            <div className="ad-fold" aria-hidden="true" />
          </div>
        </div>
      </DemoScene>
    </Demo>
  );
}

/* ── 06 · Les plans : deux écrans, une charnière, un angle ── */
/* L'APPAREIL (spécification d'Auteur, 10 septembre) est UN LIVRE QUI S'OUVRE. Un panneau fixe :
   l'écran intérieur droit. Une couverture, qui tourne autour de la charnière : dehors l'ÉCRAN
   EXTÉRIEUR (0,7 × 1, son propre viewport, sa propre composition), dedans l'écran intérieur gauche.
   Ouvert, les deux moitiés font un écran 1,4 × 1. La rotation est une vraie transformation 3D dont
   le contenu est solidaire : largeur projetée 0,7 × cos, aucun reflow dû à la projection ; sous 90°,
   c'est le dos de la couverture qu'on voit — l'écran extérieur, éteint dès que l'appareil est ouvert.
   L'ADAPTATION est un autre phénomène : seule une règle UX explicite — un changement de posture —
   recompose l'interface. Postures : Mobile (< 90°), Laptop (tourné, entrouvert), Livre (debout,
   entrouvert), Tablet (180°). Quatre états physiques (principe d'Auteur, 10 septembre, lus au moteur) :
   0° fermé · 1–90° semi-ouvert · 91–179° largement ouvert · 180° à plat.
   Un seul contrôle, l'ouverture — trois positions, 0° · 125° · 180°, animées — et Retourner, qui
   tourne l'appareil de 90°. */
/* les états physiques et les postures sont lus au moteur (POSTURE) : fermé 0° · semi-ouvert 1–90° ·
   largement ouvert 91–179° · à plat 180° ; l'écran intérieur est la surface active dès 1° */
const stateOf = (opening: number) => POSTURE.state(opening)!; /* l'angle est borné 0–180 : un état existe toujours */
const isOpen = (opening: number) => stateOf(opening).surface === "inner";
const isFlat = (opening: number) => stateOf(opening).key === "flat";
const OPENINGS = [0, 125, 180] as const; /* trois positions, pas un curseur : les angles intermédiaires sont un état, pas un réglage (verdict d'Auteur, 10 septembre) ; l'ouverture s'anime entre deux positions */
const SIDE = 400; /* hors chaîne : une surface fait 400 px de côté charnière — 0,7 × 571 */
const LONG = 571;
const KEYS_L = [["A", "Z", "E", "R", "T"], ["Q", "S", "D", "F", "G"], ["W", "X", "C", "V"]];
const KEYS_R = [["Y", "U", "I", "O", "P"], ["H", "J", "K", "L", "M"], ["B", "N", "⌫", "↵"]];
const Half = ({ keys }: { keys: string[][] }) => (
  <div className="ad-half">{keys.map((row, i) => <div key={i} className="ad-krow">{row.map((k) => <i key={k} className="ad-key">{k}</i>)}</div>)}</div>
);
const INBOX = ["Relevés de mars", "Contrat P2 — avenant", "Réunion jeudi 14 h", "Facture 2418", "Congés d'été", "Astreinte week-end"];
const Message = () => (
  <>
    <p className="ad-from">Aliya Reynolds · 9:41</p>
    <b className="ad-h">Relevés de mars</b>
    <p className="ad-text">Abonnés en hausse de 18 % — ralentissement attendu après le pic de février. L&apos;engagement tient, la durée moyenne de lecture progresse pour le troisième mois. Je te mets le détail par canal en pièce jointe.</p>
  </>
);
const Reply = () => <div className="ad-reply"><span>Répondre à Aliya<span className="ad-caret" aria-hidden="true" /></span><span className="ad-send" aria-hidden="true">↑</span></div>;

/* UN SEUL OBJET (Auteur, 10 septembre : « pas quatre vues ») : l'appareil vit dans SON repère — la
   charnière y est toujours verticale, le panneau mobile à gauche. Laptop, Mobile horizontal et Tablet
   verticale sont le même appareil TOURNÉ de 90° dans l'espace ; le contenu reste droit parce que la
   composition est une toile (ad-canvas) tournée en sens inverse dans chaque écran. Ainsi une posture
   passe à l'autre par une rotation ou un pli qu'on voit — jamais par une autre vue. */
const DeviceCanvas = ({ rotated, className, style, children }: { rotated: boolean; className?: string; style?: React.CSSProperties; children: React.ReactNode }) => (
  <div className={`ad-canvas ${rotated ? "turned" : ""} ${className ?? ""}`} style={style}>{children}</div>
);

/* LE LIVRE (Auteur, 10 septembre : « exactement le même problème qu'un livre qui s'ouvre ») : l'écran
   extérieur est la COUVERTURE — la face externe du panneau mobile — et l'écran intérieur gauche est sa
   face interne. Ouvrir, c'est faire tourner cette couverture autour de la charnière : l'écran extérieur
   s'incline, passe sur la tranche à 90°, puis sa face interne se révèle sur le panneau fixe. Une seule
   géométrie, deux systèmes d'affichage : l'extérieur (une zone) tant que l'appareil est Mobile, l'intérieur
   (deux panneaux, une composition) dès 1°. */
type Way = "row" | "col";
function Device({ rotated, opening, blind }: { rotated: boolean; opening: number; blind: boolean }) {
  const a = 180 - opening; /* la couverture, depuis la position à plat : 0 à plat, 180 fermée sur le panneau fixe */
  const open = isOpen(opening);
  const bent = open && !isFlat(opening);
  const imposed = bent && !blind;
  const cosA = Math.cos((a * Math.PI) / 180);
  /* l'appareil recentré : la boîte visible va du bord libre de la couverture (à gauche quand elle s'ouvre) au bord du panneau fixe */
  const leftEdge = SIDE - SIDE * Math.max(cosA, 0);
  const shift = -leftEdge / 2;
  const shade = Math.max(0, Math.round(SIDE * (1 - Math.abs(cosA))));
  const [za, zb] = imposed ? [50, 50] : rotated ? [26, 74] : [34, 66];
  const segment = (imposed && !rotated) ? SIDE : 2 * SIDE;
  const splitKeys = !blind && !rotated && rem(segment) >= ADAPTATION.reach;
  const n = rotated ? (imposed ? 5 : 3) : 6;
  const paneStyle = { width: `${SIDE}px`, height: `${LONG}px` };
  /* la toile intérieure : 800 × 571 en espace appareil ; tournée, 571 × 800 et redressée */
  const canvas = (second: boolean) => ({
    ...(rotated ? { width: `${LONG}px`, height: `${2 * SIDE}px`, left: `${(2 * SIDE - LONG) / 2 - (second ? SIDE : 0)}px`, top: `${(LONG - 2 * SIDE) / 2}px` }
      : { width: `${2 * SIDE}px`, height: `${LONG}px`, left: `${second ? -SIDE : 0}px`, top: 0 }),
    gridTemplateColumns: rotated ? "100%" : `${za}% ${zb}%`,
    gridTemplateRows: rotated ? `${za}% ${zb}%` : "100%",
  } as React.CSSProperties);
  const inner = (second: boolean) => (
    <DeviceCanvas rotated={rotated} className="ad-screen" style={canvas(second)}>
      <div className={`ad-view ad-zone-a ${!imposed ? "covered" : ""}`}>
        <p className="ad-head">Boîte de réception</p>
        {INBOX.slice(0, n).map((t, i) => <div key={t} className={`ad-row ${i === 0 ? "on" : ""}`}><span className="ad-dot" /><span className="ad-name">{t}</span></div>)}
      </div>
      <div className="ad-view ad-zone-b covered"><Message /><Reply /></div>
      {imposed
        ? <div className={`ad-keys fixed ${rotated ? "rows" : "cols"}`} aria-hidden="true"><Half keys={KEYS_L} /><Half keys={KEYS_R} /></div>
        : splitKeys
          ? <div className="ad-keys split" aria-hidden="true"><div><Half keys={KEYS_L} /></div><div><Half keys={KEYS_R} /></div></div>
          : <div className="ad-keys whole" aria-hidden="true"><Half keys={KEYS_L} /><Half keys={KEYS_R} /></div>}
    </DeviceCanvas>
  );
  /* l'écran extérieur : sur la face externe de la couverture — 400 × 571, son viewport, une zone */
  const outerCanvas = rotated ? { width: `${LONG}px`, height: `${SIDE}px`, left: `${(SIDE - LONG) / 2}px`, top: `${(LONG - SIDE) / 2}px` } : { width: `${SIDE}px`, height: `${LONG}px` };
  return (
    <div className={`ad-book ${open ? "ad-inner" : "ad-closed"} ${bent ? "" : "flat"} ${blind && bent ? "blind" : ""} ${a > 90 ? "back" : ""}`}
      style={{ width: `${2 * SIDE}px`, height: `${LONG}px`, "--a": `${a}deg`, "--vol": bent ? 1 : 0, "--shade": `${shade}px`, "--shift": `${shift}px` } as React.CSSProperties}
      role="img" aria-label={open ? "Le pliable ouvert : deux panneaux sur une charnière, une liste et un message, un clavier posé sur la surface" : "Le pliable fermé : son écran extérieur, un message et son clavier entier"}>
      {/* le panneau fixe : l'écran intérieur droit */}
      <div className="ad-pane b ad-fixed-panel" style={paneStyle}>{open && inner(true)}<div className="ad-shade" aria-hidden="true" /></div>
      {/* la couverture : deux faces — l'écran intérieur gauche dedans, l'écran extérieur dehors */}
      <div className="ad-cover" style={paneStyle}>
        <div className="ad-face ad-face-inner">{open && inner(false)}<div className="ad-shade" aria-hidden="true" /></div>
        <div className={`ad-face ad-face-outer ad-outer ${open ? "off" : ""}`}>
          <DeviceCanvas rotated={rotated} style={outerCanvas as React.CSSProperties}>
            <div className="ad-view covered"><Message /><Reply />
              <div className="ad-keys whole" aria-hidden="true"><Half keys={KEYS_L} /><Half keys={KEYS_R} /></div>
            </div>
          </DeviceCanvas>
        </div>
      </div>
      {blind && bent && <div className="ad-crease" aria-hidden="true"><span>coupé par la charnière</span></div>}
    </div>
  );
}

type Stance = "Mobile" | "Livre" | "Laptop" | "Tablet";
function PlanesDemo() {
  const [rotated, setRotated] = useState(false); /* l'appareil tourné de 90° dans l'espace : la charnière devient horizontale */
  const [opening, setOpening] = useState(180); /* 0 fermé, 125 largement ouvert, 180 à plat — trois positions */
  const [blind, setBlind] = useState(false);
  const open = isOpen(opening);
  const bent = open && !isFlat(opening);
  const state = stateOf(opening);
  const posture = POSTURE.of(opening, rotated ? "horizontal" : "vertical").name as Stance; /* état physique → orientation → posture */
  const [previous, setPrevious] = useState<Stance | null>(null);
  const seen = useRef<Stance>(posture);
  useEffect(() => {
    if (seen.current === posture) return;
    const from = seen.current; seen.current = posture; setPrevious(from);
  }, [posture]);
  useEffect(() => { if (!bent) setBlind(false); }, [bent]);
  const a = 180 - opening;
  const cosA = Math.cos((a * Math.PI) / 180);
  const apparent = SIDE + Math.round(SIDE * Math.max(cosA, 0));
  const ratio = (v: number) => String(Math.round(v * 1000) / 1000).replace(".", ",");
  const logical = !open ? (rotated ? "571 × 400" : "400 × 571") : (rotated ? "571 × 800" : "800 × 571");
  const unchanged = open && previous !== null && previous !== "Mobile";
  const verdict = !open ? "Mobile : l'écran extérieur, une surface, une zone"
    : blind && bent ? "Interface naïve : la charnière est ignorée, le contenu tombe sur le pli"
    : bent && state.key === "acute" ? `${posture} : ${rotated ? "contenu en haut, commandes en bas" : "le contexte d'un côté, le travail de l'autre"} — les deux surfaces intérieures sont actives, en angle`
    : bent ? `${posture} : largement ouvert, la charnière reste une frontière — une zone par panneau, la saisie dans le panneau proche`
    : "Tablet : une seule surface continue, la division est choisie";
  return (
    <Demo situation="Un pliable qu'on tient : la posture décide de l'interface, pas la largeur de l'écran"
      action={{ label: "Ignorer la charnière", back: "Respecter la charnière", active: blind, disabled: !bent, onClick: () => setBlind(!blind) }}
      tools={<>
        <span className="demo-seg ad-angle" role="group" aria-label="Ouverture de l'appareil">
          <span className="mono muted">Ouverture</span>
          {OPENINGS.map((v) => (
            <button key={v} type="button" className={`button ${opening === v ? "on" : ""}`} aria-pressed={opening === v} onClick={() => setOpening(v)}>{v}°</button>
          ))}
          <span className="mono muted">· {state.name} · {previous && <><b className="mono">{previous}</b> → </>}<b className="mono">{posture}</b></span>
        </span>
        <button type="button" className="button" aria-pressed={rotated} onClick={() => setRotated(!rotated)}>Retourner</button>
      </>}
      caption={!open ? `écran extérieur ${logical} px · son propre viewport · une zone · fermé`
        : `écran intérieur ${logical} px${unchanged ? " · inchangé" : ""} · projection : 0,7 × cos ${a}° = ${ratio(0.7 * cosA)}, apparente ${ratio(0.7 + 0.7 * Math.max(cosA, 0))} (${apparent} px) · adaptation : ${blind && bent ? "ignorée" : bent ? "frontière médiane imposée" : "division choisie"}`}>
      <DemoScene ok={bent && blind ? false : true} verdict={verdict}>
        <div className="ad-desk" style={{ "--shift": `${-(SIDE - SIDE * Math.max(cosA, 0)) / 2}px`, "--span": `${apparent}px` } as React.CSSProperties}>
          <div className="ad-device" data-rotated={rotated ? "true" : "false"} style={{ rotate: rotated ? "90deg" : "0deg" }}>
            <Device rotated={rotated} opening={opening} blind={blind} />
          </div>
        </div>
      </DemoScene>
    </Demo>
  );
}

/* ── Le répertoire : en liste, les largeurs de travail, les surfaces ── */
const LIST: LineList[] = [
  { name: "On compte des zones, pas des pixels", says: "Une zone est une chose sur laquelle on travaille sans en perdre une autre de vue ; l'interface s'adapte au nombre de zones qui tiennent, pas à un appareil.", or: "sur l'écran allumé", tone: "render" },
  { name: "Le seuil est une somme", says: "Chaque requête de conteneur porte sa formule — des largeurs de travail additionnées. Un seuil qui tombe sur une largeur d'appareil (768, 1024…) est un seuil copié.", or: "dans le code — mesure à écrire", tone: "code" },
  { name: "La zone lit son conteneur, jamais la fenêtre", says: "Aucune requête média de largeur dans un composant ; une requête de conteneur à la place. La fenêtre gouverne la page, une seule fois (Y7).", or: "dans le code — mesure à écrire", tone: "code" },
  { name: "Rien ne recule, rien ne se perd", says: "De part et d'autre d'un seuil, les mêmes contrôles, dans le même ordre, avec le même nom accessible ; le focus et la valeur survivent à la bascule.", or: "sur l'écran allumé", tone: "render" },
  { name: "Le plancher de hauteur", says: `Sous ${ADAPTATION.floorHeight} rem, aucun panneau ne reste une feuille. Le clavier ouvert retire ${W.halfKeyboard.rem} rem : l'action principale vit au-dessus.`, or: "décision d'Auteur, 9 septembre 2026 — à sourcer (K4 : 568 px)", tone: "author" },
  { name: "La portée des pouces", says: `${ADAPTATION.reach} rem : au-delà, le centre d'une saisie tenue à deux mains est hors d'atteinte et le composant se scinde. Une observation, pas encore une règle.`, or: "observation — deux sources à nommer", tone: "author" },
  { name: "Fili conçoit pour des postures, pas pour des tailles d'écran", says: "État physique → orientation → posture → règles → composition. Les angles sont des seuils d'état, jamais des points de rupture ; le designer écrit ce qui survit au changement de posture, pas une collection d'écrans.", or: "sur l'écran allumé — au moteur (POSTURE)", tone: "render" },
  { name: "La précision est au tactile", says: "Cibles de confort au doigt, densité serrée au pointeur, rien d'essentiel derrière le survol : c'est T6. L'adaptation ne réécrit pas cette règle, elle en montre l'effet sur la structure.", or: "reprise tactile, T6", tone: "author" },
];
const WIDTHS: { zone: string; width: string; protects: string; debt?: boolean }[] = [
  { zone: "Texte courant", width: "la mesure de lecture", protects: "bloquée : trois mesures en concurrence (16 px / 70, 17 px / 62, moteur 65ch)", debt: true },
  { zone: "Liste (titre + méta)", width: `${W.list.rem} – 20 rem`, protects: W.list.protects },
  { zone: "Fiche de détail", width: `${W.sheet.rem} rem`, protects: W.sheet.protects },
  { zone: "Détail rédigé", width: `${W.prose.rem} rem`, protects: W.prose.protects },
  { zone: "Formulaire", width: `${W.form.rem} rem (confort ${W.form.comfort})`, protects: W.form.protects },
  { zone: "Navigation persistante", width: `${W.nav.rem} rem · rail ${dec(W.nav.rail)}`, protects: W.nav.protects },
  { zone: "Contexte / filtres", width: `${W.context.rem} rem`, protects: W.context.protects },
  { zone: "Saisie tenue à deux mains", width: `≤ ${ADAPTATION.reach} rem`, protects: "au-delà, le centre est hors de portée : le composant se scinde" },
  { zone: "Demi-clavier", width: `${W.halfKeyboard.rem} rem`, protects: W.halfKeyboard.protects },
];
const SURFACES: [string, string, string, string, string, boolean?][] = [
  ["Téléphone compact", "360", "haute", "doigt", "1"],
  ["Grand téléphone", "430", "haute", "doigt", "1"],
  ["Pliable fermé", "340", "haute", "doigt", "1"],
  ["Pliable ouvert", "2 × 400", "moyenne", "doigt", "2, pli en gouttière"],
  ["Pliable ouvert, partagé", "400", "moyenne", "doigt", "1"],
  ["Pliable entrouvert", "800 (inchangée)", "moyenne", "doigt, 2 portées", "2, un plan chacune"],
  ["Tablette portrait", "820", "haute", "doigt", "2"],
  ["Tablette paysage", "1180", "moyenne", "doigt", "2 – 3", true],
  ["Fenêtre desktop étroite", "520", "haute", "pointeur", "1"],
  ["Desktop plein écran", "1600", "haute", "pointeur", "3"],
  ["Écran partagé", "1180", "basse", "doigt", "2, sans panneau", true],
];
const CODE: LineCode[] = [
  { rule: "La zone lit son conteneur",
    written: <><span className="cs-kw">container-type</span>: inline-size</>,
    product: "une zone", note: "jamais une requête média de largeur dans un composant" },
  { rule: "Liste + fiche",
    written: <><span className="cs-kw">@container</span> (min-width: <span className="cs-var">{dec(THRESHOLD_TWO)}rem</span>)</>,
    product: `${W.list.rem} + ${dec(ADAPTATION.gutter)} + ${W.sheet.rem}`, note: "une somme, jamais un palier" },
  { rule: "Détail rédigé + contexte",
    written: <><span className="cs-kw">@container</span> (min-width: <span className="cs-var">{dec(THRESHOLD_PROSE)}rem</span>)</>,
    product: `${W.prose.rem} + ${dec(ADAPTATION.gutter)} + ${W.context.rem}`, note: "la place gagnée ouvre une colonne" },
  { rule: "Le plancher de hauteur",
    written: <><span className="cs-kw">@container</span> (max-height: <span className="cs-var">{ADAPTATION.floorHeight}rem</span>)</>,
    product: `${ADAPTATION.floorHeight} rem`, note: "sous le plancher, la feuille redevient page" },
  { rule: "Le demi-clavier",
    written: <><span className="cs-kw">max-width</span>: <span className="cs-var">{W.halfKeyboard.rem}rem</span></>,
    product: `${W.halfKeyboard.rem} rem`, note: "il s'étire jusque-là puis se centre" },
  { rule: "La portée des pouces",
    written: <><span className="cs-com">{`/* segment ≥ ${ADAPTATION.reach} rem → le clavier se scinde */`}</span></>,
    product: `${ADAPTATION.reach} rem`, note: "observation, pas règle" },
  { rule: "La posture, lue au moteur",
    written: <><span className="cs-var">POSTURE</span>.of(opening, hinge)</>,
    product: "Mobile · Livre · Laptop · Tablet", note: "état physique → orientation → posture ; jamais angle → layout" },
  { rule: "Le web sait la posture",
    written: <><span className="cs-kw">@media</span> (device-posture: <span className="cs-var">folded</span>)</>,
    product: "folded / continuous", note: "Device Posture API (W3C) — pas une largeur" },
  { rule: "Le web sait les segments",
    written: <><span className="cs-kw">@media</span> (horizontal-viewport-segments: <span className="cs-var">2</span>)</>,
    product: "env(viewport-segment-*)", note: "la place par segments continus (P1)" },
  { rule: "La gouttière entre deux zones",
    written: <><span className="cs-var">ADAPTATION.gutter</span></>,
    product: `${dec(ADAPTATION.gutter)} rem`, note: "entre dans chaque somme" },
];

export default function View() {
  const activeId = useDocSections("aim");
  return (
    <div className="gdoc-background adaptive-page">
      <div className="gdoc">
        <RailDoc page="adaptation" heading="Principe · Adaptation" toc={TOC} activeId={activeId} foot="Un composant ne sait pas où est la fenêtre. Il sait combien de place il a." />

        <main className="gdoc-content" id="content">
          <section className="gdoc-hero adaptive-hero">
            <p className="kicker">L&apos;adaptation</p>
            <h1>La fenêtre n&apos;a jamais été la cause<span className="point" aria-hidden="true" /></h1>
            <p className="lede">
              Le breakpoint répond à « quel appareil ? ». La question utile est <b>combien de choses peut-on
              faire tenir ici en même temps, et la tâche y gagne-t-elle une étape ?</b> L&apos;unité n&apos;est
              plus le palier : c&apos;est la zone — une chose sur laquelle on travaille sans en perdre une autre
              de vue. Une zone ne connaît que trois grandeurs : la place, la hauteur, la visée. Et la surface
              elle-même a une situation — fermée, entrouverte, à plat, tenue d&apos;une façon ou d&apos;une autre :
              <b>Fili conçoit pour des postures, pas pour des tailles d&apos;écran.</b>
            </p>
            <p className="muted">Les surfaces de cette page ne suivent pas la fenêtre. Chacune a sa propre
              largeur, et l&apos;interface qu&apos;elle contient ne connaît qu&apos;elle. C&apos;est la seule
              façon d&apos;essayer le modèle : sur un banc, pas sur un navigateur qu&apos;on étire.</p>
          </section>

          {/* ══════════ 01 · la visée ══════════ */}
          <section className="gdoc-sec set" id="aim">
            <div className="gdoc-sec-head">
              <p className="kicker">01 · La visée</p>
              <h2>Deux surfaces de même largeur, deux interfaces</h2>
              <p className="muted">Même nombre de pixels, même nombre de zones, même application. Ce qui change
              est ce avec quoi on vise. Un palier de largeur donne le même verdict aux deux.</p>
            </div>
            <div className="gdoc-body">
              <AimDemo />
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <p><b>Observation.</b> Une tablette et une fenêtre de bureau de même largeur ne se tiennent pas
                de la même main. Au doigt, une ligne de liste fait 56 px et l&apos;action est toujours visible ;
                au pointeur, 34 px suffisent et l&apos;action secondaire attend le survol. Un palier de largeur
                les confond — et une interface tablette finit en interface mobile agrandie.</p>
                <p><b>Règle.</b> La visée décide des cibles et de la densité ; la place décide de la structure.
                Deux décisions séparées, prises l&apos;une sans l&apos;autre.</p>
                <p><b>Réglage FILI.</b> Cibles 48 px au doigt, 32 px au pointeur — les valeurs de la famille
                tactile. L&apos;adaptation n&apos;en réécrit aucune.</p>
                <Rules ids={["z4"]} />
              </div></details>
            </div>
          </section>

          {/* ══════════ 02 · le seuil ══════════ */}
          <section className="gdoc-sec set" id="threshold">
            <div className="gdoc-sec-head">
              <p className="kicker">02 · Le seuil</p>
              <h2>La deuxième zone n&apos;arrive pas quand il y a plus de place — elle arrive quand il y en a assez</h2>
              <p className="muted">La liste a besoin de {W.list.rem} rem pour faire son travail, la fiche
              de {W.sheet.rem}. Tant que la place gagnée reste en dessous de leur somme, elle ne sert à rien
              et le montre. Personne n&apos;a écrit 712 px : c&apos;est une addition. Au-delà, la place gagnée va au
              contenu — la fiche — et la liste garde sa largeur de travail.</p>
            </div>
            <div className="gdoc-body">
              <ThresholdDemo />
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <p><b>Observation.</b> Une colonne sous sa largeur de travail tronque les titres et casse les
                champs : elle occupe de la place sans faire son travail. La colonne étranglée est la faute la
                plus répandue des mises en page fluides.</p>
                <p><b>Règle.</b> Une zone existe quand elle atteint sa largeur de travail — sinon elle n&apos;existe
                pas du tout. Le seuil est une somme, jamais un nombre posé. Et la fiche ne bouge pas d&apos;un
                pixel au passage du seuil : la liste s&apos;installe dans la place qui vient d&apos;être gagnée,
                exactement celle qui lui manquait — et la fiche ne rétrécit jamais sous ses {W.sheet.rem} rem.</p>
                <p><b>Réglage FILI.</b> Liste {W.list.rem} · gouttière {dec(ADAPTATION.gutter)} · fiche {W.sheet.rem} →
                {" "}{dec(THRESHOLD_TWO)} rem, recalculé au moteur, jamais écrit. Au-delà, la liste garde sa largeur de
                travail ({W.list.rem} à 20 rem) et la place gagnée va à la fiche : c&apos;est le contenu qui en a l&apos;emploi.</p>
                <Rules ids={["z2", "z5"]} />
              </div></details>
            </div>
          </section>

          {/* ══════════ 03 · l'étirement ══════════ */}
          <section className="gdoc-sec set" id="stretch">
            <div className="gdoc-sec-head">
              <p className="kicker">03 · L&apos;étirement</p>
              <h2>Plus de place ne veut jamais dire plus grand</h2>
              <p className="muted">Le même texte, la même surface, une seule poignée. En haut, la place est
              absorbée par les objets. En bas, elle est rendue au contenu.</p>
            </div>
            <div className="gdoc-body">
              <StretchDemo />
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <p><b>Observation.</b> Un titre qui grandit avec la fenêtre et une ligne de texte qui s&apos;allonge
                jusqu&apos;au bord donnent l&apos;impression d&apos;utiliser l&apos;écran. Ils font surtout lire plus
                loin pour la même information — au-delà de la mesure, l&apos;œil perd le début de la ligne
                suivante.</p>
                <p><b>Règle.</b> La place gagnée a trois emplois légitimes : montrer plus de contenu, rapprocher
                deux étapes, ou rester blanche. Agrandir n&apos;en fait pas partie, et le texte ne dépasse jamais
                sa mesure.</p>
                <p><b>Réglage FILI.</b> La colonne de contexte s&apos;ouvre à {W.prose.rem} + {dec(ADAPTATION.gutter)} + {W.context.rem} =
                {" "}{dec(THRESHOLD_PROSE)} rem. La mesure du texte courant reste une dette : trois valeurs en concurrence
                (16 px / 70, 17 px / 62, moteur 65ch), donc la largeur de travail du texte n&apos;est pas calculable.</p>
                <Rules ids={["z3", "z6"]} />
              </div></details>
            </div>
          </section>

          {/* ══════════ 04 · la hauteur ══════════ */}
          <section className="gdoc-sec set" id="height">
            <div className="gdoc-sec-head">
              <p className="kicker">04 · La hauteur</p>
              <h2>La hauteur décide du sort des panneaux</h2>
              <p className="muted">Un écran partagé, un pliable ouvert, une fenêtre écrasée : la largeur ne bouge
              pas, la hauteur s&apos;effondre. Une feuille de 300 px dans 340 px de haut n&apos;est plus une feuille.</p>
            </div>
            <div className="gdoc-body">
              <HeightDemo />
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <p><b>Observation.</b> Une feuille qui monte du bas promet qu&apos;on retrouvera la page derrière.
                Quand la hauteur manque, il n&apos;y a plus de derrière : un liseré de fond, une poignée sans
                course, et un formulaire qui défile dans une boîte qui défile.</p>
                <p><b>Règle.</b> Un panneau suit la hauteur : feuille au-dessus du plancher, page pleine en dessous.
                Ce qui est bloquant par nature — une confirmation destructive — ne suit pas la place : il
                n&apos;était pas là pour économiser de l&apos;espace.</p>
                <p><b>Réglage FILI.</b> Plancher {ADAPTATION.floorHeight} rem ; un clavier ouvert retire
                {" "}{W.halfKeyboard.rem} rem. Le protocole K4 pose 568 px (35,5 rem) en hauteur de référence : les deux
                valeurs doivent se rejoindre ou se dire.</p>
                <Rules ids={["h1"]} />
              </div></details>
            </div>
          </section>

          {/* ══════════ 05 · les segments ══════════ */}
          <section className="gdoc-sec set" id="segments">
            <div className="gdoc-sec-head">
              <p className="kicker">05 · Les segments</p>
              <h2>Le même appareil, trois places — et une place qui n&apos;est pas continue</h2>
              <p className="muted">Fermé, ouvert, ouvert mais partagé avec une autre application. Trois postures,
              aucune n&apos;est un appareil différent. Ce qui change est la place — et sur cet appareil, elle est
              coupée en deux segments que l&apos;œil ne franchit pas.</p>
            </div>
            <div className="gdoc-body">
              <SegmentsDemo />
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <p><b>Observation.</b> Un pliable ouvert mesure 800 px et n&apos;en offre jamais plus de 400 d&apos;un
                seul tenant. Une mise en page qui compte la largeur totale pose un titre à cheval sur la charnière
                et un bouton dans le creux.</p>
                <p><b>Règle.</b> La place se mesure par segments continus, pas en largeur totale. Un pli, une barre
                système, une découpe coupent la place ; une zone ne traverse jamais une coupure. Et les postures
                s&apos;enchaînent plusieurs fois par heure : revenir à l&apos;une rend exactement ce qu&apos;on y avait
                laissé — la bascule n&apos;est pas une navigation.</p>
                <p><b>Réglage FILI.</b> Deux zones quand chaque segment atteint sa largeur de travail — la liste
                ({W.list.rem} rem) à gauche, la fiche ({W.sheet.rem} rem) à droite, le pli pour gouttière.</p>
                <Rules ids={["p1", "z5"]} />
              </div></details>
            </div>
          </section>

          {/* ══════════ 06 · les plans ══════════ */}
          <section className="gdoc-sec set" id="planes">
            <div className="gdoc-sec-head">
              <p className="kicker">06 · Les plans</p>
              <h2>La posture décide, pas la taille de l&apos;écran</h2>
              <p className="muted">Un pliable garde les mêmes dimensions logiques et change radicalement de situation.
              Fermé, c&apos;est l&apos;écran extérieur qui travaille ; ouvert, l&apos;écran intérieur — deux surfaces,
              pas un écran qui grandit. Entrouvert, la charnière est une frontière physique : verticale, l&apos;appareil
              se tient comme un livre ; horizontale, comme un laptop — contenu en haut, commandes en bas. À plat,
              l&apos;écran est continu et la division se choisit, là où les largeurs de travail tombent. L&apos;angle
              n&apos;est qu&apos;une donnée : état physique → orientation → posture → règles → composition. Personne
              ne dessine 45°.</p>
            </div>
            <div className="gdoc-body">
              <PlanesDemo />
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <p><b>Observation.</b> Les plateformes ne raisonnent pas en largeur d&apos;écran sur ces appareils : Android
                expose l&apos;état du pli (à plat, semi-ouvert), l&apos;orientation de la charnière et son occlusion, et en
                déduit deux postures, <i>tabletop</i> et <i>book</i> ; Apple décrit l&apos;iPhone Duo par ses poses et ses
                régions réservées — la charnière, les caméras — et demande d&apos;adapter par classes de taille, pas par
                mise en page dédiée ; Samsung nomme Flex mode l&apos;appareil posé à demi ouvert, contenu en haut, commandes
                en bas ; le web a une posture (<code>device-posture: folded</code>) et des segments de viewport. Toutes
                disent la même chose : l&apos;écran extérieur et l&apos;écran intérieur sont deux surfaces, et la continuité
                de l&apos;état entre les deux est un dû.</p>
                <p><b>Observation.</b> Entrouvert, la liste reste sous les yeux pendant qu&apos;on travaille le message :
                un aller-retour en moins, sans un pixel de plus. Le pli ne retire pas de place, il la divise en
                plans — et chaque plan a le format de l&apos;écran fermé (1 / 1,4) : le pliable ne réclame pas un
                troisième gabarit, il en réclame deux qu&apos;on a déjà.</p>
                <p><b>Règle.</b> Une interface s&apos;adapte à la situation d&apos;usage de sa surface, pas simplement à sa
                taille. Quatre états physiques pour une charnière — fermé (0°), semi-ouvert (1 à 90°), largement ouvert
                (91 à 179°), à plat (180°) — et quatre postures aujourd&apos;hui : Mobile, Livre, Laptop, Tablet. Les
                deux états entrouverts restent distincts : la relation entre les surfaces, leur visibilité et les usages
                ne sont plus les mêmes ; la posture, elle, est la même. Ce sont des seuils d&apos;état, pas des points de
                rupture : le designer écrit ce qui doit survivre au changement de posture — ce qui est prioritaire, ce
                qui reste ensemble, ce qui peut changer de surface, ce qui ne traverse jamais une frontière physique —
                et Fili l&apos;interprète dans chaque posture. Les dimensions restent une variable : un Mobile de 320 px et
                un Mobile de 500 px n&apos;ont pas les mêmes contraintes ; elles ne décident plus seules.</p>
                <p><b>Règle.</b> Une frontière choisie se place où les largeurs de travail la font tomber, et peut être
                décentrée. Une frontière imposée est médiane, orientée par la tenue, et elle prime : la composition
                se recale dessus. Le premier plan porte le contexte, le second le travail et la saisie ; le contenu ne
                change pas de plan quand la frontière se recale — elle glisse, il reste. Un composant de saisie suit
                les mains : entier sous la portée des pouces, scindé au-delà, seul objet qui ait le droit de traverser
                une frontière. Le clavier est une couche, pas une zone.</p>
                <p><b>Réglage FILI.</b> Portée {ADAPTATION.reach} rem, demi-clavier {W.halfKeyboard.rem} rem. La portée
                reste une observation tant que ses deux sources ne sont pas nommées — la reprise tactile avait
                rétrogradé la zone d&apos;atteinte.</p>
                <p><b>Réglage FILI.</b> Le vocabulaire des postures vit au moteur (<code>POSTURE</code>) : une posture
                s&apos;y ajoute sans toucher au principe. Le banc n&apos;a qu&apos;une charnière ; la doctrine n&apos;en a pas
                qu&apos;une.</p>
                <Rules ids={["s1", "s2", "p3", "v3"]} />
              </div></details>
            </div>
          </section>

          {/* ═══ LE RÉPERTOIRE — une seule section (au gabarit des autres pages) : les
              trois grandeurs, les règles en liste, les largeurs de travail, les surfaces
              du banc. ═══ */}
          <section className="gdoc-sec set" id="registry">
            <div className="gdoc-sec-head">
              <p className="kicker">07 · Le registre</p>
              <h2>Trois grandeurs, quatre postures, des largeurs de travail, aucun palier</h2>
              <p className="muted">Ce qu&apos;une zone mesure, les règles qui ne se photographient pas, les états
              d&apos;un pliable et les postures qu&apos;on en lit, les largeurs qui font les seuils, et onze surfaces qui
              disent la même chose que les six scènes en une ligne chacune. Aucune règle de cette page n&apos;est acquise : ni mesure décidable au banc, ni
              piégée, ni séance de passage.</p>
            </div>
            <div className="gdoc-body">
              <div className="doc-piece" id="invisibles">
                <div className="doc-piece-head">
                  <h3>Les règles</h3>
                  <p className="muted">Elles se vérifient sur l&apos;écran allumé, dans le code quand la mesure
                  sera écrite, ou nulle part — et alors elles s&apos;assument comme un choix, daté.</p>
                </div>
                <ListRules lines={LIST} />
                <details className="prov"><summary>Règles &amp; sources</summary><div>
                  <Rules ids={["z1", "z2", "z3", "z4", "z5", "z6"]} />
                </div></details>
              </div>

              <div className="doc-piece" id="sizes">
                <div className="doc-piece-head">
                  <h3>Les trois grandeurs d&apos;une zone</h3>
                </div>
                <div className="ad-cards">
                  <div className="ad-card"><h4>La place</h4><p>La largeur utile du conteneur, jamais celle de l&apos;écran — mesurée par segments continus. Elle dit combien de zones tiennent.</p><span className="val">mesurée sur le conteneur</span></div>
                  <div className="ad-card"><h4>La hauteur</h4><p>Elle dit si une zone est consultable ou seulement présente, et décide du sort des panneaux.</p><span className="val">plancher {ADAPTATION.floorHeight} rem · demi-clavier {W.halfKeyboard.rem} rem</span></div>
                  <div className="ad-card"><h4>La visée</h4><p>Deux moitiés. La <b>précision</b> — doigt ou pointeur — décide des cibles et de la densité (famille tactile). La <b>portée</b> — où la main arrive — décide de quel segment reçoit l&apos;action.</p><span className="val">cibles 48 / 32 px · portée ≈ {ADAPTATION.reach} rem (observation)</span></div>
                </div>
              </div>

              <div className="doc-piece" id="postures">
                <div className="doc-piece-head">
                  <h3>Les états d&apos;un pliable, et les postures qu&apos;on en lit</h3>
                  <p className="muted">Un appareil à une charnière. L&apos;état se lit sur l&apos;angle, la posture sur
                  l&apos;état et la tenue. Quatre postures aujourd&apos;hui : un vocabulaire, pas une liste définitive.</p>
                </div>
                <div className="ad-table">
                  <table className="doc-list ad-postures">
                    <thead><tr><th scope="col">L&apos;état physique</th><th scope="col">Ouverture</th><th scope="col">Ce qui se passe</th><th scope="col">Surface active</th><th scope="col">Charnière verticale</th><th scope="col">Charnière horizontale</th></tr></thead>
                    <tbody>
                      {POSTURE.states.map((st) => (
                        <tr key={st.key}><td><span className="l-name">{st.name}</span></td>
                          <td className="num">{st.from === st.to ? `${st.from}°` : `${st.from}–${st.to}°`}</td>
                          <td className="l-says">{st.says}</td>
                          <td className="l-says">{st.surface === "outer" ? "écran extérieur" : "écran intérieur"}</td>
                          <td className="l-or code">{POSTURE.of(st.from, "vertical").name}</td>
                          <td className="l-or code">{POSTURE.of(st.from, "horizontal").name}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="doc-piece" id="widths">
                <div className="doc-piece-head">
                  <h3>Les largeurs de travail</h3>
                  <p className="muted">Ce qu&apos;il faut à une zone pour faire son travail sans se casser. Les
                  seuils en découlent — {dec(THRESHOLD_TWO)} rem pour liste + fiche, ≈ {dec(THRESHOLD_PROSE)} rem pour
                  détail rédigé + contexte, ≈ 71 rem pour trois zones — et ne s&apos;écrivent nulle part : ils se
                  recalculent, comme les rayons descendent du rayon racine.</p>
                </div>
                <div className="ad-table">
                  <table className="doc-list ad-widths">
                    <thead><tr><th scope="col">La zone</th><th scope="col">Sa largeur de travail</th><th scope="col">Ce qu&apos;elle protège</th></tr></thead>
                    <tbody>
                      {WIDTHS.map((l) => (
                        <tr key={l.zone}><td><span className="l-name">{l.zone}</span></td><td className={l.debt ? "l-or author" : "l-or code"}>{l.width}</td><td className="l-says">{l.protects}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="doc-piece" id="surfaces">
                <div className="doc-piece-head">
                  <h3>Onze surfaces au banc</h3>
                  <p className="muted">Les deux lignes marquées ont la même largeur et pas la même interface. Le
                  téléphone compact et la fenêtre desktop étroite ont le même nombre de zones et pas la même
                  densité. Le pliable entrouvert mesure 800 px et n&apos;en offre jamais plus de 400 d&apos;un seul
                  tenant. Aucun palier de largeur ne sait dire l&apos;un ni l&apos;autre.</p>
                </div>
                <div className="ad-table">
                  <table className="doc-list ad-surfaces">
                    <thead><tr><th scope="col">La surface</th><th scope="col">Place (px)</th><th scope="col">Hauteur</th><th scope="col">Visée</th><th scope="col">Zones</th></tr></thead>
                    <tbody>
                      {SURFACES.map(([s, w, h, v, z, marked]) => (
                        <tr key={s} className={marked ? "marked" : ""}><td><span className="l-name">{s}</span></td><td className="num">{w}</td><td className="l-says">{h}</td><td className="l-says">{v}</td><td className="l-says">{z}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* ═══ LE CODE — une section à part, après le registre : ce qu'on écrit,
              ce que ça produit, lu au moteur (ADAPTATION). ═══ */}
          <section className="gdoc-sec set" id="code">
            <div className="gdoc-sec-head">
              <p className="kicker">08 · Le code</p>
              <h2>Le moteur</h2>
              <p className="muted">Chaque seuil est une somme lue au moteur, jamais recopiée. Un seuil qui tombe
              sur une largeur d&apos;appareil est un seuil copié.</p>
            </div>
            <div className="gdoc-body">
              <PanelRegistry lines={CODE} />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
