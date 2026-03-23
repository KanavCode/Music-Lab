package com.musiclab.backend.service;

import com.musiclab.backend.domain.MusicProject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;

/**
 * Service responsible for serializing and deserializing MusicProject objects
 * using Java I/O streams (ObjectOutputStream / ObjectInputStream).
 *
 * AJT Syllabus: Unit 2 — Java I/O Compliance
 */
@Service
public class ProjectIioService {

    private static final Logger logger = LoggerFactory.getLogger(ProjectIioService.class);

    /**
     * Serializes a MusicProject into a byte array using ObjectOutputStream.
     *
     * @param project the MusicProject to serialize
     * @return byte array representation of the serialized project
     * @throws IOException if serialization fails
     */
    public byte[] serializeProject(MusicProject project) throws IOException {
        logger.info("Serializing project: {} (ID: {})", project.getProjectName(), project.getProjectId());

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
             ObjectOutputStream oos = new ObjectOutputStream(baos)) {

            oos.writeObject(project);
            oos.flush();

            byte[] serializedData = baos.toByteArray();
            logger.info("Serialization successful. Size: {} bytes", serializedData.length);
            return serializedData;

        } catch (IOException e) {
            logger.error("Failed to serialize project '{}': {}", project.getProjectName(), e.getMessage());
            throw new IOException("Serialization failed for project: " + project.getProjectId(), e);
        }
    }

    /**
     * Deserializes a byte array back into a MusicProject using ObjectInputStream.
     *
     * @param data the byte array to deserialize
     * @return the reconstructed MusicProject object
     * @throws IOException            if deserialization I/O fails
     * @throws ClassNotFoundException if the MusicProject class is not found
     */
    public MusicProject deserializeProject(byte[] data) throws IOException, ClassNotFoundException {
        logger.info("Deserializing project from {} bytes", data.length);

        try (ByteArrayInputStream bais = new ByteArrayInputStream(data);
             ObjectInputStream ois = new ObjectInputStream(bais)) {

            MusicProject project = (MusicProject) ois.readObject();
            logger.info("Deserialization successful. Project: {} (ID: {})",
                    project.getProjectName(), project.getProjectId());
            return project;

        } catch (ClassNotFoundException e) {
            logger.error("Class not found during deserialization: {}", e.getMessage());
            throw new ClassNotFoundException("MusicProject class not found during deserialization", e);
        } catch (IOException e) {
            logger.error("I/O error during deserialization: {}", e.getMessage());
            throw new IOException("Deserialization failed", e);
        }
    }
}
