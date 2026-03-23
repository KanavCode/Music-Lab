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
 * JPA Entity for recording marketplace transactions (purchase ledger).
 * AJT Syllabus: Unit 4 — JDBC/JPA Compliance (ACID transactions)
 */
@Entity
@Table(name = "transactions")
public class TransactionLedgerEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "buyer_id", nullable = false)
    private Long buyerId;

    @Column(name = "track_id", nullable = false)
    private Long trackId;

    @Column(name = "amount_paid", nullable = false, precision = 10, scale = 2)
    private BigDecimal amountPaid;

    @Column(name = "license_type", nullable = false, length = 50)
    private String licenseType;

    @Column(name = "transaction_date", nullable = false, updatable = false)
    private Instant transactionDate;

    // Default constructor (required by JPA)
    public TransactionLedgerEntity() {}

    public TransactionLedgerEntity(Long buyerId, Long trackId, BigDecimal amountPaid, String licenseType) {
        this.buyerId = buyerId;
        this.trackId = trackId;
        this.amountPaid = amountPaid;
        this.licenseType = licenseType;
        this.transactionDate = Instant.now();
    }

    // --- Getters & Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getBuyerId() {
        return buyerId;
    }

    public void setBuyerId(Long buyerId) {
        this.buyerId = buyerId;
    }

    public Long getTrackId() {
        return trackId;
    }

    public void setTrackId(Long trackId) {
        this.trackId = trackId;
    }

    public BigDecimal getAmountPaid() {
        return amountPaid;
    }

    public void setAmountPaid(BigDecimal amountPaid) {
        this.amountPaid = amountPaid;
    }

    public String getLicenseType() {
        return licenseType;
    }

    public void setLicenseType(String licenseType) {
        this.licenseType = licenseType;
    }

    public Instant getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(Instant transactionDate) {
        this.transactionDate = transactionDate;
    }

    @Override
    public String toString() {
        return "TransactionLedgerEntity{id=" + id + ", buyerId=" + buyerId + ", trackId=" + trackId
                + ", amountPaid=" + amountPaid + ", licenseType='" + licenseType
                + "', transactionDate=" + transactionDate + "}";
    }
}
