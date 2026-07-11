package com.incubyte.cardealership.config;

import com.incubyte.cardealership.user.entity.Role;
import com.incubyte.cardealership.user.entity.User;
import com.incubyte.cardealership.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        Optional<User> existingUser = userRepository.findByEmail("admin@gmail.com");
        if (existingUser.isEmpty()) {
            User admin = User.builder()
                    .name("adminUser")
                    .email("admin@gmail.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);
        } else {
            User user = existingUser.get();
            user.setName("adminUser");
            user.setPassword(passwordEncoder.encode("admin123"));
            user.setRole(Role.ADMIN);
            userRepository.save(user);
        }
    }
}
