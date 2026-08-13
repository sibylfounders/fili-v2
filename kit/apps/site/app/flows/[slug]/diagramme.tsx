"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Background,
  BackgroundVariant,
  MarkerType,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Edge,
  type Node,
} from "@xyflow/react";
import ELK from "elkjs/lib/elk.bundled.js";
import "@xyflow/react/dist/style.css";
import { Button, Card } from "@fili/react";
import type { Graphe, Moment } from "@/lib/flows";
import { typesDeNoeud, VERDICTS, L_MOMENT, L_BRANCHE, type Verdict } from "./noeuds";

const elk = new ELK();

/**
 * Dimensions données à elk. Les LARGEURS viennent de `noeuds.tsx`, qui les pose aussi sur
 * le DOM : un seul nombre, sinon elk place des cartes qui n'ont pas la taille annoncée et
 * les arêtes ratent leurs poignées sans que rien ne le dise. Les HAUTEURS restent ici :
 * elles n'existent que comme estimation pour le placement — le rendu réel est intrinsèque
 * au contenu de la Card, et personne ne les pose sur le DOM.
 */
const H_MOMENT = 190;
const H_BRANCHE = 168;

/** Bornes de zoom. Le plafond monte en plein écran : un grand écran doit être rempli. */
const ZOOM_MIN = 0.2;
const ZOOM_MAX = 1.6;
const ZOOM_MAX_PLEIN = 2.4;

/**
 * Le chemin du parcours, lu comme un QA : où faut-il intervenir avant de toucher une vue ?
 *
 * Tout vient de `content/flows/<slug>.json`, projeté depuis la fiche. Une sortie que la
 * fiche ne rattache pas reste visiblement détachée : le trou de doctrine est l'information,
 * pas un défaut d'affichage.
 */
export function Diagramme(props: {
  graphe: Graphe;
  momentActif: string | null;
  onMomentActif: (id: string | null) => void;
}) {
  // Le provider enveloppe la toile : `useReactFlow` (recadrage) n'existe qu'à l'intérieur.
  return (
    <ReactFlowProvider>
      <Toile {...props} />
    </ReactFlowProvider>
  );
}

function Toile({
  graphe,
  momentActif,
  onMomentActif,
}: {
  graphe: Graphe;
  momentActif: string | null;
  onMomentActif: (id: string | null) => void;
}) {
  const [noeuds, setNoeuds] = useState<Node[]>([]);
  const [aretes, setAretes] = useState<Edge[]>([]);
  const [pleinEcran, setPleinEcran] = useState(false);
  const cadre = useRef<HTMLDivElement>(null);
  const { fitView, zoomIn, zoomOut } = useReactFlow();

  const brut = useMemo(() => construis(graphe), [graphe]);

  /**
   * Un seul recadrage, appelé de partout : entrée/sortie de plein écran, redimensionnement,
   * fin de mise en page. En plein écran on serre la marge et on lève le plafond de zoom —
   * l'écran est là pour être rempli.
   */
  const recadre = useCallback(
    (plein: boolean) =>
      fitView({
        padding: plein ? 0.04 : 0.12,
        maxZoom: plein ? ZOOM_MAX_PLEIN : ZOOM_MAX,
        minZoom: ZOOM_MIN,
        duration: 260,
      }),
    [fitView],
  );

  useEffect(() => {
    let vivant = true;
    dispose(brut).then((n) => {
      if (!vivant) return;
      setNoeuds(n);
      setAretes(brut.aretes);
      // Après la mise en page : laisser React peindre, puis cadrer sur le contenu réel.
      requestAnimationFrame(() => recadre(Boolean(document.fullscreenElement)));
    });
    return () => {
      vivant = false;
    };
  }, [brut, recadre]);

  // Le moment sélectionné se voit sur le canevas sans relancer la mise en page.
  useEffect(() => {
    setNoeuds((ns) =>
      ns.map((n) =>
        n.type === "moment" ? { ...n, data: { ...n.data, actif: n.id === momentActif } } : n,
      ),
    );
  }, [momentActif]);

  useEffect(() => {
    const surChangement = () => {
      const plein = Boolean(document.fullscreenElement);
      setPleinEcran(plein);
      // La bascule ne redimensionne pas le cadre tout de suite : on cadre au prochain rendu.
      requestAnimationFrame(() => recadre(plein));
    };
    document.addEventListener("fullscreenchange", surChangement);
    return () => document.removeEventListener("fullscreenchange", surChangement);
  }, [recadre]);

  // Filet : certains navigateurs redimensionnent APRÈS `fullscreenchange`, et l'utilisateur
  // peut aussi redimensionner la fenêtre. On recadre sur la taille réelle du cadre.
  useEffect(() => {
    const cible = cadre.current;
    if (!cible || typeof ResizeObserver === "undefined") return;
    let attente: number;
    const obs = new ResizeObserver(() => {
      cancelAnimationFrame(attente);
      attente = requestAnimationFrame(() => recadre(Boolean(document.fullscreenElement)));
    });
    obs.observe(cible);
    return () => {
      cancelAnimationFrame(attente);
      obs.disconnect();
    };
  }, [recadre]);

  const basculePleinEcran = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void cadre.current?.requestFullscreen?.();
  }, []);

  /**
   * La SÉLECTION, pas le clic. `onNodeClick` est branché sur le `onClick` du DOM, et une
   * pression sur Entrée dans un `div[tabindex]` ne produit PAS de clic : la sélection d'un
   * moment était donc souris-seule, alors que React Flow rendait les nœuds tabulables. Lui
   * gère bien Entrée et Espace (`elementSelectionKeys`), mais il met à jour SA sélection,
   * que cette page n'écoutait pas — sept arrêts de tabulation qui ne faisaient rien.
   * En écoutant la sélection plutôt que le clic, les deux entrées passent par le même
   * chemin. (Constat de `verifie:rendu`, arbitrage Aurélien 2026-08-01.)
   */
  const surSelection = useCallback(
    ({ nodes: retenus }: { nodes: Node[] }) => {
      const n = retenus[0];
      onMomentActif(n && n.type === "moment" ? n.id : null);
    },
    [onMomentActif],
  );

  return (
    <div
      ref={cadre}
      className={`relative w-full overflow-hidden border border-border bg-background ${
        pleinEcran ? "h-screen rounded-none" : "h-[640px] rounded-lg"
      }`}
    >
      {/* Les commandes du canevas sont celles du KIT. `<Controls>` de React Flow apportait
          ses propres boutons avec son propre anneau de focus, hors des crans control.focus-* —
          trois contrôles du site qui ne se donnaient pas à voir comme les autres au clavier
          (arbitrage Aurélien 2026-08-01). Le zoom et le recadrage passent par `useReactFlow`,
          le rendu par Button : une seule famille de contrôles sur la page. */}
      <div className="absolute right-md top-md z-10 flex gap-sm">
        <Button size="sm" variant="stroke" tone="neutral" onClick={() => void zoomOut()}>
          Zoom arrière
        </Button>
        <Button size="sm" variant="stroke" tone="neutral" onClick={() => void zoomIn()}>
          Zoom avant
        </Button>
        <Button
          size="sm"
          variant="stroke"
          tone="neutral"
          onClick={() => void recadre(pleinEcran)}
          title="Réafficher tout le parcours dans le cadre"
        >
          Recadrer
        </Button>
        <Button
          size="sm"
          variant="stroke"
          tone="neutral"
          onClick={basculePleinEcran}
          aria-pressed={pleinEcran}
          title={pleinEcran ? "Quitter le plein écran (Échap)" : "Afficher en plein écran"}
        >
          {pleinEcran ? "Quitter le plein écran" : "Plein écran"}
        </Button>
      </div>

      <ReactFlow
        nodes={noeuds}
        edges={aretes}
        nodeTypes={typesDeNoeud}
        fitView
        fitViewOptions={{ padding: 0.12, maxZoom: ZOOM_MAX }}
        nodesDraggable={false}
        nodesConnectable={false}
        /* Une arête ne mène nulle part : la rendre tabulable ajoutait quatre arrêts qui
           n'accomplissaient rien. Les NŒUDS, eux, restent tabulables — ils sélectionnent
           un moment, et c'est la seule commande du diagramme. */
        edgesFocusable={false}
        onSelectionChange={surSelection}
        onPaneClick={() => onMomentActif(null)}
        minZoom={ZOOM_MIN}
        maxZoom={ZOOM_MAX_PLEIN}
        aria-label={`Chemin du parcours ${graphe.flow}`}
      >
        <Background variant={BackgroundVariant.Dots} gap={22} size={1} />
      </ReactFlow>

      <Legende />
    </div>
  );
}

/**
 * La légende — une Card, et pas un div qui lui ressemble.
 *
 * Bordure + rayon + espacement intérieur font une carte, en classes comme en style inline :
 * c'est la définition que `fili-check` applique (règle `carte-recreee`), et la légende la
 * remplissait à la main. Le kit répond à sa propre règle (arbitrage Aurélien, 2026-08-01).
 * Ne restent en `className` que ce que Card ne porte pas : le POSITIONNEMENT flottant au-dessus
 * du canevas et le fond translucide, qui laisse deviner le graphe sous la légende.
 */
function Legende() {
  return (
    <Card.Root
      mode="static"
      density="compact"
      className="absolute bottom-md left-md z-10 !bg-background/95"
    >
      <Card.Body>
        <p className="m-0 mb-1 font-label text-xs font-semibold uppercase tracking-wider text-text-muted">
          La couleur dit l’état de couverture
        </p>
        <ul className="m-0 flex list-none flex-wrap gap-md p-0">
          {(Object.keys(VERDICTS) as Verdict[]).map((v) => (
            <li key={v} className="flex items-center gap-1 text-xs text-text-secondary">
              <span
                aria-hidden="true"
                className={`inline-block h-3 w-3 rounded-sm border-2 ${VERDICTS[v].bordure} ${VERDICTS[v].fond}`}
              />
              {VERDICTS[v].libelle}
            </li>
          ))}
        </ul>
      </Card.Body>
    </Card.Root>
  );
}

/* ------------------------------------------------------------------ montage */

type Brut = { noeuds: Node[]; aretes: Edge[] };

const traitDuVerdict = (m: Moment) =>
  (VERDICTS[(m.verdict ?? "sans rattachement") as Verdict] ?? VERDICTS["sans rattachement"]).trait;

function construis(g: Graphe): Brut {
  const noeuds: Node[] = [];
  const aretes: Edge[] = [];

  // 1. Le chemin nominal : les moments, dans l'ordre de la fiche.
  const moments = [...g.moments].sort((a, b) => a.index - b.index);
  for (const m of moments) {
    noeuds.push({
      id: m.id,
      type: "moment",
      position: { x: 0, y: 0 },
      data: {
        index: m.index,
        titre: m.titre,
        texte: m.texte,
        conditionnel: m.conditionnel,
        verdict: m.verdict ?? "sans rattachement",
        interventions: m.interventions?.length ?? 0,
        cas: m.casRattaches?.length ?? 0,
        actif: false,
      },
    });
  }
  for (let i = 1; i < moments.length; i++) {
    const precedent = moments[i - 1];
    const courant = moments[i];
    aretes.push({
      id: `${precedent.id}--${courant.id}`,
      source: precedent.id,
      target: courant.id,
      label: courant.conditionnel ? "si nécessaire" : undefined,
      labelShowBg: true,
      labelBgPadding: [6, 3],
      labelBgBorderRadius: 4,
      labelStyle: { fontSize: 12, fill: "var(--text-secondary)" },
      labelBgStyle: { fill: "var(--background)", stroke: "var(--border)" },
      markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20, color: traitDuVerdict(courant) },
      style: {
        strokeWidth: 3,
        stroke: traitDuVerdict(courant),
        strokeDasharray: courant.conditionnel ? "8 5" : undefined,
      },
    });
  }

  // 2. Le OU du premier moment : les méthodes, lues dans le texte de la fiche.
  const premier = moments[0];
  if (premier && g.methodes?.length > 1) {
    noeuds.push({
      id: "ou-methodes",
      type: "ou",
      position: { x: 0, y: 0 },
      data: { titre: premier.titre, branches: g.methodes },
    });
    aretes.push({
      id: `${premier.id}--ou-methodes`,
      source: premier.id,
      target: "ou-methodes",
      markerEnd: { type: MarkerType.ArrowClosed, width: 18, height: 18, color: "var(--primary)" },
      style: { strokeWidth: 2, stroke: "var(--primary)" },
    });
  }

  // 3. Les SI : les sorties du chemin nominal. La fiche ne dit pas d'où elles partent —
  //    elles restent sans arête entrante, et le nœud le dit en toutes lettres.
  for (const b of g.bifurcations) {
    const t = g.transitions.find((tr) => tr.vers === b.id);
    noeuds.push({
      id: `si-${b.id}`,
      type: "si",
      position: { x: 0, y: 0 },
      data: { question: b.depuis, alors: b.vers, origineNommee: Boolean(t?.de) },
    });
  }

  // 4. Les extensions, elles aussi détachées tant que leur ancrage n'est pas écrit.
  for (const e of g.extensions) {
    const rattaches = g.couverture.filter((c) => e.couverture.includes(c.cas));
    noeuds.push({
      id: e.slug,
      type: "extension",
      position: { x: 0, y: 0 },
      data: {
        titre: e.titre,
        slug: e.slug,
        cas: e.couverture.length,
        interventions: rattaches.filter((c) => c.statut !== "Couvert").length,
      },
    });
  }

  return { noeuds, aretes };
}

/* ------------------------------------------------------------- mise en place */

async function dispose(brut: Brut): Promise<Node[]> {
  const connectes = new Set(brut.aretes.flatMap((a) => [a.source, a.target]));
  const relies = brut.noeuds.filter((n) => connectes.has(n.id));
  const detaches = brut.noeuds.filter((n) => !connectes.has(n.id));

  const taille = (n: Node) =>
    n.type === "moment" ? { width: L_MOMENT, height: H_MOMENT } : { width: L_BRANCHE, height: H_BRANCHE };

  let place: Record<string, { x: number; y: number }> = {};
  let bas = 0;
  try {
    const res = await elk.layout({
      id: "racine",
      layoutOptions: {
        "elk.algorithm": "layered",
        "elk.direction": "RIGHT",
        // De l'air : c'est le manque d'espace qui faisait passer les libellés sous les cartes.
        "elk.layered.spacing.nodeNodeBetweenLayers": "120",
        "elk.spacing.nodeNode": "64",
        "elk.spacing.edgeNode": "40",
        "elk.layered.spacing.edgeNodeBetweenLayers": "40",
        "elk.padding": "[top=32,left=32,bottom=32,right=32]",
      },
      children: relies.map((n) => ({ id: n.id, ...taille(n) })),
      edges: brut.aretes.map((a) => ({ id: a.id, sources: [a.source], targets: [a.target] })),
    } as never);
    for (const enfant of (res.children ?? []) as never[]) {
      const c = enfant as { id: string; x: number; y: number; height: number };
      place[c.id] = { x: c.x, y: c.y };
      bas = Math.max(bas, c.y + c.height);
    }
  } catch {
    relies.forEach((n, i) => {
      place[n.id] = { x: i * (L_MOMENT + 120), y: 0 };
    });
    bas = H_MOMENT;
  }

  const resultat: Node[] = relies.map((n) => ({ ...n, position: place[n.id] ?? { x: 0, y: 0 } }));

  // Bande du bas : ce que la fiche ne raccorde à rien. Leur isolement EST le constat.
  const parLigne = 5;
  detaches.forEach((n, i) => {
    resultat.push({
      ...n,
      position: {
        x: (i % parLigne) * (L_BRANCHE + 40),
        y: bas + 180 + Math.floor(i / parLigne) * (H_BRANCHE + 48),
      },
    });
  });

  /**
   * L'anneau de focus des nœuds est celui du KIT, pas un anneau maison : `.ds-focus-ring`
   * porte la géométrie unique de BORDER (--control-focus-width / -color / -offset). Un nœud
   * est tabulable et sélectionnable — il lui fallait donc l'indicateur que WCAG 2.4.7 exige,
   * et le porter avec les crans du système plutôt qu'avec ceux du navigateur.
   */
  return resultat.map((n) => ({ ...n, className: "ds-focus-ring" }));
}
