package com.yourcompany.inventory.dto;

import com.yourcompany.inventory.model.Product;
import com.yourcompany.inventory.model.Supplier;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data @Getter @Setter
public class OrderDTO {
    private Long id;
    private java.time.LocalDateTime orderDate;
    private int quantity;
    private Long productId;
    private Long userId;
}


