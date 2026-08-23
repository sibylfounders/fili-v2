#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Compile la page « Sources » de la méthode, à partir des citations réelles du corpus.

Les descriptions sont éditoriales — elles disent pourquoi cette source a le droit d'être
citée chez nous. Les chiffres, eux, sont mesurés : nombre de règles qui la citent, nombre
de sujets concernés. Une source dont personne ne se sert n'a rien à faire sur cette page,
et une source très citée qu'on ne saurait pas justifier est un problème.

Sortie : apps/site/content/doctrine/sources.json
Usage  : python3 tools/compile-sources.py
"""
import json, os, re, glob
from collections import Counter, defaultdict

ICI = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCTRINE = os.path.join(ICI, "apps/site/content/doctrine")

# organisation -> hôtes qui lui appartiennent, famille, url, description éditoriale
REGISTRE = [
    # ── Normes et spécifications ────────────────────────────────────────────
    ("W3C — WAI, WCAG, ARIA", ["w3.org", "drafts.csswg.org"], "Normes et spécifications",
     "https://www.w3.org/WAI/",
     "L'autorité normative du corpus. Quand une règle est déclarée « loi », c'est le plus souvent ici "
     "qu'elle est adossée : critères WCAG avec leur niveau, motifs ARIA, spécifications CSS. "
     "Une exigence d'accessibilité qui ne s'y rattache pas n'est pas opposable."),
    ("WHATWG — HTML Living Standard", ["html.spec.whatwg.org"], "Normes et spécifications",
     "https://html.spec.whatwg.org/",
     "La spécification du langage lui-même. Elle tranche ce qu'un élément natif garantit déjà — "
     "et donc ce qu'un composant maison perd s'il le remplace. C'est l'argument le plus solide "
     "contre la réimplémentation gratuite."),
    ("IETF", ["datatracker.ietf.org"], "Normes et spécifications",
     "https://www.ietf.org/",
     "Consultée pour le principe de robustesse, et surtout pour sa révision : la RFC 9413 (2023) "
     "retourne un principe que le corpus citait dans sa version de 1980. Une norme peut être révoquée, "
     "et il faut le voir."),
    ("NIST", ["pages.nist.gov"], "Normes et spécifications",
     "https://pages.nist.gov/800-63-3/",
     "Référentiel d'authentification. Cité pour les règles de mot de passe du parcours de création "
     "de compte, là où l'usage courant est très en retard sur la recommandation."),

    # ── Régulateurs ─────────────────────────────────────────────────────────
    ("CNIL", ["cnil.fr"], "Régulateurs",
     "https://www.cnil.fr/",
     "Régulateur français des données personnelles. Cité pour les catégories de traceurs exemptées "
     "de consentement et pour la symétrie exigée entre accepter et refuser. Toujours pour le fait, "
     "jamais pour qualifier juridiquement un cas particulier — nous ne sommes pas juristes."),
    ("CEPD (EDPB)", ["edpb.europa.eu"], "Régulateurs",
     "https://www.edpb.europa.eu/",
     "Comité européen de la protection des données. Ses six catégories de conception trompeuse "
     "— surcharge, esquive, manipulation, obstruction, incohérence, opacité — donnent un vocabulaire "
     "précis à ce qu'on appelle vaguement « dark pattern »."),

    # ── Plateformes ─────────────────────────────────────────────────────────
    ("MDN Web Docs", ["developer.mozilla.org"], "Plateformes",
     "https://developer.mozilla.org/",
     "La référence de comportement réel des navigateurs. C'est elle qui tranche les questions que "
     "personne ne pense à poser : ce que le mode de couleurs forcées supprime, ce que `:visited` "
     "peut encore styler, ce qu'une ombre coûte à peindre."),
    ("web.dev — Google", ["web.dev", "developers.google.com"], "Plateformes",
     "https://web.dev/",
     "Métriques de performance perçue et seuils associés. Le corpus lui doit la mesure des décalages "
     "de mise en page, et son exclusion des décalages consécutifs à une action — la distinction exacte "
     "que nos règles posaient à la main."),
    ("Apple — Human Interface Guidelines", ["developer.apple.com"], "Plateformes",
     "https://developer.apple.com/design/human-interface-guidelines/",
     "Consultée pour les cibles tactiles et les zones réservées aux gestes système. Une plateforme "
     "qui possède le matériel fait autorité sur ce que le doigt peut atteindre."),
    ("Android — Google", ["developer.android.com"], "Plateformes",
     "https://developer.android.com/design",
     "Même rôle qu'Apple, et la convergence des deux est ce qui rend la règle universelle : quand "
     "les deux systèmes interdisent la même zone, ce n'est plus une convention."),
    ("Microsoft Learn", ["learn.microsoft.com", "design.learn.microsoft.com"], "Plateformes",
     "https://learn.microsoft.com/windows/apps/design/accessibility/high-contrast-themes",
     "Consultée pour le mode contraste élevé de Windows, que la plupart des systèmes ignorent alors "
     "qu'il supprime les fonds et les ombres — donc une partie de ce sur quoi une interface compte."),
    ("OWASP", ["cheatsheetseries.owasp.org"], "Plateformes",
     "https://cheatsheetseries.owasp.org/",
     "Consultée sur les messages d'erreur d'authentification, là où la règle de sécurité et la règle "
     "d'ergonomie se contredisent frontalement."),

    # ── Design systems publics ──────────────────────────────────────────────
    ("GOV.UK Design System", ["design-system.service.gov.uk", "gov.uk",
                              "guidance.publishing.service.gov.uk", "brand.design-system.service.gov.uk",
                              "components.publishing.service.gov.uk"], "Design systems publics",
     "https://design-system.service.gov.uk/",
     "Le système le plus rigoureux du panel, et le seul à documenter systématiquement le DOM, l'ordre "
     "de focus et le texte exact. Souvent le seul à écrire noir sur blanc ce que les autres laissent "
     "implicite — par exemple qu'un site n'utilisant que des cookies essentiels n'a pas besoin de bandeau."),
    ("DSFR — Système de design de l'État", ["systeme-de-design.gouv.fr"], "Design systems publics",
     "https://www.systeme-de-design.gouv.fr/",
     "Référence française, contrainte par le droit national. Consultée sur le gestionnaire de "
     "consentement, dont elle impose la granularité par finalité et l'accès permanent — là où GOV.UK "
     "pose d'abord la question de la nécessité."),
    ("U.S. Web Design System", ["designsystem.digital.gov"], "Design systems publics",
     "https://designsystem.digital.gov/",
     "Système fédéral américain. Utile comme troisième voix quand GOV.UK et le DSFR divergent, "
     "et particulièrement précis sur les seuils de bascule entre composants de saisie."),
    ("ONS Design System", ["service-manual.ons.gov.uk"], "Design systems publics",
     "https://service-manual.ons.gov.uk/design-system",
     "Office for National Statistics. Cité pour les liens de téléchargement, où il impose l'annonce "
     "du format et du poids — une convergence avec GOV.UK qui rend la règle opposable."),
    ("CMS Design System", ["design.cms.gov"], "Design systems publics",
     "https://design.cms.gov/",
     "Système de l'administration de santé américaine. Consulté sur les onglets, où il donne un des "
     "rares seuils chiffrés publiés."),
    ("Scottish Government Design System", ["designsystem.gov.scot", "design.sis.gov.uk"],
     "Design systems publics", "https://designsystem.gov.scot/",
     "Quatrième référence publique, utile pour vérifier qu'une convergence supposée n'est pas "
     "simplement la copie d'un même modèle britannique."),
    ("GNOME — Human Interface Guidelines", ["developer.gnome.org"], "Design systems publics",
     "https://developer.gnome.org/hig/",
     "Consulté sur la typographie d'interface et la ponctuation des libellés, où il est l'un des rares "
     "à énoncer des règles explicites plutôt que des exemples."),

    # ── Design systems produit ──────────────────────────────────────────────
    ("Carbon — IBM", ["carbondesignsystem.com"], "Design systems produit",
     "https://carbondesignsystem.com/",
     "Le plus documenté des systèmes produit, et le plus souvent en désaccord avec les autres — ce qui "
     "en fait un excellent contradicteur. C'est le seul du panel à ne poser aucune échelle d'ombre, "
     "et cette dissidence est plus instructive qu'un accord de plus."),
    ("Polaris — Shopify", ["polaris-react.shopify.com", "polaris.shopify.com"], "Design systems produit",
     "https://polaris-react.shopify.com/",
     "Cité pour ses tokens publiés et pour la précision de ses consignes de contenu. Réserve connue : "
     "plusieurs de ses pages ont migré ou sont marquées dépréciées, et une citation ancienne peut "
     "pointer une page qui n'existe plus."),
    ("Atlassian Design System", ["atlassian.design"], "Design systems produit",
     "https://atlassian.design/",
     "Longtemps la source la plus citée du corpus, ce qui était un défaut en soi — un contradicteur "
     "aurait pu répondre « autant lire Atlassian directement ». Son poids a été volontairement réduit "
     "au profit des sources normatives."),
    ("Material Design — Google", ["m3.material.io", "m2.material.io", "m1.material.io",
                                  "materialstyle.github.io", "mui.com"], "Design systems produit",
     "https://m3.material.io/",
     "Le plus influent, et le plus difficile à citer : ses pages récentes sont rendues en JavaScript "
     "et illisibles en texte. Quand une affirmation ne peut être vérifiée que sur son dépôt de tokens, "
     "le corpus le dit plutôt que de faire semblant."),
    ("Fluent — Microsoft", ["fluent2.microsoft.design"], "Design systems produit",
     "https://fluent2.microsoft.design/",
     "Consulté pour les rampes d'élévation et de rayon, où il publie des valeurs exploitables. "
     "Même réserve de lisibilité que Material sur une partie du site."),
    ("Spectrum — Adobe", ["react-aria.adobe.com"], "Design systems produit",
     "https://spectrum.adobe.com/",
     "Cité surtout via React Aria, dont les comportements clavier sont documentés avec une précision "
     "que peu de systèmes atteignent."),
    ("Primer — GitHub", ["primer.style"], "Design systems produit",
     "https://primer.style/",
     "Consulté sur les états de champ et le focus. Sa documentation étant largement en JavaScript, "
     "les vérifications se font sur ses feuilles de style publiées."),
    ("Pajamas — GitLab", ["design.gitlab.com"], "Design systems produit",
     "https://design.gitlab.com/",
     "Cité pour la confirmation destructive, dont il donne la formulation la plus explicite trouvée : "
     "nommer l'objet supprimé plutôt que demander « êtes-vous sûr ? »."),
    ("Radix UI", ["radix-ui.com"], "Design systems produit",
     "https://www.radix-ui.com/",
     "Bibliothèque de primitives accessibles. Consultée pour les comportements que les systèmes "
     "documentent rarement : pause d'un message temporaire, chemin clavier vers une région flottante."),

    # ── Recherche et analyse ────────────────────────────────────────────────
    ("Nielsen Norman Group", ["nngroup.com", "jnd.org"], "Recherche et analyse",
     "https://www.nngroup.com/",
     "Recherche appliquée en ergonomie. Source précieuse et à manier avec méthode : c'est une autorité "
     "de recherche, pas une norme. Une règle appuyée sur NN/g seul reste un parti pris éclairé, "
     "pas une loi opposable."),
    ("Baymard Institute", ["baymard.com"], "Recherche et analyse",
     "https://baymard.com/",
     "Études quantitatives sur les parcours d'achat. Citée quand une règle a besoin d'un ordre de "
     "grandeur mesuré plutôt que d'un raisonnement de mécanisme."),
    ("Interaction Design Foundation", ["interaction-design.org"], "Recherche et analyse",
     "https://www.interaction-design.org/",
     "Consultée pour les principes de Gestalt, dont elle donne l'exposé le plus stable et le plus "
     "citable — le regroupement perçu est l'un des rares fondements théoriques directement applicables."),
    ("Publications scientifiques", ["dl.acm.org", "journals.sagepub.com", "academic.oup.com",
                                    "link.springer.com", "nature.com", "jov.arvojournals.org",
                                    "pubmed.ncbi.nlm.nih.gov", "psychclassics.yorku.ca",
                                    "labs.la.utexas.edu", "philpapers.org", "memory.psych.missouri.edu",
                                    "psychologysorted.blog", "mrbartonmaths.com",
                                    "perso.telecom-paristech.fr", "computerhistory.org"],
     "Recherche et analyse", "https://dl.acm.org/",
     "Les articles d'origine des lois UX — Fitts, Hick, Miller, Cowan, Glanzer & Cunitz, Kivetz, "
     "et les méta-analyses qui en réfutent certaines. C'est la couche qui a le plus corrigé le corpus : "
     "plusieurs lois s'y sont révélées mal citées, et une ne réplique pas du tout."),
    ("Presse et praticiens spécialisés", ["smashingmagazine.com", "css-tricks.com", "adrianroselli.com",
                                          "24a11y.com", "practicaltypography.com", "webtypography.net",
                                          "livefront.com", "spec.fm", "uxmatters.com", "master.dev",
                                          "soliantconsulting.com", "deceptive.design", "lawsofux.com",
                                          "styleguide.mailchimp.com", "jlelliotton.blogspot.com"],
     "Recherche et analyse", "https://www.smashingmagazine.com/",
     "Sources secondaires, citées quand aucune primaire n'existe et signalées comme telles. "
     "Elles ne fondent jamais une règle universelle à elles seules — leur présence dans une "
     "bibliographie est un signal de fragilité assumé."),
    ("Veille juridique", ["osborneclarke.com", "taylorwessing.com"], "Recherche et analyse",
     "https://www.osborneclarke.com/",
     "Cabinets consultés uniquement pour suivre l'état d'avancement de textes en cours — la réforme "
     "européenne des règles de consentement, notamment. Cités pour dater une évolution, jamais pour "
     "donner un avis de droit."),
]

FAMILLES = ["Normes et spécifications", "Régulateurs", "Plateformes",
            "Design systems publics", "Design systems produit", "Recherche et analyse"]


def slug_logo(nom):
    """Nom de fichier attendu dans `public/logos/` — la page retombe sur le monogramme s'il manque."""
    import unicodedata
    n = nom.split("—")[0].strip()
    n = unicodedata.normalize("NFKD", n).encode("ascii", "ignore").decode()
    n = re.sub(r"[^\w\s-]", "", n).strip().lower()
    return re.sub(r"[\s_]+", "-", n) + ".svg"


def monogramme(nom):
    """Deux lettres tirées du nom — aucune image tierce n'est chargée (cf. note de la page)."""
    mots = re.sub(r"[^\w\s—-]", " ", nom).replace("—", " ").split()
    if not mots:
        return "??"
    if len(mots) == 1:
        return mots[0][:2].upper()
    return (mots[0][0] + mots[1][0]).upper()


def main():
    cit = Counter()
    suj = defaultdict(set)
    for p in glob.glob(os.path.join(DOCTRINE, "*.json")):
        d = json.load(open(p, encoding="utf-8"))
        for r in d.get("decisions", []):
            for s in r.get("sources", []):
                for l in s.get("liens", []):
                    u = l.get("url")
                    if not u:
                        continue
                    h = re.sub(r"^https?://(www\.)?", "", u).split("/")[0]
                    cit[h] += 1
                    suj[h].add(d["slug"])

    connus, entrees = set(), []
    for nom, hotes, famille, url, desc in REGISTRE:
        connus |= set(hotes)
        n = sum(cit[h] for h in hotes)
        s = set().union(*(suj[h] for h in hotes)) if hotes else set()
        entrees.append({"nom": nom, "famille": famille, "url": url, "description": desc,
                        "monogramme": monogramme(nom), "logo": slug_logo(nom),
                        "citations": n, "sujets": len(s),
                        "hotes": hotes})

    entrees.sort(key=lambda e: (FAMILLES.index(e["famille"]), -e["citations"]))
    orphelins = sorted(h for h in cit if h not in connus)

    doc = {
        "titre": "Sources",
        "lead": "Toutes les références citées par le corpus, avec le nombre de règles qui s'y adossent. "
                "Les chiffres sont mesurés sur les fichiers eux-mêmes : une source qui n'apparaît nulle "
                "part ne figure pas ici, et une source très citée que nous ne saurions pas justifier "
                "serait un problème.",
        "total_citations": sum(cit.values()),
        "total_hotes": len(cit),
        "familles": FAMILLES,
        "entrees": entrees,
        "orphelins": orphelins,
    }
    chemin = os.path.join(DOCTRINE, "sources.json")
    json.dump(doc, open(chemin, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"doctrine/sources.json — {len(entrees)} organisations, "
          f"{sum(cit.values())} citations, {len(cit)} hôtes distincts")
    couvert = sum(e["citations"] for e in entrees)
    print(f"  couverture : {couvert}/{sum(cit.values())} citations rattachées "
          f"({round(100 * couvert / max(sum(cit.values()), 1))} %)")
    if orphelins:
        print("  hôtes non rattachés :", ", ".join(orphelins))


if __name__ == "__main__":
    main()
