package com.musiclab.backend.repository;

import com.musiclab.backend.entity.ProjectEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Spring Data JPA Repository for ProjectEntity.
 * AJT Syllabus: Unit 8 — DAO Pattern
 */
@Repository
public interface ProjectRepository extends JpaRepository<ProjectEntity, Long> {

    /**
     * Find a project by its unique string identifier (not the DB-generated Long id).
     *
     * @param projectId the unique project identifier
     * @return the project entity if found
     */
    Optional<ProjectEntity> findByProjectId(String projectId);
}
