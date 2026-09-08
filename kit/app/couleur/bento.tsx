"use client";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { contrast, lchToHex, oklabToRgb, rgbToHex } from "../../derivation.mjs";
import { Aurore } from "../aurore";

/* ═══════════════════════════════════════════════════════════════════════
   LE BENTO — l'objet en situation de la page Couleur (25 août 2026).
   Décision d'Auteur : seul ce bloc du test hors kit entre au kit, à la
   place du tableau de gare. Le tableau de bord « Apprentissage » (les
   trois vues de l'Auteur) en grille bento : photo, chiffre, étiquettes,
   liste, mot du mentor, vide, session. Aucune valeur de couleur ici : tout
   est un rôle, et chaque tuile le dit au survol ou au focus.

   · Le texte sur l'image n'est JAMAIS nu (M2) : un voile aux couleurs de
     bg, dont l'opacité est CALCULÉE (M3), refaite à chaque largeur et à
     chaque changement de thème ou de primaire. --bn-voile est posée par
     le calcul, jamais à la main. L'image est l'AURORE en code (25 août,
     décision d'Auteur : « on la met à la place de l'illustration ») : un
     dessin dont on connaît toutes les couleurs — le pire pixel devient
     la pire couleur du dessin, lue au rendu, ce qui est plus sévère qu'une
     lecture de pixels (elle est prise à pleine opacité, où qu'elle soit).
   · Le mot du mentor est SUR FOND MARQUE (Auteur, 25 août — après deux
     essais avec un formulaire : « il nous faut un contenu éditorial avec
     grosse typo ») : c'est le geste de couleur de l'écran. Une seule
     encre déclarée, on-primary, en corps d'affiche ; aucun contrôle.
   · Le canal redondant (C6) : « en ligne » = point + mot ; le delta =
     flèche + signe.
   · Pas d'état désactivé (C11).
   · Photos versées au dépôt (public/bento/photos) : les huit portraits
     des trois vues. Le visuel d'ambiance (aurore.jpg remis par l'Auteur)
     est remplacé par l'aurore en code, qui suit la marque et le thème.
   ═══════════════════════════════════════════════════════════════════════ */

const PHOTOS = "/bento/photos";

/* ── hex ↔ rgb, lus sur le rendu ── */
function hexOf(css: string): string {
  const s = css.trim();
  if (s.startsWith("#")) return s.length === 4 ? "#" + s.slice(1).split("").map((c) => c + c).join("") : s.toUpperCase();
  const m = s.match(/[\d.]+/g);
  if (!m) return "#000000";
  return "#" + m.slice(0, 3).map((v) => Math.round(Number(v)).toString(16).padStart(2, "0")).join("").toUpperCase();
}
const rgbOf = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const hexRgb = (r: number[]) => "#" + r.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("").toUpperCase();

/* ── Les couleurs du dessin, lues au rendu. L'aurore déclare ses rôles
   (--aur-…) en couleurs relatives ; le navigateur les rend en oklch, oklab,
   color(srgb) ou rgb : chacune est ramenée en hex par le moteur. ── */
const ROLES_AURORE = ["--aur-purple", "--aur-purple-strong", "--aur-blue", "--aur-blue-strong", "--aur-teal", "--aur-teal-light",
  "--aur-core", "--aur-mount", "--aur-mount-shadow", "--aur-mount-shadow-2", "--aur-mount-ridge", "--aur-haze", "--bg"];
function hexRender(css: string): string | null {
  const s = css.trim();
  const numbers = (t: string) => (t.match(/-?[\d.]+(?:e-?\d+)?%?/g) ?? []).map((v) => (v.endsWith("%") ? parseFloat(v) / 100 : parseFloat(v)));
  if (s.startsWith("#") || s.startsWith("rgb")) return hexOf(s);
  if (s.startsWith("oklch(")) { const [L = 0, C = 0, H = 0] = numbers(s.slice(6)); const lch: [number, number, number] = [L, C, Number.isFinite(H) ? H : 0]; return lchToHex(lch); }
  if (s.startsWith("oklab(")) { const [L = 0, a = 0, b = 0] = numbers(s.slice(6)); const lab: [number, number, number] = [L, a, b]; const [r = 0, g = 0, bl = 0] = oklabToRgb(lab); const rgb: [number, number, number] = [r, g, bl]; return rgbToHex(rgb); }
  if (s.startsWith("color(srgb")) { const [r = 0, g = 0, b = 0] = numbers(s.slice(10)); const rgb: [number, number, number] = [r, g, b]; return rgbToHex(rgb); }
  return null;
}
function colorsOfDrawing(card: HTMLElement): number[][] | null {
  const probe = document.createElement("span");
  probe.style.position = "absolute"; probe.style.visibility = "hidden";
  card.appendChild(probe);
  const readSet: number[][] = [];
  for (const role of ROLES_AURORE) {
    probe.style.color = `var(${role})`;
    const hex = hexRender(getComputedStyle(probe).color);
    if (hex) readSet.push(rgbOf(hex));
  }
  probe.remove();
  return readSet.length ? readSet : null;
}

/* ── Le voile est un calcul (M3) : les couleurs du dessin sont lues au
   rendu, et l'opacité minimale du voile qui fait tenir l'encre à 4,5:1
   sur la PIRE d'entre elles est cherchée par dichotomie. Retourne null
   quand elles sont illisibles — le voile est alors opaque, sûr par
   construction. ── */
function computeVeil(card: HTMLElement): { alpha: number; worst: number } | null {
  const band = card.querySelector<HTMLElement>(".bn-band");
  if (!band) return null;
  const pixels = colorsOfDrawing(card);
  if (!pixels) return null;
  const cs = getComputedStyle(band);
  const veil = rgbOf(hexOf(cs.getPropertyValue("--bg"))), ink = hexOf(cs.color);
  const worst = (a: number) => {
    let min = Infinity;
    for (const p of pixels) { const ct = contrast(ink, hexRgb(p.map((v, i) => a * veil[i] + (1 - a) * v))); if (ct < min) min = ct; }
    return min;
  };
  let lo = 0, hi = 1, alpha = 1;
  if (worst(0) >= 4.5) alpha = 0;
  else for (let i = 0; i < 18; i++) { const m = (lo + hi) / 2; if (worst(m) >= 4.5) { alpha = m; hi = m; } else lo = m; }
  alpha = Math.min(1, alpha + 0.02); /* marge : la composition du navigateur arrondit */
  return { alpha, worst: worst(alpha) };
}

function Roles({ children }: { children: React.ReactNode }) {
  return <p className="bn-roles">{children}</p>;
}
const R = ({ n }: { n: string }) => <b>{n}</b>;

export function Bento({ key }: { key: string }) {
  const cardRef = useRef<HTMLElement>(null);
  const [veil, setVeil] = useState<{ alpha: number; worst: number } | null>(null);

  /* le voile, refait à chaque largeur, et à chaque thème / primaire (cle) */
  useEffect(() => {
    const card = cardRef.current; if (!card) return;
    let t: ReturnType<typeof setTimeout> | undefined;
    const redo = () => { clearTimeout(t); t = setTimeout(() => setVeil(computeVeil(card)), 60); };
    const ro = new ResizeObserver(redo);
    ro.observe(card);
    redo();
    return () => { clearTimeout(t); ro.disconnect(); };
  }, [key]);

  const veilStyle = { ["--bn-veil" as string]: veil ? veil.alpha.toFixed(3) : "1" } as React.CSSProperties;

  return (
    <div className="bn" role="group" aria-label="Tableau de bord d'apprentissage">

      <article className="bn-tile bn-photo" ref={cardRef} style={veilStyle}>
        <Aurore className="bn-aurore" framing="sky" />
        <div className="bn-band">
          <p className="kicker">Votre parcours · 68 % terminé</p>
          <h3>Donnez toute sa place au travail dont vous êtes fier.</h3>
          <div className="rank">
            <button className="button on" type="button">Continuer à apprendre</button>
            <span className="bn-veil-says">
              {veil ? `voile ${Math.round(veil.alpha * 100)} % · pire couleur du dessin ${veil.worst.toFixed(2).replace(".", ",")}:1` : "voile opaque — couleurs non lues"}
            </span>
          </div>
        </div>
        <Roles><span>fond <R n="bg" /> en voile</span><span>encre <R n="text-primary" /></span><span>marque <R n="primary" /> · <R n="on-primary" /></span><span>état <R n="—" /></span></Roles>
      </article>

      <article className="bn-tile bn-stat" tabIndex={0} aria-label="Temps d'apprentissage cette semaine">
        <p className="bn-sub">Cette semaine</p>
        <p className="bn-value">12<small>h 40</small></p>
        <svg className="bn-curve" viewBox="0 0 76 40" preserveAspectRatio="none" aria-hidden="true">
          <rect x="0" y="26" width="8" height="14" rx="1" /><rect x="11" y="18" width="8" height="22" rx="1" />
          <rect x="22" y="24" width="8" height="16" rx="1" /><rect x="33" y="12" width="8" height="28" rx="1" />
          <rect x="44" y="20" width="8" height="20" rx="1" /><rect x="55" y="6" width="8" height="34" rx="1" />
          <rect className="today" x="66" y="0" width="8" height="40" rx="1" />
        </svg>
        <p><span className="bn-delta"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 13V3m0 0L3 8m5-5 5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>+18 %<span className="sr-only"> de plus que la semaine passée</span></span></p>
        <Roles><span>fond <R n="bg" /></span><span>encre <R n="text-primary" /> · <R n="text-secondary" /></span><span>marque <R n="primary" /> · <R n="primary-subtle" /></span><span>état <R n="success-subtle" /> · <R n="on-success-subtle" /></span></Roles>
      </article>

      <article className="bn-tile bn-tags" tabIndex={0} aria-label="Vos parcours">
        <div className="bn-head"><p className="bn-heading">Vos parcours</p></div>
        <p className="bn-labels">
          <span className="badge">Design UI/UX</span>
          <span className="badge info">Dev Front-end</span>
          <span className="badge info">Identité de marque</span>
          <span className="badge warning"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2 1.5 13.5h13L8 2Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="M8 6.5v3.2M8 11.6v.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>Places limitées</span>
        </p>
        <Roles><span>fond <R n="bg" /></span><span>marque <R n="primary-subtle" /> · <R n="on-primary-subtle" /></span><span>état <R n="info-subtle" /> · <R n="warning-subtle" /> + leurs encres</span></Roles>
      </article>

      <article className="bn-tile bn-list">
        <div className="bn-head"><p className="bn-heading">Vos mentors</p><a href="#situation">Tout voir</a></div>
        <div className="bn-lines">
          {/* trois statuts, trois tons sémantiques (Auteur, 25 août) : en ligne = success,
              hors ligne = danger, ne pas déranger = warning — toujours avec le mot (C6) */}
          {([["01", "Inès Diallo", "Design UI/UX", "online", "en ligne"], ["05", "Elias Moreau", "Développement front-end", "offline", "hors ligne"], ["07", "Noé Bernard", "Identité de marque", "busy", "ne pas déranger"]] as [string, string, string, string, string][]).map(([n, name, material, status, word]) => (
            <a key={n} className="bn-line" href="#situation">
              <img className="bn-avatar" src={`${PHOTOS}/portrait-${n}.jpg`} alt="" width={48} height={48} />
              <span className="bn-who"><span className="bn-name">{name}</span><span className="bn-ter">{material}</span></span>
              <span className={`bn-status ${status}`}>{word}</span>
            </a>
          ))}
        </div>
        <Roles><span>fond <R n="bg" /> · survol <R n="surface-hover" /></span><span>encre <R n="text-primary" /> · <R n="text-secondary" /></span><span>lien <R n="primary-text" /></span><span>état <R n="success" /> · <R n="danger" /> · <R n="warning" /> (point + mot)</span></Roles>
      </article>

      <article className="bn-tile bn-word" tabIndex={0} aria-label="Le mot du mentor">
        <p className="kicker">Le mot du mentor</p>
        <blockquote className="bn-quote">
          <p>Le design, c’est décider ce qu’on ne fera pas.</p>
          <footer>Inès Diallo · Design UI/UX</footer>
        </blockquote>
        <Roles><span>fond <R n="primary" /></span><span>encre <R n="on-primary" /> — une seule, en serif d&apos;affiche (<R n="font-serif" />)</span><span>état <R n="—" /></span></Roles>
      </article>

      <article className="bn-tile bn-empty" tabIndex={0} aria-label="Notifications">
        <div className="bn-head"><p className="bn-heading">Notifications</p></div>
        <div className="bn-empty-body">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 17V11a6 6 0 0 1 12 0v6l1.5 2h-15L6 17Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M10 21h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          <p className="bn-empty-heading">Rien de nouveau</p>
          <p>Vous êtes à jour. Les messages de vos mentors arriveront ici.</p>
        </div>
        <Roles><span>fond <R n="bg" /></span><span>encre <R n="text-primary" /> · <R n="text-secondary" /></span><span>icône <R n="border-strong" /></span><span>état <R n="empty" /> — aucune couleur</span></Roles>
      </article>

      <article className="bn-tile bn-session">
        <p className="bn-date">Jeu. 28 août · 18:00</p>
        <p className="bn-heading">Critique de maquette</p>
        <p className="bn-sub">Avec Inès Diallo · 12 places</p>
        <p><a className="bn-link" href="#situation">Voir le programme</a></p>
        <Roles><span>fond <R n="bg" /></span><span>encre <R n="text-primary" /> · <R n="text-secondary" /></span><span>lien <R n="primary-text" /></span><span>état <R n="—" /></span></Roles>
      </article>

    </div>
  );
}
