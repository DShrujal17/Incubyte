package com.incubyte.cardealership.user.repository;

import com.incubyte.cardealership.user.entity.User;

import java.util.Optional;

public interface UserRepository {

    User save(User user);
    Optional<Object> findByEmail(String email);
}