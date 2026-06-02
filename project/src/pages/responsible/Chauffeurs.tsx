import { useEffect, useState } from 'react';
import { Truck, Plus, Edit2, Trash2, Phone, Mail, Clock } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import { fetchChauffeurs, fetchLignes, fetchTrajets } from '../../services/transport';
import { useToast } from '../../components/ui/useToast';

export default function ResponsibleChauffeurs() {
  const [showModal, setShowModal] = useState(false);
  const [chauffeurs, setChauffeurs] = useState<any[]>([]);
  const [trajets, setTrajets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  // Form state
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    numeroPermis: '',
    password: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    Promise.all([fetchChauffeurs(), fetchLignes()])
      .then(([ch, lig]) => {
        const chauffeurData = Array.isArray(ch) ? ch : ch.content ?? [];
        const lineData = Array.isArray(lig) ? lig : lig.content ?? [];
        setChauffeurs(chauffeurData);
        return Promise.all(lineData.map((ligne: any) => fetchTrajets(ligne.id)));
      })
      .then((all) => setTrajets(all.flat()))
      .catch(() => {
        setChauffeurs([]);
        setTrajets([]);
      });
  };

  const handleAddChauffeur = async () => {
    if (!formData.nom.trim() || !formData.prenom.trim() || !formData.email.trim() || !formData.telephone.trim() || !formData.numeroPermis.trim() || !formData.password.trim()) {
      toast('error', 'Veuillez remplir tous les champs');
      return;
    }
    if (formData.password.length < 6) {
      toast('warning', 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);
    try {
      const newChauffeurData = {
        nom: formData.nom.trim(),
        prenom: formData.prenom.trim(),
        email: formData.email.trim(),
        telephone: formData.telephone.trim(),
        numeroPermis: formData.numeroPermis.trim(),
        password: formData.password,
      };

      await axiosClient.post('/auth/chauffeur', newChauffeurData);
      toast('success', 'Chauffeur ajouté avec succès');
      
      await loadData();
      
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        numeroPermis: '',
        password: '',
      });
      setShowModal(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du chauffeur:', error);
      toast('error', 'Erreur lors de l\'ajout du chauffeur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des chauffeurs</h1>
          <p className="text-gray-600 mt-1">Affectez les chauffeurs aux trajets</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary inline-flex items-center gap-2">
          <Plus className="w-4 h-4" /> Ajouter un chauffeur
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {chauffeurs.map((chauffeur) => {
          const trajetsAssignes = trajets.filter((t) => t.chauffeurId === chauffeur.id);
          return (
            <div key={chauffeur.id} className="card hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <Truck className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{chauffeur.prenom} {chauffeur.nom}</h3>
                    <p className="text-sm text-gray-500">Permis: {chauffeur.numeroPermis}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{chauffeur.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{chauffeur.telephone}</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3">
                  <p className="text-xs text-gray-500 mb-2">Trajets assignes ({trajetsAssignes.length})</p>
                  {trajetsAssignes.length > 0 ? trajetsAssignes.map((t) => (
                    <div key={t.id} className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                      <Clock className="w-3 h-3" />
                      <span>{t.ligneNom} - {t.heureDepart}/{t.heureArrivee}</span>
                    </div>
                  )) : (
                    <p className="text-xs text-gray-400">Aucun trajet assigne</p>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-gray-100 mt-3">
                  <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-error-600 hover:bg-error-50 rounded-lg transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Ajouter un chauffeur</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input 
                    className="input-field" 
                    placeholder="Nom"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prenom</label>
                  <input 
                    className="input-field" 
                    placeholder="Prenom"
                    value={formData.prenom}
                    onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                    disabled={loading}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  className="input-field" 
                  placeholder="email@univ.dz"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telephone</label>
                <input 
                  className="input-field" 
                  placeholder="066 000 0000"
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Numero de permis</label>
                <input 
                  className="input-field" 
                  placeholder="PERM-2025-XXX"
                  value={formData.numeroPermis}
                  onChange={(e) => setFormData({ ...formData, numeroPermis: e.target.value })}
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                <input 
                  type="password"
                  className="input-field" 
                  placeholder="6 caractères minimum"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={loading}
                />
              </div>
              <div className="flex gap-3 pt-3">
                <button 
                  onClick={() => setShowModal(false)} 
                  className="btn-ghost flex-1"
                  disabled={loading}
                >
                  Annuler
                </button>
                <button 
                  onClick={handleAddChauffeur} 
                  className="btn-primary flex-1"
                  disabled={loading}
                >
                  {loading ? 'Ajout...' : 'Ajouter'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
