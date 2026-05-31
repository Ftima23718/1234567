import { useEffect, useState } from 'react';
import { Bus as BusIcon, Plus, Wrench, Power, PowerOff } from 'lucide-react';
import { fetchBus, fetchLignes } from '../../services/transport';
import { getStatutColor, getStatutLabel } from '../../utils/format';
import { useToast } from '../../components/ui/useToast';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import SearchBar from '../../components/ui/SearchBar';

export default function ResponsibleBus() {
  const [busList, setBusList] = useState<any[]>([]);
  const [lignes, setLignes] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [filterStatut, setFilterStatut] = useState('all');
  const [search, setSearch] = useState('');
  const [statusDialog, setStatusDialog] = useState<{ id: string; newStatus: string } | null>(null);
  const [maintenanceNote, setMaintenanceNote] = useState('');
  const [showMaintenanceDialog, setShowMaintenanceDialog] = useState<{ id: string; toMaintenance: boolean } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    Promise.all([fetchBus(), fetchLignes()])
      .then(([bus, lig]) => {
        setBusList(Array.isArray(bus) ? bus : bus.content ?? []);
        setLignes(Array.isArray(lig) ? lig : lig.content ?? []);
      })
      .catch(() => {
        setBusList([]);
        setLignes([]);
      });
  }, []);

  const filtered = busList
    .filter(b => filterStatut === 'all' || b.statut === filterStatut)
    .filter(b => search === '' || `${b.immatriculation} ${b.marque} ${b.modele}`.toLowerCase().includes(search.toLowerCase()));

  const handleStatusChange = (id: string, newStatus: string) => {
    setBusList(prev => prev.map(b => b.id === id ? { ...b, statut: newStatus as 'ACTIF' | 'EN_MAINTENANCE' | 'HORS_SERVICE', placesDisponibles: newStatus === 'ACTIF' ? b.capacite : b.placesDisponibles } : b));
    setStatusDialog(null);
    setShowMaintenanceDialog(null);
    setMaintenanceNote('');
    const label = newStatus === 'ACTIF' ? 'actif' : newStatus === 'EN_MAINTENANCE' ? 'en maintenance' : 'hors service';
    toast('success', `Bus mis ${label} avec succes`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des bus</h1>
          <p className="text-gray-600 mt-1">Gerez le parc de vehicules du service de transport</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary inline-flex items-center gap-2">
          <Plus className="w-4 h-4" /> Ajouter un bus
        </button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-success-50 border border-success-200 rounded-lg px-4 py-3 text-center">
          <p className="text-2xl font-bold text-success-700">{busList.filter(b => b.statut === 'ACTIF').length}</p>
          <p className="text-xs text-success-600 font-medium">Actifs</p>
        </div>
        <div className="bg-warning-50 border border-warning-200 rounded-lg px-4 py-3 text-center">
          <p className="text-2xl font-bold text-warning-700">{busList.filter(b => b.statut === 'EN_MAINTENANCE').length}</p>
          <p className="text-xs text-warning-600 font-medium">En maintenance</p>
        </div>
        <div className="bg-error-50 border border-error-200 rounded-lg px-4 py-3 text-center">
          <p className="text-2xl font-bold text-error-700">{busList.filter(b => b.statut === 'HORS_SERVICE').length}</p>
          <p className="text-xs text-error-600 font-medium">Hors service</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Rechercher un bus..." />
        <div className="flex gap-2">
          {[
            { value: 'all', label: 'Tous' },
            { value: 'ACTIF', label: 'Actifs' },
            { value: 'EN_MAINTENANCE', label: 'En maintenance' },
            { value: 'HORS_SERVICE', label: 'Hors service' },
          ].map(f => (
            <button key={f.value} onClick={() => setFilterStatut(f.value)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filterStatut === f.value ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}>{f.label}</button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((bus) => (
          <div key={bus.id} className="card hover:shadow-md transition-shadow">
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    bus.statut === 'ACTIF' ? 'bg-success-100' : bus.statut === 'EN_MAINTENANCE' ? 'bg-warning-100' : 'bg-error-100'
                  }`}>
                    <BusIcon className={`w-6 h-6 ${bus.statut === 'ACTIF' ? 'text-success-600' : bus.statut === 'EN_MAINTENANCE' ? 'text-warning-600' : 'text-error-600'}`} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{bus.immatriculation}</h3>
                    <p className="text-sm text-gray-500">{bus.marque} {bus.modele}</p>
                  </div>
                </div>
                <span className={getStatutColor(bus.statut)}>{getStatutLabel(bus.statut)}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Capacite</p>
                  <p className="text-lg font-bold text-gray-900">{bus.capacite}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Disponibles</p>
                  <p className="text-lg font-bold text-gray-900">{bus.placesDisponibles}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-gray-500">Ligne affectee</p>
                <p className="text-sm font-medium text-gray-900">{lignes.find((l) => l.id === bus.ligneId)?.nom || 'Non affectee'}</p>
              </div>

              {/* Capacity bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">Occupation</span>
                  <span className="text-gray-700">{Math.round((bus.capacite - bus.placesDisponibles) / bus.capacite * 100)}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${bus.placesDisponibles < bus.capacite * 0.2 ? 'bg-error-500' : bus.placesDisponibles < bus.capacite * 0.5 ? 'bg-warning-500' : 'bg-success-500'}`}
                    style={{ width: `${Math.round((bus.capacite - bus.placesDisponibles) / bus.capacite * 100)}%` }}></div>
                </div>
              </div>

              {/* Status actions */}
              <div className="pt-3 border-t border-gray-100 space-y-2">
                {bus.statut === 'ACTIF' && (
                  <button
                    onClick={() => setShowMaintenanceDialog({ id: bus.id, toMaintenance: true })}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-warning-50 text-warning-700 hover:bg-warning-100 transition-all"
                  >
                    <Wrench className="w-4 h-4" /> Mettre en maintenance
                  </button>
                )}
                {bus.statut === 'EN_MAINTENANCE' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setStatusDialog({ id: bus.id, newStatus: 'ACTIF' })}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-success-50 text-success-700 hover:bg-success-100 transition-all"
                    >
                      <Power className="w-4 h-4" /> Remettre en service
                    </button>
                    <button
                      onClick={() => setStatusDialog({ id: bus.id, newStatus: 'HORS_SERVICE' })}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-error-50 text-error-700 hover:bg-error-100 transition-all"
                    >
                      <PowerOff className="w-4 h-4" /> Hors service
                    </button>
                  </div>
                )}
                {bus.statut === 'HORS_SERVICE' && (
                  <button
                    onClick={() => setShowMaintenanceDialog({ id: bus.id, toMaintenance: false })}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-warning-50 text-warning-700 hover:bg-warning-100 transition-all"
                  >
                    <Wrench className="w-4 h-4" /> Mettre en maintenance
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Status change confirm */}
      <ConfirmDialog
        open={!!statusDialog}
        title="Changer le statut du bus"
        message={`Etes-vous sur de vouloir changer le statut de ce bus ?`}
        confirmLabel="Confirmer"
        variant="primary"
        onConfirm={() => statusDialog && handleStatusChange(statusDialog.id, statusDialog.newStatus)}
        onCancel={() => setStatusDialog(null)}
      />

      {/* Maintenance dialog */}
      {showMaintenanceDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[90] p-4" onClick={() => setShowMaintenanceDialog(null)}>
          <div className="bg-white rounded-xl max-w-md w-full shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Wrench className="w-6 h-6 text-warning-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {showMaintenanceDialog.toMaintenance ? 'Mettre en maintenance' : 'Remettre en maintenance'}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {showMaintenanceDialog.toMaintenance
                      ? 'Le bus sera marque comme en maintenance et ne sera plus disponible pour les trajets.'
                      : 'Le bus sera mis en maintenance avant de pouvoir redevenir actif.'}
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Note de maintenance (optionnel)</label>
                <textarea
                  value={maintenanceNote}
                  onChange={(e) => setMaintenanceNote(e.target.value)}
                  className="input-field min-h-[80px] resize-y"
                  placeholder="Ex: Revision moteur, changement de pneus..."
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowMaintenanceDialog(null)} className="btn-ghost flex-1">Annuler</button>
                <button
                  onClick={() => handleStatusChange(showMaintenanceDialog.id, 'EN_MAINTENANCE')}
                  className="bg-warning-600 hover:bg-warning-700 text-white font-medium py-2.5 px-5 rounded-lg transition-all duration-200 flex-1"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create bus modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[90] p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Ajouter un bus</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Immatriculation</label>
                  <input className="input-field" placeholder="TRAN-009" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacite</label>
                  <input type="number" className="input-field" placeholder="50" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marque</label>
                  <input className="input-field" placeholder="Mercedes" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Modele</label>
                  <input className="input-field" placeholder="Citaro" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ligne affectee</label>
                <select className="input-field">
                  <option value="">Choisir une ligne</option>
                  {lignes.filter((l) => l.estActive).map((l) => (
                    <option key={l.id} value={l.id}>{l.nom}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-3">
                <button onClick={() => setShowModal(false)} className="btn-ghost flex-1">Annuler</button>
                <button onClick={() => { setShowModal(false); toast('success', 'Bus ajoute avec succes'); }} className="btn-primary flex-1">Ajouter</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
