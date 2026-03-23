package com.musiclab.backend.strategy;

import java.math.BigDecimal;

/**
 * Strategy interface for calculating the final price of a marketplace track
 * based on the license type.
 *
 * AJT Syllabus: Unit 8 — Strategy Design Pattern
 */
public interface LicensePricingStrategy {

    /**
     * Calculates the final price based on the track's base price and the license terms.
     *
     * @param basePrice the base price set by the seller
     * @return the final price to charge the buyer
     */
    BigDecimal calculatePrice(BigDecimal basePrice);
}
