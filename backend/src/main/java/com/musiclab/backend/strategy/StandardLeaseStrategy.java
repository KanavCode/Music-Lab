package com.musiclab.backend.strategy;

import java.math.BigDecimal;

/**
 * Standard lease pricing — returns the base price with no markup.
 *
 * AJT Syllabus: Unit 8 — Strategy Design Pattern (Concrete Strategy)
 */
public class StandardLeaseStrategy implements LicensePricingStrategy {

    @Override
    public BigDecimal calculatePrice(BigDecimal basePrice) {
        return basePrice;
    }
}
