package de.bht.refashion.backend.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secretString;

    private Key getSecretKey() {
        return Keys.hmacShaKeyFor(secretString.getBytes(StandardCharsets.UTF_8));
    }

    private static final long EXPIRATION_TIME = 24L * 60 * 60 * 1000; // 24 hours
    private static final long REMEMBER_ME_EXPIRATION = 30L * 24 * 60 * 60 * 1000; // 30 days


    public String generateToken(String email) {
        return generateToken(email, false);
    }

    public String generateToken(String email, boolean rememberMe) {
        long expirationTime = rememberMe ? REMEMBER_ME_EXPIRATION : EXPIRATION_TIME;
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(getSecretKey(), SignatureAlgorithm.HS256)
                .compact();
    }


    public String extractEmail(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSecretKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }


    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(getSecretKey()).build().parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}