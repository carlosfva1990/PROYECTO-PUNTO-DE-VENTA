package com.tienda.entity;

public enum UserRole {
    BUYER("BUYER"),
    SELLER("SELLER"),
    ADMIN("ADMIN");

    private final String value;

    UserRole(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
