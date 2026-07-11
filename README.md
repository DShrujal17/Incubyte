# 🚗 Car Dealership Inventory System

A full-stack Car Dealership Inventory System built using **Spring Boot**, **React**, and **PostgreSQL** following **Test-Driven Development (TDD)** principles.

This project is being developed feature-by-feature using the **Red → Green → Refactor** workflow with frequent Git commits.

---

# 🚀 Tech Stack

## Backend

- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA
- PostgreSQL
- Maven
- JUnit 5
- Mockito
- JWT (jjwt)

## Frontend

- React
- Vite
- React Router DOM
- Axios
- Vitest
- React Testing Library

---

# 📂 Project Structure

```
car-dealership-inventory
│
├── backend
│   ├── src
│   ├── pom.xml
│   └── ...
│
├── frontend
│   ├── src
│   ├── package.json
│   └── ...
│
└── README.md
```

---

# ✨ Features

## Authentication & Role-Based Access Control (RBAC)

### Registration & Seeding
- User Registration (stores role `USER` by default)
- Password Encryption (BCrypt)
- **Default Admin Account Seeding**: The system automatically seeds the following Admin credentials on startup for testing:
  - **Email**: `admin@gmail.com`
  - **Password**: `admin123`
  - **Name**: `adminUser`
  - **Role**: `ADMIN`

### Login & Route Guards
- User Authentication & JWT Token Generation
- JWT Signature Validation and Claim Extraction
- JWT Security Interceptor Filter (`JwtAuthenticationFilter`)
- Custom Authentication Entry Point (Stateless `401 Unauthorized` responses)
- Frontend Login Form with Controlled Inputs
- JWT Token and Role persistence in `localStorage`
- Protected Routes & Navigation Redirects (`useNavigate` guards if token is missing)

### Role-Based Access Control (RBAC)
- Allow read operations (`GET`) for all authenticated users.
- Require `ADMIN` authority for write operations (`POST`, `PUT`, `DELETE`).
- Frontend dynamically shows/hides Add, Edit, and Delete action buttons depending on whether the user's role is `ADMIN` or `USER`.

---

## Vehicle Management (CRUD)
- **Add Vehicle**: Admin can open a form modal to add new vehicles (Make, Model, Year, Price, Status).
- **Edit Vehicle**: Admin can edit details of existing vehicles with inline input validations (e.g. positive price, valid model years).
- **Delete Vehicle**: Admin can delete vehicles via a custom, premium delete confirmation modal.
- **Auto-Refresh**: Table updates automatically in real-time on creation, updating, or deletion.

---

# 🧪 Testing

The project follows **Test-Driven Development (TDD)**.

Backend testing includes:
- Service Unit Tests
- Controller MockMvc Tests
- Mockito Spies & Captors
- JUnit 5 assertions

Frontend testing includes:
- React Testing Library
- Vitest
- Axios Mock Adapters

Every behavior is developed using the TDD lifecycle:

```
RED → GREEN → REFACTOR
```

---

# ⚙️ Backend Setup

## 1 Clone Repository

```bash
git clone <repository-url>
```

## 2 Navigate

```bash
cd car-dealership-inventory/backend
```

## 3 Configure PostgreSQL

Create a PostgreSQL database (e.g. `incubyte`).

Update `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/incubyte
spring.datasource.username=postgres
spring.datasource.password=your_postgres_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

## 4 Run Backend

```bash
.\mvnw.cmd spring-boot:run
```

Backend runs on:
```
http://localhost:8080
```

---

# 💻 Frontend Setup

## 1 Navigate

```bash
cd car-dealership-inventory/frontend
```

## 2 Install Dependencies

```bash
npm install
```

## 3 Run Frontend Dev Server

```bash
npm run dev
```

Frontend runs on:
```
http://localhost:5174  # (or http://localhost:5173 depending on port availability)
```

---

# 🔌 API Endpoints

## Authentication

### Register
```
POST /api/auth/register
```
* **Request**:
```json
{
    "name":"Shrujal",
    "email":"shrujal@gmail.com",
    "password":"password123"
}
```
* **Response**:
```json
{
    "name":"Shrujal",
    "email":"shrujal@gmail.com"
}
```

### Login
```
POST /api/auth/login
```
* **Request**:
```json
{
    "email":"admin@gmail.com",
    "password":"admin123"
}
```
* **Response**:
```json
{
    "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "role":"ADMIN"
}
```

---

## Vehicles (Protected)

### Get All Vehicles
```
GET /api/vehicles
```
*Requires authentication header.*

### Create Vehicle
```
POST /api/vehicles
```
*Requires ADMIN role.*
* **Request**:
```json
{
  "make": "Toyota",
  "model": "Camry",
  "year": 2024,
  "price": 35000.00,
  "status": "AVAILABLE"
}
```

### Update Vehicle
```
PUT /api/vehicles/{id}
```
*Requires ADMIN role.*

### Delete Vehicle
```
DELETE /api/vehicles/{id}
```
*Requires ADMIN role.*

---

# 📈 Current Progress

## Backend
- [x] Registration
- [x] Login (JWT)
- [x] Seed Default Admin (`admin@gmail.com` / `admin123`)
- [x] Vehicle CRUD
- [ ] Purchase Vehicle
- [ ] Restock Vehicle

## Frontend
- [x] Registration & Login
- [x] Dashboard Routing Guards
- [x] Vehicle CRUD List
- [x] Interactive Add/Edit Form Modals
- [x] Custom Delete Confirmation Modal
- [x] Role-based UI visibility checks

---

# 📋 Future Improvements
- Vehicle Search & Dynamic Filtering (Make, Model, Category, Price)
- Quantity tracking (Purchase and Restock mechanics)
- Responsive UI Optimization
- Docker Containerization

---

# 🤖 My AI Usage

AI tools used:
- ChatGPT

How AI was used:
- Discussed project architecture.
- Generated initial boilerplate.
- Assisted with strict TDD workflow (RED → GREEN → REFACTOR).
- Helped debug Spring Security configuration, MockMvc filter tests, and CORS configurations.
- Assisted with Vitest, jsdom setup, React Router navigation mocks, and localStorage spy implementations.

Reflection:
AI significantly improved development speed by assisting with framework-specific configurations, test setups, and debugging. All code was developed feature-by-feature using disciplined TDD to ensure full validation coverage.

---

# 👨‍💻 Author

**Shrujal Doshi**  
B.Tech Computer Engineering  
Dharmsinh Desai University  
