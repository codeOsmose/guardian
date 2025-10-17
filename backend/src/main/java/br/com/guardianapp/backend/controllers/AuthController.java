// PACOTE E IMPORTAÇÕES NO TOPO
package br.com.guardianapp.backend.controllers;

import br.com.guardianapp.backend.dto.LoginRequest;
import br.com.guardianapp.backend.dto.LoginResponse;
import br.com.guardianapp.backend.models.User;
import br.com.guardianapp.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth" )
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    // SEU MÉTODO DE REGISTRO (JÁ EXISTENTE)
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User newUser) {
        if (userRepository.findByEmail(newUser.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }
        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
        User savedUser = userRepository.save(newUser);
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }

    // SEU NOVO MÉTODO DE LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String dummyToken = "dummy-jwt-token-for-" + loginRequest.getEmail();

        return ResponseEntity.ok(new LoginResponse(dummyToken));
    }
}
