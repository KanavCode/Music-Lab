package com.musiclab.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

import java.time.Instant;

/**
 * JPA Entity mapped to the 'projects' table.
 * The serializedData field stores the Java-serialized MusicProject as a BLOB (BYTEA in PostgreSQL).
 * AJT Syllabus: Unit 4 — JDBC/JPA Compliance
 */
@Entity
@Table(name = "projects")
public class ProjectEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id", nullable = false, unique = true, length = 100)
    private String projectId;

    @Column(name = "project_name", nullable = false, length = 150)
    private String projectName;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    /**
     * Stores the Java-serialized MusicProject byte array.
     * Maps to PostgreSQL BYTEA (OID large object) via @Lob.
     */
    @Lob
    @Column(name = "serialized_data", nullable = false)
    private byte[] serializedData;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    // Default constructor (required by JPA)
    public ProjectEntity() {}

    public ProjectEntity(String projectId, String projectName, Long userId, byte[] serializedData) {
        this.projectId = projectId;
        this.projectName = projectName;
        this.userId = userId;
        this.serializedData = serializedData;
        this.createdAt = Instant.now();
    }

    // --- Getters & Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public byte[] getSerializedData() {
        return serializedData;
    }

    public void setSerializedData(byte[] serializedData) {
        this.serializedData = serializedData;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "ProjectEntity{id=" + id + ", projectId='" + projectId
                + "', projectName='" + projectName + "', userId=" + userId
                + ", dataSize=" + (serializedData != null ? serializedData.length : 0)
                + " bytes, createdAt=" + createdAt + "}";
    }
}
