package com.yourcompany.inventory.service;

import com.yourcompany.inventory.model.Product;
import com.yourcompany.inventory.model.ProfitRecord;
import com.yourcompany.inventory.model.Sale;
import com.yourcompany.inventory.repository.ProductRepository;
import com.yourcompany.inventory.repository.ProfitRecordRepository;
import com.yourcompany.inventory.repository.SaleRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class SaleService {

    @Autowired
    private SaleRepository saleRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProfitRecordRepository profitRecordRepository;

    @Transactional
    public double recordSale(List<Map<String, Object>> productsToSell) {
        double totalProfitEarned = 0.0;

        for (Map<String, Object> item : productsToSell) {
            Long productId = item.get("id") instanceof Number ? ((Number) item.get("id")).longValue() : null;
            Integer quantity = item.get("quantity") instanceof Number ? ((Number) item.get("quantity")).intValue() : null;

            if (productId == null || quantity == null) {
                throw new RuntimeException("Invalid sale request: missing product id or quantity");
            }

            Optional<Product> productOptional = productRepository.findById(productId);
            if (productOptional.isEmpty()) {
                throw new RuntimeException("Product not found: id=" + productId);
            }

            Product product = productOptional.get();
            if (product.getStock() < quantity) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }

            // Calculate profit
            double itemSellingPrice = product.getSellingPrice();
            double itemCostPrice = product.getPrice();
            double itemProfit = (itemSellingPrice - itemCostPrice) * quantity;

            totalProfitEarned += itemProfit;

            // Update product stock
            product.setStock(product.getStock() - quantity);
            productRepository.save(product);

            // Record sale for each item (or aggregate if needed)
            Sale sale = new Sale();
            sale.setProductName(product.getName());
            sale.setQuantitySold(quantity);
            sale.setTotalBillAmount(itemSellingPrice * quantity);
            sale.setProfitEarned(itemProfit);
            sale.setTimestamp(LocalDateTime.now());
            saleRepository.save(sale);
        }
        // Save profit record
        ProfitRecord profitRecord = new ProfitRecord();
        profitRecord.setProfit(getTotalProfit());
        profitRecord.setTimestamp(LocalDateTime.now());
        profitRecordRepository.save(profitRecord);
        return totalProfitEarned;
    }

    public double getTotalProfit() {
        return saleRepository.findAll().stream()
                .mapToDouble(Sale::getProfitEarned)
                .sum();
    }

    public ProfitRecord getLatestProfitRecord() {
        return profitRecordRepository.findTopByOrderByTimestampDesc();
    }

    public LocalDateTime resetSales() {
        saleRepository.deleteAll();
        ProfitRecord profitRecord = new ProfitRecord();
        profitRecord.setProfit(0.0);
        profitRecord.setTimestamp(LocalDateTime.now());
        profitRecordRepository.save(profitRecord);
        return profitRecord.getTimestamp();
    }
}


