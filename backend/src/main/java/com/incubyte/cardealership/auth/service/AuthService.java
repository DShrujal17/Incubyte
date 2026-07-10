package com.incubyte.cardealership.auth.service;

import com.incubyte.cardealership.auth.dto.RegisterRequest;
import com.incubyte.cardealership.auth.dto.RegisterResponse;
import com.incubyte.cardealership.user.entity.User;
import com.incubyte.cardealership.user.repository.UserRepository;

public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public RegisterResponse register(RegisterRequest request) {

        User user = new User(
                request.name(),
                request.email(),
                request.password()
        );

        userRepository.save(user);

        return new RegisterResponse(
                request.name(),
                request.email()
        );
    }
}