package com.yourcompany.inventory.controller;

import com.yourcompany.inventory.dto.SupplierDTO;
import com.yourcompany.inventory.model.Supplier;
import com.yourcompany.inventory.service.SupplierService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SupplierController.class)
@org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc(addFilters = false)
public class SupplierControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SupplierService supplierService;

    private Supplier supplier;
    private SupplierDTO supplierDTO;

    @BeforeEach
    void setUp() {
        supplier = new Supplier();
        supplier.setId(1L);
        supplier.setName("Test Supplier");
        supplier.setContactInfo("test@example.com");

        supplierDTO = new SupplierDTO();
        supplierDTO.setName("Test Supplier");
        supplierDTO.setContactInfo("test@example.com");
    }

    @Test
    void createSupplier_success() throws Exception {
        when(supplierService.createSupplier(any(SupplierDTO.class))).thenReturn(supplier);

        mockMvc.perform(post("/api/suppliers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Test Supplier\", \"contactInfo\":\"test@example.com\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Supplier"));
    }

    @Test
    void getSupplierById_found() throws Exception {
        when(supplierService.getSupplierById(1L)).thenReturn(Optional.of(supplier));

        mockMvc.perform(get("/api/suppliers/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Supplier"));
    }

    @Test
    void getSupplierById_notFound() throws Exception {
        when(supplierService.getSupplierById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/suppliers/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    void updateSupplier_success() throws Exception {
        when(supplierService.updateSupplier(any(Long.class), any(SupplierDTO.class))).thenReturn(supplier);

        mockMvc.perform(put("/api/suppliers/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Updated Supplier\", \"contactInfo\":\"updated@example.com\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Supplier"));
    }

    @Test
    void deleteSupplier_success() throws Exception {
        mockMvc.perform(delete("/api/suppliers/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void getAllSuppliers_success() throws Exception {
        when(supplierService.getAllSuppliers()).thenReturn(Arrays.asList(supplier));

        mockMvc.perform(get("/api/suppliers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Test Supplier"));
    }
}


