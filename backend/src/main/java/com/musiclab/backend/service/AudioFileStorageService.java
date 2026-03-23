package com.musiclab.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

/**
 * Service for storing and retrieving audio files using Java NIO.
 *
 * AJT Syllabus: Unit 2 — Java I/O (modern java.nio.file API)
 */
@Service
public class AudioFileStorageService {

    private static final Logger logger = LoggerFactory.getLogger(AudioFileStorageService.class);

    private final Path storageLocation;

    public AudioFileStorageService(@Value("${musiclab.storage.audio-dir:./storage/audio}") String audioDir) {
        this.storageLocation = Paths.get(audioDir).toAbsolutePath().normalize();
    }

    /**
     * Stores the uploaded audio file to the configured directory with a UUID-based filename.
     * Preserves the original file extension for Content-Type resolution during streaming.
     *
     * @param file the uploaded MultipartFile
     * @return the generated unique filename (UUID + original extension)
     * @throws IOException if the file cannot be written to disk
     */
    public String storeAudioFile(MultipartFile file) throws IOException {
        // Extract original extension
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        // Generate unique filename: UUID + original extension
        String uniqueFilename = UUID.randomUUID().toString() + extension;
        Path targetPath = storageLocation.resolve(uniqueFilename).normalize();

        // Security check: ensure the target path is within the storage directory
        if (!targetPath.startsWith(storageLocation)) {
            throw new IOException("Cannot store file outside the configured storage directory");
        }

        // Copy file to storage using Java NIO (Unit 2)
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        logger.info("Stored audio file: {} ({} bytes) -> {}",
                originalFilename, file.getSize(), uniqueFilename);

        return uniqueFilename;
    }

    /**
     * Loads an audio file from disk as a Spring Resource for HTTP streaming.
     *
     * @param filename the unique filename generated during upload
     * @return the file as a Resource
     * @throws FileNotFoundException if the file does not exist or is not readable
     */
    public Resource loadAudioFileAsResource(String filename) throws FileNotFoundException {
        try {
            Path filePath = storageLocation.resolve(filename).normalize();

            // Security check: ensure the resolved path is within the storage directory
            if (!filePath.startsWith(storageLocation)) {
                throw new FileNotFoundException("File path traversal detected: " + filename);
            }

            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                logger.info("Loading audio file: {}", filename);
                return resource;
            } else {
                throw new FileNotFoundException("Audio file not found or not readable: " + filename);
            }

        } catch (MalformedURLException e) {
            logger.error("Malformed URL for file '{}': {}", filename, e.getMessage());
            throw new FileNotFoundException("Audio file not found: " + filename);
        }
    }
}
