/*
  # Seed Data - TransCampus

  1. Initial Data
    - Default admin user (admin@transcampus.dz / admin123)
    - Sample transport lines (Ligne A, B, C)
    - Sample stops for each line
    - Sample buses
    - Subscription pricing (MENSUEL: 2000 DA, SEMESTRIEL: 10000 DA, ANNUEL: 18000 DA)

  2. Important Notes
    - Admin password is BCrypt-hashed for 'admin123'
    - Lines and stops represent typical university shuttle routes
    - All UUIDs are explicitly set for deterministic seeding
*/

-- Default admin user (password: admin123)
INSERT INTO profiles (id, nom, prenom, email, telephone, password, role) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'Admin', 'TransCampus', 'admin@transcampus.dz', '0550000001', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJYd0m3lOea', 'admin');

-- Tarifs
INSERT INTO tarifs (id, type_abonnement, montant, description) VALUES
    ('c0000000-0000-0000-0000-000000000001', 'MENSUEL', 2000.00, 'Abonnement mensuel pour le transport universitaire'),
    ('c0000000-0000-0000-0000-000000000002', 'SEMESTRIEL', 10000.00, 'Abonnement semestriel - économie de 16%'),
    ('c0000000-0000-0000-0000-000000000003', 'ANNUEL', 18000.00, 'Abonnement annuel - économie de 25%');

-- Lignes
INSERT INTO lignes (id, nom, description, point_depart, point_arrivee, est_active) VALUES
    ('b0000000-0000-0000-0000-000000000001', 'Ligne A - Campus Centre', 'Liaison principale campus centre-ville', 'Gare Centrale', 'Campus Principal', true),
    ('b0000000-0000-0000-0000-000000000002', 'Ligne B - Campus Nord', 'Liaison vers le campus nord', 'Place de la République', 'Campus Nord', true),
    ('b0000000-0000-0000-0000-000000000003', 'Ligne C - Campus Sud', 'Liaison vers le campus sud', 'Marché Central', 'Campus Sud', true);

-- Arrets pour Ligne A
INSERT INTO arrets (id, nom, adresse, ordre, ligne_id) VALUES
    ('d0000001-0000-0000-0000-000000000001', 'Gare Centrale', '1 Rue de la Gare', 1, 'b0000000-0000-0000-0000-000000000001'),
    ('d0000002-0000-0000-0000-000000000001', 'Place Emir', '5 Boulevard Emir', 2, 'b0000000-0000-0000-0000-000000000001'),
    ('d0000003-0000-0000-0000-000000000001', 'Faculté Droit', '12 Rue Université', 3, 'b0000000-0000-0000-0000-000000000001'),
    ('d0000004-0000-0000-0000-000000000001', 'Résidence Universitaire', '8 Cité Universitaire', 4, 'b0000000-0000-0000-0000-000000000001'),
    ('d0000005-0000-0000-0000-000000000001', 'Campus Principal', '2 Route du Campus', 5, 'b0000000-0000-0000-0000-000000000001');

-- Arrets pour Ligne B
INSERT INTO arrets (id, nom, adresse, ordre, ligne_id) VALUES
    ('d0000006-0000-0000-0000-000000000001', 'Place République', '3 Place de la République', 1, 'b0000000-0000-0000-0000-000000000002'),
    ('d0000007-0000-0000-0000-000000000001', 'Hôpital Central', '15 Rue de l''Hôpital', 2, 'b0000000-0000-0000-0000-000000000002'),
    ('d0000008-0000-0000-0000-000000000001', 'Campus Nord', '5 Route du Nord', 3, 'b0000000-0000-0000-0000-000000000002');

-- Arrets pour Ligne C
INSERT INTO arrets (id, nom, adresse, ordre, ligne_id) VALUES
    ('d0000009-0000-0000-0000-000000000001', 'Marché Central', '10 Rue du Marché', 1, 'b0000000-0000-0000-0000-000000000003'),
    ('d0000010-0000-0000-0000-000000000001', 'Lycée Technique', '7 Rue du Lycée', 2, 'b0000000-0000-0000-0000-000000000003'),
    ('d0000011-0000-0000-0000-000000000001', 'Campus Sud', '3 Route du Sud', 3, 'b0000000-0000-0000-0000-000000000003');

-- Bus
INSERT INTO bus (id, immatriculation, marque, modele, capacite, places_disponibles, statut, ligne_id) VALUES
    ('e0000001-0000-0000-0000-000000000001', 'TC-001-A', 'Mercedes', 'Citaro', 60, 60, 'ACTIF', 'b0000000-0000-0000-0000-000000000001'),
    ('e0000002-0000-0000-0000-000000000001', 'TC-002-A', 'Mercedes', 'Citaro', 60, 55, 'ACTIF', 'b0000000-0000-0000-0000-000000000001'),
    ('e0000003-0000-0000-0000-000000000001', 'TC-003-B', 'Iveco', 'Urbanway', 50, 50, 'ACTIF', 'b0000000-0000-0000-0000-000000000002'),
    ('e0000004-0000-0000-0000-000000000001', 'TC-004-C', 'Iveco', 'Urbanway', 50, 48, 'ACTIF', 'b0000000-0000-0000-0000-000000000003'),
    ('e0000005-0000-0000-0000-000000000001', 'TC-005-M', 'Renault', 'R312', 40, 40, 'EN_MAINTENANCE', NULL);
