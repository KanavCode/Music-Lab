package com.musiclab.backend.repository;

import com.musiclab.backend.entity.MarketTrackEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA Repository for MarketTrackEntity.
 * AJT Syllabus: Unit 8 — DAO Pattern
 */
@Repository
public interface MarketTrackRepository extends JpaRepository<MarketTrackEntity, Long> {
}
