// ─────────────────────────────────────────────────────────────────────────────
// L'instrument STATIQUE — il lit la feuille de style, pas le document.
//
// Quatre MESURE du corpus ne parlent pas du DOM rendu mais des VALEURS DÉCLARÉES :
// « aucune valeur d'espacement en dur hors des crans de l'échelle », « aucune
// taille de police en unités viewport seules »… Aucun sélecteur ne les atteint :
// une valeur écrite dans une règle @media jamais appliquée reste une valeur écrite.
//
// L'instrument n'écrit pas son propre analyseur CSS : il lit le CSSOM du même
// navigateur que le moteur de rendu. Une seule grammaire de cascade, celle qui
// fait autorité — pas une réimplémentation qui divergerait en silence.
// ─────────────────────────────────────────────────────────────────────────────

/** Exécuté DANS la page. Récolte chaque déclaration des propriétés demandées. */
export function recolteDansLaPage(props) {
  const motifs = props.map((p) => new RegExp("^" + p.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*") + "$"));
  const retenu = (nom) => motifs.some((m) => m.test(nom));
  const out = [];
  const vu = new Set();

  const parcours = (regles, contexte) => {
    for (const r of regles) {
      if (r.style) {
        for (let i = 0; i < r.style.length; i++) {
          const nom = r.style[i];
          if (!retenu(nom)) continue;
          const val = r.style.getPropertyValue(nom).trim();
          if (!val) continue;
          const cle = `${nom}|${val}|${r.selectorText || ""}|${contexte}`;
          if (vu.has(cle)) continue;
          vu.add(cle);
          out.push({ propriete: nom, valeur: val, ou: (r.selectorText || "?").slice(0, 60), contexte });
        }
      }
      // @media, @supports, @layer, @container : on descend, en gardant la condition.
      if (r.cssRules) {
        const c = r.conditionText ? `${contexte ? contexte + " · " : ""}@${r.constructor.name.replace(/^CSS|Rule$/g, "").toLowerCase()} ${r.conditionText}` : contexte;
        parcours(r.cssRules, c);
      }
    }
  };

  for (const f of document.styleSheets) {
    let regles;
    try { regles = f.cssRules; } catch { continue; } // feuille d'une autre origine : on ne devine pas
    if (regles) parcours(regles, "");
  }

  // Le jeu de tokens du thème, tel que la racine le déclare. L'instrument ne
  // connaît aucune valeur en dur : si la racine ne déclare rien, le jeu est VIDE,
  // et un jeu vide n'est pas une conformité — c'est une déclaration manquante.
  const racine = document.documentElement;
  const calc = getComputedStyle(racine);
  const tokens = {};
  for (let i = 0; i < calc.length; i++) {
    const n = calc[i];
    if (n.startsWith("--")) tokens[n] = calc.getPropertyValue(n).trim();
  }
  // Repli : certains moteurs n'énumèrent pas les propriétés personnalisées.
  if (!Object.keys(tokens).length) {
    for (const f of document.styleSheets) {
      let regles; try { regles = f.cssRules; } catch { continue; }
      for (const r of regles || []) {
        if (!r.style || !/^(:root|html)\b/.test(r.selectorText || "")) continue;
        for (let i = 0; i < r.style.length; i++) {
          const n = r.style[i];
          if (n.startsWith("--")) tokens[n] = r.style.getPropertyValue(n).trim();
        }
      }
    }
  }

  // Résolution en pixels : on demande au navigateur, on ne calcule pas.
  const sonde = document.createElement("div");
  sonde.style.position = "absolute";
  sonde.style.visibility = "hidden";
  document.body.appendChild(sonde);
  const enPx = (v) => {
    sonde.style.width = "";
    sonde.style.width = v;
    const w = parseFloat(getComputedStyle(sonde).width);
    return Number.isNaN(w) ? null : Math.round(w * 1000) / 1000;
  };
  const px = {};
  for (const [n, v] of Object.entries(tokens)) { const p = enPx(v); if (p !== null) px[n] = p; }
  for (const d of out) d.px = enPx(d.valeur);
  sonde.remove();

  return { declarations: out, tokens, tokensPx: px };
}
