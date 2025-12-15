package de.bht.refashion.backend.service;

import de.bht.refashion.backend.model.User;
import de.bht.refashion.backend.repository.UserRepository;
import de.bht.refashion.backend.security.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private static final String USER_NOT_FOUND = "User not found";
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final JwtUtil jwtUtil;

     @Autowired
    public UserService(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    
    public User registerUser(User user) {
      
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            throw new IllegalArgumentException("E-Mail existiert bereits!");
        }

        
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);

        
        return userRepository.save(user);
    }

    public String login(String email, String password) {
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException(USER_NOT_FOUND));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("Invalid password");
        }

        return jwtUtil.generateToken(email);
    }

    public User getUserProfile(String token) {
        if (!jwtUtil.validateToken(token)) {
            throw new IllegalArgumentException("Invalid token");
        }
        
        String email = jwtUtil.extractEmail(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException(USER_NOT_FOUND));
        
        // Remove password from response for security
        user.setPassword(null);
        return user;
    }

    public User updateUserProfile(String token, User updateRequest) {
        if (!jwtUtil.validateToken(token)) {
            throw new IllegalArgumentException("Invalid token");
        }
        
        String email = jwtUtil.extractEmail(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException(USER_NOT_FOUND));
        
        // Update allowed fields
        if (updateRequest.getName() != null && !updateRequest.getName().trim().isEmpty()) {
            user.setName(updateRequest.getName());
        }
        if (updateRequest.getCity() != null) {
            user.setCity(updateRequest.getCity());
        }
        if (updateRequest.getProfileImageUrl() != null) {
            user.setProfileImageUrl(updateRequest.getProfileImageUrl());
        }
        
        User savedUser = userRepository.save(user);
        // Remove password from response for security
        savedUser.setPassword(null);
        return savedUser;
    }

    public User updateProfileImage(String token, String imageUrl) {
        if (!jwtUtil.validateToken(token)) {
            throw new IllegalArgumentException("Invalid token");
        }
        
        String email = jwtUtil.extractEmail(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException(USER_NOT_FOUND));
        
        user.setProfileImageUrl(imageUrl);
        User savedUser = userRepository.save(user);
        savedUser.setPassword(null);
        return savedUser;
    }
}
