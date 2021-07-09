package com.hb.remi.myapp.repository;

import com.hb.remi.myapp.domain.Column;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Column entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ColumnRepository extends JpaRepository<Column, Long> {}
