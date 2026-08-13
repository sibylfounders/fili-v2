#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Vérifie que les pages utilisent le kit, et l'utilisent correctement.

Trois défauts, par ordre de gravité :

  1. CARTE RÉINVENTÉE — un bloc `rounded-* + border + p-*` écrit à la main là où
     `Card` ou `CardGroup` existe. C'est le défaut qui a motivé la promotion de
     CardGroup dans le paquet, et il est revenu deux fois depuis.

  2. GROUPE MAL PEUPLÉ — un `CardGroup` dont les enfants ne sont pas de vraies
     `Card` (`Card.Root`). Silencieux et redoutable : la mécanique du groupe pose
     ses cellules autour de ses enfants pour les filets, les coins et le highlight
     de proximité ; avec autre chose que des Card elle encadre du contenu qui n'en
     est pas, et le pattern dégénère en grille nue. L'ancienne API `CardGroup.Card`
     (supprimée le 2026-07-30) est signalée comme obsolète.

  3. TOKEN INEXISTANT — une classe qui référence un token absent du système. Elle
     ne produit aucun style et passe la compilation sans bruit.

Usage : python3 tools/verifie-kit.py [--strict]
        --strict : code de sortie 1 s'il reste un défaut (pour un hook ou la CI).
"""
import os
import re
import sys

ICI = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCES = [os.path.join(ICI, "apps/site/app"), os.path.join(ICI, "apps/site/lib")]
TOKENS_CSS = os.path.join(ICI, "packages/tokens/dist/tokens.css")

# Plus AUCUNE exemption de dossier (2026-07-30) : l'atelier et les pages de test
# consomment le kit comme n'importe quelle page — une exception éventuelle est
# locale (marqueur `kit-ok:` motivé), jamais un dossier entier.
EXEMPTS = ()

PREFIXES_TOKEN = ("bg-", "text-", "border-", "ring-", "fill-", "stroke-", "from-", "to-", "via-")
# Classes Tailwind natives qui partagent ces préfixes sans être des tokens de couleur.
BLANCHE = {
    "text-xs", "text-sm", "text-base", "text-lg", "text-xl", "text-2xl", "text-3xl", "text-4xl",
    "text-center", "text-left", "text-right", "text-balance", "text-pretty", "text-wrap",
    "text-nowrap", "text-ellipsis", "text-clip", "text-transparent", "text-current", "text-inherit",
    "border-0", "border-2", "border-4", "border-8", "border-t", "border-b", "border-l", "border-r",
    "border-x", "border-y", "border-solid", "border-dashed", "border-dotted", "border-none",
    "border-collapse", "border-separate", "border-transparent", "border-current",
    "bg-transparent", "bg-current", "bg-inherit", "bg-none", "bg-cover", "bg-contain",
    "bg-center", "bg-no-repeat", "bg-clip-text", "bg-gradient-to-r", "bg-gradient-to-b",
    "ring-0", "ring-1", "ring-2", "ring-offset-2", "fill-none", "fill-current", "stroke-current",
}


def tokens_couleur():
    """Noms de couleurs réellement exposés par @fili/tokens."""
    if not os.path.exists(TOKENS_CSS):
        return None
    src = open(TOKENS_CSS, encoding="utf-8").read()
    return {m.group(1) for m in re.finditer(r"^\s*--([a-z0-9-]+)\s*:", src, re.M)}


def fichiers():
    for racine in SOURCES:
        for d, _, noms in os.walk(racine):
            for n in noms:
                if n.endswith((".tsx", ".ts")):
                    p = os.path.join(d, n)
                    rel = os.path.relpath(p, ICI)
                    yield p, rel, any(x in rel for x in EXEMPTS)


def cartes_maison(src):
    """Blocs qui ont la forme d'une carte sans en être une.

    Deux échappatoires, parce qu'un bloc encadré n'est pas toujours une carte :
      · les éléments `<pre>` — un bloc de code encadré reste un bloc de code ;
      · le marqueur `kit-ok:` en commentaire sur la ligne précédente, qui déclare
        une exception motivée plutôt que de la laisser traîner comme une dette.
    """
    lignes = src.split("\n")
    out = []
    for m in re.finditer(r'className=(?:"([^"]*)"|\{`([^`]*)`\})', src):
        cls = m.group(1) or m.group(2) or ""
        if not (re.search(r"\brounded-(md|lg|xl)\b", cls) and re.search(r"\bborder\b", cls)
                and re.search(r"\bp-(sm|md|lg)\b", cls)):
            continue
        i = src[: m.start()].count("\n")
        contexte = "\n".join(lignes[max(0, i - 4): i + 1])
        if "<pre" in contexte or "kit-ok:" in contexte:
            continue
        out.append((i + 1, cls[:70]))
    return out


def groupes_mal_peuples(src):
    """CardGroup dont les enfants directs ne sont pas de vraies Card (Card.Root)."""
    out = []
    for m in re.finditer(r"<CardGroup\b(?![\w.])", src):
        depart = m.start()
        fin = src.find("</CardGroup>", depart)
        if fin < 0:
            continue
        corps = src[depart:fin]
        ligne = src[:depart].count("\n") + 1
        if "<CardGroup.Card" in corps or "<Kit.Card" in corps:
            out.append((ligne, "CardGroup.Card — API SUPPRIMÉE (2026-07-30) : composer de vraies Card"))
            continue
        if "<Card.Root" in corps or "<DemoCard" in corps or "{items" in corps or "{children" in corps:
            continue
        enfants = re.findall(r"<([A-Z][\w.]*)", corps[corps.find(">") :])
        if enfants:
            out.append((ligne, ", ".join(sorted(set(enfants))[:4])))
    return out


def tokens_inventes(src, connus):
    out = []
    if not connus:
        return out
    for m in re.finditer(r'className=(?:"([^"]*)"|\{`([^`]*)`\})', src):
        cls = m.group(1) or m.group(2) or ""
        ligne = src[: m.start()].count("\n") + 1
        for mot in re.split(r"[\s`${}()?:]+", cls):
            mot = mot.strip()
            if not mot or mot in BLANCHE:
                continue
            base = re.sub(r"^(hover|focus|active|group-hover|dark|md|lg|tablet|desktop):", "", mot)
            if not base.startswith(PREFIXES_TOKEN) or base in BLANCHE:
                continue
            # Deux conventions cohabitent : « bg-surface » -> token « surface »,
            # « text-h3 » -> token « text-h3 ». On accepte les deux lectures.
            nom = base.split("-", 1)[1] if "-" in base else ""
            nom = nom.split("/")[0]
            if base in connus or nom in connus:
                continue
            if not nom or re.match(r"^(\d|\[)", nom):
                continue
            # bordures directionnelles chiffrées : border-l-2, border-t-4…
            if re.match(r"^border-[lrtbxy]-\d+$", base):
                continue
            out.append((ligne, base))
    return out


def main():
    connus = tokens_couleur()
    if connus is None:
        print("! packages/tokens/dist/tokens.css introuvable — contrôle des tokens ignoré\n")
    total = {"cartes": 0, "groupes": 0, "tokens": 0}

    for p, rel, exempt in sorted(fichiers(), key=lambda x: x[1]):
        src = open(p, encoding="utf-8").read()
        cartes = [] if exempt else cartes_maison(src)
        groupes = groupes_mal_peuples(src)
        toks = [] if exempt else tokens_inventes(src, connus)
        if not (cartes or groupes or toks):
            continue
        print(rel)
        for ligne, cls in cartes:
            print(f"   ligne {ligne:4}  CARTE RÉINVENTÉE     {cls}")
            total["cartes"] += 1
        for ligne, enfants in groupes:
            print(f"   ligne {ligne:4}  GROUPE MAL PEUPLÉ    enfants : {enfants}")
            total["groupes"] += 1
        for ligne, tok in sorted(set(toks)):
            print(f"   ligne {ligne:4}  TOKEN INEXISTANT     {tok}")
            total["tokens"] += 1
        print()

    n = sum(total.values())
    print(f"{total['cartes']} carte(s) réinventée(s) · {total['groupes']} groupe(s) mal peuplé(s) · "
          f"{total['tokens']} token(s) inexistant(s)")
    if not n:
        print("Rien à signaler.")
    if "--strict" in sys.argv and n:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
