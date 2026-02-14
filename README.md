# JR-09-Invictus

## Backend (Express + Raw PostgreSQL)

The backend now uses `express` + `pg` (no Prisma/ORM) and maps to your existing PostgreSQL schema.

### 1) Environment setup

Create `Backend/.env` from `Backend/.env.example`:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=invictus
DB_USER=postgres
DB_PASSWORD=postgres
DB_SSL=false

JWT_SECRET=change_this_to_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

You can also use `DATABASE_URL` instead of host/port/user/password.

### 2) Run backend

```bash
cd Backend
npm install
npm run dev
```

On startup, backend executes:
- `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`

### 3) pgAdmin connection details

In pgAdmin > Register Server:
- Host name/address: `localhost`
- Port: `5432`
- Maintenance DB: `postgres` (or your DB name)
- Username: `postgres`
- Password: `<your DB password>`

Then create/select database `invictus` (or the name used in `DB_NAME`).

### 4) API Base URL

- `http://localhost:5000/api`

### 5) Implemented API routes

#### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

#### Users
- `GET /api/users`
- `PATCH /api/users/:id`

#### Components
- `GET /api/components`
- `GET /api/components/:id`
- `POST /api/components`
- `PATCH /api/components/:id`
- `DELETE /api/components/:id`
- `POST /api/components/:id/adjust-stock`

#### PCBs + BOM
- `GET /api/pcbs`
- `GET /api/pcbs/:id`
- `POST /api/pcbs`
- `PATCH /api/pcbs/:id`
- `DELETE /api/pcbs/:id`
- `GET /api/pcbs/:id/components`
- `POST /api/pcbs/:id/components`
- `DELETE /api/pcbs/:id/components/:componentId`

#### Production + Consumption
- `GET /api/production`
- `POST /api/production`
- `GET /api/production/consumption`

#### Procurement
- `GET /api/procurement`
- `PATCH /api/procurement/:id`

#### Import logs
- `GET /api/import-logs`
- `POST /api/import-logs`

#### Dashboard / Analytics
- `GET /api/dashboard/stats`
- `GET /api/dashboard/component-consumption-summary`
- `GET /api/dashboard/top-consumed-components`
- `GET /api/dashboard/low-stock-components`
- `GET /api/dashboard/pcb-production-summary`