# 🗄️ Database Schema Documentation

## Database Overview

**Database Name:** `inventory_db`  
**Database Type:** MySQL 8.0  
**Character Set:** UTF-8  
**Collation:** utf8mb4_unicode_ci

---

## Entity-Relationship Diagram (ERD)

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Supplier   │         │   Product    │         │     Sale     │
├──────────────┤         ├──────────────┤         ├──────────────┤
│ id (PK)      │────────<│ id (PK)      │>────────│ id (PK)      │
│ name         │    1:N  │ name         │  N:1    │ product_id   │
│ contactPerson│         │ description  │         │ quantity_sold│
│ email        │         │ price        │         │ total_revenue│
│ phone        │         │ selling_price│         │ profit       │
└──────────────┘         │ stock        │         │ sale_date    │
                         │ supplier_id  │         └──────────────┘
                         └──────────────┘
                                │
                                │ N:1
                                │
                         ┌──────▼───────┐
                         │    Order     │
                         ├──────────────┤
                         │ id (PK)      │
                         │ product_id   │
                         │ quantity     │
                         │ total_cost   │
                         │ order_date   │
                         │ status       │
                         └──────────────┘

┌──────────────┐         ┌──────────────┐
│ ProfitRecord │         │     User     │
├──────────────┤         ├──────────────┤
│ id (PK)      │         │ id (PK)      │
│ profit_amount│         │ username     │
│ date         │         │ password     │
└──────────────┘         │ role         │
                         └──────────────┘
```

---

## Table Schemas

### 1. **Product Table**

```sql
CREATE TABLE product (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DOUBLE NOT NULL,
    selling_price DOUBLE NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    supplier_id BIGINT,
    FOREIGN KEY (supplier_id) REFERENCES supplier(id),
    INDEX idx_supplier_id (supplier_id),
    INDEX idx_name (name),
    CONSTRAINT chk_price CHECK (price >= 0),
    CONSTRAINT chk_selling_price CHECK (selling_price >= 0),
    CONSTRAINT chk_stock CHECK (stock >= 0)
);
```

**Fields:**
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | Unique product identifier |
| name | VARCHAR(255) | NOT NULL | Product name |
| description | TEXT | NULLABLE | Product description |
| price | DOUBLE | NOT NULL, >= 0 | Purchase/cost price |
| selling_price | DOUBLE | NOT NULL, >= 0 | Selling price to customers |
| stock | INT | NOT NULL, DEFAULT 0 | Current stock quantity |
| supplier_id | BIGINT | FK to supplier(id) | Associated supplier |

**Business Rules:**
- Price and selling_price must be non-negative
- Stock cannot be negative
- Selling price typically > price (profit margin)
- Product name is required

**Indexes:**
- Primary key on `id` (clustered)
- Index on `supplier_id` (for joins)
- Index on `name` (for searches)

---

### 2. **Supplier Table**

```sql
CREATE TABLE supplier (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    INDEX idx_name (name),
    CONSTRAINT chk_email CHECK (email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);
```

**Fields:**
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | Unique supplier identifier |
| name | VARCHAR(255) | NOT NULL, UNIQUE | Supplier company name |
| contact_person | VARCHAR(255) | NULLABLE | Contact person name |
| email | VARCHAR(255) | NULLABLE, Email format | Contact email |
| phone | VARCHAR(20) | NULLABLE | Contact phone number |

**Business Rules:**
- Supplier name must be unique
- Cannot delete supplier if products exist
- Email must be valid format (if provided)

**Indexes:**
- Primary key on `id`
- Index on `name` (for searches)

---

### 3. **Sale Table**

```sql
CREATE TABLE sale (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    quantity_sold INT NOT NULL,
    total_revenue DOUBLE NOT NULL,
    profit DOUBLE NOT NULL,
    sale_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE,
    INDEX idx_product_id (product_id),
    INDEX idx_sale_date (sale_date),
    CONSTRAINT chk_quantity_sold CHECK (quantity_sold > 0),
    CONSTRAINT chk_total_revenue CHECK (total_revenue >= 0),
    CONSTRAINT chk_profit CHECK (profit >= 0)
);
```

**Fields:**
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | Unique sale identifier |
| product_id | BIGINT | FK, NOT NULL | Reference to product sold |
| quantity_sold | INT | NOT NULL, > 0 | Quantity sold in transaction |
| total_revenue | DOUBLE | NOT NULL, >= 0 | Total sale amount |
| profit | DOUBLE | NOT NULL, >= 0 | Profit from this sale |
| sale_date | DATETIME | NOT NULL, DEFAULT NOW() | Sale timestamp |

**Business Rules:**
- Quantity sold must be positive
- Product stock is automatically reduced on sale creation
- Profit = (selling_price - cost_price) × quantity_sold
- Cannot sell more than available stock

**Calculated Fields:**
```java
profit = (product.sellingPrice - product.price) * quantitySold
totalRevenue = product.sellingPrice * quantitySold
```

**Indexes:**
- Primary key on `id`
- Index on `product_id` (for joins)
- Index on `sale_date` (for date queries)

**Cascade Behavior:**
- ON DELETE CASCADE - Sales are deleted if product is deleted

---

### 4. **Order Table**

```sql
CREATE TABLE `order` (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    total_cost DOUBLE NOT NULL,
    order_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE,
    INDEX idx_product_id (product_id),
    INDEX idx_order_date (order_date),
    INDEX idx_status (status),
    CONSTRAINT chk_quantity CHECK (quantity > 0),
    CONSTRAINT chk_total_cost CHECK (total_cost >= 0),
    CONSTRAINT chk_status CHECK (status IN ('PENDING', 'COMPLETED', 'CANCELLED', 'DELIVERED'))
);
```

**Fields:**
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | Unique order identifier |
| product_id | BIGINT | FK, NOT NULL | Reference to product ordered |
| quantity | INT | NOT NULL, > 0 | Quantity ordered |
| total_cost | DOUBLE | NOT NULL, >= 0 | Total order cost |
| order_date | DATETIME | NOT NULL, DEFAULT NOW() | Order timestamp |
| status | VARCHAR(50) | NOT NULL, DEFAULT 'PENDING' | Order status |

**Status Values:**
- `PENDING` - Order placed, awaiting processing
- `COMPLETED` - Order fulfilled, stock added
- `CANCELLED` - Order cancelled
- `DELIVERED` - Order delivered to store

**Business Rules:**
- Product stock is increased when order status is 'COMPLETED'
- Quantity must be positive
- Status can only be specific values

**Indexes:**
- Primary key on `id`
- Index on `product_id`
- Index on `order_date`
- Index on `status`

---

### 5. **ProfitRecord Table**

```sql
CREATE TABLE profit_record (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    profit_amount DOUBLE NOT NULL,
    date DATE NOT NULL,
    INDEX idx_date (date),
    CONSTRAINT chk_profit_amount CHECK (profit_amount >= 0)
);
```

**Fields:**
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | Unique record identifier |
| profit_amount | DOUBLE | NOT NULL, >= 0 | Profit amount for the day |
| date | DATE | NOT NULL | Date of profit record |

**Purpose:**
- Historical profit tracking
- Daily profit aggregation
- Analytics and reporting

**Indexes:**
- Primary key on `id`
- Index on `date` (for time-series queries)

---

### 6. **User Table**

```sql
CREATE TABLE user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'USER',
    INDEX idx_username (username),
    CONSTRAINT chk_role CHECK (role IN ('ADMIN', 'USER', 'MANAGER'))
);
```

**Fields:**
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | Unique user identifier |
| username | VARCHAR(255) | NOT NULL, UNIQUE | Login username |
| password | VARCHAR(255) | NOT NULL | Encrypted password |
| role | VARCHAR(50) | NOT NULL, DEFAULT 'USER' | User role |

**Role Values:**
- `ADMIN` - Full system access
- `MANAGER` - Limited management access
- `USER` - Basic read access

**Security:**
- Passwords are encrypted (BCrypt)
- Username must be unique
- Role-based access control (RBAC)

---

## Relationships

### 1. Supplier → Product (One-to-Many)
```java
@OneToMany(mappedBy = "supplier", cascade = CascadeType.ALL)
private List<Product> products;
```
- One supplier can supply many products
- Product cannot exist without a supplier (usually)
- Deleting supplier with products is prevented

### 2. Product → Sale (One-to-Many)
```java
@ManyToOne
@JoinColumn(name = "product_id")
private Product product;
```
- One product can have many sales
- Sale must reference a valid product
- Cascade delete: Sales deleted when product deleted

### 3. Product → Order (One-to-Many)
```java
@ManyToOne
@JoinColumn(name = "product_id")
private Product product;
```
- One product can have many orders
- Order must reference a valid product

---

## Database Configuration

### Application Properties
```properties
# DataSource Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/inventory_db
spring.datasource.username=root
spring.datasource.password=root
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
spring.jpa.properties.hibernate.format_sql=true

# Connection Pool (HikariCP)
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=30000
```

### DDL Auto Strategies
- `update` - Updates schema without dropping data (development)
- `create` - Drops and recreates tables (testing)
- `create-drop` - Creates and drops on app shutdown (testing)
- `validate` - Only validates schema (production)
- `none` - No automatic schema management (production)

---

## Sample Data Queries

### Insert Sample Supplier
```sql
INSERT INTO supplier (name, contact_person, email, phone) 
VALUES ('Tech Suppliers Ltd', 'John Doe', 'john@techsuppliers.com', '+91-9876543210');
```

### Insert Sample Product
```sql
INSERT INTO product (name, description, price, selling_price, stock, supplier_id)
VALUES ('Laptop', 'Dell XPS 15', 80000.00, 95000.00, 10, 1);
```

### Record a Sale
```sql
INSERT INTO sale (product_id, quantity_sold, total_revenue, profit, sale_date)
VALUES (1, 2, 190000.00, 30000.00, NOW());

UPDATE product SET stock = stock - 2 WHERE id = 1;
```

### Create an Order
```sql
INSERT INTO `order` (product_id, quantity, total_cost, order_date, status)
VALUES (1, 50, 4000000.00, NOW(), 'COMPLETED');

UPDATE product SET stock = stock + 50 WHERE id = 1;
```

---

## Optimization Strategies

### 1. **Indexes**
- Primary keys on all tables
- Foreign key indexes for joins
- Search indexes on frequently queried columns (name, date)

### 2. **Connection Pooling**
- HikariCP for efficient connection management
- Max pool size: 10 connections
- Min idle: 5 connections

### 3. **Query Optimization**
- Use JPA projections for read-only queries
- Eager/Lazy loading based on use case
- Batch operations for bulk inserts

### 4. **Caching**
- Second-level cache for static data (suppliers)
- Query result caching for dashboard stats

---

## Database Normalization

**Current Form:** 3NF (Third Normal Form)

- ✅ **1NF:** All attributes are atomic
- ✅ **2NF:** No partial dependencies
- ✅ **3NF:** No transitive dependencies

**Benefits:**
- Minimal data redundancy
- Data integrity maintained
- Efficient updates and deletes

---

## Backup Strategy (Recommended)

```bash
# Daily Backup
mysqldump -u root -p inventory_db > backup_$(date +%Y%m%d).sql

# Restore
mysql -u root -p inventory_db < backup_20260111.sql
```

---

## Migration Scripts (Future)

For production, use Flyway or Liquibase:
```sql
-- V1__initial_schema.sql
-- V2__add_user_table.sql
-- V3__add_indexes.sql
```

---

**Schema Version:** 1.0  
**Last Updated:** January 2026  
**Total Tables:** 6  
**Total Relationships:** 3
