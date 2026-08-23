#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Récupère les logos des sources et les range dans apps/site/public/logos/.

À lancer **depuis ta machine** : la session Cowork n'a pas d'accès réseau, ni côté conteneur
ni côté pont. C'est pour ça que ce script existe plutôt qu'un dossier déjà rempli.

    cd "/Users/aureliennougier/Claude/Projects/Fili"
    python3 tools/recupere-logos.py

Source utilisée : Simple Icons (CC0, domaine public), qui publie les marques sous forme de
glyphes monochromes normalisés. Deux avantages sur une collecte manuelle : la licence est
claire, et les 20 logos ont le même traitement graphique — une page de sources dont chaque
logo a son propre style, ses propres marges et sa propre densité est laide, quoi qu'on fasse.

Le script ne devine rien : il tente, il vérifie que la réponse est bien un SVG, et il dit ce
qui a échoué. Ce qui manque garde son monogramme, ce qui est déjà présent n'est pas écrasé.
"""
import os
import sys
import urllib.request
import urllib.error

ICI = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEST = os.path.join(ICI, "apps/site/public/logos")

CDN = "https://cdn.simpleicons.org/{slug}"

# notre fichier attendu  ->  identifiant Simple Icons
# Seules les marques que Simple Icons publie figurent ici. Les autres (administrations,
# instituts de recherche) sont listées dans le README et restent en monogramme.
CORRESPONDANCE = {
    "w3c.svg": "w3c",
    "whatwg.svg": "whatwg",
    "mdn-web-docs.svg": "mdnwebdocs",
    "webdev.svg": "google",
    "android.svg": "android",
    "apple.svg": "apple",
    "microsoft-learn.svg": "microsoft",
    "owasp.svg": "owasp",
    "carbon.svg": "ibm",
    "polaris.svg": "shopify",
    "atlassian-design-system.svg": "atlassian",
    "material-design.svg": "materialdesign",
    "fluent.svg": "microsoft",
    "spectrum.svg": "adobe",
    "primer.svg": "github",
    "pajamas.svg": "gitlab",
    "radix-ui.svg": "radixui",
    "gnome.svg": "gnome",
    "nist.svg": "nist",
    "ietf.svg": "ietf",
}

# Marques dont l'usage est restreint : on ne les récupère pas automatiquement.
# Le monogramme reste le choix sûr tant que la licence n'a pas été vérifiée.
RESTREINTES = {
    "govuk-design-system.svg": "logo de la Couronne, usage protégé",
    "dsfr.svg": "marque de l'État, usage encadré",
    "cnil.svg": "usage soumis à autorisation",
    "us-web-design-system.svg": "usage fédéral encadré",
}


def recupere(nom, slug):
    chemin = os.path.join(DEST, nom)
    if os.path.exists(chemin):
        return "déjà là"
    url = CDN.format(slug=slug)
    req = urllib.request.Request(url, headers={"User-Agent": "fili/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            data = r.read()
    except urllib.error.HTTPError as e:
        return f"HTTP {e.code}"
    except Exception as e:
        return f"échec ({e.__class__.__name__})"
    if b"<svg" not in data[:400].lower():
        return "réponse non-SVG, ignorée"
    with open(chemin, "wb") as f:
        f.write(data)
    return f"{len(data)} octets"


def main():
    os.makedirs(DEST, exist_ok=True)
    ok = 0
    print(f"destination : {DEST}\n")
    for nom, slug in sorted(CORRESPONDANCE.items()):
        etat = recupere(nom, slug)
        marque = "ok " if ("octets" in etat or etat == "déjà là") else "   "
        if "octets" in etat or etat == "déjà là":
            ok += 1
        print(f"  {marque} {nom:34} {slug:16} {etat}")

    print(f"\n{ok}/{len(CORRESPONDANCE)} récupérés.")
    if RESTREINTES:
        print("\nNon récupérées volontairement — vérifier la licence avant de les poser à la main :")
        for nom, motif in RESTREINTES.items():
            print(f"  · {nom:34} {motif}")
    print("\nLes entrées sans fichier gardent leur monogramme : la page reste correcte.")
    print("Relance le serveur pour voir le résultat — c'est du contenu statique, "
          "un rechargement suffit normalement.")


if __name__ == "__main__":
    sys.exit(main())
