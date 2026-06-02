package dz.univ.transcampus.config;

import dz.univ.transcampus.entity.*;
import dz.univ.transcampus.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UtilisateurRepository utilisateurRepository;
    private final EtudiantRepository etudiantRepository;
    private final ChauffeurRepository chauffeurRepository;
    private final LigneRepository ligneRepository;
    private final ArretRepository arretRepository;
    private final BusRepository busRepository;
    private final TrajetRepository trajetRepository;
    private final TarifRepository tarifRepository;
    private final InscriptionRepository inscriptionRepository;
    private final PaiementRepository paiementRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        System.out.println("\n🔄 DataInitializer starting...");
        
        if (isDatabaseEmpty()) {
            System.out.println("📊 Database is empty. Seeding demo data...");
            seedDemoData();
        } else if (trajetRepository.count() == 0) {
            System.out.println("📊 Database contains users and routes but no trajets. Seeding driver trajets...");
            seedDriverTrajets();
        } else {
            System.out.println("✅ Database already contains data and trajets. Skipping seeding.");
        }

        ensureDefaultAdminExists();
        System.out.println("✅ DataInitializer completed successfully!\n");
    }

    private void seedDriverTrajets() {
        if (utilisateurRepository.findByEmail("chauffeur1@transcampus.dz").isEmpty()
                || utilisateurRepository.findByEmail("chauffeur2@transcampus.dz").isEmpty()
                || ligneRepository.count() < 2
                || busRepository.count() < 3) {
            System.out.println("ℹ️ Insufficient data to create driver trajets. Please verify chauffeurs, lignes, and buses exist.");
            return;
        }

        Utilisateur chauffeur1User = utilisateurRepository.findByEmail("chauffeur1@transcampus.dz").orElseThrow();
        Chauffeur chauffeur1 = chauffeurRepository.findById(chauffeur1User.getId()).orElseThrow();

        Utilisateur chauffeur2User = utilisateurRepository.findByEmail("chauffeur2@transcampus.dz").orElseThrow();
        Chauffeur chauffeur2 = chauffeurRepository.findById(chauffeur2User.getId()).orElseThrow();

        List<Ligne> lignes = ligneRepository.findAll();
        List<Bus> buses = busRepository.findAll();
        if (lignes.size() < 2 || buses.size() < 3) {
            System.out.println("ℹ️ Pas assez de lignes ou de bus pour créer les trajets.");
            return;
        }

        Trajet trajet1 = new Trajet();
        trajet1.setLigne(lignes.get(0));
        trajet1.setBus(buses.get(0));
        trajet1.setChauffeur(chauffeur1);
        trajet1.setHeureDepart("07:30");
        trajet1.setHeureArrivee("08:15");
        trajet1.setPlacesDisponibles(buses.get(0).getCapacite());
        trajet1.setJoursSemaine(List.of("Lun", "Mar", "Mer", "Jeu", "Ven"));

        Trajet trajet2 = new Trajet();
        trajet2.setLigne(lignes.get(1));
        trajet2.setBus(buses.get(2));
        trajet2.setChauffeur(chauffeur2);
        trajet2.setHeureDepart("08:00");
        trajet2.setHeureArrivee("08:45");
        trajet2.setPlacesDisponibles(buses.get(2).getCapacite());
        trajet2.setJoursSemaine(List.of("Lun", "Mar", "Mer", "Jeu", "Ven"));

        trajetRepository.saveAllAndFlush(List.of(trajet1, trajet2));
        System.out.println("   ✓ Trajets created: 2 trajets (chauffeur1 → Ligne A, chauffeur2 → Ligne B)");
    }

    private boolean isDatabaseEmpty() {
        return utilisateurRepository.count() == 0
                && ligneRepository.count() == 0
                && arretRepository.count() == 0
                && busRepository.count() == 0
                && tarifRepository.count() == 0
                && inscriptionRepository.count() == 0
                && paiementRepository.count() == 0;
    }

    private void seedDemoData() {
        System.out.println("🌱 Starting database seeding...");
        String defaultPassword = "password123";
        String encodedPassword = passwordEncoder.encode(defaultPassword);

        // Create Admin
        System.out.println("👤 Creating admin user...");
        createAndPersistAdmin(encodedPassword);
        System.out.println("   ✓ Admin created: admin@transcampus.dz");

        // Create Responsables
        System.out.println("👥 Creating responsable users...");
        createAndPersistResponsible("Benali", "Rachid", "responsable@transcampus.dz", "0550000002", encodedPassword);
        System.out.println("   ✓ Responsable created: responsable@transcampus.dz");

        // Create Drivers (2 drivers as per requirements)
        System.out.println("🚗 Creating driver users...");
        createAndPersistDriver("Hadj", "Mohamed", "chauffeur1@transcampus.dz", "0661000001", encodedPassword, "PERM-2024-001");
        createAndPersistDriver("Slimani", "Ali", "chauffeur2@transcampus.dz", "0661000002", encodedPassword, "PERM-2024-002");
        System.out.println("   ✓ Drivers created: 2 users");

        // Create Students (exactly as specified)
        System.out.println("🎓 Creating student users...");
        List<Utilisateur> students = new ArrayList<>();
        students.add(createAndPersistStudent("Benali", "Ahmed", "ahmed@univ.dz", "0555000001", encodedPassword, "ETU2024001", "Informatique", 3));
        students.add(createAndPersistStudent("Kaci", "Fatima", "fatima@univ.dz", "0555000002", encodedPassword, "ETU2024002", "Mathematiques", 2));
        students.add(createAndPersistStudent("Boudiaf", "Youcef", "youcef@univ.dz", "0555000003", encodedPassword, "ETU2024003", "Physique", 1));
        students.add(createAndPersistStudent("Merad", "Sara", "sara@univ.dz", "0555000004", encodedPassword, "ETU2024004", "Chimie", 4));
        students.add(createAndPersistStudent("Zeroual", "Karim", "karim@univ.dz", "0555000005", encodedPassword, "ETU2024005", "Electronique", 2));
        students.add(createAndPersistStudent("Cherif", "Amina", "amina@univ.dz", "0555000006", encodedPassword, "ETU2024006", "Informatique", 1));
        System.out.println("   ✓ Students created: " + students.size() + " users");

        // Create Lines
        System.out.println("🛣️  Creating lines (Lignes)...");
        List<Ligne> lignes = List.of(
                createLigne("Ligne A - Campus Centre", "Liaison centre-ville / campus principal", "Place des Martyrs", "Campus Principal"),
                createLigne("Ligne B - Campus Sud", "Liaison gare sud / campus sciences", "Gare Sud", "Campus Sciences"),
                createLigne("Ligne C - Inter-Campus", "Liaison campus principal / campus technologie", "Campus Principal", "Campus Technologie")
        );
        ligneRepository.saveAllAndFlush(lignes);
        System.out.println("   ✓ Lines created: " + ligneRepository.count() + " lines");

        // Create Stops (3 per ligne)
        System.out.println("🚏 Creating stops (Arrets)...");
        List<Arret> arrets = List.of(
                createArret("Place des Martyrs", "Place des Martyrs, Centre", 1, lignes.get(0)),
                createArret("Hopital Central", "Rue de l'Hopital", 2, lignes.get(0)),
                createArret("Campus Principal", "Campus Principal", 3, lignes.get(0)),
                createArret("Gare Sud", "Gare Routiere Sud", 1, lignes.get(1)),
                createArret("Marche Central", "Marche Central", 2, lignes.get(1)),
                createArret("Campus Sciences", "Campus Sciences", 3, lignes.get(1)),
                createArret("Campus Principal", "Campus Principal", 1, lignes.get(2)),
                createArret("Campus Technologie", "Campus Technologie", 2, lignes.get(2)),
                createArret("Bibliotheque", "Bibliotheque Universitaire", 3, lignes.get(2))
        );
        arretRepository.saveAllAndFlush(arrets);
        System.out.println("   ✓ Stops created: " + arretRepository.count() + " stops");

        // Create Buses (2 per ligne)
        System.out.println("🚌 Creating buses...");
        List<Bus> buses = List.of(
                createBus("TRAN-001", "Mercedes", "Citaro", 50, Bus.StatutBus.ACTIF, lignes.get(0)),
                createBus("TRAN-002", "MAN", "Lion City", 45, Bus.StatutBus.ACTIF, lignes.get(0)),
                createBus("TRAN-003", "Volvo", "7900", 55, Bus.StatutBus.ACTIF, lignes.get(1)),
                createBus("TRAN-004", "Iveco", "Urbanway", 40, Bus.StatutBus.ACTIF, lignes.get(1)),
                createBus("TRAN-005", "Mercedes", "Citaro", 50, Bus.StatutBus.ACTIF, lignes.get(2)),
                createBus("TRAN-006", "MAN", "Lion City", 45, Bus.StatutBus.ACTIF, lignes.get(2))
        );
        busRepository.saveAllAndFlush(buses);
        System.out.println("   ✓ Buses created: " + busRepository.count() + " buses");

        // Create Trajets (Driver assignments)
        System.out.println("🗓️ Creating trajets (driver assignments)...");
        Utilisateur chauffeur1User = utilisateurRepository.findByEmail("chauffeur1@transcampus.dz").orElseThrow();
        Chauffeur chauffeur1 = chauffeurRepository.findById(chauffeur1User.getId()).orElseThrow();

        Utilisateur chauffeur2User = utilisateurRepository.findByEmail("chauffeur2@transcampus.dz").orElseThrow();
        Chauffeur chauffeur2 = chauffeurRepository.findById(chauffeur2User.getId()).orElseThrow();

        // Trajet 1 — Ligne A, assigned to chauffeur1
        Trajet trajet1 = new Trajet();
        trajet1.setLigne(lignes.get(0));
        trajet1.setBus(buses.get(0));
        trajet1.setChauffeur(chauffeur1);
        trajet1.setHeureDepart("07:30");
        trajet1.setHeureArrivee("08:15");
        trajet1.setPlacesDisponibles(buses.get(0).getCapacite());
        trajet1.setJoursSemaine(List.of("Lun", "Mar", "Mer", "Jeu", "Ven"));

        // Trajet 2 — Ligne B, assigned to chauffeur2
        Trajet trajet2 = new Trajet();
        trajet2.setLigne(lignes.get(1));
        trajet2.setBus(buses.get(2));
        trajet2.setChauffeur(chauffeur2);
        trajet2.setHeureDepart("08:00");
        trajet2.setHeureArrivee("08:45");
        trajet2.setPlacesDisponibles(buses.get(2).getCapacite());
        trajet2.setJoursSemaine(List.of("Lun", "Mar", "Mer", "Jeu", "Ven"));

        List<Trajet> trajets = List.of(trajet1, trajet2);
        trajetRepository.saveAllAndFlush(trajets);
        System.out.println("   ✓ Trajets created: 2 trajets (chauffeur1 → Ligne A, chauffeur2 → Ligne B)");

        // Create Tariffs
        System.out.println("💰 Creating tariffs...");
        List<Tarif> tarifs = List.of(
                createTarif(Inscription.TypeAbonnement.MENSUEL, new BigDecimal("2000"), "Abonnement mensuel"),
                createTarif(Inscription.TypeAbonnement.SEMESTRIEL, new BigDecimal("10000"), "Abonnement semestriel"),
                createTarif(Inscription.TypeAbonnement.ANNUEL, new BigDecimal("18000"), "Abonnement annuel")
        );
        tarifRepository.saveAllAndFlush(tarifs);
        System.out.println("   ✓ Tariffs created: " + tarifRepository.count() + " tariffs");

        // Create Inscriptions with Paiements
        System.out.println("📝 Creating inscriptions and payments...");

        // Ahmed → Ligne A, ANNUEL, VALIDEE, PAYE
        Inscription insc1 = createInscription(students.get(0), lignes.get(0), arrets.get(0), Inscription.TypeAbonnement.ANNUEL, Inscription.StatutInscription.VALIDEE);
        insc1 = inscriptionRepository.saveAndFlush(insc1);
        createPaiement(insc1, students.get(0), new BigDecimal("18000"), Paiement.ModePaiement.ESPECES, Paiement.StatutPaiement.PAYE, "PAY-1001");

        // Fatima → Ligne B, SEMESTRIEL, VALIDEE, PAYE
        Inscription insc2 = createInscription(students.get(1), lignes.get(1), arrets.get(4), Inscription.TypeAbonnement.SEMESTRIEL, Inscription.StatutInscription.VALIDEE);
        insc2 = inscriptionRepository.saveAndFlush(insc2);
        createPaiement(insc2, students.get(1), new BigDecimal("10000"), Paiement.ModePaiement.VIREMENT, Paiement.StatutPaiement.PAYE, "PAY-1002");

        // Youcef → Ligne A, MENSUEL, EN_ATTENTE, EN_ATTENTE
        Inscription insc3 = createInscription(students.get(2), lignes.get(0), arrets.get(1), Inscription.TypeAbonnement.MENSUEL, Inscription.StatutInscription.EN_ATTENTE);
        insc3 = inscriptionRepository.saveAndFlush(insc3);
        createPaiement(insc3, students.get(2), new BigDecimal("2000"), Paiement.ModePaiement.VIREMENT, Paiement.StatutPaiement.EN_ATTENTE, "PAY-1003");

        // Sara → Ligne C, ANNUEL, EN_ATTENTE, EN_ATTENTE
        Inscription insc4 = createInscription(students.get(3), lignes.get(2), arrets.get(7), Inscription.TypeAbonnement.ANNUEL, Inscription.StatutInscription.EN_ATTENTE);
        insc4 = inscriptionRepository.saveAndFlush(insc4);
        createPaiement(insc4, students.get(3), new BigDecimal("18000"), Paiement.ModePaiement.ESPECES, Paiement.StatutPaiement.EN_ATTENTE, "PAY-1004");

        // Add a few more inscriptions for other students
        Inscription insc5 = createInscription(students.get(4), lignes.get(1), arrets.get(3), Inscription.TypeAbonnement.SEMESTRIEL, Inscription.StatutInscription.VALIDEE);
        insc5 = inscriptionRepository.saveAndFlush(insc5);
        createPaiement(insc5, students.get(4), new BigDecimal("10000"), Paiement.ModePaiement.VIREMENT, Paiement.StatutPaiement.PAYE, "PAY-1005");

        Inscription insc6 = createInscription(students.get(5), lignes.get(0), arrets.get(2), Inscription.TypeAbonnement.MENSUEL, Inscription.StatutInscription.VALIDEE);
        insc6 = inscriptionRepository.saveAndFlush(insc6);
        createPaiement(insc6, students.get(5), new BigDecimal("2000"), Paiement.ModePaiement.ESPECES, Paiement.StatutPaiement.PAYE, "PAY-1006");

        System.out.println("   ✓ Inscriptions created: " + inscriptionRepository.count() + " inscriptions");

        // Create Notifications
        System.out.println("🔔 Creating notifications...");
        Utilisateur adminUser = utilisateurRepository.findByEmail("admin@transcampus.dz").orElseThrow();
        Utilisateur responsableUser = utilisateurRepository.findByEmail("responsable@transcampus.dz").orElseThrow();
        
        Notification notif1 = new Notification();
        notif1.setUtilisateur(adminUser);
        notif1.setMessage("Bienvenue sur TransCampus ! Le système est opérationnel.");
        notif1.setType(Notification.Type.info);
        notif1.setEstLue(false);
        notificationRepository.save(notif1);

        Notification notif2 = new Notification();
        notif2.setUtilisateur(responsableUser);
        notif2.setMessage("Nouvelle inscription en attente de validation.");
        notif2.setType(Notification.Type.warning);
        notif2.setEstLue(false);
        notificationRepository.save(notif2);

        Notification notif3 = new Notification();
        notif3.setUtilisateur(adminUser);
        notif3.setMessage("Rapports mensuels disponibles pour consultation.");
        notif3.setType(Notification.Type.info);
        notif3.setEstLue(false);
        notificationRepository.save(notif3);

        System.out.println("   ✓ Notifications created");

        // Summary
        System.out.println("\n✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!");
        System.out.println("═══════════════════════════════════════════════");
        System.out.println("📊 SUMMARY:");
        System.out.println("   👤 Utilisateurs: " + utilisateurRepository.count());
        System.out.println("   🛣️  Lignes: " + ligneRepository.count());
        System.out.println("   🚏 Arrets: " + arretRepository.count());
        System.out.println("   🚌 Bus: " + busRepository.count());
        System.out.println("   🗓️ Trajets: " + trajetRepository.count());
        System.out.println("   💰 Tarifs: " + tarifRepository.count());
        System.out.println("   📝 Inscriptions: " + inscriptionRepository.count());
        System.out.println("   💳 Paiements: " + paiementRepository.count());
        System.out.println("   🔔 Notifications: " + notificationRepository.count());
        System.out.println("═══════════════════════════════════════════════");
        System.out.println("\n🔑 LOGIN CREDENTIALS:");
        System.out.println("   Admin        : admin@transcampus.dz / " + defaultPassword);
        System.out.println("   Responsables : responsable@transcampus.dz / " + defaultPassword);
        System.out.println("   Chauffeurs   : chauffeur1@transcampus.dz / " + defaultPassword);
        System.out.println("   Étudiants    : ahmed@univ.dz / " + defaultPassword);
        System.out.println("═══════════════════════════════════════════════\n");
    }

    private void ensureDefaultAdminExists() {
        String defaultPassword = "password123";
        if (utilisateurRepository.findByEmail("admin@transcampus.dz").isPresent()) {
            System.out.println("ℹ️ Compte Admin existant : admin@transcampus.dz / " + defaultPassword);
            return;
        }

        Utilisateur admin = createAndPersistAdmin(passwordEncoder.encode(defaultPassword));
        System.out.println("✅ Compte Admin créé automatiquement : admin@transcampus.dz / " + defaultPassword);
    }

    private Utilisateur createAndPersistAdmin(String encodedPassword) {
        Utilisateur admin = createUser("Admin", "TransCampus", "admin@transcampus.dz", "0550000001", encodedPassword, Utilisateur.Role.ADMIN);
        return utilisateurRepository.saveAndFlush(admin);
    }

    private Utilisateur createAndPersistResponsible(String nom, String prenom, String email, String telephone, String encodedPassword) {
        Utilisateur user = createUser(nom, prenom, email, telephone, encodedPassword, Utilisateur.Role.RESPONSIBLE);
        return utilisateurRepository.saveAndFlush(user);
    }

    private Utilisateur createAndPersistDriver(String nom, String prenom, String email, String telephone, String encodedPassword, String numeroPermis) {
        Utilisateur user = createUser(nom, prenom, email, telephone, encodedPassword, Utilisateur.Role.DRIVER);
        user = utilisateurRepository.saveAndFlush(user);

        Chauffeur chauffeur = new Chauffeur();
        chauffeur.setId(user.getId());
        chauffeur.setNumeroPermis(numeroPermis);
        chauffeur.setUtilisateur(user);
        user.setChauffeur(chauffeur);

        return utilisateurRepository.saveAndFlush(user);
    }

    private Utilisateur createAndPersistStudent(String nom, String prenom, String email, String telephone, String encodedPassword,
                                                String numeroEtudiant, String filiere, int anneeEtude) {
        Utilisateur user = createUser(nom, prenom, email, telephone, encodedPassword, Utilisateur.Role.STUDENT);
        user = utilisateurRepository.saveAndFlush(user);

        Etudiant etudiant = new Etudiant();
        etudiant.setId(user.getId());
        etudiant.setNumeroEtudiant(numeroEtudiant);
        etudiant.setFiliere(filiere);
        etudiant.setAnneeEtude(anneeEtude);
        etudiant.setUtilisateur(user);
        user.setEtudiant(etudiant);

        return utilisateurRepository.saveAndFlush(user);
    }

    private Utilisateur createUser(String nom, String prenom, String email, String telephone, String encodedPassword, Utilisateur.Role role) {
        Utilisateur user = new Utilisateur();
        user.setNom(nom);
        user.setPrenom(prenom);
        user.setEmail(email);
        user.setTelephone(telephone);
        user.setPassword(encodedPassword);
        user.setRole(role);
        return user;
    }

    private Ligne createLigne(String nom, String description, String depart, String arrivee) {
        Ligne ligne = new Ligne();
        ligne.setNom(nom);
        ligne.setDescription(description);
        ligne.setPointDepart(depart);
        ligne.setPointArrivee(arrivee);
        ligne.setEstActive(true);
        return ligne;
    }

    private Arret createArret(String nom, String adresse, int ordre, Ligne ligne) {
        Arret arret = new Arret();
        arret.setNom(nom);
        arret.setAdresse(adresse);
        arret.setOrdre(ordre);
        arret.setLigne(ligne);
        return arret;
    }

    private Bus createBus(String immatriculation, String marque, String modele, int capacite, Bus.StatutBus statut, Ligne ligne) {
        Bus bus = new Bus();
        bus.setImmatriculation(immatriculation);
        bus.setMarque(marque);
        bus.setModele(modele);
        bus.setCapacite(capacite);
        bus.setPlacesDisponibles(capacite);
        bus.setStatut(statut);
        bus.setLigne(ligne);
        return bus;
    }

    private Tarif createTarif(Inscription.TypeAbonnement typeAbonnement, BigDecimal montant, String description) {
        Tarif tarif = new Tarif();
        tarif.setTypeAbonnement(typeAbonnement);
        tarif.setMontant(montant);
        tarif.setDescription(description);
        return tarif;
    }

    private Inscription createInscription(Utilisateur etudiant, Ligne ligne, Arret arret, Inscription.TypeAbonnement typeAbonnement, Inscription.StatutInscription statut) {
        Inscription inscription = new Inscription();
        inscription.setEtudiant(etudiant);
        inscription.setLigne(ligne);
        inscription.setArret(arret);
        inscription.setTypeAbonnement(typeAbonnement);
        inscription.setStatut(statut);
        inscription.setDateDebut(LocalDate.now().minusDays(5));
        inscription.setDateFin(LocalDate.now().plusDays(90));
        return inscription;
    }

    private Paiement createPaiement(Inscription inscription, Utilisateur etudiant, BigDecimal montant, Paiement.ModePaiement modePaiement, Paiement.StatutPaiement statut, String referenceTransaction) {
        Paiement paiement = new Paiement();
        paiement.setInscription(inscription);
        paiement.setEtudiant(etudiant);
        paiement.setMontant(montant);
        paiement.setModePaiement(modePaiement);
        paiement.setStatut(statut);
        paiement.setReferenceTransaction(referenceTransaction);
        paiementRepository.saveAndFlush(paiement);
        return paiement;
    }
}