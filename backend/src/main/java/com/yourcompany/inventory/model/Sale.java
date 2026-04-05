package com.yourcompany.inventory.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity @Data @Getter @Setter
public class Sale {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long saleId;
    private String productName;
    private int quantitySold;
    private double totalBillAmount;
    private double profitEarned;
    private LocalDateTime timestamp;
}