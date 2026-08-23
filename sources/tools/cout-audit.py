#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Étape 0 — ce que coûte un audit chez l'utilisateur. On ne compresse pas ce qu'on ne mesure pas.

Donne, par scénario d'audit, le nombre de paquets chargés, les tokens de règles lus avant
même de regarder l'écran, le nombre de règles embarquées et combien portent un critère
constatable. Ce dernier chiffre est le seul qui prédise la reproductibilité d'un audit.

Usage : python3 tools/cout-audit.py
"""
import glob, os, re

ICI = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST = os.path.join(ICI, "dist")
MODE = os.environ.get("MODE", "audit")

SCENARIOS = {
    "Inscription":            ["accessibility", "creation-compte", "form", "input", "button"],
    "Formulaire de contact":  ["accessibility", "form", "input", "button", "alert"],
    "Dashboard / collection": ["accessibility", "collection", "card", "grid", "adaptive"],
    "Page de contenu":        ["accessibility", "typography", "spacing", "link", "grid"],
    "Feedback / notification":["accessibility", "alert", "toast", "voice", "motion"],
}


def mesure(slug):
    p = os.path.join(DIST, MODE, f"RULES-{slug}.md")
    if not os.path.exists(p):
        return None
    t = open(p, encoding="utf-8").read()
    return {
        "tokens": len(t) // 4,
        "regles": len(re.findall(r"^- \*\*\[", t, re.M)),
        "criteres": len(re.findall(r"^  - vérifiable :", t, re.M)),
        "qualifiees": len(re.findall(r"^- \*\*\[(?:loi|préférence)\]", t, re.M)),
    }


if __name__ == "__main__":
    print(f"MODE {MODE}\n")
    print(f"{'scénario':26} {'tokens':>7} {'règles':>7} {'qualifiées':>11} {'à critère':>10}")
    for nom, lot in SCENARIOS.items():
        m = [mesure(s) for s in lot]
        m = [x for x in m if x]
        t = sum(x["tokens"] for x in m)
        r = sum(x["regles"] for x in m)
        q = sum(x["qualifiees"] for x in m)
        c = sum(x["criteres"] for x in m)
        print(f"{nom:26} {t:>7} {r:>7} {q:>11} {c:>10}")
    tous = [mesure(os.path.basename(f)[6:-3]) for f in glob.glob(os.path.join(DIST, MODE, "RULES-*.md"))]
    tous = [x for x in tous if x]
    T = sum(x["tokens"] for x in tous); Rg = sum(x["regles"] for x in tous)
    Q = sum(x["qualifiees"] for x in tous); C = sum(x["criteres"] for x in tous)
    print(f"\nDistribution entière : {len(tous)} sujets · {T} tokens · {Rg} règles")
    print(f"  qualifiées (loi ou préférence) : {Q} ({Q * 100 // Rg} %)")
    print(f"  porteuses d'un critère         : {C} ({C * 100 // Rg} %)")
