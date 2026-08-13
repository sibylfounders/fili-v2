#!/usr/bin/env node
/**
 * teste-extrait-flow.mjs — l'épreuve de la projection.
 *
 * Une seule question : le graphe dit-il exactement ce que la fiche dit ?
 * Deux sens, tous les deux vérifiés :
 *   → complétude : chaque rang du tableau des transitions et chaque maillon de la
 *     chaîne d'états se retrouve dans le graphe ;
 *   → fidélité : chaque libellé du graphe existe littéralement dans la fiche.
 *
 * Aucune valeur n'est écrite en dur ici : tout est relu du .md à chaque passage.
 */

import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const RACINE = join(dirname(fileURLToPath(import.meta.url)), "..");
const FICHES = join(RACINE, "apps/site/content/md/flows");
const GRAPHES = join(RACINE, "apps/site/content/flows");

const norm = (s) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

let echecs = 0;
let verifs = 0;
const verifie = (condition, message) => {
  verifs++;
  if (!condition) {
    console.log(`  ✗ ${message}`);
    echecs++;
  }
};

const slug = process.argv[2] || "creation-compte";
const cheminGraphe = join(GRAPHES, `${slug}.json`);
if (!existsSync(cheminGraphe)) {
  console.error(`Graphe absent : ${cheminGraphe}. Lancer d'abord tools/extrait-flow.mjs.`);
  process.exit(1);
}
const g = JSON.parse(readFileSync(cheminGraphe, "utf8"));
const fiche = readFileSync(join(RACINE, "apps/site", g.source.fiche.replace(/^content\//, "content/")), "utf8");
const ficheNorm = norm(fiche);

console.log(`Épreuve de la projection — ${slug} (fiche v${g.version})`);

// Un flow sans machine à états n'est pas projetable : il n'y a pas de graphe à éprouver.
// On le constate, on ne le compte pas comme un échec.
if (!g.etats.length) {
  console.log(
    `– ${slug} : pas de machine à états dans la fiche, rien à projeter. ` +
      `Motifs relevés par l'extracteur : ${g.nonLu.join(" · ")}`,
  );
  process.exit(0);
}

/* 1. Fidélité : rien dans le graphe qui ne soit dans la fiche. -------------- */
const libelles = [
  ...g.etats.map((e) => e.libelle),
  ...g.etats.flatMap((e) => e.sousEtats.map((s) => s.libelle)),
  ...g.moments.map((m) => m.titre),
  ...g.bifurcations.map((b) => b.depuis),
  ...g.extensions.map((e) => e.titre),
];
for (const l of libelles) {
  verifie(ficheNorm.includes(norm(l)), `libellé absent de la fiche : « ${l} »`);
}
for (const t of g.transitions) {
  if (t.condition) verifie(ficheNorm.includes(norm(t.condition)), `condition inventée : « ${t.condition} »`);
}

/* 2. Complétude : chaque rang du tableau est représenté. ------------------- */
const rangs = [...fiche.matchAll(/^\|\s*→\s*([^|]+)\|/gm)].map((m) => m[1].trim());
verifie(rangs.length > 0, "aucun rang « → … » trouvé dans la fiche (le tableau a-t-il changé de forme ?)");
for (const r of rangs) {
  const cibles = r.split("/").map((s) => norm(s));
  const vu = g.transitions.some((t) => norm(t.libelle || "") === norm(r)) ||
    cibles.every((c) =>
      g.transitions.some((t) => norm(t.libelle || "").includes(c)),
    );
  verifie(vu, `rang du tableau non projeté : « → ${r} »`);
}
verifie(
  g.transitions.filter((t) => t.libelle).length >= rangs.length,
  `${rangs.length} rangs dans la fiche, ${g.transitions.filter((t) => t.libelle).length} transitions renseignées`,
);

/* 3. Complétude : chaque maillon de la chaîne d'états est un nœud. --------- */
const chaine = (fiche.match(/`([^`\n]*→[^`\n]*→[^`\n]*)`/) || [])[1];
verifie(Boolean(chaine), "chaîne d'états introuvable dans la fiche");
if (chaine) {
  const maillons = chaine
    .split("→")
    .map((m) => norm(m.replace(/\(.*/, "")))
    .filter(Boolean);
  const noeuds = [
    ...g.etats.map((e) => norm(e.libelle)),
    ...g.etats.flatMap((e) => e.sousEtats.map((s) => norm(s.libelle))),
  ];
  for (const m of maillons) {
    verifie(noeuds.some((n) => n === m || m.startsWith(n)), `maillon non projeté : « ${m} »`);
  }
}

/* 4. Le graphe se tient : pas d'arête vers un nœud inexistant. ------------- */
const ids = new Set([
  ...g.etats.map((e) => e.id),
  ...g.etats.flatMap((e) => e.sousEtats.map((s) => s.id)),
  ...g.bifurcations.map((b) => b.id),
]);
for (const t of g.transitions) {
  if (t.de) verifie(ids.has(t.de), `arête depuis un nœud inconnu : ${t.de}`);
  verifie(ids.has(t.vers), `arête vers un nœud inconnu : ${t.vers}`);
}
const cibles = new Set(g.transitions.filter((t) => t.de).map((t) => t.vers));
const sources = new Set(g.transitions.filter((t) => t.de).map((t) => t.de));
// Un état COMPOSITE n'a pas d'arête propre : ce sont son entrée et sa sortie qui
// portent les liens. On le vérifie explicitement plutôt que de l'exclure en silence.
const composites = g.etats.filter((e) => e.sousEtats.length);
for (const c of composites) {
  verifie(cibles.has(c.entree), `état composite « ${c.libelle} » : entrée ${c.entree} sans arête entrante`);
  verifie(sources.has(c.sortie), `état composite « ${c.libelle} » : sortie ${c.sortie} sans arête sortante`);
}
const idsComposites = new Set(composites.map((c) => c.id));
const bifs = new Set(g.bifurcations.map((b) => b.id));
const orphelins = [...ids].filter(
  (i) => !cibles.has(i) && !sources.has(i) && !idsComposites.has(i),
);
for (const o of orphelins) {
  verifie(bifs.has(o), `état isolé sans transition : ${o}`);
}

/* 5. Couverture : chaque cas de l'inventaire a un statut du vocabulaire. --- */
if (g.source.inventaire) {
  const inv = readFileSync(join(RACINE, "apps/site", g.source.inventaire), "utf8");
  const lignes = inv
    .split("\n")
    .filter((l) => l.startsWith("|") && !/^\|\s*-+/.test(l) && !/cas d.usage/i.test(l));
  verifie(
    g.couverture.length === lignes.length,
    `${lignes.length} rangs dans l'inventaire, ${g.couverture.length} cas lus`,
  );
  for (const c of g.couverture) {
    verifie(norm(inv).includes(norm(c.cas)), `cas absent de l'inventaire : « ${c.cas} »`);
  }
}

/* 6. Ce que la projection ne comble pas est bien dit. --------------------- */
verifie(Array.isArray(g.aArbitrer), "le graphe ne porte pas de liste « à arbitrer »");
const detachees = g.extensions.filter((e) => !e.rattache).length;
verifie(
  g.aArbitrer.filter((a) => a.includes("extension")).length >= detachees,
  `${detachees} extensions détachées, ${g.aArbitrer.filter((a) => a.includes("extension")).length} signalées`,
);

console.log(
  echecs === 0
    ? `✓ ${verifs} vérifications, aucune divergence entre la fiche et le graphe.`
    : `✗ ${echecs} divergence(s) sur ${verifs} vérifications.`,
);
process.exit(echecs === 0 ? 0 : 1);
