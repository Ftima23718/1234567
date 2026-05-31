import { Link } from 'react-router-dom';
import { Bus, Shield, CreditCard, QrCode, BarChart3, Bell, ArrowRight, Users } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <Bus className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">TransCampus</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">Fonctionnalites</a>
            <a href="#about" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">A propos</a>
            <a href="#contact" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">Contact</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-ghost text-sm">Connexion</Link>
            <Link to="/register" className="btn-primary text-sm">S'inscrire</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 rounded-full mb-6">
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-semibold text-primary-700">Nouvelle plateforme 2025-2026</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
                Gestion simplifiee des{' '}
                <span className="text-primary-600">inscriptions transport</span>{' '}
                universitaire
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-lg">
                Digitalisez et centralisez les inscriptions des etudiants au service de transport.
                Inscription en ligne, validation, paiement et badges - tout en un seul endroit.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/register" className="btn-primary inline-flex items-center gap-2 text-base">
                  Commencer maintenant <ArrowRight className="w-5 h-5" />
                </Link>
                <a href="#features" className="btn-secondary inline-flex items-center gap-2 text-base">
                  Decouvrir les fonctionnalites
                </a>
              </div>
              <div className="flex items-center gap-8 mt-10">
                <div>
                  <p className="text-2xl font-bold text-gray-900">247+</p>
                  <p className="text-sm text-gray-500">Etudiants inscrits</p>
                </div>
                <div className="w-px h-10 bg-gray-200"></div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                  <p className="text-sm text-gray-500">Lignes actives</p>
                </div>
                <div className="w-px h-10 bg-gray-200"></div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">98%</p>
                  <p className="text-sm text-gray-500">Taux de satisfaction</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8">
                <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">Statut d'inscription</h3>
                    <span className="badge-success">Validee</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Bus className="w-5 h-5 text-primary-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Ligne A - Campus Centre</p>
                        <p className="text-xs text-gray-500">Abonnement annuel</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <CreditCard className="w-5 h-5 text-success-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Paiement effectue</p>
                        <p className="text-xs text-gray-500">15 000 DZD</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <QrCode className="w-5 h-5 text-accent-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Badge disponible</p>
                        <p className="text-xs text-gray-500">Telecharger le PDF</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent-100 rounded-full opacity-60 blur-2xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary-200 rounded-full opacity-40 blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Tout ce dont vous avez besoin</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Une plateforme complete pour gerer efficacement le service de transport universitaire</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Users, title: 'Inscription en ligne', desc: 'Les etudiants s\'inscrivent en quelques clics, choisissent leur ligne et leur arret.' },
              { icon: Shield, title: 'Validation securisee', desc: 'Les administrateurs valident ou rejettent les dossiers avec suivi en temps reel.' },
              { icon: CreditCard, title: 'Paiement integre', desc: 'Calcul automatique des tarifs, enregistrement des paiements et generation de recus.' },
              { icon: QrCode, title: 'Badge numerique', desc: 'Generation automatique de badges avec QR code uniques pour chaque etudiant.' },
              { icon: BarChart3, title: 'Rapports & statistiques', desc: 'Tableaux de bord avec KPIs, statistiques par ligne et exportations.' },
              { icon: Bell, title: 'Notifications', desc: 'Alertes automatiques par email pour chaque changement de statut.' },
            ].map((f, i) => (
              <div key={i} className="card p-6 hover:shadow-md transition-shadow group">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
                  <f.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="about" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Comment ca marche ?</h2>
            <p className="text-gray-600">Un processus simple en 4 etapes</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Inscription', desc: 'L\'etudiant cree un compte et remplit le formulaire d\'inscription' },
              { step: '02', title: 'Validation', desc: 'L\'administrateur examine et valide le dossier' },
              { step: '03', title: 'Paiement', desc: 'L\'etudiant regle le montant de son abonnement' },
              { step: '04', title: 'Badge', desc: 'Le badge avec QR code est genere et telechargeable' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-white">{s.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Pret a digitaliser votre service de transport ?</h2>
          <p className="text-primary-100 mb-8 text-lg">Rejoignez les etablissements qui ont choisi la simplification</p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-white text-primary-600 font-semibold py-3 px-8 rounded-lg hover:bg-primary-50 transition-all shadow-lg">
            Creer un compte <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-12 px-6 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                  <Bus className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">TransCampus</span>
              </div>
              <p className="text-sm text-gray-400">Plateforme de gestion des inscriptions au service de transport universitaire</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Liens rapides</h4>
              <ul className="space-y-2">
                <li><Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors">Connexion</Link></li>
                <li><Link to="/register" className="text-sm text-gray-400 hover:text-white transition-colors">Inscription</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Fonctionnalites</h4>
              <ul className="space-y-2">
                <li><span className="text-sm text-gray-400">Inscription en ligne</span></li>
                <li><span className="text-sm text-gray-400">Validation des dossiers</span></li>
                <li><span className="text-sm text-gray-400">Paiement & Badges</span></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-2">
                <li><span className="text-sm text-gray-400">contact@transcampus.dz</span></li>
                <li><span className="text-sm text-gray-400">+213 555 000 000</span></li>
                <li><span className="text-sm text-gray-400">Alger, Algerie</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-sm text-gray-500">2025 TransCampus. Tous droits reserves.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
