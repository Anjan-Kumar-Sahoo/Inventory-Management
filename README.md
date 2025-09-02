
📦 **Inventory Management System**

A full-stack inventory management application built with Spring Boot, MySQL, and React.js. It allows businesses to manage suppliers, products, and stock levels efficiently with features like CRUD operations, real-time updates, and a sell function to track transactions.

---

🚀 **Features**

🔹 **Supplier Management** – Add, update, delete, and view suppliers.

🔹 **Product Management** – Manage products with supplier linkage.

🔹 **Sell Functionality** – Reduce stock automatically when a sale is made.

🔹 **Validation & Error Handling** – Prevent deletion of suppliers with linked products.

🔹 **Frontend-Backend Integration** – REST APIs consumed via React frontend.

🔹 **Database Persistence** – MySQL used for relational data storage.

---

🛠️ **Tech Stack**

**Backend:** Java, Spring Boot, Spring Data JPA, REST APIs  
**Frontend:** React.js, Axios, TypeScript, Tailwind CSS  
**Database:** MySQL  
**Build Tools:** Maven, npm  
**Other:** Git, Postman (for testing APIs)

---

⚙️ **Installation & Setup**

1️⃣ **Clone the Repository**
```powershell
git clone https://github.com/Anjan-Kumar-Sahoo/Inventory-Management.git
cd Inventory-Management
```

2️⃣ **Backend Setup (Spring Boot)**
```powershell
cd backend
mvn spring-boot:run
```
Runs on [http://localhost:8080](http://localhost:8080) by default.

Configure database in `application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/inventory_db
spring.datasource.username=root
spring.datasource.password=yourpassword
```

3️⃣ **Frontend Setup (React)**
```powershell
cd frontend
npm install
npm start
```
Runs on [http://localhost:3000](http://localhost:3000) by default.

---

📊 **Database Schema**

**Supplier Table**
| id | name            | contact_person | email                | phone      | address         |
|----|-----------------|----------------|----------------------|------------|-----------------|
| 1  | Evergreen Foods | Rohit Sharma   | rohit@evergreen.com  | 9812345678 | 101 Park Street |

**Product Table**
| id | name           | description         | price | stock | supplier_id |
|----|----------------|---------------------|-------|-------|-------------|
| 1  | Arabica Coffee | High-altitude beans | 750   | 40    | 1           |

---

📸 **Screenshots**



---

✨ **Future Enhancements**

- 🔐 Role-based authentication (Admin/User)
- 📈 Sales history tracking
- 📤 Export reports (CSV/PDF)
- 🐳 Docker containerization & deployment

---

📌 **Repo**

🔗 [https://github.com/Anjan-Kumar-Sahoo/Inventory-Management](https://github.com/Anjan-Kumar-Sahoo/Inventory-Management)
