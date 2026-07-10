package com.incubyte.cardealership.user.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class User {

    private final String name;
    private final String email;
    private final String password;
    private final Role role;
}