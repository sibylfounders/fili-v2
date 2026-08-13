import ReactMarkdown, { defaultUrlTransform } from "react-markdown";
import remarkGfm from "remark-gfm";
import { LienMarkdown } from "./lien-markdown";

/**
 * SOUS-ENSEMBLE volontairement strict des URI `tel:` pris en charge par Fili : préfixe
 * `tel:`, signe `+` facultatif, chiffres et séparateurs visuels simples (`-`, `.`, `(`, `)`).
 *
 * Ce n'est PAS la RFC 3966, et ce fichier ne prétend pas l'implémenter : les extensions
 * (`;ext=`), les paramètres, le `;phone-context=` des numéros locaux et les espaces n'en font
 * pas partie. Ils ne sont pas refusés par principe — ils ne sont pas encore pris en charge, et
 * une forme non reconnue retombe simplement sur `defaultUrlTransform`, donc se retrouve
 * neutralisée. Élargir ce sous-ensemble sera une décision, le jour où le corpus en aura besoin.
 */
const TEL_PRIS_EN_CHARGE = /^tel:\+?[0-9][0-9().\-]*$/i;

/**
 * Assainissement des adresses — l'allowlist de `react-markdown`, ÉTENDUE à `tel:`.
 *
 * `defaultUrlTransform` (API publique de la version installée) n'accepte que
 * `http(s)`, `irc(s)`, `mailto` et `xmpp` ; tout autre protocole voit son adresse remplacée
 * par une chaîne vide. `tel:` tombait donc dans ce trou : le numéro gardait la facture d'un
 * lien, perdait sa destination, et jusqu'au rôle accessible `link` — un lien qui ne mène
 * nulle part, ce que l'Interaction Language refuse (une navigation doit naviguer).
 *
 * On ne réécrit pas l'allowlist : on lui ajoute UN cas, reconnu par le sous-ensemble ci-dessus,
 * et tout le reste retombe sur le mécanisme standard. `javascript:`, `data:` et les protocoles
 * inconnus restent donc neutralisés exactement comme avant — y compris un `tel:` mal formé.
 */
const assainisAdresse = (url: string) => (TEL_PRIS_EN_CHARGE.test(url) ? url : defaultUrlTransform(url));

/**
 * Rendu markdown de la documentation — typographie sobre pilotée par les tokens (.doc-prose).
 * Les éléments INTERACTIFS générés depuis le Markdown consomment le kit comme le reste du
 * site : les liens passent par `Link` (@fili/react, facture inline + focus v2) via le
 * mapping `components` — plus aucun `<a>` natif stylé localement (2026-07-30).
 */
export function Markdown({ children, className = "doc-prose" }: { children: string; className?: string }) {
  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} urlTransform={assainisAdresse} components={{ a: LienMarkdown }}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
