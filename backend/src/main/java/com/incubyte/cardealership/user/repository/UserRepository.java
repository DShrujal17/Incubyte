package com.incubyte.cardealership.user.repository;

import com.incubyte.cardealership.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    User save(User user);
    Optional<Object> findByEmail(String email);
}