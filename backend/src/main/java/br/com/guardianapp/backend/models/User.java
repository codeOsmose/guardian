// Arquivo: src/main/java/br/com/guardianapp/backend/models/User.java
package br.com.guardianapp.backend.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data; // Importa a anotação do Lombok

@Data // Anotação do Lombok que cria getters, setters, toString, etc. automaticamente
@Entity // Marca esta classe como uma entidade JPA (uma tabela no banco)
@Table(name = "users") // Define o nome da tabela no banco de dados como "users"
public class User {

    @Id // Marca este campo como a chave primária (Primary Key)
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Configura o ID para ser autoincrementado pelo banco
    private Long id;

    private String name;

    private String email;

    private String password;
    
}

