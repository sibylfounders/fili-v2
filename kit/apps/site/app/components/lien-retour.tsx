"use client";
import * as React from "react";
import NextLink from "next/link";
import { Link } from "@fili/react";

/**
 * Lien de retour d'une page de contenu (« ← Doctrine », « ← Audit ») — CLIENT.
 *
 * Le routage reste `next/link` (navigation client), mais la facture et l'anneau de focus
 * appartiennent à Fili : `Link asChild` compose les deux (LINK-UX, contexte navigation).
 * Avant, chaque page stylait son `next/link` à la main — un vocabulaire de lien de plus.
 */
export function LienRetour({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <p className="m-0">
      <Link asChild context="navigation" className="text-sm">
        <NextLink href={href}>{children}</NextLink>
      </Link>
    </p>
  );
}
