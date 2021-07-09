package com.hb.remi.myapp.repository;

import com.hb.remi.myapp.domain.Developer;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Developer entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DeveloperRepository extends JpaRepository<Developer, Long> {}
