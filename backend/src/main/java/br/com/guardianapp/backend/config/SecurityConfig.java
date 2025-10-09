// Arquivo: src/main/java/br/com/guardianapp/backend/config/SecurityConfig.java
package br.com.guardianapp.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean // Expõe este método como um Bean gerenciado pelo Spring
    public PasswordEncoder passwordEncoder() {
        // Usa o BCrypt, o algoritmo de hashing de senhas mais recomendado atualmente
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http ) throws Exception {
        http
            .csrf(csrf -> csrf.disable( )) // Desabilita o CSRF por enquanto (simplificação para APIs)
            .authorizeHttpRequests(authz -> authz
                // Permite que qualquer um acesse o endpoint de registro
                .requestMatchers("/api/users/register").permitAll()
                // Qualquer outra requisição precisa de autenticação (vamos configurar isso depois)
                .anyRequest().authenticated()
            );
        return http.build( );
    }
}
