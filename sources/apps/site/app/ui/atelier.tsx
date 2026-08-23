"use client";
import * as React from "react";
import { createPortal } from "react-dom";
import { GROUPS } from "./registry";
import { Controls } from "./controls";
import { ResizablePreview } from "./resizable-preview";
import { CodeBlock } from "./code-block";
import { Foundations, FOUNDATIONS } from "./foundations";
import { useTheming } from "../theming-context";
import { Accordion, Button, CompactButton, Nav, Switch, navGroupLabelTextClass } from "@fili/react";

const ALL = GROUPS.flatMap((g) => g.items);

export function Atelier() {
  const [key, setKey] = React.useState(FOUNDATIONS[0]?.key ?? ALL[0]?.key ?? "");
  const [states, setStates] = React.useState<Record<string, Record<string, any>>>(() =>
    Object.fromEntries(ALL.map((e) => [e.key, { ...(e.initial ?? {}) }]))
  );
  const [navSlot, setNavSlot] = React.useState<HTMLElement | null>(null);
  const [toolsSlot, setToolsSlot] = React.useState<HTMLElement | null>(null);
  const [replayKey, setReplayKey] = React.useState(0);
  const [reduced, setReduced] = React.useState(false);
  const previewRef = React.useRef<HTMLDivElement>(null);
  const { framework } = useTheming();

  React.useEffect(() => {
    setNavSlot(document.getElementById("section-nav"));
    setToolsSlot(document.getElementById("section-tools"));
  }, []);

  const isFoundation = key.startsWith("f-");
  const entry = ALL.find((e) => e.key === key) ?? ALL[0];
  const s = states[entry.key] ?? {};
  const set = (k: string, v: any) =>
    setStates((prev) => ({ ...prev, [entry.key]: { ...prev[entry.key], [k]: v } }));

  const replay = () => {
    setReplayKey((k) => k + 1);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => previewRef.current?.querySelector("button")?.click())
    );
  };

  const shuffle = () => {
    if (!entry.controls?.length) return;
    const next: Record<string, any> = { ...s };
    for (const c of entry.controls) {
      if (c.k === "disabled" || c.k === "skeleton") continue; // jamais tirés au shuffle
      if (c.type === "seg") next[c.k] = c.opts[Math.floor(Math.random() * c.opts.length)];
      else if (c.type === "bool") next[c.k] = Math.random() < 0.5;
      else if (c.type === "range") {
        const st = c.step ?? 1;
        const n = Math.floor((c.max - c.min) / st) + 1;
        next[c.k] = c.min + Math.floor(Math.random() * n) * st;
      }
    }
    setStates((prev) => ({ ...prev, [entry.key]: next }));
  };
  const reset = () => setStates((prev) => ({ ...prev, [entry.key]: { ...(entry.initial ?? {}) } }));

  // Facture unique du kit (Nav.Link) — le bouton de sélection garde sa sémantique via asChild.
  const navBtn = (k: string, name: string, active: boolean) => (
    <Nav.Link asChild current={active} key={k}>
      <button type="button" onClick={() => setKey(k)}>
        <span className="min-w-0 flex-1 truncate">{name}</span>
      </button>
    </Nav.Link>
  );

  // Fondations et Layout : en tête, REPLIABLES (fermées par défaut) — le socle est là sans
  // manger la liste. Le dépliable est l'Accordion du kit (même geste que la nav Doctrine),
  // plus un <button> restylé à la main. Le reste : catégories ET liens en ordre alphabétique.
  const groupeRepliable = (label: string, children: React.ReactNode) => (
    <Accordion.Item key={label} value={label}>
      <Accordion.Header level={2} className="px-sm">
        <span className={navGroupLabelTextClass}>{label}</span>
      </Accordion.Header>
      <Accordion.Panel className="px-0 pb-sm pt-0">
        <Nav.List className="gap-1">{children}</Nav.List>
      </Accordion.Panel>
    </Accordion.Item>
  );
  const groupeFixe = (label: string, children: React.ReactNode) => (
    <div key={label}>
      <p className={"mb-2 px-sm " + navGroupLabelTextClass}>{label}</p>
      <Nav.List className="gap-1">{children}</Nav.List>
    </div>
  );
  const layoutGroup = GROUPS.find((g) => g.label === "Layout");
  const otherGroups = GROUPS.filter((g) => g.label !== "Layout")
    .slice()
    .sort((a, b) => a.label.localeCompare(b.label, "fr"));
  const sortedItems = (items: typeof ALL) =>
    items.slice().sort((a, b) => a.name.localeCompare(b.name, "fr"));

  const list = (
    <Nav.Root label="Composants de l'atelier" className="flex flex-col gap-lg">
      <Accordion.Root defaultOpen={[]}>
        {groupeRepliable("Fondations", FOUNDATIONS.map((f) => navBtn(f.key, f.title, f.key === key)))}
        {layoutGroup
          ? groupeRepliable("Layout", sortedItems(layoutGroup.items).map((it) => navBtn(it.key, it.name, !isFoundation && it.key === entry.key)))
          : null}
      </Accordion.Root>
      {otherGroups.map((g) =>
        groupeFixe(g.label, sortedItems(g.items).map((it) => navBtn(it.key, it.name, !isFoundation && it.key === entry.key))),
      )}
    </Nav.Root>
  );

  const changed = !!entry.initial && JSON.stringify(s) !== JSON.stringify(entry.initial);
  const tools =
    !isFoundation && entry.controls && entry.controls.length ? (
      <div>
        <div className="mb-md flex items-center justify-between">
          <span className="font-label text-sm font-semibold text-text-primary">Playground</span>
          {/* Contrôles du kit — jamais un <button> restylé dans l'atelier. */}
          <div className="flex items-center gap-1.5">
            {changed ? (
              <CompactButton variant="ghost" tone="neutral" size="md" onClick={reset} title="Réinitialiser" aria-label="Réinitialiser">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
              </CompactButton>
            ) : null}
            <CompactButton variant="ghost" tone="neutral" size="md" onClick={shuffle} title="Aléatoire" aria-label="Aléatoire">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22" /><path d="m18 2 4 4-4 4" /><path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2" /><path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8" /><path d="m18 14 4 4-4 4" /></svg>
            </CompactButton>
          </div>
        </div>
        {entry.controls[0]?.sec ? null : (
          <p className="mb-2 font-label text-[11px] font-semibold uppercase tracking-wider text-text-muted">{entry.name}</p>
        )}
        <Controls controls={entry.controls} state={s} set={set} />
      </div>
    ) : null;

  const main = isFoundation ? (
    <Foundations which={key} />
  ) : (
    <div className="mx-auto max-w-[900px] px-xl py-xl">
      <span className="font-label text-xs font-semibold uppercase tracking-wide text-text-secondary">Composant</span>
      <div className="mb-lg mt-1 flex items-center justify-between gap-md">
        <h1 className="m-0 text-3xl font-medium text-text-primary">{entry.name}</h1>
        {entry.replay ? (
          /* Contrôles du kit : la bascule reduced-motion est un Switch (effet immédiat),
             « Rejouer » un Button — plus de checkbox ni de <button> restylés. */
          <div className="flex items-center gap-md">
            <Switch size="sm" checked={reduced} onCheckedChange={setReduced} label="reduced-motion" />
            <Button.Root variant="stroke" tone="neutral" size="sm" onClick={replay}>
              <Button.Icon>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></svg>
              </Button.Icon>
              Rejouer
            </Button.Root>
          </div>
        ) : null}
      </div>

      {entry.blocks ? (
        entry.blocks.map((b, i) => (
          <div key={i} className={i > 0 ? "mt-xl" : undefined}>
            <p className="blk-title">{b.title}</p>
            <ResizablePreview fill={b.fill}>
              <div className={"contents" + (reduced ? " atelier-reduced" : "")}>{b.render(s, set)}</div>
            </ResizablePreview>
            <CodeBlock code={b.code(s, framework)} framework={framework} />
          </div>
        ))
      ) : (
        <>
          <ResizablePreview fill={entry.fill}>
            <div ref={previewRef} key={`${entry.key}-${replayKey}`} className={"contents" + (reduced ? " atelier-reduced" : "")}>
              {entry.render(s, set)}
            </div>
          </ResizablePreview>
          <CodeBlock code={entry.code(s, framework)} framework={framework} />
        </>
      )}
    </div>
  );

  return (
    <>
      {main}
      {navSlot ? createPortal(list, navSlot) : null}
      {toolsSlot && tools ? createPortal(tools, toolsSlot) : null}
    </>
  );
}
