package com.musiclab.backend.repository;

import com.musiclab.backend.entity.TransactionLedgerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA Repository for TransactionLedgerEntity.
 * AJT Syllabus: Unit 8 — DAO Pattern
 */
@Repository
public interface TransactionLedgerRepository extends JpaRepository<TransactionLedgerEntity, Long> {
}
