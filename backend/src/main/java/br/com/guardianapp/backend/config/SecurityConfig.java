
package br.com.guardianapp.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager; // IMPORTANTE
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration; // IMPORTANTE
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import br.com.guardianapp.backend.services.CustomUserDetailsService;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
private CustomUserDetailsService customUserDetailsService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http ) throws Exception {
        http
            .csrf(csrf -> csrf.disable( ))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll() // Permite tudo sob /api/auth/
                .anyRequest().authenticated()
            )
            .userDetailsService(customUserDetailsService);
        return http.build( );
    }

    // ADICIONE ESTE MÉTODO COMPLETO
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}
