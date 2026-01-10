# ⚙️ Installation & Setup Guide

## Complete Setup Instructions

---

## Prerequisites

### Required Software

| Software | Version | Download Link |
|----------|---------|---------------|
| **Java JDK** | 21 (LTS) | https://adoptium.net/ |
| **Maven** | 3.8+ | https://maven.apache.org/download.cgi |
| **MySQL** | 8.0+ | https://dev.mysql.com/downloads/ |
| **Node.js** | 18+ | https://nodejs.org/ |
| **npm** | 9+ | Comes with Node.js |
| **Git** | Latest | https://git-scm.com/ |

### Optional Tools
- **Postman** - API testing
- **MySQL Workbench** - Database management
- **VS Code** - Recommended IDE
- **IntelliJ IDEA** - Alternative Java IDE

---

## 🔧 Step 1: Clone the Repository

```powershell
# Clone the project
git clone https://github.com/Anjan-Kumar-Sahoo/Inventory-Management.git

# Navigate to project directory
cd Inventory-Management
```

---

## 🗄️ Step 2: Database Setup

### 2.1 Install MySQL

1. Download MySQL 8.0 from official website
2. Run installer and follow setup wizard
3. Set root password during installation
4. Remember the password (used in application.properties)

### 2.2 Create Database

**Option A: Using MySQL Command Line**
```sql
mysql -u root -p

CREATE DATABASE inventory_db;
USE inventory_db;
SHOW TABLES; -- Should be empty initially
EXIT;
```

**Option B: Using MySQL Workbench**
1. Open MySQL Workbench
2. Connect to local instance
3. Run SQL query:
   ```sql
   CREATE DATABASE inventory_db;
   ```

### 2.3 Verify Database Connection

```powershell
mysql -u root -p -e "SHOW DATABASES;"
```

You should see `inventory_db` in the list.

---

## ☕ Step 3: Backend Setup (Spring Boot)

### 3.1 Navigate to Backend Directory
```powershell
cd backend
```

### 3.2 Configure Database Credentials

Edit `src/main/resources/application.properties`:

```properties
# Update these lines with your MySQL credentials
spring.datasource.url=jdbc:mysql://localhost:3306/inventory_db
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD

# Keep these settings
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

**⚠️ Important:** Replace `YOUR_MYSQL_PASSWORD` with your actual MySQL root password.

### 3.3 Verify Java Installation

```powershell
java -version
# Should show: openjdk version "21.x.x"

mvn -version
# Should show: Apache Maven 3.x.x
```

If not installed, download from links in Prerequisites section.

### 3.4 Install Dependencies

```powershell
mvn clean install
```

**This will:**
- Download all dependencies
- Compile Java code
- Run tests (if any)
- Create JAR file in `target/` directory

**Expected Output:**
```
[INFO] BUILD SUCCESS
[INFO] Total time: 30-60 seconds
```

### 3.5 Run Backend Server

```powershell
mvn spring-boot:run
```

**Expected Output:**
```
Started InventoryApplication in 8.342 seconds
Tomcat started on port(s): 8080
```

**Verify Backend is Running:**

Open browser and visit:
- http://localhost:8080/api/products (Should return `[]` initially)

### 3.6 Common Backend Issues

**Issue:** `Port 8080 already in use`
```powershell
# Find process using port 8080
netstat -ano | findstr :8080

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

**Issue:** `Communications link failure`
- Check MySQL is running: `services.msc` → MySQL80 → Start
- Verify database credentials in application.properties
- Check database exists: `mysql -u root -p -e "SHOW DATABASES;"`

**Issue:** `Access denied for user 'root'@'localhost'`
- Verify MySQL password in application.properties
- Reset MySQL root password if needed

---

## ⚛️ Step 4: Frontend Setup (React)

### 4.1 Navigate to Frontend Directory

```powershell
# Open a NEW terminal window (keep backend running)
cd frontend
```

### 4.2 Verify Node.js Installation

```powershell
node -v
# Should show: v18.x.x or higher

npm -v
# Should show: 9.x.x or higher
```

### 4.3 Install Dependencies

```powershell
npm install
```

**This will:**
- Download all npm packages
- Create `node_modules/` directory
- Generate `package-lock.json`

**Expected Duration:** 2-5 minutes

### 4.4 Configure API Base URL (Optional)

Edit `src/context/api.ts` if backend is not on `localhost:8080`:

```typescript
const API_BASE_URL = 'http://localhost:8080/api';
```

### 4.5 Run Frontend Development Server

```powershell
npm run dev
```

**Expected Output:**
```
VITE v7.1.3  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**Open Browser:**
- http://localhost:5173

You should see the Inventory Management dashboard!

### 4.6 Common Frontend Issues

**Issue:** `Port 5173 already in use`
```powershell
# Kill process using port 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

**Issue:** `CORS Error` in browser console
- Check backend CORS configuration in `SecurityConfig.java`
- Verify backend is running on port 8080
- Clear browser cache and reload

**Issue:** `Module not found` errors
```powershell
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 🚀 Step 5: Verify Complete Setup

### 5.1 Check Running Servers

**Backend:** http://localhost:8080/api/products  
**Frontend:** http://localhost:5173

### 5.2 Test the Application

1. **Open Frontend:** http://localhost:5173
2. **Add a Supplier:**
   - Go to "Suppliers" tab
   - Click "Add Supplier"
   - Fill form and submit

3. **Add a Product:**
   - Go to "Products" tab
   - Click "Add Product"
   - Select supplier, fill details, submit

4. **Record a Sale:**
   - Go to "Sell Product" tab
   - Select product, enter quantity
   - Click "Sell"
   - Verify stock decreased

5. **Check Dashboard:**
   - Go to "Dashboard"
   - Verify statistics updated
   - Check profit calculations

### 5.3 Test API with Postman (Optional)

**Import Collection:**
1. Open Postman
2. Create new collection "Inventory Management"
3. Add requests:

**Test: Get All Products**
```
GET http://localhost:8080/api/products
```

**Test: Create Supplier**
```
POST http://localhost:8080/api/suppliers
Content-Type: application/json

{
  "name": "Test Supplier",
  "contactPerson": "John Doe",
  "email": "john@test.com",
  "phone": "1234567890"
}
```

---

## 🔄 Development Workflow

### Starting the Application

**Terminal 1 (Backend):**
```powershell
cd backend
mvn spring-boot:run
```

**Terminal 2 (Frontend):**
```powershell
cd frontend
npm run dev
```

### Stopping the Application

- Press `Ctrl + C` in both terminal windows
- Or close terminals

### Making Changes

**Backend Changes:**
- Edit Java files
- Spring Boot auto-reloads (Spring DevTools)
- Or restart: `Ctrl+C` → `mvn spring-boot:run`

**Frontend Changes:**
- Edit React files
- Vite hot-reloads automatically
- See changes instantly in browser

---

## 📦 Production Build

### Backend (JAR File)

```powershell
cd backend
mvn clean package

# Creates: target/inventory-0.0.1-SNAPSHOT.jar

# Run JAR:
java -jar target/inventory-0.0.1-SNAPSHOT.jar
```

### Frontend (Static Files)

```powershell
cd frontend
npm run build

# Creates: dist/ directory with optimized files

# Preview production build:
npm run preview
```

---

## 🐳 Docker Setup (Optional)

### Backend Dockerfile
```dockerfile
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY target/inventory-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Frontend Dockerfile
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: inventory_db
      MYSQL_ROOT_PASSWORD: root
    ports:
      - "3306:3306"
  
  backend:
    build: ./backend
    ports:
      - "8080:8080"
    depends_on:
      - mysql
  
  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    depends_on:
      - backend
```

---

## 🧪 Testing Setup

### Backend Testing
```powershell
cd backend
mvn test
```

### Frontend Testing
```powershell
cd frontend
npm run lint
```

---

## 🔧 IDE Setup

### VS Code Extensions
- Java Extension Pack
- Spring Boot Extension Pack
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- MySQL

### IntelliJ IDEA
- Open `backend/pom.xml` as project
- Enable Maven auto-import
- Configure JDK 21
- Install Lombok plugin

---

## 🆘 Troubleshooting

### General Issues

**Q: Application won't start?**
- Check Java version: `java -version` (must be 21)
- Check MySQL is running: `services.msc`
- Check ports 8080, 5173, 3306 are free

**Q: Database connection failed?**
- Verify MySQL credentials
- Check database exists
- Check MySQL service is running

**Q: CORS errors in browser?**
- Check backend CORS configuration
- Verify frontend URL in SecurityConfig.java

**Q: Build fails?**
- Delete `target/` and rebuild
- Delete `node_modules/` and reinstall
- Check internet connection (for downloading dependencies)

---

## 📞 Support

If you encounter issues:

1. Check error messages carefully
2. Search error in Google/Stack Overflow
3. Check [README.md](../README.md) for additional info
4. Review configuration files
5. Check all prerequisites are installed

---

## ✅ Setup Checklist

- [ ] Java 21 installed and verified
- [ ] Maven installed and verified
- [ ] MySQL 8.0 installed and running
- [ ] Database `inventory_db` created
- [ ] Node.js 18+ installed
- [ ] Backend dependencies installed (`mvn clean install`)
- [ ] Backend running on port 8080
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Frontend running on port 5173
- [ ] Can access http://localhost:5173
- [ ] Can create suppliers and products
- [ ] Can record sales and orders
- [ ] Dashboard shows correct statistics

---

**Setup Time:** 30-45 minutes for first-time setup  
**Last Updated:** January 2026  
**Tested On:** Windows 11, macOS, Ubuntu Linux
