import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bus, Eye, EyeOff, Mail, Lock, User, Phone, GraduationCap, CheckCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuthContext';
import { useToast } from '../../components/ui/useToast';

export default function Register() {
  const [form, setForm] = useState({
    nom: '', prenom: '', email: '', telephone: '', password: '', confirmPassword: '',
    numeroEtudiant: '', filiere: '', anneeEtude: '1',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    if (form.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caracteres');
      return;
    }
    setLoading(true);
    const result = await register({
      email: form.email,
      password: form.password,
      nom: form.nom,
      prenom: form.prenom,
      telephone: form.telephone,
      numeroEtudiant: form.numeroEtudiant,
      filiere: form.filiere,
      anneeEtude: parseInt(form.anneeEtude),
    });
    setLoading(false);
    if (result.success) {
      setSuccess(true);
      toast('success', 'Compte cree avec succes ! Vous pouvez maintenant vous connecter.');
    } else {
      setError(result.error || 'Erreur lors de la creation du compte');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-success-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Compte cree avec succes</h2>
          <p className="text-gray-600 mb-6">Votre compte a ete cree. Vous pouvez maintenant vous connecter avec vos identifiants.</p>
          <Link to="/login" className="btn-primary inline-flex items-center gap-2">Se connecter</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="hidden lg:flex lg:w-1/2 bg-primary-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-700 to-primary-900"></div>
        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Bus className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">TransCampus</h1>
              <p className="text-primary-200 text-sm">Gestion du Transport Universitaire</p>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-6">
            Rejoignez la plateforme de transport universitaire
          </h2>
          <p className="text-primary-100 text-lg leading-relaxed">
            Creez votre compte etudiant pour acceder au service de transport. Inscrivez-vous en ligne, suivez votre dossier et obtenez votre badge.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-lg">
          <div className="lg:hidden flex items-center gap-3 mb-6 justify-center">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <Bus className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">TransCampus</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">Creer un compte</h2>
          <p className="text-gray-600 mb-6">Remplissez vos informations pour vous inscrire</p>

          {error && (
            <div className="bg-error-50 border border-error-200 text-error-700 text-sm rounded-lg p-3 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input name="nom" value={form.nom} onChange={handleChange} className="input-field pl-10" placeholder="Nom" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prenom</label>
                <input name="prenom" value={form.prenom} onChange={handleChange} className="input-field" placeholder="Prenom" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresse email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input name="email" type="email" value={form.email} onChange={handleChange} className="input-field pl-11" placeholder="prenom.nom@univ.dz" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telephone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input name="telephone" value={form.telephone} onChange={handleChange} className="input-field pl-11" placeholder="0555 000 000" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Numero etudiant</label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input name="numeroEtudiant" value={form.numeroEtudiant} onChange={handleChange} className="input-field pl-10" placeholder="ETU2025XXX" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filiere</label>
                <input name="filiere" value={form.filiere} onChange={handleChange} className="input-field" placeholder="Informatique" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Annee d'etude</label>
              <select name="anneeEtude" value={form.anneeEtude} onChange={handleChange} className="input-field">
                <option value="1">1ere annee</option>
                <option value="2">2eme annee</option>
                <option value="3">3eme annee</option>
                <option value="4">4eme annee</option>
                <option value="5">5eme annee</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange} className="input-field pl-11 pr-11" placeholder="Min. 6 caracteres" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} className="input-field pl-11" placeholder="Confirmer" required />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Creer mon compte'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Deja un compte ?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
