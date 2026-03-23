package com.musiclab.backend.controller;

import com.musiclab.backend.entity.MarketTrackEntity;
import com.musiclab.backend.entity.TransactionLedgerEntity;
import com.musiclab.backend.exception.InsufficientFundsException;
import com.musiclab.backend.repository.MarketTrackRepository;
import com.musiclab.backend.service.MarketplaceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * REST controller for marketplace operations (buying/renting tracks).
 *
 * AJT Syllabus: Unit 7 — REST API
 */
@RestController
@RequestMapping("/api/v1/market")
public class MarketplaceController {

    private static final Logger logger = LoggerFactory.getLogger(MarketplaceController.class);

    private final MarketplaceService marketplaceService;
    private final MarketTrackRepository marketTrackRepository;

    public MarketplaceController(MarketplaceService marketplaceService,
                                 MarketTrackRepository marketTrackRepository) {
        this.marketplaceService = marketplaceService;
        this.marketTrackRepository = marketTrackRepository;
    }

    /**
     * GET /api/v1/market/tracks
     * Returns all tracks currently listed on the marketplace.
     */
    @GetMapping("/tracks")
    public ResponseEntity<List<MarketTrackEntity>> getAllTracks() {
        logger.info("Fetching all marketplace tracks");
        List<MarketTrackEntity> tracks = marketTrackRepository.findAll();
        return ResponseEntity.ok(tracks);
    }

    /**
     * POST /api/v1/market/buy
     * Executes a marketplace track purchase.
     *
     * Expected JSON body:
     * {
     *   "buyerId": 1,
     *   "trackId": 5,
     *   "licenseType": "standard" | "exclusive"
     * }
     */
    @PostMapping("/buy")
    public ResponseEntity<Map<String, Object>> purchaseTrack(@RequestBody Map<String, Object> payload) {
        logger.info("Purchase request received: {}", payload);

        try {
            Long buyerId = Long.valueOf(payload.get("buyerId").toString());
            Long trackId = Long.valueOf(payload.get("trackId").toString());
            String licenseType = payload.get("licenseType").toString();

            TransactionLedgerEntity transaction = marketplaceService.purchaseTrack(buyerId, trackId, licenseType);

            Map<String, Object> response = Map.of(
                    "status", "success",
                    "message", "Track purchased successfully",
                    "transactionId", transaction.getId(),
                    "amountPaid", transaction.getAmountPaid(),
                    "licenseType", transaction.getLicenseType(),
                    "transactionDate", transaction.getTransactionDate().toString()
            );

            return ResponseEntity.ok(response);

        } catch (InsufficientFundsException e) {
            logger.warn("Purchase declined: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED).body(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ));
        } catch (RuntimeException e) {
            logger.error("Purchase failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ));
        }
    }
}
