# -*- coding: utf-8 -*-
"""Extrait un sujet du site DS-MD généré (public/sujets/<slug>.html) en JSON structuré.
Le chrome (onglets, cartes, modales, accordéons) sera reconstruit avec les composants Fili ;
seules les illustrations (SVG) et les spécimens générés restent du balisage tel quel."""
import re, json, html, sys, os

def txt(s):
    s = re.sub(r'<svg.*?</svg>', '', s, flags=re.S)
    s = re.sub(r'<[^>]+>', '', s)
    return html.unescape(re.sub(r'\s+', ' ', s)).strip()

def inner(s):
    """HTML interne conservé (gras, code, liens internes retirés)."""
    s = re.sub(r'<a\b[^>]*>(.*?)</a>', r'\1', s, flags=re.S)
    s = re.sub(r'<span class="nom-sujet">(.*?)</span>', r'\1', s, flags=re.S)
    return re.sub(r'\s+', ' ', s).strip()

def un(m, i=1, d=""):
    return m.group(i) if m else d

def bloc(h, pat, flags=re.S):
    return [m.group(0) for m in re.finditer(pat, h, flags)]

def panneau(h, pid):
    d = re.search(r'<section class="panneau[^"]*" id="%s"[^>]*>' % pid, h)
    if not d:
        return ""
    reste = h[d.end():]
    f = re.search(r'<section class="panneau|</main>|<footer', reste)
    return reste[: f.start()] if f else reste


def portee_css(css: str, prefixe: str = ".doctrine-demo") -> str:
    """Préfixe chaque sélecteur par `.doctrine-demo :is(...)`. Les @keyframes restent intacts,
    les @media voient leurs sélecteurs internes préfixés."""
    css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
    out, i, n = [], 0, len(css)
    while i < n:
        j = css.find("{", i)
        if j < 0:
            break
        tete = css[i:j].strip()
        # bloc équilibré
        prof, k = 0, j
        while k < n:
            if css[k] == "{":
                prof += 1
            elif css[k] == "}":
                prof -= 1
                if prof == 0:
                    break
            k += 1
        corps = css[j + 1 : k]
        if tete.startswith("@keyframes") or tete.startswith("@font-face"):
            out.append(f"{tete}{{{corps}}}")
        elif tete.startswith("@"):
            out.append(f"{tete}{{{portee_css(corps, prefixe)}}}")
        elif tete:
            sel = ", ".join(f"{prefixe} :is({p.strip()})" for p in tete.split(",") if p.strip())
            out.append(f"{sel}{{{corps.strip()}}}")
        i = k + 1
    return re.sub(r"\s+", " ", "".join(out)).strip()

def extrait(path):
    h = open(path, encoding="utf-8").read()
    slug = os.path.basename(path)[:-5]
    d = {"slug": slug}

    # ── en-tête ──────────────────────────────────────────────────────────
    tete = un(re.search(r'<h1 class="titre-sujet">(.*?)</h1>', h, re.S))
    d["embleme"] = un(re.search(r'<svg.*?</svg>', tete, re.S), 0)
    d["nom"] = txt(un(re.search(r'</span><span>(.*?)</span>', tete, re.S)))
    d["nature"] = txt(un(re.search(r'badge-nature">(.*?)</span>', tete, re.S)))
    meta = un(re.search(r'<p class="meta-sujet">(.*?)</p>', h, re.S))
    d["meta"] = txt(meta)
    d["confiance"] = txt(un(re.search(r'<span class="badge conf-\d">(.*?)</span>', meta, re.S)))
    d["onglets"] = [{"id": i, "label": txt(l)} for i, l in re.findall(r'role="tab" id="tab-([^"]+)"[^>]*>(.*?)</a>', h, re.S)]

    # ── volet « L'essentiel » ────────────────────────────────────────────
    e = panneau(h, "essentiel")
    d["essentiel"] = {
        "kicker": txt(un(re.search(r'<span class="kicker">(.*?)</span>', e, re.S))),
        "question": txt(un(re.search(r'<div class="question-ux">(.*?)</div>', e, re.S))),
        "detail": txt(un(re.search(r'<p class="question-detail">(.*?)</p>', e, re.S))),
        "titreRegles": txt(un(re.search(r'<h2 class="titre-essentiel">(.*?)</h2>', e, re.S))),
        "regles": [
            {"num": txt(un(re.search(r'<span class="pourquoi-num">(.*?)</span>', b, re.S))),
             "texte": txt(un(re.search(r'<h3[^>]*>(.*?)</h3>', b, re.S)))}
            for b in bloc(e, r'<article class="pourquoi-promesse">.*?</article>')
        ],
        "preuves": [
            {"valeur": txt(un(re.search(r'<b>(.*?)</b>', b, re.S))),
             "libelle": txt(un(re.search(r'<span>(.*?)</span>', b, re.S)))}
            for b in bloc(e, r'<div class="preuve">.*?</div>')
        ],
    }
    # contribution IA : le RULES compilé
    ru = re.search(r'<pre class="contribution-source">(.*?)</pre>', e, re.S)
    d["essentiel"]["rules"] = {
        "nom": txt(un(re.search(r'<b>(RULES-[^<]+)</b>', e))),
        "source": html.unescape(un(ru)) if ru else "",
    }

    # ── volet « Cas d'usage » ────────────────────────────────────────────
    c = panneau(h, "cas")
    templates = {i: t for i, t in re.findall(r'<template id="([^"]+)">(.*?)</template>', h, re.S)}
    familles = []
    for f in bloc(c, r'<section class="famille-cas">.*?</section>'):
        cas = []
        for carte in bloc(f, r'<button type="button" class="cas-carte"[^>]*>.*?</button>'):
            tpl = un(re.search(r'data-tpl="([^"]+)"', carte))
            t = templates.get(tpl, "")
            blocs = {txt(k): inner(v) for k, v in re.findall(r'<div class="modale-bloc">\s*<h4>(.*?)</h4>\s*(.*?)</div>', t, re.S)}
            cas.append({
                "id": tpl,
                "titre": txt(un(re.search(r'<strong>(.*?)</strong>', carte, re.S))),
                "quand": txt(re.sub(r'<span class="cas-eyebrow">.*?</span>', '', un(re.search(r'<p class="cas-decision">(.*?)</p>', carte, re.S)), flags=re.S)),
                "statut": txt(un(re.search(r'<span class="cas-chip[^"]*">(.*?)</span>', carte, re.S))) or None,
                "lien": txt(un(re.search(r'<span class="cas-lien">(.*?)</span>', carte, re.S))),
                "kicker": txt(un(re.search(r'<span class="kicker">(.*?)</span>', t, re.S))),
                "visuel": un(re.search(r'<div class="modale-illus">\s*(<svg.*?</svg>)', t, re.S)),
                "blocs": [{"titre": k, "html": v} for k, v in blocs.items()],
                "sourceRegles": txt(un(re.search(r'<small class="modale-source">(.*?)</small>', t, re.S))),
                "regles": [
                    {"tag": txt(un(re.search(r'<span class="regle-tag">(.*?)</span>', r_, re.S))),
                     "html": inner(un(re.search(r'</span>\s*<p>(.*?)</p>', r_, re.S)))}
                    for r_ in bloc(t, r'<div class="regle">.*?</div>\s*(?=<div class="regle">|</div>)')
                ],
            })
        familles.append({
            "kicker": txt(un(re.search(r'<span class="kicker">(.*?)</span>', f, re.S))),
            "titre": txt(un(re.search(r'<h3>(.*?)</h3>', f, re.S))),
            "visuel": un(re.search(r'<div class="visuel-famille">\s*(<svg.*?</svg>)', f, re.S)),
            "cas": cas,
        })
    d["cas"] = familles
    chap_cas = un(re.search(r'<header class="chapeau">(.*?)</header>', c, re.S))
    d["casChapeau"] = {
        "kicker": txt(un(re.search(r'<span class="kicker">(.*?)</span>', chap_cas, re.S))),
        "titre": txt(un(re.search(r'<h2>(.*?)</h2>', chap_cas, re.S))),
        "lead": txt(un(re.search(r'<p class="lead">(.*?)</p>', chap_cas, re.S))),
    }

    # ── volet « Spécifications » ─────────────────────────────────────────
    u = panneau(h, "ui")
    chap = un(re.search(r'<header class="chapeau">(.*?)</header>', u, re.S))
    # Démos générées (matrices, spécimens, échantillons) : conservées telles quelles — ce sont
    # des preuves visuelles, au même titre que les SVG. Le chrome autour vient des composants DS.
    demo = re.sub(r'<header class="chapeau">.*?</header>', '', u, flags=re.S)
    demo = re.sub(r'<details\b.*?</details>', '', demo, flags=re.S)
    demo = re.sub(r'<script\b.*?</script>', '', demo, flags=re.S)
    demo = re.sub(r'\s+', ' ', demo).strip()
    specimens = [demo] if len(txt(demo)) or "<svg" in demo or "spec-" in demo or "bmx" in demo else []
    tokens = []
    tbl = re.search(r'<summary><span>Tokens résolus.*?</summary>\s*<div class="accordeon-corps">\s*<table>(.*?)</table>', u, re.S)
    if tbl:
        for tr in bloc(tbl.group(1), r'<tr>.*?</tr>'):
            cells = re.findall(r'<t[dh]>(.*?)</t[dh]>', tr, re.S)
            if len(cells) == 3 and "<th>" not in tr:
                tokens.append({
                    "token": txt(cells[0]), "ref": txt(cells[1]), "valeur": txt(cells[2]),
                    "couleur": un(re.search(r'background:\s*([^;"]+)', cells[2])) or None,
                })
    # CSS de page (spécimens propres au sujet), re-porté sous .doctrine-demo
    feuille = " ".join(portee_css(st) for st in re.findall(r'<style>(.*?)</style>', h, re.S))
    d["specs"] = {
        "css": feuille,
        "kicker": txt(un(re.search(r'<span class="kicker">(.*?)</span>', chap, re.S))),
        "titre": txt(un(re.search(r'<h2>(.*?)</h2>', chap, re.S))),
        "lead": txt(un(re.search(r'<p class="lead">(.*?)</p>', chap, re.S))),
        "specimens": specimens,
        "tokens": tokens,
    }

    # ── volet « Évolution » ──────────────────────────────────────────────
    v = panneau(h, "decisions")
    d["evolution"] = [
        {"date": txt(un(re.search(r'<span class="date">(.*?)</span>', b, re.S))),
         "titre": txt(un(re.search(r'<h3[^>]*>(.*?)</h3>', b, re.S))),
         "html": inner(re.sub(r'^<article class="decision">|</article>$|<span class="date">.*?</span>|<h3[^>]*>.*?</h3>', '', b.strip(), flags=re.S))}
        for b in bloc(v, r'<article class="decision">.*?</article>')
    ]
    if not d["evolution"]:
        d["evolution"] = [
            {"date": txt(un(re.search(r'<span class="date">(.*?)</span>', b, re.S))),
             "titre": txt(un(re.search(r'<h[34][^>]*>(.*?)</h[34]>', b, re.S))),
             "html": inner(re.sub(r'^<div class="decision">|</div>$|<span class="date">.*?</span>|<h[34][^>]*>.*?</h[34]>', '', b.strip(), flags=re.S))}
            for b in bloc(v, r'<div class="decision">.*?</div>\s*(?=<div class="decision">|</section>|$)')
        ]
    return d

if __name__ == "__main__":
    src, dst = sys.argv[1], sys.argv[2]
    d = extrait(src)
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    json.dump(d, open(dst, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    nc = sum(len(f["cas"]) for f in d["cas"])
    print(f'{d["slug"]:18} {d["nature"]:10} familles={len(d["cas"]):2} cas={nc:3} règles={len(d["essentiel"]["regles"])} preuves={len(d["essentiel"]["preuves"])} tokens={len(d["specs"]["tokens"]):2} spécimens={len(d["specs"]["specimens"])} évol={len(d["evolution"]):2} rules={len(d["essentiel"]["rules"]["source"])>0}')
