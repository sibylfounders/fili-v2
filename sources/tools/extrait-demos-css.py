#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Porte les règles CSS des spécimens du site DS-MD sous `.doctrine-demo`, re-câblées
sur les tokens du monorepo. Sortie : apps/site/app/doctrine-demo.css.
Usage : python3 tools/extrait-demos-css.py [chemin/vers/Design System MD]"""
import json, glob, re, os, sys

MD = sys.argv[1] if len(sys.argv) > 1 else os.path.expanduser("~/Claude/Projects/Design System MD")
ICI = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = os.path.join(ICI, "apps/site/content/doctrine")
OUT = os.path.join(ICI, "apps/site/app/doctrine-demo.css")

classes = set()
for f in glob.glob(D + "/*.json"):
    for s in json.load(open(f, encoding="utf-8"))["specs"]["specimens"]:
        for cl in re.findall(r'class="([^"]+)"', s):
            classes.update(cl.split())

css = re.sub(r"/\*.*?\*/", "", open(os.path.join(MD, "public/assets/site.css"), encoding="utf-8").read(), flags=re.S)

def concerne(sel):
    return any(re.search(r"\.%s\b" % re.escape(c), sel) for c in classes)

regles, i, n = [], 0, len(css)
while i < n:
    j = css.find("{", i)
    if j < 0:
        break
    tete = css[i:j].strip()
    prof, k = 0, j
    while k < n:
        if css[k] == "{":
            prof += 1
        elif css[k] == "}":
            prof -= 1
            if prof == 0:
                break
        k += 1
    regles.append((tete, css[j + 1:k], tete.startswith("@")))
    i = k + 1

blocs, kf = [], set()
for tete, corps, est_at in regles:
    tete = re.sub(r"\s+", " ", tete).strip()
    if est_at:
        if tete.startswith("@media"):
            gardees = [(s.strip(), c) for s, c in re.findall(r"([^{}]+)\{([^{}]*)\}", corps) if concerne(s)]
            if gardees:
                blocs.append(tete + "{" + "".join(".doctrine-demo :is(%s){%s}" % (s, c) for s, c in gardees) + "}")
        continue
    if not concerne(tete):
        continue
    sel = ", ".join(".doctrine-demo :is(%s)" % p.strip() for p in tete.split(","))
    blocs.append("%s {\n%s\n}" % (sel, corps.strip()))
    kf.update(re.findall(r"animation(?:-name)?:\s*([a-zA-Z0-9_-]+)", corps))
for tete, corps, est_at in regles:
    if est_at and tete.startswith("@keyframes") and tete.split()[-1] in kf:
        blocs.append("%s{%s}" % (tete, corps))

# En-tête conservé tel quel : commentaire + pont de variables vers les tokens du monorepo.
ENTETE = ""
if os.path.exists(OUT):
    txt = open(OUT, encoding="utf-8").read()
    m = re.search(r"^\.doctrine-demo :is\(", txt, re.M)
    ENTETE = txt[: m.start()] if m else txt
open(OUT, "w", encoding="utf-8").write(ENTETE + "\n".join(blocs) + "\n")
print(len(blocs), "règles portées →", OUT)
