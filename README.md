# 🚗 Car Dealership Inventory System

A full-stack, mobile-responsive Car Dealership Inventory System built using **Spring Boot**, **React**, and **PostgreSQL** following **Test-Driven Development (TDD)** principles.

Developed feature-by-feature using the **Red → Green → Refactor** TDD workflow with frequent, descriptive Git commits.

---

## 🌐 Live Demo (Deployed on Render)

- **Live Web Application (Frontend)**: [https://car-dealership-frontend-iid2.onrender.com](https://car-dealership-frontend-iid2.onrender.com)
- **Backend API**: [https://car-dealership-backend-c7tn.onrender.com](https://car-dealership-backend-c7tn.onrender.com)

> [!NOTE]
> **Default Admin Account** (pre-seeded):
> - **Email**: `admin@gmail.com`
> - **Password**: `admin123`

---

# 🚀 Tech Stack

## Backend
- Java 21
- Spring Boot 4
- Spring Security (JWT Stateless)
- Spring Data JPA + Specifications
- PostgreSQL
- Maven
- JUnit 5 + Mockito
- jjwt (JWT Library)

## Frontend
- React 19 + Vite
- React Router DOM
- Axios
- Vitest + React Testing Library

---

# 📂 Project Structure

```
car-dealership-inventory/
│
├── backend/
│   ├── src/main/java/com/incubyte/cardealership/
│   │   ├── auth/             # JWT auth, login, register
│   │   ├── config/           # Security, JWT filter, DataInitializer
│   │   ├── common/           # GlobalExceptionHandler
│   │   ├── user/             # User entity, Role enum, UserRepository
│   │   └── vehicle/          # Vehicle entity, DTOs, service, controller, exceptions
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── pages/            # Login, Register, Dashboard
│   │   ├── services/         # authService.js, vehicleService.js
│   │   └── tests/            # Vitest test files
│   └── package.json
│
└── README.md
```

---

# ✨ Features

## 🔐 Authentication & Role-Based Access Control (RBAC)

### Registration & Seeding
- User Registration (stores role `USER` by default)
- Password Encryption (BCrypt)
- **Default Admin Account Seeding**: Automatically seeded on startup:
  - **Email**: `admin@gmail.com`
  - **Password**: `admin123`
  - **Name**: `adminUser`
  - **Role**: `ADMIN`

### Login & Route Guards
- JWT Token Generation on Login
- JWT Signature Validation and Claim Extraction
- `JwtAuthenticationFilter` — intercepts every request and sets the Security Context
- Custom Authentication Entry Point (Stateless `401 Unauthorized` responses)
- Frontend Login Form with controlled inputs and error handling
- JWT Token and Role persistence in `localStorage`
- Protected Routes — redirects to `/login` if no valid token

### Role-Based Access Control (RBAC)
- `GET` endpoints accessible to **all authenticated users** (both `USER` and `ADMIN`)
- `POST /purchase` accessible to **all authenticated users**
- `POST /restock`, `POST`, `PUT`, `DELETE` on vehicles restricted to **`ADMIN`** only
- Frontend dynamically shows/hides action buttons based on the user's role

---

## 🚗 Vehicle Management (CRUD) — Admin Only

- **Add Vehicle**: Admin opens a modal form to add vehicles (Make, Model, Year, Price, Category, Quantity, Status)
- **Edit Vehicle**: Admin edits vehicle details with inline validations (positive price, valid year ≥ 1886)
- **Delete Vehicle**: Admin deletes via a custom confirmation modal
- **Auto-Refresh**: Table updates in real-time after every CRUD operation

---

## 🔍 Filter-Wise Vehicle Search & Filtering

- **Sleek Filter-Wise Search Bar**: Features interactive filter pills (`Make`, `Model`, `Category`, `Price Range`, `Advanced`) so users can search filter-by-filter without visual clutter on mobile or desktop.
- Backend uses **JPA Specifications** for case-insensitive, partial-match queries.
- Filters can be combined or used individually via advanced mode.
- **Search** and **Reset** buttons for full control.

---

## 📱 True Responsive Mobile UI & Phone Experience

- **Responsive Card Layout (`≤ 768px`)**: On mobile devices and phones, inventory items and sales records automatically transform into clean, touch-friendly **Vehicle Cards** showing status badges, price, quantity, and full-width action buttons.
- **Desktop Table View (`> 768px`)**: Automatically renders the clean multi-column data table on larger screens.
- **Responsive Navigation & Modals**: All modals, forms, and headers adapt smoothly across mobile, tablet, and desktop viewports.

---

## 🛒 Inventory Management (Purchase & Restock)

### Buy Now (User Role)
- Every authenticated user sees a **"Buy Now"** button on available vehicles
- Purchasing decrements the vehicle's quantity by 1
- When quantity reaches **0**, status is automatically set to **`SOLD`**
- Attempting to purchase a sold-out vehicle returns `400 Bad Request` with a clear error message
- A **toast notification** confirms the action result to the user

### Restock (Admin Role)
- Admins see a **"Restock"** button alongside Edit and Delete
- Clicking opens a modal to enter the quantity to add
- Restocking increases the quantity and automatically changes status back to **`AVAILABLE`** if it was `SOLD`
- Toast notification confirms success

---

## 📊 Sales Tracking & Purchase History
- **My Purchases (User Role)**: Users see a dedicated tab listing all vehicles they have bought, including the purchase price and exact purchase date.
- **Sales History (Admin Role)**: Admins see a master dashboard tab of all sales records made by all users, including the buyer's email, make, model, year, paid price, and timestamp.
- Every successful vehicle purchase automatically logs a permanent `Sale` record in the database.

---

# 🧪 Testing

The entire project follows **TDD (Test-Driven Development)** — every feature starts with a failing test (RED), then implementation (GREEN), then cleanup (REFACTOR).

## Backend — 57 tests
| Test Class | Coverage |
|---|---|
| `AuthControllerTest` | Register, Login, validation errors, role responses |
| `AuthServiceTest` | JWT generation, BCrypt, duplicate email |
| `JwtServiceTest` | Token generation, claim extraction, expiry |
| `JwtAuthenticationFilterTest` | Filter chain, invalid/missing tokens |
| `DataInitializerTest` | Admin seeding on startup |
| `VehicleControllerTest` | All CRUD, Search, Purchase, Restock, RBAC |
| `VehicleServiceTest` | All CRUD, Search, Purchase, Restock, OutOfStock exception |
| `SaleControllerTest` | Security and access rules for personal and global sales history |
| `SaleServiceTest` | User sales filtering, admin master list retrieval |

## Frontend — 24 tests
| Test File | Coverage |
|---|---|
| `authService.test.js` | Login and register API calls with headers |
| `vehicleService.test.js` | All vehicle API calls including purchase and restock |
| `saleService.js` | API endpoints to fetch customer and admin sales |
| `Login.test.jsx` | Form submission, JWT storage, redirect, error display |
| `Register.test.jsx` | Form submission and service call |
| `Dashboard.test.jsx` | Add/Edit/Delete modals, Search, and My Purchases / Sales History tabs |

```
RED → GREEN → REFACTOR
```

---

# 🚀 Quick Start (Docker - Recommended)

The easiest way to run the entire application (PostgreSQL Database, Spring Boot Backend, and React Frontend) is using Docker Compose.

## 1. Clone the repository
```bash
git clone https://github.com/DShrujal17/Incubyte.git
cd car-dealership-inventory
```

## 2. Run with Docker Compose
Ensure Docker Desktop is running on your machine, then execute:
```bash
docker-compose up -d --build
```

That's it! The services will be available at:
* **Frontend**: `http://localhost:1308`
* **Backend API**: `http://localhost:8080`
* **Database**: `localhost:5432`

---

# 🛠️ Manual Setup (Without Docker)

If you prefer to run the services natively instead of using Docker, follow the instructions below.

## Root Level Startup
You can launch both the Spring Boot backend and React dev frontend concurrently using a single command:
```bash
npm install
npm run start
```
*(Requires local PostgreSQL to be configured in `application.properties` first).*

---

# ⚙️ Backend Setup

## 1. Navigate to Backend

```bash
cd car-dealership-inventory/backend
```

## 3. Configure PostgreSQL

Create a PostgreSQL database (e.g. `incubyte`), then update `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/incubyte
spring.datasource.username=postgres
spring.datasource.password=your_postgres_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

> The `vehicles` table requires `category` (VARCHAR) and `quantity` (INTEGER) columns. If migrating from an older schema, run:
> ```sql
> ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS category VARCHAR(255);
> ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 0;
> ```

## 4. Run Backend

```bash
.\mvnw.cmd spring-boot:run
```

Backend runs on: `http://localhost:8080`

## 5. Run Backend Tests

```bash
.\mvnw.cmd test
```

---

# 💻 Frontend Setup

## 1. Navigate to Frontend

```bash
cd car-dealership-inventory/frontend
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Run Dev Server

```bash
npm run dev
```

Frontend runs on: `http://localhost:5174` (or `5173` depending on port availability)

## 4. Run Frontend Tests

```bash
npx vitest run
```

---

# 🔌 API Endpoints

## Authentication

### Register
```
POST /api/auth/register
```
**Request:**
```json
{
  "name": "Shrujal",
  "email": "shrujal@gmail.com",
  "password": "password123"
}
```
**Response:**
```json
{
  "name": "Shrujal",
  "email": "shrujal@gmail.com"
}
```

### Login
```
POST /api/auth/login
```
**Request:**
```json
{
  "email": "admin@gmail.com",
  "password": "admin123"
}
```
**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "ADMIN"
}
```

---

## Vehicles (Protected — require `Authorization: Bearer <token>`)

### Get All Vehicles
```
GET /api/vehicles
```
*Any authenticated user.*

### Search Vehicles
```
GET /api/vehicles/search?make=Toyota&category=Sedan&minPrice=20000&maxPrice=50000
```
*Any authenticated user. All query parameters are optional and combinable.*

### Get Vehicle by ID
```
GET /api/vehicles/{id}
```
*Any authenticated user.*

### Create Vehicle
```
POST /api/vehicles
```
*ADMIN only.*
```json
{
  "make": "Toyota",
  "model": "Camry",
  "year": 2024,
  "price": 35000.00,
  "category": "Sedan",
  "quantity": 10,
  "status": "AVAILABLE"
}
```

### Update Vehicle
```
PUT /api/vehicles/{id}
```
*ADMIN only.*

### Delete Vehicle
```
DELETE /api/vehicles/{id}
```
*ADMIN only.*

### Purchase Vehicle
```
POST /api/vehicles/{id}/purchase
```
*Any authenticated user. Decrements quantity by 1. Auto-sets status to `SOLD` when quantity hits 0. Returns `400` if already out of stock.*

### Restock Vehicle
```
POST /api/vehicles/{id}/restock
```
*ADMIN only.*
```json
{
  "quantity": 10
}
```
*Adds quantity. Auto-sets status to `AVAILABLE` if vehicle was `SOLD`.*

---

# 📈 Current Progress

## Backend ✅
- [x] User Registration with BCrypt
- [x] Login with JWT Generation
- [x] Seed Default Admin (`admin@gmail.com` / `admin123`)
- [x] JWT Stateless Security Filter
- [x] Role-Based Authorization (RBAC)
- [x] Vehicle CRUD (with Category & Quantity)
- [x] Vehicle Search with JPA Specifications
- [x] Purchase Vehicle (auto-SOLD on zero qty)
- [x] Restock Vehicle (auto-AVAILABLE on positive qty)
- [x] OutOfStockException with proper HTTP response

## Frontend ✅
- [x] Registration & Login pages
- [x] Dashboard Routing Guards
- [x] Vehicle Table (Make, Model, Year, Price, Category, Quantity, Status)
- [x] Interactive Add / Edit Form Modals
- [x] Custom Delete Confirmation Modal
- [x] Sleek Filter-Wise Search Bar with Interactive Filter Pills
- [x] True Responsive Mobile Card Layout (`≤ 768px`) & Desktop Table View (`> 768px`)
- [x] Role-based UI (Buy Now for USER, Edit/Restock/Delete for ADMIN)
- [x] Restock Quantity Modal
- [x] Color-coded status badges (green = AVAILABLE, red = SOLD)
- [x] Toast-style action notifications for Purchase & Restock

---

# 👨‍💻 Author

**Shrujal Doshi**
B.Tech Computer Engineering
Dharmsinh Desai University
