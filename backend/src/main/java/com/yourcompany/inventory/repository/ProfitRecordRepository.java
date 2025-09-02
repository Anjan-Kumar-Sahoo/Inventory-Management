package com.yourcompany.inventory.repository;

import com.yourcompany.inventory.model.ProfitRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfitRecordRepository extends JpaRepository<ProfitRecord, Long> {
    ProfitRecord findTopByOrderByTimestampDesc();
}
