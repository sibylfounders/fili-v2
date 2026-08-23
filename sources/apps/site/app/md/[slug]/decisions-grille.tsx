"use client";
import * as React from "react";
import { Card, CardGroup, Chip, Link, Modal } from "@fili/react";
import { EVENEMENT_VOLET, allerAuVolet, ancreConsommee, ancreDemandee } from "../doc-tabs";
import type { Decision } from "@/lib/doctrine";

/**
 * Grille des règles d'un groupe — même geste que les Situations : collection de cartes du DS
 * (`CardGroup`, mode clickable, colonnes intrinsèques) dont les enfants sont de vraies `Card`
 * (l'API `CardGroup.Card` a été supprimée le 2026-07-30), détail dans un `Modal`. La cible
 * étendue est une COMMANDE (`Card.TitleCommand`) — ouvrir un superposé n'est pas naviguer.
 * Une seule modale montée à la fois, portée par la collection et non par la carte
 * (« un seul mode par collection »).
 *
 * Pas de visuel ici, contrairement aux Situations : une règle n'a pas d'illustration, et en
 * fabriquer une serait un ornement sans besoin réel.
 *
 * Les termes affichés sont COURTS et pour des humains ; le vocabulaire long et exact
 * (« propriété universelle », « parti pris d'identité »…) reste dans le markdown et dans ce que
 * consomment les IA — c'est leur contrat, pas celui du lecteur.
 */
const COURT: Record<Decision["statut"], { label: string; aide: string }> = {
  universelle: { label: "Standard", aide: "Vrai partout. Opposable à n'importe quel produit." },
  identite: { label: "Notre choix", aide: "Notre parti pris, pas une norme. Jamais imposé à quelqu'un d'autre." },
  implementation: { label: "Notre code", aide: "Vrai de notre implémentation, pas du design." },
  methode: { label: "Note", aide: "Note interne. Hors audit." },
};

const Pastille = ({ titre, ton, children }: { titre?: string; ton?: "muted" | "warning"; children: React.ReactNode }) => (
  <span
    title={titre}
    className={
      "rounded-pill px-sm py-0.5 font-label text-[10px] font-semibold uppercase tracking-wider " +
      (ton === "warning"
        ? "bg-warning-subtle text-warning"
        : ton === "muted"
          ? "border border-dashed border-border text-text-muted"
          : "border border-border text-text-secondary")
    }
  >
    {children}
  </span>
);

function Champ({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <div className="mt-md first:mt-0">
      <p className="m-0 mb-1 font-label text-[11px] font-semibold uppercase tracking-wider text-text-muted">{titre}</p>
      {children}
    </div>
  );
}

/** Titre de carte : l'énoncé quand il existe — la règle dite en une phrase pour un lecteur extérieur. */
/**
 * La modale apporte-t-elle quelque chose que la carte ne montre pas déjà ?
 *
 * La carte affiche l'énoncé, PUIS la mesure OU le problème, PUIS les compteurs. La modale
 * ajoute la règle complète, les deux champs à la fois, les situations, la position du secteur
 * et les liens de source. Quand elle n'ajoute rien, la carte ne doit proposer aucune ouverture :
 * un survol qui promet un détail inexistant est une affordance mensongère (CARD-UX, « le relief
 * est un signal, jamais un décor »).
 */
function aDuDetail(d: Decision): boolean {
  if (d.cas.length > 0) return true;
  if (d.contre) return true;
  if (d.sources.some((s) => s.liens.some((l) => l.url))) return true;
  if (d.mesure && d.probleme) return true;
  // La carte n'affiche qu'une ligne ; la modale rend la règle entière. Elle ne vaut le
  // déplacement que si ce texte dit sensiblement plus que ce qui est déjà lisible.
  return d.solution.trim().length > titre(d).length + 40;
}

function titre(d: Decision): string {
  if (d.enonce) return d.enonce;
  return d.solution.split("\n")[0].replace(/[*`]/g, "").trim();
}

export function DecisionsGrille({
  groupe,
  decisions,
  regles,
}: {
  groupe: string;
  decisions: Decision[];
  /** Règle complète pré-rendue côté serveur (markdown), indexée par identifiant. */
  regles: Record<string, React.ReactNode>;
}) {
  const [ouvert, setOuvert] = React.useState<Decision | null>(null);

  /* Une situation qui cite « BORDER-R03 → » demande ce volet ET cette ancre : on ouvre
     directement le détail au lieu de laisser le lecteur rechercher la carte des yeux.
     Deux chemins, parce que la grille peut être déjà montée (même volet) ou pas encore
     (l'événement part avant que Tabs ait monté le panneau) : l'intention en attente, puis
     l'événement vif. */
  React.useEffect(() => {
    const a = ancreDemandee("regles");
    if (!a) return;
    const d = decisions.find((x) => x.id === a);
    if (!d) return;
    ancreConsommee();
    setOuvert(d);
  }, [decisions]);

  React.useEffect(() => {
    const onDemande = (e: Event) => {
      const { volet, ancre } = (e as CustomEvent<{ volet: string; ancre?: string }>).detail ?? {};
      if (volet !== "regles" || !ancre) return;
      const d = decisions.find((x) => x.id === ancre);
      if (d) setOuvert(d);
    };
    window.addEventListener(EVENEMENT_VOLET, onDemande);
    return () => window.removeEventListener(EVENEMENT_VOLET, onDemande);
  }, [decisions]);

  const d = ouvert;
  return (
    <>
      {/* Un seul mode pour la collection (CARD-UX). Les règles dont la modale n'ajouterait
          rien surclassent le mode du groupe en `static` : ce sont des cartes SANS CIBLE —
          elles gardent leur place et leur forme, mais perdent toute affordance (pas de
          curseur main, pas de relief) et le highlight de proximité les ignore. Le survol
          ne promet que ce qui existe. */}
      <CardGroup mode="clickable" separated label={`Règles — ${groupe}`}>
        {decisions.map((x) => {
          const detail = aDuDetail(x);
          return (
            <Card.Root key={x.id} id={x.id} mode={detail ? undefined : "static"} className="scroll-mt-[72px]">
              <Card.Body>
                <Card.Header>
                  <Card.Title as="h4">
                    {detail ? (
                      <Card.TitleCommand onClick={() => setOuvert(x)}>{titre(x)}</Card.TitleCommand>
                    ) : (
                      titre(x)
                    )}
                  </Card.Title>
                </Card.Header>
                {x.mesure ? (
                  <Card.Description>
                    <span className="mr-1 font-label text-[10px] font-semibold uppercase tracking-wider text-text-muted">Vérifiable</span>
                    {x.mesure}
                  </Card.Description>
                ) : x.probleme ? (
                  <Card.Description>
                    <span className="mr-1 font-label text-[10px] font-semibold uppercase tracking-wider text-text-muted">Pourquoi</span>
                    {x.probleme}
                  </Card.Description>
                ) : null}
                <span className="mt-sm flex flex-wrap items-center gap-sm">
                  {/* L'action est DÉCLARÉE, pas seulement suggérée par le survol — et elle
                      n'apparaît que sur les cartes qui ont une cible. Une carte sans détail
                      n'affiche donc ni texte accentué, ni flèche : rien qui ressemble à un lien.
                      Ce n'est pas un élément interactif imbriqué (interdit dans une cible
                      étendue, LINK-R16) mais un libellé ; la cible reste le titre de la carte. */}
                  {detail ? (
                    <span className="text-xs font-medium text-primary">Comprendre la règle →</span>
                  ) : null}
                  <span className="font-mono text-xs font-semibold text-text-muted">{x.id}</span>
                  <Pastille titre={COURT[x.statut].aide}>{COURT[x.statut].label}</Pastille>
                  {x.couche === "ux" && x.statut !== "methode" && x.cas.length === 0 ? (
                    <Pastille ton="muted" titre="Aucune situation concrète ne l'illustre encore — trou de couverture, pas un défaut de la règle.">
                      Aucune situation
                    </Pastille>
                  ) : null}
                  <span className="font-label text-[11px] text-text-muted">
                    {[
                      x.cas.length ? `${x.cas.length} situation${x.cas.length > 1 ? "s" : ""}` : null,
                      x.sources.length ? `${x.sources.length} source${x.sources.length > 1 ? "s" : ""}` : x.interne ? "source interne" : null,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </span>
              </Card.Body>
            </Card.Root>
          );
        })}
      </CardGroup>

      <Modal open={!!d} onClose={() => setOuvert(null)} size="default">
        {d ? (
          <>
            <Modal.Header kicker={`${d.id} · ${COURT[d.statut].label}`}>{titre(d)}</Modal.Header>
            <Modal.Body className="pb-lg">
              <Champ titre="Règle complète">
                <div className="text-sm">{regles[d.id]}</div>
              </Champ>

              {d.mesure ? (
                <Champ titre="Vérifiable">
                  <p className="m-0 font-mono text-[12px] text-text-secondary">{d.mesure}</p>
                </Champ>
              ) : null}

              {d.probleme ? (
                <Champ titre="Pourquoi">
                  <p className="m-0 text-sm text-text-secondary">{d.probleme}</p>
                </Champ>
              ) : null}

              {d.cas.length ? (
                <Champ titre="Situations qui l'éprouvent">
                  <div className="flex flex-wrap gap-sm">
                    {d.cas.map((x) => (
                      <Chip
                        key={x.id}
                        variant="subtle"
                        onClick={() => {
                          setOuvert(null);
                          allerAuVolet("cas", x.id);
                        }}
                      >
                        {x.titre} →
                      </Chip>
                    ))}
                  </div>
                </Champ>
              ) : null}

              {d.contre ? (
                <Champ titre="Ce que fait le secteur">
                  <p className="m-0 text-sm text-text-secondary">{d.contre}</p>
                </Champ>
              ) : null}

              <Champ titre="Sources">
                {d.sources.length === 0 ? (
                  <p className="m-0 text-sm text-text-secondary">
                    Aucune source externe — c&rsquo;est une décision maison.
                    {d.confiance ? <span className="text-text-muted"> {d.confiance}</span> : null}
                  </p>
                ) : (
                  <ul className="m-0 flex list-none flex-col gap-1 p-0 text-sm">
                    {d.sources.map((s) => (
                      <li key={s.ref} className="flex flex-wrap items-baseline gap-2">
                        {s.liens.map((l, i) =>
                          l.url ? (
                            <Link key={i} href={l.url} context="inline" target="_blank" rel="noreferrer">
                              {l.label}
                            </Link>
                          ) : (
                            <span key={i} className="text-text-secondary">{l.label}</span>
                          ),
                        )}
                        <span className="text-xs text-text-muted">· {s.confiance}</span>
                      </li>
                    ))}
                    {d.interne ? <li className="text-sm text-text-secondary">· complétée par une décision maison</li> : null}
                  </ul>
                )}
              </Champ>
            </Modal.Body>
          </>
        ) : null}
      </Modal>
    </>
  );
}
