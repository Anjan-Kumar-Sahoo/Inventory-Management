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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public Order createOrder(OrderDTO orderDTO) {
        Product product = productRepository.findById(orderDTO.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id " + orderDTO.getProductId()));
        User user = userRepository.findById(orderDTO.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + orderDTO.getUserId()));

        if (product.getStock() < orderDTO.getQuantity()) {
            throw new OutOfStockException("Product " + product.getName() + " is out of stock.");
        }
        product.setStock(product.getStock() - orderDTO.getQuantity());
        productRepository.save(product);

        Order order = new Order();
        order.setProduct(product);
        order.setUser(user);
        order.setQuantity(orderDTO.getQuantity());
        order.setOrderDate(LocalDateTime.now());
        return orderRepository.save(order);
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}


