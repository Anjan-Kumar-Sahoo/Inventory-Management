package com.yourcompany.inventory.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class ProfitRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private double profit;
    private LocalDateTime timestamp;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public double getProfit() { return profit; }
    public void setProfit(double profit) { this.profit = profit; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
