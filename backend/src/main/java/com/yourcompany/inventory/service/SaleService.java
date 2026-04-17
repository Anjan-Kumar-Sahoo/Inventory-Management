package com.yourcompany.inventory.service;

import com.yourcompany.inventory.model.Product;
import com.yourcompany.inventory.model.ProfitRecord;
import com.yourcompany.inventory.model.Sale;
import com.yourcompany.inventory.repository.ProductRepository;
import com.yourcompany.inventory.repository.ProfitRecordRepository;
import com.yourcompany.inventory.repository.SaleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.ArrayList;
import java.util.HashMap;

@Service
public class SaleService {

    @Autowired
    private SaleRepository saleRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProfitRecordRepository profitRecordRepository;

    @Transactional
    public Map<String, Object> recordSale(List<Map<String, Object>> productsToSell) {
        double batchProfitEarned = 0.0;
        List<Product> updatedProducts = new ArrayList<>();

        for (Map<String, Object> item : productsToSell) {
            Long productId = item.get("id") instanceof Number ? ((Number) item.get("id")).longValue() : null;
            Integer quantity = item.get("quantity") instanceof Number ? ((Number) item.get("quantity")).intValue() : null;

            if (productId == null || quantity == null || quantity <= 0) {
                throw new RuntimeException("Invalid sale request: missing product id or invalid quantity");
            }

            // 1. Fetch current price details (Pricing usually needs a point-in-time snapshot)
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found: id=" + productId));

            // 2. Perform Atomic Stock Decrement
            int rowsUpdated = productRepository.decrementStock(productId, quantity);
            if (rowsUpdated == 0) {
                // This means either the ID changed (unlikely) or stock became insufficient between fetch and update
                throw new RuntimeException("Insufficient stock or concurrent update for product: " + product.getName());
            }

            // 3. Calculate profit based on the snapshot we took
            double itemSellingPrice = product.getSellingPrice();
            double itemCostPrice = product.getPrice();
            double itemProfit = (itemSellingPrice - itemCostPrice) * quantity;
            batchProfitEarned += itemProfit;

            // 4. Record the specific sale record
            Sale sale = new Sale();
            sale.setProductName(product.getName());
            sale.setQuantitySold(quantity);
            sale.setTotalBillAmount(itemSellingPrice * quantity);
            sale.setProfitEarned(itemProfit);
            sale.setTimestamp(LocalDateTime.now());
            saleRepository.save(sale);

            // 5. Get the updated product for the response (optional but good for UI)
            product.setStock(product.getStock() - quantity); // Manually sync for response object
            updatedProducts.add(product);
        }

        // 6. Update global profit record efficiently
        updateTotalProfit(batchProfitEarned);
        
        Map<String, Object> response = new HashMap<>();
        response.put("profit", batchProfitEarned);
        response.put("updatedProducts", updatedProducts);
        return response;
    }

    private void updateTotalProfit(double additionalProfit) {
        ProfitRecord latest = profitRecordRepository.findTopByOrderByTimestampDesc();
        double currentTotal = (latest != null) ? latest.getProfit() : 0.0;
        
        ProfitRecord newRecord = new ProfitRecord();
        newRecord.setProfit(currentTotal + additionalProfit);
        newRecord.setTimestamp(LocalDateTime.now());
        profitRecordRepository.save(newRecord);
    }

    public double getTotalProfit() {
        ProfitRecord latest = profitRecordRepository.findTopByOrderByTimestampDesc();
        return (latest != null) ? latest.getProfit() : 0.0;
    }

    public ProfitRecord getLatestProfitRecord() {
        return profitRecordRepository.findTopByOrderByTimestampDesc();
    }

    @Transactional
    public LocalDateTime resetSales() {
        saleRepository.deleteAll();
        // Also clear profit history if resetting everything
        profitRecordRepository.deleteAll();
        
        ProfitRecord profitRecord = new ProfitRecord();
        profitRecord.setProfit(0.0);
        profitRecord.setTimestamp(LocalDateTime.now());
        profitRecordRepository.save(profitRecord);
        return profitRecord.getTimestamp();
    }
}
