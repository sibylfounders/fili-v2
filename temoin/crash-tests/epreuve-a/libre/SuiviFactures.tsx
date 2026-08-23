import { useRequete, useMutation } from '../../design-system/donnees/useRequete.js'

export function SuiviFactures() {
  const { donnees } = useRequete('/factures')
  const { lancer } = useMutation('/relances')

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Suivi des factures</h1>

      <div className="flex items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Rechercher un client"
          className="border rounded px-3 py-2 w-[320px]"
        />
        <select className="border rounded px-3 py-2">
          <option>Tous les statuts</option>
          <option>Payée</option>
          <option>En attente</option>
          <option>En retard</option>
        </select>
      </div>

      <div className="border rounded overflow-hidden">
        <div className="grid grid-cols-4 bg-gray-50 px-4 py-[14px] text-sm font-semibold text-gray-600">
          <span>Client</span>
          <span>Montant</span>
          <span>Échéance</span>
          <span>Statut</span>
        </div>
        {donnees.map((facture) => (
          <div
            key={facture.id}
            onClick={() => console.log(facture.id)}
            className="grid grid-cols-4 px-4 py-3 border-t hover:bg-gray-50 cursor-pointer items-center"
          >
            <span>{facture.client}</span>
            <span>{facture.montant}</span>
            <span>{facture.echeance}</span>
            <span className="flex items-center justify-between">
              <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-700">{facture.statut}</span>
              <button
                onClick={lancer}
                className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded mt-1"
              >
                Relancer
              </button>
            </span>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-4">{donnees.length} factures</p>
    </div>
  )
}
