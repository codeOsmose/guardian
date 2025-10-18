package br.com.guardianapp.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy; // IMPORTANTE PARA ESTADO (STATELESS)
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter; // Para adicionar o filtro JWT

import br.com.guardianapp.backend.services.CustomUserDetailsService;
// Importe suas classes de JWT (ajuste o caminho se necessário)
import br.com.guardianapp.backend.security.JwtAuthenticationFilter; 
import br.com.guardianapp.backend.security.JwtUnauthorizedHandler; 

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService customUserDetailsService;
    
    // Injeção do manipulador de erros 401
    @Autowired
    private JwtUnauthorizedHandler jwtUnauthorizedHandler;

    // Injeção do filtro JWT
    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Desabilita CSRF (porque usamos JWT, não cookies/sessão)
            .csrf(csrf -> csrf.disable())

            // 2. Define o manipulador de exceções para 401 (Unauthorized)
            .exceptionHandling(handling -> handling
                .authenticationEntryPoint(jwtUnauthorizedHandler)
            )

            // 3. Define a política de sessão como STATELESS (sem estado, obrigatório para JWT)
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            // 4. Define as regras de autorização
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll() // Login e Registro: ACESSO PÚBLICO
                .requestMatchers("/h2-console/**").permitAll() // Se estiver usando H2
                .requestMatchers("/error").permitAll() // Permite a URL de erro
                .anyRequest().authenticated() // Qualquer outra requisição deve ser AUTENTICADA
            )
            
            // 5. Adiciona o filtro JWT antes do filtro padrão do Spring
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            
            // 6. Configuração para o H2 Console (se estiver usando)
            .headers(headers -> headers.frameOptions(frame -> frame.disable()))
            
            .userDetailsService(customUserDetailsService);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}