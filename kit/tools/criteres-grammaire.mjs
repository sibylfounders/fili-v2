// ─────────────────────────────────────────────────────────────────────────────
// La grammaire `CRITERE` — compilateur et évaluateur, isolés de tout harnais.
//
// Deux consommateurs : `execute-criteres.mjs` (le moteur, dans Chromium) et
// `teste-criteres.mjs` (le test de non-régression, dans jsdom). Ils partagent
// ce fichier pour qu'aucun des deux ne puisse dériver de l'autre.
//
// Table des prédicats : FERMÉE. Un critère qui aurait besoin d'un prédicat
// absent ne se compile pas — il remonte comme MANQUE. On n'improvise pas un
// prédicat, on l'arbitre et on l'ajoute d'un coup (MISSING-COMPONENT-PROTOCOL
// appliqué au moteur).
// ─────────────────────────────────────────────────────────────────────────────
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Prédicats VALIDÉS mais qu'on ne sait pas encore évaluer, et pourquoi.
 * Un critère qui les emploie ne se compile pas : il remonte comme manque, avec
 * le motif exact. C'est le seul moyen de ne pas confondre « la règle est
 * respectée » avec « on n'a pas su regarder ».
 */
export const SANS_MECANISME = {
  declare_exception:
    "aucune convention DOM ne permet à un élément de déclarer une exception nommée " +
    "(inline, essentiel…). Il faut d'abord décider comment un code client la déclare.",
};

export const PREDICATS = new Set([
  "porte", "mesure", "contraste", "pointe_vers_existant", "dans", "declare_exception",
  // Ajouts du 2026-07-31, côté FEUILLE DE STYLE (instrument statique).
  "unites_seules", "clamp_avec_rem",
  // Ajouts du 2026-07-31, couche UX (loi 4.20). Ils expriment deux notions
  // définies par la norme elle-même, pas par nous : le NOM ACCESSIBLE (WCAG
  // 4.1.2) et l'ÉTIQUETTE VISIBLE d'un champ (WCAG 3.3.2).
  "nomme", "etiquete_visible",
]);

/** Les formes qui portent sur les valeurs DÉCLARÉES et non sur le document. */
export const FORMES_STATIQUES = new Set(["chaque_valeur", "aucune_valeur"]);

/** Ramasse les critères du corpus. Le moteur ne connaît AUCUNE règle en dur. */
export function litLeCorpus(doctrine) {
  const out = [];
  for (const f of readdirSync(doctrine).filter((n) => n.endsWith(".json"))) {
    const fiche = JSON.parse(readFileSync(join(doctrine, f), "utf8"));
    for (const d of fiche.decisions || []) {
      if (!d.critere) continue;
      out.push({ id: d.id, critere: d.critere, scene: d.scene || "repos",
                 mesure: d.mesure, enonce: d.enonce, statut: d.statut });
    }
  }
  return out.sort((a, b) => a.id.localeCompare(b.id));
}

/** Trois formes, rien de plus : compte() / chaque() / aucun(). */
export function compile(c, manques) {
  const m = c.critere.match(/^(compte|chaque|aucun|suite|chaque_valeur|aucune_valeur)\(\s*"([^"]+)"\s*\)\s*(.*)$/);
  if (!m) { manques.push({ id: c.id, raison: "forme non reconnue", texte: c.critere }); return null; }
  const [, forme, selecteur, reste] = m;

  // suite() ne parle pas d'un élément mais d'une SÉQUENCE : elle ne peut donc pas
  // s'écrire comme un prédicat élément par élément (le § 2 du cahier de lot la
  // rangeait à tort dans la table des prédicats). C'est une quatrième forme.
  if (forme === "suite") {
    if (reste.trim() !== "sans_saut") {
      manques.push({ id: c.id, raison: "suite() n'admet que « sans_saut »", texte: reste });
      return null;
    }
    return { id: c.id, scene: c.scene || "repos", forme, selecteur };
  }

  if (forme === "compte") {
    const o = reste.match(/^(==|!=|<=|>=|<|>)\s*(-?\d+)$/);
    if (!o) { manques.push({ id: c.id, raison: "comparaison illisible", texte: reste }); return null; }
    return { id: c.id, scene: c.scene || "repos", forme, selecteur, op: o[1], n: Number(o[2]) };
  }

  const jetons = reste.split(/\s+(et|ou)\s+/);
  const termes = [], liants = [];
  for (let i = 0; i < jetons.length; i++) {
    if (i % 2) { liants.push(jetons[i]); continue; }
    const p = jetons[i].match(/^([a-z_]+)\(\s*([^)]*)\s*\)\s*(?:(==|!=|<=|>=|<|>)\s*(\S+))?$/);
    if (!p) { manques.push({ id: c.id, raison: "prédicat illisible", texte: jetons[i] }); return null; }
    if (!PREDICATS.has(p[1])) {
      manques.push({ id: c.id, raison: `prédicat absent de la table fermée : ${p[1]}`, texte: jetons[i] });
      return null;
    }
    if (SANS_MECANISME[p[1]]) {
      manques.push({ id: c.id, raison: `prédicat sans mécanisme : ${SANS_MECANISME[p[1]]}`, texte: jetons[i] });
      return null;
    }
    termes.push({
      nom: p[1], arg: p[2].replace(/^"|"$/g, ""),
      op: p[3] || null, val: p[4] ? p[4].replace(/^"|"$/g, "") : null,
    });
  }
  // Précédence : « et » lie plus fort que « ou » — `A et B ou C` vaut `(A et B) ou C`.
  // Une somme de conjonctions suffit à tout ce que le corpus demande ; il n'y a pas
  // de parenthèses dans la grammaire, et il n'y en aura pas tant qu'aucune règle
  // n'en aura besoin.
  const groupes = [[termes[0]]];
  for (let i = 0; i < liants.length; i++) {
    if (liants[i] === "et") groupes[groupes.length - 1].push(termes[i + 1]);
    else groupes.push([termes[i + 1]]);
  }
  return { id: c.id, scene: c.scene || "repos", forme, selecteur, groupes, termes,
           statique: FORMES_STATIQUES.has(forme) };
}

/**
 * L'évaluateur. Sérialisé tel quel dans la page (Chromium) ou appelé dans le
 * contexte jsdom : il ne referme sur rien, tout passe par ses arguments.
 */
export function evalueDansLaPage(programme) {
  const out = [];
  // « Visible » ne peut pas vouloir dire « a une boîte ». Un champ natif conservé
  // en `opacity:0 / aria-hidden / tabindex=-1` derrière un composant sur mesure a
  // une boîte, et n'existe ni pour l'œil ni pour la technologie d'assistance.
  // Le condamner est un faux positif ; `aria-hidden="true"` le retire de l'arbre
  // d'accessibilité — une règle d'accessibilité n'a rien à y mesurer.
  const visible = (el) => {
    if (!el.getClientRects().length) return false;
    if (el.closest("[aria-hidden=true]")) return false;
    const vue = el.ownerDocument.defaultView;
    for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
      const st = vue.getComputedStyle(n);
      if (st.visibility === "hidden" || st.visibility === "collapse") return false;
      if (st.display === "none") return false;
      if (parseFloat(st.opacity) === 0) return false;
      if (st.contentVisibility === "hidden") return false;
    }
    return true;
  };
  const etiquette = (el) => (el.textContent || el.getAttribute("aria-label") || el.tagName).trim().slice(0, 40);

  // `CSS.escape` est une globale de navigateur : absente sous jsdom, et le test de
  // non-régression y tourne. On compare l'attribut au lieu de l'échapper.
  const labelPour = (el) => {
    if (!el.id) return null;
    const doc = el.ownerDocument;
    for (const l of doc.querySelectorAll("label[for]"))
      if (l.getAttribute("for") === el.id) return l;
    return null;
  };

  const evalueTerme = (el, t) => {
    switch (t.nom) {
      case "porte": {
        const i = t.arg.indexOf("=");
        const a = i < 0 ? t.arg : t.arg.slice(0, i);
        const v = i < 0 ? undefined : t.arg.slice(i + 1);
        if (!el.hasAttribute(a)) return { ok: false, quoi: `sans ${a}` };
        if (v !== undefined && el.getAttribute(a) !== v) return { ok: false, quoi: `${a}="${el.getAttribute(a)}"` };
        return { ok: true };
      }
      case "pointe_vers_existant": {
        // Un élément peut désigner PLUSIEURS identifiants morts. Chacun est une
        // occurrence : s'arrêter au premier ferait disparaître les suivants du
        // rapport, et un rapport incomplet se lit comme un rapport propre.
        const morts = [];
        for (const a of t.arg.split("|")) {
          const brut = el.getAttribute(a);
          if (!brut) continue;
          for (const id of brut.split(/\s+/).filter(Boolean))
            if (!el.ownerDocument.getElementById(id))
              morts.push(`${el.tagName.toLowerCase()} ${a}="${id}"`);
        }
        return morts.length ? { ok: false, quoi: morts[0], tous: morts } : { ok: true };
      }
      case "nomme": {
        // Nom accessible, dans l'ordre de résolution de la norme. On s'arrête au
        // premier qui existe ; `placeholder` n'en est PAS un (il disparaît à la
        // saisie) et `title` seul est un repli que la norme tolère mal — on le
        // retient, mais on le nomme dans le motif pour qu'il se voie au rapport.
        const doc = el.ownerDocument;
        const texte = (n) => (n.textContent || "").trim();
        if (el.getAttribute("aria-labelledby")) {
          const ids = el.getAttribute("aria-labelledby").split(/\s+/).filter(Boolean);
          const cibles = ids.map((i) => doc.getElementById(i)).filter(Boolean);
          if (cibles.length && cibles.some((c) => texte(c))) return { ok: true };
          return { ok: false, quoi: `aria-labelledby pointe dans le vide` };
        }
        if ((el.getAttribute("aria-label") || "").trim()) return { ok: true };
        // Un label associé (for=, ou englobant) nomme le contrôle.
        const pour = labelPour(el);
        if (pour && texte(pour)) return { ok: true };
        const englobant = el.closest("label");
        if (englobant && texte(englobant)) return { ok: true };
        if (texte(el)) return { ok: true };                    // texte visible propre
        const img = el.querySelector("img[alt], svg title, [role=img][aria-label]");
        if (img && (texte(img) || (img.getAttribute("alt") || "").trim() || (img.getAttribute("aria-label") || "").trim()))
          return { ok: true };
        if ((el.getAttribute("title") || "").trim()) return { ok: true, quoi: "nomme par title seul" };
        if ((el.getAttribute("value") || "").trim() && /^(input)$/i.test(el.tagName)) return { ok: true };
        return { ok: false, quoi: `${el.tagName.toLowerCase()} sans nom accessible` };
      }
      case "etiquete_visible": {
        // WCAG 3.3.2 : une ÉTIQUETTE, pas seulement un nom accessible. Un
        // aria-label suffit au lecteur d'écran et ne suffit pas à l'œil : ce que
        // cette règle protège, c'est la personne qui VOIT le champ sans savoir
        // ce qu'on lui demande.
        const doc = el.ownerDocument;
        const visible2 = (n) => !!(n && visible(n) && (n.textContent || "").trim());
        if (visible2(labelPour(el))) return { ok: true };
        const englobant = el.closest("label");
        if (visible2(englobant)) return { ok: true };
        const par = el.getAttribute("aria-labelledby");
        if (par) {
          const cibles = par.split(/\s+/).filter(Boolean).map((i) => doc.getElementById(i));
          if (cibles.some((c) => visible2(c))) return { ok: true };
        }
        const nom = (el.getAttribute("aria-label") || "").trim();
        const ph = (el.getAttribute("placeholder") || "").trim();
        if (nom) return { ok: false, quoi: `aria-label « ${nom.slice(0, 24)} » mais aucune etiquette VISIBLE` };
        if (ph) return { ok: false, quoi: `placeholder « ${ph.slice(0, 24)} » tenant lieu d etiquette` };
        return { ok: false, quoi: `${el.tagName.toLowerCase()} sans etiquette` };
      }
      case "contraste": {
        // Rapport de contraste WCAG entre deux couleurs RÉSOLUES par le navigateur.
        // Rien n'est simulé : ce qui ne peut pas être établi ressort « non
        // concluant », jamais « conforme » (loi 4.5).
        const doc = el.ownerDocument, vue = doc.defaultView;
        const direct = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
        if (!direct) return { ok: true, horsSujet: true }; // pas de texte propre : rien à mesurer
        const rgba = (c) => {
          const m = c.match(/^rgba?\(([^)]+)\)$/);
          if (!m) return null;
          const v = m[1].split(",").map((x) => parseFloat(x));
          return { r: v[0], v: v[1], b: v[2], a: v.length > 3 ? v[3] : 1 };
        };
        const canal = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
        const lum = (c) => 0.2126 * canal(c.r) + 0.7152 * canal(c.v) + 0.0722 * canal(c.b);
        const sur = (haut, bas) => ({
          r: haut.r * haut.a + bas.r * (1 - haut.a),
          v: haut.v * haut.a + bas.v * (1 - haut.a),
          b: haut.b * haut.a + bas.b * (1 - haut.a), a: 1,
        });
        const [nomAvant] = t.arg.split(",").map((x) => x.trim());
        const avant = rgba(vue.getComputedStyle(el).getPropertyValue(nomAvant || "color"));
        if (!avant) return { inconnu: "couleur de texte non résoluble" };
        let fonds = null, n = el, opac = 1; const pile = [];
        while (n && n.nodeType === 1) {
          const st = vue.getComputedStyle(n);
          const img = st.backgroundImage;
          if (img && img !== "none") {
            // Tentation écartée : prendre le pire arrêt du dégradé. COLOR-R21 dit
            // « le pixel le plus défavorable » — SOUS LE TEXTE, pas sur l'élément
            // entier. Un titre posé sur la moitié sombre d'un dégradé passe, et le
            // condamner sur l'arrêt clair de l'autre bout est un faux positif.
            // Établir la vérité demande d'échantillonner les pixels rendus. Tant
            // que ce mécanisme n'existe pas : non concluant (loi 4.5).
            return { inconnu: `fond en ${/gradient\(/.test(img) ? "degrade" : "image"} sur ${n.tagName.toLowerCase()} — le pire pixel se mesure SOUS le texte (COLOR-R21), il faut echantillonner` };
          }
          const c = rgba(st.backgroundColor);
          if (c && c.a === 1) {
            // Élément porteur du fond opaque. Si LUI est translucide, le fond et
            // le texte se fondent ensemble sur un arrière-plan qu'on ne connaît
            // pas : là, on ne tranche pas.
            const op = parseFloat(st.opacity);
            if (op === 0) return { ok: true, horsSujet: true }; // rien de rendu
            if (op < 1) return { inconnu: `opacite ${st.opacity} sur le porteur du fond` };
            fonds = [c];
            break;
          }
          // L'opacité d'un ancêtre INTERMÉDIAIRE s'applique au texte, pas au fond :
          // c'est de la composition alpha exacte, pas une simulation.
          const o = parseFloat(st.opacity);
          if (!Number.isNaN(o)) opac *= o;
          if (opac === 0) return { ok: true, horsSujet: true }; // rien de rendu : rien à mesurer
          if (c && c.a > 0) pile.push(c);
          n = n.parentElement;
        }
        if (!fonds) fonds = [{ r: 255, v: 255, b: 255, a: 1 }]; // le canevas du navigateur
        let ratio = Infinity, fondPire = null;
        for (let f of fonds) {
          if (f.a < 1) f = sur(f, { r: 255, v: 255, b: 255, a: 1 });
          for (let i = pile.length - 1; i >= 0; i--) if (pile[i].a < 1) f = sur(pile[i], f);
          const alpha = avant.a * opac;
          const texte = alpha < 1 ? sur({ ...avant, a: alpha }, f) : avant;
          const paire = [lum(texte), lum(f)].sort((a, b) => b - a);
          const r2 = Math.round(((paire[0] + 0.05) / (paire[1] + 0.05)) * 100) / 100;
          if (r2 < ratio) { ratio = r2; fondPire = f; }
        }
        const d = Number(t.val);
        const ok = t.op === ">=" ? ratio >= d : t.op === ">" ? ratio > d
          : t.op === "<=" ? ratio <= d : t.op === "<" ? ratio < d
          : t.op === "==" ? ratio === d : ratio !== d;
        return { ok, ratio, quoi: `${ratio}:1 (attendu ${t.op} ${d})` };
      }
      case "dans": {
        // La valeur calculée doit appartenir à un JEU DÉCLARÉ PAR LE THÈME, jamais
        // à une liste écrite dans l'outil : le harnais ne connaît aucune couleur.
        // `control.focus-*` → les propriétés `--control-focus-*` de la racine.
        const doc = el.ownerDocument, vue = doc.defaultView;
        const racine = vue.getComputedStyle(doc.documentElement);
        const prefixe = "--" + t.arg.replace(/\./g, "-").replace(/\*$/, "");
        const sonde = doc.createElement("span");
        doc.body.appendChild(sonde);
        const norme = (c) => c.replace(/\s+/g, "").toLowerCase();
        const jeu = new Set();
        for (const n of ["primary", "neutral", "danger", "success", "warning", "info"]) {
          const v = racine.getPropertyValue(prefixe + n).trim();
          if (!v) continue;
          sonde.style.color = v; // laisse le moteur résoudre color-mix()
          jeu.add(norme(vue.getComputedStyle(sonde).color));
        }
        sonde.remove();
        if (!jeu.size) return { ok: true, vide: `jeu ${t.arg} vide — rien à confronter` };
        const val = norme(vue.getComputedStyle(el).getPropertyValue(t.attr || "outline-color"));
        return jeu.has(val) ? { ok: true } : { ok: false, quoi: `${val} hors ${t.arg}` };
      }
      case "mesure": {
        const r = el.getBoundingClientRect();
        const brut = t.arg === "largeur" ? r.width : t.arg === "hauteur" ? r.height
          : el.ownerDocument.defaultView.getComputedStyle(el).getPropertyValue(t.arg).trim();
        const g = typeof brut === "number" ? brut : parseFloat(brut);
        const d = Number(t.val);
        const num = !Number.isNaN(g) && !Number.isNaN(d);
        const ok = t.op === ">=" ? num && g >= d : t.op === "<=" ? num && g <= d
          : t.op === ">" ? num && g > d : t.op === "<" ? num && g < d
          : t.op === "==" ? String(brut) === t.val : String(brut) !== t.val;
        return { ok, quoi: `${t.arg} = ${typeof brut === "number" ? Math.round(brut) : brut}` };
      }
      default:
        // Inatteignable : la table est fermée à la compilation. Si on arrive ici,
        // c'est que le compilateur a laissé passer quelque chose — on le dit.
        return { ok: false, quoi: `PRÉDICAT NON IMPLÉMENTÉ : ${t.nom}` };
    }
  };

  for (const p of programme) {
    // Les formes STATIQUES portent sur la feuille de style : leur « sélecteur »
    // est une liste de propriétés CSS, pas un sélecteur de document. Les passer à
    // querySelectorAll lèverait une SyntaxError. Elles sont évaluées ailleurs,
    // par `evalueLesValeurs`.
    if (p.statique) continue;
    const doc = globalThis.document;
    const els = [...doc.querySelectorAll(p.selecteur)].filter(visible);
    if (p.forme === "suite") {
      // Monotonie sans trou dans l'ordre du DOM : h2 → h4 est un saut, h4 → h2 non
      // (on remonte, on ne crée pas de trou).
      let precedent = 0;
      for (const el of els) {
        const n = Number(el.tagName[1]);
        if (precedent && n > precedent + 1)
          out.push({ regle: p.id, motif: `h${precedent} → h${n}`, balise: el.tagName.toLowerCase(), detail: etiquette(el) });
        precedent = n;
      }
      continue;
    }
    if (p.forme === "compte") {
      const n = els.length;
      const ok = p.op === "==" ? n === p.n : p.op === "!=" ? n !== p.n
        : p.op === "<" ? n < p.n : p.op === "<=" ? n <= p.n
        : p.op === ">" ? n > p.n : n >= p.n;
      // Le motif nomme le SÉLECTEUR compté, pas un « h1 » hérité de la première
      // règle écrite : un motif faux se recopie dans le rapport.
      if (!ok) out.push({ regle: p.id, motif: `${n} × ${p.selecteur.length > 44 ? p.selecteur.slice(0, 44) + "…" : p.selecteur}`, detail: `attendu ${p.op} ${p.n}` });
      continue;
    }
    for (const el of els) {
      const r = p.termes.map((t) => evalueTerme(el, t));
      // Hors sujet : le prédicat n'a rien à mesurer sur cet élément (pas de texte
      // propre, pas de clamp()…). Ce n'est ni un écart ni une conformité.
      if (r.some((x) => x.horsSujet)) continue;
      // Non concluant : la valeur EXISTE mais ne peut pas être établie (fond en
      // image, opacité composite). On ne devine pas — on remonte l'empêchement.
      const flou = r.find((x) => x.inconnu);
      if (flou) {
        out.push({ regle: p.id, nonConcluant: true, motif: flou.inconnu,
                   balise: el.tagName.toLowerCase(), detail: etiquette(el) });
        continue;
      }
      const rang = new Map(p.termes.map((t, i) => [t, r[i]]));
      const satisfait = p.groupes.some((g) => g.every((t) => rang.get(t).ok));
      if (p.forme === "chaque" ? satisfait : !satisfait) continue;
      const quoi = r.filter((x) => x.quoi).map((x) => x.quoi);
      const tous = r.flatMap((x) => x.tous || []);
      const balise = el.tagName.toLowerCase();
      if (tous.length) {
        for (const m of tous) out.push({ regle: p.id, motif: m, balise, detail: etiquette(el) });
      } else {
        out.push({ regle: p.id, motif: quoi[0] || balise, balise, detail: etiquette(el) });
      }
    }
  }
  return out;
}

/**
 * L'évaluateur des formes STATIQUES. Il tourne côté Node : `recolte` contient
 * déjà des données simples, prélevées dans la page par `instrument-statique`.
 *
 * Trois issues, jamais deux : conforme · en écart · EN ATTENTE DE DÉCLARATION.
 * La troisième existe parce qu'un jeu de tokens vide n'est pas une conformité —
 * c'est une information que le client n'a pas encore donnée (loi 4.18).
 */
export function evalueLesValeurs(programme, recolte) {
  const constats = [], attentes = [];
  const { declarations, tokensPx } = recolte;

  const jeuDe = (nom) => {
    const prefixe = "--" + nom.replace(/\./g, "-").replace(/\*$/, "");
    const v = Object.entries(tokensPx).filter(([n]) => n.startsWith(prefixe)).map(([, p]) => p);
    return { prefixe, valeurs: new Set(v) };
  };
  // Composantes de longueur d'une valeur déclarée : « 1.5rem », « 4vw », « 12px »…
  const composantes = (v) => [...v.matchAll(/(-?[\d.]+)(px|rem|em|vw|vh|vmin|vmax|ch|ex|%)/g)].map((m) => m[2]);

  const evalue = (d, t) => {
    switch (t.nom) {
      case "dans": {
        const { prefixe, valeurs } = jeuDe(t.arg);
        if (!valeurs.size) return { attente: `aucun token ${prefixe}* déclaré à la racine` };
        if (d.px === null) return { ok: true }; // valeur non résoluble en longueur : hors de portée
        // Une valeur DÉRIVÉE d'un cran (`calc(var(--radius-lg) - 1px)`) tient son
        // origine de l'échelle : c'est le cas concentrique que RADIUS-R06 autorise
        // nommément. La condamner parce que le résultat n'est pas lui-même un cran
        // reviendrait à interdire une règle du corpus au nom d'une autre.
        if (new RegExp("var\\(\\s*" + prefixe.replace(/[-]/g, "\\-")).test(d.valeur))
          return { ok: true, derive: true };
        return valeurs.has(d.px) ? { ok: true } : { ok: false, quoi: `${d.valeur} (${d.px}px) hors ${t.arg}` };
      }
      case "unites_seules": {
        const cibles = new Set(t.arg.split("|"));
        const c = composantes(d.valeur);
        if (!c.length) return { ok: false };
        const toutes = c.every((u) => cibles.has(u));
        return toutes ? { ok: true, quoi: `${d.valeur} — ${[...new Set(c)].join(", ")} seules` } : { ok: false };
      }
      case "clamp_avec_rem": {
        if (!/\bclamp\(/.test(d.valeur)) return { ok: true, horsSujet: true };
        const dedans = d.valeur.slice(d.valeur.indexOf("clamp(") + 6, d.valeur.lastIndexOf(")"));
        const parts = [];
        let prof = 0, cur = "";
        for (const ch of dedans) {
          if (ch === "(") prof++;
          if (ch === ")") prof--;
          if (ch === "," && !prof) { parts.push(cur); cur = ""; continue; }
          cur += ch;
        }
        parts.push(cur);
        if (parts.length !== 3) return { ok: false, quoi: `${d.valeur} — clamp() à ${parts.length} termes` };
        const rem = (x) => /[\d.]rem\b|\brem\b/.test(x) || /[\d.]+rem/.test(x);
        const manque = [];
        if (!rem(parts[0])) manque.push("minimum");
        if (!rem(parts[2])) manque.push("maximum");
        // Partie fixe du terme préféré : tout sauf les composantes en unités viewport.
        const fixe = parts[1].replace(/-?[\d.]+(vw|vh|vmin|vmax)/g, "").trim();
        if (!rem(fixe)) manque.push("partie fixe");
        return manque.length ? { ok: false, quoi: `${d.valeur} — sans rem dans : ${manque.join(", ")}` } : { ok: true };
      }
      default:
        return { ok: false, quoi: `PRÉDICAT NON IMPLÉMENTÉ CÔTÉ STATIQUE : ${t.nom}` };
    }
  };

  for (const p of programme) {
    if (!p.statique) continue;
    const props = p.selecteur.split(",").map((x) => x.trim());
    const motifs = props.map((x) => new RegExp("^" + x.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*") + "$"));
    const lot = declarations.filter((d) => motifs.some((m) => m.test(d.propriete)));
    const enAttente = new Set();
    for (const d of lot) {
      const r = p.termes.map((t) => evalue(d, t));
      const att = r.find((x) => x.attente);
      if (att) { enAttente.add(att.attente); continue; }
      if (r.some((x) => x.horsSujet)) continue;
      const rang = new Map(p.termes.map((t, i) => [t, r[i]]));
      const satisfait = p.groupes.some((g) => g.every((t) => rang.get(t).ok));
      if (p.forme === "chaque_valeur" ? satisfait : !satisfait) continue;
      const quoi = r.filter((x) => x.quoi).map((x) => x.quoi);
      constats.push({ regle: p.id, motif: quoi[0] || `${d.propriete}: ${d.valeur}`, detail: `${d.ou}${d.contexte ? " · " + d.contexte : ""}` });
    }
    for (const a of enAttente) attentes.push({ regle: p.id, motif: a, examinees: lot.length });
  }
  return { constats, attentes };
}
