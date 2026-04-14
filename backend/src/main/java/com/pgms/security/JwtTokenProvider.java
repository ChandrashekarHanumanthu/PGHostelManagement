package com.pgms.security;

import com.pgms.entity.Role;
import com.pgms.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {

    private final Key key;
    private final long jwtExpirationMs;

    public JwtTokenProvider(
            @Value("${security.jwt.secret}") String secret,
            @Value("${security.jwt.expiration-ms}") long jwtExpirationMs
    ) {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        this.key = Keys.hmacShaKeyFor(keyBytes);
        this.jwtExpirationMs = jwtExpirationMs;
    }

    public String generateToken(User user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        // Handle hostel information safely - it might be null for tenants due to lazy loading
        Long hostelId = user.getHostelId(); // Use hostelId field directly
        String hostelName = null;
        Boolean isSetupComplete = null;
        
        // Only try to get hostel details if hostelId exists
        if (hostelId != null && user.getHostel() != null) {
            hostelName = user.getHostel().getName();
            isSetupComplete = user.getHostel().getIsSetupComplete();
        }

        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("userId", user.getId())
                .claim("role", user.getRole().name())
                .claim("hostelId", hostelId)
                .claim("hostelName", hostelName)
                .claim("isSetupComplete", isSetupComplete)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // All token generation now requires full User context with hostel information

    public String getUsernameFromToken(String token) {
        return getAllClaimsFromToken(token).getSubject();
    }

    public String getRoleFromToken(String token) {
        return getAllClaimsFromToken(token).get("role", String.class);
    }

    public Long getHostelIdFromToken(String token) {
        return getAllClaimsFromToken(token).get("hostelId", Long.class);
    }

    public String getHostelNameFromToken(String token) {
        return getAllClaimsFromToken(token).get("hostelName", String.class);
    }

    public Boolean getIsSetupCompleteFromToken(String token) {
        return getAllClaimsFromToken(token).get("isSetupComplete", Boolean.class);
    }

    public boolean validateToken(String token) {
        try {
            getAllClaimsFromToken(token);
            return true;
        } catch (Exception ex) {
            return false;
        }
    }

    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}

