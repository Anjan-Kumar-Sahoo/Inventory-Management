package com.yourcompany.inventory.service;

import com.yourcompany.inventory.dto.SupplierDTO;
import com.yourcompany.inventory.exception.ResourceNotFoundException;
import com.yourcompany.inventory.model.Supplier;
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

public class SupplierServiceTest {

    @Mock
    private SupplierRepository supplierRepository;

    @InjectMocks
    private SupplierService supplierService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createSupplier_success() {
        SupplierDTO supplierDTO = new SupplierDTO();
        supplierDTO.setName("Test Supplier");
        supplierDTO.setContactInfo("test@example.com");

        Supplier supplier = new Supplier();
        supplier.setId(1L);
        supplier.setName("Test Supplier");
        supplier.setContactInfo("test@example.com");

        when(supplierRepository.save(any(Supplier.class))).thenReturn(supplier);

        Supplier createdSupplier = supplierService.createSupplier(supplierDTO);

        assertNotNull(createdSupplier);
        assertEquals("Test Supplier", createdSupplier.getName());
        verify(supplierRepository, times(1)).save(any(Supplier.class));
    }

    @Test
    void getSupplierById_found() {
        Supplier supplier = new Supplier();
        supplier.setId(1L);
        when(supplierRepository.findById(1L)).thenReturn(Optional.of(supplier));

        Optional<Supplier> foundSupplier = supplierService.getSupplierById(1L);

        assertTrue(foundSupplier.isPresent());
        assertEquals(1L, foundSupplier.get().getId());
    }

    @Test
    void getSupplierById_notFound() {
        when(supplierRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<Supplier> foundSupplier = supplierService.getSupplierById(1L);

        assertFalse(foundSupplier.isPresent());
    }

    @Test
    void updateSupplier_success() {
        SupplierDTO supplierDTO = new SupplierDTO();
        supplierDTO.setName("Updated Supplier");
        supplierDTO.setContactInfo("updated@example.com");

        Supplier existingSupplier = new Supplier();
        existingSupplier.setId(1L);
        existingSupplier.setName("Old Supplier");

        when(supplierRepository.findById(1L)).thenReturn(Optional.of(existingSupplier));
        when(supplierRepository.save(any(Supplier.class))).thenReturn(existingSupplier);

        Supplier updatedSupplier = supplierService.updateSupplier(1L, supplierDTO);

        assertNotNull(updatedSupplier);
        assertEquals("Updated Supplier", updatedSupplier.getName());
        assertEquals("updated@example.com", updatedSupplier.getContactInfo());
    }

    @Test
    void updateSupplier_supplierNotFound() {
        SupplierDTO supplierDTO = new SupplierDTO();
        when(supplierRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> supplierService.updateSupplier(1L, supplierDTO));
    }

    @Test
    void deleteSupplier_success() {
        doNothing().when(supplierRepository).deleteById(1L);

        supplierService.deleteSupplier(1L);

        verify(supplierRepository, times(1)).deleteById(1L);
    }

    @Test
    void getAllSuppliers_success() {
        Supplier supplier1 = new Supplier();
        supplier1.setId(1L);
        Supplier supplier2 = new Supplier();
        supplier2.setId(2L);
        when(supplierRepository.findAll()).thenReturn(Arrays.asList(supplier1, supplier2));

        List<Supplier> suppliers = supplierService.getAllSuppliers();

        assertNotNull(suppliers);
        assertEquals(2, suppliers.size());
    }
}


