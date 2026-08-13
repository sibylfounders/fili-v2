#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Applique un fichier d'annotations (id → statut / source / mesure / énoncé) au markdown.

Ligne à ligne, idempotent, jamais de regex sur le fichier entier. N'écrit rien pour une règle
absente du fichier d'annotations : une règle non annotée reste non qualifiée, et c'est un
signal, pas un oubli à masquer.

Usage : python3 tools/applique-annotations.py <slug> /tmp/annot-<slug>.json
"""
import json, os, re, sys

ICI = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MD = os.path.join(ICI, "apps/site/content/md")
NATURES = ["principles", "languages", "foundations", "components", "patterns", "flows"]
LIBELLE = {"universelle": "propriété universelle", "identite": "parti pris d'identité",
           "implementation": "implémentation de référence", "methode": "note de méthode"}


def chemins(slug):
    for n in NATURES:
        p = os.path.join(MD, n, f"{slug.upper()}-UX.md")
        if os.path.exists(p):
            return [p, p.replace("-UX.md", "-UI.md")]
    return []


def applique(chemin, annots):
    if not os.path.exists(chemin):
        return 0
    lignes = open(chemin, encoding="utf-8").read().split("\n")
    out, n, i = [], 0, 0
    while i < len(lignes):
        l = lignes[i]
        out.append(l)
        m = re.match(r"^RÈGLE \[([A-Z0-9-]+)\] :", l)
        if m and m.group(1) in annots:
            a = annots[m.group(1)]
            # on saute d'éventuelles annotations déjà posées (idempotence)
            j = i + 1
            while j < len(lignes) and re.match(r"^(STATUT|SOURCE|ÉNONCÉ|MESURE|CONTRE|POURQUOI) :", lignes[j]):
                j += 1
            out.append(f"STATUT : {LIBELLE[a['statut']]}")
            out.append(f"SOURCE : {a['source'] or 'interne'}")
            if a.get("enonce"):
                out.append(f"ÉNONCÉ : {a['enonce']}")
            if a.get("mesure"):
                out.append(f"MESURE : {a['mesure']}")
            n += 1
            i = j
            continue
        i += 1
    open(chemin, "w", encoding="utf-8").write("\n".join(out))
    return n


if __name__ == "__main__":
    slug, source = sys.argv[1], sys.argv[2]
    annots = {a["id"]: a for a in json.load(open(source, encoding="utf-8"))}
    total = sum(applique(c, annots) for c in chemins(slug))
    manquantes = len(annots) - total
    print(f"{slug:18} {total:3} règles annotées" + (f"  ({manquantes} id inconnus dans le markdown)" if manquantes else ""))
