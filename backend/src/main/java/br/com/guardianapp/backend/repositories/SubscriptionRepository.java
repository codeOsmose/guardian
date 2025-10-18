package br.com.guardianapp.backend.repositories;
// e corrija o import de Subscription para:
import br.com.guardianapp.backend.models.Subscription;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

// Note que aqui estamos usando Subscription, que deve ser importado corretamente
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    List<Subscription> findByUserId(Long userId);
}