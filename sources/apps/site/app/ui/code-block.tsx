"use client";
import * as React from "react";
import { Button } from "@fili/react";

const LANG: Record<string, string> = { react: "jsx", angular: "html", html: "html", tailwind: "html" };

export function CodeBlock({ code, framework }: { code: string; framework: string }) {
  const [copied, setCopied] = React.useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard indisponible */
    }
  };
  return (
    <div className="mt-md overflow-hidden rounded-md border border-border">
      <div className="flex items-center justify-between border-b border-border bg-surface px-md py-2">
        <span className="font-label text-xs font-semibold uppercase tracking-wide text-text-secondary">{LANG[framework] ?? "jsx"}</span>
        {/* Contrôle du kit — plus de <button> restylé pour copier. */}
        <Button.Root variant="ghost" tone="neutral" size="sm" onClick={copy}>
          <Button.Icon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          </Button.Icon>
          {copied ? "Copié" : "Copier"}
        </Button.Root>
      </div>
      <pre className="m-0 overflow-x-auto bg-surface p-md font-mono text-sm text-text-primary">{code}</pre>
    </div>
  );
}
