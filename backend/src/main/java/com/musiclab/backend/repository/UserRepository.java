package com.musiclab.backend.repository;

import com.musiclab.backend.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA Repository for UserEntity.
 * AJT Syllabus: Unit 8 — DAO Pattern
 */
@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
}
