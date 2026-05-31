package dz.univ.transcampus.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

public class AuthDtos {

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class LoginRequest {
        @NotBlank(message = "L'email est obligatoire") @Email(message = "Email invalide")
        private String email;
        @NotBlank(message = "Le mot de passe est obligatoire") @Size(min = 6, message = "Min. 6 caracteres")
        private String password;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class RegisterRequest {
        @NotBlank private String nom;
        @NotBlank private String prenom;
        @NotBlank @Email private String email;
        @NotBlank private String telephone;
        @NotBlank @Size(min = 6) private String password;
        @NotBlank private String numeroEtudiant;
        @NotBlank private String filiere;
        @Builder.Default private Integer anneeEtude = 1;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class AuthResponse {
        private String token;
        private String userId;
        private String email;
        private String nom;
        private String prenom;
        private String role;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class ChangePasswordRequest {
        @NotBlank private String currentPassword;
        @NotBlank @Size(min = 6) private String newPassword;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class ForgotPasswordRequest {
        @NotBlank @Email private String email;
    }
}
