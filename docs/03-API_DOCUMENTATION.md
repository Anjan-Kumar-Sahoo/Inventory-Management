# 🔌 API Documentation

## REST API Reference

**Base URL:** `http://localhost:8080`  
**Content-Type:** `application/json`  
**CORS Enabled:** Yes (for localhost:5173)

---

## 📦 Product APIs

### 1. Create Product
**Endpoint:** `POST /api/products`

**Description:** Creates a new product in the inventory.

**Request Body:**
```json
{
  "name": "Laptop",
  "description": "Dell XPS 15 - High Performance Laptop",
  "price": 80000.00,
  "sellingPrice": 95000.00,
  "stock": 10,
  "supplierId": 1
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "name": "Laptop",
  "description": "Dell XPS 15 - High Performance Laptop",
  "price": 80000.00,
  "sellingPrice": 95000.00,
  "stock": 10,
  "supplier": {
    "id": 1,
    "name": "Tech Suppliers Ltd"
  }
}
```

---

### 2. Get All Products
**Endpoint:** `GET /api/products`

**Description:** Retrieves all products from inventory.

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "Laptop",
    "description": "Dell XPS 15",
    "price": 80000.00,
    "sellingPrice": 95000.00,
    "stock": 10,
    "supplier": {
      "id": 1,
      "name": "Tech Suppliers Ltd"
    }
  }
]
```

---

### 3. Get Product by ID
**Endpoint:** `GET /api/products/{id}`

**Description:** Retrieves a specific product by ID.

**Path Parameter:**
- `id` (Long) - Product ID

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Laptop",
  "description": "Dell XPS 15",
  "price": 80000.00,
  "sellingPrice": 95000.00,
  "stock": 10,
  "supplier": {
    "id": 1,
    "name": "Tech Suppliers Ltd"
  }
}
```

**Error Response:** `404 Not Found`

---

### 4. Update Product
**Endpoint:** `PUT /api/products/{id}`

**Description:** Updates an existing product.

**Path Parameter:**
- `id` (Long) - Product ID

**Request Body:**
```json
{
  "name": "Laptop - Updated",
  "description": "Dell XPS 15 - Updated Model",
  "price": 82000.00,
  "sellingPrice": 97000.00,
  "stock": 15,
  "supplierId": 1
}
```

**Response:** `200 OK`

---

### 5. Delete Product
**Endpoint:** `DELETE /api/products/{id}`

**Description:** Deletes a product from inventory.

**Path Parameter:**
- `id` (Long) - Product ID

**Response:** `204 No Content`

---

### 6. Get Products for Sale
**Endpoint:** `GET /api/products/sale-info`

**Description:** Retrieves products with minimal info for sales page.

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "Laptop",
    "sellingPrice": 95000.00,
    "stock": 10
  }
]
```

---

## 👥 Supplier APIs

### 1. Create Supplier
**Endpoint:** `POST /api/suppliers`

**Description:** Creates a new supplier.

**Request Body:**
```json
{
  "name": "Tech Suppliers Ltd",
  "contactPerson": "John Doe",
  "email": "john@techsuppliers.com",
  "phone": "+91-9876543210"
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "name": "Tech Suppliers Ltd",
  "contactPerson": "John Doe",
  "email": "john@techsuppliers.com",
  "phone": "+91-9876543210"
}
```

---

### 2. Get All Suppliers
**Endpoint:** `GET /api/suppliers`

**Description:** Retrieves all suppliers.

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "Tech Suppliers Ltd",
    "contactPerson": "John Doe",
    "email": "john@techsuppliers.com",
    "phone": "+91-9876543210"
  }
]
```

---

### 3. Get Supplier by ID
**Endpoint:** `GET /api/suppliers/{id}`

**Description:** Retrieves a specific supplier.

**Path Parameter:**
- `id` (Long) - Supplier ID

**Response:** `200 OK`

**Error Response:** `404 Not Found`

---

### 4. Update Supplier
**Endpoint:** `PUT /api/suppliers/{id}`

**Description:** Updates an existing supplier.

**Request Body:**
```json
{
  "name": "Tech Suppliers Ltd - Updated",
  "contactPerson": "John Doe",
  "email": "john@techsuppliers.com",
  "phone": "+91-9876543210"
}
```

**Response:** `200 OK`

---

### 5. Delete Supplier
**Endpoint:** `DELETE /api/suppliers/{id}`

**Description:** Deletes a supplier (fails if products exist).

**Response:** `204 No Content`

**Error Response:** `400 Bad Request`
```json
{
  "error": "Cannot delete supplier with existing products"
}
```

---

## 💰 Sale APIs

### 1. Create Sale
**Endpoint:** `POST /api/sales`

**Description:** Records a sale and reduces stock automatically.

**Request Body:**
```json
{
  "productId": 1,
  "quantitySold": 2,
  "totalRevenue": 190000.00
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "productId": 1,
  "quantitySold": 2,
  "totalRevenue": 190000.00,
  "profit": 30000.00,
  "saleDate": "2026-01-11T10:30:00"
}
```

**Validation:**
- Stock must be sufficient
- Quantity must be positive
- Product must exist

---

### 2. Get All Sales
**Endpoint:** `GET /api/sales`

**Description:** Retrieves all sales transactions.

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "product": {
      "id": 1,
      "name": "Laptop"
    },
    "quantitySold": 2,
    "totalRevenue": 190000.00,
    "profit": 30000.00,
    "saleDate": "2026-01-11T10:30:00"
  }
]
```

---

### 3. Get Sale by ID
**Endpoint:** `GET /api/sales/{id}`

**Description:** Retrieves a specific sale transaction.

**Response:** `200 OK`

---

### 4. Get Total Profit
**Endpoint:** `GET /api/sales/profit/total`

**Description:** Calculates total profit from all sales.

**Response:** `200 OK`
```json
{
  "totalProfit": 150000.00
}
```

---

## 📋 Order APIs

### 1. Create Order
**Endpoint:** `POST /api/orders`

**Description:** Creates a purchase order and increases stock.

**Request Body:**
```json
{
  "productId": 1,
  "quantity": 50,
  "totalCost": 4000000.00
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "product": {
    "id": 1,
    "name": "Laptop"
  },
  "quantity": 50,
  "totalCost": 4000000.00,
  "orderDate": "2026-01-11T10:30:00",
  "status": "COMPLETED"
}
```

---

### 2. Get All Orders
**Endpoint:** `GET /api/orders`

**Description:** Retrieves all purchase orders.

**Response:** `200 OK`

---

### 3. Get Order by ID
**Endpoint:** `GET /api/orders/{id}`

**Response:** `200 OK`

---

### 4. Update Order Status
**Endpoint:** `PUT /api/orders/{id}/status`

**Request Body:**
```json
{
  "status": "DELIVERED"
}
```

**Response:** `200 OK`

---

## 📊 Dashboard/Analytics APIs

### Get Dashboard Stats
**Endpoint:** `GET /api/dashboard/stats`

**Description:** Retrieves all dashboard statistics.

**Response:** `200 OK`
```json
{
  "totalProducts": 25,
  "totalStock": 500,
  "totalInventoryValue": 5000000.00,
  "totalProfit": 150000.00,
  "lowStockProducts": [
    {
      "id": 3,
      "name": "Mouse",
      "stock": 2
    }
  ],
  "recentSales": [...],
  "recentOrders": [...]
}
```

---

## 🔍 Search & Filter APIs

### Search Products
**Endpoint:** `GET /api/products/search?query={searchTerm}`

**Query Parameter:**
- `query` - Search term for product name/description

**Response:** `200 OK`

---

### Filter by Supplier
**Endpoint:** `GET /api/products/supplier/{supplierId}`

**Path Parameter:**
- `supplierId` - Supplier ID

**Response:** `200 OK`

---

### Low Stock Products
**Endpoint:** `GET /api/products/low-stock?threshold={number}`

**Query Parameter:**
- `threshold` - Stock threshold (default: 10)

**Response:** `200 OK`

---

## 🚨 Error Responses

### Common HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Successful GET/PUT request |
| 201 | Created | Successful POST request |
| 204 | No Content | Successful DELETE request |
| 400 | Bad Request | Validation error or business rule violation |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server-side error |

### Error Response Format
```json
{
  "timestamp": "2026-01-11T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Product not found",
  "path": "/api/products/999"
}
```

---

## 🔒 Security Headers

All API responses include:
```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type
```

---

## 📝 Data Transfer Objects (DTOs)

### ProductDTO
```typescript
interface ProductDTO {
  name: string;
  description: string;
  price: number;
  sellingPrice: number;
  stock: number;
  supplierId: number;
}
```

### SupplierDTO
```typescript
interface SupplierDTO {
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
}
```

### OrderDTO
```typescript
interface OrderDTO {
  productId: number;
  quantity: number;
  totalCost: number;
}
```

### SaleDTO
```typescript
interface SaleDTO {
  productId: number;
  quantitySold: number;
  totalRevenue: number;
}
```

---

## 🧪 Testing with Postman

### Sample Collection Structure:
```
Inventory Management APIs
├── Products
│   ├── Create Product
│   ├── Get All Products
│   ├── Get Product by ID
│   ├── Update Product
│   └── Delete Product
├── Suppliers
│   ├── Create Supplier
│   ├── Get All Suppliers
│   └── Delete Supplier
├── Sales
│   ├── Create Sale
│   └── Get Total Profit
└── Orders
    ├── Create Order
    └── Get All Orders
```

---

## 🎯 API Best Practices Implemented

1. ✅ **RESTful Design** - Proper HTTP methods and status codes
2. ✅ **JSON Format** - Consistent data format
3. ✅ **Error Handling** - Meaningful error messages
4. ✅ **Validation** - Input validation on all endpoints
5. ✅ **CORS** - Proper cross-origin configuration
6. ✅ **Idempotency** - PUT and DELETE are idempotent
7. ✅ **Resource Naming** - Clear, plural resource names
8. ✅ **Status Codes** - Appropriate HTTP status codes

---

**API Version:** v1  
**Last Updated:** January 2026  
**Base URL:** http://localhost:8080
