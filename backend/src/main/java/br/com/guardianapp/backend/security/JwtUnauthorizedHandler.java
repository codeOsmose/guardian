package br.com.guardianapp.backend.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class JwtUnauthorizedHandler implements AuthenticationEntryPoint {
    
    // Este método é chamado quando o usuário tenta acessar um recurso protegido 
    // sem autenticação (ou com autenticação inválida)
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException {
        // Retorna 401 Unauthorized e uma mensagem JSON
        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().write("{ \"message\": \"Acesso não autorizado. Você precisa de um token JWT válido.\" }");
    }
}