"use client";
import * as React from "react";
import { Card, CardGroup, Switch } from "@fili/react";

/* TEST autonome (hors shell atelier) — ESSAI « carte de réglage » demandé par Aurélien
   (2026-07-30 soir) : une carte, le libellé à gauche, le Switch à droite.

   Objectif de l'essai : vérifier que le besoin se COMPOSE avec l'API publique existante
   (loi atomique : si les composants suffisent, ils se composent) — et nommer honnêtement
   ce qui frotte, au lieu de l'entourer d'API locale.

   Ce que la composition donne AUJOURD'HUI :
   · la surface est une vraie Card `static` (aucune affordance de carte : le relief est un
     signal, et ici c'est le CONTRÔLE qui est la cible, pas la surface) ;
   · le Switch du kit porte l'interaction, son focus, son rôle switch ;
   · le libellé est relié par aria-labelledby (nom accessible correct) ;
   · la « liste de réglages » n'est PAS une liste bordée à la main : c'est le régime JOINT
     de CardGroup — conteneur au rayon lg, filets internes, balisage de liste réel.

   Frictions RÉELLES constatées (matière à fiche de manque, pas à contournement) :
   1. le libellé relié par aria-labelledby n'est pas CLIQUABLE (l'association native
      exigerait le label intégré de Switch — mais il impose l'ordre switch→texte et ne
      sait pas s'étirer en justify-between) ;
   2. faire de TOUTE la surface une cible de bascule demanderait la mécanique de cible
      étendue avec un vrai contrôle dedans — le futur `Card.Control` pressenti dans la
      famille TitleLink/TitleCommand. Rien n'est simulé ici en attendant l'arbitrage. */

function LigneReglage({
  titre,
  detail,
  checked,
  onCheckedChange,
}: {
  titre: string;
  detail?: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  const labelId = React.useId();
  return (
    <div className="flex items-center justify-between gap-md">
      <div className="min-w-0">
        <p id={labelId} className="m-0 font-medium text-text-primary">{titre}</p>
        {detail ? <Card.Description>{detail}</Card.Description> : null}
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} aria-labelledby={labelId} />
    </div>
  );
}

const REGLAGES = [
  { titre: "Notifications", detail: "Un résumé quotidien, jamais d'alerte unitaire." },
  { titre: "Thème sombre", detail: "Suit le système par défaut." },
  { titre: "Relief", detail: "Le registre d'élévation des cartes cliquables." },
];

export default function CarteReglageTest() {
  const [etats, setEtats] = React.useState<Record<string, boolean>>({ Notifications: true, Relief: true });
  const bascule = (t: string) => (v: boolean) => setEtats((p) => ({ ...p, [t]: v }));

  return (
    <div className="mx-auto max-w-[70ch] px-xl py-xl font-sans">
      <span className="font-label text-xs font-semibold uppercase tracking-wide text-text-secondary">Test — hors MD</span>
      <h1 className="m-0 mb-2 mt-1 text-3xl font-medium text-text-primary">Essai — carte de réglage (Switch)</h1>
      <p className="mb-lg max-w-[64ch] text-sm leading-relaxed text-text-secondary">
        Libellé à gauche, Switch à droite : Card statique (la surface organise, le contrôle est la
        cible) + Switch du kit + layout de page. Zéro API nouvelle — et les frictions réelles sont
        notées dans la source, pour la fiche de manque.
      </p>

      <h2 className="m-0 mb-md mt-xl text-h4 font-semibold text-text-primary">Une carte seule</h2>
      <CardGroup solo mode="static" label="Réglage isolé">
        <Card.Root>
          <Card.Body>
            <LigneReglage
              titre="Notifications"
              detail="Un résumé quotidien, jamais d'alerte unitaire."
              checked={!!etats.Notifications}
              onCheckedChange={bascule("Notifications")}
            />
          </Card.Body>
        </Card.Root>
      </CardGroup>

      <h2 className="m-0 mb-md mt-xl text-h4 font-semibold text-text-primary">
        La « liste cardée » : le régime JOINT de la collection
      </h2>
      <p className="mb-md max-w-[64ch] text-sm text-text-secondary">
        Une liste de réglages n&rsquo;est pas une liste bordée à la main : c&rsquo;est CardGroup en
        régime joint — conteneur au rayon conteneur, filets internes, balisage de liste réel — et
        chaque item est une vraie Card.
      </p>
      <CardGroup cols={1} mode="static" label="Réglages">
        {REGLAGES.map((r) => (
          <Card.Root key={r.titre}>
            <Card.Body>
              <LigneReglage
                titre={r.titre}
                detail={r.detail}
                checked={!!etats[r.titre]}
                onCheckedChange={bascule(r.titre)}
              />
            </Card.Body>
          </Card.Root>
        ))}
      </CardGroup>
    </div>
  );
}
