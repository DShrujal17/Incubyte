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

- Coming Soon

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

Every feature is developed using:

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
mvn spring-boot:run
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

---

# 📈 Current Progress

## Backend

- [x] Registration
- [ ] Login (JWT)
- [ ] Vehicle CRUD
- [ ] Purchase Vehicle
- [ ] Restock Vehicle

---

## Frontend

- [x] Registration
- [ ] Login
- [ ] Dashboard
- [ ] Vehicle Management

---

# 📋 Future Improvements

- JWT Authentication
- Role-Based Authorization
- Vehicle Inventory Dashboard
- Search & Filtering
- Responsive UI
- Docker Support
- Deployment

---

# 🤖 My AI Usage

AI tools used:

- ChatGPT

How AI was used:

- Discussed project architecture.
- Generated initial boilerplate.
- Assisted with TDD workflow.
- Helped debug Spring Security and CORS issues.
- Reviewed unit tests.
- Assisted with React frontend structure.
- Suggested improvements while ensuring understanding of the implementation.

Reflection:

AI significantly improved development speed by assisting with repetitive boilerplate, debugging, and explaining framework-specific issues. All generated code was reviewed, modified, tested, and integrated manually to ensure correctness and understanding.

---

# 👨‍💻 Author

**Shrujal Doshi**

B.Tech Computer Engineering

Dharmsinh Desai University
