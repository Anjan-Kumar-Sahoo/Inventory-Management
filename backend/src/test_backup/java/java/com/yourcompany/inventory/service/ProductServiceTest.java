package com.yourcompany.inventory.service;

import com.yourcompany.inventory.dto.ProductDTO;
import com.yourcompany.inventory.exception.ResourceNotFoundException;
import com.yourcompany.inventory.model.Product;
import com.yourcompany.inventory.model.Supplier;
import com.yourcompany.inventory.repository.ProductRepository;
import com.yourcompany.inventory.repository.SupplierRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private SupplierRepository supplierRepository;

    @InjectMocks
    private ProductService productService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createProduct_success() {
        ProductDTO productDTO = new ProductDTO();
        productDTO.setName("Test Product");
        productDTO.setDescription("Description");
        productDTO.setPrice(10.0);
        productDTO.setStock(100);
        productDTO.setSupplierId(1L);

        Supplier supplier = new Supplier();
        supplier.setId(1L);
        supplier.setName("Test Supplier");

        Product product = new Product();
        product.setId(1L);
        product.setName("Test Product");
        product.setDescription("Description");
        product.setPrice(10.0);
        product.setStock(100);
        product.setSupplier(supplier);

        when(supplierRepository.findById(1L)).thenReturn(Optional.of(supplier));
        when(productRepository.save(any(Product.class))).thenReturn(product);

        Product createdProduct = productService.createProduct(productDTO);

        assertNotNull(createdProduct);
        assertEquals("Test Product", createdProduct.getName());
        assertEquals(1L, createdProduct.getSupplier().getId());
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    void createProduct_supplierNotFound() {
        ProductDTO productDTO = new ProductDTO();
        productDTO.setSupplierId(99L);

        when(supplierRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> productService.createProduct(productDTO));
    }

    @Test
    void getProductById_found() {
        Product product = new Product();
        product.setId(1L);
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        Optional<Product> foundProduct = productService.getProductById(1L);

        assertTrue(foundProduct.isPresent());
        assertEquals(1L, foundProduct.get().getId());
    }

    @Test
    void getProductById_notFound() {
        when(productRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<Product> foundProduct = productService.getProductById(1L);

        assertFalse(foundProduct.isPresent());
    }

    @Test
    void updateProduct_success() {
        ProductDTO productDTO = new ProductDTO();
        productDTO.setName("Updated Product");
        productDTO.setDescription("Updated Description");
        productDTO.setPrice(15.0);
        productDTO.setStock(120);
        productDTO.setSupplierId(1L);

        Supplier supplier = new Supplier();
        supplier.setId(1L);

        Product existingProduct = new Product();
        existingProduct.setId(1L);
        existingProduct.setName("Old Product");

        when(productRepository.findById(1L)).thenReturn(Optional.of(existingProduct));
        when(supplierRepository.findById(1L)).thenReturn(Optional.of(supplier));
        when(productRepository.save(any(Product.class))).thenReturn(existingProduct);

        Product updatedProduct = productService.updateProduct(1L, productDTO);

        assertNotNull(updatedProduct);
        assertEquals("Updated Product", updatedProduct.getName());
        assertEquals(15.0, updatedProduct.getPrice());
        assertEquals(120, updatedProduct.getStock());
        assertEquals(1L, updatedProduct.getSupplier().getId());
    }

    @Test
    void updateProduct_productNotFound() {
        ProductDTO productDTO = new ProductDTO();
        when(productRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> productService.updateProduct(1L, productDTO));
    }

    @Test
    void updateProduct_supplierNotFound() {
        ProductDTO productDTO = new ProductDTO();
        productDTO.setSupplierId(99L);

        Product existingProduct = new Product();
        existingProduct.setId(1L);

        when(productRepository.findById(1L)).thenReturn(Optional.of(existingProduct));
        when(supplierRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> productService.updateProduct(1L, productDTO));
    }

    @Test
    void deleteProduct_success() {
        doNothing().when(productRepository).deleteById(1L);

        productService.deleteProduct(1L);

        verify(productRepository, times(1)).deleteById(1L);
    }

    @Test
    void getAllProducts_success() {
        Product product1 = new Product();
        product1.setId(1L);
        Product product2 = new Product();
        product2.setId(2L);
        when(productRepository.findAll()).thenReturn(Arrays.asList(product1, product2));

        List<Product> products = productService.getAllProducts();

        assertNotNull(products);
        assertEquals(2, products.size());
    }
}


