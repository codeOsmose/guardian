package br.com.guardianapp.backend.controllers;

import br.com.guardianapp.backend.models.Subscription;
import br.com.guardianapp.backend.models.User;
import br.com.guardianapp.backend.repositories.SubscriptionRepository;
import br.com.guardianapp.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private UserRepository userRepository; // Necessário para obter o User logado

    // Helper para obter o User logado
    private User getCurrentUser(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails)) {
            return null;
        }
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return userRepository.findByEmail(userDetails.getUsername()).orElse(null);
    }

    // --------------------------------------------------------
    // R (Read): GET /api/subscriptions
    // --------------------------------------------------------
    @GetMapping
    public ResponseEntity<List<Subscription>> getAllSubscriptions(Authentication authentication) {
        User user = getCurrentUser(authentication);
        if (user == null) {
            return ResponseEntity.status(401).build(); // Não autorizado
        }
        
        // Retorna apenas as assinaturas do usuário logado
        List<Subscription> subscriptions = subscriptionRepository.findByUserId(user.getId());
        return ResponseEntity.ok(subscriptions);
    }

    // --------------------------------------------------------
    // C (Create): POST /api/subscriptions
    // --------------------------------------------------------
    @PostMapping
    public ResponseEntity<Subscription> createSubscription(@RequestBody Subscription subscription, Authentication authentication) {
        User user = getCurrentUser(authentication);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        
        // Associa a nova assinatura ao usuário logado
        subscription.setUser(user);
        Subscription savedSubscription = subscriptionRepository.save(subscription);
        
        // Retorna 201 Created
        return ResponseEntity.created(URI.create("/api/subscriptions/" + savedSubscription.getId())).body(savedSubscription);
    }

    // --------------------------------------------------------
    // U (Update): PUT /api/subscriptions/{id}
    // --------------------------------------------------------
    @PutMapping("/{id}")
    public ResponseEntity<Subscription> updateSubscription(@PathVariable Long id, @RequestBody Subscription subscriptionDetails, Authentication authentication) {
        User user = getCurrentUser(authentication);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        Optional<Subscription> subscriptionOptional = subscriptionRepository.findById(id);

        if (subscriptionOptional.isPresent()) {
            Subscription subscription = subscriptionOptional.get();

            // VERIFICAÇÃO DE PROPRIEDADE: Garante que o usuário só edite sua própria assinatura
            if (!subscription.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(403).build(); // Proibido
            }

            // Atualiza os campos
            subscription.setTitle(subscriptionDetails.getTitle());
            subscription.setCost(subscriptionDetails.getCost());
            subscription.setDueDate(subscriptionDetails.getDueDate());

            Subscription updatedSubscription = subscriptionRepository.save(subscription);
            return ResponseEntity.ok(updatedSubscription);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // --------------------------------------------------------
    // D (Delete): DELETE /api/subscriptions/{id}
    // --------------------------------------------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubscription(@PathVariable Long id, Authentication authentication) {
        User user = getCurrentUser(authentication);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        Optional<Subscription> subscriptionOptional = subscriptionRepository.findById(id);

        if (subscriptionOptional.isPresent()) {
            Subscription subscription = subscriptionOptional.get();

            // VERIFICAÇÃO DE PROPRIEDADE
            if (!subscription.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(403).build(); // Proibido
            }

            subscriptionRepository.deleteById(id);
            return ResponseEntity.noContent().build(); // 204 No Content
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}