package com.musiclab.backend.strategy;

import java.math.BigDecimal;

/**
 * Exclusive rights pricing — 10x markup on the base price.
 * Represents full ownership transfer of the track.
 *
 * AJT Syllabus: Unit 8 — Strategy Design Pattern (Concrete Strategy)
 */
public class ExclusiveRightsStrategy implements LicensePricingStrategy {

    private static final BigDecimal EXCLUSIVE_MULTIPLIER = new BigDecimal("10.0");

    @Override
    public BigDecimal calculatePrice(BigDecimal basePrice) {
        return basePrice.multiply(EXCLUSIVE_MULTIPLIER);
    }
}
