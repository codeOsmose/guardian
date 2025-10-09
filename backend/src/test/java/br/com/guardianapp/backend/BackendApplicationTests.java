// Arquivo: src/test/java/br/com/guardianapp/backend/BackendApplicationTests.java
package br.com.guardianapp.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@SpringBootTest
@Testcontainers // Habilita a integração com Testcontainers
class BackendApplicationTests {

    // Cria um contêiner PostgreSQL que será iniciado antes dos testes
    @Container
    public static PostgreSQLContainer<?> postgreSQLContainer = new PostgreSQLContainer<>("postgres:15-alpine");

    // Este método injeta dinamicamente as propriedades do contêiner (URL, usuário, senha)
    // no ambiente de teste do Spring, sobrescrevendo qualquer outra configuração.
    @DynamicPropertySource
    static void postgresqlProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgreSQLContainer::getJdbcUrl);
        registry.add("spring.datasource.username", postgreSQLContainer::getUsername);
        registry.add("spring.datasource.password", postgreSQLContainer::getPassword);
    }

    @Test
    void contextLoads() {
        // Este teste agora vai rodar usando o banco de dados do contêiner.
        // Se ele passar, significa que a aplicação consegue iniciar e se conectar ao banco.
    }
}

