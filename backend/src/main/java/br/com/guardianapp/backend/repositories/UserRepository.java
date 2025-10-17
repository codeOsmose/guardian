// Arquivo: src/main/java/br/com/guardianapp/backend/repositories/UserRepository.java
package br.com.guardianapp.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import br.com.guardianapp.backend.models.User;
import java.util.Optional;

@Repository // Marca esta interface como um componente de repositório do Spring
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    // A mágica acontece aqui!
    // Ao estender JpaRepository, nós automaticamente ganhamos métodos como:
    // save(), findById(), findAll(), delete(), etc.
    // Não precisamos escrever nenhuma implementação!
}
