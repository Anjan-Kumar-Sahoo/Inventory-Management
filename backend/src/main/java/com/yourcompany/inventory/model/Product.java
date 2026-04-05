package com.yourcompany.inventory.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity @Data @Getter @Setter
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private double price;
    private double sellingPrice;
    private int stock;

    @ManyToOne
    @JoinColumn(name = "supplier_id")
    @JsonIgnoreProperties("products")
    private Supplier supplier;

}

