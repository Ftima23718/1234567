package dz.univ.transcampus.config;

import dz.univ.transcampus.entity.*;
import dz.univ.transcampus.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

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
    private final TarifRepository tarifRepository;
    private final InscriptionRepository inscriptionRepository;
    private final PaiementRepository paiementRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        System.out.println("\n🔄 DataInitializer starting...");
        
        if (isDatabaseEmpty()) {
            System.out.println("📊 Database is empty. Seeding demo data...");
            seedDemoData();
        } else {
            System.out.println("✅ Database already contains data. Skipping seeding.");
        }

        ensureDefaultAdminExists();
        System.out.println("✅ DataInitializer completed successfully!\n");
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

        List<Utilisateur> createdUsers = new ArrayList<>();

        // Create Admin
        System.out.println("👤 Creating admin user...");
        createdUsers.add(createAndPersistAdmin(encodedPassword));
        System.out.println("   ✓ Admin created: admin@transcampus.dz");

        // Create Responsables
        System.out.println("👥 Creating responsable users...");
        createdUsers.add(createAndPersistResponsible("Benali", "Rachid", "responsable@transcampus.dz", "0550000002", encodedPassword));
        createdUsers.add(createAndPersistResponsible("Bensaid", "Nora", "responsable2@transcampus.dz", "0550000003", encodedPassword));
        System.out.println("   ✓ Responsables created: 2 users");

        // Create Drivers
        System.out.println("🚗 Creating driver users...");
        createdUsers.add(createAndPersistDriver("Hadj", "Mohamed", "chauffeur1@transcampus.dz", "0661000001", encodedPassword, "PERM-2024-001"));
        createdUsers.add(createAndPersistDriver("Slimani", "Ali", "chauffeur2@transcampus.dz", "0661000002", encodedPassword, "PERM-2024-002"));
        createdUsers.add(createAndPersistDriver("Bouzid", "Rachid", "chauffeur3@transcampus.dz", "0661000003", encodedPassword, "PERM-2024-003"));
        System.out.println("   ✓ Drivers created: 3 users");

        // Create Students
        System.out.println("🎓 Creating student users...");
        String[][] etudiants = {
                {"Ahmed", "Benali", "ahmed@univ.dz", "0555000001", "ETU2024001", "Informatique", "3"},
                {"Fatima", "Kaci", "fatima@univ.dz", "0555000002", "ETU2024002", "Mathematiques", "2"},
                {"Youcef", "Boudiaf", "youcef@univ.dz", "0555000003", "ETU2024003", "Physique", "1"},
                {"Sara", "Merad", "sara@univ.dz", "0555000004", "ETU2024004", "Chimie", "4"},
                {"Karim", "Zeroual", "karim@univ.dz", "0555000005", "ETU2024005", "Electronique", "2"},
                {"Amina", "Cherif", "amina@univ.dz", "0555000006", "ETU2024006", "Informatique", "1"},
                {"Lyes", "Mebarki", "lyes@univ.dz", "0555000007", "ETU2024007", "Gestion", "2"},
                {"Nadia", "Hammou", "nadia@univ.dz", "0555000008", "ETU2024008", "Marketing", "3"}
        };

        int studentCount = 0;
        for (String[] e : etudiants) {
            createdUsers.add(createAndPersistStudent(e[1], e[0], e[2], e[3], encodedPassword, e[4], e[5], Integer.parseInt(e[6])));
            studentCount++;
        }
        System.out.println("   ✓ Students created: " + studentCount + " users");

        // Verify users in DB
        long totalUsers = utilisateurRepository.count();
        System.out.println("   📊 Total users in database: " + totalUsers);

        // Create Lines
        System.out.println("🛣️  Creating lines (Lignes)...");
        List<Ligne> lignes = List.of(
                createLigne("Ligne A - Campus Centre", "Liaison centre-ville / campus principal", "Place des Martyrs", "Campus Principal"),
                createLigne("Ligne B - Campus Sud", "Liaison gare sud / campus sciences", "Gare Sud", "Campus Sciences"),
                createLigne("Ligne C - Inter-Campus", "Liaison campus principal / campus technologie", "Campus Principal", "Campus Technologie")
        );
        ligneRepository.saveAllAndFlush(lignes);
        System.out.println("   ✓ Lines created: " + ligneRepository.count() + " lines");

        // Create Stops
        System.out.println("🚏 Creating stops (Arrets)...");
        List<Arret> arrets = List.of(
                createArret("Place des Martyrs", "Place des Martyrs, Centre", 1, lignes.get(0)),
                createArret("Hopital Central", "Rue de l'Hopital", 2, lignes.get(0)),
                createArret("Faculte de Droit", "Boulevard de la Republique", 3, lignes.get(0)),
                createArret("Campus Principal", "Campus Principal", 4, lignes.get(0)),
                createArret("Gare Sud", "Gare Routiere Sud", 1, lignes.get(1)),
                createArret("Marche Central", "Marche Central", 2, lignes.get(1)),
                createArret("Campus Sciences", "Campus Sciences", 3, lignes.get(1)),
                createArret("Campus Principal", "Campus Principal", 1, lignes.get(2)),
                createArret("Campus Technologie", "Campus Technologie", 2, lignes.get(2))
        );
        arretRepository.saveAllAndFlush(arrets);
        System.out.println("   ✓ Stops created: " + arretRepository.count() + " stops");

        // Create Buses
        System.out.println("🚌 Creating buses...");
        List<Bus> buses = List.of(
                createBus("TRAN-001", "Mercedes", "Citaro", 50, Bus.StatutBus.ACTIF, lignes.get(0)),
                createBus("TRAN-002", "MAN", "Lion City", 45, Bus.StatutBus.ACTIF, lignes.get(0)),
                createBus("TRAN-003", "Volvo", "7900", 55, Bus.StatutBus.ACTIF, lignes.get(1)),
                createBus("TRAN-004", "Iveco", "Urbanway", 40, Bus.StatutBus.ACTIF, lignes.get(2))
        );
        busRepository.saveAllAndFlush(buses);
        System.out.println("   ✓ Buses created: " + busRepository.count() + " buses");

        // Create Tariffs
        System.out.println("💰 Creating tariffs...");
        List<Tarif> tarifs = List.of(
                createTarif(Inscription.TypeAbonnement.MENSUEL, new BigDecimal("2000"), "Abonnement mensuel"),
                createTarif(Inscription.TypeAbonnement.SEMESTRIEL, new BigDecimal("10000"), "Abonnement semestriel"),
                createTarif(Inscription.TypeAbonnement.ANNUEL, new BigDecimal("18000"), "Abonnement annuel")
        );
        tarifRepository.saveAllAndFlush(tarifs);
        System.out.println("   ✓ Tariffs created: " + tarifRepository.count() + " tariffs");

        // Create Inscriptions
        System.out.println("📝 Creating inscriptions...");
        List<Utilisateur> students = utilisateurRepository.findAll().stream()
                .filter(u -> u.getRole() == Utilisateur.Role.STUDENT)
                .toList();

        List<Inscription> inscriptions = new ArrayList<>();
        for (int i = 0; i < students.size(); i++) {
            Utilisateur student = students.get(i);
            Ligne ligne = lignes.get(i % lignes.size());
            Arret arret = arrets.get(i % arrets.size());
            Inscription inscription = new Inscription();
            inscription.setEtudiant(student);
            inscription.setLigne(ligne);
            inscription.setArret(arret);
            inscription.setTypeAbonnement(Inscription.TypeAbonnement.values()[i % Inscription.TypeAbonnement.values().length]);
            inscription.setStatut(i % 2 == 0 ? Inscription.StatutInscription.VALIDEE : Inscription.StatutInscription.EN_ATTENTE);
            inscription.setDateDebut(LocalDate.now().minusDays(10));
            inscription.setDateFin(LocalDate.now().plusDays(30 + i * 5));
            inscriptions.add(inscription);
        }
        inscriptionRepository.saveAllAndFlush(inscriptions);
        System.out.println("   ✓ Inscriptions created: " + inscriptionRepository.count() + " inscriptions");

        // Create Payments
        System.out.println("💳 Creating payments...");
        List<Paiement> paiements = new ArrayList<>();
        for (int i = 0; i < inscriptions.size(); i++) {
            Inscription inscription = inscriptions.get(i);
            Paiement paiement = new Paiement();
            paiement.setInscription(inscription);
            paiement.setEtudiant(inscription.getEtudiant());
            paiement.setMontant(new BigDecimal("2000").add(new BigDecimal(i * 500)));
            paiement.setModePaiement(i % 2 == 0 ? Paiement.ModePaiement.VIREMENT : Paiement.ModePaiement.ESPECES);
            paiement.setStatut(i % 2 == 0 ? Paiement.StatutPaiement.PAYE : Paiement.StatutPaiement.EN_ATTENTE);
            paiement.setReferenceTransaction("PAY-" + (1000 + i));
            paiements.add(paiement);
        }
        paiementRepository.saveAllAndFlush(paiements);
        System.out.println("   ✓ Payments created: " + paiementRepository.count() + " payments");

        // Summary
        System.out.println("\n✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!");
        System.out.println("═══════════════════════════════════════════════");
        System.out.println("📊 SUMMARY:");
        System.out.println("   👤 Utilisateurs: " + utilisateurRepository.count());
        System.out.println("   🛣️  Lignes: " + ligneRepository.count());
        System.out.println("   🚏 Arrets: " + arretRepository.count());
        System.out.println("   🚌 Bus: " + busRepository.count());
        System.out.println("   💰 Tarifs: " + tarifRepository.count());
        System.out.println("   📝 Inscriptions: " + inscriptionRepository.count());
        System.out.println("   💳 Paiements: " + paiementRepository.count());
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
}