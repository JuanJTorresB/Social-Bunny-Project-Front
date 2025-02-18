package com.c3.Social.Bunny.Auth;

import com.c3.Social.Bunny.Jwt.JwtService;
import com.c3.Social.Bunny.User.Entity.User;
import com.c3.Social.Bunny.User.Enum.Role;
import com.c3.Social.Bunny.User.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

@Service
public class AuthService {

    @Autowired private UserRepository userRepository;
    @Autowired private JwtService jwtService;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private AuthenticationManager authenticationManager;

    public AuthResponse login(LoginRequest request, HttpServletResponse response) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        UserDetails user = userRepository.findByUsername(request.getUsername()).orElseThrow();
        String token = jwtService.getToken(user);
        
        // Crear cookie HttpOnly
        Cookie cookie = new Cookie("jwt", token);
        cookie.setHttpOnly(false);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(24 * 60 * 60); // 24 horas
        response.addCookie(cookie);
        
        return new AuthResponse(token);
    }

    public AuthResponse register(RegisterRequest request, HttpServletResponse response) {
        User user = new User();
        user.setFullname(request.getFullName());
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setMobileNumber(request.getMobileNumber());
        user.setBirthDate(request.getBirthDate());
        user.setRole(Role.USER);
        
        userRepository.save(user);
        
        String token = jwtService.getToken(user);
        
        // Crear cookie HttpOnly
        Cookie cookie = new Cookie("jwt", token);
        cookie.setHttpOnly(false);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(24 * 60 * 60);
        response.addCookie(cookie);
        
        return new AuthResponse(token);
    }

    public void logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("jwt", null);
        cookie.setHttpOnly(false);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }
}
