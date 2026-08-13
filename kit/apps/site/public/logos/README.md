# public/logos/

Les logos des sources citées, **servis depuis notre domaine**. Jamais de `<img src>` pointant
chez leur propriétaire : ce serait transmettre l'adresse IP de chaque visiteur à trente-quatre
tiers, exactement le défaut que nos audits signalent chez nos clients.

## Comment en ajouter un

1. Récupérer le fichier officiel sur la page « brand » ou « press kit » de l'organisation.
2. Le renommer **exactement** comme la colonne « fichier attendu » ci-dessous.
3. Le déposer ici. La page le prend en compte au prochain rendu — rien d'autre à modifier.

Sans fichier, la carte affiche un monogramme. Aucune erreur, aucune case vide : la page
fonctionne à n'importe quel taux de remplissage.

## Format

SVG de préférence, PNG accepté en renommant l'extension dans `tools/compile-sources.py`.
Fond transparent, cadrage serré sur la marque, ~64 px de haut minimum. Le rendu est en
40 × 40 avec `object-contain` : un logo très horizontal (GOV.UK, Atlassian) apparaîtra petit,
préférer alors la version compacte ou le symbole seul quand la marque en propose un.

## Ce qu'il faut savoir avant de les afficher

Ces marques appartiennent à leurs détenteurs. Les reproduire pour citer une source relève de
l'usage nominatif, mais **plusieurs organisations restreignent explicitement l'usage de leur
logo**, en particulier les administrations. Trois précautions :

- La page porte déjà la mention « ni partenariat, ni approbation, ni affiliation ». Ne pas la retirer.
- Ne pas réutiliser ces logos ailleurs — plaquette, page d'accueil, proposition commerciale.
  Sur une page de sources, le contexte de citation est clair ; sur une page de vente, il ne l'est plus.
- Vérifier la licence pour : **GOV.UK** (le logo de la Couronne est protégé et son usage restreint),
  **Apple**, **CNIL**, **DSFR** et **USWDS**. En cas de doute, laisser le monogramme — il est
  parfaitement lisible et ne pose aucune question.

## Fichiers attendus

| Organisation | Fichier attendu | Où trouver l'officiel |
|---|---|---|
| W3C — WAI, WCAG, ARIA | `w3c.svg` | w3.org, section Logos and Usage Policy |
| WHATWG — HTML Living Standard | `whatwg.svg` | whatwg.org |
| NIST | `nist.svg` | nist.gov, brand guidelines |
| IETF | `ietf.svg` | ietf.org, trademark policy |
| CNIL | `cnil.svg` | cnil.fr — **usage restreint, vérifier** |
| CEPD (EDPB) | `cepd-edpb.svg` | edpb.europa.eu |
| MDN Web Docs | `mdn-web-docs.svg` | developer.mozilla.org, Mozilla brand toolkit |
| web.dev — Google | `webdev.svg` | web.dev |
| Apple — Human Interface Guidelines | `apple.svg` | **usage très restreint, monogramme conseillé** |
| Android — Google | `android.svg` | developer.android.com, brand guidelines |
| Microsoft Learn | `microsoft-learn.svg` | microsoft.com, brand |
| OWASP | `owasp.svg` | owasp.org |
| GOV.UK Design System | `govuk-design-system.svg` | **logo de la Couronne protégé, vérifier** |
| DSFR — Système de design de l'État | `dsfr.svg` | systeme-de-design.gouv.fr — **usage encadré** |
| U.S. Web Design System | `us-web-design-system.svg` | designsystem.digital.gov |
| ONS Design System | `ons-design-system.svg` | service-manual.ons.gov.uk |
| CMS Design System | `cms-design-system.svg` | design.cms.gov |
| Scottish Government Design System | `scottish-government-design-system.svg` | designsystem.gov.scot |
| GNOME — Human Interface Guidelines | `gnome.svg` | gnome.org, brand |
| Carbon — IBM | `carbon.svg` | carbondesignsystem.com |
| Polaris — Shopify | `polaris.svg` | polaris-react.shopify.com |
| Atlassian Design System | `atlassian-design-system.svg` | atlassian.design |
| Material Design — Google | `material-design.svg` | m3.material.io |
| Fluent — Microsoft | `fluent.svg` | fluent2.microsoft.design |
| Spectrum — Adobe | `spectrum.svg` | spectrum.adobe.com |
| Primer — GitHub | `primer.svg` | primer.style |
| Pajamas — GitLab | `pajamas.svg` | design.gitlab.com |
| Radix UI | `radix-ui.svg` | radix-ui.com |
| Nielsen Norman Group | `nielsen-norman-group.svg` | nngroup.com |
| Baymard Institute | `baymard-institute.svg` | baymard.com |
| Interaction Design Foundation | `interaction-design-foundation.svg` | interaction-design.org |
| Publications scientifiques | `publications-scientifiques.svg` | *(collectif — laisser le monogramme)* |
| Presse et praticiens spécialisés | `presse-et-praticiens-specialises.svg` | *(collectif — laisser le monogramme)* |
| Veille juridique | `veille-juridique.svg` | *(collectif — laisser le monogramme)* |

Les trois dernières entrées regroupent plusieurs organisations : elles n'ont pas de logo et
gardent leur monogramme.
