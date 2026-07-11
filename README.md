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

## Authentication

### Registration

- User Registration
- Password Encryption (BCrypt)
- Request Validation
- Duplicate Email Validation
- Save User into PostgreSQL
- Frontend Registration Form
- Backend API Integration

### Login

- User Authentication & JWT Token Generation
- JWT Signature Validation and Claim Extraction
- JWT Security Interceptor Filter (`JwtAuthenticationFilter`)
- Custom Authentication Entry Point (Stateless `401 Unauthorized` responses)
- Frontend Login Form with Controlled Inputs
- JWT Token Persistence in `localStorage`
- Protected Routes & Navigation Redirects (`useNavigate`)
- Frontend Error Handling & Login Validation Errors Display

---

## Vehicle Management

- Add Vehicle
- Update Vehicle
- Delete Vehicle
- Search Vehicle
- Purchase Vehicle
- Restock Vehicle

*(Coming Soon)*

---

# 🧪 Testing

The project follows **Test-Driven Development (TDD)**.

Backend testing includes:
- Service Unit Tests
- Controller Tests
- Mockito
- JUnit 5

Frontend testing includes:
- React Testing Library
- Vitest

Every behavior is developed using:

```
RED
↓
GREEN
↓
REFACTOR
```

---

# ⚙️ Backend Setup

## 1 Clone Repository

```bash
git clone <repository-url>
```

---

## 2 Navigate

```bash
cd car-dealership-inventory/backend
```

---

## 3 Configure PostgreSQL

Create a PostgreSQL database.

Example:

```
car_dealership
```

Update:

```
src/main/resources/application.properties
```

Example:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/incubyte
spring.datasource.username=postgres
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

---

## 4 Run Backend

```bash
.\mvnw.cmd spring-boot:run
```

Backend runs on

```
http://localhost:8080
```

---

# 💻 Frontend Setup

Navigate

```bash
cd frontend
```

Install dependencies

```bash
npm install
```

Run

```bash
npm run dev
```

Frontend runs on

```
http://localhost:5173
```

---

# 🔌 API Endpoints

## Authentication

### Register

```
POST /api/auth/register
```

Example Request

```json
{
    "name":"Shrujal",
    "email":"shrujal@gmail.com",
    "password":"password123"
}
```

Example Response

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

Example Request

```json
{
    "email":"shrujal@gmail.com",
    "password":"password123"
}
```

Example Response

```json
{
    "message":"Login successful",
    "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

# 📈 Current Progress

## Backend

- [x] Registration
- [x] Login (JWT)
- [ ] Vehicle CRUD
- [ ] Purchase Vehicle
- [ ] Restock Vehicle

---

## Frontend

- [x] Registration
- [x] Login
- [ ] Dashboard
- [ ] Vehicle Management

---

# 📋 Future Improvements

- Vehicle Inventory Dashboard
- Search & Filtering
- Responsive UI
- Docker Support
- Deployment

---

# 🤖 My AI Usage

AI tools used:

- ChatGPT
- Antigravity (Google DeepMind)

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
