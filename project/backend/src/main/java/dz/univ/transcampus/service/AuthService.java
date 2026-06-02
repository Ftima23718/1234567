package dz.univ.transcampus.service;

import dz.univ.transcampus.dto.AuthDtos;
import dz.univ.transcampus.entity.Chauffeur;
import dz.univ.transcampus.entity.Etudiant;
import dz.univ.transcampus.entity.Utilisateur;
import dz.univ.transcampus.exception.BusinessException;
import dz.univ.transcampus.repository.ChauffeurRepository;
import dz.univ.transcampus.repository.EtudiantRepository;
import dz.univ.transcampus.repository.UtilisateurRepository;
import dz.univ.transcampus.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UtilisateurRepository utilisateurRepository;
    private final EtudiantRepository etudiantRepository;
    private final ChauffeurRepository chauffeurRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final NotificationService notificationService;

    @Transactional
    public AuthDtos.AuthResponse register(AuthDtos.RegisterRequest req) {
        if (utilisateurRepository.existsByEmail(req.getEmail())) {
            throw BusinessException.conflict("Un compte existe déjà avec cet email");
        }
        if (etudiantRepository.existsByNumeroEtudiant(req.getNumeroEtudiant())) {
            throw BusinessException.conflict("Ce numéro étudiant est déjà utilisé");
        }

        Utilisateur user = new Utilisateur();
        user.setNom(req.getNom());
        user.setPrenom(req.getPrenom());
        user.setEmail(req.getEmail());
        user.setTelephone(req.getTelephone());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole(Utilisateur.Role.STUDENT);

        user = utilisateurRepository.save(user);

        Etudiant etudiant = new Etudiant();
        etudiant.setUtilisateur(user);
        etudiant.setNumeroEtudiant(req.getNumeroEtudiant());
        etudiant.setFiliere(req.getFiliere());
        etudiant.setAnneeEtude(req.getAnneeEtude() != null ? req.getAnneeEtude() : 1);
        etudiantRepository.save(etudiant);

        notificationService.send(user.getId(), NotificationService.Type.success,
                "Bienvenue sur TransCampus ! Votre compte étudiant a été créé avec succès.");

        return buildAuthResponse(user);
    }

    @Transactional
    public AuthDtos.AuthResponse registerChauffeur(dz.univ.transcampus.dto.TransportDtos.ChauffeurRequest req) {
        if (utilisateurRepository.existsByEmail(req.getEmail())) {
            throw BusinessException.conflict("Un compte existe déjà avec cet email");
        }
        if (chauffeurRepository.existsByNumeroPermis(req.getNumeroPermis())) {
            throw BusinessException.conflict("Ce numéro de permis est déjà utilisé");
        }

        Utilisateur user = new Utilisateur();
        user.setNom(req.getNom());
        user.setPrenom(req.getPrenom());
        user.setEmail(req.getEmail());
        user.setTelephone(req.getTelephone());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole(Utilisateur.Role.DRIVER);

        user = utilisateurRepository.save(user);

        Chauffeur chauffeur = new Chauffeur();
        chauffeur.setUtilisateur(user);
        chauffeur.setNumeroPermis(req.getNumeroPermis());
        chauffeurRepository.save(chauffeur);

        return buildAuthResponse(user);
    }

    public AuthDtos.AuthResponse login(AuthDtos.LoginRequest req) {
        Utilisateur user = utilisateurRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> BusinessException.unauthorized("Email ou mot de passe incorrect"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw BusinessException.unauthorized("Email ou mot de passe incorrect");
        }

        return buildAuthResponse(user);
    }

    @Transactional
    public void changePassword(String userId, AuthDtos.ChangePasswordRequest req) {
        Utilisateur user = utilisateurRepository.findById(userId)
                .orElseThrow(() -> BusinessException.notFound("Utilisateur non trouvé"));

        if (!passwordEncoder.matches(req.getCurrentPassword(), user.getPassword())) {
            throw BusinessException.unauthorized("Mot de passe actuel incorrect");
        }

        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        utilisateurRepository.save(user);
    }

    @Transactional
    public AuthDtos.AuthResponse createUser(AuthDtos.CreateUserRequest req) {
        if (utilisateurRepository.existsByEmail(req.getEmail())) {
            throw BusinessException.conflict("Un compte existe déjà avec cet email");
        }

        Utilisateur.Role role = Utilisateur.Role.valueOf(req.getRole().toUpperCase());

        Utilisateur user = new Utilisateur();
        user.setNom(req.getNom());
        user.setPrenom(req.getPrenom());
        user.setEmail(req.getEmail());
        user.setTelephone(req.getTelephone());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole(role);

        user = utilisateurRepository.save(user);

        // Create role-specific records
        if (role == Utilisateur.Role.STUDENT) {
            if (etudiantRepository.existsByNumeroEtudiant(req.getNumeroEtudiant())) {
                throw BusinessException.conflict("Ce numéro étudiant est déjà utilisé");
            }
            Etudiant etudiant = new Etudiant();
            etudiant.setUtilisateur(user);
            etudiant.setNumeroEtudiant(req.getNumeroEtudiant());
            etudiant.setFiliere(req.getFiliere() != null ? req.getFiliere() : "");
            etudiant.setAnneeEtude(req.getAnneeEtude() != null ? req.getAnneeEtude() : 1);
            etudiantRepository.save(etudiant);
            user.setEtudiant(etudiant);
        } else if (role == Utilisateur.Role.DRIVER) {
            if (chauffeurRepository.existsByNumeroPermis(req.getNumeroPermis())) {
                throw BusinessException.conflict("Ce numéro de permis est déjà utilisé");
            }
            Chauffeur chauffeur = new Chauffeur();
            chauffeur.setUtilisateur(user);
            chauffeur.setNumeroPermis(req.getNumeroPermis());
            chauffeurRepository.save(chauffeur);
            user.setChauffeur(chauffeur);
        }

        utilisateurRepository.save(user);
        notificationService.send(user.getId(), NotificationService.Type.success,
                "Votre compte a été créé avec succès.");

        return buildAuthResponse(user);
    }

    private AuthDtos.AuthResponse buildAuthResponse(Utilisateur user) {
        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().name().toUpperCase());
        return AuthDtos.AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .email(user.getEmail())
                .nom(user.getNom())
                .prenom(user.getPrenom())
                .role(user.getRole().name())
                .build();
    }
}
