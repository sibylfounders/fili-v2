#!/usr/bin/env node
/**
 * extrait-flow.mjs — projette un flow de `content/md/flows/` en graphe.
 *
 * Niveau 2 (cf. OU-EST-QUOI.md) : ce fichier ne contient AUCUNE doctrine.
 * Il lit la fiche de flow et son inventaire de cas d'usage, et en dérive
 * `apps/site/content/flows/<slug>.json`, consommé par la vue diagramme.
 *
 * Principe : ce que l'outil ne sait pas lire, il le NOMME (`nonLu[]`) au lieu
 * de le combler. `--strict` échoue dès qu'il reste une entrée non lue.
 *
 *   node tools/extrait-flow.mjs                 # tous les flows
 *   node tools/extrait-flow.mjs creation-compte # un seul
 *   node tools/extrait-flow.mjs --strict
 *   node tools/extrait-flow.mjs --check         # n'écrit rien, compare
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const RACINE = join(dirname(fileURLToPath(import.meta.url)), "..");
const DOSSIER_FLOWS = join(RACINE, "apps/site/content/md/flows");
const DOSSIER_INVENTAIRES = join(RACINE, "apps/site/content/md/inventaires");
const DOSSIER_SORTIE = join(RACINE, "apps/site/content/flows");

const args = process.argv.slice(2);
const STRICT = args.includes("--strict");
const CHECK = args.includes("--check");
const cibles = args.filter((a) => !a.startsWith("--"));

/* ---------------------------------------------------------------- outillage */

const sansAccent = (s) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

/** Clé de rapprochement : sans accent, sans parenthèses, sans ponctuation molle. */
const cle = (s) =>
  sansAccent(s)
    .replace(/\([^)]*\)/g, " ")
    .replace(/[`*_«»"'’]/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

/** Découpe sur « → » en respectant les parenthèses. */
function decoupeFleches(texte) {
  const morceaux = [];
  let courant = "";
  let profondeur = 0;
  for (const c of texte) {
    if (c === "(") profondeur++;
    if (c === ")") profondeur--;
    if (c === "→" && profondeur === 0) {
      morceaux.push(courant.trim());
      courant = "";
    } else courant += c;
  }
  morceaux.push(courant.trim());
  return morceaux.filter(Boolean);
}

/** Découpe une énumération en respectant les parenthèses (« a, b (x, y), ou c »). */
function decoupeHorsParentheses(texte, separateur) {
  const morceaux = [];
  let courant = "";
  let profondeur = 0;
  for (let i = 0; i < texte.length; i++) {
    const c = texte[i];
    if (c === "(") profondeur++;
    if (c === ")") profondeur--;
    if (profondeur === 0) {
      const m = texte.slice(i).match(separateur);
      if (m) {
        morceaux.push(courant.trim());
        courant = "";
        i += m[0].length - 1;
        continue;
      }
    }
    courant += c;
  }
  morceaux.push(courant.trim());
  return morceaux.filter(Boolean);
}

/** Corps d'une section `## Titre` (jusqu'au prochain `## `). */
function section(md, titre) {
  const lignes = md.split("\n");
  const debut = lignes.findIndex(
    (l) => l.startsWith("## ") && cle(l.slice(3)).startsWith(cle(titre)),
  );
  if (debut === -1) return null;
  const suite = lignes.slice(debut + 1);
  const fin = suite.findIndex((l) => l.startsWith("## "));
  return (fin === -1 ? suite : suite.slice(0, fin)).join("\n");
}

/** Lignes d'un tableau GFM dont l'en-tête contient `entete`. */
function tableau(corps, entete) {
  const lignes = corps.split("\n");
  const i = lignes.findIndex((l) => l.startsWith("|") && cle(l).includes(cle(entete)));
  if (i === -1) return null;
  const colonnes = lignes[i]
    .split("|")
    .slice(1, -1)
    .map((c) => c.trim());
  const rangs = [];
  for (let j = i + 2; j < lignes.length; j++) {
    if (!lignes[j].startsWith("|")) break;
    rangs.push(lignes[j].split("|").slice(1, -1).map((c) => c.trim()));
  }
  return { colonnes, rangs };
}

const propre = (s) => s.replace(/\*\*/g, "").replace(/`/g, "").trim();

/**
 * Vocabulaire fermé des statuts de couverture. Les inventaires ont deux
 * formats (`**Couvert** — proprio` et `Couvert — précision`) : on lit les deux,
 * on n'invente pas un statut hors de cette liste.
 */
const STATUTS = [
  "Couvert partiellement",
  "Hors périmètre",
  "Non couvert",
  "En attente",
  "Couvert",
  "Partiel",
  "Absent",
];
const lisStatut = (cellule) => {
  const gras = (cellule.match(/\*\*(.+?)\*\*/) || [])[1];
  const tete = propre((gras ?? cellule).split("—")[0]);
  return STATUTS.find((s) => cle(s) === cle(tete)) ?? null;
};

/* ------------------------------------------------------------- l'extraction */

function extrait(slugFichier) {
  const cheminFlow = join(DOSSIER_FLOWS, `${slugFichier}-UX.md`);
  const md = readFileSync(cheminFlow, "utf8");
  const nonLu = [];
  const aArbitrer = [];

  /* -- en-tête ------------------------------------------------------------ */
  const fm = md.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) throw new Error(`${slugFichier}-UX.md : pas de front matter.`);
  const champ = (nom) =>
    (fm[1].match(new RegExp(`^${nom}:\\s*(.+)$`, "m")) || [])[1]?.split("#")[0].trim();
  const type = champ("type");
  if (type !== "flow") throw new Error(`${slugFichier}-UX.md : type « ${type} », attendu « flow ».`);
  const composant = champ("component");
  const version = champ("version") || "";

  /* -- les moments (§ Le squelette du parcours) --------------------------- */
  const squelette = section(md, "Le squelette du parcours");
  const moments = [];
  if (!squelette) nonLu.push("section « Le squelette du parcours » introuvable");
  else {
    for (const l of squelette.split("\n")) {
      const m = l.match(/^(\d+)\.\s+\*\*(.+?)\*\*\s*(\*\([^)]*\)\*)?\s*—\s*(.+)$/);
      if (m) {
        moments.push({
          id: `moment-${m[1]}`,
          index: Number(m[1]),
          titre: m[2].trim(),
          conditionnel: Boolean(m[3]),
          precision: m[3] ? propre(m[3].replace(/^\*\(|\)\*$/g, "")) : null,
          texte: propre(m[4]),
        });
      }
    }
    if (!moments.length) nonLu.push("aucun moment numéroté lu dans « Le squelette du parcours »");
  }

  /* -- la machine à états ------------------------------------------------- */
  const machine = section(md, "Machine à états du parcours");
  const etats = [];
  const transitions = [];
  const bifurcations = [];

  if (!machine)
    nonLu.push(
      "flow non projetable en graphe : pas de § « Machine à états du parcours » dans la fiche",
    );
  else {
    // La chaîne principale : le premier `…` qui contient au moins deux flèches.
    const chaines = [...machine.matchAll(/`([^`\n]*→[^`\n]*)`/g)].map((m) => m[1]);
    const principale = chaines.find((c) => (c.match(/→/g) || []).length >= 2);
    if (!principale) nonLu.push("chaîne d'états principale introuvable (attendu : `a → b → c`)");
    else {
      let precedent = null;
      for (const brut of decoupeFleches(principale)) {
        const parenthese = brut.match(/\(([^)]*)\)/);
        const libelle = propre(brut.replace(/\([^)]*\)/, ""));
        const etat = {
          id: cle(libelle).replace(/ /g, "-"),
          libelle,
          precision: parenthese && !parenthese[1].includes("→") ? parenthese[1].trim() : null,
          sousEtats: [],
        };
        if (parenthese && parenthese[1].includes("→")) {
          let sousPrecedent = null;
          for (const sb of decoupeFleches(parenthese[1])) {
            const sousEtat = { id: cle(sb).replace(/ /g, "-"), libelle: propre(sb) };
            etat.sousEtats.push(sousEtat);
            if (sousPrecedent) {
              transitions.push({ de: sousPrecedent.id, vers: sousEtat.id, dans: etat.id, nature: "sequence" });
            }
            sousPrecedent = sousEtat;
          }
        }
        etat.entree = etat.sousEtats.length ? etat.sousEtats[0].id : etat.id;
        etat.sortie = etat.sousEtats.length ? etat.sousEtats.at(-1).id : etat.id;
        etats.push(etat);
        if (precedent)
          transitions.push({ de: precedent.sortie, vers: etat.entree, nature: "sequence" });
        precedent = etat;
      }
    }

    // Les bifurcations : les autres chaînes à une seule flèche.
    for (const c of chaines) {
      if (c === principale) continue;
      const morceaux = decoupeFleches(c);
      if (morceaux.length === 2) {
        bifurcations.push({
          id: cle(morceaux[0]).replace(/ /g, "-"),
          depuis: propre(morceaux[0]),
          vers: propre(morceaux[1]),
        });
      } else nonLu.push(`chaîne non interprétée : « ${c} »`);
    }

    // Le tableau des transitions.
    const t = tableau(machine, "Transition");
    if (!t) nonLu.push("tableau des transitions introuvable dans « Machine à états »");
    else {
      const idxCible = (nom) => t.colonnes.findIndex((c) => cle(c).includes(cle(nom)));
      const iVisible = idxCible("Ce qui devient visible");
      const iFocus = idxCible("Focus");
      const iSaisie = idxCible("Sort de la saisie");
      const iCondition = idxCible("Condition de sortie");
      for (const [k, colonne] of [
        ["Ce qui devient visible", iVisible],
        ["Focus", iFocus],
        ["Sort de la saisie", iSaisie],
        ["Condition de sortie", iCondition],
      ]) {
        if (colonne === -1) nonLu.push(`colonne « ${k} » absente du tableau des transitions`);
      }

      const tousLesEtats = etats.flatMap((e) => [e, ...e.sousEtats]);
      for (const rang of t.rangs) {
        const brut = propre(rang[0]).replace(/^→\s*/, "");
        // « vérifié / actif » désigne deux cibles.
        const ciblesRang = brut.split("/").map((s) => s.trim()).filter(Boolean);
        const resolues = [];
        for (const c of ciblesRang) {
          const trouve =
            tousLesEtats.find((e) => cle(e.libelle) === cle(c)) ||
            tousLesEtats.find((e) => cle(e.libelle).startsWith(cle(c))) ||
            bifurcations.find((b) => cle(b.depuis) === cle(c));
          if (trouve) resolues.push(trouve.id);
        }
        if (!resolues.length) {
          nonLu.push(`transition « ${brut} » : aucune cible correspondante dans la chaîne d'états`);
          continue;
        }
        for (const cibleId of resolues) {
          const arete = transitions.find((tr) => tr.vers === cibleId);
          const detail = {
            visible: iVisible > -1 ? propre(rang[iVisible]) : null,
            focus: iFocus > -1 ? propre(rang[iFocus]) : null,
            saisie: iSaisie > -1 ? propre(rang[iSaisie]) : null,
            condition: iCondition > -1 ? propre(rang[iCondition]) : null,
            libelle: brut,
          };
          if (arete) Object.assign(arete, detail);
          else {
            transitions.push({ de: null, vers: cibleId, nature: "bifurcation", ...detail });
            if (bifurcations.some((b) => b.id === cibleId))
              aArbitrer.push(
                `bifurcation « ${brut} » : la fiche ne nomme pas l'état d'origine — ` +
                  `le graphe la rattache au parcours sans inventer son point de départ`,
              );
          }
        }
      }
    }
  }

  /* -- les extensions ----------------------------------------------------- */
  const extensions = [];
  for (const m of md.matchAll(/^## Extension\s+—\s+(.+?)\s+·\s+`([^`]+)`\s*$/gm)) {
    extensions.push({ slug: m[2], titre: m[1].trim(), couverture: [] });
  }
  if (!extensions.length) nonLu.push("aucune extension « ## Extension — Titre · `slug` » lue");

  // Rattachement extension → état/moment : la fiche ne l'écrit nulle part sous une forme
  // lisible par machine. On le dit, on ne le devine pas.
  for (const e of extensions) {
    e.rattache = null;
    aArbitrer.push(
      `extension « ${e.titre} » (\`${e.slug}\`) : la fiche ne nomme pas l'état ou le moment ` +
        `auquel elle se rattache — le graphe l'affiche détachée`,
    );
  }
  for (const m of moments) {
    if (m.precision && /extension/i.test(m.precision) && !/`/.test(m.precision))
      aArbitrer.push(
        `moment ${m.index} « ${m.titre} » : renvoie à « ${m.precision} » sans nommer le slug ` +
          `de l'extension — renvoi non résolvable`,
      );
  }

  /* -- les frontières d'autorité ------------------------------------------ */
  const frontieres = [];
  const corpsFrontieres = section(md, "Frontières d'autorité");
  if (!corpsFrontieres) nonLu.push("section « Frontières d'autorité » introuvable");
  else {
    const t = tableau(corpsFrontieres, "Domaine");
    if (!t) nonLu.push("tableau des frontières d'autorité introuvable");
    else
      for (const r of t.rangs) {
        const proprietaire = propre(r[1] || "");
        frontieres.push({
          domaine: propre(r[0] || ""),
          proprietaire,
          duFlow: new RegExp(composant.toUpperCase().replace(/-/g, "[- ]")).test(
            sansAccent(proprietaire).toUpperCase(),
          ),
        });
      }
  }

  /* -- l'inventaire de couverture ----------------------------------------- */
  const cheminInventaire = join(DOSSIER_INVENTAIRES, `inventaire-cas-usage-${composant}.md`);
  const couverture = [];
  if (!existsSync(cheminInventaire)) {
    nonLu.push(`inventaire absent : inventaire-cas-usage-${composant}.md`);
  } else {
    const inv = readFileSync(cheminInventaire, "utf8");
    let famille = null;
    for (const ligne of inv.split("\n")) {
      const h = ligne.match(/^##\s+\d+\.\s+(.+)$/);
      if (h) famille = h[1].trim();
      if (!ligne.startsWith("|") || !famille) continue;
      const cellules = ligne.split("|").slice(1, -1).map((c) => c.trim());
      if (cellules.length < 3) continue;
      if (cle(cellules[0]).startsWith("cas d usage") || /^-+$/.test(cellules[0])) continue;
      const statut = lisStatut(cellules[2]);
      if (!statut) {
        nonLu.push(`cas « ${propre(cellules[0])} » : statut illisible (« ${cellules[2]} »)`);
        continue;
      }
      const cas = {
        famille,
        cas: propre(cellules[0]),
        description: propre(cellules[1]),
        statut,
        proprietaire: propre(cellules[2]).split("—").slice(1).join("—").trim() || null,
      };
      couverture.push(cas);
      // Rattachement à une extension : uniquement quand le slug est cité tel quel.
      for (const e of extensions) {
        const court = e.slug.replace(`${composant}-`, "");
        if (cellules[2].includes(e.slug) || cellules[2].includes(court)) e.couverture.push(cas.cas);
      }
    }
    if (!couverture.length) nonLu.push("aucun cas d'usage lu dans l'inventaire");
  }

  /* -- ce que chaque MOMENT réclame comme intervention ---------------------
   * L'inventaire cite des sections (« creation-compte § Choisir une méthode »).
   * On rattache un cas à un moment quand l'intitulé du § et celui du moment se
   * recouvrent LITTÉRALEMENT. Le reste va en transversal ou en arbitrage — on ne
   * force aucun rapprochement approximatif.
   */
  const transversal = [];
  for (const cas of couverture) {
    const cite = (cas.proprietaire || "").match(/§\s*([^+;(]+)/);
    cas.section = cite ? propre(cite[1]).replace(/\s*[—-]\s*$/, "").trim() : null;
    if (!cas.section) continue;
    const m = moments.find(
      (mo) => cle(mo.titre) === cle(cas.section) || cle(cas.section).startsWith(cle(mo.titre)),
    );
    if (m) (m.casRattaches ??= []).push(cas.cas);
    else {
      let t = transversal.find((x) => cle(x.section) === cle(cas.section));
      if (!t) transversal.push((t = { section: cas.section, cas: [] }));
      t.cas.push(cas.cas);
    }
  }
  for (const m of moments) {
    m.casRattaches ??= [];
    const rattaches = couverture.filter((c) => m.casRattaches.includes(c.cas));
    m.interventions = rattaches
      .filter((c) => c.statut !== "Couvert")
      .map((c) => ({ cas: c.cas, statut: c.statut, proprietaire: c.proprietaire }));
    // Le verdict d'un moment : le pire statut de ce qui lui est rattaché.
    m.verdict = !rattaches.length
      ? "sans rattachement"
      : m.interventions.length
        ? m.interventions.some((i) => i.statut === "Absent" || i.statut === "Non couvert")
          ? "à traiter"
          : m.interventions.some((i) => i.statut === "En attente")
            ? "en attente d'un arbitrage"
            : "partiel"
        : "couvert";
    if (m.verdict === "sans rattachement")
      aArbitrer.push(
        `moment ${m.index} « ${m.titre} » : aucun § de la fiche ne porte cet intitulé, ` +
          `donc aucun cas d'usage ne lui est rattaché — renommer le § ou déclarer le lien`,
      );
  }

  /* -- le OU du moment 1 : les méthodes d'inscription ---------------------- */
  const moment1 = moments.find((m) => m.index === 1);
  let methodes = [];
  if (moment1) {
    methodes = decoupeHorsParentheses(moment1.texte.split(/\.\s/)[0], /^(,\s*ou\s+|\s+ou\s+|,\s*)/)
      .map((x) => propre(x))
      .filter((x) => x.length > 2);
    if (methodes.length < 2)
      nonLu.push(`moment 1 : liste des méthodes non lue dans « ${moment1.texte.split(".")[0]} »`);
  }

  const compte = (s) => couverture.filter((c) => c.statut === s).length;

  return {
    flow: composant,
    version,
    source: {
      fiche: `content/md/flows/${slugFichier}-UX.md`,
      inventaire: existsSync(cheminInventaire)
        ? `content/md/inventaires/inventaire-cas-usage-${composant}.md`
        : null,
      empreinte: createHash("sha256").update(md).digest("hex").slice(0, 16),
    },
    moments,
    etats,
    transitions,
    bifurcations,
    extensions,
    frontieres,
    couverture,
    transversal,
    methodes,
    resume: {
      moments: moments.length,
      etats: etats.length + etats.reduce((n, e) => n + e.sousEtats.length, 0),
      transitions: transitions.length,
      extensions: extensions.length,
      couvert: compte("Couvert"),
      partiel: compte("Partiel") + compte("Couvert partiellement"),
      enAttente: compte("En attente"),
      absent: compte("Absent") + compte("Non couvert"),
      horsPerimetre: compte("Hors périmètre"),
      momentsAIntervenir: moments.filter((m) => m.verdict !== "couvert").length,
    },
    aArbitrer,
    nonLu,
  };
}

/* ------------------------------------------------------------------- sortie */

const fichiers = readdirSync(DOSSIER_FLOWS)
  .filter((f) => f.endsWith("-UX.md"))
  .map((f) => f.replace("-UX.md", ""))
  .filter((f) => !cibles.length || cibles.some((c) => cle(c) === cle(f)));

if (!fichiers.length) {
  console.error(`Aucun flow ne correspond à : ${cibles.join(", ")}`);
  process.exit(1);
}

mkdirSync(DOSSIER_SORTIE, { recursive: true });
let echec = false;
let divergent = false;

for (const f of fichiers) {
  let graphe;
  try {
    graphe = extrait(f);
  } catch (e) {
    console.error(`✗ ${f} — ${e.message}`);
    echec = true;
    continue;
  }
  const chemin = join(DOSSIER_SORTIE, `${graphe.flow}.json`);
  const rendu = `${JSON.stringify(graphe, null, 2)}\n`;

  if (CHECK) {
    const ancien = existsSync(chemin) ? readFileSync(chemin, "utf8") : null;
    if (ancien !== rendu) {
      console.error(`✗ ${graphe.flow} — le graphe publié diverge de la fiche. Relancer sans --check.`);
      divergent = true;
    }
  } else {
    writeFileSync(chemin, rendu);
  }

  const r = graphe.resume;
  console.log(
    `${graphe.nonLu.length ? "!" : "✓"} ${graphe.flow} v${graphe.version} — ` +
      `${r.moments} moments · ${r.etats} états · ${r.transitions} transitions · ` +
      `${r.extensions} extensions · couverture ${r.couvert}/${graphe.couverture.length} ` +
      `(partiel ${r.partiel}, en attente ${r.enAttente}, absent ${r.absent})`,
  );
  for (const m of graphe.moments)
    console.log(
      `    moment ${m.index} « ${m.titre} » — ${m.verdict}` +
        (m.interventions.length ? ` (${m.interventions.length} intervention(s))` : ""),
    );
  for (const a of graphe.aArbitrer) console.log(`    à arbitrer : ${a}`);
  for (const n of graphe.nonLu) {
    console.log(`    non lu : ${n}`);
    if (STRICT) echec = true;
  }
}

if (divergent) process.exit(1);
if (echec) {
  console.error(
    STRICT ? "\nÉchec strict : des entrées de la fiche n'ont pas été lues." : "\nÉchec.",
  );
  process.exit(1);
}
