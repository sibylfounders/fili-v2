// ─────────────────────────────────────────────────────────────────────────────
// L'instrument INTERACTIF — il mesure dans un ÉTAT, pas au repos.
//
// Beaucoup de règles d'accessibilité ne disent rien au repos et tout après un
// geste. `ACCESSIBILITY-R18` (« aria-invalid n'est jamais seul ») ne mesure RIEN
// sur une page tranquille : aucun champ n'est en erreur tant que personne n'a
// soumis. Mesurer au repos et conclure « rien à signaler » est la façon la plus
// polie de ne pas auditer.
//
// D'où le champ `SCENE:` dans la fiche, à côté de `CRITERE:`. La scène fait
// partie de la définition de la mesure, et elle se lit dans la doctrine.
//
// Liste FERMÉE, comme la table des prédicats. Une scène absente ne s'improvise
// pas : elle remonte comme manque.
// ─────────────────────────────────────────────────────────────────────────────

export const SCENES = {
  repos: "la page telle qu'elle se charge, apparitions posées",
  "soumission-vide": "chaque formulaire soumis sans rien remplir",
  tabulation: "chaque élément focalisable atteint au clavier, l'un après l'autre",
};

/** Rejeu et unanimité (§ 11.5 du cahier) : un constat interactif qui ne se
 *  reproduit pas à l'identique n'est pas un constat, c'est un non concluant. */
export const REJEUX = 3;

/**
 * Joue une scène puis rend la main. Tout se passe côté Playwright : la scène est
 * une MANIPULATION, elle ne peut pas s'exécuter dans `page.evaluate`.
 * Retourne `{ jouee, note }` — `jouee: false` quand la scène n'a rien trouvé à
 * manipuler (pas de formulaire, pas de focusable) : ce n'est pas une conformité.
 */
export async function joue(page, scene) {
  if (scene === "repos" || !scene) return { jouee: true, note: "" };

  if (scene === "soumission-vide") {
    const combien = await page.evaluate(() => {
      // On neutralise la NAVIGATION, pas la validation : le script du site doit
      // pouvoir faire son travail, sinon on mesure notre propre garde-fou.
      const formulaires = [...document.querySelectorAll("form")];
      for (const f of formulaires) f.addEventListener("submit", (e) => e.preventDefault(), true);
      return formulaires.length;
    });
    if (!combien) return { jouee: false, note: "aucun formulaire sur la page" };
    const boutons = await page.$$('form button[type=submit], form input[type=submit], form button:not([type])');
    if (!boutons.length) return { jouee: false, note: "formulaire sans contrôle de soumission identifiable" };
    for (const b of boutons) await b.click({ timeout: 2000 }).catch(() => {});
    // La validation native bloque l'événement submit : c'est un fait observable,
    // pas un échec du harnais. On laisse le DOM se stabiliser.
    await page.waitForTimeout(400);
    return { jouee: true, note: `${boutons.length} soumission(s) déclenchée(s)` };
  }

  if (scene === "tabulation") {
    const n = await page.evaluate(() =>
      document.querySelectorAll('a[href],button,input:not([type=hidden]),select,textarea,[tabindex]:not([tabindex="-1"])').length);
    if (!n) return { jouee: false, note: "aucun élément focalisable" };
    return { jouee: true, note: `${Math.min(n, 40)} focalisable(s) à parcourir`, parcourt: Math.min(n, 40) };
  }

  return { jouee: false, note: `SCÈNE INCONNUE : ${scene}` };
}
