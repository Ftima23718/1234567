/*
  # Initial Schema - TransCampus Transport Registration System

  1. New Tables
    - `profiles` — Users with role-based access (student, admin, responsible, driver)
    - `etudiants` — Student details linked to profiles via shared PK
    - `chauffeurs` — Driver details linked to profiles via shared PK
    - `lignes` — Transport lines with departure/arrival points
    - `arrets` — Stops ordered along a line
    - `bus` — Vehicles with status tracking (ACTIF, EN_MAINTENANCE, HORS_SERVICE)
    - `trajets` — Scheduled trips linking line, bus, and driver
    - `trajet_jours` — Days of the week for each trip
    - `inscriptions` — Student registrations for transport with status workflow
    - `paiements` — Payment records for inscriptions
    - `badges` — QR code badges for validated inscriptions
    - `tarifs` — Pricing for subscription types
    - `notifications` — User notifications with read status

  2. Security
    - All tables use UUID primary keys
    - Foreign key constraints enforce referential integrity
    - Unique constraints prevent duplicate email, student number, permit, registration, QR code

  3. Important Notes
    - `etudiants` and `chauffeurs` share PK with `profiles` (@MapsId pattern)
    - `inscriptions.statut` workflow: EN_ATTENTE -> VALIDEE/REJETEE -> EXPIREE
    - `badges.est_valide` combined with `date_expiration` determines effective validity
    - Default admin user seeded with BCrypt-hashed password
*/

-- PROFILES (Utilisateurs)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    telephone VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'student',
    date_creation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ETUDIANTS (shared PK with profiles)
CREATE TABLE IF NOT EXISTS etudiants (
    id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    numero_etudiant VARCHAR(255) NOT NULL UNIQUE,
    filiere VARCHAR(255) NOT NULL,
    annee_etude INTEGER NOT NULL DEFAULT 1,
    photo_url VARCHAR(255),
    carte_etudiante_url VARCHAR(255)
);

-- CHAUFFEURS (shared PK with profiles)
CREATE TABLE IF NOT EXISTS chauffeurs (
    id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    numero_permis VARCHAR(255) NOT NULL UNIQUE
);

-- LIGNES
CREATE TABLE IF NOT EXISTS lignes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom VARCHAR(255) NOT NULL,
    description TEXT,
    point_depart VARCHAR(255) NOT NULL,
    point_arrivee VARCHAR(255) NOT NULL,
    est_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ARRETS
CREATE TABLE IF NOT EXISTS arrets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom VARCHAR(255) NOT NULL,
    adresse VARCHAR(255),
    ordre INTEGER NOT NULL DEFAULT 1,
    coordonnees VARCHAR(255),
    ligne_id UUID NOT NULL REFERENCES lignes(id) ON DELETE CASCADE
);

-- BUS
CREATE TABLE IF NOT EXISTS bus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    immatriculation VARCHAR(255) NOT NULL UNIQUE,
    marque VARCHAR(255) NOT NULL,
    modele VARCHAR(255) NOT NULL,
    capacite INTEGER NOT NULL DEFAULT 50,
    places_disponibles INTEGER NOT NULL DEFAULT 50,
    statut VARCHAR(30) NOT NULL DEFAULT 'ACTIF',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ligne_id UUID REFERENCES lignes(id)
);

-- TRAJETS
CREATE TABLE IF NOT EXISTS trajets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    heure_depart VARCHAR(10) NOT NULL,
    heure_arrivee VARCHAR(10) NOT NULL,
    places_disponibles INTEGER NOT NULL DEFAULT 50,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ligne_id UUID NOT NULL REFERENCES lignes(id) ON DELETE CASCADE,
    bus_id UUID REFERENCES bus(id),
    chauffeur_id UUID REFERENCES chauffeurs(id)
);

-- TRAJET JOURS (element collection)
CREATE TABLE IF NOT EXISTS trajet_jours (
    trajet_id UUID NOT NULL REFERENCES trajets(id) ON DELETE CASCADE,
    jours_semaine VARCHAR(20) NOT NULL
);

-- INSCRIPTIONS
CREATE TABLE IF NOT EXISTS inscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type_abonnement VARCHAR(20) NOT NULL,
    statut VARCHAR(20) NOT NULL DEFAULT 'EN_ATTENTE',
    date_inscription TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    motif_rejet TEXT,
    etudiant_id UUID NOT NULL REFERENCES profiles(id),
    ligne_id UUID NOT NULL REFERENCES lignes(id),
    arret_id UUID NOT NULL REFERENCES arrets(id)
);

-- PAIEMENTS
CREATE TABLE IF NOT EXISTS paiements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    montant DECIMAL(12,2) NOT NULL,
    date_paiement TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    mode_paiement VARCHAR(20) NOT NULL DEFAULT 'ESPECES',
    statut VARCHAR(20) NOT NULL DEFAULT 'EN_ATTENTE',
    reference_transaction VARCHAR(255) UNIQUE,
    inscription_id UUID NOT NULL UNIQUE REFERENCES inscriptions(id) ON DELETE CASCADE,
    etudiant_id UUID NOT NULL REFERENCES profiles(id)
);

-- BADGES
CREATE TABLE IF NOT EXISTS badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code_qr VARCHAR(255) NOT NULL UNIQUE,
    date_expiration DATE NOT NULL,
    est_valide BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    inscription_id UUID NOT NULL UNIQUE REFERENCES inscriptions(id) ON DELETE CASCADE,
    etudiant_id UUID NOT NULL REFERENCES profiles(id)
);

-- TARIFS
CREATE TABLE IF NOT EXISTS tarifs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type_abonnement VARCHAR(20) NOT NULL UNIQUE,
    montant DECIMAL(12,2) NOT NULL,
    description TEXT
);

-- NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(20) NOT NULL DEFAULT 'info',
    message TEXT NOT NULL,
    date_envoi TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    est_lue BOOLEAN NOT NULL DEFAULT false,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_arrets_ligne ON arrets(ligne_id);
CREATE INDEX IF NOT EXISTS idx_bus_ligne ON bus(ligne_id);
CREATE INDEX IF NOT EXISTS idx_trajets_ligne ON trajets(ligne_id);
CREATE INDEX IF NOT EXISTS idx_trajets_chauffeur ON trajets(chauffeur_id);
CREATE INDEX IF NOT EXISTS idx_inscriptions_etudiant ON inscriptions(etudiant_id);
CREATE INDEX IF NOT EXISTS idx_inscriptions_statut ON inscriptions(statut);
CREATE INDEX IF NOT EXISTS idx_paiements_etudiant ON paiements(etudiant_id);
CREATE INDEX IF NOT EXISTS idx_badges_etudiant ON badges(etudiant_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
