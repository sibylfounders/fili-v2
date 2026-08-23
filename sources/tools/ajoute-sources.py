#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Ajoute des lignes à la table « Sources et niveau de confiance » d'un sujet.

Ligne à ligne, idempotent : une référence déjà présente n'est jamais réécrite.
Les lignes sont insérées à la fin de la table existante, qui est le dernier bloc
de lignes commençant par « | » sous le titre « ## Sources et niveau de confiance ».

Usage : python3 ajoute-sources.py <slug> <sources-<slug>.json> [racine_md]
"""
import json, os, re, sys

NATURES = ["principles", "languages", "foundations", "components", "patterns", "flows"]


def chemin(md, slug, couche):
    suffixe = "-UX.md" if couche == "ux" else "-UI.md"
    for n in NATURES:
        p = os.path.join(md, n, f"{slug.upper()}{suffixe}")
        if os.path.exists(p):
            return p
    return None


def insere(chemin, lignes_a_ajouter):
    if not chemin or not os.path.exists(chemin):
        return 0, "fichier absent"
    lignes = open(chemin, encoding="utf-8").read().split("\n")

    # 1. localiser le titre de la bibliographie
    i_titre = next((i for i, l in enumerate(lignes)
                    if l.strip().lower().startswith("## sources et niveau de confiance")), None)
    if i_titre is None:
        return 0, "pas de table de sources"

    # 2. dernière ligne consécutive du tableau après le titre
    i = i_titre + 1
    fin = None
    while i < len(lignes):
        if lignes[i].startswith("|"):
            fin = i
        elif lignes[i].startswith("## "):
            break
        i += 1
    if fin is None:
        return 0, "table vide"

    existantes = {m.group(1) for l in lignes[i_titre:fin + 1]
                  for m in [re.match(r"^\|\s*([ST]\d+)\s*\|", l)] if m}

    nouvelles = []
    for a in lignes_a_ajouter:
        if a["ref"] in existantes:
            continue
        nouvelles.append("| {ref} | {affirmation} | {source_markdown} | {confiance} |".format(**a))
    if not nouvelles:
        return 0, "déjà présentes"

    lignes[fin + 1:fin + 1] = nouvelles
    open(chemin, "w", encoding="utf-8").write("\n".join(lignes))
    return len(nouvelles), "ok"


if __name__ == "__main__":
    slug, src = sys.argv[1], sys.argv[2]
    md = sys.argv[3] if len(sys.argv) > 3 else os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "apps/site/content/md")
    ajouts = json.load(open(src, encoding="utf-8"))
    total = 0
    for couche in ("ux", "ui"):
        lot = [a for a in ajouts if a["couche"] == couche]
        if not lot:
            continue
        n, msg = insere(chemin(md, slug, couche), lot)
        total += n
        print(f"  {slug:12} {couche.upper()} : {n:2} sources ajoutées ({msg})")
    print(f"{slug} — {total} sources ajoutées au total")
