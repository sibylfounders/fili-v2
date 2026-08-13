#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Fabrique un exemple de sortie d'audit à partir des VRAIES données de la doctrine
(`content/doctrine/<slug>.json`) — pour vérifier que le corpus produit bien les trois
registres : à corriger / suggestion / à trancher.

Usage : python3 tools/exemple-constat.py > tools/exemple-constat.md
"""
import json, os

ICI = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
F = json.load(open(os.path.join(ICI, "apps/site/content/doctrine/border.json"), encoding="utf-8"))
DEC = {d["id"]: d for d in F["decisions"]}
TOK = {t["token"]: t for t in F["specs"]["tokens"]}

# Observations simulées sur un écran audité — c'est la seule partie qui viendrait du produit客.
OBSERVATIONS = [
    {"regle": "BORDER-R03", "constat": "La bordure du champ « E-mail » est à 1.9:1 sur son fond (#D9D9D9 sur #FFFFFF). Le champ n'est identifiable que par ce trait.", "mesure": "1.9:1", "selecteur": ".signup-form input[type=email]"},
    {"regle": "BORDER-R04", "constat": "Les bordures des champs et des encadrés sont à 3px.", "mesure": "3px", "selecteur": ".signup-form input, .signup-card"},
    {"cas": "Style de trait (dashed, dotted)", "constat": "La zone de dépôt du justificatif utilise un trait pointillé de 2px.", "selecteur": ".signup-upload"},
]

REGISTRE = {"universelle": "À corriger", "identite": "Suggestion", "implementation": "À corriger (code)"}


def lien(d):
    p = d.get("principale")
    if not p or not p["liens"]:
        return "décision interne — aucune source externe"
    l = p["liens"][0]
    return f"[{l['label']}]({l['url']})" if l["url"] else l["label"]


def bloc(o):
    if "regle" not in o:
        return None
    d = DEC[o["regle"]]
    reg = REGISTRE[d["statut"]]
    valeurs = ""
    if o["regle"] == "BORDER-R03":
        t = TOK.get("roles.delimitante")
        valeurs = f" Utiliser `{t['ref']}` (valeur résolue {t['valeur']}), qui tient le seuil sur fond clair." if t else ""
    if o["regle"] == "BORDER-R04":
        valeurs = " Passer à 1px et signaler les états par la couleur du trait, pas par son épaisseur."
    prompt = (
        f"Dans {o['selecteur']}, applique la règle {d['id']} du design system : {d['enonce']}"
        + (f" Critère à respecter : {d['mesure']}." if d["mesure"] else "")
        + valeurs
        + " Ne modifie aucune autre propriété visuelle et n'introduis pas de nouvelle valeur codée en dur."
    )
    nuance = "" if d["statut"] == "universelle" else "  *(citée en contrepoint : c'est notre choix, pas une norme)*"
    return f"""### {reg} — {d['id']}

**Où** — Inscription (`{o['selecteur']}`)
**Problème** — {o['constat']}
**Règle** — {d['enonce']}
**Solution** — {('Amener la mesure à « ' + d['mesure'] + ' ».') if d['mesure'] else 'Voir la règle.'}{valeurs}
**Source** — {lien(d)}{nuance}

```
{prompt}
```
"""


def bloc_ouvert(o):
    cas = next((c for fam in F["cas"] for c in fam["cas"] if c["titre"] == o["cas"]), None)
    return f"""### À trancher — non couvert par le référentiel

**Où** — Inscription (`{o['selecteur']}`)
**Constat** — {o['constat']}
**Ce que dit le référentiel** — rien. Le cas « {cas['titre']} » est cartographié mais explicitement **non couvert** : {cas['quand']}
**Question à trancher** — le trait pointillé doit-il devenir un rôle à part entière (zone de dépôt) ou rester hors périmètre ? Tant que ce n'est pas décidé, aucune correction n'est proposée.
"""


print("# Exemple de sortie d'audit — écran « Inscription »\n")
print("> Généré depuis les données réelles de la doctrine (`border`) par `tools/exemple-constat.py`.")
print("> Trois registres, jamais mélangés : ce qui viole une norme, ce qui diverge de notre parti pris, ce que le référentiel ne tranche pas.\n")
for o in OBSERVATIONS:
    print(bloc(o) if "regle" in o else bloc_ouvert(o))
