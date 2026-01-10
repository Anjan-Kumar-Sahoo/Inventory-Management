package com.yourcompany.inventory.exception;

public class SupplierHasProductsException extends RuntimeException {
    public SupplierHasProductsException(String message) {
        super(message);
    }
}
