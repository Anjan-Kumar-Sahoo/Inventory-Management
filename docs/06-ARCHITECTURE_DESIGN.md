# 🏗️ Architecture & Design

## System Architecture Documentation

---

## 🎯 Architecture Overview

The Inventory Management System follows a **Three-Tier Architecture** pattern, separating concerns into distinct layers for better maintainability, scalability, and testability.

```
┌─────────────────────────────────────────────────────────┐
│                   CLIENT BROWSER                        │
│              (User Interface Layer)                     │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/HTTPS
                     │ REST API Calls
┌────────────────────▼────────────────────────────────────┐
│              PRESENTATION LAYER                          │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │         React Components (TSX)                    │  │
│  │  - Dashboard.tsx  - ProductManager.tsx           │  │
│  │  - SupplierManager.tsx  - SellProduct.tsx        │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │         State Management                          │  │
│  │  - Context API (InventoryContext)                │  │
│  │  - Custom Hooks                                   │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │         API Client (Axios)                        │  │
│  │  - HTTP Requests  - Error Handling               │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │ JSON over HTTP
                     │ Port: 5173 → 8080
┌────────────────────▼────────────────────────────────────┐
│              APPLICATION LAYER                           │
│              (Spring Boot Backend)                       │
│  ┌──────────────────────────────────────────────────┐  │
│  │         REST Controllers                          │  │
│  │  @RestController + @RequestMapping               │  │
│  │  - ProductController  - SupplierController       │  │
│  │  - SaleController     - OrderController          │  │
│  └────────────┬─────────────────────────────────────┘  │
│               │                                          │
│  ┌────────────▼─────────────────────────────────────┐  │
│  │         Service Layer                             │  │
│  │  @Service - Business Logic                       │  │
│  │  - ProductService   - SupplierService            │  │
│  │  - SaleService      - OrderService               │  │
│  └────────────┬─────────────────────────────────────┘  │
│               │                                          │
│  ┌────────────▼─────────────────────────────────────┐  │
│  │         Repository Layer                          │  │
│  │  @Repository - JPA Repositories                  │  │
│  │  - ProductRepository  - SupplierRepository       │  │
│  │  - SaleRepository     - OrderRepository          │  │
│  └────────────┬─────────────────────────────────────┘  │
│               │                                          │
│  ┌────────────▼─────────────────────────────────────┐  │
│  │         Configuration Layer                       │  │
│  │  - SecurityConfig  - WebConfig                   │  │
│  │  - DataSource Config  - CORS Config              │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │ JDBC/JPA
                     │ Hibernate ORM
┌────────────────────▼────────────────────────────────────┐
│                 DATA LAYER                               │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │         MySQL Database                            │  │
│  │  - product    - supplier    - sale               │  │
│  │  - order      - user        - profit_record      │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Connection Pool (HikariCP)                │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 🎨 Design Patterns Used

### 1. **MVC (Model-View-Controller) Pattern**

**Purpose:** Separation of concerns

**Implementation:**
```
Model      → JPA Entities (Product, Supplier, Sale, Order)
View       → React Components (Dashboard, ProductManager)
Controller → Spring REST Controllers (ProductController)
```

**Benefits:**
- ✅ Independent development of layers
- ✅ Easy to test each layer separately
- ✅ Reusable components
- ✅ Clear responsibility boundaries

---

### 2. **Repository Pattern**

**Purpose:** Abstraction over data access

**Implementation:**
```java
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByNameContaining(String name);
    List<Product> findBySupplierId(Long supplierId);
    List<Product> findByStockLessThan(int threshold);
}
```

**Benefits:**
- ✅ Decouples business logic from data access
- ✅ Easy to switch databases
- ✅ Built-in CRUD operations
- ✅ Custom query methods

---

### 3. **DTO (Data Transfer Object) Pattern**

**Purpose:** Decouple API contracts from domain models

**Implementation:**
```java
public class ProductDTO {
    private String name;
    private String description;
    private double price;
    private double sellingPrice;
    private int stock;
    private Long supplierId;
}
```

**Benefits:**
- ✅ API stability (changes to entities don't break API)
- ✅ Security (hide sensitive fields)
- ✅ Performance (send only needed data)
- ✅ Validation at API boundary

---

### 4. **Service Layer Pattern**

**Purpose:** Centralize business logic

**Implementation:**
```java
@Service
public class ProductService {
    @Transactional
    public Product createProduct(ProductDTO dto) {
        // Business logic here
        // Validation, transformation, persistence
    }
}
```

**Benefits:**
- ✅ Reusable business logic
- ✅ Transaction management
- ✅ Clear separation from controllers
- ✅ Easy to unit test

---

### 5. **Dependency Injection Pattern**

**Purpose:** Loose coupling between components

**Implementation:**
```java
@RestController
public class ProductController {
    @Autowired
    private ProductService productService; // Injected by Spring
}
```

**Benefits:**
- ✅ Loose coupling
- ✅ Easy to mock for testing
- ✅ Configuration flexibility
- ✅ Spring manages lifecycle

---

### 6. **Singleton Pattern**

**Purpose:** Single instance of services

**Implementation:**
- Spring beans are singletons by default
- Repositories, Services, Controllers

**Benefits:**
- ✅ Memory efficiency
- ✅ Shared state (if needed)
- ✅ Spring manages lifecycle

---

### 7. **Factory Pattern**

**Purpose:** Object creation abstraction

**Implementation:**
```java
// EntityManager factory (JPA)
// Connection factory (HikariCP)
```

**Benefits:**
- ✅ Encapsulates creation logic
- ✅ Flexible object creation
- ✅ Managed by Spring/JPA

---

### 8. **Observer Pattern (React)**

**Purpose:** State change notifications

**Implementation:**
```typescript
// Context API notifies all subscribed components
const { products, updateProduct } = useInventory();
```

**Benefits:**
- ✅ Reactive UI updates
- ✅ Loose coupling between components
- ✅ Efficient re-rendering

---

## 📦 Package Structure

### Backend Package Organization

```
com.yourcompany.inventory
│
├── InventoryApplication.java        # Main application entry point
│
├── config/                          # Configuration classes
│   ├── SecurityConfig.java          # Security & CORS configuration
│   └── WebConfig.java               # Web MVC configuration
│
├── controller/                      # REST API endpoints
│   ├── ProductController.java       # Product CRUD APIs
│   ├── SupplierController.java      # Supplier CRUD APIs
│   ├── SaleController.java          # Sales APIs
│   └── OrderController.java         # Order APIs
│
├── service/                         # Business logic layer
│   ├── ProductService.java          # Product business logic
│   ├── SupplierService.java         # Supplier business logic
│   ├── SaleService.java             # Sale business logic
│   └── OrderService.java            # Order business logic
│
├── repository/                      # Data access layer
│   ├── ProductRepository.java       # Product data access
│   ├── SupplierRepository.java      # Supplier data access
│   ├── SaleRepository.java          # Sale data access
│   └── OrderRepository.java         # Order data access
│
├── model/                           # JPA Entities (Domain models)
│   ├── Product.java                 # Product entity
│   ├── Supplier.java                # Supplier entity
│   ├── Sale.java                    # Sale entity
│   ├── Order.java                   # Order entity
│   ├── User.java                    # User entity
│   └── ProfitRecord.java            # Profit record entity
│
├── dto/                             # Data Transfer Objects
│   ├── ProductDTO.java              # Product API contract
│   ├── SupplierDTO.java             # Supplier API contract
│   ├── OrderDTO.java                # Order API contract
│   ├── SaleDTO.java                 # Sale API contract
│   └── ProductSaleDTO.java          # Product info for sales
│
└── exception/                       # Custom exceptions
    ├── ResourceNotFoundException.java
    ├── InvalidOperationException.java
    └── GlobalExceptionHandler.java   # Centralized error handling
```

### Frontend Folder Organization

```
src/
│
├── main.tsx                         # Application entry point
├── App.tsx                          # Root component
├── index.css                        # Global styles
│
├── components/                      # React components
│   ├── Dashboard.tsx                # Main dashboard
│   ├── Header.tsx                   # Navigation header
│   ├── ProductManager.tsx           # Product management
│   ├── SupplierManager.tsx          # Supplier management
│   ├── SellProduct.tsx              # Sales interface
│   │
│   ├── common/                      # Reusable components
│   │   ├── StatCard.tsx             # Dashboard stat cards
│   │   └── SearchFilter.tsx         # Search/filter component
│   │
│   ├── products/                    # Product-specific components
│   │   ├── ProductForm.tsx          # Add/Edit product form
│   │   └── ProductTable.tsx         # Product listing table
│   │
│   ├── suppliers/                   # Supplier-specific components
│   │   ├── SupplierForm.tsx         # Add/Edit supplier form
│   │   └── SupplierTable.tsx        # Supplier listing table
│   │
│   └── dashboard/                   # Dashboard components
│       ├── InventoryChart.tsx       # Charts and graphs
│       ├── LowStockAlert.tsx        # Low stock alerts
│       ├── ProfitDisplay.tsx        # Profit statistics
│       └── RecentActivity.tsx       # Recent transactions
│
├── context/                         # Global state management
│   ├── InventoryContext.tsx         # Inventory state & actions
│   └── api.ts                       # API client (Axios)
│
└── types/                           # TypeScript type definitions
    └── inventory.ts                 # Interface definitions
```

---

## 🔄 Data Flow Architecture

### 1. **Create Product Flow**

```
User Action (Frontend)
    │
    ├─> ProductForm.tsx
    │       └─> Collects form data
    │
    ├─> InventoryContext.tsx
    │       └─> createProduct(productDTO)
    │
    ├─> api.ts
    │       └─> POST /api/products
    │
    │   [HTTP Request to Backend]
    │
    ├─> ProductController.java
    │       └─> @PostMapping
    │       └─> Receives ProductDTO
    │
    ├─> ProductService.java
    │       └─> Business logic validation
    │       └─> Get supplier by ID
    │       └─> Create Product entity
    │
    ├─> ProductRepository.java
    │       └─> save(product)
    │
    ├─> Hibernate/JPA
    │       └─> INSERT INTO product
    │
    └─> MySQL Database
            └─> Persists data

Response flows back up the chain:
    Product entity → JSON → React state update → UI refresh
```

### 2. **Record Sale Flow**

```
User Action
    │
    ├─> SellProduct.tsx
    │       └─> Select product, enter quantity
    │
    ├─> InventoryContext.tsx
    │       └─> recordSale(saleDTO)
    │
    ├─> SaleController.java
    │       └─> Validate stock availability
    │
    ├─> SaleService.java
    │       └─> Create Sale entity
    │       └─> Calculate profit
    │       └─> Update product stock
    │
    ├─> @Transactional
    │       └─> BEGIN TRANSACTION
    │       └─> INSERT INTO sale
    │       └─> UPDATE product SET stock = stock - quantity
    │       └─> COMMIT
    │
    └─> Response
            └─> Updated product with new stock
            └─> Sale record with profit
```

---

## 🔐 Security Architecture

### 1. **CORS Configuration**

```java
@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) {
        http.cors(cors -> cors.configurationSource(request -> {
            CorsConfiguration config = new CorsConfiguration();
            config.addAllowedOrigin("http://localhost:5173");
            config.addAllowedMethod("*");
            config.addAllowedHeader("*");
            return config;
        }));
        return http.build();
    }
}
```

**Purpose:**
- Allows frontend (5173) to access backend (8080)
- Restricts access from other origins
- Prevents CSRF attacks

### 2. **Input Validation**

```java
// DTO validation
@NotNull
@Size(min = 1, max = 255)
private String name;

@Min(0)
private double price;
```

**Layers of Validation:**
1. Frontend validation (immediate feedback)
2. DTO validation (API boundary)
3. Business logic validation (service layer)
4. Database constraints (data integrity)

---

## 🎯 Architectural Decisions

### Why Three-Tier Architecture?

**Pros:**
- ✅ Clear separation of concerns
- ✅ Independent scaling (can scale backend separately)
- ✅ Technology flexibility (can swap frontend/backend)
- ✅ Parallel development (frontend and backend teams)
- ✅ Reusable services (APIs can serve mobile apps)

**Cons:**
- ❌ Network overhead (HTTP calls)
- ❌ More complex deployment
- ❌ Requires API design

**Verdict:** Benefits outweigh drawbacks for this use case.

---

### Why Spring Boot?

**Reasons:**
- Enterprise-grade framework
- Auto-configuration reduces boilerplate
- Excellent ecosystem (Security, Data JPA, etc.)
- Production-ready features
- Large community support
- TCS uses Spring in many projects

---

### Why React + TypeScript?

**Reasons:**
- Component-based architecture (reusability)
- Type safety reduces bugs
- Large ecosystem of libraries
- Virtual DOM for performance
- Industry standard for SPAs
- Easy to learn and use

---

### Why MySQL over NoSQL?

**Reasons:**
- Relational data (products → suppliers)
- ACID compliance needed (inventory transactions)
- Complex queries (joins, aggregations)
- Data integrity constraints
- Mature and stable
- Widely used in enterprises

---

## 🔧 Configuration Management

### Environment-Specific Configuration

**Development:**
```properties
spring.jpa.show-sql=true
spring.jpa.hibernate.ddl-auto=update
logging.level.com.yourcompany=DEBUG
```

**Production:**
```properties
spring.jpa.show-sql=false
spring.jpa.hibernate.ddl-auto=validate
logging.level.com.yourcompany=INFO
```

### Externalized Configuration

```bash
# Use environment variables
export DB_URL=jdbc:mysql://prod-server:3306/inventory_db
export DB_USER=prod_user
export DB_PASS=secure_password

# Or use application-{profile}.properties
java -jar app.jar --spring.profiles.active=prod
```

---

## 📊 Performance Considerations

### 1. **Database Optimization**
- Indexed foreign keys
- Connection pooling (HikariCP)
- Lazy loading for collections
- Query optimization (N+1 problem avoided)

### 2. **Backend Optimization**
- @Transactional for atomic operations
- DTO to reduce payload size
- Service layer caching (future)
- Async processing for heavy tasks (future)

### 3. **Frontend Optimization**
- Code splitting (Vite)
- Lazy loading components
- Memoization (useMemo, useCallback)
- Efficient re-renders (React.memo)

---

## 🔮 Scalability Strategy

### Horizontal Scaling
```
Load Balancer
    │
    ├─> Backend Instance 1
    ├─> Backend Instance 2
    └─> Backend Instance 3
            │
            └─> MySQL (Master-Slave replication)
```

### Vertical Scaling
- Increase server resources (CPU, RAM)
- Optimize queries and indexes
- Add caching layer (Redis)

---

## 🎓 Architectural Best Practices

1. ✅ **Single Responsibility** - Each class has one job
2. ✅ **Dependency Inversion** - Depend on abstractions
3. ✅ **Open/Closed Principle** - Open for extension, closed for modification
4. ✅ **DRY (Don't Repeat Yourself)** - Reusable components
5. ✅ **KISS (Keep It Simple)** - Simple, readable code
6. ✅ **Error Handling** - Centralized exception handling
7. ✅ **Logging** - Proper logging for debugging
8. ✅ **Documentation** - Well-documented code and APIs

---

**Architecture Version:** 1.0  
**Last Updated:** January 2026  
**Design Pattern Count:** 8+
