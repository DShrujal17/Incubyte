package com.incubyte.cardealership.auth.service;

import com.incubyte.cardealership.auth.dto.RegisterRequest;
import com.incubyte.cardealership.auth.dto.RegisterResponse;
import com.incubyte.cardealership.user.entity.Role;
import com.incubyte.cardealership.user.entity.User;
import com.incubyte.cardealership.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;

@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    public RegisterResponse register(RegisterRequest request) {

        if (!request.email().matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {
            throw new IllegalArgumentException("Invalid email");
        }

        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }

        String encodedPassword = passwordEncoder.encode(request.password());

        User user = new User(
                request.name(),
                request.email(),
                encodedPassword,
                Role.USER
        );

        userRepository.save(user);

        return new RegisterResponse(
                request.name(),
                request.email()
        );
    }
}