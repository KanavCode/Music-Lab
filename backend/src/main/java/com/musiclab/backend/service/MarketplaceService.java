package com.musiclab.backend.service;

import com.musiclab.backend.entity.MarketTrackEntity;
import com.musiclab.backend.entity.TransactionLedgerEntity;
import com.musiclab.backend.entity.UserEntity;
import com.musiclab.backend.exception.InsufficientFundsException;
import com.musiclab.backend.repository.MarketTrackRepository;
import com.musiclab.backend.repository.TransactionLedgerRepository;
import com.musiclab.backend.repository.UserRepository;
import com.musiclab.backend.strategy.ExclusiveRightsStrategy;
import com.musiclab.backend.strategy.LicensePricingStrategy;
import com.musiclab.backend.strategy.StandardLeaseStrategy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

/**
 * Transactional service for marketplace operations.
 * Orchestrates track purchases with ACID-compliant wallet deductions.
 *
 * AJT Syllabus: Unit 4 — ACID Transactions (@Transactional),
 *               Unit 8 — Strategy Pattern (license pricing)
 */
@Service
public class MarketplaceService {

    private static final Logger logger = LoggerFactory.getLogger(MarketplaceService.class);

    private final UserRepository userRepository;
    private final MarketTrackRepository marketTrackRepository;
    private final TransactionLedgerRepository transactionLedgerRepository;

    public MarketplaceService(UserRepository userRepository,
                              MarketTrackRepository marketTrackRepository,
                              TransactionLedgerRepository transactionLedgerRepository) {
        this.userRepository = userRepository;
        this.marketTrackRepository = marketTrackRepository;
        this.transactionLedgerRepository = transactionLedgerRepository;
    }

    /**
     * Executes a full marketplace track purchase within a single ACID transaction.
     *
     * CRITICAL: @Transactional ensures atomicity — if ANY step fails (e.g., insufficient funds,
     * DB write error), the entire operation rolls back and the buyer does not lose money.
     *
     * Flow:
     * 1. Fetch Buyer and Track entities
     * 2. Select LicensePricingStrategy based on licenseType → calculate final price
     * 3. Validate buyer's wallet balance >= final price
     * 4. Deduct balance from buyer's wallet
     * 5. Record the transaction in the ledger
     *
     * @param buyerId     the ID of the purchasing user
     * @param trackId     the ID of the marketplace track
     * @param licenseType "standard" or "exclusive"
     * @return the created TransactionLedgerEntity
     * @throws InsufficientFundsException if the buyer cannot afford the track
     * @throws RuntimeException           if the buyer or track is not found
     */
    @Transactional
    public TransactionLedgerEntity purchaseTrack(Long buyerId, Long trackId, String licenseType) {
        logger.info("Processing purchase: buyer={}, track={}, license={}", buyerId, trackId, licenseType);

        // Step 1: Fetch Buyer
        UserEntity buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new RuntimeException("Buyer not found: " + buyerId));

        // Step 1b: Fetch Track
        MarketTrackEntity track = marketTrackRepository.findById(trackId)
                .orElseThrow(() -> new RuntimeException("Track not found: " + trackId));

        // Step 2: Select pricing strategy based on license type (Unit 8 - Strategy Pattern)
        LicensePricingStrategy strategy = resolvePricingStrategy(licenseType);
        BigDecimal finalPrice = strategy.calculatePrice(track.getBasePrice());

        logger.info("License: {}, Base price: {}, Final price: {}", licenseType, track.getBasePrice(), finalPrice);

        // Step 3: Validate wallet balance
        if (buyer.getWalletBalance().compareTo(finalPrice) < 0) {
            throw new InsufficientFundsException(
                    "Insufficient funds. Required: " + finalPrice + ", Available: " + buyer.getWalletBalance());
        }

        // Step 4: Deduct balance from buyer's wallet
        buyer.setWalletBalance(buyer.getWalletBalance().subtract(finalPrice));
        userRepository.save(buyer);

        // Step 5: Create and persist the transaction ledger entry
        TransactionLedgerEntity transaction = new TransactionLedgerEntity(
                buyerId, trackId, finalPrice, licenseType
        );
        transactionLedgerRepository.save(transaction);

        logger.info("Purchase complete. Transaction ID: {}, Amount: {}, New balance: {}",
                transaction.getId(), finalPrice, buyer.getWalletBalance());

        return transaction;
    }

    /**
     * Resolves the appropriate LicensePricingStrategy based on the license type string.
     * AJT Syllabus: Unit 8 — Strategy Pattern
     */
    private LicensePricingStrategy resolvePricingStrategy(String licenseType) {
        return switch (licenseType.toLowerCase()) {
            case "exclusive" -> new ExclusiveRightsStrategy();
            case "standard" -> new StandardLeaseStrategy();
            default -> {
                logger.warn("Unknown license type '{}', falling back to standard", licenseType);
                yield new StandardLeaseStrategy();
            }
        };
    }
}
