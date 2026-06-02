import { useEffect, useState } from 'react';
import { Search, Users, Eye, GraduationCap, Mail, Phone, Activity, Trash2, Plus } from 'lucide-react';
import { getEtudiants, updateUser } from '../../api/apiService';
import { useToast } from '../../components/ui/useToast';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

function EditStudentPanel({ student, onSave }: { student: any; onSave: (u: any) => Promise<void> }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ nom: student.nom || '', prenom: student.prenom || '', telephone: student.telephone || '' });

  return (
    <div>
      {!editing ? (
        <div className="flex gap-2">
          <button onClick={() => setEditing(true)} className="btn-primary">Modifier</button>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Nom</label>
            <input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Prenom</label>
            <input value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Telephone</label>
            <input value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} className="input-field" />
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary" onClick={() => setEditing(false)}>Annuler</button>
            <button className="btn-primary" onClick={async () => { await onSave(form); setEditing(false); }}>
              Enregistrer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminEtudiants() {
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [etudiants, setEtudiants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadEtudiants();
  }, []);

  const loadEtudiants = async () => {
    try {
      setLoading(true);
      const data = await getEtudiants();
      setEtudiants(Array.isArray(data) ? data : data.content ?? []);
    } catch (error) {
      console.error('Failed to load students:', error);
      toast('error', 'Failed to load students');
      setEtudiants([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // TODO: Call DELETE endpoint when available
      setEtudiants(prev => prev.filter(e => e.id !== id));
      toast('success', 'Etudiant supprimé avec succès');
    } catch (error) {
      toast('error', 'Erreur lors de la suppression');
    } finally {
      setDeleteDialog(null);
    }
  };

  const filtered = etudiants.filter((e) =>
    search === '' || `${e.nom || ''} ${e.prenom || ''} ${e.email || ''}`.toLowerCase().includes(search.toLowerCase())
  );

  const selected = filtered.find((e) => e.id === selectedStudent) || etudiants.find((e) => e.id === selectedStudent);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des etudiants</h1>
        <div className="flex items-center justify-center h-96">
          <Activity className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des etudiants</h1>
          <p className="text-gray-600 mt-1">Consultez et gerez les comptes etudiants</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => window.open('/auth/register', '_blank')}>
          <Plus className="w-4 h-4" />
          Ajouter un etudiant
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-11" placeholder="Rechercher par nom, prenom ou email..." />
        </div>
        <p className="text-sm text-gray-500">{filtered.length} etudiant(s)</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="table-header">
                  <th className="px-5 py-3">Etudiant</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Telephone</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length > 0 ? (
                  filtered.map((etu) => (
                    <tr key={etu.id} className={`hover:bg-gray-50 transition-colors cursor-pointer ${selectedStudent === etu.id ? 'bg-primary-50' : ''}`}
                      onClick={() => setSelectedStudent(etu.id)}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-semibold text-primary-700">{(etu.prenom || 'E')[0]}{(etu.nom || 'U')[0]}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{etu.prenom} {etu.nom}</p>
                            <p className="text-xs text-gray-500">{etu.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">{etu.email}</td>
                      <td className="px-5 py-4 text-sm text-gray-600">{etu.telephone}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={(e) => { e.stopPropagation(); setSelectedStudent(etu.id); }}
                            className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); setDeleteDialog(etu.id); }}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center">
                      <p className="text-gray-500">Aucun etudiant trouvé</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          {selected ? (
            <div className="p-5 space-y-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-primary-700">{(selected.prenom || 'E')[0]}{(selected.nom || 'U')[0]}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selected.prenom} {selected.nom}</h3>
                  <p className="text-sm text-gray-500">{selected.role}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{selected.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{selected.telephone}</span>
                </div>
                {selected.etudiant && (
                  <>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{selected.etudiant.filiere}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">Année {selected.etudiant.anneeEtude}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-gray-500">{selected.etudiant.numeroEtudiant}</span>
                    </div>
                  </>
                )}
              </div>
              <div className="pt-3 border-t border-gray-100">
                <EditStudentPanel
                  student={selected}
                  onSave={async (updates: { nom?: string; prenom?: string; telephone?: string }) => {
                    try {
                      const updated = await updateUser(selected.id, updates);
                      setEtudiants(prev => prev.map(e => e.id === selected.id ? updated : e));
                      toast('success', 'Etudiant mis à jour');
                    } catch (err) {
                      console.error('Error updating student', err);
                      toast('error', 'Erreur lors de la mise à jour');
                    }
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">Selectionnez un etudiant</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        title="Supprimer l'etudiant"
        message="Êtes-vous sûr de vouloir supprimer cet etudiant ?"
        confirmText="Supprimer"
        cancelText="Annuler"
        isOpen={!!deleteDialog}
        onConfirm={() => deleteDialog && handleDelete(deleteDialog)}
        onCancel={() => setDeleteDialog(null)}
        isDangerous
      />
    </div>
  );
}
