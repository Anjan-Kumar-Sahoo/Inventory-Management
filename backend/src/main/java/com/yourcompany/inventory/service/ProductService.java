package com.yourcompany.inventory.service;

import com.yourcompany.inventory.dto.ProductDTO;
import com.yourcompany.inventory.exception.ResourceNotFoundException;
import com.yourcompany.inventory.model.Product;
import com.yourcompany.inventory.model.Supplier;
import com.yourcompany.inventory.repository.ProductRepository;
import com.yourcompany.inventory.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    public Product createProduct(ProductDTO productDTO) {
    Product product = new Product();
    product.setName(productDTO.getName());
    product.setDescription(productDTO.getDescription());
    product.setPrice(productDTO.getPrice());
    product.setSellingPrice(productDTO.getSellingPrice());
    product.setStock(productDTO.getStock());
    if (productDTO.getSupplierId() != null) {
        Supplier supplier = supplierRepository.findById(productDTO.getSupplierId())
            .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id " + productDTO.getSupplierId()));
        product.setSupplier(supplier);
    }
    return productRepository.save(product);
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public Product updateProduct(Long id, ProductDTO productDetails) {
    Product product = productRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found with id " + id));
    product.setName(productDetails.getName());
    product.setDescription(productDetails.getDescription());
    product.setPrice(productDetails.getPrice());
    product.setSellingPrice(productDetails.getSellingPrice());
    product.setStock(productDetails.getStock());
    if (productDetails.getSupplierId() != null) {
        Supplier supplier = supplierRepository.findById(productDetails.getSupplierId())
            .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id " + productDetails.getSupplierId()));
        product.setSupplier(supplier);
    }
    return productRepository.save(product);
    }

    @Transactional
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<com.yourcompany.inventory.dto.ProductSaleDTO> getAllProductsForSale() {
        List<Product> products = productRepository.findAll();
        List<com.yourcompany.inventory.dto.ProductSaleDTO> saleDTOs = new java.util.ArrayList<>();
        for (Product product : products) {
            com.yourcompany.inventory.dto.ProductSaleDTO dto = new com.yourcompany.inventory.dto.ProductSaleDTO();
            dto.setId(product.getId());
            dto.setName(product.getName());
            dto.setSellingPrice(product.getSellingPrice());
            dto.setPrice(product.getPrice());
            dto.setQuantity(product.getStock());
            saleDTOs.add(dto);
        }
        return saleDTOs;
    }
}


