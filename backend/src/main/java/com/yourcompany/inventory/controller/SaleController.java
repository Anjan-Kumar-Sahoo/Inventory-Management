package com.yourcompany.inventory.controller;

import com.yourcompany.inventory.service.SaleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sales")
public class SaleController {

    @Autowired
    private SaleService saleService;

    @PostMapping("/sell")
    public ResponseEntity<?> sellProducts(@RequestBody List<Map<String, Object>> productsToSell) {
        System.out.println("Incoming sale request: " + productsToSell);
        try {
            double profit = saleService.recordSale(productsToSell);
            return ResponseEntity.ok(profit);
        } catch (RuntimeException e) {
            String errorMsg = e.getMessage();
            if (errorMsg != null && errorMsg.contains("Product not found")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", errorMsg));
            } else if (errorMsg != null && errorMsg.contains("Insufficient stock")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", errorMsg));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Invalid sale request: " + errorMsg));
            }
        }
    }

    @GetMapping("/profit")
    public ResponseEntity<?> getTotalProfit() {
        double totalProfit = saleService.getTotalProfit();
        return ResponseEntity.ok(java.util.Collections.singletonMap("profit", totalProfit));
    }

    @DeleteMapping("/reset")
    public ResponseEntity<?> resetSales() {
        LocalDateTime resetTimestamp = saleService.resetSales();
        return ResponseEntity.ok(Map.of("message", "Sales data reset successfully", "reset_timestamp", resetTimestamp));
    }

    @GetMapping("/profit/latest")
    public ResponseEntity<?> getLatestProfitRecord() {
        com.yourcompany.inventory.model.ProfitRecord record = saleService.getLatestProfitRecord();
        if (record == null) {
            return ResponseEntity.ok(java.util.Collections.singletonMap("profit", 0.0));
        }
        return ResponseEntity.ok(Map.of(
            "profit", record.getProfit(),
            "timestamp", record.getTimestamp()
        ));
    }
}


