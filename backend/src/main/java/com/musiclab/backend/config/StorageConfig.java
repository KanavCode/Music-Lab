package com.musiclab.backend.config;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Ensures the audio storage directory exists on application startup.
 */
@Configuration
public class StorageConfig {

    private static final Logger logger = LoggerFactory.getLogger(StorageConfig.class);

    @Value("${musiclab.storage.audio-dir:./storage/audio}")
    private String audioDir;

    @PostConstruct
    public void init() throws IOException {
        Path storagePath = Paths.get(audioDir).toAbsolutePath().normalize();
        if (!Files.exists(storagePath)) {
            Files.createDirectories(storagePath);
            logger.info("Created audio storage directory: {}", storagePath);
        } else {
            logger.info("Audio storage directory already exists: {}", storagePath);
        }
    }
}
