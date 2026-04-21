package com.smartlibrary.smart_library.security;

import com.smartlibrary.smart_library.entity.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtTokenProvider {



    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration}")
    private long jwtExpiration;

    // ── GET SIGNING KEY
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }


    public String generateToken(User user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);

        return Jwts.builder()
                .subject(user.getEmail())        // "sub" claim — who this token belongs to
                .claim("role", user.getRole().name())  // Custom claim — user's role
                .claim("fullName", user.getFullName()) // Custom claim — for frontend display
                .issuedAt(now)                   // "iat" claim — when token was created
                .expiration(expiryDate)          // "exp" claim — when token expires
                .signWith(getSigningKey())       // Sign with your secret key
                .compact();                      // Build the final JWT string
    }

    // EXTRACT EMAIL — Get user email from a token

    public String getUserEmailFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())   // Use same key that signed it
                .build()
                .parseSignedClaims(token)      // Parse and verify signature
                .getPayload();                 // Get the payload (claims)

        return claims.getSubject();  // Returns the email
    }

    // VALIDATE TOKEN — Check if token is valid and not expired

    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (ExpiredJwtException ex) {

            System.out.println("JWT expired: " + ex.getMessage());
        } catch (MalformedJwtException ex) {

            System.out.println("Invalid JWT: " + ex.getMessage());
        } catch (SecurityException ex) {

            System.out.println("JWT signature invalid: " + ex.getMessage());
        } catch (IllegalArgumentException ex) {
            // Token string is null or empty
            System.out.println("JWT token is empty: " + ex.getMessage());
        }
        return false;
    }
}
