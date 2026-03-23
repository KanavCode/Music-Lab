package com.musiclab.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * JPA Entity for tracks listed on the marketplace.
 * AJT Syllabus: Unit 4 — JDBC/JPA Compliance
 */
@Entity
@Table(name = "market_tracks")
public class MarketTrackEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id")
    private Long projectId;

    @Column(name = "seller_id", nullable = false)
    private Long sellerId;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(name = "base_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal basePrice;

    @Column(name = "listed_at", nullable = false, updatable = false)
    private Instant listedAt;

    // Default constructor (required by JPA)
    public MarketTrackEntity() {}

    public MarketTrackEntity(Long projectId, Long sellerId, String title, BigDecimal basePrice) {
        this.projectId = projectId;
        this.sellerId = sellerId;
        this.title = title;
        this.basePrice = basePrice;
        this.listedAt = Instant.now();
    }

    // --- Getters & Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public Long getSellerId() {
        return sellerId;
    }

    public void setSellerId(Long sellerId) {
        this.sellerId = sellerId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public BigDecimal getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(BigDecimal basePrice) {
        this.basePrice = basePrice;
    }

    public Instant getListedAt() {
        return listedAt;
    }

    public void setListedAt(Instant listedAt) {
        this.listedAt = listedAt;
    }

    @Override
    public String toString() {
        return "MarketTrackEntity{id=" + id + ", title='" + title + "', basePrice=" + basePrice
                + ", sellerId=" + sellerId + ", listedAt=" + listedAt + "}";
    }
}
