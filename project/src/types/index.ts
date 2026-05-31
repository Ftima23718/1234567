export type UserRole = 'student' | 'admin' | 'responsible' | 'driver';

export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: UserRole;
  telephone: string;
  dateCreation: string;
}

export interface Etudiant extends User {
  numeroEtudiant: string;
  filiere: string;
  anneeEtude: number;
  photoURL: string;
  carteEtudianteURL: string;
}

export interface Chauffeur extends User {
  numeroPermis: string;
}

export type InscriptionStatut = 'EN_ATTENTE' | 'VALIDEE' | 'REJETEE' | 'EXPIREE';
export type TypeAbonnement = 'MENSUEL' | 'SEMESTRIEL' | 'ANNUEL';
export type PaiementStatut = 'EN_ATTENTE' | 'PAYE' | 'ANNULE';
export type PaiementMode = 'ESPECES' | 'VIREMENT';

export interface Inscription {
  id: string;
  etudiantId: string;
  etudiantNom: string;
  etudiantPrenom: string;
  ligneId: string;
  ligneNom: string;
  arretId: string;
  arretNom: string;
  typeAbonnement: TypeAbonnement;
  statut: InscriptionStatut;
  dateInscription: string;
  dateDebut: string;
  dateFin: string;
  motifRejet?: string;
  paiementStatut: PaiementStatut;
  badgeGenere: boolean;
}

export interface Ligne {
  id: string;
  nom: string;
  description: string;
  pointDepart: string;
  pointArrivee: string;
  estActive: boolean;
  arretsCount: number;
  busCount: number;
}

export interface Arret {
  id: string;
  nom: string;
  adresse: string;
  ordre: number;
  ligneId: string;
}

export interface Bus {
  id: string;
  immatriculation: string;
  marque: string;
  modele: string;
  capacite: number;
  placesDisponibles: number;
  statut: 'ACTIF' | 'EN_MAINTENANCE' | 'HORS_SERVICE';
  ligneId: string;
}

export interface Trajet {
  id: string;
  ligneId: string;
  ligneNom: string;
  busId: string;
  busImmatriculation: string;
  chauffeurId: string;
  chauffeurNom: string;
  heureDepart: string;
  heureArrivee: string;
  joursSemaine: string[];
  placesDisponibles: number;
}

export interface Paiement {
  id: string;
  inscriptionId: string;
  etudiantNom: string;
  etudiantPrenom: string;
  montant: number;
  datePaiement: string;
  modePaiement: PaiementMode;
  statut: PaiementStatut;
  referenceTransaction: string;
}

export interface Badge {
  id: string;
  inscriptionId: string;
  etudiantNom: string;
  etudiantPrenom: string;
  codeQR: string;
  dateExpiration: string;
  estValide: boolean;
  ligneNom: string;
}

export interface Notification {
  id: string;
  type: string;
  message: string;
  dateEnvoi: string;
  estLue: boolean;
}

export interface Tarif {
  id: string;
  typeAbonnement: TypeAbonnement;
  montant: number;
  description: string;
}

export interface DashboardKPI {
  totalInscrits: number;
  inscriptionsEnAttente: number;
  inscriptionsValidees: number;
  revenusTotal: number;
  lignesActives: number;
  busActifs: number;
  tauxRemplissage: number;
}
