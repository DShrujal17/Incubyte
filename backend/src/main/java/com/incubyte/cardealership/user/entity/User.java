package com.incubyte.cardealership.user.entity;

public class User {

    private final String name;
    private final String email;
    private final String password;
    private final Role role;

    public User(String name,
                String email,
                String password,
                Role role) {

        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    public Role getRole() {
        return role;
    }

    // existing getters...
}