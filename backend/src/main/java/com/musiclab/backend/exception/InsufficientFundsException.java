package com.musiclab.backend.exception;

/**
 * Thrown when a buyer's wallet balance is insufficient for a marketplace purchase.
 */
public class InsufficientFundsException extends RuntimeException {

    public InsufficientFundsException(String message) {
        super(message);
    }
}
