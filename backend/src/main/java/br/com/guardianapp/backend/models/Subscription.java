package br.com.guardianapp.backend.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "subscriptions")
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
   
    private String title;
    
    // Usamos BigDecimal para armazenar valores monetários com precisão
    private BigDecimal cost; 
    
    // Data de vencimento no formato AAAA-MM-DD, conforme o frontend envia
    private LocalDate dueDate; 
    
    // Relacionamento com o usuário (garante que só o dono possa ver/editar)
    @ManyToOne 
    private User user; // Assumindo que você tem uma entidade User

    // Construtor padrão (necessário pelo JPA)
    public Subscription() {
    }

    // Construtor com campos (opcional, mas útil)
    public Subscription(String title, BigDecimal cost, LocalDate dueDate, User user) {
        this.title = title;
        this.cost = cost;
        this.dueDate = dueDate;
        this.user = user;
    }

    // --- Getters e Setters (Necessário para JPA e Jackson/JSON) ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public BigDecimal getCost() { return cost; }
    public void setCost(BigDecimal cost) { this.cost = cost; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}