"use client";
import * as React from "react";
import { Card, CardGroup, Chip, Modal } from "@fili/react";
import { EVENEMENT_VOLET, allerAuVolet, ancreConsommee, ancreDemandee } from "../doc-tabs";
import type { Cas } from "@/lib/doctrine";

const Html = ({ html, className }: { html: string; className?: string }) => (
  <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
);

/**
 * Grille des cas d'usage d'une famille — collection de cartes du DS (`CardGroup`, mode clickable,
 * colonnes intrinsèques), dont les enfants sont de vraies `Card` (l'API `CardGroup.Card` a été
 * supprimée le 2026-07-30). Chaque carte ouvre le détail du cas dans un `Modal` : la cible
 * étendue est une COMMANDE, donc un vrai bouton (`Card.TitleCommand`) — jamais un lien factice.
 * Une seule modale montée à la fois : la collection porte l'état, pas la carte
 * (« un seul mode par collection »).
 */
export function CasGrille({ famille, cas }: { famille: string; cas: Cas[] }) {
  const [ouvert, setOuvert] = React.useState<Cas | null>(null);

  /* Symétrique du volet Règles : une règle qui renvoie « ce cas → » ouvre directement le cas. */
  React.useEffect(() => {
    const a = ancreDemandee("cas");
    if (!a) return;
    const c = cas.find((x) => x.id === a);
    if (!c) return;
    ancreConsommee();
    setOuvert(c);
  }, [cas]);

  React.useEffect(() => {
    const onDemande = (e: Event) => {
      const { volet, ancre } = (e as CustomEvent<{ volet: string; ancre?: string }>).detail ?? {};
      if (volet !== "cas" || !ancre) return;
      const c = cas.find((x) => x.id === ancre);
      if (c) setOuvert(c);
    };
    window.addEventListener(EVENEMENT_VOLET, onDemande);
    return () => window.removeEventListener(EVENEMENT_VOLET, onDemande);
  }, [cas]);

  return (
    <>
      <CardGroup mode="clickable" separated label={`Cas d'usage — ${famille}`}>
        {cas.map((c) => (
          <Card.Root key={c.id} id={c.id} className="scroll-mt-[72px]">
            <Card.Body>
              <Card.Header>
                <Card.Title as="h4">
                  <Card.TitleCommand onClick={() => setOuvert(c)}>{c.titre}</Card.TitleCommand>
                </Card.Title>
              </Card.Header>
              <Card.Description>
                <span className="mr-1 font-label text-[10px] font-semibold uppercase tracking-wider text-text-muted">Quand</span>
                {c.quand}
              </Card.Description>
              <span className="mt-sm flex flex-wrap items-center gap-sm">
                <span className="text-xs font-medium text-primary">{c.lien} →</span>
                {c.statut ? (
                  <span className="rounded-pill bg-warning-subtle px-sm py-0.5 font-label text-[10px] font-semibold uppercase tracking-wider text-warning">
                    {c.statut}
                  </span>
                ) : null}
              </span>
            </Card.Body>
          </Card.Root>
        ))}
      </CardGroup>

      <Modal open={!!ouvert} onClose={() => setOuvert(null)} size="narrow">
        {ouvert ? (
          <>
            {ouvert.visuel ? (
              <Html html={ouvert.visuel} className="shrink-0 overflow-hidden rounded-t-md [&_svg]:block [&_svg]:h-auto [&_svg]:w-full" />
            ) : null}
            <Modal.Header kicker={ouvert.kicker}>{ouvert.titre}</Modal.Header>
            <Modal.Body className="pb-lg">
              {ouvert.blocs.map((b, i) => (
                <div key={i} className={i > 0 ? "mt-md border-t border-border pt-md" : undefined}>
                  <p className="m-0 mb-1 font-label text-xs font-semibold uppercase tracking-wider text-primary">{b.titre}</p>
                  <Html html={b.html} className="doc-prose text-sm [&>p:last-child]:mb-0" />
                </div>
              ))}
              {ouvert.regles.length ? (
                /* L'encart n'est plus recréé à la main : une surface qui organise du contenu
                   est une Card — solo, statique, sans affordance (2026-07-30). */
                <Card.Root mode="static" className="mt-lg">
                  <Card.Body>
                    <p className="m-0 font-label text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                      Règle qui tranche ce cas
                    </p>
                    <div className="flex flex-wrap gap-sm">
                      {ouvert.regles.map((r, i) =>
                        r.id ? (
                          <Chip
                            key={i}
                            mono
                            onClick={() => {
                              setOuvert(null);
                              allerAuVolet("regles", r.id);
                            }}
                          >
                            {r.id} →
                          </Chip>
                        ) : (
                          <span key={i} className="text-xs text-text-secondary">{r.tag}</span>
                        ),
                      )}
                    </div>
                  </Card.Body>
                </Card.Root>
              ) : null}
            </Modal.Body>
          </>
        ) : null}
      </Modal>
    </>
  );
}
