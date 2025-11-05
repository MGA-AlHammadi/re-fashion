package de.bht.refashion.backend.controller;

import de.bht.refashion.backend.model.User;
import de.bht.refashion.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") 
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<Object> registerUser(@RequestBody User user) {
        try {
            User newUser = userService.registerUser(user);
            return ResponseEntity.ok(newUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody User loginRequest) {
    try {
        String token = userService.login(loginRequest.getEmail(), loginRequest.getPassword());
        return ResponseEntity.ok().body("{\"token\": \"" + token + "\"}");
    } catch (RuntimeException e) {
        return ResponseEntity.status(401).body(e.getMessage());
    }
      }
}
