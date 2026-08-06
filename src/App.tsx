/**
 * App — page d'attente FILI V2.
 *
 * Statut Fili : socle technique, pas une IHM produit.
 * Aucun cadrage produit n'a été demandé pour cet écran : il n'expose aucune
 * donnée, aucun état asynchrone, aucune interaction métier. Le protocole
 * `fili-requirement-gathering` s'appliquera au premier écran réel.
 *
 * Contraintes doctrine déjà appliquées ici :
 *  - R1 : zéro valeur en dur, uniquement des tokens sémantiques Tailwind.
 *  - R2 : structure sémantique (main / h1), langue déclarée, focus visible,
 *         lisible à 320 px et à 200 % de zoom, prefers-reduced-motion global.
 *  - R3 : aucune donnée personnelle, aucun tracker, aucun appel réseau.
 *  - R4 : écran statique — un seul état possible, donc pas de contrat d'états
 *         à honorer. Le premier composant asynchrone en aura un complet.
 */
export default function App() {
  return (
    <main className="min-h-dvh px-6 py-16 sm:px-10">
      <div className="mx-auto flex max-w-prose flex-col gap-8">
        <header className="flex flex-col gap-3">
          <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">
            Design Ops &amp; Code Governance
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">FILI&nbsp;V2</h1>
          <p className="text-lg text-ink-muted">
            Socle technique initialisé. Aucune interface produit n&apos;est
            encore écrite : le cadrage précède le code.
          </p>
        </header>

        <section
          aria-labelledby="etat-du-socle"
          className="rounded-card border border-border bg-surface-muted p-6"
        >
          <h2 id="etat-du-socle" className="text-base font-semibold">
            État du socle
          </h2>
          <dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
            <div className="flex justify-between gap-4 border-b border-border pb-2">
              <dt className="text-ink-muted">Build</dt>
              <dd className="font-mono">Vite + React + TypeScript</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-border pb-2">
              <dt className="text-ink-muted">Styles</dt>
              <dd className="font-mono">Tailwind CSS</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-border pb-2">
              <dt className="text-ink-muted">Tokens</dt>
              <dd className="font-mono">sémantiques (provisoires)</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-border pb-2">
              <dt className="text-ink-muted">Design System</dt>
              <dd className="font-mono">à définir</dd>
            </div>
          </dl>
        </section>

        <section aria-labelledby="prochaine-etape" className="flex flex-col gap-3">
          <h2 id="prochaine-etape" className="text-base font-semibold">
            Prochaine étape
          </h2>
          <p className="text-ink-muted">
            Verrouiller le sujet <strong>Qualité Perçue Minimale</strong> avant
            toute production d&apos;interface. La carte du système et les
            décisions se lisent dans{' '}
            <code className="font-mono text-ink">system-map.md</code> et{' '}
            <code className="font-mono text-ink">journal.md</code>.
          </p>
        </section>
      </div>
    </main>
  )
}
