package com.musiclab.backend.config;

import com.musiclab.backend.entity.MarketTrackEntity;
import com.musiclab.backend.entity.UserEntity;
import com.musiclab.backend.repository.MarketTrackRepository;
import com.musiclab.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

/**
 * Database seeder — populates initial test data on application startup.
 * Only seeds if the database is empty, preventing duplicate data on restarts.
 *
 * AJT Syllabus: Unit 4 — JPA Persistence via Repository pattern (Unit 8)
 */
@Component
@ConditionalOnProperty(name = "musiclab.legacy-seeder.enabled", havingValue = "true", matchIfMissing = false)
public class DatabaseSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseSeeder.class);

    private final UserRepository userRepository;
    private final MarketTrackRepository marketTrackRepository;

    public DatabaseSeeder(UserRepository userRepository, MarketTrackRepository marketTrackRepository) {
        this.userRepository = userRepository;
        this.marketTrackRepository = marketTrackRepository;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            logger.info("[Seeder] Database already contains data — skipping seed.");
            return;
        }

        logger.info("[Seeder] Empty database detected. Seeding test data...");

        // ── Seed User ──────────────────────────────────────────────────────
        UserEntity testUser = new UserEntity("TestProducer", "test@musiclab.com", "hashed_placeholder");
        testUser.setWalletBalance(new BigDecimal("5000.00"));
        userRepository.save(testUser);
        logger.info("[Seeder] Created user: {}", testUser);

        // ── Seed Marketplace Tracks ────────────────────────────────────────
        MarketTrackEntity track1 = new MarketTrackEntity(
                null, testUser.getId(), "Lofi Study Beat", new BigDecimal("29.99"));
        MarketTrackEntity track2 = new MarketTrackEntity(
                null, testUser.getId(), "Cyberpunk Synthwave", new BigDecimal("45.50"));
        MarketTrackEntity track3 = new MarketTrackEntity(
                null, testUser.getId(), "Acoustic Guitar Loop", new BigDecimal("15.00"));

        marketTrackRepository.save(track1);
        marketTrackRepository.save(track2);
        marketTrackRepository.save(track3);

        logger.info("[Seeder] Created 3 marketplace tracks.");
        logger.info("[Seeder] ✅ Database seeding complete. Ready for testing.");
    }
}
