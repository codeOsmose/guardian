// Arquivo: src/main/java/br/com/guardianapp/backend/controllers/UserController.java
/*package br.com.guardianapp.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.guardianapp.backend.models.User;
import br.com.guardianapp.backend.repositories.UserRepository;

@RestController // Marca a classe como um Controller que lida com requisições REST
@RequestMapping("/api/users" ) // Define que todos os endpoints nesta classe começarão com /api/users
public class UserController {

    @Autowired // Injeção de dependência: O Spring vai nos dar uma instância de UserRepository
    private UserRepository userRepository;

    // Endpoint para criar um novo usuário
    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User newUser) {
        // @RequestBody: O Spring vai converter o JSON vindo na requisição para um objeto User

        // Salva o novo usuário no banco de dados usando o repositório
        User savedUser = userRepository.save(newUser);

        // Retorna o usuário salvo com o status HTTP 201 (Created)
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }
}*/

// Arquivo: src/main/java/br/com/guardianapp/backend/controllers/UserController.java
package br.com.guardianapp.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
// Importe o PasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.guardianapp.backend.models.User;
import br.com.guardianapp.backend.repositories.UserRepository;

@RestController
@RequestMapping("/api/users" )
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // 1. Injete o PasswordEncoder que criamos
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User newUser) {
        
        // 2. Antes de salvar, codifique a senha do novo usuário
        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));

        User savedUser = userRepository.save(newUser);
        
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }
}

