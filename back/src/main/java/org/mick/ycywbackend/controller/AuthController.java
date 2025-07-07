package org.mick.ycywbackend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.mick.ycywbackend.dto.AuthRequest;
import org.mick.ycywbackend.dto.AuthResponse;
import org.mick.ycywbackend.dto.RegisterRequest;
import org.mick.ycywbackend.entity.User;
import org.mick.ycywbackend.security.JwtService;
import org.mick.ycywbackend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final UserService userService;
    private final AuthenticationManager authManager;
    private final JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        User user = userService.register(request);
        String token = jwtService.generateToken(
                new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities()));
        return ResponseEntity.ok(new AuthResponse(token, user.getRole()));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        User user = (User) auth.getPrincipal();
        String token = jwtService.generateToken(auth);
        return ResponseEntity.ok(new AuthResponse(token, user.getRole()));
    }
}



