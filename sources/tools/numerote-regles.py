#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Prépare un sujet à l'annotation : numérote ses règles et référence sa bibliographie.

Purement mécanique et idempotent — aucune rédaction. Ligne à ligne, jamais d'expression
régulière sur le fichier entier (une passe trop gourmande a déjà écrasé onze lignes de
sources le 2026-07-27 ; on ne recommence pas).

  RÈGLE : …            →  RÈGLE [BUTTON-R07] : …        (couche UX)
  RÈGLE : …            →  RÈGLE [BUTTON-U03] : …        (couche UI)
  | Affirmation | …    →  | Réf. | Affirmation | …      (+ S1…Sn en UX, T1…Tn en UI)

Usage : python3 tools/numerote-regles.py <slug> [--sec]   (--sec : simulation)
"""
import os, re, sys

ICI = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MD = os.path.join(ICI, "apps/site/content/md")
NATURES = ["principles", "languages", "foundations", "components", "patterns", "flows"]


def chemins(slug):
    for n in NATURES:
        p = os.path.join(MD, n, f"{slug.upper()}-UX.md")
        if os.path.exists(p):
            return p, p.replace("-UX.md", "-UI.md")
    return None, None


def traite(chemin, prefixe, lettre_ref, simulation=False):
    if not os.path.exists(chemin):
        return 0, 0
    lignes = open(chemin, encoding="utf-8").read().split("\n")
    out, n_regle, n_ref = [], 0, 0
    dans_biblio = False
    for l in lignes:
        if l.startswith("## "):
            dans_biblio = l.lower().startswith("## sources")
        # 1. numérotation des règles
        if l.startswith("RÈGLE") and not re.match(r"^RÈGLE \[", l):
            n_regle += 1
            # variantes rencontrées dans le corpus : « RÈGLE : », « RÈGLE — … : »,
            # « RÈGLE (**modal**) : », « RÈGLE INTERNE RENFORCÉE (frontière dure) : ».
            # Le qualificatif est conservé entre parenthèses après l'identifiant.
            m = re.match(r"^RÈGLE\b[ \t]*(?P<qual>[^:]{0,120}?)[ \t]*:[ \t]*", l)
            if m:
                qual = m.group("qual").lstrip("—-– ").strip()
                tete = f"RÈGLE [{prefixe}{n_regle:02d}] : "
                if qual:
                    tete += f"({qual}) "
                l = tete + l[m.end():]
            else:
                print(f"    ! ligne RÈGLE sans deux-points, identifiant {prefixe}{n_regle:02d} réservé mais non posé :")
                print(f"      {l[:90]}")
        elif re.match(r"^RÈGLE \[", l):
            n_regle += 1
        # 2. référencement de la bibliographie
        elif dans_biblio and l.startswith("|"):
            cells = l.split("|")
            tete = cells[1].strip() if len(cells) > 1 else ""
            if tete.lower().startswith("affirmation"):
                l = "| Réf. " + l
            elif set(tete) <= set("-: ") and tete:
                l = "|---" + l
            elif tete and not re.match(r"^[ST]\d+$", tete):
                n_ref += 1
                l = f"| {lettre_ref}{n_ref} " + l
            elif re.match(r"^[ST]\d+$", tete):
                n_ref += 1
        out.append(l)
    if not simulation:
        open(chemin, "w", encoding="utf-8").write("\n".join(out))
    return n_regle, n_ref


if __name__ == "__main__":
    slug = sys.argv[1]
    sec = "--sec" in sys.argv
    pux, pui = chemins(slug)
    if not pux:
        sys.exit(f"sujet introuvable : {slug}")
    S = slug.upper()
    rx, sx = traite(pux, f"{S}-R", "S", sec)
    ru, su = traite(pui, f"{S}-U", "T", sec)
    print(f"{slug:18} UX : {rx:3} règles, {sx:2} sources   UI : {ru:3} règles, {su:2} sources"
          + ("   [simulation]" if sec else ""))
