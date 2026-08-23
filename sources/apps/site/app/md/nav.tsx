"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { Accordion, Nav, navGroupLabelTextClass } from "@fili/react";
import type { NavGroupe } from "@/lib/md";

/**
 * Nav de la section Doctrine — portée dans la colonne de gauche du Shell (#section-nav).
 * Repère <nav> étiqueté + regroupement en Accordion (pattern navigation du DS).
 * Les liens reprennent la facture de Nav.Link mais passent par next/link (navigation client).
 */
/** La facture vient de Nav.Link (facture unique du kit) — ici seulement la composition
    next/link (navigation client) + emblème, via asChild. Plus aucune classe recopiée. */
function Lien({
  href, current, children, className = "", embleme,
}: { href: string; current: boolean; children: React.ReactNode; className?: string; embleme?: string }) {
  return (
    <Nav.Link asChild current={current} className={className}>
      <Link href={href}>
        {embleme ? (
          <span
            aria-hidden="true"
            className="flex h-4 w-4 shrink-0 items-center justify-center [&_svg]:h-4 [&_svg]:w-4"
            dangerouslySetInnerHTML={{ __html: embleme }}
          />
        ) : null}
        <span className="min-w-0 flex-1 truncate">{children}</span>
      </Link>
    </Nav.Link>
  );
}

const norm = (p: string) => (p.endsWith("/") ? p.slice(0, -1) : p);

export function MdNav({ groupes }: { groupes: NavGroupe[] }) {
  const pathname = norm(usePathname() ?? "");
  const [slot, setSlot] = React.useState<HTMLElement | null>(null);
  React.useEffect(() => setSlot(document.getElementById("section-nav")), []);

  const courant = groupes.find((g) => g.items.some((i) => norm(i.href) === pathname));
  const [ouvert] = React.useState<string[]>(() => (courant ? [courant.label] : ["Fondations"]));

  const arbre = (
    <div className="flex flex-col gap-xs">
      <Nav.Root label="Doctrine">
        <Nav.List>
          <Lien href="/md/" current={pathname === "/md"}>
            Vue d'ensemble
          </Lien>
        </Nav.List>
      </Nav.Root>
      <Accordion.Root defaultOpen={ouvert}>
        {groupes.map((g) => (
          <Accordion.Item key={g.label} value={g.label}>
            <Accordion.Header level={2} className="px-sm">
              <span className={navGroupLabelTextClass}>
                {g.label}
              </span>
            </Accordion.Header>
            <Accordion.Panel className="px-0 pb-sm pt-0">
              <Nav.Root label={g.label}>
                <Nav.List>
                  {g.items.map((i) => (
                    <Lien key={i.href} href={i.href} current={norm(i.href) === pathname} className="pl-sm" embleme={i.embleme}>
                      {i.label}
                    </Lien>
                  ))}
                </Nav.List>
              </Nav.Root>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  );

  return slot ? createPortal(arbre, slot) : null;
}
