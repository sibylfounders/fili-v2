#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Compile la couche pédagogique de l'audit : les lois UX, au moment de la livraison.

Pourquoi ce fichier existe, et pourquoi il est séparé des RULES
---------------------------------------------------------------
Une loi UX n'est pas un critère d'audit : elle n'a pas de seuil, on ne peut pas la
constater violée. La charger avec les règles ne produirait que du bruit — c'est
pourquoi `laws` ne part pas dans le paquet d'inspection.

Mais une loi a une autre fonction, et elle est commerciale autant que pédagogique :
au moment où le rapport est lu par un humain, elle explique **pourquoi** un constat
compte. Elle fait autorité, elle rassure, et elle apprend quelque chose au lecteur —
l'outil forme ses utilisateurs par l'usage, pas seulement par la lecture de la doctrine.

Ce fichier se charge donc **une seule fois, à la rédaction du rapport**, jamais pendant
l'inspection. Chaque entrée porte un déclencheur (quel type de constat l'appelle), une
phrase à recopier telle quelle, et sa source primaire.

Usage : python3 tools/compile-pedagogie.py
"""
import json, os, re, sys

ICI = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCTRINE = os.path.join(ICI, "apps/site/content/doctrine")
DIST = os.path.join(ICI, "dist/audit")

# Déclencheurs — éditorial, pas mécanique. « Quel constat appelle quelle loi. »
# Une loi sans déclencheur ne sert à rien dans un rapport : elle n'est pas reprise ici.
DECLENCHEURS = {
    "LAWS-R06": ["formulaire long", "écran dense", "étapes multiples", "jargon", "notion à retenir"],
    "LAWS-R08": ["texte dense", "liste longue", "numéro non groupé", "formulaire d'un seul bloc"],
    "LAWS-R09": ["information à retenir d'un écran à l'autre", "code à recopier", "récapitulatif absent"],
    "LAWS-R11": ["message important en zone publicitaire", "bandeau ignoré", "information en encart"],
    "LAWS-R14": ["cible trop petite", "cible éloignée", "bouton en coin", "lien de pied de page"],
    "LAWS-R17": ["format de saisie strict", "téléphone refusé", "espaces refusés", "IBAN, carte"],
    "LAWS-R19": ["aide préalable", "tutoriel bloquant", "onboarding imposé", "aide non contextuelle"],
    "LAWS-R20": ["contenu qui bouge", "ouverture automatique", "changement sans action", "défilement volé"],
    "LAWS-R22": ["libellé loin de son champ", "espacement uniforme", "groupes indistincts"],
    "LAWS-R23": ["cadre superflu", "trait là où l'espace suffirait", "fond qui regroupe à tort"],
    "LAWS-R24": ["mêmes formes pour des rôles différents", "incohérence de traitement"],
    "LAWS-R27": ["tout est mis en avant", "trop d'accents", "aucune hiérarchie"],
    "LAWS-R28": ["information clé au milieu d'une liste", "ordre des options"],
    "LAWS-R29": ["latence perçue", "absence de retour immédiat", "animation trop longue"],
    "LAWS-R31": ["fin de parcours abrupte", "confirmation sèche", "moment d'erreur non réparé"],
    "LAWS-R33": ["exigence formulée en nombre de clics", "parcours jugé au comptage"],
    "LAWS-R12": ["plusieurs actions dominantes", "trop d'options simultanées"],
    "LAWS-R15": ["progression truquée", "étape gonflée", "jauge décorative"],
    "LAWS-R16": ["complexité reportée sur l'utilisateur", "champ que le système pourrait déduire"],
    "LAWS-R30": ["interface soignée mais pénible", "jugement esthétique confondu avec l'usage"],
    "LAWS-R10": ["tâche longue sans repère d'avancement"],
    "LAWS-R13": ["carte ou alerte surchargée d'actions"],
}

# Nom courant de la loi — ce que le lecteur reconnaît. Sans lui, la citation perd son autorité.
NOMS = {
    "LAWS-R06": "Charge cognitive (Sweller)",
    "LAWS-R08": "Découpage en unités (Miller, 1956)",
    "LAWS-R09": "Capacité de la mémoire de travail (Cowan, 2001)",
    "LAWS-R11": "Cécité aux bannières (Nielsen Norman Group)",
    "LAWS-R14": "Loi de Fitts (1954)",
    "LAWS-R17": "Principe de robustesse (Postel)",
    "LAWS-R19": "Paradoxe de l'utilisateur actif (Carroll & Rosson)",
    "LAWS-R20": "Changement sur demande (WCAG 3.2.5)",
    "LAWS-R22": "Proximité (Gestalt)",
    "LAWS-R23": "Région commune (Gestalt)",
    "LAWS-R24": "Similarité (Gestalt)",
    "LAWS-R27": "Effet Von Restorff",
    "LAWS-R28": "Effet de position sérielle (Glanzer & Cunitz, 1966)",
    "LAWS-R29": "Seuil Doherty (IBM, 1982)",
    "LAWS-R31": "Règle du pic-fin (Kahneman)",
    "LAWS-R33": "Réfutation de la règle des trois clics (UIE)",
    "LAWS-R12": "Loi de Hick — avec réserve",
    "LAWS-R15": "Gradient du but (Kivetz et al., 2006)",
    "LAWS-R16": "Loi de Tesler",
    "LAWS-R30": "Effet esthétique-utilisabilité",
    "LAWS-R10": "Effet Ovsiankina (reprise)",
    "LAWS-R13": "Surcharge de choix",
}

# Réserves à porter avec la citation — une loi mal citée détruit l'autorité qu'elle devait donner.
RESERVES = {
    "LAWS-R12": "Ne pas présenter Hick comme fondant « moins d'options » : prise à la lettre, elle "
                "suggère l'inverse (Liu et al., CHI 2020). Citer pour la lisibilité du choix, pas pour son nombre.",
    "LAWS-R13": "Effet moyen quasi nul en méta-analyse (Scheibehenne et al., 2010). Citer comme "
                "prudence de conception, jamais comme fait établi.",
    "LAWS-R10": "Ne pas citer Zeigarnik : l'effet ne réplique pas (méta-analyse 2025, ratio 0,99). "
                "C'est l'effet Ovsiankina — la reprise — qui tient.",
    "LAWS-R08": "Ne jamais écrire « 7 ± 2 » : Miller ne prescrit aucune limite d'items. "
                "Citer pour le découpage, pas pour un plafond.",
    "LAWS-R15": "L'objection à une progression truquée est éthique, pas empirique — "
                "Kivetz et al. montrent que la jauge gonflée accélère la complétion.",
    "LAWS-R29": "Doherty & Thadhani est une étude de productivité, pas une expérience contrôlée ; "
                "le seuil de 400 ms est une lecture postérieure. Citer l'ordre de grandeur, pas le chiffre exact.",
    "LAWS-R30": "Sonderegger & Sauer (2010) montrent que l'esthétique améliore aussi la performance réelle : "
                "ne pas réduire l'effet à « le beau paraît utilisable ».",
    "LAWS-R17": "La RFC 9413 (IAB, 2023) retourne le principe côté réseau. En interface, il tient — "
                "citer GOV.UK plutôt que les RFC d'origine.",
}


def phrase(enonce):
    """Une phrase, pas un paragraphe : c'est ce qu'un lecteur retient."""
    p = re.split(r"(?<=[.;])\s+", (enonce or "").strip())
    return p[0].rstrip(".;") + "." if p else ""


def main():
    fiche = json.load(open(os.path.join(DOCTRINE, "laws.json"), encoding="utf-8"))
    par_id = {d["id"]: d for d in fiche.get("decisions", [])}

    L = ["---",
         "usage: rédaction du rapport — jamais pendant l'inspection",
         "role: expliquer à un lecteur humain pourquoi un constat compte",
         f"lois: {len(DECLENCHEURS)}",
         "---",
         "# Lois UX — la couche pédagogique de l'audit",
         "",
         "> Une loi n'est **pas** un critère : elle n'a pas de seuil, on ne la constate pas violée.",
         "> Elle sert au moment de la livraison — elle explique pourquoi un constat compte, elle fait",
         "> autorité, et elle apprend quelque chose au lecteur. L'outil forme par l'usage.",
         ">",
         "> **Comment s'en servir.** Après avoir rédigé un constat, chercher ici un déclencheur qui",
         "> corresponde. S'il y en a un, ajouter une ligne « Pourquoi ça compte » avec la phrase et sa",
         "> source. Au plus **une loi par constat**, et jamais de loi sans constat : une leçon sans",
         "> problème à résoudre ne s'apprend pas.",
         ">",
         "> **Les réserves ne sont pas facultatives.** Une loi mal citée détruit exactement l'autorité",
         "> qu'elle devait donner — et un lecteur averti le verra.",
         ""]

    manquantes = []
    for rid, decl in DECLENCHEURS.items():
        d = par_id.get(rid)
        if not d:
            manquantes.append(rid)
            continue
        url = ""
        p = d.get("principale")
        if p and p.get("liens"):
            url = p["liens"][0].get("url") or ""
        L.append(f"## {NOMS.get(rid, rid)}  `{rid}`")
        L.append(f"- **quand la citer** : {' · '.join(decl)}")
        L.append(f"- **à recopier** : {phrase(d.get('enonce'))}")
        if url:
            L.append(f"- **source** : {url}")
        if rid in RESERVES:
            L.append(f"- ⚠️ **réserve** : {RESERVES[rid]}")
        L.append("")

    os.makedirs(DIST, exist_ok=True)
    texte = "\n".join(L)
    chemin = os.path.join(DIST, "PEDAGOGIE.md")
    open(chemin, "w", encoding="utf-8").write(texte)
    print(f"dist/audit/PEDAGOGIE.md — {len(DECLENCHEURS) - len(manquantes)} lois, "
          f"{len(RESERVES)} réserves, ~{len(texte) // 4} tokens")
    if manquantes:
        print("  ! identifiants absents de laws.json :", ", ".join(manquantes))
    sans = [r for r in par_id.values()
            if r["statut"] != "methode" and r["id"] not in DECLENCHEURS]
    if sans:
        print(f"  {len(sans)} lois qualifiées sans déclencheur — non reprises :",
              ", ".join(r["id"].replace("LAWS-", "") for r in sans))


if __name__ == "__main__":
    main()
