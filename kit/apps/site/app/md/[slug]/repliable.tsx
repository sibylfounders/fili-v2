"use client";
import * as React from "react";
import { Accordion } from "@fili/react";

/** Frontière client pour un Accordion du DS dont le contenu est rendu côté serveur. */
export function Repliable({
  titre,
  note,
  children,
  ouvert = false,
}: {
  titre: string;
  note?: string;
  children: React.ReactNode;
  ouvert?: boolean;
}) {
  return (
    <Accordion className="rounded-md border border-border" defaultOpen={ouvert ? ["v"] : []}>
      <Accordion.Item value="v">
        <Accordion.Header>
          {titre}
          {note ? <small className="ml-sm font-normal text-text-muted">{note}</small> : null}
        </Accordion.Header>
        <Accordion.Panel className="px-md pb-md">{children}</Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
