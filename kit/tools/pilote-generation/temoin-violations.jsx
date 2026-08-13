// Sortie témoin — 3 violations injectées volontairement (contrôle § 7.4)
import { Button, Card } from '@fili/react';

export default function Temoin() {
  return (
    <div className="p-md">
      {/* violation 1 : deux rangs dominants (un explicite, un par défauts) */}
      <Button style="filled" tone="primary" onClick={() => {}}>Créer</Button>
      <Button onClick={() => {}}>Exporter</Button>
      {/* violation 2 : action présentée comme un lien */}
      <a href="#" onClick={() => {}}>Supprimer la sélection</a>
      {/* violation 3 : surface statique cliquable */}
      <Card onClick={() => {}}>
        <p>Facture F-001</p>
      </Card>
    </div>
  );
}
