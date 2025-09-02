package com.yourcompany.inventory.service;

import com.yourcompany.inventory.dto.OrderDTO;
import com.yourcompany.inventory.exception.OutOfStockException;
import com.yourcompany.inventory.exception.ResourceNotFoundException;
import com.yourcompany.inventory.model.Order;
import com.yourcompany.inventory.model.Product;
import com.yourcompany.inventory.model.User;
import com.yourcompany.inventory.repository.OrderRepository;
import com.yourcompany.inventory.repository.ProductRepository;
import com.yourcompany.inventory.repository.UserRepository;
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

public class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private OrderService orderService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createOrder_success() {
        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setProductId(1L);
        orderDTO.setUserId(1L);
        orderDTO.setQuantity(5);

        Product product = new Product();
        product.setId(1L);
        product.setName("Test Product");
        product.setStock(10);

        User user = new User();
        user.setId(1L);

        Order order = new Order();
        order.setId(1L);
        order.setProduct(product);
        order.setUser(user);
        order.setQuantity(5);

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        Order createdOrder = orderService.createOrder(orderDTO);

        assertNotNull(createdOrder);
        assertEquals(5, createdOrder.getQuantity());
        assertEquals(5, product.getStock()); // Stock should be reduced
        verify(productRepository, times(1)).save(product);
        verify(orderRepository, times(1)).save(any(Order.class));
    }

    @Test
    void createOrder_productNotFound() {
        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setProductId(99L);

        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> orderService.createOrder(orderDTO));
    }

    @Test
    void createOrder_userNotFound() {
        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setProductId(1L);
        orderDTO.setUserId(99L);

        Product product = new Product();
        product.setId(1L);

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> orderService.createOrder(orderDTO));
    }

    @Test
    void createOrder_outOfStock() {
        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setProductId(1L);
        orderDTO.setUserId(1L);
        orderDTO.setQuantity(15);

        Product product = new Product();
        product.setId(1L);
        product.setName("Test Product");
        product.setStock(10);

        User user = new User();
        user.setId(1L);

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        assertThrows(OutOfStockException.class, () -> orderService.createOrder(orderDTO));
    }

    @Test
    void getOrderById_found() {
        Order order = new Order();
        order.setId(1L);
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        Optional<Order> foundOrder = orderService.getOrderById(1L);

        assertTrue(foundOrder.isPresent());
        assertEquals(1L, foundOrder.get().getId());
    }

    @Test
    void getOrderById_notFound() {
        when(orderRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<Order> foundOrder = orderService.getOrderById(1L);

        assertFalse(foundOrder.isPresent());
    }

    @Test
    void getAllOrders_success() {
        Order order1 = new Order();
        order1.setId(1L);
        Order order2 = new Order();
        order2.setId(2L);
        when(orderRepository.findAll()).thenReturn(Arrays.asList(order1, order2));

        List<Order> orders = orderService.getAllOrders();

        assertNotNull(orders);
        assertEquals(2, orders.size());
    }
}


