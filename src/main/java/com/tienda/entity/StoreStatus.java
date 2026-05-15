package com.tienda.entity;

public enum StoreStatus {
    ACTIVE("ACTIVE"),
    INACTIVE("INACTIVE"),
    SUSPENDED("SUSPENDED");

    private final String value;

    StoreStatus(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
