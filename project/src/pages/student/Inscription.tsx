import { useEffect, useState } from 'react';
import { Bus, MapPin, Upload, CheckCircle, Clock, FileText, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import type { TypeAbonnement } from '../../types';
import { fetchArrets, fetchLignes, fetchTarifs } from '../../services/transport';

export default function StudentInscription() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    ligneId: '', arretId: '', typeAbonnement: '' as TypeAbonnement | '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [lignes, setLignes] = useState<any[]>([]);
  const [arrets, setArrets] = useState<any[]>([]);
  const [tarifs, setTarifs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    Promise.all([fetchLignes(true), fetchTarifs()])
      .then(([lig, tar]) => {
        const lignesData = Array.isArray(lig) ? lig : [];
        if (lignesData.length === 0) {
          setError('Aucune ligne disponible');
          console.warn('No lines available from API');
        }
        setLignes(lignesData);
        setTarifs(Array.isArray(tar) ? tar : []);
      })
      .catch((err) => {
        setError('Erreur lors du chargement des lignes');
        console.error('Error fetching lignes/tarifs:', err);
        setLignes([]);
        setTarifs([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!form.ligneId) {
      setArrets([]);
      return;
    }
    fetchArrets(form.ligneId).then((data) => setArrets(Array.isArray(data) ? data : [])).catch(() => setArrets([]));
  }, [form.ligneId]);

  const activeLignes = lignes;
  const filteredArrets = arrets;
  const selectedTarif = tarifs.find((t: any) => t.typeAbonnement === form.typeAbonnement);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value, ...(name === 'ligneId' ? { arretId: '' } : {}) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto mt-20 text-center">
        <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-success-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Demande soumise avec succes</h2>
        <p className="text-gray-600 mb-6">Votre dossier d'inscription a ete enregistre. Vous recevrez une notification par email une fois que l'administrateur aura traite votre demande.</p>
        <div className="card p-6 text-left mb-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Ligne</span>
              <span className="text-sm font-medium text-gray-900">{activeLignes.find(l => l.id === form.ligneId)?.nom}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Arret</span>
              <span className="text-sm font-medium text-gray-900">{arrets.find(a => a.id === form.arretId)?.nom}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Abonnement</span>
              <span className="text-sm font-medium text-gray-900">{form.typeAbonnement === 'MENSUEL' ? 'Mensuel' : form.typeAbonnement === 'SEMESTRIEL' ? 'Semestriel' : 'Annuel'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Montant</span>
              <span className="text-sm font-bold text-primary-600">{selectedTarif ? formatCurrency(selectedTarif.montant) : '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Statut</span>
              <span className="badge-pending">En attente</span>
            </div>
          </div>
        </div>
        <button onClick={() => { setSubmitted(false); setStep(1); setForm({ ligneId: '', arretId: '', typeAbonnement: '' }); }} className="btn-primary">
          Nouvelle inscription
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Inscription au service de transport</h1>
        <p className="text-gray-600 mt-1">Remplissez le formulaire pour vous inscrire</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center mb-8">
        {[
          { n: 1, label: 'Ligne & Arret' },
          { n: 2, label: 'Abonnement' },
          { n: 3, label: 'Documents' },
          { n: 4, label: 'Confirmation' },
        ].map((s, i) => (
          <div key={s.n} className="flex items-center flex-1">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step >= s.n ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {step > s.n ? <CheckCircle className="w-4 h-4" /> : s.n}
              </div>
              <span className={`text-sm hidden sm:block ${step >= s.n ? 'text-primary-600 font-medium' : 'text-gray-500'}`}>
                {s.label}
              </span>
            </div>
            {i < 3 && <div className={`flex-1 h-0.5 mx-3 ${step > s.n ? 'bg-primary-600' : 'bg-gray-200'}`}></div>}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {loading && (
          <div className="card p-6 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-2"></div>
            <p className="text-gray-600">Chargement des lignes...</p>
          </div>
        )}

        {error && !loading && (
          <div className="card p-6 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {!loading && !error && step === 1 && (
          <div className="card p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Choix de ligne et d'arret</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Ligne de transport</label>
              <select name="ligneId" value={form.ligneId} onChange={handleChange} className="input-field" required>
                <option value="">Selectionnez une ligne</option>
                {activeLignes.map(l => (
                  <option key={l.id} value={l.id}>{l.nom} - {l.pointDepart} / {l.pointArrivee}</option>
                ))}
              </select>
              {form.ligneId && (
                <div className="mt-3 p-3 bg-primary-50 rounded-lg flex items-center gap-2">
                  <Bus className="w-4 h-4 text-primary-600" />
                  <span className="text-sm text-primary-700">
                    {activeLignes.find(l => l.id === form.ligneId)?.description}
                  </span>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Arret de prise</label>
              <select name="arretId" value={form.arretId} onChange={handleChange} className="input-field" required disabled={!form.ligneId}>
                <option value="">{form.ligneId ? 'Selectionnez un arret' : 'Choisissez d\'abord une ligne'}</option>
                {filteredArrets.map(a => (
                  <option key={a.id} value={a.id}>
                    <MapPin className="w-4 h-4" /> {a.nom} - {a.adresse}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end">
              <button type="button" onClick={() => setStep(2)} disabled={!form.ligneId || !form.arretId} className="btn-primary">
                Suivant
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="card p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Type d'abonnement</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tarifs.map((t: any) => (
                <label
                  key={t.id}
                  className={`relative cursor-pointer rounded-xl border-2 p-5 transition-all ${
                    form.typeAbonnement === t.typeAbonnement
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="typeAbonnement"
                    value={t.typeAbonnement}
                    checked={form.typeAbonnement === t.typeAbonnement}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3 ${
                      form.typeAbonnement === t.typeAbonnement ? 'bg-primary-600' : 'bg-gray-100'
                    }`}>
                      <Clock className={`w-5 h-5 ${form.typeAbonnement === t.typeAbonnement ? 'text-white' : 'text-gray-500'}`} />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">
                      {t.typeAbonnement === 'MENSUEL' ? 'Mensuel' : t.typeAbonnement === 'SEMESTRIEL' ? 'Semestriel' : 'Annuel'}
                    </h3>
                    <p className="text-xs text-gray-500 mb-3">{t.description}</p>
                    <p className="text-lg font-bold text-primary-600">{formatCurrency(t.montant)}</p>
                  </div>
                  {form.typeAbonnement === t.typeAbonnement && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle className="w-5 h-5 text-primary-600" />
                    </div>
                  )}
                </label>
              ))}
            </div>
            <div className="flex justify-between">
              <button type="button" onClick={() => setStep(1)} className="btn-ghost">Precedent</button>
              <button type="button" onClick={() => setStep(3)} disabled={!form.typeAbonnement} className="btn-primary">Suivant</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="card p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Documents justificatifs</h2>
            <p className="text-sm text-gray-600">Veuillez telecharger les documents necessaires pour valider votre inscription</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Photo d'identite</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Cliquez ou glissez votre photo ici</p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG - Max 2MB</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Carte etudiante</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Cliquez ou glissez votre carte etudiante ici</p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG, PDF - Max 5MB</p>
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <button type="button" onClick={() => setStep(2)} className="btn-ghost">Precedent</button>
              <button type="button" onClick={() => setStep(4)} className="btn-primary">Suivant</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="card p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Recapitulatif</h2>
            <div className="bg-gray-50 rounded-lg p-5 space-y-4">
              <div className="flex items-center gap-3">
                <Bus className="w-5 h-5 text-primary-600" />
                <div>
                  <p className="text-sm text-gray-500">Ligne</p>
                  <p className="text-sm font-medium text-gray-900">{activeLignes.find(l => l.id === form.ligneId)?.nom}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary-600" />
                <div>
                  <p className="text-sm text-gray-500">Arret</p>
                  <p className="text-sm font-medium text-gray-900">{arrets.find(a => a.id === form.arretId)?.nom}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary-600" />
                <div>
                  <p className="text-sm text-gray-500">Abonnement</p>
                  <p className="text-sm font-medium text-gray-900">
                    {form.typeAbonnement === 'MENSUEL' ? 'Mensuel' : form.typeAbonnement === 'SEMESTRIEL' ? 'Semestriel' : 'Annuel'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-primary-600" />
                <div>
                  <p className="text-sm text-gray-500">Montant a payer</p>
                  <p className="text-lg font-bold text-primary-600">{selectedTarif ? formatCurrency(selectedTarif.montant) : '-'}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <button type="button" onClick={() => setStep(3)} className="btn-ghost">Precedent</button>
              <button type="submit" className="btn-success inline-flex items-center gap-2">
                <CheckCircle className="w-5 h-5" /> Soumettre la demande
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
