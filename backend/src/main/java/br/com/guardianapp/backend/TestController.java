// backend/src/main/java/br/com/guardianapp/backend/TestController.java
package br.com.guardianapp.backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;
import java.util.Collections;

@RestController
public class TestController {

    @GetMapping("/api/test")
    public Map<String, String> testEndpoint() {
        // Retornar um JSON válido é uma prática melhor
        return Collections.singletonMap("message", "O backend do GuardianApp está no ar!");
    }
}
