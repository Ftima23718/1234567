import { useEffect, useState } from 'react';
import { Search, Users, Eye, GraduationCap, Mail, Phone } from 'lucide-react';
import { fetchAllInscriptions } from '../../services/transport';

export default function AdminEtudiants() {
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [etudiants, setEtudiants] = useState<any[]>([]);

  useEffect(() => {
    fetchAllInscriptions().then((data) => setEtudiants(Array.isArray(data) ? data : data.content ?? [])).catch(() => setEtudiants([]));
  }, []);

  const filtered = etudiants.filter((e) =>
    search === '' || `${e.etudiantNom || ''} ${e.etudiantPrenom || ''} ${e.etudiantEmail || ''}`.toLowerCase().includes(search.toLowerCase())
  );

  const selected = filtered.find((e) => e.etudiantId === selectedStudent) || etudiants.find((e) => e.etudiantId === selectedStudent);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestion des etudiants</h1>
        <p className="text-gray-600 mt-1">Consultez et gerez les comptes etudiants</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-11" placeholder="Rechercher par nom, prenom ou numero..." />
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
                  <th className="px-5 py-3">Numero</th>
                  <th className="px-5 py-3">Filiere</th>
                  <th className="px-5 py-3">Annee</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((etu) => (
                  <tr key={etu.id} className={`hover:bg-gray-50 transition-colors cursor-pointer ${selectedStudent === etu.id ? 'bg-primary-50' : ''}`}
                    onClick={() => setSelectedStudent(etu.id)}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-semibold text-primary-700">{(etu.etudiantPrenom || 'E')[0]}{(etu.etudiantNom || 'U')[0]}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{etu.etudiantPrenom} {etu.etudiantNom}</p>
                          <p className="text-xs text-gray-500">{etu.etudiantEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600 font-mono">{etu.id}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{etu.ligneNom}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{etu.typeAbonnement}</td>
                    <td className="px-5 py-4">
                      <button onClick={(e) => { e.stopPropagation(); setSelectedStudent(etu.id); }}
                        className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          {selected ? (
            <div className="p-5 space-y-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-primary-700">{(selected.etudiantPrenom || 'E')[0]}{(selected.etudiantNom || 'U')[0]}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selected.etudiantPrenom} {selected.etudiantNom}</h3>
                  <p className="text-sm text-gray-500">{selected.ligneNom}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{selected.etudiantEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{selected.telephone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{selected.typeAbonnement} - {selected.statut}</span>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">Inscrit le {selected.dateInscription}</p>
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
    </div>
  );
}
