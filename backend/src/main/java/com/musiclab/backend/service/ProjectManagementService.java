package com.musiclab.backend.service;

import com.musiclab.backend.domain.MusicProject;
import com.musiclab.backend.entity.ProjectEntity;
import com.musiclab.backend.repository.ProjectRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.Instant;

/**
 * Facade service that orchestrates project persistence.
 * Combines the serialization layer (ProjectIioService) with the data access layer
 * (ProjectRepository) under ACID-compliant transactions.
 *
 * AJT Syllabus: Unit 4 — JDBC/JPA (@Transactional), Unit 8 — Facade Pattern
 */
@Service
public class ProjectManagementService {

    private static final Logger logger = LoggerFactory.getLogger(ProjectManagementService.class);

    private final ProjectRepository projectRepository;
    private final ProjectIioService projectIioService;

    public ProjectManagementService(ProjectRepository projectRepository, ProjectIioService projectIioService) {
        this.projectRepository = projectRepository;
        this.projectIioService = projectIioService;
    }

    /**
     * Serializes a MusicProject and saves/updates it in the database within a single transaction.
     *
     * CRITICAL: @Transactional ensures that if serialization succeeds but the DB write fails,
     * the entire operation rolls back — maintaining ACID compliance (Unit 4).
     *
     * @param project the MusicProject domain object to persist
     * @param userId  the ID of the owning user
     * @throws RuntimeException if serialization or persistence fails
     */
    @Transactional
    public void saveProjectState(MusicProject project, Long userId) {
        logger.info("Saving project state: {} (ID: {}) for user: {}", project.getProjectName(), project.getProjectId(), userId);

        try {
            // Step 1: Serialize the MusicProject using Java I/O (Unit 2)
            byte[] serializedData = projectIioService.serializeProject(project);

            // Step 2: Check if this project already exists (upsert logic)
            ProjectEntity entity = projectRepository.findByProjectId(project.getProjectId())
                    .orElse(new ProjectEntity());

            // Step 3: Populate/update entity fields
            entity.setProjectId(project.getProjectId());
            entity.setProjectName(project.getProjectName());
            entity.setUserId(userId);
            entity.setSerializedData(serializedData);

            // Only set createdAt on new entities
            if (entity.getId() == null) {
                entity.setCreatedAt(Instant.now());
            }

            // Step 4: Persist within the transaction boundary
            projectRepository.save(entity);

            logger.info("Project '{}' saved successfully. Serialized size: {} bytes",
                    project.getProjectName(), serializedData.length);

        } catch (IOException e) {
            logger.error("Failed to save project state for '{}': {}", project.getProjectId(), e.getMessage());
            throw new RuntimeException("Failed to serialize and save project: " + project.getProjectId(), e);
        }
    }

    /**
     * Loads a project from the database and deserializes it back into a MusicProject domain object.
     *
     * @param projectId the unique project identifier
     * @return the deserialized MusicProject
     * @throws RuntimeException if the project is not found or deserialization fails
     */
    @Transactional(readOnly = true)
    public MusicProject loadProjectState(String projectId) {
        logger.info("Loading project state for ID: {}", projectId);

        ProjectEntity entity = projectRepository.findByProjectId(projectId)
                .orElseThrow(() -> {
                    logger.error("Project not found: {}", projectId);
                    return new RuntimeException("Project not found: " + projectId);
                });

        try {
            // Deserialize the byte[] back to MusicProject using Java I/O (Unit 2)
            MusicProject project = projectIioService.deserializeProject(entity.getSerializedData());

            logger.info("Project '{}' loaded successfully from {} bytes",
                    project.getProjectName(), entity.getSerializedData().length);

            return project;

        } catch (IOException | ClassNotFoundException e) {
            logger.error("Failed to deserialize project '{}': {}", projectId, e.getMessage());
            throw new RuntimeException("Failed to deserialize project: " + projectId, e);
        }
    }
}
