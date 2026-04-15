package com.ratonblanco.backend.controller;

import com.ratonblanco.backend.dto.LoginRequest;
import com.ratonblanco.backend.entity.User;
import com.ratonblanco.backend.service.UserService;
import com.ratonblanco.backend.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;
    private final EmailService emailService;

    public UserController(UserService userService, EmailService emailService) {

        this.userService = userService;
        this.emailService = emailService;
    }

    @PostMapping
    public ResponseEntity<User> createUser(@Valid @RequestBody User user) {
        User createdUser = userService.createUser(
                user.getName(),
                user.getLastName(),
                user.getEmail(),
                user.getPassword(),
                user.getRole()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }


    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            User user = userService.getUserByEmail(loginRequest.getEmail());
            String token = userService.login(loginRequest.getEmail(), loginRequest.getPassword());

            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("token", token);
            response.put("name", user.getName());
            response.put("lastName", user.getLastName());
            response.put("email", user.getEmail());
            response.put("role", user.getRole());

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }


    @PutMapping("/{email}")
    public ResponseEntity<User> updateUser(
            @PathVariable String email,
            @RequestBody User user) {
        User updateUser = userService.updateUser(
                email,
                user.getName(),
                user.getLastName(),
                user.getPassword(),
                user.getRole()
        );
        return ResponseEntity.ok(updateUser);
    }


    @DeleteMapping("/{email}")
    public ResponseEntity<Void> deleteUser(@PathVariable String email) {
        userService.deleteUser(email);
        return ResponseEntity.noContent().build();
    }



    @PostMapping("/resend-confirmation")
    public ResponseEntity<Void> resendConfirmation(@RequestBody String email) throws UnsupportedEncodingException {
        email = java.net.URLDecoder.decode(email, "UTF-8").replace("\"", "").replace("=", "").trim();

        System.out.println(email);
        User user = userService.getUserByEmail(email);

        try {
            emailService.sendConfirmationEmail(user.getName(), email);
        } catch (MessagingException e) {
            System.err.println("Error al enviar email de confirmación: " + e.getMessage());
        }

        return ResponseEntity.ok().build();
    }

}