/**
 * Verrou de défilement du fond (OVERLAY-UX « un superposé modal verrouille le défilement »).
 *
 * Dans un shell applicatif, le DOCUMENT ne défile pas : c'est une RÉGION (le <main> de
 * l'AppLayout) qui porte `overflow-y: auto`. Verrouiller `document.body` seul ne verrouille
 * donc rien — le fond continue de défiler sous la surface, et le retour du focus au
 * déclencheur, à la fermeture, ramène brutalement la page ailleurs. On verrouille le body ET
 * chaque ancêtre défilant du déclencheur.
 *
 * Safari iOS : `overflow: hidden` sur le body n'arrête PAS le geste tactile — le document
 * défile quand même, et le rubber-band déplace visuellement jusqu'aux éléments `fixed`
 * (le superposé « descend » avec le doigt). Le seul verrou fiable est de figer le body en
 * `position: fixed` à sa position courante, puis de restaurer le scroll au déverrouillage.
 * Les régions défilantes internes gardent leur `overflow: hidden` classique.
 */
function ancetresDefilants(depart: HTMLElement | null): HTMLElement[] {
  const out: HTMLElement[] = [];
  let el = depart?.parentElement ?? null;
  while (el && el !== document.body) {
    const st = getComputedStyle(el);
    if (/(auto|scroll|overlay)/.test(st.overflowY) && el.scrollHeight > el.clientHeight) out.push(el);
    el = el.parentElement;
  }
  return out;
}

/** Verrouille le défilement ; rend la fonction qui restaure l'état d'origine. */
export function verrouilleDefilement(depuis?: HTMLElement | null): () => void {
  if (typeof document === "undefined") return () => {};
  const body = document.body;
  const ancetres = ancetresDefilants(depuis ?? null);
  const scrollY = window.scrollY;

  const ancienBody = {
    position: body.style.position,
    top: body.style.top,
    left: body.style.left,
    right: body.style.right,
    width: body.style.width,
    overflow: body.style.overflow,
  };
  // Technique de référence iOS : le body figé à sa position de scroll courante.
  body.style.position = "fixed";
  body.style.top = `-${scrollY}px`;
  body.style.left = "0";
  body.style.right = "0";
  body.style.width = "100%";
  body.style.overflow = "hidden";

  const anciensAncetres = ancetres.map((c) => c.style.overflow);
  ancetres.forEach((c) => {
    c.style.overflow = "hidden";
  });

  return () => {
    body.style.position = ancienBody.position;
    body.style.top = ancienBody.top;
    body.style.left = ancienBody.left;
    body.style.right = ancienBody.right;
    body.style.width = ancienBody.width;
    body.style.overflow = ancienBody.overflow;
    ancetres.forEach((c, i) => {
      c.style.overflow = anciensAncetres[i];
    });
    // Restaurer la position que le passage en `fixed` a remise à zéro.
    window.scrollTo(0, scrollY);
  };
}
