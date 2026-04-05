package com.yourcompany.inventory.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity @Data @Getter @Setter
public class ProfitRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private double profit;
    private LocalDateTime timestamp;
}
