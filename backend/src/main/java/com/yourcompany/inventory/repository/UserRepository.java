package com.yourcompany.inventory.repository;

import com.yourcompany.inventory.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}


