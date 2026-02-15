# **InventoryX - Inventory Automation & PCB Manufacturing Management System**

InventoryX is a full-stack web application designed to automate component-level inventory management and PCB production tracking. The system ensures accurate stock deduction, low-stock detection, procurement trigger generation, and production analytics using a secure and modular architecture.

---

## 🔗 Quick Links 

| 🎥 Video Walkthrough | 📊 Presentation |
|:-------------------:|:---------------:|
| [**Watch Demo**](https://youtu.be/Nh88TpjbzCM) | [**View PPT**](https://www.canva.com/design/DAHBT0eC0mo/tGoZH59Nge2mtfBHd4MXqQ/view?utm_content=DAHBT0eC0mo&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=hb0c094d03a) |

---

## 📌 Overview

InventoryX addresses a common manufacturing challenge: **manual stock tracking and limited visibility into component consumption.**

The system provides:

- Automatic stock deduction during PCB production
- Prevention of negative inventory
- Low-stock detection based on defined thresholds
- Procurement trigger generation
- Component consumption analytics
- Role-based access control
- Structured Excel import and export

The application is built using **React**, **Node.js**, **Express**, and **PostgreSQL** with JWT-based authentication.

---

## 🏗 Architecture

| Layer            | Stack                                                        |
| ---------------- | ------------------------------------------------------------ |
| **Frontend**     | React 19 + Vite + Redux Toolkit + Tailwind CSS + MUI + Recharts |
| **Backend**      | Node.js + Express 5                                          |
| **Database**     | PostgreSQL (UUID-based relational schema, raw SQL via `pg`)  |
| **Auth**         | JWT (Bearer token) + bcrypt                                  |

<img src="DOCS/Simple System Architecture.png" width="600"/>

---

## 🔐 Authentication and Authorization

- User registration and login
- Password hashing using `bcrypt`
- JWT-based authentication
- Protected routes using middleware
- Role-based access (**Admin**, **Employee**)
- Axios interceptor for automatic 401 redirect

---

## 📦 Component Inventory Management

- Add, update, delete, and view components
- Fields: name, part number, description, stock quantity, monthly required quantity, unit, reorder threshold
- Stock adjustments: addition, deduction, correction
- Automatic low-stock detection (20% of monthly requirement)
- Transaction logging in `stock_adjustments`
- Debounced search functionality
- Status indicators: **In Stock**, **Low Stock**, **Out of Stock**

---

## 🧩 PCB Management and BOM Mapping

- Create and manage PCBs with version control
- Map components to PCBs (Bill of Materials)
- Define quantity per component per PCB
- Calculate maximum producible PCBs based on stock
- Prevent production if BOM mapping is missing

---

## 🏭 PCB Production Entry

- Record production runs with PCB, quantity, batch number, date, DC number, and location
- Live validation of component availability
- Block submission if stock is insufficient
- Automatic stock deduction after successful entry
- Consumption tracking stored in database

---

## 🛒 Procurement Trigger Automation

When stock falls below **20%** of the monthly required quantity:

- Component is marked as low stock
- Procurement trigger record is created
- Status lifecycle: `pending` → `ordered` → `received` / `cancelled`
- Admin-level visibility in analytics dashboard

<img src="DOCS/Deduction Logic.png" width="600"/>

---

## 📊 Analytics Dashboard

The analytics dashboard includes the following features:

- KPI summary cards
- Consumption analysis (bar chart + pie chart)
- Top consumed components table
- Low-stock alerts with progress indicators
- PCB production summary
- Procurement status tracking

---

## 📁 Excel Import and Export

The Excel Import & Export module is a **structured data management interface**.

**Import:**

- Component Inventory (`.xlsx`)
- PCB Production Data
- Component Inventory
- PCB Master + BOM Mapping

**Export:**

- Component Inventory Report
- Consumption Report
- Low Stock Report
- PCB Production Report

**Includes:**

- File validation
- Structured modal workflow
- Reusable UI components

---

## 🗂 Project Structure

```
JR-09-Invictus/
├── Backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Route handlers
│   │   ├── middlewares/      # Auth middleware
│   │   ├── models/          # Data models
│   │   ├── routes/          # API route definitions
│   │   ├── services/        # Business logic
│   │   └── utils/           # Utility functions
│   ├── schema.sql           # Database schema
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── components/      # Shared UI components
│   │   ├── constants/       # App config, routes, roles
│   │   ├── features/        # Feature modules
│   │   │   ├── analytics/   # Dashboard & Import/Export
│   │   │   ├── auth/        # Login & Signup
│   │   │   ├── dashboard/   # Main dashboard
│   │   │   ├── employees/   # Employee management
│   │   │   ├── inventory/   # Component inventory
│   │   │   ├── landing/     # Landing page
│   │   │   └── pcb/         # PCB management & production
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API service (Axios)
│   │   └── store/           # Redux store
│   └── package.json
│
├── DOCS/                    # Architecture diagrams & docs
└── README.md
```

---

## 🛠 Technology Stack

### Frontend

| Technology     | Purpose                    |
| -------------- | -------------------------- |
| React 19       | UI framework               |
| Vite           | Build tool                 |
| Redux Toolkit  | State management           |
| Tailwind CSS v4| Utility-first CSS          |
| MUI v7         | Component library          |
| Recharts       | Data visualization         |

### Backend

| Technology | Purpose                    |
| ---------- | -------------------------- |
| Node.js    | Runtime                    |
| Express 5  | Web framework              |
| PostgreSQL | Relational database        |
| `pg`       | Database driver            |
| JWT        | Authentication tokens      |
| bcrypt     | Password hashing           |
| multer     | File upload handling       |
| xlsx       | Excel file processing      |

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd JR-09-Invictus
```

### 2. Install Dependencies

**Backend:**

```bash
cd Backend
npm install
```

**Frontend:**

```bash
cd ../Frontend
npm install
```

---

## 🐘 PostgreSQL Setup

### Create Database

```sql
psql -U postgres
CREATE DATABASE inventoryx;
CREATE USER inventoryx_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE inventoryx TO inventoryx_user;
\q
```

### Run Schema

```bash
cd Backend
psql -U postgres -d inventoryx -f schema.sql
```

### Enable UUID Extension

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

---

## 🔧 Environment Configuration

Create a `.env` file inside `Backend/`:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=inventoryx
DB_USER=postgres
DB_PASSWORD=postgres

JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=1d

CLIENT_URL=http://localhost:5173
```

> ⚠️ Ensure `CLIENT_URL` does **not** include a trailing slash.

---

## ▶️ Running the Application

**Start Backend:**

```bash
cd Backend
npm run dev
```

**Start Frontend:**

```bash
cd Frontend
npm run dev
```

---

## 🔌 API Overview

**Base URL:** `http://localhost:5000/api`

### Public Routes

| Method | Endpoint          | Description       |
| ------ | ----------------- | ----------------- |
| POST   | `/auth/register`  | User registration |
| POST   | `/auth/login`     | User login        |

### Protected Routes

| Module       | Description                     |
| ------------ | ------------------------------- |
| Inventory    | Component CRUD & stock adjust   |
| PCB          | PCB master & BOM management     |
| Production   | Production entry & consumption  |
| Procurement  | Trigger management              |
| Analytics    | Dashboard data endpoints        |
| Employees    | User management (Admin only)    |

All protected routes require:

```
Authorization: Bearer <token>
```

---

## 🧠 Database Design

### Tables

| Table                    | Purpose                          |
| ------------------------ | -------------------------------- |
| `users`                  | User accounts and roles          |
| `components`             | Component master data            |
| `stock_adjustments`      | Stock change log                 |
| `pcbs`                   | PCB master records               |
| `pcb_components`         | BOM mapping (component ↔ PCB)    |
| `pcb_production`         | Production run records           |
| `component_consumption`  | Consumption tracking per run     |
| `procurement_triggers`   | Low-stock procurement alerts     |
| `import_logs`            | Excel import history             |

### Views

| View                              | Purpose                      |
| --------------------------------- | ---------------------------- |
| `v_component_consumption_summary` | Aggregated consumption data  |
| `v_low_stock_components`          | Components below threshold   |
| `v_pcb_production_summary`        | Production statistics        |

> All production operations are **transaction-safe**.

---

## 🛠 Troubleshooting

| Issue                        | Solution                                                         |
| ---------------------------- | ---------------------------------------------------------------- |
| **CORS Issues**              | Ensure `CLIENT_URL` matches frontend URL exactly (no trailing `/`) |
| **Invalid Token**            | Verify `JWT_SECRET` and token expiration                         |
| **Database Connection Fail** | Ensure PostgreSQL is running and credentials are correct         |

---

## 👥 Team Arjuns

| Member | Role |
|--------|------|
| [**Rugved Vichare**](https://github.com/Rugvedv06) | Backend, PPT & Integration |
| [**Shreyash Singh**](https://github.com/ShreyashSingh857) | Backend, Database & Video |
| [**Soham Raorane**](https://github.com/sohamRaorane) | UI/UX Design, Backend & Documentation |
| [**Saman Pandey**](https://github.com/SamanPandey-in) | Frontend & Integration |

---

## 📄 License

This project is licensed under the **MIT License**.

**Built with ❤️ for ISTE VESIT - Invictus Hackathon by Team Arjuns**
