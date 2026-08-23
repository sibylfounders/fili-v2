#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Décisions sourcées — lit un fichier `<SUJET>-UX.md` annoté (RÈGLE [ID] / STATUT / SOURCE /
PROBLÈME + bibliographie `S1…Sn`) et écrit le tableau `decisions[]` dans la fiche
`apps/site/content/doctrine/<slug>.json`, en rattachant à chaque décision les cas d'usage
qui la citent (les cartes portent le texte de la règle, on l'apparie à son ID).

Usage : python3 tools/extrait-decisions.py <slug> [chemin/UX.md]
Le markdown reste la source de vérité ; ce script ne fait que projeter.
"""
import html as _html
import json, os, re, sys, unicodedata

ICI = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENU = os.path.join(ICI, "apps/site/content")

STATUTS = {
    "propriété universelle": "universelle",
    "parti pris d'identité": "identite",
    "implémentation de référence": "implementation",
    "note de méthode": "methode",
}


def normalise(t: str) -> str:
    t = _html.unescape(t)
    t = re.sub(r"<[^>]+>", " ", t)
    t = unicodedata.normalize("NFD", t)
    t = "".join(c for c in t if unicodedata.category(c) != "Mn").lower()
    return re.sub(r"[^a-z0-9]+", " ", t).strip()


def liens(md: str):
    """[label](url) → objets ; le reste du texte devient un lien sans url."""
    out = [{"label": l, "url": u} for l, u in re.findall(r"\[([^\]]+)\]\(([^)]+)\)", md)]
    return out or [{"label": re.sub(r"\s+", " ", md).strip(), "url": None}]


def bibliographie(src: str):
    refs = {}
    for ligne in re.findall(r"^\|\s*([ST]\d+)\s*\|(.+)$", src, re.M):
        ref, reste = ligne
        cells = [c.strip() for c in reste.split("|")]
        refs[ref] = {
            "ref": ref,
            "affirmation": cells[0] if len(cells) > 0 else "",
            "liens": liens(cells[1]) if len(cells) > 1 else [],
            "confiance": cells[2] if len(cells) > 2 else "",
        }
    return refs


def decisions(src: str, refs, couche: str):
    out = []
    blocs = re.split(r"(?=^RÈGLE \[)", src, flags=re.M)[1:]
    for b in blocs:
        m = re.match(r"^RÈGLE \[([A-Z0-9-]+)\] : (.*?)(?=^STATUT :|^SOURCE :|^ÉNONCÉ :|^MESURE :|^POURQUOI :|^CONTRE :|^PROBLÈME :|\Z)", b, re.S | re.M)
        if not m:
            continue
        ident, solution = m.group(1), m.group(2).strip()
        champ = lambda cle: (re.search(r"^%s : (.+)$" % cle, b, re.M) or [None, ""])[1] if re.search(r"^%s : (.+)$" % cle, b, re.M) else ""
        statut_txt = (re.search(r"^STATUT : (.+)$", b, re.M) or [None, ""])[1].strip() if re.search(r"^STATUT : (.+)$", b, re.M) else ""
        source_txt = (re.search(r"^SOURCE : (.+)$", b, re.M) or [None, ""])[1].strip() if re.search(r"^SOURCE : (.+)$", b, re.M) else ""
        def ligne(cle):
            m2 = re.search(r"^%s : (.+)$" % cle, b, re.M)
            return m2.group(1).strip() if m2 else ""
        enonce = ligne("ÉNONCÉ")
        contre = ligne("CONTRE")
        mesure = ligne("MESURE")
        # CRITERE : l'expression exécutable, à côté de la MESURE sans la remplacer.
        # Peut courir sur plusieurs lignes (continuation indentée).
        mc = re.search(r"^CRITERE : ((?:.+)(?:\n[ \t]+\S.*)*)$", b, re.M)
        critere = re.sub(r"\s+", " ", mc.group(1)).strip() if mc else ""
        # SCENE : l'état dans lequel la mesure est prise. Absente = « repos ».
        # Beaucoup de règles d'accessibilité ne mesurent RIEN au repos.
        scene = ligne("SCENE") or "repos"
        probleme = ligne("POURQUOI") or ligne("PROBLÈME")
        # à défaut de PROBLÈME explicite : le « Pourquoi » ou l'« Erreur fréquente » qui suit
        if not probleme:
            q = re.search(r"^> \*\*(Pourquoi|Erreur fréquente)\*\* ?: (.+)$", b, re.M)
            if q:
                probleme = q.group(2).strip()
        confiance = (re.search(r"^CONFIANCE : (.+)$", b, re.M) or [None, ""])[1].strip() if re.search(r"^CONFIANCE : (.+)$", b, re.M) else ""
        srcs, interne = [], False
        for jeton in re.split(r"[,\s]+", source_txt):
            jeton = jeton.strip(" .")
            if jeton in refs:
                srcs.append(refs[jeton])
            elif jeton.lower().startswith("interne"):
                interne = True
        out.append({
            "id": ident,
            "couche": couche,
            "solution": solution,
            "enonce": enonce,
            "mesure": mesure,
            "critere": critere,
            "scene": scene,
            "contre": contre,
            "probleme": probleme,
            "statut": STATUTS.get(statut_txt, "methode"),
            "statutLibelle": statut_txt,
            "interne": interne,
            "sources": srcs,
            "principale": srcs[0] if srcs else None,
            "confiance": confiance,
            "cas": [],
        })
    return out


def rattache_cas(fiche, decs):
    """Chaque carte de cas cite le texte d'une règle : on lui rend son ID."""
    index = [(d, normalise(d["solution"])[:160]) for d in decs]
    lies = 0
    for fam in fiche.get("cas", []):
        for cas in fam.get("cas", []):
            for r in cas.get("regles", []):
                aiguille = normalise(r.get("html", ""))[:70]
                if not aiguille:
                    continue
                trouve = next((d for d, texte in index if aiguille[:50] and aiguille[:50] in texte), None)
                if not trouve:
                    trouve = next((d for d, texte in index if texte[:50] and texte[:50] in normalise(r.get("html", ""))), None)
                if trouve:
                    r["id"] = trouve["id"]
                    if not any(c["id"] == cas["id"] for c in trouve["cas"]):
                        trouve["cas"].append({"id": cas["id"], "titre": cas["titre"], "famille": fam["titre"]})
                    lies += 1
    return lies


def main():
    slug = sys.argv[1]
    md = sys.argv[2] if len(sys.argv) > 2 else None
    if not md:
        for nature in ("foundations", "components", "patterns", "principles", "languages", "flows"):
            p = os.path.join(CONTENU, "md", nature, f"{slug.upper()}-UX.md")
            if os.path.exists(p):
                md = p
                break
    src = open(md, encoding="utf-8").read()
    decs = decisions(src, bibliographie(src), "ux")
    mdui = md.replace("-UX.md", "-UI.md")
    if os.path.exists(mdui):
        srcui = open(mdui, encoding="utf-8").read()
        decs += decisions(srcui, bibliographie(srcui), "ui")
    pj = os.path.join(CONTENU, "doctrine", f"{slug}.json")
    fiche = json.load(open(pj, encoding="utf-8"))
    lies = rattache_cas(fiche, decs)
    fiche["decisions"] = decs
    json.dump(fiche, open(pj, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    ux = [d for d in decs if d["couche"] == "ux"]
    sans = [d["id"] for d in decs if not d["sources"] and not d["interne"]]
    orphelines = [d["id"] for d in ux if not d["cas"] and d["statut"] != "methode"]
    print(f"{slug} : {len(ux)} règles UX + {len(decs) - len(ux)} règles UI · {lies} citations rattachées")
    print(f"  sans source déclarée : {', '.join(sans) or 'aucune'}")
    print(f"  sans cas d'usage     : {', '.join(orphelines) or 'aucune'}")
    for st in ("universelle", "identite", "implementation", "methode"):
        n = sum(1 for d in decs if d["statut"] == st)
        print(f"  {st:15} {n}")

    # Concentration des sources : une LOI doit reposer sur une norme, ou sur au moins deux
    # systèmes indépendants. Un seul système, c'est un emprunt — pas une convergence.
    import collections
    NORMATIF = re.compile(r"w3\.org|wcag|developer\.mozilla|whatwg|learn\.microsoft", re.I)
    hotes = collections.Counter()
    fragiles = []
    for d in decs:
        if d["statut"] == "methode":
            continue
        h = set()
        for src in d["sources"]:
            for l in src["liens"]:
                u = l["url"] or l["label"]
                h.add(re.sub(r"^https?://(www\.)?", "", u).split("/")[0])
        for x in h:
            hotes[x] += 1
        normes = [x for x in h if NORMATIF.search(x)]
        systemes = [x for x in h if not NORMATIF.search(x)]
        if d["statut"] == "universelle" and not normes and len(systemes) < 2:
            fragiles.append(d["id"])
    print("  sources les plus citées :", ", ".join(f"{h}×{n}" for h, n in hotes.most_common(3)) or "aucune")
    print("  LOIS fragiles (ni norme, ni deux systèmes) :", ", ".join(fragiles) or "aucune")


if __name__ == "__main__":
    main()
