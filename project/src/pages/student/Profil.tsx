import { useEffect, useRef, useState } from 'react';
import { User, Mail, Phone, GraduationCap, Camera, Save } from 'lucide-react';
import { fetchProfile } from '../../services/transport';
import axiosClient from '../../api/axiosClient';

export default function StudentProfil() {
  const [etudiant, setEtudiant] = useState<any>(null);
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    filiere: '',
    anneeEtude: '1',
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchProfile().then((profile) => {
      setEtudiant(profile);
      setPhotoPreview(profile.photoURL || null);
      setForm({
        nom: profile.nom || '',
        prenom: profile.prenom || '',
        email: profile.email || '',
        telephone: profile.telephone || '',
        filiere: profile.filiere || '',
        anneeEtude: String(profile.anneeEtude || 1),
      });
    }).catch(() => setEtudiant(null));
  }, []);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    const preview = URL.createObjectURL(file);
    setPhotoPreview(preview);

    // Upload
    setUploading(true);
    setUploadError('');
    setUploadSuccess(false);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axiosClient.post('/users/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploadSuccess(true);
      setPhotoPreview(response.data.photoURL || preview);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error) {
      console.error('Photo upload failed:', error);
      setUploadError('Erreur lors du téléchargement de la photo');
      setPhotoPreview(null);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mon profil</h1>
        <p className="text-gray-600 mt-1">Modifiez vos informations personnelles</p>
      </div>

      <div className="card">
        {/* Avatar section */}
        <div className="bg-primary-600 p-8 rounded-t-xl relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-700 to-primary-900 opacity-50 rounded-t-xl"></div>
          <div className="relative z-10 flex items-center gap-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30 overflow-hidden">
              {photoPreview ? (
                <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-white">{(etudiant?.prenom || 'E')[0]}{(etudiant?.nom || 'U')[0]}</span>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{form.prenom} {form.nom}</h2>
              <p className="text-primary-200">{etudiant?.numeroEtudiant || ''} - {form.filiere}</p>
            </div>
            <button 
              type="button"
              onClick={handlePhotoClick}
              disabled={uploading}
              className="absolute top-4 right-4 p-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-all disabled:opacity-50"
            >
              {uploading ? (
                <div className="w-5 h-5 animate-spin rounded-full border-2 border-white border-b-transparent"></div>
              ) : (
                <Camera className="w-5 h-5" />
              )}
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoSelect}
            className="hidden"
          />
          {uploadSuccess && (
            <div className="absolute bottom-2 right-2 bg-success-600 text-white px-3 py-1 rounded text-sm">
              ✓ Photo mise à jour
            </div>
          )}
          {uploadError && (
            <div className="absolute bottom-2 right-2 bg-red-600 text-white px-3 py-1 rounded text-sm">
              {uploadError}
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input name="nom" value={form.nom} onChange={handleChange} className="input-field pl-10" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Prenom</label>
              <input name="prenom" value={form.prenom} onChange={handleChange} className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Adresse email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input name="email" type="email" value={form.email} onChange={handleChange} className="input-field pl-11" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Telephone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input name="telephone" value={form.telephone} onChange={handleChange} className="input-field pl-11" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Filiere</label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input name="filiere" value={form.filiere} onChange={handleChange} className="input-field pl-10" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Annee d'etude</label>
              <select name="anneeEtude" value={form.anneeEtude} onChange={handleChange} className="input-field">
                <option value="1">1ere annee</option>
                <option value="2">2eme annee</option>
                <option value="3">3eme annee</option>
                <option value="4">4eme annee</option>
                <option value="5">5eme annee</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <button type="button" className="btn-ghost text-sm">Changer le mot de passe</button>
            <button type="submit" className="btn-primary inline-flex items-center gap-2">
              <Save className="w-4 h-4" /> {saved ? 'Enregistre !' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
